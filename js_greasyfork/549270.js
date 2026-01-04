// ==UserScript==
// @name         Pter Galgame Helper
// @name:zh-CN   Pter Galgame 助手
// @namespace    http://tampermonkey.net/
// @version      5.1 (External Links Integration)
// @description  Fetches game data from VNDB or Ymgal API and fills the upload form on PterClub. Now supports Steam and DLsite data integration with priority controls.
// @description:zh-CN 通过 VNDB 或月幕 API 获取游戏信息，并自动填充 PterClub 的游戏上传页面。支持混合模式。新增Steam和DLsite数据集成，支持优先级控制。
// @author       Luofengyuan (AI Refactored & Enhanced)
// @match        https://pterclub.com/uploadgameinfo.php*
// @connect      api.vndb.org
// @connect      www.ymgal.games
// @connect      store.steampowered.com
// @connect      dlsite.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/549270/Pter%20Galgame%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/549270/Pter%20Galgame%20Helper.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- 全局常量 ---
    const VNDB_API_ENDPOINT = 'https://api.vndb.org/kana';
    const YM_API_ENDPOINT = 'https://www.ymgal.games';
    const YM_CLIENT_ID = 'ymgal';
    const YM_CLIENT_SECRET = 'luna0327';

    // --- 优先级开关配置 ---
    const STEAM_PRIORITY = true;    // 是否优先使用Steam数据覆盖VNDB数据
    const DLSITE_PRIORITY = true;   // 是否优先使用Dlsite数据覆盖VNDB数据

    // --- 全局状态与凭证 ---
    let scriptState = {
        source: 'hybrid', // 数据源模式: 'hybrid', 'vndb', 'ymgal'
        hybridSelection: { vndbGame: null, vndbRelease: null, ymgalGame: null }, // 混合模式下的选择状态
        vndbGameDetails: null, // 存储VNDB游戏详情
        vndbReleases: [],      // 存储VNDB发行版本列表
        ymgalGameDetails: null, // 存储月幕游戏详情
    };
    // 月幕 API 的访问令牌
    let ymgalAccessToken = await GM.getValue("ymgal_access_token", null);
    let ymgalTokenExpiresAt = await GM.getValue("ymgal_token_expires_at", 0);

    // --- 样式注入 ---
    GM_addStyle(`
        .pter-helper-container { display: flex; flex-direction: column; gap: 10px; margin-top: 5px; }
        .pter-source-selector { display: flex; gap: 15px; margin-bottom: 5px; }
        .pter-source-selector label { cursor: pointer; }
        .pter-search-bar { display: flex; width: 650px; }
        .pter-search-bar input[type="text"] { flex-grow: 1; margin-right: 5px; }
        .pter-results-panel { width: 650px; margin-top: 10px; }
        .pter-hybrid-container { display: flex; gap: 10px; }
        .pter-hybrid-panel { flex: 1; }
        .pter-step-title { font-weight: bold; margin-bottom: 5px; padding: 4px; background-color: #f5f5f5; border: 1px solid #ccc; border-bottom: none; }
        .pter-results-list { max-height: 220px; overflow-y: auto; border: 1px solid #ccc; background-color: #fff; }
        .pter-list-item { padding: 6px 10px; cursor: pointer; border-bottom: 1px solid #eee; }
        .pter-list-item:last-child { border-bottom: none; }
        .pter-list-item:hover { background-color: #e0e8f0; }
        .pter-list-item small { color: #555; display: block; margin-top: 2px; font-size: 11px; }
        .pter-loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 24px; height: 24px; animation: pter-spin 1s linear infinite; margin: 20px auto; }
        @keyframes pter-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .pter-status-message { padding: 10px; text-align: center; color: #333; }
        .pter-error-message { padding: 10px; text-align: center; color: #c00; }
        .pter-success-message { padding: 10px; text-align: center; color: green; font-weight: bold; }
        #hybrid-status-panel { padding: 8px; border: 1px dashed #3498db; margin-top: 10px; background-color: #f0f8ff; font-size: 12px; }
        #hybrid-status-panel .status-item { margin-bottom: 4px; }
        #hybrid-status-panel .status-ok { color: green; font-weight: bold; }
        #hybrid-status-panel .status-pending { color: #c00; }
    `);

    // --- API 请求层 ---
    function apiRequest(config) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...config,
                onload: res => {
                    if (res.status >= 200 && res.status < 400) {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(new Error('JSON解析失败'));
                        }
                    } else {
                        reject(new Error(`API错误: ${res.status} ${res.statusText}`));
                    }
                },
                onerror: err => reject(new Error('网络请求错误')),
            });
        });
    }

    // --- VNDB API 封装 ---
    async function searchVndbByName(name) {
        const payload = { filters: ["search", "=", name], fields: "id, title", sort: "searchrank" };
        const data = await apiRequest({ method: 'POST', url: `${VNDB_API_ENDPOINT}/vn`, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(payload) });
        return data.results || [];
    }
    async function getVndbDetails(vnId) {
        const payload = { filters: ["id", "=", vnId], fields: "title,alttitle,description,image.url,screenshots.url,screenshots.sexual,developers.name,extlinks{url,name,id}" };
        const data = await apiRequest({ method: 'POST', url: `${VNDB_API_ENDPOINT}/vn`, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(payload) });
        return data.results?.[0] || null;
    }
    async function getVndbReleasesForVn(vnId) {
        const payload = { filters: ["vn", "=", ["id", "=", vnId]], fields: "id,title,released,platforms,resolution,voiced,engine,producers.name,producers.publisher,languages.lang,extlinks{url,name,id}", sort: "released", results: 100 };
        const data = await apiRequest({ method: 'POST', url: `${VNDB_API_ENDPOINT}/release`, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(payload) });
        return data.results || [];
    }

    // --- 月幕(Ymgal) API 封装 ---
    async function getYmgalAccessToken() {
        if (ymgalAccessToken && Date.now() < ymgalTokenExpiresAt) {
            return ymgalAccessToken;
        }
        const params = new URLSearchParams({ grant_type: 'client_credentials', client_id: YM_CLIENT_ID, client_secret: YM_CLIENT_SECRET, scope: 'public' });
        const data = await apiRequest({ method: 'GET', url: `${YM_API_ENDPOINT}/oauth/token?${params.toString()}` });
        if (data.access_token) {
            ymgalAccessToken = data.access_token;
            // 提前5分钟刷新
            ymgalTokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
            await GM.setValue("ymgal_access_token", ymgalAccessToken);
            await GM.setValue("ymgal_token_expires_at", ymgalTokenExpiresAt);
            return ymgalAccessToken;
        }
        throw new Error('月幕认证失败: ' + (data.error_description || '未知错误'));
    }

    async function ymgalApiRequest(path, paramsObj) {
        const token = await getYmgalAccessToken();
        const url = new URL(`${YM_API_ENDPOINT}${path}`);
        if (paramsObj) {
            url.search = new URLSearchParams(paramsObj).toString();
        }
        const data = await apiRequest({ method: 'GET', url: url.href, headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json;charset=utf-8', 'version': '1' } });
        if (data.success) {
            return data.data;
        }
        throw new Error(data.msg || `月幕API错误码: ${data.code}`);
    }

    async function searchYmgalByName(name) {
        const data = await ymgalApiRequest('/open/archive/search-game', { mode: 'list', keyword: name, pageNum: 1, pageSize: 20 });
        return data.result || [];
    }
    async function getYmgalGameDetails(gid) {
        return await ymgalApiRequest('/open/archive', { gid });
    }
    async function getYmgalOrgDetails(orgId) {
        const data = await ymgalApiRequest('/open/archive', { orgId });
        return data.org || null;
    }

    // --- 外部链接检测和数据获取 ---
    function findExternalLinks(vnDetails, releases) {
        const links = { steam: [], dlsite: [] };

        // 检查VN级别的外部链接
        if (vnDetails.extlinks) {
            vnDetails.extlinks.forEach(link => {
                if (link.name === 'steam') {
                    links.steam.push({ url: link.url, id: link.id });
                } else if (link.name === 'dlsite' || link.url.includes('dlsite.com')) {
                    links.dlsite.push({ url: link.url, id: link.id });
                }
            });
        }

        // 检查Release级别的外部链接
        releases.forEach(release => {
            if (release.extlinks) {
                release.extlinks.forEach(link => {
                    if (link.name === 'steam') {
                        links.steam.push({ url: link.url, id: link.id, releaseId: release.id });
                    } else if (link.name === 'dlsite' || link.url.includes('dlsite.com')) {
                        links.dlsite.push({ url: link.url, id: link.id, releaseId: release.id });
                    }
                });
            }
        });

        return links;
    }

    async function fetchSteamData(steamId) {
        try {
            const url = `https://store.steampowered.com/api/appdetails?l=schinese&appids=${steamId}`;
            // 直接调用2.js的steam_form逻辑，但返回数据而不是填充表单
            window.steamid = steamId; // 设置全局steamid变量供2.js使用

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "json",
                    onload: async function(response) {
                        try {
                            if (response.response[steamId] && response.response[steamId].success) {
                                // 使用2.js的逻辑处理Steam数据，但返回数据对象而不是填充表单
                                resolve({
                                    source: 'steam',
                                    usesSteamForm: true,
                                    steamId: steamId,
                                    steamResponse: response
                                });
                            } else {
                                resolve(null);
                            }
                        } catch (e) {
                            console.error('Steam数据处理失败:', e);
                            resolve(null);
                        }
                    },
                    onerror: function(error) {
                        console.error('Steam数据获取失败:', error);
                        resolve(null);
                    }
                });
            });
        } catch (e) {
            console.error('Steam数据获取失败:', e);
        }
        return null;
    }

    async function fetchDlsiteData(dlsiteUrl) {
        try {
            // 从URL中提取DLsite作品ID
            const workIdMatch = dlsiteUrl.match(/\/work\/=\/product_id\/(\w+)/);
            if (!workIdMatch) return null;

            const workId = workIdMatch[1];

            // 直接请求DLsite页面
            const response = await apiRequest({
                method: 'GET',
                url: dlsiteUrl,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            // 解析HTML内容（这里需要根据实际的DLsite页面结构调整）
            const html = response.responseText || response;

            // 提取基本信息
            const titleMatch = html.match(/<h1[^>]*id="work_name"[^>]*>([^<]+)</);
            const title = titleMatch ? titleMatch[1].trim() : '';

            // 提取系统要求（基于提供的HTML结构）
            const sysReqMatch = html.match(/<div class="work_article work_spec">([\s\S]*?)<\/div>/);
            let systemRequirements = '暂无详细配置信息';
            if (sysReqMatch) {
                const specContent = sysReqMatch[1];
                // 解析dl/dt结构并格式化
                const dlPattern = /<dl[^>]*>([\s\S]*?)<\/dl>/g;
                const dtPattern = /<dt[^>]*>([^<]+)<\/dt>/g;
                const ddPattern = /<dd[^>]*>([^<]+)<\/dd>/g;

                let formattedSpecs = [];

                // 提取所有dt和dd对
                const dtMatches = Array.from(specContent.matchAll(dtPattern));
                const ddMatches = Array.from(specContent.matchAll(ddPattern));

                for (let i = 0; i < Math.min(dtMatches.length, ddMatches.length); i++) {
                    const label = dtMatches[i][1].trim();
                    const value = ddMatches[i][1].trim();
                    if (label && value) {
                        formattedSpecs.push(`${label}：${value}`);
                    }
                }

                if (formattedSpecs.length > 0) {
                    systemRequirements = formattedSpecs.join('\n');
                } else {
                    // 备用解析方法：简单去除HTML标签并添加换行
                    systemRequirements = specContent
                        .replace(/<dt[^>]*>/g, '\n')
                        .replace(/<\/dt>/g, '：')
                        .replace(/<dd[^>]*>/g, '')
                        .replace(/<\/dd>/g, '')
                        .replace(/<[^>]*>/g, '')
                        .replace(/\s+/g, ' ')
                        .split(/\n+/)
                        .filter(line => line.trim())
                        .join('\n')
                        .trim();
                }
            }

            // 提取封面图片
            const coverMatch = html.match(/<img[^>]*class="[^"]*main_work_img[^"]*"[^>]*src="([^"]+)"/);
            const coverImage = coverMatch ? coverMatch[1] : '';

            return {
                source: 'dlsite',
                japaneseTitle: title,
                systemRequirements: systemRequirements,
                coverImage: coverImage,
                screenshots: [], // DLsite截图需要额外处理
                workId: workId
            };
        } catch (e) {
            console.error('DLsite数据获取失败:', e);
        }
        return null;
    }

    // --- 数据适配层 (将不同来源的数据统一为同一格式) ---
    async function adaptVndbData(vnDetails, releaseDetails, statusCallback) {
        // 检查外部链接
        const externalLinks = findExternalLinks(vnDetails, scriptState.vndbReleases);
        let steamData = null;
        let dlsiteData = null;

        // 根据优先级开关获取外部数据
        if (STEAM_PRIORITY && externalLinks.steam.length > 0) {
            if (statusCallback) statusCallback('正在获取Steam数据...');
            const steamId = externalLinks.steam[0].id;
            steamData = await fetchSteamData(steamId);

            // 如果检测到Steam数据且要使用2.js的方法，直接返回特殊标识
            if (steamData && steamData.usesSteamForm) {
                return {
                    source: 'steam-2js',
                    useSteamForm: true,
                    steamId: steamId,
                    steamResponse: steamData.steamResponse,
                    vndbData: { vnDetails, releaseDetails } // 保留VNDB数据作为备用
                };
            }
        }

        if (DLSITE_PRIORITY && externalLinks.dlsite.length > 0) {
            if (statusCallback) statusCallback('正在获取DLsite数据...');
            dlsiteData = await fetchDlsiteData(externalLinks.dlsite[0].url);
        }

        const coverImage = vnDetails.image?.url || '';

        // 筛选截图：优先选择安全(sexual=0)的图片，最多5张。如果不足3张，用暗示性(sexual=1)的图片补充。
        let screenshots = [];
        if (vnDetails.screenshots) {
            const safe = vnDetails.screenshots.filter(s => s.sexual === 0).map(s => s.url);
            const suggestive = vnDetails.screenshots.filter(s => s.sexual === 1).map(s => s.url);
            screenshots = safe.slice(0, 5);
            if (screenshots.length < 3) {
                screenshots.push(...suggestive.slice(0, 3 - screenshots.length));
            }
        }

        const voicedMap = { 1: '无语音', 2: '仅H场景', 3: '部分语音', 4: '全语音' };
        let requirements = [];
        if (releaseDetails.platforms?.length) requirements.push(`平台：${releaseDetails.platforms.join(', ')}`);
        if (releaseDetails.engine) requirements.push(`引擎：${releaseDetails.engine}`);
        if (Array.isArray(releaseDetails.resolution)) requirements.push(`分辨率：${releaseDetails.resolution.join('x')}`);
        if (releaseDetails.voiced) requirements.push(`语音：${voicedMap[releaseDetails.voiced] || '未知'}`);

        // 查找同一平台的最早发行版本，以确定年份
        const platformReleases = scriptState.vndbReleases
            .filter(r => r.platforms?.includes(releaseDetails.platforms?.[0]) && r.released)
            .sort((a, b) => new Date(a.released) - new Date(b.released));

        // 构建基础数据
        let unifiedData = {
            source: 'vndb',
            englishTitle: vnDetails.title || '',
            japaneseTitle: vnDetails.alttitle || '',
            developer: vnDetails.developers?.map(d => d.name).join(', ') || 'N/A',
            publisher: releaseDetails.producers?.filter(p => p.publisher).map(p => p.name).join(', ') || 'N/A',
            firstReleaseDate: releaseDetails.released || '',
            systemRequirements: requirements.length ? requirements.join('\n') : '暂无详细配置信息',
            introduction: vnDetails.description?.replace(/\[url=.*?\](.*?)\[\/url\]/g, '$1') || '', // 移除BBCode链接
            coverImage: coverImage,
            screenshots: screenshots,
            primaryPlatform: releaseDetails.platforms?.[0] || null,
            platformReleases: platformReleases,
            externalSources: []
        };

        // 根据优先级合并DLsite数据
        if (dlsiteData && DLSITE_PRIORITY) {
            unifiedData.source = 'vndb+dlsite';
            unifiedData.systemRequirements = dlsiteData.systemRequirements || unifiedData.systemRequirements;
            if (dlsiteData.coverImage) unifiedData.coverImage = dlsiteData.coverImage;
            if (dlsiteData.japaneseTitle) unifiedData.japaneseTitle = dlsiteData.japaneseTitle;
            unifiedData.externalSources.push('DLsite');
        }

        return unifiedData;
    }

    async function adaptYmgalData(ymgalDetails, selectedRelease) {
        let developerName = 'N/A';
        if (ymgalDetails.game.developerId) {
            try {
                const org = await getYmgalOrgDetails(ymgalDetails.game.developerId);
                if (org) developerName = org.chineseName || org.name;
            } catch (e) {
                console.error("获取月幕开发者信息失败:", e);
            }
        }

        const platform = selectedRelease.platform || 'N/A';
        const platformReleases = ymgalDetails.game.releases
            .filter(r => r.platform === platform && r.release_date)
            .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

        return {
            source: 'ymgal',
            englishTitle: ymgalDetails.game.chineseName || ymgalDetails.game.name,
            japaneseTitle: ymgalDetails.game.name || '',
            developer: developerName,
            publisher: 'N/A', // 月幕API不直接提供发行商信息
            firstReleaseDate: selectedRelease.release_date || '',
            systemRequirements: `平台：${platform}`,
            introduction: ymgalDetails.game.introduction || '',
            coverImage: ymgalDetails.game.mainImg || '',
            screenshots: [], // 月幕API不提供截图
            primaryPlatform: platform,
            platformReleases: platformReleases,
        };
    }

    // --- 表单填充辅助函数 ---
    const setFieldValue = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.value = value;
        else console.warn('Pter 助手: 表单元素未找到:', selector);
    };
    const setCheckboxState = (selector, checked) => {
        const el = document.querySelector(selector);
        if (el) el.checked = checked;
        else console.warn('Pter 助手: 表单元素未找到:', selector);
    };
    const setSelectOption = (selector, targetText) => {
        const selectEl = document.querySelector(selector);
        if (!selectEl) {
            console.warn('Pter 助手: 表单元素未找到:', selector);
            return;
        }
        const option = Array.from(selectEl.options).find(opt => opt.textContent.trim() === targetText);
        if (option) option.selected = true;
    };

    // 从2.js移植的辅助函数
    function html2bb(str) {
        if (!str) return "";
        str = str.replace(/< *br *\/*>/g, "\n\n");
        str = str.replace(/< *b *>/g, "[b]");
        str = str.replace(/< *\/ *b *>/g, "[/b]");
        str = str.replace(/< *u *>/g, "[u]");
        str = str.replace(/< *\/ *u *>/g, "[/u]");
        str = str.replace(/< *i *>/g, "[i]");
        str = str.replace(/< *\/ *i *>/g, "[/i]");
        str = str.replace(/< *strong *>/g, "[b]");
        str = str.replace(/< *\/ *strong *>/g, "[/b]");
        str = str.replace(/< *em *>/g, "[i]");
        str = str.replace(/< *\/ *em *>/g, "[/i]");
        str = str.replace(/< *li *>/g, "[*]");
        str = str.replace(/< *\/ *li *>/g, "");
        str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
        str = str.replace(/< *\/ *ul *>/g, "");
        str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[center][u][b]");
        str = str.replace(/< *h[1234] *>/g, "\n[center][u][b]");
        str = str.replace(/< *\/ *h[1234] *>/g, "[/b][/u][/center]\n");
        str = str.replace(/\&quot;/g, "\"");
        str = str.replace(/\&amp;/g, "&");
        str = str.replace(/< *img *src="([^"]*)".*>/g, "\n");
        str = str.replace(/< *img.*src="([^"]*)".*>/g, "\n");
        str = str.replace(/< *a [^>]*>/g, "");
        str = str.replace(/< *\/ *a *>/g, "");
        str = str.replace(/< *p *>/g, "\n\n");
        str = str.replace(/< *\/ *p *>/g, "");
        str = str.replace(/  +/g, " ");
        str = str.replace(/\n +/g, "\n");
        str = str.replace(/\n\n\n+/gm, "\n\n");
        str = str.replace(/\[\/b\]\[\/u\]\[\/align\]\n\n/g, "[/b][/u][/align]\n");
        str = str.replace(/\n\n\[\*\]/g, "\n[*]");
        str = str.replace(/< *video.*>\n.*?< *\/ *video *>/g,'');
        str = str.replace(/<hr>/g,'\n\n');
        return str;
    }

    function pretty_sr(str) {
        return str.replace(/\n+/g, "\n").trim();
    }

    // --- 核心填充逻辑 ---
    async function populateForm(data, panel) {
        const statusContainer = panel || document.querySelector('.pter-results-panel');

        // 如果是Steam数据，使用2.js的逻辑
        if (data.useSteamForm) {
            render(statusContainer, `<div class="pter-status-message">使用Steam数据填充表单...</div>`);
            try {
                await fillSteamForm(data.steamResponse, data.steamId);
                render(statusContainer, `<div class="pter-success-message">✅ 填充成功！数据来源: STEAM<br>请仔细检查并手动调整。</div>`);
                return;
            } catch (e) {
                console.error('Steam填充失败，回退到VNDB数据:', e);
                // 回退到VNDB数据
                data = await adaptVndbData(data.vndbData.vnDetails, data.vndbData.releaseDetails);
            }
        }

        render(statusContainer, `<div class="pter-status-message">正在生成介绍内容...</div>`);

        // 直接使用原始链接，不再转存
        const finalCoverUrl = data.coverImage;
        const finalScreenshotUrls = data.screenshots;

        setFieldValue('input[name="small_descr"]', data.japaneseTitle);
        setFieldValue('input[name="name"]', data.englishTitle);

        let bbCode = `[center]${finalCoverUrl ? `[img]${finalCoverUrl}[/img]` : ''}[/center]\n\n`;
        bbCode += `[center][b]基本信息[/b]\n`;
        bbCode += `日文名称：${data.japaneseTitle}\n`;
        bbCode += `中文名称：${data.englishTitle}\n`;
        bbCode += `开发商：${data.developer}\n`;
        bbCode += `发行商：${data.publisher}\n`;
        bbCode += `首发日期：${data.firstReleaseDate}[/center]\n\n`;
        bbCode += `[center][b]配置要求[/b]\n${data.systemRequirements}[/center]\n\n`;
        bbCode += `[center][b]游戏简介[/b][/center]\n${data.introduction}\n\n`;

        if (finalScreenshotUrls.length > 0) {
            bbCode += `[center][b]游戏截图[/b][/center]\n`;
            bbCode += finalScreenshotUrls.map(url => `[center][img]${url}[/img][/center]\n`).join('');
        }
        setFieldValue('textarea[name="descr"]', bbCode);

        // 平台映射
        const platformMap = { 'win': 'Windows', 'lin': 'Linux', 'mac': 'MAC', 'and': 'Android', 'ios': 'iOS', 'ps1': 'PS/PSone', 'ps2': 'PS2', 'ps3': 'PS3', 'ps4': 'PS4', 'ps5': 'PS5', 'psp': 'PSP', 'psv': 'PS Vita', 'sfc': 'SFC/SNES', 'n64': 'N64', 'nds': 'DS', '3ds': '3DS', 'swi': 'Switch', 'wii': 'Wii/WiiU', 'dos': 'DOS', 'xbo': 'Xbox', 'xb3': 'Xbox 360', 'Windows': 'Windows', 'PC': 'Windows', 'Linux': 'Linux', 'macOS': 'MAC' };
        const targetText = platformMap[data.primaryPlatform] || data.primaryPlatform;
        if (targetText) {
            setSelectOption('select[name="console"]', targetText);
        }

        // 填充年份
        if (data.platformReleases && data.platformReleases.length > 0) {
            const releaseDate = data.source === 'vndb' ? data.platformReleases[0].released : data.platformReleases[0].release_date;
            setFieldValue('input[name="year"]', new Date(releaseDate).getFullYear());
        } else if (data.firstReleaseDate) {
            setFieldValue('input[name="year"]', new Date(data.firstReleaseDate).getFullYear());
        } else {
            setFieldValue('input[name="year"]', '');
        }

        setCheckboxState('input[name="uplver"]', true); // 勾选"匿名发布"
        setFieldValue('input[name="releasedate"]', data.firstReleaseDate);

        // 显示数据来源信息
        let sourceInfo = `数据来源: ${data.source.toUpperCase()}`;
        if (data.externalSources && data.externalSources.length > 0) {
            sourceInfo += ` (增强: ${data.externalSources.join(', ')})`;
        }

        render(statusContainer, `<div class="pter-success-message">✅ 填充成功！${sourceInfo}<br>请仔细检查并手动调整。</div>`);
    }

    // 使用2.js的Steam填充逻辑
    async function fillSteamForm(response, steamid) {
        const gameInfo = response.response[steamid].data;
        const about = gameInfo.about_the_game;
        const date = gameInfo.release_date.date.split(", ").pop();
        const year = date.split("年").shift().trim();
        const store = 'https://store.steampowered.com/app/' + steamid;
        let genres = [];
        if (gameInfo.hasOwnProperty('genres')) {
            gameInfo.genres.forEach(function (genre) {
                const tag = genre.description.toLowerCase().replace(/ /g, ".");
                genres.push(tag);
            });
        }
        genres = genres.join(",");

        const aboutContent = about || gameInfo.detailed_description;
        const aboutSection = "[center][b][u]关于游戏[/u][/b][/center]\n" +
                            `[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${store}\n\n[b]游戏标签[/b]：${genres}\n\n` +
                            html2bb(aboutContent).trim();

        // 处理系统要求
        let recfield = gameInfo.pc_requirements;
        if (typeof(recfield.recommended) === "undefined") {
            recfield.recommended = '\n无推荐配置要求';
        }
        if (typeof(recfield.minimum) === "undefined") {
            recfield.minimum = '\n无配置要求';
            recfield.recommended = '';
        }

        const sr = "\n\n[center][b][u]配置要求[/u][/b][/center]\n\n" +
                   pretty_sr(html2bb("[quote]\n" + recfield.minimum + "\n" + recfield.recommended + "[/quote]\n"));

        // 预告片
        let tr = '';
        try {
            const trailer = gameInfo.movies[0].webm.max.split("?")[0].replace("http","https");
            tr = "\n\n[center][b][u]预告欣赏[/u][/b][/center]\n" + `[center][video]${trailer}[/video][/center]`;
        } catch (e) {
            tr = '';
        }

        // 填充表单
        setFieldValue('input[name="name"]', gameInfo.name);
        setFieldValue('input[name="year"]', year);

        const coverImage = gameInfo.header_image.split("?")[0];
        const screenshots = gameInfo.screenshots.map(s => s.path_full.split("?")[0]);

        let screensBB = '';
        if (screenshots.length > 0) {
            screensBB = "[center][b][u]游戏截图[/u][/b][/center]\n[center]" +
                       screenshots.map(url => `[img]${url}[/img]`).join('\n') +
                       "[/center]";
        }

        const cover = `[center][img]${coverImage}[/img][/center]`;
        const fullContent = cover + aboutSection + sr + tr + (screensBB ? '\n\n' + screensBB : '');

        setFieldValue('textarea[name="descr"]', fullContent);
        setCheckboxState('input[name="uplver"]', true);
    }

    // --- UI 渲染和事件处理 ---
    function render(container, content) {
        if (typeof content === 'string') {
            container.innerHTML = content;
        } else {
            container.innerHTML = '';
            container.appendChild(content);
        }
    }
    const createLoader = () => '<div class="pter-loader"></div>';

    // 单一数据源模式：选择游戏后的处理
    async function handleSingleSourceGameSelect(gameId, panel, source) {
        render(panel, createLoader());
        try {
            if (source === 'vndb') {
                const [vnDetails, releases] = await Promise.all([getVndbDetails(gameId), getVndbReleasesForVn(gameId)]);
                if (!vnDetails) throw new Error('无法获取VNDB游戏详情');
                scriptState.vndbGameDetails = vnDetails;
                scriptState.vndbReleases = releases;
                displayReleaseSelection(releases, panel, 'vndb');
            } else { // 'ymgal'
                const details = await getYmgalGameDetails(gameId);
                if (!details?.game) throw new Error('无法获取月幕游戏详情');
                scriptState.ymgalGameDetails = details;
                displayReleaseSelection(details.game.releases, panel, 'ymgal');
            }
        } catch (e) {
            render(panel, `<div class="pter-error-message">错误: ${e.message}</div>`);
        }
    }

    // 显示发行版本选择列表
    function displayReleaseSelection(releases, panel, source) {
        if (!releases?.length) {
            render(panel, '<div class="pter-status-message">此游戏没有找到任何发行版本。</div>');
            return;
        }
        const sortedReleases = [...releases].sort((a, b) => new Date(b.released || b.release_date) - new Date(a.released || a.release_date));

        const list = document.createElement('div');
        list.className = 'pter-results-list';
        sortedReleases.forEach(release => {
            const item = document.createElement('div');
            item.className = 'pter-list-item';
            let title, subtitle;
            if (source === 'vndb') {
                title = release.title;
                subtitle = `${release.released || 'N/A'} | ${release.platforms?.join(', ') || 'N/A'} | ${release.languages?.map(l => l.lang).join(', ') || 'N/A'}`;
            } else { // 'ymgal'
                title = release.releaseName;
                subtitle = `${release.release_date || 'N/A'} | ${release.platform || 'N/A'} | ${release.releaseLanguage || 'N/A'}`;
            }
            item.innerHTML = `${title} <small>${subtitle}</small>`;
            item.onclick = () => handleReleaseSelection(release.id, panel, source);
            list.appendChild(item);
        });

        const container = document.createElement('div');
        const titleEl = document.createElement('div');
        titleEl.className = 'pter-step-title';
        titleEl.textContent = '步骤 2: 选择一个发行版本';
        container.append(titleEl, list);
        render(panel, container);
    }

    // 选择发行版本后的最终处理
    async function handleReleaseSelection(releaseId, panel, source) {
        render(panel, createLoader());
        try {
            let unifiedData;
            if (source === 'vndb') {
                const selectedRelease = scriptState.vndbReleases.find(r => r.id === releaseId);
                if (!selectedRelease) throw new Error('未找到所选的版本信息');
                const statusCallback = (msg) => render(panel, `<div class="pter-status-message">${msg}</div>`);
                unifiedData = await adaptVndbData(scriptState.vndbGameDetails, selectedRelease, statusCallback);
            } else { // 'ymgal'
                const selectedRelease = scriptState.ymgalGameDetails.game.releases.find(r => r.id === releaseId);
                if (!selectedRelease) throw new Error('未找到所选的版本信息');
                unifiedData = await adaptYmgalData(scriptState.ymgalGameDetails, selectedRelease);
            }
            await populateForm(unifiedData, panel);
        } catch (e) {
            render(panel, `<div class="pter-error-message">处理失败: ${e.message}</div>`);
        }
    }

    // --- 混合模式专属逻辑 ---
    function renderHybridStatusPanel() {
        const panel = document.getElementById('hybrid-status-panel');
        if (!panel) return;
        const { vndbRelease, ymgalGame } = scriptState.hybridSelection;
        let html = '';
        html += `<div class="status-item">VNDB源: <span class="${vndbRelease ? 'status-ok' : 'status-pending'}">${vndbRelease ? `${vndbRelease.title} (已选)` : '待选择'}</span></div>`;
        html += `<div class="status-item">月幕源: <span class="${ymgalGame ? 'status-ok' : 'status-pending'}">${ymgalGame ? `${ymgalGame.game.chineseName || ymgalGame.game.name} (已选)` : '待选择'}</span></div>`;
        panel.innerHTML = html;

        if (vndbRelease && ymgalGame) {
            const button = document.createElement('input');
            button.type = 'button';
            button.value = '生成混合信息';
            button.onclick = handleHybridGeneration;
            panel.appendChild(button);
        }
    }

    async function handleHybridVndbGameSelect(gameId, panel) {
        render(panel, createLoader());
        try {
            const [vnDetails, releases] = await Promise.all([getVndbDetails(gameId), getVndbReleasesForVn(gameId)]);
            if (!vnDetails || !releases?.length) {
                render(panel, `<div class="pter-error-message">此游戏无详情或发行版本</div>`);
                return;
            }
            scriptState.hybridSelection.vndbGame = vnDetails;
            scriptState.vndbReleases = releases;

            const sortedReleases = [...releases].sort((a, b) => new Date(b.released) - new Date(a.released));
            const list = document.createElement('div');
            list.className = 'pter-results-list';
            sortedReleases.forEach(release => {
                const item = document.createElement('div');
                item.className = 'pter-list-item';
                item.innerHTML = `${release.title} <small>${release.released || 'N/A'} | ${release.platforms?.join(', ')}</small>`;
                item.onclick = () => {
                    scriptState.hybridSelection.vndbRelease = release;
                    renderHybridStatusPanel();
                    render(panel, `<div class="pter-success-message">VNDB源已选定: ${release.title}</div>`);
                };
                list.appendChild(item);
            });
            const container = document.createElement('div');
            const titleEl = document.createElement('div');
            titleEl.className = 'pter-step-title';
            titleEl.textContent = '请选择一个VNDB版本';
            container.append(titleEl, list);
            render(panel, container);
        } catch(e) {
            render(panel, `<div class="pter-error-message">处理失败: ${e.message}</div>`);
        }
    }

    async function handleHybridYmgalGameSelect(gameId, panel) {
        render(panel, createLoader());
        try {
            const details = await getYmgalGameDetails(gameId);
            if (!details?.game) {
                render(panel, `<div class="pter-error-message">无法获取月幕游戏详情</div>`);
                return;
            }
            scriptState.hybridSelection.ymgalGame = details;
            renderHybridStatusPanel();
            render(panel, `<div class="pter-success-message">月幕源已选定: ${details.game.chineseName || details.game.name}</div>`);
        } catch(e) {
            render(panel, `<div class="pter-error-message">处理失败: ${e.message}</div>`);
        }
    }

    async function handleHybridGeneration() {
        const { vndbGame, vndbRelease, ymgalGame } = scriptState.hybridSelection;
        if (!vndbGame || !vndbRelease || !ymgalGame) {
            alert("数据选择不完整！请确保VNDB和月幕源都已选定。");
            return;
        }
        const panel = document.querySelector('.pter-results-panel');
        render(panel, createLoader());
        try {
            // 使用VNDB数据作为基础
            const statusCallback = (msg) => render(panel, `<div class="pter-status-message">${msg}</div>`);
            const unifiedData = await adaptVndbData(vndbGame, vndbRelease, statusCallback);
            // 用月幕的中文简介覆盖VNDB的简介
            unifiedData.introduction = ymgalGame.game.introduction || '（无简介）';
            // 填充表单
            await populateForm(unifiedData, panel);
        } catch (e) {
            render(panel, `<div class="pter-error-message">生成混合信息失败: ${e.message}</div>`);
        }
    }

    // --- 主UI与启动逻辑 ---
    function initUI() {
        const referRow = document.querySelector('input[name="detailsgameinfoid"]')?.closest('tr');
        if (!referRow) {
            console.error("Pter 助手: 未找到用于注入UI的参考位置。");
            return;
        }

        const container = document.createElement('div');
        container.className = 'pter-helper-container';

        const sourceSelector = document.createElement('div');
        sourceSelector.className = 'pter-source-selector';
        sourceSelector.innerHTML = `<label><input type="radio" name="pter_source" value="hybrid" checked> 混合模式</label> <label><input type="radio" name="pter_source" value="vndb"> VNDB</label> <label><input type="radio" name="pter_source" value="ymgal"> 月幕</label>`;

        const searchBar = document.createElement('div');
        searchBar.className = 'pter-search-bar';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '在此输入游戏名 (日文/英文/中文)，然后按回车或点击搜索...';
        const searchButton = document.createElement('input');
        searchButton.type = 'button';
        searchButton.value = '搜索';
        searchBar.append(searchInput, searchButton);

        const resultsPanel = document.createElement('div');
        resultsPanel.className = 'pter-results-panel';
        container.append(sourceSelector, searchBar, resultsPanel);

        const newRow = document.createElement('tr');
        const newRowHead = document.createElement('td');
        newRowHead.className = 'rowhead nowrap';
        newRowHead.vAlign = 'top';
        newRowHead.align = 'right';
        newRowHead.textContent = "Galgame 助手:";
        const newRowFollow = document.createElement('td');
        newRowFollow.className = 'rowfollow';
        newRowFollow.vAlign = 'top';
        newRowFollow.align = 'left';
        newRowFollow.appendChild(container);
        newRow.append(newRowHead, newRowFollow);
        referRow.parentNode.insertBefore(newRow, referRow.nextSibling);

        // 重置状态
        const resetState = () => {
            render(resultsPanel, '');
            scriptState = { ...scriptState, hybridSelection: { vndbGame: null, vndbRelease: null, ymgalGame: null }, vndbGameDetails: null, vndbReleases: [], ymgalGameDetails: null };
        };
        sourceSelector.querySelectorAll('input[name="pter_source"]').forEach(radio => {
            radio.onchange = () => {
                scriptState.source = radio.value;
                resetState();
            };
        });

        // 搜索处理函数
        const handleSearch = async () => {
            const query = searchInput.value.trim();
            if (!query) return;
            searchButton.disabled = true;
            searchButton.value = '搜索中...';
            resetState();
            render(resultsPanel, createLoader());

            try {
                if (scriptState.source === 'hybrid') {
                    // 并发请求VNDB和月幕
                    const [vndbResults, ymgalResults] = await Promise.all([
                        searchVndbByName(query).catch(e => { console.error("VNDB搜索失败:", e); return []; }),
                        searchYmgalByName(query).catch(e => { console.error("月幕搜索失败:", e); return []; })
                    ]);
                    resultsPanel.innerHTML = `<div id="hybrid-status-panel"></div> <div class="pter-hybrid-container"> <div id="vndb-panel" class="pter-hybrid-panel"></div> <div id="ymgal-panel" class="pter-hybrid-panel"></div> </div>`;
                    renderHybridStatusPanel();
                    displaySearchResults(vndbResults.map(vn => ({ id: vn.id, title: vn.title, subtitle: `VNDB ID: ${vn.id}` })), document.getElementById('vndb-panel'), 'vndb', true);
                    displaySearchResults(ymgalResults.map(game => ({ id: game.id, title: game.chineseName || game.name, subtitle: `${game.name} | ${game.releaseDate || 'N/A'}` })), document.getElementById('ymgal-panel'), 'ymgal', true);
                } else {
                    const results = scriptState.source === 'vndb' ? await searchVndbByName(query) : await searchYmgalByName(query);
                    const mapped = scriptState.source === 'vndb'
                        ? results.map(vn => ({ id: vn.id, title: vn.title, subtitle: `VNDB ID: ${vn.id}` }))
                        : results.map(game => ({ id: game.id, title: game.chineseName || game.name, subtitle: `${game.name} | ${game.releaseDate || 'N/A'}` }));
                    displaySearchResults(mapped, resultsPanel, scriptState.source, false);
                }
            } catch (e) {
                render(resultsPanel, `<div class="pter-error-message">搜索失败: ${e.message}</div>`);
            }
            finally {
                searchButton.disabled = false;
                searchButton.value = '搜索';
            }
        };

        function displaySearchResults(results, panel, source, isHybrid) {
            if (!results?.length) {
                render(panel, '<div class="pter-status-message">未找到相关结果</div>');
                return;
            }
            const list = document.createElement('div');
            list.className = 'pter-results-list';
            results.forEach(itemData => {
                const item = document.createElement('div');
                item.className = 'pter-list-item';
                item.innerHTML = `${itemData.title} <small>${itemData.subtitle}</small>`;
                if (isHybrid) {
                    item.onclick = source === 'vndb'
                        ? () => handleHybridVndbGameSelect(itemData.id, panel)
                        : () => handleHybridYmgalGameSelect(itemData.id, panel);
                } else {
                    item.onclick = () => handleSingleSourceGameSelect(itemData.id, panel, source);
                }
                list.appendChild(item);
            });
            const container = document.createElement('div');
            const title = document.createElement('div');
            title.className = 'pter-step-title';
            if (isHybrid) {
                title.textContent = source === 'vndb' ? 'VNDB源 (提供图片/配置等)' : '月幕源 (提供中文简介)';
            } else {
                title.textContent = '步骤 1: 选择游戏';
            }
            container.append(title, list);
            render(panel, container);
        }

        searchButton.onclick = handleSearch;
        searchInput.onkeydown = (e) => {
            if (e.key === 'Enter') handleSearch();
        };
    }

    // --- 脚本入口 ---
    if (window.location.href.includes('uploadgameinfo.php')) {
        initUI();
    }

})();
