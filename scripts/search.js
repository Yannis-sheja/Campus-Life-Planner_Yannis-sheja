// Regex search, Highlighting matches and sorting.
// Turns what you type into a regex.

export function compileRegex(text, ignoreCase) {
    if (text === '') return null; 
    const flags = ignoreCase ? 'gi' : 'g'; 
    try {
        return new RegExp(text, flags);
    }catch(error) {
        return null;
    }
}
// Replace some HTML characters so that user text can never be real HTML.

export function  escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export function highlight(text, regex) {
    if (regex === null) return escapeHtml(text);

    let result = '';
    let position = 0;

    for (const match of text.matchAll (regex)) {
        if (match[0] === '') continue;
        result += escapeHtml(text.slice(position, match.index));
        result += '<mark>' + escapeHtml(match[0]) + '</mark>';
        position = match.index + match[0].length;
    }
    return result + escapeHtml(text.slice(position));
}

export function filterRecords(records, regex) {
    if  (regex === null) return records; 

    const kept = [];
    for (const record of records) {
        if (record.title.search(regex) !== -1 || record.tag.search(regex) !== -1) {
            kept.push(record);
        }
    }
    return kept;
}

export function sortRecords(records, sortBy) {
    const copy = records.slice();

    copy.sort(function (a, b) {
        if (sortBy === 'date-asc') return a.dueDate.localeCompare(b.dueDate);
        if (sortBy === 'date-desc') return b.dueDate.localeCompare(a.dueDate);
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'duration-asc') return a.duration - b.duration;
        return b.duration - a.duration; 
    });
    return copy;
}