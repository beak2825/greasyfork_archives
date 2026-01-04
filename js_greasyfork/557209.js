// ==UserScript==
// @name         通用 2FA / 验证码 自动填充辅助（密码管理器优化）
// @namespace    https://www.02id.com/
// @version      2025.11.29
// @description  让 Bitwarden / 1Password / LastPass 等密码管理器更容易识别各网站的 2FA 验证码/二次校验码输入框（含弹窗、SPA）
// @author       萌新 & 零贰博客
// @icon         https://www.02id.com/favicon.png
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557209/%E9%80%9A%E7%94%A8%202FA%20%20%E9%AA%8C%E8%AF%81%E7%A0%81%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%BE%85%E5%8A%A9%EF%BC%88%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%E4%BC%98%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557209/%E9%80%9A%E7%94%A8%202FA%20%20%E9%AA%8C%E8%AF%81%E7%A0%81%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%BE%85%E5%8A%A9%EF%BC%88%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%E4%BC%98%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        DEBUG: false,
        POLL_INTERVAL: 800,
        MAX_POLL_ATTEMPTS: 120,
        TRIGGER_EVENTS: true,
        FORCE_NUMERIC_INPUTMODE: true,

        // 会被排除的图形验证码特征
        CAPTCHA_KEYWORDS: [
            "图形验证码", "图片验证码", "请输验证码", "请输入验证码",
            "看不清", "点击刷新", "刷新验证码"
        ],
        CAPTCHA_NAME_KEYS: ["captcha", "verify", "checkcode", "imgcode"],

        // 2FA 关键词
        OTP_KEYWORDS: [
            '验证码', '校验码', '二次校验码', '动态码', '动态密码', '安全码',
            'otp', 'one time code', 'one-time code', 'verification code',
            'auth code', '2fa', 'two factor', 'mfa'
        ],

        SITE_RULES: [
            {
                name: '阿里云 2FA',
                urlPattern: /passport\.alibabacloud\.com\/ac\/iv\/mini\/identity_verify\.htm/i,
                selectors: ['#J_Tp_Checkcode']
            },
            {
                name: 'ElementUI 弹窗 二次校验码（常见后台）',
                urlPattern: /.*/,
                selectors: [
                    'div.el-dialog input.el-input__inner[placeholder*="二次校验"]',
                    'div.el-dialog input.el-input__inner[placeholder*="验证码"]'
                ]
            }
        ],

        COMMON_LENGTHS: [4,5,6,7,8]
    };

    function debug(msg) {
        if (CONFIG.DEBUG) console.log('[2FA Helper]', msg);
    }

    // 🛡️ 图形验证码排除判断
    function isCaptchaInput(el) {
        const placeholder = (el.placeholder || "").toLowerCase();
        const name = (el.name || "").toLowerCase();
        const id = (el.id || "").toLowerCase();

        // placeholder 包含图形验证码关键词
        for (const kw of CONFIG.CAPTCHA_KEYWORDS) {
            if (placeholder.includes(kw.toLowerCase())) return true;
        }

        // 名称包含 captcha 常用字段
        for (const key of CONFIG.CAPTCHA_NAME_KEYS) {
            if (name.includes(key) || id.includes(key)) return true;
        }

        // 若有 <img> 紧挨着（常见验证码布局）
        const parent = el.closest(".form-group, .input-group, .el-input, div");
        if (parent && parent.querySelector("img")) {
            const img = parent.querySelector("img");
            if (img.src && img.src.match(/captcha|verify|image|code/i)) {
                return true;
            }
        }

        return false;
    }

    function isLikelyOtpInput(el) {
        if (!el || el.tagName !== 'INPUT') return false;

        // ⛔ 排除图形验证码
        if (isCaptchaInput(el)) {
            debug("排除图形验证码输入框");
            return false;
        }

        const type = (el.type || '').toLowerCase();
        if (!['text', 'tel', 'number', 'password'].includes(type)) return false;

        const placeholder = (el.placeholder || '').toLowerCase();
        const name = (el.name || '').toLowerCase();
        const id = (el.id || '').toLowerCase();
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        const maxLength = parseInt(el.maxLength || "0", 10);
        const combined = [placeholder, name, id, aria].join(" ");

        // OTP 关键词检测
        for (const kw of CONFIG.OTP_KEYWORDS)
            if (combined.includes(kw.toLowerCase())) return true;

        // 数字长度推断 (非密码框)
        if (!isNaN(maxLength) && CONFIG.COMMON_LENGTHS.includes(maxLength)) {
            const pwLike = /password|passwd|pwd/.test(combined);
            if (!pwLike) return true;
        }

        return false;
    }

    function enhanceOtpInput(el, reason) {
        if (el.dataset._enhanced === "1") return;

        el.dataset._enhanced = "1";
        debug("增强 2FA 输入框: " + reason);

        el.setAttribute("autocomplete", "one-time-code");
        el.setAttribute("data-lpignore", "false");
        el.setAttribute("data-1p-ignore", "false");

        if (CONFIG.FORCE_NUMERIC_INPUTMODE) {
            el.setAttribute("inputmode", "numeric");
            el.setAttribute("pattern", "\\d*");
        }

        if (CONFIG.TRIGGER_EVENTS) {
            el.dispatchEvent(new Event("focus", { bubbles: true }));
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    function scan(root) {
        const inputs = root.querySelectorAll("input");
        inputs.forEach(el => {
            if (isLikelyOtpInput(el)) enhanceOtpInput(el, "heuristic");
        });
    }

    function init() {
        scan(document);

        const obs = new MutationObserver(list => {
            list.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) scan(node);
                });
            });
        });

        obs.observe(document.body, { childList: true, subtree: true });

        let attempts = 0;
        const timer = setInterval(() => {
            attempts++;
            scan(document);
            if (attempts >= CONFIG.MAX_POLL_ATTEMPTS) clearInterval(timer);
        }, CONFIG.POLL_INTERVAL);
    }

    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", init)
        : init();
})();