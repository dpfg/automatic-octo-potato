;var lib = (function(document, lib) {
  
  function EnterController(eventBus, storage){
    this.storage = storage;
    this.eventBus = eventBus;
  }
  
  EnterController.prototype.addNew = function(text) {
    var todo = new lib.models.ToDo(text);
    this.todoList.push(todo);    
    this.eventBus.fire(lib.events.TODO_ADDED, {id: todo.id});
  };
  
  EnterController.prototype.markAsCompleted = function(id) {
    var todos = this.todoList.filter(function(todo){
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
  
  EnterController.prototype.getActive = function() {
    return this.todoList.filter(lib.models.ToDo.isActive);
  };
  
  EnterController.prototype.getCompleted = function() {
    return this.todoList.filter(lib.models.ToDo.isCompleted);
  };
  
  lib.controllers = lib.controllers || {};
  lib.controllers.EnterController = EnterController;
  
  function ListController(eventBus) {
    this.mode = lib.constants.VIEW_MODE_ALL;
    this.eventBus = eventBus;
  }
  
  ListController.prototype.getMode = function() {
    return this.mode;
  }
  
  ListController.prototype. = function(mode) {
    this.mode = mode;
    this.eventBus.fire(module.events.SWITCH_VIEW_MODE, mode);
  }
  
  return lib;
})(document, lib || {})
