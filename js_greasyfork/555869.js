// ==UserScript==
// @name PopSUS
// @description PopSUS é um script criado para facilitar a cura de personagens doentes no Popmundo e auxiliar na coleta de sangue para os caçadores de zumbi.
// @version 1.0.0
// @author Drinkwater
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/*
// @grant none
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/555869/PopSUS.user.js
// @updateURL https://update.greasyfork.org/scripts/555869/PopSUS.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/goober/dist/goober.modern.js":
/*!***************************************************!*\
  !*** ./node_modules/goober/dist/goober.modern.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   css: () => (/* binding */ u),
/* harmony export */   extractCss: () => (/* binding */ r),
/* harmony export */   glob: () => (/* binding */ b),
/* harmony export */   keyframes: () => (/* binding */ h),
/* harmony export */   setup: () => (/* binding */ m),
/* harmony export */   styled: () => (/* binding */ w)
/* harmony export */ });
let e={data:""},t=t=>{if("object"==typeof window){let e=(t?t.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return e.nonce=window.__nonce__,e.parentNode||(t||document.head).appendChild(e),e.firstChild}return t||e},r=e=>{let r=t(e),l=r.data;return r.data="",l},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,a=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,o=(e,t)=>{let r="",l="",a="";for(let n in e){let c=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+c+";":l+="f"==n[1]?o(c,n):n+"{"+o(c,"k"==n[1]?"":t)+"}":"object"==typeof c?l+=o(c,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=c&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=o.p?o.p(n,c):n+":"+c+";")}return r+(t&&a?t+"{"+a+"}":a)+l},c={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e},i=(e,t,r,i,p)=>{let u=s(e),d=c[u]||(c[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!c[d]){let t=u!==e?e:(e=>{let t,r,o=[{}];for(;t=l.exec(e.replace(a,""));)t[4]?o.shift():t[3]?(r=t[3].replace(n," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(n," ").trim();return o[0]})(e);c[d]=o(p?{["@keyframes "+d]:t}:t,r?"":"."+d)}let f=r&&c.g?c.g:null;return r&&(c.g=c[d]),((e,t,r,l)=>{l?t.data=t.data.replace(l,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(c[d],t,i,f),d},p=(e,t,r)=>e.reduce((e,l,a)=>{let n=t[a];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==n?"":n)},"");function u(e){let r=this||{},l=e.call?e(r.p):e;return i(l.unshift?l.raw?p(l,[].slice.call(arguments,1),r.p):l.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):l,t(r.target),r.g,r.o,r.k)}let d,f,g,b=u.bind({g:1}),h=u.bind({k:1});function m(e,t,r,l){o.p=t,d=e,f=r,g=l}function w(e,t){let r=this||{};return function(){let l=arguments;function a(n,o){let c=Object.assign({},n),s=c.className||a.className;r.p=Object.assign({theme:f&&f()},c),r.o=/ *go\d+/.test(s),c.className=u.apply(r,l)+(s?" "+s:""),t&&(c.ref=o);let i=e;return e[0]&&(i=c.as||e,delete c.as),g&&i[0]&&g(c),d(i,c)}return t?t(a):a}}


/***/ }),

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js":
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
/***/ (function(module) {

/*!
* sweetalert2 v11.26.3
* Released under the MIT License.
*/
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  function _assertClassBrand(e, t, n) {
    if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
    throw new TypeError("Private element is not present on this object");
  }
  function _checkPrivateRedeclaration(e, t) {
    if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldGet2(s, a) {
    return s.get(_assertClassBrand(s, a));
  }
  function _classPrivateFieldInitSpec(e, t, a) {
    _checkPrivateRedeclaration(e, t), t.set(e, a);
  }
  function _classPrivateFieldSet2(s, a, r) {
    return s.set(_assertClassBrand(s, a), r), r;
  }

  const RESTORE_FOCUS_TIMEOUT = 100;

  /** @type {GlobalState} */
  const globalState = {};
  const focusPreviousActiveElement = () => {
    if (globalState.previousActiveElement instanceof HTMLElement) {
      globalState.previousActiveElement.focus();
      globalState.previousActiveElement = null;
    } else if (document.body) {
      document.body.focus();
    }
  };

  /**
   * Restore previous active (focused) element
   *
   * @param {boolean} returnFocus
   * @returns {Promise<void>}
   */
  const restoreActiveElement = returnFocus => {
    return new Promise(resolve => {
      if (!returnFocus) {
        return resolve();
      }
      const x = window.scrollX;
      const y = window.scrollY;
      globalState.restoreFocusTimeout = setTimeout(() => {
        focusPreviousActiveElement();
        resolve();
      }, RESTORE_FOCUS_TIMEOUT); // issues/900

      window.scrollTo(x, y);
    });
  };

  const swalPrefix = 'swal2-';

  /**
   * @typedef {Record<SwalClass, string>} SwalClasses
   */

  /**
   * @typedef {'success' | 'warning' | 'info' | 'question' | 'error'} SwalIcon
   * @typedef {Record<SwalIcon, string>} SwalIcons
   */

  /** @type {SwalClass[]} */
  const classNames = ['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error', 'draggable', 'dragging'];
  const swalClasses = classNames.reduce((acc, className) => {
    acc[className] = swalPrefix + className;
    return acc;
  }, /** @type {SwalClasses} */{});

  /** @type {SwalIcon[]} */
  const icons = ['success', 'warning', 'info', 'question', 'error'];
  const iconTypes = icons.reduce((acc, icon) => {
    acc[icon] = swalPrefix + icon;
    return acc;
  }, /** @type {SwalIcons} */{});

  const consolePrefix = 'SweetAlert2:';

  /**
   * Capitalize the first letter of a string
   *
   * @param {string} str
   * @returns {string}
   */
  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

  /**
   * Standardize console warnings
   *
   * @param {string | string[]} message
   */
  const warn = message => {
    console.warn(`${consolePrefix} ${typeof message === 'object' ? message.join(' ') : message}`);
  };

  /**
   * Standardize console errors
   *
   * @param {string} message
   */
  const error = message => {
    console.error(`${consolePrefix} ${message}`);
  };

  /**
   * Private global state for `warnOnce`
   *
   * @type {string[]}
   * @private
   */
  const previousWarnOnceMessages = [];

  /**
   * Show a console warning, but only if it hasn't already been shown
   *
   * @param {string} message
   */
  const warnOnce = message => {
    if (!previousWarnOnceMessages.includes(message)) {
      previousWarnOnceMessages.push(message);
      warn(message);
    }
  };

  /**
   * Show a one-time console warning about deprecated params/methods
   *
   * @param {string} deprecatedParam
   * @param {string?} useInstead
   */
  const warnAboutDeprecation = (deprecatedParam, useInstead = null) => {
    warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release.${useInstead ? ` Use "${useInstead}" instead.` : ''}`);
  };

  /**
   * If `arg` is a function, call it (with no arguments or context) and return the result.
   * Otherwise, just pass the value through
   *
   * @param {(() => *) | *} arg
   * @returns {*}
   */
  const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;

  /**
   * @param {*} arg
   * @returns {boolean}
   */
  const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';

  /**
   * @param {*} arg
   * @returns {Promise<*>}
   */
  const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);

  /**
   * @param {*} arg
   * @returns {boolean}
   */
  const isPromise = arg => arg && Promise.resolve(arg) === arg;

  /**
   * Gets the popup container which contains the backdrop and the popup itself.
   *
   * @returns {HTMLElement | null}
   */
  const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);

  /**
   * @param {string} selectorString
   * @returns {HTMLElement | null}
   */
  const elementBySelector = selectorString => {
    const container = getContainer();
    return container ? container.querySelector(selectorString) : null;
  };

  /**
   * @param {string} className
   * @returns {HTMLElement | null}
   */
  const elementByClass = className => {
    return elementBySelector(`.${className}`);
  };

  /**
   * @returns {HTMLElement | null}
   */
  const getPopup = () => elementByClass(swalClasses.popup);

  /**
   * @returns {HTMLElement | null}
   */
  const getIcon = () => elementByClass(swalClasses.icon);

  /**
   * @returns {HTMLElement | null}
   */
  const getIconContent = () => elementByClass(swalClasses['icon-content']);

  /**
   * @returns {HTMLElement | null}
   */
  const getTitle = () => elementByClass(swalClasses.title);

  /**
   * @returns {HTMLElement | null}
   */
  const getHtmlContainer = () => elementByClass(swalClasses['html-container']);

  /**
   * @returns {HTMLElement | null}
   */
  const getImage = () => elementByClass(swalClasses.image);

  /**
   * @returns {HTMLElement | null}
   */
  const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);

  /**
   * @returns {HTMLElement | null}
   */
  const getValidationMessage = () => elementByClass(swalClasses['validation-message']);

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getConfirmButton = () => (/** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`));

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getCancelButton = () => (/** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`));

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getDenyButton = () => (/** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`));

  /**
   * @returns {HTMLElement | null}
   */
  const getInputLabel = () => elementByClass(swalClasses['input-label']);

  /**
   * @returns {HTMLElement | null}
   */
  const getLoader = () => elementBySelector(`.${swalClasses.loader}`);

  /**
   * @returns {HTMLElement | null}
   */
  const getActions = () => elementByClass(swalClasses.actions);

  /**
   * @returns {HTMLElement | null}
   */
  const getFooter = () => elementByClass(swalClasses.footer);

  /**
   * @returns {HTMLElement | null}
   */
  const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);

  /**
   * @returns {HTMLElement | null}
   */
  const getCloseButton = () => elementByClass(swalClasses.close);

  // https://github.com/jkup/focusable/blob/master/index.js
  const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
  /**
   * @returns {HTMLElement[]}
   */
  const getFocusableElements = () => {
    const popup = getPopup();
    if (!popup) {
      return [];
    }
    /** @type {NodeListOf<HTMLElement>} */
    const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
    const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex)
    // sort according to tabindex
    .sort((a, b) => {
      const tabindexA = parseInt(a.getAttribute('tabindex') || '0');
      const tabindexB = parseInt(b.getAttribute('tabindex') || '0');
      if (tabindexA > tabindexB) {
        return 1;
      } else if (tabindexA < tabindexB) {
        return -1;
      }
      return 0;
    });

    /** @type {NodeListOf<HTMLElement>} */
    const otherFocusableElements = popup.querySelectorAll(focusable);
    const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(el => el.getAttribute('tabindex') !== '-1');
    return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter(el => isVisible$1(el));
  };

  /**
   * @returns {boolean}
   */
  const isModal = () => {
    return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
  };

  /**
   * @returns {boolean}
   */
  const isToast = () => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    return hasClass(popup, swalClasses.toast);
  };

  /**
   * @returns {boolean}
   */
  const isLoading = () => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    return popup.hasAttribute('data-loading');
  };

  /**
   * Securely set innerHTML of an element
   * https://github.com/sweetalert2/sweetalert2/issues/1926
   *
   * @param {HTMLElement} elem
   * @param {string} html
   */
  const setInnerHtml = (elem, html) => {
    elem.textContent = '';
    if (html) {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(html, `text/html`);
      const head = parsed.querySelector('head');
      if (head) {
        Array.from(head.childNodes).forEach(child => {
          elem.appendChild(child);
        });
      }
      const body = parsed.querySelector('body');
      if (body) {
        Array.from(body.childNodes).forEach(child => {
          if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
            elem.appendChild(child.cloneNode(true)); // https://github.com/sweetalert2/sweetalert2/issues/2507
          } else {
            elem.appendChild(child);
          }
        });
      }
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {boolean}
   */
  const hasClass = (elem, className) => {
    if (!className) {
      return false;
    }
    const classList = className.split(/\s+/);
    for (let i = 0; i < classList.length; i++) {
      if (!elem.classList.contains(classList[i])) {
        return false;
      }
    }
    return true;
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   */
  const removeCustomClasses = (elem, params) => {
    Array.from(elem.classList).forEach(className => {
      if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
        elem.classList.remove(className);
      }
    });
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   * @param {string} className
   */
  const applyCustomClass = (elem, params, className) => {
    removeCustomClasses(elem, params);
    if (!params.customClass) {
      return;
    }
    const customClass = params.customClass[(/** @type {keyof SweetAlertCustomClass} */className)];
    if (!customClass) {
      return;
    }
    if (typeof customClass !== 'string' && !customClass.forEach) {
      warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof customClass}"`);
      return;
    }
    addClass(elem, customClass);
  };

  /**
   * @param {HTMLElement} popup
   * @param {import('./renderers/renderInput').InputClass | SweetAlertInput} inputClass
   * @returns {HTMLInputElement | null}
   */
  const getInput$1 = (popup, inputClass) => {
    if (!inputClass) {
      return null;
    }
    switch (inputClass) {
      case 'select':
      case 'textarea':
      case 'file':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
      case 'checkbox':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
      case 'radio':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
      case 'range':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
      default:
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
   */
  const focusInput = input => {
    input.focus();

    // place cursor at end of text in text input
    if (input.type !== 'file') {
      // http://stackoverflow.com/a/2345915
      const val = input.value;
      input.value = '';
      input.value = val;
    }
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   * @param {boolean} condition
   */
  const toggleClass = (target, classList, condition) => {
    if (!target || !classList) {
      return;
    }
    if (typeof classList === 'string') {
      classList = classList.split(/\s+/).filter(Boolean);
    }
    classList.forEach(className => {
      if (Array.isArray(target)) {
        target.forEach(elem => {
          if (condition) {
            elem.classList.add(className);
          } else {
            elem.classList.remove(className);
          }
        });
      } else {
        if (condition) {
          target.classList.add(className);
        } else {
          target.classList.remove(className);
        }
      }
    });
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   */
  const addClass = (target, classList) => {
    toggleClass(target, classList, true);
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   */
  const removeClass = (target, classList) => {
    toggleClass(target, classList, false);
  };

  /**
   * Get direct child of an element by class name
   *
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {HTMLElement | undefined}
   */
  const getDirectChildByClass = (elem, className) => {
    const children = Array.from(elem.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child instanceof HTMLElement && hasClass(child, className)) {
        return child;
      }
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} property
   * @param {string | number | null | undefined} value
   */
  const applyNumericalStyle = (elem, property, value) => {
    if (value === `${parseInt(`${value}`)}`) {
      value = parseInt(value);
    }
    if (value || parseInt(`${value}`) === 0) {
      elem.style.setProperty(property, typeof value === 'number' ? `${value}px` : value);
    } else {
      elem.style.removeProperty(property);
    }
  };

  /**
   * @param {HTMLElement | null} elem
   * @param {string} display
   */
  const show = (elem, display = 'flex') => {
    if (!elem) {
      return;
    }
    elem.style.display = display;
  };

  /**
   * @param {HTMLElement | null} elem
   */
  const hide = elem => {
    if (!elem) {
      return;
    }
    elem.style.display = 'none';
  };

  /**
   * @param {HTMLElement | null} elem
   * @param {string} display
   */
  const showWhenInnerHtmlPresent = (elem, display = 'block') => {
    if (!elem) {
      return;
    }
    new MutationObserver(() => {
      toggle(elem, elem.innerHTML, display);
    }).observe(elem, {
      childList: true,
      subtree: true
    });
  };

  /**
   * @param {HTMLElement} parent
   * @param {string} selector
   * @param {string} property
   * @param {string} value
   */
  const setStyle = (parent, selector, property, value) => {
    /** @type {HTMLElement | null} */
    const el = parent.querySelector(selector);
    if (el) {
      el.style.setProperty(property, value);
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {boolean | string | null | undefined} condition
   * @param {string} display
   */
  const toggle = (elem, condition, display = 'flex') => {
    if (condition) {
      show(elem, display);
    } else {
      hide(elem);
    }
  };

  /**
   * borrowed from jquery $(elem).is(':visible') implementation
   *
   * @param {HTMLElement | null} elem
   * @returns {boolean}
   */
  const isVisible$1 = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));

  /**
   * @returns {boolean}
   */
  const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());

  /**
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);

  /**
   * @param {HTMLElement} element
   * @param {HTMLElement} stopElement
   * @returns {boolean}
   */
  const selfOrParentIsScrollable = (element, stopElement) => {
    let parent = element;
    while (parent && parent !== stopElement) {
      if (isScrollable(parent)) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  };

  /**
   * borrowed from https://stackoverflow.com/a/46352119
   *
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const hasCssAnimation = elem => {
    const style = window.getComputedStyle(elem);
    const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    return animDuration > 0 || transDuration > 0;
  };

  /**
   * @param {number} timer
   * @param {boolean} reset
   */
  const animateTimerProgressBar = (timer, reset = false) => {
    const timerProgressBar = getTimerProgressBar();
    if (!timerProgressBar) {
      return;
    }
    if (isVisible$1(timerProgressBar)) {
      if (reset) {
        timerProgressBar.style.transition = 'none';
        timerProgressBar.style.width = '100%';
      }
      setTimeout(() => {
        timerProgressBar.style.transition = `width ${timer / 1000}s linear`;
        timerProgressBar.style.width = '0%';
      }, 10);
    }
  };
  const stopTimerProgressBar = () => {
    const timerProgressBar = getTimerProgressBar();
    if (!timerProgressBar) {
      return;
    }
    const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = '100%';
    const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
    timerProgressBar.style.width = `${timerProgressBarPercent}%`;
  };

  /**
   * Detect Node env
   *
   * @returns {boolean}
   */
  const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

  const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses['html-container']}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses['progress-steps']}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses['html-container']}" id="${swalClasses['html-container']}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses['validation-message']}" id="${swalClasses['validation-message']}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses['timer-progress-bar-container']}">
     <div class="${swalClasses['timer-progress-bar']}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, '');

  /**
   * @returns {boolean}
   */
  const resetOldContainer = () => {
    const oldContainer = getContainer();
    if (!oldContainer) {
      return false;
    }
    oldContainer.remove();
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    return true;
  };
  const resetValidationMessage$1 = () => {
    globalState.currentInstance.resetValidationMessage();
  };
  const addInputChangeListeners = () => {
    const popup = getPopup();
    const input = getDirectChildByClass(popup, swalClasses.input);
    const file = getDirectChildByClass(popup, swalClasses.file);
    /** @type {HTMLInputElement} */
    const range = popup.querySelector(`.${swalClasses.range} input`);
    /** @type {HTMLOutputElement} */
    const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
    const select = getDirectChildByClass(popup, swalClasses.select);
    /** @type {HTMLInputElement} */
    const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
    const textarea = getDirectChildByClass(popup, swalClasses.textarea);
    input.oninput = resetValidationMessage$1;
    file.onchange = resetValidationMessage$1;
    select.onchange = resetValidationMessage$1;
    checkbox.onchange = resetValidationMessage$1;
    textarea.oninput = resetValidationMessage$1;
    range.oninput = () => {
      resetValidationMessage$1();
      rangeOutput.value = range.value;
    };
    range.onchange = () => {
      resetValidationMessage$1();
      rangeOutput.value = range.value;
    };
  };

  /**
   * @param {string | HTMLElement} target
   * @returns {HTMLElement}
   */
  const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

  /**
   * @param {SweetAlertOptions} params
   */
  const setupAccessibility = params => {
    const popup = getPopup();
    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
    if (!params.toast) {
      popup.setAttribute('aria-modal', 'true');
    }
  };

  /**
   * @param {HTMLElement} targetElement
   */
  const setupRTL = targetElement => {
    if (window.getComputedStyle(targetElement).direction === 'rtl') {
      addClass(getContainer(), swalClasses.rtl);
    }
  };

  /**
   * Add modal + backdrop to DOM
   *
   * @param {SweetAlertOptions} params
   */
  const init = params => {
    // Clean up the old popup container if it exists
    const oldContainerExisted = resetOldContainer();
    if (isNodeEnv()) {
      error('SweetAlert2 requires document to initialize');
      return;
    }
    const container = document.createElement('div');
    container.className = swalClasses.container;
    if (oldContainerExisted) {
      addClass(container, swalClasses['no-transition']);
    }
    setInnerHtml(container, sweetHTML);
    container.dataset['swal2Theme'] = params.theme;
    const targetElement = getTarget(params.target);
    targetElement.appendChild(container);
    if (params.topLayer) {
      container.setAttribute('popover', '');
      container.showPopover();
    }
    setupAccessibility(params);
    setupRTL(targetElement);
    addInputChangeListeners();
  };

  /**
   * @param {HTMLElement | object | string} param
   * @param {HTMLElement} target
   */
  const parseHtmlToContainer = (param, target) => {
    // DOM element
    if (param instanceof HTMLElement) {
      target.appendChild(param);
    }

    // Object
    else if (typeof param === 'object') {
      handleObject(param, target);
    }

    // Plain string
    else if (param) {
      setInnerHtml(target, param);
    }
  };

  /**
   * @param {object} param
   * @param {HTMLElement} target
   */
  const handleObject = (param, target) => {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param);
    }

    // For other objects use their string representation
    else {
      setInnerHtml(target, param.toString());
    }
  };

  /**
   * @param {HTMLElement} target
   * @param {object} elem
   */
  const handleJqueryElem = (target, elem) => {
    target.textContent = '';
    if (0 in elem) {
      for (let i = 0; i in elem; i++) {
        target.appendChild(elem[i].cloneNode(true));
      }
    } else {
      target.appendChild(elem.cloneNode(true));
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderActions = (instance, params) => {
    const actions = getActions();
    const loader = getLoader();
    if (!actions || !loader) {
      return;
    }

    // Actions (buttons) wrapper
    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
      hide(actions);
    } else {
      show(actions);
    }

    // Custom class
    applyCustomClass(actions, params, 'actions');

    // Render all the buttons
    renderButtons(actions, loader, params);

    // Loader
    setInnerHtml(loader, params.loaderHtml || '');
    applyCustomClass(loader, params, 'loader');
  };

  /**
   * @param {HTMLElement} actions
   * @param {HTMLElement} loader
   * @param {SweetAlertOptions} params
   */
  function renderButtons(actions, loader, params) {
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();
    if (!confirmButton || !denyButton || !cancelButton) {
      return;
    }

    // Render buttons
    renderButton(confirmButton, 'confirm', params);
    renderButton(denyButton, 'deny', params);
    renderButton(cancelButton, 'cancel', params);
    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
    if (params.reverseButtons) {
      if (params.toast) {
        actions.insertBefore(cancelButton, confirmButton);
        actions.insertBefore(denyButton, confirmButton);
      } else {
        actions.insertBefore(cancelButton, loader);
        actions.insertBefore(denyButton, loader);
        actions.insertBefore(confirmButton, loader);
      }
    }
  }

  /**
   * @param {HTMLElement} confirmButton
   * @param {HTMLElement} denyButton
   * @param {HTMLElement} cancelButton
   * @param {SweetAlertOptions} params
   */
  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
    if (!params.buttonsStyling) {
      removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
      return;
    }
    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);

    // Apply custom background colors to action buttons
    if (params.confirmButtonColor) {
      confirmButton.style.setProperty('--swal2-confirm-button-background-color', params.confirmButtonColor);
    }
    if (params.denyButtonColor) {
      denyButton.style.setProperty('--swal2-deny-button-background-color', params.denyButtonColor);
    }
    if (params.cancelButtonColor) {
      cancelButton.style.setProperty('--swal2-cancel-button-background-color', params.cancelButtonColor);
    }

    // Apply the outline color to action buttons
    applyOutlineColor(confirmButton);
    applyOutlineColor(denyButton);
    applyOutlineColor(cancelButton);
  }

  /**
   * @param {HTMLElement} button
   */
  function applyOutlineColor(button) {
    const buttonStyle = window.getComputedStyle(button);
    if (buttonStyle.getPropertyValue('--swal2-action-button-focus-box-shadow')) {
      // If the button already has a custom outline color, no need to change it
      return;
    }
    const outlineColor = buttonStyle.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, 'rgba($1, $2, $3, 0.5)');
    button.style.setProperty('--swal2-action-button-focus-box-shadow', buttonStyle.getPropertyValue('--swal2-outline').replace(/ rgba\(.*/, ` ${outlineColor}`));
  }

  /**
   * @param {HTMLElement} button
   * @param {'confirm' | 'deny' | 'cancel'} buttonType
   * @param {SweetAlertOptions} params
   */
  function renderButton(button, buttonType, params) {
    const buttonName = /** @type {'Confirm' | 'Deny' | 'Cancel'} */capitalizeFirstLetter(buttonType);
    toggle(button, params[`show${buttonName}Button`], 'inline-block');
    setInnerHtml(button, params[`${buttonType}ButtonText`] || ''); // Set caption text
    button.setAttribute('aria-label', params[`${buttonType}ButtonAriaLabel`] || ''); // ARIA label

    // Add buttons custom classes
    button.className = swalClasses[buttonType];
    applyCustomClass(button, params, `${buttonType}Button`);
  }

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderCloseButton = (instance, params) => {
    const closeButton = getCloseButton();
    if (!closeButton) {
      return;
    }
    setInnerHtml(closeButton, params.closeButtonHtml || '');

    // Custom class
    applyCustomClass(closeButton, params, 'closeButton');
    toggle(closeButton, params.showCloseButton);
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel || '');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderContainer = (instance, params) => {
    const container = getContainer();
    if (!container) {
      return;
    }
    handleBackdropParam(container, params.backdrop);
    handlePositionParam(container, params.position);
    handleGrowParam(container, params.grow);

    // Custom class
    applyCustomClass(container, params, 'container');
  };

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['backdrop']} backdrop
   */
  function handleBackdropParam(container, backdrop) {
    if (typeof backdrop === 'string') {
      container.style.background = backdrop;
    } else if (!backdrop) {
      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['position']} position
   */
  function handlePositionParam(container, position) {
    if (!position) {
      return;
    }
    if (position in swalClasses) {
      addClass(container, swalClasses[position]);
    } else {
      warn('The "position" parameter is not valid, defaulting to "center"');
      addClass(container, swalClasses.center);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['grow']} grow
   */
  function handleGrowParam(container, grow) {
    if (!grow) {
      return;
    }
    addClass(container, swalClasses[`grow-${grow}`]);
  }

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateProps = {
    innerParams: new WeakMap(),
    domCache: new WeakMap()
  };

  /// <reference path="../../../../sweetalert2.d.ts"/>


  /** @type {InputClass[]} */
  const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderInput = (instance, params) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const innerParams = privateProps.innerParams.get(instance);
    const rerender = !innerParams || params.input !== innerParams.input;
    inputClasses.forEach(inputClass => {
      const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
      if (!inputContainer) {
        return;
      }

      // set attributes
      setAttributes(inputClass, params.inputAttributes);

      // set class
      inputContainer.className = swalClasses[inputClass];
      if (rerender) {
        hide(inputContainer);
      }
    });
    if (params.input) {
      if (rerender) {
        showInput(params);
      }
      // set custom class
      setCustomClass(params);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const showInput = params => {
    if (!params.input) {
      return;
    }
    if (!renderInputType[params.input]) {
      error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(' | ')}, got "${params.input}"`);
      return;
    }
    const inputContainer = getInputContainer(params.input);
    if (!inputContainer) {
      return;
    }
    const input = renderInputType[params.input](inputContainer, params);
    show(inputContainer);

    // input autofocus
    if (params.inputAutoFocus) {
      setTimeout(() => {
        focusInput(input);
      });
    }
  };

  /**
   * @param {HTMLInputElement} input
   */
  const removeAttributes = input => {
    for (let i = 0; i < input.attributes.length; i++) {
      const attrName = input.attributes[i].name;
      if (!['id', 'type', 'value', 'style'].includes(attrName)) {
        input.removeAttribute(attrName);
      }
    }
  };

  /**
   * @param {InputClass} inputClass
   * @param {SweetAlertOptions['inputAttributes']} inputAttributes
   */
  const setAttributes = (inputClass, inputAttributes) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const input = getInput$1(popup, inputClass);
    if (!input) {
      return;
    }
    removeAttributes(input);
    for (const attr in inputAttributes) {
      input.setAttribute(attr, inputAttributes[attr]);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const setCustomClass = params => {
    if (!params.input) {
      return;
    }
    const inputContainer = getInputContainer(params.input);
    if (inputContainer) {
      applyCustomClass(inputContainer, params, 'input');
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions} params
   */
  const setInputPlaceholder = (input, params) => {
    if (!input.placeholder && params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder;
    }
  };

  /**
   * @param {Input} input
   * @param {Input} prependTo
   * @param {SweetAlertOptions} params
   */
  const setInputLabel = (input, prependTo, params) => {
    if (params.inputLabel) {
      const label = document.createElement('label');
      const labelClass = swalClasses['input-label'];
      label.setAttribute('for', input.id);
      label.className = labelClass;
      if (typeof params.customClass === 'object') {
        addClass(label, params.customClass.inputLabel);
      }
      label.innerText = params.inputLabel;
      prependTo.insertAdjacentElement('beforebegin', label);
    }
  };

  /**
   * @param {SweetAlertInput} inputType
   * @returns {HTMLElement | undefined}
   */
  const getInputContainer = inputType => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    return getDirectChildByClass(popup, swalClasses[(/** @type {SwalClass} */inputType)] || swalClasses.input);
  };

  /**
   * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions['inputValue']} inputValue
   */
  const checkAndSetInputValue = (input, inputValue) => {
    if (['string', 'number'].includes(typeof inputValue)) {
      input.value = `${inputValue}`;
    } else if (!isPromise(inputValue)) {
      warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
    }
  };

  /** @type {Record<SweetAlertInput, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
  const renderInputType = {};

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType['datetime-local'] = renderInputType.time = renderInputType.week = renderInputType.month = /** @type {(input: Input | HTMLElement, params: SweetAlertOptions) => Input} */
  (input, params) => {
    checkAndSetInputValue(input, params.inputValue);
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    input.type = params.input;
    return input;
  };

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.file = (input, params) => {
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    return input;
  };

  /**
   * @param {HTMLInputElement} range
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.range = (range, params) => {
    const rangeInput = range.querySelector('input');
    const rangeOutput = range.querySelector('output');
    checkAndSetInputValue(rangeInput, params.inputValue);
    rangeInput.type = params.input;
    checkAndSetInputValue(rangeOutput, params.inputValue);
    setInputLabel(rangeInput, range, params);
    return range;
  };

  /**
   * @param {HTMLSelectElement} select
   * @param {SweetAlertOptions} params
   * @returns {HTMLSelectElement}
   */
  renderInputType.select = (select, params) => {
    select.textContent = '';
    if (params.inputPlaceholder) {
      const placeholder = document.createElement('option');
      setInnerHtml(placeholder, params.inputPlaceholder);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
    }
    setInputLabel(select, select, params);
    return select;
  };

  /**
   * @param {HTMLInputElement} radio
   * @returns {HTMLInputElement}
   */
  renderInputType.radio = radio => {
    radio.textContent = '';
    return radio;
  };

  /**
   * @param {HTMLLabelElement} checkboxContainer
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.checkbox = (checkboxContainer, params) => {
    const checkbox = getInput$1(getPopup(), 'checkbox');
    checkbox.value = '1';
    checkbox.checked = Boolean(params.inputValue);
    const label = checkboxContainer.querySelector('span');
    setInnerHtml(label, params.inputPlaceholder || params.inputLabel);
    return checkbox;
  };

  /**
   * @param {HTMLTextAreaElement} textarea
   * @param {SweetAlertOptions} params
   * @returns {HTMLTextAreaElement}
   */
  renderInputType.textarea = (textarea, params) => {
    checkAndSetInputValue(textarea, params.inputValue);
    setInputPlaceholder(textarea, params);
    setInputLabel(textarea, textarea, params);

    /**
     * @param {HTMLElement} el
     * @returns {number}
     */
    const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

    // https://github.com/sweetalert2/sweetalert2/issues/2291
    setTimeout(() => {
      // https://github.com/sweetalert2/sweetalert2/issues/1699
      if ('MutationObserver' in window) {
        const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
        const textareaResizeHandler = () => {
          // check if texarea is still in document (i.e. popup wasn't closed in the meantime)
          if (!document.body.contains(textarea)) {
            return;
          }
          const textareaWidth = textarea.offsetWidth + getMargin(textarea);
          if (textareaWidth > initialPopupWidth) {
            getPopup().style.width = `${textareaWidth}px`;
          } else {
            applyNumericalStyle(getPopup(), 'width', params.width);
          }
        };
        new MutationObserver(textareaResizeHandler).observe(textarea, {
          attributes: true,
          attributeFilter: ['style']
        });
      }
    });
    return textarea;
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderContent = (instance, params) => {
    const htmlContainer = getHtmlContainer();
    if (!htmlContainer) {
      return;
    }
    showWhenInnerHtmlPresent(htmlContainer);
    applyCustomClass(htmlContainer, params, 'htmlContainer');

    // Content as HTML
    if (params.html) {
      parseHtmlToContainer(params.html, htmlContainer);
      show(htmlContainer, 'block');
    }

    // Content as plain text
    else if (params.text) {
      htmlContainer.textContent = params.text;
      show(htmlContainer, 'block');
    }

    // No content
    else {
      hide(htmlContainer);
    }
    renderInput(instance, params);
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderFooter = (instance, params) => {
    const footer = getFooter();
    if (!footer) {
      return;
    }
    showWhenInnerHtmlPresent(footer);
    toggle(footer, Boolean(params.footer), 'block');
    if (params.footer) {
      parseHtmlToContainer(params.footer, footer);
    }

    // Custom class
    applyCustomClass(footer, params, 'footer');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderIcon = (instance, params) => {
    const innerParams = privateProps.innerParams.get(instance);
    const icon = getIcon();
    if (!icon) {
      return;
    }

    // if the given icon already rendered, apply the styling without re-rendering the icon
    if (innerParams && params.icon === innerParams.icon) {
      // Custom or default content
      setContent(icon, params);
      applyStyles(icon, params);
      return;
    }
    if (!params.icon && !params.iconHtml) {
      hide(icon);
      return;
    }
    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
      error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
      hide(icon);
      return;
    }
    show(icon);

    // Custom or default content
    setContent(icon, params);
    applyStyles(icon, params);

    // Animate icon
    addClass(icon, params.showClass && params.showClass.icon);

    // Re-adjust the success icon on system theme change
    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQueryList.addEventListener('change', adjustSuccessIconBackgroundColor);
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const applyStyles = (icon, params) => {
    for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
      if (params.icon !== iconType) {
        removeClass(icon, iconClassName);
      }
    }
    addClass(icon, params.icon && iconTypes[params.icon]);

    // Icon color
    setColor(icon, params);

    // Success icon background color
    adjustSuccessIconBackgroundColor();

    // Custom class
    applyCustomClass(icon, params, 'icon');
  };

  // Adjust success icon background color to match the popup background color
  const adjustSuccessIconBackgroundColor = () => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    /** @type {NodeListOf<HTMLElement>} */
    const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
    for (let i = 0; i < successIconParts.length; i++) {
      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    }
  };

  /**
   *
   * @param {SweetAlertOptions} params
   * @returns {string}
   */
  const successIconHtml = params => `
  ${params.animation ? '<div class="swal2-success-circular-line-left"></div>' : ''}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${params.animation ? '<div class="swal2-success-fix"></div>' : ''}
  ${params.animation ? '<div class="swal2-success-circular-line-right"></div>' : ''}
`;
  const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setContent = (icon, params) => {
    if (!params.icon && !params.iconHtml) {
      return;
    }
    let oldContent = icon.innerHTML;
    let newContent = '';
    if (params.iconHtml) {
      newContent = iconContent(params.iconHtml);
    } else if (params.icon === 'success') {
      newContent = successIconHtml(params);
      oldContent = oldContent.replace(/ style=".*?"/g, ''); // undo adjustSuccessIconBackgroundColor()
    } else if (params.icon === 'error') {
      newContent = errorIconHtml;
    } else if (params.icon) {
      const defaultIconHtml = {
        question: '?',
        warning: '!',
        info: 'i'
      };
      newContent = iconContent(defaultIconHtml[params.icon]);
    }
    if (oldContent.trim() !== newContent.trim()) {
      setInnerHtml(icon, newContent);
    }
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setColor = (icon, params) => {
    if (!params.iconColor) {
      return;
    }
    icon.style.color = params.iconColor;
    icon.style.borderColor = params.iconColor;
    for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
      setStyle(icon, sel, 'background-color', params.iconColor);
    }
    setStyle(icon, '.swal2-success-ring', 'border-color', params.iconColor);
  };

  /**
   * @param {string} content
   * @returns {string}
   */
  const iconContent = content => `<div class="${swalClasses['icon-content']}">${content}</div>`;

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderImage = (instance, params) => {
    const image = getImage();
    if (!image) {
      return;
    }
    if (!params.imageUrl) {
      hide(image);
      return;
    }
    show(image, '');

    // Src, alt
    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt || '');

    // Width, height
    applyNumericalStyle(image, 'width', params.imageWidth);
    applyNumericalStyle(image, 'height', params.imageHeight);

    // Class
    image.className = swalClasses.image;
    applyCustomClass(image, params, 'image');
  };

  let dragging = false;
  let mousedownX = 0;
  let mousedownY = 0;
  let initialX = 0;
  let initialY = 0;

  /**
   * @param {HTMLElement} popup
   */
  const addDraggableListeners = popup => {
    popup.addEventListener('mousedown', down);
    document.body.addEventListener('mousemove', move);
    popup.addEventListener('mouseup', up);
    popup.addEventListener('touchstart', down);
    document.body.addEventListener('touchmove', move);
    popup.addEventListener('touchend', up);
  };

  /**
   * @param {HTMLElement} popup
   */
  const removeDraggableListeners = popup => {
    popup.removeEventListener('mousedown', down);
    document.body.removeEventListener('mousemove', move);
    popup.removeEventListener('mouseup', up);
    popup.removeEventListener('touchstart', down);
    document.body.removeEventListener('touchmove', move);
    popup.removeEventListener('touchend', up);
  };

  /**
   * @param {MouseEvent | TouchEvent} event
   */
  const down = event => {
    const popup = getPopup();
    if (event.target === popup || getIcon().contains(/** @type {HTMLElement} */event.target)) {
      dragging = true;
      const clientXY = getClientXY(event);
      mousedownX = clientXY.clientX;
      mousedownY = clientXY.clientY;
      initialX = parseInt(popup.style.insetInlineStart) || 0;
      initialY = parseInt(popup.style.insetBlockStart) || 0;
      addClass(popup, 'swal2-dragging');
    }
  };

  /**
   * @param {MouseEvent | TouchEvent} event
   */
  const move = event => {
    const popup = getPopup();
    if (dragging) {
      let {
        clientX,
        clientY
      } = getClientXY(event);
      popup.style.insetInlineStart = `${initialX + (clientX - mousedownX)}px`;
      popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`;
    }
  };
  const up = () => {
    const popup = getPopup();
    dragging = false;
    removeClass(popup, 'swal2-dragging');
  };

  /**
   * @param {MouseEvent | TouchEvent} event
   * @returns {{ clientX: number, clientY: number }}
   */
  const getClientXY = event => {
    let clientX = 0,
      clientY = 0;
    if (event.type.startsWith('mouse')) {
      clientX = /** @type {MouseEvent} */event.clientX;
      clientY = /** @type {MouseEvent} */event.clientY;
    } else if (event.type.startsWith('touch')) {
      clientX = /** @type {TouchEvent} */event.touches[0].clientX;
      clientY = /** @type {TouchEvent} */event.touches[0].clientY;
    }
    return {
      clientX,
      clientY
    };
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderPopup = (instance, params) => {
    const container = getContainer();
    const popup = getPopup();
    if (!container || !popup) {
      return;
    }

    // Width
    // https://github.com/sweetalert2/sweetalert2/issues/2170
    if (params.toast) {
      applyNumericalStyle(container, 'width', params.width);
      popup.style.width = '100%';
      const loader = getLoader();
      if (loader) {
        popup.insertBefore(loader, getIcon());
      }
    } else {
      applyNumericalStyle(popup, 'width', params.width);
    }

    // Padding
    applyNumericalStyle(popup, 'padding', params.padding);

    // Color
    if (params.color) {
      popup.style.color = params.color;
    }

    // Background
    if (params.background) {
      popup.style.background = params.background;
    }
    hide(getValidationMessage());

    // Classes
    addClasses$1(popup, params);
    if (params.draggable && !params.toast) {
      addClass(popup, swalClasses.draggable);
      addDraggableListeners(popup);
    } else {
      removeClass(popup, swalClasses.draggable);
      removeDraggableListeners(popup);
    }
  };

  /**
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses$1 = (popup, params) => {
    const showClass = params.showClass || {};
    // Default Class + showClass when updating Swal.update({})
    popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ''}`;
    if (params.toast) {
      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
      addClass(popup, swalClasses.toast);
    } else {
      addClass(popup, swalClasses.modal);
    }

    // Custom class
    applyCustomClass(popup, params, 'popup');
    // TODO: remove in the next major
    if (typeof params.customClass === 'string') {
      addClass(popup, params.customClass);
    }

    // Icon class (#1842)
    if (params.icon) {
      addClass(popup, swalClasses[`icon-${params.icon}`]);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderProgressSteps = (instance, params) => {
    const progressStepsContainer = getProgressSteps();
    if (!progressStepsContainer) {
      return;
    }
    const {
      progressSteps,
      currentProgressStep
    } = params;
    if (!progressSteps || progressSteps.length === 0 || currentProgressStep === undefined) {
      hide(progressStepsContainer);
      return;
    }
    show(progressStepsContainer);
    progressStepsContainer.textContent = '';
    if (currentProgressStep >= progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }
    progressSteps.forEach((step, index) => {
      const stepEl = createStepElement(step);
      progressStepsContainer.appendChild(stepEl);
      if (index === currentProgressStep) {
        addClass(stepEl, swalClasses['active-progress-step']);
      }
      if (index !== progressSteps.length - 1) {
        const lineEl = createLineElement(params);
        progressStepsContainer.appendChild(lineEl);
      }
    });
  };

  /**
   * @param {string} step
   * @returns {HTMLLIElement}
   */
  const createStepElement = step => {
    const stepEl = document.createElement('li');
    addClass(stepEl, swalClasses['progress-step']);
    setInnerHtml(stepEl, step);
    return stepEl;
  };

  /**
   * @param {SweetAlertOptions} params
   * @returns {HTMLLIElement}
   */
  const createLineElement = params => {
    const lineEl = document.createElement('li');
    addClass(lineEl, swalClasses['progress-step-line']);
    if (params.progressStepsDistance) {
      applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
    }
    return lineEl;
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderTitle = (instance, params) => {
    const title = getTitle();
    if (!title) {
      return;
    }
    showWhenInnerHtmlPresent(title);
    toggle(title, Boolean(params.title || params.titleText), 'block');
    if (params.title) {
      parseHtmlToContainer(params.title, title);
    }
    if (params.titleText) {
      title.innerText = params.titleText;
    }

    // Custom class
    applyCustomClass(title, params, 'title');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const render = (instance, params) => {
    renderPopup(instance, params);
    renderContainer(instance, params);
    renderProgressSteps(instance, params);
    renderIcon(instance, params);
    renderImage(instance, params);
    renderTitle(instance, params);
    renderCloseButton(instance, params);
    renderContent(instance, params);
    renderActions(instance, params);
    renderFooter(instance, params);
    const popup = getPopup();
    if (typeof params.didRender === 'function' && popup) {
      params.didRender(popup);
    }
    globalState.eventEmitter.emit('didRender', popup);
  };

  /*
   * Global function to determine if SweetAlert2 popup is shown
   */
  const isVisible = () => {
    return isVisible$1(getPopup());
  };

  /*
   * Global function to click 'Confirm' button
   */
  const clickConfirm = () => {
    var _dom$getConfirmButton;
    return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
  };

  /*
   * Global function to click 'Deny' button
   */
  const clickDeny = () => {
    var _dom$getDenyButton;
    return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
  };

  /*
   * Global function to click 'Cancel' button
   */
  const clickCancel = () => {
    var _dom$getCancelButton;
    return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
  };

  /** @type {Record<DismissReason, DismissReason>} */
  const DismissReason = Object.freeze({
    cancel: 'cancel',
    backdrop: 'backdrop',
    close: 'close',
    esc: 'esc',
    timer: 'timer'
  });

  /**
   * @param {GlobalState} globalState
   */
  const removeKeydownHandler = globalState => {
    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }
  };

  /**
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const addKeydownHandler = (globalState, innerParams, dismissWith) => {
    removeKeydownHandler(globalState);
    if (!innerParams.toast) {
      globalState.keydownHandler = e => keydownHandler(innerParams, e, dismissWith);
      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }
  };

  /**
   * @param {number} index
   * @param {number} increment
   */
  const setFocus = (index, increment) => {
    var _dom$getPopup;
    const focusableElements = getFocusableElements();
    // search for visible elements and select the next possible match
    if (focusableElements.length) {
      index = index + increment;

      // shift + tab when .swal2-popup is focused
      if (index === -2) {
        index = focusableElements.length - 1;
      }

      // rollover to first item
      if (index === focusableElements.length) {
        index = 0;

        // go to last item
      } else if (index === -1) {
        index = focusableElements.length - 1;
      }
      focusableElements[index].focus();
      return;
    }
    // no visible focusable elements, focus the popup
    (_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
  };
  const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
  const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {KeyboardEvent} event
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const keydownHandler = (innerParams, event, dismissWith) => {
    if (!innerParams) {
      return; // This instance has already been destroyed
    }

    // Ignore keydown during IME composition
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
    // https://github.com/sweetalert2/sweetalert2/issues/720
    // https://github.com/sweetalert2/sweetalert2/issues/2406
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (innerParams.stopKeydownPropagation) {
      event.stopPropagation();
    }

    // ENTER
    if (event.key === 'Enter') {
      handleEnter(event, innerParams);
    }

    // TAB
    else if (event.key === 'Tab') {
      handleTab(event);
    }

    // ARROWS - switch focus between buttons
    else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
      handleArrows(event.key);
    }

    // ESC
    else if (event.key === 'Escape') {
      handleEsc(event, innerParams, dismissWith);
    }
  };

  /**
   * @param {KeyboardEvent} event
   * @param {SweetAlertOptions} innerParams
   */
  const handleEnter = (event, innerParams) => {
    // https://github.com/sweetalert2/sweetalert2/issues/2386
    if (!callIfFunction(innerParams.allowEnterKey)) {
      return;
    }
    const input = getInput$1(getPopup(), innerParams.input);
    if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
      if (['textarea', 'file'].includes(innerParams.input)) {
        return; // do not submit
      }
      clickConfirm();
      event.preventDefault();
    }
  };

  /**
   * @param {KeyboardEvent} event
   */
  const handleTab = event => {
    const targetElement = event.target;
    const focusableElements = getFocusableElements();
    let btnIndex = -1;
    for (let i = 0; i < focusableElements.length; i++) {
      if (targetElement === focusableElements[i]) {
        btnIndex = i;
        break;
      }
    }

    // Cycle to the next button
    if (!event.shiftKey) {
      setFocus(btnIndex, 1);
    }

    // Cycle to the prev button
    else {
      setFocus(btnIndex, -1);
    }
    event.stopPropagation();
    event.preventDefault();
  };

  /**
   * @param {string} key
   */
  const handleArrows = key => {
    const actions = getActions();
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();
    if (!actions || !confirmButton || !denyButton || !cancelButton) {
      return;
    }
    /** @type HTMLElement[] */
    const buttons = [confirmButton, denyButton, cancelButton];
    if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
      return;
    }
    const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
    let buttonToFocus = document.activeElement;
    if (!buttonToFocus) {
      return;
    }
    for (let i = 0; i < actions.children.length; i++) {
      buttonToFocus = buttonToFocus[sibling];
      if (!buttonToFocus) {
        return;
      }
      if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
        break;
      }
    }
    if (buttonToFocus instanceof HTMLButtonElement) {
      buttonToFocus.focus();
    }
  };

  /**
   * @param {KeyboardEvent} event
   * @param {SweetAlertOptions} innerParams
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const handleEsc = (event, innerParams, dismissWith) => {
    event.preventDefault();
    if (callIfFunction(innerParams.allowEscapeKey)) {
      dismissWith(DismissReason.esc);
    }
  };

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateMethods = {
    swalPromiseResolve: new WeakMap(),
    swalPromiseReject: new WeakMap()
  };

  // From https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
  // elements not within the active modal dialog will not be surfaced if a user opens a screen
  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

  const setAriaHidden = () => {
    const container = getContainer();
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.contains(container)) {
        return;
      }
      if (el.hasAttribute('aria-hidden')) {
        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden') || '');
      }
      el.setAttribute('aria-hidden', 'true');
    });
  };
  const unsetAriaHidden = () => {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.hasAttribute('data-previous-aria-hidden')) {
        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden') || '');
        el.removeAttribute('data-previous-aria-hidden');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  };

  // @ts-ignore
  const isSafariOrIOS = typeof window !== 'undefined' && !!window.GestureEvent; // true for Safari desktop + all iOS browsers https://stackoverflow.com/a/70585394

  /**
   * Fix iOS scrolling
   * http://stackoverflow.com/q/39626302
   */
  const iOSfix = () => {
    if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
      const offset = document.body.scrollTop;
      document.body.style.top = `${offset * -1}px`;
      addClass(document.body, swalClasses.iosfix);
      lockBodyScroll();
    }
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1246
   */
  const lockBodyScroll = () => {
    const container = getContainer();
    if (!container) {
      return;
    }
    /** @type {boolean} */
    let preventTouchMove;
    /**
     * @param {TouchEvent} event
     */
    container.ontouchstart = event => {
      preventTouchMove = shouldPreventTouchMove(event);
    };
    /**
     * @param {TouchEvent} event
     */
    container.ontouchmove = event => {
      if (preventTouchMove) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  };

  /**
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const shouldPreventTouchMove = event => {
    const target = event.target;
    const container = getContainer();
    const htmlContainer = getHtmlContainer();
    if (!container || !htmlContainer) {
      return false;
    }
    if (isStylus(event) || isZoom(event)) {
      return false;
    }
    if (target === container) {
      return true;
    }
    if (!isScrollable(container) && target instanceof HTMLElement && !selfOrParentIsScrollable(target, htmlContainer) &&
    // #2823
    target.tagName !== 'INPUT' &&
    // #1603
    target.tagName !== 'TEXTAREA' &&
    // #2266
    !(isScrollable(htmlContainer) &&
    // #1944
    htmlContainer.contains(target))) {
      return true;
    }
    return false;
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1786
   *
   * @param {object} event
   * @returns {boolean}
   */
  const isStylus = event => {
    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1891
   *
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const isZoom = event => {
    return event.touches && event.touches.length > 1;
  };
  const undoIOSfix = () => {
    if (hasClass(document.body, swalClasses.iosfix)) {
      const offset = parseInt(document.body.style.top, 10);
      removeClass(document.body, swalClasses.iosfix);
      document.body.style.top = '';
      document.body.scrollTop = offset * -1;
    }
  };

  /**
   * Measure scrollbar width for padding body during modal show/hide
   * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
   *
   * @returns {number}
   */
  const measureScrollbar = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = swalClasses['scrollbar-measure'];
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  /**
   * Remember state in cases where opening and handling a modal will fiddle with it.
   * @type {number | null}
   */
  let previousBodyPadding = null;

  /**
   * @param {string} initialBodyOverflow
   */
  const replaceScrollbarWithPadding = initialBodyOverflow => {
    // for queues, do not do this more than once
    if (previousBodyPadding !== null) {
      return;
    }
    // if the body has overflow
    if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === 'scroll' // https://github.com/sweetalert2/sweetalert2/issues/2663
    ) {
      // add padding so the content doesn't shift after removal of scrollbar
      previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
      document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
    }
  };
  const undoReplaceScrollbarWithPadding = () => {
    if (previousBodyPadding !== null) {
      document.body.style.paddingRight = `${previousBodyPadding}px`;
      previousBodyPadding = null;
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} container
   * @param {boolean} returnFocus
   * @param {() => void} didClose
   */
  function removePopupAndResetState(instance, container, returnFocus, didClose) {
    if (isToast()) {
      triggerDidCloseAndDispose(instance, didClose);
    } else {
      restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
      removeKeydownHandler(globalState);
    }

    // workaround for https://github.com/sweetalert2/sweetalert2/issues/2088
    // for some reason removing the container in Safari will scroll the document to bottom
    if (isSafariOrIOS) {
      container.setAttribute('style', 'display:none !important');
      container.removeAttribute('class');
      container.innerHTML = '';
    } else {
      container.remove();
    }
    if (isModal()) {
      undoReplaceScrollbarWithPadding();
      undoIOSfix();
      unsetAriaHidden();
    }
    removeBodyClasses();
  }

  /**
   * Remove SweetAlert2 classes from body
   */
  function removeBodyClasses() {
    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
  }

  /**
   * Instance method to close sweetAlert
   *
   * @param {SweetAlertResult | undefined} resolveValue
   */
  function close(resolveValue) {
    resolveValue = prepareResolveValue(resolveValue);
    const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    const didClose = triggerClosePopup(this);
    if (this.isAwaitingPromise) {
      // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
      if (!resolveValue.isDismissed) {
        handleAwaitingPromise(this);
        swalPromiseResolve(resolveValue);
      }
    } else if (didClose) {
      // Resolve Swal promise
      swalPromiseResolve(resolveValue);
    }
  }
  const triggerClosePopup = instance => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
      return false;
    }
    removeClass(popup, innerParams.showClass.popup);
    addClass(popup, innerParams.hideClass.popup);
    const backdrop = getContainer();
    removeClass(backdrop, innerParams.showClass.backdrop);
    addClass(backdrop, innerParams.hideClass.backdrop);
    handlePopupAnimation(instance, popup, innerParams);
    return true;
  };

  /**
   * @param {Error | string} error
   */
  function rejectPromise(error) {
    const rejectPromise = privateMethods.swalPromiseReject.get(this);
    handleAwaitingPromise(this);
    if (rejectPromise) {
      // Reject Swal promise
      rejectPromise(error);
    }
  }

  /**
   * @param {SweetAlert} instance
   */
  const handleAwaitingPromise = instance => {
    if (instance.isAwaitingPromise) {
      delete instance.isAwaitingPromise;
      // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335
      if (!privateProps.innerParams.get(instance)) {
        instance._destroy();
      }
    }
  };

  /**
   * @param {SweetAlertResult | undefined} resolveValue
   * @returns {SweetAlertResult}
   */
  const prepareResolveValue = resolveValue => {
    // When user calls Swal.close()
    if (typeof resolveValue === 'undefined') {
      return {
        isConfirmed: false,
        isDenied: false,
        isDismissed: true
      };
    }
    return Object.assign({
      isConfirmed: false,
      isDenied: false,
      isDismissed: false
    }, resolveValue);
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} innerParams
   */
  const handlePopupAnimation = (instance, popup, innerParams) => {
    var _globalState$eventEmi;
    const container = getContainer();
    // If animation is supported, animate
    const animationIsSupported = hasCssAnimation(popup);
    if (typeof innerParams.willClose === 'function') {
      innerParams.willClose(popup);
    }
    (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit('willClose', popup);
    if (animationIsSupported) {
      animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
    } else {
      // Otherwise, remove immediately
      removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} popup
   * @param {HTMLElement} container
   * @param {boolean} returnFocus
   * @param {() => void} didClose
   */
  const animatePopup = (instance, popup, container, returnFocus, didClose) => {
    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
    /**
     * @param {AnimationEvent | TransitionEvent} e
     */
    const swalCloseAnimationFinished = function (e) {
      if (e.target === popup) {
        var _globalState$swalClos;
        (_globalState$swalClos = globalState.swalCloseEventFinishedCallback) === null || _globalState$swalClos === void 0 || _globalState$swalClos.call(globalState);
        delete globalState.swalCloseEventFinishedCallback;
        popup.removeEventListener('animationend', swalCloseAnimationFinished);
        popup.removeEventListener('transitionend', swalCloseAnimationFinished);
      }
    };
    popup.addEventListener('animationend', swalCloseAnimationFinished);
    popup.addEventListener('transitionend', swalCloseAnimationFinished);
  };

  /**
   * @param {SweetAlert} instance
   * @param {() => void} didClose
   */
  const triggerDidCloseAndDispose = (instance, didClose) => {
    setTimeout(() => {
      var _globalState$eventEmi2;
      if (typeof didClose === 'function') {
        didClose.bind(instance.params)();
      }
      (_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit('didClose');
      // instance might have been destroyed already
      if (instance._destroy) {
        instance._destroy();
      }
    });
  };

  /**
   * Shows loader (spinner), this is useful with AJAX requests.
   * By default the loader be shown instead of the "Confirm" button.
   *
   * @param {HTMLButtonElement | null} [buttonToReplace]
   */
  const showLoading = buttonToReplace => {
    let popup = getPopup();
    if (!popup) {
      new Swal();
    }
    popup = getPopup();
    if (!popup) {
      return;
    }
    const loader = getLoader();
    if (isToast()) {
      hide(getIcon());
    } else {
      replaceButton(popup, buttonToReplace);
    }
    show(loader);
    popup.setAttribute('data-loading', 'true');
    popup.setAttribute('aria-busy', 'true');
    popup.focus();
  };

  /**
   * @param {HTMLElement} popup
   * @param {HTMLButtonElement | null} [buttonToReplace]
   */
  const replaceButton = (popup, buttonToReplace) => {
    const actions = getActions();
    const loader = getLoader();
    if (!actions || !loader) {
      return;
    }
    if (!buttonToReplace && isVisible$1(getConfirmButton())) {
      buttonToReplace = getConfirmButton();
    }
    show(actions);
    if (buttonToReplace) {
      hide(buttonToReplace);
      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
      actions.insertBefore(loader, buttonToReplace);
    }
    addClass([popup, actions], swalClasses.loading);
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptionsAndValue = (instance, params) => {
    if (params.input === 'select' || params.input === 'radio') {
      handleInputOptions(instance, params);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].some(i => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
      showLoading(getConfirmButton());
      handleInputValue(instance, params);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} innerParams
   * @returns {SweetAlertInputValue}
   */
  const getInputValue = (instance, innerParams) => {
    const input = instance.getInput();
    if (!input) {
      return null;
    }
    switch (innerParams.input) {
      case 'checkbox':
        return getCheckboxValue(input);
      case 'radio':
        return getRadioValue(input);
      case 'file':
        return getFileValue(input);
      default:
        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    }
  };

  /**
   * @param {HTMLInputElement} input
   * @returns {number}
   */
  const getCheckboxValue = input => input.checked ? 1 : 0;

  /**
   * @param {HTMLInputElement} input
   * @returns {string | null}
   */
  const getRadioValue = input => input.checked ? input.value : null;

  /**
   * @param {HTMLInputElement} input
   * @returns {FileList | File | null}
   */
  const getFileValue = input => input.files && input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptions = (instance, params) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    /**
     * @param {*} inputOptions
     */
    const processInputOptions = inputOptions => {
      if (params.input === 'select') {
        populateSelectOptions(popup, formatInputOptions(inputOptions), params);
      } else if (params.input === 'radio') {
        populateRadioOptions(popup, formatInputOptions(inputOptions), params);
      }
    };
    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
      showLoading(getConfirmButton());
      asPromise(params.inputOptions).then(inputOptions => {
        instance.hideLoading();
        processInputOptions(inputOptions);
      });
    } else if (typeof params.inputOptions === 'object') {
      processInputOptions(params.inputOptions);
    } else {
      error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputValue = (instance, params) => {
    const input = instance.getInput();
    if (!input) {
      return;
    }
    hide(input);
    asPromise(params.inputValue).then(inputValue => {
      input.value = params.input === 'number' ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
      show(input);
      input.focus();
      instance.hideLoading();
    }).catch(err => {
      error(`Error in inputValue promise: ${err}`);
      input.value = '';
      show(input);
      input.focus();
      instance.hideLoading();
    });
  };

  /**
   * @param {HTMLElement} popup
   * @param {InputOptionFlattened[]} inputOptions
   * @param {SweetAlertOptions} params
   */
  function populateSelectOptions(popup, inputOptions, params) {
    const select = getDirectChildByClass(popup, swalClasses.select);
    if (!select) {
      return;
    }
    /**
     * @param {HTMLElement} parent
     * @param {string} optionLabel
     * @param {string} optionValue
     */
    const renderOption = (parent, optionLabel, optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      setInnerHtml(option, optionLabel);
      option.selected = isSelected(optionValue, params.inputValue);
      parent.appendChild(option);
    };
    inputOptions.forEach(inputOption => {
      const optionValue = inputOption[0];
      const optionLabel = inputOption[1];
      // <optgroup> spec:
      // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
      // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
      // check whether this is a <optgroup>
      if (Array.isArray(optionLabel)) {
        // if it is an array, then it is an <optgroup>
        const optgroup = document.createElement('optgroup');
        optgroup.label = optionValue;
        optgroup.disabled = false; // not configurable for now
        select.appendChild(optgroup);
        optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
      } else {
        // case of <option>
        renderOption(select, optionLabel, optionValue);
      }
    });
    select.focus();
  }

  /**
   * @param {HTMLElement} popup
   * @param {InputOptionFlattened[]} inputOptions
   * @param {SweetAlertOptions} params
   */
  function populateRadioOptions(popup, inputOptions, params) {
    const radio = getDirectChildByClass(popup, swalClasses.radio);
    if (!radio) {
      return;
    }
    inputOptions.forEach(inputOption => {
      const radioValue = inputOption[0];
      const radioLabel = inputOption[1];
      const radioInput = document.createElement('input');
      const radioLabelElement = document.createElement('label');
      radioInput.type = 'radio';
      radioInput.name = swalClasses.radio;
      radioInput.value = radioValue;
      if (isSelected(radioValue, params.inputValue)) {
        radioInput.checked = true;
      }
      const label = document.createElement('span');
      setInnerHtml(label, radioLabel);
      label.className = swalClasses.label;
      radioLabelElement.appendChild(radioInput);
      radioLabelElement.appendChild(label);
      radio.appendChild(radioLabelElement);
    });
    const radios = radio.querySelectorAll('input');
    if (radios.length) {
      radios[0].focus();
    }
  }

  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   *
   * @param {*} inputOptions
   * @typedef {string[]} InputOptionFlattened
   * @returns {InputOptionFlattened[]}
   */
  const formatInputOptions = inputOptions => {
    /** @type {InputOptionFlattened[]} */
    const result = [];
    if (inputOptions instanceof Map) {
      inputOptions.forEach((value, key) => {
        let valueFormatted = value;
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    } else {
      Object.keys(inputOptions).forEach(key => {
        let valueFormatted = inputOptions[key];
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    }
    return result;
  };

  /**
   * @param {string} optionValue
   * @param {SweetAlertInputValue} inputValue
   * @returns {boolean}
   */
  const isSelected = (optionValue, inputValue) => {
    return !!inputValue && inputValue.toString() === optionValue.toString();
  };

  /**
   * @param {SweetAlert} instance
   */
  const handleConfirmButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.input) {
      handleConfirmOrDenyWithInput(instance, 'confirm');
    } else {
      confirm(instance, true);
    }
  };

  /**
   * @param {SweetAlert} instance
   */
  const handleDenyButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.returnInputValueOnDeny) {
      handleConfirmOrDenyWithInput(instance, 'deny');
    } else {
      deny(instance, false);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const handleCancelButtonClick = (instance, dismissWith) => {
    instance.disableButtons();
    dismissWith(DismissReason.cancel);
  };

  /**
   * @param {SweetAlert} instance
   * @param {'confirm' | 'deny'} type
   */
  const handleConfirmOrDenyWithInput = (instance, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams.input) {
      error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
      return;
    }
    const input = instance.getInput();
    const inputValue = getInputValue(instance, innerParams);
    if (innerParams.inputValidator) {
      handleInputValidator(instance, inputValue, type);
    } else if (input && !input.checkValidity()) {
      instance.enableButtons();
      instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
    } else if (type === 'deny') {
      deny(instance, inputValue);
    } else {
      confirm(instance, inputValue);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertInputValue} inputValue
   * @param {'confirm' | 'deny'} type
   */
  const handleInputValidator = (instance, inputValue, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableInput();
    const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
    validationPromise.then(validationMessage => {
      instance.enableButtons();
      instance.enableInput();
      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else if (type === 'deny') {
        deny(instance, inputValue);
      } else {
        confirm(instance, inputValue);
      }
    });
  };

  /**
   * @param {SweetAlert} instance
   * @param {*} value
   */
  const deny = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnDeny) {
      showLoading(getDenyButton());
    }
    if (innerParams.preDeny) {
      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received
      const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
      preDenyPromise.then(preDenyValue => {
        if (preDenyValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          instance.close(/** @type SweetAlertResult */{
            isDenied: true,
            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
          });
        }
      }).catch(error => rejectWith(instance || undefined, error));
    } else {
      instance.close(/** @type SweetAlertResult */{
        isDenied: true,
        value
      });
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {*} value
   */
  const succeedWith = (instance, value) => {
    instance.close(/** @type SweetAlertResult */{
      isConfirmed: true,
      value
    });
  };

  /**
   *
   * @param {SweetAlert} instance
   * @param {string} error
   */
  const rejectWith = (instance, error) => {
    instance.rejectPromise(error);
  };

  /**
   *
   * @param {SweetAlert} instance
   * @param {*} value
   */
  const confirm = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnConfirm) {
      showLoading();
    }
    if (innerParams.preConfirm) {
      instance.resetValidationMessage();
      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received
      const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
      preConfirmPromise.then(preConfirmValue => {
        if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
        }
      }).catch(error => rejectWith(instance || undefined, error));
    } else {
      succeedWith(instance, value);
    }
  };

  /**
   * Hides loader and shows back the button which was hidden by .showLoading()
   */
  function hideLoading() {
    // do nothing if popup is closed
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      return;
    }
    const domCache = privateProps.domCache.get(this);
    hide(domCache.loader);
    if (isToast()) {
      if (innerParams.icon) {
        show(getIcon());
      }
    } else {
      showRelatedButton(domCache);
    }
    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    domCache.popup.removeAttribute('aria-busy');
    domCache.popup.removeAttribute('data-loading');
    domCache.confirmButton.disabled = false;
    domCache.denyButton.disabled = false;
    domCache.cancelButton.disabled = false;
  }
  const showRelatedButton = domCache => {
    const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));
    if (buttonToReplace.length) {
      show(buttonToReplace[0], 'inline-block');
    } else if (allButtonsAreHidden()) {
      hide(domCache.actions);
    }
  };

  /**
   * Gets the input DOM node, this method works with input parameter.
   *
   * @returns {HTMLInputElement | null}
   */
  function getInput() {
    const innerParams = privateProps.innerParams.get(this);
    const domCache = privateProps.domCache.get(this);
    if (!domCache) {
      return null;
    }
    return getInput$1(domCache.popup, innerParams.input);
  }

  /**
   * @param {SweetAlert} instance
   * @param {string[]} buttons
   * @param {boolean} disabled
   */
  function setButtonsDisabled(instance, buttons, disabled) {
    const domCache = privateProps.domCache.get(instance);
    buttons.forEach(button => {
      domCache[button].disabled = disabled;
    });
  }

  /**
   * @param {HTMLInputElement | null} input
   * @param {boolean} disabled
   */
  function setInputDisabled(input, disabled) {
    const popup = getPopup();
    if (!popup || !input) {
      return;
    }
    if (input.type === 'radio') {
      /** @type {NodeListOf<HTMLInputElement>} */
      const radios = popup.querySelectorAll(`[name="${swalClasses.radio}"]`);
      for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
      }
    } else {
      input.disabled = disabled;
    }
  }

  /**
   * Enable all the buttons
   * @this {SweetAlert}
   */
  function enableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
  }

  /**
   * Disable all the buttons
   * @this {SweetAlert}
   */
  function disableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
  }

  /**
   * Enable the input field
   * @this {SweetAlert}
   */
  function enableInput() {
    setInputDisabled(this.getInput(), false);
  }

  /**
   * Disable the input field
   * @this {SweetAlert}
   */
  function disableInput() {
    setInputDisabled(this.getInput(), true);
  }

  /**
   * Show block with validation message
   *
   * @param {string} error
   * @this {SweetAlert}
   */
  function showValidationMessage(error) {
    const domCache = privateProps.domCache.get(this);
    const params = privateProps.innerParams.get(this);
    setInnerHtml(domCache.validationMessage, error);
    domCache.validationMessage.className = swalClasses['validation-message'];
    if (params.customClass && params.customClass.validationMessage) {
      addClass(domCache.validationMessage, params.customClass.validationMessage);
    }
    show(domCache.validationMessage);
    const input = this.getInput();
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', swalClasses['validation-message']);
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    }
  }

  /**
   * Hide block with validation message
   *
   * @this {SweetAlert}
   */
  function resetValidationMessage() {
    const domCache = privateProps.domCache.get(this);
    if (domCache.validationMessage) {
      hide(domCache.validationMessage);
    }
    const input = this.getInput();
    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      removeClass(input, swalClasses.inputerror);
    }
  }

  const defaultParams = {
    title: '',
    titleText: '',
    text: '',
    html: '',
    footer: '',
    icon: undefined,
    iconColor: undefined,
    iconHtml: undefined,
    template: undefined,
    toast: false,
    draggable: false,
    animation: true,
    theme: 'light',
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    customClass: {},
    target: 'body',
    color: undefined,
    backdrop: true,
    heightAuto: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: true,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showDenyButton: false,
    showCancelButton: false,
    preConfirm: undefined,
    preDeny: undefined,
    confirmButtonText: 'OK',
    confirmButtonAriaLabel: '',
    confirmButtonColor: undefined,
    denyButtonText: 'No',
    denyButtonAriaLabel: '',
    denyButtonColor: undefined,
    cancelButtonText: 'Cancel',
    cancelButtonAriaLabel: '',
    cancelButtonColor: undefined,
    buttonsStyling: true,
    reverseButtons: false,
    focusConfirm: true,
    focusDeny: false,
    focusCancel: false,
    returnFocus: true,
    showCloseButton: false,
    closeButtonHtml: '&times;',
    closeButtonAriaLabel: 'Close this dialog',
    loaderHtml: '',
    showLoaderOnConfirm: false,
    showLoaderOnDeny: false,
    imageUrl: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    imageAlt: '',
    timer: undefined,
    timerProgressBar: false,
    width: undefined,
    padding: undefined,
    background: undefined,
    input: undefined,
    inputPlaceholder: '',
    inputLabel: '',
    inputValue: '',
    inputOptions: {},
    inputAutoFocus: true,
    inputAutoTrim: true,
    inputAttributes: {},
    inputValidator: undefined,
    returnInputValueOnDeny: false,
    validationMessage: undefined,
    grow: false,
    position: 'center',
    progressSteps: [],
    currentProgressStep: undefined,
    progressStepsDistance: undefined,
    willOpen: undefined,
    didOpen: undefined,
    didRender: undefined,
    willClose: undefined,
    didClose: undefined,
    didDestroy: undefined,
    scrollbarPadding: true,
    topLayer: false
  };
  const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'draggable', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'theme', 'willClose'];

  /** @type {Record<string, string | undefined>} */
  const deprecatedParams = {
    allowEnterKey: undefined
  };
  const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'draggable', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];

  /**
   * Is valid parameter
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isValidParameter = paramName => {
    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
  };

  /**
   * Is valid parameter for Swal.update() method
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isUpdatableParameter = paramName => {
    return updatableParams.indexOf(paramName) !== -1;
  };

  /**
   * Is deprecated parameter
   *
   * @param {string} paramName
   * @returns {string | undefined}
   */
  const isDeprecatedParameter = paramName => {
    return deprecatedParams[paramName];
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsValid = param => {
    if (!isValidParameter(param)) {
      warn(`Unknown parameter "${param}"`);
    }
  };

  /**
   * @param {string} param
   */
  const checkIfToastParamIsValid = param => {
    if (toastIncompatibleParams.includes(param)) {
      warn(`The parameter "${param}" is incompatible with toasts`);
    }
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsDeprecated = param => {
    const isDeprecated = isDeprecatedParameter(param);
    if (isDeprecated) {
      warnAboutDeprecation(param, isDeprecated);
    }
  };

  /**
   * Show relevant warnings for given params
   *
   * @param {SweetAlertOptions} params
   */
  const showWarningsForParams = params => {
    if (params.backdrop === false && params.allowOutsideClick) {
      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    }
    if (params.theme && !['light', 'dark', 'auto', 'minimal', 'borderless', 'bootstrap-4', 'bootstrap-4-light', 'bootstrap-4-dark', 'bootstrap-5', 'bootstrap-5-light', 'bootstrap-5-dark', 'material-ui', 'material-ui-light', 'material-ui-dark', 'embed-iframe', 'bulma', 'bulma-light', 'bulma-dark'].includes(params.theme)) {
      warn(`Invalid theme "${params.theme}"`);
    }
    for (const param in params) {
      checkIfParamIsValid(param);
      if (params.toast) {
        checkIfToastParamIsValid(param);
      }
      checkIfParamIsDeprecated(param);
    }
  };

  /**
   * Updates popup parameters.
   *
   * @param {SweetAlertOptions} params
   */
  function update(params) {
    const container = getContainer();
    const popup = getPopup();
    const innerParams = privateProps.innerParams.get(this);
    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
      warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
      return;
    }
    const validUpdatableParams = filterValidParams(params);
    const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
    showWarningsForParams(updatedParams);
    container.dataset['swal2Theme'] = updatedParams.theme;
    render(this, updatedParams);
    privateProps.innerParams.set(this, updatedParams);
    Object.defineProperties(this, {
      params: {
        value: Object.assign({}, this.params, params),
        writable: false,
        enumerable: true
      }
    });
  }

  /**
   * @param {SweetAlertOptions} params
   * @returns {SweetAlertOptions}
   */
  const filterValidParams = params => {
    const validUpdatableParams = {};
    Object.keys(params).forEach(param => {
      if (isUpdatableParameter(param)) {
        validUpdatableParams[param] = params[param];
      } else {
        warn(`Invalid parameter to update: ${param}`);
      }
    });
    return validUpdatableParams;
  };

  /**
   * Dispose the current SweetAlert2 instance
   */
  function _destroy() {
    const domCache = privateProps.domCache.get(this);
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335
      return; // This instance has already been destroyed
    }

    // Check if there is another Swal closing
    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    }
    if (typeof innerParams.didDestroy === 'function') {
      innerParams.didDestroy();
    }
    globalState.eventEmitter.emit('didDestroy');
    disposeSwal(this);
  }

  /**
   * @param {SweetAlert} instance
   */
  const disposeSwal = instance => {
    disposeWeakMaps(instance);
    // Unset this.params so GC will dispose it (#1569)
    delete instance.params;
    // Unset globalState props so GC will dispose globalState (#1569)
    delete globalState.keydownHandler;
    delete globalState.keydownTarget;
    // Unset currentInstance
    delete globalState.currentInstance;
  };

  /**
   * @param {SweetAlert} instance
   */
  const disposeWeakMaps = instance => {
    // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
    if (instance.isAwaitingPromise) {
      unsetWeakMaps(privateProps, instance);
      instance.isAwaitingPromise = true;
    } else {
      unsetWeakMaps(privateMethods, instance);
      unsetWeakMaps(privateProps, instance);
      delete instance.isAwaitingPromise;
      // Unset instance methods
      delete instance.disableButtons;
      delete instance.enableButtons;
      delete instance.getInput;
      delete instance.disableInput;
      delete instance.enableInput;
      delete instance.hideLoading;
      delete instance.disableLoading;
      delete instance.showValidationMessage;
      delete instance.resetValidationMessage;
      delete instance.close;
      delete instance.closePopup;
      delete instance.closeModal;
      delete instance.closeToast;
      delete instance.rejectPromise;
      delete instance.update;
      delete instance._destroy;
    }
  };

  /**
   * @param {object} obj
   * @param {SweetAlert} instance
   */
  const unsetWeakMaps = (obj, instance) => {
    for (const i in obj) {
      obj[i].delete(instance);
    }
  };

  var instanceMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    _destroy: _destroy,
    close: close,
    closeModal: close,
    closePopup: close,
    closeToast: close,
    disableButtons: disableButtons,
    disableInput: disableInput,
    disableLoading: hideLoading,
    enableButtons: enableButtons,
    enableInput: enableInput,
    getInput: getInput,
    handleAwaitingPromise: handleAwaitingPromise,
    hideLoading: hideLoading,
    rejectPromise: rejectPromise,
    resetValidationMessage: resetValidationMessage,
    showValidationMessage: showValidationMessage,
    update: update
  });

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {DomCache} domCache
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const handlePopupClick = (innerParams, domCache, dismissWith) => {
    if (innerParams.toast) {
      handleToastClick(innerParams, domCache, dismissWith);
    } else {
      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      handleModalMousedown(domCache);

      // Ignore click events that had mousedown on the container but mouseup on the popup
      handleContainerMousedown(domCache);
      handleModalClick(innerParams, domCache, dismissWith);
    }
  };

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {DomCache} domCache
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const handleToastClick = (innerParams, domCache, dismissWith) => {
    // Closing toast by internal click
    domCache.popup.onclick = () => {
      if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
        return;
      }
      dismissWith(DismissReason.close);
    };
  };

  /**
   * @param {SweetAlertOptions} innerParams
   * @returns {boolean}
   */
  const isAnyButtonShown = innerParams => {
    return !!(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
  };
  let ignoreOutsideClick = false;

  /**
   * @param {DomCache} domCache
   */
  const handleModalMousedown = domCache => {
    domCache.popup.onmousedown = () => {
      domCache.container.onmouseup = function (e) {
        domCache.container.onmouseup = () => {};
        // We only check if the mouseup target is the container because usually it doesn't
        // have any other direct children aside of the popup
        if (e.target === domCache.container) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  /**
   * @param {DomCache} domCache
   */
  const handleContainerMousedown = domCache => {
    domCache.container.onmousedown = e => {
      // prevent the modal text from being selected on double click on the container (allowOutsideClick: false)
      if (e.target === domCache.container) {
        e.preventDefault();
      }
      domCache.popup.onmouseup = function (e) {
        domCache.popup.onmouseup = () => {};
        // We also need to check if the mouseup target is a child of the popup
        if (e.target === domCache.popup || e.target instanceof HTMLElement && domCache.popup.contains(e.target)) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {DomCache} domCache
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const handleModalClick = (innerParams, domCache, dismissWith) => {
    domCache.container.onclick = e => {
      if (ignoreOutsideClick) {
        ignoreOutsideClick = false;
        return;
      }
      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
        dismissWith(DismissReason.backdrop);
      }
    };
  };

  const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;
  const isElement = elem => elem instanceof Element || isJqueryElement(elem);
  const argsToParams = args => {
    const params = {};
    if (typeof args[0] === 'object' && !isElement(args[0])) {
      Object.assign(params, args[0]);
    } else {
      ['title', 'html', 'icon'].forEach((name, index) => {
        const arg = args[index];
        if (typeof arg === 'string' || isElement(arg)) {
          params[name] = arg;
        } else if (arg !== undefined) {
          error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
        }
      });
    }
    return params;
  };

  /**
   * Main method to create a new SweetAlert2 popup
   *
   * @param  {...SweetAlertOptions} args
   * @returns {Promise<SweetAlertResult>}
   */
  function fire(...args) {
    return new this(...args);
  }

  /**
   * Returns an extended version of `Swal` containing `params` as defaults.
   * Useful for reusing Swal configuration.
   *
   * For example:
   *
   * Before:
   * const textPromptOptions = { input: 'text', showCancelButton: true }
   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
   *
   * After:
   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
   * const {value: firstName} = await TextPrompt('What is your first name?')
   * const {value: lastName} = await TextPrompt('What is your last name?')
   *
   * @param {SweetAlertOptions} mixinParams
   * @returns {SweetAlert}
   */
  function mixin(mixinParams) {
    class MixinSwal extends this {
      _main(params, priorityMixinParams) {
        return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
      }
    }
    // @ts-ignore
    return MixinSwal;
  }

  /**
   * If `timer` parameter is set, returns number of milliseconds of timer remained.
   * Otherwise, returns undefined.
   *
   * @returns {number | undefined}
   */
  const getTimerLeft = () => {
    return globalState.timeout && globalState.timeout.getTimerLeft();
  };

  /**
   * Stop timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const stopTimer = () => {
    if (globalState.timeout) {
      stopTimerProgressBar();
      return globalState.timeout.stop();
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const resumeTimer = () => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.start();
      animateTimerProgressBar(remaining);
      return remaining;
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const toggleTimer = () => {
    const timer = globalState.timeout;
    return timer && (timer.running ? stopTimer() : resumeTimer());
  };

  /**
   * Increase timer. Returns number of milliseconds of an updated timer.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @param {number} ms
   * @returns {number | undefined}
   */
  const increaseTimer = ms => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.increase(ms);
      animateTimerProgressBar(remaining, true);
      return remaining;
    }
  };

  /**
   * Check if timer is running. Returns true if timer is running
   * or false if timer is paused or stopped.
   * If `timer` parameter isn't set, returns undefined
   *
   * @returns {boolean}
   */
  const isTimerRunning = () => {
    return !!(globalState.timeout && globalState.timeout.isRunning());
  };

  let bodyClickListenerAdded = false;
  const clickHandlers = {};

  /**
   * @param {string} attr
   */
  function bindClickHandler(attr = 'data-swal-template') {
    clickHandlers[attr] = this;
    if (!bodyClickListenerAdded) {
      document.body.addEventListener('click', bodyClickListener);
      bodyClickListenerAdded = true;
    }
  }
  const bodyClickListener = event => {
    for (let el = event.target; el && el !== document; el = el.parentNode) {
      for (const attr in clickHandlers) {
        const template = el.getAttribute(attr);
        if (template) {
          clickHandlers[attr].fire({
            template
          });
          return;
        }
      }
    }
  };

  // Source: https://gist.github.com/mudge/5830382?permalink_comment_id=2691957#gistcomment-2691957

  class EventEmitter {
    constructor() {
      /** @type {Events} */
      this.events = {};
    }

    /**
     * @param {string} eventName
     * @returns {EventHandlers}
     */
    _getHandlersByEventName(eventName) {
      if (typeof this.events[eventName] === 'undefined') {
        // not Set because we need to keep the FIFO order
        // https://github.com/sweetalert2/sweetalert2/pull/2763#discussion_r1748990334
        this.events[eventName] = [];
      }
      return this.events[eventName];
    }

    /**
     * @param {string} eventName
     * @param {EventHandler} eventHandler
     */
    on(eventName, eventHandler) {
      const currentHandlers = this._getHandlersByEventName(eventName);
      if (!currentHandlers.includes(eventHandler)) {
        currentHandlers.push(eventHandler);
      }
    }

    /**
     * @param {string} eventName
     * @param {EventHandler} eventHandler
     */
    once(eventName, eventHandler) {
      /**
       * @param {Array} args
       */
      const onceFn = (...args) => {
        this.removeListener(eventName, onceFn);
        eventHandler.apply(this, args);
      };
      this.on(eventName, onceFn);
    }

    /**
     * @param {string} eventName
     * @param {Array} args
     */
    emit(eventName, ...args) {
      this._getHandlersByEventName(eventName).forEach(
      /**
       * @param {EventHandler} eventHandler
       */
      eventHandler => {
        try {
          eventHandler.apply(this, args);
        } catch (error) {
          console.error(error);
        }
      });
    }

    /**
     * @param {string} eventName
     * @param {EventHandler} eventHandler
     */
    removeListener(eventName, eventHandler) {
      const currentHandlers = this._getHandlersByEventName(eventName);
      const index = currentHandlers.indexOf(eventHandler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
      }
    }

    /**
     * @param {string} eventName
     */
    removeAllListeners(eventName) {
      if (this.events[eventName] !== undefined) {
        // https://github.com/sweetalert2/sweetalert2/pull/2763#discussion_r1749239222
        this.events[eventName].length = 0;
      }
    }
    reset() {
      this.events = {};
    }
  }

  globalState.eventEmitter = new EventEmitter();

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  const on = (eventName, eventHandler) => {
    globalState.eventEmitter.on(eventName, eventHandler);
  };

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  const once = (eventName, eventHandler) => {
    globalState.eventEmitter.once(eventName, eventHandler);
  };

  /**
   * @param {string} [eventName]
   * @param {EventHandler} [eventHandler]
   */
  const off = (eventName, eventHandler) => {
    // Remove all handlers for all events
    if (!eventName) {
      globalState.eventEmitter.reset();
      return;
    }
    if (eventHandler) {
      // Remove a specific handler
      globalState.eventEmitter.removeListener(eventName, eventHandler);
    } else {
      // Remove all handlers for a specific event
      globalState.eventEmitter.removeAllListeners(eventName);
    }
  };

  var staticMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    argsToParams: argsToParams,
    bindClickHandler: bindClickHandler,
    clickCancel: clickCancel,
    clickConfirm: clickConfirm,
    clickDeny: clickDeny,
    enableLoading: showLoading,
    fire: fire,
    getActions: getActions,
    getCancelButton: getCancelButton,
    getCloseButton: getCloseButton,
    getConfirmButton: getConfirmButton,
    getContainer: getContainer,
    getDenyButton: getDenyButton,
    getFocusableElements: getFocusableElements,
    getFooter: getFooter,
    getHtmlContainer: getHtmlContainer,
    getIcon: getIcon,
    getIconContent: getIconContent,
    getImage: getImage,
    getInputLabel: getInputLabel,
    getLoader: getLoader,
    getPopup: getPopup,
    getProgressSteps: getProgressSteps,
    getTimerLeft: getTimerLeft,
    getTimerProgressBar: getTimerProgressBar,
    getTitle: getTitle,
    getValidationMessage: getValidationMessage,
    increaseTimer: increaseTimer,
    isDeprecatedParameter: isDeprecatedParameter,
    isLoading: isLoading,
    isTimerRunning: isTimerRunning,
    isUpdatableParameter: isUpdatableParameter,
    isValidParameter: isValidParameter,
    isVisible: isVisible,
    mixin: mixin,
    off: off,
    on: on,
    once: once,
    resumeTimer: resumeTimer,
    showLoading: showLoading,
    stopTimer: stopTimer,
    toggleTimer: toggleTimer
  });

  class Timer {
    /**
     * @param {() => void} callback
     * @param {number} delay
     */
    constructor(callback, delay) {
      this.callback = callback;
      this.remaining = delay;
      this.running = false;
      this.start();
    }

    /**
     * @returns {number}
     */
    start() {
      if (!this.running) {
        this.running = true;
        this.started = new Date();
        this.id = setTimeout(this.callback, this.remaining);
      }
      return this.remaining;
    }

    /**
     * @returns {number}
     */
    stop() {
      if (this.started && this.running) {
        this.running = false;
        clearTimeout(this.id);
        this.remaining -= new Date().getTime() - this.started.getTime();
      }
      return this.remaining;
    }

    /**
     * @param {number} n
     * @returns {number}
     */
    increase(n) {
      const running = this.running;
      if (running) {
        this.stop();
      }
      this.remaining += n;
      if (running) {
        this.start();
      }
      return this.remaining;
    }

    /**
     * @returns {number}
     */
    getTimerLeft() {
      if (this.running) {
        this.stop();
        this.start();
      }
      return this.remaining;
    }

    /**
     * @returns {boolean}
     */
    isRunning() {
      return this.running;
    }
  }

  const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];

  /**
   * @param {SweetAlertOptions} params
   * @returns {SweetAlertOptions}
   */
  const getTemplateParams = params => {
    const template = typeof params.template === 'string' ? (/** @type {HTMLTemplateElement} */document.querySelector(params.template)) : params.template;
    if (!template) {
      return {};
    }
    /** @type {DocumentFragment} */
    const templateContent = template.content;
    showWarningsForElements(templateContent);
    const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, string | boolean | number>}
   */
  const getSwalParams = templateContent => {
    /** @type {Record<string, string | boolean | number>} */
    const result = {};
    /** @type {HTMLElement[]} */
    const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
    swalParams.forEach(param => {
      showWarningsForAttributes(param, ['name', 'value']);
      const paramName = /** @type {keyof SweetAlertOptions} */param.getAttribute('name');
      const value = param.getAttribute('value');
      if (!paramName || !value) {
        return;
      }
      if (typeof defaultParams[paramName] === 'boolean') {
        result[paramName] = value !== 'false';
      } else if (typeof defaultParams[paramName] === 'object') {
        result[paramName] = JSON.parse(value);
      } else {
        result[paramName] = value;
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, () => void>}
   */
  const getSwalFunctionParams = templateContent => {
    /** @type {Record<string, () => void>} */
    const result = {};
    /** @type {HTMLElement[]} */
    const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'));
    swalFunctions.forEach(param => {
      const paramName = /** @type {keyof SweetAlertOptions} */param.getAttribute('name');
      const value = param.getAttribute('value');
      if (!paramName || !value) {
        return;
      }
      result[paramName] = new Function(`return ${value}`)();
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, string | boolean>}
   */
  const getSwalButtons = templateContent => {
    /** @type {Record<string, string | boolean>} */
    const result = {};
    /** @type {HTMLElement[]} */
    const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
    swalButtons.forEach(button => {
      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
      const type = button.getAttribute('type');
      if (!type || !['confirm', 'cancel', 'deny'].includes(type)) {
        return;
      }
      result[`${type}ButtonText`] = button.innerHTML;
      result[`show${capitalizeFirstLetter(type)}Button`] = true;
      if (button.hasAttribute('color')) {
        result[`${type}ButtonColor`] = button.getAttribute('color');
      }
      if (button.hasAttribute('aria-label')) {
        result[`${type}ButtonAriaLabel`] = button.getAttribute('aria-label');
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Pick<SweetAlertOptions, 'imageUrl' | 'imageWidth' | 'imageHeight' | 'imageAlt'>}
   */
  const getSwalImage = templateContent => {
    const result = {};
    /** @type {HTMLElement | null} */
    const image = templateContent.querySelector('swal-image');
    if (image) {
      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);
      if (image.hasAttribute('src')) {
        result.imageUrl = image.getAttribute('src') || undefined;
      }
      if (image.hasAttribute('width')) {
        result.imageWidth = image.getAttribute('width') || undefined;
      }
      if (image.hasAttribute('height')) {
        result.imageHeight = image.getAttribute('height') || undefined;
      }
      if (image.hasAttribute('alt')) {
        result.imageAlt = image.getAttribute('alt') || undefined;
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {object}
   */
  const getSwalIcon = templateContent => {
    const result = {};
    /** @type {HTMLElement | null} */
    const icon = templateContent.querySelector('swal-icon');
    if (icon) {
      showWarningsForAttributes(icon, ['type', 'color']);
      if (icon.hasAttribute('type')) {
        result.icon = icon.getAttribute('type');
      }
      if (icon.hasAttribute('color')) {
        result.iconColor = icon.getAttribute('color');
      }
      result.iconHtml = icon.innerHTML;
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {object}
   */
  const getSwalInput = templateContent => {
    /** @type {object} */
    const result = {};
    /** @type {HTMLElement | null} */
    const input = templateContent.querySelector('swal-input');
    if (input) {
      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
      result.input = input.getAttribute('type') || 'text';
      if (input.hasAttribute('label')) {
        result.inputLabel = input.getAttribute('label');
      }
      if (input.hasAttribute('placeholder')) {
        result.inputPlaceholder = input.getAttribute('placeholder');
      }
      if (input.hasAttribute('value')) {
        result.inputValue = input.getAttribute('value');
      }
    }
    /** @type {HTMLElement[]} */
    const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));
    if (inputOptions.length) {
      result.inputOptions = {};
      inputOptions.forEach(option => {
        showWarningsForAttributes(option, ['value']);
        const optionValue = option.getAttribute('value');
        if (!optionValue) {
          return;
        }
        const optionName = option.innerHTML;
        result.inputOptions[optionValue] = optionName;
      });
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @param {string[]} paramNames
   * @returns {Record<string, string>}
   */
  const getSwalStringParams = (templateContent, paramNames) => {
    /** @type {Record<string, string>} */
    const result = {};
    for (const i in paramNames) {
      const paramName = paramNames[i];
      /** @type {HTMLElement | null} */
      const tag = templateContent.querySelector(paramName);
      if (tag) {
        showWarningsForAttributes(tag, []);
        result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   */
  const showWarningsForElements = templateContent => {
    const allowedElements = swalStringParams.concat(['swal-param', 'swal-function-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
    Array.from(templateContent.children).forEach(el => {
      const tagName = el.tagName.toLowerCase();
      if (!allowedElements.includes(tagName)) {
        warn(`Unrecognized element <${tagName}>`);
      }
    });
  };

  /**
   * @param {HTMLElement} el
   * @param {string[]} allowedAttributes
   */
  const showWarningsForAttributes = (el, allowedAttributes) => {
    Array.from(el.attributes).forEach(attribute => {
      if (allowedAttributes.indexOf(attribute.name) === -1) {
        warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(', ')}` : 'To set the value, use HTML within the element.'}`]);
      }
    });
  };

  const SHOW_CLASS_TIMEOUT = 10;

  /**
   * Open popup, add necessary classes and styles, fix scrollbar
   *
   * @param {SweetAlertOptions} params
   */
  const openPopup = params => {
    const container = getContainer();
    const popup = getPopup();
    if (typeof params.willOpen === 'function') {
      params.willOpen(popup);
    }
    globalState.eventEmitter.emit('willOpen', popup);
    const bodyStyles = window.getComputedStyle(document.body);
    const initialBodyOverflow = bodyStyles.overflowY;
    addClasses(container, popup, params);

    // scrolling is 'hidden' until animation is done, after that 'auto'
    setTimeout(() => {
      setScrollingVisibility(container, popup);
    }, SHOW_CLASS_TIMEOUT);
    if (isModal()) {
      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
      setAriaHidden();
    }
    if (!isToast() && !globalState.previousActiveElement) {
      globalState.previousActiveElement = document.activeElement;
    }
    if (typeof params.didOpen === 'function') {
      setTimeout(() => params.didOpen(popup));
    }
    globalState.eventEmitter.emit('didOpen', popup);
  };

  /**
   * @param {AnimationEvent} event
   */
  const swalOpenAnimationFinished = event => {
    const popup = getPopup();
    if (event.target !== popup) {
      return;
    }
    const container = getContainer();
    popup.removeEventListener('animationend', swalOpenAnimationFinished);
    popup.removeEventListener('transitionend', swalOpenAnimationFinished);
    container.style.overflowY = 'auto';

    // no-transition is added in init() in case one swal is opened right after another
    removeClass(container, swalClasses['no-transition']);
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   */
  const setScrollingVisibility = (container, popup) => {
    if (hasCssAnimation(popup)) {
      container.style.overflowY = 'hidden';
      popup.addEventListener('animationend', swalOpenAnimationFinished);
      popup.addEventListener('transitionend', swalOpenAnimationFinished);
    } else {
      container.style.overflowY = 'auto';
    }
  };

  /**
   * @param {HTMLElement} container
   * @param {boolean} scrollbarPadding
   * @param {string} initialBodyOverflow
   */
  const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
    iOSfix();
    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
      replaceScrollbarWithPadding(initialBodyOverflow);
    }

    // sweetalert2/issues/1247
    setTimeout(() => {
      container.scrollTop = 0;
    });
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses = (container, popup, params) => {
    addClass(container, params.showClass.backdrop);
    if (params.animation) {
      // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059
      popup.style.setProperty('opacity', '0', 'important');
      show(popup, 'grid');
      setTimeout(() => {
        // Animate popup right after showing it
        addClass(popup, params.showClass.popup);
        // and remove the opacity workaround
        popup.style.removeProperty('opacity');
      }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062
    } else {
      show(popup, 'grid');
    }
    addClass([document.documentElement, document.body], swalClasses.shown);
    if (params.heightAuto && params.backdrop && !params.toast) {
      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    }
  };

  var defaultInputValidators = {
    /**
     * @param {string} string
     * @param {string} [validationMessage]
     * @returns {Promise<string | void>}
     */
    email: (string, validationMessage) => {
      return /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    },
    /**
     * @param {string} string
     * @param {string} [validationMessage]
     * @returns {Promise<string | void>}
     */
    url: (string, validationMessage) => {
      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  function setDefaultInputValidators(params) {
    // Use default `inputValidator` for supported input types if not provided
    if (params.inputValidator) {
      return;
    }
    if (params.input === 'email') {
      params.inputValidator = defaultInputValidators['email'];
    }
    if (params.input === 'url') {
      params.inputValidator = defaultInputValidators['url'];
    }
  }

  /**
   * @param {SweetAlertOptions} params
   */
  function validateCustomTargetElement(params) {
    // Determine if the custom target element is valid
    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
      warn('Target parameter is not valid, defaulting to "body"');
      params.target = 'body';
    }
  }

  /**
   * Set type, text and actions on popup
   *
   * @param {SweetAlertOptions} params
   */
  function setParameters(params) {
    setDefaultInputValidators(params);

    // showLoaderOnConfirm && preConfirm
    if (params.showLoaderOnConfirm && !params.preConfirm) {
      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    }
    validateCustomTargetElement(params);

    // Replace newlines with <br> in title
    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }
    init(params);
  }

  /** @type {SweetAlert} */
  let currentInstance;
  var _promise = /*#__PURE__*/new WeakMap();
  class SweetAlert {
    /**
     * @param {...(SweetAlertOptions | string)} args
     * @this {SweetAlert}
     */
    constructor(...args) {
      /**
       * @type {Promise<SweetAlertResult>}
       */
      _classPrivateFieldInitSpec(this, _promise, void 0);
      // Prevent run in Node env
      if (typeof window === 'undefined') {
        return;
      }
      currentInstance = this;

      // @ts-ignore
      const outerParams = Object.freeze(this.constructor.argsToParams(args));

      /** @type {Readonly<SweetAlertOptions>} */
      this.params = outerParams;

      /** @type {boolean} */
      this.isAwaitingPromise = false;
      _classPrivateFieldSet2(_promise, this, this._main(currentInstance.params));
    }
    _main(userParams, mixinParams = {}) {
      showWarningsForParams(Object.assign({}, mixinParams, userParams));
      if (globalState.currentInstance) {
        const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
        const {
          isAwaitingPromise
        } = globalState.currentInstance;
        globalState.currentInstance._destroy();
        if (!isAwaitingPromise) {
          swalPromiseResolve({
            isDismissed: true
          });
        }
        if (isModal()) {
          unsetAriaHidden();
        }
      }
      globalState.currentInstance = currentInstance;
      const innerParams = prepareParams(userParams, mixinParams);
      setParameters(innerParams);
      Object.freeze(innerParams);

      // clear the previous timer
      if (globalState.timeout) {
        globalState.timeout.stop();
        delete globalState.timeout;
      }

      // clear the restore focus timeout
      clearTimeout(globalState.restoreFocusTimeout);
      const domCache = populateDomCache(currentInstance);
      render(currentInstance, innerParams);
      privateProps.innerParams.set(currentInstance, innerParams);
      return swalPromise(currentInstance, domCache, innerParams);
    }

    // `catch` cannot be the name of a module export, so we define our thenable methods here instead
    then(onFulfilled) {
      return _classPrivateFieldGet2(_promise, this).then(onFulfilled);
    }
    finally(onFinally) {
      return _classPrivateFieldGet2(_promise, this).finally(onFinally);
    }
  }

  /**
   * @param {SweetAlert} instance
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {Promise}
   */
  const swalPromise = (instance, domCache, innerParams) => {
    return new Promise((resolve, reject) => {
      // functions to handle all closings/dismissals
      /**
       * @param {DismissReason} dismiss
       */
      const dismissWith = dismiss => {
        instance.close({
          isDismissed: true,
          dismiss,
          isConfirmed: false,
          isDenied: false
        });
      };
      privateMethods.swalPromiseResolve.set(instance, resolve);
      privateMethods.swalPromiseReject.set(instance, reject);
      domCache.confirmButton.onclick = () => {
        handleConfirmButtonClick(instance);
      };
      domCache.denyButton.onclick = () => {
        handleDenyButtonClick(instance);
      };
      domCache.cancelButton.onclick = () => {
        handleCancelButtonClick(instance, dismissWith);
      };
      domCache.closeButton.onclick = () => {
        dismissWith(DismissReason.close);
      };
      handlePopupClick(innerParams, domCache, dismissWith);
      addKeydownHandler(globalState, innerParams, dismissWith);
      handleInputOptionsAndValue(instance, innerParams);
      openPopup(innerParams);
      setupTimer(globalState, innerParams, dismissWith);
      initFocus(domCache, innerParams);

      // Scroll container to top on open (#1247, #1946)
      setTimeout(() => {
        domCache.container.scrollTop = 0;
      });
    });
  };

  /**
   * @param {SweetAlertOptions} userParams
   * @param {SweetAlertOptions} mixinParams
   * @returns {SweetAlertOptions}
   */
  const prepareParams = (userParams, mixinParams) => {
    const templateParams = getTemplateParams(userParams);
    const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131
    params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
    params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
    if (params.animation === false) {
      params.showClass = {
        backdrop: 'swal2-noanimation'
      };
      params.hideClass = {};
    }
    return params;
  };

  /**
   * @param {SweetAlert} instance
   * @returns {DomCache}
   */
  const populateDomCache = instance => {
    const domCache = {
      popup: getPopup(),
      container: getContainer(),
      actions: getActions(),
      confirmButton: getConfirmButton(),
      denyButton: getDenyButton(),
      cancelButton: getCancelButton(),
      loader: getLoader(),
      closeButton: getCloseButton(),
      validationMessage: getValidationMessage(),
      progressSteps: getProgressSteps()
    };
    privateProps.domCache.set(instance, domCache);
    return domCache;
  };

  /**
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {(dismiss: DismissReason) => void} dismissWith
   */
  const setupTimer = (globalState, innerParams, dismissWith) => {
    const timerProgressBar = getTimerProgressBar();
    hide(timerProgressBar);
    if (innerParams.timer) {
      globalState.timeout = new Timer(() => {
        dismissWith('timer');
        delete globalState.timeout;
      }, innerParams.timer);
      if (innerParams.timerProgressBar) {
        show(timerProgressBar);
        applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
        setTimeout(() => {
          if (globalState.timeout && globalState.timeout.running) {
            // timer can be already stopped or unset at this point
            animateTimerProgressBar(innerParams.timer);
          }
        });
      }
    }
  };

  /**
   * Initialize focus in the popup:
   *
   * 1. If `toast` is `true`, don't steal focus from the document.
   * 2. Else if there is an [autofocus] element, focus it.
   * 3. Else if `focusConfirm` is `true` and confirm button is visible, focus it.
   * 4. Else if `focusDeny` is `true` and deny button is visible, focus it.
   * 5. Else if `focusCancel` is `true` and cancel button is visible, focus it.
   * 6. Else focus the first focusable element in a popup (if any).
   *
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   */
  const initFocus = (domCache, innerParams) => {
    if (innerParams.toast) {
      return;
    }
    // TODO: this is dumb, remove `allowEnterKey` param in the next major version
    if (!callIfFunction(innerParams.allowEnterKey)) {
      warnAboutDeprecation('allowEnterKey');
      blurActiveElement();
      return;
    }
    if (focusAutofocus(domCache)) {
      return;
    }
    if (focusButton(domCache, innerParams)) {
      return;
    }
    setFocus(-1, 1);
  };

  /**
   * @param {DomCache} domCache
   * @returns {boolean}
   */
  const focusAutofocus = domCache => {
    const autofocusElements = Array.from(domCache.popup.querySelectorAll('[autofocus]'));
    for (const autofocusElement of autofocusElements) {
      if (autofocusElement instanceof HTMLElement && isVisible$1(autofocusElement)) {
        autofocusElement.focus();
        return true;
      }
    }
    return false;
  };

  /**
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {boolean}
   */
  const focusButton = (domCache, innerParams) => {
    if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
      domCache.denyButton.focus();
      return true;
    }
    if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
      domCache.cancelButton.focus();
      return true;
    }
    if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
      domCache.confirmButton.focus();
      return true;
    }
    return false;
  };
  const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  // Assign instance methods from src/instanceMethods/*.js to prototype
  SweetAlert.prototype.disableButtons = disableButtons;
  SweetAlert.prototype.enableButtons = enableButtons;
  SweetAlert.prototype.getInput = getInput;
  SweetAlert.prototype.disableInput = disableInput;
  SweetAlert.prototype.enableInput = enableInput;
  SweetAlert.prototype.hideLoading = hideLoading;
  SweetAlert.prototype.disableLoading = hideLoading;
  SweetAlert.prototype.showValidationMessage = showValidationMessage;
  SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
  SweetAlert.prototype.close = close;
  SweetAlert.prototype.closePopup = close;
  SweetAlert.prototype.closeModal = close;
  SweetAlert.prototype.closeToast = close;
  SweetAlert.prototype.rejectPromise = rejectPromise;
  SweetAlert.prototype.update = update;
  SweetAlert.prototype._destroy = _destroy;

  // Assign static methods from src/staticMethods/*.js to constructor
  Object.assign(SweetAlert, staticMethods);

  // Proxy to instance methods to constructor, for now, for backwards compatibility
  Object.keys(instanceMethods).forEach(key => {
    /**
     * @param {...(SweetAlertOptions | string | undefined)} args
     * @returns {SweetAlertResult | Promise<SweetAlertResult> | undefined}
     */
    SweetAlert[key] = function (...args) {
      if (currentInstance && currentInstance[key]) {
        return currentInstance[key](...args);
      }
      return null;
    };
  });
  SweetAlert.DismissReason = DismissReason;
  SweetAlert.version = '11.26.3';

  const Swal = SweetAlert;
  // @ts-ignore
  Swal.default = Swal;

  return Swal;

}));
if (typeof this !== 'undefined' && this.Sweetalert2){this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2}
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,":root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-icon-animations: true;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem;container-name:swal2-popup}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:all}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}@container swal2-popup style(--swal2-icon-animations:true){.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}");

/***/ }),

/***/ "./src/actions/coletar-sangue-state.ts":
/*!*********************************************!*\
  !*** ./src/actions/coletar-sangue-state.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   estaColetando: () => (/* binding */ estaColetando),
/* harmony export */   formatarTempoRestante: () => (/* binding */ formatarTempoRestante),
/* harmony export */   getProximaColetaTimestamp: () => (/* binding */ getProximaColetaTimestamp),
/* harmony export */   getTempoRestante: () => (/* binding */ getTempoRestante),
/* harmony export */   iniciarColetaAutomatica: () => (/* binding */ iniciarColetaAutomatica),
/* harmony export */   pararColetaAutomatica: () => (/* binding */ pararColetaAutomatica),
/* harmony export */   setCallbackAtualizacaoUI: () => (/* binding */ setCallbackAtualizacaoUI),
/* harmony export */   setCallbackStatus: () => (/* binding */ setCallbackStatus)
/* harmony export */ });
/**
 * Estado e controle da coleta automática de sangue
 */
let coletandoAutomaticamente = false;
let intervaloColeta = null;
let proximaColetaTimestamp = null;
let callbackAtualizacaoUI = null;
let callbackStatus = null;
const INTERVALO_COLETA_MS = 10 * 60 * 1000 + 2 * 1000; // 10 minutos e 2 segundos
/**
 * Obtém se está coletando automaticamente
 */
function estaColetando() {
    return coletandoAutomaticamente;
}
/**
 * Obtém o timestamp da próxima coleta
 */
function getProximaColetaTimestamp() {
    return proximaColetaTimestamp;
}
/**
 * Obtém o tempo restante até a próxima coleta em milissegundos
 */
function getTempoRestante() {
    if (!proximaColetaTimestamp)
        return 0;
    const agora = Date.now();
    const restante = proximaColetaTimestamp - agora;
    return Math.max(0, restante);
}
/**
 * Define o callback para atualizar a UI do timer
 */
function setCallbackAtualizacaoUI(callback) {
    callbackAtualizacaoUI = callback;
}
/**
 * Define o callback para atualizar o status (botão, etc)
 */
function setCallbackStatus(callback) {
    callbackStatus = callback;
}
/**
 * Inicia o intervalo de atualização do timer (chama o callback a cada segundo)
 */
let intervaloAtualizacaoTimer = null;
function iniciarAtualizacaoTimer() {
    if (intervaloAtualizacaoTimer) {
        clearInterval(intervaloAtualizacaoTimer);
    }
    intervaloAtualizacaoTimer = window.setInterval(() => {
        if (callbackAtualizacaoUI && coletandoAutomaticamente) {
            const tempoRestante = getTempoRestante();
            callbackAtualizacaoUI(tempoRestante);
            // Se o tempo acabou, para o intervalo
            if (tempoRestante <= 0) {
                if (intervaloAtualizacaoTimer) {
                    clearInterval(intervaloAtualizacaoTimer);
                    intervaloAtualizacaoTimer = null;
                }
            }
        }
    }, 1000); // Atualizar a cada segundo
}
function pararAtualizacaoTimer() {
    if (intervaloAtualizacaoTimer) {
        clearInterval(intervaloAtualizacaoTimer);
        intervaloAtualizacaoTimer = null;
    }
}
/**
 * Inicia a coleta automática
 */
function iniciarColetaAutomatica(funcaoColeta) {
    if (coletandoAutomaticamente) {
        console.warn('⚠️ Coleta automática já está ativa');
        return;
    }
    coletandoAutomaticamente = true;
    proximaColetaTimestamp = Date.now() + INTERVALO_COLETA_MS;
    // Notificar mudança de status
    if (callbackStatus) {
        callbackStatus(true);
    }
    // Iniciar atualização do timer
    iniciarAtualizacaoTimer();
    // Executar primeira coleta imediatamente
    funcaoColeta().catch((error) => {
        console.error('❌ Erro na coleta automática:', error);
    });
    // Definir próximo timestamp após a primeira coleta
    proximaColetaTimestamp = Date.now() + INTERVALO_COLETA_MS;
    // Criar intervalo para coletas subsequentes
    intervaloColeta = window.setInterval(async () => {
        if (!coletandoAutomaticamente)
            return;
        try {
            await funcaoColeta();
            proximaColetaTimestamp = Date.now() + INTERVALO_COLETA_MS;
            // Reiniciar atualização do timer
            iniciarAtualizacaoTimer();
        }
        catch (error) {
            console.error('❌ Erro na coleta automática:', error);
            // Continuar mesmo em caso de erro
            proximaColetaTimestamp = Date.now() + INTERVALO_COLETA_MS;
            iniciarAtualizacaoTimer();
        }
    }, INTERVALO_COLETA_MS);
    console.log('✅ Coleta automática iniciada. Próxima coleta em:', new Date(proximaColetaTimestamp).toLocaleTimeString());
}
/**
 * Para a coleta automática
 */
function pararColetaAutomatica() {
    if (!coletandoAutomaticamente) {
        console.warn('⚠️ Coleta automática já está parada');
        return;
    }
    coletandoAutomaticamente = false;
    proximaColetaTimestamp = null;
    if (intervaloColeta) {
        clearInterval(intervaloColeta);
        intervaloColeta = null;
    }
    pararAtualizacaoTimer();
    // Notificar mudança de status
    if (callbackStatus) {
        callbackStatus(false);
    }
    console.log('⏹️ Coleta automática parada');
}
/**
 * Formata o tempo restante em formato legível (MM:SS)
 */
function formatarTempoRestante(tempoMs) {
    const totalSegundos = Math.floor(tempoMs / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}


/***/ }),

/***/ "./src/actions/coletar-sangue.ts":
/*!***************************************!*\
  !*** ./src/actions/coletar-sangue.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   coletarSangue: () => (/* binding */ coletarSangue),
/* harmony export */   iniciarColetaAutomaticaSangue: () => (/* binding */ iniciarColetaAutomaticaSangue),
/* harmony export */   obterTipoSanguineo: () => (/* binding */ obterTipoSanguineo),
/* harmony export */   pararColetaAutomaticaSangue: () => (/* binding */ pararColetaAutomaticaSangue),
/* harmony export */   podeDoarSangue: () => (/* binding */ podeDoarSangue)
/* harmony export */ });
/* harmony import */ var _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/sweetalert */ "./src/utils/sweetalert.ts");
/* harmony import */ var _utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/character-id-extractor */ "./src/utils/character-id-extractor.ts");
/* harmony import */ var _utils_webforms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/webforms */ "./src/utils/webforms.ts");
/* harmony import */ var _utils_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/selectors */ "./src/utils/selectors.ts");
/* harmony import */ var _coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./coletar-sangue-state */ "./src/actions/coletar-sangue-state.ts");
/**
 * Ações de coleta de sangue do PopSUS
 */





/**
 * Executa a ação de coletar sangue de um personagem
 * Usa a mesma lógica que curarPersonagem, chamando usarItemAposBuscar
 */
async function coletarSangue() {
    const characterId = (0,_utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_1__.getCharacterId)();
    if (!characterId) {
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.error('Erro', 'Não foi possível identificar o personagem.');
        return;
    }
    console.log(`🩸 Iniciando coleta de sangue do personagem ${characterId}...`);
    try {
        // Usar o "Coletor de sangue" na página de interação
        const response = await (0,_utils_webforms__WEBPACK_IMPORTED_MODULE_2__.usarItemAposBuscar)(_utils_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].textColetorSangue, characterId);
        if (response.status === 302 || response.status === 0) {
            // Sucesso!
            console.log(`✅ Sangue do personagem ${characterId} coletado com sucesso!`);
        }
        else {
            throw new Error(`Resposta inesperada: ${response.status}`);
        }
    }
    catch (error) {
        console.error('Erro ao coletar sangue:', error);
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.error('Erro', 'Não foi possível coletar o sangue. Tente novamente.');
        throw error;
    }
}
/**
 * Inicia a coleta automática de sangue (a cada 10 minutos e 2 segundos)
 */
function iniciarColetaAutomaticaSangue() {
    if ((0,_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.estaColetando)()) {
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.warning('Aviso', 'A coleta automática já está ativa.');
        return;
    }
    (0,_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.iniciarColetaAutomatica)(coletarSangue);
    _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.toastSuccess('Coleta automática iniciada! Coletando a cada 10 minutos e 2 segundos.');
}
/**
 * Para a coleta automática de sangue
 */
function pararColetaAutomaticaSangue() {
    if (!(0,_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.estaColetando)()) {
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.warning('Aviso', 'A coleta automática já está parada.');
        return;
    }
    _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.confirm('Parar Coleta Automática', 'Se você parar agora, o script perderá a referência de tempo de cooldown do item. Deseja continuar?', 'Sim, parar', 'Cancelar').then((result) => {
        if (result.isConfirmed) {
            (0,_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.pararColetaAutomatica)();
            _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.toastInfo('Coleta automática parada.');
        }
    });
}
/**
 * Verifica se o personagem pode doar sangue
 */
function podeDoarSangue() {
    // TODO: Implementar verificação real
    // Exemplo: verificar condições para doação de sangue
    return true;
}
/**
 * Obtém o tipo sanguíneo do personagem
 */
function obterTipoSanguineo() {
    // TODO: Implementar extração do tipo sanguíneo
    return null;
}


/***/ }),

/***/ "./src/actions/curar.ts":
/*!******************************!*\
  !*** ./src/actions/curar.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   curarPersonagem: () => (/* binding */ curarPersonagem),
/* harmony export */   obterTipoDoenca: () => (/* binding */ obterTipoDoenca),
/* harmony export */   personagemEstadoente: () => (/* binding */ personagemEstadoente),
/* harmony export */   usarTuboSanguineo: () => (/* binding */ usarTuboSanguineo)
/* harmony export */ });
/* harmony import */ var _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/sweetalert */ "./src/utils/sweetalert.ts");
/* harmony import */ var _utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/character-id-extractor */ "./src/utils/character-id-extractor.ts");
/* harmony import */ var _utils_webforms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/webforms */ "./src/utils/webforms.ts");
/* harmony import */ var _utils_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/selectors */ "./src/utils/selectors.ts");
/**
 * Ações de cura do PopSUS
 */




/**
 * Executa a ação de curar um personagem
 */
async function curarPersonagem() {
    const characterId = (0,_utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_1__.getCharacterId)();
    if (!characterId) {
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.error('Erro', 'Não foi possível identificar o personagem.');
        return;
    }
    console.log(`🏥 Iniciando cura do personagem ${characterId}...`);
    try {
        // 1. Fazer GET na página de interação
        // 2. Extrair campos WebForms do HTML retornado
        // 3. Buscar o item "Dentes feios falsos"
        // 4. Usar o item via WebForms
        const response = await (0,_utils_webforms__WEBPACK_IMPORTED_MODULE_2__.usarItemAposBuscar)(_utils_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].textColetorSangue, characterId);
        if (response.status === 302 || response.status === 0) {
            // Sucesso!
            //espera 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000));
            await usarTuboSanguineo();
            console.log(`✅ Personagem ${characterId} curado com sucesso!`);
        }
        else {
            throw new Error(`Resposta inesperada: ${response.status}`);
        }
    }
    catch (error) {
        console.error('Erro ao curar personagem:', error);
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.error('Erro', 'Não foi possível curar o personagem. Tente novamente.');
        throw error;
    }
}
/**
 * Usa o item "Tubo sanguíneo" do inventário
 */
async function usarTuboSanguineo() {
    const characterId = (0,_utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_1__.getCharacterId)();
    if (!characterId) {
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.error('Erro', 'Não foi possível identificar o personagem.');
        return;
    }
    try {
        console.log('🔍 Buscando página de inventário...');
        // 1. Buscar página de inventário
        const response = await (0,_utils_webforms__WEBPACK_IMPORTED_MODULE_2__.fetchPaginaInventario)();
        if (!response.ok) {
            throw new Error(`Erro ao buscar página de inventário: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        // 2. Buscar a linha da tabela que contém "Tubo sanguíneo"
        const linhaItem = (0,_utils_webforms__WEBPACK_IMPORTED_MODULE_2__.buscarLinhaItemInventario)(html, _utils_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].textTuboSanguineo);
        if (!linhaItem) {
            throw new Error(`Item "${_utils_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].textTuboSanguineo}" não encontrado no inventário`);
        }
        if (!linhaItem.btnUse) {
            throw new Error(`Botão "Usar" não encontrado para o item "${_utils_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].textTuboSanguineo}"`);
        }
        console.log('✅ Item encontrado no inventário:', {
            nome: _utils_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].textTuboSanguineo,
            itemId: linhaItem.itemId,
            temBotaoUsar: !!linhaItem.btnUse,
            nomeBotao: linhaItem.btnUse.name,
        });
        // 3. Usar o item do inventário clicando no botão
        console.log('🩸 Usando tubo sanguíneo do inventário...');
        const useResponse = await (0,_utils_webforms__WEBPACK_IMPORTED_MODULE_2__.usarItemDoInventario)(html, _utils_selectors__WEBPACK_IMPORTED_MODULE_3__["default"].textTuboSanguineo);
        // Verificar resposta
        if (useResponse.status === 302 || useResponse.status === 0 || useResponse.status === 200) {
            console.log('✅ Tubo sanguíneo usado com sucesso!');
            _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.toastSuccess('Tubo sanguíneo usado com sucesso!');
        }
        else {
            throw new Error(`Erro ao usar tubo sanguíneo: ${useResponse.status} ${useResponse.statusText}`);
        }
    }
    catch (error) {
        console.error('❌ Erro ao usar tubo sanguíneo:', error);
        _utils_sweetalert__WEBPACK_IMPORTED_MODULE_0__.Alert.error('Erro', `Não foi possível usar o tubo sanguíneo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        throw error;
    }
}
/**
 * Verifica se o personagem está doente
 */
function personagemEstadoente() {
    // TODO: Implementar verificação real
    // Exemplo: verificar elemento na página que indica doença
    return false;
}
/**
 * Obtém o tipo de doença do personagem
 */
function obterTipoDoenca() {
    // TODO: Implementar extração do tipo de doença
    return null;
}


/***/ }),

/***/ "./src/components/Button.ts":
/*!**********************************!*\
  !*** ./src/components/Button.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _core_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/component */ "./src/core/component.ts");
/* harmony import */ var _utils_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/styles */ "./src/utils/styles.ts");
/**
 * Componente Button
 *
 * Exemplo de componente estilizado usando Goober
 */


// Classes base do botão
const buttonBaseClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border: none;
  border-radius: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.transitions.fast};
  font-family: inherit;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: 2px solid ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.primary};
    outline-offset: 2px;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;
// Tamanhos
const buttonSmClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.xs} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.sm};
  font-size: 12px;
`;
const buttonMdClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.sm} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.md};
  font-size: 14px;
`;
const buttonLgClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.md} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.lg};
  font-size: 16px;
`;
// Variantes
const buttonPrimaryClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background-color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.primary};
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  
  &:hover:not(:disabled) {
    background-color: #2563eb;
    box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.md};
  }
`;
const buttonSecondaryClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background-color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.secondary};
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  
  &:hover:not(:disabled) {
    background-color: #475569;
    box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.md};
  }
`;
const buttonSuccessClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background-color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.success};
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  
  &:hover:not(:disabled) {
    background-color: #059669;
    box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.md};
  }
`;
const buttonDangerClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background-color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.danger};
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  
  &:hover:not(:disabled) {
    background-color: #dc2626;
    box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.md};
  }
`;
const buttonWarningClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background-color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.warning};
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  
  &:hover:not(:disabled) {
    background-color: #d97706;
    box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.md};
  }
`;
class Button extends _core_component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor() {
        super(...arguments);
        this.originalText = '';
    }
    createElement() {
        const { text = 'Button', variant = 'primary', size = 'md', disabled = false, loading = false, } = this.options;
        const sizeClass = {
            sm: buttonSmClass,
            md: buttonMdClass,
            lg: buttonLgClass,
        }[size];
        const variantClass = {
            primary: buttonPrimaryClass,
            secondary: buttonSecondaryClass,
            success: buttonSuccessClass,
            danger: buttonDangerClass,
            warning: buttonWarningClass,
        }[variant];
        const button = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('button', `${buttonBaseClass} ${sizeClass} ${variantClass}`);
        this.originalText = text;
        button.textContent = text;
        button.disabled = disabled;
        // Aplicar estado de loading se necessário
        if (loading) {
            this.applyLoadingState(true);
        }
        return button;
    }
    onMount() {
        if (this.options.onClick) {
            this.clickHandler = this.options.onClick.bind(this);
            this.element.addEventListener('click', this.clickHandler);
        }
        // Observar mudanças na opção loading usando um setter reativo
        this.setupLoadingReactive();
    }
    /**
     * Configura reatividade para a opção loading
     * Usa Object.defineProperty para detectar mudanças
     */
    setupLoadingReactive() {
        const self = this;
        let currentLoading = this.options.loading || false;
        // Criar propriedade reativa
        Object.defineProperty(this.options, 'loading', {
            get() {
                return currentLoading;
            },
            set(value) {
                if (currentLoading !== value) {
                    currentLoading = value;
                    self.applyLoadingState(value);
                }
            },
            enumerable: true,
            configurable: true,
        });
        // Aplicar estado inicial se necessário
        if (currentLoading) {
            this.applyLoadingState(true);
        }
    }
    onUnmount() {
        if (this.clickHandler) {
            this.element.removeEventListener('click', this.clickHandler);
        }
    }
    /**
     * Atualiza o texto do botão
     */
    setText(text) {
        this.originalText = text;
        // Se não estiver em loading, atualizar o texto imediatamente
        if (!this.isLoading()) {
            this.element.textContent = text;
        }
        return this;
    }
    /**
     * Habilita o botão
     */
    enable() {
        this.element.disabled = false;
        return this;
    }
    /**
     * Desabilita o botão
     */
    disable() {
        this.element.disabled = true;
        return this;
    }
    /**
     * Aplica o estado de loading visualmente
     */
    applyLoadingState(loading) {
        const button = this.element;
        if (loading) {
            // Salvar texto original se ainda não foi salvo
            if (!this.originalText && button.textContent) {
                this.originalText = button.textContent.trim();
            }
            button.setAttribute('data-loading', 'true');
            button.disabled = true;
            // Adicionar spinner e texto "Aguarde..."
            button.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 16px; height: 16px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
        </svg>
        <span>Aguarde...</span>
        <style>
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        </style>
      `;
        }
        else {
            button.removeAttribute('data-loading');
            button.disabled = false;
            // Limpar completamente o conteúdo e restaurar texto original
            button.innerHTML = '';
            button.textContent = this.originalText || 'Button';
        }
    }
    /**
     * Define o estado de loading (atualiza a opção e o estado visual)
     */
    setLoading(loading) {
        this.options.loading = loading;
        this.applyLoadingState(loading);
        return this;
    }
    /**
     * Obtém o estado de loading
     */
    isLoading() {
        return this.options.loading === true;
    }
    /**
     * Define a variante do botão
     */
    setVariant(variant) {
        this.options.variant = variant;
        // Recriar o elemento com a nova variante
        const currentText = this.originalText || this.element.textContent || '';
        const currentDisabled = this.element.disabled;
        const currentLoading = this.isLoading();
        const size = this.options.size || 'md';
        const sizeClass = {
            sm: buttonSmClass,
            md: buttonMdClass,
            lg: buttonLgClass,
        }[size];
        const variantClass = {
            primary: buttonPrimaryClass,
            secondary: buttonSecondaryClass,
            success: buttonSuccessClass,
            danger: buttonDangerClass,
            warning: buttonWarningClass,
        }[variant];
        const newButton = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('button', `${buttonBaseClass} ${sizeClass} ${variantClass}`);
        // Copiar propriedades
        newButton.textContent = currentText;
        newButton.disabled = currentDisabled;
        // Copiar event listeners
        if (this.clickHandler) {
            newButton.addEventListener('click', this.clickHandler);
        }
        // Substituir elemento
        const parent = this.element.parentNode;
        if (parent) {
            parent.replaceChild(newButton, this.element);
        }
        this.element = newButton;
        this.originalText = currentText;
        // Aplicar loading se necessário
        if (currentLoading) {
            this.applyLoadingState(true);
        }
        return this;
    }
}


/***/ }),

/***/ "./src/components/Card.ts":
/*!********************************!*\
  !*** ./src/components/Card.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Card: () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var _core_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/component */ "./src/core/component.ts");
/* harmony import */ var _utils_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/styles */ "./src/utils/styles.ts");
/**
 * Componente Card
 *
 * Container estilizado para agrupar conteúdo
 */


const cardBaseClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  border-radius: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.lg};
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.transitions.normal};
`;
const cardElevatedClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.lg};
  
  &:hover {
    box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.xl};
    transform: translateY(-2px);
  }
`;
const cardHeaderClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.md} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.lg};
  border-bottom: 1px solid #e2e8f0;
  background: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.light};
`;
const cardTitleClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.dark};
`;
const cardBodyClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.md};
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.dark};
`;
const cardBodySmClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.sm};
`;
const cardBodyLgClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.lg};
`;
const cardBodyNoneClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: 0;
`;
const cardFooterClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.md} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.lg};
  border-top: 1px solid #e2e8f0;
  background: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.light};
`;
class Card extends _core_component__WEBPACK_IMPORTED_MODULE_0__.Component {
    createElement() {
        const { elevated = false, padding = 'md', title, content, footer } = this.options;
        const card = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', `${cardBaseClass} ${elevated ? cardElevatedClass : ''}`);
        // Header (se tiver título)
        if (title) {
            const headerEl = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', cardHeaderClass);
            const titleEl = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('h3', cardTitleClass);
            titleEl.textContent = title;
            headerEl.appendChild(titleEl);
            card.appendChild(headerEl);
            this.headerElement = headerEl;
        }
        // Body
        const paddingClass = {
            none: cardBodyNoneClass,
            sm: cardBodySmClass,
            md: '',
            lg: cardBodyLgClass,
        }[padding] || '';
        this.bodyElement = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', `${cardBodyClass} ${paddingClass}`);
        if (content) {
            if (typeof content === 'string') {
                this.bodyElement.innerHTML = content;
            }
            else {
                this.bodyElement.appendChild(content);
            }
        }
        card.appendChild(this.bodyElement);
        // Footer (se fornecido)
        if (footer) {
            const footerEl = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', cardFooterClass);
            if (typeof footer === 'string') {
                footerEl.innerHTML = footer;
            }
            else {
                footerEl.appendChild(footer);
            }
            card.appendChild(footerEl);
            this.footerElement = footerEl;
        }
        return card;
    }
    /**
     * Atualiza o título do card
     */
    setTitle(title) {
        if (!this.headerElement) {
            const headerEl = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', cardHeaderClass);
            const titleEl = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('h3', cardTitleClass);
            titleEl.textContent = title;
            headerEl.appendChild(titleEl);
            this.element.insertBefore(headerEl, this.bodyElement);
            this.headerElement = headerEl;
        }
        else {
            const titleEl = this.headerElement.querySelector('h3');
            if (titleEl)
                titleEl.textContent = title;
        }
        return this;
    }
    /**
     * Atualiza o conteúdo do body
     */
    setBody(content) {
        if (typeof content === 'string') {
            this.bodyElement.innerHTML = content;
        }
        else {
            this.bodyElement.innerHTML = '';
            this.bodyElement.appendChild(content);
        }
        return this;
    }
    /**
     * Atualiza o footer
     */
    setFooter(footer) {
        if (!this.footerElement) {
            const newFooter = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', cardFooterClass);
            this.element.appendChild(newFooter);
            this.footerElement = newFooter;
        }
        // Non-null assertion: garantido que footerElement existe após o if acima
        const footerElement = this.footerElement;
        if (typeof footer === 'string') {
            footerElement.innerHTML = footer;
        }
        else {
            footerElement.innerHTML = '';
            footerElement.appendChild(footer);
        }
        return this;
    }
    /**
     * Remove o footer
     */
    removeFooter() {
        if (this.footerElement) {
            this.footerElement.remove();
            this.footerElement = undefined;
        }
        return this;
    }
    /**
     * Retorna o elemento body para manipulação direta
     */
    getBody() {
        return this.bodyElement;
    }
}


/***/ }),

/***/ "./src/components/Modal.ts":
/*!*********************************!*\
  !*** ./src/components/Modal.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Modal: () => (/* binding */ Modal)
/* harmony export */ });
/* harmony import */ var _core_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/component */ "./src/core/component.ts");
/* harmony import */ var _utils_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/styles */ "./src/utils/styles.ts");
/**
 * Modal Principal do PopSUS
 *
 * Modal customizado que permite adicionar componentes no body
 */


// Overlay (backdrop)
const overlayClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.zIndex.modal};
  opacity: 0;
  transition: opacity ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.transitions.normal};
  
  &.active {
    display: flex;
    opacity: 1;
  }
`;
// Modal content
const modalContentClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background-color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  border-radius: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.lg};
  box-shadow: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.shadows.xl};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  transform: scale(0.7);
  transition: transform ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.transitions.normal};
  
  .active & {
    transform: scale(1);
  }
`;
// Header
const modalHeaderClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.lg};
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.primary} 0%, #2563eb 100%);
  border-radius: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.lg} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.lg} 0 0;
`;
const modalTitleClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  display: flex;
  align-items: center;
  gap: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.sm};
`;
const closeButtonClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  background: none;
  border: none;
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.white};
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.sm};
  transition: all ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.transitions.fast};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
  
  &:active {
    transform: rotate(90deg) scale(0.95);
  }
`;
// Body
const modalBodyClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.lg};
  flex: 1;
  overflow-y: auto;
`;
// Footer
const modalFooterClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.lg};
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.md};
  justify-content: flex-end;
  background-color: #f9fafb;
  border-radius: 0 0 ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.lg} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.lg};
`;
class Modal extends _core_component__WEBPACK_IMPORTED_MODULE_0__.Component {
    createElement() {
        const { title, showCloseButton = true, closeOnBackdrop = true, width, } = this.options;
        // Criar overlay
        this.overlayElement = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', overlayClass);
        // Criar modal content
        this.modalContentElement = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', modalContentClass);
        if (width) {
            this.modalContentElement.style.maxWidth = width;
        }
        // Header
        if (title || showCloseButton) {
            this.headerElement = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', modalHeaderClass);
            if (title) {
                const titleEl = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('h2', modalTitleClass);
                titleEl.innerHTML = title;
                this.headerElement.appendChild(titleEl);
            }
            if (showCloseButton) {
                const closeBtn = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('button', closeButtonClass);
                closeBtn.innerHTML = '&times;';
                closeBtn.addEventListener('click', () => this.close());
                this.headerElement.appendChild(closeBtn);
            }
            this.modalContentElement.appendChild(this.headerElement);
        }
        // Body
        this.bodyElement = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', modalBodyClass);
        this.modalContentElement.appendChild(this.bodyElement);
        // Adicionar modal content ao overlay
        this.overlayElement.appendChild(this.modalContentElement);
        // Fechar ao clicar no backdrop
        if (closeOnBackdrop) {
            this.backdropClickHandler = (event) => {
                if (event.target === this.overlayElement) {
                    this.close();
                }
            };
            this.overlayElement.addEventListener('click', this.backdropClickHandler);
        }
        return this.overlayElement;
    }
    onMount() {
        // ESC para fechar
        if (this.options.closeOnEsc !== false) {
            this.escHandler = (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this.escHandler);
        }
    }
    onUnmount() {
        if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
        }
        if (this.backdropClickHandler) {
            this.overlayElement.removeEventListener('click', this.backdropClickHandler);
        }
    }
    /**
     * Abre o modal
     */
    open() {
        this.overlayElement.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll do body
        return this;
    }
    /**
     * Fecha o modal
     */
    close() {
        this.overlayElement.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll do body
        if (this.options.onClose) {
            this.options.onClose();
        }
        return this;
    }
    /**
     * Verifica se o modal está aberto
     */
    isOpen() {
        return this.overlayElement.classList.contains('active');
    }
    /**
     * Toggle do modal
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
        return this;
    }
    /**
     * Define o título do modal
     */
    setTitle(title) {
        if (this.headerElement) {
            const titleEl = this.headerElement.querySelector('h2');
            if (titleEl) {
                titleEl.innerHTML = title;
            }
        }
        return this;
    }
    /**
     * Adiciona conteúdo ao body (pode ser string HTML ou Component)
     */
    setBody(content) {
        this.bodyElement.innerHTML = '';
        if (typeof content === 'string') {
            this.bodyElement.innerHTML = content;
        }
        else if (content instanceof _core_component__WEBPACK_IMPORTED_MODULE_0__.Component) {
            content.mount(this.bodyElement);
        }
        else {
            this.bodyElement.appendChild(content);
        }
        return this;
    }
    /**
     * Adiciona um componente ao body (sem limpar o conteúdo anterior)
     */
    appendToBody(content) {
        if (content instanceof _core_component__WEBPACK_IMPORTED_MODULE_0__.Component) {
            content.mount(this.bodyElement);
        }
        else {
            this.bodyElement.appendChild(content);
        }
        return this;
    }
    /**
     * Limpa o body
     */
    clearBody() {
        this.bodyElement.innerHTML = '';
        return this;
    }
    /**
     * Define o footer com botões
     */
    setFooter(buttons) {
        // Criar footer se não existir
        if (!this.footerElement) {
            this.footerElement = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('div', modalFooterClass);
            this.modalContentElement.appendChild(this.footerElement);
        }
        // Limpar e adicionar botões
        this.footerElement.innerHTML = '';
        buttons.forEach(button => {
            this.footerElement.appendChild(button);
        });
        return this;
    }
    /**
     * Remove o footer
     */
    removeFooter() {
        if (this.footerElement) {
            this.footerElement.remove();
            this.footerElement = undefined;
        }
        return this;
    }
    /**
     * Obtém o elemento do body para manipulação direta
     */
    getBody() {
        return this.bodyElement;
    }
    /**
     * Obtém o elemento do footer para manipulação direta
     */
    getFooter() {
        return this.footerElement;
    }
}


/***/ }),

/***/ "./src/components/ModalPopSUS.ts":
/*!***************************************!*\
  !*** ./src/components/ModalPopSUS.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopSUSModal: () => (/* binding */ createPopSUSModal),
/* harmony export */   showPopSUSModal: () => (/* binding */ showPopSUSModal)
/* harmony export */ });
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Modal */ "./src/components/Modal.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button */ "./src/components/Button.ts");
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Card */ "./src/components/Card.ts");
/* harmony import */ var _utils_sweetalert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/sweetalert */ "./src/utils/sweetalert.ts");
/* harmony import */ var _actions_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../actions/coletar-sangue-state */ "./src/actions/coletar-sangue-state.ts");
/* harmony import */ var _actions_coletar_sangue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../actions/coletar-sangue */ "./src/actions/coletar-sangue.ts");
/**
 * Modal Principal do PopSUS
 *
 * Factory function para criar o modal principal da aplicação
 */






/**
 * Cria e retorna o modal principal do PopSUS
 */
function createPopSUSModal(callbacks) {
    const modal = new _Modal__WEBPACK_IMPORTED_MODULE_0__.Modal({
        title: '🏥 PopSUS',
        showCloseButton: true,
        closeOnBackdrop: true,
        closeOnEsc: true,
        width: '600px',
    });
    // Criar card de descrição
    const descriptionCard = new _Card__WEBPACK_IMPORTED_MODULE_2__.Card({
        padding: 'md',
        elevated: false,
    });
    const descriptionHTML = `
    <div style="text-align: left;">
      
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px; color: #374151;">
        O <strong>PopSUS</strong> é um script criado para facilitar a <strong>cura de personagens doentes</strong> 
        no Popmundo e auxiliar na <strong>coleta de sangue</strong> para os caçadores de zumbi.
      </p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
        Selecione uma das opções abaixo:
      </p>
      <img src="https://i.imgur.com/L2wsYMe.png" alt="PopSUS" style="width: 90px; height: auto; margin-bottom: 16px;">
    </div>
  `;
    descriptionCard.setBody(descriptionHTML);
    // Criar container para timer de coleta automática
    const timerContainer = document.createElement('div');
    timerContainer.id = 'popsus-timer-container';
    timerContainer.style.cssText = `
    margin-top: 16px;
    padding: 12px;
    background-color: #f3f4f6;
    border-radius: 8px;
    text-align: center;
    display: none;
  `;
    const timerText = document.createElement('div');
    timerText.id = 'popsus-timer-text';
    timerText.style.cssText = `
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
  `;
    timerText.textContent = 'Próxima coleta em:';
    const timerValue = document.createElement('div');
    timerValue.id = 'popsus-timer-value';
    timerValue.style.cssText = `
    font-size: 20px;
    font-weight: bold;
    color: #dc2626;
    font-family: 'Courier New', monospace;
  `;
    timerValue.textContent = '00:00';
    timerContainer.appendChild(timerText);
    timerContainer.appendChild(timerValue);
    // Adicionar timer ao card de descrição
    descriptionCard.getElement().appendChild(timerContainer);
    // Adicionar card ao modal
    modal.setBody(descriptionCard);
    // Criar botões primeiro (antes de usar nos callbacks)
    const curarButton = new _Button__WEBPACK_IMPORTED_MODULE_1__.Button({
        text: '💉 Curar',
        variant: 'success',
        size: 'md',
        onClick: async () => {
            if (callbacks?.onCurar) {
                curarButton.setLoading(true);
                try {
                    await callbacks.onCurar();
                    _utils_sweetalert__WEBPACK_IMPORTED_MODULE_3__.Alert.toastSuccess('Personagem curado com sucesso!');
                }
                catch (error) {
                    console.error('Erro ao curar:', error);
                    // O erro já é tratado dentro da função curarPersonagem
                }
                finally {
                    curarButton.setLoading(false);
                }
            }
        },
    });
    const coletarButton = new _Button__WEBPACK_IMPORTED_MODULE_1__.Button({
        text: '🩸 Coletar Sangue',
        variant: 'danger',
        size: 'md',
        onClick: async () => {
            if ((0,_actions_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.estaColetando)()) {
                // Se já está coletando, parar
                (0,_actions_coletar_sangue__WEBPACK_IMPORTED_MODULE_5__.pararColetaAutomaticaSangue)();
            }
            else {
                // Se não está coletando, iniciar coleta automática
                (0,_actions_coletar_sangue__WEBPACK_IMPORTED_MODULE_5__.iniciarColetaAutomaticaSangue)();
                // Atualizar UI imediatamente
                atualizarStatusBotao(true);
            }
        },
    });
    // Função para atualizar o timer
    const atualizarTimer = (tempoRestante) => {
        if ((0,_actions_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.estaColetando)()) {
            timerContainer.style.display = 'block';
            timerValue.textContent = (0,_actions_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.formatarTempoRestante)(tempoRestante);
        }
        else {
            timerContainer.style.display = 'none';
        }
    };
    // Função para atualizar o status do botão
    const atualizarStatusBotao = (coletando) => {
        if (coletando) {
            coletarButton.setText('⏸️ Parar Coleta');
            coletarButton.setVariant('warning');
        }
        else {
            coletarButton.setText('🩸 Coletar Sangue');
            coletarButton.setVariant('danger');
            timerContainer.style.display = 'none';
        }
    };
    // Registrar callbacks
    (0,_actions_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.setCallbackAtualizacaoUI)(atualizarTimer);
    (0,_actions_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.setCallbackStatus)(atualizarStatusBotao);
    // Verificar estado inicial
    if ((0,_actions_coletar_sangue_state__WEBPACK_IMPORTED_MODULE_4__.estaColetando)()) {
        atualizarStatusBotao(true);
        atualizarTimer(0);
    }
    // Montar os botões antes de adicionar ao footer para garantir que os event listeners sejam registrados
    // Criar um container temporário para montar os botões
    const tempContainer = document.createElement('div');
    tempContainer.style.display = 'none';
    document.body.appendChild(tempContainer);
    curarButton.mount(tempContainer);
    coletarButton.mount(tempContainer);
    // Adicionar botões ao footer
    modal.setFooter([
        curarButton.getElement(),
        coletarButton.getElement(),
    ]);
    // Remover container temporário (os elementos já foram movidos para o footer)
    tempContainer.remove();
    return modal;
}
/**
 * Mostra o modal principal do PopSUS
 */
function showPopSUSModal(callbacks) {
    const modal = createPopSUSModal(callbacks);
    // Montar no body do documento (fora do Shadow DOM para cobrir toda a página)
    modal.mount(document.body);
    // Abrir o modal
    modal.open();
    return modal;
}


/***/ }),

/***/ "./src/components/PopSUS.ts":
/*!**********************************!*\
  !*** ./src/components/PopSUS.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopSUS: () => (/* binding */ PopSUS)
/* harmony export */ });
/* harmony import */ var _core_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/component */ "./src/core/component.ts");
/* harmony import */ var _utils_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/styles */ "./src/utils/styles.ts");
/**
 * Componente PopSUS
 *
 * Link simples que abre um modal quando clicado
 */


const linkClass = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.css) `
  display: inline-block;
  color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  padding: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.xs} ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.spacing.sm};
  border-radius: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.borderRadius.sm};
  transition: all ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.transitions.fast};
  
  &:hover {
    background: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.light};
    color: ${_utils_styles__WEBPACK_IMPORTED_MODULE_1__.theme.colors.primary};
    text-decoration: underline;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;
class PopSUS extends _core_component__WEBPACK_IMPORTED_MODULE_0__.Component {
    createElement() {
        const { text = 'PopSUS' } = this.options;
        const link = (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.createStyledElement)('a', linkClass);
        link.textContent = text;
        // Prevenir comportamento padrão do link
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        return link;
    }
    onMount() {
        if (this.options.onClick) {
            this.clickHandler = (e) => {
                e.preventDefault();
                this.options.onClick();
            };
            this.element.addEventListener('click', this.clickHandler);
            // Suporte para teclado (Enter/Space)
            this.keydownHandler = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.options.onClick();
                }
            };
            this.element.addEventListener('keydown', this.keydownHandler);
        }
    }
    onUnmount() {
        if (this.clickHandler) {
            this.element.removeEventListener('click', this.clickHandler);
        }
        if (this.keydownHandler) {
            this.element.removeEventListener('keydown', this.keydownHandler);
        }
    }
    /**
     * Atualiza o texto do link
     */
    setText(text) {
        this.element.textContent = text;
        return this;
    }
}


/***/ }),

/***/ "./src/components/index.ts":
/*!*********************************!*\
  !*** ./src/components/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* reexport safe */ _Button__WEBPACK_IMPORTED_MODULE_0__.Button),
/* harmony export */   Card: () => (/* reexport safe */ _Card__WEBPACK_IMPORTED_MODULE_1__.Card),
/* harmony export */   Modal: () => (/* reexport safe */ _Modal__WEBPACK_IMPORTED_MODULE_3__.Modal),
/* harmony export */   PopSUS: () => (/* reexport safe */ _PopSUS__WEBPACK_IMPORTED_MODULE_2__.PopSUS),
/* harmony export */   createPopSUSModal: () => (/* reexport safe */ _ModalPopSUS__WEBPACK_IMPORTED_MODULE_4__.createPopSUSModal),
/* harmony export */   showPopSUSModal: () => (/* reexport safe */ _ModalPopSUS__WEBPACK_IMPORTED_MODULE_4__.showPopSUSModal)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Button */ "./src/components/Button.ts");
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card */ "./src/components/Card.ts");
/* harmony import */ var _PopSUS__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PopSUS */ "./src/components/PopSUS.ts");
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Modal */ "./src/components/Modal.ts");
/* harmony import */ var _ModalPopSUS__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ModalPopSUS */ "./src/components/ModalPopSUS.ts");
/**
 * Exportações centralizadas de componentes
 */




// Modal principal do PopSUS



/***/ }),

/***/ "./src/core/component.ts":
/*!*******************************!*\
  !*** ./src/core/component.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component)
/* harmony export */ });
/**
 * Sistema base de componentes para userscripts
 *
 * Fornece uma classe base para criar componentes reutilizáveis
 * que funcionam dentro do Shadow DOM.
 */
class Component {
    constructor(options = {}) {
        this.mounted = false;
        this.options = options;
        this.element = this.createElement();
        this.applyBaseStyles();
    }
    /**
     * Método chamado após o componente ser montado no DOM
     * Útil para event listeners, inicializações, etc.
     */
    onMount() {
        // Implementação opcional pelos componentes filhos
    }
    /**
     * Método chamado antes do componente ser desmontado
     * Útil para cleanup, remover listeners, etc.
     */
    onUnmount() {
        // Implementação opcional pelos componentes filhos
    }
    /**
     * Aplica estilos base ao elemento
     */
    applyBaseStyles() {
        if (this.options.className) {
            this.element.className = this.options.className;
        }
        if (this.options.id) {
            this.element.id = this.options.id;
        }
    }
    /**
     * Retorna o elemento HTML do componente
     */
    getElement() {
        return this.element;
    }
    /**
     * Monta o componente em um elemento pai
     */
    mount(parent) {
        parent.appendChild(this.element);
        if (!this.mounted) {
            this.mounted = true;
            this.onMount();
        }
        return this;
    }
    /**
     * Desmonta o componente
     */
    unmount() {
        if (this.mounted) {
            this.onUnmount();
            this.mounted = false;
        }
        if (this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    }
    /**
     * Destrói o componente completamente
     */
    destroy() {
        this.unmount();
        this.element.remove();
    }
    /**
     * Atualiza o conteúdo HTML interno do componente
     */
    setContent(content) {
        if (typeof content === 'string') {
            this.element.innerHTML = content;
        }
        else {
            this.element.innerHTML = '';
            this.element.appendChild(content);
        }
        return this;
    }
    /**
     * Adiciona conteúdo ao componente
     */
    append(content) {
        if (typeof content === 'string') {
            this.element.insertAdjacentHTML('beforeend', content);
        }
        else if (content instanceof Component) {
            this.element.appendChild(content.getElement());
        }
        else {
            this.element.appendChild(content);
        }
        return this;
    }
    /**
     * Adiciona um event listener ao elemento
     */
    on(event, handler, options) {
        this.element.addEventListener(event, handler, options);
        return this;
    }
    /**
     * Remove um event listener do elemento
     */
    off(event, handler, options) {
        this.element.removeEventListener(event, handler, options);
        return this;
    }
    /**
     * Mostra o componente
     */
    show() {
        this.element.style.display = '';
        return this;
    }
    /**
     * Esconde o componente
     */
    hide() {
        this.element.style.display = 'none';
        return this;
    }
    /**
     * Toggle visibilidade do componente
     */
    toggle() {
        if (this.element.style.display === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
        return this;
    }
    /**
     * Adiciona uma classe CSS
     */
    addClass(className) {
        this.element.classList.add(className);
        return this;
    }
    /**
     * Remove uma classe CSS
     */
    removeClass(className) {
        this.element.classList.remove(className);
        return this;
    }
    /**
     * Toggle uma classe CSS
     */
    toggleClass(className) {
        this.element.classList.toggle(className);
        return this;
    }
    /**
     * Define atributos no elemento
     */
    setAttr(name, value) {
        this.element.setAttribute(name, value);
        return this;
    }
    /**
     * Remove atributo do elemento
     */
    removeAttr(name) {
        this.element.removeAttribute(name);
        return this;
    }
}


/***/ }),

/***/ "./src/core/shadow-dom.ts":
/*!********************************!*\
  !*** ./src/core/shadow-dom.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShadowContainer: () => (/* binding */ ShadowContainer),
/* harmony export */   getShadowContainer: () => (/* binding */ getShadowContainer),
/* harmony export */   resetShadowContainer: () => (/* binding */ resetShadowContainer)
/* harmony export */ });
/**
 * Sistema de Shadow DOM isolado para userscripts
 *
 * Cria um container isolado onde o CSS e DOM não interferem com a página host
 * e a página host não interfere com nosso userscript.
 */
class ShadowContainer {
    constructor(options = {}) {
        const { id = 'userscript-shadow-root', mode = 'open', attachTo = document.body, styleIsolation = true, } = options;
        // Criar elemento host
        this.hostElement = document.createElement('div');
        this.hostElement.id = id;
        this.hostElement.style.cssText = 'all: initial; position: relative; z-index: 999999;';
        // Criar Shadow DOM
        this.shadowRoot = this.hostElement.attachShadow({ mode });
        // Container interno
        this.containerElement = document.createElement('div');
        this.containerElement.id = 'shadow-container';
        if (styleIsolation) {
            // Reset de estilos para garantir isolamento
            this.containerElement.style.cssText = `
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        box-sizing: border-box;
      `;
            // Adicionar estilo global para box-sizing
            const style = document.createElement('style');
            style.textContent = `
        *, *::before, *::after {
          box-sizing: border-box;
        }
      `;
            this.shadowRoot.appendChild(style);
        }
        this.shadowRoot.appendChild(this.containerElement);
        attachTo.appendChild(this.hostElement);
    }
    /**
     * Retorna o Shadow Root
     */
    getRoot() {
        return this.shadowRoot;
    }
    /**
     * Retorna o container interno
     */
    getContainer() {
        return this.containerElement;
    }
    /**
     * Retorna o elemento host
     */
    getHostElement() {
        return this.hostElement;
    }
    /**
     * Adiciona um elemento ao container
     */
    append(element) {
        this.containerElement.appendChild(element);
    }
    /**
     * Adiciona HTML ao container
     */
    appendHTML(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        while (temp.firstChild) {
            this.containerElement.appendChild(temp.firstChild);
        }
    }
    /**
     * Limpa o conteúdo do container
     */
    clear() {
        this.containerElement.innerHTML = '';
    }
    /**
     * Remove o Shadow DOM completamente
     */
    destroy() {
        this.hostElement.remove();
    }
    /**
     * Adiciona uma folha de estilos ao Shadow DOM
     */
    addStyleSheet(css) {
        const style = document.createElement('style');
        style.textContent = css;
        this.shadowRoot.appendChild(style);
    }
    /**
     * Query selector dentro do Shadow DOM
     */
    querySelector(selector) {
        return this.shadowRoot.querySelector(selector);
    }
    /**
     * Query selector all dentro do Shadow DOM
     */
    querySelectorAll(selector) {
        return this.shadowRoot.querySelectorAll(selector);
    }
}
/**
 * Instância global singleton do Shadow Container
 */
let globalShadowContainer = null;
/**
 * Obtém ou cria a instância global do Shadow Container
 */
function getShadowContainer(options) {
    if (!globalShadowContainer) {
        globalShadowContainer = new ShadowContainer(options);
    }
    return globalShadowContainer;
}
/**
 * Reseta a instância global (útil para testes ou reinicialização)
 */
function resetShadowContainer() {
    if (globalShadowContainer) {
        globalShadowContainer.destroy();
        globalShadowContainer = null;
    }
}


/***/ }),

/***/ "./src/utils/character-id-extractor.ts":
/*!*********************************************!*\
  !*** ./src/utils/character-id-extractor.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildCharacterUrl: () => (/* binding */ buildCharacterUrl),
/* harmony export */   getCharacterId: () => (/* binding */ getCharacterId),
/* harmony export */   getCharacterIdFromUrl: () => (/* binding */ getCharacterIdFromUrl),
/* harmony export */   getCharacterIdOrThrow: () => (/* binding */ getCharacterIdOrThrow),
/* harmony export */   getPopmundoUrlInfo: () => (/* binding */ getPopmundoUrlInfo),
/* harmony export */   isCharacterPage: () => (/* binding */ isCharacterPage),
/* harmony export */   obterPersonagemAlvo: () => (/* binding */ obterPersonagemAlvo)
/* harmony export */ });
/**
 * Character ID Extractor
 *
 * Extrai o ID do personagem da URL do Popmundo
 */
/**
 * Extrai o ID do personagem da URL atual
 *
 * @returns O ID do personagem ou null se não encontrado
 *
 * @example
 * // URL: https://73.popmundo.com/World/Popmundo.aspx/Character/3155712
 * const characterId = getCharacterId(); // Retorna: "3155712"
 */
function getCharacterId() {
    const url = window.location.href;
    // Regex para capturar o ID após /Character/
    const match = url.match(/\/Character\/(\d+)/i);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}
/**
 * Extrai o ID do personagem de uma URL específica
 *
 * @param url - URL para extrair o ID
 * @returns O ID do personagem ou null se não encontrado
 *
 * @example
 * const url = "https://73.popmundo.com/World/Popmundo.aspx/Character/3155712";
 * const characterId = getCharacterIdFromUrl(url); // Retorna: "3155712"
 */
function getCharacterIdFromUrl(url) {
    const match = url.match(/\/Character\/(\d+)/i);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}
/**
 * Verifica se a URL atual é uma página de personagem
 *
 * @returns true se for uma página de personagem, false caso contrário
 *
 * @example
 * if (isCharacterPage()) {
 *   const id = getCharacterId();
 *   console.log('ID do personagem:', id);
 * }
 */
function isCharacterPage() {
    return window.location.href.includes('/Character/');
}
/**
 * Obtém o ID do personagem com validação
 * Lança um erro se não estiver em uma página de personagem
 *
 * @returns O ID do personagem
 * @throws Error se não estiver em uma página de personagem
 *
 * @example
 * try {
 *   const characterId = getCharacterIdOrThrow();
 *   console.log('ID:', characterId);
 * } catch (error) {
 *   console.error('Não está em uma página de personagem');
 * }
 */
function getCharacterIdOrThrow() {
    const characterId = getCharacterId();
    if (!characterId) {
        throw new Error('Não foi possível extrair o ID do personagem da URL atual');
    }
    return characterId;
}
/**
 * Extrai informações da URL do Popmundo
 *
 * @returns Objeto com informações da URL
 *
 * @example
 * const info = getPopmundoUrlInfo();
 * console.log(info);
 * // {
 * //   server: "73",
 * //   characterId: "3155712",
 * //   isCharacterPage: true,
 * //   fullUrl: "https://73.popmundo.com/World/Popmundo.aspx/Character/3155712"
 * // }
 */
function getPopmundoUrlInfo() {
    const url = window.location.href;
    // Extrai o servidor (número no início do domínio)
    const serverMatch = url.match(/https?:\/\/(\d+)\.popmundo\.com/i);
    const server = serverMatch ? serverMatch[1] : null;
    // Extrai o ID do personagem
    const characterId = getCharacterId();
    return {
        server,
        characterId,
        isCharacterPage: isCharacterPage(),
        fullUrl: url,
    };
}
/**
 * Constrói a URL de um personagem
 *
 * @param characterId - ID do personagem
 * @param server - Número do servidor (opcional, usa o servidor atual se não fornecido)
 * @returns URL completa do personagem
 *
 * @example
 * const url = buildCharacterUrl("3155712", "73");
 * // Retorna: "https://73.popmundo.com/World/Popmundo.aspx/Character/3155712"
 */
function buildCharacterUrl(characterId, server) {
    const currentServer = server || getPopmundoUrlInfo().server || '73';
    return `https://${currentServer}.popmundo.com/World/Popmundo.aspx/Character/${characterId}`;
}
/**
 * Obtém o ID do personagem alvo da interação (página /Interact/)
 *
 * @returns ID do personagem alvo ou null se não estiver em uma página de interação
 *
 * @example
 * // URL: https://75.popmundo.com/World/Popmundo.aspx/Interact/3213594
 * const personagemAlvo = obterPersonagemAlvo(); // Retorna: "3213594"
 */
function obterPersonagemAlvo() {
    const url = window.location.href;
    const match = url.match(/\/Interact\/(\d+)/i);
    return match ? match[1] : null;
}


/***/ }),

/***/ "./src/utils/selectors.ts":
/*!********************************!*\
  !*** ./src/utils/selectors.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Selectors {
}
Selectors.intercatUlH3 = "#ctl00_cphRightColumn_ctl00_hdrInteract";
Selectors.shadowContainerId = "#my-userscript-root";
//<a id="ctl00_cphRightColumn_ctl00_lnkInteract" href="/World/Popmundo.aspx/Locale/MoveToLocale/3292162/3213594">Ir interagir</a>
Selectors.interactLink = "#ctl00_cphRightColumn_ctl00_lnkInteract";
// Seletores WebForms
Selectors.webForm = "form#aspnetForm";
Selectors.ddlUseItem = "select#ctl00_cphTopColumn_ctl00_ddlUseItem";
Selectors.textColetorSangue = "Coletor de sangue";
Selectors.textTuboSanguineo = "Tubo sanguíneo";
// Nomes de campos WebForms
Selectors.fieldNames = {
    ddlUseItem: "ctl00$cphTopColumn$ctl00$ddlUseItem",
    btnUseItem: "ctl00$cphTopColumn$ctl00$btnUseItem",
    hidSecurityCheck: "ctl00$cphTopColumn$ctl00$hidSecurityCheck",
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Selectors);


/***/ }),

/***/ "./src/utils/styles.ts":
/*!*****************************!*\
  !*** ./src/utils/styles.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* binding */ applyStyles),
/* harmony export */   breakpoints: () => (/* binding */ breakpoints),
/* harmony export */   classNames: () => (/* binding */ classNames),
/* harmony export */   createStyledElement: () => (/* binding */ createStyledElement),
/* harmony export */   css: () => (/* binding */ css),
/* harmony export */   extractCss: () => (/* reexport safe */ goober__WEBPACK_IMPORTED_MODULE_0__.extractCss),
/* harmony export */   globalStyles: () => (/* binding */ globalStyles),
/* harmony export */   keyframes: () => (/* binding */ keyframes),
/* harmony export */   mediaQuery: () => (/* binding */ mediaQuery),
/* harmony export */   mixins: () => (/* binding */ mixins),
/* harmony export */   setupGoober: () => (/* binding */ setupGoober),
/* harmony export */   styled: () => (/* reexport safe */ goober__WEBPACK_IMPORTED_MODULE_0__.styled),
/* harmony export */   theme: () => (/* binding */ theme)
/* harmony export */ });
/* harmony import */ var goober__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! goober */ "./node_modules/goober/dist/goober.modern.js");
/**
 * Helpers de estilização usando Goober (CSS-in-JS)
 *
 * Goober é uma biblioteca minimalista (1KB) de CSS-in-JS
 * que funciona perfeitamente dentro do Shadow DOM.
 */

/**
 * Configura o Goober para trabalhar dentro do Shadow DOM
 */
function setupGoober(target) {
    (0,goober__WEBPACK_IMPORTED_MODULE_0__.setup)(target);
}
/**
 * Exporta o styled do Goober para criar componentes estilizados
 *
 * Uso:
 * const StyledButton = styled('button')`
 *   background: blue;
 *   color: white;
 *   padding: 10px 20px;
 * `;
 *
 * const button = createStyledElement(StyledButton);
 */

/**
 * Helper para criar elemento a partir de um styled component do Goober
 */
function createStyledElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}
/**
 * Exporta o css do Goober para criar classes CSS
 *
 * Uso:
 * const buttonClass = css`
 *   background: blue;
 *   color: white;
 * `;
 */
const css = goober__WEBPACK_IMPORTED_MODULE_0__.css;
/**
 * Extrai todo o CSS gerado (útil para debug ou SSR)
 */

/**
 * Aplica estilos inline em um elemento de forma tipo-safe
 */
function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}
/**
 * Temas pré-definidos para facilitar estilização consistente
 */
const theme = {
    colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#06b6d4',
        light: '#f1f5f9',
        dark: '#1e293b',
        white: '#ffffff',
        black: '#000000',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },
    borderRadius: {
        none: '0',
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    transitions: {
        fast: '150ms ease',
        normal: '250ms ease',
        slow: '350ms ease',
    },
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
};
/**
 * Mixins CSS comuns para reutilização
 */
const mixins = {
    flexCenter: css `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
    flexBetween: css `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
    truncate: css `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
    absoluteFill: css `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `,
    visuallyHidden: css `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `,
    resetButton: css `
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    outline: inherit;
  `,
};
/**
 * Helper para criar media queries responsivas
 */
const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
};
/**
 * Helper para gerar media query
 */
function mediaQuery(breakpoint) {
    return `@media (min-width: ${breakpoints[breakpoint]})`;
}
/**
 * Utilitário para combinar classes CSS
 */
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
/**
 * Helper para criar animações CSS
 */
function keyframes(name, frames) {
    return `
    @keyframes ${name} {
      ${frames}
    }
  `;
}
/**
 * Global styles que podem ser injetados no Shadow DOM
 */
const globalStyles = css `
  * {
    box-sizing: border-box;
  }

  button {
    font-family: inherit;
  }

  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
  }
`;


/***/ }),

/***/ "./src/utils/sweetalert.ts":
/*!*********************************!*\
  !*** ./src/utils/sweetalert.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alert: () => (/* binding */ Alert),
/* harmony export */   Swal: () => (/* reexport default from dynamic */ sweetalert2__WEBPACK_IMPORTED_MODULE_0___default.a),
/* harmony export */   Toast: () => (/* binding */ Toast),
/* harmony export */   closeModal: () => (/* binding */ closeModal),
/* harmony export */   showCustomModal: () => (/* binding */ showCustomModal),
/* harmony export */   showInputModal: () => (/* binding */ showInputModal),
/* harmony export */   showLoading: () => (/* binding */ showLoading)
/* harmony export */ });
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Helper para SweetAlert2
 *
 * Wrapper customizado para usar SweetAlert2 com configurações padronizadas
 */

/**
 * Instância customizada do SweetAlert2 com configurações padrão
 */
const Toast = sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', (sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().stopTimer));
        toast.addEventListener('mouseleave', (sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().resumeTimer));
    },
});
/**
 * SweetAlert2 padrão exportado
 */

/**
 * Helpers de alerta rápidos
 */
const Alert = {
    /**
     * Alerta de sucesso
     */
    success(title, text) {
        return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
            icon: 'success',
            title,
            text,
            confirmButtonColor: '#10b981',
        });
    },
    /**
     * Alerta de erro
     */
    error(title, text) {
        return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
            icon: 'error',
            title,
            text,
            confirmButtonColor: '#ef4444',
        });
    },
    /**
     * Alerta de aviso
     */
    warning(title, text) {
        return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
            icon: 'warning',
            title,
            text,
            confirmButtonColor: '#f59e0b',
        });
    },
    /**
     * Alerta de informação
     */
    info(title, text) {
        return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
            icon: 'info',
            title,
            text,
            confirmButtonColor: '#3b82f6',
        });
    },
    /**
     * Confirmação
     */
    confirm(title, text, confirmText = 'Sim', cancelText = 'Cancelar') {
        return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
        });
    },
    /**
     * Toast de sucesso
     */
    toastSuccess(title) {
        Toast.fire({
            icon: 'success',
            title,
        });
    },
    /**
     * Toast de erro
     */
    toastError(title) {
        Toast.fire({
            icon: 'error',
            title,
        });
    },
    /**
     * Toast de aviso
     */
    toastWarning(title) {
        Toast.fire({
            icon: 'warning',
            title,
        });
    },
    /**
     * Toast de informação
     */
    toastInfo(title) {
        Toast.fire({
            icon: 'info',
            title,
        });
    },
    /**
     * Modal customizado
     */
    custom(options) {
        return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire(options);
    },
};
/**
 * Exemplo de modal com HTML customizado
 */
async function showCustomModal(title, htmlContent) {
    return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
        title,
        html: htmlContent,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#3b82f6',
        width: '600px',
    });
}
/**
 * Modal com input
 */
async function showInputModal(title, inputType = 'text', placeholder = '', defaultValue = '') {
    return sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
        title,
        input: inputType,
        inputPlaceholder: placeholder,
        inputValue: defaultValue,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        inputValidator: (value) => {
            if (!value) {
                return 'Você precisa preencher este campo!';
            }
            return null;
        },
    });
}
/**
 * Modal de loading
 */
function showLoading(title = 'Carregando...', text) {
    sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
            sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().showLoading();
        },
    });
}
/**
 * Fecha o modal atual
 */
function closeModal() {
    sweetalert2__WEBPACK_IMPORTED_MODULE_0___default().close();
}


/***/ }),

/***/ "./src/utils/webforms.ts":
/*!*******************************!*\
  !*** ./src/utils/webforms.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buscarItemPorNome: () => (/* binding */ buscarItemPorNome),
/* harmony export */   buscarLinhaItemInventario: () => (/* binding */ buscarLinhaItemInventario),
/* harmony export */   buscarPaginaInteracao: () => (/* binding */ buscarPaginaInteracao),
/* harmony export */   codificarFormData: () => (/* binding */ codificarFormData),
/* harmony export */   coletarCamposWebForms: () => (/* binding */ coletarCamposWebForms),
/* harmony export */   enviarFormularioWebForms: () => (/* binding */ enviarFormularioWebForms),
/* harmony export */   extrairCamposWebFormsDoHTML: () => (/* binding */ extrairCamposWebFormsDoHTML),
/* harmony export */   fetchPaginaInventario: () => (/* binding */ fetchPaginaInventario),
/* harmony export */   obterItemSelecionado: () => (/* binding */ obterItemSelecionado),
/* harmony export */   obterItensDisponiveis: () => (/* binding */ obterItensDisponiveis),
/* harmony export */   obterSecurityCheck: () => (/* binding */ obterSecurityCheck),
/* harmony export */   obterValorCampo: () => (/* binding */ obterValorCampo),
/* harmony export */   usarItem: () => (/* binding */ usarItem),
/* harmony export */   usarItemAposBuscar: () => (/* binding */ usarItemAposBuscar),
/* harmony export */   usarItemDoInventario: () => (/* binding */ usarItemDoInventario)
/* harmony export */ });
/* harmony import */ var _character_id_extractor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character-id-extractor */ "./src/utils/character-id-extractor.ts");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectors */ "./src/utils/selectors.ts");
/**
 * Utilitários para trabalhar com formulários WebForms (ASP.NET)
 *
 * Este módulo fornece funções para coletar dados de formulários WebForms
 * e fazer requisições POST simulando o comportamento do navegador.
 */


/**
 * Coleta todos os campos do formulário WebForms da página
 *
 * @param botaoClicado - Nome do botão de submit que foi clicado (opcional)
 * @returns Objeto com todos os campos do formulário ou null se não encontrar o formulário
 */
function coletarCamposWebForms(botaoClicado) {
    const form = document.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].webForm);
    if (!form) {
        console.warn('⚠️ Formulário WebForms não encontrado na página');
        return null;
    }
    const campos = {};
    // Coletar todos os inputs, selects e textareas do formulário
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((element) => {
        const name = element.name;
        if (!name)
            return;
        // Ignorar botões de submit que não foram clicados
        if (element instanceof HTMLInputElement && element.type === 'submit') {
            // Só incluir o botão que foi especificado como clicado
            if (botaoClicado && name === botaoClicado) {
                campos[name] = element.value || '';
            }
            return;
        }
        let value;
        if (element instanceof HTMLInputElement) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                // Só incluir se estiver marcado
                if (element.checked) {
                    value = element.value || '';
                }
                else {
                    return; // Não incluir checkboxes/radios não marcados
                }
            }
            else {
                // hidden, text, etc.
                value = element.value || '';
            }
        }
        else if (element instanceof HTMLSelectElement) {
            value = element.value || '';
            // Não incluir selects com valor "0" ou vazio (exceto se for obrigatório)
            if (value === '0' || value === '') {
                // Manter apenas se for um campo obrigatório do WebForms
                if (!name.startsWith('__') && !name.includes('ddlCurrentCharacter')) {
                    return;
                }
            }
        }
        else if (element instanceof HTMLTextAreaElement) {
            value = element.value || '';
        }
        else {
            value = element.value || '';
        }
        // Só adicionar campos com valor ou campos obrigatórios do WebForms
        if (value || name.startsWith('__')) {
            campos[name] = value;
        }
    });
    return campos;
}
async function fetchPaginaInventario() {
    const urlInfo = new URL(window.location.href);
    // Extrair servidor do hostname atual (ex: "75.popmundo.com" -> "75")
    let currentServer = null;
    if (!currentServer) {
        const serverMatch = urlInfo.hostname.match(/(\d+)\.popmundo\.com/i);
        currentServer = serverMatch ? serverMatch[1] : '75';
    }
    const baseUrl = `${urlInfo.protocol}//${currentServer}.popmundo.com`;
    const url = `${baseUrl}/World/Popmundo.aspx/Character/Items/`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Referer': window.location.href,
        },
        credentials: 'include', // Incluir cookies
    });
    return response;
}
/**
 * Busca a linha da tabela do inventário que contém um item específico
 *
 * @param html - HTML da página de inventário
 * @param nomeItem - Nome do item a buscar (ex: "Tubo sanguíneo")
 * @returns Objeto com informações da linha ou null se não encontrado
 */
function buscarLinhaItemInventario(html, nomeItem) {
    // Criar um elemento temporário para fazer o parse do HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // Buscar a tabela de itens
    const tabela = tempDiv.querySelector('table#checkedlist');
    if (!tabela) {
        console.warn('⚠️ Tabela de inventário não encontrada no HTML');
        return null;
    }
    // Buscar todas as linhas da tabela
    const linhas = tabela.querySelectorAll('tbody tr');
    // Procurar a linha que contém o item
    for (const linha of Array.from(linhas)) {
        // Buscar o link do item dentro da linha
        const linkItem = linha.querySelector('td a[href*="ItemDetails"]');
        if (linkItem && linkItem.textContent?.trim().toLowerCase().includes(nomeItem.toLowerCase())) {
            // Encontrou a linha! Extrair informações
            // Buscar o ID do item no campo hidden
            const hidItemId = linha.querySelector('input[type="hidden"][id*="hidItemIDstring"]');
            const itemId = hidItemId?.value || '';
            // Buscar o botão de usar
            const btnUse = linha.querySelector('input[type="image"][id*="btnUse"]');
            if (itemId) {
                return {
                    tr: linha,
                    itemId,
                    btnUse: btnUse || null,
                    linkItem,
                };
            }
        }
    }
    return null;
}
/**
 * Obtém o valor de um campo específico do formulário WebForms
 *
 * @param nomeCampo - Nome do campo (ex: Selectors.fieldNames.ddlUseItem)
 * @returns Valor do campo ou null se não encontrado
 */
function obterValorCampo(nomeCampo) {
    const form = document.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].webForm);
    if (!form)
        return null;
    const campo = form.querySelector(`[name="${nomeCampo}"]`);
    if (!campo)
        return null;
    if (campo instanceof HTMLInputElement) {
        if (campo.type === 'checkbox' || campo.type === 'radio') {
            return campo.checked ? campo.value : null;
        }
        return campo.value || null;
    }
    if (campo instanceof HTMLSelectElement) {
        return campo.value || null;
    }
    return null;
}
/**
 * Obtém o ID do item selecionado no dropdown "Usar item"
 *
 * @returns ID do item selecionado ou null se não encontrado
 */
function obterItemSelecionado() {
    return obterValorCampo(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.ddlUseItem);
}
/**
 * Obtém o valor do campo de segurança (Security Check)
 *
 * @returns Valor do security check ou null se não encontrado
 */
function obterSecurityCheck() {
    return obterValorCampo(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.hidSecurityCheck);
}
/**
 * Converte um objeto em formato URL-encoded (application/x-www-form-urlencoded)
 *
 * @param dados - Objeto com os dados do formulário
 * @returns String URL-encoded
 */
function codificarFormData(dados) {
    return Object.entries(dados)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}
/**
 * Faz uma requisição POST simulando o envio de um formulário WebForms
 *
 * @param url - URL para onde enviar a requisição
 * @param dados - Dados do formulário (ou null para coletar automaticamente)
 * @returns Promise com a resposta da requisição
 */
async function enviarFormularioWebForms(url, dados) {
    const campos = dados || coletarCamposWebForms();
    if (!campos) {
        throw new Error('Não foi possível coletar os campos do formulário WebForms');
    }
    const formData = codificarFormData(campos);
    console.log('📤 Enviando formulário WebForms:', {
        url,
        campos: Object.keys(campos).length,
        tamanho: formData.length,
    });
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': window.location.href,
        },
        body: formData,
        credentials: 'include', // Incluir cookies
        redirect: 'manual', // Não seguir redirecionamento automaticamente
    });
    return response;
}
/**
 * Envia o formulário "Usar item" para um personagem
 *
 * @param itemId - ID do item a ser usado (ex: "238102166")
 * @param personagemAlvoId - ID do personagem alvo (opcional, tenta extrair da URL)
 * @returns Promise com a resposta da requisição
 */
async function usarItem(itemId, personagemAlvoId) {
    const alvoId = personagemAlvoId || (0,_character_id_extractor__WEBPACK_IMPORTED_MODULE_0__.obterPersonagemAlvo)();
    if (!alvoId) {
        throw new Error('Não foi possível identificar o personagem alvo da interação');
    }
    // Coletar todos os campos do formulário, especificando o botão que será clicado
    const campos = coletarCamposWebForms(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.btnUseItem);
    if (!campos) {
        throw new Error('Não foi possível coletar os campos do formulário WebForms');
    }
    // Atualizar campos específicos do "Usar item"
    campos[_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.ddlUseItem] = itemId;
    campos[_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.btnUseItem] = 'Usar item';
    // Construir URL da interação
    const urlInfo = new URL(window.location.href);
    const baseUrl = `${urlInfo.protocol}//${urlInfo.host}`;
    const interactLink = document.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].interactLink);
    const href = interactLink.getAttribute('href');
    const url = `${baseUrl}${href}`;
    console.log('🩸 Usando item:', {
        itemId,
        personagemAlvo: alvoId,
        url,
    });
    const response = await enviarFormularioWebForms(url, campos);
    // Verificar se foi redirecionado (302)
    if (response.status === 302 || response.status === 0) {
        const location = response.headers.get('location');
        if (location) {
            console.log('✅ Item usado com sucesso! Redirecionando para:', location);
        }
    }
    return response;
}
/**
 * Obtém a lista de itens disponíveis no dropdown "Usar item"
 *
 * @returns Array com objetos { value: string, text: string } ou array vazio
 */
function obterItensDisponiveis() {
    const select = document.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].ddlUseItem);
    if (!select) {
        return [];
    }
    const itens = [];
    Array.from(select.options).forEach((option) => {
        if (option.value && option.value !== '0') {
            itens.push({
                value: option.value,
                text: option.text,
            });
        }
    });
    return itens;
}
/**
 * Procura um item pelo nome no dropdown "Usar item"
 *
 * @param nomeItem - Nome do item (ex: "Coletor de sangue")
 * @returns ID do item ou null se não encontrado
 */
function buscarItemPorNome(nomeItem) {
    const itens = obterItensDisponiveis();
    const item = itens.find((i) => i.text.toLowerCase().includes(nomeItem.toLowerCase()));
    return item ? item.value : null;
}
/**
 * Extrai os campos WebForms de um HTML string
 *
 * @param html - HTML string contendo o formulário WebForms
 * @param botaoClicado - Nome do botão que foi clicado (ex: Selectors.fieldNames.btnUseItem)
 * @returns Objeto com os campos do formulário ou null se não encontrar
 */
function extrairCamposWebFormsDoHTML(html, botaoClicado) {
    // Criar um elemento temporário para fazer o parse do HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const form = tempDiv.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].webForm);
    if (!form) {
        console.warn('⚠️ Formulário WebForms não encontrado no HTML');
        return null;
    }
    const campos = {};
    // Coletar todos os inputs, selects e textareas do formulário
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((element) => {
        const name = element.name;
        if (!name)
            return;
        // Ignorar botões de submit que não foram clicados
        if (element instanceof HTMLInputElement && element.type === 'submit') {
            // Só incluir o botão que foi especificado como clicado
            if (botaoClicado && name === botaoClicado) {
                campos[name] = element.value || '';
            }
            return;
        }
        let value;
        if (element instanceof HTMLInputElement) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                // Só incluir se estiver marcado
                if (element.checked) {
                    value = element.value || '';
                }
                else {
                    return; // Não incluir checkboxes/radios não marcados
                }
            }
            else {
                // hidden, text, etc.
                value = element.value || '';
            }
        }
        else if (element instanceof HTMLSelectElement) {
            value = element.value || '';
            // Não incluir selects com valor "0" ou vazio (exceto se for obrigatório)
            if (value === '0' || value === '') {
                // Manter apenas se for um campo obrigatório do WebForms
                if (!name.startsWith('__') && !name.includes('ddlCurrentCharacter')) {
                    return;
                }
            }
        }
        else if (element instanceof HTMLTextAreaElement) {
            value = element.value || '';
        }
        else {
            value = element.value || '';
        }
        // Só adicionar campos com valor ou campos obrigatórios do WebForms
        if (value || name.startsWith('__')) {
            campos[name] = value;
        }
    });
    return campos;
}
/**
 * Faz uma requisição GET para a página de interação e retorna o HTML
 *
 * @param characterId - ID do personagem alvo
 * @param server - Número do servidor (opcional, extrai da URL atual)
 * @returns Promise com o HTML da página de interação
 */
async function buscarPaginaInteracao(characterId, server) {
    const urlInfo = new URL(window.location.href);
    // Extrair servidor do hostname atual (ex: "75.popmundo.com" -> "75")
    let currentServer = server;
    if (!currentServer) {
        const serverMatch = urlInfo.hostname.match(/(\d+)\.popmundo\.com/i);
        currentServer = serverMatch ? serverMatch[1] : '75';
    }
    const baseUrl = `${urlInfo.protocol}//${currentServer}.popmundo.com`;
    const url = `${baseUrl}/World/Popmundo.aspx/Interact/${characterId}`;
    console.log('📥 Buscando página de interação:', { url, characterId });
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Referer': window.location.href,
        },
        credentials: 'include', // Incluir cookies
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar página de interação: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    return html;
}
/**
 * Usa um item específico após buscar a página de interação
 *
 * @param itemNome - Nome do item a ser usado (ex: "Dentes feios falsos")
 * @param characterId - ID do personagem alvo
 * @param server - Número do servidor (opcional)
 * @returns Promise com a resposta da requisição
 */
async function usarItemAposBuscar(itemNome, characterId, server) {
    // 1. Fazer GET na página de interação
    const html = await buscarPaginaInteracao(characterId, server);
    // 2. Extrair campos WebForms do HTML retornado, especificando o botão que será clicado
    const campos = extrairCamposWebFormsDoHTML(html, _selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.btnUseItem);
    if (!campos) {
        throw new Error('Não foi possível extrair os campos WebForms do HTML retornado');
    }
    // 3. Criar um elemento temporário para parsear o HTML e buscar o item
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const select = tempDiv.querySelector(_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].ddlUseItem);
    if (!select) {
        throw new Error('Dropdown de itens não encontrado na página de interação');
    }
    // 4. Buscar o item pelo nome
    let itemId = null;
    Array.from(select.options).forEach((option) => {
        if (option.value && option.value !== '0') {
            if (option.text.toLowerCase().includes(itemNome.toLowerCase())) {
                itemId = option.value;
            }
        }
    });
    if (!itemId) {
        throw new Error(`Item "${itemNome}" não encontrado na lista de itens disponíveis`);
    }
    // 5. Atualizar campos específicos do "Usar item"
    campos[_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.ddlUseItem] = itemId;
    campos[_selectors__WEBPACK_IMPORTED_MODULE_1__["default"].fieldNames.btnUseItem] = 'Usar item';
    // 6. Construir URL da interação
    const urlInfo = new URL(window.location.href);
    // Extrair servidor do hostname atual (ex: "75.popmundo.com" -> "75")
    let currentServer = server;
    if (!currentServer) {
        const serverMatch = urlInfo.hostname.match(/(\d+)\.popmundo\.com/i);
        currentServer = serverMatch ? serverMatch[1] : '75';
    }
    const baseUrl = `${urlInfo.protocol}//${currentServer}.popmundo.com`;
    const url = `${baseUrl}/World/Popmundo.aspx/Interact/${characterId}`;
    console.log('💉 Usando item:', {
        itemNome,
        itemId,
        characterId,
        url,
    });
    //espere 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 7. Enviar formulário WebForms
    const response = await enviarFormularioWebForms(url, campos);
    // Verificar se foi redirecionado (302)
    if (response.status === 302 || response.status === 0) {
        const location = response.headers.get('location');
        if (location) {
            console.log('✅ Item usado com sucesso! Redirecionando para:', location);
        }
    }
    return response;
}
/**
 * Usa um item diretamente do inventário clicando no botão "Usar" da tabela
 *
 * @param htmlInventario - HTML da página de inventário
 * @param nomeItem - Nome do item a usar (ex: "Tubo sanguíneo")
 * @param server - Número do servidor (opcional, extrai da URL atual)
 * @returns Promise com a resposta da requisição
 */
async function usarItemDoInventario(htmlInventario, nomeItem, server) {
    // 1. Buscar a linha do item no inventário
    const linhaItem = buscarLinhaItemInventario(htmlInventario, nomeItem);
    if (!linhaItem) {
        throw new Error(`Item "${nomeItem}" não encontrado no inventário`);
    }
    if (!linhaItem.btnUse) {
        throw new Error(`Botão "Usar" não encontrado para o item "${nomeItem}"`);
    }
    // 2. Extrair campos WebForms do HTML do inventário
    const campos = extrairCamposWebFormsDoHTML(htmlInventario, linhaItem.btnUse.name);
    if (!campos) {
        throw new Error('Não foi possível extrair os campos WebForms do inventário');
    }
    // 3. Adicionar coordenadas do clique do botão image (WebForms requer isso)
    // Quando você clica em um input[type="image"], o navegador envia coordenadas X e Y
    // Formato: nomeBotao.x=0&nomeBotao.y=0
    const nomeBotao = linhaItem.btnUse.name;
    campos[`${nomeBotao}.x`] = '0';
    campos[`${nomeBotao}.y`] = '0';
    // 4. Construir URL do inventário
    const urlInfo = new URL(window.location.href);
    let currentServer = server;
    if (!currentServer) {
        const serverMatch = urlInfo.hostname.match(/(\d+)\.popmundo\.com/i);
        currentServer = serverMatch ? serverMatch[1] : '75';
    }
    const baseUrl = `${urlInfo.protocol}//${currentServer}.popmundo.com`;
    const url = `${baseUrl}/World/Popmundo.aspx/Character/Items/`;
    console.log('🩸 Usando item do inventário:', {
        nomeItem,
        itemId: linhaItem.itemId,
        nomeBotao,
        url,
    });
    // 5. Enviar formulário WebForms
    const response = await enviarFormularioWebForms(url, campos);
    // Verificar se foi redirecionado (302) ou sucesso (200)
    if (response.status === 302 || response.status === 0 || response.status === 200) {
        const location = response.headers.get('location');
        if (location) {
            console.log('✅ Item do inventário usado com sucesso! Redirecionando para:', location);
        }
        else {
            console.log('✅ Item do inventário usado com sucesso!');
        }
    }
    return response;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_shadow_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/shadow-dom */ "./src/core/shadow-dom.ts");
/* harmony import */ var _utils_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/styles */ "./src/utils/styles.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ "./src/components/index.ts");
/* harmony import */ var _utils_sweetalert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/sweetalert */ "./src/utils/sweetalert.ts");
/* harmony import */ var _utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/character-id-extractor */ "./src/utils/character-id-extractor.ts");
/* harmony import */ var _actions_curar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actions/curar */ "./src/actions/curar.ts");
/* harmony import */ var _actions_coletar_sangue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions/coletar-sangue */ "./src/actions/coletar-sangue.ts");
/* harmony import */ var _utils_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/selectors */ "./src/utils/selectors.ts");
/**
 * Userscript Template com Shadow DOM + Goober
 *
 * Este é o ponto de entrada do seu userscript.
 * Exemplo de uso completo do sistema de componentes.
 */








// Inicializar Shadow DOM e Goober
function initializeApp() {
    // Criar container Shadow DOM isolado
    const shadowContainer = (0,_core_shadow_dom__WEBPACK_IMPORTED_MODULE_0__.getShadowContainer)({
        id: _utils_selectors__WEBPACK_IMPORTED_MODULE_7__["default"].shadowContainerId,
        mode: 'open',
    });
    // Configurar Goober para usar o Shadow DOM
    (0,_utils_styles__WEBPACK_IMPORTED_MODULE_1__.setupGoober)(shadowContainer.getRoot());
    console.log('✅ Shadow DOM e Goober inicializados!');
    return shadowContainer;
}
// Função para exibir modal com SweetAlert2
// Função para injetar UI no site alvo
function injectMainScriptButtonUi() {
    const intercatUlH3 = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_7__["default"].intercatUlH3);
    if (intercatUlH3) {
        console.log('✅ Elemento encontrado:', intercatUlH3);
        // Criar componente PopSUS
        const popSUS = new _components__WEBPACK_IMPORTED_MODULE_2__.PopSUS({
            text: '🏥 PopSUS',
            onClick: () => {
                console.log('PopSUS clicado!');
                (0,_components__WEBPACK_IMPORTED_MODULE_2__.showPopSUSModal)({
                    onCurar: _actions_curar__WEBPACK_IMPORTED_MODULE_5__.curarPersonagem,
                    onColetarSangue: _actions_coletar_sangue__WEBPACK_IMPORTED_MODULE_6__.coletarSangue,
                });
            },
        });
        // Criar um wrapper para o componente (fora do Shadow DOM)
        const wrapper = document.createElement('div');
        wrapper.style.marginTop = '8px';
        wrapper.style.marginBottom = '8px';
        // Montar o PopSUS no wrapper
        popSUS.mount(wrapper);
        // Inserir o wrapper logo abaixo do elemento encontrado
        intercatUlH3.insertAdjacentElement('afterend', wrapper);
        console.log('✅ PopSUS injetado abaixo do elemento!');
    }
    else {
        console.warn('⚠️ Elemento não encontrado:', _utils_selectors__WEBPACK_IMPORTED_MODULE_7__["default"].intercatUlH3);
    }
}
// Função principal
function main() {
    console.log('🚀 Userscript carregado!');
    // Verificar se está em uma página de personagem e extrair ID
    if ((0,_utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_4__.isCharacterPage)()) {
        const characterId = (0,_utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_4__.getCharacterId)();
        const urlInfo = (0,_utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_4__.getPopmundoUrlInfo)();
        console.log('📋 Informações da página:');
        console.log('  - ID do Personagem:', characterId);
        console.log('  - Servidor:', urlInfo.server);
        console.log('  - URL:', urlInfo.fullUrl);
    }
    // Inicializar Shadow DOM e Goober
    initializeApp();
    // Injetar PopSUS no site
    injectMainScriptButtonUi();
    console.log('✅ Inicialização completa!');
    // Exemplo de toast de boas-vindas
    setTimeout(() => {
        const characterId = (0,_utils_character_id_extractor__WEBPACK_IMPORTED_MODULE_4__.getCharacterId)();
        if (characterId) {
            _utils_sweetalert__WEBPACK_IMPORTED_MODULE_3__.Alert.toastInfo(`Userscript carregado! ID: ${characterId}`);
        }
        else {
            _utils_sweetalert__WEBPACK_IMPORTED_MODULE_3__.Alert.toastInfo('Userscript carregado com sucesso!');
        }
    }, 1000);
}
// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
}
else {
    main();
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3RELENBQUM7S0FBTSxDQUFDO0lBQ04sSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9nb29iZXIvZGlzdC9nb29iZXIubW9kZXJuLmpzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3dlZXRhbGVydDIvZGlzdC9zd2VldGFsZXJ0Mi5hbGwuanMiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS8uL3NyYy9hY3Rpb25zL2NvbGV0YXItc2FuZ3VlLXN0YXRlLnRzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9zcmMvYWN0aW9ucy9jb2xldGFyLXNhbmd1ZS50cyIsIndlYnBhY2s6Ly91c2Vyc2NyaXB0LXRlbXBsYXRlLy4vc3JjL2FjdGlvbnMvY3VyYXIudHMiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS8uL3NyYy9jb21wb25lbnRzL0J1dHRvbi50cyIsIndlYnBhY2s6Ly91c2Vyc2NyaXB0LXRlbXBsYXRlLy4vc3JjL2NvbXBvbmVudHMvQ2FyZC50cyIsIndlYnBhY2s6Ly91c2Vyc2NyaXB0LXRlbXBsYXRlLy4vc3JjL2NvbXBvbmVudHMvTW9kYWwudHMiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS8uL3NyYy9jb21wb25lbnRzL01vZGFsUG9wU1VTLnRzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9zcmMvY29tcG9uZW50cy9Qb3BTVVMudHMiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS8uL3NyYy9jb21wb25lbnRzL2luZGV4LnRzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9zcmMvY29yZS9jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS8uL3NyYy9jb3JlL3NoYWRvdy1kb20udHMiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS8uL3NyYy91dGlscy9jaGFyYWN0ZXItaWQtZXh0cmFjdG9yLnRzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9zcmMvdXRpbHMvc2VsZWN0b3JzLnRzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9zcmMvdXRpbHMvc3R5bGVzLnRzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9zcmMvdXRpbHMvc3dlZXRhbGVydC50cyIsIndlYnBhY2s6Ly91c2Vyc2NyaXB0LXRlbXBsYXRlLy4vc3JjL3V0aWxzL3dlYmZvcm1zLnRzIiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly91c2Vyc2NyaXB0LXRlbXBsYXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly91c2Vyc2NyaXB0LXRlbXBsYXRlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdXNlcnNjcmlwdC10ZW1wbGF0ZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3VzZXJzY3JpcHQtdGVtcGxhdGUvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGU9e2RhdGE6XCJcIn0sdD10PT57aWYoXCJvYmplY3RcIj09dHlwZW9mIHdpbmRvdyl7bGV0IGU9KHQ/dC5xdWVyeVNlbGVjdG9yKFwiI19nb29iZXJcIik6d2luZG93Ll9nb29iZXIpfHxPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKSx7aW5uZXJIVE1MOlwiIFwiLGlkOlwiX2dvb2JlclwifSk7cmV0dXJuIGUubm9uY2U9d2luZG93Ll9fbm9uY2VfXyxlLnBhcmVudE5vZGV8fCh0fHxkb2N1bWVudC5oZWFkKS5hcHBlbmRDaGlsZChlKSxlLmZpcnN0Q2hpbGR9cmV0dXJuIHR8fGV9LHI9ZT0+e2xldCByPXQoZSksbD1yLmRhdGE7cmV0dXJuIHIuZGF0YT1cIlwiLGx9LGw9Lyg/OihbXFx1MDA4MC1cXHVGRkZGXFx3LSVAXSspICo6PyAqKFteeztdKz8pO3woW147fXtdKj8pICp7KXwofVxccyopL2csYT0vXFwvXFwqW15dKj9cXCpcXC98ICArL2csbj0vXFxuKy9nLG89KGUsdCk9PntsZXQgcj1cIlwiLGw9XCJcIixhPVwiXCI7Zm9yKGxldCBuIGluIGUpe2xldCBjPWVbbl07XCJAXCI9PW5bMF0/XCJpXCI9PW5bMV0/cj1uK1wiIFwiK2MrXCI7XCI6bCs9XCJmXCI9PW5bMV0/byhjLG4pOm4rXCJ7XCIrbyhjLFwia1wiPT1uWzFdP1wiXCI6dCkrXCJ9XCI6XCJvYmplY3RcIj09dHlwZW9mIGM/bCs9byhjLHQ/dC5yZXBsYWNlKC8oW14sXSkrL2csZT0+bi5yZXBsYWNlKC8oW14sXSo6XFxTK1xcKFteKV0qXFwpKXwoW14sXSkrL2csdD0+LyYvLnRlc3QodCk/dC5yZXBsYWNlKC8mL2csZSk6ZT9lK1wiIFwiK3Q6dCkpOm4pOm51bGwhPWMmJihuPS9eLS0vLnRlc3Qobik/bjpuLnJlcGxhY2UoL1tBLVpdL2csXCItJCZcIikudG9Mb3dlckNhc2UoKSxhKz1vLnA/by5wKG4sYyk6bitcIjpcIitjK1wiO1wiKX1yZXR1cm4gcisodCYmYT90K1wie1wiK2ErXCJ9XCI6YSkrbH0sYz17fSxzPWU9PntpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7bGV0IHQ9XCJcIjtmb3IobGV0IHIgaW4gZSl0Kz1yK3MoZVtyXSk7cmV0dXJuIHR9cmV0dXJuIGV9LGk9KGUsdCxyLGkscCk9PntsZXQgdT1zKGUpLGQ9Y1t1XXx8KGNbdV09KGU9PntsZXQgdD0wLHI9MTE7Zm9yKDt0PGUubGVuZ3RoOylyPTEwMSpyK2UuY2hhckNvZGVBdCh0KyspPj4+MDtyZXR1cm5cImdvXCIrcn0pKHUpKTtpZighY1tkXSl7bGV0IHQ9dSE9PWU/ZTooZT0+e2xldCB0LHIsbz1be31dO2Zvcig7dD1sLmV4ZWMoZS5yZXBsYWNlKGEsXCJcIikpOyl0WzRdP28uc2hpZnQoKTp0WzNdPyhyPXRbM10ucmVwbGFjZShuLFwiIFwiKS50cmltKCksby51bnNoaWZ0KG9bMF1bcl09b1swXVtyXXx8e30pKTpvWzBdW3RbMV1dPXRbMl0ucmVwbGFjZShuLFwiIFwiKS50cmltKCk7cmV0dXJuIG9bMF19KShlKTtjW2RdPW8ocD97W1wiQGtleWZyYW1lcyBcIitkXTp0fTp0LHI/XCJcIjpcIi5cIitkKX1sZXQgZj1yJiZjLmc/Yy5nOm51bGw7cmV0dXJuIHImJihjLmc9Y1tkXSksKChlLHQscixsKT0+e2w/dC5kYXRhPXQuZGF0YS5yZXBsYWNlKGwsZSk6LTE9PT10LmRhdGEuaW5kZXhPZihlKSYmKHQuZGF0YT1yP2UrdC5kYXRhOnQuZGF0YStlKX0pKGNbZF0sdCxpLGYpLGR9LHA9KGUsdCxyKT0+ZS5yZWR1Y2UoKGUsbCxhKT0+e2xldCBuPXRbYV07aWYobiYmbi5jYWxsKXtsZXQgZT1uKHIpLHQ9ZSYmZS5wcm9wcyYmZS5wcm9wcy5jbGFzc05hbWV8fC9eZ28vLnRlc3QoZSkmJmU7bj10P1wiLlwiK3Q6ZSYmXCJvYmplY3RcIj09dHlwZW9mIGU/ZS5wcm9wcz9cIlwiOm8oZSxcIlwiKTohMT09PWU/XCJcIjplfXJldHVybiBlK2wrKG51bGw9PW4/XCJcIjpuKX0sXCJcIik7ZnVuY3Rpb24gdShlKXtsZXQgcj10aGlzfHx7fSxsPWUuY2FsbD9lKHIucCk6ZTtyZXR1cm4gaShsLnVuc2hpZnQ/bC5yYXc/cChsLFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLHIucCk6bC5yZWR1Y2UoKGUsdCk9Pk9iamVjdC5hc3NpZ24oZSx0JiZ0LmNhbGw/dChyLnApOnQpLHt9KTpsLHQoci50YXJnZXQpLHIuZyxyLm8sci5rKX1sZXQgZCxmLGcsYj11LmJpbmQoe2c6MX0pLGg9dS5iaW5kKHtrOjF9KTtmdW5jdGlvbiBtKGUsdCxyLGwpe28ucD10LGQ9ZSxmPXIsZz1sfWZ1bmN0aW9uIHcoZSx0KXtsZXQgcj10aGlzfHx7fTtyZXR1cm4gZnVuY3Rpb24oKXtsZXQgbD1hcmd1bWVudHM7ZnVuY3Rpb24gYShuLG8pe2xldCBjPU9iamVjdC5hc3NpZ24oe30sbikscz1jLmNsYXNzTmFtZXx8YS5jbGFzc05hbWU7ci5wPU9iamVjdC5hc3NpZ24oe3RoZW1lOmYmJmYoKX0sYyksci5vPS8gKmdvXFxkKy8udGVzdChzKSxjLmNsYXNzTmFtZT11LmFwcGx5KHIsbCkrKHM/XCIgXCIrczpcIlwiKSx0JiYoYy5yZWY9byk7bGV0IGk9ZTtyZXR1cm4gZVswXSYmKGk9Yy5hc3x8ZSxkZWxldGUgYy5hcyksZyYmaVswXSYmZyhjKSxkKGksYyl9cmV0dXJuIHQ/dChhKTphfX1leHBvcnR7dSBhcyBjc3MsciBhcyBleHRyYWN0Q3NzLGIgYXMgZ2xvYixoIGFzIGtleWZyYW1lcyxtIGFzIHNldHVwLHcgYXMgc3R5bGVkfTtcbiIsIi8qIVxuKiBzd2VldGFsZXJ0MiB2MTEuMjYuM1xuKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwuU3dlZXRhbGVydDIgPSBmYWN0b3J5KCkpO1xufSkodGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIF9hc3NlcnRDbGFzc0JyYW5kKGUsIHQsIG4pIHtcbiAgICBpZiAoXCJmdW5jdGlvblwiID09IHR5cGVvZiBlID8gZSA9PT0gdCA6IGUuaGFzKHQpKSByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0IDogbjtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50IG9uIHRoaXMgb2JqZWN0XCIpO1xuICB9XG4gIGZ1bmN0aW9uIF9jaGVja1ByaXZhdGVSZWRlY2xhcmF0aW9uKGUsIHQpIHtcbiAgICBpZiAodC5oYXMoZSkpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgaW5pdGlhbGl6ZSB0aGUgc2FtZSBwcml2YXRlIGVsZW1lbnRzIHR3aWNlIG9uIGFuIG9iamVjdFwiKTtcbiAgfVxuICBmdW5jdGlvbiBfY2xhc3NQcml2YXRlRmllbGRHZXQyKHMsIGEpIHtcbiAgICByZXR1cm4gcy5nZXQoX2Fzc2VydENsYXNzQnJhbmQocywgYSkpO1xuICB9XG4gIGZ1bmN0aW9uIF9jbGFzc1ByaXZhdGVGaWVsZEluaXRTcGVjKGUsIHQsIGEpIHtcbiAgICBfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbihlLCB0KSwgdC5zZXQoZSwgYSk7XG4gIH1cbiAgZnVuY3Rpb24gX2NsYXNzUHJpdmF0ZUZpZWxkU2V0MihzLCBhLCByKSB7XG4gICAgcmV0dXJuIHMuc2V0KF9hc3NlcnRDbGFzc0JyYW5kKHMsIGEpLCByKSwgcjtcbiAgfVxuXG4gIGNvbnN0IFJFU1RPUkVfRk9DVVNfVElNRU9VVCA9IDEwMDtcblxuICAvKiogQHR5cGUge0dsb2JhbFN0YXRlfSAqL1xuICBjb25zdCBnbG9iYWxTdGF0ZSA9IHt9O1xuICBjb25zdCBmb2N1c1ByZXZpb3VzQWN0aXZlRWxlbWVudCA9ICgpID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuZm9jdXMoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlc3RvcmUgcHJldmlvdXMgYWN0aXZlIChmb2N1c2VkKSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmV0dXJuRm9jdXNcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBjb25zdCByZXN0b3JlQWN0aXZlRWxlbWVudCA9IHJldHVybkZvY3VzID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoIXJldHVybkZvY3VzKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICBjb25zdCB4ID0gd2luZG93LnNjcm9sbFg7XG4gICAgICBjb25zdCB5ID0gd2luZG93LnNjcm9sbFk7XG4gICAgICBnbG9iYWxTdGF0ZS5yZXN0b3JlRm9jdXNUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZvY3VzUHJldmlvdXNBY3RpdmVFbGVtZW50KCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0sIFJFU1RPUkVfRk9DVVNfVElNRU9VVCk7IC8vIGlzc3Vlcy85MDBcblxuICAgICAgd2luZG93LnNjcm9sbFRvKHgsIHkpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHN3YWxQcmVmaXggPSAnc3dhbDItJztcblxuICAvKipcbiAgICogQHR5cGVkZWYge1JlY29yZDxTd2FsQ2xhc3MsIHN0cmluZz59IFN3YWxDbGFzc2VzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7J3N1Y2Nlc3MnIHwgJ3dhcm5pbmcnIHwgJ2luZm8nIHwgJ3F1ZXN0aW9uJyB8ICdlcnJvcid9IFN3YWxJY29uXG4gICAqIEB0eXBlZGVmIHtSZWNvcmQ8U3dhbEljb24sIHN0cmluZz59IFN3YWxJY29uc1xuICAgKi9cblxuICAvKiogQHR5cGUge1N3YWxDbGFzc1tdfSAqL1xuICBjb25zdCBjbGFzc05hbWVzID0gWydjb250YWluZXInLCAnc2hvd24nLCAnaGVpZ2h0LWF1dG8nLCAnaW9zZml4JywgJ3BvcHVwJywgJ21vZGFsJywgJ25vLWJhY2tkcm9wJywgJ25vLXRyYW5zaXRpb24nLCAndG9hc3QnLCAndG9hc3Qtc2hvd24nLCAnc2hvdycsICdoaWRlJywgJ2Nsb3NlJywgJ3RpdGxlJywgJ2h0bWwtY29udGFpbmVyJywgJ2FjdGlvbnMnLCAnY29uZmlybScsICdkZW55JywgJ2NhbmNlbCcsICdmb290ZXInLCAnaWNvbicsICdpY29uLWNvbnRlbnQnLCAnaW1hZ2UnLCAnaW5wdXQnLCAnZmlsZScsICdyYW5nZScsICdzZWxlY3QnLCAncmFkaW8nLCAnY2hlY2tib3gnLCAnbGFiZWwnLCAndGV4dGFyZWEnLCAnaW5wdXRlcnJvcicsICdpbnB1dC1sYWJlbCcsICd2YWxpZGF0aW9uLW1lc3NhZ2UnLCAncHJvZ3Jlc3Mtc3RlcHMnLCAnYWN0aXZlLXByb2dyZXNzLXN0ZXAnLCAncHJvZ3Jlc3Mtc3RlcCcsICdwcm9ncmVzcy1zdGVwLWxpbmUnLCAnbG9hZGVyJywgJ2xvYWRpbmcnLCAnc3R5bGVkJywgJ3RvcCcsICd0b3Atc3RhcnQnLCAndG9wLWVuZCcsICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnY2VudGVyJywgJ2NlbnRlci1zdGFydCcsICdjZW50ZXItZW5kJywgJ2NlbnRlci1sZWZ0JywgJ2NlbnRlci1yaWdodCcsICdib3R0b20nLCAnYm90dG9tLXN0YXJ0JywgJ2JvdHRvbS1lbmQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JywgJ2dyb3ctcm93JywgJ2dyb3ctY29sdW1uJywgJ2dyb3ctZnVsbHNjcmVlbicsICdydGwnLCAndGltZXItcHJvZ3Jlc3MtYmFyJywgJ3RpbWVyLXByb2dyZXNzLWJhci1jb250YWluZXInLCAnc2Nyb2xsYmFyLW1lYXN1cmUnLCAnaWNvbi1zdWNjZXNzJywgJ2ljb24td2FybmluZycsICdpY29uLWluZm8nLCAnaWNvbi1xdWVzdGlvbicsICdpY29uLWVycm9yJywgJ2RyYWdnYWJsZScsICdkcmFnZ2luZyddO1xuICBjb25zdCBzd2FsQ2xhc3NlcyA9IGNsYXNzTmFtZXMucmVkdWNlKChhY2MsIGNsYXNzTmFtZSkgPT4ge1xuICAgIGFjY1tjbGFzc05hbWVdID0gc3dhbFByZWZpeCArIGNsYXNzTmFtZTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCAvKiogQHR5cGUge1N3YWxDbGFzc2VzfSAqL3t9KTtcblxuICAvKiogQHR5cGUge1N3YWxJY29uW119ICovXG4gIGNvbnN0IGljb25zID0gWydzdWNjZXNzJywgJ3dhcm5pbmcnLCAnaW5mbycsICdxdWVzdGlvbicsICdlcnJvciddO1xuICBjb25zdCBpY29uVHlwZXMgPSBpY29ucy5yZWR1Y2UoKGFjYywgaWNvbikgPT4ge1xuICAgIGFjY1tpY29uXSA9IHN3YWxQcmVmaXggKyBpY29uO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIC8qKiBAdHlwZSB7U3dhbEljb25zfSAqL3t9KTtcblxuICBjb25zdCBjb25zb2xlUHJlZml4ID0gJ1N3ZWV0QWxlcnQyOic7XG5cbiAgLyoqXG4gICAqIENhcGl0YWxpemUgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBjb25zdCBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBzdHIgPT4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuXG4gIC8qKlxuICAgKiBTdGFuZGFyZGl6ZSBjb25zb2xlIHdhcm5pbmdzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW119IG1lc3NhZ2VcbiAgICovXG4gIGNvbnN0IHdhcm4gPSBtZXNzYWdlID0+IHtcbiAgICBjb25zb2xlLndhcm4oYCR7Y29uc29sZVByZWZpeH0gJHt0eXBlb2YgbWVzc2FnZSA9PT0gJ29iamVjdCcgPyBtZXNzYWdlLmpvaW4oJyAnKSA6IG1lc3NhZ2V9YCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkaXplIGNvbnNvbGUgZXJyb3JzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICBjb25zdCBlcnJvciA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoYCR7Y29uc29sZVByZWZpeH0gJHttZXNzYWdlfWApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQcml2YXRlIGdsb2JhbCBzdGF0ZSBmb3IgYHdhcm5PbmNlYFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25zdCBwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMgPSBbXTtcblxuICAvKipcbiAgICogU2hvdyBhIGNvbnNvbGUgd2FybmluZywgYnV0IG9ubHkgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBzaG93blxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cbiAgY29uc3Qgd2Fybk9uY2UgPSBtZXNzYWdlID0+IHtcbiAgICBpZiAoIXByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcy5pbmNsdWRlcyhtZXNzYWdlKSkge1xuICAgICAgcHJldmlvdXNXYXJuT25jZU1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICB3YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2hvdyBhIG9uZS10aW1lIGNvbnNvbGUgd2FybmluZyBhYm91dCBkZXByZWNhdGVkIHBhcmFtcy9tZXRob2RzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZXByZWNhdGVkUGFyYW1cbiAgICogQHBhcmFtIHtzdHJpbmc/fSB1c2VJbnN0ZWFkXG4gICAqL1xuICBjb25zdCB3YXJuQWJvdXREZXByZWNhdGlvbiA9IChkZXByZWNhdGVkUGFyYW0sIHVzZUluc3RlYWQgPSBudWxsKSA9PiB7XG4gICAgd2Fybk9uY2UoYFwiJHtkZXByZWNhdGVkUGFyYW19XCIgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuJHt1c2VJbnN0ZWFkID8gYCBVc2UgXCIke3VzZUluc3RlYWR9XCIgaW5zdGVhZC5gIDogJyd9YCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIElmIGBhcmdgIGlzIGEgZnVuY3Rpb24sIGNhbGwgaXQgKHdpdGggbm8gYXJndW1lbnRzIG9yIGNvbnRleHQpIGFuZCByZXR1cm4gdGhlIHJlc3VsdC5cbiAgICogT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHZhbHVlIHRocm91Z2hcbiAgICpcbiAgICogQHBhcmFtIHsoKCkgPT4gKikgfCAqfSBhcmdcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBjb25zdCBjYWxsSWZGdW5jdGlvbiA9IGFyZyA9PiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nID8gYXJnKCkgOiBhcmc7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Kn0gYXJnXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaGFzVG9Qcm9taXNlRm4gPSBhcmcgPT4gYXJnICYmIHR5cGVvZiBhcmcudG9Qcm9taXNlID09PSAnZnVuY3Rpb24nO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IGFyZ1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTwqPn1cbiAgICovXG4gIGNvbnN0IGFzUHJvbWlzZSA9IGFyZyA9PiBoYXNUb1Byb21pc2VGbihhcmcpID8gYXJnLnRvUHJvbWlzZSgpIDogUHJvbWlzZS5yZXNvbHZlKGFyZyk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Kn0gYXJnXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNQcm9taXNlID0gYXJnID0+IGFyZyAmJiBQcm9taXNlLnJlc29sdmUoYXJnKSA9PT0gYXJnO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwb3B1cCBjb250YWluZXIgd2hpY2ggY29udGFpbnMgdGhlIGJhY2tkcm9wIGFuZCB0aGUgcG9wdXAgaXRzZWxmLlxuICAgKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Q29udGFpbmVyID0gKCkgPT4gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKGAuJHtzd2FsQ2xhc3Nlcy5jb250YWluZXJ9YCk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclN0cmluZ1xuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZWxlbWVudEJ5U2VsZWN0b3IgPSBzZWxlY3RvclN0cmluZyA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcmV0dXJuIGNvbnRhaW5lciA/IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yU3RyaW5nKSA6IG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGVsZW1lbnRCeUNsYXNzID0gY2xhc3NOYW1lID0+IHtcbiAgICByZXR1cm4gZWxlbWVudEJ5U2VsZWN0b3IoYC4ke2NsYXNzTmFtZX1gKTtcbiAgfTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldFBvcHVwID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMucG9wdXApO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0SWNvbiA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmljb24pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0SWNvbkNvbnRlbnQgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1snaWNvbi1jb250ZW50J10pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0VGl0bGUgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy50aXRsZSk7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICBjb25zdCBnZXRIdG1sQ29udGFpbmVyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0SW1hZ2UgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5pbWFnZSk7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICBjb25zdCBnZXRQcm9ncmVzc1N0ZXBzID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXBzJ10pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0VmFsaWRhdGlvbk1lc3NhZ2UgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Q29uZmlybUJ1dHRvbiA9ICgpID0+ICgvKiogQHR5cGUge0hUTUxCdXR0b25FbGVtZW50fSAqL2VsZW1lbnRCeVNlbGVjdG9yKGAuJHtzd2FsQ2xhc3Nlcy5hY3Rpb25zfSAuJHtzd2FsQ2xhc3Nlcy5jb25maXJtfWApKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxCdXR0b25FbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldENhbmNlbEJ1dHRvbiA9ICgpID0+ICgvKiogQHR5cGUge0hUTUxCdXR0b25FbGVtZW50fSAqL2VsZW1lbnRCeVNlbGVjdG9yKGAuJHtzd2FsQ2xhc3Nlcy5hY3Rpb25zfSAuJHtzd2FsQ2xhc3Nlcy5jYW5jZWx9YCkpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0RGVueUJ1dHRvbiA9ICgpID0+ICgvKiogQHR5cGUge0hUTUxCdXR0b25FbGVtZW50fSAqL2VsZW1lbnRCeVNlbGVjdG9yKGAuJHtzd2FsQ2xhc3Nlcy5hY3Rpb25zfSAuJHtzd2FsQ2xhc3Nlcy5kZW55fWApKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldElucHV0TGFiZWwgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1snaW5wdXQtbGFiZWwnXSk7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICBjb25zdCBnZXRMb2FkZXIgPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihgLiR7c3dhbENsYXNzZXMubG9hZGVyfWApO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0QWN0aW9ucyA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmFjdGlvbnMpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Rm9vdGVyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuZm9vdGVyKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldFRpbWVyUHJvZ3Jlc3NCYXIgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyJ10pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Q2xvc2VCdXR0b24gPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5jbG9zZSk7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2prdXAvZm9jdXNhYmxlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4gIGNvbnN0IGZvY3VzYWJsZSA9IGBcbiAgYVtocmVmXSxcbiAgYXJlYVtocmVmXSxcbiAgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLFxuICBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLFxuICB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksXG4gIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksXG4gIGlmcmFtZSxcbiAgb2JqZWN0LFxuICBlbWJlZCxcbiAgW3RhYmluZGV4PVwiMFwiXSxcbiAgW2NvbnRlbnRlZGl0YWJsZV0sXG4gIGF1ZGlvW2NvbnRyb2xzXSxcbiAgdmlkZW9bY29udHJvbHNdLFxuICBzdW1tYXJ5XG5gO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119XG4gICAqL1xuICBjb25zdCBnZXRGb2N1c2FibGVFbGVtZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKCFwb3B1cCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvKiogQHR5cGUge05vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+fSAqL1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzV2l0aFRhYmluZGV4ID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbdGFiaW5kZXg9XCIwXCJdKScpO1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzV2l0aFRhYmluZGV4U29ydGVkID0gQXJyYXkuZnJvbShmb2N1c2FibGVFbGVtZW50c1dpdGhUYWJpbmRleClcbiAgICAvLyBzb3J0IGFjY29yZGluZyB0byB0YWJpbmRleFxuICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCB0YWJpbmRleEEgPSBwYXJzZUludChhLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB8fCAnMCcpO1xuICAgICAgY29uc3QgdGFiaW5kZXhCID0gcGFyc2VJbnQoYi5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgfHwgJzAnKTtcbiAgICAgIGlmICh0YWJpbmRleEEgPiB0YWJpbmRleEIpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2UgaWYgKHRhYmluZGV4QSA8IHRhYmluZGV4Qikge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICAgIC8qKiBAdHlwZSB7Tm9kZUxpc3RPZjxIVE1MRWxlbWVudD59ICovXG4gICAgY29uc3Qgb3RoZXJGb2N1c2FibGVFbGVtZW50cyA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlKTtcbiAgICBjb25zdCBvdGhlckZvY3VzYWJsZUVsZW1lbnRzRmlsdGVyZWQgPSBBcnJheS5mcm9tKG90aGVyRm9jdXNhYmxlRWxlbWVudHMpLmZpbHRlcihlbCA9PiBlbC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgIT09ICctMScpO1xuICAgIHJldHVybiBbLi4ubmV3IFNldChmb2N1c2FibGVFbGVtZW50c1dpdGhUYWJpbmRleFNvcnRlZC5jb25jYXQob3RoZXJGb2N1c2FibGVFbGVtZW50c0ZpbHRlcmVkKSldLmZpbHRlcihlbCA9PiBpc1Zpc2libGUkMShlbCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGlzTW9kYWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLnNob3duKSAmJiAhaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ10pICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNUb2FzdCA9ICgpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKCFwb3B1cCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gaGFzQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnRvYXN0KTtcbiAgfTtcblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc0xvYWRpbmcgPSAoKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICghcG9wdXApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHBvcHVwLmhhc0F0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNlY3VyZWx5IHNldCBpbm5lckhUTUwgb2YgYW4gZWxlbWVudFxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE5MjZcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuICAgKi9cbiAgY29uc3Qgc2V0SW5uZXJIdG1sID0gKGVsZW0sIGh0bWwpID0+IHtcbiAgICBlbGVtLnRleHRDb250ZW50ID0gJyc7XG4gICAgaWYgKGh0bWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgYHRleHQvaHRtbGApO1xuICAgICAgY29uc3QgaGVhZCA9IHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdoZWFkJyk7XG4gICAgICBpZiAoaGVhZCkge1xuICAgICAgICBBcnJheS5mcm9tKGhlYWQuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgYm9keSA9IHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG4gICAgICBpZiAoYm9keSkge1xuICAgICAgICBBcnJheS5mcm9tKGJvZHkuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCB8fCBjaGlsZCBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY2hpbGQuY2xvbmVOb2RlKHRydWUpKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yNTA3XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBoYXNDbGFzcyA9IChlbGVtLCBjbGFzc05hbWUpID0+IHtcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBjbGFzc0xpc3QgPSBjbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFlbGVtLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc0xpc3RbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW1vdmVDdXN0b21DbGFzc2VzID0gKGVsZW0sIHBhcmFtcykgPT4ge1xuICAgIEFycmF5LmZyb20oZWxlbS5jbGFzc0xpc3QpLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIGlmICghT2JqZWN0LnZhbHVlcyhzd2FsQ2xhc3NlcykuaW5jbHVkZXMoY2xhc3NOYW1lKSAmJiAhT2JqZWN0LnZhbHVlcyhpY29uVHlwZXMpLmluY2x1ZGVzKGNsYXNzTmFtZSkgJiYgIU9iamVjdC52YWx1ZXMocGFyYW1zLnNob3dDbGFzcyB8fCB7fSkuaW5jbHVkZXMoY2xhc3NOYW1lKSkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKi9cbiAgY29uc3QgYXBwbHlDdXN0b21DbGFzcyA9IChlbGVtLCBwYXJhbXMsIGNsYXNzTmFtZSkgPT4ge1xuICAgIHJlbW92ZUN1c3RvbUNsYXNzZXMoZWxlbSwgcGFyYW1zKTtcbiAgICBpZiAoIXBhcmFtcy5jdXN0b21DbGFzcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjdXN0b21DbGFzcyA9IHBhcmFtcy5jdXN0b21DbGFzc1soLyoqIEB0eXBlIHtrZXlvZiBTd2VldEFsZXJ0Q3VzdG9tQ2xhc3N9ICovY2xhc3NOYW1lKV07XG4gICAgaWYgKCFjdXN0b21DbGFzcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGN1c3RvbUNsYXNzICE9PSAnc3RyaW5nJyAmJiAhY3VzdG9tQ2xhc3MuZm9yRWFjaCkge1xuICAgICAgd2FybihgSW52YWxpZCB0eXBlIG9mIGN1c3RvbUNsYXNzLiR7Y2xhc3NOYW1lfSEgRXhwZWN0ZWQgc3RyaW5nIG9yIGl0ZXJhYmxlIG9iamVjdCwgZ290IFwiJHt0eXBlb2YgY3VzdG9tQ2xhc3N9XCJgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYWRkQ2xhc3MoZWxlbSwgY3VzdG9tQ2xhc3MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge2ltcG9ydCgnLi9yZW5kZXJlcnMvcmVuZGVySW5wdXQnKS5JbnB1dENsYXNzIHwgU3dlZXRBbGVydElucHV0fSBpbnB1dENsYXNzXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldElucHV0JDEgPSAocG9wdXAsIGlucHV0Q2xhc3MpID0+IHtcbiAgICBpZiAoIWlucHV0Q2xhc3MpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzd2l0Y2ggKGlucHV0Q2xhc3MpIHtcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoYC4ke3N3YWxDbGFzc2VzLnBvcHVwfSA+IC4ke3N3YWxDbGFzc2VzW2lucHV0Q2xhc3NdfWApO1xuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihgLiR7c3dhbENsYXNzZXMucG9wdXB9ID4gLiR7c3dhbENsYXNzZXMuY2hlY2tib3h9IGlucHV0YCk7XG4gICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKGAuJHtzd2FsQ2xhc3Nlcy5wb3B1cH0gPiAuJHtzd2FsQ2xhc3Nlcy5yYWRpb30gaW5wdXQ6Y2hlY2tlZGApIHx8IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoYC4ke3N3YWxDbGFzc2VzLnBvcHVwfSA+IC4ke3N3YWxDbGFzc2VzLnJhZGlvfSBpbnB1dDpmaXJzdC1jaGlsZGApO1xuICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihgLiR7c3dhbENsYXNzZXMucG9wdXB9ID4gLiR7c3dhbENsYXNzZXMucmFuZ2V9IGlucHV0YCk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihgLiR7c3dhbENsYXNzZXMucG9wdXB9ID4gLiR7c3dhbENsYXNzZXMuaW5wdXR9YCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnR9IGlucHV0XG4gICAqL1xuICBjb25zdCBmb2N1c0lucHV0ID0gaW5wdXQgPT4ge1xuICAgIGlucHV0LmZvY3VzKCk7XG5cbiAgICAvLyBwbGFjZSBjdXJzb3IgYXQgZW5kIG9mIHRleHQgaW4gdGV4dCBpbnB1dFxuICAgIGlmIChpbnB1dC50eXBlICE9PSAnZmlsZScpIHtcbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIzNDU5MTVcbiAgICAgIGNvbnN0IHZhbCA9IGlucHV0LnZhbHVlO1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgIGlucHV0LnZhbHVlID0gdmFsO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdIHwgdW5kZWZpbmVkfSBjbGFzc0xpc3RcbiAgICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb25cbiAgICovXG4gIGNvbnN0IHRvZ2dsZUNsYXNzID0gKHRhcmdldCwgY2xhc3NMaXN0LCBjb25kaXRpb24pID0+IHtcbiAgICBpZiAoIXRhcmdldCB8fCAhY2xhc3NMaXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY2xhc3NMaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgY2xhc3NMaXN0ID0gY2xhc3NMaXN0LnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cbiAgICBjbGFzc0xpc3QuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdIHwgdW5kZWZpbmVkfSBjbGFzc0xpc3RcbiAgICovXG4gIGNvbnN0IGFkZENsYXNzID0gKHRhcmdldCwgY2xhc3NMaXN0KSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3ModGFyZ2V0LCBjbGFzc0xpc3QsIHRydWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW10gfCB1bmRlZmluZWR9IGNsYXNzTGlzdFxuICAgKi9cbiAgY29uc3QgcmVtb3ZlQ2xhc3MgPSAodGFyZ2V0LCBjbGFzc0xpc3QpID0+IHtcbiAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIGNsYXNzTGlzdCwgZmFsc2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgZGlyZWN0IGNoaWxkIG9mIGFuIGVsZW1lbnQgYnkgY2xhc3MgbmFtZVxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgY29uc3QgZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzID0gKGVsZW0sIGNsYXNzTmFtZSkgPT4ge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShlbGVtLmNoaWxkcmVuKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgaGFzQ2xhc3MoY2hpbGQsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkfSB2YWx1ZVxuICAgKi9cbiAgY29uc3QgYXBwbHlOdW1lcmljYWxTdHlsZSA9IChlbGVtLCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IGAke3BhcnNlSW50KGAke3ZhbHVlfWApfWApIHtcbiAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgfHwgcGFyc2VJbnQoYCR7dmFsdWV9YCkgPT09IDApIHtcbiAgICAgIGVsZW0uc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyBgJHt2YWx1ZX1weGAgOiB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcGVydHkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IG51bGx9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpc3BsYXlcbiAgICovXG4gIGNvbnN0IHNob3cgPSAoZWxlbSwgZGlzcGxheSA9ICdmbGV4JykgPT4ge1xuICAgIGlmICghZWxlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgbnVsbH0gZWxlbVxuICAgKi9cbiAgY29uc3QgaGlkZSA9IGVsZW0gPT4ge1xuICAgIGlmICghZWxlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBudWxsfSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwbGF5XG4gICAqL1xuICBjb25zdCBzaG93V2hlbklubmVySHRtbFByZXNlbnQgPSAoZWxlbSwgZGlzcGxheSA9ICdibG9jaycpID0+IHtcbiAgICBpZiAoIWVsZW0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgdG9nZ2xlKGVsZW0sIGVsZW0uaW5uZXJIVE1MLCBkaXNwbGF5KTtcbiAgICB9KS5vYnNlcnZlKGVsZW0sIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIHN1YnRyZWU6IHRydWVcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAqL1xuICBjb25zdCBzZXRTdHlsZSA9IChwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH0gKi9cbiAgICBjb25zdCBlbCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCB2YWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7Ym9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWR9IGNvbmRpdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlzcGxheVxuICAgKi9cbiAgY29uc3QgdG9nZ2xlID0gKGVsZW0sIGNvbmRpdGlvbiwgZGlzcGxheSA9ICdmbGV4JykgPT4ge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHNob3coZWxlbSwgZGlzcGxheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGUoZWxlbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBib3Jyb3dlZCBmcm9tIGpxdWVyeSAkKGVsZW0pLmlzKCc6dmlzaWJsZScpIGltcGxlbWVudGF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBudWxsfSBlbGVtXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNWaXNpYmxlJDEgPSBlbGVtID0+ICEhKGVsZW0gJiYgKGVsZW0ub2Zmc2V0V2lkdGggfHwgZWxlbS5vZmZzZXRIZWlnaHQgfHwgZWxlbS5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCkpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGFsbEJ1dHRvbnNBcmVIaWRkZW4gPSAoKSA9PiAhaXNWaXNpYmxlJDEoZ2V0Q29uZmlybUJ1dHRvbigpKSAmJiAhaXNWaXNpYmxlJDEoZ2V0RGVueUJ1dHRvbigpKSAmJiAhaXNWaXNpYmxlJDEoZ2V0Q2FuY2VsQnV0dG9uKCkpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNTY3JvbGxhYmxlID0gZWxlbSA9PiAhIShlbGVtLnNjcm9sbEhlaWdodCA+IGVsZW0uY2xpZW50SGVpZ2h0KTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzdG9wRWxlbWVudFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IHNlbGZPclBhcmVudElzU2Nyb2xsYWJsZSA9IChlbGVtZW50LCBzdG9wRWxlbWVudCkgPT4ge1xuICAgIGxldCBwYXJlbnQgPSBlbGVtZW50O1xuICAgIHdoaWxlIChwYXJlbnQgJiYgcGFyZW50ICE9PSBzdG9wRWxlbWVudCkge1xuICAgICAgaWYgKGlzU2Nyb2xsYWJsZShwYXJlbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogYm9ycm93ZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDYzNTIxMTlcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGhhc0Nzc0FuaW1hdGlvbiA9IGVsZW0gPT4ge1xuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG4gICAgY29uc3QgYW5pbUR1cmF0aW9uID0gcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdhbmltYXRpb24tZHVyYXRpb24nKSB8fCAnMCcpO1xuICAgIGNvbnN0IHRyYW5zRHVyYXRpb24gPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zaXRpb24tZHVyYXRpb24nKSB8fCAnMCcpO1xuICAgIHJldHVybiBhbmltRHVyYXRpb24gPiAwIHx8IHRyYW5zRHVyYXRpb24gPiAwO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXJcbiAgICogQHBhcmFtIHtib29sZWFufSByZXNldFxuICAgKi9cbiAgY29uc3QgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIgPSAodGltZXIsIHJlc2V0ID0gZmFsc2UpID0+IHtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuICAgIGlmICghdGltZXJQcm9ncmVzc0Jhcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNWaXNpYmxlJDEodGltZXJQcm9ncmVzc0JhcikpIHtcbiAgICAgIGlmIChyZXNldCkge1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS50cmFuc2l0aW9uID0gYHdpZHRoICR7dGltZXIgLyAxMDAwfXMgbGluZWFyYDtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcwJSc7XG4gICAgICB9LCAxMCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBzdG9wVGltZXJQcm9ncmVzc0JhciA9ICgpID0+IHtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuICAgIGlmICghdGltZXJQcm9ncmVzc0Jhcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lclByb2dyZXNzQmFyKS53aWR0aCk7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbicpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhckZ1bGxXaWR0aCA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRpbWVyUHJvZ3Jlc3NCYXIpLndpZHRoKTtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyUGVyY2VudCA9IHRpbWVyUHJvZ3Jlc3NCYXJXaWR0aCAvIHRpbWVyUHJvZ3Jlc3NCYXJGdWxsV2lkdGggKiAxMDA7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAke3RpbWVyUHJvZ3Jlc3NCYXJQZXJjZW50fSVgO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZXRlY3QgTm9kZSBlbnZcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc05vZGVFbnYgPSAoKSA9PiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnO1xuXG4gIGNvbnN0IHN3ZWV0SFRNTCA9IGBcbiA8ZGl2IGFyaWEtbGFiZWxsZWRieT1cIiR7c3dhbENsYXNzZXMudGl0bGV9XCIgYXJpYS1kZXNjcmliZWRieT1cIiR7c3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ119XCIgY2xhc3M9XCIke3N3YWxDbGFzc2VzLnBvcHVwfVwiIHRhYmluZGV4PVwiLTFcIj5cbiAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtzd2FsQ2xhc3Nlcy5jbG9zZX1cIj48L2J1dHRvbj5cbiAgIDx1bCBjbGFzcz1cIiR7c3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXBzJ119XCI+PC91bD5cbiAgIDxkaXYgY2xhc3M9XCIke3N3YWxDbGFzc2VzLmljb259XCI+PC9kaXY+XG4gICA8aW1nIGNsYXNzPVwiJHtzd2FsQ2xhc3Nlcy5pbWFnZX1cIiAvPlxuICAgPGgyIGNsYXNzPVwiJHtzd2FsQ2xhc3Nlcy50aXRsZX1cIiBpZD1cIiR7c3dhbENsYXNzZXMudGl0bGV9XCI+PC9oMj5cbiAgIDxkaXYgY2xhc3M9XCIke3N3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddfVwiIGlkPVwiJHtzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXX1cIj48L2Rpdj5cbiAgIDxpbnB1dCBjbGFzcz1cIiR7c3dhbENsYXNzZXMuaW5wdXR9XCIgaWQ9XCIke3N3YWxDbGFzc2VzLmlucHV0fVwiIC8+XG4gICA8aW5wdXQgdHlwZT1cImZpbGVcIiBjbGFzcz1cIiR7c3dhbENsYXNzZXMuZmlsZX1cIiAvPlxuICAgPGRpdiBjbGFzcz1cIiR7c3dhbENsYXNzZXMucmFuZ2V9XCI+XG4gICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiAvPlxuICAgICA8b3V0cHV0Pjwvb3V0cHV0PlxuICAgPC9kaXY+XG4gICA8c2VsZWN0IGNsYXNzPVwiJHtzd2FsQ2xhc3Nlcy5zZWxlY3R9XCIgaWQ9XCIke3N3YWxDbGFzc2VzLnNlbGVjdH1cIj48L3NlbGVjdD5cbiAgIDxkaXYgY2xhc3M9XCIke3N3YWxDbGFzc2VzLnJhZGlvfVwiPjwvZGl2PlxuICAgPGxhYmVsIGNsYXNzPVwiJHtzd2FsQ2xhc3Nlcy5jaGVja2JveH1cIj5cbiAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiJHtzd2FsQ2xhc3Nlcy5jaGVja2JveH1cIiAvPlxuICAgICA8c3BhbiBjbGFzcz1cIiR7c3dhbENsYXNzZXMubGFiZWx9XCI+PC9zcGFuPlxuICAgPC9sYWJlbD5cbiAgIDx0ZXh0YXJlYSBjbGFzcz1cIiR7c3dhbENsYXNzZXMudGV4dGFyZWF9XCIgaWQ9XCIke3N3YWxDbGFzc2VzLnRleHRhcmVhfVwiPjwvdGV4dGFyZWE+XG4gICA8ZGl2IGNsYXNzPVwiJHtzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ119XCIgaWQ9XCIke3N3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXX1cIj48L2Rpdj5cbiAgIDxkaXYgY2xhc3M9XCIke3N3YWxDbGFzc2VzLmFjdGlvbnN9XCI+XG4gICAgIDxkaXYgY2xhc3M9XCIke3N3YWxDbGFzc2VzLmxvYWRlcn1cIj48L2Rpdj5cbiAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCIke3N3YWxDbGFzc2VzLmNvbmZpcm19XCI+PC9idXR0b24+XG4gICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtzd2FsQ2xhc3Nlcy5kZW55fVwiPjwvYnV0dG9uPlxuICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIiR7c3dhbENsYXNzZXMuY2FuY2VsfVwiPjwvYnV0dG9uPlxuICAgPC9kaXY+XG4gICA8ZGl2IGNsYXNzPVwiJHtzd2FsQ2xhc3Nlcy5mb290ZXJ9XCI+PC9kaXY+XG4gICA8ZGl2IGNsYXNzPVwiJHtzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciddfVwiPlxuICAgICA8ZGl2IGNsYXNzPVwiJHtzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyJ119XCI+PC9kaXY+XG4gICA8L2Rpdj5cbiA8L2Rpdj5cbmAucmVwbGFjZSgvKF58XFxuKVxccyovZywgJycpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IHJlc2V0T2xkQ29udGFpbmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG9sZENvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGlmICghb2xkQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9sZENvbnRhaW5lci5yZW1vdmUoKTtcbiAgICByZW1vdmVDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgW3N3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSwgc3dhbENsYXNzZXNbJ2hhcy1jb2x1bW4nXV0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICBjb25zdCByZXNldFZhbGlkYXRpb25NZXNzYWdlJDEgPSAoKSA9PiB7XG4gICAgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgfTtcbiAgY29uc3QgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5pbnB1dCk7XG4gICAgY29uc3QgZmlsZSA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuZmlsZSk7XG4gICAgLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqL1xuICAgIGNvbnN0IHJhbmdlID0gcG9wdXAucXVlcnlTZWxlY3RvcihgLiR7c3dhbENsYXNzZXMucmFuZ2V9IGlucHV0YCk7XG4gICAgLyoqIEB0eXBlIHtIVE1MT3V0cHV0RWxlbWVudH0gKi9cbiAgICBjb25zdCByYW5nZU91dHB1dCA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoYC4ke3N3YWxDbGFzc2VzLnJhbmdlfSBvdXRwdXRgKTtcbiAgICBjb25zdCBzZWxlY3QgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnNlbGVjdCk7XG4gICAgLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqL1xuICAgIGNvbnN0IGNoZWNrYm94ID0gcG9wdXAucXVlcnlTZWxlY3RvcihgLiR7c3dhbENsYXNzZXMuY2hlY2tib3h9IGlucHV0YCk7XG4gICAgY29uc3QgdGV4dGFyZWEgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnRleHRhcmVhKTtcbiAgICBpbnB1dC5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxO1xuICAgIGZpbGUub25jaGFuZ2UgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlJDE7XG4gICAgc2VsZWN0Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxO1xuICAgIGNoZWNrYm94Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxO1xuICAgIHRleHRhcmVhLm9uaW5wdXQgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlJDE7XG4gICAgcmFuZ2Uub25pbnB1dCA9ICgpID0+IHtcbiAgICAgIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UkMSgpO1xuICAgICAgcmFuZ2VPdXRwdXQudmFsdWUgPSByYW5nZS52YWx1ZTtcbiAgICB9O1xuICAgIHJhbmdlLm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxKCk7XG4gICAgICByYW5nZU91dHB1dC52YWx1ZSA9IHJhbmdlLnZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgSFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAqL1xuICBjb25zdCBnZXRUYXJnZXQgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCkgOiB0YXJnZXQ7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3Qgc2V0dXBBY2Nlc3NpYmlsaXR5ID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdyb2xlJywgcGFyYW1zLnRvYXN0ID8gJ2FsZXJ0JyA6ICdkaWFsb2cnKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsIHBhcmFtcy50b2FzdCA/ICdwb2xpdGUnIDogJ2Fzc2VydGl2ZScpO1xuICAgIGlmICghcGFyYW1zLnRvYXN0KSB7XG4gICAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuICAgKi9cbiAgY29uc3Qgc2V0dXBSVEwgPSB0YXJnZXRFbGVtZW50ID0+IHtcbiAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUodGFyZ2V0RWxlbWVudCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgICAgYWRkQ2xhc3MoZ2V0Q29udGFpbmVyKCksIHN3YWxDbGFzc2VzLnJ0bCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgbW9kYWwgKyBiYWNrZHJvcCB0byBET01cbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBpbml0ID0gcGFyYW1zID0+IHtcbiAgICAvLyBDbGVhbiB1cCB0aGUgb2xkIHBvcHVwIGNvbnRhaW5lciBpZiBpdCBleGlzdHNcbiAgICBjb25zdCBvbGRDb250YWluZXJFeGlzdGVkID0gcmVzZXRPbGRDb250YWluZXIoKTtcbiAgICBpZiAoaXNOb2RlRW52KCkpIHtcbiAgICAgIGVycm9yKCdTd2VldEFsZXJ0MiByZXF1aXJlcyBkb2N1bWVudCB0byBpbml0aWFsaXplJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5jb250YWluZXI7XG4gICAgaWYgKG9sZENvbnRhaW5lckV4aXN0ZWQpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbJ25vLXRyYW5zaXRpb24nXSk7XG4gICAgfVxuICAgIHNldElubmVySHRtbChjb250YWluZXIsIHN3ZWV0SFRNTCk7XG4gICAgY29udGFpbmVyLmRhdGFzZXRbJ3N3YWwyVGhlbWUnXSA9IHBhcmFtcy50aGVtZTtcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZ2V0VGFyZ2V0KHBhcmFtcy50YXJnZXQpO1xuICAgIHRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBpZiAocGFyYW1zLnRvcExheWVyKSB7XG4gICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdwb3BvdmVyJywgJycpO1xuICAgICAgY29udGFpbmVyLnNob3dQb3BvdmVyKCk7XG4gICAgfVxuICAgIHNldHVwQWNjZXNzaWJpbGl0eShwYXJhbXMpO1xuICAgIHNldHVwUlRMKHRhcmdldEVsZW1lbnQpO1xuICAgIGFkZElucHV0Q2hhbmdlTGlzdGVuZXJzKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBvYmplY3QgfCBzdHJpbmd9IHBhcmFtXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKi9cbiAgY29uc3QgcGFyc2VIdG1sVG9Db250YWluZXIgPSAocGFyYW0sIHRhcmdldCkgPT4ge1xuICAgIC8vIERPTSBlbGVtZW50XG4gICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChwYXJhbSk7XG4gICAgfVxuXG4gICAgLy8gT2JqZWN0XG4gICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtID09PSAnb2JqZWN0Jykge1xuICAgICAgaGFuZGxlT2JqZWN0KHBhcmFtLCB0YXJnZXQpO1xuICAgIH1cblxuICAgIC8vIFBsYWluIHN0cmluZ1xuICAgIGVsc2UgaWYgKHBhcmFtKSB7XG4gICAgICBzZXRJbm5lckh0bWwodGFyZ2V0LCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqL1xuICBjb25zdCBoYW5kbGVPYmplY3QgPSAocGFyYW0sIHRhcmdldCkgPT4ge1xuICAgIC8vIEpRdWVyeSBlbGVtZW50KHMpXG4gICAgaWYgKHBhcmFtLmpxdWVyeSkge1xuICAgICAgaGFuZGxlSnF1ZXJ5RWxlbSh0YXJnZXQsIHBhcmFtKTtcbiAgICB9XG5cbiAgICAvLyBGb3Igb3RoZXIgb2JqZWN0cyB1c2UgdGhlaXIgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG4gICAgZWxzZSB7XG4gICAgICBzZXRJbm5lckh0bWwodGFyZ2V0LCBwYXJhbS50b1N0cmluZygpKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbVxuICAgKi9cbiAgY29uc3QgaGFuZGxlSnF1ZXJ5RWxlbSA9ICh0YXJnZXQsIGVsZW0pID0+IHtcbiAgICB0YXJnZXQudGV4dENvbnRlbnQgPSAnJztcbiAgICBpZiAoMCBpbiBlbGVtKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSBpbiBlbGVtOyBpKyspIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW1baV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW5kZXJBY3Rpb25zID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICAgIGNvbnN0IGxvYWRlciA9IGdldExvYWRlcigpO1xuICAgIGlmICghYWN0aW9ucyB8fCAhbG9hZGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQWN0aW9ucyAoYnV0dG9ucykgd3JhcHBlclxuICAgIGlmICghcGFyYW1zLnNob3dDb25maXJtQnV0dG9uICYmICFwYXJhbXMuc2hvd0RlbnlCdXR0b24gJiYgIXBhcmFtcy5zaG93Q2FuY2VsQnV0dG9uKSB7XG4gICAgICBoaWRlKGFjdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93KGFjdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIEN1c3RvbSBjbGFzc1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoYWN0aW9ucywgcGFyYW1zLCAnYWN0aW9ucycpO1xuXG4gICAgLy8gUmVuZGVyIGFsbCB0aGUgYnV0dG9uc1xuICAgIHJlbmRlckJ1dHRvbnMoYWN0aW9ucywgbG9hZGVyLCBwYXJhbXMpO1xuXG4gICAgLy8gTG9hZGVyXG4gICAgc2V0SW5uZXJIdG1sKGxvYWRlciwgcGFyYW1zLmxvYWRlckh0bWwgfHwgJycpO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MobG9hZGVyLCBwYXJhbXMsICdsb2FkZXInKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYWN0aW9uc1xuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBsb2FkZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBmdW5jdGlvbiByZW5kZXJCdXR0b25zKGFjdGlvbnMsIGxvYWRlciwgcGFyYW1zKSB7XG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgICBjb25zdCBkZW55QnV0dG9uID0gZ2V0RGVueUJ1dHRvbigpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGdldENhbmNlbEJ1dHRvbigpO1xuICAgIGlmICghY29uZmlybUJ1dHRvbiB8fCAhZGVueUJ1dHRvbiB8fCAhY2FuY2VsQnV0dG9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVuZGVyIGJ1dHRvbnNcbiAgICByZW5kZXJCdXR0b24oY29uZmlybUJ1dHRvbiwgJ2NvbmZpcm0nLCBwYXJhbXMpO1xuICAgIHJlbmRlckJ1dHRvbihkZW55QnV0dG9uLCAnZGVueScsIHBhcmFtcyk7XG4gICAgcmVuZGVyQnV0dG9uKGNhbmNlbEJ1dHRvbiwgJ2NhbmNlbCcsIHBhcmFtcyk7XG4gICAgaGFuZGxlQnV0dG9uc1N0eWxpbmcoY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uLCBwYXJhbXMpO1xuICAgIGlmIChwYXJhbXMucmV2ZXJzZUJ1dHRvbnMpIHtcbiAgICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoY2FuY2VsQnV0dG9uLCBjb25maXJtQnV0dG9uKTtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoZGVueUJ1dHRvbiwgY29uZmlybUJ1dHRvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShjYW5jZWxCdXR0b24sIGxvYWRlcik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGRlbnlCdXR0b24sIGxvYWRlcik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGNvbmZpcm1CdXR0b24sIGxvYWRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbmZpcm1CdXR0b25cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGVueUJ1dHRvblxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYW5jZWxCdXR0b25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVCdXR0b25zU3R5bGluZyhjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b24sIHBhcmFtcykge1xuICAgIGlmICghcGFyYW1zLmJ1dHRvbnNTdHlsaW5nKSB7XG4gICAgICByZW1vdmVDbGFzcyhbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYWRkQ2xhc3MoW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0sIHN3YWxDbGFzc2VzLnN0eWxlZCk7XG5cbiAgICAvLyBBcHBseSBjdXN0b20gYmFja2dyb3VuZCBjb2xvcnMgdG8gYWN0aW9uIGJ1dHRvbnNcbiAgICBpZiAocGFyYW1zLmNvbmZpcm1CdXR0b25Db2xvcikge1xuICAgICAgY29uZmlybUJ1dHRvbi5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1zd2FsMi1jb25maXJtLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yJywgcGFyYW1zLmNvbmZpcm1CdXR0b25Db2xvcik7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuZGVueUJ1dHRvbkNvbG9yKSB7XG4gICAgICBkZW55QnV0dG9uLnN0eWxlLnNldFByb3BlcnR5KCctLXN3YWwyLWRlbnktYnV0dG9uLWJhY2tncm91bmQtY29sb3InLCBwYXJhbXMuZGVueUJ1dHRvbkNvbG9yKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5jYW5jZWxCdXR0b25Db2xvcikge1xuICAgICAgY2FuY2VsQnV0dG9uLnN0eWxlLnNldFByb3BlcnR5KCctLXN3YWwyLWNhbmNlbC1idXR0b24tYmFja2dyb3VuZC1jb2xvcicsIHBhcmFtcy5jYW5jZWxCdXR0b25Db2xvcik7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgdGhlIG91dGxpbmUgY29sb3IgdG8gYWN0aW9uIGJ1dHRvbnNcbiAgICBhcHBseU91dGxpbmVDb2xvcihjb25maXJtQnV0dG9uKTtcbiAgICBhcHBseU91dGxpbmVDb2xvcihkZW55QnV0dG9uKTtcbiAgICBhcHBseU91dGxpbmVDb2xvcihjYW5jZWxCdXR0b24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJ1dHRvblxuICAgKi9cbiAgZnVuY3Rpb24gYXBwbHlPdXRsaW5lQ29sb3IoYnV0dG9uKSB7XG4gICAgY29uc3QgYnV0dG9uU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShidXR0b24pO1xuICAgIGlmIChidXR0b25TdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLXN3YWwyLWFjdGlvbi1idXR0b24tZm9jdXMtYm94LXNoYWRvdycpKSB7XG4gICAgICAvLyBJZiB0aGUgYnV0dG9uIGFscmVhZHkgaGFzIGEgY3VzdG9tIG91dGxpbmUgY29sb3IsIG5vIG5lZWQgdG8gY2hhbmdlIGl0XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG91dGxpbmVDb2xvciA9IGJ1dHRvblN0eWxlLmJhY2tncm91bmRDb2xvci5yZXBsYWNlKC9yZ2JhP1xcKChcXGQrKSwgKFxcZCspLCAoXFxkKykuKi8sICdyZ2JhKCQxLCAkMiwgJDMsIDAuNSknKTtcbiAgICBidXR0b24uc3R5bGUuc2V0UHJvcGVydHkoJy0tc3dhbDItYWN0aW9uLWJ1dHRvbi1mb2N1cy1ib3gtc2hhZG93JywgYnV0dG9uU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1zd2FsMi1vdXRsaW5lJykucmVwbGFjZSgvIHJnYmFcXCguKi8sIGAgJHtvdXRsaW5lQ29sb3J9YCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55JyB8ICdjYW5jZWwnfSBidXR0b25UeXBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gcmVuZGVyQnV0dG9uKGJ1dHRvbiwgYnV0dG9uVHlwZSwgcGFyYW1zKSB7XG4gICAgY29uc3QgYnV0dG9uTmFtZSA9IC8qKiBAdHlwZSB7J0NvbmZpcm0nIHwgJ0RlbnknIHwgJ0NhbmNlbCd9ICovY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGJ1dHRvblR5cGUpO1xuICAgIHRvZ2dsZShidXR0b24sIHBhcmFtc1tgc2hvdyR7YnV0dG9uTmFtZX1CdXR0b25gXSwgJ2lubGluZS1ibG9jaycpO1xuICAgIHNldElubmVySHRtbChidXR0b24sIHBhcmFtc1tgJHtidXR0b25UeXBlfUJ1dHRvblRleHRgXSB8fCAnJyk7IC8vIFNldCBjYXB0aW9uIHRleHRcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcGFyYW1zW2Ake2J1dHRvblR5cGV9QnV0dG9uQXJpYUxhYmVsYF0gfHwgJycpOyAvLyBBUklBIGxhYmVsXG5cbiAgICAvLyBBZGQgYnV0dG9ucyBjdXN0b20gY2xhc3Nlc1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1tidXR0b25UeXBlXTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGJ1dHRvbiwgcGFyYW1zLCBgJHtidXR0b25UeXBlfUJ1dHRvbmApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW5kZXJDbG9zZUJ1dHRvbiA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBnZXRDbG9zZUJ1dHRvbigpO1xuICAgIGlmICghY2xvc2VCdXR0b24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0SW5uZXJIdG1sKGNsb3NlQnV0dG9uLCBwYXJhbXMuY2xvc2VCdXR0b25IdG1sIHx8ICcnKTtcblxuICAgIC8vIEN1c3RvbSBjbGFzc1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoY2xvc2VCdXR0b24sIHBhcmFtcywgJ2Nsb3NlQnV0dG9uJyk7XG4gICAgdG9nZ2xlKGNsb3NlQnV0dG9uLCBwYXJhbXMuc2hvd0Nsb3NlQnV0dG9uKTtcbiAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXMuY2xvc2VCdXR0b25BcmlhTGFiZWwgfHwgJycpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3QgcmVuZGVyQ29udGFpbmVyID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoYW5kbGVCYWNrZHJvcFBhcmFtKGNvbnRhaW5lciwgcGFyYW1zLmJhY2tkcm9wKTtcbiAgICBoYW5kbGVQb3NpdGlvblBhcmFtKGNvbnRhaW5lciwgcGFyYW1zLnBvc2l0aW9uKTtcbiAgICBoYW5kbGVHcm93UGFyYW0oY29udGFpbmVyLCBwYXJhbXMuZ3Jvdyk7XG5cbiAgICAvLyBDdXN0b20gY2xhc3NcbiAgICBhcHBseUN1c3RvbUNsYXNzKGNvbnRhaW5lciwgcGFyYW1zLCAnY29udGFpbmVyJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydiYWNrZHJvcCddfSBiYWNrZHJvcFxuICAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlQmFja2Ryb3BQYXJhbShjb250YWluZXIsIGJhY2tkcm9wKSB7XG4gICAgaWYgKHR5cGVvZiBiYWNrZHJvcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kID0gYmFja2Ryb3A7XG4gICAgfSBlbHNlIGlmICghYmFja2Ryb3ApIHtcbiAgICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydwb3NpdGlvbiddfSBwb3NpdGlvblxuICAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlUG9zaXRpb25QYXJhbShjb250YWluZXIsIHBvc2l0aW9uKSB7XG4gICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocG9zaXRpb24gaW4gc3dhbENsYXNzZXMpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbcG9zaXRpb25dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2FybignVGhlIFwicG9zaXRpb25cIiBwYXJhbWV0ZXIgaXMgbm90IHZhbGlkLCBkZWZhdWx0aW5nIHRvIFwiY2VudGVyXCInKTtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXMuY2VudGVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2dyb3cnXX0gZ3Jvd1xuICAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlR3Jvd1BhcmFtKGNvbnRhaW5lciwgZ3Jvdykge1xuICAgIGlmICghZ3Jvdykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhZGRDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzW2Bncm93LSR7Z3Jvd31gXSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgY29udGFpbnMgYFdlYWtNYXBgcyBmb3IgZWFjaCBlZmZlY3RpdmVseS1cInByaXZhdGUgIHByb3BlcnR5XCIgdGhhdCBhIGBTd2FsYCBoYXMuXG4gICAqIEZvciBleGFtcGxlLCB0byBzZXQgdGhlIHByaXZhdGUgcHJvcGVydHkgXCJmb29cIiBvZiBgdGhpc2AgdG8gXCJiYXJcIiwgeW91IGNhbiBgcHJpdmF0ZVByb3BzLmZvby5zZXQodGhpcywgJ2JhcicpYFxuICAgKiBUaGlzIGlzIHRoZSBhcHByb2FjaCB0aGF0IEJhYmVsIHdpbGwgcHJvYmFibHkgdGFrZSB0byBpbXBsZW1lbnQgcHJpdmF0ZSBtZXRob2RzL2ZpZWxkc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByaXZhdGUtbWV0aG9kc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbC9wdWxsLzc1NTVcbiAgICogT25jZSB3ZSBoYXZlIHRoZSBjaGFuZ2VzIGZyb20gdGhhdCBQUiBpbiBCYWJlbCwgYW5kIG91ciBjb3JlIGNsYXNzIGZpdHMgcmVhc29uYWJsZSBpbiAqb25lIG1vZHVsZSpcbiAgICogICB0aGVuIHdlIGNhbiB1c2UgdGhhdCBsYW5ndWFnZSBmZWF0dXJlLlxuICAgKi9cblxuICB2YXIgcHJpdmF0ZVByb3BzID0ge1xuICAgIGlubmVyUGFyYW1zOiBuZXcgV2Vha01hcCgpLFxuICAgIGRvbUNhY2hlOiBuZXcgV2Vha01hcCgpXG4gIH07XG5cbiAgLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL3N3ZWV0YWxlcnQyLmQudHNcIi8+XG5cblxuICAvKiogQHR5cGUge0lucHV0Q2xhc3NbXX0gKi9cbiAgY29uc3QgaW5wdXRDbGFzc2VzID0gWydpbnB1dCcsICdmaWxlJywgJ3JhbmdlJywgJ3NlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICd0ZXh0YXJlYSddO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3QgcmVuZGVySW5wdXQgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBpZiAoIXBvcHVwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgY29uc3QgcmVyZW5kZXIgPSAhaW5uZXJQYXJhbXMgfHwgcGFyYW1zLmlucHV0ICE9PSBpbm5lclBhcmFtcy5pbnB1dDtcbiAgICBpbnB1dENsYXNzZXMuZm9yRWFjaChpbnB1dENsYXNzID0+IHtcbiAgICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlc1tpbnB1dENsYXNzXSk7XG4gICAgICBpZiAoIWlucHV0Q29udGFpbmVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGF0dHJpYnV0ZXNcbiAgICAgIHNldEF0dHJpYnV0ZXMoaW5wdXRDbGFzcywgcGFyYW1zLmlucHV0QXR0cmlidXRlcyk7XG5cbiAgICAgIC8vIHNldCBjbGFzc1xuICAgICAgaW5wdXRDb250YWluZXIuY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbaW5wdXRDbGFzc107XG4gICAgICBpZiAocmVyZW5kZXIpIHtcbiAgICAgICAgaGlkZShpbnB1dENvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHBhcmFtcy5pbnB1dCkge1xuICAgICAgaWYgKHJlcmVuZGVyKSB7XG4gICAgICAgIHNob3dJbnB1dChwYXJhbXMpO1xuICAgICAgfVxuICAgICAgLy8gc2V0IGN1c3RvbSBjbGFzc1xuICAgICAgc2V0Q3VzdG9tQ2xhc3MocGFyYW1zKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3Qgc2hvd0lucHV0ID0gcGFyYW1zID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbnB1dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXJlbmRlcklucHV0VHlwZVtwYXJhbXMuaW5wdXRdKSB7XG4gICAgICBlcnJvcihgVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0ISBFeHBlY3RlZCAke09iamVjdC5rZXlzKHJlbmRlcklucHV0VHlwZSkuam9pbignIHwgJyl9LCBnb3QgXCIke3BhcmFtcy5pbnB1dH1cImApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldElucHV0Q29udGFpbmVyKHBhcmFtcy5pbnB1dCk7XG4gICAgaWYgKCFpbnB1dENvbnRhaW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dCA9IHJlbmRlcklucHV0VHlwZVtwYXJhbXMuaW5wdXRdKGlucHV0Q29udGFpbmVyLCBwYXJhbXMpO1xuICAgIHNob3coaW5wdXRDb250YWluZXIpO1xuXG4gICAgLy8gaW5wdXQgYXV0b2ZvY3VzXG4gICAgaWYgKHBhcmFtcy5pbnB1dEF1dG9Gb2N1cykge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZvY3VzSW5wdXQoaW5wdXQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqL1xuICBjb25zdCByZW1vdmVBdHRyaWJ1dGVzID0gaW5wdXQgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0ck5hbWUgPSBpbnB1dC5hdHRyaWJ1dGVzW2ldLm5hbWU7XG4gICAgICBpZiAoIVsnaWQnLCAndHlwZScsICd2YWx1ZScsICdzdHlsZSddLmluY2x1ZGVzKGF0dHJOYW1lKSkge1xuICAgICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtJbnB1dENsYXNzfSBpbnB1dENsYXNzXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0QXR0cmlidXRlcyddfSBpbnB1dEF0dHJpYnV0ZXNcbiAgICovXG4gIGNvbnN0IHNldEF0dHJpYnV0ZXMgPSAoaW5wdXRDbGFzcywgaW5wdXRBdHRyaWJ1dGVzKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICghcG9wdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXQgPSBnZXRJbnB1dCQxKHBvcHVwLCBpbnB1dENsYXNzKTtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbW92ZUF0dHJpYnV0ZXMoaW5wdXQpO1xuICAgIGZvciAoY29uc3QgYXR0ciBpbiBpbnB1dEF0dHJpYnV0ZXMpIHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShhdHRyLCBpbnB1dEF0dHJpYnV0ZXNbYXR0cl0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBzZXRDdXN0b21DbGFzcyA9IHBhcmFtcyA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRDb250YWluZXIgPSBnZXRJbnB1dENvbnRhaW5lcihwYXJhbXMuaW5wdXQpO1xuICAgIGlmIChpbnB1dENvbnRhaW5lcikge1xuICAgICAgYXBwbHlDdXN0b21DbGFzcyhpbnB1dENvbnRhaW5lciwgcGFyYW1zLCAnaW5wdXQnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3Qgc2V0SW5wdXRQbGFjZWhvbGRlciA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFpbnB1dC5wbGFjZWhvbGRlciAmJiBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcjtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SW5wdXR9IGlucHV0XG4gICAqIEBwYXJhbSB7SW5wdXR9IHByZXBlbmRUb1xuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHNldElucHV0TGFiZWwgPSAoaW5wdXQsIHByZXBlbmRUbywgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dExhYmVsKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBsYWJlbENsYXNzID0gc3dhbENsYXNzZXNbJ2lucHV0LWxhYmVsJ107XG4gICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGlucHV0LmlkKTtcbiAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsQ2xhc3M7XG4gICAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgYWRkQ2xhc3MobGFiZWwsIHBhcmFtcy5jdXN0b21DbGFzcy5pbnB1dExhYmVsKTtcbiAgICAgIH1cbiAgICAgIGxhYmVsLmlubmVyVGV4dCA9IHBhcmFtcy5pbnB1dExhYmVsO1xuICAgICAgcHJlcGVuZFRvLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCBsYWJlbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRJbnB1dH0gaW5wdXRUeXBlXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGNvbnN0IGdldElucHV0Q29udGFpbmVyID0gaW5wdXRUeXBlID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKCFwb3B1cCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlc1soLyoqIEB0eXBlIHtTd2FsQ2xhc3N9ICovaW5wdXRUeXBlKV0gfHwgc3dhbENsYXNzZXMuaW5wdXQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnQgfCBIVE1MT3V0cHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0VmFsdWUnXX0gaW5wdXRWYWx1ZVxuICAgKi9cbiAgY29uc3QgY2hlY2tBbmRTZXRJbnB1dFZhbHVlID0gKGlucHV0LCBpbnB1dFZhbHVlKSA9PiB7XG4gICAgaWYgKFsnc3RyaW5nJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBpbnB1dFZhbHVlKSkge1xuICAgICAgaW5wdXQudmFsdWUgPSBgJHtpbnB1dFZhbHVlfWA7XG4gICAgfSBlbHNlIGlmICghaXNQcm9taXNlKGlucHV0VmFsdWUpKSB7XG4gICAgICB3YXJuKGBVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXRWYWx1ZSEgRXhwZWN0ZWQgXCJzdHJpbmdcIiwgXCJudW1iZXJcIiBvciBcIlByb21pc2VcIiwgZ290IFwiJHt0eXBlb2YgaW5wdXRWYWx1ZX1cImApO1xuICAgIH1cbiAgfTtcblxuICAvKiogQHR5cGUge1JlY29yZDxTd2VldEFsZXJ0SW5wdXQsIChpbnB1dDogSW5wdXQgfCBIVE1MRWxlbWVudCwgcGFyYW1zOiBTd2VldEFsZXJ0T3B0aW9ucykgPT4gSW5wdXQ+fSAqL1xuICBjb25zdCByZW5kZXJJbnB1dFR5cGUgPSB7fTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuICByZW5kZXJJbnB1dFR5cGUudGV4dCA9IHJlbmRlcklucHV0VHlwZS5lbWFpbCA9IHJlbmRlcklucHV0VHlwZS5wYXNzd29yZCA9IHJlbmRlcklucHV0VHlwZS5udW1iZXIgPSByZW5kZXJJbnB1dFR5cGUudGVsID0gcmVuZGVySW5wdXRUeXBlLnVybCA9IHJlbmRlcklucHV0VHlwZS5zZWFyY2ggPSByZW5kZXJJbnB1dFR5cGUuZGF0ZSA9IHJlbmRlcklucHV0VHlwZVsnZGF0ZXRpbWUtbG9jYWwnXSA9IHJlbmRlcklucHV0VHlwZS50aW1lID0gcmVuZGVySW5wdXRUeXBlLndlZWsgPSByZW5kZXJJbnB1dFR5cGUubW9udGggPSAvKiogQHR5cGUgeyhpbnB1dDogSW5wdXQgfCBIVE1MRWxlbWVudCwgcGFyYW1zOiBTd2VldEFsZXJ0T3B0aW9ucykgPT4gSW5wdXR9ICovXG4gIChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKGlucHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRMYWJlbChpbnB1dCwgaW5wdXQsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcihpbnB1dCwgcGFyYW1zKTtcbiAgICBpbnB1dC50eXBlID0gcGFyYW1zLmlucHV0O1xuICAgIHJldHVybiBpbnB1dDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuICByZW5kZXJJbnB1dFR5cGUuZmlsZSA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgc2V0SW5wdXRMYWJlbChpbnB1dCwgaW5wdXQsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcihpbnB1dCwgcGFyYW1zKTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFuZ2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cbiAgcmVuZGVySW5wdXRUeXBlLnJhbmdlID0gKHJhbmdlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCByYW5nZUlucHV0ID0gcmFuZ2UucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICBjb25zdCByYW5nZU91dHB1dCA9IHJhbmdlLnF1ZXJ5U2VsZWN0b3IoJ291dHB1dCcpO1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZShyYW5nZUlucHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgcmFuZ2VJbnB1dC50eXBlID0gcGFyYW1zLmlucHV0O1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZShyYW5nZU91dHB1dCwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHNldElucHV0TGFiZWwocmFuZ2VJbnB1dCwgcmFuZ2UsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxTZWxlY3RFbGVtZW50fSBzZWxlY3RcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MU2VsZWN0RWxlbWVudH1cbiAgICovXG4gIHJlbmRlcklucHV0VHlwZS5zZWxlY3QgPSAoc2VsZWN0LCBwYXJhbXMpID0+IHtcbiAgICBzZWxlY3QudGV4dENvbnRlbnQgPSAnJztcbiAgICBpZiAocGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBzZXRJbm5lckh0bWwocGxhY2Vob2xkZXIsIHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyKTtcbiAgICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJyc7XG4gICAgICBwbGFjZWhvbGRlci5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwbGFjZWhvbGRlci5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgIH1cbiAgICBzZXRJbnB1dExhYmVsKHNlbGVjdCwgc2VsZWN0LCBwYXJhbXMpO1xuICAgIHJldHVybiBzZWxlY3Q7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFkaW9cbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuICByZW5kZXJJbnB1dFR5cGUucmFkaW8gPSByYWRpbyA9PiB7XG4gICAgcmFkaW8udGV4dENvbnRlbnQgPSAnJztcbiAgICByZXR1cm4gcmFkaW87XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTExhYmVsRWxlbWVudH0gY2hlY2tib3hDb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cbiAgcmVuZGVySW5wdXRUeXBlLmNoZWNrYm94ID0gKGNoZWNrYm94Q29udGFpbmVyLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjaGVja2JveCA9IGdldElucHV0JDEoZ2V0UG9wdXAoKSwgJ2NoZWNrYm94Jyk7XG4gICAgY2hlY2tib3gudmFsdWUgPSAnMSc7XG4gICAgY2hlY2tib3guY2hlY2tlZCA9IEJvb2xlYW4ocGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIGNvbnN0IGxhYmVsID0gY2hlY2tib3hDb250YWluZXIucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuICAgIHNldElubmVySHRtbChsYWJlbCwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIgfHwgcGFyYW1zLmlucHV0TGFiZWwpO1xuICAgIHJldHVybiBjaGVja2JveDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MVGV4dEFyZWFFbGVtZW50fSB0ZXh0YXJlYVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxUZXh0QXJlYUVsZW1lbnR9XG4gICAqL1xuICByZW5kZXJJbnB1dFR5cGUudGV4dGFyZWEgPSAodGV4dGFyZWEsIHBhcmFtcykgPT4ge1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZSh0ZXh0YXJlYSwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHNldElucHV0UGxhY2Vob2xkZXIodGV4dGFyZWEsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRMYWJlbCh0ZXh0YXJlYSwgdGV4dGFyZWEsIHBhcmFtcyk7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgY29uc3QgZ2V0TWFyZ2luID0gZWwgPT4gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLm1hcmdpbkxlZnQpICsgcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLm1hcmdpblJpZ2h0KTtcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjI5MVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xNjk5XG4gICAgICBpZiAoJ011dGF0aW9uT2JzZXJ2ZXInIGluIHdpbmRvdykge1xuICAgICAgICBjb25zdCBpbml0aWFsUG9wdXBXaWR0aCA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGdldFBvcHVwKCkpLndpZHRoKTtcbiAgICAgICAgY29uc3QgdGV4dGFyZWFSZXNpemVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIC8vIGNoZWNrIGlmIHRleGFyZWEgaXMgc3RpbGwgaW4gZG9jdW1lbnQgKGkuZS4gcG9wdXAgd2Fzbid0IGNsb3NlZCBpbiB0aGUgbWVhbnRpbWUpXG4gICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRleHRhcmVhKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB0ZXh0YXJlYVdpZHRoID0gdGV4dGFyZWEub2Zmc2V0V2lkdGggKyBnZXRNYXJnaW4odGV4dGFyZWEpO1xuICAgICAgICAgIGlmICh0ZXh0YXJlYVdpZHRoID4gaW5pdGlhbFBvcHVwV2lkdGgpIHtcbiAgICAgICAgICAgIGdldFBvcHVwKCkuc3R5bGUud2lkdGggPSBgJHt0ZXh0YXJlYVdpZHRofXB4YDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwbHlOdW1lcmljYWxTdHlsZShnZXRQb3B1cCgpLCAnd2lkdGgnLCBwYXJhbXMud2lkdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGV4dGFyZWFSZXNpemVIYW5kbGVyKS5vYnNlcnZlKHRleHRhcmVhLCB7XG4gICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsnc3R5bGUnXVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGV4dGFyZWE7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW5kZXJDb250ZW50ID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBodG1sQ29udGFpbmVyID0gZ2V0SHRtbENvbnRhaW5lcigpO1xuICAgIGlmICghaHRtbENvbnRhaW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaG93V2hlbklubmVySHRtbFByZXNlbnQoaHRtbENvbnRhaW5lcik7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhodG1sQ29udGFpbmVyLCBwYXJhbXMsICdodG1sQ29udGFpbmVyJyk7XG5cbiAgICAvLyBDb250ZW50IGFzIEhUTUxcbiAgICBpZiAocGFyYW1zLmh0bWwpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy5odG1sLCBodG1sQ29udGFpbmVyKTtcbiAgICAgIHNob3coaHRtbENvbnRhaW5lciwgJ2Jsb2NrJyk7XG4gICAgfVxuXG4gICAgLy8gQ29udGVudCBhcyBwbGFpbiB0ZXh0XG4gICAgZWxzZSBpZiAocGFyYW1zLnRleHQpIHtcbiAgICAgIGh0bWxDb250YWluZXIudGV4dENvbnRlbnQgPSBwYXJhbXMudGV4dDtcbiAgICAgIHNob3coaHRtbENvbnRhaW5lciwgJ2Jsb2NrJyk7XG4gICAgfVxuXG4gICAgLy8gTm8gY29udGVudFxuICAgIGVsc2Uge1xuICAgICAgaGlkZShodG1sQ29udGFpbmVyKTtcbiAgICB9XG4gICAgcmVuZGVySW5wdXQoaW5zdGFuY2UsIHBhcmFtcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW5kZXJGb290ZXIgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGZvb3RlciA9IGdldEZvb3RlcigpO1xuICAgIGlmICghZm9vdGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNob3dXaGVuSW5uZXJIdG1sUHJlc2VudChmb290ZXIpO1xuICAgIHRvZ2dsZShmb290ZXIsIEJvb2xlYW4ocGFyYW1zLmZvb3RlciksICdibG9jaycpO1xuICAgIGlmIChwYXJhbXMuZm9vdGVyKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMuZm9vdGVyLCBmb290ZXIpO1xuICAgIH1cblxuICAgIC8vIEN1c3RvbSBjbGFzc1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoZm9vdGVyLCBwYXJhbXMsICdmb290ZXInKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlckljb24gPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgY29uc3QgaWNvbiA9IGdldEljb24oKTtcbiAgICBpZiAoIWljb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgZ2l2ZW4gaWNvbiBhbHJlYWR5IHJlbmRlcmVkLCBhcHBseSB0aGUgc3R5bGluZyB3aXRob3V0IHJlLXJlbmRlcmluZyB0aGUgaWNvblxuICAgIGlmIChpbm5lclBhcmFtcyAmJiBwYXJhbXMuaWNvbiA9PT0gaW5uZXJQYXJhbXMuaWNvbikge1xuICAgICAgLy8gQ3VzdG9tIG9yIGRlZmF1bHQgY29udGVudFxuICAgICAgc2V0Q29udGVudChpY29uLCBwYXJhbXMpO1xuICAgICAgYXBwbHlTdHlsZXMoaWNvbiwgcGFyYW1zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFwYXJhbXMuaWNvbiAmJiAhcGFyYW1zLmljb25IdG1sKSB7XG4gICAgICBoaWRlKGljb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmljb24gJiYgT2JqZWN0LmtleXMoaWNvblR5cGVzKS5pbmRleE9mKHBhcmFtcy5pY29uKSA9PT0gLTEpIHtcbiAgICAgIGVycm9yKGBVbmtub3duIGljb24hIEV4cGVjdGVkIFwic3VjY2Vzc1wiLCBcImVycm9yXCIsIFwid2FybmluZ1wiLCBcImluZm9cIiBvciBcInF1ZXN0aW9uXCIsIGdvdCBcIiR7cGFyYW1zLmljb259XCJgKTtcbiAgICAgIGhpZGUoaWNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNob3coaWNvbik7XG5cbiAgICAvLyBDdXN0b20gb3IgZGVmYXVsdCBjb250ZW50XG4gICAgc2V0Q29udGVudChpY29uLCBwYXJhbXMpO1xuICAgIGFwcGx5U3R5bGVzKGljb24sIHBhcmFtcyk7XG5cbiAgICAvLyBBbmltYXRlIGljb25cbiAgICBhZGRDbGFzcyhpY29uLCBwYXJhbXMuc2hvd0NsYXNzICYmIHBhcmFtcy5zaG93Q2xhc3MuaWNvbik7XG5cbiAgICAvLyBSZS1hZGp1c3QgdGhlIHN1Y2Nlc3MgaWNvbiBvbiBzeXN0ZW0gdGhlbWUgY2hhbmdlXG4gICAgY29uc3QgY29sb3JTY2hlbWVRdWVyeUxpc3QgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpO1xuICAgIGNvbG9yU2NoZW1lUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFkanVzdFN1Y2Nlc3NJY29uQmFja2dyb3VuZENvbG9yKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IGFwcGx5U3R5bGVzID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGZvciAoY29uc3QgW2ljb25UeXBlLCBpY29uQ2xhc3NOYW1lXSBvZiBPYmplY3QuZW50cmllcyhpY29uVHlwZXMpKSB7XG4gICAgICBpZiAocGFyYW1zLmljb24gIT09IGljb25UeXBlKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGljb24sIGljb25DbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBhZGRDbGFzcyhpY29uLCBwYXJhbXMuaWNvbiAmJiBpY29uVHlwZXNbcGFyYW1zLmljb25dKTtcblxuICAgIC8vIEljb24gY29sb3JcbiAgICBzZXRDb2xvcihpY29uLCBwYXJhbXMpO1xuXG4gICAgLy8gU3VjY2VzcyBpY29uIGJhY2tncm91bmQgY29sb3JcbiAgICBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvcigpO1xuXG4gICAgLy8gQ3VzdG9tIGNsYXNzXG4gICAgYXBwbHlDdXN0b21DbGFzcyhpY29uLCBwYXJhbXMsICdpY29uJyk7XG4gIH07XG5cbiAgLy8gQWRqdXN0IHN1Y2Nlc3MgaWNvbiBiYWNrZ3JvdW5kIGNvbG9yIHRvIG1hdGNoIHRoZSBwb3B1cCBiYWNrZ3JvdW5kIGNvbG9yXG4gIGNvbnN0IGFkanVzdFN1Y2Nlc3NJY29uQmFja2dyb3VuZENvbG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBpZiAoIXBvcHVwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvcHVwQmFja2dyb3VuZENvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocG9wdXApLmdldFByb3BlcnR5VmFsdWUoJ2JhY2tncm91bmQtY29sb3InKTtcbiAgICAvKiogQHR5cGUge05vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+fSAqL1xuICAgIGNvbnN0IHN1Y2Nlc3NJY29uUGFydHMgPSBwb3B1cC5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV0sIC5zd2FsMi1zdWNjZXNzLWZpeCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3VjY2Vzc0ljb25QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VjY2Vzc0ljb25QYXJ0c1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwb3B1cEJhY2tncm91bmRDb2xvcjtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgY29uc3Qgc3VjY2Vzc0ljb25IdG1sID0gcGFyYW1zID0+IGBcbiAgJHtwYXJhbXMuYW5pbWF0aW9uID8gJzxkaXYgY2xhc3M9XCJzd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtbGVmdFwiPjwvZGl2PicgOiAnJ31cbiAgPHNwYW4gY2xhc3M9XCJzd2FsMi1zdWNjZXNzLWxpbmUtdGlwXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cInN3YWwyLXN1Y2Nlc3MtbGluZS1sb25nXCI+PC9zcGFuPlxuICA8ZGl2IGNsYXNzPVwic3dhbDItc3VjY2Vzcy1yaW5nXCI+PC9kaXY+XG4gICR7cGFyYW1zLmFuaW1hdGlvbiA/ICc8ZGl2IGNsYXNzPVwic3dhbDItc3VjY2Vzcy1maXhcIj48L2Rpdj4nIDogJyd9XG4gICR7cGFyYW1zLmFuaW1hdGlvbiA/ICc8ZGl2IGNsYXNzPVwic3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLXJpZ2h0XCI+PC9kaXY+JyA6ICcnfVxuYDtcbiAgY29uc3QgZXJyb3JJY29uSHRtbCA9IGBcbiAgPHNwYW4gY2xhc3M9XCJzd2FsMi14LW1hcmtcIj5cbiAgICA8c3BhbiBjbGFzcz1cInN3YWwyLXgtbWFyay1saW5lLWxlZnRcIj48L3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJzd2FsMi14LW1hcmstbGluZS1yaWdodFwiPjwvc3Bhbj5cbiAgPC9zcGFuPlxuYDtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHNldENvbnRlbnQgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaWNvbiAmJiAhcGFyYW1zLmljb25IdG1sKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBvbGRDb250ZW50ID0gaWNvbi5pbm5lckhUTUw7XG4gICAgbGV0IG5ld0NvbnRlbnQgPSAnJztcbiAgICBpZiAocGFyYW1zLmljb25IdG1sKSB7XG4gICAgICBuZXdDb250ZW50ID0gaWNvbkNvbnRlbnQocGFyYW1zLmljb25IdG1sKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5pY29uID09PSAnc3VjY2VzcycpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBzdWNjZXNzSWNvbkh0bWwocGFyYW1zKTtcbiAgICAgIG9sZENvbnRlbnQgPSBvbGRDb250ZW50LnJlcGxhY2UoLyBzdHlsZT1cIi4qP1wiL2csICcnKTsgLy8gdW5kbyBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvcigpXG4gICAgfSBlbHNlIGlmIChwYXJhbXMuaWNvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgbmV3Q29udGVudCA9IGVycm9ySWNvbkh0bWw7XG4gICAgfSBlbHNlIGlmIChwYXJhbXMuaWNvbikge1xuICAgICAgY29uc3QgZGVmYXVsdEljb25IdG1sID0ge1xuICAgICAgICBxdWVzdGlvbjogJz8nLFxuICAgICAgICB3YXJuaW5nOiAnIScsXG4gICAgICAgIGluZm86ICdpJ1xuICAgICAgfTtcbiAgICAgIG5ld0NvbnRlbnQgPSBpY29uQ29udGVudChkZWZhdWx0SWNvbkh0bWxbcGFyYW1zLmljb25dKTtcbiAgICB9XG4gICAgaWYgKG9sZENvbnRlbnQudHJpbSgpICE9PSBuZXdDb250ZW50LnRyaW0oKSkge1xuICAgICAgc2V0SW5uZXJIdG1sKGljb24sIG5ld0NvbnRlbnQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHNldENvbG9yID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGlmICghcGFyYW1zLmljb25Db2xvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpY29uLnN0eWxlLmNvbG9yID0gcGFyYW1zLmljb25Db2xvcjtcbiAgICBpY29uLnN0eWxlLmJvcmRlckNvbG9yID0gcGFyYW1zLmljb25Db2xvcjtcbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBbJy5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwJywgJy5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZycsICcuc3dhbDIteC1tYXJrLWxpbmUtbGVmdCcsICcuc3dhbDIteC1tYXJrLWxpbmUtcmlnaHQnXSkge1xuICAgICAgc2V0U3R5bGUoaWNvbiwgc2VsLCAnYmFja2dyb3VuZC1jb2xvcicsIHBhcmFtcy5pY29uQ29sb3IpO1xuICAgIH1cbiAgICBzZXRTdHlsZShpY29uLCAnLnN3YWwyLXN1Y2Nlc3MtcmluZycsICdib3JkZXItY29sb3InLCBwYXJhbXMuaWNvbkNvbG9yKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGNvbnN0IGljb25Db250ZW50ID0gY29udGVudCA9PiBgPGRpdiBjbGFzcz1cIiR7c3dhbENsYXNzZXNbJ2ljb24tY29udGVudCddfVwiPiR7Y29udGVudH08L2Rpdj5gO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3QgcmVuZGVySW1hZ2UgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gZ2V0SW1hZ2UoKTtcbiAgICBpZiAoIWltYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghcGFyYW1zLmltYWdlVXJsKSB7XG4gICAgICBoaWRlKGltYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2hvdyhpbWFnZSwgJycpO1xuXG4gICAgLy8gU3JjLCBhbHRcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBhcmFtcy5pbWFnZVVybCk7XG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdhbHQnLCBwYXJhbXMuaW1hZ2VBbHQgfHwgJycpO1xuXG4gICAgLy8gV2lkdGgsIGhlaWdodFxuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoaW1hZ2UsICd3aWR0aCcsIHBhcmFtcy5pbWFnZVdpZHRoKTtcbiAgICBhcHBseU51bWVyaWNhbFN0eWxlKGltYWdlLCAnaGVpZ2h0JywgcGFyYW1zLmltYWdlSGVpZ2h0KTtcblxuICAgIC8vIENsYXNzXG4gICAgaW1hZ2UuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMuaW1hZ2U7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhpbWFnZSwgcGFyYW1zLCAnaW1hZ2UnKTtcbiAgfTtcblxuICBsZXQgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgbGV0IG1vdXNlZG93blggPSAwO1xuICBsZXQgbW91c2Vkb3duWSA9IDA7XG4gIGxldCBpbml0aWFsWCA9IDA7XG4gIGxldCBpbml0aWFsWSA9IDA7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqL1xuICBjb25zdCBhZGREcmFnZ2FibGVMaXN0ZW5lcnMgPSBwb3B1cCA9PiB7XG4gICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZG93bik7XG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlKTtcbiAgICBwb3B1cC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdXApO1xuICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBkb3duKTtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG1vdmUpO1xuICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdXApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKi9cbiAgY29uc3QgcmVtb3ZlRHJhZ2dhYmxlTGlzdGVuZXJzID0gcG9wdXAgPT4ge1xuICAgIHBvcHVwLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGRvd24pO1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZSk7XG4gICAgcG9wdXAucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHVwKTtcbiAgICBwb3B1cC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZG93bik7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtb3ZlKTtcbiAgICBwb3B1cC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHVwKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50IHwgVG91Y2hFdmVudH0gZXZlbnRcbiAgICovXG4gIGNvbnN0IGRvd24gPSBldmVudCA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmIChldmVudC50YXJnZXQgPT09IHBvcHVwIHx8IGdldEljb24oKS5jb250YWlucygvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL2V2ZW50LnRhcmdldCkpIHtcbiAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGNsaWVudFhZID0gZ2V0Q2xpZW50WFkoZXZlbnQpO1xuICAgICAgbW91c2Vkb3duWCA9IGNsaWVudFhZLmNsaWVudFg7XG4gICAgICBtb3VzZWRvd25ZID0gY2xpZW50WFkuY2xpZW50WTtcbiAgICAgIGluaXRpYWxYID0gcGFyc2VJbnQocG9wdXAuc3R5bGUuaW5zZXRJbmxpbmVTdGFydCkgfHwgMDtcbiAgICAgIGluaXRpYWxZID0gcGFyc2VJbnQocG9wdXAuc3R5bGUuaW5zZXRCbG9ja1N0YXJ0KSB8fCAwO1xuICAgICAgYWRkQ2xhc3MocG9wdXAsICdzd2FsMi1kcmFnZ2luZycpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50IHwgVG91Y2hFdmVudH0gZXZlbnRcbiAgICovXG4gIGNvbnN0IG1vdmUgPSBldmVudCA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgbGV0IHtcbiAgICAgICAgY2xpZW50WCxcbiAgICAgICAgY2xpZW50WVxuICAgICAgfSA9IGdldENsaWVudFhZKGV2ZW50KTtcbiAgICAgIHBvcHVwLnN0eWxlLmluc2V0SW5saW5lU3RhcnQgPSBgJHtpbml0aWFsWCArIChjbGllbnRYIC0gbW91c2Vkb3duWCl9cHhgO1xuICAgICAgcG9wdXAuc3R5bGUuaW5zZXRCbG9ja1N0YXJ0ID0gYCR7aW5pdGlhbFkgKyAoY2xpZW50WSAtIG1vdXNlZG93blkpfXB4YDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHVwID0gKCkgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBkcmFnZ2luZyA9IGZhbHNlO1xuICAgIHJlbW92ZUNsYXNzKHBvcHVwLCAnc3dhbDItZHJhZ2dpbmcnKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50IHwgVG91Y2hFdmVudH0gZXZlbnRcbiAgICogQHJldHVybnMge3sgY2xpZW50WDogbnVtYmVyLCBjbGllbnRZOiBudW1iZXIgfX1cbiAgICovXG4gIGNvbnN0IGdldENsaWVudFhZID0gZXZlbnQgPT4ge1xuICAgIGxldCBjbGllbnRYID0gMCxcbiAgICAgIGNsaWVudFkgPSAwO1xuICAgIGlmIChldmVudC50eXBlLnN0YXJ0c1dpdGgoJ21vdXNlJykpIHtcbiAgICAgIGNsaWVudFggPSAvKiogQHR5cGUge01vdXNlRXZlbnR9ICovZXZlbnQuY2xpZW50WDtcbiAgICAgIGNsaWVudFkgPSAvKiogQHR5cGUge01vdXNlRXZlbnR9ICovZXZlbnQuY2xpZW50WTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUuc3RhcnRzV2l0aCgndG91Y2gnKSkge1xuICAgICAgY2xpZW50WCA9IC8qKiBAdHlwZSB7VG91Y2hFdmVudH0gKi9ldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICBjbGllbnRZID0gLyoqIEB0eXBlIHtUb3VjaEV2ZW50fSAqL2V2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsaWVudFgsXG4gICAgICBjbGllbnRZXG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlclBvcHVwID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKCFjb250YWluZXIgfHwgIXBvcHVwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2lkdGhcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIxNzBcbiAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICBhcHBseU51bWVyaWNhbFN0eWxlKGNvbnRhaW5lciwgJ3dpZHRoJywgcGFyYW1zLndpZHRoKTtcbiAgICAgIHBvcHVwLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG4gICAgICBpZiAobG9hZGVyKSB7XG4gICAgICAgIHBvcHVwLmluc2VydEJlZm9yZShsb2FkZXIsIGdldEljb24oKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICd3aWR0aCcsIHBhcmFtcy53aWR0aCk7XG4gICAgfVxuXG4gICAgLy8gUGFkZGluZ1xuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICdwYWRkaW5nJywgcGFyYW1zLnBhZGRpbmcpO1xuXG4gICAgLy8gQ29sb3JcbiAgICBpZiAocGFyYW1zLmNvbG9yKSB7XG4gICAgICBwb3B1cC5zdHlsZS5jb2xvciA9IHBhcmFtcy5jb2xvcjtcbiAgICB9XG5cbiAgICAvLyBCYWNrZ3JvdW5kXG4gICAgaWYgKHBhcmFtcy5iYWNrZ3JvdW5kKSB7XG4gICAgICBwb3B1cC5zdHlsZS5iYWNrZ3JvdW5kID0gcGFyYW1zLmJhY2tncm91bmQ7XG4gICAgfVxuICAgIGhpZGUoZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKSk7XG5cbiAgICAvLyBDbGFzc2VzXG4gICAgYWRkQ2xhc3NlcyQxKHBvcHVwLCBwYXJhbXMpO1xuICAgIGlmIChwYXJhbXMuZHJhZ2dhYmxlICYmICFwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5kcmFnZ2FibGUpO1xuICAgICAgYWRkRHJhZ2dhYmxlTGlzdGVuZXJzKHBvcHVwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLmRyYWdnYWJsZSk7XG4gICAgICByZW1vdmVEcmFnZ2FibGVMaXN0ZW5lcnMocG9wdXApO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wdXBcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBhZGRDbGFzc2VzJDEgPSAocG9wdXAsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHNob3dDbGFzcyA9IHBhcmFtcy5zaG93Q2xhc3MgfHwge307XG4gICAgLy8gRGVmYXVsdCBDbGFzcyArIHNob3dDbGFzcyB3aGVuIHVwZGF0aW5nIFN3YWwudXBkYXRlKHt9KVxuICAgIHBvcHVwLmNsYXNzTmFtZSA9IGAke3N3YWxDbGFzc2VzLnBvcHVwfSAke2lzVmlzaWJsZSQxKHBvcHVwKSA/IHNob3dDbGFzcy5wb3B1cCA6ICcnfWA7XG4gICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddKTtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy50b2FzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5tb2RhbCk7XG4gICAgfVxuXG4gICAgLy8gQ3VzdG9tIGNsYXNzXG4gICAgYXBwbHlDdXN0b21DbGFzcyhwb3B1cCwgcGFyYW1zLCAncG9wdXAnKTtcbiAgICAvLyBUT0RPOiByZW1vdmUgaW4gdGhlIG5leHQgbWFqb3JcbiAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBwYXJhbXMuY3VzdG9tQ2xhc3MpO1xuICAgIH1cblxuICAgIC8vIEljb24gY2xhc3MgKCMxODQyKVxuICAgIGlmIChwYXJhbXMuaWNvbikge1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzW2BpY29uLSR7cGFyYW1zLmljb259YF0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlclByb2dyZXNzU3RlcHMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHByb2dyZXNzU3RlcHNDb250YWluZXIgPSBnZXRQcm9ncmVzc1N0ZXBzKCk7XG4gICAgaWYgKCFwcm9ncmVzc1N0ZXBzQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHtcbiAgICAgIHByb2dyZXNzU3RlcHMsXG4gICAgICBjdXJyZW50UHJvZ3Jlc3NTdGVwXG4gICAgfSA9IHBhcmFtcztcbiAgICBpZiAoIXByb2dyZXNzU3RlcHMgfHwgcHJvZ3Jlc3NTdGVwcy5sZW5ndGggPT09IDAgfHwgY3VycmVudFByb2dyZXNzU3RlcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBoaWRlKHByb2dyZXNzU3RlcHNDb250YWluZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaG93KHByb2dyZXNzU3RlcHNDb250YWluZXIpO1xuICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIudGV4dENvbnRlbnQgPSAnJztcbiAgICBpZiAoY3VycmVudFByb2dyZXNzU3RlcCA+PSBwcm9ncmVzc1N0ZXBzLmxlbmd0aCkge1xuICAgICAgd2FybignSW52YWxpZCBjdXJyZW50UHJvZ3Jlc3NTdGVwIHBhcmFtZXRlciwgaXQgc2hvdWxkIGJlIGxlc3MgdGhhbiBwcm9ncmVzc1N0ZXBzLmxlbmd0aCAnICsgJyhjdXJyZW50UHJvZ3Jlc3NTdGVwIGxpa2UgSlMgYXJyYXlzIHN0YXJ0cyBmcm9tIDApJyk7XG4gICAgfVxuICAgIHByb2dyZXNzU3RlcHMuZm9yRWFjaCgoc3RlcCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHN0ZXBFbCA9IGNyZWF0ZVN0ZXBFbGVtZW50KHN0ZXApO1xuICAgICAgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGVwRWwpO1xuICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50UHJvZ3Jlc3NTdGVwKSB7XG4gICAgICAgIGFkZENsYXNzKHN0ZXBFbCwgc3dhbENsYXNzZXNbJ2FjdGl2ZS1wcm9ncmVzcy1zdGVwJ10pO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4ICE9PSBwcm9ncmVzc1N0ZXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY29uc3QgbGluZUVsID0gY3JlYXRlTGluZUVsZW1lbnQocGFyYW1zKTtcbiAgICAgICAgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5lRWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RlcFxuICAgKiBAcmV0dXJucyB7SFRNTExJRWxlbWVudH1cbiAgICovXG4gIGNvbnN0IGNyZWF0ZVN0ZXBFbGVtZW50ID0gc3RlcCA9PiB7XG4gICAgY29uc3Qgc3RlcEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBhZGRDbGFzcyhzdGVwRWwsIHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwJ10pO1xuICAgIHNldElubmVySHRtbChzdGVwRWwsIHN0ZXApO1xuICAgIHJldHVybiBzdGVwRWw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTExJRWxlbWVudH1cbiAgICovXG4gIGNvbnN0IGNyZWF0ZUxpbmVFbGVtZW50ID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBsaW5lRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGFkZENsYXNzKGxpbmVFbCwgc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXAtbGluZSddKTtcbiAgICBpZiAocGFyYW1zLnByb2dyZXNzU3RlcHNEaXN0YW5jZSkge1xuICAgICAgYXBwbHlOdW1lcmljYWxTdHlsZShsaW5lRWwsICd3aWR0aCcsIHBhcmFtcy5wcm9ncmVzc1N0ZXBzRGlzdGFuY2UpO1xuICAgIH1cbiAgICByZXR1cm4gbGluZUVsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3QgcmVuZGVyVGl0bGUgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gZ2V0VGl0bGUoKTtcbiAgICBpZiAoIXRpdGxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNob3dXaGVuSW5uZXJIdG1sUHJlc2VudCh0aXRsZSk7XG4gICAgdG9nZ2xlKHRpdGxlLCBCb29sZWFuKHBhcmFtcy50aXRsZSB8fCBwYXJhbXMudGl0bGVUZXh0KSwgJ2Jsb2NrJyk7XG4gICAgaWYgKHBhcmFtcy50aXRsZSkge1xuICAgICAgcGFyc2VIdG1sVG9Db250YWluZXIocGFyYW1zLnRpdGxlLCB0aXRsZSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMudGl0bGVUZXh0KSB7XG4gICAgICB0aXRsZS5pbm5lclRleHQgPSBwYXJhbXMudGl0bGVUZXh0O1xuICAgIH1cblxuICAgIC8vIEN1c3RvbSBjbGFzc1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3ModGl0bGUsIHBhcmFtcywgJ3RpdGxlJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW5kZXIgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIHJlbmRlclBvcHVwKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckNvbnRhaW5lcihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJQcm9ncmVzc1N0ZXBzKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckljb24oaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVySW1hZ2UoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyVGl0bGUoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ2xvc2VCdXR0b24oaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ29udGVudChpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJBY3Rpb25zKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckZvb3RlcihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZGlkUmVuZGVyID09PSAnZnVuY3Rpb24nICYmIHBvcHVwKSB7XG4gICAgICBwYXJhbXMuZGlkUmVuZGVyKHBvcHVwKTtcbiAgICB9XG4gICAgZ2xvYmFsU3RhdGUuZXZlbnRFbWl0dGVyLmVtaXQoJ2RpZFJlbmRlcicsIHBvcHVwKTtcbiAgfTtcblxuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIFN3ZWV0QWxlcnQyIHBvcHVwIGlzIHNob3duXG4gICAqL1xuICBjb25zdCBpc1Zpc2libGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGlzVmlzaWJsZSQxKGdldFBvcHVwKCkpO1xuICB9O1xuXG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnQ29uZmlybScgYnV0dG9uXG4gICAqL1xuICBjb25zdCBjbGlja0NvbmZpcm0gPSAoKSA9PiB7XG4gICAgdmFyIF9kb20kZ2V0Q29uZmlybUJ1dHRvbjtcbiAgICByZXR1cm4gKF9kb20kZ2V0Q29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKSkgPT09IG51bGwgfHwgX2RvbSRnZXRDb25maXJtQnV0dG9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZG9tJGdldENvbmZpcm1CdXR0b24uY2xpY2soKTtcbiAgfTtcblxuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0RlbnknIGJ1dHRvblxuICAgKi9cbiAgY29uc3QgY2xpY2tEZW55ID0gKCkgPT4ge1xuICAgIHZhciBfZG9tJGdldERlbnlCdXR0b247XG4gICAgcmV0dXJuIChfZG9tJGdldERlbnlCdXR0b24gPSBnZXREZW55QnV0dG9uKCkpID09PSBudWxsIHx8IF9kb20kZ2V0RGVueUJ1dHRvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RvbSRnZXREZW55QnV0dG9uLmNsaWNrKCk7XG4gIH07XG5cbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGNsaWNrICdDYW5jZWwnIGJ1dHRvblxuICAgKi9cbiAgY29uc3QgY2xpY2tDYW5jZWwgPSAoKSA9PiB7XG4gICAgdmFyIF9kb20kZ2V0Q2FuY2VsQnV0dG9uO1xuICAgIHJldHVybiAoX2RvbSRnZXRDYW5jZWxCdXR0b24gPSBnZXRDYW5jZWxCdXR0b24oKSkgPT09IG51bGwgfHwgX2RvbSRnZXRDYW5jZWxCdXR0b24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kb20kZ2V0Q2FuY2VsQnV0dG9uLmNsaWNrKCk7XG4gIH07XG5cbiAgLyoqIEB0eXBlIHtSZWNvcmQ8RGlzbWlzc1JlYXNvbiwgRGlzbWlzc1JlYXNvbj59ICovXG4gIGNvbnN0IERpc21pc3NSZWFzb24gPSBPYmplY3QuZnJlZXplKHtcbiAgICBjYW5jZWw6ICdjYW5jZWwnLFxuICAgIGJhY2tkcm9wOiAnYmFja2Ryb3AnLFxuICAgIGNsb3NlOiAnY2xvc2UnLFxuICAgIGVzYzogJ2VzYycsXG4gICAgdGltZXI6ICd0aW1lcidcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqL1xuICBjb25zdCByZW1vdmVLZXlkb3duSGFuZGxlciA9IGdsb2JhbFN0YXRlID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldCAmJiBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlckFkZGVkKSB7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciwge1xuICAgICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7KGRpc21pc3M6IERpc21pc3NSZWFzb24pID0+IHZvaWR9IGRpc21pc3NXaXRoXG4gICAqL1xuICBjb25zdCBhZGRLZXlkb3duSGFuZGxlciA9IChnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgcmVtb3ZlS2V5ZG93bkhhbmRsZXIoZ2xvYmFsU3RhdGUpO1xuICAgIGlmICghaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyID0gZSA9PiBrZXlkb3duSGFuZGxlcihpbm5lclBhcmFtcywgZSwgZGlzbWlzc1dpdGgpO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldCA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmUgPyB3aW5kb3cgOiBnZXRQb3B1cCgpO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmU7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciwge1xuICAgICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmNyZW1lbnRcbiAgICovXG4gIGNvbnN0IHNldEZvY3VzID0gKGluZGV4LCBpbmNyZW1lbnQpID0+IHtcbiAgICB2YXIgX2RvbSRnZXRQb3B1cDtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IGdldEZvY3VzYWJsZUVsZW1lbnRzKCk7XG4gICAgLy8gc2VhcmNoIGZvciB2aXNpYmxlIGVsZW1lbnRzIGFuZCBzZWxlY3QgdGhlIG5leHQgcG9zc2libGUgbWF0Y2hcbiAgICBpZiAoZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBpbmRleCA9IGluZGV4ICsgaW5jcmVtZW50O1xuXG4gICAgICAvLyBzaGlmdCArIHRhYiB3aGVuIC5zd2FsMi1wb3B1cCBpcyBmb2N1c2VkXG4gICAgICBpZiAoaW5kZXggPT09IC0yKSB7XG4gICAgICAgIGluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgIH1cblxuICAgICAgLy8gcm9sbG92ZXIgdG8gZmlyc3QgaXRlbVxuICAgICAgaWYgKGluZGV4ID09PSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgaW5kZXggPSAwO1xuXG4gICAgICAgIC8vIGdvIHRvIGxhc3QgaXRlbVxuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgaW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgfVxuICAgICAgZm9jdXNhYmxlRWxlbWVudHNbaW5kZXhdLmZvY3VzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIG5vIHZpc2libGUgZm9jdXNhYmxlIGVsZW1lbnRzLCBmb2N1cyB0aGUgcG9wdXBcbiAgICAoX2RvbSRnZXRQb3B1cCA9IGdldFBvcHVwKCkpID09PSBudWxsIHx8IF9kb20kZ2V0UG9wdXAgPT09IHZvaWQgMCB8fCBfZG9tJGdldFBvcHVwLmZvY3VzKCk7XG4gIH07XG4gIGNvbnN0IGFycm93S2V5c05leHRCdXR0b24gPSBbJ0Fycm93UmlnaHQnLCAnQXJyb3dEb3duJ107XG4gIGNvbnN0IGFycm93S2V5c1ByZXZpb3VzQnV0dG9uID0gWydBcnJvd0xlZnQnLCAnQXJyb3dVcCddO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50XG4gICAqIEBwYXJhbSB7KGRpc21pc3M6IERpc21pc3NSZWFzb24pID0+IHZvaWR9IGRpc21pc3NXaXRoXG4gICAqL1xuICBjb25zdCBrZXlkb3duSGFuZGxlciA9IChpbm5lclBhcmFtcywgZXZlbnQsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgcmV0dXJuOyAvLyBUaGlzIGluc3RhbmNlIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkXG4gICAgfVxuXG4gICAgLy8gSWdub3JlIGtleWRvd24gZHVyaW5nIElNRSBjb21wb3NpdGlvblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Eb2N1bWVudC9rZXlkb3duX2V2ZW50I2lnbm9yaW5nX2tleWRvd25fZHVyaW5nX2ltZV9jb21wb3NpdGlvblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvNzIwXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yNDA2XG4gICAgaWYgKGV2ZW50LmlzQ29tcG9zaW5nIHx8IGV2ZW50LmtleUNvZGUgPT09IDIyOSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaW5uZXJQYXJhbXMuc3RvcEtleWRvd25Qcm9wYWdhdGlvbikge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLy8gRU5URVJcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICBoYW5kbGVFbnRlcihldmVudCwgaW5uZXJQYXJhbXMpO1xuICAgIH1cblxuICAgIC8vIFRBQlxuICAgIGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ1RhYicpIHtcbiAgICAgIGhhbmRsZVRhYihldmVudCk7XG4gICAgfVxuXG4gICAgLy8gQVJST1dTIC0gc3dpdGNoIGZvY3VzIGJldHdlZW4gYnV0dG9uc1xuICAgIGVsc2UgaWYgKFsuLi5hcnJvd0tleXNOZXh0QnV0dG9uLCAuLi5hcnJvd0tleXNQcmV2aW91c0J1dHRvbl0uaW5jbHVkZXMoZXZlbnQua2V5KSkge1xuICAgICAgaGFuZGxlQXJyb3dzKGV2ZW50LmtleSk7XG4gICAgfVxuXG4gICAgLy8gRVNDXG4gICAgZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgaGFuZGxlRXNjKGV2ZW50LCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cbiAgY29uc3QgaGFuZGxlRW50ZXIgPSAoZXZlbnQsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMzg2XG4gICAgaWYgKCFjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VudGVyS2V5KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dCA9IGdldElucHV0JDEoZ2V0UG9wdXAoKSwgaW5uZXJQYXJhbXMuaW5wdXQpO1xuICAgIGlmIChldmVudC50YXJnZXQgJiYgaW5wdXQgJiYgZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgZXZlbnQudGFyZ2V0Lm91dGVySFRNTCA9PT0gaW5wdXQub3V0ZXJIVE1MKSB7XG4gICAgICBpZiAoWyd0ZXh0YXJlYScsICdmaWxlJ10uaW5jbHVkZXMoaW5uZXJQYXJhbXMuaW5wdXQpKSB7XG4gICAgICAgIHJldHVybjsgLy8gZG8gbm90IHN1Ym1pdFxuICAgICAgfVxuICAgICAgY2xpY2tDb25maXJtKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudFxuICAgKi9cbiAgY29uc3QgaGFuZGxlVGFiID0gZXZlbnQgPT4ge1xuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBnZXRGb2N1c2FibGVFbGVtZW50cygpO1xuICAgIGxldCBidG5JbmRleCA9IC0xO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0YXJnZXRFbGVtZW50ID09PSBmb2N1c2FibGVFbGVtZW50c1tpXSkge1xuICAgICAgICBidG5JbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEN5Y2xlIHRvIHRoZSBuZXh0IGJ1dHRvblxuICAgIGlmICghZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHNldEZvY3VzKGJ0bkluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBDeWNsZSB0byB0aGUgcHJldiBidXR0b25cbiAgICBlbHNlIHtcbiAgICAgIHNldEZvY3VzKGJ0bkluZGV4LCAtMSk7XG4gICAgfVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICovXG4gIGNvbnN0IGhhbmRsZUFycm93cyA9IGtleSA9PiB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGdldEFjdGlvbnMoKTtcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIGNvbnN0IGRlbnlCdXR0b24gPSBnZXREZW55QnV0dG9uKCk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZ2V0Q2FuY2VsQnV0dG9uKCk7XG4gICAgaWYgKCFhY3Rpb25zIHx8ICFjb25maXJtQnV0dG9uIHx8ICFkZW55QnV0dG9uIHx8ICFjYW5jZWxCdXR0b24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLyoqIEB0eXBlIEhUTUxFbGVtZW50W10gKi9cbiAgICBjb25zdCBidXR0b25zID0gW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl07XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhYnV0dG9ucy5pbmNsdWRlcyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzaWJsaW5nID0gYXJyb3dLZXlzTmV4dEJ1dHRvbi5pbmNsdWRlcyhrZXkpID8gJ25leHRFbGVtZW50U2libGluZycgOiAncHJldmlvdXNFbGVtZW50U2libGluZyc7XG4gICAgbGV0IGJ1dHRvblRvRm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmICghYnV0dG9uVG9Gb2N1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGlvbnMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1dHRvblRvRm9jdXMgPSBidXR0b25Ub0ZvY3VzW3NpYmxpbmddO1xuICAgICAgaWYgKCFidXR0b25Ub0ZvY3VzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChidXR0b25Ub0ZvY3VzIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQgJiYgaXNWaXNpYmxlJDEoYnV0dG9uVG9Gb2N1cykpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChidXR0b25Ub0ZvY3VzIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgIGJ1dHRvblRvRm9jdXMuZm9jdXMoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHsoZGlzbWlzczogRGlzbWlzc1JlYXNvbikgPT4gdm9pZH0gZGlzbWlzc1dpdGhcbiAgICovXG4gIGNvbnN0IGhhbmRsZUVzYyA9IChldmVudCwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dFc2NhcGVLZXkpKSB7XG4gICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmVzYyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIG1vZHVsZSBjb250YWlucyBgV2Vha01hcGBzIGZvciBlYWNoIGVmZmVjdGl2ZWx5LVwicHJpdmF0ZSAgcHJvcGVydHlcIiB0aGF0IGEgYFN3YWxgIGhhcy5cbiAgICogRm9yIGV4YW1wbGUsIHRvIHNldCB0aGUgcHJpdmF0ZSBwcm9wZXJ0eSBcImZvb1wiIG9mIGB0aGlzYCB0byBcImJhclwiLCB5b3UgY2FuIGBwcml2YXRlUHJvcHMuZm9vLnNldCh0aGlzLCAnYmFyJylgXG4gICAqIFRoaXMgaXMgdGhlIGFwcHJvYWNoIHRoYXQgQmFiZWwgd2lsbCBwcm9iYWJseSB0YWtlIHRvIGltcGxlbWVudCBwcml2YXRlIG1ldGhvZHMvZmllbGRzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtcHJpdmF0ZS1tZXRob2RzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL3B1bGwvNzU1NVxuICAgKiBPbmNlIHdlIGhhdmUgdGhlIGNoYW5nZXMgZnJvbSB0aGF0IFBSIGluIEJhYmVsLCBhbmQgb3VyIGNvcmUgY2xhc3MgZml0cyByZWFzb25hYmxlIGluICpvbmUgbW9kdWxlKlxuICAgKiAgIHRoZW4gd2UgY2FuIHVzZSB0aGF0IGxhbmd1YWdlIGZlYXR1cmUuXG4gICAqL1xuXG4gIHZhciBwcml2YXRlTWV0aG9kcyA9IHtcbiAgICBzd2FsUHJvbWlzZVJlc29sdmU6IG5ldyBXZWFrTWFwKCksXG4gICAgc3dhbFByb21pc2VSZWplY3Q6IG5ldyBXZWFrTWFwKClcbiAgfTtcblxuICAvLyBGcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLnBhY2llbGxvZ3JvdXAuY29tL2Jsb2cvMjAxOC8wNi90aGUtY3VycmVudC1zdGF0ZS1vZi1tb2RhbC1kaWFsb2ctYWNjZXNzaWJpbGl0eS9cbiAgLy8gQWRkaW5nIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRvIGVsZW1lbnRzIG91dHNpZGUgb2YgdGhlIGFjdGl2ZSBtb2RhbCBkaWFsb2cgZW5zdXJlcyB0aGF0XG4gIC8vIGVsZW1lbnRzIG5vdCB3aXRoaW4gdGhlIGFjdGl2ZSBtb2RhbCBkaWFsb2cgd2lsbCBub3QgYmUgc3VyZmFjZWQgaWYgYSB1c2VyIG9wZW5zIGEgc2NyZWVuXG4gIC8vIHJlYWRlcuKAmXMgbGlzdCBvZiBlbGVtZW50cyAoaGVhZGluZ3MsIGZvcm0gY29udHJvbHMsIGxhbmRtYXJrcywgZXRjLikgaW4gdGhlIGRvY3VtZW50LlxuXG4gIGNvbnN0IHNldEFyaWFIaWRkZW4gPSAoKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgYm9keUNoaWxkcmVuID0gQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICBib2R5Q2hpbGRyZW4uZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZiAoZWwuY29udGFpbnMoY29udGFpbmVyKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicsIGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSB8fCAnJyk7XG4gICAgICB9XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgdW5zZXRBcmlhSGlkZGVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHlDaGlsZHJlbiA9IEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gICAgYm9keUNoaWxkcmVuLmZvckVhY2goZWwgPT4ge1xuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nKSB8fCAnJyk7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgaXNTYWZhcmlPcklPUyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICEhd2luZG93Lkdlc3R1cmVFdmVudDsgLy8gdHJ1ZSBmb3IgU2FmYXJpIGRlc2t0b3AgKyBhbGwgaU9TIGJyb3dzZXJzIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83MDU4NTM5NFxuXG4gIC8qKlxuICAgKiBGaXggaU9TIHNjcm9sbGluZ1xuICAgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8zOTYyNjMwMlxuICAgKi9cbiAgY29uc3QgaU9TZml4ID0gKCkgPT4ge1xuICAgIGlmIChpc1NhZmFyaU9ySU9TICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpKSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gYCR7b2Zmc2V0ICogLTF9cHhgO1xuICAgICAgYWRkQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KTtcbiAgICAgIGxvY2tCb2R5U2Nyb2xsKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzEyNDZcbiAgICovXG4gIGNvbnN0IGxvY2tCb2R5U2Nyb2xsID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbiAgICBsZXQgcHJldmVudFRvdWNoTW92ZTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1RvdWNoRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgY29udGFpbmVyLm9udG91Y2hzdGFydCA9IGV2ZW50ID0+IHtcbiAgICAgIHByZXZlbnRUb3VjaE1vdmUgPSBzaG91bGRQcmV2ZW50VG91Y2hNb3ZlKGV2ZW50KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7VG91Y2hFdmVudH0gZXZlbnRcbiAgICAgKi9cbiAgICBjb250YWluZXIub250b3VjaG1vdmUgPSBldmVudCA9PiB7XG4gICAgICBpZiAocHJldmVudFRvdWNoTW92ZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1RvdWNoRXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3Qgc2hvdWxkUHJldmVudFRvdWNoTW92ZSA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgaHRtbENvbnRhaW5lciA9IGdldEh0bWxDb250YWluZXIoKTtcbiAgICBpZiAoIWNvbnRhaW5lciB8fCAhaHRtbENvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXNTdHlsdXMoZXZlbnQpIHx8IGlzWm9vbShldmVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRhcmdldCA9PT0gY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFpc1Njcm9sbGFibGUoY29udGFpbmVyKSAmJiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhc2VsZk9yUGFyZW50SXNTY3JvbGxhYmxlKHRhcmdldCwgaHRtbENvbnRhaW5lcikgJiZcbiAgICAvLyAjMjgyM1xuICAgIHRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnICYmXG4gICAgLy8gIzE2MDNcbiAgICB0YXJnZXQudGFnTmFtZSAhPT0gJ1RFWFRBUkVBJyAmJlxuICAgIC8vICMyMjY2XG4gICAgIShpc1Njcm9sbGFibGUoaHRtbENvbnRhaW5lcikgJiZcbiAgICAvLyAjMTk0NFxuICAgIGh0bWxDb250YWluZXIuY29udGFpbnModGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTc4NlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc1N0eWx1cyA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCAmJiBldmVudC50b3VjaGVzWzBdLnRvdWNoVHlwZSA9PT0gJ3N0eWx1cyc7XG4gIH07XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTg5MVxuICAgKlxuICAgKiBAcGFyYW0ge1RvdWNoRXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNab29tID0gZXZlbnQgPT4ge1xuICAgIHJldHVybiBldmVudC50b3VjaGVzICYmIGV2ZW50LnRvdWNoZXMubGVuZ3RoID4gMTtcbiAgfTtcbiAgY29uc3QgdW5kb0lPU2ZpeCA9ICgpID0+IHtcbiAgICBpZiAoaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KSkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5zdHlsZS50b3AsIDEwKTtcbiAgICAgIHJlbW92ZUNsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xuICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBvZmZzZXQgKiAtMTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIE1lYXN1cmUgc2Nyb2xsYmFyIHdpZHRoIGZvciBwYWRkaW5nIGJvZHkgZHVyaW5nIG1vZGFsIHNob3cvaGlkZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvanMvc3JjL21vZGFsLmpzXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBjb25zdCBtZWFzdXJlU2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1snc2Nyb2xsYmFyLW1lYXN1cmUnXTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG4gICAgY29uc3Qgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtZW1iZXIgc3RhdGUgaW4gY2FzZXMgd2hlcmUgb3BlbmluZyBhbmQgaGFuZGxpbmcgYSBtb2RhbCB3aWxsIGZpZGRsZSB3aXRoIGl0LlxuICAgKiBAdHlwZSB7bnVtYmVyIHwgbnVsbH1cbiAgICovXG4gIGxldCBwcmV2aW91c0JvZHlQYWRkaW5nID0gbnVsbDtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxCb2R5T3ZlcmZsb3dcbiAgICovXG4gIGNvbnN0IHJlcGxhY2VTY3JvbGxiYXJXaXRoUGFkZGluZyA9IGluaXRpYWxCb2R5T3ZlcmZsb3cgPT4ge1xuICAgIC8vIGZvciBxdWV1ZXMsIGRvIG5vdCBkbyB0aGlzIG1vcmUgdGhhbiBvbmNlXG4gICAgaWYgKHByZXZpb3VzQm9keVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaWYgdGhlIGJvZHkgaGFzIG92ZXJmbG93XG4gICAgaWYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0IHx8IGluaXRpYWxCb2R5T3ZlcmZsb3cgPT09ICdzY3JvbGwnIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjY2M1xuICAgICkge1xuICAgICAgLy8gYWRkIHBhZGRpbmcgc28gdGhlIGNvbnRlbnQgZG9lc24ndCBzaGlmdCBhZnRlciByZW1vdmFsIG9mIHNjcm9sbGJhclxuICAgICAgcHJldmlvdXNCb2R5UGFkZGluZyA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3ByZXZpb3VzQm9keVBhZGRpbmcgKyBtZWFzdXJlU2Nyb2xsYmFyKCl9cHhgO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdW5kb1JlcGxhY2VTY3JvbGxiYXJXaXRoUGFkZGluZyA9ICgpID0+IHtcbiAgICBpZiAocHJldmlvdXNCb2R5UGFkZGluZyAhPT0gbnVsbCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgJHtwcmV2aW91c0JvZHlQYWRkaW5nfXB4YDtcbiAgICAgIHByZXZpb3VzQm9keVBhZGRpbmcgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtib29sZWFufSByZXR1cm5Gb2N1c1xuICAgKiBAcGFyYW0geygpID0+IHZvaWR9IGRpZENsb3NlXG4gICAqL1xuICBmdW5jdGlvbiByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUoaW5zdGFuY2UsIGNvbnRhaW5lciwgcmV0dXJuRm9jdXMsIGRpZENsb3NlKSB7XG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZShpbnN0YW5jZSwgZGlkQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0b3JlQWN0aXZlRWxlbWVudChyZXR1cm5Gb2N1cykudGhlbigoKSA9PiB0cmlnZ2VyRGlkQ2xvc2VBbmREaXNwb3NlKGluc3RhbmNlLCBkaWRDbG9zZSkpO1xuICAgICAgcmVtb3ZlS2V5ZG93bkhhbmRsZXIoZ2xvYmFsU3RhdGUpO1xuICAgIH1cblxuICAgIC8vIHdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjA4OFxuICAgIC8vIGZvciBzb21lIHJlYXNvbiByZW1vdmluZyB0aGUgY29udGFpbmVyIGluIFNhZmFyaSB3aWxsIHNjcm9sbCB0aGUgZG9jdW1lbnQgdG8gYm90dG9tXG4gICAgaWYgKGlzU2FmYXJpT3JJT1MpIHtcbiAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50Jyk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIucmVtb3ZlKCk7XG4gICAgfVxuICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgIHVuZG9SZXBsYWNlU2Nyb2xsYmFyV2l0aFBhZGRpbmcoKTtcbiAgICAgIHVuZG9JT1NmaXgoKTtcbiAgICAgIHVuc2V0QXJpYUhpZGRlbigpO1xuICAgIH1cbiAgICByZW1vdmVCb2R5Q2xhc3NlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBTd2VldEFsZXJ0MiBjbGFzc2VzIGZyb20gYm9keVxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlQm9keUNsYXNzZXMoKSB7XG4gICAgcmVtb3ZlQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIFtzd2FsQ2xhc3Nlcy5zaG93biwgc3dhbENsYXNzZXNbJ2hlaWdodC1hdXRvJ10sIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG1ldGhvZCB0byBjbG9zZSBzd2VldEFsZXJ0XG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydFJlc3VsdCB8IHVuZGVmaW5lZH0gcmVzb2x2ZVZhbHVlXG4gICAqL1xuICBmdW5jdGlvbiBjbG9zZShyZXNvbHZlVmFsdWUpIHtcbiAgICByZXNvbHZlVmFsdWUgPSBwcmVwYXJlUmVzb2x2ZVZhbHVlKHJlc29sdmVWYWx1ZSk7XG4gICAgY29uc3Qgc3dhbFByb21pc2VSZXNvbHZlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZXNvbHZlLmdldCh0aGlzKTtcbiAgICBjb25zdCBkaWRDbG9zZSA9IHRyaWdnZXJDbG9zZVBvcHVwKHRoaXMpO1xuICAgIGlmICh0aGlzLmlzQXdhaXRpbmdQcm9taXNlKSB7XG4gICAgICAvLyBBIHN3YWwgYXdhaXRpbmcgZm9yIGEgcHJvbWlzZSAoYWZ0ZXIgYSBjbGljayBvbiBDb25maXJtIG9yIERlbnkpIGNhbm5vdCBiZSBkaXNtaXNzZWQgYW55bW9yZSAjMjMzNVxuICAgICAgaWYgKCFyZXNvbHZlVmFsdWUuaXNEaXNtaXNzZWQpIHtcbiAgICAgICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKHRoaXMpO1xuICAgICAgICBzd2FsUHJvbWlzZVJlc29sdmUocmVzb2x2ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpZENsb3NlKSB7XG4gICAgICAvLyBSZXNvbHZlIFN3YWwgcHJvbWlzZVxuICAgICAgc3dhbFByb21pc2VSZXNvbHZlKHJlc29sdmVWYWx1ZSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IHRyaWdnZXJDbG9zZVBvcHVwID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBpZiAoIXBvcHVwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaWYgKCFpbm5lclBhcmFtcyB8fCBoYXNDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZW1vdmVDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuc2hvd0NsYXNzLnBvcHVwKTtcbiAgICBhZGRDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKTtcbiAgICBjb25zdCBiYWNrZHJvcCA9IGdldENvbnRhaW5lcigpO1xuICAgIHJlbW92ZUNsYXNzKGJhY2tkcm9wLCBpbm5lclBhcmFtcy5zaG93Q2xhc3MuYmFja2Ryb3ApO1xuICAgIGFkZENsYXNzKGJhY2tkcm9wLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MuYmFja2Ryb3ApO1xuICAgIGhhbmRsZVBvcHVwQW5pbWF0aW9uKGluc3RhbmNlLCBwb3B1cCwgaW5uZXJQYXJhbXMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Vycm9yIHwgc3RyaW5nfSBlcnJvclxuICAgKi9cbiAgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShlcnJvcikge1xuICAgIGNvbnN0IHJlamVjdFByb21pc2UgPSBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlamVjdC5nZXQodGhpcyk7XG4gICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKHRoaXMpO1xuICAgIGlmIChyZWplY3RQcm9taXNlKSB7XG4gICAgICAvLyBSZWplY3QgU3dhbCBwcm9taXNlXG4gICAgICByZWplY3RQcm9taXNlKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKi9cbiAgY29uc3QgaGFuZGxlQXdhaXRpbmdQcm9taXNlID0gaW5zdGFuY2UgPT4ge1xuICAgIGlmIChpbnN0YW5jZS5pc0F3YWl0aW5nUHJvbWlzZSkge1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmlzQXdhaXRpbmdQcm9taXNlO1xuICAgICAgLy8gVGhlIGluc3RhbmNlIG1pZ2h0IGhhdmUgYmVlbiBwcmV2aW91c2x5IHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVzdW1lIHRoZSBkZXN0cm95IHByb2Nlc3MgaW4gdGhpcyBjYXNlICMyMzM1XG4gICAgICBpZiAoIXByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpKSB7XG4gICAgICAgIGluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRSZXN1bHQgfCB1bmRlZmluZWR9IHJlc29sdmVWYWx1ZVxuICAgKiBAcmV0dXJucyB7U3dlZXRBbGVydFJlc3VsdH1cbiAgICovXG4gIGNvbnN0IHByZXBhcmVSZXNvbHZlVmFsdWUgPSByZXNvbHZlVmFsdWUgPT4ge1xuICAgIC8vIFdoZW4gdXNlciBjYWxscyBTd2FsLmNsb3NlKClcbiAgICBpZiAodHlwZW9mIHJlc29sdmVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzQ29uZmlybWVkOiBmYWxzZSxcbiAgICAgICAgaXNEZW5pZWQ6IGZhbHNlLFxuICAgICAgICBpc0Rpc21pc3NlZDogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgICAgaXNDb25maXJtZWQ6IGZhbHNlLFxuICAgICAgaXNEZW5pZWQ6IGZhbHNlLFxuICAgICAgaXNEaXNtaXNzZWQ6IGZhbHNlXG4gICAgfSwgcmVzb2x2ZVZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cbiAgY29uc3QgaGFuZGxlUG9wdXBBbmltYXRpb24gPSAoaW5zdGFuY2UsIHBvcHVwLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIHZhciBfZ2xvYmFsU3RhdGUkZXZlbnRFbWk7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgLy8gSWYgYW5pbWF0aW9uIGlzIHN1cHBvcnRlZCwgYW5pbWF0ZVxuICAgIGNvbnN0IGFuaW1hdGlvbklzU3VwcG9ydGVkID0gaGFzQ3NzQW5pbWF0aW9uKHBvcHVwKTtcbiAgICBpZiAodHlwZW9mIGlubmVyUGFyYW1zLndpbGxDbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5uZXJQYXJhbXMud2lsbENsb3NlKHBvcHVwKTtcbiAgICB9XG4gICAgKF9nbG9iYWxTdGF0ZSRldmVudEVtaSA9IGdsb2JhbFN0YXRlLmV2ZW50RW1pdHRlcikgPT09IG51bGwgfHwgX2dsb2JhbFN0YXRlJGV2ZW50RW1pID09PSB2b2lkIDAgfHwgX2dsb2JhbFN0YXRlJGV2ZW50RW1pLmVtaXQoJ3dpbGxDbG9zZScsIHBvcHVwKTtcbiAgICBpZiAoYW5pbWF0aW9uSXNTdXBwb3J0ZWQpIHtcbiAgICAgIGFuaW1hdGVQb3B1cChpbnN0YW5jZSwgcG9wdXAsIGNvbnRhaW5lciwgaW5uZXJQYXJhbXMucmV0dXJuRm9jdXMsIGlubmVyUGFyYW1zLmRpZENsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCByZW1vdmUgaW1tZWRpYXRlbHlcbiAgICAgIHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZShpbnN0YW5jZSwgY29udGFpbmVyLCBpbm5lclBhcmFtcy5yZXR1cm5Gb2N1cywgaW5uZXJQYXJhbXMuZGlkQ2xvc2UpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtib29sZWFufSByZXR1cm5Gb2N1c1xuICAgKiBAcGFyYW0geygpID0+IHZvaWR9IGRpZENsb3NlXG4gICAqL1xuICBjb25zdCBhbmltYXRlUG9wdXAgPSAoaW5zdGFuY2UsIHBvcHVwLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSkgPT4ge1xuICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjayA9IHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZS5iaW5kKG51bGwsIGluc3RhbmNlLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSk7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtBbmltYXRpb25FdmVudCB8IFRyYW5zaXRpb25FdmVudH0gZVxuICAgICAqL1xuICAgIGNvbnN0IHN3YWxDbG9zZUFuaW1hdGlvbkZpbmlzaGVkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gcG9wdXApIHtcbiAgICAgICAgdmFyIF9nbG9iYWxTdGF0ZSRzd2FsQ2xvcztcbiAgICAgICAgKF9nbG9iYWxTdGF0ZSRzd2FsQ2xvcyA9IGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaykgPT09IG51bGwgfHwgX2dsb2JhbFN0YXRlJHN3YWxDbG9zID09PSB2b2lkIDAgfHwgX2dsb2JhbFN0YXRlJHN3YWxDbG9zLmNhbGwoZ2xvYmFsU3RhdGUpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrO1xuICAgICAgICBwb3B1cC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBzd2FsQ2xvc2VBbmltYXRpb25GaW5pc2hlZCk7XG4gICAgICAgIHBvcHVwLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBzd2FsQ2xvc2VBbmltYXRpb25GaW5pc2hlZCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwb3B1cC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBzd2FsQ2xvc2VBbmltYXRpb25GaW5pc2hlZCk7XG4gICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHN3YWxDbG9zZUFuaW1hdGlvbkZpbmlzaGVkKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0geygpID0+IHZvaWR9IGRpZENsb3NlXG4gICAqL1xuICBjb25zdCB0cmlnZ2VyRGlkQ2xvc2VBbmREaXNwb3NlID0gKGluc3RhbmNlLCBkaWRDbG9zZSkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdmFyIF9nbG9iYWxTdGF0ZSRldmVudEVtaTI7XG4gICAgICBpZiAodHlwZW9mIGRpZENsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRpZENsb3NlLmJpbmQoaW5zdGFuY2UucGFyYW1zKSgpO1xuICAgICAgfVxuICAgICAgKF9nbG9iYWxTdGF0ZSRldmVudEVtaTIgPSBnbG9iYWxTdGF0ZS5ldmVudEVtaXR0ZXIpID09PSBudWxsIHx8IF9nbG9iYWxTdGF0ZSRldmVudEVtaTIgPT09IHZvaWQgMCB8fCBfZ2xvYmFsU3RhdGUkZXZlbnRFbWkyLmVtaXQoJ2RpZENsb3NlJyk7XG4gICAgICAvLyBpbnN0YW5jZSBtaWdodCBoYXZlIGJlZW4gZGVzdHJveWVkIGFscmVhZHlcbiAgICAgIGlmIChpbnN0YW5jZS5fZGVzdHJveSkge1xuICAgICAgICBpbnN0YW5jZS5fZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93cyBsb2FkZXIgKHNwaW5uZXIpLCB0aGlzIGlzIHVzZWZ1bCB3aXRoIEFKQVggcmVxdWVzdHMuXG4gICAqIEJ5IGRlZmF1bHQgdGhlIGxvYWRlciBiZSBzaG93biBpbnN0ZWFkIG9mIHRoZSBcIkNvbmZpcm1cIiBidXR0b24uXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsfSBbYnV0dG9uVG9SZXBsYWNlXVxuICAgKi9cbiAgY29uc3Qgc2hvd0xvYWRpbmcgPSBidXR0b25Ub1JlcGxhY2UgPT4ge1xuICAgIGxldCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKCFwb3B1cCkge1xuICAgICAgbmV3IFN3YWwoKTtcbiAgICB9XG4gICAgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICghcG9wdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgaGlkZShnZXRJY29uKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsYWNlQnV0dG9uKHBvcHVwLCBidXR0b25Ub1JlcGxhY2UpO1xuICAgIH1cbiAgICBzaG93KGxvYWRlcik7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnLCAndHJ1ZScpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnYXJpYS1idXN5JywgJ3RydWUnKTtcbiAgICBwb3B1cC5mb2N1cygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50IHwgbnVsbH0gW2J1dHRvblRvUmVwbGFjZV1cbiAgICovXG4gIGNvbnN0IHJlcGxhY2VCdXR0b24gPSAocG9wdXAsIGJ1dHRvblRvUmVwbGFjZSkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBnZXRBY3Rpb25zKCk7XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG4gICAgaWYgKCFhY3Rpb25zIHx8ICFsb2FkZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFidXR0b25Ub1JlcGxhY2UgJiYgaXNWaXNpYmxlJDEoZ2V0Q29uZmlybUJ1dHRvbigpKSkge1xuICAgICAgYnV0dG9uVG9SZXBsYWNlID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIH1cbiAgICBzaG93KGFjdGlvbnMpO1xuICAgIGlmIChidXR0b25Ub1JlcGxhY2UpIHtcbiAgICAgIGhpZGUoYnV0dG9uVG9SZXBsYWNlKTtcbiAgICAgIGxvYWRlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnV0dG9uLXRvLXJlcGxhY2UnLCBidXR0b25Ub1JlcGxhY2UuY2xhc3NOYW1lKTtcbiAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGxvYWRlciwgYnV0dG9uVG9SZXBsYWNlKTtcbiAgICB9XG4gICAgYWRkQ2xhc3MoW3BvcHVwLCBhY3Rpb25zXSwgc3dhbENsYXNzZXMubG9hZGluZyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBoYW5kbGVJbnB1dE9wdGlvbnNBbmRWYWx1ZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dCA9PT0gJ3NlbGVjdCcgfHwgcGFyYW1zLmlucHV0ID09PSAncmFkaW8nKSB7XG4gICAgICBoYW5kbGVJbnB1dE9wdGlvbnMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgfSBlbHNlIGlmIChbJ3RleHQnLCAnZW1haWwnLCAnbnVtYmVyJywgJ3RlbCcsICd0ZXh0YXJlYSddLnNvbWUoaSA9PiBpID09PSBwYXJhbXMuaW5wdXQpICYmIChoYXNUb1Byb21pc2VGbihwYXJhbXMuaW5wdXRWYWx1ZSkgfHwgaXNQcm9taXNlKHBhcmFtcy5pbnB1dFZhbHVlKSkpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldENvbmZpcm1CdXR0b24oKSk7XG4gICAgICBoYW5kbGVJbnB1dFZhbHVlKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7U3dlZXRBbGVydElucHV0VmFsdWV9XG4gICAqL1xuICBjb25zdCBnZXRJbnB1dFZhbHVlID0gKGluc3RhbmNlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gaW5zdGFuY2UuZ2V0SW5wdXQoKTtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3dpdGNoIChpbm5lclBhcmFtcy5pbnB1dCkge1xuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICByZXR1cm4gZ2V0Q2hlY2tib3hWYWx1ZShpbnB1dCk7XG4gICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgIHJldHVybiBnZXRSYWRpb1ZhbHVlKGlucHV0KTtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gZ2V0RmlsZVZhbHVlKGlucHV0KTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpbm5lclBhcmFtcy5pbnB1dEF1dG9UcmltID8gaW5wdXQudmFsdWUudHJpbSgpIDogaW5wdXQudmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBjb25zdCBnZXRDaGVja2JveFZhbHVlID0gaW5wdXQgPT4gaW5wdXQuY2hlY2tlZCA/IDEgOiAwO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEByZXR1cm5zIHtzdHJpbmcgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0UmFkaW9WYWx1ZSA9IGlucHV0ID0+IGlucHV0LmNoZWNrZWQgPyBpbnB1dC52YWx1ZSA6IG51bGw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICogQHJldHVybnMge0ZpbGVMaXN0IHwgRmlsZSB8IG51bGx9XG4gICAqL1xuICBjb25zdCBnZXRGaWxlVmFsdWUgPSBpbnB1dCA9PiBpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlcy5sZW5ndGggPyBpbnB1dC5nZXRBdHRyaWJ1dGUoJ211bHRpcGxlJykgIT09IG51bGwgPyBpbnB1dC5maWxlcyA6IGlucHV0LmZpbGVzWzBdIDogbnVsbDtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IGhhbmRsZUlucHV0T3B0aW9ucyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICghcG9wdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsqfSBpbnB1dE9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdCBwcm9jZXNzSW5wdXRPcHRpb25zID0gaW5wdXRPcHRpb25zID0+IHtcbiAgICAgIGlmIChwYXJhbXMuaW5wdXQgPT09ICdzZWxlY3QnKSB7XG4gICAgICAgIHBvcHVsYXRlU2VsZWN0T3B0aW9ucyhwb3B1cCwgZm9ybWF0SW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucyksIHBhcmFtcyk7XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtcy5pbnB1dCA9PT0gJ3JhZGlvJykge1xuICAgICAgICBwb3B1bGF0ZVJhZGlvT3B0aW9ucyhwb3B1cCwgZm9ybWF0SW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucyksIHBhcmFtcyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoaGFzVG9Qcm9taXNlRm4ocGFyYW1zLmlucHV0T3B0aW9ucykgfHwgaXNQcm9taXNlKHBhcmFtcy5pbnB1dE9wdGlvbnMpKSB7XG4gICAgICBzaG93TG9hZGluZyhnZXRDb25maXJtQnV0dG9uKCkpO1xuICAgICAgYXNQcm9taXNlKHBhcmFtcy5pbnB1dE9wdGlvbnMpLnRoZW4oaW5wdXRPcHRpb25zID0+IHtcbiAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhpbnB1dE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyYW1zLmlucHV0T3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHByb2Nlc3NJbnB1dE9wdGlvbnMocGFyYW1zLmlucHV0T3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yKGBVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXRPcHRpb25zISBFeHBlY3RlZCBvYmplY3QsIE1hcCBvciBQcm9taXNlLCBnb3QgJHt0eXBlb2YgcGFyYW1zLmlucHV0T3B0aW9uc31gKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBoYW5kbGVJbnB1dFZhbHVlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGluc3RhbmNlLmdldElucHV0KCk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoaWRlKGlucHV0KTtcbiAgICBhc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpLnRoZW4oaW5wdXRWYWx1ZSA9PiB7XG4gICAgICBpbnB1dC52YWx1ZSA9IHBhcmFtcy5pbnB1dCA9PT0gJ251bWJlcicgPyBgJHtwYXJzZUZsb2F0KGlucHV0VmFsdWUpIHx8IDB9YCA6IGAke2lucHV0VmFsdWV9YDtcbiAgICAgIHNob3coaW5wdXQpO1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIGVycm9yKGBFcnJvciBpbiBpbnB1dFZhbHVlIHByb21pc2U6ICR7ZXJyfWApO1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgIHNob3coaW5wdXQpO1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqIEBwYXJhbSB7SW5wdXRPcHRpb25GbGF0dGVuZWRbXX0gaW5wdXRPcHRpb25zXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gcG9wdWxhdGVTZWxlY3RPcHRpb25zKHBvcHVwLCBpbnB1dE9wdGlvbnMsIHBhcmFtcykge1xuICAgIGNvbnN0IHNlbGVjdCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuc2VsZWN0KTtcbiAgICBpZiAoIXNlbGVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uTGFiZWxcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uVmFsdWVcbiAgICAgKi9cbiAgICBjb25zdCByZW5kZXJPcHRpb24gPSAocGFyZW50LCBvcHRpb25MYWJlbCwgb3B0aW9uVmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0aW9uLnZhbHVlID0gb3B0aW9uVmFsdWU7XG4gICAgICBzZXRJbm5lckh0bWwob3B0aW9uLCBvcHRpb25MYWJlbCk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSBpc1NlbGVjdGVkKG9wdGlvblZhbHVlLCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICB9O1xuICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKGlucHV0T3B0aW9uID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gaW5wdXRPcHRpb25bMF07XG4gICAgICBjb25zdCBvcHRpb25MYWJlbCA9IGlucHV0T3B0aW9uWzFdO1xuICAgICAgLy8gPG9wdGdyb3VwPiBzcGVjOlxuICAgICAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw0MDEvaW50ZXJhY3QvZm9ybXMuaHRtbCNoLTE3LjZcbiAgICAgIC8vIFwiLi4uYWxsIE9QVEdST1VQIGVsZW1lbnRzIG11c3QgYmUgc3BlY2lmaWVkIGRpcmVjdGx5IHdpdGhpbiBhIFNFTEVDVCBlbGVtZW50IChpLmUuLCBncm91cHMgbWF5IG5vdCBiZSBuZXN0ZWQpLi4uXCJcbiAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhpcyBpcyBhIDxvcHRncm91cD5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbkxhYmVsKSkge1xuICAgICAgICAvLyBpZiBpdCBpcyBhbiBhcnJheSwgdGhlbiBpdCBpcyBhbiA8b3B0Z3JvdXA+XG4gICAgICAgIGNvbnN0IG9wdGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0Z3JvdXAnKTtcbiAgICAgICAgb3B0Z3JvdXAubGFiZWwgPSBvcHRpb25WYWx1ZTtcbiAgICAgICAgb3B0Z3JvdXAuZGlzYWJsZWQgPSBmYWxzZTsgLy8gbm90IGNvbmZpZ3VyYWJsZSBmb3Igbm93XG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRncm91cCk7XG4gICAgICAgIG9wdGlvbkxhYmVsLmZvckVhY2gobyA9PiByZW5kZXJPcHRpb24ob3B0Z3JvdXAsIG9bMV0sIG9bMF0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNhc2Ugb2YgPG9wdGlvbj5cbiAgICAgICAgcmVuZGVyT3B0aW9uKHNlbGVjdCwgb3B0aW9uTGFiZWwsIG9wdGlvblZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxlY3QuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge0lucHV0T3B0aW9uRmxhdHRlbmVkW119IGlucHV0T3B0aW9uc1xuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGZ1bmN0aW9uIHBvcHVsYXRlUmFkaW9PcHRpb25zKHBvcHVwLCBpbnB1dE9wdGlvbnMsIHBhcmFtcykge1xuICAgIGNvbnN0IHJhZGlvID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5yYWRpbyk7XG4gICAgaWYgKCFyYWRpbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChpbnB1dE9wdGlvbiA9PiB7XG4gICAgICBjb25zdCByYWRpb1ZhbHVlID0gaW5wdXRPcHRpb25bMF07XG4gICAgICBjb25zdCByYWRpb0xhYmVsID0gaW5wdXRPcHRpb25bMV07XG4gICAgICBjb25zdCByYWRpb0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGNvbnN0IHJhZGlvTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgIHJhZGlvSW5wdXQudHlwZSA9ICdyYWRpbyc7XG4gICAgICByYWRpb0lucHV0Lm5hbWUgPSBzd2FsQ2xhc3Nlcy5yYWRpbztcbiAgICAgIHJhZGlvSW5wdXQudmFsdWUgPSByYWRpb1ZhbHVlO1xuICAgICAgaWYgKGlzU2VsZWN0ZWQocmFkaW9WYWx1ZSwgcGFyYW1zLmlucHV0VmFsdWUpKSB7XG4gICAgICAgIHJhZGlvSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHNldElubmVySHRtbChsYWJlbCwgcmFkaW9MYWJlbCk7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5sYWJlbDtcbiAgICAgIHJhZGlvTGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHJhZGlvSW5wdXQpO1xuICAgICAgcmFkaW9MYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgcmFkaW8uYXBwZW5kQ2hpbGQocmFkaW9MYWJlbEVsZW1lbnQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJhZGlvcyA9IHJhZGlvLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG4gICAgaWYgKHJhZGlvcy5sZW5ndGgpIHtcbiAgICAgIHJhZGlvc1swXS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgaW5wdXRPcHRpb25zYCBpbnRvIGFuIGFycmF5IG9mIGBbdmFsdWUsIGxhYmVsXWBzXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gaW5wdXRPcHRpb25zXG4gICAqIEB0eXBlZGVmIHtzdHJpbmdbXX0gSW5wdXRPcHRpb25GbGF0dGVuZWRcbiAgICogQHJldHVybnMge0lucHV0T3B0aW9uRmxhdHRlbmVkW119XG4gICAqL1xuICBjb25zdCBmb3JtYXRJbnB1dE9wdGlvbnMgPSBpbnB1dE9wdGlvbnMgPT4ge1xuICAgIC8qKiBAdHlwZSB7SW5wdXRPcHRpb25GbGF0dGVuZWRbXX0gKi9cbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBpZiAoaW5wdXRPcHRpb25zIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBsZXQgdmFsdWVGb3JtYXR0ZWQgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZUZvcm1hdHRlZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvLyBjYXNlIG9mIDxvcHRncm91cD5cbiAgICAgICAgICB2YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdElucHV0T3B0aW9ucyh2YWx1ZUZvcm1hdHRlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2goW2tleSwgdmFsdWVGb3JtYXR0ZWRdKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhpbnB1dE9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlRm9ybWF0dGVkID0gaW5wdXRPcHRpb25zW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVGb3JtYXR0ZWQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0Z3JvdXA+XG4gICAgICAgICAgdmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRJbnB1dE9wdGlvbnModmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKFtrZXksIHZhbHVlRm9ybWF0dGVkXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvblZhbHVlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydElucHV0VmFsdWV9IGlucHV0VmFsdWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc1NlbGVjdGVkID0gKG9wdGlvblZhbHVlLCBpbnB1dFZhbHVlKSA9PiB7XG4gICAgcmV0dXJuICEhaW5wdXRWYWx1ZSAmJiBpbnB1dFZhbHVlLnRvU3RyaW5nKCkgPT09IG9wdGlvblZhbHVlLnRvU3RyaW5nKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm1CdXR0b25DbGljayA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLmRpc2FibGVCdXR0b25zKCk7XG4gICAgaWYgKGlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0KGluc3RhbmNlLCAnY29uZmlybScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtKGluc3RhbmNlLCB0cnVlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0IGhhbmRsZURlbnlCdXR0b25DbGljayA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLmRpc2FibGVCdXR0b25zKCk7XG4gICAgaWYgKGlubmVyUGFyYW1zLnJldHVybklucHV0VmFsdWVPbkRlbnkpIHtcbiAgICAgIGhhbmRsZUNvbmZpcm1PckRlbnlXaXRoSW5wdXQoaW5zdGFuY2UsICdkZW55Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbnkoaW5zdGFuY2UsIGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHsoZGlzbWlzczogRGlzbWlzc1JlYXNvbikgPT4gdm9pZH0gZGlzbWlzc1dpdGhcbiAgICovXG4gIGNvbnN0IGhhbmRsZUNhbmNlbEJ1dHRvbkNsaWNrID0gKGluc3RhbmNlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGluc3RhbmNlLmRpc2FibGVCdXR0b25zKCk7XG4gICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5jYW5jZWwpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7J2NvbmZpcm0nIHwgJ2RlbnknfSB0eXBlXG4gICAqL1xuICBjb25zdCBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0ID0gKGluc3RhbmNlLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpZiAoIWlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBlcnJvcihgVGhlIFwiaW5wdXRcIiBwYXJhbWV0ZXIgaXMgbmVlZGVkIHRvIGJlIHNldCB3aGVuIHVzaW5nIHJldHVybklucHV0VmFsdWVPbiR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHR5cGUpfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dCA9IGluc3RhbmNlLmdldElucHV0KCk7XG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IGdldElucHV0VmFsdWUoaW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICBpZiAoaW5uZXJQYXJhbXMuaW5wdXRWYWxpZGF0b3IpIHtcbiAgICAgIGhhbmRsZUlucHV0VmFsaWRhdG9yKGluc3RhbmNlLCBpbnB1dFZhbHVlLCB0eXBlKTtcbiAgICB9IGVsc2UgaWYgKGlucHV0ICYmICFpbnB1dC5jaGVja1ZhbGlkaXR5KCkpIHtcbiAgICAgIGluc3RhbmNlLmVuYWJsZUJ1dHRvbnMoKTtcbiAgICAgIGluc3RhbmNlLnNob3dWYWxpZGF0aW9uTWVzc2FnZShpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSB8fCBpbnB1dC52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGVueScpIHtcbiAgICAgIGRlbnkoaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtKGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0SW5wdXRWYWx1ZX0gaW5wdXRWYWx1ZVxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55J30gdHlwZVxuICAgKi9cbiAgY29uc3QgaGFuZGxlSW5wdXRWYWxpZGF0b3IgPSAoaW5zdGFuY2UsIGlucHV0VmFsdWUsIHR5cGUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLmRpc2FibGVJbnB1dCgpO1xuICAgIGNvbnN0IHZhbGlkYXRpb25Qcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBhc1Byb21pc2UoaW5uZXJQYXJhbXMuaW5wdXRWYWxpZGF0b3IoaW5wdXRWYWx1ZSwgaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpKSk7XG4gICAgdmFsaWRhdGlvblByb21pc2UudGhlbih2YWxpZGF0aW9uTWVzc2FnZSA9PiB7XG4gICAgICBpbnN0YW5jZS5lbmFibGVCdXR0b25zKCk7XG4gICAgICBpbnN0YW5jZS5lbmFibGVJbnB1dCgpO1xuICAgICAgaWYgKHZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICAgIGluc3RhbmNlLnNob3dWYWxpZGF0aW9uTWVzc2FnZSh2YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkZW55Jykge1xuICAgICAgICBkZW55KGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm0oaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIGNvbnN0IGRlbnkgPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCk7XG4gICAgaWYgKGlubmVyUGFyYW1zLnNob3dMb2FkZXJPbkRlbnkpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldERlbnlCdXR0b24oKSk7XG4gICAgfVxuICAgIGlmIChpbm5lclBhcmFtcy5wcmVEZW55KSB7XG4gICAgICBpbnN0YW5jZS5pc0F3YWl0aW5nUHJvbWlzZSA9IHRydWU7IC8vIEZsYWdnaW5nIHRoZSBpbnN0YW5jZSBhcyBhd2FpdGluZyBhIHByb21pc2Ugc28gaXQncyBvd24gcHJvbWlzZSdzIHJlamVjdC9yZXNvbHZlIG1ldGhvZHMgZG9lc24ndCBnZXQgZGVzdHJveWVkIHVudGlsIHRoZSByZXN1bHQgZnJvbSB0aGlzIHByZURlbnkncyBwcm9taXNlIGlzIHJlY2VpdmVkXG4gICAgICBjb25zdCBwcmVEZW55UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLnByZURlbnkodmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgICAgcHJlRGVueVByb21pc2UudGhlbihwcmVEZW55VmFsdWUgPT4ge1xuICAgICAgICBpZiAocHJlRGVueVZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKGluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnN0YW5jZS5jbG9zZSgvKiogQHR5cGUgU3dlZXRBbGVydFJlc3VsdCAqL3tcbiAgICAgICAgICAgIGlzRGVuaWVkOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHR5cGVvZiBwcmVEZW55VmFsdWUgPT09ICd1bmRlZmluZWQnID8gdmFsdWUgOiBwcmVEZW55VmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4gcmVqZWN0V2l0aChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIGVycm9yKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc3RhbmNlLmNsb3NlKC8qKiBAdHlwZSBTd2VldEFsZXJ0UmVzdWx0ICove1xuICAgICAgICBpc0RlbmllZDogdHJ1ZSxcbiAgICAgICAgdmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICBjb25zdCBzdWNjZWVkV2l0aCA9IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICBpbnN0YW5jZS5jbG9zZSgvKiogQHR5cGUgU3dlZXRBbGVydFJlc3VsdCAqL3tcbiAgICAgIGlzQ29uZmlybWVkOiB0cnVlLFxuICAgICAgdmFsdWVcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JcbiAgICovXG4gIGNvbnN0IHJlamVjdFdpdGggPSAoaW5zdGFuY2UsIGVycm9yKSA9PiB7XG4gICAgaW5zdGFuY2UucmVqZWN0UHJvbWlzZShlcnJvcik7XG4gIH07XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgY29uc3QgY29uZmlybSA9IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkKTtcbiAgICBpZiAoaW5uZXJQYXJhbXMuc2hvd0xvYWRlck9uQ29uZmlybSkge1xuICAgICAgc2hvd0xvYWRpbmcoKTtcbiAgICB9XG4gICAgaWYgKGlubmVyUGFyYW1zLnByZUNvbmZpcm0pIHtcbiAgICAgIGluc3RhbmNlLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgICAgIGluc3RhbmNlLmlzQXdhaXRpbmdQcm9taXNlID0gdHJ1ZTsgLy8gRmxhZ2dpbmcgdGhlIGluc3RhbmNlIGFzIGF3YWl0aW5nIGEgcHJvbWlzZSBzbyBpdCdzIG93biBwcm9taXNlJ3MgcmVqZWN0L3Jlc29sdmUgbWV0aG9kcyBkb2Vzbid0IGdldCBkZXN0cm95ZWQgdW50aWwgdGhlIHJlc3VsdCBmcm9tIHRoaXMgcHJlQ29uZmlybSdzIHByb21pc2UgaXMgcmVjZWl2ZWRcbiAgICAgIGNvbnN0IHByZUNvbmZpcm1Qcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBhc1Byb21pc2UoaW5uZXJQYXJhbXMucHJlQ29uZmlybSh2YWx1ZSwgaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpKSk7XG4gICAgICBwcmVDb25maXJtUHJvbWlzZS50aGVuKHByZUNvbmZpcm1WYWx1ZSA9PiB7XG4gICAgICAgIGlmIChpc1Zpc2libGUkMShnZXRWYWxpZGF0aW9uTWVzc2FnZSgpKSB8fCBwcmVDb25maXJtVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UoaW5zdGFuY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRXaXRoKGluc3RhbmNlLCB0eXBlb2YgcHJlQ29uZmlybVZhbHVlID09PSAndW5kZWZpbmVkJyA/IHZhbHVlIDogcHJlQ29uZmlybVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4gcmVqZWN0V2l0aChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIGVycm9yKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRXaXRoKGluc3RhbmNlLCB2YWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIaWRlcyBsb2FkZXIgYW5kIHNob3dzIGJhY2sgdGhlIGJ1dHRvbiB3aGljaCB3YXMgaGlkZGVuIGJ5IC5zaG93TG9hZGluZygpXG4gICAqL1xuICBmdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgICAvLyBkbyBub3RoaW5nIGlmIHBvcHVwIGlzIGNsb3NlZFxuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcbiAgICBpZiAoIWlubmVyUGFyYW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBoaWRlKGRvbUNhY2hlLmxvYWRlcik7XG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgaWYgKGlubmVyUGFyYW1zLmljb24pIHtcbiAgICAgICAgc2hvdyhnZXRJY29uKCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzaG93UmVsYXRlZEJ1dHRvbihkb21DYWNoZSk7XG4gICAgfVxuICAgIHJlbW92ZUNsYXNzKFtkb21DYWNoZS5wb3B1cCwgZG9tQ2FjaGUuYWN0aW9uc10sIHN3YWxDbGFzc2VzLmxvYWRpbmcpO1xuICAgIGRvbUNhY2hlLnBvcHVwLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1idXN5Jyk7XG4gICAgZG9tQ2FjaGUucG9wdXAucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnKTtcbiAgICBkb21DYWNoZS5jb25maXJtQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgZG9tQ2FjaGUuZGVueUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGRvbUNhY2hlLmNhbmNlbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG4gIGNvbnN0IHNob3dSZWxhdGVkQnV0dG9uID0gZG9tQ2FjaGUgPT4ge1xuICAgIGNvbnN0IGJ1dHRvblRvUmVwbGFjZSA9IGRvbUNhY2hlLnBvcHVwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZG9tQ2FjaGUubG9hZGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1idXR0b24tdG8tcmVwbGFjZScpKTtcbiAgICBpZiAoYnV0dG9uVG9SZXBsYWNlLmxlbmd0aCkge1xuICAgICAgc2hvdyhidXR0b25Ub1JlcGxhY2VbMF0sICdpbmxpbmUtYmxvY2snKTtcbiAgICB9IGVsc2UgaWYgKGFsbEJ1dHRvbnNBcmVIaWRkZW4oKSkge1xuICAgICAgaGlkZShkb21DYWNoZS5hY3Rpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGlucHV0IERPTSBub2RlLCB0aGlzIG1ldGhvZCB3b3JrcyB3aXRoIGlucHV0IHBhcmFtZXRlci5cbiAgICpcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SW5wdXQoKSB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBpZiAoIWRvbUNhY2hlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGdldElucHV0JDEoZG9tQ2FjaGUucG9wdXAsIGlubmVyUGFyYW1zLmlucHV0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGJ1dHRvbnNcbiAgICogQHBhcmFtIHtib29sZWFufSBkaXNhYmxlZFxuICAgKi9cbiAgZnVuY3Rpb24gc2V0QnV0dG9uc0Rpc2FibGVkKGluc3RhbmNlLCBidXR0b25zLCBkaXNhYmxlZCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldChpbnN0YW5jZSk7XG4gICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBkb21DYWNoZVtidXR0b25dLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgbnVsbH0gaW5wdXRcbiAgICogQHBhcmFtIHtib29sZWFufSBkaXNhYmxlZFxuICAgKi9cbiAgZnVuY3Rpb24gc2V0SW5wdXREaXNhYmxlZChpbnB1dCwgZGlzYWJsZWQpIHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKCFwb3B1cCB8fCAhaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIC8qKiBAdHlwZSB7Tm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50Pn0gKi9cbiAgICAgIGNvbnN0IHJhZGlvcyA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtzd2FsQ2xhc3Nlcy5yYWRpb31cIl1gKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJhZGlvc1tpXS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGUgYWxsIHRoZSBidXR0b25zXG4gICAqIEB0aGlzIHtTd2VldEFsZXJ0fVxuICAgKi9cbiAgZnVuY3Rpb24gZW5hYmxlQnV0dG9ucygpIHtcbiAgICBzZXRCdXR0b25zRGlzYWJsZWQodGhpcywgWydjb25maXJtQnV0dG9uJywgJ2RlbnlCdXR0b24nLCAnY2FuY2VsQnV0dG9uJ10sIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIGFsbCB0aGUgYnV0dG9uc1xuICAgKiBAdGhpcyB7U3dlZXRBbGVydH1cbiAgICovXG4gIGZ1bmN0aW9uIGRpc2FibGVCdXR0b25zKCkge1xuICAgIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nLCAnZGVueUJ1dHRvbicsICdjYW5jZWxCdXR0b24nXSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlIHRoZSBpbnB1dCBmaWVsZFxuICAgKiBAdGhpcyB7U3dlZXRBbGVydH1cbiAgICovXG4gIGZ1bmN0aW9uIGVuYWJsZUlucHV0KCkge1xuICAgIHNldElucHV0RGlzYWJsZWQodGhpcy5nZXRJbnB1dCgpLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZSB0aGUgaW5wdXQgZmllbGRcbiAgICogQHRoaXMge1N3ZWV0QWxlcnR9XG4gICAqL1xuICBmdW5jdGlvbiBkaXNhYmxlSW5wdXQoKSB7XG4gICAgc2V0SW5wdXREaXNhYmxlZCh0aGlzLmdldElucHV0KCksIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgYmxvY2sgd2l0aCB2YWxpZGF0aW9uIG1lc3NhZ2VcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yXG4gICAqIEB0aGlzIHtTd2VldEFsZXJ0fVxuICAgKi9cbiAgZnVuY3Rpb24gc2hvd1ZhbGlkYXRpb25NZXNzYWdlKGVycm9yKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG4gICAgc2V0SW5uZXJIdG1sKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlLCBlcnJvcik7XG4gICAgZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UuY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddO1xuICAgIGlmIChwYXJhbXMuY3VzdG9tQ2xhc3MgJiYgcGFyYW1zLmN1c3RvbUNsYXNzLnZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICBhZGRDbGFzcyhkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSwgcGFyYW1zLmN1c3RvbUNsYXNzLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICB9XG4gICAgc2hvdyhkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldElucHV0KCk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10pO1xuICAgICAgZm9jdXNJbnB1dChpbnB1dCk7XG4gICAgICBhZGRDbGFzcyhpbnB1dCwgc3dhbENsYXNzZXMuaW5wdXRlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgYmxvY2sgd2l0aCB2YWxpZGF0aW9uIG1lc3NhZ2VcbiAgICpcbiAgICogQHRoaXMge1N3ZWV0QWxlcnR9XG4gICAqL1xuICBmdW5jdGlvbiByZXNldFZhbGlkYXRpb25NZXNzYWdlKCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBpZiAoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgIGhpZGUoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0SW5wdXQoKTtcbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7XG4gICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgIHJlbW92ZUNsYXNzKGlucHV0LCBzd2FsQ2xhc3Nlcy5pbnB1dGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xuICAgIHRpdGxlOiAnJyxcbiAgICB0aXRsZVRleHQ6ICcnLFxuICAgIHRleHQ6ICcnLFxuICAgIGh0bWw6ICcnLFxuICAgIGZvb3RlcjogJycsXG4gICAgaWNvbjogdW5kZWZpbmVkLFxuICAgIGljb25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGljb25IdG1sOiB1bmRlZmluZWQsXG4gICAgdGVtcGxhdGU6IHVuZGVmaW5lZCxcbiAgICB0b2FzdDogZmFsc2UsXG4gICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICBhbmltYXRpb246IHRydWUsXG4gICAgdGhlbWU6ICdsaWdodCcsXG4gICAgc2hvd0NsYXNzOiB7XG4gICAgICBwb3B1cDogJ3N3YWwyLXNob3cnLFxuICAgICAgYmFja2Ryb3A6ICdzd2FsMi1iYWNrZHJvcC1zaG93JyxcbiAgICAgIGljb246ICdzd2FsMi1pY29uLXNob3cnXG4gICAgfSxcbiAgICBoaWRlQ2xhc3M6IHtcbiAgICAgIHBvcHVwOiAnc3dhbDItaGlkZScsXG4gICAgICBiYWNrZHJvcDogJ3N3YWwyLWJhY2tkcm9wLWhpZGUnLFxuICAgICAgaWNvbjogJ3N3YWwyLWljb24taGlkZSdcbiAgICB9LFxuICAgIGN1c3RvbUNsYXNzOiB7fSxcbiAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICBjb2xvcjogdW5kZWZpbmVkLFxuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGhlaWdodEF1dG86IHRydWUsXG4gICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWUsXG4gICAgYWxsb3dFc2NhcGVLZXk6IHRydWUsXG4gICAgYWxsb3dFbnRlcktleTogdHJ1ZSxcbiAgICBzdG9wS2V5ZG93blByb3BhZ2F0aW9uOiB0cnVlLFxuICAgIGtleWRvd25MaXN0ZW5lckNhcHR1cmU6IGZhbHNlLFxuICAgIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICAgIHNob3dEZW55QnV0dG9uOiBmYWxzZSxcbiAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICBwcmVDb25maXJtOiB1bmRlZmluZWQsXG4gICAgcHJlRGVueTogdW5kZWZpbmVkLFxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgIGNvbmZpcm1CdXR0b25BcmlhTGFiZWw6ICcnLFxuICAgIGNvbmZpcm1CdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGRlbnlCdXR0b25UZXh0OiAnTm8nLFxuICAgIGRlbnlCdXR0b25BcmlhTGFiZWw6ICcnLFxuICAgIGRlbnlCdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWwnLFxuICAgIGNhbmNlbEJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgY2FuY2VsQnV0dG9uQ29sb3I6IHVuZGVmaW5lZCxcbiAgICBidXR0b25zU3R5bGluZzogdHJ1ZSxcbiAgICByZXZlcnNlQnV0dG9uczogZmFsc2UsXG4gICAgZm9jdXNDb25maXJtOiB0cnVlLFxuICAgIGZvY3VzRGVueTogZmFsc2UsXG4gICAgZm9jdXNDYW5jZWw6IGZhbHNlLFxuICAgIHJldHVybkZvY3VzOiB0cnVlLFxuICAgIHNob3dDbG9zZUJ1dHRvbjogZmFsc2UsXG4gICAgY2xvc2VCdXR0b25IdG1sOiAnJnRpbWVzOycsXG4gICAgY2xvc2VCdXR0b25BcmlhTGFiZWw6ICdDbG9zZSB0aGlzIGRpYWxvZycsXG4gICAgbG9hZGVySHRtbDogJycsXG4gICAgc2hvd0xvYWRlck9uQ29uZmlybTogZmFsc2UsXG4gICAgc2hvd0xvYWRlck9uRGVueTogZmFsc2UsXG4gICAgaW1hZ2VVcmw6IHVuZGVmaW5lZCxcbiAgICBpbWFnZVdpZHRoOiB1bmRlZmluZWQsXG4gICAgaW1hZ2VIZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUFsdDogJycsXG4gICAgdGltZXI6IHVuZGVmaW5lZCxcbiAgICB0aW1lclByb2dyZXNzQmFyOiBmYWxzZSxcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIHBhZGRpbmc6IHVuZGVmaW5lZCxcbiAgICBiYWNrZ3JvdW5kOiB1bmRlZmluZWQsXG4gICAgaW5wdXQ6IHVuZGVmaW5lZCxcbiAgICBpbnB1dFBsYWNlaG9sZGVyOiAnJyxcbiAgICBpbnB1dExhYmVsOiAnJyxcbiAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICBpbnB1dE9wdGlvbnM6IHt9LFxuICAgIGlucHV0QXV0b0ZvY3VzOiB0cnVlLFxuICAgIGlucHV0QXV0b1RyaW06IHRydWUsXG4gICAgaW5wdXRBdHRyaWJ1dGVzOiB7fSxcbiAgICBpbnB1dFZhbGlkYXRvcjogdW5kZWZpbmVkLFxuICAgIHJldHVybklucHV0VmFsdWVPbkRlbnk6IGZhbHNlLFxuICAgIHZhbGlkYXRpb25NZXNzYWdlOiB1bmRlZmluZWQsXG4gICAgZ3JvdzogZmFsc2UsXG4gICAgcG9zaXRpb246ICdjZW50ZXInLFxuICAgIHByb2dyZXNzU3RlcHM6IFtdLFxuICAgIGN1cnJlbnRQcm9ncmVzc1N0ZXA6IHVuZGVmaW5lZCxcbiAgICBwcm9ncmVzc1N0ZXBzRGlzdGFuY2U6IHVuZGVmaW5lZCxcbiAgICB3aWxsT3BlbjogdW5kZWZpbmVkLFxuICAgIGRpZE9wZW46IHVuZGVmaW5lZCxcbiAgICBkaWRSZW5kZXI6IHVuZGVmaW5lZCxcbiAgICB3aWxsQ2xvc2U6IHVuZGVmaW5lZCxcbiAgICBkaWRDbG9zZTogdW5kZWZpbmVkLFxuICAgIGRpZERlc3Ryb3k6IHVuZGVmaW5lZCxcbiAgICBzY3JvbGxiYXJQYWRkaW5nOiB0cnVlLFxuICAgIHRvcExheWVyOiBmYWxzZVxuICB9O1xuICBjb25zdCB1cGRhdGFibGVQYXJhbXMgPSBbJ2FsbG93RXNjYXBlS2V5JywgJ2FsbG93T3V0c2lkZUNsaWNrJywgJ2JhY2tncm91bmQnLCAnYnV0dG9uc1N0eWxpbmcnLCAnY2FuY2VsQnV0dG9uQXJpYUxhYmVsJywgJ2NhbmNlbEJ1dHRvbkNvbG9yJywgJ2NhbmNlbEJ1dHRvblRleHQnLCAnY2xvc2VCdXR0b25BcmlhTGFiZWwnLCAnY2xvc2VCdXR0b25IdG1sJywgJ2NvbG9yJywgJ2NvbmZpcm1CdXR0b25BcmlhTGFiZWwnLCAnY29uZmlybUJ1dHRvbkNvbG9yJywgJ2NvbmZpcm1CdXR0b25UZXh0JywgJ2N1cnJlbnRQcm9ncmVzc1N0ZXAnLCAnY3VzdG9tQ2xhc3MnLCAnZGVueUJ1dHRvbkFyaWFMYWJlbCcsICdkZW55QnV0dG9uQ29sb3InLCAnZGVueUJ1dHRvblRleHQnLCAnZGlkQ2xvc2UnLCAnZGlkRGVzdHJveScsICdkcmFnZ2FibGUnLCAnZm9vdGVyJywgJ2hpZGVDbGFzcycsICdodG1sJywgJ2ljb24nLCAnaWNvbkNvbG9yJywgJ2ljb25IdG1sJywgJ2ltYWdlQWx0JywgJ2ltYWdlSGVpZ2h0JywgJ2ltYWdlVXJsJywgJ2ltYWdlV2lkdGgnLCAncHJlQ29uZmlybScsICdwcmVEZW55JywgJ3Byb2dyZXNzU3RlcHMnLCAncmV0dXJuRm9jdXMnLCAncmV2ZXJzZUJ1dHRvbnMnLCAnc2hvd0NhbmNlbEJ1dHRvbicsICdzaG93Q2xvc2VCdXR0b24nLCAnc2hvd0NvbmZpcm1CdXR0b24nLCAnc2hvd0RlbnlCdXR0b24nLCAndGV4dCcsICd0aXRsZScsICd0aXRsZVRleHQnLCAndGhlbWUnLCAnd2lsbENsb3NlJ107XG5cbiAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCB1bmRlZmluZWQ+fSAqL1xuICBjb25zdCBkZXByZWNhdGVkUGFyYW1zID0ge1xuICAgIGFsbG93RW50ZXJLZXk6IHVuZGVmaW5lZFxuICB9O1xuICBjb25zdCB0b2FzdEluY29tcGF0aWJsZVBhcmFtcyA9IFsnYWxsb3dPdXRzaWRlQ2xpY2snLCAnYWxsb3dFbnRlcktleScsICdiYWNrZHJvcCcsICdkcmFnZ2FibGUnLCAnZm9jdXNDb25maXJtJywgJ2ZvY3VzRGVueScsICdmb2N1c0NhbmNlbCcsICdyZXR1cm5Gb2N1cycsICdoZWlnaHRBdXRvJywgJ2tleWRvd25MaXN0ZW5lckNhcHR1cmUnXTtcblxuICAvKipcbiAgICogSXMgdmFsaWQgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc1ZhbGlkUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlZmF1bHRQYXJhbXMsIHBhcmFtTmFtZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHZhbGlkIHBhcmFtZXRlciBmb3IgU3dhbC51cGRhdGUoKSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGlzVXBkYXRhYmxlUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gdXBkYXRhYmxlUGFyYW1zLmluZGV4T2YocGFyYW1OYW1lKSAhPT0gLTE7XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIGRlcHJlY2F0ZWQgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge3N0cmluZyB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGNvbnN0IGlzRGVwcmVjYXRlZFBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIGRlcHJlY2F0ZWRQYXJhbXNbcGFyYW1OYW1lXTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuICBjb25zdCBjaGVja0lmUGFyYW1Jc1ZhbGlkID0gcGFyYW0gPT4ge1xuICAgIGlmICghaXNWYWxpZFBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgIHdhcm4oYFVua25vd24gcGFyYW1ldGVyIFwiJHtwYXJhbX1cImApO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuICBjb25zdCBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQgPSBwYXJhbSA9PiB7XG4gICAgaWYgKHRvYXN0SW5jb21wYXRpYmxlUGFyYW1zLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgd2FybihgVGhlIHBhcmFtZXRlciBcIiR7cGFyYW19XCIgaXMgaW5jb21wYXRpYmxlIHdpdGggdG9hc3RzYCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG4gIGNvbnN0IGNoZWNrSWZQYXJhbUlzRGVwcmVjYXRlZCA9IHBhcmFtID0+IHtcbiAgICBjb25zdCBpc0RlcHJlY2F0ZWQgPSBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIocGFyYW0pO1xuICAgIGlmIChpc0RlcHJlY2F0ZWQpIHtcbiAgICAgIHdhcm5BYm91dERlcHJlY2F0aW9uKHBhcmFtLCBpc0RlcHJlY2F0ZWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2hvdyByZWxldmFudCB3YXJuaW5ncyBmb3IgZ2l2ZW4gcGFyYW1zXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBpZiAocGFyYW1zLmJhY2tkcm9wID09PSBmYWxzZSAmJiBwYXJhbXMuYWxsb3dPdXRzaWRlQ2xpY2spIHtcbiAgICAgIHdhcm4oJ1wiYWxsb3dPdXRzaWRlQ2xpY2tcIiBwYXJhbWV0ZXIgcmVxdWlyZXMgYGJhY2tkcm9wYCBwYXJhbWV0ZXIgdG8gYmUgc2V0IHRvIGB0cnVlYCcpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnRoZW1lICYmICFbJ2xpZ2h0JywgJ2RhcmsnLCAnYXV0bycsICdtaW5pbWFsJywgJ2JvcmRlcmxlc3MnLCAnYm9vdHN0cmFwLTQnLCAnYm9vdHN0cmFwLTQtbGlnaHQnLCAnYm9vdHN0cmFwLTQtZGFyaycsICdib290c3RyYXAtNScsICdib290c3RyYXAtNS1saWdodCcsICdib290c3RyYXAtNS1kYXJrJywgJ21hdGVyaWFsLXVpJywgJ21hdGVyaWFsLXVpLWxpZ2h0JywgJ21hdGVyaWFsLXVpLWRhcmsnLCAnZW1iZWQtaWZyYW1lJywgJ2J1bG1hJywgJ2J1bG1hLWxpZ2h0JywgJ2J1bG1hLWRhcmsnXS5pbmNsdWRlcyhwYXJhbXMudGhlbWUpKSB7XG4gICAgICB3YXJuKGBJbnZhbGlkIHRoZW1lIFwiJHtwYXJhbXMudGhlbWV9XCJgKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBwYXJhbSBpbiBwYXJhbXMpIHtcbiAgICAgIGNoZWNrSWZQYXJhbUlzVmFsaWQocGFyYW0pO1xuICAgICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgICBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQocGFyYW0pO1xuICAgICAgfVxuICAgICAgY2hlY2tJZlBhcmFtSXNEZXByZWNhdGVkKHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgcG9wdXAgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUocGFyYW1zKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcbiAgICBpZiAoIXBvcHVwIHx8IGhhc0NsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MucG9wdXApKSB7XG4gICAgICB3YXJuKGBZb3UncmUgdHJ5aW5nIHRvIHVwZGF0ZSB0aGUgY2xvc2VkIG9yIGNsb3NpbmcgcG9wdXAsIHRoYXQgd29uJ3Qgd29yay4gVXNlIHRoZSB1cGRhdGUoKSBtZXRob2QgaW4gcHJlQ29uZmlybSBwYXJhbWV0ZXIgb3Igc2hvdyBhIG5ldyBwb3B1cC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdmFsaWRVcGRhdGFibGVQYXJhbXMgPSBmaWx0ZXJWYWxpZFBhcmFtcyhwYXJhbXMpO1xuICAgIGNvbnN0IHVwZGF0ZWRQYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBpbm5lclBhcmFtcywgdmFsaWRVcGRhdGFibGVQYXJhbXMpO1xuICAgIHNob3dXYXJuaW5nc0ZvclBhcmFtcyh1cGRhdGVkUGFyYW1zKTtcbiAgICBjb250YWluZXIuZGF0YXNldFsnc3dhbDJUaGVtZSddID0gdXBkYXRlZFBhcmFtcy50aGVtZTtcbiAgICByZW5kZXIodGhpcywgdXBkYXRlZFBhcmFtcyk7XG4gICAgcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLnNldCh0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdmFsdWU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFyYW1zLCBwYXJhbXMpLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge1N3ZWV0QWxlcnRPcHRpb25zfVxuICAgKi9cbiAgY29uc3QgZmlsdGVyVmFsaWRQYXJhbXMgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IHZhbGlkVXBkYXRhYmxlUGFyYW1zID0ge307XG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIGlmIChpc1VwZGF0YWJsZVBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgICAgdmFsaWRVcGRhdGFibGVQYXJhbXNbcGFyYW1dID0gcGFyYW1zW3BhcmFtXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdhcm4oYEludmFsaWQgcGFyYW1ldGVyIHRvIHVwZGF0ZTogJHtwYXJhbX1gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsaWRVcGRhdGFibGVQYXJhbXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3Bvc2UgdGhlIGN1cnJlbnQgU3dlZXRBbGVydDIgaW5zdGFuY2VcbiAgICovXG4gIGZ1bmN0aW9uIF9kZXN0cm95KCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgZGlzcG9zZVdlYWtNYXBzKHRoaXMpOyAvLyBUaGUgV2Vha01hcHMgbWlnaHQgaGF2ZSBiZWVuIHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVjYWxsIGl0IHRvIGRpc3Bvc2UgYW55IHJlbWFpbmluZyBXZWFrTWFwcyAjMjMzNVxuICAgICAgcmV0dXJuOyAvLyBUaGlzIGluc3RhbmNlIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYW5vdGhlciBTd2FsIGNsb3NpbmdcbiAgICBpZiAoZG9tQ2FjaGUucG9wdXAgJiYgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrKSB7XG4gICAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2soKTtcbiAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2s7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgaW5uZXJQYXJhbXMuZGlkRGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5uZXJQYXJhbXMuZGlkRGVzdHJveSgpO1xuICAgIH1cbiAgICBnbG9iYWxTdGF0ZS5ldmVudEVtaXR0ZXIuZW1pdCgnZGlkRGVzdHJveScpO1xuICAgIGRpc3Bvc2VTd2FsKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0IGRpc3Bvc2VTd2FsID0gaW5zdGFuY2UgPT4ge1xuICAgIGRpc3Bvc2VXZWFrTWFwcyhpbnN0YW5jZSk7XG4gICAgLy8gVW5zZXQgdGhpcy5wYXJhbXMgc28gR0Mgd2lsbCBkaXNwb3NlIGl0ICgjMTU2OSlcbiAgICBkZWxldGUgaW5zdGFuY2UucGFyYW1zO1xuICAgIC8vIFVuc2V0IGdsb2JhbFN0YXRlIHByb3BzIHNvIEdDIHdpbGwgZGlzcG9zZSBnbG9iYWxTdGF0ZSAoIzE1NjkpXG4gICAgZGVsZXRlIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyO1xuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0O1xuICAgIC8vIFVuc2V0IGN1cnJlbnRJbnN0YW5jZVxuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydH0gaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0IGRpc3Bvc2VXZWFrTWFwcyA9IGluc3RhbmNlID0+IHtcbiAgICAvLyBJZiB0aGUgY3VycmVudCBpbnN0YW5jZSBpcyBhd2FpdGluZyBhIHByb21pc2UgcmVzdWx0LCB3ZSBrZWVwIHRoZSBwcml2YXRlTWV0aG9kcyB0byBjYWxsIHRoZW0gb25jZSB0aGUgcHJvbWlzZSByZXN1bHQgaXMgcmV0cmlldmVkICMyMzM1XG4gICAgaWYgKGluc3RhbmNlLmlzQXdhaXRpbmdQcm9taXNlKSB7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVQcm9wcywgaW5zdGFuY2UpO1xuICAgICAgaW5zdGFuY2UuaXNBd2FpdGluZ1Byb21pc2UgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVNZXRob2RzLCBpbnN0YW5jZSk7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVQcm9wcywgaW5zdGFuY2UpO1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmlzQXdhaXRpbmdQcm9taXNlO1xuICAgICAgLy8gVW5zZXQgaW5zdGFuY2UgbWV0aG9kc1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmRpc2FibGVCdXR0b25zO1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmVuYWJsZUJ1dHRvbnM7XG4gICAgICBkZWxldGUgaW5zdGFuY2UuZ2V0SW5wdXQ7XG4gICAgICBkZWxldGUgaW5zdGFuY2UuZGlzYWJsZUlucHV0O1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmVuYWJsZUlucHV0O1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmhpZGVMb2FkaW5nO1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmRpc2FibGVMb2FkaW5nO1xuICAgICAgZGVsZXRlIGluc3RhbmNlLnNob3dWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICAgIGRlbGV0ZSBpbnN0YW5jZS5yZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmNsb3NlO1xuICAgICAgZGVsZXRlIGluc3RhbmNlLmNsb3NlUG9wdXA7XG4gICAgICBkZWxldGUgaW5zdGFuY2UuY2xvc2VNb2RhbDtcbiAgICAgIGRlbGV0ZSBpbnN0YW5jZS5jbG9zZVRvYXN0O1xuICAgICAgZGVsZXRlIGluc3RhbmNlLnJlamVjdFByb21pc2U7XG4gICAgICBkZWxldGUgaW5zdGFuY2UudXBkYXRlO1xuICAgICAgZGVsZXRlIGluc3RhbmNlLl9kZXN0cm95O1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IG9ialxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqL1xuICBjb25zdCB1bnNldFdlYWtNYXBzID0gKG9iaiwgaW5zdGFuY2UpID0+IHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICBvYmpbaV0uZGVsZXRlKGluc3RhbmNlKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGluc3RhbmNlTWV0aG9kcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgX2Rlc3Ryb3k6IF9kZXN0cm95LFxuICAgIGNsb3NlOiBjbG9zZSxcbiAgICBjbG9zZU1vZGFsOiBjbG9zZSxcbiAgICBjbG9zZVBvcHVwOiBjbG9zZSxcbiAgICBjbG9zZVRvYXN0OiBjbG9zZSxcbiAgICBkaXNhYmxlQnV0dG9uczogZGlzYWJsZUJ1dHRvbnMsXG4gICAgZGlzYWJsZUlucHV0OiBkaXNhYmxlSW5wdXQsXG4gICAgZGlzYWJsZUxvYWRpbmc6IGhpZGVMb2FkaW5nLFxuICAgIGVuYWJsZUJ1dHRvbnM6IGVuYWJsZUJ1dHRvbnMsXG4gICAgZW5hYmxlSW5wdXQ6IGVuYWJsZUlucHV0LFxuICAgIGdldElucHV0OiBnZXRJbnB1dCxcbiAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2U6IGhhbmRsZUF3YWl0aW5nUHJvbWlzZSxcbiAgICBoaWRlTG9hZGluZzogaGlkZUxvYWRpbmcsXG4gICAgcmVqZWN0UHJvbWlzZTogcmVqZWN0UHJvbWlzZSxcbiAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlOiByZXNldFZhbGlkYXRpb25NZXNzYWdlLFxuICAgIHNob3dWYWxpZGF0aW9uTWVzc2FnZTogc2hvd1ZhbGlkYXRpb25NZXNzYWdlLFxuICAgIHVwZGF0ZTogdXBkYXRlXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0geyhkaXNtaXNzOiBEaXNtaXNzUmVhc29uKSA9PiB2b2lkfSBkaXNtaXNzV2l0aFxuICAgKi9cbiAgY29uc3QgaGFuZGxlUG9wdXBDbGljayA9IChpbm5lclBhcmFtcywgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgaWYgKGlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICBoYW5kbGVUb2FzdENsaWNrKGlubmVyUGFyYW1zLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZ25vcmUgY2xpY2sgZXZlbnRzIHRoYXQgaGFkIG1vdXNlZG93biBvbiB0aGUgcG9wdXAgYnV0IG1vdXNldXAgb24gdGhlIGNvbnRhaW5lclxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIHdoZW4gdGhlIHVzZXIgZHJhZ3MgYSBzbGlkZXJcbiAgICAgIGhhbmRsZU1vZGFsTW91c2Vkb3duKGRvbUNhY2hlKTtcblxuICAgICAgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIGNvbnRhaW5lciBidXQgbW91c2V1cCBvbiB0aGUgcG9wdXBcbiAgICAgIGhhbmRsZUNvbnRhaW5lck1vdXNlZG93bihkb21DYWNoZSk7XG4gICAgICBoYW5kbGVNb2RhbENsaWNrKGlubmVyUGFyYW1zLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHBhcmFtIHsoZGlzbWlzczogRGlzbWlzc1JlYXNvbikgPT4gdm9pZH0gZGlzbWlzc1dpdGhcbiAgICovXG4gIGNvbnN0IGhhbmRsZVRvYXN0Q2xpY2sgPSAoaW5uZXJQYXJhbXMsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIC8vIENsb3NpbmcgdG9hc3QgYnkgaW50ZXJuYWwgY2xpY2tcbiAgICBkb21DYWNoZS5wb3B1cC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgaWYgKGlubmVyUGFyYW1zICYmIChpc0FueUJ1dHRvblNob3duKGlubmVyUGFyYW1zKSB8fCBpbm5lclBhcmFtcy50aW1lciB8fCBpbm5lclBhcmFtcy5pbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5jbG9zZSk7XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc0FueUJ1dHRvblNob3duID0gaW5uZXJQYXJhbXMgPT4ge1xuICAgIHJldHVybiAhIShpbm5lclBhcmFtcy5zaG93Q29uZmlybUJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93RGVueUJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93Q2FuY2VsQnV0dG9uIHx8IGlubmVyUGFyYW1zLnNob3dDbG9zZUJ1dHRvbik7XG4gIH07XG4gIGxldCBpZ25vcmVPdXRzaWRlQ2xpY2sgPSBmYWxzZTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICovXG4gIGNvbnN0IGhhbmRsZU1vZGFsTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2Vkb3duID0gKCkgPT4ge1xuICAgICAgZG9tQ2FjaGUuY29udGFpbmVyLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNldXAgPSAoKSA9PiB7fTtcbiAgICAgICAgLy8gV2Ugb25seSBjaGVjayBpZiB0aGUgbW91c2V1cCB0YXJnZXQgaXMgdGhlIGNvbnRhaW5lciBiZWNhdXNlIHVzdWFsbHkgaXQgZG9lc24ndFxuICAgICAgICAvLyBoYXZlIGFueSBvdGhlciBkaXJlY3QgY2hpbGRyZW4gYXNpZGUgb2YgdGhlIHBvcHVwXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUuY29udGFpbmVyKSB7XG4gICAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKi9cbiAgY29uc3QgaGFuZGxlQ29udGFpbmVyTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNlZG93biA9IGUgPT4ge1xuICAgICAgLy8gcHJldmVudCB0aGUgbW9kYWwgdGV4dCBmcm9tIGJlaW5nIHNlbGVjdGVkIG9uIGRvdWJsZSBjbGljayBvbiB0aGUgY29udGFpbmVyIChhbGxvd091dHNpZGVDbGljazogZmFsc2UpXG4gICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLmNvbnRhaW5lcikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBkb21DYWNoZS5wb3B1cC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkb21DYWNoZS5wb3B1cC5vbm1vdXNldXAgPSAoKSA9PiB7fTtcbiAgICAgICAgLy8gV2UgYWxzbyBuZWVkIHRvIGNoZWNrIGlmIHRoZSBtb3VzZXVwIHRhcmdldCBpcyBhIGNoaWxkIG9mIHRoZSBwb3B1cFxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLnBvcHVwIHx8IGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgZG9tQ2FjaGUucG9wdXAuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0geyhkaXNtaXNzOiBEaXNtaXNzUmVhc29uKSA9PiB2b2lkfSBkaXNtaXNzV2l0aFxuICAgKi9cbiAgY29uc3QgaGFuZGxlTW9kYWxDbGljayA9IChpbm5lclBhcmFtcywgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgZG9tQ2FjaGUuY29udGFpbmVyLm9uY2xpY2sgPSBlID0+IHtcbiAgICAgIGlmIChpZ25vcmVPdXRzaWRlQ2xpY2spIHtcbiAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUuY29udGFpbmVyICYmIGNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93T3V0c2lkZUNsaWNrKSkge1xuICAgICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmJhY2tkcm9wKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGlzSnF1ZXJ5RWxlbWVudCA9IGVsZW0gPT4gdHlwZW9mIGVsZW0gPT09ICdvYmplY3QnICYmIGVsZW0uanF1ZXJ5O1xuICBjb25zdCBpc0VsZW1lbnQgPSBlbGVtID0+IGVsZW0gaW5zdGFuY2VvZiBFbGVtZW50IHx8IGlzSnF1ZXJ5RWxlbWVudChlbGVtKTtcbiAgY29uc3QgYXJnc1RvUGFyYW1zID0gYXJncyA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0ge307XG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJiAhaXNFbGVtZW50KGFyZ3NbMF0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHBhcmFtcywgYXJnc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFsndGl0bGUnLCAnaHRtbCcsICdpY29uJ10uZm9yRWFjaCgobmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgYXJnID0gYXJnc1tpbmRleF07XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fCBpc0VsZW1lbnQoYXJnKSkge1xuICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVycm9yKGBVbmV4cGVjdGVkIHR5cGUgb2YgJHtuYW1lfSEgRXhwZWN0ZWQgXCJzdHJpbmdcIiBvciBcIkVsZW1lbnRcIiwgZ290ICR7dHlwZW9mIGFyZ31gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1haW4gbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBTd2VldEFsZXJ0MiBwb3B1cFxuICAgKlxuICAgKiBAcGFyYW0gIHsuLi5Td2VldEFsZXJ0T3B0aW9uc30gYXJnc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTd2VldEFsZXJ0UmVzdWx0Pn1cbiAgICovXG4gIGZ1bmN0aW9uIGZpcmUoLi4uYXJncykge1xuICAgIHJldHVybiBuZXcgdGhpcyguLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGV4dGVuZGVkIHZlcnNpb24gb2YgYFN3YWxgIGNvbnRhaW5pbmcgYHBhcmFtc2AgYXMgZGVmYXVsdHMuXG4gICAqIFVzZWZ1bCBmb3IgcmV1c2luZyBTd2FsIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBCZWZvcmU6XG4gICAqIGNvbnN0IHRleHRQcm9tcHRPcHRpb25zID0geyBpbnB1dDogJ3RleHQnLCBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlIH1cbiAgICogY29uc3Qge3ZhbHVlOiBmaXJzdE5hbWV9ID0gYXdhaXQgU3dhbC5maXJlKHsgLi4udGV4dFByb21wdE9wdGlvbnMsIHRpdGxlOiAnV2hhdCBpcyB5b3VyIGZpcnN0IG5hbWU/JyB9KVxuICAgKiBjb25zdCB7dmFsdWU6IGxhc3ROYW1lfSA9IGF3YWl0IFN3YWwuZmlyZSh7IC4uLnRleHRQcm9tcHRPcHRpb25zLCB0aXRsZTogJ1doYXQgaXMgeW91ciBsYXN0IG5hbWU/JyB9KVxuICAgKlxuICAgKiBBZnRlcjpcbiAgICogY29uc3QgVGV4dFByb21wdCA9IFN3YWwubWl4aW4oeyBpbnB1dDogJ3RleHQnLCBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlIH0pXG4gICAqIGNvbnN0IHt2YWx1ZTogZmlyc3ROYW1lfSA9IGF3YWl0IFRleHRQcm9tcHQoJ1doYXQgaXMgeW91ciBmaXJzdCBuYW1lPycpXG4gICAqIGNvbnN0IHt2YWx1ZTogbGFzdE5hbWV9ID0gYXdhaXQgVGV4dFByb21wdCgnV2hhdCBpcyB5b3VyIGxhc3QgbmFtZT8nKVxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBtaXhpblBhcmFtc1xuICAgKiBAcmV0dXJucyB7U3dlZXRBbGVydH1cbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKG1peGluUGFyYW1zKSB7XG4gICAgY2xhc3MgTWl4aW5Td2FsIGV4dGVuZHMgdGhpcyB7XG4gICAgICBfbWFpbihwYXJhbXMsIHByaW9yaXR5TWl4aW5QYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9tYWluKHBhcmFtcywgT2JqZWN0LmFzc2lnbih7fSwgbWl4aW5QYXJhbXMsIHByaW9yaXR5TWl4aW5QYXJhbXMpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBNaXhpblN3YWw7XG4gIH1cblxuICAvKipcbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXMgc2V0LCByZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIE90aGVyd2lzZSwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXIgfCB1bmRlZmluZWR9XG4gICAqL1xuICBjb25zdCBnZXRUaW1lckxlZnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5nZXRUaW1lckxlZnQoKTtcbiAgfTtcblxuICAvKipcbiAgICogU3RvcCB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgY29uc3Qgc3RvcFRpbWVyID0gKCkgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICBzdG9wVGltZXJQcm9ncmVzc0JhcigpO1xuICAgICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RvcCgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVzdW1lIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXIgfCB1bmRlZmluZWR9XG4gICAqL1xuICBjb25zdCByZXN1bWVUaW1lciA9ICgpID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gZ2xvYmFsU3RhdGUudGltZW91dC5zdGFydCgpO1xuICAgICAgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIocmVtYWluaW5nKTtcbiAgICAgIHJldHVybiByZW1haW5pbmc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXN1bWUgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlciB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGNvbnN0IHRvZ2dsZVRpbWVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyID0gZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICByZXR1cm4gdGltZXIgJiYgKHRpbWVyLnJ1bm5pbmcgPyBzdG9wVGltZXIoKSA6IHJlc3VtZVRpbWVyKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbmNyZWFzZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIGFuIHVwZGF0ZWQgdGltZXIuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtc1xuICAgKiBAcmV0dXJucyB7bnVtYmVyIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgY29uc3QgaW5jcmVhc2VUaW1lciA9IG1zID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gZ2xvYmFsU3RhdGUudGltZW91dC5pbmNyZWFzZShtcyk7XG4gICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0JhcihyZW1haW5pbmcsIHRydWUpO1xuICAgICAgcmV0dXJuIHJlbWFpbmluZztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRpbWVyIGlzIHJ1bm5pbmcuIFJldHVybnMgdHJ1ZSBpZiB0aW1lciBpcyBydW5uaW5nXG4gICAqIG9yIGZhbHNlIGlmIHRpbWVyIGlzIHBhdXNlZCBvciBzdG9wcGVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNUaW1lclJ1bm5pbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuICEhKGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5pc1J1bm5pbmcoKSk7XG4gIH07XG5cbiAgbGV0IGJvZHlDbGlja0xpc3RlbmVyQWRkZWQgPSBmYWxzZTtcbiAgY29uc3QgY2xpY2tIYW5kbGVycyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0clxuICAgKi9cbiAgZnVuY3Rpb24gYmluZENsaWNrSGFuZGxlcihhdHRyID0gJ2RhdGEtc3dhbC10ZW1wbGF0ZScpIHtcbiAgICBjbGlja0hhbmRsZXJzW2F0dHJdID0gdGhpcztcbiAgICBpZiAoIWJvZHlDbGlja0xpc3RlbmVyQWRkZWQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBib2R5Q2xpY2tMaXN0ZW5lcik7XG4gICAgICBib2R5Q2xpY2tMaXN0ZW5lckFkZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgY29uc3QgYm9keUNsaWNrTGlzdGVuZXIgPSBldmVudCA9PiB7XG4gICAgZm9yIChsZXQgZWwgPSBldmVudC50YXJnZXQ7IGVsICYmIGVsICE9PSBkb2N1bWVudDsgZWwgPSBlbC5wYXJlbnROb2RlKSB7XG4gICAgICBmb3IgKGNvbnN0IGF0dHIgaW4gY2xpY2tIYW5kbGVycykge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgY2xpY2tIYW5kbGVyc1thdHRyXS5maXJlKHtcbiAgICAgICAgICAgIHRlbXBsYXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFNvdXJjZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbXVkZ2UvNTgzMDM4Mj9wZXJtYWxpbmtfY29tbWVudF9pZD0yNjkxOTU3I2dpc3Rjb21tZW50LTI2OTE5NTdcblxuICBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgLyoqIEB0eXBlIHtFdmVudHN9ICovXG4gICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICAgKiBAcmV0dXJucyB7RXZlbnRIYW5kbGVyc31cbiAgICAgKi9cbiAgICBfZ2V0SGFuZGxlcnNCeUV2ZW50TmFtZShldmVudE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gbm90IFNldCBiZWNhdXNlIHdlIG5lZWQgdG8ga2VlcCB0aGUgRklGTyBvcmRlclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvcHVsbC8yNzYzI2Rpc2N1c3Npb25fcjE3NDg5OTAzMzRcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgICAqIEBwYXJhbSB7RXZlbnRIYW5kbGVyfSBldmVudEhhbmRsZXJcbiAgICAgKi9cbiAgICBvbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgY29uc3QgY3VycmVudEhhbmRsZXJzID0gdGhpcy5fZ2V0SGFuZGxlcnNCeUV2ZW50TmFtZShldmVudE5hbWUpO1xuICAgICAgaWYgKCFjdXJyZW50SGFuZGxlcnMuaW5jbHVkZXMoZXZlbnRIYW5kbGVyKSkge1xuICAgICAgICBjdXJyZW50SGFuZGxlcnMucHVzaChldmVudEhhbmRsZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICAgKiBAcGFyYW0ge0V2ZW50SGFuZGxlcn0gZXZlbnRIYW5kbGVyXG4gICAgICovXG4gICAgb25jZShldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG9uY2VGbiA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBvbmNlRm4pO1xuICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICB9O1xuICAgICAgdGhpcy5vbihldmVudE5hbWUsIG9uY2VGbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcbiAgICAgKi9cbiAgICBlbWl0KGV2ZW50TmFtZSwgLi4uYXJncykge1xuICAgICAgdGhpcy5fZ2V0SGFuZGxlcnNCeUV2ZW50TmFtZShldmVudE5hbWUpLmZvckVhY2goXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RXZlbnRIYW5kbGVyfSBldmVudEhhbmRsZXJcbiAgICAgICAqL1xuICAgICAgZXZlbnRIYW5kbGVyID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICAgKiBAcGFyYW0ge0V2ZW50SGFuZGxlcn0gZXZlbnRIYW5kbGVyXG4gICAgICovXG4gICAgcmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRIYW5kbGVycyA9IHRoaXMuX2dldEhhbmRsZXJzQnlFdmVudE5hbWUoZXZlbnROYW1lKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gY3VycmVudEhhbmRsZXJzLmluZGV4T2YoZXZlbnRIYW5kbGVyKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGN1cnJlbnRIYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICAgKi9cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnROYW1lKSB7XG4gICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9wdWxsLzI3NjMjZGlzY3Vzc2lvbl9yMTc0OTIzOTIyMlxuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBnbG9iYWxTdGF0ZS5ldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICogQHBhcmFtIHtFdmVudEhhbmRsZXJ9IGV2ZW50SGFuZGxlclxuICAgKi9cbiAgY29uc3Qgb24gPSAoZXZlbnROYW1lLCBldmVudEhhbmRsZXIpID0+IHtcbiAgICBnbG9iYWxTdGF0ZS5ldmVudEVtaXR0ZXIub24oZXZlbnROYW1lLCBldmVudEhhbmRsZXIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAqIEBwYXJhbSB7RXZlbnRIYW5kbGVyfSBldmVudEhhbmRsZXJcbiAgICovXG4gIGNvbnN0IG9uY2UgPSAoZXZlbnROYW1lLCBldmVudEhhbmRsZXIpID0+IHtcbiAgICBnbG9iYWxTdGF0ZS5ldmVudEVtaXR0ZXIub25jZShldmVudE5hbWUsIGV2ZW50SGFuZGxlcik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZXZlbnROYW1lXVxuICAgKiBAcGFyYW0ge0V2ZW50SGFuZGxlcn0gW2V2ZW50SGFuZGxlcl1cbiAgICovXG4gIGNvbnN0IG9mZiA9IChldmVudE5hbWUsIGV2ZW50SGFuZGxlcikgPT4ge1xuICAgIC8vIFJlbW92ZSBhbGwgaGFuZGxlcnMgZm9yIGFsbCBldmVudHNcbiAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgZ2xvYmFsU3RhdGUuZXZlbnRFbWl0dGVyLnJlc2V0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChldmVudEhhbmRsZXIpIHtcbiAgICAgIC8vIFJlbW92ZSBhIHNwZWNpZmljIGhhbmRsZXJcbiAgICAgIGdsb2JhbFN0YXRlLmV2ZW50RW1pdHRlci5yZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50SGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbW92ZSBhbGwgaGFuZGxlcnMgZm9yIGEgc3BlY2lmaWMgZXZlbnRcbiAgICAgIGdsb2JhbFN0YXRlLmV2ZW50RW1pdHRlci5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnROYW1lKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHN0YXRpY01ldGhvZHMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIGFyZ3NUb1BhcmFtczogYXJnc1RvUGFyYW1zLFxuICAgIGJpbmRDbGlja0hhbmRsZXI6IGJpbmRDbGlja0hhbmRsZXIsXG4gICAgY2xpY2tDYW5jZWw6IGNsaWNrQ2FuY2VsLFxuICAgIGNsaWNrQ29uZmlybTogY2xpY2tDb25maXJtLFxuICAgIGNsaWNrRGVueTogY2xpY2tEZW55LFxuICAgIGVuYWJsZUxvYWRpbmc6IHNob3dMb2FkaW5nLFxuICAgIGZpcmU6IGZpcmUsXG4gICAgZ2V0QWN0aW9uczogZ2V0QWN0aW9ucyxcbiAgICBnZXRDYW5jZWxCdXR0b246IGdldENhbmNlbEJ1dHRvbixcbiAgICBnZXRDbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24sXG4gICAgZ2V0Q29uZmlybUJ1dHRvbjogZ2V0Q29uZmlybUJ1dHRvbixcbiAgICBnZXRDb250YWluZXI6IGdldENvbnRhaW5lcixcbiAgICBnZXREZW55QnV0dG9uOiBnZXREZW55QnV0dG9uLFxuICAgIGdldEZvY3VzYWJsZUVsZW1lbnRzOiBnZXRGb2N1c2FibGVFbGVtZW50cyxcbiAgICBnZXRGb290ZXI6IGdldEZvb3RlcixcbiAgICBnZXRIdG1sQ29udGFpbmVyOiBnZXRIdG1sQ29udGFpbmVyLFxuICAgIGdldEljb246IGdldEljb24sXG4gICAgZ2V0SWNvbkNvbnRlbnQ6IGdldEljb25Db250ZW50LFxuICAgIGdldEltYWdlOiBnZXRJbWFnZSxcbiAgICBnZXRJbnB1dExhYmVsOiBnZXRJbnB1dExhYmVsLFxuICAgIGdldExvYWRlcjogZ2V0TG9hZGVyLFxuICAgIGdldFBvcHVwOiBnZXRQb3B1cCxcbiAgICBnZXRQcm9ncmVzc1N0ZXBzOiBnZXRQcm9ncmVzc1N0ZXBzLFxuICAgIGdldFRpbWVyTGVmdDogZ2V0VGltZXJMZWZ0LFxuICAgIGdldFRpbWVyUHJvZ3Jlc3NCYXI6IGdldFRpbWVyUHJvZ3Jlc3NCYXIsXG4gICAgZ2V0VGl0bGU6IGdldFRpdGxlLFxuICAgIGdldFZhbGlkYXRpb25NZXNzYWdlOiBnZXRWYWxpZGF0aW9uTWVzc2FnZSxcbiAgICBpbmNyZWFzZVRpbWVyOiBpbmNyZWFzZVRpbWVyLFxuICAgIGlzRGVwcmVjYXRlZFBhcmFtZXRlcjogaXNEZXByZWNhdGVkUGFyYW1ldGVyLFxuICAgIGlzTG9hZGluZzogaXNMb2FkaW5nLFxuICAgIGlzVGltZXJSdW5uaW5nOiBpc1RpbWVyUnVubmluZyxcbiAgICBpc1VwZGF0YWJsZVBhcmFtZXRlcjogaXNVcGRhdGFibGVQYXJhbWV0ZXIsXG4gICAgaXNWYWxpZFBhcmFtZXRlcjogaXNWYWxpZFBhcmFtZXRlcixcbiAgICBpc1Zpc2libGU6IGlzVmlzaWJsZSxcbiAgICBtaXhpbjogbWl4aW4sXG4gICAgb2ZmOiBvZmYsXG4gICAgb246IG9uLFxuICAgIG9uY2U6IG9uY2UsXG4gICAgcmVzdW1lVGltZXI6IHJlc3VtZVRpbWVyLFxuICAgIHNob3dMb2FkaW5nOiBzaG93TG9hZGluZyxcbiAgICBzdG9wVGltZXI6IHN0b3BUaW1lcixcbiAgICB0b2dnbGVUaW1lcjogdG9nZ2xlVGltZXJcbiAgfSk7XG5cbiAgY2xhc3MgVGltZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7KCkgPT4gdm9pZH0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgZGVsYXkpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgIHRoaXMucmVtYWluaW5nID0gZGVsYXk7XG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXJ0KCkge1xuICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5pZCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5yZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RvcCgpIHtcbiAgICAgIGlmICh0aGlzLnN0YXJ0ZWQgJiYgdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5pZCk7XG4gICAgICAgIHRoaXMucmVtYWluaW5nIC09IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydGVkLmdldFRpbWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgaW5jcmVhc2Uobikge1xuICAgICAgY29uc3QgcnVubmluZyA9IHRoaXMucnVubmluZztcbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZW1haW5pbmcgKz0gbjtcbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldFRpbWVyTGVmdCgpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1J1bm5pbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5uaW5nO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN3YWxTdHJpbmdQYXJhbXMgPSBbJ3N3YWwtdGl0bGUnLCAnc3dhbC1odG1sJywgJ3N3YWwtZm9vdGVyJ107XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7U3dlZXRBbGVydE9wdGlvbnN9XG4gICAqL1xuICBjb25zdCBnZXRUZW1wbGF0ZVBhcmFtcyA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0eXBlb2YgcGFyYW1zLnRlbXBsYXRlID09PSAnc3RyaW5nJyA/ICgvKiogQHR5cGUge0hUTUxUZW1wbGF0ZUVsZW1lbnR9ICovZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMudGVtcGxhdGUpKSA6IHBhcmFtcy50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIC8qKiBAdHlwZSB7RG9jdW1lbnRGcmFnbWVudH0gKi9cbiAgICBjb25zdCB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZS5jb250ZW50O1xuICAgIHNob3dXYXJuaW5nc0ZvckVsZW1lbnRzKHRlbXBsYXRlQ29udGVudCk7XG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbihnZXRTd2FsUGFyYW1zKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxGdW5jdGlvblBhcmFtcyh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsQnV0dG9ucyh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSW1hZ2UodGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbEljb24odGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbElucHV0KHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxTdHJpbmdQYXJhbXModGVtcGxhdGVDb250ZW50LCBzd2FsU3RyaW5nUGFyYW1zKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIHN0cmluZyB8IGJvb2xlYW4gfCBudW1iZXI+fVxuICAgKi9cbiAgY29uc3QgZ2V0U3dhbFBhcmFtcyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBib29sZWFuIHwgbnVtYmVyPn0gKi9cbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG4gICAgY29uc3Qgc3dhbFBhcmFtcyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtcGFyYW0nKSk7XG4gICAgc3dhbFBhcmFtcy5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMocGFyYW0sIFsnbmFtZScsICd2YWx1ZSddKTtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IC8qKiBAdHlwZSB7a2V5b2YgU3dlZXRBbGVydE9wdGlvbnN9ICovcGFyYW0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgIGlmICghcGFyYW1OYW1lIHx8ICF2YWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGRlZmF1bHRQYXJhbXNbcGFyYW1OYW1lXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gdmFsdWUgIT09ICdmYWxzZSc7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZhdWx0UGFyYW1zW3BhcmFtTmFtZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEByZXR1cm5zIHtSZWNvcmQ8c3RyaW5nLCAoKSA9PiB2b2lkPn1cbiAgICovXG4gIGNvbnN0IGdldFN3YWxGdW5jdGlvblBhcmFtcyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCAoKSA9PiB2b2lkPn0gKi9cbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG4gICAgY29uc3Qgc3dhbEZ1bmN0aW9ucyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtZnVuY3Rpb24tcGFyYW0nKSk7XG4gICAgc3dhbEZ1bmN0aW9ucy5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IC8qKiBAdHlwZSB7a2V5b2YgU3dlZXRBbGVydE9wdGlvbnN9ICovcGFyYW0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgIGlmICghcGFyYW1OYW1lIHx8ICF2YWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IG5ldyBGdW5jdGlvbihgcmV0dXJuICR7dmFsdWV9YCkoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgc3RyaW5nIHwgYm9vbGVhbj59XG4gICAqL1xuICBjb25zdCBnZXRTd2FsQnV0dG9ucyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBib29sZWFuPn0gKi9cbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG4gICAgY29uc3Qgc3dhbEJ1dHRvbnMgPSBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzd2FsLWJ1dHRvbicpKTtcbiAgICBzd2FsQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGJ1dHRvbiwgWyd0eXBlJywgJ2NvbG9yJywgJ2FyaWEtbGFiZWwnXSk7XG4gICAgICBjb25zdCB0eXBlID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgaWYgKCF0eXBlIHx8ICFbJ2NvbmZpcm0nLCAnY2FuY2VsJywgJ2RlbnknXS5pbmNsdWRlcyh0eXBlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXN1bHRbYCR7dHlwZX1CdXR0b25UZXh0YF0gPSBidXR0b24uaW5uZXJIVE1MO1xuICAgICAgcmVzdWx0W2BzaG93JHtjYXBpdGFsaXplRmlyc3RMZXR0ZXIodHlwZSl9QnV0dG9uYF0gPSB0cnVlO1xuICAgICAgaWYgKGJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2NvbG9yJykpIHtcbiAgICAgICAgcmVzdWx0W2Ake3R5cGV9QnV0dG9uQ29sb3JgXSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2NvbG9yJyk7XG4gICAgICB9XG4gICAgICBpZiAoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpKSB7XG4gICAgICAgIHJlc3VsdFtgJHt0eXBlfUJ1dHRvbkFyaWFMYWJlbGBdID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEByZXR1cm5zIHtQaWNrPFN3ZWV0QWxlcnRPcHRpb25zLCAnaW1hZ2VVcmwnIHwgJ2ltYWdlV2lkdGgnIHwgJ2ltYWdlSGVpZ2h0JyB8ICdpbWFnZUFsdCc+fVxuICAgKi9cbiAgY29uc3QgZ2V0U3dhbEltYWdlID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH0gKi9cbiAgICBjb25zdCBpbWFnZSA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWltYWdlJyk7XG4gICAgaWYgKGltYWdlKSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGltYWdlLCBbJ3NyYycsICd3aWR0aCcsICdoZWlnaHQnLCAnYWx0J10pO1xuICAgICAgaWYgKGltYWdlLmhhc0F0dHJpYnV0ZSgnc3JjJykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlVXJsID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKSB8fCB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCd3aWR0aCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZVdpZHRoID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCd3aWR0aCcpIHx8IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZUhlaWdodCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykgfHwgdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgaWYgKGltYWdlLmhhc0F0dHJpYnV0ZSgnYWx0JykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlQWx0ID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdhbHQnKSB8fCB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAqL1xuICBjb25zdCBnZXRTd2FsSWNvbiA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudCB8IG51bGx9ICovXG4gICAgY29uc3QgaWNvbiA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWljb24nKTtcbiAgICBpZiAoaWNvbikge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhpY29uLCBbJ3R5cGUnLCAnY29sb3InXSk7XG4gICAgICBpZiAoaWNvbi5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSkge1xuICAgICAgICByZXN1bHQuaWNvbiA9IGljb24uZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICB9XG4gICAgICBpZiAoaWNvbi5oYXNBdHRyaWJ1dGUoJ2NvbG9yJykpIHtcbiAgICAgICAgcmVzdWx0Lmljb25Db2xvciA9IGljb24uZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xuICAgICAgfVxuICAgICAgcmVzdWx0Lmljb25IdG1sID0gaWNvbi5pbm5lckhUTUw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAqL1xuICBjb25zdCBnZXRTd2FsSW5wdXQgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIC8qKiBAdHlwZSB7b2JqZWN0fSAqL1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnQgfCBudWxsfSAqL1xuICAgIGNvbnN0IGlucHV0ID0gdGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N3YWwtaW5wdXQnKTtcbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaW5wdXQsIFsndHlwZScsICdsYWJlbCcsICdwbGFjZWhvbGRlcicsICd2YWx1ZSddKTtcbiAgICAgIHJlc3VsdC5pbnB1dCA9IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpIHx8ICd0ZXh0JztcbiAgICAgIGlmIChpbnB1dC5oYXNBdHRyaWJ1dGUoJ2xhYmVsJykpIHtcbiAgICAgICAgcmVzdWx0LmlucHV0TGFiZWwgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2xhYmVsJyk7XG4gICAgICB9XG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dFBsYWNlaG9sZGVyID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgICAgfVxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRWYWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuICAgIGNvbnN0IGlucHV0T3B0aW9ucyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtaW5wdXQtb3B0aW9uJykpO1xuICAgIGlmIChpbnB1dE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQuaW5wdXRPcHRpb25zID0ge307XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKG9wdGlvbiwgWyd2YWx1ZSddKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICBpZiAoIW9wdGlvblZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9wdGlvbk5hbWUgPSBvcHRpb24uaW5uZXJIVE1MO1xuICAgICAgICByZXN1bHQuaW5wdXRPcHRpb25zW29wdGlvblZhbHVlXSA9IG9wdGlvbk5hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1OYW1lc1xuICAgKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgc3RyaW5nPn1cbiAgICovXG4gIGNvbnN0IGdldFN3YWxTdHJpbmdQYXJhbXMgPSAodGVtcGxhdGVDb250ZW50LCBwYXJhbU5hbWVzKSA9PiB7XG4gICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSAqL1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbU5hbWVzKSB7XG4gICAgICBjb25zdCBwYXJhbU5hbWUgPSBwYXJhbU5hbWVzW2ldO1xuICAgICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudCB8IG51bGx9ICovXG4gICAgICBjb25zdCB0YWcgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvcihwYXJhbU5hbWUpO1xuICAgICAgaWYgKHRhZykge1xuICAgICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKHRhZywgW10pO1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lLnJlcGxhY2UoL15zd2FsLS8sICcnKV0gPSB0YWcuaW5uZXJIVE1MLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvckVsZW1lbnRzID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCBhbGxvd2VkRWxlbWVudHMgPSBzd2FsU3RyaW5nUGFyYW1zLmNvbmNhdChbJ3N3YWwtcGFyYW0nLCAnc3dhbC1mdW5jdGlvbi1wYXJhbScsICdzd2FsLWJ1dHRvbicsICdzd2FsLWltYWdlJywgJ3N3YWwtaWNvbicsICdzd2FsLWlucHV0JywgJ3N3YWwtaW5wdXQtb3B0aW9uJ10pO1xuICAgIEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LmNoaWxkcmVuKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGNvbnN0IHRhZ05hbWUgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIWFsbG93ZWRFbGVtZW50cy5pbmNsdWRlcyh0YWdOYW1lKSkge1xuICAgICAgICB3YXJuKGBVbnJlY29nbml6ZWQgZWxlbWVudCA8JHt0YWdOYW1lfT5gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gYWxsb3dlZEF0dHJpYnV0ZXNcbiAgICovXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMgPSAoZWwsIGFsbG93ZWRBdHRyaWJ1dGVzKSA9PiB7XG4gICAgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XG4gICAgICBpZiAoYWxsb3dlZEF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUubmFtZSkgPT09IC0xKSB7XG4gICAgICAgIHdhcm4oW2BVbnJlY29nbml6ZWQgYXR0cmlidXRlIFwiJHthdHRyaWJ1dGUubmFtZX1cIiBvbiA8JHtlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9Pi5gLCBgJHthbGxvd2VkQXR0cmlidXRlcy5sZW5ndGggPyBgQWxsb3dlZCBhdHRyaWJ1dGVzIGFyZTogJHthbGxvd2VkQXR0cmlidXRlcy5qb2luKCcsICcpfWAgOiAnVG8gc2V0IHRoZSB2YWx1ZSwgdXNlIEhUTUwgd2l0aGluIHRoZSBlbGVtZW50Lid9YF0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IFNIT1dfQ0xBU1NfVElNRU9VVCA9IDEwO1xuXG4gIC8qKlxuICAgKiBPcGVuIHBvcHVwLCBhZGQgbmVjZXNzYXJ5IGNsYXNzZXMgYW5kIHN0eWxlcywgZml4IHNjcm9sbGJhclxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IG9wZW5Qb3B1cCA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLndpbGxPcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwYXJhbXMud2lsbE9wZW4ocG9wdXApO1xuICAgIH1cbiAgICBnbG9iYWxTdGF0ZS5ldmVudEVtaXR0ZXIuZW1pdCgnd2lsbE9wZW4nLCBwb3B1cCk7XG4gICAgY29uc3QgYm9keVN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICAgIGNvbnN0IGluaXRpYWxCb2R5T3ZlcmZsb3cgPSBib2R5U3R5bGVzLm92ZXJmbG93WTtcbiAgICBhZGRDbGFzc2VzKGNvbnRhaW5lciwgcG9wdXAsIHBhcmFtcyk7XG5cbiAgICAvLyBzY3JvbGxpbmcgaXMgJ2hpZGRlbicgdW50aWwgYW5pbWF0aW9uIGlzIGRvbmUsIGFmdGVyIHRoYXQgJ2F1dG8nXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxpbmdWaXNpYmlsaXR5KGNvbnRhaW5lciwgcG9wdXApO1xuICAgIH0sIFNIT1dfQ0xBU1NfVElNRU9VVCk7XG4gICAgaWYgKGlzTW9kYWwoKSkge1xuICAgICAgZml4U2Nyb2xsQ29udGFpbmVyKGNvbnRhaW5lciwgcGFyYW1zLnNjcm9sbGJhclBhZGRpbmcsIGluaXRpYWxCb2R5T3ZlcmZsb3cpO1xuICAgICAgc2V0QXJpYUhpZGRlbigpO1xuICAgIH1cbiAgICBpZiAoIWlzVG9hc3QoKSAmJiAhZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5kaWRPcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHBhcmFtcy5kaWRPcGVuKHBvcHVwKSk7XG4gICAgfVxuICAgIGdsb2JhbFN0YXRlLmV2ZW50RW1pdHRlci5lbWl0KCdkaWRPcGVuJywgcG9wdXApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0FuaW1hdGlvbkV2ZW50fSBldmVudFxuICAgKi9cbiAgY29uc3Qgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gcG9wdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcG9wdXAucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgcG9wdXAucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHN3YWxPcGVuQW5pbWF0aW9uRmluaXNoZWQpO1xuICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG5cbiAgICAvLyBuby10cmFuc2l0aW9uIGlzIGFkZGVkIGluIGluaXQoKSBpbiBjYXNlIG9uZSBzd2FsIGlzIG9wZW5lZCByaWdodCBhZnRlciBhbm90aGVyXG4gICAgcmVtb3ZlQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1snbm8tdHJhbnNpdGlvbiddKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqL1xuICBjb25zdCBzZXRTY3JvbGxpbmdWaXNpYmlsaXR5ID0gKGNvbnRhaW5lciwgcG9wdXApID0+IHtcbiAgICBpZiAoaGFzQ3NzQW5pbWF0aW9uKHBvcHVwKSkge1xuICAgICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdoaWRkZW4nO1xuICAgICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgICBwb3B1cC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBzY3JvbGxiYXJQYWRkaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQm9keU92ZXJmbG93XG4gICAqL1xuICBjb25zdCBmaXhTY3JvbGxDb250YWluZXIgPSAoY29udGFpbmVyLCBzY3JvbGxiYXJQYWRkaW5nLCBpbml0aWFsQm9keU92ZXJmbG93KSA9PiB7XG4gICAgaU9TZml4KCk7XG4gICAgaWYgKHNjcm9sbGJhclBhZGRpbmcgJiYgaW5pdGlhbEJvZHlPdmVyZmxvdyAhPT0gJ2hpZGRlbicpIHtcbiAgICAgIHJlcGxhY2VTY3JvbGxiYXJXaXRoUGFkZGluZyhpbml0aWFsQm9keU92ZXJmbG93KTtcbiAgICB9XG5cbiAgICAvLyBzd2VldGFsZXJ0Mi9pc3N1ZXMvMTI0N1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnNjcm9sbFRvcCA9IDA7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IGFkZENsYXNzZXMgPSAoY29udGFpbmVyLCBwb3B1cCwgcGFyYW1zKSA9PiB7XG4gICAgYWRkQ2xhc3MoY29udGFpbmVyLCBwYXJhbXMuc2hvd0NsYXNzLmJhY2tkcm9wKTtcbiAgICBpZiAocGFyYW1zLmFuaW1hdGlvbikge1xuICAgICAgLy8gdGhpcyB3b3JrYXJvdW5kIHdpdGggb3BhY2l0eSBpcyBuZWVkZWQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjA1OVxuICAgICAgcG9wdXAuc3R5bGUuc2V0UHJvcGVydHkoJ29wYWNpdHknLCAnMCcsICdpbXBvcnRhbnQnKTtcbiAgICAgIHNob3cocG9wdXAsICdncmlkJyk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gQW5pbWF0ZSBwb3B1cCByaWdodCBhZnRlciBzaG93aW5nIGl0XG4gICAgICAgIGFkZENsYXNzKHBvcHVwLCBwYXJhbXMuc2hvd0NsYXNzLnBvcHVwKTtcbiAgICAgICAgLy8gYW5kIHJlbW92ZSB0aGUgb3BhY2l0eSB3b3JrYXJvdW5kXG4gICAgICAgIHBvcHVwLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdvcGFjaXR5Jyk7XG4gICAgICB9LCBTSE9XX0NMQVNTX1RJTUVPVVQpOyAvLyAxMG1zIGluIG9yZGVyIHRvIGZpeCAjMjA2MlxuICAgIH0gZWxzZSB7XG4gICAgICBzaG93KHBvcHVwLCAnZ3JpZCcpO1xuICAgIH1cbiAgICBhZGRDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgc3dhbENsYXNzZXMuc2hvd24pO1xuICAgIGlmIChwYXJhbXMuaGVpZ2h0QXV0byAmJiBwYXJhbXMuYmFja2Ryb3AgJiYgIXBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWydoZWlnaHQtYXV0byddKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGRlZmF1bHRJbnB1dFZhbGlkYXRvcnMgPSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsaWRhdGlvbk1lc3NhZ2VdXG4gICAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nIHwgdm9pZD59XG4gICAgICovXG4gICAgZW1haWw6IChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICByZXR1cm4gL15bYS16QS1aMC05LitfJy1dK0BbYS16QS1aMC05Li1dK1xcLlthLXpBLVowLTktXSskLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSB8fCAnSW52YWxpZCBlbWFpbCBhZGRyZXNzJyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt2YWxpZGF0aW9uTWVzc2FnZV1cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmcgfCB2b2lkPn1cbiAgICAgKi9cbiAgICB1cmw6IChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICAvLyB0YWtlbiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODA5NDM1IHdpdGggYSBzbWFsbCBjaGFuZ2UgZnJvbSAjMTMwNiBhbmQgIzIwMTNcbiAgICAgIHJldHVybiAvXmh0dHBzPzpcXC9cXC8od3d3XFwuKT9bLWEtekEtWjAtOUA6JS5fK34jPV17MSwyNTZ9XFwuW2Etel17Miw2M31cXGIoWy1hLXpBLVowLTlAOiVfKy5+Iz8mLz1dKikkLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSB8fCAnSW52YWxpZCBVUkwnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gc2V0RGVmYXVsdElucHV0VmFsaWRhdG9ycyhwYXJhbXMpIHtcbiAgICAvLyBVc2UgZGVmYXVsdCBgaW5wdXRWYWxpZGF0b3JgIGZvciBzdXBwb3J0ZWQgaW5wdXQgdHlwZXMgaWYgbm90IHByb3ZpZGVkXG4gICAgaWYgKHBhcmFtcy5pbnB1dFZhbGlkYXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmlucHV0ID09PSAnZW1haWwnKSB7XG4gICAgICBwYXJhbXMuaW5wdXRWYWxpZGF0b3IgPSBkZWZhdWx0SW5wdXRWYWxpZGF0b3JzWydlbWFpbCddO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLmlucHV0ID09PSAndXJsJykge1xuICAgICAgcGFyYW1zLmlucHV0VmFsaWRhdG9yID0gZGVmYXVsdElucHV0VmFsaWRhdG9yc1sndXJsJ107XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gdmFsaWRhdGVDdXN0b21UYXJnZXRFbGVtZW50KHBhcmFtcykge1xuICAgIC8vIERldGVybWluZSBpZiB0aGUgY3VzdG9tIHRhcmdldCBlbGVtZW50IGlzIHZhbGlkXG4gICAgaWYgKCFwYXJhbXMudGFyZ2V0IHx8IHR5cGVvZiBwYXJhbXMudGFyZ2V0ID09PSAnc3RyaW5nJyAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMudGFyZ2V0KSB8fCB0eXBlb2YgcGFyYW1zLnRhcmdldCAhPT0gJ3N0cmluZycgJiYgIXBhcmFtcy50YXJnZXQuYXBwZW5kQ2hpbGQpIHtcbiAgICAgIHdhcm4oJ1RhcmdldCBwYXJhbWV0ZXIgaXMgbm90IHZhbGlkLCBkZWZhdWx0aW5nIHRvIFwiYm9keVwiJyk7XG4gICAgICBwYXJhbXMudGFyZ2V0ID0gJ2JvZHknO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdHlwZSwgdGV4dCBhbmQgYWN0aW9ucyBvbiBwb3B1cFxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGZ1bmN0aW9uIHNldFBhcmFtZXRlcnMocGFyYW1zKSB7XG4gICAgc2V0RGVmYXVsdElucHV0VmFsaWRhdG9ycyhwYXJhbXMpO1xuXG4gICAgLy8gc2hvd0xvYWRlck9uQ29uZmlybSAmJiBwcmVDb25maXJtXG4gICAgaWYgKHBhcmFtcy5zaG93TG9hZGVyT25Db25maXJtICYmICFwYXJhbXMucHJlQ29uZmlybSkge1xuICAgICAgd2Fybignc2hvd0xvYWRlck9uQ29uZmlybSBpcyBzZXQgdG8gdHJ1ZSwgYnV0IHByZUNvbmZpcm0gaXMgbm90IGRlZmluZWQuXFxuJyArICdzaG93TG9hZGVyT25Db25maXJtIHNob3VsZCBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggcHJlQ29uZmlybSwgc2VlIHVzYWdlIGV4YW1wbGU6XFxuJyArICdodHRwczovL3N3ZWV0YWxlcnQyLmdpdGh1Yi5pby8jYWpheC1yZXF1ZXN0Jyk7XG4gICAgfVxuICAgIHZhbGlkYXRlQ3VzdG9tVGFyZ2V0RWxlbWVudChwYXJhbXMpO1xuXG4gICAgLy8gUmVwbGFjZSBuZXdsaW5lcyB3aXRoIDxicj4gaW4gdGl0bGVcbiAgICBpZiAodHlwZW9mIHBhcmFtcy50aXRsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhcmFtcy50aXRsZSA9IHBhcmFtcy50aXRsZS5zcGxpdCgnXFxuJykuam9pbignPGJyIC8+Jyk7XG4gICAgfVxuICAgIGluaXQocGFyYW1zKTtcbiAgfVxuXG4gIC8qKiBAdHlwZSB7U3dlZXRBbGVydH0gKi9cbiAgbGV0IGN1cnJlbnRJbnN0YW5jZTtcbiAgdmFyIF9wcm9taXNlID0gLyojX19QVVJFX18qL25ldyBXZWFrTWFwKCk7XG4gIGNsYXNzIFN3ZWV0QWxlcnQge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Li4uKFN3ZWV0QWxlcnRPcHRpb25zIHwgc3RyaW5nKX0gYXJnc1xuICAgICAqIEB0aGlzIHtTd2VldEFsZXJ0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgIC8qKlxuICAgICAgICogQHR5cGUge1Byb21pc2U8U3dlZXRBbGVydFJlc3VsdD59XG4gICAgICAgKi9cbiAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZEluaXRTcGVjKHRoaXMsIF9wcm9taXNlLCB2b2lkIDApO1xuICAgICAgLy8gUHJldmVudCBydW4gaW4gTm9kZSBlbnZcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjdXJyZW50SW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBvdXRlclBhcmFtcyA9IE9iamVjdC5mcmVlemUodGhpcy5jb25zdHJ1Y3Rvci5hcmdzVG9QYXJhbXMoYXJncykpO1xuXG4gICAgICAvKiogQHR5cGUge1JlYWRvbmx5PFN3ZWV0QWxlcnRPcHRpb25zPn0gKi9cbiAgICAgIHRoaXMucGFyYW1zID0gb3V0ZXJQYXJhbXM7XG5cbiAgICAgIC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbiAgICAgIHRoaXMuaXNBd2FpdGluZ1Byb21pc2UgPSBmYWxzZTtcbiAgICAgIF9jbGFzc1ByaXZhdGVGaWVsZFNldDIoX3Byb21pc2UsIHRoaXMsIHRoaXMuX21haW4oY3VycmVudEluc3RhbmNlLnBhcmFtcykpO1xuICAgIH1cbiAgICBfbWFpbih1c2VyUGFyYW1zLCBtaXhpblBhcmFtcyA9IHt9KSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JQYXJhbXMoT2JqZWN0LmFzc2lnbih7fSwgbWl4aW5QYXJhbXMsIHVzZXJQYXJhbXMpKTtcbiAgICAgIGlmIChnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UpIHtcbiAgICAgICAgY29uc3Qgc3dhbFByb21pc2VSZXNvbHZlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZXNvbHZlLmdldChnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UpO1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgaXNBd2FpdGluZ1Byb21pc2VcbiAgICAgICAgfSA9IGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZTtcbiAgICAgICAgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgICAgIGlmICghaXNBd2FpdGluZ1Byb21pc2UpIHtcbiAgICAgICAgICBzd2FsUHJvbWlzZVJlc29sdmUoe1xuICAgICAgICAgICAgaXNEaXNtaXNzZWQ6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICAgICAgdW5zZXRBcmlhSGlkZGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZSA9IGN1cnJlbnRJbnN0YW5jZTtcbiAgICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJlcGFyZVBhcmFtcyh1c2VyUGFyYW1zLCBtaXhpblBhcmFtcyk7XG4gICAgICBzZXRQYXJhbWV0ZXJzKGlubmVyUGFyYW1zKTtcbiAgICAgIE9iamVjdC5mcmVlemUoaW5uZXJQYXJhbXMpO1xuXG4gICAgICAvLyBjbGVhciB0aGUgcHJldmlvdXMgdGltZXJcbiAgICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICAgIGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RvcCgpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICAgIH1cblxuICAgICAgLy8gY2xlYXIgdGhlIHJlc3RvcmUgZm9jdXMgdGltZW91dFxuICAgICAgY2xlYXJUaW1lb3V0KGdsb2JhbFN0YXRlLnJlc3RvcmVGb2N1c1RpbWVvdXQpO1xuICAgICAgY29uc3QgZG9tQ2FjaGUgPSBwb3B1bGF0ZURvbUNhY2hlKGN1cnJlbnRJbnN0YW5jZSk7XG4gICAgICByZW5kZXIoY3VycmVudEluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG4gICAgICBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuc2V0KGN1cnJlbnRJbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgICAgcmV0dXJuIHN3YWxQcm9taXNlKGN1cnJlbnRJbnN0YW5jZSwgZG9tQ2FjaGUsIGlubmVyUGFyYW1zKTtcbiAgICB9XG5cbiAgICAvLyBgY2F0Y2hgIGNhbm5vdCBiZSB0aGUgbmFtZSBvZiBhIG1vZHVsZSBleHBvcnQsIHNvIHdlIGRlZmluZSBvdXIgdGhlbmFibGUgbWV0aG9kcyBoZXJlIGluc3RlYWRcbiAgICB0aGVuKG9uRnVsZmlsbGVkKSB7XG4gICAgICByZXR1cm4gX2NsYXNzUHJpdmF0ZUZpZWxkR2V0MihfcHJvbWlzZSwgdGhpcykudGhlbihvbkZ1bGZpbGxlZCk7XG4gICAgfVxuICAgIGZpbmFsbHkob25GaW5hbGx5KSB7XG4gICAgICByZXR1cm4gX2NsYXNzUHJpdmF0ZUZpZWxkR2V0MihfcHJvbWlzZSwgdGhpcykuZmluYWxseShvbkZpbmFsbHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnR9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7RG9tQ2FjaGV9IGRvbUNhY2hlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgY29uc3Qgc3dhbFByb21pc2UgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBmdW5jdGlvbnMgdG8gaGFuZGxlIGFsbCBjbG9zaW5ncy9kaXNtaXNzYWxzXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RGlzbWlzc1JlYXNvbn0gZGlzbWlzc1xuICAgICAgICovXG4gICAgICBjb25zdCBkaXNtaXNzV2l0aCA9IGRpc21pc3MgPT4ge1xuICAgICAgICBpbnN0YW5jZS5jbG9zZSh7XG4gICAgICAgICAgaXNEaXNtaXNzZWQ6IHRydWUsXG4gICAgICAgICAgZGlzbWlzcyxcbiAgICAgICAgICBpc0NvbmZpcm1lZDogZmFsc2UsXG4gICAgICAgICAgaXNEZW5pZWQ6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVzb2x2ZS5zZXQoaW5zdGFuY2UsIHJlc29sdmUpO1xuICAgICAgcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZWplY3Quc2V0KGluc3RhbmNlLCByZWplY3QpO1xuICAgICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICBoYW5kbGVDb25maXJtQnV0dG9uQ2xpY2soaW5zdGFuY2UpO1xuICAgICAgfTtcbiAgICAgIGRvbUNhY2hlLmRlbnlCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaGFuZGxlRGVueUJ1dHRvbkNsaWNrKGluc3RhbmNlKTtcbiAgICAgIH07XG4gICAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaGFuZGxlQ2FuY2VsQnV0dG9uQ2xpY2soaW5zdGFuY2UsIGRpc21pc3NXaXRoKTtcbiAgICAgIH07XG4gICAgICBkb21DYWNoZS5jbG9zZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNsb3NlKTtcbiAgICAgIH07XG4gICAgICBoYW5kbGVQb3B1cENsaWNrKGlubmVyUGFyYW1zLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgICAgYWRkS2V5ZG93bkhhbmRsZXIoZ2xvYmFsU3RhdGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCk7XG4gICAgICBoYW5kbGVJbnB1dE9wdGlvbnNBbmRWYWx1ZShpbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgICAgb3BlblBvcHVwKGlubmVyUGFyYW1zKTtcbiAgICAgIHNldHVwVGltZXIoZ2xvYmFsU3RhdGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCk7XG4gICAgICBpbml0Rm9jdXMoZG9tQ2FjaGUsIGlubmVyUGFyYW1zKTtcblxuICAgICAgLy8gU2Nyb2xsIGNvbnRhaW5lciB0byB0b3Agb24gb3BlbiAoIzEyNDcsICMxOTQ2KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5zY3JvbGxUb3AgPSAwO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHVzZXJQYXJhbXNcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gbWl4aW5QYXJhbXNcbiAgICogQHJldHVybnMge1N3ZWV0QWxlcnRPcHRpb25zfVxuICAgKi9cbiAgY29uc3QgcHJlcGFyZVBhcmFtcyA9ICh1c2VyUGFyYW1zLCBtaXhpblBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHRlbXBsYXRlUGFyYW1zID0gZ2V0VGVtcGxhdGVQYXJhbXModXNlclBhcmFtcyk7XG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcywgbWl4aW5QYXJhbXMsIHRlbXBsYXRlUGFyYW1zLCB1c2VyUGFyYW1zKTsgLy8gcHJlY2VkZW5jZSBpcyBkZXNjcmliZWQgaW4gIzIxMzFcbiAgICBwYXJhbXMuc2hvd0NsYXNzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcy5zaG93Q2xhc3MsIHBhcmFtcy5zaG93Q2xhc3MpO1xuICAgIHBhcmFtcy5oaWRlQ2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyYW1zLmhpZGVDbGFzcywgcGFyYW1zLmhpZGVDbGFzcyk7XG4gICAgaWYgKHBhcmFtcy5hbmltYXRpb24gPT09IGZhbHNlKSB7XG4gICAgICBwYXJhbXMuc2hvd0NsYXNzID0ge1xuICAgICAgICBiYWNrZHJvcDogJ3N3YWwyLW5vYW5pbWF0aW9uJ1xuICAgICAgfTtcbiAgICAgIHBhcmFtcy5oaWRlQ2xhc3MgPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0fSBpbnN0YW5jZVxuICAgKiBAcmV0dXJucyB7RG9tQ2FjaGV9XG4gICAqL1xuICBjb25zdCBwb3B1bGF0ZURvbUNhY2hlID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IGRvbUNhY2hlID0ge1xuICAgICAgcG9wdXA6IGdldFBvcHVwKCksXG4gICAgICBjb250YWluZXI6IGdldENvbnRhaW5lcigpLFxuICAgICAgYWN0aW9uczogZ2V0QWN0aW9ucygpLFxuICAgICAgY29uZmlybUJ1dHRvbjogZ2V0Q29uZmlybUJ1dHRvbigpLFxuICAgICAgZGVueUJ1dHRvbjogZ2V0RGVueUJ1dHRvbigpLFxuICAgICAgY2FuY2VsQnV0dG9uOiBnZXRDYW5jZWxCdXR0b24oKSxcbiAgICAgIGxvYWRlcjogZ2V0TG9hZGVyKCksXG4gICAgICBjbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24oKSxcbiAgICAgIHZhbGlkYXRpb25NZXNzYWdlOiBnZXRWYWxpZGF0aW9uTWVzc2FnZSgpLFxuICAgICAgcHJvZ3Jlc3NTdGVwczogZ2V0UHJvZ3Jlc3NTdGVwcygpXG4gICAgfTtcbiAgICBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuc2V0KGluc3RhbmNlLCBkb21DYWNoZSk7XG4gICAgcmV0dXJuIGRvbUNhY2hlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0dsb2JhbFN0YXRlfSBnbG9iYWxTdGF0ZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0geyhkaXNtaXNzOiBEaXNtaXNzUmVhc29uKSA9PiB2b2lkfSBkaXNtaXNzV2l0aFxuICAgKi9cbiAgY29uc3Qgc2V0dXBUaW1lciA9IChnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhciA9IGdldFRpbWVyUHJvZ3Jlc3NCYXIoKTtcbiAgICBoaWRlKHRpbWVyUHJvZ3Jlc3NCYXIpO1xuICAgIGlmIChpbm5lclBhcmFtcy50aW1lcikge1xuICAgICAgZ2xvYmFsU3RhdGUudGltZW91dCA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgIGRpc21pc3NXaXRoKCd0aW1lcicpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICAgIH0sIGlubmVyUGFyYW1zLnRpbWVyKTtcbiAgICAgIGlmIChpbm5lclBhcmFtcy50aW1lclByb2dyZXNzQmFyKSB7XG4gICAgICAgIHNob3codGltZXJQcm9ncmVzc0Jhcik7XG4gICAgICAgIGFwcGx5Q3VzdG9tQ2xhc3ModGltZXJQcm9ncmVzc0JhciwgaW5uZXJQYXJhbXMsICd0aW1lclByb2dyZXNzQmFyJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0ICYmIGdsb2JhbFN0YXRlLnRpbWVvdXQucnVubmluZykge1xuICAgICAgICAgICAgLy8gdGltZXIgY2FuIGJlIGFscmVhZHkgc3RvcHBlZCBvciB1bnNldCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0Jhcihpbm5lclBhcmFtcy50aW1lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZm9jdXMgaW4gdGhlIHBvcHVwOlxuICAgKlxuICAgKiAxLiBJZiBgdG9hc3RgIGlzIGB0cnVlYCwgZG9uJ3Qgc3RlYWwgZm9jdXMgZnJvbSB0aGUgZG9jdW1lbnQuXG4gICAqIDIuIEVsc2UgaWYgdGhlcmUgaXMgYW4gW2F1dG9mb2N1c10gZWxlbWVudCwgZm9jdXMgaXQuXG4gICAqIDMuIEVsc2UgaWYgYGZvY3VzQ29uZmlybWAgaXMgYHRydWVgIGFuZCBjb25maXJtIGJ1dHRvbiBpcyB2aXNpYmxlLCBmb2N1cyBpdC5cbiAgICogNC4gRWxzZSBpZiBgZm9jdXNEZW55YCBpcyBgdHJ1ZWAgYW5kIGRlbnkgYnV0dG9uIGlzIHZpc2libGUsIGZvY3VzIGl0LlxuICAgKiA1LiBFbHNlIGlmIGBmb2N1c0NhbmNlbGAgaXMgYHRydWVgIGFuZCBjYW5jZWwgYnV0dG9uIGlzIHZpc2libGUsIGZvY3VzIGl0LlxuICAgKiA2LiBFbHNlIGZvY3VzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBpbiBhIHBvcHVwIChpZiBhbnkpLlxuICAgKlxuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cbiAgY29uc3QgaW5pdEZvY3VzID0gKGRvbUNhY2hlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGlmIChpbm5lclBhcmFtcy50b2FzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBUT0RPOiB0aGlzIGlzIGR1bWIsIHJlbW92ZSBgYWxsb3dFbnRlcktleWAgcGFyYW0gaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvblxuICAgIGlmICghY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dFbnRlcktleSkpIHtcbiAgICAgIHdhcm5BYm91dERlcHJlY2F0aW9uKCdhbGxvd0VudGVyS2V5Jyk7XG4gICAgICBibHVyQWN0aXZlRWxlbWVudCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZm9jdXNBdXRvZm9jdXMoZG9tQ2FjaGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmb2N1c0J1dHRvbihkb21DYWNoZSwgaW5uZXJQYXJhbXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNldEZvY3VzKC0xLCAxKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBmb2N1c0F1dG9mb2N1cyA9IGRvbUNhY2hlID0+IHtcbiAgICBjb25zdCBhdXRvZm9jdXNFbGVtZW50cyA9IEFycmF5LmZyb20oZG9tQ2FjaGUucG9wdXAucXVlcnlTZWxlY3RvckFsbCgnW2F1dG9mb2N1c10nKSk7XG4gICAgZm9yIChjb25zdCBhdXRvZm9jdXNFbGVtZW50IG9mIGF1dG9mb2N1c0VsZW1lbnRzKSB7XG4gICAgICBpZiAoYXV0b2ZvY3VzRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGlzVmlzaWJsZSQxKGF1dG9mb2N1c0VsZW1lbnQpKSB7XG4gICAgICAgIGF1dG9mb2N1c0VsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBmb2N1c0J1dHRvbiA9IChkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBpZiAoaW5uZXJQYXJhbXMuZm9jdXNEZW55ICYmIGlzVmlzaWJsZSQxKGRvbUNhY2hlLmRlbnlCdXR0b24pKSB7XG4gICAgICBkb21DYWNoZS5kZW55QnV0dG9uLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlubmVyUGFyYW1zLmZvY3VzQ2FuY2VsICYmIGlzVmlzaWJsZSQxKGRvbUNhY2hlLmNhbmNlbEJ1dHRvbikpIHtcbiAgICAgIGRvbUNhY2hlLmNhbmNlbEJ1dHRvbi5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpbm5lclBhcmFtcy5mb2N1c0NvbmZpcm0gJiYgaXNWaXNpYmxlJDEoZG9tQ2FjaGUuY29uZmlybUJ1dHRvbikpIHtcbiAgICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24uZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IGJsdXJBY3RpdmVFbGVtZW50ID0gKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdHlwZW9mIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEFzc2lnbiBpbnN0YW5jZSBtZXRob2RzIGZyb20gc3JjL2luc3RhbmNlTWV0aG9kcy8qLmpzIHRvIHByb3RvdHlwZVxuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5kaXNhYmxlQnV0dG9ucyA9IGRpc2FibGVCdXR0b25zO1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5lbmFibGVCdXR0b25zID0gZW5hYmxlQnV0dG9ucztcbiAgU3dlZXRBbGVydC5wcm90b3R5cGUuZ2V0SW5wdXQgPSBnZXRJbnB1dDtcbiAgU3dlZXRBbGVydC5wcm90b3R5cGUuZGlzYWJsZUlucHV0ID0gZGlzYWJsZUlucHV0O1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5lbmFibGVJbnB1dCA9IGVuYWJsZUlucHV0O1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5oaWRlTG9hZGluZyA9IGhpZGVMb2FkaW5nO1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5kaXNhYmxlTG9hZGluZyA9IGhpZGVMb2FkaW5nO1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5zaG93VmFsaWRhdGlvbk1lc3NhZ2UgPSBzaG93VmFsaWRhdGlvbk1lc3NhZ2U7XG4gIFN3ZWV0QWxlcnQucHJvdG90eXBlLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5jbG9zZSA9IGNsb3NlO1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5jbG9zZVBvcHVwID0gY2xvc2U7XG4gIFN3ZWV0QWxlcnQucHJvdG90eXBlLmNsb3NlTW9kYWwgPSBjbG9zZTtcbiAgU3dlZXRBbGVydC5wcm90b3R5cGUuY2xvc2VUb2FzdCA9IGNsb3NlO1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5yZWplY3RQcm9taXNlID0gcmVqZWN0UHJvbWlzZTtcbiAgU3dlZXRBbGVydC5wcm90b3R5cGUudXBkYXRlID0gdXBkYXRlO1xuICBTd2VldEFsZXJ0LnByb3RvdHlwZS5fZGVzdHJveSA9IF9kZXN0cm95O1xuXG4gIC8vIEFzc2lnbiBzdGF0aWMgbWV0aG9kcyBmcm9tIHNyYy9zdGF0aWNNZXRob2RzLyouanMgdG8gY29uc3RydWN0b3JcbiAgT2JqZWN0LmFzc2lnbihTd2VldEFsZXJ0LCBzdGF0aWNNZXRob2RzKTtcblxuICAvLyBQcm94eSB0byBpbnN0YW5jZSBtZXRob2RzIHRvIGNvbnN0cnVjdG9yLCBmb3Igbm93LCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgT2JqZWN0LmtleXMoaW5zdGFuY2VNZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsuLi4oU3dlZXRBbGVydE9wdGlvbnMgfCBzdHJpbmcgfCB1bmRlZmluZWQpfSBhcmdzXG4gICAgICogQHJldHVybnMge1N3ZWV0QWxlcnRSZXN1bHQgfCBQcm9taXNlPFN3ZWV0QWxlcnRSZXN1bHQ+IHwgdW5kZWZpbmVkfVxuICAgICAqL1xuICAgIFN3ZWV0QWxlcnRba2V5XSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICBpZiAoY3VycmVudEluc3RhbmNlICYmIGN1cnJlbnRJbnN0YW5jZVtrZXldKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50SW5zdGFuY2Vba2V5XSguLi5hcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gIH0pO1xuICBTd2VldEFsZXJ0LkRpc21pc3NSZWFzb24gPSBEaXNtaXNzUmVhc29uO1xuICBTd2VldEFsZXJ0LnZlcnNpb24gPSAnMTEuMjYuMyc7XG5cbiAgY29uc3QgU3dhbCA9IFN3ZWV0QWxlcnQ7XG4gIC8vIEB0cy1pZ25vcmVcbiAgU3dhbC5kZWZhdWx0ID0gU3dhbDtcblxuICByZXR1cm4gU3dhbDtcblxufSkpO1xuaWYgKHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLlN3ZWV0YWxlcnQyKXt0aGlzLnN3YWwgPSB0aGlzLnN3ZWV0QWxlcnQgPSB0aGlzLlN3YWwgPSB0aGlzLlN3ZWV0QWxlcnQgPSB0aGlzLlN3ZWV0YWxlcnQyfVxuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50JiZmdW5jdGlvbihlLHQpe3ZhciBuPWUuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO2lmKGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKG4pLG4uc3R5bGVTaGVldCluLnN0eWxlU2hlZXQuZGlzYWJsZWR8fChuLnN0eWxlU2hlZXQuY3NzVGV4dD10KTtlbHNlIHRyeXtuLmlubmVySFRNTD10fWNhdGNoKGUpe24uaW5uZXJUZXh0PXR9fShkb2N1bWVudCxcIjpyb290ey0tc3dhbDItb3V0bGluZTogMCAwIDAgM3B4IHJnYmEoMTAwLCAxNTAsIDIwMCwgMC41KTstLXN3YWwyLWNvbnRhaW5lci1wYWRkaW5nOiAwLjYyNWVtOy0tc3dhbDItYmFja2Ryb3A6IHJnYmEoMCwgMCwgMCwgMC40KTstLXN3YWwyLWJhY2tkcm9wLXRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7LS1zd2FsMi13aWR0aDogMzJlbTstLXN3YWwyLXBhZGRpbmc6IDAgMCAxLjI1ZW07LS1zd2FsMi1ib3JkZXI6IG5vbmU7LS1zd2FsMi1ib3JkZXItcmFkaXVzOiAwLjMxMjVyZW07LS1zd2FsMi1iYWNrZ3JvdW5kOiB3aGl0ZTstLXN3YWwyLWNvbG9yOiAjNTQ1NDU0Oy0tc3dhbDItc2hvdy1hbmltYXRpb246IHN3YWwyLXNob3cgMC4zczstLXN3YWwyLWhpZGUtYW5pbWF0aW9uOiBzd2FsMi1oaWRlIDAuMTVzIGZvcndhcmRzOy0tc3dhbDItaWNvbi16b29tOiAxOy0tc3dhbDItaWNvbi1hbmltYXRpb25zOiB0cnVlOy0tc3dhbDItdGl0bGUtcGFkZGluZzogMC44ZW0gMWVtIDA7LS1zd2FsMi1odG1sLWNvbnRhaW5lci1wYWRkaW5nOiAxZW0gMS42ZW0gMC4zZW07LS1zd2FsMi1pbnB1dC1ib3JkZXI6IDFweCBzb2xpZCAjZDlkOWQ5Oy0tc3dhbDItaW5wdXQtYm9yZGVyLXJhZGl1czogMC4xODc1ZW07LS1zd2FsMi1pbnB1dC1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLCAwLCAwLCAwLjA2KSwgMCAwIDAgM3B4IHRyYW5zcGFyZW50Oy0tc3dhbDItaW5wdXQtYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7LS1zd2FsMi1pbnB1dC10cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycywgYm94LXNoYWRvdyAwLjJzOy0tc3dhbDItaW5wdXQtaG92ZXItYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMXB4IHJnYmEoMCwgMCwgMCwgMC4wNiksIDAgMCAwIDNweCB0cmFuc3BhcmVudDstLXN3YWwyLWlucHV0LWZvY3VzLWJvcmRlcjogMXB4IHNvbGlkICNiNGRiZWQ7LS1zd2FsMi1pbnB1dC1mb2N1cy1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAxcHggcmdiYSgwLCAwLCAwLCAwLjA2KSwgMCAwIDAgM3B4IHJnYmEoMTAwLCAxNTAsIDIwMCwgMC41KTstLXN3YWwyLXByb2dyZXNzLXN0ZXAtYmFja2dyb3VuZDogI2FkZDhlNjstLXN3YWwyLXZhbGlkYXRpb24tbWVzc2FnZS1iYWNrZ3JvdW5kOiAjZjBmMGYwOy0tc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdlLWNvbG9yOiAjNjY2Oy0tc3dhbDItZm9vdGVyLWJvcmRlci1jb2xvcjogI2VlZTstLXN3YWwyLWZvb3Rlci1iYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDstLXN3YWwyLWZvb3Rlci1jb2xvcjogaW5oZXJpdDstLXN3YWwyLXRpbWVyLXByb2dyZXNzLWJhci1iYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMyk7LS1zd2FsMi1jbG9zZS1idXR0b24tcG9zaXRpb246IGluaXRpYWw7LS1zd2FsMi1jbG9zZS1idXR0b24taW5zZXQ6IGF1dG87LS1zd2FsMi1jbG9zZS1idXR0b24tZm9udC1zaXplOiAyLjVlbTstLXN3YWwyLWNsb3NlLWJ1dHRvbi1jb2xvcjogI2NjYzstLXN3YWwyLWNsb3NlLWJ1dHRvbi10cmFuc2l0aW9uOiBjb2xvciAwLjJzLCBib3gtc2hhZG93IDAuMnM7LS1zd2FsMi1jbG9zZS1idXR0b24tb3V0bGluZTogaW5pdGlhbDstLXN3YWwyLWNsb3NlLWJ1dHRvbi1ib3gtc2hhZG93OiBpbnNldCAwIDAgMCAzcHggdHJhbnNwYXJlbnQ7LS1zd2FsMi1jbG9zZS1idXR0b24tZm9jdXMtYm94LXNoYWRvdzogaW5zZXQgdmFyKC0tc3dhbDItb3V0bGluZSk7LS1zd2FsMi1jbG9zZS1idXR0b24taG92ZXItdHJhbnNmb3JtOiBub25lOy0tc3dhbDItYWN0aW9ucy1qdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjstLXN3YWwyLWFjdGlvbnMtd2lkdGg6IGF1dG87LS1zd2FsMi1hY3Rpb25zLW1hcmdpbjogMS4yNWVtIGF1dG8gMDstLXN3YWwyLWFjdGlvbnMtcGFkZGluZzogMDstLXN3YWwyLWFjdGlvbnMtYm9yZGVyLXJhZGl1czogMDstLXN3YWwyLWFjdGlvbnMtYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7LS1zd2FsMi1hY3Rpb24tYnV0dG9uLXRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycywgYm94LXNoYWRvdyAwLjJzOy0tc3dhbDItYWN0aW9uLWJ1dHRvbi1ob3ZlcjogYmxhY2sgMTAlOy0tc3dhbDItYWN0aW9uLWJ1dHRvbi1hY3RpdmU6IGJsYWNrIDEwJTstLXN3YWwyLWNvbmZpcm0tYnV0dG9uLWJveC1zaGFkb3c6IG5vbmU7LS1zd2FsMi1jb25maXJtLWJ1dHRvbi1ib3JkZXItcmFkaXVzOiAwLjI1ZW07LS1zd2FsMi1jb25maXJtLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yOiAjNzA2NmUwOy0tc3dhbDItY29uZmlybS1idXR0b24tY29sb3I6ICNmZmY7LS1zd2FsMi1kZW55LWJ1dHRvbi1ib3gtc2hhZG93OiBub25lOy0tc3dhbDItZGVueS1idXR0b24tYm9yZGVyLXJhZGl1czogMC4yNWVtOy0tc3dhbDItZGVueS1idXR0b24tYmFja2dyb3VuZC1jb2xvcjogI2RjMzc0MTstLXN3YWwyLWRlbnktYnV0dG9uLWNvbG9yOiAjZmZmOy0tc3dhbDItY2FuY2VsLWJ1dHRvbi1ib3gtc2hhZG93OiBub25lOy0tc3dhbDItY2FuY2VsLWJ1dHRvbi1ib3JkZXItcmFkaXVzOiAwLjI1ZW07LS1zd2FsMi1jYW5jZWwtYnV0dG9uLWJhY2tncm91bmQtY29sb3I6ICM2ZTc4ODE7LS1zd2FsMi1jYW5jZWwtYnV0dG9uLWNvbG9yOiAjZmZmOy0tc3dhbDItdG9hc3Qtc2hvdy1hbmltYXRpb246IHN3YWwyLXRvYXN0LXNob3cgMC41czstLXN3YWwyLXRvYXN0LWhpZGUtYW5pbWF0aW9uOiBzd2FsMi10b2FzdC1oaWRlIDAuMXMgZm9yd2FyZHM7LS1zd2FsMi10b2FzdC1ib3JkZXI6IG5vbmU7LS1zd2FsMi10b2FzdC1ib3gtc2hhZG93OiAwIDAgMXB4IGhzbCgwZGVnIDAlIDAlIC8gMC4wNzUpLCAwIDFweCAycHggaHNsKDBkZWcgMCUgMCUgLyAwLjA3NSksIDFweCAycHggNHB4IGhzbCgwZGVnIDAlIDAlIC8gMC4wNzUpLCAxcHggM3B4IDhweCBoc2woMGRlZyAwJSAwJSAvIDAuMDc1KSwgMnB4IDRweCAxNnB4IGhzbCgwZGVnIDAlIDAlIC8gMC4wNzUpfVtkYXRhLXN3YWwyLXRoZW1lPWRhcmtdey0tc3dhbDItZGFyay10aGVtZS1ibGFjazogIzE5MTkxYTstLXN3YWwyLWRhcmstdGhlbWUtd2hpdGU6ICNlMWUxZTE7LS1zd2FsMi1iYWNrZ3JvdW5kOiB2YXIoLS1zd2FsMi1kYXJrLXRoZW1lLWJsYWNrKTstLXN3YWwyLWNvbG9yOiB2YXIoLS1zd2FsMi1kYXJrLXRoZW1lLXdoaXRlKTstLXN3YWwyLWZvb3Rlci1ib3JkZXItY29sb3I6ICM1NTU7LS1zd2FsMi1pbnB1dC1iYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tc3dhbDItZGFyay10aGVtZS1ibGFjayksIHZhcigtLXN3YWwyLWRhcmstdGhlbWUtd2hpdGUpIDEwJSk7LS1zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2UtYmFja2dyb3VuZDogY29sb3ItbWl4KCBpbiBzcmdiLCB2YXIoLS1zd2FsMi1kYXJrLXRoZW1lLWJsYWNrKSwgdmFyKC0tc3dhbDItZGFyay10aGVtZS13aGl0ZSkgMTAlICk7LS1zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2UtY29sb3I6IHZhcigtLXN3YWwyLWRhcmstdGhlbWUtd2hpdGUpOy0tc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFyLWJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KX1AbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspe1tkYXRhLXN3YWwyLXRoZW1lPWF1dG9dey0tc3dhbDItZGFyay10aGVtZS1ibGFjazogIzE5MTkxYTstLXN3YWwyLWRhcmstdGhlbWUtd2hpdGU6ICNlMWUxZTE7LS1zd2FsMi1iYWNrZ3JvdW5kOiB2YXIoLS1zd2FsMi1kYXJrLXRoZW1lLWJsYWNrKTstLXN3YWwyLWNvbG9yOiB2YXIoLS1zd2FsMi1kYXJrLXRoZW1lLXdoaXRlKTstLXN3YWwyLWZvb3Rlci1ib3JkZXItY29sb3I6ICM1NTU7LS1zd2FsMi1pbnB1dC1iYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tc3dhbDItZGFyay10aGVtZS1ibGFjayksIHZhcigtLXN3YWwyLWRhcmstdGhlbWUtd2hpdGUpIDEwJSk7LS1zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2UtYmFja2dyb3VuZDogY29sb3ItbWl4KCBpbiBzcmdiLCB2YXIoLS1zd2FsMi1kYXJrLXRoZW1lLWJsYWNrKSwgdmFyKC0tc3dhbDItZGFyay10aGVtZS13aGl0ZSkgMTAlICk7LS1zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2UtY29sb3I6IHZhcigtLXN3YWwyLWRhcmstdGhlbWUtd2hpdGUpOy0tc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFyLWJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KX19Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wLC5zd2FsMi10b2FzdC1zaG93bil7b3ZlcmZsb3c6aGlkZGVufWJvZHkuc3dhbDItaGVpZ2h0LWF1dG97aGVpZ2h0OmF1dG8gIWltcG9ydGFudH1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1jb250YWluZXJ7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLDApICFpbXBvcnRhbnQ7cG9pbnRlci1ldmVudHM6bm9uZX1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1jb250YWluZXIgLnN3YWwyLXBvcHVwe3BvaW50ZXItZXZlbnRzOmFsbH1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1jb250YWluZXIgLnN3YWwyLW1vZGFse2JveC1zaGFkb3c6MCAwIDEwcHggdmFyKC0tc3dhbDItYmFja2Ryb3ApfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lcntib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6MzYwcHg7bWF4LXdpZHRoOjEwMCU7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLDApO3BvaW50ZXItZXZlbnRzOm5vbmV9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcHtpbnNldDowIGF1dG8gYXV0byA1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1yaWdodHtpbnNldDowIDAgYXV0byBhdXRvfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3Atc3RhcnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1sZWZ0e2luc2V0OjAgYXV0byBhdXRvIDB9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1zdGFydCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWxlZnR7aW5zZXQ6NTAlIGF1dG8gYXV0byAwO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXJ7aW5zZXQ6NTAlIGF1dG8gYXV0byA1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLCAtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXJpZ2h0e2luc2V0OjUwJSAwIGF1dG8gYXV0bzt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXN0YXJ0LGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tbGVmdHtpbnNldDphdXRvIGF1dG8gMCAwfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b217aW5zZXQ6YXV0byBhdXRvIDAgNTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kLGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tcmlnaHR7aW5zZXQ6YXV0byAwIDAgYXV0b31AbWVkaWEgcHJpbnR7Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wLC5zd2FsMi10b2FzdC1zaG93bil7b3ZlcmZsb3cteTpzY3JvbGwgIWltcG9ydGFudH1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3AsLnN3YWwyLXRvYXN0LXNob3duKT5bYXJpYS1oaWRkZW49dHJ1ZV17ZGlzcGxheTpub25lfWJvZHkuc3dhbDItc2hvd246bm90KC5zd2FsMi1uby1iYWNrZHJvcCwuc3dhbDItdG9hc3Qtc2hvd24pIC5zd2FsMi1jb250YWluZXJ7cG9zaXRpb246c3RhdGljICFpbXBvcnRhbnR9fWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKXtkaXNwbGF5OmdyaWQ7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDoxMDYwO2luc2V0OjA7Ym94LXNpemluZzpib3JkZXItYm94O2dyaWQtdGVtcGxhdGUtYXJlYXM6XFxcInRvcC1zdGFydCAgICAgdG9wICAgICAgICAgICAgdG9wLWVuZFxcXCIgXFxcImNlbnRlci1zdGFydCAgY2VudGVyICAgICAgICAgY2VudGVyLWVuZFxcXCIgXFxcImJvdHRvbS1zdGFydCAgYm90dG9tLWNlbnRlciAgYm90dG9tLWVuZFxcXCI7Z3JpZC10ZW1wbGF0ZS1yb3dzOm1pbm1heChtaW4tY29udGVudCwgYXV0bykgbWlubWF4KG1pbi1jb250ZW50LCBhdXRvKSBtaW5tYXgobWluLWNvbnRlbnQsIGF1dG8pO2hlaWdodDoxMDAlO3BhZGRpbmc6dmFyKC0tc3dhbDItY29udGFpbmVyLXBhZGRpbmcpO292ZXJmbG93LXg6aGlkZGVuO3RyYW5zaXRpb246dmFyKC0tc3dhbDItYmFja2Ryb3AtdHJhbnNpdGlvbik7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6dG91Y2h9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLWJhY2tkcm9wLXNob3csZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLW5vYW5pbWF0aW9ue2JhY2tncm91bmQ6dmFyKC0tc3dhbDItYmFja2Ryb3ApfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKS5zd2FsMi1iYWNrZHJvcC1oaWRle2JhY2tncm91bmQ6cmdiYSgwLDAsMCwwKSAhaW1wb3J0YW50fWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKS5zd2FsMi10b3Atc3RhcnQsZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLWNlbnRlci1zdGFydCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItYm90dG9tLXN0YXJ0e2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMCwgMWZyKSBhdXRvIGF1dG99ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLXRvcCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItY2VudGVyLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKS5zd2FsMi1ib3R0b217Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gbWlubWF4KDAsIDFmcikgYXV0b31kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItdG9wLWVuZCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItY2VudGVyLWVuZCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItYm90dG9tLWVuZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6YXV0byBhdXRvIG1pbm1heCgwLCAxZnIpfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKS5zd2FsMi10b3Atc3RhcnQ+LnN3YWwyLXBvcHVwe2FsaWduLXNlbGY6c3RhcnR9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLXRvcD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjtwbGFjZS1zZWxmOnN0YXJ0IGNlbnRlcn1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItdG9wLWVuZD4uc3dhbDItcG9wdXAsZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLXRvcC1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MztwbGFjZS1zZWxmOnN0YXJ0IGVuZH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItY2VudGVyLXN0YXJ0Pi5zd2FsMi1wb3B1cCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItY2VudGVyLWxlZnQ+LnN3YWwyLXBvcHVwe2dyaWQtcm93OjI7YWxpZ24tc2VsZjpjZW50ZXJ9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLWNlbnRlcj4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjtncmlkLXJvdzoyO3BsYWNlLXNlbGY6Y2VudGVyIGNlbnRlcn1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItY2VudGVyLWVuZD4uc3dhbDItcG9wdXAsZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLWNlbnRlci1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MztncmlkLXJvdzoyO3BsYWNlLXNlbGY6Y2VudGVyIGVuZH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItYm90dG9tLXN0YXJ0Pi5zd2FsMi1wb3B1cCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItYm90dG9tLWxlZnQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MzthbGlnbi1zZWxmOmVuZH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItYm90dG9tPi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoyO2dyaWQtcm93OjM7cGxhY2Utc2VsZjplbmQgY2VudGVyfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKS5zd2FsMi1ib3R0b20tZW5kPi5zd2FsMi1wb3B1cCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItYm90dG9tLXJpZ2h0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjozO2dyaWQtcm93OjM7cGxhY2Utc2VsZjplbmQgZW5kfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKS5zd2FsMi1ncm93LXJvdz4uc3dhbDItcG9wdXAsZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLWdyb3ctZnVsbHNjcmVlbj4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MS80O3dpZHRoOjEwMCV9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpLnN3YWwyLWdyb3ctY29sdW1uPi5zd2FsMi1wb3B1cCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikuc3dhbDItZ3Jvdy1mdWxsc2NyZWVuPi5zd2FsMi1wb3B1cHtncmlkLXJvdzoxLzQ7YWxpZ24tc2VsZjpzdHJldGNofWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKS5zd2FsMi1uby10cmFuc2l0aW9ue3RyYW5zaXRpb246bm9uZSAhaW1wb3J0YW50fWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKVtwb3BvdmVyXXt3aWR0aDphdXRvO2JvcmRlcjowfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBkaXY6d2hlcmUoLnN3YWwyLXBvcHVwKXtkaXNwbGF5Om5vbmU7cG9zaXRpb246cmVsYXRpdmU7Ym94LXNpemluZzpib3JkZXItYm94O2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMCwgMTAwJSk7d2lkdGg6dmFyKC0tc3dhbDItd2lkdGgpO21heC13aWR0aDoxMDAlO3BhZGRpbmc6dmFyKC0tc3dhbDItcGFkZGluZyk7Ym9yZGVyOnZhcigtLXN3YWwyLWJvcmRlcik7Ym9yZGVyLXJhZGl1czp2YXIoLS1zd2FsMi1ib3JkZXItcmFkaXVzKTtiYWNrZ3JvdW5kOnZhcigtLXN3YWwyLWJhY2tncm91bmQpO2NvbG9yOnZhcigtLXN3YWwyLWNvbG9yKTtmb250LWZhbWlseTppbmhlcml0O2ZvbnQtc2l6ZToxcmVtO2NvbnRhaW5lci1uYW1lOnN3YWwyLXBvcHVwfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBkaXY6d2hlcmUoLnN3YWwyLXBvcHVwKTpmb2N1c3tvdXRsaW5lOm5vbmV9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGRpdjp3aGVyZSguc3dhbDItcG9wdXApLnN3YWwyLWxvYWRpbmd7b3ZlcmZsb3cteTpoaWRkZW59ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGRpdjp3aGVyZSguc3dhbDItcG9wdXApLnN3YWwyLWRyYWdnYWJsZXtjdXJzb3I6Z3JhYn1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgZGl2OndoZXJlKC5zd2FsMi1wb3B1cCkuc3dhbDItZHJhZ2dhYmxlIGRpdjp3aGVyZSguc3dhbDItaWNvbil7Y3Vyc29yOmdyYWJ9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGRpdjp3aGVyZSguc3dhbDItcG9wdXApLnN3YWwyLWRyYWdnaW5ne2N1cnNvcjpncmFiYmluZ31kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgZGl2OndoZXJlKC5zd2FsMi1wb3B1cCkuc3dhbDItZHJhZ2dpbmcgZGl2OndoZXJlKC5zd2FsMi1pY29uKXtjdXJzb3I6Z3JhYmJpbmd9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGgyOndoZXJlKC5zd2FsMi10aXRsZSl7cG9zaXRpb246cmVsYXRpdmU7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjA7cGFkZGluZzp2YXIoLS1zd2FsMi10aXRsZS1wYWRkaW5nKTtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjg3NWVtO2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LXRyYW5zZm9ybTpub25lO292ZXJmbG93LXdyYXA6YnJlYWstd29yZDtjdXJzb3I6aW5pdGlhbH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgZGl2OndoZXJlKC5zd2FsMi1hY3Rpb25zKXtkaXNwbGF5OmZsZXg7ei1pbmRleDoxO2JveC1zaXppbmc6Ym9yZGVyLWJveDtmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnZhcigtLXN3YWwyLWFjdGlvbnMtanVzdGlmeS1jb250ZW50KTt3aWR0aDp2YXIoLS1zd2FsMi1hY3Rpb25zLXdpZHRoKTttYXJnaW46dmFyKC0tc3dhbDItYWN0aW9ucy1tYXJnaW4pO3BhZGRpbmc6dmFyKC0tc3dhbDItYWN0aW9ucy1wYWRkaW5nKTtib3JkZXItcmFkaXVzOnZhcigtLXN3YWwyLWFjdGlvbnMtYm9yZGVyLXJhZGl1cyk7YmFja2dyb3VuZDp2YXIoLS1zd2FsMi1hY3Rpb25zLWJhY2tncm91bmQpfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBkaXY6d2hlcmUoLnN3YWwyLWxvYWRlcil7ZGlzcGxheTpub25lO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjIuMmVtO2hlaWdodDoyLjJlbTttYXJnaW46MCAxLjg3NWVtO2FuaW1hdGlvbjpzd2FsMi1yb3RhdGUtbG9hZGluZyAxLjVzIGxpbmVhciAwcyBpbmZpbml0ZSBub3JtYWw7Ym9yZGVyLXdpZHRoOi4yNWVtO2JvcmRlci1zdHlsZTpzb2xpZDtib3JkZXItcmFkaXVzOjEwMCU7Ym9yZGVyLWNvbG9yOiMyNzc4YzQgcmdiYSgwLDAsMCwwKSAjMjc3OGM0IHJnYmEoMCwwLDAsMCl9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGJ1dHRvbjp3aGVyZSguc3dhbDItc3R5bGVkKXttYXJnaW46LjMxMjVlbTtwYWRkaW5nOi42MjVlbSAxLjFlbTt0cmFuc2l0aW9uOnZhcigtLXN3YWwyLWFjdGlvbi1idXR0b24tdHJhbnNpdGlvbik7Ym9yZGVyOm5vbmU7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgwLDAsMCwwKTtmb250LXdlaWdodDo1MDB9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGJ1dHRvbjp3aGVyZSguc3dhbDItc3R5bGVkKTpub3QoW2Rpc2FibGVkXSl7Y3Vyc29yOnBvaW50ZXJ9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGJ1dHRvbjp3aGVyZSguc3dhbDItc3R5bGVkKTp3aGVyZSguc3dhbDItY29uZmlybSl7Ym9yZGVyLXJhZGl1czp2YXIoLS1zd2FsMi1jb25maXJtLWJ1dHRvbi1ib3JkZXItcmFkaXVzKTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1zd2FsMi1jb25maXJtLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yKTtib3gtc2hhZG93OnZhcigtLXN3YWwyLWNvbmZpcm0tYnV0dG9uLWJveC1zaGFkb3cpO2NvbG9yOnZhcigtLXN3YWwyLWNvbmZpcm0tYnV0dG9uLWNvbG9yKTtmb250LXNpemU6MWVtfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLXN0eWxlZCk6d2hlcmUoLnN3YWwyLWNvbmZpcm0pOmhvdmVye2JhY2tncm91bmQtY29sb3I6Y29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXN3YWwyLWNvbmZpcm0tYnV0dG9uLWJhY2tncm91bmQtY29sb3IpLCB2YXIoLS1zd2FsMi1hY3Rpb24tYnV0dG9uLWhvdmVyKSl9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGJ1dHRvbjp3aGVyZSguc3dhbDItc3R5bGVkKTp3aGVyZSguc3dhbDItY29uZmlybSk6YWN0aXZle2JhY2tncm91bmQtY29sb3I6Y29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXN3YWwyLWNvbmZpcm0tYnV0dG9uLWJhY2tncm91bmQtY29sb3IpLCB2YXIoLS1zd2FsMi1hY3Rpb24tYnV0dG9uLWFjdGl2ZSkpfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLXN0eWxlZCk6d2hlcmUoLnN3YWwyLWRlbnkpe2JvcmRlci1yYWRpdXM6dmFyKC0tc3dhbDItZGVueS1idXR0b24tYm9yZGVyLXJhZGl1cyk7YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6dmFyKC0tc3dhbDItZGVueS1idXR0b24tYmFja2dyb3VuZC1jb2xvcik7Ym94LXNoYWRvdzp2YXIoLS1zd2FsMi1kZW55LWJ1dHRvbi1ib3gtc2hhZG93KTtjb2xvcjp2YXIoLS1zd2FsMi1kZW55LWJ1dHRvbi1jb2xvcik7Zm9udC1zaXplOjFlbX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgYnV0dG9uOndoZXJlKC5zd2FsMi1zdHlsZWQpOndoZXJlKC5zd2FsMi1kZW55KTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOmNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zd2FsMi1kZW55LWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yKSwgdmFyKC0tc3dhbDItYWN0aW9uLWJ1dHRvbi1ob3ZlcikpfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLXN0eWxlZCk6d2hlcmUoLnN3YWwyLWRlbnkpOmFjdGl2ZXtiYWNrZ3JvdW5kLWNvbG9yOmNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zd2FsMi1kZW55LWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yKSwgdmFyKC0tc3dhbDItYWN0aW9uLWJ1dHRvbi1hY3RpdmUpKX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgYnV0dG9uOndoZXJlKC5zd2FsMi1zdHlsZWQpOndoZXJlKC5zd2FsMi1jYW5jZWwpe2JvcmRlci1yYWRpdXM6dmFyKC0tc3dhbDItY2FuY2VsLWJ1dHRvbi1ib3JkZXItcmFkaXVzKTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1zd2FsMi1jYW5jZWwtYnV0dG9uLWJhY2tncm91bmQtY29sb3IpO2JveC1zaGFkb3c6dmFyKC0tc3dhbDItY2FuY2VsLWJ1dHRvbi1ib3gtc2hhZG93KTtjb2xvcjp2YXIoLS1zd2FsMi1jYW5jZWwtYnV0dG9uLWNvbG9yKTtmb250LXNpemU6MWVtfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLXN0eWxlZCk6d2hlcmUoLnN3YWwyLWNhbmNlbCk6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjpjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tc3dhbDItY2FuY2VsLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yKSwgdmFyKC0tc3dhbDItYWN0aW9uLWJ1dHRvbi1ob3ZlcikpfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLXN0eWxlZCk6d2hlcmUoLnN3YWwyLWNhbmNlbCk6YWN0aXZle2JhY2tncm91bmQtY29sb3I6Y29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXN3YWwyLWNhbmNlbC1idXR0b24tYmFja2dyb3VuZC1jb2xvciksIHZhcigtLXN3YWwyLWFjdGlvbi1idXR0b24tYWN0aXZlKSl9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGJ1dHRvbjp3aGVyZSguc3dhbDItc3R5bGVkKTpmb2N1cy12aXNpYmxle291dGxpbmU6bm9uZTtib3gtc2hhZG93OnZhcigtLXN3YWwyLWFjdGlvbi1idXR0b24tZm9jdXMtYm94LXNoYWRvdyl9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGJ1dHRvbjp3aGVyZSguc3dhbDItc3R5bGVkKVtkaXNhYmxlZF06bm90KC5zd2FsMi1sb2FkaW5nKXtvcGFjaXR5Oi40fWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLXN0eWxlZCk6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjB9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGRpdjp3aGVyZSguc3dhbDItZm9vdGVyKXttYXJnaW46MWVtIDAgMDtwYWRkaW5nOjFlbSAxZW0gMDtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS1zd2FsMi1mb290ZXItYm9yZGVyLWNvbG9yKTtiYWNrZ3JvdW5kOnZhcigtLXN3YWwyLWZvb3Rlci1iYWNrZ3JvdW5kKTtjb2xvcjp2YXIoLS1zd2FsMi1mb290ZXItY29sb3IpO2ZvbnQtc2l6ZToxZW07dGV4dC1hbGlnbjpjZW50ZXI7Y3Vyc29yOmluaXRpYWx9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIC5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVye3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2dyaWQtY29sdW1uOmF1dG8gIWltcG9ydGFudDtvdmVyZmxvdzpoaWRkZW47Ym9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6dmFyKC0tc3dhbDItYm9yZGVyLXJhZGl1cyk7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czp2YXIoLS1zd2FsMi1ib3JkZXItcmFkaXVzKX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgZGl2OndoZXJlKC5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXIpe3dpZHRoOjEwMCU7aGVpZ2h0Oi4yNWVtO2JhY2tncm91bmQ6dmFyKC0tc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFyLWJhY2tncm91bmQpfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBpbWc6d2hlcmUoLnN3YWwyLWltYWdlKXttYXgtd2lkdGg6MTAwJTttYXJnaW46MmVtIGF1dG8gMWVtO2N1cnNvcjppbml0aWFsfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLWNsb3NlKXtwb3NpdGlvbjp2YXIoLS1zd2FsMi1jbG9zZS1idXR0b24tcG9zaXRpb24pO2luc2V0OnZhcigtLXN3YWwyLWNsb3NlLWJ1dHRvbi1pbnNldCk7ei1pbmRleDoyO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjEuMmVtO2hlaWdodDoxLjJlbTttYXJnaW4tdG9wOjA7bWFyZ2luLXJpZ2h0OjA7bWFyZ2luLWJvdHRvbTotMS4yZW07cGFkZGluZzowO292ZXJmbG93OmhpZGRlbjt0cmFuc2l0aW9uOnZhcigtLXN3YWwyLWNsb3NlLWJ1dHRvbi10cmFuc2l0aW9uKTtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOnZhcigtLXN3YWwyLWJvcmRlci1yYWRpdXMpO291dGxpbmU6dmFyKC0tc3dhbDItY2xvc2UtYnV0dG9uLW91dGxpbmUpO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwwKTtjb2xvcjp2YXIoLS1zd2FsMi1jbG9zZS1idXR0b24tY29sb3IpO2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6dmFyKC0tc3dhbDItY2xvc2UtYnV0dG9uLWZvbnQtc2l6ZSk7Y3Vyc29yOnBvaW50ZXI7anVzdGlmeS1zZWxmOmVuZH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgYnV0dG9uOndoZXJlKC5zd2FsMi1jbG9zZSk6aG92ZXJ7dHJhbnNmb3JtOnZhcigtLXN3YWwyLWNsb3NlLWJ1dHRvbi1ob3Zlci10cmFuc2Zvcm0pO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwwKTtjb2xvcjojZjI3NDc0fWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBidXR0b246d2hlcmUoLnN3YWwyLWNsb3NlKTpmb2N1cy12aXNpYmxle291dGxpbmU6bm9uZTtib3gtc2hhZG93OnZhcigtLXN3YWwyLWNsb3NlLWJ1dHRvbi1mb2N1cy1ib3gtc2hhZG93KX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgYnV0dG9uOndoZXJlKC5zd2FsMi1jbG9zZSk6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjB9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGRpdjp3aGVyZSguc3dhbDItaHRtbC1jb250YWluZXIpe3otaW5kZXg6MTtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjowO3BhZGRpbmc6dmFyKC0tc3dhbDItaHRtbC1jb250YWluZXItcGFkZGluZyk7b3ZlcmZsb3c6YXV0bztjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjEyNWVtO2ZvbnQtd2VpZ2h0Om5vcm1hbDtsaW5lLWhlaWdodDpub3JtYWw7dGV4dC1hbGlnbjpjZW50ZXI7b3ZlcmZsb3ctd3JhcDpicmVhay13b3JkO3dvcmQtYnJlYWs6YnJlYWstd29yZDtjdXJzb3I6aW5pdGlhbH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWlucHV0KSxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWZpbGUpLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSB0ZXh0YXJlYTp3aGVyZSguc3dhbDItdGV4dGFyZWEpLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBzZWxlY3Q6d2hlcmUoLnN3YWwyLXNlbGVjdCksZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGRpdjp3aGVyZSguc3dhbDItcmFkaW8pLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBsYWJlbDp3aGVyZSguc3dhbDItY2hlY2tib3gpe21hcmdpbjoxZW0gMmVtIDNweH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWlucHV0KSxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWZpbGUpLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSB0ZXh0YXJlYTp3aGVyZSguc3dhbDItdGV4dGFyZWEpe2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDphdXRvO3RyYW5zaXRpb246dmFyKC0tc3dhbDItaW5wdXQtdHJhbnNpdGlvbik7Ym9yZGVyOnZhcigtLXN3YWwyLWlucHV0LWJvcmRlcik7Ym9yZGVyLXJhZGl1czp2YXIoLS1zd2FsMi1pbnB1dC1ib3JkZXItcmFkaXVzKTtiYWNrZ3JvdW5kOnZhcigtLXN3YWwyLWlucHV0LWJhY2tncm91bmQpO2JveC1zaGFkb3c6dmFyKC0tc3dhbDItaW5wdXQtYm94LXNoYWRvdyk7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWlucHV0KS5zd2FsMi1pbnB1dGVycm9yLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBpbnB1dDp3aGVyZSguc3dhbDItZmlsZSkuc3dhbDItaW5wdXRlcnJvcixkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgdGV4dGFyZWE6d2hlcmUoLnN3YWwyLXRleHRhcmVhKS5zd2FsMi1pbnB1dGVycm9ye2JvcmRlci1jb2xvcjojZjI3NDc0ICFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDAgMnB4ICNmMjc0NzQgIWltcG9ydGFudH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWlucHV0KTpob3ZlcixkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWZpbGUpOmhvdmVyLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSB0ZXh0YXJlYTp3aGVyZSguc3dhbDItdGV4dGFyZWEpOmhvdmVye2JveC1zaGFkb3c6dmFyKC0tc3dhbDItaW5wdXQtaG92ZXItYm94LXNoYWRvdyl9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGlucHV0OndoZXJlKC5zd2FsMi1pbnB1dCk6Zm9jdXMsZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGlucHV0OndoZXJlKC5zd2FsMi1maWxlKTpmb2N1cyxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgdGV4dGFyZWE6d2hlcmUoLnN3YWwyLXRleHRhcmVhKTpmb2N1c3tib3JkZXI6dmFyKC0tc3dhbDItaW5wdXQtZm9jdXMtYm9yZGVyKTtvdXRsaW5lOm5vbmU7Ym94LXNoYWRvdzp2YXIoLS1zd2FsMi1pbnB1dC1mb2N1cy1ib3gtc2hhZG93KX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgaW5wdXQ6d2hlcmUoLnN3YWwyLWlucHV0KTo6cGxhY2Vob2xkZXIsZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGlucHV0OndoZXJlKC5zd2FsMi1maWxlKTo6cGxhY2Vob2xkZXIsZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIHRleHRhcmVhOndoZXJlKC5zd2FsMi10ZXh0YXJlYSk6OnBsYWNlaG9sZGVye2NvbG9yOiNjY2N9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIC5zd2FsMi1yYW5nZXttYXJnaW46MWVtIDJlbSAzcHg7YmFja2dyb3VuZDp2YXIoLS1zd2FsMi1iYWNrZ3JvdW5kKX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXJhbmdlIGlucHV0e3dpZHRoOjgwJX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXJhbmdlIG91dHB1dHt3aWR0aDoyMCU7Y29sb3I6aW5oZXJpdDtmb250LXdlaWdodDo2MDA7dGV4dC1hbGlnbjpjZW50ZXJ9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIC5zd2FsMi1yYW5nZSBpbnB1dCxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXJhbmdlIG91dHB1dHtoZWlnaHQ6Mi42MjVlbTtwYWRkaW5nOjA7Zm9udC1zaXplOjEuMTI1ZW07bGluZS1oZWlnaHQ6Mi42MjVlbX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLWlucHV0e2hlaWdodDoyLjYyNWVtO3BhZGRpbmc6MCAuNzVlbX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLWZpbGV7d2lkdGg6NzUlO21hcmdpbi1yaWdodDphdXRvO21hcmdpbi1sZWZ0OmF1dG87YmFja2dyb3VuZDp2YXIoLS1zd2FsMi1pbnB1dC1iYWNrZ3JvdW5kKTtmb250LXNpemU6MS4xMjVlbX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXRleHRhcmVhe2hlaWdodDo2Ljc1ZW07cGFkZGluZzouNzVlbX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXNlbGVjdHttaW4td2lkdGg6NTAlO21heC13aWR0aDoxMDAlO3BhZGRpbmc6LjM3NWVtIC42MjVlbTtiYWNrZ3JvdW5kOnZhcigtLXN3YWwyLWlucHV0LWJhY2tncm91bmQpO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIC5zd2FsMi1yYWRpbyxkaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLWNoZWNrYm94e2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JhY2tncm91bmQ6dmFyKC0tc3dhbDItYmFja2dyb3VuZCk7Y29sb3I6aW5oZXJpdH1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXJhZGlvIGxhYmVsLGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSAuc3dhbDItY2hlY2tib3ggbGFiZWx7bWFyZ2luOjAgLjZlbTtmb250LXNpemU6MS4xMjVlbX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXJhZGlvIGlucHV0LGRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSAuc3dhbDItY2hlY2tib3ggaW5wdXR7ZmxleC1zaHJpbms6MDttYXJnaW46MCAuNGVtfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBsYWJlbDp3aGVyZSguc3dhbDItaW5wdXQtbGFiZWwpe2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gYXV0byAwfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSBkaXY6d2hlcmUoLnN3YWwyLXZhbGlkYXRpb24tbWVzc2FnZSl7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjFlbSAwIDA7cGFkZGluZzouNjI1ZW07b3ZlcmZsb3c6aGlkZGVuO2JhY2tncm91bmQ6dmFyKC0tc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdlLWJhY2tncm91bmQpO2NvbG9yOnZhcigtLXN3YWwyLXZhbGlkYXRpb24tbWVzc2FnZS1jb2xvcik7Zm9udC1zaXplOjFlbTtmb250LXdlaWdodDozMDB9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIGRpdjp3aGVyZSguc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdlKTo6YmVmb3Jle2NvbnRlbnQ6XFxcIiFcXFwiO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjEuNWVtO21pbi13aWR0aDoxLjVlbTtoZWlnaHQ6MS41ZW07bWFyZ2luOjAgLjYyNWVtO2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQtY29sb3I6I2YyNzQ3NDtjb2xvcjojZmZmO2ZvbnQtd2VpZ2h0OjYwMDtsaW5lLWhlaWdodDoxLjVlbTt0ZXh0LWFsaWduOmNlbnRlcn1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXByb2dyZXNzLXN0ZXBze2ZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmNlbnRlcjttYXgtd2lkdGg6MTAwJTttYXJnaW46MS4yNWVtIGF1dG87cGFkZGluZzowO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwwKTtmb250LXdlaWdodDo2MDB9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIC5zd2FsMi1wcm9ncmVzcy1zdGVwcyBsaXtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjpyZWxhdGl2ZX1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwe3otaW5kZXg6MjA7ZmxleC1zaHJpbms6MDt3aWR0aDoyZW07aGVpZ2h0OjJlbTtib3JkZXItcmFkaXVzOjJlbTtiYWNrZ3JvdW5kOiMyNzc4YzQ7Y29sb3I6I2ZmZjtsaW5lLWhlaWdodDoyZW07dGV4dC1hbGlnbjpjZW50ZXJ9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIC5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcHtiYWNrZ3JvdW5kOiMyNzc4YzR9ZGl2OndoZXJlKC5zd2FsMi1jb250YWluZXIpIC5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcH4uc3dhbDItcHJvZ3Jlc3Mtc3RlcHtiYWNrZ3JvdW5kOnZhcigtLXN3YWwyLXByb2dyZXNzLXN0ZXAtYmFja2dyb3VuZCk7Y29sb3I6I2ZmZn1kaXY6d2hlcmUoLnN3YWwyLWNvbnRhaW5lcikgLnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwfi5zd2FsMi1wcm9ncmVzcy1zdGVwLWxpbmV7YmFja2dyb3VuZDp2YXIoLS1zd2FsMi1wcm9ncmVzcy1zdGVwLWJhY2tncm91bmQpfWRpdjp3aGVyZSguc3dhbDItY29udGFpbmVyKSAuc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAtbGluZXt6LWluZGV4OjEwO2ZsZXgtc2hyaW5rOjA7d2lkdGg6Mi41ZW07aGVpZ2h0Oi40ZW07bWFyZ2luOjAgLTFweDtiYWNrZ3JvdW5kOiMyNzc4YzR9ZGl2OndoZXJlKC5zd2FsMi1pY29uKXtwb3NpdGlvbjpyZWxhdGl2ZTtib3gtc2l6aW5nOmNvbnRlbnQtYm94O2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6NWVtO2hlaWdodDo1ZW07bWFyZ2luOjIuNWVtIGF1dG8gLjZlbTt6b29tOnZhcigtLXN3YWwyLWljb24tem9vbSk7Ym9yZGVyOi4yNWVtIHNvbGlkIHJnYmEoMCwwLDAsMCk7Ym9yZGVyLXJhZGl1czo1MCU7Ym9yZGVyLWNvbG9yOiMwMDA7Zm9udC1mYW1pbHk6aW5oZXJpdDtsaW5lLWhlaWdodDo1ZW07Y3Vyc29yOmRlZmF1bHQ7dXNlci1zZWxlY3Q6bm9uZX1kaXY6d2hlcmUoLnN3YWwyLWljb24pIC5zd2FsMi1pY29uLWNvbnRlbnR7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtmb250LXNpemU6My43NWVtfWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItZXJyb3J7Ym9yZGVyLWNvbG9yOiNmMjc0NzQ7Y29sb3I6I2YyNzQ3NH1kaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLWVycm9yIC5zd2FsMi14LW1hcmt7cG9zaXRpb246cmVsYXRpdmU7ZmxleC1ncm93OjF9ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXXtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDoyLjMxMjVlbTt3aWR0aDoyLjkzNzVlbTtoZWlnaHQ6LjMxMjVlbTtib3JkZXItcmFkaXVzOi4xMjVlbTtiYWNrZ3JvdW5kLWNvbG9yOiNmMjc0NzR9ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDoxLjA2MjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX1kaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1yaWdodF17cmlnaHQ6MWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX1AY29udGFpbmVyIHN3YWwyLXBvcHVwIHN0eWxlKC0tc3dhbDItaWNvbi1hbmltYXRpb25zOnRydWUpe2Rpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItZXJyb3Iuc3dhbDItaWNvbi1zaG93e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItZXJyb3Iuc3dhbDItaWNvbi1zaG93IC5zd2FsMi14LW1hcmt7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrIC41c319ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi13YXJuaW5ne2JvcmRlci1jb2xvcjojZjhiYjg2O2NvbG9yOiNmOGJiODZ9QGNvbnRhaW5lciBzd2FsMi1wb3B1cCBzdHlsZSgtLXN3YWwyLWljb24tYW5pbWF0aW9uczp0cnVlKXtkaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLXdhcm5pbmcuc3dhbDItaWNvbi1zaG93e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItd2FybmluZy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLWljb24tY29udGVudHthbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjVzfX1kaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLWluZm97Ym9yZGVyLWNvbG9yOiMzZmMzZWU7Y29sb3I6IzNmYzNlZX1AY29udGFpbmVyIHN3YWwyLXBvcHVwIHN0eWxlKC0tc3dhbDItaWNvbi1hbmltYXRpb25zOnRydWUpe2Rpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItaW5mby5zd2FsMi1pY29uLXNob3d7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi1pbmZvLnN3YWwyLWljb24tc2hvdyAuc3dhbDItaWNvbi1jb250ZW50e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWktbWFyayAuOHN9fWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItcXVlc3Rpb257Ym9yZGVyLWNvbG9yOiM4N2FkYmQ7Y29sb3I6Izg3YWRiZH1AY29udGFpbmVyIHN3YWwyLXBvcHVwIHN0eWxlKC0tc3dhbDItaWNvbi1hbmltYXRpb25zOnRydWUpe2Rpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItcXVlc3Rpb24uc3dhbDItaWNvbi1zaG93e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItcXVlc3Rpb24uc3dhbDItaWNvbi1zaG93IC5zd2FsMi1pY29uLWNvbnRlbnR7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtcXVlc3Rpb24tbWFyayAuOHN9fWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItc3VjY2Vzc3tib3JkZXItY29sb3I6I2E1ZGM4Njtjb2xvcjojYTVkYzg2fWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV17cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6My43NWVtO2hlaWdodDo3LjVlbTtib3JkZXItcmFkaXVzOjUwJX1kaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1sZWZ0XXt0b3A6LTAuNDM3NWVtO2xlZnQ6LTIuMDYzNWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjMuNzVlbSAzLjc1ZW07Ym9yZGVyLXJhZGl1czo3LjVlbSAwIDAgNy41ZW19ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9cmlnaHRde3RvcDotMC42ODc1ZW07bGVmdDoxLjg3NWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjAgMy43NWVtO2JvcmRlci1yYWRpdXM6MCA3LjVlbSA3LjVlbSAwfWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6Mjt0b3A6LTAuMjVlbTtsZWZ0Oi0wLjI1ZW07Ym94LXNpemluZzpjb250ZW50LWJveDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JvcmRlcjouMjVlbSBzb2xpZCByZ2JhKDE2NSwyMjAsMTM0LC4zKTtib3JkZXItcmFkaXVzOjUwJX1kaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtZml4e3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MTt0b3A6LjVlbTtsZWZ0OjEuNjI1ZW07d2lkdGg6LjQzNzVlbTtoZWlnaHQ6NS42MjVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXXtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MjtoZWlnaHQ6LjMxMjVlbTtib3JkZXItcmFkaXVzOi4xMjVlbTtiYWNrZ3JvdW5kLWNvbG9yOiNhNWRjODZ9ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9dGlwXXt0b3A6Mi44NzVlbTtsZWZ0Oi44MTI1ZW07d2lkdGg6MS41NjI1ZW07dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyl9ZGl2OndoZXJlKC5zd2FsMi1pY29uKS5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9bG9uZ117dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9QGNvbnRhaW5lciBzd2FsMi1wb3B1cCBzdHlsZSgtLXN3YWwyLWljb24tYW5pbWF0aW9uczp0cnVlKXtkaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwe2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1c31kaXY6d2hlcmUoLnN3YWwyLWljb24pLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3thbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzfWRpdjp3aGVyZSguc3dhbDItaWNvbikuc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZS1yaWdodHthbmltYXRpb246c3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZSA0LjI1cyBlYXNlLWlufX1bY2xhc3NePXN3YWwyXXstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6cmdiYSgwLDAsMCwwKX0uc3dhbDItc2hvd3thbmltYXRpb246dmFyKC0tc3dhbDItc2hvdy1hbmltYXRpb24pfS5zd2FsMi1oaWRle2FuaW1hdGlvbjp2YXIoLS1zd2FsMi1oaWRlLWFuaW1hdGlvbil9LnN3YWwyLW5vYW5pbWF0aW9ue3RyYW5zaXRpb246bm9uZX0uc3dhbDItc2Nyb2xsYmFyLW1lYXN1cmV7cG9zaXRpb246YWJzb2x1dGU7dG9wOi05OTk5cHg7d2lkdGg6NTBweDtoZWlnaHQ6NTBweDtvdmVyZmxvdzpzY3JvbGx9LnN3YWwyLXJ0bCAuc3dhbDItY2xvc2V7bWFyZ2luLXJpZ2h0OmluaXRpYWw7bWFyZ2luLWxlZnQ6MH0uc3dhbDItcnRsIC5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXJ7cmlnaHQ6MDtsZWZ0OmF1dG99LnN3YWwyLXRvYXN0e2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLWNvbHVtbjoxLzQgIWltcG9ydGFudDtncmlkLXJvdzoxLzQgIWltcG9ydGFudDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6bWluLWNvbnRlbnQgYXV0byBtaW4tY29udGVudDtwYWRkaW5nOjFlbTtvdmVyZmxvdy15OmhpZGRlbjtib3JkZXI6dmFyKC0tc3dhbDItdG9hc3QtYm9yZGVyKTtiYWNrZ3JvdW5kOnZhcigtLXN3YWwyLWJhY2tncm91bmQpO2JveC1zaGFkb3c6dmFyKC0tc3dhbDItdG9hc3QtYm94LXNoYWRvdyk7cG9pbnRlci1ldmVudHM6YWxsfS5zd2FsMi10b2FzdD4qe2dyaWQtY29sdW1uOjJ9LnN3YWwyLXRvYXN0IGgyOndoZXJlKC5zd2FsMi10aXRsZSl7bWFyZ2luOi41ZW0gMWVtO3BhZGRpbmc6MDtmb250LXNpemU6MWVtO3RleHQtYWxpZ246aW5pdGlhbH0uc3dhbDItdG9hc3QgLnN3YWwyLWxvYWRpbmd7anVzdGlmeS1jb250ZW50OmNlbnRlcn0uc3dhbDItdG9hc3QgaW5wdXQ6d2hlcmUoLnN3YWwyLWlucHV0KXtoZWlnaHQ6MmVtO21hcmdpbjouNWVtO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXRvYXN0IC5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2V7Zm9udC1zaXplOjFlbX0uc3dhbDItdG9hc3QgZGl2OndoZXJlKC5zd2FsMi1mb290ZXIpe21hcmdpbjouNWVtIDAgMDtwYWRkaW5nOi41ZW0gMCAwO2ZvbnQtc2l6ZTouOGVtfS5zd2FsMi10b2FzdCBidXR0b246d2hlcmUoLnN3YWwyLWNsb3NlKXtncmlkLWNvbHVtbjozLzM7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDouOGVtO2hlaWdodDouOGVtO21hcmdpbjowO2ZvbnQtc2l6ZToyZW19LnN3YWwyLXRvYXN0IGRpdjp3aGVyZSguc3dhbDItaHRtbC1jb250YWluZXIpe21hcmdpbjouNWVtIDFlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6aW5pdGlhbDtmb250LXNpemU6MWVtO3RleHQtYWxpZ246aW5pdGlhbH0uc3dhbDItdG9hc3QgZGl2OndoZXJlKC5zd2FsMi1odG1sLWNvbnRhaW5lcik6ZW1wdHl7cGFkZGluZzowfS5zd2FsMi10b2FzdCAuc3dhbDItbG9hZGVye2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDoyZW07aGVpZ2h0OjJlbTttYXJnaW46LjI1ZW19LnN3YWwyLXRvYXN0IC5zd2FsMi1pY29ue2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDoyZW07bWluLXdpZHRoOjJlbTtoZWlnaHQ6MmVtO21hcmdpbjowIC41ZW0gMCAwfS5zd2FsMi10b2FzdCAuc3dhbDItaWNvbiAuc3dhbDItaWNvbi1jb250ZW50e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC1zaXplOjEuOGVtO2ZvbnQtd2VpZ2h0OmJvbGR9LnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3t3aWR0aDoyZW07aGVpZ2h0OjJlbX0uc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV17dG9wOi44NzVlbTt3aWR0aDoxLjM3NWVtfS5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDouMzEyNWVtfS5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9cmlnaHRde3JpZ2h0Oi4zMTI1ZW19LnN3YWwyLXRvYXN0IGRpdjp3aGVyZSguc3dhbDItYWN0aW9ucyl7anVzdGlmeS1jb250ZW50OmZsZXgtc3RhcnQ7aGVpZ2h0OmF1dG87bWFyZ2luOjA7bWFyZ2luLXRvcDouNWVtO3BhZGRpbmc6MCAuNWVtfS5zd2FsMi10b2FzdCBidXR0b246d2hlcmUoLnN3YWwyLXN0eWxlZCl7bWFyZ2luOi4yNWVtIC41ZW07cGFkZGluZzouNGVtIC42ZW07Zm9udC1zaXplOjFlbX0uc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3N7Ym9yZGVyLWNvbG9yOiNhNWRjODZ9LnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXXtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxLjZlbTtoZWlnaHQ6M2VtO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPWxlZnRde3RvcDotMC44ZW07bGVmdDotMC41ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46MmVtIDJlbTtib3JkZXItcmFkaXVzOjRlbSAwIDAgNGVtfS5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPXJpZ2h0XXt0b3A6LTAuMjVlbTtsZWZ0Oi45Mzc1ZW07dHJhbnNmb3JtLW9yaWdpbjowIDEuNWVtO2JvcmRlci1yYWRpdXM6MCA0ZW0gNGVtIDB9LnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLXJpbmd7d2lkdGg6MmVtO2hlaWdodDoyZW19LnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLWZpeHt0b3A6MDtsZWZ0Oi40Mzc1ZW07d2lkdGg6LjQzNzVlbTtoZWlnaHQ6Mi42ODc1ZW19LnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXXtoZWlnaHQ6LjMxMjVlbX0uc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD10aXBde3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX0uc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD1sb25nXXt0b3A6LjkzNzVlbTtyaWdodDouMTg3NWVtO3dpZHRoOjEuMzc1ZW19QGNvbnRhaW5lciBzd2FsMi1wb3B1cCBzdHlsZSgtLXN3YWwyLWljb24tYW5pbWF0aW9uczp0cnVlKXsuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwe2FuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1c30uc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3thbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzfX0uc3dhbDItdG9hc3Quc3dhbDItc2hvd3thbmltYXRpb246dmFyKC0tc3dhbDItdG9hc3Qtc2hvdy1hbmltYXRpb24pfS5zd2FsMi10b2FzdC5zd2FsMi1oaWRle2FuaW1hdGlvbjp2YXIoLS1zd2FsMi10b2FzdC1oaWRlLWFuaW1hdGlvbil9QGtleWZyYW1lcyBzd2FsMi1zaG93ezAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLCAtNTBweCwgMCkgc2NhbGUoMC45KTtvcGFjaXR5OjB9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwgMCwgMCkgc2NhbGUoMSk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLWhpZGV7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDAsIDAsIDApIHNjYWxlKDEpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLCAtNTBweCwgMCkgc2NhbGUoMC45KTtvcGFjaXR5OjB9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDoxLjE4NzVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOjEuMDYyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDoyLjE4NzVlbTtsZWZ0Oi0wLjM3NWVtO3dpZHRoOjMuMTI1ZW19ODQle3RvcDozZW07bGVmdDoxLjMxMjVlbTt3aWR0aDoxLjA2MjVlbX0xMDAle3RvcDoyLjgxMjVlbTtsZWZ0Oi44MTI1ZW07d2lkdGg6MS41NjI1ZW19fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZ3swJXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9NjUle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH04NCV7dG9wOjIuMTg3NWVtO3JpZ2h0OjA7d2lkdGg6My40Mzc1ZW19MTAwJXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmV7MCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTUle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0xMiV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci14LW1hcmt7MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSgwLjQpO29wYWNpdHk6MH01MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSgwLjQpO29wYWNpdHk6MH04MCV7bWFyZ2luLXRvcDotMC4zNzVlbTt0cmFuc2Zvcm06c2NhbGUoMS4xNSl9MTAwJXttYXJnaW4tdG9wOjA7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLWljb257MCV7dHJhbnNmb3JtOnJvdGF0ZVgoMTAwZGVnKTtvcGFjaXR5OjB9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwZGVnKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItcm90YXRlLWxvYWRpbmd7MCV7dHJhbnNmb3JtOnJvdGF0ZSgwZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVkoLTM2MGRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlWSgwKX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWktbWFya3swJXt0cmFuc2Zvcm06cm90YXRlWig0NWRlZyk7b3BhY2l0eTowfTI1JXt0cmFuc2Zvcm06cm90YXRlWigtMjVkZWcpO29wYWNpdHk6LjR9NTAle3RyYW5zZm9ybTpyb3RhdGVaKDE1ZGVnKTtvcGFjaXR5Oi44fTc1JXt0cmFuc2Zvcm06cm90YXRlWigtNWRlZyk7b3BhY2l0eToxfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LXNob3d7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTAuNjI1ZW0pIHJvdGF0ZVooMmRlZyl9MzMle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooLTJkZWcpfTY2JXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwLjMxMjVlbSkgcm90YXRlWigyZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooMGRlZyl9fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtaGlkZXsxMDAle3RyYW5zZm9ybTpyb3RhdGVaKDFkZWcpO29wYWNpdHk6MH19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOi41NjI1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDouMTI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOi42MjVlbTtsZWZ0Oi0wLjI1ZW07d2lkdGg6MS42MjVlbX04NCV7dG9wOjEuMDYyNWVtO2xlZnQ6Ljc1ZW07d2lkdGg6LjVlbX0xMDAle3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDoxLjYyNWVtO3JpZ2h0OjEuMzc1ZW07d2lkdGg6MH02NSV7dG9wOjEuMjVlbTtyaWdodDouOTM3NWVtO3dpZHRoOjB9ODQle3RvcDouOTM3NWVtO3JpZ2h0OjA7d2lkdGg6MS4xMjVlbX0xMDAle3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX19XCIpOyIsIi8qKlxyXG4gKiBFc3RhZG8gZSBjb250cm9sZSBkYSBjb2xldGEgYXV0b23DoXRpY2EgZGUgc2FuZ3VlXHJcbiAqL1xyXG5cclxubGV0IGNvbGV0YW5kb0F1dG9tYXRpY2FtZW50ZSA9IGZhbHNlO1xyXG5sZXQgaW50ZXJ2YWxvQ29sZXRhOiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxubGV0IHByb3hpbWFDb2xldGFUaW1lc3RhbXA6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5sZXQgY2FsbGJhY2tBdHVhbGl6YWNhb1VJOiAoKHRlbXBvUmVzdGFudGU6IG51bWJlcikgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxubGV0IGNhbGxiYWNrU3RhdHVzOiAoKGNvbGV0YW5kbzogYm9vbGVhbikgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuXHJcbmNvbnN0IElOVEVSVkFMT19DT0xFVEFfTVMgPSAxMCAqIDYwICogMTAwMCArIDIgKiAxMDAwOyAvLyAxMCBtaW51dG9zIGUgMiBzZWd1bmRvc1xyXG5cclxuLyoqXHJcbiAqIE9idMOpbSBzZSBlc3TDoSBjb2xldGFuZG8gYXV0b21hdGljYW1lbnRlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXN0YUNvbGV0YW5kbygpOiBib29sZWFuIHtcclxuICByZXR1cm4gY29sZXRhbmRvQXV0b21hdGljYW1lbnRlO1xyXG59XHJcblxyXG4vKipcclxuICogT2J0w6ltIG8gdGltZXN0YW1wIGRhIHByw7N4aW1hIGNvbGV0YVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3hpbWFDb2xldGFUaW1lc3RhbXAoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgcmV0dXJuIHByb3hpbWFDb2xldGFUaW1lc3RhbXA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPYnTDqW0gbyB0ZW1wbyByZXN0YW50ZSBhdMOpIGEgcHLDs3hpbWEgY29sZXRhIGVtIG1pbGlzc2VndW5kb3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wb1Jlc3RhbnRlKCk6IG51bWJlciB7XHJcbiAgaWYgKCFwcm94aW1hQ29sZXRhVGltZXN0YW1wKSByZXR1cm4gMDtcclxuICBjb25zdCBhZ29yYSA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgcmVzdGFudGUgPSBwcm94aW1hQ29sZXRhVGltZXN0YW1wIC0gYWdvcmE7XHJcbiAgcmV0dXJuIE1hdGgubWF4KDAsIHJlc3RhbnRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlZmluZSBvIGNhbGxiYWNrIHBhcmEgYXR1YWxpemFyIGEgVUkgZG8gdGltZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDYWxsYmFja0F0dWFsaXphY2FvVUkoY2FsbGJhY2s6ICgodGVtcG9SZXN0YW50ZTogbnVtYmVyKSA9PiB2b2lkKSB8IG51bGwpOiB2b2lkIHtcclxuICBjYWxsYmFja0F0dWFsaXphY2FvVUkgPSBjYWxsYmFjaztcclxufVxyXG5cclxuLyoqXHJcbiAqIERlZmluZSBvIGNhbGxiYWNrIHBhcmEgYXR1YWxpemFyIG8gc3RhdHVzIChib3TDo28sIGV0YylcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDYWxsYmFja1N0YXR1cyhjYWxsYmFjazogKChjb2xldGFuZG86IGJvb2xlYW4pID0+IHZvaWQpIHwgbnVsbCk6IHZvaWQge1xyXG4gIGNhbGxiYWNrU3RhdHVzID0gY2FsbGJhY2s7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbmljaWEgbyBpbnRlcnZhbG8gZGUgYXR1YWxpemHDp8OjbyBkbyB0aW1lciAoY2hhbWEgbyBjYWxsYmFjayBhIGNhZGEgc2VndW5kbylcclxuICovXHJcbmxldCBpbnRlcnZhbG9BdHVhbGl6YWNhb1RpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbmZ1bmN0aW9uIGluaWNpYXJBdHVhbGl6YWNhb1RpbWVyKCk6IHZvaWQge1xyXG4gIGlmIChpbnRlcnZhbG9BdHVhbGl6YWNhb1RpbWVyKSB7XHJcbiAgICBjbGVhckludGVydmFsKGludGVydmFsb0F0dWFsaXphY2FvVGltZXIpO1xyXG4gIH1cclxuXHJcbiAgaW50ZXJ2YWxvQXR1YWxpemFjYW9UaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBpZiAoY2FsbGJhY2tBdHVhbGl6YWNhb1VJICYmIGNvbGV0YW5kb0F1dG9tYXRpY2FtZW50ZSkge1xyXG4gICAgICBjb25zdCB0ZW1wb1Jlc3RhbnRlID0gZ2V0VGVtcG9SZXN0YW50ZSgpO1xyXG4gICAgICBjYWxsYmFja0F0dWFsaXphY2FvVUkodGVtcG9SZXN0YW50ZSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBTZSBvIHRlbXBvIGFjYWJvdSwgcGFyYSBvIGludGVydmFsb1xyXG4gICAgICBpZiAodGVtcG9SZXN0YW50ZSA8PSAwKSB7XHJcbiAgICAgICAgaWYgKGludGVydmFsb0F0dWFsaXphY2FvVGltZXIpIHtcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxvQXR1YWxpemFjYW9UaW1lcik7XHJcbiAgICAgICAgICBpbnRlcnZhbG9BdHVhbGl6YWNhb1RpbWVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCAxMDAwKTsgLy8gQXR1YWxpemFyIGEgY2FkYSBzZWd1bmRvXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcmFyQXR1YWxpemFjYW9UaW1lcigpOiB2b2lkIHtcclxuICBpZiAoaW50ZXJ2YWxvQXR1YWxpemFjYW9UaW1lcikge1xyXG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbG9BdHVhbGl6YWNhb1RpbWVyKTtcclxuICAgIGludGVydmFsb0F0dWFsaXphY2FvVGltZXIgPSBudWxsO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEluaWNpYSBhIGNvbGV0YSBhdXRvbcOhdGljYVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluaWNpYXJDb2xldGFBdXRvbWF0aWNhKFxyXG4gIGZ1bmNhb0NvbGV0YTogKCkgPT4gUHJvbWlzZTx2b2lkPlxyXG4pOiB2b2lkIHtcclxuICBpZiAoY29sZXRhbmRvQXV0b21hdGljYW1lbnRlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ+KaoO+4jyBDb2xldGEgYXV0b23DoXRpY2EgasOhIGVzdMOhIGF0aXZhJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb2xldGFuZG9BdXRvbWF0aWNhbWVudGUgPSB0cnVlO1xyXG4gIHByb3hpbWFDb2xldGFUaW1lc3RhbXAgPSBEYXRlLm5vdygpICsgSU5URVJWQUxPX0NPTEVUQV9NUztcclxuICBcclxuICAvLyBOb3RpZmljYXIgbXVkYW7Dp2EgZGUgc3RhdHVzXHJcbiAgaWYgKGNhbGxiYWNrU3RhdHVzKSB7XHJcbiAgICBjYWxsYmFja1N0YXR1cyh0cnVlKTtcclxuICB9XHJcblxyXG4gIC8vIEluaWNpYXIgYXR1YWxpemHDp8OjbyBkbyB0aW1lclxyXG4gIGluaWNpYXJBdHVhbGl6YWNhb1RpbWVyKCk7XHJcblxyXG4gIC8vIEV4ZWN1dGFyIHByaW1laXJhIGNvbGV0YSBpbWVkaWF0YW1lbnRlXHJcbiAgZnVuY2FvQ29sZXRhKCkuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICBjb25zb2xlLmVycm9yKCfinYwgRXJybyBuYSBjb2xldGEgYXV0b23DoXRpY2E6JywgZXJyb3IpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBEZWZpbmlyIHByw7N4aW1vIHRpbWVzdGFtcCBhcMOzcyBhIHByaW1laXJhIGNvbGV0YVxyXG4gIHByb3hpbWFDb2xldGFUaW1lc3RhbXAgPSBEYXRlLm5vdygpICsgSU5URVJWQUxPX0NPTEVUQV9NUztcclxuXHJcbiAgLy8gQ3JpYXIgaW50ZXJ2YWxvIHBhcmEgY29sZXRhcyBzdWJzZXF1ZW50ZXNcclxuICBpbnRlcnZhbG9Db2xldGEgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKCFjb2xldGFuZG9BdXRvbWF0aWNhbWVudGUpIHJldHVybjtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBmdW5jYW9Db2xldGEoKTtcclxuICAgICAgcHJveGltYUNvbGV0YVRpbWVzdGFtcCA9IERhdGUubm93KCkgKyBJTlRFUlZBTE9fQ09MRVRBX01TO1xyXG4gICAgICBcclxuICAgICAgLy8gUmVpbmljaWFyIGF0dWFsaXphw6fDo28gZG8gdGltZXJcclxuICAgICAgaW5pY2lhckF0dWFsaXphY2FvVGltZXIoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ+KdjCBFcnJvIG5hIGNvbGV0YSBhdXRvbcOhdGljYTonLCBlcnJvcik7XHJcbiAgICAgIC8vIENvbnRpbnVhciBtZXNtbyBlbSBjYXNvIGRlIGVycm9cclxuICAgICAgcHJveGltYUNvbGV0YVRpbWVzdGFtcCA9IERhdGUubm93KCkgKyBJTlRFUlZBTE9fQ09MRVRBX01TO1xyXG4gICAgICBpbmljaWFyQXR1YWxpemFjYW9UaW1lcigpO1xyXG4gICAgfVxyXG4gIH0sIElOVEVSVkFMT19DT0xFVEFfTVMpO1xyXG5cclxuICBjb25zb2xlLmxvZygn4pyFIENvbGV0YSBhdXRvbcOhdGljYSBpbmljaWFkYS4gUHLDs3hpbWEgY29sZXRhIGVtOicsIG5ldyBEYXRlKHByb3hpbWFDb2xldGFUaW1lc3RhbXApLnRvTG9jYWxlVGltZVN0cmluZygpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcmEgYSBjb2xldGEgYXV0b23DoXRpY2FcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJhckNvbGV0YUF1dG9tYXRpY2EoKTogdm9pZCB7XHJcbiAgaWYgKCFjb2xldGFuZG9BdXRvbWF0aWNhbWVudGUpIHtcclxuICAgIGNvbnNvbGUud2Fybign4pqg77iPIENvbGV0YSBhdXRvbcOhdGljYSBqw6EgZXN0w6EgcGFyYWRhJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb2xldGFuZG9BdXRvbWF0aWNhbWVudGUgPSBmYWxzZTtcclxuICBwcm94aW1hQ29sZXRhVGltZXN0YW1wID0gbnVsbDtcclxuXHJcbiAgaWYgKGludGVydmFsb0NvbGV0YSkge1xyXG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbG9Db2xldGEpO1xyXG4gICAgaW50ZXJ2YWxvQ29sZXRhID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHBhcmFyQXR1YWxpemFjYW9UaW1lcigpO1xyXG5cclxuICAvLyBOb3RpZmljYXIgbXVkYW7Dp2EgZGUgc3RhdHVzXHJcbiAgaWYgKGNhbGxiYWNrU3RhdHVzKSB7XHJcbiAgICBjYWxsYmFja1N0YXR1cyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZygn4o+577iPIENvbGV0YSBhdXRvbcOhdGljYSBwYXJhZGEnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZvcm1hdGEgbyB0ZW1wbyByZXN0YW50ZSBlbSBmb3JtYXRvIGxlZ8OtdmVsIChNTTpTUylcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRhclRlbXBvUmVzdGFudGUodGVtcG9NczogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCB0b3RhbFNlZ3VuZG9zID0gTWF0aC5mbG9vcih0ZW1wb01zIC8gMTAwMCk7XHJcbiAgY29uc3QgbWludXRvcyA9IE1hdGguZmxvb3IodG90YWxTZWd1bmRvcyAvIDYwKTtcclxuICBjb25zdCBzZWd1bmRvcyA9IHRvdGFsU2VndW5kb3MgJSA2MDtcclxuICByZXR1cm4gYCR7bWludXRvcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OiR7c2VndW5kb3MudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfWA7XHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiBBw6fDtWVzIGRlIGNvbGV0YSBkZSBzYW5ndWUgZG8gUG9wU1VTXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQWxlcnQgfSBmcm9tICcuLi91dGlscy9zd2VldGFsZXJ0JztcclxuaW1wb3J0IHsgZ2V0Q2hhcmFjdGVySWQgfSBmcm9tICcuLi91dGlscy9jaGFyYWN0ZXItaWQtZXh0cmFjdG9yJztcclxuaW1wb3J0IHsgdXNhckl0ZW1BcG9zQnVzY2FyIH0gZnJvbSAnLi4vdXRpbHMvd2ViZm9ybXMnO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gJy4uL3V0aWxzL3NlbGVjdG9ycyc7XHJcbmltcG9ydCB7XHJcbiAgaW5pY2lhckNvbGV0YUF1dG9tYXRpY2EsXHJcbiAgcGFyYXJDb2xldGFBdXRvbWF0aWNhLFxyXG4gIGVzdGFDb2xldGFuZG8sXHJcbn0gZnJvbSAnLi9jb2xldGFyLXNhbmd1ZS1zdGF0ZSc7XHJcblxyXG4vKipcclxuICogRXhlY3V0YSBhIGHDp8OjbyBkZSBjb2xldGFyIHNhbmd1ZSBkZSB1bSBwZXJzb25hZ2VtXHJcbiAqIFVzYSBhIG1lc21hIGzDs2dpY2EgcXVlIGN1cmFyUGVyc29uYWdlbSwgY2hhbWFuZG8gdXNhckl0ZW1BcG9zQnVzY2FyXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29sZXRhclNhbmd1ZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBjaGFyYWN0ZXJJZCA9IGdldENoYXJhY3RlcklkKCk7XHJcbiAgXHJcbiAgaWYgKCFjaGFyYWN0ZXJJZCkge1xyXG4gICAgQWxlcnQuZXJyb3IoJ0Vycm8nLCAnTsOjbyBmb2kgcG9zc8OtdmVsIGlkZW50aWZpY2FyIG8gcGVyc29uYWdlbS4nKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKGDwn6m4IEluaWNpYW5kbyBjb2xldGEgZGUgc2FuZ3VlIGRvIHBlcnNvbmFnZW0gJHtjaGFyYWN0ZXJJZH0uLi5gKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIFVzYXIgbyBcIkNvbGV0b3IgZGUgc2FuZ3VlXCIgbmEgcMOhZ2luYSBkZSBpbnRlcmHDp8Ojb1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB1c2FySXRlbUFwb3NCdXNjYXIoU2VsZWN0b3JzLnRleHRDb2xldG9yU2FuZ3VlLCBjaGFyYWN0ZXJJZCk7XHJcbiAgICBcclxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDMwMiB8fCByZXNwb25zZS5zdGF0dXMgPT09IDApIHtcclxuICAgICAgLy8gU3VjZXNzbyFcclxuICAgICAgY29uc29sZS5sb2coYOKchSBTYW5ndWUgZG8gcGVyc29uYWdlbSAke2NoYXJhY3RlcklkfSBjb2xldGFkbyBjb20gc3VjZXNzbyFgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzcG9zdGEgaW5lc3BlcmFkYTogJHtyZXNwb25zZS5zdGF0dXN9YCk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm8gYW8gY29sZXRhciBzYW5ndWU6JywgZXJyb3IpO1xyXG4gICAgQWxlcnQuZXJyb3IoJ0Vycm8nLCAnTsOjbyBmb2kgcG9zc8OtdmVsIGNvbGV0YXIgbyBzYW5ndWUuIFRlbnRlIG5vdmFtZW50ZS4nKTtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEluaWNpYSBhIGNvbGV0YSBhdXRvbcOhdGljYSBkZSBzYW5ndWUgKGEgY2FkYSAxMCBtaW51dG9zIGUgMiBzZWd1bmRvcylcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmljaWFyQ29sZXRhQXV0b21hdGljYVNhbmd1ZSgpOiB2b2lkIHtcclxuICBpZiAoZXN0YUNvbGV0YW5kbygpKSB7XHJcbiAgICBBbGVydC53YXJuaW5nKCdBdmlzbycsICdBIGNvbGV0YSBhdXRvbcOhdGljYSBqw6EgZXN0w6EgYXRpdmEuJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBpbmljaWFyQ29sZXRhQXV0b21hdGljYShjb2xldGFyU2FuZ3VlKTtcclxuICBBbGVydC50b2FzdFN1Y2Nlc3MoJ0NvbGV0YSBhdXRvbcOhdGljYSBpbmljaWFkYSEgQ29sZXRhbmRvIGEgY2FkYSAxMCBtaW51dG9zIGUgMiBzZWd1bmRvcy4nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcmEgYSBjb2xldGEgYXV0b23DoXRpY2EgZGUgc2FuZ3VlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcGFyYXJDb2xldGFBdXRvbWF0aWNhU2FuZ3VlKCk6IHZvaWQge1xyXG4gIGlmICghZXN0YUNvbGV0YW5kbygpKSB7XHJcbiAgICBBbGVydC53YXJuaW5nKCdBdmlzbycsICdBIGNvbGV0YSBhdXRvbcOhdGljYSBqw6EgZXN0w6EgcGFyYWRhLicpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgQWxlcnQuY29uZmlybShcclxuICAgICdQYXJhciBDb2xldGEgQXV0b23DoXRpY2EnLFxyXG4gICAgJ1NlIHZvY8OqIHBhcmFyIGFnb3JhLCBvIHNjcmlwdCBwZXJkZXLDoSBhIHJlZmVyw6puY2lhIGRlIHRlbXBvIGRlIGNvb2xkb3duIGRvIGl0ZW0uIERlc2VqYSBjb250aW51YXI/JyxcclxuICAgICdTaW0sIHBhcmFyJyxcclxuICAgICdDYW5jZWxhcidcclxuICApLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgaWYgKHJlc3VsdC5pc0NvbmZpcm1lZCkge1xyXG4gICAgICBwYXJhckNvbGV0YUF1dG9tYXRpY2EoKTtcclxuICAgICAgQWxlcnQudG9hc3RJbmZvKCdDb2xldGEgYXV0b23DoXRpY2EgcGFyYWRhLicpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogVmVyaWZpY2Egc2UgbyBwZXJzb25hZ2VtIHBvZGUgZG9hciBzYW5ndWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwb2RlRG9hclNhbmd1ZSgpOiBib29sZWFuIHtcclxuICAvLyBUT0RPOiBJbXBsZW1lbnRhciB2ZXJpZmljYcOnw6NvIHJlYWxcclxuICAvLyBFeGVtcGxvOiB2ZXJpZmljYXIgY29uZGnDp8O1ZXMgcGFyYSBkb2HDp8OjbyBkZSBzYW5ndWVcclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE9idMOpbSBvIHRpcG8gc2FuZ3XDrW5lbyBkbyBwZXJzb25hZ2VtXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb2J0ZXJUaXBvU2FuZ3VpbmVvKCk6IHN0cmluZyB8IG51bGwge1xyXG4gIC8vIFRPRE86IEltcGxlbWVudGFyIGV4dHJhw6fDo28gZG8gdGlwbyBzYW5ndcOtbmVvXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiBBw6fDtWVzIGRlIGN1cmEgZG8gUG9wU1VTXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQWxlcnQgfSBmcm9tICcuLi91dGlscy9zd2VldGFsZXJ0JztcclxuaW1wb3J0IHsgZ2V0Q2hhcmFjdGVySWQgfSBmcm9tICcuLi91dGlscy9jaGFyYWN0ZXItaWQtZXh0cmFjdG9yJztcclxuaW1wb3J0IHsgXHJcbiAgZmV0Y2hQYWdpbmFJbnZlbnRhcmlvLCBcclxuICBidXNjYXJMaW5oYUl0ZW1JbnZlbnRhcmlvLCBcclxuICB1c2FySXRlbUFwb3NCdXNjYXIsXHJcbiAgdXNhckl0ZW1Eb0ludmVudGFyaW8gXHJcbn0gZnJvbSAnLi4vdXRpbHMvd2ViZm9ybXMnO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gJy4uL3V0aWxzL3NlbGVjdG9ycyc7XHJcblxyXG4vKipcclxuICogRXhlY3V0YSBhIGHDp8OjbyBkZSBjdXJhciB1bSBwZXJzb25hZ2VtXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3VyYXJQZXJzb25hZ2VtKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gIGNvbnN0IGNoYXJhY3RlcklkID0gZ2V0Q2hhcmFjdGVySWQoKTtcclxuICBcclxuICBpZiAoIWNoYXJhY3RlcklkKSB7XHJcbiAgICBBbGVydC5lcnJvcignRXJybycsICdOw6NvIGZvaSBwb3Nzw612ZWwgaWRlbnRpZmljYXIgbyBwZXJzb25hZ2VtLicpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coYPCfj6UgSW5pY2lhbmRvIGN1cmEgZG8gcGVyc29uYWdlbSAke2NoYXJhY3RlcklkfS4uLmApO1xyXG5cclxuICB0cnkge1xyXG4gICAgLy8gMS4gRmF6ZXIgR0VUIG5hIHDDoWdpbmEgZGUgaW50ZXJhw6fDo29cclxuICAgIC8vIDIuIEV4dHJhaXIgY2FtcG9zIFdlYkZvcm1zIGRvIEhUTUwgcmV0b3JuYWRvXHJcbiAgICAvLyAzLiBCdXNjYXIgbyBpdGVtIFwiRGVudGVzIGZlaW9zIGZhbHNvc1wiXHJcbiAgICAvLyA0LiBVc2FyIG8gaXRlbSB2aWEgV2ViRm9ybXNcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXNhckl0ZW1BcG9zQnVzY2FyKFNlbGVjdG9ycy50ZXh0Q29sZXRvclNhbmd1ZSwgY2hhcmFjdGVySWQpO1xyXG4gICAgXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAzMDIgfHwgcmVzcG9uc2Uuc3RhdHVzID09PSAwKSB7XHJcbiAgICAgIC8vIFN1Y2Vzc28hXHJcbiAgICAgIFxyXG4gICAgICAvL2VzcGVyYSAyIHNlZ3VuZG9zXHJcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSk7XHJcbiAgICAgIGF3YWl0IHVzYXJUdWJvU2FuZ3VpbmVvKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGDinIUgUGVyc29uYWdlbSAke2NoYXJhY3RlcklkfSBjdXJhZG8gY29tIHN1Y2Vzc28hYCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlc3Bvc3RhIGluZXNwZXJhZGE6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvIGFvIGN1cmFyIHBlcnNvbmFnZW06JywgZXJyb3IpO1xyXG4gICAgQWxlcnQuZXJyb3IoJ0Vycm8nLCAnTsOjbyBmb2kgcG9zc8OtdmVsIGN1cmFyIG8gcGVyc29uYWdlbS4gVGVudGUgbm92YW1lbnRlLicpO1xyXG4gICAgdGhyb3cgZXJyb3I7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVXNhIG8gaXRlbSBcIlR1Ym8gc2FuZ3XDrW5lb1wiIGRvIGludmVudMOhcmlvXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNhclR1Ym9TYW5ndWluZW8oKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgY29uc3QgY2hhcmFjdGVySWQgPSBnZXRDaGFyYWN0ZXJJZCgpO1xyXG4gIFxyXG4gIGlmICghY2hhcmFjdGVySWQpIHtcclxuICAgIEFsZXJ0LmVycm9yKCdFcnJvJywgJ07Do28gZm9pIHBvc3PDrXZlbCBpZGVudGlmaWNhciBvIHBlcnNvbmFnZW0uJyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coJ/CflI0gQnVzY2FuZG8gcMOhZ2luYSBkZSBpbnZlbnTDoXJpby4uLicpO1xyXG4gICAgXHJcbiAgICAvLyAxLiBCdXNjYXIgcMOhZ2luYSBkZSBpbnZlbnTDoXJpb1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaFBhZ2luYUludmVudGFyaW8oKTtcclxuICAgIFxyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm8gYW8gYnVzY2FyIHDDoWdpbmEgZGUgaW52ZW50w6FyaW86ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICBcclxuICAgIC8vIDIuIEJ1c2NhciBhIGxpbmhhIGRhIHRhYmVsYSBxdWUgY29udMOpbSBcIlR1Ym8gc2FuZ3XDrW5lb1wiXHJcbiAgICBjb25zdCBsaW5oYUl0ZW0gPSBidXNjYXJMaW5oYUl0ZW1JbnZlbnRhcmlvKGh0bWwsIFNlbGVjdG9ycy50ZXh0VHVib1Nhbmd1aW5lbyk7XHJcbiAgICBcclxuICAgIGlmICghbGluaGFJdGVtKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSXRlbSBcIiR7U2VsZWN0b3JzLnRleHRUdWJvU2FuZ3VpbmVvfVwiIG7Do28gZW5jb250cmFkbyBubyBpbnZlbnTDoXJpb2ApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoIWxpbmhhSXRlbS5idG5Vc2UpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBCb3TDo28gXCJVc2FyXCIgbsOjbyBlbmNvbnRyYWRvIHBhcmEgbyBpdGVtIFwiJHtTZWxlY3RvcnMudGV4dFR1Ym9TYW5ndWluZW99XCJgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ+KchSBJdGVtIGVuY29udHJhZG8gbm8gaW52ZW50w6FyaW86Jywge1xyXG4gICAgICBub21lOiBTZWxlY3RvcnMudGV4dFR1Ym9TYW5ndWluZW8sXHJcbiAgICAgIGl0ZW1JZDogbGluaGFJdGVtLml0ZW1JZCxcclxuICAgICAgdGVtQm90YW9Vc2FyOiAhIWxpbmhhSXRlbS5idG5Vc2UsXHJcbiAgICAgIG5vbWVCb3RhbzogbGluaGFJdGVtLmJ0blVzZS5uYW1lLFxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vIDMuIFVzYXIgbyBpdGVtIGRvIGludmVudMOhcmlvIGNsaWNhbmRvIG5vIGJvdMOjb1xyXG4gICAgY29uc29sZS5sb2coJ/CfqbggVXNhbmRvIHR1Ym8gc2FuZ3XDrW5lbyBkbyBpbnZlbnTDoXJpby4uLicpO1xyXG4gICAgY29uc3QgdXNlUmVzcG9uc2UgPSBhd2FpdCB1c2FySXRlbURvSW52ZW50YXJpbyhodG1sLCBTZWxlY3RvcnMudGV4dFR1Ym9TYW5ndWluZW8pO1xyXG4gICAgXHJcbiAgICAvLyBWZXJpZmljYXIgcmVzcG9zdGFcclxuICAgIGlmICh1c2VSZXNwb25zZS5zdGF0dXMgPT09IDMwMiB8fCB1c2VSZXNwb25zZS5zdGF0dXMgPT09IDAgfHwgdXNlUmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgY29uc29sZS5sb2coJ+KchSBUdWJvIHNhbmd1w61uZW8gdXNhZG8gY29tIHN1Y2Vzc28hJyk7XHJcbiAgICAgIEFsZXJ0LnRvYXN0U3VjY2VzcygnVHVibyBzYW5ndcOtbmVvIHVzYWRvIGNvbSBzdWNlc3NvIScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvIGFvIHVzYXIgdHVibyBzYW5ndcOtbmVvOiAke3VzZVJlc3BvbnNlLnN0YXR1c30gJHt1c2VSZXNwb25zZS5zdGF0dXNUZXh0fWApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ+KdjCBFcnJvIGFvIHVzYXIgdHVibyBzYW5ndcOtbmVvOicsIGVycm9yKTtcclxuICAgIEFsZXJ0LmVycm9yKCdFcnJvJywgYE7Do28gZm9pIHBvc3PDrXZlbCB1c2FyIG8gdHVibyBzYW5ndcOtbmVvOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0Vycm8gZGVzY29uaGVjaWRvJ31gKTtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFZlcmlmaWNhIHNlIG8gcGVyc29uYWdlbSBlc3TDoSBkb2VudGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwZXJzb25hZ2VtRXN0YWRvZW50ZSgpOiBib29sZWFuIHtcclxuICAvLyBUT0RPOiBJbXBsZW1lbnRhciB2ZXJpZmljYcOnw6NvIHJlYWxcclxuICAvLyBFeGVtcGxvOiB2ZXJpZmljYXIgZWxlbWVudG8gbmEgcMOhZ2luYSBxdWUgaW5kaWNhIGRvZW7Dp2FcclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPYnTDqW0gbyB0aXBvIGRlIGRvZW7Dp2EgZG8gcGVyc29uYWdlbVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG9idGVyVGlwb0RvZW5jYSgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAvLyBUT0RPOiBJbXBsZW1lbnRhciBleHRyYcOnw6NvIGRvIHRpcG8gZGUgZG9lbsOnYVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4iLCIvKipcclxuICogQ29tcG9uZW50ZSBCdXR0b25cclxuICogXHJcbiAqIEV4ZW1wbG8gZGUgY29tcG9uZW50ZSBlc3RpbGl6YWRvIHVzYW5kbyBHb29iZXJcclxuICovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudE9wdGlvbnMgfSBmcm9tICcuLi9jb3JlL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IGNzcywgdGhlbWUsIGNyZWF0ZVN0eWxlZEVsZW1lbnQgfSBmcm9tICcuLi91dGlscy9zdHlsZXMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCdXR0b25PcHRpb25zIGV4dGVuZHMgQ29tcG9uZW50T3B0aW9ucyB7XHJcbiAgdGV4dD86IHN0cmluZztcclxuICB2YXJpYW50PzogJ3ByaW1hcnknIHwgJ3NlY29uZGFyeScgfCAnc3VjY2VzcycgfCAnZGFuZ2VyJyB8ICd3YXJuaW5nJztcclxuICBzaXplPzogJ3NtJyB8ICdtZCcgfCAnbGcnO1xyXG4gIGRpc2FibGVkPzogYm9vbGVhbjtcclxuICBsb2FkaW5nPzogYm9vbGVhbjtcclxuICBvbkNsaWNrPzogKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG4vLyBDbGFzc2VzIGJhc2UgZG8gYm90w6NvXHJcbmNvbnN0IGJ1dHRvbkJhc2VDbGFzcyA9IGNzc2BcclxuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJvcmRlci1yYWRpdXM6ICR7dGhlbWUuYm9yZGVyUmFkaXVzLm1kfTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgdHJhbnNpdGlvbjogYWxsICR7dGhlbWUudHJhbnNpdGlvbnMuZmFzdH07XHJcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XHJcbiAgXHJcbiAgJjpkaXNhYmxlZCB7XHJcbiAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gIH1cclxuICBcclxuICAmOmZvY3VzIHtcclxuICAgIG91dGxpbmU6IDJweCBzb2xpZCAke3RoZW1lLmNvbG9ycy5wcmltYXJ5fTtcclxuICAgIG91dGxpbmUtb2Zmc2V0OiAycHg7XHJcbiAgfVxyXG4gIFxyXG4gICY6YWN0aXZlOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCk7XHJcbiAgfVxyXG5gO1xyXG5cclxuLy8gVGFtYW5ob3NcclxuY29uc3QgYnV0dG9uU21DbGFzcyA9IGNzc2BcclxuICBwYWRkaW5nOiAke3RoZW1lLnNwYWNpbmcueHN9ICR7dGhlbWUuc3BhY2luZy5zbX07XHJcbiAgZm9udC1zaXplOiAxMnB4O1xyXG5gO1xyXG5cclxuY29uc3QgYnV0dG9uTWRDbGFzcyA9IGNzc2BcclxuICBwYWRkaW5nOiAke3RoZW1lLnNwYWNpbmcuc219ICR7dGhlbWUuc3BhY2luZy5tZH07XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG5gO1xyXG5cclxuY29uc3QgYnV0dG9uTGdDbGFzcyA9IGNzc2BcclxuICBwYWRkaW5nOiAke3RoZW1lLnNwYWNpbmcubWR9ICR7dGhlbWUuc3BhY2luZy5sZ307XHJcbiAgZm9udC1zaXplOiAxNnB4O1xyXG5gO1xyXG5cclxuLy8gVmFyaWFudGVzXHJcbmNvbnN0IGJ1dHRvblByaW1hcnlDbGFzcyA9IGNzc2BcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3RoZW1lLmNvbG9ycy5wcmltYXJ5fTtcclxuICBjb2xvcjogJHt0aGVtZS5jb2xvcnMud2hpdGV9O1xyXG4gIFxyXG4gICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzI1NjNlYjtcclxuICAgIGJveC1zaGFkb3c6ICR7dGhlbWUuc2hhZG93cy5tZH07XHJcbiAgfVxyXG5gO1xyXG5cclxuY29uc3QgYnV0dG9uU2Vjb25kYXJ5Q2xhc3MgPSBjc3NgXHJcbiAgYmFja2dyb3VuZC1jb2xvcjogJHt0aGVtZS5jb2xvcnMuc2Vjb25kYXJ5fTtcclxuICBjb2xvcjogJHt0aGVtZS5jb2xvcnMud2hpdGV9O1xyXG4gIFxyXG4gICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzQ3NTU2OTtcclxuICAgIGJveC1zaGFkb3c6ICR7dGhlbWUuc2hhZG93cy5tZH07XHJcbiAgfVxyXG5gO1xyXG5cclxuY29uc3QgYnV0dG9uU3VjY2Vzc0NsYXNzID0gY3NzYFxyXG4gIGJhY2tncm91bmQtY29sb3I6ICR7dGhlbWUuY29sb3JzLnN1Y2Nlc3N9O1xyXG4gIGNvbG9yOiAke3RoZW1lLmNvbG9ycy53aGl0ZX07XHJcbiAgXHJcbiAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDU5NjY5O1xyXG4gICAgYm94LXNoYWRvdzogJHt0aGVtZS5zaGFkb3dzLm1kfTtcclxuICB9XHJcbmA7XHJcblxyXG5jb25zdCBidXR0b25EYW5nZXJDbGFzcyA9IGNzc2BcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3RoZW1lLmNvbG9ycy5kYW5nZXJ9O1xyXG4gIGNvbG9yOiAke3RoZW1lLmNvbG9ycy53aGl0ZX07XHJcbiAgXHJcbiAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGMyNjI2O1xyXG4gICAgYm94LXNoYWRvdzogJHt0aGVtZS5zaGFkb3dzLm1kfTtcclxuICB9XHJcbmA7XHJcblxyXG5jb25zdCBidXR0b25XYXJuaW5nQ2xhc3MgPSBjc3NgXHJcbiAgYmFja2dyb3VuZC1jb2xvcjogJHt0aGVtZS5jb2xvcnMud2FybmluZ307XHJcbiAgY29sb3I6ICR7dGhlbWUuY29sb3JzLndoaXRlfTtcclxuICBcclxuICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkOTc3MDY7XHJcbiAgICBib3gtc2hhZG93OiAke3RoZW1lLnNoYWRvd3MubWR9O1xyXG4gIH1cclxuYDtcclxuXHJcbmV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBDb21wb25lbnQ8QnV0dG9uT3B0aW9ucz4ge1xyXG4gIHByaXZhdGUgY2xpY2tIYW5kbGVyPzogKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgb3JpZ2luYWxUZXh0OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgcHJvdGVjdGVkIGNyZWF0ZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICB0ZXh0ID0gJ0J1dHRvbicsXHJcbiAgICAgIHZhcmlhbnQgPSAncHJpbWFyeScsXHJcbiAgICAgIHNpemUgPSAnbWQnLFxyXG4gICAgICBkaXNhYmxlZCA9IGZhbHNlLFxyXG4gICAgICBsb2FkaW5nID0gZmFsc2UsXHJcbiAgICB9ID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgIGNvbnN0IHNpemVDbGFzcyA9IHtcclxuICAgICAgc206IGJ1dHRvblNtQ2xhc3MsXHJcbiAgICAgIG1kOiBidXR0b25NZENsYXNzLFxyXG4gICAgICBsZzogYnV0dG9uTGdDbGFzcyxcclxuICAgIH1bc2l6ZV07XHJcblxyXG4gICAgY29uc3QgdmFyaWFudENsYXNzID0ge1xyXG4gICAgICBwcmltYXJ5OiBidXR0b25QcmltYXJ5Q2xhc3MsXHJcbiAgICAgIHNlY29uZGFyeTogYnV0dG9uU2Vjb25kYXJ5Q2xhc3MsXHJcbiAgICAgIHN1Y2Nlc3M6IGJ1dHRvblN1Y2Nlc3NDbGFzcyxcclxuICAgICAgZGFuZ2VyOiBidXR0b25EYW5nZXJDbGFzcyxcclxuICAgICAgd2FybmluZzogYnV0dG9uV2FybmluZ0NsYXNzLFxyXG4gICAgfVt2YXJpYW50XTtcclxuXHJcbiAgICBjb25zdCBidXR0b24gPSBjcmVhdGVTdHlsZWRFbGVtZW50KCdidXR0b24nLCBgJHtidXR0b25CYXNlQ2xhc3N9ICR7c2l6ZUNsYXNzfSAke3ZhcmlhbnRDbGFzc31gKTtcclxuXHJcbiAgICB0aGlzLm9yaWdpbmFsVGV4dCA9IHRleHQ7XHJcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgYnV0dG9uLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcblxyXG4gICAgLy8gQXBsaWNhciBlc3RhZG8gZGUgbG9hZGluZyBzZSBuZWNlc3PDoXJpb1xyXG4gICAgaWYgKGxvYWRpbmcpIHtcclxuICAgICAgdGhpcy5hcHBseUxvYWRpbmdTdGF0ZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIG9uTW91bnQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm9uQ2xpY2spIHtcclxuICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSB0aGlzLm9wdGlvbnMub25DbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT2JzZXJ2YXIgbXVkYW7Dp2FzIG5hIG9ww6fDo28gbG9hZGluZyB1c2FuZG8gdW0gc2V0dGVyIHJlYXRpdm9cclxuICAgIHRoaXMuc2V0dXBMb2FkaW5nUmVhY3RpdmUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbmZpZ3VyYSByZWF0aXZpZGFkZSBwYXJhIGEgb3DDp8OjbyBsb2FkaW5nXHJcbiAgICogVXNhIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBwYXJhIGRldGVjdGFyIG11ZGFuw6dhc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgc2V0dXBMb2FkaW5nUmVhY3RpdmUoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGxldCBjdXJyZW50TG9hZGluZyA9IHRoaXMub3B0aW9ucy5sb2FkaW5nIHx8IGZhbHNlO1xyXG5cclxuICAgIC8vIENyaWFyIHByb3ByaWVkYWRlIHJlYXRpdmFcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLm9wdGlvbnMsICdsb2FkaW5nJywge1xyXG4gICAgICBnZXQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRMb2FkaW5nO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoY3VycmVudExvYWRpbmcgIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICBjdXJyZW50TG9hZGluZyA9IHZhbHVlO1xyXG4gICAgICAgICAgc2VsZi5hcHBseUxvYWRpbmdTdGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBcGxpY2FyIGVzdGFkbyBpbmljaWFsIHNlIG5lY2Vzc8OhcmlvXHJcbiAgICBpZiAoY3VycmVudExvYWRpbmcpIHtcclxuICAgICAgdGhpcy5hcHBseUxvYWRpbmdTdGF0ZSh0cnVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBvblVubW91bnQoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jbGlja0hhbmRsZXIpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXR1YWxpemEgbyB0ZXh0byBkbyBib3TDo29cclxuICAgKi9cclxuICBzZXRUZXh0KHRleHQ6IHN0cmluZyk6IHRoaXMge1xyXG4gICAgdGhpcy5vcmlnaW5hbFRleHQgPSB0ZXh0O1xyXG4gICAgLy8gU2UgbsOjbyBlc3RpdmVyIGVtIGxvYWRpbmcsIGF0dWFsaXphciBvIHRleHRvIGltZWRpYXRhbWVudGVcclxuICAgIGlmICghdGhpcy5pc0xvYWRpbmcoKSkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYWJpbGl0YSBvIGJvdMOjb1xyXG4gICAqL1xyXG4gIGVuYWJsZSgpOiB0aGlzIHtcclxuICAgICh0aGlzLmVsZW1lbnQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc2FiaWxpdGEgbyBib3TDo29cclxuICAgKi9cclxuICBkaXNhYmxlKCk6IHRoaXMge1xyXG4gICAgKHRoaXMuZWxlbWVudCBhcyBIVE1MQnV0dG9uRWxlbWVudCkuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBcGxpY2EgbyBlc3RhZG8gZGUgbG9hZGluZyB2aXN1YWxtZW50ZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXBwbHlMb2FkaW5nU3RhdGUobG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgY29uc3QgYnV0dG9uID0gdGhpcy5lbGVtZW50IGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBpZiAobG9hZGluZykge1xyXG4gICAgICAvLyBTYWx2YXIgdGV4dG8gb3JpZ2luYWwgc2UgYWluZGEgbsOjbyBmb2kgc2Fsdm9cclxuICAgICAgaWYgKCF0aGlzLm9yaWdpbmFsVGV4dCAmJiBidXR0b24udGV4dENvbnRlbnQpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVGV4dCA9IGJ1dHRvbi50ZXh0Q29udGVudC50cmltKCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycsICd0cnVlJyk7XHJcbiAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIFxyXG4gICAgICAvLyBBZGljaW9uYXIgc3Bpbm5lciBlIHRleHRvIFwiQWd1YXJkZS4uLlwiXHJcbiAgICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgPHN2ZyBzdHlsZT1cImFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7IHdpZHRoOiAxNnB4OyBoZWlnaHQ6IDE2cHg7IG1hcmdpbi1yaWdodDogOHB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2Utb3BhY2l0eT1cIjAuMjVcIj48L2NpcmNsZT5cclxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgMmExMCAxMCAwIDAgMSAxMCAxMFwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgICAgIDxzcGFuPkFndWFyZGUuLi48L3NwYW4+XHJcbiAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAgQGtleWZyYW1lcyBzcGluIHtcclxuICAgICAgICAgICAgZnJvbSB7IHRyYW5zZm9ybTogcm90YXRlKDBkZWcpOyB9XHJcbiAgICAgICAgICAgIHRvIHsgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDwvc3R5bGU+XHJcbiAgICAgIGA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnKTtcclxuICAgICAgYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIFxyXG4gICAgICAvLyBMaW1wYXIgY29tcGxldGFtZW50ZSBvIGNvbnRlw7pkbyBlIHJlc3RhdXJhciB0ZXh0byBvcmlnaW5hbFxyXG4gICAgICBidXR0b24uaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHRoaXMub3JpZ2luYWxUZXh0IHx8ICdCdXR0b24nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIG8gZXN0YWRvIGRlIGxvYWRpbmcgKGF0dWFsaXphIGEgb3DDp8OjbyBlIG8gZXN0YWRvIHZpc3VhbClcclxuICAgKi9cclxuICBzZXRMb2FkaW5nKGxvYWRpbmc6IGJvb2xlYW4pOiB0aGlzIHtcclxuICAgIHRoaXMub3B0aW9ucy5sb2FkaW5nID0gbG9hZGluZztcclxuICAgIHRoaXMuYXBwbHlMb2FkaW5nU3RhdGUobG9hZGluZyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9idMOpbSBvIGVzdGFkbyBkZSBsb2FkaW5nXHJcbiAgICovXHJcbiAgaXNMb2FkaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sb2FkaW5nID09PSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIGEgdmFyaWFudGUgZG8gYm90w6NvXHJcbiAgICovXHJcbiAgc2V0VmFyaWFudCh2YXJpYW50OiAncHJpbWFyeScgfCAnc2Vjb25kYXJ5JyB8ICdzdWNjZXNzJyB8ICdkYW5nZXInIHwgJ3dhcm5pbmcnKTogdGhpcyB7XHJcbiAgICB0aGlzLm9wdGlvbnMudmFyaWFudCA9IHZhcmlhbnQ7XHJcbiAgICBcclxuICAgIC8vIFJlY3JpYXIgbyBlbGVtZW50byBjb20gYSBub3ZhIHZhcmlhbnRlXHJcbiAgICBjb25zdCBjdXJyZW50VGV4dCA9IHRoaXMub3JpZ2luYWxUZXh0IHx8IHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCB8fCAnJztcclxuICAgIGNvbnN0IGN1cnJlbnREaXNhYmxlZCA9ICh0aGlzLmVsZW1lbnQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkO1xyXG4gICAgY29uc3QgY3VycmVudExvYWRpbmcgPSB0aGlzLmlzTG9hZGluZygpO1xyXG4gICAgXHJcbiAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLnNpemUgfHwgJ21kJztcclxuICAgIGNvbnN0IHNpemVDbGFzcyA9IHtcclxuICAgICAgc206IGJ1dHRvblNtQ2xhc3MsXHJcbiAgICAgIG1kOiBidXR0b25NZENsYXNzLFxyXG4gICAgICBsZzogYnV0dG9uTGdDbGFzcyxcclxuICAgIH1bc2l6ZV07XHJcblxyXG4gICAgY29uc3QgdmFyaWFudENsYXNzID0ge1xyXG4gICAgICBwcmltYXJ5OiBidXR0b25QcmltYXJ5Q2xhc3MsXHJcbiAgICAgIHNlY29uZGFyeTogYnV0dG9uU2Vjb25kYXJ5Q2xhc3MsXHJcbiAgICAgIHN1Y2Nlc3M6IGJ1dHRvblN1Y2Nlc3NDbGFzcyxcclxuICAgICAgZGFuZ2VyOiBidXR0b25EYW5nZXJDbGFzcyxcclxuICAgICAgd2FybmluZzogYnV0dG9uV2FybmluZ0NsYXNzLFxyXG4gICAgfVt2YXJpYW50XTtcclxuXHJcbiAgICBjb25zdCBuZXdCdXR0b24gPSBjcmVhdGVTdHlsZWRFbGVtZW50KCdidXR0b24nLCBgJHtidXR0b25CYXNlQ2xhc3N9ICR7c2l6ZUNsYXNzfSAke3ZhcmlhbnRDbGFzc31gKTtcclxuICAgIFxyXG4gICAgLy8gQ29waWFyIHByb3ByaWVkYWRlc1xyXG4gICAgbmV3QnV0dG9uLnRleHRDb250ZW50ID0gY3VycmVudFRleHQ7XHJcbiAgICBuZXdCdXR0b24uZGlzYWJsZWQgPSBjdXJyZW50RGlzYWJsZWQ7XHJcbiAgICBcclxuICAgIC8vIENvcGlhciBldmVudCBsaXN0ZW5lcnNcclxuICAgIGlmICh0aGlzLmNsaWNrSGFuZGxlcikge1xyXG4gICAgICBuZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlciBhcyBFdmVudExpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdWJzdGl0dWlyIGVsZW1lbnRvXHJcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZChuZXdCdXR0b24sIHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBuZXdCdXR0b247XHJcbiAgICB0aGlzLm9yaWdpbmFsVGV4dCA9IGN1cnJlbnRUZXh0O1xyXG5cclxuICAgIC8vIEFwbGljYXIgbG9hZGluZyBzZSBuZWNlc3PDoXJpb1xyXG4gICAgaWYgKGN1cnJlbnRMb2FkaW5nKSB7XHJcbiAgICAgIHRoaXMuYXBwbHlMb2FkaW5nU3RhdGUodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG4iLCIvKipcclxuICogQ29tcG9uZW50ZSBDYXJkXHJcbiAqIFxyXG4gKiBDb250YWluZXIgZXN0aWxpemFkbyBwYXJhIGFncnVwYXIgY29udGXDumRvXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRPcHRpb25zIH0gZnJvbSAnLi4vY29yZS9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBjc3MsIHRoZW1lLCBjcmVhdGVTdHlsZWRFbGVtZW50IH0gZnJvbSAnLi4vdXRpbHMvc3R5bGVzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FyZE9wdGlvbnMgZXh0ZW5kcyBDb21wb25lbnRPcHRpb25zIHtcclxuICB0aXRsZT86IHN0cmluZztcclxuICBjb250ZW50Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XHJcbiAgZm9vdGVyPzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XHJcbiAgZWxldmF0ZWQ/OiBib29sZWFuO1xyXG4gIHBhZGRpbmc/OiAnbm9uZScgfCAnc20nIHwgJ21kJyB8ICdsZyc7XHJcbn1cclxuXHJcbmNvbnN0IGNhcmRCYXNlQ2xhc3MgPSBjc3NgXHJcbiAgYmFja2dyb3VuZDogJHt0aGVtZS5jb2xvcnMud2hpdGV9O1xyXG4gIGJvcmRlci1yYWRpdXM6ICR7dGhlbWUuYm9yZGVyUmFkaXVzLmxnfTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZTJlOGYwO1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgdHJhbnNpdGlvbjogYWxsICR7dGhlbWUudHJhbnNpdGlvbnMubm9ybWFsfTtcclxuYDtcclxuXHJcbmNvbnN0IGNhcmRFbGV2YXRlZENsYXNzID0gY3NzYFxyXG4gIGJveC1zaGFkb3c6ICR7dGhlbWUuc2hhZG93cy5sZ307XHJcbiAgXHJcbiAgJjpob3ZlciB7XHJcbiAgICBib3gtc2hhZG93OiAke3RoZW1lLnNoYWRvd3MueGx9O1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gIH1cclxuYDtcclxuXHJcbmNvbnN0IGNhcmRIZWFkZXJDbGFzcyA9IGNzc2BcclxuICBwYWRkaW5nOiAke3RoZW1lLnNwYWNpbmcubWR9ICR7dGhlbWUuc3BhY2luZy5sZ307XHJcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMmU4ZjA7XHJcbiAgYmFja2dyb3VuZDogJHt0aGVtZS5jb2xvcnMubGlnaHR9O1xyXG5gO1xyXG5cclxuY29uc3QgY2FyZFRpdGxlQ2xhc3MgPSBjc3NgXHJcbiAgbWFyZ2luOiAwO1xyXG4gIGZvbnQtc2l6ZTogMThweDtcclxuICBmb250LXdlaWdodDogNjAwO1xyXG4gIGNvbG9yOiAke3RoZW1lLmNvbG9ycy5kYXJrfTtcclxuYDtcclxuXHJcbmNvbnN0IGNhcmRCb2R5Q2xhc3MgPSBjc3NgXHJcbiAgcGFkZGluZzogJHt0aGVtZS5zcGFjaW5nLm1kfTtcclxuICBjb2xvcjogJHt0aGVtZS5jb2xvcnMuZGFya307XHJcbmA7XHJcblxyXG5jb25zdCBjYXJkQm9keVNtQ2xhc3MgPSBjc3NgXHJcbiAgcGFkZGluZzogJHt0aGVtZS5zcGFjaW5nLnNtfTtcclxuYDtcclxuXHJcbmNvbnN0IGNhcmRCb2R5TGdDbGFzcyA9IGNzc2BcclxuICBwYWRkaW5nOiAke3RoZW1lLnNwYWNpbmcubGd9O1xyXG5gO1xyXG5cclxuY29uc3QgY2FyZEJvZHlOb25lQ2xhc3MgPSBjc3NgXHJcbiAgcGFkZGluZzogMDtcclxuYDtcclxuXHJcbmNvbnN0IGNhcmRGb290ZXJDbGFzcyA9IGNzc2BcclxuICBwYWRkaW5nOiAke3RoZW1lLnNwYWNpbmcubWR9ICR7dGhlbWUuc3BhY2luZy5sZ307XHJcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNlMmU4ZjA7XHJcbiAgYmFja2dyb3VuZDogJHt0aGVtZS5jb2xvcnMubGlnaHR9O1xyXG5gO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhcmQgZXh0ZW5kcyBDb21wb25lbnQ8Q2FyZE9wdGlvbnM+IHtcclxuICBwcml2YXRlIGhlYWRlckVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIGJvZHlFbGVtZW50ITogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBmb290ZXJFbGVtZW50PzogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIHByb3RlY3RlZCBjcmVhdGVFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHsgZWxldmF0ZWQgPSBmYWxzZSwgcGFkZGluZyA9ICdtZCcsIHRpdGxlLCBjb250ZW50LCBmb290ZXIgfSA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICBjb25zdCBjYXJkID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnZGl2JywgYCR7Y2FyZEJhc2VDbGFzc30gJHtlbGV2YXRlZCA/IGNhcmRFbGV2YXRlZENsYXNzIDogJyd9YCk7XHJcblxyXG4gICAgLy8gSGVhZGVyIChzZSB0aXZlciB0w610dWxvKVxyXG4gICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgIGNvbnN0IGhlYWRlckVsID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnZGl2JywgY2FyZEhlYWRlckNsYXNzKTtcclxuICAgICAgY29uc3QgdGl0bGVFbCA9IGNyZWF0ZVN0eWxlZEVsZW1lbnQoJ2gzJywgY2FyZFRpdGxlQ2xhc3MpO1xyXG4gICAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gdGl0bGU7XHJcbiAgICAgIGhlYWRlckVsLmFwcGVuZENoaWxkKHRpdGxlRWwpO1xyXG4gICAgICBjYXJkLmFwcGVuZENoaWxkKGhlYWRlckVsKTtcclxuICAgICAgdGhpcy5oZWFkZXJFbGVtZW50ID0gaGVhZGVyRWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQm9keVxyXG4gICAgY29uc3QgcGFkZGluZ0NsYXNzID0ge1xyXG4gICAgICBub25lOiBjYXJkQm9keU5vbmVDbGFzcyxcclxuICAgICAgc206IGNhcmRCb2R5U21DbGFzcyxcclxuICAgICAgbWQ6ICcnLFxyXG4gICAgICBsZzogY2FyZEJvZHlMZ0NsYXNzLFxyXG4gICAgfVtwYWRkaW5nXSB8fCAnJztcclxuICAgIFxyXG4gICAgdGhpcy5ib2R5RWxlbWVudCA9IGNyZWF0ZVN0eWxlZEVsZW1lbnQoJ2RpdicsIGAke2NhcmRCb2R5Q2xhc3N9ICR7cGFkZGluZ0NsYXNzfWApO1xyXG4gICAgaWYgKGNvbnRlbnQpIHtcclxuICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHRoaXMuYm9keUVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmJvZHlFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXJkLmFwcGVuZENoaWxkKHRoaXMuYm9keUVsZW1lbnQpO1xyXG5cclxuICAgIC8vIEZvb3RlciAoc2UgZm9ybmVjaWRvKVxyXG4gICAgaWYgKGZvb3Rlcikge1xyXG4gICAgICBjb25zdCBmb290ZXJFbCA9IGNyZWF0ZVN0eWxlZEVsZW1lbnQoJ2RpdicsIGNhcmRGb290ZXJDbGFzcyk7XHJcbiAgICAgIGlmICh0eXBlb2YgZm9vdGVyID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGZvb3RlckVsLmlubmVySFRNTCA9IGZvb3RlcjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb290ZXJFbC5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGNhcmQuYXBwZW5kQ2hpbGQoZm9vdGVyRWwpO1xyXG4gICAgICB0aGlzLmZvb3RlckVsZW1lbnQgPSBmb290ZXJFbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dWFsaXphIG8gdMOtdHVsbyBkbyBjYXJkXHJcbiAgICovXHJcbiAgc2V0VGl0bGUodGl0bGU6IHN0cmluZyk6IHRoaXMge1xyXG4gICAgaWYgKCF0aGlzLmhlYWRlckVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgaGVhZGVyRWwgPSBjcmVhdGVTdHlsZWRFbGVtZW50KCdkaXYnLCBjYXJkSGVhZGVyQ2xhc3MpO1xyXG4gICAgICBjb25zdCB0aXRsZUVsID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnaDMnLCBjYXJkVGl0bGVDbGFzcyk7XHJcbiAgICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSB0aXRsZTtcclxuICAgICAgaGVhZGVyRWwuYXBwZW5kQ2hpbGQodGl0bGVFbCk7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5pbnNlcnRCZWZvcmUoaGVhZGVyRWwsIHRoaXMuYm9keUVsZW1lbnQpO1xyXG4gICAgICB0aGlzLmhlYWRlckVsZW1lbnQgPSBoZWFkZXJFbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHRpdGxlRWwgPSB0aGlzLmhlYWRlckVsZW1lbnQucXVlcnlTZWxlY3RvcignaDMnKTtcclxuICAgICAgaWYgKHRpdGxlRWwpIHRpdGxlRWwudGV4dENvbnRlbnQgPSB0aXRsZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXR1YWxpemEgbyBjb250ZcO6ZG8gZG8gYm9keVxyXG4gICAqL1xyXG4gIHNldEJvZHkoY29udGVudDogc3RyaW5nIHwgSFRNTEVsZW1lbnQpOiB0aGlzIHtcclxuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5ib2R5RWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ib2R5RWxlbWVudC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgdGhpcy5ib2R5RWxlbWVudC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXR1YWxpemEgbyBmb290ZXJcclxuICAgKi9cclxuICBzZXRGb290ZXIoZm9vdGVyOiBzdHJpbmcgfCBIVE1MRWxlbWVudCk6IHRoaXMge1xyXG4gICAgaWYgKCF0aGlzLmZvb3RlckVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgbmV3Rm9vdGVyID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnZGl2JywgY2FyZEZvb3RlckNsYXNzKTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG5ld0Zvb3Rlcik7XHJcbiAgICAgIHRoaXMuZm9vdGVyRWxlbWVudCA9IG5ld0Zvb3RlcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gTm9uLW51bGwgYXNzZXJ0aW9uOiBnYXJhbnRpZG8gcXVlIGZvb3RlckVsZW1lbnQgZXhpc3RlIGFww7NzIG8gaWYgYWNpbWFcclxuICAgIGNvbnN0IGZvb3RlckVsZW1lbnQgPSB0aGlzLmZvb3RlckVsZW1lbnQhO1xyXG4gICAgaWYgKHR5cGVvZiBmb290ZXIgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGZvb3RlckVsZW1lbnQuaW5uZXJIVE1MID0gZm9vdGVyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9vdGVyRWxlbWVudC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgZm9vdGVyRWxlbWVudC5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgbyBmb290ZXJcclxuICAgKi9cclxuICByZW1vdmVGb290ZXIoKTogdGhpcyB7XHJcbiAgICBpZiAodGhpcy5mb290ZXJFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuZm9vdGVyRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgdGhpcy5mb290ZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXRvcm5hIG8gZWxlbWVudG8gYm9keSBwYXJhIG1hbmlwdWxhw6fDo28gZGlyZXRhXHJcbiAgICovXHJcbiAgZ2V0Qm9keSgpOiBIVE1MRWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5ib2R5RWxlbWVudDtcclxuICB9XHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiBNb2RhbCBQcmluY2lwYWwgZG8gUG9wU1VTXHJcbiAqIFxyXG4gKiBNb2RhbCBjdXN0b21pemFkbyBxdWUgcGVybWl0ZSBhZGljaW9uYXIgY29tcG9uZW50ZXMgbm8gYm9keVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvY29tcG9uZW50JztcclxuaW1wb3J0IHsgY3NzLCB0aGVtZSwgY3JlYXRlU3R5bGVkRWxlbWVudCB9IGZyb20gJy4uL3V0aWxzL3N0eWxlcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1vZGFsT3B0aW9ucyBleHRlbmRzIENvbXBvbmVudE9wdGlvbnMge1xyXG4gIHRpdGxlPzogc3RyaW5nO1xyXG4gIHNob3dDbG9zZUJ1dHRvbj86IGJvb2xlYW47XHJcbiAgY2xvc2VPbkJhY2tkcm9wPzogYm9vbGVhbjtcclxuICBjbG9zZU9uRXNjPzogYm9vbGVhbjtcclxuICBvbkNsb3NlPzogKCkgPT4gdm9pZDtcclxuICB3aWR0aD86IHN0cmluZztcclxufVxyXG5cclxuLy8gT3ZlcmxheSAoYmFja2Ryb3ApXHJcbmNvbnN0IG92ZXJsYXlDbGFzcyA9IGNzc2BcclxuICBkaXNwbGF5OiBub25lO1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICB0b3A6IDA7XHJcbiAgbGVmdDogMDtcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjUpO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgei1pbmRleDogJHt0aGVtZS56SW5kZXgubW9kYWx9O1xyXG4gIG9wYWNpdHk6IDA7XHJcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAke3RoZW1lLnRyYW5zaXRpb25zLm5vcm1hbH07XHJcbiAgXHJcbiAgJi5hY3RpdmUge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgfVxyXG5gO1xyXG5cclxuLy8gTW9kYWwgY29udGVudFxyXG5jb25zdCBtb2RhbENvbnRlbnRDbGFzcyA9IGNzc2BcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3RoZW1lLmNvbG9ycy53aGl0ZX07XHJcbiAgYm9yZGVyLXJhZGl1czogJHt0aGVtZS5ib3JkZXJSYWRpdXMubGd9O1xyXG4gIGJveC1zaGFkb3c6ICR7dGhlbWUuc2hhZG93cy54bH07XHJcbiAgd2lkdGg6IDkwJTtcclxuICBtYXgtd2lkdGg6IDYwMHB4O1xyXG4gIG1heC1oZWlnaHQ6IDkwdmg7XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIHRyYW5zZm9ybTogc2NhbGUoMC43KTtcclxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gJHt0aGVtZS50cmFuc2l0aW9ucy5ub3JtYWx9O1xyXG4gIFxyXG4gIC5hY3RpdmUgJiB7XHJcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xyXG4gIH1cclxuYDtcclxuXHJcbi8vIEhlYWRlclxyXG5jb25zdCBtb2RhbEhlYWRlckNsYXNzID0gY3NzYFxyXG4gIHBhZGRpbmc6ICR7dGhlbWUuc3BhY2luZy5sZ307XHJcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNWU3ZWI7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAke3RoZW1lLmNvbG9ycy5wcmltYXJ5fSAwJSwgIzI1NjNlYiAxMDAlKTtcclxuICBib3JkZXItcmFkaXVzOiAke3RoZW1lLmJvcmRlclJhZGl1cy5sZ30gJHt0aGVtZS5ib3JkZXJSYWRpdXMubGd9IDAgMDtcclxuYDtcclxuXHJcbmNvbnN0IG1vZGFsVGl0bGVDbGFzcyA9IGNzc2BcclxuICBtYXJnaW46IDA7XHJcbiAgZm9udC1zaXplOiAyNHB4O1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgY29sb3I6ICR7dGhlbWUuY29sb3JzLndoaXRlfTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAke3RoZW1lLnNwYWNpbmcuc219O1xyXG5gO1xyXG5cclxuY29uc3QgY2xvc2VCdXR0b25DbGFzcyA9IGNzc2BcclxuICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gIGJvcmRlcjogbm9uZTtcclxuICBjb2xvcjogJHt0aGVtZS5jb2xvcnMud2hpdGV9O1xyXG4gIGZvbnQtc2l6ZTogMjhweDtcclxuICBmb250LXdlaWdodDogYm9sZDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgcGFkZGluZzogMDtcclxuICB3aWR0aDogMzJweDtcclxuICBoZWlnaHQ6IDMycHg7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGJvcmRlci1yYWRpdXM6ICR7dGhlbWUuYm9yZGVyUmFkaXVzLnNtfTtcclxuICB0cmFuc2l0aW9uOiBhbGwgJHt0aGVtZS50cmFuc2l0aW9ucy5mYXN0fTtcclxuICBcclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTtcclxuICB9XHJcbiAgXHJcbiAgJjphY3RpdmUge1xyXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpIHNjYWxlKDAuOTUpO1xyXG4gIH1cclxuYDtcclxuXHJcbi8vIEJvZHlcclxuY29uc3QgbW9kYWxCb2R5Q2xhc3MgPSBjc3NgXHJcbiAgcGFkZGluZzogJHt0aGVtZS5zcGFjaW5nLmxnfTtcclxuICBmbGV4OiAxO1xyXG4gIG92ZXJmbG93LXk6IGF1dG87XHJcbmA7XHJcblxyXG4vLyBGb290ZXJcclxuY29uc3QgbW9kYWxGb290ZXJDbGFzcyA9IGNzc2BcclxuICBwYWRkaW5nOiAke3RoZW1lLnNwYWNpbmcubGd9O1xyXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZTVlN2ViO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZ2FwOiAke3RoZW1lLnNwYWNpbmcubWR9O1xyXG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcclxuICBib3JkZXItcmFkaXVzOiAwIDAgJHt0aGVtZS5ib3JkZXJSYWRpdXMubGd9ICR7dGhlbWUuYm9yZGVyUmFkaXVzLmxnfTtcclxuYDtcclxuXHJcbmV4cG9ydCBjbGFzcyBNb2RhbCBleHRlbmRzIENvbXBvbmVudDxNb2RhbE9wdGlvbnM+IHtcclxuICBwcml2YXRlIG92ZXJsYXlFbGVtZW50ITogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBtb2RhbENvbnRlbnRFbGVtZW50ITogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBoZWFkZXJFbGVtZW50PzogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBib2R5RWxlbWVudCE6IEhUTUxFbGVtZW50O1xyXG4gIHByaXZhdGUgZm9vdGVyRWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG4gIHByaXZhdGUgZXNjSGFuZGxlcj86IChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgYmFja2Ryb3BDbGlja0hhbmRsZXI/OiAoZTogRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gIHByb3RlY3RlZCBjcmVhdGVFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgdGl0bGUsXHJcbiAgICAgIHNob3dDbG9zZUJ1dHRvbiA9IHRydWUsXHJcbiAgICAgIGNsb3NlT25CYWNrZHJvcCA9IHRydWUsXHJcbiAgICAgIHdpZHRoLFxyXG4gICAgfSA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAvLyBDcmlhciBvdmVybGF5XHJcbiAgICB0aGlzLm92ZXJsYXlFbGVtZW50ID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnZGl2Jywgb3ZlcmxheUNsYXNzKTtcclxuXHJcbiAgICAvLyBDcmlhciBtb2RhbCBjb250ZW50XHJcbiAgICB0aGlzLm1vZGFsQ29udGVudEVsZW1lbnQgPSBjcmVhdGVTdHlsZWRFbGVtZW50KCdkaXYnLCBtb2RhbENvbnRlbnRDbGFzcyk7XHJcbiAgICBpZiAod2lkdGgpIHtcclxuICAgICAgdGhpcy5tb2RhbENvbnRlbnRFbGVtZW50LnN0eWxlLm1heFdpZHRoID0gd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGVhZGVyXHJcbiAgICBpZiAodGl0bGUgfHwgc2hvd0Nsb3NlQnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVyRWxlbWVudCA9IGNyZWF0ZVN0eWxlZEVsZW1lbnQoJ2RpdicsIG1vZGFsSGVhZGVyQ2xhc3MpO1xyXG5cclxuICAgICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgICAgY29uc3QgdGl0bGVFbCA9IGNyZWF0ZVN0eWxlZEVsZW1lbnQoJ2gyJywgbW9kYWxUaXRsZUNsYXNzKTtcclxuICAgICAgICB0aXRsZUVsLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMuaGVhZGVyRWxlbWVudC5hcHBlbmRDaGlsZCh0aXRsZUVsKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNob3dDbG9zZUJ1dHRvbikge1xyXG4gICAgICAgIGNvbnN0IGNsb3NlQnRuID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnYnV0dG9uJywgY2xvc2VCdXR0b25DbGFzcyk7XHJcbiAgICAgICAgY2xvc2VCdG4uaW5uZXJIVE1MID0gJyZ0aW1lczsnO1xyXG4gICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5jbG9zZSgpKTtcclxuICAgICAgICB0aGlzLmhlYWRlckVsZW1lbnQuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm1vZGFsQ29udGVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5oZWFkZXJFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBCb2R5XHJcbiAgICB0aGlzLmJvZHlFbGVtZW50ID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnZGl2JywgbW9kYWxCb2R5Q2xhc3MpO1xyXG4gICAgdGhpcy5tb2RhbENvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYm9keUVsZW1lbnQpO1xyXG5cclxuICAgIC8vIEFkaWNpb25hciBtb2RhbCBjb250ZW50IGFvIG92ZXJsYXlcclxuICAgIHRoaXMub3ZlcmxheUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tb2RhbENvbnRlbnRFbGVtZW50KTtcclxuXHJcbiAgICAvLyBGZWNoYXIgYW8gY2xpY2FyIG5vIGJhY2tkcm9wXHJcbiAgICBpZiAoY2xvc2VPbkJhY2tkcm9wKSB7XHJcbiAgICAgIHRoaXMuYmFja2Ryb3BDbGlja0hhbmRsZXIgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcy5vdmVybGF5RWxlbWVudCkge1xyXG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgdGhpcy5vdmVybGF5RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYmFja2Ryb3BDbGlja0hhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm92ZXJsYXlFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIG9uTW91bnQoKTogdm9pZCB7XHJcbiAgICAvLyBFU0MgcGFyYSBmZWNoYXJcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VPbkVzYyAhPT0gZmFsc2UpIHtcclxuICAgICAgdGhpcy5lc2NIYW5kbGVyID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnICYmIHRoaXMuaXNPcGVuKCkpIHtcclxuICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmVzY0hhbmRsZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIG9uVW5tb3VudCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmVzY0hhbmRsZXIpIHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuZXNjSGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5iYWNrZHJvcENsaWNrSGFuZGxlcikge1xyXG4gICAgICB0aGlzLm92ZXJsYXlFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5iYWNrZHJvcENsaWNrSGFuZGxlcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBYnJlIG8gbW9kYWxcclxuICAgKi9cclxuICBvcGVuKCk6IHRoaXMge1xyXG4gICAgdGhpcy5vdmVybGF5RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJzsgLy8gUHJldmVuaXIgc2Nyb2xsIGRvIGJvZHlcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmVjaGEgbyBtb2RhbFxyXG4gICAqL1xyXG4gIGNsb3NlKCk6IHRoaXMge1xyXG4gICAgdGhpcy5vdmVybGF5RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJzsgLy8gUmVzdGF1cmFyIHNjcm9sbCBkbyBib2R5XHJcbiAgICBcclxuICAgIGlmICh0aGlzLm9wdGlvbnMub25DbG9zZSkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMub25DbG9zZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWZXJpZmljYSBzZSBvIG1vZGFsIGVzdMOhIGFiZXJ0b1xyXG4gICAqL1xyXG4gIGlzT3BlbigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLm92ZXJsYXlFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgZG8gbW9kYWxcclxuICAgKi9cclxuICB0b2dnbGUoKTogdGhpcyB7XHJcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xyXG4gICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9wZW4oKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIG8gdMOtdHVsbyBkbyBtb2RhbFxyXG4gICAqL1xyXG4gIHNldFRpdGxlKHRpdGxlOiBzdHJpbmcpOiB0aGlzIHtcclxuICAgIGlmICh0aGlzLmhlYWRlckVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgdGl0bGVFbCA9IHRoaXMuaGVhZGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdoMicpO1xyXG4gICAgICBpZiAodGl0bGVFbCkge1xyXG4gICAgICAgIHRpdGxlRWwuaW5uZXJIVE1MID0gdGl0bGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRpY2lvbmEgY29udGXDumRvIGFvIGJvZHkgKHBvZGUgc2VyIHN0cmluZyBIVE1MIG91IENvbXBvbmVudClcclxuICAgKi9cclxuICBzZXRCb2R5KGNvbnRlbnQ6IHN0cmluZyB8IEhUTUxFbGVtZW50IHwgQ29tcG9uZW50PGFueT4pOiB0aGlzIHtcclxuICAgIHRoaXMuYm9keUVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBcclxuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5ib2R5RWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XHJcbiAgICAgIGNvbnRlbnQubW91bnQodGhpcy5ib2R5RWxlbWVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJvZHlFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGljaW9uYSB1bSBjb21wb25lbnRlIGFvIGJvZHkgKHNlbSBsaW1wYXIgbyBjb250ZcO6ZG8gYW50ZXJpb3IpXHJcbiAgICovXHJcbiAgYXBwZW5kVG9Cb2R5KGNvbnRlbnQ6IEhUTUxFbGVtZW50IHwgQ29tcG9uZW50PGFueT4pOiB0aGlzIHtcclxuICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XHJcbiAgICAgIGNvbnRlbnQubW91bnQodGhpcy5ib2R5RWxlbWVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJvZHlFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMaW1wYSBvIGJvZHlcclxuICAgKi9cclxuICBjbGVhckJvZHkoKTogdGhpcyB7XHJcbiAgICB0aGlzLmJvZHlFbGVtZW50LmlubmVySFRNTCA9ICcnO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmUgbyBmb290ZXIgY29tIGJvdMO1ZXNcclxuICAgKi9cclxuICBzZXRGb290ZXIoYnV0dG9uczogSFRNTEVsZW1lbnRbXSk6IHRoaXMge1xyXG4gICAgLy8gQ3JpYXIgZm9vdGVyIHNlIG7Do28gZXhpc3RpclxyXG4gICAgaWYgKCF0aGlzLmZvb3RlckVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5mb290ZXJFbGVtZW50ID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnZGl2JywgbW9kYWxGb290ZXJDbGFzcyk7XHJcbiAgICAgIHRoaXMubW9kYWxDb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmZvb3RlckVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExpbXBhciBlIGFkaWNpb25hciBib3TDtWVzXHJcbiAgICB0aGlzLmZvb3RlckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBidXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgdGhpcy5mb290ZXJFbGVtZW50IS5hcHBlbmRDaGlsZChidXR0b24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgbyBmb290ZXJcclxuICAgKi9cclxuICByZW1vdmVGb290ZXIoKTogdGhpcyB7XHJcbiAgICBpZiAodGhpcy5mb290ZXJFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuZm9vdGVyRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgdGhpcy5mb290ZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPYnTDqW0gbyBlbGVtZW50byBkbyBib2R5IHBhcmEgbWFuaXB1bGHDp8OjbyBkaXJldGFcclxuICAgKi9cclxuICBnZXRCb2R5KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLmJvZHlFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT2J0w6ltIG8gZWxlbWVudG8gZG8gZm9vdGVyIHBhcmEgbWFuaXB1bGHDp8OjbyBkaXJldGFcclxuICAgKi9cclxuICBnZXRGb290ZXIoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIHRoaXMuZm9vdGVyRWxlbWVudDtcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIE1vZGFsIFByaW5jaXBhbCBkbyBQb3BTVVNcclxuICogXHJcbiAqIEZhY3RvcnkgZnVuY3Rpb24gcGFyYSBjcmlhciBvIG1vZGFsIHByaW5jaXBhbCBkYSBhcGxpY2HDp8Ojb1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IE1vZGFsIH0gZnJvbSAnLi9Nb2RhbCc7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4vQnV0dG9uJztcclxuaW1wb3J0IHsgQ2FyZCB9IGZyb20gJy4vQ2FyZCc7XHJcbmltcG9ydCB7IEFsZXJ0IH0gZnJvbSAnLi4vdXRpbHMvc3dlZXRhbGVydCc7XHJcbmltcG9ydCB7IFxyXG4gIGVzdGFDb2xldGFuZG8sIFxyXG4gIHNldENhbGxiYWNrQXR1YWxpemFjYW9VSSwgXHJcbiAgc2V0Q2FsbGJhY2tTdGF0dXMsXHJcbiAgZm9ybWF0YXJUZW1wb1Jlc3RhbnRlIFxyXG59IGZyb20gJy4uL2FjdGlvbnMvY29sZXRhci1zYW5ndWUtc3RhdGUnO1xyXG5pbXBvcnQgeyBpbmljaWFyQ29sZXRhQXV0b21hdGljYVNhbmd1ZSwgcGFyYXJDb2xldGFBdXRvbWF0aWNhU2FuZ3VlIH0gZnJvbSAnLi4vYWN0aW9ucy9jb2xldGFyLXNhbmd1ZSc7XHJcblxyXG5pbnRlcmZhY2UgUG9wU1VTTW9kYWxDYWxsYmFja3Mge1xyXG4gIG9uQ3VyYXI/OiAoKSA9PiBQcm9taXNlPHZvaWQ+IHwgdm9pZDtcclxuICBvbkNvbGV0YXJTYW5ndWU/OiAoKSA9PiBQcm9taXNlPHZvaWQ+IHwgdm9pZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyaWEgZSByZXRvcm5hIG8gbW9kYWwgcHJpbmNpcGFsIGRvIFBvcFNVU1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBvcFNVU01vZGFsKGNhbGxiYWNrcz86IFBvcFNVU01vZGFsQ2FsbGJhY2tzKTogTW9kYWwge1xyXG4gIGNvbnN0IG1vZGFsID0gbmV3IE1vZGFsKHtcclxuICAgIHRpdGxlOiAn8J+PpSBQb3BTVVMnLFxyXG4gICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgY2xvc2VPbkJhY2tkcm9wOiB0cnVlLFxyXG4gICAgY2xvc2VPbkVzYzogdHJ1ZSxcclxuICAgIHdpZHRoOiAnNjAwcHgnLFxyXG4gIH0pO1xyXG5cclxuICAvLyBDcmlhciBjYXJkIGRlIGRlc2NyacOnw6NvXHJcbiAgY29uc3QgZGVzY3JpcHRpb25DYXJkID0gbmV3IENhcmQoe1xyXG4gICAgcGFkZGluZzogJ21kJyxcclxuICAgIGVsZXZhdGVkOiBmYWxzZSxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRpb25IVE1MID0gYFxyXG4gICAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGxlZnQ7XCI+XHJcbiAgICAgIFxyXG4gICAgICA8cCBzdHlsZT1cImZvbnQtc2l6ZTogMTVweDsgbGluZS1oZWlnaHQ6IDEuNjsgbWFyZ2luLWJvdHRvbTogMTZweDsgY29sb3I6ICMzNzQxNTE7XCI+XHJcbiAgICAgICAgTyA8c3Ryb25nPlBvcFNVUzwvc3Ryb25nPiDDqSB1bSBzY3JpcHQgY3JpYWRvIHBhcmEgZmFjaWxpdGFyIGEgPHN0cm9uZz5jdXJhIGRlIHBlcnNvbmFnZW5zIGRvZW50ZXM8L3N0cm9uZz4gXHJcbiAgICAgICAgbm8gUG9wbXVuZG8gZSBhdXhpbGlhciBuYSA8c3Ryb25nPmNvbGV0YSBkZSBzYW5ndWU8L3N0cm9uZz4gcGFyYSBvcyBjYcOnYWRvcmVzIGRlIHp1bWJpLlxyXG4gICAgICA8L3A+XHJcbiAgICAgIFxyXG4gICAgICA8aHIgc3R5bGU9XCJtYXJnaW46IDIwcHggMDsgYm9yZGVyOiBub25lOyBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTdlYjtcIj5cclxuICAgICAgXHJcbiAgICAgIDxwIHN0eWxlPVwiZm9udC1zaXplOiAxNHB4OyBjb2xvcjogIzZiNzI4MDsgbWFyZ2luLWJvdHRvbTogMDtcIj5cclxuICAgICAgICBTZWxlY2lvbmUgdW1hIGRhcyBvcMOnw7VlcyBhYmFpeG86XHJcbiAgICAgIDwvcD5cclxuICAgICAgPGltZyBzcmM9XCJodHRwczovL2kuaW1ndXIuY29tL0wyd3NZTWUucG5nXCIgYWx0PVwiUG9wU1VTXCIgc3R5bGU9XCJ3aWR0aDogOTBweDsgaGVpZ2h0OiBhdXRvOyBtYXJnaW4tYm90dG9tOiAxNnB4O1wiPlxyXG4gICAgPC9kaXY+XHJcbiAgYDtcclxuXHJcbiAgZGVzY3JpcHRpb25DYXJkLnNldEJvZHkoZGVzY3JpcHRpb25IVE1MKTtcclxuXHJcbiAgLy8gQ3JpYXIgY29udGFpbmVyIHBhcmEgdGltZXIgZGUgY29sZXRhIGF1dG9tw6F0aWNhXHJcbiAgY29uc3QgdGltZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICB0aW1lckNvbnRhaW5lci5pZCA9ICdwb3BzdXMtdGltZXItY29udGFpbmVyJztcclxuICB0aW1lckNvbnRhaW5lci5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgbWFyZ2luLXRvcDogMTZweDtcclxuICAgIHBhZGRpbmc6IDEycHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNmNGY2O1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICBgO1xyXG4gIFxyXG4gIGNvbnN0IHRpbWVyVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHRpbWVyVGV4dC5pZCA9ICdwb3BzdXMtdGltZXItdGV4dCc7XHJcbiAgdGltZXJUZXh0LnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBjb2xvcjogIzZiNzI4MDtcclxuICAgIG1hcmdpbi1ib3R0b206IDRweDtcclxuICBgO1xyXG4gIHRpbWVyVGV4dC50ZXh0Q29udGVudCA9ICdQcsOzeGltYSBjb2xldGEgZW06JztcclxuICBcclxuICBjb25zdCB0aW1lclZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdGltZXJWYWx1ZS5pZCA9ICdwb3BzdXMtdGltZXItdmFsdWUnO1xyXG4gIHRpbWVyVmFsdWUuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgY29sb3I6ICNkYzI2MjY7XHJcbiAgICBmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgbW9ub3NwYWNlO1xyXG4gIGA7XHJcbiAgdGltZXJWYWx1ZS50ZXh0Q29udGVudCA9ICcwMDowMCc7XHJcbiAgXHJcbiAgdGltZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGltZXJUZXh0KTtcclxuICB0aW1lckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aW1lclZhbHVlKTtcclxuXHJcbiAgLy8gQWRpY2lvbmFyIHRpbWVyIGFvIGNhcmQgZGUgZGVzY3Jpw6fDo29cclxuICBkZXNjcmlwdGlvbkNhcmQuZ2V0RWxlbWVudCgpLmFwcGVuZENoaWxkKHRpbWVyQ29udGFpbmVyKTtcclxuXHJcbiAgLy8gQWRpY2lvbmFyIGNhcmQgYW8gbW9kYWxcclxuICBtb2RhbC5zZXRCb2R5KGRlc2NyaXB0aW9uQ2FyZCk7XHJcblxyXG4gIC8vIENyaWFyIGJvdMO1ZXMgcHJpbWVpcm8gKGFudGVzIGRlIHVzYXIgbm9zIGNhbGxiYWNrcylcclxuICBjb25zdCBjdXJhckJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgdGV4dDogJ/CfkokgQ3VyYXInLFxyXG4gICAgdmFyaWFudDogJ3N1Y2Nlc3MnLFxyXG4gICAgc2l6ZTogJ21kJyxcclxuICAgIG9uQ2xpY2s6IGFzeW5jICgpID0+IHtcclxuICAgICAgaWYgKGNhbGxiYWNrcz8ub25DdXJhcikge1xyXG4gICAgICAgIGN1cmFyQnV0dG9uLnNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGF3YWl0IGNhbGxiYWNrcy5vbkN1cmFyKCk7XHJcbiAgICAgICAgICBBbGVydC50b2FzdFN1Y2Nlc3MoJ1BlcnNvbmFnZW0gY3VyYWRvIGNvbSBzdWNlc3NvIScpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvIGFvIGN1cmFyOicsIGVycm9yKTtcclxuICAgICAgICAgIC8vIE8gZXJybyBqw6Egw6kgdHJhdGFkbyBkZW50cm8gZGEgZnVuw6fDo28gY3VyYXJQZXJzb25hZ2VtXHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgIGN1cmFyQnV0dG9uLnNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgY29sZXRhckJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgdGV4dDogJ/CfqbggQ29sZXRhciBTYW5ndWUnLFxyXG4gICAgdmFyaWFudDogJ2RhbmdlcicsXHJcbiAgICBzaXplOiAnbWQnLFxyXG4gICAgb25DbGljazogYXN5bmMgKCkgPT4ge1xyXG4gICAgICBpZiAoZXN0YUNvbGV0YW5kbygpKSB7XHJcbiAgICAgICAgLy8gU2UgasOhIGVzdMOhIGNvbGV0YW5kbywgcGFyYXJcclxuICAgICAgICBwYXJhckNvbGV0YUF1dG9tYXRpY2FTYW5ndWUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBTZSBuw6NvIGVzdMOhIGNvbGV0YW5kbywgaW5pY2lhciBjb2xldGEgYXV0b23DoXRpY2FcclxuICAgICAgICBpbmljaWFyQ29sZXRhQXV0b21hdGljYVNhbmd1ZSgpO1xyXG4gICAgICAgIC8vIEF0dWFsaXphciBVSSBpbWVkaWF0YW1lbnRlXHJcbiAgICAgICAgYXR1YWxpemFyU3RhdHVzQm90YW8odHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIC8vIEZ1bsOnw6NvIHBhcmEgYXR1YWxpemFyIG8gdGltZXJcclxuICBjb25zdCBhdHVhbGl6YXJUaW1lciA9ICh0ZW1wb1Jlc3RhbnRlOiBudW1iZXIpID0+IHtcclxuICAgIGlmIChlc3RhQ29sZXRhbmRvKCkpIHtcclxuICAgICAgdGltZXJDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgIHRpbWVyVmFsdWUudGV4dENvbnRlbnQgPSBmb3JtYXRhclRlbXBvUmVzdGFudGUodGVtcG9SZXN0YW50ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aW1lckNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIEZ1bsOnw6NvIHBhcmEgYXR1YWxpemFyIG8gc3RhdHVzIGRvIGJvdMOjb1xyXG4gIGNvbnN0IGF0dWFsaXphclN0YXR1c0JvdGFvID0gKGNvbGV0YW5kbzogYm9vbGVhbikgPT4ge1xyXG4gICAgaWYgKGNvbGV0YW5kbykge1xyXG4gICAgICBjb2xldGFyQnV0dG9uLnNldFRleHQoJ+KPuO+4jyBQYXJhciBDb2xldGEnKTtcclxuICAgICAgY29sZXRhckJ1dHRvbi5zZXRWYXJpYW50KCd3YXJuaW5nJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb2xldGFyQnV0dG9uLnNldFRleHQoJ/CfqbggQ29sZXRhciBTYW5ndWUnKTtcclxuICAgICAgY29sZXRhckJ1dHRvbi5zZXRWYXJpYW50KCdkYW5nZXInKTtcclxuICAgICAgdGltZXJDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBSZWdpc3RyYXIgY2FsbGJhY2tzXHJcbiAgc2V0Q2FsbGJhY2tBdHVhbGl6YWNhb1VJKGF0dWFsaXphclRpbWVyKTtcclxuICBzZXRDYWxsYmFja1N0YXR1cyhhdHVhbGl6YXJTdGF0dXNCb3Rhbyk7XHJcblxyXG4gIC8vIFZlcmlmaWNhciBlc3RhZG8gaW5pY2lhbFxyXG4gIGlmIChlc3RhQ29sZXRhbmRvKCkpIHtcclxuICAgIGF0dWFsaXphclN0YXR1c0JvdGFvKHRydWUpO1xyXG4gICAgYXR1YWxpemFyVGltZXIoMCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gTW9udGFyIG9zIGJvdMO1ZXMgYW50ZXMgZGUgYWRpY2lvbmFyIGFvIGZvb3RlciBwYXJhIGdhcmFudGlyIHF1ZSBvcyBldmVudCBsaXN0ZW5lcnMgc2VqYW0gcmVnaXN0cmFkb3NcclxuICAvLyBDcmlhciB1bSBjb250YWluZXIgdGVtcG9yw6FyaW8gcGFyYSBtb250YXIgb3MgYm90w7Vlc1xyXG4gIGNvbnN0IHRlbXBDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICB0ZW1wQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZW1wQ29udGFpbmVyKTtcclxuXHJcbiAgY3VyYXJCdXR0b24ubW91bnQodGVtcENvbnRhaW5lcik7XHJcbiAgY29sZXRhckJ1dHRvbi5tb3VudCh0ZW1wQ29udGFpbmVyKTtcclxuXHJcbiAgLy8gQWRpY2lvbmFyIGJvdMO1ZXMgYW8gZm9vdGVyXHJcbiAgbW9kYWwuc2V0Rm9vdGVyKFtcclxuICAgIGN1cmFyQnV0dG9uLmdldEVsZW1lbnQoKSxcclxuICAgIGNvbGV0YXJCdXR0b24uZ2V0RWxlbWVudCgpLFxyXG4gIF0pO1xyXG5cclxuICAvLyBSZW1vdmVyIGNvbnRhaW5lciB0ZW1wb3LDoXJpbyAob3MgZWxlbWVudG9zIGrDoSBmb3JhbSBtb3ZpZG9zIHBhcmEgbyBmb290ZXIpXHJcbiAgdGVtcENvbnRhaW5lci5yZW1vdmUoKTtcclxuXHJcbiAgcmV0dXJuIG1vZGFsO1xyXG59XHJcblxyXG4vKipcclxuICogTW9zdHJhIG8gbW9kYWwgcHJpbmNpcGFsIGRvIFBvcFNVU1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNob3dQb3BTVVNNb2RhbChjYWxsYmFja3M/OiBQb3BTVVNNb2RhbENhbGxiYWNrcyk6IE1vZGFsIHtcclxuICBjb25zdCBtb2RhbCA9IGNyZWF0ZVBvcFNVU01vZGFsKGNhbGxiYWNrcyk7XHJcbiAgXHJcbiAgLy8gTW9udGFyIG5vIGJvZHkgZG8gZG9jdW1lbnRvIChmb3JhIGRvIFNoYWRvdyBET00gcGFyYSBjb2JyaXIgdG9kYSBhIHDDoWdpbmEpXHJcbiAgbW9kYWwubW91bnQoZG9jdW1lbnQuYm9keSk7XHJcbiAgXHJcbiAgLy8gQWJyaXIgbyBtb2RhbFxyXG4gIG1vZGFsLm9wZW4oKTtcclxuXHJcbiAgcmV0dXJuIG1vZGFsO1xyXG59XHJcblxyXG4iLCIvKipcclxuICogQ29tcG9uZW50ZSBQb3BTVVNcclxuICogXHJcbiAqIExpbmsgc2ltcGxlcyBxdWUgYWJyZSB1bSBtb2RhbCBxdWFuZG8gY2xpY2Fkb1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvY29tcG9uZW50JztcclxuaW1wb3J0IHsgY3NzLCB0aGVtZSwgY3JlYXRlU3R5bGVkRWxlbWVudCB9IGZyb20gJy4uL3V0aWxzL3N0eWxlcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBvcFNVU09wdGlvbnMgZXh0ZW5kcyBDb21wb25lbnRPcHRpb25zIHtcclxuICB0ZXh0Pzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAoKSA9PiB2b2lkO1xyXG59XHJcblxyXG5jb25zdCBsaW5rQ2xhc3MgPSBjc3NgXHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIGNvbG9yOiAke3RoZW1lLmNvbG9ycy5wcmltYXJ5fTtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgcGFkZGluZzogJHt0aGVtZS5zcGFjaW5nLnhzfSAke3RoZW1lLnNwYWNpbmcuc219O1xyXG4gIGJvcmRlci1yYWRpdXM6ICR7dGhlbWUuYm9yZGVyUmFkaXVzLnNtfTtcclxuICB0cmFuc2l0aW9uOiBhbGwgJHt0aGVtZS50cmFuc2l0aW9ucy5mYXN0fTtcclxuICBcclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQ6ICR7dGhlbWUuY29sb3JzLmxpZ2h0fTtcclxuICAgIGNvbG9yOiAke3RoZW1lLmNvbG9ycy5wcmltYXJ5fTtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gIH1cclxuICBcclxuICAmOmFjdGl2ZSB7XHJcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTgpO1xyXG4gIH1cclxuYDtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb3BTVVMgZXh0ZW5kcyBDb21wb25lbnQ8UG9wU1VTT3B0aW9ucz4ge1xyXG4gIHByaXZhdGUgY2xpY2tIYW5kbGVyPzogKGU6IEV2ZW50KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUga2V5ZG93bkhhbmRsZXI/OiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgcHJvdGVjdGVkIGNyZWF0ZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgeyB0ZXh0ID0gJ1BvcFNVUycgfSA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICBjb25zdCBsaW5rID0gY3JlYXRlU3R5bGVkRWxlbWVudCgnYScsIGxpbmtDbGFzcyk7XHJcbiAgICBsaW5rLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIFxyXG4gICAgLy8gUHJldmVuaXIgY29tcG9ydGFtZW50byBwYWRyw6NvIGRvIGxpbmtcclxuICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2J1dHRvbicpO1xyXG4gICAgbGluay5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcclxuXHJcbiAgICByZXR1cm4gbGluaztcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBvbk1vdW50KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5vbkNsaWNrKSB7XHJcbiAgICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkNsaWNrISgpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlciBhcyBFdmVudExpc3RlbmVyKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFN1cG9ydGUgcGFyYSB0ZWNsYWRvIChFbnRlci9TcGFjZSlcclxuICAgICAgdGhpcy5rZXlkb3duSGFuZGxlciA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkNsaWNrISgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleWRvd25IYW5kbGVyIGFzIEV2ZW50TGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIG9uVW5tb3VudCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmNsaWNrSGFuZGxlcikge1xyXG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlciBhcyBFdmVudExpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmtleWRvd25IYW5kbGVyKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlkb3duSGFuZGxlciBhcyBFdmVudExpc3RlbmVyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dWFsaXphIG8gdGV4dG8gZG8gbGlua1xyXG4gICAqL1xyXG4gIHNldFRleHQodGV4dDogc3RyaW5nKTogdGhpcyB7XHJcbiAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG4iLCIvKipcclxuICogRXhwb3J0YcOnw7VlcyBjZW50cmFsaXphZGFzIGRlIGNvbXBvbmVudGVzXHJcbiAqL1xyXG5cclxuZXhwb3J0IHsgQnV0dG9uLCBCdXR0b25PcHRpb25zIH0gZnJvbSAnLi9CdXR0b24nO1xyXG5leHBvcnQgeyBDYXJkLCBDYXJkT3B0aW9ucyB9IGZyb20gJy4vQ2FyZCc7XHJcbmV4cG9ydCB7IFBvcFNVUywgUG9wU1VTT3B0aW9ucyB9IGZyb20gJy4vUG9wU1VTJztcclxuZXhwb3J0IHsgTW9kYWwsIE1vZGFsT3B0aW9ucyB9IGZyb20gJy4vTW9kYWwnO1xyXG5cclxuLy8gTW9kYWwgcHJpbmNpcGFsIGRvIFBvcFNVU1xyXG5leHBvcnQgeyBjcmVhdGVQb3BTVVNNb2RhbCwgc2hvd1BvcFNVU01vZGFsIH0gZnJvbSAnLi9Nb2RhbFBvcFNVUyc7XHJcblxyXG4iLCIvKipcclxuICogU2lzdGVtYSBiYXNlIGRlIGNvbXBvbmVudGVzIHBhcmEgdXNlcnNjcmlwdHNcclxuICogXHJcbiAqIEZvcm5lY2UgdW1hIGNsYXNzZSBiYXNlIHBhcmEgY3JpYXIgY29tcG9uZW50ZXMgcmV1dGlsaXrDoXZlaXNcclxuICogcXVlIGZ1bmNpb25hbSBkZW50cm8gZG8gU2hhZG93IERPTS5cclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudE9wdGlvbnMge1xyXG4gIGNsYXNzTmFtZT86IHN0cmluZztcclxuICBpZD86IHN0cmluZztcclxuICBzdHlsZXM/OiBzdHJpbmc7XHJcbiAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50T3B0aW9ucyA9IENvbXBvbmVudE9wdGlvbnM+IHtcclxuICBwcm90ZWN0ZWQgZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgcHJvdGVjdGVkIG9wdGlvbnM6IFQ7XHJcbiAgcHJpdmF0ZSBtb3VudGVkID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFQgPSB7fSBhcyBUKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgdGhpcy5lbGVtZW50ID0gdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcbiAgICB0aGlzLmFwcGx5QmFzZVN0eWxlcygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTcOpdG9kbyBhYnN0cmF0byBxdWUgZGV2ZSBzZXIgaW1wbGVtZW50YWRvIHBlbG9zIGNvbXBvbmVudGVzXHJcbiAgICogcGFyYSBjcmlhciBvIGVsZW1lbnRvIEhUTUwgYmFzZVxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBjcmVhdGVFbGVtZW50KCk6IEhUTUxFbGVtZW50O1xyXG5cclxuICAvKipcclxuICAgKiBNw6l0b2RvIGNoYW1hZG8gYXDDs3MgbyBjb21wb25lbnRlIHNlciBtb250YWRvIG5vIERPTVxyXG4gICAqIMOadGlsIHBhcmEgZXZlbnQgbGlzdGVuZXJzLCBpbmljaWFsaXphw6fDtWVzLCBldGMuXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIG9uTW91bnQoKTogdm9pZCB7XHJcbiAgICAvLyBJbXBsZW1lbnRhw6fDo28gb3BjaW9uYWwgcGVsb3MgY29tcG9uZW50ZXMgZmlsaG9zXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNw6l0b2RvIGNoYW1hZG8gYW50ZXMgZG8gY29tcG9uZW50ZSBzZXIgZGVzbW9udGFkb1xyXG4gICAqIMOadGlsIHBhcmEgY2xlYW51cCwgcmVtb3ZlciBsaXN0ZW5lcnMsIGV0Yy5cclxuICAgKi9cclxuICBwcm90ZWN0ZWQgb25Vbm1vdW50KCk6IHZvaWQge1xyXG4gICAgLy8gSW1wbGVtZW50YcOnw6NvIG9wY2lvbmFsIHBlbG9zIGNvbXBvbmVudGVzIGZpbGhvc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXBsaWNhIGVzdGlsb3MgYmFzZSBhbyBlbGVtZW50b1xyXG4gICAqL1xyXG4gIHByaXZhdGUgYXBwbHlCYXNlU3R5bGVzKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jbGFzc05hbWUpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMub3B0aW9ucy5jbGFzc05hbWU7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmlkKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5pZCA9IHRoaXMub3B0aW9ucy5pZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldG9ybmEgbyBlbGVtZW50byBIVE1MIGRvIGNvbXBvbmVudGVcclxuICAgKi9cclxuICBnZXRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb250YSBvIGNvbXBvbmVudGUgZW0gdW0gZWxlbWVudG8gcGFpXHJcbiAgICovXHJcbiAgbW91bnQocGFyZW50OiBIVE1MRWxlbWVudCk6IHRoaXMge1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XHJcbiAgICBpZiAoIXRoaXMubW91bnRlZCkge1xyXG4gICAgICB0aGlzLm1vdW50ZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLm9uTW91bnQoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVzbW9udGEgbyBjb21wb25lbnRlXHJcbiAgICovXHJcbiAgdW5tb3VudCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLm1vdW50ZWQpIHtcclxuICAgICAgdGhpcy5vblVubW91bnQoKTtcclxuICAgICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc3Ryw7NpIG8gY29tcG9uZW50ZSBjb21wbGV0YW1lbnRlXHJcbiAgICovXHJcbiAgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMudW5tb3VudCgpO1xyXG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXR1YWxpemEgbyBjb250ZcO6ZG8gSFRNTCBpbnRlcm5vIGRvIGNvbXBvbmVudGVcclxuICAgKi9cclxuICBzZXRDb250ZW50KGNvbnRlbnQ6IHN0cmluZyB8IEhUTUxFbGVtZW50KTogdGhpcyB7XHJcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkaWNpb25hIGNvbnRlw7pkbyBhbyBjb21wb25lbnRlXHJcbiAgICovXHJcbiAgYXBwZW5kKGNvbnRlbnQ6IHN0cmluZyB8IEhUTUxFbGVtZW50IHwgQ29tcG9uZW50KTogdGhpcyB7XHJcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGNvbnRlbnQpO1xyXG4gICAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjb250ZW50LmdldEVsZW1lbnQoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkaWNpb25hIHVtIGV2ZW50IGxpc3RlbmVyIGFvIGVsZW1lbnRvXHJcbiAgICovXHJcbiAgb248SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXA+KFxyXG4gICAgZXZlbnQ6IEssXHJcbiAgICBoYW5kbGVyOiAodGhpczogSFRNTEVsZW1lbnQsIGV2OiBIVE1MRWxlbWVudEV2ZW50TWFwW0tdKSA9PiB2b2lkLFxyXG4gICAgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9uc1xyXG4gICk6IHRoaXMge1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIgYXMgRXZlbnRMaXN0ZW5lciwgb3B0aW9ucyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSB1bSBldmVudCBsaXN0ZW5lciBkbyBlbGVtZW50b1xyXG4gICAqL1xyXG4gIG9mZjxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRFdmVudE1hcD4oXHJcbiAgICBldmVudDogSyxcclxuICAgIGhhbmRsZXI6ICh0aGlzOiBIVE1MRWxlbWVudCwgZXY6IEhUTUxFbGVtZW50RXZlbnRNYXBbS10pID0+IHZvaWQsXHJcbiAgICBvcHRpb25zPzogYm9vbGVhbiB8IEV2ZW50TGlzdGVuZXJPcHRpb25zXHJcbiAgKTogdGhpcyB7XHJcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciBhcyBFdmVudExpc3RlbmVyLCBvcHRpb25zKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW9zdHJhIG8gY29tcG9uZW50ZVxyXG4gICAqL1xyXG4gIHNob3coKTogdGhpcyB7XHJcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFc2NvbmRlIG8gY29tcG9uZW50ZVxyXG4gICAqL1xyXG4gIGhpZGUoKTogdGhpcyB7XHJcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIHZpc2liaWxpZGFkZSBkbyBjb21wb25lbnRlXHJcbiAgICovXHJcbiAgdG9nZ2xlKCk6IHRoaXMge1xyXG4gICAgaWYgKHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHtcclxuICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRpY2lvbmEgdW1hIGNsYXNzZSBDU1NcclxuICAgKi9cclxuICBhZGRDbGFzcyhjbGFzc05hbWU6IHN0cmluZyk6IHRoaXMge1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIHVtYSBjbGFzc2UgQ1NTXHJcbiAgICovXHJcbiAgcmVtb3ZlQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiB0aGlzIHtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSB1bWEgY2xhc3NlIENTU1xyXG4gICAqL1xyXG4gIHRvZ2dsZUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogdGhpcyB7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmUgYXRyaWJ1dG9zIG5vIGVsZW1lbnRvXHJcbiAgICovXHJcbiAgc2V0QXR0cihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB0aGlzIHtcclxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgYXRyaWJ1dG8gZG8gZWxlbWVudG9cclxuICAgKi9cclxuICByZW1vdmVBdHRyKG5hbWU6IHN0cmluZyk6IHRoaXMge1xyXG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxuIiwiLyoqXHJcbiAqIFNpc3RlbWEgZGUgU2hhZG93IERPTSBpc29sYWRvIHBhcmEgdXNlcnNjcmlwdHNcclxuICogXHJcbiAqIENyaWEgdW0gY29udGFpbmVyIGlzb2xhZG8gb25kZSBvIENTUyBlIERPTSBuw6NvIGludGVyZmVyZW0gY29tIGEgcMOhZ2luYSBob3N0XHJcbiAqIGUgYSBww6FnaW5hIGhvc3QgbsOjbyBpbnRlcmZlcmUgY29tIG5vc3NvIHVzZXJzY3JpcHQuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTaGFkb3dDb250YWluZXJPcHRpb25zIHtcclxuICBpZD86IHN0cmluZztcclxuICBtb2RlPzogJ29wZW4nIHwgJ2Nsb3NlZCc7XHJcbiAgYXR0YWNoVG8/OiBIVE1MRWxlbWVudDtcclxuICBzdHlsZUlzb2xhdGlvbj86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFkb3dDb250YWluZXIge1xyXG4gIHByaXZhdGUgaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gIHByaXZhdGUgc2hhZG93Um9vdDogU2hhZG93Um9vdDtcclxuICBwcml2YXRlIGNvbnRhaW5lckVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFNoYWRvd0NvbnRhaW5lck9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICBpZCA9ICd1c2Vyc2NyaXB0LXNoYWRvdy1yb290JyxcclxuICAgICAgbW9kZSA9ICdvcGVuJyxcclxuICAgICAgYXR0YWNoVG8gPSBkb2N1bWVudC5ib2R5LFxyXG4gICAgICBzdHlsZUlzb2xhdGlvbiA9IHRydWUsXHJcbiAgICB9ID0gb3B0aW9ucztcclxuXHJcbiAgICAvLyBDcmlhciBlbGVtZW50byBob3N0XHJcbiAgICB0aGlzLmhvc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLmhvc3RFbGVtZW50LmlkID0gaWQ7XHJcbiAgICB0aGlzLmhvc3RFbGVtZW50LnN0eWxlLmNzc1RleHQgPSAnYWxsOiBpbml0aWFsOyBwb3NpdGlvbjogcmVsYXRpdmU7IHotaW5kZXg6IDk5OTk5OTsnO1xyXG5cclxuICAgIC8vIENyaWFyIFNoYWRvdyBET01cclxuICAgIHRoaXMuc2hhZG93Um9vdCA9IHRoaXMuaG9zdEVsZW1lbnQuYXR0YWNoU2hhZG93KHsgbW9kZSB9KTtcclxuXHJcbiAgICAvLyBDb250YWluZXIgaW50ZXJub1xyXG4gICAgdGhpcy5jb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQuaWQgPSAnc2hhZG93LWNvbnRhaW5lcic7XHJcbiAgICBcclxuICAgIGlmIChzdHlsZUlzb2xhdGlvbikge1xyXG4gICAgICAvLyBSZXNldCBkZSBlc3RpbG9zIHBhcmEgZ2FyYW50aXIgaXNvbGFtZW50b1xyXG4gICAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICBhbGw6IGluaXRpYWw7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCAnSGVsdmV0aWNhIE5ldWUnLCBBcmlhbCwgc2Fucy1zZXJpZjtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcclxuICAgICAgICBjb2xvcjogIzMzMztcclxuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgICBgO1xyXG4gICAgICBcclxuICAgICAgLy8gQWRpY2lvbmFyIGVzdGlsbyBnbG9iYWwgcGFyYSBib3gtc2l6aW5nXHJcbiAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBgXHJcbiAgICAgICAgKiwgKjo6YmVmb3JlLCAqOjphZnRlciB7XHJcbiAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgICAgIH1cclxuICAgICAgYDtcclxuICAgICAgdGhpcy5zaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXJFbGVtZW50KTtcclxuICAgIGF0dGFjaFRvLmFwcGVuZENoaWxkKHRoaXMuaG9zdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0b3JuYSBvIFNoYWRvdyBSb290XHJcbiAgICovXHJcbiAgZ2V0Um9vdCgpOiBTaGFkb3dSb290IHtcclxuICAgIHJldHVybiB0aGlzLnNoYWRvd1Jvb3Q7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXRvcm5hIG8gY29udGFpbmVyIGludGVybm9cclxuICAgKi9cclxuICBnZXRDb250YWluZXIoKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyRWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldG9ybmEgbyBlbGVtZW50byBob3N0XHJcbiAgICovXHJcbiAgZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuaG9zdEVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGljaW9uYSB1bSBlbGVtZW50byBhbyBjb250YWluZXJcclxuICAgKi9cclxuICBhcHBlbmQoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBOb2RlKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGljaW9uYSBIVE1MIGFvIGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIGFwcGVuZEhUTUwoaHRtbDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0ZW1wLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICB3aGlsZSAodGVtcC5maXJzdENoaWxkKSB7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZCh0ZW1wLmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTGltcGEgbyBjb250ZcO6ZG8gZG8gY29udGFpbmVyXHJcbiAgICovXHJcbiAgY2xlYXIoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgbyBTaGFkb3cgRE9NIGNvbXBsZXRhbWVudGVcclxuICAgKi9cclxuICBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5ob3N0RWxlbWVudC5yZW1vdmUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkaWNpb25hIHVtYSBmb2xoYSBkZSBlc3RpbG9zIGFvIFNoYWRvdyBET01cclxuICAgKi9cclxuICBhZGRTdHlsZVNoZWV0KGNzczogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICBzdHlsZS50ZXh0Q29udGVudCA9IGNzcztcclxuICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBRdWVyeSBzZWxlY3RvciBkZW50cm8gZG8gU2hhZG93IERPTVxyXG4gICAqL1xyXG4gIHF1ZXJ5U2VsZWN0b3I8VCBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nKTogVCB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yPFQ+KHNlbGVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFF1ZXJ5IHNlbGVjdG9yIGFsbCBkZW50cm8gZG8gU2hhZG93IERPTVxyXG4gICAqL1xyXG4gIHF1ZXJ5U2VsZWN0b3JBbGw8VCBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nKTogTm9kZUxpc3RPZjxUPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGw8VD4oc2VsZWN0b3IpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEluc3TDom5jaWEgZ2xvYmFsIHNpbmdsZXRvbiBkbyBTaGFkb3cgQ29udGFpbmVyXHJcbiAqL1xyXG5sZXQgZ2xvYmFsU2hhZG93Q29udGFpbmVyOiBTaGFkb3dDb250YWluZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbi8qKlxyXG4gKiBPYnTDqW0gb3UgY3JpYSBhIGluc3TDom5jaWEgZ2xvYmFsIGRvIFNoYWRvdyBDb250YWluZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFkb3dDb250YWluZXIob3B0aW9ucz86IFNoYWRvd0NvbnRhaW5lck9wdGlvbnMpOiBTaGFkb3dDb250YWluZXIge1xyXG4gIGlmICghZ2xvYmFsU2hhZG93Q29udGFpbmVyKSB7XHJcbiAgICBnbG9iYWxTaGFkb3dDb250YWluZXIgPSBuZXcgU2hhZG93Q29udGFpbmVyKG9wdGlvbnMpO1xyXG4gIH1cclxuICByZXR1cm4gZ2xvYmFsU2hhZG93Q29udGFpbmVyO1xyXG59XHJcblxyXG4vKipcclxuICogUmVzZXRhIGEgaW5zdMOibmNpYSBnbG9iYWwgKMO6dGlsIHBhcmEgdGVzdGVzIG91IHJlaW5pY2lhbGl6YcOnw6NvKVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0U2hhZG93Q29udGFpbmVyKCk6IHZvaWQge1xyXG4gIGlmIChnbG9iYWxTaGFkb3dDb250YWluZXIpIHtcclxuICAgIGdsb2JhbFNoYWRvd0NvbnRhaW5lci5kZXN0cm95KCk7XHJcbiAgICBnbG9iYWxTaGFkb3dDb250YWluZXIgPSBudWxsO1xyXG4gIH1cclxufVxyXG5cclxuIiwiLyoqXHJcbiAqIENoYXJhY3RlciBJRCBFeHRyYWN0b3JcclxuICogXHJcbiAqIEV4dHJhaSBvIElEIGRvIHBlcnNvbmFnZW0gZGEgVVJMIGRvIFBvcG11bmRvXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEV4dHJhaSBvIElEIGRvIHBlcnNvbmFnZW0gZGEgVVJMIGF0dWFsXHJcbiAqIFxyXG4gKiBAcmV0dXJucyBPIElEIGRvIHBlcnNvbmFnZW0gb3UgbnVsbCBzZSBuw6NvIGVuY29udHJhZG9cclxuICogXHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIFVSTDogaHR0cHM6Ly83My5wb3BtdW5kby5jb20vV29ybGQvUG9wbXVuZG8uYXNweC9DaGFyYWN0ZXIvMzE1NTcxMlxyXG4gKiBjb25zdCBjaGFyYWN0ZXJJZCA9IGdldENoYXJhY3RlcklkKCk7IC8vIFJldG9ybmE6IFwiMzE1NTcxMlwiXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhcmFjdGVySWQoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgXHJcbiAgLy8gUmVnZXggcGFyYSBjYXB0dXJhciBvIElEIGFww7NzIC9DaGFyYWN0ZXIvXHJcbiAgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL0NoYXJhY3RlclxcLyhcXGQrKS9pKTtcclxuICBcclxuICBpZiAobWF0Y2ggJiYgbWF0Y2hbMV0pIHtcclxuICAgIHJldHVybiBtYXRjaFsxXTtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHRyYWkgbyBJRCBkbyBwZXJzb25hZ2VtIGRlIHVtYSBVUkwgZXNwZWPDrWZpY2FcclxuICogXHJcbiAqIEBwYXJhbSB1cmwgLSBVUkwgcGFyYSBleHRyYWlyIG8gSURcclxuICogQHJldHVybnMgTyBJRCBkbyBwZXJzb25hZ2VtIG91IG51bGwgc2UgbsOjbyBlbmNvbnRyYWRvXHJcbiAqIFxyXG4gKiBAZXhhbXBsZVxyXG4gKiBjb25zdCB1cmwgPSBcImh0dHBzOi8vNzMucG9wbXVuZG8uY29tL1dvcmxkL1BvcG11bmRvLmFzcHgvQ2hhcmFjdGVyLzMxNTU3MTJcIjtcclxuICogY29uc3QgY2hhcmFjdGVySWQgPSBnZXRDaGFyYWN0ZXJJZEZyb21VcmwodXJsKTsgLy8gUmV0b3JuYTogXCIzMTU1NzEyXCJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFyYWN0ZXJJZEZyb21VcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcclxuICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvQ2hhcmFjdGVyXFwvKFxcZCspL2kpO1xyXG4gIFxyXG4gIGlmIChtYXRjaCAmJiBtYXRjaFsxXSkge1xyXG4gICAgcmV0dXJuIG1hdGNoWzFdO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFZlcmlmaWNhIHNlIGEgVVJMIGF0dWFsIMOpIHVtYSBww6FnaW5hIGRlIHBlcnNvbmFnZW1cclxuICogXHJcbiAqIEByZXR1cm5zIHRydWUgc2UgZm9yIHVtYSBww6FnaW5hIGRlIHBlcnNvbmFnZW0sIGZhbHNlIGNhc28gY29udHLDoXJpb1xyXG4gKiBcclxuICogQGV4YW1wbGVcclxuICogaWYgKGlzQ2hhcmFjdGVyUGFnZSgpKSB7XHJcbiAqICAgY29uc3QgaWQgPSBnZXRDaGFyYWN0ZXJJZCgpO1xyXG4gKiAgIGNvbnNvbGUubG9nKCdJRCBkbyBwZXJzb25hZ2VtOicsIGlkKTtcclxuICogfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2hhcmFjdGVyUGFnZSgpOiBib29sZWFuIHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJy9DaGFyYWN0ZXIvJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPYnTDqW0gbyBJRCBkbyBwZXJzb25hZ2VtIGNvbSB2YWxpZGHDp8Ojb1xyXG4gKiBMYW7Dp2EgdW0gZXJybyBzZSBuw6NvIGVzdGl2ZXIgZW0gdW1hIHDDoWdpbmEgZGUgcGVyc29uYWdlbVxyXG4gKiBcclxuICogQHJldHVybnMgTyBJRCBkbyBwZXJzb25hZ2VtXHJcbiAqIEB0aHJvd3MgRXJyb3Igc2UgbsOjbyBlc3RpdmVyIGVtIHVtYSBww6FnaW5hIGRlIHBlcnNvbmFnZW1cclxuICogXHJcbiAqIEBleGFtcGxlXHJcbiAqIHRyeSB7XHJcbiAqICAgY29uc3QgY2hhcmFjdGVySWQgPSBnZXRDaGFyYWN0ZXJJZE9yVGhyb3coKTtcclxuICogICBjb25zb2xlLmxvZygnSUQ6JywgY2hhcmFjdGVySWQpO1xyXG4gKiB9IGNhdGNoIChlcnJvcikge1xyXG4gKiAgIGNvbnNvbGUuZXJyb3IoJ07Do28gZXN0w6EgZW0gdW1hIHDDoWdpbmEgZGUgcGVyc29uYWdlbScpO1xyXG4gKiB9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhcmFjdGVySWRPclRocm93KCk6IHN0cmluZyB7XHJcbiAgY29uc3QgY2hhcmFjdGVySWQgPSBnZXRDaGFyYWN0ZXJJZCgpO1xyXG4gIFxyXG4gIGlmICghY2hhcmFjdGVySWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIGV4dHJhaXIgbyBJRCBkbyBwZXJzb25hZ2VtIGRhIFVSTCBhdHVhbCcpO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gY2hhcmFjdGVySWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHRyYWkgaW5mb3JtYcOnw7VlcyBkYSBVUkwgZG8gUG9wbXVuZG9cclxuICogXHJcbiAqIEByZXR1cm5zIE9iamV0byBjb20gaW5mb3JtYcOnw7VlcyBkYSBVUkxcclxuICogXHJcbiAqIEBleGFtcGxlXHJcbiAqIGNvbnN0IGluZm8gPSBnZXRQb3BtdW5kb1VybEluZm8oKTtcclxuICogY29uc29sZS5sb2coaW5mbyk7XHJcbiAqIC8vIHtcclxuICogLy8gICBzZXJ2ZXI6IFwiNzNcIixcclxuICogLy8gICBjaGFyYWN0ZXJJZDogXCIzMTU1NzEyXCIsXHJcbiAqIC8vICAgaXNDaGFyYWN0ZXJQYWdlOiB0cnVlLFxyXG4gKiAvLyAgIGZ1bGxVcmw6IFwiaHR0cHM6Ly83My5wb3BtdW5kby5jb20vV29ybGQvUG9wbXVuZG8uYXNweC9DaGFyYWN0ZXIvMzE1NTcxMlwiXHJcbiAqIC8vIH1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3BtdW5kb1VybEluZm8oKToge1xyXG4gIHNlcnZlcjogc3RyaW5nIHwgbnVsbDtcclxuICBjaGFyYWN0ZXJJZDogc3RyaW5nIHwgbnVsbDtcclxuICBpc0NoYXJhY3RlclBhZ2U6IGJvb2xlYW47XHJcbiAgZnVsbFVybDogc3RyaW5nO1xyXG59IHtcclxuICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICBcclxuICAvLyBFeHRyYWkgbyBzZXJ2aWRvciAobsO6bWVybyBubyBpbsOtY2lvIGRvIGRvbcOtbmlvKVxyXG4gIGNvbnN0IHNlcnZlck1hdGNoID0gdXJsLm1hdGNoKC9odHRwcz86XFwvXFwvKFxcZCspXFwucG9wbXVuZG9cXC5jb20vaSk7XHJcbiAgY29uc3Qgc2VydmVyID0gc2VydmVyTWF0Y2ggPyBzZXJ2ZXJNYXRjaFsxXSA6IG51bGw7XHJcbiAgXHJcbiAgLy8gRXh0cmFpIG8gSUQgZG8gcGVyc29uYWdlbVxyXG4gIGNvbnN0IGNoYXJhY3RlcklkID0gZ2V0Q2hhcmFjdGVySWQoKTtcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgc2VydmVyLFxyXG4gICAgY2hhcmFjdGVySWQsXHJcbiAgICBpc0NoYXJhY3RlclBhZ2U6IGlzQ2hhcmFjdGVyUGFnZSgpLFxyXG4gICAgZnVsbFVybDogdXJsLFxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb25zdHLDs2kgYSBVUkwgZGUgdW0gcGVyc29uYWdlbVxyXG4gKiBcclxuICogQHBhcmFtIGNoYXJhY3RlcklkIC0gSUQgZG8gcGVyc29uYWdlbVxyXG4gKiBAcGFyYW0gc2VydmVyIC0gTsO6bWVybyBkbyBzZXJ2aWRvciAob3BjaW9uYWwsIHVzYSBvIHNlcnZpZG9yIGF0dWFsIHNlIG7Do28gZm9ybmVjaWRvKVxyXG4gKiBAcmV0dXJucyBVUkwgY29tcGxldGEgZG8gcGVyc29uYWdlbVxyXG4gKiBcclxuICogQGV4YW1wbGVcclxuICogY29uc3QgdXJsID0gYnVpbGRDaGFyYWN0ZXJVcmwoXCIzMTU1NzEyXCIsIFwiNzNcIik7XHJcbiAqIC8vIFJldG9ybmE6IFwiaHR0cHM6Ly83My5wb3BtdW5kby5jb20vV29ybGQvUG9wbXVuZG8uYXNweC9DaGFyYWN0ZXIvMzE1NTcxMlwiXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDaGFyYWN0ZXJVcmwoY2hhcmFjdGVySWQ6IHN0cmluZywgc2VydmVyPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBjdXJyZW50U2VydmVyID0gc2VydmVyIHx8IGdldFBvcG11bmRvVXJsSW5mbygpLnNlcnZlciB8fCAnNzMnO1xyXG4gIHJldHVybiBgaHR0cHM6Ly8ke2N1cnJlbnRTZXJ2ZXJ9LnBvcG11bmRvLmNvbS9Xb3JsZC9Qb3BtdW5kby5hc3B4L0NoYXJhY3Rlci8ke2NoYXJhY3RlcklkfWA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPYnTDqW0gbyBJRCBkbyBwZXJzb25hZ2VtIGFsdm8gZGEgaW50ZXJhw6fDo28gKHDDoWdpbmEgL0ludGVyYWN0LylcclxuICogXHJcbiAqIEByZXR1cm5zIElEIGRvIHBlcnNvbmFnZW0gYWx2byBvdSBudWxsIHNlIG7Do28gZXN0aXZlciBlbSB1bWEgcMOhZ2luYSBkZSBpbnRlcmHDp8Ojb1xyXG4gKiBcclxuICogQGV4YW1wbGVcclxuICogLy8gVVJMOiBodHRwczovLzc1LnBvcG11bmRvLmNvbS9Xb3JsZC9Qb3BtdW5kby5hc3B4L0ludGVyYWN0LzMyMTM1OTRcclxuICogY29uc3QgcGVyc29uYWdlbUFsdm8gPSBvYnRlclBlcnNvbmFnZW1BbHZvKCk7IC8vIFJldG9ybmE6IFwiMzIxMzU5NFwiXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb2J0ZXJQZXJzb25hZ2VtQWx2bygpOiBzdHJpbmcgfCBudWxsIHtcclxuICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvSW50ZXJhY3RcXC8oXFxkKykvaSk7XHJcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiBudWxsO1xyXG59XHJcblxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RvcnMge1xyXG4gICBzdGF0aWMgaW50ZXJjYXRVbEgzID0gXCIjY3RsMDBfY3BoUmlnaHRDb2x1bW5fY3RsMDBfaGRySW50ZXJhY3RcIjtcclxuICAgc3RhdGljIHNoYWRvd0NvbnRhaW5lcklkID0gXCIjbXktdXNlcnNjcmlwdC1yb290XCI7XHJcbiAgIC8vPGEgaWQ9XCJjdGwwMF9jcGhSaWdodENvbHVtbl9jdGwwMF9sbmtJbnRlcmFjdFwiIGhyZWY9XCIvV29ybGQvUG9wbXVuZG8uYXNweC9Mb2NhbGUvTW92ZVRvTG9jYWxlLzMyOTIxNjIvMzIxMzU5NFwiPklyIGludGVyYWdpcjwvYT5cclxuICAgc3RhdGljIGludGVyYWN0TGluayA9IFwiI2N0bDAwX2NwaFJpZ2h0Q29sdW1uX2N0bDAwX2xua0ludGVyYWN0XCI7XHJcbiAgIFxyXG4gICAvLyBTZWxldG9yZXMgV2ViRm9ybXNcclxuICAgc3RhdGljIHdlYkZvcm0gPSBcImZvcm0jYXNwbmV0Rm9ybVwiO1xyXG4gICBzdGF0aWMgZGRsVXNlSXRlbSA9IFwic2VsZWN0I2N0bDAwX2NwaFRvcENvbHVtbl9jdGwwMF9kZGxVc2VJdGVtXCI7XHJcbiAgIHN0YXRpYyB0ZXh0Q29sZXRvclNhbmd1ZSA9IFwiQ29sZXRvciBkZSBzYW5ndWVcIjtcclxuICAgc3RhdGljIHRleHRUdWJvU2FuZ3VpbmVvID0gXCJUdWJvIHNhbmd1w61uZW9cIjtcclxuICAgICAgXHJcbiAgIC8vIE5vbWVzIGRlIGNhbXBvcyBXZWJGb3Jtc1xyXG4gICBzdGF0aWMgZmllbGROYW1lcyA9IHtcclxuICAgICAgZGRsVXNlSXRlbTogXCJjdGwwMCRjcGhUb3BDb2x1bW4kY3RsMDAkZGRsVXNlSXRlbVwiLFxyXG4gICAgICBidG5Vc2VJdGVtOiBcImN0bDAwJGNwaFRvcENvbHVtbiRjdGwwMCRidG5Vc2VJdGVtXCIsXHJcbiAgICAgIGhpZFNlY3VyaXR5Q2hlY2s6IFwiY3RsMDAkY3BoVG9wQ29sdW1uJGN0bDAwJGhpZFNlY3VyaXR5Q2hlY2tcIixcclxuICAgfTtcclxufSIsIi8qKlxyXG4gKiBIZWxwZXJzIGRlIGVzdGlsaXphw6fDo28gdXNhbmRvIEdvb2JlciAoQ1NTLWluLUpTKVxyXG4gKiBcclxuICogR29vYmVyIMOpIHVtYSBiaWJsaW90ZWNhIG1pbmltYWxpc3RhICgxS0IpIGRlIENTUy1pbi1KU1xyXG4gKiBxdWUgZnVuY2lvbmEgcGVyZmVpdGFtZW50ZSBkZW50cm8gZG8gU2hhZG93IERPTS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBzdHlsZWQsIHNldHVwLCBjc3MgYXMgZ29vYmVyQ3NzLCBleHRyYWN0Q3NzIH0gZnJvbSAnZ29vYmVyJztcclxuXHJcbi8qKlxyXG4gKiBDb25maWd1cmEgbyBHb29iZXIgcGFyYSB0cmFiYWxoYXIgZGVudHJvIGRvIFNoYWRvdyBET01cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXR1cEdvb2Jlcih0YXJnZXQ6IEhUTUxFbGVtZW50IHwgU2hhZG93Um9vdCk6IHZvaWQge1xyXG4gIHNldHVwKHRhcmdldCBhcyB1bmtub3duIGFzIEVsZW1lbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogRXhwb3J0YSBvIHN0eWxlZCBkbyBHb29iZXIgcGFyYSBjcmlhciBjb21wb25lbnRlcyBlc3RpbGl6YWRvc1xyXG4gKiBcclxuICogVXNvOlxyXG4gKiBjb25zdCBTdHlsZWRCdXR0b24gPSBzdHlsZWQoJ2J1dHRvbicpYFxyXG4gKiAgIGJhY2tncm91bmQ6IGJsdWU7XHJcbiAqICAgY29sb3I6IHdoaXRlO1xyXG4gKiAgIHBhZGRpbmc6IDEwcHggMjBweDtcclxuICogYDtcclxuICogXHJcbiAqIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZVN0eWxlZEVsZW1lbnQoU3R5bGVkQnV0dG9uKTtcclxuICovXHJcbmV4cG9ydCB7IHN0eWxlZCB9O1xyXG5cclxuLyoqXHJcbiAqIEhlbHBlciBwYXJhIGNyaWFyIGVsZW1lbnRvIGEgcGFydGlyIGRlIHVtIHN0eWxlZCBjb21wb25lbnQgZG8gR29vYmVyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3R5bGVkRWxlbWVudDxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihcclxuICB0YWc6IEssXHJcbiAgY2xhc3NOYW1lOiBzdHJpbmdcclxuKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdIHtcclxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xyXG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gIHJldHVybiBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogRXhwb3J0YSBvIGNzcyBkbyBHb29iZXIgcGFyYSBjcmlhciBjbGFzc2VzIENTU1xyXG4gKiBcclxuICogVXNvOlxyXG4gKiBjb25zdCBidXR0b25DbGFzcyA9IGNzc2BcclxuICogICBiYWNrZ3JvdW5kOiBibHVlO1xyXG4gKiAgIGNvbG9yOiB3aGl0ZTtcclxuICogYDtcclxuICovXHJcbmV4cG9ydCBjb25zdCBjc3MgPSBnb29iZXJDc3M7XHJcblxyXG4vKipcclxuICogRXh0cmFpIHRvZG8gbyBDU1MgZ2VyYWRvICjDunRpbCBwYXJhIGRlYnVnIG91IFNTUilcclxuICovXHJcbmV4cG9ydCB7IGV4dHJhY3RDc3MgfTtcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgcGFyYSBjcmlhciBlc3RpbG9zIGlubGluZSBjb20gdGlwYWdlbVxyXG4gKi9cclxuZXhwb3J0IHR5cGUgQ1NTUHJvcGVydGllcyA9IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj47XHJcblxyXG4vKipcclxuICogQXBsaWNhIGVzdGlsb3MgaW5saW5lIGVtIHVtIGVsZW1lbnRvIGRlIGZvcm1hIHRpcG8tc2FmZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U3R5bGVzKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzdHlsZXM6IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj4pOiB2b2lkIHtcclxuICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlcyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUZW1hcyBwcsOpLWRlZmluaWRvcyBwYXJhIGZhY2lsaXRhciBlc3RpbGl6YcOnw6NvIGNvbnNpc3RlbnRlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdGhlbWUgPSB7XHJcbiAgY29sb3JzOiB7XHJcbiAgICBwcmltYXJ5OiAnIzNiODJmNicsXHJcbiAgICBzZWNvbmRhcnk6ICcjNjQ3NDhiJyxcclxuICAgIHN1Y2Nlc3M6ICcjMTBiOTgxJyxcclxuICAgIGRhbmdlcjogJyNlZjQ0NDQnLFxyXG4gICAgd2FybmluZzogJyNmNTllMGInLFxyXG4gICAgaW5mbzogJyMwNmI2ZDQnLFxyXG4gICAgbGlnaHQ6ICcjZjFmNWY5JyxcclxuICAgIGRhcms6ICcjMWUyOTNiJyxcclxuICAgIHdoaXRlOiAnI2ZmZmZmZicsXHJcbiAgICBibGFjazogJyMwMDAwMDAnLFxyXG4gIH0sXHJcbiAgc3BhY2luZzoge1xyXG4gICAgeHM6ICc0cHgnLFxyXG4gICAgc206ICc4cHgnLFxyXG4gICAgbWQ6ICcxNnB4JyxcclxuICAgIGxnOiAnMjRweCcsXHJcbiAgICB4bDogJzMycHgnLFxyXG4gICAgeHhsOiAnNDhweCcsXHJcbiAgfSxcclxuICBib3JkZXJSYWRpdXM6IHtcclxuICAgIG5vbmU6ICcwJyxcclxuICAgIHNtOiAnMnB4JyxcclxuICAgIG1kOiAnNHB4JyxcclxuICAgIGxnOiAnOHB4JyxcclxuICAgIHhsOiAnMTJweCcsXHJcbiAgICBmdWxsOiAnOTk5OXB4JyxcclxuICB9LFxyXG4gIHNoYWRvd3M6IHtcclxuICAgIHNtOiAnMCAxcHggMnB4IDAgcmdiYSgwLCAwLCAwLCAwLjA1KScsXHJcbiAgICBtZDogJzAgNHB4IDZweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4xKScsXHJcbiAgICBsZzogJzAgMTBweCAxNXB4IC0zcHggcmdiYSgwLCAwLCAwLCAwLjEpJyxcclxuICAgIHhsOiAnMCAyMHB4IDI1cHggLTVweCByZ2JhKDAsIDAsIDAsIDAuMSknLFxyXG4gIH0sXHJcbiAgdHJhbnNpdGlvbnM6IHtcclxuICAgIGZhc3Q6ICcxNTBtcyBlYXNlJyxcclxuICAgIG5vcm1hbDogJzI1MG1zIGVhc2UnLFxyXG4gICAgc2xvdzogJzM1MG1zIGVhc2UnLFxyXG4gIH0sXHJcbiAgekluZGV4OiB7XHJcbiAgICBkcm9wZG93bjogMTAwMCxcclxuICAgIHN0aWNreTogMTAyMCxcclxuICAgIGZpeGVkOiAxMDMwLFxyXG4gICAgbW9kYWxCYWNrZHJvcDogMTA0MCxcclxuICAgIG1vZGFsOiAxMDUwLFxyXG4gICAgcG9wb3ZlcjogMTA2MCxcclxuICAgIHRvb2x0aXA6IDEwNzAsXHJcbiAgfSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNaXhpbnMgQ1NTIGNvbXVucyBwYXJhIHJldXRpbGl6YcOnw6NvXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbWl4aW5zID0ge1xyXG4gIGZsZXhDZW50ZXI6IGNzc2BcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYCxcclxuICBmbGV4QmV0d2VlbjogY3NzYFxyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgYCxcclxuICB0cnVuY2F0ZTogY3NzYFxyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICBgLFxyXG4gIGFic29sdXRlRmlsbDogY3NzYFxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gIGAsXHJcbiAgdmlzdWFsbHlIaWRkZW46IGNzc2BcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHdpZHRoOiAxcHg7XHJcbiAgICBoZWlnaHQ6IDFweDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBtYXJnaW46IC0xcHg7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgY2xpcDogcmVjdCgwLCAwLCAwLCAwKTtcclxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICBib3JkZXItd2lkdGg6IDA7XHJcbiAgYCxcclxuICByZXNldEJ1dHRvbjogY3NzYFxyXG4gICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBmb250OiBpbmhlcml0O1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBvdXRsaW5lOiBpbmhlcml0O1xyXG4gIGAsXHJcbn07XHJcblxyXG4vKipcclxuICogSGVscGVyIHBhcmEgY3JpYXIgbWVkaWEgcXVlcmllcyByZXNwb25zaXZhc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJyZWFrcG9pbnRzID0ge1xyXG4gIHNtOiAnNjQwcHgnLFxyXG4gIG1kOiAnNzY4cHgnLFxyXG4gIGxnOiAnMTAyNHB4JyxcclxuICB4bDogJzEyODBweCcsXHJcbiAgeHhsOiAnMTUzNnB4JyxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgcGFyYSBnZXJhciBtZWRpYSBxdWVyeVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG1lZGlhUXVlcnkoYnJlYWtwb2ludDoga2V5b2YgdHlwZW9mIGJyZWFrcG9pbnRzKTogc3RyaW5nIHtcclxuICByZXR1cm4gYEBtZWRpYSAobWluLXdpZHRoOiAke2JyZWFrcG9pbnRzW2JyZWFrcG9pbnRdfSlgO1xyXG59XHJcblxyXG4vKipcclxuICogVXRpbGl0w6FyaW8gcGFyYSBjb21iaW5hciBjbGFzc2VzIENTU1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzTmFtZXMoLi4uY2xhc3NlczogKHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwgfCBmYWxzZSlbXSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGNsYXNzZXMuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhlbHBlciBwYXJhIGNyaWFyIGFuaW1hw6fDtWVzIENTU1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGtleWZyYW1lcyhuYW1lOiBzdHJpbmcsIGZyYW1lczogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gYFxyXG4gICAgQGtleWZyYW1lcyAke25hbWV9IHtcclxuICAgICAgJHtmcmFtZXN9XHJcbiAgICB9XHJcbiAgYDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdsb2JhbCBzdHlsZXMgcXVlIHBvZGVtIHNlciBpbmpldGFkb3Mgbm8gU2hhZG93IERPTVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdsb2JhbFN0eWxlcyA9IGNzc2BcclxuICAqIHtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgfVxyXG5cclxuICBidXR0b24ge1xyXG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XHJcbiAgfVxyXG5cclxuICBpbnB1dCxcclxuICB0ZXh0YXJlYSxcclxuICBzZWxlY3Qge1xyXG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XHJcbiAgICBmb250LXNpemU6IGluaGVyaXQ7XHJcbiAgfVxyXG5gO1xyXG5cclxuIiwiLyoqXHJcbiAqIEhlbHBlciBwYXJhIFN3ZWV0QWxlcnQyXHJcbiAqIFxyXG4gKiBXcmFwcGVyIGN1c3RvbWl6YWRvIHBhcmEgdXNhciBTd2VldEFsZXJ0MiBjb20gY29uZmlndXJhw6fDtWVzIHBhZHJvbml6YWRhc1xyXG4gKi9cclxuXHJcbmltcG9ydCBTd2FsIGZyb20gJ3N3ZWV0YWxlcnQyJztcclxuaW1wb3J0IHR5cGUgeyBTd2VldEFsZXJ0T3B0aW9ucywgU3dlZXRBbGVydFJlc3VsdCB9IGZyb20gJ3N3ZWV0YWxlcnQyJztcclxuXHJcbi8qKlxyXG4gKiBJbnN0w6JuY2lhIGN1c3RvbWl6YWRhIGRvIFN3ZWV0QWxlcnQyIGNvbSBjb25maWd1cmHDp8O1ZXMgcGFkcsOjb1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFRvYXN0ID0gU3dhbC5taXhpbih7XHJcbiAgdG9hc3Q6IHRydWUsXHJcbiAgcG9zaXRpb246ICd0b3AtZW5kJyxcclxuICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgdGltZXI6IDMwMDAsXHJcbiAgdGltZXJQcm9ncmVzc0JhcjogdHJ1ZSxcclxuICBkaWRPcGVuOiAodG9hc3QpID0+IHtcclxuICAgIHRvYXN0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBTd2FsLnN0b3BUaW1lcik7XHJcbiAgICB0b2FzdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgU3dhbC5yZXN1bWVUaW1lcik7XHJcbiAgfSxcclxufSk7XHJcblxyXG4vKipcclxuICogU3dlZXRBbGVydDIgcGFkcsOjbyBleHBvcnRhZG9cclxuICovXHJcbmV4cG9ydCB7IFN3YWwgfTtcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXJzIGRlIGFsZXJ0YSByw6FwaWRvc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEFsZXJ0ID0ge1xyXG4gIC8qKlxyXG4gICAqIEFsZXJ0YSBkZSBzdWNlc3NvXHJcbiAgICovXHJcbiAgc3VjY2Vzcyh0aXRsZTogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nKTogUHJvbWlzZTxTd2VldEFsZXJ0UmVzdWx0PiB7XHJcbiAgICByZXR1cm4gU3dhbC5maXJlKHtcclxuICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICB0aXRsZSxcclxuICAgICAgdGV4dCxcclxuICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnIzEwYjk4MScsXHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBbGVydGEgZGUgZXJyb1xyXG4gICAqL1xyXG4gIGVycm9yKHRpdGxlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPFN3ZWV0QWxlcnRSZXN1bHQ+IHtcclxuICAgIHJldHVybiBTd2FsLmZpcmUoe1xyXG4gICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICB0aXRsZSxcclxuICAgICAgdGV4dCxcclxuICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnI2VmNDQ0NCcsXHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBbGVydGEgZGUgYXZpc29cclxuICAgKi9cclxuICB3YXJuaW5nKHRpdGxlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPFN3ZWV0QWxlcnRSZXN1bHQ+IHtcclxuICAgIHJldHVybiBTd2FsLmZpcmUoe1xyXG4gICAgICBpY29uOiAnd2FybmluZycsXHJcbiAgICAgIHRpdGxlLFxyXG4gICAgICB0ZXh0LFxyXG4gICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjZjU5ZTBiJyxcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEFsZXJ0YSBkZSBpbmZvcm1hw6fDo29cclxuICAgKi9cclxuICBpbmZvKHRpdGxlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPFN3ZWV0QWxlcnRSZXN1bHQ+IHtcclxuICAgIHJldHVybiBTd2FsLmZpcmUoe1xyXG4gICAgICBpY29uOiAnaW5mbycsXHJcbiAgICAgIHRpdGxlLFxyXG4gICAgICB0ZXh0LFxyXG4gICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjM2I4MmY2JyxcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENvbmZpcm1hw6fDo29cclxuICAgKi9cclxuICBjb25maXJtKFxyXG4gICAgdGl0bGU6IHN0cmluZyxcclxuICAgIHRleHQ/OiBzdHJpbmcsXHJcbiAgICBjb25maXJtVGV4dCA9ICdTaW0nLFxyXG4gICAgY2FuY2VsVGV4dCA9ICdDYW5jZWxhcidcclxuICApOiBQcm9taXNlPFN3ZWV0QWxlcnRSZXN1bHQ+IHtcclxuICAgIHJldHVybiBTd2FsLmZpcmUoe1xyXG4gICAgICBpY29uOiAncXVlc3Rpb24nLFxyXG4gICAgICB0aXRsZSxcclxuICAgICAgdGV4dCxcclxuICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6IGNvbmZpcm1UZXh0LFxyXG4gICAgICBjYW5jZWxCdXR0b25UZXh0OiBjYW5jZWxUZXh0LFxyXG4gICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjM2I4MmY2JyxcclxuICAgICAgY2FuY2VsQnV0dG9uQ29sb3I6ICcjNmI3MjgwJyxcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFRvYXN0IGRlIHN1Y2Vzc29cclxuICAgKi9cclxuICB0b2FzdFN1Y2Nlc3ModGl0bGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgVG9hc3QuZmlyZSh7XHJcbiAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgdGl0bGUsXHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUb2FzdCBkZSBlcnJvXHJcbiAgICovXHJcbiAgdG9hc3RFcnJvcih0aXRsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBUb2FzdC5maXJlKHtcclxuICAgICAgaWNvbjogJ2Vycm9yJyxcclxuICAgICAgdGl0bGUsXHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUb2FzdCBkZSBhdmlzb1xyXG4gICAqL1xyXG4gIHRvYXN0V2FybmluZyh0aXRsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBUb2FzdC5maXJlKHtcclxuICAgICAgaWNvbjogJ3dhcm5pbmcnLFxyXG4gICAgICB0aXRsZSxcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFRvYXN0IGRlIGluZm9ybWHDp8Ojb1xyXG4gICAqL1xyXG4gIHRvYXN0SW5mbyh0aXRsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBUb2FzdC5maXJlKHtcclxuICAgICAgaWNvbjogJ2luZm8nLFxyXG4gICAgICB0aXRsZSxcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGFsIGN1c3RvbWl6YWRvXHJcbiAgICovXHJcbiAgY3VzdG9tKG9wdGlvbnM6IFN3ZWV0QWxlcnRPcHRpb25zKTogUHJvbWlzZTxTd2VldEFsZXJ0UmVzdWx0PiB7XHJcbiAgICByZXR1cm4gU3dhbC5maXJlKG9wdGlvbnMpO1xyXG4gIH0sXHJcbn07XHJcblxyXG4vKipcclxuICogRXhlbXBsbyBkZSBtb2RhbCBjb20gSFRNTCBjdXN0b21pemFkb1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNob3dDdXN0b21Nb2RhbCh0aXRsZTogc3RyaW5nLCBodG1sQ29udGVudDogc3RyaW5nKTogUHJvbWlzZTxTd2VldEFsZXJ0UmVzdWx0PiB7XHJcbiAgcmV0dXJuIFN3YWwuZmlyZSh7XHJcbiAgICB0aXRsZSxcclxuICAgIGh0bWw6IGh0bWxDb250ZW50LFxyXG4gICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXHJcbiAgICBjb25maXJtQnV0dG9uVGV4dDogJ0ZlY2hhcicsXHJcbiAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjM2I4MmY2JyxcclxuICAgIHdpZHRoOiAnNjAwcHgnLFxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogTW9kYWwgY29tIGlucHV0XHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hvd0lucHV0TW9kYWwoXHJcbiAgdGl0bGU6IHN0cmluZyxcclxuICBpbnB1dFR5cGU6ICd0ZXh0JyB8ICdlbWFpbCcgfCAncGFzc3dvcmQnIHwgJ251bWJlcicgfCAndGVsJyB8ICd1cmwnID0gJ3RleHQnLFxyXG4gIHBsYWNlaG9sZGVyID0gJycsXHJcbiAgZGVmYXVsdFZhbHVlID0gJydcclxuKTogUHJvbWlzZTxTd2VldEFsZXJ0UmVzdWx0PiB7XHJcbiAgcmV0dXJuIFN3YWwuZmlyZSh7XHJcbiAgICB0aXRsZSxcclxuICAgIGlucHV0OiBpbnB1dFR5cGUsXHJcbiAgICBpbnB1dFBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcixcclxuICAgIGlucHV0VmFsdWU6IGRlZmF1bHRWYWx1ZSxcclxuICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICBjb25maXJtQnV0dG9uVGV4dDogJ0NvbmZpcm1hcicsXHJcbiAgICBjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsYXInLFxyXG4gICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnIzNiODJmNicsXHJcbiAgICBjYW5jZWxCdXR0b25Db2xvcjogJyM2YjcyODAnLFxyXG4gICAgaW5wdXRWYWxpZGF0b3I6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuICdWb2PDqiBwcmVjaXNhIHByZWVuY2hlciBlc3RlIGNhbXBvISc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogTW9kYWwgZGUgbG9hZGluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNob3dMb2FkaW5nKHRpdGxlID0gJ0NhcnJlZ2FuZG8uLi4nLCB0ZXh0Pzogc3RyaW5nKTogdm9pZCB7XHJcbiAgU3dhbC5maXJlKHtcclxuICAgIHRpdGxlLFxyXG4gICAgdGV4dCxcclxuICAgIGFsbG93T3V0c2lkZUNsaWNrOiBmYWxzZSxcclxuICAgIGFsbG93RXNjYXBlS2V5OiBmYWxzZSxcclxuICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgIHdpbGxPcGVuOiAoKSA9PiB7XHJcbiAgICAgIFN3YWwuc2hvd0xvYWRpbmcoKTtcclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGZWNoYSBvIG1vZGFsIGF0dWFsXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VNb2RhbCgpOiB2b2lkIHtcclxuICBTd2FsLmNsb3NlKCk7XHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiBVdGlsaXTDoXJpb3MgcGFyYSB0cmFiYWxoYXIgY29tIGZvcm11bMOhcmlvcyBXZWJGb3JtcyAoQVNQLk5FVClcclxuICogXHJcbiAqIEVzdGUgbcOzZHVsbyBmb3JuZWNlIGZ1bsOnw7VlcyBwYXJhIGNvbGV0YXIgZGFkb3MgZGUgZm9ybXVsw6FyaW9zIFdlYkZvcm1zXHJcbiAqIGUgZmF6ZXIgcmVxdWlzacOnw7VlcyBQT1NUIHNpbXVsYW5kbyBvIGNvbXBvcnRhbWVudG8gZG8gbmF2ZWdhZG9yLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IG9idGVyUGVyc29uYWdlbUFsdm8gfSBmcm9tICcuL2NoYXJhY3Rlci1pZC1leHRyYWN0b3InO1xyXG5pbXBvcnQgU2VsZWN0b3JzIGZyb20gJy4vc2VsZWN0b3JzJztcclxuXHJcbi8qKlxyXG4gKiBDb2xldGEgdG9kb3Mgb3MgY2FtcG9zIGRvIGZvcm11bMOhcmlvIFdlYkZvcm1zIGRhIHDDoWdpbmFcclxuICogXHJcbiAqIEBwYXJhbSBib3Rhb0NsaWNhZG8gLSBOb21lIGRvIGJvdMOjbyBkZSBzdWJtaXQgcXVlIGZvaSBjbGljYWRvIChvcGNpb25hbClcclxuICogQHJldHVybnMgT2JqZXRvIGNvbSB0b2RvcyBvcyBjYW1wb3MgZG8gZm9ybXVsw6FyaW8gb3UgbnVsbCBzZSBuw6NvIGVuY29udHJhciBvIGZvcm11bMOhcmlvXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29sZXRhckNhbXBvc1dlYkZvcm1zKGJvdGFvQ2xpY2Fkbz86IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcclxuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTZWxlY3RvcnMud2ViRm9ybSkgYXMgSFRNTEZvcm1FbGVtZW50O1xyXG4gIFxyXG4gIGlmICghZm9ybSkge1xyXG4gICAgY29uc29sZS53YXJuKCfimqDvuI8gRm9ybXVsw6FyaW8gV2ViRm9ybXMgbsOjbyBlbmNvbnRyYWRvIG5hIHDDoWdpbmEnKTtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2FtcG9zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcblxyXG4gIC8vIENvbGV0YXIgdG9kb3Mgb3MgaW5wdXRzLCBzZWxlY3RzIGUgdGV4dGFyZWFzIGRvIGZvcm11bMOhcmlvXHJcbiAgY29uc3QgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpO1xyXG4gIFxyXG4gIGlucHV0cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICBjb25zdCBuYW1lID0gKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCkubmFtZTtcclxuICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG5cclxuICAgIC8vIElnbm9yYXIgYm90w7VlcyBkZSBzdWJtaXQgcXVlIG7Do28gZm9yYW0gY2xpY2Fkb3NcclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdzdWJtaXQnKSB7XHJcbiAgICAgIC8vIFPDsyBpbmNsdWlyIG8gYm90w6NvIHF1ZSBmb2kgZXNwZWNpZmljYWRvIGNvbW8gY2xpY2Fkb1xyXG4gICAgICBpZiAoYm90YW9DbGljYWRvICYmIG5hbWUgPT09IGJvdGFvQ2xpY2Fkbykge1xyXG4gICAgICAgIGNhbXBvc1tuYW1lXSA9IGVsZW1lbnQudmFsdWUgfHwgJyc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB2YWx1ZTogc3RyaW5nO1xyXG5cclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgICBpZiAoZWxlbWVudC50eXBlID09PSAnY2hlY2tib3gnIHx8IGVsZW1lbnQudHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICAgIC8vIFPDsyBpbmNsdWlyIHNlIGVzdGl2ZXIgbWFyY2Fkb1xyXG4gICAgICAgIGlmIChlbGVtZW50LmNoZWNrZWQpIHtcclxuICAgICAgICAgIHZhbHVlID0gZWxlbWVudC52YWx1ZSB8fCAnJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuOyAvLyBOw6NvIGluY2x1aXIgY2hlY2tib3hlcy9yYWRpb3MgbsOjbyBtYXJjYWRvc1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBoaWRkZW4sIHRleHQsIGV0Yy5cclxuICAgICAgICB2YWx1ZSA9IGVsZW1lbnQudmFsdWUgfHwgJyc7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSB7XHJcbiAgICAgIHZhbHVlID0gZWxlbWVudC52YWx1ZSB8fCAnJztcclxuICAgICAgXHJcbiAgICAgIC8vIE7Do28gaW5jbHVpciBzZWxlY3RzIGNvbSB2YWxvciBcIjBcIiBvdSB2YXppbyAoZXhjZXRvIHNlIGZvciBvYnJpZ2F0w7NyaW8pXHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gJzAnIHx8IHZhbHVlID09PSAnJykge1xyXG4gICAgICAgIC8vIE1hbnRlciBhcGVuYXMgc2UgZm9yIHVtIGNhbXBvIG9icmlnYXTDs3JpbyBkbyBXZWJGb3Jtc1xyXG4gICAgICAgIGlmICghbmFtZS5zdGFydHNXaXRoKCdfXycpICYmICFuYW1lLmluY2x1ZGVzKCdkZGxDdXJyZW50Q2hhcmFjdGVyJykpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcclxuICAgICAgdmFsdWUgPSBlbGVtZW50LnZhbHVlIHx8ICcnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFsdWUgPSAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICAvLyBTw7MgYWRpY2lvbmFyIGNhbXBvcyBjb20gdmFsb3Igb3UgY2FtcG9zIG9icmlnYXTDs3Jpb3MgZG8gV2ViRm9ybXNcclxuICAgIGlmICh2YWx1ZSB8fCBuYW1lLnN0YXJ0c1dpdGgoJ19fJykpIHtcclxuICAgICAgY2FtcG9zW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBjYW1wb3M7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFBhZ2luYUludmVudGFyaW8oKTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gIGNvbnN0IHVybEluZm8gPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICBcclxuICAvLyBFeHRyYWlyIHNlcnZpZG9yIGRvIGhvc3RuYW1lIGF0dWFsIChleDogXCI3NS5wb3BtdW5kby5jb21cIiAtPiBcIjc1XCIpXHJcbiAgbGV0IGN1cnJlbnRTZXJ2ZXIgPSBudWxsO1xyXG4gIGlmICghY3VycmVudFNlcnZlcikge1xyXG4gICAgY29uc3Qgc2VydmVyTWF0Y2ggPSB1cmxJbmZvLmhvc3RuYW1lLm1hdGNoKC8oXFxkKylcXC5wb3BtdW5kb1xcLmNvbS9pKTtcclxuICAgIGN1cnJlbnRTZXJ2ZXIgPSBzZXJ2ZXJNYXRjaCA/IHNlcnZlck1hdGNoWzFdIDogJzc1JztcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgYmFzZVVybCA9IGAke3VybEluZm8ucHJvdG9jb2x9Ly8ke2N1cnJlbnRTZXJ2ZXJ9LnBvcG11bmRvLmNvbWA7XHJcbiAgY29uc3QgdXJsID0gYCR7YmFzZVVybH0vV29ybGQvUG9wbXVuZG8uYXNweC9DaGFyYWN0ZXIvSXRlbXMvYDtcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ1JlZmVyZXInOiB3aW5kb3cubG9jYXRpb24uaHJlZixcclxuICAgIH0sXHJcbiAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLCAvLyBJbmNsdWlyIGNvb2tpZXNcclxuICB9KTtcclxuICByZXR1cm4gcmVzcG9uc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCdXNjYSBhIGxpbmhhIGRhIHRhYmVsYSBkbyBpbnZlbnTDoXJpbyBxdWUgY29udMOpbSB1bSBpdGVtIGVzcGVjw61maWNvXHJcbiAqIFxyXG4gKiBAcGFyYW0gaHRtbCAtIEhUTUwgZGEgcMOhZ2luYSBkZSBpbnZlbnTDoXJpb1xyXG4gKiBAcGFyYW0gbm9tZUl0ZW0gLSBOb21lIGRvIGl0ZW0gYSBidXNjYXIgKGV4OiBcIlR1Ym8gc2FuZ3XDrW5lb1wiKVxyXG4gKiBAcmV0dXJucyBPYmpldG8gY29tIGluZm9ybWHDp8O1ZXMgZGEgbGluaGEgb3UgbnVsbCBzZSBuw6NvIGVuY29udHJhZG9cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBidXNjYXJMaW5oYUl0ZW1JbnZlbnRhcmlvKFxyXG4gIGh0bWw6IHN0cmluZyxcclxuICBub21lSXRlbTogc3RyaW5nXHJcbik6IHtcclxuICB0cjogSFRNTFRhYmxlUm93RWxlbWVudDtcclxuICBpdGVtSWQ6IHN0cmluZztcclxuICBidG5Vc2U6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xyXG4gIGxpbmtJdGVtOiBIVE1MQW5jaG9yRWxlbWVudCB8IG51bGw7XHJcbn0gfCBudWxsIHtcclxuICAvLyBDcmlhciB1bSBlbGVtZW50byB0ZW1wb3LDoXJpbyBwYXJhIGZhemVyIG8gcGFyc2UgZG8gSFRNTFxyXG4gIGNvbnN0IHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICB0ZW1wRGl2LmlubmVySFRNTCA9IGh0bWw7XHJcblxyXG4gIC8vIEJ1c2NhciBhIHRhYmVsYSBkZSBpdGVuc1xyXG4gIGNvbnN0IHRhYmVsYSA9IHRlbXBEaXYucXVlcnlTZWxlY3RvcigndGFibGUjY2hlY2tlZGxpc3QnKSBhcyBIVE1MVGFibGVFbGVtZW50O1xyXG4gIFxyXG4gIGlmICghdGFiZWxhKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ+KaoO+4jyBUYWJlbGEgZGUgaW52ZW50w6FyaW8gbsOjbyBlbmNvbnRyYWRhIG5vIEhUTUwnKTtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gQnVzY2FyIHRvZGFzIGFzIGxpbmhhcyBkYSB0YWJlbGFcclxuICBjb25zdCBsaW5oYXMgPSB0YWJlbGEucXVlcnlTZWxlY3RvckFsbDxIVE1MVGFibGVSb3dFbGVtZW50PigndGJvZHkgdHInKTtcclxuICBcclxuICAvLyBQcm9jdXJhciBhIGxpbmhhIHF1ZSBjb250w6ltIG8gaXRlbVxyXG4gIGZvciAoY29uc3QgbGluaGEgb2YgQXJyYXkuZnJvbShsaW5oYXMpKSB7XHJcbiAgICAvLyBCdXNjYXIgbyBsaW5rIGRvIGl0ZW0gZGVudHJvIGRhIGxpbmhhXHJcbiAgICBjb25zdCBsaW5rSXRlbSA9IGxpbmhhLnF1ZXJ5U2VsZWN0b3I8SFRNTEFuY2hvckVsZW1lbnQ+KCd0ZCBhW2hyZWYqPVwiSXRlbURldGFpbHNcIl0nKTtcclxuICAgIFxyXG4gICAgaWYgKGxpbmtJdGVtICYmIGxpbmtJdGVtLnRleHRDb250ZW50Py50cmltKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub21lSXRlbS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAvLyBFbmNvbnRyb3UgYSBsaW5oYSEgRXh0cmFpciBpbmZvcm1hw6fDtWVzXHJcbiAgICAgIFxyXG4gICAgICAvLyBCdXNjYXIgbyBJRCBkbyBpdGVtIG5vIGNhbXBvIGhpZGRlblxyXG4gICAgICBjb25zdCBoaWRJdGVtSWQgPSBsaW5oYS5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW2lkKj1cImhpZEl0ZW1JRHN0cmluZ1wiXScpO1xyXG4gICAgICBjb25zdCBpdGVtSWQgPSBoaWRJdGVtSWQ/LnZhbHVlIHx8ICcnO1xyXG4gICAgICBcclxuICAgICAgLy8gQnVzY2FyIG8gYm90w6NvIGRlIHVzYXJcclxuICAgICAgY29uc3QgYnRuVXNlID0gbGluaGEucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbdHlwZT1cImltYWdlXCJdW2lkKj1cImJ0blVzZVwiXScpO1xyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW1JZCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB0cjogbGluaGEsXHJcbiAgICAgICAgICBpdGVtSWQsXHJcbiAgICAgICAgICBidG5Vc2U6IGJ0blVzZSB8fCBudWxsLFxyXG4gICAgICAgICAgbGlua0l0ZW0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPYnTDqW0gbyB2YWxvciBkZSB1bSBjYW1wbyBlc3BlY8OtZmljbyBkbyBmb3JtdWzDoXJpbyBXZWJGb3Jtc1xyXG4gKiBcclxuICogQHBhcmFtIG5vbWVDYW1wbyAtIE5vbWUgZG8gY2FtcG8gKGV4OiBTZWxlY3RvcnMuZmllbGROYW1lcy5kZGxVc2VJdGVtKVxyXG4gKiBAcmV0dXJucyBWYWxvciBkbyBjYW1wbyBvdSBudWxsIHNlIG7Do28gZW5jb250cmFkb1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG9idGVyVmFsb3JDYW1wbyhub21lQ2FtcG86IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xyXG4gIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9ycy53ZWJGb3JtKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XHJcbiAgaWYgKCFmb3JtKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgY29uc3QgY2FtcG8gPSBmb3JtLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50PihcclxuICAgIGBbbmFtZT1cIiR7bm9tZUNhbXBvfVwiXWBcclxuICApO1xyXG5cclxuICBpZiAoIWNhbXBvKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgaWYgKGNhbXBvIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgaWYgKGNhbXBvLnR5cGUgPT09ICdjaGVja2JveCcgfHwgY2FtcG8udHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICByZXR1cm4gY2FtcG8uY2hlY2tlZCA/IGNhbXBvLnZhbHVlIDogbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBjYW1wby52YWx1ZSB8fCBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhbXBvIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpIHtcclxuICAgIHJldHVybiBjYW1wby52YWx1ZSB8fCBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPYnTDqW0gbyBJRCBkbyBpdGVtIHNlbGVjaW9uYWRvIG5vIGRyb3Bkb3duIFwiVXNhciBpdGVtXCJcclxuICogXHJcbiAqIEByZXR1cm5zIElEIGRvIGl0ZW0gc2VsZWNpb25hZG8gb3UgbnVsbCBzZSBuw6NvIGVuY29udHJhZG9cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBvYnRlckl0ZW1TZWxlY2lvbmFkbygpOiBzdHJpbmcgfCBudWxsIHtcclxuICByZXR1cm4gb2J0ZXJWYWxvckNhbXBvKFNlbGVjdG9ycy5maWVsZE5hbWVzLmRkbFVzZUl0ZW0pO1xyXG59XHJcblxyXG4vKipcclxuICogT2J0w6ltIG8gdmFsb3IgZG8gY2FtcG8gZGUgc2VndXJhbsOnYSAoU2VjdXJpdHkgQ2hlY2spXHJcbiAqIFxyXG4gKiBAcmV0dXJucyBWYWxvciBkbyBzZWN1cml0eSBjaGVjayBvdSBudWxsIHNlIG7Do28gZW5jb250cmFkb1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG9idGVyU2VjdXJpdHlDaGVjaygpOiBzdHJpbmcgfCBudWxsIHtcclxuICByZXR1cm4gb2J0ZXJWYWxvckNhbXBvKFNlbGVjdG9ycy5maWVsZE5hbWVzLmhpZFNlY3VyaXR5Q2hlY2spO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydGUgdW0gb2JqZXRvIGVtIGZvcm1hdG8gVVJMLWVuY29kZWQgKGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZClcclxuICogXHJcbiAqIEBwYXJhbSBkYWRvcyAtIE9iamV0byBjb20gb3MgZGFkb3MgZG8gZm9ybXVsw6FyaW9cclxuICogQHJldHVybnMgU3RyaW5nIFVSTC1lbmNvZGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29kaWZpY2FyRm9ybURhdGEoZGFkb3M6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBzdHJpbmcge1xyXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhkYWRvcylcclxuICAgIC5tYXAoKFtrZXksIHZhbHVlXSkgPT4gYCR7ZW5jb2RlVVJJQ29tcG9uZW50KGtleSl9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKX1gKVxyXG4gICAgLmpvaW4oJyYnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZheiB1bWEgcmVxdWlzacOnw6NvIFBPU1Qgc2ltdWxhbmRvIG8gZW52aW8gZGUgdW0gZm9ybXVsw6FyaW8gV2ViRm9ybXNcclxuICogXHJcbiAqIEBwYXJhbSB1cmwgLSBVUkwgcGFyYSBvbmRlIGVudmlhciBhIHJlcXVpc2nDp8Ojb1xyXG4gKiBAcGFyYW0gZGFkb3MgLSBEYWRvcyBkbyBmb3JtdWzDoXJpbyAob3UgbnVsbCBwYXJhIGNvbGV0YXIgYXV0b21hdGljYW1lbnRlKVxyXG4gKiBAcmV0dXJucyBQcm9taXNlIGNvbSBhIHJlc3Bvc3RhIGRhIHJlcXVpc2nDp8Ojb1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVudmlhckZvcm11bGFyaW9XZWJGb3JtcyhcclxuICB1cmw6IHN0cmluZyxcclxuICBkYWRvcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cclxuKTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gIGNvbnN0IGNhbXBvcyA9IGRhZG9zIHx8IGNvbGV0YXJDYW1wb3NXZWJGb3JtcygpO1xyXG4gIFxyXG4gIGlmICghY2FtcG9zKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ07Do28gZm9pIHBvc3PDrXZlbCBjb2xldGFyIG9zIGNhbXBvcyBkbyBmb3JtdWzDoXJpbyBXZWJGb3JtcycpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZm9ybURhdGEgPSBjb2RpZmljYXJGb3JtRGF0YShjYW1wb3MpO1xyXG5cclxuICBjb25zb2xlLmxvZygn8J+TpCBFbnZpYW5kbyBmb3JtdWzDoXJpbyBXZWJGb3JtczonLCB7XHJcbiAgICB1cmwsXHJcbiAgICBjYW1wb3M6IE9iamVjdC5rZXlzKGNhbXBvcykubGVuZ3RoLFxyXG4gICAgdGFtYW5obzogZm9ybURhdGEubGVuZ3RoLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcclxuICAgICAgJ1JlZmVyZXInOiB3aW5kb3cubG9jYXRpb24uaHJlZixcclxuICAgIH0sXHJcbiAgICBib2R5OiBmb3JtRGF0YSxcclxuICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsIC8vIEluY2x1aXIgY29va2llc1xyXG4gICAgcmVkaXJlY3Q6ICdtYW51YWwnLCAvLyBOw6NvIHNlZ3VpciByZWRpcmVjaW9uYW1lbnRvIGF1dG9tYXRpY2FtZW50ZVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcmVzcG9uc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFbnZpYSBvIGZvcm11bMOhcmlvIFwiVXNhciBpdGVtXCIgcGFyYSB1bSBwZXJzb25hZ2VtXHJcbiAqIFxyXG4gKiBAcGFyYW0gaXRlbUlkIC0gSUQgZG8gaXRlbSBhIHNlciB1c2FkbyAoZXg6IFwiMjM4MTAyMTY2XCIpXHJcbiAqIEBwYXJhbSBwZXJzb25hZ2VtQWx2b0lkIC0gSUQgZG8gcGVyc29uYWdlbSBhbHZvIChvcGNpb25hbCwgdGVudGEgZXh0cmFpciBkYSBVUkwpXHJcbiAqIEByZXR1cm5zIFByb21pc2UgY29tIGEgcmVzcG9zdGEgZGEgcmVxdWlzacOnw6NvXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNhckl0ZW0oXHJcbiAgaXRlbUlkOiBzdHJpbmcsXHJcbiAgcGVyc29uYWdlbUFsdm9JZD86IHN0cmluZ1xyXG4pOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcbiAgY29uc3QgYWx2b0lkID0gcGVyc29uYWdlbUFsdm9JZCB8fCBvYnRlclBlcnNvbmFnZW1BbHZvKCk7XHJcbiAgXHJcbiAgaWYgKCFhbHZvSWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIGlkZW50aWZpY2FyIG8gcGVyc29uYWdlbSBhbHZvIGRhIGludGVyYcOnw6NvJyk7XHJcbiAgfVxyXG5cclxuICAvLyBDb2xldGFyIHRvZG9zIG9zIGNhbXBvcyBkbyBmb3JtdWzDoXJpbywgZXNwZWNpZmljYW5kbyBvIGJvdMOjbyBxdWUgc2Vyw6EgY2xpY2Fkb1xyXG4gIGNvbnN0IGNhbXBvcyA9IGNvbGV0YXJDYW1wb3NXZWJGb3JtcyhTZWxlY3RvcnMuZmllbGROYW1lcy5idG5Vc2VJdGVtKTtcclxuICBcclxuICBpZiAoIWNhbXBvcykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOw6NvIGZvaSBwb3Nzw612ZWwgY29sZXRhciBvcyBjYW1wb3MgZG8gZm9ybXVsw6FyaW8gV2ViRm9ybXMnKTtcclxuICB9XHJcblxyXG4gIC8vIEF0dWFsaXphciBjYW1wb3MgZXNwZWPDrWZpY29zIGRvIFwiVXNhciBpdGVtXCJcclxuICBjYW1wb3NbU2VsZWN0b3JzLmZpZWxkTmFtZXMuZGRsVXNlSXRlbV0gPSBpdGVtSWQ7XHJcbiAgY2FtcG9zW1NlbGVjdG9ycy5maWVsZE5hbWVzLmJ0blVzZUl0ZW1dID0gJ1VzYXIgaXRlbSc7XHJcblxyXG4gIC8vIENvbnN0cnVpciBVUkwgZGEgaW50ZXJhw6fDo29cclxuICBjb25zdCB1cmxJbmZvID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgY29uc3QgYmFzZVVybCA9IGAke3VybEluZm8ucHJvdG9jb2x9Ly8ke3VybEluZm8uaG9zdH1gO1xyXG4gIGNvbnN0IGludGVyYWN0TGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU2VsZWN0b3JzLmludGVyYWN0TGluaykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgY29uc3QgaHJlZiA9IGludGVyYWN0TGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuICBjb25zdCB1cmwgPSBgJHtiYXNlVXJsfSR7aHJlZn1gO1xyXG5cclxuICBjb25zb2xlLmxvZygn8J+puCBVc2FuZG8gaXRlbTonLCB7XHJcbiAgICBpdGVtSWQsXHJcbiAgICBwZXJzb25hZ2VtQWx2bzogYWx2b0lkLFxyXG4gICAgdXJsLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGVudmlhckZvcm11bGFyaW9XZWJGb3Jtcyh1cmwsIGNhbXBvcyk7XHJcblxyXG4gIC8vIFZlcmlmaWNhciBzZSBmb2kgcmVkaXJlY2lvbmFkbyAoMzAyKVxyXG4gIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDMwMiB8fCByZXNwb25zZS5zdGF0dXMgPT09IDApIHtcclxuICAgIGNvbnN0IGxvY2F0aW9uID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2xvY2F0aW9uJyk7XHJcbiAgICBpZiAobG9jYXRpb24pIHtcclxuICAgICAgY29uc29sZS5sb2coJ+KchSBJdGVtIHVzYWRvIGNvbSBzdWNlc3NvISBSZWRpcmVjaW9uYW5kbyBwYXJhOicsIGxvY2F0aW9uKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXNwb25zZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE9idMOpbSBhIGxpc3RhIGRlIGl0ZW5zIGRpc3BvbsOtdmVpcyBubyBkcm9wZG93biBcIlVzYXIgaXRlbVwiXHJcbiAqIFxyXG4gKiBAcmV0dXJucyBBcnJheSBjb20gb2JqZXRvcyB7IHZhbHVlOiBzdHJpbmcsIHRleHQ6IHN0cmluZyB9IG91IGFycmF5IHZhemlvXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb2J0ZXJJdGVuc0Rpc3Bvbml2ZWlzKCk6IEFycmF5PHsgdmFsdWU6IHN0cmluZzsgdGV4dDogc3RyaW5nIH0+IHtcclxuICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxTZWxlY3RFbGVtZW50PihcclxuICAgIFNlbGVjdG9ycy5kZGxVc2VJdGVtXHJcbiAgKTtcclxuXHJcbiAgaWYgKCFzZWxlY3QpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGl0ZW5zOiBBcnJheTx7IHZhbHVlOiBzdHJpbmc7IHRleHQ6IHN0cmluZyB9PiA9IFtdO1xyXG5cclxuICBBcnJheS5mcm9tKHNlbGVjdC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb24pID0+IHtcclxuICAgIGlmIChvcHRpb24udmFsdWUgJiYgb3B0aW9uLnZhbHVlICE9PSAnMCcpIHtcclxuICAgICAgaXRlbnMucHVzaCh7XHJcbiAgICAgICAgdmFsdWU6IG9wdGlvbi52YWx1ZSxcclxuICAgICAgICB0ZXh0OiBvcHRpb24udGV4dCxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBpdGVucztcclxufVxyXG5cclxuLyoqXHJcbiAqIFByb2N1cmEgdW0gaXRlbSBwZWxvIG5vbWUgbm8gZHJvcGRvd24gXCJVc2FyIGl0ZW1cIlxyXG4gKiBcclxuICogQHBhcmFtIG5vbWVJdGVtIC0gTm9tZSBkbyBpdGVtIChleDogXCJDb2xldG9yIGRlIHNhbmd1ZVwiKVxyXG4gKiBAcmV0dXJucyBJRCBkbyBpdGVtIG91IG51bGwgc2UgbsOjbyBlbmNvbnRyYWRvXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYnVzY2FySXRlbVBvck5vbWUobm9tZUl0ZW06IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xyXG4gIGNvbnN0IGl0ZW5zID0gb2J0ZXJJdGVuc0Rpc3Bvbml2ZWlzKCk7XHJcbiAgY29uc3QgaXRlbSA9IGl0ZW5zLmZpbmQoKGkpID0+IFxyXG4gICAgaS50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9tZUl0ZW0udG9Mb3dlckNhc2UoKSlcclxuICApO1xyXG4gIFxyXG4gIHJldHVybiBpdGVtID8gaXRlbS52YWx1ZSA6IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHRyYWkgb3MgY2FtcG9zIFdlYkZvcm1zIGRlIHVtIEhUTUwgc3RyaW5nXHJcbiAqIFxyXG4gKiBAcGFyYW0gaHRtbCAtIEhUTUwgc3RyaW5nIGNvbnRlbmRvIG8gZm9ybXVsw6FyaW8gV2ViRm9ybXNcclxuICogQHBhcmFtIGJvdGFvQ2xpY2FkbyAtIE5vbWUgZG8gYm90w6NvIHF1ZSBmb2kgY2xpY2FkbyAoZXg6IFNlbGVjdG9ycy5maWVsZE5hbWVzLmJ0blVzZUl0ZW0pXHJcbiAqIEByZXR1cm5zIE9iamV0byBjb20gb3MgY2FtcG9zIGRvIGZvcm11bMOhcmlvIG91IG51bGwgc2UgbsOjbyBlbmNvbnRyYXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRyYWlyQ2FtcG9zV2ViRm9ybXNEb0hUTUwoXHJcbiAgaHRtbDogc3RyaW5nLFxyXG4gIGJvdGFvQ2xpY2Fkbz86IHN0cmluZ1xyXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XHJcbiAgLy8gQ3JpYXIgdW0gZWxlbWVudG8gdGVtcG9yw6FyaW8gcGFyYSBmYXplciBvIHBhcnNlIGRvIEhUTUxcclxuICBjb25zdCB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdGVtcERpdi5pbm5lckhUTUwgPSBodG1sO1xyXG5cclxuICBjb25zdCBmb3JtID0gdGVtcERpdi5xdWVyeVNlbGVjdG9yKFNlbGVjdG9ycy53ZWJGb3JtKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XHJcbiAgXHJcbiAgaWYgKCFmb3JtKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ+KaoO+4jyBGb3JtdWzDoXJpbyBXZWJGb3JtcyBuw6NvIGVuY29udHJhZG8gbm8gSFRNTCcpO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjYW1wb3M6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuXHJcbiAgLy8gQ29sZXRhciB0b2RvcyBvcyBpbnB1dHMsIHNlbGVjdHMgZSB0ZXh0YXJlYXMgZG8gZm9ybXVsw6FyaW9cclxuICBjb25zdCBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCBzZWxlY3QsIHRleHRhcmVhJyk7XHJcbiAgXHJcbiAgaW5wdXRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgIGNvbnN0IG5hbWUgPSAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50KS5uYW1lO1xyXG4gICAgaWYgKCFuYW1lKSByZXR1cm47XHJcblxyXG4gICAgLy8gSWdub3JhciBib3TDtWVzIGRlIHN1Ym1pdCBxdWUgbsOjbyBmb3JhbSBjbGljYWRvc1xyXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmIGVsZW1lbnQudHlwZSA9PT0gJ3N1Ym1pdCcpIHtcclxuICAgICAgLy8gU8OzIGluY2x1aXIgbyBib3TDo28gcXVlIGZvaSBlc3BlY2lmaWNhZG8gY29tbyBjbGljYWRvXHJcbiAgICAgIGlmIChib3Rhb0NsaWNhZG8gJiYgbmFtZSA9PT0gYm90YW9DbGljYWRvKSB7XHJcbiAgICAgICAgY2FtcG9zW25hbWVdID0gZWxlbWVudC52YWx1ZSB8fCAnJztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHZhbHVlOiBzdHJpbmc7XHJcblxyXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdjaGVja2JveCcgfHwgZWxlbWVudC50eXBlID09PSAncmFkaW8nKSB7XHJcbiAgICAgICAgLy8gU8OzIGluY2x1aXIgc2UgZXN0aXZlciBtYXJjYWRvXHJcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgdmFsdWUgPSBlbGVtZW50LnZhbHVlIHx8ICcnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm47IC8vIE7Do28gaW5jbHVpciBjaGVja2JveGVzL3JhZGlvcyBuw6NvIG1hcmNhZG9zXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGhpZGRlbiwgdGV4dCwgZXRjLlxyXG4gICAgICAgIHZhbHVlID0gZWxlbWVudC52YWx1ZSB8fCAnJztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpIHtcclxuICAgICAgdmFsdWUgPSBlbGVtZW50LnZhbHVlIHx8ICcnO1xyXG4gICAgICBcclxuICAgICAgLy8gTsOjbyBpbmNsdWlyIHNlbGVjdHMgY29tIHZhbG9yIFwiMFwiIG91IHZhemlvIChleGNldG8gc2UgZm9yIG9icmlnYXTDs3JpbylcclxuICAgICAgaWYgKHZhbHVlID09PSAnMCcgfHwgdmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgLy8gTWFudGVyIGFwZW5hcyBzZSBmb3IgdW0gY2FtcG8gb2JyaWdhdMOzcmlvIGRvIFdlYkZvcm1zXHJcbiAgICAgICAgaWYgKCFuYW1lLnN0YXJ0c1dpdGgoJ19fJykgJiYgIW5hbWUuaW5jbHVkZXMoJ2RkbEN1cnJlbnRDaGFyYWN0ZXInKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xyXG4gICAgICB2YWx1ZSA9IGVsZW1lbnQudmFsdWUgfHwgJyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YWx1ZSA9IChlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFPDsyBhZGljaW9uYXIgY2FtcG9zIGNvbSB2YWxvciBvdSBjYW1wb3Mgb2JyaWdhdMOzcmlvcyBkbyBXZWJGb3Jtc1xyXG4gICAgaWYgKHZhbHVlIHx8IG5hbWUuc3RhcnRzV2l0aCgnX18nKSkge1xyXG4gICAgICBjYW1wb3NbbmFtZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGNhbXBvcztcclxufVxyXG5cclxuLyoqXHJcbiAqIEZheiB1bWEgcmVxdWlzacOnw6NvIEdFVCBwYXJhIGEgcMOhZ2luYSBkZSBpbnRlcmHDp8OjbyBlIHJldG9ybmEgbyBIVE1MXHJcbiAqIFxyXG4gKiBAcGFyYW0gY2hhcmFjdGVySWQgLSBJRCBkbyBwZXJzb25hZ2VtIGFsdm9cclxuICogQHBhcmFtIHNlcnZlciAtIE7Dum1lcm8gZG8gc2Vydmlkb3IgKG9wY2lvbmFsLCBleHRyYWkgZGEgVVJMIGF0dWFsKVxyXG4gKiBAcmV0dXJucyBQcm9taXNlIGNvbSBvIEhUTUwgZGEgcMOhZ2luYSBkZSBpbnRlcmHDp8Ojb1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1c2NhclBhZ2luYUludGVyYWNhbyhcclxuICBjaGFyYWN0ZXJJZDogc3RyaW5nLFxyXG4gIHNlcnZlcj86IHN0cmluZ1xyXG4pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gIGNvbnN0IHVybEluZm8gPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICBcclxuICAvLyBFeHRyYWlyIHNlcnZpZG9yIGRvIGhvc3RuYW1lIGF0dWFsIChleDogXCI3NS5wb3BtdW5kby5jb21cIiAtPiBcIjc1XCIpXHJcbiAgbGV0IGN1cnJlbnRTZXJ2ZXIgPSBzZXJ2ZXI7XHJcbiAgaWYgKCFjdXJyZW50U2VydmVyKSB7XHJcbiAgICBjb25zdCBzZXJ2ZXJNYXRjaCA9IHVybEluZm8uaG9zdG5hbWUubWF0Y2goLyhcXGQrKVxcLnBvcG11bmRvXFwuY29tL2kpO1xyXG4gICAgY3VycmVudFNlcnZlciA9IHNlcnZlck1hdGNoID8gc2VydmVyTWF0Y2hbMV0gOiAnNzUnO1xyXG4gIH1cclxuICBcclxuICBjb25zdCBiYXNlVXJsID0gYCR7dXJsSW5mby5wcm90b2NvbH0vLyR7Y3VycmVudFNlcnZlcn0ucG9wbXVuZG8uY29tYDtcclxuICBjb25zdCB1cmwgPSBgJHtiYXNlVXJsfS9Xb3JsZC9Qb3BtdW5kby5hc3B4L0ludGVyYWN0LyR7Y2hhcmFjdGVySWR9YDtcclxuXHJcbiAgY29uc29sZS5sb2coJ/Cfk6UgQnVzY2FuZG8gcMOhZ2luYSBkZSBpbnRlcmHDp8OjbzonLCB7IHVybCwgY2hhcmFjdGVySWQgfSk7XHJcblxyXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnUmVmZXJlcic6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG4gICAgfSxcclxuICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsIC8vIEluY2x1aXIgY29va2llc1xyXG4gIH0pO1xyXG5cclxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm8gYW8gYnVzY2FyIHDDoWdpbmEgZGUgaW50ZXJhw6fDo286ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBodG1sID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gIHJldHVybiBodG1sO1xyXG59XHJcblxyXG4vKipcclxuICogVXNhIHVtIGl0ZW0gZXNwZWPDrWZpY28gYXDDs3MgYnVzY2FyIGEgcMOhZ2luYSBkZSBpbnRlcmHDp8Ojb1xyXG4gKiBcclxuICogQHBhcmFtIGl0ZW1Ob21lIC0gTm9tZSBkbyBpdGVtIGEgc2VyIHVzYWRvIChleDogXCJEZW50ZXMgZmVpb3MgZmFsc29zXCIpXHJcbiAqIEBwYXJhbSBjaGFyYWN0ZXJJZCAtIElEIGRvIHBlcnNvbmFnZW0gYWx2b1xyXG4gKiBAcGFyYW0gc2VydmVyIC0gTsO6bWVybyBkbyBzZXJ2aWRvciAob3BjaW9uYWwpXHJcbiAqIEByZXR1cm5zIFByb21pc2UgY29tIGEgcmVzcG9zdGEgZGEgcmVxdWlzacOnw6NvXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNhckl0ZW1BcG9zQnVzY2FyKFxyXG4gIGl0ZW1Ob21lOiBzdHJpbmcsXHJcbiAgY2hhcmFjdGVySWQ6IHN0cmluZyxcclxuICBzZXJ2ZXI/OiBzdHJpbmdcclxuKTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gIC8vIDEuIEZhemVyIEdFVCBuYSBww6FnaW5hIGRlIGludGVyYcOnw6NvXHJcbiAgY29uc3QgaHRtbCA9IGF3YWl0IGJ1c2NhclBhZ2luYUludGVyYWNhbyhjaGFyYWN0ZXJJZCwgc2VydmVyKTtcclxuXHJcbiAgLy8gMi4gRXh0cmFpciBjYW1wb3MgV2ViRm9ybXMgZG8gSFRNTCByZXRvcm5hZG8sIGVzcGVjaWZpY2FuZG8gbyBib3TDo28gcXVlIHNlcsOhIGNsaWNhZG9cclxuICBjb25zdCBjYW1wb3MgPSBleHRyYWlyQ2FtcG9zV2ViRm9ybXNEb0hUTUwoaHRtbCwgU2VsZWN0b3JzLmZpZWxkTmFtZXMuYnRuVXNlSXRlbSk7XHJcbiAgXHJcbiAgaWYgKCFjYW1wb3MpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIGV4dHJhaXIgb3MgY2FtcG9zIFdlYkZvcm1zIGRvIEhUTUwgcmV0b3JuYWRvJyk7XHJcbiAgfVxyXG5cclxuICAvLyAzLiBDcmlhciB1bSBlbGVtZW50byB0ZW1wb3LDoXJpbyBwYXJhIHBhcnNlYXIgbyBIVE1MIGUgYnVzY2FyIG8gaXRlbVxyXG4gIGNvbnN0IHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICB0ZW1wRGl2LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgXHJcbiAgY29uc3Qgc2VsZWN0ID0gdGVtcERpdi5xdWVyeVNlbGVjdG9yPEhUTUxTZWxlY3RFbGVtZW50PihcclxuICAgIFNlbGVjdG9ycy5kZGxVc2VJdGVtXHJcbiAgKTtcclxuXHJcbiAgaWYgKCFzZWxlY3QpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignRHJvcGRvd24gZGUgaXRlbnMgbsOjbyBlbmNvbnRyYWRvIG5hIHDDoWdpbmEgZGUgaW50ZXJhw6fDo28nKTtcclxuICB9XHJcblxyXG4gIC8vIDQuIEJ1c2NhciBvIGl0ZW0gcGVsbyBub21lXHJcbiAgbGV0IGl0ZW1JZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgXHJcbiAgQXJyYXkuZnJvbShzZWxlY3Qub3B0aW9ucykuZm9yRWFjaCgob3B0aW9uKSA9PiB7XHJcbiAgICBpZiAob3B0aW9uLnZhbHVlICYmIG9wdGlvbi52YWx1ZSAhPT0gJzAnKSB7XHJcbiAgICAgIGlmIChvcHRpb24udGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGl0ZW1Ob21lLnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgaXRlbUlkID0gb3B0aW9uLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGlmICghaXRlbUlkKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEl0ZW0gXCIke2l0ZW1Ob21lfVwiIG7Do28gZW5jb250cmFkbyBuYSBsaXN0YSBkZSBpdGVucyBkaXNwb27DrXZlaXNgKTtcclxuICB9XHJcblxyXG4gIC8vIDUuIEF0dWFsaXphciBjYW1wb3MgZXNwZWPDrWZpY29zIGRvIFwiVXNhciBpdGVtXCJcclxuICBjYW1wb3NbU2VsZWN0b3JzLmZpZWxkTmFtZXMuZGRsVXNlSXRlbV0gPSBpdGVtSWQ7XHJcbiAgY2FtcG9zW1NlbGVjdG9ycy5maWVsZE5hbWVzLmJ0blVzZUl0ZW1dID0gJ1VzYXIgaXRlbSc7XHJcblxyXG4gIC8vIDYuIENvbnN0cnVpciBVUkwgZGEgaW50ZXJhw6fDo29cclxuICBjb25zdCB1cmxJbmZvID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgXHJcbiAgLy8gRXh0cmFpciBzZXJ2aWRvciBkbyBob3N0bmFtZSBhdHVhbCAoZXg6IFwiNzUucG9wbXVuZG8uY29tXCIgLT4gXCI3NVwiKVxyXG4gIGxldCBjdXJyZW50U2VydmVyID0gc2VydmVyO1xyXG4gIGlmICghY3VycmVudFNlcnZlcikge1xyXG4gICAgY29uc3Qgc2VydmVyTWF0Y2ggPSB1cmxJbmZvLmhvc3RuYW1lLm1hdGNoKC8oXFxkKylcXC5wb3BtdW5kb1xcLmNvbS9pKTtcclxuICAgIGN1cnJlbnRTZXJ2ZXIgPSBzZXJ2ZXJNYXRjaCA/IHNlcnZlck1hdGNoWzFdIDogJzc1JztcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgYmFzZVVybCA9IGAke3VybEluZm8ucHJvdG9jb2x9Ly8ke2N1cnJlbnRTZXJ2ZXJ9LnBvcG11bmRvLmNvbWA7XHJcbiAgY29uc3QgdXJsID0gYCR7YmFzZVVybH0vV29ybGQvUG9wbXVuZG8uYXNweC9JbnRlcmFjdC8ke2NoYXJhY3RlcklkfWA7XHJcblxyXG4gIGNvbnNvbGUubG9nKCfwn5KJIFVzYW5kbyBpdGVtOicsIHtcclxuICAgIGl0ZW1Ob21lLFxyXG4gICAgaXRlbUlkLFxyXG4gICAgY2hhcmFjdGVySWQsXHJcbiAgICB1cmwsXHJcbiAgfSk7XHJcblxyXG4gIC8vZXNwZXJlIDIgc2VndW5kb3NcclxuICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwMCkpO1xyXG5cclxuICAvLyA3LiBFbnZpYXIgZm9ybXVsw6FyaW8gV2ViRm9ybXNcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGVudmlhckZvcm11bGFyaW9XZWJGb3Jtcyh1cmwsIGNhbXBvcyk7XHJcblxyXG4gIC8vIFZlcmlmaWNhciBzZSBmb2kgcmVkaXJlY2lvbmFkbyAoMzAyKVxyXG4gIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDMwMiB8fCByZXNwb25zZS5zdGF0dXMgPT09IDApIHtcclxuICAgIGNvbnN0IGxvY2F0aW9uID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2xvY2F0aW9uJyk7XHJcbiAgICBpZiAobG9jYXRpb24pIHtcclxuICAgICAgY29uc29sZS5sb2coJ+KchSBJdGVtIHVzYWRvIGNvbSBzdWNlc3NvISBSZWRpcmVjaW9uYW5kbyBwYXJhOicsIGxvY2F0aW9uKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXNwb25zZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVzYSB1bSBpdGVtIGRpcmV0YW1lbnRlIGRvIGludmVudMOhcmlvIGNsaWNhbmRvIG5vIGJvdMOjbyBcIlVzYXJcIiBkYSB0YWJlbGFcclxuICogXHJcbiAqIEBwYXJhbSBodG1sSW52ZW50YXJpbyAtIEhUTUwgZGEgcMOhZ2luYSBkZSBpbnZlbnTDoXJpb1xyXG4gKiBAcGFyYW0gbm9tZUl0ZW0gLSBOb21lIGRvIGl0ZW0gYSB1c2FyIChleDogXCJUdWJvIHNhbmd1w61uZW9cIilcclxuICogQHBhcmFtIHNlcnZlciAtIE7Dum1lcm8gZG8gc2Vydmlkb3IgKG9wY2lvbmFsLCBleHRyYWkgZGEgVVJMIGF0dWFsKVxyXG4gKiBAcmV0dXJucyBQcm9taXNlIGNvbSBhIHJlc3Bvc3RhIGRhIHJlcXVpc2nDp8Ojb1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzYXJJdGVtRG9JbnZlbnRhcmlvKFxyXG4gIGh0bWxJbnZlbnRhcmlvOiBzdHJpbmcsXHJcbiAgbm9tZUl0ZW06IHN0cmluZyxcclxuICBzZXJ2ZXI/OiBzdHJpbmdcclxuKTogUHJvbWlzZTxSZXNwb25zZT4ge1xyXG4gIC8vIDEuIEJ1c2NhciBhIGxpbmhhIGRvIGl0ZW0gbm8gaW52ZW50w6FyaW9cclxuICBjb25zdCBsaW5oYUl0ZW0gPSBidXNjYXJMaW5oYUl0ZW1JbnZlbnRhcmlvKGh0bWxJbnZlbnRhcmlvLCBub21lSXRlbSk7XHJcbiAgXHJcbiAgaWYgKCFsaW5oYUl0ZW0pIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSXRlbSBcIiR7bm9tZUl0ZW19XCIgbsOjbyBlbmNvbnRyYWRvIG5vIGludmVudMOhcmlvYCk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWxpbmhhSXRlbS5idG5Vc2UpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQm90w6NvIFwiVXNhclwiIG7Do28gZW5jb250cmFkbyBwYXJhIG8gaXRlbSBcIiR7bm9tZUl0ZW19XCJgKTtcclxuICB9XHJcblxyXG4gIC8vIDIuIEV4dHJhaXIgY2FtcG9zIFdlYkZvcm1zIGRvIEhUTUwgZG8gaW52ZW50w6FyaW9cclxuICBjb25zdCBjYW1wb3MgPSBleHRyYWlyQ2FtcG9zV2ViRm9ybXNEb0hUTUwoaHRtbEludmVudGFyaW8sIGxpbmhhSXRlbS5idG5Vc2UubmFtZSk7XHJcbiAgXHJcbiAgaWYgKCFjYW1wb3MpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTsOjbyBmb2kgcG9zc8OtdmVsIGV4dHJhaXIgb3MgY2FtcG9zIFdlYkZvcm1zIGRvIGludmVudMOhcmlvJyk7XHJcbiAgfVxyXG5cclxuICAvLyAzLiBBZGljaW9uYXIgY29vcmRlbmFkYXMgZG8gY2xpcXVlIGRvIGJvdMOjbyBpbWFnZSAoV2ViRm9ybXMgcmVxdWVyIGlzc28pXHJcbiAgLy8gUXVhbmRvIHZvY8OqIGNsaWNhIGVtIHVtIGlucHV0W3R5cGU9XCJpbWFnZVwiXSwgbyBuYXZlZ2Fkb3IgZW52aWEgY29vcmRlbmFkYXMgWCBlIFlcclxuICAvLyBGb3JtYXRvOiBub21lQm90YW8ueD0wJm5vbWVCb3Rhby55PTBcclxuICBjb25zdCBub21lQm90YW8gPSBsaW5oYUl0ZW0uYnRuVXNlLm5hbWU7XHJcbiAgY2FtcG9zW2Ake25vbWVCb3Rhb30ueGBdID0gJzAnO1xyXG4gIGNhbXBvc1tgJHtub21lQm90YW99LnlgXSA9ICcwJztcclxuXHJcbiAgLy8gNC4gQ29uc3RydWlyIFVSTCBkbyBpbnZlbnTDoXJpb1xyXG4gIGNvbnN0IHVybEluZm8gPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICBcclxuICBsZXQgY3VycmVudFNlcnZlciA9IHNlcnZlcjtcclxuICBpZiAoIWN1cnJlbnRTZXJ2ZXIpIHtcclxuICAgIGNvbnN0IHNlcnZlck1hdGNoID0gdXJsSW5mby5ob3N0bmFtZS5tYXRjaCgvKFxcZCspXFwucG9wbXVuZG9cXC5jb20vaSk7XHJcbiAgICBjdXJyZW50U2VydmVyID0gc2VydmVyTWF0Y2ggPyBzZXJ2ZXJNYXRjaFsxXSA6ICc3NSc7XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IGJhc2VVcmwgPSBgJHt1cmxJbmZvLnByb3RvY29sfS8vJHtjdXJyZW50U2VydmVyfS5wb3BtdW5kby5jb21gO1xyXG4gIGNvbnN0IHVybCA9IGAke2Jhc2VVcmx9L1dvcmxkL1BvcG11bmRvLmFzcHgvQ2hhcmFjdGVyL0l0ZW1zL2A7XHJcblxyXG4gIGNvbnNvbGUubG9nKCfwn6m4IFVzYW5kbyBpdGVtIGRvIGludmVudMOhcmlvOicsIHtcclxuICAgIG5vbWVJdGVtLFxyXG4gICAgaXRlbUlkOiBsaW5oYUl0ZW0uaXRlbUlkLFxyXG4gICAgbm9tZUJvdGFvLFxyXG4gICAgdXJsLFxyXG4gIH0pO1xyXG5cclxuICAvLyA1LiBFbnZpYXIgZm9ybXVsw6FyaW8gV2ViRm9ybXNcclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGVudmlhckZvcm11bGFyaW9XZWJGb3Jtcyh1cmwsIGNhbXBvcyk7XHJcblxyXG4gIC8vIFZlcmlmaWNhciBzZSBmb2kgcmVkaXJlY2lvbmFkbyAoMzAyKSBvdSBzdWNlc3NvICgyMDApXHJcbiAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMzAyIHx8IHJlc3BvbnNlLnN0YXR1cyA9PT0gMCB8fCByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgY29uc3QgbG9jYXRpb24gPSByZXNwb25zZS5oZWFkZXJzLmdldCgnbG9jYXRpb24nKTtcclxuICAgIGlmIChsb2NhdGlvbikge1xyXG4gICAgICBjb25zb2xlLmxvZygn4pyFIEl0ZW0gZG8gaW52ZW50w6FyaW8gdXNhZG8gY29tIHN1Y2Vzc28hIFJlZGlyZWNpb25hbmRvIHBhcmE6JywgbG9jYXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ+KchSBJdGVtIGRvIGludmVudMOhcmlvIHVzYWRvIGNvbSBzdWNlc3NvIScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3BvbnNlO1xyXG59XHJcblxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyoqXHJcbiAqIFVzZXJzY3JpcHQgVGVtcGxhdGUgY29tIFNoYWRvdyBET00gKyBHb29iZXJcclxuICogXHJcbiAqIEVzdGUgw6kgbyBwb250byBkZSBlbnRyYWRhIGRvIHNldSB1c2Vyc2NyaXB0LlxyXG4gKiBFeGVtcGxvIGRlIHVzbyBjb21wbGV0byBkbyBzaXN0ZW1hIGRlIGNvbXBvbmVudGVzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGdldFNoYWRvd0NvbnRhaW5lciB9IGZyb20gJy4vY29yZS9zaGFkb3ctZG9tJztcclxuaW1wb3J0IHsgc2V0dXBHb29iZXIgfSBmcm9tICcuL3V0aWxzL3N0eWxlcyc7XHJcbmltcG9ydCB7IFBvcFNVUywgc2hvd1BvcFNVU01vZGFsIH0gZnJvbSAnLi9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgQWxlcnQgfSBmcm9tICcuL3V0aWxzL3N3ZWV0YWxlcnQnO1xyXG5pbXBvcnQgeyBnZXRDaGFyYWN0ZXJJZCwgZ2V0UG9wbXVuZG9VcmxJbmZvLCBpc0NoYXJhY3RlclBhZ2UgfSBmcm9tICcuL3V0aWxzL2NoYXJhY3Rlci1pZC1leHRyYWN0b3InO1xyXG5pbXBvcnQgeyBjdXJhclBlcnNvbmFnZW0gfSBmcm9tICcuL2FjdGlvbnMvY3VyYXInO1xyXG5pbXBvcnQgeyBjb2xldGFyU2FuZ3VlIH0gZnJvbSAnLi9hY3Rpb25zL2NvbGV0YXItc2FuZ3VlJztcclxuaW1wb3J0IFNlbGVjdG9ycyBmcm9tICcuL3V0aWxzL3NlbGVjdG9ycyc7XHJcblxyXG4vLyBJbmljaWFsaXphciBTaGFkb3cgRE9NIGUgR29vYmVyXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVBcHAoKSB7XHJcbiAgLy8gQ3JpYXIgY29udGFpbmVyIFNoYWRvdyBET00gaXNvbGFkb1xyXG4gIGNvbnN0IHNoYWRvd0NvbnRhaW5lciA9IGdldFNoYWRvd0NvbnRhaW5lcih7XHJcbiAgICBpZDogU2VsZWN0b3JzLnNoYWRvd0NvbnRhaW5lcklkLFxyXG4gICAgbW9kZTogJ29wZW4nLFxyXG4gIH0pOyAgIFxyXG5cclxuICAvLyBDb25maWd1cmFyIEdvb2JlciBwYXJhIHVzYXIgbyBTaGFkb3cgRE9NXHJcbiAgc2V0dXBHb29iZXIoc2hhZG93Q29udGFpbmVyLmdldFJvb3QoKSk7XHJcblxyXG4gIGNvbnNvbGUubG9nKCfinIUgU2hhZG93IERPTSBlIEdvb2JlciBpbmljaWFsaXphZG9zIScpO1xyXG5cclxuICByZXR1cm4gc2hhZG93Q29udGFpbmVyO1xyXG59XHJcblxyXG4vLyBGdW7Dp8OjbyBwYXJhIGV4aWJpciBtb2RhbCBjb20gU3dlZXRBbGVydDJcclxuXHJcbi8vIEZ1bsOnw6NvIHBhcmEgaW5qZXRhciBVSSBubyBzaXRlIGFsdm9cclxuZnVuY3Rpb24gaW5qZWN0TWFpblNjcmlwdEJ1dHRvblVpKCkge1xyXG4gIGNvbnN0IGludGVyY2F0VWxIMyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU2VsZWN0b3JzLmludGVyY2F0VWxIMyk7XHJcbiAgaWYgKGludGVyY2F0VWxIMykge1xyXG4gICAgY29uc29sZS5sb2coJ+KchSBFbGVtZW50byBlbmNvbnRyYWRvOicsIGludGVyY2F0VWxIMyk7XHJcblxyXG4gICAgLy8gQ3JpYXIgY29tcG9uZW50ZSBQb3BTVVNcclxuICAgIGNvbnN0IHBvcFNVUyA9IG5ldyBQb3BTVVMoe1xyXG4gICAgICB0ZXh0OiAn8J+PpSBQb3BTVVMnLFxyXG4gICAgICBvbkNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1BvcFNVUyBjbGljYWRvIScpO1xyXG4gICAgICAgIHNob3dQb3BTVVNNb2RhbCh7XHJcbiAgICAgICAgICBvbkN1cmFyOiBjdXJhclBlcnNvbmFnZW0sXHJcbiAgICAgICAgICBvbkNvbGV0YXJTYW5ndWU6IGNvbGV0YXJTYW5ndWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDcmlhciB1bSB3cmFwcGVyIHBhcmEgbyBjb21wb25lbnRlIChmb3JhIGRvIFNoYWRvdyBET00pXHJcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB3cmFwcGVyLnN0eWxlLm1hcmdpblRvcCA9ICc4cHgnO1xyXG4gICAgd3JhcHBlci5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnOHB4JztcclxuICAgIFxyXG4gICAgLy8gTW9udGFyIG8gUG9wU1VTIG5vIHdyYXBwZXJcclxuICAgIHBvcFNVUy5tb3VudCh3cmFwcGVyKTtcclxuICAgIFxyXG4gICAgLy8gSW5zZXJpciBvIHdyYXBwZXIgbG9nbyBhYmFpeG8gZG8gZWxlbWVudG8gZW5jb250cmFkb1xyXG4gICAgaW50ZXJjYXRVbEgzLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCB3cmFwcGVyKTtcclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ+KchSBQb3BTVVMgaW5qZXRhZG8gYWJhaXhvIGRvIGVsZW1lbnRvIScpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ+KaoO+4jyBFbGVtZW50byBuw6NvIGVuY29udHJhZG86JywgU2VsZWN0b3JzLmludGVyY2F0VWxIMyk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBGdW7Dp8OjbyBwcmluY2lwYWxcclxuZnVuY3Rpb24gbWFpbigpIHtcclxuICBjb25zb2xlLmxvZygn8J+agCBVc2Vyc2NyaXB0IGNhcnJlZ2FkbyEnKTtcclxuXHJcbiAgLy8gVmVyaWZpY2FyIHNlIGVzdMOhIGVtIHVtYSBww6FnaW5hIGRlIHBlcnNvbmFnZW0gZSBleHRyYWlyIElEXHJcbiAgaWYgKGlzQ2hhcmFjdGVyUGFnZSgpKSB7XHJcbiAgICBjb25zdCBjaGFyYWN0ZXJJZCA9IGdldENoYXJhY3RlcklkKCk7XHJcbiAgICBjb25zdCB1cmxJbmZvID0gZ2V0UG9wbXVuZG9VcmxJbmZvKCk7XHJcbiAgICBcclxuICAgIGNvbnNvbGUubG9nKCfwn5OLIEluZm9ybWHDp8O1ZXMgZGEgcMOhZ2luYTonKTtcclxuICAgIGNvbnNvbGUubG9nKCcgIC0gSUQgZG8gUGVyc29uYWdlbTonLCBjaGFyYWN0ZXJJZCk7XHJcbiAgICBjb25zb2xlLmxvZygnICAtIFNlcnZpZG9yOicsIHVybEluZm8uc2VydmVyKTtcclxuICAgIGNvbnNvbGUubG9nKCcgIC0gVVJMOicsIHVybEluZm8uZnVsbFVybCk7XHJcbiAgfVxyXG5cclxuICAvLyBJbmljaWFsaXphciBTaGFkb3cgRE9NIGUgR29vYmVyXHJcbiAgaW5pdGlhbGl6ZUFwcCgpO1xyXG5cclxuICAvLyBJbmpldGFyIFBvcFNVUyBubyBzaXRlXHJcbiAgaW5qZWN0TWFpblNjcmlwdEJ1dHRvblVpKCk7XHJcblxyXG4gIGNvbnNvbGUubG9nKCfinIUgSW5pY2lhbGl6YcOnw6NvIGNvbXBsZXRhIScpO1xyXG4gIFxyXG4gIC8vIEV4ZW1wbG8gZGUgdG9hc3QgZGUgYm9hcy12aW5kYXNcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGNvbnN0IGNoYXJhY3RlcklkID0gZ2V0Q2hhcmFjdGVySWQoKTtcclxuICAgIGlmIChjaGFyYWN0ZXJJZCkge1xyXG4gICAgICBBbGVydC50b2FzdEluZm8oYFVzZXJzY3JpcHQgY2FycmVnYWRvISBJRDogJHtjaGFyYWN0ZXJJZH1gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEFsZXJ0LnRvYXN0SW5mbygnVXNlcnNjcmlwdCBjYXJyZWdhZG8gY29tIHN1Y2Vzc28hJyk7XHJcbiAgICB9XHJcbiAgfSwgMTAwMCk7XHJcbn1cclxuXHJcbi8vIEV4ZWN1dGFyIHF1YW5kbyBvIERPTSBlc3RpdmVyIHByb250b1xyXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG1haW4pO1xyXG59IGVsc2Uge1xyXG4gIG1haW4oKTtcclxufVxyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9