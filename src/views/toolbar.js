import constants from '../constants';
import { View } from './base';

const calcViewMode = (hash) => {
  let viewMode = constants.VIEW_MODE_UNKNOWN;

  switch (hash) {
    case '#/active': viewMode = constants.VIEW_MODE_ACTIVE; break;
    case '#/completed': viewMode = constants.VIEW_MODE_COMPLETED; break;
    case '#/': viewMode = constants.VIEW_MODE_ALL; break;
    default:
  }
  return viewMode;
};

const isKnownViewMode = (hash) => {
  return calcViewMode(hash) !== constants.VIEW_MODE_UNKNOWN;
};

export class ToolbarView extends View {
  constructor(service) {
    super('.footer');
    this.service = service;

    super.addEventListener(window, 'hashchange', this.onHashChanged);
    super.addEventListener(this.el.querySelector('.clear-completed'), 'click', this.onClearCompleted);

    service.getViewMode().subscribe(val => { this.viewMode = val; this.display(); });
    service.hasToDos().subscribe(val => { this.hasToDos = val; this.display(); });
    service.hasCompleted().subscribe(val => { this.hasCompleted = val; this.display(); });

    this.onHashChanged();
  }

  onHashChanged () {
    const viewMode = calcViewMode(location.hash);

    if (viewMode !== constants.VIEW_MODE_UNKNOWN) {
      this.service.switchMode(viewMode);
    }
  }

  onClearCompleted () {
    this.service.clearCompleted();
  }

  display() {
    if (this.hasCompleted) {
      this.el.querySelector('.clear-completed').classList.remove('hidden');
    } else {
      this.el.querySelector('.clear-completed').classList.add('hidden');
    }

    if (!this.hasToDos) {
      this.el.classList.add('hidden');
    } else {
      this.el.classList.remove('hidden');
    }

    if (!isKnownViewMode(location.hash)) {
      return;
    }

    const selectedFilter = this.el.querySelector('.filters .selected');

    if (selectedFilter) {
      selectedFilter.classList.remove('selected');
    }
    this.el.querySelector('.filters li a[href="' + location.hash + '"]').classList.add('selected');
  }
}
