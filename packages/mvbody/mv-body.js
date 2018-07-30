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

import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
import ResizeObserver from 'resize-observer-polyfill';
import {style} from './mv-body-css.js';

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

    this.maxheight = '900px'; // px unit
    this.float = 'center'; // top, center
  }


  ready() {
    super.ready();
  }

  _createRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
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

  _firstRendered() {
    window.onresize = (event) => {
      this.requestRender();
    };
  }

  _didRender() {
    this.mongol = this._root.querySelector('#mongol');

    if (!this.parentIsBody() || this.hasMultipleMvbody()) {
      this.style.display = 'none';
      return;
    }
    this.initElementStyles();
  }

  async initElementStyles() {
    await afterNextRender();

    this.setMongolWidth(0);

    this.style.height = this.windowClientHeight() + 'px';

    this.setMongolWidth(this.clientHeight);

    // fix this height to fit window height. erase right scroll bar.
    let y = 0;
    window.scrollTo(0, 1);
    while (window.pageYOffset > y) {
      y = window.pageYOffset;
      window.scrollTo(0, y + 1);
    }
    if (y) {
      this.style.height = (this.getComputedStyle(this, 'height') - y) + 'px';
      this.setMongolWidth(this.clientHeight);
    }

    // if window height is too small, smaller than mongol smallest height.
    if (this.mongol.clientWidth < this.mongol.scrollWidth) {
      this.setMongolWidth(this.mongol.scrollWidth);
      this.style.height = this.mongol.offsetWidth + 'px';
    }

    // set element height with maxheight property
    const mh = this.getDimensionNumber(this.maxheight);
    if (mh < this.getComputedStyle(this, 'height')) {
      this.style.height = mh + 'px';
      this.setMongolWidth(this.clientHeight);
    }

    // set element float position.
    if (this.float == 'center') {
      const top = (window.innerHeight - this.getComputedStyle(this, 'height')) / 2;
      this.style.top = top + 'px';
    }

    
    this.style.width = this.mongol.scrollHeight + 'px';
    this.parentElement.style.width = this.getComputedStyle(this, 'width') + this.getComputedStyle(this.parentElement, 'margin') + 'px';
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

  setMongolWidth(width) {
    this.mongol.style.width = width + 'px';
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

  windowClientHeight() {
    return window.innerHeight
     - this.getComputedStyle(this.parentElement, 'padding-top') - this.getComputedStyle(this.parentElement, 'padding-bottom')
     - this.getComputedStyle(this.parentElement, 'margin-top') - this.getComputedStyle(this.parentElement, 'margin-bottom');
  }
}

customElements.define(MvBody.tag(), MvBody);
