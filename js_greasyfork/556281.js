// ==UserScript==
// @name         Grok 收藏批量下载
// @namespace    https://greasyfork.org/zh-CN/users/309232-3989364
// @version      2025-11-20-1
// @description  批量下载 Grok imagine 的收藏视频和图片，支持记录已下载文件避免重复
// @description:en Batch download videos and images from Grok 'imagine' collections, supporting history tracking to prevent duplicate downloads
// @author       ctrn43062
// @match        https://grok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556281/Grok%20%E6%94%B6%E8%97%8F%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/556281/Grok%20%E6%94%B6%E8%97%8F%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function createDownloadPanel(onDownloadCallback) {
    // 1. 常量与工具
    const MIN_DATE = '2025-09-01';
    // 获取当前日期并格式化为 YYYY-MM-DD (本地时间)
    const getTodayStr = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    ;
    const MAX_DATE = getTodayStr();

    // 2. 创建容器 Panel
    const panel = document.createElement('div');
    panel.style.cssText = `
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        background-color: #f9f9f9;
        font-family: sans-serif;
        display: inline-flex;
        flex-direction: column;
        gap: 15px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        max-width: 400px;
        position: fixed;
        left: 5rem;
        top: 3rem;
        opacity: 0.9;
    `;

    // 3. 创建日期行 (Row 1)
    const dateRow = document.createElement('div');
    dateRow.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap; align-items: center;';

    const createDateInput = (labelText, id) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';

        const label = document.createElement('label');
        label.innerText = labelText;
        label.style.fontSize = '12px';
        label.style.marginBottom = '4px';

        const input = document.createElement('input');
        input.type = 'date';
        input.min = MIN_DATE;
        input.max = MAX_DATE;
        input.value = MAX_DATE;
        // 默认为今天
        input.style.padding = '5px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #ddd';

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return {
            wrapper,
            input
        };
    }
    ;

    const startDateObj = createDateInput('Start Date', 'start-date');
    const endDateObj = createDateInput('End Date', 'end-date');

    dateRow.appendChild(startDateObj.wrapper);
    dateRow.appendChild(endDateObj.wrapper);

    // 4. 创建 Checkbox 行 (Row 2 - 换行后)
    const checkRow = document.createElement('div');
    checkRow.style.cssText = 'display: flex; gap: 20px; align-items: center;';

    const createCheckbox = (labelText, defaultChecked) => {
        const label = document.createElement('label');
        label.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = defaultChecked;

        const span = document.createElement('span');
        span.innerText = labelText;

        label.appendChild(input);
        label.appendChild(span);
        return {
            label,
            input
        };
    }
    ;

    const videoCheckObj = createCheckbox('Video', true);
    const imageCheckObj = createCheckbox('Image', true);
    const urlOnlyCheckObj = createCheckbox('URL Only', false);

    checkRow.appendChild(videoCheckObj.label);
    checkRow.appendChild(imageCheckObj.label);
    // checkRow.appendChild(urlOnlyCheckObj.label);

    // 5. 创建按钮行 (Row 3 - 换行后)
    const btnRow = document.createElement('div');
    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = 'Download';
    downloadBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    `;
    downloadBtn.onmouseover = () => downloadBtn.style.backgroundColor = '#0056b3';
    downloadBtn.onmouseout = () => downloadBtn.style.backgroundColor = '#007bff';

    btnRow.appendChild(downloadBtn);

    // 6. 组装 DOM
    panel.appendChild(dateRow);
    panel.appendChild(checkRow);
    // 自然换行
    panel.appendChild(btnRow);
    // 自然换行

    // 7. 逻辑验证与回调处理
    const validateDates = () => {
        const start = startDateObj.input.value;
        const end = endDateObj.input.value;

        if (!start || !end) {
            alert("请选择完整的日期范围。");
            return false;
        }
        if (start < MIN_DATE) {
            alert(`开始日期不能早于 ${MIN_DATE}`);
            return false;
        }
        if (end > MAX_DATE) {
            alert("结束日期不能超过今天。");
            return false;
        }
        if (start > end) {
            alert("开始日期不能晚于结束日期。");
            return false;
        }
        return true;
    }
    ;

    // 监听输入框变动，辅助修正（可选 UX 优化：自动限制范围）
    startDateObj.input.addEventListener('change', (e) => {
        endDateObj.input.min = e.target.value;
        // 结束日期不能早于开始日期
    }
                                       );

    const panelManager = {
        panel,
        isShow: false,
        show() {
            downloadBtn.innerText = 'Download'
            this.panel.style.display = 'block'
            this.isShow = true
        },
        hide() {
            this.panel.style.display = 'none'
            this.isShow = false
        },
        toggle() {
            this.isShow ? this.hide() : this.show()
        },
        init() {
            document.body.appendChild(this.panel);

            downloadBtn.onclick = () => {
                if (!validateDates()) {
                    return;
                }

                const data = {
                    startDate: new Date(new Date(startDateObj.input.value).setHours(0, 0, 0, 0)),
                    endDate: new Date(new Date(endDateObj.input.value).setHours(0, 0, 0, 0)),
                    includeVideo: videoCheckObj.input.checked,
                    includeImage: imageCheckObj.input.checked,
                    urlOnly: urlOnlyCheckObj.checked,
                };

                // 执行用户回调
                if (typeof onDownloadCallback === 'function') {
                    onDownloadCallback(data, this);
                } else {
                    console.warn('No callback provided');
                }
            }
        },
        destory() {
            this.panel.remove()
        },
        updateStatus(msg) {
            downloadBtn.innerText = msg
        }
    };

    panelManager.hide()

    return panelManager
}

async function get_media_list(cursor) {
    const body = {
        "limit": 100,
        "filter": {
            // 仅获取点赞的视频
            "source": "MEDIA_POST_SOURCE_LIKED"
        },
        cursor
    }

    const resp = await fetch("https://grok.com/rest/media/post/list", {
        "referrer": "https://grok.com/imagine",
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    const data = await resp.json()

    return data
}

function downloadFile(filename, blob) {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
}

async function downloadFileFromURL(filename, url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`下载失败，HTTP 状态码: ${response.status} ${response.statusText}`);
        }

        downloadFile(filename, await response.blob())
    } catch (err) {
        console.error('下载文件出错：', err);
        throw err;
    }
}

const DownloadRecordStore = {
    key: 'GROK_DOWNLOAD_FILES',
    urls: null,
    add(url) {
        if(!this.has(url)) {
            this.urls.push(url)
            localStorage.setItem(this.key, JSON.stringify(this.urls))
        }
    },
    load() {
        this.urls = JSON.parse(localStorage.getItem(this.key) || '[]')
    },
    has(url) {
        if(this.urls == null) {
            this.load()
        }

        return this.urls.indexOf(url) > -1
    }
}

const handleDownloadMedias = async (mediaList, {includeImage, includeVideo}) => {
    const imageList = []
    const downloadedFileUrls = []

    for (const media of mediaList) {
        const {mimeType: type, mediaUrl: url} = media
        if (includeImage && type.startsWith('image')) {
            imageList.push(url)
        } else {
            if(!includeVideo) {
                continue
            }

            // https://assets.grok.com/users/xxx/generated/xxx/generated_video.mp4
            const filename = url.split('/').slice(-2)[0]
            const ext = type.split('/')[1]
            try {
                await downloadFileFromURL(`${filename}.${ext}`, url)
                downloadedFileUrls.push(url)
            } catch (e) {}
        }
    }

    const imageUrls = imageList.join('\n\n')

    if(imageUrls) {
        downloadFile('grok-images.txt', new Blob([imageUrls], {type: 'plain/text'}))
    }

    return [...downloadedFileUrls]
}

const handleDownloadBtnClick = async (options, panel) => {
    console.log("执行下载操作...");
    console.log("开始日期:", options.startDate);
    console.log("结束日期:", options.endDate);
    console.log("包含视频:", options.includeVideo);
    console.log("包含图片:", options.includeImage);
    console.log(`下载请求已发送!\n范围: ${options.startDate} 至 ${options.endDate}\n内容: [Video: ${options.includeVideo}] [Image: ${options.includeImage}]`);

    const flattenMediaList = (_data) => {
        const mediaList = []

        const helper = (data) => {
            for (const item of data) {
                const childPosts = [...item.childPosts]
                delete item.childPosts

                mediaList.push(item)

                helper(childPosts)
            }
        }

        helper(_data)

        return mediaList
    }

    const filterMediaListByDate = (mediaList, startDate, endDate) => {
        return mediaList.filter( ({createTime}) => {
            const time = new Date(createTime)
            const date = time.setHours(0, 0, 0, 0)
            return date >= startDate && date <= endDate
        }
                               )
    }

    let cursor, posts, mediaList = []

    do {
        ({posts, nextCursor: cursor} = await get_media_list(cursor));
        const {startDate, endDate} = options

        const filteredPosts = filterMediaListByDate(flattenMediaList(posts), startDate, endDate)

        if (!filteredPosts.length) {
            break
        }

        mediaList.push(...filteredPosts)
        panel.updateStatus(`Fetching media list`)
    } while (posts && posts.length && cursor)
        panel.updateStatus(`Downloading`)
    // 排除已下载文件

    const downloadedFileUrls = await handleDownloadMedias(
        mediaList.filter(({mediaUrl}) => !DownloadRecordStore.has(mediaUrl)),
        options
    )

    downloadedFileUrls.forEach((url) => {
        DownloadRecordStore.add(url)
    })

    panel.updateStatus(`Done`)
};


/**
 * 等待指定元素在 DOM 中出现
 * @param {string} selector - CSS 选择器
 * @param {number} [timeout=0] - 超时时间 (毫秒)，0 表示无限等待
 * @returns {Promise<HTMLElement>}
 */
function waitForElement(selector, timeout = 0) {
    return new Promise((resolve, reject) => {
        // 1. 如果元素已经存在，直接返回
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        // 2. 定义观察者
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
                observer.disconnect(); // 找到后停止观察，释放资源
            }
        });

        // 3. 开始监听 document.body 的子节点变化
        observer.observe(document.body, {
            childList: true, // 监听子节点增加/删除
            subtree: true    // 监听所有后代节点，不仅仅是直接子节点
        });

        // 4. (可选) 超时处理
        if (timeout > 0) {
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: Element '${selector}' not found within ${timeout}ms`));
            }, timeout);
        }
    });
}

const createDownloadIcon = () => {
    const button = document.createElement('i')
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`
    button.classList.add('grok-download-icon')
    Object.assign(button.style, {
        display: 'inline-block',
        margin: '12px 0 0 5px'
    })
    return button
}

/**
 * 监听 SPA URL 变化的通用方案
 * @param {Function} callback - URL 发生变化时的回调函数
 */
function onUrlChange(callback) {
    // 1. 监听浏览器的后退/前进 (原生支持)
    window.addEventListener('popstate', () => {
        callback(location.href);
    });

    // 2. 拦截 pushState (常规路由跳转)
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        // 执行原有的 pushState
        originalPushState.apply(this, args);
        // 触发回调
        callback(location.href);
    };

    // 3. 拦截 replaceState (路由替换，不留历史记录)
    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        callback(location.href);
    };
}

async function nextTick() {}

(async function() {
    'use strict';

    const dlPanel = createDownloadPanel(handleDownloadBtnClick);
    dlPanel.init()

    // 初始化下载面板
    onUrlChange(async (currentUrl) => {
        dlPanel.hide()

        if(!currentUrl.includes('/imagine/favorites')) {
            return
        }

        await nextTick()

        const mountEl = await waitForElement('div > h1')
        const icon = createDownloadIcon()

        if(mountEl.querySelector('.grok-download-icon')) {
            return
        }

        mountEl.appendChild(icon)
        mountEl.addEventListener('click', (e) => {
            dlPanel.toggle()
        })
    })
})();