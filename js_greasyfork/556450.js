// ==UserScript==
// @name         GitHub CodeWiki Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 GitHub 仓库页面添加 CodeWiki 按钮. 点击跳转到 https://codewiki.google/github.com/{user}/{repo}
// @author       You
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556450/GitHub%20CodeWiki%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/556450/GitHub%20CodeWiki%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 日志函数
    const log = (...args) => console.log('[CodeWiki Button]', ...args);

    // 判断是否为仓库页面
    function isRepoPage() {
        try {
            const pathname = window.location.pathname;
            return document.querySelector('main#js-repo-pjax-container') !== null ||
                document.querySelector('div[data-pjax="#repo-content-pjax-container"]') !== null ||
                (pathname.split('/').filter(Boolean).length >= 2 &&
                    !pathname.includes('/settings') &&
                    !pathname.includes('/issues'));
        } catch (e) {
            log('检查仓库页面时出错:', e);
            return false;
        }
    }

    // 获取用户名和仓库名
    function getUserAndRepo() {
        try {
            const pathParts = window.location.pathname.split('/').filter(part => part.length > 0);
            if (pathParts.length >= 2) {
                return {
                    user: pathParts[0],
                    repo: pathParts[1]
                };
            }
        } catch (e) {
            log('获取用户和仓库信息时出错:', e);
        }
        return null;
    }

    // 创建 SVG 图标元素
    function createSVGIconElement() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'octicon');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.setAttribute('style', 'margin-right:4px;vertical-align:text-bottom;');

        // 简单 C 图标
        svg.innerHTML = `
          <circle cx="8" cy="8" r="7" fill="#1976d2"></circle>
          <path d="M10.8 5.2A3.5 3.5 0 0 0 8 4a3.5 3.5 0 1 0 0 7c1.1 0 2.1-.5 2.8-1.2l-0.9-0.9A2.3 2.3 0 0 1 8 9.8 2.3 2.3 0 1 1 8 6.2c0.6 0 1.2 0.2 1.7 0.7l1.1-0.7z" fill="#fff"></path>
        `;
        return svg;
    }

    // 创建 CodeWiki 按钮
    function createCodeWikiButton(user, repo) {
        try {
            // 这里按你提供的实际规则来拼接
            // 例如 https://codewiki.google/github.com/google-gemini/gemini-cli
            const codeWikiUrl = `https://codewiki.google/github.com/${user}/${repo}`;

            const existingButtons = document.querySelectorAll('.btn-sm, [data-hydro-click]');
            let templateButton = null;
            for (const btn of existingButtons) {
                const text = btn.textContent || '';
                if (text.includes('Fork') || text.includes('Star') ||
                    text.includes('Watch') || text.includes('Code')) {
                    templateButton = btn;
                    break;
                }
            }

            const button = document.createElement('a');
            button.href = codeWikiUrl;
            button.id = 'codewiki-button';
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.title = `查看 ${user}/${repo} 的 CodeWiki 页面`;
            button.setAttribute('data-user', user);
            button.setAttribute('data-repo', repo);
            button.setAttribute('aria-label', `打开 CodeWiki 页面: ${user}/${repo}`);

            if (templateButton) {
                const classNames = Array.from(templateButton.classList)
                    .filter(cls =>
                        !cls.includes('selected') &&
                        !cls.includes('disabled') &&
                        !cls.includes('tooltipped') &&
                        !cls.includes('BtnGroup')
                    );
                button.className = classNames.join(' ');
            } else {
                button.className = 'btn btn-sm';
            }

            const svgIcon = createSVGIconElement();
            button.appendChild(svgIcon);

            const text = document.createTextNode('CodeWiki');
            button.appendChild(text);

            if (!templateButton) {
                button.style.backgroundColor = '#f6f8fa';
                button.style.border = '1px solid rgba(27,31,36,0.15)';
                button.style.borderRadius = '6px';
                button.style.color = '#24292f';
                button.style.padding = '3px 12px';
                button.style.fontSize = '12px';
                button.style.fontWeight = '500';
                button.style.lineHeight = '20px';
                button.style.textDecoration = 'none';
            }

            button.addEventListener('click', () => {
                log(`点击 CodeWiki 按钮: ${user}/${repo}`);
            });

            return button;
        } catch (e) {
            log('创建按钮时出错:', e);
            return null;
        }
    }

    // 把按钮插入页面
    function addCodeWikiButton() {
        try {
            if (!isRepoPage()) return;

            const userAndRepo = getUserAndRepo();
            if (!userAndRepo) return;

            if (document.querySelector('#codewiki-button')) return;

            const targetSelectors = [
                '.file-navigation',
                '.d-flex.mb-3.px-3.px-md-4.px-lg-5',
                '#repository-container-header .d-flex'
            ];

            for (const selector of targetSelectors) {
                const targetElements = document.querySelectorAll(selector);
                if (targetElements && targetElements.length > 0) {
                    const targetElement = targetElements[0];
                    const codeWikiButton = createCodeWikiButton(userAndRepo.user, userAndRepo.repo);

                    if (codeWikiButton) {
                        const container = document.createElement('div');
                        container.className = 'codewiki-button-container';
                        container.style.marginLeft = 'auto';
                        container.appendChild(codeWikiButton);

                        if (selector === '.file-navigation') {
                            const actionsContainer = targetElement.querySelector('.d-flex');
                            if (actionsContainer) {
                                actionsContainer.appendChild(container);
                            } else {
                                targetElement.appendChild(container);
                            }
                        } else {
                            targetElement.appendChild(container);
                        }

                        log(`成功添加 CodeWiki 按钮: ${userAndRepo.user}/${userAndRepo.repo}`);
                        return;
                    }
                }
            }

            const actionButtons = document.querySelectorAll('.pagehead-actions li, .flex-1 nav ul');
            if (actionButtons && actionButtons.length > 0) {
                const lastAction = actionButtons[actionButtons.length - 1];
                const codeWikiButton = createCodeWikiButton(userAndRepo.user, userAndRepo.repo);

                if (codeWikiButton) {
                    const wrapper = document.createElement('li');
                    if (lastAction.tagName === 'LI') {
                        wrapper.className = lastAction.className;
                    } else {
                        wrapper.style.marginLeft = '8px';
                    }
                    wrapper.appendChild(codeWikiButton);

                    lastAction.parentNode.appendChild(wrapper);
                    log(`成功添加 CodeWiki 按钮到操作区域: ${userAndRepo.user}/${userAndRepo.repo}`);
                    return;
                }
            }

            const repoNavLinks = document.querySelector('nav[aria-label="Repository"], .pagehead-actions');
            if (repoNavLinks) {
                const codeWikiButton = createCodeWikiButton(userAndRepo.user, userAndRepo.repo);
                if (codeWikiButton) {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'inline-block';
                    wrapper.style.marginLeft = '8px';
                    wrapper.appendChild(codeWikiButton);

                    repoNavLinks.appendChild(wrapper);
                    log(`成功添加 CodeWiki 按钮到仓库导航区: ${userAndRepo.user}/${userAndRepo.repo}`);
                    return;
                }
            }

            log('未找到合适的位置添加 CodeWiki 按钮');
        } catch (e) {
            log('添加按钮时出错:', e);
        }
    }

    // 处理页面动态加载
    function setupMutationObserver() {
        try {
            const observer = new MutationObserver(function (mutations) {
                let shouldCheck = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldCheck = true;
                        break;
                    }
                }
                if (shouldCheck) {
                    setTimeout(addCodeWikiButton, 300);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            log('成功设置 MutationObserver');
        } catch (e) {
            log('设置 MutationObserver 时出错:', e);
        }
    }

    function init() {
        try {
            log('初始化脚本...');

            addCodeWikiButton();
            setTimeout(addCodeWikiButton, 500);
            setTimeout(addCodeWikiButton, 1000);
            setTimeout(addCodeWikiButton, 2000);

            setupMutationObserver();

            window.addEventListener('popstate', () => {
                setTimeout(addCodeWikiButton, 500);
            });

            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(addCodeWikiButton, 500);
                }
            }).observe(document, { subtree: true, childList: true });

            setInterval(addCodeWikiButton, 3000);
        } catch (e) {
            log('初始化时出错:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
