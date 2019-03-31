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
import {LitElement, html} from '@polymer/lit-element';
import {style} from './mon-switch-css.js';
import {afterNextRender} from '@vmaterial/mon-base/utils.js';

export class Switch extends LitElement {
  static get properties() {
    return {
      checked: Boolean,
      disabled: Boolean,
    };
  }

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
  }

  _renderStyle() {
    return style;
  }

  _render() {
    return html`
      ${this._renderStyle()}
      <div class="mdc-switch">
        <div class="mdc-switch__track"></div>
        <div class="mdc-switch__thumb-underlay" .ripple="${ripple()}">
          <div class="mdc-switch__thumb">
            <input
              type="checkbox"
              id="basic-switch"
              class="mdc-switch__native-control"
              role="switch"
              @change="${this._changeHandler}"
            />
          </div>
        </div>
      </div>
      <slot></slot>
    `;
  }

  async ready() {
    super.ready();
    await afterNextRender;
    this._input = this._root.querySelector('input');
  }

  click() {
    this._input.click();
  }

  focus() {
    this._input.focus();
  }

  setAriaLabel(value) {
    this._input.setAttribute('aria-label', value);
  }
}

customElements.define('mon-switch', Switch);
