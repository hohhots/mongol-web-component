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
import { LitElement, html, classString as c$ } from "@polymer/lit-element";
import { style } from "./mon-fab-css.js";
import { MDCWCRipple } from "@vmaterial/mon-ripple/mon-ripple.js";
import { afterNextRender } from "@vmaterial/mon-base/utils.js";
import "@vmaterial/mon-icon/mon-icon-font.js";

export class Fab extends LitElement {
  static get properties() {
    return {
      mini: Boolean,
      exited: Boolean,
      disabled: Boolean,
      icon: String,
      label: String
    };
  }

  constructor() {
    super();
    this.icon = "";
    this.mini = false;
    this.exited = false;
    this.label = "";
  }

  _createRoot() {
    return this.attachShadow({ mode: "open", delegatesFocus: true });
  }

  async ready() {
    super.ready();
    await afterNextRender();
    this._ripple = new MDCWCRipple(this._root.querySelector(".mdc-fab"));
  }

  _renderStyle() {
    return style;
  }

  _render({ icon, mini, exited, disabled, label }) {
    const hostClasses = c$({
      "mdc-fab--mini": mini,
      "mdc-fab--exited": exited
    });
    return html`
      ${this._renderStyle()}
      <button
        class$="mdc-fab ${hostClasses}"
        disabled?="${disabled}"
        aria-label$="${label || icon}"
      >
        ${icon
          ? html`
              <span class="material-icons mdc-fab__icon">${icon}</span>
            `
          : ""}
      </button>
    `;
  }
}

customElements.define("mon-fab", Fab);
