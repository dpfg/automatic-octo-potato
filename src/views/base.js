export class View {
  constructor (elementSelector = null) {
    if (elementSelector) {
      this.el = document.querySelector(elementSelector);
    }
  }

  bindModel (observable, callback) {
    observable.subscribe(value => callback.call(this, value));
  }

  bindEvent (eventName, element, handler) {
    element.addEventListener(eventName, () => {
      if (handler.call(this, window.event.target)) {
        this.onEvent();
      }
    });
  }
}

