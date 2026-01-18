// ==UserScript==
// @name         豆瓣影视添加影巢对应链接
// @namespace    https://douban-to-hdhive.github.com
// @version      0.9.3
// @description  豆瓣影视添加影巢对应链接，在IMDb ID下方
// @author       DemoJameson
// @match        https://movie.douban.com/subject/*
// @match        https://www.douban.com/location/*/movie/subject/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562653/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E6%B7%BB%E5%8A%A0%E5%BD%B1%E5%B7%A2%E5%AF%B9%E5%BA%94%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/562653/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E6%B7%BB%E5%8A%A0%E5%BD%B1%E5%B7%A2%E5%AF%B9%E5%BA%94%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TMDB_API_KEY = 'ebb2c093078553178d5d75c6d86d7bde';
    const DOUBAN_API_KEY = '0ac44ae016490db2204ce0a042db2916';
    const TMDB_CACHE_PREFIX = 'tmdb_id_cache_';
    const REAL_URL_CACHE_PREFIX = 'real_hive_url_cache_';
    const CACHE_EXPIRE_DAYS = 30;

    let observer = null;
    let fallbackTimer = null;
    let processed = false;

    // 缓存相关函数（不变）
    function getCacheKey(doubanId) {
        return TMDB_CACHE_PREFIX + doubanId;
    }

    function getCachedTMDB(doubanId) {
        const key = getCacheKey(doubanId);
        const cached = GM_getValue(key, null);
        if (!cached) return null;
        const now = Date.now();
        if (now - cached.timestamp > CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000) {
            GM_deleteValue(key);
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

    function getRealUrlCacheKey(tmdbId, type) {
        return REAL_URL_CACHE_PREFIX + type + '_' + tmdbId;
    }

    function getCachedRealUrl(tmdbId, type) {
        const key = getRealUrlCacheKey(tmdbId, type);
        const cached = GM_getValue(key, null);
        if (!cached) return null;
        const now = Date.now();
        if (now - cached.timestamp > CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000) {
            GM_deleteValue(key);
            return null;
        }
        return cached.realUrl;
    }

    function setRealUrlCache(tmdbId, type, realUrl) {
        const key = getRealUrlCacheKey(tmdbId, type);
        GM_setValue(key, {
            realUrl: realUrl,
            timestamp: Date.now()
        });
    }

    async function addNestLink(tmdbId, finalType, infoElm) {
        if (processed) return;
        processed = true;

        const url = await getRealHiveUrl(tmdbId, finalType);

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
            console.error('影巢链接插入失败:', e);
        }

        if (observer) observer.disconnect();
        if (fallbackTimer) clearTimeout(fallbackTimer);
    }

    async function getRealHiveUrl(tmdbId, finalType) {
        const cachedUrl = getCachedRealUrl(tmdbId, finalType);
        if (cachedUrl) {
            console.log('[缓存命中] 影巢真实链接:', cachedUrl);
            return cachedUrl;
        }

        const url = `https://hdhive.com/tmdb/${finalType}/${tmdbId}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                anonymous: true,           // 尽量避免带 cookie 过去
                headers: {
                    "User-Agent": navigator.userAgent,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "zh-CN,zh;q=0.9"
                },
                onload: function (response) {
                    const html = response.responseText;
                    const regex = new RegExp(`/${finalType}/[0-9a-f]{32}`);
                    const urlMatch = html.match(regex);

                    if (urlMatch) {
                        let realUrl = `https://hdhive.com${urlMatch[0]}`;
                        setRealUrlCache(tmdbId, finalType, realUrl);
                        resolve(realUrl);
                    } else {
                        console.warn('未解析到真实链接，使用原链接');
                        resolve(url);
                    }
                },
                onerror: function () {
                    resolve(url);
                },
                ontimeout: function () {
                    resolve(url);
                }
            });
        });
    }

    async function fetchTMDBId(imdbId, title, year, mediaType) {
        try {
            // 優先用 imdbId 找（最準）
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

            if (!title || !year) return null;

            // 第一次搜尋：原始標題 + 年份
            let searchTitle = title.trim();
            let tmdbResult = await searchTMDB(searchTitle, year, mediaType);
            if (tmdbResult) return tmdbResult;

            // 第二次嘗試：如果標題結尾是數字 → 去掉數字再試一次
            const endsWithNumberPattern = /\d+$/i;

            if (endsWithNumberPattern.test(searchTitle)) {
                // 去掉結尾的年份/季數/數字部分
                let cleanedTitle = searchTitle
                    .replace(/\d+$/, '')
                    .trim();

                tmdbResult = await searchTMDB(cleanedTitle, year, mediaType);
                if (tmdbResult) return tmdbResult;
            }

            return null;

        } catch (e) {
            console.error('TMDB 查询出错:', e);
            return null;
        }
    }

    // 抽取成獨立搜尋函數，方便重用
    async function searchTMDB(queryTitle, year, mediaType) {
        const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(queryTitle)}&year=${year}&language=zh-CN`;
        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        if (data.results?.length > 0) {
            return { tmdbId: data.results[0].id, type: mediaType };
        }
        return null;
    }

    async function fetchDoubanTitleAndYear(doubanId) {
        return new Promise((resolve) => {
            const url = `https://frodo.douban.com/api/v2/movie/${doubanId}?apikey=${DOUBAN_API_KEY}&locale=zh-CN`;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "User-Agent": "MicroMessenger/8.0.0",
                    "Referer": "https://servicewechat.com/wx2f9b06c1de1ccfca",
                    "Host": "frodo.douban.com",
                    "Accept": "application/json",
                    "Accept-Language": "zh-CN,zh;q=0.9"
                },
                anonymous: true,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);

                            // 标题清洗（保持不变）
                            let rawTitle = data.title || data.name || '';
                            rawTitle = rawTitle
                                .replace(/第[一二三四五六七八九十]+(季|期)/i, '')
                                .replace(/Season \d+/i, '')
                                .replace(/시즌\d+/i, '')
                                .trim();

                            const year = data.year || (data.pubdate?.[0] ? data.pubdate[0].slice(0,4) : '');

                            // ─────────────── 新增：判断 mediaType ───────────────
                            let mediaType = 'movie';  // 默认电影

                            // 方式1：最推荐，看 subtype（通常最准确）
                            if (data.subtype === 'tv' || data.subtype === 'series') {
                                mediaType = 'tv';
                            }
                            // 方式2：备选，看是否有集数/季数相关字段
                            else if (
                                data.episode_count > 1 ||
                                data.season_count > 1 ||
                                data.card?.type === 'series' ||
                                /季|season/i.test(data.title) ||
                                data.title?.includes('第') && data.title?.match(/季|期/)
                            ) {
                                mediaType = 'tv';
                            }

                            console.log('Frodo API 成功:', rawTitle, year, 'mediaType:', mediaType);
                            resolve({ title: rawTitle, year, mediaType });
                        } catch (e) {
                            console.error('JSON 解析失败:', e);
                            resolve({ title: '', year: '', mediaType: 'movie' });
                        }
                    } else {
                        console.warn('Frodo API 失败 status:', response.status);
                        resolve({ title: '', year: '', mediaType: 'movie' });
                    }
                },
                onerror: function () {
                    resolve({ title: '', year: '', mediaType: 'movie' });
                }
            });
        });
    }

    async function tryGetAndAddLink(doubanId, imdbId, title, year, mediaType, infoElm) {
        let cached = getCachedTMDB(doubanId);
        if (cached) {
            console.log('使用缓存 TMDB ID:', cached.tmdbId);
            addNestLink(cached.tmdbId, cached.type, infoElm);
            return;
        }

        const result = await fetchTMDBId(imdbId, title, year, mediaType);
        if (result) {
            console.log('获取到 TMDB ID:', result.tmdbId);
            setCache(doubanId, result.tmdbId, result.type);
            await addNestLink(result.tmdbId, result.type, infoElm);
        } else {
            console.warn('未能获取 TMDB ID');
        }
    }

    function getDoubanIdFromUrl() {
        const match = location.pathname.match(/\/subject\/(\d+)/);
        return match ? match[1] : null;
    }

    async function main() {
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

        // 从豆瓣接口获取 title 和 year（取代页面元素读取）
        const { title, year, mediaType } = await fetchDoubanTitleAndYear(doubanId);

        // 尝试从页面提取 IMDb ID（逻辑不变）
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

        await tryGetAndAddLink(doubanId, imdbId, title, year, mediaType, infoElm);

        // 如果 IMDb 后续动态加载，仍然尝试
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

            fallbackTimer = setTimeout(() => {
                if (!processed) {
                    tryGetAndAddLink(doubanId, null, title, year, mediaType, infoElm);
                }
            }, 4000);
        }
    }

    // 页面跳转时重新执行（不变）
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (observer) observer.disconnect();
            if (fallbackTimer) clearTimeout(fallbackTimer);
            main();
        }
    }).observe(document, { subtree: true, childList: true });

    main();
})();