// ==UserScript==
// @name        E-Hentai Prefetch Next Page & Fit Screen
// @namespace   Violentmonkey Scripts
// @license     MIT
// @match       https://e-hentai.org/s/*
// @match       https://exhentai.org/s/*
// @grant       none
// @version     0.1.0
// @author      sorz & msdw 
// @description Prefetch image file on the next page for faster browsing. Resize image to fit screen, might be blurry if the image is smaller than the screen resolution.
// @downloadURL https://update.greasyfork.org/scripts/564020/E-Hentai%20Prefetch%20Next%20Page%20%20Fit%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/564020/E-Hentai%20Prefetch%20Next%20Page%20%20Fit%20Screen.meta.js
// ==/UserScript==

const MAX_PREFETCH_PAGES = 10;
// page no -> response from api_response
const pageRespCache = new Map();

// page no. -> image key
const pageImgKeyCache = new Map();

const currentPageNo = () => history.state.page;

const getPageNoImgKey = (doc) => {
    let [_, page, imgKey] = doc.querySelector('a#next')
        .attributes.onclick.value
        .match(/load_image\((\d+), '([0-9a-f]+)'\)/);
    return [parseInt(page), imgKey];
};

const template = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
}

function prefetchPage(pageNo, n) {
    const onResponse = (resp) => {
        const [nextPageNo, nextImgKey] = getPageNoImgKey(template(resp.n));

        if (!pageRespCache.has(pageNo)) {
            // Cache response
            pageRespCache.set(pageNo, resp);
            pageImgKeyCache.set(nextPageNo, nextImgKey);

            // Prefetch image file
            const src = template(resp.i3).querySelector('img#img').src;
            const img = new Image();
            img.onload = () => console.log('image fetched', 'page', pageNo);
            img.src = src;
        }

        if (n > 0)
            prefetchPage(nextPageNo, n - 1);
    }

    if (pageRespCache.has(pageNo)) {
        onResponse(pageRespCache.get(pageNo));
        return;
    }

    const imgKey = pageImgKeyCache.get(pageNo);
    if (!imgKey) {
        logging.warn('missing image key for page', pageNo);
        return;
    }
    const request = {
        method: "showpage",
        gid: gid,
        page: pageNo,
        imgkey: imgKey,
        showkey: showkey
    };
    const xhr = new XMLHttpRequest();
    api_call(xhr, request, () => {
        const resp = api_response(xhr);
        if (resp == false || resp.error != undefined)
            return;
        onResponse(resp);
    });
}

function prefetchNextNPage(n) {
    let [pageNo, imgKey] = getPageNoImgKey(document);
    pageImgKeyCache.set(pageNo, imgKey);
    prefetchPage(pageNo, n);
}

apply_json_state = new Proxy(apply_json_state, {
    apply: function (target, thisArg, args) {
        Reflect.apply(target, thisArg, args);
        prefetchNextNPage(MAX_PREFETCH_PAGES);
    }
});

function fitImageToScreen() {
    console.log("auto fit");
    const iw = parseInt(this.style.width, 10);
    const ih = parseInt(this.style.height, 10);
    if (!iw || !ih)
        return;

    const vw = window.innerWidth - OFFSET_X;
    const vh = window.innerHeight - OFFSET_Y;

    const scale = Math.min(vw / iw, vh / ih);

    const w = Math.floor(iw * scale) + "px";
    const h = Math.floor(ih * scale) + "px";

    // Force size
    this.style.setProperty("width", w, "important");
    this.style.setProperty("height", h, "important");

    // Center X only, stay at top
    //img.style.setProperty("position", "fixed", "important");
    const tx = Math.floor((window.innerWidth - w) / 2);
    this.style.setProperty("transform", `translateX(${tx}px)`, "important");
}

load_image = new Proxy(load_image, {
    apply: function (target, thisArg, [page, imgKey]) {
        var resp = pageRespCache.get(page);
        if (!resp)
            return Reflect.apply(target, thisArg, [page, imgKey]);
        console.log('cached resp found', 'page', page);

        const doc = new DOMParser().parseFromString(resp.i3, "text/html");
        const imgEl = doc.getElementById("img");
        imgEl.addEventListener("load", fitImageToScreen);
        console.log(imgEl);
        resp.i3 = doc.body.innerHTML;
        const INLINE_ONLOAD =
            "console.log('auto fit');" +

            // ===== move-to-top + keep only one =====
            "var node=this;" +
            "if(node.parentNode && node.parentNode.tagName==='A') node=node.parentNode;" +
            "var all=document.querySelectorAll('#img');" +
            "for(var i=0;i<all.length;i++){" +
            "if(all[i]!==this && all[i].parentNode) all[i].parentNode.removeChild(all[i]);" +
            "}" +
            "if(document.body.firstChild!==node) document.body.insertBefore(node,document.body.firstChild);" +

            // ===== auto fit =====
            "var iw=parseInt(this.style.width,10);" +
            "var ih=parseInt(this.style.height,10);" +
            "if(!iw||!ih)return;" +
            "var ox=10, oy=10;" +
            "var vw=window.innerWidth-ox, vh=window.innerHeight-oy;" +
            "var scale=Math.min(vw/iw,vh/ih);" +
            "var wNum=Math.floor(iw*scale), hNum=Math.floor(ih*scale);" +
            "this.style.setProperty('width',wNum+'px','important');" +
            "this.style.setProperty('height',hNum+'px','important');" +
            "var tx=Math.floor((window.innerWidth-wNum)/6);" +
            "document.body.style.setProperty('margin','0','important');" +
            "this.style.setProperty('display','block','important');" +
            "this.style.setProperty('margin','0 auto','important');" +
            "this.style.setProperty('transform','none','important');";

        // replace existing onload
        resp.i3 = resp.i3.replace(
                /onload="update_window_extents\(\)"/,
                'onload="update_window_extents();' + INLINE_ONLOAD + '"');

        history.pushState({
            page: resp.p,
            imgkey: resp.k,
            json: resp,
            expire: get_unixtime() + 300
        },
            document.title,
            base_url + resp.s);
        apply_json_state(resp);

        return false;
    }
});

prefetchNextNPage(MAX_PREFETCH_PAGES);
