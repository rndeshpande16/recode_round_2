/**
 * Command Palette — Cmd+K / Ctrl+K
 * Search across navigation, tasks, resources, and actions
 */
const CommandPalette = {
  isOpen: false,
  selectedIndex: 0,
  filteredItems: [],

  commands: [
    { icon: '🎯', label: 'Go to Dashboard', action: () => App.navigateTo('dashboard'), category: 'Navigation' },
    { icon: '✓', label: 'Go to Tasks', action: () => App.navigateTo('tasks'), category: 'Navigation' },
    { icon: '💬', label: 'Go to Feedback', action: () => App.navigateTo('feedback'), category: 'Navigation' },
    { icon: '📚', label: 'Go to Resources', action: () => App.navigateTo('resources'), category: 'Navigation' },
    { icon: '🕸️', label: 'Go to Knowledge Graph', action: () => App.navigateTo('graph'), category: 'Navigation' },
    { icon: '📊', label: 'Go to Subject Health', action: () => App.navigateTo('health'), category: 'Navigation' },
    { icon: '➕', label: 'Add New Task', action: () => { App.navigateTo('tasks'); PriorityHub.openAddModal(); }, category: 'Action' },
    { icon: '🌙', label: 'Toggle Theme', action: () => { ThemeManager.setTheme(ThemeManager.getTheme() === 'dark' ? 'light' : 'dark'); }, category: 'Action' },
    { icon: '📡', label: 'Simulate Class Session', action: () => { ContextAdapter.toggleSimulation(); }, category: 'Action' },
  ],

  init() {
    // Add task commands
    NexusData.tasks.forEach((task) => {
      const subject = NexusData.getSubject(task.subjectId);
      this.commands.push({
        icon: '📌',
        label: task.title,
        hint: subject ? subject.code : '',
        action: () => App.navigateTo('tasks'),
        category: 'Task',
      });
    });

    // Add resource commands
    NexusData.resources.forEach((res) => {
      this.commands.push({
        icon: res.type === 'pdf' ? '📄' : res.type === 'video' ? '🎬' : '🔗',
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
      const views = ['dashboard', 'tasks', 'feedback', 'resources', 'graph', 'health'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6) {
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
