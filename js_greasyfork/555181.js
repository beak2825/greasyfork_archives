// ==UserScript==
// @name         L站佬友专用DNS分流器
// @namespace    http://tampermonkey.net/
// @license       Duy
// @version      1.041
// @description  简单稳定的DNS分流器
// @author       You
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      cloudflare-dns.com
// @connect      doh.pub
// @connect      neo.doh.oaifree.com
// @match        https://linux.do/*
// @match        http://linux.do/*
// @match        https://*.linux.do/*
// @match        http://*.linux.do/*
// @match        https://github.com/*
// @downloadURL https://update.greasyfork.org/scripts/555181/L%E7%AB%99%E4%BD%AC%E5%8F%8B%E4%B8%93%E7%94%A8DNS%E5%88%86%E6%B5%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555181/L%E7%AB%99%E4%BD%AC%E5%8F%8B%E4%B8%93%E7%94%A8DNS%E5%88%86%E6%B5%81%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY = 'dnsRouterConfig';

    // 默认配置
    const defaultConfig = {
        rules: {
            'linux.do': 'https://cloudflare-dns.com/dns-query',
            'github.com': 'https://cloudflare-dns.com/dns-query'
        }
    };

    // 获取配置
    function getConfig() {
        const saved = GM_getValue(CONFIG_KEY, JSON.stringify(defaultConfig));
        return JSON.parse(saved);
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
    }

    // 检查当前域名是否匹配规则
    function shouldActivate() {
        const config = getConfig();
        const domain = window.location.hostname;

        for (const ruleDomain in config.rules) {
            if (domain === ruleDomain || domain.endsWith('.' + ruleDomain)) {
                return true;
            }
        }
        return false;
    }

    // 增强的DNS解析 - 支持多种响应格式
    function resolveWithDoH(domain, dohUrl) {
        return new Promise((resolve, reject) => {
            const url = `${dohUrl}?name=${encodeURIComponent(domain)}&type=A`;

            // 尝试不同的Accept头部
            const tryFormats = [
                { headers: { 'Accept': 'application/dns-json' } },
                { headers: { 'Accept': 'application/json' } },
                { headers: { 'Accept': '*/*' } }
            ];

            let currentTry = 0;

            function attemptRequest() {
                const options = tryFormats[currentTry];

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: options.headers,
                    timeout: 8000,
                    onload: function(response) {
                        if (response.status !== 200) {
                            if (currentTry < tryFormats.length - 1) {
                                currentTry++;
                                attemptRequest();
                            } else {
                                reject(new Error(`HTTP ${response.status}`));
                            }
                            return;
                        }

                        try {
                            // 尝试解析响应
                            const data = JSON.parse(response.responseText);
                            const ip = extractIPFromResponse(data);

                            if (ip) {
                                resolve(ip);
                            } else {
                                reject(new Error('No IP found in response'));
                            }
                        } catch (e) {
                            // 如果不是JSON，尝试其他格式
                            if (currentTry < tryFormats.length - 1) {
                                currentTry++;
                                attemptRequest();
                            } else {
                                reject(new Error('Response format not supported'));
                            }
                        }
                    },
                    onerror: function(error) {
                        if (currentTry < tryFormats.length - 1) {
                            currentTry++;
                            attemptRequest();
                        } else {
                            reject(new Error('Network error: ' + (error.statusText || 'Unknown')));
                        }
                    },
                    ontimeout: function() {
                        reject(new Error('Request timeout'));
                    }
                });
            }

            attemptRequest();
        });
    }

    // 从响应数据中提取IP地址
    function extractIPFromResponse(data) {
        // 方法1: 标准Answer数组
        if (data.Answer && Array.isArray(data.Answer)) {
            for (const answer of data.Answer) {
                if (answer.data && isValidIP(answer.data)) {
                    return answer.data;
                }
            }
        }

        // 方法2: answers字段（某些服务商使用）
        if (data.answers && Array.isArray(data.answers)) {
            for (const answer of data.answers) {
                if (answer.data && isValidIP(answer.data)) {
                    return answer.data;
                }
            }
        }

        // 方法3: 直接data字段
        if (data.data && isValidIP(data.data)) {
            return data.data;
        }

        // 方法4: 在响应文本中搜索IP地址
        const responseText = JSON.stringify(data);
        const ipMatch = responseText.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
        if (ipMatch && isValidIP(ipMatch[0])) {
            return ipMatch[0];
        }

        return null;
    }

    // IP地址验证
    function isValidIP(ip) {
        return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
               ip.split('.').every(part => {
                   const num = parseInt(part, 10);
                   return num >= 0 && num <= 255;
               });
    }

    // 创建UI
    function createUI() {
        const config = getConfig();
        const domain = window.location.hostname;

        // 清理现有UI
        const existing = document.getElementById('dns-router-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'dns-router-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            min-width: 400px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            border: 2px solid #3498db;
        `;

        let html = `
            <div style="margin-bottom: 15px; font-weight: bold; border-bottom: 1px solid #34495e; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span>🌐 DNS分流器 v1.04</span>
                <button id="close-panel" style="background: none; border: none; color: #e74c3c; font-size: 16px; cursor: pointer;">×</button>
            </div>

            <div style="margin-bottom: 15px; padding: 10px; background: #34495e; border-radius: 5px;">
                <div style="font-size: 12px; color: #bdc3c7;">当前域名</div>
                <div style="font-size: 13px; font-weight: bold;">${domain}</div>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: #bdc3c7; margin-bottom: 5px;">添加规则</div>
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <input type="text" id="new-domain" placeholder="域名" style="flex:1; padding: 6px; border: 1px solid #555; background: #2c3e50; color: white; border-radius: 3px;">
                    <button id="add-rule" style="background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer;">添加</button>
                </div>
                <select id="dns-preset" style="width:100%; padding:6px; background:#2c3e50; color:white; border:1px solid #555; border-radius:3px; margin-bottom: 8px;">
                    <option value="https://cloudflare-dns.com/dns-query">Cloudflare</option>
                    <option value="https://doh.pub/dns-query">DNSPod</option>
                    <option value="https://neo.doh.oaifree.com/dns-query">OAI Free DNS</option>
                    <option value="custom">自定义地址</option>
                </select>
                <input type="text" id="custom-dns" placeholder="https://..." style="width:100%; padding:6px; border:1px solid #555; background:#2c3e50; color:white; border-radius:3px; display:none;">
            </div>

            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: #bdc3c7; margin-bottom: 5px;">规则列表</div>
                <div id="rules-list" style="max-height: 200px; overflow-y: auto;">
        `;

        // 规则列表
        for (const [ruleDomain, dns] of Object.entries(config.rules)) {
            const isCurrent = domain === ruleDomain || domain.endsWith('.' + ruleDomain);

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 5px; background: ${isCurrent ? '#1a5276' : '#34495e'}; border-radius: 3px;">
                    <div>
                        <div style="font-size: 12px; font-weight: bold;">${ruleDomain}</div>
                        <div style="font-size: 10px; color: #bdc3c7;">${getDnsName(dns)}</div>
                    </div>
                    <div>
                        <button class="test-rule" data-domain="${ruleDomain}" style="background: #e67e22; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px; margin-right: 5px;">测试</button>
                        <button class="delete-rule" data-domain="${ruleDomain}" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;" ${ruleDomain === 'linux.do' ? 'disabled' : ''}>删除</button>
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid #34495e; padding-top: 10px;">
                <button id="test-current" style="background: #e67e22; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer;">测试当前</button>
                <button id="close-btn" style="background: #95a5a6; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer;">关闭</button>
            </div>
        `;

        panel.innerHTML = html;
        document.body.appendChild(panel);

        // 事件监听
        document.getElementById('close-panel').addEventListener('click', hideUI);
        document.getElementById('close-btn').addEventListener('click', hideUI);

        document.getElementById('add-rule').addEventListener('click', addNewRule);
        document.getElementById('test-current').addEventListener('click', testCurrentDNS);

        document.getElementById('dns-preset').addEventListener('change', function() {
            const customInput = document.getElementById('custom-dns');
            customInput.style.display = this.value === 'custom' ? 'block' : 'none';
        });

        document.querySelectorAll('.test-rule').forEach(btn => {
            btn.addEventListener('click', function() {
                const domain = this.getAttribute('data-domain');
                testSpecificDNS(domain);
            });
        });

        document.querySelectorAll('.delete-rule').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', function() {
                    const domain = this.getAttribute('data-domain');
                    deleteRule(domain);
                });
            }
        });

        document.getElementById('new-domain').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addNewRule();
            }
        });
    }

    function getDnsName(dnsUrl) {
        if (dnsUrl.includes('cloudflare')) return 'Cloudflare';
        if (dnsUrl.includes('doh.pub')) return 'DNSPod';
        if (dnsUrl.includes('oaifree.com')) return 'OAI Free DNS';
        return dnsUrl;
    }

    function addNewRule() {
        const domainInput = document.getElementById('new-domain');
        const dnsSelect = document.getElementById('dns-preset');
        const customInput = document.getElementById('custom-dns');

        const domain = domainInput.value.trim();
        let dns = dnsSelect.value === 'custom' ? customInput.value.trim() : dnsSelect.value;

        if (!domain) {
            alert('请输入域名');
            return;
        }

        if (!dns) {
            alert('请选择或输入DNS地址');
            return;
        }

        const config = getConfig();
        config.rules[domain] = dns;
        saveConfig(config);

        showNotification(`已添加: ${domain}`);
        domainInput.value = '';
        customInput.value = '';
        hideUI();
        setTimeout(showUI, 300);
    }

    function deleteRule(domain) {
        const config = getConfig();
        delete config.rules[domain];
        saveConfig(config);

        showNotification(`已删除: ${domain}`);
        hideUI();
        setTimeout(showUI, 300);
    }

    function testCurrentDNS() {
        const domain = window.location.hostname;
        const config = getConfig();

        for (const [ruleDomain, dns] of Object.entries(config.rules)) {
            if (domain === ruleDomain || domain.endsWith('.' + ruleDomain)) {
                testDNS(domain, dns);
                return;
            }
        }

        showNotification('当前域名没有配置规则');
    }

    function testSpecificDNS(domain) {
        const config = getConfig();
        const dns = config.rules[domain];
        if (dns) {
            testDNS(domain, dns);
        }
    }

    function testDNS(domain, dnsEndpoint) {
        const button = event?.target;
        if (button) {
            button.disabled = true;
            button.textContent = '测试中...';
        }

        resolveWithDoH(domain, dnsEndpoint)
            .then(ip => {
                showNotification(`${domain} -> ${ip}`);
            })
            .catch(error => {
                showNotification(`${domain} 失败: ${error.message}`);
            })
            .finally(() => {
                if (button) {
                    button.disabled = false;
                    button.textContent = '测试';
                }
            });
    }

    function showNotification(message) {
        const existing = document.getElementById('dns-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'dns-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c3e50;
            color: white;
            padding: 12px 15px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border-left: 4px solid #3498db;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    function showUI() {
        createUI();
    }

    function hideUI() {
        const panel = document.getElementById('dns-router-panel');
        if (panel) panel.remove();
    }

    // 主初始化 - 简化启动逻辑
    function init() {
        // 只在匹配的域名上激活
        if (shouldActivate()) {
            console.log('DNS分流器已激活');
        }

        // 注册菜单
        GM_registerMenuCommand('🌐 显示DNS分流器', showUI);
    }

    // 立即执行初始化
    init();

    console.log('DNS分流器 v1.04 已加载');
})();