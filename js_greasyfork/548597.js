// ==UserScript==
// @name         Utilités pour VoirAnime par Myuui
// @namespace    http://tampermonkey.net/
// @version      2.9.2
// @description  Sélection automatique du lecteur et passage à un épisode précis sur VoirAnime
// @match        *://v6.voiranime.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548597/Utilit%C3%A9s%20pour%20VoirAnime%20par%20Myuui.user.js
// @updateURL https://update.greasyfork.org/scripts/548597/Utilit%C3%A9s%20pour%20VoirAnime%20par%20Myuui.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;
    const log = (...args) => DEBUG && console.log("[AutoPlayer]", ...args);

    let preferredHost = GM_getValue("preferredHost", "LECTEUR FHD1");
    let alreadyRedirected = false;

    // flags
    let playerSelected = false;
    let nativeSelectObserved = false;
    let episodeSearchBoxCreated = false;
    let menuCreated = false;
    let navLinksModified = false;
    let lastHostOptions = [];

    // debounce
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // clean
    const cleanupMenu = () => {
        const menu = document.getElementById('autoPlayerMenu');
        if (menu) {
            menu.remove();
            menuCreated = false;
            log("Menu removed (SPA)");
        }
    };

    // redirect
    const trySelectHost = () => {
        if (playerSelected || alreadyRedirected) return;
        const select = document.querySelector('select.host-select');
        if (!select) return;

        const urlParams = new URLSearchParams(window.location.search);
        const currentHostInUrl = urlParams.get('host');

        if (currentHostInUrl === preferredHost) {
            playerSelected = true;
            alreadyRedirected = true;
            return;
        }

        const hostOption = Array.from(select.options).find(opt => opt.value === preferredHost);
        if (hostOption) {
            playerSelected = true;
            alreadyRedirected = true;
            const redirectUrl = hostOption.getAttribute('data-redirect');
            if (redirectUrl) {
                log(`Redirecting to: ${preferredHost}`);
                window.location.href = redirectUrl;
            } else {
                showToast("Lien de redirection introuvable.", "error");
            }
        } else {
            const fallbackOption = Array.from(select.options).find(opt => opt.value !== preferredHost);
            if (fallbackOption) {
                showToast(`"${preferredHost}" indisponible. Utilisation de "${fallbackOption.value}".`, "warning");
                preferredHost = fallbackOption.value;
                GM_setValue("preferredHost", preferredHost);
                setTimeout(() => {
                    const redirectUrl = fallbackOption.getAttribute('data-redirect');
                    if (redirectUrl) window.location.href = redirectUrl;
                }, 1000);
            } else {
                showToast("Aucun lecteur disponible.", "error");
            }
        }
    };

    // sync si debile choisi sur le deroulant de voiranime
    const observeNativeSelect = () => {
        if (nativeSelectObserved) return;
        const select = document.querySelector('select.host-select');
        if (!select || select.hasAttribute('data-auto-sync-attached')) return;

        select.setAttribute('data-auto-sync-attached', 'true');
        nativeSelectObserved = true;

        select.addEventListener('change', function () {
            const selectedValue = this.value;
            if (selectedValue !== preferredHost) {
                preferredHost = selectedValue;
                GM_setValue("preferredHost", preferredHost);
                showToast(`Préférence mise à jour : ${preferredHost}`, "success");

                const currentHostInUrl = new URLSearchParams(window.location.search).get('host');
                if (currentHostInUrl !== preferredHost) {
                    const selectedOption = Array.from(this.options).find(opt => opt.value === preferredHost);
                    if (selectedOption) {
                        const redirectUrl = selectedOption.getAttribute('data-redirect');
                        if (redirectUrl) {
                            window.location.href = redirectUrl;
                        }
                    }
                }
            }
        });
    };

    // recherche episodes
    const createEpisodeSearchBox = () => {
        if (episodeSearchBoxCreated) return;

        const chapterSelect = document.querySelector('select.single-chapter-select');
        if (!chapterSelect || document.getElementById('episodeSearchBox')) return;

        const episodes = Array.from(chapterSelect.options).map(opt => opt.textContent.trim());

        const container = document.createElement('div');
        container.id = 'episodeSearchBox';
        container.style.cssText = `
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = episodes.length ? `Ex: ${episodes[0]}` : 'N° épisode';
        input.style.cssText = `
            padding: 6px 10px;
            border-radius: 4px;
            border: 1px solid #444;
            background: #222;
            color: white;
            font-size: 14px;
            outline: none;
        `;
        input.setAttribute('list', 'episodeSuggestions');

        const datalist = document.createElement('datalist');
        datalist.id = 'episodeSuggestions';
        episodes.forEach(ep => {
            const opt = document.createElement('option');
            opt.value = ep;
            datalist.appendChild(opt);
        });

        const label = document.createElement('label');
        label.innerText = 'Aller à :';
        label.style.cssText = `
            color: #ccc;
            font-size: 13px;
        `;

        container.append(label, input, datalist);
        chapterSelect.parentNode.insertBefore(container, chapterSelect);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (!query) return;

                const matchingOption = Array.from(chapterSelect.options).find(
                    opt => opt.textContent.trim() === query
                );

                if (matchingOption) {
                    const redirectUrl = matchingOption.getAttribute('data-redirect')?.trim();
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        showToast("URL de redirection introuvable pour cet épisode.", "error");
                    }
                } else {
                    showToast(`Épisode ${query} introuvable.`, "warning");
                }
            }
        });

        episodeSearchBoxCreated = true;
        log("Champ de recherche ajouté.");
    };

    // menu
    const createDynamicMenu = () => {
        const select = document.querySelector('select.host-select');
        if (!select) return;

        const currentOptions = Array.from(select.options).map(opt => opt.value);
        const optionsUnchanged = JSON.stringify(currentOptions) === JSON.stringify(lastHostOptions);

        if (menuCreated && optionsUnchanged) return;

        cleanupMenu();
        lastHostOptions = currentOptions;

        GM_addStyle(`
            #autoPlayerMenu {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px;
                background: rgba(30, 30, 30, 0.95);
                color: #fff;
                border-radius: 8px;
                z-index: 9999999;
                font-family: 'Segoe UI', sans-serif;
                font-size: 13px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                transition: all 0.3s ease;
                max-height: 80vh;
                overflow-y: auto;
                scrollbar-width: thin;
            }
            #autoPlayerMenu:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.6);
            }
            #autoPlayerMenu label {
                display: block;
                margin: 4px 0;
                cursor: pointer;
                padding: 4px 6px;
                border-radius: 4px;
                transition: background 0.2s;
            }
            #autoPlayerMenu label:hover {
                background: rgba(255,255,255,0.1);
            }
            #autoPlayerMenu input[type="radio"] {
                margin-right: 6px;
            }
            #autoPlayerMenu b {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                color: #4fc3f7;
                border-bottom: 1px solid #444;
                padding-bottom: 4px;
            }
        `);

        const menu = document.createElement("div");
        menu.id = "autoPlayerMenu";

        let menuHTML = `<b>Auto-select Lecteur</b>`;

        if (currentOptions.length === 0) {
            menuHTML += `<div style="color:#ccc;font-style:italic;">Aucun lecteur détecté</div>`;
        } else {
            currentOptions.forEach(hostName => {
                const isSelected = hostName === preferredHost;
                const displayName = hostName.replace('LECTEUR ', '').trim();
                menuHTML += `
                    <label>
                        <input type="radio" name="hostChoice" value="${hostName}" ${isSelected ? 'checked' : ''}>
                        ${displayName}
                    </label>`;
            });
        }

        menu.innerHTML = menuHTML;

        menu.addEventListener("change", (e) => {
            if (e.target.name === "hostChoice") {
                preferredHost = e.target.value;
                GM_setValue("preferredHost", preferredHost);
                showToast(`Auto-select défini sur : ${preferredHost}`, "success");

                const currentHostInUrl = new URLSearchParams(window.location.search).get('host');
                if (currentHostInUrl !== preferredHost) {
                    const option = Array.from(select.options).find(opt => opt.value === preferredHost);
                    if (option) {
                        const redirectUrl = option.getAttribute('data-redirect');
                        if (redirectUrl) {
                            window.location.href = redirectUrl;
                        }
                    }
                }

                navLinksModified = false;
                updateNavLinks();
            }
        });

        document.body.appendChild(menu);
        menuCreated = true;
        log("Menu mis à jour avec", currentOptions.length, "options.");
    };

    // redirection vers choix
    const updateNavLinks = () => {
        if (navLinksModified) return;

        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        const prevLink = navLinks.querySelector('.prev_page');
        const nextLink = navLinks.querySelector('.next_page');

        if (prevLink) {
            const url = new URL(prevLink.href);
            url.searchParams.set('host', preferredHost);
            prevLink.href = url.toString();
        }

        if (nextLink) {
            const url = new URL(nextLink.href);
            url.searchParams.set('host', preferredHost);
            nextLink.href = url.toString();
        }

        navLinksModified = true;
        log("Liens de navigation mis à jour avec le host:", preferredHost);
    };

    const debouncedRunAll = debounce(() => {
        try {
            trySelectHost();
            observeNativeSelect();
            createEpisodeSearchBox();
            createDynamicMenu();
            updateNavLinks();
        } catch (e) {
            console.error("[AutoPlayer] Erreur dans l'observer :", e);
        }
    }, 300);

    const observer = new MutationObserver(debouncedRunAll);
    observer.observe(document.body, { childList: true, subtree: true });

    // c'est parti mon kiki
    const runOnce = () => {
        try {
            trySelectHost();
            observeNativeSelect();
            createEpisodeSearchBox();
            createDynamicMenu();
            updateNavLinks();
        } catch (e) {
            console.error("[AutoPlayer] Erreur au démarrage :", e);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runOnce);
    } else {
        runOnce();
    }

    // notif
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        Object.assign(toast.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            background: type === "error" ? "#e53935" : type === "warning" ? "#fb8c00" : "#43a047",
            color: "white",
            borderRadius: "6px",
            zIndex: "99999999",
            fontSize: "14px",
            fontFamily: "sans-serif",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            opacity: "0",
            transition: "opacity 0.3s, transform 0.3s",
        });
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        }, 100);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-10px)";
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 3000);
    }

})();