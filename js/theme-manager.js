/**
 * Theme Manager — 5 Theme Picker with persistence
 */
const ThemeManager = {
  themes: [
    { id: 'dark', name: 'Dark', icon: '🌙', swatch: '#0a0e1a' },
    { id: 'light', name: 'Light', icon: '☀️', swatch: '#f8fafc' },
    { id: 'high-contrast', name: 'High Contrast', icon: '🔲', swatch: '#000000' },
    { id: 'monokai', name: 'Monokai', icon: '🌿', swatch: '#272822' },
    { id: 'nord', name: 'Nord', icon: '❄️', swatch: '#2e3440' },
  ],

  pickerOpen: false,

  init() {
    const saved = localStorage.getItem('nexus-theme') || 'dark';
    this.setTheme(saved);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePicker();
      });
    }

    document.addEventListener('click', (e) => {
      if (this.pickerOpen && !e.target.closest('.theme-picker') && !e.target.closest('.theme-toggle')) {
        this.closePicker();
      }
    });

    this.renderPicker();
  },

  setTheme(themeId) {
    const theme = this.themes.find((t) => t.id === themeId) || this.themes[0];
    document.body.setAttribute('data-theme', theme.id);
    localStorage.setItem('nexus-theme', theme.id);

    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = theme.icon;

    document.querySelectorAll('.theme-option').forEach((el) => {
      el.classList.toggle('active', el.dataset.theme === theme.id);
    });
  },

  getTheme() {
    return document.body.getAttribute('data-theme');
  },

  togglePicker() {
    this.pickerOpen ? this.closePicker() : this.openPicker();
  },

  openPicker() {
    this.pickerOpen = true;
    const picker = document.getElementById('theme-picker');
    if (picker) picker.classList.remove('hidden');
  },

  closePicker() {
    this.pickerOpen = false;
    const picker = document.getElementById('theme-picker');
    if (picker) picker.classList.add('hidden');
  },

  renderPicker() {
    const footer = document.querySelector('.sidebar-footer');
    if (!footer) return;

    const picker = document.createElement('div');
    picker.id = 'theme-picker';
    picker.className = 'theme-picker hidden';

    const currentTheme = this.getTheme();

    picker.innerHTML = this.themes.map((t) => `
      <div class="theme-option ${t.id === currentTheme ? 'active' : ''}" data-theme="${t.id}" onclick="ThemeManager.setTheme('${t.id}'); ThemeManager.closePicker();">
        <span class="theme-swatch" style="background:${t.swatch};"></span>
        <span>${t.icon} ${t.name}</span>
      </div>
    `).join('');

    footer.style.position = 'relative';
    footer.appendChild(picker);
  },
};
