// ==UserScript==
// @name         Google Media Links (Cine/Series/Anime) - Multi-Language
// @version      2.0
// @description  Añade enlaces de búsqueda para películas, series y anime en Google. Soporta ES, EN, PT, RU. Detecta Stremio y sitios personalizados.
// @author       Adaptado
// @license      MIT
// @match        https://www.google.com/search*
// @match        https://www.google.es/search*
// @match        https://www.google.co.uk/search*
// @match        https://www.google.ca/search*
// @match        https://www.google.com.mx/search*
// @match        https://www.google.com.ar/search*
// @match        https://www.google.cl/search*
// @match        https://www.google.co.ve/search*
// @match        https://www.google.com.co/search*
// @match        https://www.google.com.pe/search*
// @match        https://www.google.com.br/search*
// @match        https://www.google.pt/search*
// @match        https://www.google.ru/search*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @namespace https://greasyfork.org/users/1243768
// @downloadURL https://update.greasyfork.org/scripts/559763/Google%20Media%20Links%20%28CineSeriesAnime%29%20-%20Multi-Language.user.js
// @updateURL https://update.greasyfork.org/scripts/559763/Google%20Media%20Links%20%28CineSeriesAnime%29%20-%20Multi-Language.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Claves Globales ---
    // Cambiamos la key para forzar la actualización de tu nueva lista de enlaces
    const SITES_CONFIG_KEY = 'google_media_sites_config_v3_multilang';
    const SETTINGS_SHORTCUT_ENABLED_KEY = 'media_show_settings_shortcut';
    const GAME_FORMATTING_ENABLED_KEY = 'media_formatting_enabled';
    const DEFAULT_SETTINGS_SHORTCUT_ENABLED = true;
    const DEFAULT_GAME_FORMATTING_ENABLED = false;

    // --- Helper para iconos ---
    const getFavicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    // --- NUEVA CONFIGURACIÓN (Tu orden solicitado) ---
    const defaultSiteConfigs = [
        { id: "stremioapp", name: "Stremio App", tooltip: "Abrir en App de Escritorio", icon: getFavicon("stremio.com"), urlTemplate: "stremio://search?query={title}", defaultEnabled: true },
        { id: "stremioweb", name: "Stremio Web", tooltip: "Stremio Web Player", icon: getFavicon("web.stremio.com"), urlTemplate: "https://web.stremio.com/#/search?search={title}", defaultEnabled: true },
        { id: "cinehax", name: "CineHax", tooltip: "Cine", icon: getFavicon("https://cinehax.com/wp-content/themes/cinehax/assets/logo/logo_navidad.svg"), urlTemplate: "https://cinehax.com/search/?q={title}", defaultEnabled: true },
        { id: "serieskao", name: "Series Kao", tooltip: "Cine", icon: getFavicon("serieskao.top"), urlTemplate: "https://serieskao.top/search?s={title}", defaultEnabled: true },
      { id: "cuevana", name: "Cuevana", tooltip: "Peliculas/Series Español", icon: getFavicon("cuevana.is"), urlTemplate: "https://www.cuevana.is/search?q={title}", defaultEnabled: true },
        { id: "hackstore", name: "HackStore", tooltip: "Descargas Español", icon: getFavicon("https://i.ibb.co/jPKgsB7C/photo-5436140261622270775-c.jpg"), urlTemplate: "https://hackstore.mx/search/{title}", defaultEnabled: true },
        { id: "pstream", name: "PStream", tooltip: "Streaming", icon: getFavicon("pstream.mov"), urlTemplate: "https://pstream.mov/browse/", defaultEnabled: false },
        { id: "oneshows", name: "1Shows", tooltip: "Russian/English", icon: getFavicon("1shows.ru"), urlTemplate: "https://www.1shows.ru/search?query={title}", defaultEnabled: true },
        { id: "vegamovies", name: "VegaMovies", tooltip: "Movies Download", icon: getFavicon("vegamovies.gripe"), urlTemplate: "https://vegamovies.gripe/?s={title}", defaultEnabled: true },
        { id: "4khdhub", name: "4kHDHub", tooltip: "4K Content", icon: getFavicon("4khdhub.fans"), urlTemplate: "https://4khdhub.fans/?s={title}", defaultEnabled: true },
        { id: "uhdmovies", name: "UHDMovies", tooltip: "UHD Content", icon: getFavicon("uhdmovies.stream"), urlTemplate: "https://uhdmovies.stream/search/{title}", defaultEnabled: true },
        { id: "pelishd4k", name: "PelisHD4K", tooltip: "Peliculas 4K", icon: getFavicon("pelishd4k.com"), urlTemplate: "https://pelishd4k.com/?s={title}", defaultEnabled: true },
        { id: "lacartoons", name: "LaCartoons", tooltip: "Cartoons", icon: getFavicon("lacartoons.com"), urlTemplate: "https://www.lacartoons.com/?utf8=%E2%9C%93&Titulo={title}", defaultEnabled: true },
        { id: "gdrivelatino", name: "GDriveLatino", tooltip: "Google Drive Links", icon: getFavicon("gdrivelatinohd.net"), urlTemplate: "https://gdrivelatinohd.net/?s={title}", defaultEnabled: true },
        { id: "pelisenhd", name: "PelisEnHD", tooltip: "Peliculas HD", icon: getFavicon("pelisenhd.org"), urlTemplate: "https://pelisenhd.org/?s={title}", defaultEnabled: true },
        { id: "hdlatino", name: "HDLatino", tooltip: "Latino", icon: getFavicon("vip.hdlatino.us"), urlTemplate: "https://vip.hdlatino.us/?s={title}", defaultEnabled: true },
        { id: "sudatchi", name: "Sudatchi", tooltip: "Anime Streaming", icon: getFavicon("sudatchi.com"), urlTemplate: "https://sudatchi.com/series?search={title}", defaultEnabled: true },
        { id: "nyaa", name: "Nyaa", tooltip: "Anime Torrent", icon: getFavicon("nyaa.si"), urlTemplate: "https://nyaa.si/?q={title}&f=0&c=0_0", defaultEnabled: true },
        { id: "japanpaw", name: "JapanPaw", tooltip: "Anime/Drama", icon: getFavicon("japanpaw.com"), urlTemplate: "https://japanpaw.com/?s={title}", defaultEnabled: true }
    ];

    // --- Gestión de Configuración ---
    function initializeConfig() {
        if (!GM_getValue(SITES_CONFIG_KEY)) {
            GM_setValue(SITES_CONFIG_KEY, defaultSiteConfigs);
        }
    }

    function getSitesConfig() {
        return GM_getValue(SITES_CONFIG_KEY, []);
    }

    function setSitesConfig(newConfig) {
        GM_setValue(SITES_CONFIG_KEY, newConfig);
    }

    function getSiteOrder() {
        const key = `media_order_v3`;
        const siteConfigs = getSitesConfig();
        const savedOrder = GM_getValue(key, []);
        const validOrder = savedOrder.filter(id => siteConfigs.some(s => s.id === id));
        siteConfigs.forEach(site => {
            if (!validOrder.includes(site.id)) {
                validOrder.push(site.id);
            }
        });
        return validOrder;
    }

    function setSiteOrder(order) {
        const key = `media_order_v3`;
        GM_setValue(key, order);
    }

    function isSiteEnabled(siteId) {
        const key = `media_state_v3_${siteId}`;
        const site = getSitesConfig().find(s => s.id === siteId);
        const defaultState = site ? site.defaultEnabled !== false : true;
        return GM_getValue(key, defaultState);
    }

    function setSiteEnabled(siteId, enabled) {
        const key = `media_state_v3_${siteId}`;
        GM_setValue(key, enabled);
    }

    // --- Menú de Configuración (Popup) ---
    let settingsModal = null;
    let settingsModalClickListener = null;

    function closeSettingsModal() {
        if (settingsModal && settingsModal.parentNode) {
            settingsModal.parentNode.removeChild(settingsModal);
            document.body.style.overflow = '';
            if (settingsModalClickListener) {
                document.removeEventListener('click', settingsModalClickListener);
                settingsModalClickListener = null;
            }
            settingsModal = null;
        }
    }

    function showSiteEditorModal(siteToEdit, onSaveCallback) {
        if (settingsModal) settingsModal.style.display = 'none';

        const editorModal = document.createElement('div');
        editorModal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #2a2a2a; padding: 25px; z-index: 10002;
            box-shadow: 0 0 15px rgba(0,0,0,0.7); border-radius: 8px;
            color: #fff; width: 400px; font-family: Roboto, Arial, sans-serif;
        `;

        editorModal.innerHTML = `
            <h3 style="margin-top: 0;">${siteToEdit ? 'Editar Sitio' : 'Añadir Nuevo Sitio'}</h3>
            <label>Nombre:</label><br>
            <input type="text" id="siteName" value="${(siteToEdit && siteToEdit.name) || ''}" style="width: 95%; margin-bottom: 10px; padding: 5px;"><br>
            <label>Descripción:</label><br>
            <textarea id="siteTooltip" style="width: 95%; height: 60px; margin-bottom: 10px; padding: 5px;">${(siteToEdit && siteToEdit.tooltip) || ''}</textarea><br>
            <label>URL Icono:</label><br>
            <input type="text" id="siteIcon" value="${(siteToEdit && siteToEdit.icon) || ''}" style="width: 95%; margin-bottom: 10px; padding: 5px;"><br>
            <label>URL Template (usar {title}):</label><br>
            <input type="text" id="siteUrlTemplate" value="${(siteToEdit && siteToEdit.urlTemplate) || ''}" placeholder="Ej: https://sitio.com/?s={title}" style="width: 95%; margin-bottom: 15px; padding: 5px;"><br>
        `;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar';
        saveButton.style.cssText = 'padding: 8px 15px; background-color: #007bff; border: none; color: #fff; cursor: pointer; border-radius: 4px;';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.style.cssText = 'margin-left: 10px; padding: 8px 15px; background-color: #444; border: none; color: #fff; cursor: pointer; border-radius: 4px;';

        const closeEditor = () => {
            document.body.removeChild(editorModal);
            if (settingsModal) settingsModal.style.display = 'block';
        };

        cancelButton.onclick = closeEditor;

        saveButton.onclick = () => {
            const siteName = document.getElementById('siteName').value.trim();
            const siteUrlTemplate = document.getElementById('siteUrlTemplate').value.trim();

            if (!siteName || !siteUrlTemplate) {
                alert('Nombre y URL son requeridos.');
                return;
            }

            let allSites = getSitesConfig();
            if (siteToEdit) {
                const site = allSites.find(s => s.id === siteToEdit.id);
                if (site) {
                    site.name = siteName;
                    site.tooltip = document.getElementById('siteTooltip').value;
                    site.icon = document.getElementById('siteIcon').value;
                    site.urlTemplate = siteUrlTemplate;
                }
            } else {
                const newSite = {
                    id: `custom_${Date.now()}`,
                    name: siteName,
                    tooltip: document.getElementById('siteTooltip').value,
                    icon: document.getElementById('siteIcon').value,
                    urlTemplate: siteUrlTemplate,
                    defaultEnabled: true
                };
                allSites.push(newSite);
                const currentOrder = getSiteOrder();
                currentOrder.push(newSite.id);
                setSiteOrder(currentOrder);
                setSiteEnabled(newSite.id, true);
            }
            setSitesConfig(allSites);
            onSaveCallback();
            closeEditor();
        };

        editorModal.appendChild(saveButton);
        editorModal.appendChild(cancelButton);
        document.body.appendChild(editorModal);
    }

    function createPopupMenu() {
        if (settingsModal) return;

        settingsModal = document.createElement('div');
        const modal = settingsModal;
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #1a1a1a; padding: 20px; z-index: 10001;
            box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius: 8px;
            max-height: 80vh; overflow-y: auto; color: #fff; width: 500px;
            font-family: Roboto, Arial, sans-serif; font-size: 14px;
        `;
        document.body.style.overflow = 'hidden';

        modal.innerHTML = `
            <h2 style="margin-top: 0; color: #fff;">Configuración de Enlaces</h2>
            <p style="color: #aaa; font-size: 12px;">Arrastra para reordenar.</p>
        `;
        const listContainer = document.createElement('div');
        modal.appendChild(listContainer);

        function populateContainer(container) {
            container.innerHTML = '';
            const siteConfigs = getSitesConfig();
            const order = getSiteOrder();

            order.forEach(siteId => {
                const site = siteConfigs.find(s => s.id === siteId);
                if (!site) return;

                const item = document.createElement('div');
                item.draggable = true;
                item.style.cssText = 'display: flex; align-items: center; margin: 5px 0; padding: 5px; background-color: #2a2a2a; border-radius: 4px; color: #fff; border: 1px solid #333;';

                item.innerHTML = `
                    <span style="cursor: move; margin-right: 10px; color: #777;">☰</span>
                    <img src="${site.icon}" title="${site.tooltip}" style="width: 20px; height: 20px; object-fit: contain; margin-right: 10px; background: #fff; border-radius: 4px;">
                    <span style="flex-grow: 1;">${site.name}</span>
                `;
                const editBtn = document.createElement('button');
                editBtn.textContent = '✏️';
                editBtn.style.cssText = 'background:none; border:none; color: #fff; cursor:pointer; font-size: 14px; margin-left: 10px;';
                editBtn.title = 'Editar';
                editBtn.onclick = () => showSiteEditorModal(site, () => populateContainer(container));

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑️';
                deleteBtn.style.cssText = 'background:none; border:none; color: #ff6b6b; cursor:pointer; font-size: 14px;';
                deleteBtn.title = 'Eliminar';
                deleteBtn.onclick = () => {
                    if (confirm(`¿Borrar "${site.name}"?`)) {
                        let allSites = getSitesConfig().filter(s => s.id !== site.id);
                        setSitesConfig(allSites);
                        setSiteOrder(getSiteOrder().filter(id => id !== site.id));
                        populateContainer(container);
                    }
                };

                const status = document.createElement('span');
                const isEnabled = isSiteEnabled(site.id);
                status.textContent = isEnabled ? '✔' : '✘';
                status.style.cssText = `font-size: 18px; margin-left: 10px; cursor: pointer; color: ${isEnabled ? '#00ff00' : '#ff0000'}; width: 20px; text-align: center;`;
                status.addEventListener('click', () => {
                    const newState = !isSiteEnabled(site.id);
                    setSiteEnabled(site.id, newState);
                    status.textContent = newState ? '✔' : '✘';
                    status.style.color = newState ? '#00ff00' : '#ff0000';
                });
                item.appendChild(editBtn);
                item.appendChild(deleteBtn);
                item.appendChild(status);
                container.appendChild(item);

                // Drag and Drop
                item.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', site.id); item.style.opacity = '0.5'; });
                item.addEventListener('dragend', () => item.style.opacity = '1');
                item.addEventListener('dragover', (e) => e.preventDefault());
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    item.style.opacity = '1';
                    const draggedId = e.dataTransfer.getData('text/plain');
                    if (draggedId === site.id) return;
                    let currentOrderList = getSiteOrder();
                    const draggedIndex = currentOrderList.indexOf(draggedId);
                    const dropIndex = currentOrderList.indexOf(site.id);
                    currentOrderList.splice(draggedIndex, 1);
                    currentOrderList.splice(dropIndex, 0, draggedId);
                    setSiteOrder(currentOrderList);
                    populateContainer(container);
                });
            });

            const addSiteButton = document.createElement('button');
            addSiteButton.textContent = '+ Añadir Sitio';
            addSiteButton.style.cssText = 'margin-top: 15px; padding: 8px; width: 100%; background-color: #007bff; border: none; color: #fff; cursor: pointer; border-radius: 4px;';
            addSiteButton.onclick = () => showSiteEditorModal(null, () => populateContainer(container));
            container.appendChild(addSiteButton);
        }

        populateContainer(listContainer);

        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = 'margin-top: 15px; padding-top: 10px; border-top: 1px solid #444;';
        optionsContainer.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <input type="checkbox" id="media_show_shortcut_checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="media_show_shortcut_checkbox" style="cursor: pointer;">Mostrar botón de ajustes (⚙️)</label>
            </div>
            <div style="display: flex; align-items: center;">
                <input type="checkbox" id="media_format_name_checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="media_format_name_checkbox" style="cursor: pointer;">Limpiar nombre (minúsculas, sin símbolos)</label>
            </div>
        `;
        modal.appendChild(optionsContainer);
        const shortcutCheckbox = optionsContainer.querySelector('#media_show_shortcut_checkbox');
        shortcutCheckbox.checked = GM_getValue(SETTINGS_SHORTCUT_ENABLED_KEY, DEFAULT_SETTINGS_SHORTCUT_ENABLED);
        shortcutCheckbox.addEventListener('change', () => GM_setValue(SETTINGS_SHORTCUT_ENABLED_KEY, shortcutCheckbox.checked));

        const formattingCheckbox = optionsContainer.querySelector('#media_format_name_checkbox');
        formattingCheckbox.checked = GM_getValue(GAME_FORMATTING_ENABLED_KEY, DEFAULT_GAME_FORMATTING_ENABLED);
        formattingCheckbox.addEventListener('change', () => GM_setValue(GAME_FORMATTING_ENABLED_KEY, formattingCheckbox.checked));

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Resetear';
        resetButton.style.cssText = 'padding: 5px 10px; background-color: #d9534f; border: none; color: #fff; cursor: pointer; border-radius: 4px;';
        resetButton.addEventListener('click', () => {
            if (confirm("¿Resetear configuración?")) {
                const currentSites = getSitesConfig();
                GM_deleteValue(SITES_CONFIG_KEY);
                GM_deleteValue('media_order_v3');
                currentSites.forEach(site => GM_deleteValue(`media_state_v3_${site.id}`));
                initializeConfig();
                populateContainer(listContainer);
            }
        });

        const okButton = document.createElement('button');
        okButton.textContent = 'Cerrar';
        okButton.style.cssText = 'padding: 5px 15px; background-color: #444; border: none; color: #fff; cursor: pointer; border-radius: 4px;';
        okButton.addEventListener('click', () => { closeSettingsModal(); window.location.reload(); });

        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(okButton);
        modal.appendChild(buttonContainer);

        settingsModalClickListener = (e) => {
            const editor = document.querySelector('div[style*="z-index: 10002"]');
            if (editor && editor.contains(e.target)) return;
            if (settingsModal && !settingsModal.contains(e.target) && !e.target.closest('.media-settings-shortcut-btn')) {
                closeSettingsModal();
            }
        };
        setTimeout(() => document.addEventListener('click', settingsModalClickListener), 0);

        document.body.appendChild(modal);
    }

    GM_registerMenuCommand("Configurar Enlaces", createPopupMenu);

    // --- Funciones de utilidad ---
    function getSites(formattedTitle) {
        const siteConfigs = getSitesConfig();
        const order = getSiteOrder();
        return order
            .map(siteId => siteConfigs.find(site => site.id === siteId))
            .filter(site => site && isSiteEnabled(site.id))
            .map(site => ({
                name: site.name,
                tooltip: site.tooltip,
                icon: site.icon,
                url: site.urlTemplate.replace('{title}', encodeURIComponent(formattedTitle))
            }));
    }

    function createLinkButton(searchLink, buttonText, tooltipText, iconPath) {
        const linkButton = document.createElement("a");
        linkButton.href = searchLink;
        linkButton.target = searchLink.startsWith('stremio:') ? "_self" : "_blank";
        linkButton.title = tooltipText;
        linkButton.style.cssText = "text-decoration: none; margin-right: 5px; display: inline-block;";

        const img = new Image();
        img.src = iconPath;
        img.alt = buttonText;
        img.style.cssText = `
            width: 32px; height: 32px;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            background-color: #fff;
            padding: 2px;
            transition: transform 0.2s;
        `;
        linkButton.addEventListener('mouseenter', () => img.style.transform = 'scale(1.1)');
        linkButton.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');

        linkButton.appendChild(img);
        return linkButton;
    }

    function createSettingsShortcutButtonElement() {
        const settingsButton = document.createElement("button");
        settingsButton.className = 'media-settings-shortcut-btn';
        settingsButton.textContent = "⚙️";
        settingsButton.title = "Configurar enlaces";
        settingsButton.style.cssText = `
            display: inline-flex; align-items: center; justify-content: center;
            width: 32px; height: 32px;
            font-size: 16px;
            padding: 0; border: none;
            background-color: rgba(255, 255, 255, 0.9);
            color: #333; border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            cursor: pointer; transition: transform 0.2s;
        `;
        settingsButton.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); createPopupMenu(); });
        settingsButton.addEventListener('mouseenter', () => settingsButton.style.transform = 'scale(1.1)');
        settingsButton.addEventListener('mouseleave', () => settingsButton.style.transform = 'scale(1)');
        return settingsButton;
    }

    function formatTitle(title) {
        const useFormatting = GM_getValue(GAME_FORMATTING_ENABLED_KEY, DEFAULT_GAME_FORMATTING_ENABLED);
        if (useFormatting) {
            return title.trim().toLowerCase()
                .replace(/'/g, '')
                .replace(/[:\-]/g, ' ')
                .replace(/\s+/g, ' ');
        } else {
            return title.trim();
        }
    }

    // --- LÓGICA PRINCIPAL (DETECCIÓN MULTI-IDIOMA) ---
    function processGoogleSearchPage() {
        // 0. Si ya lo pusimos, salir
        if (document.querySelector('.media-links-container')) return;

        // 1. Obtener panel de conocimiento (Knowledge Panel)
        const kpElement = document.querySelector('.kp-wholepage, .lhs, [data-attrid="subtitle"]');
        if (!kpElement && !document.querySelector('[data-attrid="title"]')) return;

        // Obtener el texto del subtítulo (Categoría)
        const subtitleElement = document.querySelector('[data-attrid="subtitle"]');
        let subtitleText = subtitleElement ? subtitleElement.textContent.toLowerCase() : "";

        // 2. LISTA NEGRA (Bloqueo explícito de Videojuegos y otros)
        const forbiddenKeywords = [
            // ES
            'videojuego', 'juego', 'empresa', 'software', 'álbum', 'canción',
            // EN
            'video game', 'videogame', 'game', 'company', 'developer', 'album', 'song',
            // PT
            'jogo de vídeo', 'jogo eletrônico', 'empresa', 'música',
            // RU
            'видеоигра', 'игра', 'компания', 'альбом', 'песня', 'разработчик'
        ];

        if (forbiddenKeywords.some(word => subtitleText.includes(word))) {
            return;
        }

        // 3. LISTA BLANCA (Permitido explícitamente - ES, EN, PT, RU)
        const allowedKeywords = [
            // ES
            'película', 'cine', 'serie', 'temporada', 'capítulo', 'episodio', 'telenovela', 'anime', 'animación', 'drama', 'documental',
            // EN
            'movie', 'film', 'series', 'show', 'season', 'episode', 'anime', 'animation', 'drama', 'documentary', 'sitcom',
            // PT
            'filme', 'série', 'novela', 'desenho', 'temporada', 'episódio', 'animado',
            // RU
            'фильм', 'сериал', 'аниме', 'сезон', 'эпизод', 'мультфильм', 'кино'
        ];

        let isMedia = allowedKeywords.some(word => subtitleText.includes(word));

        // 4. HEURÍSTICA AVANZADA (Si el subtítulo falla, buscar otras señales)
        if (!isMedia) {
            // A veces dice "Acción/Aventura" o nada. Verificamos otras cosas:

            // A) Sección "Dónde ver" (Media Actions)
            const mediaActions = document.querySelector('[data-attrid*="media_actions"]');
            if (mediaActions) {
                isMedia = true;
            }

            // B) Calificaciones de TV/Cine (IMDb, Rotten Tomatoes)
            // Google suele mostrar logos o textos como "7/10 IMDb"
            const reviewHeader = document.body.textContent.match(/(IMDb|Rotten Tomatoes|Filmaffinity)/i);
            const reviewElement = document.querySelector('[data-attrid="kc:/tv/tv_program:reviews"]');
            if (reviewHeader || reviewElement) {
                 // Doble chequeo para no confundir con juegos que también tienen reviews
                 if (!forbiddenKeywords.some(word => document.body.textContent.toLowerCase().includes(word))) {
                     // Asumimos que es media si tiene IMDb y no dice "juego"
                     isMedia = true;
                 }
            }

            // C) Presencia de "Reparto" (Cast)
            const castSection = document.querySelector('[data-attrid*="cast"]');
            if (castSection) isMedia = true;
        }

        if (!isMedia) return;

        // 5. Obtener Título
        const titleElement = document.querySelector('[data-attrid="title"]');
        if (!titleElement) return;

        const title = titleElement.textContent.trim();
        const formattedTitle = formatTitle(title);

        // 6. Construir Contenedor
        const container = document.createElement('div');
        container.className = "media-links-container";
        container.style.cssText = `
            margin-top: 10px; margin-bottom: 10px;
            display: flex; flex-wrap: wrap; gap: 8px;
            padding: 12px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #dadce0;
            clear: both; width: 92%;
            position: relative; z-index: 1;
            margin-left: auto; margin-right: auto;
        `;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            container.style.backgroundColor = '#303134';
            container.style.border = '1px solid #3c4043';
        }

        const sites = getSites(formattedTitle);
        if (sites.length === 0) return;

        const headerLabel = document.createElement('div');
        headerLabel.textContent = "Ver en: ";
        headerLabel.style.cssText = "width: 100%; font-size: 12px; color: #70757a; margin-bottom: 5px; font-weight: 500;";
        container.appendChild(headerLabel);

        sites.forEach(site => {
            const btn = createLinkButton(site.url, site.name, site.tooltip, site.icon);
            container.appendChild(btn);
        });

        if (GM_getValue(SETTINGS_SHORTCUT_ENABLED_KEY, DEFAULT_SETTINGS_SHORTCUT_ENABLED)) {
            const settingsBtn = createSettingsShortcutButtonElement();
            container.appendChild(settingsBtn);
        }

        // 7. Insertar (Prioridad: Sección "Ver", luego Subtítulo, luego Título)
        const mediaActionsContainer = document.querySelector('[data-attrid*="media_actions_wholepage"]');
        if (mediaActionsContainer) {
            mediaActionsContainer.parentNode.insertBefore(container, mediaActionsContainer.nextSibling);
        } else if (subtitleElement && subtitleElement.parentNode) {
            subtitleElement.parentNode.insertAdjacentElement('afterend', container);
        } else {
            titleElement.insertAdjacentElement('afterend', container);
        }
    }

    // --- Inicialización ---
    initializeConfig();

    setTimeout(processGoogleSearchPage, 1000);
    const observer = new MutationObserver(() => {
        processGoogleSearchPage();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();