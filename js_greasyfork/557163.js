// ==UserScript==
// @name         百度AI手机版
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  百度AI网页手机版
// @author       happmaoo
// @license MIT
// @match        https://chat.baidu.com/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557163/%E7%99%BE%E5%BA%A6AI%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/557163/%E7%99%BE%E5%BA%A6AI%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==
function viewport() {
    if (document.querySelector('meta[name="viewport"]')) {
      return;
    }
    const el = document.createElement("meta");
    el.name = "viewport";
    el.content = "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no";
    document.head.append(el);
  }

(function() {
    'use strict';
viewport();

/*普通页面*/
var mycss = `
body{min-width:auto!important;background:#fff!important;}
.chat-container-header,.new-dashboard,.chat-voice-input-mic-icon{display:none!important;}
#conversation-flow-content{max-width:100%!important;}
#chat-input-main{width:auto!important;}
.chat-input-box-pc{ margin: 0 0 100px 0!important;}
*{min-width:0px!important;}
#new-page>div{align-items: unset!important;}
`;

GM_addStyle(mycss);












})();
