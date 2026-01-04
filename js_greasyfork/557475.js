// ==UserScript==
// @name         OpenGuessr Blink (with preview-time GUI)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show Street View briefly then hide it (Blink) on OpenGuessr. Small GUI to set preview time and enable/disable.
// @author       adapted for you
// @match        https://openguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557475/OpenGuessr%20Blink%20%28with%20preview-time%20GUI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557475/OpenGuessr%20Blink%20%28with%20preview-time%20GUI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------
    // Settings (persisted)
    // -----------------------
    const STORAGE_KEY_SEC = 'og_blink_seconds';
    const STORAGE_KEY_ENABLED = 'og_blink_enabled';
    const DEFAULT_SEC = 1.0;

    let blinkSeconds = parseFloat(localStorage.getItem(STORAGE_KEY_SEC)) || DEFAULT_SEC;
    let enabled = (localStorage.getItem(STORAGE_KEY_ENABLED) !== 'disabled'); // enabled by default

    // -----------------------
    // State
    // -----------------------
    let hideTimeout = null;
    let attachedIframe = null;
    let lastSrc = null;

    // helper: set filter (use important to try to override other CSS)
    function setFilter(elem, value) {
        if (!elem) return;
        // use setProperty with priority to make sure it applies
        try {
            elem.style.setProperty('filter', value, 'important');
        } catch (e) {
            elem.style.filter = value;
        }
    }

    function hidePanorama(pano) {
        if (!pano) pano = document.querySelector('#PanoramaIframe');
        if (!pano) return;
        setFilter(pano, 'brightness(0%)');
    }

    function showPanorama(pano) {
        if (!pano) pano = document.querySelector('#PanoramaIframe');
        if (!pano) return;

        // cancel any pending hide
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        // reveal
        setFilter(pano, 'none');

        // schedule hide after blinkSeconds
        hideTimeout = setTimeout(() => {
            setFilter(pano, 'brightness(0%)');
            hideTimeout = null;
        }, Math.max(1, Math.round(blinkSeconds * 1000)));
    }

    // Called when a new panorama round loads (or iframe src changes)
    function onRoundStart(pano) {
        if (!enabled) {
            // if disabled, ensure panorama visible
            setFilter(pano, 'none');
            return;
        }

        // Small delay to allow iframe to render before blinking
        setTimeout(() => {
            showPanorama(pano);
        }, 80);
    }

    // Attach listeners / observers to the iframe element once it appears
    function attachToIframe(pano) {
        if (!pano) return;
        if (attachedIframe === pano) return; // already attached

        attachedIframe = pano;

        // Ensure transitions look clean
        try { pano.style.setProperty('transition', 'filter 120ms linear', 'important'); } catch (e) { pano.style.transition = 'filter 120ms linear'; }

        // listen for iframe load events (fires when the iframe navigates)
        pano.addEventListener('load', () => {
            const src = pano.getAttribute('src') || '';
            if (src !== lastSrc) {
                lastSrc = src;
                onRoundStart(pano);
            } else {
                // even if src is same, a load may mean content changed — still trigger
                onRoundStart(pano);
            }
        });

        // observe src attribute changes (some updates change src without triggering add/remove)
        const attrObserver = new MutationObserver(() => {
            const src = pano.getAttribute('src') || '';
            if (src && src !== lastSrc) {
                lastSrc = src;
                onRoundStart(pano);
            }
        });
        attrObserver.observe(pano, { attributes: true, attributeFilter: ['src'] });

        // Trigger an initial blink if the iframe already has a src
        lastSrc = pano.getAttribute('src') || lastSrc;
        if (lastSrc) {
            // small defer so iframe has time to paint
            setTimeout(() => onRoundStart(pano), 120);
        }
    }

    // Observe the document for the iframe being added/re-added
    const bodyObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node && node.nodeType === 1) {
                    // check direct node
                    if (node.id === 'PanoramaIframe') {
                        attachToIframe(node);
                        return;
                    }
                    // check children
                    const found = node.querySelector && node.querySelector('#PanoramaIframe');
                    if (found) {
                        attachToIframe(found);
                        return;
                    }
                }
            }
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // If iframe already exists on load, attach now
    const existing = document.getElementById('PanoramaIframe');
    if (existing) attachToIframe(existing);

    // -----------------------
    // Small GUI (bottom-left)
    // -----------------------
    function createGUI() {
        const box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.bottom = '10px';
        box.style.left = '10px';
        box.style.padding = '8px 10px';
        box.style.background = 'rgba(0,0,0,0.65)';
        box.style.color = 'white';
        box.style.fontSize = '13px';
        box.style.fontFamily = 'Arial, sans-serif';
        box.style.borderRadius = '8px';
        box.style.zIndex = '999999';
        box.style.display = 'flex';
        box.style.gap = '8px';
        box.style.alignItems = 'center';
        box.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';

        // Enable checkbox
        const enLabel = document.createElement('label');
        enLabel.style.display = 'flex';
        enLabel.style.alignItems = 'center';
        enLabel.style.gap = '6px';
        enLabel.style.cursor = 'pointer';
        enLabel.title = 'Enable/Disable Blink Mode';

        const enCheckbox = document.createElement('input');
        enCheckbox.type = 'checkbox';
        enCheckbox.checked = enabled;
        enCheckbox.style.transform = 'scale(1.0)';

        enCheckbox.onchange = () => {
            enabled = enCheckbox.checked;
            localStorage.setItem(STORAGE_KEY_ENABLED, enabled ? 'enabled' : 'disabled');
            // if disabled, reveal immediately
            const pano = document.querySelector('#PanoramaIframe');
            if (!enabled && pano) setFilter(pano, 'none');
        };

        const enText = document.createElement('span');
        enText.textContent = 'Blink';
        enText.style.userSelect = 'none';

        enLabel.appendChild(enCheckbox);
        enLabel.appendChild(enText);

        // Time input
        const timeLabel = document.createElement('label');
        timeLabel.style.display = 'flex';
        timeLabel.style.alignItems = 'center';
        timeLabel.style.gap = '6px';
        timeLabel.style.userSelect = 'none';

        const span = document.createElement('span');
        span.textContent = 'Preview (s):';

        const input = document.createElement('input');
        input.type = 'number';
        input.value = blinkSeconds;
        input.min = '0.1';
        input.step = '0.1';
        input.style.width = '56px';
        input.style.padding = '2px 4px';
        input.style.borderRadius = '4px';
        input.style.border = 'none';
        input.style.background = 'rgba(255,255,255,0.08)';
        input.style.color = 'white';
        input.style.outline = 'none';

        input.onchange = input.oninput = () => {
            const v = parseFloat(input.value);
            if (!isNaN(v) && v > 0) {
                blinkSeconds = v;
                localStorage.setItem(STORAGE_KEY_SEC, blinkSeconds.toString());
            } else {
                input.value = blinkSeconds;
            }
        };

        timeLabel.appendChild(span);
        timeLabel.appendChild(input);

        // Temporary reveal button
        const revealBtn = document.createElement('button');
        revealBtn.textContent = 'Reveal';
        revealBtn.title = 'Temporarily reveal panorama (once)';
        revealBtn.style.padding = '4px 8px';
        revealBtn.style.border = 'none';
        revealBtn.style.borderRadius = '6px';
        revealBtn.style.cursor = 'pointer';
        revealBtn.style.background = 'rgba(255,255,255,0.08)';
        revealBtn.style.color = 'white';

        revealBtn.onclick = () => {
            const pano = document.querySelector('#PanoramaIframe');
            if (!pano) return;
            // temporarily reveal for blinkSeconds
            setFilter(pano, 'none');
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            hideTimeout = setTimeout(() => setFilter(pano, 'brightness(0%)'), Math.max(1, Math.round(blinkSeconds * 1000)));
        };

        box.appendChild(enLabel);
        box.appendChild(timeLabel);
        box.appendChild(revealBtn);

        document.body.appendChild(box);
    }

    createGUI();

    // Expose a quick keyboard shortcut: press "R" to Reveal for preview time
    window.addEventListener('keydown', (e) => {
        // avoid typing in inputs
        if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key.toLowerCase() === 'r') {
            const pano = document.querySelector('#PanoramaIframe');
            if (!pano) return;
            setFilter(pano, 'none');
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            hideTimeout = setTimeout(() => setFilter(pano, 'brightness(0%)'), Math.max(1, Math.round(blinkSeconds * 1000)));
        }
    });

})();
