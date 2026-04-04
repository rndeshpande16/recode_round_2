/**
 * Command Palette — Cmd+K / Ctrl+K
 * Search across navigation, tasks, resources, and actions
 */
const CommandPalette = {
  isOpen: false,
  selectedIndex: 0,
  filteredItems: [],

  commands: [
    { icon: '<i class="fa-solid fa-bullseye"></i>', label: 'Go to Dashboard', action: () => App.navigateTo('dashboard'), category: 'Navigation' },
    { icon: '<i class="fa-solid fa-calendar-days"></i>', label: 'Go to Calendar', action: () => App.navigateTo('calendar'), category: 'Navigation' },
    { icon: '<i class="fa-solid fa-check"></i>', label: 'Go to Tasks', action: () => App.navigateTo('tasks'), category: 'Navigation' },
    { icon: '<i class="fa-solid fa-comment-dots"></i>', label: 'Go to Feedback', action: () => App.navigateTo('feedback'), category: 'Navigation' },
    { icon: '<i class="fa-solid fa-book"></i>', label: 'Go to Resources', action: () => App.navigateTo('resources'), category: 'Navigation' },
    { icon: '<i class="fa-solid fa-diagram-project"></i>', label: 'Go to Knowledge Graph', action: () => App.navigateTo('graph'), category: 'Navigation' },
    { icon: '<i class="fa-solid fa-chart-simple"></i>', label: 'Go to Subject Health', action: () => App.navigateTo('health'), category: 'Navigation' },
    { icon: '<i class="fa-solid fa-plus"></i>', label: 'Add New Task', action: () => { App.navigateTo('tasks'); PriorityHub.openAddModal(); }, category: 'Action' },
    { icon: '<i class="fa-solid fa-moon"></i>', label: 'Toggle Theme', action: () => { ThemeManager.setTheme(ThemeManager.getTheme() === 'dark' ? 'light' : 'dark'); }, category: 'Action' },
    { icon: '<i class="fa-solid fa-satellite-dish"></i>', label: 'Simulate Class Session', action: () => { ContextAdapter.toggleSimulation(); }, category: 'Action' },
    { icon: '<i class="fa-solid fa-graduation-cap"></i>', label: 'Enter Lecture Mode', action: () => { ContextAdapter.activateMode('lecture'); }, category: 'Focus Modes' },
    { icon: '<i class="fa-solid fa-brain"></i>', label: 'Enter Deep Work Mode', action: () => { ContextAdapter.activateMode('deep_work'); }, category: 'Focus Modes' },
    { icon: '<i class="fa-solid fa-bolt-lightning"></i>', label: 'Enter Quick Notes Mode', action: () => { ContextAdapter.activateMode('quick_notes'); }, category: 'Focus Modes' },
    { icon: '<i class="fa-solid fa-arrow-left"></i>', label: 'Exit Focus Mode', action: () => { ContextAdapter.exitMode(); }, category: 'Focus Modes' },
  ],

  init() {
    // Add task commands
    NexusData.tasks.forEach((task) => {
      const subject = NexusData.getSubject(task.subjectId);
      this.commands.push({
        icon: '<i class="fa-solid fa-paperclip"></i>',
        label: task.title,
        hint: subject ? subject.code : '',
        action: () => App.navigateTo('tasks'),
        category: 'Task',
      });
    });

    // Add resource commands
    NexusData.resources.forEach((res) => {
      this.commands.push({
        icon: res.type === 'pdf' ? '<i class="fa-regular fa-file-pdf"></i>' : res.type === 'video' ? '<i class="fa-solid fa-video"></i>' : '<i class="fa-solid fa-link"></i>',
        label: res.title,
        action: () => { App.navigateTo('resources'); setTimeout(() => ResourceManager.openPreview(res.id), 300); },
        category: 'Resource',
      });
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Number key shortcuts for views
    document.addEventListener('keydown', (e) => {
      if (this.isOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;
      if (target.closest('.ql-editor') || target.isContentEditable) return;
      const views = ['dashboard', 'calendar', 'tasks', 'feedback', 'resources', 'graph', 'health'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7) {
        e.preventDefault();
        App.navigateTo(views[num - 1]);
      }
    });

    // Click handler for hint button
    const hintBtn = document.getElementById('cmd-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.toggle());
    }

    // Backdrop click
    const backdrop = document.querySelector('.command-palette-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    // Input handler
    const input = document.getElementById('command-input');
    if (input) {
      input.addEventListener('input', () => this.filter(input.value));
      input.addEventListener('keydown', (e) => this.handleKeyNav(e));
    }
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    this.selectedIndex = 0;
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('command-input');
    if (palette) palette.classList.remove('hidden');
    if (input) { input.value = ''; input.focus(); }
    this.filter('');
  },

  close() {
    this.isOpen = false;
    const palette = document.getElementById('command-palette');
    if (palette) palette.classList.add('hidden');
  },

  filter(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredItems = [...this.commands];
    } else {
      const regexStr = q.split('').map(char => {
        if ('\\^$*+?.()|{}[]'.includes(char)) return '\\\\' + char;
        return char;
      }).join('.*');
      const regex = new RegExp(regexStr, 'i');

      this.filteredItems = this.commands.filter((cmd) =>
        regex.test(cmd.label) ||
        (cmd.hint && regex.test(cmd.hint)) ||
        regex.test(cmd.category)
      );
    }

    this.selectedIndex = 0;
    this.render();
  },

  render() {
    const container = document.getElementById('command-results');
    if (!container) return;

    if (this.filteredItems.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:var(--space-xl);"><div class="empty-state-text">No results found</div></div>';
      return;
    }

    // Group by category
    const groups = {};
    this.filteredItems.forEach((item, i) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push({ ...item, globalIndex: i });
    });

    let html = '';
    for (const [category, items] of Object.entries(groups)) {
      html += `<div style="padding:var(--space-sm) var(--space-lg);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);font-weight:600;margin-top:var(--space-sm);">${category}</div>`;
      items.forEach((item) => {
        html += `<div class="command-item ${item.globalIndex === this.selectedIndex ? 'selected' : ''}" data-index="${item.globalIndex}">
          <span class="command-item-icon">${item.icon}</span>
          <span class="command-item-label">${item.label}</span>
          ${item.hint ? `<span class="command-item-hint">${item.hint}</span>` : ''}
        </div>`;
      });
    }
    container.innerHTML = html;

    // Click handlers
    container.querySelectorAll('.command-item').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index);
        this.executeItem(idx);
      });
    });
  },

  handleKeyNav(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredItems.length - 1);
      this.render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this.render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.executeItem(this.selectedIndex);
    }
  },

  executeItem(index) {
    const item = this.filteredItems[index];
    if (item) {
      this.close();
      item.action();
    }
  },
};
