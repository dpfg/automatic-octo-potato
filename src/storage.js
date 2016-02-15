import constants from 'util';

export class InMemory {
  constructor () {
    this.todos = [];
    this.mode = constants.VIEW_MODE_ALL;
  }

  getToDos () {
    return this.todos;
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
