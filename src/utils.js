
var lib = (function (document, lib) {
  // declare global constants
  lib.constants = lib.constants || {};
  
  lib.constants.VIEW_MODE_UNKNOWN = 100;
  lib.constants.VIEW_MODE_ALL = 101;
  lib.constants.VIEW_MODE_COMPLETED = 102;
  lib.constants.VIEW_MODE_ACTIVE = 103;

	// simple DSL to create new todo DOM elements 
  lib.html = lib.html || {};
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
  }

  var dsl = {
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

  // define templates using DSL described above
  lib.html.templates = lib.html.templates || {};
  lib.html.templates.newToDo = function () {
    return dsl.li(
      dsl.div('view',
        dsl.input('toggle', 'checkbox'),
        dsl.label(),
        dsl.button('destroy'))
      );
  }

  return lib;
})(document, lib || {});
