// ==UserScript==
// @name         添加盘古之白
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为网页所有文字高性能添加盘古之白
// @author       Lainbo
// @match        *://*/*
// @grant        none
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNDQ5LjUgNTEyaC0zODdDMjggNTEyIDAgNDg0IDAgNDQ5LjV2LTM4N0MwIDI4IDI4IDAgNjIuNSAwaDM4N0M0ODQgMCA1MTIgMjggNTEyIDYyLjV2Mzg3YzAgMzQuNS0yOCA2Mi41LTYyLjUgNjIuNXoiIGZpbGw9IiMxNjVkZmYiLz48cGF0aCBkPSJNMzE4LjYgNDIyLjlIMTkzLjRjLTExLjUgMC0yMC45LTkuMy0yMC45LTIwLjlWMjc2LjloLTU0bDE3LjcgMTcuN2M4LjEgOC4xIDguMSAyMS40IDAgMjkuNS04LjEgOC4yLTIxLjQgOC4xLTI5LjUgMGwtNTMuMy01My4zYy0xLjktMS45LTMuMy00LjEtNC4zLTYuNC0xLjEtMi41LTEuNi01LjItMS42LTguMSAwLTIuOS42LTUuNiAxLjYtOC4xIDEtMi4zIDIuNC00LjUgNC4zLTYuNGw1My4zLTUzLjNjOC4xLTguMSAyMS40LTguMSAyOS41IDAgOC4xIDguMSA4LjEgMjEuNCAwIDI5LjVsLTE3LjcgMTcuN2g1NFYxMDkuOWMwLTExLjUgOS4zLTIwLjkgMjAuOS0yMC45aDEyNS4yYzExLjUgMCAyMC45IDkuMyAyMC45IDIwLjl2MTI1LjJoNTRMMzc3IDIxOC43Yy04LjEtOC4xLTguMS0yMS40IDAtMjkuNSA4LjEtOC4xIDIxLjQtOC4xIDI5LjUgMGw1Mi4xIDUyLjFjMS45IDEuOSAzLjMgNC4xIDQuMyA2LjQgMS4xIDIuNSAxLjYgNS4yIDEuNiA4LjEgMCAyLjktLjYgNS42LTEuNiA4LjEtMSAyLjMtMi40IDQuNS00LjMgNi40bC01Mi4xIDUyLjFjLTguMSA4LjEtMjEuNCA4LjEtMjkuNSAwLTguMS04LjEtOC4xLTIxLjQgMC0yOS41bDE2LjQtMTYuNGgtNTR2MTI1LjJjLjEgMTEuOS05LjMgMjEuMi0yMC44IDIxLjJ6bS0xMDQuMy00MS43aDgzLjVWMTMwLjhoLTgzLjV2MjUwLjR6IiBmaWxsPSIjZmZmIi8+PC9zdmc+
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553438/%E6%B7%BB%E5%8A%A0%E7%9B%98%E5%8F%A4%E4%B9%8B%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/553438/%E6%B7%BB%E5%8A%A0%E7%9B%98%E5%8F%A4%E4%B9%8B%E7%99%BD.meta.js
// ==/UserScript==

(function () {
  const css = 'body{text-autospace:normal;}';
  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const styleNode = document.createElement('style');
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector('head') || document.documentElement).appendChild(
      styleNode,
    );
  }
})();