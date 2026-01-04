// ==UserScript==
// @name         Douban+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Minimal Douban UI
// @author       the3ash
// @match        https://www.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553153/Douban%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/553153/Douban%2B.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(`
.global-nav{
  position: fixed !important;
  z-index: 99 !important;
  width: 100% !important;
  top:0 !important;
}

.nav-primary{
  margin-top: 28px !important;
}

#db-global-nav{
  background-color: #edf4ed00 !important;
  margin-top: 4px !important;
}

.global-nav-items{
  margin-left: 8px !important;
}

#db-global-nav a:link, #db-global-nav a:visited, #db-global-nav a:hover, #db-global-nav a:active{
  color:#072 !important;
}

#db-global-nav a:hover{
  background-color:rgba(0, 0, 0, 0.06) !important;
  border-radius:8px !important;
}

#db-global-nav .arrow{
  border-color: #072 transparent transparent transparent !important;
}

#db-global-nav .more-active .bn-more span{
  color:#072 !important;
}

#db-nav-sns .inp,#db-nav-sns .inp input{
  border-radius:8px !important;
}

.inp-btn{
  display: none !important;
}

#statuses{
  left: 150px !important;
}

.ui-sortable{
  padding-left: 0px !important;
}

#friend p{
  display: none !important;
}

#db-global-nav .more-active .more-items{
  width: 88%;
  padding: 6px !important;
  border-radius: 12px !important;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

#db-global-nav .nav-user-account .more-items{
  left:0px !important;
  top:32px !important;
}

#top-nav-notimenu{
  width: 280px !important;
  top: 32px !important
}

#db-global-nav .top-nav-reminder .more-items .bd{
  padding-top: 0px !important;
}

#db-global-nav .top-nav-reminder .more-items .ft a{
  border-radius: 8px !important;
  margin-top: 8px !important;
}

.notify-mod{
  display: none !important;
}

#db-isay{
  display: none !important;
}

#hot-topics-mod{
  display: none !important;
}


#statuses + #friend{
  display: block !important;
}

.aside #friend{
  display: none !important;
}

#anony-time{
  display: none !important;
}

#fp-sites{
  display: none !important;
}

.DRE-personal-topic-editor{
  display: none !important;
}

.global-nav-items li:nth-child(n+5) {
    display: none !important;
}

#db-nav-sns{
  display: none !important;
}

.top-nav-doubanapp{
  display: none !important;
}

#wrapper{
  margin-top: 44px !important;
}

#apps {
  display: none !important;
}

#review {
  display: none !important;
}

    `);
})();
