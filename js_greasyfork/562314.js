// ==UserScript==
// @name         WIRED Image Converter
// @version      1.0
// @description  Resimleri PixelPlace paletine dönüştüren ve Dithering yapan motor.
// @author       WIRED
// @license      MIT
// ==/UserScript==

class WiredImageConverter {
    static getClosestColor(r, g, b, palette) {
        let closestColor = null;
        let closestDistance = Number.MAX_VALUE;
        let closestIndex = -1;

        for (let i = 0; i < palette.colors.length; i++) {
            let bigint = palette.colors[i];
            let p_r = (bigint >> 16) & 255;
            let p_g = (bigint >> 8) & 255;
            let p_g_raw = (bigint >> 8) & 255;
            let p_b = bigint & 255;

            let distance = Math.sqrt(
                Math.pow(r - p_r, 2) +
                Math.pow(g - p_r, 2) +
                Math.pow(b - p_b, 2)
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestColor = {r: p_r, g: p_g_raw, b: p_b};
                closestIndex = palette.indexes[i];
            }
        }
        return {color: closestColor, index: closestIndex};
    }

    static applyDither(img_data, w, h, palette) {
        const dithered = new Uint8ClampedArray(img_data.data.length);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                const r = img_data.data[idx];
                const g = img_data.data[idx + 1];
                const b = img_data.data[idx + 2];
                const a = img_data.data[idx + 3];

                dithered[idx + 3] = a;
                if (a < 128) continue;

                const closest = this.getClosestColor(r, g, b, palette);
                if (closest.color) {
                    dithered[idx] = closest.color.r;
                    dithered[idx + 1] = closest.color.g;
                    dithered[idx + 2] = closest.color.b;
                }
            }
        }
        return new ImageData(dithered, w, h);
    }
}