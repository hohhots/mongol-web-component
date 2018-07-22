/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import {Div} from '@material/mv-div';

let parent;
let parentStyle;
let element;
let elementStyle;
let mongol;
let mongolStyle;

suite('mv-div');

beforeEach(async () => {
  parent = document.createElement('div');
  element = document.createElement('mv-div');
  parent.appendChild(element);

  document.body.appendChild(parent);

  mongol = element.shadowRoot.querySelector('#mongol');

  parentStyle = window.getComputedStyle(parent, null);
  elementStyle = window.getComputedStyle(element, null);
  mongolStyle = window.getComputedStyle(mongol, null);
});

afterEach(() => {
  document.body.removeChild(parent);
});

test('initializes as an mv-div', () => {
  assert.instanceOf(element, Div);
  assert.instanceOf(mongol, window.HTMLDivElement);
});

test('instantiating without container', () => {
  element = document.createElement('mv-div');
  document.body.appendChild(element);

  assert.equal(element.style.display, 'none');
});

test('instantiating with container not div', () => {
  parent = document.createElement('p');
  element = document.createElement('mv-div');
  parent.appendChild(element);
  document.body.appendChild(parent);

  assert.equal(element.style.display, 'none');
});

test('instantiating the empty element in a default div', async () => {
  // element.requestRender();
  // await element.renderComplete;
  element._didRender();

  assert.equal(parentStyle.getPropertyValue('margin'), '0px');
  assert.equal(parentStyle.getPropertyValue('padding'), '0px');
  // console.log(parent);
  assert.equal(mongol.clientHeight, 0);
  assert.equal(mongol.clientWidth, 0);
});

test('instantiating the element with content in a default div', async () => {
  await element.renderComplete;

  mongol.innerHTML = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.1111Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.  1111Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.1111Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.';

  assert.equal(mongol.offsetWidth, parent.clientHeight);
});
/**
test('instantiating the element in a default div', async () => {
  await element.renderComplete;

  element.innerHTML = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.1111Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.  1111Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.1111Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni aliquam ipsam non nobis! Fugit quidem itaque odio illum quam porro rem! Corrupti ducimus, dolores iste voluptate dolore obcaecati suscipit distinctio.';
  const mongol = element.shadowRoot.querySelector('#mongol');

  assert.instanceOf(container, window.HTMLDivElement);
  assert.instanceOf(mvDiv, window.HTMLDivElement);

  // assert.equal(element.style.margin, 0);
  // assert.equal(container.hasAttribute('height'), false);
});*/
