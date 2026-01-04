// ==UserScript==
// @name         [MWI]Talent Market
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  MWI Talent Market(www.papiyas.chat)，游戏页面内嵌网站弹窗，支持一键导入角色信息生成名片上传
// @author       SHIIN
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://papiyas.chat/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @icon         https://www.papiyas.chat/img/favicon.ico
// @license      CC-BY-NC-SA-4.0
// @connect      papiyas.chat
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.2/math.js
// @resource     cardStyles https://papiyas.chat/static/js/mwi-card-styles.css?v=1.2.7
// @downloadURL https://update.greasyfork.org/scripts/559347/%5BMWI%5DTalent%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/559347/%5BMWI%5DTalent%20Market.meta.js
// ==/UserScript==

(function(global) {
    'use strict';
    const SnapDOM = (function() {
        function initSnapDOM() {
            if (typeof global.snapdom !== 'undefined') return;
            global.snapdom = async function(node, options = {}) {
                const scale = options.scale || 2;
                const width = options.width || node.offsetWidth;
                const height = options.height || node.offsetHeight;
                const bgcolor = options.backgroundColor || 'transparent';
                async function cloneNode(node, filter) {
                    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.nodeValue);
                    if (node.nodeType !== Node.ELEMENT_NODE) return null;
                    const clone = node.cloneNode(false);
                    const style = window.getComputedStyle(node);
                    for (let i = 0; i < style.length; i++) {
                        const name = style[i];
                        if (name !== 'backgroundImage') clone.style[name] = style.getPropertyValue(name);
                    }
                    if (node.style) {
                        for (let i = 0; i < node.style.length; i++) {
                            const propName = node.style[i];
                            if (propName.startsWith('--')) clone.style.setProperty(propName, node.style.getPropertyValue(propName));
                        }
                    }
                    if (node.tagName === 'use' || node.tagName === 'USE') {
                        const href = node.getAttribute('href') || node.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                        if (href) { clone.setAttribute('href', href); clone.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href); }
                    }
                    let backgroundApplied = false;
                    if (node.style?.backgroundImage && node.style.backgroundImage !== 'none') {
                        clone.style.backgroundImage = node.style.backgroundImage;
                        const inlineMatch = node.style.backgroundImage.match(/url\(["']?([^"']*?)["']?\)/);
                        backgroundApplied = !!(inlineMatch?.[1] || node.style.backgroundImage.includes('gradient'));
                    }
                    const bgProps = ['backgroundImage', 'backgroundColor', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundAttachment', 'backgroundClip', 'backgroundOrigin'];
                    bgProps.forEach(prop => {
                        const computedValue = style.getPropertyValue(prop);
                        if (computedValue && computedValue !== 'none' && computedValue !== 'initial') {
                            clone.style.setProperty(prop, computedValue);
                            if (prop === 'backgroundImage' && computedValue !== 'none') backgroundApplied = true;
                        }
                    });
                    if (backgroundApplied) {
                        ['backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundAttachment'].forEach(prop => {
                            const value = node.style?.[prop] || style.getPropertyValue(prop);
                            if (value && value !== 'initial') clone.style[prop] = value;
                        });
                    }
                    const supportsMask = CSS.supports('mask', 'linear-gradient(#fff 0 0)') || CSS.supports('-webkit-mask', 'linear-gradient(#fff 0 0)');
                    ['::before', '::after'].forEach(pseudo => {
                        const pseudoStyle = window.getComputedStyle(node, pseudo);
                        const content = pseudoStyle.getPropertyValue('content');
                        const background = pseudoStyle.getPropertyValue('background');
                        if ((content && content !== 'none' && content !== 'normal') || (background && background.includes('gradient'))) {
                            const classNameStr = typeof node.className === 'string' ? node.className : (node.className?.baseVal || node.className?.toString() || '');
                            if (classNameStr.includes('mwi-character-info-top') && pseudo === '::before') return;
                            if (classNameStr.includes('mwi-character-card') && pseudo === '::before' && !supportsMask) return;
                            const pseudoElement = document.createElement('div');
                            pseudoElement.className = `pseudo-${pseudo.replace('::', '')}`;
                            ['position', 'top', 'right', 'bottom', 'left', 'inset', 'width', 'height', 'background', 'background-color', 'background-image', 'background-size', 'background-position', 'background-repeat', 'background-attachment', 'background-clip', 'border-radius', 'padding', 'margin', 'z-index', 'pointer-events', 'backdrop-filter', '-webkit-backdrop-filter', 'mask', '-webkit-mask', 'mask-composite', '-webkit-mask-composite'].forEach(prop => {
                                const value = pseudoStyle.getPropertyValue(prop);
                                if (value && value !== 'initial' && value !== 'auto' && value !== 'normal') pseudoElement.style.setProperty(prop, value);
                            });
                            const zIndex = pseudoStyle.getPropertyValue('z-index');
                            pseudoElement.style.setProperty('z-index', (zIndex && zIndex !== 'auto') ? zIndex : '-1', 'important');
                            if (pseudo === '::before') clone.insertBefore(pseudoElement, clone.firstChild || null);
                            else clone.appendChild(pseudoElement);
                        }
                    });
                    for (let i = 0; i < node.childNodes.length; i++) {
                        const child = await cloneNode(node.childNodes[i], filter);
                        if (child) clone.appendChild(child);
                    }
                    return clone;
                }
                async function embedSVG(clone) {
                    const spriteMap = {};
                    const uses = clone.querySelectorAll('use');
                    for (const use of uses) {
                        const href = use.getAttribute('href') || use.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                        if (!href) continue;
                        if (href.includes('.svg#')) {
                            const [spriteUrl, symbolId] = href.split('#');
                            if (!spriteMap[spriteUrl]) spriteMap[spriteUrl] = new Set();
                            spriteMap[spriteUrl].add(symbolId);
                        } else if (href.startsWith('#')) {
                            const symbolId = href.substring(1);
                            const symbol = document.getElementById(symbolId);
                            if (!symbol) continue;
                            const svg = use.closest('svg');
                            if (!svg) continue;
                            let defs = svg.querySelector('defs');
                            if (!defs) { defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); svg.insertBefore(defs, svg.firstChild); }
                            if (!defs.querySelector('#' + symbolId)) { const clonedSymbol = symbol.cloneNode(true); clonedSymbol.querySelectorAll('text, tspan').forEach(t => t.remove()); defs.appendChild(clonedSymbol); }
                        }
                    }
                    for (const [spriteUrl, symbolIds] of Object.entries(spriteMap)) {
                        try {
                            const response = await fetch(spriteUrl);
                            const svgText = await response.text();
                            const svgDoc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
                            for (const symbolId of symbolIds) {
                                const symbol = svgDoc.getElementById(symbolId);
                                if (!symbol) continue;
                                const relevantUses = clone.querySelectorAll(`use[href="${spriteUrl}#${symbolId}"]`);
                                for (const use of relevantUses) {
                                    const svg = use.closest('svg');
                                    if (!svg) continue;
                                    let defs = svg.querySelector('defs');
                                    if (!defs) { defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); svg.insertBefore(defs, svg.firstChild); }
                                    const spriteType = spriteUrl.match(/\/([^\/]+)_sprite/)?.[1] || 'unknown';
                                    const uniqueId = `${spriteType}_${symbolId}`;
                                    if (!defs.querySelector('#' + uniqueId)) { const clonedSymbol = symbol.cloneNode(true); clonedSymbol.id = uniqueId; clonedSymbol.querySelectorAll('text, tspan').forEach(t => t.remove()); defs.appendChild(clonedSymbol); }
                                    use.setAttribute('href', '#' + uniqueId);
                                    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + uniqueId);
                                }
                            }
                        } catch (error) {}
                    }
                }
                const clonedNode = await cloneNode(node, options.filter);
                await embedSVG(clonedNode);
                [{ selector: '.mwi-equipment-slot.filled', bgColor: 'rgba(255, 255, 255, 0.08)' }, { selector: '.mwi-ability-item:not(.empty)', bgColor: 'rgba(255, 255, 255, 0.08)' }, { selector: '.mwi-consumable-item:not(.empty)', bgColor: 'rgba(255, 255, 255, 0.08)' }, { selector: '.mwi-house-item:not(.empty)', bgColor: 'rgba(255, 255, 255, 0.08)' }, { selector: '.mwi-consumables-container, .mwi-abilities-grid, .mwi-equipment-grid, .mwi-house-grid', bgColor: 'rgba(0, 0, 0, 0.2)' }].forEach(fix => {
                    clonedNode.querySelectorAll(fix.selector).forEach(el => {
                        if (!el.style.backgroundColor || el.style.backgroundColor === 'transparent') { el.style.backgroundColor = fix.bgColor; el.style.backdropFilter = 'blur(20px) saturate(180%)'; el.style.webkitBackdropFilter = 'blur(20px) saturate(180%)'; }
                    });
                });
                const xmlns = 'http://www.w3.org/2000/svg';
                const svg = document.createElementNS(xmlns, 'svg');
                svg.setAttribute('width', width * scale); svg.setAttribute('height', height * scale);
                svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                svg.setAttribute('color-interpolation', 'sRGB'); svg.setAttribute('color-interpolation-filters', 'sRGB');
                svg.style.backgroundColor = bgcolor;
                const foreignObject = document.createElementNS(xmlns, 'foreignObject');
                foreignObject.setAttribute('width', '100%'); foreignObject.setAttribute('height', '100%');
                foreignObject.setAttribute('x', '0'); foreignObject.setAttribute('y', '0');
                let bgImageUrl = null;
                const cardElement = clonedNode.querySelector('.mwi-character-card') || clonedNode;
                if (cardElement && cardElement.style.backgroundImage) {
                    const match = cardElement.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
                    if (match && match[1]) bgImageUrl = match[1];
                }
                foreignObject.appendChild(clonedNode); svg.appendChild(foreignObject);
                const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
                return {
                    async toCanvas() {
                        return new Promise((resolve, reject) => {
                            const canvas = document.createElement('canvas');
                            canvas.width = width * scale; canvas.height = height * scale;
                            const ctx = canvas.getContext('2d', { alpha: true, colorSpace: 'srgb' });
                            ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
                            const drawSvgContent = () => {
                                const svgImg = new Image();
                                svgImg.crossOrigin = 'anonymous'; svgImg.decoding = 'sync';
                                svgImg.onload = () => { ctx.drawImage(svgImg, 0, 0); resolve(canvas); };
                                svgImg.onerror = () => reject(new Error('Failed to load SVG image'));
                                svgImg.src = dataUrl;
                            };
                            if (bgImageUrl) {
                                const bgImg = new Image();
                                bgImg.crossOrigin = 'anonymous';
                                bgImg.onload = () => { ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); drawSvgContent(); };
                                bgImg.onerror = () => { drawSvgContent(); };
                                bgImg.src = bgImageUrl;
                            } else {
                                if (bgcolor && bgcolor !== 'transparent') { ctx.fillStyle = bgcolor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
                                drawSvgContent();
                            }
                        });
                    }
                };
            };
        }
        return { async toCanvas(element, options = {}) { initSnapDOM(); const result = await global.snapdom(element, options); return result.toCanvas(); } };
    })();
    global.SnapDOM = SnapDOM;
})(typeof window !== 'undefined' ? window : this);

(function(global) {
    'use strict';
    const SVGTool = {
        sprites: { items: null, skills: null, abilities: null, misc: null, chat_icons: null, avatars: null, avatar_outfits: null },
        initialized: false,
        init() {
            if (this.initialized) return;
            try {
                const rawAssets = localStorage.getItem('preloadedAssets');
                if (rawAssets) {
                    const preloadedAssets = JSON.parse(rawAssets);
                    ['items', 'skills', 'abilities', 'misc', 'chat_icons', 'avatars', 'avatar_outfits'].forEach(type => {
                        const key = `${type}_sprite`;
                        if (preloadedAssets[key]) this.sprites[type] = preloadedAssets[key].split('?')[0];
                    });
                }
            } catch (e) {}
            const missingSprites = Object.keys(this.sprites).filter(k => !this.sprites[k]);
            if (missingSprites.length > 0) {
                document.querySelectorAll("svg use[href*='sprite']").forEach(useEl => {
                    const href = useEl.getAttribute("href") || useEl.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                    if (!href) return;
                    const [filePath] = href.split('#');
                    missingSprites.forEach(type => { if (filePath.includes(`${type}_sprite`) && !this.sprites[type]) this.sprites[type] = filePath; });
                });
            }
            const defaults = { items: '/static/media/items_sprite.6d12eb9d.svg', skills: '/static/media/skills_sprite.3bb4d936.svg', abilities: '/static/media/abilities_sprite.fdd1b4de.svg', misc: '/static/media/misc_sprite.6fa5e97c.svg', chat_icons: '/static/media/chat_icons_sprite.f870cd32.svg', avatars: '/static/media/avatars_sprite.23c6df2d.svg', avatar_outfits: '/static/media/avatar_outfits_sprite.fe228a76.svg' };
            Object.keys(defaults).forEach(key => { if (!this.sprites[key]) this.sprites[key] = defaults[key]; });
            this.initialized = true;
        },
        getSpriteURL(type = 'items') { if (!this.initialized) this.init(); return this.sprites[type] || this.sprites.items; },
        refreshFromDOM() {
            document.querySelectorAll("svg use[href*='sprite']").forEach(useEl => {
                const href = useEl.getAttribute("href") || useEl.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                if (!href) return;
                const [filePath] = href.split('#');
                ['items', 'skills', 'abilities', 'misc', 'chat_icons', 'avatars', 'avatar_outfits'].forEach(type => {
                    if (filePath.includes(`${type}_sprite`) && this.sprites[type] !== filePath) this.sprites[type] = filePath;
                });
            });
        },
        createIcon(hrid, width = 40, height = 40, type = 'items') {
            const iconId = hrid.split('/').pop();
            const spriteURL = this.getSpriteURL(type);
            if (!spriteURL) return `<div style="width:${width}px;height:${height}px;background:rgba(255,255,255,0.1);border-radius:4px;">?</div>`;
            return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${width}"><use href="${spriteURL}#${iconId}"></use></svg>`;
        }
    };
    global.SVGTool = SVGTool;
})(typeof window !== 'undefined' ? window : this);

(function() {
    'use strict';
    
    try {
        const cardStyles = GM_getResourceText('cardStyles');
        if (cardStyles) {
            GM_addStyle(cardStyles);
        }
    } catch (e) {
    }
    
    GM_addStyle(`
        .tm-container[data-mobile="true"] {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
        }
        .tm-container[data-mobile="true"] #tm-iframe {
            min-width: 100% !important;
        }
    `);
    
    const SITE_URL = 'https://papiyas.chat';
    const IntervalManager = {
        intervals: new Map(),
        isPageVisible: true,
        visibilityHandler: null,
        
        init() {
            if (this.visibilityHandler) return;
            this.visibilityHandler = () => {
                this.isPageVisible = !document.hidden;
                if (this.isPageVisible) {
                    this.resumeAll();
                } else {
                    this.pauseAll();
                }
            };
            document.addEventListener('visibilitychange', this.visibilityHandler);
        },
        
        register(name, callback, interval) {
            this.init();
            if (this.intervals.has(name)) {
                this.clear(name);
            }
            const id = setInterval(() => {
                if (this.isPageVisible) {
                    callback();
                }
            }, interval);
            this.intervals.set(name, { id, callback, interval, paused: false });
            return id;
        },
        
        clear(name) {
            const entry = this.intervals.get(name);
            if (entry) {
                clearInterval(entry.id);
                this.intervals.delete(name);
            }
        },
        
        pauseAll() {
            this.intervals.forEach((entry, name) => {
                entry.paused = true;
            });
        },
        
        resumeAll() {
            this.intervals.forEach((entry, name) => {
                entry.paused = false;
            });
        },
        
        clearAll() {
            this.intervals.forEach((entry, name) => {
                clearInterval(entry.id);
            });
            this.intervals.clear();
            if (this.visibilityHandler) {
                document.removeEventListener('visibilitychange', this.visibilityHandler);
                this.visibilityHandler = null;
            }
        }
    };
    const currentHostname = window.location.hostname;
    
    const cardLinkFillStatus = {
        submitFormFilled: false,
        editFormFilled: false,
        submitFormExists: false,
        editFormExists: false,
        currentTimestamp: 0,
        checkFormExistence: function() {
            this.submitFormExists = !!document.querySelector('#cardLink');
            this.editFormExists = !!document.querySelector('#editCardLink');
        },
        markFilled: function(formType, timestamp) {
            if (timestamp !== this.currentTimestamp) {
                this.submitFormFilled = false;
                this.editFormFilled = false;
                this.currentTimestamp = timestamp;
            }
            this.checkFormExistence();
            if (formType === 'submit') {
                this.submitFormFilled = true;
            } else if (formType === 'edit') {
                this.editFormFilled = true;
            }
            const submitDone = !this.submitFormExists || this.submitFormFilled;
            const editDone = !this.editFormExists || this.editFormFilled;
            if (submitDone && editDone) {
                GM_setValue('mwi_card_image_url', '');
                GM_setValue('mwi_card_image_timestamp', 0);
                GM_setValue('mwi_upload_progress', 0);
                GM_setValue('mwi_upload_status', '');
                this.submitFormFilled = false;
                this.editFormFilled = false;
                this.currentTimestamp = 0;
            }
        },
        reset: function() {
            this.submitFormFilled = false;
            this.editFormFilled = false;
            this.submitFormExists = false;
            this.editFormExists = false;
            this.currentTimestamp = 0;
        }
    };
    function enableClipboardPermissionsIfSupported(iframeElement) {
        if (!iframeElement) {
            return;
        }
        try {
            const userAgent = (navigator.userAgent || '').toLowerCase();
            const isChromiumFamily = /chrome|edg|opr|brave|vivaldi/.test(userAgent) && !userAgent.includes('firefox');
            if (!isChromiumFamily) {
                return;
            }
            iframeElement.setAttribute('allow', 'clipboard-read; clipboard-write');
        } catch (error) {
        }
    }
    if (currentHostname === 'papiyas.chat') {
        if (window.self !== window.top) {
            initPapiyasChatFeatures();
        }
        return;
    }

    (function initNavigationLink() {
        window.detectLanguage = function() {
            const lang = localStorage.getItem("i18nextLng") || document.documentElement.lang || navigator.language || 'en';
            return lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
        };
        
        function findSocko(container) {
            return [...container.children].find(el => 
                el.textContent.includes('socko') || el.textContent.includes('战斗榜')
            );
        }
        
        function createLink() {
            const lang = window.detectLanguage();
            const div = document.createElement('div');
            div.className = 'NavigationBar_minorNavigationLink__31K7Y mwi-talent-market-link';
            div.style.cssText = 'cursor: pointer; color: #FFA500;';
            div.textContent = lang === 'zh' ? '人才市场 SHIIN' : 'Talent Market SHIIN';
            div.addEventListener('click', () => {
                if (typeof window.toggleTalentMarketModal === 'function') {
                    window.toggleTalentMarketModal();
                }
            });
            return div;
        }
        
        function insertOrRepositionLink(forceFallback = false) {
            const container = document.querySelector('.NavigationBar_minorNavigationLinks__dbxh7');
            if (!container) return false;
            
            const socko = findSocko(container);
            let link = document.querySelector('.mwi-talent-market-link');
            
            if (link) {
                if (socko && socko.nextElementSibling !== link) {
                    socko.insertAdjacentElement('afterend', link);
                }
                return true;
            }
            
            if (socko) {
                socko.insertAdjacentElement('afterend', createLink());
                return true;
            }
            
            if (forceFallback) {
                container.insertAdjacentElement('afterbegin', createLink());
                return true;
            }
            
            return false;
        }
        
        let attempts = 0;
        const maxAttempts = 15;
        const checkInterval = setInterval(() => {
            attempts++;
            const isLastAttempt = attempts >= maxAttempts;
            if (insertOrRepositionLink(isLastAttempt) || isLastAttempt) {
                clearInterval(checkInterval);
            }
        }, 200);
        
        let throttleTimer = null;
        let initialCheckDone = false;
        const observer = new MutationObserver(() => {
            if (throttleTimer) return;
            throttleTimer = setTimeout(() => {
                throttleTimer = null;
                const linkExists = !!document.querySelector('.mwi-talent-market-link');
                insertOrRepositionLink(!linkExists && initialCheckDone);
            }, 200);
        });
        setTimeout(() => { initialCheckDone = true; }, 3000);
        
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    })();
    
    const CARD_BACKGROUND_IMAGE = 'https://pic1.imgdb.cn/item/691cf6a63203f7be00143865.png';
    const BackgroundImagePreloader = {
        cachedDataURL: null,
        isLoading: false,
        loadPromise: null,
        async preload() {
            if (this.cachedDataURL) {
                return this.cachedDataURL;
            }
            if (this.isLoading) {
                return this.loadPromise;
            }
            this.isLoading = true;
            this.loadPromise = this._loadImage();
            try {
                this.cachedDataURL = await this.loadPromise;
                return this.cachedDataURL;
            } catch (error) {
                this.cachedDataURL = null;
                throw error;
            } finally {
                this.isLoading = false;
                this.loadPromise = null;
            }
        },
        async _loadImage() {
            if (!CARD_BACKGROUND_IMAGE || CARD_BACKGROUND_IMAGE.trim() === '') {
                throw new Error('Background image URL not configured');
            }
            const response = await fetch(CARD_BACKGROUND_IMAGE);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const img = await new Promise((resolve, reject) => {
                const imgEl = new Image();
                imgEl.crossOrigin = 'anonymous';
                imgEl.decoding = 'sync';
                imgEl.onload = () => resolve(imgEl);
                imgEl.onerror = () => reject(new Error('Failed to load background image'));
                imgEl.src = URL.createObjectURL(blob);
            });
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d', { alpha: true, colorSpace: 'srgb', willReadFrequently: false });
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(img.src);
            return canvas.toDataURL('image/png', 1.0);
        },
        getCached() {
            return this.cachedDataURL;
        },
        clear() {
            this.cachedDataURL = null;
            this.isLoading = false;
            this.loadPromise = null;
        }
    };
    if (currentHostname !== 'papiyas.chat') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                BackgroundImagePreloader.preload().catch(() => {});
            });
        } else {
            BackgroundImagePreloader.preload().catch(() => {});
        }
    }
    
    function initCardUploadMonitor() {
        let lastProcessedTimestamp = 0;
        let isUploading = false;
        
        const monitorCallback = async () => {
            if (isUploading) {
                return;
            }
            
            const requestTimestamp = GM_getValue('mwi_card_upload_request', 0);
            
            if (requestTimestamp && requestTimestamp !== lastProcessedTimestamp) {
                lastProcessedTimestamp = requestTimestamp;
                isUploading = true;
                
                GM_setValue('mwi_card_upload_request', 0);
                
                try {
                    let cardElement = document.getElementById('mwi-card-content');
                    
                    if (!cardElement) {
                        if (typeof generateCharacterCard === 'function') {
                            await generateCharacterCard();
                            
                            await new Promise(resolve => setTimeout(resolve, 3000));
                            
                            cardElement = document.getElementById('mwi-card-content');
                            if (!cardElement) {
                                throw new Error('名片生成后仍未找到DOM元素');
                            }
                        } else {
                            throw new Error('generateCharacterCard函数不存在');
                        }
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                    
                    const imageUrl = await generateAndUploadCard();
                    
                    const responseData = {
                        type: 'MWI_UPLOAD_CARD_RESPONSE',
                        success: true,
                        imageUrl: imageUrl
                    };
                    
                    window.postMessage(responseData, '*');
                    
                    const iframes = document.querySelectorAll('iframe');
                    iframes.forEach((iframe, index) => {
                        try {
                            iframe.contentWindow.postMessage(responseData, '*');
                        } catch (e) {}
                    });
                    
                    if (window.parent && window.parent !== window) {
                        try {
                            window.parent.postMessage(responseData, '*');
                        } catch (e) {}
                    }
                    
                } catch (error) {
                    const errorData = {
                        type: 'MWI_UPLOAD_CARD_RESPONSE',
                        success: false,
                        error: error.message
                    };
                    window.postMessage(errorData, '*');
                    
                    const iframes = document.querySelectorAll('iframe');
                    iframes.forEach((iframe) => {
                        try {
                            iframe.contentWindow.postMessage(errorData, '*');
                        } catch (e) {}
                    });
                } finally {
                    isUploading = false;
                }
            }
        };
        
        IntervalManager.register('cardUploadMonitor', monitorCallback, 500);
    }
    function initPapiyasChatFeatures() {
        initFormImportListener();
        initSimulatorDataAutoFill();
        initCardImageUrlAutoFill();
        initEditFormAutoFill();
        initEditCardImageUrlAutoFill();
        initGuildFormAutoFill();
        initEditGuildFormAutoFill();
    }
    function initCardImageUrlAutoFill() {
        let lastProcessedTimestamp = 0;
        function fillCardLink(cardImageUrl, timestamp) {
            if (typeof window.__fillCardLink__ === 'function') {
                window.__fillCardLink__(cardImageUrl);
            }
            lastProcessedTimestamp = timestamp;
            cardLinkFillStatus.markFilled('submit', timestamp);
            GM_setValue('mwi_upload_progress', 0);
            GM_setValue('mwi_upload_status', '');
        }
        function checkAndFillCardLink() {
            try {
                const cardImageUrl = GM_getValue('mwi_card_image_url', '');
                const timestamp = GM_getValue('mwi_card_image_timestamp', 0);
                
                if (cardImageUrl && timestamp && timestamp !== lastProcessedTimestamp) {
                    fillCardLink(cardImageUrl, timestamp);
                    return;
                }
            } catch (error) {
            }
        }
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'MWI_UPLOAD_CARD_RESPONSE' && event.data.success && event.data.imageUrl) {
                const timestamp = Date.now();
                if (timestamp !== lastProcessedTimestamp) {
                    fillCardLink(event.data.imageUrl, timestamp);
                }
            }
        });
        IntervalManager.register('cardImageUrlAutoFill', checkAndFillCardLink, 500);
        setTimeout(checkAndFillCardLink, 100);
    }

    
    function initFormImportListener() {
        function getUserIdFromPage() {
            const pageType = detectPageType();
            let userId = '';
            if (pageType === 'guild') {
                const submitInput = document.querySelector('#guildLeaderId');
                const editInput = document.querySelector('#editGuildLeaderId');
                userId = submitInput?.value?.trim() || editInput?.value?.trim() || '';
            } else {
                const submitInput = document.querySelector('#playerId');
                const editInput = document.querySelector('#editPlayerId');
                userId = submitInput?.value?.trim() || editInput?.value?.trim() || '';
            }
            return userId;
        }
        function detectPageType() {
            const url = window.location.pathname;
            if (url.includes('/guild')) return 'guild';
            if (url.includes('/IC')) return 'ic';
            return 'standard';
        }
        async function getGameData(pageType) {
            const simulatorDataStr = GM_getValue('mwi_simulator_data', null);
            
            if (simulatorDataStr) {
                try {
                    const simulatorData = JSON.parse(simulatorDataStr);
                    return simulatorData;
                } catch (e) {}
            }
            
            const baseData = {
                battleLevel: '123.456',
                combatLevel: '78.901',
                mainAttributeLevel: '45.678',
                characterTotalLevel: '567.890'
            }
            if (pageType === 'guild') {
                return {
                    battleLevel: baseData.battleLevel,
                    combatLevel: baseData.combatLevel,
                    mainAttributeLevel: baseData.mainAttributeLevel,
                    characterTotalLevel: baseData.characterTotalLevel
                };
            } else {
                return baseData;
            }
        }
        async function fillFormData(data, pageType) {
            const commonFields = {
                'battle-level-input': data.battleLevel,
                'combat-level-input': data.combatLevel,
                'main-attribute-level-input': data.mainAttributeLevel,
                'character-total-level-input': data.characterTotalLevel
            };
            const guildFields = {
                'guild-battle-level': data.battleLevel,
                'guild-combat-level': data.combatLevel,
                'guild-main-attribute-level': data.mainAttributeLevel,
                'guild-character-total-level': data.characterTotalLevel
            };
            const fieldsToFill = pageType === 'guild' ? 
                { ...commonFields, ...guildFields } : 
                commonFields;
            for (const [id, value] of Object.entries(fieldsToFill)) {
                const selectors = [
                    `#${id}`,
                    `input[id="${id}"]`,
                    `input[name="${id}"]`,
                    `[data-field="${id}"]`
                ];
                for (const selector of selectors) {
                    const input = document.querySelector(selector);
                    if (input) {
                        input.removeAttribute('readonly');
                        input.removeAttribute('disabled');
                        input.value = value;
                        const events = ['input', 'change', 'blur', 'keyup'];
                        events.forEach(eventType => {
                            input.dispatchEvent(new Event(eventType, { bubbles: true }));
                        });
                        break;
                    }
                }
            }
        }
        function listenImportButton() {
            if (window._MWI_IMPORT_LISTENER_ATTACHED) {
                return;
            }
            
            const importHandler = async (e) => {
                
                try {
                    const pageType = detectPageType();
                    
                    const gameData = await getGameData(pageType);
                    
                    await fillFormData(gameData, pageType);
                    
                    document.dispatchEvent(new CustomEvent('plugin-import-response', {
                        detail: {
                            success: true,
                            data: gameData,
                            pageType: pageType
                        }
                    }));
                    
                    const isInGuildModal = !!(document.querySelector('.guild-submit-modal-content') || document.querySelector('.edit-guild-modal-content'));
                    
                    if (!isInGuildModal) {
                        GM_setValue('mwi_card_upload_request', Date.now());
                    }
                } catch (error) {
                    document.dispatchEvent(new CustomEvent('plugin-import-response', {
                        detail: {
                            success: false,
                            error: error.message
                        }
                    }));
                }
            };
            
            document.addEventListener('plugin-import-request', importHandler);
            window._MWI_IMPORT_LISTENER_ATTACHED = true;
        }
        listenImportButton();
    }
    
    async function generateAndUploadCard() {
        return await autoUploadCard();
    }
    
    window.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'MWI_GENERATE_CARD_REQUEST') {
            try {
                if (typeof generateCharacterCard === 'function') {
                    await generateCharacterCard();
                } else {
                    throw new Error('generateCharacterCard函数未找到');
                }
            } catch (error) {
            }
        }
        if (event.data && event.data.type === 'MWI_UPLOAD_CARD_REQUEST') {
            try {
                const imageUrl = await generateAndUploadCard();
                
                const responseData = {
                    type: 'MWI_UPLOAD_CARD_RESPONSE',
                    success: true,
                    imageUrl: imageUrl
                };
                
                if (event.source) {
                    event.source.postMessage(responseData, event.origin);
                }
                
                window.postMessage(responseData, '*');
                
            } catch (error) {
                const errorData = {
                    type: 'MWI_UPLOAD_CARD_RESPONSE',
                    success: false,
                    error: error.message
                };
                
                if (event.source) {
                    event.source.postMessage(errorData, event.origin);
                }
                window.postMessage(errorData, '*');
            }
        }
        
        if (event.data && event.data.type === 'MODAL_OPENED') {
            GM_setValue('mwi_upload_progress', 0);
            GM_setValue('mwi_upload_status', '');
        }
        
        if (event.data && event.data.type === 'MODAL_CLOSED') {
            GM_setValue('mwi_upload_progress', 0);
            GM_setValue('mwi_upload_status', '');
            GM_setValue('mwi_card_upload_request', 0);
        }
    });
    function initSimulatorDataAutoFill() {
        function attachImportListener() {
            const importBtnSelectors = [
                '#submitForm > div:nth-child(1) > button:nth-child(1)',
                '#submitForm button:first-child'
            ];
            let importBtn = null;
            for (const selector of importBtnSelectors) {
                importBtn = document.querySelector(selector);
                if (importBtn) {
                    break;
                }
            }
            if (!importBtn) {
                const allButtons = document.querySelectorAll('#submitForm button');
                for (const btn of allButtons) {
                    const text = btn.textContent?.trim() || '';
                    if (text.includes('导入数据') || text.includes('Import Data')) {
                        importBtn = btn;
                        break;
                    }
                }
            }
            if (!importBtn) {
                return false;
            }
            if (importBtn.dataset.simulatorListenerAttached) {
                importBtn.removeEventListener('click', importBtn._simulatorClickHandler);
            }
            const clickHandler = async function(e) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const simDataInput = document.querySelector('#simData');
                    if (!simDataInput) {
                        return;
                    }
                    let simulatorData = null;
                    try {
                        const storedData = GM_getValue('mwi_simulator_data', '');
                        if (storedData) {
                            simulatorData = JSON.parse(storedData);
                        }
                    } catch (e) {
                    }
                    if (!simulatorData && window.opener && window.opener.MWI_INTEGRATED) {
                        const getSimData = window.opener.MWI_INTEGRATED.getSimulatorData;
                        if (typeof getSimData === 'function') {
                            simulatorData = getSimData();
                        }
                    }
                    if (!simulatorData && window.MWI_INTEGRATED && typeof window.MWI_INTEGRATED.getSimulatorData === 'function') {
                        simulatorData = window.MWI_INTEGRATED.getSimulatorData();
                    }
                    if (!simulatorData) {
                        const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
                        const message = lang === 'zh' ? '无法获取模拟器数据\n\n请确保:\n1. 已在游戏页面加载完整数据\n2. 游戏页面已接收到WebSocket数据\n3. 刷新游戏页面后再试' : 'Unable to get simulator data\n\nPlease ensure:\n1. Data is fully loaded on game page\n2. Game page has received WebSocket data\n3. Refresh game page and try again';
                        alert(message);
                        return;
                    }
                    const dataString = JSON.stringify(simulatorData, null, 2);
                    simDataInput.value = dataString;
                    simDataInput.dispatchEvent(new Event('input', { bubbles: true }));
                    simDataInput.dispatchEvent(new Event('change', { bubbles: true }));
                    await new Promise(resolve => setTimeout(resolve, 500));
                    let targetWindow = null;
                    if (window.opener && !window.opener.closed) {
                        targetWindow = window.opener;
                    } else if (window.parent && window.parent !== window) {
                        targetWindow = window.parent;
                    } else if (window.top && window.top !== window) {
                        targetWindow = window.top;
                    }
                    if (targetWindow) {
                        targetWindow.postMessage({
                            type: 'MWI_GENERATE_CARD_REQUEST',
                            timestamp: Date.now()
                        }, '*');
                    } else if (window.MWI_INTEGRATED && typeof window.MWI_INTEGRATED.generateCard === 'function') {
                        await window.MWI_INTEGRATED.generateCard();
                    }
                } catch (error) {
                    const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
                    const message = lang === 'zh' ? '填写数据失败: ' + error.message : 'Failed to fill data: ' + error.message;
                    alert(message);
                }
            };
            importBtn._simulatorClickHandler = clickHandler;
            importBtn.addEventListener('click', clickHandler);
            importBtn.dataset.simulatorListenerAttached = 'true';
            return true;
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (!attachImportListener()) {
                        const observer = new MutationObserver(() => {
                            if (attachImportListener()) {
                                observer.disconnect();
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                    }
                }, 500);
            });
        } else {
            setTimeout(() => {
                if (!attachImportListener()) {
                    const observer = new MutationObserver(() => {
                        if (attachImportListener()) {
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            }, 500);
        }
    }
    function initEditFormAutoFill() {
        function attachEditImportListener() {
            const importBtnSelectors = [
                '#editForm > div:nth-child(1) > button:nth-child(1)',
                '#editForm button:first-child',
                '#editForm .import-data-btn'
            ];
            let importBtn = null;
            for (const selector of importBtnSelectors) {
                importBtn = document.querySelector(selector);
                if (importBtn) {
                    break;
                }
            }
            if (!importBtn) {
                return false;
            }
            if (importBtn.dataset.editSimulatorListenerAttached) {
                importBtn.removeEventListener('click', importBtn._editSimulatorClickHandler);
            }
            const clickHandler = async function(e) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const simDataInput = document.querySelector('#editSimData');
                    if (!simDataInput) {
                        return;
                    }
                    let simulatorData = null;
                    try {
                        const storedData = GM_getValue('mwi_simulator_data', '');
                        if (storedData) {
                            simulatorData = JSON.parse(storedData);
                        }
                    } catch (e) {
                    }
                    if (!simulatorData && window.opener && window.opener.MWI_INTEGRATED) {
                        const getSimData = window.opener.MWI_INTEGRATED.getSimulatorData;
                        if (typeof getSimData === 'function') {
                            simulatorData = getSimData();
                        }
                    }
                    if (!simulatorData && window.MWI_INTEGRATED && typeof window.MWI_INTEGRATED.getSimulatorData === 'function') {
                        simulatorData = window.MWI_INTEGRATED.getSimulatorData();
                    }
                    if (!simulatorData) {
                        const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
                        const message = lang === 'zh' ? '无法获取模拟器数据\n\n请确保:\n1. 已在游戏页面加载完整数据\n2. 游戏页面已接收到WebSocket数据\n3. 刷新游戏页面后再试' : 'Unable to get simulator data\n\nPlease ensure:\n1. Data is fully loaded on game page\n2. Game page has received WebSocket data\n3. Refresh game page and try again';
                        alert(message);
                        return;
                    }
                    const dataString = JSON.stringify(simulatorData, null, 2);
                    simDataInput.value = dataString;
                    simDataInput.dispatchEvent(new Event('input', { bubbles: true }));
                    simDataInput.dispatchEvent(new Event('change', { bubbles: true }));
                    await new Promise(resolve => setTimeout(resolve, 500));
                    let targetWindow = null;
                    if (window.opener && !window.opener.closed) {
                        targetWindow = window.opener;
                    } else if (window.parent && window.parent !== window) {
                        targetWindow = window.parent;
                    } else if (window.top && window.top !== window) {
                        targetWindow = window.top;
                    }
                    if (targetWindow) {
                        targetWindow.postMessage({
                            type: 'MWI_GENERATE_CARD_REQUEST',
                            timestamp: Date.now()
                        }, '*');
                    } else if (window.MWI_INTEGRATED && typeof window.MWI_INTEGRATED.generateCard === 'function') {
                        await window.MWI_INTEGRATED.generateCard();
                    }
                } catch (error) {
                    const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
                    const message = lang === 'zh' ? '填写数据失败: ' + error.message : 'Failed to fill data: ' + error.message;
                    alert(message);
                }
            };
            importBtn._editSimulatorClickHandler = clickHandler;
            importBtn.addEventListener('click', clickHandler);
            importBtn.dataset.editSimulatorListenerAttached = 'true';
            return true;
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (!attachEditImportListener()) {
                        const observer = new MutationObserver(() => {
                            if (attachEditImportListener()) {
                                observer.disconnect();
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                    }
                }, 500);
            });
        } else {
            setTimeout(() => {
                if (!attachEditImportListener()) {
                    const observer = new MutationObserver(() => {
                        if (attachEditImportListener()) {
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            }, 500);
        }
    }
    function initGuildFormAutoFill() {
        function attachGuildImportListener() {
            const importBtnSelectors = [
                '#guildForm > div:nth-child(1) > button:nth-child(1)',
                '#guildForm button:first-child',
                '#guildForm .import-data-btn'
            ];
            let importBtn = null;
            for (const selector of importBtnSelectors) {
                importBtn = document.querySelector(selector);
                if (importBtn) {
                    break;
                }
            }
            if (!importBtn) {
                return false;
            }
            if (importBtn.dataset.guildSimulatorListenerAttached) {
                importBtn.removeEventListener('click', importBtn._guildSimulatorClickHandler);
            }
            const clickHandler = async function(e) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const simDataInput = document.querySelector('#guildSimData');
                    if (!simDataInput) {
                        return;
                    }
                    let simulatorData = null;
                    try {
                        const storedData = GM_getValue('mwi_simulator_data', '');
                        if (storedData) {
                            simulatorData = JSON.parse(storedData);
                        }
                    } catch (e) {
                    }
                    if (!simulatorData && window.opener && window.opener.MWI_INTEGRATED) {
                        const getSimData = window.opener.MWI_INTEGRATED.getSimulatorData;
                        if (typeof getSimData === 'function') {
                            simulatorData = getSimData();
                        }
                    }
                    if (!simulatorData && window.MWI_INTEGRATED && typeof window.MWI_INTEGRATED.getSimulatorData === 'function') {
                        simulatorData = window.MWI_INTEGRATED.getSimulatorData();
                    }
                    if (!simulatorData) {
                        const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
                        const message = lang === 'zh' ? '无法获取模拟器数据\n\n请确保:\n1. 已在游戏页面加载完整数据\n2. 游戏页面已接收到WebSocket数据\n3. 刷新游戏页面后再试' : 'Unable to get simulator data\n\nPlease ensure:\n1. Data is fully loaded on game page\n2. Game page has received WebSocket data\n3. Refresh game page and try again';
                        alert(message);
                        return;
                    }
                    const dataString = JSON.stringify(simulatorData, null, 2);
                    simDataInput.value = dataString;
                    simDataInput.dispatchEvent(new Event('input', { bubbles: true }));
                    simDataInput.dispatchEvent(new Event('change', { bubbles: true }));
                } catch (error) {
                    alert('填写数据失败: ' + error.message);
                }
            };
            importBtn._guildSimulatorClickHandler = clickHandler;
            importBtn.addEventListener('click', clickHandler);
            importBtn.dataset.guildSimulatorListenerAttached = 'true';
            return true;
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (!attachGuildImportListener()) {
                        const observer = new MutationObserver(() => {
                            if (attachGuildImportListener()) {
                                observer.disconnect();
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                    }
                }, 500);
            });
        } else {
            setTimeout(() => {
                if (!attachGuildImportListener()) {
                    const observer = new MutationObserver(() => {
                        if (attachGuildImportListener()) {
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            }, 500);
        }
    }
    function initEditGuildFormAutoFill() {
        function attachEditGuildImportListener() {
            const importBtnSelectors = [
                '#editGuildForm > div:nth-child(1) > button:nth-child(1)',
                '#editGuildForm button:first-child',
                '#editGuildForm .import-data-btn'
            ];
            let importBtn = null;
            for (const selector of importBtnSelectors) {
                importBtn = document.querySelector(selector);
                if (importBtn) {
                    break;
                }
            }
            if (!importBtn) {
                return false;
            }
            if (importBtn.dataset.editGuildSimulatorListenerAttached) {
                importBtn.removeEventListener('click', importBtn._editGuildSimulatorClickHandler);
            }
            const clickHandler = async function(e) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const simDataInput = document.querySelector('#editGuildSimData');
                    if (!simDataInput) {
                        return;
                    }
                    let simulatorData = null;
                    try {
                        const storedData = GM_getValue('mwi_simulator_data', '');
                        if (storedData) {
                            simulatorData = JSON.parse(storedData);
                        }
                    } catch (e) {
                    }
                    if (!simulatorData && window.opener && window.opener.MWI_INTEGRATED) {
                        const getSimData = window.opener.MWI_INTEGRATED.getSimulatorData;
                        if (typeof getSimData === 'function') {
                            simulatorData = getSimData();
                        }
                    }
                    if (!simulatorData && window.MWI_INTEGRATED && typeof window.MWI_INTEGRATED.getSimulatorData === 'function') {
                        simulatorData = window.MWI_INTEGRATED.getSimulatorData();
                    }
                    if (!simulatorData) {
                        const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
                        const message = lang === 'zh' ? '无法获取模拟器数据\n\n请确保:\n1. 已在游戏页面加载完整数据\n2. 游戏页面已接收到WebSocket数据\n3. 刷新游戏页面后再试' : 'Unable to get simulator data\n\nPlease ensure:\n1. Data is fully loaded on game page\n2. Game page has received WebSocket data\n3. Refresh game page and try again';
                        alert(message);
                        return;
                    }
                    const dataString = JSON.stringify(simulatorData, null, 2);
                    simDataInput.value = dataString;
                    simDataInput.dispatchEvent(new Event('input', { bubbles: true }));
                    simDataInput.dispatchEvent(new Event('change', { bubbles: true }));
                } catch (error) {
                    alert('填写数据失败: ' + error.message);
                }
            };
            importBtn._editGuildSimulatorClickHandler = clickHandler;
            importBtn.addEventListener('click', clickHandler);
            importBtn.dataset.editGuildSimulatorListenerAttached = 'true';
            return true;
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (!attachEditGuildImportListener()) {
                        const observer = new MutationObserver(() => {
                            if (attachEditGuildImportListener()) {
                                observer.disconnect();
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                    }
                }, 500);
            });
        } else {
            setTimeout(() => {
                if (!attachEditGuildImportListener()) {
                    const observer = new MutationObserver(() => {
                        if (attachEditGuildImportListener()) {
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            }, 500);
        }
    }
    function initEditCardImageUrlAutoFill() {
        let lastProcessedTimestamp = 0;
        function fillEditCardLink(cardImageUrl, timestamp) {
            if (typeof window.__fillCardLink__ === 'function') {
                window.__fillCardLink__(cardImageUrl);
            }
            lastProcessedTimestamp = timestamp;
            cardLinkFillStatus.markFilled('edit', timestamp);
        }
        function checkAndFillEditCardLink() {
            try {
                const cardImageUrl = GM_getValue('mwi_card_image_url', '');
                const timestamp = GM_getValue('mwi_card_image_timestamp', 0);
                
                if (cardImageUrl && timestamp && timestamp !== lastProcessedTimestamp) {
                    fillEditCardLink(cardImageUrl, timestamp);
                    return;
                }
            } catch (error) {
            }
        }
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'MWI_UPLOAD_CARD_RESPONSE' && event.data.success && event.data.imageUrl) {
                const timestamp = Date.now();
                if (timestamp !== lastProcessedTimestamp) {
                    fillEditCardLink(event.data.imageUrl, timestamp);
                }
            }
        });
        IntervalManager.register('editCardImageUrlAutoFill', checkAndFillEditCardLink, 500);
        setTimeout(checkAndFillEditCardLink, 100);
    }
    window.MWI_INTEGRATED = {
        generateCard: null,
        closeCard: null,
        getData: null,
        getSimulatorData: null,
        isDataLoaded: null,
        websocketData: null
    };

    const BuildScoreModule = (function() {
        const MARKET_API_URL = window.location.href.includes("milkywayidle.com")
            ? "https://www.milkywayidle.com/game_data/marketplace.json"
            : "https://www.milkywayidlecn.com/game_data/marketplace.json";

        let cachedMarketData = null;
        let marketDataTimestamp = 0;
        let levelExperienceTable = null;
        let itemDetailMap = null;
        let actionDetailMap = null;
        let houseRoomDetailMap = null;

        const enhanceParams = {
            enhancing_level: 125,
            laboratory_level: 6,
            enhancer_bonus: 5.42,
            glove_bonus: 12.9,
            tea_enhancing: false,
            tea_super_enhancing: false,
            tea_ultra_enhancing: true,
            tea_blessed: true,
            priceAskBidRatio: 1,
        };

        async function fetchMarketData(forceFetch = false) {
            const now = Date.now();
            if (!forceFetch && cachedMarketData && (now - marketDataTimestamp) < 3600000) {
                return cachedMarketData;
            }

            const cachedTimestamp = localStorage.getItem("MWITools_marketAPI_timestamp");
            const cachedJson = localStorage.getItem("MWITools_marketAPI_json");
            if (!forceFetch && cachedTimestamp && cachedJson && (now - parseInt(cachedTimestamp)) < 3600000) {
                try {
                    cachedMarketData = JSON.parse(cachedJson);
                    marketDataTimestamp = parseInt(cachedTimestamp);
                    return cachedMarketData;
                } catch (e) {}
            }

            const sendRequest = typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : null;
            if (!sendRequest) return cachedMarketData;

            const response = await new Promise((resolve) => {
                sendRequest({
                    url: MARKET_API_URL,
                    method: "GET",
                    timeout: 5000,
                    onload: resolve,
                    onerror: () => resolve(null),
                    ontimeout: () => resolve(null)
                });
            });

            if (response && response.status === 200) {
                const jsonObj = JSON.parse(response.responseText);
                if (jsonObj && jsonObj.marketData) {
                    jsonObj.marketData["/items/coin"] = { 0: { a: 1, b: 1 } };
                    jsonObj.marketData["/items/task_token"] = { 0: { a: 0, b: 0 } };
                    cachedMarketData = jsonObj;
                    marketDataTimestamp = now;
                    localStorage.setItem("MWITools_marketAPI_timestamp", now.toString());
                    localStorage.setItem("MWITools_marketAPI_json", JSON.stringify(jsonObj));
                    return jsonObj;
                }
            }
            return cachedMarketData;
        }

        function initClientData(clientData) {
            if (clientData) {
                levelExperienceTable = clientData.levelExperienceTable;
                itemDetailMap = clientData.itemDetailMap;
                actionDetailMap = clientData.actionDetailMap;
                houseRoomDetailMap = clientData.houseRoomDetailMap;
            }
        }

        function getWeightedMarketPrice(marketPrices, ratio = 0.5) {
            if (!marketPrices || !marketPrices[0]) return 0;
            let ask = marketPrices[0].a || 0;
            let bid = marketPrices[0].b || 0;
            if (ask > 0 && bid < 0) bid = ask;
            if (bid > 0 && ask < 0) ask = bid;
            return ask * ratio + bid * (1 - ratio);
        }

        async function getHouseFullBuildPrice(house) {
            const marketData = await fetchMarketData();
            if (!marketData || !houseRoomDetailMap) return 0;

            const roomDetail = houseRoomDetailMap[house.houseRoomHrid];
            if (!roomDetail || !roomDetail.upgradeCostsMap) return 0;

            let cost = 0;
            for (let i = 1; i <= house.level; i++) {
                const levelCosts = roomDetail.upgradeCostsMap[i];
                if (levelCosts) {
                    for (const item of levelCosts) {
                        const prices = marketData.marketData[item.itemHrid];
                        if (prices && prices[0]) {
                            cost += item.count * getWeightedMarketPrice(prices);
                        }
                    }
                }
            }
            return cost;
        }

        async function calculateAbilityScore(combatAbilities) {
            const marketData = await fetchMarketData();
            if (!marketData || !combatAbilities || !levelExperienceTable) return 0;

            const exp50Skills = ["poke", "scratch", "smack", "quick_shot", "water_strike", "fireball", "entangle", "minor_heal"];

            const getNeedBooksToLevel = (targetLevel, expPerBook) => {
                const needExp = levelExperienceTable[targetLevel] || 0;
                return parseFloat(((needExp / expPerBook) + 1).toFixed(1));
            };

            let totalPrice = 0;
            for (const ability of combatAbilities) {
                if (!ability || !ability.abilityHrid) continue;
                const expPerBook = exp50Skills.some(s => ability.abilityHrid.includes(s)) ? 50 : 500;
                const numBooks = getNeedBooksToLevel(ability.level, expPerBook);
                const itemHrid = ability.abilityHrid.replace("/abilities/", "/items/");
                const prices = marketData.marketData[itemHrid];
                if (prices && prices[0]) {
                    totalPrice += numBooks * getWeightedMarketPrice(prices);
                }
            }
            return totalPrice / 1000000;
        }

        function Enhancelate(itemHrid, stopAt, protectAt) {
            const successRate = [50, 45, 45, 40, 40, 40, 35, 35, 35, 35, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
            const itemLevel = itemDetailMap?.[itemHrid]?.itemLevel || 1;

            const effectiveLevel = enhanceParams.enhancing_level +
                (enhanceParams.tea_enhancing ? 3 : 0) +
                (enhanceParams.tea_super_enhancing ? 6 : 0) +
                (enhanceParams.tea_ultra_enhancing ? 8 : 0);

            let totalBonus;
            if (effectiveLevel >= itemLevel) {
                totalBonus = 1 + (0.05 * (effectiveLevel + enhanceParams.laboratory_level - itemLevel) + enhanceParams.enhancer_bonus) / 100;
            } else {
                totalBonus = 1 - 0.5 * (1 - effectiveLevel / itemLevel) + (0.05 * enhanceParams.laboratory_level + enhanceParams.enhancer_bonus) / 100;
            }

            let markov = math.zeros(20, 20);
            for (let i = 0; i < stopAt; i++) {
                const successChance = (successRate[i] / 100.0) * totalBonus;
                const destination = i >= protectAt ? i - 1 : 0;
                if (enhanceParams.tea_blessed) {
                    markov.set([i, i + 2], successChance * 0.01);
                    markov.set([i, i + 1], successChance * 0.99);
                    markov.set([i, destination], 1 - successChance);
                } else {
                    markov.set([i, i + 1], successChance);
                    markov.set([i, destination], 1.0 - successChance);
                }
            }
            markov.set([stopAt, stopAt], 1.0);

            const Q = markov.subset(math.index(math.range(0, stopAt), math.range(0, stopAt)));
            const M = math.inv(math.subtract(math.identity(stopAt), Q));
            const attemptsArray = M.subset(math.index(math.range(0, 1), math.range(0, stopAt)));
            const attempts = math.flatten(math.row(attemptsArray, 0).valueOf()).reduce((a, b) => a + b, 0);
            const protectAttempts = M.subset(math.index(math.range(0, 1), math.range(protectAt, stopAt)));
            const protectArray = typeof protectAttempts === "number" ? [protectAttempts] : math.flatten(math.row(protectAttempts, 0).valueOf());
            const protects = protectArray.map((a, i) => a * markov.get([i + protectAt, i + protectAt - 1])).reduce((a, b) => a + b, 0);

            return { actions: attempts, protectCount: protects };
        }

        function getItemMarketPrice(hrid, marketData) {
            const priceData = marketData?.marketData?.[hrid];
            if (!priceData || !priceData[0]) return 0;
            let ask = priceData[0].a || 0;
            let bid = priceData[0].b || 0;
            if (ask > 0 && bid < 0) bid = ask;
            if (bid > 0 && ask < 0) ask = bid;
            return ask * enhanceParams.priceAskBidRatio + bid * (1 - enhanceParams.priceAskBidRatio);
        }

        function getActionHridFromItemName(name) {
            let newName = name.replace("Milk", "Cow");
            newName = newName.replace("Log", "Tree");
            newName = newName.replace("Cowing", "Milking");
            newName = newName.replace("Rainbow Cow", "Unicow");
            newName = newName.replace("Collector's Boots", "Collectors Boots");
            newName = newName.replace("Knight's Aegis", "Knights Aegis");

            if (!actionDetailMap) return null;

            for (const action of Object.values(actionDetailMap)) {
                if (action.name === newName) {
                    return action.hrid;
                }
            }
            return null;
        }

        function getBaseItemProductionCost(itemName, marketData) {
            const actionHrid = getActionHridFromItemName(itemName);
            if (!actionHrid || !actionDetailMap || !actionDetailMap[actionHrid]) {
                return -1;
            }

            let totalPrice = 0;
            const inputItems = JSON.parse(JSON.stringify(actionDetailMap[actionHrid].inputItems || []));

            for (let item of inputItems) {
                totalPrice += getItemMarketPrice(item.itemHrid, marketData) * item.count;
            }
            totalPrice *= 0.9;

            const upgradedFromItemHrid = actionDetailMap[actionHrid]?.upgradeItemHrid;
            if (upgradedFromItemHrid) {
                totalPrice += getItemMarketPrice(upgradedFromItemHrid, marketData) * 1;
            }

            return totalPrice;
        }

        function getRealisticBaseItemPrice(hrid, marketData) {
            const itemDetail = itemDetailMap?.[hrid];
            if (!itemDetail) return 0;

            const productionCost = getBaseItemProductionCost(itemDetail.name, marketData);
            const priceData = marketData?.marketData?.[hrid];
            const ask = priceData?.[0]?.a || 0;
            const bid = priceData?.[0]?.b || 0;

            let result = 0;

            if (ask > 0) {
                if (bid > 0) {
                    if (ask / bid > 1.3) {
                        result = Math.max(bid, productionCost);
                    } else {
                        result = ask;
                    }
                } else {
                    if (productionCost > 0 && ask / productionCost > 1.3) {
                        result = productionCost;
                    } else {
                        result = Math.max(ask, productionCost);
                    }
                }
            } else {
                if (bid > 0) {
                    result = Math.max(bid, productionCost);
                } else {
                    result = productionCost > 0 ? productionCost : 0;
                }
            }

            return result;
        }

        function getCosts(hrid, marketData) {
            const detail = itemDetailMap?.[hrid];
            if (!detail) return null;

            const baseCost = getRealisticBaseItemPrice(hrid, marketData);
            const protectHrids = detail.protectionItemHrids 
                ? [hrid, "/items/mirror_of_protection", ...detail.protectionItemHrids]
                : [hrid, "/items/mirror_of_protection"];

            let minProtectCost = getRealisticBaseItemPrice(protectHrids[0], marketData);
            for (let i = 1; i < protectHrids.length; i++) {
                const cost = getRealisticBaseItemPrice(protectHrids[i], marketData);
                if (cost > 0 && (minProtectCost <= 0 || cost < minProtectCost)) {
                    minProtectCost = cost;
                }
            }

            let perActionCost = 0;
            if (detail.enhancementCosts) {
                for (const need of detail.enhancementCosts) {
                    const price = need.itemHrid.startsWith("/items/trainee_") ? 250000 : getRealisticBaseItemPrice(need.itemHrid, marketData);
                    perActionCost += price * need.count;
                }
            }

            return { baseCost, minProtectCost, perActionCost };
        }

        async function findBestEnhanceStrat(itemHrid, stopAt) {
            const marketData = await fetchMarketData();
            if (!marketData || !itemDetailMap) return null;

            let best = null;
            for (let protectAt = 2; protectAt <= stopAt; protectAt++) {
                const sim = Enhancelate(itemHrid, stopAt, protectAt);
                const costs = getCosts(itemHrid, marketData);
                if (!costs) continue;
                const totalCost = costs.baseCost + costs.minProtectCost * sim.protectCount + costs.perActionCost * sim.actions;
                if (!best || totalCost < best.totalCost) {
                    best = { protectAt, totalCost };
                }
            }
            return best;
        }

        async function calculateEquipmentScore(characterItems) {
            const marketData = await fetchMarketData();
            if (!marketData || !characterItems) return 0;

            let totalValue = 0;
            for (const item of characterItems) {
                if (item.itemLocationHrid === "/item_locations/inventory") continue;

                const enhanceLevel = item.enhancementLevel || 0;
                const prices = marketData.marketData[item.itemHrid];

                if (enhanceLevel > 1) {
                    const best = await findBestEnhanceStrat(item.itemHrid, enhanceLevel);
                    if (best) {
                        totalValue += item.count * best.totalCost;
                    }
                } else if (prices && prices[0]) {
                    const ask = prices[0].a > 0 ? prices[0].a : 0;
                    const bid = prices[0].b > 0 ? prices[0].b : 0;
                    totalValue += item.count * (ask * 0.5 + bid * 0.5);
                }
            }
            return totalValue / 1000000;
        }

        async function calculateBuildScore(characterData) {
            if (!characterData) return null;

            const battleHouses = ["dining_room", "library", "dojo", "gym", "armory", "archery_range", "mystical_study"];
            let houseScore = 0;

            if (characterData.characterHouseRoomMap) {
                for (const key in characterData.characterHouseRoomMap) {
                    const house = characterData.characterHouseRoomMap[key];
                    if (battleHouses.some(h => house.houseRoomHrid.includes(h))) {
                        houseScore += await getHouseFullBuildPrice(house) / 1000000;
                    }
                }
            }

            const combatAbilities = characterData.combatUnit?.combatAbilities || [];
            const abilityScore = await calculateAbilityScore(combatAbilities);

            const equipmentScore = await calculateEquipmentScore(characterData.characterItems || []);

            const totalScore = houseScore + abilityScore + equipmentScore;

            return {
                total: parseFloat(totalScore.toFixed(1)),
                house: parseFloat(houseScore.toFixed(1)),
                ability: parseFloat(abilityScore.toFixed(1)),
                equipment: parseFloat(equipmentScore.toFixed(1))
            };
        }

        return {
            initClientData,
            fetchMarketData,
            calculateBuildScore
        };
    })();

    const DataStore = {
        raw: null,
        characterSkills: null,
        characterItems: null,
        characterAbilities: null,
        combatUnit: null,
        characterHouseRoomMap: null,
        currentEquipmentMap: {},
        currentActions: [],
        combatSetup: null,
        actionTypeFoodSlotsMap: null,
        actionTypeDrinkSlotsMap: null,
        abilityCombatTriggersMap: null,
        consumableCombatTriggersMap: null,
        characterName: null,
        totalLevel: null,
        buildScore: null,
        weaponType: null,
        weaponTypeEN: null,
        combatLevel: null,
        guildName: null,
        guildLevel: null,
        guildMembers: null,
        characterId: null,
        nameColor: null,
        nameColorHrid: null,
        nameElementHTML: null,
        chatIconHrid: null,
        profileIconHrid: null,
        avatarHrid: null,
        outfitHrid: null,
        itemDetailMap: null,
        actionDetailMap: null,
        abilityDetailMap: null,
        achievementDetailMap: null,
        achievementTierDetailMap: null,
        characterAchievements: null,
        isLoaded: false,
        hookInstalled: false,
        dataLoadedOnce: false,
        gameMode: null
    };
    const WebSocketHook = {
        install() {
            if (DataStore.hookInstalled) {
                return false;
            }
            
            window.addEventListener('mwi_websocket_data', (e) => {
                if (e.detail && e.detail.rawMessage) {
                    this.handleMessage(e.detail.rawMessage);
                }
            });
            
            try {
                const descriptor = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
                if (!descriptor || !descriptor.get) {
                    DataStore.hookInstalled = true;
                    return false;
                }
                const originalGetter = descriptor.get;
                
                if (originalGetter._MWI_HOOKED || originalGetter._MWI_INTEGRATED_HOOKED) {
                    DataStore.hookInstalled = true;
                    return false;
                }
                
                descriptor.get = function interceptData() {
                    const ws = this.currentTarget;
                    if (!(ws instanceof WebSocket)) {
                        return originalGetter.call(this);
                    }
                    const isMWIWebSocket = ws.url && (
                        ws.url.includes("api.milkywayidle.com/ws") ||
                        ws.url.includes("api.milkywayidlecn.com/ws")
                    );
                    if (!isMWIWebSocket) {
                        return originalGetter.call(this);
                    }
                    const rawMessage = originalGetter.call(this);
                    try {
                        Object.defineProperty(this, "data", {
                            value: rawMessage,
                            writable: false,
                            configurable: true
                        });
                    } catch (e) {}
                    
                    try {
                        window.dispatchEvent(new CustomEvent('mwi_websocket_data', {
                            detail: { rawMessage: rawMessage }
                        }));
                    } catch (e) {}
                    
                    WebSocketHook.handleMessage(rawMessage);
                    return rawMessage;
                };
                
                descriptor.get._MWI_HOOKED = true;
                descriptor.get._MWI_INTEGRATED_HOOKED = true;
                
                try {
                    Object.defineProperty(MessageEvent.prototype, "data", descriptor);
                } catch (e) {
                    DataStore.hookInstalled = true;
                    return false;
                }
                DataStore.hookInstalled = true;
                return true;
            } catch (error) {
                DataStore.hookInstalled = true;
                return false;
            }
        },
        handleMessage(rawMessage) {
            try {
                const data = JSON.parse(rawMessage);
                if (DataStore.dataLoadedOnce && data.type === 'init_character_data') {
                    return;
                }
                switch (data.type) {
                    case "init_character_data":
                        this.processCharacterData(data);
                        DataStore.dataLoadedOnce = true;
                        break;
                    case "init_client_data":
                        this.processClientData(data);
                        break;
                    case "items_updated":
                        this.updateItems(data);
                        break;
                    default:
                        break;
                }
            } catch (error) {
            }
        },
        processCharacterData(data) {
            DataStore.raw = data;
            DataStore.characterSkills = data.characterSkills || [];
            DataStore.characterItems = data.characterItems || [];
            DataStore.characterAbilities = data.characterAbilities || [];
            DataStore.combatUnit = data.combatUnit || null;
            DataStore.characterHouseRoomMap = data.characterHouseRoomMap || {};
            DataStore.currentActions = data.characterActions || [];
            DataStore.combatSetup = data.characterCombatSetup || null;
            DataStore.actionTypeFoodSlotsMap = data.actionTypeFoodSlotsMap || {};
            DataStore.actionTypeDrinkSlotsMap = data.actionTypeDrinkSlotsMap || {};
            DataStore.abilityCombatTriggersMap = data.abilityCombatTriggersMap || {};
            DataStore.consumableCombatTriggersMap = data.consumableCombatTriggersMap || {};
            DataStore.characterName = data.characterName || 
                                     data.character?.name || 
                                     data.combatUnit?.name ||
                                     this.getNameFromDOM() ||
                                     "Unknown Adventurer";
            DataStore.characterId = data.character?.id || null;
            DataStore.gameMode = data.gameMode || data.character?.gameMode || null;
            DataStore.nameColor = null;
            DataStore.nameColorHrid = data.character?.nameColorHrid || null;
            DataStore.chatIconHrid = data.character?.chatIconHrid || null;
            DataStore.supporterBadgeHrid = data.character?.specialChatIconHrid || null;
            DataStore.profileIconHrid = data.character?.profileIconHrid || null;
            DataStore.avatarHrid = data.character?.avatarHrid || null;
            DataStore.outfitHrid = data.character?.avatarOutfitHrid || null;
            DataStore.characterAchievements = data.characterAchievements || [];
            const apiUrls = [
                'https://api.milkywayidle.com/v1/users/me',
                'https://api.milkywayidlecn.com/v1/users/me'
            ];
            const tryFetch = (index = 0) => {
                if (index >= apiUrls.length) return;
                fetch(apiUrls[index], { credentials: 'include' })
                    .then(r => {
                        if (!r.ok) throw new Error('HTTP ' + r.status);
                        return r.json();
                    })
                    .then(apiData => {
                        if (apiData?.characters) {
                            const char = apiData.characters.find(c => c.name === DataStore.characterName);
                            if (char) {
                                DataStore.chatIconHrid = char.chatIconHrid || DataStore.chatIconHrid;
                                DataStore.supporterBadgeHrid = char.specialChatIconHrid || DataStore.supporterBadgeHrid;
                                DataStore.avatarHrid = char.avatarHrid || DataStore.avatarHrid;
                                DataStore.outfitHrid = char.avatarOutfitHrid || DataStore.outfitHrid;
                                DataStore.nameColorHrid = char.nameColorHrid || DataStore.nameColorHrid;
                                DataStore.gameMode = char.gameMode || DataStore.gameMode;
                                try {
                                    const updatedSimData = this.generateSimulatorData();
                                    if (updatedSimData) {
                                        GM_setValue('mwi_simulator_data', JSON.stringify(updatedSimData));
                                    }
                                } catch (e) {}
                            }
                        }
                    })
                    .catch(() => tryFetch(index + 1));
            };
            tryFetch();
            DataStore.guildName = data.guild?.name || null;
            DataStore.guildLevel = data.guild?.level || null;
            DataStore.guildMembers = data.guildCharacterMap ? Object.keys(data.guildCharacterMap).length : null;
            DataStore.totalLevel = null;
            DataStore.buildScore = null;
            const self = this;
            const checkTotalLevel = (attempt = 0, maxAttempts = 10) => {
                const totalLevelElem = document.querySelector('.Header_totalLevel__8LY3Q');
                if (totalLevelElem) {
                    const match = totalLevelElem.textContent.match(/(\d+)/);
                    if (match) {
                        DataStore.totalLevel = parseInt(match[1]);
                        window.dispatchEvent(new CustomEvent('mwi_totallevel_updated', { detail: { totalLevel: DataStore.totalLevel } }));
                        try {
                            const simulatorData = self.generateSimulatorData();
                            if (simulatorData) {
                                GM_setValue('mwi_simulator_data', JSON.stringify(simulatorData));
                            }
                        } catch (e) {}
                        return;
                    }
                }
                if (attempt < maxAttempts) {
                    setTimeout(() => checkTotalLevel(attempt + 1, maxAttempts), 500);
                }
            };
            setTimeout(() => checkTotalLevel(), 1500);
            const nameColorHrid = data.character?.nameColorHrid || null;
            DataStore.nameElementHTML = null;
            if (nameColorHrid || DataStore.characterName) {
                setTimeout(() => {
                    const nameContainer = document.querySelector('.CharacterName_characterName__2FqyZ') || 
                                         document.querySelector('[class*="CharacterName_characterName"]');
                    if (nameContainer) {
                        const nameLink = nameContainer.querySelector('a') || nameContainer;
                        const computedStyle = window.getComputedStyle(nameLink);
                        const extractedColor = computedStyle.color;
                        if (extractedColor && extractedColor !== 'rgb(255, 255, 255)' && extractedColor !== 'rgb(0, 0, 0)') {
                            DataStore.nameColor = extractedColor;
                            try {
                                const updatedSimData = self.generateSimulatorData();
                                if (updatedSimData) {
                                    GM_setValue('mwi_simulator_data', JSON.stringify(updatedSimData));
                                }
                            } catch (e) {}
                        }
                        const clonedContainer = nameContainer.cloneNode(true);
                        const chatIcon = clonedContainer.querySelector('.CharacterName_chatIcon__22lxV') ||
                                        clonedContainer.querySelector('[class*="CharacterName_chatIcon"]');
                        if (chatIcon) chatIcon.remove();
                        const clickableElements = clonedContainer.querySelectorAll('a, [href]');
                        clickableElements.forEach(el => {
                            if (el.tagName.toLowerCase() === 'a') {
                                const span = document.createElement('span');
                                span.innerHTML = el.innerHTML;
                                if (el.className) span.className = el.className;
                                if (el.style.cssText) span.style.cssText = el.style.cssText;
                                el.replaceWith(span);
                            } else {
                                el.removeAttribute('href');
                            }
                        });
                        DataStore.nameElementHTML = clonedContainer.outerHTML;
                    }
                }, 2000);
            }
            DataStore.currentEquipmentMap = {};
            DataStore.characterItems.forEach(item => {
                if (item.itemLocationHrid && item.itemLocationHrid !== "/item_locations/inventory") {
                    DataStore.currentEquipmentMap[item.itemLocationHrid] = item;
                }
            });
            const weaponInfo = getWeapon(DataStore.currentEquipmentMap);
            DataStore.weaponType = weaponInfo.zh;
            DataStore.weaponTypeEN = weaponInfo.en;
            DataStore.combatLevel = DataStore.combatUnit?.combatLevel || null;
            if (DataStore.combatLevel === null && DataStore.characterSkills) {
                const stamina = DataStore.characterSkills.find(s => s.skillHrid === '/skills/stamina')?.level || 0;
                const intelligence = DataStore.characterSkills.find(s => s.skillHrid === '/skills/intelligence')?.level || 0;
                const attack = DataStore.characterSkills.find(s => s.skillHrid === '/skills/attack')?.level || 0;
                const defense = DataStore.characterSkills.find(s => s.skillHrid === '/skills/defense')?.level || 0;
                const melee = DataStore.characterSkills.find(s => s.skillHrid === '/skills/melee')?.level || 0;
                const ranged = DataStore.characterSkills.find(s => s.skillHrid === '/skills/ranged')?.level || 0;
                const magic = DataStore.characterSkills.find(s => s.skillHrid === '/skills/magic')?.level || 0;
                const maxCombatSkill = Math.max(melee, ranged, magic);
                const maxAllCombat = Math.max(attack, defense, melee, ranged, magic);
                DataStore.combatLevel = Math.floor(0.1 * (stamina + intelligence + attack + defense + maxCombatSkill) + 0.5 * maxAllCombat);
            }
            DataStore.isLoaded = true;
            window.MWI_INTEGRATED.websocketData = data;
            try {
                const simulatorData = this.generateSimulatorData();
                if (simulatorData) {
                    GM_setValue('mwi_simulator_data', JSON.stringify(simulatorData));
                }
            } catch (e) {}
            window.dispatchEvent(new CustomEvent("mwi_data_ready", {
                detail: { characterName: DataStore.characterName, dataLoaded: true }
            }));
            if (DataStore.itemDetailMap) {
                const self = this;
                (async () => {
                    try {
                        const scoreResult = await BuildScoreModule.calculateBuildScore(DataStore.raw);
                        if (scoreResult) {
                            DataStore.buildScore = scoreResult.total;
                            window.dispatchEvent(new CustomEvent('mwi_buildscore_updated', { detail: { buildScore: DataStore.buildScore } }));
                            try {
                                const simulatorData = self.generateSimulatorData();
                                if (simulatorData) {
                                    GM_setValue('mwi_simulator_data', JSON.stringify(simulatorData));
                                }
                            } catch (e) {}
                        }
                    } catch (e) {}
                })();
            }
        },
        processClientData(data) {
            DataStore.itemDetailMap = data.itemDetailMap || null;
            DataStore.actionDetailMap = data.actionDetailMap || null;
            DataStore.abilityDetailMap = data.abilityDetailMap || null;
            DataStore.achievementDetailMap = data.achievementDetailMap || null;
            DataStore.achievementTierDetailMap = data.achievementTierDetailMap || null;
            BuildScoreModule.initClientData(data);
            if (DataStore.raw) {
                const self = this;
                (async () => {
                    try {
                        const scoreResult = await BuildScoreModule.calculateBuildScore(DataStore.raw);
                        if (scoreResult) {
                            DataStore.buildScore = scoreResult.total;
                            window.dispatchEvent(new CustomEvent('mwi_buildscore_updated', { detail: { buildScore: DataStore.buildScore } }));
                            try {
                                const simulatorData = self.generateSimulatorData();
                                if (simulatorData) {
                                    GM_setValue('mwi_simulator_data', JSON.stringify(simulatorData));
                                }
                            } catch (e) {}
                        }
                    } catch (e) {}
                })();
            }
        },
        updateItems(data) {
            if (!DataStore.isLoaded || !data.characterItems) return;
            DataStore.characterItems = data.characterItems;
            DataStore.currentEquipmentMap = {};
            DataStore.characterItems.forEach(item => {
                if (item.itemLocationHrid && item.itemLocationHrid !== "/item_locations/inventory") {
                    DataStore.currentEquipmentMap[item.itemLocationHrid] = item;
                }
            });
            const weaponInfo = getWeapon(DataStore.currentEquipmentMap);
            DataStore.weaponType = weaponInfo.zh;
            DataStore.weaponTypeEN = weaponInfo.en;
        },
        getNameFromDOM() {
            const selectors = [
                '.CharacterName_characterName__2FqyZ',
                '.Header_name__227rJ',
                '.character-name',
                '.player-name'
            ];
            for (const selector of selectors) {
                const elem = document.querySelector(selector);
                if (elem?.textContent?.trim()) return elem.textContent.trim();
            }
            return null;
        },
        generateSimulatorData() {
            if (!DataStore.characterSkills) {
                return null;
            }
            const foodSlots = (DataStore.actionTypeFoodSlotsMap || {})["/action_types/combat"] || [];
            const drinkSlots = (DataStore.actionTypeDrinkSlotsMap || {})["/action_types/combat"] || [];
            const mapSlots = (slots) => slots.map(slot => ({ itemHrid: slot?.itemHrid || "" }));
            const food = { "/action_types/combat": mapSlots(foodSlots) };
            const drinks = { "/action_types/combat": mapSlots(drinkSlots) };
            const abilities = Array(5).fill({ abilityHrid: "", level: "1" });
            const combatAbilities = DataStore.combatUnit?.combatAbilities || [];
            let normalIdx = 1;
            combatAbilities.forEach(ability => {
                if (!ability) return;
                const detail = DataStore.abilityDetailMap?.[ability.abilityHrid];
                const idx = detail?.isSpecialAbility ? 0 : (normalIdx < abilities.length ? normalIdx++ : -1);
                if (idx >= 0) {
                    abilities[idx] = { abilityHrid: ability.abilityHrid, level: ability.level };
                }
            });
            const triggerMap = Object.assign(
                {}, 
                DataStore.abilityCombatTriggersMap || {}, 
                DataStore.consumableCombatTriggersMap || {}
            );
            const productionTools = [
                "/item_locations/woodcutting_tool",
                "/item_locations/foraging_tool",
                "/item_locations/milking_tool",
                "/item_locations/cheesesmithing_tool",
                "/item_locations/crafting_tool",
                "/item_locations/tailoring_tool",
                "/item_locations/cooking_tool",
                "/item_locations/brewing_tool",
                "/item_locations/alchemy_tool",
                "/item_locations/enhancing_tool"
            ];
            const getSkillLevel = (skillHrid) => {
                return DataStore.characterSkills?.find(s => s.skillHrid === skillHrid)?.level || 0;
            };
            const meleeLevel = getSkillLevel("/skills/melee");
            const rangedLevel = getSkillLevel("/skills/ranged");
            const magicLevel = getSkillLevel("/skills/magic");
            return {
                player: {
                    defenseLevel: getSkillLevel("/skills/defense"),
                    magicLevel: magicLevel,
                    attackLevel: getSkillLevel("/skills/attack"),
                    intelligenceLevel: getSkillLevel("/skills/intelligence"),
                    staminaLevel: getSkillLevel("/skills/stamina"),
                    meleeLevel: meleeLevel,
                    rangedLevel: rangedLevel,
                    equipment: Object.entries(DataStore.currentEquipmentMap)
                        .filter(([location]) => !productionTools.includes(location))
                        .map(([location, item]) => ({
                            itemLocationHrid: location,
                            itemHrid: item.itemHrid,
                            enhancementLevel: item.enhancementLevel || 0
                        }))
                },
                food: food,
                drinks: drinks,
                abilities: abilities,
                triggerMap: triggerMap,
                houseRooms: Object.fromEntries(
                    Object.entries(DataStore.characterHouseRoomMap || {}).map(([hrid, data]) => [hrid, data.level || 0])
                ),
                characterName: DataStore.characterName || "Unknown Adventurer",
                totalLevel: DataStore.totalLevel || null,
                buildScore: DataStore.buildScore || null,
                combatLevel: DataStore.combatLevel || null,
                weaponType: DataStore.weaponTypeEN || null,
                guildName: DataStore.guildName || null,
                guildLevel: DataStore.guildLevel || null,
                guildMembers: DataStore.guildMembers || null,
                nameColorHrid: DataStore.nameColorHrid || null,
                chatIconHrid: DataStore.chatIconHrid || null,
                supporterBadgeHrid: DataStore.supporterBadgeHrid || null,
                gameMode: DataStore.gameMode || null
            };
        }
    };
    const isZH = !['en'].some(lang => localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith(lang));
    const currentLang = isZH ? 'zh' : 'en';
    const i18n = {
        combat: { zh: '战斗', en: 'Combat' },
        intelligence: { zh: '智力', en: 'Intelligence' },
        stamina: { zh: '耐力', en: 'Stamina' },
        attack: { zh: '攻击', en: 'Attack' },
        defense: { zh: '防御', en: 'Defense' },
        melee: { zh: '近战', en: 'Melee' },
        ranged: { zh: '远程', en: 'Ranged' },
        magic: { zh: '魔法', en: 'Magic' },
        house: { zh: '房屋', en: 'House' },
        dojo: { zh: '道场', en: 'Dojo' },
        library: { zh: '图书馆', en: 'Library' },
        dining_room: { zh: '餐厅', en: 'Dining Room' },
        mystical_study: { zh: '神秘研究室', en: 'Mystical Study' },
        armory: { zh: '军械库', en: 'Armory' },
        gym: { zh: '健身房', en: 'Gym' },
        archery_range: { zh: '射箭场', en: 'Archery Range' },
        back: { zh: '背部', en: 'Back' },
        head: { zh: '头部', en: 'Head' },
        trinket: { zh: '饰品', en: 'Trinket' },
        neck: { zh: '项链', en: 'Neck' },
        main_hand: { zh: '主手', en: 'Main Hand' },
        body: { zh: '身体', en: 'Body' },
        off_hand: { zh: '副手', en: 'Off Hand' },
        earrings: { zh: '耳环', en: 'Earrings' },
        hands: { zh: '手套', en: 'Hands' },
        legs: { zh: '腿部', en: 'Legs' },
        pouch: { zh: '腰包', en: 'Pouch' },
        ring: { zh: '戒指', en: 'Ring' },
        feet: { zh: '鞋子', en: 'Feet' },
        charm: { zh: '护符', en: 'Charm' },
        two_hand: { zh: '双手', en: 'Two Hand' },
        food: { zh: '食物', en: 'Food' },
        drink: { zh: '饮料', en: 'Drink' },
        abilities: { zh: '技能', en: 'Abilities' },
        level: { zh: 'Lv', en: 'Lv' },
        unknown: { zh: '未知', en: 'Unknown' }
    };
    function t(key) {
        return i18n[key]?.[currentLang] || key;
    }
    const ClientData = new class {
        #data = null;
        #hrid2name = {};
        #name2hrid = {};
        #loaded = false;
        init() {
            if (this.#loaded) return;
            const compressed = localStorage.getItem("initClientData");
            if (!compressed) return;
            try {
                this.#data = JSON.parse(LZString.decompressFromUTF16(compressed));
                this.#buildMappings();
                this.#loaded = true;
                DataStore.itemDetailMap = this.#data.itemDetailMap;
                DataStore.actionDetailMap = this.#data.actionDetailMap;
                DataStore.abilityDetailMap = this.#data.abilityDetailMap;
                DataStore.achievementDetailMap = this.#data.achievementDetailMap;
                DataStore.achievementTierDetailMap = this.#data.achievementTierDetailMap;
            } catch (error) {
            }
        }
        get() {
            if (!this.#loaded) this.init();
            return this.#data;
        }
        #buildMappings() {
            if (!this.#data) return;
            const maps = [
                this.#data.itemDetailMap,
                this.#data.abilityDetailMap,
                this.#data.actionDetailMap,
                this.#data.skillDetailMap
            ];
            for (const detailMap of maps) {
                if (!detailMap) continue;
                for (const hrid in detailMap) {
                    const detail = detailMap[hrid];
                    if (detail && detail.name) {
                        this.#hrid2name[hrid] = detail.name;
                        this.#name2hrid[detail.name] = hrid;
                    }
                }
            }
        }
        hrid2name(hrid) {
            if (!hrid) return hrid;
            if (!this.#loaded) this.init();
            return this.#hrid2name[hrid] || hrid.split('/').pop();
        }
        name2hrid(name) {
            if (!name) return name;
            if (!this.#loaded) this.init();
            return this.#name2hrid[name] || name;
        }
        getItemDetail(hrid) {
            if (!this.#loaded) this.init();
            return this.#data?.itemDetailMap?.[hrid] || null;
        }
    };
    function getWeapon(wearableItemMap) {
        let hand = wearableItemMap['/item_locations/main_hand']?.itemHrid;
        if (!hand) {
            hand = wearableItemMap['/item_locations/two_hand']?.itemHrid;
        }
        if (!hand) return { zh: null, en: null };
        const weapon = hand.includes('/') ? hand.split('/').pop() : hand;
        if (!weapon) return { zh: null, en: null };
        const weaponTypeMap = {
            "水法": "Water",
            "火法": "Fire",
            "自然法": "Nature",
            "弓": "Bow",
            "弩": "Crossbow",
            "盾": "Bulwark",
            "枪": "Spear",
            "锤": "Flail",
            "剑": "Sword"
        };
        let typeZH = null;
        const bowWeapons = ["gobo_shooter", "cursed_bow", "cursed_bow_refined"];
        const waterWeapons = ["rippling_trident", "rippling_trident_refined", "frost_staff", "frost_staff_refined"];
        const fireWeapons = ["gobo_boomstick", "blazing_trident", "blazing_trident_refined", "infernal_battlestaff", "infernal_battlestaff_refined"];
        const natureWeapons = ["jackalope_staff", "jackalope_staff_refined", "blooming_trident", "blooming_trident_refined"];
        const swordWeapons = ["gobo_slasher", "werewolf_slasher", "werewolf_slasher_refined"];
        const maceWeapons = ["gobo_smasher", "granite_bludgeon", "granite_bludgeon_refined", "chaotic_flail", "chaotic_flail_refined"];
        const spearWeapons = ["gobo_stabber"];
        const bulwarkWeapons = ["griffin_bulwark", "griffin_bulwark_refined"];
        if (weapon.includes("_bow") || bowWeapons.includes(weapon)) {
            typeZH = "弓";
        } else if (weapon.includes("_crossbow")) {
            typeZH = "弩";
        } else if (weapon.includes("_water_staff") || waterWeapons.includes(weapon)) {
            typeZH = "水法";
        } else if (weapon.includes("_fire_staff") || fireWeapons.includes(weapon)) {
            typeZH = "火法";
        } else if (weapon.includes("_nature_staff") || natureWeapons.includes(weapon)) {
            typeZH = "自然法";
        } else if (weapon.includes("_sword") || swordWeapons.includes(weapon)) {
            if (weapon === "cheese_sword") return { zh: null, en: null };
            typeZH = "剑";
        } else if (weapon.includes("_mace") || maceWeapons.includes(weapon)) {
            typeZH = "锤";
        } else if (weapon.includes("_spear") || spearWeapons.includes(weapon)) {
            typeZH = "枪";
        } else if (weapon.includes("_bulwark") || bulwarkWeapons.includes(weapon)) {
            typeZH = "盾";
        }
        return {
            zh: typeZH,
            en: typeZH ? weaponTypeMap[typeZH] : null
        };
    }
    function getAllData() {
        if (!DataStore.isLoaded) {
            return null;
        }
        return {
            characterName: DataStore.characterName,
            characterId: DataStore.characterId,
            totalLevel: DataStore.totalLevel,
            buildScore: DataStore.buildScore,
            combatLevel: DataStore.combatLevel,
            weaponType: DataStore.weaponType,
            weaponTypeEN: DataStore.weaponTypeEN,
            guildName: DataStore.guildName,
            guildLevel: DataStore.guildLevel,
            guildMembers: DataStore.guildMembers,
            displayName: DataStore.characterName || 'Player 1',
            nameColor: DataStore.nameColor,
            chatIconHrid: DataStore.chatIconHrid,
            profileIconHrid: DataStore.profileIconHrid,
            avatarHrid: DataStore.avatarHrid,
            outfitHrid: DataStore.outfitHrid,
            characterSkills: DataStore.characterSkills,
            characterItems: DataStore.characterItems,
            characterAbilities: DataStore.characterAbilities,
            equipment: DataStore.currentEquipmentMap,
            combatUnit: DataStore.combatUnit,
            houseRooms: DataStore.characterHouseRoomMap,
            foodSlots: DataStore.actionTypeFoodSlotsMap,
            drinkSlots: DataStore.actionTypeDrinkSlotsMap,
            combatSetup: DataStore.combatSetup
        };
    }
    function getSimulatorData() {
        return WebSocketHook.generateSimulatorData();
    }
    function isDataReady() {
        return DataStore.isLoaded;
    }
    function waitForData(timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (DataStore.isLoaded) {
                resolve(getAllData());
                return;
            }
            const timer = setTimeout(() => {
                window.removeEventListener('mwi_data_ready', handler);
                reject(new Error('Data loading timeout'));
            }, timeout);
            const handler = () => {
                clearTimeout(timer);
                resolve(getAllData());
            };
            window.addEventListener('mwi_data_ready', handler, { once: true });
        });
    }
    function toggleTalentMarketModal() {
        const existing = document.getElementById('talent-market-modal');
        if (existing) {
            if (existing.style.display === 'none') {
                existing.style.display = '';
                if (existing._onShow) existing._onShow();
            } else {
                if (existing._onHide) existing._onHide();
                existing.style.display = 'none';
            }
            return;
        }
        createTalentMarketModal();
    }
    window.toggleTalentMarketModal = toggleTalentMarketModal;
    function createTalentMarketModal() {
        const isZH = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh");
        const I18N = {
            zh: {
                title: 'Talent Market',
                back: '返回',
                refresh: '刷新',
                close: '关闭',
                loading: '加载中...',
                loadingSlow: '加载时间较长,请稍候...',
                loadFailed: '加载失败,请检查网络连接',
                loadTimeout: '加载超时，请检查网络连接或刷新页面',
            },
            en: {
                title: 'Talent Market',
                back: 'Back',
                refresh: 'Refresh',
                close: 'Close',
                loading: 'Loading...',
                loadingSlow: 'Loading is taking longer...',
                loadFailed: 'Failed to load, check connection',
                loadTimeout: 'Loading timeout, please check network connection or refresh the page',
            }
        };
        const t = I18N[isZH ? 'zh' : 'en'];
        const LAYOUT_CONFIG = {
            MIN_WIDTH: 540,
            MIN_HEIGHT: 787,
            NARROW_THRESHOLD: 970,
            MOBILE_THRESHOLD: 550,
            MARGIN_RATIO: 0.05,
            VIEWPORT_RATIO: 0.9,
            LOAD_TIMEOUT: 10000,
            MESSAGING_DELAY: 200,
            RESIZE_DEBOUNCE: 150
        };
        const existing = document.getElementById('talent-market-modal');
        if (existing) {
            return existing;
        }
        const modal = document.createElement('div');
        modal.id = 'talent-market-modal';
        modal._currentUrl = SITE_URL;
        modal.innerHTML = `
            <div class="tm-overlay">
                <div class="tm-container">
                    <div class="tm-header">
                        <button class="tm-btn-refresh" title="${t.refresh}">${t.refresh}</button>
                        <div class="tm-title">
                            <h2>${t.title}</h2>
                        </div>
                        <div class="tm-controls">
                            <button class="tm-btn-close" title="${t.close}">${t.close}</button>
                        </div>
                    </div>
                    <div class="tm-content">
                        <iframe 
                            id="tm-iframe" 
                            src="${SITE_URL}?embedded=true"
                            frameborder="0"
                            loading="eager"
                            fetchpriority="high"
                        ></iframe>

                        <div class="tm-loading">
                            <div class="tm-spinner"></div>
                            <p>${t.loading}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            const container = modal.querySelector('.tm-container');
            initCardUploadMonitor();
            bindTalentMarketEvents(modal, t, LAYOUT_CONFIG);
            requestAnimationFrame(() => {
                document.body.appendChild(modal);
                updateScrollbarState(container, LAYOUT_CONFIG);
            });
        const iframe = modal.querySelector('#tm-iframe');
        enableClipboardPermissionsIfSupported(iframe);
        const loadingEl = modal.querySelector('.tm-loading');
        let loadTimeout = null;
        const handleResize = () => {
            updateScrollbarState(container, LAYOUT_CONFIG);
            updateIframeViewportInfo(iframe, container.offsetWidth, container.offsetHeight, LAYOUT_CONFIG);
        };
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === container) {
                    handleResize();
                }
            }
        });
        resizeObserver.observe(container);
        modal._onHide = () => {
            IntervalManager.clear('cardUploadMonitor');
            window._MWI_UPLOAD_IN_PROGRESS = false;
            GM_setValue('mwi_card_upload_request', 0);
            GM_setValue('mwi_card_image_url', '');
            GM_setValue('mwi_card_image_timestamp', 0);
            GM_setValue('mwi_upload_progress', 0);
            GM_setValue('mwi_upload_status', '');
            cardLinkFillStatus.reset();
            closeCard();
        };
        modal._onShow = () => {
            initCardUploadMonitor();
            updateScrollbarState(container, LAYOUT_CONFIG);
            updateIframeViewportInfo(iframe, container.offsetWidth, container.offsetHeight, LAYOUT_CONFIG);
        };
        modal._cleanup = () => {
            resizeObserver.disconnect();
            document.removeEventListener('keydown', handleEscape);
            if (loadTimeout) clearTimeout(loadTimeout);
            modal._onHide();
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                toggleTalentMarketModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        iframe.addEventListener('load', () => {
            if (loadTimeout) clearTimeout(loadTimeout);
            loadingEl.style.display = 'none';
            iframe._loaded = true;
            setupIframeMessaging(iframe, LAYOUT_CONFIG);
            updateIframeViewportInfo(iframe, container.offsetWidth, container.offsetHeight, LAYOUT_CONFIG);
        }, { once: true });
        loadTimeout = setTimeout(() => {
            if (loadingEl.style.display !== 'none') {
                loadingEl.innerHTML = `<p style="color:#fbbf24;">${t.loadingSlow}</p>`;
            }
        }, LAYOUT_CONFIG.LOAD_TIMEOUT);
        iframe.addEventListener('error', () => {
            if (loadTimeout) clearTimeout(loadTimeout);
            loadingEl.innerHTML = `<p style="color:#ef4444;">${t.loadFailed}</p>`;
        }, { once: true });
        return modal;
    }
    function bindTalentMarketEvents(modal, t, LAYOUT_CONFIG) {
        const loadingEl = modal.querySelector('.tm-loading');

        const refreshIframe = () => {
            const iframe = modal.querySelector('#tm-iframe');
            if (iframe) {
                if (loadingEl) {
                    loadingEl.style.display = 'flex';
                    loadingEl.innerHTML = `<div class="tm-spinner"></div><p>${t.loading}</p>`;
                }
                const hideLoadingOnLoad = () => {
                    if (loadingEl) {
                        loadingEl.style.display = 'none';
                    }
                };
                iframe.addEventListener('load', hideLoadingOnLoad, { once: true });
                const currentSrc = iframe.src;
                iframe.src = 'about:blank';
                setTimeout(() => {
                    iframe.src = currentSrc;
                }, 50);
            }
        };
        modal.querySelector('.tm-btn-close').addEventListener('click', () => {
            if (modal._onHide) modal._onHide();
            modal.style.display = 'none';
        });
        modal.querySelector('.tm-btn-refresh').addEventListener('click', () => {
            refreshIframe();
        });
    }
    function updateIframeViewportInfo(iframe, width, height, LAYOUT_CONFIG) {
        if (!iframe || !iframe.contentWindow || !iframe._loaded) return;
        if (!iframe.src || !iframe.src.startsWith(SITE_URL)) return;
        const isMobile = width < LAYOUT_CONFIG.MOBILE_THRESHOLD;
        const isNarrow = width < LAYOUT_CONFIG.NARROW_THRESHOLD;
        try {
            iframe.contentWindow.postMessage({
                type: 'VIEWPORT_UPDATE',
                data: {
                    width: width,
                    height: height,
                    isMobile: isMobile,
                    isNarrow: isNarrow
                }
            }, SITE_URL);
        } catch (e) {
        }
    }
    function setupIframeMessaging(iframe, LAYOUT_CONFIG) {
        const container = iframe.closest('.tm-container');
        if (container) {
            setTimeout(() => {
                updateIframeViewportInfo(iframe, container.offsetWidth, container.offsetHeight, LAYOUT_CONFIG);
            }, LAYOUT_CONFIG.MESSAGING_DELAY);
        }
        if (window._talentMarketMessageListenerAdded) return;
        window._talentMarketMessageListenerAdded = true;
        window.addEventListener('message', (event) => {
            if (event.origin !== SITE_URL) return;
            const { type, data } = event.data;
            switch(type) {
                case 'CLOSE_MODAL':
                    const modal = document.getElementById('talent-market-modal');
                    if (modal) {
                        if (modal._cleanup) modal._cleanup();
                        modal.remove();
                    }
                    break;
            }
        });
    }
    function updateScrollbarState(container, LAYOUT_CONFIG) {
        const currentWidth = container.offsetWidth;
        const currentHeight = container.offsetHeight;
        if (currentWidth < LAYOUT_CONFIG.NARROW_THRESHOLD) {
            container.setAttribute('data-narrow', 'true');
        } else {
            container.removeAttribute('data-narrow');
        }
        if (currentHeight < LAYOUT_CONFIG.MIN_HEIGHT) {
            container.setAttribute('data-short', 'true');
        } else {
            container.removeAttribute('data-short');
        }
        if (currentWidth < LAYOUT_CONFIG.MOBILE_THRESHOLD) {
            container.setAttribute('data-mobile', 'true');
        } else {
            container.removeAttribute('data-mobile');
        }
    }
    function generateRandomGradientBorder() {
        const colors = [
            ['#8B5CF6', '#EC4899', '#F59E0B'],
            ['#A855F7', '#EC4899', '#3B82F6'],
            ['#9333EA', '#DB2777', '#F59E0B'],
            ['#C084FC', '#E879F9', '#F472B6'],
            ['#7C3AED', '#A78BFA', '#06B6D4'],
            ['#9D4EDD', '#C77DFF', '#E0AAFF'],
            ['#BF40BF', '#DA70D6', '#EE82EE'],
            ['#A78BFA', '#C084FC', '#E879F9'],
            ['#DDA0DD', '#EE82EE', '#DA70D6'],
            ['#BA55D3', '#9370DB', '#8A2BE2'],
            ['#D8BFD8', '#DDA0DD', '#EE82EE'],
            ['#9B59B6', '#8E44AD', '#9370DB'],
            ['#B19CD9', '#CAB2D6', '#E0BBE4'],
            ['#8B008B', '#9932CC', '#BA55D3'],
            ['#7B68EE', '#9370DB', '#BA55D3'],
            ['#3B82F6', '#8B5CF6', '#06B6D4'],
            ['#60A5FA', '#A78BFA', '#34D399'],
            ['#2DD4BF', '#22D3EE', '#3B82F6'],
            ['#4361EE', '#4895EF', '#4CC9F0'],
            ['#0096C7', '#00B4D8', '#48CAE4'],
            ['#5DADE2', '#85C1E9', '#AED6F1'],
            ['#4FC3F7', '#29B6F6', '#03A9F4'],
            ['#64B5F6', '#42A5F5', '#2196F3'],
            ['#1E90FF', '#00BFFF', '#87CEEB'],
            ['#4169E1', '#6495ED', '#7B68EE'],
            ['#6A5ACD', '#7B68EE', '#9370DB'],
            ['#00CED1', '#48D1CC', '#AFEEEE'],
            ['#20B2AA', '#48D1CC', '#5F9EA0'],
            ['#06B6D4', '#10B981', '#3B82F6'],
            ['#14B8A6', '#22C55E', '#6366F1'],
            ['#0EA5E9', '#06B6D4', '#8B5CF6'],
            ['#34D399', '#10B981', '#14B8A6'],
            ['#2DD4BF', '#5EEAD4', '#99F6E4'],
            ['#06FFA5', '#00D9FF', '#00FFFF'],
            ['#18FFFF', '#64FFDA', '#00E5FF'],
            ['#1DE9B6', '#00E676', '#00C853'],
            ['#26C6DA', '#00ACC1', '#0097A7'],
            ['#4DD0E1', '#26C6DA', '#00BCD4'],
            ['#00E5FF', '#00FFFF', '#00FA9A'],
            ['#00CED1', '#40E0D0', '#48D1CC'],
            ['#20B2AA', '#3CB371', '#2E8B57'],
            ['#00FA9A', '#00FF7F', '#3CB371'],
            ['#7FFFD4', '#40E0D0', '#00CED1'],
            ['#EC4899', '#F472B6', '#A855F7'],
            ['#F472B6', '#FBCFE8', '#C084FC'],
            ['#F43F5E', '#FB7185', '#FCA5A5'],
            ['#FF006E', '#FF499E', '#FF99C8'],
            ['#E91E63', '#F06292', '#F48FB1'],
            ['#FF1744', '#FF5252', '#FF8A80'],
            ['#FF4081', '#FF80AB', '#FFB2DD'],
            ['#F50057', '#FF4081', '#FF80AB'],
            ['#FF6F91', '#FFC0CB', '#FFB6C1'],
            ['#FF69B4', '#FFB6C1', '#FFC0CB'],
            ['#FF1493', '#FF69B4', '#FFB6C1'],
            ['#DB7093', '#C71585', '#FF1493'],
            ['#FFB3DE', '#FFCCDE', '#FFE5F0'],
            ['#FFC0CB', '#FFB6C1', '#FF69B4'],
            ['#FF82AB', '#FF6EB4', '#FF1493'],
            ['#F59E0B', '#EF4444', '#EC4899'],
            ['#FBBF24', '#F97316', '#DC2626'],
            ['#FB923C', '#FBBF24', '#EAB308'],
            ['#FCD34D', '#FDE047', '#FEF08A'],
            ['#FB7185', '#FBBF24', '#34D399'],
            ['#FFBA08', '#FAA307', '#F48C06'],
            ['#FFD60A', '#FFC300', '#FFB700'],
            ['#FFB627', '#FFA500', '#FF8C00'],
            ['#FFEB3B', '#FFC107', '#FF9800'],
            ['#FFD54F', '#FFCA28', '#FFC107'],
            ['#FFE4B5', '#FFDAB9', '#EEE8AA'],
            ['#FFD700', '#FFA500', '#FF8C00'],
            ['#FFDF00', '#FFED4E', '#FFF176'],
            ['#FDB813', '#FDBB30', '#FFCA28'],
            ['#FFDB58', '#FFD700', '#FFD54F'],
            ['#F87171', '#FCA5A5', '#FBBF24'],
            ['#FF0000', '#FF4500', '#FF6347'],
            ['#DC143C', '#FF1493', '#FF69B4'],
            ['#FF6B6B', '#FF8787', '#FFA0A0'],
            ['#FF5252', '#FF7777', '#FF9999'],
            ['#EF5350', '#E57373', '#EF9A9A'],
            ['#CD5C5C', '#DC143C', '#B22222'],
            ['#F08080', '#FA8072', '#E9967A'],
            ['#FF4500', '#FF6347', '#FF7F50'],
            ['#C71585', '#FF1493', '#FF69B4'],
            ['#B22222', '#DC143C', '#FF0000'],
            ['#FF6347', '#FF7F50', '#FFA07A'],
            ['#B0E0E6', '#87CEEB', '#4682B4'],
            ['#ADD8E6', '#87CEFA', '#00BFFF'],
            ['#E0F2F7', '#B2EBF2', '#80DEEA'],
            ['#AFEEEE', '#00CED1', '#48D1CC'],
            ['#B0E2FF', '#87CEFA', '#6495ED'],
            ['#E0FFFF', '#AFEEEE', '#7FFFD4'],
            ['#F0F8FF', '#E6F2FF', '#CCE5FF'],
            ['#B0E0E6', '#ADD8E6', '#87CEEB'],
            ['#FFD54F', '#FFEE58', '#FFF176'],
            ['#81C784', '#A5D6A7', '#C8E6C9'],
            ['#64B5F6', '#90CAF9', '#BBDEFB'],
            ['#FF8A65', '#FFAB91', '#FFCCBC'],
            ['#BA68C8', '#CE93D8', '#E1BEE7'],
            ['#4FC3F7', '#81D4FA', '#B3E5FC'],
            ['#FFD740', '#FFEA00', '#FFFF00'],
            ['#FF6E40', '#FF9E80', '#FFCCBC'],
            ['#69F0AE', '#B9F6CA', '#E8F5E9'],
            ['#FF4081', '#FF80AB', '#FFB2DD'],
            ['#18FFFF', '#64FFDA', '#A7FFEB'],
            ['#EEFF41', '#F4FF81', '#F9FFC4'],
            ['#FF5252', '#FF8A80', '#FFB2B2'],
            ['#536DFE', '#8C9EFF', '#B6C2FF'],
            ['#FFAB40', '#FFD180', '#FFE0B2'],
            ['#FF6B9D', '#C06C84', '#6C5B7B', '#355C7D'],
            ['#FDDB92', '#F8B195', '#F67280', '#C06C84'],
            ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5'],
            ['#96CEB4', '#FFEAA7', '#DFE6E9', '#74B9FF'],
            ['#FDA085', '#F6D365', '#FBC2EB', '#A6C1EE'],
            ['#9890E3', '#B721FF', '#21D4FD'],
            ['#FBC2EB', '#A18CD1', '#6A85B6', '#BAE1FF'],
            ['#FF9A9E', '#FAD0C4', '#FAD0C4', '#FBC2EB'],
            ['#F8CDDA', '#1D2B64', '#F8CDDA'],
            ['#13547A', '#80D0C7', '#50E3C2']
        ];
        const randomColors = colors[Math.floor(Math.random() * colors.length)];
        const angles = [45, 90, 135, 180, 225, 270, 315, 360];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        return `linear-gradient(${angle}deg, ${randomColors.join(', ')})`;
    }
    function getCompletedAchievementTiers() {
        const achievements = DataStore.characterAchievements || [];
        const achievementDetailMap = DataStore.achievementDetailMap || {};
        const tierCounts = {
            '/achievement_tiers/beginner': { completed: 0, total: 0 },
            '/achievement_tiers/novice': { completed: 0, total: 0 },
            '/achievement_tiers/adept': { completed: 0, total: 0 },
            '/achievement_tiers/veteran': { completed: 0, total: 0 },
            '/achievement_tiers/elite': { completed: 0, total: 0 },
            '/achievement_tiers/champion': { completed: 0, total: 0 }
        };
        for (const hrid in achievementDetailMap) {
            const detail = achievementDetailMap[hrid];
            if (detail && detail.tierHrid && tierCounts[detail.tierHrid]) {
                tierCounts[detail.tierHrid].total++;
            }
        }
        achievements.forEach(ach => {
            if (ach.isCompleted) {
                const detail = achievementDetailMap[ach.achievementHrid];
                if (detail && detail.tierHrid && tierCounts[detail.tierHrid]) {
                    tierCounts[detail.tierHrid].completed++;
                }
            }
        });
        const completedTiers = [];
        const tierOrder = ['beginner', 'novice', 'adept', 'veteran', 'elite', 'champion'];
        tierOrder.forEach(tier => {
            const tierHrid = `/achievement_tiers/${tier}`;
            const data = tierCounts[tierHrid];
            if (data && data.completed > 0 && data.completed === data.total) {
                completedTiers.push(tier);
            }
        });
        return completedTiers;
    }
    function generateAchievementIconsHTML() {
        const completedTiers = getCompletedAchievementTiers();
        const iconConfig = {
            beginner: { sprite: 'buffs', id: 'gathering' },
            novice: { sprite: 'buffs', id: 'wisdom' },
            adept: { sprite: 'buffs', id: 'efficiency' },
            veteran: { sprite: 'items', id: 'butter_of_proficiency' },
            elite: { sprite: 'misc', id: 'combat' },
            champion: { sprite: 'skills', id: 'enhancing' }
        };
        const spriteURLs = {
            buffs: '/static/media/buffs_sprite.cd54d85e.svg',
            items: SVGTool.getSpriteURL('items'),
            misc: SVGTool.getSpriteURL('misc'),
            skills: SVGTool.getSpriteURL('skills')
        };
        let html = '<div class="mwi-achievement-icons" style="display:flex;gap:3px;position:absolute;top:12px;left:12px;z-index:10;">';
        html += `<svg width="30" height="30" viewBox="0 0 40 40" style="width:30px;height:30px;margin-top:-2px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));"><g clip-path="url(#ach)"><path fill="#546DDB" d="M4 7h32v26H4z"></path><path fill="#546DDB" d="M4 7h5v26H4z"></path><path fill="#000" fill-opacity=".2" d="M4 7h5v26H4z"></path><path fill="#546DDB" d="M31 7h5v26h-5z"></path><path fill="#000" fill-opacity=".2" d="M31 7h5v26h-5z"></path><path fill="#546DDB" d="M1 7h6v26H1z"></path><path fill="#fff" fill-opacity=".6" d="M1 7h6v26H1z"></path><path fill="#546DDB" d="M33 7h6v26h-6z"></path><path fill="#fff" fill-opacity=".6" d="M33 7h6v26h-6z"></path><path d="M5 1.875C5 3.325 4.552 6 4 6S3 3.325 3 1.875C3 .425 3.448 0 4 0s1 .425 1 1.875ZM3 38.125C3 36.675 3.448 34 4 34s1 2.675 1 4.125C5 39.575 4.552 40 4 40s-1-.425-1-1.875ZM37 1.875C37 3.325 36.552 6 36 6s-1-2.675-1-4.125C35 .425 35.448 0 36 0s1 .425 1 1.875ZM35 38.125c0-1.45.448-4.125 1-4.125s1 2.675 1 4.125c0 1.45-.448 1.875-1 1.875s-1-.425-1-1.875Z" fill="#C57A09"></path><rect y="5" width="8" height="2" rx="1" fill="#FAA21E"></rect><rect y="5" width="8" height="2" rx="1" fill="#000" fill-opacity=".4"></rect><rect y="33" width="8" height="2" rx="1" fill="#FAA21E"></rect><rect y="33" width="8" height="2" rx="1" fill="#000" fill-opacity=".4"></rect><rect x="32" y="5" width="8" height="2" rx="1" fill="#FAA21E"></rect><rect x="32" y="5" width="8" height="2" rx="1" fill="#000" fill-opacity=".4"></rect><rect x="32" y="33" width="8" height="2" rx="1" fill="#FAA21E"></rect><rect x="32" y="33" width="8" height="2" rx="1" fill="#000" fill-opacity=".4"></rect><path d="M18.99 11.846c.382-.886 1.639-.886 2.02 0l1.706 3.96c.16.37.508.624.909.66l4.293.399c.961.09 1.35 1.285.625 1.922l-3.24 2.846a1.1 1.1 0 0 0-.347 1.068l.948 4.206c.212.942-.805 1.68-1.635 1.188l-3.707-2.201a1.1 1.1 0 0 0-1.124 0l-3.707 2.201c-.83.493-1.847-.246-1.635-1.188l.948-4.206a1.1 1.1 0 0 0-.347-1.069l-3.24-2.845c-.725-.637-.336-1.833.625-1.922l4.293-.398c.401-.037.75-.29.91-.66l1.705-3.961Z" fill="#FAA21E"></path></g></svg>`;
        completedTiers.forEach(tier => {
            const config = iconConfig[tier];
            if (config) {
                const spriteURL = spriteURLs[config.sprite];
                html += `<svg width="24" height="24" viewBox="0 0 24 24" style="width:26px;height:26px;border:1px solid #59d0b9;border-radius:4px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));"><use href="${spriteURL}#${config.id}"></use></svg>`;
            }
        });
        html += '</div>';
        return html;
    }
    async function generateCharacterCard() {
        const existingContainer = document.querySelector('.mwi-card-container');
        if (existingContainer) return;
        if (!DataStore.characterSkills || DataStore.characterSkills.length === 0) {
            alert('Data not loaded!' + String.fromCharCode(10) + String.fromCharCode(10) + 'Please refresh the page and wait for data to auto-load (about 3 seconds)');
            return;
        }
        const container = document.createElement('div');
        container.className = 'mwi-card-container';
        let bgImageDataURL = '';
        if (CARD_BACKGROUND_IMAGE && CARD_BACKGROUND_IMAGE.trim() !== '') {
            try {
                bgImageDataURL = BackgroundImagePreloader.getCached();
                if (!bgImageDataURL) {
                    bgImageDataURL = await BackgroundImagePreloader.preload();
                }
                if (!bgImageDataURL) {
                    throw new Error('Failed to load background image');
                }
            } catch (error) {
                bgImageDataURL = '';
            }
        } else {
            const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
            const message = lang === 'zh' 
                ? '错误:未配置名片背景图!' + String.fromCharCode(10) + String.fromCharCode(10) + '请在脚本中设置CARD_BACKGROUND_IMAGE变量'
                : 'Error: Card background image not configured!' + String.fromCharCode(10) + String.fromCharCode(10) + 'Please set CARD_BACKGROUND_IMAGE variable in the script';
            alert(message);
            return;
        }
        const bgImageStyle = bgImageDataURL ? `background-image: url(${bgImageDataURL});` : '';
        const borderGradient = generateRandomGradientBorder();
        container.innerHTML = `
            <div class="mwi-character-card" id="mwi-card-content" style="${bgImageStyle} --card-border-gradient: ${borderGradient};" data-border-gradient="${borderGradient}">
                <div style="text-align: center; padding: 40px; color: #94a3b8;">Generating...</div>
            </div>
        `;
        document.body.appendChild(container);
        setTimeout(() => renderCard(), 100);
    }
    function renderCard() {
        const cardContent = document.getElementById('mwi-card-content');
        if (!cardContent) return;
        const container = cardContent.parentElement;
        if (!container) return;
        const borderGradient = cardContent.getAttribute('data-border-gradient') || generateRandomGradientBorder();
        SVGTool.refreshFromDOM();
        ClientData.init();
        const isZH = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh");
        const nameElementHTML = DataStore.nameElementHTML;
        const chatIconSpriteURL = SVGTool.getSpriteURL('chat_icons');
        const avatarsSpriteURL = SVGTool.getSpriteURL('avatars');
        const avatarOutfitsSpriteURL = SVGTool.getSpriteURL('avatar_outfits');
        const chatIconId = DataStore.chatIconHrid ? DataStore.chatIconHrid.split('/').pop() : null;
        const supporterBadgeId = DataStore.supporterBadgeHrid ? DataStore.supporterBadgeHrid.split('/').pop() : null;
        const avatarId = DataStore.avatarHrid ? DataStore.avatarHrid.split('/').pop() : null;
        const outfitId = DataStore.outfitHrid ? DataStore.outfitHrid.split('/').pop() : null;
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const achievementIconsHTML = generateAchievementIconsHTML();
        let html = `
            ${achievementIconsHTML}
            <div class="mwi-card-body" data-lang="${currentLang}" style="position:relative;">
                <div class="mwi-card-timestamp">${timestamp}</div>
        `;
        html += `
                <div class="mwi-card-character">
        `;
        html += `
            <div class="mwi-card-section">
                <div class="mwi-character-info-container">
        `;
        if (supporterBadgeId || chatIconId || nameElementHTML || DataStore.characterName) {
            html += `
                <div class="mwi-character-info-top" style="--name-border-gradient: ${borderGradient};">
            `;
            if (supporterBadgeId) {
                html += `
                    <svg class="mwi-character-supporter-badge" width="40" height="40" viewBox="0 0 24 24">
                        <use href="${chatIconSpriteURL}#${supporterBadgeId}"></use>
                    </svg>
                `;
            }
            if (chatIconId) {
                html += `
                    <svg class="mwi-character-chat-icon" width="40" height="40" viewBox="0 0 24 24">
                        <use href="${chatIconSpriteURL}#${chatIconId}"></use>
                    </svg>
                `;
            }
            if (nameElementHTML) {
                html += `
                    <div class="mwi-character-id-wrapper">
                        ${nameElementHTML}
                    </div>
                `;
            } else if (DataStore.characterName) {
                html += `
                    <div class="mwi-character-id" style="color: #ffffff !important;">${DataStore.characterName}</div>
                `;
            }
            html += `
                </div>
            `;
        }
        if (avatarId || outfitId) {
            html += `
                <div class="mwi-character-info-bottom">
                    <div class="mwi-character-avatar-wrapper">
            `;
            if (avatarId) {
                html += `
                        <svg class="mwi-character-avatar" width="280" height="280" viewBox="0 0 24 24">
                            <use href="${avatarsSpriteURL}#${avatarId}"></use>
                        </svg>
                `;
            }
            if (outfitId) {
                html += `
                        <svg class="mwi-character-outfit" width="280" height="280" viewBox="0 0 24 24">
                            <use href="${avatarOutfitsSpriteURL}#${outfitId}"></use>
                        </svg>
                `;
            }
            html += `
                    </div>
                </div>
            `;
        }
        html += `
                </div>
            </div>
        `;
        html += `
                </div>
        `;
        html += `
                <div class="mwi-card-left">
        `;
        html += `
            <div class="mwi-card-section">
                <div class="mwi-equipment-grid">
        `;
        const equipmentSlots = {
            '/item_locations/back': { row: 1, col: 1, name: t('back') },
            '/item_locations/head': { row: 1, col: 2, name: t('head') },
            '/item_locations/trinket': { row: 1, col: 3, name: t('trinket') },
            '/item_locations/neck': { row: 1, col: 4, name: t('neck') },
            '/item_locations/main_hand': { row: 2, col: 1, name: t('main_hand') },
            '/item_locations/body': { row: 2, col: 2, name: t('body') },
            '/item_locations/off_hand': { row: 2, col: 3, name: t('off_hand') },
            '/item_locations/earrings': { row: 2, col: 4, name: t('earrings') },
            '/item_locations/hands': { row: 3, col: 1, name: t('hands') },
            '/item_locations/legs': { row: 3, col: 2, name: t('legs') },
            '/item_locations/pouch': { row: 3, col: 3, name: t('pouch') },
            '/item_locations/ring': { row: 3, col: 4, name: t('ring') },
            '/item_locations/feet': { row: 4, col: 2, name: t('feet') },
            '/item_locations/charm': { row: 4, col: 4, name: t('charm') },
            '/item_locations/two_hand': { row: 2, col: 1, name: t('two_hand'), colspan: 2 }
        };
        for (let row = 1; row <= 4; row++) {
            for (let col = 1; col <= 4; col++) {
                if ((row === 4 && col === 1) || (row === 4 && col === 3)) {
                    html += `<div style="width: 60px; height: 60px;"></div>`;
                    continue;
                }
                let slotEntry = Object.entries(equipmentSlots).find(([_, slot]) => 
                    slot.row === row && slot.col === col
                );
                if (row === 2 && col === 1) {
                    const twoHandItem = DataStore.currentEquipmentMap['/item_locations/two_hand'];
                    if (twoHandItem) {
                        slotEntry = ['/item_locations/two_hand', equipmentSlots['/item_locations/two_hand']];
                    }
                }
                if (slotEntry) {
                    const [slotHrid, slotInfo] = slotEntry;
                    const item = DataStore.currentEquipmentMap[slotHrid];
                    if (item) {
                        const itemDetail = DataStore.itemDetailMap?.[item.itemHrid];
                        const itemName = itemDetail?.name || item.itemHrid.split('/').pop();
                        const enhance = item.enhancementLevel || 0;
                        const itemLevel = itemDetail?.itemLevel || 0;
                        const iconId = item.itemHrid.split('/').pop();
                        const spriteURL = SVGTool.getSpriteURL('items');
                        html += `
                            <div class="mwi-equipment-slot filled" title="${itemName}${enhance > 0 ? ` +${enhance}` : ''}">
                                <svg viewBox="0 0 42 42">
                                    <use href="${spriteURL}#${iconId}"></use>
                                </svg>
                                ${enhance > 0 ? `<div class="mwi-enhance-level">+${enhance}</div>` : ''}
                                ${itemLevel > 0 ? `<div class="mwi-item-level">${itemLevel}</div>` : ''}
                            </div>
                        `;
                    } else {
                        html += `
                            <div class="mwi-equipment-slot empty"></div>
                        `;
                    }
                } else {
                    html += `<div class="mwi-equipment-slot empty" style="opacity: 0.3;"></div>`;
                }
            }
        }
        html += `</div></div>`;
        const stamina = DataStore.characterSkills.find(s => s.skillHrid === '/skills/stamina')?.level || 0;
        const intelligence = DataStore.characterSkills.find(s => s.skillHrid === '/skills/intelligence')?.level || 0;
        const attack = DataStore.characterSkills.find(s => s.skillHrid === '/skills/attack')?.level || 0;
        const defense = DataStore.characterSkills.find(s => s.skillHrid === '/skills/defense')?.level || 0;
        const melee = DataStore.characterSkills.find(s => s.skillHrid === '/skills/melee')?.level || 0;
        const ranged = DataStore.characterSkills.find(s => s.skillHrid === '/skills/ranged')?.level || 0;
        const magic = DataStore.characterSkills.find(s => s.skillHrid === '/skills/magic')?.level || 0;
        const maxCombatSkill = Math.max(melee, ranged, magic);
        const maxAllCombat = Math.max(attack, defense, melee, ranged, magic);
        const combatLevel = Math.floor(0.1 * (stamina + intelligence + attack + defense + maxCombatSkill) + 0.5 * maxAllCombat);
        const firstRowStats = [
            { hrid: '/skills/intelligence', name: t('intelligence'), level: intelligence },
            { hrid: '/skills/stamina', name: t('stamina'), level: stamina },
            { hrid: '/skills/attack', name: t('attack'), level: attack }
        ].sort((a, b) => b.level - a.level);
        const secondRowStats = [
            { hrid: '/skills/magic', name: t('magic'), level: magic },
            { hrid: '/skills/melee', name: t('melee'), level: melee },
            { hrid: '/skills/ranged', name: t('ranged'), level: ranged },
            { hrid: '/skills/defense', name: t('defense'), level: defense }
        ].sort((a, b) => b.level - a.level);
        html += `
            <div class="mwi-card-section">
                <div class="mwi-stats-grid">
        `;
        const miscSpriteURL = SVGTool.getSpriteURL('misc');
        const skillsSpriteURL = SVGTool.getSpriteURL('skills');
        const combatLevelClass = combatLevel >= 140 ? 'highlight' : '';
        html += `
            <div class="mwi-stat-item">
                <span class="mwi-stat-label">${t('combat')}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" style="flex-shrink: 0;">
                    <use href="${miscSpriteURL}#combat"></use>
                </svg>
                <span class="mwi-stat-value ${combatLevelClass}">Lv.${combatLevel}</span>
            </div>
        `;
        firstRowStats.forEach(stat => {
            const name = stat.hrid.split('/').pop();
            const levelClass = stat.level >= 140 ? 'highlight' : '';
            html += `
                <div class="mwi-stat-item">
                    <span class="mwi-stat-label">${stat.name}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" style="flex-shrink: 0;">
                        <use href="${skillsSpriteURL}#${name}"></use>
                    </svg>
                    <span class="mwi-stat-value ${levelClass}">Lv.${stat.level}</span>
                </div>
            `;
        });
        secondRowStats.forEach(stat => {
            const name = stat.hrid.split('/').pop();
            const levelClass = stat.level >= 140 ? 'highlight' : '';
            html += `
                <div class="mwi-stat-item">
                    <span class="mwi-stat-label">${stat.name}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" style="flex-shrink: 0;">
                        <use href="${skillsSpriteURL}#${name}"></use>
                    </svg>
                    <span class="mwi-stat-value ${levelClass}">Lv.${stat.level}</span>
                </div>
            `;
        });
        html += `</div></div>`;
        html += `
                </div>
        `;
        html += `
                <div class="mwi-card-right">
        `;
        const foodSlots = (DataStore.actionTypeFoodSlotsMap || {})["/action_types/combat"] || [];
        const drinkSlots = (DataStore.actionTypeDrinkSlotsMap || {})["/action_types/combat"] || [];
        const equippedFood = foodSlots.filter(f => f && f.itemHrid);
        const equippedDrink = drinkSlots.filter(d => d && d.itemHrid);
        html += `
            <div class="mwi-card-section">
                <div class="mwi-consumables-container">
                    <div class="mwi-consumable-group">
        `;
        html += `<div class="mwi-consumable-items">`;
        for (let i = 0; i < 3; i++) {
            const foodItem = equippedFood[i];
            if (foodItem) {
                const itemDetail = DataStore.itemDetailMap?.[foodItem.itemHrid];
                const itemName = itemDetail?.name || foodItem.itemHrid.split('/').pop();
                const iconId = foodItem.itemHrid.split('/').pop();
                const spriteURL = SVGTool.getSpriteURL('items');
                html += `
                    <div class="mwi-consumable-item" title="${itemName}">
                        <svg viewBox="0 0 36 36">
                            <use href="${spriteURL}#${iconId}"></use>
                        </svg>
                    </div>
                `;
            } else {
                html += `
                    <div class="mwi-consumable-item empty"></div>
                `;
            }
        }
        html += `</div>`;
        html += `<div class="mwi-consumable-items">`;
        for (let i = 0; i < 3; i++) {
            const drinkItem = equippedDrink[i];
            if (drinkItem) {
                const itemDetail = DataStore.itemDetailMap?.[drinkItem.itemHrid];
                const itemName = itemDetail?.name || drinkItem.itemHrid.split('/').pop();
                const iconId = drinkItem.itemHrid.split('/').pop();
                const spriteURL = SVGTool.getSpriteURL('items');
                html += `
                    <div class="mwi-consumable-item" title="${itemName}">
                        <svg viewBox="0 0 36 36">
                            <use href="${spriteURL}#${iconId}"></use>
                        </svg>
                    </div>
                `;
            } else {
                html += `
                    <div class="mwi-consumable-item empty"></div>
                `;
            }
        }
        html += `</div>`;
        html += `
                    </div>
                </div>
            </div>
        `;
        const houseRooms = DataStore.characterHouseRoomMap || {};
        const firstRowRooms = [
            { hrid: '/house_rooms/dojo', icon: 'attack', name: t('dojo') },
            { hrid: '/house_rooms/library', icon: 'intelligence', name: t('library') },
            { hrid: '/house_rooms/dining_room', icon: 'stamina', name: t('dining_room') }
        ];
        const secondRowRooms = [
            { hrid: '/house_rooms/mystical_study', icon: 'magic', name: t('mystical_study') },
            { hrid: '/house_rooms/armory', icon: 'defense', name: t('armory') },
            { hrid: '/house_rooms/gym', icon: 'melee', name: t('gym') },
            { hrid: '/house_rooms/archery_range', icon: 'ranged', name: t('archery_range') }
        ];
        const existingFirstRow = firstRowRooms
            .filter(room => houseRooms[room.hrid])
            .sort((a, b) => {
                const levelA = houseRooms[a.hrid]?.level || 0;
                const levelB = houseRooms[b.hrid]?.level || 0;
                return levelB - levelA;
            });
        const existingSecondRow = secondRowRooms
            .filter(room => houseRooms[room.hrid])
            .sort((a, b) => {
                const levelA = houseRooms[a.hrid]?.level || 0;
                const levelB = houseRooms[b.hrid]?.level || 0;
                return levelB - levelA;
            });
        html += `
            <div class="mwi-card-section">
                <div class="mwi-house-grid">
        `;
        for (let i = 0; i < 3; i++) {
            const room = existingFirstRow[i];
            if (room) {
                const roomData = houseRooms[room.hrid];
                const roomLevel = roomData.level || 0;
                const spriteURL = SVGTool.getSpriteURL('skills');
                const levelClass = roomLevel === 8 ? 'max' : 'normal';
                html += `
                    <div class="mwi-house-item" title="${room.name} Lv.${roomLevel}">
                        <svg viewBox="0 0 42 42">
                            <use href="${spriteURL}#${room.icon}"></use>
                        </svg>
                        <div class="mwi-house-level ${levelClass}">Lv.${roomLevel}</div>
                    </div>
                `;
            } else {
                html += `<div class="mwi-house-item empty"></div>`;
            }
        }
        html += `<div class="mwi-house-item" style="cursor: default; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 24 24" style="width: 42px; height: 42px;">
                <use href="${miscSpriteURL}#house"></use>
            </svg>
        </div>`;
        for (let i = 0; i < 4; i++) {
            const room = existingSecondRow[i];
            if (room) {
                const roomData = houseRooms[room.hrid];
                const roomLevel = roomData.level || 0;
                const spriteURL = SVGTool.getSpriteURL('skills');
                const levelClass = roomLevel === 8 ? 'max' : 'normal';
                html += `
                    <div class="mwi-house-item" title="${room.name} Lv.${roomLevel}">
                        <svg viewBox="0 0 42 42">
                            <use href="${spriteURL}#${room.icon}"></use>
                        </svg>
                        <div class="mwi-house-level ${levelClass}">Lv.${roomLevel}</div>
                    </div>
                `;
            } else {
                html += `<div class="mwi-house-item empty"></div>`;
            }
        }
        html += `</div></div>`;
        const combatAbilities = DataStore.combatUnit?.combatAbilities || [];
        const auraAbilities = [
            '/abilities/insanity',
            '/abilities/mystic_aura',
            '/abilities/critical_aura',
            '/abilities/speed_aura',
            '/abilities/fierce_aura',
            '/abilities/guardian_aura',
            '/abilities/revive',
            '/abilities/invincible'
        ];
        const equippedNormalAbilities = [];
        const equippedAuras = [];
        combatAbilities.forEach(ability => {
            if (auraAbilities.includes(ability.abilityHrid)) {
                equippedAuras.push(ability);
            } else {
                equippedNormalAbilities.push(ability);
            }
        });
        const equippedAbilityHrids = new Set(combatAbilities.map(a => a.abilityHrid));
        const unequippedAuras = [];
        auraAbilities.forEach(auraHrid => {
            const learnedAura = DataStore.characterAbilities.find(a => a.abilityHrid === auraHrid);
            if (learnedAura && !equippedAbilityHrids.has(auraHrid)) {
                unequippedAuras.push(learnedAura);
            }
        });
        unequippedAuras.sort((a, b) => b.level - a.level);
        const firstRowAbilities = equippedNormalAbilities.slice(0, 4);
        const auraRowDisplay = [];
        if (equippedAuras.length > 0) {
            auraRowDisplay.push(equippedAuras[0]);
        }
        const remainingSlots = 4 - auraRowDisplay.length;
        const topUnequippedAuras = unequippedAuras.slice(0, remainingSlots);
        auraRowDisplay.push(...topUnequippedAuras);
        html += `
            <div class="mwi-card-section">
                <div class="mwi-abilities-grid">
        `;
        for (let i = 0; i < 4; i++) {
            const ability = firstRowAbilities[i];
            if (ability && ability.abilityHrid) {
                const abilityDetail = DataStore.abilityDetailMap?.[ability.abilityHrid];
                const abilityName = abilityDetail?.name || ability.abilityHrid.split('/').pop();
                const combatActionHrid = abilityDetail?.combatActionHrid || ability.abilityHrid;
                const iconId = combatActionHrid.split('/').pop();
                const spriteURL = SVGTool.getSpriteURL('abilities');
                html += `
                    <div class="mwi-ability-item" title="${abilityName} Lv.${ability.level}">
                        <svg viewBox="0 0 40 40">
                            <use href="${spriteURL}#${iconId}"></use>
                        </svg>
                        <div class="mwi-ability-level">Lv.${ability.level}</div>
                    </div>
                `;
            } else {
                html += `<div class="mwi-ability-item empty"></div>`;
            }
        }
        for (let i = 0; i < 4; i++) {
            const aura = auraRowDisplay[i];
            if (aura && aura.abilityHrid) {
                const abilityDetail = DataStore.abilityDetailMap?.[aura.abilityHrid];
                const abilityName = abilityDetail?.name || aura.abilityHrid.split('/').pop();
                const combatActionHrid = abilityDetail?.combatActionHrid || aura.abilityHrid;
                const iconId = combatActionHrid.split('/').pop();
                const spriteURL = SVGTool.getSpriteURL('abilities');
                html += `
                    <div class="mwi-ability-item" title="${abilityName} Lv.${aura.level}">
                        <svg viewBox="0 0 40 40">
                            <use href="${spriteURL}#${iconId}"></use>
                        </svg>
                        <div class="mwi-ability-level">Lv.${aura.level}</div>
                    </div>
                `;
            } else {
                html += `<div class="mwi-ability-item empty"></div>`;
            }
        }
        html += `</div></div>`;
        html += `
                </div>
            </div>
        `;
        cardContent.innerHTML = html;
    }
    function closeCard() {
        const container = document.querySelector('.mwi-card-container');
        if (container) {
            container.remove();
            window._MWI_UPLOAD_IN_PROGRESS = false;
            GM_setValue('mwi_card_upload_request', 0);
            GM_setValue('mwi_card_image_url', '');
            GM_setValue('mwi_card_image_timestamp', 0);
            GM_setValue('mwi_upload_progress', 0);
            GM_setValue('mwi_upload_status', '');
            cardLinkFillStatus.reset();
        }
    }
    async function autoUploadCard() {
        if (window._MWI_UPLOAD_IN_PROGRESS) {
            return;
        }
        
        const cardElement = document.getElementById('mwi-card-content');
        if (!cardElement) {
            const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
            throw new Error(lang === 'zh' ? '未找到名片元素' : 'Card element not found');
        }
        
        window._MWI_UPLOAD_IN_PROGRESS = true;
        
        const lang = typeof window.detectLanguage === 'function' ? window.detectLanguage() : 'zh';
        
        const existingOverlay = document.getElementById('mwi-upload-progress-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        const abortController = new AbortController();
        let isCancelled = false;
        
        const progressOverlay = document.createElement('div');
        progressOverlay.id = 'mwi-upload-progress-overlay';
        progressOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999999;
            backdrop-filter: blur(4px);
        `;
        progressOverlay.innerHTML = `
            <div style="position: relative; max-width: 90%;">
                <button id="mwi-upload-close-btn" style="
                    position: absolute;
                    top: -40px;
                    right: 0;
                    border: none;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(8px);
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 12px;
                    cursor: pointer;
                    padding: 6px 12px;
                    border-radius: 6px;
                    transition: background 0.2s;
                " title="${lang === 'zh' ? '中止上传' : 'Cancel upload'}">${lang === 'zh' ? '中止上传' : 'Cancel'}</button>
                <div style="background: white; border-radius: 12px; padding: 32px 48px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); min-width: 300px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 20px;">${lang === 'zh' ? '名片上传中...' : 'Uploading card...'}</div>
                    <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
                        <div id="mwi-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); transition: width 0.3s;"></div>
                    </div>
                    <div id="mwi-progress-text" style="font-size: 14px; color: #666;">${lang === 'zh' ? '准备中...' : 'Preparing...'}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(progressOverlay);
        
        const closeBtn = document.getElementById('mwi-upload-close-btn');
        closeBtn.addEventListener('mouseover', () => { closeBtn.style.background = 'rgba(255, 255, 255, 0.25)'; });
        closeBtn.addEventListener('mouseout', () => { closeBtn.style.background = 'rgba(255, 255, 255, 0.15)'; });
        closeBtn.addEventListener('click', () => {
            isCancelled = true;
            abortController.abort();
            progressOverlay.remove();
            closeCard();
            window._MWI_UPLOAD_IN_PROGRESS = false;
            GM_setValue('mwi_card_upload_request', 0);
            GM_setValue('mwi_card_image_url', '');
            GM_setValue('mwi_card_image_timestamp', 0);
        });
        
        const progressBar = document.getElementById('mwi-progress-bar');
        const progressText = document.getElementById('mwi-progress-text');
        function updateProgress(percent, text) {
            if (isCancelled) return;
            if (progressBar) progressBar.style.width = percent + '%';
            if (progressText) progressText.textContent = text;
        }
        try {
            if (isCancelled) return;
            updateProgress(10, lang === 'zh' ? '生成截图中...' : 'Generating screenshot...');
            const canvas = await SnapDOM.toCanvas(cardElement, {
                width: 940,
                height: 520,
                backgroundColor: '#1a1a2e',
                scale: 2,
                logging: false
            });
            if (isCancelled) throw new Error('cancelled');
            updateProgress(30, lang === 'zh' ? '转换图片中...' : 'Converting image...');
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (!blob) reject(new Error(lang === 'zh' ? 'Canvas转换Blob失败' : 'Canvas to Blob conversion failed'));
                    else resolve(blob);
                }, 'image/png', 1.0);
            });
            if (isCancelled) throw new Error('cancelled');
            updateProgress(50, lang === 'zh' ? '截图完成,开始上传...' : 'Screenshot complete, uploading...');
            const UPLOAD_ENDPOINT = 'https://tupian.li/api/v1/upload';
            updateProgress(80, lang === 'zh' ? '正在上传图片...需要2分钟' : 'Uploading image... may take 2 minutes');
            const formData = new FormData();
            formData.append('file', blob, 'character-card.png');
            let uploadResp;
            let lastError;
            const maxRetries = 3;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    if (isCancelled) throw new Error('cancelled');
                    if (attempt > 1) {
                        const retryText = lang === 'zh' 
                            ? `重试上传 (${attempt}/${maxRetries})...`
                            : `Retrying upload (${attempt}/${maxRetries})...`;
                        updateProgress(80 + (attempt - 1) * 3, retryText);
                        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                    }
                    uploadResp = await fetch(UPLOAD_ENDPOINT, {
                        method: 'POST',
                        body: formData,
                        signal: abortController.signal
                    });
                    if (uploadResp.ok) {
                        break;
                    }
                    lastError = new Error(lang === 'zh' ? `状态码: ${uploadResp.status}` : `Status code: ${uploadResp.status}`);
                    if (attempt === maxRetries) {
                        throw lastError;
                    }
                } catch (error) {
                    if (isCancelled || error.name === 'AbortError' || error.message === 'cancelled') {
                        throw new Error('cancelled');
                    }
                    lastError = error;
                    if (attempt === maxRetries) {
                        const errorMsg = lang === 'zh'
                            ? `上传失败 (已重试${maxRetries}次): ${error.message}`
                            : `Upload failed (retried ${maxRetries} times): ${error.message}`;
                        throw new Error(errorMsg);
                    }
                }
            }
            if (!uploadResp || !uploadResp.ok) {
                throw lastError || new Error(lang === 'zh' ? '上传失败' : 'Upload failed');
            }
            if (isCancelled) throw new Error('cancelled');
            updateProgress(90, lang === 'zh' ? '处理响应...' : 'Processing response...');
            const data = await uploadResp.json();
            let imageUrl = null;
            if (data && typeof data === 'object' && data.status === true && data.data && data.data.pathname) {
                imageUrl = 'https://tupian.li/images/' + data.data.pathname;
            } else if (data && typeof data === 'object' && data.success && data.data && data.data.url) {
                imageUrl = data.data.url;
            } else if (data && typeof data === 'object' && data.url) {
                imageUrl = data.url;
            } else if (data && typeof data === 'object' && data.link) {
                imageUrl = data.link;
            }
            if (!imageUrl) {
                throw new Error(lang === 'zh' ? '无法解析API返回的图片链接' : 'Unable to parse image link from API response');
            }
            if (isCancelled) throw new Error('cancelled');
            updateProgress(100, lang === 'zh' ? '名片上传成功!' : 'Card upload successful!');
            const timestamp = Date.now();
            GM_setValue('mwi_card_image_url', imageUrl);
            GM_setValue('mwi_card_image_timestamp', timestamp);
            
            if (typeof window.__fillCardLink__ === 'function') {
                window.__fillCardLink__(imageUrl);
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            const savedUrl = GM_getValue('mwi_card_image_url', '');
            const savedTimestamp = GM_getValue('mwi_card_image_timestamp', 0);
            if (savedUrl !== imageUrl || savedTimestamp !== timestamp) {
                GM_setValue('mwi_card_image_url', imageUrl);
                GM_setValue('mwi_card_image_timestamp', timestamp);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            setTimeout(() => {
                progressOverlay.remove();
                closeCard();
                window._MWI_UPLOAD_IN_PROGRESS = false;
            }, 800);
            return imageUrl;
        } catch (error) {
            if (isCancelled || error.message === 'cancelled') {
                return;
            }
            progressOverlay.innerHTML = `
                <div style="background: white; border-radius: 12px; padding: 32px 48px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); min-width: 300px; max-width: 90%; text-align: center;">
                    <div style="color: #ef4444; font-size: 16px; margin-bottom: 10px;">${lang === 'zh' ? '上传失败' : 'Upload failed'}</div>
                    <div style="color: #94a3b8; font-size: 14px;">${error.message}</div>
                </div>
            `;
            setTimeout(() => {
                progressOverlay.remove();
                window._MWI_UPLOAD_IN_PROGRESS = false;
            }, 3000);
            throw error;
        }
    }
    WebSocketHook.install();
    (function loadCachedClientData() {
        const cachedData = localStorage.getItem("initClientData");
        if (cachedData) {
            try {
                const decompressed = LZString.decompressFromUTF16(cachedData);
                if (decompressed) {
                    const clientData = JSON.parse(decompressed);
                    BuildScoreModule.initClientData(clientData);
                    DataStore.itemDetailMap = clientData.itemDetailMap || null;
                    DataStore.actionDetailMap = clientData.actionDetailMap || null;
                    DataStore.abilityDetailMap = clientData.abilityDetailMap || null;
                }
            } catch (e) {}
        }
    })();
    ClientData.init();
    SVGTool.init();
    function waitForDOMAndCreateUI() {
        if (document.body) {
            window.MWI_INTEGRATED.generateCard = generateCharacterCard;
            window.MWI_INTEGRATED.closeCard = closeCard;
            window.MWI_INTEGRATED.getData = getAllData;
            window.MWI_INTEGRATED.getSimulatorData = getSimulatorData;
            window.MWI_INTEGRATED.isDataLoaded = isDataReady;
            window.MWI_INTEGRATED.waitForData = waitForData;
            window.MWI_INTEGRATED.ClientData = ClientData;
        } else {
            setTimeout(waitForDOMAndCreateUI, 50);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForDOMAndCreateUI);
        window.addEventListener('load', waitForDOMAndCreateUI);
    } else {
        waitForDOMAndCreateUI();
    }
})();