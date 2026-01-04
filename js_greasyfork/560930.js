// ==UserScript==
// @name         HH综合助手
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  集成版本筛选、发布人筛选、缺集审计、无年份检查、跨季年份冲突检查、体积异常检查（<100MB）、批量下载。基于官方命名规范优化解析逻辑，默认仅显示HHWEB发布资源。
// @author       kk
// @match        *://hhanclub.top/torrents.php*
// @icon         https://hhanclub.top/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560930/HH%E7%BB%BC%E5%90%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560930/HH%E7%BB%BC%E5%90%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 存储键名 ---
    const STORAGE_KEY_POS = 'hh_audit_panel_pos';
    const STORAGE_KEY_YEAR_MODE = 'hh_audit_year_mode_v2';
    const STORAGE_KEY_YEAR_ERR_MODE = 'hh_audit_year_err_mode_v2';
    const STORAGE_KEY_SIZE_MODE = 'hh_audit_size_mode_v1';
    const STORAGE_KEY_EP_AUDIT_MODE = 'hh_audit_ep_mode_v1';
    const STORAGE_KEY_MASTER_SWITCH = 'hh_audit_master_switch';
    const STORAGE_KEY_COLLAPSED = 'hh_audit_panel_collapsed';
    const STORAGE_KEY_ONLY_HHWEB = 'hh_audit_only_hhweb';

    // --- 全局状态 ---
    const parseMode = (val) => {
        if (!val) return 0;
        return parseInt(val) || 0;
    };

    let yearCheckMode = parseMode(localStorage.getItem(STORAGE_KEY_YEAR_MODE));
    let yearErrCheckMode = parseMode(localStorage.getItem(STORAGE_KEY_YEAR_ERR_MODE));
    let sizeCheckMode = parseMode(localStorage.getItem(STORAGE_KEY_SIZE_MODE));
    let epAuditMode = localStorage.getItem(STORAGE_KEY_EP_AUDIT_MODE) === 'true';
    
    // 默认开启仅显示 HHWEB
    let isOnlyHHWEB = localStorage.getItem(STORAGE_KEY_ONLY_HHWEB) !== 'false';

    let isMasterSwitchOn = localStorage.getItem(STORAGE_KEY_MASTER_SWITCH) !== 'false';
    let isPanelCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';
    
    let selectedVersions = new Set();
    let selectedUploaders = new Set();
    let allTorrentData = [];

    // --- 样式定义 ---
    const styles = `
        #hh-audit-panel {
            position: fixed; z-index: 9999; background: #353C58; color: white;
            width: 280px; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.6);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid #F29D38; overflow: hidden; font-size: 13px;
            text-align: left; transition: height 0.3s;
        }
        #hh-audit-header {
            background: #191E32; padding: 12px; cursor: move;
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #F29D38; font-weight: bold; user-select: none;
        }
        #hh-audit-panel.collapsed #hh-audit-header { border-bottom: none; }
        
        .hh-toggle-btn {
            cursor: pointer; margin-right: 8px; font-size: 14px; 
            width: 20px; text-align: center; display: inline-block;
            transition: color 0.2s;
        }
        .hh-toggle-btn:hover { color: #F29D38; }

        .hh-audit-body { display: block; max-height: 80vh; overflow-y: auto; }
        .hh-audit-section { padding: 12px; border-bottom: 1px solid #4F5879; }
        .hh-audit-section:last-child { border-bottom: none; }
        .hh-section-title { color: #F29D38; font-weight: bold; margin-bottom: 8px; display: block; font-size: 12px; text-transform: uppercase; }
        
        .hh-version-list { display: flex; flex-wrap: wrap; gap: 6px; max-height: 100px; overflow-y: auto; }
        .hh-ver-item { background: #4F5879; padding: 3px 8px; border-radius: 4px; cursor: pointer; user-select: none; font-size: 11px; transition: background 0.2s; }
        .hh-ver-item:hover { background: #5E698A; }
        .hh-ver-item.active { background: #F29D38; color: #fff; }

        .hh-audit-info-box { background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; line-height: 1.6; }
        .hh-text-warning { color: #FFD700; font-weight: bold; word-break: break-all; }
        .hh-text-highlight { color: #00FFCC; }

        .hh-audit-btn {
            width: 100%; border: none; padding: 8px; border-radius: 5px; cursor: pointer;
            font-weight: bold; margin-top: 5px; transition: 0.2s;
        }
        .hh-btn-primary { background: #CDAE9C; color: #fff; }
        .hh-btn-primary:hover { background: #F29D38; }
        .hh-btn-download { background: #549DF7; color: #fff; }
        .hh-btn-download:hover { background: #2C86DA; }
        .hh-btn-danger { background: #E74C3C; color: #fff; }
        .hh-btn-danger:hover { background: #c0392b; }

        .hh-flex-row { display: flex; align-items: center; gap: 8px; }
        .hh-flex-col { display: flex; flex-direction: column; gap: 8px; }
        .hh-audit-row { display: flex; justify-content: space-between; align-items: center; }
        
        #hh-audit-panel input[type="number"] { width: 50px; padding: 4px; border-radius: 4px; border: none; color: #000; text-align: center; }
        #hh-audit-panel input[type="checkbox"] { cursor: pointer; }
        
        .hh-select {
            background: #4F5879; color: white; border: 1px solid #6c757d;
            border-radius: 4px; padding: 2px 4px; font-size: 11px; cursor: pointer; outline: none;
        }
        .hh-select:focus { border-color: #F29D38; }

        .hh-version-list::-webkit-scrollbar { width: 4px; }
        .hh-version-list::-webkit-scrollbar-thumb { background: #F29D38; border-radius: 2px; }
    `;

    // --- 辅助工具 ---
    
    function parseSizeToBytes(str) {
        if (!str) return 0;
        const units = { 'TB': 4, 'GB': 3, 'MB': 2, 'KB': 1, 'B': 0 };
        const regex = /(\d+(?:\.\d+)?)\s*(TB|GB|MB|KB|B)/i;
        const match = str.match(regex);
        if (!match) return 0;
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        return val * Math.pow(1024, units[unit] || 0);
    }

    // --- 核心逻辑 ---

    function parseTorrentRow(row) {
        const titleEl = row.querySelector('.torrent-info-text-name');
        const subTitleEl = row.querySelector('.torrent-info-text-small_name');
        const sizeEl = row.querySelector('.torrent-info-text-size');
        const uploaderEl = row.querySelector('.torrent-info-text-author');
        const dlLink = row.querySelector('a[href^="download.php"]')?.href;
        
        const title = titleEl ? titleEl.textContent.trim() : "";
        const subTitle = subTitleEl ? subTitleEl.textContent.trim() : "";
        const sizeStr = sizeEl ? sizeEl.textContent.trim() : "0 B";
        
        // 1. 发布者解析
        let uploader = "未知发布者";
        if (uploaderEl) {
            const uploaderLink = uploaderEl.querySelector('.Uploader_Name') || uploaderEl.querySelector('.Administrator_Name') || uploaderEl.querySelector('a');
            if (uploaderLink) {
                 uploader = uploaderLink.textContent.trim();
            } else {
                 uploader = uploaderEl.textContent.trim().split('(')[0].trim();
            }
        }

        // 2. 版本解析 (基于官方规范优化)
        let version = "常规版本";
        const verKeywords = /(2160p|1080[pi]|720p|4k|hq|高码|60帧|60fps|hdr|do?vi|hevc|h\.?265|avc|h\.?264|web-?dl|bluray|remux|iso|atmos|dts|aac|ddp|imax|edr|杜比|视界)/i;
        const excludeKeywords = /(类型|导演|主演|编剧|简介|IMDb|豆瓣|全\d+集|第\s*\d+|^\d+集全$)/i;

        if (subTitle) {
            const parts = subTitle.split('|').map(p => p.trim());
            for (const part of parts) {
                if (verKeywords.test(part) && !excludeKeywords.test(part)) {
                    version = part;
                    break; 
                }
            }
            if (version === "常规版本") {
                 const titleRes = title.match(/(2160p|1080[pi]|720p|4k)/i);
                 if (titleRes) {
                     version = titleRes[0].toUpperCase() + " (主标题)";
                 }
            }
        } else if (title) {
            const titleRes = title.match(/(2160p|1080[pi]|720p|4k)/i);
            if (titleRes) {
                version = titleRes[0].toUpperCase() + " (主标题)";
            }
        }

        // 3. 集数解析
        let episodes = [];
        if (subTitle) {
            const fullMatch = subTitle.match(/(?:全\s*(\d+)\s*集)|(?:(\d+)\s*集全)/);
            const rangeMatch = subTitle.match(/第\s*(\d+)(?:\s*-\s*(\d+))?\s*集/);
            
            if (fullMatch) {
                const count = parseInt(fullMatch[1] || fullMatch[2]);
                for (let i = 1; i <= count; i++) episodes.push(i);
            } else if (rangeMatch) {
                const start = parseInt(rangeMatch[1]);
                const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : start;
                for (let i = start; i <= end; i++) episodes.push(i);
            }
        }

        // 4. 年份解析
        let hasYear = false;
        let yearInt = null;
        if (title) {
            const yearMatch = title.match(/\b(19|20)\d{2}\b/);
            hasYear = !!yearMatch;
            yearInt = hasYear ? parseInt(yearMatch[0]) : null;
        }

        // 5. 剧名解析
        let mainTitle = "";
        if (title) {
            mainTitle = title.replace(/\s+S\d+.*/i, '') 
                             .replace(/\s+\d{4}.*/, '') 
                             .replace(/\s+(1080p|2160p|4K|WEB-DL).*/i, '')
                             .trim();
        }

        // 6. 体积解析 (<100MB)
        const sizeBytes = parseSizeToBytes(sizeStr);
        const thresholdBytes = 100 * 1024 * 1024; // 100 MB
        const isSmallFile = sizeBytes > 0 && sizeBytes < thresholdBytes;

        // 7. 判断是否为 HHWEB
        const isHHWEB = title.toUpperCase().includes('-HHWEB');

        return {
            element: row,
            divider: row.nextElementSibling,
            title,
            subTitle,
            mainTitle,
            version,
            uploader,
            episodes,
            hasYear,
            year: yearInt,
            isSmallFile,
            sizeStr,
            dlLink,
            isYearConflict: false,
            isHHWEB
        };
    }

    function checkYearConflicts() {
        const titleGroups = {};
        allTorrentData.forEach(item => {
            if (item.hasYear && item.mainTitle) {
                if (!titleGroups[item.mainTitle]) titleGroups[item.mainTitle] = new Set();
                titleGroups[item.mainTitle].add(item.year);
            }
        });

        allTorrentData.forEach(item => {
            if (item.hasYear && item.mainTitle && titleGroups[item.mainTitle] && titleGroups[item.mainTitle].size > 1) {
                const yearsArray = Array.from(titleGroups[item.mainTitle]);
                const maxYear = Math.max(...yearsArray);
                if (item.year === maxYear) item.isYearConflict = true;
                else item.isYearConflict = false;
            } else {
                item.isYearConflict = false;
            }
        });
    }

    function executeAudit() {
        const visibleEpisodes = new Set();
        let missingYearCount = 0;
        let conflictYearCount = 0;
        let smallFileCount = 0;

        checkYearConflicts();

        allTorrentData.forEach(item => {
            let show = true;
            
            // 0. HHWEB 专属过滤 (最高优先级)
            if (isOnlyHHWEB && !item.isHHWEB) show = false;

            // 1. 版本筛选
            if (selectedVersions.size > 0 && !selectedVersions.has(item.version)) show = false;
            if (selectedUploaders.size > 0 && !selectedUploaders.has(item.uploader)) show = false;
            
            // 2. 仅显模式过滤
            if (yearCheckMode === 2 && item.hasYear) show = false;
            if (yearErrCheckMode === 2 && !item.isYearConflict) show = false;
            if (sizeCheckMode === 2 && !item.isSmallFile) show = false;

            const titleEl = item.element.querySelector('.torrent-info-text-name');
            titleEl.style.backgroundColor = ''; 
            titleEl.style.color = '';

            if (show) {
                item.element.style.setProperty('display', 'flex', 'important');
                if (item.divider) item.divider.style.setProperty('display', 'block', 'important');
                
                // 高亮逻辑
                let isHighlighted = false;
                if (sizeCheckMode > 0 && item.isSmallFile) {
                    titleEl.style.backgroundColor = '#9B59B6';
                    titleEl.style.color = 'white';
                    smallFileCount++;
                    isHighlighted = true;
                }
                if (!isHighlighted && yearCheckMode > 0 && !item.hasYear) {
                    titleEl.style.backgroundColor = '#ff4d4d';
                    titleEl.style.color = 'white';
                    missingYearCount++;
                    isHighlighted = true;
                }
                if (!isHighlighted && yearErrCheckMode > 0 && item.isYearConflict) {
                    titleEl.style.backgroundColor = '#F29D38';
                    titleEl.style.color = 'white';
                    conflictYearCount++;
                    isHighlighted = true;
                }

                item.episodes.forEach(ep => visibleEpisodes.add(ep));
            } else {
                item.element.style.setProperty('display', 'none', 'important');
                if (item.divider) item.divider.style.setProperty('display', 'none', 'important');
            }
        });

        updateAuditInfoUI(Array.from(visibleEpisodes), missingYearCount, conflictYearCount, smallFileCount);
    }

    function updateAuditInfoUI(epList, noYearCount, conflictCount, smallCount) {
        const infoEl = document.getElementById('audit-info-display');
        const yearCountEl = document.getElementById('hh-year-count-tag');
        const yearErrCountEl = document.getElementById('hh-year-err-count-tag');
        const sizeCountEl = document.getElementById('hh-size-count-tag');
        
        if (!infoEl) return;

        if (!epAuditMode) {
             infoEl.innerHTML = "<div style='color:#aaa;text-align:center'>-- 审计已暂停 --</div>";
        } else if (epList.length === 0) {
            infoEl.innerHTML = "无匹配数据...";
        } else {
            epList.sort((a, b) => a - b);
            const maxEp = Math.max(...epList);
            const totalCount = epList.length;
            
            let missing = [];
            for (let i = 1; i <= maxEp; i++) {
                if (!epList.includes(i)) missing.push(i);
            }

            infoEl.innerHTML = `
                <div>目前最高集数: <span class="hh-text-highlight">${maxEp}</span></div>
                <div>已包含总集数: <span class="hh-text-highlight">${totalCount}</span></div>
                <div>缺少集数清单: <br><span class="${missing.length > 0 ? 'hh-text-warning' : 'hh-text-highlight'}">
                    ${missing.length > 0 ? (missing.length > 20 ? missing.slice(0,20).join(',')+'...' : missing.join(', ')) : '无'}
                </span></div>
            `;
        }

        if (yearCountEl) yearCountEl.innerText = yearCheckMode > 0 ? `(${noYearCount})` : "";
        if (yearErrCountEl) yearErrCountEl.innerText = yearErrCheckMode > 0 ? `(${conflictCount})` : "";
        if (sizeCountEl) sizeCountEl.innerText = sizeCheckMode > 0 ? `(${smallCount})` : "";
    }

    function batchDownload(count) {
        const targets = allTorrentData.filter(item => 
            item.element.style.display !== 'none' && item.dlLink
        ).slice(0, count);

        if (targets.length === 0) return alert("没有可见的种子可供下载");
        if (!confirm(`准备下载 ${targets.length} 个种子？`)) return;

        targets.forEach((item, index) => {
            setTimeout(() => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = item.dlLink;
                document.body.appendChild(iframe);
                setTimeout(() => document.body.removeChild(iframe), 2000);
            }, index * 800);
        });
    }
    
    // --- 动态渲染筛选列表 ---
    function renderFilterLists(panel) {
        const verContainer = panel.querySelector('#ver-list-container');
        const uploaderContainer = panel.querySelector('#uploader-list-container');
        
        if (!verContainer || !uploaderContainer) return;
        
        const versions = new Set();
        const uploaders = new Set();

        allTorrentData.forEach(item => {
            // 如果仅看HHWEB开启，则只收集HHWEB的属性
            if (isOnlyHHWEB && !item.isHHWEB) return;
            
            versions.add(item.version);
            uploaders.add(item.uploader);
        });
        
        const generateHtml = (set, type) => {
            return Array.from(set).sort().map(val => {
                // 检查是否在选中集合中，如果是则添加 active 类
                const isActive = (type === 'ver' ? selectedVersions.has(val) : selectedUploaders.has(val)) ? 'active' : '';
                return `<div class="hh-ver-item ${isActive}" data-type="${type}" data-val="${val}">${val}</div>`;
            }).join('');
        };

        verContainer.innerHTML = generateHtml(versions, 'ver');
        uploaderContainer.innerHTML = generateHtml(uploaders, 'uploader');
    }

    // --- UI 初始化 ---
    function initApp() {
        const hidePopupUI = () => {
            const popupSelectors = ['#user-info-panel', '#search-more-select'];
            popupSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) el.style.display = 'none';
            });
        };
        hidePopupUI();

        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const rows = document.querySelectorAll('.torrent-table-sub-info');
        // allTorrentData 初始化
        rows.forEach(row => {
            const data = parseTorrentRow(row);
            allTorrentData.push(data);
        });

        const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY_POS)) || { right: '20px', top: '100px' };
        const panel = document.createElement('div');
        panel.id = 'hh-audit-panel';
        if (isPanelCollapsed) panel.classList.add('collapsed');
        
        panel.style.top = savedPos.top;
        panel.style.left = savedPos.left;
        if (!savedPos.left) panel.style.right = savedPos.right;

        panel.innerHTML = `
            <div id="hh-audit-header">
                <div style="display:flex; align-items:center;">
                    <span id="hh-toggle-collapse-btn" class="hh-toggle-btn" title="收起/展开面板">${isPanelCollapsed ? '➕' : '➖'}</span>
                    <span>HH助手</span>
                </div>
                <input type="checkbox" id="audit-master-switch" ${isMasterSwitchOn ? 'checked' : ''} title="功能总开关">
            </div>
            
            <div id="hh-audit-content-wrapper" class="hh-audit-body" style="display: ${isPanelCollapsed ? 'none' : 'block'}">
                <div class="hh-audit-section">
                    <span class="hh-section-title">
                        1. 版本筛选 (支持多选)
                        <label style="float:right; cursor:pointer; font-size:11px; text-transform:none;">
                            <input type="checkbox" id="hhweb-only-toggle" ${isOnlyHHWEB ? 'checked' : ''}> 只看HHWEB
                        </label>
                    </span>
                    <div class="hh-version-list" id="ver-list-container"></div>
                </div>

                <div class="hh-audit-section">
                    <span class="hh-section-title">2. 发布人筛选 (支持多选)</span>
                    <div class="hh-version-list" id="uploader-list-container"></div>
                </div>

                <div class="hh-audit-section">
                    <span class="hh-section-title">3. 集数审计 (含合集识别)</span>
                    <label style="cursor:pointer; font-size:11px; margin-bottom:5px; display:block;">
                        <input type="checkbox" id="ep-audit-toggle" ${epAuditMode ? 'checked' : ''}> 仅显缺集/断档
                    </label>
                    <div class="hh-audit-info-box" id="audit-info-display">请勾选版本...</div>
                </div>

                <div class="hh-audit-section">
                    <span class="hh-section-title">4. 合规检查模块</span>
                    <div class="hh-flex-col">
                        <div class="hh-audit-row">
                            <label style="cursor:pointer" title="标题无年份">⚠️ 无年份检查 <span id="hh-year-count-tag" style="color:#F29D38; font-weight:bold"></span></label>
                            <select id="year-check-mode" class="hh-select">
                                <option value="0" ${yearCheckMode === 0 ? 'selected' : ''}>关闭</option>
                                <option value="1" ${yearCheckMode === 1 ? 'selected' : ''}>高亮</option>
                                <option value="2" ${yearCheckMode === 2 ? 'selected' : ''}>仅显</option>
                            </select>
                        </div>
                        <div class="hh-audit-row">
                            <label style="cursor:pointer" title="同剧名存在多个年份，且当前为最新">❓ 年份冲突检查 <span id="hh-year-err-count-tag" style="color:#F29D38; font-weight:bold"></span></label>
                            <select id="year-err-check-mode" class="hh-select">
                                <option value="0" ${yearErrCheckMode === 0 ? 'selected' : ''}>关闭</option>
                                <option value="1" ${yearErrCheckMode === 1 ? 'selected' : ''}>高亮</option>
                                <option value="2" ${yearErrCheckMode === 2 ? 'selected' : ''}>仅显</option>
                            </select>
                        </div>
                        <div class="hh-audit-row">
                            <label style="cursor:pointer" title="文件大小 < 100MB">📉 体积异常检查 <span id="hh-size-count-tag" style="color:#F29D38; font-weight:bold"></span></label>
                            <select id="size-check-mode" class="hh-select">
                                <option value="0" ${sizeCheckMode === 0 ? 'selected' : ''}>关闭</option>
                                <option value="1" ${sizeCheckMode === 1 ? 'selected' : ''}>高亮</option>
                                <option value="2" ${sizeCheckMode === 2 ? 'selected' : ''}>仅显</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="hh-audit-section">
                    <span class="hh-section-title">5. 批量操作</span>
                    <div class="hh-flex-row">
                        <input type="number" id="dl-count-input" value="5" min="1">
                        <button class="hh-audit-btn hh-btn-primary" id="btn-dl-n">下载前 N 个</button>
                    </div>
                    <button class="hh-audit-btn hh-btn-download" style="background:#549DF7" id="btn-dl-all">📥 下载所有筛选可见种子</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        makeDraggable(panel, document.getElementById('hh-audit-header'));
        
        // 初始渲染列表
        renderFilterLists(panel);

        // 收起/展开
        document.getElementById('hh-toggle-collapse-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            isPanelCollapsed = !isPanelCollapsed;
            localStorage.setItem(STORAGE_KEY_COLLAPSED, isPanelCollapsed);
            
            const contentWrapper = document.getElementById('hh-audit-content-wrapper');
            if (isPanelCollapsed) {
                contentWrapper.style.display = 'none';
                e.target.innerText = '➕';
                panel.classList.add('collapsed');
            } else {
                contentWrapper.style.display = 'block';
                e.target.innerText = '➖';
                panel.classList.remove('collapsed');
            }
        });
        
        // 仅HHWEB开关
        document.getElementById('hhweb-only-toggle').addEventListener('change', (e) => {
            isOnlyHHWEB = e.target.checked;
            localStorage.setItem(STORAGE_KEY_ONLY_HHWEB, isOnlyHHWEB);
            // 更新列表
            renderFilterLists(panel);
            // 重新执行审计（过滤页面显示）
            executeAudit();
        });

        // 点击筛选
        panel.addEventListener('click', (e) => {
            if (!isMasterSwitchOn && e.target.classList.contains('hh-ver-item')) return;
            
            if (e.target.classList.contains('hh-ver-item')) {
                const type = e.target.getAttribute('data-type');
                const val = e.target.getAttribute('data-val');
                
                if (type === 'ver') {
                    if (selectedVersions.has(val)) {
                        selectedVersions.delete(val);
                        e.target.classList.remove('active');
                    } else {
                        selectedVersions.add(val);
                        e.target.classList.add('active');
                    }
                } else if (type === 'uploader') {
                    if (selectedUploaders.has(val)) {
                        selectedUploaders.delete(val);
                        e.target.classList.remove('active');
                    } else {
                        selectedUploaders.add(val);
                        e.target.classList.add('active');
                    }
                }
                executeAudit();
            }
        });

        // 模式切换
        const bindModeChange = (id, setter, storageKey) => {
            document.getElementById(id).addEventListener('change', (e) => {
                const val = parseInt(e.target.value);
                setter(val);
                localStorage.setItem(storageKey, val);
                if (isMasterSwitchOn) executeAudit();
            });
        };

        bindModeChange('year-check-mode', (v) => yearCheckMode = v, STORAGE_KEY_YEAR_MODE);
        bindModeChange('year-err-check-mode', (v) => yearErrCheckMode = v, STORAGE_KEY_YEAR_ERR_MODE);
        bindModeChange('size-check-mode', (v) => sizeCheckMode = v, STORAGE_KEY_SIZE_MODE);
        
        document.getElementById('ep-audit-toggle').addEventListener('change', (e) => {
            epAuditMode = e.target.checked;
            localStorage.setItem(STORAGE_KEY_EP_AUDIT_MODE, epAuditMode);
            if (isMasterSwitchOn) executeAudit();
        });

        document.getElementById('btn-dl-n').addEventListener('click', () => {
            batchDownload(parseInt(document.getElementById('dl-count-input').value));
        });
        document.getElementById('btn-dl-all').addEventListener('click', () => {
            batchDownload(9999);
        });

        document.getElementById('audit-master-switch').addEventListener('change', (e) => {
            isMasterSwitchOn = e.target.checked;
            localStorage.setItem(STORAGE_KEY_MASTER_SWITCH, isMasterSwitchOn);

            if (!isMasterSwitchOn) {
                allTorrentData.forEach(item => {
                    item.element.style.setProperty('display', 'flex', 'important');
                    if (item.divider) item.divider.style.setProperty('display', 'block', 'important');
                    const tel = item.element.querySelector('.torrent-info-text-name');
                    tel.style.backgroundColor = ''; tel.style.color = '';
                });
                document.getElementById('audit-info-display').innerHTML = "功能已关闭，所有种子已显示。";
            } else {
                executeAudit();
            }
        });

        if (isMasterSwitchOn) {
            executeAudit();
        }
    }

    function makeDraggable(el, handle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.classList.contains('hh-toggle-btn')) return;
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            const onMouseMove = (moveEvent) => {
                if (!isDragging) return;
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                el.style.left = `${initialLeft + dx}px`;
                el.style.top = `${initialTop + dy}px`;
                el.style.right = 'auto';
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                const finalRect = el.getBoundingClientRect();
                localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({left: finalRect.left + 'px', top: finalRect.top + 'px'}));
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    if (document.querySelectorAll('.torrent-table-sub-info').length > 0) {
        initApp();
    }
})();