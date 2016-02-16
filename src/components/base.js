
export class Component {

  constructor (eventBus, controller, view) {
    this.controller = controller;
    this.view = view;
    this.eventBus = eventBus;
    this.view.onEvent = () => this.$upstream();
    eventBus.subscribe(() => this.$downsteam());
  }

  $downsteam () {
    if (this.view.$update()) {
      this.view.display();
    }
  }

  $upstream () {
    this.eventBus.fire();
  }
}

export class View {
  constructor (elementSelector = null) {
    this.bindings = [];
    this.state = {};
    if (elementSelector) {
      this.el = document.querySelector(elementSelector);
    }
    this.onEvent = () => 0;
  }

  $model (name, valueGetter, valueSetter) {
    const value = valueGetter();

    this.state[name] = value;
    this.bindings.push({ key: name, valueGetter, valueSetter });
    return value;
  }

  $event (element, eventName, handler) {
    element.addEventListener(eventName, () => {
      if (handler.call(this, window.event.target)) {
        this.onEvent();
      }
    });
  }

  $update () {
    let hasChanges = false;
    
    let i = 0;
    while (!hasChanges && i < this.bindings.length) {
      const binding = this.bindings[i];
      const updateValue = binding.valueGetter();      
      hasChanges = updateValue !== this.state[binding.key];
                        
      binding.valueSetter(updateValue);
      this.state[binding.key] = updateValue;
      i++;
    }
    
    return hasChanges;
  }

  display () {

  }
}

