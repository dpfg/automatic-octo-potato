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

    super.bindEvent('hashchange', window, this.onHashChanged);
    super.bindEvent('click', this.el.querySelector('.clear-completed'), this.onClearCompleted);

    super.bindModel(service.getViewMode(), this.changeViewMode);
    super.bindModel(service.hasToDos(), this.toggle);
    super.bindModel(service.hasCompleted(), this.toggleCleanCompleted);

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

  changeViewMode(viewMode) {
    if (!isKnownViewMode(location.hash)) {
      return;
    }

    const selectedFilter = this.el.querySelector('.filters .selected');

    if (selectedFilter) {
      selectedFilter.classList.remove('selected');
    }
    this.el.querySelector('.filters li a[href="' + location.hash + '"]').classList.add('selected');
  }

  toggle (visible) {
    if (!visible) {
      this.el.classList.add('hidden');
    } else {
      this.el.classList.remove('hidden');
    }
  }

  toggleCleanCompleted (hasCompleted) {
    if (hasCompleted) {
      this.el.querySelector('.clear-completed').classList.remove('hidden');
    } else {
      this.el.querySelector('.clear-completed').classList.add('hidden');
    }
  }
}
