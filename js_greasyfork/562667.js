// ==UserScript==
// @name         CLIP STUDIO笔刷入库
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  自动点击收藏和下载按钮，可选阻止弹窗和下载后自动关闭，支持自动跳转繁中，并在排行榜/搜索页面手动触发打开未入库素材
// @author       You
// @match        https://assets.clip-studio.com/*
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562667/CLIP%20STUDIO%E7%AC%94%E5%88%B7%E5%85%A5%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/562667/CLIP%20STUDIO%E7%AC%94%E5%88%B7%E5%85%A5%E5%BA%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('CLIP STUDIO 自动收藏下载笔刷脚本已启动');

    // ========================================
    // 配置选项
    // ========================================
    const CONFIG_KEY = 'blockPopup';
    const AUTO_CLOSE_KEY = 'autoClose';
    const SKIP_PAID_KEY = 'skipPaidMaterials';
    const AUTO_REDIRECT_ZHTW_KEY = 'autoRedirectZhTw';
    let blockPopupEnabled = GM_getValue(CONFIG_KEY, true); // 默认启用阻止弹窗
    let autoCloseEnabled = GM_getValue(AUTO_CLOSE_KEY, false); // 默认不启用自动关闭
    let skipPaidMaterials = GM_getValue(SKIP_PAID_KEY, false); // 默认不跳过付费素材
    let autoRedirectZhTw = GM_getValue(AUTO_REDIRECT_ZHTW_KEY, false); // 默认不启用自动跳转繁中

    // 注册菜单命令
    const updateMenuCommand = () => {
        const statusText = blockPopupEnabled ? '✓ 已启用' : '✗ 已禁用';
        GM_registerMenuCommand(`${statusText} 阻止下载弹窗`, () => {
            blockPopupEnabled = !blockPopupEnabled;
            GM_setValue(CONFIG_KEY, blockPopupEnabled);
            const newStatus = blockPopupEnabled ? '已启用' : '已禁用';
            alert(`阻止下载弹窗功能${newStatus}\n\n${blockPopupEnabled ? '✓ 下载时不会弹出"要打开 CLIP STUDIO 吗？"提示框' : '✗ 下载时会弹出提示框，可以下载到本地'}\n\n刷新页面后生效`);
            console.log(`阻止弹窗功能已${newStatus}:`, blockPopupEnabled);
        });
    };

    updateMenuCommand();
    console.log('当前阻止弹窗状态:', blockPopupEnabled ? '启用' : '禁用');

    // 注册自动关闭菜单命令
    const updateAutoCloseCommand = () => {
        const statusText = autoCloseEnabled ? '✓ 已启用' : '✗ 已禁用';
        GM_registerMenuCommand(`${statusText} 下载后自动关闭`, () => {
            autoCloseEnabled = !autoCloseEnabled;
            GM_setValue(AUTO_CLOSE_KEY, autoCloseEnabled);
            const newStatus = autoCloseEnabled ? '已启用' : '已禁用';
            alert(`下载后自动关闭功能${newStatus}\n\n${autoCloseEnabled ? '✓ 笔刷下载完成后会自动关闭标签页（仅适用于脚本打开的页面）' : '✗ 笔刷下载后不会自动关闭标签页'}\n\n刷新页面后生效`);
            console.log(`自动关闭功能已${newStatus}:`, autoCloseEnabled);
        });
    };

    updateAutoCloseCommand();
    console.log('当前自动关闭状态:', autoCloseEnabled ? '启用' : '禁用');

    // 注册跳过付费素材菜单命令
    const updateSkipPaidCommand = () => {
        const statusText = skipPaidMaterials ? '✓ 已启用' : '✗ 已禁用';
        GM_registerMenuCommand(`${statusText} 跳过付费素材`, () => {
            skipPaidMaterials = !skipPaidMaterials;
            GM_setValue(SKIP_PAID_KEY, skipPaidMaterials);
            const newStatus = skipPaidMaterials ? '已启用' : '已禁用';
            alert(`跳过付费素材功能${newStatus}\n\n${skipPaidMaterials ? '✓ 批量打开时将跳过需要金币(G)或点数(CP)购买的素材' : '✗ 批量打开时包含所有付费素材'}\n\n刷新页面后生效`);
            console.log(`跳过付费素材功能已${newStatus}:`, skipPaidMaterials);
        });
    };

    updateSkipPaidCommand();
    console.log('当前跳过付费素材状态:', skipPaidMaterials ? '启用' : '禁用');

    // 注册自动跳转繁中菜单命令
    const updateAutoRedirectCommand = () => {
        const statusText = autoRedirectZhTw ? '✓ 已启用' : '✗ 已禁用';
        GM_registerMenuCommand(`${statusText} 自动跳转繁中`, () => {
            autoRedirectZhTw = !autoRedirectZhTw;
            GM_setValue(AUTO_REDIRECT_ZHTW_KEY, autoRedirectZhTw);
            const newStatus = autoRedirectZhTw ? '已启用' : '已禁用';
            alert(`自动跳转繁中功能${newStatus}\n\n${autoRedirectZhTw ? '✓ 所有语种页面将自动跳转到繁体中文 (zh-tw) 版本' : '✗ 保持原语种页面不跳转'}\n\n刷新页面后生效`);
            console.log(`自动跳转繁中功能已${newStatus}:`, autoRedirectZhTw);
        });
    };

    updateAutoRedirectCommand();
    console.log('当前自动跳转繁中状态:', autoRedirectZhTw ? '启用' : '禁用');

    // ========================================
    // 功能 1: 自动跳转繁中（可选）
    // ========================================
    if (autoRedirectZhTw) {
        const currentPath = window.location.pathname;
        // 匹配路径中的语言代码 (如 /ko-kr/, /en-us/, /ja-jp/ 等)
        const langMatch = currentPath.match(/^\/(\w{2}-\w{2})\//i);

        if (langMatch && langMatch[1].toLowerCase() !== 'zh-tw') {
            const currentLang = langMatch[1];
            const newUrl = window.location.href.replace(
                new RegExp(`/${currentLang}/`, 'i'),
                '/zh-tw/'
            );
            console.log(`检测到语言: ${currentLang}, 自动跳转到繁中版本...`);
            console.log(`原URL: ${window.location.href}`);
            console.log(`新URL: ${newUrl}`);
            window.location.replace(newUrl);
        } else if (langMatch) {
            console.log('当前已是繁中页面,无需跳转');
        }
    }

    // ========================================
    // 功能 2: 阻止下载弹窗（可选）
    // ========================================
    // 等待 CatalogMaterial 对象加载
    const checkAndReplace = () => {
        if (typeof CatalogMaterial !== 'undefined' && CatalogMaterial.startDownload) {
            console.log('找到 CatalogMaterial.startDownload');

            // 保存原始函数的引用
            const originalStartDownload = CatalogMaterial.startDownload;

            // 替换为条件函数，根据配置决定是否阻止弹窗
            CatalogMaterial.startDownload = function (materialId, uuid) {
                if (blockPopupEnabled) {
                    console.log('已拦截 CLIP STUDIO 弹窗请求');
                    console.log('素材ID:', materialId, 'UUID:', uuid);
                    console.log('笔刷已入库，但不会弹出"要打开 CLIP STUDIO 吗？"的提示框');
                    // 不执行任何操作，直接返回
                    return false;
                } else {
                    console.log('允许弹窗，调用原始下载函数');
                    // 调用原始函数，允许弹窗
                    return originalStartDownload.call(this, materialId, uuid);
                }
            };

            console.log('✓ 成功设置 startDownload 函数拦截器');
        } else {
            // 如果还没加载，继续等待
            setTimeout(checkAndReplace, 100);
        }
    };

    // 开始检查
    checkAndReplace();

    // 额外保险：拦截 location.href 的设置
    try {
        const descriptor = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
        if (descriptor && descriptor.set) {
            const originalLocationSetter = descriptor.set;

            Object.defineProperty(window.location, 'href', {
                set: function (url) {
                    if (typeof url === 'string' && url.startsWith('clipstudio://')) {
                        if (blockPopupEnabled) {
                            console.log('已拦截 location.href 设置为 CLIP STUDIO 协议:', url);
                            console.log('笔刷已入库，但不会弹出提示框');
                            return; // 阻止设置
                        } else {
                            console.log('允许 CLIP STUDIO 协议调用:', url);
                        }
                    }
                    originalLocationSetter.call(this, url);
                },
                get: function () {
                    return window.location.href;
                },
                configurable: true
            });

            console.log('✓ 已设置 location.href 拦截器');
        } else {
            console.log('⚠ 无法设置 location.href 拦截器（浏览器不支持），将使用其他方式拦截');
        }
    } catch (error) {
        console.log('⚠ location.href 拦截器设置失败:', error.message);
        console.log('将继续使用 CatalogMaterial.startDownload 拦截方式');
    }

    // ========================================
    // 功能 3: 自动点击收藏和下载按钮
    // ========================================
    let clickAttempts = 0;
    const maxAttempts = 50; // 最多尝试 50 次
    const attemptsPerBatch = 10; // 每批尝试 10 次
    const batchPauseMs = 2000; // 每批之间暂停 2 秒

    const autoClickButtons = () => {
        clickAttempts++;

        // 检查是否在详情页面（包含 /detail 路径）
        if (!window.location.pathname.includes('/detail')) {
            console.log('不在详情页面，跳过自动点击');
            return;
        }

        console.log(`[尝试 ${clickAttempts}/${maxAttempts}] 查找按钮...`);

        // 查找收藏按钮（星标按钮）
        const starButton = document.querySelector('.starButton[data-star-button]');

        // 查找下载按钮 - 使用更宽松的选择器
        const downloadButton = document.querySelector('button[data-material-download-free]');

        console.log('收藏按钮:', starButton ? '✓ 找到' : '✗ 未找到');
        console.log('下载按钮:', downloadButton ? '✓ 找到' : '✗ 未找到');

        if (starButton && downloadButton) {
            console.log('========================================');
            console.log('✓ 找到所有按钮，准备自动点击...');
            console.log('========================================');

            // 先点击收藏按钮
            if (starButton.classList.contains('inactive')) {
                console.log('→ 点击收藏按钮（当前状态：未收藏）');
                try {
                    starButton.click();
                    console.log('✓ 已点击收藏按钮');
                } catch (error) {
                    console.error('✗ 点击收藏按钮失败:', error);
                }
            } else {
                console.log('→ 收藏按钮已激活，跳过点击');
            }

            // 延迟后点击下载按钮
            setTimeout(() => {
                console.log('→ 点击下载按钮');
                try {
                    downloadButton.click();
                    console.log('✓ 已点击下载按钮');
                    console.log('========================================');
                    console.log('✓ 自动收藏和下载完成！');
                    console.log('========================================');

                    // 如果启用了自动关闭，延迟后关闭标签页
                    if (autoCloseEnabled) {
                        setTimeout(() => {
                            console.log('→ 自动关闭标签页...');
                            window.close();
                        }, 1500); // 下载后延迟 1.5 秒关闭
                    }
                } catch (error) {
                    console.error('✗ 点击下载按钮失败:', error);
                }
            }, 800);

        } else {
            // 如果按钮还没加载，继续等待
            if (clickAttempts < maxAttempts) {
                // 检查是否需要暂停（每10次暂停一次）
                const needPause = clickAttempts % attemptsPerBatch === 0;
                const nextDelay = needPause ? batchPauseMs : 200;

                if (needPause) {
                    console.log(`⏸️  已尝试 ${clickAttempts} 次，暂停 ${batchPauseMs / 1000} 秒...`);
                }

                setTimeout(autoClickButtons, nextDelay);
            } else {
                console.error('✗ 超过最大尝试次数，放弃自动点击');
                console.log('请检查页面是否正常加载，或手动点击按钮');
            }
        }
    };

    // 使用多种方式确保脚本执行
    console.log('当前页面状态:', document.readyState);

    // 方式1: DOMContentLoaded
    if (document.readyState === 'loading') {
        console.log('等待 DOMContentLoaded 事件...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded 触发，延迟 500ms 后开始查找按钮');
            setTimeout(autoClickButtons, 500);
        });
    } else {
        // 方式2: 页面已加载，延迟执行
        console.log('页面已加载，延迟 1000ms 后开始查找按钮');
        setTimeout(autoClickButtons, 1000);
    }

    // 方式3: window.onload 作为备用
    window.addEventListener('load', () => {
        console.log('window.load 事件触发');
        // 如果还没找到按钮，再尝试一次
        if (clickAttempts === 0) {
            console.log('备用方案：延迟 500ms 后开始查找按钮');
            setTimeout(autoClickButtons, 500);
        }
    });

    console.log('✓ 自动点击功能已启用');

    // ========================================
    // 功能 4: 排行榜页面手动触发打开未入库素材
    // ========================================
    const initRankingPageButton = () => {
        // 只在排行榜或搜索页面执行
        if (!window.location.pathname.includes('/ranking') && !window.location.pathname.includes('/search')) {
            return;
        }

        const pageType = window.location.pathname.includes('/ranking') ? '排行榜' : '搜索';
        console.log(`✓ 检测到${pageType}页面，添加手动触发按钮...`);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'auto-open-unowned-btn';
        buttonContainer.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        `;

        // 创建按钮
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            <span>识别未入库素材</span>
        `;
        button.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            white-space: nowrap;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });

        // 点击事件
        button.addEventListener('click', () => {
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle; animation: spin 1s linear infinite;">
                    <path d="M8 0a8 8 0 0 0-8 8h2a6 6 0 1 1 6 6v2a8 8 0 0 0 0-16z"/>
                </svg>
                <span>扫描中...</span>
            `;

            // 添加旋转动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);

            // 根据页面类型决定是否自动滚动
            const isSearchPage = window.location.pathname.includes('/search');
            if (isSearchPage) {
                // 搜索页面：执行自动加载和扫描
                autoLoadAllContent(button);
            } else {
                // 排行榜页面：直接扫描当前可见素材，不滚动
                console.log('排行榜页面：直接扫描当前可见素材（不自动滚动）');
                scanAndOpenUnownedMaterials(button);
            }
        });

        buttonContainer.appendChild(button);
        document.body.appendChild(buttonContainer);

        console.log('✓ 手动触发按钮已添加到页面右上角');
    };

    // 自动加载所有内容的函数
    const autoLoadAllContent = (button) => {
        console.log('========================================');
        console.log('📜 开始自动滚动加载页面...');
        console.log('========================================');

        let lastHeight = 0;
        let noChangeCount = 0;
        const maxNoChange = 3; // 连续3次高度无变化则认为加载完毕
        const checkInterval = 2000; // 每次检测间隔2秒

        const scrollAndCheck = () => {
            const currentHeight = document.body.scrollHeight;
            const currentCards = document.querySelectorAll('.materialCard').length;

            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle; animation: spin 1s linear infinite;">
                    <path d="M8 0a8 8 0 0 0-8 8h2a6 6 0 1 1 6 6v2a8 8 0 0 0 0-16z"/>
                </svg>
                <span>加载中... (已发现 ${currentCards})</span>
            `;

            console.log(`当前页面高度: ${currentHeight}, 素材数量: ${currentCards}`);

            if (currentHeight === lastHeight) {
                noChangeCount++;
                console.log(`页面高度无变化 (${noChangeCount}/${maxNoChange})`);
            } else {
                noChangeCount = 0;
                lastHeight = currentHeight;
                console.log('页面内容已更新，继续滚动...');
            }

            if (noChangeCount >= maxNoChange) {
                console.log('✓ 页面加载似乎已完成');
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle; animation: spin 1s linear infinite;">
                        <path d="M8 0a8 8 0 0 0-8 8h2a6 6 0 1 1 6 6v2a8 8 0 0 0 0-16z"/>
                    </svg>
                    <span>正在分析素材...</span>
                `;

                // 给一点缓冲时间，然后开始扫描
                setTimeout(() => {
                    scanAndOpenUnownedMaterials(button);
                }, 1000);
            } else {
                // 滚动到底部
                window.scrollTo(0, document.body.scrollHeight);
                // 继续检测
                setTimeout(scrollAndCheck, checkInterval);
            }
        };

        // 开始第一次滚动
        scrollAndCheck();
    };

    // 扫描并打开未入库素材的函数
    const scanAndOpenUnownedMaterials = (button) => {
        console.log('========================================');
        console.log('🔍 开始扫描未入库素材...');
        console.log('========================================');

        // 等待页面加载完成
        const waitForMaterials = () => {
            const allCards = document.querySelectorAll('.materialCard');

            if (allCards.length === 0) {
                console.log('⏳ 等待素材卡片加载...');
                setTimeout(waitForMaterials, 500);
                return;
            }

            console.log(`✓ 找到 ${allCards.length} 个素材卡片`);

            // 筛选出未入库的素材（没有绿色勾选标记）
            let unownedCards = Array.from(allCards).filter(card => {
                return !card.querySelector('.materialCard__purchased');
            });

            console.log(`📦 未入库素材数量: ${unownedCards.length}`);

            // 根据配置过滤付费素材
            let filteredCards = unownedCards;
            let skippedPaidCount = 0;

            if (skipPaidMaterials) {
                filteredCards = unownedCards.filter(card => {
                    const priceElement = card.querySelector('.materialCard__price');
                    if (!priceElement) {
                        // 没有价格标签，认为是免费素材
                        return true;
                    }

                    const priceText = priceElement.textContent.trim();

                    // 检查是否包含 G 币或 CP
                    const hasPaidPrice = /\d+\s*(G|CP)/i.test(priceText);

                    // 如果是付费素材，则过滤掉
                    if (hasPaidPrice) {
                        skippedPaidCount++;
                        return false;
                    }

                    return true;
                });

                if (skippedPaidCount > 0) {
                    console.log(`🚫 已过滤付费素材: ${skippedPaidCount} 个`);
                    console.log(`✅ 剩余待打开素材: ${filteredCards.length} 个`);
                }
            }

            if (filteredCards.length === 0) {
                const message = unownedCards.length > 0 ? '所有未入库素材都已被过滤！' : '所有素材都已入库！';
                console.log(`✓ ${message}`);
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <span>全部已入库</span>
                `;
                button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
                setTimeout(() => {
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.style.cursor = 'pointer';
                    button.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        <span>识别未入库素材</span>
                    `;
                    button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }, 3000);
                return;
            }

            // 提取未入库素材的链接
            const unownedLinks = filteredCards.map(card => {
                const link = card.querySelector('a.materialCard__cardContentBlock');
                return link ? link.href : null;
            }).filter(href => href !== null);

            console.log(`🔗 准备打开 ${unownedLinks.length} 个未入库素材...`);
            console.log('⏱️  每隔 2 秒打开一个新标签页');

            // 更新按钮显示进度
            let index = 0;
            const openNext = () => {
                if (index >= unownedLinks.length) {
                    console.log('========================================');
                    console.log('✓ 所有未入库素材已打开完毕！');
                    console.log('========================================');

                    button.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        <span>完成 (${unownedLinks.length}个)</span>
                    `;
                    button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';

                    setTimeout(() => {
                        button.disabled = false;
                        button.style.opacity = '1';
                        button.style.cursor = 'pointer';
                        button.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                            <span>识别未入库素材</span>
                        `;
                        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }, 3000);
                    return;
                }

                const url = unownedLinks[index];
                console.log(`[${index + 1}/${unownedLinks.length}] 后台打开: ${url}`);

                // 更新按钮进度
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px; vertical-align: middle; animation: spin 1s linear infinite;">
                        <path d="M8 0a8 8 0 0 0-8 8h2a6 6 0 1 1 6 6v2a8 8 0 0 0 0-16z"/>
                    </svg>
                    <span>打开中 ${index + 1}/${unownedLinks.length}</span>
                `;

                // 使用 GM_openInTab 绕过弹窗拦截器，在后台打开标签页
                GM_openInTab(url, { active: false });
                index++;

                setTimeout(openNext, 2000); // 2秒后打开下一个
            };

            openNext();
        };

        waitForMaterials();
    };

    // 初始化排行榜页面按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initRankingPageButton, 1000));
    } else {
        setTimeout(initRankingPageButton, 1000);
    }
})();
