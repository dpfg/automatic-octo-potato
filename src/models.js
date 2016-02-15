var lib = (function(document, lib) {
  var STATUS_COMPLETED = 'completed',
      STATUS_ACTIVE    = 'active';
      
  var lastGeneratedId  = 0; // TODO: read from storage
  
  function ToDo(text) {
    this.id 	  = lastGeneratedId++;
    this.status = STATUS_ACTIVE;
    this.text   = text;
  }
  
  ToDo.prototype.markAsCompleted = function() {
    this.status = STATUS_COMPLETED;
  }
  
  ToDo.prototype.markAsActive = function() {
    this.status = STATUS_ACTIVE;
  }
  
  ToDo.prototype.isActive = function() {
    return this.status === STATUS_ACTIVE;
  }
  
  ToDo.prototype.isCompleted = function() {
    return this.status === STATUS_COMPLETED;
  }
  
  ToDo.isActive = function(todo) {
    return todo.isActive();
  };
  
  ToDo.isCompleted = function(todo) {
    return todo.isCompleted();
  };
  
  lib.models = lib.models || {};
  lib.models.ToDo = ToDo;
  
  return lib;
})(document, lib || {});
