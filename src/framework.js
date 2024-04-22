function getActions(element) {
  return {
    element,
    setStyle: (styles) => setStyle(element, styles),
    setText: (text) => {
      element.innerText = text;
      return getElement(element);
    },
    appendChild: (child) =>
      getElement(
        (element.element ? element.element : element).appendChild(
          child.element ? child.element : child
        )
      ),
    appendTo: (parent) => {
      parent.appendChild(element);
      return getElement(parent);
    },
    appendToBody: () => {
      document.body.appendChild(element);
      return getElement(element);
    },
  };
}

export function getElement(element) {
  return getActions(element);
}

export function createElement(tagName) {
  const element = document.createElement(tagName);
  return getActions(element);
}

export function setStyle(element, styles) {
  console.log(
    "element.style",
    styles,
    element.element ? element.element : element
  );
  const elementStyle = element.element ? element.element.style : element.style;
  for (const key in styles) {
    elementStyle[key] = styles[key];
  }
  return getElement(element);
}

export function createDiv() {
  return createElement("div");
}

export function createPre() {
  return createElement("pre");
}

export function createParagraph() {
  return createElement("p");
}

export function createSpan() {
  return createElement("span");
}
