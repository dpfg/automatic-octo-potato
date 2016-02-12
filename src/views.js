;var lib = (function(document, lib) {

  function _addEventListener(view, element, eventName, handler) {
    element.addEventListener(eventName, function(){
      handler.apply(view);
      view.display();
    });
  }
  
  function EnterView(controller) {
    this.controller = controller;
    
    this._link();
  }
  
  EnterView.prototype._link = function() {
    this.input = document.querySelector('.new-todo');    
    _addEventListener(this, this.input, 'keydown', this._onCreateNew);
  }

  var KEY_CODE_ENTER = 13;
  EnterView.prototype._onCreateNew = function() {
    if(event.which === KEY_CODE_ENTER) {
      this.controller.addNew(event.target.value);
      this.clean();
    }
  }
  
  EnterView.prototype.clean = function() {
    this.input.value = '';
  }
  
  EnterView.prototype.display = function() {
    
  }
  
  function ListView(controller) {
    this.currentToDoList = controller.
    
    controller.subscribe(lib.events.TODO_ADDED, function(params){
      console.log('Handle added to do:' + params.todo);
      that.addNewToDo()
    });
  }
  
  ListView.prototype.display = function() {
    
  }
  
  lib.views = lib.views || {};
  lib.views.EnterView = EnterView;
  lib.views.ListView = ListView;
  
  return lib;
})(document, lib || {})

