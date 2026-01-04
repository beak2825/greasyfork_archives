// ==UserScript==
// @name         Skip CurseForge Countdown
// @namespace    https://curseforge.com/
// @version      3.0.0
// @description  Instantly downloads from CurseForge with NO countdown, NO redirect, to use press the download button under the install app dropdown.
// @author       Filip (https://github.com/f1amee-dev)
// @match        https://www.curseforge.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561243/Skip%20CurseForge%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/561243/Skip%20CurseForge%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', async function(e) {
        const link = e.target.closest('a[href*="/download"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || !href.includes('/download') || href.includes('/api/v1/mods/')) return;

        const fileMatch = href.match(/\/download\/(\d+)/);
        const fileId = fileMatch ? fileMatch[1] : null;

        let slug = null;
        const slugMatch = href.match(/curseforge\.com\/(.+?)\/download/) || href.match(/^\/(.+?)\/download/);
        if (slugMatch) {
            slug = slugMatch[1];
        } else {
            const pageMatch = window.location.pathname.match(/^\/([^/]+\/[^/]+\/[^/]+)/);
            if (pageMatch) slug = pageMatch[1];
        }

        if (!fileId || !slug) return;

        e.preventDefault();
        e.stopPropagation();

        try {
            const resp = await fetch(`https://api.cfwidget.com/${slug}`);
            if (!resp.ok) throw new Error();
            const data = await resp.json();
            if (!data.id) throw new Error();

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = `https://www.curseforge.com/api/v1/mods/${data.id}/files/${fileId}/download`;
            document.body.appendChild(iframe);
            setTimeout(() => iframe.remove(), 5000);
        } catch {
            window.location.href = link.href;
        }
    }, true);
})();
