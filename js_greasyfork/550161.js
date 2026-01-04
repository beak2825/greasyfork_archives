// ==UserScript==
// @name         Infinite Craft Manager (Export + Merge)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Export and merge Infinite Craft saves
// @author       BreadAndEggs
// @match        *://neal.fun/infinite-craft/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550161/Infinite%20Craft%20Manager%20%28Export%20%2B%20Merge%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550161/Infinite%20Craft%20Manager%20%28Export%20%2B%20Merge%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GUI ---
    const container = document.createElement("div");
    container.id = "icdb-window";
    container.innerHTML = `
        <div id="icdb-header">Infinite Craft DB Manager</div>
        <div id="icdb-body">
            <button id="icdb-export">📤 Export Save</button>
            <button id="icdb-merge">🔀 Merge Save</button>
            <pre id="icdb-log" style="margin-top:8px; max-height:120px; overflow:auto;"></pre>
        </div>
    `;
    document.body.appendChild(container);

    GM_addStyle(`
        #icdb-window {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 320px;
            height: 240px;
            background: #1e1e1e;
            color: #fff;
            border: 2px solid #444;
            border-radius: 6px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            resize: both;
            overflow: auto;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        #icdb-header {
            background: #333;
            padding: 6px;
            cursor: move;
            font-weight: bold;
            user-select: none;
            border-bottom: 1px solid #444;
        }
        #icdb-body {
            flex: 1;
            padding: 8px;
        }
        #icdb-body button {
            padding: 6px 10px;
            margin-bottom: 4px;
            cursor: pointer;
        }
    `);

    // --- Draggable ---
    (function makeDraggable() {
        const header = container.querySelector("#icdb-header");
        let offsetX = 0, offsetY = 0, dragging = false;

        header.addEventListener("mousedown", e => {
            dragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        function onMouseMove(e) {
            if (!dragging) return;
            container.style.left = (e.clientX - offsetX) + "px";
            container.style.top = (e.clientY - offsetY) + "px";
        }

        function onMouseUp() {
            dragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
    })();

    // --- Logger ---
    function log(msg) {
        const logEl = document.getElementById("icdb-log");
        logEl.textContent += msg + "\n";
        logEl.scrollTop = logEl.scrollHeight;
    }

    // --- IndexedDB helpers ---
    async function openDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open("infinite-craft");
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }

    async function getItems(db) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction("items", "readonly");
            const store = tx.objectStore("items");
            const result = [];
            const cursorReq = store.openCursor();
            cursorReq.onsuccess = e => {
                const cursor = e.target.result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(result);
                }
            };
            cursorReq.onerror = () => reject(cursorReq.error);
        });
    }

    async function putItem(db, item) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction("items", "readwrite");
            const store = tx.objectStore("items");
            const req = store.put(item);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    // --- Export ---
    async function exportSave() {
        log("Exporting...");
        const db = await openDB();
        const items = await getItems(db);
        log(`Got ${items.length} items.`);

        const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ic_save.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        log("Export complete!");
    }

    // --- Merge ---
    async function mergeSave(addition) {
        log("Merging...");
        const db = await openDB();
        const current = await getItems(db);

        const usedIds = new Set(current.map(x => x.id));
        const textToId = new Map(current.map(x => [x.text, x.id]));

        // Step 1: prepare temporary addition copy
        const temp = addition.map(obj => ({ ...obj }));

        // Step 2: assign "new" and "newid"
        for (const item of temp) {
            if ([0,1,2,3].includes(item.id)) {
                item.new = false;
                item.newid = item.id;
                continue;
            }
            if (textToId.has(item.text)) {
                item.new = false;
                item.newid = textToId.get(item.text);
            } else {
                item.new = true;
                let newId = 4;
                while (usedIds.has(newId) || temp.some(x => x.newid === newId)) {
                    newId++;
                }
                item.newid = newId;
                usedIds.add(newId);
            }
        }

        // Step 3: remap recipes inside temp
        for (const item of temp) {
            if (!item.recipes) continue;
            item.recipes = item.recipes.map(r =>
                r.map(oldId => {
                    const ref = temp.find(x => x.id === oldId);
                    return ref ? ref.newid : oldId;
                })
            );
        }

        // Step 4: apply to current
        for (const item of temp) {
            if ([0,1,2,3].includes(item.id)) continue; // skip mains
            if (item.new) {
                const copy = { ...item };
                delete copy.new;
                delete copy.newid;
                copy.id = item.newid;
                await putItem(db, copy);
            } else {
                const existing = current.find(x => x.id === item.newid);
                if (item.recipes) {
                    existing.recipes = existing.recipes || [];
                    for (const r of item.recipes) {
                        if (!existing.recipes.some(rr => JSON.stringify(rr) === JSON.stringify(r))) {
                            existing.recipes.push(r);
                        }
                    }
                    await putItem(db, existing);
                }
            }
        }

        log("Merge complete!");
    }

    // --- File loader for merge ---
    function loadFileForMerge() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = async e => {
            const file = e.target.files[0];
            if (!file) return;
            log(`Loading ${file.name}...`);
            const text = await file.text();
            const data = JSON.parse(text);
            await mergeSave(data);
        };
        input.click();
    }

    // --- Hook buttons ---
    document.getElementById("icdb-export").addEventListener("click", exportSave);
    document.getElementById("icdb-merge").addEventListener("click", loadFileForMerge);
})();
