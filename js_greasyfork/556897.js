// ==UserScript==
// @name        Sommaire - Capytale
// @namespace   Violentmonkey Scripts
// @match       https://capytale2.ac-paris.fr/p/basthon/n/*
// @grant       GM_addStyle
// @version     2.5.1
// @author      -
// @description Sommaire pour Capytal
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556897/Sommaire%20-%20Capytale.user.js
// @updateURL https://update.greasyfork.org/scripts/556897/Sommaire%20-%20Capytale.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script Sommaire Capytale V2.6 chargé.");

    const css = `
        #toc-container {
            position: fixed;
            top: 60px;
            left: 10px;
            width: 280px;
            max-height: 90vh;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: width 0.3s ease, height 0.3s ease;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* Mode Badge (Réduit) */
        #toc-container.minimized {
            width: 40px;
            height: 40px;
            background: #007bff;
            border-color: #0056b3;
            cursor: pointer;
        }

        /* Survol du badge */
        #toc-container.minimized:hover {
            width: 280px;
            height: auto;
            max-height: 90vh;
            background: #f8f9fa;
            border-color: #ddd;
        }

        #toc-header {
            padding: 10px;
            background: #e9ecef;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            min-height: 40px;
            white-space: nowrap;
            min-width: 260px; /* Empêche le header de casser pendant l'anim */
        }

        #toc-content {
            overflow-y: auto;
            padding: 10px;
            flex-grow: 1;
            /* CRUCIAL : Garde la largeur interne large pour éviter que le texte
               ne se "compresse" pendant l'animation d'ouverture */
            min-width: 260px;
        }

        /* Icone du badge */
        #toc-badge-icon {
            display: none;
            color: white;
            font-size: 20px;
            text-align: center;
            line-height: 40px;
            width: 40px;
            flex-shrink: 0;
        }

        #toc-container.minimized #toc-badge-icon { display: block; }
        #toc-container.minimized:hover #toc-badge-icon { display: none; }

        #toc-container.minimized #toc-header,
        #toc-container.minimized #toc-content { display: none; }
        
        #toc-container.minimized:hover #toc-header,
        #toc-container.minimized:hover #toc-content { display: flex; }

        .toc-list ul { list-style: none; padding-left: 20px; }
        .toc-list > ul { padding-left: 0; }
        
        .toc-item-container {
            margin-top: 6px;
        }

        /* Ligne contenant la flèche et le lien */
        .toc-item-row {
            display: flex;
            align-items: flex-start; /* Aligne en haut si le texte fait 2 lignes */
        }
        
        /* Lien : Texte complet, retour à la ligne autorisé */
        .toc-link { 
            text-decoration: none; 
            color: #333; 
            font-size: 14px; 
            white-space: normal; /* Autorise le multiline */
            word-wrap: break-word;
            flex: 1; 
            line-height: 1.4;
        }
        
        .toc-link:hover { color: #007bff; text-decoration: underline; }
        
        .toc-toggle {
            cursor: pointer;
            width: 20px;
            min-width: 20px;
            text-align: center;
            color: #666;
            margin-right: 2px;
            font-size: 12px;
            user-select: none;
            margin-top: 2px; /* Ajustement visuel */
        }
        .toc-toggle:hover { color: #000; font-weight: bold; }

        #toc-action-btn {
            cursor: pointer;
            padding: 2px 8px;
            border-radius: 4px;
        }
        #toc-action-btn:hover { background: #dcdcdc; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    let ticTac;
    function myCallback() {
        if (document.querySelector('#MathJax_Message')) {
            console.log("Basthon détecté, lancement...");
            clearInterval(ticTac);
            setTimeout(createToC, 2000);
        }
    }
    ticTac = setInterval(myCallback, 1000);

    function createToC() {
        const notebookContainer = document.querySelector("#notebook-container");
        const siteContainer = document.querySelector("#site");

        if (!notebookContainer || !siteContainer) return;

        const headers = Array.from(notebookContainer.querySelectorAll(".text_cell_render.rendered_html h1, .text_cell_render.rendered_html h2, .text_cell_render.rendered_html h3, .text_cell_render.rendered_html h4, .text_cell_render.rendered_html h5, .text_cell_render.rendered_html h6"));

        if (headers.length === 0) return;

        const tocContainer = document.createElement("div");
        tocContainer.id = "toc-container";

        // HEADER
        const headerDiv = document.createElement("div");
        headerDiv.id = "toc-header";
        const titleSpan = document.createElement("span");
        titleSpan.innerText = "Table des Matières";
        const actionBtn = document.createElement("span");
        actionBtn.id = "toc-action-btn";
        actionBtn.innerText = "➖"; 
        actionBtn.title = "Réduire";

        actionBtn.onclick = (e) => {
            e.stopPropagation();
            if (tocContainer.classList.contains("minimized")) {
                tocContainer.classList.remove("minimized");
                actionBtn.innerText = "➖";
                actionBtn.title = "Réduire";
            } else {
                tocContainer.classList.add("minimized");
                setTimeout(() => {
                    actionBtn.innerText = "📌";
                    actionBtn.title = "Épingler";
                }, 200);
            }
        };
        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(actionBtn);

        const badgeIcon = document.createElement("div");
        badgeIcon.id = "toc-badge-icon";
        badgeIcon.innerHTML = "☰"; 
        badgeIcon.onclick = () => {
            tocContainer.classList.remove("minimized");
            actionBtn.innerText = "➖";
        };

        // CONTENU
        const contentDiv = document.createElement("div");
        contentDiv.id = "toc-content";
        contentDiv.className = "toc-list";

        const rootUl = document.createElement("ul");
        let activePath = [{ level: 0, element: rootUl }];

        headers.forEach((header, index) => {
            const id = "toc-header-" + index;
            header.id = id;
            const currentLevel = parseInt(header.tagName[1]);

            // Container pour l'élément (Ligne + Enfants)
            const li = document.createElement("li");
            li.className = "toc-item-container";

            // Wrapper Flexbox pour la ligne (Flèche + Lien)
            const rowDiv = document.createElement("div");
            rowDiv.className = "toc-item-row";

            const toggleSpan = document.createElement("span");
            toggleSpan.className = "toc-toggle";
            toggleSpan.innerText = "▼"; 
            toggleSpan.style.visibility = "hidden";
            
            const link = document.createElement("a");
            link.href = "#" + id;
            link.innerText = header.innerText;
            link.className = "toc-link";
            link.onclick = (e) => {
                e.preventDefault();
                header.scrollIntoView({ behavior: "smooth" });
            };

            rowDiv.appendChild(toggleSpan);
            rowDiv.appendChild(link);
            li.appendChild(rowDiv);

            while (activePath.length > 1 && activePath[activePath.length - 1].level >= currentLevel) {
                activePath.pop();
            }

            const parentUl = activePath[activePath.length - 1].element;
            parentUl.appendChild(li);

            const childUl = document.createElement("ul");
            li.appendChild(childUl); // Le UL est sous la ligne flexbox
            activePath.push({ level: currentLevel, element: childUl });

            // LOGIQUE DE COMPTAGE (Enfants directs uniquement)
            const nextHeader = headers[index + 1];
            if (nextHeader && parseInt(nextHeader.tagName[1]) > currentLevel) {
                toggleSpan.style.visibility = "visible";
                
                let subItemsCount = 0;
                for (let i = index + 1; i < headers.length; i++) {
                    const hTagLevel = parseInt(headers[i].tagName[1]);
                    if (hTagLevel <= currentLevel) break; // Fin de la section
                    
                    // On compte uniquement le niveau N+1
                    if (hTagLevel === currentLevel + 1) { 
                        subItemsCount++;
                    }
                }

                // Seuil > 6 enfants directs
                let isCollapsed = subItemsCount > 6;
                
                if (isCollapsed) {
                    childUl.style.display = "none";
                    toggleSpan.innerText = "▶";
                } else {
                    childUl.style.display = "block";
                    toggleSpan.innerText = "▼";
                }

                toggleSpan.onclick = (e) => {
                    e.stopPropagation();
                    isCollapsed = !isCollapsed;
                    childUl.style.display = isCollapsed ? "none" : "block";
                    toggleSpan.innerText = isCollapsed ? "▶" : "▼";
                };
            }
        });

        contentDiv.appendChild(rootUl);
        tocContainer.appendChild(badgeIcon);
        tocContainer.appendChild(headerDiv);
        tocContainer.appendChild(contentDiv);
        siteContainer.insertBefore(tocContainer, siteContainer.firstChild);
    }
})();