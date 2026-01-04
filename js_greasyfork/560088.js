// ==UserScript==
// @name         好医生+培训平台申请活动学时助手(V7.6智能拦截版)
// @namespace    http://tampermonkey.net/
// @version      7.6
// @description  好医生课程信息一键提取 + 培训平台申请活动学时自动填写 (含无效内容拦截功能)
// @author       GGBond
// @license      MIT
// @match        *://*.cmechina.net/cme/course.jsp*
// @match        *://ztxxpt.zgzjzj.net/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560088/%E5%A5%BD%E5%8C%BB%E7%94%9F%2B%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E7%94%B3%E8%AF%B7%E6%B4%BB%E5%8A%A8%E5%AD%A6%E6%97%B6%E5%8A%A9%E6%89%8B%28V76%E6%99%BA%E8%83%BD%E6%8B%A6%E6%88%AA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560088/%E5%A5%BD%E5%8C%BB%E7%94%9F%2B%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E7%94%B3%E8%AF%B7%E6%B4%BB%E5%8A%A8%E5%AD%A6%E6%97%B6%E5%8A%A9%E6%89%8B%28V76%E6%99%BA%E8%83%BD%E6%8B%A6%E6%88%AA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        let href = window.location.href;
        if (href.includes("cmechina.net")) {
            if (!document.getElementById('gemini-extract-btn')) addExtractButton();
        } else if (href.includes("ztxxpt.zgzjzj.net")) {
            if (!document.getElementById('gemini-btn-container')) addFillButtons();
        }
    }, 1000);

    function showToast(message, duration = 2000, color = "rgba(0,0,0,0.8)") {
        let toast = document.createElement("div");
        toast.innerHTML = message;
        toast.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:${color}; color:white; padding:15px 30px; border-radius:8px; z-index:999999; font-size:16px; font-weight:bold; box-shadow:0 4px 15px rgba(0,0,0,0.3); text-align:center; min-width:200px;`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = "opacity 0.5s ease";
            toast.style.opacity = "0";
            setTimeout(() => document.body.removeChild(toast), 500);
        }, duration);
    }

    function addExtractButton() {
        let btn = document.createElement("button");
        btn.id = "gemini-extract-btn";
        btn.innerHTML = "📑 提取课程信息";
        btn.style.cssText = "position:fixed; top:200px; left:20px; z-index:99999; padding:12px 20px; background:#1890ff; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size:14px;";
        btn.onclick = extractAndCopy;
        document.body.appendChild(btn);
    }

    function extractAndCopy() {
        let titleEl = document.querySelector('.product_text h3');
        let title = titleEl ? titleEl.innerText.trim() : "未找到标题";

        let infoText = document.querySelector('.product_text') ? document.querySelector('.product_text').innerText : "";
        let hours = "0";
        let scoreMatch = infoText.match(/(\d+(\.\d+)?)分/);
        if (scoreMatch) {
            let score = parseFloat(scoreMatch[1]);
            let calcHours = score * 3;
            if (calcHours % 1 === 0) calcHours = parseInt(calcHours);
            hours = calcHours.toString();
        }

        let paragraphs = document.querySelectorAll('.product_tab .product_p');
        let introText = "未找到简介";
        let goalText = "未找到目标";
        if (paragraphs.length >= 1) introText = cleanText(paragraphs[0].innerText);
        if (paragraphs.length >= 2) goalText = cleanText(paragraphs[1].innerText);

        if (introText === "未找到简介") { let t1 = document.querySelector('#tab-1'); if(t1) introText = cleanText(t1.innerText); }
        if (goalText === "未找到目标") { let t2 = document.querySelector('#tab-2'); if(t2) goalText = cleanText(t2.innerText); }

        if (introText.includes("内容正在组织") || introText.includes("敬请关注") || goalText.includes("内容正在组织")) {
            showToast("🛑 提取失败：该课程内容尚未发布！", 4000, "#F56C6C");
            return;
        }

        let finalString = `${title} // ${hours} // ${introText} // ${goalText} //`;
        GM_setClipboard(finalString);
        showToast("✅ 提取成功！已复制", 2000, "#67C23A");
    }

    function addFillButtons() {
        let container = document.createElement("div");
        container.id = "gemini-btn-container";
        container.style.cssText = "position:fixed !important; top:120px !important; right:30px !important; z-index:2147483647 !important; display:flex; flex-direction:column; gap:10px;";

        let btnFull = document.createElement("button");
        btnFull.innerHTML = "📋 剪贴板全自动";
        btnFull.style.cssText = "padding:10px 20px; background:#67C23A; color:white; border:none; border-radius:50px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size:14px;";
        btnFull.onclick = startFullProcess;

        let btnFixed = document.createElement("button");
        btnFixed.innerHTML = "⚙️ 仅填固定项";
        btnFixed.style.cssText = "padding:10px 20px; background:#E6A23C; color:white; border:none; border-radius:50px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size:14px;";
        btnFixed.onclick = startFixedProcess;

        container.appendChild(btnFull);
        container.appendChild(btnFixed);
        document.body.appendChild(container);
    }

    const CONFIG = {
        dropdowns: {
            type:   { label: "活动类型", value: "在岗培训" },
            course: { label: "课程类型", value: "专业科目" },
            mode:   { label: "活动形式", value: "专业技术人员继续教育" }
        },
        inputs: {
            num:     { label: "活动人数", value: "1" },
            name:    { label: "活动名称" },
            hours:   { label: "专业科目学时" },
            content: { label: "活动内容" },
            basic:   { label: "活动基本情况" }
        },
        separator: "//"
    };

    async function startFullProcess() {
        let clipboardText = "";
        try { clipboardText = await navigator.clipboard.readText(); }
        catch (err) { showToast("❌ 无法读取剪贴板！", 3000, "#F56C6C"); return; }
        if (!clipboardText) { showToast("⚠️ 剪贴板为空！", 3000, "#E6A23C"); return; }

        if (clipboardText.includes("==UserScript==") || clipboardText.includes("function()")) {
            showToast("🛑 拦截：剪贴板内容为脚本代码！", 4000, "#F56C6C");
            return;
        }

        let parts = clipboardText.split(CONFIG.separator);
        let valName    = parts[0] ? parts[0].trim() : "";
        let valHours   = parts[1] ? parts[1].trim() : "";
        let valContent = parts[2] ? parts[2].trim() : "";
        let valBasic   = parts[3] ? parts[3].trim() : "";

        if (valHours && isNaN(Number(valHours))) {
             showToast(`🛑 学时格式错误：${valHours}`, 4000, "#F56C6C");
             return;
        }

        if(valName) fillInputOrTextarea(CONFIG.inputs.name.label, valName);
        fillInputOrTextarea(CONFIG.inputs.num.label, CONFIG.inputs.num.value);

        await fillFixedItems();

        if(valHours) {
            await fillHoursWithRetry(valHours);
        }

        if(valContent) fillInputOrTextarea(CONFIG.inputs.content.label, valContent);
        if(valBasic)   fillInputOrTextarea(CONFIG.inputs.basic.label, valBasic);

        showToast("✅ 全自动填写完成！", 2000, "#67C23A");
    }

    async function startFixedProcess() {
        await fillFixedItems();
        showToast("✅ 固定项已完成", 2000, "#67C23A");
    }

    async function fillHoursWithRetry(value) {
        for (let i = 0; i < 10; i++) {
            let el = findInputOrTextareaByLabel(CONFIG.inputs.hours.label);
            if (el && isVisible(el)) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                return;
            }
            await sleep(500);
        }
    }

    async function fillFixedItems() {
        await handleElementSelect(CONFIG.dropdowns.type.label, CONFIG.dropdowns.type.value);
        await sleep(800);
        await handleElementSelect(CONFIG.dropdowns.course.label, CONFIG.dropdowns.course.value);
        await sleep(800);
        await handleElementSelect(CONFIG.dropdowns.mode.label, CONFIG.dropdowns.mode.value);
    }

    function fillInputOrTextarea(labelText, value) {
        let el = findInputOrTextareaByLabel(labelText);
        if (el) {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    async function handleElementSelect(labelText, targetValue) {
        let inputEl = findInputOrTextareaByLabel(labelText);
        if (!inputEl) return;
        inputEl.click();
        await sleep(600);
        let options = document.querySelectorAll('.el-select-dropdown__item');
        let found = false;
        for (let opt of options) {
            if (isVisible(opt) && opt.innerText.includes(targetValue)) {
                opt.click(); found = true; break;
            }
        }
        if (!found) document.body.click();
    }

    function findInputOrTextareaByLabel(text) {
        let xpath = `//label[contains(text(), '${text}')]/parent::div//input | //label[contains(text(), '${text}')]/following-sibling::div//input | //label[contains(text(), '${text}')]/parent::div//textarea | //label[contains(text(), '${text}')]/following-sibling::div//textarea`;
        let res = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return res.singleNodeValue;
    }

    function cleanText(text) { return text ? text.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim() : ""; }
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function isVisible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }

})();