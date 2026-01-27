// ==UserScript==
// @name         MovieIsFine
// @version      1.0.4
// @description  在豆瓣电影页面显示电影分级信息
// @author       MovieIsFine
// @match        https://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// @connect      vercel.app
// @connect      caching.graphql.imdb.com
// @connect      www.imdb.com
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/1564456
// @downloadURL https://update.greasyfork.org/scripts/564015/MovieIsFine.user.js
// @updateURL https://update.greasyfork.org/scripts/564015/MovieIsFine.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // ============================================================
    // 配置区域
    // ============================================================

    // API 基础地址（可通过 GM_setValue 动态配置）
    const DEFAULT_API_BASE_URL = 'https://movie-is-fine-hvkm.vercel.app';

    // 本地缓存配置
    const CACHE_KEY = 'movieisfine_content_rating_cache';
    const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天
    const CACHE_MAX_ENTRIES = 100;

    /**
     * 获取 API 基础地址
     */
    function getApiBaseUrl() {
        return GM_getValue('apiBaseUrl', DEFAULT_API_BASE_URL);
    }

    /**
     * 读取缓存
     */
    function loadCache() {
        return GM_getValue(CACHE_KEY, {});
    }

    /**
     * 保存缓存并控制大小
     */
    function saveCache(cache) {
        const entries = Object.entries(cache);
        if (entries.length > CACHE_MAX_ENTRIES) {
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            const overflow = entries.length - CACHE_MAX_ENTRIES;
            for (let i = 0; i < overflow; i++) {
                delete cache[entries[i][0]];
            }
        }
        GM_setValue(CACHE_KEY, cache);
    }

    /**
     * 获取指定豆瓣 ID 的缓存记录
     * @param {string} doubanId
     * @returns {{contentRatingZh: string|null, certifications: Array, timestamp: number}|null}
     */
    function getCachedRating(doubanId) {
        const cache = loadCache();
        const entry = cache[doubanId];
        if (!entry) return null;

        const expired = Date.now() - entry.timestamp > CACHE_TTL_MS;
        if (expired) {
            delete cache[doubanId];
            saveCache(cache);
            return null;
        }
        return entry;
    }

    /**
     * 写入缓存
     * @param {string} doubanId
     * @param {{contentRatingZh: string|null, certifications: Array}} data
     * @param {boolean} fromImdb 是否来自 IMDb 
     */
    function setCachedRating(doubanId, data, fromImdb = false) {
        if (!data) return;
        const cache = loadCache();
        cache[doubanId] = {
            contentRatingZh: data.contentRatingZh || null,
            certifications: data.certifications || [],
            fromImdb: fromImdb,
            timestamp: Date.now(),
        };
        saveCache(cache);
    }

    /**
     * 从页面解析 IMDb ID
     * @returns {string|null}
     */
    function getImdbIdFromPage() {
        const infoDiv = document.getElementById('info');
        if (!infoDiv) return null;

        const link = infoDiv.querySelector('a[href*="imdb.com/title/"]');
        if (link) {
            const match = link.href.match(/tt\d{7,8}/);
            if (match) return match[0];
        }

        const textMatch = infoDiv.textContent && infoDiv.textContent.match(/tt\d{7,8}/);
        return textMatch ? textMatch[0] : null;
    }

    // ============================================================
    // 工具函数
    // ============================================================

    /**
     * 从当前页面 URL 提取豆瓣 ID
     * @returns {string|null} 豆瓣 ID
     */
    function getDoubanIdFromUrl() {
        const match = window.location.pathname.match(/\/subject\/(\d+)/);
        return match ? match[1] : null;
    }

    /**
     * 检查分级信息是否已存在（避免重复插入）
     * @returns {boolean}
     */
    function isRatingAlreadyInserted() {
        return document.querySelector('.movieisfine-rating') !== null;
    }

    // ============================================================
    // API 请求
    // ============================================================

    /**
     * 获取电影分级信息
     * @param {string} doubanId 豆瓣 ID
     * @returns {Promise<{doubanId: string, contentRatingZh: string|null}|null>}
     */
    function fetchContentRating(doubanId) {
        const apiBaseUrl = getApiBaseUrl();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${apiBaseUrl}/api/movie/${doubanId}/content-rating`,
                headers: {
                    'Accept': 'application/json'
                },
                responseType: 'json',
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else if (response.status === 404) {
                        // 电影不存在于数据库中，静默处理
                        resolve(null);
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    /**
     * 调用 IMDb GraphQL 获取证书列表
     * @param {string} imdbId IMDb ID，如 tt0111161
     * @returns {Promise<{certifications: Array}|null>}
     */
    function fetchImdbCertificates(imdbId) {
        if (!imdbId) return Promise.resolve(null);

        const id = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
        const params = new URLSearchParams();
        params.append('operationName', 'TitleParentalGuideCertificates');
        params.append('variables', JSON.stringify({ locale: 'zh-CN', tconst: id, total: 80 }));
        params.append('extensions', JSON.stringify({
            persistedQuery: {
                sha256Hash: 'c0cf0d516020be5e214f0cd149fe256d16e5753f817bcefdb586aedef2a3c14b',
                version: 1,
            },
        }));

        const url = `https://caching.graphql.imdb.com/?${params.toString()}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                timeout: 12000,
                onload: function(response) {
                    if (response.status !== 200) {
                        resolve(null);
                        return;
                    }
                    try {
                        const data = JSON.parse(response.responseText || response.response);
                        const certifications = transformGraphQLCertificates(data);
                        resolve({ certifications });
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                },
                ontimeout: function() {
                    resolve(null);
                }
            });
        });
    }

    /**
     * 回退方案：直接请求 IMDb Parental Guide 页面获取 HTML 并解析
     * @param {string} imdbId IMDb ID
     */
    function fetchImdbParentalGuideHtml(imdbId) {
        if (!imdbId) return Promise.resolve(null);
        const id = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
        const url = `https://www.imdb.com/title/${id}/parentalguide/`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                },
                onload: function(response) {
                    if (response.status !== 200) {
                        resolve(null);
                        return;
                    }
                    try {
                        const certifications = extractCertificationsFromHtml(response.responseText);
                        resolve({ certifications });
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                },
                ontimeout: function() {
                    resolve(null);
                }
            });
        });
    }

    /**
     * 从 HTML 中提取各国分级认证
     */
    function extractCertificationsFromHtml(html) {
        const certifications = [];
        // 查找 certificates 容器
        const certSectionMatch = html.match(/data-testid="certificates-container"(.*?)(?:<\/section>|<footer)/s);
        if (!certSectionMatch) return certifications;

        const certSection = certSectionMatch[0];
        // 按 certificates-item 分割
        const countryBlocks = certSection.split(/(?=data-testid="certificates-item")/);

        for (const block of countryBlocks) {
            if (!block.includes("certificates-item")) continue;

            const countryMatch = block.match(/ipc-metadata-list-item__label[^>]*>([^<]+)/);
            const country = countryMatch ? countryMatch[1].trim() : "";
            if (!country) continue;

            const ratings = [];
            const ratingPattern = /ipc-metadata-list-item__list-content-item--link[^>]*>([^<]+)<\/a>(?:<span class="ipc-metadata-list-item__list-content-item--subText">([^<]*)<\/span>)?/gs;

            let ratingMatch;
            while ((ratingMatch = ratingPattern.exec(block)) !== null) {
                const rating = ratingMatch[1].trim();
                const note = ratingMatch[2] ? ratingMatch[2].trim() : "";
                if (rating) {
                    ratings.push({ rating, note });
                }
            }

            if (ratings.length > 0) {
                certifications.push({ country, ratings });
            }
        }
        return certifications;
    }

    /**
     * 将 GraphQL 证书结果转换为通用结构
     */
    function transformGraphQLCertificates(data) {
        const certifications = [];
        const edges = data && data.data && data.data.title && data.data.title.certificates && data.data.title.certificates.edges;
        if (!edges || !Array.isArray(edges)) {
            return certifications;
        }

        const countryMap = new Map();
        for (const edge of edges) {
            const country = edge && edge.node && edge.node.country && edge.node.country.text;
            const rating = edge && edge.node && edge.node.rating;
            if (!country || !rating) continue;

            const attributes = edge.node.attributes || [];
            const note = attributes.map(a => a && a.text ? a.text : '').filter(Boolean).join(', ');

            if (!countryMap.has(country)) countryMap.set(country, []);
            countryMap.get(country).push({ rating, note });
        }

        countryMap.forEach((ratings, country) => {
            certifications.push({ country, ratings });
        });

        return certifications;
    }

    /**
     * 从分级详情中提取优先级最高的分级
     * @param {Array} certifications 分级数据
     * @returns {string|null} 分级字符串
     */
    function extractPriorityRating(certifications) {
        if (!certifications || !Array.isArray(certifications) || certifications.length === 0) {
            return null;
        }

        const priorityCountries = ['United States', 'Canada', 'Germany', 'Taiwan', 'Hong Kong'];

        for (const country of priorityCountries) {
            const cert = certifications.find(c => c.country === country);
            if (cert && cert.ratings && cert.ratings.length > 0) {
                // 优先寻找 note 以 "certificate" 开头的项
                const certNoteRating = cert.ratings.find(r => r.note && r.note.toLowerCase().startsWith('certificate'));
                const selectedRating = certNoteRating || cert.ratings[0];
                return selectedRating.rating;
            }
        }

        return null;
    }

    // ============================================================
    // DOM 操作
    // ============================================================

    /**
     * 将 IMDb ID 文本转换为可点击链接
     */
    function linkifyImdb() {
        const infoDiv = document.getElementById('info');
        if (!infoDiv) return;

        const allSpans = infoDiv.querySelectorAll('span.pl');
        for (const span of allSpans) {
            const text = span.textContent.trim();
            if (text === 'IMDb:' || text === 'IMDb链接:') {
                let nextNode = span.nextSibling;

                // 跳过可能的空白文本节点
                while (nextNode && nextNode.nodeType === 3 && !nextNode.textContent.trim()) {
                    nextNode = nextNode.nextSibling;
                }

                // 如果已经是链接，则跳过
                if (nextNode && (nextNode.nodeName === 'A' || (nextNode.querySelector && nextNode.querySelector('a')))) {
                    return;
                }

                if (nextNode && nextNode.nodeType === 3) {
                    const content = nextNode.textContent;
                    const idMatch = content.match(/tt\d+/);
                    if (idMatch) {
                        const imdbId = idMatch[0];
                        const link = document.createElement('a');
                        link.href = `https://www.imdb.com/title/${imdbId}/`;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer nofollow';
                        link.textContent = imdbId;
                        link.style.cssText = 'color: #37a; text-decoration: none; background: transparent;';

                        // 模仿豆瓣链接的悬停效果
                        link.addEventListener('mouseenter', function() {
                            this.style.background = '#37a';
                            this.style.color = '#fff';
                        });
                        link.addEventListener('mouseleave', function() {
                            this.style.background = 'transparent';
                            this.style.color = '#37a';
                        });

                        // 替换文本节点中的 ID 部分，保留周围的空白字符
                        const parts = content.split(imdbId);
                        const fragment = document.createDocumentFragment();
                        if (parts[0]) fragment.appendChild(document.createTextNode(parts[0]));
                        fragment.appendChild(link);
                        if (parts[1]) fragment.appendChild(document.createTextNode(parts[1]));

                        nextNode.parentNode.replaceChild(fragment, nextNode);
                    }
                }
                break;
            }
        }
    }

    /**
     * 在电影信息区域插入分级信息
     * 样式与豆瓣电影页面的"电影信息"保持一致
     * @param {string} contentRatingZh 分级信息（中文）
     * @param {string} doubanId 豆瓣 ID（用于构建详情页链接）
     * @param {string} imdbId IMDb ID（回退方案使用）
     */
    function insertContentRating(contentRatingZh, doubanId, imdbId = null) {
        if (!contentRatingZh) {
            return;
        }

        // 避免重复插入
        if (isRatingAlreadyInserted()) {
            return;
        }

        const infoDiv = document.getElementById('info');
        if (!infoDiv) {
            return;
        }

        // 创建分级信息行
        // 豆瓣电影信息区域的标签使用 span.pl 类
        const ratingLabel = document.createElement('span');
        ratingLabel.className = 'pl movieisfine-rating';
        ratingLabel.textContent = '分级: ';

        // 分级内容：创建可点击链接跳转到详情页
        let ratingValue;
        if (doubanId || imdbId) {
            const apiBaseUrl = getApiBaseUrl();
            const detailUrl = doubanId
                ? `${apiBaseUrl}/movie/${doubanId}`
                : `https://www.imdb.com/title/${imdbId}/parentalguide`;

            ratingValue = document.createElement('a');
            ratingValue.href = detailUrl;
            ratingValue.target = '_blank';
            ratingValue.rel = 'noopener noreferrer';
            ratingValue.textContent = ' ' + contentRatingZh;
            ratingValue.title = doubanId ? '点击查看详细分级信息' : '在 IMDb 查看分级详情';
            ratingValue.style.cssText = 'color: #37a; text-decoration: none; background: transparent;';
            ratingValue.addEventListener('mouseenter', function() {
                this.style.background = '#37a';
                this.style.color = '#fff';
            });
            ratingValue.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
                this.style.color = '#37a';
            });
        } else {
            ratingValue = document.createTextNode(' ' + contentRatingZh);
        }

        // 换行符
        const br = document.createElement('br');

        // 查找插入位置
        // 优先在 "IMDb" 行之后插入，如果没有则在 info 区域最后插入
        const insertPosition = findInsertPosition(infoDiv);

        if (insertPosition) {
            // 在指定位置之前插入
            infoDiv.insertBefore(ratingLabel, insertPosition);
            infoDiv.insertBefore(ratingValue, insertPosition);
            infoDiv.insertBefore(br, insertPosition);
        } else {
            // 在 info 区域最后插入
            infoDiv.appendChild(ratingLabel);
            infoDiv.appendChild(ratingValue);
            infoDiv.appendChild(br);
        }
    }

    /**
     * 查找合适的插入位置
     * @param {HTMLElement} infoDiv
     * @returns {Node|null} 插入位置节点，null 表示追加到末尾
     */
    function findInsertPosition(infoDiv) {
        const allSpans = infoDiv.querySelectorAll('span.pl');

        for (const span of allSpans) {
            const text = span.textContent.trim();
            // 查找 IMDb 行
            if (text === 'IMDb:' || text === 'IMDb链接:') {
                // 找到 IMDb 行后的换行符
                let nextElement = span.nextSibling;
                while (nextElement && nextElement.nodeName !== 'BR') {
                    nextElement = nextElement.nextSibling;
                }
                // 返回换行符之后的元素作为插入点
                if (nextElement && nextElement.nextSibling) {
                    return nextElement.nextSibling;
                }
                break;
            }
        }

        return null;
    }

    // ============================================================
    // 主逻辑
    // ============================================================

    /**
     * 主函数
     */
    async function main() {
        // 1) 链接化 IMDb ID
        linkifyImdb();

        // 提取豆瓣 ID
        const doubanId = getDoubanIdFromUrl();
        if (!doubanId) {
            return;
        }

        const imdbId = getImdbIdFromPage();
        if (!imdbId) {
            return;
        }

        // 避免重复执行
        if (isRatingAlreadyInserted()) {
            return;
        }

        // 1) 尝试本地缓存
        const cached = getCachedRating(doubanId);
        if (cached) {
            const cachedDisplay = extractPriorityRating(cached.certifications) || cached.contentRatingZh;
            if (cachedDisplay) {
                if(cached.fromImdb) {
                    insertContentRating(cachedDisplay, null, imdbId);
                } else {
                    insertContentRating(cachedDisplay, doubanId, null);
                }
                return;
            }
        }

        // 2) 访问数据库接口
        try {
            const data = await fetchContentRating(doubanId);
            if (data) {
                const priorityRating = extractPriorityRating(data.certifications);
                const displayRating = priorityRating || data.contentRatingZh;

                if (displayRating) {
                    setCachedRating(doubanId, {
                        contentRatingZh: displayRating,
                        certifications: data.certifications || [],
                    }, false);
                    insertContentRating(displayRating, data.doubanId);
                    return;
                }
            }
        } catch (error) {
        }

        // 3) 回退：直接调用 IMDb GraphQL

        let imdbData = await fetchImdbCertificates(imdbId);

        // 4) 二次回退：如果 GraphQL 失败，尝试抓取网页 HTML
        if (!imdbData || !imdbData.certifications || imdbData.certifications.length === 0) {
            imdbData = await fetchImdbParentalGuideHtml(imdbId);
        }

        if (imdbData && imdbData.certifications && imdbData.certifications.length > 0) {
            const imdbDisplay = extractPriorityRating(imdbData.certifications);
            if (imdbDisplay) {
                setCachedRating(doubanId, {
                    contentRatingZh: imdbDisplay,
                    certifications: imdbData.certifications,
                }, true);
                insertContentRating(imdbDisplay, null, imdbId);
            }
        }
    }

    // 执行主函数
    main();
})();
