// For the memory and changes the data to save it or auto save.
import { loadData, saveData } from "./storage.js";

export const state = {
    records: [],
    unit: 'minutes',
    cap: 1200,
    query: '',
    ignoreCase: true,
    sortBy: 'date-desc',
    editId: null,
};
export function saveState() {
    saveData({ records: state.records, unit: state.unit, cap: state.cap});
}

export function loadState() {
    const saved = loadData();
    if ( saved === null || !Array.isArray(saved.records)) return false;
    state.records = saved.records;
    state.unit = saved.unit || 'minutes';
    state.cap = saved.cap || 1200;
    return true;
}

function makeId() {
    let highest = 0;
    for (const record of state.records) {
        const number = Number(record.id.replace(/\D/g, ''));
        if (number > highest) highest = number;
    }
    return 'rec_' + String(highest+1).padStart(4, '0');
}

export function addRecord(values) {
    const now = new Date().toISOString();
    state.record.push({
        id: makeId(),
        title: values.title,
        dueDate: values.dueDate,
        duration: Number(values.duration),
        tag: values.tag,
        createdAt: now,
        updatedAt: now,
    })
    saveState();
}

export function updateRecord() {
    for (const record of state.records) {
        if (record.id === id) {
            record.title = values.title;
            record.dueDate = values.dueDate;
            record.duration = Number(values.duration);
            record.tag = values.tag;
            record.updatedAt = new Data().toISOString();
        }
    }
    saveState();
}

export function deleteRecord() {
    state.records = state.records.filter(function (record) {
        return record.id !== id;
    });
    saveState();
}

export function replaceRecords(newRecords) {
    state.records = newRecords;
    saveState();
}