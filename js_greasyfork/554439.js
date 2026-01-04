// ==UserScript==
// @name         NGA 楼中楼
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  遍历帖子所有界面并自动展开折叠内容，然后重新组织为楼中楼形式
// @author       cloud_rider
// @match        https://bbs.nga.cn/read.php?tid=*
// @match        https://ngabbs.com/read.php?tid=*
// @match        https://nga.178.com/read.php?tid=*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554439/NGA%20%E6%A5%BC%E4%B8%AD%E6%A5%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/554439/NGA%20%E6%A5%BC%E4%B8%AD%E6%A5%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[NGA 楼中楼] 脚本启动');

    const urlParams = new URLSearchParams(window.location.search);
    const isLoaderTab = urlParams.get('loader') === '1';
    const loadedPages = new Set();
    let progressBar = null, progressLine2 = null;
    let isFinished = false;

    // 展开折叠内容（简化版）
    function expandAllCollapses(container) {
        try {
            const buttons = container.querySelectorAll('button[name="collapseSwitchButton"]');
            console.log('[NGA 自动展开] 找到', buttons.length, '个折叠按钮');

            let expanded = 0;
            buttons.forEach(button => {
                try {
                    if (button.textContent === '+') {
                        button.click();
                        button.textContent = '-';
                        expanded++;
                        console.log('[NGA 自动展开] 展开第', expanded, '个折叠');
                    }
                } catch (e) {
                    console.warn('[NGA 自动展开] 按钮点击失败:', e);
                    // 后备方案：直接修改 DOM
                    const collapseDiv = button.parentNode.nextSibling;
                    if (collapseDiv && collapseDiv.classList.contains('collapse') && collapseDiv.style.display === 'none') {
                        collapseDiv.style.display = 'block';
                        button.textContent = '-';
                        expanded++;
                        console.log('[NGA 自动展开] 强制展开第', expanded, '个折叠');
                    }
                }
            });

            console.log('[NGA 自动展开] 完成展开', expanded, '个折叠');
        } catch (e) {
            console.error('[NGA 自动展开] 展开折叠失败:', e);
        }
    }

    // === 楼中楼逻辑 ===
    function createProgressBar() {
        progressBar = document.createElement('div');
        progressBar.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:white;padding:12px 20px;border-radius:12px;font-size:15px;font-weight:bold;text-align:center;z-index:9999;min-width:300px;box-shadow:0 4px 12px rgba(0,0,0,0.3);`;
        const line1 = document.createElement('div'); line1.textContent = '楼中楼脚本正在运行，请稍候'; line1.style.marginBottom = '6px';
        progressLine2 = document.createElement('div'); progressLine2.textContent = '正在初始化...'; progressLine2.style.fontWeight = 'normal'; progressLine2.style.fontSize = '14px';
        progressBar.appendChild(line1); progressBar.appendChild(progressLine2); document.body.appendChild(progressBar);
    }

    function updateProgressLine2(t) { if (progressLine2) progressLine2.textContent = t; }
    function removeProgressBar() { if (progressBar) { progressBar.style.opacity = '0'; setTimeout(() => progressBar?.parentNode?.removeChild(progressBar), 500); } }

    function showInitialProgress() {
        try {
            createProgressBar();
            const info = parsePageInfo();
            updateProgressLine2(`正在加载：第 ${info.currentPage} 页 / 共 ${info.totalPages} 页`);
            const container = document.getElementById('m_posts_c');
            if (container) {
                expandAllCollapses(container);
            } else {
                console.warn('[NGA 楼中楼] 未找到 m_posts_c 容器');
            }
        } catch (e) {
            console.error('[NGA 楼中楼] showInitialProgress 错误:', e);
        }
    }

    if (document.readyState === 'loading') {
        console.log('[NGA 楼中楼] 页面加载中，等待 DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', showInitialProgress);
    } else {
        console.log('[NGA 楼中楼] 页面已加载，直接执行 showInitialProgress');
        showInitialProgress();
    }

    if (!isLoaderTab) {
        setTimeout(startLoading, 8000);
    } else {
        setTimeout(autoClickJump, 2000);
    }

    function startLoading() {
        try {
            const tid = urlParams.get('tid');
            if (!tid) {
                console.warn('[NGA 楼中楼] 未找到 tid 参数');
                updateProgressLine2('错误：未找到帖子 ID');
                setTimeout(removeProgressBar, 3000);
                return;
            }
            const info = parsePageInfo();
            if (info.totalPages <= info.currentPage) {
                console.log('[NGA 楼中楼] 已最后一页');
                updateProgressLine2('已是最后一页');
                setTimeout(removeProgressBar, 2000);
                return;
            }
            const container = document.getElementById('m_posts_c');
            if (!container) {
                console.warn('[NGA 楼中楼] 未找到 m_posts_c 容器');
                updateProgressLine2('错误：未找到容器');
                setTimeout(removeProgressBar, 3000);
                return;
            }
            loadedPages.clear();
            updateProgressLine2(`正在加载：第 ${info.currentPage + 1} 页 / 共 ${info.totalPages} 页`);
            loadNextPage(info.currentPage + 1, info.totalPages, tid, container);
        } catch (e) {
            console.error('[NGA 楼中楼] startLoading 错误:', e);
        }
    }

    function parsePageInfo() {
        try {
            let totalPages = 1;
            let currentPage = parseInt(urlParams.get('page')) || 1;
            const links = document.querySelectorAll('#pagebtop a, #pagebbtm a');
            links.forEach(link => {
                const text = link.textContent.trim();
                const num = parseInt(text);
                if (!isNaN(num)) totalPages = Math.max(totalPages, num);
            });
            const lastPageLink = document.querySelector('#pagebtop a[title*="最后页"], #pagebbtm a[title*="最后页"]');
            if (lastPageLink) {
                const match = lastPageLink.href.match(/page=(\d+)/);
                if (match) {
                    const lastPage = parseInt(match[1]);
                    if (lastPage > totalPages) totalPages = lastPage;
                }
            }
            console.log('[NGA 楼中楼] 解析页面: 当前页', currentPage, '总页数', totalPages);
            return { totalPages, currentPage };
        } catch (e) {
            console.error('[NGA 楼中楼] parsePageInfo 错误:', e);
            return { totalPages: 1, currentPage: 1 };
        }
    }

    function loadNextPage(page, total, tid, container) {
        try {
            if (loadedPages.has(page)) {
                page < total ? loadNextPage(page + 1, total, tid, container) : finishLoading(container);
                return;
            }
            updateProgressLine2(`正在加载：第 ${page} 页 / 共 ${total} 页`);

            const url = `${window.location.origin}/read.php?tid=${tid}&loader=1&page=${page}`;
            GM_openInTab(url, { active: false });

            const key = `POSTS_${page}`;
            const check = setInterval(() => {
                const html = GM_getValue(key);
                if (html) {
                    clearInterval(check);
                    GM_setValue(key, null);
                    appendPosts(html, page, container);
                    loadedPages.add(page);
                    page < total ? loadNextPage(page + 1, total, tid, container) : finishLoading(container);
                }
            }, 1000);

            setTimeout(() => {
                if (!loadedPages.has(page)) {
                    clearInterval(check);
                    loadedPages.add(page);
                    page < total ? loadNextPage(page + 1, total, tid, container) : finishLoading(container);
                }
            }, 30000);
        } catch (e) {
            console.error('[NGA 楼中楼] loadNextPage 错误:', e);
        }
    }

    function appendPosts(html, page, container) {
        try {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;
            expandAllCollapses(tempContainer);
            const tables = tempContainer.querySelectorAll('table.forumbox.postbox');
            tables.forEach(t => container.appendChild(t.cloneNode(true)));
            console.log('[NGA 楼中楼] 第', page, '页追加', tables.length, '条');
        } catch (e) {
            console.error('[NGA 楼中楼] appendPosts 错误:', e);
        }
    }

    function finishLoading(container) {
        if (isFinished) return;
        isFinished = true;
        updateProgressLine2('正在构建楼中楼...');
        document.getElementById('m_pbtntop')?.remove();
        document.getElementById('m_pbtnbtm')?.remove();
        setTimeout(() => {
            try {
                enableThreadedView();
                expandAllCollapses(container);
            } catch (e) {
                console.error('[NGA 楼中楼] finishLoading 错误:', e);
            }
        }, 1000);
    }

    function autoClickJump() {
        try {
            if (document.body.innerHTML.includes('访客不能直接访问')) {
                if (window.g) { window.g(); return; }
                const link = document.querySelector('a[onclick="g()"]');
                if (link) { link.click(); setTimeout(extractPosts, 2000); return; }
                setAntiBotCookie();
                return;
            }
            extractPosts();
        } catch (e) {
            console.error('[NGA 楼中楼] autoClickJump 错误:', e);
        }
    }

    function setAntiBotCookie() {
        try {
            const now = Date.now();
            document.cookie = `guestJs=${Math.floor(now/1000)}_9c1cuj;domain=bbs.nga.cn;path=/;max-age=1800`;
            document.cookie = `lastpath=0;domain=bbs.nga.cn;path=/;max-age=0`;
            const url = new URL(window.location.href);
            url.searchParams.set('rand', Math.floor(Math.random() * 1000));
            setTimeout(() => window.location.replace(url.toString()), 300);
        } catch (e) {
            console.error('[NGA 楼中楼] setAntiBotCookie 错误:', e);
        }
    }

    function extractPosts() {
        try {
            const page = new URLSearchParams(window.location.search).get('page') || '1';
            const container = document.getElementById('m_posts_c');
            if (container) {
                expandAllCollapses(container);
                GM_setValue(`POSTS_${page}`, container.innerHTML);
                console.log('[NGA 楼中楼] 子页', page, '数据写入 GM_setValue');
                setTimeout(() => window.close(), 500);
            } else {
                console.warn('[NGA 楼中楼] 子页', page, '未找到 m_posts_c，稍后重试');
                setTimeout(extractPosts, 1000);
            }
        } catch (e) {
            console.error('[NGA 楼中楼] extractPosts 错误:', e);
        }
    }

    function enableThreadedView() {
        try {
            const style = document.createElement('style');
            style.textContent = `table.forumbox.postbox.indented > tbody > tr > td { background: #F2EDDF !important; }`;
            document.head.appendChild(style);

            const container = document.getElementById('m_posts_c');
            const all = Array.from(container.querySelectorAll('table.forumbox.postbox'));
            if (!all.length) {
                updateProgressLine2('无帖子');
                setTimeout(removeProgressBar, 2000);
                return;
            }

            const pidToFloor = {}, floorToPost = {};
            all.forEach(t => {
                const floor = t.querySelector('a[name^="l"]') ? parseInt(t.querySelector('a[name^="l"]').textContent.replace('#','')) || 0 : 0;
                const pid = t.querySelector('a[id^="pid"][id$="Anchor"]') ? t.querySelector('a[id^="pid"][id$="Anchor"]').id.replace('pid','').replace('Anchor','') : '0';
                pidToFloor[pid] = floor;
                floorToPost[floor] = { element: t, pid, children: [] };
            });

            let removed = 0;
            all.forEach(t => {
                const pid = t.querySelector('a[id^="pid"][id$="Anchor"]') ? t.querySelector('a[id^="pid"][id$="Anchor"]').id.replace('pid','').replace('Anchor','') : '0';
                const floor = pidToFloor[pid];
                let parent = 0, removeQuote = false;
                const quote = t.querySelector('div.quote');
                if (quote) {
                    const link = quote.querySelector('a[href*="topid="]');
                    if (link) { const p = link.href.match(/topid=(\d+)/)?.[1]; parent = p ? pidToFloor[p] : 0; removeQuote = true; removed++; }
                }
                floorToPost[floor].parentFloor = parent;
                if (parent !== floor && parent !== undefined && floorToPost[parent]) floorToPost[parent].children.push(floorToPost[floor]);
                if (removeQuote) floorToPost[floor].removeQuote = true;
            });

            const root = floorToPost[0];
            if (!root) {
                updateProgressLine2('错误：无主楼');
                setTimeout(removeProgressBar, 3000);
                return;
            }

            function sort(node) { if (node.children) { node.children.sort((a,b)=>a.floor-b.floor); node.children.forEach(sort); } }
            sort(root);

            renderThreadedView(root, container);
            updateProgressLine2(`完成！共 ${all.length} 条`);
            setTimeout(removeProgressBar, 3000);
        } catch (e) {
            console.error('[NGA 楼中楼] enableThreadedView 错误:', e);
        }
    }

    function renderThreadedView(root, container) {
        try {
            container.innerHTML = '';
            function render(post, level = 0) {
                const dl = (post.floor === 0 || post.parentFloor === 0) ? 0 : level;
                if (post.removeQuote) { const q = post.element.querySelector('div.quote'); if (q) q.remove(); }
                if (dl > 0) {
                    const c1 = post.element.querySelector('td.c1');
                    if (c1) { const info = c1.querySelector('div[style*="text-align:left;line-height:1.5em"]'); if (info) { c1.innerHTML = ''; c1.appendChild(info.cloneNode(true)); } }
                }
                if (dl > 0) {
                    const c2 = post.element.querySelector('td.c2');
                    if (c2) {
                        ['.postInfo', '.goodbad', `[id^="postsubject"]`, '.x'].forEach(s => {
                            const el = c2.querySelector(s);
                            if (el) {
                                if (s.includes('postsubject') && el.textContent.trim() === '') el.style.display = 'none';
                                else if (s !== '.postInfo') el.style.display = 'none';
                                else { el.style.lineHeight = '1.2'; el.style.margin = '2px 0'; }
                            }
                        });
                        const content = c2.querySelector(`[id^="postcontent"]`);
                        if (content) { content.style.margin = '4px 0'; content.style.lineHeight = '1.45'; }
                    }
                }
                if (dl > 0) {
                    post.element.classList.add('indented');
                    const t = post.element;
                    t.style.border = '1px solid #fff';
                    t.style.borderRadius = '6px';
                    t.style.overflow = 'hidden';
                    t.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                }
                const wrapper = document.createElement('div');
                wrapper.style.marginLeft = `${dl * 20}px`;
                wrapper.style.marginBottom = '8px';
                wrapper.appendChild(post.element.cloneNode(true));
                container.appendChild(wrapper);
                post.children.forEach(c => render(c, level + 1));
            }
            render(root, 0);
        } catch (e) {
            console.error('[NGA 楼中楼] renderThreadedView 错误:', e);
        }
    }
})();