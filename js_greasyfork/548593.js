// ==UserScript==
// @name         爱影搜索助手 - 豆瓣&TMDb优化版
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在豆瓣和TMDB页面添加"搜索爱影"按钮，快速搜索影视资源，支持TMDB卡片悬停搜索，并在TMDB详情页一键复制ID
// @author       ccdfccgfddx
// @match        https://*.douban.com/subject/*
// @match        https://www.themoviedb.org/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/548593/%E7%88%B1%E5%BD%B1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%20-%20%E8%B1%86%E7%93%A3TMDb%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548593/%E7%88%B1%E5%BD%B1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%20-%20%E8%B1%86%E7%93%A3TMDb%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        searchUrl: 'https://subs.ayclub.vip/index.php?query=',
        windowWidth: 1200,
        windowHeight: 800,
        hoverDelay: 300,
        animationDelay: 10
    };

    // ==================== 样式 ====================
    GM_addStyle(`
        .ay-search-helper-btn {
            background: linear-gradient(135deg, #5d78ff 0%, #3b5bdb 100%);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 14px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(93, 120, 255, 0.3);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-left: 12px;
            white-space: nowrap;
            vertical-align: middle;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .ay-search-helper-btn:hover {
            background: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%);
            box-shadow: 0 4px 12px rgba(93, 120, 255, 0.4);
            transform: translateY(-2px);
        }
        .ay-search-helper-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(93, 120, 255, 0.3);
        }
        .ay-search-helper-card-btn {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #5d78ff 0%, #3b5bdb 100%);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .ay-search-helper-card-btn:hover {
            background: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%);
            box-shadow: 0 4px 12px rgba(93, 120, 255, 0.5);
        }
        .card.style_1:hover .ay-search-helper-card-btn {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        @keyframes ay-search-helper-fadein {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ay-search-helper-btn-added {
            animation: ay-search-helper-fadein 0.3s ease-out;
        }
        .subject-title .ay-search-helper-btn {
            margin-left: 15px;
        }
        [data-testid="hero-title-block__title"] + .ay-search-helper-btn {
            margin-left: 15px;
        }
        /* 复制成功提示样式 */
        .ay-toast {
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 13px;
            color: #000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            white-space: nowrap;
            opacity: 0;
            transform: translateY(-8px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 9999;
        }
        .ay-toast-show {
            opacity: 1;
            transform: translateY(0);
        }
    `);

    function showToastNearButton(button, message) {
        const toast = document.createElement('div');
        toast.className = 'ay-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        const rect = button.getBoundingClientRect();
        toast.style.top = `${rect.top - 35 + window.scrollY}px`;
        toast.style.left = `${rect.left}px`;
        requestAnimationFrame(() => {
            toast.classList.add('ay-toast-show');
        });
        setTimeout(() => {
            toast.classList.remove('ay-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }

    const platform = {
        isDouban: () => window.location.href.includes('douban.com/subject/'),
        isTMDB: () => window.location.href.includes('themoviedb.org'),
        isTMDBDetail: () => window.location.pathname.match(/^\/(movie|tv|tv-show)\/\d+/),
        isTMDBList: () => !platform.isTMDBDetail()
    };

    function init() {
        if (platform.isDouban()) {
            initDoubanPage();
        } else if (platform.isTMDB()) {
            if (platform.isTMDBDetail()) {
                initTMDBDetailPage();
            } else {
                initTMDBCardHoverSearch();
            }
        }
    }

    function initDoubanPage() {
        const observer = new MutationObserver(() => {
            const titleElement = document.querySelector('[property="v:itemreviewed"]');
            const yearElement = document.querySelector('.year');
            if (titleElement && yearElement && !document.querySelector('.ay-search-helper-btn')) {
                addSearchButtonToElement(titleElement, yearElement.nextSibling);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initTMDBDetailPage() {
        const observer = new MutationObserver(() => {
            const titleElement = document.querySelector('[data-testid="hero-title-block__title"]') ||
                               document.querySelector('.title h2') ||
                               document.querySelector('h2.title');
            if (titleElement && !titleElement.nextElementSibling?.classList.contains('ay-search-helper-btn')) {
                addSearchButtonToElement(titleElement, null, true);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initTMDBCardHoverSearch() {
        const observer = new MutationObserver(() => {
            processTMDBCards();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function processTMDBCards() {
        const cards = document.querySelectorAll('.card.style_1');
        cards.forEach(card => {
            if (card.hasAttribute('data-ay-search-helper-processed')) return;
            card.setAttribute('data-ay-search-helper-processed', 'true');
            card.style.position = 'relative';
            card.addEventListener('mouseenter', function() {
                setTimeout(() => addSearchButtonToCard(this), config.hoverDelay);
            });
        });
    }

    function addSearchButtonToCard(card) {
        const existingBtn = card.querySelector('.ay-search-helper-card-btn');
        if (existingBtn) existingBtn.remove();
        const title = getCardTitle(card);
        if (!title) return;
        const searchBtn = createCardSearchButton('搜索爱影', () => {
            searchAy(extractChineseTitle(title));
        });
        card.appendChild(searchBtn);
    }

    function getCardTitle(card) {
        const titleElement = card.querySelector('h2, .title, [class*="title"], [data-title]');
        if (titleElement?.textContent?.trim()) {
            return titleElement.textContent.trim();
        }
        const imgElement = card.querySelector('img');
        if (imgElement?.alt) {
            return imgElement.alt;
        }
        return null;
    }

    function addSearchButtonToElement(targetElement, insertBefore, isTMDB = false) {
        if (!targetElement) return;

        let title = '';
        if (isTMDB) {
            title = extractTMDBTitle(targetElement);
        } else {
            title = targetElement.textContent.trim();
        }
        if (!title) return;

        createSearchButton('搜索爱影', () => {
            searchAy(extractChineseTitle(title));
        }, insertBefore || targetElement.nextSibling);

        if (isTMDB) {
            const tmdbId = window.location.pathname.match(/^\/(movie|tv|tv-show)\/(\d+)/)?.[2];
            if (tmdbId) {
                const btnCopy = createSearchButton('复制TMDB ID', () => {
                    navigator.clipboard.writeText(tmdbId).then(() => {
                        showToastNearButton(btnCopy, `已复制 TMDB ID: ${tmdbId}`);
                    }).catch(err => {
                        console.error('复制失败', err);
                    });
                }, insertBefore || targetElement.nextSibling);
            }
        }
    }

    function extractTMDBTitle(titleElement) {
        if (titleElement.querySelector('a')) {
            const linkElement = titleElement.querySelector('a');
            if (linkElement && linkElement.textContent.trim()) {
                return linkElement.textContent.trim();
            }
        }
        const fullText = titleElement.textContent.trim();
        const withoutYear = fullText.replace(/\s*\(\d{4}\)\s*$/, '');
        if (withoutYear && withoutYear !== fullText) return withoutYear;
        const withoutYear2 = fullText.replace(/\s*\d{4}\s*$/, '');
        if (withoutYear2 && withoutYear2 !== fullText) return withoutYear2;
        return fullText;
    }

    function createSearchButton(text, onClick, insertBefore) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'ay-search-helper-btn';
        btn.onclick = onClick;
        if (insertBefore) {
            insertBefore.parentNode.insertBefore(btn, insertBefore);
        }
        setTimeout(() => btn.classList.add('ay-search-helper-btn-added'), config.animationDelay);
        return btn;
    }

    function createCardSearchButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'ay-search-helper-card-btn';
        btn.onclick = onClick;
        return btn;
    }

    function extractChineseTitle(title) {
        if (!title) return '';
        let processedTitle = removeSeasonInfo(title);
        processedTitle = processedTitle.replace(/\s+/g, ' ').trim();
        return processedTitle.substring(0, 20).trim();
    }

    function removeSeasonInfo(title) {
        const seasonPatterns = [
            /第[一二三四五六七八九十百零0-9]+季/g,
            /Season\s*\d+/gi,
            /S\d+/gi
        ];
        let processedTitle = title;
        seasonPatterns.forEach(pattern => {
            processedTitle = processedTitle.replace(pattern, '');
        });
        return processedTitle;
    }

    function searchAy(title) {
        if (!title) {
            alert('无法获取标题信息');
            return;
        }
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const left = (screenWidth - config.windowWidth) / 2;
        const top = (screenHeight - config.windowHeight) / 2;
        const windowFeatures = [
            `width=${config.windowWidth}`,
            `height=${config.windowHeight}`,
            `left=${left}`,
            `top=${top}`,
            'scrollbars=yes',
            'resizable=yes',
            'toolbar=no',
            'menubar=no',
            'location=no',
            'status=no'
        ].join(',');
        const searchUrl = `${config.searchUrl}${encodeURIComponent(title)}`;
        const newWindow = window.open(searchUrl, '_blank', windowFeatures);
        if (newWindow) {
            newWindow.focus();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();
