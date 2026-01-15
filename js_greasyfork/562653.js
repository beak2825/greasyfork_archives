// ==UserScript==
// @name         豆瓣影视添加影巢对应链接
// @namespace    https://github.com/anonymous/
// @version      0.9.1
// @description  豆瓣影视添加影巢对应链接，在IMDb ID下方
// @author       Grok + 你
// @match        https://movie.douban.com/subject/*
// @match        https://www.douban.com/location/*/movie/subject/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562653/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E6%B7%BB%E5%8A%A0%E5%BD%B1%E5%B7%A2%E5%AF%B9%E5%BA%94%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/562653/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E6%B7%BB%E5%8A%A0%E5%BD%B1%E5%B7%A2%E5%AF%B9%E5%BA%94%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TMDB_API_KEY = 'ebb2c093078553178d5d75c6d86d7bde';
    const CACHE_PREFIX = 'tmdb_id_cache_';
    const CACHE_EXPIRE_DAYS = 30; // 缓存有效期 30 天

    let observer = null;
    let fallbackTimer = null;
    let processed = false;

    // 缓存相关函数
    function getCacheKey(doubanId) {
        return CACHE_PREFIX + doubanId;
    }

    function getCachedTMDB(doubanId) {
        const key = getCacheKey(doubanId);
        const cached = GM_getValue(key, null);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000) {
            GM_deleteValue(key); // 过期删除
            return null;
        }
        return {
            tmdbId: cached.tmdbId,
            type: cached.type
        };
    }

    function setCache(doubanId, tmdbId, type) {
        const key = getCacheKey(doubanId);
        GM_setValue(key, {
            tmdbId: tmdbId,
            type: type,
            timestamp: Date.now()
        });
    }

    function addNestLink(tmdbId, finalType, infoElm) {
        if (processed) return;
        processed = true;

        const url = `https://hdhive.com/tmdb/${finalType}/${tmdbId}`;
        const pl = document.createElement('span');
        pl.className = 'pl';
        pl.textContent = '影巢: ';

        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'nofollow';
        link.textContent = tmdbId;

        const line = document.createElement('span');
        line.appendChild(pl);
        line.appendChild(link);

        try {
            infoElm.appendChild(line);
            infoElm.appendChild(document.createElement('br'));
            console.log('影巢链接插入成功:', url);
        } catch (e) {
            console.error('插入失败，fallback:', e);
            infoElm.appendChild(document.createElement('br'));
            infoElm.appendChild(line);
        }

        if (observer) observer.disconnect();
        if (fallbackTimer) clearTimeout(fallbackTimer);
    }

    async function fetchTMDBId(imdbId, title, year, mediaType) {
        try {
            if (imdbId) {
                const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
                const res = await fetch(findUrl);
                if (res.ok) {
                    const data = await res.json();
                    if (data.tv_results?.length > 0) {
                        return { tmdbId: data.tv_results[0].id, type: 'tv' };
                    } else if (data.movie_results?.length > 0) {
                        return { tmdbId: data.movie_results[0].id, type: 'movie' };
                    }
                }
            }

            // fallback: 标题 + 年份搜索
            if (!title || !year) return null;

            const types = [mediaType, mediaType === 'movie' ? 'tv' : 'movie'];
            for (const type of types) {
                const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}&language=zh-CN`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data.results?.length > 0) {
                        return { tmdbId: data.results[0].id, type };
                    }
                }
            }
            return null;
        } catch (e) {
            console.error('TMDB 查询出错:', e);
            return null;
        }
    }

    async function tryGetAndAddLink(doubanId, imdbId, title, year, mediaType, infoElm) {
        // 1. 先查缓存
        let cached = getCachedTMDB(doubanId);
        if (cached) {
            console.log('使用缓存 TMDB ID:', cached.tmdbId);
            addNestLink(cached.tmdbId, cached.type, infoElm);
            return;
        }

        // 2. 无缓存 → 网络请求
        const result = await fetchTMDBId(imdbId, title, year, mediaType);
        if (result) {
            console.log('获取到 TMDB ID:', result.tmdbId);
            // 存入缓存
            setCache(doubanId, result.tmdbId, result.type);
            addNestLink(result.tmdbId, result.type, infoElm);
        } else {
            console.warn('未能获取 TMDB ID');
        }
    }

    function getDoubanIdFromUrl() {
        const match = location.pathname.match(/\/subject\/(\d+)/);
        return match ? match[1] : null;
    }

    async function main() {
        console.log('脚本启动');
        processed = false;

        let infoElm = document.querySelector('#info');
        if (!infoElm) {
            infoElm = await new Promise(resolve => {
                const obs = new MutationObserver(() => {
                    const el = document.querySelector('#info');
                    if (el) {
                        obs.disconnect();
                        resolve(el);
                    }
                });
                obs.observe(document.body, { childList: true, subtree: true });
            });
        }

        const doubanId = getDoubanIdFromUrl();
        if (!doubanId) {
            console.warn('无法获取豆瓣 ID');
            return;
        }

        // 提取标题、年份、类型
        const titleElm = document.querySelector('#content h1 span[property="v:itemreviewed"]');
        const title = titleElm ? titleElm.textContent.trim().replace(/第[一二三四五六七八九十]+季/i, '').replace(/ Season \d+/i, '').trim() : '';

        const year = document.querySelector('#content h1 .year')?.textContent.replace(/[()]/g, '').trim() || '';

        const mediaType = /季数:|集数:|单集片长:/i.test(infoElm.innerHTML) ? 'tv' : 'movie';

        // 尝试从页面提取 IMDb ID
        let imdbId = null;
        const plSpans = infoElm.querySelectorAll('span.pl');
        for (let span of plSpans) {
            if (span.textContent.trim().startsWith('IMDb:')) {
                const rowText = span.parentElement.textContent.trim();
                const match = rowText.match(/tt\d+/i);
                if (match) imdbId = match[0];
                break;
            }
        }

        // 开始查找（优先缓存）
        await tryGetAndAddLink(doubanId, imdbId, title, year, mediaType, infoElm);

        // 如果页面动态加载了 IMDb 行，再次尝试
        if (!processed && !imdbId) {
            observer = new MutationObserver(() => {
                if (processed) return;
                let newImdbId = null;
                const plSpans = infoElm.querySelectorAll('span.pl');
                for (let span of plSpans) {
                    if (span.textContent.trim().startsWith('IMDb:')) {
                        const rowText = span.parentElement.textContent.trim();
                        const match = rowText.match(/tt\d+/i);
                        if (match) {
                            newImdbId = match[0];
                            tryGetAndAddLink(doubanId, newImdbId, title, year, mediaType, infoElm);
                            observer.disconnect();
                            break;
                        }
                    }
                }
            });
            observer.observe(infoElm, { childList: true, subtree: true, characterData: true });

            // 超时 fallback（无 IMDb 也尝试一次）
            fallbackTimer = setTimeout(() => {
                if (!processed) {
                    tryGetAndAddLink(doubanId, null, title, year, mediaType, infoElm);
                }
            }, 4000);
        }
    }

    // 页面跳转时重新执行
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (observer) observer.disconnect();
            if (fallbackTimer) clearTimeout(fallbackTimer);
            main();
        }
    }).observe(document, { subtree: true, childList: true });

    // 初次执行
    main();
})();