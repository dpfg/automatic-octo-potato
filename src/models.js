;var module = (function(document, module) {
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
  
  module.models = module.models || {};
  module.models.ToDo = ToDo;
  
  return module;
})(document, module || {})
