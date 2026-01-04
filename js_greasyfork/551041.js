// ==UserScript==
// @name         网易云音乐豆瓣跳转脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在网易云音乐和豆瓣之间添加双向跳转功能
// @author       shiyi
// @match        https://music.163.com/song*
// @match        https://music.163.com/album*
// @match        https://music.163.com/artist*
// @match        https://music.douban.com/subject/*
// @match        https://www.douban.com/personage/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551041/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/551041/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 平台配置
    const PLATFORMS = {
        NETEASE: {
            name: 'netease',
            domain: 'music.163.com',
            selectors: {
                // 歌曲页面选择器
                songName: '.f-ff2, .name, .tit',
                artistName: 'p.des:contains("歌手：") .s-fc7, .artist, .by',
                albumName: 'p.des:contains("所属专辑：") .s-fc7, .album',
                // 专辑页面选择器
                albumTitle: '.f-ff2, .tit',
                albumArtist: 'p.intr:contains("歌手：") .s-fc7, .artist',
                // 音乐人页面选择器
                artistTitle: '.f-ff2, .tit, .name, #artist-name'
            }
        },
        DOUBAN: {
            name: 'douban',
            domain: 'douban.com',
            selectors: {
                title: '#wrapper h1, .subject h1',
                artist: 'span.pl:contains("表演者:") a, .info a[href*="personage"]',
                albumInfo: '.pl, .info'
            }
        }
    };

    // 按钮样式
    const BUTTON_STYLES = {
        netease: {
            padding:'4px',
            color: '#ffffff',
            text: '🎵 在豆瓣查看',
            width: '31px',
            height: '31px',
        },
        douban: {
            padding:'8px',
            marginBottom:'8px',
            color: '#ffffff',
            text: '🎵 在网易云收听',
            width: '31px',
            height: '31px',
        }
    };

    /**
     * 信息提取模块
     */
    class InfoExtractor {
        /**
         * 提取网易云音乐页面信息
         */
        static extractNeteaseInfo() {
            const url = window.location.href;
            const selectors = PLATFORMS.NETEASE.selectors;

            if (url.includes('/song')) {
                return {
                    type: 'song',
                    songName: this.getTextContent(selectors.songName),
                    artistName: this.getTextContent(selectors.artistName),
                    albumName: this.getTextContent(selectors.albumName)
                };
            } else if (url.includes('/album')) {
                return {
                    type: 'album',
                    albumName: this.getTextContent(selectors.albumTitle),
                    artistName: this.getTextContent(selectors.albumArtist)
                };
            } else if (url.includes('/artist')) {
                return {
                    type: 'artist',
                    artistName: this.getTextContent(selectors.artistTitle)
                };
            }
            return null;
        }

        /**
         * 提取豆瓣页面信息
         */
        static extractDoubanInfo() {
            const url = window.location.href;
            const selectors = PLATFORMS.DOUBAN.selectors;

            if (url.includes('/subject/')) {
                const title = this.getTextContent(selectors.title);
                const artist = this.getTextContent(selectors.artist);

                return {
                    type: 'album',
                    albumName: title,
                    artistName: artist
                };
            } else if (url.includes('/personage/')) {
                return {
                    type: 'artist',
                    artistName: this.getTextContent(selectors.title)
                };
            }
            return null;
        }

        /**
         * 获取元素文本内容
         */
        static getTextContent(selector) {
            // 处理包含:contains的选择器
            if (selector.includes(':contains(')) {
                const match = selector.match(/(.+):contains\("(.+)"\)\s+(.+)/);
                if (match) {
                    const [, parentSelector, containsText, childSelector] = match;
                    const parentElements = document.querySelectorAll(parentSelector);
                    for (const parent of parentElements) {
                        if (parent.textContent.includes(containsText)) {
                            const child = parent.querySelector(childSelector);
                            if (child) {
                                return child.textContent.trim();
                            }
                        }
                    }
                    return '';
                }
            }

            // 处理普通选择器
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : '';
        }
    }

    /**
     * URL生成模块
     */
    class URLGenerator {
        /**
         * 生成豆瓣搜索URL
         */
        static generateDoubanSearchUrl(type, query) {
            const encodedQuery = encodeURIComponent(query);
            const typeMap = { song: '1003', album: '1003', artist: '1065' };
            const searchType = typeMap[type];
            return `https://www.douban.com/search?cat=${searchType}&q=${encodedQuery}`;
        }

        /**
         * 生成网易云音乐搜索URL
         */
        static generateNeteaseSearchUrl(type, query) {
            const typeMap = { album: '10', artist: '100' };
            const encodedQuery = encodeURIComponent(query);
            const searchType = typeMap[type] || '1';
            return `https://music.163.com/#/search/m/?s=${encodedQuery}&type=${searchType}`;
        }

        /**
         * 根据信息生成搜索查询字符串
         */
        static buildSearchQuery(info) {
            if (info.type === 'song') {
                return info.songName + ' ' + info.artistName || info.title || '';
            } else if (info.type === 'album') {
                return info.albumName + ' ' + info.artistName || info.title || '';
            } else if (info.type === 'artist') {
                return info.artistName || '';
            }
            return '';
        }
    }

    /**
     * 按钮创建和DOM操作模块
     */
    class ButtonManager {
        /**
         * 创建跳转按钮
         */
        static createJumpButton(text, url, platform) {
            const button = document.createElement('a');
            button.href = url;
            button.target = '_blank';
            button.className = `jump-button jump-button-${platform}`;
            button.title = text; // 添加tooltip提示

            // 创建SVG图标
            const svg = this.createSVGIcon(platform);
            button.appendChild(svg);

            // 应用样式
            const style = BUTTON_STYLES[platform];
            console.log('style',style);


            Object.assign(button.style, {
                ...style,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: style.color,
                textDecoration: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                border: 'none',
                boxSizing:'border-box',
                background: 'transparent',
            });

            // 添加悬停效果
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                button.style.background = 'transparent';
            });

            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                button.style.background = 'transparent';
            });

            return button;
        }

        /**
         * 创建SVG图标
         */
        static createSVGIcon(platform) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '32');
            svg.setAttribute('height', '32');
            svg.setAttribute('viewBox', '0 0 1024 1024');
            svg.setAttribute('fill', 'currentColor');

            if (platform === 'netease') {
                // 豆瓣图标 - 使用豆瓣绿色的跳转箭头
                svg.innerHTML = `
<path d="M192 818.72h640v-63.04H644.48a902.08 902.08 0 0 0 72.48-132.8l-49.28-32h90.4V340.96H272v249.28h86.4l-49.12 32A844.16 844.16 0 0 1 384 755.68H192zM340.16 528v-122.88h349.76V528z m30.88 62.88H656a933.92 933.92 0 0 1-84.96 165.44h-116.48a1401.92 1401.92 0 0 0-83.52-166.08zM210.56 205.28h607.2v62.4H210.56z" fill="#58CB6A" p-id="6323"></path>
                `;
            } else {
                // 网易云音乐图标 - 使用网易云红色的音乐播放图标
                svg.innerHTML = `
<path d="M627.086668 5.114963c28.132297-7.672445 58.822075-7.672445 86.954372 0 33.24726 7.672445 63.937038 23.017334 89.511853 43.477186 10.229926 7.672445 17.902371 15.344889 23.017334 28.132297 7.672445 17.902371 5.114963 38.362223-5.114963 53.707112-7.672445 12.787408-23.017334 23.017334-40.919704 25.574815-12.787408 2.557482-25.574815 0-38.362223-7.672445-5.114963-2.557482-10.229926-10.229926-17.902371-12.787407-17.902371-10.229926-35.804741-20.459852-56.264593-17.902371-15.344889 0-28.132297 7.672445-35.804742 17.902371-10.229926 10.229926-12.787408 23.017334-10.229926 35.804741 7.672445 25.574815 12.787408 53.707112 20.459853 79.281927 51.14963 2.557482 99.741779 15.344889 143.218965 40.919704 40.919704 25.574815 79.281927 58.822075 109.971705 97.184298 25.574815 33.24726 46.034667 71.609483 56.264593 112.529187 12.787408 43.477186 17.902371 89.511853 12.787408 132.989039-2.557482 38.362223-10.229926 74.166964-23.017334 109.971705-33.24726 84.39689-92.069335 161.121336-171.351261 209.713485-56.264593 35.804741-122.759113 58.822075-189.253633 66.49452-46.034667 5.114963-92.069335 5.114963-138.104002-2.557482-94.626816-15.344889-181.581188-61.379556-250.633189-130.431558-66.49452-66.49452-112.529187-153.448891-132.989039-245.518225-7.672445-69.052001-7.672445-138.104002 7.672445-207.156004 17.902371-81.839409 61.379556-161.121336 117.644149-222.500892 48.592149-51.14963 107.414224-89.511853 171.351262-117.64415 7.672445-2.557482 12.787408-5.114963 20.459852-7.672444 15.344889-2.557482 30.689778 0 43.477186 10.229926 17.902371 12.787408 25.574815 33.24726 23.017334 53.707112-2.557482 20.459852-17.902371 38.362223-35.804741 46.034667-63.937038 25.574815-122.759113 69.052001-163.678818 122.759113C205.102218 373.392302 179.527402 432.214377 171.854958 493.593933c-7.672445 61.379556 0 122.759113 20.459852 181.581188 30.689778 84.39689 94.626816 156.006373 173.908743 196.926077 48.592149 25.574815 102.299261 38.362223 156.006373 38.362223 43.477186 0 89.511853-7.672445 130.431558-23.017334 35.804741-12.787408 71.609483-33.24726 99.741779-58.822074 28.132297-23.017334 51.14963-53.707112 66.494519-84.396891 7.672445-15.344889 17.902371-33.24726 20.459853-51.14963 15.344889-51.14963 17.902371-107.414224 2.557481-158.563854-12.787408-43.477186-38.362223-81.839409-71.609482-109.971706-15.344889-12.787408-30.689778-25.574815-48.592149-35.804741-15.344889-7.672445-30.689778-15.344889-48.592149-17.902371 12.787408 46.034667 23.017334 92.069335 35.804741 135.546521 2.557482 10.229926 5.114963 23.017334 5.114963 33.24726 2.557482 46.034667-15.344889 94.626816-46.034667 130.431557-28.132297 33.24726-69.052001 58.822075-112.529187 66.49452-46.034667 10.229926-97.184298 0-138.104002-25.574815-38.362223-25.574815-66.49452-63.937038-81.839409-104.856743-7.672445-23.017334-12.787408-48.592149-12.787407-74.166964-2.557482-56.264593 12.787408-109.971705 43.477185-156.006373 35.804741-53.707112 94.626816-92.069335 158.563855-109.971705-5.114963-17.902371-10.229926-35.804741-12.787408-53.707112-12.787408-38.362223-10.229926-81.839409 7.672445-115.086668 10.229926-20.459852 23.017334-38.362223 40.919704-51.149631C583.609483 25.574815 604.069335 12.787408 627.086668 5.114963m-148.333928 414.312006c-17.902371 17.902371-28.132297 40.919704-33.24726 63.937038-5.114963 20.459852-5.114963 43.477186 0 66.49452 5.114963 23.017334 17.902371 46.034667 38.362223 61.379556 15.344889 10.229926 35.804741 15.344889 56.264594 10.229926 35.804741-5.114963 63.937038-38.362223 63.937038-74.166964-2.557482-7.672445-2.557482-17.902371-5.114963-25.574815-12.787408-48.592149-25.574815-99.741779-38.362223-148.333928-30.689778 7.672445-58.822075 23.017334-81.839409 46.034667z" fill="#E72D2C" p-id="5323"></path>
                `;
            }

            return svg;
        }

        /**
         * 在网易云音乐页面插入按钮
         */
        static insertNeteaseButton(button) {
            // 尝试多个可能的插入位置
            const selectors = [
                '#content-operation'
            ];

            for (const selector of selectors) {
                const target = document.querySelector(selector);
                if (target) {
                    target.appendChild(button);
                    return true;
                }
            }

            // 如果没有找到合适位置，尝试插入到body
            const fallbackContainer = document.createElement('div');
            fallbackContainer.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999;';
            fallbackContainer.appendChild(button);
            document.body.appendChild(fallbackContainer);
            return true;
        }

        /**
         * 在豆瓣页面插入按钮
         */
        static insertDoubanButton(button) {
            // 尝试多个可能的插入位置
            const selectors = [
                '.aside'
            ];

            for (const selector of selectors) {
                const target = document.querySelector(selector);
                if (target) {
                    // const container = document.createElement('div');
                    // container.style.cssText = 'margin: 15px 0; padding: 10px; border-top: 1px solid #eee;';
                    // container.appendChild(button);
                    target.insertBefore(button,target.firstChild);
                    return true;
                }
            }

            // 如果没有找到合适位置，尝试插入到body
            const fallbackContainer = document.createElement('div');
            fallbackContainer.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999;';
            fallbackContainer.appendChild(button);
            document.body.appendChild(fallbackContainer);
            return true;
        }
    }

    /**
     * 主控制器
     */
    class MusicBridge {
        static init() {
            // 等待页面加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.run());
            } else {
                this.run();
            }
        }

        static run() {
            const hostname = window.location.hostname;

            if (hostname.includes('music.163.com')) {
                this.handleNeteaseMusic();
            } else if (hostname.includes('douban.com')) {
                this.handleDouban();
            }
        }

        /**
         * 处理网易云音乐页面
         */
        static handleNeteaseMusic() {
            // 延迟执行，等待页面内容加载
            setTimeout(() => {
                const info = InfoExtractor.extractNeteaseInfo();
                if (info) {
                    const query = URLGenerator.buildSearchQuery(info);
                    if (query) {
                        const url = URLGenerator.generateDoubanSearchUrl(info.type, query);
                        const button = ButtonManager.createJumpButton(
                            BUTTON_STYLES.netease.text,
                            url,
                            'netease'
                        );
                        ButtonManager.insertNeteaseButton(button);
                    }
                }
            }, 1000);
        }

        /**
         * 处理豆瓣页面
         */
        static handleDouban() {
            // 延迟执行，等待页面内容加载
            setTimeout(() => {
                const info = InfoExtractor.extractDoubanInfo();
                console.log('info',info);
                if (info) {
                    const query = URLGenerator.buildSearchQuery(info);
                    if (query) {
                        const url = URLGenerator.generateNeteaseSearchUrl(info.type, query);
                        const button = ButtonManager.createJumpButton(
                            BUTTON_STYLES.douban.text,
                            url,
                            'douban'
                        );
                        ButtonManager.insertDoubanButton(button);
                    }
                }
            }, 1000);
        }
    }

    // 初始化脚本
    MusicBridge.init();

    // 监听页面变化（SPA应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // 页面URL变化时重新运行
            setTimeout(() => MusicBridge.run(), 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();