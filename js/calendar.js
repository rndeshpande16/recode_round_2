/**
 * Calendar Controller - Renders month grid with lectures and tasks
 */
const CalendarController = {
  currentDate: new Date(),
  selectedDate: null,

  init() {
    this.render();
    this.initEvents();
  },

  initEvents() {
    const prevBtn = document.getElementById('calendar-prev');
    const nextBtn = document.getElementById('calendar-next');
    const todayBtn = document.getElementById('calendar-today');
    const closePanelBtn = document.getElementById('close-day-panel');

    if (prevBtn) prevBtn.addEventListener('click', () => this.changeMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.changeMonth(1));
    if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
    if (closePanelBtn) closePanelBtn.addEventListener('click', () => this.hideDayPanel());

    // Click outside to close panel
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('calendar-day-panel');
      if (panel && !panel.classList.contains('hidden') && !panel.contains(e.target) && !e.target.closest('.calendar-day')) {
        this.hideDayPanel();
      }
    });
  },

  changeMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.render();
  },

  goToToday() {
    this.currentDate = new Date();
    this.render();
  },

  render() {
    const grid = document.getElementById('calendar-grid');
    const monthYearLabel = document.getElementById('calendar-current-month');
    if (!grid || !monthYearLabel) return;

    grid.innerHTML = '';
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Month Label
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.currentDate);
    monthYearLabel.textContent = `${monthName} ${year}`;

    // Calculation
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

    // Previous Month Days
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      grid.appendChild(this.createDayElement(dayNum, true, year, month - 1));
    }

    // Current Month Days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = isThisMonth && today.getDate() === i;
      grid.appendChild(this.createDayElement(i, false, year, month, isToday));
    }

    // Next Month Days
    const remainingShelves = 42 - grid.children.length;
    for (let i = 1; i <= remainingShelves; i++) {
      grid.appendChild(this.createDayElement(i, true, year, month + 1));
    }
  },

  createDayElement(dayNum, isOtherMonth, year, month, isToday = false) {
    const el = document.createElement('div');
    const dateObj = new Date(year, month, dayNum);
    const dateStr = dateObj.toISOString().split('T')[0];
    
    // Determine status
    const status = this.getDayStatus(dateObj);
    
    el.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} status-${status}`;
    el.innerHTML = `<div class="day-number">${dayNum}</div><div class="day-events" id="events-${dateStr}"></div><div class="mobile-status-dot"></div>`;
    
    // Day Click
    el.onclick = () => this.showDayPanel(dateObj);

    // Populate events
    this.populateDayEvents(dateObj, el.querySelector('.day-events'));

    return el;
  },

  getDayStatus(date) {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    
    const tasks = NexusData.tasks.filter(t => t.dueDate === dateStr);
    if (tasks.length > 0) return 'task';
    
    const lectures = NexusData.schedule.filter(c => c.day === dayOfWeek);
    if (lectures.length > 0) return 'class';
    
    return 'free';
  },

  populateDayEvents(date, container) {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    
    // Filter lectures for this day of week
    const lectures = NexusData.schedule.filter(c => c.day === dayOfWeek);
    
    // Filter tasks due this specific date
    const tasks = NexusData.tasks.filter(t => t.dueDate === dateStr);

    let html = '';
    
    lectures.forEach(l => {
      const subject = NexusData.getSubject(l.subjectId);
      html += `<div class="event-marker event-lecture" title="${subject ? subject.name : 'Lecture'}">${subject ? subject.code : 'Lec'}</div>`;
    });

    tasks.forEach(t => {
      html += `<div class="event-marker event-task" title="${t.title}">${t.title}</div>`;
    });

    container.innerHTML = html;
  },

  showDayPanel(date) {
    this.selectedDate = date;
    const panel = document.getElementById('calendar-day-panel');
    const title = document.getElementById('panel-date-title');
    const lectureContainer = document.getElementById('day-panel-lectures');
    const taskContainer = document.getElementById('day-panel-tasks');

    if (!panel || !title || !lectureContainer || !taskContainer) return;

    const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
    title.textContent = formattedDate;

    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

    // Lectures
    const lectures = NexusData.schedule.filter(c => c.day === dayOfWeek);
    if (lectures.length > 0) {
      lectureContainer.innerHTML = lectures.map(l => {
        const s = NexusData.getSubject(l.subjectId);
        return `
          <div class="panel-item" style="border-left-color: ${s ? s.color : 'var(--color-primary)'}">
            <div class="panel-item-time">${this._formatTime(l.startHour, l.startMin)} - ${this._formatTime(l.endHour, l.endMin)}</div>
            <div class="panel-item-title">${s ? s.name : 'Unknown Subject'}</div>
            <div class="panel-item-sub">${l.room}</div>
          </div>
        `;
      }).join('');
    } else {
      lectureContainer.innerHTML = '<div class="empty-state-text">No lectures scheduled.</div>';
    }

    // Tasks
    const tasks = NexusData.tasks.filter(t => t.dueDate === dateStr);
    if (tasks.length > 0) {
      taskContainer.innerHTML = tasks.map(t => {
        const s = NexusData.getSubject(t.subjectId);
        return `
          <div class="panel-item" style="border-left-color: ${s ? s.color : 'var(--color-warning)'}">
            <div class="panel-item-time">Due Date: ${t.dueDate}</div>
            <div class="panel-item-title">${t.title}</div>
            <div class="panel-item-sub">${t.type} · ${s ? s.code : ''}</div>
          </div>
        `;
      }).join('');
    } else {
      taskContainer.innerHTML = '<div class="empty-state-text">No tasks due today. <i class="fa-solid fa-moon"></i></div>';
    }

    panel.classList.remove('hidden');
  },

  hideDayPanel() {
    const panel = document.getElementById('calendar-day-panel');
    if (panel) panel.classList.add('hidden');
  },

  _formatTime(h, m) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  }
};
