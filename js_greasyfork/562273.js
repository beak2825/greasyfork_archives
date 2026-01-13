// ==UserScript==
// @name         Bunpro Review Type Changer
// @namespace    https://bunpro.jp/
// @version      1.4
// @description  Dashboard modal to bulk-change review input types
// @match        https://bunpro.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562273/Bunpro%20Review%20Type%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/562273/Bunpro%20Review%20Type%20Changer.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    /* =========================
       CONSTANTS
    ========================= */

    const API_BASE = "https://api.bunpro.jp/api/frontend";
    const SRS_LABELS = {
        beginner: "1–3",
        adept: "4–6",
        seasoned: "7–9",
        expert: "10-11",
        master: "12",
    };
    const REVIEW_TYPES = ["Cloze", "ClozeFlashcard", "Manual Input", "Flashcard", "Reading", "Listening"];
    const REVIEWABLE_TYPES = ["Vocab", "Grammar"];
    const SLEEP_MS = 300;

    /* =========================
       HELPERS
    ========================= */

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="))
            ?.split("=")[1];
    }

    const token = getCookie("frontend_api_token");
    if (!token) {
        console.error("❌ frontend_api_token not found");
        return;
    }

    const headers = {
        "Authorization": `Token token=${token}`,
        "Accept": "application/json",
    };

    async function fetchPage(level, reviewableType, page) {
        const url =
              `${API_BASE}/user_stats/srs_level_details` +
              `?level=${level}&reviewable_type=${reviewableType}&page=${page}`;

        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`Fetch failed (${level}, ${reviewableType}, page ${page})`);
        return res.json();
    }

    async function changeReviewType(reviewId, targetType) {
        const url =
              `${API_BASE}/reviews/${reviewId}/change_review_type` +
              `?default_input_type=${targetType}`;

        const res = await fetch(url, { method: "POST", headers });
        if (!res.ok) throw new Error(`Update failed (${reviewId})`);
    }

    /* =========================
       STYLES
    ========================= */

    const style = document.createElement("style");
    style.textContent = `
        .bp-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #374151;
            border-top-color: #60a5fa;
            border-radius: 50%;
            animation: bp-spin 0.8s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
        }

        @keyframes bp-spin {
            to { transform: rotate(360deg); }
        }
        .bp-rtc-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.6);
            z-index: 9998;
        }
        .bp-rtc-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: #222222;
            color: #e5e7eb;
            padding: 16px;
            border-radius: 10px;
            z-index: 9999;
            box-shadow: 0 20px 40px rgba(0,0,0,.6);
            font-size: 14px;
        }
        .bp-rtc-modal h3 {
            margin-top: 0;
            font-size: 16px;
        }
        .bp-rtc-modal select,
        .bp-rtc-modal input[type="number"] {
            width: 20%;
            background: #2e2e2e;
            color: #e5e7eb;
            border: 1px solid #161616;
            padding: 6px;
            border-radius: 6px;
            text-align: end;
        }
        .bp-rtc-section {
            margin-bottom: 10px;
        }
        .bp-rtc-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 12px;
        }
        .bp-rtc-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
        }
        .bp-rtc-btn.secondary {
            background: #374151;
        }
        .bp-rtc-launch {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9997;
            background-color: color-mix(in oklab, rgb(var(--c-primary-accent) / 1) 100%, transparent);
            color: rgb(var(--c-primary-contrast) / 1);
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
        }
        .bp-check {
            color: #fbbf24;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    /* =========================
       LAUNCH BUTTON
    ========================= */

    const launchBtn = document.createElement("button");
    launchBtn.textContent = "Review Type Changer";
    launchBtn.className = "bp-rtc-launch";
    launchBtn.style.display = "none"; // hidden by default
    document.body.appendChild(launchBtn);

    function updateVisibility() {
        const onDashboard = location.pathname.startsWith("/dashboard");
        launchBtn.style.display = onDashboard ? "block" : "none";
    }

    let lastPath = location.pathname;

    setInterval(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            updateVisibility();
        }
    }, 300);

    // initial check
    updateVisibility();

    /* =========================
       MODAL
    ========================= */

    function openModal() {
        const overlay = document.createElement("div");
        overlay.className = "bp-rtc-overlay";

        const modal = document.createElement("div");
        modal.className = "bp-rtc-modal";

        modal.innerHTML = `
            <h3>Review Type Changer</h3>
            <br>

            <div class="bp-rtc-section">
                <b>What You want to change</b><br>
                ${REVIEWABLE_TYPES.map(t =>
                                       `<label><input type="radio" name="bp-type" value="${t}" ${t === "Vocab" ? "checked" : ""}> ${t}</label>`
                ).join("<br>")}
            </div>

            <div class="bp-rtc-section">
    <b>What SRS levels check</b><br>
    ${Object.keys(SRS_LABELS).map(level =>
                                  `<label>
            <input type="checkbox" value="${level}" checked>
            ${level.charAt(0).toUpperCase() + level.slice(1)}
            <span style="opacity:.7">(${SRS_LABELS[level]})</span>
        </label>`
    ).join("<br>")}
</div>

            <div class="bp-rtc-section">
                <b>Streak range (actual level of reviews)</b></br>
                <input id="bp-streak-min" type="number" value="1">
                -
                <input id="bp-streak-max" type="number" value="1">
            </div>

            <div class="bp-rtc-section">
                <b>Change review type to </b>
                <select id="bp-target-type" style="width:50%; text-align:start;">
                    ${REVIEW_TYPES.map(t =>
                                       `<option value="${t}">${t}</option>`
                    ).join("")}
                </select>
            </div>

            <div class="bp-rtc-section">
                <label>
                    <input type="checkbox" id="bp-check">
                    Check how many reviews would change</br>(without changing anything)
                </label>
            </div>

            <div class="bp-rtc-actions">
                <button class="bp-rtc-btn secondary" id="bp-cancel">Close</button>
                <button class="bp-rtc-btn" id="bp-run">Run</button>
            </div>

            <div id="bp-status" style="margin-top:8px"></div>
        `;

        document.body.append(overlay, modal);

        const close = () => {
            overlay.remove();
            modal.remove();
        };

        overlay.onclick = close;
        modal.querySelector("#bp-cancel").onclick = close;

        const updateCheckingInfo = (check) => {
          const status = modal.querySelector("#bp-status");

           console.log(status)
           console.log(check.target.checked)
          if (check.target.checked) {
              console.log("change inner")
              status.innerHTML = `<span class="bp-check">Checking enabled</span>`
          } else {
              console.log("blank inner")
              status.innerHTML = ''
          }
        };
        modal.querySelector("#bp-check").onclick = updateCheckingInfo;

        modal.querySelector("#bp-run").onclick = async () => {
            const runBtn = modal.querySelector("#bp-run");
            const status = modal.querySelector("#bp-status");

            const check = modal.querySelector("#bp-check").checked;

            if (!check) {
                if (!confirm("This will MODIFY your reviews. Continue?")) return;
            }

            runBtn.disabled = true;
            runBtn.textContent = "Running…";
            status.innerHTML = `
                <span class="bp-spinner"></span>
                ${check ? "Checking in progress…" : "Processing…"}
            `;

            const reviewableType = modal.querySelector("input[name='bp-type']:checked").value;
            const levels = [...modal.querySelectorAll("input[type=checkbox]")]
            .filter(cb => cb.checked && Object.keys(SRS_LABELS).includes(cb.value))
            .map(cb => cb.value);

            const targetType = modal.querySelector("#bp-target-type").value;
            const streakMin = Number(modal.querySelector("#bp-streak-min").value);
            const streakMax = Number(modal.querySelector("#bp-streak-max").value);

            let affected = 0;
            status.innerHTML = '<span class="bp-spinner"></span> Running...'

            for (const level of levels) {
                let page = 1;

                while (true) {
                    const data = await fetchPage(level, reviewableType, page);
                    const reviews = data.reviews?.data ?? [];

                    for (const r of reviews) {
                        const { id, attributes } = r;
                        const { streak, default_input_type } = attributes;

                        if (
                            streak >= streakMin &&
                            streak <= streakMax &&
                            default_input_type !== targetType
                        ) {
                            console.log(
                                `[${check ? "CHECK" : "LIVE"}] ${id} ` +
                                `${reviewableType} ${level} - streak ${streak} ` +
                                `${default_input_type} → ${targetType}`
                            );

                            affected++;
                            status.innerHTML =
                                `<span class="bp-spinner"></span> ${check ? "Would change" : "Changed"}: ${affected}`;

                            if (!check) {
                                await changeReviewType(id, targetType);
                                await sleep(SLEEP_MS);
                            }
                        }
                    }

                    if (!data.pagy || data.pagy.next === null) break;
                    page++;
                }
            }

            runBtn.disabled = false;
            runBtn.textContent = "Run";

            status.innerHTML = check
                ? `✅ <span class="bp-check">Check complete.</span> There are <b>${affected}</b> reviews to change.`
            : `✅ Completed. Changed <b>${affected}</b> reviews.`;

        };
    }

    launchBtn.onclick = openModal;

})();
