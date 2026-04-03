# Nexus-Uni: Scholar's Command Center

Nexus-Uni is the unified nervous system for a student's technical and academic life. It is designed as a high-density, centralized academic cockpit that offers powerful tools for managing tasks, tracking educational feedback, organizing resources, visualizing knowledge, and now features deep **Focus Modes** to lock into a state of flow.

## Core Features

- **Dashboard:** A central hub showing priority tasks (Priority Hub), upcoming schedule, recent feedback, fast access links to resources, and performance analytics with an interactive chart spanning the layout beautifully across any device viewport length.
- **Focus Modes (New in Try3):** Contextually aware working environments designed to eliminate distractions:
  - **Lecture Mode:** A split-view featuring active class resources alongside a powerful WYSIWYG Rich-Text Editor (Quill.js). Intelligently syncs with your active/simulated scheduled classes.
  - **Deep Work Mode:** A high-fidelity, full-screen rich-text environment dedicated to intense research.
  - **Quick Notes Mode:** A minimalist plain-text scratchpad for high-speed brain dumping.
- **Persistent Note Library Manager:** Both Rich-Text and Plain-Text modes boast a fully functional Note Manager. Create multiple notes per mode, automatically auto-save to `localStorage` (throttled rendering), and individually load or delete them via the interactive sidebar.
- **Task Management:** An advanced task manager that handles items based on priority ("Gravity"). Sort items as Critical, High, Normal, or Low priority via drag-and-drop.
- **Feedback Loop:** A GitHub-style interface for resolving student/professor inquiries or assignments, capable of tracking feedback states (Open, In Progress, Resolved). Features integrated reply threads and customized dropdown status toggles.
- **Knowledge Graph:** A D3.js powered relationship network allowing students to view interconnected concepts across overlapping subjects visually – enabling a more comprehensive understanding of their field.
- **Command Palette:** Quick-access navigation tool invoked via `Cmd+K` enabling lightning-fast maneuvering across views, initiating Focus Modes, or global task creation.
- **True Mobile Responsiveness:** Fully fluid UI featuring stacked, full-width layouts that shift gracefully from ultra-wide desktop monitors down to mobile viewports. Includes dynamic flex-wrapping toolbars and media queries for sidebars.

## Technology Stack

- **HTML5:** Semantic HTML providing robust layout skeletons and grid systems.
- **CSS3:** Extensive styling built with a modern approach containing fully responsive utility grids, Flexbox, media queries (`@media`), custom animations, and CSS variables for theming—without needing bulky UI framework dependencies.
- **Vanilla JavaScript:** Fast component management via modularized JavaScript logic (`app.js`, `context-adapter.js`, `feedback-manager.js`, `drag-drop.js`, etc.). Native LocalStorage API is heavily utilized for persistence.
- **D3.js & Quill.js:** Advanced data visualization elements supporting knowledge graphs, and heavily modified dynamic WYSIWYG editors.

## Setup & Running purely Locally

This project comprises pure foundational HTML, CSS, and JS dependencies and requires no heavy build systems or backend compilers.

1. Clone or download the repository to your local machine.
2. Spin up a local static server to prevent any CORS issues (e.g., `python3 -m http.server 8000` or VSCode Live Server).
3. Open `http://localhost:8000/index.html` to load the Scholar's Command Center.
4. Press `Cmd+K` (or `Ctrl+K`) and type "Deep Work" to engage the Focus Modes.

## Architecture

- `index.html`: Holds the primary DOM structure, Grid/Flexbox containers, and inline dynamic styles for Focus Modes.
- `css/`: Domain-specific styling scripts separating logical UI parts (e.g., `main.css`, `graph.css`, `animations.css`, `responsive.css`).
- `js/`: Segmented vanilla components ensuring distinct single-responsibility execution (e.g., locking focus states in `context-adapter.js`, or controlling UI with `command-palette.js`). Contains static simulated context in `data.js`.
- `assets/`: Images, gradients, and graphical resources utilized in hero banners or component backgrounds.
