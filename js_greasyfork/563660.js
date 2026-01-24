// ==UserScript==
// @name         ChatGPT User Anchors
// @namespace    https://github.com/Galkoff
// @version      0.0.4
// @description  Navigation menu for user messages in ChatGPT chats
// @author       Galkoff
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563660/ChatGPT%20User%20Anchors.user.js
// @updateURL https://update.greasyfork.org/scripts/563660/ChatGPT%20User%20Anchors.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MENU_ID = 'cgpt-user-anchor-menu';
    const TOGGLE_ID = 'cgpt-user-anchor-toggle';
    const STORAGE_KEY = 'cgpt-user-anchor-menu-visible';
    const HEADER_OFFSET = 16;
    const ACTIVE_ZONE_RATIO = 0.35;

    let lastCount = -1;
    let activeItem = null;
    let pairs = [];
    let scrollContainer = null;
    let hadTurns = false;
    let lastPath = location.pathname;

    let ignoreSpy = false;
    let ticking = false;
    let debounceTimer = null;

    function isMenuVisible() {
        return localStorage.getItem(STORAGE_KEY) !== '0';
    }

    function setMenuVisible(visible) {
        localStorage.setItem(STORAGE_KEY, visible ? '1' : '0');
        const menu = document.getElementById(MENU_ID);
        if (menu) menu.style.display = visible ? '' : 'none';
    }

    function getScrollParent(el) {
        while (el) {
            const style = getComputedStyle(el);
            if (/(auto|scroll)/.test(style.overflowY)) return el;
            el = el.parentElement;
        }
        return document.scrollingElement;
    }

    function findScrollContainer() {
        const firstArticle = document.querySelector('article[data-turn="user"]');
        if (!firstArticle) return null;
        return getScrollParent(firstArticle);
    }

    function resetState() {
        lastCount = -1;
        activeItem = null;
        pairs = [];
        scrollContainer = null;
        hadTurns = false;

        const menu = document.getElementById(MENU_ID);
        if (menu) menu.remove();
    }

    function ensureToggle() {
        if (document.getElementById(TOGGLE_ID)) return;

        const btn = document.createElement('button');
        btn.id = TOGGLE_ID;
        btn.innerHTML = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
  <path d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"/>
</svg>
`;

        btn.style.cssText = `
position: fixed;
top: 9px;
right: 170px;
width: 36px;
height: 36px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 10px;
border: none;
background: transparent;
color: var(--text-secondary, #aaa);
cursor: pointer;
z-index: 100000;
transition: background-color .15s ease, color .15s ease;
`;

        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'rgba(255,255,255,0.08)';
            btn.style.color = '#fff';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = 'var(--text-secondary, #aaa)';
        });

        btn.addEventListener('click', () => {
            setMenuVisible(!isMenuVisible());
        });

        document.body.appendChild(btn);
    }

    function ensureMenu() {
        let menu = document.getElementById(MENU_ID);
        if (menu) return menu;

        menu = document.createElement('div');
        menu.id = MENU_ID;

        menu.innerHTML = `
<style>
#${MENU_ID} {
  position: fixed;
  top: 50px;
  right: 20px;
  width: 340px;
  max-height: 70vh;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(32,32,32,0.88), rgba(18,18,18,0.88));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  padding: 14px;
  z-index: 99999;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
  color: #e8e8e8;
  box-shadow:
    0 10px 30px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.04);
}
#${MENU_ID} .title {
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 14px;
}
#${MENU_ID} .item {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 10px;
  align-items: center;
  padding: 9px 12px;
  margin-bottom: 10px;
  border-radius: 14px;
  cursor: pointer;
  transition: background .15s ease;
}
#${MENU_ID} .item:hover {
  background: rgba(255,255,255,0.08);
}
#${MENU_ID} .item.active {
  background: rgba(125,211,252,0.10);
  box-shadow: inset 2px 0 0 #7dd3fc;
}
#${MENU_ID} .num {
  font-size: 10px;
  opacity: .35;
  line-height: 1;
}
#${MENU_ID} .text {
  font-size: 13.5px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
<div class="title">User prompts</div>
`;

        document.body.appendChild(menu);
        setMenuVisible(isMenuVisible());
        return menu;
    }

    function preciseScroll(article) {
        if (!scrollContainer) return;

        const computeTarget = () => {
            const a = article.getBoundingClientRect();
            const c = scrollContainer.getBoundingClientRect();
            return scrollContainer.scrollTop + (a.top - c.top) - HEADER_OFFSET;
        };

        ignoreSpy = true;
        scrollContainer.scrollTop = computeTarget();

        setTimeout(() => {
            scrollContainer.scrollTop = computeTarget();
            ignoreSpy = false;
        }, 300);
    }

    function updateMenu() {
        const userTurns = document.querySelectorAll('article[data-turn="user"]');

        if (hadTurns && userTurns.length === 0) {
            resetState();
            return;
        }
        if (userTurns.length === 0) return;
        hadTurns = true;

        if (!scrollContainer) {
            scrollContainer = findScrollContainer();
            if (scrollContainer) {
                scrollContainer.addEventListener('scroll', onScroll, { passive: true });
            }
        }

        if (userTurns.length === lastCount) return;
        lastCount = userTurns.length;

        ensureToggle();
        const menu = ensureMenu();
        const existing = menu.querySelectorAll('.item').length;

        for (let i = existing; i < userTurns.length; i++) {
            const article = userTurns[i];
            const textNode = article.querySelector(
                '[data-message-author-role="user"] .whitespace-pre-wrap'
            );
            if (!textNode) continue;

            const text = textNode.innerText.trim().replace(/\n+/g, ' ').slice(0, 140);
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `<div class="num">${i + 1}</div><div class="text">${text}</div>`;

            item.addEventListener('click', () => {
                setActive(item);
                preciseScroll(article);
            });

            menu.appendChild(item);
            pairs.push({ article, item });
        }
    }

    function onScroll() {
        if (ignoreSpy || ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            updateActiveByScroll();
        });
    }

    function updateActiveByScroll() {
        if (!scrollContainer) return;

        const rect = scrollContainer.getBoundingClientRect();
        const activeLine = rect.top + rect.height * ACTIVE_ZONE_RATIO;

        let best = null;
        let bestDist = Infinity;

        for (const p of pairs) {
            const r = p.article.getBoundingClientRect();
            const d = Math.abs(r.top - activeLine);
            if (d < bestDist) {
                bestDist = d;
                best = p;
            }
        }
        if (best) setActive(best.item);
    }

    function setActive(item) {
        if (activeItem === item) return;
        if (activeItem) activeItem.classList.remove('active');
        item.classList.add('active');
        activeItem = item;
        item.scrollIntoView({ block: 'nearest' });
    }

    function watchNavigation() {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            resetState();
            setTimeout(updateMenu, 500);
            setTimeout(updateMenu, 1500);
        }
    }

    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            watchNavigation();
            updateMenu();
        }, 600);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(updateMenu, 600);
    setTimeout(updateMenu, 1500);
})();
