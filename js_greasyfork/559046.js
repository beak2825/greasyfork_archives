// ==UserScript==
// @name         CRG Generate List
// @namespace    http://lamansion-crg.net
// @version      0.0.5
// @description  Generate a popup list of current subforum topics
// @author       Pinocchio
// @match        *://*lamansion-crg.net/forum/index.php?showforum=*
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/winbox@0.2.82/dist/winbox.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559046/CRG%20Generate%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/559046/CRG%20Generate%20List.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Global variables for singleton window instances
    let mergePanelInstance = null;
    let csvConfigInstance = null;

    // Shared utilities - define if not already available
    const CRG_Utils = {
        parseData: function(val) {
            if (!val) return {status: 0, rating: 0, comment: ''};
            const parts = val.split(':');
            const status = Math.max(0, Math.min(4, parts[0] ? +parts[0] : 0));
            const rating = Math.round(Math.max(0, Math.min(5, parts[1] ? +parts[1] : 0)) * 2) / 2;
            const encodedComment = parts.slice(2).join(':');
            const comment = encodedComment ? this.decodeComment(encodedComment) : '';
            return {status, rating, comment};
        },
        encodeComment: function(c) {
            if (!c) return '';
            return btoa(unescape(encodeURIComponent(c)));
        },
        decodeComment: function(c) {
            if (!c) return '';
            try {
                return decodeURIComponent(escape(atob(c)));
            } catch (e) {
                return c;
            }
        },
        extractTags: function(comment) {
            return comment.match(/#[^\s#]+/g) || [];
        },
        normalize: function(status, rating, comment = '') {
            const c = this.encodeComment(comment.trim());
            if (status === 0 && rating === 0 && !c) return '0:0';
            return `${status}:${rating}:${c}`;
        }
    };
    // CRG_Utils is defined in both scripts to ensure availability
    // regardless of load order or if only one script is installed.
    // The guard prevents overwriting when both are present.
    if (!window.CRG_Utils) window.CRG_Utils = CRG_Utils;

    // ===== CONSTANTS =====
    const ALLOWED_FORUM_IDS = ['76', '81'];
    const EXCLUDED_FORUM_IDS = ['76', '72', '5', '71', '81', '34', '37'];
    const TOPICS_PER_PAGE = 30;
    const MONTH_MAP = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
        January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
        July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
    };

    // CSV Export constants
    const CSV_CONFIG_KEY = 'CRG_GList_CSV_Config_v1';
    const DEFAULT_CSV_COLUMNS = [
        { key: 'id', label: 'ID', enabled: true },
        { key: 'title', label: 'Título', enabled: true },
        { key: 'subtitle', label: 'Subtítulo', enabled: true },
        { key: 'author', label: 'Autor', enabled: true },
        { key: 'date', label: 'Creado', enabled: true },
        { key: 'lastActionDate', label: 'Modificado', enabled: true },
        { key: 'subforo', label: 'Subforo', enabled: true },
        { key: 'url', label: 'URL', enabled: true },
        { key: 'status', label: 'Marcador', enabled: true },
        { key: 'rating', label: 'Valoración', enabled: false }
    ];

    // ===== CACHING SYSTEM =====
    const CACHE_KEY = 'CRG_CacheData';
    const FILTER_HISTORY_KEY = 'CRG_FilterHistory';

    // ===== INDEXEDDB SETUP =====
    const subforumsDB = localforage.createInstance({
      name: "CRG_Comicteca_DB",
      storeName: "subforums"
    });
    const topicsDB = localforage.createInstance({
      name: "CRG_Comicteca_DB",
      storeName: "topics"
    });

    // ===== STORAGE ABSTRACTION =====
    /**
     * Unified storage abstraction for GM functions and localStorage
     */
    const Storage = {
        get: (key, defaultValue) => {
            if (typeof GM_getValue === 'function') {
                return GM_getValue(key, defaultValue);
            } else {
                const stored = localStorage.getItem(key);
                return stored !== null ? JSON.parse(stored) : defaultValue;
            }
        },
        set: (key, value) => {
            if (typeof GM_setValue === 'function') {
                GM_setValue(key, value);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        },
        delete: (key) => {
            if (typeof GM_deleteValue === 'function') {
                GM_deleteValue(key);
            } else {
                localStorage.removeItem(key);
            }
        }
    };

    const loadFromCache = async () => {
        try {
            const subforumId = location.href.match(/showforum=(\d+)/)?.[1];
            if (!subforumId) return null;

            // Always try IndexedDB first – no TTL check anymore
            const subforumData = await subforumsDB.getItem(subforumId);
            if (subforumData) {
                // Load all topics belonging to this subforum
                const topics = [];
                await topicsDB.iterate((topic, topicId) => {
                    if (topic.subforumId === subforumId) {
                        topics.push(topic);
                    }
                });
                return topics.length > 0 ? topics : null;
            }

            return null; // No cache found
        } catch (e) {
            console.warn('[CRG] IndexedDB load error:', e);
            return null;
        }
    };

    /**
     * Gets CSV column configuration from storage
     * @returns {Object[]} - Array of column objects
     */
    const getCsvColumns = () => {
        try {
            const columns = Storage.get(CSV_CONFIG_KEY, DEFAULT_CSV_COLUMNS.map(c => ({ ...c })));
            return Array.isArray(columns) ? columns : DEFAULT_CSV_COLUMNS.map(c => ({ ...c }));
        } catch (e) {
            console.warn('[CRG] CSV config load error:', e);
            return DEFAULT_CSV_COLUMNS.map(c => ({ ...c }));
        }
    };

    /**
     * Saves CSV column configuration to storage
     * @param {Object[]} columns - Array of column objects
     */
    const saveCsvColumns = (columns) => {
        try {
            Storage.set(CSV_CONFIG_KEY, columns);
        } catch (e) {
            console.warn('[CRG] CSV config save error:', e);
        }
    };

    /**
     * Generates and downloads CSV file from topics data
     * @param {Object[]} topics - Array of topic objects
     * @param {string} filename - The filename for download
     */
    const generateCsv = (topics, filename) => {
        const columns = getCsvColumns();
        const activeCols = columns.filter(c => c.enabled);

        if (activeCols.length === 0) {
            showTooltip('No hay columnas seleccionadas para exportar');
            return;
        }

        const header = activeCols.map(c => c.label).join(',');
        const rows = topics.map(t => {
            return activeCols.map(col => {
                let val = t[col.key] || '';
                // Handle date objects
                if (col.key === 'date' || col.key === 'lastActionDate') {
                    if (val && typeof val === 'object' && val.display) {
                        val = val.display;
                    }
                }
                // Escape quotes and wrap in quotes
                return `"${val.toString().replace(/"/g, '""')}"`;
            }).join(',');
        });

        const csvContent = '\ufeff' + [header, ...rows].join('\r\n');

        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    /**
     * Shows the CSV column configuration panel
     */
    const showCsvConfigPanel = () => {
        // Check if already open
        if (csvConfigInstance) {
            csvConfigInstance.focus();
            return;
        }

        let csvColumns = getCsvColumns();

        // Create content div for WinBox mounting
        const content = document.createElement('div');
        content.style.cssText = 'width: 100%; height: 100%; display: flex; flex-direction: column; color: #000;';

        content.innerHTML = `
            <div style="padding: 16px;">
                <div style="margin-bottom: 10px; font-size: 13px;">
                    Arrastra las filas para cambiar el orden · Haz clic en la casilla para activar/desactivar
                </div>
                <div id="crg-csv-columns-list" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 8px; background: #f9f9f9;"></div>
                <div style="text-align: right; margin-top: 12px;">
                    <button id="crg-csv-save" style="padding: 8px 16px; background: #0066cc; color: white; border: none; cursor: pointer;">Guardar</button>
                    <button id="crg-csv-cancel" style="padding: 8px 16px; background: #cc0000; color: white; border: none; cursor: pointer; margin-left: 4px;">Cancelar</button>
                </div>
            </div>
        `;

        // Create WinBox window
        const win = new WinBox({
            title: "Configuración de las columnas CSV",
            width: "420px",
            height: "500px",
            x: "center",
            y: "center",
            mount: content,
            class: "no-shadow",
            index: 9999,
            background: "#343a40",
            onclose: () => {
                csvConfigInstance = null;
            }
        });

        // Store instance
        csvConfigInstance = win;

        const list = content.querySelector('#crg-csv-columns-list');

        const render = () => {
            list.innerHTML = '';
            csvColumns.forEach((col, idx) => {
                const row = document.createElement('div');
                row.draggable = true;
                row.style.cssText = `display:flex;align-items:center;padding:8px;margin:4px 0;border:1px solid #ddd;border-radius:4px;cursor:move;user-select:none;background:#fff;`;
                row.innerHTML = `
                    <input type="checkbox" ${col.enabled ? 'checked' : ''} style="margin-right:10px;transform:scale(1.2);cursor:pointer;">
                    <span style="font-weight:bold;margin-right:10px;">${idx + 1}.</span>
                    <span style="flex:1;">${col.label}</span>
                `;
                row.querySelector('input').onclick = (e) => {
                    e.stopPropagation();
                    csvColumns[idx].enabled = !csvColumns[idx].enabled;
                    render();
                };

                row.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', idx);
                    row.style.opacity = '0.5';
                });
                row.addEventListener('dragover', e => e.preventDefault());
                row.addEventListener('dragend', () => row.style.opacity = '1');
                row.addEventListener('drop', e => {
                    e.preventDefault();
                    const from = +e.dataTransfer.getData('text/plain');
                    const to = idx;
                    if (from === to) return;
                    const [moved] = csvColumns.splice(from, 1);
                    csvColumns.splice(to, 0, moved);
                    render();
                });

                list.appendChild(row);
            });
        };

        content.querySelector('#crg-csv-save').onclick = () => {
            saveCsvColumns(csvColumns);
            win.close();
            showTooltip('Configuración guardada');
        };

        content.querySelector('#crg-csv-cancel').onclick = () => win.close();

        render();
    };

    /**
     * Selectively saves only new and updated topics to IndexedDB
     * @param {string} forumId
     * @param {string} forumName
     * @param {Object[]} newTopics
     * @param {Object[]} updatedTopics
     * @param {number} previousTopicCount - Total count before this update
     */
    const saveChangedTopicsSelectively = async (forumId, forumName, newTopics = [], updatedTopics = [], previousTopicCount = 0) => {
        try {
            // Update subforum metadata
            const subforum = await subforumsDB.getItem(forumId) || {
                id: forumId,
                name: forumName,
                topicCount: previousTopicCount,
                lastCached: 0
            };

            subforum.topicCount = previousTopicCount + newTopics.length;
            subforum.lastCached = Date.now();
            await subforumsDB.setItem(forumId, subforum);

            // Save only new topics
            for (const topic of newTopics) {
                const topicId = topic.url.match(/showtopic=(\d+)/)?.[1];
                if (topicId) {
                    topic.id = topicId;
                    topic.subforumId = forumId;
                    await topicsDB.setItem(topicId, topic);
                }
            }

            // Save only updated topics
            for (const topic of updatedTopics) {
                const topicId = topic.url.match(/showtopic=(\d+)/)?.[1];
                if (topicId) {
                    topic.id = topicId;
                    topic.subforumId = forumId;
                    await topicsDB.setItem(topicId, topic);
                }
            }

            console.log(`[CRG] Selectively saved: ${newTopics.length} new, ${updatedTopics.length} updated topics for forum ${forumId}`);
        } catch (e) {
            console.warn('[CRG] Selective save error:', e);
        }
    };

    /**
     * Saves topics to cache (full save for initial caching and force refresh)
     * @param {Array} topics
     */
    const saveToCache = async (topics) => {
        try {
            const subforumId = location.href.match(/showforum=(\d+)/)?.[1];
            if (!subforumId) return;

            // Extract breadcrumb paths
            const navLinks = document.querySelectorAll('#navstrip a');
            const pathNames = Array.from(navLinks).slice(1).map(a => a.textContent.trim());
            const pathIds = Array.from(navLinks).slice(1).map(a => a.href.match(/showforum=(\d+)/)?.[1]).filter(Boolean);

            const rootId = pathIds[0];
            const leafId = subforumId;

            // Save metadata for ENTIRE hierarchy path
            for (let i = 0; i < pathIds.length; i++) {
                const id = pathIds[i];
                const isCurrent = (id === subforumId);

                // Get existing data to merge
                const existing = await subforumsDB.getItem(id);

                const subforumData = {
                    id: id,
                    name: pathNames[i],
                    parentId: pathIds[i - 1] || null,
                    rootId: rootId,
                    pathIds: pathIds.slice(0, i + 1),
                    pathNames: pathNames.slice(0, i + 1),
                    topicCount: isCurrent ? topics.length : (existing?.topicCount || 0),
                    hasChildren: existing?.hasChildren || false,
                    lastCached: Date.now()
                };

                await subforumsDB.setItem(id, subforumData);
                // console.log(`[CRG] Saved subforum metadata: ${id} (${pathNames[i]})`);
            }

            // Update parent hasChildren flag
            if (pathIds.length > 1) {
                const parentId = pathIds[pathIds.length - 2];
                const parent = await subforumsDB.getItem(parentId);
                if (parent && !parent.hasChildren) {
                    parent.hasChildren = true;
                    await subforumsDB.setItem(parentId, parent);
                    // console.log(`[CRG] Updated parent ${parentId} hasChildren = true`);
                }
            }

            // Save topics with subforum reference
            for (const topic of topics) {
                const topicId = topic.url.match(/showtopic=(\d+)/)?.[1];
                if (topicId) {
                    topic.id = topicId;
                    topic.subforumId = leafId;
                    topic.rootId = rootId;
                    topic.pathIds = pathIds;
                    topic.pathNames = pathNames;
                    await topicsDB.setItem(topicId, topic);
                }
            }

            console.log(`[CRG] Saved ${topics.length} topics for subforum ${leafId}`);
        } catch (e) {
            console.warn('[CRG] Cache save error:', e);
        }
    };

    /**
     * Clears ALL cached lists (for the menu command)
     */
    const clearAllCache = async () => {
        try {
            // Clear IndexedDB stores
            await subforumsDB.clear();
            await topicsDB.clear();
            // Also clear old GM storage as fallback
            Storage.delete(CACHE_KEY);
            showTooltip('Caché eliminado');
        } catch (e) {
            console.warn('[CRG] Cache clear error:', e);
            showTooltip('Error al eliminar caché');
        }
    };

    /**
     * Gets filter history from storage
     * @returns {string[]} - Array of recent filter strings
     */
    const getFilterHistory = () => {
        try {
            const history = Storage.get(FILTER_HISTORY_KEY, []);
            return Array.isArray(history) ? history : [];
        } catch (e) {
            console.warn('[CRG] Filter history load error:', e);
            return [];
        }
    };

    /**
     * Saves filter to history (deduplicates and limits to 10)
     * @param {string} filter - The filter string to save
     */
    const saveFilterToHistory = (filter) => {
        if (!filter.trim()) return;

        try {
            const history = getFilterHistory();

            // Remove if already exists (to move to front)
            const existingIndex = history.indexOf(filter);
            if (existingIndex > -1) {
                history.splice(existingIndex, 1);
            }

            // Add to front
            history.unshift(filter);

            // Limit to 10
            if (history.length > 10) {
                history.splice(10);
            }

            // Save
            Storage.set(FILTER_HISTORY_KEY, history);
        } catch (e) {
            console.warn('[CRG] Filter history save error:', e);
        }
    };

    // ===== UTILITY FUNCTIONS =====

    /**
     * Gets the list of page URLs to scrape based on pagination links for a specific forum
     * @param {string} forumUrl - The forum URL to scrape
     * @returns {string[]} - Array of page URLs
     */
    const getPageUrlsForForum = async (forumUrl) => {
        try {
            const doc = await fetchPageDocument(forumUrl);
            if (!doc) return [];

            let maxSt = 0;
            doc.querySelectorAll('a[href*="&st="]').forEach(a => {
                const m = a.href.match(/&st=(\d+)/);
                if (m) maxSt = Math.max(maxSt, +m[1]);
            });

            // Include current page's st value
            const currentStMatch = forumUrl.match(/&st=(\d+)/);
            if (currentStMatch) {
                maxSt = Math.max(maxSt, +currentStMatch[1]);
            }

            const pages = [];
            for (let st = 0; st <= maxSt; st += TOPICS_PER_PAGE) {
                pages.push(`${forumUrl.split('&st=')[0]}&st=${st}`);
            }
            return pages;
        } catch (e) {
            console.warn('[CRG] Error getting page URLs for forum:', e);
            return [];
        }
    };

    /**
     * Gets page URLs for incremental updates, sorted by last modification
     * @param {string} forumId - The forum ID
     * @param {number} lastCacheTime - Timestamp of last cache update (unused for now, but can be added later)
     * @returns {Object} - Object with pageUrls array and stopCondition flag
     */
    const getIncrementalPageUrlsForForum = async (forumId, lastCacheTime) => {
        // Use showforum URLs to match browser pagination (same as main scraper)
        const baseUrl = `http://lamansion-crg.net/forum/index.php?showforum=${forumId}&sort_by=Z-A&sort_key=last_post&topicfilter=all&prune_day=100`;

        try {
            const doc = await fetchPageDocument(baseUrl + '&st=0');
            if (!doc) return { pageUrls: [], stopCondition: true };

            let maxSt = 0;
            doc.querySelectorAll('a[href*="&st="]').forEach(a => {
                const m = a.href.match(/&st=(\d+)/);
                if (m) maxSt = Math.max(maxSt, +m[1]);
            });

            // Limit to reasonable pages (recent activity usually in first few)
            const maxPagesToCheck = Math.min(20, Math.ceil((maxSt + TOPICS_PER_PAGE) / TOPICS_PER_PAGE));

            const pageUrls = [];
            for (let page = 0; page < maxPagesToCheck; page++) {
                const st = page * TOPICS_PER_PAGE;
                pageUrls.push(`${baseUrl}&st=${st}`);
            }

            return {
                pageUrls,
                stopCondition: false
            };
        } catch (e) {
            console.warn('[CRG] Error getting incremental page URLs for forum:', forumId, e);
            return { pageUrls: [], stopCondition: true };
        }
    };

    /**
     * Parses topic data from a forum page document for batch updating
     * @param {Document} doc - The parsed HTML document
     * @param {string} forumName - The forum name
     * @returns {Object[]} - Array of topic objects
     */
    const parseTopicsFromDocumentForForum = (doc, forumName) => {
        const navElements = [...doc.querySelectorAll('#navstrip a')];
        const isCompletos = navElements[1]?.href.match(/showforum=(\d+)/)?.[1] === ALLOWED_FORUM_IDS[1];
        const prefix = 'comicteca' + (isCompletos ? '_completos' : '') + '_';

        const links = doc.querySelectorAll('a[id^="tid-link-"]');

        const topics = [];

        links.forEach(link => {
            const row = link.closest('tr');
            if (!row) {
                console.warn(`[CRG] No tr for link ${link.href}`);
                return;
            }
            if (row.querySelector('img[src*="f_pinned"]')) {
                return; // Skip pinned topics
            }

            const id = link.href.match(/showtopic=(\d+)/)?.[1];
            if (!id) {
                console.warn(`[CRG] No topic ID for link ${link.href}`);
                return;
            }

            const rawTitle = link.textContent || '';
            const rawSubtitle = row.querySelector('.desc span')?.textContent || '';
            const authorCell = row.cells[4];
            const rawAuthor = authorCell?.querySelector('a')?.textContent || '';
            const rawDate = authorCell?.querySelector('span[style*="color:#666"], span')?.textContent || '';

            // Extract last action date from "Última acción" column
            const lastActionCell = row.cells[6];
            const rawLastActionDate = lastActionCell?.querySelector('.lastaction')?.textContent?.split('<br>')[0]?.trim() || '';

            // Process and clean data
            const title = cleanText(rawTitle);
            const subtitle = cleanText(rawSubtitle);
            const author = rawAuthor;
            const date = parseDate(rawDate.trim());
            const lastActionDate = parseDate(rawLastActionDate.trim());

            topics.push({
                title,
                subtitle,
                author,
                date,
                lastActionDate,
                url: link.href,
                subforo: prefix + forumName
            });
        });

        return topics;
    };

    /**
     * Saves topics to cache for a specific forum (batch update)
     * @param {string} forumId - The forum ID
     * @param {string} forumName - The forum name
     * @param {Array} topics - Array of topic objects
     */
    const saveTopicsToCache = async (forumId, forumName, topics) => {
        try {
            // Save subforum metadata
            await subforumsDB.setItem(forumId, {
                id: forumId,
                name: forumName,
                parentId: null, // We don't have full path info for batch updates
                rootId: ALLOWED_FORUM_IDS.includes(forumId) ? forumId : ALLOWED_FORUM_IDS[0],
                pathIds: [ALLOWED_FORUM_IDS[0], forumId],
                pathNames: ['La mansión del CRG', forumName],
                topicCount: topics.length,
                lastCached: Date.now()
            });

            // Save topics with subforum reference
            for (const topic of topics) {
                const topicId = topic.url.match(/showtopic=(\d+)/)?.[1];
                if (topicId) {
                    topic.id = topicId;
                    topic.subforumId = forumId;
                    topic.rootId = ALLOWED_FORUM_IDS.includes(forumId) ? forumId : ALLOWED_FORUM_IDS[0];
                    topic.pathIds = [ALLOWED_FORUM_IDS[0], forumId];
                    topic.pathNames = ['La mansión del CRG', forumName];
                    await topicsDB.setItem(topicId, topic);
                }
            }

            console.log(`[CRG] Batch saved ${topics.length} topics for forum ${forumId}`);
        } catch (e) {
            console.warn('[CRG] Batch cache save error:', e);
        }
    };

    /**
     * Refreshes the cached subforums list and returns the updated array
     * @returns {Array} Updated cached subforums array
     */
    const refreshCachedSubforumsList = async () => {
        // Re-fetch the cached subforums list
        const subforumIds = await subforumsDB.keys();
        const refreshedSubforums = [];

        for (const subforumId of subforumIds) {
            const subforum = await subforumsDB.getItem(subforumId);
            if (subforum && subforum.topicCount > 0) {
                refreshedSubforums.push({
                    id: subforumId,
                    name: subforum.name || `Forum ${subforumId}`,
                    count: subforum.topicCount,
                    date: (() => {
                        const d = new Date(subforum.lastCached);
                        const year = d.getFullYear();
                        const month = (d.getMonth() + 1).toString().padStart(2, '0');
                        const day = d.getDate().toString().padStart(2, '0');
                        const hours = d.getHours().toString().padStart(2, '0');
                        const minutes = d.getMinutes().toString().padStart(2, '0');
                        return `${year}/${month}/${day} ${hours}:${minutes}`;
                    })(),
                    lastCached: subforum.lastCached, // Include timestamp for incremental logic
                    topics: [] // We'll load topics only when selected
                });
            }
        }

        return refreshedSubforums;
    };

    /**
     * Enriches topics array with marker data (status, rating, comment, tags)
     * @param {Object[]} topics - Array of topic objects
     * @param {Object} markersData - Markers data object
     * @param {boolean} setDefaults - Whether to set default values when no marker data exists
     */
    const enrichTopicsWithMarkers = (topics, markersData, setDefaults = false) => {
        topics.forEach(topic => {
            const id = topic.url.match(/showtopic=(\d+)/)?.[1];
            if (id && markersData[id]) {
                const data = window.CRG_Utils.parseData(markersData[id]);
                topic.status = data.status;
                topic.rating = data.rating;
                topic.comment = data.comment;
                topic.tags = window.CRG_Utils.extractTags(data.comment);
            } else if (setDefaults) {
                topic.status = 0;
                topic.rating = 0;
                topic.comment = '';
                topic.tags = [];
            }
        });
    };

    /**
     * Normalizes text by removing diacritics (accents, etc.) for accent-insensitive filtering
     * @param {string} str - The string to normalize
     * @returns {string} - The normalized string with diacritics removed
     */
    const normalizeText = (str) => {
        return str.normalize('NFKD').replace(/\p{Mark}/gu, '').toLowerCase();
    };
    /**
     * Shows a temporary tooltip with the given message
     * @param {string} message - The message to display
     * @param {boolean} persistent - Whether the tooltip should remain visible indefinitely (default: false)
     */
    const showTooltip = (message, persistent = false) => {
        // Remove any existing tooltip to prevent stacking
        const existing = document.getElementById('crg-tooltip');
        if (existing) existing.remove();

        const tooltip = document.createElement('div');
        tooltip.id = 'crg-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = "position:fixed;top:10px;right:10px;background:#343a40;color:#fff;padding:8px 16px;border-radius:4px;font-size:14px;z-index:10000;";
        document.body.appendChild(tooltip);

        if (!persistent) {
            setTimeout(() => {
                const t = document.getElementById('crg-tooltip');
                if (t) t.remove();
            }, 5000);
        }
    };

    /**
     * Cleans text by removing emojis and normalizing whitespace
     * @param {string} str - The string to clean
     * @returns {string} - The cleaned string
     */
    const cleanText = (str = '') => {
        return str
            .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{203C}\u{2049}\u{2757}✨⭐♥❤❗]/gu, '') // emojis + estrella
            .replace(/[\u00A0]/g, ' ') // espacio duro → espacio normal
            .replace(/[\r\n\t]+/g, ' ')
            .trim();
    };

    /**
     * Parses date string into date object with multiple formats
     * @param {string} dateRaw - Raw date string
     * @returns {Object} - Date object with display, unix, and iso properties
     */
    const parseDate = (dateRaw) => {
        let dateObj = new Date();
        let hasTime = false;

        // Handle relative Spanish dates for recent posts
        if (dateRaw.startsWith('Hoy,')) {
            // "Hoy, 10:31" → today's date with time
            const timeMatch = dateRaw.match(/Hoy, (\d{1,2}):(\d{2})/);
            if (timeMatch) {
                const [, hours, minutes] = timeMatch;
                dateObj = new Date();
                dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                hasTime = true;
            }
        } else if (dateRaw.startsWith('Ayer,')) {
            // "Ayer, 18:29" → yesterday's date with time
            const timeMatch = dateRaw.match(/Ayer, (\d{1,2}):(\d{2})/);
            if (timeMatch) {
                const [, hours, minutes] = timeMatch;
                dateObj = new Date();
                dateObj.setDate(dateObj.getDate() - 1);
                dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                hasTime = true;
            }
        } else {
            // Handle "17th December 2020 - 20:04" format (with ordinal and optional time)
            const fullDateMatch = dateRaw.match(/(\d{1,2})(?:st|nd|rd|th)? (\w+) (\d{4})(?: - (\d{1,2}):(\d{2}))?/);
            if (fullDateMatch) {
                const [, day, monthName, year, hours, minutes] = fullDateMatch;
                const month = MONTH_MAP[monthName];
                if (month) {
                    dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
                    if (hours && minutes) {
                        dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                        hasTime = true;
                    }
                }
            } else {
                // Fallback to original format "Oct 11 2020, 17:50" or "11 Oct 2020"
                const dateMatch = dateRaw.match(/(\w{3}) (\d{1,2}) (\d{4})(?:, (\d{1,2}):(\d{2}))?/) ||
                                  dateRaw.match(/(\d{1,2}) (\w{3}) (\d{4})(?:,? (\d{1,2}):(\d{2}))?/);
                if (dateMatch) {
                    const [, part1, part2, year, hours, minutes] = dateMatch;
                    const m = part1 in MONTH_MAP ? part1 : (part2 in MONTH_MAP ? part2 : null);
                    const d = part1 in MONTH_MAP ? part2 : part1;
                    const month = MONTH_MAP[m];
                    if (month) {
                        dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(d, 10));
                        if (hours && minutes) {
                            dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                            hasTime = true;
                        }
                    }
                } else {
                    // If no match, return current date as fallback
                    dateObj = new Date();
                }
            }
        }

        // Format display as YYYY/MM/DD HH:MM
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const display = hasTime ? `${year}/${month}/${day} ${hours}:${minutes}` : `${year}/${month}/${day} 00:00`;

        // Return object with all formats
        return {
            display: display,
            unix: dateObj.getTime(),
            iso: dateObj.toISOString()
        };
    };



    // ===== MAIN INITIALIZATION =====

    // Check if we're in a valid forum
    const navigationElements = [...document.querySelectorAll('#navstrip a')];
    if (navigationElements.length < 1) {
        return;
    }
    const forumId = navigationElements[1]?.href.match(/showforum=(\d+)/)?.[1];
    if (!ALLOWED_FORUM_IDS.includes(forumId)) {
        return;
    }

    // Check if current forum should be excluded from showing the button
    const currentForumId = location.href.match(/showforum=(\d+)/)?.[1];
    if (!EXCLUDED_FORUM_IDS.includes(currentForumId)) {
        // Add smart Generate List button with optional dropdown
        const navstrip = document.getElementById('navstrip');
    if (navstrip) {
        const container = document.createElement('div');
        container.style.cssText = 'display:inline;margin-left:10px;';

        // Generate List button
        const button = document.createElement('button');
        button.style.cssText = 'padding:4px 8px;background:#343a40;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;';

        // Will be populated dynamically on page load and after caching
        const updateButton = async () => {
            const cachedTopics = await loadFromCache();
            if (cachedTopics) {
                // Create wrapper with separate button and arrow
                const wrapper = document.createElement('div');
                wrapper.className = 'crg-list-button-wrapper';
                wrapper.style.cssText = 'display: inline-block;';

                // Main button
                button.textContent = 'Lista (cache)';
                button.onclick = () => generateList(false);
                button.style.borderRadius = '4px';
                button.style.position = 'relative';
                button.style.display = 'inline-block';

                // Separate arrow element
                const arrowSpan = document.createElement('span');
                arrowSpan.id = 'crg-main-dropdown-arrow';
                arrowSpan.textContent = '▼';
                arrowSpan.style.cssText = 'cursor: pointer; margin-left: 8px; font-size: 18px; color: #343a40;';

                // Helper function to apply consistent styling to dropdown menu options
                const applyDropdownOptionStyling = (option) => {
                    option.style.cssText = 'padding: 8px; cursor: pointer; background: #343a40; color: #fafafa; margin: 0; border: none; border-radius: 4px;';
                    option.onmouseover = () => option.style.color = '#e0e0e0';
                    option.onmouseout = () => option.style.color = '#fafafa';
                };

                // Attach click handler directly to arrow
                arrowSpan.onclick = (e) => {
                    e.stopPropagation();
                    // console.log('ARROW CLICKED - showing menu');

                    // create dropdown with red border as before (red border removed. we are releasing in time)
                    const menu = document.createElement('div');
                    menu.style.cssText = `
                        position: absolute;
                        background: transparent;
                        padding: 10px;
                        z-index: 10000;
                        font-size: 14px;
                        font-family: Arial, sans-serif;
                    `;

                    const refreshOption = document.createElement('div');
                    refreshOption.textContent = 'Actualizar lista';
                    applyDropdownOptionStyling(refreshOption);
                    refreshOption.onclick = async () => {
                        menu.remove();

                        // Get current forum info
                        const forumId = location.href.match(/showforum=(\d+)/)?.[1];
                        const navElements = [...document.querySelectorAll('#navstrip a')];
                        const forumName = navElements.slice(2).map(a => a.textContent.trim().replace(/[^a-zA-Z0-9À-ÿ_]/g, '_')).join('_') || 'root';

                        try {
                            // Do incremental update and show result
                            const updatedTopics = await doIncrementalUpdate(forumId, forumName);

                            // Update UI and show the updated list
                            if (typeof window.updateCRGListButton === 'function') {
                                await window.updateCRGListButton();
                            }

                            const markersData = JSON.parse(document.getElementById('crg-markers-data')?.textContent || '{}');
                            enrichTopicsWithMarkers(updatedTopics, markersData, true);
                            showTopicsPopup(updatedTopics);

                        } catch (e) {
                            console.error('[CRG] Error updating current list:', e);
                            showTooltip('Error al actualizar la lista', true);
                        }
                    };

                    const mergeOption = document.createElement('div');
                    mergeOption.textContent = 'Agrupar Listas';
                    applyDropdownOptionStyling(mergeOption);
                    mergeOption.style.marginTop = '-6px';
                    mergeOption.onclick = (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        menu.remove();
                        showMergePanel();
                    };

                    menu.appendChild(refreshOption);
                    menu.appendChild(mergeOption);

                    // Position dropdown below the arrow with scroll offsets
                    const rect = arrowSpan.getBoundingClientRect();
                    menu.style.left = (rect.left + window.scrollX) + 'px';
                    menu.style.top = (rect.bottom + window.scrollY) + 'px';

                    // Append to body for proper positioning
                    document.body.appendChild(menu);
                    // console.log('Dropdown created and positioned at:', menu.style.left, menu.style.top);

                    const hideMenu = (e) => {
                        if (!menu.contains(e.target) && e.target !== arrowSpan) {
                            menu.remove();
                            document.removeEventListener('click', hideMenu);
                        }
                    };
                    setTimeout(() => document.addEventListener('click', hideMenu), 0);
                };

                wrapper.appendChild(button);
                wrapper.appendChild(arrowSpan);

                // Replace container contents
                container.innerHTML = '';
                container.appendChild(wrapper);
            } else {
                button.textContent = 'Lista';
                button.onclick = () => generateList(true);
                button.style.borderRadius = '4px';
                button.style.position = 'relative';
                button.style.display = 'inline-block';

                // Clear container and add just the button
                container.innerHTML = '';
                container.appendChild(button);
            }
        };

        // Initial update
        updateButton();

        // Expose updateButton globally so we can refresh UI after saving cache
        window.updateCRGListButton = () => {
            updateButton();
        };

        navstrip.appendChild(container);
    }
    }

    // ===== DATA EXTRACTION FUNCTIONS =====

    /**
     * Gets the list of page URLs to scrape based on pagination links
     * @param {string} baseUrl - The base forum URL
     * @returns {string[]} - Array of page URLs
     */
    const getPageUrls = async (baseUrl) => {
        try {
            // Fetch the current page to analyze pagination
            const doc = await fetchPageDocument(baseUrl);
            if (!doc) return [baseUrl]; // Fallback to just current page

            let maxSt = 0;



            // More specific selectors for pagination links
            const paginationContainers = doc.querySelectorAll('.pagelink a, .pagelinklast a, span.pagelink a, td > a[href*="&st="]');
            paginationContainers.forEach(el => {
                if (el.tagName === 'A') {
                    const href = el.href || '';
                    const title = el.title || el.textContent || '';
                    // Only consider navigation links (page numbers, arrows, etc.)
                    if (/(\d+|\>|»|Siguiente|Última|Página|Ir|Next|Last)/i.test(title)) {
                        const m = href.match(/&st=(\d+)/);
                        if (m) {
                            maxSt = Math.max(maxSt, +m[1]);
                        }
                    }
                }
            });

            // Additional broad fallback if above didn't find anything
            if (maxSt === 0) {
                doc.querySelectorAll('a[href*="&st="]').forEach(a => {
                    const m = a.href.match(/&st=(\d+)/);
                    if (m) maxSt = Math.max(maxSt, +m[1]);
                });
            }

            // Include current page's st
            const currentStMatch = baseUrl.match(/&st=(\d+)/);
            if (currentStMatch) {
                maxSt = Math.max(maxSt, +currentStMatch[1]);
            }

            // Sanity check: cap at reasonable max (e.g., 100 pages)
            if (maxSt > 2970) { // 100 pages * 30 topics
                console.warn('[CRG] Insanely high maxSt detected (' + maxSt + '), capping to prevent endless loop');
                maxSt = 2970;
            }

            const pages = [];
            for (let st = 0; st <= maxSt; st += TOPICS_PER_PAGE) {
                pages.push(`${baseUrl.split('&st=')[0]}&st=${st}`);
            }

            // console.log(`[CRG] Main scrape: Detected ${pages.length} pages (maxSt=${maxSt})`);
            return pages;
        } catch (e) {
            console.warn('[CRG] Error in getPageUrls, falling back to current page:', e);
            return [baseUrl];
        }
    };

    /**
     * Fetches and parses a forum page using browser fetch API with correct Latin-1 decoding
     * @param {string} url - The URL to fetch
     * @returns {Document|null} - The parsed document or null on error
     */
    const fetchPageDocument = async (url) => {
        try {
            const response = await fetch(url, { credentials: 'same-origin' });
            if (!response.ok) {
                console.warn(`[CRG] Fetch failed: ${response.status} ${response.statusText}`);
                return null;
            }

            // Get raw bytes and decode as ISO-8859-1
            const buffer = await response.arrayBuffer();
            const html = new TextDecoder('iso-8859-1').decode(buffer);

            const doc = new DOMParser().parseFromString(html, 'text/html');
            if (!doc.body) {
                console.warn(`[CRG] No body in parsed document`);
                return null;
            }
            return doc;
        } catch (error) {
            console.warn(`[CRG] Fetch error: ${error}`);
            return null;
        }
    };

    /**
     * Extracts topic data from a forum page document
     * @param {Document} doc - The parsed HTML document
     * @param {string} subforumName - The subforum name
     * @returns {Object[]} - Array of topic objects
     */
    const parseTopicsFromDocument = (doc, subforumName) => {
        const navElements = [...document.querySelectorAll('#navstrip a')];
        const isCompletos = navElements[1]?.href.match(/showforum=(\d+)/)?.[1] === ALLOWED_FORUM_IDS[1];
        const prefix = 'comicteca' + (isCompletos ? '_completos' : '') + '_';

        // Find the "Discusiones" header to locate regular forum topics (exclude pinned)
        const discusionesHeader = Array.from(doc.querySelectorAll('td.darkrow1 b')).find(b => b.textContent.includes('Discusiones'));

        let links = [];

        // Get all topic links and filter out pinned ones by content
        const allTopicLinks = doc.querySelectorAll('a[id^="tid-link-"]');
        links = Array.from(allTopicLinks).filter(link => {
            const row = link.closest('tr');
            return row && !row.querySelector('img[src*="f_pinned"]');
        });

        // console.log(`[CRG] Parsing page: Found ${allTopicLinks.length} total topic links, ${links.length} after filtering pinned topics`);

        const topics = [];
        let skippedPinned = 0;

        links.forEach(link => {
            const row = link.closest('tr');
            if (!row) {
                console.warn(`[CRG] No tr for link ${link.href}`);
                return;
            }
            if (row.querySelector('img[src*="f_pinned"]')) {
                return;
            }

            const id = link.href.match(/showtopic=(\d+)/)?.[1];
            if (!id) {
                console.warn(`[CRG] No topic ID for link ${link.href}`);
                return;
            }

            const rawTitle = link.textContent || '';
            const rawSubtitle = row.querySelector('.desc span')?.textContent || '';
            const authorCell = row.cells[4];
            const rawAuthor = authorCell?.querySelector('a')?.textContent || '';
            const rawDate = authorCell?.querySelector('span[style*="color:#666"], span')?.textContent || '';

            // Extract last action date from "Última acción" column
            const lastActionCell = row.cells[6];
            const rawLastActionDate = lastActionCell?.querySelector('.lastaction')?.textContent?.split('<br>')[0]?.trim() || '';

            // Process and clean data
            const title = cleanText(rawTitle);
            const subtitle = cleanText(rawSubtitle);
            const author = rawAuthor;
            const date = parseDate(rawDate.trim());
            const lastActionDate = parseDate(rawLastActionDate.trim());

            topics.push({
                title,
                subtitle,
                author,
                date,
                lastActionDate,
                url: link.href,
                subforo: prefix + subforumName
            });
        });

        return topics;
    };

    /**
     * Shows the merge cached lists panel using WinBox
     */
    const showMergePanel = async () => {
        // Check if already open
        if (mergePanelInstance) {
            mergePanelInstance.focus();
            return;
        }

        // Create content div for WinBox mounting
        const content = document.createElement('div');
        content.style.cssText = 'width: 100%; height: 100%; display: flex; flex-direction: column; color: #000;';

        // Get all cached subforum IDs
        const subforumIds = await subforumsDB.keys();
    // // console.log('Total cached subforums:', subforumIds.length);

        // Build cached subforums list
        let cachedSubforums = [];
        for (const subforumId of subforumIds) {
            const subforum = await subforumsDB.getItem(subforumId);
            if (subforum) {
                const topicCount = subforum.topicCount || 0;

                if (topicCount > 0) {
                    cachedSubforums.push({
                        id: subforumId,
                        name: subforum.name || `Subforum ${subforumId}`,
                        count: topicCount,
                        date: (() => {
                            const d = new Date(subforum.lastCached);
                            const year = d.getFullYear();
                            const month = (d.getMonth() + 1).toString().padStart(2, '0');
                            const day = d.getDate().toString().padStart(2, '0');
                            const hours = d.getHours().toString().padStart(2, '0');
                            const minutes = d.getMinutes().toString().padStart(2, '0');
                            return `${year}/${month}/${day} ${hours}:${minutes}`;
                        })(),
                        lastCached: subforum.lastCached, // Include timestamp for incremental logic
                        topics: [] // We'll load topics only when selected
                    });
            // // console.log('Found cached subforum:', subforum.name, subforumId, 'with', topicCount, 'topics');
                }
            }
        }

        // console.log('Cached subforums with topics found:', cachedSubforums.length, cachedSubforums.map(sf => sf.id));

        if (cachedSubforums.length === 0) {
            showTooltip('No hay listas en caché para combinar');
            return;
        }

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; padding: 15px;">
                <div style="margin-bottom: 15px; display: flex; justify-content: center;">
                    <button id="crg-toggle-selection" style="padding: 4px 8px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; min-width: 160px;">☑ Seleccionar todo</button>
                    <button id="crg-update-selected" style="padding: 4px 8px; background: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">Actualizar</button>
                    <button id="crg-force-update-selected" style="padding: 4px 8px; background: #6c757d; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">Forzar actualización</button>
                    <button id="crg-delete-selected" style="padding: 4px 8px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">Eliminar</button>
                    <button id="crg-generate-merged" style="padding: 4px 8px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Generar lista</button>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="text" id="crg-subforum-filter" placeholder="Buscar subforo..." style="width: 95%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">
                </div>
                <div id="crg-subforum-table-container" style="border: 1px solid #ddd; flex: 1; overflow: auto;">
                    <table id="crg-subforum-table" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; position: sticky; top: 0; z-index: 1;">
                                <th data-col="0" style="padding: 8px; border: 1px solid #ddd; text-align: center; cursor: pointer; user-select: none;">Seleccionar</th>
                                <th data-col="1" style="padding: 8px; border: 1px solid #ddd; text-align: center; cursor: pointer; user-select: none;">ID</th>
                                <th data-col="2" style="padding: 8px; border: 1px solid #ddd; text-align: left; cursor: pointer; user-select: none;">Subforo</th>
                                <th data-col="3" style="padding: 8px; border: 1px solid #ddd; text-align: center; cursor: pointer; user-select: none;">Temas</th>
                                <th data-col="4" style="padding: 8px; border: 1px solid #ddd; text-align: center; cursor: pointer; user-select: none;">Actualizado</th>
                            </tr>
                        </thead>
                        <tbody id="crg-subforum-tbody">
                        </tbody>
                    </table>
                </div>

            </div>
        `;

        // Create WinBox window
        const win = new WinBox({
          title: "Combinar listas en caché",
          width: "60%",
          height: "60%",
          x: "center",
          y: "center",
          mount: content,
          class: "no-shadow",
          index: 9999,
          background: "#343a40",
          onclose: () => {
            mergePanelInstance = null;
          }
        });

        // Store instance
        mergePanelInstance = win;

        // Auto-focus the filter input
        setTimeout(() => {
          const filterInput = content.querySelector('#crg-subforum-filter');
          if (filterInput) filterInput.focus();
        }, 100);

        const subforumTbody = content.querySelector('#crg-subforum-tbody');
        const generateBtn = content.querySelector('#crg-generate-merged');
        let selectedSubforums = new Set();
        let filteredSubforums = [...cachedSubforums];
        let currentSortCol = -1;
        let currentSortDir = 1;

        // Render subforum table rows
        const renderSubforums = () => {
            subforumTbody.innerHTML = filteredSubforums.map(sf => `
                <tr style="background: ${selectedSubforums.has(sf.id) ? '#e3f2fd' : 'white'};">
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                        <input type="checkbox" data-id="${sf.id}" style="transform: scale(1.2);" ${selectedSubforums.has(sf.id) ? 'checked' : ''}>
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: #000;">${sf.id}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: left; color: #000;">${sf.name}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: #000;">${sf.count}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: #000;">${sf.date}</td>
                </tr>
            `).join('');

            // Update generate button state
            generateBtn.disabled = selectedSubforums.size === 0;
            generateBtn.style.opacity = selectedSubforums.size === 0 ? '0.5' : '1';
        };

        // Sort subforums
        const sortSubforums = (colIndex) => {
            let newDir = 1;
            if (currentSortCol === colIndex) {
                newDir = -currentSortDir;
            }
            currentSortCol = colIndex;
            currentSortDir = newDir;

            // Clear all header arrows
            content.querySelectorAll('th[data-col]').forEach(th => {
                th.textContent = th.textContent.replace(/[ ▲▼]/g, '');
            });

            filteredSubforums.sort((a, b) => {
                let valA, valB;
                switch (colIndex) {
                    case 1: // ID
                        valA = parseInt(a.id);
                        valB = parseInt(b.id);
                        break;
                    case 2: // Name
                        valA = a.name.toLowerCase();
                        valB = b.name.toLowerCase();
                        break;
                    case 3: // Count
                        valA = a.count;
                        valB = b.count;
                        break;
                    case 4: // Date
                        valA = new Date(a.date);
                        valB = new Date(b.date);
                        break;
                    default:
                        return 0;
                }

                if (colIndex === 4) { // Date sorting
                    return (valA - valB) * newDir;
                } else if (typeof valA === 'number') {
                    return (valA - valB) * newDir;
                } else {
                    return valA.localeCompare(valB) * newDir;
                }
            });

            // Add arrow to header
            const header = content.querySelector(`th[data-col="${colIndex}"]`);
            if (header) {
                header.textContent += newDir === 1 ? ' ▲' : ' ▼';
            }

            renderSubforums();
        };

        // Get subforums in a subtree
        const getSubtreeSubforums = async (rootId) => {
            const allSubforums = [];

            // Always include the root subforum first
            const rootSubforum = await subforumsDB.getItem(rootId);
            if (rootSubforum) {
                allSubforums.push(rootSubforum);
            }

            // Then add all descendants
            await subforumsDB.iterate((subforum, id) => {
                if (id !== rootId && subforum.pathIds && subforum.pathIds.includes(rootId)) {
                    allSubforums.push(subforum);
                }
            });
            return allSubforums;
        };

        // Find subforum by exact name (case insensitive, falls back to starts with, then contains)
        const findSubforumByExactName = async (name) => {
            const matches = [];

            // First try exact match - collect ALL matches
            await subforumsDB.iterate((subforum, id) => {
                if (subforum.name && subforum.name.toLowerCase() === name.toLowerCase()) {
                    matches.push(subforum);
                }
            });

            if (matches.length > 0) return matches;

            // If no exact match, try starts with (for quoted names) - collect ALL
            await subforumsDB.iterate((subforum, id) => {
                if (subforum.name && subforum.name.toLowerCase().startsWith(name.toLowerCase())) {
                    matches.push(subforum);
                }
            });

            if (matches.length > 0) return matches;

            // If no starts with match, try contains (last resort for quoted names) - collect ALL
            await subforumsDB.iterate((subforum, id) => {
                if (subforum.name && subforum.name.toLowerCase().includes(name.toLowerCase())) {
                    matches.push(subforum);
                }
            });

            return matches;
        };

        // Find subforum by name with priority matching (collect all, return best)
        const findSubforumByName = async (name) => {
            const matches = [];

            await subforumsDB.iterate((subforum, id) => {
                if (!subforum.name) return;

                const sfName = subforum.name.toLowerCase();
                const searchName = name.toLowerCase();

                if (sfName === searchName) {
                    matches.push({ subforum, priority: 3 }); // Exact match
                } else if (sfName.startsWith(searchName)) {
                    matches.push({ subforum, priority: 2 }); // Starts with
                } else if (sfName.includes(searchName)) {
                    matches.push({ subforum, priority: 1 }); // Contains
                }
            });

            // Return highest priority match, preferring shorter names for same priority
            matches.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority; // Higher priority first
                }
                // Same priority: prefer shorter names
                return a.subforum.name.length - b.subforum.name.length;
            });
            return matches[0]?.subforum;
        };

        // Apply merge filter (supports multiple :m: commands and mixed syntax)
        const applyMergeFilter = async () => {
            const filterValue = content.querySelector('#crg-subforum-filter').value.trim();

            // :m: commands get special treatment - only show subtree results, hide when invalid
            if (filterValue.includes(':m:')) {
                const hasIndividualIds = /\b\d{1,3}\b/.test(filterValue);
                const allSubforums = [];

                // Parse :m: commands (supporting quoted strings, comma-separated and space-separated)
                const mergeMatches = filterValue.match(/:m:[^\s]+/g) || [];
                for (const match of mergeMatches) {
                    const targetPart = match.slice(3); // Remove :m:

                    // Parse comma-separated targets (quoted or unquoted)
                    const targets = [];
                    const parts = targetPart.split(','); // Always split on commas first

                    for (const part of parts) {
                        const trimmed = part.trim();
                        if (trimmed) {
                            targets.push(trimmed);
                        }
                    }

                    // If no parts found (shouldn't happen), use original
                    if (targets.length === 0) {
                        targets.push(targetPart);
                    }

                    // Process each parsed target
                    for (const target of targets) {
                        const trimmedTarget = target.trim();
                        if (!trimmedTarget) continue;

                        const isQuoted = trimmedTarget.startsWith('"') && trimmedTarget.endsWith('"');
                        const cleanTarget = isQuoted ? trimmedTarget.slice(1, -1) : trimmedTarget;

                        if (isQuoted) {
                            // Quoted: search by name (alphanumeric)
                            const subforums = await findSubforumByExactName(cleanTarget);
                            for (const subforum of subforums) {
                                const subtreeSubforums = await getSubtreeSubforums(subforum.id);
                                allSubforums.push(...subtreeSubforums);
                            }
                        } else {
                            // Unquoted: must be numeric ID
                            if (!/^\d+$/.test(cleanTarget)) {
                                showTooltip(`Sintaxis inválida: ${cleanTarget} (usa comillas para nombres)`);
                                continue;
                            }
                            // Process numeric ID
                            const subforum = await subforumsDB.getItem(cleanTarget);
                            if (subforum) {
                                const subtreeSubforums = await getSubtreeSubforums(cleanTarget);
                                allSubforums.push(...subtreeSubforums);
                            } else {
                                showTooltip(`Subforo ${cleanTarget} no encontrado`);
                            }
                        }
                    }
                }

                // Parse individual IDs (bare numbers, excluding those in :m: commands)
                if (hasIndividualIds) {
                    // Split by spaces and filter out :m: commands, then extract numbers
                    const parts = filterValue.split(/\s+/);
                    const individualParts = parts.filter(part => !part.startsWith(':m:') && /^\d{1,3}$/.test(part));

                    for (const idStr of individualParts) {
                        const id = idStr;
                        // Check if this ID exists in subforums DB
                        const subforum = await subforumsDB.getItem(id);
                        if (subforum) {
                            allSubforums.push(subforum);
                        }
                    }
                }

                // Remove duplicates
                const uniqueSubforums = allSubforums.filter((sf, index, self) =>
                    index === self.findIndex(s => s.id === sf.id)
                );

                if (uniqueSubforums.length === 0) {
                    showTooltip('No se encontraron subforos para los criterios especificados');
                    filteredSubforums = [];
                    renderSubforums();
                    return;
                }

                // Format subforum objects for display, always exclude pure containers (0 topics)
                // :m: filters find subtrees correctly but display only shows meaningful content
                const formattedSubforums = uniqueSubforums
                    .filter(subforum => subforum.topicCount > 0) // Never show containers
                    .map(subforum => ({
                        id: subforum.id,
                        name: subforum.name || `Forum ${subforum.id}`,
                        count: subforum.topicCount || 0,
                        date: (() => {
                            const d = new Date(subforum.lastCached);
                            const year = d.getFullYear();
                            const month = (d.getMonth() + 1).toString().padStart(2, '0');
                            const day = d.getDate().toString().padStart(2, '0');
                            const hours = d.getHours().toString().padStart(2, '0');
                            const minutes = d.getMinutes().toString().padStart(2, '0');
                            return `${year}/${month}/${day} ${hours}:${minutes}`;
                        })(),
                        lastCached: subforum.lastCached
                    }));

                filteredSubforums = formattedSubforums;
                showTooltip(`Mostrando ${formattedSubforums.length} subforos`);

                // Re-sort if currently sorted
                if (currentSortCol >= 0) {
                    sortSubforums(currentSortCol);
                } else {
                    renderSubforums();
                    updateToggleButton();
                }
            } else {
                // Regular text filtering
                if (!filterValue) {
                    filteredSubforums = [...cachedSubforums];
                } else {
                    const normalizedFilter = normalizeText(filterValue);
                    filteredSubforums = cachedSubforums.filter(sf =>
                        normalizeText(sf.name).includes(normalizedFilter)
                    );
                }

                // Re-sort if currently sorted
                if (currentSortCol >= 0) {
                    sortSubforums(currentSortCol);
                } else {
                    renderSubforums();
                    updateToggleButton();
                }
            }
        };

        // Event handler for toggle selection button
        content.querySelector('#crg-toggle-selection').onclick = () => {
            const allVisibleSelected = filteredSubforums.every(sf => selectedSubforums.has(sf.id));
            if (allVisibleSelected) {
                // Deselect all visible
                filteredSubforums.forEach(sf => selectedSubforums.delete(sf.id));
            } else {
                // Select all visible
                filteredSubforums.forEach(sf => selectedSubforums.add(sf.id));
            }
            updateToggleButton();
            renderSubforums();
        };

        content.querySelector('#crg-update-selected').onclick = async () => {
            if (selectedSubforums.size === 0) {
                showTooltip('Selecciona al menos una lista para actualizar');
                return;
            }

            const selectedIds = Array.from(selectedSubforums);
            showTooltip(`Actualizando ${selectedIds.length} lista(s) en caché...`, true);

            try {
                let successCount = 0;
                let errorCount = 0;
                let totalTopicsUpdated = 0;

                for (let i = 0; i < selectedIds.length; i++) {
                    const forumId = selectedIds[i];
                    const forumName = cachedSubforums.find(sf => sf.id === forumId)?.name || `Forum ${forumId}`;

                    showTooltip(`Actualizando ${forumName} (${i + 1}/${selectedIds.length})...`, true);

                    try {
                        // Get existing cached topics for this forum
                        const existingTopics = [];
                        await topicsDB.iterate((topic, topicId) => {
                            if (topic.subforumId === forumId) {
                                existingTopics.push(topic);
                            }
                        });

                        const lastCacheTime = cachedSubforums.find(sf => sf.id === forumId)?.lastCached || 0;

                        // Use unified scraping function for incremental updates
                        const updates = await scrapeForumTopics(forumId, forumName, 'incremental', lastCacheTime);

                        // Merge updates with existing topics
                        const existingTopicMap = new Map();
                        existingTopics.forEach(topic => {
                            existingTopicMap.set(topic.id, topic);
                        });

                        const mergedTopics = [...existingTopics]; // Start with existing
                        let topicsAdded = 0;
                        let topicsUpdated = 0;

                        // Add new topics
                        for (const newTopic of updates.newTopics) {
                            mergedTopics.push(newTopic);
                            topicsAdded++;
                        }

        // Update existing topics
        for (const updatedTopic of updates.updatedTopics) {
            const existingTopic = existingTopicMap.get(updatedTopic.id);
            if (existingTopic) {
                // Explicitly overwrite all mutable fields
                existingTopic.title = updatedTopic.title;
                existingTopic.subtitle = updatedTopic.subtitle;
                existingTopic.author = updatedTopic.author;
                existingTopic.date = updatedTopic.date;
                existingTopic.lastActionDate = updatedTopic.lastActionDate;
                existingTopic.url = updatedTopic.url;

                topicsUpdated++;
            }
        }

        // Save only changed topics to cache
        await saveChangedTopicsSelectively(forumId, forumName, updates.newTopics, updates.updatedTopics, existingTopics.length);

                        // console.log(`[CRG] Incremental update for ${forumId}: +${topicsAdded} new, ${topicsUpdated} updated, ${mergedTopics.length} total`);
                        totalTopicsUpdated += topicsAdded + topicsUpdated;
                        successCount++;

                    } catch (e) {
                        console.error(`Error updating forum ${forumId}:`, e);
                        errorCount++;
                    }
                }

                // Refresh the cached subforums list in UI
                cachedSubforums = await refreshCachedSubforumsList();
                filteredSubforums = [...cachedSubforums]; // Update filtered list to match

                renderSubforums();

                const msg = errorCount === 0
                    ? `Actualizadas ${successCount} lista(s) en caché (${totalTopicsUpdated} temas)`
                    : `Actualizadas ${successCount} lista(s), ${errorCount} error(es) (${totalTopicsUpdated} temas)`;

                showTooltip(msg);

            } catch (e) {
                console.error('[CRG] Batch update error:', e);
                showTooltip('Error en la actualización por lotes', true);
            }
        };

        content.querySelector('#crg-force-update-selected').onclick = async () => {
            if (selectedSubforums.size === 0) {
                showTooltip('Selecciona al menos una lista para forzar actualización');
                return;
            }

            const selectedIds = Array.from(selectedSubforums);
            const confirmMsg = `¿Forzar actualización completa de ${selectedIds.length} lista(s)?\n\nEsto volverá a descargar todos los temas desde cero.`;

            if (!confirm(confirmMsg)) return;

            showTooltip(`Forzando actualización completa de ${selectedIds.length} lista(s)...`, true);

            try {
                let successCount = 0;
                let errorCount = 0;
                let totalTopicsScraped = 0;

                for (let i = 0; i < selectedIds.length; i++) {
                    const forumId = selectedIds[i];
                    const forumName = cachedSubforums.find(sf => sf.id === forumId)?.name || `Forum ${forumId}`;

                    showTooltip(`Forzando actualización de ${forumName} (${i + 1}/${selectedIds.length})...`, true);

                    try {
                        // Full scrape - ignore cache completely
                        const allTopics = await scrapeForumTopics(forumId, forumName, 'full');

                        // Save fresh topics to cache (overwrites existing)
                        await saveTopicsToCache(forumId, forumName, allTopics);

                        console.log(`[CRG] Force update for ${forumId}: scraped ${allTopics.length} topics`);
                        totalTopicsScraped += allTopics.length;
                        successCount++;

                    } catch (e) {
                        console.error(`Error force updating forum ${forumId}:`, e);
                        errorCount++;
                    }
                }

                // Refresh the cached subforums list in UI
                cachedSubforums = await refreshCachedSubforumsList();
                filteredSubforums = [...cachedSubforums]; // Update filtered list to match

                renderSubforums();

                const msg = errorCount === 0
                    ? `Actualización forzada completada (${totalTopicsScraped} temas en ${successCount} lista(s))`
                    : `Actualización forzada: ${successCount} exitosa(s), ${errorCount} error(es)`;

                showTooltip(msg);

            } catch (e) {
                console.error('[CRG] Batch force update error:', e);
                showTooltip('Error en la actualización forzada', true);
            }
        };

        content.querySelector('#crg-delete-selected').onclick = async () => {
            if (selectedSubforums.size === 0) {
                showTooltip('Selecciona al menos una lista para eliminar');
                return;
            }

            const selectedIds = Array.from(selectedSubforums);
            const confirmMsg = `¿Eliminar ${selectedIds.length} lista(s) en caché seleccionada(s)?\n\nEsto no se puede deshacer.`;

            if (!confirm(confirmMsg)) return;

            try {
                // Delete selected subforums and their topics
                for (const subforumId of selectedIds) {
                    await subforumsDB.removeItem(subforumId);

                    // Delete all topics for this subforum (collect IDs first, then delete)
                    const topicIdsToDelete = [];
                    await topicsDB.iterate((topic, topicId) => {
                        if (topic.subforumId === subforumId) {
                            topicIdsToDelete.push(topicId);
                        }
                    });
                    for (const topicId of topicIdsToDelete) {
                        await topicsDB.removeItem(topicId);
                    }
                }

                // Refresh the cached subforums list in UI
                cachedSubforums = await refreshCachedSubforumsList();
                filteredSubforums = [...cachedSubforums]; // Update filtered list to match

                // Clear selections for deleted subforums
                const remainingIds = new Set(cachedSubforums.map(sf => sf.id));
                selectedSubforums = new Set([...selectedSubforums].filter(id => remainingIds.has(id)));

                renderSubforums();

                showTooltip(`Eliminadas ${selectedIds.length} lista(s) en caché`);
            } catch (e) {
                console.error('[CRG] Error deleting cached lists:', e);
                showTooltip('Error al eliminar listas en caché', true);
            }
        };

        content.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const id = e.target.dataset.id;
                if (e.target.checked) {
                    selectedSubforums.add(id);
                } else {
                    selectedSubforums.delete(id);
                }
                renderSubforums();
            }
        });

        content.querySelector('#crg-generate-merged').onclick = async () => {
            if (selectedSubforums.size === 0) return;

            const selectedIds = Array.from(selectedSubforums);
            // console.log('Selected subforums:', selectedIds);

            // Collect selected topics from IndexedDB
            const mergedTopics = [];
            const selectedNames = new Set();

            await topicsDB.iterate((topic, topicId) => {
                if (selectedIds.includes(topic.subforumId)) {
                    // Clone topic and add subforumName
                    const mergedTopic = {...topic};
                    const sf = cachedSubforums.find(s => s.id === topic.subforumId);
                    if (sf) {
                        mergedTopic.subforumName = sf.name;
                        selectedNames.add(sf.name);
                    }
                    mergedTopics.push(mergedTopic);
                }
            });

            // console.log('Merged topics count:', mergedTopics.length);

            if (mergedTopics.length === 0) {
                showTooltip('No se encontraron temas en las listas seleccionadas');
                return;
            }

            // Enrich with markers and show popup
            const markersData = JSON.parse(document.getElementById('crg-markers-data')?.textContent || '{}');
            enrichTopicsWithMarkers(mergedTopics, markersData, true);

            showTopicsPopup(mergedTopics, selectedNames);
            win.close();
            showTooltip(`Lista combinada generada con ${mergedTopics.length} temas`);
        };

        // Add table header click handlers for sorting
        content.querySelectorAll('th[data-col]').forEach(th => {
            th.addEventListener('click', () => {
                const colIndex = parseInt(th.dataset.col);
                if (colIndex > 0) { // Skip checkbox column (col 0)
                    sortSubforums(colIndex);
                }
            });
        });

        // Add filter input handler with :m: support
        let filterTimeout = null;
        content.querySelector('#crg-subforum-filter').addEventListener('input', () => {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(applyMergeFilter, 300);
        });

        // Function to update toggle button text based on current selection
        const updateToggleButton = () => {
            const button = content.querySelector('#crg-toggle-selection');
            const allVisibleSelected = filteredSubforums.every(sf => selectedSubforums.has(sf.id));
            if (allVisibleSelected) {
                // All visible are selected, show deselect option
                button.textContent = '☐ Deseleccionar todo';
            } else {
                // Not all visible selected, show select option
                button.textContent = '☑ Seleccionar todo';
            }
        };

        // Initial render
        renderSubforums();
        updateToggleButton();
    };

    /**
     * Performs incremental update for a single forum and returns updated topics
     * @param {string} forumId - The forum ID
     * @param {string} forumName - The forum name
     * @returns {Array} - Updated topics array
     */
    const doIncrementalUpdate = async (forumId, forumName) => {
        showTooltip('Actualizando lista...', true);

        // Get existing cached topics for this forum
        const existingTopics = [];
        await topicsDB.iterate((topic, topicId) => {
            if (topic.subforumId === forumId) {
                existingTopics.push(topic);
            }
        });

        const lastCacheTime = existingTopics.length > 0 ?
            Math.max(...existingTopics.map(t => t.lastActionDate?.unix || 0)) : 0;

        // Do incremental update
        const updates = await scrapeForumTopics(forumId, forumName, 'incremental', lastCacheTime);

        // Merge updates with existing topics
        const existingTopicMap = new Map();
        existingTopics.forEach(topic => {
            existingTopicMap.set(topic.id, topic);
        });

        const mergedTopics = [...existingTopics];
        let topicsAdded = 0;
        let topicsUpdated = 0;

        // Add new topics
        for (const newTopic of updates.newTopics) {
            mergedTopics.push(newTopic);
            topicsAdded++;
        }

                        // Update existing topics
                        for (const updatedTopic of updates.updatedTopics) {
                            const existingTopic = existingTopicMap.get(updatedTopic.id);
                            if (existingTopic) {
                                // Explicitly overwrite all mutable fields
                                existingTopic.title = updatedTopic.title;
                                existingTopic.subtitle = updatedTopic.subtitle;
                                existingTopic.author = updatedTopic.author;
                                existingTopic.date = updatedTopic.date;
                                existingTopic.lastActionDate = updatedTopic.lastActionDate;
                                existingTopic.url = updatedTopic.url;

                                topicsUpdated++;
                            }
                        }

        // Save only changed topics to cache
        await saveChangedTopicsSelectively(forumId, forumName, updates.newTopics, updates.updatedTopics, existingTopics.length);

        showTooltip(`Lista actualizada: +${topicsAdded} nuevos, ${topicsUpdated} modificados`);

        return mergedTopics;
    };

    /**
     * Unified function to scrape forum topics in full or incremental mode
     * @param {string} forumId - The forum ID
     * @param {string} subforumName - The subforum name
     * @param {string} mode - 'full' or 'incremental'
     * @param {number} lastCacheTime - For incremental mode, topics older than this are skipped
     * @returns {Object|Array} - For incremental: {newTopics, updatedTopics}, for full: topics array
     */
    const scrapeForumTopics = async (forumId, subforumName, mode = 'full', lastCacheTime = 0) => {
        const baseUrl = `http://lamansion-crg.net/forum/index.php?showforum=${forumId}&sort_by=Z-A&sort_key=last_post&topicfilter=all&prune_day=100`;

        // Always start with first page (&st=0 is same as base URL)
        const firstPageUrl = `${baseUrl}&st=0`;
        const firstDoc = await fetchPageDocument(firstPageUrl);
        if (!firstDoc) {
            console.warn('[CRG] Failed to fetch first page');
            return mode === 'incremental' ? { newTopics: [], updatedTopics: [] } : [];
        }

        // Extract pagination from the first page document
        const pageUrls = getPageUrlsFromDoc(firstDoc, baseUrl);

        if (mode === 'incremental') {
            // Incremental mode: track new and updated topics
            const newTopics = [];
            const updatedTopics = [];

            // console.log(`[CRG] Starting incremental update from ${new Date(lastCacheTime).toLocaleString()}`);

            // Process first page data
            let firstPageTopics = parseTopicsFromDocument(firstDoc, subforumName);
            await processPageTopicsIncremental(firstPageTopics, newTopics, updatedTopics, lastCacheTime, 0);

            // Check if we need to continue with other pages
            const firstPageTimestamps = firstPageTopics.map(t => t.lastActionDate?.unix || 0);
            const shouldContinue = firstPageTimestamps.length > 0 && Math.max(...firstPageTimestamps) > lastCacheTime;
            // console.log('[CRG] DEBUG First page max timestamp:', Math.max(...firstPageTimestamps), new Date(Math.max(...firstPageTimestamps)).toISOString());
            // console.log('[CRG] DEBUG shouldContinue:', shouldContinue, 'because', Math.max(...firstPageTimestamps), '>', lastCacheTime, '?', Math.max(...firstPageTimestamps) > lastCacheTime);

            if (shouldContinue) {
                // Process remaining pages
                for (let i = 1; i < pageUrls.length; i++) {
                    const pageUrl = pageUrls[i];
                    showTooltip(`Actualización incremental: página ${i + 1}/${pageUrls.length}...`, true);

                    const doc = await fetchPageDocument(pageUrl);
                    if (!doc) continue;

                    const pageTopics = parseTopicsFromDocument(doc, subforumName);
                    const pageProcessed = await processPageTopicsIncremental(pageTopics, newTopics, updatedTopics, lastCacheTime, i);

                    if (!pageProcessed) {
                        // Page had no newer topics, and we're done with this page
                        // console.log(`[CRG] Page ${i} has no topics newer than cache, stopping incremental update`);
                        break;
                    }
                }
            }

            // console.log(`[CRG] Incremental update complete: ${newTopics.length} new topics, ${updatedTopics.length} updated topics`);
            return { newTopics, updatedTopics };

        } else {
            // Full mode: collect all topics, starting with first page
            const allTopics = [...parseTopicsFromDocument(firstDoc, subforumName)];

            // Process remaining pages
            for (let i = 1; i < pageUrls.length; i++) {
                const pageUrl = pageUrls[i];
                showTooltip(`Cargando página ${i + 1}/${pageUrls.length}...`, true);

                const doc = await fetchPageDocument(pageUrl);
                if (!doc) continue;

                const pageTopics = parseTopicsFromDocument(doc, subforumName);
                allTopics.push(...pageTopics);
            }

            return allTopics;
        }
    };

    /**
     * Extract page URLs from a document that has already been fetched
     * @param {Document} doc - The parsed document
     * @param {string} baseUrl - The base URL for constructing page URLs
     * @returns {string[]} - Array of page URLs
     */
    const getPageUrlsFromDoc = (doc, baseUrl) => {
        let maxSt = 0;

        // Find pagination links in the document
        const paginationContainers = doc.querySelectorAll('.pagelink a, .pagelinklast a, span.pagelink a, td > a[href*="&st="]');
        paginationContainers.forEach(el => {
            if (el.tagName === 'A') {
                const href = el.href || '';
                const title = el.title || el.textContent || '';
                // Only consider navigation links
                if (/(\d+|\>|»|Siguiente|Última|Página|Ir|Next|Last)/i.test(title)) {
                    const m = href.match(/&st=(\d+)/);
                    if (m) {
                        maxSt = Math.max(maxSt, +m[1]);
                    }
                }
            }
        });

        // Additional broad fallback
        if (maxSt === 0) {
            doc.querySelectorAll('a[href*="&st="]').forEach(a => {
                const m = a.href.match(/&st=(\d+)/);
                if (m) maxSt = Math.max(maxSt, +m[1]);
            });
        }

        // Include current page's st
        const currentStMatch = baseUrl.match(/&st=(\d+)/);
        if (currentStMatch) {
            maxSt = Math.max(maxSt, +currentStMatch[1]);
        }

        // Sanity check
        if (maxSt > 2970) {
            console.warn('[CRG] Insanely high maxSt detected (' + maxSt + '), capping to prevent endless loop');
            maxSt = 2970;
        }

        const pages = [];
        for (let st = 0; st <= maxSt; st += TOPICS_PER_PAGE) {
            pages.push(`${baseUrl}&st=${st}`);
        }

        return pages;
    };

    /**
     * Process topics from a page for incremental updates
     * @param {Object[]} pageTopics - Topics from the current page
     * @param {Object[]} newTopics - Array to add new topics to
     * @param {Object[]} updatedTopics - Array to add updated topics to
     * @param {number} lastCacheTime - Cache timestamp
     * @param {number} pageIndex - Current page index
     * @returns {boolean} - True if page had newer topics, false if all were old
     */
    const processPageTopicsIncremental = async (pageTopics, newTopics, updatedTopics, lastCacheTime, pageIndex) => {
        // Check if all topics on this page are older than our cache
        const pageTimestamps = pageTopics.map(t => t.lastActionDate?.unix || 0);
        if (pageTimestamps.length === 0) return false;

        const newestOnPage = Math.max(...pageTimestamps);
        if (newestOnPage < lastCacheTime) {
            return false; // All topics are old, no need to check further pages
        }

        // Process topics that are newer than cache
        for (const topic of pageTopics) {
            const topicTimestamp = topic.lastActionDate?.unix || 0;
            if (topicTimestamp > lastCacheTime) {
                // Check if this topic exists in cache
                const topicId = topic.url.match(/showtopic=(\d+)/)?.[1];
                if (topicId) {
                    topic.id = topicId;  // ← ADD THIS LINE
                    const existingTopic = await topicsDB.getItem(topicId);
                    if (existingTopic) {
                        // Topic exists, check if it was updated
                        const existingTimestamp = existingTopic.lastActionDate?.unix || 0;
                        if (topicTimestamp > existingTimestamp) {
                            console.log(`[CRG] Update detected for topic ${topicId}: ${new Date(existingTimestamp).toLocaleString()} → ${new Date(topicTimestamp).toLocaleString()}`);
                            updatedTopics.push(topic);
                        }
                    } else {
                        // New topic
                        newTopics.push(topic);
                    }
                }
            }
        }

        return true; // Page had newer topics
    };

    /**
     * Main function to generate the topics list popup
     */
     const generateList = async (forceLive = false) => {
     let topics = [];

     if (!forceLive) {
         const cached = await loadFromCache();
         if (cached) {
             topics = cached;
             showTooltip('Lista cargada desde caché');
         }
     }

     if (topics.length === 0 || forceLive) {
         // Live fetch - check if we can do incremental update
         const forumId = location.href.match(/showforum=(\d+)/)?.[1];
         const navElements = [...document.querySelectorAll('#navstrip a')];
         const subforumName = navElements.slice(2).map(a => a.textContent.trim().replace(/[^a-zA-Z0-9À-ÿ_]/g, '_')).join('_') || 'root';

         // Check if we have existing cached data for incremental update
         const existingTopics = await loadFromCache();
         const hasExistingCache = existingTopics && existingTopics.length > 0;

         if (!forceLive && hasExistingCache) {
             // Try incremental update first
             showTooltip('Buscando actualizaciones...', true);

             // Get last cache timestamp (use max topic activity time for accurate incremental updates)
             const lastCacheTime = existingTopics.length > 0 ?
                 Math.max(...existingTopics.map(t => t.lastActionDate?.unix || 0)) : 0;
             console.log('[CRG] DEBUG lastCacheTime:', lastCacheTime, new Date(lastCacheTime).toISOString());

             const updates = await scrapeForumTopics(forumId, forumName, 'incremental', lastCacheTime);

             if (updates.newTopics.length === 0 && updates.updatedTopics.length === 0) {
                 // No updates found
                 showTooltip('Este subforo no necesita actualización');
                 topics = existingTopics;
             } else {
                 // Merge updates with existing cache
                 showTooltip(`Actualización incremental: ${updates.newTopics.length} nuevos, ${updates.updatedTopics.length} actualizados`, true);

                 // Create maps for efficient lookup
                 const existingMap = new Map();
                 existingTopics.forEach(topic => {
                     const id = topic.url.match(/showtopic=(\d+)/)?.[1];
                     if (id) existingMap.set(id, topic);
                 });

                 // Merge new topics
                 const mergedTopics = [...existingTopics];
                 for (const newTopic of updates.newTopics) {
                     mergedTopics.push(newTopic);
                 }

                 // Update existing topics
                 for (const updatedTopic of updates.updatedTopics) {
                     const id = updatedTopic.url.match(/showtopic=(\d+)/)?.[1];
                     if (id) {
                         const index = mergedTopics.findIndex(t => t.url.match(/showtopic=(\d+)/)?.[1] === id);
                         if (index !== -1) {
                             mergedTopics[index] = updatedTopic;
                         }
                     }
                 }

                 topics = mergedTopics;
                 await saveChangedTopicsSelectively(forumId, subforumName, updates.newTopics, updates.updatedTopics, existingTopics.length);

                 const persistentTooltip = document.getElementById('crg-tooltip');
                 if (persistentTooltip) persistentTooltip.remove();
                 showTooltip(`Lista actualizada: ${updates.newTopics.length} nuevos, ${updates.updatedTopics.length} modificados`);
             }

             // Always update the subforum timestamp to reflect last checked time
             const subforumData = await subforumsDB.getItem(forumId);
             if (subforumData) {
                 await subforumsDB.setItem(forumId, {
                     ...subforumData,
                     lastCached: Date.now()
                 });
             }
         } else {
             // Full scrape (first time or forceLive)
             topics = await scrapeForumTopics(forumId, subforumName, 'full');

             // Save fresh data to cache
             await saveToCache(topics);

             showTooltip(`Lista completa generada: ${topics.length} temas`);
         }

         // Update button UI
         if (typeof window.updateCRGListButton === 'function') {
             await window.updateCRGListButton();
         }
     }

     // Enrich topics with markers data
     const markersData = JSON.parse(document.getElementById('crg-markers-data')?.textContent || '{}');
     enrichTopicsWithMarkers(topics, markersData, true);

     // Show the list in popup
     showTopicsPopup(topics);
     showTooltip('Lista generada');
     };

    /**
     * Creates and shows the topics list popup using WinBox
     * @param {Object[]} topics - Array of topic data
     * @param {string[]} selectedNames - Array of selected subforum names (for merged lists)
     */
    const showTopicsPopup = (topics, selectedNames = []) => {
        // Create content div for WinBox mounting
        const content = document.createElement('div');
        content.style.cssText = 'width: 100%; height: 100%; display: flex; flex-direction: column; color: #000;';

    // Determine title and subtitle based on merged status
    const isMerged = selectedNames.length > 0;
    const winBoxTitle = isMerged ? 'Subforos Agrupados' : 'Lista de temas';

    content.innerHTML = `
            <div style="flex: 1; overflow: auto;">
                <div style="position: sticky; top: 0; background: #f9f9f9; border-bottom: 2px solid #ccc; z-index: 10; padding:8px;display:flex;align-items:center;">
                    <span id="crg-counter" style="margin-right:12px;font-weight:bold;white-space:nowrap;">0 / 0</span>
                    <input type="text" id="crg-filter-input" placeholder="Filtrar temas... prefijos :regex: :c: :s: :r:" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;font-size:14px;">
                    <div style="position: relative; display: inline-block; margin-left: 8px;">
                        <span id="crg-filter-history" style="cursor:pointer;color:#666;font-size:14px;" title="Historial de filtros">▼</span>
                    </div>
                    <button id="crg-reload-filter" style="margin-left:8px;padding:6px 12px;background:#343a40;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Actualizar">↻</button>
                    <button id="crg-export-csv" style="margin-left:8px;padding:6px 12px;background:#343a40;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Exportar a CSV">CSV</button>
                    <button id="crg-csv-config" style="margin-left:4px;padding:6px 12px;background:#343a40;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;" title="Configurar columnas CSV">⚙</button>
                </div>
                <div id="crg-topics-table" style="width: 100%;">
                    <div id="crg-table-header" style="display: flex; background: #f0f0f0; z-index: 9; border-bottom: 2px solid #ddd;">
                        <div data-col="0" style="width: 50%; border: 1px solid #ddd; padding: 8px; text-align: left; cursor: pointer; user-select: none;">Título</div>
                        <div data-col="1" style="width: 12%; border: 1px solid #ddd; padding: 8px; text-align: center; cursor: pointer; user-select: none;">Autor</div>
                        <div data-col="2" style="width: 8%; border: 1px solid #ddd; padding: 8px; text-align: center; cursor: pointer; user-select: none;">Creado</div>
                        <div data-col="3" style="width: 8%; border: 1px solid #ddd; padding: 8px; text-align: center; cursor: pointer; user-select: none;">Modificado</div>
                        <div data-col="4" style="width: 12%; border: 1px solid #ddd; padding: 8px; text-align: left; cursor: pointer; user-select: none;">Subforo</div>
                    </div>
                    <div id="virtual-rows" style="position: relative;"></div>
                </div>
            </div>
        `;

        // Create WinBox window
        const win = new WinBox({
            title: winBoxTitle,
            width: "90%",
            height: "90%",
            x: "center",
            y: "center",
            mount: content,
            class: "no-shadow",
            index: 9999,
            background: "#343a40",
            onclose: () => {
                // Cleanup when window closes
                window.crgCurrentTopics = null;
                window.crgOriginalTopics = null;
                window.refreshListFilter = null;
            }
        });

const scrollContainer = content.querySelector('div[style*="flex: 1; overflow: auto"]');

// === PERFECT STICKY HEADER FIX ===
setTimeout(() => {
    const filterBar = content.querySelector('div[style*="position: sticky; top: 0"]');
    const tableHeader = content.querySelector('#crg-table-header');
    const virtualRowsDiv = content.querySelector('#virtual-rows');

    if (!filterBar || !tableHeader || !virtualRowsDiv) return;

    // Add padding-top to virtual rows equal to filter + header height
    const updateStickyLayout = () => {
        const filterHeight = filterBar.offsetHeight;
        const headerHeight = tableHeader.offsetHeight;
        const totalTopSpace = filterHeight + headerHeight;

        // Push virtual rows down so they start below the fixed parts
        virtualRowsDiv.style.paddingTop = totalTopSpace + 'px';

        // Make table header sticky just below filter bar
        tableHeader.style.position = 'sticky';
        tableHeader.style.top = filterHeight + 'px';
        tableHeader.style.background = '#f0f0f0';
        tableHeader.style.zIndex = '9';
    };

    // Initial apply
    updateStickyLayout();

    // Reapply on scroll (rarely needed, but safe)
    scrollContainer.addEventListener('scroll', updateStickyLayout);

    // Reapply when filter bar changes size (e.g. window resize, zoom)
    const ro = new ResizeObserver(updateStickyLayout);
    ro.observe(filterBar);
    ro.observe(tableHeader);
    ro.observe(scrollContainer);

    // Cleanup
    const oldOnClose = win.onclose || (() => {});
    win.onclose = () => {
        ro.disconnect();
        oldOnClose();
    };
}, 150);

const originalTopics = [...topics]; // Keep original for sorting/filtering
let currentTopics = [...topics];
        window.crgCurrentTopics = currentTopics;
        window.crgOriginalTopics = originalTopics;
        let currentSortCol = -1;
        let currentSortDir = 1; // 1 for asc, -1 for desc
        let markersCache = {}; // Cache for markers data

        // Property names corresponding to column indices
        const propNames = ['title', 'author', 'date', 'lastActionDate', 'subforo'];

        // Variable to store sort arrows
        const sortArrows = {0: '', 1: '', 2: '', 3: '', 4: ''};

        // Collator for locale-aware, accent-insensitive sorting
        const collator = new Intl.Collator('es', { sensitivity: 'base' });

        const counter = content.querySelector('#crg-counter');

        const updateCounter = () => {
            counter.textContent = `${currentTopics.length} / ${originalTopics.length}`;
        };

        /**
         * Renders the table rows based on currentTopics using virtual scrolling
         */
        const renderTable = () => {
            const virtualRowsDiv = content.querySelector('#virtual-rows');

            const scrollTop = scrollContainer.scrollTop;
            const containerHeight = scrollContainer.clientHeight;
            const itemHeight = 48;
            const overscan = 20;

            const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
            const endIndex = Math.min(currentTopics.length - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);

            const visibleTopics = currentTopics.slice(startIndex, endIndex + 1);

            // Get navigation elements for subforum path extraction (fallback for non-merged topics)
            const navElements = [...document.querySelectorAll('#navstrip a')];
            const pathParts = navElements.slice(2).map(a => a.textContent.trim());
            const defaultSubforoName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'Principal';

            // Build HTML string for visible rows
            const htmlRows = visibleTopics.map((topic, i) => {
                const index = startIndex + i;
                const top = index * itemHeight;
                // For merged topics, use the stored subforumName; for regular topics, use navigation
                const subforoName = topic.subforumName || defaultSubforoName;

           return `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 48px; transform: translateY(${top}px); display: flex; background: #F0F0F0;">
           <div style="width: 50%; border: 1px solid #ddd; padding: 8px; text-align: left;"><a href="${topic.url}" target="_blank" style="color:#000;"><b>${topic.title}</b> ${topic.subtitle}</a></div>
           <div style="width: 12%; border: 1px solid #ddd; padding: 8px; text-align: center; color:#000;">${topic.author}</div>
           <div style="width: 8%; border: 1px solid #ddd; padding: 8px; text-align: center; color:#000;">${topic.date.display}</div>
           <div style="width: 8%; border: 1px solid #ddd; padding: 8px; text-align: center; color:#000;">${topic.lastActionDate?.display || ''}</div>
           <div style="width: 12%; border: 1px solid #ddd; padding: 8px; text-align: left; color:#000;">${subforoName}</div>
           </div>`;
            }).join('');

            virtualRowsDiv.innerHTML = htmlRows;
            virtualRowsDiv.style.height = currentTopics.length * itemHeight + 'px';

            // Apply CRG markers in bulk to all new links
            if (typeof window.addCRGMarkerToLink === 'function') {
                const popupLinks = virtualRowsDiv.querySelectorAll('a[href*="showtopic="], a[href*="act=ST"]');
                popupLinks.forEach(window.addCRGMarkerToLink);
            }
        };

        /**
         * Sorts and renders the table
         * @param {number} colIndex - Column index to sort by
         */
        const sortTable = (colIndex) => {
            let newDir = 1;
            if (currentSortCol === colIndex) {
                newDir = -currentSortDir; // Toggle direction
            }
            currentSortCol = colIndex;
            currentSortDir = newDir;

            // Clear all arrows
            Object.keys(sortArrows).forEach(key => {
                sortArrows[key] = '';
            });

            // Set arrow for current column
            sortArrows[colIndex] = newDir === 1 ? ' ▲' : ' ▼';

            // Perform the actual sort
            currentTopics.sort((a, b) => {
                let valA = a[propNames[colIndex]];
                let valB = b[propNames[colIndex]];

                // Special handling for date columns (indices 2 and 3) - use Unix timestamps
                if (colIndex === 2 || colIndex === 3) {
                    const unixA = valA?.unix || 0;
                    const unixB = valB?.unix || 0;
                    return (unixA - unixB) * newDir;
                }

                // For other columns: accent-insensitive string comparison
                return newDir * collator.compare(valA.toString(), valB.toString());
            });

            scrollContainer.scrollTop = 0;
            renderTable();

            // Update header arrows
            const headers = content.querySelectorAll('div[data-col]');
            headers.forEach(div => {
                const col = parseInt(div.dataset.col);
                const baseText = div.textContent.replace(/[ ▲▼]/g, '');
                div.textContent = baseText + sortArrows[col];
            });
        };

        /**
         * Applies filter to current topics
         */
        const applyFilter = () => {
            const filterValue = content.querySelector('#crg-filter-input').value.trim();

            if (!filterValue) {
                currentTopics = [...originalTopics];
                scrollContainer.scrollTop = 0;
                renderTable();
                updateCounter();
                return;
            }

            const terms = filterValue.split(/\s+/).filter(term => term);
            const advancedFilters = {status: null, rating: null, comment: null, regex: null};
            const termGroups = []; // Array of arrays for grouped OR/AND logic

            terms.forEach(term => {
                if (term.startsWith(':s:')) {
                    advancedFilters.status = term.slice(3).split('|').map(Number);
                } else if (term.startsWith(':r:')) {
                    advancedFilters.rating = term.slice(3).split('|').map(s => {
                        let exclude = false;
                        if (s.startsWith('!')) {
                            exclude = true;
                            s = s.slice(1);
                        }
                        let min = false;
                        if (s.endsWith('+')) {
                            min = true;
                            s = s.slice(0, -1);
                        }
                        const val = parseFloat(s);
                        if (isNaN(val)) return null;
                        return {val, min, exclude};
                    }).filter(obj => obj !== null);
                } else if (term.startsWith(':c:')) {
                    advancedFilters.comment = term.slice(3);
                } else if (term.startsWith(':regex:')) {
                    advancedFilters.regex = term.slice(7);
                } else {
                    // Grouped OR/AND logic: split on | for OR within groups
                    const orTerms = term.includes('|') ? term.split('|') : [term];
                    termGroups.push(orTerms);
                }
            });

            // Refresh markers data and re-enrich topics if advanced filters are used
            if (advancedFilters.status || advancedFilters.rating || advancedFilters.comment) {
                markersCache = JSON.parse(document.getElementById('crg-markers-data')?.textContent || '{}');
                enrichTopicsWithMarkers(currentTopics, markersCache);
            }

            // Filter topics
            currentTopics = originalTopics.filter(topic => {
                // Search in title, subtitle, author (skip subforo for merged lists)
                const searchText = [topic.title, topic.subtitle, topic.author].join(' ');
                let matches = termGroups.every(group =>
                    group.some(term => normalizeText(searchText).includes(normalizeText(term)))
                );

                if (matches && advancedFilters.status) {
                    matches = advancedFilters.status.includes(topic.status);
                }

                if (matches && advancedFilters.rating) {
                    matches = advancedFilters.rating.some(cond => {
                        const matchesCond = cond.min ? topic.rating >= cond.val : topic.rating === cond.val;
                        return cond.exclude ? !matchesCond : matchesCond;
                    });
                }

                if (matches && advancedFilters.comment) {
                    matches = normalizeText(topic.comment).includes(normalizeText(advancedFilters.comment));
                }

                if (matches && advancedFilters.regex) {
                    try {
                        matches = new RegExp(advancedFilters.regex, 'i').test(normalizeText(searchText));
                    } catch (e) {
                        matches = false; // Invalid regex
                    }
                }

                return matches;
            });

            scrollContainer.scrollTop = 0;
            renderTable();
            updateCounter();
        };

        // Add click events to headers
        content.querySelectorAll('div[data-col]').forEach(div => {
            div.addEventListener('click', () => {
                const colIndex = parseInt(div.dataset.col);
                sortTable(colIndex);
            });
        });

        // Add scroll listener for virtual rendering
        scrollContainer.addEventListener('scroll', () => renderTable());

        // Add debounced filter event (300ms delay)
        let filterTimeout = null;
        content.querySelector('#crg-filter-input').addEventListener('input', () => {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(applyFilter, 100);
        });

        // Add reload button event
        content.querySelector('#crg-reload-filter').addEventListener('click', () => {
            const filterValue = content.querySelector('#crg-filter-input').value.trim();
            if (filterValue) saveFilterToHistory(filterValue);
            applyFilter();
        });

        // Add CSV export button event
        content.querySelector('#crg-export-csv').addEventListener('click', () => {
            // Generate filename based on list type
            const isMerged = selectedNames.length > 0;
            let filename;
            if (isMerged) {
                // For merged lists, use first subforum name + count
                const firstName = selectedNames[0]?.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'merged';
                filename = `comicteca_${firstName}_${currentTopics.length}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`;
            } else {
                // For regular lists, extract from navigation
                const navElements = [...document.querySelectorAll('#navstrip a')];
                const pathParts = navElements.slice(2).map(a => a.textContent.trim().replace(/[^a-zA-Z0-9À-ÿ_]/g, '_')).join('_').toLowerCase() || 'subforo';
                filename = `comicteca_${pathParts}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`;
            }

            // Generate and download CSV
            generateCsv(currentTopics, filename);
            showTooltip(`CSV exportado: ${filename}`);
        });

        // Add CSV config button event handler
        content.querySelector('#crg-csv-config').onclick = () => showCsvConfigPanel();

        // Add filter history dropdown
        const historyContainer = content.querySelector('div[style*="margin-left: 8px"]');
        const historyArrow = content.querySelector('#crg-filter-history');
        historyArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            const history = getFilterHistory();
            if (history.length === 0) return;

            // Remove existing dropdown
            const existing = document.getElementById('crg-filter-dropdown');
            if (existing) existing.remove();

            const dropdown = document.createElement('div');
            dropdown.id = 'crg-filter-dropdown';
            dropdown.style.cssText = `
                position: absolute;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 10001;
                max-height: 200px;
                overflow-y: auto;
                min-width: 200px;
                top: 100%;
                left: 0;
            `;

            history.forEach((filter, index) => {
                const item = document.createElement('div');
                item.textContent = filter;
                item.style.cssText = `
                    padding: 6px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                    color: #000;
                `;
                item.onmouseover = () => item.style.background = '#f0f0f0';
                item.onmouseout = () => item.style.background = '';
                item.onclick = () => {
                    content.querySelector('#crg-filter-input').value = filter;
                    dropdown.remove();
                    saveFilterToHistory(filter); // Move to front
                    applyFilter();
                };
                if (index === history.length - 1) item.style.borderBottom = 'none';
                dropdown.appendChild(item);
            });

            historyContainer.appendChild(dropdown);

            const closeDropdown = (e) => {
                if (!dropdown.contains(e.target) && e.target !== historyArrow) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            };
            setTimeout(() => document.addEventListener('click', closeDropdown), 0);
        });

        // Expose refresh function for marker script
        window.refreshListFilter = applyFilter;

        // Auto-focus the filter input
        setTimeout(() => {
            const filterInput = content.querySelector('#crg-filter-input');
            if (filterInput) filterInput.focus();
        }, 100);

        renderTable();
        updateCounter();
    };

    window.updateTopicData = (id, status, rating, comment, tags) => {
        // Update markers data
        const markerEl = document.head.querySelector('#crg-markers-data');
        if (markerEl) {
            const db = JSON.parse(markerEl.textContent || '{}');
            db[id] = window.CRG_Utils.normalize(status, rating, comment);
            markerEl.textContent = JSON.stringify(db);
        }

        // Update topics arrays if popup open
        if (window.crgCurrentTopics && window.crgOriginalTopics) {
            const updateTopic = (topic) => {
                topic.status = status;
                topic.rating = rating;
                topic.comment = comment;
                topic.tags = tags;
            };
            const currentTopic = window.crgCurrentTopics.find(t => t.url.match(/showtopic=(\d+)/)?.[1] === id);
            if (currentTopic) updateTopic(currentTopic);
            const originalTopic = window.crgOriginalTopics.find(t => t.url.match(/showtopic=(\d+)/)?.[1] === id);
            if (originalTopic) updateTopic(originalTopic);
        }

        // Update markers in popup
        const popup = document.getElementById('crg-list-popup');
        if (popup && window.addCRGMarkerToLink) {
            const links = popup.querySelectorAll('#virtual-rows a[href*="showtopic="]');
            links.forEach(link => {
                const linkId = link.href.match(/showtopic=(\d+)/)?.[1];
                if (linkId === id) {
                    window.addCRGMarkerToLink(link);
                }
            });
        }

        // Refresh filter
        if (window.refreshListFilter) window.refreshListFilter();
    };

    // Attach event listener to button
    GM_registerMenuCommand('🎯 Agrupar Listas', showMergePanel);
})();
