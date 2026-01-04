// ==UserScript==
// @name         观众转种助手
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  观众脚本，转种使用
// @match        https://*/upload.php*
// @match        https://*/edit.php*
// @match        https://*/details.php*
// @match        https://kp.m-team.cc/upload*
// @match        https://kp.m-team.cc/detail*
// @match        https://totheglory.im/t/*
// @author       Ralph
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555479/%E8%A7%82%E4%BC%97%E8%BD%AC%E7%A7%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555479/%E8%A7%82%E4%BC%97%E8%BD%AC%E7%A7%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = location.href;
    if (/upload\.php/i.test(url) || /edit\.php/i.test(url)) {
        // 上传图片
        uploadPixhost()
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
    // 保存观众种子id
    if (url.startsWith("https://audiences.me/details.php")){
        const audiUrl = new URL(url);
        const id = audiUrl.searchParams.get('id');
        const title = document.querySelector("#top").innerText
        GM_setValue("AudiId", id)
        GM_setValue("AudiTitle", title)
        document.querySelector("#audi-torrent-id").value = id + "-" + title
    }
})();

function clearSSD() {
    const clearBtn = document.querySelector('input#qr');
    console.log(clearBtn)
    if (clearBtn) {
        // 创建新按钮
        const newBtn = document.createElement('button');
        newBtn.textContent = '修改附加信息';
        newBtn.id = 'my-new-button';
        newBtn.type = "button";
        newBtn.style.marginRight = '8px'; // 看起来更美观

        // 插入到 clear 按钮左侧
        clearBtn.parentNode.insertBefore(newBtn, clearBtn);
        console.log(newBtn)
        // 给新按钮绑定事件
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();  // 阻止默认提交行为
            e.stopPropagation(); // 阻止冒泡（可选）
            let extMessage = document.querySelector("textarea[dir='ltr']")
            extMessage.value = extMessage.value.replace(/\[img\].*$/s, "");
            document.getElementById("qr_check").click()
        });
    }
}

async function getClipboardContent() {
  try {
    const text = await navigator.clipboard.readText();// 获取文本内容
    return text
  } catch (err) {
    console.error("无法读取剪贴板内容：", err);
  }
}

function addJumpTmdb(){
    const input = document.querySelector("input[name='small_descr']");
    const btn = document.createElement("button");
    btn.textContent = "🔍 TMDB 查询";
    btn.id = "tmdb-search"
    btn.style.cssText = `
        margin-left: 8px;
        padding: 5px 10px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

    // 点击事件：获取输入框值并打开 TMDB 搜索页
    btn.addEventListener("click", () => {
        event.preventDefault();
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
        let torrent_id = GM_getValue("AudiId")
        showTodoSite(torrent_id)

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '观众种子ID';
        input.id = 'audi-torrent-id';
        input.value = torrent_id + "-" + GM_getValue("AudiTitle");
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
        button.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg,#43cea2,#185a9d);
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        `;
        button.addEventListener('click', () => {
            // 馒头单独处理
            if (location.href.startsWith("https://kp.m-team.cc/detail")){
                document.querySelector("span.anticon-copy").click();
                setTimeout(async () => {
                    try {
                        const text = await navigator.clipboard.readText();
                        showInputDialog(text);
                    } catch (err) {
                        console.error("读取剪贴板失败:", err);
                    }
                }, 500);
            }else {
                // 获取下载链接
                let downloadTag = document.querySelector("a[href*='downhash=']")
                let download_url = ""
                if (!downloadTag){
                    downloadTag = document.querySelector("a[href*='passkey=']")
                }
                if (!downloadTag){
                    // TTG特殊处理
                    downloadTag = document.querySelector("a[href^='https://totheglory.im/dl']")
                }

                // 获取协议与域名
                if (downloadTag){
                    download_url = makeFullUrl(downloadTag.getAttribute("href"))
                }
                if (download_url != ""){
                    showInputDialog(download_url);
                }else {
                    console.log("下载链接为空")
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
        url: "https://20201206.xyz:12848/pt/audiences_record/get_todo_site_list?torrent_id=" + torrentId,
        // url: "http://127.0.0.1:5001/pt/audiences_record/get_todo_site_list?torrent_id=" + torrentId,
        responseType: "arraybuffer",
        onload: function (response) {
            const data = JSON.parse(response.responseText);
            if (data.success === true){
                let responseData = {}
                try {
                    responseData = JSON.parse(response.responseText);
                } catch (e) {
                    console.log(response.responseText)
                    return
                }

                console.log("✅ 请求成功:", responseData);

                // 添加转种标签列表
                let siteMap = {
                    "家园":"HDHome",
                    "春天":"CMCT",
                    "高清杜比":"HDDolby",
                    "天空":"HDSky",
                    "馒头":"MTeam",
                    "我堡":"OurBits",
                    "猫站":"PTer",
                    "青蛙":"QingWa",
                    "北洋":"TJUPT",
                    "听听歌":"TTG",
                    "麒麟":"麒麟"
                }

                if (location.href.startsWith("https://hdhome.org/details.php")) {
                    responseData.data.forEach((item) => {
                        let tranSiteTag = document.getElementById(siteMap[item])
                        todoMap[item] = tranSiteTag['href']
                    })
                }else {
                    todoMap = GM_getValue("AudiTodoMap")
                    Object.entries(todoMap).forEach(([key, value]) => {
                        if (!responseData.data.includes(key)) {
                            delete todoMap[key];
                        }
                    })
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

                // 遍历 Map 生成标签
                const originalBg = "linear-gradient(135deg,#43cea2,#185a9d)";
                Object.entries(todoMap).forEach(([key, value]) => {
                    const tag = document.createElement('a');
                    tag.textContent = key;
                    tag.href = value;
                    tag.target = "_blank"; // 新标签页打开
                    tag.style.cssText = `
                        display: inline-block;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        text-decoration: none;
                        font-size: 13px;
                        transition: 0.2s;
                        background: ${originalBg};
                    `;
                    tag.onmouseover = () => tag.style.background = "#ddd";
                    tag.onmouseout = () => tag.style.background = originalBg;

                    tagContainer.appendChild(tag);
                });
            }
        },
        onerror: function (error) {
            console.error("❌ 请求失败:", error);
            GM_notification({
                title: "查询结果",
                text: "查询失败 " + error,
                timeout: 2000,
                highlight: true
            });
        }
    });
}

function showInputDialog(download_url){
    let audiTorrentId = GM_getValue("AudiId");
    if (audiTorrentId === undefined || audiTorrentId === ""){
        GM_notification({
            title: "提示",
            text: "观众种子id不能为空",
            timeout: 2000,
            highlight: true
        });
        return
    }
    let detailUrl = location.href
    detailUrl = detailUrl.replace("&uploaded=1","");

    // 开始调用接口上传种子
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://20201206.xyz:12848/pt/audiences_record/add_torrent",
        // url: "http://127.0.0.1:5001/pt/audiences_record/add_torrent",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            download_url: download_url,
            audi_torrent_id: audiTorrentId,
            detail_url: detailUrl
        }),
        onload: function (response) {
            let data = {}
            try {
                data = JSON.parse(response.responseText);
            } catch (e) {
                console.log(response.responseText)
                return
            }
            if (data.success === true){
                console.log("✅ 请求成功:", response.responseText);
                GM_notification({
                    title: "种子添加结果",
                    text: "添加成功",
                    timeout: 2000,
                    highlight: true
                });
                showTodoSite(audiTorrentId)
            }else {
                console.error("❌ 请求失败:", data.msg);
                GM_notification({
                    title: "种子添加结果",
                    text: "添加失败 " + data.msg,
                    timeout: 2000,
                    highlight: true
                });
            }
        },
        onerror: function (error) {
            console.error("❌ 请求失败:", error);
            GM_notification({
                title: "种子添加结果",
                text: "添加失败 " + error,
                timeout: 2000,
                highlight: true
            });
        }
    });
}

function makeFullUrl(url) {
        // 去掉前后空格
        url = url.trim();

        // 判断是否以 http:// 或 https:// 开头
        if (/^https?:\/\//i.test(url)) {
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
                url: 'https://api.pixhost.to/images',
                headers: { 'Accept': 'application/json' },
                data: formData,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (!data.show_url) {
                            reject('Pixhost 未返回有效 URL');
                            return;
                        }
                        const directUrl = convertToDirectUrl(data.show_url);
                        resolve({
                            showUrl: data.show_url,
                            directUrl: directUrl,
                            bbCode: `[img]${directUrl}[/img]`
                        });
                    } catch (e) {
                        reject('解析响应失败: ' + e.message);
                    }
                },
                onerror: (error) => reject('上传失败: ' + (error.statusText || '网络错误')),
                timeout: 30000
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
                    if (blob.size > 10 * 1024 * 1024) return reject('图片超过10MB，已跳过');

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
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((pngBlob) => {
                        if (!pngBlob) return reject('无法生成 PNG Blob');
                        resolve(pngBlob);
                    }, 'image/png');
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = () => reject('图片解码失败');
            img.src = URL.createObjectURL(blob);
        });
    }

    /** 批量上传 **/
    async function batchUpload(urls) {
        const results = [];
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i].trim();
            if (!url) continue;
            console.log(`📥 (${i + 1}/${urls.length}) ${url}`);
            try {
                const blob = await urlToBlob(url);
                const result = await uploadToPixhost(blob);
                results.push({ url, ...result });
                console.log(`✅ 上传成功: ${result.directUrl}`);
            } catch (err) {
                console.error(`❌ 上传失败: ${url}`, err);
                results.push({ url, error: err.message || err });
            }
            const delay = 1000 + Math.random() * 2000;
            console.log(`⏳ 等待 ${delay.toFixed(0)} ms...`);
            await new Promise(r => setTimeout(r, delay));
        }
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

        const htmlRows = results.map((r) => `
            <tr>
                <td>${r.url || ''}</td>
                <td style="color:${r.error ? 'red' : 'green'}">${r.error ? r.error : r.directUrl || ''}</td>
                <td>${r.error ? '' : r.bbCode || ''}</td>
            </tr>
        `).join('');

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
            <div style="background:#fff; padding:20px; border-radius:10px; width:500px;">
                <h3 style="text-align:center;">批量上传到 Pixhost</h3>
                <textarea id="url-input" placeholder="请输入图片URL，每行一个" style="width:100%; height:200px; padding:10px; font-family:monospace; border:1px solid #ccc; border-radius:5px;"></textarea>
                <div style="text-align:center; margin-top:15px;">
                    <button id="upload-btn" style="padding:8px 16px; background:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">开始上传</button>
                    <button id="cancel-btn" style="padding:8px 16px; background:#f44336; color:white; border:none; border-radius:5px; margin-left:10px; cursor:pointer;">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#cancel-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('#upload-btn').addEventListener('click', async () => {
            const urls = modal.querySelector('#url-input').value.split(/\r?\n/).filter(Boolean);
            modal.remove();
            await batchUpload(urls);
        });
    }

    /** 固定入口按钮 **/
    function createButton() {
        const button = document.createElement('button');
        button.textContent = '批量上传图片到Pixhost';
        button.id = "auto-upload-pixhost"
        button.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: linear-gradient(135deg,#667eea,#764ba2);
            color: white; padding: 10px 15px; border: none;
            border-radius: 8px; cursor: pointer; z-index: 10000;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        `;
        button.addEventListener('click', showInputDialog);
        document.body.appendChild(button);

        if (location.href.startsWith("https://hdhome.org/upload.php")){
            const homeButton = document.createElement('button');
            homeButton.textContent = '自动上传图片';
            homeButton.id = "home-auto-upload"
            homeButton.style.cssText = `
                position: fixed; bottom: 120px; right: 20px;
                background: linear-gradient(135deg,#667eea,#764ba2);
                color: white; padding: 10px 15px; border: none;
                border-radius: 8px; cursor: pointer; z-index: 10000;
                box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            `;
            homeButton.addEventListener('click', hdhomeAutoUpload);
            document.body.appendChild(homeButton);
        }
    }

    // 获取bbcode中的图片链接
    function extractImages(bbcode) {
        const regex = /\[img\](.*?)\[\/img\]/gi;
        let result = [];
        let match;
        // 图片黑名单，这个链接中的图片不返回
        let blackUrl = [
            "https://img93.pixhost.to/images/86/435614074_c5134549f13c2c087d67c9fa4089c49e-removebg-preview.png",
            "https://pic.imgdb.cn/item/6170004c2ab3f51d91c7782a.png"
        ]
        while ((match = regex.exec(bbcode)) !== null) {
            let tempPicUrl = match[1]
            if (!blackUrl.includes(tempPicUrl)){
                result.push(match[1]);
            }
        }
        return result;
    }

    // HDHome自动上传图片
    async function hdhomeAutoUpload() {
        let sourceBbcode = document.getElementById("descr").value
        let urls = extractImages(sourceBbcode)
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i].trim();
            if (!url) continue;
            console.log(`📥 (${i + 1}/${urls.length}) ${url}`);
            try {
                const blob = await urlToBlob(url);
                const result = await uploadToPixhost(blob);
                sourceBbcode = sourceBbcode.replace(url, result.directUrl);
                console.log(`✅ 上传成功: ${result.directUrl}`);
            } catch (err) {
                console.error(`❌ 上传失败: ${url}`, err);
            }
        }
        GM_notification({
            title: "上传结果",
            text: "自动上传成功",
            timeout: 2000,
            highlight: true
        });
        document.getElementById("descr").value = sourceBbcode
    }
    createButton();
}



