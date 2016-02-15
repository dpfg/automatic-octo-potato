var lib = (function (document, lib) {

  function addViewEvent(view, element, eventName, handler) {
    element.addEventListener(eventName, () => handler.call(view, window.event.target));
  }

  function EnterView(eventBus, controller) {
    this.controller = controller;
    this.registerEvents();

    eventBus.subscribe(() => this.link());
  }

  // registerEvents view to the DOM
  EnterView.prototype.registerEvents = function () {
    var input = document.querySelector('.todoapp .new-todo');
    addViewEvent(this, input, 'keydown', this.onCreateNew);

    var toggleAll = document.querySelector('.todoapp .toggle-all');
    addViewEvent(this, toggleAll, 'click', this.onToggleAll);
  }

  var KEY_CODE_ENTER = 13;
  EnterView.prototype.onCreateNew = function () {
    if (event.which === KEY_CODE_ENTER) {
      this.controller.addNew(event.target.value);
      this.clean();
    }
  }

  EnterView.prototype.clean = function () {
    document.querySelector('.new-todo').value = '';
  }

  EnterView.prototype.onToggleAll = function () {
    this.controller.toggleAll();
  }

  EnterView.prototype.link = function () {
    if (this.controller.hasToDos()) {
      document.querySelector('.main').classList.remove('hidden');
    } else {
      document.querySelector('.main').classList.add('hidden');
      document.querySelector('.toggle-all').checked = false;
    }
  }

  function ListView(eventBus, controller) {
    eventBus.subscribe(() => this.link());

    this.controller = controller;
    this.el = document.querySelector('.todo-list');
    var todoViews = this.el.querySelectorAll('.toggle') || [];
    Array.prototype.forEach.call(todoViews, todoView => this.registerEvents(todoView));
  }

  ListView.prototype.registerEvents = function (todoView) {
    addViewEvent(this, todoView.querySelector('.toggle'), 'click', this.onToggleToDo);
    addViewEvent(this, todoView.querySelector('.destroy'), 'click', this.onDestroyToDo);
  }

  function populateToDoView(todo, todoView) {
    if (todo.isCompleted() && !todoView.classList.contains('completed')) {
      todoView.classList.add('completed');
      todoView.querySelector('.toggle').setAttribute('checked', 'checked');
    } else if (todo.isActive() && todoView.classList.contains('completed')) {
      todoView.classList.remove('completed');
      todoView.querySelector('.toggle').removeAttribute('checked');
    }

	   todoView.setAttribute('data-id', todo.id);
    todoView.querySelector('label').innerHTML = todo.text;
  }

  ListView.prototype.link = function () {
    var that = this;
    var todos = this.controller.getToDos();
    var listView = this.el;

    Array.prototype.forEach.call(this.el.querySelectorAll('li'), function (view) {
      view.remove();
    });

    todos.forEach(function (todo, index) {
      // create new view
      var todoView = lib.html.templates.newToDo();
      todoView = listView.appendChild(todoView);
      that.registerEvents(todoView);
      populateToDoView(todo, todoView);
    });
  }

  function getToDoId(todoView) {
    return Number(todoView.getAttribute('data-id'));
  }

  ListView.prototype.onToggleToDo = function (sourceElm) {
    const todoView = sourceElm.parentElement.parentElement;
    const todoId = getToDoId(todoView);
    if (todoView.classList.toggle('completed')) {
      // completed
      this.controller.markAsCompleted(todoId);
    } else {
      this.controller.markAsActive(todoId);
    }
  }

  ListView.prototype.onDestroyToDo = function (sourceElm) {
    const todoId = getToDoId(sourceElm.parentElement.parentElement);
    this.controller.removeToDo(todoId);
  }

  function ToolbarView(eventBus, controller) {
    this.eventBus = eventBus;
    this.controller = controller;
    this.el = document.querySelector('.footer');

    this.registerEvents();

    eventBus.subscribe(() => this.link());
    this.onHashChanged();
  }

  ToolbarView.prototype.registerEvents = function () {
    addViewEvent(this, window, 'hashchange', this.onHashChanged);
    addViewEvent(this, this.el.querySelector('.clear-completed'), 'click', this.onClearCompleted);
  }

  function calcViewMode(hash) {
    let viewMode = lib.constants.VIEW_MODE_UNKNOWN;
    switch (hash) {
      case '#/active': viewMode = lib.constants.VIEW_MODE_ACTIVE; break;
      case '#/completed': viewMode = lib.constants.VIEW_MODE_COMPLETED; break;
      case '#/': viewMode = lib.constants.VIEW_MODE_ALL; break;
    }
    return viewMode;
  }

  function isKnownViewMode(hash) {
    return calcViewMode(hash) !== lib.constants.VIEW_MODE_UNKNOWN;
  }

  ToolbarView.prototype.onHashChanged = function () {
    const viewMode = calcViewMode(location.hash);
    if (viewMode !== lib.constants.VIEW_MODE_UNKNOWN) {
      this.link();
      this.controller.switchMode(viewMode);
    }
  }

  ToolbarView.prototype.onClearCompleted = function () {
    this.controller.clearCompleted();
  }

  ToolbarView.prototype.link = function () {
    if (this.controller.hasCompleted()) {
      this.el.querySelector('.clear-completed').classList.remove('hidden');
    } else {
      this.el.querySelector('.clear-completed').classList.add('hidden');
    }

    if (!this.controller.hasToDos()) {
      this.el.classList.add('hidden');
    } else {
      this.el.classList.remove('hidden');
    }

    if (!isKnownViewMode(location.hash)) {
      return;
    }
    const selectedFilter = this.el.querySelector('.filters .selected');
    if (selectedFilter) {
      selectedFilter.classList.remove('selected');
    }
    this.el.querySelector('.filters li a[href="' + location.hash + '"]').classList.add('selected');
  }

  lib.views = lib.views || {};
  lib.views.EnterView = EnterView;
  lib.views.ListView = ListView;
  lib.views.ToolbarView = ToolbarView;

  return lib;
})(document, lib || {});

