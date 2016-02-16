export class View {
  constructor (elementSelector = null) {
    if (elementSelector) {
      this.el = document.querySelector(elementSelector);
    }
  }

  addEventListener(element, eventName, handler) {
    element.addEventListener(eventName, () => {
      if (handler.call(this, window.event.target)) {
        this.onEvent();
      }
    });
  }

  display () {

  }
}

