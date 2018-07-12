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

export class Div extends LitElement {
  constructor() {
    super();
  }

  ready() {
    super.ready();
  }

  _createRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  _render() {
    console.log('_render()');
    return html`
      ${this._renderStyle()}
        <div class="mv-div-container">
          <div class="mv-div">
            <slot></slot>
          </div>
        </div>
    `;
  }

  _renderStyle() {
    console.log('_renderStyle()');
    return style;
  }

  _didRender() {
    this.initElementStyles();
  }

  initElementStyles() {
    const container = this.shadowRoot.querySelector('.mv-div-container');
    const div = container.querySelector('.mv-div');
    const containerStyle = window.getComputedStyle(container, null);
    const divStyle = window.getComputedStyle(div, null);

    const containerH = containerStyle.getPropertyValue('height');

    div.style.width = containerH;
    const divH = divStyle.getPropertyValue('height');

    // keep container height
    container.style.height = containerH;
    container.style.width = divH;

    div.style.height = divH;

    console.log('_didRender()', containerStyle.getPropertyValue('height'), divStyle.getPropertyValue('width'));
  }
}

customElements.define('mv-div', Div);
