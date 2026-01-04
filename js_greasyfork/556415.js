// ==UserScript==
// @name         javbus auto open
// @namespace    websiteEnhancement
// @author   jimmly
// @version      2025.12.1
// @description  增加页面顶部底部按钮和一键下种按钮
// @create         2023-9-21
// @include        *javbus*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/556415/javbus%20auto%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/556415/javbus%20auto%20open.meta.js
// ==/UserScript==
(async function (loadJQuery) {

    loadJQuery(window).then(([$, win]) => {
        $.ajaxSetup({
            cache:true
        });
        ["https://cdn.jsdelivr.net/npm/jquery-lazyload@1.9.7/jquery.lazyload.min.js",
         "https://cdn.jsdelivr.net/gh/sodiray/radash@master/cdn/radash.min.js",
         // "https://update.greasyfork.org/scripts/483173/1301961/GM_config_cnjames.js",
         // "https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/refs/heads/master/gm_config.js",
         "https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@master/gm_config.js",
         "https://update.sleazyfork.org/scripts/476583/common_libs_of_array.js",
         // "https://update.sleazyfork.org/scripts/513894/1470715/remove%20ads%20lib.js",
         // "https://update.sleazyfork.org/scripts/513894/1627441/remove%20ads%20lib.js",
         // "https://update.sleazyfork.org/scripts/513894/1627444/remove%20ads%20lib.js", //with version
         "https://update.sleazyfork.org/scripts/513894/remove%20ads%20lib.js" //no version
        ].reduce((p, url) => p.then(() => new Promise((resolve, reject) => $.getScript(url).done(() => resolve()).fail((er) =>{console.log(er)}))), Promise.resolve())
            .then(v=>remove_adds($, window))
            .then(v => {
            // 替换这些值为你的实际设置
            const baseUrl = 'https://192.168.8.249:30024'; // 例如 http://localhost:8080
            const username = 'admin';
            const password = 'adminadmin';

            // 登录到qBittorrent Web UI
            async function login() {
                const response = await fetch(`${baseUrl}/api/v2/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
                    });

                if (response.ok) {
                    console.log('Logged in successfully.');

                } else {
                    console.error('Failed to log in.');

                }
                return response
            }

            // 添加新的torrent下载任务
            async function addTorrent(url) {
                const response = await fetch(`${baseUrl}/api/v2/torrents/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `urls=${encodeURIComponent(url)}`
                    });

                if (response.ok) {
                    console.log('added successfully.');
                } else {
                    console.log('Failed to add.', response.body);
                }
                return response
            }

            win.funcDownload = function () {
                (async () => {

                    login()
                        .then(async v => {
                        let torrentUrl = $('div.movie a[rel*=nofollow]').first().attr('href')
                        console.log(torrentUrl)
                        if(torrentUrl && torrentUrl.length>0)
                        {
                            let result =await addTorrent(torrentUrl)
                            return result.ok
                        }
                        else
                        {
                            return false
                        }
                    })
                        .then(res => {
                        if (res) {
                            if (localStorage.getItem("autoclosewindow") == 'Auto') {
                                window.close();
                            }
                        }
                        else {
                            console.log('Failed to add.', res);
                            //alert('add error')
                        }
                    }).catch(err => console.log(err))

                })();
            }
            // win.funcList = function () { }
            // win.funcDetail = function () { }
            // const reg = /.*thread-(\d+)-.*/
            // win.__compareKey = function (cache, curr) {
            //     if (cache === curr)
            //         return true
            //     ///thread-6638382-
            //     if (reg.test(cache))
            //         return cache.replace(reg, "$1") === curr
            //     return false
            // }
            // win.fixValue = function (value) {
            //     if (reg.test(value))
            //         return value.replace(reg, "$1")
            //     return value
            // }
            $('table a').removeAttr('style')
            win.actionOpened=function(el){
                // el.closest('tr').hide()
                // el.closest('tbody').hide()
                el.closest('.item').hide()
                // el.closest('tbody').hide()
                console.log('log')
            }
            console.log(window.location.pathname)
            let collections=[ '/genre/', '/uncensored','/page/']
            console.log(collections)
            autoFind(() => collections.findIndex(v=>window.location.pathname.startsWith(v))>-1 || '/'==window.location.pathname, 'javdb', '.item a', el => el.find('img').attr('title'), $, {}, win);


        })
    })

})(function (unsafeWindow) {
    return new Promise((resolve, reject) => {
        let dollar
        if (typeof $ != "undefined"){
            console.log('no found $')
            dollar = $
            if($.noConflict)
                $.noConflict()
        }
        if (typeof jQuery == "undefined" || typeof jQuery.fn =="undefined" ||typeof jQuery.fn.lazyload=="undefined") {
            console.log('no found jQuery, loading jquery-3.7.1')
            let script = document.createElement("script")
            script.type = "text/javascript"
            script.src = "https://code.jquery.com/jquery-3.7.1.min.js"
            script.onerror = function () {
                reject(new Error("Failed to load jQuery"))
            }
            script.addEventListener("load", function () {
                jQuery.noConflict()
                if (dollar) $ = dollar;

                resolve([jQuery, unsafeWindow??window])
            })

            document.head.appendChild(script)
        }
        else {
            setTimeout(function () {
                // Firefox supports
                if (dollar) $ = dollar;

                resolve([$, unsafeWindow??window])
            }, 30)
        }
    })
});