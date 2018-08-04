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
    this.minMongolHeight;  // min content height in mongol div.
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

  _firstRendered() {
    console.log('mvbody created.');

    this.setScrollBarHeight();

    window.onresize = (event) => {
      this.requestRender();
    };
  }

  _didRender() {
    console.log('mvbody reRendered.');
    this.mongol = this._root.querySelector(this.mongolId);

    if (!this.parentIsBody() || this.hasMultipleMvbody()) {
      this.style.display = 'none';
      return;
    }
    this.initElementStyles();
  }

  async initElementStyles() {
    await afterNextRender();

    this.setMinMongolHeight();
    this.style.height = this.bodyHeight() + 'px';
    // clear this style top to default value.
    this.style.top = '';
    this.parentElement.parentElement.removeAttribute('style');

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
    this.setThisWidth();
    this.setBodyWidth();
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

  setThisWidth() {
    const ot = this.getComputedStyle(this, 'top');

    this.style.width = this.mongol.scrollHeight + 'px';

    if ((ot > 0) && (this.getThisFixWindowWidth() > window.innerWidth)) {
      this.style.top = ot - (this.scrollBarHeight / 2) + 'px';
    }
  }

  async setMongolWidth(width) {
    this.mongol.style.width = width + 'px';

    const mh = this.getDimensionNumber(this.maxheight);
    const bh = this.bodyHeight();

    if ((bh > this.minMongolHeight) && (bh < mh)) {
      this.setMongolWidthToFitWindow();

      await afterNextRender();

      if ((window.innerWidth >= this.parentElement.parentElement.offsetWidth)
        && (window.innerHeight > this.getThisFixWindowHeight())
        && ((window.innerHeight - this.getThisFixWindowHeight() > 10))) {
        this.requestRender();
      }
    }
  }

  async setMongolWidthToFitWindow() {
    while (this.wHasYScrollBar()) {
      const h = this.getDimensionNumber(this.mongol.style.width);
      if (((h - 1) >= this.minMongolHeight)) {
        this.mongol.style.width = (h - 1) + 'px';
        this.style.height = this.mongol.offsetWidth + 'px';
      } else {
        break;
      }
    }

    await afterNextRender();
    if (this.wHasYScrollBar()) {
      this.setMongolWidthToFitWindow();
    }
    await afterNextRender();
  }

  wHasYScrollBar() {
    window.scrollTo(0, 0);
    window.scrollTo(0, 1);
    if (window.pageYOffset > 0) {
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
      - this.getComputedStyle(this.parentElement, 'margin-top') - this.getComputedStyle(this.parentElement, 'margin-bottom');
  }

  setMinMongolHeight() {
    this.setMongolWidth(0);
    this.minMongolHeight = this.mongol.scrollWidth;
  }

  getThisFixWindowWidth() {
    return this.getComputedStyle(this, 'width')
      + this.getComputedStyle(this.parentElement, 'margin-left')
      + this.getComputedStyle(this.parentElement, 'margin-right');
  }

  getThisFixWindowHeight() {
    return this.getComputedStyle(this, 'height')
      + this.getComputedStyle(this.parentElement, 'margin-top')
      + this.getComputedStyle(this.parentElement, 'margin-bottom');
  }

  setBodyWidth() {
    const p = this.parentElement;
    const pp = this.parentElement.parentElement;
    p.style.width = this.offsetWidth
      + this.getComputedStyle(this, 'margin-left')
      + this.getComputedStyle(this, 'margin-right') + 'px';

    const ppWidth = this.getComputedStyle(p, 'width')
      + this.getComputedStyle(p, 'margin-left')
      + this.getComputedStyle(p, 'margin-right');

    if (ppWidth > this.getComputedStyle(pp, 'width')) {
      pp.style.width = ppWidth + 'px';
    }
  }

  async setScrollBarHeight() {
    const mongol = this._root.querySelector(this.mongolId);

    const h = this.style.height;
    const w = this.style.width;
    const md = mongol.style.display;

    mongol.style.display = 'none';
    this.style.height = this.bodyHeight() + 'px';
    this.style.width = window.innerWidth + 30 + 'px';

    let th;
    let sh = 0;
    while (this.wHasYScrollBar()) {
      th = this.getDimensionNumber(this.style.height);
      this.style.height = (th - 1) + 'px';
      sh++;
      await afterNextRender;
    }
    this.scrollBarHeight = sh;

    this.style.height = h;
    this.style.width = w;
    mongol.style.display = md;
  }
}

customElements.define(MvBody.tag(), MvBody);
