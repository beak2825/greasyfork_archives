// ==UserScript==
// @name         cleanTPlink
// @namespace    http://tampermonkey.net/
// @version      0.36
// @description  clean tp-link router admin more clear
// @author       mooring@codernotes.club
// @match        192.168.0.1
// @match        192.168.1.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.24
// @grant        none
// @license      MIT
// @run-at       document.body
// @downloadURL https://update.greasyfork.org/scripts/551349/cleanTPlink.user.js
// @updateURL https://update.greasyfork.org/scripts/551349/cleanTPlink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        'body{height:calc(100vh - 20px)!important}',
        '#QRCode{display:none}',
        '#bConCnt,div.appsMarketCon,div.appInstalledCon{width:unset!important;}',
        'ul[id^="menu"] li{width:100%!important;margin-left:10px!important;}',
        'ul[id^="menu"] li > i.menuC{right:30px!important}',
        '#bConFun{height: 50px!important;min-height:unset!important}',
        '#basicMenuUl i[class^="menu"]{display:none!important}',
        'ul.basicMenuUl{height:50px!important;z-index:1003}',
        'ul.basicMenuUl h2{padding-top:0.5em!important}',
        'ul.basicMenuUl li{height:50px!important}',
        'ul.basicMenuUl li div{transform:translateY(-12px)!important}',
        '#head,#headLCnt,#foot{display:none!important}',
        '#basicContent{height: calc(100% - 50px)!important;min-height:auto}',
        'div.menuCon{height: calc(100% - 50px)!important;width:100%!important;}',
        'ul.netStateMenuItem li input[type="text"]{width: calc(100% - 50px)!important}',
        '#head{position: fixed!important;height: 40px!important;min-height: 40px!important;width: 100%!important;left: 0;top: 0;z-index: 99999;}',
        'div.bConfLCnt{width: 300px!important}',
        '#basicSCon{height:calc(100% - 50px)!important;}',
        '#bConFun li>div[id]{height:45px!important}',
        'ul.basicMenuUl h2{padding-top:.5em!important}',
        '#bConFun li>div>i[class^="menu"]{display:none!important}',
        'div.bConfRCnt{width:calc(100% - 300px)!important;}',
        '.dataGrid_header_tr td:nth-child(2){width:fit-content!important}',
        'div.appConC,div.eptConC{margin-top:20px;margin-bottom: 20px!important;margin-left:40px!important;}',
        'ul.basicMenuUl li div{margin:.25em auto 0!important}',
        '#bConFun,ul.basicMenuUl,ul.basicMenuUl li{height:auto!important;min-height:auto!important;overflow:visible!important}',
        '#eptMngRCon{width:unset!important}',
        '.cloudIdCon{padding-top:unset!important;line-height:30px}',
        '#headCnt,#headLCnt{min-height:unset!important;background-color:rgb(176, 203, 51);}',
        '#tpLogo{transform: translateY(-11px);height:30px} .#headLCnt > .logoCon{position:unset!important}',
        '#headCnt{display:flex;justify-conent:space-between;}',
        '#Con > #basicContent{height:100%!important}',
        'i#netStateArrow,i#routeMgtArrow,i#appsMgtArrow,i#routeSetArrow{border-left:.83em solid transparent!important;border-right:.83em solid transparent!important;border-bottom:.83em solid transparent!important;transform:translateY(-10px) rotate(180deg)!important;}',
    ].join('')
    var style = document.createElement('style'); style.innerText = css;
    document.querySelector('head').appendChild(style)
})();