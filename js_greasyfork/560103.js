// ==UserScript==
// @name         Bilibili Weekly Video Links Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Extract all video links from Bilibili weekly popular page
// @author       neo
// @match        https://www.bilibili.com/v/popular/weekly*
// @grant        GM_setClipboard
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560103/Bilibili%20Weekly%20Video%20Links%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/560103/Bilibili%20Weekly%20Video%20Links%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    const CONFIG = {
        BUTTON_ID: 'bilibili-weekly-extract-btn',
        MODAL_ID: 'bilibili-weekly-modal'
    };

    // ============ INITIALIZATION ============
    function init() {
        console.log('[Bilibili Weekly] Initializing...');

        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Create floating button
        setTimeout(() => {
            createFloatingButton();
        }, 1000);
    }

    // ============ VIDEO LINK EXTRACTION ============
    function extractVideoLinks() {
        const videoCards = document.querySelectorAll('.video-card__content');
        const links = [];

        console.log(`[Bilibili Weekly] Found ${videoCards.length} video cards`);

        videoCards.forEach((card, index) => {
            // Find all <a> tags within the card
            const anchors = card.querySelectorAll('a[href*="/video/"]');

            anchors.forEach(anchor => {
                const href = anchor.getAttribute('href');
                if (href && href.includes('/video/')) {
                    // Normalize URL
                    let fullUrl = href;
                    if (href.startsWith('//')) {
                        fullUrl = 'https:' + href;
                    } else if (href.startsWith('/')) {
                        fullUrl = 'https://www.bilibili.com' + href;
                    }

                    // Remove query parameters and hash
                    fullUrl = fullUrl.split('?')[0].split('#')[0];

                    // Add to links if not already present
                    if (!links.includes(fullUrl)) {
                        links.push(fullUrl);
                    }
                }
            });
        });

        console.log(`[Bilibili Weekly] Extracted ${links.length} unique video links`);
        return links;
    }

    // ============ VIDEO ID EXTRACTION ============
    function extractVideoId(url) {
        // Extract BV id or AV id from URL
        const bvidMatch = url.match(/BV[\w]+/);
        const avidMatch = url.match(/av(\d+)/);

        if (bvidMatch) {
            return { type: 'bvid', id: bvidMatch[0] };
        } else if (avidMatch) {
            return { type: 'aid', id: avidMatch[1] };
        }
        return null;
    }

    async function getAidFromBvid(bvid) {
        try {
            const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
            const data = await response.json();
            if (data.code === 0 && data.data && data.data.aid) {
                return data.data.aid;
            }
        } catch (error) {
            console.error(`[Bilibili Weekly] Failed to get aid from bvid ${bvid}:`, error);
        }
        return null;
    }

    // ============ WATCH LATER API ============
    function getCsrfToken() {
        const match = /bili_jct=([^;]+)/.exec(document.cookie);
        return match ? match[1] : null;
    }

    async function addToWatchLater(aid) {
        const csrf = getCsrfToken();
        if (!csrf) {
            throw new Error('未登录或无法获取 CSRF Token');
        }

        const response = await fetch('https://api.bilibili.com/x/v2/history/toview/add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: `aid=${aid}&csrf=${csrf}`
        });

        const data = await response.json();
        if (data.code === 0) {
            return { success: true, aid };
        } else {
            throw new Error(data.message || '添加失败');
        }
    }

    // ============ UI - FLOATING BUTTON ============
    function createFloatingButton() {
        // Remove existing button if any
        const existing = document.getElementById(CONFIG.BUTTON_ID);
        if (existing) existing.remove();

        const button = document.createElement('button');
        button.id = CONFIG.BUTTON_ID;
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                <path d="M9 12h6m-6 4h6"/>
            </svg>
        `;
        button.title = '提取视频链接';
        button.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 30px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #00a1d6;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 161, 214, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: all 0.3s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 16px rgba(0, 161, 214, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0, 161, 214, 0.4)';
        });

        button.addEventListener('click', showModal);

        document.body.appendChild(button);
        console.log('[Bilibili Weekly] Floating button created');
    }

    // ============ UI - MODAL ============
    function showModal() {
        // Extract video links
        const links = extractVideoLinks();

        if (links.length === 0) {
            alert('未找到视频链接！请确保页面已完全加载。');
            return;
        }

        // Remove existing modal if any
        const existing = document.getElementById(CONFIG.MODAL_ID);
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = CONFIG.MODAL_ID;

        // Format links for display
        const linksText = links.join('\n');
        const linksHtml = links.map((link, index) =>
            `<div style="padding: 8px; border-bottom: 1px solid #e5e5e5; display: flex; align-items: center;">
                <span style="color: #999; margin-right: 12px; min-width: 30px;">${index + 1}.</span>
                <a href="${link}" target="_blank" style="color: #00a1d6; text-decoration: none; flex: 1; word-break: break-all;">${link}</a>
            </div>`
        ).join('');

        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div style="background: white; border-radius: 12px; width: 90%; max-width: 800px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                    <!-- Header -->
                    <div style="padding: 20px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; color: #333; font-size: 20px; font-weight: 600;">
                            📺 视频链接列表
                            <span style="color: #999; font-size: 14px; font-weight: normal; margin-left: 12px;">共 ${links.length} 个视频</span>
                        </h2>
                        <button id="modal-close-btn" style="background: transparent; border: none; font-size: 28px; cursor: pointer; color: #999; line-height: 1; padding: 0; width: 32px; height: 32px;">&times;</button>
                    </div>

                    <!-- Links List -->
                    <div style="flex: 1; overflow-y: auto; padding: 0;">
                        ${linksHtml}
                    </div>

                    <!-- Footer -->
                    <div style="padding: 20px; border-top: 1px solid #e5e5e5; display: flex; gap: 12px; justify-content: space-between; align-items: center;">
                        <div id="status-message" style="color: #666; font-size: 14px; flex: 1;"></div>
                        <div style="display: flex; gap: 12px;">
                            <button id="add-to-watchlater-btn" style="padding: 10px 24px; background: #fb7299; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s;">
                                ⏰ 添加到稍后再看
                            </button>
                            <button id="copy-all-btn" style="padding: 10px 24px; background: #00a1d6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s;">
                                📋 一键复制全部
                            </button>
                            <button id="modal-cancel-btn" style="padding: 10px 24px; background: #e5e5e5; color: #333; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s;">
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('#modal-close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('#modal-cancel-btn').addEventListener('click', () => modal.remove());

        // Add to watch later button
        const watchLaterBtn = modal.querySelector('#add-to-watchlater-btn');
        const statusMessage = modal.querySelector('#status-message');

        watchLaterBtn.addEventListener('click', async () => {
            // Check login status
            const csrf = getCsrfToken();
            if (!csrf) {
                statusMessage.textContent = '❌ 请先登录 Bilibili';
                statusMessage.style.color = '#ff4d4f';
                return;
            }

            // Disable button during processing
            watchLaterBtn.disabled = true;
            watchLaterBtn.style.opacity = '0.6';
            watchLaterBtn.style.cursor = 'not-allowed';

            let successCount = 0;
            let failCount = 0;

            statusMessage.textContent = `正在添加... (0/${links.length})`;
            statusMessage.style.color = '#00a1d6';

            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                const videoId = extractVideoId(link);

                if (!videoId) {
                    console.error(`[Bilibili Weekly] Failed to extract video ID from ${link}`);
                    failCount++;
                    continue;
                }

                try {
                    let aid = null;

                    if (videoId.type === 'aid') {
                        aid = videoId.id;
                    } else if (videoId.type === 'bvid') {
                        aid = await getAidFromBvid(videoId.id);
                    }

                    if (!aid) {
                        console.error(`[Bilibili Weekly] Failed to get aid for ${link}`);
                        failCount++;
                        continue;
                    }

                    await addToWatchLater(aid);
                    successCount++;
                    console.log(`[Bilibili Weekly] Added ${link} to watch later`);

                    // Update status
                    statusMessage.textContent = `正在添加... (${successCount + failCount}/${links.length})`;

                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (error) {
                    console.error(`[Bilibili Weekly] Failed to add ${link}:`, error);
                    failCount++;
                }
            }

            // Show final result
            if (failCount === 0) {
                statusMessage.textContent = `✅ 成功添加 ${successCount} 个视频到稍后再看！`;
                statusMessage.style.color = '#52c41a';
                watchLaterBtn.textContent = '✓ 添加完成';
                watchLaterBtn.style.background = '#52c41a';
            } else {
                statusMessage.textContent = `⚠️ 成功 ${successCount} 个，失败 ${failCount} 个`;
                statusMessage.style.color = '#faad14';
                watchLaterBtn.textContent = '部分成功';
                watchLaterBtn.style.background = '#faad14';
            }

            // Re-enable button after 3 seconds
            setTimeout(() => {
                watchLaterBtn.disabled = false;
                watchLaterBtn.style.opacity = '1';
                watchLaterBtn.style.cursor = 'pointer';
                watchLaterBtn.textContent = '⏰ 添加到稍后再看';
                watchLaterBtn.style.background = '#fb7299';
            }, 3000);
        });

        watchLaterBtn.addEventListener('mouseenter', () => {
            if (!watchLaterBtn.disabled) {
                watchLaterBtn.style.background = '#f25d8e';
            }
        });

        watchLaterBtn.addEventListener('mouseleave', () => {
            if (!watchLaterBtn.disabled && !watchLaterBtn.textContent.includes('完成') && !watchLaterBtn.textContent.includes('成功')) {
                watchLaterBtn.style.background = '#fb7299';
            }
        });

        const copyBtn = modal.querySelector('#copy-all-btn');
        copyBtn.addEventListener('click', () => {
            // Copy to clipboard
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(linksText);
            } else {
                // Fallback to native clipboard API
                navigator.clipboard.writeText(linksText).then(() => {
                    console.log('[Bilibili Weekly] Links copied to clipboard');
                }).catch(err => {
                    console.error('[Bilibili Weekly] Failed to copy:', err);
                    // Fallback to textarea method
                    const textarea = document.createElement('textarea');
                    textarea.value = linksText;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                });
            }

            // Visual feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ 已复制！';
            copyBtn.style.background = '#52c41a';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#00a1d6';
            }, 2000);
        });

        copyBtn.addEventListener('mouseenter', () => {
            if (!copyBtn.textContent.includes('已复制')) {
                copyBtn.style.background = '#0090c0';
            }
        });

        copyBtn.addEventListener('mouseleave', () => {
            if (!copyBtn.textContent.includes('已复制')) {
                copyBtn.style.background = '#00a1d6';
            }
        });

        // Close on overlay click
        modal.querySelector('div').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) modal.remove();
        });

        console.log('[Bilibili Weekly] Modal displayed');
    }

    // Start
    init();
})();