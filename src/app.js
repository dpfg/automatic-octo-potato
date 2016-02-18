import { EnterView } from './views/enter';
import { ListView } from './views/list';
import { ToolbarView } from './views/toolbar';
import { InMemory } from './storage';
import { ToDoService } from './services';

class ToDoApp {
  constructor () {
    this.storage = new InMemory();
    this.todoService = new ToDoService(this.storage);

    this.components = [
      new EnterView(this.todoService),
      new ListView(this.todoService),
      new ToolbarView(this.todoService)
    ];
  }
}

window.todoapp = new ToDoApp();
