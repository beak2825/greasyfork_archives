// ==UserScript==
// @name         厦门大学课程表导出助手-ICS(功能修复版)
// @version      2025-09-15.3
// @description  基于 yangqian 的原版脚本进行修复和功能增强。解决了因教务系统更新导致的失效问题，支持任意节数连上课程, 支持日程提醒配置。
// @author       jader (原作者 pydroid)
// @match        https://jw.xmu.edu.cn/gsapp/sys/wdkbapp/*
// @grant        none
// @license      MIT License
// @namespace    https://greasyfork.org/zh-CN/users/1515284-%E4%BA%A6%E7%91%BE
// @downloadURL https://update.greasyfork.org/scripts/549592/%E5%8E%A6%E9%97%A8%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B-ICS%28%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549592/%E5%8E%A6%E9%97%A8%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B-ICS%28%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================== 配置区域 ==================
    const DEBUG = true;
    const START_DATE = '2025-09-08'; // !!!【重要】请再次确认此日期为开学第一周的周一!!!

    // 【新功能】 在此设置课前提醒，单位为分钟。可以设置多个，例如 [15, 5]
    // 如果不需要提醒，请设置为空数组 []
    const REMINDER_MINUTES = [10];
    // ============================================

    const periodTimes = [
        { jc: 1,  start: [8, 0],  end: [8, 45]  }, { jc: 2,  start: [8, 55], end: [9, 40]  },
        { jc: 3,  start: [10, 10],end: [10, 55] }, { jc: 4,  start: [11, 5], end: [11, 50] },
        { jc: 5,  start: [14, 30],end: [15, 15] }, { jc: 6,  start: [15, 25],end: [16, 10] },
        { jc: 7,  start: [16, 40],end: [17, 25] }, { jc: 8,  start: [17, 35],end: [18, 20] },
        { jc: 9,  start: [19, 10],end: [19, 55] }, { jc: 10, start: [20, 5], end: [20, 50] },
        { jc: 11, start: [21, 0], end: [21, 45] }
    ];

    const log = (message, ...args) => {
        if (DEBUG) console.log(`[课表助手] ${message}`, ...args);
    };

    const waitUntilElementPresent = (cssLocator, callback) => {
        log(`脚本启动，正在等待课表元素 '${cssLocator}' 加载...`);
        const checkExist = setInterval(() => {
            if (document.querySelector(cssLocator)) {
                clearInterval(checkExist);
                log(`课表元素已找到，准备添加 '导出ICS' 按钮。`);
                callback();
                return;
            }
        }, 100);
    };

    waitUntilElementPresent(".arrage", () => {
        const tab = document.getElementById("xsXx")?.firstElementChild;
        if (!tab) { console.error("[课表助手] 无法找到按钮的挂载点 '#xsXx'。"); return; }
        if (tab.querySelector('.export-ics-btn')) return;
        const getButton = document.createElement('a');
        getButton.innerHTML = "导出ICS";
        getButton.classList.add("bh-btn-default", "bh-btn", "export-ics-btn");
        tab.appendChild(getButton);
        getButton.addEventListener('click', main);
        log("'导出ICS' 按钮已成功添加到页面。");
    });

    function main() {
        log("===== 开始执行课表导出主程序 =====");
        const HEADERS = [
            "BEGIN:VCALENDAR", "METHOD:PUBLISH", "VERSION:2.0",
            "X-WR-CALNAME:XMU课程表", "X-WR-TIMEZONE:Asia/Shanghai", "CALSCALE:GREGORIAN",
            "BEGIN:VTIMEZONE", "TZID:Asia/Shanghai", "END:VTIMEZONE"
        ];
        const FOOTERS = ["END:VCALENDAR"];

        const formatTime = (timeArray) => `${timeArray[0].toString().padStart(2, '0')}${timeArray[1].toString().padStart(2, '0')}00`;
        const getStartTime = (startJc) => periodTimes[startJc - 1]?.start ? formatTime(periodTimes[startJc - 1].start) : null;
        const getEndTime = (startJc, duration) => {
            const endJc = startJc + duration - 1;
            return periodTimes[endJc - 1]?.end ? formatTime(periodTimes[endJc - 1].end) : null;
        };
        const getFirstDate = (day, week) => {
            const startDate = new Date(START_DATE);
            startDate.setDate(startDate.getDate() + (week - 1) * 7 + (day - 1));
            return `${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}`;
        };

        const courseBlocks = document.querySelectorAll(".arrage");
        log(`在页面上找到了 ${courseBlocks.length} 个 <div class="arrage"> 课程块，现在开始筛选并处理...`);
        const classes = [];

        for (const block of courseBlocks) {
            const td = block.closest('td');
            if (!td || td.style.display === 'none') {
                continue;
            }

            const jcVal = td.getAttribute("jc");
            const xqVal = td.getAttribute("xq");
            const rowspanVal = td.getAttribute("rowspan") || "1";

            if (DEBUG) console.groupCollapsed(`[处理课程] 星期: ${xqVal}, 起始节次: ${jcVal}, 跨度: ${rowspanVal}节`);

            try {
                const courseInfoDivs = block.querySelectorAll('div');
                if (courseInfoDivs.length < 4) { log("信息不全，跳过。"); continue; }

                const weeksText = courseInfoDivs[0]?.textContent.trim();
                const summary = courseInfoDivs[1]?.textContent.replace(/\(.*?\)/g, '').trim();
                const description = courseInfoDivs[2]?.textContent.trim();
                const location = courseInfoDivs[3]?.textContent.replace(/（.*?）/g, '').trim();

                if (!weeksText || !summary) { log("缺少周次或课程名，跳过。"); continue; }

                const weeksMatch = weeksText.match(/(\d+)-(\d+)(单|双)?周/);
                if (!weeksMatch) { log("周次格式不匹配，跳过。"); continue; }

                const [, startWeekStr, endWeekStr, weekType] = weeksMatch;
                const startWeek = parseInt(startWeekStr, 10), endWeek = parseInt(endWeekStr, 10);

                let weekCount, interval;
                if (weekType === "单" || weekType === "双") {
                    let count = 0; const isOdd = weekType === "单";
                    for (let i = startWeek; i <= endWeek; i++) if ((isOdd && i % 2 !== 0) || (!isOdd && i % 2 === 0)) count++;
                    weekCount = count; interval = ";INTERVAL=2";
                } else {
                    weekCount = endWeek - startWeek + 1; interval = "";
                }
                if(weekCount <= 0) { log("计算出的上课周数为0，跳过。"); continue; }

                const jc = parseInt(jcVal, 10), day = parseInt(xqVal, 10), duration = parseInt(rowspanVal, 10);
                let firstWeek = startWeek;
                if ((weekType === '单' && startWeek % 2 === 0) || (weekType === '双' && startWeek % 2 !== 0)) {
                    firstWeek = startWeek + 1;
                }

                const date = getFirstDate(day, firstWeek);
                const start = getStartTime(jc);
                const end = getEndTime(jc, duration);
                if (!start || !end) { log(`无法计算时间(jc:${jc}, dur:${duration})，跳过。`); continue; }

                // --- 生成提醒组件 ---
                const alarms = REMINDER_MINUTES.map(minute => {
                    return [
                        "BEGIN:VALARM",
                        "ACTION:DISPLAY",
                        `DESCRIPTION:${summary} 即将开始`,
                        `TRIGGER:-PT${minute}M`, // PT = Period of Time, M = Minutes
                        "END:VALARM"
                    ].join('\n');
                }).join('\n');
                if (alarms) log(`已为本课程生成 ${REMINDER_MINUTES.length} 个提醒。`);
                // --- 提醒组件结束 ---

                const eventParts = [
                    "BEGIN:VEVENT",
                    `SUMMARY:${summary}`,
                    `DESCRIPTION:${description}`,
                    `DTSTART;TZID=Asia/Shanghai:${date}T${start}`,
                    `DTEND;TZID=Asia/Shanghai:${date}T${end}`,
                    `LOCATION:${location}`,
                    `RRULE:FREQ=WEEKLY;COUNT=${weekCount}${interval}`
                ];

                if(alarms) {
                    eventParts.push(alarms);
                }

                eventParts.push("END:VEVENT");
                
                classes.push(eventParts.join('\n'));
                log("成功生成 VEVENT 事件。");

            } catch (error) {
                console.error(`[课表助手] 处理课程块时发生错误:`, error, block);
            } finally {
                if (DEBUG) console.groupEnd();
            }
        }

        log(`===== 处理完成，共生成了 ${classes.length} 个课程事件 =====`);

        if (classes.length === 0) {
            alert("未找到任何有效的课程信息！请按 F12 查看控制台中的日志以排查问题。");
            return;
        }

        const textContent = [...HEADERS, ...classes, ...FOOTERS].join('\n');
        const blob = new Blob([textContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url; a.download = `schedule_${new Date().toISOString().slice(0, 10)}.ics`;
        document.body.appendChild(a); a.click();
        URL.revokeObjectURL(url); document.body.removeChild(a);
        log("ICS文件已生成并触发下载。");
    }
})();