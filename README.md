### Data model
`{ id, title, dueDate, duration (minutes), tag, createdAt, updatedAt }`

### Regex Catalog
| Where | Pattern | Example |
|---|---|---|
| Title | `^\S(?:.*\S)?$` | ` Read` is rejected |
| Title (advanced, back reference) | `\b(\w+)\s+\1\b`| `the the` is rejected |
| Duration | 