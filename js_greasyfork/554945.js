// ==UserScript==
// @name         Highlight Scaled Images
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A useful tool for frontend developers to detect bad image quality issues on HTML pages. The script scans all images and highlights problematic images: adds a tint and overlay text to images scaled by the browser (upscaled, downscaled).
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/554945/Highlight%20Scaled%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/554945/Highlight%20Scaled%20Images.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default settings
    const DEFAULTS = {
        showDownscale: true,
        showProportional: true,
        // enabledDomains holds an array of hostnames where the script is active.
        // Empty array = disabled everywhere by default.
        enabledDomains: [
            'murznn.github.io',
        ]
    };

    // Utility to get and set settings
    function getSetting(key) {
        const val = GM_getValue(key);
        if (typeof val === 'undefined') return DEFAULTS[key];
        return val;
    }
    function setSetting(key, value) {
        GM_setValue(key, value);
    }

    // Domain helpers
    function getHost() {
        try { return location.hostname; } catch (e) { return ''; }
    }
    function isEnabledForCurrentDomain() {
        const enabled = getSetting('enabledDomains') || [];
        const host = getHost();
        return enabled.indexOf(host) !== -1;
    }
    function enableForCurrentDomain() {
        const host = getHost();
        if (!host) return;
        const enabled = Array.isArray(getSetting('enabledDomains')) ? getSetting('enabledDomains') : [];
        if (enabled.indexOf(host) === -1) {
            enabled.push(host);
            setSetting('enabledDomains', enabled);
        }
    }
    function disableForCurrentDomain() {
        const host = getHost();
        if (!host) return;
        const enabled = Array.isArray(getSetting('enabledDomains')) ? getSetting('enabledDomains') : [];
        const idx = enabled.indexOf(host);
        if (idx !== -1) {
            enabled.splice(idx, 1);
            setSetting('enabledDomains', enabled);
        }
    }
    function listEnabledDomains() {
        return Array.isArray(getSetting('enabledDomains')) ? getSetting('enabledDomains') : [];
    }
    function clearEnabledDomains() {
        setSetting('enabledDomains', []);
    }

    // Overlay logic
    let __overlayIdCounter = 1;
    function createOverlay(text, color, img) {
        const overlay = document.createElement('div');
        overlay.textContent = text;
        overlay.style.position = 'absolute';
        overlay.style.left = '50%';
        overlay.style.top = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.color = '#fff';
        overlay.style.background = color;
        overlay.style.padding = '2px 6px';
        overlay.style.borderRadius = '6px';
        overlay.style.fontSize = '0.8em';
        overlay.style.fontWeight = 'bold';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '10';
        overlay.className = 'img-scale-overlay';
        // link overlay to image via dataset for reliable removal
        if (!img.dataset.scaleOverlayId) img.dataset.scaleOverlayId = String(__overlayIdCounter++);
        overlay.dataset.forImgId = img.dataset.scaleOverlayId;
        overlay.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)';
        overlay.style.opacity = '0.85';
        overlay.style.border = '1px solid #fff';
        overlay.style.whiteSpace = 'nowrap';
        overlay.style.minWidth = img.offsetWidth + 'px';
        return overlay;
    }

    function removeOverlays(img) {
        if (!img.parentElement) return;
        const id = img.dataset.scaleOverlayId;
        Array.from(img.parentElement.querySelectorAll('.img-scale-overlay')).forEach(function (overlay) {
            // remove overlays that belong to this image (by dataset) or that are directly adjacent
            if ((id && overlay.dataset.forImgId === id) || overlay.previousSibling === img || overlay.nextSibling === img) {
                overlay.remove();
            }
        });
    }

    function getScalePercent(img) {
        const widthScale = img.offsetWidth / img.naturalWidth;
        const heightScale = img.offsetHeight / img.naturalHeight;
        const scale = Math.max(widthScale, heightScale);
        const percent = scale * 100;
        if (Math.abs(percent - Math.round(percent)) > 0.01) {
            return percent.toFixed(2);
        } else {
            return Math.round(percent).toString();
        }
    }

    function getDownsizeLabelAndTint(img, scalePercent) {
        const percentNum = parseFloat(scalePercent);
        const origSize = `${img.naturalWidth}x${img.naturalHeight}`;
        const realSize = `${img.offsetWidth}x${img.offsetHeight}`;
        let sizeText = `[${origSize} → ${realSize}]`;
        if (Math.abs(percentNum - 50) < 0.01) {
            return {
                text: `Downsized 2x (${scalePercent}%) ${sizeText}`,
                color: 'rgba(0,180,60,0.7)',
                tint: 'brightness(0.7) sepia(1) hue-rotate(90deg) saturate(5)',
                isProportional: true
            };
        } else if (Math.abs(percentNum - 25) < 0.01) {
            return {
                text: `Downsized 4x (${scalePercent}%) ${sizeText}`,
                color: 'rgba(0,180,60,0.7)',
                tint: 'brightness(0.7) sepia(1) hue-rotate(90deg) saturate(5)',
                isProportional: true
            };
        } else {
            return {
                text: `Downsized ${scalePercent}% ${sizeText}`,
                color: 'rgba(0, 80, 255, 0.7)',
                tint: 'brightness(0.7) sepia(1) hue-rotate(180deg) saturate(5)',
                isProportional: false
            };
        }
    }

    function getUpsizeLabel(img, scalePercent) {
        const origSize = `${img.naturalWidth}x${img.naturalHeight}`;
        const realSize = `${img.offsetWidth}x${img.offsetHeight}`;
        let sizeText = `[${origSize} → ${realSize}]`;
        return {
            text: `Upsized ${scalePercent}% ${sizeText}`,
            color: 'rgba(255, 40, 40, 0.7)',
            tint: 'brightness(0.7) sepia(1) hue-rotate(-50deg) saturate(5)'
        };
    }

    function applyTintToImages() {
        const showDownscale = getSetting('showDownscale');
        const showProportional = getSetting('showProportional');

        document.querySelectorAll('img').forEach(function (img) {
            // always clear previous overlays for this image to avoid duplicates
            removeOverlays(img);
            // keep a small transition for filter changes
            img.style.transition = 'filter 0.3s';

            if (img.naturalWidth > 0 && img.naturalHeight > 0 && img.offsetWidth > 0 && img.offsetHeight > 0) {
                const isDownsized = img.offsetWidth < img.naturalWidth || img.offsetHeight < img.naturalHeight;
                const isUpsized = img.offsetWidth > img.naturalWidth || img.offsetHeight > img.naturalHeight;
                if (isDownsized || isUpsized) {
                    const parent = img.parentElement;
                    if (parent) {
                        // only set position if computed style is static and remember original value
                        const parentStyle = window.getComputedStyle(parent);
                        if (parentStyle.position === 'static') {
                            if (typeof parent.dataset.originalPosition === 'undefined') {
                                parent.dataset.originalPosition = parent.style.position || '';
                            }
                            parent.style.position = 'relative';
                        }
                    }
                    let overlay, scalePercent, label;
                    scalePercent = getScalePercent(img);
                    if (isDownsized) {
                        label = getDownsizeLabelAndTint(img, scalePercent);
                        // Only show if allowed by settings
                        if ((label.isProportional && showProportional) || (!label.isProportional && showDownscale)) {
                            img.style.filter = label.tint;
                            overlay = createOverlay(label.text, label.color, img);
                            const parent = img.parentElement;
                            if (parent) {
                                if (img.nextSibling) {
                                    parent.insertBefore(overlay, img.nextSibling);
                                } else {
                                    parent.appendChild(overlay);
                                }
                            }
                        }
                    } else if (isUpsized) {
                        label = getUpsizeLabel(img, scalePercent);
                        img.style.filter = label.tint;
                        overlay = createOverlay(label.text, label.color, img);
                        const parent = img.parentElement;
                        if (parent) {
                            if (img.nextSibling) {
                                parent.insertBefore(overlay, img.nextSibling);
                            } else {
                                parent.appendChild(overlay);
                            }
                        }
                    }
                } else {
                    // image at 100% - remove any filter and restore parent position if we changed it
                    img.style.filter = '';
                    const parent = img.parentElement;
                    if (parent && typeof parent.dataset.originalPosition !== 'undefined') {
                        parent.style.position = parent.dataset.originalPosition || '';
                        delete parent.dataset.originalPosition;
                    }
                }
            }
        });
    }

    // Settings modal
    function createSettingsModal() {
        // Remove existing modal if present
        const existing = document.getElementById('img-scale-settings-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'img-scale-settings-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #fff;
            border-radius: 8px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        const currentHost = getHost();
        const isEnabled = isEnabledForCurrentDomain();
        const showDownscale = getSetting('showDownscale');
        const showProportional = getSetting('showProportional');
        const enabledDomains = listEnabledDomains();

        panel.innerHTML = `
            <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #333;">Highlight Scaled Images - Settings</h2>

            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #555;">Current Domain</h3>
                <div style="margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                    <strong>${currentHost}</strong>
                    <div style="margin-top: 8px;">
                        <button id="toggle-domain-btn" style="padding: 6px 12px; background: ${isEnabled ? '#dc3545' : '#28a745'}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            ${isEnabled ? 'Disable' : 'Enable'} for this domain
                        </button>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #555;">Highlight Options</h3>
                <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="show-downscale" ${showDownscale ? 'checked' : ''} style="margin-right: 8px;">
                    Show Downscale (blue) highlight
                </label>
                <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="show-proportional" ${showProportional ? 'checked' : ''} style="margin-right: 8px;">
                    Show Proportional (green) highlight
                </label>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #555;">Enabled Domains</h3>
                <div id="domains-list" style="max-height: 150px; overflow-y: auto; padding: 10px; background: #f5f5f5; border-radius: 4px; margin-bottom: 10px;">
                    ${enabledDomains.length ? enabledDomains.map(d => `<div style="margin-bottom: 4px;">• ${d}</div>`).join('') : '<div style="color: #999;">No domains enabled</div>'}
                </div>
                <button id="clear-domains-btn" style="padding: 6px 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" ${enabledDomains.length ? '' : 'disabled'}>
                    Clear all domains
                </button>
            </div>

            <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <button id="close-settings-btn" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    Close
                </button>
            </div>
        `;

        modal.appendChild(panel);
        document.body.appendChild(modal);

        // Event handlers
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.remove();
        });

        document.getElementById('close-settings-btn').addEventListener('click', function () {
            modal.remove();
        });

        document.getElementById('toggle-domain-btn').addEventListener('click', function () {
            if (isEnabledForCurrentDomain()) {
                disableForCurrentDomain();
                console.log('Highlight Scaled Images: DISABLED for', currentHost);
                detachRuntime();
            } else {
                enableForCurrentDomain();
                console.log('Highlight Scaled Images: ENABLED for', currentHost);
                attachRuntime();
            }
            modal.remove();
        });

        document.getElementById('show-downscale').addEventListener('change', function (e) {
            setSetting('showDownscale', e.target.checked);
            console.log('Downscale highlight:', e.target.checked ? 'ON' : 'OFF');
            if (isEnabledForCurrentDomain()) applyTintToImages();
        });

        document.getElementById('show-proportional').addEventListener('change', function (e) {
            setSetting('showProportional', e.target.checked);
            console.log('Proportional highlight:', e.target.checked ? 'ON' : 'OFF');
            if (isEnabledForCurrentDomain()) applyTintToImages();
        });

        document.getElementById('clear-domains-btn').addEventListener('click', function () {
            if (confirm('Clear all enabled domains?')) {
                clearEnabledDomains();
                console.log('All enabled domains cleared');
                modal.remove();
                detachRuntime();
            }
        });

        // Close on Escape key
        const escHandler = function (e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Menu registration (only once, no duplicates)
    GM_registerMenuCommand('Enable for this domain', function () {
        const currentHost = getHost();
        if (isEnabledForCurrentDomain()) {
            alert(`This domain (${currentHost}) is already enabled.\n\nUse the Settings menu to disable it.`);
        } else {
            enableForCurrentDomain();
            console.log('Highlight Scaled Images: ENABLED for', currentHost);
            attachRuntime();
        }
    });

    GM_registerMenuCommand('Settings', function () {
        createSettingsModal();
    });

    // Only run the active parts of the script when the current domain is enabled.
    // Menu commands above remain available regardless.
    let observer = null;
    let debouncedApply = null;
    let resizeHandler = null;
    let loadHandler = null;

    function attachRuntime() {
        // Don't attach if already attached
        if (observer) return;

        // Initial scan
        applyTintToImages();

        // Debounced runner to avoid rapid repeat work and avoid reacting to our own changes
        function debounce(fn, wait) {
            let t = null;
            return function () {
                const args = arguments;
                clearTimeout(t);
                t = setTimeout(function () { fn.apply(null, args); }, wait);
            };
        }

        debouncedApply = debounce(applyTintToImages, 120);

        // Reapply on window resize
        resizeHandler = function () { applyTintToImages(); };
        window.addEventListener('resize', resizeHandler);

        // Reapply on DOM changes (lazy load, AJAX, etc.)
        observer = new MutationObserver(function (mutations) {
            // ignore mutations that are only our overlays being added/removed
            for (const m of mutations) {
                if (m.type === 'childList') {
                    // if any added/removed node is our overlay, skip scheduling
                    const nodes = [...m.addedNodes, ...m.removedNodes];
                    let skip = false;
                    for (const n of nodes) {
                        if (n.nodeType === 1 && n.classList && n.classList.contains('img-scale-overlay')) {
                            skip = true;
                            break;
                        }
                    }
                    if (skip) continue;
                }
                // schedule debounced apply for other mutations
                debouncedApply();
                return;
            }
        });
        // avoid observing style/class changes we make; only observe src/srcset and structural changes
        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'srcset']
            });
        } catch (e) {
            // ignore if document.body isn't available yet
        }

        // Also reapply when images finish loading (for lazy-loaded images)
        loadHandler = function (e) {
            if (e.target.tagName === 'IMG') {
                applyTintToImages();
            }
        };
        document.body.addEventListener('load', loadHandler, true);
    }

    function detachRuntime() {
        // Disconnect observer
        try { if (observer) observer.disconnect(); } catch (e) { /* ignore */ }
        observer = null;
        debouncedApply = null;

        // Remove event listeners
        if (resizeHandler) {
            window.removeEventListener('resize', resizeHandler);
            resizeHandler = null;
        }
        if (loadHandler) {
            try {
                document.body.removeEventListener('load', loadHandler, true);
            } catch (e) { /* ignore */ }
            loadHandler = null;
        }

        // remove any overlays we added and clear filters
        document.querySelectorAll('.img-scale-overlay').forEach(function (o) { o.remove(); });
        document.querySelectorAll('img').forEach(function (img) { img.style.filter = ''; });
        // try to restore parent positions we modified
        document.querySelectorAll('[data-original-position]').forEach(function (el) {
            try { el.style.position = el.dataset.originalPosition || ''; delete el.dataset.originalPosition; } catch (e) { }
        });
    }

    // Ensure runtime is attached only when enabled
    if (isEnabledForCurrentDomain()) {
        attachRuntime();
    }
})();
