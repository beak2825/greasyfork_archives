// ==UserScript==
// @name         StashDB + Pornbox + WhoresHub Search
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Search your favorite video/actress on multiple sites
// @author       NoOne
// @icon         https://pornbox.com/favicon.ico
// @match        https://stashdb.org/*
// @match        https://stashdb.org/scenes/*
// @match        https://pornbox.com/application/watch-page/*
// @match        https://www.whoreshub.com/videos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551890/StashDB%20%2B%20Pornbox%20%2B%20WhoresHub%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/551890/StashDB%20%2B%20Pornbox%20%2B%20WhoresHub%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function encodeWhoresHubTitle(str) {
        const encoded = encodeURIComponent(str);
        return encoded.replace(/%2F/g, '%252F');
    }

    const sites = [
        { name: "StashDB", formatTitle: t => t, url: "https://stashdb.org/search/TITRE" },
        { name: "Simpcity", formatTitle: t => t.trim(), url: "https://simpcity.cr/search/?q=TITRE" },
        { name: "Sxyprn", formatTitle: t => t.trim().replace(/\s+/g, '-').replace(/[^\w\-]/g,''), url: "https://sxyprn.com/TITRE.html" },
        { name: "XMovies", formatTitle: t => t, url: "https://xmoviesforyou.com/?s=TITRE" },
        { name: "WhoresHub", formatTitle: t => t.trim().replace(/\s+/g, '-'), url: "https://www.whoreshub.com/search/TITRE/", customEncode: true }
    ];

    function getSceneTitle() {
        if (location.hostname.includes('stashdb.org')) {
            const span = document.querySelector('.card-header h3 span');
            return span ? span.textContent.trim() : '';
        } else if (location.hostname.includes('pornbox.com')) {
            const h1 = document.querySelector('h1.scene-title');
            return h1 ? h1.textContent.trim() : '';
        } else if (location.hostname.includes('whoreshub.com')) {
            const h1 = document.querySelector('h1.title');
            return h1 ? h1.textContent.trim() : '';
        }
        return '';
    }

    function createPanelButton(name, onClick) {
        const btn = document.createElement('button');
        btn.textContent = name;
        Object.assign(btn.style, {
            flex: '1',
            padding: '6px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            background: '#30404d',
            color: 'white',
            fontWeight: 'bold',
            transition: 'background 0.2s'
        });
        btn.addEventListener('mouseenter', () => btn.style.background = '#3a4c5e');
        btn.addEventListener('mouseleave', () => btn.style.background = '#30404d');
        btn.addEventListener('click', onClick);
        return btn;
    }

    const panelBtn = document.createElement('button');
    panelBtn.textContent = '🔍';
    Object.assign(panelBtn.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: 9999,
        background: '#202b33',
        border: '2px solid white',
        color: 'white',
        borderRadius: '8px',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        transition: 'background 0.2s'
    });
    panelBtn.addEventListener('mouseenter', () => panelBtn.style.background = '#2a3a4d');
    panelBtn.addEventListener('mouseleave', () => panelBtn.style.background = '#202b33');
    document.body.appendChild(panelBtn);

    const panelContainer = document.createElement('div');
    Object.assign(panelContainer.style, {
        position: 'fixed',
        bottom: '60px',
        left: '10px',
        background: '#202b33',
        border: '2px solid white',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: 'none',
        zIndex: 9999,
        width: '300px',
        fontSize: '14px'
    });
    document.body.appendChild(panelContainer);

    const inputWrapper = document.createElement('div');
    inputWrapper.style.display = 'flex';
    inputWrapper.style.gap = '4px';
    panelContainer.appendChild(inputWrapper);

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '❌';
    Object.assign(clearBtn.style, {
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
        background: '#ee8aa9',
        color: 'black',
        width: '30px'
    });
    inputWrapper.appendChild(clearBtn);

    const pasteBtn = document.createElement('button');
    pasteBtn.textContent = '🧷';
    Object.assign(pasteBtn.style, {
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
        background: '#8aeebb',
        color: 'black',
        width: '30px'
    });
    inputWrapper.appendChild(pasteBtn);

    const input = document.createElement('input');
    Object.assign(input.style, {
        flex: '1',
        padding: '6px',
        borderRadius: '4px',
        border: 'none',
        background: '#1a1a1a',
        color: 'white'
    });
    input.setAttribute('placeholder', 'Search term...');
    inputWrapper.appendChild(input);

    let userEdited = false;
    clearBtn.addEventListener('click', () => { input.value = ''; userEdited = true; });
    input.addEventListener('input', () => { userEdited = true; });

    pasteBtn.addEventListener('mousedown', e => e.preventDefault()); // Prevent context menu
    pasteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                input.value = text.trim();
                userEdited = true;
            } else {
                alert('Presse-papiers vide.');
            }
        } catch (err) {
            alert('Impossible d’accéder au presse-papiers : ' + err);
        }
    });

    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        display: 'flex',
        gap: '6px',
        marginTop: '6px',
        flexWrap: 'wrap'
    });
    panelContainer.appendChild(btnContainer);

    sites.forEach(site => {
        const btn = createPanelButton(site.name, () => {
            const term = input.value.trim();
            if (!term) return alert('Please enter a search term!');
            const formatted = site.formatTitle(term);
            const encoded = site.customEncode ? encodeWhoresHubTitle(formatted) : encodeURIComponent(formatted);
            const url = site.url.replace('TITRE', encoded);
            window.open(url, '_blank');
        });
        btnContainer.appendChild(btn);
    });

    let lastURL = location.href;
    function checkURLChange() {
        if (location.href !== lastURL) {
            lastURL = location.href;
            userEdited = false;
            input.value = getSceneTitle();
        }
    }
    setInterval(checkURLChange, 500);

    let isOpen = false;
    panelBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            panelContainer.style.pointerEvents = 'auto';
            panelContainer.style.opacity = '1';
            panelContainer.style.transform = 'translateY(0)';
            if (!userEdited) input.value = getSceneTitle();
        } else {
            panelContainer.style.opacity = '0';
            panelContainer.style.transform = 'translateY(10px)';
            panelContainer.style.pointerEvents = 'none';
        }
    });

})();
