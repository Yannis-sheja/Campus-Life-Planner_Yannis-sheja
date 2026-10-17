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