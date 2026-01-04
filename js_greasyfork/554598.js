// ==UserScript==
// @license       MIT
// @name          旺仔集团专用
// @namespace     http://tampermonkey.net/
// @version       10.35.46
// @description   从 shg-crx-ant-popover SKU表格解析；支持轮询抓取；分级点选匹配SKU；标题含“泡泡玛特”则平铺；保留分组/导入导出/列宽拖动/日志开关。实时排序 + 拖拽不误排序 + UI必现
// @author        赵 默笙
// @match         *://item.taobao.com/item.htm*
// @match         *://detail.tmall.com/item.htm*
// @match         *://chaoshi.detail.tmall.com/item.htm*
// @match         *://detail.tmall.hk/hk/item.htm*
// @grant         GM_setClipboard
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/554598/%E6%97%BA%E4%BB%94%E9%9B%86%E5%9B%A2%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554598/%E6%97%BA%E4%BB%94%E9%9B%86%E5%9B%A2%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 日志开关 =====
    let LOG_ENABLED = true;
    try { LOG_ENABLED = GM_getValue('sku_tool_log_enabled', true); } catch(e) {}
    const setLogEnabled = v => {
        try { GM_setValue('sku_tool_log_enabled', !!v); } catch(e) {}
        LOG_ENABLED = !!v;
        const s = document.getElementById('log-state');
        if (s) s.textContent = LOG_ENABLED ? '开' : '关';
    };
    const log = (...a) => { if (LOG_ENABLED) console.log('[SKU工具]', ...a); };
    const warn = (...a) => { if (LOG_ENABLED) console.warn('[SKU工具]', ...a); };
    const err = (...a) => console.error('[SKU工具]', ...a);

    // ===== 样式 =====
    GM_addStyle(`
        #tmall-tool { overflow-anchor: none; position: fixed; top: 12px; right: 12px; width: 95vw; max-width: 640px; max-height: 95vh; background: #fff; border: 1px solid #eee; border-radius: 14px; box-shadow: 0 8px 30px rgba(0,0,0,.15); z-index: 999999; padding: 14px; font-family: 'Segoe UI','Microsoft YaHei',sans-serif; overflow: auto; }
        .tool-header { display: flex; gap: 8px; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 8px; }
        .tool-title { flex: 1; font-weight: 800; color: #ff5000; }
        .log-toggle, .tool-close { border: none; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 6px 10px; font-size: 12px; cursor: pointer; }
        .section-title { font-weight: 800; color: #666; margin: 10px 0 6px; display: flex; gap: 6px; align-items: center; }
        .sku-buttons-container { display: flex; flex-direction: column; gap: 8px; border: 1px solid #eee; border-radius: 10px; padding: 8px; background: #fafafa; max-height: 260px; overflow: auto; }
        .sku-btn, .attribute-btn { padding: 8px 10px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .sku-btn.selected { background: linear-gradient(90deg, #e1f5fe, #b3e5fc); border-color: #29b6f6; color: #0288d1; }
        .attribute-btn.selected { background: linear-gradient(90deg, #ffe0b2, #ffcc80); border-color: #ff9800; color: #e65100; }
        .btn { padding: 9px 12px; border: none; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; }
        .btn-primary { background: linear-gradient(90deg, #4facfe, #00f2fe); color: #fff; }
        .btn-success { background: linear-gradient(90deg, #43e97b, #38f9d7); color: #fff; }
        .btn-danger { background: linear-gradient(90deg, #ff758c, #ff7eb3); color: #fff; }
        .btn-info { background: linear-gradient(90deg, #a8edea, #fed6e3); color: #333; }
        .btn-xs { padding: 4px 8px; border-radius: 6px; font-size: 11px; }
        .input { width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; box-sizing: border-box; }
        .result-box { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 10px; font-family: monospace; max-height: 120px; overflow: auto; }
        .group-selector { display: flex; gap: 6px; flex-wrap: wrap; }
        .group-btn { padding: 8px 10px; background: #f0f0f0; border: 2px solid #ddd; border-radius: 8px; font-weight: 800; cursor: pointer; user-select: none; }
        .group-btn.selected { background: linear-gradient(90deg, #ffe0b2, #ffcc80); border-color: #ff9800; color: #e65100; }
        .saved-skus-table { width: 100%; border-collapse: collapse; font-size: 12px; background: #fff; table-layout: fixed; }
        .saved-skus-table th, .saved-skus-table td { border: 1px solid #ddd; padding: 6px; text-align: left; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; position: relative; }
        .th-resize { position: absolute; right: 0; top: 0; bottom: 0; width: 6px; cursor: col-resize; background: transparent; }
        .notification { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); padding: 12px 18px; border-radius: 8px; background: #4caf50; color: #fff; box-shadow: 0 4px 15px rgba(0,0,0,.2); z-index: 100000; }
        .notification.error { background: #f44336; }
        .quantity-row { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        .quantity-btn { padding: 6px 10px; border: 1px solid #ddd; border-radius: 8px; background: #f7f7f7; cursor: pointer; font-weight: 800; }
        .quantity-btn.selected { background: linear-gradient(90deg, #ffe0b2, #ffcc80); border-color: #ff9800; color: #e65100; }
        .group-rename-input { width: 120px; padding: 4px 6px; border: 1px solid #aaa; border-radius: 8px; font-size: 12px; }
        .attr-panel { display: flex; flex-direction: column; gap: 10px; border: 1px solid #eee; border-radius: 10px; padding: 10px; background: #fafafa; }
        .attr-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .attr-label { min-width: 72px; color: #666; font-weight: 800; }
        .attr-option { padding: 7px 10px; border: 1px solid #ddd; border-radius: 8px; background: #fff; font-size: 12px; font-weight: 700; cursor: pointer; user-select: none; }
        .attr-option.selected { background: linear-gradient(90deg, #ffe0b2, #ffcc80); border-color: #ff9800; color: #e65100; }
        .attr-option.disabled { opacity: .45; cursor: not-allowed; text-decoration: line-through; }
        .attr-toolbar { display: flex; gap: 8px; align-items: center; justify-content: flex-end; margin-top: 4px; }
        .attr-summary { font-size: 12px; color: #555; margin-top: 4px; }
        .saved-skus-table th.sortable { cursor: pointer; user-select: none; position: relative; padding-right: 18px; }
        .saved-skus-table th.sortable .sort-ico { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font-size: 10px; opacity: .65; }
        .saved-skus-table th.sortable.active { color: #ff5000; }
        .saved-skus-table tr.row-selected { background: #fff7e6 !important; outline: 2px solid #ff9800; }
        .saved-skus-table td .cell-ellipsis { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    `);

    // ===== 提示/确认 =====
    function showNotification(msg, isError = false) {
        let n = document.querySelector('.notification');
        if (!n) {
            n = document.createElement('div');
            n.className = 'notification';
            document.body.appendChild(n);
        }
        n.textContent = msg;
        n.classList.toggle('error', !!isError);
        n.style.display = 'block';
        setTimeout(() => { n.style.display = 'none'; }, 2200);
    }
    function showConfirm(message) {
        return new Promise(resolve => {
            const box = document.createElement('div');
            box.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border:2px solid #ff5000;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);z-index:1000000;padding:16px;width:360px;`;
            box.innerHTML = `<div style="font-weight:800;color:#333;margin-bottom:12px;">Warning: ${message}</div><div style="display:flex;justify-content:center;gap:10px;"><button id="cfm-yes" style="padding:8px 14px;border:none;border-radius:8px;background:#ff5000;color:#fff;cursor:pointer;">确认</button><button id="cfm-no" style="padding:8px 14px;border:none;border-radius:8px;background:#e0e0e0;color:#333;cursor:pointer;">取消</button></div>`;
            document.body.appendChild(box);
            box.querySelector('#cfm-yes').onclick = () => { box.remove(); resolve(true); };
            box.querySelector('#cfm-no').onclick = () => { box.remove(); resolve(false); };
        });
    }

    // ===== 页面信息 =====
    function getProductTitle() {
        try {
            return (document.querySelector('.mainTitle--R75fTcZL')?.textContent?.trim() ||
                    document.querySelector('.MainTitle--PiA4nmJz span')?.textContent?.trim() ||
                    document.querySelector('.tb-detail-hd h1')?.textContent?.trim() ||
                    document.querySelector('.itemInfo-wrap .title')?.textContent?.trim() ||
                    document.title || '').replace('-淘宝网', '').replace('-天猫TMALL.COM', '').trim();
        } catch(e) { return document.title || '未知商品'; }
    }
    function getShopName() {
        try {
            return (document.querySelector('.shopName--cSjM9uKk')?.textContent?.trim() ||
                    document.querySelector('.detailWrap--svoEjPUO .shopName--cSjM9uKk')?.textContent?.trim() ||
                    document.querySelector('.shop-name')?.textContent?.trim() ||
                    document.querySelector('.shop-link')?.textContent?.trim() ||
                    document.querySelector('.ShopHeader--J_nfJZjm .shopName--cSjM9uKk')?.textContent?.trim() || '未知店铺');
        } catch(e) { return '未知店铺'; }
    }

    // ===== Popover 表格解析 =====
    function getItemIdFromURL() {
        const id = new URLSearchParams(location.search).get('id') || '';
        return String(id || '');
    }
    function getSKUsFromPopoverTable() {
        const popovers = [...document.querySelectorAll('.shg-crx-ant-popover-inner .shg-crx-ant-table-body tbody.shg-crx-ant-table-tbody')];
        const tbody = popovers.length ? popovers[popovers.length - 1] : null;
        const skus = [];
        if (!tbody) return { itemId: getItemIdFromURL(), props: [], skus };

        const rows = tbody.querySelectorAll('tr.shg-crx-ant-table-row[data-row-key]');
        rows.forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length < 4) return;

            let skuId = '';
            const copySpan = tds[0].querySelector('.copy-btn-content');
            if (copySpan) skuId = copySpan.textContent.trim();
            if (!skuId) skuId = tr.getAttribute('data-row-key') || '';

            const name = (tds[1].textContent || '').trim();
            let price = (tds[2].querySelector('div')?.textContent || '').trim();
            if (price.startsWith('¥')) price = price.slice(1);
            let stockText = (tds[3].querySelector('div')?.textContent || '').trim();
            const stockMatch = stockText.match(/\d+/);
            const stock = stockMatch ? stockMatch[0] : stockText;

            if (skuId) skus.push({ skuId, name, price, stock });
        });

        return { itemId: getItemIdFromURL(), props: [], skus };
    }

    function getSKUsFromPage() {
        const data = getSKUsFromPopoverTable();
        if (data.skus.length) {
            log('从 Popover 表格抓取到 SKU：', data.skus.length);
            return data;
        }
        warn('未在 Popover 表格中找到 SKU，返回空集合（请先打开SKU弹层）');
        return { itemId: getItemIdFromURL(), props: [], skus: [] };
    }

    // ===== 轮询抓取 =====
    async function pollForSKUs(maxTries = 100, intervalMs = 500) {
        let attempt = 0;
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                attempt++;
                const data = getSKUsFromPage();
                if (data && data.skus && data.skus.length > 0) {
                    clearInterval(timer);
                    resolve({ ok: true, data, attempt });
                } else if (attempt >= maxTries) {
                    clearInterval(timer);
                    resolve({ ok: false, data: { itemId: getItemIdFromURL(), props: [], skus: [] }, attempt });
                }
                if (LOG_ENABLED) console.log(`[SKU轮询] 第 ${attempt}/${maxTries} 次，结果：${data?.skus?.length || 0}`);
            }, intervalMs);
        });
    }

    // ===== 分级显示 =====
function collectAttributeGroupsFromPage() {
    const groups = [];

    document.querySelectorAll('.skuItem--Z2AJB9Ew, .skuItem, [class*="skuItem"]').forEach((wrap, idx) => {
        const label = (wrap.querySelector('.ItemLabel--psS1SOyC span, .item-label, [class*="ItemLabel"] span')?.textContent || '').trim();
        const btns = wrap.querySelectorAll('.valueItem--smR4pNt4, .sku-btn, button, a, [role="button"]');
        const values = [];

        btns.forEach(el => {
            // 方法2: 使用innerText，它会忽略隐藏元素
            let txt = (el.innerText || '').trim();

            if (!txt) {
                // 如果innerText为空，回退到textContent
                txt = (el.textContent || '').trim();
            }

            // 清理常见的促销和附加文本
            const commonNoise = [
                '90%抓购', '90%加购', '免运费', '优惠', '促销', '特价',
                '首付', '立减', '赠品', '包邮', '限时', '抢购'
            ];

            commonNoise.forEach(noise => {
                txt = txt.replace(new RegExp(noise, 'gi'), '');
            });

            // 清理数字+%格式的促销
            txt = txt.replace(/\d+%\S*/g, '');

            // 清理多余空格和换行
            txt = txt.replace(/\s+/g, ' ').trim();

            if (txt) {
                // 检查是否已经有相同的内容（避免重复）
                const isDuplicate = values.some(v => v.text === txt);
                if (!isDuplicate) {
                    values.push({ text: txt, vid: el.getAttribute('data-vid') || txt });
                }
            }
        });

        if (label && values.length > 1) groups.push({ name: label, values, index: idx });
    });

    // 合并相同名称的属性组
    const merged = [];
    groups.forEach(g => {
        const hit = merged.find(m => m.name === g.name);
        if (!hit) merged.push({ ...g });
        else {
            const existing = new Set(hit.values.map(v => v.text));
            g.values.forEach(v => { if (!existing.has(v.text)) hit.values.push(v); });
        }
    });

    return merged;
}

    function inferGroupsFromSkuNames(skuList) {
        const names = (skuList || []).map(s => (s.name || '').trim()).filter(Boolean);
        if (!names.length) return [];
        const rows = names.map(n => n.split(/\s+/g).filter(Boolean));
        const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
        const friendly = ['机身颜色', '镜头组合', '配件套餐', '容量/规格', '尺寸/版本', '其他'];
        const groups = [];
        for (let c = 0; c < maxCols; c++) {
            const set = new Set();
            rows.forEach(r => { if (r[c]) set.add(r[c]); });
            if (set.size >= 2 && set.size <= 40) {
                groups.push({ name: friendly[c] || `属性${c+1}`, index: c, values: Array.from(set).map(t => ({ text: t, vid: t })) });
            }
        }
        return groups;
    }

    function renderTieredSelectorFromGroups(skuData, groups) {
        const container = document.getElementById('sku-buttons-container');
        const countEl = document.getElementById('sku-count');
        if (!container) return;
        container.innerHTML = '';

        const panel = document.createElement('div');
        panel.className = 'attr-panel';
        container.appendChild(panel);

        const selected = {};
        const groupsEls = [];
        const summary = document.createElement('div');
        summary.className = 'attr-summary';

        const tools = document.createElement('div');
        tools.className = 'attr-toolbar';
        const resetBtn = document.createElement('button');
        resetBtn.className = 'attribute-btn';
        resetBtn.textContent = '重置选择';
        resetBtn.onclick = () => { for (const k in selected) delete selected[k]; refreshAll(); refreshResult(true); };
        tools.appendChild(resetBtn);

        groups.forEach((g, gi) => {
            const row = document.createElement('div');
            row.className = 'attr-group';

            const label = document.createElement('div');
            label.className = 'attr-label';
            label.textContent = g.name || `属性${gi + 1}`;
            row.appendChild(label);

            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexWrap = 'wrap';
            wrap.style.gap = '6px';

            g.values.forEach(v => {
                const btn = document.createElement('div');
                btn.className = 'attr-option';
                btn.textContent = v.text;
                btn.addEventListener('click', () => {
                    if (btn.classList.contains('disabled')) return;
                    if (selected[gi] === v.text) delete selected[gi];
                    else selected[gi] = v.text;
                    refreshAll();
                    refreshResult();
                });
                wrap.appendChild(btn);
            });

            row.appendChild(wrap);
            panel.appendChild(row);
            groupsEls.push({ gi, wrap });
        });

        panel.appendChild(tools);
        panel.appendChild(summary);

        const resultArea = document.createElement('div');
        resultArea.style.marginTop = '8px';
        panel.appendChild(resultArea);

        if (countEl) countEl.textContent = (skuData.skus || []).length;

        function canPick(gi, candidateText) {
            const required = [];
            groups.forEach((g, idx) => {
                if (idx === gi) required.push(candidateText);
                else if (selected[idx]) required.push(selected[idx]);
            });
            return (skuData.skus || []).some(s => required.every(t => (s.name || '').includes(t)));
        }

       // 【推荐版本】使用原始逻辑，但优化鞋码匹配
function lockSku() {
    const selectedValues = groups.map((g, gi) => selected[gi]).filter(Boolean);
    if (!selectedValues.length) return null;

    return (currentSKUData?.skus || []).find(s => {
        const name = s.name || '';
        const nameLower = name.toLowerCase();

        // 检查所有选中的值是否都在SKU名称中
        return selectedValues.every(value => {
            const valueStr = String(value).toLowerCase();

            // 如果是纯数字（可能是鞋码），需要更精确的匹配
            if (/^\d+(\.\d+)?$/.test(valueStr)) {
                // 尝试多种匹配方式
                // 1. 直接匹配完整值（带边界）
                const exactMatch = new RegExp(`\\b${escapeRegExp(valueStr)}\\b`, 'i');
                if (exactMatch.test(name)) {
                    return true;
                }

                // 2. 匹配"鞋码: 46"这种格式
                if (new RegExp(`[^\\d]${escapeRegExp(valueStr)}[^\\d]`, 'i').test(name)) {
                    return true;
                }

                // 3. 匹配末尾的数字（如"鞋子 46"）
                if (new RegExp(`\\s${escapeRegExp(valueStr)}$`, 'i').test(name)) {
                    return true;
                }

                return false;
            }

            // 非数字属性值：简单包含匹配
            return nameLower.includes(valueStr);
        });
    }) || null;
}

        function refreshAll() {
            groupsEls.forEach(({ gi, wrap }) => {
                [...wrap.children].forEach(btn => {
                    const val = btn.textContent;
                    const ok = canPick(gi, val);
                    btn.classList.toggle('disabled', !ok);
                    btn.classList.toggle('selected', selected[gi] === val);
                });
            });
        }

        function refreshResult(clearOnly) {
            const picked = groups.map((g, gi) => `${g.name}: ${selected[gi] || '-'}`).join(' ｜ ');
            summary.textContent = `已选：${picked}`;
            resultArea.innerHTML = '';
            if (clearOnly) return;

            const allPicked = groups.every((_, gi) => !!selected[gi]);
            if (!allPicked) return;

            const hit = lockSku();
            if (hit) {
                const btn = document.createElement('button');
                btn.className = 'sku-btn selected';
                btn.textContent = hit.name || hit.skuId;
                btn.dataset.skuId = hit.skuId;
                btn.dataset.price = hit.price || '';
                btn.dataset.name = hit.name || '';
                btn.addEventListener('click', () => showNotification(`已选择: ${hit.name || hit.skuId} (${hit.price || '无价格'})`));
                resultArea.appendChild(btn);
            } else {
                const tip = document.createElement('div');
                tip.className = 'sku-btn';
                tip.textContent = '未找到匹配SKU（请调整所选属性）';
                resultArea.appendChild(tip);
            }
        }

        refreshAll();
        refreshResult();
    }

    // ===== 分组名称持久化 =====
    const GROUP_KEYS = ['default', 'group1', 'group2', 'group3', 'group4', 'group5'];
    const DEFAULT_GROUP_TITLES = { 'default': '默认', 'group1': '组1', 'group2': '组2', 'group3': '组3', 'group4': '组4', 'group5': '组5' };
    function getGroupTitle(key) { try { return GM_getValue('group_name_' + key, DEFAULT_GROUP_TITLES[key] || key); } catch(e) { return DEFAULT_GROUP_TITLES[key] || key; } }
    function setGroupTitle(key, title) { try { GM_setValue('group_name_' + key, title); } catch(e) {} }
    function applyGroupTitles() {
        document.querySelectorAll('.group-btn').forEach(btn => { const key = btn.dataset.group; btn.textContent = getGroupTitle(key); });
        const sel = document.getElementById('move-target-group');
        if (sel) sel.innerHTML = GROUP_KEYS.map(k => `<option value="${k}">${getGroupTitle(k)}</option>`).join('');
    }

    // ===== UI 创建 =====
    let currentSKUData = null;
    let selectedQuantity = 1;
    let currentGroupKey = 'default';
    function createToolUI() {
        if (document.getElementById('tmall-tool')) return document.getElementById('tmall-tool');
        const el = document.createElement('div');
        el.id = 'tmall-tool';
        const itemId = getItemIdFromURL();
        el.innerHTML = `
            <div class="tool-header">
                <div class="tool-title">默笙专用</div>
                <button class="log-toggle" id="log-toggle-btn">日志：<span id="log-state">${LOG_ENABLED ? '开' : '关'}</span></button>
                <button class="tool-close" id="tool-close">关闭</button>
            </div>
            <div class="section-title">当前商品信息</div>
            <input id="tmall-item-id" class="input" placeholder="商品ID" readonly value="${itemId}" />
            <div style="font-size:12px;color:#666;margin-top:6px;">店铺：<span id="shop-name">-</span></div>
            <div style="font-size:12px;color:#666;margin-top:4px;">标题：<span id="product-title">-</span></div>
            <div class="section-title">选择SKU（支持分级点选；若含“泡泡玛特”则直接平铺）</div>
            <div id="sku-buttons-container" class="sku-buttons-container">
                <div class="sku-btn">提示：请先在页面上打开“SKU明细”弹层，再点击“重新抓取”</div>
            </div>
            <div class="quantity-row" style="margin-top:8px">
                <button class="btn btn-info btn-xs" id="refresh-sku-btn">重新抓取</button>
                <span style="font-size:12px;color:#666;margin-left:8px">数量：</span>
                ${[1,2,6,12].map(n => `<button class="quantity-btn" data-quantity="${n}">${n}</button>`).join('')}
                <select id="custom-quantity" class="input" style="max-width:88px;padding:6px">
                    ${Array.from({length:20}, (_,i) => i+1).map(n => `<option value="${n}">${n}</option>`).join('')}
                </select>
                <span id="sku-count" style="font-size:12px;color:#666;margin-left:auto">0 个SKU</span>
            </div>
            <div class="section-title">选择分组（双击修改名称）</div>
            <div class="group-selector">
                <div class="group-btn selected" data-group="default">${getGroupTitle('default')}</div>
                <div class="group-btn" data-group="group1">${getGroupTitle('group1')}</div>
                <div class="group-btn" data-group="group2">${getGroupTitle('group2')}</div>
                <div class="group-btn" data-group="group3">${getGroupTitle('group3')}</div>
                <div class="group-btn" data-group="group4">${getGroupTitle('group4')}</div>
                <div class="group-btn" data-group="group5">${getGroupTitle('group5')}</div>
            </div>
            <div class="section-title">操作</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                <button class="btn btn-success" id="save-sku-btn">保存SKU</button>
                <button class="btn btn-primary" id="copy-btn">复制当前BP链接</button>
                <button class="btn btn-info" id="copy-all-sku-links-btn">复制所有SKU链接</button>
                <button class="btn btn-danger" id="clear-saved-btn">清空当前组</button>
            </div>
            <div class="result-box" id="result-box">生成的BP链接将显示在这里...</div>
            <div class="section-title">已保存的SKU（<span id="current-group-name">${getGroupTitle('default')}</span>） <span id="saved-sku-count" style="background:#4caf50;color:#fff;padding:2px 6px;border-radius:10px;font-size:10px;margin-left:6px;">0</span></div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
                <input type="checkbox" id="select-all-checkbox" /><label for="select-all-checkbox" style="font-size:12px">全选</label>
                <button class="btn btn-danger" id="delete-selected-btn">删除选中SKU</button>
                <select class="input" id="move-target-group" style="max-width:160px;padding:6px">
                    ${GROUP_KEYS.map(k => `<option value="${k}">${getGroupTitle(k)}</option>`).join('')}
                </select>
                <button class="btn btn-info" id="move-selected-btn">移动选中到分组</button>
                <button class="btn btn-info" id="copy-selected-btn">复制选中到分组</button>
            </div>
            <table class="saved-skus-table">
                <thead>
                    <tr>
                        <th width="36">选<div class="th-resize"></div></th>
                        <th width="70">删除<div class="th-resize"></div></th>
                        <th width="240" class="sortable" data-sort="title">店铺/标题<div class="th-resize"></div><span class="sort-ico">↕</span></th>
                        <th width="220" class="sortable" data-sort="name">SKU名称<div class="th-resize"></div><span class="sort-ico">↕</span></th>
                        <th width="90">价格<div class="th-resize"></div></th>
                        <th width="80">数量<div class="th-resize"></div></th>
                    </tr>
                </thead>
                <tbody id="saved-skus-list"></tbody>
            </table>
            <div class="section-title">导入/导出数据（包含分组名）</div>
            <textarea class="input" id="import-export-data" placeholder='导出示例：{"groupNames": {...}, "data": {...}}' style="height:90px"></textarea>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
                <button class="btn btn-info" id="export-data-btn">导出数据</button>
                <button class="btn btn-info" id="import-data-btn">导入数据</button>
            </div>
        `;
        document.body.appendChild(el);
        applySavedColumnWidths();
        document.getElementById('tool-close').onclick = () => el.remove();
        document.getElementById('log-toggle-btn').onclick = () => { setLogEnabled(!LOG_ENABLED); showNotification('日志已' + (LOG_ENABLED ? '开启' : '关闭')); };
        enableGroupRename();
        return el;
    }

    // ===== 分组改名 =====
    function enableGroupRename() {
        document.querySelectorAll('.group-btn').forEach(btn => {
            btn.addEventListener('dblclick', () => {
                const key = btn.dataset.group;
                const oldT = getGroupTitle(key);
                const input = document.createElement('input');
                input.className = 'group-rename-input';
                input.value = oldT;
                btn.replaceChildren(input);
                input.focus();
                input.select();
                const commit = () => {
                    const v = (input.value || '').trim() || oldT;
                    setGroupTitle(key, v);
                    btn.textContent = v;
                    if (btn.classList.contains('selected')) {
                        const g = document.getElementById('current-group-name');
                        if (g) g.textContent = v;
                    }
                    applyGroupTitles();
                };
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') commit();
                    if (e.key === 'Escape') btn.textContent = oldT;
                });
                input.addEventListener('blur', commit);
            });
        });
    }

    // ===== 列宽拖动 + 防误排序 =====
    function initColumnResize() {
        const table = document.querySelector('.saved-skus-table');
        if (!table) return;
        applySavedColumnWidths();

        const ths = table.querySelectorAll('thead th');
        ths.forEach(th => {
            const handle = th.querySelector('.th-resize');
            if (!handle) return;

            let startX = 0, startW = 0, idx = -1;
            let movedDuringResize = false;

            handle.addEventListener('mousedown', e => {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();

                // 禁用表头点击
                const thead = table.querySelector('thead');
                if (thead) thead.style.pointerEvents = 'none';

                const onMove = (me) => {
                    movedDuringResize = movedDuringResize || Math.abs(me.pageX - startX) > 2;
                    const w = Math.max(36, startW + (me.pageX - startX));
                    th.style.width = w + 'px';
                    if (idx < 0) idx = [...th.parentNode.children].indexOf(th);
                    table.querySelectorAll('tr').forEach(tr => {
                        const cell = tr.children[idx];
                        if (cell) cell.style.width = w + 'px';
                    });
                };

                const onUp = () => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);

                    // 恢复点击
                    if (thead) thead.style.pointerEvents = '';

                    if (movedDuringResize) { try { window.__wz_lastResizeAt = Date.now(); } catch(_) {} }
                    try { window.__wz_resizing = false; } catch(_) {}

                    try {
                        const widths = [...table.querySelectorAll('thead th')].map(h => {
                            const w = parseInt(window.getComputedStyle(h).width);
                            return isNaN(w) ? h.offsetWidth : w;
                        });
                        GM_setValue('saved_table_col_widths', widths);
                        if (LOG_ENABLED) console.log('[SKU工具] 列宽已保存：', widths);
                    } catch(e) { console.error('[SKU工具] 保存列宽失败', e); }
                };

                startX = e.pageX;
                startW = th.offsetWidth;
                idx = [...th.parentNode.children].indexOf(th);
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
        });
    }

    function applySavedColumnWidths() {
        try {
            const table = document.querySelector('.saved-skus-table');
            if (!table) return;
            const widths = GM_getValue('saved_table_col_widths', null);
            if (!Array.isArray(widths) || !widths.length) return;
            const ths = table.querySelectorAll('thead th');
            widths.forEach((w, idx) => {
                const width = Math.max(36, parseInt(w) || 0);
                if (ths[idx]) {
                    ths[idx].style.width = width + 'px';
                    table.querySelectorAll('tr').forEach(tr => {
                        const cell = tr.children[idx];
                        if (cell) cell.style.width = width + 'px';
                    });
                }
            });
        } catch(e) { console.error('[SKU工具] 恢复列宽失败', e); }
    }

    // ===== 展示平铺 =====
    function displayAllSKUs(skuData) {
        const container = document.getElementById('sku-buttons-container');
        const countEl = document.getElementById('sku-count');
        if (!container) return;
        container.innerHTML = '';
        (skuData.skus || []).forEach(s => {
            const btn = document.createElement('button');
            btn.className = 'sku-btn';
            btn.textContent = s.name || s.skuId;
            btn.title = `${s.name || s.skuId} (${s.price || '无价格'})`;
            btn.dataset.skuId = s.skuId;
            btn.dataset.price = s.price || '';
            btn.dataset.name = s.name || '';
            btn.addEventListener('click', () => {
                container.querySelectorAll('.sku-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                showNotification(`已选择: ${s.name || s.skuId} (${s.price || '无价格'})`);
            });
            container.appendChild(btn);
        });
        if (countEl) countEl.textContent = (skuData.skus || []).length;
    }

    // ===== 排序功能 =====
    function getSortState(groupKey) {
        try {
            const key = `saved_list_sort__${groupKey}`;
            const s = GM_getValue(key, { key: null, dir: 1 });
            return { key: s.key || null, dir: s.dir === -1 ? -1 : 1 };
        } catch(e) { return { key: null, dir: 1 }; }
    }
    function setSortState(groupKey, state) {
        const s = { key: state.key || null, dir: state.dir === -1 ? -1 : 1 };
        try { GM_setValue(`saved_list_sort__${groupKey}`, s); } catch(e) {}
    }
    function sortArray(arr, state) {
        if (!state.key) return arr.slice();
        const dir = state.dir;
        return arr.slice().sort((a, b) => {
            let av, bv;
            if (state.key === 'title') {
                av = `${a.shopName || ''} ${a.productTitle || ''}`;
                bv = `${b.shopName || ''} ${b.productTitle || ''}`;
            } else if (state.key === 'name') {
                av = a.name || a.skuId || '';
                bv = b.name || b.skuId || '';
            } else return 0;
            return av.localeCompare(bv, 'zh-Hans-CN') * dir;
        });
    }
    function updateSortIndicators(groupKey) {
        const table = document.querySelector('.saved-skus-table');
        if (!table) return;
        const state = getSortState(groupKey || currentGroupKey);
        table.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('active');
            const ico = th.querySelector('.sort-ico');
            if (ico) ico.textContent = '↕';
        });
        if (!state.key) return;
        const activeTh = table.querySelector(`th.sortable[data-sort="${state.key}"]`);
        if (activeTh) {
            activeTh.classList.add('active');
            let ico = activeTh.querySelector('.sort-ico');
            if (!ico) {
                ico = document.createElement('span');
                ico.className = 'sort-ico';
                activeTh.appendChild(ico);
            }
            ico.textContent = state.dir === 1 ? '↑' : '↓';
        }
    }

    // ===== 已保存列表 =====
    function updateSavedSKUList(groupKey) {
        const listEl = document.getElementById('saved-skus-list');
        if (!listEl) return;
        let arr = GM_getValue(`saved_skus_${groupKey}`, []) || [];
        if (!Array.isArray(arr)) arr = [];
        const state = getSortState(groupKey);
        const sortedArr = sortArray(arr, state);
        const savedCount = document.getElementById('saved-sku-count');
        if (savedCount) savedCount.textContent = String(arr.length || 0);

        const makeQtySelect = (q, i) => {
            const qty = Number(q) > 0 ? Number(q) : 1;
            const opts = Array.from({ length: 50 }, (_, k) => {
                const n = k + 1;
                return `<option value="${n}" ${n === qty ? 'selected' : ''}>${n}</option>`;
            }).join('');
            return `<select class="qty-select" data-index="${i}" style="min-width:64px;padding:4px 6px;border-radius:6px;border:1px solid #ddd;">${opts}</select>`;
        };

        listEl.innerHTML = sortedArr.map((s, i) => `
            <tr>
                <td><input type="checkbox" class="sku-checkbox" data-index="${i}" /></td>
                <td><button class="btn btn-xs btn-danger del-btn" data-index="${i}">删除</button></td>
                <td class="cell-ellipsis" title="${(s.shopName || '-')} / ${(s.productTitle || '-')}">${(s.shopName || '-')} / ${(s.productTitle || '-')}</td>
                <td class="cell-ellipsis" title="${(s.name || s.skuId || '-')}">${(s.name || s.skuId || '-')}</td>
                <td>${fmtPrice(s.price)}</td>
                <td>${makeQtySelect(s.quantity || 1, i)}</td>
            </tr>
        `).join('');

        const selectAll = document.getElementById('select-all-checkbox');
        if (selectAll) {
            selectAll.checked = false;
            selectAll.onchange = () => {
                document.querySelectorAll('.sku-checkbox').forEach(cb => cb.checked = selectAll.checked);
            };
        }

        listEl.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = Number(btn.dataset.index);
                const ok = await showConfirm('是否确定删除该SKU？此操作无法撤销。');
                if (!ok) return;
                const cur = GM_getValue(`saved_skus_${groupKey}`, []) || [];
                if (idx >= 0 && idx < cur.length) cur.splice(idx, 1);
                GM_setValue(`saved_skus_${groupKey}`, cur);
                updateSavedSKUList(groupKey);
                const rb = document.getElementById('result-box');
                if (rb) rb.textContent = generateBPLink(cur);
                showNotification('已删除SKU');
            });
        });

        listEl.querySelectorAll('.qty-select').forEach(sel => {
            sel.addEventListener('change', () => {
                const idx = Number(sel.dataset.index);
                const val = parseInt(sel.value) || 1;
                const cur = GM_getValue(`saved_skus_${groupKey}`, []) || [];
                if (idx >= 0 && idx < cur.length) {
                    cur[idx].quantity = val;
                    GM_setValue(`saved_skus_${groupKey}`, cur);
                    const rb = document.getElementById('result-box');
                    if (rb) rb.textContent = generateBPLink(cur);
                    showNotification(`数量已更新为 ${val}`);
                }
            });
        });

        listEl.querySelectorAll('tr').forEach(tr => {
            const cb = tr.querySelector('.sku-checkbox');
            if (!cb) return;
            cb.addEventListener('change', () => tr.classList.toggle('row-selected', cb.checked));
            tr.addEventListener('click', e => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.closest('.del-btn')) return;
                cb.checked = !cb.checked;
                tr.classList.toggle('row-selected', cb.checked);
            });
        });

        applySavedColumnWidths();
        updateSortIndicators(groupKey);
    }

    function fmtPrice(p) {
        if (p == null || p === '') return '-';
        const s = String(p).trim();
        const withSym = /[¥￥]/.test(s);
        if (withSym) return s.replace(/￥/g, '¥').replace(/\s+/g, '');
        const numStr = s.replace(/,/g, '');
        const n = Number(numStr);
        if (Number.isFinite(n)) return '¥' + n.toFixed(2);
        const mm = s.match(/-?\d+(?:\.\d+)?/g);
        if (mm && mm.length >= 1) {
            if (mm.length >= 2) return `¥${mm[0]}~¥${mm[1]}`;
            return '¥' + mm[0];
        }
        return '¥' + s;
    }

    function generateBPLink(skus) {
        const parts = (skus || []).map(s => {
            const qty = Number(s.quantity) > 0 ? Number(s.quantity) : 1;
            return `${s.itemId}_${qty}_${s.skuId}`;
        });
        const base = "773473874280_6_5462206894577";
        const link = "https://h5.m.taobao.com/awp/base/buy.htm?buyParam=" +
                     ((parts.length + 1 >= 3) ? parts.join(',') : [base, ...parts].join(','));
        return link;
    }

    function moveSelectedSKUs(sourceGroup, targetGroup) {
        if (sourceGroup === targetGroup) return showNotification('源分组和目标分组相同', true);
        const source = GM_getValue(`saved_skus_${sourceGroup}`, []) || [];
        const target = GM_getValue(`saved_skus_${targetGroup}`, []) || [];
        const idxs = [...document.querySelectorAll('.sku-checkbox:checked')].map(cb => Number(cb.dataset.index));
        if (!idxs.length) return showNotification('请先选择SKU', true);
        let moved = 0;
        idxs.sort((a, b) => b - a).forEach(i => {
            if (i >= 0 && i < source.length) {
                const sku = source.splice(i, 1)[0];
                if (!target.some(s => s.itemId === sku.itemId && s.skuId === sku.skuId)) { target.push(sku); moved++; }
            }
        });
        GM_setValue(`saved_skus_${sourceGroup}`, source);
        GM_setValue(`saved_skus_${targetGroup}`, target);
        const current = document.querySelector('.group-btn.selected')?.dataset.group || 'default';
        updateSavedSKUList(current);
        const rb = document.getElementById('result-box');
        if (rb) rb.textContent = generateBPLink(source);
        showNotification(`已移动 ${moved} 个SKU`);
    }

    function copySelectedSKUs(sourceGroup, targetGroup) {
        if (sourceGroup === targetGroup) return showNotification('源分组和目标分组相同', true);
        const source = GM_getValue(`saved_skus_${sourceGroup}`, []) || [];
        const target = GM_getValue(`saved_skus_${targetGroup}`, []) || [];
        const idxs = [...document.querySelectorAll('.sku-checkbox:checked')].map(cb => Number(cb.dataset.index));
        if (!idxs.length) return showNotification('请先选择SKU', true);
        let copied = 0;
        idxs.forEach(i => {
            if (i >= 0 && i < source.length) {
                const sku = source[i];
                if (!target.some(s => s.itemId === sku.itemId && s.skuId === sku.skuId)) { target.push(sku); copied++; }
            }
        });
        GM_setValue(`saved_skus_${targetGroup}`, target);
        const current = document.querySelector('.group-btn.selected')?.dataset.group || 'default';
        if (current === targetGroup) updateSavedSKUList(current);
        const rb = document.getElementById('result-box');
        if (rb) rb.textContent = generateBPLink(target);
        showNotification(`已复制 ${copied} 个SKU`);
    }

    async function deleteSelectedSKUs(currentGroup) {
        const arr = GM_getValue(`saved_skus_${currentGroup}`, []) || [];
        const idxs = [...document.querySelectorAll('.sku-checkbox:checked')].map(cb => Number(cb.dataset.index)).sort((a, b) => b - a);
        if (!idxs.length) return showNotification('请先选择SKU', true);
        const ok = await showConfirm('是否确定删除选中的 SKU？此操作无法撤销。');
        if (!ok) return;
        idxs.forEach(i => { if (i >= 0 && i < arr.length) { arr.splice(i, 1); } });
        GM_setValue(`saved_skus_${currentGroup}`, arr);
        updateSavedSKUList(currentGroup);
        const rb = document.getElementById('result-box');
        if (rb) rb.textContent = generateBPLink(arr);
        showNotification('已删除选中SKU');
    }

    function exportData() {
        const data = {};
        GROUP_KEYS.forEach(g => data[g] = GM_getValue(`saved_skus_${g}`, []) || []);
        const groupNames = {};
        GROUP_KEYS.forEach(g => groupNames[g] = getGroupTitle(g));
        const payload = { groupNames, data };
        const txt = JSON.stringify(payload, null, 2);
        const ta = document.getElementById('import-export-data');
        if (ta) ta.value = txt;
        GM_setClipboard(txt, 'text');
        showNotification('数据(含分组名)已导出并复制');
    }

    function importData() {
        const ta = document.getElementById('import-export-data');
        if (!ta) { showNotification('未找到导入文本框', true); return; }
        const raw = (ta.value || '').trim();
        if (!raw) { showNotification('请先粘贴要导入的数据', true); return; }

        let payload = null;
        try {
            const dehtml = raw.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            payload = JSON.parse(dehtml);
        } catch (e) {
            console.error('[SKU工具] JSON 解析失败：', e, raw);
            showNotification('导入失败：JSON 格式不正确', true);
            return;
        }

        let groupNames = null;
        let dataObj = null;

        if (payload && payload.groupNames && payload.data) {
            groupNames = payload.groupNames;
            dataObj = payload.data;
        } else if (payload && (payload.default || payload.group1 || payload.group2 || payload.group3 || payload.group4 || payload.group5)) {
            dataObj = payload;
        } else {
            showNotification('导入失败：数据结构不符合要求', true);
            return;
        }

        const keys = ['default', 'group1', 'group2', 'group3', 'group4', 'group5'];
        for (const k of keys) {
            if (dataObj && k in dataObj && !Array.isArray(dataObj[k])) {
                showNotification(`导入失败：分组 ${k} 不是数组`, true);
                return;
            }
        }

        if (groupNames && typeof groupNames === 'object') {
            try {
                keys.forEach(k => { if (groupNames[k]) setGroupTitle(k, String(groupNames[k])); });
                applyGroupTitles();
            } catch (e) { console.warn('[SKU工具] 应用分组名失败：', e); }
        }

        try {
            keys.forEach(k => {
                if (Array.isArray(dataObj?.[k])) {
                    const cleaned = dataObj[k].map(x => ({
                        ...x,
                        quantity: (Number(x.quantity) > 0 ? Number(x.quantity) : 1)
                    }));
                    GM_setValue(`saved_skus_${k}`, cleaned);
                }
            });
        } catch (e) {
            console.error('[SKU工具] 保存导入数据失败：', e);
            showNotification('导入失败：无法写入存储', true);
            return;
        }

        const current = document.querySelector('.group-btn.selected')?.dataset.group || 'default';
        updateSavedSKUList(current);
        const gname = document.getElementById('current-group-name');
        if (gname) gname.textContent = getGroupTitle(current);
        const rb = document.getElementById('result-box');
        const saved = GM_getValue(`saved_skus_${current}`, []) || [];
        if (rb) rb.textContent = generateBPLink(saved);

        showNotification('导入完成（已覆盖分组名与数据）');
    }

    // ===== 绑定 =====
    let quantityBtns = [];
    function bindGroupButtons() {
        document.querySelectorAll('.group-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                currentGroupKey = btn.dataset.group;
                updateSavedSKUList(currentGroupKey);
                const arr = GM_getValue(`saved_skus_${currentGroupKey}`, []) || [];
                document.getElementById('result-box').textContent = generateBPLink(arr);
                const gname = document.getElementById('current-group-name');
                if (gname) gname.textContent = getGroupTitle(currentGroupKey);
                showNotification(`已切换到 ${getGroupTitle(currentGroupKey)} 组`);
            });
        });
    }

    function wireQuantity() {
        quantityBtns = [...document.querySelectorAll('.quantity-btn')];
        const customSelect = document.getElementById('custom-quantity');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                quantityBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedQuantity = parseInt(btn.dataset.quantity);
                if (customSelect) customSelect.value = selectedQuantity;
            });
        });
        if (customSelect) {
            customSelect.addEventListener('change', () => {
                selectedQuantity = parseInt(customSelect.value);
                quantityBtns.forEach(b => b.classList.remove('selected'));
            });
        }
        const one = quantityBtns.find(b => b.dataset.quantity === '1');
        if (one) one.classList.add('selected');
    }

    // ===== 渲染入口 =====
    function renderCurrentSKUs(data) {
        const title = getProductTitle() || '';
        const container = document.getElementById('sku-buttons-container');
        const countEl = document.getElementById('sku-count');

        if (/泡泡玛特/i.test(title)) {
            displayAllSKUs(data);
            if (countEl) countEl.textContent = (data.skus || []).length;
            return;
        }

        let groups = collectAttributeGroupsFromPage();
        if (groups && groups.length) {
            renderTieredSelectorFromGroups(data, groups);
            if (countEl) countEl.textContent = (data.skus || []).length;
            return;
        }

        groups = inferGroupsFromSkuNames(data.skus || []);
        if (groups && groups.length) {
            renderTieredSelectorFromGroups(data, groups);
            if (countEl) countEl.textContent = (data.skus || []).length;
            return;
        }

        displayAllSKUs(data);
        if (countEl) countEl.textContent = (data.skus || []).length;
        if (!data.skus?.length) {
            showNotification('未获取到SKU数据，请先打开页面里的“SKU明细”弹层再点“重新抓取”', true);
        }
    }

    // ===== 排序绑定 =====
    function bindSortHeaders() {
        document.addEventListener('click', e => {
            const th = e.target.closest('th.sortable');
            if (!th) return;
            const key = th.dataset.sort;
            if (!key) return;
            e.preventDefault();
            e.stopPropagation();

            const state = getSortState(currentGroupKey);
            const newState = state.key === key ? { ...state, dir: state.dir === 1 ? -1 : 1 } : { key, dir: 1 };
            setSortState(currentGroupKey, newState);
            updateSavedSKUList(currentGroupKey);
        }, true);
    }

    // ===== 初始化 =====
    function init() {
        try {
            const ui = createToolUI();
            applyGroupTitles();
            bindGroupButtons();
            wireQuantity();
            initColumnResize();
            bindSortHeaders();

            document.getElementById('shop-name').textContent = getShopName();
            document.getElementById('product-title').textContent = getProductTitle();

            const first = getSKUsFromPage();
            currentSKUData = first;
            renderCurrentSKUs(first);

            const refreshBtn = document.getElementById('refresh-sku-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', async () => {
                    showNotification('开始轮询抓取（最多100次，每500ms一次）…');
                    const res = await pollForSKUs(100, 500);
                    currentSKUData = res.data;
                    renderCurrentSKUs(res.data);
                    if (res.ok) showNotification(`抓取成功：第 ${res.attempt} 次获取到 ${res.data.skus.length} 条`);
                    else showNotification(`未获取到SKU（已尝试 ${res.attempt} 次）`, true);
                });
            }

            if (!first || !first.skus || first.skus.length === 0) {
                (async () => {
                    showNotification('首次为空，自动轮询抓取开始…');
                    const res = await pollForSKUs(100, 500);
                    currentSKUData = res.data;
                    renderCurrentSKUs(res.data);
                    if (res.ok) showNotification(`抓取成功：第 ${res.attempt} 次获取到 ${res.data.skus.length} 条`);
                    else showNotification(`未获取到SKU（已尝试 ${res.attempt} 次）`, true);
                })();
            }

            document.getElementById('save-sku-btn')?.addEventListener('click', () => {
                const selectedBtn = document.querySelector('#sku-buttons-container .sku-btn.selected');
                if (!selectedBtn) return showNotification('请先选择一个SKU', true);
                const group = currentGroupKey || 'default';
                const arr = GM_getValue(`saved_skus_${group}`, []) || [];
                const sku = {
                    itemId: getItemIdFromURL() || currentSKUData?.itemId || '',
                    skuId: selectedBtn.dataset.skuId,
                    name: selectedBtn.dataset.name || selectedBtn.textContent || '',
                    price: selectedBtn.dataset.price || '',
                    quantity: selectedQuantity,
                    productTitle: getProductTitle(),
                    shopName: getShopName()
                };
                if (arr.some(s => s.itemId === sku.itemId && s.skuId === sku.skuId)) return showNotification('该SKU已保存', true);
                arr.push(sku);
                GM_setValue(`saved_skus_${group}`, arr);
                updateSavedSKUList(group);
                document.getElementById('result-box').textContent = generateBPLink(arr);
                showNotification('已保存SKU');
            });

            document.getElementById('copy-btn')?.addEventListener('click', () => {
                const group = currentGroupKey || 'default';
                const arr = GM_getValue(`saved_skus_${group}`, []) || [];
                const link = generateBPLink(arr);
                GM_setClipboard(link, 'text');
                document.getElementById('result-box').textContent = link;
                showNotification('BP链接已复制');
            });

            document.getElementById('copy-all-sku-links-btn')?.addEventListener('click', () => {
                if (!currentSKUData || !currentSKUData.skus?.length) return showNotification('暂无SKU数据', true);
                const parts = currentSKUData.skus.map(s => `${currentSKUData.itemId}_1_${s.skuId}`);
                const base = "773473874280_6_5462206894577";
                const baseLink = "https://h5.m.taobao.com/awp/base/buy.htm?buyParam=";
                const final = (parts.length + 1 >= 3) ? parts.join(',') : [base, ...parts].join(',');
                const link = baseLink + final;
                GM_setClipboard(link, 'text');
                showNotification(`已复制 ${currentSKUData.skus.length} 个SKU的BP链接`);
            });

            document.getElementById('clear-saved-btn')?.addEventListener('click', async () => {
                const group = currentGroupKey || 'default';
                const ok = await showConfirm(`是否清空分组【${getGroupTitle(group)}】的所有SKU？此操作无法撤销。`);
                if (!ok) return;
                GM_setValue(`saved_skus_${group}`, []);
                updateSavedSKUList(group);
                document.getElementById('result-box').textContent = generateBPLink([]);
                showNotification('已清空当前组');
            });

            document.getElementById('move-selected-btn')?.addEventListener('click', () => {
                const source = currentGroupKey || 'default';
                const target = document.getElementById('move-target-group')?.value || 'default';
                moveSelectedSKUs(source, target);
            });

            document.getElementById('copy-selected-btn')?.addEventListener('click', () => {
                const source = currentGroupKey || 'default';
                const target = document.getElementById('move-target-group')?.value || 'default';
                copySelectedSKUs(source, target);
            });

            document.getElementById('delete-selected-btn')?.addEventListener('click', () => {
                const current = currentGroupKey || 'default';
                deleteSelectedSKUs(current);
            });

            const exportBtn = document.getElementById('export-data-btn');
            if (exportBtn) exportBtn.addEventListener('click', exportData);
            const importBtn = document.getElementById('import-data-btn');
            if (importBtn) importBtn.addEventListener('click', importData);

            updateSavedSKUList('default');
        } catch (e) {
            console.error('[SKU工具] 初始化失败', e);
            showNotification('脚本初始化失败，请刷新页面重试', true);
        }
    }

    // 脚本启动
    function getScriptName() {
        try {
            const m = GM_info?.scriptMetaStr || '';
            const a = m.match(/@name\s+(.+)/);
            if (a) return a[1].trim();
        } catch(e) {}
        return 'SKU工具';
    }
    const SCRIPT_NAME = getScriptName();
    const SCRIPT_VERSION = GM_info?.script?.version || '0';
    console.log(`%c[${SCRIPT_NAME}] 加载完成 - 当前版本 ${SCRIPT_VERSION}`, 'color:#4CAF50;font-weight:bold;');

    (async function autoCheckUpdate() {
        const meta = GM_info?.scriptMetaStr || '';
        const cur = (meta.match(/@version\s+([0-9.]+)/) || [])[1]?.trim() || '0';
        const url = (meta.match(/@downloadURL\s+(\S+)/) || [])[1] || '';
        if (!url) return;
        try {
            const r = await fetch(url, { cache: 'no-store' });
            const t = await r.text();
            const m = t.match(/@version\s+([0-9.]+)/);
            if (m && m[1] && m[1].trim() !== cur) {
                alert(`检测到新版本 ${m[1].trim()}\n当前版本：${cur}\n\n请在 Tampermonkey 中“检查更新”。`);
            }
        } catch(e) {}
    })();

    // 强制执行 init
    setTimeout(init, 500);
})();