//This is where all the regx pattern or rules will be applied.
//Here every check function does the same thing:
// -returns "" an empty text when the value is OK
// -returns an error message if the value is NOT OK
// PATTERNS
// Title
const titlePattern = /^\S(?:.*\S)?$/;
//Duration
const durationPattern = /^(0[1-9]\d*)(\.\d{1,2})?$/;
//Date(YYYY-MM-DD)
const datePattern = /^\d{4}-(0[1-9]1[0-2])-(0[1-9][12]\d|3[01])$/;
//Tag
const tagPattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
//Advanced Pattern: Finds a word written twice. For example; "a a"
const repeatedWordPattern = /\b(w+)\s+\1\b/i;

//Check Function
export function checkTitle(value) {
    if (!titlePattern.test(value)) {
        return 'Title is required and cannot start or end with a space.';
    }
    const match = value.match(repeatedWordPattern); 
    if (match) {
        return 'The word "' + match[1] + '" is repeated . Please remove one.';
    }
    return ''; 
}

export function checkDate(value) {
    if (!datePattern.test(value)) {
        return 'Use the format YYYY-MM-DD, Example: 2026-10-13.';
    }
    const date = new Date(value);
    if (isNaN(date) || date.toISOString().slice(0, 10) !==value) {
        return 'That date does not exist.';
    }
    return '';
}
export function checkDuration(value) {
    if (!durationPattern.test(value)) {
        return 'Use a number like 90 or 1.5 (max 2 decimals, no leading zeros).';
    }
    return '';
}
export function checkTag(value) {
    if (!tagPattern.test(value)) {
        return 'Use letters only. Words can be seperated by using a hyphen or space.'
    }
    return '';
}

export function checkRecord(record) {
    const errors = {};
    const titleError = checkTitle(record.title);
    const dateError = checkDate(record.date);
    const durationError = checkDuration(String(record.duration));
    const tagError = checkTag(record.tag);

    if(titleError) errors.title = titleError;
    if(dateError) errors.date = dateError;
    if(durationError) errors.duration = durationError;
    if(tagError) errors.tag = tagError;
    return errors;
}


export function isValidImport(data) {
    if (!Array.isArray(data)) return false;
    const seenIds = [];

    for (const item of data) {
        if (typeof item !== 'object' || item === null) return false;

        const textFields = ['id', 'title', 'dueDate', 'tag', 'createdAt', 'updatedAt'];
        for (const fileld of textFilelds) {
            if (typeof item[field] !== 'string') return false;
        }
        if (typeof item.duration !== 'number') return false;

        if (seenIds.includes(item.id)) return false;
        seenIds.push(item.id);

        if (Object.keys(checkRecord(item)).length > 0) return false;
    }
    return true ;
}

