/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { afterNextRender } from '@material/mwc-base/utils.js';
import { style } from './mv-body-css.js';
import ResizeObserver from 'resize-observer-polyfill';

export class MvBody extends LitElement {
  static tag() {
    return 'mv-body';
  }

  static get properties() {
    return {
      maxheight: String,
      float: String,
    };
  }

  constructor() {
    super();

    this.mongolId = '#mongol';
    this.maxheight = '900px'; // px unit
    this.float = 'center'; // top, center

    // min content height in mongol div.
    this.minMongolHeight;
    // browser's horizontal scroll bar height.
    this.scrollBarHeight;
  }

  ready() {
    super.ready();
  }

  _createRoot() {
    return this.attachShadow({ mode: 'open', delegatesFocus: true });
  }

  _render() {
    return html`
      ${this._renderStyle()}
      <div id="mongol">
        <span class="mongol-text">
          <slot></slot>
        </span>
      </div>
    `;
  }

  _renderStyle() {
    return style;
  }

  async _firstRendered() {
    console.log('mvbody created.');

    await this.setScrollBarHeight();

    window.onresize = (event) => {
      this.windowResized(event);
    };

    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.tagName == 'BODY') {
          this.bodyResized(entry);
        }
        if (entry.target.tagName == this.tagName) {
          this.thisResized(entry);
        }
        if (entry.target.tagName == this.mongol.tagName) {
          this.mongolResized(entry);
        }
      });
    });
    // this.resizeObserver.observe(this.parent);
    // this.resizeObserver.observe(this);
    //this.resizeObserver.observe(this.mongol);
  }

  _didRender() {
    console.log('mvbody reRendered.');

    this.parent = this.parentElement;
    this.mongol = this._root.querySelector(this.mongolId);

    if (!this.parentIsBody() || this.hasMultipleMvbody()) {
      this.style.display = 'none';
      return;
    }
  }

  windowResized(event) {
    console.log('window resized');
    /*
    let h = this.bodyHeight();
    if (event && this.wHasXScrollBar()) {
      h = h - this.scrollBarHeight;
    }
    this.parent.style.height = h + 'px';
    */
  }

  bodyResized(body) {
    console.log('body resized');

    // emulate horizontal text html behavior.
    this.parent.parentElement.style.width = this.getComputedStyle(this.parent, 'width')
      + this.getComputedStyle(this.parent, 'margin-left')
      + this.getComputedStyle(this.parent, 'margin-right') + 'px';
  }

  thisResized(mvbody) {
    console.log('mv-body resized');
    //const { left, top, width, height } = mvbody.contentRect;
    const height = mvbody.contentRect.height;
    this.mongol.style.width = height + 'px';
  }

  mongolResized(mongol) {
    console.log('mongol resized');
    const height = mongol.contentRect.height;

    this.parent.style.width = height + 'px';
  }

  parentIsBody() {
    if (this.parent.tagName.toUpperCase() != 'BODY') {
      return false;
    }

    return true;
  }

  hasMultipleMvbody() {
    if (document.querySelectorAll('mv-body').length > 1) {
      return true;
    }
    return false;
  }

  wHasYScrollBar() {
    window.scrollTo(0, 0);
    window.scrollTo(0, 1);
    if (window.pageYOffset > 0) {
      return true;
    }
    return false;
  }

  wHasXScrollBar() {
    window.scrollTo(0, 0);
    window.scrollTo(1, 0);
    if (window.pageXOffset > 0) {
      return true;
    }
    return false;
  }

  getComputedStyle(el, property) {
    const p = window.getComputedStyle(el, null).getPropertyValue(property);
    if (p.indexOf('px') > 0) {
      return this.getDimensionNumber(p);
    }
    return p;
  }

  getDimensionNumber(dimension) {
    return parseInt(dimension.replace('px', ''));
  }

  bodyHeight() {
    return window.innerHeight
      - this.getComputedStyle(this.parent, 'margin-top') - this.getComputedStyle(this.parent, 'margin-bottom');
  }

  setScrollBarHeight() {
    document.body.removeChild(this);

    const div = document.createElement('div');

    div.style.height = this.bodyHeight() + 'px';
    div.style.width = window.innerWidth + 30 + 'px';

    document.body.appendChild(div);

    let th;
    let sh = 0;
    while (this.wHasYScrollBar()) {
      th = this.getDimensionNumber(div.style.height);
      div.style.height = (th - 1) + 'px';
      ++sh;
    }
    this.scrollBarHeight = sh;console.log(sh);

    document.body.removeChild(div);
    document.body.appendChild(this);
  }
}

customElements.define(MvBody.tag(), MvBody);
