// ==UserScript==
// @name         Easy Bonus View
// @namespace    https://www.torn.com/
// @version      1.03
// @description  Append weapon bonus to item name
// @author       zyx [2753102]
// @license      MIT
//
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/amarket.php*
// @match        https://www.torn.com/factions.php?*
//
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556740/Easy%20Bonus%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/556740/Easy%20Bonus%20View.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- Page detection ---------- */

    var path  = location.pathname || '';
    var qs    = location.search || '';
    var hash  = location.hash || '';

    var IS_ITEMMARKET_MAIN =
        path === '/page.php' &&
        /[?&]sid=ItemMarket\b/.test(qs) &&
        hash.indexOf('#/') === 0;

    var IS_BAZAAR   = path === '/bazaar.php';
    var IS_AUCTION  = path === '/amarket.php';

    /* ---------- Helpers ---------- */

    function titleCase(str) {
        return str.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    function extractPercentFromTitle(title) {
        if (!title) return null;
        var match = title.match(/(\d+)\s*%/);
        return match ? match[1] + '%' : null;
    }

    // Weapon mod names from https://wiki.torn.com/wiki/Weapon_Mod
    var WEAPON_MOD_NAMES = [
        'Reflex Sight','Holographic Sight','Acog Sight','Thermal Sight',
        '1mW Laser','5mW Laser','30mW Laser','100mW Laser',
        'Small Suppressor','Standard Suppressor','Large Suppressor',
        'Extended Mags','High Capacity Mags',
        'Extra Mag','Extra Mags x2',
        'Adjustable Trigger','Hair Trigger',
        'Bipod','Tripod',
        'Custom Grip',
        'Skeet Choke','Improved Choke','Full Choke',
        'Recoil Pad',
        'Standard Brake','Heavy Duty Brake','Tactical Brake',
        'Small Light','Precision Light','Tactical Illuminator'
    ].map(function (s) { return s.toLowerCase(); });

    function stripHtmlToLower(text) {
        if (!text) return '';
        return text.replace(/<[^>]*>/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim()
                   .toLowerCase();
    }

    function tooltipLooksLikeWeaponMod(text) {
        var plain = stripHtmlToLower(text);
        if (!plain) return false;
        for (var i = 0; i < WEAPON_MOD_NAMES.length; i++) {
            if (plain.indexOf(WEAPON_MOD_NAMES[i]) !== -1) return true;
        }
        return false;
    }

    // Tooltip lookup with fallback to ui-tooltip element via aria-describedby
    function getTooltipHtml(icon) {
        var html =
            icon.getAttribute('title') ||
            icon.getAttribute('data-title') ||
            icon.getAttribute('data-tooltip') ||
            icon.getAttribute('aria-label') ||
            '';

        if (!html) {
            var tipId = icon.getAttribute('aria-describedby');
            if (tipId) {
                var tip = document.getElementById(tipId);
                if (tip) {
                    html = tip.innerHTML || tip.textContent || '';
                }
            }
        }
        return html;
    }

    // Find the item name element associated with an icon.
    // 1) Faction armoury rows (weapons/armour tabs)
    // 2) Accordion layouts (item.php etc.)
    // 3) Donate / list layouts (thumbnail-wrap, title-wrap, name in .t-overflow)
    function findNameSpanFromIcon(icon) {
        // 1) Faction armoury layout: ul.bonuses + .name.bold.t-overflow
        var bonusesList = icon.closest('ul.bonuses');
        if (bonusesList && bonusesList.parentElement) {
            var container = bonusesList.parentElement;
            var armoryName = container.querySelector(
                '.name.bold.t-overflow, .name.bold, .name'
            );
            if (armoryName) return armoryName;
        }

        // 2 & 3) Layouts using .bonuses-wrap
        var bonusesWrap = icon.closest('.bonuses-wrap');
        if (!bonusesWrap) return null;

        // 2a) Classic accordion layout (item.php / markets)
        var panel = bonusesWrap.closest('.cont-wrap.ui-accordion-content') ||
                    bonusesWrap.closest('.cont-wrap');
        if (panel) {
            var header = null;
            var headerId = panel.getAttribute('aria-labelledby');
            if (headerId) header = document.getElementById(headerId);

            if (!header) {
                var prev = panel.previousElementSibling;
                while (prev) {
                    if (prev.querySelector('.name-wrap .name, .name')) {
                        header = prev;
                        break;
                    }
                    prev = prev.previousElementSibling;
                }
            }

            if (header) {
                var nameSpan = header.querySelector('.name-wrap .name, .name');
                if (nameSpan) return nameSpan;
            }
        }

        // 3) Donate / list layout (faction armoury donate tab, etc.)
        var itemRoot = bonusesWrap.closest('li.clearfix') || bonusesWrap.closest('li');
        if (itemRoot) {
            var donateName = itemRoot.querySelector(
                '.title-wrap .name-wrap .t-overflow, .title-wrap .t-overflow, .title-wrap .name'
            );
            if (donateName) return donateName;
        }

        return null;
    }

    // Clean the base item name: strip anything after "|" and trailing numeric blocks
    function cleanBaseName(text) {
        if (!text) return '';
        var base = text.trim();
        base = base.split('|')[0].trim();                  // drop previous suffixes
        base = base.replace(/\s+[\d.]+(\s+[\d.]+)*$/, '');  // drop trailing numbers like "68.78 60.81"
        return base;
    }

    /* ---------- Modal / Popup ---------- */

    function ensureModalElements() {
        var overlay = document.getElementById('torn-bonus-modal-overlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.id = 'torn-bonus-modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 999999,
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
        });

        var modal = document.createElement('div');
        modal.id = 'torn-bonus-modal';
        Object.assign(modal.style, {
            background: '#111',
            color: '#fff',
            borderRadius: '6px',
            padding: '12px 16px',
            maxWidth: '320px',
            boxShadow: '0 0 10px rgba(0,0,0,0.8)',
            fontSize: '12px'
        });

        var closeBtn = document.createElement('div');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            cursor: 'pointer',
            float: 'right',
            marginLeft: '8px',
            fontWeight: 'bold'
        });

        var content = document.createElement('div');
        content.id = 'torn-bonus-modal-content';
        content.style.clear = 'both';
        content.style.marginTop = '4px';

        closeBtn.addEventListener('click', hideModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) hideModal();
        });

        modal.appendChild(closeBtn);
        modal.appendChild(content);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') hideModal();
        });

        return overlay;
    }

    function showModal(html) {
        var overlay = ensureModalElements();
        var content = document.getElementById('torn-bonus-modal-content');

        if (!html) {
            content.textContent = 'No bonus info.';
        } else if (html.indexOf('<') !== -1) {
            content.innerHTML = html;
        } else {
            content.textContent = html;
        }

        overlay.style.display = 'flex';
    }

    function hideModal() {
        var overlay = document.getElementById('torn-bonus-modal-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    /* ---------- Build label info from a bonus icon ---------- */

    function buildBonusInfo(icon) {
        var bonusClass = Array.prototype.slice.call(icon.classList)
            .find(function (c) { return c.indexOf('bonus-attachment-') === 0; });

        var tooltipHtml = getTooltipHtml(icon);

        // Explicit data attributes used on some views
        var dataTitle = icon.getAttribute('data-bonus-attachment-title') || '';
        var dataDesc  = icon.getAttribute('data-bonus-attachment-description') || '';

        // Text to use for mod detection when tooltips are empty
        var combinedTextForMods =
            (tooltipHtml || '') + ' ' + dataTitle + ' ' + dataDesc;

        // 1) Skip generic item stat bonuses
        if (bonusClass && /bonus-attachment-item-/.test(bonusClass)) {
            return {
                label: '',
                html: tooltipHtml || (dataTitle + ' ' + dataDesc)
            };
        }

        // 2) Skip weapon mods
        if (tooltipLooksLikeWeaponMod(combinedTextForMods)) {
            return {
                label: '',
                html: tooltipHtml || (dataTitle + ' ' + dataDesc)
            };
        }

        // 3) Build label for true bonus attachments
        var labelType = '';
        if (bonusClass && bonusClass.indexOf('blank-bonus') === -1) {
            labelType = bonusClass.replace('bonus-attachment-', '');
            labelType = titleCase(labelType.replace(/-/g, ' '));
        }

        if (!labelType && dataTitle) {
            labelType = dataTitle.trim();
        }

        // Pull percentage from tooltip OR description OR title
        var percent =
            extractPercentFromTitle(tooltipHtml) ||
            extractPercentFromTitle(dataDesc) ||
            extractPercentFromTitle(dataTitle);

        var label = '';
        if (labelType) {
            label = percent ? (labelType + ' (' + percent + ')') : labelType;
        } else if (percent) {
            label = percent;
        }

        // For the popup: prefer tooltipHtml
        var html = tooltipHtml;
        if (!html && (labelType || dataDesc)) {
            html = '<strong>' + (labelType || '') + '</strong>';
            if (dataDesc) html += '<br>' + dataDesc;
        }

        return { label: label, html: html };
    }

    /* ---------- Shared overlay helpers (Item Market + Bazaar + Auction) ---------- */

    // Item Market host: the image wrapper in the card
    function findMarketLabelHost(icon) {
        var mods = icon.closest("div[class*='modifiersAndPropertiesWrapper']");
        var root = mods && mods.parentElement ? mods.parentElement : null;

        if (!root) {
            root = mods ||
                   icon.closest("div[class*='imageWrapper']") ||
                   icon.closest("div[class*='actionsWrapper']");
        }
        if (!root) return null;

        var host = root.querySelector("div[class*='imageWrapper']") || root;
        return host;
    }

    // Bazaar host: the img container in the bazaar item
    function findBazaarLabelHost(icon) {
        var item = icon.closest("div[data-testid='item']") ||
                   icon.closest("div[class*='itemDescription']");
        if (!item) return null;

        var host = item.querySelector("div[data-testid='img-container']") ||
                   item.querySelector("div[class*='imgContainer']") ||
                   item;
        return host;
    }

    // Auction host: the item image area in amarket.php
    // Structure: li > div.item-cont-wrap > span.img-wrap > span.item-plate > img
    function findAuctionLabelHostFromContainer(container) {
        if (!container) return null;
        var host = container.querySelector('span.item-plate') ||
                   container.querySelector('span.img-wrap')  ||
                   container;
        return host;
    }

    function ensureOverlayLabelElement(host) {
        var label = host.querySelector('.torn-bonus-overlay-label');
        if (label) return label;

        label = document.createElement('div');
        label.className = 'torn-bonus-overlay-label';

        var cs = window.getComputedStyle(host);
        if (cs.position === 'static') {
            host.style.position = 'relative';
        }

        Object.assign(label.style, {
            position: 'absolute',
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '9px',      // smaller text
            fontWeight: 'bold',
            textShadow: '0 0 3px rgba(0,0,0,0.7)',
            pointerEvents: 'none',
            zIndex: 2,
            color: '#fff',
            opacity: '0.7',       // 30% see-through
            textAlign: 'center',
            whiteSpace: 'nowrap',
            maxWidth: '90%'
        });

        host.appendChild(label);
        return label;
    }

    /* ---------- Auction-specific parsing (no MutationObserver) ---------- */

    // Parse bonus labels like "Achilles: 65% increased Foot damage."
    function buildAuctionLabelsFromAria(text) {
        if (!text) return '';
        var labels = [];
        var re = /([A-Z][A-Za-z' -]+):\s*(\d+)\s*%/g;
        var m;
        while ((m = re.exec(text)) !== null) {
            var name = m[1].trim();
            var pct  = m[2] + '%';
            labels.push(name + ' (' + pct + ')');
        }
        return labels.join(' & ');
    }

    function processAuctionItems() {
        if (!IS_AUCTION) return;

        var containers = document.querySelectorAll(
            '.items-list .item-cont-wrap, .items-list-wrap .item-cont-wrap'
        );
        containers.forEach(function (cont) {
            var btn = cont.querySelector('.item-hover .view-info[aria-label], .view-info[aria-label]');
            if (!btn) return;

            var aria = btn.getAttribute('aria-label') || '';
            var labelText = buildAuctionLabelsFromAria(aria);
            if (!labelText) return;

            var host = findAuctionLabelHostFromContainer(cont);
            if (!host) return;

            if (host.dataset.bonusText === labelText) {
                var existing = host.querySelector('.torn-bonus-overlay-label');
                if (existing) existing.textContent = labelText;
                return;
            }

            host.dataset.bonusText = labelText;
            var labelEl = ensureOverlayLabelElement(host);
            labelEl.textContent = labelText;
        });
    }

    // On auction page, poll periodically instead of observing mutations
    if (IS_AUCTION) {
        // Run once immediately, then every second
        processAuctionItems();
        setInterval(processAuctionItems, 1000);
    }

    /* ---------- Core: process bonus icons (non-auction) ---------- */

    function processBonusIconGeneric(icon) {
        var info = buildBonusInfo(icon);
        if (!info.label) return;

        var nameSpan = findNameSpanFromIcon(icon);
        if (!nameSpan) return;

        if (!nameSpan.dataset.originalName) {
            var raw = cleanBaseName(nameSpan.textContent);
            nameSpan.dataset.originalName = raw;
        }

        var baseName = nameSpan.dataset.originalName;
        var existing = nameSpan.dataset.bonusText || '';
        var parts = existing ? existing.split(' & ') : [];

        if (parts.indexOf(info.label) === -1) {
            parts.push(info.label);
            var newLabelText = parts.join(' & ');
            nameSpan.dataset.bonusText = newLabelText;
            nameSpan.textContent = baseName + ' | ' + newLabelText;
        }
    }

    function processBonusIconMarket(icon) {
        var info = buildBonusInfo(icon);
        if (!info.label) return;

        var host = findMarketLabelHost(icon);
        if (!host) return;

        var existing = host.dataset.bonusText || '';
        var parts = existing ? existing.split(' & ') : [];

        if (parts.indexOf(info.label) === -1) parts.push(info.label);

        var newText = parts.join(' & ');
        host.dataset.bonusText = newText;

        var labelEl = ensureOverlayLabelElement(host);
        labelEl.textContent = newText;
    }

    function processBonusIconBazaar(icon) {
        var info = buildBonusInfo(icon);
        if (!info.label) return;

        var host = findBazaarLabelHost(icon);
        if (!host) return;

        var existing = host.dataset.bonusText || '';
        var parts = existing ? existing.split(' & ') : [];

        if (parts.indexOf(info.label) === -1) parts.push(info.label);

        var newText = parts.join(' & ');
        host.dataset.bonusText = newText;

        var labelEl = ensureOverlayLabelElement(host);
        labelEl.textContent = newText;
    }

    function processBonusIcon(icon) {
        if (!icon) return;
        icon.style.cursor = 'pointer';

        if (IS_AUCTION) {
            // Auction handled purely via aria-label polling; nothing to do here
            return;
        }

        if (IS_ITEMMARKET_MAIN) {
            processBonusIconMarket(icon);
        } else if (IS_BAZAAR) {
            processBonusIconBazaar(icon);
        } else {
            processBonusIconGeneric(icon);
        }
    }

    function processAllExistingIcons() {
        var icons = document.querySelectorAll("i[class*='bonus-attachment-']");
        icons.forEach(processBonusIcon);
    }

    /* ---------- Init + MutationObserver (non-auction pages only) ---------- */

    processAllExistingIcons();

    if (!IS_AUCTION) {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.type === 'childList') {
                    m.addedNodes.forEach(function (node) {
                        if (!(node instanceof HTMLElement)) return;

                        if (node.matches && node.matches("i[class*='bonus-attachment-']")) {
                            processBonusIcon(node);
                        } else if (node.querySelectorAll) {
                            var icons = node.querySelectorAll("i[class*='bonus-attachment-']");
                            icons.forEach(processBonusIcon);
                        }
                    });
                } else if (m.type === 'attributes') {
                    var node = m.target;
                    if (node instanceof HTMLElement &&
                        node.matches("i[class*='bonus-attachment-']")) {
                        processBonusIcon(node);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                'class',
                'title',
                'data-title',
                'data-tooltip',
                'aria-label',
                'aria-describedby',
                'data-bonus-attachment-title',
                'data-bonus-attachment-description'
            ]
        });
    }

    /* ---------- Click-to-popup for any bonus icon ---------- */

    document.addEventListener('click', function (e) {
        var icon = e.target.closest && e.target.closest("i[class*='bonus-attachment-']");
        if (!icon) return;

        e.preventDefault();
        e.stopPropagation();

        var info = buildBonusInfo(icon);
        var content = info.html || info.label || '';
        showModal(content);
    });

})();
