// ==UserScript==
// @name         Wikiwand 自动跳转到简体中文
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  自动将其他语言的 Wikiwand 页面重定向到对应的简体中文页面，如果不存在则返回原页面（已优化：快速重定向）
// @author       You
// @match        https://www.wikiwand.com/*/articles/*
// @exclude      https://www.wikiwand.com/zh-cn/articles/*
// @exclude      https://www.wikiwand.com/zh-hans/articles/*
// @icon         https://www.wikiwand.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      en.wikipedia.org
// @connect      pt.wikipedia.org
// @connect      ja.wikipedia.org
// @connect      de.wikipedia.org
// @connect      fr.wikipedia.org
// @connect      es.wikipedia.org
// @connect      it.wikipedia.org
// @connect      ru.wikipedia.org
// @connect      ar.wikipedia.org
// @connect      ko.wikipedia.org
// @connect      nl.wikipedia.org
// @connect      pl.wikipedia.org
// @connect      tr.wikipedia.org
// @connect      sv.wikipedia.org
// @connect      he.wikipedia.org
// @connect      zh.wikipedia.org
// @connect      zh-tw.wikipedia.org
// @connect      zh-hk.wikipedia.org
// @connect      *.wikipedia.org
// @connect      www.wikiwand.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555931/Wikiwand%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/555931/Wikiwand%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止重复执行
    if (window.wikiwandRedirectProcessed) {
        return;
    }
    window.wikiwandRedirectProcessed = true;

    // 获取当前页面的语言代码和文章标题
    const currentUrl = window.location.href;
    const urlMatch = currentUrl.match(/^https:\/\/www\.wikiwand\.com\/([a-z\-]+)\/articles\/(.+?)(?:\?|#|$)/);
    
    if (!urlMatch) {
        return; // 不是标准的 Wikiwand 文章页面
    }
    
    const currentLang = urlMatch[1];
    const articleSlugEncoded = urlMatch[2];
    const articleSlug = decodeURIComponent(articleSlugEncoded);
    
    // 如果已经是简体中文，不做处理
    if (currentLang === 'zh-cn' || currentLang === 'zh-hans') {
        return;
    }
    
    // 如果是 zh-hk / zh-tw / zh，则直接切到 zh-hans，同一个 slug
    if (currentLang === 'zh-hk' || currentLang === 'zh-tw' || currentLang === 'zh') {
        const targetUrl = `https://www.wikiwand.com/zh-hans/articles/${articleSlugEncoded}`;
        console.log('[Wikiwand 简体中文重定向] 直接从中文变体跳转到 zh-hans:', targetUrl);
        showNotification('正在跳转到简体中文版本...', 'success');
        window.location.replace(targetUrl);
        return;
    }
    
    console.log('[Wikiwand 简体中文重定向] 当前语言:', currentLang);
    console.log('[Wikiwand 简体中文重定向] 文章 Slug:', articleSlug);
    console.log('[Wikiwand 简体中文重定向] 编码的 Slug:', articleSlugEncoded);
    
    // 将 Wikiwand 语言代码转换为 Wikipedia 语言代码
    // Wikiwand 使用 zh-hans 表示简体中文，但 Wikipedia API 使用 zh
    const wikiLangMap = {
        'en': 'en',
        'de': 'de',
        'fr': 'fr',
        'es': 'es',
        'it': 'it',
        'ja': 'ja',
        'pt': 'pt',
        'ru': 'ru',
        'ar': 'ar',
        'ko': 'ko',
        'nl': 'nl',
        'pl': 'pl',
        'tr': 'tr',
        'sv': 'sv',
        'he': 'he',
        'zh': 'zh',
        'zh-tw': 'zh',
        'zh-hk': 'zh'
    };
    
    const wikiLang = wikiLangMap[currentLang] || currentLang;
    
    // Wikiwand 的 slug 通常对应 Wikipedia 的页面标题
    // 将下划线和连字符替换为空格进行查询
    const pageTitle = articleSlug.replace(/_/g, ' ');
    
    // 使用 Wikipedia API 获取中文页面标题
    const apiUrl = `https://${wikiLang}.wikipedia.org/w/api.php?` +
        `action=query&` +
        `format=json&` +
        `prop=langlinks&` +
        `titles=${encodeURIComponent(pageTitle)}&` +
        `lllang=zh&` +
        `llprop=url&` +
        `redirects=1&` +
        `origin=*`;
    
    console.log('[Wikiwand 简体中文重定向] API URL:', apiUrl);
    
    // 显示加载提示（可选 - 如果想更快，可以注释掉这行）
    // showNotification('正在查找简体中文版本...', 'info');
    
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        timeout: 3000, // 3秒超时，避免长时间等待
        headers: {
            'User-Agent': 'Wikiwand-ZH-Redirect/1.3.0 (Tampermonkey Script)'
        },
        onload: function(response) {
            try {
                console.log('[Wikiwand 简体中文重定向] API 响应:', response.responseText);
                const data = JSON.parse(response.responseText);
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                
                console.log('[Wikiwand 简体中文重定向] Page ID:', pageId);
                
                if (pageId === '-1') {
                    console.log('[Wikiwand 简体中文重定向] 页面不存在');
                    showNotification('原始页面不存在，继续浏览当前页面', 'warning');
                    return;
                }
                
                const page = pages[pageId];
                console.log('[Wikiwand 简体中文重定向] 页面数据:', page);
                
                if (page.langlinks && page.langlinks.length > 0) {
                    const zhLink = page.langlinks[0];
                    const zhWikiUrl = zhLink.url;
                    
                    console.log('[Wikiwand 简体中文重定向] 中文 Wikipedia 链接:', zhWikiUrl);
                    
                    // 从 Wikipedia URL 中提取中文标题
                    // 例如: https://zh.wikipedia.org/wiki/夏目友人帳
                    const zhTitleMatch = zhWikiUrl.match(/\/wiki\/(.+?)(?:\?|#|$)/);
                    
                    if (zhTitleMatch) {
                        const zhTitle = zhTitleMatch[1];
                        console.log('[Wikiwand 简体中文重定向] 中文标题:', zhTitle);
                        
                        // 构建 Wikiwand 简体中文 URL - 使用 zh-hans 而不是 zh-cn
                        const wikiwandZhUrl = `https://www.wikiwand.com/zh-hans/articles/${zhTitle}`;
                        
                        console.log('[Wikiwand 简体中文重定向] 目标 Wikiwand URL:', wikiwandZhUrl);
                        
                        // 直接跳转到简体中文 Wikiwand 页面（Wikipedia 已保证条目存在）
                        showNotification('找到简体中文版本，正在跳转...', 'success');
                        window.location.replace(wikiwandZhUrl);
                    } else {
                        console.log('[Wikiwand 简体中文重定向] 无法提取中文标题');
                        showNotification('无法提取中文标题，继续浏览当前页面', 'warning');
                    }
                } else {
                    console.log('[Wikiwand 简体中文重定向] 未找到简体中文版本');
                    showNotification('此页面暂无简体中文版本，继续浏览当前页面', 'warning');
                }
            } catch (error) {
                console.error('[Wikiwand 简体中文重定向] 错误:', error);
                showNotification('处理时出错: ' + error.message, 'error');
            }
        },
        onerror: function(error) {
            console.error('[Wikiwand 简体中文重定向] 请求失败:', error);
            showNotification('API 请求失败，继续浏览当前页面', 'error');
        },
        ontimeout: function() {
            console.warn('[Wikiwand 简体中文重定向] API 请求超时');
            showNotification('查询超时，继续浏览当前页面', 'warning');
        }
    });
    

    
    // 显示通知消息
    function showNotification(message, type = 'info') {
        // 确保 DOM 已加载
        const addNotification = () => {
            // 移除之前的通知
            const existingNotifications = document.querySelectorAll('.wikiwand-redirect-notification');
            existingNotifications.forEach(n => n.remove());
            
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = 'wikiwand-redirect-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background-color: ${
                    type === 'error' ? '#f44336' : 
                    type === 'warning' ? '#ff9800' : 
                    type === 'success' ? '#4CAF50' :
                    '#2196F3'
                };
                color: white;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = message;
            
            // 添加动画样式
            if (!document.getElementById('wikiwand-redirect-notification-style')) {
                const style = document.createElement('style');
                style.id = 'wikiwand-redirect-notification-style';
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
                    @keyframes slideOut {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            document.body.appendChild(notification);
            
            // 3秒后自动消失
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        };
        
        if (document.body) {
            addNotification();
        } else {
            document.addEventListener('DOMContentLoaded', addNotification);
        }
    }
})();
