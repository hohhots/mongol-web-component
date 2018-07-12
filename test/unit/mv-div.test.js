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
let element;

suite('mv-div');

beforeEach(() => {
  parent = document.createElement('div');
  document.body.appendChild(parent);

  element = document.createElement('mv-div');
  parent.appendChild(element);
});

afterEach(() => {
  document.body.removeChild(parent);
});

test('initializes as an mv-div', () => {
  assert.instanceOf(element, Div);
});

test('instantiating the element with default css properties works', async () => {
  await element.renderComplete;

  const container = element.shadowRoot.querySelector('.mv-div-container');
  const mvDiv = container.querySelector('.mv-div');

  assert.instanceOf(container, window.HTMLDivElement);
  assert.instanceOf(mvDiv, window.HTMLDivElement);

  // assert.equal(element.style.margin, 0);
  // assert.equal(container.hasAttribute('height'), false);
});
