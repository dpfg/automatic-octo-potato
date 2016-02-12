- model - describe ToDoItem, ToDoList
- storage - localstorage interface 
- controller - listen to DOM events
- view  - take data from storage and render it

Views:
- AllView.display() - go through the DOM element and fill them or add/remove
- ActiveView
- CompletedView

ToDo
  -> controller - subscribe to events. on hash changed - choose view and view.display()
  -> 