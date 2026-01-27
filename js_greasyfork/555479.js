// ==UserScript==
// @name         观众转种助手
// @namespace    http://tampermonkey.net/
// @version      3.8.10
// @description  观众脚本，转种使用
// @match        https://*/upload.php*
// @match        https://*/edit.php*
// @match        https://*/details.php*
// @match        https://kp.m-team.cc/upload*
// @match        https://kp.m-team.cc/detail*
// @match        https://totheglory.im/t/*
// @match        https://movie.douban.com/subject/*
// @author       Ralph
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @connect      *
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555479/%E8%A7%82%E4%BC%97%E8%BD%AC%E7%A7%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555479/%E8%A7%82%E4%BC%97%E8%BD%AC%E7%A7%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// ========== 常量定义 ==========
const Z_INDEX = 10000;
const DELAY_MS = 500;
const TIMEOUT_MS = 30000;
const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const CONCURRENCY = 2;
const DELAY_MIN = 400;
const DELAY_MAX = 900;

// API 域名配置
const API_BASE_URL = "https://20201206.xyz:12848";
const PIXHOST_API_URL = "https://api.pixhost.to/images";

// 站点映射
const SITE_MAP = {
    "家园": "HDHome",
    "春天": "CMCT",
    "彩虹岛": "CHDBits",
    "杜比": "HDDolby",
    "天空": "HDSky",
    "馒头": "MTeam",
    "我堡": "OurBits",
    "猫站": "PTer",
    "青蛙": "QingWa",
    "北洋": "TJUPT",
    "听听歌": "TTG",
    "麒麟": "麒麟"
};

// 图片黑名单
const BLACKLIST_URLS = [
    "https://img93.pixhost.to/images/86/435614074_c5134549f13c2c087d67c9fa4089c49e-removebg-preview.png",
    "https://pic.imgdb.cn/item/6170004c2ab3f51d91c7782a.png"
];

// 正则表达式常量
const REGEX_IMG_BBCODE = /\[img\](.*?)\[\/img\]/gi;
const REGEX_MEDIAINFO_REPLACE = /\[quote\]\[b\]\[color=royalblue\][\s\S]*?\[\/font\]\[\/quote\]\[font=Courier\]/g;
const REGEX_FIRST_IMG = /\[img\][\s\S]*?\[\/img\]/i;
const REGEX_HTTP_URL = /^https?:\/\//i;

// 按钮样式常量
const BUTTON_STYLES = {
    // 固定位置主按钮（绿色渐变）
    fixedPrimary: {
        base: `
            position: fixed;
            background: linear-gradient(135deg, #43cea2, #185a9d);
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: ${Z_INDEX};
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        `,
        hover: `
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(0,0,0,0.4);
        `
    },
    // 固定位置次按钮（紫色渐变）
    fixedSecondary: {
        base: `
            position: fixed;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: ${Z_INDEX};
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        `,
        hover: `
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(0,0,0,0.4);
        `
    },
    // 标签按钮样式
    tag: {
        base: `
            display: inline-block;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 13px;
            transition: all 0.2s ease;
            cursor: pointer;
            border: none;
        `,
        hover: `
            transform: scale(1.05);
            opacity: 0.9;
        `
    },
    // TMDB 查询按钮
    tmdb: {
        base: `
            margin-left: 8px;
            padding: 5px 10px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
        `,
        hover: `
            background: #2563eb;
            transform: scale(1.05);
        `
    }
};

// 背景渐变常量
const GRADIENT_PRIMARY = "linear-gradient(135deg, #43cea2, #185a9d)";
const GRADIENT_SECONDARY = "linear-gradient(135deg, #667eea, #764ba2)";
const GRADIENT_HOVER = "#ddd";

// ========== 工具函数 ==========
/**
 * 统一错误处理函数
 * @param {Error|string} error - 错误对象或错误消息
 * @param {string} context - 错误上下文
 */
function handleError(error, context) {
    const message = error?.message || error?.msg || String(error);
    console.error(`❌ ${context}:`, message);
    GM_notification({
        title: context,
        text: message,
        timeout: 2000,
        highlight: true
    });
}

/**
 * HTML 转义函数，防止 XSS
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

(function() {
    'use strict';
    const url = location.href;
    if (/upload\.php/i.test(url) || /edit\.php/i.test(url)) {
        // 上传图片
        uploadPixhost()
        // 右侧发布按钮
        uploadButton()
    }
    else if (/details\.php/i.test(url) || url.startsWith("https://kp.m-team.cc/detail") || url.startsWith("https://kp.m-team.cc/upload") || url.startsWith("https://totheglory.im/t")){
        // 增加自动上传信息到管理平台
        syncTorrentManage()
    }

    // SSD清理附加信息
    if (url.startsWith("https://springsunday.net/upload.php")){
        clearSSD()
    }

    // 为杜比添加tmdb查询跳转
    if(url.startsWith("https://www.hddolby.com/upload.php")){
        addJumpTmdb()
    }
    // 观众种子详情页面
    if (url.startsWith("https://audiences.me/details.php")){
        // 获取种子id
        const audiUrl = new URL(url);
        const id = audiUrl.searchParams.get('id');
        if (id) {
            GM_setValue("AudiId", id);
            const audiInput = document.querySelector("#audi-torrent-id");
            if (audiInput) {
                audiInput.value = id;
            }
        }
    }
    if (url.startsWith("https://movie.douban.com/")){
        getDoubanPic()
    }
})();

/**
 * 创建按钮并应用样式和事件
 * @param {HTMLElement} element - 按钮元素
 * @param {Object} styleConfig - 样式配置对象
 * @param {string} position - 位置样式（top, right, bottom, left）
 */
function applyButtonStyle(element, styleConfig, position = '') {
    element.style.cssText = styleConfig.base + position;
    element.addEventListener('mouseenter', () => {
        element.style.cssText = styleConfig.base + styleConfig.hover + position;
    });
    element.addEventListener('mouseleave', () => {
        element.style.cssText = styleConfig.base + position;
    });
}

function uploadButton(){
    const button = document.createElement('button');
    button.textContent = '🧩 发布';
    applyButtonStyle(button, BUTTON_STYLES.fixedPrimary, `
        top: 120px;
        right: 20px;
    `);
    // 给新按钮绑定事件
    button.addEventListener('click', (e) => {
        const submitButton = document.querySelector("input#qr[type='submit']");
        const ttgSubmitButton = document.querySelector("input.btn[type='submit']");
        if (submitButton){
            submitButton.click();
        } else if (ttgSubmitButton){
            ttgSubmitButton.click();
        }
    });
    document.body.appendChild(button);
}

function clearSSD() {
    const clearBtn = document.querySelector('input#qr');
    if (clearBtn) {
        // 创建新按钮
        const newBtn = document.createElement('button');
        newBtn.textContent = '修改附加信息';
        newBtn.id = 'my-new-button';
        newBtn.type = "button";
        newBtn.style.marginRight = '8px'; // 看起来更美观

        // 插入到 clear 按钮左侧
        clearBtn.parentNode.insertBefore(newBtn, clearBtn);
        // 给新按钮绑定事件
        newBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认提交行为
            e.stopPropagation(); // 阻止冒泡（可选）
            const extMessage = document.querySelector("textarea[dir='ltr']");
            if (extMessage) {
                extMessage.value = extMessage.value.replace(/\[img\].*$/s, "");
            }
        });
    }
}

async function getClipboardContent() {
  try {
    const text = await navigator.clipboard.readText();// 获取文本内容
    return text || null; // 明确返回 null 而不是 undefined
  } catch (err) {
    console.error("无法读取剪贴板内容：", err);
    return null; // 返回 null 表示失败
  }
}

function addJumpTmdb(){
    const input = document.querySelector("input[name='small_descr']");
    if (!input) return;

    const btn = document.createElement("button");
    btn.textContent = "🔍 TMDB 查询";
    btn.id = "tmdb-search";
    btn.style.cssText = BUTTON_STYLES.tmdb.base;
    btn.addEventListener('mouseenter', () => {
        btn.style.cssText = BUTTON_STYLES.tmdb.base + BUTTON_STYLES.tmdb.hover;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.cssText = BUTTON_STYLES.tmdb.base;
    });

    // 点击事件：获取输入框值并打开 TMDB 搜索页
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const keyword = input.value.split("|")[0].trim();
        if (!keyword) {
            alert("请输入内容后再搜索 TMDB！");
            return;
        }

        // TMDB 搜索 URL，可以替换为中文站或 API
        const url = `https://www.themoviedb.org/search?query=${encodeURIComponent(keyword)}`;
        window.open(url, "_blank");
    });

    // 把按钮插入到输入框后面
    input.insertAdjacentElement("afterend", btn);
}

// 增加自动上传信息到管理平台
function syncTorrentManage(){
    /** 固定入口按钮 **/
    function createButton() {
        const params = new URLSearchParams(window.location.search);
        const audiId = params.get("audi_id");
        let torrent_id = GM_getValue("AudiId")
        if (audiId) {
            torrent_id = audiId
            GM_setValue("AudiId", audiId)
        }
        showTodoSite(torrent_id)

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '观众种子ID';
        input.id = 'audi-torrent-id';
        input.value = torrent_id
        input.style.cssText = `
            position: fixed;
            top: 86px;
            right: 20px;
            width: 90px;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
        `;
        document.body.appendChild(input);

        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '🧩 自动辅种';
        applyButtonStyle(button, BUTTON_STYLES.fixedPrimary, `
            top: 120px;
            right: 20px;
        `);
        button.addEventListener('click', () => {
            // 馒头单独处理
            if (location.href.startsWith("https://kp.m-team.cc/detail")){
                document.querySelector("span.anticon-copy").click();
                setTimeout(async () => {
                    try {
                        const text = await navigator.clipboard.readText();
                        if (text && text !== ''){
                            console.log(text);
                            const modifiedText = text.replace("api2.m-team.cc", "api.m-team.cc");
                            showInputDialog(modifiedText);
                        } else {
                            handleError("剪贴板内容读取为空", "读取剪贴板内容");
                        }
                    } catch (err) {
                        handleError(err, "读取剪贴板内容");
                    }
                }, DELAY_MS);
            } else {
                // 获取下载链接
                let downloadTag = document.querySelector("a[href*='downhash=']");
                if (!downloadTag){
                    downloadTag = document.querySelector("a[href*='passkey=']");
                }
                if (!downloadTag){
                    // TTG特殊处理
                    downloadTag = document.querySelector("a[href^='https://totheglory.im/dl']");
                }

                // 获取协议与域名
                if (downloadTag){
                    const href = downloadTag.getAttribute("href");
                    if (href) {
                        const download_url = makeFullUrl(href);
                        if (download_url) {
                            showInputDialog(download_url);
                        } else {
                            console.log("下载链接为空");
                        }
                    }
                } else {
                    console.log("未找到下载链接");
                }
            }
        });
        document.body.appendChild(button);
    }
    createButton();
}

function showTodoSite(torrentId){
    // 获取待转列表
    let todoMap = {}
    GM_xmlhttpRequest({
        method: "GET",
        url: `${API_BASE_URL}/pt/audiences_record/get_todo_site_list?torrent_id=${torrentId}`,
        responseType: "arraybuffer",
        onload: function (response) {
            let data = {};
            try {
                data = JSON.parse(response.responseText);
            } catch (e) {
                console.error("JSON 解析失败:", response.responseText);
                handleError(e, "解析待转列表响应");
                return;
            }

            if (data.success === true){
                console.log("✅ 请求成功:", data);

                // 添加转种标签列表
                if (location.href.startsWith("https://hdhome.org/details.php")) {
                    if (data.data && Array.isArray(data.data)) {
                        data.data.forEach((item) => {
                            const siteId = SITE_MAP[item];
                            if (siteId) {
                                const tranSiteTag = document.getElementById(siteId);
                                if (tranSiteTag && tranSiteTag.href) {
                                    todoMap[item] = tranSiteTag.href;
                                }
                            }
                        });
                    }
                } else {
                    todoMap = GM_getValue("AudiTodoMap") || {};
                    if (data.data && Array.isArray(data.data)) {
                        Object.keys(todoMap).forEach((key) => {
                            if (!data.data.includes(key)) {
                                delete todoMap[key];
                            }
                        });
                    }
                }
                GM_setValue("AudiTodoMap", todoMap)
                // 创建容器，放置标签
                let tagContainer = document.getElementById('audi-todo-container');
                if (!tagContainer) {
                    tagContainer = document.createElement('div');
                    tagContainer.id = 'audi-todo-container';
                    tagContainer.style.cssText = `
                        position: fixed;
                        top: 170px;
                        right: 20px;
                        z-index: 10000;
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                    `;
                    document.body.appendChild(tagContainer);
                } else {
                    // 清空现有内容
                    tagContainer.innerHTML = "";
                }
                // 添加一键打开的按钮
                const openBtn = document.createElement('button');
                openBtn.textContent = '一键打开';
                openBtn.style.cssText = BUTTON_STYLES.tag.base + `background: ${GRADIENT_PRIMARY};`;
                openBtn.addEventListener('mouseenter', () => {
                    openBtn.style.cssText = BUTTON_STYLES.tag.base + BUTTON_STYLES.tag.hover + `background: ${GRADIENT_HOVER};`;
                });
                openBtn.addEventListener('mouseleave', () => {
                    openBtn.style.cssText = BUTTON_STYLES.tag.base + `background: ${GRADIENT_PRIMARY};`;
                });
                openBtn.addEventListener('click', () => {
                    const tranSiteTags = document.getElementsByClassName("trans_site_tag");
                    for (const tag of tranSiteTags) {
                        tag.click();
                    }
                });
                tagContainer.appendChild(openBtn);

                // 遍历 Map 生成标签
                Object.entries(todoMap).forEach(([key, value]) => {
                    const tag = document.createElement('a');
                    tag.textContent = key;
                    tag.className = "trans_site_tag";
                    tag.href = value;
                    tag.target = "_blank"; // 新标签页打开
                    tag.style.cssText = BUTTON_STYLES.tag.base + `background: ${GRADIENT_PRIMARY};`;
                    tag.addEventListener('mouseenter', () => {
                        tag.style.cssText = BUTTON_STYLES.tag.base + BUTTON_STYLES.tag.hover + `background: ${GRADIENT_HOVER};`;
                    });
                    tag.addEventListener('mouseleave', () => {
                        tag.style.cssText = BUTTON_STYLES.tag.base + `background: ${GRADIENT_PRIMARY};`;
                    });

                    tagContainer.appendChild(tag);
                });
            }
        },
        onerror: function (error) {
            handleError(error, "查询结果");
        }
    });
}

function showInputDialog(download_url){
    const audiTorrentId = GM_getValue("AudiId");
    if (!audiTorrentId || audiTorrentId === ""){
        handleError("观众种子id不能为空", "提示");
        return;
    }
    let detailUrl = location.href;
    detailUrl = detailUrl.replace("&uploaded=1", "");
    if (!detailUrl.includes("m-team")){
        try {
            const url = new URL(detailUrl);
            url.searchParams.set('audi_id', audiTorrentId);
            detailUrl = url.toString();
        } catch (e) {
            // 如果 URL 解析失败，使用字符串拼接作为降级方案
            detailUrl += (detailUrl.includes('?') ? '&' : '?') + 'audi_id=' + encodeURIComponent(audiTorrentId);
        }
    }

    // 开始调用接口上传种子
    GM_xmlhttpRequest({
        method: "POST",
        url: `${API_BASE_URL}/pt/audiences_record/add_torrent`,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            download_url: download_url,
            audi_torrent_id: audiTorrentId,
            detail_url: detailUrl
        }),
        onload: function (response) {
            let data = {};
            try {
                data = JSON.parse(response.responseText);
            } catch (e) {
                console.error("JSON 解析失败:", response.responseText);
                handleError(e, "种子添加结果");
                return;
            }
            if (data.success === true){
                console.log("✅ 请求成功:", response.responseText);
                GM_notification({
                    title: "种子添加结果",
                    text: "添加成功",
                    timeout: 2000,
                    highlight: true
                });
                if(!download_url.includes("hdhome")){
                    window.close();
                }
            } else {
                handleError(data.msg || "未知错误", "种子添加结果");
            }
        },
        onerror: function (error) {
            handleError(error, "种子添加结果");
        }
    });
}

function makeFullUrl(url) {
    // 去掉前后空格
    url = url.trim();
    if (!url) return url;

    // 判断是否以 http:// 或 https:// 开头
    if (REGEX_HTTP_URL.test(url)) {
        return url; // 已经是完整链接
    }

    // 获取当前页面的协议和域名
    const origin = window.location.origin; // 比如 https://example.com

    // 拼接完整 URL
    // 注意 url 可能以 / 开头或不以 / 开头
    if (url.startsWith("/")) {
        return origin + url;
    } else {
        return origin + "/" + url;
    }
}


 /** 上传图片到 Pixhost **/
function uploadPixhost(){
    function uploadToPixhost(blob, filename = 'image.png') {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('img', blob, filename);
            formData.append('content_type', '0');
            formData.append('max_th_size', '420');

            GM_xmlhttpRequest({
                method: 'POST',
                url: PIXHOST_API_URL,
                headers: { 'Accept': 'application/json' },
                data: formData,
                timeout: TIMEOUT_MS,

                onload: (response) => {
                    if (response.status !== 200) {
                        return reject(new Error(`HTTP ${response.status}`));
                    }
                    try {
                        const data = JSON.parse(response.responseText);
                        if (!data.show_url) {
                            return reject(new Error('Pixhost 未返回有效 URL'));
                        }
                        const directUrl = convertToDirectUrl(data.show_url);
                        resolve({
                            showUrl: data.show_url,
                            directUrl,
                            bbCode: `[img]${directUrl}[/img]`
                        });
                    } catch (e) {
                        reject(new Error('解析响应失败: ' + e.message));
                    }
                },

                onerror: (error) => {
                    reject(new Error(error.statusText || '网络错误'));
                }
            });
        });
    }

    /** show_url → 直链 **/
    function convertToDirectUrl(showUrl) {
        const match = showUrl.match(/show\/(\d+)\/([^\/]+\.(jpg|png|gif))/);
        if (match) {
            return `https://img1.pixhost.to/images/${match[1]}/${match[2]}`;
        }
        return showUrl;
    }

    /** 下载图片为 Blob 并转为 PNG **/
    function urlToBlob(imageUrl) {
        return new Promise((resolve, reject) => {
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            };
            if (imageUrl.includes('doubanio.com')) headers['Referer'] = 'https://www.douban.com/';
            if (imageUrl.includes('imdb.com')) headers['Referer'] = 'https://www.imdb.com/';

            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                headers,
                responseType: 'blob',
                onload: async (response) => {
                    if (response.status !== 200) return reject(`HTTP ${response.status}`);
                    const blob = response.response;
                    if (!blob || blob.size === 0) return reject('图片为空或下载失败');
                    if (blob.size > IMAGE_MAX_SIZE) return reject('图片超过10MB，已跳过');

                    try {
                        // ✅ 将下载的图片转换为 PNG
                        const pngBlob = await convertBlobToPng(blob);
                        resolve(pngBlob);
                    } catch (err) {
                        reject('转换为PNG失败: ' + err);
                    }
                },
                onerror: () => reject('下载图片失败'),
                timeout: 20000
            });
        });
    }

    /** ✅ 将任意图片 blob 转为 PNG blob **/
    function convertBlobToPng(blob) {
        return new Promise((resolve, reject) => {

            // ✅ 已经是 PNG，直接返回（零开销）
            if (blob.type === 'image/png') {
                return resolve(blob);
            }

            const img = new Image();

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                        (pngBlob) => {
                            if (!pngBlob) return reject(new Error('无法生成 PNG Blob'));
                            resolve(pngBlob);
                        },
                        'image/png'
                    );
                } catch (e) {
                    reject(e);
                }
            };

            img.onerror = () => {
                URL.revokeObjectURL(img.src); // 释放对象 URL
                reject(new Error('图片解码失败'));
            };

            const objectUrl = URL.createObjectURL(blob);
            img.src = objectUrl;

            // 在图片加载完成后释放对象 URL
            img.onload = () => {
                // 延迟释放，确保图片已完全加载
                setTimeout(() => {
                    URL.revokeObjectURL(objectUrl);
                }, 100);
            };
        });
    }


    /** 批量上传（并发 2 + 自适应延迟） **/
    async function batchUpload(items, concurrency = CONCURRENCY) {
        const results = [];
        const queue = items.slice(); // string | File
        // 每个 worker 维护自己的失败计数，避免竞态条件
        const workerStates = new Map();

        async function worker(workerId) {
            let failCount = 0;
            workerStates.set(workerId, { failCount: 0 });

            while (queue.length) {
                const item = queue.shift();
                if (!item) break;
                const label = typeof item === 'string' ? item : item.name;

                console.log(`📥 [W${workerId}] ${label}`);

                try {
                    let blob, filename;

                    if (item instanceof File) {
                        // ✅ 本地文件：原样上传
                        blob = item;
                        filename = item.name;
                    } else {
                        // ✅ URL 图片
                        const url = item.replace('[img]', '').replace('[/img]', '').trim();
                        blob = await urlToBlob(url);
                        filename = url.split('/').pop().split('?')[0] || 'image.jpg';
                    }

                    const result = await uploadToPixhost(blob, filename);
                    results.push({
                        source: label,
                        ...result
                    });

                    console.log(`✅ [W${workerId}] 成功: ${result.directUrl}`);
                    failCount = 0;
                    workerStates.set(workerId, { failCount: 0 });

                } catch (err) {
                    console.error(`❌ [W${workerId}] 失败: ${label}`, err);
                    results.push({
                        source: label,
                        error: err.message || err
                    });
                    failCount++;
                    workerStates.set(workerId, { failCount });
                }

                // 自适应延迟（400~900ms，失败指数退避）
                let delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
                if (failCount > 0) {
                    delay *= Math.min(4, Math.pow(2, failCount));
                }
                await sleep(delay);
            }
        }

        await Promise.all(
            Array(concurrency).fill(0).map((_, i) => worker(i + 1))
        );

        showResultTable(results);
    }


    /** 显示结果（含整列复制） **/
    function showResultTable(results) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.75); z-index: 10000; display: flex;
            align-items: center; justify-content: center; padding: 20px;
        `;

        const htmlRows = results.map((r) => {
            const url = escapeHtml(r.url || '');
            const directUrl = escapeHtml(r.error ? r.error : r.directUrl || '');
            const bbCode = escapeHtml(r.error ? '' : r.bbCode || '');
            const color = r.error ? 'red' : 'green';
            return `
            <tr>
                <td>${url}</td>
                <td style="color:${color}">${directUrl}</td>
                <td>${bbCode}</td>
            </tr>
        `;
        }).join('');

        modal.innerHTML = `
            <div style="background:#fff; border-radius:10px; padding:20px; max-width:90%; max-height:80%; overflow:auto;">
                <h3 style="text-align:center;">Pixhost 上传结果</h3>
                <div style="text-align:center; margin-bottom:10px;">
                    <button id="copy-url" class="copy-all">复制全部原始URL</button>
                    <button id="copy-direct" class="copy-all">复制全部直链</button>
                    <button id="copy-bbcode" class="copy-all">复制全部BBCode</button>
                </div>
                <table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead><tr><th>原始URL</th><th>直链</th><th>BBCode</th></tr></thead>
                    <tbody>${htmlRows}</tbody>
                </table>
                <div style="text-align:center; margin-top:15px;">
                    <button id="close-btn" style="padding:8px 16px; background:#2196F3; color:white; border:none; border-radius:5px; cursor:pointer;">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.querySelector('#close-btn').addEventListener('click', () => modal.remove());

        // 一键整列复制
        modal.querySelectorAll('.copy-all').forEach(btn => {
            btn.addEventListener('click', async () => {
                let type = btn.id.split('-')[1];
                let text = results.map(r => {
                    if (type === 'url') return r.url || '';
                    if (type === 'direct') return r.directUrl || '';
                    if (type === 'bbcode') return r.bbCode || '';
                }).filter(Boolean).join('\n');

                try {
                    await navigator.clipboard.writeText(text);
                    btn.textContent = '✅ 已复制';
                    btn.style.background = '#4CAF50';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        btn.textContent = btn.id === 'copy-url' ? '复制全部原始URL'
                            : btn.id === 'copy-direct' ? '复制全部直链'
                            : '复制全部BBCode';
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 1500);
                } catch (err) {
                    alert('复制失败: ' + err);
                }
            });
        });
    }

    /** 输入弹窗 **/
    function showInputDialog() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.75); z-index: 9999; display: flex;
            align-items: center; justify-content: center;
        `;

        modal.innerHTML = `
            <div style="background:#fff; padding:20px; border-radius:10px; width:520px;">
                <h3 style="text-align:center;">批量上传到 Pixhost</h3>

                <textarea id="url-input"
                    placeholder="请输入图片URL，每行一个（可选）"
                    style="width:100%; height:160px; font-family:monospace;
                    border:1px solid #ccc; border-radius:5px;"></textarea>

                <div style="margin-top:10px;">
                    <input id="file-input" type="file" multiple accept="image/*">
                </div>

                <div style="text-align:center; margin-top:15px;">
                    <button id="upload-btn"
                        style="padding:8px 16px; background:#4CAF50; color:white;
                        border:none; border-radius:5px; cursor:pointer;">
                        开始上传
                    </button>
                    <button id="cancel-btn"
                        style="padding:8px 16px; background:#f44336; color:white;
                        border:none; border-radius:5px; margin-left:10px; cursor:pointer;">
                        取消
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#cancel-btn').addEventListener('click', () => modal.remove());

        modal.querySelector('#upload-btn').addEventListener('click', async () => {
            const urls = modal.querySelector('#url-input')
                .value.split(/\r?\n/)
                .map(v => v.trim())
                .filter(Boolean);

            const files = Array.from(
                modal.querySelector('#file-input').files || []
            );

            modal.remove();

            // URL（string） + 本地文件（File）
            await batchUpload([...urls, ...files]);
        });
    }


    /** 固定入口按钮 **/
    function createButton() {
        const button = document.createElement('button');
        button.textContent = '批量上传图片到Pixhost';
        button.id = "auto-upload-pixhost"
        applyButtonStyle(button, BUTTON_STYLES.fixedSecondary, `
            bottom: 140px;
            right: 20px;
        `);
        button.addEventListener('click', showInputDialog);
        document.body.appendChild(button);

        if (location.href.startsWith("https://hdhome.org/upload.php")){
            const homeButton = document.createElement('button');
            homeButton.textContent = '自动修改信息';
            homeButton.id = "home-auto-upload"
            applyButtonStyle(homeButton, BUTTON_STYLES.fixedSecondary, `
                bottom: 200px;
                right: 20px;
            `);
            homeButton.addEventListener('click', HDHomeAutoReplace);
            document.body.appendChild(homeButton);
        }
    }

    // 获取bbcode中的图片链接
    function extractImages(bbcode) {
        if (!bbcode) return [];
        const result = [];
        let match;
        while ((match = REGEX_IMG_BBCODE.exec(bbcode)) !== null) {
            const tempPicUrl = match[1];
            if (tempPicUrl && 
                !BLACKLIST_URLS.includes(tempPicUrl) && 
                !tempPicUrl.startsWith("https://img1.pixhost.to/images")){
                result.push(tempPicUrl);
            }
        }
        return result;
    }

    // 注意：hdhomeAutoUpload 函数已定义但未使用，保留以备将来需要

    // HDHome自动替换内容
    function HDHomeAutoReplace() {
        const torrent_id = GM_getValue("AudiId");
        if (!torrent_id) {
            handleError("观众种子ID不能为空", "种子信息获取结果");
            return;
        }

        const descrElement = document.getElementById("descr");
        if (!descrElement) {
            handleError("未找到描述输入框", "种子信息获取结果");
            return;
        }

        // 1、获取替换信息
        GM_xmlhttpRequest({
            method: "GET",
            url: `${API_BASE_URL}/pt/audiences_log/get_torrent_desc?torrent_id=${torrent_id}`,
            onload: function (response) {
                let data = {};
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    console.error("JSON 解析失败:", response.responseText);
                    handleError(e, "种子信息获取结果");
                    return;
                }
                if (data.success === true){
                    console.log("✅ 请求成功:", data);
                    GM_notification({
                        title: "种子信息获取结果",
                        text: "获取成功",
                        timeout: 2000,
                        highlight: true
                    });
                    let sourceBbcode = descrElement.value;
                    const businessData = data.data;
                    if (!businessData) {
                        handleError("返回数据为空", "种子信息获取结果");
                        return;
                    }

                    // 2、替换海报
                    if (businessData.title_pic && businessData.title_pic !== ''){
                        sourceBbcode = sourceBbcode.replace(REGEX_FIRST_IMG,
                            `[img]${businessData.title_pic}[/img]`);
                    }
                    // 3、替换mediainfo
                    const indexValue = sourceBbcode.indexOf("[img]https://img93.pixhost.to/images/86/435614074_c5134549f13c2c087d67c9fa4089c49e-removebg-preview.png[/img]");
                    if (indexValue !== -1 && businessData.mediainfo) {
                        sourceBbcode = sourceBbcode.substring(0, indexValue) + businessData.mediainfo;
                    }
                    // 4、替换截图
                    const screen_shot_list = businessData.screen_shot;
                    if (screen_shot_list && Array.isArray(screen_shot_list) && screen_shot_list.length > 0){
                        for (const shot of screen_shot_list) {
                            sourceBbcode += "[img]" + shot + "[/img]\n";
                        }
                    }
                    // 5、结果赋值
                    descrElement.value = sourceBbcode;
                } else {
                    handleError(data.msg || "未知错误", "种子信息获取结果");
                }
            },
            onerror: function (error) {
                handleError(error, "种子信息获取结果");
            }
        });

        // 2、替换标题信息
        const nameElement = document.querySelector("#name");
        if (nameElement && nameElement.value) {
            nameElement.value = nameElement.value.replace("10bit ", "");
        }

        const smallDescrElement = document.querySelector("input[name='small_descr']");
        if (smallDescrElement && smallDescrElement.value) {
            smallDescrElement.value = smallDescrElement.value
                .replace("【", "*")
                .replace("】", "*");
        }
    }
    createButton();
}

function getDoubanPic() {
    function getPosterUrl() {
        const img = document.querySelector('#mainpic img');
        if (!img) return null;
        return img.src;
    }
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = onClick;
        btn.style.marginRight = '8px';
        return btn;
    }
    function toLargeJpg(url) {
        return url
            .replace('s_ratio_poster', 'l')
            .replace('.webp', '.jpg');
    }
    function initUI() {
        const posterUrl = getPosterUrl();
        if (!posterUrl) return;

        const largeUrl = toLargeJpg(posterUrl);

        const container = document.createElement('div');
        container.style.marginTop = '10px';

        const btn2 = createButton('复制高清 JPG', () => {
            GM_setClipboard(largeUrl);
            alert('高清 JPG 链接已复制');
        });

        container.appendChild(btn2);

        const mainpic = document.getElementById('mainpic');
        if (mainpic) {
            mainpic.appendChild(container);
        }
    }
    initUI()
}