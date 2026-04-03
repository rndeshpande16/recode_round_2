/**
 * Feedback Manager — GitHub-style Issues
 */
const FeedbackManager = {
  currentFilter: "all",

  init() {
    this.renderDashboardFeedback();
    this.renderFeedbackView();
    this.initFilters();
  },

  _statusIcon(status) {
    if (status === "open") return "●";
    if (status === "in-progress") return "◐";
    return "✓";
  },

  _statusLabel(status) {
    if (status === "in-progress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  },

  _timeAgo(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    return Math.floor(diff / 86400) + "d ago";
  },

  // Dashboard recent feedback
  renderDashboardFeedback() {
    const container = document.getElementById("recent-feedback");
    if (!container) return;

    const recent = NexusData.feedback
      .filter((f) => f.status !== "resolved")
      .slice(0, 3);

    container.innerHTML = recent
      .map((f) => {
        const subject = NexusData.getSubject(f.subjectId);
        return `
        <div class="task-item" style="cursor:pointer;" onclick="App.navigateTo('feedback')">
          <div class="task-gravity-bar" style="background: ${subject ? subject.color : "var(--text-tertiary)"}"></div>
          <div class="task-body">
            <div class="task-title">${f.title}</div>
            <div class="task-meta">
              <span class="task-meta-item"><span class="badge ${f.status === "open" ? "badge-success" : "badge-warning"}">${f.status}</span></span>
              <span class="task-meta-item">${f.professor}</span>
              <span class="task-meta-item">${this._timeAgo(f.createdAt)}</span>
            </div>
          </div>
        </div>`;
      })
      .join("");

    if (recent.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="empty-state-text">No open feedback</div></div>';
    }

    container.classList.add("anim-stagger");
  },

  // Full feedback view
  renderFeedbackView(filter = "all") {
    const container = document.getElementById("feedback-grid");
    if (!container) return;

    let items = [...NexusData.feedback];
    if (filter !== "all") {
      items = items.filter((f) => f.status === filter);
    }

    if (items.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">No feedback items match this filter</div></div>';
      return;
    }

    container.innerHTML = items
      .map((f, idx) => {
        const subject = NexusData.getSubject(f.subjectId);
        return `
        <div class="issue-card" data-id="${f.id}" id="issue-${f.id}">
          <div class="issue-card-main" onclick="FeedbackManager.toggleExpand('${f.id}')">
            <div class="issue-status-col">
              <div class="issue-status-icon ${f.status}">${this._statusIcon(f.status)}</div>
            </div>
            <div class="issue-body">
              <div class="issue-header">
                <div class="issue-title">${f.title}</div>
                <span class="issue-number">#${idx + 1}</span>
              </div>
              <div class="issue-comment" style="overflow-x: hidden;">${f.comment}</div>
              <div class="issue-meta">
                <span class="issue-meta-item"><span class="issue-professor">${f.professor}</span></span>
                <span class="issue-meta-item">${subject ? subject.code : ""}</span>
                <span class="issue-meta-item">${this._timeAgo(f.createdAt)}</span>
                <span class="issue-meta-item">💬 ${f.replies.length}</span>
              </div>
            </div>
            <div class="issue-actions" onclick="event.stopPropagation()">
              <div class="custom-dropdown" style="position:relative;">
                <button class="status-select custom-dropdown-btn" onclick="FeedbackManager.toggleDropdown('${f.id}')" style="display:flex; align-items:center; gap:4px; border:1px solid var(--border-color); background:var(--bg-tertiary); padding:4px 12px; border-radius:12px; font-size:0.75rem; color:var(--text-secondary); cursor:pointer;">
                  <span>${this._statusIcon(f.status)} ${this._statusLabel(f.status)}</span>
                  <span style="font-size:0.6rem; opacity:0.6; margin-left:4px;">▼</span>
                </button>
                <div class="custom-dropdown-menu" id="dropdown-${f.id}" style="display:none; position:absolute; top:100%; right:0; margin-top:4px; background:var(--bg-secondary); border:1px solid var(--border-color); box-shadow:var(--shadow-md); border-radius:8px; z-index:100; min-width:130px; overflow:hidden;">
                  <div class="dropdown-item" style="padding:8px 12px;margin:0; cursor:pointer; font-size:0.8rem; transition:background 0.2s; color:var(--text-primary);" onmouseover="this.style.background='var(--color-primary-subtle)'" onmouseout="this.style.background='transparent'" onclick="FeedbackManager.changeStatus('${f.id}', 'open')">● Open</div>
                  <div class="dropdown-item" style="padding:8px 12px; cursor:pointer; font-size:0.8rem; transition:background 0.2s; color:var(--text-primary);" onmouseover="this.style.background='var(--color-primary-subtle)'" onmouseout="this.style.background='transparent'" onclick="FeedbackManager.changeStatus('${f.id}', 'in-progress')">◐ In Progress</div>
                  <div class="dropdown-item" style="padding:8px 12px; cursor:pointer; font-size:0.8rem; transition:background 0.2s; color:var(--text-primary);" onmouseover="this.style.background='var(--color-primary-subtle)'" onmouseout="this.style.background='transparent'" onclick="FeedbackManager.changeStatus('${f.id}', 'resolved')">✓ Resolved</div>
                </div>
              </div>
            </div>
          </div>
          <div class="issue-thread">
            <div class="thread-timeline">
              ${f.replies
                .map(
                  (r) => `
                <div class="thread-item">
                  <div class="thread-author">${r.author}</div>
                  <div class="thread-time">${this._timeAgo(r.time)}</div>
                  <div class="thread-content">${r.content}</div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="issue-reply">
              <textarea class="textarea" placeholder="Write a reply..." id="reply-${f.id}"></textarea>
              <button class="btn btn-primary btn-sm" onclick="FeedbackManager.addReply('${f.id}')">Reply</button>
            </div>
          </div>
        </div>`;
      })
      .join("");

    container.classList.add("anim-stagger");
  },

  toggleExpand(id) {
    const card = document.getElementById(`issue-${id}`);
    if (card) {
      card.classList.toggle("expanded");
    }
  },

  toggleDropdown(id) {
    document.querySelectorAll(".custom-dropdown-menu").forEach((el) => {
      if (el.id !== `dropdown-${id}`) el.style.display = "none";
    });
    
    document.querySelectorAll(".issue-card").forEach((card) => {
      card.style.zIndex = "";
      card.style.position = "";
    });

    const menu = document.getElementById(`dropdown-${id}`);
    if (menu) {
      const isHidden = menu.style.display === "none";
      menu.style.display = isHidden ? "block" : "none";
      
      const card = document.getElementById(`issue-${id}`);
      if (card && isHidden) {
        card.style.position = "relative";
        card.style.zIndex = "100";
      }
    }
  },

  changeStatus(id, newStatus) {
    const feedback = NexusData.feedback.find((f) => f.id === id);
    if (feedback) {
      feedback.status = newStatus;
      NexusData.saveFeedback();
      this.renderFeedbackView(this.currentFilter);
      this.renderDashboardFeedback();
      App.showToast(
        "✅",
        `Issue status changed to ${this._statusLabel(newStatus)}`,
      );
    }

    document
      .querySelectorAll(".custom-dropdown-menu")
      .forEach((el) => (el.style.display = "none"));
      
    document.querySelectorAll(".issue-card").forEach((card) => {
      card.style.zIndex = "";
      card.style.position = "";
    });
  },

  addReply(id) {
    const textarea = document.getElementById(`reply-${id}`);
    if (!textarea || !textarea.value.trim()) return;

    const feedback = NexusData.feedback.find((f) => f.id === id);
    if (feedback) {
      feedback.replies.push({
        author: NexusData.student.name,
        content: textarea.value.trim(),
        time: new Date().toISOString(),
      });
      NexusData.saveFeedback();
      this.renderFeedbackView(this.currentFilter);
      App.showToast("💬", "Reply posted");
      // Re-expand the card
      setTimeout(() => this.toggleExpand(id), 50);
    }
  },

  initFilters() {
    const filterBtns = document.querySelectorAll("#feedback-view .filter-btn");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.status;
        this.renderFeedbackView(this.currentFilter);
      });
    });
  },
};
