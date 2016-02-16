import constants from '../constants';
import templates from '../templates';
import { View } from './base';

const extractToDoId = todoView => Number(todoView.getAttribute('data-id'));

const populateToDoView = (todo, todoView) => {
  const classes = todoView.classList;

  if (todo.isCompleted() && !classes.contains('completed')) {
    classes.add('completed');
    todoView.querySelector('.toggle').setAttribute('checked', 'checked');
  }

  if (todo.isActive() && classes.contains('completed')) {
    classes.remove('completed');
    todoView.querySelector('.toggle').removeAttribute('checked');
  }

  todoView.setAttribute('data-id', todo.id);
  todoView.querySelector('label').innerHTML = todo.text;
};

const forEach = (iterable, func) => {
  Array.prototype.forEach.call(iterable, item => func(item));
}

export class ListView extends View {
  constructor(service) {
    super('.todo-list');
    this.service = service;

    forEach(this.el.querySelectorAll('.toggle') || [], this.addToDoEvents);

    this.service.getVisibleToDoList().subscribe(todos => { this.todos = todos; this.display(); });
  }

  addToDoEvents(todoView) {
    super.addEventListener(todoView.querySelector('.toggle'), 'click', this.onToggleToDo);
    super.addEventListener(todoView.querySelector('.destroy'), 'click', this.onDestroyToDo);
  }

  onToggleToDo(sourceElm) {
    const todoView = sourceElm.parentElement.parentElement;
    const todoId = extractToDoId(todoView);

    if (todoView.classList.toggle('completed')) {
      this.service.markAsCompleted(todoId);
    } else {
      this.service.markAsActive(todoId);
    }
  }

  onDestroyToDo(sourceElm) {
    const todoId = extractToDoId(sourceElm.parentElement.parentElement);

    this.service.removeToDo(todoId);
  }

  display() {
    forEach(this.el.querySelectorAll('li'), view => view.remove());
    this.todos.forEach((todo) => {
      let todoView = templates.newToDo();

      todoView = this.el.appendChild(todoView);
      this.addToDoEvents(todoView);
      populateToDoView(todo, todoView);
    });
  }
}
