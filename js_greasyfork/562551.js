// ==UserScript==
// @name         GitHub Wiki Linker
// @namespace    http://tampermonkey.net/
// @version      2026-01-13
// @description  在 GitHub 仓库页面左下角显示快捷链接，跳转到 DeepWiki 或 Zread.ai 知识库
// @author       You
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562551/GitHub%20Wiki%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/562551/GitHub%20Wiki%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测是否是仓库主页面（只匹配 github.com/owner/repo 或 github.com/owner/repo/）
    function isRepoMainPage() {
        const path = window.location.pathname;

        // 排除 GitHub 特殊页面
        const excludedPaths = [
            '/settings',
            '/notifications',
            '/explore',
            '/trending',
            '/marketplace',
            '/pulls',
            '/issues',
            '/codespaces',
            '/sponsors',
            '/login',
            '/signup',
            '/join',
            '/new',
            '/organizations',
            '/orgs'
        ];

        if (excludedPaths.some(p => path.startsWith(p))) {
            return false;
        }

        // 匹配格式: /owner/repo 或 /owner/repo/
        // 不匹配: /owner/repo/blob/... /owner/repo/tree/... 等带有子路径的页面
        const repoPattern = /^\/([^\/]+)\/([^\/]+)\/?$/;
        const match = path.match(repoPattern);

        if (!match) {
            return false;
        }

        const owner = match[1];
        const repo = match[2];

        // 排除用户页面的特殊路径
        const excludedRepoNames = [
            'followers',
            'following',
            'repositories',
            'projects',
            'packages',
            'stars',
            'sponsoring',
            'achievements'
        ];

        if (excludedRepoNames.includes(repo)) {
            return false;
        }

        return { owner, repo };
    }

    // 创建悬浮框
    function createFloatingBox(owner, repo) {
        // 如果已存在，先移除
        const existingBox = document.getElementById('wiki-linker-box');
        if (existingBox) {
            existingBox.remove();
        }

        const box = document.createElement('div');
        box.id = 'wiki-linker-box';
        box.innerHTML = `
            <style>
                #wiki-linker-box {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: #ffffff;
                    border: 1px solid #d0d7de;
                    border-radius: 8px;
                    padding: 12px;
                    box-shadow: 0 3px 12px rgba(140, 149, 159, 0.15);
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                    font-size: 12px;
                    min-width: 160px;
                }
                #wiki-linker-box .title {
                    font-weight: 600;
                    color: #24292f;
                    margin-bottom: 8px;
                    font-size: 12px;
                }
                #wiki-linker-box .link-btn {
                    display: block;
                    padding: 6px 10px;
                    margin: 4px 0;
                    background: #f6f8fa;
                    border: 1px solid #d0d7de;
                    border-radius: 6px;
                    color: #0969da;
                    text-decoration: none;
                    font-size: 12px;
                    transition: background 0.2s;
                }
                #wiki-linker-box .link-btn:hover {
                    background: #0969da;
                    color: #ffffff;
                    border-color: #0969da;
                }
                #wiki-linker-box .close-btn {
                    position: absolute;
                    top: 6px;
                    right: 8px;
                    cursor: pointer;
                    color: #57606a;
                    font-size: 14px;
                    line-height: 1;
                }
                #wiki-linker-box .close-btn:hover {
                    color: #24292f;
                }
                @media (prefers-color-scheme: dark) {
                    #wiki-linker-box {
                        background: #161b22;
                        border-color: #30363d;
                    }
                    #wiki-linker-box .title {
                        color: #c9d1d9;
                    }
                    #wiki-linker-box .link-btn {
                        background: #21262d;
                        border-color: #30363d;
                        color: #58a6ff;
                    }
                    #wiki-linker-box .link-btn:hover {
                        background: #58a6ff;
                        color: #ffffff;
                    }
                    #wiki-linker-box .close-btn {
                        color: #8b949e;
                    }
                }
            </style>
            <span class="close-btn" title="关闭">✕</span>
            <div class="title">📚 知识库快捷入口</div>
            <a class="link-btn" href="https://deepwiki.com/${owner}/${repo}" target="_blank">
                🔗 DeepWiki
            </a>
            <a class="link-btn" href="https://zread.ai/${owner}/${repo}" target="_blank">
                🔗 Zread.ai
            </a>
        `;

        document.body.appendChild(box);

        // 关闭按钮事件
        box.querySelector('.close-btn').addEventListener('click', () => {
            box.remove();
        });
    }

    // 主函数
    function init() {
        const repoInfo = isRepoMainPage();
        if (repoInfo) {
            createFloatingBox(repoInfo.owner, repoInfo.repo);
        } else {
            // 如果不是仓库主页，移除悬浮框
            const existingBox = document.getElementById('wiki-linker-box');
            if (existingBox) {
                existingBox.remove();
            }
        }
    }

    // 页面加载完成后执行
    init();

    // 监听 URL 变化（GitHub 使用 SPA，需要监听路由变化）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 100); // 延迟执行，等待页面渲染
        }
    }).observe(document, { subtree: true, childList: true });
})();
