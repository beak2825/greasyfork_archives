// ==UserScript==
// @name         Monlycee SPA Patch
// @namespace    https://monlycee.net/
// @version      1.6
// @description  Patch ENT
// @author       Icheru
// @match        *://auth.monlycee.net/*
// @match        *://psn.monlycee.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555721/Monlycee%20SPA%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/555721/Monlycee%20SPA%20Patch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BADGE_ID = 'monlycee-patch-badge-icheru';
    const BADGE_TEXT = "Patched By Icheru";
    const AUTO_HIDE_MS = 8000;
    let hideTimeout;

    function logStatus(message, type = "info") {
        let emoji = "ℹ️";
        if (type === "success") emoji = "✅";
        if (type === "warn") emoji = "⚠️";
        if (type === "error") emoji = "❌";

        console.log(`[Monlycee Patch] ${message}`);
        updateBadge(`${emoji} ${message}`, type);
    }

    function createBadge() {
        if (document.getElementById(BADGE_ID)) return;

        const badge = document.createElement('div');
        badge.id = BADGE_ID;
        badge.style.position = 'fixed';
        badge.style.right = '20px';
        badge.style.bottom = '20px';
        badge.style.zIndex = '999999';
        badge.style.minWidth = '240px';
        badge.style.maxWidth = '320px';
        badge.style.background = 'rgba(0,0,0,0.5)';
        badge.style.backdropFilter = 'blur(10px) saturate(120%)';
        badge.style.border = '1px solid rgba(255,255,255,0.2)';
        badge.style.borderRadius = '14px';
        badge.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
        badge.style.color = 'white !important';
        badge.style.fontFamily = 'Inter, system-ui, sans-serif';
        badge.style.fontSize = '13px';
        badge.style.padding = '12px 14px';
        badge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px)';
        badge.innerHTML = `
            <strong style="color:white !important;">${BADGE_TEXT}</strong>
            <div id="ml-log" style="margin-top:8px;font-size:12px;line-height:1.4;white-space:pre-line;color:white !important;"></div>
        `;

        document.body.appendChild(badge);

        // Apparition animée
        requestAnimationFrame(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
        });
    }

    function updateBadge(text, type = "info") {
        createBadge();
        const container = document.getElementById("ml-log");
        if (!container) return;

        container.innerHTML = text;

        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            const badge = document.getElementById(BADGE_ID);
            if (badge) {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(20px)';
                setTimeout(() => { try { badge.remove(); } catch(e){} }, 500);
            }
        }, AUTO_HIDE_MS);
    }

    // Patch checkCookiesAndSetTimer
    window.addEventListener('error', e => {
        if (e.message && e.message.includes("checkCookiesAndSetTimer")) {
            window.checkCookiesAndSetTimer = () => logStatus("checkCookiesAndSetTimer patchée", "warn");
            e.preventDefault();
        }
    });

    // Forcer HTTPS
    if (location.protocol === 'http:') {
        logStatus("Redirection forcée vers HTTPS", "warn");
        location.href = location.href.replace('http:', 'https:');
        return;
    }

    // Observer SPA
    function monitorSPA() {
        const target = document.getElementById('app');
        if (!target) {
            logStatus("ENT détecté, veuillez vous connecter...", "success");
            setTimeout(monitorSPA, 1000);
            return;
        }

        const observer = new MutationObserver(() => {
            const text = target.innerText || "";
            if (text.match(/Bienvenue|ENT|Mon lycée/i)) {
                logStatus("Connexion détectée", "success");
            } else if (text.match(/Erreur|Service indisponible|Impossible/i)) {
                logStatus("Erreur détectée dans le contenu SPA", "error");
            }
        });

        observer.observe(target, { childList: true, subtree: true });
        logStatus("Observation SPA initialisée", "info");
    }

    window.addEventListener('load', () => {
        createBadge();
        monitorSPA();
    });

})();
