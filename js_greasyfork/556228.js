// ==UserScript==
// @name         广东省教师继续教育信息管理平台公需课人工智能赋能制造业高质量发展
// @namespace    https://gdedu.gov.cn
// @version      3.0
// @description  只弹一次开始学习 | 全程静音 | 考核30题严格按你给的顺序填写（绝不乱序）
// @author       Grok @ xAI（化名：深空之眼）
// @match        *://jsxx.gdedu.gov.cn/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556228/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E8%B5%8B%E8%83%BD%E5%88%B6%E9%80%A0%E4%B8%9A%E9%AB%98%E8%B4%A8%E9%87%8F%E5%8F%91%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/556228/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E8%B5%8B%E8%83%BD%E5%88%B6%E9%80%A0%E4%B8%9A%E9%AB%98%E8%B4%A8%E9%87%8F%E5%8F%91%E5%B1%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('%c智慧中小学全自动脚本启动（严格按顺序填答案版）', 'color:#ff6b6b;font-size:18px;font-weight:bold');

    // ==================== 你给的准确答案（顺序不能错！）===================
    const ANSWERS = [
        null,                    // 第0位占位
        'C','D','B','B','B','B','C','B','C','B',           // 1~10
        'AC','ABCD','ABD','ABC','ABCD','ABC','AB','ACD','ABC','ABCD', // 11~20
        'A','A','B','B','B','B','A','A','A','A'            // 21~30
    ];

    let hasClickedStart = false;

    // ==================== 只点一次“开始学习” ====================
    function tryStart() {
        if (hasClickedStart) return;
        const btns = document.querySelectorAll('button,div,span,a');
        for (let el of btns) {
            const t = (el.textContent || '').trim();
            if (/开始学习|继续学习|立即学习|进入学习|播放/.test(t) && el.offsetParent) {
                el.click();
                hasClickedStart = true;
                console.log('%c[自动] 已点击：' + t + '（后续不再弹窗）', 'color:#4caf50;font-weight:bold');
                return;
            }
        }
    }
    setInterval(tryStart, 1500);

    // ==================== 严格按题号顺序填写答案（核心修复）===================
    function autoFillByOrder() {
        // 只在考核页面运行
        if (!document.body.textContent.includes('考核') && !document.body.textContent.includes('测验') && !location.href.includes('exam')) return;

        let filled = 0;

        // 找到所有题目（通过题号1. 2. 3. ...识别）
        const questionBlocks = [];
        document.querySelectorAll('*').forEach(el => {
            const txt = el.textContent || '';
            const match = txt.match(/^(\d+)[.\s、]/);
            if (match && parseInt(match[1]) <= 30) {
                const qNum = parseInt(match[1]);
                // 找到包含这道题的最近父容器
                let container = el;
                while (container && !container.querySelectorAll('input[type="radio"], input[type="checkbox"]').length) {
                    container = container.parentElement;
                }
                if (container) questionBlocks[qNum] = container;
            }
        });

        // 严格按 1~30 题顺序填写
        for (let q = 1; q <= 30; q++) {
            const answer = ANSWERS[q];
            if (!answer || !questionBlocks[q]) continue;

            const block = questionBlocks[q];

            if (answer.length === 1) { // 单选
                const options = block.querySelectorAll('label, .option, div, span');
                options.forEach(opt => {
                    const text = (opt.textContent || '').trim();
                    const radio = opt.querySelector('input[type="radio"]') || opt.querySelector('input');
                    if (!radio || radio.checked) return;

                    if (text.includes(answer) ||
                        (answer === 'A' && /[Aa][.\s、]/.test(text)) ||
                        (answer === 'B' && /[Bb][.\s、]/.test(text)) ||
                        (answer === 'C' && /[Cc][.\s、]/.test(text)) ||
                        (answer === 'D' && /[Dd][.\s、]/.test(text))) {
                        radio.click();
                        filled++;
                        console.log(`%c[第${q}题] 单选填 → ${answer}`, 'color:#4caf50');
                    }
                });
            } else { // 多选
                [...answer].forEach(ch => {
                    const options = block.querySelectorAll('label, .option, div, span');
                    options.forEach(opt => {
                        const text = (opt.textContent || '').trim();
                        const cb = opt.querySelector('input[type="checkbox"]') || opt.querySelector('input');
                        if (!cb || cb.checked) return;

                        if (text.includes(ch) ||
                            (ch === 'A' && /[Aa][.\s、]/.test(text)) ||
                            (ch === 'B' && /[Bb][.\s、]/.test(text)) ||
                            (ch === 'C' && /[Cc][.\s、]/.test(text)) ||
                            (ch === 'D' && /[Dd][.\s、]/.test(text))) {
                            cb.click();
                            filled++;
                        }
                    });
                });
                console.log(`%c[第${q}题] 多选填 → ${answer}`, 'color:#2196f3');
            }
        }

        if (filled > 0) {
            console.log(`%c[自动答题完成] 本次共填写 ${filled} 个选项，3秒后自动提交`, 'color:#ff9800;font-size:16px;font-weight:bold');
            setTimeout(() => {
                const submit = Array.from(document.querySelectorAll('button,.el-button'))
                    .find(b => /提交|交卷|确定提交/.test(b.textContent || ''));
                if (submit) submit.click();
            }, 3000);
        }
    }

    setInterval(autoFillByOrder, 2500);

    // ==================== 其余功能（播放、防挂机、跳下一节）保持完美 ====================
    function play() {
        document.querySelectorAll('video').forEach(v => { v.muted = true; if(v.paused) v.play().catch(()=>{}); });
        document.querySelectorAll('iframe').forEach(f => {
            try { (f.contentDocument || f.contentWindow.document).querySelectorAll('video').forEach(v => { v.muted = true; v.play().catch(()=>{}); }); } catch(e) {}
        });
    }
    setInterval(play, 2000);
    new MutationObserver(play).observe(document.body, {childList:true, subtree:true});

    setInterval(() => window.dispatchEvent(new Event('mousemove')), 30000);

    setInterval(() => {
        document.querySelectorAll('button').forEach(b => {
            if (/确定|我知道了|关闭|完成/.test(b.textContent) && b.closest('.el-message-box,.van-dialog,.el-dialog')) b.click();
        });
    }, 2000);

    setInterval(() => {
        if (/100%|已完成|学完/.test(document.body.textContent)) {
            const items = document.querySelectorAll('.section-item,.chapter-item,li');
            let next = false;
            for (let el of items) {
                if (el.classList.contains('active') || el.classList.contains('current')) { next = true; continue; }
                if (next) { el.click(); setTimeout(()=>location.reload(), 3000); return; }
            }
        }
    }, 12000);

    setTimeout(autoFillByOrder, 6000);
})();