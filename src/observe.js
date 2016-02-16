export class Observable {

  constructor (value) {
    this.subscribers = [];
    this.value = value;
  }

  static of (func) {
    const obs = new Observable();
    const dependencies = Array.prototype.slice.call(arguments, 1);

    dependencies.forEach(dep => dep.subscribe(() => {
      obs.setValue(func.apply(null, dependencies.map(_dep => _dep.getValue())));
    }));

    return obs;
  }

  subscribe (next) {
    this.subscribers.push({ next });
  }

  setValue (value) {
    this.value = value;
    this.subscribers.forEach(subscriber => subscriber.next(this.value));
  }

  getValue () {
    return this.value;
  }
}
