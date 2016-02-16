import constants from '../constants';
import templates from '../templates';
import { View } from './base';

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

export class ListView extends View {
  constructor(service) {
    super('.todo-list');
    this.service = service;

    const todoViews = this.el.querySelectorAll('.toggle') || [];

    Array.prototype.forEach.call(todoViews, todoView => this.addToDoEvents(todoView));

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
    Array.prototype.forEach.call(this.el.querySelectorAll('li'), function (view) {
      view.remove();
    });

    this.todos.forEach((todo) => {
      let todoView = templates.newToDo();

      todoView = this.el.appendChild(todoView);
      this.addToDoEvents(todoView);
      populateToDoView(todo, todoView);
    });
  }
}
