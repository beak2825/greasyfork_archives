// ==UserScript==

// @name         Víkish's Overlays

// @namespace    http://tampermonkey.net/

// @version      1.20

// @description  Things I wanted to draw

// @author       Víkish

// @match        https://wplace.live/*

// @icon         https://i.imgur.com/a7EHmOc.jpeg

// @license      MIT

// @grant        none



// @downloadURL https://update.greasyfork.org/scripts/549766/V%C3%ADkish%27s%20Overlays.user.js
// @updateURL https://update.greasyfork.org/scripts/549766/V%C3%ADkish%27s%20Overlays.meta.js
// ==/UserScript==

(async function () {

    'use strict';

    const CHUNK_WIDTH = 1000;

    const CHUNK_HEIGHT = 1000;

    // Two hardcoded overlays:

    // 1) chunk [388, 773], global coords [388301, 773118] -> local (301,118)

    // 2) chunk [732,1192], global coords [732091,1192685] -> local (91,685)

    async function fetchData() {

        return [

            {

                chunk: [388, 773],

                coords: [388301, 773118],

                url: "https://i.imgur.com/O5ZjOzF.png"

            },

            {

                chunk: [732, 1192],

                coords: [732091, 1192685],

                url: "https://i.imgur.com/Yhti6PT.png"

            }

        ];

    }

    const overlays = await fetchData();

    for (const obj of overlays) {

        obj.chunksString = `/${obj.chunk[0]}/${obj.chunk[1]}.png`;

        const { img, width, height } = await loadImage(obj.url);

        const overlayCanvas = new OffscreenCanvas(CHUNK_WIDTH, CHUNK_HEIGHT);

        const overlayCtx = overlayCanvas.getContext("2d");

        const chunkOriginX = obj.chunk[0] * CHUNK_WIDTH;

        const chunkOriginY = obj.chunk[1] * CHUNK_HEIGHT;

        const localX = obj.coords[0] - chunkOriginX;

        const localY = obj.coords[1] - chunkOriginY;

        // draw image so its top-left (global) is placed at (localX, localY) inside the chunk

        // drawing with destination width/height = natural width/height (no scaling)

        overlayCtx.drawImage(img, localX, localY, width, height);

        obj.imageData = overlayCtx.getImageData(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);

    }

    const OVERLAY_MODES = ["overlay", "original", "chunks"];

    let overlayMode = OVERLAY_MODES[0];

    fetch = new Proxy(fetch, {

        apply: async (target, thisArg, argList) => {

            const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];

            let url;

            try {

                url = new URL(urlString);

            } catch (e) {

                throw new Error("Invalid URL provided to fetch");

            }

            if (overlayMode === "overlay") {

                if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {

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

                                const isTransparent =

                                    d2[i] === 0 &&

                                    d2[i + 1] === 0 &&

                                    d2[i + 2] === 0 &&

                                    d2[i + 3] === 0;

                                const samePixel =

                                    d1[i] === d2[i] &&

                                    d1[i + 1] === d2[i + 1] &&

                                    d1[i + 2] === d2[i + 2] &&

                                    d1[i + 3] === d2[i + 3];

                                if (samePixel && !isTransparent) {

                                    // mark identical pixels green for visibility/debug

                                    dr[i] = 0;

                                    dr[i + 1] = 255;

                                    dr[i + 2] = 0;

                                    dr[i + 3] = 255;

                                } else if (!isTransparent) {

                                    // overlay pixel replaces original

                                    dr[i] = d2[i];

                                    dr[i + 1] = d2[i + 1];

                                    dr[i + 2] = d2[i + 2];

                                    dr[i + 3] = d2[i + 3];

                                }

                                // else keep original pixel

                            }

                            ctx.putImageData(resultData, 0, 0);

                            const mergedBlob = await canvas.convertToBlob();

                            return new Response(mergedBlob, {

                                headers: { "Content-Type": "image/png" }

                            });

                        }

                    }

                }

            } else if (overlayMode === "chunks") {

                if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {

                    const parts = url.pathname.split("/");

                    const [chunk1, chunk2] = [parts.at(-2), parts.at(-1).split(".")[0]];

                    const canvas = new OffscreenCanvas(CHUNK_WIDTH, CHUNK_HEIGHT);

                    const ctx = canvas.getContext("2d", { willReadFrequently: true });

                    ctx.strokeStyle = 'red';

                    ctx.lineWidth = 1;

                    ctx.strokeRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);

                    ctx.font = '30px Arial';

                    ctx.fillStyle = 'red';

                    ctx.textAlign = 'center';

                    ctx.textBaseline = 'middle';

                    ctx.fillText(`${chunk1}, ${chunk2}`, CHUNK_WIDTH / 2, CHUNK_HEIGHT / 2);

                    const mergedBlob = await canvas.convertToBlob();

                    return new Response(mergedBlob, {

                        headers: { "Content-Type": "image/png" }

                    });

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

            img.onload = () => resolve({ img, width: img.naturalWidth, height: img.naturalHeight });

            img.onerror = reject;

            img.src = src;

        });

    }

    function patchUI() {

        if (document.getElementById("overlay-blend-button")) return;

        let blendButton = document.createElement("button");

        blendButton.id = "overlay-blend-button";

        blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);

        blendButton.style.backgroundColor = "#0e0e0e7f";

        blendButton.style.color = "white";

        blendButton.style.border = "solid";

        blendButton.style.borderColor = "#1d1d1d7f";

        blendButton.style.borderRadius = "4px";

        blendButton.style.padding = "5px 10px";

        blendButton.style.cursor = "pointer";

        blendButton.style.backdropFilter = "blur(2px)";

        blendButton.addEventListener("click", () => {

            overlayMode = OVERLAY_MODES[(OVERLAY_MODES.indexOf(overlayMode) + 1) % OVERLAY_MODES.length];

            blendButton.textContent = `${overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1)}`;

        });

        const buttonContainer = document.querySelector("div.gap-4:nth-child(1) > div:nth-child(2)");

        const leftSidebar = document.querySelector("html body div div.disable-pinch-zoom.relative.h-full.overflow-hidden.svelte-6wmtgk div.absolute.right-2.top-2.z-30 div.flex.flex-col.gap-4.items-center");

        if (buttonContainer) {

            buttonContainer.appendChild(blendButton);

            buttonContainer.classList.remove("items-center");

            buttonContainer.classList.add("items-end");

        }

        if (leftSidebar) {

            leftSidebar.classList.add("items-end");

            leftSidebar.classList.remove("items-center");

        }

    }

    const observer = new MutationObserver(patchUI);

    const observeTarget = document.querySelector("div.gap-4:nth-child(1)");

    if (observeTarget) {

        observer.observe(observeTarget, { childList: true, subtree: true });

    }

    patchUI();

})();