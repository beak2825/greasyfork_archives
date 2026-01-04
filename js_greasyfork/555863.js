// ==UserScript==
// @name          Hashtag Bundler for X/Twitter and Bluesky (Unified)
// @namespace     https://codymkw.nekoweb.org/
// @version       2.7.3
// @description   Supercharge your hashtag workflow with a unified floating panel. Now with custom naming for combined bundles!
// @match         https://twitter.com/*
// @match         https://x.com/*
// @match         https://bsky.app/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/555863/Hashtag%20Bundler%20for%20XTwitter%20and%20Bluesky%20%28Unified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555863/Hashtag%20Bundler%20for%20XTwitter%20and%20Bluesky%20%28Unified%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const PANEL_ID = "universal-hashtag-panel";
    const STORAGE_KEY = "universalHashtagBundles";
    const COMBINED_KEY = STORAGE_KEY + "_combined";
    const COLLAPSED_KEY = STORAGE_KEY + "_collapsed";
    const loadData = () => { try { return JSON.parse(GM_getValue(STORAGE_KEY, "{}") || "{}"); } catch { return {}; } };
    const saveData = (v) => GM_setValue(STORAGE_KEY, JSON.stringify(v));
    const loadCombined = () => { try { return JSON.parse(GM_getValue(COMBINED_KEY, "{}") || "{}"); } catch { return {}; } };
    const saveCombined = (v) => GM_setValue(COMBINED_KEY, JSON.stringify(v));
    const loadCollapsed = () => { try { return JSON.parse(GM_getValue(COLLAPSED_KEY, "false")); } catch { return false; } };
    const saveCollapsed = (v) => GM_setValue(COLLAPSED_KEY, JSON.stringify(Boolean(v)));
    const el = (tag, props = {}, kids = []) => {
        const e = document.createElement(tag);
        for (const k in props) {
            if (k === "style" && typeof props[k] === "object") Object.assign(e.style, props[k]);
            else if (k === "html") e.innerHTML = props[k];
            else e[k] = props[k];
        }
        kids.forEach(c => e.appendChild(c));
        return e;
    };

    function getComposerTarget() {
        let node = document.querySelector('div[data-testid="tweetTextarea_0"]');
        if (node) {
            const inner = node.querySelector('div[contenteditable="true"], [contenteditable="true"]');
            if (inner) return { type: 'contenteditable', node: inner };
        }
        const generic = document.querySelector('div[contenteditable="true"], [contenteditable="true"]');
        if (generic) return { type: 'contenteditable', node: generic };
        const ta = document.querySelector('textarea');
        if (ta) return { type: 'textarea', node: ta };
        return null;
    }
    function moveCaretToEnd(contentEditableNode) {
        try {
            const range = document.createRange();
            range.selectNodeContents(contentEditableNode);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (err) { }
    }
    function insertTextAtEnd(text) {
        const target = getComposerTarget();
        if (!target) return false;
        if (target.type === 'textarea') {
            const ta = target.node;
            try { ta.focus(); } catch {}
            ta.value = ta.value + text;
            try { ta.dispatchEvent(new Event('input', { bubbles: true })); } catch {}
            return true;
        } else if (target.type === 'contenteditable') {
            const node = target.node;
            moveCaretToEnd(node);
            try { node.focus(); } catch (e) {}
            try {
                const success = document.execCommand('insertText', false, text);
                if (success) return true;
                node.textContent = node.textContent + text;
                return true;
            } catch (err) {
                try { node.textContent = node.textContent + text; return true; } catch (ee) { return false; }
            }
        }
        return false;
    }
    const confirmButton = (btn, originalText, confirmText) => {
        try { btn.textContent = confirmText; } catch {}
        setTimeout(() => { try { btn.textContent = originalText; } catch {} }, 3000);
    };
    const createPanel = () => {
        if (document.getElementById(PANEL_ID)) return;
        const panel = el("div", {
            id: PANEL_ID,
            style: `
                position:fixed;right:20px;
                background:#1f1f1f;color:white;border-radius:12px;padding:10px;
                font-family:sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.5);
                z-index:999999;transition: all 0.2s ease-in-out;
            `
        });
        const header = el("div", { style: "display:flex;justify-content:space-between;align-items:center;cursor:pointer;" });
        const title = el("span", { textContent: "Hashtag Bundles", style: "font-weight:700;" });
        const arrow = el("span", { textContent: "▼", style: "font-size:14px;" });
        header.append(title, arrow);
        const container = el("div", { id: "bundle-container", style: "max-height:520px;overflow-y:auto;padding-right:6px;margin-top:8px;" });
        panel.append(header, container);
        document.body.append(panel);
        let collapsed = loadCollapsed();
        const updatePanelLook = (isCollapsed) => {
            container.style.display = isCollapsed ? "none" : "block";
            arrow.textContent = isCollapsed ? "▲" : "▼";
            panel.style.bottom = isCollapsed ? "10px" : "20px";
            panel.style.width = isCollapsed ? "200px" : "340px";
            panel.style.padding = isCollapsed ? "8px 12px" : "10px";
        };
        updatePanelLook(collapsed);
        header.onclick = () => {
            collapsed = !collapsed;
            saveCollapsed(collapsed);
            updatePanelLook(collapsed);
        };
        render();
        function render() {
            container.innerHTML = "";
            const data = loadData();
            const combined = loadCombined();
            const newBtn = el("button", { textContent: "➕ New Bundle", style: "width:100%;padding:8px;margin-bottom:8px;border:none;border-radius:6px;background:#5865F2;color:white;font-weight:700;cursor:pointer;" });
            newBtn.onclick = () => {
                const name = prompt("Bundle name?");
                if (!name) return;
                const tags = prompt("Enter hashtags separated by spaces:");
                if (!tags) return;
                data[name] = tags.split(/\s+/).filter(Boolean).map(t => t.startsWith("#") ? t : "#" + t);
                saveData(data);
                render();
            };
            container.append(newBtn);
            const combineBtn = el("button", { textContent: "🔗 Combine Bundles", style: "width:100%;padding:8px;margin-bottom:8px;border:none;border-radius:6px;background:#9b59b6;color:white;font-weight:700;cursor:pointer;" });
            combineBtn.onclick = openCreateCombinedModal;
            container.append(combineBtn);
            const showCB = el("button", { textContent: "📂 Show Combined Bundles", style: "width:100%;padding:8px;margin-bottom:8px;border:none;border-radius:6px;background:#8e44ad;color:white;font-weight:700;cursor:pointer;" });
            showCB.onclick = openCombinedPopup;
            container.append(showCB);
            const ioWrap = el("div", { style: "display:flex;gap:8px;margin:10px 0;" });
            const exportBtn = el("button", { textContent: "Export", style: "flex:1;padding:8px;border:none;border-radius:6px;background:#4CAF50;color:white;font-weight:700;cursor:pointer;" });
            exportBtn.onclick = () => {
                const payload = { bundles: loadData(), combined: loadCombined() };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "UniversalHashtagBundles.json";
                a.click();
            };
            const importBtn = el("button", { textContent: "Import", style: "flex:1;padding:8px;border:none;border-radius:6px;background:#2196F3;color:white;font-weight:700;cursor:pointer;" });
            importBtn.onclick = () => {
                const f = document.createElement("input");
                f.type = "file";
                f.accept = "application/json";
                f.onchange = e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const r = new FileReader();
                    r.onload = ev => {
                        try {
                            const j = JSON.parse(ev.target.result);
                            saveData({ ...loadData(), ...(j.bundles || {}) });
                            saveCombined({ ...loadCombined(), ...(j.combined || {}) });
                            render();
                            alert("Import complete.");
                        } catch { alert("Invalid JSON."); }
                    };
                    r.readAsText(file);
                };
                f.click();
            };
            ioWrap.append(exportBtn, importBtn);
            container.append(ioWrap);
            const resetBtn = el("button", { textContent: "⚠️ Reset All Data", style: "width:100%;padding:8px;margin-bottom:8px;border:none;border-radius:6px;background:#c0392b;color:white;font-weight:700;cursor:pointer;" });
            resetBtn.onclick = () => {
                if (!confirm("Permanently delete ALL bundles?")) return;
                GM_deleteValue(STORAGE_KEY);
                GM_deleteValue(COMBINED_KEY);
                GM_deleteValue(COLLAPSED_KEY);
                render();
                alert("All data cleared.");
            };
            container.append(resetBtn);
            const selectLabel = el("div", { textContent: "Your Bundles", style: "font-weight:700;margin:6px 0 4px 0;" });
            const select = el("select", { id: "bundle-select", style: "width:100%;padding:8px;border-radius:6px;background:#262626;color:#fff;border:none;margin-bottom:8px;" });
            select.append(el("option", { textContent: "-- Select a bundle --", value: "" }));
            Object.keys(data).sort().forEach(n => select.append(el("option", { textContent: n, value: n })));
            container.append(selectLabel, select);
            const detail = el("div", { id: "bundle-detail", style: "background:#262626;border-radius:8px;padding:10px;margin-bottom:8px;display:none;" });
            container.append(detail);
            function renderDetail(bundleName) {
                detail.innerHTML = "";
                if (!bundleName) { detail.style.display = "none"; return; }
                const tagsArr = data[bundleName] || [];
                const nameEl = el("div", { textContent: bundleName, style: "font-weight:700;margin-bottom:6px;" });
                const tagsEl = el("div", { textContent: tagsArr.join(" "), style: "color:#ddd;margin-bottom:8px;word-break:break-word;" });
                const btnRow = el("div", { style: "display:flex;gap:8px;" });
                const mkbtn = (txt, bg, fn) => el("button", { textContent: txt, onclick: fn, style: `flex:1;padding:8px;border:none;border-radius:6px;background:${bg};color:white;font-weight:700;cursor:pointer;` });
                const insertBtn = mkbtn("Insert", "#2196F3", () => {
                    if (insertTextAtEnd(tagsArr.join(" ") + " ")) confirmButton(insertBtn, "Insert", "Inserted!");
                    else alert("Insert failed (composer not found).");
                });
                const copyBtn = mkbtn("Copy", "#4CAF50", async () => {
                    await navigator.clipboard.writeText(tagsArr.join(" ")).catch(() => alert("Copy error"));
                    confirmButton(copyBtn, "Copy", "Copied!");
                });
                const editBtn = mkbtn("Edit", "#555", () => {
                    const newName = prompt("Edit bundle name:", bundleName);
                    if (!newName) return;
                    const tags = prompt("Edit hashtags:", tagsArr.join(" "));
                    if (!tags) return;
                    if (newName !== bundleName) { delete data[bundleName]; }
                    data[newName] = tags.split(/\s+/).filter(Boolean).map(t => t.startsWith("#") ? t : "#" + t);
                    saveData(data);
                    render();
                    renderDetail(newName);
                });
                const delBtn = mkbtn("Delete", "#c0392b", () => {
                    if (!confirm(`Delete "${bundleName}"?`)) return;
                    delete data[bundleName];
                    saveData(data);
                    render();
                });
                btnRow.append(insertBtn, copyBtn, editBtn, delBtn);
                detail.append(nameEl, tagsEl, btnRow);
                detail.style.display = "block";
            }
            select.onchange = () => renderDetail(select.value);
            if (!Object.keys(data).length) {
                container.append(el("div", { textContent: "No bundles yet.", style: "color:#999;margin:8px 0;" }));
            }
            const combinedCount = Object.keys(combined).length;
            container.append(el("div", { textContent: `${combinedCount} combined bundle${combinedCount === 1 ? "" : "s"}.`, style: "font-size:12px;color:#bbb;margin-top:6px;" }));
        }
    };
    const openCreateCombinedModal = () => {
        const data = loadData();
        const bundles = Object.keys(data).sort();
        if (!bundles.length) return alert("No bundles available.");
        const backdrop = el("div", { id: "combine-backdrop", style: "position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:999999;" });
        const modal = el("div", { style: "position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#1f1f1f;color:white;width:360px;padding:14px;border-radius:12px;z-index:1000000;box-shadow:0 6px 24px rgba(0,0,0,0.6);" });
        document.body.append(backdrop); backdrop.append(modal);
        const title = el("div", { textContent: "Combine Bundles", style: "font-weight:700;margin-bottom:10px;" });
        const closeBtn = el("div", { html: "&#x274C;", style: "position:absolute;right:12px;top:12px;font-size:22px;cursor:pointer;" });
        closeBtn.onclick = () => backdrop.remove();
        modal.append(title, closeBtn);
        let order = [];
        const list = el("div", { style: "max-height:220px;overflow:auto;margin-bottom:10px;" });
        bundles.forEach(n => {
            const row = el("div", { style: "display:flex;align-items:center;gap:8px;background:#262626;padding:8px;border-radius:6px;margin-bottom:4px;" });
            const cb = el("input", { type: "checkbox" });
            cb.onchange = () => { if (cb.checked) order.push(n); else order = order.filter(x => x !== n); updatePreview(); };
            row.append(cb, el("span", { textContent: n }));
            list.append(row);
        });
        const preview = el("div", { style: "padding:8px;background:#262626;border-radius:6px;min-height:28px;margin-bottom:12px;word-break:break-word;font-size:12px;" });
        const updatePreview = () => { preview.textContent = [...new Set(order.flatMap(n => data[n] || []))].join(" ") || "(none)"; };

        const createBtn = el("button", { textContent: "Create", style: "width:100%;padding:8px;background:#27ae60;color:white;border:none;border-radius:6px;margin-bottom:8px;cursor:pointer;" });
        createBtn.onclick = () => {
            if (!order.length) return alert("Select at least one bundle.");

            // --- MODIFIED SECTION START ---
            const customName = prompt("Enter a name for this combined bundle:");
            if (!customName) return;

            const ts = Date.now();
            const key = `Combined_${customName.replace(/[^\w]/g, '_')}_${ts}`;
            const combined = loadCombined();
            combined[key] = {
                label: customName,
                fullKey: key,
                sources: [...order],
                tags: [...new Set(order.flatMap(n => data[n] || []))]
            };
            // --- MODIFIED SECTION END ---

            saveCombined(combined);
            backdrop.remove();
        };
        modal.append(list, el("div", { textContent: "Preview:" }), preview, createBtn);
        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    };
    const openCombinedPopup = () => {
        const combined = loadCombined();
        const keys = Object.keys(combined).sort();
        if (!keys.length) return alert("No combined bundles.");
        const backdrop = el("div", { id: "combined-backdrop", style: "position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:999999;" });
        const popup = el("div", { style: "position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#1f1f1f;color:white;width:420px;padding:18px;border-radius:12px;z-index:1000000;max-height:560px;overflow-y:auto;" });
        document.body.append(backdrop); backdrop.append(popup);
        const closeBtn = el("div", { html: "&#x274C;", style: "position:absolute;right:12px;top:12px;font-size:22px;cursor:pointer;" });
        closeBtn.onclick = () => backdrop.remove();
        popup.append(el("div", { textContent: "Combined Bundles", style: "font-weight:700;margin-bottom:12px;" }), closeBtn);
        const grid = el("div", { style: "display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px;" });
        popup.append(grid);
        keys.forEach(key => {
            const combo = combined[key];
            const wrap = el("div", { style: "background:#262626;border-radius:8px;padding:10px;" });
            const displayLabel = combo.label; // Directly use the stored label
            const labelEl = el("div", { textContent: displayLabel, style: "font-weight:700;margin-bottom:6px;" });
            const tagsEl = el("div", { textContent: combo.tags.join(" "), style: "font-size:12px;color:#ccc;margin-bottom:8px;word-break:break-word;" });
            const btnRow = el("div", { style: "display:flex;gap:8px;" });
            const mkbtn = (t, bg, fn) => el("button", { textContent: t, onclick: fn, style: `flex:1;padding:8px;border:none;border-radius:6px;background:${bg};color:white;cursor:pointer;` });
            const ins = mkbtn("Insert", "#2196F3", () => insertTextAtEnd(combo.tags.join(" ") + " "));
            const del = mkbtn("Delete", "#c0392b", () => { delete combined[key]; saveCombined(combined); wrap.remove(); });
            btnRow.append(ins, del);
            wrap.append(labelEl, tagsEl, btnRow);
            grid.append(wrap);
        });
        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    };
    let panelVisible = false;
    const observer = new MutationObserver(() => {
        const c = document.querySelector("textarea, div[contenteditable='true']");
        if (c && !panelVisible) { createPanel(); panelVisible = true; }
        else if (!c && panelVisible) { const p = document.getElementById(PANEL_ID); if (p) p.remove(); panelVisible = false; }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (document.querySelector("textarea, div[contenteditable='true']")) { createPanel(); panelVisible = true; }
})();