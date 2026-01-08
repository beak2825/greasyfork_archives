// ==UserScript==
// @name         Enhance Perplexity AI chat
// @namespace    facelook.hk
// @version      1.10
// @author       FacelookHK
// @description  Increase the width of the conversation panel, replaces MCP button from MCP SuperAssistant extension, updates chip icon with model name matching sources button radius
// @match        https://www.perplexity.ai/*
// @grant        GM_addStyle
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/557170/Enhance%20Perplexity%20AI%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/557170/Enhance%20Perplexity%20AI%20chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Chip icon logic
    const CPU_ICON_ID = '#pplx-icon-cpu';
    const IS_FIREFOX = /firefox/i.test(navigator.userAgent);

    GM_addStyle(`
        button[data-pplx-modeltext="1"] {
            width: auto !important;
            padding: 0 8px !important;
            gap: 6px !important;
            border-radius: 9999px !important; /* rounded-full equivalent */
            height: 32px !important;
            min-height: 32px !important;
            align-items: center !important;
            display: inline-flex !important;
        }
        button[data-pplx-modeltext="1"] svg {
            display: none !important;
        }
        button[data-pplx-modeltext="1"] .pplx-modeltext-label {
            font-size: 12px !important;
            font-weight: 500 !important;
            line-height: 1 !important;
            white-space: nowrap !important;
        }
        /* Firefox: show permanent tooltip on the chip button instead of changing it */
        button[data-pplx-permatooltip="1"] {
            position: relative !important;
            overflow: visible !important;
        }

        button[data-pplx-permatooltip="1"]::after {
        content: attr(data-pplx-permatooltip-text);
        position: absolute;
        left: 50%;
        top: calc(100% + 6px);
        transform: translate(-50%, 0);

        background: rgba(17,17,17,0.95);
        color: #fff;
        font-size: 11px;
        line-height: 1.2;
        padding: 3px 6px;
        border-radius: 6px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 9999;
        }
        #scroll-to-bottom-btn {
            position: fixed !important;
            bottom: 80px !important;
            right: 20px !important;
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            background: #3C82F6 !important;
            border: none !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            z-index: 10000 !important;
            transition: all 0.3s ease !important;
        }
        #scroll-to-bottom-btn:hover {
            background: #2563EB !important;
            transform: scale(1.1) !important;
        }
    `);

    function useHref(useEl) {
        return (
            useEl.getAttribute('href') ||
            useEl.getAttribute('xlink:href') ||
            ''
        ).trim();
    }

    function isQueryBoxButton(btn) {
        if (btn.closest('[data-cplx-component^="query-box"]')) return true;
        if (btn.closest('div').parentElement?.querySelector('input[type="file"]')) return true;
        if (btn.closest('.col-start-3.row-start-2')) return true;
        return false;
    }

    function enablePermanentTooltip(btn, label) {
        if (btn.dataset.pplxPermatooltip === "1" && btn.dataset.pplxPermatooltipText === label) return;

        btn.dataset.pplxPermatooltip = "1";
        btn.dataset.pplxPermatooltipText = label;

        // Avoid native tooltip conflicts
        btn.removeAttribute("title");
    }

    function upgradeButton(btn) {
        const useEl = btn.querySelector('use');
        if (!useEl || useHref(useEl) !== CPU_ICON_ID) return;
        if (isQueryBoxButton(btn)) return;

        const label = (btn.getAttribute('aria-label') || '').trim();
        if (!label) return;

        // Firefox: do NOT replace icon/button content; just show a permanent tooltip
        if (IS_FIREFOX) {
            enablePermanentTooltip(btn, label);
            return;
        }

        // Chromium: keep your existing "replace chip icon with text" logic
        const currentSpan = btn.querySelector('.pplx-modeltext-label');
        if (btn.dataset.pplxModeltext === '1' && currentSpan && currentSpan.textContent === label) return;

        btn.textContent = '';
        const span = document.createElement('span');
        span.className = 'pplx-modeltext-label';
        span.textContent = label;
        btn.appendChild(span);
        btn.dataset.pplxModeltext = '1';
        btn.removeAttribute('title');
    }

    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            const candidates = new Set();
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            node.querySelectorAll?.('button').forEach(b => candidates.add(b));
                            if (node.tagName === 'BUTTON') candidates.add(node);
                            if (node.tagName === 'svg' || node.tagName === 'use') {
                                const parentBtn = node.closest('button');
                                if (parentBtn) candidates.add(parentBtn);
                            }
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    if (mutation.target.tagName === 'BUTTON') {
                        candidates.add(mutation.target);
                    } else if (mutation.target.tagName === 'USE') {
                        const parentBtn = mutation.target.closest('button');
                        if (parentBtn) candidates.add(parentBtn);
                    }
                }
            }
            candidates.forEach(upgradeButton);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-label', 'href', 'xlink:href']
        });
        document.querySelectorAll('button').forEach(upgradeButton);
    }

    // Main script logic (layout, MCP button, etc.)
    const OVERLAY_ID = "mcp-custom-overlay-btn";
    const DEFAULT_STYLE = {
        width: "32px",
        height: "32px",
        bg: "var(--super, #3C82F6)",
        radius: "8px"
    };
    const SVG_ICON = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16V8.00002C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="#606260" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    const voiceBtnSelectors = [
        'button[aria-label="Voice Search"]',
        'button[aria-label="Voice Mode"]',
        '[data-testid="voice-search-button"]',
        '.fa-microphone'
    ];
    const layoutSelectors = [
        { sel: ".mx-auto.max-w-threadContentWidth", prop: "max-width", val: (artifact) => artifact ? "85%" : "65%" },
        { sel: ".mx-auto.max-w-threadContentWidth", prop: "max-width", val: "100%", parentCheck: (el) => el.closest('[data-cplx-component="message-block-query"]') },
        { sel: ".md\\:max-w-threadContentWidth.md\\:mx-auto.md\\:w-full", prop: "margin-left", val: "unset" },
        { sel: ".max-w-threadContentWidth.relative.isolate", prop: "max-width", val: "unset" },
        { sel: ".max-w-\\[300px\\]", prop: "max-width", val: "90%" },
    ];

    function getVoiceButtonStyle() {
        for (const sel of voiceBtnSelectors) {
            const el = document.querySelector(sel);
            const btn = el?.tagName === 'BUTTON' ? el : el?.closest('button');
            if (btn) {
                const style = window.getComputedStyle(btn);
                if (parseFloat(style.width) > 0) {
                    return {
                        width: style.width,
                        height: style.height,
                        bg: style.backgroundColor,
                        radius: style.borderRadius,
                        padding: style.padding
                    };
                }
            }
        }
        return null;
    }

    function apply() {
        const artifactExists = document.getElementById("cplx-artifact");
        layoutSelectors.forEach(item => {
            document.querySelectorAll(item.sel).forEach(el => {
                if (item.parentCheck && !item.parentCheck(el)) return;
                const value = typeof item.val === "function" ? item.val(artifactExists) : item.val;
                el.style.setProperty(item.prop, value, "important");
            });
        });
        const targetStyle = getVoiceButtonStyle() || DEFAULT_STYLE;
        const buttons = document.querySelectorAll("button.mcp-perplexity-button-base");
        buttons.forEach(originalBtn => {
            if (originalBtn.style.opacity !== "0") {
                originalBtn.style.cssText = `
                    opacity: 0 !important;
                    visibility: visible !important;
                    width: ${targetStyle.width} !important;
                    height: ${targetStyle.height} !important;
                    min-width: ${targetStyle.width} !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    position: absolute !important;
                    top: 0; left: 0; z-index: 0 !important;
                `;
            }
            const parent = originalBtn.parentElement;
            if (parent) {
                parent.style.position = "relative";
                parent.style.display = "inline-flex";
                parent.style.width = targetStyle.width;
                parent.style.height = targetStyle.height;
                parent.style.alignItems = "center";
                parent.style.justifyContent = "center";
            }
            let overlay = parent.querySelector(`#${OVERLAY_ID}`);
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = OVERLAY_ID;
                overlay.innerHTML = SVG_ICON;
                overlay.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    originalBtn.click();
                });
                parent.appendChild(overlay);
            }
            overlay.style.cssText = `
                position: absolute;
                top: 1px; left: 0;
                width: 36px; height: 36px;
                background-color: #191B1B;
                border-radius: ${targetStyle.radius};
                display: flex; justify-content: center; align-items: center;
                cursor: pointer;
                z-index: 10;
                color: white;
                transition: background-color 0.2s;
                pointer-events: auto;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            `;
        });
    }

    // Apply layout and MCP button changes
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", apply, { once: true });
    } else {
        apply();
    }
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Start chip icon observer
    setTimeout(startObserver, 500);

    // Scroll to bottom button
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-to-bottom-btn';
    scrollBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>';
    scrollBtn.onclick = () => {
        const scrollContainer = document.querySelector('.scrollable-container') || document.documentElement;
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
    };
    document.body.appendChild(scrollBtn);
})();
