//Main file listens to what the user does and tell the other files what to do.
import { checkTitle, checkDate, checkDuration, checkTag, checkRecord, 
    isValidImport } from "./validator.js";
import {compileRegex} from "./search.js";
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
    }
}