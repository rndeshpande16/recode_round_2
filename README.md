# Nexus-Uni: Scholar's Command Center

Nexus-Uni is the unified nervous system for a student's technical and academic life. It is designed as a high-density, centralized academic cockpit that offers powerful tools for managing tasks, tracking educational feedback, organizing resources, and visualizing knowledge.

## Features

- **Dashboard:** A central hub showing priority tasks (Priority Hub), upcoming schedule, recent feedback, fast access links to resources, and performance analytics with an interactive chart spanning the layout beautifully across any device viewport length.
- **Task Management:** An advanced task manager that handles items based on priority ("Gravity"). Sort items as Critical, High, Normal, or Low priority.
- **Feedback Loop:** A GitHub-style interface for resolving student/professor inquiries or assignments, capable of tracking feedback states (Open, In Progress, Resolved). Features integrated reply threads and customized dropdown status toggles.
- **Knowledge Graph:** A D3.js powered relationship network allowing students to view interconnected concepts across overlapping subjects visually – enabling a more comprehensive understanding of their field.
- **Subject Health:** Detailed indicators monitoring your grades and project completion rates within specific courses.
- **Command Palette:** Quick-access navigation tool invoked via `Cmd+K` enabling lightning-fast maneuvering, task creation, or search functionality.
- **Responsive & Dynamic Design:** Fully fluid UI that shifts reliably from widescreen desktop down to mobile viewports, featuring dark themes, subtle gradient glows, and engaging micro-interactions.

## Technology Stack

- **HTML5:** Semantic HTML providing robust layout skeleton.
- **CSS3:** Extensive styling built with a modern approach containing fully responsive utility grids, Flexbox, glassmorphism design traits, custom animations, without needing bulky UI framework dependencies.
- **Vanilla JavaScript:** Fast component management via modularized JavaScript logic (`app.js`, `feedback-manager.js`, `drag-drop.js`, etc.).
- **D3.js:** Advanced data visualization elements supporting knowledge graphs and dynamic structural networking.

## Setup & Running

This project comprises pure foundational HTML, CSS, and JS dependencies and requires no heavy build systems.

1. Clone or download the repository to your local machine.
2. Ensure you have a standard live server or local web server configuration (like `npx serve`, VSCode Live Server).
3. Open `index.html` to load the Scholar's Command Center.

## Architecture

- `index.html`: Holds the primary DOM structure and imports standard elements.
- `css/`: Domain-specific styling scripts separating logical UI parts (e.g., `dashboard.css`, `feedback.css`, `animations.css`, `responsive.css`).
- `js/`: Segmented vanilla components ensuring distinct single-responsibility execution (e.g., managing tasks independently from manipulating graph nodes). Contains static simulated context in `data.js`.
- `assets/`: Images, gradients, and graphical resources utilized in hero banners or component backgrounds.
