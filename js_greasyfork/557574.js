// ==UserScript==
// @name         Odoo POS 增强版 (快捷键修复 + 完美预览 + 数量统计 + 防待机)
// @namespace    playbox-electronics
// @version      5.9.4
// @description  修复搜索框内F1-F10失效问题、彻底消除图片残影、无限制回车搜索、自动关闭弹窗；顶部数量统计自动过滤折扣、税费、运费等项目；防止POS进入待机屏保。
// @author       Playbox & Gemini
// @match        *://*.odoo.com/pos/*
// @match        *://*/pos/*
// @match        *://*/point_of_sale/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557574/Odoo%20POS%20%E5%A2%9E%E5%BC%BA%E7%89%88%20%28%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%AE%E5%A4%8D%20%2B%20%E5%AE%8C%E7%BE%8E%E9%A2%84%E8%A7%88%20%2B%20%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1%20%2B%20%E9%98%B2%E5%BE%85%E6%9C%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557574/Odoo%20POS%20%E5%A2%9E%E5%BC%BA%E7%89%88%20%28%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%AE%E5%A4%8D%20%2B%20%E5%AE%8C%E7%BE%8E%E9%A2%84%E8%A7%88%20%2B%20%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1%20%2B%20%E9%98%B2%E5%BE%85%E6%9C%BA%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ==========================================
    // 0. 全局设置
    // ==========================================
    const PREVIEW_DELAY = 300; // 图片预览延迟(ms)

    // ==========================================
    // 1. 样式与UI工具
    // ==========================================
    const style = document.createElement("style");
    style.textContent = `
        .category-list { height: 150px !important; border-bottom: 2px solid #9f9f9f40 !important; overflow-y: auto; }

        /* 预览悬浮窗 */
        #pos-img-overlay {
            position: fixed; right: 20px; bottom: 20px; z-index: 999999;
            background: #fff; padding: 8px; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3); pointer-events: none;
            opacity: 0; transform: translateY(20px) scale(0.95);
            /* 容器出现动画 */
            transition: opacity 0.25s ease-out, transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        #pos-img-overlay.visible { opacity: 1; transform: translateY(0) scale(1); }

        /* 图片本身 */
        #pos-img-overlay img {
            display: block; border-radius: 8px; object-fit: contain;
            background: #f8f9fa; /* 加载底色 */
            opacity: 0;
            transition: opacity 0.2s ease-in;
        }
        #pos-img-overlay img.loaded { opacity: 1; }

        /* 提示气泡 */
        #pos-tip-box {
            position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.85); color: #fff;
            padding: 10px 16px; border-radius: 8px; font-size: 16px; z-index: 99999;
            transition: opacity 0.5s; opacity: 0; pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    let tipTimer;
    function showTip(msg) {
        if (!GM_getValue("showTips", true)) return;
        let tip = document.getElementById("pos-tip-box");
        if (!tip) {
            tip = document.createElement("div");
            tip.id = "pos-tip-box";
            document.body.appendChild(tip);
        }
        tip.innerText = msg;
        tip.style.opacity = "1";
        clearTimeout(tipTimer);
        tipTimer = setTimeout(() => { tip.style.opacity = "0"; }, 2000);
    }

    function clickInModal(selector, label) {
        const modal = document.querySelector(".modal, .modal-dialog, .modal-body, .popup");
        if (modal) {
            const btn = modal.querySelector(selector)?.closest("button");
            if (btn) { btn.click(); showTip(`✅ 已点击「${label}」`); }
            else {
                const close = modal.querySelector('button.btn-close[aria-label="关闭"], .button.cancel');
                if (close) { close.click(); showTip(`⚠️ 未找到，自动关闭弹窗`); }
            }
            return;
        }
        const more = document.querySelector("button.more-btn");
        if (more) {
            more.click();
            let count = 0;
            const t = setInterval(() => {
                const m = document.querySelector(".modal, .modal-dialog, .modal-body, .popup");
                if (!m) return;
                const b = m.querySelector(selector)?.closest("button");
                const c = m.querySelector('button.btn-close[aria-label="关闭"], .button.cancel');
                if (b) { b.click(); showTip(`✅ 已点击「${label}」`); clearInterval(t); }
                else if (c && ++count > 5) { c.click(); clearInterval(t); }
            }, 200);
            setTimeout(() => clearInterval(t), 2000);
        }
    }

    // ==========================================
    // 2. 模块：按回车搜索 (防卡顿 + 防误伤)
    // ==========================================
    const SearchFix = {
        init: () => {
            if (GM_getValue("enable_search_fix", true) === false) return;

            const attach = (input) => {
                if (input.dataset.posFix) return;

                // 🛑 关键修复：如果输入框在弹窗里，绝对不要处理！
                if (input.closest('.modal, .modal-dialog, .popup, .popups')) return;

                let manual = false;
                input.addEventListener('input', (e) => {
                    if (manual) { manual = false; return; }
                    e.stopImmediatePropagation(); e.stopPropagation();
                }, true);

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        if (document.querySelector(".modal-content, .popup")) return;

                        manual = true;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.blur(); setTimeout(() => input.focus(), 10);
                    }
                }, true);

                input.dataset.posFix = "true";
            };

            const obs = new MutationObserver(() => {
                const inputs = document.querySelectorAll('.pos-search-bar input, .search-box input, .input-container input.o_input');
                inputs.forEach(attach);
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }
    };

    // ==========================================
    // 3. 模块：丝滑图片预览 (强制清空缓存版)
    // ==========================================
    const ImagePreview = {
        init: () => {
            let overlay, img, timer;
            const getSize = () => ({ normal: [420,300], large: [640,480], xlarge: [800,600] }[GM_getValue("imageSize", "large")] || [640,480]);

            const create = () => {
                if (overlay) return;
                overlay = document.createElement("div"); overlay.id = "pos-img-overlay";
                img = document.createElement("img"); overlay.appendChild(img);
                document.body.appendChild(overlay);
            };

            const show = (el) => {
                const i = el.querySelector("img");
                if (!i) return;
                create();

                // 🛑 核心修复：立刻重置图片状态
                img.classList.remove("loaded");
                img.style.opacity = "0";
                img.src = "";

                const [w, h] = getSize();
                const newSrc = i.src.replace(/image_\d+/, "image_1024");
                Object.assign(img.style, { maxWidth: w+"px", maxHeight: h+"px" });

                img.onload = () => {
                    img.style.opacity = "";
                    img.classList.add("loaded");
                };

                img.src = newSrc;
                requestAnimationFrame(() => overlay.classList.add("visible"));
            };

            document.addEventListener("mouseover", (e) => {
                if (!GM_getValue("imagePreview", true)) return;
                const el = e.target.closest(".product-img, article.product");
                clearTimeout(timer);
                if (el) timer = setTimeout(() => show(el), PREVIEW_DELAY);
                else if (overlay) overlay.classList.remove("visible");
            }, true);

            document.addEventListener("mouseout", (e) => {
                if (e.target.closest(".product-img, article.product")) {
                    clearTimeout(timer);
                    if (overlay) overlay.classList.remove("visible");
                }
            }, true);
        }
    };

    // ==========================================
    // 4. 模块：数量统计 (过滤版)
    // ==========================================
    const QtyCounter = {
        init: () => {
            let lastSum = null;
            // 🚫 定义需要排除的关键词 (大写匹配)
            const BLACKLIST = ["CORTESÍA", "税费", "IMPUESTO", "DESCUENTO", "GUIA", "折扣"];

            setInterval(() => {
                const container = [...document.querySelectorAll(".order-container")].find(c => getComputedStyle(c).display !== 'none');
                if (!container) {
                    const s = document.getElementById("pos-total-qty");
                    if(s) s.textContent = "数量: ...";
                    return;
                }

                let sum = 0;
                // 改为遍历每一行，以便获取商品名称
                container.querySelectorAll(".orderline").forEach(line => {
                    const nameEl = line.querySelector(".product-name");
                    const qtyEl = line.querySelector(".qty");

                    if (nameEl && qtyEl) {
                        const name = nameEl.textContent.toUpperCase();
                        // 🛑 过滤逻辑
                        const isIgnored = BLACKLIST.some(k => name.includes(k));

                        if (!isIgnored) {
                            sum += parseFloat(qtyEl.textContent.trim().replace(",", ".")) || 0;
                        }
                    }
                });

                if (sum !== lastSum) {
                    const totalEl = document.querySelector(".order-summary .total");
                    if (totalEl) {
                        let label = document.getElementById("pos-total-qty");
                        if (!label) {
                            label = document.createElement("span");
                            label.id = "pos-total-qty";
                            label.style.cssText = "margin-right: 10px; color: #007bff; font-weight: bold;";
                            totalEl.parentNode.insertBefore(label, totalEl);
                        }
                        label.textContent = `数量: ${sum}`;
                    }
                    lastSum = sum;
                }
            }, 300);
        }
    };

    // ==========================================
    // 5. 业务逻辑 (快捷键)
    // ==========================================
    const Promo = {
        apply: () => {
            const existBtn = [...document.querySelectorAll("button")].find(b => b.textContent.includes("优惠类型"));
            if (existBtn && existBtn.classList.contains("disabled")) return showTip("⚠️ 暂不可用优惠");

            clickInModal("i.fa-star", "优惠类型");

            let tries = 0;
            const t = setInterval(() => {
                const items = document.querySelectorAll(".selection-item, .modal button");
                const target = [...items].find(i => i.textContent.includes("满2000送牙刷") || i.textContent.includes("CEPILLO"));
                if (target) { target.click(); clearInterval(t); showTip("✅ 已应用牙刷优惠"); }
                else if (++tries > 20) { clearInterval(t); showTip("⚠️ 未找到优惠选项"); }
            }, 150);
        }
    };

    // 🟢 键盘监听 (Keydown) - 修复版
    document.addEventListener("keydown", (e) => {
        const k = e.key;
        const isInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";

        // 1. 弹窗优先：如果有弹窗，回车必点确认
        if (k === "Enter") {
            const modalContent = document.querySelector(".modal-content, .popup");
            if (modalContent) {
                const confirmBtn = modalContent.querySelector(".btn-primary, .button.confirm");
                if (confirmBtn && !confirmBtn.disabled && !confirmBtn.classList.contains("disabled")) {
                    e.preventDefault(); e.stopPropagation();
                    confirmBtn.click();
                    return;
                }
            }
        }

        // 2. 输入框处理 (修复 BUG 的核心)
        if (isInput) {
            // 允许 Enter, Escape, 和所有 F键 (F1-F12) 通过
            if (k !== "Enter" && k !== "Escape" && !k.startsWith("F")) {
                return;
            }
        }

        // 屏蔽 F1-F12 (除了F5)
        if (["F1","F2","F3","F4","F6","F7","F8","F9","F10"].includes(k)) e.preventDefault();

        const href = window.location.href;
        const inProduct = href.includes("/product") || !href.includes("/payment");
        const inPayment = href.includes("/payment");

        if (inProduct) {
            if (k === "F1" && GM_getValue("enable_F1", true)) { const b = document.querySelector(".pay-order-button"); if(b) b.click(); }
            if (k === "F2" && GM_getValue("enable_F2", true)) clickInModal('i[aria-label="产品信息"], i[title="产品信息"]', "产品信息");
            if (k === "F3" && GM_getValue("enable_F3", true)) Promo.apply();
            if (k === "F4" && GM_getValue("enable_F4", true)) clickInModal('i[aria-label="设置销售订单"]', "报价/订单");
            if (k === "F6" && GM_getValue("enable_F6", true)) clickInModal('i[aria-label="价格表"]', "价格表");
            if (k === "F7" && GM_getValue("enable_F7", true)) clickInModal(".fa-trash", "取消订单");
            if (k === "F8" && GM_getValue("enable_F8", true)) { const b = document.querySelector(".numpad-qty"); if(b) {b.click(); showTip("🔢 数量");} }
            if (k === "F9" && GM_getValue("enable_F9", true)) { const b = document.querySelector(".numpad-price"); if(b) {b.click(); showTip("💲 价格");} }
            if (k === "F10" && GM_getValue("enable_F10", true)) { const b = document.querySelector(".list-plus-btn"); if(b) {b.click(); showTip("🛒 新建订单");} }

            if (k === "Enter" && GM_getValue("enable_Enter", true)) {
                if (document.querySelector(".modal, .popup")) return; // 再次防护
                const b = document.querySelector("button.o-default-button");
                if(b) { b.click(); showTip("✅ 添加"); }
            }
        }

        if (inPayment) {
            if (k === "Enter" && GM_getValue("enable_Enter", true)) { const b = document.querySelector(".validation-button"); if(b) b.click(); }
            if (k === "Escape" && GM_getValue("enable_Escape", true)) { const b = document.querySelector(".back-button"); if(b) b.click(); }
        }

        if (k === "Escape" && GM_getValue("enable_Escape", true)) {
            const close = document.querySelector(".modal .btn-close, .modal .cancel, .modal .close, .popup .cancel");
            if (close) { close.click(); showTip("❎ 关闭弹窗"); }
        }

    }, true);

    // ==========================================
    // 6. 模块：防待机 (Anti-Sleep)
    // ==========================================
    const AntiSleep = {
        init: () => {
            if (!GM_getValue("enable_anti_sleep", true)) return;

            // 每60秒模拟一次鼠标事件
            setInterval(() => {
                // 🛠️ 修复：移除 'view': window，解决 Proxy 对象报错问题
                const event = new MouseEvent('mousemove', {
                    'bubbles': true,
                    'cancelable': true,
                    'clientX': 1,
                    'clientY': 1
                });
                document.body.dispatchEvent(event);
                window.dispatchEvent(event);
            }, 60000);
        }
    };

    // ==========================================
    // 7. 菜单注册
    // ==========================================
    let menuIds = [];
    function refreshMenu() {
        menuIds.forEach(GM_unregisterMenuCommand);
        menuIds = [];

        const addToggle = (key, name) => {
            const v = GM_getValue(key, true);
            menuIds.push(GM_registerMenuCommand(`${v?"✅":"❌"} ${name}`, () => {
                GM_setValue(key, !v); showTip(`${name} 已${!v?"开启":"关闭"}`); refreshMenu();
            }));
        };

        addToggle("enable_anti_sleep", "🛡️ 防待机模式");
        addToggle("enable_search_fix", "按回车搜索 (防卡顿)");
        addToggle("showTips", "提示气泡");
        addToggle("imagePreview", "图片悬浮预览");

        const sz = GM_getValue("imageSize", "large");
        const label = {normal:"普通",large:"大号",xlarge:"超大"}[sz];
        menuIds.push(GM_registerMenuCommand(`🖼️ 图片尺寸: ${label}`, () => {
            const map = ["normal","large","xlarge"];
            const next = map[(map.indexOf(sz)+1)%3];
            GM_setValue("imageSize", next); showTip(`尺寸: ${next}`); refreshMenu();
        }));

        ["F1","F2","F3","F4","F6","F7","F8","F9","F10","Enter","Escape"].forEach(k => {
            const desc = {F1:"收款",F2:"产品信息",F3:"优惠",F4:"报价",F6:"价格表",F7:"取消",F8:"数量",F9:"价格",F10:"新单",Enter:"确认",Escape:"返回"}[k];
            const v = GM_getValue(`enable_${k}`, true);
            menuIds.push(GM_registerMenuCommand(`${v?"✅":"❌"} ${k} ${desc}`, () => {
                GM_setValue(`enable_${k}`, !v); showTip(`${k} 已${!v?"启用":"禁用"}`); refreshMenu();
            }));
        });
    }

    refreshMenu();
    SearchFix.init();
    ImagePreview.init();
    QtyCounter.init();
    AntiSleep.init();
    console.log("🚀 Odoo POS Enhanced v5.9.4 Loaded");

})();