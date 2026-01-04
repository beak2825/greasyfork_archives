// ==UserScript==
// @name         hax自动抢鸡
// @namespace    https://github.com/lvqopl/hax-auto-create-vps
// @version      2.10.4
// @description  常驻面板，默认永远缓存设置；支持密码、系统索引、数据中心空时刷新延迟、目标数据中心、开始/暂停；woiden 自动算术验证码（nextSibling 运算符）。
// @author       lvqopl
// @match        *://hax.co.id/create-vps/*
// @match        *://woiden.id/create-vps/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560433/hax%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%B8%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/560433/hax%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%B8%A1.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ==========================================================
       1️⃣ 常量 & 全局变量
       ========================================================== */
    const PANEL_ID    = 'vps-auto-settings-panel';
    const STORAGE_KEY = 'vps_auto_settings';   // 本地缓存（始终使用）
    const STATE_KEY   = 'vps_auto_state';      // “running” / “paused”

    let automationRunning = false; // true → 正在运行，false → 已暂停
    let cfWatcherTimer    = null; // Cloudflare Turnstile 轮询计时器
    let dcRefreshTimer    = null; // 数据中心为空时的单次刷新计时器

    /* ==========================================================
       2️⃣ 工具函数
       ========================================================== */
    const waitForElement = (selector, callback) => {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        setTimeout(() => waitForElement(selector, callback), 100);
    };

    // 你提供的 extractNumber（只取 “-” 之后、遇到 . 或 : 前的首位数字）
    const extractNumber = url => {
        const dashPos = url.indexOf("-");
        if (dashPos === -1) return 0;
        const separatorPos = url.slice(dashPos + 1).search(/[.:]/);
        if (separatorPos === -1) return 0;
        const numStr = url.slice(dashPos + 1, dashPos + 1 + separatorPos);
        const fullNumber = parseInt(numStr, 10) || 0;
        return fullNumber === 0 ? 0 : Number(String(fullNumber)[0]);
    };

    /* ==========================================================
       3️⃣ 常驻面板（密码、系统索引、刷新延迟、目标数据中心、开始/暂停）
       ========================================================== */
    function createPanel() {
        if (document.getElementById(PANEL_ID)) return; // 已经创建

        const isHax = location.host.includes('hax.co.id');

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.position = 'fixed';
        panel.style.top = '12px';
        panel.style.right = '12px';
        panel.style.zIndex = 2147483647;
        panel.style.background = '#fff';
        panel.style.border = '2px solid #4a90e2';
        panel.style.borderRadius = '6px';
        panel.style.boxShadow = '0 2px 12px rgba(0,0,0,.15)';
        panel.style.padding = '12px';
        panel.style.fontFamily = 'Arial,Helvetica,sans-serif';
        panel.style.fontSize = '14px';
        panel.style.maxWidth = '300px';
        panel.style.minWidth = '210px';
        panel.style.color = '#333';

        // 仅在 hax 页面出现目标数据中心下拉框
        const dcSelectHTML = isHax ? `
            <label>目标数据中心（可选）：
                <select id="vps-dc-choice" style="width:100%;margin-top:4px;">
                    <option value="">--- 默认（最后一个） ---</option>
                    <option value="US-OpenVZ-3">US-OpenVZ-3</option>
                    <option value="US-OpenVZ-2">US-OpenVZ-2</option>
                    <option value="EU-1">EU-1</option>
                </select>
            </label>
            <br/><br/>
        ` : '';

        panel.innerHTML = `
            <strong style="display:block;margin-bottom:8px;color:#4a90e2;">
                VPS 自动化（常驻·默认缓存）
            </strong>

            <label>密码：
                <input type="text" id="vps-pwd" style="width:100%;margin-top:4px;" placeholder="123"/>
            </label>
            <br/><br/>

            <label>系统索引 (0 起始)：
                <input type="number" id="vps-os-index" style="width:100%;margin-top:4px;" min="0"/>
            </label>
            <br/><br/>

            <label>数据中心为空时刷新延迟（ms）：
                <input type="number" id="vps-dc-delay" style="width:100%;margin-top:4px;" min="0"/>
            </label>
            <br/><br/>

            ${dcSelectHTML}

            <button id="vps-start-pause-btn"
                    style="width:100%;background:#4a90e2;color:#fff;border:none;padding:6px;cursor:pointer;">
                开始自动化
            </button>

            <small style="display:block;margin-top:6px;color:#777;">
                所有配置始终会自动保存到本地缓存，刷新页面后会自动恢复。
            </small>
        `;

        // 挂到页面
        const attach = () => {
            document.body.appendChild(panel);
            loadPanelValues();   // 读取缓存（若有）或使用默认值
            bindPanelEvents();   // 绑定按钮、输入框事件
        };
        if (document.body) attach();
        else waitForElement('body', attach);
    }

    // 读取缓存（如果有）并填充面板；若没有则使用默认值
    function loadPanelValues() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const { password, osIndex, dcDelay, dcChoice } = JSON.parse(saved);
            document.getElementById('vps-pwd').value      = password ?? '123';
            document.getElementById('vps-os-index').value = osIndex ?? 2;
            document.getElementById('vps-dc-delay').value = dcDelay ?? 5000;
            const sel = document.getElementById('vps-dc-choice');
            if (sel) sel.value = dcChoice ?? '';
        } else {
            // 没有缓存时使用默认值
            document.getElementById('vps-pwd').value      = '123';
            document.getElementById('vps-os-index').value = 2;
            document.getElementById('vps-dc-delay').value = 5000;
        }

        // 恢复上一次的运行状态（如果是“运行中”则直接启动）
        if (localStorage.getItem(STATE_KEY) === 'running') {
            automationRunning = true;
            document.getElementById('vps-start-pause-btn').textContent = '暂停';
            startAllProcesses();
        }
    }

    // 将当前面板的值写进缓存（每次失去焦点都调用一次）
    function saveSettingsToCache() {
        const data = {
            password: document.getElementById('vps-pwd').value.trim() || '123',
            osIndex: parseInt(document.getElementById('vps-os-index').value, 10) || 2,
            dcDelay: parseInt(document.getElementById('vps-dc-delay').value, 10) || 5000,
            dcChoice: (document.getElementById('vps-dc-choice') || {}).value || ''
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 绑定按钮、输入框等事件
    function bindPanelEvents() {
        // 开始 / 暂停 按钮
        const startBtn = document.getElementById('vps-start-pause-btn');
        startBtn.addEventListener('click', () => {
            automationRunning = !automationRunning;
            startBtn.textContent = automationRunning ? '暂停' : '开始自动化';
            localStorage.setItem(STATE_KEY, automationRunning ? 'running' : 'paused');

            if (automationRunning) {
                // 立即保存一次（防止页面直接刷新导致数据丢失）
                saveSettingsToCache();
                startAllProcesses();
            } else {
                stopAllProcesses();
            }
        });

        // 所有输入框失去焦点后自动保存（始终缓存）
        ['vps-pwd', 'vps-os-index', 'vps-dc-delay', 'vps-dc-choice'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('blur', saveSettingsToCache);
        });
    }

    /* ==========================================================
       4️⃣ 基础表单填充（密码、系统、用途、协议）
       ========================================================== */
    function fillBasicForm({ password, osIndex }) {
        // 隐藏可能出现的 <ins> 广告容器
        try {
            const ins = document.getElementsByTagName('ins');
            for (let i = 0; i < ins.length; i++) ins[i].style.display = 'none';
        } catch (e) {
            console.warn('[VPS‑Auto] 隐藏 <ins> 失败', e);
        }

        // 系统
        waitForElement('#os', el => {
            el.selectedIndex = osIndex;
            console.log(`[VPS‑Auto] 已设置系统索引 = ${osIndex}`);
        });

        // 密码
        waitForElement('#password', el => {
            el.value = password;
            console.log(`[VPS‑Auto] 已填写密码 = ${password}`);
        });

        // 用途（保持默认 index = 5）
        waitForElement('#purpose', el => (el.selectedIndex = 5));

        // 协议复选框
        waitForElement('input[name="agreement[]"]', () => {
            const checks = document.getElementsByName('agreement[]');
            for (let i = 0; i < checks.length; i++) checks[i].checked = true;
            console.log('[VPS‑Auto] 已勾选所有协议复选框');
        });
    }

    /* ==========================================================
       5️⃣ 数据中心处理
       ========================================================== */
    function handleDatacenter({ dcDelay, dcChoice, isHax }) {
        waitForElement('#datacenter', selectEl => {
            // 若只剩占位项，使用用户设定的延迟刷新页面
            if (selectEl.options.length === 1) {
                const delay = Number.isFinite(dcDelay) && dcDelay > 0 ? dcDelay : 5000;
                console.warn(`[VPS‑Auto] 数据中心列表为空，将在 ${delay}ms 后刷新`);
                dcRefreshTimer = setTimeout(() => location.reload(), delay);
                return;
            }

            // 非空列表 → 根据站点/用户选择定位索引（包含匹配）
            if (isHax && dcChoice) {
                // 包含判断：只要选项文字中包含用户输入的关键字即匹配
                let foundIdx = -1;
                for (let i = 0; i < selectEl.options.length; i++) {
                    const optionText = selectEl.options[i].textContent.trim();
                    if (optionText.includes(dcChoice)) { // ← 这里改为包含匹配
                        foundIdx = i;
                        break;
                    }
                }
                if (foundIdx !== -1) {
                    selectEl.selectedIndex = foundIdx;
                    console.log(`[VPS‑Auto] 已根据用户文字 "${dcChoice}" 选中数据中心（索引 ${foundIdx})`);
                } else {
                    // 未匹配到任何包含关键字的选项，仍使用最后一个
                    selectEl.selectedIndex = selectEl.options.length - 1;
                    console.log('[VPS‑Auto] 未匹配到用户指定的文字，使用最后一个数据中心');
                }
            } else {
                // woiden 或未指定目标 → 默认选最后一个
                selectEl.selectedIndex = selectEl.options.length - 1;
                console.log('[VPS‑Auto] 已选最后一个数据中心（默认）');
            }
        });
    }

    /* ==========================================================
       6️⃣ woiden 的算术验证码（使用原始 nextSibling 方式）
       ========================================================== */
    function calculateAndFill() {
        const images = document.querySelectorAll('.col-sm-3 img');
        if (images.length !== 2) {
            console.warn('[VPS‑Auto] 未检测到算术图片，跳过验证码填充');
            return;
        }

        const num1 = extractNumber(images[0].src);
        const num2 = extractNumber(images[1].src);

        // **保持原始写法**：直接取 nextSibling 的文本
        const operator = images[0].nextSibling.textContent.trim();

        let result = 0;
        switch (operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '×':
            case '*':
            case 'x':
            case 'X': result = num1 * num2; break;
            case '÷':
            case '/': result = num1 / num2; break;
            default:
                console.warn(`[VPS‑Auto] 未识别运算符 "${operator}"，默认返回 0`);
                result = 0;
        }

        console.log(`运算结果: ${num1} ${operator} ${num2} = ${result}`);

        waitForElement('#captcha', input => {
            input.value = result;
            ['input', 'change', 'keyup'].forEach(ev => {
                input.dispatchEvent(new Event(ev, { bubbles: true }));
            });
            console.log(`[VPS‑Auto] 已自动填写验证码 = ${result}`);
        });
    }

    /* ==========================================================
       7️⃣ Cloudflare Turnstile 轮询 & 表单提交
       ========================================================== */
    function startCfWatcher() {
        const poll = 100; // ms
        const maxWait = 2 * 60 * 1000; // 2 分钟
        const start = Date.now();

        cfWatcherTimer = setInterval(() => {
            const cfInput = document.querySelector('input[name="cf-turnstile-response"]');
            const token = cfInput ? cfInput.value.trim() : '';
            if (token) {
                console.log('✅ CF Turnstile 已通过，Token:', token);
                clearInterval(cfWatcherTimer);
                cfWatcherTimer = null;

                // 通过 XPath 找提交按钮（保持原路径）
                const xpath = "/html/body/main/div/div/div[2]/div/div/div/div/div/form/button";
                const res = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const btn = res.singleNodeValue;
                if (btn) {
                    console.log('[VPS‑Auto] 点击提交按钮...');
                    btn.click();
                } else {
                    console.warn('[VPS‑Auto] 未找到提交按钮，尝试通用 selector');
                    const alt = document.querySelector('form button[type="submit"], form button');
                    if (alt) {
                        console.log('[VPS‑Auto] 使用备用按钮提交');
                        alt.click();
                    } else {
                        console.error('[VPS‑Auto] 找不到任何提交按钮');
                    }
                }
            } else if (Date.now() - start > maxWait) {
                clearInterval(cfWatcherTimer);
                cfWatcherTimer = null;
                console.error('[VPS‑Auto] 等待 CF token 超时，自动化终止');
            } else {
                console.log('⏳ 正在等待 CF Turnstile 完成...');
            }
        }, poll);
    }

    /* ==========================================================
       8️⃣ 主流程：开始 / 停止
       ========================================================== */
    function startAllProcesses() {
        const isHax    = location.host.includes('hax.co.id');
        const isWoiden = location.host.includes('woiden.id');

        // 读取面板当前值（即使在运行期间用户随时改动也会被读取）
        const password = document.getElementById('vps-pwd').value.trim() || '123';
        const osIndex  = parseInt(document.getElementById('vps-os-index').value, 10) || 2;
        const dcDelay  = parseInt(document.getElementById('vps-dc-delay').value, 10) || 5000;
        const dcChoice = (document.getElementById('vps-dc-choice') || {}).value || '';

        console.log('[VPS‑Auto] 开始自动化 → 参数', {
            password, osIndex, dcDelay, dcChoice, isHax, isWoiden
        });

        // 1️⃣ 基础表单填充（除数据中心外的所有字段）
        fillBasicForm({ password, osIndex });

        // 2️⃣ 数据中心处理（空列表时延迟刷新，否则根据用户指定的文字定位）
        handleDatacenter({ dcDelay, dcChoice, isHax });

        // 3️⃣ woiden 算术验证码（若是 woiden）
        if (isWoiden) {
            calculateAndFill();
        }

        // 4️⃣ 启动 Cloudflare Turnstile 轮询（两站点均需要）
        startCfWatcher();
    }

    function stopAllProcesses() {
        if (cfWatcherTimer) {
            clearInterval(cfWatcherTimer);
            cfWatcherTimer = null;
            console.log('[VPS‑Auto] 已停止 CF Turnstile 轮询');
        }
        if (dcRefreshTimer) {
            clearTimeout(dcRefreshTimer);
            dcRefreshTimer = null;
            console.log('[VPS‑Auto] 已取消数据中心空刷新计时器');
        }
        console.log('[VPS‑Auto] 自动化已暂停');
    }

    /* ==========================================================
       9️⃣ 脚本入口
       ========================================================== */
    createPanel(); // 页面加载完毕后立刻创建面板
})();
