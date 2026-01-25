// ==UserScript==
// @name         Shiki collection bookmarks and some improvements
// @version      0.9
// @description  Добавляет возможность сохранять коллекции в закладки, редиректит 404 страниц на .rip и убирает размытие с постеров
// @author       corviciuz
// @match        https://shikimori.one/*
// @match        https://shikimori.rip/*
// @namespace    https://shikimori.one/corviciuz
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564040/Shiki%20collection%20bookmarks%20and%20some%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/564040/Shiki%20collection%20bookmarks%20and%20some%20improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const handleRedirect = () => {
        if (location.hostname !== 'shikimori.one') return false;
        const path = location.pathname;
        const isTargetSection = path.startsWith('/animes/') || path.startsWith('/mangas/');
        if (!isTargetSection) return false;
        const is404 = document.title === '404' || !!document.querySelector('link[href*="page404"]');
        if (is404) {
            const newUrl = location.href.replace('shikimori.one', 'shikimori.rip');
            location.replace(newUrl);
            return true;
        }
        return false;
    };

    handleRedirect();

    if (location.hostname === 'shikimori.one') {
        const redirectObserver = new MutationObserver(() => {
            handleRedirect();
        });
        redirectObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    document.addEventListener('turbo:load', handleRedirect);

    const STORAGE_KEY = 'shiki_fav_collections_v2';
    const styles = `
        :root {
            --font-size-base-desktop: 13px;
            --font-size-base-mobile: 13px;
            --font-main: Helvetica Neue, Arial, Verdana, sans-serif;
            --font-alt: Open Sans, Helvetica Neue, Arial, Verdana, sans-serif;
            --font-alt-hadline-letter-spacing: 0.18px;
            --font-alt-text-letter-spacing: -0.13px;
        }

        @keyframes favOverlayOpen {
            0%   { background: rgba(0,0,0,0); backdrop-filter: blur(0px); }
            100% { background: rgba(0,0,0,0.3); backdrop-filter: blur(3px); }
        }
        @keyframes favOverlayClose {
            0%   { background: rgba(0,0,0,0.3); backdrop-filter: blur(3px); }
            100% { background: rgba(0,0,0,0); backdrop-filter: blur(0px); }
        }

        @keyframes favModalOpen {
            0%   { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        @keyframes favModalClose {
            0%   { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.95); }
        }

        .shiki-fav-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 999999;
            display: flex; justify-content: center; align-items: center;
            -webkit-text-size-adjust: 100%;
        }
        .shiki-fav-overlay.open { animation: favOverlayOpen 0.1s ease-out forwards; }
        .shiki-fav-overlay.close { animation: favOverlayClose 0.2s ease-in forwards; }

        .shiki-fav-modal {
            background: var(--background-color, #fff);
            width: 35%;
            max-width: 95%;
            max-height: 85vh;
            border-radius: 4px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: var(--font-main);
            font-size: var(--font-size-base-desktop);
            line-height: 1.65;
            color: var(--headline-color, #123);
        }
        .shiki-fav-modal.open { animation: favModalOpen 0.1s ease-out forwards; }
        .shiki-fav-modal.close { animation: favModalClose 0.2s ease-in forwards; }

        .shiki-fav-header {
            padding: 12px 20px;
            border-bottom: 1px solid var(--headline-border-color, #d8dde4);
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 18px;
            align-items: center;
            background: var(--headline-background-color, #e8ebef);
            color: var(--headline-color, #123);
            letter-spacing: var(--font-alt-hadline-letter-spacing);
        }

        .shiki-fav-close { cursor: pointer; font-size: 20px; opacity: 0.5; }
        .shiki-fav-list { padding: 0; overflow-y: auto; flex: 1; background: var(--background-color, #fff); }

        .shiki-fav-item {
            padding: 15px 20px;
            border-bottom: 1px solid var(--headline-border-color, #eee);
            display: flex;
            flex-direction: column;
            position: relative;
            gap: 6px;
        }

        .fav-title-line {
            display: flex; align-items: center; flex-wrap: wrap;
            gap: 8px; margin-bottom: 2px;
        }

        .fav-title {
            font-weight: bold; font-size: 21px;
            color: var(--link-color, #176093); text-decoration: none; line-height: 1.2;
        }
        .fav-title:hover { color: var(--link-hover-color, #dd5202); }

        .fav-author-info-block { display: flex; gap: 12px; align-items: flex-start; }
        .fav-author-avatar { width: 48px; height: 48px; border-radius: 2px; object-fit: cover; flex-shrink: 0; }
        .fav-meta-col { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }

        .shiki-fav-modal .additionals { margin: 0; padding: 0; border: none; }
        .shiki-fav-modal .tags { display: flex; flex-wrap: wrap; gap: 4px; line-height: 1; margin-top: 4px; }

        .fav-meta-col .name-date {
            font-size: 14px; line-height: 1.3;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            margin-top: 4px;
        }
        .fav-meta-col .name-date a.name {
            color: var(--link-color, #176093); font-weight: bold; text-decoration: none;
        }
        .fav-meta-col .name-date a.name:hover { color: var(--link-hover-color, #dd5202); }

        .shiki-fav-heart {
			font-family: inherit; font-weight: 700; display: inline-block; cursor: pointer;
			margin-left: 10px; font-size: 32px; vertical-align: middle;
            transform: translateY(-1px); transition: transform 0.2s, color 0.2s;
			user-select: none; line-height: 1; visibility: hidden;
		}
		.shiki-fav-heart:hover { transform: translateY(-1px) scale(1.1); }
		.shiki-fav-heart.is-saved { color: #e74c3c; visibility: visible; }
		.shiki-fav-heart.not-saved { color: #95a5a6; opacity: 0.8; filter: blur(1.5px); visibility: visible; }
        .shiki-fav-heart.header-only { visibility: visible; }

        .b-topic header .shiki-fav-heart { font-size: 24px; margin-left: 5px; opacity: 0.8; }
        .b-topic header .shiki-fav-heart.is-saved { opacity: 1; }
        .b-topic header .shiki-fav-heart:hover { opacity: 1; }

        .shiki-fav-del { position: absolute; top: 15px; right: 15px; cursor: pointer; color: #ccc; transition: color 0.2s; font-size: 18px; }
        .shiki-fav-del:hover { color: #e74c3c; }

        .shiki-fav-menu-link { color: #ffffff !important; }

        @keyframes favPulse {
			0%   { transform: translateY(-1px) scale(1.1); opacity: 0.8; filter: blur(1.5px); color: #95a5a6; }
            50%  { transform: translateY(-1px) scale(1.25); }
			100% { transform: translateY(-1px) scale(1); opacity: 1; filter: blur(0px); color: #e74c3c; }
		}
		.shiki-fav-heart.animate-add { animation: favPulse 0.4s ease-out forwards }
    `;

    const injectStyles = () => {
        if (!document.head) return;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };

    if (document.head) injectStyles();
    else {
        const styleObserver = new MutationObserver(() => {
            if (document.head) {
                injectStyles();
                styleObserver.disconnect();
            }
        });
        styleObserver.observe(document.documentElement, { childList: true });
    }

    function getFavs() {
        return JSON.parse(GM_getValue(STORAGE_KEY, '{}'));
    }

    function saveFavs(d) {
        GM_setValue(STORAGE_KEY, JSON.stringify(d));
    }

    function collectMetadata() {
        const h1 = document.querySelector('header.head h1');
        const authorEl = document.querySelector('.author-name');
        const authorMeta = document.querySelector('meta[itemprop="author"]');
        const avatarImg = document.querySelector('.author-avatar img');
        const posterImg = document.querySelector('.poster img');
        
        let title = 'Без названия';
        if (h1 && h1.firstChild && h1.firstChild.textContent) {
            title = h1.firstChild.textContent.trim();
        }
        
        const data = {
            title: title,
            url: location.pathname,
            authorName: authorEl ? authorEl.textContent.trim() : (authorMeta ? authorMeta.content : 'Аноним'),
            authorUrl: authorEl ? authorEl.getAttribute('href') : '',
            authorAvatar: avatarImg ? avatarImg.src : (posterImg ? posterImg.src : ''),
            isCensored: !!document.querySelector(
                '.status-tags .censored, .b-anime_status_tag.censored'),
            tags: Array.from(
                document.querySelectorAll('.tags .b-tag, .tags .collection-tag'))
                .map(t => t.dataset.text || t.textContent.trim())
                .filter(Boolean)
        };
        
        return data;
    }

    function collectMetadataFromArticle(article) {
        const nameLink = article.querySelector('a.name');
        if (!nameLink) return null;

        const authorMeta = article.querySelector('meta[itemprop="author"]');
        const posterImg = article.querySelector('.poster img');
        
        const data = {
            title: nameLink.title || nameLink.textContent.trim() || 'Без названия',
            url: nameLink.getAttribute('href') || '',
            authorName: authorMeta ? authorMeta.content : 'Аноним',
            authorUrl: '',
            authorAvatar: posterImg ? posterImg.src : '',
            isCensored: !!article.querySelector('.censored'),
            tags: Array.from(article.querySelectorAll('.collection-tag'))
                .map(t => t.dataset.text || t.textContent.trim())
                .filter(Boolean)
        };
        
        return data;
    }

    function toggleFav(id, manualData = null) {
        const favs = getFavs();
        const exists = !!favs[id];
        if (exists) {
            delete favs[id];
        } else {
            favs[id] = manualData || collectMetadata();
        }
        saveFavs(favs);
        return !exists;
    }

    function showModal() {
        document.querySelectorAll('.shiki-fav-overlay').forEach(el => el.remove());
        const favs = getFavs();
        const keys = Object.keys(favs);

        let listHtml = '';
        if (keys.length === 0) {
            listHtml = '<div style="text-align:center; padding:50px; color:#888;">Здесь пока пусто, ня...</div>';
        } else {
            listHtml = keys.reverse().map(id => {
                const item = favs[id];
                return `
                <div class="shiki-fav-item" id="fav-row-${id}">
                    <div class="fav-title-line">
                        ${item.isCensored ? '<div class="b-anime_status_tag censored" data-text="18+" style="font-size:12px; padding:1px 4px;"></div>' : ''}
                        <a href="${item.url}" class="fav-title">${item.title}</a>
                    </div>
                    <div class="fav-author-info-block">
                        ${item.authorAvatar ? `<img src="${item.authorAvatar}" class="fav-author-avatar">` : ''}
                        <div class="fav-meta-col">
                            <div class="additionals">
                                <div class="tags">
                                    ${(item.tags || []).map(t => `<a class="b-anime_status_tag collection-tag" data-text="${t}" href="/collections?search=%23${encodeURIComponent(t)}"></a>`).join('')}
                                </div>
                            </div>
                            <div class="name-date">
                                <a class="name" href="${item.authorUrl || '#'}">${item.authorName}</a>
                            </div>
                        </div>
                    </div>
                    <span class="shiki-fav-del" data-id="${id}" title="Удалить">✕</span>
                </div>
                `;
            }).join('');
        }

        const overlay = document.createElement('div');
        overlay.className = 'shiki-fav-overlay open';
        overlay.innerHTML = `
            <div class="shiki-fav-modal open">
                <div class="shiki-fav-header">
                    <span>Мое любимое</span>
                    <span class="shiki-fav-close">✕</span>
                </div>
                <div class="shiki-fav-list">${listHtml}</div>
            </div>
        `;

        const modal = overlay.querySelector('.shiki-fav-modal');
        const closeModal = () => {
            overlay.classList.replace('open', 'close');
            modal.classList.replace('open', 'close');
            overlay.addEventListener('animationend', (e) => {
                if (e.target === overlay) overlay.remove();
            }, { once: true });
            setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 300);
        };

        overlay.querySelector('.shiki-fav-close').onclick = () => closeModal();
        overlay.onclick = (e) => { if(e.target === overlay) closeModal(); };

        overlay.querySelectorAll('.shiki-fav-del').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const id = this.dataset.id;
                const f = getFavs();
                delete f[id];
                saveFavs(f);
                const row = document.getElementById(`fav-row-${id}`);
                if (row) {
                    row.remove();
                }
                document.querySelectorAll(`.shiki-fav-heart[data-id="${id}"]`).forEach(h => {
                   h.className = h.classList.contains('header-only') ? 'shiki-fav-heart header-only not-saved' : 'shiki-fav-heart not-saved';
                });

                if (Object.keys(getFavs()).length === 0) {
                    overlay.querySelector('.shiki-fav-list').innerHTML = '<div style="text-align:center; padding:50px; color:#888;">Здесь пока пусто, ня...</div>';
                }
            };
        });

        document.body.appendChild(overlay);
    }

	function createHeartFor(container, id, isHeader = false, article = null) {
		try {
            if (!container || container.querySelector('.shiki-fav-heart')) return;

            const favs = getFavs();
			const isSaved = !!favs[id];
			const btn = document.createElement('span');
			btn.className = 'shiki-fav-heart ' + (isHeader ? 'header-only ' : '') + (isSaved ? 'is-saved' : 'not-saved');
			btn.innerText = '♡';
            btn.dataset.id = id;

			btn.addEventListener('click', (e) => {
				e.preventDefault();
                e.stopPropagation();
				if (btn.dataset.busy === '1') return;
				btn.dataset.busy = '1';

                const data = article ? collectMetadataFromArticle(article) : null;
                const newState = toggleFav(id, data);

                document.querySelectorAll(`.shiki-fav-heart[data-id="${id}"]`).forEach(h => {
                    if (newState) {
                        h.classList.remove('not-saved');
                        h.classList.add('is-saved', 'animate-add');
                        const onAddEnd = () => {
                            h.classList.remove('animate-add');
                            h.removeEventListener('animationend', onAddEnd);
                            h.dataset.busy = '0';
                        };
                        h.addEventListener('animationend', onAddEnd);
                    } else {
                        h.classList.remove('is-saved');
                        h.classList.add('not-saved');
                        h.dataset.busy = '0';
                    }
                });
			});
			container.appendChild(btn);
		} catch (e) { console.error('shiki-fav: heart error', e); }
	}

    const globalObserver = new MutationObserver(() => {
        requestAnimationFrame(() => {
            const h1 = document.querySelector('header.head h1');
            if (h1 && !h1.querySelector('.shiki-fav-heart')) {
                const match = location.pathname.match(/^\/collections\/(\d+)(?:-|$)/);
                if (match) createHeartFor(h1, match[1], true);
            }

            document.querySelectorAll('article.b-collection-topic').forEach(article => {
                const nameContainer = article.querySelector('.name-date');
                if (nameContainer && !nameContainer.querySelector('.shiki-fav-heart')) {
                    const link = article.querySelector('a.name');
                    if (link) {
                        const idMatch = link.href.match(/collections\/(\d+)/);
                        if (idMatch) createHeartFor(nameContainer, idMatch[1], false, article);
                    }
                }
            });
        });
    });
    globalObserver.observe(document.documentElement, { childList: true, subtree: true });

    function injectMenuLinkInto(submenu, anchor) {
        if (!submenu || submenu.dataset.shikiFavInjected === '1') return;
        const link = document.createElement('a');
        link.className = 'icon-collections shiki-fav-menu-link';
        link.href = '#';
        link.innerHTML = '<span class="text">Закладки</span>';
        link.onclick = (e) => { e.preventDefault(); showModal(); };
        if (anchor && anchor.parentNode) anchor.after(link);
        else submenu.appendChild(link);
        submenu.dataset.shikiFavInjected = '1';
    }

    const menuObserver = new MutationObserver(() => {
        document.querySelectorAll('.submenu').forEach(sm => {
            const anchor = sm.querySelector('a.icon-manga_list');
            injectMenuLinkInto(sm, anchor);
        });
    });
    menuObserver.observe(document.documentElement, { childList: true, subtree: true });

    function unblurAll() {
        document.querySelectorAll('.is-moderation_censored').forEach(el => {
            el.classList.remove('is-moderation_censored');
            el.style.filter = 'none';
            el.style.backdropFilter = 'none';
        });
    }
    unblurAll();
    new MutationObserver(unblurAll).observe(document.documentElement, { childList: true, subtree: true });
})();