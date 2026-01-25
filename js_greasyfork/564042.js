// ==UserScript==
// @author      daniel.z.tg
// @description Forces all MathJax-using sites to output not images but HTML with selectable text
// @grant       GM_addStyle
// @license     Unlicense
// @name        MathJax selectable text
// @namespace   https://github.com/danielzgtg
// @version     202601251140110001
// @match       https://*/*
// @downloadURL https://update.greasyfork.org/scripts/564042/MathJax%20selectable%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/564042/MathJax%20selectable%20text.meta.js
// ==/UserScript==

/*
 * Features:
 * - Makes MathJax-outputted equations selectable on all websites
 * - Hooks into MathJax to change its settings, which should compatibly integrate into all versions
 * - Allows disabling webfonts in Firefox settings or uBlock Origin
 *
 * Anti-features:
 * - "Math Processing Error" is very rare now, but if it happens, just temporarily disable this userscript
 * - The new rendered math is HTML so it looks uglier than the LaTeX-looking images
 */

GM_addStyle(`
.katex .katex-mathml
  position:initial !important;
}
.katex-html
  display:none !important;
}
.MathJax {
  > nobr {
    display: none !important;
  }
  > span.MJX_Assistive_MathML {
    clip: revert !important;
    overflow: revert !important;
    position: revert !important;
    width: revert !important;
    height: revert !important;
    padding: revert !important;
    display: revert !important;
    user-select: revert !important;
    font-size: 120% !important;
  }
}
`);

location.host === "www.researchgate.net" && GM_addStyle(`
div#pdf-to-html-container div.c.x1.y1.w2.h2 {
  overflow:initial!important;
}
`);

(() => {
  // Quora delays loading math, so MutationObserver's needed to wait for it
  const observer = new MutationObserver(callback);
  const observerOptions = { childList: true };
  function callback() {
    observer.disconnect();
    setTimeout(deferred, 0);
  }
  callback();
  function deferred() {
    const Hub = document.defaultView.MathJax?.Hub;
    if (!Hub) {
      observer.observe(document.head, observerOptions);
      return;
    }
    const OldConfig = Hub.Config.bind(Hub);
    const mixin = {
      availableFonts: null,
      preferredFont: null,
      webFont: null,
      fonts: null,
      imageFont: null,
      // Shouldn't matter much with webfonts disabled
      // I prefer "Noto Sans", but I put "Arial" here in case Windows users need it
      undefinedFamily: 'Arial',
    };
    OldConfig({ 'HTML-CSS': { ...mixin }, });
    Hub.Config = siteMathJaxConfig => {
      const overridenMathJaxConfig = {...siteMathJaxConfig};
      if ('HTML-CSS' in overridenMathJaxConfig) {
        overridenMathJaxConfig['HTML-CSS'] = {
          ...overridenMathJaxConfig['HTML-CSS'],
          ...mixin,
        }
      }
      OldConfig(overridenMathJaxConfig);
    };
  }
})();