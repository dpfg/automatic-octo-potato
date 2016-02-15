
; var lib = (function (document, lib) {
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
  lib.events.SWITCH_VIEW_MODE = 20;

  lib.events.CLEAN_COMPLETED = 30;

  lib.constants = lib.constants || {};
  lib.constants.VIEW_MODE_UNKNOWN = 100;
  lib.constants.VIEW_MODE_ALL = 101;
  lib.constants.VIEW_MODE_COMPLETED = 102;
  lib.constants.VIEW_MODE_ACTIVE = 103;

  lib.storage = [];


  function generateDOMElement(name, clazz, children) {
    var _div = document.createElement(name);
    if (children) {
      children.forEach(function (child) {
        _div.appendChild(child);
      });
    }
    if (clazz) {
      _div.classList.add(clazz);
    }

    return _div;
  };

  lib.html = lib.html || {};
  lib.html.dsl = {
    div: function (clazz) { return generateDOMElement('div', clazz, Array.prototype.slice.call(arguments, 1)); },
    li: function () { return generateDOMElement('li', null, Array.apply(null, arguments)); },
    input: function (clazz, type) {
      var inp = generateDOMElement('input', clazz, Array.prototype.slice.call(arguments, 2));
      if (type) {
        inp.setAttribute('type', type);
      }
      return inp;
    },
    label: function () { return generateDOMElement('label', null, Array.apply(null, arguments)); },
    button: function (clazz) { return generateDOMElement('button', clazz, Array.prototype.slice.call(arguments, 1)); }
  };
  var dsl = lib.html.dsl;

  lib.html.templates = lib.html.templates || {};
  lib.html.templates.newToDo = function () {
    return dsl.li(
      dsl.div('view',
        dsl.input('toggle', 'checkbox'),
        dsl.label(),
        dsl.button('destroy'))
      );
  };

  return lib;
})(document, lib || {});
