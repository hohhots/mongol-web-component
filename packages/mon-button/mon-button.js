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
import {
  LitElement,
  html,
  classString as c$,
} from '@polymer/lit-element';
import {style} from './mon-button-css.js';
import {MDCWCRipple} from '@vmaterial/mon-ripple/mon-ripple.js';
import {afterNextRender} from '@vmaterial/mon-base/utils.js';
import '@vmaterial/mon-icon/mon-icon-font.js';

export class Button extends LitElement {
  static get properties() {
    return {
      raised: Boolean,
      unelevated: Boolean,
      outlined: Boolean,
      dense: Boolean,
      disabled: Boolean,
      icon: String,
      label: String,
    };
  }

  constructor() {
    super();
    this.raised = false;
    this.unelevated = false;
    this.outlined = false;
    this.dense = false;
    this.disabled = false;
    this.icon = '';
    this.label = '';

    // sub elements
    this.button;
  }

  _createRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  async ready() {
    super.ready();
    await afterNextRender();
    this._ripple = new MDCWCRipple(this._root.querySelector('.mdc-button'));
  }

  _renderStyle() {
    return style;
  }

  _render({raised, unelevated, outlined, dense, disabled, icon, label}) {
    const hostClasses = c$({
      'mdc-button--raised': raised,
      'mdc-button--unelevated': unelevated,
      'mdc-button--outlined': outlined,
      'mdc-button--dense': dense,
    });
    return html`
      ${this._renderStyle()}
      <button
        class$="mdc-button mdc-ripple-upgraded ${hostClasses}"
        disabled?="${disabled}"
      >
        ${icon
    ? html`
              <span class="material-icons mdc-button__icon">${icon}</span>
            `
    : ''}
        ${label || ''}
        <slot></slot>
      </button>
    `;
  }

  _firstRendered() {
    this.button = this._root.querySelector('button');
  }

  _getComputedStyle(el, property) {
    const w = window.getComputedStyle(this, null).getPropertyValue('width');
    if (w == 'auto' || w == '0px') {
      return;
    }
    return window.getComputedStyle(el, null).getPropertyValue(property);
  }
}

customElements.define('mon-button', Button);
