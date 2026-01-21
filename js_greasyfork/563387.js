// ==UserScript==
// @name         SharewoodTools
// @namespace    https://greasyfork.org/fr/users/1562868-pablito2776
// @version      1.0
// @description  Boutons .torrent, batch download, historique complet, filtres avancés et mode compact via icône de catégorie
// @author       pablito2776 aka Epic_CarreDas aka frombxwithlove
// @match        https://www.sharewood.tv/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563387/SharewoodTools.user.js
// @updateURL https://update.greasyfork.org/scripts/563387/SharewoodTools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /******************************************************************
     *  CONFIG & STORAGE
     ******************************************************************/

    const CFG_KEY = "swtools_config";

    const defaultConfig = {
        enabled: true,
        batchEnabled: true,
        historyFullEnabled: true
    };

    function loadConfig() {
        try {
            const raw = localStorage.getItem(CFG_KEY);
            if (!raw) return { ...defaultConfig };
            return { ...defaultConfig, ...JSON.parse(raw) };
        } catch (e) {
            return { ...defaultConfig };
        }
    }

    function saveConfig(cfg) {
        localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
    }

    let config = loadConfig();

    /******************************************************************
     *  UTILITAIRES
     ******************************************************************/

    function isHistoryPage() {
        return /\/myhistory$/.test(location.pathname);
    }

    function isUploadHistoryPage() {
        return location.pathname.endsWith("/myuploads");
    }

    function isListPage() {
        // Page d'accueil torrents, tops, etc. (listes classiques)
        return document.querySelectorAll('a[href^="https://www.sharewood.tv/torrents/"]').length > 3;
    }

    function isSearchPage() {
        // Page "La forêt des torrents" (moteur de recherche)
        return location.pathname === "/torrents" && document.querySelector(".form-torrent-search");
    }

    function isGraveyardPage() {
        return location.pathname.startsWith("/graveyard");
    }

    function makeDownloadUrl(torrentUrl) {
        return torrentUrl.replace("/torrents/", "/download/");
    }

    function createSvgIcon() {
        const div = document.createElement("div");
        div.innerHTML = `
<svg width="32" height="32" viewBox="0 0 24 24" style="vertical-align:middle;">
  <circle cx="12" cy="12" r="10" fill="none" stroke="#199e9d" stroke-width="2"/>
  <line x1="12" y1="7" x2="12" y2="15" stroke="#199e9d" stroke-width="2" stroke-linecap="round"/>
  <polyline points="8,11 12,15 16,11" fill="none" stroke="#199e9d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
        return div.firstElementChild;
    }

    function getSharewoodTheme() {
        const isDark = !!document.querySelector('link[href*="css/themes/galactic.css"]');
        return isDark ? "dark" : "light";
    }

    function getOverlayStyle() {
        (function() {
            const checkboxStyle = document.createElement("style");
            checkboxStyle.textContent = `
    .swtools-select {
        appearance: none;
        -webkit-appearance: none;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        margin: 0;
        padding: 0;
        border: 2px solid #888;
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
        display: inline-block;
        position: relative;
        vertical-align: middle;
    }

    .swtools-select:checked {
        background: #199e9d;
        border-color: #199e9d;
    }

    .swtools-select:indeterminate {
        background: transparent;
        border-color: #888;
    }
`;
            document.head.appendChild(checkboxStyle);
        })();

        const theme = getSharewoodTheme();

        if (theme === "light") {
            return `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            color: #222;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 6px;
            z-index: 999999;
            width: 420px;
        `;
        }

        // Thème sombre (style actuel)
        return `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: #1c1f26;
        color: #ddd;
        padding: 20px;
        border: 1px solid #444;
        border-radius: 6px;
        z-index: 999999;
        width: 420px;
    `;
    }

    /******************************************************************
     *  PATCH : Cases à cocher uniformes
     ******************************************************************/
    (function() {
        const style = document.createElement("style");
        style.textContent = `
        /* Neutralise les styles Sharewood/Bootstrap */
        input.swtools-select,
        input.swtools-select::before,
        input.swtools-select::after {
            all: unset !important;
        }

        /* Style uniforme */
        input.swtools-select {
            appearance: none !important;
            -webkit-appearance: none !important;

            width: 16px !important;
            height: 16px !important;

            /* Empêche les cases de s'étirer */
            min-width: 16px !important;
            min-height: 16px !important;
            max-width: 16px !important;
            max-height: 16px !important;

            /* Neutralise les héritages problématiques */
            line-height: 0 !important;
            font-size: 0 !important;
            padding: 0 !important;
            margin: 0 0 0 0 !important;

            border: 2px solid #888 !important;
            border-radius: 4px !important;
            background: transparent !important;
            cursor: pointer !important;

            display: inline-block !important;
            box-sizing: border-box !important;
            vertical-align: middle !important;
        }

        input.swtools-select:checked {
            background: #199e9d !important;
            border-color: #199e9d !important;
        }

        input.swtools-select:indeterminate {
            background: transparent !important;
            border-color: #888 !important;
        }
    `;
        document.head.appendChild(style);
    })();

    /******************************************************************
     *  OVERLAY FLOU + ASSOMBRI
     ******************************************************************/

    function createOverlay() {
        if (document.getElementById("swtools-overlay")) return;
        const overlay = document.createElement("div");
        overlay.id = "swtools-overlay";
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.35);
            backdrop-filter: blur(3px);
            z-index: 999998;
        `;
        document.body.appendChild(overlay);
    }

    function removeOverlay() {
        const overlay = document.getElementById("swtools-overlay");
        if (overlay) overlay.remove();
    }

    /******************************************************************
     *  MODE COMPACT : ICÔNE DE CATÉGORIE → ICÔNE DE TÉLÉCHARGEMENT
     ******************************************************************/

    function enhanceCategoryIcons() {
        if (!config.enabled) return;

        // Couvre accueil, recherche, cimetière, tops, signets, etc.
        const icons = document.querySelectorAll(
            '.torrent-icon, .torrent-icon-search, .torrent-icon-graveyard, .torrent-icon-cemetery, img[src*="/img/categories/"]'
        );

        icons.forEach(icon => {
            if (icon.dataset.swtoolsEnhanced) return;
            icon.dataset.swtoolsEnhanced = "1";

            const parent = icon.parentElement;
            if (!parent) return;

            // Couvre les différents types de lignes (accueil, listes, recherche, cimetière)
            const row = parent.closest(".row, .table-responsive-line, tr");
            if (!row) return;

            const link = row.querySelector('a[href^="https://www.sharewood.tv/torrents/"]');
            if (!link) return;

            const dlUrl = makeDownloadUrl(link.href);

            const wrapper = document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.style.display = "inline-block";

            icon.replaceWith(wrapper);
            wrapper.appendChild(icon);

            const overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.background = "rgba(0,0,0,0.0)";
            overlay.style.opacity = "0";
            overlay.style.transition = "opacity 0.2s ease";
            overlay.style.cursor = "pointer";

            const svg = createSvgIcon();
            svg.style.transform = "scale(0.8)";
            overlay.appendChild(svg);

            wrapper.appendChild(overlay);

            wrapper.addEventListener("mouseenter", () => {
                icon.style.opacity = "0";
                overlay.style.opacity = "1";
            });

            wrapper.addEventListener("mouseleave", () => {
                icon.style.opacity = "1";
                overlay.style.opacity = "0";
            });

            overlay.addEventListener("click", () => {
                const name = (link.textContent || "torrent").trim().replace(/[\\/:*?"<>|]+/g, "_") + ".torrent";
                GM_download({ url: dlUrl, name });
            });
        });
    }

    // Observer pour réappliquer le mode compact quand le DOM change
    let swtoolsCategoryObserver = null;

    function setupCategoryIconsObserver() {
        if (swtoolsCategoryObserver || !document.body) return;

        swtoolsCategoryObserver = new MutationObserver(() => {
            enhanceCategoryIcons();
        });

        swtoolsCategoryObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /******************************************************************
     *  AJOUT D’UNE ICÔNE DANS L’HISTORIQUE (PAS D’ICÔNE DE CATÉGORIE)
     ******************************************************************/

    function enhanceHistoryTable() {
        if (!config.enabled || !isHistoryPage()) return;

        const rows = document.querySelectorAll("table tbody tr");
        if (!rows.length) return;

        rows.forEach(row => {
            if (row.dataset.swtoolsHistoryEnhanced) return;
            row.dataset.swtoolsHistoryEnhanced = "1";

            const link = row.querySelector("a.view-torrent");
            if (!link) return;

            const dlUrl = makeDownloadUrl(link.href);

            const td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.verticalAlign = "middle";

            const icon = createSvgIcon();
            icon.style.cursor = "pointer";
            icon.style.opacity = "0.8";
            icon.style.transition = "opacity 0.2s ease";

            icon.addEventListener("mouseenter", () => icon.style.opacity = "1");
            icon.addEventListener("mouseleave", () => icon.style.opacity = "0.8");

            icon.addEventListener("click", () => {
                const name = (link.textContent || "torrent").trim().replace(/[\\/:*?"<>|]+/g, "_") + ".torrent";
                GM_download({ url: dlUrl, name });
            });

            td.appendChild(icon);
            row.insertBefore(td, row.firstElementChild);
        });
    }

    function fixHistoryHeader() {
        if (!isHistoryPage()) return;

        const thead = document.querySelector("table thead tr");
        if (!thead) return;

        if (thead.dataset.swtoolsHeaderFixed) return;
        thead.dataset.swtoolsHeaderFixed = "1";

        const th = document.createElement("th");
        th.style.width = "40px";
        th.style.textAlign = "center";

        thead.insertBefore(th, thead.firstElementChild);
    }

    /******************************************************************
     *  FILTRAGE AVANCÉ DE L’HISTORIQUE + SÉLECTION
     ******************************************************************/

    async function fetchHistoryPage(url) {
        const res = await fetch(url, { credentials: "include" });
        const text = await res.text();
        return new DOMParser().parseFromString(text, "text/html");
    }

    async function getAllHistoryData() {
        const baseUrl = location.href.split("?")[0];

        const firstDoc = await fetchHistoryPage(baseUrl);
        const pages = firstDoc.querySelectorAll("li.page-item");
        let totalPages = 1;

        if (pages.length > 1) {
            const last = pages[pages.length - 2];
            totalPages = parseInt(last.textContent.trim(), 10) || 1;
        }

        const allData = [];

        for (let p = 1; p <= totalPages; p++) {
            const url = `${baseUrl}?page=${p}`;
            const doc = p === 1 ? firstDoc : await fetchHistoryPage(url);

            const rows = [...doc.querySelectorAll("table tbody tr")];

            rows.forEach(row => {
                const link = row.querySelector("a.view-torrent");
                if (!link) return;

                const actif = row.querySelector("td:nth-child(2)")?.textContent.trim() === "Oui";

                const seedSpan = row.querySelector("td:nth-child(6) span");
                const seedText = seedSpan?.textContent.trim() || null;

                const seedColor =
                    seedSpan?.classList.contains("text-red") ? "red" :
                    seedSpan?.classList.contains("text-green") ? "green" :
                    null;

                allData.push({
                    row,
                    link,
                    actif,
                    seedText,
                    seedColor,
                    name: link.textContent.trim()
                });
            });
        }

        return allData;
    }

    function filterHistoryRows(data, options) {
        return data.filter(item => {
            if (options.inactiveOnly && item.actif) return false;

            if (options.seedUnder7Days) {
                if (item.seedText === "N/A") return false;
                if (item.seedColor === "red") return true;
                if (item.seedColor === "green") return false;
                return false;
            }

            return true;
        });
    }

    function openHistoryFilterDialog(allRows) {
        createOverlay();

        const dialog = document.createElement("div");
        dialog.style = getOverlayStyle();

        dialog.innerHTML = `
        <h3 style="margin-top:0;">Filtres avancés</h3>

        <div id="swtools-filters" style="margin-bottom:15px; display:flex; gap:10px; flex-wrap:wrap;">
            <div class="swtools-pill" data-filter="inactive">
                Inactifs Seulement
            </div>
            <div class="swtools-pill" data-filter="seed7">
                Seedtime &lt; 7 jours
            </div>
        </div>

        <button id="swtools-apply-filters" class="btn btn-success">Appliquer les filtres</button>
        <button id="swtools-cancel-filters" class="btn btn-danger" style="margin-left:10px;">Annuler</button>
    `;

        document.body.appendChild(dialog);

        const style = document.createElement("style");
        style.textContent = `
        .swtools-pill {
           padding: 4px 10px;
           font-size: 12px;
           border-radius: 14px;
           border: 1px solid #199e9d;
           color: #199e9d;
           cursor: pointer;
           user-select: none;
           transition: all 0.2s ease;
        }
        .swtools-pill.active {
           background: #199e9d;
           color: #fff;
           box-shadow: 0 0 4px #199e9d;
        }
        .swtools-pill:hover {
            opacity: 0.8;
        }
    `;
        document.head.appendChild(style);

        const pills = dialog.querySelectorAll(".swtools-pill");
        const options = { inactiveOnly: false, seedUnder7Days: false };

        pills.forEach(pill => {
            pill.addEventListener("click", () => {
                pill.classList.toggle("active");

                if (pill.dataset.filter === "inactive")
                    options.inactiveOnly = pill.classList.contains("active");

                if (pill.dataset.filter === "seed7")
                    options.seedUnder7Days = pill.classList.contains("active");
            });
        });

        dialog.querySelector("#swtools-cancel-filters").onclick = () => {
            dialog.remove();
            removeOverlay();
        };

        dialog.querySelector("#swtools-apply-filters").onclick = () => {
            const filtered = filterHistoryRows(allRows, options);
dialog.remove();

if (filtered.length === 0) {
    openNoTorrentsDialog();
    return;
}

openHistorySelectionDialog(filtered);
        };
    }

    function openNoTorrentsDialog() {
    createOverlay();

    const dialog = document.createElement("div");
    dialog.style = getOverlayStyle();
    dialog.style.width = "500px";
    dialog.style.textAlign = "center";

    dialog.innerHTML = `
        <h3 style="margin-top:0;">Aucun torrent disponible</h3>
        <p style="margin: 15px 0; font-size:14px; color:#aaa;">
            Il n'y a aucun torrent à télécharger.
        </p>
        <button id="swtools-no-torrents-close" class="btn btn-primary" style="width:100%;">Fermer</button>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector("#swtools-no-torrents-close").onclick = () => {
        dialog.remove();
        removeOverlay();
    };
}

    function openHistorySelectionDialog(rows) {
        createOverlay();

        const dialog = document.createElement("div");
        dialog.style = getOverlayStyle();
        dialog.style.width = "800px";
        dialog.style.height = "500px";
        dialog.style.display = "flex";
        dialog.style.flexDirection = "column";
        // Ajustement dynamique pour les listes courtes (ex: signets)
        if (rows.length <= 6) {
            dialog.style.height = "auto";
            dialog.style.maxHeight = "500px";
        }
        let html = `<h3 id="swtools-selection-title" style="margin-top:0;">
                    Sélection des torrents (${rows.length})
                </h3>`;

        html += `<div class="swtools-scrollbox" style="flex:1; overflow:auto; margin-bottom:10px;">`;

        rows.forEach((item, i) => {
            const link = item.link;
            const actif = item.actif ? "Oui" : "Non";
            const seed = item.seedText;

            html += `
    <div style="margin-bottom:10px;">
        <div style="display:flex; gap:10px; align-items:flex-start;">
            <input type="checkbox" class="swtools-select" data-index="${i}" checked>
            <div>
                <div style="font-weight:bold;">${link.textContent.trim()}</div>
                ${item.row ? `
    <div style="font-size:12px; color:#aaa;">
        Actif: ${actif} — Seed: ${seed}
    </div>
` : ""}
            </div>
        </div>
    </div>
`;
        });

        html += `</div>`;

        html += `
    <div style="
        margin-top:auto;
        display:flex;
        gap:10px;
        width:100%;
    ">
        <button id="swtools-download-selected" class="btn btn-success" style="flex:1;">Télécharger la sélection</button>
        <button id="swtools-cancel-selection" class="btn btn-danger" style="flex:1;">Annuler</button>
    </div>
`;

        dialog.innerHTML = html;
        document.body.appendChild(dialog);

        const scrollBox = dialog.querySelector(".swtools-scrollbox");
        if (scrollBox) {
            scrollBox.addEventListener("wheel", (e) => e.stopPropagation());
        }

        const titleEl = dialog.querySelector("#swtools-selection-title");
        const checkboxes = dialog.querySelectorAll(".swtools-select");
        const downloadBtn = dialog.querySelector("#swtools-download-selected");

        function updateCount() {
            const count = [...checkboxes].filter(cb => cb.checked).length;
            titleEl.textContent = `Sélection des torrents (${count})`;

            // Désactivation du bouton si aucune case cochée
            if (count === 0) {
                downloadBtn.disabled = true;
                downloadBtn.style.opacity = "0.5";
                downloadBtn.style.cursor = "not-allowed";
            } else {
                downloadBtn.disabled = false;
                downloadBtn.style.opacity = "1";
                downloadBtn.style.cursor = "pointer";
            }
        }

        checkboxes.forEach(cb => {
            cb.addEventListener("change", updateCount);
        });

        dialog.querySelector("#swtools-cancel-selection").onclick = () => {
            dialog.remove();
            removeOverlay();
        };

        dialog.querySelector("#swtools-download-selected").onclick = () => {
            const selected = [...checkboxes]
                .filter(cb => cb.checked)
                .map(cb => rows[cb.dataset.index]);

            dialog.remove();
            removeOverlay();
            downloadSelectedHistory(selected);
        };
    }

    function downloadSelectedHistory(rows) {
        let index = 0;

        function next() {
            if (index >= rows.length) return;

            const item = rows[index++];
            const link = item.link;
            const dlUrl = makeDownloadUrl(link.href);
            const name = link.textContent.trim().replace(/[\\/:*?"<>|]+/g, "_") + ".torrent";

            GM_download({
                url: dlUrl,
                name,
                onload: next,
                onerror: next
            });
        }

        next();
    }

    /******************************************************************
     *  BATCH DOWNLOAD (LISTES + RECHERCHE)
     ******************************************************************/

    function getTorrentLinksOnPage() {
        // Cas particulier : page des signets
        if (location.pathname.startsWith("/bookmarks")) {
            return [
                ...document.querySelectorAll(
                    'table.table.responsive tbody tr a.view-torrent'
                )
            ];
        }

        // Comportement par défaut pour les autres pages
        return [
            ...document.querySelectorAll(
                'a[href^="https://www.sharewood.tv/torrents/"]'
            )
        ];
    }

    function addBatchButton() {
        if (!config.enabled || !config.batchEnabled) return;
        if (isHistoryPage()) return;

        const isBookmarksPage = location.pathname.startsWith("/bookmarks");

        if (
            !isListPage() &&
            !isSearchPage() &&
            !isGraveyardPage() &&
            !isBookmarksPage
        ) return;

        if (document.getElementById("swtools-batch-btn")) return;

        const btn = document.createElement("button");
        btn.id = "swtools-batch-btn";
        btn.className = "btn btn-primary";
        btn.textContent = "Tout télécharger";

        btn.addEventListener("click", openBatchDialog);

        if (isSearchPage()) {
            const filterGroup = document.querySelector("#table-top .form-group");
            if (filterGroup) {
                const wrapper = document.createElement("div");
                wrapper.style.position = "absolute";
                wrapper.style.left = "-510px";
                wrapper.style.top = "10px";
                wrapper.style.height = "100%";
                wrapper.style.display = "flex";
                wrapper.style.alignItems = "center";
                wrapper.style.zIndex = "10";

                wrapper.appendChild(btn);

                filterGroup.style.position = "relative";
                filterGroup.insertBefore(wrapper, filterGroup.firstChild);

                return;
            }
        }

        if (isBookmarksPage) {
            const bookmarksTitle = document.querySelector("h1.title");
            if (bookmarksTitle && bookmarksTitle.parentElement) {
                const container = document.createElement("div");
                container.style.margin = "10px 0 5px 0";
                bookmarksTitle.parentElement.insertBefore(container, bookmarksTitle.nextSibling);
                container.appendChild(btn);
                return;
            }
        }

        const title = document.querySelector(".titre_section");
        if (title && title.parentElement) {
            const container = document.createElement("div");
            container.style.margin = "10px 0 5px 0";
            title.parentElement.insertBefore(container, title.nextSibling);
            container.appendChild(btn);
            return;
        }
    }

    function openBatchDialog() {
        const links = getTorrentLinksOnPage();
        if (links.length === 0) {
    openNoTorrentsDialog();
    return;
}
        if (!links.length) return;

        const loading = document.getElementById("swtools-loading");
        if (loading) loading.remove();

        removeOverlay();

        openHistorySelectionDialog(
            links.map(a => ({
                link: a,
                actif: false,
                seedText: "N/A",
                seedColor: null
            }))
        );
    }

    function batchDownloadSilent(links) {
        let index = 0;

        function next() {
            if (index >= links.length) return;

            const a = links[index++];
            const dl = makeDownloadUrl(a.href);
            const name = (a.textContent || ("torrent_" + index)).trim().replace(/[\\/:*?"<>|]+/g, "_") + ".torrent";

            GM_download({
                url: dl,
                name,
                onload: next,
                onerror: next
            });
        }

        next();
    }

    /******************************************************************
     *  TÉLÉCHARGEMENT COMPLET DE L’HISTORIQUE
     ******************************************************************/

    async function getHistoryPagesCount(baseUrl) {
        const doc = await fetchHistoryPage(baseUrl);
        const pages = doc.querySelectorAll("li.page-item");
        if (!pages.length) return 1;
        const last = pages[pages.length - 2];
        const n = parseInt(last.textContent.trim(), 10);
        return isNaN(n) ? 1 : n;
    }

    async function getAllHistoryTorrentLinks(baseUrl) {
        const totalPages = await getHistoryPagesCount(baseUrl);
        const allLinks = [];

        for (let p = 1; p <= totalPages; p++) {
            const url = `${baseUrl}?page=${p}`;
            const doc = await fetchHistoryPage(url);
            const links = [...doc.querySelectorAll("a.view-torrent")];
            allLinks.push(...links);
        }

        return allLinks;
    }

    function addFullHistoryButton() {
        if (!config.enabled || !config.historyFullEnabled) return;
        if (!isHistoryPage()) return;
        if (document.getElementById("swtools-history-full-btn")) return;

        const btn = document.createElement("button");
        btn.id = "swtools-history-full-btn";
        btn.className = "btn btn-primary";
        btn.textContent = "Télécharger tout l'historique";
        btn.style.margin = "10px 0";

        const title = document.querySelector(".titre_section");
        if (title && title.parentElement) {
            title.parentElement.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }

        btn.addEventListener("click", async () => {
            const loading = document.createElement("div");
            loading.id = "swtools-loading";
            loading.textContent = "Analyse de l'historique en cours...";
            loading.style = getOverlayStyle();
            document.body.appendChild(loading);

            const data = await getAllHistoryData();
            if (data.length === 0) {
    loading.remove();
    openNoTorrentsDialog();
    return;
}

            loading.remove();

            openHistoryFilterDialog(data);
        });
    }

    function addFullUploadHistoryButton() {
    if (!config.enabled) return;
    if (!isUploadHistoryPage()) return;
    if (document.getElementById("swtools-upload-history-btn")) return;

    const btn = document.createElement("button");
    btn.id = "swtools-upload-history-btn";
    btn.className = "btn btn-primary";
    btn.textContent = "Télécharger tout l'historique";
    btn.style.margin = "10px 0";

    const title = document.querySelector(".titre_section");
    if (title && title.parentElement) {
        title.parentElement.appendChild(btn);
    } else {
        document.body.appendChild(btn);
    }

    btn.addEventListener("click", () => {
        const links = [
            ...document.querySelectorAll("a.view-torrent")
        ];

        removeOverlay();

        if (links.length === 0) {
    openNoTorrentsDialog();
    return;
}

openHistorySelectionDialog(
    links.map(a => ({
        link: a,
        actif: false,
        seedText: "N/A",
        seedColor: null
    }))
);
    });
}

    function downloadHistorySilent(links, progressEl, done) {
        let index = 0;
        const total = links.length;

        function next() {
            if (index >= total) {
                done();
                return;
            }
            const a = links[index++];
            const dl = makeDownloadUrl(a.href);
            const name = (a.textContent || ("torrent_" + index)).trim().replace(/[\\/:*?"<>|]+/g, "_") + ".torrent";

            if (progressEl) {
                progressEl.textContent = `Téléchargement ${index}/${total} : ${name}`;
            }

            GM_download({
                url: dl,
                name,
                onload: next,
                onerror: next
            });
        }

        next();
    }

    /******************************************************************
     *  HISTORIQUE D’UPLOADS — BOUTON + ICÔNES DE TÉLÉCHARGEMENT
     ******************************************************************/

    function enhanceUploadHistoryTable() {
        if (!config.enabled || !isUploadHistoryPage()) return;

        const rows = document.querySelectorAll("table tbody tr");
        if (!rows.length) return;

        rows.forEach(row => {
            if (row.dataset.swtoolsUploadEnhanced) return;
            row.dataset.swtoolsUploadEnhanced = "1";

            const link = row.querySelector("a.view-torrent");
            if (!link) return;

            const dlUrl = makeDownloadUrl(link.href);

            const td = document.createElement("td");
            td.style.textAlign = "center";
            td.style.verticalAlign = "middle";

            const icon = createSvgIcon();
            icon.style.cursor = "pointer";
            icon.style.opacity = "0.8";
            icon.style.transition = "opacity 0.2s ease";

            icon.addEventListener("mouseenter", () => icon.style.opacity = "1");
            icon.addEventListener("mouseleave", () => icon.style.opacity = "0.8");

            icon.addEventListener("click", () => {
                const name = (link.textContent || "torrent")
                    .trim()
                    .replace(/[\\/:*?"<>|]+/g, "_") + ".torrent";
                GM_download({ url: dlUrl, name });
            });

            td.appendChild(icon);
            row.insertBefore(td, row.firstElementChild);
        });
    }

    /******************************************************************
     *  INITIALISATION
     ******************************************************************/

    function init() {
    if (!config.enabled) return;

    enhanceCategoryIcons();
    setupCategoryIconsObserver();
    enhanceHistoryTable();
    fixHistoryHeader();
    addBatchButton();
    addFullHistoryButton();
    addFullUploadHistoryButton();
    enhanceUploadHistoryTable();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

})()