// ==UserScript==
// @name         WP Media Library AI alt text applier
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Apply AI-generated alt texts to Media Library images (1,2,3...) using WP REST API; sequential, skip existing, infinite retry, global cooldown on failures.
// @match        *://*/*wp-admin/upload.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556493/WP%20Media%20Library%20AI%20alt%20text%20applier.user.js
// @updateURL https://update.greasyfork.org/scripts/556493/WP%20Media%20Library%20AI%20alt%20text%20applier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PANEL_ID = 'wp-alt-ai-panel';
    const ATTACHMENT_SELECTOR = '.attachments-wrapper .attachment';
    const IMG_SELECTOR = '.attachments-wrapper .attachment img, .attachments-wrapper .thumbnail img';

    // Global cooldown state for ALL media updates
    let globalCooldownUntil = 0;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForGlobalCooldown() {
        const now = Date.now();
        if (now < globalCooldownUntil) {
            const ms = globalCooldownUntil - now;
            console.warn('[WP Alt AI REST] Global cooldown active, waiting', ms, 'ms before next POST');
            await sleep(ms);
        }
    }

    function activateGlobalCooldown(delayMs) {
        const until = Date.now() + delayMs;
        if (until > globalCooldownUntil) {
            globalCooldownUntil = until;
            console.warn('[WP Alt AI REST] Global cooldown set for', delayMs, 'ms (until', new Date(globalCooldownUntil).toISOString(), ')');
        }
    }

    // ---------- UI PANEL ----------

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.left = '20px';
        panel.style.width = '320px';
        panel.style.maxHeight = '50vh';
        panel.style.zIndex = '999999';
        panel.style.background = 'rgba(0,0,0,0.85)';
        panel.style.color = '#fff';
        panel.style.padding = '10px';
        panel.style.borderRadius = '6px';
        panel.style.fontSize = '12px';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.gap = '6px';
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';

        const title = document.createElement('div');
        title.textContent = 'AI alt text (paste Gemini output):';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '4px';

        const textarea = document.createElement('textarea');
        textarea.id = 'wp-alt-ai-input';
        textarea.style.width = '100%';
        textarea.style.height = '150px';
        textarea.style.resize = 'vertical';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '11px';

        const status = document.createElement('div');
        status.id = 'wp-alt-ai-status';
        status.textContent = 'Waiting for input...';
        status.style.fontSize = '11px';
        status.style.opacity = '0.8';

        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.justifyContent = 'space-between';
        btnRow.style.gap = '6px';

        const parseBtn = document.createElement('button');
        parseBtn.textContent = 'Parse only';
        parseBtn.style.flex = '1';
        parseBtn.style.padding = '4px 6px';
        parseBtn.style.fontSize = '11px';
        parseBtn.style.cursor = 'pointer';

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Parse + apply (REST, sequential)';
        applyBtn.style.flex = '1';
        applyBtn.style.padding = '4px 6px';
        applyBtn.style.fontSize = '11px';
        applyBtn.style.cursor = 'pointer';
        applyBtn.style.background = '#36c';
        applyBtn.style.color = '#fff';
        applyBtn.style.border = 'none';
        applyBtn.style.borderRadius = '3px';

        parseBtn.addEventListener('click', () => {
            const text = textarea.value;
            const map = parseGeminiAltBlock(text);
            const count = Object.keys(map).length;
            status.textContent = `Parsed ${count} index → alt entries (no changes applied).`;
            console.log('[WP Alt AI REST] Parsed index map:', map);
        });

        applyBtn.addEventListener('click', () => {
            const text = textarea.value;
            const map = parseGeminiAltBlock(text);
            const count = Object.keys(map).length;
            if (!count) {
                status.textContent = 'No entries parsed. Check the format.';
                return;
            }
            status.textContent = `Parsed ${count} entries. Resolving attachments and saving via REST (sequential)...`;
            console.log('[WP Alt AI REST] Applying index map:', map);
            applyAltTextsByIndexRestSequential(map, status);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '4px';
        closeBtn.style.right = '6px';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#fff';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '14px';
        closeBtn.addEventListener('click', () => {
            panel.remove();
        });

        btnRow.appendChild(parseBtn);
        btnRow.appendChild(applyBtn);

        panel.appendChild(title);
        panel.appendChild(textarea);
        panel.appendChild(btnRow);
        panel.appendChild(status);
        panel.appendChild(closeBtn);

        document.body.appendChild(panel);

        console.log('[WP Alt AI REST] Panel created');
    }

    // ---------- PARSING GEMINI OUTPUT ----------

    function parseGeminiAltBlock(text) {
        const lines = text.split(/\r?\n/);
        const map = {};
        let currentIndex = null;

        for (let rawLine of lines) {
            const line = rawLine.trim();

            // "## 1.jpg" / "## 1.png"
            const fileMatch = line.match(/^##\s+(\d+)(?:\.[^\s]+)?\s*$/);
            if (fileMatch) {
                currentIndex = parseInt(fileMatch[1], 10);
                continue;
            }

            if (!currentIndex) continue;

            const mainMatch = line.match(/^\*\s*\*\*Main:\*\*\s*(.+)$/i);
            if (mainMatch) {
                const altText = mainMatch[1].trim();
                map[currentIndex] = altText;
                continue;
            }

            const mainPlain = line.match(/^\*\s*Main:\s*(.+)$/i);
            if (mainPlain) {
                const altText = mainPlain[1].trim();
                map[currentIndex] = altText;
                continue;
            }
        }

        return map;
    }

    // ---------- REST API HELPERS ----------

    function getWpApiConfig() {
        const cfg = (window.wpApiSettings || window.wpapiSettings || null);
        if (!cfg || !cfg.root || !cfg.nonce) {
            console.warn('[WP Alt AI REST] wpApiSettings missing or incomplete:', cfg);
            return null;
        }
        let root = cfg.root;
        if (root.endsWith('/')) root = root.slice(0, -1);
        return { root, nonce: cfg.nonce };
    }

    function getMediaAltRest(apiCfg, mediaId) {
        const url = `${apiCfg.root}/wp/v2/media/${mediaId}?_fields=id,alt_text`;
        return fetch(url, {
            method: 'GET',
            headers: {
                'X-WP-Nonce': apiCfg.nonce
            }
        }).then(res => {
            const status = res.status;
            const ok = res.ok;
            return res.json()
                .catch(() => null)
                .then(json => ({ ok, status, json }));
        }).catch(err => {
            console.error('[WP Alt AI REST] Fetch error (GET) for ID', mediaId, err);
            return { ok: false, status: 0, json: null };
        });
    }

    async function updateMediaAltRest(apiCfg, mediaId, altText) {
        // Respect global cooldown before each POST
        await waitForGlobalCooldown();

        const url = `${apiCfg.root}/wp/v2/media/${mediaId}`;

        console.log('[WP Alt AI REST] Updating media', mediaId, 'alt_text =>', altText);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': apiCfg.nonce
            },
            body: JSON.stringify({ alt_text: altText })
        }).then(res => {
            const status = res.status;
            const ok = res.ok;
            return res.json()
                .catch(() => null)
                .then(json => ({ ok, status, json }));
        }).catch(err => {
            console.error('[WP Alt AI REST] Fetch error (POST) for ID', mediaId, err);
            return { ok: false, status: 0, json: null };
        });
    }

    // Infinite retry with global cooldown on overload, per item, sequential
    async function updateMediaAltWithInfiniteRetry(apiCfg, mediaId, altText, updateStatus) {
        let attempt = 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const result = await updateMediaAltRest(apiCfg, mediaId, altText);
            const ok = result.ok && result.json && !result.json.code;

            if (ok) {
                return { success: true, result };
            }

            const status = result.status;
            const isServerBusy =
                status === 429 ||
                (status >= 500 && status <= 599);

            let delayMs;

            if (isServerBusy || attempt >= 3) {
                // heavy errors / overloaded: 5–10s and enable global cooldown
                const base = 5000;
                const jitter = Math.floor(Math.random() * 5000); // 0–5000
                delayMs = base + jitter;
                activateGlobalCooldown(delayMs);
                console.warn(
                    '[WP Alt AI REST] Server busy or many errors for ID',
                    mediaId,
                    'status',
                    status,
                    'attempt',
                    attempt,
                    '— global cooldown',
                    delayMs,
                    'ms'
                );
            } else {
                // early retries: smaller per-item delay, no global cooldown yet
                delayMs = 400 * attempt;
                console.warn(
                    '[WP Alt AI REST] Retry',
                    attempt,
                    'for ID',
                    mediaId,
                    'after',
                    delayMs,
                    'ms'
                );
            }

            if (typeof updateStatus === 'function') {
                updateStatus(`Retrying ID ${mediaId}, attempt ${attempt + 1} in ${(delayMs / 1000).toFixed(1)}s...`);
            }

            attempt += 1;
            await sleep(delayMs);
        }
    }

    // ---------- APPLY BY INDEX (SEQUENTIAL, INFINITE RETRY, SKIP-EXISTING, GLOBAL COOLDOWN) ----------

    async function applyAltTextsByIndexRestSequential(indexMap, statusEl) {
        const apiCfg = getWpApiConfig();
        if (!apiCfg) {
            statusEl.textContent = 'wpApiSettings not found. Cannot call REST API to save alt texts.';
            return;
        }

        const attachments = Array.from(document.querySelectorAll(ATTACHMENT_SELECTOR));
        if (!attachments.length) {
            statusEl.textContent = 'No media attachments found on this page.';
            console.log('[WP Alt AI REST] No attachments found with selector:', ATTACHMENT_SELECTOR);
            return;
        }

        const tasks = [];
        attachments.forEach((el, idx) => {
            const index = idx + 1; // 1-based index
            const altText = indexMap[index];
            if (!altText) return;

            let id =
                el.getAttribute('data-id') ||
                el.getAttribute('data-attachment-id') ||
                '';

            if (!id && el.id) {
                const m = el.id.match(/(\d+)/);
                if (m) id = m[1];
            }

            if (!id) {
                console.warn('[WP Alt AI REST] No media ID found for index', index, 'element:', el);
                return;
            }

            const mediaId = parseInt(id, 10);
            if (!mediaId) {
                console.warn('[WP Alt AI REST] Invalid media ID for index', index, 'raw id:', id);
                return;
            }

            tasks.push({ mediaId, index, altText });
        });

        if (!tasks.length) {
            statusEl.textContent = 'No matching indices with valid media IDs on this page.';
            console.log('[WP Alt AI REST] No tasks built from indexMap and attachments.');
            return;
        }

        console.log('[WP Alt AI REST] Tasks to process (sequential, infinite retry, skip-existing, global cooldown):', tasks);
        statusEl.textContent = `Sequentially updating ${tasks.length} image(s) via REST API...`;

        let done = 0;
        let skipped = 0;

        const updateStatusSummary = (currentTaskInfo = '') => {
            statusEl.textContent =
                `${currentTaskInfo} Success: ${done}, Skipped (already had alt): ${skipped}, Total: ${tasks.length}`;
        };

        // Process each task strictly one-by-one
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const prefix = `(${i + 1}/${tasks.length}) ID ${task.mediaId} index ${task.index} —`;

            updateStatusSummary(`${prefix} checking current alt...`);

            // 1) GET alt
            const infoRes = await getMediaAltRest(apiCfg, task.mediaId);
            if (infoRes.ok && infoRes.json) {
                const currentAlt = (infoRes.json.alt_text || '').trim();
                if (currentAlt.length > 0) {
                    skipped++;
                    console.log('[WP Alt AI REST] Skipping ID', task.mediaId, 'index', task.index, 'because it already has alt_text:', currentAlt);
                    updateStatusSummary();
                    continue;
                }
            } else {
                console.warn('[WP Alt AI REST] Failed to GET info for ID', task.mediaId, 'index', task.index, 'response:', infoRes);
                // If GET fails, we still try to set the alt with infinite retry.
            }

            // 2) POST alt with infinite retry
            updateStatusSummary(`${prefix} setting alt (with infinite retry)...`);
            const res = await updateMediaAltWithInfiniteRetry(apiCfg, task.mediaId, task.altText, msg => {
                statusEl.textContent =
                    `${prefix} ${msg} | Success: ${done}, Skipped: ${skipped}, Total: ${tasks.length}`;
            });

            if (res && res.success) {
                done++;
                console.log('[WP Alt AI REST] Updated ID', task.mediaId, 'index', task.index);
                updateStatusSummary();
            }
        }

        statusEl.textContent =
            `Done (sequential). Success: ${done}, Skipped (already had alt): ${skipped}. Global cooldown was used whenever the server looked overloaded.`;
        console.log('[WP Alt AI REST] Finished. Success:', done, 'Skipped:', skipped);
    }

    // ---------- INIT WHEN GRID IS READY ----------

    function initWhenReady() {
        if (document.querySelector(IMG_SELECTOR)) {
            createPanel();
            return;
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(IMG_SELECTOR)) {
                observer.disconnect();
                createPanel();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    initWhenReady();
})();
