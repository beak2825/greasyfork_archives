// ==UserScript==
// @name         必应安全搜索自动禁用器
// @version      1.4
// @description  自动静默关闭Microsoft Bing的安全搜索 - 优化稳定版
// @author       https://t.me/lettingboy
// @match        *://*.bing.com/*
// @exclude      *://*.bing.com/account/*
// @exclude      *://*.bing.com/settings/*
// @grant        none
// @run-at       document-start
// @noframes
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/563696/%E5%BF%85%E5%BA%94%E5%AE%89%E5%85%A8%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E7%A6%81%E7%94%A8%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563696/%E5%BF%85%E5%BA%94%E5%AE%89%E5%85%A8%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E7%A6%81%E7%94%A8%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        safeSearchParam: 'safeSearch',
        safeSearchValue: 'off',
        // 不处理包含以下参数的链接（Bing重定向链接）
        excludeLinkParams: ['u=', 'a=', '/ck/a', '/ck/'],
        // 只处理以下类型的链接
        includeLinkPaths: ['/search', '/images/search', '/videos/search']
    };

    // 工具函数
    const utils = {
        // 检查是否是搜索结果链接
        isSearchResultLink(url) {
            try {
                const urlObj = new URL(url);
                
                // 排除重定向链接
                for (const param of CONFIG.excludeLinkParams) {
                    if (urlObj.pathname.includes(param) || url.includes(param)) {
                        return false;
                    }
                }
                
                // 检查是否包含搜索参数
                return urlObj.searchParams.has('q') || 
                       CONFIG.includeLinkPaths.some(path => urlObj.pathname.includes(path));
            } catch (e) {
                return false;
            }
        },

        // 检查是否是Bing重定向链接
        isBingRedirectLink(url) {
            return url.includes('/ck/a') || 
                   url.includes('/ck/') || 
                   url.includes('u=') ||
                   url.includes('a=');
        },

        // 安全执行
        safeExecute(fn) {
            try {
                return fn();
            } catch (e) {
                return null;
            }
        }
    };

    // 修改URL参数
    function modifyUrlParams() {
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;
        
        // 只在搜索页面修改参数
        if (currentUrl.pathname.includes('/search')) {
            if (params.has(CONFIG.safeSearchParam)) {
                const currentValue = params.get(CONFIG.safeSearchParam);
                if (currentValue !== CONFIG.safeSearchValue) {
                    params.set(CONFIG.safeSearchParam, CONFIG.safeSearchValue);
                    history.replaceState(null, '', `${currentUrl.pathname}?${params.toString()}${currentUrl.hash}`);
                }
            }
        }
    }

    // 设置Cookie
    function setCookies() {
        const cookies = [
            'SRCHHPGUSR=ADLT=OFF; domain=.bing.com; path=/; max-age=31536000',
            'SRCHHPGUSR=ADLT=OFF; domain=bing.com; path=/; max-age=31536000'
        ];
        
        cookies.forEach(cookie => {
            document.cookie = cookie;
        });
    }

    // 修改页面链接（修复版）
    function modifyPageLinks() {
        const links = document.querySelectorAll('a[href*="bing.com"]');
        
        links.forEach(link => {
            utils.safeExecute(() => {
                const href = link.href;
                
                // 跳过Bing的重定向链接
                if (utils.isBingRedirectLink(href)) {
                    return;
                }
                
                // 只处理搜索结果链接
                if (utils.isSearchResultLink(href)) {
                    const url = new URL(href);
                    
                    // 添加安全搜索参数
                    url.searchParams.set(CONFIG.safeSearchParam, CONFIG.safeSearchValue);
                    
                    // 避免重复设置
                    if (link.href !== url.toString()) {
                        link.href = url.toString();
                    }
                }
            });
        });
    }

    // 修改搜索表单
    function modifySearchForms() {
        const forms = document.querySelectorAll('form[action*="bing.com"]');
        
        forms.forEach(form => {
            utils.safeExecute(() => {
                // 创建或更新安全搜索隐藏字段
                let safeSearchInput = form.querySelector(`input[name="${CONFIG.safeSearchParam}"]`);
                
                if (!safeSearchInput) {
                    safeSearchInput = document.createElement('input');
                    safeSearchInput.type = 'hidden';
                    safeSearchInput.name = CONFIG.safeSearchParam;
                    form.appendChild(safeSearchInput);
                }
                
                safeSearchInput.value = CONFIG.safeSearchValue;
            });
        });
    }

    // 主初始化函数
    function init() {
        // 修改当前页面URL参数
        modifyUrlParams();
        
        // 设置Cookie
        setCookies();
        
        // 延迟执行DOM修改
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    modifyPageLinks();
                    modifySearchForms();
                }, 100);
            });
        } else {
            setTimeout(() => {
                modifyPageLinks();
                modifySearchForms();
            }, 100);
        }
    }

    // 监听DOM变化（用于动态加载的内容）
    const observer = new MutationObserver(() => {
        modifyPageLinks();
        modifySearchForms();
    });

    // 监听URL变化
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            setTimeout(() => {
                modifyUrlParams();
                // 重新设置cookie
                setCookies();
            }, 50);
        }
    });

    // 启动脚本
    init();
    
    // 开始观察DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 开始观察URL变化
    urlObserver.observe(document, { subtree: true, childList: true });

})();