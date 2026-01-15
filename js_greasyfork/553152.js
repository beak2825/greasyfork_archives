// ==UserScript==
// @name         Weibo+
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Minimal Weibo UI
// @author       the3ash
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553152/Weibo%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/553152/Weibo%2B.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(`
html,
body,
div[class*="_wrap_"] {
  background-color: #fff !important;
}

footer div[class*="_wrap_"] {
  background: none !important;
}

article div[class*="_wrap_"] {
  border-top-left-radius:12px !important;
  border-top-right-radius:12px !important;
}

[class*="_retweet_"] {
  margin: 16px -8px !important;
  padding-top:12px !important;
  background-color: ##0000000A !important;
  border:0.5px solid #0000001A !important;
  border-radius:12px !important;
}

[class*="_full_"]{
  width: 800px !important;
}

[class*="_side_"] {
  width: 168px !important;
  position: fixed;
  left: 0;
}

a > [role="link"][class*="_main_"] {
  border-radius: 10px !important;
}

[class^="_wrap_"][role="navigation"]{
  border-top: none !important;
}

[class*="_inner_"]{
  border: none !important;
}

[class*="_search_"] .woo-input-hasIcon{
  position: fixed !important;
  left: 16px !important;
  width: 160px !important;
  opacity: 80% !important;
  padding-left: 36px !important;
}

[class*="_search_"] .woo-pop-main{
  position: fixed !important;
  left:24px !important;
  width: 320px !important;
  height: 360px !important;
  margin-top: 44px !important;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.08) !important;
}

.woo-input-icon{
  left:12px !important;
  opacity: 0.36;
  color: #606060 !important;
}

[class*="_nofold_"]{
  position: fixed !important;
  right: 16px !important;
  margin-right: 0 !important;
}

[role="navigation"] .woo-box-flex.woo-box-alignCenter.woo-box-justifyCenter[class*="_mid_"] {
  position: absolute !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

[class*="_backTop_"]{
  margin-left: 0 !important;
  left: auto !important;
  right: -28px !important;
  bottom: 12px !important;
}

[class*="_barForcus_"]{
  padding-top: 10px !important;
  background-color: #fff !important;
  box-shadow: none !important;
}

[class*="_bar_"]{
  visibility: visible !important;
}

[class*="_tab_"]{
  border-radius: 10px !important;
}

[class*="_item_"]{
  border-radius: 10px !important;
}

.woo-panel-main{
  border-radius: 12px !important;
}

[class*="_Bar_transparent_"]{
  background-color: rgba(255, 255, 255, 0) !important;
  background-image: none !important;
}

[class*="_Profile_card_"]{
  margin-top: 8px !important;
}

[class*="_ProfileHeader_pic_"]{
  height: 80px !important;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0)) !important;
  border-radius: 12px 12px 0 0 !important;
  pointer-events: none !important;
}

[class*="_Bar_title_"]{
  font-size: 16px !important;
  line-height: 24px !important;
}

[class*="_Bar_back_"]{
  font-size: 18px !important;
  font-weight: 700 !important;
  margin-right: 4px!important;
}

.wbpro-form{
  background-color: #f7f7f7 !important;
}

.woo-picture-cover{
  border: none !important;
}

[class*="_Profile_btn_"]{
  padding: 6px 24px !important;
}

[class*="_visable_"] {
  padding-top: 12px !important;
}

/* Hidden elements */
#homeWrap [class*="_visable_"],
#homeWrap [class*="_dispear_"],
[class*="_logo_"],
.woo-pop-wrap-main > :nth-child(odd),
.woo-badge-bubble,
[class*="readnum_"],
[class*="_ProfileHeader_pic_"] .woo-picture-img,
[class*="_timer_desc_"],
[class*="_sideMain_"],
.woo-panel-main[class*="_publishCard_"],
.wbpro-screen-v2,
a[href="/hot"],
a[href="/tv"],
[class*="_title_"],
[class*="_none_"]:nth-of-type(n+3),
[class*="_split_"],
[class*="_editText_"],
.woo-button-main.xs,
[class*="_uslogo_"],
[class*="_readWrap_"],

.woo-pop-ctrl > div[class*="_sipt_"] {
  display: none !important;
}

`);

  function filterTabs() {
    const tabs = document.querySelectorAll(
      '.woo-tab-nav.woo-box-justifyAround .woo-tab-item-main'
    );
    const allowed = ['微博', '视频', '相册'];

    tabs.forEach((tab) => {
      const text = tab.textContent.trim();
      if (text && !allowed.includes(text)) {
        tab.style.cssText = 'display: none !important;';
      }
    });
  }

  filterTabs();

  const observer = new MutationObserver(filterTabs);
  observer.observe(document.body, { childList: true, subtree: true });
})();
