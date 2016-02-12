;var module = (function(document, module) {
  
  function ToDoList(){
    this.todoList = [];
  }
  
  ToDoList.prototype.addNew = function(text) {
    this.todoList.push(new module.models.ToDo(text));
  };
  
  ToDoList.prototype.markAsCompleted = function(id) {
    this.todoList.filter(function(todo){
      return todo.id === id;
    }).forEach(function(todo){
      todo.markAsCompleted();
    });
  };
  
  ToDoList.prototype.getActive = function() {
    return this.todoList.filter(module.models.ToDo.isActive);
  };
  
  ToDoList.prototype.getCompleted = function() {
    return this.todoList.filter(module.models.ToDo.isCompleted);
  };
  
  module.controllers = module.controllers || {};
  module.controllers.ToDoList = new ToDoList();
  
  return module;
})(document, module || {})
