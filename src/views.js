; var lib = (function (document, lib) {

  function _addEventListener(view, element, eventName, handler) {
    element.addEventListener(eventName, function () {
      handler.apply(view);
    });
  }

  function EnterView(controller) {
    this.controller = controller;
    this._link();
  }

  EnterView.prototype._link = function () {
    this.input = document.querySelector('.new-todo');
    _addEventListener(this, this.input, 'keydown', this._onCreateNew);
  }

  var KEY_CODE_ENTER = 13;
  EnterView.prototype._onCreateNew = function () {
    if (event.which === KEY_CODE_ENTER) {
      this.controller.addNew(event.target.value);
      this.clean();
    }
  }

  EnterView.prototype.clean = function () {
    this.input.value = '';
  }

  function ListView(eventBus, controller) {
    var that = this;
    eventBus.subscribe(function (params) {
      console.log('Handle any to do:' + params.todo);
      that.render();
    });

    this.controller = controller;
  }

  ListView.prototype.render = function () {
	   console.log('render using new list ');
     console.log(this.controller.getToDos()); 
  }
  
  function ToolbarView(eventBus) {
    this.eventBus = eventBus;
    this.el = document.querySelector('.footer');
    
    this._bind();
    this._apply();
  }
  
  ToolbarView.prototype._bind = function() {
    _addEventListener(this, window, 'hashchange', this._onHashChanged);
  }
  
  function calcViewMode(hash) {
    var viewMode = -1;
    switch(location.hash) {
      case '#/active': 	  viewMode = lib.constants.VIEW_MODE_ACTIVE; break;
      case '#/completed': viewMode = lib.constants.VIEW_MODE_COMPLETED; break;
      case '#/':       	  viewMode = lib.constants.VIEW_MODE_ALL; break;
    }
    return viewMode;
  }
  
  function isKnownViewMode(hash) {
    return calcViewMode(hash) !== -1;
  }
  
  ToolbarView.prototype._onHashChanged = function () {
    var viewMode = calcViewMode(location.hash);    
    if(viewMode !== -1) {
      this._apply();
      this.eventBus.fire(lib.events.SWITCH_VIEW_MODE, {newMode: viewMode});
    }
  }
  
  ToolbarView.prototype._apply = function() {
    if(!isKnownViewMode(location.hash)) {
      return;
    }
    this.el.querySelector('.filters .selected').classList.remove('selected');
    this.el.querySelector('.filters li a[href="' + location.hash + '"]').classList.add('selected');
  }

  lib.views = lib.views || {};
  lib.views.EnterView = EnterView;
  lib.views.ListView = ListView;
  lib.views.ToolbarView = ToolbarView;

  return lib;
})(document, lib || {})

