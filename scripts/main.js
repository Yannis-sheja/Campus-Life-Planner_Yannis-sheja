//Main file listens to what the user does and tell the other files what to do.
import { state, loadState, saveState, addRecord, updateRecord, deleteRecord, 
    replaceRecords, calculateStats } from './state.js';
import { checkTitle, checkDate, checkDuration, checkTag, checkRecord, 
    isValidImport } from "./validator.js";
import { compileRegex, filterRecords, sortRecords } from "./search.js";
import * as ui from "./ui.js";
import { downloadJson } from './storage.js';

function $(id) {
    return document.getElementById(id);
}

const FIELDS = ['title', 'dueDate', 'duration', 'tag'];

function collapseSpaces(text) {
    return text.replace(/\s{2,}/g, ' ');
}

function readFields(prefix) {
    const values = {};
    for (const field of FIELDS) {
        values[field] = collapseSpaces($(prefix + field).value);
    }
    return values;
}

function focusOn(selector) {
    const element = document.querySelector(selector);
    if (element) element.focus();
}

// Redrawing everything
function refresh() {
    const regex = compileRegex(state.query, state.ignoreCase);

    if (state.query !=='' && regex === null) {
        $('searchError').textContent= 'Not a valid regex yet. Showing all tasks.';
    }else { 
        $('searchError').textContent = '';
    }

    const filtered = filterRecords(state.records, regex);
    const visible = sortRecords(filtered, state.sortBy);
    ui.renderTable(visible, regex, state);
    ui.renderDashboard(calculateStats(state.records),state);
    }

// Live Validation

const checkers = {title: checkTitle, dueDate: checkDate, duration: checkDuration, tag: checkTag };

for (const field of FIELDS) {
    $(field).addEventListener('input', function() {
        const message = checkers[field](collapseSpaces($(field).value));
        ui.showFieldError(field, message);
    });
}
// Submit

$('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const values = readFields('');
    const errors = checkRecord(values);

    for (const field of FIELDS) {
        ui.showFieldError(field, errors[field] || '');
    }

    const badFields = Object.keys(errors);
    if (badFields.length > 0) {
        ui.showError('Please fix the highlighted fields.');
        $(badFields[0]).focus();
        return;
    }

    ui.showError('');
    addRecord(values);
    $('taskForm').reset();
    refresh();
    ui.showStatus('Task added');
});

//Search and Sort
$('search').addEventListener('input', function (event) {
    state.query = event.target.value;
    refresh();
});

$('ignoreCase').addEventListener('change', function (event) {
    state.ignoreCase = event.target.checked;
    refresh();
});

$('sortBy').addEventListener('change', function (event) {
    state.sortBy = event.target.value;
    refresh();
});

//for the table buttons
$('rows').addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if ( button === null) return;

    const id = button.closest('tr').dataset.id;
    const action = button.dataset.action;
    const editButton = 'tr[data-id="' + id + '"] [data-action="edit"]';

    if (action === 'edit') {
        state.editId = id;
        refresh();
        focusOn('#edit-title');
    }

    if (action === 'cancel') {
        state.editId = null;
        refresh();
        focusOn(editButton);
    }

    if (action === 'save') {
        const values = readFields('edit-');
        const errors = checkRecord(values);
        if (Object.keys(errors).length > 0) {
            $('editError').textContent = Object.values(errors).join(' ');
            return;
        }
        updateRecord(id, values);
        state.editId = null;
        refresh();
        focusOn(editButton);
        ui.showStatus('Task updated.');
    }

    if (action === 'delete') {
        if (confirm('Delete this task? This cannot be undone.')) {
            deleteRecord(id);
            refresh();
            focusOn('#tasksHeading');
            ui.showStatus('Task deleted.')
        }
    }
});
// Keyboard Shortcuts; 
$('rows').addEventListener('keydown', function (event) {
    if (state.editId === null || event.target.tagName !== 'INPUT') return;
    if (event.key === 'Enter') document.querySelector('[data-action="save"]').click();
    if (event.key === 'Escape') document.querySelector('[data-action="cancel"]').click();
});

//Settings
$('settingsForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const message = checkDuration($('cap').value.trim());
    ui.showFieldError('cap', message);
    if (message !== '')return;
    
    state.unit = $('unit').value;
    state.cap = Number($('cap').value);
    saveState();
    refresh();
    ui.showStatus('Settings saved');
});

//Export and Import
$('export').addEventListener('click', function() {
    downloadJson(state.records);
    ui.showStatus('Exported ' + state.records.length+ ' tasks.');
});

$('import').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!isValidImport(data)) {
            ui.showError('Import failed: the file does not look like planner data.');

        } else if(confirm('Replace your tasks with these ' + data.length + ' imported tasks?')) {
            replaceRecords(data);
            refresh();
            ui.showError('');
            ui.showStatus('Imported ' + data.length + ' tasks.');
        }
    }catch(error) {
        ui.showError('Import failed: that file is not a valid JSON. ');
    }
    event.target.value = '';
});

//Start the app
async function start() {
    const hadSavedData = loadState();

    if (!hadSavedData) {
        try{
            const response = await fetch('seed.json');
            const data = await response.json();
            replaceRecords(data);
        }catch(error) {
            console.error(error);
            ui.showError('Could not load seed.json: ' + error.message);
        }
    }
    $('unit').value = state.unit;
    $('cap').value = state.cap;
    refresh();
}
start();