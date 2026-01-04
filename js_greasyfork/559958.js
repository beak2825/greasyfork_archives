// ==UserScript==
// @name         恶意网站检测
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  使用URLhaus查询，查询结果缓存24h，支持在菜单手动提交，支持IDN/rn→m检测，需要按下ALT+C才能触发URLhaus查询，IDN混淆检测自动运行
// @author       myncdw
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      urlhaus-api.abuse.ch
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559958/%E6%81%B6%E6%84%8F%E7%BD%91%E7%AB%99%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559958/%E6%81%B6%E6%84%8F%E7%BD%91%E7%AB%99%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ===================== 基础配置 ===================== */

    const HISTORY_KEY = 'urlhaus_cache';
    const APIKEY_KEY = 'urlhaus_api_key';
    const RULES_KEY = 'urlhaus_confusable_rules';
    const WHOLE_DOMAIN_KEY = 'urlhaus_whole_domain'; // 新增：存储是否只检测域名的设置
    const EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24小时

    /* ===================== IDN / 混淆规则 ===================== */

    const DEFAULT_CONFUSABLE_RULES = [
        { pattern: 'rn', desc: 'rn → m 混淆', enabled: true },
        { pattern: 'vv', desc: 'vv → w 混淆', enabled: true },
        { pattern: '[а-яА-Я]', desc: '西里尔字符（IDN）', enabled: true },
        { pattern: '[一-龥]', desc: '非拉丁字符（IDN）', enabled: true }
    ];

    function getConfusableRules() {
        const saved = GM_getValue(RULES_KEY, null);
        return saved || DEFAULT_CONFUSABLE_RULES;
    }

    function saveConfusableRules(rules) {
        GM_setValue(RULES_KEY, rules);
    }

    // 获取是否只检测域名的设置
    function getWholeDomainSetting() {
        return GM_getValue(WHOLE_DOMAIN_KEY, true);
    }

    // 保存是否只检测域名的设置
    function saveWholeDomainSetting(value) {
        GM_setValue(WHOLE_DOMAIN_KEY, value);
    }

    /* ===================== 快捷键触发URLhaus检测 ===================== */

    document.addEventListener('keydown', e => {
        // Alt + C
        if (
            e.altKey &&
            !e.ctrlKey &&
            !e.shiftKey &&
            e.code === 'KeyC'
        ) {
            // 避免在输入框里误触
            const t = e.target;
            if (
                t &&
                (t.tagName === 'INPUT' ||
                 t.tagName === 'TEXTAREA' ||
                 t.isContentEditable)
            ) {
                return;
            }

            e.preventDefault();
            const wholeDomain = getWholeDomainSetting();
            showToast('🔍 手动触发 URLhaus 检测', '#2196f3');
            checkURL(wholeDomain);
        }
    });


    /* ===================== 工具函数 ===================== */

    function getApiKey() {
        return GM_getValue(APIKEY_KEY, '');
    }

    // 获取当前页面URL
    function getCurrentURL() {
        const u = new URL(location.href);

        // 处理Cloudflare等CDN页面
        if (
            u.hostname.includes('cloudflare') ||
            u.pathname.includes('/cdn-cgi/')
        ) {
            return sessionStorage.getItem('__original_url');
        }

        u.hash = '';
        return u.href;
    }

    // 标准化为域名形式（protocol + hostname）
    function normalizeToDomain(raw) {
        try {
            const u = new URL(raw);
            return u.protocol + '//' + u.hostname + '/';
        } catch {
            return null;
        }
    }

    // 标准化URL（移除hash）
    function normalizeURL(raw) {
        try {
            const u = new URL(raw);
            u.hash = '';
            return u.toString();
        } catch {
            return raw;
        }
    }

    // 检测域名中的混淆字符
    function detectConfusable(domain) {
        const rules = getConfusableRules();
        return rules
            .filter(r => r.enabled && new RegExp(r.pattern).test(domain))
            .map(r => r.desc);
    }

    // 显示浮动提示
    function showToast(text, color = '#2196f3') {
        const d = document.createElement('div');
        d.style.cssText = `
            position:fixed;top:12px;right:12px;
            background:${color};color:#fff;
            padding:10px 16px;border-radius:10px;
            z-index:999999;font-size:13px;
            box-shadow:0 4px 16px rgba(0,0,0,.4)
        `;
        d.textContent = text;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 4000);
    }

    /* ===================== 缓存处理 ===================== */

    // 加载缓存并清理过期数据
    function loadCache() {
        const now = Date.now();
        const list = GM_getValue(HISTORY_KEY, []);
        const valid = list.filter(i => now - i.time < EXPIRE_TIME);
        if (valid.length !== list.length) GM_setValue(HISTORY_KEY, valid);
        return valid;
    }

    // 从缓存中获取指定URL的记录
    function getCache(url) {
        return loadCache().find(i => i.url === url) || null;
    }

    // 保存缓存记录
    function saveCache(entry) {
        const list = loadCache().filter(i => i.url !== entry.url);
        list.push(entry);
        GM_setValue(HISTORY_KEY, list);
    }

    /* ===================== 恶意覆盖页 ===================== */

    function showMaliciousOverlay(data, fromCache) {
        const warn = detectConfusable(new URL(data.url).hostname);

        const o = document.createElement('div');
        o.style.cssText = `
            position:fixed;inset:0;
            background:rgba(0,0,0,.8);
            z-index:2147483647;
            display:flex;align-items:center;justify-content:center;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI";
        `;

        o.innerHTML = `
        <div style="
            max-width:880px;width:90%;
            background:#111;color:#eee;
            border-radius:14px;
            padding:40px 44px;
            box-shadow:0 30px 90px rgba(0,0,0,.7);
        ">
            <h1 style="color:#ff5555;margin-top:0">⚠ 恶意网站警告</h1>

            <div style="background:#1a1a1a;padding:18px 20px;border-radius:10px;line-height:1.7">
                <p><b>URL：</b><span style="word-break:break-all">${data.url}</span></p>
                <p><b>来源：</b>${fromCache ? `缓存命中（剩余 ${data.remainH}h）` : '实时 URLhaus 查询'}</p>
                <p><b>威胁：</b>${data.threat || '未知'}</p>
                <p><b>标签：</b>${data.tags?.join(', ') || '无'}</p>
                <p><b>状态：</b>${data.urlStatus || '未知'}</p>

                ${warn.length ? `
                <div style="margin-top:14px;padding:12px 14px;background:#332200;border-left:4px solid #ffcc00;border-radius:6px;color:#ffdd88">
                    <b>⚠ 可疑混淆：</b>${warn.join('，')}
                </div>` : ''}
            </div>

            <div style="display:flex;gap:14px;justify-content:flex-end;margin-top:28px">
                <button id="leave" style="background:#ff4444;color:#fff;border:none;padding:12px 22px;border-radius:8px;font-weight:600;cursor:pointer">
                    立即离开
                </button>
                <button id="stay" style="background:#222;color:#ccc;border:1px solid #555;padding:12px 22px;border-radius:8px;cursor:pointer">
                    继续访问
                </button>
            </div>
        </div>
        `;

        document.body.appendChild(o);
        o.querySelector('#leave').onclick = () => location.href = 'about:blank';
        o.querySelector('#stay').onclick = () => o.remove();
    }

    /* ===================== 排除局域网 ===================== */

    function isLocalAddress(url) {
        try {
            const u = new URL(url);
            const h = u.hostname.toLowerCase();

            // localhost / .local
            if (h === 'localhost' || h.endsWith('.local')) return true;

            // IPv4
            if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
                const parts = h.split('.').map(Number);
                const [a, b] = parts;

                if (a === 127) return true;
                if (a === 10) return true;
                if (a === 192 && b === 168) return true;
                if (a === 169 && b === 254) return true;
                if (a === 172 && b >= 16 && b <= 31) return true;
            }

            // IPv6
            if (h === '::1') return true;
            if (h.startsWith('fc') || h.startsWith('fd')) return true;
            if (h.startsWith('fe80')) return true;

            return false;
        } catch {
            return true;
        }
    }

    /* ===================== IDN混淆自动检测 ===================== */

    function autoCheckConfusable() {
        const raw = getCurrentURL();
        if (!raw || !/^https?:\/\//i.test(raw)) return;
        if (isLocalAddress(raw)) return;

        try {
            const u = new URL(raw);
            const warnings = detectConfusable(u.hostname);

            if (warnings.length > 0) {
                showToast(`⚠ 检测到可疑混淆：${warnings.join('，')}`, '#ff9800');
            }
        } catch (e) {
            // 忽略错误
        }
    }

    /* ===================== URL 查询 ===================== */

    function checkURL(wholeDomain) {
        let raw;

        if (wholeDomain === true) {
            const raw_full = getCurrentURL();
            raw = normalizeToDomain(raw_full);
        } else {
            raw = getCurrentURL();
        }

        if (!raw || !/^https?:\/\//i.test(raw)) return;

        if (isLocalAddress(raw)) {
            showToast(`🟢 局域网/本机地址`, '#4caf50');
            return;
        }

        const url = normalizeURL(raw);
        const cached = getCache(url);
        const now = Date.now();

        if (cached) {
            const remainH = Math.max(
                1,
                Math.ceil((EXPIRE_TIME - (now - cached.time)) / 3600000)
            );

            if (!cached.safe) {
                showMaliciousOverlay({ ...cached, remainH }, true);
            } else {
                showToast(`🟢 URLhaus 缓存确认安全（剩余 ${remainH}h）`, '#4caf50');
            }
            return;
        }

        showToast('🔵 正在实时查询 URLhaus', '#2196f3');

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://urlhaus-api.abuse.ch/v1/url/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Auth-Key': getApiKey()
            },
            data: 'url=' + encodeURIComponent(url),
            onload: r => {
                try {
                    const j = JSON.parse(r.responseText);

                    if (j.query_status === 'ok') {
                        const entry = {
                            url,
                            time: Date.now(),
                            safe: false,
                            threat: j.threat,
                            tags: j.tags,
                            urlStatus: j.url_status,
                            submitted: true
                        };
                        saveCache(entry);
                        showMaliciousOverlay({ ...entry, remainH: 12 }, false);
                    } else {
                        saveCache({
                            url,
                            time: Date.now(),
                            safe: true,
                            threat: null,
                            tags: [],
                            urlStatus: null,
                            submitted: false
                        });
                        showToast('🟢 URLhaus 实时查询：未发现威胁', '#4caf50');
                    }
                } catch (e) {
                    showToast('❌ 查询失败：响应解析错误', '#f44336');
                }
            },
            onerror: () => {
                showToast('❌ 查询失败：网络错误', '#f44336');
            }
        });
    }

    /* ===================== 手动提交 ===================== */

    function submitCurrentURL() {
        let raw;

        const wholeDomain = getWholeDomainSetting();
        const raw_full = getCurrentURL();

        if (wholeDomain === true) {
            raw = normalizeToDomain(raw_full);
        } else {
            raw = raw_full;
        }

        if (!raw) return alert('无法获取当前 URL');

        const url = normalizeURL(raw);
        const cached = getCache(url);

        if (isLocalAddress(raw)) {
            alert('本地 / 局域网地址不应提交到 URLhaus');
            return;
        }

        if (cached && cached.submitted === true) {
            alert('已提交，请勿重复提交');
            return;
        }

        if (cached && cached.safe === false) {
            alert('该网址已被 URLhaus 标记为恶意，无需提交。');
            return;
        }

        const comment = prompt(
            '请输入提交说明（必填，例如：钓鱼网站 / 仿冒官网 / 恶意下载）',
            ''
        );

        if (!comment || !comment.trim()) {
            alert('已取消提交');
            return;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://urlhaus-api.abuse.ch/v1/url/submit/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Auth-Key': getApiKey()
            },
            data:
                'url=' + encodeURIComponent(url) +
                '&comment=' + encodeURIComponent(comment.trim()),
            onload: () => {
                alert('✅ 已提交到 URLhaus');
                if (cached) {
                    cached.submitted = true;
                    cached.time = Date.now();
                    saveCache(cached);
                }
            },
            onerror: () => {
                alert('❌ 提交失败：网络错误');
            }
        });
    }

    /* ===================== 设置 UI ===================== */

    function openSettingsUI() {
        if (document.getElementById('urlhaus-settings-root')) return;

        const root = document.createElement('div');
        root.id = 'urlhaus-settings-root';
        root.style.cssText = `
            position:fixed;inset:0;z-index:2147483647;
            background:rgba(0,0,0,.55);
            display:flex;align-items:center;justify-content:center;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI";
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            width:900px;max-width:95vw;max-height:85vh;
            background:#121212;color:#eee;
            border-radius:14px;
            display:flex;flex-direction:column;
            box-shadow:0 20px 60px rgba(0,0,0,.6);
        `;

        panel.innerHTML = `
        <div style="padding:18px 22px;border-bottom:1px solid #333;font-size:18px;font-weight:600">
            ⚙ URLhaus 设置
        </div>

        <div style="padding:20px;overflow:auto;flex:1">
            <h3 style="margin-top:0">🔑 API Key</h3>
            <input id="apiKeyInput" type="password"
                placeholder="输入您的 URLhaus API Key（可选）"
                style="width:100%;padding:10px;border-radius:8px;border:1px solid #444;background:#1e1e1e;color:#fff;box-sizing:border-box">
            <button id="saveKey" style="margin-top:10px;padding:8px 16px;background:#4caf50;color:#fff;border:none;border-radius:6px;cursor:pointer">保存 API Key</button>

            <hr style="border:none;border-top:1px solid #333;margin:20px 0">

            <h3>🌐 检测模式</h3>
            <div style="background:#1a1a1a;padding:16px;border-radius:8px">
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
                    <input type="checkbox" id="wholeDomainCheck"
                        style="width:18px;height:18px;cursor:pointer">
                    <span>仅检测域名</span>
                </label>
                <p style="font-size:12px;color:#aaa;margin:10px 0 0 28px">
                    启用后只检测域名部分，忽略路径和参数。这样可以减少重复查询，提高缓存命中率。
                </p>
            </div>

            <hr style="border:none;border-top:1px solid #333;margin:20px 0">

            <h3>🧠 混淆检测规则</h3>
            <div id="rulesContainer"></div>
            <button id="addRule" style="margin-top:10px;padding:8px 16px;background:#2196f3;color:#fff;border:none;border-radius:6px;cursor:pointer">+ 添加新规则</button>
            <button id="resetRules" style="margin-top:10px;margin-left:10px;padding:8px 16px;background:#ff9800;color:#fff;border:none;border-radius:6px;cursor:pointer">重置为默认</button>

            <hr style="border:none;border-top:1px solid #333;margin:20px 0">

            <h3>📦 缓存记录</h3>
            <div style="overflow-x:auto">
                <table style="width:100%;font-size:13px;border-collapse:collapse;min-width:700px">
                    <thead>
                        <tr style="color:#aaa;border-bottom:1px solid #333">
                            <th align="left" style="padding:8px">URL</th>
                            <th style="padding:8px">安全</th>
                            <th style="padding:8px">威胁</th>
                            <th style="padding:8px">标签</th>
                            <th style="padding:8px">已提交</th>
                            <th style="padding:8px">操作</th>
                        </tr>
                    </thead>
                    <tbody id="cacheTable"></tbody>
                </table>
            </div>

            <button id="clearCache" style="margin-top:10px;padding:8px 16px;background:#f44336;color:#fff;border:none;border-radius:6px;cursor:pointer">
                清空所有缓存
            </button>
        </div>

        <div style="padding:14px;border-top:1px solid #333;text-align:right">
            <button id="closeUI" style="padding:8px 16px;background:#555;color:#fff;border:none;border-radius:6px;cursor:pointer">关闭</button>
        </div>
        `;

        root.appendChild(panel);
        document.body.appendChild(root);

        // API Key
        panel.querySelector('#apiKeyInput').value = GM_getValue(APIKEY_KEY, '');
        panel.querySelector('#saveKey').onclick = () => {
            const v = panel.querySelector('#apiKeyInput').value.trim();
            GM_setValue(APIKEY_KEY, v);
            alert('API Key 已保存');
        };

        // 检测模式设置
        const wholeDomainCheckbox = panel.querySelector('#wholeDomainCheck');
        wholeDomainCheckbox.checked = getWholeDomainSetting();
        wholeDomainCheckbox.onchange = (e) => {
            saveWholeDomainSetting(e.target.checked);
            showToast(`检测模式已${e.target.checked ? '切换为仅域名' : '切换为完整URL'}`, '#4caf50');
        };

        // 渲染规则列表
        function renderRules() {
            const container = panel.querySelector('#rulesContainer');
            container.innerHTML = '';
            const rules = getConfusableRules();

            rules.forEach((rule, index) => {
                const ruleDiv = document.createElement('div');
                ruleDiv.style.cssText = `
                    background:#1a1a1a;padding:12px;border-radius:8px;margin-bottom:10px;
                    display:flex;align-items:center;gap:10px;flex-wrap:wrap;
                `;
                ruleDiv.innerHTML = `
                    <input type="checkbox" ${rule.enabled ? 'checked' : ''}
                        style="width:18px;height:18px;cursor:pointer" data-index="${index}">
                    <input type="text" value="${rule.pattern}"
                        placeholder="正则表达式"
                        style="flex:1;min-width:120px;padding:6px;border:1px solid #444;background:#2a2a2a;color:#fff;border-radius:4px"
                        data-index="${index}" data-field="pattern">
                    <input type="text" value="${rule.desc}"
                        placeholder="规则描述"
                        style="flex:2;min-width:160px;padding:6px;border:1px solid #444;background:#2a2a2a;color:#fff;border-radius:4px"
                        data-index="${index}" data-field="desc">
                    <button data-index="${index}" style="padding:6px 12px;background:#f44336;color:#fff;border:none;border-radius:4px;cursor:pointer">删除</button>
                `;

                // 启用/禁用
                ruleDiv.querySelector('input[type="checkbox"]').onchange = (e) => {
                    const rules = getConfusableRules();
                    rules[index].enabled = e.target.checked;
                    saveConfusableRules(rules);
                };

                // 修改pattern或desc
                ruleDiv.querySelectorAll('input[type="text"]').forEach(input => {
                    input.onchange = (e) => {
                        const rules = getConfusableRules();
                        const field = e.target.dataset.field;
                        rules[index][field] = e.target.value;
                        saveConfusableRules(rules);
                    };
                });

                // 删除规则
                ruleDiv.querySelector('button').onclick = () => {
                    if (!confirm('确认删除此规则？')) return;
                    const rules = getConfusableRules();
                    rules.splice(index, 1);
                    saveConfusableRules(rules);
                    renderRules();
                };

                container.appendChild(ruleDiv);
            });
        }

        renderRules();

        // 添加新规则
        panel.querySelector('#addRule').onclick = () => {
            const pattern = prompt('输入正则表达式（不含斜杠）：', '');
            if (!pattern) return;
            const desc = prompt('输入规则描述：', '');
            if (!desc) return;

            const rules = getConfusableRules();
            rules.push({ pattern, desc, enabled: true });
            saveConfusableRules(rules);
            renderRules();
        };

        // 重置规则
        panel.querySelector('#resetRules').onclick = () => {
            if (!confirm('确认重置为默认规则？')) return;
            saveConfusableRules(DEFAULT_CONFUSABLE_RULES);
            renderRules();
        };

        // 缓存表格
        const tbody = panel.querySelector('#cacheTable');
        const cacheList = loadCache();

        if (cacheList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" align="center" style="padding:20px;color:#666">暂无缓存记录</td></tr>';
        } else {
            cacheList.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #222';
                tr.innerHTML = `
                    <td style="word-break:break-all;padding:8px">${item.url}</td>
                    <td align="center" style="padding:8px">${item.safe ? '🟢' : '🔴'}</td>
                    <td style="padding:8px">${item.threat || '-'}</td>
                    <td style="padding:8px">${item.tags?.join(', ') || '-'}</td>
                    <td align="center" style="padding:8px">${item.submitted ? '✔' : ''}</td>
                    <td align="center" style="padding:8px">
                        <button style="padding:4px 8px;background:#f44336;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px">删除</button>
                    </td>
                `;
                tr.querySelector('button').onclick = () => {
                    GM_setValue(HISTORY_KEY, loadCache().filter(i => i.url !== item.url));
                    tr.remove();
                    if (tbody.children.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="6" align="center" style="padding:20px;color:#666">暂无缓存记录</td></tr>';
                    }
                };
                tbody.appendChild(tr);
            });
        }

        panel.querySelector('#clearCache').onclick = () => {
            if (!confirm('确认清空所有缓存？')) return;
            GM_setValue(HISTORY_KEY, []);
            tbody.innerHTML = '<tr><td colspan="6" align="center" style="padding:20px;color:#666">暂无缓存记录</td></tr>';
        };

        panel.querySelector('#closeUI').onclick = () => root.remove();

        // 点击背景关闭
        root.onclick = (e) => {
            if (e.target === root) root.remove();
        };
    }

    /* ===================== 菜单 & 启动 ===================== */

    GM_registerMenuCommand('⚙ 打开设置', openSettingsUI);
    GM_registerMenuCommand('📤 提交当前 URL 到 URLhaus', submitCurrentURL);

    window.addEventListener('load', () => {
        // 保存原始URL（用于Cloudflare等CDN页面）
        if (
            !sessionStorage.getItem('__original_url') &&
            !location.hostname.includes('cloudflare') &&
            !location.pathname.includes('/cdn-cgi/')
        ) {
            sessionStorage.setItem('__original_url', location.href);
        }

        // 页面加载后自动检测IDN混淆
        setTimeout(autoCheckConfusable, 800);
    });

})();