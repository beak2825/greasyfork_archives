// ==UserScript==
// @name         98堂帖子预览-AI修改版
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       yancj
// @license      MIT
// @version      9.9.9
// @description  98堂[原色花堂]自动预览帖子中的图片及链接，支持无缝翻页。
// @match        https://sehuatang.org/*
// @match        https://sehuatang.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sehuatang.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558008/98%E5%A0%82%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88-AI%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558008/98%E5%A0%82%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88-AI%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 自定义样式 ---
    function applyCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #wp {
                width: 70% !important;
                margin: 0 auto !important;
            }
        `;
        document.head.appendChild(style);
    }
    applyCustomStyles();

    window.activeRestoreButton = null;


    // --- 配置参数 ---
    const MAX_PREVIEW_IMAGES = 5; // 每个帖子最大预览图片数量，可修改此数值调整显示张数

    // --- 通用工具 ---
    function waitForImages(container) {
        const images = Array.from(container.querySelectorAll('img'));
        if (images.length === 0) {
            return Promise.resolve();
        }

        const promises = images.map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true }); // Resolve on error too
                }
            });
        });

        return Promise.all(promises);
    }

    async function fetchWithTimeout(resource, options = {}) {
        const { timeout = 8000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    function extractDownloadLinks(doc) {
        const links = {
            magnet: []
        };
        try {
            const resourceLinks = doc.querySelectorAll('.ext-push-resource-to-115-text');
            resourceLinks.forEach(link => {
                const url = link.getAttribute('data-resource-url') || link.textContent;
                if (url && url.trim()) {
                    if (url.startsWith('magnet:')) links.magnet.push(url.trim());
                }
            });
            const blockCodes = doc.querySelectorAll('.blockcode');
            blockCodes.forEach(block => {
                const codeText = block.textContent;
                if (!codeText) return;
                const magnetMatches = codeText.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]*/g);
                if (magnetMatches) links.magnet.push(...magnetMatches.map(l => l.trim()));
            });
        } catch (error) {
            console.error("链接提取错误:", error);
        }
        links.magnet = [...new Set(links.magnet)];
        return links;
    }

    function extractPostPreviewData(doc) {
        const imgElements = Array.from(doc.querySelectorAll("img.zoom")).filter(img => {
            const file = img.getAttribute("file");
            if (!file || file.includes("static")) return false;

            // 核心规则：过滤宽度为430px的装饰图
            const width = parseInt(img.getAttribute('width') || 0);
            if (width === 430) {
                return false;
            }

            // 保留规则：过滤装饰性PNG
            const lowerCaseFile = file.toLowerCase();
            if (lowerCaseFile.endsWith('.png') && (file.includes('7pzzv.us') || file.includes('iili.io'))) {
                return false;
            }

            return true; // 如果所有过滤规则都未匹配，则保留图片
        }).slice(0, MAX_PREVIEW_IMAGES);

        const downloadLinks = extractDownloadLinks(doc);

        return { images: imgElements, links: downloadLinks };
    }

    function createLinksElement(links, threadURL) {
        if (links.magnet.length === 0) return null;

        const container = document.createElement('div');
        container.style.cssText = `margin: 10px 0; padding: 10px; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; width: 100%; box-sizing: border-box;`;

        const createSection = (title, linkArr, isEd2k) => {
            if (linkArr.length === 0) return;
            const titleDiv = document.createElement('div');
            titleDiv.textContent = title;
            titleDiv.style.fontWeight = 'bold';
            titleDiv.style.marginBottom = '8px';
            if (!isEd2k) titleDiv.style.marginTop = '0px';
            container.appendChild(titleDiv);

            linkArr.forEach((link, index) => {
                const linkDiv = document.createElement('div');
                linkDiv.style.marginBottom = '10px';
                const linkBox = document.createElement('div');
                linkBox.style.cssText = `background-color: white; border: 1px solid #ddd; padding: 5px; border-radius: 4px; margin-bottom: 5px; word-break: break-all; word-wrap: break-word; cursor: pointer; transition: background-color 0.2s;`;
                linkBox.title = "点击复制链接";
                linkBox.appendChild(document.createTextNode(link));

                linkBox.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(link).catch(err => {
                        console.error('无法复制链接: ', err);
                    });
                });

                linkDiv.appendChild(linkBox);
                if (index > 0) {
                    linkDiv.style.display = 'none';
                    linkDiv.classList.add('hidden-link');
                }
                container.appendChild(linkDiv);
            });
        };

        createSection('磁力链接:', links.magnet, false);

        const totalLinks = links.magnet.length;
        if (totalLinks > 1) {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = `显示剩余 ${totalLinks - 1} 个链接`;
            toggleButton.style.cssText = `margin-top: 5px; cursor: pointer; border: 1px solid #ccc; background-color: #f0f0f0; padding: 5px 10px; border-radius: 4px;`;
            let expanded = false;
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                expanded = !expanded;
                container.querySelectorAll('.hidden-link').forEach(l => l.style.display = expanded ? 'block' : 'none');
                toggleButton.textContent = expanded ? '收起链接' : `显示剩余 ${totalLinks - 1} 个链接`;
            });
            container.appendChild(toggleButton);
        }
        return container;
    }

    function createLightbox(imgSrc, allImages = []) {
        const lightbox = document.createElement('div');
        lightbox.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; cursor: pointer;';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; border: 2px solid white;';
        lightbox.appendChild(img);

        // 添加导航按钮
        if (allImages.length > 1) {
            let currentIndex = allImages.indexOf(imgSrc);

            // 创建按钮
            const prevBtn = document.createElement('div');
            prevBtn.innerHTML = '‹';
            prevBtn.style.cssText = `
                position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
                width: 50px; height: 50px; background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-size: 30px; color: white; cursor: pointer; transition: all 0.3s;
                z-index: 10000;
            `;
            prevBtn.addEventListener('mouseover', () => {
                prevBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            });
            prevBtn.addEventListener('mouseout', () => {
                prevBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentIndex > 0) {
                    currentIndex--;
                    img.src = allImages[currentIndex];
                    updateUI();
                }
            });
            lightbox.appendChild(prevBtn);

            const nextBtn = document.createElement('div');
            nextBtn.innerHTML = '›';
            nextBtn.style.cssText = `
                position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
                width: 50px; height: 50px; background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-size: 30px; color: white; cursor: pointer; transition: all 0.3s;
                z-index: 10000;
            `;
            nextBtn.addEventListener('mouseover', () => {
                nextBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            });
            nextBtn.addEventListener('mouseout', () => {
                nextBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentIndex < allImages.length - 1) {
                    currentIndex++;
                    img.src = allImages[currentIndex];
                    updateUI();
                }
            });
            lightbox.appendChild(nextBtn);

            // 图片计数器
            const counter = document.createElement('div');
            counter.style.cssText = `
                position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7); color: white; padding: 8px 16px;
                border-radius: 20px; font-size: 14px; z-index: 10000;
            `;
            lightbox.appendChild(counter);

            function updateUI() {
                // 更新按钮显示状态
                prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
                nextBtn.style.display = currentIndex < allImages.length - 1 ? 'flex' : 'none';
                // 更新计数器
                counter.textContent = `${currentIndex + 1} / ${allImages.length}`;
            }

            // 初始化UI
            updateUI();
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target !== img && !e.target.closest('div[style*="position: absolute"]')) {
                document.body.removeChild(lightbox);
            }
        });

        document.body.appendChild(lightbox);
    }

    // --- UI组件 ---
    function createNormalPageToggle({ storageKeyEnabled, onEnable, onDisable, defaultEnabled = false }) {
        const navMenu = document.querySelector('#nv ul');
        if (!navMenu) return;

        const toggleLi = document.createElement('li');
        toggleLi.id = 'nav-toggle-infinite-scroll';

        const toggleLink = document.createElement('a');
        toggleLink.href = 'javascript:;';
        toggleLink.hideFocus = true;
        toggleLink.textContent = '无缝翻页';
        toggleLi.appendChild(toggleLink);

        navMenu.appendChild(toggleLi);

        let isEnabled = (localStorage.getItem(storageKeyEnabled) === null) ? defaultEnabled : (localStorage.getItem(storageKeyEnabled) === 'true');

        const updateStateUI = () => {
            if (isEnabled) {
                toggleLi.classList.add('a'); // 'a' is the class for active menu items
                toggleLink.style.color = '#28a745'; // Green color for enabled state
            } else {
                toggleLi.classList.remove('a');
                toggleLink.style.color = ''; // Revert to default color
            }
        };

        toggleLi.addEventListener('click', (e) => {
            e.preventDefault();
            isEnabled = !isEnabled;
            localStorage.setItem(storageKeyEnabled, String(isEnabled));
            updateStateUI();
            if (isEnabled) {
                onEnable();
            } else {
                onDisable();
            }
        });

        updateStateUI();
        if (isEnabled) {
            onEnable();
        }
    }

function createSearchPageToggle({ storageKeyEnabled, onEnable, onDisable, defaultEnabled = false }) {
    const targetContainer = document.querySelector('.sttl.mbn');
    if (!targetContainer) return;

    // Style the container to position the toggle
    targetContainer.style.display = 'flex';
    targetContainer.style.justifyContent = 'space-between';
    targetContainer.style.alignItems = 'center';

    const toggleWrapper = document.createElement('div');
    toggleWrapper.style.display = 'flex';
    toggleWrapper.style.alignItems = 'center';

    const label = document.createElement('span');
    label.textContent = '无缝翻页：';
    label.style.fontSize = '12px';
    label.style.color = '#666';
    label.style.marginRight = '8px';
    toggleWrapper.appendChild(label);

    const switchLabel = document.createElement('label');
    switchLabel.className = 'search-toggle-switch';
    const switchInput = document.createElement('input');
    switchInput.type = 'checkbox';
    const switchSpan = document.createElement('span');
    switchSpan.className = 'slider round';

    switchLabel.appendChild(switchInput);
    switchLabel.appendChild(switchSpan);
    toggleWrapper.appendChild(switchLabel);

    targetContainer.appendChild(toggleWrapper);

    // Add CSS for the toggle switch
    const style = document.createElement('style');
    style.textContent = `
        .search-toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .search-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: #28a745; }
        input:focus + .slider { box-shadow: 0 0 1px #28a745; }
        input:checked + .slider:before { transform: translateX(20px); }
        .slider.round { border-radius: 24px; }
        .slider.round:before { border-radius: 50%; }
    `;
    document.head.appendChild(style);

    let isEnabled = (localStorage.getItem(storageKeyEnabled) === null) ? defaultEnabled : (localStorage.getItem(storageKeyEnabled) === 'true');

    switchInput.addEventListener('change', () => {
        isEnabled = switchInput.checked;
        localStorage.setItem(storageKeyEnabled, String(isEnabled));
        if (isEnabled) {
            onEnable();
        } else {
            onDisable();
        }
    });

    // Set initial state
    switchInput.checked = isEnabled;
    if (isEnabled) {
        onEnable();
    }
}

function createFixedRestoreButton({ id, labelHtml, onClick }) {
    // 一个页面只允许一个恢复按钮
    if (window.activeRestoreButton) window.activeRestoreButton.remove();

        const btnContainer = document.createElement('div');
        btnContainer.id = id;
        btnContainer.style.cssText = `position:fixed; right:0; bottom: 10px; z-index:9997;`;

        btnContainer.innerHTML = `
            <div class="restore-btn-inner" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px 5px; border-radius: 5px 0 0 5px; box-shadow: -1px 1px 5px rgba(0,0,0,0.2); background-color: rgba(50, 50, 50, 0.7); border: none; box-sizing: border-box; cursor: pointer;">
                ${labelHtml}
            </div>`;
        document.body.appendChild(btnContainer);

        btnContainer.addEventListener('click', onClick);
        return btnContainer;
    }

    // --- 帖子列表页 ---
    function initializeNormalPage() {
        let scrollHandler = null, isLoading = false, nextUrl = '', loadingIndicator = null;
        let pageNumDisplay = null;

        function createPageNumElement() {
            if (document.getElementById('page-number-display')) return;
            pageNumDisplay = document.createElement('div');
            pageNumDisplay.id = 'page-number-display';
            pageNumDisplay.style.cssText = `position: fixed; z-index: 9998; user-select: none; display: none; background-color: rgba(50,50,50,0.5); color: white; padding: 5px; border-radius: 5px; font-size: 12px; text-align: center;`;
            document.body.appendChild(pageNumDisplay);
        }

        function updateAndSaveForumState() {
            // 浮动页码
            if (pageNumDisplay) {
                const scrollTopEl = document.getElementById('scrolltop');
                if (scrollTopEl && scrollTopEl.offsetHeight > 0 && window.getComputedStyle(scrollTopEl).visibility !== 'hidden') {
                    const rect = scrollTopEl.getBoundingClientRect();
                    pageNumDisplay.style.display = 'block';
                    pageNumDisplay.style.top = `${rect.top - pageNumDisplay.offsetHeight - 5}px`;
                    pageNumDisplay.style.left = `${rect.left}px`;
                    pageNumDisplay.style.width = `${rect.width}px`;
                    pageNumDisplay.style.boxSizing = 'border-box';
                    const currentPage = document.querySelector('.pg strong')?.textContent || '1';
                    pageNumDisplay.textContent = `第${currentPage}页`;
                } else {
                    pageNumDisplay.style.display = 'none';
                }
            }

            // 存储版面状态用于恢复
            const sectionLink = document.querySelector('#pt .z a:last-of-type');
            const sectionName = sectionLink?.textContent;
            const currentPageNum = document.querySelector('.pg strong')?.textContent || '1';
            if (sectionName) {
                // 生成页面URL模板
                const pageLink = document.querySelector('.pg a[href*="page="]') || document.querySelector('.pg a[href*="-"]');
                let urlTemplate = null;
                if (pageLink) {
                    urlTemplate = pageLink.href.replace(/([?&]page=)\d+/, '$1__PAGE__').replace(/-\d+\.html/, '-__PAGE__.html');
                }

                localStorage.setItem('lastForumState', JSON.stringify({
                    sectionName: sectionName,
                    page: currentPageNum,
                    urlTemplate: urlTemplate
                }));
            }
        }

        async function processSingleThread(link, colorIndex) {
            const colorThemes = [
                { background: '#f0f8ff', backgroundHover: '#e1f0ff', border: '#c0d8f0', shadow: '0 3px 6px rgba(0,106,193,0.12)' },
                { background: '#f5f9f0', backgroundHover: '#eaf3e0', border: '#d5e8c4', shadow: '0 3px 6px rgba(76,154,42,0.12)' }
            ];
            const currentTheme = colorThemes[colorIndex % colorThemes.length];
            const threadURL = link.href;
            const tbodyRef = link.closest("tbody");
            if (!tbodyRef || tbodyRef.nextElementSibling?.id === "imagePreviewTbody") return;

            try {
                const response = await fetchWithTimeout(threadURL);
                const pageContent = await response.text();
                const doc = new DOMParser().parseFromString(pageContent, "text/html");
                const { images: imgElements, links: downloadLinks } = extractPostPreviewData(doc);
                if (imgElements.length === 0 && !downloadLinks.magnet.length) return;

                const titleTr = link.closest('tr');
                if (titleTr) {
                    titleTr.style.cssText = `background-color: ${currentTheme.background}; transition: all 0.3s; border: 1px solid ${currentTheme.border}; border-bottom: 0; position: relative; z-index: 5; margin-bottom: 25px; box-shadow: ${currentTheme.shadow}, 0 1px 0 ${currentTheme.border};`;
                    Array.from(titleTr.children).forEach(cell => { cell.style.border = '0'; cell.style.borderCollapse = 'collapse'; });
                    const titleCell = link.closest('th, td');
                    if (titleCell) { titleCell.style.cssText = `padding: 15px; border-top-left-radius: 8px; border-top-right-radius: 8px;`; if (link) link.style.cssText = `font-size: 16px; font-weight: bold; color: #2c3e50; text-shadow: 0 1px 1px rgba(255,255,255,0.8);`; }
                }

                const newTbody = document.createElement("tbody"); newTbody.id = "imagePreviewTbody"; newTbody.style.cssText = "display: table-row-group; margin-top: -1px;";
                const newTr = document.createElement("tr"); newTr.style.cssText = `background-color: ${currentTheme.background}; border: 1px solid ${currentTheme.border}; border-top: 0;`;
                const newTd = document.createElement("td"); newTd.style.cssText = `padding: 18px; border-top-width: 0; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; box-shadow: ${currentTheme.shadow}; margin-bottom: 25px; position: relative;`; newTd.colSpan = "5";

                const contentContainer = document.createElement("div"); contentContainer.style.cssText = "display: flex; flex-direction: column; gap: 15px; width: 100%; position: relative;";
                if (imgElements.length > 0) {
                    const imgContainer = document.createElement("div"); imgContainer.style.cssText = "display: flex; margin-top: 5px; margin-bottom: 10px; flex-wrap: nowrap; justify-content: space-between; width: 100%; box-shadow: 0 2px 5px rgba(0,0,0,0.08); padding: 12px; border-radius: 8px; background-color: white; border: 1px solid rgba(0,0,0,0.06);";
                    const imgWidth = `${Math.floor(100 / imgElements.length) - 1}%`;
                    imgElements.forEach(imgEl => {
                        const imgSrc = imgEl.getAttribute("file");
                        const imgWrapper = document.createElement("div"); imgWrapper.style.cssText = `width: ${imgWidth}; height: 250px; margin-right: 8px; overflow: hidden; border-radius: 6px; box-shadow: 0 3px 6px rgba(0,0,0,0.1); position: relative; cursor: pointer;`;
                        const img = document.createElement("img"); img.src = imgSrc; img.style.cssText = "width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;";
                        imgWrapper.addEventListener('mouseover', () => { img.style.transform = "scale(1.05)"; });
                        imgWrapper.addEventListener('mouseout', () => { img.style.transform = "scale(1)"; });
                        imgWrapper.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.open(threadURL, '_blank'); });
                        imgWrapper.appendChild(img); imgContainer.appendChild(imgWrapper);
                    });
                    contentContainer.appendChild(imgContainer);
                }
                const linksElement = createLinksElement(downloadLinks, threadURL);
                if (linksElement) { linksElement.style.cssText += 'margin: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; background-color: white;'; contentContainer.appendChild(linksElement); }

                newTd.appendChild(contentContainer); newTr.appendChild(newTd); newTbody.appendChild(newTr);
                tbodyRef.after(newTbody);
                const spacerTbody = document.createElement('tbody'); spacerTbody.innerHTML = `<tr><td colspan="5" style="height: 20px; border: 0; background-color: transparent;"></td></tr>`; newTbody.after(spacerTbody);

                const setHover = (hover) => { titleTr.style.backgroundColor = newTr.style.backgroundColor = hover ? currentTheme.backgroundHover : currentTheme.background; titleTr.style.boxShadow = newTd.style.boxShadow = hover ? `${currentTheme.shadow}, 0 0 20px rgba(0,0,0,0.05)` : `${currentTheme.shadow}, 0 1px 0 ${currentTheme.border}`; };
                tbodyRef.addEventListener('mouseover', () => setHover(true)); tbodyRef.addEventListener('mouseout', () => setHover(false));
                newTbody.addEventListener('mouseover', () => setHover(true)); newTbody.addEventListener('mouseout', () => setHover(false));
            } catch (e) { console.error(`处理帖子 ${threadURL} 出错:`, e); }
        }

        async function displayInitialThreads() {
            const postLinks = document.querySelectorAll("#threadlisttableid .s.xst");
            const fetchPromises = Array.from(postLinks).map((link, index) => {
                const titleCell = link.closest('th, td');
                if (titleCell?.querySelector('em a')?.textContent.includes('版务管理')) return Promise.resolve();
                return processSingleThread(link, index);
            });
            await Promise.all(fetchPromises);
        }

        function enableNormalPageInfiniteScroll() {
            if (scrollHandler) return;
            const pagination = document.querySelector('.pg a.nxt');
            if (pagination) { nextUrl = pagination.href; } else { return; }
            if (!loadingIndicator) {
                loadingIndicator = document.createElement('div'); loadingIndicator.textContent = '正在加载更多内容...'; loadingIndicator.style.cssText = 'text-align: center; padding: 20px; display: none;';
                document.querySelector('#threadlist')?.insertAdjacentElement('afterend', loadingIndicator);
            }
            scrollHandler = async () => {
                if (isLoading || !nextUrl) return;
                if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 500) {
                    isLoading = true; loadingIndicator.style.display = 'block';
                    try {
                        const response = await fetchWithTimeout(nextUrl);
                        const htmlText = await response.text();
                        const doc = new DOMParser().parseFromString(htmlText, "text/html");
                        const mainTable = document.querySelector('table#threadlisttableid');
                        const newTbodyItems = doc.querySelectorAll('table#threadlisttableid > tbody[id^=normalthread_]');
                        if (newTbodyItems.length > 0 && mainTable) {
                            const fragment = document.createDocumentFragment();
                            newTbodyItems.forEach(tbody => fragment.appendChild(tbody));
                            mainTable.appendChild(fragment);
                            const newLinks = Array.from(mainTable.querySelectorAll('tbody[id^=normalthread_]:not(.processed) a.s.xst'));
                            const numExisting = mainTable.querySelectorAll('.processed').length;
                            await Promise.all(newLinks.map((link, index) => {
                                const tbody = link.closest('tbody');
                                tbody.classList.add('processed');
                                if (tbody.querySelector('em a')?.textContent.includes('版务管理')) return Promise.resolve();
                                return processSingleThread(link, numExisting + index);
                            }));
                        }
                        const newPg = doc.querySelector('.pg'); const oldPg = document.querySelector('.pg'); if (oldPg && newPg) oldPg.replaceWith(newPg);
                        const nextLink = document.querySelector('.pg a.nxt');
                        nextUrl = nextLink ? nextLink.href : '';
                        if (!nextUrl) loadingIndicator.textContent = '已加载全部内容';
                    } catch (e) { console.error("普通页面翻页失败:", e); loadingIndicator.textContent = '加载失败'; }
                    finally { isLoading = false; if (nextUrl) loadingIndicator.style.display = 'none'; updateAndSaveForumState(); }
                }
            };
            window.addEventListener('scroll', scrollHandler, { passive: true });
            updateAndSaveForumState();
        }

        function disableNormalPageInfiniteScroll() {
            if (scrollHandler) window.removeEventListener('scroll', scrollHandler); scrollHandler = null;
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            // 恢复按钮状态刷新
            updateAndSaveForumState();
            const currentPage = parseInt(document.querySelector('.pg strong')?.textContent || '1', 10);
            if (!isNaN(currentPage)) { const url = new URL(window.location.href); url.searchParams.set('page', currentPage); window.location.href = url.toString(); }
            else { window.location.reload(); }
        }

        createPageNumElement();
        displayInitialThreads();

        // 版面恢复按钮
        const savedForumState = JSON.parse(localStorage.getItem('lastForumState'));
        const currentSectionLink = document.querySelector('#pt .z a:last-of-type');
        const currentSectionName = currentSectionLink?.textContent;
        const currentPageNum = parseInt(new URLSearchParams(window.location.search).get('page') || window.location.pathname.match(/-(\d+)\.html$/)?.[1] || '1', 10);

        if (savedForumState && savedForumState.sectionName && savedForumState.urlTemplate) {
            const isSameSection = savedForumState.sectionName === currentSectionName;
            const isNewerPageSaved = parseInt(savedForumState.page, 10) > currentPageNum;

            if (!isSameSection || (isSameSection && isNewerPageSaved)) {
                const labelHtml = `<span style="writing-mode: vertical-rl; text-orientation: mixed; font-size: 11px; color: white; letter-spacing: 2px;">恢复: ${savedForumState.sectionName} (${savedForumState.page})</span>`;
                window.activeRestoreButton = createFixedRestoreButton({
                    id: 'restore-forum-btn',
                    labelHtml: labelHtml,
                    onClick: () => {
                        const targetUrl = savedForumState.urlTemplate.replace('__PAGE__', savedForumState.page);
                        window.location.href = targetUrl;
                    }
                });
            }
        }

        createNormalPageToggle({
            storageKeyEnabled: 'normalPageInfiniteScroll',
            onEnable: enableNormalPageInfiniteScroll,
            onDisable: disableNormalPageInfiniteScroll,
            defaultEnabled: false
        });
        window.addEventListener('scroll', updateAndSaveForumState, { passive: true });
        window.addEventListener('resize', updateAndSaveForumState, { passive: true });
        const scrollTopEl = document.getElementById('scrolltop');
        if (scrollTopEl) {
            new MutationObserver(updateAndSaveForumState).observe(scrollTopEl, { attributes: true, attributeFilter: ['style', 'class'] });
        }
    }

// --- 搜索列表页 ---
function applyStickyLayout() {
    const ct = document.getElementById('ct');
    if (!ct) return;

    const topBar = document.getElementById('toptb');
    const searchForm = ct.querySelector('form.searchform');
    const tl = ct.querySelector('.tl');
    if (!tl) return;
    const resultTitle = tl.querySelector('.sttl');
    const threadList = tl.querySelector('#threadlist');
    const pagination = tl.querySelector('.pgs');
    const footer = document.getElementById('ft');

    if (!threadList) {
        console.log('Threadlist not found, sticky layout aborted.');
        return;
    }

    // Remove the original footer text
    if (footer) {
        footer.remove();
    }

    const topGroup = document.createElement('div');
    if (topBar) topGroup.appendChild(topBar);
    if (searchForm) topGroup.appendChild(searchForm);
    if (resultTitle) topGroup.appendChild(resultTitle);

    const middleGroup = document.createElement('div');
    middleGroup.id = 'sticky-scroll-container';
    middleGroup.appendChild(threadList);

    const bottomGroup = document.createElement('div');
    if (pagination) {
        bottomGroup.appendChild(pagination);
    }

    ct.innerHTML = '';
    ct.appendChild(topGroup);
    ct.appendChild(middleGroup);
    ct.appendChild(bottomGroup);

    const style = document.createElement('style');
    style.textContent = `
        html, body {
            height: 100%;
            overflow: hidden;
            margin: 0;
        }
        #ct {
            height: 100% !important;
            display: flex;
            flex-direction: column;
        }
        #ct > div:nth-child(1) { /* topGroup */
            flex-shrink: 0;
            overflow: hidden;
        }
        #sticky-scroll-container { /* middleGroup */
            flex-grow: 1;
            overflow-y: auto;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
        }
        #ct > div:nth-child(3) { /* bottomGroup */
            flex-shrink: 0;
            padding: 10px 0;
            background-color: #fff;
            border-top: 1px solid #e0e0e0;
        }
        .pgs.cl {
            margin-bottom: 0 !important;
        }
        .tl {
            width: 100% !important;
            max-width: none !important;
            padding: 0 20px !important;
            box-sizing: border-box !important;
        }
        #threadlist {
            width: 100% !important;
            max-width: none !important;
        }
        #threadlist > ul {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .pbw {
            width: 100% !important;
            max-width: none !important;
            box-sizing: border-box !important;
            margin: 25px 0 !important;
        }
    `;
    document.head.appendChild(style);
}

function initializeSearchPage() {
    applyStickyLayout();
    let scrollHandler = null, isLoading = false, nextPageUrl = '';

        function updateAndSaveSearchState() {
            // 存储搜索状态用于恢复
            const keyword = document.querySelector('.sttl .emfont')?.textContent;
            if (keyword) {
                let currentPageNum = '1';
                const strongPage = document.querySelector('.pg strong');
                if (strongPage) {
                    currentPageNum = strongPage.textContent;
                } else if (!document.querySelector('.pg a.nxt')) {
                    const pageMatch = window.location.href.match(/[?&]page=(\d+)/);
                    if(pageMatch) currentPageNum = pageMatch[1];
                }

                const searchParams = new URLSearchParams(window.location.search);
                searchParams.delete('page');
                const baseUrl = window.location.pathname + '?' + searchParams.toString();

                localStorage.setItem('lastSearchState', JSON.stringify({
                    keyword: keyword,
                    page: currentPageNum,
                    baseUrl: baseUrl
                }));
            }
        }

        async function displaySearchPreviews(container) {
            const postLinks = container.querySelectorAll(".xs3 a");
            const validLinks = Array.from(postLinks).filter(link => link.href && link.href.includes('thread') && link.closest('.pbw'));

            const fetchPromises = validLinks.map(async (link) => {
                try {
                    const threadURL = link.href;
                    const pbwContainer = link.closest('.pbw');
                    if (!pbwContainer || pbwContainer.querySelector('.searchImagePreview')) return;

                    const response = await fetchWithTimeout(threadURL);
                    const pageContent = await response.text();
                    const doc = new DOMParser().parseFromString(pageContent, "text/html");

                    const { images: imgElements, links: downloadLinks } = extractPostPreviewData(doc);
                    if (imgElements.length === 0 && !downloadLinks.magnet.length) return;

                    pbwContainer.innerHTML = '';
                    pbwContainer.style.cssText = `position: relative; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin: 25px 20px; background-color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: all 0.3s ease; width: calc(100% - 40px); box-sizing: border-box;`;

                    const titleElement = link.cloneNode(true);
                    titleElement.style.cssText = 'font-size: 18px; font-weight: bold; color: #333; display: block; text-decoration: none; margin-bottom: 15px;';
                    pbwContainer.appendChild(titleElement);

                    if (imgElements.length > 0) {
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "searchImagePreview";
                        imgContainer.style.cssText = "display: flex; flex-wrap: nowrap; justify-content: space-between; width: 100%; gap: 10px;";
                        const imgWidth = `calc(${100 / imgElements.length}% - 10px)`;
                        imgElements.forEach(imgEl => {
                            const imgSrc = imgEl.getAttribute("file");
                            const imgWrapper = document.createElement("div");
                            imgWrapper.style.cssText = `width: ${imgWidth}; height: 220px; overflow: hidden; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); position: relative; cursor: pointer;`;
                            const img = document.createElement("img");
                            img.src = imgSrc;
                            img.style.cssText = "width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;";
                            imgWrapper.addEventListener('mouseover', () => img.style.transform = "scale(1.05)");
                            imgWrapper.addEventListener('mouseout', () => img.style.transform = "scale(1)");
                            imgWrapper.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.open(threadURL, '_blank'); });
                            imgWrapper.appendChild(img);
                            imgContainer.appendChild(imgWrapper);
                        });
                        pbwContainer.appendChild(imgContainer);
                    }

                    const linksElement = createLinksElement(downloadLinks, threadURL);
                    if (linksElement) pbwContainer.appendChild(linksElement);

                    pbwContainer.addEventListener('mouseover', () => { pbwContainer.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; pbwContainer.style.transform = 'translateY(-3px)'; });
                    pbwContainer.addEventListener('mouseout', () => { pbwContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; pbwContainer.style.transform = 'translateY(0)'; });
                } catch (e) { console.error(`处理帖子 ${link.href} 失败:`, e); }
            });
            await Promise.all(fetchPromises);
        }

        async function processSearchContainer(container) {
            container.querySelectorAll(".pbw").forEach(item => { if (item.querySelector('.xi1')?.textContent.includes('版务管理')) item.remove(); });
            await displaySearchPreviews(container);
            return container.children.length > 0;
        }

        async function loadNext() {
            if (isLoading || !nextPageUrl) return;
            isLoading = true;
            const loadingIndicator = document.getElementById('search-loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
                loadingIndicator.textContent = '正在加载...';
            }

            try {
                const response = await fetchWithTimeout(nextPageUrl);
                const htmlText = await response.text();
                const doc = new DOMParser().parseFromString(htmlText, "text/html");

                const mainList = document.querySelector('#threadlist > ul');
                const newItemsContainer = doc.querySelector('#threadlist > ul');

                if (newItemsContainer && newItemsContainer.children.length > 0 && mainList) {
                    await processSearchContainer(newItemsContainer);
                    mainList.append(...newItemsContainer.children);
                }

                const newPg = doc.querySelector('.pg');
                const oldPg = document.querySelector('.pg');
                if (oldPg && newPg) {
                    oldPg.replaceWith(newPg);
                } else if (!oldPg && newPg) {
                    document.querySelector('.tl')?.appendChild(newPg);
                }

                const nextLink = document.querySelector('.pg a.nxt');
                nextPageUrl = nextLink ? nextLink.href : '';
                updateAndSaveSearchState();
            } catch (e) {
                console.error("搜索页面翻页失败:", e);
                if (loadingIndicator) {
                    loadingIndicator.textContent = '加载失败';
                }
                nextPageUrl = ''; // 失败时停止
            } finally {
                isLoading = false;
                if (loadingIndicator) {
                    if (nextPageUrl) {
                        loadingIndicator.style.display = 'none';
                    } else {
                        loadingIndicator.textContent = '已加载全部内容';
                    }
                }
            }
        }

        function enableSearchPageInfiniteScroll() {
            if (scrollHandler) return;
            const scrollContainer = document.getElementById('sticky-scroll-container');
            if (!scrollContainer) {
                console.error("Sticky layout scroll container not found. Infinite scroll will not work.");
                return;
            }

            scrollHandler = () => {
                if (isLoading || !nextPageUrl) return;
                // 预留一屏的高度作为触发加载的缓冲区
                const triggerMargin = scrollContainer.clientHeight;
                if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - triggerMargin) {
                    loadNext();
                }
            };
            scrollContainer.addEventListener('scroll', scrollHandler, { passive: true });
            updateAndSaveSearchState();
        }

        function disableSearchPageInfiniteScroll() {
            if (scrollHandler) {
                const scrollContainer = document.getElementById('sticky-scroll-container');
                if (scrollContainer) {
                    scrollContainer.removeEventListener('scroll', scrollHandler);
                }
                scrollHandler = null;
            }
            const loadingIndicator = document.getElementById('search-loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            // 跳转到当前页码对应的页面
            updateAndSaveSearchState();
            const currentPage = parseInt(document.querySelector('.pg strong')?.textContent || '1', 10);
            if (!isNaN(currentPage)) {
                const url = new URL(window.location.href);
                url.searchParams.set('page', currentPage);
                window.location.href = url.toString();
            } else {
                window.location.reload();
            }
        }

        const initialContainer = document.querySelector('#threadlist > ul');
        if (!initialContainer) return;

        // 搜索恢复按钮
        const savedSearch = JSON.parse(localStorage.getItem('lastSearchState'));
        const currentKeyword = document.querySelector('.sttl .emfont')?.textContent;
        const currentPageNum = parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10);

        if (savedSearch && savedSearch.keyword) {
            const isSameSearch = savedSearch.keyword === currentKeyword;
            const isNewerPageSaved = parseInt(savedSearch.page, 10) > currentPageNum;

            if (!isSameSearch || (isSameSearch && isNewerPageSaved)) {
                 const labelHtml = `<span style="writing-mode: vertical-rl; text-orientation: mixed; font-size: 11px; color: white; letter-spacing: 2px;">恢复: ${savedSearch.keyword} (${savedSearch.page})</span>`;
                window.activeRestoreButton = createFixedRestoreButton({
                    id: 'restore-search-btn',
                    labelHtml: labelHtml,
                    onClick: () => {
                        window.location.href = `${savedSearch.baseUrl}&page=${savedSearch.page}`;
                    }
                });
            }
        }

        // 先初始化分页信息和加载指示器
        const pagination = document.querySelector('.pg');
        if (pagination?.querySelector('a.nxt')) {
            nextPageUrl = pagination.querySelector('a.nxt').href;
        }

        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'search-loading-indicator';
        loadingIndicator.style.cssText = 'text-align: center; padding: 20px; display: none;';
        document.getElementById('sticky-scroll-container')?.appendChild(loadingIndicator);

        // 创建切换按钮
        createSearchPageToggle({
            storageKeyEnabled: 'searchPageInfiniteScroll',
            onEnable: () => {
                enableSearchPageInfiniteScroll();
                const scrollContainer = document.getElementById('sticky-scroll-container');
                if (!scrollContainer) return;

                // After enabling, wait for images to load, then check if content is too short.
                waitForImages(scrollContainer).then(() => {
                    if (scrollContainer.scrollHeight <= scrollContainer.clientHeight && nextPageUrl) {
                        loadNext();
                    }
                });
            },
            onDisable: disableSearchPageInfiniteScroll
        });

        // 处理初始容器内容
        processSearchContainer(initialContainer);
    }

    // --- 脚本入口 ---
    window.addEventListener('load', () => {
        try {
            if (window.location.href.includes('search.php')) {
                initializeSearchPage();
            } else {
                initializeNormalPage();
            }
        } catch (error) {
            console.error("脚本执行错误:", error);
        }
    });
})();