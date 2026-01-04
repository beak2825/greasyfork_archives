// ==UserScript==
// @name               Text Autospace
// @name:zh-CN         文本自动间距
// @name:zh-TW         文本自動間距
// @version            1.0.0
// @description        Set text autospace for documents.
// @description:zh-CN  为页面设置文本自动间距。
// @description:zh-TW  為頁面設定文本自動間距。
// @author             Kevin Deng <sxzz@sxzz.moe>
// @homepage           https://github.com/sxzz/userscripts
// @supportURL         https://github.com/sxzz/userscripts/issues
// @license            MIT
// @contributionURL    https://github.com/sponsors/sxzz
// @run-at             document-body
// @include            *
// @grant              GM_addStyle
// @namespace          https://github.com/sxzz/userscripts/blob/main/dist/text-autospace.user.js
// @downloadURL https://update.greasyfork.org/scripts/552916/Text%20Autospace.user.js
// @updateURL https://update.greasyfork.org/scripts/552916/Text%20Autospace.meta.js
// ==/UserScript==
(function() {
	const css = String.raw;
	GM_addStyle(css`
  :root {
    text-autospace: normal;
  }
`);
})();
