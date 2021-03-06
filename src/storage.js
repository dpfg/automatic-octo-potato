import constants from './constants';

export class InMemory {
  constructor () {
    this.todos = [];
    this.mode = constants.VIEW_MODE_ALL;
  }

  getToDos () {
    return this.todos.slice();
  }

  addToDo (todo) {
    this.todos.push(todo);
  }

  replaceAllToDos (todos) {
    this.todos = todos;
  }

  removeToDo (id) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== id;
    });
  }

  setMode (mode) {
    this.mode = mode;
  }

  getMode () {
    return this.mode;
  }
}
