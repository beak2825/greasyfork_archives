// ==UserScript==
// @name         Fix YouTube embeds in Feedly (Firefox preemptive patch)
// @namespace    https://feedly.com/
// @version      2.0
// @description  Fix broken YouTube video embeds in Feedly for Firefox by adding referrerpolicy before iframe creation.
// @author       Lucian NEAG (ChatGPT 5 Instant)
// @match        https://feedly.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554868/Fix%20YouTube%20embeds%20in%20Feedly%20%28Firefox%20preemptive%20patch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554868/Fix%20YouTube%20embeds%20in%20Feedly%20%28Firefox%20preemptive%20patch%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const YT_REGEX = /youtube\.com/;

  const origCreateElement = Document.prototype.createElement;
  Document.prototype.createElement = function (...args) {
    const el = origCreateElement.apply(this, args);
    if (args[0]?.toLowerCase() === 'iframe') {
      const origSetAttribute = el.setAttribute;
      el.setAttribute = function (name, value) {
        origSetAttribute.call(this, name, value);
        if (name === 'src' && YT_REGEX.test(value)) {
          if (!this.hasAttribute('referrerpolicy')) {
            this.setAttribute('referrerpolicy', 'origin-when-cross-origin');
          }
        }
      };
    }
    return el;
  };

  const origInsertHTML = Element.prototype.insertAdjacentHTML;
  Element.prototype.insertAdjacentHTML = function (position, html) {
    if (html && html.includes('<iframe')) {
      html = html.replace(
        /<iframe([^>]+src="[^"]*youtube\.com[^"]*")/gi,
        (match, attrs) => {
          return match.includes('referrerpolicy')
            ? match
            : `<iframe${attrs} referrerpolicy="origin-when-cross-origin"`;
        }
      );
    }
    return origInsertHTML.call(this, position, html);
  };

  const origSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
  Object.defineProperty(Element.prototype, 'innerHTML', {
    set(html) {
      if (typeof html === 'string' && html.includes('<iframe')) {
        html = html.replace(
          /<iframe([^>]+src="[^"]*youtube\.com[^"]*")/gi,
          (match, attrs) => {
            return match.includes('referrerpolicy') ? match : `<iframe${attrs} referrerpolicy="origin-when-cross-origin"`;
          }
        );
      }
      return origSetter.call(this, html);
    }
  });

  console.log('[Feedly Fix] Preemptive YouTube iframe patch active');
})();
