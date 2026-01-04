// ==UserScript==
// @name         ZhihuThemeSync
// @name:zh-CN 知乎自动深色模式
// @name:zh-TW 知乎自動暗色模式
// @namespace    http://tampermonkey.net/
// @version      2025-10-14 .3
// @description  Keeps Zhihu’s theme in sync with your OS theme.
// @description:zh-CN 让知乎的主题与系统主题保持同步。
// @description:zh-TW 讓知乎的主題與系統主題保持同步。
// @author       Ethan Dong
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=https://www.zhihu.com/
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552535/ZhihuThemeSync.user.js
// @updateURL https://update.greasyfork.org/scripts/552535/ZhihuThemeSync.meta.js
// ==/UserScript==

(function() {

    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    function updateThemeStatus(e){
        console.log("Triggered")
        let url = new URL(window.location.href);
        let params = url.searchParams;
        let sysTheme = "";
        let CurrentPageTheme = "";

        if (params.has("theme")){
            CurrentPageTheme = params.get("theme")
        }else{
            sysTheme = null
        }

        if (e.matches){
            sysTheme = "dark"
            params.set("theme","dark")

        }else{
            sysTheme = "light"
            params.set("theme","light")

        }

        if (CurrentPageTheme = null || sysTheme != CurrentPageTheme){
            window.location.href = url.toString();
            console.log("reloaded")
        }

    }
    updateThemeStatus(themeMedia);
    themeMedia.addEventListener('change', updateThemeStatus);


}
)();