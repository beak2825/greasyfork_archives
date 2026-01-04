// ==UserScript==
// @name         Azure DevOps Wiki sidebar with TOC generator
// @namespace    http://tampermonkey.net/
// @version      2025-10-03
// @description  It generates a Table of Contents (TOC) based on the content headings, places it in a right sidebar, updates it in SPA navigation, highlights the visible section with scrollspy, hides in edit mode and regenerates when exiting the editor.
// @author       Me
// @match        https://dev.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dev.azure.com
// @grant        none
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/551445/Azure%20DevOps%20Wiki%20sidebar%20with%20TOC%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/551445/Azure%20DevOps%20Wiki%20sidebar%20with%20TOC%20generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable global para almacenar el observer del scrollspy
    let scrollspyObserver = null;
    let scrollTimeout = null;
    let wasInEditMode = false; // Track del estado anterior para detectar cambios

    /**
     * Función para generar un slug a partir del texto.
     */
    function slugify(text) {
        return text.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Genera la TOC basada en los encabezados dentro del contenedor markdown.
     */
    function generateTOC() {
        const markdownContent = document.querySelector(".markdown-content");
        if (!markdownContent) return null;

        const headings = markdownContent.querySelectorAll("h1, h2, h3, h4, h5, h6");
        if (headings.length === 0) return null;

        const toc = document.createElement("nav");
        toc.className = "toc-container";
        toc.setAttribute("aria-label", "Table of contents");
        toc.setAttribute("role", "navigation");

        const header = document.createElement("div");
        header.className = "toc-container-header";
        header.textContent = "Contenido";
        toc.appendChild(header);

        const rootUl = document.createElement("ul");
        let currentUl = rootUl;
        let previousLevel = null;
        let ulStack = [rootUl]; // Pila para manejar niveles de forma más robusta

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent.trim();
            let id = heading.id;

            if (!id) {
                const slug = slugify(text);
                // Asegurar ID único
                let counter = 1;
                id = "user-content-" + slug;
                while (document.getElementById(id)) {
                    id = "user-content-" + slug + "-" + counter;
                    counter++;
                }
                heading.id = id;
            }

            const li = document.createElement("li");
            li.setAttribute('data-heading-id', id);

            const a = document.createElement("a");
            a.href = `#${id}`;
            a.textContent = text;
            a.setAttribute('data-level', level);

            // Prevenir scroll brusco y usar scroll suave
            a.addEventListener('click', function(e) {
                e.preventDefault();
                const targetElement = document.getElementById(id);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Actualizar URL sin causar scroll
                    history.pushState(null, null, `#${id}`);
                }
            });

            li.appendChild(a);

            if (index === 0) {
                rootUl.appendChild(li);
                previousLevel = level;
                currentUl = rootUl;
                ulStack = [rootUl];
            } else {
                if (level > previousLevel) {
                    // Crear nuevo nivel anidado
                    const newUl = document.createElement("ul");
                    const lastLi = currentUl.lastElementChild;
                    if (lastLi) {
                        lastLi.appendChild(newUl);
                        currentUl = newUl;
                        ulStack.push(newUl);
                    }
                } else if (level < previousLevel) {
                    // Volver a niveles anteriores
                    const levelDiff = previousLevel - level;
                    for (let i = 0; i < levelDiff && ulStack.length > 1; i++) {
                        ulStack.pop();
                    }
                    currentUl = ulStack[ulStack.length - 1];
                }
                currentUl.appendChild(li);
                previousLevel = level;
            }
        });

        toc.appendChild(rootUl);
        return toc;
    }

    /**
     * Detecta si estamos en modo edición
     */
    function isInEditMode() {
        // Detectar si existe el editor de texto o la toolbar de markdown
        const hasEditor = document.querySelector(".we-text") !== null;
        const hasMarkdownToolbar = document.querySelector(".wiki-markdown-toolbar") !== null;
        const hasEditPreviewContainer = document.querySelector(".edit-and-preview") !== null;
        const hasSaveButton = document.querySelector(".we-save-btn") !== null;

        return hasEditor || hasMarkdownToolbar || hasEditPreviewContainer || hasSaveButton;
    }

    /**
     * Actualiza la visibilidad del sidebar basándose en el modo actual
     * y regenera la TOC cuando se sale del modo edición
     */
    function updateSidebarVisibility() {
        const currentEditMode = isInEditMode();
        const sidebarWrapper = document.querySelector(".toc-sidebar");

        // Detectar transición de modo edición a modo lectura
        if (wasInEditMode && !currentEditMode) {
            console.log("Saliendo del modo edición - Regenerando TOC");
            // Pequeño delay para asegurar que el DOM esté actualizado
            setTimeout(() => {
                updateTOC(true); // Forzar regeneración
            }, 100);
        } else if (sidebarWrapper) {
            if (currentEditMode) {
                sidebarWrapper.style.display = 'none';
                console.log("Modo edición detectado - TOC oculta");
            } else {
                sidebarWrapper.style.display = 'block';
                console.log("Modo lectura detectado - TOC visible");
            }
        }

        // Actualizar el estado anterior
        wasInEditMode = currentEditMode;
    }

    /**
     * Actualiza la TOC en el sidebar e inicializa el scrollspy.
     * @param {boolean} forceRegenerate - Forzar regeneración completa de la TOC
     */
    function updateTOC(forceRegenerate = false) {
        // Limpiar observer anterior si existe
        if (scrollspyObserver) {
            scrollspyObserver.disconnect();
            scrollspyObserver = null;
        }

        // Verificar si estamos en modo edición
        if (isInEditMode() && !forceRegenerate) {
            const sidebarWrapper = document.querySelector(".toc-sidebar");
            if (sidebarWrapper) {
                sidebarWrapper.style.display = 'none';
            }
            console.log("En modo edición - TOC no se genera/muestra");
            return;
        }

        const viewContainer = document.querySelector(".wiki-view-container");
        let sidebarWrapper = document.querySelector(".toc-sidebar");

        if (!sidebarWrapper && viewContainer) {
            sidebarWrapper = document.createElement("div");
            sidebarWrapper.className = "toc-sidebar";
            viewContainer.parentNode.insertBefore(sidebarWrapper, viewContainer.nextSibling);
        }

        if (sidebarWrapper) {
            sidebarWrapper.innerHTML = '';
            sidebarWrapper.style.display = 'block'; // Asegurar que esté visible en modo lectura
        }

        const toc = generateTOC();

        if (toc && sidebarWrapper) {
            sidebarWrapper.appendChild(toc);
            initializeScrollspy();
            console.log("TOC generada y colocada en el sidebar con scrollspy mejorado.");
        } else if (sidebarWrapper) {
            const message = document.createElement("div");
            message.className = "toc-missing-message";
            message.textContent = "Agregue encabezados al código markdown para generar la TOC.";
            sidebarWrapper.appendChild(message);
            console.log("No se encontraron encabezados, mensaje mostrado en el sidebar.");
        }
    }

    /**
     * Inicializa el scrollspy mejorado usando Intersection Observer.
     */
    function initializeScrollspy() {
        const headings = document.querySelectorAll(".markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6");
        const tocLinks = document.querySelectorAll(".toc-sidebar .toc-container a");

        if (!headings.length || !tocLinks.length) return;

        // Mapa para tracking rápido
        const headingsMap = new Map();
        const visibleHeadings = new Set();

        headings.forEach(heading => {
            if (heading.id) {
                headingsMap.set(heading.id, heading);
            }
        });

        /**
         * Actualiza el item activo en la TOC basándose en el scroll position
         */
        function updateActiveItem() {
            // Limpiar timeout anterior si existe
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const scrollPosition = window.scrollY || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                let activeHeading = null;
                let minDistance = Infinity;

                // Encontrar el encabezado más cercano al top del viewport
                headings.forEach(heading => {
                    const rect = heading.getBoundingClientRect();
                    const absoluteTop = rect.top + scrollPosition;

                    // Considerar encabezados que están por encima del punto medio del viewport
                    // o que son el último visible antes del scroll actual
                    if (absoluteTop <= scrollPosition + (windowHeight * 0.3)) {
                        const distance = Math.abs(scrollPosition - absoluteTop);
                        if (distance < minDistance) {
                            minDistance = distance;
                            activeHeading = heading;
                        }
                    }
                });

                // Si no hay encabezado activo y estamos cerca del top, activar el primero
                if (!activeHeading && scrollPosition < 100 && headings.length > 0) {
                    activeHeading = headings[0];
                }

                // Actualizar clases active
                tocLinks.forEach(link => {
                    const linkId = link.getAttribute("href").substring(1);
                    const li = link.parentElement;

                    if (activeHeading && linkId === activeHeading.id) {
                        li.classList.add("active");
                        // Asegurar que el item activo sea visible en la TOC si hay scroll
                        ensureTocItemVisible(link);
                    } else {
                        li.classList.remove("active");
                    }
                });
            }, 10); // Pequeño debounce para mejorar performance
        }

        /**
         * Asegura que el item activo de la TOC sea visible si la TOC tiene scroll
         */
        function ensureTocItemVisible(link) {
            const tocContainer = document.querySelector(".toc-container");
            if (tocContainer && tocContainer.scrollHeight > tocContainer.clientHeight) {
                const linkRect = link.getBoundingClientRect();
                const containerRect = tocContainer.getBoundingClientRect();

                if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
                    link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }

        // Configurar Intersection Observer como respaldo y para detección inicial
        scrollspyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleHeadings.add(entry.target.id);
                } else {
                    visibleHeadings.delete(entry.target.id);
                }
            });

            // Actualizar basándose en los cambios de visibilidad
            updateActiveItem();
        }, {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Zona activa en el 30% superior del viewport
            threshold: [0, 0.25, 0.5, 0.75, 1] // Múltiples umbrales para mejor precisión
        });

        headings.forEach(heading => {
            if (heading.id) {
                scrollspyObserver.observe(heading);
            }
        });

        // Agregar listener de scroll para actualización más precisa
        let scrollListener = () => updateActiveItem();
        window.addEventListener('scroll', scrollListener, { passive: true });

        // Guardar referencia para poder limpiar después
        window._tocScrollListener = scrollListener;

        // Actualización inicial
        updateActiveItem();
    }

    /**
     * Inicializa el observador para detectar cambios en el contenido de la wiki.
     */
    function initializeObserver() {
        const wikiContainer = document.querySelector(".wiki-view-container");

        if (wikiContainer) {
            let timeout;
            const debouncedUpdate = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    // Limpiar listener de scroll anterior si existe
                    if (window._tocScrollListener) {
                        window.removeEventListener('scroll', window._tocScrollListener);
                        window._tocScrollListener = null;
                    }
                    updateTOC();
                    updateSidebarVisibility(); // Verificar visibilidad después de actualizar
                }, 300);
            };

            const observer = new MutationObserver(debouncedUpdate);

            observer.observe(wikiContainer, {
                childList: true,
                subtree: true,
                attributes: false, // Evitar actualizaciones innecesarias
                characterData: false
            });

            // Observador adicional para detectar cambios en el modo de edición
            const bodyObserver = new MutationObserver(() => {
                updateSidebarVisibility();
            });

            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            console.log("Observador de Wiki inicializado con detección de modo edición.");
        } else {
            setTimeout(initializeObserver, 500);
        }
    }

    // Limpiar recursos cuando la página se descarga
    window.addEventListener('beforeunload', () => {
        if (scrollspyObserver) {
            scrollspyObserver.disconnect();
        }
        if (window._tocScrollListener) {
            window.removeEventListener('scroll', window._tocScrollListener);
        }
    });

    // Ejecutar al cargar la página
    setTimeout(() => {
        // Establecer el estado inicial
        wasInEditMode = isInEditMode();
        updateTOC();
        updateSidebarVisibility();
    }, 500);
    initializeObserver();
})();