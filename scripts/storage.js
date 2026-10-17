//It saves and loads data.
const KEY = 'planned:data';

export function loadData() { 
    try {
        return JSON.parse(localStorage.getItem(KEY));
    } catch (error) {
        return null;
    }
}

export function saveData() {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function downloadJson(records) {
    const text = JSON.stringify(records, null, 2);
    const file = new Blob([text], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'planner.json';
    link.click();
}