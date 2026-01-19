// ==UserScript==
// @name         Пинги разделов
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Удобные пинги разделов форума
// @author       Forest
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563155/%D0%9F%D0%B8%D0%BD%D0%B3%D0%B8%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/563155/%D0%9F%D0%B8%D0%BD%D0%B3%D0%B8%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sectionsDB = GM_getValue('lz_db_v6', []);
    const lastFetch = GM_getValue('lz_ts_v6', 0);

    const style = document.createElement('style');
    style.innerHTML = `
        #lz-menu { position: absolute; z-index: 2147483647; background: #222; border: 1px solid #333; border-radius: 6px; box-shadow: 0 6px 16px rgba(0,0,0,0.6); display: none; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 13px; min-width: 250px; padding: 4px 0; }
        .lz-item { padding: 6px 14px; cursor: pointer; color: #ccc; display: flex; justify-content: space-between; align-items: center; transition: background 0.1s; }
        .lz-item:hover, .lz-item.active { background: #363636; color: #fff; }
        .lz-name { font-weight: bold; color: #fff; }
        .lz-hl { color: #229557; }
        .lz-parent { font-size: 11px; color: #666; margin-left: 10px; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; text-align: right; }
        .lz-item:hover .lz-parent, .lz-item.active .lz-parent { color: #999; }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'lz-menu';
    document.body.appendChild(menu);

    let activeIndex = 0;
    let currentMatch = null;

    if (!sectionsDB.length || (Date.now() - lastFetch) > 86400000) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://lolz.live/",
            onload: function(r) {
                const doc = new DOMParser().parseFromString(r.responseText, "text/html");
                const links = [];
                const seenUrls = new Set();

                const addLink = (name, url, parentName) => {
                    if (!name || !url) return;
                    let fullUrl = url.startsWith('http') ? url : 'https://lolz.live/' + url.replace(/^\//, '');
                    if (seenUrls.has(fullUrl)) return;
                    seenUrls.add(fullUrl);
                    links.push({ n: name, u: fullUrl, p: parentName });
                };

                const categories = doc.querySelectorAll('.node.category.level_1');

                categories.forEach(cat => {
                    const catTitleEl = cat.querySelector('.categoryText .nodeTitle');
                    const catName = catTitleEl ? catTitleEl.innerText.trim() : "";

                    const level2Nodes = cat.querySelectorAll('.node.level_2');

                    level2Nodes.forEach(l2 => {
                        const l2Link = l2.querySelector('.nodeTitle a');
                        if (l2Link) {
                            const l2Name = l2Link.innerText.trim();
                            const l2Url = l2Link.getAttribute('href');

                            addLink(l2Name, l2Url, catName);

                            const subNodes = l2.querySelectorAll('.subForumList .node');
                            subNodes.forEach(sub => {
                                const subLink = sub.querySelector('.nodeTitle a');
                                if (subLink) {
                                    const subName = subLink.innerText.trim();
                                    const subUrl = subLink.getAttribute('href');
                                    addLink(subName, subUrl, l2Name);
                                }
                            });
                        }
                    });
                });

                if (links.length) {
                    sectionsDB = links;
                    GM_setValue('lz_db_v6', links);
                    GM_setValue('lz_ts_v6', Date.now());
                }
            }
        });
    }

    function getTarget(e) {
        const path = e.composedPath ? e.composedPath() : [];
        return path[0] || e.target;
    }

    function getSel(el) {
        const root = el.getRootNode();
        if (root instanceof ShadowRoot && typeof root.getSelection === 'function') return root.getSelection();
        return window.getSelection();
    }

    document.addEventListener('keyup', function(e) {
        if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) return;

        let el = getTarget(e);
        if (el.nodeType === 3) el = el.parentNode;

        if (!el.isContentEditable && el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT') {
             el = el.closest('[contenteditable="true"]');
             if (!el) return;
        }

        const sel = getSel(el);
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const textNode = range.startContainer;
        if (textNode.nodeType !== 3) return;

        const text = textNode.textContent.slice(0, range.startOffset);
        const lastHash = text.lastIndexOf('#');

        if (lastHash !== -1 && (lastHash === 0 || /[\s\u00A0]/.test(text[lastHash - 1]))) {
            const query = text.slice(lastHash + 1);
            if (query.length < 1 || query.includes(' ')) { hideMenu(); return; }
            showMenu(query, range, lastHash, el);
        } else { hideMenu(); }
    });

    document.addEventListener('click', hideMenu);

    document.addEventListener('keydown', function(e) {
        if (!currentMatch || menu.style.display === 'none') return;
        const items = menu.querySelectorAll('.lz-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault(); e.stopPropagation();
            items[activeIndex].classList.remove('active');
            activeIndex = (activeIndex + 1) % items.length;
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); e.stopPropagation();
            items[activeIndex].classList.remove('active');
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault(); e.stopPropagation();
            insert(currentMatch.matches[activeIndex], currentMatch.range, currentMatch.hashIdx, currentMatch.el);
        } else if (e.key === 'Escape') hideMenu();
    }, true);

    function showMenu(q, range, hashIdx, el) {
        if (!sectionsDB.length) return;
        const ql = q.toLowerCase();
        const matches = sectionsDB.filter(i => i.n.toLowerCase().includes(ql))
            .sort((a, b) => {
                const aStarts = a.n.toLowerCase().startsWith(ql);
                const bStarts = b.n.toLowerCase().startsWith(ql);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
            }).slice(0, 7);

        if (!matches.length) { hideMenu(); return; }

        menu.innerHTML = '';
        matches.forEach((m, i) => {
            const div = document.createElement('div');
            div.className = `lz-item ${i === 0 ? 'active' : ''}`;

            const safeName = m.n.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const hlName = safeName.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<span class="lz-hl">$1</span>');
            const parentHtml = m.p ? `<span class="lz-parent">(${m.p})</span>` : '';

            div.innerHTML = `<span class="lz-name">${hlName}</span>${parentHtml}`;
            div.onmousedown = (e) => { e.preventDefault(); insert(m, range, hashIdx, el); };
            menu.appendChild(div);
        });

        const rect = range.getBoundingClientRect();
        menu.style.display = 'block';
        menu.style.top = (window.scrollY + rect.bottom + 8) + 'px';
        menu.style.left = (window.scrollX + rect.left) + 'px';
        activeIndex = 0;
        currentMatch = { matches, range, hashIdx, el };
    }

    function hideMenu() { menu.style.display = 'none'; currentMatch = null; }

    function insert(item, range, hashIdx, el) {
        const textNode = range.startContainer;
        const urlText = document.createTextNode(item.u);
        textNode.textContent = textNode.textContent.slice(0, hashIdx);
        const parent = textNode.parentNode;
        parent.insertBefore(urlText, textNode.nextSibling);
        const space = document.createTextNode(' ');
        parent.insertBefore(space, urlText.nextSibling);

        const newRange = document.createRange();
        newRange.setStart(space, 1); newRange.setEnd(space, 1);

        const sel = getSel(el);
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(newRange);
        }

        hideMenu();
    }
})();