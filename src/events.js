
var lib = (function (document, lib) {
  var ANY_EVENT_TYPE = -1;

  function EventBus() {
    this.subscribers = {};
  }

  EventBus.prototype.subscribe = function (eventType, subscriber) {
    if (!subscriber) {
      subscriber = eventType;
      eventType = ANY_EVENT_TYPE;
    }
    this.subscribers[eventType] = this.subscribers[eventType] || [];
    this.subscribers[eventType].push(subscriber);
  }

  EventBus.prototype.fire = function (eventType, params) {
    var toNotify = []
      .concat(this.subscribers[eventType] || [])
      .concat(this.subscribers[ANY_EVENT_TYPE] || []);

    toNotify.forEach(function (subscriber) {
      subscriber(params);
    });
  }

  lib.events = lib.events || {};
  lib.events.EventBus = EventBus;

  // declare all events that can be fired in the app.
  lib.events.TODO_ADDED = 1;
  lib.events.TODO_COMPLETED = 2;
  lib.events.TODO_DELETED = 3;
  lib.events.TODO_TOGGLE_ALL = 4;
  lib.events.TODO_ACTIVATE = 4;
  lib.events.SWITCH_VIEW_MODE = 20;

  lib.events.CLEAN_COMPLETED = 30;
  lib.events.APP_LOADED = 31;

  return lib;
})(document, lib || {});
