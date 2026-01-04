// ==UserScript==
// @name         Wikipedia link preview
// @namespace    http://tampermonkey.net/
// @version      2025-09-06
// @description  Show preview of Wikipedia articles when hovering over a link.
// @author       You
// @match        https://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548634/Wikipedia%20link%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/548634/Wikipedia%20link%20preview.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const {computePosition, autoUpdate, flip, shift} = await import('https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.7.3/+esm');

    const content = document.getElementById("mw-content-text");
    const links = content.querySelectorAll(`a[href*="wikipedia.org" i], a[href^="/wiki/" i]`);
    links.forEach(link => {
        const hovercard = document.createElement("div");
        hovercard.classList.add("hovercard");
        hovercard.dataset.link = link.href;
        hovercard.style.display = "none";
        hovercard.style.position = "absolute";
        hovercard.style.top = "0";
        hovercard.style.left = "0";
        hovercard.style.width = "fit-content";
        hovercard.style.maxWidth = "400px";
        hovercard.style.height = "fit-content";
        hovercard.style.maxHeight = "300px";
        hovercard.style.zIndex = "9999999";
        hovercard.style.background = "#ffffff";
        hovercard.style.padding = "1rem";
        hovercard.style.border = "1px solid #aaa";
        hovercard.style.borderRadius = "6px";

        function update() {
            computePosition(link, hovercard, {
                placement: 'bottom-end',
                middleware: [flip(), shift()],
            }).then(({x, y, placement, middlewareData}) => {
                Object.assign(hovercard.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
            });
        }

        function showHovercard() {
            hovercard.style.display = `block`;
            document.body.append(hovercard);
            update();
        }

        function hideHovercard() {
            hovercard.style.display = `none`;
            hovercard.remove();
        }

        [
            ['pointerenter', showHovercard],
            ['pointerleave', hideHovercard],
            ['focus', showHovercard],
            ['blur', hideHovercard],
        ].forEach(([event, listener]) => {
            link.addEventListener(event, listener);
        });

        link.addEventListener("pointerenter", async () => {
            if (hovercard.dataset.loaded === "true") {
                return;
            }

            const res = await fetch(link.href);
            const body = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(body, "text/html");

            const title = doc.getElementById("firstHeading").textContent;
            const contentDiv = doc.getElementById("mw-content-text");
            const paragraphs = contentDiv.querySelectorAll(`p:nth-of-type(-n+5)`);
            let content = ``;
            paragraphs.forEach(p => {
                if (content.length <= 760) {
                    if (p.textContent.length < 760 - content.length) {
                        content += `<p style="font-size: 0.875rem;">${p.innerHTML}</p>`;
                    } else {
                        content += `<p style="font-size: 0.875rem;">${p.innerHTML.substring(0, 760 - content.length)}...</p>`;
                        return;
                    }
                }
            });

            hovercard.innerHTML = `<h3>${title}</h3>${content}`;
            hovercard.dataset.loaded = "true";
        });
    });
})();
