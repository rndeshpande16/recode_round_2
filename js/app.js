/**
 * Nexus-Uni — Main Application Controller
 * Includes: Router, Scroll Observer, Carousel, Particles, Confetti
 */

/* ===== SCROLL OBSERVER ===== */
const ScrollObserver = {
  observer: null,

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    this.observe();
  },

  observe() {
    document.querySelectorAll('[data-scroll]:not(.in-view)').forEach((el) => {
      this.observer.observe(el);
    });
  },
};

/* ===== CAROUSEL ===== */
const Carousel = {
  currentSlide: 0,
  totalSlides: 0,
  autoInterval: null,

  init() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    this.totalSlides = track.children.length;
    if (this.totalSlides === 0) return;

    const prev = document.querySelector('.carousel-btn-prev');
    const next = document.querySelector('.carousel-btn-next');
    if (prev) prev.addEventListener('click', () => this.prev());
    if (next) next.addEventListener('click', () => this.next());

    this.renderDots();
    this.startAuto();

    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAuto());
      carousel.addEventListener('mouseleave', () => this.startAuto());
    }
  },

  goTo(index) {
    this.currentSlide = ((index % this.totalSlides) + this.totalSlides) % this.totalSlides;
    const track = document.querySelector('.carousel-track');
    if (track) {
      track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
    this.updateDots();
  },

  next() { this.goTo(this.currentSlide + 1); },
  prev() { this.goTo(this.currentSlide - 1); },

  startAuto() {
    this.stopAuto();
    this.autoInterval = setInterval(() => this.next(), 5000);
  },

  stopAuto() {
    if (this.autoInterval) clearInterval(this.autoInterval);
  },

  renderDots() {
    const container = document.querySelector('.carousel-dots');
    if (!container) return;
    container.innerHTML = Array.from({ length: this.totalSlides }, (_, i) =>
      `<button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="Carousel.goTo(${i})"></button>`
    ).join('');
  },

  updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentSlide);
    });
  },
};

/* ===== PARTICLES ===== */
const Particles = {
  init() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 15;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 12) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  },
};

/* ===== PARALLAX ===== */
const Parallax = {
  init() {
    const viewContainer = document.getElementById('view-container');
    if (!viewContainer) return;

    viewContainer.addEventListener('scroll', () => {
      const scrollY = viewContainer.scrollTop;
      document.querySelectorAll('.parallax-bg').forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  },
};

/* ===== MAIN APP ===== */
const App = {
  currentView: 'dashboard',

  init() {
    ScrollObserver.init();
    ThemeManager.init();
    CommandPalette.init();
    PriorityHub.init();
    FeedbackManager.init();
    ResourceManager.init();
    KnowledgeGraph.init();
    SubjectHealth.init();
    ContextAdapter.init();
    CalendarController.init();
    Carousel.init();
    Particles.init();
    Parallax.init();

    this.checkOnboarding();
    this.initNavigation();
    this.updateStats();
    this.renderUpcomingClasses();
    this.renderTimeline();
    this.handleHashChange();
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.updateNavBadges();
    this.initMobileNav();
    this.initSidebarToggle();
    this.renderWelcome();

    console.log('Nexus-Uni initialized');
  },

  checkOnboarding() {
    const name = localStorage.getItem('nexus-student-name');
    if (!name) {
      this.promptName();
    } else {
      this.setStudentName(name);
    }
  },

  promptName() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay" style="backdrop-filter: blur(10px);">
        <div class="modal anim-scale-in" style="max-width:400px; padding:20px; text-align:center;">
          <h2 style="margin-bottom:var(--space-md); font-size:var(--text-2xl);" class="gradient-text">Welcome to Nexus-Uni</h2>
          <p style="color:var(--text-secondary); margin-bottom:var(--space-xl);">Please enter your name to personalize your command center.</p>
          <input type="text" id="student-name-input" class="input" placeholder="Your name..." style="text-align:center; font-size:var(--text-lg); padding:var(--space-md); margin-bottom:var(--space-lg);" />
          <button class="btn btn-primary btn-ripple" style="width:100%;" onclick="App.saveStudentName()">Initialize Cockpit</button>
        </div>
      </div>
    `;
    setTimeout(() => document.getElementById('student-name-input')?.focus(), 100);
  },

  saveStudentName() {
    const input = document.getElementById('student-name-input');
    const name = input?.value.trim();
    if (name) {
      localStorage.setItem('nexus-student-name', name);
      this.setStudentName(name);
      document.getElementById('modal-container').innerHTML = '';
      this.showConfetti();
      this.showToast('<i class="fa-solid fa-rocket"></i>', `Welcome aboard, ${name}!`);
    } else {
      if (input) input.style.border = '1px solid var(--color-danger)';
    }
  },

  setStudentName(name) {
    const greeting = document.getElementById('user-greeting');
    if (greeting) {
      const hours = new Date().getHours();
      let timeOfDay = 'Evening';
      if (hours < 12) timeOfDay = 'Morning';
      else if (hours < 17) timeOfDay = 'Afternoon';
      greeting.innerHTML = `Hi <span style="color:var(--text-primary); margin-left:2px;">${name}</span>`;
      this.renderWelcome();
    }
  },

  renderWelcome() {
    const welcomeSection = document.getElementById('welcome-section');
    if (!welcomeSection) return;

    const name = localStorage.getItem('nexus-student-name') || 'Scholar';
    const hours = new Date().getHours();
    let greeting = 'Good evening';
    if (hours < 12) greeting = 'Good morning';
    else if (hours < 17) greeting = 'Good afternoon';

    welcomeSection.innerHTML = `
      <div class="welcome-card" data-scroll="fade-up">
        <div class="welcome-content">
          <h1 class="welcome-title">${greeting}, <span class="gradient-text">${name}</span></h1>
          <p class="welcome-subtitle">Your academic command center is synchronized and ready for action.</p>
        </div>
        <div class="welcome-stats">
          <div class="welcome-stat">
            <span class="stat-num">${NexusData.tasks.filter(t => !t.completed).length}</span>
            <span class="stat-desc">Pending Tasks</span>
          </div>
          <div class="welcome-stat">
            <span class="stat-num">${NexusData.getTodayClasses().length}</span>
            <span class="stat-desc">Classes Today</span>
          </div>
        </div>
      </div>
    `;
  },

  initNavigation() {
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.dataset.view;
        if (view) this.navigateTo(view);
      });
    });

    document.querySelectorAll('.card-link[data-view]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(link.dataset.view);
      });
    });
  },

  navigateTo(view) {
    document.querySelector('.view.active')?.classList.remove('active');
    document.querySelector('.nav-item.active')?.classList.remove('active');

    const viewEl = document.getElementById(`${view}-view`);
    const navEl = document.querySelector(`.nav-item[data-view="${view}"]`);

    if (viewEl) {
      viewEl.classList.add('active', 'anim-slide-up');
      setTimeout(() => viewEl.classList.remove('anim-slide-up'), 400);
    }
    if (navEl) navEl.classList.add('active');

    this.currentView = view;

    const titles = {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      tasks: 'Tasks',
      feedback: 'Feedback Loop',
      resources: 'Resource Shelf',
      graph: 'Knowledge Graph',
      health: 'Subject Health',
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = titles[view] || view;

    window.location.hash = view;

    if (view === 'calendar') {
      setTimeout(() => CalendarController.render(), 100);
    }
    if (view === 'graph') {
      setTimeout(() => KnowledgeGraph.render(), 100);
    }
    if (view === 'health') {
      setTimeout(() => SubjectHealth.animateLifeBars(), 200);
    }

    setTimeout(() => ScrollObserver.observe(), 100);

    this.closeMobileSidebar();
  },

  handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    const validViews = ['dashboard', 'calendar', 'tasks', 'feedback', 'resources', 'graph', 'health'];
    if (hash && validViews.includes(hash)) {
      this.navigateTo(hash);
    }
  },

  updateStats() {
    const stats = PriorityHub.getStats();
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems[0]) statItems[0].querySelector('.stat-value').textContent = stats.tasksDue;
    if (statItems[1]) statItems[1].querySelector('.stat-value').textContent = stats.avgGrade;
    if (typeof d3 !== 'undefined') {
      this.drawRadarChart();
    } else {
      setTimeout(() => this.drawRadarChart(), 300);
    }

    // Also re-render the Subject Health grid stats entirely when global stats update
    if (typeof SubjectHealth !== 'undefined' && typeof SubjectHealth.render === 'function') {
      SubjectHealth.render();
    }
    this.renderTimeline();
  },

  updateNavBadges() {
    const tasksBadge = document.querySelector('.nav-item[data-view="tasks"] .nav-badge');
    if (tasksBadge) {
      const pending = NexusData.tasks.filter((t) => !t.completed).length;
      tasksBadge.textContent = pending;
    }

    const fbBadge = document.querySelector('.nav-item[data-view="feedback"] .nav-badge');
    if (fbBadge) {
      const openFb = NexusData.feedback.filter((f) => f.status === 'open').length;
      fbBadge.textContent = openFb;
    }
  },

  renderUpcomingClasses() {
    const container = document.getElementById('upcoming-classes');
    if (!container) return;

    const todayClasses = NexusData.getTodayClasses();

    if (todayClasses.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-face-smile-beam"></i></div><div class="empty-state-text">No classes today!</div></div>';
      return;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    container.innerHTML = todayClasses.map((c) => {
      const start = c.startHour * 60 + c.startMin;
      const end = c.endHour * 60 + c.endMin;
      const isActive = currentMinutes >= start && currentMinutes < end;
      const isPast = currentMinutes >= end;

      return `
        <div class="class-item ${isActive ? 'in-session' : ''}" style="${isPast ? 'opacity:0.5;' : ''}">
          <span class="class-time">${this._formatTime(c.startHour, c.startMin)}</span>
          <span class="class-color" style="background:${c.subject.color}"></span>
          <div class="class-info">
            <div class="class-name">${c.subject.name}</div>
            <div class="class-room">${c.room}</div>
          </div>
          ${isActive ? '<span class="badge badge-info" style="animation: pulse-dot 2s infinite;">LIVE</span>' : ''}
        </div>`;
    }).join('');

    container.classList.add('anim-stagger');
  },

  renderTimeline() {
    const container = document.getElementById('dashboard-timeline');
    if (!container) return;

    const pending = NexusData.tasks
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 8); // show max 8

    if (pending.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:var(--space-lg);width:100%;"><div class="empty-state-text">No upcoming tasks! <i class="fa-solid fa-face-smile-beam"></i></div></div>';
      return;
    }

    container.innerHTML = pending.map((t) => {
      const subject = NexusData.getSubject(t.subjectId);
      const daysLeft = Math.ceil((new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

      let dateString = '';
      if (daysLeft < 0) dateString = 'Overdue by ' + Math.abs(daysLeft) + 'd';
      else if (daysLeft === 0) dateString = 'Due Today';
      else if (daysLeft === 1) dateString = 'Due Tomorrow';
      else dateString = `Due in ${daysLeft}d`;

      return `
        <div class="timeline-node anim-slide-up">
          <div class="timeline-dot" style="background:${subject ? subject.color : 'var(--color-primary)'}; box-shadow: 0 0 10px ${subject ? subject.color : 'var(--color-primary-glow)'};"></div>
          <div class="timeline-date">${dateString}</div>
          <div class="timeline-title">${t.title}</div>
          <div class="timeline-cat">${t.type} · ${subject ? subject.code : ''}</div>
        </div>
      `;
    }).join('');
  },

  _formatTime(h, m) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  },

  initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('sidebar-overlay');

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
        overlay?.classList.toggle('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => this.closeMobileSidebar());
    }
  },

  initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
      });
    }
  },

  closeMobileSidebar() {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
  },

  showToast(icon, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  drawRadarChart() {
    const containerId = '#radar-chart';
    const container = document.querySelector(containerId);
    if (!container || typeof d3 === 'undefined') return;

    container.innerHTML = '';

    const subjects = NexusData.getAllLiveSubjects();
    if (subjects.length === 0) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 260;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

    const svg = d3.select(containerId)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const features = subjects.map(s => s.code);
    const data = subjects.map(s => s.grade);

    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);
    const angleSlice = Math.PI * 2 / features.length;

    const levels = 5;
    for (let i = 0; i < levels; i++) {
      const levelFactor = radius * ((i + 1) / levels);
      svg.append('circle')
        .attr('r', levelFactor)
        .style('fill', 'none')
        .style('stroke', 'var(--border)')
        .style('stroke-dasharray', '4 4');

      svg.append('text')
        .attr('y', -levelFactor)
        .attr('dy', '0.4em')
        .style('font-size', '10px')
        .style('fill', 'var(--text-secondary)')
        .text(Math.round(((i + 1) * 100) / levels));
    }

    const axis = svg.selectAll('.axis')
      .data(features).enter()
      .append('g')
      .attr('class', 'axis');

    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('stroke', 'var(--border)')
      .style('stroke-width', '1px');

    axis.append('text')
      .attr('x', (d, i) => rScale(115) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(115) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'var(--text-primary)');

    const radarLine = d3.lineRadial()
      .angle((d, i) => i * angleSlice)
      .radius(d => rScale(d))
      .curve(d3.curveLinearClosed);

    svg.append('path')
      .datum(data)
      .attr('d', radarLine)
      .style('fill', 'var(--color-primary)')
      .style('fill-opacity', 0.4)
      .style('stroke', 'var(--color-primary)')
      .style('stroke-width', 2)
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const i = d3.interpolate(features.map(() => 0), d);
        return function (t) { return radarLine(i(t)); }
      });

    svg.selectAll('.radar-point')
      .data(data)
      .enter().append('circle')
      .attr('cx', (d, i) => rScale(d) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('r', 4)
      .style('fill', 'var(--color-primary)');

    this.updatePerformanceInsights(subjects);
  },

  updatePerformanceInsights(subjects) {
    const inc = document.getElementById('performance-insights');
    if (!inc) return;

    const sorted = [...subjects].sort((a, b) => b.grade - a.grade);
    const strong = sorted.slice(0, 2);
    const weak = sorted[sorted.length - 1];

    inc.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
        <span style="color:var(--color-success);"><i class="fa-regular fa-lightbulb"></i> <strong>Strong:</strong> ${strong.map(s => s.code).join(', ')}</span>
        <span style="color:var(--color-warning);"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Focus:</strong> ${weak.code}</span>
      </div>
      <p style="color:var(--text-secondary); margin:0;">You are excelling in <strong>${strong[0].name}</strong> with a live grade of ${strong[0].grade}%. Try to allocate more time to <strong>${weak.name}</strong> to improve its ${weak.grade}% standing.</p>
    `;
  },

  showConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#7c5cfc', '#22d3ee', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316'];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';

      const shapes = ['circle', 'square', 'rectangle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === 'circle') {
        piece.style.borderRadius = '50%';
        piece.style.width = (6 + Math.random() * 6) + 'px';
        piece.style.height = piece.style.width;
      } else if (shape === 'rectangle') {
        piece.style.width = (4 + Math.random() * 4) + 'px';
        piece.style.height = (8 + Math.random() * 8) + 'px';
        piece.style.borderRadius = '2px';
      } else {
        piece.style.width = (6 + Math.random() * 6) + 'px';
        piece.style.height = piece.style.width;
        piece.style.borderRadius = '2px';
      }

      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 3000);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
