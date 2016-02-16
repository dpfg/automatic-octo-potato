import { EnterView } from './components/enter';
import { ListView } from './components/list';
import { ToolbarView } from './components/toolbar';
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

  display () {
    this.components.forEach(component => component.display());
  }
}

window.todoapp = new ToDoApp();
