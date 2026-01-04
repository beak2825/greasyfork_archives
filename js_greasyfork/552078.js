// ==UserScript==
// @name         GeoGuessr Force NMPZ
// @name:ja      GeoGuessr 強制NMPZ
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  A script that forces NMPZ mode for yourself in GeoGuessr.
// @description:ja GeoGuessrで自分だけ強制的にNMPZモードにするスクリプトです。
// @author       sino
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/552078/GeoGuessr%20Force%20NMPZ.user.js
// @updateURL https://update.greasyfork.org/scripts/552078/GeoGuessr%20Force%20NMPZ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'nmpz_enabled';
    let menuCommandId = null;
    let isEnabled = GM_getValue(STORAGE_KEY, true);

    function isGamePage() {
        const path = window.location.pathname;
        return path.includes('/game/') ||
               path.includes('/duels/') ||
               path.includes('/team-duels/') ||
               path.includes('/live-challenge/') ||
               path.includes('/competitive-streak/') ||
               path.includes('/battle-royale/') ||
               path.includes('/bullseye/');
    }

    function preventEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function preventDragAndZoom(e) {
        if (e.type === 'mousemove' || e.type === 'wheel' ||
            e.type === 'touchmove' || e.type === 'drag' || e.type === 'dragstart') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    function preventMovementKeys(e) {
        if (!isEnabled || !isGamePage()) return;

        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        )) {
            return;
        }

        const key = e.key.toUpperCase();
        if (key === 'N' || key === 'W' || key === 'A' || key === 'S' || key === 'D') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    function disableMovementAndZoom() {
        if (!isGamePage() || !isEnabled) return false;

        const panorama = document.querySelector('div.game_panorama__6X071, div.duels-panorama_panorama__fLR_P, div.game-panorama_panorama__tyXtc, div.game_panorama__nn0wc, div.game_panorama__sRtAT, div.game-panorama_panorama__mlqJ_');
        if (!panorama || panorama.dataset.disableApplied === 'true') {
            return panorama && panorama.dataset.disableApplied === 'true';
        }

        let overlay = document.getElementById('geoguessr-disable-overlay');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'geoguessr-disable-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            cursor: pointer;
            background-color: transparent;
            pointer-events: auto;
        `;

        overlay.addEventListener('mousemove', preventDragAndZoom, true);
        overlay.addEventListener('wheel', preventDragAndZoom, true);
        overlay.addEventListener('touchmove', preventDragAndZoom, true);
        overlay.addEventListener('drag', preventDragAndZoom, true);
        overlay.addEventListener('dragstart', preventDragAndZoom, true);
        overlay.addEventListener('contextmenu', preventEvent, true);

        const currentPosition = getComputedStyle(panorama).position;
        if (currentPosition === 'static') {
            panorama.style.position = 'relative';
        }

        panorama.appendChild(overlay);
        panorama.dataset.disableApplied = 'true';

        return true;
    }

    const compassEventHandlers = new WeakMap();

    function disableControls() {
        if (!isGamePage() || !isEnabled) return false;

        let foundAny = false;

        const compassButtons = document.querySelectorAll('button.compass_compass__lRB0J.compass_clickable__Yt4eB[data-qa="compass"]');
        compassButtons.forEach(button => {
            if (!button.dataset.clickDisabled) {
                const handlers = {
                    click: (e) => preventEvent(e),
                    mousedown: (e) => preventEvent(e),
                    mouseup: (e) => preventEvent(e),
                    touchstart: (e) => preventEvent(e),
                    touchend: (e) => preventEvent(e)
                };
                
                compassEventHandlers.set(button, handlers);
                
                button.addEventListener('click', handlers.click, true);
                button.addEventListener('mousedown', handlers.mousedown, true);
                button.addEventListener('mouseup', handlers.mouseup, true);
                button.addEventListener('touchstart', handlers.touchstart, true);
                button.addEventListener('touchend', handlers.touchend, true);
                button.style.pointerEvents = 'none';
                button.dataset.clickDisabled = 'true';
                foundAny = true;
            }
        });

        return foundAny;
    }

    function enableControls() {
        const compassButtons = document.querySelectorAll('button.compass_compass__lRB0J.compass_clickable__Yt4eB[data-qa="compass"]');
        compassButtons.forEach(button => {
            if (button.dataset.clickDisabled) {
                const handlers = compassEventHandlers.get(button);
                if (handlers) {
                    button.removeEventListener('click', handlers.click, true);
                    button.removeEventListener('mousedown', handlers.mousedown, true);
                    button.removeEventListener('mouseup', handlers.mouseup, true);
                    button.removeEventListener('touchstart', handlers.touchstart, true);
                    button.removeEventListener('touchend', handlers.touchend, true);
                    compassEventHandlers.delete(button);
                }
                button.style.pointerEvents = '';
                delete button.dataset.clickDisabled;
            }
        });
    }

    function removeControlGroups() {
        if (!isGamePage() || !isEnabled) return false;

        let foundAny = false;
        const controlGroups = document.querySelectorAll('div.styles_controlGroup__2t2NT');
        controlGroups.forEach(group => {
            if (!group.dataset.removed) {
                group.dataset.removed = 'true';
                group.style.display = 'none';
                foundAny = true;
            }
        });

        const columnTwo = document.querySelectorAll('div.styles_columnTwo__kyT60');
        columnTwo.forEach(col => {
            if (!col.dataset.removed) {
                col.dataset.removed = 'true';
                col.style.display = 'none';
                foundAny = true;
            }
        });

        return foundAny;
    }

    function restoreControlGroups() {
        const controlGroups = document.querySelectorAll('div.styles_controlGroup__2t2NT');
        controlGroups.forEach(group => {
            if (group.dataset.removed) {
                group.style.display = '';
                delete group.dataset.removed;
            }
        });

        const columnTwo = document.querySelectorAll('div.styles_columnTwo__kyT60');
        columnTwo.forEach(col => {
            if (col.dataset.removed) {
                col.style.display = '';
                delete col.dataset.removed;
            }
        });
    }

    function removeTooltips() {
        if (!isGamePage() || !isEnabled) return false;

        let foundAny = false;

        const tooltips = document.querySelectorAll('div.tooltip_tooltip__3D6bz');
        tooltips.forEach(tooltip => {
            if (!tooltip.dataset.removed) {
                tooltip.dataset.removed = 'true';
                tooltip.style.display = 'none';
                foundAny = true;
            }
        });

        return foundAny;
    }

    function restoreTooltips() {
        const tooltips = document.querySelectorAll('div.tooltip_tooltip__3D6bz');
        tooltips.forEach(tooltip => {
            if (tooltip.dataset.removed) {
                tooltip.style.display = '';
                delete tooltip.dataset.removed;
            }
        });
    }

    function removeOverlay() {
        const overlay = document.getElementById('geoguessr-disable-overlay');
        if (overlay) overlay.remove();

        const panoramas = document.querySelectorAll('div.game_panorama__6X071, div.duels-panorama_panorama__fLR_P, div.game-panorama_panorama__tyXtc, div.game_panorama__nn0wc, div.game_panorama__sRtAT, div.game-panorama_panorama__mlqJ_');
        panoramas.forEach(panorama => {
            delete panorama.dataset.disableApplied;
        });
    }

    function enableFeatures() {
        if (isGamePage()) {
            disableMovementAndZoom();
            disableControls();
            removeControlGroups();
            removeTooltips();
        }
    }

    function disableFeatures() {
        removeOverlay();
        enableControls();
        restoreControlGroups();
        restoreTooltips();
    }

    function toggleEnabled() {
        isEnabled = !isEnabled;
        GM_setValue(STORAGE_KEY, isEnabled);

        if (isEnabled) {
            enableFeatures();
        } else {
            disableFeatures();
        }

        updateMenuCommand();
    }

    function updateMenuCommand() {
        if (menuCommandId !== null) {
            GM_unregisterMenuCommand(menuCommandId);
        }

        const status = isEnabled ? 'Enabled ✅' : 'Disabled ❌';
        menuCommandId = GM_registerMenuCommand(`NMPZ Mode: ${status}`, toggleEnabled, {
            autoClose: false
        });
    }

    document.addEventListener('keydown', preventMovementKeys, true);
    document.addEventListener('keyup', preventMovementKeys, true);
    document.addEventListener('keypress', preventMovementKeys, true);

    let currentUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;

            if (isGamePage()) {
                removeOverlay();

                let attempts = 0;
                const maxAttempts = 20;
                const intervalId = setInterval(() => {
                    attempts++;
                    if (isEnabled) {
                        disableMovementAndZoom();
                        disableControls();
                        removeControlGroups();
                        removeTooltips();
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(intervalId);
                    }
                }, 500);
            } else {
                removeOverlay();
            }
        }
    });

    urlObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(() => {
        if (isGamePage() && isEnabled) {
            disableControls();
            removeControlGroups();
            removeTooltips();
        }
    }, 100);

    if (isGamePage()) {
        let attempts = 0;
        const maxAttempts = 20;
        const intervalId = setInterval(() => {
            attempts++;
            if (isEnabled) {
                disableMovementAndZoom();
                disableControls();
                removeControlGroups();
                removeTooltips();
            }

            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
            }
        }, 500);
    }

    updateMenuCommand();
})();
