/**
 * Resource Manager — Searchable tagged library with Quick-Preview modal
 */
const ResourceManager = {
  activeTag: null,
  searchQuery: '',
  dropdownSearchQuery: '',

  init() {
    this.renderDashboardResources();
    this.renderResourcesView();
    this.renderTagFilters();
    this.initSearch();
    this.initDropdown();
  },

  _getTypeIcon(type) {
    const icons = { 
      pdf: '<i class="fa-regular fa-file-pdf"></i>', 
      video: '<i class="fa-solid fa-video"></i>', 
      article: '<i class="fa-regular fa-newspaper"></i>', 
      link: '<i class="fa-solid fa-link"></i>' 
    };
    return icons[type] || '<i class="fa-regular fa-folder"></i>';
  },

  _getTypeLabel(type) {
    return type.toUpperCase();
  },

  // Dashboard quick resources
  renderDashboardResources() {
    const container = document.getElementById('quick-resources');
    if (!container) return;

    const recent = NexusData.resources.slice(0, 6);

    container.innerHTML = `<div class="resource-list-quick">${recent.map((r) => {
      return `
        <div class="resource-quick-item" onclick="App.navigateTo('resources'); setTimeout(() => ResourceManager.openPreview('${r.id}'), 300);">
          <span class="resource-quick-icon">${this._getTypeIcon(r.type)}</span>
          <span class="resource-quick-name">${r.title}</span>
        </div>`;
    }).join('')}</div>`;
  },

  // Full resources view
  renderResourcesView() {
    const container = document.getElementById('resources-grid');
    if (!container) return;

    let resources = [...NexusData.resources];

    // Filter by tag
    if (this.activeTag) {
      resources = resources.filter((r) => r.tags.includes(this.activeTag));
    }

    // Filter by search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      resources = resources.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (resources.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-book"></i></div><div class="empty-state-text">No resources match your search</div></div>';
      return;
    }

    container.innerHTML = resources.map((r) => {
      const subject = NexusData.getSubject(r.subjectId);
      return `
        <div class="resource-card" onclick="ResourceManager.openPreview('${r.id}')">
          <div class="resource-card-thumb ${r.type}">
            ${this._getTypeIcon(r.type)}
            <span class="resource-card-type">${this._getTypeLabel(r.type)}</span>
          </div>
          <div class="resource-card-body">
            <div class="resource-card-title">${r.title}</div>
            <div class="resource-card-subject">${subject ? subject.code + ' · ' + subject.name : ''}</div>
            <div class="resource-card-tags">
              ${r.tags.slice(0, 3).map((t) => `<span class="tag">${t}</span>`).join('')}
              ${r.tags.length > 3 ? `<span class="tag tag-more">+${r.tags.length - 3}</span>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');

    container.classList.add('anim-stagger');
  },

  renderTagFilters() {
    const container = document.getElementById('tag-filters');
    if (!container) return;

    // Collect all unique tags
    const allTags = new Set();
    NexusData.resources.forEach((r) => r.tags.forEach((t) => allTags.add(t)));

    let sorted = [...allTags].sort();
    
    // Filter tags based on dropdown search
    if (this.dropdownSearchQuery) {
      const q = this.dropdownSearchQuery.toLowerCase();
      sorted = sorted.filter(tag => tag.toLowerCase().includes(q));
    }

    let html = `<div class="dropdown-option ${!this.activeTag ? 'active' : ''}" data-tag="">All Filters</div>`;
    html += sorted.map((tag) => `<div class="dropdown-option ${this.activeTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</div>`).join('');
    
    container.innerHTML = html;

    container.querySelectorAll('.dropdown-option').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activeTag = el.dataset.tag || null;
        const label = document.getElementById('selected-filter-text');
        if (label) label.textContent = `Filter: ${this.activeTag || 'All'}`;
        this.renderTagFilters();
        this.renderResourcesView();
        this.toggleDropdown(false);
      });
    });
  },

  initSearch() {
    const input = document.getElementById('resource-search');
    if (input) {
      input.addEventListener('input', () => {
        this.searchQuery = input.value;
        this.renderResourcesView();
      });
    }

    const dropdownSearch = document.getElementById('custom-dropdown-search');
    if (dropdownSearch) {
      dropdownSearch.addEventListener('input', (e) => {
        this.dropdownSearchQuery = e.target.value;
        this.renderTagFilters();
      });
      dropdownSearch.addEventListener('click', (e) => e.stopPropagation());
    }
  },

  initDropdown() {
    const header = document.getElementById('custom-dropdown-header');
    if (header) {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrapper = document.getElementById('resource-tag-dropdown-wrapper');
        const isOpen = wrapper.classList.contains('open');
        this.toggleDropdown(!isOpen);
      });
    }

    document.addEventListener('click', () => {
      this.toggleDropdown(false);
    });
  },

  toggleDropdown(show) {
    const wrapper = document.getElementById('resource-tag-dropdown-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('open', show);
    }
  },

  // Quick-Preview modal
  openPreview(resourceId) {
    const resource = NexusData.resources.find((r) => r.id === resourceId);
    if (!resource) return;

    const subject = NexusData.getSubject(resource.subjectId);
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    let embedContent = '';
    if (resource.type === 'pdf') {
      embedContent = `<iframe src="${resource.url}" title="PDF Preview"></iframe>`;
    } else if (resource.type === 'video' && resource.url.includes('youtube.com/embed')) {
      embedContent = `<iframe src="${resource.url}" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      embedContent = `
        <div class="preview-embed-placeholder">
          <div class="placeholder-icon">${this._getTypeIcon(resource.type)}</div>
          <div class="placeholder-text">${resource.type === 'article' ? 'Article preview' : 'External link'}</div>
          <a href="${resource.url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Open in new tab <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>`;
    }

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="ResourceManager.closePreview(event)">
        <div class="modal modal-lg preview-modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>${resource.title}</h2>
            <button class="modal-close" onclick="ResourceManager.closePreview()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="preview-content">
              <div class="preview-embed">${embedContent}</div>
              <div class="preview-meta">
                <div class="preview-meta-item">
                  <span class="preview-meta-label">Subject</span>
                  <span class="preview-meta-value">${subject ? subject.name : 'General'}</span>
                </div>
                <div class="preview-meta-item">
                  <span class="preview-meta-label">Type</span>
                  <span class="preview-meta-value">${resource.type.toUpperCase()}</span>
                </div>
                <div class="preview-meta-item">
                  <span class="preview-meta-label">Size</span>
                  <span class="preview-meta-value">${resource.size}</span>
                </div>
                <div class="preview-meta-item">
                  <span class="preview-meta-label">Added</span>
                  <span class="preview-meta-value">${new Date(resource.addedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div class="preview-tags">
                ${resource.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
              </div>
              <div class="preview-actions">
                <a href="${resource.url}" target="_blank" rel="noopener" class="btn btn-primary">Open Resource <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                <button class="btn btn-secondary" onclick="ResourceManager.closePreview()">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    // Escape to close
    this._escHandler = (e) => { if (e.key === 'Escape') this.closePreview(); };
    document.addEventListener('keydown', this._escHandler);
  },

  closePreview(event) {
    if (event && event.target !== event.currentTarget) return;
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) modalContainer.innerHTML = '';
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  },
};
