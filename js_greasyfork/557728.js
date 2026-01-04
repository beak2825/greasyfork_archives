// ==UserScript==
// @name         Jenkins Select Default Option & Table Sort (高亮关键字行+左上角环境标签)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  根据域名默认选择 Jenkins 分支下拉选项，并将关键字行置顶且高亮，左上角显示环境标签
// @match        https://jenkins-dev.dachensky.com/*
// @match        https://jenkins-pro.dachensky.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557728/Jenkins%20Select%20Default%20Option%20%20Table%20Sort%20%28%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E5%AD%97%E8%A1%8C%2B%E5%B7%A6%E4%B8%8A%E8%A7%92%E7%8E%AF%E5%A2%83%E6%A0%87%E7%AD%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557728/Jenkins%20Select%20Default%20Option%20%20Table%20Sort%20%28%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E5%AD%97%E8%A1%8C%2B%E5%B7%A6%E4%B8%8A%E8%A7%92%E7%8E%AF%E5%A2%83%E6%A0%87%E7%AD%BE%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加高亮样式和环境标签样式
    function addHighlightStyle() {
        if (document.getElementById('copilot-highlight-style')) return;
        const style = document.createElement('style');
        style.id = 'copilot-highlight-style';
        style.innerHTML = `
    .jenkins-table > tbody > tr.copilot-highlight-row > td {
        background-color: #fff9f7 !important;
    }
    .copilot-env-tag {
        position: fixed;
        top: 20px;
        left: 500px;
        z-index: 9999;
        padding: 6px 18px;
        border-radius: 18px;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        background: #ffb980;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        letter-spacing: 2px;
        user-select: none;
        pointer-events: none;
    }
    .copilot-env-tag.pre { background: #ff7979; }
    `;
        document.head.appendChild(style);
    }

    // 左上角环境标签
    function addEnvTag() {
        if (document.getElementById('copilot-env-tag')) return;
        let env = '';
        let envClass = '';
        if (location.hostname === 'jenkins-dev.dachensky.com') {
            env = 'DEV环境';
            envClass = '';
        } else if (location.hostname === 'jenkins-pro.dachensky.com') {
            env = 'PRE环境';
            envClass = 'pre';
        }
        if (env) {
            const tag = document.createElement('div');
            tag.id = 'copilot-env-tag';
            tag.className = `copilot-env-tag${envClass ? ' ' + envClass : ''}`;
            tag.innerText = env;
            document.body.appendChild(tag);
        }
    }

    // 默认选择下拉选项
    function selectDefaultOption() {
        const select = document.getElementById('gitParameterSelect');
        if (!select) return;

        // 如果 select 当前已有值，则不处理
        if (select.value) return;

        // 根据域名设置默认值
        let defaultValue = '';
        if (location.hostname === 'jenkins-dev.dachensky.com') {
            defaultValue = 'dev';
        } else if (location.hostname === 'jenkins-pro.dachensky.com') {
            defaultValue = 'pre';
        }

        // 如果有默认值，设置 select 的值
        if (defaultValue) {
            select.value = defaultValue;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // 表格行排序并高亮关键字行
    function sortTableRows() {
        const keywords = [
            'qlchat-admin', 'qlchat-admin-front', 'qlchat-app-server', 'qlchat-h5-server', 'qlchat-task', 'qlchat-wap',
            'qlchat-common-dubbo-provider', 'qlchat-common-service', 'qlchat-ops-weapp-server', 'qlchat-bigdata-feedback-gateway',
            'qlchat-censor', 'qlchat-speak', 'qlchat-comment', 'qlchat-coupon-server', 'qlchat-crm', 'qlchat-search-server',
            'qlchat-unity-server', 'qlchat-kaifang', 'qlchat-payment'
        ];
        const table = document.getElementById('projectstatus');
        if (!table) return;
        const tbody = table.tBodies[0] || table;
        const rows = Array.from(tbody.querySelectorAll('tr[id]'));

        // 按关键字分组并高亮
        const matchRows = [];
        const otherRows = [];
        rows.forEach(row => {
            row.classList.remove('copilot-highlight-row'); // 先移除高亮
            if (keywords.some(keyword => row.id.includes(keyword))) {
                matchRows.push(row);
                row.classList.add('copilot-highlight-row'); // 添加高亮
            } else {
                otherRows.push(row);
            }
        });

        // matchRows 按 keywords 顺序排序
        matchRows.sort((a, b) => {
            const aIndex = keywords.findIndex(keyword => a.id.includes(keyword));
            const bIndex = keywords.findIndex(keyword => b.id.includes(keyword));
            return aIndex - bIndex;
        });

        // 重新排序
        const allRows = matchRows.concat(otherRows);
        allRows.forEach(row => tbody.appendChild(row));
    }

    // 监听下拉框的出现（全局监听，防抖）
    function observeSelect() {
        let timer = null;
        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(selectDefaultOption, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 监听表格变化（只监听表格，防抖，排序后断开监听）
    function observeTable() {
        const table = document.getElementById('projectstatus');
        if (!table) return;
        const tbody = table.tBodies[0] || table;
        let timer = null;
        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                sortTableRows();
                observer.disconnect(); // 排序后断开监听
            }, 100);
        });
        observer.observe(tbody, { childList: true, subtree: true });
    }

    // 监听 .jenkins-select__input 的值变化
    function observeJenkinsSelectInput() {
        const selects = document.querySelectorAll('.jenkins-select__input');
        if (!selects.length) return;
        const select = selects[1];
        select.addEventListener('change', function () {
            if (select.value === 'prod') {
                const gitSelect = document.getElementById('gitParameterSelect');
                if (gitSelect) {
                    gitSelect.value = 'master';
                    gitSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
    }

    // 初始执行
    addHighlightStyle();
    addEnvTag();
    selectDefaultOption();
    sortTableRows();
    observeSelect();
    observeTable();
    observeJenkinsSelectInput();
})();