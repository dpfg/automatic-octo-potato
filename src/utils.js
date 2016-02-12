
;var lib = (function(document, lib) {
  function EventBus() {
    this.subscribers = {};
  }
  
  EventBus.prototype.subscribe = function(eventType, subscriber) {
    this.subscribers[eventType] = this.subscribers[eventType] || [];
    this.subscribers[eventType].push(subscriber);  
  }
  
  EventBus.prototype.fire = function(eventType, params) {
    if(!this.subscribers[eventType]) {
      return;
    }
    
    this.subscribers[eventType].forEach(function(subscriber){
      subscriber(params);
    });
  }
  
  lib.events.EventBus = EventBus;
  
  // declare all events that can be fired in the app.
  lib.events = lib.events || {};
  lib.events.TODO_ADDED = 1;
  lib.events.TODO_COMPLETED = 2;
  lib.events.TODO_DELETED = 3;
  lib.events.SWITCH_VIEW_MODE = 20;

  lib.constants = lib.constants || {};
  lib.constants.VIEW_MODE_ALL = 100;
  lib.constants.VIEW_MODE_COMPLETED = 101;
  lib.constants.VIEW_MODE_ACTIVE = 102;
  
  lib.storage = [];
  
  return lib;
})(document, lib || {});
