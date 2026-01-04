// ==UserScript==
// @name         WME Permalink Issues Navigator
// @namespace    https://greasyfork.org/en/users/1457324-honkson
// @version      3.1
// @description  Paste WME permalinks/lists from clipboard → Navigate checker issues with one click: auto-center map, select segments, mark done/undo.
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/559503/WME%20Permalink%20Issues%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/559503/WME%20Permalink%20Issues%20Navigator.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    await new Promise(r => {
        const check = () =>
        (window.W?.userscripts?.registerSidebarTab &&
         W.map &&
         W.model &&
         W.selectionManager)
        ? r()
        : setTimeout(check, 100);
        check();
    });

    const { tabPane, tabLabel } = W.userscripts.registerSidebarTab('Permalinks');
    tabLabel.textContent = 'Permalinks';
    await W.userscripts.waitForElementConnected(tabPane);

    const css = document.createElement('style');
    css.textContent = `
#permalink-panel { background:#fff; padding:8px 10px; border:1px solid #e2e8f0;
  border-radius:10px; display:flex; flex-direction:column; gap:8px;
  font-family:system-ui,-apple-system,sans-serif; color:#334155; }
#permalink-panel h3 { margin:0 0 4px; font-size:14px; font-weight:600; }

.permalink-btn {
  border:1px solid #cbd5e1; border-radius:6px; padding:5px 8px;
  font-size:10px; background:#fff; cursor:pointer; width:100%;
}
.permalink-btn-paste { border-color:#3b82f6; background:#2563eb; color:#fff; }
.permalink-btn-clear { border-color:#ef4444; background:#ef4444; color:#fff; }

.permalink-table { width:100%; border-collapse:separate; border-spacing:0 4px; font-size:10px; }
.permalink-table tr { background:#f9fafb; border-radius:6px; }
.permalink-table tr.done { background:#ecfdf3; border-left:2px solid #10b981; }
.permalink-table td { padding:4px 6px; vertical-align:middle; }

.latlon { font-size:10px; color:#64748b; font-family:monospace; }
.segid { font-size:9px; color:#059669; font-family:monospace;
  background:#d1fae5; padding:1px 3px; border-radius:3px; margin-right:2px; }

.status-badge {
  padding:1px 4px; border-radius:999px; font-size:9px; font-weight:600;
  min-width:44px; text-align:center;
}
.status-pending { background:#fef3c7; color:#92400e; }
.status-done    { background:#dcfce7; color:#166534; }

.permalink-table button {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border:none;
  font-size:11px;
  padding:2px 4px;
  border-radius:4px;
  cursor:pointer;
  color:#fff;
  width:20px;
  height:18px;
}`;
    document.head.appendChild(css);

    const STORAGE = 'permalinkBookmarks';
    let bookmarks = JSON.parse(localStorage.getItem(STORAGE) || '[]');
    const save = () => localStorage.setItem(STORAGE, JSON.stringify(bookmarks));

    const panel = document.createElement('div');
    panel.id = 'permalink-panel';

    const title = document.createElement('h3');
    title.textContent = 'Permalink Issues';

    const pasteBtn = document.createElement('button');
    pasteBtn.textContent = '📋 Paste Permalinks';
    pasteBtn.className = 'permalink-btn permalink-btn-paste';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '🗑️ Clear All';
    clearBtn.className = 'permalink-btn permalink-btn-clear';

    const table = document.createElement('table');
    table.className = 'permalink-table';

    panel.append(title, pasteBtn, clearBtn, table);
    tabPane.append(panel);

    function render() {
        table.innerHTML = '';

        bookmarks.forEach((bm, i) => {
            const tr = document.createElement('tr');
            if (bm.done) tr.classList.add('done');

            const idx = document.createElement('td');
            idx.textContent = `${i + 1}.`;

            const coords = document.createElement('td');
            coords.innerHTML = `<span class="latlon">${bm.lat.toFixed(5)}, ${bm.lon.toFixed(5)}</span>`;

            const segs = document.createElement('td');
            segs.innerHTML = bm.segments?.length
                ? bm.segments.map(id => `<span class="segid">${id}</span>`).join('')
                : '-';

            const act = document.createElement('td');
            act.style.display = 'flex';
            act.style.justifyContent = 'flex-end';
            act.style.gap = '3px';

            const status = document.createElement('span');
            status.className = `status-badge ${bm.done ? 'status-done' : 'status-pending'}`;
            status.textContent = bm.done ? 'Done' : 'Pend';

            const goBtn = document.createElement('button');
            goBtn.textContent = '📍';
            goBtn.title = 'Go & Select Segments';
            goBtn.style.background = '#22c55e';

            const undoBtn = document.createElement('button');
            undoBtn.textContent = '↩️';
            undoBtn.title = 'Undo';
            undoBtn.style.background = '#f59e0b';
            undoBtn.disabled = !bm.done;
            undoBtn.style.opacity = bm.done ? '1' : '0.4';

            const delBtn = document.createElement('button');
            delBtn.textContent = '✖';
            delBtn.title = 'Delete';
            delBtn.style.background = '#ef4444';

            goBtn.onclick = () => {
                const ll = new OpenLayers.LonLat(bm.lon, bm.lat)
                .transform(
                    new OpenLayers.Projection('EPSG:4326'),
                    W.map.getProjectionObject()
                );

                const onMoveEnd = () => {
                    W.map.events.unregister('moveend', null, onMoveEnd);

                    setTimeout(() => {
                        const models = bm.segments
                        .map(id => W.model.segments.getObjectById(id))
                        .filter(Boolean);

                        if (models.length) {
                            W.selectionManager.setSelectedModels([]);
                            W.selectionManager.setSelectedModels(models);
                        } else {
                            console.warn('⚠️ No segments loaded yet');
                        }
                    }, 500);
                };

                W.map.events.register('moveend', null, onMoveEnd);
                W.map.setCenter(ll, 18);

                bookmarks[i].done = true;
                save();
                render();
            };

            undoBtn.onclick = () => {
                bookmarks[i].done = false;
                save();
                render();
            };

            delBtn.onclick = () => {
                bookmarks.splice(i, 1);
                save();
                render();
            };

            act.append(status, goBtn, undoBtn, delBtn);
            tr.append(idx, coords, segs, act);
            table.appendChild(tr);
        });
    }

    pasteBtn.onclick = async () => {
        try {
            const txt = await navigator.clipboard.readText();

            // Try JSON first (backward compatibility)
            try {
                const data = JSON.parse(txt);
                if (Array.isArray(data)) {
                    let added = 0;
                    data.forEach(item => {
                        if (typeof item.lat === 'number' && typeof item.lon === 'number') {
                            bookmarks.push({
                                lat: item.lat,
                                lon: item.lon,
                                segments: item.url ? parseSegments(item.url) : [],
                                done: false
                            });
                            added++;
                        }
                    });
                    save();
                    render();
                    alert(`${added} JSON issues added`);
                    return;
                }
            } catch {}

            // Handle permalink lists
            const urls = txt.match(/https:\/\/(?:beta\.|www\.)?waze\.com\/(?:[^\/\s]+\/)?editor[^\s\n]+/gi) || [];
            if (!urls.length) throw 0;

            let added = 0;
            urls.forEach(url => {
                const params = parsePermalink(url);
                if (params.lat !== undefined && params.lon !== undefined) {
                    bookmarks.push({
                        lat: params.lat,
                        lon: params.lon,
                        segments: params.segments || [],
                        done: false
                    });
                    added++;
                }
            });

            save();
            render();
            alert(`${added} permalinks added`);
        } catch {
            alert('Paste WME permalinks (one per line) or JSON array');
        }
    };

    clearBtn.onclick = () => {
        if (bookmarks.length && confirm('Clear all issues?')) {
            bookmarks = [];
            save();
            render();
        }
    };

    function parsePermalink(urlStr) {
        try {
            const u = new URL(urlStr);
            return {
                lat: parseFloat(u.searchParams.get('lat')),
                lon: parseFloat(u.searchParams.get('lon')),
                segments: parseSegments(urlStr)
            };
        } catch {
            return {};
        }
    }

    function parseSegments(urlStr) {
        try {
            const u = new URL(urlStr);
            const s = u.searchParams.get('segments');
            return s
                ? s.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n))
                : [];
        } catch {
            return [];
        }
    }

    render();
})();
