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

  constructor() {
    super();
    this.parentHeightState;
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
    if (!this.parentIsDiv()) {
      this.style.display = 'none';
      return;
    }
    this.style.display = '';
    this.initElementStyles();
  }

  async initElementStyles() {
    await afterNextRender();

    //console.log(this.mongol.offsetHeight, this.parentNode.clientHeight);
    // Auto height container


    if (this.isFixedHeightParent()) {console.log('fixed');
      this.style.height = this.parentNode.clientHeight + 'px';
      this.setMongolWidth(this.clientHeight);
      this.style.width = this.mongol.scrollHeight + 'px';
    } else {
      this.setMongolWidth(0);
      //await afterNextRender();
      const mongolSW = this.mongol.scrollWidth;
      this.setMongolWidth(mongolSW);

      this.setMongolHeightToParentWidth();
    }
  }

  parentIsDiv() {
    if (this.parentNode.nodeName.toLowerCase() == 'div') {
      return true;
    }
    return false;
  }

  isFixedHeightParent() {
    let isFixed = false;

    let moh = this.mongol.style.height;
    let mob = this.mongol.style.border;
    this.mongol.style.height = 0;
    this.mongol.style.border = 0;

    let eob = this.style.border;
    this.style.border = 0;

    if (this.parentNode.clientHeight == 0) {
      isFixed = false;
    } else {
      isFixed = true;
    }
    this.mongol.style.height = moh;
    this.mongol.style.border = mob;
    this.style.border = eob;

    return isFixed;
  }

  async setMongolHeightToParentWidth() {
    //console.log(this.parentNode.clientWidth, this.mongol.offsetHeight);
    while (this.parentNode.clientWidth < this.mongol.scrollHeight) {console.log(this.parentNode.clientWidth, this.mongol.offsetHeight);
      this.setMongolWidth(this.mongol.offsetWidth + 1);
      await afterNextRender();
      this.style.height = this.mongol.offsetWidth + 'px';
    }
  }

  setMongolWidth(width) {// console.log('style - ', width);
    this.mongol.style.width = width + 'px';
  }
}

customElements.define('mv-div', Div);
