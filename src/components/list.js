import constants from '../constants';
import templates from '../templates';
import { View, Component } from './base';

const modifyToDoById = (storage, id, modifier) => {
  const todos = storage.getToDos().filter(todo => todo.id === id);

  if (todos.length === 0) {
    return;
  }
  todos.forEach(modifier);
};

class ListController {
  constructor (storage) {
    this.storage = storage;
  }

  getToDos () {
    const mode = this.storage.getMode();

    if (mode === constants.VIEW_MODE_ALL) {
      return this.storage.getToDos();
    } else if (mode === constants.VIEW_MODE_ACTIVE) {
      return this.storage.getToDos().filter(todo => todo.isActive());
    } else if (mode === constants.VIEW_MODE_COMPLETED) {
      return this.storage.getToDos().filter(todo => todo.isCompleted());
    }
    return [];
  }

  markAsCompleted (id) {
    modifyToDoById(this.storage, id, todo => todo.markAsCompleted());
  }

  markAsActive (id) {
    modifyToDoById(this.storage, id, todo => todo.markAsActive());
  }

  removeToDo (id) {
    this.storage.removeToDo(id);
  }
}

const extractToDoId = todoView => Number(todoView.getAttribute('data-id'));
const populateToDoView = (todo, todoView) => {
  if (todo.isCompleted() && !todoView.classList.contains('completed')) {
    todoView.classList.add('completed');
    todoView.querySelector('.toggle').setAttribute('checked', 'checked');
  } else if (todo.isActive() && todoView.classList.contains('completed')) {
    todoView.classList.remove('completed');
    todoView.querySelector('.toggle').removeAttribute('checked');
  }

  todoView.setAttribute('data-id', todo.id);
  todoView.querySelector('label').innerHTML = todo.text;
};

class ListView extends View {
  constructor (controller) {
    super('.todo-list');
    super.$model('todos', () => controller.getToDos(), todos => this.todos = todos);
    this.controller = controller;

    const todoViews = this.el.querySelectorAll('.toggle') || [];

    Array.prototype.forEach.call(todoViews, todoView => this.addToDoEvents(todoView));
  }

  addToDoEvents (todoView) {
    super.$event(todoView.querySelector('.toggle'), 'click', this.onToggleToDo);
    super.$event(todoView.querySelector('.destroy'), 'click', this.onDestroyToDo);
  }

  onToggleToDo (sourceElm) {
    const todoView = sourceElm.parentElement.parentElement;
    const todoId = extractToDoId(todoView);

    if (todoView.classList.toggle('completed')) {
      // completed
      this.controller.markAsCompleted(todoId);
    } else {
      this.controller.markAsActive(todoId);
    }
    return true;
  }

  onDestroyToDo (sourceElm) {
    const todoId = extractToDoId(sourceElm.parentElement.parentElement);

    this.controller.removeToDo(todoId);
    return true;
  }

  display() {
    Array.prototype.forEach.call(this.el.querySelectorAll('li'), function (view) {
      view.remove();
    });

    this.todos.forEach((todo) => {
      // create new view
      let todoView = templates.newToDo();

      todoView = this.el.appendChild(todoView);
      this.addToDoEvents(todoView);
      populateToDoView(todo, todoView);
    });
  }
}

export class ToDoListComponent extends Component {
  constructor (eventBus, storage) {
    const controller = new ListController(storage);
    const view = new ListView(controller);

    super(eventBus, controller, view);
  }
}
