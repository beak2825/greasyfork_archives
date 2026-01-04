// ==UserScript==
// @Author       iSlippedOnThinAir
// @name         FritzBox Darkmode
// @namespace    iSlippedOnThinAir
// @version      1.3
// @description  ALMOST proper dark mode for the fritz.box web UI
// @license      MIT
// @match        http://fritz.box/*
// @match        https://fritz.box/*
// @match        http://192.168.178.1/*
// @match        https://192.168.178.1/*
// @match        http://169.254.1.1/*
// @match        https://169.254.1.1/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553760/FritzBox%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/553760/FritzBox%20Darkmode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Dark mode variable values
  const MAIN_BG = 'rgb(25,25,25)';
  const VARS = {
    '--white-100': 'rgb(40,40,40)',
    '--charcoal-gray-100': 'rgb(70,70,70)',
    '--color-text': 'rgb(200,200,200)',
    '--color-text-bright': 'rgb(230,230,230)',
    '--rice-gray-100': 'rgb(30,30,30)'
  };

  //CSS injected into open shadow roots and document
  const cssForOpenShadows = `
    :host, * {
      color: ${VARS['--color-text']} !important;
      -webkit-text-fill-color: ${VARS['--color-text']} !important;
    }

    /*Apply .borderColorFix*/
    .borderColorFix {
      background-color: rgb(40,40,40) !important;
      --charcoal-gray-tints-3-tint: rgb(40,40,40) !important;
    }

    /*Fix white bar behind main buttons*/
    .main-buttons,
    .main-buttons--visible {
      background-color: ${MAIN_BG} !important;
      --white-90: ${MAIN_BG} !important;
    }

    /*Fix light background behind content (ground)*/
    .ground,
    .ground[data-v-4020b471] {
      background-color: ${MAIN_BG} !important;
      --rice-gray-100: ${MAIN_BG} !important;
    }
  `;

  function applyRootVars() {
    const docEl = document.documentElement;
    if (!docEl) return;
    docEl.style.setProperty('background-color', MAIN_BG);
    Object.entries(VARS).forEach(([k,v]) => docEl.style.setProperty(k,v));
  }

  function injectStyleIntoRoot(root) {
    if (!root || !root.querySelector) return;
    if (root.querySelector('#dark-fritz-style')) return;
    try {
      const style = document.createElement('style');
      style.id = 'dark-fritz-style';
      style.textContent = cssForOpenShadows;
      if (root === document) {
        (document.head || document.documentElement).prepend(style);
      } else {
        root.prepend(style);
      }
    } catch (e) {}
  }

  function setVarsOnHost(el){
    if (!el || !el.style) return;
    Object.entries(VARS).forEach(([k,v]) => el.style.setProperty(k,v,'important'));
    el.style.setProperty('color', VARS['--color-text'],'important');
    el.style.setProperty('-webkit-text-fill-color', VARS['--color-text'],'important');
  }

  function crawlAndPatch(root) {
    try {
      applyRootVars();
      injectStyleIntoRoot(document);

      const all = Array.from((root.querySelectorAll && root.querySelectorAll('*')) || []);
      all.forEach(el => {
        const tag = (el.tagName || '').toLowerCase();
        if (tag.includes('-')) setVarsOnHost(el);
        if (el.shadowRoot) {
          injectStyleIntoRoot(el.shadowRoot);
          setVarsOnHost(el);
          crawlAndPatch(el.shadowRoot);
        }
      });
    } catch(e) {}
  }

  //Not sure if this is actually needed but i was to lazy to test
  //Initial run
  crawlAndPatch(document);

  //Observe for dynamic elements
  new MutationObserver(() => crawlAndPatch(document))
    .observe(document.documentElement || document, { childList: true, subtree: true });

  //Manual re-run helper
  window.__fritz_darkmode_rerun = () => crawlAndPatch(document);

})();
