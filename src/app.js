function ToDoApp(lib) {
  this.controller = new lib.controllers.ToDoList();
  this.views = [
    new lib.views.EnterView(this.controller),
    new lib.views.ListView(this.controller),
    ];
}


var app = new ToDoApp(window.lib);
