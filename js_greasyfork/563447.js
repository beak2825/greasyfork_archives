// ==UserScript==
// @name         酒店详情信息导出 & 图片下载
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  抓取酒店详情支持 JSON 导出和 图片。
// @author       Antigravity
// @match        https://hotels.ctrip.com/hotels/detail*
// @grant        GM_download
// @connect      c-ctrip.com
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563447/%E9%85%92%E5%BA%97%E8%AF%A6%E6%83%85%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA%20%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/563447/%E9%85%92%E5%BA%97%E8%AF%A6%E6%83%85%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA%20%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ... (Existing helper functions remain same) ...

    // 辅助函数：通过包含前缀的属性选择器获取文本
    const getTextByPrefix = (prefix, fallback = "") => {
        const el = document.querySelector(`[class*="${prefix}"]`);
        return el ? el.innerText.trim() : fallback;
    };

    // 文件名安全过滤
    const sanitizeFileName = (name) => {
        return name.replace(/[\\/:*?"<>|]/g, '_').trim();
    };

    // 真正的抓取逻辑（返回数据对象）
    const getScrapedData = async () => {
        // 增强版滚动：分步滚动以触发懒加载
        window.scrollTo({ top: 1000, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 800));
        window.scrollTo({ top: 2500, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 1500)); // 多等一会儿确保房型加载

        const hotelName = sanitizeFileName(getTextByPrefix('headInit-title_nameA') || '未命名酒店');
        const data = {
            platform: "ctrip",
            url: window.location.href,
            collectTime: new Date().toISOString(),
            hotel: {
                name: hotelName,
                address: getTextByPrefix('headInit-address_text').replace('显示地图', '').trim(),
                score: document.querySelector('[class*="score-container"] em')?.innerText || "",
                price: getTextByPrefix('price-num'),
                description: getTextByPrefix('hotelDescription-address') || getTextByPrefix('hotelDescription-content'),
                facilities: [],
                rooms: []
            },
            images: []
        };

        // 提取设施
        document.querySelectorAll('[class*="headFacility-list_item"], [class*="headFacility-item"]').forEach(item => {
            const text = item.innerText.trim();
            if (text && !data.hotel.facilities.includes(text)) data.hotel.facilities.push(text);
        });

        // 提取房型 - 使用更宽松的选择器 [*=] 并增加容错
        const roomCards = document.querySelectorAll('[class*="commonRoomCard"]');
        if (roomCards.length === 0) {
            console.warn("[导出助手] 未检测到房型卡片，尝试再次滚动...");
            window.scrollBy({ top: 500, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, 1000));
        }

        document.querySelectorAll('[class*="commonRoomCard"]').forEach(card => {
            // 排除非主卡片元素，只找包含标题的容器
            const titleEl = card.querySelector('[class*="commonRoomCard-title"]');
            if (titleEl) {
                const tags = Array.from(card.querySelectorAll('[class*="baseRoom-facility_title"]')).map(el => el.innerText.trim());

                // 解析详细属性
                let size = "", floor = "", windowInfo = "", smoking = "", wifi = "";
                tags.forEach(tag => {
                    if (tag.includes('m²')) size = tag;
                    else if (tag.includes('层')) floor = tag;
                    else if (tag.includes('窗')) windowInfo = tag;
                    else if (tag.includes('烟')) smoking = tag;
                    else if (tag.includes('Wi-Fi') || tag.includes('宽带')) wifi = tag;
                });

                let roomInfo = {
                    name: sanitizeFileName(titleEl.innerText.trim()),
                    price: card.querySelector('[class*="price-num"]')?.innerText || "",
                    image: card.querySelector('[class*="baseRoom-singleRoomImgBox_bigImg"] img, img')?.src || "",
                    size: size,
                    floor: floor,
                    window: windowInfo,
                    smoking: smoking,
                    wifi: wifi,
                    tags: tags
                };

                // 简单去重 (有时结构会嵌套导致重复选择)
                const exists = data.hotel.rooms.some(r => r.name === roomInfo.name && r.price === roomInfo.price);
                if (!exists) {
                    data.hotel.rooms.push(roomInfo);
                }
            }
        });

        // 提取轮播图
        document.querySelectorAll('[class*="headAlbum-smallpics_box"] img, [class*="headAlbum-smallpics_item"] img').forEach((img, index) => {
            if (img.src && !img.src.includes('base64')) {
                if (!data.images.some(e => e.url === img.src)) {
                    data.images.push({ url: img.src, alt: `图片${index + 1}` });
                }
            }
        });
        return data;
    };

    // 直接下载所有图片 (Browser Native / GM_download)
    const downloadDirect = async () => {
        if (typeof GM_download === 'undefined') {
            alert("请检查脚本头部是否包含 @grant GM_download，或者您的管理器不支持此功能。");
            return;
        }

        const data = await getScrapedData();
        const hotelName = data.hotel.name;

        let downloadQueue = [];

        // 1. 准备轮播图任务
        data.images.forEach((img, i) => {
            downloadQueue.push({
                url: img.url,
                name: `${hotelName}/轮播图/${i + 1}_${sanitizeFileName(img.alt || 'img')}.jpg`
            });
        });

        // 2. 准备房型图片任务
        data.hotel.rooms.forEach(room => {
            if (room.image) {
                downloadQueue.push({
                    url: room.image,
                    name: `${hotelName}/${room.name}/${room.name}.jpg`
                });
            }
        });

        console.log(`[导出助手] 准备直接下载 ${downloadQueue.length} 张图片...`);
        showToast(`准备下载 ${downloadQueue.length} 张图片...`);

        // 串行处理下载，防止浏览器卡死
        let count = 0;
        for (const item of downloadQueue) {
            count++;
            // 每次下载间隔 300ms
            await new Promise(resolve => setTimeout(resolve, 300));

            GM_download({
                url: item.url,
                name: item.name,
                onload: () => console.log(`[下载成功] ${item.name}`),
                onerror: (err) => console.error(`[下载失败] ${item.name}`, err)
            });

            if (count % 5 === 0) {
                showToast(`已请求: ${count} / ${downloadQueue.length}`);
            }
        }
        showToast("所有下载请求已发送！");
        alert("所有图片下载请求已发送，请留意浏览器的下载管理器。");
    };

    // ... (Keep existing downloadZip and downloadPowerShell functions but createBtn logic needs update) ...

    // 下载 JSON 数据
    const downloadJSON = async () => {
        const data = await getScrapedData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `ctrip_hotel_${data.hotel.name}.json`;
        a.click();
    };

    // UI 注入
    const showToast = (msg) => {
        let t = document.getElementById('ctrip-toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'ctrip-toast';
            t.style = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:10px 20px; border-radius:4px; z-index:100000; transition: opacity 0.3s;";
            document.body.appendChild(t);
        }
        t.innerText = msg;
        t.style.opacity = '1';
        setTimeout(() => t.style.opacity = '0', 2000);
    };

    const init = () => {
        if (document.getElementById('ctrip-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'ctrip-panel';
        panel.style = `
            position: fixed; top: 100px; right: 20px; z-index: 99999;
            background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            padding: 15px; display: flex; flex-direction: column; gap: 10px; width: 160px;
            font-family: sans-serif; border: 1px solid #eee;
        `;

        const title = document.createElement('div');
        title.innerText = '🏨 导出助手';
        title.style = 'font-weight: bold; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333;';
        panel.appendChild(title);

        const createBtn = (text, color, onClick) => {
            const btn = document.createElement('button');
            btn.innerText = text;
            btn.style = `
                padding: 8px; border: none; border-radius: 4px; cursor: pointer;
                background: ${color}; color: white; font-size: 12px; transition: 0.2s;
            `;
            btn.onmouseover = () => btn.style.filter = 'brightness(1.1)';
            btn.onmouseout = () => btn.style.filter = 'none';
            btn.onclick = onClick;
            return btn;
        };

        panel.appendChild(createBtn('提取并下载 JSON', '#0066FF', downloadJSON));
        panel.appendChild(createBtn('直接下载所有图片', '#E91E63', downloadDirect));

        document.body.appendChild(panel);
    };

    if (document.readyState === 'complete') { init(); } else { window.addEventListener('load', init); }
    setInterval(init, 2000);
})();
