// ==UserScript==
// @name         HH批量删种助手
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  HHClub 专用独立删种工具。修复删种表单参数结构错误，优化冗余计算逻辑（必须选规格才计算），提高安全性。
// @author       kk & sagiri
// @match        *://hhanclub.top/torrents.php*
// @icon         https://hhanclub.top/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561624/HH%E6%89%B9%E9%87%8F%E5%88%A0%E7%A7%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561624/HH%E6%89%B9%E9%87%8F%E5%88%A0%E7%A7%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const DELETE_REASON = '合集已出，删除分集';
    const REASON_TYPE = '5'; // 5 = 其他
    
    // --- 全局变量 ---
    let allTorrents = [];
    let isScanning = false;
    
    // 筛选状态
    let selectedPlatform = null;
    let selectedSpec = null;
    let selectedUploaders = new Set(); 
    
    let redundancyData = [];

    // --- 样式 ---
    const styles = `
        /* 开关按钮 */
        #hh-panel-toggle-btn {
            position: fixed; top: 15px; right: 15px; z-index: 10000;
            width: 30px; height: 30px; line-height: 30px; text-align: center;
            background: #e74c3c; color: white; border-radius: 50%;
            cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            font-size: 16px; user-select: none; border: 2px solid #fff;
            transition: transform 0.2s;
        }
        #hh-panel-toggle-btn:hover { transform: scale(1.1); }

        /* 主面板 */
        #hh-deleter-panel {
            position: fixed; top: 80px; right: 20px; z-index: 9999;
            width: 420px; min-width: 300px; min-height: 600px;
            max-height: 90vh;
            background: #2c3e50; color: #ecf0f1;
            border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            font-family: 'Segoe UI', sans-serif; font-size: 12px;
            border: 1px solid #e74c3c; display: flex; flex-direction: column;
            resize: both; overflow: hidden;
        }
        #hh-deleter-header {
            background: #c0392b; color: white; padding: 8px 15px;
            font-weight: bold; cursor: move; flex-shrink: 0;
            display: flex; justify-content: space-between; align-items: center;
        }
        #hh-deleter-body { 
            padding: 10px; overflow-y: auto; flex: 1; 
            display: flex; flex-direction: column; min-height: 0;
        }
        
        .hh-section { margin-bottom: 10px; border-bottom: 1px solid #34495e; padding-bottom: 8px; flex-shrink: 0; }
        .hh-section.list-section { border-bottom: none; flex: 1; display: flex; flex-direction: column; min-height: 150px; }
        
        .hh-label { color: #f39c12; font-weight: bold; display: block; margin-bottom: 4px; font-size: 12px; }
        
        .hh-btn {
            border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;
            font-weight: bold; width: 100%; transition: 0.2s; color: white;
            margin-top: 5px; flex-shrink: 0; font-size: 12px;
        }
        .hh-btn-scan { background: #2980b9; }
        .hh-btn-scan:hover { background: #3498db; }
        .hh-btn-del { background: #e74c3c; }
        .hh-btn-del:hover { background: #c0392b; }
        .hh-btn:disabled { background: #7f8c8d; cursor: not-allowed; opacity: 0.7; }
        
        .hh-btn-sm { width: auto; padding: 2px 8px; font-size: 11px; margin-top: 0; margin-left: 5px; }

        .hh-tag-container { display: flex; flex-wrap: wrap; gap: 4px; max-height: 80px; overflow-y: auto; }
        .hh-tag {
            background: #34495e; padding: 2px 6px; border-radius: 4px;
            cursor: pointer; font-size: 11px; user-select: none;
            border: 1px solid #566573; color: #bdc3c7;
        }
        .hh-tag:hover { border-color: #f39c12; color: #fff; }
        .hh-tag.active { background: #f39c12; color: #fff; border-color: #e67e22; }

        .hh-del-list { 
            background: rgba(0,0,0,0.2); border: 1px solid #7f8c8d; 
            flex: 1; overflow-y: auto; border-radius: 4px; margin-bottom: 5px;
        }
        .hh-del-item {
            display: flex; align-items: flex-start; padding: 5px;
            border-bottom: 1px solid #34495e; font-size: 11px;
        }
        .hh-del-item:last-child { border-bottom: none; }
        .hh-del-item:hover { background: rgba(231, 76, 60, 0.1); }
        .hh-del-check { margin-right: 8px; margin-top: 3px; }
        .hh-del-info { flex: 1; overflow: hidden; }
        .hh-del-title { color: #bdc3c7; margin-bottom: 2px; }
        .hh-del-sub { color: #f39c12; font-weight: bold; }
        .hh-del-meta { color: #95a5a6; font-size: 10px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
        .hh-del-status { margin-left: 5px; font-weight: bold; }
        
        .hh-del-list::-webkit-scrollbar { width: 5px; }
        .hh-del-list::-webkit-scrollbar-thumb { background: #f39c12; border-radius: 3px; }
        .hh-tag-container::-webkit-scrollbar { width: 4px; }
        .hh-tag-container::-webkit-scrollbar-thumb { background: #7f8c8d; border-radius: 2px; }
        .hh-toolbar { display: flex; justify-content: flex-end; margin-bottom: 5px; }
    `;

    // --- 解析器 ---
    function parseSizeToBytes(str) {
        if (!str) return 0;
        const regex = /(\d+(?:\.\d+)?)\s*([TGMK]?i?B)/i;
        const match = str.match(regex);
        if (!match) return 0;
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        let power = 0;
        if (unit.includes('T')) power = 4;
        else if (unit.includes('G')) power = 3;
        else if (unit.includes('M')) power = 2;
        else if (unit.includes('K')) power = 1;
        return val * Math.pow(1024, power);
    }

    function parseTorrentRow(row) {
        const titleEl = row.querySelector('.torrent-info-text-name');
        const subTitleEl = row.querySelector('.torrent-info-text-small_name');
        const sizeEl = row.querySelector('.torrent-info-text-size');
        const uploaderEl = row.querySelector('.torrent-info-text-author');
        
        let id = "";
        const dlNode = row.querySelector('a[href^="download.php"]');
        if (dlNode) {
            const m = dlNode.href.match(/id=(\d+)/);
            if(m) id = m[1];
        } else {
             const linkEl = row.querySelector('a[href^="torrents.php?id="]');
             if (linkEl) {
                 const m = linkEl.href.match(/id=(\d+)/);
                 if (m) id = m[1];
             }
        }

        const title = titleEl ? titleEl.textContent.trim() : "";
        const subTitle = subTitleEl ? subTitleEl.textContent.trim() : "";
        const sizeStr = sizeEl ? sizeEl.textContent.trim() : "0 B";
        const sizeBytes = parseSizeToBytes(sizeStr);
        
        let uploader = "未知发布者";
        if (uploaderEl) {
            const uploaderLink = uploaderEl.querySelector('.Uploader_Name') || uploaderEl.querySelector('.Administrator_Name') || uploaderEl.querySelector('a');
            if (uploaderLink) uploader = uploaderLink.textContent.trim();
            else uploader = uploaderEl.textContent.trim().split('(')[0].trim();
        }

        let timeAdded = 0;
        const timeNode = row.querySelector('.torrent-info-text-added');
        if (timeNode) {
            const t = new Date(timeNode.textContent.trim()).getTime();
            if (!isNaN(t)) timeAdded = t;
        }

        // --- 1. 平台提取 (Platform) ---
        let platform = "普通";
        const platformRegex = /\b(2160p|1080p|720p)\s+(.*?)\s+WEB-?DL/i;
        const pMatch = title.match(platformRegex);
        if (pMatch && pMatch[2]) {
            let rawP = pMatch[2].replace(/V\d/gi, '').trim();
            rawP = rawP.replace(/\s+/g, ' ');
            if (rawP.length > 0 && rawP.length < 15) {
                platform = rawP.toUpperCase();
            }
        }

        // --- 2. 规格提取 (Spec) ---
        let spec = ""; 
        if (subTitle.includes('|')) {
            const parts = subTitle.split('|').map(p => p.trim());
            const specKeywords = /(2160p|1080[pi]|720p|4k|8k|HQ|高码|60帧|HDR|DoVi|杜比|HEVC|H\.?265|AVC)/i;
            const excludeKeywords = /(类型|导演|主演|简介|全\d+集|\d+集全|第\s*\d+)/i;
            for (const part of parts) {
                if (specKeywords.test(part) && !excludeKeywords.test(part)) {
                    spec = part; 
                    break; 
                }
            }
        }
        if (!spec) {
            if (title.match(/2160p|4k/i)) spec = "4K";
            else if (title.match(/1080p/i)) spec = "1080P";
            else if (title.match(/720p/i)) spec = "720P";
            else spec = "其他";
        }
        
        // --- 完结/全集 识别 ---
        let isComplete = false;
        const tagEls = row.querySelectorAll('.tag');
        tagEls.forEach(t => {
            if (t.textContent.trim() === '完结') isComplete = true;
        });
        if (subTitle.match(/(全\s*\d+\s*集|^\d+\s*集全|Complete)/i)) isComplete = true;

        // --- 集数识别 ---
        let episodes = [];
        if (subTitle) {
            const fullMatch = subTitle.match(/(?:全\s*(\d+)\s*集)|(?:(\d+)\s*集全)/);
            const rangeMatch = subTitle.match(/第\s*(\d+)(?:\s*-\s*(\d+))?\s*集/);
            const singleMatch = subTitle.match(/第\s*(\d+)\s*集/);
            if (fullMatch) {
                const count = parseInt(fullMatch[1] || fullMatch[2]);
                for (let i = 1; i <= count; i++) episodes.push(i);
                episodes.isFull = true;
            } else if (rangeMatch) {
                const start = parseInt(rangeMatch[1]);
                const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : start;
                for (let i = start; i <= end; i++) episodes.push(i);
            } else if (singleMatch) {
                episodes.push(parseInt(singleMatch[1]));
            }
        }

        let mainTitle = title;
        if (title) {
            mainTitle = title.replace(/\s+S\d+.*/i, '')
                             .replace(/\s+\d{4}.*/, '') 
                             .replace(/\s+(1080p|2160p|4K|WEB-DL).*/i, '')
                             .trim();
        }

        return { 
            id, title, subTitle, mainTitle, 
            platform, spec, 
            episodes, sizeBytes, sizeStr, timeAdded, isComplete, uploader,
            element: row, isDelete: false
        };
    }

    // --- 核心功能 ---

    async function scanPages() {
        if (isScanning) return;
        const btn = document.getElementById('hh-btn-scan');
        const status = document.getElementById('hh-status-text');
        
        isScanning = true;
        btn.disabled = true;
        btn.innerText = "扫描中...";
        allTorrents = [];
        
        const urlParams = new URLSearchParams(window.location.search);
        let baseUrl = window.location.href.replace(/&page=\d+/, '');
        if (!baseUrl.includes('?')) baseUrl += '?';

        let maxPage = 0;
        let currentPage = parseInt(urlParams.get('page')) || 0;
        document.querySelectorAll('a[href*="page="]').forEach(a => {
            const m = a.href.match(/page=(\d+)/);
            if (m) {
                const p = parseInt(m[1]);
                if (p > maxPage) maxPage = p;
            }
        });

        const parser = new DOMParser();
        for (let p = 0; p <= maxPage; p++) {
            status.innerText = `正在扫描第 ${p+1}/${maxPage+1} 页...`;
            try {
                let doc;
                if (p === currentPage && p === 0) { 
                    doc = document;
                } else {
                    const fetchUrl = baseUrl + (baseUrl.endsWith('?')?'':'&') + `page=${p}`;
                    const res = await fetch(fetchUrl);
                    const html = await res.text();
                    doc = parser.parseFromString(html, "text/html");
                }
                
                const rows = doc.querySelectorAll('.torrent-table-sub-info');
                rows.forEach(row => {
                    allTorrents.push(parseTorrentRow(row));
                });
            } catch (e) {
                console.error(e);
            }
            if (p !== currentPage) await new Promise(r => setTimeout(r, 600));
        }

        isScanning = false;
        btn.disabled = false;
        btn.innerText = "重新扫描";
        status.innerText = `扫描完成，共 ${allTorrents.length} 个种子。`;
        
        renderFilters();
    }

    // 渲染筛选器
    function renderFilters() {
        // 1. 平台
        const platformContainer = document.getElementById('hh-platform-container');
        if (platformContainer.children.length === 0 || platformContainer.innerHTML.includes("等待数据")) {
            platformContainer.innerHTML = '';
            const platforms = new Set(allTorrents.map(t => t.platform));
            
            if (platforms.size === 0) {
                platformContainer.innerHTML = '<span style="color:#aaa">无数据</span>';
            } else {
                Array.from(platforms).sort().forEach(pf => {
                    const tag = document.createElement('div');
                    tag.className = `hh-tag ${pf === selectedPlatform ? 'active' : ''}`;
                    tag.innerText = pf;
                    tag.onclick = () => {
                        if (selectedPlatform === pf) selectedPlatform = null; 
                        else selectedPlatform = pf;
                        
                        Array.from(platformContainer.children).forEach(c => c.classList.remove('active'));
                        if (selectedPlatform) tag.classList.add('active');
                        
                        calculateRedundancy();
                    };
                    platformContainer.appendChild(tag);
                });
            }
        }

        // 2. 规格
        const specContainer = document.getElementById('hh-spec-container');
        if (specContainer.children.length === 0 || specContainer.innerHTML.includes("等待数据")) {
            specContainer.innerHTML = '';
            const specs = new Set(allTorrents.map(t => t.spec));
            
            if (specs.size === 0) {
                specContainer.innerHTML = '<span style="color:#aaa">无数据</span>';
            } else {
                Array.from(specs).sort().forEach(sp => {
                    const tag = document.createElement('div');
                    tag.className = `hh-tag ${sp === selectedSpec ? 'active' : ''}`;
                    tag.innerText = sp;
                    tag.onclick = () => {
                        if (selectedSpec === sp) selectedSpec = null;
                        else selectedSpec = sp;

                        Array.from(specContainer.children).forEach(c => c.classList.remove('active'));
                        if (selectedSpec) tag.classList.add('active');

                        calculateRedundancy();
                    };
                    specContainer.appendChild(tag);
                });
            }
        }

        // 3. 发布人
        const uploaderContainer = document.getElementById('hh-uploader-container');
        if (uploaderContainer.children.length === 0 || uploaderContainer.innerHTML.includes("等待数据")) {
            uploaderContainer.innerHTML = '';
            const uploaders = new Set(allTorrents.map(t => t.uploader));

            if (uploaders.size === 0) {
                 uploaderContainer.innerHTML = '<span style="color:#aaa">无数据</span>';
            } else {
                const allTag = document.createElement('div');
                allTag.className = `hh-tag ${selectedUploaders.size === 0 ? 'active' : ''}`;
                allTag.innerText = "全部";
                allTag.onclick = () => {
                    selectedUploaders.clear();
                    updateUploaderUI();
                    calculateRedundancy();
                };
                uploaderContainer.appendChild(allTag);

                Array.from(uploaders).sort().forEach(upl => {
                    const tag = document.createElement('div');
                    tag.className = `hh-tag ${selectedUploaders.has(upl) ? 'active' : ''}`;
                    tag.innerText = upl;
                    tag.setAttribute('data-val', upl);
                    tag.onclick = () => {
                        if (selectedUploaders.has(upl)) {
                            selectedUploaders.delete(upl);
                        } else {
                            selectedUploaders.add(upl);
                        }
                        updateUploaderUI();
                        calculateRedundancy();
                    };
                    uploaderContainer.appendChild(tag);
                });
            }
        }
    }
    
    function updateUploaderUI() {
        const container = document.getElementById('hh-uploader-container');
        const tags = container.querySelectorAll('.hh-tag');
        tags.forEach(tag => {
            if (tag.innerText === "全部") {
                tag.className = `hh-tag ${selectedUploaders.size === 0 ? 'active' : ''}`;
            } else {
                const val = tag.getAttribute('data-val');
                tag.className = `hh-tag ${selectedUploaders.has(val) ? 'active' : ''}`;
            }
        });
    }

    function calculateRedundancy() {
        const listContainer = document.getElementById('hh-del-list');
        const btnDelete = document.getElementById('hh-btn-del');
        const info = document.getElementById('hh-select-info');
        
        listContainer.innerHTML = '';
        btnDelete.disabled = true;
        redundancyData = [];

        // 重置状态
        allTorrents.forEach(t => t.isDelete = false);

        // 核心修正：如果只选了平台但没选规格，或者都没选，则不计算
        // 防止 "Netflix 1080p" 被误认为 "Netflix 4K" 的冗余
        if (!selectedSpec) {
            listContainer.innerHTML = '<div style="padding:10px; text-align:center; color:#aaa">请选择具体的【规格】以进行安全删种<br>(仅选平台无法准确判断画质冗余)</div>';
            info.innerText = '';
            return;
        }

        // 过滤
        const targets = allTorrents.filter(t => {
            if (selectedPlatform && t.platform !== selectedPlatform) return false;
            if (selectedSpec && t.spec !== selectedSpec) return false;
            if (selectedUploaders.size > 0 && !selectedUploaders.has(t.uploader)) return false;
            return true;
        });
        
        const groups = {};
        targets.forEach(t => {
            if (!groups[t.mainTitle]) groups[t.mainTitle] = [];
            groups[t.mainTitle].push(t);
        });

        Object.values(groups).forEach(group => {
            if (group.length < 2) return; 

            // 排序：完结 > 集数多 > 体积大
            group.sort((a, b) => {
                if (a.isComplete !== b.isComplete) return b.isComplete - a.isComplete; 
                const lenA = a.episodes.length;
                const lenB = b.episodes.length;
                if (lenA !== lenB) return lenB - lenA; 
                return b.sizeBytes - a.sizeBytes;
            });

            for (let i = 0; i < group.length; i++) {
                const keeper = group[i];
                if (keeper.isDelete) continue; 

                for (let j = i + 1; j < group.length; j++) {
                    const candidate = group[j];
                    if (candidate.isDelete) continue;
                    
                    if (candidate.isComplete) continue;

                    let isSubset = false;
                    if (keeper.isComplete && candidate.episodes.length > 0) {
                        isSubset = true;
                    } else if (keeper.episodes.length > 0 && candidate.episodes.length > 0) {
                        isSubset = candidate.episodes.every(ep => keeper.episodes.includes(ep));
                    }
                    
                    if (isSubset) {
                        candidate.isDelete = true;
                        candidate.keeperTitle = keeper.subTitle || keeper.title;
                        candidate.keeperId = keeper.id;
                        
                        // --- 添加覆盖源信息 ---
                        candidate.keeperUploader = keeper.uploader;
                        candidate.keeperSpec = keeper.spec; 
                        let kEp = "未知集数";
                        if (keeper.isComplete) {
                            kEp = "全集";
                            const m = (keeper.subTitle||"").match(/全\s*(\d+)\s*集/);
                            if(m) kEp = `全${m[1]}集`;
                        } else if (keeper.episodes.length > 0) {
                             if (keeper.episodes.length === 1) kEp = `第${keeper.episodes[0]}集`;
                             else kEp = `第${keeper.episodes[0]}-${keeper.episodes[keeper.episodes.length-1]}集`;
                        }
                        candidate.keeperEpText = kEp;

                        redundancyData.push(candidate);
                    }
                }
            }
        });

        redundancyData.sort((a, b) => {
            const epA = a.episodes.length > 0 ? a.episodes[0] : 0;
            const epB = b.episodes.length > 0 ? b.episodes[0] : 0;
            return epB - epA; 
        });

        renderDeleteList();
    }

    function renderDeleteList() {
        const listContainer = document.getElementById('hh-del-list');
        const btnDelete = document.getElementById('hh-btn-del');
        const info = document.getElementById('hh-select-info');
        
        listContainer.innerHTML = '';
        
        if (redundancyData.length === 0) {
            listContainer.innerHTML = '<div style="padding:10px; text-align:center; color:#aaa">未发现冗余分集。</div>';
            info.innerText = '';
            btnDelete.innerText = "无待删除项";
            return;
        }

        redundancyData.forEach(item => {
            const el = document.createElement('div');
            el.className = 'hh-del-item';
            
            const displayTitle = item.subTitle || item.title;
            const episodeText = item.episodes.length > 0 ? `[集:${item.episodes.join(',')}]` : '[集:未知]';
            const checkedAttr = item.isComplete ? '' : 'checked';
            const disableAttr = item.isComplete ? 'disabled' : '';
            const warningText = item.isComplete ? '<span style="color:red;font-weight:bold">[保护:完结]</span>' : '';
            
            const keeperDisplay = `[${escapeHtml(item.keeperUploader)}] [${escapeHtml(item.keeperSpec)}] [${item.keeperEpText}]`;
            
            let metaDisplay = `
                <span style="color:#bdc3c7;">[${escapeHtml(item.uploader)}]</span> 
                ${episodeText} | ${item.sizeStr} | 
                <span style="color:#2ecc71" title="${escapeHtml(item.keeperTitle)}">
                    覆盖源: ${keeperDisplay}
                </span>
            `;

            el.innerHTML = `
                <input type="checkbox" class="hh-del-check" value="${item.id}" ${checkedAttr} ${disableAttr}>
                <div class="hh-del-info">
                    <div class="hh-del-title" title="${item.mainTitle}">${item.mainTitle}</div>
                    <div class="hh-del-sub" title="副标题">${escapeHtml(displayTitle)} ${warningText}</div>
                    <div class="hh-del-meta" title="${episodeText}">
                         ${metaDisplay}
                        <span class="hh-del-status" id="status-${item.id}"></span>
                    </div>
                </div>
            `;
            listContainer.appendChild(el);
        });

        const updateCount = () => {
            const count = listContainer.querySelectorAll('.hh-del-check:checked').length;
            btnDelete.disabled = count === 0;
            btnDelete.innerText = count > 0 ? `确认删除选中 (${count})` : `请选择`;
            info.innerText = `发现 ${redundancyData.length} 个冗余，已选 ${count} 个`;
        };

        listContainer.querySelectorAll('.hh-del-check').forEach(cb => {
            cb.addEventListener('change', updateCount);
        });

        updateCount();
    }

    // 5. 执行删除 (Payload 修正版)
    async function executeDelete() {
        const checks = document.querySelectorAll('.hh-del-check:checked');
        const ids = Array.from(checks).map(c => c.value);
        
        if (ids.length === 0) return;
        if (!confirm(`⚠️ 危险操作确认 ⚠️\n\n即将删除 ${ids.length} 个种子！\n删种理由：${DELETE_REASON}\n\n确定要继续吗？此操作不可恢复！`)) return;

        const btn = document.getElementById('hh-btn-del');
        btn.disabled = true;
        btn.innerText = "正在删除...";

        let processed = 0;
        let successCount = 0;
        
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const statusEl = document.getElementById(`status-${id}`);
            if(statusEl) statusEl.innerText = "⏳...";

            try {
                const editUrl = `https://hhanclub.top/edit.php?id=${id}`;
                // 获取 token 或 referer 信息（虽然主要靠伪造 referer，但为了获取 returnto 流程完整）
                const editHtml = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: editUrl,
                        onload: (r) => resolve(r.responseText),
                        onerror: reject
                    });
                });
                
                const parser = new DOMParser();
                const doc = parser.parseFromString(editHtml, 'text/html');
                const delForm = doc.querySelector('form[action="delete.php"]');
                
                if (!delForm) {
                    throw new Error("未找到删除表单");
                }

                const fd = new URLSearchParams();
                const inputs = delForm.querySelectorAll('input, select, textarea');
                
                // 仅为了获取 returnto 等隐藏字段，reason[] 手动构造
                inputs.forEach(input => {
                    if (!input.name) return;
                    if (input.name !== 'reason[]') {
                        fd.append(input.name, input.value);
                    }
                });

                // --- 关键修正：构造 4 个 reason[] ---
                fd.append('reason[]', ''); // 1 (重复)
                fd.append('reason[]', ''); // 2 (劣质)
                fd.append('reason[]', ''); // 3 (违规)
                fd.append('reason[]', DELETE_REASON); // 4 (其他 - 对应 type 5)
                
                fd.set('reasontype', REASON_TYPE);
                fd.set('sure', '1');

                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `https://hhanclub.top/delete.php`,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': editUrl
                        },
                        data: fd.toString(),
                        onload: (res) => {
                            if (res.finalUrl.includes('torrents.php') || res.responseText.includes('成功删除') || res.responseText.includes('已删除')) {
                                successCount++;
                                if(statusEl) {
                                    statusEl.innerText = "✔ 已删";
                                    statusEl.style.color = "#2ecc71";
                                    statusEl.closest('.hh-del-item').style.opacity = '0.4';
                                }
                            } else {
                                console.warn(`[HH] 删除失败 ID:${id}`, res.responseText.substring(0, 300));
                                if(statusEl) {
                                    statusEl.innerText = "❌ 失败";
                                    statusEl.style.color = "#e74c3c";
                                }
                            }
                            resolve();
                        },
                        onerror: (e) => {
                            console.error(e);
                            reject(e);
                        }
                    });
                });

            } catch (e) {
                console.error(e);
                if(statusEl) statusEl.innerText = "❌ 错误";
            }
            
            processed++;
            await new Promise(r => setTimeout(r, 600));
        }
        
        alert(`操作完成。\n成功：${successCount}\n总计：${processed}`);
        btn.innerText = "删除完成";
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    
    function toggleAll(checked) {
         const listContainer = document.getElementById('hh-del-list');
         listContainer.querySelectorAll('.hh-del-check:not([disabled])').forEach(cb => {
             cb.checked = checked;
             cb.dispatchEvent(new Event('change')); 
         });
    }

    function initUI() {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = styles;
        document.head.appendChild(styleEl);

        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'hh-panel-toggle-btn';
        toggleBtn.innerText = '🗑️';
        toggleBtn.title = '显示/隐藏批量删种助手';
        toggleBtn.onclick = () => {
            const p = document.getElementById('hh-deleter-panel');
            p.style.display = p.style.display === 'none' ? 'flex' : 'none';
        };
        document.body.appendChild(toggleBtn);

        const panel = document.createElement('div');
        panel.id = 'hh-deleter-panel';
        panel.innerHTML = `
            <div id="hh-deleter-header">
                <span>HH 批量删种助手 v3.1</span>
                <span style="font-size:10px; opacity:0.8; cursor:pointer;" onclick="this.parentElement.parentElement.style.display='none'">[隐藏]</span>
            </div>
            <div id="hh-deleter-body">
                <div class="hh-section">
                    <span class="hh-label">1. 数据准备 (进入搜索页自动扫描)</span>
                    <div id="hh-status-text" style="color:#bdc3c7; font-size:11px; margin-bottom:5px;">等待扫描...</div>
                    <button id="hh-btn-scan" class="hh-btn hh-btn-scan">重新扫描</button>
                </div>

                <div class="hh-section">
                    <span class="hh-label">2. 筛选平台 (Platform)</span>
                    <div id="hh-platform-container" class="hh-tag-container">
                        <span style="color:#7f8c8d; font-size:11px;">等待数据...</span>
                    </div>
                </div>

                <div class="hh-section">
                    <span class="hh-label">3. 筛选规格 (Spec)</span>
                    <div id="hh-spec-container" class="hh-tag-container">
                        <span style="color:#7f8c8d; font-size:11px;">等待数据...</span>
                    </div>
                </div>

                <div class="hh-section">
                    <span class="hh-label">4. 筛选发布人 (可选)</span>
                    <div id="hh-uploader-container" class="hh-tag-container">
                        <span style="color:#7f8c8d; font-size:11px;">等待数据...</span>
                    </div>
                </div>

                <div class="hh-section list-section">
                    <span class="hh-label">5. 确认删除列表 (自动勾选冗余, 降序)</span>
                    <div class="hh-toolbar">
                        <button id="hh-sel-all" class="hh-btn hh-btn-scan hh-btn-sm">全选</button>
                        <button id="hh-sel-none" class="hh-btn hh-btn-scan hh-btn-sm" style="background:#7f8c8d">全不选</button>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span id="hh-select-info" style="color:#f39c12; font-size:11px;"></span>
                    </div>
                    <div id="hh-del-list" class="hh-del-list">
                        <div style="padding:10px; text-align:center; color:#aaa">暂无数据</div>
                    </div>
                    <button id="hh-btn-del" class="hh-btn hh-btn-del" disabled>请先扫描并选择</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('hh-btn-scan').onclick = scanPages;
        document.getElementById('hh-btn-del').onclick = executeDelete;
        
        document.getElementById('hh-sel-all').onclick = () => toggleAll(true);
        document.getElementById('hh-sel-none').onclick = () => toggleAll(false);

        const header = document.getElementById('hh-deleter-header');
        let isDragging = false;
        let startX, startY, initLeft, initTop;

        header.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            initLeft = rect.left;
            initTop = rect.top;
            document.onmousemove = (me) => {
                if (!isDragging) return;
                panel.style.left = (initLeft + me.clientX - startX) + 'px';
                panel.style.top = (initTop + me.clientY - startY) + 'px';
                panel.style.right = 'auto'; 
            };
            document.onmouseup = () => {
                isDragging = false;
                document.onmousemove = null;
            };
        };

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('search') && urlParams.get('search').trim() !== '') {
            setTimeout(scanPages, 800); 
        } else {
            document.getElementById('hh-status-text').innerText = '未检测到搜索关键词，请手动搜索后扫描。';
        }
    }

    initUI();

})();