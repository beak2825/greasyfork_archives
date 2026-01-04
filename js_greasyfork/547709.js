// ==UserScript==
// @name         Bangumi 放送星期自动填写
// @namespace    https://github.com/stay206
// @version      1.0
// @description  根据放送开始日期自动计算并填写放送星期
// @author       墨云(Sumora）
// @match        https://bangumi.tv/new_subject/*
// @match        https://bgm.tv/new_subject/*
// @match        https://chii.in/new_subject/*
// @match        https://bangumi.tv/subject/*/edit_detail
// @match        https://bgm.tv/subject/*/edit_detail
// @match        https://chii.in/subject/*/edit_detail
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547709/Bangumi%20%E6%94%BE%E9%80%81%E6%98%9F%E6%9C%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/547709/Bangumi%20%E6%94%BE%E9%80%81%E6%98%9F%E6%9C%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const weekdayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    function parseDate(dateStr) {
        //  YYYY年MM月DD日 格式
        const chineseMatch = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (chineseMatch) {
            const year = parseInt(chineseMatch[1], 10);
            const month = parseInt(chineseMatch[2], 10) - 1;
            const day = parseInt(chineseMatch[3], 10);
            return new Date(year, month, day);
        }

        //  YYYY-MM-DD
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date;
        }

        return null;
    }

    function updateWeekday() {
        const startDateInput = document.querySelector('input[tabindex="1024"][value="放送开始"]');
        if (!startDateInput) return;

        const datePropInput = startDateInput.nextElementSibling;
        const dateValue = datePropInput.value.trim();

        const weekdayInput = document.querySelector('input[tabindex="1024"][value="放送星期"]');
        if (!weekdayInput) return;

        const weekdayPropInput = weekdayInput.nextElementSibling;

        if (!dateValue) {
            weekdayPropInput.value = '';
            return;
        }

        const date = parseDate(dateValue);
        if (!date) {
            // 日期无效，清空放送星期
            weekdayPropInput.value = '';
            return;
        }

        const dayOfWeek = date.getDay();
        const weekday = weekdayMap[dayOfWeek];

        weekdayPropInput.value = weekday;
    }

    // 监听输入框变化
    const startDatePropInput = document.querySelector('input[tabindex="1024"][value="放送开始"]').nextElementSibling;
    if (startDatePropInput) {
        startDatePropInput.addEventListener('input', updateWeekday);
        // 在页面加载时执行一次，以防已经有值
        updateWeekday();
    }
})();