// ==UserScript==
// @name         问卷星AI自动填写
// @version      1.3.2
// @description  利用 Google Gemini 模型自动回答问卷，支持新版VM页面、协议自动勾选、手机号强力填充、漏题自动定位高亮。
// @author       ZainCheung (原作者) & kelryry (AI适配版作者)
// @license      GPL-3.0-only
// @source       https://github.com/kelryry/wjx-auto-sniper
// @include      https://www.wjx.cn/jq/*.aspx
// @include      https://www.wjx.cn/m/*.aspx
// @include      https://www.wjx.cn/hj/*.aspx
// @include      https://www.wjx.cn/wjx/join/complete.aspx*
// @include      https://www.wjx.cn/vm/*.aspx
// @include      https://v.wjx.cn/vm/*.aspx
// @include      https://www.wjx.top/vm/*.aspx
// @connect      generativelanguage.googleapis.com
// @grant        GM_xmlhttpRequest
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/557522/%E9%97%AE%E5%8D%B7%E6%98%9FAI%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/557522/%E9%97%AE%E5%8D%B7%E6%98%9FAI%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

/*
 * Copyright (C) 2025 kelryry
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * =================================================================
 * ACKNOWLEDGEMENT / 致谢:
 * 本脚本基于 ZainCheung 的 "问卷星自动随机答题" 进行二次开发。
 * 原项目遵循 Apache License 2.0 协议。
 * Original Source: https://github.com/ZainCheung/wenjuanxin
 * =================================================================
 */

(function () {
    'use strict';

    // =========================================================================
    //                           用户配置区 (USER CONFIGURATION)
    // =========================================================================
    const USER_CONFIG = {
        // [必填] Google Gemini API Key
        // 免费申请地址: https://aistudio.google.com/app/apikey
        GEMINI_API_KEY: "",
        MODEL_NAME: "gemini-flash-lite-latest",
        // [必填] 填写人设 (Persona)
        // 请详细描述你想扮演的角色，AI 将根据此信息进行逻辑作答。
        // 如果题目涉及未提及的信息，AI 会进行合理推断。
        PERSONA: `
            姓名：张三
            电话: 13800138000
            身份：大四学生，计算机科学专业
            性格：积极向上，对未来充满期待
            生活习惯：每天上网时间约5小时，喜欢玩游戏和编程
            情况：如果遇到未提及的问题，请进行合理的正面推断
        `,

        // [选填] 抢答开始时间 (格式：YYYY-MM-DD HH:mm:ss)
        // 设置为未来的时间，脚本会在该时间点前自动刷新并开始答题。
        // 设置为过去的时间，脚本会立即开始。
        START_TIME: "2025-12-01 10:00:00",

        // [选填] 刷新提前量 (单位：秒)
        // 配合 START_TIME 使用，比如设为 0.3，则在时间点前 0.3 秒刷新，抵消网络延迟。
        PRE_LOAD_OFFSET: 0.3,

        // [选填] 是否自动提交
        // true: 填写完毕后自动点击提交按钮（会有1秒安全延迟）。
        // false: 填写完毕后滚动到提交按钮处，需人工手动点击（建议默认 false 以降低风险）。
        AUTO_SUBMIT: false
    };

    // Gemini API 端点配置
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${USER_CONFIG.MODEL_NAME}:generateContent?key=${USER_CONFIG.GEMINI_API_KEY}`;

    // =========================================================================
    //                       页面适配器 (Page Adapter)
    // =========================================================================
    // 用于处理 PC版(jq) 和 移动版(vm/m) 不同的 DOM 结构差异

    const SELECTORS = {
        PC: {
            question: '.div_question',       // 题目容器
            title: '.div_title_question_all',// 题目标题
            optionItem: 'li',                // 选项容器
            // 文本输入框 (包含多行文本、单行文本、数字、手机号)
            textInput: 'textarea, input[type="text"], input[type="number"], input[type="tel"], .inputtext'
        },
        MOBILE: {
            question: '.field',
            title: '.field-label',
            optionItem: '.ui-radio, .ui-checkbox',
            textInput: 'textarea, input[type="text"], input[type="number"], input[type="tel"], .ui-input-text'
        }
    };

    /**
     * 检测当前页面类型
     * @returns {'PC' | 'MOBILE' | 'UNKNOWN'}
     */
    function detectPageType() {
        if (document.querySelectorAll(SELECTORS.PC.question).length > 0) return 'PC';
        if (document.querySelectorAll(SELECTORS.MOBILE.question).length > 0) return 'MOBILE';
        return 'UNKNOWN';
    }


    // =========================================================================
    //                       核心工具函数 (Core Utilities)
    // =========================================================================

    /**
     * 模拟原生输入 (Native Input Simulation)
     * 作用：绕过 React/Vue/jQuery 等前端框架对 value 属性的劫持，确保手机号/文本能被网页正确识别。
     */
    function simulateInput(element, value) {
        if (!element) return;
        element.focus();

        // 核心：调用 HTMLInputElement 原型链上的 setter
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(element, value);

        // 触发完整的事件链，欺骗浏览器以为是人工输入
        const eventOpts = {bubbles: true, cancelable: true, view: window};
        element.dispatchEvent(new Event('input', eventOpts));
        element.dispatchEvent(new Event('change', eventOpts));
        element.dispatchEvent(new Event('blur', eventOpts)); // 许多验证逻辑在 blur 时触发
    }

    /**
     * 自动处理隐私协议勾选框
     * 作用：在提交前检测并勾选问卷星移动端的隐私协议。
     */
    function handleProtocol() {
        const checkbox = document.getElementById('checkxiexi');
        // 如果存在且未勾选
        if (checkbox && !checkbox.checked) {
            console.log("[System] 检测到隐私协议，正在自动勾选...");
            checkbox.click();
            checkbox.checked = true; // 双重保险
        }
    }


    // =========================================================================
    //                       数据处理逻辑 (Data Logic)
    // =========================================================================

    /**
     * 提取页面上的所有题目
     */
    function extractQuestions() {
        const pageType = detectPageType();
        if (pageType === 'UNKNOWN') return [];

        const sel = SELECTORS[pageType];
        const questions = [];
        const divs = document.querySelectorAll(sel.question);

        divs.forEach((div, index) => {
            // 获取题目ID (如果是 div123 则提取 123，否则使用索引)
            let qId = div.id.replace("div", "");
            if (!qId) qId = index + 1;

            const label = div.querySelector(sel.title);
            const title = label ? label.innerText.replace(/\r\n/g, "").trim() : "未获取到标题";

            let type = "complex"; // 默认为复杂题型(如矩阵/排序)，AI 仅处理简单题型
            let options = [];

            // 1. 尝试提取选项
            const optionItems = div.querySelectorAll(sel.optionItem);
            if (optionItems.length > 0) {
                optionItems.forEach((item, idx) => {
                    let text = item.innerText.trim();
                    // 移动端文本常在 label 标签内
                    if (pageType === 'MOBILE') {
                        const lbl = item.querySelector('label');
                        if (lbl) text = lbl.innerText.trim();
                    }
                    options.push({index: idx, text: text});
                });

                // 判断单/多选
                if (pageType === 'PC') {
                    const input = div.querySelector("input");
                    if (input) type = input.type === 'radio' ? 'radio' : 'checkbox';
                } else {
                    if (div.querySelector('.ui-radio')) type = 'radio';
                    else if (div.querySelector('.ui-checkbox')) type = 'checkbox';
                }
            }
            // 2. 尝试提取文本输入
            else if (div.querySelector(sel.textInput)) {
                type = 'text';
            }

            // 仅添加 AI 可处理的题型
            if (type !== 'complex') {
                questions.push({
                    id: qId,
                    domId: div.id,
                    type: type,
                    title: title,
                    options: options
                });
            }
        });
        return questions;
    }

    /**
     * 调用 Gemini API 获取答案
     * @param {Array} questionBatch - 题目批次
     */
    async function getAnswersFromAI(questionBatch) {
        if (questionBatch.length === 0) return [];

        // 简化 payload，节省 token
        const cleanBatch = questionBatch.map(q => ({
            id: q.id, type: q.type, title: q.title, options: q.options
        }));

        const prompt = `
            Role: ${USER_CONFIG.PERSONA}
            Task: Answer the survey questions.
            Format: Return strictly a valid JSON Array. No Markdown code blocks.
            
            Requirements:
            - For 'radio': return "selection_index" (int, 0-based).
            - For 'checkbox': return "selection_indices" (array of ints).
            - For 'text': return "content" (string, keep it concise).
            
            Questions: ${JSON.stringify(cleanBatch)}
        `;

        const payload = {contents: [{parts: [{text: prompt}]}]};

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: API_URL,
                headers: {"Content-Type": "application/json"},
                data: JSON.stringify(payload),
                onload: (response) => {
                    try {
                        const resJson = JSON.parse(response.responseText);
                        let text = resJson.candidates[0].content.parts[0].text;
                        // 清理 Markdown 标记
                        text = text.replace(/```json|```/g, "").trim();
                        resolve(JSON.parse(text));
                    } catch (e) {
                        console.error("[AI Error] 解析响应失败:", e);
                        resolve([]);
                    }
                },
                onerror: (err) => {
                    console.error("[Network Error] API 请求失败:", err);
                    resolve([]);
                }
            });
        });
    }

    /**
     * 将 AI 答案填入 DOM
     */
    function fillQuestion(qObj, aiAnswer) {
        const pageType = detectPageType();
        const sel = SELECTORS[pageType];
        const div = document.getElementById(qObj.domId);
        if (!div) return;

        // A. 填空题处理
        if (aiAnswer.content) {
            const inputEl = div.querySelector('input[type="tel"]') ||
                div.querySelector('textarea') ||
                div.querySelector('input[type="text"]') ||
                div.querySelector('input[type="number"]');
            if (inputEl) {
                simulateInput(inputEl, aiAnswer.content);
            }
        }
        // B. 单选题处理
        else if (aiAnswer.selection_index !== undefined) {
            const items = div.querySelectorAll(sel.optionItem);
            const target = items[aiAnswer.selection_index];
            if (target) {
                target.click();
                // 移动端可能需要点击内部的 label
                const label = target.querySelector('label');
                if (label) label.click();
            }
        }
        // C. 多选题处理
        else if (aiAnswer.selection_indices) {
            const items = div.querySelectorAll(sel.optionItem);
            aiAnswer.selection_indices.forEach(idx => {
                if (items[idx]) {
                    // 检查是否已选，防止反选
                    let isChecked = false;
                    if (pageType === 'PC') {
                        const inp = items[idx].querySelector('input');
                        if (inp && inp.checked) isChecked = true;
                    } else {
                        if (items[idx].classList.contains('ui-checkbox-on')) isChecked = true;
                    }

                    if (!isChecked) {
                        items[idx].click();
                        const label = items[idx].querySelector('label');
                        if (label) label.click();
                    }
                }
            });
        }
    }


    // =========================================================================
    //                       导航与提交逻辑 (Navigation)
    // =========================================================================

    /**
     * 判断某道题是否已完成
     */
    function isQuestionFilled(div) {
        // 检查输入框值
        const inputs = div.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"], textarea');
        for (let inp of inputs) {
            if (inp.value && inp.value.trim() !== "") return true;
        }
        // 检查选中状态 (PC/Mobile)
        if (div.querySelector('input:checked')) return true;
        if (div.querySelector('.ui-radio-on') || div.querySelector('.ui-checkbox-on')) return true;
        // 如果没有输入项(如纯文本说明)，视为已完成
        return !div.querySelector('input, textarea, .ui-radio, .ui-checkbox');


    }

    /**
     * 检查完成度并执行导航
     */
    function checkAndNavigate() {
        const pageType = detectPageType();
        const sel = SELECTORS[pageType];
        const allDivs = document.querySelectorAll(sel.question);

        let firstUnfilled = null;

        // 寻找第一个漏填项
        for (let div of allDivs) {
            if (div.style.display === 'none') continue; // 跳过被隐藏的逻辑题
            if (!isQuestionFilled(div)) {
                firstUnfilled = div;
                break;
            }
        }

        const submitBtn = document.getElementById("submit_button") || document.querySelector(".submitbutton");

        if (firstUnfilled) {
            console.warn(`[Nav] 发现未填题目 (ID: ${firstUnfilled.id})，跳转中...`);
            // 高亮显示漏题
            firstUnfilled.scrollIntoView({behavior: "smooth", block: "center"});
            firstUnfilled.style.border = "3px solid #ff4d4f";
            firstUnfilled.style.borderRadius = "5px";
            // 存在漏题时不执行提交
        } else {
            console.log("[Nav] 全部题目已完成，跳转至提交区。");
            if (submitBtn) {
                submitBtn.scrollIntoView({behavior: "smooth", block: "center"});

                if (USER_CONFIG.AUTO_SUBMIT) {
                    console.log("[AutoSubmit] 倒计时 1秒 后自动提交...");
                    setTimeout(() => {
                        submitBtn.click();
                        // 尝试处理 layui 确认弹窗
                        setTimeout(() => {
                            const confirmBtn = document.querySelector(".layui-layer-btn0");
                            if (confirmBtn) confirmBtn.click();
                        }, 500);
                    }, 1000);
                }
            }
        }
    }


    // =========================================================================
    //                       主程序入口 (Main)
    // =========================================================================

    function checkTimeAndRedirect() {
        const targetTime = new Date(USER_CONFIG.START_TIME).getTime();
        const now = Date.now();
        const bufferMs = USER_CONFIG.PRE_LOAD_OFFSET * 1000;
        const waitTime = targetTime - now - bufferMs;

        if (waitTime > 0) {
            console.log(`[Timer] 等待抢答... 剩余 ${(waitTime / 1000).toFixed(1)} 秒`);
            // 创建倒计时遮罩
            let div = document.createElement('div');
            div.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);color:white;z-index:9999;display:flex;justify-content:center;align-items:center;font-size:24px;";
            div.id = "timer-mask";
            div.innerText = "等待抢答...";
            document.body.appendChild(div);

            setTimeout(() => location.reload(), waitTime);
            return false;
        }

        let mask = document.getElementById("timer-mask");
        if (mask) mask.remove();
        return true;
    }

    async function main() {
        // 1. 时间检查
        if (!checkTimeAndRedirect()) return;

        // 2. 提取题目
        const allQuestions = extractQuestions();
        if (allQuestions.length === 0) {
            console.error("[System] 未找到有效题目，脚本停止运行。");
            return;
        }
        console.log(`[Main] 开始 AI 答题，共 ${allQuestions.length} 道题目。`);

        // 3. 分批请求 AI (防止 Tokens 超限)
        const batchSize = 15;
        for (let i = 0; i < allQuestions.length; i += batchSize) {
            const batch = allQuestions.slice(i, i + batchSize);
            console.log(`[Main] 正在处理第 ${i + 1} - ${Math.min(i + batchSize, allQuestions.length)} 题...`);

            const aiAnswers = await getAnswersFromAI(batch);

            // 填入答案
            aiAnswers.forEach(ans => {
                const qObj = batch.find(q => q.id == ans.id);
                if (qObj) fillQuestion(qObj, ans);
            });

            // 批次间小歇，防止浏览器无响应
            await new Promise(r => setTimeout(r, 200));
        }

        // 4. 后处理：勾选协议
        handleProtocol();

        // 5. 导航逻辑：检查漏题或跳转提交
        // 延迟执行以等待 DOM 状态更新
        setTimeout(checkAndNavigate, 500);
    }

    // 页面加载完成后延迟启动
    setTimeout(main, 1000);

})();