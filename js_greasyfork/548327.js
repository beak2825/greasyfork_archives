// ==UserScript==
// @name         HIT招聘会场地筛选
// @namespace    https://greasyfork.org/zh-CN/scripts/548327
// @version      V1.6
// @description  在学校场地使用情况页面，增加招聘会筛选及导出csv功能
// @match        *://space.hit.edu.cn/cdyygl/xgcdyy_01_01/cdsyqk
// @author       KCl
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/548327/HIT%E6%8B%9B%E8%81%98%E4%BC%9A%E5%9C%BA%E5%9C%B0%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548327/HIT%E6%8B%9B%E8%81%98%E4%BC%9A%E5%9C%BA%E5%9C%B0%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 包含关键词列表（命中任意一个算匹配）
    const KEYWORDS = [
        "招", "宣讲", "双选", "集团", "公司", "企", "人才", "就业", "职",
        "河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建",
        "江西","山东","河南","湖北","湖南","广东","海南","四川","贵州",
        "云南","陕西","甘肃","青海","台湾","内蒙","广西","西藏","宁夏",
        "新疆","北京","天津","上海","重庆","香港","澳门","广州","深圳",
        "成都","杭州","武汉","西安","苏州","太原","青岛","南京","无锡"
    ];

    // 排除关键词列表（命中任意一个算不匹配，即便包含了 KEYWORDS 也排除）
    const EXCLUDE = [
        "老年大学","琴社","上课","开题","组会","新生","学生会"
    ];

    function addFilterUI() {
        const form = document.querySelector(".zhxy-form.zhxy-form-search-part form");
        if (!form || document.getElementById("recruit-filter-box")) return;

        const div = document.createElement("div");
        div.className = "el-form-item el-form-item--mini";
        div.id = "recruit-filter-box";
        div.style.marginLeft = "10px";
        div.innerHTML = `
          <label class="el-form-item__label" style="width: 116px;">
            <span class="zhxy-form-label">筛选类型</span>
          </label>
          <div class="el-form-item__content">
            <label><input type="radio" name="recruitFilter" value="all" checked> 全部</label>
            <label style="margin-left:10px;"><input type="radio" name="recruitFilter" value="recruit"> 招聘会</label>
            <button id="export-csv-btn" type="button" style="margin-left:15px;">导出 CSV</button>
          </div>
        `;
        form.appendChild(div);

        div.querySelectorAll("input[name='recruitFilter']").forEach(radio => {
            radio.addEventListener("change", applyFilter);
        });

        document.getElementById("export-csv-btn").addEventListener("click", exportCSV);
    }

    function applyFilter() {
        const mode = document.querySelector("input[name='recruitFilter']:checked").value;
        const rows = document.querySelectorAll(".el-table__body tbody tr.el-table__row");

        rows.forEach(row => {
            if (mode === "all") {
                row.style.display = "";
                row.querySelectorAll("ul.custom-cdsyqk-table-td li").forEach(li => li.style.display = "");
                return;
            }

            let hasMatch = false;
            row.querySelectorAll("ul.custom-cdsyqk-table-td li").forEach(li => {
                const text = li.querySelector("p:last-child")?.textContent.trim() || "";
                const includeHit = KEYWORDS.some(k => text.includes(k));
                const excludeHit = EXCLUDE.some(k => text.includes(k));

                if (includeHit && !excludeHit) {
                    li.style.display = "";
                    hasMatch = true;
                } else {
                    li.style.display = "none";
                }
            });
            row.style.display = hasMatch ? "" : "none";
        });
    }

    function exportCSV() {
        const rows = document.querySelectorAll(".el-table__body tbody tr.el-table__row");
        let data = [["星期", "开始时间", "结束时间", "地点", "名称"]];  // 表头

        rows.forEach(row => {
            if (row.style.display === "none") return;

            // 场地名称 + 楼宇
            const place = row.querySelector("td.el-table_1_column_1 .cdsygl-td-text-box")?.textContent.trim() || "";
            const building = row.querySelector("td.el-table_1_column_2 .cdsygl-td-text-box")?.textContent.trim() || "";
            const location = building + " " + place;

            // 遍历每一天
            row.querySelectorAll("td").forEach((td, idx) => {
                const dayHeader = document.querySelector(`.el-table__header th.el-table_1_column_${idx+1} .custom-cdsyqk-table-header p:nth-child(1)`)?.textContent.trim() || "";
                td.querySelectorAll("ul.custom-cdsyqk-table-td li").forEach(li => {
                    if (li.style.display === "none") return;

                    const timeText = li.querySelector("p:first-child")?.textContent.trim() || "";
                    const nameText = li.querySelector("p:last-child")?.textContent.trim() || "";

                    // 时间拆分
                    let [start, end] = timeText.split("-");
                    start = start || "";
                    end = end || "";

                    data.push([dayHeader, start, end, location, nameText]);
                });
            });
        });

        // 转 CSV
        const csv = data.map(row => row.map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "招聘会记录.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    // 定时检测，直到表单出现
    const timer = setInterval(() => {
        if (document.querySelector(".zhxy-form.zhxy-form-search-part form")) {
            addFilterUI();
            clearInterval(timer);
        }
    }, 500);

})();

