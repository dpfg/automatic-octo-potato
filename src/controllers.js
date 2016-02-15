var lib = (function(document, lib) {
 
  function EnterController(eventBus, storage){
    this.storage = storage;
    this.eventBus = eventBus;
  }

  EnterController.prototype.addNew = function(text) {
    const todo = new lib.models.ToDo(text);
    this.storage.addToDo(todo);
    this.eventBus.fire(lib.events.TODO_ADDED, {todo: todo});
  }
  
  EnterController.prototype.toggleAll = function () {
    const hasActive = this.storage.getToDos().filter(todo => todo.isActive()).length > 0;
    if(hasActive) {
      // complete all
      this.storage.getToDos().forEach(todo => todo.markAsCompleted()); 
    } else {
      this.storage.getToDos().forEach(todo => todo.markAsActive());  
    }
    this.eventBus.fire(lib.events.TODO_TOGGLE_ALL);
  }
  
  EnterController.prototype.hasToDos = function() {
    return this.storage.getToDos().length > 0;
  }

  function ListController(eventBus, storage) {
    this.eventBus = eventBus;
    this.storage = storage;
  }

  ListController.prototype.getToDos = function() {
    const mode = this.storage.getMode();
    if(mode === lib.constants.VIEW_MODE_ALL) {
      return this.storage.getToDos();
    } else if(mode === lib.constants.VIEW_MODE_ACTIVE) {
      return this.storage.getToDos().filter(todo => todo.isActive());
    } else if(mode === lib.constants.VIEW_MODE_COMPLETED) {
      return this.storage.getToDos().filter(todo => todo.isCompleted());
    }
    return [];
  }

  function modifyToDoById(eventBus, storage, id, modifier) {
    const todos = storage.getToDos().filter(todo => todo.id === id);

    if(todos.length === 0) {
      return;
    }
    todos.forEach(modifier);
    eventBus.fire(lib.events.TODO_COMPLETED, {id: id});
  }
  
  ListController.prototype.markAsCompleted = function(id) {
    modifyToDoById(this.eventBus, this.storage, id, todo => todo.markAsCompleted());
    this.eventBus.fire(lib.events.TODO_COMPLETED, {id : id});
  };
  
  ListController.prototype.markAsActive = function(id) {
    modifyToDoById(this.eventBus, this.storage, id, todo => todo.markAsActive());
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
    return this.storage.getToDos().filter(todo => todo.isCompleted()).length > 0;
  }

  ToolbarController.prototype.clearCompleted = function() {
    this.storage.replaceAllToDos(this.storage.getToDos().filter(todo => todo.isActive()));
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
