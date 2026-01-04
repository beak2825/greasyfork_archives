// ==UserScript==
// @name         聚合搜索 Pro
// @description  整合百度、Google、必应搜索引擎，支持快捷键切换、自动翻页、关键词高亮、暗色模式。AI辅助生成。
// @version      2.0.0
// @author       鱼腐ufu
// @website      https://github.com/yinbao77
// @match        *://www.baidu.com/s*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.com/search*
// @namespace    https://greasyfork.org/users/1489016
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558876/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/558876/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // ========== 配置区 ==========
    const CONFIG = {
        engines: [
            { name: '百度', url: 'https://www.baidu.com/s?wd=', param: 'wd', test: /baidu\.com/, key: '1', pageParam: 'pn', pageStep: 10 },
            { name: '必应', url: 'https://www.bing.com/search?q=', param: 'q', test: /bing\.com/, key: '2', pageParam: 'first', pageStep: 10 },
            { name: 'Google', url: 'https://www.google.com/search?q=', param: 'q', test: /google\.com/, key: '3', pageParam: 'start', pageStep: 10 }
        ],
        maxPages: 10,
        scrollThreshold: 200,
        loadDelay: 300,
        highlightDelay: 500,
        maxHistoryItems: 20,
        initDelay: 100
    };
    
    // ========== 状态管理 ==========
    const State = {
        isAutoPageOn: true,
        currentPage: 1,
        isLoading: false,
        isDarkMode: false,
        currentEngine: null,
        keywords: '',
        
        init() {
            this.isDarkMode = this.detectDarkMode();
            this.currentEngine = this.getCurrentEngine();
            this.keywords = this.getKeywords();
            this.loadSettings();
        },
        
        detectDarkMode() {
            return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
        },
        
        getCurrentEngine() {
            return CONFIG.engines.find(e => e.test.test(location.href));
        },
        
        getKeywords() {
            if (!this.currentEngine) return '';
            const params = new URLSearchParams(location.search);
            return params.get(this.currentEngine.param) || '';
        },
        
        loadSettings() {
            try {
                const saved = localStorage.getItem('searchAggregator_autoPage');
                if (saved !== null) this.isAutoPageOn = saved === 'true';
            } catch (e) {
                console.warn('无法加载设置:', e);
            }
        },
        
        saveSettings() {
            try {
                localStorage.setItem('searchAggregator_autoPage', this.isAutoPageOn);
            } catch (e) {
                console.warn('无法保存设置:', e);
            }
        }
    };
    
    // ========== 主题系统 ==========
    const Theme = {
        get() {
            return State.isDarkMode ? {
                bg: '#2d2d2d',
                bgSecondary: '#3a3a3a',
                bgActive: '#2d4a2d',
                border: '#555',
                text: '#e0e0e0',
                textSecondary: '#b0b0b0',
                active: '#4CAF50',
                hover: '#3a3a3a',
                highlight: '#ffd700',
                shadow: 'rgba(0,0,0,0.3)'
            } : {
                bg: '#ffffff',
                bgSecondary: '#f5f5f5',
                bgActive: '#e8f5e8',
                border: '#e0e0e0',
                text: '#333',
                textSecondary: '#666',
                active: '#4CAF50',
                hover: '#f9f9f9',
                highlight: '#ffff00',
                shadow: 'rgba(0,0,0,0.1)'
            };
        },
        
        watch() {
            window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                State.isDarkMode = e.matches;
                location.reload();
            });
        }
    };
    
    // ========== 工具函数 ==========
    const Utils = {
        showTip(text, duration = 1500) {
            let tip = document.getElementById('search-tip');
            if (!tip) {
                tip = document.createElement('div');
                tip.id = 'search-tip';
                document.body.appendChild(tip);
            }
            
            tip.textContent = text;
            tip.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.85); color: white; padding: 16px 28px;
                border-radius: 12px; font-size: 15px; z-index: 100000; display: block;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: tipFadeIn 0.2s ease;
                pointer-events: none;
            `;
            
            setTimeout(() => {
                tip.style.animation = 'tipFadeOut 0.2s ease';
                setTimeout(() => tip.style.display = 'none', 200);
            }, duration);
        },
        
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        escapeRegex(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    };
    

    
    // ========== 页面导航 ==========
    const Navigation = {
        jumpTo(engineUrl) {
            if (!State.keywords) return;
            
            Utils.showTip('正在跳转...');
            setTimeout(() => {
                location.href = engineUrl + encodeURIComponent(State.keywords);
            }, 300);
        }
    };
    
    // ========== 侧边栏 ==========
    const Sidebar = {
        create() {
            if (!State.currentEngine) return;
            
            const theme = Theme.get();
            const sidebar = document.createElement('div');
            sidebar.id = 'search-sidebar';
            
            sidebar.style.cssText = `
                position: fixed; top: 50%; left: 10px; transform: translateY(-50%);
                width: 120px; background: ${theme.bg}; border: 1px solid ${theme.border};
                border-radius: 12px; font-size: 12px; z-index: 99999;
                box-shadow: 0 6px 16px ${theme.shadow}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
                transition: all 0.3s ease;
            `;
            
            // 标题区
            const header = document.createElement('div');
            header.innerHTML = `
                <div style="text-align: center; padding: 12px 0; border-bottom: 1px solid ${theme.border};">
                    <div style="font-size: 15px; font-weight: bold; color: ${theme.text}; margin-bottom: 4px;">🔍 聚合搜索</div>
                    <div style="font-size: 10px; color: ${theme.textSecondary};">by 鱼腐ufu</div>
                </div>
            `;
            sidebar.appendChild(header);
            
            // 引擎按钮
            CONFIG.engines.forEach(engine => {
                const btn = this.createEngineButton(engine, theme);
                sidebar.appendChild(btn);
            });
            
            // 功能区
            const controls = this.createControls(theme);
            sidebar.appendChild(controls);
            
            // 拖拽
            this.makeDraggable(sidebar);
            
            document.body.appendChild(sidebar);
        },
        
        createEngineButton(engine, theme) {
            const btn = document.createElement('div');
            btn.textContent = engine.name;
            btn.title = `快捷键: Alt+${engine.key}`;
            
            const isActive = State.currentEngine.name === engine.name;
            
            btn.style.cssText = `
                padding: 10px 0; text-align: center; cursor: pointer;
                border-top: 1px solid ${theme.border}; color: ${isActive ? 'white' : theme.text};
                background: ${isActive ? theme.active : 'transparent'};
                font-weight: ${isActive ? 'bold' : 'normal'};
                transition: all 0.2s ease;
            `;
            
            if (!isActive) {
                btn.onmouseover = () => {
                    btn.style.background = theme.hover;
                    btn.style.transform = 'translateX(3px)';
                };
                btn.onmouseout = () => {
                    btn.style.background = 'transparent';
                    btn.style.transform = 'translateX(0)';
                };
                btn.onclick = () => Navigation.jumpTo(engine.url);
            }
            
            return btn;
        },
        
        createControls(theme) {
            const controls = document.createElement('div');
            controls.style.cssText = `border-top: 1px solid ${theme.border};`;
            
            // 自动翻页开关
            const toggle = document.createElement('div');
            toggle.innerHTML = `🔄 自动翻页: <strong>${State.isAutoPageOn ? 'ON' : 'OFF'}</strong>`;
            toggle.style.cssText = `
                padding: 10px; text-align: center; font-size: 11px; cursor: pointer;
                transition: all 0.2s ease; user-select: none;
                background: ${State.isAutoPageOn ? theme.bgActive : theme.bgSecondary};
                color: ${theme.text};
            `;
            toggle.onclick = () => {
                State.isAutoPageOn = !State.isAutoPageOn;
                State.saveSettings();
                toggle.innerHTML = `🔄 自动翻页: <strong>${State.isAutoPageOn ? 'ON' : 'OFF'}</strong>`;
                toggle.style.background = State.isAutoPageOn ? theme.bgActive : theme.bgSecondary;
                Utils.showTip(State.isAutoPageOn ? '✅ 自动翻页已开启' : '❌ 自动翻页已关闭');
            };
            controls.appendChild(toggle);
            
            // 页面计数
            const pageCount = document.createElement('div');
            pageCount.id = 'page-counter';
            pageCount.textContent = `📄 第 ${State.currentPage} 页`;
            pageCount.style.cssText = `
                padding: 8px; text-align: center; font-size: 10px;
                color: ${theme.textSecondary}; border-top: 1px solid ${theme.border};
            `;
            controls.appendChild(pageCount);
            
            return controls;
        },
        
        makeDraggable(sidebar) {
            let isDragging = false;
            let startX, startY, initialX, initialY;
            
            const header = sidebar.querySelector('div');
            header.style.cursor = 'move';
            
            header.onmousedown = function(e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = sidebar.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                sidebar.style.transition = 'none';
                e.preventDefault();
            };
            
            document.onmousemove = function(e) {
                if (isDragging) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    sidebar.style.left = (initialX + deltaX) + 'px';
                    sidebar.style.top = (initialY + deltaY) + 'px';
                    sidebar.style.transform = 'none';
                }
            };
            
            document.onmouseup = function() {
                if (isDragging) {
                    isDragging = false;
                    sidebar.style.transition = 'all 0.3s ease';
                }
            };
        }
    };
    
    // ========== 回到顶部 ==========
    const BackToTop = {
        scrollHandler: null,
        
        create() {
            const btn = document.createElement('div');
            btn.innerHTML = '⬆';
            btn.id = 'back-to-top';
            btn.style.cssText = `
                position: fixed; bottom: 80px; right: 30px; width: 50px; height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; border-radius: 50%; text-align: center;
                line-height: 50px; font-size: 22px; cursor: pointer; display: none;
                z-index: 99998; transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            `;
            
            btn.onmouseover = () => {
                btn.style.transform = 'translateY(-5px) scale(1.1)';
                btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            };
            btn.onmouseout = () => {
                btn.style.transform = 'translateY(0) scale(1)';
                btn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            };
            btn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
            
            document.body.appendChild(btn);
            
            // 滚动监听
            this.scrollHandler = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                
                // 显示/隐藏回到顶部按钮
                btn.style.display = scrollTop > 300 ? 'block' : 'none';
                
                // 自动翻页检测
                if (State.isAutoPageOn && !State.isLoading && State.currentPage < CONFIG.maxPages) {
                    const scrollBottom = scrollTop + windowHeight;
                    const triggerPoint = documentHeight - CONFIG.scrollThreshold;
                    
                    if (scrollBottom >= triggerPoint) {
                        PageLoader.loadNext();
                    }
                }
            };
            
            // 立即执行一次检查
            this.scrollHandler();
            
            // 添加滚动监听（使用原生事件，不节流）
            window.addEventListener('scroll', this.scrollHandler, { passive: true });
            
            // 页面大小变化时也检查
            window.addEventListener('resize', this.scrollHandler, { passive: true });
        }
    };
    
    // ========== 自动翻页 ==========
    const PageLoader = {
        async loadNext() {
            if (!State.currentEngine || State.currentPage >= CONFIG.maxPages || State.isLoading) {
                return;
            }
            
            State.isLoading = true;
            State.currentPage++;
            
            Utils.showTip(`⏳ 加载第 ${State.currentPage} 页...`, 30000);
            
            try {
                const url = this.buildPageUrl();
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html',
                    }
                });
                
                if (!response.ok) throw new Error('网络响应失败');
                
                const html = await response.text();
                
                // 直接同步处理，避免异步导致的问题
                this.appendResults(html);
                this.updatePageCounter();
                
                Utils.showTip(`✅ 第 ${State.currentPage} 页加载完成`, 1000);
                
                // 重置高亮状态并立即高亮新内容
                Highlighter.reset();
                setTimeout(() => Highlighter.highlight(), 200);
                
            } catch (e) {
                Utils.showTip('❌ 翻页失败', 2000);
                console.error('翻页错误:', e);
                State.currentPage--;
            } finally {
                State.isLoading = false;
                
                // 加载完成后立即检查是否需要继续加载
                setTimeout(() => {
                    if (BackToTop.scrollHandler) {
                        BackToTop.scrollHandler();
                    }
                }, 300);
            }
        },
        
        buildPageUrl() {
            const url = new URL(location.href);
            const engine = State.currentEngine;
            const currentValue = parseInt(url.searchParams.get(engine.pageParam) || '0');
            url.searchParams.set(engine.pageParam, (currentValue + engine.pageStep).toString());
            return url;
        },
        
        appendResults(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const selectors = ['#content_left', '#b_results', '#search'];
            let newResults = null, currentResults = null;
            
            for (const sel of selectors) {
                newResults = doc.querySelector(sel);
                currentResults = document.querySelector(sel);
                if (newResults && currentResults) break;
            }
            
            if (!newResults || !currentResults) return;
            
            // 页面分隔符
            const theme = Theme.get();
            const separator = document.createElement('div');
            separator.innerHTML = `━━━ 第 ${State.currentPage} 页 ━━━`;
            separator.style.cssText = `
                margin: 30px 0; padding: 12px; text-align: center;
                background: ${theme.bgSecondary}; color: ${theme.text};
                border-radius: 8px; font-weight: bold;
                box-shadow: 0 2px 8px ${theme.shadow};
            `;
            currentResults.appendChild(separator);
            
            // 添加新结果
            Array.from(newResults.children).forEach(item => {
                if (!item.classList.contains('page')) {
                    currentResults.appendChild(item);
                }
            });
        },
        
        updatePageCounter() {
            const counter = document.getElementById('page-counter');
            if (counter) {
                counter.textContent = `📄 第 ${State.currentPage} 页`;
            }
        }
    };
    
    // ========== 关键词高亮 ==========
    const Highlighter = {
        isHighlighted: false,
        highlightAttempts: 0,
        maxAttempts: 5,
        
        highlight() {
            // 如果已经高亮过且不是翻页触发的，跳过
            if (this.isHighlighted && this.highlightAttempts >= this.maxAttempts) {
                return;
            }
            
            this.highlightAttempts++;
            
            if (!State.keywords) return;
            
            const keywords = State.keywords.split(/\s+/).filter(w => w.length > 1);
            if (!keywords.length) return;
            
            const selectors = ['#content_left', '#search', '#b_results'];
            let container = null;
            
            for (const sel of selectors) {
                container = document.querySelector(sel);
                if (container) break;
            }
            
            if (!container) {
                // 如果没找到容器，500ms后重试
                if (this.highlightAttempts < this.maxAttempts) {
                    setTimeout(() => this.highlight(), 500);
                }
                return;
            }
            
            const textNodes = this.collectTextNodes(container);
            
            if (textNodes.length === 0) {
                if (this.highlightAttempts < this.maxAttempts) {
                    setTimeout(() => this.highlight(), 500);
                }
                return;
            }
            
            const theme = Theme.get();
            let highlightCount = 0;
            
            // 批量处理
            const nodesToReplace = [];
            
            textNodes.forEach(node => {
                let text = node.textContent;
                let modified = false;
                
                keywords.forEach(keyword => {
                    const regex = new RegExp(`(${Utils.escapeRegex(keyword)})`, 'gi');
                    if (regex.test(text)) {
                        text = text.replace(regex, 
                            `<mark style="background: ${theme.highlight}; color: #000; font-weight: 600; padding: 2px 4px; border-radius: 3px;">$1</mark>`
                        );
                        modified = true;
                        highlightCount++;
                    }
                });
                
                if (modified) {
                    nodesToReplace.push({ node, html: text });
                }
            });
            
            // 批量替换
            nodesToReplace.forEach(({ node, html }) => {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = html;
                node.parentNode.replaceChild(wrapper, node);
            });
            
            if (highlightCount > 0) {
                this.isHighlighted = true;
            }
        },
        
        // 重置状态（用于翻页时重新高亮）
        reset() {
            this.highlightAttempts = 0;
        },
        
        collectTextNodes(container) {
            const nodes = [];
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        // 跳过已处理的节点
                        if (node.parentNode.closest('mark')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        
                        const parent = node.parentNode;
                        if (['SCRIPT', 'STYLE', 'MARK', 'NOSCRIPT'].includes(parent.tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (parent.closest('#search-sidebar, #search-tip, #back-to-top')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        
                        // 只处理有实际内容的节点
                        if (node.textContent.trim().length === 0) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            
            let node;
            while (node = walker.nextNode()) {
                nodes.push(node);
            }
            return nodes;
        }
    };
    
    // ========== 快捷键 ==========
    const Shortcuts = {
        init() {
            document.addEventListener('keydown', (e) => {
                // Alt + 数字键切换搜索引擎
                if (e.altKey && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                    const engine = CONFIG.engines.find(eng => eng.key === e.key);
                    if (engine) {
                        e.preventDefault();
                        Utils.showTip(`🚀 切换到 ${engine.name}`);
                        setTimeout(() => Navigation.jumpTo(engine.url), 300);
                    }
                }
            });
        }
    };
    
    // ========== 样式注入 ==========
    const Styles = {
        inject() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes tipFadeIn {
                    from { opacity: 0; transform: translate(-50%, -40%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
                @keyframes tipFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                #search-sidebar:hover {
                    box-shadow: 0 8px 24px ${Theme.get().shadow};
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    // ========== 主程序 ==========
    const App = {
        init() {
            // 检查是否在搜索页面
            if (!CONFIG.engines.some(e => e.test.test(location.href))) {
                return;
            }
            
            // 初始化状态
            State.init();
            
            // 监听主题变化
            Theme.watch();
            
            // 注入样式
            Styles.inject();
            
            // 创建UI组件
            Sidebar.create();
            BackToTop.create();
            
            // 初始化快捷键
            Shortcuts.init();
            
            // 多次尝试高亮，确保成功
            const tryHighlight = () => Highlighter.highlight();
            
            // 立即尝试一次
            setTimeout(tryHighlight, 500);
            
            // 再次尝试
            setTimeout(tryHighlight, 1500);
            
            // 监听页面加载完成
            if (document.readyState !== 'complete') {
                window.addEventListener('load', () => {
                    setTimeout(tryHighlight, 500);
                });
            }
        }
    };
    
    // ========== 启动应用 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => App.init(), CONFIG.initDelay);
        });
    } else {
        setTimeout(() => App.init(), CONFIG.initDelay);
    }
    
})();