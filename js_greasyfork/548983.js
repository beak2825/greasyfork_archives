// ==UserScript==
// @name         Boykisser
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Boykiser boikisser
// @author       Adeir Junior
// @match        https://wplace.live/*
// @icon         https://i.imgur.com/l3m2PZQ.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548983/Boykisser.user.js
// @updateURL https://update.greasyfork.org/scripts/548983/Boykisser.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const overlay = {
        chunk: [661, 1074], // chunk 0,0 pois (783, 217) está dentro de 0-999 x 0-999
        coords: [266, 260], // posição da imagem dentro do chunk
        url: "https://i.imgur.com/l3m2PZQ.png"
    };

    overlay.chunksString = `/${overlay.chunk[0]}/${overlay.chunk[1]}.png`;

    const { img, width, height } = await loadImage(overlay.url);
    const overlayCanvas = new OffscreenCanvas(1000, 1000);
    const overlayCtx = overlayCanvas.getContext("2d");
    overlayCtx.drawImage(img, overlay.coords[0], overlay.coords[1], width, height);
    overlay.imageData = overlayCtx.getImageData(0, 0, 1000, 1000);

    const overlays = [overlay];

    let overlayMode = "overlay";

    fetch = new Proxy(fetch, {
        apply: async (target, thisArg, argList) => {
            const url = new URL(typeof argList[0] === "object" ? argList[0].url : argList[0]);

            if (overlayMode === "overlay" && url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
                for (const obj of overlays) {
                    if (url.pathname.endsWith(obj.chunksString)) {
                        const originalResponse = await target.apply(thisArg, argList);
                        const originalBlob = await originalResponse.blob();
                        const originalImage = await blobToImage(originalBlob);

                        const width = originalImage.width;
                        const height = originalImage.height;
                        const canvas = new OffscreenCanvas(width, height);
                        const ctx = canvas.getContext("2d", { willReadFrequently: true });

                        ctx.drawImage(originalImage, 0, 0, width, height);
                        const originalData = ctx.getImageData(0, 0, width, height);
                        const resultData = ctx.getImageData(0, 0, width, height);
                        const d1 = originalData.data;
                        const d2 = obj.imageData.data;
                        const dr = resultData.data;

                        for (let i = 0; i < d1.length; i += 4) {
                            const isTransparent = d2[i + 3] === 0;
                            const samePixel =
                                d1[i] === d2[i] &&
                                d1[i + 1] === d2[i + 1] &&
                                d1[i + 2] === d2[i + 2] &&
                                d1[i + 3] === d2[i + 3];

                            if (samePixel && !isTransparent) {
                                dr[i] = 0;
                                dr[i + 1] = 255;
                                dr[i + 2] = 0;
                                dr[i + 3] = 255;
                            } else if (!isTransparent) {
                                dr[i] = d2[i];
                                dr[i + 1] = d2[i + 1];
                                dr[i + 2] = d2[i + 2];
                                dr[i + 3] = d2[i + 3];
                            }
                        }

                        ctx.putImageData(resultData, 0, 0);
                        const mergedBlob = await canvas.convertToBlob();
                        return new Response(mergedBlob, {
                            headers: { "Content-Type": "image/png" }
                        });
                    }
                }
            }

            return target.apply(thisArg, argList);
        }
    });

    function blobToImage(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                resolve({
                    img,
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = reject;
            img.src = src;
        });
    }

})();
