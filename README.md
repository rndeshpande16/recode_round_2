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

### Task Precedence (Gravity Engine)

Nexus-Uni uses a proprietary **Gravity Engine** to calculate task precedence dynamically. This ensures students always focus on what matters most.

- **Formula:** `Gravity Score = Urgency × Grade Weight`
- **Urgency (1-10):**
    - **Overdue:** Fixed at `10`.
    - **Upcoming:** Scales from `10` (due today) down to `1` (due in 14+ days) using the formula: `max(1, 10 - floor(daysLeft × (9/14)))`.
- **Grade Weight:** The percentage impact of the task on the final subject grade (e.g., a 20% project has a weight of `20`).
- **Priority Thresholds:**
    - 🔴 **Critical:** `150+`
    - 🟠 **High:** `80 - 149`
    - 🟡 **Medium:** `30 - 79`
    - 🔵 **Low:** `< 30`

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

## User Guide: Mastering Nexus-Uni

### 1. The Dashboard (Command Central)
Your journey begins here. The dashboard provides an at-a-glance view of your academic health.
- **Priority Hub:** View tasks sorted by "Gravity." Click the `+` icon to quickly add a new objective.
- **Performance Analytics:** Hover over the radar chart to see your strengths and weaknesses across different subjects.
- **Timeline & Schedule:** See what's due next and where your next class is located.

### 2. Navigation & Speed
- **Sidebar:** Toggle between views like Tasks, Calendar, and Knowledge Graph.
- **Command Palette (`Cmd+K` or `Ctrl+K`):** The fastest way to move. Type "Tasks" to jump to the task list, or "Deep Work" to enter a focus mode immediately.
- **Theme Toggle:** Switch between Dark and Light modes using the moon/sun icon at the bottom of the sidebar.

### 3. Advanced Task Management
Navigate to the **Tasks** view for a deep dive into your to-do list.
- **Filtering:** Use the top bar to filter by "High Gravity" (critical items) or "Due Soon."
- **Completion:** Check the box next to a task to finish it. Enjoy the celebratory confetti!
- **Edit/Delete:** Hover over a task card to find the edit (pencil) and delete (trash) icons.

### 4. Interactive Calendar
The **Calendar** view helps you plan your month.
- **Date Context:** Click on any date to open a side panel showing the specific lectures and tasks scheduled for that day.
- **Navigation:** Use the arrows to move between months, or click "Today" to reset.

### 5. Achieving Flow with Focus Modes
Found in the sidebar, these modes are designed to eliminate distractions:
- **Lecture Mode:** Perfect for taking notes during class. It displays relevant subject resources on the right and a rich-text editor on the left.
- **Deep Work Mode:** A focused, full-screen environment for intense writing and research.
- **Quick Notes:** A minimalist scratchpad for rapid brain-dumping.
- **Note Management:** Every mode allows you to create multiple notes, which are automatically saved to your browser's `localStorage`.

### 6. Feedback & Resources
- **Feedback Loop:** Check professor comments. You can reply to threads and update the status of an inquiry to "Resolved" once finished.
- **Resource Library:** Search for PDFs, videos, and articles. Use the custom tag dropdown to filter materials by specific topics like "Algorithms" or "Math."

### 7. Knowledge Graph & Health
- **Knowledge Graph:** A visual web of your subjects. Click and drag nodes to explore connections between courses.
- **Subject Health:** A detailed breakdown of your standing in every course, including attendance, past grades, and assignment completion rates.

