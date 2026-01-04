// ==UserScript==
// @name         思齐垃圾一键赠送
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  物品栏一键赠送助手
// @author       lingsheen
// @license      Copyright (c) 2025 lingsheen, All Rights Reserved
// @match        *://si-qi.xyz/mowan.php*
// @match        *://www.si-qi.xyz/mowan.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556983/%E6%80%9D%E9%BD%90%E5%9E%83%E5%9C%BE%E4%B8%80%E9%94%AE%E8%B5%A0%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/556983/%E6%80%9D%E9%BD%90%E5%9E%83%E5%9C%BE%E4%B8%80%E9%94%AE%E8%B5%A0%E9%80%81.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const SETTINGS_KEY = 'siqi_onekey_gift_settings_v1';

    const defaultSettings = {
        giftUid: '',
        keepConfig: {} // { itemName: keepCount }
    };

    let settings = loadSettings();
    let giftQueue = [];
    let giftSummary = [];
    let giftToastTimer = null;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    function init() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;

        createGiftPanel(inventoryGrid);
    }

    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (!raw) return { ...defaultSettings };
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            return { ...defaultSettings };
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            // ignore
        }
    }

    function createGiftPanel(inventoryGrid) {
        if (document.getElementById('siqi-okg-panel')) return;

        const card = document.createElement('div');
        card.id = 'siqi-okg-panel';
        card.className = 'inventory-item has-items';
        card.style.cursor = 'default';

        card.innerHTML = `
            <span class="item-icon">🎁</span>
            <div class="item-name">一键赠送</div>
            <div class="item-count" style="font-size:11px;line-height:1.4;background:transparent;border:none;box-shadow:none;padding:0;">
                <div style="margin-bottom:4px;text-align:center;white-space:nowrap;">
                    <span style="font-size:10px;font-weight:normal;">UID:</span>
                    <input id="siqi-okg-uid" type="text" style="width:44px;padding:1px 3px;font-size:11px;text-align:center;box-sizing:border-box;" />
                </div>
            </div>
            <div style="margin-top:6px;display:flex;gap:6px;justify-content:space-between;">
                <button id="siqi-okg-settings" style="flex:1;padding:4px 6px;font-size:11px;">设置</button>
                <button id="siqi-okg-start" style="flex:1;padding:4px 6px;font-size:11px;background:#f39c12;color:#fff;border:none;border-radius:4px;">赠送</button>
            </div>
            <div id="siqi-okg-status" style="margin-top:4px;min-height:14px;font-size:11px;color:#666;display:none;"></div>
        `;

        // 作为物品栏中的最后一项
        inventoryGrid.appendChild(card);

        const uidInput = document.getElementById('siqi-okg-uid');
        const settingsBtn = document.getElementById('siqi-okg-settings');
        const startBtn = document.getElementById('siqi-okg-start');

        if (uidInput) {
            uidInput.value = settings.giftUid || '';
            const saveUid = () => {
                const val = uidInput.value.trim();
                settings.giftUid = val;
                saveSettings();
                setGiftStatus(val ? `已保存 UID：${val}` : '已清空 UID');
            };
            uidInput.addEventListener('blur', saveUid);
            uidInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    uidInput.blur();
                }
            });
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                openGiftSettingsModal();
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                startOneKeyGift();
            });
        }
    }

    function setGiftStatus(msg) {
        const el = document.getElementById('siqi-okg-status');
        if (el) {
            el.textContent = msg || '';
        }
    }

    // 顶部右上角提示条
    function showGiftToast(message) {
        if (!message) return;
        let toast = document.getElementById('siqi-okg-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'siqi-okg-toast';
            toast.style.position = 'fixed';
            toast.style.top = '18px';
            toast.style.right = '18px';
            toast.style.maxWidth = '320px';
            toast.style.zIndex = '100001';
            toast.style.padding = '6px 18px';
            toast.style.background = 'rgba(255,255,255,0.98)';
            toast.style.borderRadius = '999px';
            toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.22)';
            toast.style.border = '1px solid #4ea3ff';
            toast.style.fontSize = '12px';
            toast.style.color = '#333';
            toast.style.textAlign = 'center';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.display = 'block';

        if (giftToastTimer) {
            clearTimeout(giftToastTimer);
        }
        giftToastTimer = setTimeout(() => {
            if (toast) toast.style.display = 'none';
        }, 2600);
    }

    // 保留数量设置弹窗
    function openGiftSettingsModal() {
        let overlay = document.getElementById('siqi-okg-settings-modal');
        if (overlay) {
            overlay.style.display = 'flex';
            return;
        }

        overlay = document.createElement('div');
        overlay.id = 'siqi-okg-settings-modal';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.35)';
        overlay.style.zIndex = '100002';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const panel = document.createElement('div');
        panel.style.background = '#fff';
        panel.style.borderRadius = '10px';
        panel.style.padding = '14px 16px';
        panel.style.minWidth = '360px';
        panel.style.maxWidth = '90vw';
        panel.style.maxHeight = '80vh';
        panel.style.overflow = 'auto';
        panel.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
        panel.style.fontSize = '12px';

        const title = document.createElement('div');
        title.textContent = '一键赠送设置';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '6px';

        const tip = document.createElement('div');
        tip.textContent = '为每种物资设置需要保留的数量，不填表示全部保留、不参与一键赠送。';
        tip.style.fontSize = '11px';
        tip.style.color = '#666';
        tip.style.marginBottom = '8px';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const tbody = document.createElement('tbody');

        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            const cards = Array.from(grid.querySelectorAll('.inventory-item'));
            cards.forEach(card => {
                const nameEl = card.querySelector('.item-name');
                const countEl = card.querySelector('.item-count');
                const giftBtn = card.querySelector('.gift-btn');
                if (!nameEl || !countEl || !giftBtn) return;

                const iconEl = card.querySelector('.item-icon');
                const icon = iconEl ? (iconEl.textContent || '').trim() : '';
                const name = nameEl.textContent.trim();
                
                // 排除蚯蚓，不在设置列表中显示
                if (name === '蚯蚓') return;
                
                const count = parseInt(countEl.textContent.trim(), 10) || 0;

                const tr = document.createElement('tr');

                const tdName = document.createElement('td');
                tdName.style.padding = '4px 6px 4px 0';
                tdName.style.whiteSpace = 'nowrap';
                tdName.textContent = `${icon ? icon + ' ' : ''}${name}（当前：${count}）`;

                const tdInput = document.createElement('td');
                tdInput.style.padding = '4px 0';
                tdInput.style.textAlign = 'right';

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.style.width = '80px';
                input.style.fontSize = '12px';
                input.style.padding = '2px 4px';
                input.dataset.itemName = name;
                const keepVal = settings.keepConfig && settings.keepConfig[name];
                if (keepVal !== undefined && keepVal !== null && keepVal !== '') {
                    input.value = keepVal;
                }

                tdInput.appendChild(input);
                tr.appendChild(tdName);
                tr.appendChild(tdInput);
                tbody.appendChild(tr);
            });
        }

        table.appendChild(tbody);

        const btnRow = document.createElement('div');
        btnRow.style.marginTop = '10px';
        btnRow.style.textAlign = 'right';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.marginRight = '8px';
        cancelBtn.onclick = () => {
            overlay.style.display = 'none';
        };

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.onclick = () => {
            const inputs = tbody.querySelectorAll('input[data-item-name]');
            const newCfg = Object.create(null);
            inputs.forEach(input => {
                const name = input.dataset.itemName || '';
                const val = input.value.trim();
                if (!name) return;
                if (val === '') return;
                const num = Math.max(0, parseInt(val, 10) || 0);
                newCfg[name] = num;
            });
            settings.keepConfig = newCfg;
            saveSettings();
            setGiftStatus('已保存保留数量设置');
            overlay.style.display = 'none';
        };

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(saveBtn);

        panel.appendChild(title);
        panel.appendChild(tip);
        panel.appendChild(table);
        panel.appendChild(btnRow);

        overlay.appendChild(panel);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        });

        document.body.appendChild(overlay);
    }

    function startOneKeyGift() {
        if (!settings.giftUid || !settings.giftUid.trim()) {
            setGiftStatus('请先填写并保存 UID');
            alert('请先在一键赠送面板中填写对方 UID 并点击保存。');
            return;
        }

        const { queue, total } = buildGiftQueueFromInventory();
        if (!queue.length) {
            setGiftStatus('没有符合条件的可赠送物资（均未超过保留数量）');
            // 显示确认框提示无可赠送物品
            showNoItemsModal();
            return;
        }

        giftQueue = queue.slice();
        giftSummary = queue.slice();

        // 立即显示开始执行的消息弹窗
        showGiftToast(`开始执行一键赠送！${queue.length} 种物品，共 ${total} 件`);
        setGiftStatus(`已生成一键赠送任务：${queue.length} 种，共 ${total} 件，将自动依次赠送。`);
        
        // 立即执行第一次，无需延时
        runNextAutoGift(true);
    }

    function buildGiftQueueFromInventory() {
        const grid = document.getElementById('inventoryGrid');
        const queue = [];
        let total = 0;
        if (!grid) return { queue, total };

        const cards = Array.from(grid.querySelectorAll('.inventory-item'));
        cards.forEach(card => {
            const nameEl = card.querySelector('.item-name');
            const countEl = card.querySelector('.item-count');
            const giftBtn = card.querySelector('.gift-btn');
            if (!nameEl || !countEl || !giftBtn) return;

            const iconEl = card.querySelector('.item-icon');
            const icon = iconEl ? (iconEl.textContent || '').trim() : '';
            const name = nameEl.textContent.trim();
            
            // 排除蚯蚓，不参与一键赠送
            if (name === '蚯蚓') return;
            
            const count = parseInt(countEl.textContent.trim(), 10) || 0;
            if (count <= 0) return;

            const keep = getKeepCountFor(name, count);
            const giftQty = Math.max(0, count - keep);
            if (giftQty > 0) {
                queue.push({ name, quantity: giftQty, icon });
                total += giftQty;
            }
        });

        return { queue, total };
    }

    function getKeepCountFor(name, currentCount) {
        if (!settings.keepConfig) return currentCount;
        const raw = settings.keepConfig[name];
        if (raw === undefined || raw === null || raw === '') {
            return currentCount;
        }
        const n = Math.max(0, parseInt(raw, 10) || 0);
        return n;
    }

    // 顺序调用后端 gift_item 接口
    function runNextAutoGift(isFirst = false) {
        if (!giftQueue || !giftQueue.length) {
            setGiftStatus('一键赠送任务已完成');
            showGiftSummaryModal();
            return;
        }

        const task = giftQueue.shift();
        const qty = task.quantity;

        if (!settings.giftUid || !settings.giftUid.trim()) {
            setGiftStatus('UID 已丢失，请重新填写后再试。');
            return;
        }

        setGiftStatus(`正在赠送 ${task.name} x ${qty} 给 UID ${settings.giftUid}（剩余 ${giftQueue.length} 种）`);

        // 第一次无需延时，后续缩短延时
        const delay = isFirst ? 0 : randomInt(300, 600);
        setTimeout(() => {
            const params = new URLSearchParams();
            params.set('action', 'gift_item');
            params.set('item_name', task.name);
            params.set('uid', settings.giftUid.trim());
            params.set('quantity', String(qty));

            fetch('mowan.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            })
                .then(r => r.json())
                .then(data => {
                    if (data && data.success) {
                        const iconPart = task.icon ? task.icon + ' ' : '';
                        showGiftToast(`${iconPart}${task.name} x ${qty} 已赠送给 UID ${settings.giftUid}`);
                    } else {
                        const msg = (data && data.message) || '未知错误';
                        setGiftStatus(`赠送 ${task.name} 失败：${msg}`);
                    }
                })
                .catch(err => {
                    setGiftStatus(`赠送 ${task.name} 异常：${err && err.message ? err.message : err}`);
                })
                .finally(() => {
                    // 缩短下一次赠送的等待时间
                    setTimeout(() => {
                        runNextAutoGift(false);
                    }, randomInt(300, 800));
                });
        }, delay);
    }

    // 本轮汇总弹窗
    function showGiftSummaryModal() {
        const overlayId = 'siqi-okg-summary-overlay';
        let overlay = document.getElementById(overlayId);
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.45)';
        overlay.style.zIndex = '100003';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const panel = document.createElement('div');
        panel.style.background = '#fff';
        panel.style.borderRadius = '12px';
        panel.style.padding = '18px 22px 14px';
        panel.style.minWidth = '320px';
        panel.style.maxWidth = '480px';
        panel.style.boxShadow = '0 10px 32px rgba(0,0,0,0.25)';
        panel.style.fontSize = '13px';
        panel.style.color = '#333';

        const title = document.createElement('div');
        title.textContent = '一键赠送完成';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        title.style.marginBottom = '8px';

        const tip = document.createElement('div');
        tip.style.fontSize = '11px';
        tip.style.color = '#666';
        tip.style.marginBottom = '6px';
        tip.textContent = settings.giftUid ? `已向 UID ${settings.giftUid} 赠送以下物资：` : '已赠送以下物资：';

        const listWrap = document.createElement('div');
        listWrap.style.maxHeight = '200px';
        listWrap.style.overflow = 'auto';
        listWrap.style.marginBottom = '8px';

        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.margin = '0';
        ul.style.padding = '0';

        if (giftSummary && giftSummary.length) {
            giftSummary.forEach(item => {
                const li = document.createElement('li');
                li.style.padding = '2px 0';
                const iconPart = item.icon ? item.icon + ' ' : '';
                li.textContent = `${iconPart}${item.name} x ${item.quantity}`;
                ul.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.style.padding = '2px 0';
            li.textContent = '本轮未赠送任何物资。';
            ul.appendChild(li);
        }

        listWrap.appendChild(ul);

        const btnRow = document.createElement('div');
        btnRow.style.textAlign = 'right';
        btnRow.style.marginTop = '6px';

        const okBtn = document.createElement('button');
        okBtn.textContent = '确认';
        okBtn.style.padding = '4px 16px';
        okBtn.style.fontSize = '12px';
        okBtn.style.borderRadius = '999px';
        okBtn.style.border = 'none';
        okBtn.style.background = '#f39c12';
        okBtn.style.color = '#fff';
        okBtn.onclick = () => {
            try {
                location.reload();
            } catch (e) {
                // ignore
            }
        };

        btnRow.appendChild(okBtn);

        panel.appendChild(title);
        panel.appendChild(tip);
        panel.appendChild(listWrap);
        panel.appendChild(btnRow);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // 无可赠送物品弹窗
    function showNoItemsModal() {
        const overlayId = 'siqi-okg-noitems-overlay';
        let overlay = document.getElementById(overlayId);
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.45)';
        overlay.style.zIndex = '100003';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const panel = document.createElement('div');
        panel.style.background = '#fff';
        panel.style.borderRadius = '12px';
        panel.style.padding = '18px 22px 14px';
        panel.style.minWidth = '320px';
        panel.style.maxWidth = '480px';
        panel.style.boxShadow = '0 10px 32px rgba(0,0,0,0.25)';
        panel.style.fontSize = '13px';
        panel.style.color = '#333';

        const title = document.createElement('div');
        title.textContent = '无可赠送物品';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        title.style.marginBottom = '8px';

        const tip = document.createElement('div');
        tip.style.fontSize = '12px';
        tip.style.color = '#666';
        tip.style.marginBottom = '12px';
        tip.style.lineHeight = '1.6';
        tip.textContent = '所有物品均未超过保留数量，请检查保留数量设置。';

        const btnRow = document.createElement('div');
        btnRow.style.textAlign = 'right';
        btnRow.style.marginTop = '6px';

        const okBtn = document.createElement('button');
        okBtn.textContent = '确认';
        okBtn.style.padding = '4px 16px';
        okBtn.style.fontSize = '12px';
        okBtn.style.borderRadius = '999px';
        okBtn.style.border = 'none';
        okBtn.style.background = '#f39c12';
        okBtn.style.color = '#fff';
        okBtn.style.cursor = 'pointer';
        okBtn.onclick = () => {
            overlay.remove();
        };

        btnRow.appendChild(okBtn);

        panel.appendChild(title);
        panel.appendChild(tip);
        panel.appendChild(btnRow);

        overlay.appendChild(panel);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})();

