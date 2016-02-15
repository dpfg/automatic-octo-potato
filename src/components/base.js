
export class Component {

  constructor (eventBus, controller, view) {
    this.controller = controller;
    this.view = view;
    this.view.onEvent = () => eventBus.fire();
    eventBus.subscribe(() => this.$call());
  }

  $call () {
    if (this.view.$update()) {
      this.view.display();
    }
  }
}

export class View {
  constructor (elementSelector = null) {
    this.bindings = [];
    this.state = [];
    if (elementSelector) {
      this.el = document.querySelector(elementSelector);
    }
    this.onEvent = () => 0;
  }

  $model (name, valueGetter, valueSetter) {
    const value = valueGetter();

    this.state.push({ key: name, value });
    this.bindings.push({ key: name, valueGetter, valueSetter });
    return value;
  }

  $event (element, eventName, handler) {
    element.addEventListener(eventName, () => {
      handler.call(this, window.event.target);
      this.onEvent();
    });
  }

  $update () {
    let hasChanges = false;

    this.bindings.forEach(binding => {
      const updateValue = binding.valueGetter();

      hasChanges = updateValue !== this.state[binding.key];
      binding.valueSetter(updateValue);
    });
    return hasChanges;
  }

  display () {

  }
}

