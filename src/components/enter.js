import ToDo from '../models';
import { View, Component } from './base';

export class EnterController {

  constructor (storage) {
    this.storage = storage;
  }

  addNew (text) {
    const todo = new ToDo(text);

    this.storage.addToDo(todo);
  }

  toggleAll () {
    const hasActive = this.storage.getToDos().filter(todo => todo.isActive()).length > 0;

    if (hasActive) {
      // complete all
      this.storage.getToDos().forEach(todo => todo.markAsCompleted());
    } else {
      this.storage.getToDos().forEach(todo => todo.markAsActive());
    }
  }

  hasToDos () {
    return this.storage.getToDos().length > 0;
  }
}

const KEY_CODE_ENTER = 13;

export class EnterView extends View {

  constructor (controller) {
    super();
    const textInput = document.querySelector('.todoapp .new-todo');
    const toggleAllBtn = document.querySelector('.todoapp .toggle-all');

    super.$event(textInput, 'keydown', this.onCreateNew);
    super.$event(toggleAllBtn, 'click', this.onToggleAll);
    super.$model('hasTodos', () => controller.hasToDos(), val => this.hasToDos = val);
  }

  onCreateNew () {
    if (event.which === KEY_CODE_ENTER) {
      this.controller.addNew(event.target.value);
      this.clean();
    }
  }

  clean () {
    document.querySelector('.todoapp .new-todo').value = '';
  }

  onToggleAll () {
    this.controller.toggleAll();
  }

  display () {
    if (this.controller.hasToDos()) {
      document.querySelector('.main').classList.remove('hidden');
    } else {
      document.querySelector('.main').classList.add('hidden');
      document.querySelector('.toggle-all').checked = false;
    }
  }
}

export class EnterComponent extends Component {
  constructor (eventBus, storage) {
    const controller = new EnterController(storage);
    const view = new EnterView(controller);

    super(eventBus, controller, view);
  }
}
