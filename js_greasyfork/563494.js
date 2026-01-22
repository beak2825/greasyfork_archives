// ==UserScript==
// @name         KYB的2FA钥匙
// @namespace    https://www.lspsp.me/
// @version      1.0
// @description  生成TOTP密钥和二维码，并输出加密后的密钥供LSP统计脚本验证使用。
// @author       KYB
// @match        https://www.lspsp.me/lottery*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563494/KYB%E7%9A%842FA%E9%92%A5%E5%8C%99.user.js
// @updateURL https://update.greasyfork.org/scripts/563494/KYB%E7%9A%842FA%E9%92%A5%E5%8C%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SALT = "LSP_Secure_Salt_2026"; // 必须与统计脚本中的盐值保持一致

    // 1. 稳定的 Base32 生成逻辑
    function generateBase32Secret() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 16; i++) {
            secret += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return secret;
    }

    // 2. 界面样式
    GM_addStyle(`
        #lsp-gen-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 100000;
            display: flex; justify-content: center; align-items: center;
            font-family: sans-serif; backdrop-filter: blur(5px);
        }
        .lsp-gen-card {
            background: #fff; width: 90%; max-width: 450px; border-radius: 15px;
            overflow: hidden; border: 3px solid #d24f70; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .lsp-gen-header { background: #d24f70; color: white; padding: 20px; text-align: center; }
        .lsp-gen-body { padding: 25px; text-align: center; color: #333; }
        #qrcode-box { background: white; padding: 15px; display: inline-block; border: 1px solid #ffd9e4; border-radius: 10px; margin-bottom: 15px; }
        .lsp-input-area { background: #fef1f5; border: 1px solid #ffd9e4; padding: 10px; border-radius: 8px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 13px; }
        .lsp-gen-btn {
            background: #d24f70; color: white; border: none; padding: 12px 25px;
            border-radius: 25px; cursor: pointer; font-weight: bold; transition: 0.3s;
            margin-top: 15px; width: 100%;
        }
        .lsp-gen-btn:hover { background: #b03d5a; transform: scale(1.02); }
        .lsp-hint { font-size: 12px; color: #888; margin-top: 10px; }
    `);

    function showUI() {
        if (document.getElementById('lsp-gen-overlay')) return;

        const secret = generateBase32Secret();
        const encrypted = CryptoJS.AES.encrypt(secret, SALT).toString();

        // 构造URI
        const account = "LSP_User";
        const issuer = "LSPSP_Lottery";
        const otpauthUrl = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&digits=6&period=30`;

        const overlay = document.createElement('div');
        overlay.id = 'lsp-gen-overlay';
        overlay.innerHTML = `
            <div class="lsp-gen-card">
                <div class="lsp-gen-header">
                    <h2 style="margin:0">🔐 2FA绑定工具</h2>
                </div>
                <div class="lsp-gen-body">
                    <div id="qrcode-box"></div>
                    <p style="font-weight:bold; color:#d24f70; margin:5px 0;">1. 使用谷歌验证器扫码绑定</p>

                    <div class="lsp-hint">无法扫码？手动输入密钥:</div>
                    <div class="lsp-input-area">${secret}</div>

                    <div style="height:2px; background:#ffd9e4; margin:20px 0;"></div>

                    <p style="font-weight:bold; color:#d24f70; margin:5px 0;">2. 复制下方加密串至统计脚本代码中的盐值内:</p>
                    <div class="lsp-input-area" style="color:#b03d5a; border-style:dashed; cursor:pointer;" id="copy-target" title="点击复制">${encrypted}</div>

                    <button class="lsp-gen-btn" id="close-gen">我已保存并绑定，关闭</button>
                    <p class="lsp-hint">点击加密串可自动复制</p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 生成二维码
        new QRCode(document.getElementById("qrcode-box"), {
            text: otpauthUrl,
            width: 160,
            height: 160,
            colorDark: "#d24f70",
            colorLight: "#ffffff"
        });

        // 复制功能
        document.getElementById('copy-target').onclick = function() {
            navigator.clipboard.writeText(encrypted);
            const original = this.innerText;
            this.innerText = "✅ 已复制到剪贴板！";
            setTimeout(() => this.innerText = original, 2000);
        };

        document.getElementById('close-gen').onclick = () => overlay.remove();
    }

    GM_registerMenuCommand("🛠️ 生成 2FA 绑定信息", showUI);
})();
