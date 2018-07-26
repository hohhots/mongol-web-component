
const innerDivId = 'mongol';

let parent;
let mvdiv;
let mongol;

const wait =  (milliseconds) => {
  milliseconds = milliseconds || 1500;
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
};

const getStyle = (el, property) => window.getComputedStyle(el, null).getPropertyValue(property);

const fixture = (mvdivId) => {
  mvdiv = document.querySelector('#' + mvdivId);
  mongol = mvdiv.shadowRoot.querySelector('#' + innerDivId);
  parent = mvdiv.parentElement;
};

const mvDivCommonTests = () => {
  assert.equal(getStyle(mongol, 'transform-origin'), '0px 0px');
  assert.notEqual(getStyle(mongol, 'transform'), 'none');

  assert.equal(mongol.offsetWidth, mvdiv.clientHeight, 'mongol.offsetWidth, mvdiv.clientHeight');
  assert.isAtLeast(mvdiv.clientWidth - mongol.offsetHeight, 0, '(mvdiv.clientWidth - mongol.offsetHeight) >= 0');

  if (!parent.style.height) {
    defaultHeightDivTests();
  } else {
    fixedHeightDivTests();
  }
};

const defaultHeightDivTests = () => {
  assert.equal(mvdiv.offsetHeight, parent.clientHeight, 'mvdiv.offsetHeight, parent.clientHeight');
  assert.equal(mvdiv.offsetWidth, parent.clientWidth, 'mvdiv.offsetWidth, parent.clientWidth');
};

const fixedHeightDivTests = () => {
  assert.equal(mvdiv.offsetHeight, parent.scrollHeight, 'mvdiv.offsetHeight, parent.scrollHeight');
  assert.isAtLeast(parent.scrollWidth - mvdiv.offsetWidth, 0, 'mvdiv.offsetWidth, parent.scrollWidth');
  if ((mongol.offsetHeight >= parent.clientWidth)) {
    assert.equal(mvdiv.clientWidth, mongol.offsetHeight, 'mvdiv.clientWidth, mongol.offsetHeight');
  }
};
