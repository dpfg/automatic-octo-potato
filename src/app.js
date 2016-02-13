function ToDoApp(lib) {
  var eventBus = new lib.events.EventBus();
  this.storage = lib.storage;
  this.views = [
    new lib.views.EnterView(new lib.controllers.EnterController(eventBus, this.storage)),
    new lib.views.ListView(eventBus, new lib.controllers.ListController(eventBus, this.storage)),
    new lib.views.ToolbarView(eventBus),
    ];
}


var app = new ToDoApp(window.lib);
