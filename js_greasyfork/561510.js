// ==UserScript==
// @name         HDBits M-Team Linker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在HDBits种子页面显示M-Team对应种子链接
// @author       江畔
// @match        *://hdbits.org/browse.php*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561510/HDBits%20M-Team%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/561510/HDBits%20M-Team%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const MTEAM_CONFIG = {
        apiBaseUrl: 'https://api.m-team.io',
        origin: 'https://kp.m-team.cc',
        apiKey: GM.getValue('mteam_api_key', ''), // 异步获取，但我们会在需要时等待
        enabled: GM.getValue('mteam_enabled', true), // 异步获取，但我们会在需要时等待
        category: 421, // 默认分类
        nameContains: '' // 名称包含关键词
    };

    // ==================== 工具函数 ====================

    /**
     * 格式化文件大小为字节数
     * @param {string} sizeText - 文件大小文本，如 "88.46 GiB"
     * @returns {number} 字节数
     */
    function parseSizeToBytes(sizeText) {
        if (!sizeText) return 0;

        const match = sizeText.trim().match(/^([\d.]+)\s*(B|KB|MB|GB|TB|GiB|MiB|KiB)$/i);
        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        const multipliers = {
            'B': 1,
            'KB': 1024,
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024,
            'TB': 1024 * 1024 * 1024 * 1024,
            'KIB': 1024,
            'MIB': 1024 * 1024,
            'GIB': 1024 * 1024 * 1024
        };

        return Math.round(value * (multipliers[unit] || 1));
    }

    /**
     * 从种子行中提取IMDb ID
     * @param {HTMLElement} row - 表格行元素
     * @returns {string|null} IMDb ID
     */
    function extractImdbId(row) {
        // 方法1：从data-imdb-link属性获取
        const imdbLink = row.querySelector('a[data-imdb-link]');
        if (imdbLink) {
            const match = imdbLink.getAttribute('data-imdb-link').match(/tt\d+/);
            if (match) return match[0];
        }

        // 方法2：从poster图片src获取
        const posterImg = row.querySelector('.browse_imdb_poster img');
        if (posterImg) {
            const match = posterImg.src.match(/imdb_poster_cache\/(\d+)_big\.jpg/);
            if (match) return 'tt' + match[1].padStart(7, '0');
        }

        // 方法3：从wishlist链接获取
        const wishlistLink = row.querySelector('a[onclick*="addWishlist"]');
        if (wishlistLink) {
            const match = wishlistLink.getAttribute('onclick').match(/addWishlist\(this,\s*'([^']+)'/);
            if (match) return match[1];
        }

        return null;
    }

    /**
     * 从种子行中提取文件大小
     * @param {HTMLElement} row - 表格行元素
     * @returns {string} 文件大小文本
     */
    function extractSize(row) {
        // 尝试第7列（新版本有折扣列）
        let sizeCell = row.querySelector('td.center:nth-child(7)');
        if (!sizeCell) {
            // 如果第7列不是Size列，尝试第6列（兼容旧版本）
            sizeCell = row.querySelector('td.center:nth-child(6)');
        }
        return sizeCell ? sizeCell.textContent.trim() : '';
    }

    /**
     * 从种子行中提取文件名
     * @param {HTMLElement} row - 表格行元素
     * @returns {string} 文件名
     */
    function extractFilename(row) {
        try {
            const nameCell = row.querySelector('td.browse_td_name_cell');
            if (!nameCell) return '';

            // 找到种子标题链接
            const titleLink = nameCell.querySelector('a[href*="/details.php"]');
            if (!titleLink) return '';

            return titleLink.textContent?.trim() || '';
        } catch (error) {
            console.error('提取文件名时出错:', error);
            return '';
        }
    }

    /**
     * 搜索M-Team种子
     * @param {string} imdbId - IMDb ID
     * @returns {Promise<Array>} 种子列表
     */
    function searchMTorrent(imdbId) {
        return new Promise((resolve, reject) => {
            if (!MTEAM_CONFIG.apiKey) {
                reject(new Error('请先配置M-Team API Key'));
                return;
            }

            const imdbUrl = `https://www.imdb.com/title/${imdbId}`;
            const requestData = {
                keyword: imdbUrl,
                categories: MTEAM_CONFIG.category ? [MTEAM_CONFIG.category.toString()] : [],
                pageNumber: 1,
                pageSize: 50,
                visible: 1
            };

            if (MTEAM_CONFIG.nameContains) {
                requestData.keyword = `${imdbUrl} ${MTEAM_CONFIG.nameContains}`;
            }

            GM.xmlHttpRequest({
                method: 'POST',
                url: `${MTEAM_CONFIG.apiBaseUrl}/api/torrent/search`,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': MTEAM_CONFIG.apiKey,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': `${MTEAM_CONFIG.origin}/browse`
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        console.log('API响应:', result); // 调试用

                        // 检查响应码 - 兼容数字和字符串
                        const codeOk = result.code === 0 || result.code === "0";
                        const hasData = result.data !== null && result.data !== undefined && result.data !== "";

                        if (codeOk && hasData) {
                            // 处理返回的数据结构 - 兼容不同格式
                            let torrents = [];
                            if (Array.isArray(result.data)) {
                                // 直接返回列表
                                torrents = result.data;
                            } else if (typeof result.data === 'object' && result.data !== null) {
                                // 返回嵌套的 data 字段
                                torrents = result.data.data || [];
                            }
                            resolve(torrents);
                        } else {
                            // 对于成功响应但没有数据的情况，也返回空数组
                            if (codeOk) {
                                console.log('API响应成功但无数据');
                                resolve([]);
                            } else {
                                reject(new Error(result.message || '搜索失败'));
                            }
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败: ' + e.message));
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    /**
     * 提取发布组标识（文件名用"-"分割的最后一个元素）
     * @param {string} filename - 文件名
     * @returns {string} 发布组标识，不区分大小写
     */
    function extractReleaseGroup(filename) {
        if (!filename) return '';
        const parts = filename.split('-');
        const group = parts[parts.length - 1]?.trim() || '';
        return group.toLowerCase();
    }

    /**
     * 根据文件大小和发布组匹配种子
     * @param {Array} torrents - 种子列表
     * @param {number} targetSizeBytes - 目标文件大小（字节）
     * @param {string} targetGroup - 目标发布组标识
     * @param {number} tolerancePercent - 容差百分比，默认5%
     * @returns {Array} 匹配的种子
     */
    function matchTorrentsBySizeAndGroup(torrents, targetSizeBytes, targetGroup, tolerancePercent = 5) {
        if (!torrents || !targetSizeBytes || !targetGroup) return [];

        const tolerance = targetSizeBytes * (tolerancePercent / 100);
        const minSize = targetSizeBytes - tolerance;
        const maxSize = targetSizeBytes + tolerance;
        const normalizedTargetGroup = targetGroup.toLowerCase();

        return torrents.filter(torrent => {
            const torrentSize = torrent.size || 0;
            const sizeMatch = torrentSize >= minSize && torrentSize <= maxSize;

            const torrentGroup = extractReleaseGroup(torrent.name || '');
            const groupMatch = torrentGroup === normalizedTargetGroup;

            return sizeMatch && groupMatch;
        });
    }

    /**
     * 获取种子下载链接
     * @param {string} torrentId - 种子ID
     * @returns {Promise<string>} 下载链接
     */
    function getDownloadUrl(torrentId) {
        return new Promise((resolve, reject) => {
            if (!MTEAM_CONFIG.apiKey) {
                reject(new Error('请先配置M-Team API Key'));
                return;
            }

            GM.xmlHttpRequest({
                method: 'POST',
                url: `${MTEAM_CONFIG.apiBaseUrl}/api/torrent/genDlToken`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-api-key': MTEAM_CONFIG.apiKey,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*'
                },
                data: `id=${torrentId}`,
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        console.log('下载链接API响应:', result); // 调试用

                        const codeOk = result.code === 0 || result.code === "0";
                        if (codeOk && result.data && typeof result.data === 'string' && result.data.startsWith('http')) {
                            resolve(result.data);
                        } else {
                            reject(new Error(result.message || '获取下载链接失败'));
                        }
                    } catch (e) {
                        reject(new Error('解析下载链接响应失败: ' + e.message));
                    }
                },
                onerror: function() {
                    reject(new Error('获取下载链接网络请求失败'));
                }
            });
        });
    }

    /**
     * 创建下载链接点击处理器
     * @param {string} torrentId - 种子ID
     * @param {string} torrentName - 种子名称
     * @param {HTMLElement} linkElement - 链接元素
     */
    function createDownloadLinkHandler(torrentId, torrentName, linkElement) {
        return async function(e) {
            e.preventDefault();

            // 显示加载状态 - 直接变红色
            linkElement.style.color = '#f00';

            try {
                const downloadUrl = await getDownloadUrl(torrentId);
                // 在新标签页打开下载链接
                window.open(downloadUrl, '_blank');
                // 恢复原始状态
                linkElement.style.color = '#007cba';
            } catch (error) {
                console.error('获取下载链接失败:', error);
                linkElement.style.color = '#f00';
                linkElement.title = error.message;
                // 3秒后恢复
                setTimeout(() => {
                    linkElement.style.color = '#007cba';
                    linkElement.title = torrentName;
                }, 3000);
            }
        };
    }

    /**
     * 创建M-Team链接HTML
     * @param {Array} matchedTorrents - 匹配的种子
     * @returns {string} HTML字符串
     */
    function createMTorrentLinks(matchedTorrents) {
        if (!matchedTorrents || matchedTorrents.length === 0) {
            return '<span style="color: #999;">未找到</span>';
        }

        const links = matchedTorrents.map(torrent => {
            const detailUrl = `${MTEAM_CONFIG.origin}/detail/${torrent.id}`;
            const title = torrent.name || `种子 ${torrent.id}`;

            // 创建详情链接
            const detailLink = `<a href="${detailUrl}" target="_blank" title="${title} - 详情" style="color: #007cba; text-decoration: none; margin-right: 8px;">详情</a>`;

            // 创建下载链接 - 点击时获取下载URL
            const downloadLinkId = `mteam-dl-${torrent.id}`;
            const downloadLink = `<a id="${downloadLinkId}" href="#" title="${title} - 下载" style="color: #007cba; text-decoration: none; cursor: pointer;">下载</a>`;

            // 添加点击事件处理器
            setTimeout(() => {
                const downloadElement = document.getElementById(downloadLinkId);
                if (downloadElement) {
                    downloadElement.addEventListener('click', createDownloadLinkHandler(torrent.id, title, downloadElement));
                }
            }, 100);

            return `${detailLink}${downloadLink}`;
        });

        return links.join(' | ');
    }

    /**
     * 处理单个种子行
     * @param {HTMLElement} row - 表格行
     */
    async function processTorrentRow(row) {
        try {
            // 检查开关状态
            if (!MTEAM_CONFIG.enabled) {
                return;
            }

            // 检查API Key
            if (!MTEAM_CONFIG.apiKey) {
                const lastCell = row.querySelector('td:last-child');
                if (lastCell) {
                    const newCell = document.createElement('td');
                    newCell.className = 'center';
                    newCell.innerHTML = '<span style="color: #999;" title="请先配置M-Team API Key">未配置</span>';
                    row.appendChild(newCell);
                }
                return;
            }

            // 提取IMDb ID
            const imdbId = extractImdbId(row);
            if (!imdbId) {
                console.log('无法提取IMDb ID，跳过处理');
                // 仍然添加空列保持表格结构
                const lastCell = row.querySelector('td:last-child');
                if (lastCell) {
                    const newCell = document.createElement('td');
                    newCell.className = 'center';
                    newCell.innerHTML = '<span style="color: #999;">N/A</span>';
                    row.appendChild(newCell);
                }
                return;
            }

            // 提取文件大小
            const sizeText = extractSize(row);
            const sizeBytes = parseSizeToBytes(sizeText);
            if (!sizeBytes) {
                console.log('无法提取文件大小，跳过处理');
                const lastCell = row.querySelector('td:last-child');
                if (lastCell) {
                    const newCell = document.createElement('td');
                    newCell.className = 'center';
                    newCell.innerHTML = '<span style="color: #999;">N/A</span>';
                    row.appendChild(newCell);
                }
                return;
            }

            // 提取文件名和发布组
            const filename = extractFilename(row);
            const releaseGroup = extractReleaseGroup(filename);

            console.log(`处理种子: IMDb=${imdbId}, 大小=${sizeText} (${sizeBytes} bytes), 发布组=${releaseGroup}`);

            // 显示处理中状态
            let processingCell = null;
            const existingLastCell = row.querySelector('td:last-child');
            if (existingLastCell) {
                processingCell = document.createElement('td');
                processingCell.className = 'center';
                processingCell.innerHTML = '<span style="color: #ffa500;">处理中...</span>';
                row.appendChild(processingCell);
            }

            // 搜索M-Team种子
            const torrents = await searchMTorrent(imdbId);
            console.log(`找到 ${torrents.length} 个M-Team种子`);

            // 打印所有种子信息用于调试
            if (torrents.length > 0) {
                console.log('=== API获取的所有种子信息 ===');
                torrents.forEach((torrent, index) => {
                    const torrentGroup = extractReleaseGroup(torrent.name || '');
                    const sizeGB = torrent.size ? (torrent.size / (1024 * 1024 * 1024)).toFixed(2) : '未知';
                    console.log(`${index + 1}. ID: ${torrent.id}`);
                    console.log(`   名称: ${torrent.name}`);
                    console.log(`   大小: ${sizeGB} GB (${torrent.size || 0} bytes)`);
                    console.log(`   发布组: ${torrentGroup}`);
                    console.log(`   状态: ${JSON.stringify(torrent.status || {})}`);
                    console.log('');
                });
                console.log('================================');
            }

            // 根据大小和发布组匹配
            const matchedTorrents = matchTorrentsBySizeAndGroup(torrents, sizeBytes, releaseGroup);
            console.log(`大小+发布组匹配找到 ${matchedTorrents.length} 个种子`);

            // 打印匹配的种子信息
            if (matchedTorrents.length > 0) {
                console.log('=== 匹配的种子信息 ===');
                matchedTorrents.forEach((torrent, index) => {
                    const torrentGroup = extractReleaseGroup(torrent.name || '');
                    const sizeGB = torrent.size ? (torrent.size / (1024 * 1024 * 1024)).toFixed(2) : '未知';
                    console.log(`${index + 1}. ID: ${torrent.id}`);
                    console.log(`   名称: ${torrent.name}`);
                    console.log(`   大小: ${sizeGB} GB (${torrent.size || 0} bytes)`);
                    console.log(`   发布组: ${torrentGroup}`);
                    console.log('');
                });
                console.log('======================');
            }

            // 创建链接
            const linksHtml = createMTorrentLinks(matchedTorrents);

            // 更新显示结果
            if (processingCell) {
                processingCell.innerHTML = linksHtml;
            }

        } catch (error) {
            console.error('处理种子行失败:', error);
            // 显示错误信息
            const lastCell = row.querySelector('td:last-child');
            if (lastCell) {
                const newCell = document.createElement('td');
                newCell.className = 'center';
                newCell.innerHTML = '<span style="color: #f00;" title="' + error.message + '">错误</span>';
                row.appendChild(newCell);
            }
        }
    }

    /**
     * 初始化脚本
     */
    function init() {
        // 检查是否在正确的页面
        const torrentTable = document.getElementById('torrent-list');
        if (!torrentTable) {
            console.log('未找到种子表格，跳过处理');
            return;
        }

        // 添加表头
        const headerRow = torrentTable.querySelector('thead tr');
        if (headerRow) {
            const newHeader = document.createElement('th');
            newHeader.className = 'center';
            newHeader.textContent = 'M-Team';
            newHeader.title = 'M-Team对应种子';
            headerRow.appendChild(newHeader);
        }

        // 处理每一行
        const rows = torrentTable.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            // 延迟处理，避免同时请求过多
            setTimeout(() => {
                processTorrentRow(row);
            }, index * 100); // 每行间隔100ms
        });
    }

    /**
     * 设置API Key
     */
    async function setApiKey() {
        const currentKey = await GM.getValue('mteam_api_key', '');
        const newKey = prompt('请输入M-Team API Key:', currentKey);
        if (newKey !== null) {
            await GM.setValue('mteam_api_key', newKey.trim());
            alert('API Key已保存！请刷新页面以生效。');
        }
    }

    /**
     * 切换开关
     */
    async function toggleEnabled() {
        const currentEnabled = await GM.getValue('mteam_enabled', true);
        const newEnabled = !currentEnabled;
        await GM.setValue('mteam_enabled', newEnabled);
        alert(`M-Team链接器已${newEnabled ? '开启' : '关闭'}！请刷新页面以生效。`);
    }

    /**
     * 注册菜单
     */
    function registerMenu() {
        GM_registerMenuCommand('设置 M-Team API Key', setApiKey);
        GM_registerMenuCommand(MTEAM_CONFIG.enabled ? '关闭 M-Team 链接器' : '开启 M-Team 链接器', toggleEnabled);
    }

    // ==================== 主逻辑 ====================

    // 启动脚本
    async function startScript() {
        try {
            // 等待配置加载完成
            const [apiKey, enabled] = await Promise.all([
                MTEAM_CONFIG.apiKey,
                MTEAM_CONFIG.enabled
            ]);

            // 更新配置对象
            MTEAM_CONFIG.apiKey = apiKey;
            MTEAM_CONFIG.enabled = enabled;

            // 注册菜单（这时配置已加载，菜单能显示正确状态）
            registerMenu();

            // 检查开关状态
            if (!enabled) {
                console.log('M-Team链接器已关闭');
                return;
            }

            // 检查API Key配置
            if (!apiKey) {
                console.log('M-Team API Key 未配置，请通过油猴脚本菜单设置');
                return;
            }

            console.log('M-Team链接器已启用，API Key已配置');

            // 等待页面加载完成后初始化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }

        } catch (error) {
            console.error('脚本初始化失败:', error);
        }
    }

    // 立即启动脚本（获取配置后再决定是否运行功能）
    startScript();

})();
