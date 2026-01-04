// ==UserScript==
// @name         ElAmigos modo catálogo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modo catálogo en elamigos.site con portadas limpias y títulos ordenados
// @author       Shu2Ouma
// @match        https://elamigos.site/*
// @grant        GM_xmlhttpRequest
// @connect      elamigos.site
// @run-at       document-idle
// @icon         https://elamigos.site/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554171/ElAmigos%20modo%20cat%C3%A1logo.user.js
// @updateURL https://update.greasyfork.org/scripts/554171/ElAmigos%20modo%20cat%C3%A1logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CACHE PARA EVITAR DUPLICADOS ---
    const processedLinks = new Set();

    function convertYouTubeLinks(doc, contenedorFlex = null) {
        const parrafos = doc.querySelectorAll('p');
        parrafos.forEach(p => {
            const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+))/g;
                if (ytRegex.test(node.textContent)) {
                    const frag = document.createDocumentFragment();
                    let lastIndex = 0;
                    node.textContent.replace(ytRegex, (match, url, videoId, offset) => {
                        if (offset > lastIndex) frag.appendChild(document.createTextNode(node.textContent.slice(lastIndex, offset)));
                        const iframe = document.createElement('iframe');
                        iframe.width = 560;
                        iframe.height = 315;
                        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
                        iframe.frameBorder = 0;
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                        iframe.allowFullscreen = true;
                        if (contenedorFlex) contenedorFlex.appendChild(iframe);
                        else frag.appendChild(iframe);
                        lastIndex = offset + match.length;
                    });
                    if (lastIndex < node.textContent.length)
                        frag.appendChild(document.createTextNode(node.textContent.slice(lastIndex)));
                    node.parentNode.replaceChild(frag, node);
                }
            }
        });
    }

    if(location.href.includes('/data/')){
        const primeraImg = document.querySelector('img');
        if(primeraImg){
            const iframeHeight = 315;
            primeraImg.style.height = iframeHeight + 'px';
            primeraImg.style.width = 'auto';
            primeraImg.style.objectFit = 'cover';
            const contenedor = document.createElement('div');
            contenedor.style.display = 'flex';
            contenedor.style.alignItems = 'flex-start';
            contenedor.style.gap = '20px';
            primeraImg.parentNode.insertBefore(contenedor, primeraImg);
            contenedor.appendChild(primeraImg);
            convertYouTubeLinks(document, contenedor);
        }
        return;
    }

    if(document.getElementById('catalogo-elamigos')) return;

    function limpiarNombre(nombre) {
        return nombre
            .replace(/\bEl\s*-?\s*Amigos\b/gi, '')
            .replace(/\bElAmigos\b/gi, '')
            .replace(/[\[\(\{]\s*El\s*-?\s*Amigos\s*[\]\)\}]/gi, '')
            .replace(/\bAmigos\b/gi, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\r?\n/g, '')
            .replace(/\s*\+\s*(?=\[)/g, '')
            .replace(/(?=\[)/g, '<br>')
            .trim();
    }

    function formatDate(dateStr) {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
        }
        return dateStr;
    }

    // --- Estilos MEJORADOS con fechas ---
    const style = document.createElement('style');
    style.textContent = `
        #catalogo-elamigos {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 20px;
            margin: 30px 0;
            padding: 10px;
        }

        .date-separator {
            grid-column: 1 / -1;
            text-align: center;
            margin: 40px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid #e74c3c;
            position: relative;
        }

        .date-separator h2 {
            color: #333;
            font-size: 1.8em;
            margin: 0;
            padding: 0 20px;
            display: inline-block;
            background: white;
            position: relative;
            top: 10px;
        }

        #catalogo-elamigos .card {
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #catalogo-elamigos .card:hover {
            transform: translateY(-8px) scale(1.05);
            box-shadow: 0 12px 25px rgba(0,0,0,0.2);
        }

        #catalogo-elamigos img {
            width: 160px;
            height: 240px;
            object-fit: cover;
            display: block;
            margin: 0 auto 12px auto;
            border-radius: 10px;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        #catalogo-elamigos .card:hover img {
            transform: scale(1.1);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        #catalogo-elamigos .title {
            width: 160px;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            word-wrap: break-word;
            margin: 0 auto;
            transition: color 0.3s ease;
            line-height: 1.3em;
            padding: 8px;
            background: rgba(255,255,255,0.9);
            border-radius: 6px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #catalogo-elamigos .card:hover .title {
            color: #e74c3c !important;
            background: rgba(255,255,255,1);
        }

        #catalogo-elamigos .placeholder {
            width: 160px;
            height: 240px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 10px;
            margin: 0 auto 12px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 12px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }

        .catalog-filters {
            position: sticky;
            top: 40px;
            z-index: 100;
            background: rgba(51, 51, 51, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            justify-content: center;
        }

        .filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }

        .filter-label {
            color: white;
            font-weight: bold;
            font-size: 14px;
            margin-right: 5px;
            white-space: nowrap;
        }

        .letter-button {
            min-width: 36px;
            height: 36px;
            padding: 0 8px;
            border: none;
            border-radius: 8px;
            background: #444;
            color: white;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .letter-button:hover {
            background: #007bff;
            transform: translateY(-2px);
        }

        .letter-button.active {
            background: #e74c3c;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
        }

        .letter-button.special {
            background: #3498db;
        }

        #search-filter {
            flex: 1;
            min-width: 200px;
            max-width: 300px;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            background: white;
            color: #333;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        #search-filter:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
        }

        .stats {
            color: white;
            font-size: 12px;
            background: rgba(0,0,0,0.3);
            padding: 5px 10px;
            border-radius: 6px;
            margin-left: auto;
        }

        body > a[href^="data/"] {
            display: none !important;
        }

        h1:not(:first-of-type) {
            display: none !important;
        }

        .section-divider {
            grid-column: 1 / -1;
            text-align: center;
            margin: 40px 0 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            font-size: 1.5em;
            font-weight: bold;
        }

        .section-divider.new-additions {
            background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
        }

        @media (max-width: 768px) {
            #catalogo-elamigos {
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 15px;
            }

            .date-separator h2 {
                font-size: 1.4em;
            }

            #catalogo-elamigos img,
            #catalogo-elamigos .placeholder,
            #catalogo-elamigos .title {
                width: 140px;
            }

            #catalogo-elamigos img {
                height: 210px;
            }

            #catalogo-elamigos .placeholder {
                height: 210px;
            }

            .catalog-filters {
                flex-direction: column;
                align-items: stretch;
            }

            .filter-group {
                justify-content: center;
            }

            #search-filter {
                max-width: 100%;
            }
        }

        .highlight-first-card {
            animation: highlightCard 1s ease;
        }

        @keyframes highlightCard {
            0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
            100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
    `;
    document.head.appendChild(style);

    const grid = document.createElement('div');
    grid.id = 'catalogo-elamigos';

    // --- OBSERVER MEJORADO ---
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(!entry.isIntersecting) return;
            const card = entry.target;
            const link = card.dataset.link;
            const tituloTexto = card.dataset.title;
            if(card.dataset.loaded) return;

            GM_xmlhttpRequest({
                method:'GET',
                url: link,
                onload:function(response){
                    try{
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText,'text/html');
                        convertYouTubeLinks(doc);
                        const imgElem = doc.querySelector('img');
                        if(imgElem){
                            const imgSrc = new URL(imgElem.src, link).href;
                            const enlace = document.createElement('a');
                            enlace.href = link;
                            enlace.target = '_blank';
                            enlace.rel = 'noopener noreferrer';
                            enlace.style.textDecoration = 'none';

                            const portada = document.createElement('img');
                            portada.src = imgSrc;
                            portada.alt = tituloTexto;
                            portada.loading = 'lazy';
                            portada.style.objectFit = 'cover';
                            enlace.appendChild(portada);

                            const placeholder = card.querySelector('.placeholder');
                            if(placeholder) card.replaceChild(enlace, placeholder);
                            else card.insertBefore(enlace, card.firstChild);
                        }

                        const titulo = document.createElement('div');
                        titulo.className = 'title';
                        titulo.innerHTML = tituloTexto;
                        if(card.dataset.color) titulo.style.color = card.dataset.color;
                        card.appendChild(titulo);

                        card.dataset.loaded = "true";

                        updateStats();
                    }catch(err){
                        console.error('Error cargando portada:', link, err);
                        card.querySelector('.placeholder').innerHTML = '⚠️<br>Error';
                        card.querySelector('.placeholder').style.color = '#e74c3c';
                    }
                },
                onerror:function(err){
                    console.warn('GM_xmlhttpRequest ->', err);
                    card.querySelector('.placeholder').innerHTML = '❌<br>Error';
                    card.querySelector('.placeholder').style.color = '#e74c3c';
                }
            });

            observer.unobserve(card);
        });
    },{rootMargin:'200px'});

    // --- FUNCIONES AUXILIARES ---
    function findFirstFecha(){
        return Array.from(document.querySelectorAll('h1')).find(h1 =>
            /^\d{2}\.\d{2}\.\d{4}$/.test(h1.textContent.trim())
        ) || null;
    }

    // --- SISTEMA DE FILTRADO MEJORADO ---
    let activeFilter = 'Todos';
    let searchTerm = '';
    let totalCards = 0;
    let visibleCards = 0;
    let fullLogFound = false;
    let cardsBeforeFullLog = 0;
    let cardsAfterFullLog = 0;
    let scrollToFirstCard = false;

    function createFilterSystem() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'catalog-filters';

        // Grupo de letras
        const letterGroup = document.createElement('div');
        letterGroup.className = 'filter-group';

        const letterLabel = document.createElement('span');
        letterLabel.className = 'filter-label';
        letterLabel.textContent = 'Letra:';
        letterGroup.appendChild(letterLabel);

        // Botón "Todos"
        const allButton = document.createElement('button');
        allButton.className = 'letter-button active special';
        allButton.textContent = 'Todos';
        allButton.addEventListener('click', () => {
            scrollToFirstCard = false;
            setFilter('Todos');
        });
        letterGroup.appendChild(allButton);

        // Botón "#"
        const numButton = document.createElement('button');
        numButton.className = 'letter-button special';
        numButton.textContent = '#';
        numButton.addEventListener('click', () => {
            scrollToFirstCard = true;
            setFilter('#');
        });
        letterGroup.appendChild(numButton);

        // Botones A-Z
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
            const button = document.createElement('button');
            button.className = 'letter-button';
            button.textContent = letter;
            button.addEventListener('click', () => {
                scrollToFirstCard = true;
                setFilter(letter);
            });
            letterGroup.appendChild(button);
        });

        // Grupo de búsqueda
        const searchGroup = document.createElement('div');
        searchGroup.className = 'filter-group';
        searchGroup.style.flex = '1';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search-filter';
        searchInput.placeholder = '🔍 Buscar juegos...';
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            scrollToFirstCard = false;
            applyFilters();
        });
        searchGroup.appendChild(searchInput);

        // Estadísticas
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats';
        statsDiv.id = 'catalog-stats';
        statsDiv.textContent = 'Cargando...';

        filterContainer.appendChild(letterGroup);
        filterContainer.appendChild(searchGroup);
        filterContainer.appendChild(statsDiv);

        grid.parentNode.insertBefore(filterContainer, grid);

        window.filterButtons = letterGroup.querySelectorAll('.letter-button');
    }

    function setFilter(filter) {
        activeFilter = filter;

        window.filterButtons?.forEach(button => {
            button.classList.remove('active');
            if ((filter === 'Todos' && button.textContent === 'Todos') ||
                (filter === '#' && button.textContent === '#') ||
                (filter !== 'Todos' && filter !== '#' && button.textContent === filter)) {
                button.classList.add('active');
            }
        });

        applyFilters();
    }

    function applyFilters() {
        const cards = document.querySelectorAll('#catalogo-elamigos .card');
        visibleCards = 0;
        let firstVisibleCard = null;

        cards.forEach(card => {
            const titulo = (card.dataset.title || '').toLowerCase();
            const cleanTitle = titulo.replace(/<br>/g, ' ').replace(/[^\w\s]/g, '');
            const isAfterFullLog = card.dataset.afterFullLog === 'true';

            // Aplicar filtro de letra SOLO a los juegos después del Full Log
            let passesLetterFilter = false;
            if (!isAfterFullLog) {
                // Juegos antes del Full Log (nuevas adiciones) - SIEMPRE visibles con filtro de letra
                passesLetterFilter = true;
            } else {
                // Juegos después del Full Log (catálogo completo) - aplicar filtro de letra
                if (activeFilter === 'Todos') {
                    passesLetterFilter = true;
                } else if (activeFilter === '#') {
                    passesLetterFilter = /^[^a-z]/i.test(cleanTitle);
                } else {
                    passesLetterFilter = cleanTitle.startsWith(activeFilter.toLowerCase());
                }
            }

            // Aplicar filtro de búsqueda a TODOS los juegos
            const passesSearchFilter = !searchTerm ||
                titulo.includes(searchTerm) ||
                cleanTitle.includes(searchTerm);

            const shouldShow = passesLetterFilter && passesSearchFilter;
            card.style.display = shouldShow ? 'block' : 'none';

            if (shouldShow) {
                visibleCards++;
                if (!firstVisibleCard && isAfterFullLog) {
                    firstVisibleCard = card;
                }
            }

            // Remover highlight previo
            card.classList.remove('highlight-first-card');
        });

        // Scroll al primer juego visible si se activó scrollToFirstCard
        if (scrollToFirstCard && firstVisibleCard) {
            setTimeout(() => {
                firstVisibleCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Añadir animación de highlight
                firstVisibleCard.classList.add('highlight-first-card');
            }, 100);
        }

        // Resetear la bandera después de aplicar el scroll
        scrollToFirstCard = false;

        // Mostrar/ocultar separadores según si tienen tarjetas visibles
        const sections = document.querySelectorAll('.date-separator, .section-divider');
        sections.forEach(section => {
            const nextElements = getNextElementsUntil(section, '.date-separator, .section-divider');
            const hasVisibleCards = nextElements.some(el =>
                el.classList.contains('card') && el.style.display !== 'none'
            );
            section.style.display = hasVisibleCards ? 'block' : 'none';
        });

        updateStats();
    }

    // Función auxiliar para obtener elementos entre dos separadores
    function getNextElementsUntil(startElement, selector) {
        const elements = [];
        let nextElement = startElement.nextElementSibling;

        while (nextElement && !nextElement.matches(selector)) {
            elements.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }

        return elements;
    }

    function updateStats() {
        const statsDiv = document.getElementById('catalog-stats');
        if (statsDiv) {
            const loadedCards = document.querySelectorAll('#catalogo-elamigos .card[data-loaded="true"]').length;
            statsDiv.innerHTML = `
                <strong>${visibleCards}</strong> de <strong>${totalCards}</strong> juegos<br>
                <small>${loadedCards} cargados | ${cardsBeforeFullLog} nuevos | ${cardsAfterFullLog} catálogo</small>
            `;
        }
    }

    // --- PROCESAMIENTO PRINCIPAL CON FECHAS ---
    function processFrom(reference){
        if(!reference) return;

        // Ocultar imágenes grandes del inicio
        document.querySelectorAll('body > a[href^="data/"]').forEach(a => {
            a.style.display = 'none';
        });

        // Insertar el grid
        reference.parentNode.insertBefore(grid, reference.nextSibling);

        // Crear sistema de filtros
        createFilterSystem();

        // Ocultar todas las fechas originales excepto la primera (título del sitio)
        document.querySelectorAll('h1').forEach((h1, index) => {
            if (index > 0) {
                h1.style.display = 'none';
            }
        });

        // Crear separador para nuevas adiciones
        if (!fullLogFound) {
            const newAdditionsDivider = document.createElement('div');
            newAdditionsDivider.className = 'section-divider new-additions';
            newAdditionsDivider.textContent = '🆕 NUEVAS ADICIONES 🆕';
            grid.appendChild(newAdditionsDivider);
        }

        // Procesar elementos
        let nodo = reference;
        let currentDate = null;

        while(nodo){
            const nextNodo = nodo.nextElementSibling;
            const textoNodo = nodo.textContent.trim();
            const esFecha = /^\d{2}\.\d{2}\.\d{4}$/.test(textoNodo);
            const esFullLog = /Full log of updates/i.test(textoNodo);

            if(esFecha){
                // Crear separador de fecha (solo fecha grande)
                currentDate = textoNodo;
                const dateSeparator = document.createElement('div');
                dateSeparator.className = 'date-separator';
                dateSeparator.innerHTML = `<h2>${formatDate(textoNodo)}</h2>`;
                grid.appendChild(dateSeparator);
                nodo.style.display = 'none';
            }
            else if(esFullLog){
                // Crear separador para el catálogo completo
                fullLogFound = true;
                currentDate = null;

                // LIMPIAR EL CACHE DE ENLACES PARA EL CATÁLOGO COMPLETO
                processedLinks.clear();

                const catalogDivider = document.createElement('div');
                catalogDivider.className = 'section-divider';
                catalogDivider.textContent = '🎮 CATÁLOGO COMPLETO 🎮';
                grid.appendChild(catalogDivider);

                nodo.style.display = 'none';
            }
            else if(['H3','H4','H5'].includes(nodo.tagName)){
                const a = nodo.querySelector('a[href]');
                if(a){
                    const link = a.href;
                    const tituloTexto = limpiarNombre(nodo.textContent.replace(/DOWNLOAD/gi,'').trim());

                    // Verificar duplicados solo por enlace y solo para nuevas adiciones
                    // Para el catálogo completo, NO verificar duplicados
                    let esDuplicado = false;

                    if (!fullLogFound) {
                        // Para nuevas adiciones: verificar duplicados por enlace
                        if (processedLinks.has(link)) {
                            console.log('Duplicado omitido (nuevas adiciones):', link);
                            esDuplicado = true;
                        } else {
                            processedLinks.add(link);
                        }
                    }
                    // Para catálogo completo: NO omitir duplicados

                    if (esDuplicado) {
                        nodo.style.display = 'none';
                        nodo = nextNodo;
                        continue;
                    }

                    // Crear tarjeta
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.dataset.link = link;
                    card.dataset.title = tituloTexto;
                    card.dataset.color = window.getComputedStyle(nodo).color;
                    card.dataset.afterFullLog = fullLogFound ? 'true' : 'false';

                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder';
                    placeholder.textContent = 'Cargando...';
                    card.appendChild(placeholder);

                    grid.appendChild(card);
                    observer.observe(card);
                    totalCards++;

                    // Contar tarjetas antes/después del Full Log
                    if (fullLogFound) {
                        cardsAfterFullLog++;
                    } else {
                        cardsBeforeFullLog++;
                    }

                    nodo.style.display = 'none';
                }
            }

            nodo = nextNodo;
        }

        // Aplicar filtros iniciales
        applyFilters();
    }

    // --- INICIALIZACIÓN ---
    const firstFecha = findFirstFecha();
    if(firstFecha) processFrom(firstFecha);
    else{
        const mo = new MutationObserver((mutations, observerMut)=>{
            const fecha = findFirstFecha();
            if(fecha){
                observerMut.disconnect();
                processFrom(fecha);
            }
        });
        mo.observe(document.documentElement||document.body,{childList:true, subtree:true});
        setTimeout(()=>{
            const fecha2 = findFirstFecha();
            if(fecha2) processFrom(fecha2);
        },3000);
    }

})();