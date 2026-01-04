// ==UserScript==
// @name         中英文空格排版
// @namespace    https://loongphy.com
// @author       Loongphy
// @version      0.2.1
// @description  中英/数字混排的视觉留白（不改文本）；跳过输入框、代码块和可编辑区域。
// @license      PolyForm-Noncommercial-1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0/
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552915/%E4%B8%AD%E8%8B%B1%E6%96%87%E7%A9%BA%E6%A0%BC%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552915/%E4%B8%AD%E8%8B%B1%E6%96%87%E7%A9%BA%E6%A0%BC%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

(() => {
    if (!(typeof CSS !== "undefined" && CSS.supports("text-autospace: normal")))
        return;
    const s = document.createElement("style");
    s.id = "cjk-latin-autospace-style";
    s.textContent = `
html { text-autospace: normal; }
@supports (text-autospace: ideograph-alpha ideograph-numeric) {
  html { text-autospace: ideograph-alpha ideograph-numeric; }
}
@supports (text-autospace: ideograph-alpha ideograph-numeric punctuation) {
  html { text-autospace: ideograph-alpha ideograph-numeric punctuation; }
}
@supports (text-autospace: ideograph-alpha ideograph-numeric punctuation replace) {
  html { text-autospace: ideograph-alpha ideograph-numeric punctuation replace; }
}
code, pre, kbd, samp {
  text-autospace: no-autospace;
}
`;
    (document.head || document.documentElement).appendChild(s);
})();
