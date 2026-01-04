// ==UserScript==
// @name         无图模式-Icerayer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  阻止网页加载图片和视频，减少流量消耗，支持自定义配置
// @author       Icerayer
// @match        *://*/*
// @exclude      data:*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554073/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F-Icerayer.user.js
// @updateURL https://update.greasyfork.org/scripts/554073/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F-Icerayer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置项 - 可通过油猴脚本菜单或GM_setValue进行配置
    const config = {
        blockImages: true,              // 阻止图片加载
        blockBase64Images: true,        // 阻止Base64编码图片
        blockSVGFill: true,             // 阻止SVG中的图片填充
        blockVideos: true,              // 阻止视频加载
        blockBackgroundImages: true,    // 阻止背景图片
        blockIframeImages: false,       // 阻止iframe中的图片（可能受同源策略限制）
        usePlaceholder: false,          // 使用占位符替代图片
        placeholderType: 'stripes',     // 占位符类型: 'stripes', 'solid'
        placeholderOpacity: '30',       // 占位符透明度
        excludedSelectors: ['.ytp-gradient-bottom', '.ytp-gradient-top'], // 排除的元素选择器
        excludedDomains: [],            // 排除的域名列表
        debug: false,                   // 调试模式
        forceBlockExternalStyles: true, // 强制阻止外部样式表中的背景图片
        useGlobalStyleOverride: true,   // 使用全局样式覆盖作为最后防线
        updateDebounceTime: 50          // 更新防抖时间（毫秒）
    };
    
    // 尝试从GM存储加载配置
    try {
        const savedConfig = JSON.parse(GM_getValue('noImageModeConfig', '{}'));
        Object.assign(config, savedConfig);
    } catch (e) {
        console.log('加载配置失败，使用默认配置:', e.message);
    }
    
    // 检查当前域名是否在排除列表中
    function isExcludedDomain() {
        const hostname = window.location.hostname;
        return config.excludedDomains.some(domain => hostname.includes(domain));
    }
    
    // 如果当前域名在排除列表中，则不执行后续代码
    if (isExcludedDomain()) {
        console.log('当前域名在排除列表中，无图模式已禁用');
        return;
    }

    // 方法1: 拦截并取消图片请求
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                // 处理单个节点
                if (node.nodeType === 1) {
                    processNode(node);
                }
            });
        });
    });

    function processNode(node) {
        // 检查是否为排除的元素
        for (const selector of config.excludedSelectors) {
            if (node.matches(selector) || node.closest(selector)) {
                return;
            }
        }
        
        // 检查当前节点是否为图片
        if (node.tagName === 'IMG') {
            if (config.blockImages) {
                blockImage(node);
            }
        }
        // 检查当前节点是否为视频
        else if (node.tagName === 'VIDEO') {
            if (config.blockVideos) {
                blockVideos(); // 处理所有视频，包括当前节点
            }
        }
        // 检查当前节点是否为SVG
        else if (node.tagName === 'SVG' || node.tagName === 'image' && node.namespaceURI === 'http://www.w3.org/2000/svg') {
            if (config.blockSVGFill) {
                blockSVGFillImages(); // 处理所有SVG中的图片，包括当前节点
            }
        }

        // 检查子节点中的图片
        if (config.blockImages) {
            const images = node.querySelectorAll('img');
            images.forEach(blockImage);
        }
        
        // 处理Base64图片
        if (config.blockBase64Images) {
            const base64Images = node.querySelectorAll('img[src^="data:image/"]');
            base64Images.forEach(blockImage);
        }

        // 处理背景图片 - 包括内联样式和计算样式
        if (config.blockBackgroundImages) {
            // 1. 检查并清除内联样式中的背景图片
            if (node.style && node.style.backgroundImage && node.style.backgroundImage !== 'none') {
                node.style.backgroundImage = 'none';
            }
            
            // 2. 检查并清除计算样式中的背景图片
            const computedStyle = window.getComputedStyle(node);
            if (computedStyle.backgroundImage !== 'none') {
                node.style.backgroundImage = 'none';
            }
            
            // 3. 检查所有可能包含背景图片的样式属性
            const backgroundProperties = ['background', 'backgroundImage', 'backgroundUrl'];
            backgroundProperties.forEach(prop => {
                if (node.style[prop] && node.style[prop] !== 'none' && node.style[prop].includes('url')) {
                    node.style[prop] = 'none';
                }
            });
        }
    }

    function blockImage(img) {
        // 检查是否为排除的元素
        for (const selector of config.excludedSelectors) {
            if (img.matches(selector) || img.closest(selector)) {
                return;
            }
        }
        
        // 保存原始src以备恢复（可选功能）
        if (img.src && !img.dataset.originalSrc) {
            img.dataset.originalSrc = img.src;
            // 标记为被阻止的图片
            img.dataset.imageBlocked = 'true';
        }
        
        // 清空图片源
        img.src = '';
        img.srcset = '';
        
        // 根据配置设置显示样式
        if (config.usePlaceholder) {
            img.style.display = 'block';
            img.style.minHeight = '20px';
            img.style.backgroundColor = 'transparent';
            img.style.backgroundImage = config.placeholderType === 'stripes' 
                ? `linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee)` 
                : `linear-gradient(to right, #eee 0%, #eee 100%)`;
            img.style.backgroundSize = config.placeholderType === 'stripes' ? '20px 20px' : '100% 100%';
            img.style.backgroundPosition = config.placeholderType === 'stripes' ? '0 0, 10px 10px' : '0 0';
            img.style.opacity = config.placeholderOpacity / 100;
        } else {
            img.style.display = 'none';
        }
    }
    
    // 处理Base64编码图片
    function blockBase64Images() {
        if (!config.blockBase64Images) return;
        
        // 1. 处理图片元素中的Base64图片
        const base64Images = document.querySelectorAll('img[src^="data:image/"]');
        base64Images.forEach(img => {
            if (!img.dataset.imageBlocked) {
                blockImage(img);
            }
        });
        
        // 2. 处理CSS内联样式中的Base64背景图片
        const elementsWithBase64Background = document.querySelectorAll('[style*="url(data:image"]');
        elementsWithBase64Background.forEach(element => {
            // 检查是否为排除的元素
            for (const selector of config.excludedSelectors) {
                if (element.matches(selector) || element.closest(selector)) {
                    return;
                }
            }
            
            // 移除背景图片
            if (element.style.backgroundImage && element.style.backgroundImage.includes('data:image')) {
                element.style.backgroundImage = 'none';
            }
            // 处理background简写属性
            if (element.style.background && element.style.background.includes('data:image')) {
                element.style.background = '';
            }
        });
    }
    
    // 处理SVG中的图片填充
    function blockSVGFillImages() {
        if (!config.blockSVGFill) return;
        
        // 处理SVG中的image元素
        const svgImages = document.querySelectorAll('svg image[href^="data:image/"], svg image[xlink\:href^="data:image/"]');
        svgImages.forEach(img => {
            if (!img.dataset.imageBlocked) {
                // 保存原始地址
                if (img.href && !img.dataset.originalHref) {
                    img.dataset.originalHref = img.href;
                }
                if (img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') && !img.dataset.originalXlinkHref) {
                    img.dataset.originalXlinkHref = img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                }
                
                // 清空图片地址
                if (img.href.baseVal !== undefined) {
                    img.href.baseVal = '';
                } else {
                    img.removeAttribute('href');
                }
                img.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
                img.dataset.imageBlocked = 'true';
            }
        });
        
        // 处理SVG中的pattern和fill属性中的URL
        const svgElements = document.querySelectorAll('svg [fill^="url("], svg [stroke^="url("]');
        svgElements.forEach(element => {
            if (!element.dataset.fillBlocked) {
                if (element.getAttribute('fill') && element.getAttribute('fill').includes('url(')) {
                    element.dataset.originalFill = element.getAttribute('fill');
                    element.removeAttribute('fill');
                }
                if (element.getAttribute('stroke') && element.getAttribute('stroke').includes('url(')) {
                    element.dataset.originalStroke = element.getAttribute('stroke');
                    element.removeAttribute('stroke');
                }
                element.dataset.fillBlocked = 'true';
            }
        });
    }
    
    // 处理视频内容
    function blockVideos() {
        if (!config.blockVideos) return;
        
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // 检查是否为排除的元素
            for (const selector of config.excludedSelectors) {
                if (video.matches(selector) || video.closest(selector)) {
                    return;
                }
            }
            
            // 保存原始属性
            if (video.src && !video.dataset.originalSrc) {
                video.dataset.originalSrc = video.src;
            }
            if (video.poster && !video.dataset.originalPoster) {
                video.dataset.originalPoster = video.poster;
            }
            
            // 暂停视频并清空源
            video.pause();
            video.src = '';
            video.poster = '';
            
            // 移除所有source元素
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                if (source.src && !source.dataset.originalSrc) {
                    source.dataset.originalSrc = source.src;
                }
                source.src = '';
            });
            
            // 设置视频样式
            if (config.usePlaceholder) {
                video.style.backgroundColor = 'transparent';
                video.style.backgroundImage = config.placeholderType === 'stripes' 
                    ? `linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee)` 
                    : `linear-gradient(to right, #eee 0%, #eee 100%)`;
                video.style.backgroundSize = config.placeholderType === 'stripes' ? '20px 20px' : '100% 100%';
                video.style.backgroundPosition = config.placeholderType === 'stripes' ? '0 0, 10px 10px' : '0 0';
                video.style.opacity = config.placeholderOpacity / 100;
            }
            
            video.dataset.videoBlocked = 'true';
        });
    }

    // 方法2: 重写Image构造函数
    if (config.blockImages) {
        const originalImage = window.Image;
        window.Image = function(width, height) {
            const img = new originalImage(width, height);
            img.src = '';
            return img;
        };
        window.Image.prototype = originalImage.prototype;
    }

    // 方法3: 拦截document.createElement
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (config.blockImages && tagName.toLowerCase() === 'img') {
            // 重写src属性的setter
            Object.defineProperty(element, 'src', {
                set: function() {
                    // 忽略设置src的操作
                },
                get: function() {
                    return '';
                }
            });
            // 同样处理srcset
            Object.defineProperty(element, 'srcset', {
                set: function() {
                    // 忽略设置srcset的操作
                },
                get: function() {
                    return '';
                }
            });
        }
        
        // 为所有元素重写setAttribute方法以拦截背景图片设置
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
            // 拦截style属性中的背景图片
            if (config.blockBackgroundImages && name.toLowerCase() === 'style') {
                if (typeof value === 'string' && value.includes('background-image') && value.includes('url')) {
                    // 移除background-image相关内容
                    value = value.replace(/background-image\s*:\s*url\([^)]*\);?/gi, '');
                    value = value.replace(/background\s*:\s*[^;]*url\([^)]*\)[^;]*;?/gi, '');
                }
            }
            // 拦截background和background-image属性
            else if (config.blockBackgroundImages && (name.toLowerCase() === 'background' || name.toLowerCase() === 'background-image')) {
                if (typeof value === 'string' && value.includes('url')) {
                    // 忽略设置包含url的背景属性
                    return;
                }
            }
            // 拦截图片src属性
            else if (config.blockImages && (tagName.toLowerCase() === 'img' && (name.toLowerCase() === 'src' || name.toLowerCase() === 'srcset'))) {
                if (value && (config.blockBase64Images || !value.startsWith('data:image/'))) {
                    // 保存原始src
                    if (name.toLowerCase() === 'src' && !this.dataset.originalSrc) {
                        this.dataset.originalSrc = value;
                    }
                    // 不设置实际的src
                    return;
                }
            }
            return originalSetAttribute.call(this, name, value);
        };
        
        return element;
    };

    // 方法4: 尝试使用fetch拦截（如果浏览器支持）
    if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            // 规范化URL
            const urlStr = typeof url === 'string' ? url : String(url);
            
            try {
                // 使用URL对象获取路径部分，更精确地匹配文件扩展名
                const pathname = new URL(urlStr, location.href).pathname;
                
                // 检查是否为图片请求
                if (config.blockImages && /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(pathname)) {
                    // 返回一个空响应
                    return Promise.resolve(new Response('', { status: 200 }));
                }
                // 检查是否为视频请求
                if (config.blockVideos && /\.(mp4|webm|ogg|avi|mov|mkv)$/i.test(pathname)) {
                    // 返回一个空响应
                    return Promise.resolve(new Response('', { status: 200 }));
                }
            } catch (e) {
                // URL解析失败时回退到简单检查
                if (config.blockImages && typeof url === 'string' && /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i.test(url)) {
                    return Promise.resolve(new Response('', { status: 200 }));
                }
                if (config.blockVideos && typeof url === 'string' && /\.(mp4|webm|ogg|avi|mov|mkv)$/i.test(url)) {
                    return Promise.resolve(new Response('', { status: 200 }));
                }
            }
            return originalFetch(url, options);
        };
    }

    // 方法5: 拦截XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        try {
            // 使用URL对象获取路径部分，更精确地匹配文件扩展名
            const pathname = new URL(String(url), location.href).pathname;
            
            // 检查是否为图片请求
            if (config.blockImages && /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(pathname)) {
                // 不执行实际请求
                this._blocked = true;
            }
            // 检查是否为视频请求
            if (config.blockVideos && /\.(mp4|webm|ogg|avi|mov|mkv)$/i.test(pathname)) {
                // 不执行实际请求
                this._blocked = true;
            }
        } catch (e) {
            // URL解析失败时回退到简单检查
            if (config.blockImages && typeof url === 'string' && /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i.test(url)) {
                this._blocked = true;
            }
            if (config.blockVideos && typeof url === 'string' && /\.(mp4|webm|ogg|avi|mov|mkv)$/i.test(url)) {
                this._blocked = true;
            }
        }
        return originalXHROpen.apply(this, arguments);
    };

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this._blocked) {
            // 模拟完成但不加载内容
            setTimeout(() => {
                if (this.readyState < 4) {
                    this.readyState = 4;
                    this.status = 200;
                    if (this.onreadystatechange) this.onreadystatechange();
                    if (this.onload) this.onload();
                }
            }, 0);
            return;
        }
        return originalXHRSend.apply(this, arguments);
    };

    // 开始观察DOM变化
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,  // 监听属性变化
        attributeFilter: ['style', 'background', 'background-image']  // 重点监听这些属性
    });
    
    // 增强MutationObserver回调，处理属性变化
    const originalObserverCallback = observer.observe.bind(observer);
    observer.observe = function(target, options) {
        // 确保options包含属性监听
        if (!options.attributes) {
            options.attributes = true;
        }
        if (!options.attributeFilter) {
            options.attributeFilter = ['style', 'background', 'background-image'];
        }
        return originalObserverCallback(target, options);
    };
    
    // 方法6: 拦截元素的style对象的backgroundImage属性设置
    if (config.blockBackgroundImages) {
        const originalStylePrototype = Object.getPrototypeOf(HTMLElement.prototype.style);
        Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundImage', {
            set: function(value) {
                // 忽略包含url的背景图片设置
                if (typeof value === 'string' && value.includes('url')) {
                    return;
                }
                // 对于不包含url的值，正常设置
                originalStylePrototype.setProperty.call(this, 'background-image', value);
            },
            get: function() {
                return originalStylePrototype.getPropertyValue.call(this, 'background-image');
            }
        });
        
        // 同样拦截background属性
        Object.defineProperty(CSSStyleDeclaration.prototype, 'background', {
            set: function(value) {
                // 忽略包含url的背景设置
                if (typeof value === 'string' && value.includes('url')) {
                    return;
                }
                originalStylePrototype.setProperty.call(this, 'background', value);
            },
            get: function() {
                return originalStylePrototype.getPropertyValue.call(this, 'background');
            }
        });
    }
    
    // 拦截setProperty方法，防止通过此方法设置背景图片
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(property, value) {
        // 拦截背景相关属性
        if (config.blockBackgroundImages) {
            const lowerProp = property.toLowerCase();
            if ((lowerProp === 'background-image' || lowerProp === 'background') && 
                typeof value === 'string' && value.includes('url')) {
                return;
            }
        }
        return originalSetProperty.apply(this, arguments);
    };
    
    // 方法7: 拦截CSS样式表操作，阻止通过CSS规则添加背景图片
    if (config.blockBackgroundImages) {
        // 拦截insertRule方法
        const originalInsertRule = CSSStyleSheet.prototype.insertRule;
        CSSStyleSheet.prototype.insertRule = function(rule, index) {
            // 检查规则中是否包含背景图片url
            if (rule && typeof rule === 'string' && 
                (rule.includes('background-image') || rule.includes('background')) && 
                rule.includes('url(')) {
                // 修改规则，移除背景图片相关内容
                rule = rule.replace(/background-image\s*:\s*url\([^)]*\);?/gi, '');
                rule = rule.replace(/background\s*:\s*[^;]*url\([^)]*\)[^;]*;?/gi, '');
            }
            return originalInsertRule.call(this, rule, index);
        };
        
        // 拦截addRule方法（IE兼容）
        if (CSSStyleSheet.prototype.addRule) {
            const originalAddRule = CSSStyleSheet.prototype.addRule;
            CSSStyleSheet.prototype.addRule = function(selector, style, index) {
                // 检查样式中是否包含背景图片url
                if (style && typeof style === 'string' && 
                    (style.includes('background-image') || style.includes('background')) && 
                    style.includes('url(')) {
                    // 修改样式，移除背景图片相关内容
                    style = style.replace(/background-image\s*:\s*url\([^)]*\);?/gi, '');
                    style = style.replace(/background\s*:\s*[^;]*url\([^)]*\)[^;]*;?/gi, '');
                }
                return originalAddRule.call(this, selector, style, index);
            };
        }
    }
    
    // 方法8: 拦截动态样式标签的创建和插入
    // 拦截appendChild方法
    const originalHeadAppendChild = document.head.appendChild;
    document.head.appendChild = function(child) {
        if (config.blockBackgroundImages) {
            processStyleElement(child);
        }
        return originalHeadAppendChild.call(this, child);
    };
    
    // 拦截insertBefore方法
    const originalHeadInsertBefore = document.head.insertBefore;
    document.head.insertBefore = function(newNode, referenceNode) {
        if (config.blockBackgroundImages) {
            processStyleElement(newNode);
        }
        return originalHeadInsertBefore.call(this, newNode, referenceNode);
    };
    
    // 增强：拦截document.createTextNode，防止通过文本节点注入样式
    const originalCreateTextNode = document.createTextNode;
    document.createTextNode = function(data) {
        const textNode = originalCreateTextNode.call(this, data);
        // 标记文本节点，以便后续检查是否为样式内容
        if (typeof data === 'string' && (data.includes('background-image') || data.includes('background')) && data.includes('url(')) {
            textNode._potentialStyleContent = true;
        }
        return textNode;
    };
    
    // 处理样式元素的函数
    function processStyleElement(element) {
        if (!config.blockBackgroundImages) return;
        
        const tagName = element.tagName ? element.tagName.toLowerCase() : '';
        
        // 检查是否为style标签
        if (tagName === 'style') {
            // 立即处理现有内容
            if (element.textContent) {
                element.textContent = removeBackgroundImages(element.textContent);
            }
            
            // 监听内容变化
            const styleObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        element.textContent = removeBackgroundImages(element.textContent);
                    }
                });
            });
            
            styleObserver.observe(element, { 
                characterData: true, 
                childList: true,
                subtree: true 
            });
        }
        // 检查是否为link标签（外部样式表）
        else if (tagName === 'link' && 
                 element.rel && element.rel.toLowerCase() === 'stylesheet') {
            // 记录外部样式表URL以便跟踪
            if (element.href) {
                if (!window._blockedStyleSheets) window._blockedStyleSheets = new Set();
                window._blockedStyleSheets.add(element.href);
            }
            
            // 立即尝试处理（可能尚未加载完成）
            setTimeout(() => {
                // 查找对应的样式表
                const styleSheet = Array.from(document.styleSheets).find(sheet => 
                    sheet.href === element.href
                );
                
                if (styleSheet) {
                    try {
                        const rules = Array.from(styleSheet.cssRules || []);
                        rules.forEach(removeBackgroundFromRule);
                    } catch {}
                } else {
                    // 延迟再尝试一次，确保样式表已加载
                    setTimeout(() => {
                        for (const sheet of document.styleSheets) {
                            try {
                                const rules = Array.from(sheet.cssRules || []);
                                rules.forEach(removeBackgroundFromRule);
                            } catch {}
                        }
                    }, 300);
                }
            }, 100);
        }
        // 增强：处理可能包含样式的iframe
        else if (tagName === 'iframe' && config.blockIframeImages) {
            try {
                // 尝试访问iframe内容（可能受到同源策略限制）
                const iframeDoc = element.contentDocument || element.contentWindow.document;
                if (iframeDoc) {
                    // 递归应用无图模式到iframe
                    setTimeout(() => {
                        if (config.blockImages) {
                            Array.from(iframeDoc.querySelectorAll('img')).forEach(img => {
                                if (!img.dataset.imageBlocked) {
                                    blockImage(img);
                                }
                            });
                        }
                        
                        if (config.blockBackgroundImages) {
                            processExistingStyleSheets(iframeDoc);
                        }
                    }, 100);
                }
            } catch (e) {
                if (config.debug) {
                    console.log('无法访问iframe内容（同源策略限制）:', e.message);
                }
            }
        }
    }
    
    // 移除文本中的背景图片声明
function removeBackgroundImages(cssText) {
    if (!config.blockBackgroundImages || typeof cssText !== 'string') return cssText;
    
    // 增强的正则表达式，处理更复杂的背景图片格式
    // 1. 单独的background-image属性
    cssText = cssText.replace(/background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)\s*;?/gi, '');
    
    // 2. 处理CSS变量中的背景图片
    cssText = cssText.replace(/(--[^:]+)\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)\s*;?/gi, function(match, varName) {
        return varName + ': none;'; // 保留变量但将其值设为none
    });
    
    // 3. 处理background简写属性中的url部分
    // 只移除url部分，保留其他背景属性
    cssText = cssText.replace(/(background\s*:\s*[^;]*?)url\(\s*['"]?([^'")]+)['"]?\s*\)([^;]*;?)/gi, function(match, prefix, url, suffix) {
        // 如果前后没有其他内容，则返回空
        if (!prefix.trim() && !suffix.trim()) return '';
        // 否则只返回前后部分（移除url部分）
        return prefix + suffix;
    });
    
    // 4. 处理其他可能的背景相关属性变体
    cssText = cssText.replace(/(background(?:-[^:]+)?\s*:\s*[^;]*?)url\(\s*['"]?([^'")]+)['"]?\s*\)([^;]*;?)/gi, function(match, prefix, url, suffix) {
        // 如果前后没有其他内容，则返回空
        if (!prefix.trim() && !suffix.trim()) return '';
        // 否则只返回前后部分（移除url部分）
        return prefix + suffix;
    });
    
    return cssText;
}
    

    
    // 处理单个CSS规则，移除背景图片
    function removeBackgroundFromRule(rule) {
        // 处理普通CSS规则
        if (rule.type === 1) { // CSSStyleRule
            // 检查并移除backgroundImage属性
            if (rule.style && rule.style.backgroundImage && rule.style.backgroundImage !== 'none') {
                rule.style.backgroundImage = 'none';
            }
            
            // 更精确地处理background简写属性
            if (rule.style && rule.style.background && rule.style.background.includes('url(')) {
                // 尝试保留其他背景属性，只移除图片URL
                let backgroundValue = rule.style.background;
                // 保存非URL部分的背景属性
                let preservedBackground = '';
                
                // 处理颜色值
                const colorMatch = backgroundValue.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/);
                if (colorMatch) preservedBackground += colorMatch[0] + ' ';
                
                // 处理重复性
                const repeatMatch = backgroundValue.match(/(repeat|repeat-x|repeat-y|no-repeat)/);
                if (repeatMatch) preservedBackground += repeatMatch[0] + ' ';
                
                // 处理定位
                const positionMatch = backgroundValue.match(/(left|center|right|top|bottom|\d+(?:px|%|em|rem|vh|vw)?)\s+(left|center|right|top|bottom|\d+(?:px|%|em|rem|vh|vw)?)/);
                if (positionMatch) preservedBackground += positionMatch[0] + ' ';
                
                // 设置处理后的背景值
                rule.style.background = preservedBackground.trim() || 'none';
            }
            
            // 检查并移除可能包含URL的CSS变量
            if (rule.style) {
                for (let j = 0; j < rule.style.length; j++) {
                    const propName = rule.style[j];
                    if (propName.startsWith('--') && rule.style.getPropertyValue(propName).includes('url(')) {
                        rule.style.setProperty(propName, 'none');
                    }
                }
            }
        }
        // 处理@media规则等嵌套规则
        else if (rule.type === 4) { // CSSMediaRule
            try {
                const rules = Array.from(rule.cssRules || []);
                rules.forEach(removeBackgroundFromRule);
            } catch {}
        }
        // 处理其他可能包含规则的规则类型
        else if (rule.cssRules || rule.rules) {
            try {
                const rules = Array.from(rule.cssRules || rule.rules || []);
                rules.forEach(removeBackgroundFromRule);
            } catch {}
        }
    }
    
    // 方法9: 处理页面上已有的所有样式表 - 优化版本
    function processExistingStyleSheets(doc = document) {
        if (!config.blockBackgroundImages) return;
        
        // 批量处理所有样式表，减少try/catch次数，提升性能
        for (const sheet of doc.styleSheets) {
            try {
                const rules = Array.from(sheet.cssRules || []);
                rules.forEach(removeBackgroundFromRule);
            } catch {}
        }
        
        // 同时处理所有内联style标签
        try {
            doc.querySelectorAll('style').forEach(style => {
                if (style.textContent) {
                    style.textContent = removeBackgroundImages(style.textContent);
                }
            });
        } catch (e) {
            if (config.debug) {
                console.log('处理内联style标签时出错:', e.message);
            }
        }
        
        // 增强：添加全局样式覆盖，作为最后防线
        if (config.useGlobalStyleOverride) {
            addGlobalStyleOverride(doc);
        }
    }
    
    // 添加全局样式覆盖作为最后防线
    function addGlobalStyleOverride(doc = document) {
        // 检查是否已存在覆盖样式
        if (doc.getElementById('no-image-mode-override')) {
            return;
        }
        
        const styleElement = doc.createElement('style');
        styleElement.id = 'no-image-mode-override';
        styleElement.textContent = `
            /* 全局背景图片覆盖 */
            * {
                background-image: none !important;
            }
            
            /* 为已设置背景图片的元素保留其他背景属性 */
            [style*="background-image"] {
                background-image: none !important;
            }
            
            /* 处理CSS变量 */
            :root {
                --background-image: none !important;
                --bg-image: none !important;
            }
        `;
        
        try {
            doc.head.appendChild(styleElement);
        } catch (e) {
            if (config.debug) {
                console.log('无法添加全局样式覆盖:', e.message);
            }
        }
    }

    // 处理已经存在的图片（如果脚本在页面加载过程中注入）
    window.addEventListener('DOMContentLoaded', function() {
        // 1. 处理所有图片标签
        if (config.blockImages) {
            document.querySelectorAll('img').forEach(blockImage);
        }
        
        // 2. 处理所有元素的内联背景图片
        if (config.blockBackgroundImages) {
            document.querySelectorAll('*').forEach(function(element) {
                // 检查是否为排除的元素
                for (const selector of config.excludedSelectors) {
                    if (element.matches(selector) || element.closest(selector)) {
                        return;
                    }
                }
                
                // 清除内联样式中的背景图片
                if (element.style && element.style.backgroundImage && element.style.backgroundImage !== 'none') {
                    element.style.backgroundImage = 'none';
                }
                
                // 清除计算样式中的背景图片
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.backgroundImage !== 'none') {
                    element.style.backgroundImage = 'none';
                }
                
                // 检查所有背景相关属性
                const backgroundProperties = ['background', 'backgroundImage'];
                backgroundProperties.forEach(prop => {
                    if (element.style[prop] && element.style[prop].includes('url')) {
                        element.style[prop] = 'none';
                    }
                });
            });
        }
        
        // 3. 处理页面上所有已加载的样式表（延迟处理以提高性能）
        setTimeout(processExistingStyleSheets, 1500);
        
        // 4. 处理Base64编码图片
        blockBase64Images();
        
        // 5. 处理SVG中的图片填充
        blockSVGFillImages();
        
        // 6. 处理视频内容
        blockVideos();
    });
    
    // 当所有资源加载完成后再次检查（确保脚本动态添加的图片也被处理）
    window.addEventListener('load', function() {
        if (config.debug) {
            console.log('所有资源加载完成，开始执行最终检查...');
        }
        
        // 1. 再次处理所有图片标签（包括动态加载的图片）
        if (config.blockImages) {
            document.querySelectorAll('img:not([data-image-blocked])').forEach(blockImage);
        }
        
        // 2. 再次处理所有元素的内联背景图片
        if (config.blockBackgroundImages) {
            // 使用更高效的选择器来定位可能有背景图片的元素
            document.querySelectorAll('[style*="background-image"], [style*="background"], [style*="url("]').forEach(function(element) {
                // 检查是否为排除的元素
                for (const selector of config.excludedSelectors) {
                    if (element.matches(selector) || element.closest(selector)) {
                        return;
                    }
                }
                
                // 清除内联样式中的背景图片
                if (element.style && element.style.backgroundImage && element.style.backgroundImage !== 'none') {
                    element.style.backgroundImage = 'none';
                }
                
                // 处理background简写属性
                if (element.style.background && element.style.background.includes('url(')) {
                    element.style.background = element.style.background.replace(/url\([^)]+\)/gi, 'none');
                    // 如果替换后background属性无效，则清空
                    if (!element.style.background.trim()) {
                        element.style.background = '';
                    }
                }
            });
            
            // 再次处理所有样式表
            processExistingStyleSheets();
        }
        
        // 3. 再次处理Base64编码图片（包括脚本动态添加的）
        blockBase64Images();
        
        // 4. 再次处理SVG中的图片填充
        blockSVGFillImages();
        
        // 5. 再次处理视频内容
        blockVideos();
        
        // 6. 最后添加全局样式覆盖作为保险
        if (config.useGlobalStyleOverride) {
            addGlobalStyleOverride();
        }
        
        if (config.debug) {
            console.log('最终检查完成，所有图片和视频应已被阻止。');
        }
    });
    
    // 方法10: 监听DOM变化，处理新添加的内容
    const styleSheetObserver = new MutationObserver(function(mutations) {
        // 使用更精确的标志来避免不必要的全局处理
        let needsStyleUpdate = false;
        let needsImageUpdate = false;
        let needsVideoUpdate = false;
        let needsSVGUpdate = false;
        let newElementProcessed = false;
        
        // 直接处理新增节点，而不是等待定时器
        mutations.forEach(function(mutation) {
            // 处理新增节点
            mutation.addedNodes.forEach(function(node) {
                if (!node.tagName) return;
                
                const tagName = node.tagName.toLowerCase();
                const isElement = node.nodeType === 1;
                
                // 处理特定标签类型
                if (tagName === 'img' && config.blockImages && !node.dataset.imageBlocked) {
                    blockImage(node);
                    newElementProcessed = true;
                }
                else if (tagName === 'video' && config.blockVideos) {
                    blockVideo(node);
                    newElementProcessed = true;
                }
                else if (tagName === 'svg' && config.blockSVGFill) {
                    blockSVGFillInElement(node);
                    newElementProcessed = true;
                }
                else if (config.blockBackgroundImages && 
                         (tagName === 'style' || (tagName === 'link' && node.rel && node.rel.toLowerCase() === 'stylesheet'))) {
                    processStyleElement(node);
                    needsStyleUpdate = true;
                }
                // 处理可能包含内联样式的元素
                else if (isElement && config.blockBackgroundImages && 
                         node.hasAttribute('style') && 
                         (node.style.backgroundImage !== 'none' || node.style.background.includes('url('))) {
                    node.style.backgroundImage = 'none';
                    if (node.style.background.includes('url(')) {
                        node.style.background = '';
                    }
                    newElementProcessed = true;
                }
                
                // 处理包含子元素的节点
                if (isElement && node.hasChildNodes()) {
                    // 性能优化：根据需要选择性处理子节点
                    if (config.blockImages && node.querySelector('img:not([data-image-blocked])')) {
                        needsImageUpdate = true;
                    }
                    if (config.blockVideos && node.querySelector('video')) {
                        needsVideoUpdate = true;
                    }
                    if (config.blockSVGFill && node.querySelector('svg')) {
                        needsSVGUpdate = true;
                    }
                    if (config.blockBackgroundImages && 
                        (node.querySelector('style') || 
                         node.querySelector('[style*="background-image"], [style*="background"]'))) {
                        needsStyleUpdate = true;
                    }
                }
            });
            
            // 处理属性变化
            if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                const target = mutation.target;
                const attrName = mutation.attributeName.toLowerCase();
                
                // 检查是否为背景相关属性变化
                if (config.blockBackgroundImages && 
                    (attrName === 'style' || attrName === 'background' || attrName === 'background-image')) {
                    // 直接处理该元素，而不是触发全局更新
                    if (target.style && (target.style.backgroundImage !== 'none' || target.style.background.includes('url('))) {
                        target.style.backgroundImage = 'none';
                        if (target.style.background.includes('url(')) {
                            target.style.background = '';
                        }
                    }
                }
                // 检查是否为图片src属性变化
                else if (config.blockImages && target.tagName && 
                         target.tagName.toLowerCase() === 'img' && 
                         (attrName === 'src' || attrName === 'srcset')) {
                    // 直接重新阻止该图片
                    if (!target.dataset.imageBlocked) {
                        blockImage(target);
                    }
                }
                // 检查SVG相关属性变化
                else if (config.blockSVGFill && target.tagName && 
                         (target.tagName.toLowerCase() === 'svg' || 
                          target.tagName.toLowerCase() === 'path' || 
                          target.tagName.toLowerCase() === 'image')) {
                    needsSVGUpdate = true;
                }
            }
        });
        
        // 仅在必要时执行批量更新，避免过度处理
        if (needsStyleUpdate || needsImageUpdate || needsVideoUpdate || needsSVGUpdate) {
            // 使用防抖，避免频繁更新
            if (window._styleUpdateTimer) {
                clearTimeout(window._styleUpdateTimer);
            }
            
            window._styleUpdateTimer = setTimeout(() => {
                // 根据需要处理不同类型的内容
                if (needsStyleUpdate && config.blockBackgroundImages) {
                    processExistingStyleSheets();
                }
                if (needsImageUpdate && config.blockImages) {
                    document.querySelectorAll('img:not([data-image-blocked])').forEach(blockImage);
                }
                if (needsVideoUpdate && config.blockVideos) {
                    document.querySelectorAll('video').forEach(blockVideo);
                }
                if (needsSVGUpdate && config.blockSVGFill) {
                    blockSVGFillImages();
                }
                if (config.blockBase64Images) {
                    blockBase64Images();
                }
            }, config.updateDebounceTime || 50);
        }
    });
    
    // 单独处理视频的函数
    function blockVideo(video) {
        if (!config.blockVideos) return;
        
        // 保存原始源
        if (!video.dataset.originalSrc) {
            video.dataset.originalSrc = video.src;
        }
        
        // 清空视频源
        video.pause();
        video.src = '';
        video.srcObject = null;
        
        // 隐藏视频
        video.style.visibility = 'hidden';
        video.style.height = '0';
        video.style.width = '0';
        video.style.overflow = 'hidden';
    }
    
    // 直接处理单个SVG元素的函数
    function blockSVGFillInElement(svg) {
        if (!config.blockSVGFill) return;
        
        // 处理SVG中的image元素
        svg.querySelectorAll('image').forEach(img => {
            if (img.href) {
                img.removeAttribute('href');
            }
            if (img.getAttribute('xlink:href')) {
                img.removeAttribute('xlink:href');
            }
        });
        
        // 处理fill属性中的URL
        svg.querySelectorAll('[fill*="url("]').forEach(elem => {
            elem.setAttribute('fill', 'none');
        });
        
        // 处理pattern中的image
        svg.querySelectorAll('pattern image').forEach(img => {
            if (img.href) {
                img.removeAttribute('href');
            }
            if (img.getAttribute('xlink:href')) {
                img.removeAttribute('xlink:href');
            }
        });
    }
    
    // 开始观察head区域的变化
    if (document.head) {
        styleSheetObserver.observe(document.head, {
            childList: true,
            subtree: true
        });
    }

    // 暴露全局配置接口（可选，用于调试或临时修改配置）
    window.noImageModeConfig = config;
    
    // 保存配置的函数（可以在控制台手动调用）
    window.saveNoImageModeConfig = function(newConfig) {
        try {
            Object.assign(config, newConfig);
            GM_setValue('noImageModeConfig', JSON.stringify(config));
            console.log('无图模式配置已保存:', config);
        } catch (e) {
            console.error('保存配置失败:', e.message);
        }
    };
    
    // 恢复被阻止图片的函数（用于临时查看图片）
    window.restoreImages = function() {
        const images = document.querySelectorAll('img[data-image-blocked="true"]');
        images.forEach(img => {
            if (img.dataset.originalSrc) {
                img.src = img.dataset.originalSrc;
                img.style.display = '';
                img.style.backgroundImage = 'none';
                img.style.backgroundColor = 'transparent';
                img.style.opacity = '1';
            }
        });
        console.log(`已恢复${images.length}张图片`);
    };
    
    // 阻止图片的函数（用于重新阻止图片）
    window.blockImages = function() {
        document.querySelectorAll('img').forEach(blockImage);
        console.log('已重新阻止所有图片');
    };
    
    console.log('无图模式已启用，图片和视频加载已被阻止。当前配置:', config);
})();