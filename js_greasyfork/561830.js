// ==UserScript==
// @name         GitHub PR Preview Components -> pnpm up command
// @namespace    https://github.com/kong-konnect/konnect-ui-apps
// @version      0.0.1
// @description  Clone clipboard-copy in a specific PR comment and add a pnpm up -r command
// @author       ChatGPT
// @match        https://github.com/Kong/public-ui-components/pull/*
// @match        https://github.com/Kong/kongponents/pull/*
// @match        https://github.com/kong-konnect/shared-ui-components/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561830/GitHub%20PR%20Preview%20Components%20-%3E%20pnpm%20up%20command.user.js
// @updateURL https://update.greasyfork.org/scripts/561830/GitHub%20PR%20Preview%20Components%20-%3E%20pnpm%20up%20command.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const TARGET_H2_TEXT = 'Preview components from this PR in consuming application';
  const MARK_ATTR = 'data-pnpm-up-inserted';

  const COMMAND_SVG = `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-command-palette js-clipboard-copy-icon m-2">
  <path d="m6.354 8.04-4.773 4.773a.75.75 0 1 0 1.061 1.06L7.945 8.57a.75.75 0 0 0 0-1.06L2.642 2.206a.75.75 0 0 0-1.06 1.061L6.353 8.04ZM8.75 11.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z"></path>
</svg>`.trim();

  function normalizeText(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function buildPnpmUpValue(originalValue) {
    const pkgs = (originalValue || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (!pkgs.length) return null;
    return `pnpm up -r ${pkgs.join(' ')}`;
  }

  function findMatchingCommentBodies(root = document) {
    const bodies = Array.from(root.querySelectorAll('.comment-body'));
    return bodies.filter((body) => {
      const h2s = Array.from(body.querySelectorAll('h2'));
      return h2s.some((h2) => normalizeText(h2.textContent) === TARGET_H2_TEXT);
    });
  }

  function replaceIconInClipboardCopy(clipboardCopy) {
    const oldSvg = clipboardCopy.querySelector('svg.octicon-copy');
    if (!oldSvg) return;

    const tpl = document.createElement('template');
    tpl.innerHTML = COMMAND_SVG;
    const newSvg = tpl.content.firstElementChild;
    if (!newSvg) return;

    oldSvg.replaceWith(newSvg);
  }

  function insertForOneCodeblock(clipboard) {
    if (!(clipboard instanceof Element)) return;

    // One codeblock insert once: mark the original clipboard-copy node.
    if (clipboard.hasAttribute(MARK_ATTR)) return;

    const originalValue = clipboard.getAttribute('value') || '';
    const pnpmValue = buildPnpmUpValue(originalValue);
    if (!pnpmValue) return;

    const clone = clipboard.cloneNode(true);
    clone.setAttribute('value', pnpmValue);
    clone.classList.remove('m-2')
    clone.classList.add('my-2')

    // Replace the copied SVG icon in the clone.
    replaceIconInClipboardCopy(clone);

    // Place right before the original <clipboard-copy>.
    clipboard.insertAdjacentElement('beforebegin', clone);

    // Mark so we do not insert again for this codeblock.
    clipboard.setAttribute(MARK_ATTR, 'true');
  }

  function process(root = document) {
    const bodies = findMatchingCommentBodies(root);
    for (const body of bodies) {
      const clipboards = Array.from(body.querySelectorAll('clipboard-copy'));
      for (const clipboard of clipboards) {
        insertForOneCodeblock(clipboard);
      }
    }
  }

  // Initial run
  process(document);

  // Observe PR page updates (GitHub loads parts dynamically)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        process(node);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();