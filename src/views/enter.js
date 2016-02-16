import { ToDo } from '../models';
import { View } from './base';

const KEY_CODE_ENTER = 13;

export class EnterView extends View {

  constructor (service) {
    super();
    this.service = service;

    const textInput = document.querySelector('.todoapp .new-todo');
    const toggleAllBtn = document.querySelector('.todoapp .toggle-all');

    super.addEventListener(textInput, 'keydown', this.onCreateNew);
    super.addEventListener(toggleAllBtn, 'click', this.onToggleAll);

    service.hasToDos().subscribe(hasTodos => { this.hasTodos = hasTodos; this.display(); });
  }

  onCreateNew () {
    if (event.which === KEY_CODE_ENTER) {
      this.service.addNew(event.target.value);
      this.clean();
    }
  }

  clean () {
    document.querySelector('.todoapp .new-todo').value = '';
  }

  onToggleAll () {
    this.service.toggleAll();
  }

  display() {
    if (this.hasTodos) {
      document.querySelector('.main').classList.remove('hidden');
    } else {
      document.querySelector('.main').classList.add('hidden');
      document.querySelector('.toggle-all').checked = false;
    }
  }
}
