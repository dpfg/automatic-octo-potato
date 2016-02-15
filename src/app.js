function ToDoApp(lib) {
  var eventBus = new lib.events.EventBus();
  this.storage = new lib.storage.InMemory();
  this.views = [
    new lib.views.EnterView(eventBus, new lib.controllers.EnterController(eventBus, this.storage)),
    new lib.views.ListView(eventBus, new lib.controllers.ListController(eventBus, this.storage)),
    new lib.views.ToolbarView(eventBus, new lib.controllers.ToolbarController(eventBus, this.storage)),
    ];
}


var app = new ToDoApp(window.lib);
