// ==UserScript==
// @name         Folo - 详情逻辑优化
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  点击头像/内容阻止跳转并标记为已读，点击图片/视频允许跳转，支持视频、图片和社交媒体页面
// @author       zc
// @match        https://app.folo.is/timeline/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555528/Folo%20-%20%E8%AF%A6%E6%83%85%E9%80%BB%E8%BE%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/555528/Folo%20-%20%E8%AF%A6%E6%83%85%E9%80%BB%E8%BE%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 常量定义 ====================
    const CONSTANTS = {
        API_URL: 'https://api.folo.is/reads',
        HANDLED_ATTR: 'data-click-handled',
        READ_CLASS: 'folo-read',
        MATCH_PATTERN: /^https:\/\/app\.folo\.is\/timeline\//,
        SELECTORS: {
            TITLE_AREA: 'div.relative.px-2.text-sm',
            SOCIAL_ARTICLE: 'article[to*="/timeline/social-media/"]',
            // 新增：社交媒体条目的通用选择器
            SOCIAL_POST: '.relative.flex.py-4.group',
            UNREAD_INDICATOR: '.size-1\\.5.rounded-full.bg-accent',
            UNREAD_COUNT: '.center.text-\\[0\\.65rem\\].tabular-nums.text-text-tertiary.ml-2',
            ACTIVE_FOLDER: '[data-active="true"][data-sub]',
            ENTRY_CONTAINER: '[data-entry-id]',
            GROUP_ELEMENT: '.group',
            // 新增：直接匹配包含伪元素的容器
            UNREAD_POST_SELECTOR: '.relative.flex.py-4.group'
        },
        POLLING_INTERVAL: 500,
        DOM_OBSERVER_DELAY: 100
    };

    const PAGE_TYPES = {
        VIDEO: 'videos',
        PICTURE: 'pictures',
        SOCIAL: 'social-media'
    };

    // ==================== 工具函数 ====================
    
    // 页面类型检测
    const PageUtils = {
        getPageType() {
            const path = window.location.pathname;
            if (path.includes(`/${PAGE_TYPES.VIDEO}/`)) return PAGE_TYPES.VIDEO;
            if (path.includes(`/${PAGE_TYPES.PICTURE}/`)) return PAGE_TYPES.PICTURE;
            if (path.includes(`/${PAGE_TYPES.SOCIAL}/`)) return PAGE_TYPES.SOCIAL;
            return null;
        },

        isMediaPage() {
            return this.getPageType() !== null;
        },

        isVideoOrPicturePage() {
            const type = this.getPageType();
            return type === PAGE_TYPES.VIDEO || type === PAGE_TYPES.PICTURE;
        },

        isSocialMediaPage() {
            return this.getPageType() === PAGE_TYPES.SOCIAL;
        }
    };

    // DOM 操作工具
    const DOMUtils = {
        isMediaElement(target) {
            const mediaElement = this.getMediaElement(target);
            if (!mediaElement) return false;
            return !this.isAvatar(mediaElement);
        },
        
        getMediaElement(target) {
            if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
                return target;
            }
            return target.closest('img') || target.closest('video');
        },
        
        isShowMoreButton(target) {
            const button = target.tagName === 'BUTTON' ? target : target.closest('button');
            return button && button.textContent.includes('显示更多');
        },
        
        isAvatar(element) {
            return element.closest('span[style*="width: 32px"][style*="height: 32px"]') !== null;
        },

        extractEntryId(container) {
            const entryContainer = container?.closest(CONSTANTS.SELECTORS.ENTRY_CONTAINER);
            if (entryContainer) {
                return entryContainer.getAttribute('data-entry-id') || null;
            }
            
            // 如果没有找到ENTRY_CONTAINER，尝试从更广泛的容器中提取
            const socialPost = container?.closest(CONSTANTS.SELECTORS.SOCIAL_POST);
            if (socialPost) {
                // 尝试从父级或更高级别元素中查找entryId
                const parentWithId = socialPost.closest('[data-entry-id]');
                if (parentWithId) {
                    return parentWithId.getAttribute('data-entry-id');
                }
            }
            
            return null;
        },
        
        // 新增：查找包含未读指示器的post元素
        findUnreadPostElement(target) {
            // 查找包含group类和未读指示器伪元素的元素
            return target.closest(CONSTANTS.SELECTORS.UNREAD_POST_SELECTOR) || 
                   target.closest('.group'); // 更通用的匹配
        }
    };

    // 样式管理
    const StyleManager = {
        _styleElement: null,

        init() {
            if (!this._styleElement) {
                this._styleElement = document.createElement('style');
                document.head.appendChild(this._styleElement);
            }
            this.updateStyles();
        },

        updateStyles() {
            this._styleElement.textContent = `
                .${CONSTANTS.READ_CLASS} ${CONSTANTS.SELECTORS.GROUP_ELEMENT}::before {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                }
                
                /* 新增：直接隐藏未读指示器的样式 */
                .${CONSTANTS.READ_CLASS}::before {
                    display: none !important;
                }
            `;
        },

        hideUnreadIndicatorById(entryId) {
            if (!entryId) return;
            
            const existingStyle = document.querySelector(`style[data-entry-id="${entryId}"]`);
            if (existingStyle) return;

            const style = document.createElement('style');
            style.setAttribute('data-entry-id', entryId);
            style.textContent = `
                [data-entry-id="${entryId}"] ${CONSTANTS.SELECTORS.GROUP_ELEMENT}::before,
                [data-entry-id="${entryId}"]::before {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                }
            `;
            document.head.appendChild(style);
        },
        
        // 新增：通过CSS类直接隐藏未读指示器
        hideUnreadIndicatorByElement(element) {
            if (!element) return;
            
            // 直接添加一个类来隐藏伪元素
            element.classList.add(CONSTANTS.READ_CLASS);
            
            // 同时尝试直接隐藏伪元素
            const style = document.createElement('style');
            style.setAttribute('data-element-processed', 'true');
            style.textContent = `
                #${element.id}::before,
                [data-element-id="${element.getAttribute('data-element-id') || element.textContent.substring(0, 20).replace(/\s+/g, '_')}"]::before {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // ==================== 核心功能 ====================
    
    // 事件处理器管理
    const EventHandlers = {
        attachClickHandler(element, handler) {
            if (element.hasAttribute(CONSTANTS.HANDLED_ATTR)) {
                return false;
            }
            element.addEventListener('click', handler, true);
            element.setAttribute(CONSTANTS.HANDLED_ATTR, 'true');
            element.style.cursor = 'pointer';
            return true;
        },

        handleTitleClick(event) {
            event.preventDefault();
            event.stopPropagation();

            const entryId = DOMUtils.extractEntryId(event.currentTarget);
            if (entryId) {
                ReadManager.markAsRead(entryId, event.currentTarget);
            } else {
                console.log('无法提取entryId，尝试通过其他方式处理');
                // 尝试通过元素本身处理
                ReadManager.markAsReadByElement(event.currentTarget);
            }

            return false;
        },

        handleSocialMediaArticleClick(event) {
            const target = event.target;
            
            // 检查是否应该允许跳转
            if (DOMUtils.isMediaElement(target) || DOMUtils.isShowMoreButton(target)) {
                console.log('允许跳转:', DOMUtils.isMediaElement(target) ? '媒体元素' : '显示更多按钮');
                return;
            }

            // 阻止跳转并标记为已读
            event.preventDefault();
            event.stopPropagation();

            const entryId = DOMUtils.extractEntryId(event.currentTarget);
            if (entryId) {
                ReadManager.markAsRead(entryId, event.currentTarget);
            } else {
                console.log('无法提取entryId，尝试通过元素处理');
                // 尝试通过元素本身处理
                ReadManager.markAsReadByElement(event.currentTarget);
            }

            return false;
        },
        
        // 新增：处理通用社交媒体帖子点击
        handleSocialMediaPostClick(event) {
            const target = event.target;
            
            // 检查是否应该允许跳转
            if (DOMUtils.isMediaElement(target) || DOMUtils.isShowMoreButton(target)) {
                console.log('允许跳转:', DOMUtils.isMediaElement(target) ? '媒体元素' : '显示更多按钮');
                return;
            }

            // 阻止跳转并标记为已读
            event.preventDefault();
            event.stopPropagation();

            const entryId = DOMUtils.extractEntryId(event.currentTarget);
            if (entryId) {
                ReadManager.markAsRead(entryId, event.currentTarget);
            } else {
                console.log('无法提取entryId，尝试通过元素处理');
                // 尝试通过元素本身处理
                ReadManager.markAsReadByElement(event.currentTarget);
            }

            return false;
        }
    };

    // 已读状态管理
    const ReadManager = {
        markAsRead(entryId, entryContainer) {
            const requestData = {
                entryIds: [entryId],
                isInbox: false
            };

            console.log('发送标记为已读请求:', requestData);

            fetch(CONSTANTS.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Cache-Control': 'no-store',
                },
                body: JSON.stringify(requestData),
                credentials: 'include'
            })
            .then(response => {
                if (response.ok || response.status === 204) {
                    console.log('成功标记为已读:', entryId);
                    this.removeUnreadIndicator(entryContainer, entryId);
                    this.updateFolderUnreadCount();
                } else {
                    console.error('标记为已读失败:', response.status);
                    // 即使API失败，也尝试前端隐藏未读指示器
                    this.removeUnreadIndicator(entryContainer, entryId);
                }
            })
            .catch(error => {
                console.error('请求错误:', error);
                // 即使网络请求失败，也尝试前端隐藏未读指示器
                this.removeUnreadIndicator(entryContainer, entryId);
            });
        },
        
        // 新增：通过元素直接标记为已读（当无法提取entryId时）
        markAsReadByElement(element) {
            console.log('通过元素直接标记为已读');
            // 尝试隐藏未读指示器
            this.removeUnreadIndicatorByElement(element);
            
            // 尝试查找可能的entryId
            const possibleEntryId = this.findPossibleEntryId(element);
            if (possibleEntryId) {
                this.markAsRead(possibleEntryId, element);
            } else {
                console.log('无法找到entryId，仅进行前端处理');
            }
        },
        
        // 新增：查找可能的entryId
        findPossibleEntryId(element) {
            // 从当前元素及其祖先元素中查找可能的entryId
            let current = element;
            while (current && current !== document) {
                if (current.hasAttribute('data-entry-id')) {
                    return current.getAttribute('data-entry-id');
                }
                current = current.parentElement;
            }
            
            // 如果没找到，尝试其他可能的ID属性
            current = element;
            while (current && current !== document) {
                const idAttr = current.getAttribute('id');
                if (idAttr && idAttr.startsWith('entry-')) {
                    return idAttr.replace('entry-', '');
                }
                current = current.parentElement;
            }
            
            return null;
        },

        removeUnreadIndicator(entryContainer, entryId) {
            if (!entryContainer) return;

            // 尝试直接移除未读指示器元素
            const unreadIndicator = entryContainer.querySelector(CONSTANTS.SELECTORS.UNREAD_INDICATOR);
            
            if (unreadIndicator) {
                unreadIndicator.remove();
                console.log('已移除图片/视频未读指示器');
                return;
            }

            // 处理社交媒体的伪元素指示器
            const socialArticle = entryContainer.querySelector('article');
            if (socialArticle) {
                const groupElement = socialArticle.querySelector(CONSTANTS.SELECTORS.GROUP_ELEMENT);
                
                if (groupElement) {
                    StyleManager.hideUnreadIndicatorById(entryId);
                    entryContainer.classList.add(CONSTANTS.READ_CLASS);
                    console.log('已移除社交媒体未读指示器');
                } else {
                    console.log('未找到社交媒体group元素');
                }
            } else {
                // 新增：处理非article结构的社交媒体帖子
                this.removeUnreadIndicatorByElement(entryContainer);
            }
        },
        
        // 新增：通过元素直接移除未读指示器
        removeUnreadIndicatorByElement(element) {
            if (!element) return;
            
            console.log('通过元素直接移除未读指示器');
            
            // 尝试多种方式隐藏未读指示器
            // 1. 添加已读类
            element.classList.add(CONSTANTS.READ_CLASS);
            
            // 2. 使用StyleManager隐藏
            StyleManager.hideUnreadIndicatorByElement(element);
            
            // 3. 直接操作样式
            const groupElement = element.closest('.group');
            if (groupElement) {
                // 创建临时样式来隐藏伪元素
                const tempStyle = document.createElement('style');
                tempStyle.textContent = `
                    .temp-hide-unread::before {
                        display: none !important;
                    }
                `;
                document.head.appendChild(tempStyle);
                
                groupElement.classList.add('temp-hide-unread');
                
                // 稍后移除临时样式类
                setTimeout(() => {
                    groupElement.classList.remove('temp-hide-unread');
                    tempStyle.remove();
                }, 100);
            }
            
            // 4. 查找并移除可能的未读指示器元素
            const possibleIndicators = element.querySelectorAll('.size-1\\.5.rounded-full.bg-accent, [class*="bg-accent"][class*="size-1"]');
            possibleIndicators.forEach(indicator => {
                indicator.remove();
            });
        },

        updateFolderUnreadCount() {
            const activeFolder = document.querySelector(CONSTANTS.SELECTORS.ACTIVE_FOLDER);
            
            if (!activeFolder) {
                console.log('未找到活跃文件夹');
                return;
            }

            const unreadCountElement = activeFolder.querySelector(CONSTANTS.SELECTORS.UNREAD_COUNT);
            
            if (!unreadCountElement) {
                console.log('未找到未读数元素');
                return;
            }

            let currentCount = parseInt(unreadCountElement.textContent, 10);
            if (!isNaN(currentCount) && currentCount > 0) {
                currentCount--;
                unreadCountElement.textContent = currentCount.toString();
                console.log(`更新文件夹未读数: ${currentCount + 1} -> ${currentCount}`);
                
                if (currentCount === 0) {
                    unreadCountElement.style.display = 'none';
                }
            } else {
                console.log('无效的未读数:', unreadCountElement.textContent);
            }
        }
    };

    // 点击处理器添加
    const ClickHandlerManager = {
        addClickHandlers() {
            if (!PageUtils.isMediaPage()) return;

            let handledCount = 0;

            // 处理视频和图片页面
            if (PageUtils.isVideoOrPicturePage()) {
                handledCount += this.handleVideoAndPicturePages();
            }

            // 处理社交媒体页面
            if (PageUtils.isSocialMediaPage()) {
                handledCount += this.handleSocialMediaPages();
                // 新增：处理通用社交媒体帖子
                handledCount += this.handleGeneralSocialMediaPosts();
            }

            console.log(`已为 ${handledCount} 个元素添加点击处理`);
        },

        handleVideoAndPicturePages() {
            const titleAreas = document.querySelectorAll(CONSTANTS.SELECTORS.TITLE_AREA);
            let count = 0;
            
            titleAreas.forEach(titleArea => {
                if (EventHandlers.attachClickHandler(titleArea, EventHandlers.handleTitleClick)) {
                    count++;
                }
            });

            return count;
        },

        handleSocialMediaPages() {
            const socialArticles = document.querySelectorAll(CONSTANTS.SELECTORS.SOCIAL_ARTICLE);
            let count = 0;
            
            socialArticles.forEach(article => {
                if (EventHandlers.attachClickHandler(article, EventHandlers.handleSocialMediaArticleClick)) {
                    count++;
                }
            });

            return count;
        },
        
        // 新增：处理通用社交媒体帖子
        handleGeneralSocialMediaPosts() {
            const socialPosts = document.querySelectorAll(CONSTANTS.SELECTORS.UNREAD_POST_SELECTOR);
            let count = 0;
            
            socialPosts.forEach(post => {
                // 检查是否已经有处理程序
                if (!post.hasAttribute(CONSTANTS.HANDLED_ATTR)) {
                    post.addEventListener('click', EventHandlers.handleSocialMediaPostClick, true);
                    post.setAttribute(CONSTANTS.HANDLED_ATTR, 'true');
                    post.style.cursor = 'pointer';
                    count++;
                }
            });

            return count;
        }
    };

    // ==================== 监听器 ====================
    
    // URL 变化监听
    const URLObserver = {
        currentUrl: window.location.href,

        init() {
            setInterval(() => {
                if (window.location.href !== this.currentUrl) {
                    this.currentUrl = window.location.href;

                    if (CONSTANTS.MATCH_PATTERN.test(this.currentUrl)) {
                        console.log('检测到URL变化，重新初始化脚本');
                        App.initializeForCurrentPage();
                    }
                }
            }, CONSTANTS.POLLING_INTERVAL);
        }
    };

    // DOM 变化监听
    const DOMObserver = {
        observer: null,

        init() {
            this.observer = new MutationObserver((mutations) => {
                const hasNewNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
                if (hasNewNodes) {
                    setTimeout(() => {
                        ClickHandlerManager.addClickHandlers();
                    }, CONSTANTS.DOM_OBSERVER_DELAY);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        disconnect() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    };

    // ==================== 应用初始化 ====================
    
    const App = {
        initializeForCurrentPage() {
            if (PageUtils.isMediaPage()) {
                ClickHandlerManager.addClickHandlers();
                DOMObserver.init();
                
                if (PageUtils.isSocialMediaPage()) {
                    StyleManager.init();
                }
                
                console.log('Folo媒体快速标记为已读脚本已为当前页面加载');
            }
        },

        init() {
            this.initializeForCurrentPage();
            URLObserver.init();
            console.log('Folo媒体快速标记为已读脚本已加载，支持前端路由');
        }
    };

    // ==================== 启动应用 ====================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();