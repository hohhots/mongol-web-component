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
import {style} from './mon-body-css.js';
import ResizeObserver from 'resize-observer-polyfill';

export class MvBody extends LitElement {
  static tag() {
    return 'mon-body';
  }

  static get properties() {
    return {
      maxheight: String,
      float: String,
      mongolWidth: Number,
    };
  }

  constructor() {
    super();

    this.mongolId = '#mongol';
    this.mongolWidth = 0;

    // browser's horizontal scroll bar height.
    this.scrollBarHeight = 0;
    this.previousScrollBar = false;

    this.resizeDelay = 20;
    this.resizeTimer;

    this.previousWindowDimensions = {};
    this.previousMongolDimension = {};
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
      <div id="mongol" style$="width: ${this.mongolWidth}px">
        <span class="mongol-text">
          <slot></slot>
        </span>
      </div>
    `;
  }

  _renderStyle() {
    return style;
  }

  async _firstRendered() {
    console.log('_firstRendered');

    this.parent = this.parentElement;
    this.mongol = this._root.querySelector(this.mongolId);

    if (!this.validMvbody()) {
      return;
    }

    window.onresize = async() => {
      console.log('resize window height - ', window.innerHeight);
      // When window zoom, scroll bar height will change
      await this.setScrollBarHeight();

      await this.resizeMongol();
    };

    this.resizeObserver = new ResizeObserver(async() => {
      console.log('resize mongol');

      await this.resizeMongol();
    });

    this.init();
  }

  async init() {
    await this.setScrollBarHeight();
    this.resizeMongol();
    this.resizeObserver.observe(this.mongol);
  }

  resizeBody() {
    console.log('resize body');

    this.parent.style.width = `${this.getComputedStyle(this, 'width')}px`;

    // emulate horizontal text html behavior.
    this.parent.parentElement.style.width = `${this.getComputedStyle(
      this.parent,
      'width',
    ) +
      this.getComputedStyle(this.parent, 'margin-left') +
      this.getComputedStyle(this.parent, 'margin-right')}px`;
  }

  resizeThis() {
    console.log('resize mv-body');

    this.style.height = `${this.getComputedStyle(this.mongol, 'width')}px`;
    this.style.width = `${this.getComputedStyle(this.mongol, 'height')}px`;

    this.resizeBody();
  }

  async resizeMongol() {
    console.log('resize mongol');

    const th = this.bodyHeight();

    await this.setMongolWidth(th);

    if (this.wHasXScrollBar()) {
      // mobile browser has no scroll bar height.
      await this.setMongolWidth(th - this.scrollBarHeight);
    }

    this.resizeThis();
  }

  setMongolWidth(width) {
    console.log('set mongol width - ', typeof width);
    this.mongolWidth = width;
  }

  parentIsBody() {
    if (this.parentElement.tagName.toUpperCase() != 'BODY') {
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

  wHasXScrollBar() {
    window.scrollTo(0, 0);
    window.scrollTo(1, 0);
    if (window.pageXOffset > 0) {
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
    console.log(`
      Inner Width: ${window.innerWidth}
      Inner Height: ${window.innerHeight}
      Outer Width: ${window.outerWidth}
      Outer Height: ${window.outerHeight},
      scrollBarheight: ${this.scrollBarHeight},
      windowScreenAvailHeight: ${window.screen.availHeight},
      windowScreenAvailWidth: ${window.screen.availWidth},
      windowScreenHeight: ${window.screen.height},
      windowScreenWidth: ${window.screen.width},
      windowScreenTop: ${window.screen.top},
      windowScreenLeft: ${window.screen.left},
      windowScreenPixelDepth: ${window.screen.pixelDepth}
    `);

    // for browser on pc
    const height = window.innerHeight;
    // for chrome in android and with big content
    // if (indow.innerHeight > window.outerHeight) {
    // if (this.isMobile()) {
    //   console.log('isMobile');
    //   height = window.outerHeight;
    //   goInFullscreen();
    // if (this.isFirefox()) {
    // height = window.innerHeight;
    // }
    //   if (this.isMobileLandscape) {
    //      console.log('landscaped');
    //     height = window.innerWidth;
    //   }
    // }

    return (
      height -
      this.getComputedStyle(this.parent, 'margin-top') -
      this.getComputedStyle(this.parent, 'margin-bottom')
    );
  }

  goInFullscreen() {
    console.log('full screen');
    const element = this.mongol;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  }

  isFirefox() {
    const ua = navigator.userAgent;
    return ua.toLowerCase().indexOf('firefox') !== -1;
  }

  isMobile() {
    const ua = navigator.userAgent;
    console.log(ua);
    // memoized values
    const isIphone =
      ua.toLowerCase().indexOf('iphone') !== -1 ||
      ua.toLowerCase().indexOf('ipod') !== -1;
    const isIpad = ua.toLowerCase().indexOf('ipad') !== -1;
    const isAndroid = ua.toLowerCase().indexOf('android') !== -1;
    return isIphone || isIpad || isAndroid;
  }

  isMobileLandscape() {
    if (this.isMobile()) {
      return indow.innerHeight > window.outerHeight;
    } else {
      return false;
    }
  }

  getUsableHeight() {
    'use strict';

    // check if this page is within a app frame
    const isInAppMode =
      ('standalone' in navigator && navigator.standalone) ||
      (window.chrome &&
        window.top.chrome.app &&
        window.top.chrome.app.isInstalled);

    const ua = navigator.userAgent;
    // memoized values
    const isIphone = ua.indexOf('iPhone') !== -1 || ua.indexOf('iPod') !== -1;
    const isIpad = ua.indexOf('iPad') !== -1;
    const isAndroid = ua.indexOf('Android') !== -1;
    const isMobile = isIphone || isIpad || isAndroid;

    // compute the missing area taken up by the header of the web browser to offset the screen height
    let usableOffset = 0;
    if (isIphone) {
      usableOffset = 20;
    } else if (isAndroid && ua.indexOf('Chrome') === -1) {
      usableOffset = 1;
    }

    return function() {
      if (!isMobile) {
        return window.innerHeight;
      }
      const isLandscape = window.innerWidth > window.innerHeight;
      let height;
      // on ios devices, this must use screen
      if (isIphone) {
        height = isLandscape ? screen.width : screen.height;
        if (!isInAppMode) {
          height -= isLandscape ? 32 : 44;
          height += 1;
        }
      } else {
        height =
          (isLandscape ? window.outerWidth : window.outerHeight) /
          (window.devicePixelRatio || 1);
      }
      return height - usableOffset;
    };
  }

  validMvbody() {
    if (!this.parentIsBody() || this.hasMultipleMvbody()) {
      this.style.display = 'none';
      return false;
    }
    return true;
  }

  setScrollBarHeight() {
    if (this.isMobile()) {
      this.scrollBarHeight = 0;
      return;
    }

    this.style.display = 'none';

    const div = document.createElement('div');
    div.style.height = '100vh';
    div.style.width = '110vw';
    document.body.appendChild(div);

    window.scrollTo(0, div.scrollHeight);
    this.scrollBarHeight =
      Math.ceil(window.pageYOffset) -
      this.getComputedStyle(this.parent, 'margin-top') -
      this.getComputedStyle(this.parent, 'margin-bottom');
    document.body.removeChild(div);
    this.style.display = '';
  }
}

customElements.define(MvBody.tag(), MvBody);
