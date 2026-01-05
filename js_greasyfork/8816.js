// ==UserScript==
// @name         Two Column S1
// @namespace    https://exz.me/
// @version      0.14
// @description  two colomn ui for s1
// @author       Epix
// @match        https://bbs.saraba1st.com/2b/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8816/Two%20Column%20S1.user.js
// @updateURL https://update.greasyfork.org/scripts/8816/Two%20Column%20S1.meta.js
// ==/UserScript==
var width = 47;
var list_on_left = true;
if (self === top && location.href.startsWith('https://bbs.saraba1st.com/2b/forum-') || (new RegExp("mod=forumdisplay")).test(location.href)) {


    $('nv_forum').style['width'] = width + '%';
    GM_addStyle('.wp,#toptb{min-width:0 !important');
    var f = document.createElement("iframe");
    f.id = 'frame';
    f.name = 'frame';
    f.style.width = (100 - width) + '%';
    f.style.height = '95%';
    f.style.position = 'fixed';
    f.style.right = '0';
    f.style.bottom = '0';
    document.body.appendChild(f);

    document.onclick = function (event) {
        var target = event.target;
        //console.log(target.nodeName,target.href);
        //return;
        var url = null;
        if (target.nodeName === "TH" && target.parentNode.parentNode.parentNode.id === "threadlisttableid") {
            url = target.querySelector('th>a.xst').href;
        } else if (target.nodeName === "TD" && target.parentNode.parentNode.parentNode.id === "threadlisttableid") {
            url = target.querySelector('td>a').href;
        } else if (target.nodeName === "A" && (target.href.search("thread-") !== -1 || target.href.search("mod=viewthread") !== -1)) {
            url = target.href;
            event.preventDefault();
        } else {
            return;
        }
        document.getElementById('frame').src = url;
        history.pushState(null, null, url);
    };
} else if (self !== top && location.href.startsWith('https://bbs.saraba1st.com/2b/thread') || (new RegExp("mod=viewthread")).test(location.href)) {
    GM_addStyle('#toptb,#hd{display:none}');
}
if (location.href.startsWith('https://bbs.saraba1st.com/2b/thread') || (new RegExp("mod=viewthread")).test(location.href)) {
    var td = document.querySelectorAll('.plhin tbody tr:first-child td.pls:first-child');
    for (var i in td) {
        td[i].rowSpan = "4";
    }
    GM_addStyle('\
.favatar {\
    height: 150px !important;\
    overflow: hidden !important;\
}\
.favatar:hover {\
    height: auto !important;\
    overflow: visible !important;\
}\
.favatar .pi {\
    position: absolute;\
}\
.favatar:hover .pi {\
    position: initial;\
}\
.favatar .authi {\
    background: white;\
    padding: 5px;\
}\
.favatar:hover .authi {\
    background: none;\
    padding: 0;\
}\
.t_fsz {\
    min-height: 0 !important;\
}\
.sign {\
    max-height: 20px !important;\
    padding: 0 !important;\
    position: relative;\
    width: 600px;\
    top: 10px;\
    margin-left: 70px;\
    margin-bottom: 0 !important;\
    background: rgb(246, 247, 235);\
    height: 0;\
    overflow: visible;\
    opacity: 0.01;\
}\
.sign:hover {\
    max-height: 200px !important;\
    opacity: 1;\
}\
.plhin > tbody > tr:nth-child(1) > td.plc{\
    width: 100%; \
}\
.plhin > tbody > tr:nth-child(3) > td:first-child {\
        display: none;\
}\
.plhin > tbody > tr:nth-child(3) > td{\
    border-bottom: 1px solid #022C80; \
}\
.plhin > tbody > tr:nth-child(4){\
        display: none;\
}\
#p_btn {\
    padding: 0 !important;\
    margin-top: 0 !important;\
    margin-bottom: 0 !important;\
}');

}
