// ==UserScript==
// @name               FontLoaderBypass
// @namespace          http://github.com/0H4S
// @version            1.0
// @author             OHAS
// @description        Injeção de Fontes em Userscripts
// @license            CC-BY-NC-ND-4.0
// @copyright          2026 OHAS. All Rights Reserved. (https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// ==/UserScript==

/*
    Copyright Notice & Terms of Use
    Copyright © 2026 OHAS. All Rights Reserved.

    This software is the exclusive property of OHAS and is licensed for personal, non-commercial use only.

    You may:
    - Install, use, and inspect the code for learning or personal purposes.

    You may NOT (without prior written permission from the author):
    - Copy, redistribute, or republish this software.
    - Modify, sell, or use it commercially.
    - Create derivative works.

    For questions, permission requests, or alternative licensing, please contact via
    - GitHub:       https://github.com/0H4S
    - Greasy Fork:  https://greasyfork.org/users/1464180

    This software is provided "as is", without warranty of any kind. The author is not liable for any damages arising from its use.
*/

(function() {
    'use strict';

    const API = {
        xhr:            (typeof GM_xmlhttpRequest   !== 'undefined') ? GM_xmlhttpRequest    : (typeof GM !== 'undefined' ? GM.xmlHttpRequest : null),
        setValue:       (typeof GM_setValue         !== 'undefined') ? GM_setValue          : null,
        getValue:       (typeof GM_getValue         !== 'undefined') ? GM_getValue          : null
    };

    const FontLoaderBypass = {
        CACHE_PREFIX: 'flb_cache_',

        load: function(url, name, weight, style) {
            const isCss = url.includes('fonts.googleapis.com') || url.endsWith('.css');
            if (isCss) {
                this._processExternalCss(url);
            } else {
                if (!name) return;
                this.loadFontBase64(url, name, weight, style);
            }
        },

        _processExternalCss: function(cssUrl) {
            this._fetch(cssUrl, 'text')
                .then(cssContent => {
                    const fontsFound = this._parseCssContent(cssContent);
                    if (fontsFound.length === 0) return;
                    fontsFound.forEach(f => {
                        this.loadFontBase64(f.src, f.family, f.weight, f.style);
                    });
                })
            .catch(() => {});
        },

        _parseCssContent: function(cssText) {
            const results = [];
            const blockRegex = /@font-face\s*{([\s\S]*?)}/g;
            let match;
            while ((match = blockRegex.exec(cssText)) !== null) {
                const content = match[1];
                const familyMatch = content.match(/font-family:\s*['"]?([^'";]+)['"]?/);
                const styleMatch  = content.match(/font-style:\s*([a-zA-Z]+)/);
                const weightMatch = content.match(/font-weight:\s*([0-9a-zA-Z]+)/);
                const srcMatch    = content.match(/src:\s*url\((?:'|")?([^'")]+)(?:'|")?\)/);
                if (familyMatch && srcMatch) {
                    results.push({
                        family: familyMatch[1].trim(),
                        style:  styleMatch  ? styleMatch[1].trim()  : 'normal',
                        weight: weightMatch ? weightMatch[1].trim() : '400',
                        src:    srcMatch[1].trim()
                    });
                }
            }
            return results;
        },

        loadFontBase64: async function(url, fontFamilyName, fontWeight = 'normal', fontStyle = 'normal') {
            const cacheKey = this.CACHE_PREFIX + url;
            let blobFont = null;
            if (API.getValue) {
                try {
                    const cachedData = API.getValue(cacheKey);
                    if (cachedData) {
                        let base64Content = cachedData;
                        if (typeof cachedData === 'string' && cachedData.startsWith('{')) {
                            try {
                                const parsed = JSON.parse(cachedData);
                                if (parsed.content) base64Content = parsed.content;
                            } catch (e) {}
                        }
                        blobFont = this._base64ToBlob(base64Content);
                    }
                } catch (e) {}
            }
            if (!blobFont) {
                try {
                    const responseBlob = await this._fetch(url, 'blob');
                    blobFont = responseBlob;
                    const reader = new FileReader();
                    const base64Promise = new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blobFont);
                    });
                    const base64Data = await base64Promise;
                    if (API.setValue) {
                        const storageObj = {
                            content: base64Data,
                            meta: {
                                fontName: fontFamilyName,
                                fontWeight: fontWeight,
                                fontStyle: fontStyle,
                                url: url
                            }
                        };
                        try {
                            API.setValue(cacheKey, JSON.stringify(storageObj));
                        } catch (e) {
                            API.setValue(cacheKey, base64Data);
                        }
                    }
                } catch (err) {return;}
            }
            try {
                const arrayBuffer = await blobFont.arrayBuffer();
                const fontFace = new FontFace(fontFamilyName, arrayBuffer, {
                    weight: fontWeight,
                    style: fontStyle,
                    display: 'swap'
                });
                await fontFace.load();
                document.fonts.add(fontFace);
            } catch (e) {}
        },

        _base64ToBlob: function(base64) {
            const parts = base64.split(',');
            const mimeType = parts[0].match(/:(.*?);/)[1];
            const byteString = atob(parts[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const int8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {int8Array[i] = byteString.charCodeAt(i);}
            return new Blob([int8Array], { type: mimeType });
        },

        _fetch: function(url, responseType) {
            return new Promise((resolve, reject) => {
                if (!API.xhr) return reject({ message: 'GM_xmlhttpRequest missing' });
                API.xhr({
                    method: 'GET',
                    url: url,
                    responseType: responseType,
                    onload: (res) => (res.status >= 200 && res.status < 300) ? resolve(res.response) : reject(),
                    onerror: () => reject(),
                    ontimeout: () => reject()
                });
            });
        }
    };

    const exportScope = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    exportScope.FontLoaderBypass = FontLoaderBypass;

})();