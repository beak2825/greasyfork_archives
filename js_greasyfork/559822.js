// ==UserScript==
// @name         JLU自动评教
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自动填写教学评价：滑块打分、标签选择、文字评价、提交、下一位教师
// @author       JDEY
// @match        https://vpn.jlu.edu.cn/*
// @match        https://ievaluate.jlu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559822/JLU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/559822/JLU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========= 可调参数 ========= */
    const TAG_KEYWORDS = [
        '教学育人',
        '理论联系实际',
        '融入前沿知识',
        '教学方法多样',
        '师生互动良好'
    ];

    const COMMENT_TEMPLATES = [
        '本课程教学目标明确，内容安排合理，教学思路清晰，能够将理论知识与实际问题相结合，对理解相关知识体系和能力提升具有积极作用。',
        '教师教学态度认真，课堂讲解条理清楚，重点突出，课堂氛围较好，对学生学习具有良好的引导作用，整体学习体验较为良好。',
        '课程内容系统完整，讲授逻辑清晰，注重知识应用与能力培养，有助于提升自主学习能力和综合分析问题的能力。',
        '课堂教学组织有序，教学方法较为多样，能够调动学习积极性，对课程核心内容的理解和掌握起到了积极促进作用。'
    ];

    /* ========= 工具函数 ========= */
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function triggerInput(el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /* ========= 1. 设置滑块分数 ========= */
  function fillSliders() {
    const inputs = document.querySelectorAll('.ant-input-number-input');

    const setNativeValue = (element, value) => {
        const valueSetter =
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        valueSetter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    inputs.forEach(input => {
        const max = Number(input.getAttribute('aria-valuemax')) || 20;

        let score;
        if (max === 20) score = rand(17, 19);
        else if (max === 15) score = rand(13, 14);
        else if (max === 10) score = rand(8, 9);
        else score = Math.floor(max * 0.9);

        setNativeValue(input, score);
    });
}



    /* ========= 2. 勾选标签（2–3 个，偏正向） ========= */
    function fillTags() {
        const labels = Array.from(document.querySelectorAll('span, div'))
            .filter(el => TAG_KEYWORDS.includes(el.innerText.trim()));

        const count = rand(2, 3);
        labels.sort(() => 0.5 - Math.random()).slice(0, count).forEach(el => el.click());
    }

    /* ========= 3. 填写文字评价 ========= */
    function fillComment() {
        const textarea = document.querySelector('textarea');
        if (!textarea) return;

        const text = COMMENT_TEMPLATES[rand(0, COMMENT_TEMPLATES.length - 1)];
        textarea.value = text;
        triggerInput(textarea);
    }
     /* ========= 4.提交 ========= */
function clickSubmit() {
    const btn = document.querySelector('button[class*="index__submit"]');
    if (btn) {
        btn.click();
        return true;
    }
    return false;
}
    /* ========= 5.下一位教师 ========= */
    function clickNextTeacher() {
    const buttons = Array.from(document.querySelectorAll('.ant-modal button'));

    const nextBtn = buttons.find(btn =>
        btn.innerText.trim().includes('下一位教师')
    );

    if (nextBtn) {
        nextBtn.click();
        return true;
    }
    return false;
}

    /* ========= 主执行函数 ========= */
    function runAll() {
    // ① 填充分数、标签、评语
    fillSliders();
    fillTags();
    fillComment();

    // ② 延时点击提交
    setTimeout(() => {
        const submitted = clickSubmit();

        if (!submitted) {
            alert('未找到提交按钮，请检查页面');
            return;
        }

        // ③ 等待提交成功弹窗，再点“下一位教师”
        setTimeout(() => {
            const nextClicked = clickNextTeacher();

            if (!nextClicked) {
                alert('提交成功，但未检测到“下一位教师”按钮，请手动确认');
            }
        }, 1200);

    }, 600);
}


    /* ========= 页面按钮 ========= */
    function addButton() {
        const btn = document.createElement('button');
        btn.innerText = '自动填写评价';
        btn.style.position = 'fixed';
        btn.style.right = '20px';
        btn.style.bottom = '40px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 16px';
        btn.style.background = '#4e6ef2';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';

        btn.onclick = runAll;
        document.body.appendChild(btn);
    }

    window.addEventListener('load', addButton);
})();
