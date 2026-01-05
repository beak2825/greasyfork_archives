// ==UserScript==
// @author     Jerry Chong
// @name       Hardwarezone.com.sg
// @version    0.1
// @description Cleans up Hardwarezone.com.sg forums and price lists
// @namespace   https://github.com/zanglang/hwz
// @icon        http://www.hardwarezone.com.sg/img/icons/hwz.ico
// @include		http*://forums.hardwarezone.com.sg/*
// @include		http*://www.hardwarezone.com.sg/priceLists/preview/*
// @downloadURL https://update.greasyfork.org/scripts/7779/Hardwarezonecomsg.user.js
// @updateURL https://update.greasyfork.org/scripts/7779/Hardwarezonecomsg.meta.js
// ==/UserScript==

/*global unsafeWindow: true, GM_addStyle: true  */

GM_addStyle("td#right-ads,img[src^='/avatars'],div.hwz-ad-postbit,div[id^='hwz_ad_'],\
    div#masthead,div#posts td.alt1 > div:not([id^='post_message']),\
    div#sponsored-links,table#forum-ads-table + div,div#footer,div#floating-toolbar { display: none !important; }\
    #canvas.fixed { width: 100% !important; }\
    #plBrochureImageContainer > iframe { width: 100% !important; height: 800px !important; }\
    #canvasPrice div.contentWrapB { max-width: none !important; }\
");
