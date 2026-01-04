// ==UserScript==
// @name        Collapsible Sidebar for old.reddit
// @name:es     Barra Lateral Colapsable para old.reddit
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/*
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.2
// @author      -
// @description Toggles sidebar. Expands main content.
// @description:es Añade un botón en la parte superior derecha que colapsa la barra lateral y fuerza al contenido principal a ocupar el 100% del ancho disponible.
// @license     MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/558189/Collapsible%20Sidebar%20for%20oldreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/558189/Collapsible%20Sidebar%20for%20oldreddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Create the Toggle Button
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'side-switch-btn';
    toggleBtn.innerText = '«'; 
    document.body.appendChild(toggleBtn);

    // 2. The CSS Logic
    const css = `
    /* --- BUTTON STYLE --- */
    #side-switch-btn {
        position: fixed;
        top: 65px;
        right: 0;
        width: 30px;
        height: 40px;
        background-color: #0079d3;
        color: white;
        font-weight: bold;
        font-size: 20px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        z-index: 2147483650;
        border-radius: 4px 0 0 4px;
        box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
        user-select: none;
        transition: background-color 0.2s;
    }
    #side-switch-btn:hover {
        background-color: #005599;
    }

    /* =======================================================
       ACTIVE STATE: SIDEBAR HIDDEN
       ======================================================= */
    
    /* 1. CONTAINER EXPANSION - CORREGIDO */
    /* Target div.content and specific children ONLY. */
    html body.sidebar-hidden div.content,
    html body.sidebar-hidden .commentarea,
    html body.sidebar-hidden #siteTable, 
    html body.sidebar-hidden .panestack-title,
    html body.sidebar-hidden .menuarea {
        margin-right: 10px !important;
        padding-right: 0 !important;
        border-right: none !important;
        width: auto !important;       /* Deja que el navegador calcule el ancho basándose en los márgenes */
        min-width: 0 !important;      /* ELIMINADO EL 98% QUE CAUSABA EL DESBORDAMIENTO */
        max-width: 100% !important;
        float: none !important;
    }

    /* 2. SPECIFIC NESTED TABLE EXPANSION */
    html body.sidebar-hidden div.content .sitetable {
        width: 100% !important;
        max-width: none !important;
    }

    /* 3. NESTED COMMENT EXPANSION */
    html body.sidebar-hidden .child,
    html body.sidebar-hidden .listing,
    html body.sidebar-hidden .nestedlisting {
        max-width: 100% !important;
        width: auto !important;
        margin-right: 0 !important;
    }

    /* 4. TEXT BLOCK EXPANSION (Reading text) */
    html body.sidebar-hidden .md, 
    html body.sidebar-hidden .md-container, 
    html body.sidebar-hidden .usertext-body,
    html body.sidebar-hidden .entry,
    html body.sidebar-hidden .link,
    html body.sidebar-hidden .comment {
        max-width: none !important;
        width: auto !important;
    }

    /* 5. INPUT AREA EXPANSION (Writing text) - THE FIX */
    /* Force textareas to fill the container instead of shrinking to cols="1" */
    html body.sidebar-hidden .usertext-edit textarea {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 500px !important; /* Safety floor */
        box-sizing: border-box !important;
    }

    /* 6. Hide the Sidebar & Ad Containers */
    html body.sidebar-hidden .side,
    html body.sidebar-hidden .premium-banner-outer, 
    html body.sidebar-hidden .side .spacer .frame,
    html body.sidebar-hidden .infobar { 
        display: none !important; 
    }
    `;

    // 3. Inject CSS
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // 4. Initialize Default State (Hidden)
    document.body.classList.add('sidebar-hidden');

    // 5. Toggle Logic
    toggleBtn.addEventListener('click', function() {
        if (document.body.classList.contains('sidebar-hidden')) {
            document.body.classList.remove('sidebar-hidden');
            toggleBtn.innerText = '»';
            toggleBtn.style.backgroundColor = '#ff4500'; 
        } else {
            document.body.classList.add('sidebar-hidden');
            toggleBtn.innerText = '«';
            toggleBtn.style.backgroundColor = '#0079d3'; 
        }
    });

})();