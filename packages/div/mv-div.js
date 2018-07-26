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
import '@material/mwc-icon/mwc-icon-font.js';
import {afterNextRender} from '@material/mwc-base/utils.js';

export class Div extends LitElement {
  static tag() {
    return 'mv-div';
  }

  constructor() {
    super();
  }


  ready() {
    super.ready();

    this.mongol = this._root.querySelector('#mongol');

    this.parentStyle = window.getComputedStyle(this.parentNode, null);
    this.hostStyle = window.getComputedStyle(this, null);
    this.mongolStyle = window.getComputedStyle(this.mongol, null);
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

  _didRender() {
    if (!this.parentIsDiv() || this.nestedInMvdiv()) {
      this.style.display = 'none';
      return;
    }
    // this.style.display = '';
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
    // console.log(this.parentNode.clientWidth, this.mongol.offsetHeight);
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
      if (a.tagName.toLowerCase() == Div.tag()) {
        return true;
      }
      a = a.parentElement;
    }

    return false;
  }
}

customElements.define(Div.tag(), Div);
