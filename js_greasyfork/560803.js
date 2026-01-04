// ==UserScript==
// @name         Bilibili網址縮短
// @namespace    https://greasyfork.org/scripts/bilibili-url-shortener
// @version      1.0
// @description  Bilibili網址很冗長，將其縮短，方便複製、分享、儲存成乾淨的書籤
// @author       fmnijk
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560803/Bilibili%E7%B6%B2%E5%9D%80%E7%B8%AE%E7%9F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/560803/Bilibili%E7%B6%B2%E5%9D%80%E7%B8%AE%E7%9F%AD.meta.js
// ==/UserScript==

// main function
(function() {
    'use strict';
    sturl();
    window.addEventListener('locationchange', function (){
        sturl();
    })
})();

// shorten url
function sturl() {
    // url
    var url = window.location.href;
    // new url
    var nurl = window.location.href;
    // query string need to be removed for bilibili
    var qs = ['share_from', 'spm_id_from','vd_source','f_source','from_source','from_id', 'from_spmid', 'from','seid','rt','share_source','share_medium','share_plat','share_session_id','share_tag','unique_k','up_id','bbid','ts','noTitleBar','loadingShow','msource','curTab','outsideMall','channel','share_mid', 'buvid', 'mid', 'spmid', 'plat_id', 'is_story_h5', 'timestamp', '-Arouter'];

    // query string need to be removed if equal to something
    var qseq = [];

    // remove not necessary query string
    nurl = rmqs(nurl, qs);
    // remove not necessary query string if equal to something
    nurl = rmqseq(nurl, qseq);

    // do nothing if new url is the same as url
    if (url == nurl){
        return false;
    }
    // update url in address bar to new url
    window.history.replaceState(null, null, nurl);
}

// remove not necessary query string
function rmqs(url, qs) {
    url = new URL(url);
    qs.forEach(function(i){
        url.searchParams.delete(i);
    });
    return url.toString();
}

// remove not necessary query string if equal to something
function rmqseq(url, qseq) {
    url = new URL(url);
    qseq.forEach(function(i){
        if (url.searchParams.get(i[0]) == i[1]){
            url.searchParams.delete(i[0]);
        }
    });
    return url.toString();
}

/*----force listen to locationchange work start----*/
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});
/*----force listen to locationchange work end----*/