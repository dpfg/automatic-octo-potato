
const STATUS_COMPLETED = 'completed';
const STATUS_ACTIVE = 'active';

// TODO: read from storage
let lastGeneratedId = 0;

export class ToDo {
  constructor (text) {
    this.id = lastGeneratedId++;
    this.status = STATUS_ACTIVE;
    this.text = text;
  }

  markAsCompleted () {
    this.status = STATUS_COMPLETED;
  }

  markAsActive () {
    this.status = STATUS_ACTIVE;
  }

  isActive () {
    return this.status === STATUS_ACTIVE;
  }

  isCompleted () {
    return this.status === STATUS_COMPLETED;
  }

  is(mode) {
    return this.status === mode;
  }

  static isActive(todo) {
    return todo.isActive();
  }

  static isCompleted(todo) {
    return todo.isCompleted();
  }
}
