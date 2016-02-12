;var module = (function(document, module) {
  
  function EnterView() {
    this.controller = module.controllers.ToDoList;
  }
  
  function _addEventListener(view, element, eventName, handler) {
    element.addEventListener(eventName, function(){
      handler.apply(view);
      view.display();
    });
  }
  
  EnterView.prototype._link = function() {
    this.input = document.querySelector('.new-todo');    
    _addEventListener(this, this.input, 'keydown', this._onCreateNew);
  }
  
  EnterView.prototype._onCreateNew = function() {
    console.log(event.which);
    if(event.which === 13) {
      this.controller.addNew(event.target.value);
      this.clean();  
    }
  }
  
  EnterView.prototype.clean = function() {
    this.input.value = '';
  }
  
  EnterView.prototype.display = function() {
    
  }
  
  module.views = module.views || {};
  module.views.EnterView = EnterView;
  
  return module;
})(document, module || {})

