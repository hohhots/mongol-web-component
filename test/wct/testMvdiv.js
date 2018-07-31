
const innerDivId = 'mongol';

let parent;
let mvdiv;
let mongol;

const wait = async (milliseconds) => {
  await mvdiv.renderCompleted;

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

  if (parent.style.height) {
    fixedHeightDivTests();
  } else {
    defaultHeightDivTests();
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
  if ((mongol.offsetWidth >= parent.clientHeight)) {
    assert.equal(mvdiv.clientHeight, mongol.offsetWidth, 'mvdiv.clientHeight, mongol.offsetWidth');
  }
};

const emptyMvdivTest = () => {
  mvDivCommonTests();

  assert.equal(mongol.style.width, '0px', 'mongol.style.width');
  assert.equal(mongol.clientHeight, 0, 'mongol.clientHeight');
  assert.equal(mongol.clientWidth, 0, 'mongol.clientWidth');

  assert.equal(mvdiv.style.height, '0px', 'mvdiv.style.height');
}

const smallContenMvdivTest = () => {
  mvDivCommonTests();

  assert.notEqual(getStyle(mongol, 'width'), '0px');
  assert.notEqual(getStyle(mongol, 'height'), '0px');
};

const resizeWindowTest = (id, test) => {
  test();

  const wm = document.body.style.margin;
  document.body.style.margin = '10px';
  wait(100);
  fixture(id);

  test();

  document.body.style.margin = wm;
  wait(100);
};

const resizeParentHeightTest = (id, test) => {
  test();

  const ph = parent.style.height;
  parent.style.height = (parent.style.offsetHeight + 200) + 'px';
  wait(100);
  fixture(id);

  test();

  parent.style.height = ph;
  wait(100);
};

const resizeParentHWTest = (id, test) => {
  test();

  const ph = parent.style.height;
  parent.style.height = (parent.style.offsetHeight + 200) + 'px';
  wait(100);
  fixture(id);

  test();

  parent.style.height = ph;
  wait(100);

  const pw = parent.style.width;
  parent.style.width = (parent.style.offsetWidth + 200) + 'px';
  wait(100);
  fixture(id);

  test();

  parent.style.width = pw;
  wait(100);
};

