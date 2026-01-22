// ==UserScript==
// @name         おーぷん2ch 軽量化
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license	CC0-1.0
// @description  軽量化するぞい
// @match        https://*.open2ch.net/test/read.cgi/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563481/%E3%81%8A%E3%83%BC%E3%81%B7%E3%82%932ch%20%E8%BB%BD%E9%87%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563481/%E3%81%8A%E3%83%BC%E3%81%B7%E3%82%932ch%20%E8%BB%BD%E9%87%8F%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('head').append(`
<style>
.tuhobox,.headline_div,.headline_bar,.headlineMessage,
.headlineCommentSelected,.headline-search-bt,
.headlineStopBt,.headlineReplayBt,.headlineZoomBt,
.headlineSmallBt,#headline,#headline_frame,
.komediv,.kome,.kome_options,.radio,.paypay,
.kokoku,.copyright,.copyrights,
iframe[src*="ad"],iframe[src*="headline"],
.oekakiCanvas,.paintTools,.room,
.option_wrapper,.MODAL,.prev_box{display:none!important}
body{background:#eee;margin:8px;font-size:12pt}
.thread{max-width:780px;margin:auto}
dl{background:#fff;margin:8px 0;padding:12px;
   border:1px solid #ddd;border-radius:4px}
dt{background:#f5f5f5;margin:-12px -12px 8px;
   padding:6px;border-radius:4px 4px 0 0}
dd{line-height:1.8;word-break:break-word}
.name{color:#228811;font-weight:bold}
.id{color:#00e}
img{max-width:100%;height:auto;margin:8px 0;border-radius:3px}
.form_fix,.formset{
  position:sticky;bottom:0;background:#e6e6e6;
  border:1px solid #ccc;padding:10px;border-radius:4px
}
#MESSAGE{width:100%;min-height:80px;font-size:12pt}
#submit_button{width:100%;padding:10px;font-size:13pt}
</style>
`);
    function purge() {
        $('.komediv,.kome,#headline,.headline_div,.headline_bar').remove();
        $('iframe').remove();
    }
    purge();
    const observer = new MutationObserver(() => purge());
    observer.observe(document.body, { childList: true, subtree: true });
})();
