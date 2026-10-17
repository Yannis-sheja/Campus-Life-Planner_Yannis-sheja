// Draws on the page . They only show what they are given. 
import { highlight, escapeHtml } from './search.js';

function $(id) {
    return document.getElementById(id);
}

function setText(id, text) {
    if ($(id).textContent !== text) $(id).textContent = text;
}

function round(number) {
    return Math.round(number * 100) / 100;
}

export function formatDuration(minutes, unit) {
    if (unit === 'hours') return round(minutes / 60) + ' h';
    return round(minutes) + ' min';
}
// Messages
export function showStatus(text) { setText('status', text); }
export function showError(text) { setText('error', text); }

export function showFieldError(fieldId, message) {
    setText(fieldId + 'Error', message); 
    $(fieldId).setAttribute('aria-invalid', message === '' ? 'false' : 'true');
}

// Table 
function buttonHtml(action, label, extraClass, taskTitle) {
    return '<button type="button" class="btn ' + extraClass + '" data-action="' + action + '"' + 
    ' aria-label="' + label + ' ' + escapeHtml(taskTitle) + '">' + label + '</button>';
}

function viewRowHtml(record, regex, unit) { 
    return '<tr data-id="' + record.id + '">' +
    '<td data-label="Title">' + highlight(record.title, regex) + '</td>' + 
    '<td data-label= "Due date">' + record.dueDate + '</td>' +
    '<td data-label= "Duration">' + formatDuration(record.duration, unit) + '</td>' +
    '<td data-label= "Tag">' + highlight(record.tag, regex) + '</td>' + 
    '<td data-label= "Actions">' + 
    buttonHtml('edit', 'Edit', '', record.title) + ' ' + 
    buttonHtml('delete', 'Delete', 'btn-danger', record.title) + 
    '</td></tr>';
}

function editRowHtml(record) {
    return '<tr data-id="' + record.id + '">' +
    '<td data-label="Title"><input id="edit-title" aria-label="Title" value="' + escapeHtml(record.title) + '"></td>' +
    '<td data-label="Due date"><input id="edit-dueDate" aria-label="Due date" value="' + record.dueDate + '"></td>' +
    '<td data-label="Minutes"><input id="edit-duration" aria-label="Duration in minutes" value="' + record.duration + '"></td>' +
    '<td data-label="Tag"><input id="edit-tag" aria-label="Tag" value="' + escapeHtml(record.tag) + '"></td>' +
    '<td data-label="Actions">' + 
    buttonHtml('save', 'Save', 'btn-primary', record.title) + ' ' +
    buttonHtml('cancel', 'Cancel', '', record.title) +
    '<div id="editError" class="error" role= "alert"></div>' +
    '</td></tr>';
}

export function renderTable(visible, regex, state) {
    let html = '';
    for (const record of visible) {
        if (record.id === state.editId) html += editRowHtml(record);
        else html += viewRowHtml(record, regex, state.unit);
    }
    $('rows').innerHTML = html;

    let emptyText = '';
    if (visible.length === 0 && state.records.length === 0) emptyText = 'No tasks yet. Add your first task below.';
    else if (visible.length === 0) emptyText = 'No tasks match your search.';
    setText('empty', emptyText); 
    
    setText('count', 'Showing' + visible.length + ' of' + state.records.length + ' tasks');
}

// Dashboard
 
export function renderDashboard(stats, state) {
    setText('statCount', String(stats.count));
    setText('statTotal', formatDuration(stats.totalMinutes, state.unit))
    setText('statTop', stats.topTag)
    setText('statWeek', formatDuration(stats.weekMinutes, state.unit))

    let biggest = 1;
    for (const day of stats.days) {
        if (day.minutes > biggest) biggest = day.minutes;
    }

    let chartHtml = '';
    for (const day of stats.days) {
        const percent = (day.minutes / biggest)/100
        chartHtml += '<div class ="bar-row">' + 
        '<span class="bar-label">' + day.date.slice(5) +'</span>' +
        '<div class="bar-track" role="progressbar" aria-label="Planned time on ' + day.date + '"' +
        ' aria-valuemin="0" aria-valuemax="' + biggest + '" aria-valuenow="' + day.minutes + '">' + 
        '<div class="bar-fill" style="width:' + percent + '%"></div></div>' + 
        '<span class="bar-value">' + formatDuration(day.minutes, state.unit) + '</span></div>';
    }
    $('chart').innerHTML = chartHtml;
    
    const left = round(state.cap - stats.weekMinutes); 
    const cap = formatDuration(state.cap, state.unit);
    if (left >= 0) {
        setText('capAssertive', '');
        setText('capPolite', formatDuration(left, state.unit) + ' left of your ' + cap + ' weekly cap.');
        $('capBox').className = 'cap ok'; //green
    }else {
        setText('capPolite', '');
        setText('capAssertive', 'Over your weekly cap by ' + formatDuration(-left, state.unit) + '!');
        $('capBox').className ='cap over'; //red 
    }
}