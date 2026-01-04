// ==UserScript==
// @name         CRG Export CSV
// @namespace    http://lamansion-crg.net
// @version      0.0.6
// @description  Exporta Comictecas a CSV
// @author       Pinocchio
// @match        *://lamansion-crg.net/forum/index.php?showforum=*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557651/CRG%20Export%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/557651/CRG%20Export%20CSV.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ===== CONSTANTS =====
    const CONFIG_KEY = 'CRG_Exporter_Config_v5';
    const ALLOWED_FORUM_IDS = ['76', '81'];
    const TOPICS_PER_PAGE = 30;
    const MONTH_MAP = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };

    const DEFAULT_COLUMNS = [
        { key: 'id', label: 'ID', enabled: true },
        { key: 'title', label: 'Título', enabled: true },
        { key: 'subtitle', label: 'Subtítulo', enabled: true },
        { key: 'author', label: 'Autor', enabled: true },
        { key: 'date', label: 'Fecha', enabled: true },
        { key: 'subforo', label: 'Subforo', enabled: true },
        { key: 'url', label: 'URL', enabled: true },
        { key: 'status', label: 'Marcador', enabled: true },
        { key: 'rating', label: 'Valoración', enabled: false }
    ];

    // ===== UTILITY FUNCTIONS =====
    /**
     * Creates and shows a temporary tooltip with the given message
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
        tooltip.style.cssText = "position:fixed;top:10px;right:10px;background:#007bff;color:#fff;padding:8px 16px;border-radius:4px;font-size:14px;z-index:10000;";
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
     * Parses date string into YYYY/MM/DD format
     * @param {string} dateRaw - Raw date string
     * @returns {string} - Formatted date string
     */
    const parseDate = (dateRaw) => {
        const dateMatch = dateRaw.match(/(\w{3}) (\d{1,2}) (\d{4})/) || dateRaw.match(/(\d{1,2}) (\w{3}) (\d{4})/);
        if (!dateMatch) return dateRaw;

        const m = dateMatch[1] in MONTH_MAP ? dateMatch[1] : dateMatch[2];
        const month = MONTH_MAP[m] || '01';
        const day = dateMatch[2].padStart(2, '0');
        const year = dateMatch[3] || dateMatch[1];
        return `${year}/${month}/${day}`;
    };

    // ===== MAIN INITIALIZATION =====

    // Check if we're in a valid forum
    const navigationElements = [...document.querySelectorAll('#navstrip a')];
    if (navigationElements.length < 1) return;
    const mainForumId = navigationElements[1]?.href.match(/showforum=(\d+)/)?.[1];
    if (!ALLOWED_FORUM_IDS.includes(mainForumId)) return;

    let columns = GM_getValue(CONFIG_KEY, DEFAULT_COLUMNS.map(c => ({ ...c })));

    // Migrate config
    const estadoCol = columns.find(c => c.key === 'estado');
    if (estadoCol) {
      estadoCol.key = 'status';
      if (!columns.find(c => c.key === 'rating')) {
        columns.push({ key: 'rating', label: 'Valoración', enabled: true });
        saveConfig();
      }
    }

    /**
     * Saves the current column configuration to storage
     */
    const saveConfig = () => GM_setValue(CONFIG_KEY, columns);

    // ===== EXPORT HELPERS =====

    /**
     * Loads the markers database from the page
     * @returns {Object} - The markers database object
     */
    const loadMarkersDb = () => {
        let markersDb = {};
        const markerEl = document.head.querySelector('script[id="crg-markers-data"]');
        if (markerEl) {
            try {
                markersDb = JSON.parse(markerEl.textContent || '{}');
            } catch (e) {
                console.warn('Error parsing marker data:', e);
            }
        }
        return markersDb;
    };

    /**
     * Gets the list of page URLs to scrape based on pagination links
     * @param {string} baseUrl - The base forum URL
     * @returns {string[]} - Array of page URLs
     */
    const getPageUrls = (baseUrl) => {
        let maxSt = 0;
        document.querySelectorAll('a[href*="&st="]').forEach(a => {
            const m = a.href.match(/&st=(\d+)/);
            if (m) maxSt = Math.max(maxSt, +m[1]);
        });
    
        // Include current page's st value to account for the last page case
        const currentStMatch = location.href.match(/&st=(\d+)/);
        if (currentStMatch) {
            maxSt = Math.max(maxSt, +currentStMatch[1]);
        }
    
        const pages = [];
        for (let st = 0; st <= maxSt; st += TOPICS_PER_PAGE) {
            pages.push(`${baseUrl}&st=${st}`);
        }
        return pages;
    };

    /**
     * Fetches and parses a forum page using browser fetch API with correct Latin-1 decoding
     * @param {string} url - The URL to fetch
     * @returns {Document|null} - The parsed document or null on error
     */
    const fetchPageDocument = async (url) => {
        console.log(`[CRG Export] Fetching page: ${url}`);
        try {
            const response = await fetch(url, { credentials: 'same-origin' });
            if (!response.ok) {
                console.warn(`[CRG Export] HTTP error: ${response.status} - ${url}`);
                return null;
            }
    
            // Get raw bytes and decode as ISO-8859-1 (Latin-1)
            const buffer = await response.arrayBuffer();
            const html = new TextDecoder('iso-8859-1').decode(buffer);
    
            const doc = new DOMParser().parseFromString(html, 'text/html');
            if (!doc || !doc.body) {
                console.warn('[CRG Export] Failed to parse document body');
                return null;
            }
    
            return doc;
        } catch (error) {
            console.error('[CRG Export] Fetch error:', error);
            return null;
        }
    };

    /**
     * Extracts topic data from a forum page document
     * @param {Document} doc - The parsed HTML document
     * @param {Object} markersDb - The markers database
     * @param {string} prefix - The forum prefix
     * @param {string} subforumName - The subforum name
     * @returns {Object[]} - Array of topic objects
     */
    const parseTopicsFromDocument = (doc, markersDb, prefix, subforumName) => {
        const topics = [];

        doc.querySelectorAll('a[id^="tid-link-"]').forEach(link => {
            const row = link.closest('tr');
            if (!row || row.querySelector('img[src*="f_pinned"]')) return;

            const id = link.href.match(/showtopic=(\d+)/)?.[1];
            if (!id) return;

            const rawTitle = link.textContent || '';
            const rawSubtitle = row.querySelector('.desc span')?.textContent || '';
            const authorCell = row.cells[4];
            const rawAuthor = authorCell?.querySelector('a')?.textContent || '';
            const rawDate = authorCell?.querySelector('span[style*="color:#666"], span')?.textContent || '';

            // Process and clean data
            const title = cleanText(rawTitle);
            const subtitle = cleanText(rawSubtitle);
            const author = rawAuthor;
            const date = parseDate(rawDate.trim());

            const markStr = markersDb[id] || '';
            const [statusStr, ratingStr] = markStr.split(':');

            topics.push({
                id,
                title,
                subtitle,
                author,
                date,
                url: link.href,
                subforo: prefix + subforumName,
                status: statusStr || '',
                rating: ratingStr || ''
            });
        });

        return topics;
    };

    /**
     * Generates and downloads the CSV file
     * @param {Object[]} allTopics - Array of all topic objects
     * @param {string} filename - The filename for download
     */
    const generateCSV = (allTopics, filename) => {
        const activeCols = columns.filter(c => c.enabled);
        const header = activeCols.map(c => c.label).join(',');
        const rows = allTopics.map(t => {
            return activeCols.map(col => {
                let val = t[col.key] || '';
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

    // === PANEL CONFIG ===
    const openConfigPanel = () => {
        if (document.getElementById('crg-csv-config-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'crg-csv-config-panel';
        panel.innerHTML = `
        <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;background:#fff;color:#000;border:1px solid #000;z-index:99999;">
          <div style="background:#0066cc;color:#fff;padding:8px;font-weight:bold;font-size:14px;text-align:center;">
            Configuración de las columnas
          </div>
          <div style="padding:16px;">
            <div style="margin-bottom:10px;font-size:13px;">
              Arrastra las filas para cambiar el orden · Haz clic en la casilla para activar/desactivar
            </div>
            <div id="crg-columns-list" style="max-height:300px;overflow-y:auto;border:1px solid #ccc;padding:8px;background:#f9f9f9;"></div>
            <div style="text-align:right;margin-top:12px;">
              <button id="crg-save-panel" style="padding:8px 16px;background:#0066cc;color:white;border:none;cursor:pointer;">Guardar</button>
              <button id="crg-cancel-panel" style="padding:8px 16px;background:#cc0000;color:white;border:none;cursor:pointer;margin-left:4px;">Cancelar</button>
            </div>
          </div>
        </div>
      `;
        document.body.appendChild(panel);

        const list = panel.querySelector('#crg-columns-list');

        const render = () => {
            list.innerHTML = '';
            columns.forEach((col, idx) => {
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
                    columns[idx].enabled = !columns[idx].enabled;
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
                    const [moved] = columns.splice(from, 1);
                    columns.splice(to, 0, moved);
                    render();
                });

                list.appendChild(row);
            });
        };
        render();

        panel.querySelector('#crg-save-panel').onclick = () => {
            saveConfig();
            panel.remove();
        };
        panel.querySelector('#crg-cancel-panel').onclick = () => panel.remove();
    };

    /**
     * Main export function - orchestrates the entire CSV export process
     */
    const doExport = async () => {
        // Validate we're in a forum page
        if (!/showforum=\d+/.test(location.href)) {
            console.warn('Export cancelled: Not in a subforum');
            return showTooltip('Entra en un subforo de COMPLETOS');
        }
    
        // Prepare forum metadata
        const markersDb = loadMarkersDb();
        const baseUrl = location.href.split('&st=')[0].replace(/&.*$/, '');
        const navElements = [...document.querySelectorAll('#navstrip a')];
        const isCompletos = navElements[1]?.href.match(/showforum=(\d+)/)?.[1] === ALLOWED_FORUM_IDS[1];
        const subforumName = navElements.slice(2).map(a =>
            a.textContent.trim().replace(/"/g, '').replace(/[^a-zA-Z0-9À-ÿ]+/g, '_')
        ).join('_').toLowerCase() || 'completos';
        const prefix = 'comicteca' + (isCompletos ? '_completos' : '') + '_';
    
        // Get all pages to scrape
        const pageUrls = getPageUrls(baseUrl);
    
        // Debounce tooltip updates (avoid updating too frequently)
        let lastTooltipUpdate = 0;
        const updateProgress = (current, total) => {
            const now = Date.now();
            if (now - lastTooltipUpdate >= 400) { // ~2–3 updates per second max
                showTooltip(`Procesando página ${current}/${total}…`, true);
                lastTooltipUpdate = now;
            }
        };
    
        // Immediate feedback that something started
        showTooltip(`Iniciando exportación… (0/${pageUrls.length})`, true);
    
        // Process each page and collect topics
        const allTopics = [];
        for (let i = 0; i < pageUrls.length; i++) {
            const pageUrl = pageUrls[i];
    
            // Update progress (debounced)
            updateProgress(i + 1, pageUrls.length);
    
            try {
                const doc = await fetchPageDocument(pageUrl);
                if (!doc) {
                    console.warn(`Failed to fetch page: ${pageUrl}`);
                    continue;
                }
                const topics = parseTopicsFromDocument(doc, markersDb, prefix, subforumName);
                allTopics.push(...topics);
            } catch (error) {
                console.warn(`Error processing page ${pageUrl}:`, error);
            }
        }
    
        // Generate and download CSV
        const filename = `${prefix}${subforumName}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`;
        generateCSV(allTopics, filename);
    
        showTooltip('Exportación completada');
    };

    // === MENÚ Y BOTÓN ===
    GM_registerMenuCommand('Exportar CSV', doExport);
    GM_registerMenuCommand('Configuración de columnas', openConfigPanel);
    GM_registerMenuCommand('Restaurar configuración por defecto', () => {
        columns = DEFAULT_COLUMNS.map(c => ({ ...c }));
        saveConfig();
        showTooltip('Restaurado');
    });
})();
