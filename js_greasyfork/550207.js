// ==UserScript==
// @name         Google AI Summary ahh thing nuker
// @namespace    http://tampermonkey.net/
// @version      1.1-bugfix-passive
// @author DEVKKO
// @license IDGAFPL
// @description Fuck that shit.
// @match       https://www.google.com/search*
// @run-at document-body
// @run-in normal-tabs
// @run-in incognito-tabs
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550207/Google%20AI%20Summary%20ahh%20thing%20nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/550207/Google%20AI%20Summary%20ahh%20thing%20nuker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const processedTargets = new WeakSet();
  const processedSvgs = new WeakSet();

  function getAncestor(element, levels) {
    let node = element;
    for (let i = 0; i < levels && node; i++) {
      node = node.parentElement;
    }
    return node || null;
  }

  function checkParentStyle(parent) {
    const style = (parent.getAttribute('style') || '').toLowerCase();
    // Be tolerant: accept "glow:1" as requested, and common variants of flex-grow:1
    return (
      style.includes('glow:1') ||
      style.includes('flex-grow:1') ||
      /flex[-\s]?grow\s*:\s*1\b/.test(style)
    );
  }

  function hasAttrOrHtml(el, name) {
    if (!el || !(el instanceof Element)) return false;
    return el.hasAttribute(name) || (el.outerHTML && el.outerHTML.includes(name));
  }

  function matchesTargetSvg(svg) {
    if (!(svg instanceof SVGElement)) return false;
    if (
      svg.getAttribute('height') !== '24' ||
      svg.getAttribute('width') !== '24' ||
      svg.getAttribute('aria-hidden') !== 'true'
    ) return false;

    const parent = svg.parentElement;
    if (!parent || !checkParentStyle(parent)) return false;

    const grand = parent.parentElement;
    if (!grand || !hasAttrOrHtml(grand, 'jsname')) return false;

    const great = grand.parentElement;
    if (!great) return false;
    const required = ['jscontroller', 'jsname', 'jsmodel', 'data-gt', 'decode-data-ved'];
    return required.every(n => hasAttrOrHtml(great, n));
  }

  function nukeFrom(svg) {
    if (processedSvgs.has(svg)) return;
    const parent = svg.parentElement;
    if (!parent) return;
    // Nuke the parent content 13 layers above the parent of the SVG
    const target = getAncestor(parent, 13);
    if (!target || processedTargets.has(target)) return;
    try {
      target.innerHTML = '';
      target.setAttribute('data-owo-nuked', '1');
      processedTargets.add(target);
      processedSvgs.add(svg);
    } catch (_) {
      // no-op
    }
  }

  function scan(root = document) {
    try {
      const svgs = root.querySelectorAll('svg[height="24"][width="24"][aria-hidden="true"]');
      for (const svg of svgs) {
        if (matchesTargetSvg(svg)) nukeFrom(svg);
      }
    } catch (_) {
      // no-op
    }
  }

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const node of m.addedNodes) {
          if (node && node.nodeType === 1) scan(node);
        }
      } else if (m.type === 'attributes') {
        const t = m.target;
        if (t && t.nodeType === 1) scan(t);
      }
    }
  });

  scan();

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      'style',
      'height',
      'width',
      'aria-hidden',
      'jsname',
      'jscontroller',
      'jsmodel',
      'data-gt',
      'decode-data-ved'
    ]
  });
})();


