import { ToDo } from '../models';
import { View } from './base';

const KEY_CODE_ENTER = 13;

export class EnterView extends View {

  constructor (service) {
    super();
    this.service = service;

    const textInput = document.querySelector('.todoapp .new-todo');
    const toggleAllBtn = document.querySelector('.todoapp .toggle-all');

    super.bindEvent('keydown', textInput, this.onCreateNew);
    super.bindEvent('click', toggleAllBtn, this.onToggleAll);

    super.bindModel(service.hasToDos(), this.updateUI);
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

  updateUI(hasTodos) {
    if (hasTodos) {
      document.querySelector('.main').classList.remove('hidden');
    } else {
      document.querySelector('.main').classList.add('hidden');
      document.querySelector('.toggle-all').checked = false;
    }
  }
}
