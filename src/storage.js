var lib = (function (document, lib) {
  
  function InMemory() {
    this.todos = [];
    this.mode = lib.constants.VIEW_MODE_ALL;
  }
  
  InMemory.prototype.getToDos = function() {
    return this.todos;
  }
  
  InMemory.prototype.addToDo = function (todo) {
    this.todos.push(todo);
  }
  
  InMemory.prototype.replaceAllToDos = function (todos) {
    this.todos = todos;
  }
  
  InMemory.prototype.removeToDo = function (id) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== id;
    });
  }

  InMemory.prototype.setMode = function(mode) {
    this.mode = mode;
  }
  
  InMemory.prototype.getMode = function() {
    return this.mode;
  }
  
  lib.storage = lib.storage || {}
  lib.storage.InMemory = InMemory;  

  return lib;
})(document, lib || {});
