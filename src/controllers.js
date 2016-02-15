var lib = (function(document, lib) {

  function EnterController(eventBus, storage){
    this.storage = storage;
    this.eventBus = eventBus;
  }

  EnterController.prototype.addNew = function(text) {
    var todo = new lib.models.ToDo(text);
    this.storage.addToDo(todo);
    this.eventBus.fire(lib.events.TODO_ADDED, {todo: todo});
  };

  function ListController(eventBus, storage) {
    this.eventBus = eventBus;
    this.storage = storage;
  }

  ListController.prototype.getToDos = function() {
    var mode = this.storage.getMode();
    if(mode === lib.constants.VIEW_MODE_ALL) {
      return this.storage.getToDos();
    } else if(mode === lib.constants.VIEW_MODE_ACTIVE) {
      return this.storage.getToDos().filter(lib.models.ToDo.isActive);
    } else if(mode === lib.constants.VIEW_MODE_COMPLETED) {
      return this.storage.getToDos().filter(lib.models.ToDo.isCompleted);
    }
    return [];
  }
  
  ListController.prototype.modifyToDoById = function(id, modifier) {
    var todos = this.storage.getToDos().filter(function(todo){
      return todo.id === id;
    });

    if(todos.length === 0) {
      return;
    }
    todos.forEach(modifier);
    this.eventBus.fire(lib.events.TODO_COMPLETED, {id: id});
  };

  ListController.prototype.markAsCompleted = function(id) {
    this.modifyToDoById(id, function(todo){
      todo.markAsCompleted();
    });
  };
  
  ListController.prototype.markAsActive = function(id) {
    this.modifyToDoById(id, function(todo){
      todo.markAsActive();
    });
  };

  function ToolbarController(eventBus, storage) {
    this.eventBus = eventBus;
    this.storage = storage;
  }

  ToolbarController.prototype.switchMode = function (mode) {
    this.storage.setMode(mode);
    this.eventBus.fire(lib.events.SWITCH_VIEW_MODE, {newMode: mode});
  }

  ToolbarController.prototype.hasCompleted = function() {
    return this.storage.getToDos().filter(lib.models.ToDo.isCompleted).length > 0;
  }

  ToolbarController.prototype.clearCompleted = function() {
    this.storage.replaceAllToDos(this.storage.filter(lib.models.ToDo.isActive));
    this.eventBus.fire(lib.events.CLEAN_COMPLETED);
  }

  lib.controllers = lib.controllers || {};
  lib.controllers.EnterController = EnterController;
  lib.controllers.ListController = ListController;
  lib.controllers.ToolbarController = ToolbarController;

  return lib;
})(document, lib || {});
