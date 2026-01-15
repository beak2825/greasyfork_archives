// ==UserScript==
// @name         CLIP STUDIO笔刷入库
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  自动点击收藏和下载按钮，可选阻止弹窗，并在排行榜页面手动触发打开未入库素材
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
    let blockPopupEnabled = GM_getValue(CONFIG_KEY, true); // 默认启用阻止弹窗

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

    // ========================================
    // 功能 1: 阻止下载弹窗（可选）
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
    // 功能 2: 自动点击收藏和下载按钮
    // ========================================
    let clickAttempts = 0;
    const maxAttempts = 50; // 最多尝试 50 次（10 秒）

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
                } catch (error) {
                    console.error('✗ 点击下载按钮失败:', error);
                }
            }, 800);

        } else {
            // 如果按钮还没加载，继续等待
            if (clickAttempts < maxAttempts) {
                setTimeout(autoClickButtons, 200);
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
    // 功能 3: 排行榜页面手动触发打开未入库素材
    // ========================================
    const initRankingPageButton = () => {
        // 只在排行榜页面执行
        if (!window.location.pathname.includes('/ranking')) {
            return;
        }

        console.log('✓ 检测到排行榜页面，添加手动触发按钮...');

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

            // 执行扫描
            scanAndOpenUnownedMaterials(button);
        });

        buttonContainer.appendChild(button);
        document.body.appendChild(buttonContainer);

        console.log('✓ 手动触发按钮已添加到页面右上角');
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
            const unownedCards = Array.from(allCards).filter(card => {
                return !card.querySelector('.materialCard__purchased');
            });

            console.log(`📦 未入库素材数量: ${unownedCards.length}`);

            if (unownedCards.length === 0) {
                console.log('✓ 所有素材都已入库！');
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
            const unownedLinks = unownedCards.map(card => {
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
