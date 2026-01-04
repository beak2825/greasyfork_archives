// ==UserScript==
// @name         排班管理综合工具
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  UI炫酷毛玻璃风格(150px窄屏版)，支持ID/名称双向互查复制，自动工时统计，支持调试模式
// @author       CatPaw
// @match        *://managermall.meituan.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561358/%E6%8E%92%E7%8F%AD%E7%AE%A1%E7%90%86%E7%BB%BC%E5%90%88%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561358/%E6%8E%92%E7%8F%AD%E7%AE%A1%E7%90%86%E7%BB%BC%E5%90%88%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 0. 个性化配置区 (在此修改) ==========

    // 【配置】是否开启调试日志？ (true: 开启控制台日志, false: 关闭)
    // 开启后请按 F12 在 Console 面板查看 '[排班工具]' 开头的日志
    const ENABLE_DEBUG = false;

    // 【配置】是否默认展开岗位组合矩阵？ (true: 展开, false: 收起)
    const DEFAULT_OPEN_MATRIX = true;

    // ========== 1. 基础数据配置 ==========

    // 格式：ID,站点名称 (注意中间是英文逗号，每行一个)
    const MAPPING_TEXT = `
10001474,小象线下店-北京万柳店-001
10001473,小象线下店-H项目小象实验室店-BJ0347
    `;

    // 矩阵筛选源数据
    const MATRIX_DATA = {
        categories: ['烘焙', '餐饮', '果蔬', '水产', '肉禽', '标品', '店仓', '安防', '客服','营销', '防损', '保洁'],
        roles: ['主管', '班长', '专员', '总经理', 'HRBP']
    };

    // 关键词映射
    const KEYWORD_MAP = {
        '组织部门': { '烘焙':'烘焙', '餐饮':'餐饮', '果蔬':'果蔬', '前场':'前场', '后场':'后场', '水产':'水产', '肉禽':'肉禽', '日配':'日配', '标品':'标品', '物流':'物流', '客服':'客服', '安防':'安防' },
        '排班部门': { '烘焙':'烘焙', '餐饮':'餐饮', '果蔬':'果蔬', '前场':'前场', '后场':'后场' },
        '员工分类': { '全职':'全职', '兼职':'兼职', '驻场':'驻场' },
        '岗位': {
            '烘焙主管':'主管（烘焙）', '烘焙班长':'班长（烘焙）', '烘焙专员':'专员（烘焙）',
            '餐饮主管':'主管（餐饮）', '餐饮班长':'班长（餐饮）', '餐饮专员':'专员（餐饮）',
            '店长':'门店总经理', 'HR':'HRBP', '防损':'防损', '保洁':'保洁','营销':'营销',
            '店仓':'店仓',
            '主管':'主管', '班长':'班长', '专员':'专员'
        }
    };

    let configs = GM_getValue('xx_schedule_configs_v5', {});

    // ========== 2. 数据解析与工具函数 ==========

    // 解析站点配置
    const SITE_LIST = MAPPING_TEXT.trim().split('\n').map(line => {
        const parts = line.split(',');
        if (parts.length >= 2) {
            return {
                id: parts[0].trim(),
                name: parts.slice(1).join(',').trim()
            };
        }
        return null;
    }).filter(item => item !== null);

    // 调试日志函数 (带颜色，方便查看)
    function debugLog(...args) {
        if (ENABLE_DEBUG) {
            console.log('%c[排班工具]', 'color: #00d2ff; font-weight: bold; background: #333; padding: 2px 4px; border-radius: 2px;', ...args);
        }
    }

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // ========== 3. 页面探测与统计核心 ==========

    function findScheduleWindow() {
        if (document.querySelector('.el-select, .mtd-select')) return window;
        const frames = document.querySelectorAll('iframe');
        for (let i = 0; i < frames.length; i++) {
            try {
                if (frames[i].contentWindow.document.querySelector('.el-select, .mtd-select')) {
                    debugLog('在 iframe 中找到排班表');
                    return frames[i].contentWindow;
                }
            } catch(e) {}
        }
        return null;
    }

    function findContainerByLabel(doc, labelText) {
        const labels = Array.from(doc.querySelectorAll('label, .mtd-form-item-label, .el-form-item__label'));
        const targetLabel = labels.find(l => l.textContent.trim().includes(labelText));
        if (targetLabel) {
            let parent = targetLabel.parentElement;
            for(let i=0; i<3; i++) {
                if(!parent) break;
                const select = parent.querySelector('.el-select, .mtd-select');
                if (select) return select;
                parent = parent.parentElement;
            }
        }
        const inputs = Array.from(doc.querySelectorAll('input, div.el-select, div.mtd-select'));
        const targetInput = inputs.find(el => {
            const p = el.getAttribute('placeholder');
            return p && p.includes(labelText);
        });
        if (targetInput) {
            return targetInput.classList.contains('el-select') || targetInput.classList.contains('mtd-select')
                ? targetInput : targetInput.closest('.el-select, .mtd-select');
        }
        return null;
    }

    function triggerAutoStats() {
        debugLog('触发自动统计...');
        const resDiv = document.getElementById('xx-stat-res');
        if(resDiv) resDiv.innerHTML = '<span class="xx-loading">...</span>';
        setTimeout(() => {
            const stats = calculateStats();
            updateStatUI(stats);
            if(stats.staffCount > 0) showFeedback(`统计完成：${stats.staffCount}人`);
        }, 1500);
    }

    function calculateStats() {
        const win = findScheduleWindow();
        if (!win) {
            debugLog('未找到窗口，无法统计');
            return { staffCount: 0, totalHours: 0, avgHours: 0, shiftCounts: {} };
        }

        const stats = { staffCount: 0, totalHours: 0, avgHours: 0, shiftCounts: {} };
        const rows = win.document.querySelectorAll('tbody tr');
        debugLog(`扫描到 ${rows.length} 行数据`);

        const seen = new Set();
        rows.forEach(row => {
            const text = row.textContent;

            // 【修改点】优化正则：使用 [^\d]* 忽略中间的 "次日" 等非数字字符
            // 原来是: /(\d+):(\d+)\s*-\s*(\d+):(\d+)/
            const match = text.match(/(\d+):(\d+)\s*-\s*[^\d]*(\d+):(\d+)/);

            if (match) {
                // 为了避免名字里有奇怪的符号，尽量只取前几个字，或者依靠td结构
                const nameCell = row.querySelector('td');
                // 有时候 textContent 会包含换行符，这里 trim 一下
                const name = nameCell ? nameCell.textContent.trim().split(/\s+/)[0] : 'unknown';

                const uniqueKey = `${name}|${match[0]}`;
                if (!seen.has(uniqueKey)) {
                    seen.add(uniqueKey);

                    let h = parseInt(match[3]) - parseInt(match[1]);
                    // 你的跨天逻辑 (h < 0) 其实是对的：
                    // 7 - 22 = -15, -15 + 24 = 9。计算逻辑没问题，只要正则能抓到数字就行。
                    if (h < 0) h += 24;

                    const m = parseInt(match[4]) - parseInt(match[2]);
                    if (m !== 0) h += m/60;

                    stats.staffCount++;
                    stats.totalHours += h;

                    // 统计班型
                    const shiftKey = `${match[1].padStart(2,'0')}:${match[2].padStart(2,'0')}-${match[3].padStart(2,'0')}:${match[4].padStart(2,'0')}`;
                    stats.shiftCounts[shiftKey] = (stats.shiftCounts[shiftKey] || 0) + 1;
                }
            }
        });

        stats.totalHours = Math.round(stats.totalHours * 10) / 10;
        if (stats.staffCount > 0) stats.avgHours = (stats.totalHours / stats.staffCount).toFixed(1);
        debugLog('统计结果:', stats);
        return stats;
    }

    let isDetailPanelOpen = false;
    let lastStats = null;

    function updateStatUI(res) {
        lastStats = res;
        const div = document.getElementById('xx-stat-res');
        if(!div) return;

        let html = res.staffCount===0 ? '<span style="color:rgba(255,255,255,0.4);font-size:10px">暂无数据</span>' :
            `<div class="xx-stat-grid">
                <div class="xx-stat-box"><div class="xx-stat-num">${res.staffCount}</div><div class="xx-stat-label">人数</div></div>
                <div class="xx-stat-box"><div class="xx-stat-num" style="color:#00e5ff">${res.totalHours}</div><div class="xx-stat-label">总工时</div></div>
                <div class="xx-stat-box"><div class="xx-stat-num" style="color:#ff4081">${res.avgHours}</div><div class="xx-stat-label">人均</div></div>
             </div>`;

        if (res.staffCount > 0) {
            html += `<div class="xx-expand-link" id="xx-toggle-detail">${isDetailPanelOpen ? '收起班型 <<' : '查看班型 >>'}</div>`;
        }

        div.innerHTML = html;

        const toggleBtn = document.getElementById('xx-toggle-detail');
        if(toggleBtn) {
            toggleBtn.onclick = () => {
                isDetailPanelOpen = !isDetailPanelOpen;
                toggleDetailPanel();
                updateStatUI(res); // refresh text
            };
        }

        if(isDetailPanelOpen) renderDetailPanel(res);
    }

    function toggleDetailPanel() {
        const panel = document.getElementById('xx-detail-panel');
        const mainPanel = document.getElementById('xx-unified-panel');
        if (!panel || !mainPanel) return;

        if (!isDetailPanelOpen) {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
            // 智能定位：如果左边空间不够(小于200px)，就往右展开；否则往左展开
            const rect = mainPanel.getBoundingClientRect();
            if (rect.left < 200) {
                panel.style.left = '100%'; panel.style.right = 'auto';
                panel.style.marginLeft = '4px'; panel.style.marginRight = '0';
            } else {
                panel.style.right = '100%'; panel.style.left = 'auto';
                panel.style.marginRight = '4px'; panel.style.marginLeft = '0';
            }
            if(lastStats) renderDetailPanel(lastStats);
        }
    }

    function renderDetailPanel(stats) {
        const panel = document.getElementById('xx-detail-panel');
        if(!panel) return;

        if (!stats.shiftCounts || Object.keys(stats.shiftCounts).length === 0) {
            panel.innerHTML = '<div style="text-align:center;color:#888;padding:10px">暂无班型数据</div>';
            return;
        }

        let html = '<div class="xx-section-title" style="margin-bottom:8px">班型分布 (人)</div>';
        const sortedKeys = Object.keys(stats.shiftCounts).sort();
        sortedKeys.forEach(key => {
            html += `
                <div class="xx-detail-row">
                    <span class="xx-detail-time">${key}</span>
                    <span class="xx-detail-count">${stats.shiftCounts[key]}</span>
                </div>
            `;
        });
        panel.innerHTML = html;
    }

    // ========== 4. 矩阵筛选逻辑 ==========

    async function applyMatrixSelection(selectedCats, selectedRoles) {
        debugLog('开始矩阵筛选', { cats: selectedCats, roles: selectedRoles });
        const win = findScheduleWindow();
        if (!win) return alert('未找到排班表');
        const doc = win.document;
        const container = findContainerByLabel(doc, '岗位');
        if (!container || !container.__vue__) return alert('未找到【岗位】筛选框');

        const vm = container.__vue__;
        if (!vm.options || vm.options.length === 0) {
            if (!vm.visible) {
                debugLog('展开下拉框以加载数据...');
                vm.visible = true;
                await sleep(600);
            }
        }

        let allOptions = vm.options && vm.options.length > 0 ? vm.options :
            Array.from(doc.querySelectorAll('.el-select-dropdown__item, .mtd-dropdown-menu-item')).map(item => ({
                label: item.textContent.trim(),
                value: item.__vue__ || item
            })).filter(o => o.label);

        debugLog(`读取到 ${allOptions.length} 个岗位选项`);
        if (allOptions.length === 0) return alert('未读取到岗位数据');

        const matchedOptions = allOptions.filter(opt => {
            const label = (opt.label || (opt.$el && opt.$el.textContent) || '').trim();
            const catMatch = selectedCats.length === 0 || selectedCats.some(c => label.includes(c));
            const roleMatch = selectedRoles.length === 0 || selectedRoles.some(r => label.includes(r));
            return catMatch && roleMatch;
        });

        debugLog(`匹配到 ${matchedOptions.length} 个目标岗位`);
        if (matchedOptions.length === 0) return alert('未匹配到任何岗位');

        const newValues = matchedOptions.map(m => (m.value && typeof m.value !== 'object') ? m.value : m);
        vm.value = newValues;
        vm.$emit('input', newValues);
        vm.$emit('change', newValues);

        setTimeout(() => {
            const btns = Array.from(doc.querySelectorAll('button, .mtd-btn'));
            const searchBtn = btns.find(b => b.textContent.includes('筛选') || (b.textContent.trim() === '查询'));
            if (searchBtn) {
                debugLog('点击查询按钮');
                searchBtn.click();
                triggerAutoStats();
            }
            vm.visible = false;
        }, 300);
    }

    // ========== 5. 配置管理逻辑 ==========

    function getVueSelectedValues(win) {
        const doc = win.document; const result = {}; const fields = ['组织部门', '排班部门', '员工分类', '岗位'];
        fields.forEach(field => {
            const container = findContainerByLabel(doc, field); if (!container) return;
            let selectedLabels = [];
            const tags = Array.from(container.querySelectorAll('.el-tag, .mtd-select-tags-ul li, .mtd-tag'));
            if (tags.length > 0) tags.forEach(tag => { if (!tag.classList.contains('mtd-select-search-line')) selectedLabels.push(tag.textContent.replace(/[×x]/gi, '').trim()); });
            else if (container.__vue__) { const vm = container.__vue__; if (Array.isArray(vm.selected)) selectedLabels = vm.selected.map(item => item.currentLabel || item.label); else if (vm.selectedLabel) selectedLabels = [vm.selectedLabel]; }
            if (selectedLabels.length > 0) {
                const map = KEYWORD_MAP[field];
                result[field] = selectedLabels.map(longName => {
                    if (map) for (const [k, v] of Object.entries(map).sort((a,b)=>b[1].length-a[1].length)) if(longName.includes(v)) return k;
                    return longName;
                });
            }
        });
        debugLog('获取当前页面选中配置:', result);
        return result;
    }

    function saveCurrentConfig() {
        const name = document.getElementById('xx-config-name').value.trim();
        if(!name) return alert('请输入名称');
        const win = findScheduleWindow();
        if(!win) return alert('未找到排班表');
        const data = getVueSelectedValues(win);
        if(Object.keys(data).length === 0) return alert('未检测到选中项');
        configs[name] = data;
        GM_setValue('xx_schedule_configs_v5', configs);
        renderConfigList();
        showFeedback('已保存');
        debugLog('配置已保存:', name, data);
    }

    async function applyConfigAndSearch(name) {
        debugLog(`应用配置: ${name}`);
        const config = configs[name]; if(!config) return;
        const win = findScheduleWindow(); if(!win) return;
        for(const [key, values] of Object.entries(config)) {
             const c = findContainerByLabel(win.document, key);
             if(c && c.__vue__) {
                 const vm = c.__vue__; if(!vm.visible) { vm.visible=true; await sleep(400); }
                 let allOptions = vm.options || [];
                 const matches = allOptions.filter(o => values.some(v => (o.label||'').includes(KEYWORD_MAP[key]?.[v] || v)));
                 const newVals = matches.map(m => (m.value && typeof m.value !== 'object') ? m.value : m);
                 vm.value = newVals; vm.$emit('input', newVals); vm.$emit('change', newVals); vm.visible = false;
             }
        }
        setTimeout(() => {
            const btns = Array.from(win.document.querySelectorAll('button, .mtd-btn'));
            const btn = btns.find(b => b.textContent.includes('筛选'));
            if(btn) { btn.click(); triggerAutoStats(); }
        }, 500);
    }

    // ========== 6. 双向复制核心逻辑 ==========

    async function copyToClipboard(text) {
        try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
    }

    function handleSmartCopy(targetType) {
        const input = document.getElementById('xx-site-input').value.trim();
        debugLog(`尝试复制: ${targetType}, 输入: ${input}`);
        if(!input) return showFeedback('请输入ID或名');

        const match = SITE_LIST.find(item => item.id.includes(input) || item.name.includes(input));
        let resultText = '';
        if (match) {
            resultText = targetType === 'id' ? match.id : match.name;
            debugLog('匹配成功:', match);
        } else {
            showFeedback('未匹配,复制原内容');
            resultText = input;
            debugLog('未匹配，使用原始内容');
        }

        copyToClipboard(resultText).then(ok => {
            if(ok && match) showFeedback(`已复制${targetType==='id'?'ID':'名称'}`);
        });
    }

    function showFeedback(msg) {
        const el = document.createElement('div'); el.className = 'xx-feedback-toast'; el.textContent = msg;
        document.body.appendChild(el); setTimeout(() => el.remove(), 2500);
    }

    // ========== 7. UI 界面 (150px 窄屏版) ==========

    GM_addStyle(`
        :root { --xx-bg: rgba(22, 24, 35, 0.9); --xx-border: rgba(255, 255, 255, 0.15); --xx-primary: linear-gradient(135deg, #4e80ee 0%, #3c65c4 100%); --xx-accent: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); --xx-text: #ffffff; --xx-text-sub: rgba(255, 255, 255, 0.6); --xx-input-bg: rgba(0, 0, 0, 0.4); --xx-radius: 8px; }
        #xx-unified-panel {
            position: fixed; left: 2px; bottom: 2px;
            width: 140px;
            background: var(--xx-bg);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--xx-border);
            border-radius: var(--xx-radius);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            color: var(--xx-text); font-family: sans-serif; font-size: 11px; z-index: 99999;
            transition: all 0.3s ease; animation: xxSlideUp 0.4s ease;
        }
        @keyframes xxSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .xx-panel-header { padding: 6px 10px; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0)); border-bottom: 1px solid var(--xx-border); display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; }
        .xx-panel-title { font-weight: 700; font-size: 12px; color: #eee; }
        .xx-collapse-btn { cursor: pointer; color: var(--xx-text-sub); font-size: 14px; padding: 0 4px; }
        .xx-section { padding: 8px 10px; border-bottom: 1px solid var(--xx-border); } .xx-section:last-child { border-bottom: none; }
        .xx-section-title { font-size: 10px; font-weight: 600; color: #64b5f6; margin-bottom: 6px; text-transform: uppercase; opacity: 0.9; }
        .xx-input { width: 100%; padding: 4px 6px; background: var(--xx-input-bg); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; outline: none; box-sizing: border-box; margin-bottom: 6px; font-size: 11px; } .xx-input:focus { border-color: #4e80ee; }
        .xx-btn { width: 100%; padding: 5px 0; background: var(--xx-primary); color: #fff; border: none; border-radius: 4px; font-weight: 600; font-size: 11px; cursor: pointer; margin-bottom: 4px; } .xx-btn:hover { opacity: 0.9; }
        .xx-btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #ddd; font-size: 10px; padding: 4px 0; } .xx-btn-outline:hover { background: rgba(255,255,255,0.05); border-color: #fff; }
        .xx-toggle-bar { text-align: center; font-size: 10px; color: #00d2ff; cursor: pointer; padding: 2px; border-radius: 4px; } .xx-toggle-bar:hover { background: rgba(0, 210, 255, 0.1); }
        .xx-matrix-container { background: rgba(0,0,0,0.2); padding: 8px 10px; display: none; border-bottom: 1px solid var(--xx-border); }
        .xx-matrix-label { color: var(--xx-text-sub); margin: 6px 0 4px 0; font-size: 10px; }
        .xx-tags-group { display: flex; flex-wrap: wrap; gap: 4px; }
        .xx-tag { padding: 2px 6px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #aaa; cursor: pointer; font-size: 10px; transition: all 0.2s; } .xx-tag:hover { color: #fff; } .xx-tag.active { background: rgba(0, 210, 255, 0.2); border-color: #00d2ff; color: #00d2ff; }
        .xx-match-btn { background: var(--xx-accent); margin-top: 8px; font-size: 10px; }
        .xx-config-list { max-height: 80px; overflow-y: auto; margin-top: 4px; } .xx-config-list::-webkit-scrollbar { width: 3px; } .xx-config-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        .xx-config-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; background: rgba(255,255,255,0.03); margin-bottom: 3px; border-radius: 3px; cursor: pointer; font-size: 10px; } .xx-config-item:hover { background: rgba(255,255,255,0.08); }
        .xx-del-btn { color: #ff5252; opacity: 0; padding: 0 4px; font-weight: bold; } .xx-config-item:hover .xx-del-btn { opacity: 1; }
        /* 紧凑统计网格 */
        .xx-stat-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px; margin-top: 4px; }
        .xx-stat-box { background: rgba(0,0,0,0.25); border-radius: 4px; padding: 4px 2px; text-align: center; }
        .xx-stat-num { font-size: 12px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 2px; }
        .xx-stat-label { font-size: 9px; transform: scale(0.9); color: var(--xx-text-sub); }
        .xx-loading { font-size: 10px; color: #888; display: block; text-align: center; animation: pulse 1.5s infinite; }
        .xx-feedback-toast { position: fixed; bottom: 50px; left: 10px; background: rgba(20, 20, 25, 0.95); color: #fff; padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); z-index: 100000; font-size: 11px; animation: xxFadeIn 0.3s; }
        @keyframes xxFadeIn { from {opacity:0; transform:translateY(10px)} to {opacity:1; transform:translateY(0)} }
        .xx-btn-row { display: flex; gap: 4px; }
        .xx-btn-row .xx-btn { margin-bottom: 0; }

        /* 详情面板样式 */
        #xx-detail-panel {
            position: absolute; bottom: 0; width: 130px;
            background: var(--xx-bg);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--xx-border); border-radius: var(--xx-radius);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            color: var(--xx-text); padding: 8px;
            display: none; z-index: -1;
            max-height: 400px; overflow-y: auto;
        }
        #xx-detail-panel::-webkit-scrollbar { width: 3px; }
        #xx-detail-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        .xx-detail-row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 10px; }
        .xx-detail-row:last-child { border-bottom: none; }
        .xx-detail-time { color: #ddd; }
        .xx-detail-count { color: #00d2ff; font-weight: bold; }
        .xx-expand-link { display: block; text-align: center; margin-top: 6px; font-size: 10px; color: var(--xx-text-sub); cursor: pointer; text-decoration: underline; }
        .xx-expand-link:hover { color: #00d2ff; }
    `);

    function createPanel() {
        if (document.getElementById('xx-unified-panel')) return;
        if (window.self !== window.top) return;

        debugLog('界面初始化中...');

        const panel = document.createElement('div');
        panel.id = 'xx-unified-panel';
        panel.innerHTML = `
            <div class="xx-panel-header">
                <div class="xx-panel-title">⚡ 排班助手</div>
                <div class="xx-collapse-btn" id="xx-collapse">−</div>
            </div>
            <div class="xx-content">
                <div id="xx-detail-panel"></div>
                <div class="xx-section" style="padding: 6px 10px;">
                    <div id="xx-toggle-matrix" class="xx-toggle-bar">✨ 岗位矩阵</div>
                </div>
                <div class="xx-matrix-container" id="xx-matrix-box">
                    <div class="xx-matrix-label">部门</div>
                    <div class="xx-tags-group" id="xx-cats-area"></div>
                    <div class="xx-matrix-label">岗位</div>
                    <div class="xx-tags-group" id="xx-roles-area"></div>
                    <button class="xx-btn xx-match-btn" id="xx-apply-matrix">组合查询</button>
                </div>

                <div class="xx-section">
                    <div class="xx-section-title">方案预设</div>
                    <div class="xx-btn-row">
                        <input id="xx-config-name" class="xx-input" style="margin-bottom:0; flex:1" placeholder="新方案名">
                        <button id="xx-save-btn" class="xx-btn" style="width:36px; margin-bottom:0; padding:0;">存</button>
                    </div>
                    <div id="xx-config-list" class="xx-config-list"></div>
                </div>

                <div class="xx-section">
                    <div class="xx-section-title">站点匹配</div>
                    <input id="xx-site-input" class="xx-input" placeholder="输入 ID / 名称">
                    <div class="xx-btn-row">
                        <button id="xx-copy-id" class="xx-btn xx-btn-outline">复 ID</button>
                        <button id="xx-copy-name" class="xx-btn xx-btn-outline">复 全名</button>
                    </div>
                </div>

                <div class="xx-section" style="border-bottom:none;">
                    <div class="xx-section-title">实时工时</div>
                    <div id="xx-stat-res">
                         <div class="xx-stat-grid">
                            <div class="xx-stat-box"><div class="xx-stat-num">-</div><div class="xx-stat-label">人数</div></div>
                            <div class="xx-stat-box"><div class="xx-stat-num">-</div><div class="xx-stat-label">工时</div></div>
                            <div class="xx-stat-box"><div class="xx-stat-num">-</div><div class="xx-stat-label">人均</div></div>
                         </div>
                    </div>
                    <button id="xx-stat-btn" class="xx-btn xx-btn-outline" style="margin-top:6px">↻ 刷新</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Matrix Logic
        const catsArea = document.getElementById('xx-cats-area');
        const rolesArea = document.getElementById('xx-roles-area');
        const renderTags = (container, items) => {
            items.forEach(text => {
                const span = document.createElement('span'); span.className = 'xx-tag'; span.textContent = text;
                span.onclick = () => span.classList.toggle('active'); container.appendChild(span);
            });
        };
        renderTags(catsArea, MATRIX_DATA.categories);
        renderTags(rolesArea, MATRIX_DATA.roles);

        // Toggle Logic with Default Config
        const matrixBox = document.getElementById('xx-matrix-box');
        const toggleBtn = document.getElementById('xx-toggle-matrix');

        // 初始化状态
        if (DEFAULT_OPEN_MATRIX) {
            matrixBox.style.display = 'block';
            toggleBtn.textContent = '🔼 收起';
            toggleBtn.style.color = '#bbb';
        } else {
            matrixBox.style.display = 'none';
        }

        toggleBtn.onclick = function() {
            const isHidden = matrixBox.style.display === 'none';
            matrixBox.style.display = isHidden ? 'block' : 'none';
            this.textContent = isHidden ? '🔼 收起' : '✨ 岗位矩阵';
            this.style.color = isHidden ? '#bbb' : '#00d2ff';
        };

        document.getElementById('xx-apply-matrix').onclick = () => {
            const getActive = (id) => Array.from(document.querySelectorAll(`#${id} .xx-tag.active`)).map(el => el.textContent);
            const cats = getActive('xx-cats-area'); const roles = getActive('xx-roles-area');
            if(cats.length===0 && roles.length===0) return alert('请至少选择一项');
            applyMatrixSelection(cats, roles);
        };

        document.getElementById('xx-save-btn').onclick = saveCurrentConfig;
        document.getElementById('xx-stat-btn').onclick = () => { const s = calculateStats(); updateStatUI(s); showFeedback('已刷新'); };

        document.getElementById('xx-copy-id').onclick = () => handleSmartCopy('id');
        document.getElementById('xx-copy-name').onclick = () => handleSmartCopy('name');

        const collapseBtn = document.getElementById('xx-collapse');
        const content = panel.querySelector('.xx-content');
        collapseBtn.onclick = () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            collapseBtn.textContent = isHidden ? '−' : '+';
            panel.style.width = isHidden ? '150px' : 'auto';
        };

        // Drag Logic
        let isDragging=false, startX, startY, startLeft, startBottom;
        const header = panel.querySelector('.xx-panel-header');
        header.addEventListener('mousedown', (e) => {
            if(e.target===collapseBtn) return;
            isDragging=true; startX=e.clientX; startY=e.clientY;
            const rect=panel.getBoundingClientRect(); startLeft=rect.left; startBottom=window.innerHeight-rect.bottom;
            panel.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            panel.style.left=(startLeft+(e.clientX-startX))+'px';
            panel.style.bottom=(startBottom-(e.clientY-startY))+'px';
        });
        document.addEventListener('mouseup', () => { if(isDragging) { isDragging=false; panel.style.transition = 'all 0.3s ease'; } });

        renderConfigList();
        debugLog('界面初始化完成');
    }

    function renderConfigList() {
        const list = document.getElementById('xx-config-list'); list.innerHTML = '';
        Object.keys(configs).forEach(name => {
            const div = document.createElement('div'); div.className = 'xx-config-item';
            div.innerHTML = `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</span><span class="xx-del-btn">×</span>`;
            div.children[0].onclick = () => applyConfigAndSearch(name);
            div.children[1].onclick = (e) => { e.stopPropagation(); if(confirm(`删除 "${name}"?`)) { delete configs[name]; GM_setValue('xx_schedule_configs_v5', configs); renderConfigList(); }};
            list.appendChild(div);
        });
    }

    setTimeout(() => { if (window.self === window.top) createPanel(); }, 1500);

})();