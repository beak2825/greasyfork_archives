// ==UserScript==
// @name         Anime-Sama : Synchro Auto & Multi-Profils
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Sauvegarde automatique de l'historique lors des changements de domaine et gestion de profils multiples.
// @author       SySkYll
// @license      GPL-3.0-or-later
// @include      /^https?:\/\/.*anime-sama\..*\/.*$/
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560003/Anime-Sama%20%3A%20Synchro%20Auto%20%20Multi-Profils.user.js
// @updateURL https://update.greasyfork.org/scripts/560003/Anime-Sama%20%3A%20Synchro%20Auto%20%20Multi-Profils.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentProfile = GM_getValue("as_active_profile", "Principal");
    let profiles = GM_getValue("as_profile_list", ["Principal"]);
    let pendingData = null;

    // --- LOGIQUE DE CIBLAGE DES DONNÉES ---

    /**
     * Détermine si une clé du localStorage doit être sauvegardée/gérée par le profil.
     * Inclut désormais : histo, watchlist, favori, vu.
     */
    const isTrackedKey = (key) => {
        if (!key) return false;
        return key.startsWith("histo") ||
               key.startsWith("watchlist") ||
               key.startsWith("favori") ||
               key.startsWith("vu");
    };

    // --- LOGIQUE DE NETTOYAGE ET SAUVEGARDE ---

    const clearSiteLocalStorage = () => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // On supprime si la clé correspond à l'un des préfixes gérés
            if (isTrackedKey(key)) keysToRemove.push(key);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    };

    const forceSave = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // On sauvegarde si la clé correspond à l'un des préfixes gérés
            if (isTrackedKey(key)) data[key] = localStorage.getItem(key);
        }
        // On ne sauvegarde que si on n'est pas sur un profil fraîchement vidé (sauf si c'est pour sauvegarder un état vide intentionnel, mais ici on protège contre le vide accidentel au chargement)
        // Note: Si vous supprimez tout manuellement, la sauvegarde suivante écrasera avec du vide, ce qui est correct.
        if (Object.keys(data).length > 0) GM_setValue(`as_backup_${currentProfile}`, data);
    };

    const createAndLoadProfile = (name, data = {}) => {
        // 1. Sauvegarder l'ancien profil avant de partir (Histo + Watchlist + Favs + Vus)
        forceSave();

        // 2. Ajouter le nom à la liste si besoin
        if (!profiles.includes(name)) {
            profiles.push(name);
            GM_setValue("as_profile_list", profiles);
        }

        // 3. Vider le site et injecter les nouvelles données (vides ou importées)
        clearSiteLocalStorage();
        GM_setValue(`as_backup_${name}`, data);

        // 4. Activer le nouveau profil
        GM_setValue("as_active_profile", name);
        location.reload();
    };

    // --- DESIGN & INTERFACE (Reste inchangé mais fonctionnel avec les nouvelles données) ---

    const style = document.createElement('style');
    style.innerHTML = `
        #as-profile-container { position: relative; display: flex; align-items: center; cursor: pointer; padding: 0 15px; height: 100%; color: #FFFFFF; transition: color 0.2s; }
        #as-profile-container:hover { color: #10b981; }
        #as-dropdown { position: absolute; top: 100%; right: 0; background: #111827; border: 2px solid #374151; border-radius: 0 0 0.5rem 0.5rem; min-width: 250px; display: none; z-index: 99999; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7); padding: 0.5rem 0; }
        #as-profile-container:hover #as-dropdown { display: block; }
        .as-item { padding: 0.75rem 1rem; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: 500; }
        .as-item:hover { background: #1f2937; color: #10b981; }
        .as-item.active { color: #10b981; font-weight: 700; background: rgba(16, 185, 129, 0.1); }
        .as-divider { height: 1px; background: #374151; margin: 0.5rem 0; }
        .as-action { font-size: 0.8rem; padding: 0.7rem 1rem; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 600; }
        .as-action:hover { background: #1f2937; color: #10b981; }
        .as-action svg { width: 18px; height: 18px; }
        #as-import-zone { background: #0f172a; padding: 12px; margin: 8px; border-radius: 0.5rem; display: none; flex-direction: column; gap: 8px; border: 2px solid #10b981; }
        .btn-as { border: none; padding: 10px; border-radius: 0.3rem; color: white; cursor: pointer; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .btn-as-primary { background: #10b981; }
        .btn-as-secondary { background: #4b5563; }
    `;
    document.head.appendChild(style);

    function createUI() {
        if (document.getElementById('as-profile-container')) return;
        const nav = document.querySelector('.asn-nav-desktop');
        if (!nav) return;

        const container = document.createElement('div');
        container.id = 'as-profile-container';

        let profileHTML = profiles.map(p => `
            <div class="as-item ${p === currentProfile ? 'active' : ''}" data-name="${p}">
                <span>${p}</span>
                <div style="display:flex; align-items:center; gap:8px;">
                    ${(p !== 'Principal' && p !== currentProfile) ? `<span class="as-del-btn" data-del="${p}" title="Supprimer" style="color:#ef4444; font-size:18px; font-weight:bold; padding:0 5px;">×</span>` : ''}
                    ${p === currentProfile ? '<svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <svg style="margin-right:8px; color:#10b981;" width="22" height="22" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
            <span style="font-size: 15px; font-weight: 700;">${currentProfile}</span>
            <div id="as-dropdown">
                <div style="padding: 10px 16px; font-size: 11px; color: #10b981; font-weight: 800; text-transform: uppercase;">Mes Profils</div>
                ${profileHTML}
                <div class="as-divider"></div>
                <div class="as-action" id="as-add-prof"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 4.5v15m7.5-7.5h-15" /></svg> Nouveau profil vide</div>
                <div class="as-action" id="as-trigger-file"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg> Importer JSON</div>
                <div id="as-import-zone">
                    <button class="btn-as btn-as-primary" id="as-btn-new">Créer nouveau profil</button>
                    <button class="btn-as btn-as-secondary" id="as-btn-overwrite">Écraser l'actuel</button>
                </div>
                <div class="as-action" id="as-dl-prof"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> Télécharger JSON</div>
                <div class="as-action" id="as-reset-prof" style="color:#ff4d4d;"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.244 2.244 0 01-2.244 2.077H8.084a2.244 2.244 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg> Tout effacer (Ce profil)</div>
            </div>
        `;

        // Événements
        container.querySelectorAll('.as-del-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Supprimer définitivement le profil "${btn.dataset.del}" ?`)) {
                    profiles = profiles.filter(p => p !== btn.dataset.del);
                    GM_setValue("as_profile_list", profiles);
                    GM_setValue(`as_backup_${btn.dataset.del}`, undefined);
                    location.reload();
                }
            };
        });

        container.querySelector('#as-trigger-file').onclick = (e) => {
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'file'; input.accept = '.json';
            input.onchange = ev => {
                const reader = new FileReader();
                reader.onload = re => {
                    try {
                        pendingData = JSON.parse(re.target.result);
                        container.querySelector('#as-import-zone').style.display = 'flex';
                    } catch (err) { alert("Fichier invalide"); }
                };
                reader.readAsText(ev.target.files[0]);
            };
            input.click();
        };

        container.querySelector('#as-btn-new').onclick = (e) => {
            e.stopPropagation();
            const n = prompt("Nom du profil :"); if (n) createAndLoadProfile(n, pendingData);
        };

        container.querySelector('#as-btn-overwrite').onclick = (e) => {
            e.stopPropagation();
            if (confirm("Remplacer l'actuel ?")) {
                clearSiteLocalStorage();
                GM_setValue(`as_backup_${currentProfile}`, pendingData);
                location.reload();
            }
        };

        container.querySelectorAll('.as-item').forEach(item => {
            item.onclick = () => {
                if (item.dataset.name === currentProfile) return;
                forceSave(); // Sauvegarde Histo + Watchlist + Favs + Vus du profil actuel
                clearSiteLocalStorage(); // Nettoie le site
                const newData = GM_getValue(`as_backup_${item.dataset.name}`, {});
                for (const [k, v] of Object.entries(newData)) localStorage.setItem(k, v); // Restaure le nouveau profil
                GM_setValue("as_active_profile", item.dataset.name);
                location.reload();
            };
        });

        container.querySelector('#as-add-prof').onclick = () => {
            const n = prompt("Nom du profil vide :"); if (n) createAndLoadProfile(n, {});
        };

        container.querySelector('#as-dl-prof').onclick = () => {
            // Force save avant de télécharger pour avoir les dernières données
            forceSave();
            const d = GM_getValue(`as_backup_${currentProfile}`, {});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], {type: "application/json"}));
            a.download = `FullBackup_${currentProfile}.json`; a.click();
        };

        container.querySelector('#as-reset-prof').onclick = () => {
            if (confirm("Vider TOUT (Histo, Watchlist, Favs, Vus) pour ce profil ?")) {
                clearSiteLocalStorage();
                GM_setValue(`as_backup_${currentProfile}`, {});
                location.reload();
            }
        };

        nav.appendChild(container);
    }

    // Chargement initial
    const initialData = GM_getValue(`as_backup_${currentProfile}`, {});
    for (const [k, v] of Object.entries(initialData)) {
        if (v !== null && v !== undefined) localStorage.setItem(k, v);
    }

    const observer = new MutationObserver(() => { if (document.querySelector('.asn-nav-desktop')) createUI(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    // Sauvegarde automatique régulière
    setInterval(forceSave, 3000);
})();