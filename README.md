### DEMO VIDEO
Here is the link to the video: `https://youtu.be/UG4IOWeXnVk`

### Website Link or live link

Here is the website link: `https://yannis-sheja.github.io/Campus-Life-Planner_Yannis-sheja/`

### Data model
`{ id, title, dueDate, duration (minutes), tag, createdAt, updatedAt }`

### Regex Catalog
| Where | Pattern | Example |
|---|---|---|
| Title | `^\S(?:.*\S)?$` | ` Read` is rejected |
| Title (advanced, back reference) | `\b(\w+)\s+\1\b`| `the the` is rejected |
| Duration | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `90`, `1.5` OK; `007`, `1.555` rejected |
|Due date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2026-10-25` OK; `2026-13-01` rejected |
| Tag | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Part Time` OK; `Study2` rejected |

Double spaces are collapsed automatically, and dates are also checked against the calendar (`2025-02-29` is rejected).

Search examples (title and tag are searched): `^Study`, `\b\d{2}:\d{2}\b` (time like 14:30),
`(lab|report)`, `\b(\w+)\s+\1\b` (repeated word).

### Keyboard map
| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move between links, buttons and fields |
| `Tab` (first press) | Shows the "Skip to main content" link |
| `Enter` / `Space` | Press buttons and links |
| `Enter` in an edit row | Save |
| `Esc` in an edit row | Cancel |
| Arrow keys in a dropdown | Change the sort or unit|

### Accessibility notes 
-Landmarks (`header`, `nav`, `main`, `section`, `footer`) and a correct heading order
-Skip link, visible focus outline, every input has a label
-Errors appear under each field (`aria-invalid` + `aria-describedby`); messages use `role="status"` / `role="alert"`
-Cap message is `polite` under the cap and `assertive` over it
-Focus is moved after edit, cancel and delete so keyboard users do not get lost
-Text colours meet contrast guidelines; animations stop for 'prefers-reduced-motion`

### Run
Modules do not work from `file://`, so start a small server:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`.

### Tests
Open `http://localhost:8000/tests.html`. Every check shows PASS or FAIL, with a summary at the top.

### Project structure
```
index.htm   tests.html   seed.json
styles/main.css
scripts/ main.js   state.js   storage.js   validator.js   search.js   ui.js
```