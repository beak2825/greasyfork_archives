// ==UserScript==
// @name         Magnet Info Enhancer v3.6 (Stable Placement Fix)
// @namespace    Violentmonkey Scripts
// @version      3.6
// @description  Floating info boxes for magnet links with tracker details (guaranteed correct placement)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      checker.openwebtorrent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550178/Magnet%20Info%20Enhancer%20v36%20%28Stable%20Placement%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550178/Magnet%20Info%20Enhancer%20v36%20%28Stable%20Placement%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === API Fetch ===
    function getTorrentInfo(magnet, callback) {
        const apiUrl = "https://checker.openwebtorrent.com/check?magnet=" + encodeURIComponent(magnet);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            headers: { "accept": "application/json" },
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data) {
                        callback({
                            seeds: data.seeds ?? 0,
                            peers: data.peers ?? 0,
                            extra: data.extra ?? []
                        });
                    } else callback(null);
                } catch (e) {
                    console.error("API parse error:", e);
                    callback(null);
                }
            },
            onerror: () => callback(null)
        });
    }

    // === Position Helper with retry until valid ===
    function positionBox(box, link) {
        function tryPosition() {
            const rect = link.getBoundingClientRect();
            if (rect.width > 0 || rect.height > 0) {
                box.style.top = (window.scrollY + rect.bottom + 5) + "px";
                box.style.left = (window.scrollX + rect.left) + "px";
            } else {
                // Retry next frame if element not ready yet
                requestAnimationFrame(tryPosition);
            }
        }
        requestAnimationFrame(tryPosition);
    }

    // === UI Helpers ===
    function createBoxElement() {
        const box = document.createElement("div");
        Object.assign(box.style, {
            position: "absolute",
            background: "#1a1a1a",
            color: "#eee",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "8px",
            fontSize: "12px",
            fontFamily: "monospace",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            zIndex: 9999,
            maxWidth: "400px"
        });
        return box;
    }

    function createHeader(status, details, box) {
        const header = document.createElement("div");
        Object.assign(header.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        });

        // Status span
        status.textContent = "⏳ Checking...";
        status.style.color = "#ff0";
        header.appendChild(status);

        // Buttons
        const buttons = document.createElement("div");

        const detailsBtn = document.createElement("button");
        detailsBtn.textContent = "More details";
        Object.assign(detailsBtn.style, {
            background: "transparent",
            border: "none",
            color: "#0af",
            cursor: "pointer",
            fontSize: "12px",
            marginRight: "8px"
        });
        detailsBtn.onclick = () => {
            const visible = details.style.display === "block";
            details.style.display = visible ? "none" : "block";
            detailsBtn.textContent = visible ? "More details" : "Hide details";
        };

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "❌";
        Object.assign(closeBtn.style, {
            background: "transparent",
            border: "none",
            color: "#f55",
            cursor: "pointer",
            fontSize: "13px"
        });
        closeBtn.onclick = () => box.remove();

        buttons.appendChild(detailsBtn);
        buttons.appendChild(closeBtn);
        header.appendChild(buttons);

        return header;
    }

    function buildTrackerList(extra) {
        if (!extra.length) {
            return document.createTextNode("No tracker details available.");
        }

        const container = document.createElement("div");
        extra.forEach(t => {
            const row = document.createElement("div");
            Object.assign(row.style, {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3px"
            });

            const tracker = document.createElement("span");
            tracker.textContent = t.tracker;

            const stats = document.createElement("span");
            if (t.seeds !== undefined) {
                stats.textContent = `⬆ ${t.seeds} ⬇ ${t.peers} DL: ${t.downloads}`;
                stats.style.color =
                    (t.seeds === 0 && t.peers === 0) ? "#ff0" : "#0f0";
            } else if (t.error) {
                stats.textContent = "ERROR";
                stats.style.color = "#f55";
            }

            row.appendChild(tracker);
            row.appendChild(stats);
            container.appendChild(row);
        });

        return container;
    }

    // === Main UI Builder ===
    function createFloatingBox(link) {
        const box = createBoxElement();

        const status = document.createElement("span");
        const details = document.createElement("div");
        Object.assign(details.style, {
            display: "none",
            marginTop: "6px",
            fontSize: "11px",
            whiteSpace: "normal"
        });

        const header = createHeader(status, details, box);
        box.appendChild(header);
        box.appendChild(details);

        document.body.appendChild(box);

        // Position after DOM + ensure non-zero rect
        positionBox(box, link);

        // Reposition on scroll/resize
        window.addEventListener("scroll", () => positionBox(box, link));
        window.addEventListener("resize", () => positionBox(box, link));

        return { status, details };
    }

    // === Main Runner ===
    document.addEventListener("DOMContentLoaded", () => {
        const links = document.querySelectorAll('a[href^="magnet:"]');
        links.forEach(link => {
            const { status, details } = createFloatingBox(link);

            getTorrentInfo(link.href, info => {
                if (info) {
                    status.textContent = `⬆ Seeds: ${info.seeds}   ⬇ Peers: ${info.peers}`;
                    status.style.color =
                        (info.seeds === 0 && info.peers === 0) ? "#f55" : "#0f0";

                    details.innerHTML = "";
                    details.appendChild(buildTrackerList(info.extra));
                } else {
                    status.textContent = "❌ No info available";
                    status.style.color = "#f55";
                    details.textContent = "No tracker data.";
                }
            });
        });
    });
})();
