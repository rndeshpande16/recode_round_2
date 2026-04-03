/**
 * Priority Hub — Task Gravity Engine + Full CRUD + Completion
 * Gravity = Urgency × Grade Weight
 */
const PriorityHub = {
  editingTaskId: null,

  init() {
    this.renderDashboardTasks();
    this.renderTasksView();
    this.initTaskFilters();
    this.initAddButtons();
  },

  _getGravityClass(gravity) {
    if (gravity >= 150) return "critical";
    if (gravity >= 80) return "high";
    if (gravity >= 30) return "medium";
    return "low";
  },

  _formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (d - now) / (1000 * 60 * 60 * 24);
    const options = { month: "short", day: "numeric" };
    const formatted = d.toLocaleDateString("en-US", options);
    if (diff < 0) return { text: `Overdue · ${formatted}`, cls: "overdue" };
    if (diff < 2) return { text: `Due soon · ${formatted}`, cls: "soon" };
    return { text: formatted, cls: "" };
  },

  _getTypeIcon(type) {
    const icons = {
      assignment: "📝",
      homework: "📖",
      project: "🛠️",
      exam: "🎓",
      lab: "🔬",
      quiz: "❓",
    };
    return icons[type] || "📌";
  },

  // ===== Dashboard Priority Hub =====
  renderDashboardTasks() {
    const container = document.getElementById("priority-tasks");
    if (!container) return;

    const tasks = NexusData.tasks
      .filter((t) => !t.completed)
      .map((t) => ({
        ...t,
        ...NexusData.calcGravity(t),
        subject: NexusData.getLiveSubjectStats(t.subjectId),
      }))
      .sort((a, b) => b.gravity - a.gravity);

    if (tasks.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">🎉</div><div class="empty-state-text">All tasks completed!</div></div>';
      return;
    }

    container.innerHTML = tasks
      .slice(0, 8)
      .map((t) => {
        const cls = this._getGravityClass(t.gravity);
        const due = this._formatDate(t.dueDate);
        return `
        <div class="task-item tilt-card" draggable="true" data-id="${t.id}">
          <label class="task-checkbox" onclick="event.stopPropagation()">
            <input type="checkbox" onchange="PriorityHub.completeTask('${t.id}', this)" />
            <span class="checkmark"></span>
          </label>
          <div class="task-gravity-bar ${cls}"></div>
          <div class="task-body">
            <div class="task-title">${t.title}</div>
            <div class="task-meta">
              <span class="task-meta-item"><span class="badge badge-neutral">${t.subject ? t.subject.code : ""}</span></span>
              <span class="task-meta-item">${due.text}</span>
              <span class="task-meta-item">${t.gradeWeight}% weight</span>
            </div>
          </div>
          <div class="task-gravity-score ${cls}">${t.gravity}</div>
          <div class="task-item-actions" style="display:flex;gap:4px;align-items:center;margin-left:var(--space-sm);">
            <button class="btn-icon" onclick="event.stopPropagation(); PriorityHub.openEditModal('${t.id}')" title="Edit">✏️</button>
            <button class="btn-icon" onclick="event.stopPropagation(); PriorityHub.deleteTask('${t.id}')" title="Delete" style="color:var(--color-danger);">🗑️</button>
          </div>
        </div>`;
      })
      .join("");

    DragDrop.init(container, ".task-item");
    container.classList.add("anim-stagger");
  },

  // ===== Full Tasks View =====
  renderTasksView(filterType = "all", searchQuery = "") {
    const container = document.getElementById("tasks-grid");
    if (!container) return;

    let tasks = NexusData.tasks.map((t) => ({
      ...t,
      ...NexusData.calcGravity(t),
      subject: NexusData.getLiveSubjectStats(t.subjectId),
    }));

    // Filter by type
    if (filterType === "high") {
      tasks = tasks.filter((t) => t.gravity >= 80 && !t.completed);
    } else if (filterType === "due") {
      tasks = tasks.filter((t) => {
        const d = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        return d <= 3 && d >= 0 && !t.completed;
      });
    } else if (filterType === "completed") {
      tasks = tasks.filter((t) => t.completed);
    } else {
      // 'all'
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.subject && t.subject.name.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)),
      );
    }

    // Sort: uncompleted by gravity desc, completed at bottom
    tasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.gravity - a.gravity;
    });

    if (tasks.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">🎉</div><div class="empty-state-text">No tasks match your filter</div></div>';
      return;
    }

    container.innerHTML = tasks
      .map((t, i) => {
        const cls = this._getGravityClass(t.gravity);
        const due = this._formatDate(t.dueDate);
        return `
        <div class="task-card tilt-card ${t.completed ? "completed" : ""}" draggable="true" data-id="${t.id}" data-scroll="fade-up" data-scroll-delay="${(i % 4) + 1}">
          <div class="task-card-header">
            <div style="display:flex;align-items:flex-start;gap:var(--space-md);">
              <label class="task-checkbox" onclick="event.stopPropagation()" style="margin-top:2px;">
                <input type="checkbox" ${t.completed ? "checked" : ""} onchange="PriorityHub.completeTask('${t.id}', this)" />
                <span class="checkmark"></span>
              </label>
              <div>
                <div class="task-card-subject">${t.subject ? t.subject.code + " · " + t.subject.name : ""}</div>
                <div class="task-card-title">${t.title}</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-xs);">
              <div class="task-gravity-score ${cls}">${t.gravity}</div>
              <div style="display:flex;gap:2px;">
                <button class="btn-icon" onclick="PriorityHub.openEditModal('${t.id}')" title="Edit" style="width:24px;height:24px;font-size:0.75rem;">✏️</button>
                <button class="btn-icon" onclick="PriorityHub.deleteTask('${t.id}')" title="Delete" style="width:24px;height:24px;font-size:0.75rem;color:var(--color-danger);">🗑️</button>
              </div>
            </div>
          </div>
          <div class="task-card-desc">${t.description}</div>
          <div class="task-card-footer">
            <span class="task-card-due ${due.cls}">${this._getTypeIcon(t.type)} ${due.text}</span>
            <span class="badge ${cls === "critical" ? "badge-danger" : cls === "high" ? "badge-warning" : "badge-info"}">${t.gradeWeight}% weight</span>
          </div>
          <div class="gravity-meter">
            <div class="gravity-meter-fill ${cls}" style="width: ${Math.min(100, (t.gravity / 300) * 100)}%"></div>
          </div>
        </div>`;
      })
      .join("");

    container.classList.add("anim-stagger");

    DragDrop.init(container, ".task-card");

    if (typeof ScrollObserver !== "undefined" && ScrollObserver.observer)
      ScrollObserver.observe();
  },

  // ===== Task Completion =====
  completeTask(taskId, checkbox) {
    const task = NexusData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.completed = checkbox.checked;

    if (checkbox.checked) {
      const parent = checkbox.closest(".task-card, .task-item");
      if (parent) {
        parent.classList.add("completed");
        App.showConfetti();
      }

      App.showToast("✅", `"${task.title}" completed!`);

      NexusData.saveTasks();

      setTimeout(() => {
        this.renderDashboardTasks();
        this.renderTasksView(this._currentFilter(), this._currentSearch());
        App.updateStats();
        App.updateNavBadges();
      }, 600);
    } else {
      NexusData.saveTasks();
      App.showToast("↩️", `"${task.title}" reopened`);
      this.renderDashboardTasks();
      this.renderTasksView(this._currentFilter(), this._currentSearch());
      App.updateStats();
      App.updateNavBadges();
    }
  },

  // ===== Add Task Modal =====
  openAddModal() {
    this.editingTaskId = null;
    this._openTaskModal(
      {
        title: "",
        description: "",
        subjectId: NexusData.subjects[0].id,
        dueDate: this._todayStr(3),
        gradeWeight: 10,
        type: "assignment",
      },
      "Add New Task",
    );
  },

  // ===== Edit Task Modal =====
  openEditModal(taskId) {
    const task = NexusData.tasks.find((t) => t.id === taskId);
    if (!task) return;
    this.editingTaskId = taskId;
    this._openTaskModal(task, "Edit Task");
  },

  _openTaskModal(data, title) {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    const subjectOptions = NexusData.subjects
      .map(
        (s) =>
          `<option value="${s.id}" ${data.subjectId === s.id ? "selected" : ""}>${s.code} — ${s.name}</option>`,
      )
      .join("");

    const typeOptions = [
      "assignment",
      "homework",
      "project",
      "exam",
      "lab",
      "quiz",
    ]
      .map(
        (t) =>
          `<option value="${t}" ${data.type === t ? "selected" : ""}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`,
      )
      .join("");

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="PriorityHub.closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close" onclick="PriorityHub.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form class="task-form" id="task-form" onsubmit="PriorityHub.saveTask(event)">
              <div class="form-group">
                <label class="form-label">Task Title</label>
                <input class="input" type="text" id="task-title" placeholder="e.g. Implement AVL Tree Rotations" value="${this._escape(data.title)}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="textarea" id="task-description" placeholder="Describe the task in detail…" rows="3">${this._escape(data.description)}</textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Subject</label>
                  <select class="form-select" id="task-subject">${subjectOptions}</select>
                </div>
                <div class="form-group">
                  <label class="form-label">Type</label>
                  <select class="form-select" id="task-type">${typeOptions}</select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Due Date</label>
                  <input class="input" type="date" id="task-due" value="${data.dueDate}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Grade Weight (%)</label>
                  <input class="input" type="number" id="task-weight" min="1" max="100" value="${data.gradeWeight}" required />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="PriorityHub.closeModal()">Cancel</button>
            <button class="btn btn-primary btn-ripple" type="submit" form="task-form">
              ${this.editingTaskId ? "💾 Save Changes" : "➕ Add Task"}
            </button>
          </div>
        </div>
      </div>`;

    this._escHandler = (e) => {
      if (e.key === "Escape") this.closeModal();
    };
    document.addEventListener("keydown", this._escHandler);
  },

  saveTask(e) {
    e.preventDefault();

    const title = document.getElementById("task-title").value.trim();
    const description = document
      .getElementById("task-description")
      .value.trim();
    const subjectId = document.getElementById("task-subject").value;
    const type = document.getElementById("task-type").value;
    const dueDate = document.getElementById("task-due").value;
    const gradeWeight = parseInt(document.getElementById("task-weight").value);

    if (!title || !dueDate) return;

    if (this.editingTaskId) {
      const task = NexusData.tasks.find((t) => t.id === this.editingTaskId);
      if (task) {
        task.title = title;
        task.description = description;
        task.subjectId = subjectId;
        task.type = type;
        task.dueDate = dueDate;
        task.gradeWeight = gradeWeight;
        App.showToast("💾", `Task "${title}" updated`);
      }
    } else {
      const newId = "t" + (Date.now() % 100000);
      NexusData.tasks.push({
        id: newId,
        title,
        description,
        subjectId,
        type,
        dueDate,
        gradeWeight,
        completed: false,
      });
      App.showToast("➕", `Task "${title}" added`);
    }

    NexusData.saveTasks();

    this.closeModal();
    this.renderDashboardTasks();
    this.renderTasksView(this._currentFilter(), this._currentSearch());
    App.updateStats();
    App.updateNavBadges();
  },

  deleteTask(taskId) {
    const task = NexusData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (!confirm(`Delete "${task.title}"?`)) return;

    const idx = NexusData.tasks.findIndex((t) => t.id === taskId);
    if (idx > -1) NexusData.tasks.splice(idx, 1);

    NexusData.saveTasks();

    App.showToast("🗑️", `Task "${task.title}" deleted`);
    this.renderDashboardTasks();
    this.renderTasksView(this._currentFilter(), this._currentSearch());
    App.updateStats();
    App.updateNavBadges();
  },

  closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
    this.editingTaskId = null;
    if (this._escHandler) {
      document.removeEventListener("keydown", this._escHandler);
      this._escHandler = null;
    }
  },

  initTaskFilters() {
    const filterBtns = document.querySelectorAll("#tasks-view .filter-btn");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const search = document.querySelector("#tasks-view .search-input");
        this.renderTasksView(btn.dataset.filter, search ? search.value : "");
      });
    });

    const searchInput = document.querySelector("#tasks-view .search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const activeFilter = document.querySelector(
          "#tasks-view .filter-btn.active",
        );
        this.renderTasksView(
          activeFilter ? activeFilter.dataset.filter : "all",
          searchInput.value,
        );
      });
    }
  },

  initAddButtons() {
    const dashAddBtn = document.getElementById("add-task-btn");
    if (dashAddBtn)
      dashAddBtn.addEventListener("click", () => this.openAddModal());

    const tasksAddBtn = document.getElementById("add-task-view-btn");
    if (tasksAddBtn)
      tasksAddBtn.addEventListener("click", () => this.openAddModal());
  },

  _currentFilter() {
    const active = document.querySelector("#tasks-view .filter-btn.active");
    return active ? active.dataset.filter : "all";
  },

  _currentSearch() {
    const input = document.querySelector("#tasks-view .search-input");
    return input ? input.value : "";
  },

  _todayStr(daysAhead = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  },

  _escape(str) {
    const el = document.createElement("span");
    el.textContent = str || "";
    return el.innerHTML;
  },

  getStats() {
    const pending = NexusData.tasks.filter((t) => !t.completed);
    const dueSoon = pending.filter((t) => {
      const d = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
      return d <= 3;
    });
    const avgGrade = Math.round(
      NexusData.getAllLiveSubjects().reduce((sum, s) => sum + s.grade, 0) /
        Math.max(1, NexusData.subjects.length),
    );
    return { tasksDue: dueSoon.length, avgGrade: avgGrade + "%" };
  },
};
