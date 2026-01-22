// ==UserScript==
// @name         山西农业大学教评自动评价
// @namespace    https://jwglxt.sxau.edu.cn/
// @version      2026-01-21
// @description  山西农业大学教务系统自动教评脚本
// @author       Star0228
// @match        https://jwglxt.sxau.edu.cn/jsxsd/xspj/xspj_list.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sxau.edu.cn
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563492/%E5%B1%B1%E8%A5%BF%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E8%AF%84%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/563492/%E5%B1%B1%E8%A5%BF%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E8%AF%84%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SPECIAL_TEXT = '教师注重课堂管理，善于维持课堂秩序';

    /* ================= 样式 ================= */
    GM_addStyle(`
        #tm-auto-submit-btn {
            position: fixed;
            right: 30px;
            bottom: 40px;
            z-index: 99999;
            padding: 12px 18px;
            background: #d4380d;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        #tm-auto-submit-btn:hover {
            background: #ad2102;
        }
    `);

    /* ================= 自动填写 ================= */
    function autoEvaluate() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length < 2) return;

            const title = tds[0].innerText.trim();
            const radios = tds[1].querySelectorAll('input[type="radio"]');
            if (radios.length === 0) return;

            if (title.includes(SPECIAL_TEXT)) {
                radios[1]?.click(); // 良好
            } else {
                radios[0]?.click(); // 优秀
            }
        });

        const textarea = document.querySelector('#jynr');
        if (textarea && textarea.value.trim() === '') {
            textarea.value = '无';
        }
    }

    /* ================= 提交 ================= */
    function submitForm() {
        const submitBtn = document.querySelector('input[name="tj"]');
        if (!submitBtn) {
            alert('未找到提交按钮，请确认页面是否完整加载。');
            return;
        }
        submitBtn.click();
    }

    /* ================= 总入口 ================= */
    function runAll() {
        const ok = confirm(
            '将自动完成以下操作：\n\n' +
            '1. 除“课堂管理”外全部选“优秀”\n' +
            '2. “课堂管理”选“良好”\n' +
            '3. 主观题填写“无”\n' +
            '4. 自动提交（提交后不可修改）\n\n' +
            '是否继续？'
        );

        if (!ok) return;

        autoEvaluate();

        // 给页面计分与校验逻辑留时间
        setTimeout(submitForm, 500);
    }

    /* ================= 按钮注入 ================= */
    function addButton() {
        if (document.getElementById('tm-auto-submit-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'tm-auto-submit-btn';
        btn.innerText = '一键填写并提交';
        btn.onclick = runAll;

        document.body.appendChild(btn);
    }

    setTimeout(addButton, 1000);

})();