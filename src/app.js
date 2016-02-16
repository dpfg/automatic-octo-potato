import { EnterComponent } from './components/enter';
import { ToDoListComponent } from './components/list';
import { ToolbarComponent } from './components/toolbar';
import { EventBus } from './events';
import { InMemory } from './storage';

class ToDoApp {
  constructor () {
    this.eventBus = new EventBus();
    this.storage = new InMemory();

    this.components = [
      new EnterComponent(this.eventBus, this.storage),
      new ToDoListComponent(this.eventBus, this.storage),
      new ToolbarComponent(this.eventBus, this.storage)
    ];
  }

  display () {
    this.components.forEach(component => component.display());
  }
}

window.todoapp = new ToDoApp();
