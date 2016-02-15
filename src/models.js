var lib = (function(document, lib) {
  'use strict';
  
  const STATUS_COMPLETED = 'completed',
        STATUS_ACTIVE    = 'active';
      
  let lastGeneratedId  = 0; // TODO: read from storage
  
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
  
  lib.models = lib.models || {};
  lib.models.ToDo = ToDo;
  
  return lib;
})(document, lib || {});
