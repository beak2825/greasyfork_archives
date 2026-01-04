// ==UserScript==
// @name         ニコニコ動画 - ニコニ貢献の削除
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-10-15
// @description  動画最後のニコニ貢献の削除 + α
// @author       ぐらんぴ
// @match        https://www.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552582/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20-%20%E3%83%8B%E3%82%B3%E3%83%8B%E8%B2%A2%E7%8C%AE%E3%81%AE%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/552582/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20-%20%E3%83%8B%E3%82%B3%E3%83%8B%E8%B2%A2%E7%8C%AE%E3%81%AE%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==
const $S = el => document.querySelector(el), $SA = el => document.querySelectorAll(el);
const log = console.log;

GM_addStyle(`
/* remove megaphone */
img.pos_absolute { display: none; }

/* add scroll(https://www.nicovideo.jp/watch/sm...) */
[data-scope="tabs"] [data-part="content"] > div {
  overflow-y: auto;
  max-height: 200vh;
  scrollbar-width: thin; /* Firefox用 */
  scrollbar-color: #333 transparent; /* Firefox用 */
}
/* remove ads(https://www.nicovideo.jp/watch/sm...) */
.d_flex.flex-d_column.gap_x2 > a.hover\\:c_action\\.primaryAzure { display: none; }
.d_flex.flex-d_column.gap_x2 > .w_watchSidebar\\.width { display: none; }


/* WebKit系ブラウザ用 */
[data-scope="tabs"] [data-part="content"] > div::-webkit-scrollbar {
  width: 8px;
}

[data-scope="tabs"] [data-part="content"] > div::-webkit-scrollbar-track {
  background: transparent;
}

[data-scope="tabs"] [data-part="content"] > div::-webkit-scrollbar-thumb {
  background-color: #333;
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}
`)

// /series_search/ to /mylist_search/ のUI改善
let currentUrl
const debounce = (fn, wait = 100) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
};

const onUrlChange = (oldUrl, newUrl) => {
    log('URL changed:', oldUrl, '→', newUrl);

    const items = $SA('[data-group]');
    //first run
    if(oldUrl == undefined){
        if(location.pathname.startsWith('/series_search/') || location.pathname.startsWith('/mylist_search/')){
            items.forEach(i => {
                if (i.href) return;
                i.style.display = "block";
                i.querySelector(':scope > .ai_start > [data-group-ignore="true"]').remove()
            });
            items[0].parentElement.className = 'd_grid grid-tc_repeat(5,_1fr) rg_x4 cg_x2';
        }
    }
    // onUrlchnaged
    if (newUrl.startsWith('https://www.nicovideo.jp/series_search/') || newUrl.startsWith('https://www.nicovideo.jp/mylist_search/')) {
        items.forEach(i => {
            if (i.href) return;
            i.style.display = "block"
            i.querySelector(':scope > .ai_start > [data-group-ignore="true"]').remove()
        });
        items[0].parentElement.className = 'd_grid grid-tc_repeat(5,_1fr) rg_x4 cg_x2';
    }
};


const notify = debounce((oldUrl, newUrl) => {
    currentUrl = newUrl;
    onUrlChange(oldUrl, newUrl);
}, 100);

(function wrapHistoryAndPopstate() {
    const { pushState, replaceState } = history;

    history.pushState = function (...args) {
        const prev = location.href;
        const ret = pushState.apply(this, args);
        const next = location.href;
        if (prev !== next) notify(prev, next);
        return ret;
    };

    history.replaceState = function (...args) {
        const prev = location.href;
        const ret = replaceState.apply(this, args);
        const next = location.href;
        if (prev !== next) notify(prev, next);
        return ret;
    };

    window.addEventListener('popstate', () => {
        const prev = currentUrl;
        const next = location.href;
        if (prev !== next) notify(prev, next);
    });
})();

const moCallback = debounce(() => {
    const next = location.href;
    if (next !== currentUrl) {
        const prev = currentUrl;
        currentUrl = next;
        onUrlChange(prev, next);
    }
}, 200);

const observer = new MutationObserver(moCallback);
observer.observe(document.documentElement, { childList: true, subtree: true});

// 複数タブ視聴 - https://greasyfork.org/ja/scripts/521355-niconico-unlimit-tabs
addEventListener("storage", e => { if(e.key == "nvpc:watch:tab-sessions") localStorage.removeItem("nvpc:watch:tab-sessions") });

// 非表示動画の完全削除
const origAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(...args){
    try{
        // /ranking/for_you
        setTimeout(()=>{
            if(location.pathname == "/ranking/for_you" && args[0]?.dataset?.group == "true" && !args[0].dataset.anchor && args[0].innerText == "この動画は非表示に設定されています"){
                args[0].parentElement.style.display = "none"
            }
        },0);

        // /ranking/genre
        setTimeout(()=>{
            if(location.pathname.startsWith("/ranking/genre") && args[0].className == "flex-g_1" && args[0].innerText == "この動画は非表示に設定されています"){
                args[0].parentElement.style.display = "none"
            }
        },0);

        // /ranking/custom
        /* /watch/sm*
        setTimeout(()=>{
            if(location.pathname.startsWith("/watch/sm") && args[0]?.dataset?.anchorPage == "watch"){
            }
        },0);
        */

        // /search/, /tag/
        setTimeout(()=>{
            if((location.pathname.startsWith("/tag/") || location.pathname.startsWith("/search/")) && args[0]?.dataset?.group === "true" && args[0].innerText == "この動画は非表示に設定されています"){
                args[0].style.display = "none";
            }
        },0);
    }catch{}
    return origAppendChild.apply(this, args);
}
// remove supporter-content(ニコニ貢献)
const originalFetch = unsafeWindow.fetch;
unsafeWindow.fetch = function(...args) {
    const url = args[0];
    if(typeof url === 'string' && url.includes('https://api.nicoad.nicovideo.jp/v2/contents/video/sm')) return new Promise(() => {});
    return originalFetch.apply(this, args);
};