// ==UserScript==
// @name         FV - Explorer TEST
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.3
// @description  Adds click progress to explorations. Does NOT handle events, the user needs to check for events regularly to keep the script working.
// @match        https://www.furvilla.com/career/explorer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560827/FV%20-%20Explorer%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/560827/FV%20-%20Explorer%20TEST.meta.js
// ==/UserScript==


(function () {
    "use strict";

    let allItems = {};
    let totalFC = 0;
    let currentIndex = 0;
    let isRunning = false;

    function parseExplore(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // FC generation
        const fcNode = doc.querySelector(".gold");
        if (fcNode) {
            const num = fcNode.textContent.match(/\d+/);
            if (num) totalFC += parseInt(num[0], 10);
        }

        const itemNodes = doc.querySelectorAll(".explore-item");
        itemNodes.forEach(node => {
            const img = node.querySelector("img");
            const p = node.querySelector("p");
            if (!img || !p) return;

            const itemName = p.childNodes[0].textContent.trim();
            const counter = p.querySelector(".counter");
            if (!counter) return;

            const itemCount = parseInt(counter.textContent, 10) || 0;

            if (!allItems[itemName]) {
                allItems[itemName] = { count: 0, imgSrc: img.src };
            }
            allItems[itemName].count += itemCount;
        });
    }

    async function doExplore(total) {
        if (isRunning) return false;

        const btn = document.querySelector('.registration-well .btn.big');
        if (!btn) return false;

        if (btn.textContent.includes("Event!")) {
            stopProgressBar("Event Detected");
            btn.scrollIntoView({ behavior: "smooth", block: "center" });
            return false;
        }

        const url = btn.getAttribute("data-url");
        if (!url) return false;

        try {
            isRunning = true;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const html = await res.text();
            parseExplore(html);

            currentIndex++;
            updateProgress(total, currentIndex);
        } catch (error) {
            console.error("Explore error:", error);
            return false;
        } finally {
            isRunning = false;
        }

        return true;
    }

    function updateProgress(total, done) {
        let wrap = document.getElementById("fv-explore-progress");

        if (!wrap) {
            wrap = document.createElement("div");
            wrap.id = "fv-explore-progress";
            wrap.style.marginTop = "10px";
            wrap.style.minHeight = "40px";

            const text = document.createElement("div");
            text.id = "fv-progress-text";
            text.className = "career-label";
            text.style.fontWeight = "bold";
            wrap.appendChild(text);

            const outer = document.createElement("div");
            outer.style.width = "100%";
            outer.style.height = "18px";
            outer.style.background = "#d8e7ff";
            outer.style.border = "1px solid #9bb8dd";
            outer.style.borderRadius = "4px";
            outer.style.marginTop = "4px";

            const inner = document.createElement("div");
            inner.id = "fv-progress-bar";
            inner.style.height = "100%";
            inner.style.width = "0%";
            inner.style.background = "#6ba4e7";
            inner.style.borderRadius = "4px";
            inner.style.transition = "width 0.3s ease";

            outer.appendChild(inner);
            wrap.appendChild(outer);

            const well = document.querySelector(".registration-well");
            if (well) well.appendChild(wrap);
        }

        const textEl = document.getElementById("fv-progress-text");
        const barEl = document.getElementById("fv-progress-bar");

        if (textEl) {
            textEl.textContent = `Exploring… ${done}/${total}`;
            textEl.style.color = "";
        }

        if (barEl) {
            barEl.style.width = `${Math.min(100, (done / total) * 100)}%`;
            barEl.style.background = "#6ba4e7";
        }
    }

    function stopProgressBar(reason = "") {
        const text = document.getElementById("fv-progress-text");
        if (text) {
            text.textContent += ` — STOPPED (${reason})`;
            text.style.color = "#c00000";
        }

        const bar = document.getElementById("fv-progress-bar");
        if (bar) {
            bar.style.background = "#c00000";
        }
    }

    function renderResults() {
        const container = document.createElement("div");
        container.style.marginTop = "15px";

        const box = document.createElement("blockquote");
        box.className = "info";
        box.style.fontSize = "14px";
        box.style.borderLeft = "none";

        const title = document.createElement("h2");
        title.textContent = "Explore Results";
        title.style.marginTop = "0";
        box.appendChild(title);

        const fc = document.createElement("div");
        fc.style.fontSize = "15px";
        fc.style.fontWeight = "bold";
        fc.style.textAlign = "center";
        fc.style.marginBottom = "10px";

        fc.innerHTML = `
            Total FC Found: ${totalFC}
            <img src="https://www.furvilla.com/img/furcoins.gif"
                 style="width:16px;height:16px;vertical-align:middle;margin-left:4px;">
        `;
        box.appendChild(fc);

        const ul = document.createElement("ul");
        ul.style.display = "flex";
        ul.style.flexWrap = "wrap";
        ul.style.listStyle = "none";
        ul.style.padding = "0";
        ul.style.margin = "0";
        ul.style.justifyContent = "center";
        ul.style.gap = "10px";

        for (const [name, item] of Object.entries(allItems)) {
            const li = document.createElement("li");
            li.className = "inventory-item-small";
            li.style.position = "relative";
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.justifyContent = "center";

            const img = document.createElement("img");
            img.src = item.imgSrc;
            img.style.maxWidth = "60px";
            img.style.maxHeight = "60px";
            img.style.objectFit = "contain";
            li.appendChild(img);

            const badge = document.createElement("div");
            badge.textContent = `x${item.count}`;
            badge.style.position = "absolute";
            badge.style.bottom = "3px";
            badge.style.right = "4px";
            badge.style.background = "rgba(0,0,0,0.75)";
            badge.style.color = "#fff";
            badge.style.fontSize = "11px";
            badge.style.padding = "1px 5px";
            badge.style.borderRadius = "3px";
            li.appendChild(badge);

            ul.appendChild(li);
        }

        box.appendChild(ul);
        container.appendChild(box);

        const well = document.querySelector(".registration-well");
        if (well) well.appendChild(container);
    }

    async function exploreAll(total) {
        if (total <= 0) return;

        currentIndex = 0;
        allItems = {};
        totalFC = 0;

        while (currentIndex < total) {
            const ok = await doExplore(total);
            if (!ok) break;

            // Add a slightly longer delay for Firefox
            await new Promise(r => setTimeout(r, 300));
        }

        renderResults();
    }

    function init() {
        setTimeout(() => {
            const regWell = document.querySelector('.registration-well');
            if (!regWell) {
                console.warn("Registration well not found");
                return;
            }

            regWell.style.position = 'relative';

            const infoIconContainer = document.createElement('div');
            infoIconContainer.style.position = 'absolute';
            infoIconContainer.style.top = '10px';
            infoIconContainer.style.right = '10px';
            infoIconContainer.style.zIndex = '999';

            const infoIcon = document.createElement('i');
            infoIcon.className = 'fas fa-question-circle';
            infoIcon.style.cursor = 'help';
            infoIcon.style.opacity = '0.6';
            infoIcon.style.fontSize = '18px';

            const tooltipSpan = document.createElement('span');
            tooltipSpan.textContent = 'If no progress bar appears, click Explore to begin. At 50% progress, check for events by selecting Explore, and continue until exploration reaches 0.';
            tooltipSpan.style.display = 'none';
            tooltipSpan.style.position = 'absolute';
            tooltipSpan.style.bottom = '125%';
            tooltipSpan.style.left = '50%';
            tooltipSpan.style.transform = 'translateX(-50%)';
            tooltipSpan.style.background = '#333';
            tooltipSpan.style.color = '#fff';
            tooltipSpan.style.padding = '12px 20px';
            tooltipSpan.style.borderRadius = '4px';
            tooltipSpan.style.fontSize = '14px';
            tooltipSpan.style.transition = 'opacity 0.3s ease';
            tooltipSpan.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
            tooltipSpan.style.opacity = '0';
            tooltipSpan.style.maxWidth = '250px';
            tooltipSpan.style.width = '250px';
            tooltipSpan.style.textAlign = 'center';
            tooltipSpan.style.wordWrap = 'break-word';
            tooltipSpan.style.zIndex = '1000';

            infoIcon.addEventListener('mouseenter', () => {
                tooltipSpan.style.display = 'block';
                setTimeout(() => {
                    tooltipSpan.style.opacity = '1';
                }, 10);
            });

            infoIcon.addEventListener('mouseleave', () => {
                tooltipSpan.style.opacity = '0';
                setTimeout(() => {
                    if (tooltipSpan.style.opacity === '0') {
                        tooltipSpan.style.display = 'none';
                    }
                }, 300);
            });

            infoIconContainer.appendChild(infoIcon);
            infoIconContainer.appendChild(tooltipSpan);
            regWell.appendChild(infoIconContainer);

            const textElement = regWell.querySelector("div");
            const total = textElement ? parseInt(textElement.textContent.match(/\d+/)?.[0] || "0") : 0;

            if (total > 0) {
                // delay
                setTimeout(() => exploreAll(total), 500);
            }
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }
})();