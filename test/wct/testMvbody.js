const innerDivId = 'mongol';

let parent;
let mvbody;
let mongol;

let clone;

const wait = async (milliseconds) => {
  milliseconds = milliseconds || 1500;
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
};

const getStyle = (el, property) => window.getComputedStyle(el, null).getPropertyValue(property);

const template = async (tempId) => {
  const t = document.querySelector('#' + tempId);
  clone = document.importNode(t.content, true);
  
};

const mvFixture = (mvbodyId) => {
  mvbody = document.querySelector('#' + mvbodyId);
  mongol = mvbody.shadowRoot.querySelector('#' + innerDivId);
  parent = mvbody.parentElement;
  console.log(parent.parentElement.tagName, parent.tagName);
};

const getComputedStyle = (el, property) => {
  const p = window.getComputedStyle(el, null).getPropertyValue(property);
  if (p.indexOf('px') > 0) {
    return getDimensionNumber(p);
  }
  return p;
};

const getDimensionNumber = (dimension) => {
  return parseInt(dimension.replace('px', ''));
};

const bodyHeight = () => {
  return window.innerHeight
    - getComputedStyle(parent, 'margin-top') - getComputedStyle(parent, 'margin-bottom');
};


