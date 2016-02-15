const generateDOMElement = (name, clazz, children) => {
  const div = document.createElement(name);

  if (children) {
    children.forEach(function (child) {
      div.appendChild(child);
    });
  }

  if (clazz) {
    div.classList.add(clazz);
  }

  return div;
};

const div = (clazz, ...children) => {
  return generateDOMElement('div', clazz, children);
};
const li = (...children) => generateDOMElement('li', null, children);
const input = (clazz, type, ...children) => {
  const inp = generateDOMElement('input', clazz, children);

  if (type) {
    inp.setAttribute('type', type);
  }
  return inp;
};
const label = (...children) => generateDOMElement('label', null, children);
const button = (clazz, ...children) => generateDOMElement('button', clazz, children);

export default {
  newToDo: () => {
    return li(
      div('view',
        input('toggle', 'checkbox'),
        label(),
        button('destroy'))
      );
  }
};
