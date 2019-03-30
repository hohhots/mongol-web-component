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
import {MDCSnackbar} from '@mongol/snackbar';

import {
  ComponentElement,
  MDCWebComponentMixin,
  html,
} from '@vmaterial/mon-base/component-element.js';
import {style} from './mon-snackbar-css.js';

export class MDCWCSnackbar extends MDCWebComponentMixin(MDCSnackbar) {}

export class Snackbar extends ComponentElement {
  static get ComponentClass() {
    return MDCWCSnackbar;
  }

  static get componentSelector() {
    return '.mdc-snackbar';
  }

  static get properties() {
    return {
      message: String,
      timeout: Number,
      multiline: Boolean,
      actionText: String,
      actionOnBottom: Boolean,
      dismissesOnAction: Boolean,
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.message = '';
    this.actionText = '';
    this.timeout = -1;
    this.multiline = false;
    this.actionOnBottom = false;
    this.dismissesOnAction = true;
    this._boundActionHandler = this._actionHandler.bind(this);
  }

  _renderStyle() {
    return style;
  }

  _render() {
    const classes = {
      'mdc-snackbar--stacked': this.stacked,
      'mdc-snackbar--leading': this.leading,
    };
    return html`
      <div
        class="mdc-snackbar ${classMap(classes)}"
        @keydown="${this._handleKeydown}"
      >
        <div class="mdc-snackbar__surface">
          <div class="mdc-snackbar__label" role="status" aria-live="polite">
            ${this.labelText}
          </div>
          <div class="mdc-snackbar__actions">
            <slot name="action" @click="${this._handleActionClick}"></slot>
            <slot name="dismiss" @click="${this._handleDismissClick}"></slot>
          </div>
        </div>
      </div>
    `;
  }

  show(data) {
    this.componentReady().then((component) => {
      if (data) {
        Object.getOwnPropertyNames(data).forEach((key) => {
          this.setAttribute(key, data[key]);
          // this.[key] = data[key];
          // use key and value here
        });
        // Object.assign(this, data);
      }

      component.open();
    });
  }

  _actionHandler() {
    this.dispatchEvent(new CustomEvent('MDCSnackbar:action'));
  }

  get dismissesOnAction() {
    return this._component && this._component.dismissesOnAction;
  }

  set dismissesOnAction(value) {
    this.componentReady().then((component) => {
      component.dismissesOnAction = value;
    });
  }
}

customElements.define('mon-snackbar', Snackbar);
