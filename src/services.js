import { Observable } from './observe';
import { ToDo } from './models';
import constants from './constants';

export class ToDoService {

  constructor(storage) {
    this.storage = storage;
    this.todoList = new Observable(storage.getToDos());
    this.viewMode = new Observable(storage.getMode());
  }

  getToDoList() {
    return this.todoList;
  }

  getVisibleToDoList() {
    return Observable.of(
      (viewMode, todos) => todos.filter(todo => {
        switch (viewMode) {
          case constants.VIEW_MODE_ALL: return true;
          case constants.VIEW_MODE_COMPLETED: return todo.isCompleted();
          case constants.VIEW_MODE_ACTIVE: return todo.isActive();
          default: break;
        }
      }),
      this.viewMode,
      this.todoList
      );
  }

  getViewMode() {
    return this.viewMode;
  }

  addNew(text) {
    const todo = new ToDo(text);

    this.storage.addToDo(todo);
    this.todoList.setValue(this.storage.getToDos());
  }

  toggleAll() {
    const hasActive = this.storage.getToDos().filter(todo => todo.isActive()).length > 0;

    if (hasActive) {
      // complete all
      this.storage.getToDos().forEach(todo => todo.markAsCompleted());
    } else {
      this.storage.getToDos().forEach(todo => todo.markAsActive());
    }
    this.todoList.setValue(this.storage.getToDos());
  }

  hasToDos() {
    return Observable.of(todos => todos.length > 0, this.todoList);
  }

  modifyToDoById (storage, id, modifier) {
    const todos = storage.getToDos().filter(todo => todo.id === id);

    if (todos.length === 0) {
      return;
    }
    todos.forEach(modifier);
    this.todoList.setValue(this.storage.getToDos());
  }

  markAsCompleted (id) {
    this.modifyToDoById(this.storage, id, todo => todo.markAsCompleted());
  }

  markAsActive (id) {
    this.modifyToDoById(this.storage, id, todo => todo.markAsActive());
  }

  removeToDo (id) {
    this.storage.removeToDo(id);
    this.todoList.setValue(this.storage.getToDos());
  }

  switchMode (mode) {
    this.storage.setMode(mode);
    this.viewMode.setValue(this.storage.getMode());
  }

  hasCompleted() {
    return Observable.of(todos => todos.filter(todo => todo.isCompleted()).length > 0, this.todoList);
  }

  clearCompleted () {
    this.storage.replaceAllToDos(this.storage.getToDos().filter(todo => todo.isActive()));
    this.todoList.setValue(this.storage.getToDos());
  }
}
