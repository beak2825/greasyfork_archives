// ==UserScript==
// @name         ANIME Pro Matcher Client
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  ANIME Pro Matcher 客户端 - 强力模式 + TMDB直达
// @author       User & Refactored
// @match        https://*/detail/*
// @match        https://*/details.php?id=*
// @match        https://*/details_movie.php?id=*
// @match        https://*/details_tv.php?id=*
// @match        https://*/details_animate.php?id=*
// @match        https://bangumi.moe/*
// @match        https://*.acgnx.se/*
// @match        https://*.dmhy.org/*
// @match        https://nyaa.si/*
// @match        https://mikanani.me/*
// @match        https://*.skyey2.com/*
// @match        http://localhost*/*
// @match        http://127.0.0.1*/*
// @match        <all_urls>
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559697/ANIME%20Pro%20Matcher%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/559697/ANIME%20Pro%20Matcher%20Client.meta.js
// ==/UserScript==

// --- 配置区域 ---
const windowPopup = true; // 是否开启划词弹窗
const serverUrl = 'http://192.168.50.202:6868'; // 你的 ANIME Pro Matcher 服务器地址
// ----------------

let ptype = '';
let btype = '';
let site_domain = window.location.hostname;

// 1. 请求函数：保留了 force_filename 和 anime_priority
function recognize(text) {
    return new Promise(function (resolve, reject) {
        const payload = JSON.stringify({
            filename: text,
            anime_priority: true,
            force_filename: true
        });

        GM_xmlhttpRequest({
            url: serverUrl + `/api/recognize`,
            method: "POST",
            headers: {
                "user-agent": navigator.userAgent,
                "content-type": "application/json"
            },
            data: payload,
            responseType: "json",
            onload: (res) => {
                if (res.status === 200) {
                    resolve(res.response);
                } else {
                    GM_log("API Error: " + res.responseText);
                    reject(new Error('识别请求失败: ' + res.status));
                }
            },
            onerror: (err) => {
                GM_log(err)
                reject(new Error('识别网络错误 (请检查 192.168.50.202 是否开启)'));
            }
        });
    });
}

// 辅助工具：等待元素加载
function waitForElements(selectors, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const interval = 500;
        const maxTries = timeout / interval;
        let tries = 0;

        const checkExist = setInterval(() => {
            let allFound = true;
            const elements = selectors.map(selector => {
                const foundElements = document.getElementsByClassName(selector);
                if (foundElements.length === 0) allFound = false;
                return foundElements;
            });

            if (allFound) {
                clearInterval(checkExist);
                resolve(elements);
            } else if (tries >= maxTries) {
                clearInterval(checkExist);
                reject(new Error(`未找到目标元素，脚本停止在该页面运行`));
            }
            tries++;
        }, interval);
    });
}

// 渲染标签样式
function renderTag(ptype, string, background_color) {
    if (!string && string !== 0) return '';
    if (ptype == 'hhanclub') {
        return `<span class="flex justify-center items-center rounded-md text-[12px] h-[18px] mr-2 px-[5px] font-bold" style="background-color:${background_color};color:#ffffff;">${string}</span>`;
    } else {
        return `<span style=\"background-color:${background_color};color:#ffffff;border-radius:2px;font-size:12px;margin:0 4px 0 0;padding:2px 4px\">${string}</span>`;
    }
}

// 渲染项目名称行头
function renderProjectHeader(ptype, content) {
    const projectName = `<span style="font-weight:bold; color:#3e84f4;">ANIME Pro Matcher</span>`;
    
    if (ptype == "common") {
        return `<td class="rowhead nowrap" valign="top" align="right">${projectName}</td><td class="rowfollow" valign="top" align="left">${content}</td>`;
    } else if (ptype == 'm-team') {
        return `<th class="ant-descriptions-item-label" style="width: 135px; text-align: right;" colspan="1"><span>${projectName}</span></th><td class="ant-descriptions-item-content" colspan="1"><span>${content}</span></td>`;
    } else {
        return content;
    }
}

// 2. 核心修改：智能生成 TMDB 直达链接
function getTmdbLink(id, category) {
    if (!id) return '';
    let type = 'tv'; // 默认为剧集 (动漫通常是剧集)
    
    if (category) {
        const cat = String(category).toLowerCase();
        if (cat.includes('电影') || cat.includes('movie')) {
            type = 'movie';
        } else if (cat.includes('剧集') || cat.includes('tv')) {
            type = 'tv';
        }
    }
    return `https://www.themoviedb.org/${type}/${id}`;
}

// 构建识别结果的 HTML 标签
function buildTagsHtml(ptype, final) {
    let html = '';
    html += final.category ? renderTag(ptype, final.category, '#2775b6') : '';
    html += final.title ? renderTag(ptype, final.title, '#c54640') : '';
    
    let se = '';
    if (final.season != null) se += `S${final.season}`;
    if (final.episode != null) se += `E${final.episode}`;
    html += se ? renderTag(ptype, se, '#e6702e') : '';
    
    html += final.year ? renderTag(ptype, final.year, '#e6702e') : '';
    
    // 修改处：使用直达链接
    if (final.tmdb_id) {
        let detail_link = getTmdbLink(final.tmdb_id, final.category);
        html += `<a href="${detail_link}" target="_blank" title="点击跳转 TMDB 详情页">${renderTag(ptype, "TMDB: " + final.tmdb_id, '#5bb053')}</a>`;
    }
    
    html += final.team ? renderTag(ptype, final.team, '#701eeb') : '';
    html += final.resolution ? renderTag(ptype, final.resolution, '#677489') : '';
    html += final.source ? renderTag(ptype, final.source, '#95a5a6') : '';

    return html;
}

// 创建识别行
function creatRecognizeRow(row, ptype, torrent_name) {
    row.innerHTML = renderProjectHeader(ptype, "正在分析...");
    
    recognize(torrent_name).then(data => {
        const final = data.final_result;
        if (final) {
            let html = buildTagsHtml(ptype, final);
            row.innerHTML = renderProjectHeader(ptype, html);
        } else {
            row.innerHTML = renderProjectHeader(ptype, `<span style="color:gray;">未识别到有效信息</span>`);
        }
    }).catch(error => {
        console.error(error);
        row.innerHTML = renderProjectHeader(ptype, `<span style="color:red; cursor:help;" title="${error.message}">连接失败 (悬停查看)</span>`);
    });
}

// 划词弹窗的显示逻辑
function creatRecognizeTip(tip, text) {
    tip.showText(`<b>APM 分析中...</b>`);
    recognize(text).then(data => {
        const final = data.final_result;
        if (final) {
            let html = '<div style="margin-bottom:5px; border-bottom:1px solid #eee; padding-bottom:5px;"><b>✅ 识别成功</b></div>';
            html += final.category ? `📂 分类：${final.category}<br>` : '';
            html += final.title ? `🎬 标题：<b>${final.title}</b><br>` : '';
            
            let se = '';
            if(final.season != null) se += `S${final.season} `;
            if(final.episode != null) se += `E${final.episode}`;
            html += se ? `📺 季集：${se}<br>` : '';
            
            html += final.year ? `📅 年份：${final.year}<br>` : '';
            html += final.team ? `🛠️ 制作：${final.team}<br>` : '';
            html += final.resolution ? `🖥️ 画质：${final.resolution}<br>` : '';
            
            // 修改处：使用直达链接
            if (final.tmdb_id) {
                 let detail_link = getTmdbLink(final.tmdb_id, final.category);
                 html += `🆔 TMDB：<a href="${detail_link}" target="_blank" style="color:#3e84f4;">${final.tmdb_id}</a>`;
            }
            tip.showText(html);
        } else {
            tip.showText(`⚠️ 未能识别出有效元数据`);
        }
    }).catch(error => {
        tip.showText(`❌ <b>错误:</b><br>${error.message}`);
    });
}

// --- 主执行逻辑 ---
(function () {
    'use strict';
    
    // UI 初始化
    class RecognizeTip {
        constructor() {
            const div = document.createElement('div');
            div.hidden = true;
            div.setAttribute('style', `
                position:absolute!important; font-size:13px!important; overflow:auto!important;
                background:#fff!important; font-family:sans-serif,Arial!important;
                text-align:left!important; color:#333!important; padding:10px!important;
                line-height:1.6em!important; border-radius:8px!important;
                border:1px solid #ddd!important; box-shadow:0 4px 12px rgba(0,0,0,0.15)!important;
                max-width:300px!important; z-index:999999!important;
            `);
            document.documentElement.appendChild(div);
            div.addEventListener('mouseup', e => e.stopPropagation());
            this._tip = div;
        }
        showText(text) { this._tip.innerHTML = text; this._tip.hidden = !1; }
        hide() { this._tip.hidden = true; }
        pop(ev) {
            this._tip.style.top = ev.pageY + 15 + 'px';
            this._tip.style.left = (ev.pageX + 320 <= document.body.clientWidth ? ev.pageX : ev.pageX - 320) + 'px';
        }
    }
    const tip = new RecognizeTip();

    class Icon {
        constructor() {
            const icon = document.createElement('span');
            icon.hidden = true;
            icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e84f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
            icon.setAttribute('style', `
                width:28px!important; height:28px!important; background:#fff!important;
                border-radius:50%!important; box-shadow:0 2px 8px rgba(0,0,0,0.2)!important;
                position:absolute!important; z-index:999999!important; display:flex;
                align-items:center; justify-content:center; cursor:pointer;
            `);
            document.documentElement.appendChild(icon);
            icon.addEventListener('mousedown', e => e.preventDefault(), true);
            icon.addEventListener('click', ev => {
                const text = window.getSelection().toString().trim();
                if (text) {
                    this._icon.hidden = true;
                    tip.pop(ev);
                    creatRecognizeTip(tip, text);
                }
            });
            this._icon = icon;
        }
        pop(ev) {
            this._icon.style.top = ev.pageY + 10 + 'px';
            this._icon.style.left = ev.pageX + 10 + 'px';
            this._icon.hidden = !1;
        }
        hide() { this._icon.hidden = true; }
    }
    const icon = new Icon();

    document.addEventListener('mouseup', function (e) {
        var text = window.getSelection().toString().trim();
        if (!text) {
            icon.hide();
            tip.hide();
        } else if (windowPopup) {
            icon.pop(e);
        }
    });

    // 站点适配逻辑
    if (site_domain.includes('m-team')) {
        waitForElements(['ant-descriptions-row']).then((elementsArray) => {
            ptype = 'm-team';
            let rows = elementsArray[0];
            let torrent_name = "";
            try {
                 torrent_name = rows[0].innerText.split('\n')[1] || rows[0].textContent; 
            } catch(e) {}
            
            let table = rows[0].parentNode;
            let row = table.insertRow(2);
            row.className = 'ant-descriptions-row';
            if (torrent_name) creatRecognizeRow(row, ptype, torrent_name);
        }).catch(() => {});
    } 
    else if (site_domain.includes('hhanclub')) {
        waitForElements(['font-bold leading-6']).then((elementsArray) => {
            ptype = 'hhanclub';
            let divs = elementsArray[0];
            let torrent_name = divs[3].innerText; 
            if (torrent_name) {
                divs[3].insertAdjacentHTML('afterend', '<div class="font-bold leading-6">ANIME Pro Matcher</div><div class="font-light leading-6 flex flex-wrap"><div id="apm_result" class="font-light leading-6 flex"></div></div>');
                let row = document.getElementById("apm_result");
                creatRecognizeRow(row, ptype, torrent_name);
            }
        }).catch(() => {});
    } 
    else {
        waitForElements(['rowhead']).then((elementsArray) => {
            ptype = 'common';
            let rows = elementsArray[0];
            let torrent_name = "";
            try {
                 let link = rows[0].nextElementSibling.querySelector('a');
                 if(link) torrent_name = link.innerText || link.title;
                 if(!torrent_name) torrent_name = rows[0].nextElementSibling.innerText;
                 torrent_name = torrent_name.replace(/^\[.*?\]\s*/, '');
            } catch (e) {}

            let table = rows[1].parentNode.parentNode.parentNode;
            if (table.tagName !== 'TABLE') table = table.closest('table');
            
            if (torrent_name) {
                let row = table.insertRow(2);
                creatRecognizeRow(row, ptype, torrent_name);
            }
        }).catch(() => {});
    }
})();