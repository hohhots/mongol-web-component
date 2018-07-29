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
import {style} from './mv-div-css.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
import ResizeObserver from 'resize-observer-polyfill';

export class MvDiv extends LitElement {

  static tag() {
    return 'mv-div';
  }

  constructor() {
    super();

    this.mongol;
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
        <slot></slot>
      </div>
    `;
  }

  _renderStyle() {
    return style;
  }

  _firstRendered() {
    this.observer = new ResizeObserver(() => {
      this.requestRender();
    });
    this.observer.observe(this.parentElement);
  }

  _didRender() {
    this.mongol = this._root.querySelector('#mongol');

    if (!this.parentIsDiv() || this.nestedInMvdiv()) {
      this.style.display = 'none';
      return;
    }
    this.initElementStyles();
  }

  async initElementStyles() {
    await afterNextRender();

    if (this.isFixedHeightParent()) {
      this.setCssOfFixedHeightDiv();
      // If parent's horizontal scrollbar disapear or hidden.
      this.setCssOfFixedHeightDiv();
    } else {
      this.setMongolWidth(0);
      const mongolSW = this.mongol.scrollWidth;
      this.setMongolWidth(mongolSW);

      this.style.height = this.mongol.offsetWidth + 'px';

      if (this.parentNode.clientWidth < this.mongol.scrollHeight) {
        this.setMongolHeightToParentWidth();
      }
    }
  }

  async setCssOfFixedHeightDiv() {
    await afterNextRender();

    this.style.height = this.parentNode.clientHeight + 'px';
    this.setMongolWidth(this.clientHeight);
    this.style.width = this.mongol.scrollHeight + 'px';

    if (this.mongol.clientWidth < this.mongol.scrollWidth) {
      this.setMongolWidth(this.mongol.scrollWidth);
      this.style.width = this.mongol.offsetHeight + 'px';
      this.style.height = this.mongol.offsetWidth + 'px';
    }
  }

  parentIsDiv() {
    if (this.parentNode.nodeName.toLowerCase() == 'div') {
      return true;
    }
    return false;
  }

  isFixedHeightParent() {
    let isFixed = true;

    const eoh = this.style.height;
    const poh = this.parentNode.clientHeight;
    this.style.height = (poh + 100) + 'px';
    if (poh != this.parentNode.clientHeight) {
      isFixed = false;
    }
    this.style.height = eoh;

    return isFixed;
  }

  async setMongolHeightToParentWidth() {
    while (this.parentNode.clientWidth < this.mongol.scrollHeight) {
      this.setMongolWidth(this.mongol.offsetWidth + 1);
      this.style.height = this.mongol.offsetWidth + 'px';
    }
    await afterNextRender();
    if (this.parentNode.clientWidth < this.mongol.scrollHeight) {
      this.setMongolHeightToParentWidth();
    }
  }

  setMongolWidth(width) {
    this.mongol.style.width = width + 'px';
  }

  nestedInMvdiv() {
    let a = this.parentElement;
    while (a) {
      if (a.tagName.toLowerCase() == MvDiv.tag()) {
        return true;
      }
      a = a.parentElement;
    }

    return false;
  }
}

customElements.define(MvDiv.tag(), MvDiv);
