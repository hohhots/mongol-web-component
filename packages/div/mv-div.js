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
    console.log('constructor()');
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
    console.log('_renderStyle()');
    return style;
  }

  _didRender() {
    if (!this.parentIsDiv()) {
      this.style.display = 'none';
      return;
    }
    this.initElementStyles();
  }

  async initElementStyles() {
    await afterNextRender();
    //const rootElement = this.querySelector('mv-div');
    //console.log(this._root.querySelector('#mongol'));

    console.log(this.mongol.offsetHeight, this.parentNode.clientHeight);
    // Auto height container
    if (!this.isFixedHeightParent()) {
      console.log('unfixed');
      
      this.mongol.style.width = 0;
      //await afterNextRender();
      const mongolSW = this.mongol.scrollWidth + 'px';
      this.mongol.style.width = mongolSW;

      this.setMongolHeightToParentWidth();

      //const mongolOSH = this.mongol.offsetHeight + 'px';
      //this.style.width = mongolOSH;
      //this.parentNode.style.width = mongolOSH;

      const mongolOSW = this.mongol.offsetWidth + 'px';
      this.style.height = mongolOSW;
      this.parentNode.style.height = mongolOSW;
    }
    //this.style.height = this.parentNode.clientHeight + 'px';
    //mongol.style.width = 0;
    //await afterNextRender();
    //mongol.style.width = mongol.scrollWidth + 'px';
    // console.log(mongol.scrollWidth, mongol.offsetWidth);
    //this.style.height = this.parentNode.clientHeight + 'px';

    //console.log(parseInt(mongol.style.width.replace('px', '')), mongol.scrollWidth);
    //console.log(mongol.scrollWidth, mongol.offsetWidth);
    //console.log(this.parentNode.scrollHeight, this.parentNode.offsetHeight);
    /**if (this.parentNode.offsetHeight < this.parentNode.scrollHeight) {
      const sbarH = this.parentNode.offsetHeight - this.parentNode.clientHeight;
      console.log(sbarH);
      const h = this.parentNode.scrollHeight + 'px';
      mongol.style.width = h;
      this.style.height = h;
    }**/

    // Store origin value
    //const hostH = hostStyle.getPropertyValue('height');


    //mongol.style.width = hostH;

    //const hostScrolW = hostStyle.getPropertyValue('scrollwidth');

    //console.log(mongol.scrollWidth, mongolStyle.getPropertyValue('width'));

    //await afterNextRender();
    //console.log('after - ', mongolStyle.getPropertyValue('height'));
    /**
    const divH = divStyle.getPropertyValue('height');

    // keep container height
    container.style.height = containerH;
    container.style.width = divH;

    div.style.height = divH;
    console.log('_didRender()', containerStyle.getPropertyValue('height'), divStyle.getPropertyValue('width'));
    **/
  }

  parentIsDiv() {
    const nodeName = this.parentNode.nodeName.toLowerCase();
    if (nodeName == 'div') {
      return true;
    }
    return false;
  }

  isFixedHeightParent() {
    const originH = this.style.height;
    this.style.height = 0;
    if (this.parentNode.clientHeight == 0) {
      this.style.height = originH;
      return false;
    }
    return true;
  }

  setMongolHeightToParentWidth() {
    console.log(this.parentNode.clientWidth, this.parentStyle.getPropertyValue('width'));
    while (this.parentNode.clientWidth < this.mongol.offsetHeight) {
      this.mongol.style.width = this.mongol.offsetWidth + 1 + 'px';
    }
  }
}

customElements.define('mv-div', Div);
