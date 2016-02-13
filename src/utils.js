
;var lib = (function(document, lib) {
  var ANY_EVENT_TYPE = -1;
  
  function EventBus() {    
    this.subscribers = {};
  }
  
  EventBus.prototype.subscribe = function(eventType, subscriber) {
    if(!subscriber) {
      subscriber = eventType;
      eventType = ANY_EVENT_TYPE;
    }
    this.subscribers[eventType] = this.subscribers[eventType] || [];
    this.subscribers[eventType].push(subscriber);  
  }
  
  EventBus.prototype.fire = function(eventType, params) {
    console.log('Fire Event:' + eventType);
    var toNotify = []
                    .concat(this.subscribers[eventType] || [])
                    .concat(this.subscribers[ANY_EVENT_TYPE] || []);    
                    
    toNotify.forEach(function(subscriber){
      subscriber(params);
    });
  }
  
  lib.events = lib.events || {};
  lib.events.EventBus = EventBus;
  
  // declare all events that can be fired in the app.
  lib.events.TODO_ADDED = 1;
  lib.events.TODO_COMPLETED = 2;
  lib.events.TODO_DELETED = 3;
  lib.events.SWITCH_VIEW_MODE = 20;
  
  lib.events.CLEAN_COMPLETED = 30;

  lib.constants = lib.constants || {};
  lib.constants.VIEW_MODE_UNKNOWN = 100;
  lib.constants.VIEW_MODE_ALL = 101;
  lib.constants.VIEW_MODE_COMPLETED = 102;
  lib.constants.VIEW_MODE_ACTIVE = 103;
  
  lib.storage = [];
  
  return lib;
})(document, lib || {});
