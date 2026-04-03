/**
 * Context Adapter — Contextual UI Adaptation
 * Dashboard transforms when a class is in session or user enters Focus Modes
 */
const ContextAdapter = {
  isSimulating: false,
  simulatedClass: null,
  checkInterval: null,
  currentMode: null, // 'lecture', 'deep_work', 'quick_notes'
  quillInstance: null,
  currentNoteId: null,
  _currentSubjectId: null,
  _currentClassInfo: null,

  init() {
    this.checkContext();
    this.checkInterval = setInterval(() => this.checkContext(), 30000);
  },

  checkContext() {
    if (this.currentMode) return; // Don't auto-switch if user forced a mode
    const activeClass = this.getActiveClass();
    if (activeClass || this.isSimulating) {
      this.activateSessionMode(activeClass || this.simulatedClass);
    } else {
      this.deactivateSessionMode();
    }
  },

  getActiveClass() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const todayClasses = NexusData.getTodayClasses();
    return todayClasses.find((c) => {
      const start = c.startHour * 60 + c.startMin;
      const end = c.endHour * 60 + c.endMin;
      return currentMinutes >= start && currentMinutes < end;
    });
  },

  toggleSimulation() {
    if (this.isSimulating) {
      this.isSimulating = false;
      this.simulatedClass = null;
      this.deactivateSessionMode();
      App.showToast("📡", "Class simulation ended");
    } else {
      const classes = NexusData.getTodayClasses();
      let classToSim =
        classes.length > 0
          ? classes[0]
          : {
              subject: NexusData.subjects[0],
              room: "Room 401",
              startHour: new Date().getHours(),
              startMin: 0,
              endHour: new Date().getHours() + 1,
              endMin: 30,
            };
      this.isSimulating = true;
      this.simulatedClass = classToSim;
      this.activateSessionMode(classToSim);
      App.showToast("📡", `Simulating: ${classToSim.subject.name}`);
    }
  },

  activateSessionMode(classInfo) {
    if (!classInfo || !classInfo.subject) return;
    this.showContextBanner("lecture", classInfo);
    this.collapseDashboardAndShowMode("lecture", classInfo);
  },

  deactivateSessionMode() {
    this.exitMode();
  },

  // ---- NEW FOCUS MODES ----
  activateMode(mode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    document.body.classList.add("mode-active");

    this.showContextBanner(mode);
    this.collapseDashboardAndShowMode(mode);
    App.showToast("✨", `Entered ${mode.replace("_", " ").toUpperCase()} Mode`);
  },

  exitMode() {
    this.currentMode = null;
    this._currentSubjectId = null;
    this._currentClassInfo = null;

    // Save Quill Data if exists
    if (this.quillInstance) {
      this.saveCurrentNote(true);
      this.quillInstance = null;
    }
    this.currentNoteId = null;

    document.body.classList.remove("mode-active");

    const dot = document.querySelector(".context-dot");
    const text = document.querySelector(".context-text");
    if (dot) {
      dot.classList.remove("pulsing");
      dot.style.background = "";
    }
    if (text) text.textContent = "Ready";

    const banner = document.getElementById("session-banner");
    if (banner) banner.remove();

    this.restoreDashboard();
    App.showToast("🔙", `Returned to Dashboard`);
  },

  showContextBanner(mode, classInfo = null) {
    const existing = document.getElementById("session-banner");
    if (existing) existing.remove();

    const viewContainer = document.getElementById("dashboard-view");
    if (!viewContainer) return;

    const banner = document.createElement("div");
    banner.id = "session-banner";
    banner.className = "context-banner";

    let title = mode;
    let sub = "Focus Mode Active";
    if (mode === "lecture" && classInfo) {
      title = `📡 ${classInfo.subject.name} — In Session`;
      sub = `${classInfo.room} · ${this._formatTime(classInfo.startHour, classInfo.startMin)} – ${this._formatTime(classInfo.endHour, classInfo.endMin)}`;
    } else {
      title = `🧠 ${mode.replace("_", " ").toUpperCase()}`;
    }

    banner.innerHTML = `
      <div class="context-banner-info">
        <div class="context-banner-dot" style="background: var(--color-accent)"></div>
        <div>
          <div class="context-banner-text">${title}</div>
          <div class="context-banner-sub">${sub}</div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="ContextAdapter.exitMode()">
        Exit Mode
      </button>`;

    viewContainer.insertBefore(banner, viewContainer.firstChild);
  },

  collapseDashboardAndShowMode(mode, classInfo = null) {
    const dashboard = document.getElementById("dashboard-view");
    if (!dashboard) return;

    const standardCards = dashboard.querySelectorAll(".dashboard-grid > .card");
    standardCards.forEach((card) => (card.style.display = "none"));

    let livePanel = document.getElementById("live-session-panel");
    if (!livePanel) {
      livePanel = document.createElement("div");
      livePanel.id = "live-session-panel";
      livePanel.style.display = "contents";
      const dashGrid = dashboard.querySelector(".dashboard-grid");
      if (dashGrid) dashGrid.appendChild(livePanel);
    } else {
      livePanel.innerHTML = "";
      livePanel.style.display = "contents";
    }

    if (mode === "lecture" && !classInfo) classInfo = this.getActiveClass();
    this._currentClassInfo = classInfo;

    if (mode === "lecture") {
      const subjectName = classInfo ? classInfo.subject.name : "All Subjects";
      const subjectId = classInfo ? classInfo.subject.id : null;
      this._currentSubjectId = subjectId;
      const relatedResources = subjectId
        ? NexusData.resources.filter((r) => r.subjectId === subjectId)
        : NexusData.resources;

      livePanel.innerHTML = `
        <div class="card live-main-panel">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm); flex-wrap: wrap; gap: 8px;">
            <h2 class="card-title">📝 Live Notes — ${subjectName}</h2>
            <div style="display: flex; gap: 8px;">
               <input type="text" id="note-title-input" class="form-input-focus" placeholder="Title...">
               <button class="btn btn-primary btn-sm" onclick="ContextAdapter.saveCurrentNote()">Save</button>
               <button class="btn btn-secondary btn-sm" onclick="ContextAdapter.createNewNote()">New</button>
            </div>
          </div>
          <div class="card-content" style="padding: 0; min-height: 400px; display: flex; flex-direction: column;">
            <div id="quill-editor-container" style="border:none; flex: 1; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; overflow-y: hidden;"></div>
          </div>
        </div>
        <div style="display: contents;">
          <div class="card live-side-panel" style="grid-row: 1;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h2 class="card-title">📚 Active Resources</h2>
              <button class="btn btn-icon btn-sm" onclick="ContextAdapter.addActiveResource()" title="Add Resource">+</button>
            </div>
            <div class="card-content" style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
              <div class="live-resources-grid">
                ${relatedResources.map((r) => `<div class="resource-quick-item" style="display: flex; align-items: center; justify-content: space-between;" onclick="ResourceManager.openPreview('${r.id}')"><div style="display: flex; align-items: center; overflow: hidden;"><span class="resource-quick-icon">${r.type === "pdf" ? "📄" : "🔗"}</span><span class="resource-quick-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.title}</span></div><button class="btn btn-icon btn-sm" style="color: var(--color-danger); padding:4px;" onclick="event.stopPropagation(); ContextAdapter.removeActiveResource('${r.id}')">🗑️</button></div>`).join("")}
                ${relatedResources.length === 0 ? '<div class="empty-state" style="padding: 10px;"><div class="empty-state-text" style="font-size:0.85rem;">No resources mapped. Manage them here.</div></div>' : ""}
              </div>
            </div>
          </div>
          <div class="card live-side-panel" style="grid-row: 2;">
            <div class="card-header"><h2 class="card-title">🗂️ Saved Notes</h2></div>
            <div class="card-content" id="saved-notes-list" style="padding: var(--space-sm); max-height: 250px; overflow-y: auto;">
            </div>
          </div>
        </div>`;
      this.initNotesManager(mode);
    } else if (mode === "deep_work") {
      livePanel.innerHTML = `
        <div class="card live-main-panel" style="min-height: 75vh; display: flex; flex-direction: column;">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm); flex-wrap: wrap; gap: 8px;">
            <h2 class="card-title">🧠 Deep Research & Work</h2>
            <div style="display: flex; gap: 8px;">
               <input type="text" id="note-title-input" class="form-input-focus" placeholder="Title...">
               <button class="btn btn-primary btn-sm" onclick="ContextAdapter.saveCurrentNote()">Save</button>
               <button class="btn btn-secondary btn-sm" onclick="ContextAdapter.createNewNote()">New</button>
            </div>
          </div>
          <div class="card-content" style="padding: 0; flex: 1; display: flex; flex-direction: column;">
            <div id="quill-editor-container" style="border:none; flex: 1; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;"></div>
          </div>
        </div>
        <div class="card live-side-panel">
          <div class="card-header"><h2 class="card-title">🗂️ Research Library</h2></div>
          <div class="card-content" id="saved-notes-list" style="padding: var(--space-sm);">
          </div>
        </div>`;
      this.initNotesManager(mode);
    } else if (mode === "quick_notes") {
      livePanel.innerHTML = `
        <div class="card live-main-panel" style="min-height: 75vh; display: flex; flex-direction: column;">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm); flex-wrap: wrap; gap: 8px;">
            <h2 class="card-title">⚡ Quick Notes (Plain Text)</h2>
            <div style="display: flex; gap: 8px;">
               <input type="text" id="note-title-input" class="form-input-focus" placeholder="Title...">
               <button class="btn btn-primary btn-sm" onclick="ContextAdapter.saveCurrentNote()">Save</button>
               <button class="btn btn-secondary btn-sm" onclick="ContextAdapter.createNewNote()">New</button>
            </div>
          </div>
          <div class="card-content" style="padding: 0; flex: 1; display: flex; flex-direction: column;">
            <textarea class="ql-editor quick-notes-textarea" id="quick-notes-textarea" style="width:100%; min-height: 400px; background: transparent; border: none; flex: 1; color: var(--text-primary); resize: vertical; box-sizing: border-box; padding: 15px; outline: none;"></textarea>
          </div>
        </div>
        <div class="card live-side-panel">
          <div class="card-header"><h2 class="card-title">🗂️ Note Library</h2></div>
          <div class="card-content" id="saved-notes-list" style="padding: var(--space-sm);">
          </div>
        </div>`;

      const ta = document.getElementById("quick-notes-textarea");
      ta.addEventListener("input", () => {
        clearTimeout(this._saveTimeout);
        this._saveTimeout = setTimeout(() => {
          this.saveCurrentNote(true);
        }, 1500);
      });

      const notes = this.getNotesList(mode);
      if (notes.length > 0) this.loadNote(notes[0].id);
      else this.createNewNote();
    }
  },

  // ---- ACTIVE RESOURCE MANAGEMENT ----
  addActiveResource() {
    const url = prompt("Enter resource URL:");
    if (!url) return;
    const title =
      prompt("Enter resource title:", "New Linked Resource") ||
      "New Linked Resource";
    const newRes = {
      id: "res-" + Date.now(),
      title: title,
      type: url.includes(".pdf") ? "pdf" : "link",
      url: url,
      subjectId: this._currentSubjectId || "general",
      dateAdded: new Date().toISOString(),
    };
    // Mutating Data Layer directly for demonstration inside Focus Mode
    NexusData.resources.push(newRes);
    App.showToast("📚", "Resource attached to session");
    this.collapseDashboardAndShowMode(this.currentMode, this._currentClassInfo);
  },

  removeActiveResource(id) {
    if (
      confirm("Are you sure you want to unlink this resource from the session?")
    ) {
      NexusData.resources = NexusData.resources.filter((r) => r.id !== id);
      App.showToast("🗑️", "Resource unlinked");
      this.collapseDashboardAndShowMode(
        this.currentMode,
        this._currentClassInfo,
      );
    }
  },

  // ---- NOTE MANAGER ----
  initNotesManager(mode) {
    if (typeof Quill === "undefined") {
      console.error("Quill not loaded. Did you include the CDN script?");
      return;
    }

    const toolbarOptions = [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"], // Standard Quill embeds
      ["clean"],
    ];

    this.quillInstance = new Quill("#quill-editor-container", {
      theme: "snow",
      placeholder:
        "Start writing... Add images, tables, formulas, and structured notes effortlessly.",
      modules: { toolbar: toolbarOptions },
    });

    // Auto-save on change
    this.quillInstance.on("text-change", () => {
      clearTimeout(this._saveTimeout);
      this._saveTimeout = setTimeout(() => {
        this.saveCurrentNote(true);
      }, 1500);
    });

    // Load initial notes UI
    const notes = this.getNotesList(mode);
    if (notes.length > 0) {
      this.loadNote(notes[0].id);
    } else {
      this.createNewNote();
    }
  },

  getNotesList(mode) {
    const list = localStorage.getItem(`nexus-notes-list-${mode}`);
    return list ? JSON.parse(list) : [];
  },

  saveCurrentNote(silent = false) {
    if (!this.currentMode) return;
    if (this.currentMode !== "quick_notes" && !this.quillInstance) return;

    // Auto-assign ID if brand new
    if (!this.currentNoteId) {
      this.currentNoteId = "note-" + Date.now().toString();
    }

    const titleInput = document.getElementById("note-title-input");
    const title =
      titleInput && titleInput.value.trim() !== ""
        ? titleInput.value.trim()
        : "Untitled Note";

    const notes = this.getNotesList(this.currentMode);
    const existing = notes.find((n) => n.id === this.currentNoteId);

    if (existing) {
      existing.title = title;
      existing.updatedAt = Date.now();
    } else {
      notes.push({ id: this.currentNoteId, title, updatedAt: Date.now() });
    }

    // Sort newest first
    notes.sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(
      `nexus-notes-list-${this.currentMode}`,
      JSON.stringify(notes),
    );

    // Save Data appropriately depending on mode
    if (this.currentMode === "quick_notes") {
      const ta = document.getElementById("quick-notes-textarea");
      if (ta)
        localStorage.setItem(
          `nexus-note-data-${this.currentNoteId}`,
          JSON.stringify(ta.value),
        );
    } else {
      localStorage.setItem(
        `nexus-note-data-${this.currentNoteId}`,
        JSON.stringify(this.quillInstance.getContents()),
      );
    }

    this.renderSavedNotesUI();
    if (!silent) App.showToast("💾", "Note saved to library");
  },

  loadNote(id) {
    if (!this.currentMode) return;
    if (this.currentMode !== "quick_notes" && !this.quillInstance) return;

    const data = localStorage.getItem(`nexus-note-data-${id}`);
    const notes = this.getNotesList(this.currentMode);
    const noteMeta = notes.find((n) => n.id === id);

    if (noteMeta) {
      const titleInput = document.getElementById("note-title-input");
      if (titleInput) titleInput.value = noteMeta.title;
    }

    if (this.currentMode === "quick_notes") {
      const ta = document.getElementById("quick-notes-textarea");
      if (ta && data) {
        try {
          ta.value = JSON.parse(data);
        } catch (e) {
          ta.value = data;
        }
      } else if (ta) {
        ta.value = "";
      }
    } else {
      if (data) {
        try {
          this.quillInstance.setContents(JSON.parse(data));
        } catch (e) {
          this.quillInstance.clipboard.dangerouslyPasteHTML(data);
        }
      } else {
        this.quillInstance.setContents([]);
      }
    }

    this.currentNoteId = id;
    this.renderSavedNotesUI();
  },

  createNewNote() {
    if (!this.currentMode) return;
    if (this.currentMode !== "quick_notes" && !this.quillInstance) return;

    this.currentNoteId = "note-" + Date.now().toString();
    const titleInput = document.getElementById("note-title-input");
    if (titleInput) titleInput.value = "";

    if (this.currentMode === "quick_notes") {
      const ta = document.getElementById("quick-notes-textarea");
      if (ta) ta.value = "";
    } else {
      this.quillInstance.setContents([]);
    }

    this.renderSavedNotesUI();
  },

  deleteNote(id) {
    if (!this.currentMode) return;

    let notes = this.getNotesList(this.currentMode);
    notes = notes.filter((n) => n.id !== id);
    localStorage.setItem(
      `nexus-notes-list-${this.currentMode}`,
      JSON.stringify(notes),
    );
    localStorage.removeItem(`nexus-note-data-${id}`);

    if (this.currentNoteId === id) {
      if (notes.length > 0) this.loadNote(notes[0].id);
      else this.createNewNote();
    } else {
      this.renderSavedNotesUI();
    }
    App.showToast("🗑️", "Note deleted");
  },

  renderSavedNotesUI() {
    const container = document.getElementById("saved-notes-list");
    if (!container) return;

    const notes = this.getNotesList(this.currentMode);
    if (notes.length === 0) {
      container.innerHTML = `<div class="empty-state" style="padding: 10px;"><div class="empty-state-text" style="font-size:0.85rem;">No saved notes. Create one to get started.</div></div>`;
      return;
    }

    let html = '<div style="display:flex; flex-direction:column; gap:8px;">';
    notes.forEach((n) => {
      const isSelected = n.id === this.currentNoteId;
      const d = new Date(n.updatedAt).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const style = isSelected
        ? `background: var(--bg-surface-hover); border-left: 3px solid var(--color-primary);`
        : `background: var(--bg-tertiary);`;
      html += `
        <div style="padding: 10px; border-radius: 6px; cursor: pointer; ${style}; display:flex; justify-content:space-between; align-items:center; transition: all var(--transition-fast);">
          <div style="flex:1; overflow:hidden;" onclick="ContextAdapter.loadNote('${n.id}')">
            <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; color: var(--text-primary);">${n.title || "Untitled"}</div>
            <div style="font-size:0.75rem; color: var(--text-tertiary);">${d}</div>
          </div>
          <button class="btn btn-icon btn-sm" style="color: var(--color-danger); padding:4px;" onclick="event.stopPropagation(); ContextAdapter.deleteNote('${n.id}')" title="Delete Note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      `;
    });
    html += "</div>";
    container.innerHTML = html;
  },

  restoreDashboard() {
    const dashboard = document.getElementById("dashboard-view");
    if (!dashboard) return;
    const standardCards = dashboard.querySelectorAll(".dashboard-grid > .card");
    standardCards.forEach((card) => (card.style.display = ""));
    const livePanel = document.getElementById("live-session-panel");
    if (livePanel) {
      livePanel.classList.remove("active");
      livePanel.style.display = "none";
      livePanel.innerHTML = "";
    }
  },

  _formatTime(h, m) {
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  },
};
