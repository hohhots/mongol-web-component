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

    // browser's horizontal scroll bar height.
    this.scrollBarHeight;

    this.resizeDelay = 100;
    this.resizeTimer;
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

    if (!this.validMvbody()) {
      return;
    }

    await this.setScrollBarHeight();

    window.onresize = () => {
      this.triggerResize();
    };

    this.resizeObserver = new ResizeObserver((entries) => {
      this.triggerResize();
    });
    this.resizeObserver.observe(this.parent);
    this.resizeObserver.observe(this.mongol);
  }

  _didRender() {
    console.log('mvbody reRendered.');

    if (!this.validMvbody()) {
      return;
    }

    this.parent = this.parentElement;
    this.mongol = this._root.querySelector(this.mongolId);
  }

  triggerResize() {
    clearTimeout(this.resizeTimer);

    this.resizeTimer = setTimeout(() => {
      this.resizeMongol();
    }, this.resizeDelay);
  }

  resizeBody() {
    console.log('body resized');

    this.parent.style.height = this.getComputedStyle(this.mongol, 'width') + 'px';
    this.parent.style.width = this.getComputedStyle(this.mongol, 'height') + 'px';

    // emulate horizontal text html behavior.
    this.parent.parentElement.style.width = this.getComputedStyle(this.parent, 'width')
      + this.getComputedStyle(this.parent, 'margin-left')
      + this.getComputedStyle(this.parent, 'margin-right') + 'px';
  }

  resizeMongol() {
    console.log('resize mongol');

    const th = this.bodyHeight();
    this.mongol.style.width = th + 'px';
    if (this.wHasYScrollBar()) {
      this.mongol.style.width = (th - this.scrollBarHeight) + 'px';
    }

    this.resizeBody();
  }

  parentIsBody() {
    const name = this.parentElement.tagName.toUpperCase();
    if ((name != 'BODY') && (name != 'TEST-FIXTURE')) {
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

  validMvbody() {
    if (!this.parentIsBody() || this.hasMultipleMvbody()) {
      this.style.display = 'none';
      return false;
    }
    return true;
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
    this.scrollBarHeight = sh;

    document.body.removeChild(div);
    document.body.appendChild(this);
  }
}

customElements.define(MvBody.tag(), MvBody);
