;var lib = (function(document, lib) {
  
  function EnterController(eventBus, storage){
    this.storage = storage;
    this.eventBus = eventBus;
  }
  
  EnterController.prototype.addNew = function(text) {
    var todo = new lib.models.ToDo(text);
    this.storage.push(todo);
    this.eventBus.fire(lib.events.TODO_ADDED, {todo: todo});
  };  
  
  function ListController(eventBus, storage) {
    this.mode = lib.constants.VIEW_MODE_ALL;
    this.eventBus = eventBus;
    this.storage = storage;
  }
  
  ListController.prototype.getToDos = function() {
    if(this.mode === lib.constants.VIEW_MODE_ALL) {
      return this.storage;
    } else if(this.mode === lib.constants.VIEW_MODE_ACTIVE) {
      return this.storage.filter(lib.models.ToDo.isActive);
    } else if(this.mode === lib.constants.VIEW_MODE_COMPLETED) {
      return this.storage.filter(lib.models.ToDo.isCompleted);
    }
    return [];
  }
  
  ListController.prototype.markAsCompleted = function(id) {
    var todos = this.storage.filter(function(todo){
      return todo.id === id;
    });
    
    if(todos.length === 0) {
      return;
    }
    
    todos.forEach(function(todo){
      todo.markAsCompleted();
    });
    
    this.eventBus.fire(lib.events.TODO_COMPLETED, {id: id});
  };
  
  function ToolbarController(eventBus, storage) {
    this.eventBus = eventBus;
    this.storage = storage;
  }
  
  ToolbarController.prototype.switchMode = function (mode) {
    this.storage.mode = mode;
    this.eventBus.fire(lib.events.SWITCH_VIEW_MODE, {newMode: mode});
  }
  
  ToolbarController.prototype.clearCompleted = function() {
    this.storage = this.storage.filter(lib.models.ToDo.isActive);
    this.eventBus.fire(lib.events.CLEAN_COMPLETED);
  }
  
  lib.controllers = lib.controllers || {};
  lib.controllers.EnterController = EnterController;
  lib.controllers.ListController = ListController;
  lib.controllers.ToolbarController = ToolbarController;
  
  return lib;
})(document, lib || {})
