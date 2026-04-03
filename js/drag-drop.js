/**
 * Drag & Drop — Task reordering
 */
const DragDrop = {
  draggedEl: null,
  placeholder: null,

  init(container, itemSelector) {
    if (!container) return;

    const items = container.querySelectorAll(itemSelector);
    items.forEach((item) => {
      item.addEventListener('dragstart', (e) => this.onDragStart(e, item));
      item.addEventListener('dragend', (e) => this.onDragEnd(e, item));
      item.addEventListener('dragover', (e) => this.onDragOver(e, item));
      item.addEventListener('dragleave', (e) => this.onDragLeave(e, item));
      item.addEventListener('drop', (e) => this.onDrop(e, item, container));
    });
  },

  onDragStart(e, item) {
    this.draggedEl = item;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.id || '');
    // Slight delay so the dragging class shows properly
    requestAnimationFrame(() => {
      item.style.opacity = '0.4';
    });
  },

  onDragEnd(e, item) {
    item.classList.remove('dragging');
    item.style.opacity = '';
    this.draggedEl = null;
    // Remove all drag-over states
    document.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
  },

  onDragOver(e, item) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (item !== this.draggedEl) {
      item.classList.add('drag-over');
    }
  },

  onDragLeave(e, item) {
    item.classList.remove('drag-over');
  },

  onDrop(e, item, container) {
    e.preventDefault();
    item.classList.remove('drag-over');

    if (this.draggedEl && this.draggedEl !== item) {
      // Swap positions in the DOM
      const allItems = [...container.children];
      const draggedIdx = allItems.indexOf(this.draggedEl);
      const droppedIdx = allItems.indexOf(item);

      if (draggedIdx < droppedIdx) {
        container.insertBefore(this.draggedEl, item.nextSibling);
      } else {
        container.insertBefore(this.draggedEl, item);
      }

      // Show toast
      App.showToast('✨', 'Task reordered');
    }
  },
};
