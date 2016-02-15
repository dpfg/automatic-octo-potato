export class EventBus {
  constructor () {
    this.subscribers = [];
  }

  subscribe (subscriber) {
    this.subscribers.push(subscriber);
  }

  fire (params) {
    this.subscribers.forEach(subscriber => subscriber(params));
  }
}
