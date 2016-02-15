; var lib = (function (document, lib) {

  function _addEventListener(view, element, eventName, handler) {
    element.addEventListener(eventName, function () {
      handler.apply(view);
    });
  }

  function EnterView(controller) {
    this.controller = controller;
    this._link();
  }

  EnterView.prototype._link = function () {
    this.input = document.querySelector('.new-todo');
    _addEventListener(this, this.input, 'keydown', this._onCreateNew);
  }

  var KEY_CODE_ENTER = 13;
  EnterView.prototype._onCreateNew = function () {
    if (event.which === KEY_CODE_ENTER) {
      this.controller.addNew(event.target.value);
      this.clean();
    }
  }

  EnterView.prototype.clean = function () {
    this.input.value = '';
  }

  function ListView(eventBus, controller) {
    var that = this;
    eventBus.subscribe(function (params) {
      that.render();
    });

    this.controller = controller;
    this.el = document.querySelector('.todo-list');
  }

  function populateToDoView(todo, todoView) {
	   todoView.setAttribute('data-id', todo.id);
     todoView.querySelector('label').innerHTML = todo.text;
  }

  ListView.prototype.render = function () {
    var todos = this.controller.getToDos();
    var listView = this.el;
    var existedViews = this.el.querySelectorAll('li') || [];
    todos.forEach(function (todo, index) {
      var todoView;
      if (existedViews.length - 1 >= index) {
        // update existed view
        todoView = existedViews[index];
        populateToDoView(todo, todoView);
      } else {
        // create new view
        todoView = lib.html.templates.newToDo();
        todoView = listView.appendChild(todoView);
        populateToDoView(todo, todoView);
      }
    });

  }

  function ToolbarView(eventBus, controller) {
    this.eventBus = eventBus;
    this.controller = controller;
    this.el = document.querySelector('.footer');

    this._bind();
    this._apply();
  }

  ToolbarView.prototype._bind = function () {
    _addEventListener(this, window, 'hashchange', this._onHashChanged);
    _addEventListener(this, this.el.querySelector('.clear-completed'), 'click', this._onClearCompleted);
  }

  function calcViewMode(hash) {
    var viewMode = lib.constants.VIEW_MODE_UNKNOWN;
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

  ToolbarView.prototype._onHashChanged = function () {
    var viewMode = calcViewMode(location.hash);
    if (viewMode !== lib.constants.VIEW_MODE_UNKNOWN) {
      this._apply();
      this.controller.switchMode(viewMode);
    }
  }

  ToolbarView.prototype._onClearCompleted = function () {
    this.controller.clearCompleted();
  }

  ToolbarView.prototype._apply = function () {
    if (this.controller.hasCompleted()) {
      this.el.querySelector('.clear-completed').classList.remove('hidden');
    } else {
      this.el.querySelector('.clear-completed').classList.add('hidden');
    }

    if (!isKnownViewMode(location.hash)) {
      return;
    }
    this.el.querySelector('.filters .selected').classList.remove('selected');
    this.el.querySelector('.filters li a[href="' + location.hash + '"]').classList.add('selected');
  }

  lib.views = lib.views || {};
  lib.views.EnterView = EnterView;
  lib.views.ListView = ListView;
  lib.views.ToolbarView = ToolbarView;

  return lib;
})(document, lib || {})

