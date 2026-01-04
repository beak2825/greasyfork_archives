// ==UserScript==
// @name         Yamibo漫区封面卡片
// @namespace    https://bbs.yamibo.com/
// @version      1.1
// @description  Yamibo漫画区帖子列表实现卡片风格瀑布流展示
// @author       hitori酱
// @match        https://bbs.yamibo.com/forum.php*fid=30*
// @match        https://bbs.yamibo.com/forum-30-*
// @match        https://bbs.yamibo.com/forum-37-*
// @icon         https://www.yamibo.com/favicon.ico
// @grant        none
// @run-at       document-end
// @noframes
// @license      MIT License
// @updateURL
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/556073/Yamibo%E6%BC%AB%E5%8C%BA%E5%B0%81%E9%9D%A2%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/556073/Yamibo%E6%BC%AB%E5%8C%BA%E5%B0%81%E9%9D%A2%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DOMAIN = 'https://bbs.yamibo.com/';
    const PLACEHOLDER = 'https://s2.loli.net/2025/11/10/nTuPOVqdFQHLosz.jpg';

    // Base64 SVG 图标
    const ICONS = {
        view: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjBweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyMHB4IiBmaWxsPSIjNjY2NjY2Ij48cGF0aCBkPSJNNDgwLTMxMnE3MCAwIDExOS00OXQ0OS0xMTlxMC03MC00OS0xMTl0LTExOS00OXEtNzAgMC0xMTkgNDl0LTQ5IDExOXEwIDcwIDQ5IDExOXQxMTkgNDlabTAtNzJxLTQwIDAtNjgtMjh0LTI4LTY4cTAtNDAgMjgtNjh0NjgtMjhxNDAgMCA2OCAyOHQyOCA2OHEwIDQwLTI4IDY4dC02OCAyOFptMCAxOTJxLTE0Mi42IDAtMjU5LjgtNzguNVExMDMtMzQ5IDQ4LTQ4MHE1NS0xMzEgMTcyLjItMjA5LjVRMzM3LjQtNzY4IDQ4MC03NjhxMTQyLjYgMCAyNTkuOCA3OC41UTg1Ny02MTEgOTEyLTQ4MHEtNTUgMTMxLTE3Mi4yIDIwOS41UTYyMi42LTE5MiA0ODAtMTkyWiIvPjwvc3ZnPg==',
        reply: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjBweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyMHB4IiBmaWxsPSIjNjY2NjY2Ij48cGF0aCBkPSJNMjQwLTM4NGg0ODB2LTcySDI0MHY3MlptMC0xMzJoNDgwdi03MkgyNDB2NzJabTAtMTMyaDQ4MHYtNzJIMjQwdjcyWm0tNzIgNDA4cS0yOS43IDAtNTAuODUtMjEuMTVROTYtMjgyLjMgOTYtMzEydi00ODBxMC0yOS43IDIxLjE1LTUwLjg1UTEzOC4zLTg2NCAxNjgtODY0aDYyNHEyOS43IDAgNTAuODUgMjEuMTVRODY0LTgyMS43IDg2NC03OTJ2Njk2TDcyMC0yNDBIMTY4WiIvPjwvc3ZnPg==',
        favorite: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjBweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyMHB4IiBmaWxsPSIjRUEzMzIzIj48cGF0aCBkPSJtNDgwLTE0NC01MC00NXEtMTAwLTg5LTE2NS0xNTIuNXQtMTAyLjUtMTEzUTEyNS01MDQgMTEwLjUtNTQ1VDk2LTYyOXEwLTg5IDYxLTE1MHQxNTAtNjFxNDkgMCA5NSAyMXQ3OCA1OXEzMi0zOCA3OC01OXQ5NS0yMXE4OSAwIDE1MCA2MXQ2MSAxNTBxMCA0My0xNCA4M3QtNTEuNSA4OXEtMzcuNSA0OS0xMDMgMTEzLjVUNTI4LTE4N2wtNDggNDNaIi8+PC9zdmc+'
    };

    function setRealImage(card, imgUrl) {
        const img = card.querySelector('img');
        if (img) {
            img.src = imgUrl;
            img.removeAttribute('data-src');
        }
    }

    function createCard(threadData) {
        const { title, url, category, heat, readPerm, views, replies, favorite } = threadData;
        const card = document.createElement('div');
        card.className = 'comic-card';

        // 图片
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'img-wrapper';
        const img = document.createElement('img');
        img.src = PLACEHOLDER;
        img.alt = title;
        imgWrapper.appendChild(img);

        // 浮层
        const tagCategory = document.createElement('div');
        tagCategory.className = 'tag-category';
        tagCategory.innerText = category;
        imgWrapper.appendChild(tagCategory);

        // 热门标签
        if (heat && (heat.includes('热') || heat.includes('火'))) {
            const hotTag = document.createElement('div');
            hotTag.className = 'tag-hot';
            hotTag.innerText = '火';
            imgWrapper.appendChild(hotTag);
        }

        const tagRead = document.createElement('div');
        tagRead.className = 'tag-readperm';
        tagRead.innerText = readPerm ? `[阅读权限 ${readPerm}]` : '';
        imgWrapper.appendChild(tagRead);

        card.appendChild(imgWrapper);

        // 数据行
        const dataRow = document.createElement('div');
        dataRow.className = 'data-row';

        const viewDiv = document.createElement('div');
        viewDiv.innerHTML = `<img src="${ICONS.view}" class="icon"> ${views||0}`;
        dataRow.appendChild(viewDiv);

        const replyDiv = document.createElement('div');
        replyDiv.innerHTML = `<img src="${ICONS.reply}" class="icon"> ${replies||0}`;
        dataRow.appendChild(replyDiv);

        const favDiv = document.createElement('div');
        favDiv.innerHTML = `<img src="${ICONS.favorite}" class="icon fav-icon"> ${favorite||0}`;
        dataRow.appendChild(favDiv);

        card.appendChild(dataRow);

        // 标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.innerText = title;
        card.appendChild(titleDiv);

        card.onclick = () => window.open(url, '_blank');
        return card;
    }

    function initGrid() {
        const threadList = document.querySelector('#threadlist');
        if (!threadList) return;

        // 默认收起标签区域
        const threadTypes = document.querySelector('#thread_types');
        if (threadTypes) {
            threadTypes.style.height = '';
            const foldLi = threadTypes.querySelector('li.fold');
            if (foldLi && foldLi.onclick) {
                foldLi.onclick();
            }
        }

        const oldTable = document.querySelector('#threadlisttableid');
        if (oldTable) oldTable.style.display = 'none';

        const stickyThreads = document.querySelectorAll('tbody[id^="stickthread_"]');
        stickyThreads.forEach(tbody => tbody.style.display = 'none');

        const nextPageBtn = document.querySelector('#autopbn');
        if (nextPageBtn) nextPageBtn.style.display = 'none';

        // 隐藏列表标题框右侧的表头文字标签
        const threadHeader = document.querySelector('#threadlist .th');
        if (threadHeader) {
            const headerCells = threadHeader.querySelectorAll('td, th');
            headerCells.forEach((cell, index) => {
                // 隐藏作者、回复/查看、最后发表等标签列
                if (index > 0) { // 保留第一列（主题标题），隐藏其他列
                    cell.style.display = 'none';
                }
            });
        }

        const grid = document.createElement('div');
        grid.id = 'comic-grid';
        threadList.appendChild(grid);

        const style = document.createElement('style');
        style.innerHTML = `
#comic-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    padding: 10px;
}
.comic-card {
    width: calc(16.66% - 15px);
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: visible;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}
.comic-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
.img-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 4/5;
    background: #f8f8f8;
    overflow: hidden;
    flex-shrink: 0;
}
.img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
    border-radius: 8px 8px 0 0;
}
.tag-category {
    position: absolute;
    top: 5px; left: 5px;
    background: rgba(153,153,153,0.6);
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    z-index: 10;
    color: #a0522d;
}
.tag-hot {
    position: absolute;
    top: 5px; right: 5px;
    background: rgba(255, 107, 53, 0.9);
    color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    z-index: 10;
}

.tag-readperm {
    position: absolute;
    bottom: 5px; right: 5px;
    background: rgba(153,153,153,0.6);
    color: #a0522d;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 12px;
    z-index: 10;
}
.data-row {
    display: flex;
    justify-content: space-around;
    padding: 5px 0;
    font-size: 12px;
    color: #666;
}
.data-row .icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 3px;
}
.data-row .fav-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 4px;
    object-fit: contain;
}
.title {
    padding: 8px;
    font-size: 15px;
    line-height: 1.4;
    text-align: left;
    word-break: break-word;
    overflow-wrap: break-word;
    min-height: 1.4em;
    overflow: visible;
    display: block;
    flex: 1 1 auto;
}
        `;
        document.head.appendChild(style);

        // 等高逻辑：基于标题实际需要高度计算
        function equalizeRowHeights() {
            const cards = Array.from(grid.children);
            let rows = {};
            cards.forEach(card => {
                card.style.height = '';
                const top = card.offsetTop;
                if (!rows[top]) rows[top] = [];
                rows[top].push(card);
            });
            Object.values(rows).forEach(rowCards => {
                // 计算固定部分高度：图片 + 数据行
                const fixedHeight = rowCards[0].querySelector('.img-wrapper').offsetHeight +
                                  rowCards[0].querySelector('.data-row').offsetHeight;

                // 找出本行标题需要的最大高度
                const maxTitleHeight = Math.max(...rowCards.map(c => {
                    const title = c.querySelector('.title');
                    return title.scrollHeight + 16; // 16px是padding
                }));

                const finalHeight = fixedHeight + maxTitleHeight;
                rowCards.forEach(c => {
                    c.style.height = finalHeight + 'px';
                });
            });
        }

        loadThreads(grid, equalizeRowHeights);

        window.addEventListener('resize', () => setTimeout(equalizeRowHeights, 300));
    }

    function getThreads() {
        return document.querySelectorAll('tbody[id^="normalthread_"]');
    }

    function findFirstImage(doc) {
        let img;
        
        // 优先查找 ignore_js_op 内的图片（通常是漫画内容）
        img = doc.querySelector('ignore_js_op img');
        if (img && (img.getAttribute('file') || img.getAttribute('zoomfile'))) return img;
        
        // 查找带有 aid 属性的附件图片（支持多种容器）
        img = doc.querySelector('img[aid]');
        if (img && (img.getAttribute('file') || img.getAttribute('zoomfile'))) {
            return img; // 有file或zoomfile属性的aid图片直接返回
        }
        
        // 查找 zoom 类的图片
        img = doc.querySelector('img.zoom');
        if (img && (img.getAttribute('file') || img.getAttribute('zoomfile'))) return img;
        
        // 在 postmessage 容器中查找图片
        img = doc.querySelector('.postmessage img');
        if (img && (img.getAttribute('src') || img.getAttribute('file') || img.getAttribute('zoomfile'))) {
            const src = img.getAttribute('src') || '';
            // 过滤表情图片和占位图片
            if (!src.includes('static/image/smiley/') && !src.includes('static/image/common/none.gif')) {
                return img;
            }
        }
        
        // 最后尝试第一个帖子内容区的图片，但要过滤表情图片
        img = doc.querySelector('td.t_f img');
        if (img && (img.getAttribute('src') || img.getAttribute('file') || img.getAttribute('zoomfile'))) {
            const src = img.getAttribute('src') || '';
            // 过滤表情图片路径
            if (!src.includes('static/image/smiley/') && !src.includes('static/image/common/none.gif')) {
                return img;
            }
        }



        // 尝试后续楼层的内容（第2-5楼）- 支持多种容器格式
        const postContainers = doc.querySelectorAll('.postmessage, td.t_f');
        for (let i = 1; i < Math.min(postContainers.length, 5); i++) {
            const post = postContainers[i];
            
            // 优先查找 ignore_js_op 内的图片
            img = post.querySelector('ignore_js_op img');
            if (img && (img.getAttribute('file') || img.getAttribute('zoomfile'))) {
                return img;
            }
            
            // 查找带 aid 属性的图片
            img = post.querySelector('img[aid]');
            if (img && (img.getAttribute('file') || img.getAttribute('zoomfile'))) {
                return img; // 有file或zoomfile属性的aid图片直接返回
            }
            
            // 然后查找普通图片，但过滤表情图片
            img = post.querySelector('img');
            if (img && (img.getAttribute('src') || img.getAttribute('file') || img.getAttribute('zoomfile'))) {
                const src = img.getAttribute('src') || '';
                if (!src.includes('static/image/smiley/') && !src.includes('static/image/common/none.gif')) {
                    return img;
                }
            }
        }

        
        // 如果楼层查找失败，尝试其他备用方式
        
        // 5. 查找保存照片区域的图片
        img = doc.querySelector('div.savephotop img');
        if (img && (img.getAttribute('src') || img.getAttribute('file') || img.getAttribute('zoomfile'))) {
            const src = img.getAttribute('src') || '';
            if (!src.includes('static/image/common/none.gif')) return img;
        }

        // 6. 查找嵌套在各种容器内的 savephotop 图片
        img = doc.querySelector('.pcb .savephotop img');
        if (img && (img.getAttribute('src') || img.getAttribute('file') || img.getAttribute('zoomfile'))) {
            const src = img.getAttribute('src') || '';
            if (!src.includes('static/image/common/none.gif')) return img;
        }

        // 7. 查找 pattl 内的图片
        img = doc.querySelector('.pattl img');
        if (img && (img.getAttribute('src') || img.getAttribute('file') || img.getAttribute('zoomfile'))) {
            const src = img.getAttribute('src') || '';
            if (!src.includes('static/image/common/none.gif')) return img;
        }

        // 8. 查找 tattl attm 内的图片
        img = doc.querySelector('.tattl.attm img');
        if (img && (img.getAttribute('src') || img.getAttribute('file') || img.getAttribute('zoomfile'))) {
            const src = img.getAttribute('src') || '';
            if (!src.includes('static/image/common/none.gif')) return img;
        }

        // 9. 最后尝试任何带有 file 或 zoomfile 属性的图片（优先使用这些属性）
        const fileImgs = doc.querySelectorAll('img[file], img[zoomfile]');
        for (const img of fileImgs) {
            if (img.getAttribute('file') || img.getAttribute('zoomfile')) {
                const src = img.getAttribute('src') || '';
                if (!src.includes('static/image/common/none.gif')) return img;
            }
        }

        return null;
    }

    async function fetchFavorite(url) {
        try {
            const resp = await fetch(url);
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const fav = doc.querySelector('#favoritenumber');
            return fav ? parseInt(fav.innerText) : 0;
        } catch(e) {
            return 0;
        }
    }

    async function loadThreads(grid, equalizeRowHeights) {
        const threads = getThreads();
        let loadedCount = 0;

        for (const tbody of threads) {
            const link = tbody.querySelector('th a.s.xst');
            if (!link) continue;
            const title = link.innerText;
            const url = link.href;

            const categoryElem = tbody.querySelector('th em a');
            const category = categoryElem ? categoryElem.innerText : '';

            const readPermElem = tbody.querySelector('th span.xw1');
            const readPerm = readPermElem ? readPermElem.innerText : '';

            const heatElem = tbody.querySelector('th .tbox.theatlevel');
            const heat = heatElem ? heatElem.innerText : '';

            const repliesElem = tbody.querySelector('td.num a.xi2');
            const replies = repliesElem ? repliesElem.innerText : '';

            const viewsElem = tbody.querySelector('td.num em');
            const views = viewsElem ? viewsElem.innerText : '';

            // 初始 favorite 0，异步更新
            let threadData = { title, url, category, heat, readPerm, views, replies, favorite: 0 };
            const card = createCard(threadData);
            grid.appendChild(card);

            fetch(url).then(resp => resp.text()).then(async html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const firstImg = findFirstImage(doc);
                if (firstImg) {
                    let srcRel = firstImg.getAttribute('file') || firstImg.getAttribute('zoomfile') || firstImg.getAttribute('src');
                    if (srcRel) {
                        const imgUrl = srcRel.startsWith('http') ? srcRel : new URL(srcRel, DOMAIN).href;
                        if (/\.(jpe?g|png|webp)$/i.test(imgUrl)) {
                            setRealImage(card, imgUrl);
                        }
                    }
                }

                // 更新收藏
                const favElem = doc.querySelector('#favoritenumber');
                if (favElem) {
                    const favNum = parseInt(favElem.innerText) || 0;
                    const favDiv = card.querySelector('.fav-icon').parentNode;
                    favDiv.innerHTML = `<img src="${ICONS.favorite}" class="icon fav-icon"> ${favNum}`;
                }

                // 每次更新后重新计算等高
                loadedCount++;
                if (loadedCount === threads.length) {
                    setTimeout(equalizeRowHeights, 100);
                }
            });
        }
    }

    window.addEventListener('load', initGrid);
})();
