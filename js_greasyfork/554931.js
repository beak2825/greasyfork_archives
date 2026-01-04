// ==UserScript==
// @name         ECUST 研究生自动评教助手
// @namespace    https://bestzyq.cn/
// @version      1.6
// @description  自动将所有评分下拉框选为最高分并填写评语、提交
// @match        *://graduate.ecust.edu.cn/PostGraduate/WitMis_CourseJxzlpjAddXF.aspx*
// @icon         https://graduate.ecust.edu.cn/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554931/ECUST%20%E7%A0%94%E7%A9%B6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554931/ECUST%20%E7%A0%94%E7%A9%B6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoEvaluate() {
        // 找到所有下拉评分框
        const selects = document.querySelectorAll('select[name*="ddl_score"]');
        if (selects.length === 0) {
            alert("未检测到评分下拉框，请确认页面已加载。");
            return;
        }

        selects.forEach(sel => {
            // 找出最大值选项
            let maxVal = -Infinity;
            let bestOption = null;
            sel.querySelectorAll('option').forEach(opt => {
                const val = parseFloat(opt.value);
                if (!isNaN(val) && val > maxVal) {
                    maxVal = val;
                    bestOption = opt;
                }
            });
            if (bestOption) sel.value = bestOption.value;
        });

        // 自动填写评语
        //const textarea = document.querySelector('textarea');
        //if (textarea && textarea.value.trim() === '') {
        //    textarea.value = '老师讲课认真负责，内容充实，受益匪浅。';
        //}

        // 自动提交
        const submitBtn = document.querySelector('input[type=submit], button[type=submit], input[id*=btnSubmit]');
        if (submitBtn) {
            submitBtn.click();
        } else {
            alert("已完成自动评分，请手动点击提交。");
        }
    }

    // 添加一个悬浮按钮
    function addButton() {
        const btn = document.createElement('button');
        btn.textContent = "自动评教";
        Object.assign(btn.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        });
        btn.onclick = autoEvaluate;
        document.body.appendChild(btn);
    }

    addButton();
})();
