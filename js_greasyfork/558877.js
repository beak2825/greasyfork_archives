// ==UserScript==
// @name         69悄悄用
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在69悄悄看评论
// @author       wulalala
// @author       ai
// @license      MIT
// @match        *://www.69shuba.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      qidian.com
// @connect      www.qidian.com
// @connect      m.qidian.com
// @connect      qdfepccdn.qidian.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558877/69%E6%82%84%E6%82%84%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558877/69%E6%82%84%E6%82%84%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置
    const CONFIG = {
        // 起点API地址
        API_BASE: 'https://www.qidian.com',
        // 本章说摘要API（获取段落评论统计）
        REVIEW_SUMMARY_API: 'https://www.qidian.com/webcommon/chapterreview/reviewsummary',
        // 段评详情API（获取具体评论内容）
        REVIEW_DETAIL_API: 'https://www.qidian.com/webcommon/chapterreview/reviewlist',
        // 段评API
        PARAGRAPH_API: 'https://www.qidian.com/webcommon/chapterreview/paragraphreview'
    };

    // 添加CSS样式
    GM_addStyle(`
        /* 页面整体样式 */
        body,
        .mybox {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAAAXNSR0IArs4c6QAAAWlJREFUeNqlloFtwzAMBFU0PxF34k5eoUtktBZVnBysixEEUWBD+idpUnrTGXNkhPvt18awXZjKyE5BE5ix8sw6IEQHfKA1kZoMF5ZNnndqy1k2vae+wTAjMBPIp+sY3QJP1JADaXtvFjv4LR1TFKA5GD4suFSQcGEhjPWRn2+zKpRLT0hBwSo3lRerdpScpbMQCgZS2cH4tHQwerJVPIQjUVBH9wFTPOMgxnRwObhWLLkKlpaJA8TnpDxBwEv1r8Uo+ImegDVX4DBXKKWt3mQnZRRMlxZ7vfxDra6j0vD8vKUtKvJ79Pt1X9W6XxZNTvphhYxcGEjneWncGVH3pM2kAs6Qlq4XDIus4x2qDKieYEsz0nTAYd96MelYZEEgElZxnJtEa4mefZpr7hHGsLLmS2uDVgPGEUadgBxwrn3zwRwGhkU2NVqy6fUEbRs1CruoCM5zlPaIIL6/biLs0edft/d7IfjhT9gfL6wnSxDYPyIAAAAASUVORK5CYII=) !important;
            background-attachment: scroll !important;
        }

        body {
            background-color: #ebe6da !important;
        }

        #pageheadermenu {
            display: none !important;
        }

        .bread, .bread a {
            color: rgba(0, 0, 0, .48) !important;
        }

        .mybox {
            background-color: #f5f1e8 !important;
        }

        h1.novel-paragraph {
            background: unset !important;
            text-align: left !important;
            font-weight: 500 !important;
        }

        .txtinfo {
            text-align: left !important;
            padding: 0 10px !important;
            margin-bottom: 20px !important;
            color: rgba(0, 0, 0, .48) !important;
        }

        /* 本章说标记样式 */
        .review {
            display: inline-block;
            height: 16px;
            line-height: 1.4;
            margin-bottom: .4em;
            align-self: flex-end;position: relative;
            text-align: center;
            vertical-align: bottom;
            width: 24px;
            text-indent: 0;
        }

        .review-icon {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 24px !important;
            height: 16px !important;
            -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='25' height='17' viewBox='0 0 25 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 14.5v-12a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7.528a2 2 0 0 1-.211.894l-2.065 4.13a1 1 0 0 0 .894 1.448H22a2 2 0 0 0 2-2z' stroke='%23CCC'/%3E%3C/svg%3E") !important;
            mask-image: url("data:image/svg+xml,%3Csvg width='25' height='17' viewBox='0 0 25 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 14.5v-12a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7.528a2 2 0 0 1-.211.894l-2.065 4.13a1 1 0 0 0 .894 1.448H22a2 2 0 0 0 2-2z' stroke='%23CCC'/%3E%3C/svg%3E") !important;
            -webkit-mask-position: center center !important;
            mask-position: center center !important;
            -webkit-mask-repeat: no-repeat !important;
            mask-repeat: no-repeat !important;
            -webkit-mask-size: 100% !important;
            mask-size: 100% !important;
            background: #999 !important;
        }

        .review-count {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 24px !important;
            height: 16px !important;
            line-height: 16px !important;
            text-align: center !important;
            font-size: 11px !important;
            color: #666 !important;
            z-index: 2 !important;
            pointer-events: none !important;
        }

        .novel-paragraph.highlight .content-text {
            background: rgba(0, 0, 0, 0.08) !important;
            text-decoration: underline dashed !important;
            text-decoration-color: #7c4d4d !important;
        }

        .noise-bg {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAAAXNSR0IArs4c6QAAAWlJREFUeNqlloFtwzAMBFU0PxF34k5eoUtktBZVnBysixEEUWBD+idpUnrTGXNkhPvt18awXZjKyE5BE5ix8sw6IEQHfKA1kZoMF5ZNnndqy1k2vae+wTAjMBPIp+sY3QJP1JADaXtvFjv4LR1TFKA5GD4suFSQcGEhjPWRn2+zKpRLT0hBwSo3lRerdpScpbMQCgZS2cH4tHQwerJVPIQjUVBH9wFTPOMgxnRwObhWLLkKlpaJA8TnpDxBwEv1r8Uo+ImegDVX4DBXKKWt3mQnZRRMlxZ7vfxDra6j0vD8vKUtKvJ79Pt1X9W6XxZNTvphhYxcGEjneWncGVH3pM2kAs6Qlq4XDIus4x2qDKieYEsz0nTAYd96MelYZEEgElZxnJtEa4mefZpr7hHGsLLmS2uDVgPGEUadgBxwrn3zwRwGhkU2NVqy6fUEbRs1CruoCM5zlPaIIL6/biLs0edft/d7IfjhT9gfL6wnSxDYPyIAAAAASUVORK5CYII=);
            background-attachment: scroll;
        }
    `);

    // 工具函数
    const Utils = {
        // 将评论中的表情代码转换为图片
        parseEmoji(text) {
            if (!text) return '';
            // 匹配 [fn=数字] 格式
            return text.replace(/\[fn=(\d+)\]/g, (match, emojiId) => {
                return `<img src="https://qdfepccdn.qidian.com/gtimg/app_emoji_new/newface_${emojiId}.png" style="display: inline-block; width: 22px; height: 22px; vertical-align: middle; margin: 0 2px;" alt="[表情${emojiId}]">`;
            });
        },

        // 获取CSRF Token
        getCsrfToken() {
            // 优先从cookie中提取
            const cookie = localStorage.getItem('qidian_cookie');
            if (cookie) {
                const match = cookie.match(/_csrfToken=([^;]+)/);
                if (match) return match[1];
            }
            // 兜底使用单独保存的token
            const savedToken = localStorage.getItem('qidian_csrf_token');
            if (savedToken) {
                return savedToken;
            }
            return '';
        },

        // 获取起点Cookie
        getQidianCookie() {
            return localStorage.getItem('qidian_cookie') || '';
        },

        // 发起跨域请求
        request(url, options = {}) {
            return new Promise((resolve, reject) => {
                // 添加CSRF token到URL
                const csrfToken = this.getCsrfToken();
                const cookie = this.getQidianCookie();
                let finalUrl = url;

                console.log('CSRF Token:', csrfToken ? `${csrfToken.substring(0, 10)}...` : '未设置');

                if (csrfToken) {
                    const separator = url.includes('?') ? '&' : '?';
                    finalUrl = `${url}${separator}_csrfToken=${csrfToken}`;
                }

                console.log('最终请求URL:', finalUrl);

                // 构建请求头
                const headers = {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'Referer': 'https://www.qidian.com/',
                    'x-d': '0',
                    ...options.headers
                };

                // 添加Cookie
                if (cookie) {
                    headers['cookie'] = cookie;
                }

                console.log('请求头:', JSON.stringify(headers, null, 2));

                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: finalUrl,
                    headers: headers,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            resolve(response.responseText);
                        }
                    },
                    onerror: reject
                });
            });
        },

        // 从起点URL中提取书籍ID和章节ID
        parseQidianUrl(url) {
            if (!url) return null;

            // 匹配起点章节URL格式：
            // https://www.qidian.com/chapter/1039058592/794929136/
            // https://m.qidian.com/book/1039058592/794929136
            // https://vipreader.qidian.com/chapter/1039058592/794929136

            const patterns = [
                // PC端章节页
                /qidian\.com\/chapter\/(\d+)\/(\d+)/,
                // 移动端章节页
                /m\.qidian\.com\/book\/(\d+)\/(\d+)/,
                // VIP阅读器
                /vipreader\.qidian\.com\/chapter\/(\d+)\/(\d+)/
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) {
                    return {
                        bookId: match[1],
                        chapterId: match[2]
                    };
                }
            }

            return null;
        },

        // 从章节标题或URL中提取书籍ID和章节ID
        extractBookInfo() {
            // 这里需要根据不同的小说网站来适配
            // 目前返回null，后续会完善
            return {
                bookId: null,
                chapterId: null,
                chapterTitle: document.title
            };
        },

        // 通过章节名搜索起点对应的章节
        async searchQidianChapter(bookName, chapterTitle) {
            // TODO: 实现搜索逻辑
            return null;
        }
    };

    // 本章说管理器
    class ChapterReviewManager {
        constructor() {
            this.bookId = null;
            this.chapterId = null;
            this.reviews = [];
        }

        // 获取本章说摘要（段落统计）
        async fetchReviewSummary(bookId, chapterId) {
            try {
                const summaryUrl = `${CONFIG.REVIEW_SUMMARY_API}?bookId=${bookId}&chapterId=${chapterId}`;
                console.log('请求本章说摘要URL:', summaryUrl);

                const summaryResponse = await Utils.request(summaryUrl);
                console.log('本章说摘要API响应:', summaryResponse);

                if (!summaryResponse || summaryResponse.code !== 0) {
                    console.warn('获取摘要失败:', summaryResponse);
                    return [];
                }

                const segments = summaryResponse.data.list || [];
                console.log('找到段落数量:', segments.length);

                return segments.filter(seg => seg.reviewNum > 0);
            } catch (error) {
                console.error('获取本章说摘要失败:', error);
                return [];
            }
        }

        // 获取单个段落的评论详情
        async fetchSegmentReviews(bookId, chapterId, segmentId) {
            try {
                const detailUrl = `${CONFIG.REVIEW_DETAIL_API}?bookId=${bookId}&chapterId=${chapterId}&page=1&pageSize=20&segmentId=${segmentId}&type=2`;
                console.log('请求段落评论URL:', detailUrl);

                const detailResponse = await Utils.request(detailUrl);
                console.log('段落评论响应:', detailResponse);

                if (detailResponse && detailResponse.code === 0 && detailResponse.data) {
                    return detailResponse.data.list || [];
                }
                return [];
            } catch (error) {
                console.error('获取段落评论失败:', error);
                return [];
            }
        }

        // 获取段评数据
        async fetchParagraphReviews(bookId, chapterId, paragraphId) {
            try {
                const url = `${CONFIG.PARAGRAPH_API}?bookId=${bookId}&chapterId=${chapterId}&paragraphId=${paragraphId}`;
                const response = await Utils.request(url);

                if (response && response.data) {
                    return response.data.reviews || [];
                }
                return [];
            } catch (error) {
                console.error('获取段评失败:', error);
                return [];
            }
        }
    }

    // UI管理器
    class UIManager {
        constructor() {
            this.panel = null;
            this.isVisible = false;
            this.bookId = null;
            this.chapterId = null;
            this.segments = [];
            this.manager = null;
        }

        // 创建浮动按钮
        createFloatingButton() {
            // 主按钮
            const button = document.createElement('div');
            button.id = 'qidian-review-btn';
            button.innerHTML = '本<br>章<br>说';
            button.style.cssText = `
                position: fixed;
                right: 20px;
                bottom: 100px;
                width: 60px;
                height: 60px;
                background: #e65540;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                font-size: 12px;
                line-height: 1.3;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: all 0.3s;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.1)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('click', () => {
                this.togglePanel();
            });

            document.body.appendChild(button);

            // 校准按钮
            const calibrateBtn = document.createElement('div');
            calibrateBtn.id = 'qidian-calibrate-btn';
            calibrateBtn.innerHTML = '校准<br>段落';
            calibrateBtn.style.cssText = `
                position: fixed;
                right: 20px;
                bottom: 30px;
                width: 60px;
                height: 60px;
                background: #52c41a;
                color: white;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                font-size: 12px;
                line-height: 1.3;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: all 0.3s;
            `;

            calibrateBtn.addEventListener('mouseenter', () => {
                calibrateBtn.style.transform = 'scale(1.1)';
            });

            calibrateBtn.addEventListener('mouseleave', () => {
                calibrateBtn.style.transform = 'scale(1)';
            });

            calibrateBtn.addEventListener('click', () => {
                this.startCalibration();
            });

            document.body.appendChild(calibrateBtn);
            this.calibrateBtn = calibrateBtn;

            // 设置按钮
            const settingsBtn = document.createElement('div');
            settingsBtn.innerHTML = '⚙️';
            settingsBtn.style.cssText = `
                position: fixed;
                right: 20px;
                bottom: 30px;
                width: 50px;
                height: 50px;
                background: #666;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                font-size: 24px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: all 0.3s;
            `;

            settingsBtn.addEventListener('mouseenter', () => {
                settingsBtn.style.transform = 'scale(1.1)';
            });

            settingsBtn.addEventListener('mouseleave', () => {
                settingsBtn.style.transform = 'scale(1)';
            });

            settingsBtn.addEventListener('click', () => {
                this.showSettingsDialog();
            });

            document.body.appendChild(settingsBtn);
        }

        // 显示设置对话框
        showSettingsDialog() {
            const existingDialog = document.getElementById('qidian-settings-dialog');
            if (existingDialog) {
                existingDialog.remove();
            }

            const dialog = document.createElement('div');
            dialog.id = 'qidian-settings-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                max-width: 90%;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                padding: 20px;
            `;

            const savedCookie = localStorage.getItem('qidian_cookie') || '';

            dialog.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #333;">起点Cookie设置</h3>
                <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                    在已登录起点的浏览器中，按F12 → Network → 找到任意起点请求 → 复制Cookie值：
                </p>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #333; font-size: 13px; font-weight: bold;">Cookie：</label>
                    <textarea id="qidian-cookie-input" style="width: 100%; height: 150px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; font-family: monospace; resize: vertical;" placeholder="复制请求头中的Cookie值">${savedCookie}</textarea>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="qidian-settings-cancel" style="padding: 8px 20px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer;">取消</button>
                    <button id="qidian-settings-save" style="padding: 8px 20px; background: #e65540; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
                </div>
            `;

            document.body.appendChild(dialog);

            // 添加遮罩层
            const overlay = document.createElement('div');
            overlay.id = 'qidian-settings-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            `;
            document.body.appendChild(overlay);

            // 绑定事件
            document.getElementById('qidian-settings-cancel').addEventListener('click', () => {
                dialog.remove();
                overlay.remove();
            });

            document.getElementById('qidian-settings-save').addEventListener('click', () => {
                const cookieInput = document.getElementById('qidian-cookie-input').value.trim();

                if (!cookieInput) {
                    alert('请输入Cookie！');
                    return;
                }

                localStorage.setItem('qidian_cookie', cookieInput);

                alert('Cookie已保存！刷新页面后生效。');
                dialog.remove();
                overlay.remove();
            });

            overlay.addEventListener('click', () => {
                dialog.remove();
                overlay.remove();
            });
        }

        // 创建本章说面板
        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'qidian-review-panel';
            panel.className = 'noise-bg';
            panel.style.cssText = `
                position: fixed;
                right: -400px;
                top: 0;
                width: 400px;
                height: 100vh;
                background: #f5f1e8;;
                box-shadow: -2px 0 10px rgba(0,0,0,0.3);
                z-index: 9998;
                transition: right 0.3s;
                overflow-y: auto;
            `;

            panel.innerHTML = `
                <div style="padding: 20px;">
                    <h2 style="margin: 0 0 20px 0; color: #e65540;">起点本章说</h2>
                    <div id="review-content">
                        <p style="color: #999;">正在加载...</p>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.panel = panel;
        }

        // 切换面板显示
        togglePanel() {
            if (!this.panel) {
                this.createPanel();
            }

            this.isVisible = !this.isVisible;
            this.panel.style.right = this.isVisible ? '0' : '-400px';

            if (this.isVisible) {
                // 如果已经加载过，显示章节信息
                if (this.bookId && this.chapterId) {
                    this.showChapterInfo();
                } else {
                    // 否则显示输入表单
                    this.showInputForm();
                }
            }
        }

        // 显示当前章节信息
        showChapterInfo() {
            const contentDiv = document.getElementById('review-content');
            const currentTitle = this.extractCurrentChapterTitle();

            contentDiv.innerHTML = `
                <div style="padding: 20px;">
                    <h3 style="margin: 0 0 20px 0; color: #e65540;">当前章节信息</h3>

                    <div style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border: 1px solid #91d5ff; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;">
                            <strong>当前章节：</strong>${currentTitle || '未知'}
                        </p>
                        <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;">
                            <strong>书籍ID：</strong>${this.bookId}
                        </p>
                        <p style="margin: 0; color: #666; font-size: 13px;">
                            <strong>章节ID：</strong>${this.chapterId}
                        </p>
                    </div>

                    <div style="margin-bottom: 20px; padding: 15px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #52c41a; font-size: 14px; font-weight: bold;">
                            ✅ 本章说已加载
                        </p>
                        <p style="margin: 0; color: #666; font-size: 13px;">
                            找到 ${this.segments.length} 个有评论的段落
                        </p>
                    </div>

                    <button id="reload-reviews-btn" style="width: 100%; padding: 10px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-bottom: 10px;">
                        重新加载
                    </button>

                    <button id="change-chapter-btn" style="width: 100%; padding: 10px; background: #f0f0f0; color: #666; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                        切换章节
                    </button>
                </div>
            `;

            // 绑定按钮事件
            setTimeout(() => {
                const reloadBtn = document.getElementById('reload-reviews-btn');
                const changeBtn = document.getElementById('change-chapter-btn');

                if (reloadBtn) {
                    reloadBtn.addEventListener('click', () => {
                        // 清除标记，重新加载
                        document.querySelectorAll('.review').forEach(m => m.remove());
                        this.panel.style.right = '-400px';
                        this.isVisible = false;
                        this.loadReviews(this.bookId, this.chapterId);
                    });
                }

                if (changeBtn) {
                    changeBtn.addEventListener('click', () => {
                        this.showInputForm();
                    });
                }
            }, 0);
        }

        // 加载本章说
        async loadReviews(manualBookId = null, manualChapterId = null, showPanel = false) {
            // 如果需要显示面板，先创建并显示加载状态
            if (showPanel) {
                if (!this.panel) {
                    this.createPanel();
                }
                const contentDiv = document.getElementById('review-content');
                if (contentDiv) {
                    contentDiv.innerHTML = '<p style="color: #999;">正在加载本章说...</p>';
                }
            }

            let bookId = manualBookId;
            let chapterId = manualChapterId;

            // 如果没有手动输入，尝试从本地存储加载映射
            if (!bookId || !chapterId) {
                const currentPageUrl = window.location.href;

                // 方式1：尝试加载当前页面的精确映射
                const mappingKey = `qidian_mapping_${currentPageUrl}`;
                const savedMapping = localStorage.getItem(mappingKey);

                if (savedMapping) {
                    try {
                        const mapping = JSON.parse(savedMapping);
                        bookId = mapping.bookId;
                        chapterId = mapping.chapterId;
                        console.log('✅ 从精确映射加载:', mapping);
                    } catch (e) {
                        console.error('解析映射失败:', e);
                    }
                }

                // 方式2：如果没有精确映射，尝试通过章节列表匹配
                if (!bookId || !chapterId) {
                    const bookKey = this.extractBookKey(currentPageUrl);
                    const bookDataKey = `qidian_book_${bookKey}`;
                    const savedBookData = localStorage.getItem(bookDataKey);

                    if (savedBookData) {
                        try {
                            const bookData = JSON.parse(savedBookData);
                            const currentTitle = this.extractCurrentChapterTitle();

                            if (currentTitle && bookData.chapters) {
                                const matched = this.matchChapter(bookData.chapters, currentTitle);
                                if (matched) {
                                    bookId = bookData.bookId;
                                    chapterId = matched.id.toString();
                                    console.log('🎯 通过章节列表匹配成功!');
                                }
                            }
                        } catch (e) {
                            console.error('章节匹配失败:', e);
                        }
                    }
                }
            }

            // 如果还是没有，显示输入表单
            if (!bookId || !chapterId) {
                if (showPanel) {
                    this.showInputForm();
                }
                return;
            }

            console.log('开始加载本章说 - 书籍ID:', bookId, '章节ID:', chapterId);

            try {
                this.manager = new ChapterReviewManager();
                this.bookId = bookId;
                this.chapterId = chapterId;
                this.segments = await this.manager.fetchReviewSummary(bookId, chapterId);

                // 如果是显示面板模式，关闭侧边栏
                if (showPanel && this.panel) {
                    this.panel.style.right = '-400px';
                    this.isVisible = false;
                }

                // 在正文段落上添加评论标记
                this.injectReviewMarkers();

                // 显示校准按钮
                if (this.calibrateBtn) {
                    this.calibrateBtn.style.display = 'flex';
                }

                console.log(`✅ 成功加载本章说！找到 ${this.segments.length} 个有评论的段落`);
            } catch (error) {
                console.error('加载本章说出错:', error);
                if (showPanel) {
                    alert('加载失败：' + (error.message || '未知错误'));
                }
            }
        }

        // 在正文段落上注入评论标记
        injectReviewMarkers() {
            // 查找正文容器 - 优先查找包含正文的容器
            let contentDiv = document.querySelector('.txtnav');

            // 如果找到.txtnav，需要排除其中的广告容器，但保留标题和信息
            if (contentDiv) {
                // 只移除广告容器
                const adDiv = contentDiv.querySelector('#txtright');
                if (adDiv) {
                    adDiv.remove();
                }
                const bottomAd = contentDiv.querySelector('.bottom-ad');
                if (bottomAd) bottomAd.remove();
            } else {
                // 尝试其他选择器
                contentDiv = document.querySelector('#content') ||
                    document.querySelector('.content') ||
                    document.querySelector('.chapter-content');
            }

            if (!contentDiv) {
                console.error('未找到正文容器');
                return;
            }

            console.log('找到正文容器:', contentDiv.className || contentDiv.id);

            // 先转换为标准的p标签结构
            this.convertToParagraphs(contentDiv);

            // 获取所有段落
            const paragraphs = contentDiv.querySelectorAll('p.novel-paragraph');
            console.log('找到段落数量:', paragraphs.length);

            if (paragraphs.length === 0) {
                console.error('转换后未找到段落');
                return;
            }

            // 先清除所有旧的评论标记
            contentDiv.querySelectorAll('.review').forEach(marker => marker.remove());

            // 为每个有评论的段落添加标记
            this.segments.forEach(segment => {
                const segmentId = segment.segmentId;

                // 通过data-index属性查找对应的段落
                const p = contentDiv.querySelector(`.novel-paragraph[data-index="${segmentId}"]`);

                if (!p) {
                    console.warn(`未找到段落 segmentId=${segmentId}`);
                    return;
                }

                // 创建评论标记
                const marker = document.createElement('span');
                marker.className = 'review';
                marker.setAttribute('data-index', segment.segmentId);
                marker.innerHTML = `<span class="review-icon"></span><span class="review-count">${segment.reviewNum}</span>`;
                marker.style.cssText = `
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                `;

                marker.addEventListener('mouseenter', () => {
                    marker.style.opacity = '0.7';
                });

                marker.addEventListener('mouseleave', () => {
                    marker.style.opacity = '1';
                });

                marker.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await this.toggleParagraphReviews(segment.segmentId, p);
                });

                // 添加到段落末尾
                p.appendChild(marker);

                // 给段落添加点击事件和样式
                p.style.cursor = 'pointer';
                p.style.transition = 'background 0.2s';
                p.setAttribute('data-has-reviews', 'true');

                // 点击段落显示/隐藏评论
                p.addEventListener('click', async (e) => {
                    // 如果点击的是标记，不处理（标记有自己的事件）
                    if (e.target.closest('.review')) {
                        return;
                    }
                    await this.toggleParagraphReviews(segment.segmentId, p);
                });
            });

            console.log('成功添加评论标记:', this.segments.length);
        }

        // 开始校准
        startCalibration() {
            const paragraphs = document.querySelectorAll('.novel-paragraph');

            if (paragraphs.length === 0) {
                console.warn('未找到段落，请先加载本章说');
                return;
            }

            // 检查是否已经在校准模式
            if (document.querySelector('.paragraph-label')) {
                // 已经在校准模式，关闭它
                this.exitCalibration();
                return;
            }

            // 为每个段落添加序号标记（显示当前的data-index）
            paragraphs.forEach((p) => {
                const currentIndex = p.getAttribute('data-index');

                // 添加新的序号标记
                const label = document.createElement('span');
                label.className = 'paragraph-label';
                label.textContent = `[${currentIndex}]`;
                label.style.cssText = `
                    display: inline-block;
                    margin-right: 5px;
                    padding: 2px 6px;
                    background: #1890ff;
                    color: white;
                    border-radius: 3px;
                    font-size: 11px;
                    cursor: pointer;
                    user-select: none;
                `;

                label.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.calibrateToSegmentId(p, currentIndex);
                });

                p.insertBefore(label, p.firstChild);
            });

            // 修改校准按钮文字
            if (this.calibrateBtn) {
                this.calibrateBtn.innerHTML = '退出<br>校准';
                this.calibrateBtn.style.background = '#ff4d4f';
            }

            console.log('📍 校准模式已开启！');
            console.log('💡 操作说明：');
            console.log('   1. 找到起点本章说的第1段对应的段落');
            console.log('   2. 点击该段落前的蓝色序号[X]');
            console.log('   3. 系统会自动调整所有段落的索引');
            console.log('   4. 再次点击"退出校准"按钮关闭校准模式');
        }

        // 退出校准模式
        exitCalibration() {
            // 移除所有序号标记
            document.querySelectorAll('.paragraph-label').forEach(label => label.remove());

            // 恢复校准按钮
            if (this.calibrateBtn) {
                this.calibrateBtn.innerHTML = '校准<br>段落';
                this.calibrateBtn.style.background = '#52c41a';
            }

            console.log('✅ 已退出校准模式');
        }

        // 校准：将点击的段落设置为起点的第1段
        calibrateToSegmentId(clickedParagraph, currentIndex) {
            // 计算偏移量：当前索引 - 1 = 偏移量
            const offset = parseInt(currentIndex) - 1;
            console.log(`校准：将段落[${currentIndex}]设置为起点第1段，偏移量=${offset}`);

            // 移除所有序号标记
            document.querySelectorAll('.paragraph-label').forEach(label => label.remove());

            // 移除所有评论标记
            document.querySelectorAll('.review').forEach(marker => marker.remove());

            // 更新所有段落的data-index（标题除外）
            const paragraphs = document.querySelectorAll('.novel-paragraph');
            paragraphs.forEach(p => {
                const oldIndex = parseInt(p.getAttribute('data-index'));

                // 标题保持-1不变
                if (oldIndex === -1) {
                    return;
                }

                // 其他段落减去偏移量
                const newIndex = oldIndex - offset;
                p.setAttribute('data-index', newIndex);
            });

            // 重新添加评论标记
            this.segments.forEach(segment => {
                const segmentId = segment.segmentId;
                const p = document.querySelector(`.novel-paragraph[data-index="${segmentId}"]`);

                if (!p) {
                    return;
                }

                // 创建评论标记
                const marker = document.createElement('span');
                marker.className = 'review';
                marker.setAttribute('data-index', segment.segmentId);
                marker.innerHTML = `<span class="review-icon"></span><span class="review-count">${segment.reviewNum}</span>`;
                marker.style.cssText = `
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                `;

                marker.addEventListener('mouseenter', () => {
                    marker.style.opacity = '0.7';
                });

                marker.addEventListener('mouseleave', () => {
                    marker.style.opacity = '1';
                });

                marker.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await this.toggleParagraphReviews(segment.segmentId, p);
                });

                p.appendChild(marker);
            });

            console.log(`校准完成！偏移量=${offset}，已重新添加评论标记`);
        }

        // 将内容转换为标准的p标签结构（专门针对69shuba）
        convertToParagraphs(container) {
            // 检查是否已经转换过
            if (container.querySelector('.novel-paragraph')) {
                console.log('段落已转换，跳过');
                return;
            }

            console.log('=== 开始转换段落结构 ===');

            // 1. 提取并保存h1和txtinfo
            const h1 = container.querySelector('h1');
            const txtinfo = container.querySelector('.txtinfo');
            const titleText = h1 ? h1.textContent.trim() : '';

            console.log('标题:', titleText);

            // 2. 移除广告和不需要的元素
            const txtright = container.querySelector('#txtright');
            const bottomAd = container.querySelector('.bottom-ad');
            if (txtright) txtright.remove();
            if (bottomAd) bottomAd.remove();

            // 3. 获取正文HTML（移除h1和txtinfo后的内容）
            const h1Clone = h1 ? h1.cloneNode(true) : null;
            const txtinfoClone = txtinfo ? txtinfo.cloneNode(true) : null;

            if (h1) h1.remove();
            if (txtinfo) txtinfo.remove();

            // 现在container里只剩正文了
            let contentHTML = container.innerHTML;
            console.log('正文HTML长度:', contentHTML.length);
            console.log('正文前200字符:', contentHTML.substring(0, 200));

            // 4. 按单个<br>分割所有行
            const lines = contentHTML.split(/<br\s*\/?>/i);
            console.log('分割后行数:', lines.length);

            // 5. 清理每一行，每个非空行就是一个段落
            const paragraphs = [];

            for (let line of lines) {
                // 移除script标签
                line = line.replace(/<script[^>]*>.*?<\/script>/gi, '');
                // 移除其他HTML标签
                line = line.replace(/<[^>]+>/g, '');
                // 清理首尾空白
                line = line.trim();

                // 只跳过完全空的行
                if (!line) {
                    continue;
                }

                // 每个非空行都是一个段落
                paragraphs.push(line);
            }

            const filteredParagraphs = paragraphs;

            console.log('清理后段落数:', filteredParagraphs.length);
            if (filteredParagraphs.length > 0) {
                console.log('第一段:', filteredParagraphs[0].substring(0, 50));
            }

            // 6. 过滤重复标题（可能在段落的第一行）
            if (filteredParagraphs.length > 0 && titleText) {
                const firstPara = filteredParagraphs[0];

                // 情况1：整个段落就是标题
                if (firstPara === titleText) {
                    console.log('🔍 过滤重复标题（整段）:', firstPara);
                    filteredParagraphs.shift();
                }
                // 情况2：段落的第一行是标题
                else if (firstPara.startsWith(titleText + '\n')) {
                    console.log('🔍 过滤段落中的重复标题:', titleText);
                    // 移除标题行，保留后面的内容
                    const withoutTitle = firstPara.substring(titleText.length + 1).trim();
                    if (withoutTitle) {
                        filteredParagraphs[0] = withoutTitle;
                    } else {
                        filteredParagraphs.shift();
                    }
                }
                // 情况3：标题包含在段落开头（可能有空格）
                else if (firstPara.includes(titleText)) {
                    const lines = firstPara.split('\n');
                    if (lines[0].trim() === titleText) {
                        console.log('🔍 过滤段落首行的重复标题:', titleText);
                        lines.shift(); // 移除第一行
                        if (lines.length > 0) {
                            filteredParagraphs[0] = lines.join('\n').trim();
                        } else {
                            filteredParagraphs.shift();
                        }
                    }
                }
            }

            console.log('过滤后段落数:', filteredParagraphs.length);
            if (filteredParagraphs.length > 0) {
                console.log('最终第一段:', filteredParagraphs[0].substring(0, 50));
            }

            // 7. 重新构建HTML
            let newHTML = '';

            // 添加h1（segmentId = -1，标题）
            if (h1Clone) {
                h1Clone.classList.add('novel-paragraph');
                h1Clone.setAttribute('data-index', '-1');
                newHTML += h1Clone.outerHTML;
            }

            // 添加txtinfo（不算段落）
            if (txtinfoClone) {
                newHTML += txtinfoClone.outerHTML;
            }

            // 添加正文段落（segmentId从1开始）
            filteredParagraphs.forEach((para, index) => {
                const paraIndex = index + 1; // 从1开始
                newHTML += `<p class="novel-paragraph" data-index="${paraIndex}" style="margin: 10px 0; line-height: 1.8; text-indent: 2em;"><span class="content-text">${para}</span></p>`;
            });

            // 8. 替换容器内容
            container.innerHTML = newHTML;

            console.log('=== 转换完成 ===');
            console.log('总段落数:', h1Clone ? filteredParagraphs.length + 1 : filteredParagraphs.length);
        }

        // 切换段落评论显示（侧边栏方式）
        async toggleParagraphReviews(segmentId, paragraph) {
            // 如果当前段落已经打开，则关闭侧边栏
            if (paragraph.hasAttribute('data-reviews-open') && this.isVisible) {
                this.panel.style.right = '-400px';
                this.isVisible = false;
                // 清除所有段落的打开状态和高亮
                document.querySelectorAll('.novel-paragraph').forEach(p => {
                    p.removeAttribute('data-reviews-open');
                    p.classList.remove('highlight');
                });
                return;
            }

            // 清除所有段落的打开状态
            document.querySelectorAll('.novel-paragraph').forEach(p => {
                p.removeAttribute('data-reviews-open');
                p.classList.remove('highlight');
            });

            // 标记当前段落为打开状态
            paragraph.setAttribute('data-reviews-open', 'true');
            paragraph.classList.add('highlight');

            // 显示侧边栏
            this.showReviewPanel();

            // 加载评论
            const contentDiv = document.getElementById('review-content');
            contentDiv.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">加载中...</p>';

            const reviews = await this.manager.fetchSegmentReviews(this.bookId, this.chapterId, segmentId);

            // 渲染评论
            this.renderParagraphReviews(reviews, segmentId, paragraph);
        }

        // 显示评论侧边栏
        showReviewPanel() {
            if (!this.panel) {
                this.createPanel();
            }
            this.panel.style.right = '0';
            this.isVisible = true;
        }

        // 渲染段落评论
        renderParagraphReviews(reviews, segmentId, paragraph) {
            const contentDiv = document.getElementById('review-content');

            let html = `
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0; color: #e65540; font-size: 16px;">段落 #${segmentId} 的评论</h3>
                            <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">共 ${reviews.length} 条评论</p>
                        </div>
                        <button id="close-review-btn" style="padding: 5px 10px; background: #f0f0f0; color: #666; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            关闭
                        </button>
                    </div>
                </div>
            `;

            if (!reviews || reviews.length === 0) {
                html += '<p style="color: #999; text-align: center; padding: 40px 20px;">本段暂无评论</p>';
            } else {
                reviews.forEach(review => {
                    console.log('评论数据:', review); // 调试用

                    // 时间字段直接使用 updateTime
                    const timeStr = review.updateTime || review.createTime || '';

                    // 尝试多种用户名字段
                    const userName = review.userInfo?.nickName || review.nickName || review.userName || review.userInfo?.userName || '匿名用户';
                    const avatar = review.userInfo?.avatar || review.avatar || '';

                    const reviewId = review.reviewId || review.id;
                    const replyCount = review.rootReviewReplyCount || 0;

                    html += `
                        <div style="margin-bottom: 15px; border-radius: 6px; transition: all 0.2s;">
                            <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                                ${avatar ? `<img src="${avatar}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 10px;">` : ''}
                                <div style="display:flex; flex: 1; gap: 10px; flex-direction: column;">
                                    <span style="color: rgba(0, 0, 0, .48); font-size: 16px;">${userName}</span>
                                    <div style="color: #666; line-height: 1.8; font-size: 14px; white-space: pre-line;">${Utils.parseEmoji(review.content || review.reviewContent || '')}</div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="color: rgba(0, 0, 0, .36);; font-size: 12px;">${timeStr}</span>
                                        <span style="cursor: pointer; transition: color 0.2s;" onmouseenter="this.style.color='#e65540'" onmouseleave="this.style.color='#999'">
                                            👍 ${review.likeCount || review.likeNum || ''}
                                        </span>
                                    </div>
                                    <div class="replies-btn-container" data-review-id="${reviewId}" style="display: flex; gap: 20px; color: #999; font-size: 12px;">
                                        ${replyCount > 0 ? `
                                        <span class="expand-replies-btn" data-review-id="${reviewId}" data-reply-count="${replyCount}"
                                              style="cursor: pointer; font-size:14px; color: rgba(0, 0, 0, .48);">
                                            展开${replyCount}条回复 ▼
                                        </span>
                                        ` : ''}
                                    </div>
                                    <div class="replies-container" data-review-id="${reviewId}" style="display: none;"></div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }

            contentDiv.innerHTML = html;

            // 绑定关闭按钮
            setTimeout(() => {
                const closeBtn = document.getElementById('close-review-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        this.panel.style.right = '-400px';
                        this.isVisible = false;
                        // 取消段落高亮
                        document.querySelectorAll('.novel-paragraph').forEach(p => {
                            p.removeAttribute('data-reviews-open');
                            p.classList.remove('highlight');
                        });
                    });
                }

                // 绑定展开回复按钮
                const expandBtns = document.querySelectorAll('.expand-replies-btn');
                expandBtns.forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const reviewId = btn.getAttribute('data-review-id');
                        const container = document.querySelector(`.replies-container[data-review-id="${reviewId}"]`);
                        const btnContainer = document.querySelector(`.replies-btn-container[data-review-id="${reviewId}"]`);

                        // 展开并加载回复
                        btn.innerHTML = '加载中...';
                        const replies = await this.fetchReplies(reviewId);
                        this.renderReplies(container, replies);
                        container.style.display = 'block';
                        // 隐藏整个按钮容器
                        if (btnContainer) {
                            btnContainer.style.display = 'none';
                        }
                    });
                });
            }, 0);
        }

        // 获取子评论
        async fetchReplies(reviewId) {
            try {
                const url = `${CONFIG.API_BASE}/webcommon/chapterreview/quotereviewlist?reviewId=${reviewId}&page=1&pageSize=100`;
                console.log('请求子评论URL:', url);

                const response = await Utils.request(url);
                console.log('子评论响应:', response);

                if (response && response.code === 0 && response.data) {
                    return response.data.list || [];
                }
                return [];
            } catch (error) {
                console.error('获取子评论失败:', error);
                return [];
            }
        }

        // 渲染子评论
        renderReplies(container, replies) {
            if (!replies || replies.length === 0) {
                container.innerHTML = '<p style="color: #999; font-size: 12px; margin: 10px 0;">暂无回复</p>';
                return;
            }

            let html = '';
            replies.forEach(reply => {
                console.log('子评论数据:', reply); // 调试用

                // 时间字段直接使用 updateTime
                const timeStr = reply.updateTime || reply.createTime || '';

                // 尝试多种用户名字段
                const userName = reply.userInfo?.nickName || reply.nickName || reply.userName || reply.userInfo?.userName || '匿名用户';
                const avatar = reply.userInfo?.avatar || reply.avatar || '';

                html += `
                    <div style="margin-bottom: 15px; border-radius: 6px;">
                        <div style="display: flex; align-items: flex-start;">
                            ${avatar ? `<img src="${avatar}" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">` : ''}
                             <div style="display:flex; flex: 1; gap: 10px; flex-direction: column;">
                                <span style="color: rgba(0, 0, 0, .48); font-size: 16px;">${userName}</span>
                                <div style="color: #666; line-height: 1.8; font-size: 14px; white-space: pre-line;">${Utils.parseEmoji(reply.content || reply.reviewContent || '')}</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: rgba(0, 0, 0, .36);; font-size: 12px;">${timeStr}</span>
                                    <span style="cursor: pointer; transition: color 0.2s;" onmouseenter="this.style.color='#e65540'" onmouseleave="this.style.color='#999'">
                                        👍 ${reply.likeCount || reply.likeNum || ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // 在标记位置展开评论
        async toggleSegmentReviewsInline(segmentId, marker) {
            // 查找是否已经有评论容器
            const existingContainer = marker.parentNode.querySelector('.qidian-reviews-container');

            if (existingContainer) {
                existingContainer.remove();
                return;
            }

            // 创建评论容器
            const container = document.createElement('div');
            container.className = 'qidian-reviews-container';
            container.style.cssText = `
                display: block;
                margin: 15px 0;
                padding: 15px;
                background: #f9f9f9;
                border-left: 3px solid #e65540;
                border-radius: 4px;
            `;
            container.innerHTML = '<p style="color: #999; margin: 0;">加载中...</p>';

            // 插入到下一个<br><br>之前
            const nextBr = marker.nextElementSibling;
            if (nextBr && nextBr.tagName === 'BR') {
                marker.parentNode.insertBefore(container, nextBr);
            } else {
                marker.parentNode.appendChild(container);
            }

            // 加载评论
            const reviews = await this.manager.fetchSegmentReviews(this.bookId, this.chapterId, segmentId);

            if (!reviews || reviews.length === 0) {
                container.innerHTML = '<p style="color: #999; margin: 0;">暂无评论</p>';
                return;
            }

            // 渲染评论
            let html = `<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0; color: #e65540; font-weight: bold;">本段评论 (${reviews.length})</div>`;

            reviews.forEach(review => {
                const timeStr = review.createTime ? new Date(review.createTime * 1000).toLocaleString('zh-CN') : '';

                html += `
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <strong style="color: #333; font-size: 13px;">${review.userInfo?.nickName || review.userName || '匿名用户'}</strong>
                            <span style="margin-left: 10px; color: #999; font-size: 11px;">${timeStr}</span>
                        </div>
                        <div style="color: #666; line-height: 1.6; font-size: 13px; white-space: pre-wrap;">
                            ${review.content || review.reviewContent || ''}
                        </div>
                        <div style="margin-top: 8px; color: #999; font-size: 11px;">
                            <span>👍 ${review.likeCount || review.likeNum || 0}</span>
                            <span style="margin-left: 15px;">💬 ${review.replyCount || review.replyNum || 0}</span>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // 旧方法保留但不使用
        async toggleSegmentReviews(segmentId, paragraph) {
            const existingReviews = paragraph.nextElementSibling;

            if (existingReviews && existingReviews.classList.contains('qidian-reviews-container')) {
                existingReviews.remove();
                return;
            }

            const container = document.createElement('div');
            container.className = 'qidian-reviews-container';
            container.style.cssText = `
                margin: 15px 0;
                padding: 15px;
                background: #f9f9f9;
                border-left: 3px solid #e65540;
                border-radius: 4px;
            `;
            container.innerHTML = '<p style="color: #999;">加载中...</p>';

            paragraph.parentNode.insertBefore(container, paragraph.nextSibling);

            const reviews = await this.manager.fetchSegmentReviews(this.bookId, this.chapterId, segmentId);

            if (!reviews || reviews.length === 0) {
                container.innerHTML = '<p style="color: #999; margin: 0;">暂无评论</p>';
                return;
            }

            let html = `<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0; color: #e65540; font-weight: bold;">本段评论 (${reviews.length})</div>`;

            reviews.forEach(review => {
                const timeStr = review.createTime ? new Date(review.createTime * 1000).toLocaleString('zh-CN') : '';

                html += `
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <strong style="color: #333; font-size: 13px;">${review.userInfo?.nickName || review.userName || '匿名用户'}</strong>
                            <span style="margin-left: 10px; color: #999; font-size: 11px;">${timeStr}</span>
                        </div>
                        <div style="color: #666; line-height: 1.6; font-size: 13px; white-space: pre-wrap;">
                            ${review.content || review.reviewContent || ''}
                        </div>
                        <div style="margin-top: 8px; color: #999; font-size: 11px;">
                            <span>👍 ${review.likeCount || review.likeNum || 0}</span>
                            <span style="margin-left: 15px;">💬 ${review.replyCount || review.replyNum || 0}</span>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // 旧方法，不再使用
        oldInjectMethod() {
            const paragraphs = document.querySelectorAll('p');

            if (paragraphs.length === 0) {
                return;
            }

            console.log('找到段落数量:', paragraphs.length);

            this.segments.forEach((segment, index) => {
                const paragraphIndex = segment.segmentId;

                if (paragraphIndex >= 0 && paragraphIndex < paragraphs.length) {
                    const p = paragraphs[paragraphIndex];

                    // 创建评论标记
                    const marker = document.createElement('span');
                    marker.className = 'review';
                    marker.setAttribute('data-segment-id', segment.segmentId);
                    marker.innerHTML = `💬 ${segment.reviewNum}`;
                    marker.style.cssText = `
                        display: inline-block;
                        margin-left: 10px;
                        padding: 2px 8px;
                        background: #e65540;
                        color: white;
                        border-radius: 10px;
                        font-size: 12px;
                        cursor: pointer;
                        vertical-align: middle;
                        transition: all 0.2s;
                    `;

                    marker.addEventListener('mouseenter', () => {
                        marker.style.background = '#d14836';
                        marker.style.transform = 'scale(1.1)';
                    });

                    marker.addEventListener('mouseleave', () => {
                        marker.style.background = '#e65540';
                        marker.style.transform = 'scale(1)';
                    });

                    marker.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        await this.toggleSegmentReviews(segment.segmentId, p);
                    });

                    // 添加到段落末尾
                    p.appendChild(marker);
                }
            });
        }

        // 切换段落评论显示
        async toggleSegmentReviews(segmentId, paragraph) {
            const existingReviews = paragraph.nextElementSibling;

            // 如果已经展开，则收起
            if (existingReviews && existingReviews.classList.contains('qidian-reviews-container')) {
                existingReviews.remove();
                return;
            }

            // 创建评论容器
            const container = document.createElement('div');
            container.className = 'qidian-reviews-container';
            container.style.cssText = `
                margin: 15px 0;
                padding: 15px;
                background: #f9f9f9;
                border-left: 3px solid #e65540;
                border-radius: 4px;
            `;
            container.innerHTML = '<p style="color: #999;">加载中...</p>';

            // 插入到段落后面
            paragraph.parentNode.insertBefore(container, paragraph.nextSibling);

            // 加载评论
            const reviews = await this.manager.fetchSegmentReviews(this.bookId, this.chapterId, segmentId);

            if (!reviews || reviews.length === 0) {
                container.innerHTML = '<p style="color: #999; margin: 0;">暂无评论</p>';
                return;
            }

            // 渲染评论
            let html = `<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0; color: #e65540; font-weight: bold;">本段评论 (${reviews.length})</div>`;

            reviews.forEach(review => {
                const timeStr = review.createTime ? new Date(review.createTime * 1000).toLocaleString('zh-CN') : '';

                html += `
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <strong style="color: #333; font-size: 13px;">${review.userInfo?.nickName || review.userName || '匿名用户'}</strong>
                            <span style="margin-left: 10px; color: #999; font-size: 11px;">${timeStr}</span>
                        </div>
                        <div style="color: #666; line-height: 1.6; font-size: 13px; white-space: pre-wrap;">
                            ${review.content || review.reviewContent || ''}
                        </div>
                        <div style="margin-top: 8px; color: #999; font-size: 11px;">
                            <span>👍 ${review.likeCount || review.likeNum || 0}</span>
                            <span style="margin-left: 15px;">💬 ${review.replyCount || review.replyNum || 0}</span>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // 获取起点书籍的所有章节列表
        async fetchBookChapters(bookId) {
            try {
                const url = `${CONFIG.API_BASE}/ajax/book/category?bookId=${bookId}`;
                console.log('请求章节列表URL:', url);

                const response = await Utils.request(url);
                console.log('章节列表响应:', response);

                if (response && response.code === 0 && response.data) {
                    const chapters = [];
                    const vs = response.data.vs || [];

                    // 遍历所有卷
                    vs.forEach(volume => {
                        const cs = volume.cs || [];
                        cs.forEach(chapter => {
                            chapters.push({
                                id: chapter.id,
                                name: chapter.cN,
                                uuid: chapter.uuid,
                                updateTime: chapter.uT
                            });
                        });
                    });

                    console.log(`✅ 获取到 ${chapters.length} 个章节`);
                    return chapters;
                }
                return [];
            } catch (error) {
                console.error('获取章节列表失败:', error);
                return [];
            }
        }

        // 从当前页面提取章节标题
        extractCurrentChapterTitle() {
            // 尝试多种选择器
            const selectors = [
                'h1',
                '.chapter-title',
                '.title',
                'h2',
                '.hide720'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return element.textContent.trim();
                }
            }

            return null;
        }

        // 匹配章节：根据标题或章节号
        matchChapter(chapters, currentTitle) {
            if (!currentTitle) return null;

            console.log('当前章节标题:', currentTitle);

            // 方式1：精确匹配标题
            let matched = chapters.find(ch => ch.name === currentTitle);
            if (matched) {
                console.log('✅ 精确匹配成功:', matched);
                return matched;
            }

            // 方式2：提取章节号匹配
            const chapterNumMatch = currentTitle.match(/第(\d+)章/);
            if (chapterNumMatch) {
                const chapterNum = parseInt(chapterNumMatch[1]);
                matched = chapters.find(ch => {
                    const match = ch.name.match(/第(\d+)章/);
                    return match && parseInt(match[1]) === chapterNum;
                });
                if (matched) {
                    console.log('✅ 章节号匹配成功:', matched);
                    return matched;
                }
            }

            // 方式3：模糊匹配（去除标点符号后比较）
            const cleanTitle = currentTitle.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
            matched = chapters.find(ch => {
                const cleanChName = ch.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
                return cleanChName.includes(cleanTitle) || cleanTitle.includes(cleanChName);
            });
            if (matched) {
                console.log('✅ 模糊匹配成功:', matched);
                return matched;
            }

            console.warn('❌ 未找到匹配的章节');
            return null;
        }

        // 从URL中提取书籍标识（用于区分不同书籍）
        extractBookKey(url) {
            try {
                const urlObj = new URL(url);
                // 使用域名 + 路径的前两段作为书籍标识
                const pathParts = urlObj.pathname.split('/').filter(p => p);
                const bookPath = pathParts.slice(0, 2).join('/');
                return `${urlObj.hostname}_${bookPath}`;
            } catch (e) {
                console.error('提取书籍标识失败:', e);
                return url.split('/').slice(0, 4).join('/');
            }
        }

        // 显示输入表单
        showInputForm() {
            const contentDiv = document.getElementById('review-content');

            contentDiv.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <p style="color: #666; margin-bottom: 15px; font-weight: bold;">粘贴起点章节URL</p>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #333; font-size: 14px;">起点章节URL：</label>
                        <input type="text" id="qidian-url-input" placeholder="粘贴完整URL，例如：https://www.qidian.com/chapter/1039058592/794929136/"
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        <p style="color: #999; font-size: 12px; margin-top: 5px;">
                            支持PC端、移动端、VIP阅读器等各种起点URL格式
                        </p>
                        <button id="parse-url-btn"
                            style="width: 100%; padding: 8px; margin-top: 10px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            加载本章说
                        </button>
                    </div>
                </div>
            `;

            // 绑定按钮事件
            setTimeout(() => {
                const parseUrlBtn = document.getElementById('parse-url-btn');
                const urlInput = document.getElementById('qidian-url-input');

                // URL解析并加载按钮
                if (parseUrlBtn && urlInput) {
                    parseUrlBtn.addEventListener('click', () => {
                        const url = urlInput.value.trim();
                        if (!url) {
                            console.warn('请输入起点章节URL');
                            return;
                        }

                        const result = Utils.parseQidianUrl(url);
                        if (result) {
                            parseUrlBtn.textContent = '正在获取章节列表...';
                            parseUrlBtn.disabled = true;

                            // 获取书籍的所有章节列表
                            this.fetchBookChapters(result.bookId).then(chapters => {
                                if (chapters.length > 0) {
                                    // 保存书籍ID和章节列表
                                    const bookKey = this.extractBookKey(window.location.href);
                                    const bookData = {
                                        bookId: result.bookId,
                                        chapters: chapters,
                                        timestamp: Date.now()
                                    };
                                    localStorage.setItem(`qidian_book_${bookKey}`, JSON.stringify(bookData));
                                    console.log(`✅ 已保存书籍数据: ${chapters.length} 个章节`);

                                    // 保存当前章节的精确映射
                                    const currentPageUrl = window.location.href;
                                    const mapping = {
                                        bookId: result.bookId,
                                        chapterId: result.chapterId,
                                        qidianUrl: url,
                                        timestamp: Date.now()
                                    };
                                    localStorage.setItem(`qidian_mapping_${currentPageUrl}`, JSON.stringify(mapping));

                                    // 加载本章说
                                    this.loadReviews(result.bookId, result.chapterId);
                                } else {
                                    console.error('获取章节列表失败');
                                    parseUrlBtn.textContent = '加载本章说';
                                    parseUrlBtn.disabled = false;
                                }
                            }).catch(error => {
                                console.error('获取章节列表出错:', error);
                                parseUrlBtn.textContent = '加载本章说';
                                parseUrlBtn.disabled = false;
                            });
                        } else {
                            console.error('无法解析URL，请检查URL格式');
                        }
                    });

                    // URL输入框回车键
                    urlInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            parseUrlBtn.click();
                        }
                    });
                }
            }, 0);
        }

        // 渲染段落列表
        renderSegmentList(segments, bookId, chapterId, manager) {
            const contentDiv = document.getElementById('review-content');

            // 添加顶部工具栏
            let html = `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: #999; font-size: 12px;">
                            <div>书籍ID: ${bookId}</div>
                            <div>章节ID: ${chapterId}</div>
                        </div>
                        <button id="change-chapter-btn" style="padding: 5px 15px; background: #f0f0f0; color: #666; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            切换章节
                        </button>
                    </div>
                </div>
            `;

            if (!segments || segments.length === 0) {
                html += '<p style="color: #999;">本章暂无评论</p>';
                contentDiv.innerHTML = html;
                setTimeout(() => {
                    const changeBtn = document.getElementById('change-chapter-btn');
                    if (changeBtn) {
                        changeBtn.addEventListener('click', () => this.showInputForm());
                    }
                }, 0);
                return;
            }

            // 渲染段落列表
            segments.forEach(segment => {
                html += `
                    <div class="segment-item" data-segment-id="${segment.segmentId}" style="margin-bottom: 10px; padding: 12px; background: #f9f9f9; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #333; font-size: 14px;">段落 #${segment.segmentId}</span>
                            <span style="color: #e65540; font-size: 13px; font-weight: bold;">💬 ${segment.reviewNum} 条评论</span>
                        </div>
                        <div id="reviews-${segment.segmentId}" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                            <p style="color: #999; font-size: 12px;">加载中...</p>
                        </div>
                    </div>
                `;
            });

            contentDiv.innerHTML = html;

            // 绑定事件
            setTimeout(() => {
                const changeBtn = document.getElementById('change-chapter-btn');
                if (changeBtn) {
                    changeBtn.addEventListener('click', () => this.showInputForm());
                }

                // 绑定段落点击事件
                const segmentItems = document.querySelectorAll('.segment-item');
                segmentItems.forEach(item => {
                    item.addEventListener('click', async (e) => {
                        const segmentId = item.getAttribute('data-segment-id');
                        const reviewsDiv = document.getElementById(`reviews-${segmentId}`);

                        // 切换显示/隐藏
                        if (reviewsDiv.style.display === 'none') {
                            // 显示并加载评论
                            reviewsDiv.style.display = 'block';
                            item.style.background = '#fff';

                            // 如果还没加载过，则加载评论
                            if (reviewsDiv.innerHTML.includes('加载中')) {
                                const reviews = await manager.fetchSegmentReviews(bookId, chapterId, segmentId);
                                this.renderSegmentReviews(reviewsDiv, reviews);
                            }
                        } else {
                            // 隐藏
                            reviewsDiv.style.display = 'none';
                            item.style.background = '#f9f9f9';
                        }
                    });

                    // 鼠标悬停效果
                    item.addEventListener('mouseenter', () => {
                        if (item.querySelector('[id^="reviews-"]').style.display === 'none') {
                            item.style.background = '#f0f0f0';
                        }
                    });
                    item.addEventListener('mouseleave', () => {
                        if (item.querySelector('[id^="reviews-"]').style.display === 'none') {
                            item.style.background = '#f9f9f9';
                        }
                    });
                });
            }, 0);
        }

        // 渲染段落评论
        renderSegmentReviews(container, reviews) {
            if (!reviews || reviews.length === 0) {
                container.innerHTML = '<p style="color: #999; font-size: 12px;">暂无评论</p>';
                return;
            }

            let html = '';
            reviews.forEach(review => {
                const timeStr = review.createTime ? new Date(review.createTime * 1000).toLocaleString('zh-CN') : '';

                html += `
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <strong style="color: #333; font-size: 13px;">${review.userInfo?.nickName || review.userName || '匿名用户'}</strong>
                            <span style="margin-left: 10px; color: #999; font-size: 11px;">${timeStr}</span>
                        </div>
                        <div style="color: #666; line-height: 1.6; font-size: 13px; white-space: pre-wrap;">
                            ${review.content || review.reviewContent || ''}
                        </div>
                        <div style="margin-top: 8px; color: #999; font-size: 11px;">
                            <span>👍 ${review.likeCount || review.likeNum || 0}</span>
                            <span style="margin-left: 15px;">💬 ${review.replyCount || review.replyNum || 0}</span>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 创建UI
        const uiManager = new UIManager();
        uiManager.createFloatingButton();

        console.log('起点本章说插件已加载');

        // 自动加载函数
        const autoLoad = () => {
            // 检查是否已经加载过（防止重复加载）
            if (document.querySelector('.review')) {
                console.log('本章说已加载，跳过');
                return;
            }

            const currentPageUrl = window.location.href;
            const mappingKey = `qidian_mapping_${currentPageUrl}`;
            const savedMapping = localStorage.getItem(mappingKey);

            if (savedMapping) {
                try {
                    const mapping = JSON.parse(savedMapping);
                    console.log('检测到已保存的映射，自动加载本章说...');
                    uiManager.loadReviews(mapping.bookId, mapping.chapterId);
                } catch (e) {
                    console.error('解析映射失败:', e);
                }
            } else {
                console.log('未找到保存的映射，尝试通过章节列表匹配...');
                uiManager.loadReviews();
            }
        };

        // 等待正文容器出现后立即加载
        const observer = new MutationObserver(() => {
            const contentDiv = document.querySelector('.txtnav') || document.querySelector('#content');
            if (contentDiv) {
                observer.disconnect();
                autoLoad();
            }
        });

        // 如果正文已经存在，直接加载
        const contentDiv = document.querySelector('.txtnav') || document.querySelector('#content');
        if (contentDiv) {
            autoLoad();
        } else {
            // 否则监听DOM变化
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // 监听URL变化（用于单页应用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('检测到URL变化，重新加载本章说...');
                setTimeout(autoLoad, 500);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // 启动脚本
    init();
})();
