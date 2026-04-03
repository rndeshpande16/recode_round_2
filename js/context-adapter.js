/**
 * Context Adapter — Contextual UI Adaptation
 * Dashboard transforms when a class is in session
 */
const ContextAdapter = {
  isSimulating: false,
  simulatedClass: null,
  checkInterval: null,

  init() {
    this.checkContext();
    // Check every 30 seconds
    this.checkInterval = setInterval(() => this.checkContext(), 30000);
  },

  checkContext() {
    const activeClass = this.getActiveClass();

    if (activeClass || this.isSimulating) {
      const cls = activeClass || this.simulatedClass;
      this.activateSessionMode(cls);
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
      App.showToast('📡', 'Class simulation ended');
    } else {
      // Pick a class to simulate
      const classes = NexusData.getTodayClasses();
      let classToSim;
      if (classes.length > 0) {
        classToSim = classes[0];
      } else {
        // Use first subject as fallback
        const firstSubject = NexusData.subjects[0];
        classToSim = {
          subject: firstSubject,
          room: 'Room 401, CS Building',
          startHour: new Date().getHours(),
          startMin: 0,
          endHour: new Date().getHours() + 1,
          endMin: 30,
        };
      }
      this.isSimulating = true;
      this.simulatedClass = classToSim;
      this.activateSessionMode(classToSim);
      App.showToast('📡', `Simulating: ${classToSim.subject.name}`);
    }
  },

  activateSessionMode(classInfo) {
    if (!classInfo || !classInfo.subject) return;

    const body = document.body;
    body.setAttribute('data-context', 'in-session');

    // Update context indicator
    const dot = document.querySelector('.context-dot');
    const text = document.querySelector('.context-text');
    if (dot) {
      dot.classList.add('pulsing');
      dot.style.background = 'var(--color-accent)';
    }
    if (text) {
      text.textContent = classInfo.subject.code + ' — Live';
    }

    // Show context banner on dashboard
    this.showSessionBanner(classInfo);

    // Transform dashboard if we're on it
    this.collapseDashboard(classInfo);
  },

  deactivateSessionMode() {
    const body = document.body;
    body.setAttribute('data-context', 'default');

    const dot = document.querySelector('.context-dot');
    const text = document.querySelector('.context-text');
    if (dot) {
      dot.classList.remove('pulsing');
      dot.style.background = '';
    }
    if (text) {
      text.textContent = 'Ready';
    }

    // Remove session banner
    const banner = document.getElementById('session-banner');
    if (banner) banner.remove();

    // Restore dashboard
    this.restoreDashboard();
  },

  showSessionBanner(classInfo) {
    // Remove existing banner
    const existing = document.getElementById('session-banner');
    if (existing) existing.remove();

    const viewContainer = document.getElementById('dashboard-view');
    if (!viewContainer) return;

    const banner = document.createElement('div');
    banner.id = 'session-banner';
    banner.className = 'context-banner';
    banner.innerHTML = `
      <div class="context-banner-info">
        <div class="context-banner-dot"></div>
        <div>
          <div class="context-banner-text">📡 ${classInfo.subject.name} — In Session</div>
          <div class="context-banner-sub">${classInfo.room} · ${this._formatTime(classInfo.startHour, classInfo.startMin)} – ${this._formatTime(classInfo.endHour, classInfo.endMin)}</div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="ContextAdapter.toggleSimulation()">
        ${this.isSimulating ? 'End Simulation' : 'End Session'}
      </button>`;

    viewContainer.insertBefore(banner, viewContainer.firstChild);
  },

  collapseDashboard(classInfo) {
    const dashboard = document.getElementById('dashboard-view');
    if (!dashboard) return;

    // Hide standard cards
    const standardCards = dashboard.querySelectorAll('.dashboard-grid > .card');
    standardCards.forEach((card) => {
      card.style.display = 'none';
    });

    // Show (or create) live session panel
    let livePanel = document.getElementById('live-session-panel');
    if (!livePanel) {
      livePanel = document.createElement('div');
      livePanel.id = 'live-session-panel';
      livePanel.className = 'live-session-panel';

      const dashGrid = dashboard.querySelector('.dashboard-grid');
      if (dashGrid) {
        dashGrid.appendChild(livePanel);
      }
    }

    // Get related resources
    const relatedResources = NexusData.resources.filter((r) => r.subjectId === classInfo.subject.id);

    livePanel.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <h2 class="card-title">📝 Live Notes — ${classInfo.subject.code}</h2>
          <span class="badge badge-info">In Session</span>
        </div>
        <div class="card-content">
          <textarea class="live-notes-area" placeholder="Start taking notes for ${classInfo.subject.name}...

Tips:
• Use '##' for section headings
• Key concepts, examples, and questions
• Action items and follow-ups">${this._getSavedNotes(classInfo.subject.id)}</textarea>
        </div>
      </div>
      <div class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <h2 class="card-title">📚 Class Resources</h2>
        </div>
        <div class="card-content">
          <div class="live-resources-grid">
            ${relatedResources.map((r) => `
              <div class="resource-quick-item" onclick="ResourceManager.openPreview('${r.id}')">
                <span class="resource-quick-icon">${r.type === 'pdf' ? '📄' : r.type === 'video' ? '🎬' : '🔗'}</span>
                <span class="resource-quick-name">${r.title}</span>
              </div>
            `).join('')}
            ${relatedResources.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No resources for this subject</div></div>' : ''}
          </div>
        </div>
      </div>`;

    livePanel.classList.add('active');
    livePanel.style.display = 'contents';

    // Auto-save notes
    const textarea = livePanel.querySelector('.live-notes-area');
    if (textarea) {
      textarea.addEventListener('input', () => {
        localStorage.setItem(`nexus-notes-${classInfo.subject.id}`, textarea.value);
      });
    }
  },

  restoreDashboard() {
    const dashboard = document.getElementById('dashboard-view');
    if (!dashboard) return;

    // Show standard cards
    const standardCards = dashboard.querySelectorAll('.dashboard-grid > .card');
    standardCards.forEach((card) => {
      card.style.display = '';
    });

    // Hide live panel
    const livePanel = document.getElementById('live-session-panel');
    if (livePanel) {
      livePanel.classList.remove('active');
      livePanel.style.display = 'none';
    }
  },

  _formatTime(h, m) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  },

  _getSavedNotes(subjectId) {
    return localStorage.getItem(`nexus-notes-${subjectId}`) || '';
  },
};
