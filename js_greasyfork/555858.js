// ==UserScript==
// @name        ASMR Blocker
// @namespace   Violentmonkey Scripts
// @match        http://*.youtube.com/
// @match        http://youtube.com/
// @match        https://*.youtube.com/
// @match        https://youtube.com/
// @grant       none
// @version     1.2
// @license     MIT
// @author      levinion
// @description Block ASMR and save your Youtube recommand list
// @downloadURL https://update.greasyfork.org/scripts/555858/ASMR%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/555858/ASMR%20Blocker.meta.js
// ==/UserScript==

const blocklist = ["asmr", "男性向け", "耳舐め", "ear", "vtuber", "雑談", "無料", "耐久", "3dio"];

const block_if = (node) => {
  if (node.tagName !== "YTD-RICH-ITEM-RENDERER") {
    return;
  }
  node.querySelectorAll('[title]').forEach(e => {
    const title = e.title.trim().toLowerCase();
    let in_blacklist = blocklist.some(word => {
      return title.includes(word);
    });
    if (in_blacklist) {
      console.log("hide: " + title);
      node.style.display = "none";
      return;
    }
  });
}

const main = () => {
  const config = { childList: true, subtree: true };
  const callback = (mutationsList, _observer) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          block_if(node);
        }
      })
    }
  };
  const observer = new MutationObserver(callback);
  const root = document.body;
  observer.observe(root, config);
}

main();