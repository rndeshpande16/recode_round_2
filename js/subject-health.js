/**
 * Subject Health — Dynamic Life Bars
 */
const SubjectHealth = {
  init() {
    this.render();
  },

  _getHealthClass(grade) {
    if (grade >= 80) return 'healthy';
    if (grade >= 60) return 'warning';
    return 'danger';
  },

  _getTrendIcon(trend) {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  },

  render() {
    const container = document.getElementById('health-grid');
    if (!container) return;

    // Overall GPA card
    let html = `
      <div class="gpa-card">
        <div class="gpa-value">${NexusData.getLiveGPA()}</div>
        <div class="gpa-label">Cumulative GPA</div>
        <div class="gpa-sub">${NexusData.student.semester} · ${NexusData.student.major}</div>
      </div>`;

    const liveSubjects = NexusData.getAllLiveSubjects();

    // Subject cards
    html += liveSubjects.map((s) => {
      const cls = this._getHealthClass(s.health);
      return `
        <div class="health-card">
          <div class="health-card-header">
            <div class="health-card-info">
              <div class="health-card-subject">${s.name}</div>
              <div class="health-card-professor">${s.code} · ${s.professor}</div>
            </div>
            <div class="health-card-grade ${cls}">
              ${s.grade}% Grade
              <span class="trend ${s.trend}" style="font-size:var(--text-sm);margin-left:4px;">${this._getTrendIcon(s.trend)}</span>
            </div>
          </div>
          <div class="life-bar-container">
            <div class="life-bar-label">
              <span class="life-bar-label-text">Academic Health</span>
              <span class="life-bar-label-value">${s.health}/100</span>
            </div>
            <div class="life-bar">
              <div class="life-bar-fill ${cls}" style="width: 0%" data-target="${s.health}"></div>
            </div>
          </div>
          <div class="health-stats">
            <div class="health-stat">
              <div class="health-stat-value">${s.assignmentsDone}/${s.assignmentsTotal}</div>
              <div class="health-stat-label">Assignments</div>
            </div>
            <div class="health-stat">
              <div class="health-stat-value">${s.attendance}%</div>
              <div class="health-stat-label">Attendance</div>
            </div>
            <div class="health-stat">
              <div class="health-stat-value">${s.credits}</div>
              <div class="health-stat-label">Credits</div>
            </div>
          </div>
        </div>`;
    }).join('');

    container.innerHTML = html;
    container.classList.add('anim-stagger');

    // Animate life bars
    setTimeout(() => this.animateLifeBars(), 100);
  },

  animateLifeBars() {
    document.querySelectorAll('.life-bar-fill[data-target]').forEach((bar) => {
      const target = parseInt(bar.dataset.target);
      requestAnimationFrame(() => {
        bar.style.width = target + '%';
      });
    });
  },
};
