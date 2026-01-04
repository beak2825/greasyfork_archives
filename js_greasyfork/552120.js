// ==UserScript==
// @name         禅道日志导出(OpenSource V18.13)
// @namespace    http://tampermonkey.net/
// @version      2025-10-10
// @description  禅道日志导出
// @author       You
// @match        *://*/effort-my-all*.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552120/%E7%A6%85%E9%81%93%E6%97%A5%E5%BF%97%E5%AF%BC%E5%87%BA%28OpenSource%20V1813%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552120/%E7%A6%85%E9%81%93%E6%97%A5%E5%BF%97%E5%AF%BC%E5%87%BA%28OpenSource%20V1813%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var fieldGetters = {
        id: function (row) {
            return $(row).find('.c-id').text().trim();
        },
        date: function (row) {
            return $(row).find('.c-date').text().trim();
        },
        project: function (row) {
            return $(row).find('.c-project').text().trim();
        },
        content: function (row) {
            return $(row).find('.c-work').text().trim();
        },
        timeSpent: function (row) {
            // 删除字母 h
            return $(row).find('.c-consumed').text().trim().replace('h', '');
        },
        remaining: function (row) {
            // 删除字母 h
            return $(row).find('.c-left').text().trim().replace('h', '');
        }
    }

    /**
     * 导出excel
     * @param startDateStr
     * @param endDateStr
     * @param selectedFields
     */
    function exportLogs(startDateStr, endDateStr, selectedFields, workHoursPerDay) {
        var rowEleList = $("#mainContent table tbody tr");
        var startDate = new Date(startDateStr);
        var endDate = new Date(endDateStr);
        var exportData = [];
        rowEleList.each(function () {
            var rowDateStr = fieldGetters.date(this);
            var rowDate = new Date(rowDateStr);
            if (rowDate >= startDate && rowDate <= endDate) {
                var rowData = {};
                selectedFields.forEach(function (field) {
                    if (fieldGetters[field]) {
                        rowData[field] = fieldGetters[field](this);
                    }
                }, this);
                exportData.push(rowData);
            }
        })
        if (exportData.length === 0) {
            alert("所选时间范围内无日志数据");
            return;
        }
        // 生成CSV内容(第一个sheet为清单，第二个按天为单位的清单)
        var csvContent = "";
        // 添加表头
        csvContent += selectedFields.map(f => f.toUpperCase()).join(",") + "\n";
        // 添加数据行
        exportData.forEach(function (data) {
            var row = selectedFields.map(function (field) {
                return `"${data[field] || ''}"`; // 使用双引号包裹，防止逗号问题
            }).join(",");
            csvContent += row + "\n";
        });

        // 按天汇总以及每天加班时长
        var dailySummary = {};
        var dailyOvertime = {};
        exportData.forEach(function (data) {
            var date = data.date;
            var timeSpent = parseFloat(data.timeSpent) || 0;
            if (!dailySummary[date]) {
                dailySummary[date] = 0;
            }
            dailySummary[date] += timeSpent;
            // 计算加班时长
            var overtime = dailySummary[date] - parseInt(workHoursPerDay);
            dailyOvertime[date] = overtime > 0 ? overtime : 0;
        });
        csvContent += "\n\n日期,总耗时(h),加班时长(h)\n";
        for (var date in dailySummary) {
            csvContent += `${date},${dailySummary[date]},${dailyOvertime[date]}\n`;
        }

        // 创建Blob对象并触发下载
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        var fileName = `日志导出_${startDateStr}_to_${endDateStr}.csv`;
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * 初始化导出设置面板
     * 时间范围：开始日期、结束日期，默认上一季度
     * 导出字段：ID、日期、项目、内容、耗时、剩余
     * 其他：每天工作时长
     */
    function initExportSettingPanel() {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();
        var startMonth, startYear, endMonth, endYear;

        if (currentMonth < 3) {
            startMonth = 10; // 十一月
            startYear = currentYear - 1;
            endMonth = 12; // 十二月
            endYear = currentYear - 1;
        } else if (currentMonth < 6) {
            startMonth = 1; // 一月
            startYear = currentYear;
            endMonth = 3; // 三月
            endYear = currentYear;
        } else if (currentMonth < 9) {
            startMonth = 4; // 四月
            startYear = currentYear;
            endMonth = 6; // 六月
            endYear = currentYear;
        } else {
            startMonth = 7; // 七月
            startYear = currentYear;
            endMonth = 9;
            endYear = currentYear;
        }

        var defaultStartDate = new Date(startYear, startMonth - 1, 1);
        var defaultEndDate = new Date(endYear, endMonth, 0); // 当月最后一天

        var formatDate = function (date) {
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return `${date.getFullYear()}-${month}-${day}`;
        }
        var defaultStartDateStr = formatDate(defaultStartDate);
        var defaultEndDateStr = formatDate(defaultEndDate);
        var panelHtml = `
    <div id="exportSettingPanel" style="position:fixed; top:50px; right:0; transform:translateX(-50%); background-color:#fff; border:1px solid #ccc; padding:20px; z-index:1000;">
        <h3>导出设置</h3>
        <div>
            <label>开始日期: <input type="date" id="startDate"  /></label>
            <label>结束日期: <input type="date" id="endDate"/></label>
        </div>
        <div>
            <h4>导出字段</h4>
            <label><input type="checkbox" class="exportField" value="id" checked> ID</label>
            <label><input type="checkbox" class="exportField" value="date" checked> 日期</label>
            <label><input type="checkbox" class="exportField" value="project" checked> 项目</label>
            <label><input type="checkbox" class="exportField" value="content" checked> 内容</label>
            <label><input type="checkbox" class="exportField" value="timeSpent" checked> 耗时</label>
            <label><input type="checkbox" class="exportField" value="remaining" checked> 剩余</label>
        </div>
        <div>
            <h4>其他</h4>
            <label>每天工作时长: <input type="number" id="workHoursPerDay" value="7" min="1" style="width:50px;"> 小时</label>
        </div>

        <button id="exportBtn">导出</button>
        <button id="cancelBtn">取消</button>
    </div>
    `;
        $("body").append(panelHtml);
        $("#startDate").val(defaultStartDateStr);
        $("#endDate").val(defaultEndDateStr);

        $("#exportBtn").on("click", function () {
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            var workHoursPerDay = parseInt($("#workHoursPerDay").val(), 10) || 7;
            var selectedFields = [];
            $(".exportField:checked").each(function () {
                selectedFields.push($(this).val());
            });
            exportLogs(startDate, endDate, selectedFields, workHoursPerDay);
            $("#exportSettingPanel").hide();
        });
    }


    initExportSettingPanel();
})();