import constants from '../utils';
import { View, Component } from './base';

class ToolbarController {
  constructor (storage) {
    this.storage = storage;
  }

  switchMode (mode) {
    this.storage.setMode(mode);
  }

  hasCompleted () {
    return this.storage.getToDos().filter(todo => todo.isCompleted()).length > 0;
  }

  clearCompleted () {
    this.storage.replaceAllToDos(this.storage.getToDos().filter(todo => todo.isActive()));
  }

  hasToDos () {
    return this.storage.getToDos().length > 0;
  }

  getViewMode () {
    return this.storage.getMode();
  }
}

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

class ToolbarView extends View {
  constructor (controller) {
    super('.footer');
    this.controller = controller;

    super.$event(window, 'hashchange', this.onHashChanged);
    super.$event(this.el.querySelector('.clear-completed'), 'click', this.onClearCompleted);
    super.$model('viewMode', () => controller.getViewMode(), (val) => this.viewMode = val);
  }

  onHashChanged () {
    const viewMode = calcViewMode(location.hash);

    if (viewMode !== constants.VIEW_MODE_UNKNOWN) {
      this.controller.switchMode(viewMode);
    }
  }

  onClearCompleted () {
    this.controller.clearCompleted();
  }

  display () {
    if (this.controller.hasCompleted()) {
      this.el.querySelector('.clear-completed').classList.remove('hidden');
    } else {
      this.el.querySelector('.clear-completed').classList.add('hidden');
    }

    if (!this.controller.hasToDos()) {
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

export class ToolbarComponent extends Component {
  constructor (eventBus, storage) {
    const controller = new ToolbarController(storage);
    const view = new ToolbarView(controller);

    super(eventBus, controller, view);
  }
}
