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
      mongolWidth: Number,
    };
  }

  constructor() {
    super();

    this.mongolId = '#mongol';
    this.mongolWidth = 0;

    // browser's horizontal scroll bar height.
    this.scrollBarHeight;
    this.previousScrollBar = false;

    this.resizeDelay = 20;
    this.resizeTimer;

    this.previousWindowDimensions = {};
    this.previousMongolDimension = {};
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
      <div id="mongol" style$="width: ${this.mongolWidth}px">
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
    console.log('mvbody first rendered.');

    if (!this.validMvbody()) {
      return;
    }

    await this.setScrollBarHeight();

    window.onresize = (event) => {
      if ((this.previousScrollBar != this.wHasXScrollBar()) || this.widowHeightChanged()) {
        // Temporary disable resize observer for fix bug on firefox
        this.disableMongolResizeOberver();

        this.triggerResize(event);
      }

      this.setPreviousDimensions();
    };

    this.resizeObserver = new ResizeObserver((entries) => {
      console.log('observe mongol');
      for (const entry of entries) {
        this.triggerResize(entry);
      }
    });
    this.enableMongolResizeOberver();

    this.resizeMongol();
  }

  _didRender() {
    console.log('_didRender');

    this.parent = this.parentElement;
    this.mongol = this._root.querySelector(this.mongolId);

    this.resizeThis();
  }

  triggerResize(event) {
    clearTimeout(this.resizeTimer);

    this.resizeTimer = setTimeout(() => {
      this.resizeMongol(event);

      this.enableMongolResizeOberver();
    }, this.resizeDelay);
  }

  resizeBody() {
    console.log('resize body');

    this.parent.style.width = `${this.getComputedStyle(this, 'width')}px`;

    // emulate horizontal text html behavior.
    this.parent.parentElement.style.width = `${this.getComputedStyle(this.parent, 'width')
      + this.getComputedStyle(this.parent, 'margin-left')
      + this.getComputedStyle(this.parent, 'margin-right')}px`;
  }

  resizeThis() {
    console.log('resize mv-body');

    this.style.height = `${this.getComputedStyle(this.mongol, 'width')}px`;
    this.style.width = `${this.getComputedStyle(this.mongol, 'height')}px`;

    this.resizeBody();
  }

  async resizeMongol(event) {
    console.log('resize mongol', this.scrollBarHeight, event);

    if (this.mongolSameSize(event)) {
      return;
    }

    const th = this.bodyHeight();
    await this.setMongolWidth(th);

    if (this.wHasXScrollBar()) {
      this.previousScrollBar = true;
      // mobile browser has no scroll bar height.
      if (this.scrollBarHeight) {
        await this.setMongolWidth(th - this.scrollBarHeight);
      }
    } else {
      this.previousScrollBar = false;
    }

    this.setPreviousDimensions();
  }

  setMongolWidth(width) {
    console.log('set mongol width - ', width);
    if (this.mongolWidth != width) {
      this.mongolWidth = width;
    } else {
      this._didRender();
    }
  }

  parentIsBody() {
    if (this.parentElement.tagName.toUpperCase() != 'BODY') {
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
    // for browser on pc
    let height = window.innerHeight;
    // for chrome in android and with big content
    if (window.innerHeight > window.outerHeight) {
      height = window.outerHeight;
    }

    return height
      - this.getComputedStyle(this.parent, 'margin-top')
      - this.getComputedStyle(this.parent, 'margin-bottom');
  }

  validMvbody() {
    if (!this.parentIsBody() || this.hasMultipleMvbody()) {
      this.style.display = 'none';
      return false;
    }
    return true;
  }

  enableMongolResizeOberver() {
    console.log('e-nabled');
    this.resizeObserver.observe(this.mongol);
    this.parent.style.overflowY = '';
  }

  disableMongolResizeOberver() {
    console.log('d-isabled');
    this.resizeObserver.disconnect(this.mongol);
    this.parent.style.overflowY = 'hidden';
  }

  widowHeightChanged() {
    if (window.innerHeight != this.previousWindowDimensions.innerHeight) {
      return true;
    }
    return false;
  }

  setPreviousDimensions() {
    this.previousWindowDimensions.innerHeight = window.innerHeight;

    this.previousMongolDimension.height = this.getComputedStyle(this.mongol, 'height');
    this.previousMongolDimension.width = this.getComputedStyle(this.mongol, 'width');
  }

  mongolSameSize(event) {
    // if is init or window resize event.
    if (!event || (event.target == window)) {
      return false;
    } else {
      // if is mongol div resize event.
      if ((this.previousMongolDimension.height == this.getComputedStyle(this.mongol, 'height'))
        && (this.previousMongolDimension.width == this.getComputedStyle(this.mongol, 'width'))) {
        return true;
      }
    }
    return false;
  }

  setScrollBarHeight() {
    if (!this.scrollBarHeight) {
      this.style.display = 'none';

      const div = document.createElement('div');
      div.style.height = '100vh';
      div.style.width = '110vw';
      document.body.appendChild(div);

      window.scrollTo(0, div.scrollHeight);
      this.scrollBarHeight = Math.ceil(window.pageYOffset)
        - this.getComputedStyle(this.parent, 'margin-top')
        - this.getComputedStyle(this.parent, 'margin-bottom');
      document.body.removeChild(div);
      this.style.display = '';
    }
  }
}

customElements.define(MvBody.tag(), MvBody);
