// ==UserScript==
// @name         GitHub Issue 用户star和打赏标识显示
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在GitHub issue详情和列表页显示用户是否已star本repo，并标识仓库作者和打赏用户
// @author       Achuan-2
// @match        https://github.com/*/*/issues
// @match        https://github.com/*/*/issues/*
// @match        https://github.com/*/*/issues?*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @connect      api.github.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562382/GitHub%20Issue%20%E7%94%A8%E6%88%B7star%E5%92%8C%E6%89%93%E8%B5%8F%E6%A0%87%E8%AF%86%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/562382/GitHub%20Issue%20%E7%94%A8%E6%88%B7star%E5%92%8C%E6%89%93%E8%B5%8F%E6%A0%87%E8%AF%86%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ 配置区域 ============
    const GITHUB_TOKEN = ''; // 填写你的GitHub Token，如：'ghp_xxxxxxxxxxxx'
    const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 缓存过期时间：24小时
    const DISPLAY_MAX_USERS = 200; // 弹窗显示的最大用户数
    // ================================

    // 注册菜单命令
    GM_registerMenuCommand('⚙️ 设置 GitHub Token', () => {
        const token = prompt('请输入你的GitHub Token:\n\n如何获取:\n1. 访问 https://github.com/settings/tokens\n2. 点击 "Generate new token (classic)"\n3. 勾选 "public_repo" 权限\n4. 生成并复制Token', GM_getValue('github_token', ''));
        if (token !== null) {
            GM_setValue('github_token', token.trim());
            alert('Token已保存！刷新页面生效。');
        }
    });

    GM_registerMenuCommand('🗑️ 清除 GitHub Token', () => {
        if (confirm('确定要清除已保存的Token吗？')) {
            GM_setValue('github_token', '');
            alert('Token已清除！');
        }
    });

    GM_registerMenuCommand('⭐ 查看Star用户列表', () => {
        showStargazers();
    });

    GM_registerMenuCommand('🔄 手动刷新Star缓存', () => {
        getAllStargazers(true);
    });

    GM_registerMenuCommand('💰 管理打赏用户列表', () => {
        manageSponsorUsers();
    });

    GM_registerMenuCommand('📊 显示API状态', () => {
        showTokenStatus();
    });

    // 获取Token
    function getToken() {
        return GM_getValue('github_token', '') || GITHUB_TOKEN;
    }

    // 获取仓库信息
    function getRepoInfo() {
        const pathParts = window.location.pathname.split('/');
        return {
            owner: pathParts[1],
            repo: pathParts[2]
        };
    }

    // 判断当前页面类型
    function getPageType() {
        const path = window.location.pathname;

        // 匹配 /owner/repo/issues/123 格式（Issue详情页）
        if (/^\/[^\/]+\/[^\/]+\/issues\/\d+/.test(path)) {
            return 'issue-detail';
        }

        // 匹配 /owner/repo/issues 或 /owner/repo/issues/ 格式（Issue列表页）
        if (/^\/[^\/]+\/[^\/]+\/issues\/?$/.test(path)) {
            return 'issue-list';
        }

        return 'unknown';
    }

    // 检查用户是否是仓库作者
    function isRepoOwner(username) {
        const repoInfo = getRepoInfo();
        return username.toLowerCase() === repoInfo.owner.toLowerCase();
    }

    // ============ 打赏用户管理功能 ============

    // 获取打赏用户列表
    function getSponsorUsers() {
        const repoInfo = getRepoInfo();
        const key = `sponsor_users_${repoInfo.owner}_${repoInfo.repo}`;
        const cached = GM_getValue(key, '');
        if (cached) {
            return cached.split(',').map(u => u.trim().toLowerCase()).filter(u => u);
        }
        return [];
    }

    // 保存打赏用户列表
    function saveSponsorUsers(users) {
        const repoInfo = getRepoInfo();
        const key = `sponsor_users_${repoInfo.owner}_${repoInfo.repo}`;
        const uniqueUsers = [...new Set(users.map(u => u.trim().toLowerCase()))].filter(u => u);
        GM_setValue(key, uniqueUsers.join(','));
        GM_setValue(`sponsor_users_updated_${repoInfo.owner}_${repoInfo.repo}`, Date.now());
    }

    // 检查用户是否已打赏
    function isSponsorUser(username) {
        const sponsors = getSponsorUsers();
        return sponsors.includes(username.toLowerCase());
    }

    // 管理打赏用户
    function manageSponsorUsers() {
        const repoInfo = getRepoInfo();
        const current = getSponsorUsers();
        const currentText = current.length > 0 ? current.join(', ') : '暂无';

        const input = prompt(
            `📋 当前仓库: ${repoInfo.owner}/${repoInfo.repo}\n\n` +
            `💰 当前打赏用户 (${current.length}人):\n${currentText}\n\n` +
            `请输入打赏用户列表（用户名，逗号分隔）:\n` +
            `例如: user1, user2, user3\n\n` +
            `提示: 清空输入框可删除所有打赏用户`,
            current.join(', ')
        );

        if (input !== null) {
            if (input.trim() === '') {
                if (confirm('确定要清空所有打赏用户吗？')) {
                    saveSponsorUsers([]);
                    alert('✅ 已清空打赏用户列表！');
                    location.reload();
                }
            } else {
                const users = input.split(',').map(u => u.trim()).filter(u => u);
                saveSponsorUsers(users);
                alert(`✅ 已保存 ${users.length} 位打赏用户！\n\n${users.join(', ')}\n\n刷新页面生效。`);
                location.reload();
            }
        }
    }

    // ============ Star用户管理功能 ============

    // 创建自定义弹窗
    function createStargazersModal(stargazers, repoInfo, cached) {
        // 移除已存在的弹窗
        const existingModal = document.getElementById('stargazers-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const updatedTime = cached.updatedAt;
        const cacheAge = Math.floor((Date.now() - updatedTime.getTime()) / 1000 / 60);
        const cacheHours = Math.floor(cacheAge / 60);
        const cacheMinutes = cacheAge % 60;

        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.id = 'stargazers-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

        // 创建弹窗内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // 创建标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px 24px;
            border-bottom: 1px solid #e1e4e8;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        `;

        const displayCount = Math.min(stargazers.length, DISPLAY_MAX_USERS);
        const hasMore = stargazers.length > DISPLAY_MAX_USERS;

        header.innerHTML = `
            <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">⭐ Star用户列表</h2>
            <div style="font-size: 13px; opacity: 0.95; line-height: 1.6;">
                <div>📍 仓库: ${repoInfo.owner}/${repoInfo.repo}</div>
                <div>⭐ Star总数: ${stargazers.length} 人</div>
                <div>📄 显示: 前 ${displayCount} 人${hasMore ? ' (共' + stargazers.length + '人)' : ''}</div>
                <div>⏰ 更新时间: ${updatedTime.toLocaleString()}</div>
                <div>📅 缓存年龄: ${cacheHours > 0 ? `${cacheHours}小时${cacheMinutes}分钟` : `${cacheMinutes}分钟`}</div>
                ${cached.isExpired ? '<div style="color: #ffd700;">⚠️ 缓存已过期，数据可能不是最新</div>' : ''}
            </div>
        `;

        // 创建用户列表容器
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            padding: 16px 24px;
            overflow-y: auto;
            flex: 1;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        `;

        if (stargazers.length > 0) {
            const userList = document.createElement('div');
            userList.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 8px;
            `;

            const displayUsers = stargazers.slice(0, DISPLAY_MAX_USERS);
            displayUsers.forEach((username, index) => {
                const userItem = document.createElement('div');
                userItem.style.cssText = `
                    padding: 8px 12px;
                    background: #f6f8fa;
                    border-radius: 6px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                    cursor: pointer;
                `;

                userItem.innerHTML = `
                    <span style="color: #666; min-width: 30px;">${index + 1}.</span>
                    <a href="https://github.com/${username}"
                       target="_blank"
                       style="color: #0969da; text-decoration: none; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                       title="${username}">
                        ${username}
                    </a>
                `;

                userItem.addEventListener('mouseenter', () => {
                    userItem.style.background = '#e1e4e8';
                    userItem.style.transform = 'translateX(4px)';
                });

                userItem.addEventListener('mouseleave', () => {
                    userItem.style.background = '#f6f8fa';
                    userItem.style.transform = 'translateX(0)';
                });

                userList.appendChild(userItem);
            });

            listContainer.appendChild(userList);

            if (hasMore) {
                const moreInfo = document.createElement('div');
                moreInfo.style.cssText = `
                    margin-top: 16px;
                    padding: 12px;
                    background: #fff8dc;
                    border-radius: 6px;
                    text-align: center;
                    font-size: 13px;
                    color: #666;
                `;
                moreInfo.textContent = `还有 ${stargazers.length - DISPLAY_MAX_USERS} 位用户未显示，请点击复制按钮获取完整列表`;
                listContainer.appendChild(moreInfo);
            }
        } else {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                    <div style="font-size: 14px;">当前仓库暂无Star用户</div>
                </div>
            `;
        }

        // 创建底部按钮栏
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 16px 24px;
            border-top: 1px solid #e1e4e8;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            background: #f6f8fa;
        `;

        // 复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '📋 复制到剪贴板';
        copyButton.style.cssText = `
            padding: 8px 16px;
            background: #2ea44f;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        `;

        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.background = '#2c974b';
        });

        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.background = '#2ea44f';
        });

        copyButton.addEventListener('click', () => {
            let clipboardText = `${repoInfo.owner}/${repoInfo.repo} - Star用户列表 (${stargazers.length}人)\n`;
            clipboardText += `更新时间: ${updatedTime.toLocaleString()}\n\n`;

            if (stargazers.length > 0) {
                clipboardText += stargazers.map((u, i) => `${i + 1}. ${u}`).join('\n');
            } else {
                clipboardText += '暂无Star用户';
            }

            try {
                GM_setClipboard(clipboardText);
                copyButton.textContent = '✅ 已复制';
                copyButton.style.background = '#2ea44f';
                setTimeout(() => {
                    copyButton.textContent = '📋 复制到剪贴板';
                }, 2000);
            } catch (e) {
                copyButton.textContent = '❌ 复制失败';
                copyButton.style.background = '#dc3545';
                setTimeout(() => {
                    copyButton.textContent = '📋 复制到剪贴板';
                    copyButton.style.background = '#2ea44f';
                }, 2000);
            }
        });

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            padding: 8px 16px;
            background: #f6f8fa;
            color: #24292f;
            border: 1px solid #d1d5da;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = '#e1e4e8';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = '#f6f8fa';
        });

        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        footer.appendChild(copyButton);
        footer.appendChild(closeButton);

        // 组装弹窗
        modalContent.appendChild(header);
        modalContent.appendChild(listContainer);
        modalContent.appendChild(footer);
        modal.appendChild(modalContent);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // 添加到页面
        document.body.appendChild(modal);
    }

    // 查看Star用户列表
    async function showStargazers() {
        const repoInfo = getRepoInfo();
        const cached = await getCachedStargazers();

        if (!cached) {
            alert('❌ 无法获取Star用户列表\n\n可能原因：\n1. 仓库不存在或无权访问\n2. 网络连接失败\n3. API请求失败');
            return;
        }

        const stargazers = cached.list;

        // 显示自定义弹窗
        createStargazersModal(stargazers, repoInfo, cached);
    }

    // 获取仓库的所有stargazers
    async function getAllStargazers(showLog = false) {
        const repoInfo = getRepoInfo();
        const token = getToken();
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };

        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        if (showLog) {
            console.group('⭐ 开始获取仓库Star者列表...');
            console.log('仓库:', `${repoInfo.owner}/${repoInfo.repo}`);
            console.log('Token状态:', token ? '✅ 已配置' : '⚠️ 未配置（限制60次/小时）');
        }

        let allStargazers = [];
        let page = 1;
        const perPage = 100;

        try {
            while (true) {
                if (showLog) console.log(`正在获取第 ${page} 页...`);

                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/stargazers?page=${page}&per_page=${perPage}`,
                        headers: headers,
                        onload: resolve,
                        onerror: reject
                    });
                });

                if (response.status === 404) {
                    console.error('❌ 仓库不存在或无权访问');
                    if (showLog) console.groupEnd();
                    return null;
                }

                if (response.status === 401) {
                    console.error('❌ Token无效或已过期');
                    if (showLog) console.groupEnd();
                    return null;
                }

                if (response.status !== 200) {
                    console.error('❌ 请求失败:', response.status, response.statusText);
                    if (showLog) console.groupEnd();
                    return null;
                }

                const stargazers = JSON.parse(response.responseText);

                if (stargazers.length === 0) {
                    break;
                }

                allStargazers = allStargazers.concat(stargazers);
                if (showLog) console.log(`  └─ 获取到 ${stargazers.length} 个用户`);

                if (stargazers.length < perPage) {
                    break;
                }

                page++;
            }

            if (showLog) {
                console.log('\n✅ 获取完成！');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`📊 总共 ${allStargazers.length} 个Star`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            }

            const usernames = allStargazers.map(user => user.login);

            // 保存到缓存
            GM_setValue(`stargazers_${repoInfo.owner}_${repoInfo.repo}`, JSON.stringify(usernames));
            GM_setValue(`stargazers_updated_${repoInfo.owner}_${repoInfo.repo}`, Date.now());

            if (showLog) {
                console.log('💾 已缓存到本地存储');
                console.log('📝 缓存将在24小时后自动刷新');
                console.groupEnd();
                alert(`✅ Star列表获取成功！\n\n📊 总共 ${allStargazers.length} 个Star\n💾 已缓存到本地\n\n刷新页面生效`);
            }

            return usernames;

        } catch (error) {
            console.error('❌ 获取失败:', error);
            if (showLog) {
                console.groupEnd();
                alert('❌ 获取Star列表失败\n\n请检查网络连接和Token配置');
            }
            return null;
        }
    }

    // 从缓存中获取stargazers，如果没有缓存或过期则自动获取
    async function getCachedStargazers() {
        const repoInfo = getRepoInfo();
        const cached = GM_getValue(`stargazers_${repoInfo.owner}_${repoInfo.repo}`, null);
        const cachedTime = GM_getValue(`stargazers_updated_${repoInfo.owner}_${repoInfo.repo}`, 0);

        // 检查缓存是否存在且未过期
        if (cached && cachedTime) {
            const cacheAge = Date.now() - cachedTime;

            // 如果缓存未过期，直接返回
            if (cacheAge < CACHE_EXPIRE_TIME) {
                return {
                    list: JSON.parse(cached),
                    updatedAt: new Date(cachedTime),
                    fromCache: true
                };
            }
        }

        // 缓存不存在或已过期，自动获取
        console.log('🔄 Star缓存不存在或已过期，自动获取中...');
        const stargazers = await getAllStargazers(false);

        if (stargazers) {
            return {
                list: stargazers,
                updatedAt: new Date(),
                fromCache: false
            };
        }

        // 如果获取失败，返回旧缓存（如果有）
        if (cached) {
            console.warn('⚠️ 自动获取失败，使用旧缓存');
            return {
                list: JSON.parse(cached),
                updatedAt: new Date(cachedTime),
                fromCache: true,
                isExpired: true
            };
        }

        return null;
    }

    // 检查用户是否star了仓库
    async function checkIfUserStarred(username, owner, repo) {
        const cached = await getCachedStargazers();

        if (cached && cached.list.includes(username)) {
            return true;
        }

        if (cached && !cached.list.includes(username)) {
            return false;
        }

        // 如果没有缓存且获取失败，返回null
        return null;
    }

    // 获取API剩余请求次数
    async function checkRateLimit() {
        return new Promise((resolve) => {
            const token = getToken();
            const headers = {};

            if (token) {
                headers['Authorization'] = `token ${token}`;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.github.com/rate_limit',
                headers: headers,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.rate);
                    } else {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    // ============ UI组件创建 ============

    // 创建仓库作者标识
    function createOwnerBadge(compact = false) {
        const badge = document.createElement('span');

        if (compact) {
            badge.style.cssText = `
                margin-left: 6px;
                padding: 1px 6px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 2px;
                cursor: default;
                vertical-align: middle;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
            `;
        } else {
            badge.style.cssText = `
                margin-left: 8px;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                cursor: default;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
            `;
        }

        badge.innerHTML = compact ? '💻' : '💻 仓库作者';
        badge.title = '该用户是此仓库的作者/拥有者';

        return badge;
    }

    // 创建打赏标识
    function createSponsorBadge(compact = false) {
        const badge = document.createElement('span');

        if (compact) {
            badge.style.cssText = `
                margin-left: 6px;
                padding: 1px 6px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 2px;
                cursor: default;
                vertical-align: middle;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                box-shadow: 0 2px 4px rgba(240, 147, 251, 0.3);
            `;
        } else {
            badge.style.cssText = `
                margin-left: 8px;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                cursor: default;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                box-shadow: 0 2px 6px rgba(240, 147, 251, 0.4);
            `;
        }

        badge.innerHTML = compact ? '💰' : '💰 已打赏';
        badge.title = '该用户已打赏/赞助';

        return badge;
    }

    // 创建星标标识
    function createStarBadge(isStarred, compact = false) {
        const badge = document.createElement('span');

        if (compact) {
            badge.style.cssText = `
                margin-left: 6px;
                padding: 1px 6px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 2px;
                cursor: default;
                vertical-align: middle;
            `;
        } else {
            badge.style.cssText = `
                margin-left: 8px;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                cursor: default;
            `;
        }

        if (isStarred === null) {
            badge.textContent = compact ? '⚠️' : '⚠️ 检查失败';
            badge.style.backgroundColor = '#ffa50080';
            badge.style.color = '#666';
            badge.title = '无法获取Star状态，请检查Token或网络';
        } else if (isStarred) {
            badge.innerHTML = compact ? '⭐' : '⭐ 已Star';
            badge.style.backgroundColor = '#ffd70080';
            badge.style.color = '#856404';
            badge.title = '该用户已star此仓库';
        } else {
            badge.innerHTML = compact ? '☆' : '☆ 未Star';
            badge.style.backgroundColor = '#e1e4e8';
            badge.style.color = '#586069';
            badge.title = '该用户未star此仓库';
        }

        return badge;
    }

    // ============ 状态显示 ============

    // 显示Token状态和API限额
    async function showTokenStatus() {
        const token = getToken();
        const rateLimit = await checkRateLimit();
        const repoInfo = getRepoInfo();
        const cached = await getCachedStargazers();
        const sponsors = getSponsorUsers();

        console.group('🔧 GitHub Star Checker 状态');
        console.log('📍 当前仓库:', `${repoInfo.owner}/${repoInfo.repo}`);
        console.log('👤 仓库作者:', repoInfo.owner);
        console.log('💰 打赏人数:', sponsors.length);
        console.log('📄 页面类型:', getPageType());
        console.log('🔗 完整URL:', window.location.href);
        console.log('🔑 Token状态:', token ? '✅ 已配置' : '❌ 未配置');

        if (rateLimit) {
            console.log('\n📊 API限额信息:');
            console.log('  ├─ 剩余请求:', rateLimit.remaining);
            console.log('  ├─ 总请求数:', rateLimit.limit);
            console.log('  ├─ 使用率:', `${((rateLimit.limit - rateLimit.remaining) / rateLimit.limit * 100).toFixed(1)}%`);
            console.log('  └─ 重置时间:', new Date(rateLimit.reset * 1000).toLocaleString());

            if (rateLimit.remaining < 10) {
                console.warn('\n⚠️ API请求次数即将用完！');
            }
        }

        if (cached) {
            const cacheAge = Math.floor((Date.now() - cached.updatedAt.getTime()) / 1000 / 60);
            const cacheHours = Math.floor(cacheAge / 60);
            const cacheMinutes = cacheAge % 60;

            console.log('\n💾 Star缓存信息:');
            console.log('  ├─ Star数量:', cached.list.length);
            console.log('  ├─ 更新时间:', cached.updatedAt.toLocaleString());
            console.log('  ├─ 缓存年龄:', cacheHours > 0 ? `${cacheHours}小时${cacheMinutes}分钟` : `${cacheMinutes}分钟`);
            console.log('  ├─ 缓存来源:', cached.fromCache ? '💾 本地缓存' : '🌐 新获取');
            console.log('  └─ 过期时间:', new Date(cached.updatedAt.getTime() + CACHE_EXPIRE_TIME).toLocaleString());

            if (cached.isExpired) {
                console.warn('  ⚠️ 缓存已过期但获取失败，使用旧数据');
            }
        } else {
            console.log('\n💾 Star缓存信息: ❌ 无可用缓存');
            console.log('  💡 提示: 脚本将在后台自动获取');
        }

        if (sponsors.length > 0) {
            console.log('\n💰 打赏用户:');
            sponsors.forEach((username, index) => {
                console.log(`  ${(index + 1).toString().padStart(3, ' ')}. ${username}`);
            });
        }

        console.groupEnd();
    }

    // ============ 页面处理 ============

    // 处理Issue详情页
    async function addStarStatusToDetailPage() {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const authorLinks = document.querySelectorAll('.IssueBodyHeaderAuthor-module__authorLoginLink--MsgZJ, [data-testid="issue-body-header-author"]');
        const repoInfo = getRepoInfo();

        for (const authorLink of authorLinks) {
            if (authorLink.dataset.starChecked) continue;
            authorLink.dataset.starChecked = 'true';

            const username = authorLink.textContent.trim();
            const parentDiv = authorLink.closest('.IssueBodyHeader-module__titleSection--a171Q');

            if (!parentDiv) continue;

            // 优先检查是否是仓库作者
            if (isRepoOwner(username)) {
                const ownerBadge = createOwnerBadge(false);
                parentDiv.appendChild(ownerBadge);
                continue;
            }

            // 检查是否已打赏
            if (isSponsorUser(username)) {
                const sponsorBadge = createSponsorBadge(false);
                parentDiv.appendChild(sponsorBadge);
            }

            // 检查star状态
            const isStarred = await checkIfUserStarred(username, repoInfo.owner, repoInfo.repo);
            const starBadge = createStarBadge(isStarred, false);
            parentDiv.appendChild(starBadge);
        }
    }

    // 处理Issue列表页
    async function addStarStatusToListPage() {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const authorLinks = document.querySelectorAll('a.IssueItem-module__authorCreatedLink--kzskP[data-hovercard-type="user"]');
        const repoInfo = getRepoInfo();

        for (const authorLink of authorLinks) {
            if (authorLink.dataset.starChecked) continue;
            authorLink.dataset.starChecked = 'true';

            const username = authorLink.textContent.trim();

            // 优先检查是否是仓库作者
            if (isRepoOwner(username)) {
                const ownerBadge = createOwnerBadge(true);
                authorLink.parentNode.insertBefore(ownerBadge, authorLink.nextSibling);
                continue;
            }

            // 检查是否已打赏
            if (isSponsorUser(username)) {
                const sponsorBadge = createSponsorBadge(true);
                authorLink.parentNode.insertBefore(sponsorBadge, authorLink.nextSibling);
            }

            // 检查star状态
            const isStarred = await checkIfUserStarred(username, repoInfo.owner, repoInfo.repo);
            const starBadge = createStarBadge(isStarred, true);
            authorLink.parentNode.insertBefore(starBadge, authorLink.nextSibling);
        }
    }

    // 主函数
    async function init() {
        const pageType = getPageType();

        if (pageType === 'issue-detail') {
            await addStarStatusToDetailPage();
        } else if (pageType === 'issue-list') {
            await addStarStatusToListPage();
        }
    }

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const pageType = getPageType();
                if (pageType === 'issue-detail') {
                    addStarStatusToDetailPage();
                } else if (pageType === 'issue-list') {
                    addStarStatusToListPage();
                }
                break;
            }
        }
    });

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
        });
    } else {
        init();
    }

    // 监听页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听URL变化（SPA导航）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 500);
        }
    }).observe(document, { subtree: true, childList: true });

    // 暴露到全局供调试使用
    window.GitHubStarChecker = {
        getAllStargazers,
        showTokenStatus,
        getCachedStargazers,
        checkIfUserStarred,
        getRepoInfo,
        getPageType,
        isRepoOwner,
        getSponsorUsers,
        saveSponsorUsers,
        isSponsorUser,
        manageSponsorUsers,
        showStargazers
    };

    console.log('💡 GitHub Star Checker 已加载 | 使用 window.GitHubStarChecker 访问调试功能');
})();

