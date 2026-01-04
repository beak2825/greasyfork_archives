// ==UserScript==
// @name         MDPR Photo Big Images Unified Gallery (Clean)
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  mdpr.jp相冊全部大圖統一插入縮圖列表下方，無多餘註釋及console
// @match        https://mdpr.jp/photo/detail/*
// @grant        GM_xmlhttpRequest
// @connect      mdpr.jp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552265/MDPR%20Photo%20Big%20Images%20Unified%20Gallery%20%28Clean%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552265/MDPR%20Photo%20Big%20Images%20Unified%20Gallery%20%28Clean%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function createGallery(list) {
        let gallery = document.getElementById('mdpr-big-gallery');
        if (!gallery) {
            gallery = document.createElement('div');
            gallery.id = 'mdpr-big-gallery';
            gallery.style = 'margin:32px 0 0 0; background:none; border:none; padding:0;';
            list.parentNode.insertBefore(gallery, list.nextSibling);
        }
        return gallery;
    }
    function addBigImage(gallery, src, alt) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt || '';
        img.style = 'display:block;margin:0 0 32px 0;border:1px solid #eee;background:#fff;';
        gallery.appendChild(img);
    }
    function process() {
        const list = document.querySelector('ol.pg-photo__webImageList');
        if (!list) return;
        const gallery = createGallery(list);
        [...list.querySelectorAll('li.pg-photo__webImageListItem')].forEach((li) => {
            const a = li.querySelector('a.pg-photo__webImageListLink');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href) return;
            const absUrl = href.startsWith('http') ? href : 'https://mdpr.jp' + href;
            GM_xmlhttpRequest({
                method: "GET",
                url: absUrl,
                onload: function(resp) {
                    if (!resp.responseText) return;
                    const doc = new DOMParser().parseFromString(resp.responseText, 'text/html');
                    let img = doc.querySelector('.pg-photo__image img.c-image__image');
                    if (!img) img = doc.querySelector('.pg-photo__image img');
                    if (img && img.src) {
                        addBigImage(gallery, img.src, img.alt);
                    }
                }
            });
        });
    }
    setTimeout(process, 1000);
})();
