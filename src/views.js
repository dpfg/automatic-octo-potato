var lib = (function (document, lib) {

  function addViewEvent(view, element, eventName, handler) {
    element.addEventListener(eventName, function () {
      handler.call(view, window.event.target);
    });
  }

  function EnterView(eventBus, controller) {
    this.controller = controller;    
    var that = this;
    this.registerEvents();
    
    eventBus.subscribe(function () {
      that.link();
    });
  }

  // registerEvents view to the DOM
  EnterView.prototype.registerEvents = function () {
    var input = document.querySelector('.new-todo');    
    addViewEvent(this, input, 'keydown', this.onCreateNew);
    
    var toggleAll = document.querySelector('.toggle-all');
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
    if(this.controller.hasToDos()){
      document.querySelector('.main').classList.remove('hidden');
    } else {
      document.querySelector('.main').classList.add('hidden');
      document.querySelector('.toggle-all').checked = false;
    }    
  }

  function ListView(eventBus, controller) {
    var that = this;
    eventBus.subscribe(function (params) {
      that.link();
    });

    this.controller = controller;
    this.el = document.querySelector('.todo-list');
    var todoViews = this.el.querySelectorAll('.toggle') || [];
    Array.prototype.forEach.call(todoViews, function(todoView){
      that.registerEvents(todoView);
    }); 
  }
  
  ListView.prototype.registerEvents = function(todoView) {
    addViewEvent(this, todoView.querySelector('.toggle'), 'click', this.onToggleToDo);
    addViewEvent(this, todoView.querySelector('.destroy'), 'click', this.onDestroyToDo);
  }
  
  function populateToDoView(todo, todoView) {
     if(todo.isCompleted() && !todoView.classList.contains('completed')) {
       todoView.classList.add('completed');
       todoView.querySelector('.toggle').setAttribute('checked', 'checked');
     } else if(todo.isActive() && todoView.classList.contains('completed')) {
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
    
    Array.prototype.forEach.call(this.el.querySelectorAll('li'), function(view){
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
  
  ListView.prototype.onToggleToDo = function(sourceElm) {
    var todoView = sourceElm.parentElement.parentElement;
    if(todoView.classList.toggle('completed')) {
      // completed
      var todoId = Number(todoView.getAttribute('data-id'));
      this.controller.markAsCompleted(todoId);
    } else {
      var todoId = Number(todoView.getAttribute('data-id'));
      this.controller.markAsActive(todoId);
    }
  }
  
  ListView.prototype.onDestroyToDo = function (sourceElm) {
    var todoView = sourceElm.parentElement.parentElement;
    var todoId = Number(todoView.getAttribute('data-id'));
    this.controller.removeToDo(todoId);
  }

  function ToolbarView(eventBus, controller) {
    this.eventBus = eventBus;
    this.controller = controller;
    this.el = document.querySelector('.footer');

    this.registerEvents();
    
    var that = this;
    eventBus.subscribe(function() {
      that.link();
    });
    this.onHashChanged();
  }

  ToolbarView.prototype.registerEvents = function () {
    addViewEvent(this, window, 'hashchange', this.onHashChanged);
    addViewEvent(this, this.el.querySelector('.clear-completed'), 'click', this.onClearCompleted);
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

  ToolbarView.prototype.onHashChanged = function () {
    var viewMode = calcViewMode(location.hash);
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
    
    if(!this.controller.hasToDos()) {
      this.el.classList.add('hidden');
    } else {
      this.el.classList.remove('hidden');
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
})(document, lib || {});

