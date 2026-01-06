// ==UserScript==
// @name         Hashtag Bundler for X/Twitter and Bluesky (Unified)
// @namespace    https://codymkw.nekoweb.org/
// @version      2.8.0
// @description  Supercharge your hashtag workflow with a sleek, professional floating panel.
// @author       Cody
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://bsky.app/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555863/Hashtag%20Bundler%20for%20XTwitter%20and%20Bluesky%20%28Unified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555863/Hashtag%20Bundler%20for%20XTwitter%20and%20Bluesky%20%28Unified%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PANEL_ID = "universal-hashtag-panel";
    const STORAGE_KEY = "universalHashtagBundles";
    const COMBINED_KEY = STORAGE_KEY + "_combined";
    const COLLAPSED_KEY = STORAGE_KEY + "_collapsed";

    // CSS injection for professional styling
    const styles = `
        #${PANEL_ID} {
            position: fixed; right: 20px; bottom: 20px;
            background: rgba(24, 24, 27, 0.95);
            backdrop-filter: blur(10px);
            color: #e4e4e7;
            border-radius: 16px;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
            z-index: 999999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            width: 340px;
        }

        #${PANEL_ID}.collapsed {
            width: 220px;
            padding: 10px 16px;
        }

        .hp-header {
            display: flex; justify-content: space-between; align-items: center;
            cursor: pointer; user-select: none;
        }

        .hp-title { font-weight: 700; font-size: 14px; letter-spacing: 0.5px; color: #10b981; }

        .hp-btn {
            width: 100%; padding: 10px; margin-bottom: 8px; border: none; border-radius: 8px;
            font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        .hp-btn-primary { background: #10b981; color: white; }
        .hp-btn-primary:hover { background: #059669; transform: translateY(-1px); }

        .hp-btn-secondary { background: #3f3f46; color: #f4f4f5; }
        .hp-btn-secondary:hover { background: #52525b; }

        .hp-btn-danger { background: rgba(220, 38, 38, 0.1); color: #ef4444; border: 1px solid rgba(220, 38, 38, 0.2); }
        .hp-btn-danger:hover { background: #dc2626; color: white; }

        .hp-input-select {
            width: 100%; padding: 10px; border-radius: 8px; background: #27272a;
            color: #fff; border: 1px solid #3f3f46; margin-bottom: 12px; outline: none;
        }

        #bundle-container::-webkit-scrollbar { width: 6px; }
        #bundle-container::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }

        .hp-card {
            background: rgba(39, 39, 42, 0.5); border: 1px solid #3f3f46;
            border-radius: 10px; padding: 12px; margin-top: 10px;
        }

        .hp-modal-backdrop {
            position: fixed; inset: 0; background: rgba(0,0,0,0.7);
            backdrop-filter: blur(4px); z-index: 1000000;
            display: flex; align-items: center; justify-content: center;
        }

        .hp-modal {
            background: #18181b; width: 400px; padding: 24px; border-radius: 20px;
            border: 1px solid #3f3f46; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
        }
    `;

    const injectCSS = () => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    // --- Core Logic (Unchanged) ---
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
            else if (k === "className") e.className = props[k];
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
        const oldHtml = btn.innerHTML;
        btn.textContent = confirmText;
        setTimeout(() => { btn.innerHTML = oldHtml; }, 2000);
    };

    const createPanel = () => {
        if (document.getElementById(PANEL_ID)) return;
        injectCSS();
        
        const panel = el("div", { id: PANEL_ID });
        const header = el("div", { className: "hp-header" });
        const title = el("span", { textContent: "Hashtag Bundles", className: "hp-title" });
        const arrow = el("span", { textContent: "▼", style: "font-size:12px; opacity: 0.5" });
        header.append(title, arrow);

        const container = el("div", { id: "bundle-container", style: "max-height:500px;overflow-y:auto;margin-top:12px;" });
        panel.append(header, container);
        document.body.append(panel);

        let collapsed = loadCollapsed();
        const updatePanelLook = (isCollapsed) => {
            container.style.display = isCollapsed ? "none" : "block";
            arrow.textContent = isCollapsed ? "▲" : "▼";
            if (isCollapsed) panel.classList.add('collapsed');
            else panel.classList.remove('collapsed');
        };

        updatePanelLook(collapsed);
        header.onclick = () => {
            collapsed = !collapsed;
            saveCollapsed(collapsed);
            updatePanelLook(collapsed);
        };

        const render = () => {
            container.innerHTML = "";
            const data = loadData();
            const combined = loadCombined();

            const newBtn = el("button", { className: "hp-btn hp-btn-primary", html: "<span>+</span> New Bundle" });
            newBtn.onclick = () => {
                const name = prompt("Bundle name?");
                if (!name) return;
                const tags = prompt("Enter hashtags separated by spaces:");
                if (!tags) return;
                data[name] = tags.split(/\s+/).filter(Boolean).map(t => t.startsWith("#") ? t : "#" + t);
                saveData(data);
                render();
            };

            const combineBtn = el("button", { className: "hp-btn hp-btn-secondary", html: "<span>🔗</span> Combine Bundles" });
            combineBtn.onclick = openCreateCombinedModal;

            const showCB = el("button", { className: "hp-btn hp-btn-secondary", html: "<span>📂</span> View Combined" });
            showCB.onclick = openCombinedPopup;

            const ioWrap = el("div", { style: "display:flex;gap:8px;margin-bottom:8px;" });
            const exportBtn = el("button", { textContent: "Export", className: "hp-btn hp-btn-secondary", style: "margin:0; flex:1" });
            exportBtn.onclick = () => {
                const payload = { bundles: loadData(), combined: loadCombined() };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "HashtagBundles.json";
                a.click();
            };

            const importBtn = el("button", { textContent: "Import", className: "hp-btn hp-btn-secondary", style: "margin:0; flex:1" });
            importBtn.onclick = () => {
                const f = document.createElement("input");
                f.type = "file"; f.accept = "application/json";
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
                        } catch { alert("Invalid JSON."); }
                    };
                    r.readAsText(file);
                };
                f.click();
            };

            ioWrap.append(exportBtn, importBtn);
            container.append(newBtn, combineBtn, showCB, ioWrap);

            const selectLabel = el("div", { textContent: "Your Bundles", style: "font-size:11px; text-transform: uppercase; color: #71717a; margin: 12px 0 6px 4px; font-weight: 700;" });
            const select = el("select", { className: "hp-input-select" });
            select.append(el("option", { textContent: "Choose a bundle...", value: "" }));
            Object.keys(data).sort().forEach(n => select.append(el("option", { textContent: n, value: n })));
            
            const detail = el("div", { className: "hp-card", style: "display:none;" });
            container.append(selectLabel, select, detail);

            const renderDetail = (bundleName) => {
                detail.innerHTML = "";
                if (!bundleName) { detail.style.display = "none"; return; }
                const tagsArr = data[bundleName] || [];
                detail.append(
                    el("div", { textContent: bundleName, style: "font-weight:700;margin-bottom:4px;color:#10b981" }),
                    el("div", { textContent: tagsArr.join(" "), style: "font-size:12px;color:#a1a1aa;margin-bottom:12px;max-height:60px;overflow:hidden;text-overflow:ellipsis;" }),
                    el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:6px;" }, [
                        el("button", { className: "hp-btn hp-btn-primary", style: "margin:0;padding:6px", textContent: "Insert", onclick: (e) => {
                             if(insertTextAtEnd(tagsArr.join(" ") + " ")) confirmButton(e.target, "Insert", "Done!");
                        }}),
                        el("button", { className: "hp-btn hp-btn-secondary", style: "margin:0;padding:6px", textContent: "Copy", onclick: async (e) => {
                             await navigator.clipboard.writeText(tagsArr.join(" "));
                             confirmButton(e.target, "Copy", "Copied!");
                        }}),
                        el("button", { className: "hp-btn hp-btn-secondary", style: "margin:0;padding:6px", textContent: "Edit", onclick: () => {
                            const newName = prompt("Edit bundle name:", bundleName);
                            if (!newName) return;
                            const tags = prompt("Edit hashtags:", tagsArr.join(" "));
                            if (!tags) return;
                            if (newName !== bundleName) { delete data[bundleName]; }
                            data[newName] = tags.split(/\s+/).filter(Boolean).map(t => t.startsWith("#") ? t : "#" + t);
                            saveData(data); render(); renderDetail(newName);
                        }}),
                        el("button", { className: "hp-btn hp-btn-danger", style: "margin:0;padding:6px", textContent: "Delete", onclick: () => {
                            if (confirm(`Delete "${bundleName}"?`)) { delete data[bundleName]; saveData(data); render(); }
                        }})
                    ])
                );
                detail.style.display = "block";
            };

            select.onchange = () => renderDetail(select.value);

            const resetBtn = el("button", { textContent: "Reset All Data", className: "hp-btn hp-btn-danger", style: "margin-top:16px; opacity: 0.6" });
            resetBtn.onclick = () => {
                if (confirm("Permanently delete ALL bundles? This cannot be undone.")) {
                    GM_deleteValue(STORAGE_KEY); GM_deleteValue(COMBINED_KEY); GM_deleteValue(COLLAPSED_KEY);
                    render();
                }
            };
            container.append(resetBtn);
        };
        render();
    };

    const openCreateCombinedModal = () => {
        const data = loadData();
        const bundles = Object.keys(data).sort();
        if (!bundles.length) return alert("No bundles available.");

        const backdrop = el("div", { className: "hp-modal-backdrop" });
        const modal = el("div", { className: "hp-modal" });
        document.body.append(backdrop); backdrop.append(modal);

        modal.append(
            el("div", { style: "display:flex;justify-content:space-between;margin-bottom:20px" }, [
                el("div", { textContent: "Combine Bundles", style: "font-weight:700;font-size:18px" }),
                el("div", { html: "&times;", style: "cursor:pointer;font-size:24px;line-height:1", onclick: () => backdrop.remove() })
            ])
        );

        let order = [];
        const list = el("div", { style: "max-height:200px;overflow:auto;margin-bottom:16px;background:#27272a;border-radius:10px;padding:8px" });
        bundles.forEach(n => {
            const row = el("label", { style: "display:flex;align-items:center;gap:10px;padding:8px;cursor:pointer" });
            const cb = el("input", { type: "checkbox", style: "accent-color:#10b981" });
            cb.onchange = () => { if (cb.checked) order.push(n); else order = order.filter(x => x !== n); updatePreview(); };
            row.append(cb, el("span", { textContent: n, style: "font-size:14px" }));
            list.append(row);
        });

        const preview = el("div", { style: "padding:12px;background:#09090b;border-radius:8px;min-height:40px;margin-bottom:20px;font-size:12px;color:#71717a;word-break:break-all;border:1px dashed #3f3f46" });
        const updatePreview = () => { preview.textContent = [...new Set(order.flatMap(n => data[n] || []))].join(" ") || "Select bundles to see preview..."; };

        const createBtn = el("button", { textContent: "Save Combined Bundle", className: "hp-btn hp-btn-primary" });
        createBtn.onclick = () => {
            if (!order.length) return alert("Select at least one bundle.");
            const customName = prompt("Name for this combined bundle:");
            if (!customName) return;
            const ts = Date.now();
            const key = `Combined_${customName.replace(/[^\w]/g, '_')}_${ts}`;
            const combined = loadCombined();
            combined[key] = {
                label: customName, fullKey: key, sources: [...order],
                tags: [...new Set(order.flatMap(n => data[n] || []))]
            };
            saveCombined(combined); backdrop.remove();
        };

        modal.append(list, el("div", { textContent: "Preview", style: "font-size:11px;font-weight:700;margin-bottom:6px;text-transform:uppercase;color:#71717a" }), preview, createBtn);
        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    };

    const openCombinedPopup = () => {
        const combined = loadCombined();
        const keys = Object.keys(combined).sort();
        if (!keys.length) return alert("No combined bundles.");

        const backdrop = el("div", { className: "hp-modal-backdrop" });
        const popup = el("div", { className: "hp-modal", style: "width:500px;max-height:80vh;overflow-y:auto" });
        document.body.append(backdrop); backdrop.append(popup);

        popup.append(
            el("div", { style: "display:flex;justify-content:space-between;margin-bottom:20px" }, [
                el("div", { textContent: "Combined Bundles", style: "font-weight:700;font-size:18px" }),
                el("div", { html: "&times;", style: "cursor:pointer;font-size:24px;line-height:1", onclick: () => backdrop.remove() })
            ])
        );

        const grid = el("div", { style: "display: flex; flex-direction: column; gap: 12px;" });
        keys.forEach(key => {
            const combo = combined[key];
            const wrap = el("div", { className: "hp-card", style: "margin:0" });
            wrap.append(
                el("div", { textContent: combo.label, style: "font-weight:700;color:#10b981" }),
                el("div", { textContent: combo.tags.join(" "), style: "font-size:12px;color:#71717a;margin:4px 0 12px" }),
                el("div", { style: "display:flex;gap:8px" }, [
                    el("button", { className: "hp-btn hp-btn-primary", style: "margin:0;flex:1", textContent: "Insert", onclick: () => insertTextAtEnd(combo.tags.join(" ") + " ") }),
                    el("button", { className: "hp-btn hp-btn-danger", style: "margin:0;flex:none;width:40px", html: "&times;", onclick: () => { delete combined[key]; saveCombined(combined); wrap.remove(); } })
                ])
            );
            grid.append(wrap);
        });
        popup.append(grid);
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