// ==UserScript==
// @name         eyedropper
// @name:en      eyedropper
// @name:ja      スポイト
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-12-09
// @description  Retrieve a color using the eyedropper from the right-click context menu.
// @description:en Retrieve a color using the eyedropper from the right-click context menu.
// @description:ja 右クリックメニューからスポイト機能が使えます。
// @author       ぐらんぴ
// @match        http*://*/*
// @icon
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554911/eyedropper.user.js
// @updateURL https://update.greasyfork.org/scripts/554911/eyedropper.meta.js
// ==/UserScript==

async function pickColorAndShow() {
    if (!window.EyeDropper) {
        alert('This browser does not support the EyeDropper API.');
        return;
    }
    try {
        const eye = new EyeDropper();
        const { sRGBHex } = await eye.open();
        const hex = sRGBHex.toUpperCase();
        const rgb = hexToRgb(hex);
        if (!rgb) {
            alert('Failed to retrieve color: ' + hex);
            return;
        }
        const rgbText = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        const out = `${rgbText}  ${hex}`;
        // 表示
        alert(out);
        try {
            await navigator.clipboard.writeText(`${hex}`);
        } catch (e) {
            console.warn('Clipboard write failed', e);
        }
    } catch (err) {
        console.error('EyeDropper error', err);
        if (err && err.name === 'AbortError') {
        } else {
            alert('error: ' + (err && err.message ? err.message : err));
        }
    }
}

function hexToRgb(hex) {
    const m = /^#?([0-9A-F]{6})$/i.exec(hex);
    if (!m) return null;
    const v = m[1];
    return {
        r: parseInt(v.slice(0, 2), 16),
        g: parseInt(v.slice(2, 4), 16),
        b: parseInt(v.slice(4, 6), 16),
    };
}

(async function init() {
    await new Promise((r) => setTimeout(r, 50));
    pickColorAndShow();
})();