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
    state.records.push({
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

export function updateRecord(id, values) {
    for (const record of state.records) {
        if (record.id === id) {
            record.title = values.title;
            record.dueDate = values.dueDate;
            record.duration = Number(values.duration);
            record.tag = values.tag;
            record.updatedAt = new Date().toISOString();
        }
    }
    saveState();
}

export function deleteRecord(id) {
    state.records = state.records.filter(function (record) {
        return record.id !== id;
    });
    saveState();
}

export function replaceRecords(newRecords) {
    state.records = newRecords;
    saveState();
}

//Dashboard Numbers
function toIsoDate(date) {
    const month= String(date.getMonth() + 1).padStart(2, '0');
    const day= String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
}

export function calculateStats(records, today = new Date()) {
    let totalMinutes = 0;
    const tagCounts = {};

    for (const record of records) {
        totalMinutes += record.duration;
        tagCounts[record.tag] = (tagCounts[record.tag] || 0) + 1; 
    }

    let topTag = 'None yet';
    let highest = 0;
    for (const tag in tagCounts) {
        if (tagCounts[tag] > highest) {
            highest = tagCounts[tag];
            topTag = tag;
        }
    }

    const days = [];
    for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
        const date =toIsoDate(day);
        let minutes = 0;
        for (const record of records) {
            if(record.dueDate === date) minutes += record.duration;
        }
        days.push({ date: date, minutes: minutes });
    }
    
    let weekMinutes = 0;
    for (const day of days)weekMinutes += day.minutes;

    return { count: records.length, totalMinutes, topTag, days, weekMinutes };
}