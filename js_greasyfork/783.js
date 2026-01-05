// ==UserScript==
// @id             tieba_url_no_jump
// @name           百度贴吧不可能会跳转！
// @version        2018.05.25
// @namespace      jiayiming
// @author         jiayiming
// @description    去除贴吧帖子里链接的跳转
// @include        *://tieba.baidu.com/p/*
// @include        *://tieba.baidu.com/f?ct*
// @homepageURL    https://greasyfork.org/scripts/783/
// @grant          GM_xmlhttpRequest
// @connect      baidu.com
// @connect      bdimg.com
// @run-at         document-end
// @note           2018.05.25 匹配jump2.bdimg.com，去热门词搜索
// @note           2017.05.15 支持https
// @note           2014.07.19 转帖用XHR+HEAD获取地址，其他照旧
// @downloadURL https://update.greasyfork.org/scripts/783/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E4%B8%8D%E5%8F%AF%E8%83%BD%E4%BC%9A%E8%B7%B3%E8%BD%AC%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/783/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E4%B8%8D%E5%8F%AF%E8%83%BD%E4%BC%9A%E8%B7%B3%E8%BD%AC%EF%BC%81.meta.js
// ==/UserScript==

var locationHref = location.href;

function decode(url,target){
    GM_xmlhttpRequest({
        method: 'HEAD',
        url: url,
        headers: {
            "Referer": locationHref,
        },
        onload: function(response) {
            var newUrl = response.finalUrl;
            //console.log(newUrl);
            target.setAttribute('href', newUrl);
        }
    })
}

function run() {
    var urls = document.querySelectorAll('a[href*=".bdimg.com/safecheck"]');
    for (var i = 0; i < urls.length; i++) {
        if (urls[i].parentNode.className == "apc_src_wrapper") {
            decode(urls[i],urls[i]);
        }
        else if (urls[i].className == "ps_cb") {
            urls[i].outerHTML = urls[i].innerHTML;
        }
        else {
            var url = urls[i].innerHTML;
            if (url.indexOf("http") < 0) {
                url = "http://" + url;
            }
            //console.log(url);
            urls[i].setAttribute("href", url);
        }
    }
}

function addMutationObserver(selector, callback) {
    var watch = document.querySelector(selector);
    if (!watch) return;

    var observer = new MutationObserver(function(mutations){
        var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0; });
        if (nodeAdded) {
            // observer.disconnect();
            callback();
        }
    });
    observer.observe(watch, {childList: true, subtree: true});
}

run();

addMutationObserver('#j_p_postlist', run);