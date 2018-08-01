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
import ResizeObserver from 'resize-observer-polyfill';
import { style } from './mv-body-css.js';

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
    this.minMongolHeight;  // min content height in mongol div.
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
    //this.mongol.style.display = 'none';
    await afterNextRender();

    this.setMinMongolHeight();
    this.style.height = this.bodyHeight() + 'px';
    // clear this style top to default value.
    this.style.top = '';

    // if window height is too small, smaller than mongol smallest height.
    if (this.bodyHeight() <= this.minMongolHeight) {
      this.style.height = this.minMongolHeight + 'px';
    } else {
      // set element height with maxheight property
      const mh = this.getDimensionNumber(this.maxheight);
      if (this.bodyHeight() < mh) {
        this.style.height = this.bodyHeight() + 'px';
      } else {
        this.style.height = mh + 'px';
        // set element float position.
        if (this.float == 'center') {
          this.style.top = (this.bodyHeight() - mh) / 2 + 'px';
        }
      }
    }

    this.setMongolWidth(this.clientHeight);
    this.style.width = this.mongol.scrollHeight + 'px';
    //this.parentElement.style.width = this.getComputedStyle(this, 'width') + this.getComputedStyle(this.parentElement, 'margin') + 'px';
  }

  parentIsBody() {
    if ((this.parentElement.tagName.toUpperCase() != 'BODY') && (this.parentElement.tagName.toUpperCase() != 'TEST-FIXTURE')) {
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

    const mh = this.getDimensionNumber(this.maxheight);
    const bh = this.bodyHeight();
    
    if ((bh > this.minMongolHeight) && (bh < mh)) {
      window.scrollTo(1, 1);
      while (window.pageYOffset > 0) {
        const h = this.getDimensionNumber(this.mongol.style.width);
        if (((h - 1) >= this.minMongolHeight)) {
          this.mongol.style.width = (h - 1) + 'px';
          this.style.height = this.mongol.offsetWidth + 'px';
        } else {
          break;
        }
        window.scrollTo(0, 0);
        window.scrollTo(1, 1);
        scrollY += 1;
      }
    }
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
      - this.getComputedStyle(this.parentElement, 'margin-top') - this.getComputedStyle(this.parentElement, 'margin-bottom');
  }

  thisFixWindowHeight() {
    return this.getComputedStyle(this, 'height') - - this.getComputedStyle(this.parentElement, 'margin-top') - this.getComputedStyle(this.parentElement, 'margin-bottom');
  }

  windowClientHeight() {
    return window.innerHeight
      - this.getComputedStyle(this.parentElement, 'padding-top') - this.getComputedStyle(this.parentElement, 'padding-bottom')
      - this.getComputedStyle(this.parentElement, 'margin-top') - this.getComputedStyle(this.parentElement, 'margin-bottom');
  }

  async setThisHeightToParentHeight() {
    while (this.parentElement.clientWidth < this.mongol.scrollHeight) {
      this.style.height(this.mongol.offsetWidth + 1);
      this.style.height = this.mongol.offsetWidth + 'px';
    }
    await afterNextRender();
    if (this.parentNode.clientWidth < this.mongol.scrollHeight) {
      this.setMongolHeightToParentWidth();
    }
  }

  setMinMongolHeight() {
    this.setMongolWidth(0);
    this.minMongolHeight = this.mongol.scrollWidth;
  }
}

customElements.define(MvBody.tag(), MvBody);
