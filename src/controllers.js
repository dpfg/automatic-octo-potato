var lib = (function(document, lib) {
  
  function modifyToDoById(eventBus, storage, id, modifier) {
    var todos = storage.getToDos().filter(function(todo){
      return todo.id === id;
    });

    if(todos.length === 0) {
      return;
    }
    todos.forEach(modifier);
    eventBus.fire(lib.events.TODO_COMPLETED, {id: id});
  }
  
  function hasActive(storage) {
    return storage.getToDos().filter(lib.models.ToDo.isActive).length > 0;
  }

  function EnterController(eventBus, storage){
    this.storage = storage;
    this.eventBus = eventBus;
  }

  EnterController.prototype.addNew = function(text) {
    var todo = new lib.models.ToDo(text);
    this.storage.addToDo(todo);
    this.eventBus.fire(lib.events.TODO_ADDED, {todo: todo});
  }
  
  EnterController.prototype.toggleAll = function () {
    if(hasActive(this.storage)) {
      // complete all
      this.storage.getToDos().forEach(function(todo){
        todo.markAsCompleted();
      }); 
    } else {
      this.storage.getToDos().forEach(function(todo){
        todo.markAsActive();  
      });  
    }
    this.eventBus.fire(lib.events.TODO_TOGGLE_ALL);
  }

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

  ListController.prototype.markAsCompleted = function(id) {
    modifyToDoById(this.eventBus, this.storage, id, function(todo){
      todo.markAsCompleted();
    });
    this.eventBus.fire(lib.events.TODO_COMPLETED, {id : id});
  };
  
  ListController.prototype.markAsActive = function(id) {
    modifyToDoById(this.eventBus, this.storage, id, function(todo){
      todo.markAsActive();
    });
    this.eventBus.fire(lib.events.TODO_ACTIVATE, {id : id});
  };
  
  ListController.prototype.removeToDo = function(id) {
    this.storage.removeToDo(id);
    this.eventBus.fire(lib.events.TODO_DELETED, {id : id});
  }

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
    this.storage.replaceAllToDos(this.storage.getToDos().filter(lib.models.ToDo.isActive));
    this.eventBus.fire(lib.events.CLEAN_COMPLETED);
  }
  
  ToolbarController.prototype.hasToDos = function() {
    return this.storage.getToDos().length > 0;
  }
  

  lib.controllers = lib.controllers || {};
  lib.controllers.EnterController = EnterController;
  lib.controllers.ListController = ListController;
  lib.controllers.ToolbarController = ToolbarController;

  return lib;
})(document, lib || {});
