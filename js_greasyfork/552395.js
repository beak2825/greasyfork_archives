// ==UserScript==
// @name         DOI text to Link
// @namespace    greasyfork.org
// @version      1.0
// @description  Convert plain DOI text to clickable links
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552395/DOI%20text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/552395/DOI%20text%20to%20Link.meta.js
// ==/UserScript==

(function () {
  const doiRe = /\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/ig;
  const skip = ['A','CODE','PRE','SCRIPT','STYLE'];

  function replaceDOI(node) {
    if (!node.nodeValue || skip.some(t => node.parentElement?.closest(t))) return;
    if (!doiRe.test(node.nodeValue)) return;
    const html = node.nodeValue.replace(doiRe,
      '<a href="https://doi.org/$1" target="_blank">$1</a>');
    const span = document.createElement('span');
    span.innerHTML = html;
    node.replaceWith(span);
  }

  function scan(root=document.body) {
    document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      .forEach?.(replaceDOI) || (() => {
        let w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
        let n; while(n=w.nextNode()) replaceDOI(n);
      })();
  }

  scan();
  new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(scan)))
    .observe(document.body,{childList:true,subtree:true});
})();
