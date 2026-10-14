//Main file listens to what the user does and tell the other files what to do.
import { checkTitle, checkDate, checkDuration, checkTag, checkRecord, 
    isValidImport } from "./validator.js";
import {compileRegex, filterRecords} from "./search.js";
import * as ui from "./ui.js";
import { compileRegex } from "./search";

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

        const filtered = filterRecords(state.records, regex);
        const visible = sortRecords(filtered, state.sortBy);
        ui.renderTable(visible, regex, state);
        ui.renderDashboard(calculateStats(state.records),state);
    }
   // Live Validation

    const checkers = {title: checkTitle, dueDate: checkDate, duration: checkDuration, tag: checkTag };

    for (const field of FIELDS) {
        $(field).addEventListener('input', function() {
            const message = checkers[field](collapseSpaces(($field).value));
            ui.showFieldErro(field, message);
        });
    }

}