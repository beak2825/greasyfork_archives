// ==UserScript==
// @name         NodeSeek & DeepFlood 增强插件
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  标记已读帖子、显示用户详细信息（等级、主题量、鸡腿数、评论量）、自动签到 - 支持 NodeSeek 和 DeepFlood
// @author       da niao
// @match        https://www.nodeseek.com/*
// @match        https://nodeseek.com/*
// @match        https://www.deepflood.com/*
// @match        https://deepflood.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.nodeimage.com
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556251/NodeSeek%20%20DeepFlood%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/556251/NodeSeek%20%20DeepFlood%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 站点识别 ====================
    const CURRENT_SITE = (() => {
        const host = location.hostname;
        if (host.includes('nodeseek.com')) {
            return {
                code: 'ns',
                name: 'NodeSeek',
                host: host
            };
        } else if (host.includes('deepflood.com')) {
            return {
                code: 'df',
                name: 'DeepFlood',
                host: host
            };
        }
        return null;
    })();

    // ==================== 配置管理 ====================
    class ConfigManager {
        static defaults = {
            visitedColor: '#ff6b6b',
            enableVisitedMark: true,
            enableUserInfo: true,
            cacheExpireTime: 24, // 小时
            badgeBackground: 'transparent', // 透明背景
            badgeTextColor: '#000000', // 默认黑色字体
            requestDelay: 300,
            autoSignIn: true,
            signInMode_ns: 'random', // NodeSeek 签到模式
            signInMode_df: 'random'  // DeepFlood 签到模式
        };

        static get(key) {
            const config = GM_getValue('nse_config', this.defaults);
            return config[key] !== undefined ? config[key] : this.defaults[key];
        }

        static set(key, value) {
            const config = GM_getValue('nse_config', this.defaults);
            config[key] = value;
            GM_setValue('nse_config', config);
        }

        static getAll() {
            return GM_getValue('nse_config', this.defaults);
        }
    }

    // 使用配置
    const CONFIG = {
        get visitedColor() { return ConfigManager.get('visitedColor'); },
        get enableVisitedMark() { return ConfigManager.get('enableVisitedMark'); },
        get enableUserInfo() { return ConfigManager.get('enableUserInfo'); },
        get cacheExpireTime() { return ConfigManager.get('cacheExpireTime') * 3600000; }, // 转换为毫秒
        get badgeBackground() { return ConfigManager.get('badgeBackground'); },
        get badgeTextColor() { return ConfigManager.get('badgeTextColor'); },
        get requestDelay() { return ConfigManager.get('requestDelay'); },
        get autoSignIn() { return ConfigManager.get('autoSignIn'); },
        get signInMode() {
            const siteCode = CURRENT_SITE ? CURRENT_SITE.code : 'ns';
            return ConfigManager.get(`signInMode_${siteCode}`);
        }
    };

    // ==================== 请求队列管理 ====================
    class RequestQueue {
        constructor(delay = 300) {
            this.queue = [];
            this.processing = false;
            this.delay = delay;
            this.pendingRequests = new Map(); // 防止重复请求
        }

        async add(userId, fetchFn) {
            // 如果已经有相同的请求在处理，返回该 Promise
            if (this.pendingRequests.has(userId)) {
                return this.pendingRequests.get(userId);
            }

            const promise = new Promise((resolve) => {
                this.queue.push({ userId, fetchFn, resolve });
            });

            this.pendingRequests.set(userId, promise);

            if (!this.processing) {
                this.process();
            }

            return promise;
        }

        async process() {
            if (this.queue.length === 0) {
                this.processing = false;
                return;
            }

            this.processing = true;
            const { userId, fetchFn, resolve } = this.queue.shift();

            try {
                const result = await fetchFn();
                resolve(result);
            } catch (error) {
                console.error(`请求用户 ${userId} 信息失败:`, error);
                resolve(null);
            } finally {
                this.pendingRequests.delete(userId);
                // 延迟后处理下一个请求
                await new Promise(r => setTimeout(r, this.delay));
                this.process();
            }
        }
    }

    const requestQueue = new RequestQueue(CONFIG.requestDelay);

    // ==================== 菜单管理 ====================
    class MenuManager {
        static registerMenus() {
            const siteCode = CURRENT_SITE ? CURRENT_SITE.code : 'ns';
            const siteName = CURRENT_SITE ? CURRENT_SITE.name : 'NodeSeek';

            // 签到设置（区分站点）
            const signInMode = ConfigManager.get(`signInMode_${siteCode}`);
            const signInText = {
                'random': '🎲 随机鸡腿',
                'fixed': '📌 固定5个',
                'disabled': '❌ 已关闭'
            }[signInMode];

            GM_registerMenuCommand(`[${siteName}] 签到: ${signInText}`, () => {
                const modes = ['random', 'fixed', 'disabled'];
                const current = ConfigManager.get(`signInMode_${siteCode}`);
                const currentIndex = modes.indexOf(current);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                ConfigManager.set(`signInMode_${siteCode}`, nextMode);
                alert(`${siteName} 签到模式已切换为: ${{'random':'随机鸡腿','fixed':'固定5个','disabled':'关闭'}[nextMode]}`);
                location.reload();
            });

            // 已读颜色设置
            GM_registerMenuCommand('🎨 设置已读颜色', () => {
                const current = ConfigManager.get('visitedColor');
                const color = prompt('请输入已读帖子颜色（CSS颜色值）:', current);
                if (color && color !== current) {
                    ConfigManager.set('visitedColor', color);
                    alert('已读颜色已更新，刷新页面生效');
                    location.reload();
                }
            });

            // 徽章样式切换
            const badgeStyles = {
                'transparent': { name: '透明背景', bg: 'transparent', color: '#000000' },
                'purple': { name: '紫色渐变', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' },
                'blue': { name: '蓝色渐变', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#ffffff' },
                'green': { name: '绿色渐变', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#ffffff' },
                'orange': { name: '橙色渐变', bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#ffffff' },
                'pink': { name: '粉色渐变', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#ffffff' },
                'dark': { name: '深色背景', bg: '#2c3e50', color: '#ecf0f1' },
                'light': { name: '浅色背景', bg: '#ecf0f1', color: '#2c3e50' }
            };

            // 获取当前样式
            const currentBg = ConfigManager.get('badgeBackground');
            let currentStyleName = '自定义';
            for (const [key, style] of Object.entries(badgeStyles)) {
                if (style.bg === currentBg) {
                    currentStyleName = style.name;
                    break;
                }
            }

            GM_registerMenuCommand(`🎨 徽章样式: ${currentStyleName}`, () => {
                const styleKeys = Object.keys(badgeStyles);
                const options = styleKeys.map((key, index) =>
                    `${index + 1}. ${badgeStyles[key].name}`
                ).join('\n');

                const choice = prompt(
                    `请选择徽章样式（输入数字）:\n\n${options}\n\n当前: ${currentStyleName}`,
                    '1'
                );

                if (choice) {
                    const index = parseInt(choice) - 1;
                    if (index >= 0 && index < styleKeys.length) {
                        const selectedKey = styleKeys[index];
                        const selectedStyle = badgeStyles[selectedKey];
                        ConfigManager.set('badgeBackground', selectedStyle.bg);
                        ConfigManager.set('badgeTextColor', selectedStyle.color);
                        alert(`徽章样式已切换为: ${selectedStyle.name}`);
                        location.reload();
                    } else {
                        alert('无效的选择');
                    }
                }
            });

            // 字体颜色切换
            const textColors = {
                'black': { name: '黑色', color: '#000000' },
                'gray': { name: '深灰', color: '#333333' },
                'blue': { name: '蓝色', color: '#1e90ff' },
                'purple': { name: '紫色', color: '#9b59b6' },
                'green': { name: '绿色', color: '#27ae60' },
                'orange': { name: '橙色', color: '#e67e22' },
                'red': { name: '红色', color: '#e74c3c' }
            };

            // 获取当前字体颜色名称
            const currentTextColor = ConfigManager.get('badgeTextColor');
            let currentColorName = '自定义';
            for (const [key, colorObj] of Object.entries(textColors)) {
                if (colorObj.color === currentTextColor) {
                    currentColorName = colorObj.name;
                    break;
                }
            }

            GM_registerMenuCommand(`🖍️ 字体颜色: ${currentColorName}`, () => {
                const colorKeys = Object.keys(textColors);
                const options = colorKeys.map((key, index) =>
                    `${index + 1}. ${textColors[key].name}`
                ).join('\n');

                const choice = prompt(
                    `请选择字体颜色（输入数字）:\n\n${options}\n\n当前: ${currentColorName}`,
                    '1'
                );

                if (choice) {
                    const index = parseInt(choice) - 1;
                    if (index >= 0 && index < colorKeys.length) {
                        const selectedKey = colorKeys[index];
                        const selectedColor = textColors[selectedKey];
                        ConfigManager.set('badgeTextColor', selectedColor.color);
                        alert(`字体颜色已切换为: ${selectedColor.name}`);
                        location.reload();
                    } else {
                        alert('无效的选择');
                    }
                }
            });

            // 缓存时间设置
            const cacheHours = ConfigManager.get('cacheExpireTime');
            GM_registerMenuCommand(`⏰ 缓存时间: ${cacheHours}小时`, () => {
                const hours = prompt('请输入用户信息缓存时间（小时）:', cacheHours);
                if (hours && !isNaN(hours) && hours > 0) {
                    ConfigManager.set('cacheExpireTime', parseInt(hours));
                    alert(`缓存时间已设置为 ${hours} 小时`);
                }
            });

            // 切换已读标记
            const visitedEnabled = ConfigManager.get('enableVisitedMark');
            GM_registerMenuCommand(`${visitedEnabled ? '✅' : '❌'} 已读标记`, () => {
                ConfigManager.set('enableVisitedMark', !visitedEnabled);
                alert(`已读标记已${!visitedEnabled ? '开启' : '关闭'}`);
                location.reload();
            });

            // 切换用户信息显示
            const userInfoEnabled = ConfigManager.get('enableUserInfo');
            GM_registerMenuCommand(`${userInfoEnabled ? '✅' : '❌'} 用户信息显示`, () => {
                ConfigManager.set('enableUserInfo', !userInfoEnabled);
                alert(`用户信息显示已${!userInfoEnabled ? '开启' : '关闭'}`);
                location.reload();
            });

            // 清除缓存
            GM_registerMenuCommand('🗑️ 清除用户信息缓存', () => {
                if (confirm('确定要清除所有用户信息缓存吗？')) {
                    GM_setValue('userInfoCache', {});
                    alert('缓存已清除');
                }
            });

            // NodeImage API Key 设置
            const currentApiKey = GM_getValue('nodeimage_apiKey', '');
            const apiKeyStatus = currentApiKey ? '已设置' : '未设置';
            GM_registerMenuCommand(`🔑 NodeImage API Key: ${apiKeyStatus}`, () => {
                const hint = currentApiKey
                    ? `当前API Key: ${currentApiKey.substring(0, 8)}...\n\n输入新的API Key可以更新，留空则清除`
                    : '请输入NodeImage API Key\n\n你可以在 https://www.nodeimage.com 登录后，在个人设置中找到API Key';

                const newKey = prompt(hint, '');
                if (newKey === null) return; // 用户取消

                if (newKey.trim() === '') {
                    GM_setValue('nodeimage_apiKey', '');
                    alert('API Key已清除');
                } else {
                    GM_setValue('nodeimage_apiKey', newKey.trim());
                    alert('API Key已保存');
                }
            });

            // 重置所有设置
            GM_registerMenuCommand('🔄 重置所有设置', () => {
                if (confirm('确定要重置所有设置为默认值吗？')) {
                    GM_setValue('nse_config', ConfigManager.defaults);
                    GM_setValue('userInfoCache', {});
                    GM_setValue('visitedPosts', {});
                    alert('所有设置已重置，页面即将刷新');
                    location.reload();
                }
            });
        }
    }

    // ==================== 签到管理 ====================
    class SignInManager {
        // 获取当前日期（北京时间）
        static getCurrentDate() {
            const localTimezoneOffset = (new Date()).getTimezoneOffset();
            const beijingOffset = 8 * 60;
            const beijingTime = new Date(Date.now() + (localTimezoneOffset + beijingOffset) * 60 * 1000);
            return `${beijingTime.getFullYear()}/${(beijingTime.getMonth() + 1)}/${beijingTime.getDate()}`;
        }

        // 获取上次签到日期（区分站点）
        static getLastSignInDate() {
            const siteCode = CURRENT_SITE ? CURRENT_SITE.code : 'ns';
            return GM_getValue(`lastSignInDate_${siteCode}`, '');
        }

        // 设置签到日期（区分站点）
        static setLastSignInDate(date) {
            const siteCode = CURRENT_SITE ? CURRENT_SITE.code : 'ns';
            GM_setValue(`lastSignInDate_${siteCode}`, date);
        }

        // 检查今天是否已签到
        static hasSignedInToday() {
            const today = this.getCurrentDate();
            const lastDate = this.getLastSignInDate();
            return today === lastDate;
        }

        // 执行签到
        static async signIn() {
            if (!CURRENT_SITE) {
                console.log('[增强插件] 未识别的站点');
                return;
            }

            const signInMode = CONFIG.signInMode;
            const siteName = CURRENT_SITE.name;

            if (signInMode === 'disabled') {
                console.log(`[${siteName}增强] 自动签到已禁用`);
                return;
            }

            if (this.hasSignedInToday()) {
                console.log(`[${siteName}增强] 今天已经签到过了`);
                return;
            }

            const isRandom = signInMode === 'random';

            try {
                const response = await fetch(`/api/attendance?random=${isRandom}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    const today = this.getCurrentDate();
                    this.setLastSignInDate(today);
                    const siteName = CURRENT_SITE ? CURRENT_SITE.name : 'NodeSeek';
                    console.log(`[${siteName}增强] 签到成功！获得 ${data.gain} 个鸡腿，当前共有 ${data.current} 个鸡腿`);

                    // 可选：显示通知
                    this.showNotification(`${siteName} 签到成功！获得 ${data.gain} 个🍗`);
                } else {
                    const siteName = CURRENT_SITE ? CURRENT_SITE.name : 'NodeSeek';
                    console.warn(`[${siteName}增强] 签到失败：`, data.message);
                }
            } catch (error) {
                const siteName = CURRENT_SITE ? CURRENT_SITE.name : 'NodeSeek';
                console.error(`[${siteName}增强] 签到请求失败：`, error);
            }
        }

        // 显示通知（简单的页面提示）
        static showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-size: 14px;
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = message;

            // 添加动画样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            // 3秒后自动消失
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // ==================== 存储管理 ====================
    class Storage {
        static getVisitedPosts() {
            return GM_getValue('visitedPosts', {});
        }

        static markPostAsVisited(postId) {
            const visited = this.getVisitedPosts();
            visited[postId] = Date.now();
            GM_setValue('visitedPosts', visited);
        }

        static isPostVisited(postId) {
            const visited = this.getVisitedPosts();
            return !!visited[postId];
        }

        static getUserInfoCache(userId) {
            const cache = GM_getValue('userInfoCache', {});
            const userCache = cache[userId];
            if (userCache && (Date.now() - userCache.timestamp < CONFIG.cacheExpireTime)) {
                return userCache.data;
            }
            return null;
        }

        static setUserInfoCache(userId, data) {
            const cache = GM_getValue('userInfoCache', {});
            cache[userId] = {
                data: data,
                timestamp: Date.now()
            };
            GM_setValue('userInfoCache', cache);
        }
    }

    // ==================== 用户信息获取 ====================
    class UserInfoFetcher {
        // 从用户主页获取信息（使用请求队列）
        static async fetchUserInfo(userId) {
            // 先检查缓存
            const cached = Storage.getUserInfoCache(userId);
            if (cached) {
                return cached;
            }

            // 使用请求队列，避免并发请求过多
            return requestQueue.add(userId, async () => {
                try {
                    // 再次检查缓存（可能在队列等待期间已被其他请求缓存）
                    const cached = Storage.getUserInfoCache(userId);
                    if (cached) {
                        return cached;
                    }

                    // 方法1: 从 API 获取
                    const apiData = await this.fetchFromAPI(userId);
                    if (apiData) {
                        Storage.setUserInfoCache(userId, apiData);
                        return apiData;
                    }

                    // 如果 API 返回 429，不再尝试备用方案，直接返回 null
                    return null;
                } catch (error) {
                    console.error('获取用户信息失败:', error);
                    return null;
                }
            });
        }

        // 从 API 获取（使用浏览器 fetch，自动带 cookies）
        static async fetchFromAPI(userId) {
            try {
                // 根据当前站点构建 API URL
                const apiUrl = CURRENT_SITE
                    ? `https://${CURRENT_SITE.host}/api/account/getInfo/${userId}`
                    : `https://www.nodeseek.com/api/account/getInfo/${userId}`;

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    credentials: 'include', // 自动包含 cookies
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        console.warn(`API 请求过于频繁 (429)，跳过用户 ${userId}`);
                    }
                    return null;
                }

                const data = await response.json();
                // API 返回的是 detail 而不是 data
                if (data.success && data.detail) {
                    const user = data.detail;

                    // 计算加入天数
                    let joinDays = 0;
                    if (user.created_at) {
                        const joinDate = new Date(user.created_at);
                        const now = new Date();
                        joinDays = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
                    }

                    return {
                        level: user.rank || 0,
                        topicCount: user.nPost || 0,
                        drumstickCount: user.coin || 0,
                        commentCount: user.nComment || 0,
                        joinDays: joinDays
                    };
                } else {
                    return null;
                }
            } catch (error) {
                console.error('API 请求失败:', error);
                return null;
            }
        }


    }

    // ==================== 快照管理 ====================
    class SnapshotManager {
        // 保存快照
        static saveSnapshot(postData) {
            const snapshots = this.getAllSnapshots();
            const snapshot = {
                id: postData.id,
                title: postData.title,
                content: postData.content,
                author: postData.author,
                authorId: postData.authorId,
                authorAvatar: postData.authorAvatar,
                createdAt: postData.createdAt,
                savedAt: Date.now(),
                url: window.location.href,
                type: postData.type || 'post' // 'post' 或 'comment'
            };

            snapshots[postData.id] = snapshot;
            GM_setValue('postSnapshots', snapshots);
            return true;
        }

        // 获取所有快照
        static getAllSnapshots() {
            return GM_getValue('postSnapshots', {});
        }

        // 获取单个快照
        static getSnapshot(postId) {
            const snapshots = this.getAllSnapshots();
            return snapshots[postId] || null;
        }

        // 删除快照
        static async deleteSnapshot(postId) {
            const snapshots = this.getAllSnapshots();
            const snapshot = snapshots[postId];
            
            // 如果快照有上传的图片，尝试删除它们
            if (snapshot && snapshot.uploadedImageIds && snapshot.uploadedImageIds.length > 0) {
                const apiKey = GM_getValue('nodeimage_apiKey', '');
                if (apiKey) {
                    console.log(`[快照删除] 正在删除 ${snapshot.uploadedImageIds.length} 张图床图片...`);
                    let deletedCount = 0;
                    
                    for (const imageId of snapshot.uploadedImageIds) {
                        try {
                            const success = await this.deleteImageFromNodeImage(imageId, apiKey);
                            if (success) {
                                deletedCount++;
                            }
                        } catch (error) {
                            console.error(`[快照删除] 删除图片 ${imageId} 失败:`, error);
                        }
                    }
                    
                    console.log(`[快照删除] 成功删除 ${deletedCount}/${snapshot.uploadedImageIds.length} 张图床图片`);
                }
            }
            
            // 删除快照
            delete snapshots[postId];
            GM_setValue('postSnapshots', snapshots);
        }

        // 导出快照
        static exportSnapshots() {
            const snapshots = this.getAllSnapshots();
            const dataStr = JSON.stringify(snapshots, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nodeseek-snapshots-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        // 导入快照
        static importSnapshots(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const imported = JSON.parse(e.target.result);
                        const existing = this.getAllSnapshots();
                        const merged = { ...existing, ...imported };
                        GM_setValue('postSnapshots', merged);
                        resolve(Object.keys(imported).length);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }

        // 从当前页面提取帖子数据
        static extractPostData() {
            // 提取帖子ID
            const match = window.location.pathname.match(/\/post-(\d+)-/);
            if (!match) return null;

            const postId = match[1];

            // 查找第一个 content-item（主帖，floor #0）
            const mainPost = document.querySelector('#\\30, .content-item[id="0"]') || document.querySelector('.content-item');
            if (!mainPost) return null;

            // 提取标题
            const titleElement = document.querySelector('.post-title h1 a, .post-title-link');
            const title = titleElement ? titleElement.textContent.trim() : '无标题';

            // 提取内容 - 使用 article.post-content
            const contentElement = mainPost.querySelector('article.post-content');
            const content = contentElement ? contentElement.innerHTML : '';

            // 提取作者信息
            const authorElement = mainPost.querySelector('.author-info .author-name, .nsk-content-meta-info .author-name');
            const author = authorElement ? authorElement.textContent.trim() : '未知作者';
            const authorLink = mainPost.querySelector('.author-info a[href^="/space/"], .nsk-content-meta-info a[href^="/space/"]');
            const authorMatch = authorLink ? authorLink.href.match(/\/space\/(\d+)/) : null;
            const authorId = authorMatch ? authorMatch[1] : '';

            // 提取作者头像
            const avatarElement = mainPost.querySelector('.avatar-wrapper img, img.avatar-normal');
            const authorAvatar = avatarElement ? avatarElement.src : `/avatar/${authorId}.png`;

            // 提取发布时间
            const timeElement = mainPost.querySelector('time');
            const createdAt = timeElement ? timeElement.getAttribute('title') || timeElement.textContent.trim() : '';

            console.log('提取的帖子数据:', {
                id: postId,
                title,
                author,
                authorId,
                authorAvatar,
                createdAt,
                contentLength: content.length,
                contentPreview: content.substring(0, 100)
            });

            if (!content) {
                console.warn('警告：内容为空！');
                console.log('mainPost:', mainPost);
                console.log('contentElement:', contentElement);
            }

            return {
                id: postId,
                title,
                content,
                author,
                authorId,
                authorAvatar,
                createdAt,
                type: 'post'
            };
        }

        // 创建快照列表页面
        static createSnapshotListPage() {
            const snapshots = this.getAllSnapshots();
            const snapshotArray = Object.values(snapshots).sort((a, b) => b.savedAt - a.savedAt);

            const html = `
                <div style="max-width: 1200px; margin: 20px auto; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h1 style="margin: 0;">我的快照 (<span id="snapshot-count">${snapshotArray.length}</span>)</h1>
                        <div>
                            <button id="import-snapshots-btn" style="
                                padding: 10px 20px;
                                background: #3498db;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                margin-right: 10px;
                            ">导入快照</button>
                            <button id="export-snapshots-btn" style="
                                padding: 10px 20px;
                                background: #2ecc71;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            ">导出快照</button>
                            <input type="file" id="import-file-input" accept=".json" style="display: none;">
                        </div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <input type="text" id="snapshot-search-input" placeholder="搜索快照标题或内容..." style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                    </div>
                    <div id="snapshots-list">
                        ${snapshotArray.length === 0 ?
                            '<p style="text-align: center; color: #999; padding: 40px;">暂无快照</p>' :
                            snapshotArray.map(snapshot => {
                                // 提取纯文本内容（去除HTML标签）
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = snapshot.content || '';
                                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                                const preview = textContent.trim().substring(0, 30) + (textContent.length > 30 ? '...' : '');
                                
                                // 构建原帖链接
                                const postUrl = snapshot.url || '';
                                const typeLabel = snapshot.type === 'comment' ? '💬 评论' : '📝 帖子';
                                
                                return `
                                <div class="snapshot-item" data-id="${snapshot.id}" style="
                                    border: 1px solid #ddd;
                                    border-radius: 8px;
                                    padding: 15px;
                                    margin-bottom: 15px;
                                    background: white;
                                ">
                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                        <div style="flex: 1;">
                                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                                <h3 style="margin: 0; flex: 1;">
                                                    <a href="#" class="view-snapshot" data-id="${snapshot.id}" style="color: #333; text-decoration: none; hover: color: #3498db;">
                                                        ${snapshot.title}
                                                    </a>
                                                </h3>
                                                ${postUrl ? `<a href="${postUrl}" target="_blank" style="
                                                    padding: 4px 10px;
                                                    background: #3498db;
                                                    color: white;
                                                    text-decoration: none;
                                                    border-radius: 4px;
                                                    font-size: 12px;
                                                    white-space: nowrap;
                                                " title="在新窗口打开原帖">🔗 原帖</a>` : ''}
                                            </div>
                                            <div style="font-size: 13px; color: #666; margin-bottom: 8px; line-height: 1.5;">
                                                ${preview}
                                            </div>
                                            <div style="font-size: 12px; color: #999;">
                                                <span style="color: ${snapshot.type === 'comment' ? '#e67e22' : '#3498db'};">${typeLabel}</span>
                                                <span style="margin: 0 5px;">•</span>
                                                <span>作者: ${snapshot.author}</span>
                                                <span style="margin: 0 5px;">•</span>
                                                <span>发布: ${snapshot.createdAt}</span>
                                                <span style="margin: 0 5px;">•</span>
                                                <span>保存: ${new Date(snapshot.savedAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button class="delete-snapshot" data-id="${snapshot.id}" style="
                                            padding: 5px 15px;
                                            background: #e74c3c;
                                            color: white;
                                            border: none;
                                            border-radius: 4px;
                                            cursor: pointer;
                                            margin-left: 15px;
                                        ">删除</button>
                                    </div>
                                </div>
                            `;
                            }).join('')
                        }
                    </div>
                </div>
            `;

            return html;
        }

        // 创建快照详情页面
        static createSnapshotDetailPage(postId) {
            const snapshot = this.getSnapshot(postId);
            if (!snapshot) {
                return '<div style="text-align: center; padding: 40px;">快照不存在</div>';
            }

            const typeLabel = snapshot.type === 'comment' ? '评论快照' : '帖子快照';
            const avatarUrl = snapshot.authorAvatar || `/avatar/${snapshot.authorId}.png`;

            const html = `
                <div style="max-width: 900px; margin: 20px auto; padding: 20px;">
                    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <a href="#snapshots" style="color: #3498db; text-decoration: none;">← 返回快照列表</a>
                        <button id="save-images-to-nodeimage" data-snapshot-id="${snapshot.id}" style="
                            padding: 8px 16px;
                            background: #2ecc71;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                        ">💾 保存图片到图床</button>
                    </div>
                    <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #eee;">
                            <a href="/space/${snapshot.authorId}" target="_blank" style="text-decoration: none;">
                                <img src="${avatarUrl}" alt="${snapshot.author}" style="
                                    width: 48px;
                                    height: 48px;
                                    border-radius: 50%;
                                    margin-right: 15px;
                                ">
                            </a>
                            <div style="flex: 1;">
                                <h1 style="margin: 0 0 8px 0; font-size: 24px;">${snapshot.title}</h1>
                                <div style="font-size: 14px; color: #999;">
                                    <a href="/space/${snapshot.authorId}" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 500;">
                                        ${snapshot.author}
                                    </a>
                                    <span style="margin: 0 8px;">•</span>
                                    <span>${typeLabel}</span>
                                    <span style="margin: 0 8px;">•</span>
                                    <span>发布: ${snapshot.createdAt}</span>
                                    <span style="margin: 0 8px;">•</span>
                                    <span>保存: ${new Date(snapshot.savedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div class="post-content" id="snapshot-content-${snapshot.id}" style="line-height: 1.8; font-size: 15px;">
                            ${snapshot.content}
                        </div>
                    </div>
                </div>
            `;

            return html;
        }

        // 添加"我的快照"按钮
        static addSnapshotButton() {
            // 查找发帖按钮
            const newDiscussionBtn = document.querySelector('.btn.new-discussion, a[href="/new-discussion"]');
            if (!newDiscussionBtn) return;

            // 检查是否已添加
            if (document.querySelector('.snapshot-button')) return;

            // 创建按钮容器
            const container = document.createElement('div');
            container.style.cssText = 'margin-top: 10px;';

            // 创建按钮
            const button = document.createElement('a');
            button.className = 'snapshot-button btn new-discussion';
            button.href = 'javascript:void(0)';
            button.style.cssText = `
                display: block;
                background: #9b59b6;
                text-align: center;
            `;
            button.innerHTML = `
                <svg class="iconpark-icon"><use href="#folder-focus"></use></svg>
                <span style="vertical-align: middle;">我的快照</span>
            `;

            button.onclick = () => this.showSnapshotList();

            container.appendChild(button);
            newDiscussionBtn.parentElement.insertAdjacentElement('afterend', container);
        }

        // 添加"保存快照"按钮（帖子详情页和评论）
        static addSaveSnapshotButton() {
            // 检查是否在帖子详情页
            if (!/\/post-\d+-/.test(window.location.pathname)) return;

            // 为主帖添加按钮（立即执行）
            setTimeout(() => this.addSnapshotButtonToPost(), 500);

            // 为评论添加按钮（使用懒加载）
            this.addSnapshotButtonToCommentsLazy();
        }

        // 为主帖添加快照按钮
        static addSnapshotButtonToPost() {
            // 查找主帖的楼层号链接
            const firstContentItem = document.querySelector('.content-item');
            if (!firstContentItem) return;
            
            const floorLink = firstContentItem.querySelector('.floor-link');
            if (!floorLink) return;

            // 检查是否已添加
            if (floorLink.previousElementSibling?.classList.contains('save-snapshot-btn')) return;

            // 提取帖子ID
            const match = window.location.pathname.match(/\/post-(\d+)-/);
            if (!match) return;
            const postId = match[1];

            // 检查是否已保存
            const isSaved = this.getSnapshot(postId) !== null;

            const button = document.createElement('button');
            button.className = 'save-snapshot-btn';
            button.textContent = isSaved ? '✅' : '💾';
            button.title = isSaved ? '已保存快照' : '保存快照';
            button.style.cssText = `
                padding: 2px 8px;
                margin-right: 8px;
                background: ${isSaved ? '#2ecc71' : '#3498db'};
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.3s;
                vertical-align: middle;
                white-space: nowrap;
            `;

            button.onmouseover = () => button.style.background = isSaved ? '#27ae60' : '#2980b9';
            button.onmouseout = () => button.style.background = isSaved ? '#2ecc71' : '#3498db';
            button.onclick = () => {
                const postData = this.extractPostData();
                if (postData) {
                    this.saveSnapshot(postData);
                    button.textContent = '✅';
                    button.title = '已保存快照';
                    button.style.background = '#2ecc71';
                }
            };

            floorLink.insertAdjacentElement('beforebegin', button);
        }

        // 为评论添加快照按钮（懒加载）
        static addSnapshotButtonToCommentsLazy() {
            // 创建 IntersectionObserver 用于懒加载
            const intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const comment = entry.target;
                        intersectionObserver.unobserve(comment);
                        this.addSnapshotButtonToComment(comment);
                    }
                });
            }, {
                rootMargin: '100px'
            });
            
            // 观察现有评论
            const observeComments = () => {
                const comments = document.querySelectorAll('.content-item');
                comments.forEach((comment, index) => {
                    // 跳过第一个（主帖）
                    if (index === 0) return;
                    // 跳过已经添加按钮的评论
                    if (comment.querySelector('.save-comment-snapshot-btn')) return;
                    intersectionObserver.observe(comment);
                });
            };
            
            // 初始观察
            observeComments();
            
            // 创建 MutationObserver 监听新加载的评论
            const mutationObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        // 检查是否有新的评论节点
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // 元素节点
                                // 检查节点本身是否是评论
                                if (node.classList && node.classList.contains('content-item')) {
                                    intersectionObserver.observe(node);
                                }
                                // 检查节点内是否包含评论
                                const newComments = node.querySelectorAll ? node.querySelectorAll('.content-item') : [];
                                newComments.forEach(comment => {
                                    if (!comment.querySelector('.save-comment-snapshot-btn')) {
                                        intersectionObserver.observe(comment);
                                    }
                                });
                            }
                        });
                    }
                }
            });
            
            // 观察评论容器的变化
            const commentContainer = document.querySelector('.post-content-wrapper, .post-detail, main');
            if (commentContainer) {
                mutationObserver.observe(commentContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }

        // 为单个评论添加快照按钮
        static addSnapshotButtonToComment(comment) {
            // 检查是否已添加
            if (comment.querySelector('.save-comment-snapshot-btn')) return;

            // 查找楼层号链接
            const floorLink = comment.querySelector('.floor-link');
            if (!floorLink) return;

            // 提取评论ID
            const commentId = comment.id || comment.getAttribute('id');
            if (!commentId) return;

            const button = document.createElement('button');
            button.className = 'save-comment-snapshot-btn';
            button.textContent = '💾';
            button.title = '保存评论快照';
            button.style.cssText = `
                padding: 2px 8px;
                margin-right: 8px;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 11px;
                cursor: pointer;
                transition: background 0.3s;
                vertical-align: middle;
                white-space: nowrap;
            `;

            button.onmouseover = () => button.style.background = '#2980b9';
            button.onmouseout = () => button.style.background = '#3498db';
            button.onclick = () => {
                const commentData = this.extractCommentData(comment, commentId);
                if (commentData) {
                    this.saveSnapshot(commentData);
                    button.textContent = '✅';
                    button.title = '已保存快照';
                    button.style.background = '#2ecc71';
                }
            };

            floorLink.insertAdjacentElement('beforebegin', button);
        }

        // 提取评论数据
        static extractCommentData(commentElement, commentId) {
            const match = window.location.pathname.match(/\/post-(\d+)-/);
            if (!match) return null;

            const postId = match[1];

            // 提取评论内容 - 使用 article.post-content
            const contentElement = commentElement.querySelector('article.post-content');
            const content = contentElement ? contentElement.innerHTML : '';

            // 提取作者信息
            const authorElement = commentElement.querySelector('.author-info .author-name, .nsk-content-meta-info .author-name');
            const author = authorElement ? authorElement.textContent.trim() : '未知作者';
            const authorLink = commentElement.querySelector('.author-info a[href^="/space/"], .nsk-content-meta-info a[href^="/space/"]');
            const authorMatch = authorLink ? authorLink.href.match(/\/space\/(\d+)/) : null;
            const authorId = authorMatch ? authorMatch[1] : '';

            // 提取作者头像
            const avatarElement = commentElement.querySelector('.avatar-wrapper img, img.avatar-normal');
            const authorAvatar = avatarElement ? avatarElement.src : `/avatar/${authorId}.png`;

            // 提取时间
            const timeElement = commentElement.querySelector('time');
            const createdAt = timeElement ? timeElement.getAttribute('title') || timeElement.textContent.trim() : '';

            // 获取主帖标题
            const mainTitle = document.querySelector('.post-title h1 a, .post-title-link');
            const mainTitleText = mainTitle ? mainTitle.textContent.trim() : '未知帖子';

            // 获取楼层号（从 id 属性或 floor-link 获取）
            const floorId = commentElement.id || commentElement.getAttribute('id');
            const floorLink = commentElement.querySelector('.floor-link');
            const floorNumber = floorLink ? floorLink.textContent.trim() : (floorId || '');
            
            // 构建评论URL（包含楼层锚点）
            const commentUrl = `${window.location.origin}${window.location.pathname}${floorNumber}`;

            console.log('提取的评论数据:', { 
                id: `${postId}-${commentId}`, 
                title: `${mainTitleText} - ${author}的评论`, 
                author, 
                authorId, 
                authorAvatar, 
                createdAt, 
                floorNumber,
                url: commentUrl,
                contentLength: content.length 
            });

            return {
                id: `${postId}-${commentId}`,
                title: `${mainTitleText} - ${author}的评论`,
                content,
                author,
                authorId,
                authorAvatar,
                createdAt,
                type: 'comment',
                url: commentUrl
            };
        }

        // 显示快照列表
        static showSnapshotList() {
            const overlay = document.createElement('div');
            overlay.id = 'snapshot-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                overflow-y: auto;
            `;

            const container = document.createElement('div');
            container.className = 'snapshot-detail-container';
            container.style.cssText = `
                background: #f5f5f5;
                min-height: 100vh;
            `;

            container.innerHTML = this.createSnapshotListPage();
            overlay.appendChild(container);
            document.body.appendChild(overlay);

            // 关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕ 关闭';
            closeBtn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                z-index: 10001;
            `;
            closeBtn.onclick = () => overlay.remove();
            overlay.appendChild(closeBtn);

            // 绑定事件
            this.bindSnapshotListEvents(overlay);
        }

        // 过滤快照
        static filterSnapshots(keyword, overlay) {
            const snapshots = this.getAllSnapshots();
            const snapshotArray = Object.values(snapshots).sort((a, b) => b.savedAt - a.savedAt);
            const lowerKeyword = keyword.toLowerCase().trim();

            let filteredSnapshots = snapshotArray;
            if (lowerKeyword) {
                filteredSnapshots = snapshotArray.filter(snapshot => {
                    const titleMatch = (snapshot.title || '').toLowerCase().includes(lowerKeyword);
                    const contentMatch = (snapshot.content || '').toLowerCase().includes(lowerKeyword);
                    const authorMatch = (snapshot.author || '').toLowerCase().includes(lowerKeyword);
                    return titleMatch || contentMatch || authorMatch;
                });
            }

            // 更新列表
            const listContainer = overlay.querySelector('#snapshots-list');
            const countElement = overlay.querySelector('#snapshot-count');

            if (countElement) {
                countElement.textContent = filteredSnapshots.length;
            }

            if (filteredSnapshots.length === 0) {
                listContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">未找到匹配的快照</p>';
            } else {
                listContainer.innerHTML = filteredSnapshots.map(snapshot => {
                    // 提取纯文本内容（去除HTML标签）
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = snapshot.content || '';
                    const textContent = tempDiv.textContent || tempDiv.innerText || '';
                    const preview = textContent.trim().substring(0, 30) + (textContent.length > 30 ? '...' : '');
                    
                    // 构建原帖链接
                    const postUrl = snapshot.url || '';
                    const typeLabel = snapshot.type === 'comment' ? '💬 评论' : '📝 帖子';
                    
                    return `
                    <div class="snapshot-item" data-id="${snapshot.id}" style="
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 15px;
                        background: white;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <h3 style="margin: 0; flex: 1;">
                                        <a href="#" class="view-snapshot" data-id="${snapshot.id}" style="color: #333; text-decoration: none;">
                                            ${snapshot.title}
                                        </a>
                                    </h3>
                                    ${postUrl ? `<a href="${postUrl}" target="_blank" style="
                                        padding: 4px 10px;
                                        background: #3498db;
                                        color: white;
                                        text-decoration: none;
                                        border-radius: 4px;
                                        font-size: 12px;
                                        white-space: nowrap;
                                    " title="在新窗口打开原帖">🔗 原帖</a>` : ''}
                                </div>
                                <div style="font-size: 13px; color: #666; margin-bottom: 8px; line-height: 1.5;">
                                    ${preview}
                                </div>
                                <div style="font-size: 12px; color: #999;">
                                    <span style="color: ${snapshot.type === 'comment' ? '#e67e22' : '#3498db'};">${typeLabel}</span>
                                    <span style="margin: 0 5px;">•</span>
                                    <span>作者: ${snapshot.author}</span>
                                    <span style="margin: 0 5px;">•</span>
                                    <span>发布: ${snapshot.createdAt}</span>
                                    <span style="margin: 0 5px;">•</span>
                                    <span>保存: ${new Date(snapshot.savedAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <button class="delete-snapshot" data-id="${snapshot.id}" style="
                                padding: 5px 15px;
                                background: #e74c3c;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                margin-left: 15px;
                            ">删除</button>
                        </div>
                    </div>
                `;
                }).join('');

                // 重新绑定查看和删除事件
                listContainer.querySelectorAll('.view-snapshot').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const postId = e.target.dataset.id;
                        this.showSnapshotDetail(postId, overlay);
                    });
                });

                listContainer.querySelectorAll('.delete-snapshot').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const postId = e.target.dataset.id;
                        const snapshot = this.getSnapshot(postId);
                        const hasImages = snapshot && snapshot.uploadedImageIds && snapshot.uploadedImageIds.length > 0;
                        
                        const confirmMsg = hasImages 
                            ? `确定要删除这个快照吗？\n\n此快照包含 ${snapshot.uploadedImageIds.length} 张已上传到图床的图片，\n删除快照时会同时删除这些图片。`
                            : '确定要删除这个快照吗？';
                        
                        if (confirm(confirmMsg)) {
                            const deleteBtn = e.target;
                            deleteBtn.textContent = '删除中...';
                            deleteBtn.disabled = true;
                            
                            await this.deleteSnapshot(postId);
                            overlay.remove();
                            this.showSnapshotList();
                        }
                    });
                });
            }
        }

        // 绑定快照列表事件
        static bindSnapshotListEvents(overlay) {
            // 搜索功能
            const searchInput = overlay.querySelector('#snapshot-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.filterSnapshots(e.target.value, overlay);
                });
            }

            // 导出按钮
            overlay.querySelector('#export-snapshots-btn')?.addEventListener('click', () => {
                this.exportSnapshots();
            });

            // 导入按钮
            overlay.querySelector('#import-snapshots-btn')?.addEventListener('click', () => {
                overlay.querySelector('#import-file-input').click();
            });

            // 文件选择
            overlay.querySelector('#import-file-input')?.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const count = await this.importSnapshots(file);
                        alert(`成功导入 ${count} 个快照`);
                        overlay.remove();
                        this.showSnapshotList();
                    } catch (error) {
                        alert('导入失败: ' + error.message);
                    }
                }
            });

            // 查看快照
            overlay.querySelectorAll('.view-snapshot').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const postId = e.target.dataset.id;
                    this.showSnapshotDetail(postId, overlay);
                });
            });

            // 删除快照
            overlay.querySelectorAll('.delete-snapshot').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const postId = e.target.dataset.id;
                    const snapshot = this.getSnapshot(postId);
                    const hasImages = snapshot && snapshot.uploadedImageIds && snapshot.uploadedImageIds.length > 0;
                    
                    const confirmMsg = hasImages 
                        ? `确定要删除这个快照吗？\n\n此快照包含 ${snapshot.uploadedImageIds.length} 张已上传到图床的图片，\n删除快照时会同时删除这些图片。`
                        : '确定要删除这个快照吗？';
                    
                    if (confirm(confirmMsg)) {
                        const deleteBtn = e.target;
                        deleteBtn.textContent = '删除中...';
                        deleteBtn.disabled = true;
                        
                        await this.deleteSnapshot(postId);
                        overlay.remove();
                        this.showSnapshotList();
                    }
                });
            });
        }

        // 保存快照中的图片到NodeImage
        static async saveImagesToNodeImage(snapshotId) {
            const snapshot = this.getSnapshot(snapshotId);
            if (!snapshot) {
                alert('快照不存在');
                return;
            }

            // 检查API Key
            let apiKey = GM_getValue('nodeimage_apiKey', '');

            if (!apiKey) {
                const userInput = prompt(
                    '请输入NodeImage API Key\n\n' +
                    '你可以在 https://www.nodeimage.com 登录后，\n' +
                    '在个人设置中找到API Key\n\n' +
                    '提示：也可以通过油猴菜单设置API Key'
                );

                if (!userInput || userInput.trim() === '') {
                    alert('未提供API Key，操作已取消');
                    return;
                }

                apiKey = userInput.trim();
                GM_setValue('nodeimage_apiKey', apiKey);
            }

            const button = document.querySelector('#save-images-to-nodeimage');
            if (!button) return;

            // 创建临时div来解析HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = snapshot.content;

            // 提取所有图片
            const images = tempDiv.querySelectorAll('img');
            if (images.length === 0) {
                alert('快照中没有图片');
                return;
            }

            // 创建进度显示元素
            const progressDiv = document.createElement('div');
            progressDiv.style.cssText = `
                margin-top: 10px;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 4px;
                font-size: 14px;
            `;
            button.parentElement.insertBefore(progressDiv, button.nextSibling);

            button.textContent = `⏳ 准备处理 ${images.length} 张图片...`;
            button.disabled = true;

            let successCount = 0;
            let failCount = 0;
            let failedImages = [];
            let uploadedImageIds = snapshot.uploadedImageIds || []; // 获取已上传的图片ID列表

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const originalSrc = img.src;

                // 更新进度
                button.textContent = `⏳ 正在处理 ${i + 1}/${images.length} 张图片...`;
                progressDiv.innerHTML = `
                    <div style="margin-bottom: 5px;">
                        <strong>进度：</strong>${i + 1}/${images.length}
                    </div>
                    <div style="margin-bottom: 5px;">
                        <span style="color: #2ecc71;">✅ 成功：${successCount}</span>
                        <span style="margin-left: 15px; color: #e74c3c;">❌ 失败：${failCount}</span>
                    </div>
                    <div style="background: #ddd; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: #2ecc71; height: 100%; width: ${((i + 1) / images.length * 100).toFixed(1)}%; transition: width 0.3s;"></div>
                    </div>
                `;

                try {
                    // 使用 GM_xmlhttpRequest 下载图片（绕过CORS）
                    const blob = await this.downloadImage(originalSrc);
                    
                    // 确定文件扩展名和MIME类型
                    let extension = 'png';
                    let mimeType = blob.type || 'image/png';
                    
                    // 从blob类型获取扩展名
                    if (blob.type) {
                        const typeMatch = blob.type.match(/image\/(.*)/);
                        if (typeMatch) {
                            extension = typeMatch[1];
                        }
                    }
                    
                    // 从URL获取扩展名（如果blob类型不可用）
                    if (!blob.type || blob.type === 'application/octet-stream') {
                        const urlMatch = originalSrc.match(/\.([a-z0-9]+)(?:\?|$)/i);
                        if (urlMatch) {
                            extension = urlMatch[1].toLowerCase();
                            // 映射常见扩展名到MIME类型
                            const mimeMap = {
                                'jpg': 'image/jpeg',
                                'jpeg': 'image/jpeg',
                                'png': 'image/png',
                                'gif': 'image/gif',
                                'webp': 'image/webp',
                                'avif': 'image/avif',
                                'svg': 'image/svg+xml'
                            };
                            mimeType = mimeMap[extension] || 'image/png';
                        }
                    }
                    
                    // 验证是否是支持的图片格式
                    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];
                    if (!supportedFormats.includes(extension.toLowerCase())) {
                        console.warn(`[图片 ${i + 1}] 不支持的格式: ${extension}, 跳过`);
                        failCount++;
                        failedImages.push({ index: i + 1, src: originalSrc, error: `不支持的图片格式: ${extension}` });
                        continue;
                    }
                    
                    // 创建File对象，确保有正确的MIME类型
                    const file = new File([blob], `image-${i}.${extension}`, { type: mimeType });
                    
                    console.log(`[图片 ${i + 1}] 准备上传 - 文件名: ${file.name}, MIME类型: ${file.type}, 大小: ${(file.size / 1024).toFixed(2)}KB`);

                    // 上传到NodeImage
                    const result = await this.uploadToNodeImage(file, apiKey);

                    if (result.success) {
                        // 替换图片链接
                        img.src = result.url;
                        // 记录上传的图片ID
                        if (result.imageId) {
                            uploadedImageIds.push(result.imageId);
                        }
                        successCount++;
                    } else {
                        failCount++;
                        failedImages.push({ index: i + 1, src: originalSrc, error: result.error });
                        console.error(`图片 ${i + 1} 上传失败:`, result.error);

                        // 检查是否是API Key错误
                        if (result.error && (
                            result.error.includes('API') ||
                            result.error.includes('unauthorized') ||
                            result.error.includes('invalid')
                        )) {
                            alert(`API Key无效或已过期：${result.error}\n\n操作已取消，请在油猴菜单中重新设置API Key`);
                            button.textContent = '❌ API Key无效';
                            button.disabled = false;
                            progressDiv.remove();
                            return;
                        }
                    }
                } catch (error) {
                    failCount++;
                    failedImages.push({ index: i + 1, src: originalSrc, error: error.message });
                    console.error(`图片 ${i + 1} 处理失败:`, error);
                }
            }

            // 更新快照内容和图片ID列表
            snapshot.content = tempDiv.innerHTML;
            snapshot.uploadedImageIds = uploadedImageIds;
            const snapshots = this.getAllSnapshots();
            snapshots[snapshotId] = snapshot;
            GM_setValue('postSnapshots', snapshots);

            // 更新显示
            const contentElement = document.querySelector(`#snapshot-content-${snapshotId}`);
            if (contentElement) {
                contentElement.innerHTML = snapshot.content;
            }

            // 显示完成结果
            const totalImages = images.length;
            button.textContent = `✅ 完成！成功 ${successCount}/${totalImages}`;
            button.disabled = false;

            // 更新进度显示为最终结果
            progressDiv.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold; color: ${failCount > 0 ? '#e67e22' : '#2ecc71'};">
                    ${failCount > 0 ? '⚠️ 处理完成（部分失败）' : '✅ 全部处理成功！'}
                </div>
                <div style="margin-bottom: 5px;">
                    <span style="color: #2ecc71;">✅ 成功：${successCount} 张</span>
                    <span style="margin-left: 15px; color: #e74c3c;">❌ 失败：${failCount} 张</span>
                </div>
                ${failCount > 0 ? `
                    <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                        <div style="font-weight: bold; margin-bottom: 5px;">失败的图片：</div>
                        ${failedImages.map(img => `<div style="font-size: 12px; color: #666;">• 图片 ${img.index}: ${img.error}</div>`).join('')}
                        <div style="margin-top: 10px; color: #e67e22;">
                            💡 提示：可以再次点击"保存图片到图床"按钮重试失败的图片
                        </div>
                    </div>
                ` : ''}
            `;

            // 5秒后恢复按钮文本
            setTimeout(() => {
                button.textContent = '💾 保存图片到图床';
                if (failCount === 0) {
                    progressDiv.remove();
                }
            }, 5000);
        }

        // 下载图片（使用GM_xmlhttpRequest绕过CORS）
        static async downloadImage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: (response) => {
                        if (response.status === 200) {
                            resolve(response.response);
                        } else {
                            reject(new Error(`下载失败: ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`下载失败: ${error}`));
                    }
                });
            });
        }

        // 从NodeImage删除图片
        static async deleteImageFromNodeImage(imageId, apiKey) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'DELETE',
                    url: `https://api.nodeimage.com/api/v1/delete/${imageId}`,
                    headers: {
                        'X-API-Key': apiKey
                    },
                    onload: (response) => {
                        try {
                            const result = JSON.parse(response.responseText);
                            resolve(result.success || response.status === 200);
                        } catch (error) {
                            // 如果返回204或其他成功状态码
                            resolve(response.status >= 200 && response.status < 300);
                        }
                    },
                    onerror: () => resolve(false) // 删除失败不影响快照删除
                });
            });
        }

        // 上传图片到NodeImage
        static async uploadToNodeImage(file, apiKey) {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                // 确保文件名和类型都正确
                formData.append('image', file, file.name);
                
                console.log('[上传请求] 文件名:', file.name, '类型:', file.type, '大小:', file.size);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.nodeimage.com/api/upload',
                    headers: {
                        'X-API-Key': apiKey
                        // 不要手动设置 Content-Type，让浏览器自动设置 multipart/form-data
                    },
                    data: formData,
                    onload: (response) => {
                        // 检查HTTP状态码
                        if (response.status !== 200) {
                            console.error('[上传失败] HTTP状态:', response.status);
                            console.error('[上传失败] 响应内容:', response.responseText.substring(0, 500));
                            
                            // 尝试从HTML响应中提取错误信息
                            let errorMsg = response.statusText || '上传失败';
                            const errorMatch = response.responseText.match(/Error:\s*([^<\n]+)/);
                            if (errorMatch) {
                                errorMsg = errorMatch[1].trim();
                            }
                            
                            resolve({ 
                                success: false, 
                                error: errorMsg
                            });
                            return;
                        }

                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.success) {
                                resolve({
                                    success: true,
                                    url: result.links.direct,
                                    imageId: result.image_id || result.id // 记录图片ID
                                });
                            } else {
                                resolve({ success: false, error: result.error || '上传失败' });
                            }
                        } catch (error) {
                            console.error('[上传失败] JSON解析错误:', error);
                            console.error('[上传失败] 响应内容:', response.responseText.substring(0, 200));
                            resolve({ 
                                success: false, 
                                error: `服务器返回了无效的响应（可能是API Key错误或服务器问题）` 
                            });
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`网络错误: ${error}`));
                    }
                });
            });
        }

        // 显示快照详情
        static showSnapshotDetail(postId, overlay) {
            // 查找容器，使用多种方式
            let container = overlay.querySelector('.snapshot-detail-container');
            if (!container) {
                container = overlay.querySelector('div[style*="background"]');
            }
            if (!container) {
                // 如果还是找不到，使用 overlay 的第一个子元素
                container = overlay.firstElementChild;
            }

            if (!container) {
                console.error('无法找到快照详情容器');
                return;
            }

            container.innerHTML = this.createSnapshotDetailPage(postId);

            // 返回按钮
            const backLink = container.querySelector('a[href="#snapshots"]');
            if (backLink) {
                backLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    overlay.remove();
                    this.showSnapshotList();
                });
            }

            // 保存图片按钮
            const saveImagesBtn = container.querySelector('#save-images-to-nodeimage');
            if (saveImagesBtn) {
                saveImagesBtn.addEventListener('click', () => {
                    const snapshotId = saveImagesBtn.dataset.snapshotId;
                    this.saveImagesToNodeImage(snapshotId);
                });
            }
        }
    }

    // ==================== 收藏夹搜索 ====================
    class CollectionSearch {
        // 从HTML中提取当前用户ID
        static getCurrentUserId() {
            const userStyleLink = document.querySelector('link[href*="/userstyle/"]');
            if (userStyleLink) {
                const match = userStyleLink.href.match(/\/userstyle\/(\d+)\.css/);
                if (match) return match[1];
            }
            return null;
        }

        // 获取所有收藏的帖子（分页获取）
        static async fetchAllCollections() {
            const collections = [];
            let page = 1;

            while (true) {
                try {
                    const apiUrl = CURRENT_SITE
                        ? `https://${CURRENT_SITE.host}/api/statistics/list-collection?page=${page}`
                        : `https://www.nodeseek.com/api/statistics/list-collection?page=${page}`;

                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });

                    if (!response.ok) break;

                    const data = await response.json();

                    // API 返回的是 collections 字段
                    if (data.success && data.collections && data.collections.length > 0) {
                        collections.push(...data.collections);
                        page++;
                    } else {
                        // 没有数据了，停止搜索
                        break;
                    }
                } catch (error) {
                    console.error(`获取收藏夹第${page}页失败:`, error);
                    break;
                }
            }

            return collections;
        }

        // 搜索收藏夹
        static async searchCollections(keyword) {
            if (!keyword || keyword.trim() === '') {
                return [];
            }

            const collections = await this.fetchAllCollections();
            const lowerKeyword = keyword.toLowerCase();

            return collections.filter(item => {
                const title = (item.title || '').toLowerCase();
                return title.includes(lowerKeyword);
            });
        }

        // 创建搜索框UI
        static createSearchBox() {
            // 查找发帖按钮
            const newDiscussionBtn = document.querySelector('.btn.new-discussion, a[href="/new-discussion"]');
            if (!newDiscussionBtn) {
                console.log('[收藏夹搜索] 未找到发帖按钮');
                return;
            }

            // 检查是否已经添加过
            if (document.querySelector('.collection-search-box')) {
                return;
            }

            // 创建容器
            const container = document.createElement('div');
            container.className = 'collection-search-box';
            container.style.cssText = `
                display: block;
                margin-bottom: 10px;
                padding: 0;
                position: relative;
                width: 100%;
            `;

            // 创建搜索输入框
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '搜索收藏...';
            input.style.cssText = `
                height: 36px;
                padding: 0 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                width: 100%;
                outline: none;
                box-sizing: border-box;
            `;

            // 创建结果容器
            const resultsBox = document.createElement('div');
            resultsBox.className = 'collection-search-results';
            resultsBox.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-top: 5px;
                max-height: 400px;
                overflow-y: auto;
                display: none;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;

            // 搜索处理
            let searchTimeout;
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const keyword = e.target.value.trim();

                if (keyword === '') {
                    resultsBox.style.display = 'none';
                    return;
                }

                searchTimeout = setTimeout(async () => {
                    resultsBox.innerHTML = '<div style="padding: 10px; text-align: center; color: #999;">搜索中...</div>';
                    resultsBox.style.display = 'block';

                    const results = await this.searchCollections(keyword);

                    if (results.length === 0) {
                        resultsBox.innerHTML = '<div style="padding: 10px; text-align: center; color: #999;">未找到相关收藏</div>';
                    } else {
                        resultsBox.innerHTML = results.map(item => `
                            <a href="/post-${item.post_id}-1" style="
                                display: block;
                                padding: 10px;
                                border-bottom: 1px solid #f0f0f0;
                                color: #333;
                                text-decoration: none;
                                transition: background 0.2s;
                            " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                                <div style="
                                    font-size: 14px;
                                    font-weight: 500;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                ">${item.title || '无标题'}</div>
                            </a>
                        `).join('');
                    }
                }, 300);
            });

            // 点击外部关闭结果框
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    resultsBox.style.display = 'none';
                }
            });

            container.appendChild(input);
            container.appendChild(resultsBox);

            // 插入到发帖按钮前面
            newDiscussionBtn.parentElement.insertBefore(container, newDiscussionBtn.parentElement.firstChild);
        }
    }

    // ==================== UI 增强 ====================
    class UIEnhancer {
        // 创建用户信息标签
        static createUserInfoBadge(userInfo) {
            if (!userInfo) return null;

            const badge = document.createElement('span');
            badge.className = 'nodeseek-user-info';
            badge.style.cssText = `
                display: inline-block;
                margin-left: 8px;
                padding: 2px 8px;
                background: ${CONFIG.badgeBackground};
                color: ${CONFIG.badgeTextColor};
                border-radius: 10px;
                font-size: 11px;
                white-space: nowrap;
                vertical-align: middle;
                line-height: 1.5;
            `;

            // 格式化加入天数显示
            let joinText = '';
            if (userInfo.joinDays !== undefined) {
                joinText = `<span title="加入 ${userInfo.joinDays} 天" style="margin-left: 4px;">📅${userInfo.joinDays}天</span>`;
            }

            badge.innerHTML = `
                <span title="等级">⭐${userInfo.level}</span>
                <span title="主题数" style="margin-left: 4px;">📝${userInfo.topicCount}</span>
                <span title="鸡腿数" style="margin-left: 4px;">🍗${userInfo.drumstickCount}</span>
                <span title="评论数" style="margin-left: 4px;">💬${userInfo.commentCount}</span>
                ${joinText}
            `;
            return badge;
        }

        // 标记已访问的帖子
        static markVisitedPost(postElement, postId) {
            if (Storage.isPostVisited(postId)) {
                const titleElement = postElement.querySelector('.post-title a');
                if (titleElement) {
                    titleElement.style.color = CONFIG.visitedColor;
                }
            }
        }

        // 为帖子列表添加用户信息（使用 IntersectionObserver 懒加载）
        static enhancePostList() {
            // 帖子列表项选择器
            const postItems = document.querySelectorAll('.post-list-item');

            // 创建 IntersectionObserver 用于懒加载
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const postItem = entry.target;
                        // 只处理一次
                        observer.unobserve(postItem);
                        this.enhancePostItem(postItem);
                    }
                });
            }, {
                rootMargin: '100px' // 提前 100px 开始加载
            });

            // 观察所有帖子项
            postItems.forEach(postItem => {
                // 先标记已访问的帖子（不需要等待）
                const postId = this.extractPostId(postItem);
                if (postId && CONFIG.enableVisitedMark) {
                    this.markVisitedPost(postItem, postId);
                }

                // 使用 IntersectionObserver 懒加载用户信息
                if (CONFIG.enableUserInfo) {
                    observer.observe(postItem);
                }
            });
        }

        // 增强单个帖子项
        static async enhancePostItem(postItem) {
            // 检查是否已经添加过用户信息（防止重复）
            if (postItem.dataset.enhanced === 'true') {
                return;
            }

            // 标记为已处理
            postItem.dataset.enhanced = 'true';

            const userLink = postItem.querySelector('a[href^="/space/"]');
            if (userLink) {
                const userId = this.extractUserId(userLink);

                if (userId) {
                    const userInfo = await UserInfoFetcher.fetchUserInfo(userId);
                    const badge = this.createUserInfoBadge(userInfo);
                    if (badge) {
                        // 找到帖子标题的链接
                        const titleLink = postItem.querySelector('.post-title > a');
                        if (titleLink && !titleLink.nextElementSibling?.classList.contains('nodeseek-user-info')) {
                            titleLink.insertAdjacentElement('afterend', badge);
                        }
                    }
                }
            }
        }

        // 为帖子详情页添加用户信息（使用懒加载）
        static enhancePostDetail() {
            // 标记当前帖子为已访问
            const postId = this.extractPostIdFromURL();
            if (postId && CONFIG.enableVisitedMark) {
                Storage.markPostAsVisited(postId);
            }

            if (!CONFIG.enableUserInfo) return;

            // 获取所有评论项（包括主帖）
            const contentItems = document.querySelectorAll('.content-item');

            // 创建 IntersectionObserver 用于懒加载
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const contentItem = entry.target;
                        // 只处理一次
                        observer.unobserve(contentItem);
                        this.enhanceContentItem(contentItem);
                    }
                });
            }, {
                rootMargin: '100px' // 提前 100px 开始加载
            });

            // 观察所有内容项
            contentItems.forEach(contentItem => {
                if (CONFIG.enableUserInfo) {
                    observer.observe(contentItem);
                }
            });
        }

        // 增强单个内容项（帖子详情页）
        static async enhanceContentItem(contentItem) {
            // 检查是否已经添加过用户信息
            if (contentItem.dataset.enhanced === 'true') {
                return;
            }

            // 标记为已处理
            contentItem.dataset.enhanced = 'true';

            // 查找用户链接（在 .author-info 或 .nsk-content-meta-info 中）
            const userLink = contentItem.querySelector('.author-info a[href^="/space/"], .nsk-content-meta-info a[href^="/space/"]');

            if (userLink) {
                const userId = this.extractUserId(userLink);

                if (userId) {
                    const userInfo = await UserInfoFetcher.fetchUserInfo(userId);
                    const badge = this.createUserInfoBadge(userInfo);
                    if (badge) {
                        // 在用户名后面插入徽章
                        const authorInfo = contentItem.querySelector('.author-info');
                        if (authorInfo && !authorInfo.querySelector('.nodeseek-user-info')) {
                            // 找到用户名链接后插入
                            const authorNameLink = authorInfo.querySelector('a[href^="/space/"]');
                            if (authorNameLink) {
                                authorNameLink.insertAdjacentElement('afterend', badge);
                            }
                        }
                    }
                }
            }
        }

        // 辅助方法：从元素提取帖子ID
        static extractPostId(element) {
            // 从帖子标题链接提取
            const link = element.querySelector('a[href^="/post-"]');
            if (link) {
                const match = link.href.match(/\/post-(\d+)-/);
                if (match) return match[1];
            }

            return null;
        }

        // 从 URL 提取帖子ID
        static extractPostIdFromURL() {
            const match = window.location.pathname.match(/\/post-(\d+)-/);
            return match ? match[1] : null;
        }

        // 提取用户ID
        static extractUserId(userLink) {
            const match = userLink.href.match(/\/space\/(\d+)/);
            return match ? match[1] : null;
        }
    }

    // ==================== 主程序 ====================
    class NodeSeekEnhancer {
        static init() {
            const siteName = CURRENT_SITE ? CURRENT_SITE.name : 'Unknown';
            console.log(`${siteName} 增强插件已启动`);

            // 根据页面类型执行不同的增强
            if (this.isPostDetailPage()) {
                UIEnhancer.enhancePostDetail();
            } else if (this.isPostListPage()) {
                UIEnhancer.enhancePostList();
            }

            // 监听页面变化（适用于 SPA）
            this.observePageChanges();
        }

        static isPostDetailPage() {
            return /\/post-\d+-/.test(window.location.pathname);
        }

        static isPostListPage() {
            return window.location.pathname === '/' ||
                   /\/(categories|page-)/.test(window.location.pathname);
        }

        static observePageChanges() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        // 延迟执行，等待内容加载完成
                        setTimeout(() => {
                            if (this.isPostDetailPage()) {
                                UIEnhancer.enhancePostDetail();
                            } else if (this.isPostListPage()) {
                                UIEnhancer.enhancePostList();
                            }
                        }, 500);
                        break;
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // ==================== 样式注入 ====================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .post-list .post-title a:visited {
                color: ${CONFIG.visitedColor} !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== 初始化 ====================
    function initialize() {
        // 注册菜单
        MenuManager.registerMenus();

        // 注入样式
        injectStyles();

        // 启动主功能
        NodeSeekEnhancer.init();

        // 添加收藏夹搜索框
        setTimeout(() => CollectionSearch.createSearchBox(), 1000);

        // 添加快照功能
        setTimeout(() => {
            SnapshotManager.addSnapshotButton();
            SnapshotManager.addSaveSnapshotButton();
        }, 1000);

        // 延迟执行签到
        setTimeout(() => SignInManager.signIn(), 2000);
    }

    // 启动插件
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();

