// ==UserScript==
// @name         WeeklyReport
// @namespace    vnpt-weekly-report
// @version      2026-01-27
// @description  Weekly report helper + task deadline monitor (overdue + near due)
// @author       You
// @match        https://*.cds.hcmict.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hcmict.io
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      script.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564201/WeeklyReport.user.js
// @updateURL https://update.greasyfork.org/scripts/564201/WeeklyReport.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*********************************************************
   * CONFIG
   *********************************************************/
    const CONFIG = {
        API_URL: "https://api_cds.hcmict.io/api",
        GAS_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbwM_k5QC2c9EWm1A58iJQYL8cz80R_pjROtH2xFSgHlvAcaQWYZ-SfiKuQXmTSsN4e0/exec",
        BOARD_ID: 257,
        UI_INIT_DELAY_MS: 4000,
        TASK_NOTIFY_TIMEOUT_MS: 10000,
        XLSX_CDN: "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
    };


    const USER_IDS = [
        {
            user_id: 876,
            username: 'ducct.bdg',
            full_name: 'Cấn Trọng Đức',
            display_name: 'Cấn Trọng Đức (ducct.bdg)'
        },
        {
            user_id: 1081,
            username: 'nguyenqhuy.hcm',
            full_name: 'Nguyễn Quang Huy',
            display_name: 'Nguyễn Quang Huy (nguyenqhuy.hcm)'
        },
        {
            user_id: 1962,
            username: 'thangnn.vtu',
            full_name: 'Nguyễn Ngọc Thắng',
            display_name: 'Nguyễn Ngọc Thắng (thangnn.vtu)'
        },
        {
            user_id: 1958,
            username: 'vinhnq.bdg',
            full_name: 'Nguyễn Quốc Vinh',
            display_name: 'Nguyễn Quốc Vinh (vinhnq.bdg)'
        },
        {
            user_id: 1881,
            username: 'vinhdh.bdg',
            full_name: 'Đỗ Hữu Vinh',
            display_name: 'Đỗ Hữu Vinh (vinhdh.bdg)'
        },
        {
            user_id: 990,
            username: 'hieutt.vtu',
            full_name: 'Trần Trung Hiếu',
            display_name: 'Trần Trung Hiếu (hieutt.vtu)'
        },
        {
            user_id: 1374,
            username: 'nnhai.hcm',
            full_name: 'Nguyễn Ngọc Hải',
            display_name: 'Nguyễn Ngọc Hải (nnhai.hcm)'
        },
        {
            user_id: 1194,
            username: 'longbp.hcm',
            full_name: 'Bùi Phi Long',
            display_name: 'Bùi Phi Long (longbp.hcm)'
        },
        {
            user_id: 1274,
            username: 'nghianh.bdg',
            full_name: 'Nguyễn Hữu Nghĩa',
            display_name: 'Nguyễn Hữu Nghĩa (nghianh.bdg)'
        },
        {
            user_id: 1584,
            username: 'thaipv.vtu',
            full_name: 'Phan Văn Thái',
            display_name: 'Phan Văn Thái (thaipv.vtu)'
        },
        {
            user_id: 846,
            username: 'daothimyan.hcm',
            full_name: 'Đoàn Thị Mỹ An',
            display_name: 'Đoàn Thị Mỹ An (daothimyan.hcm)'
        },
        {
            user_id: 1378,
            username: 'npnam.bdg',
            full_name: 'Nguyễn Phương Nam',
            display_name: 'Nguyễn Phương Nam (npnam.bdg)'
        },
        {
            user_id: 1371,
            username: 'nmduc.hcm',
            full_name: 'Nguyễn Minh Đức',
            display_name: 'Nguyễn Minh Đức (nmduc.hcm)'
        },
        {
            user_id: 984,
            username: 'hieuhv.hcm',
            full_name: 'Huỳnh Văn Hiếu',
            display_name: 'Huỳnh Văn Hiếu (hieuhv.hcm)'
        },
        {
            user_id: 1565,
            username: 'tamnt.hcm',
            full_name: 'Nguyễn Thanh Tám',
            display_name: 'Nguyễn Thanh Tám (tamnt.hcm)'
        },
        {
            user_id: 1742,
            username: 'trangltt.bdg',
            full_name: 'Lê Thị Thùy Trang',
            display_name: 'Lê Thị Thùy Trang (trangltt.bdg)'
        },
        {
            user_id: 1133,
            username: 'kienlt.bdg',
            full_name: 'Lê Trung Kiên',
            display_name: 'Lê Trung Kiên (kienlt.bdg)'
        },
        {
            user_id: 1040,
            username: 'hungtm.vtu',
            full_name: 'Thái Mạnh Hùng',
            display_name: 'Thái Mạnh Hùng (hungtm.vtu)'
        },
        {
            user_id: 1498,
            username: 'pvanquang.hcm',
            full_name: 'Phạm Văn Quang',
            display_name: 'Phạm Văn Quang (pvanquang.hcm)'
        },
        {
            user_id: 1217,
            username: 'lupt.bdg',
            full_name: 'Phạm Thế Lữ',
            display_name: 'Phạm Thế Lữ (lupt.bdg)'
        },
        {
            user_id: 1542,
            username: 'sondt.vtu',
            full_name: 'Đặng Thái Sơn',
            display_name: 'Đặng Thái Sơn (sondt.vtu)'
        },
        {
            user_id: 1483,
            username: 'phuongph.bdg',
            full_name: 'Phạm Hoàng Phương',
            display_name: 'Phạm Hoàng Phương (phuongph.bdg)'
        },
        {
            user_id: 1961,
            username: 'duytnm.bdg',
            full_name: 'Trần Nguyễn Minh Duy',
            display_name: 'Trần Nguyễn Minh Duy (duytnm.bdg)'
        },
        {
            user_id: 1689,
            username: 'thuyan.hcm',
            full_name: 'Trần Thị Thúy An',
            display_name: 'Trần Thị Thúy An (thuyan.hcm)'
        },
        {
            user_id: 1598,
            username: 'thanhdn',
            full_name: 'Đỗ  Ngọc Thanh',
            display_name: 'Đỗ  Ngọc Thanh (thanhdn)'
        },
        {
            user_id: 905,
            username: 'duongcongtrung',
            full_name: 'Dương Công Trung',
            display_name: 'Dương Công Trung (duongcongtrung)'
        },
        {
            user_id: 1178,
            username: 'linhnd.bdg',
            full_name: 'Nguyễn Đăng Linh',
            display_name: 'Nguyễn Đăng Linh (linhnd.bdg)'
        },
        {
            user_id: 1028,
            username: 'huenv.vtu',
            full_name: 'Nguyễn Vinh Huế',
            display_name: 'Nguyễn Vinh Huế (huenv.vtu)'
        },
        {
            user_id: 1965,
            username: 'sonnct.bdg',
            full_name: 'Nguyễn Chí Trung Sơn',
            display_name: 'Nguyễn Chí Trung Sơn (sonnct.bdg)'
        },
        {
            user_id: 1673,
            username: 'thuanhm.hcm',
            full_name: 'Hồ Minh Thuần',
            display_name: 'Hồ Minh Thuần (thuanhm.hcm)'
        },
        {
            user_id: 1863,
            username: 'vangtta.hcm',
            full_name: 'Tô Thị Ánh Vàng',
            display_name: 'Tô Thị Ánh Vàng (vangtta.hcm)'
        },
        {
            user_id: 1001,
            username: 'hoangmh.vtu',
            full_name: 'Mai Huy Hoàng',
            display_name: 'Mai Huy Hoàng (hoangmh.vtu)'
        },
        {
            user_id: 1354,
            username: 'nhson1',
            full_name: 'Nguyễn Hồng Sơn',
            display_name: 'Nguyễn Hồng Sơn (nhson1)'
        },
        {
            user_id: 1048,
            username: 'huongpt.vtu',
            full_name: 'Phạm Thị Hương',
            display_name: 'Phạm Thị Hương (huongpt.vtu)'
        },
        {
            user_id: 1470,
            username: 'phuochc.hcm',
            full_name: 'Huỳnh Công Phước',
            display_name: 'Huỳnh Công Phước (phuochc.hcm)'
        },
        {
            user_id: 1276,
            username: 'nghiantt',
            full_name: 'Nguyễn Thanh Trọng Nghĩa',
            display_name: 'Nguyễn Thanh Trọng Nghĩa (nghiantt)'
        },
        {
            user_id: 1558,
            username: 'taint.hcm',
            full_name: 'Nguyễn Thành Tài',
            display_name: 'Nguyễn Thành Tài (taint.hcm)'
        },
        {
            user_id: 1758,
            username: 'trieunh.bdg',
            full_name: 'Nguyễn Hà Triều',
            display_name: 'Nguyễn Hà Triều (trieunh.bdg)'
        },
        {
            user_id: 1859,
            username: 'uyenhk.hcm',
            full_name: 'Hà Khánh Uyên',
            display_name: 'Hà Khánh Uyên (uyenhk.hcm)'
        },
        {
            user_id: 1626,
            username: 'thaomtt.vtu',
            full_name: 'Mai Thị Thanh Thảo',
            display_name: 'Mai Thị Thanh Thảo (thaomtt.vtu)'
        },
        {
            user_id: 1855,
            username: 'tvhuan.hcm',
            full_name: 'Trần Văn Huấn',
            display_name: 'Trần Văn Huấn (tvhuan.hcm)'
        },
        {
            user_id: 1118,
            username: 'khoala.vtu',
            full_name: 'Lâm Anh Khoa',
            display_name: 'Lâm Anh Khoa (khoala.vtu)'
        },
        {
            user_id: 1013,
            username: 'hoidq.hcm',
            full_name: 'Dương Quốc Hội',
            display_name: 'Dương Quốc Hội (hoidq.hcm)'
        },
        {
            user_id: 1301,
            username: 'nguyenha.hcm',
            full_name: 'Nguyễn Việt Hà',
            display_name: 'Nguyễn Việt Hà (nguyenha.hcm)'
        },
        {
            user_id: 847,
            username: 'datct.hcm',
            full_name: 'Cao Thái Đạt',
            display_name: 'Cao Thái Đạt (datct.hcm)'
        },
        {
            user_id: 1139,
            username: 'kietva.hcm',
            full_name: 'Vũ Anh Kiệt',
            display_name: 'Vũ Anh Kiệt (kietva.hcm)'
        },
        {
            user_id: 770,
            username: 'baobt',
            full_name: 'Bùi Thế Bảo',
            display_name: 'Bùi Thế Bảo (baobt)'
        },
        {
            user_id: 1164,
            username: 'lengoclinh',
            full_name: 'Lê Ngọc Linh',
            display_name: 'Lê Ngọc Linh (lengoclinh)'
        },
        {
            user_id: 1816,
            username: 'tuannha.vtu',
            full_name: 'Nguyễn Hoàng Anh Tuấn',
            display_name: 'Nguyễn Hoàng Anh Tuấn (tuannha.vtu)'
        },
        {
            user_id: 1645,
            username: 'thiennn.hcm',
            full_name: 'Nguyễn Ngọc Thiện',
            display_name: 'Nguyễn Ngọc Thiện (thiennn.hcm)'
        },
        {
            user_id: 1671,
            username: 'ththanh.hcm',
            full_name: 'Trịnh Hữu Thanh',
            display_name: 'Trịnh Hữu Thanh (ththanh.hcm)'
        },
        {
            user_id: 1897,
            username: 'vunc.vtu',
            full_name: 'Nguyễn Công Vũ',
            display_name: 'Nguyễn Công Vũ (vunc.vtu)'
        },
        {
            user_id: 1546,
            username: 'sonnn.hcm',
            full_name: 'Nguyễn Ngọc Sơn',
            display_name: 'Nguyễn Ngọc Sơn (sonnn.hcm)'
        },
        {
            user_id: 1831,
            username: 'tudq.vtu',
            full_name: 'Đặng Quang Tú',
            display_name: 'Đặng Quang Tú (tudq.vtu)'
        },
        {
            user_id: 1367,
            username: 'ninhnguyenan.hcm',
            full_name: 'Nguyễn An Ninh',
            display_name: 'Nguyễn An Ninh (ninhnguyenan.hcm)'
        },
        {
            user_id: 1964,
            username: 'minhtri.bdg',
            full_name: 'Nguyễn Minh Trí',
            display_name: 'Nguyễn Minh Trí (minhtri.bdg)'
        },
        {
            user_id: 1512,
            username: 'quanvq.hcm',
            full_name: 'Võ Quốc Quân',
            display_name: 'Võ Quốc Quân (quanvq.hcm)'
        },
        {
            user_id: 1950,
            username: 'phuongthao.hcm',
            full_name: 'Tô Thị Phương Thảo',
            display_name: 'Tô Thị Phương Thảo (phuongthao.hcm)'
        },
        {
            user_id: 1263,
            username: 'nganph.hcm',
            full_name: 'Nguyễn Phạm Hồng Nga',
            display_name: 'Nguyễn Phạm Hồng Nga (nganph.hcm)'
        },
        {
            user_id: 1446,
            username: 'phongnx.hcm',
            full_name: 'Nguyễn Xuân Phong',
            display_name: 'Nguyễn Xuân Phong (phongnx.hcm)'
        }
    ];
    /*********************************************************
   * STATE
   *********************************************************/
    const state = {
        notifiedKeys: new Set(), // prevent spam (per assignee + task + status)
    };

    /*********************************************************
   * DOM HELPERS
   *********************************************************/
    const $ = (sel, root = document) => root.querySelector(sel);

    function clearAlertBox() {
        $("#tm-alert-box")?.remove();
    }

    /*********************************************************
   * XLSX
   *********************************************************/
    function loadXLSX(cb) {
        if (window.XLSX) return cb();
        const s = document.createElement("script");
        s.src = CONFIG.XLSX_CDN;
        s.onload = cb;
        document.head.appendChild(s);
    }

    /*********************************************************
   * COOKIE / TOKEN
   *********************************************************/
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (const c of cookies) {
            const [k, v] = c.trim().split('=');
            if (k === name) return v;
        }
        return null;
    }

    function getTokenFromCookie() {
        const raw = getCookie("VNPT-Token");
        if (!raw) throw new Error("VNPT-Token not found");
        return JSON.parse(raw).token;
    }

    function getCurrentUserUsidFromCookie() {
        try {
            const raw = getCookie("VNPT-Token");
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed?.user?.usid ?? null;
        } catch {
            return null;
        }
    }

    /*********************************************************
   * DATE HELPERS
   *********************************************************/
    const pad2 = n => String(n).padStart(2, '0');
    const fmtISO = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    const fmtVN  = d => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;

    function startOfWeekMon(d) {
        const x = new Date(d);
        const day = x.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        x.setDate(x.getDate() + diff);
        x.setHours(0, 0, 0, 0);
        return x;
    }

    function endOfWeekSun(d) {
        const m = startOfWeekMon(d);
        const s = new Date(m);
        s.setDate(m.getDate() + 6);
        s.setHours(23, 59, 59, 999);
        return s;
    }

    function toDDMMYYYY(value) {
        const [y, m, d] = value.split("-");
        return `${d}/${m}/${y}`;
    }

    function formatToDDMMYYYY(isoDateTime) {
        if (!isoDateTime) return "";
        const [date] = isoDateTime.split("T");
        const [y, m, d] = date.split("-");
        return `${d}/${m}/${y}`;
    }

    function dayStart(d = new Date()) {
        const x = new Date(d);
        x.setHours(0, 0, 0, 0);
        return x;
    }

    function parseDay(dateStr) {
        if (!dateStr) return null;
        const x = new Date(dateStr);
        x.setHours(0, 0, 0, 0);
        return x;
    }

    function getMonthParamNow() {
        const now = new Date();
        const mm = pad2(now.getMonth() + 1);
        const yyyy = now.getFullYear();
        return `${mm}%2F${yyyy}`; // "01%2F2026"
    }

    /*********************************************************
   * FETCH (API)
   *********************************************************/
    async function fetchData(url) {
        const token = getTokenFromCookie();
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (!json?.data) return [];
        return typeof json.data === "string" ? JSON.parse(json.data) : json.data;
    }

    async function fetchTaskInfo(taskId) {
        const url = `${CONFIG.API_URL}/work/Task/GetTaskInfo?taskId=${taskId}&boardId=${CONFIG.BOARD_ID}&t=${Date.now()}`;
        return await fetchData(url);
    }

    async function fetchTaskDetailTable({ assigneeId, monthParam }) {
        if (!assigneeId) return [];
        const url =
              `${CONFIG.API_URL}/report/dashboard/DashboardQLCV/getTaskDetailTable` +
              `?month=${monthParam}&assignee_id=${assigneeId}&t=${Date.now()}`;
        return await fetchData(url);
    }

    /*********************************************************
   * TASK DEADLINE RULES
   *********************************************************/
    const DeadlineStatus = Object.freeze({
        OVERDUE: "OVERDUE",
        NEAR_DUE: "NEAR_DUE",
        NONE: null
    });

    function getTaskEndDate(task) {
        const endStr = task.actual_end || task.schedule_end;
        return parseDay(endStr);
    }

    function getDeadlineStatus(task) {
        const today = dayStart();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 3);

        const end = getTaskEndDate(task);
        if (!end) return DeadlineStatus.NONE;

        if (end < today) return DeadlineStatus.OVERDUE;
        if (end.getTime() <= tomorrow.getTime() && end.getTime() > today) return DeadlineStatus.NEAR_DUE;

        return DeadlineStatus.NONE;
    }

    function makeNotifyKey(assigneeId, task, status) {
        return `${assigneeId}:${task.task_id || task.code}:${status}`;
    }

    /*********************************************************
   * ALERT UI (in your box)
   *********************************************************/
    function showAlertInBox(text, bgColor) {
        let alertBox = $("#tm-alert-box");

        if (!alertBox) {
            alertBox = document.createElement("div");
            alertBox.id = "tm-alert-box";
            alertBox.style = `
        margin-top:10px;
        padding:8px;
        border-radius:6px;
        color:#fff;
        font-size:12px;
        white-space:pre-line;
      `;
            $("#content")?.appendChild(alertBox);
        }

        alertBox.style.background = bgColor;
        alertBox.textContent = text;
    }

    function notifyTask(task, status) {
        const isOverdue = status === DeadlineStatus.OVERDUE;

        const title = isOverdue
        ? "❌ Công việc quá hạn"
        : "⚠️ Công việc sắp tới hạn (1 ngày)";

        // GM_notification({
        //     title,
        //     text: `${task.code} - ${task.type_task}`,
        //     timeout: CONFIG.TASK_NOTIFY_TIMEOUT_MS,
        //     silent: !isOverdue,
        //     onclick: () => window.focus()
        // });
    }

    function renderAndNotify(task, status) {
        let bgColor = "#334155";
        let message = "";

        if (status === DeadlineStatus.OVERDUE) {
            bgColor = "#7f1d1d";
            message =
`❌ QUÁ HẠN
📌 Mã: ${task.code}
📝 ${task.type_task}
📂 ${task.group_task}
📅 Hạn: ${task.schedule_end}`;
        }

        if (status === DeadlineStatus.NEAR_DUE) {
            bgColor = "#92400e";
            message =
`⚠️ SẮP TỚI HẠN (1 ngày)
📌 Mã: ${task.code}
📝 ${task.type_task}
📂 ${task.group_task}
📅 Hạn: ${task.schedule_end}`;
        }

        showAlertInBox(message, bgColor);
        notifyTask(task, status);
    }

    /*********************************************************
   * TASK CHECK FLOW

   *********************************************************/

    function renderAlertBox(overdueTasks, nearDueTasks) {
        if (!overdueTasks.length && !nearDueTasks.length) return;

        let box = document.getElementById("tm-alert-box");
        if (!box) {
            box = document.createElement("div");
            box.id = "tm-alert-box";
            box.style = `
            margin-top:10px;
            padding:8px;
            border-radius:6px;
            color:#fff;
            font-size:12px;
            max-height:220px;
            overflow:auto;
            white-space:pre-line;
        `;
            document.querySelector("#content")?.appendChild(box);
        }

        let html = "";

        if (overdueTasks.length) {
            box.style.background = "#7f1d1d";
            html += `❌ QUÁ HẠN (${overdueTasks.length})\n`;
            overdueTasks.forEach(t => {
                html += `• [${t.code}] ${t.type_task} (Hạn ${toDDMMYYYY(t.schedule_end)})\n`;
            });
            html += `\n`;
        }

        if (nearDueTasks.length) {
            box.style.background = "#92400e";
            html += `⚠️ SẮP TỚI HẠN (${nearDueTasks.length})\n`;
            nearDueTasks.forEach(t => {
                html += `• [${t.code}] ${t.type_task} \n(Hạn ${toDDMMYYYY(t.schedule_end)}) \n`;
            });
        }

        box.textContent = html.trim();
    }

    function notifyGroupedTasks(assigneeId, overdueTasks, nearDueTasks) {

        if (overdueTasks.length) {
            const key = `${assigneeId}_OVERDUE`;
            if (!state.notifiedKeys.has(key)) {
                state.notifiedKeys.add(key);

                GM_notification({
                    title: `❌ ${overdueTasks.length} công việc quá hạn`,
                    text: overdueTasks
                    .slice(0, 4)
                    .map(t => `[${t.code}] ${t.type_task}`)
                    .join("\n") +
                    (overdueTasks.length > 4 ? `\n… và ${overdueTasks.length - 4} task khác` : ""),
                    timeout: 12000,
                    onclick: () => window.focus()
                });
            }
        }

        if (nearDueTasks.length) {
            const key = `${assigneeId}_NEAR_DUE`;
            if (!state.notifiedKeys.has(key)) {
                state.notifiedKeys.add(key);

                GM_notification({
                    title: `⚠️ ${nearDueTasks.length} công việc sắp tới hạn`,
                    text: nearDueTasks
                    .slice(0, 4)
                    .map(t => `[${t.code}] ${t.type_task}`)
                    .join("\n") +
                    (nearDueTasks.length > 4 ? `\n… và ${nearDueTasks.length - 4} task khác` : ""),
                    timeout: 10000,
                    silent: true,
                    onclick: () => window.focus()
                });
            }
        }
    }


    function getSelectedAssigneeId() {
        const userSelect = $("#wr_user");
        if (!userSelect) return "";
        const v = userSelect.value;
        return v === "ALL" ? "" : v;
    }

    function resetNotifyCacheForUser() {
        state.notifiedKeys.clear();
    }

    async function checkCurrentTasksForSelectedUser() {
        const assigneeId = getSelectedAssigneeId();
        if (!assigneeId) {
            clearAlertBox();
            return;
        }

        clearAlertBox();

        const monthParam = getMonthParamNow();
        const tasks = await fetchTaskDetailTable({ assigneeId, monthParam });

        const overdueTasks = [];
        const nearDueTasks = [];

        for (const task of tasks) {
            if (task.status_name !== "Chưa hoàn thành") continue;

            const status = getDeadlineStatus(task);
            if (status === DeadlineStatus.OVERDUE) overdueTasks.push(task);
            if (status === DeadlineStatus.NEAR_DUE) nearDueTasks.push(task);
        }

        renderAlertBox(overdueTasks, nearDueTasks);
        notifyGroupedTasks(assigneeId, overdueTasks, nearDueTasks);
    }



    /*********************************************************
   * WEEK PICKER
   *********************************************************/
    function getWeeksOfCurrentMonth() {
        const now = new Date();
        const first = new Date(now.getFullYear(), now.getMonth(), 1);
        const last  = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let cur = startOfWeekMon(first);
        let idx = 1;
        const weeks = [];

        while (cur <= last) {
            const ws = new Date(Math.max(cur, first));
            const we = new Date(Math.min(endOfWeekSun(cur), last));
            weeks.push({
                index: idx++,
                fromISO: fmtISO(ws),
                toISO: fmtISO(we),
                label: `Tuần ${idx - 1}: ${fmtVN(ws)} → ${fmtVN(we)}`
      });
            cur.setDate(cur.getDate() + 7);
        }
        return weeks;
    }

    /*********************************************************
   * CORE DATA (Weekly Report)
   *********************************************************/
    async function getWeeklyReportData() {
        const assigneeId = getSelectedAssigneeId();

        const fromRaw = $("#wr_from")?.value;
        const toRaw   = $("#wr_to")?.value;

        const fromDate = encodeURIComponent(toDDMMYYYY(fromRaw));
        const toDate   = encodeURIComponent(toDDMMYYYY(toRaw));
        if (!fromDate || !toDate) {
            alert("❌ Thiếu fromDate / toDate");
            return [];
        }

        const url =
              `${CONFIG.API_URL}/report/dashboard/DashboardWeeklyTask/getDetailByDate` +
              `?assignee_id=${assigneeId}&fromDate=${fromDate}&toDate=${toDate}&t=${Date.now()}`;

        const data = await fetchData(url);
        const seen = new Set();
        const result = [];

        for (const item of data) {
            if (seen.has(item.task_id)) continue;
            seen.add(item.task_id);

            const taskInfo = await fetchTaskInfo(item.task_id);

            result.push({
                employee: item.account_name,
                code: item.code,
                task_name: item.task_name,
                customer: taskInfo?.customer?.customer_name || "",
                start_date: item.create_day,
                end_date: item.schedule_end,
                status: item.status,
                planned_hours: item.planned_duration_time,
                actual_hours: item.actual_execution_time,
                jira: item.jira_url
            });
        }
        return result;
    }

    /*********************************************************
   * EXCEL
   *********************************************************/
    function mapTasksToExcelRows(tasks) {
        return tasks.map((t, i) => ({
            "STT": i + 1,

            "Dự án (Nội dung công việc)":
            `[${t.code}] ${t.customer ? t.customer + " - " : ""}${t.task_name}`,

            "Loại\n1: Dựng mới\n2: Chỉnh sửa": 2,

            "Mức độ\n1: Bình thường\n2: Quan trọng\n3: Rất quan trọng": 1,

            "Thời gian bắt đầu": formatToDDMMYYYY(t.start_date) || "",

            "Thời gian kết thúc": t.end_date || "",

            "Trạng thái\n1: Hoàn thành\n2: Đang thực hiện":
            t.status === 1 ? 1 : 2,

            "Trễ\n0: Không trễ\n1: Trễ": 0,

            "Ghi chú": ""
        }));
    }

    function exportTasksToExcel(tasks) {
        if (!tasks.length) {
            alert("⚠️ Không có dữ liệu để xuất");
            return;
        }

        loadXLSX(() => {
            const rows = mapTasksToExcelRows(tasks);
            const ws = XLSX.utils.json_to_sheet(rows);

            ws["!cols"] = [
                { wch: 6 },
                { wch: 75 },
                { wch: 18 },
                { wch: 24 },
                { wch: 16 },
                { wch: 18 },
                { wch: 26 },
                { wch: 18 },
                { wch: 30 }
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "BaoCaoTuan");

            XLSX.writeFile(
                wb,
                `BaoCaoTuan_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
        });
    }

    /*********************************************************
   * GAS
   *********************************************************/
    function sendToGAS(payload) {
        GM_xmlhttpRequest({
            method: "POST",
            url: CONFIG.GAS_WEBAPP_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                source: "tampermonkey",
                created_at: new Date().toISOString(),
                data: payload
            })
        });
    }

    /*********************************************************
   * UI
   *********************************************************/
    function createReportUI() {
        const box = document.createElement('div');
        box.dataset.collapsed = "false";
        box.style = `
      position:fixed;bottom:20px;right:20px;z-index:99999;
      background:#0f172a;color:#fff;padding:12px;border-radius:10px;
      width:300px;font-size:13px;
      box-shadow:0 10px 25px rgba(0,0,0,.4);
      transition:.3s;
    `;

        box.innerHTML = `
      <div id="collapseBtn"
        style="position:absolute;top:50%;right:-14px;
        transform:translateY(-50%);
        width:28px;height:28px;border-radius:50%;
        background:#0f172a;display:flex;
        align-items:center;justify-content:center;
        cursor:pointer;">◀</div>

      <div id="content">
        <b>📊 Báo cáo tuần</b>

        <div style="margin-top:8px;font-weight:600;">👤 Người thực hiện</div>
        <select id="wr_user" style="width:100%;margin-top:4px;"></select>

        <div style="margin-top:8px;font-weight:600;">📅 Chọn tuần</div>
        <select id="wr_week" style="width:100%;margin-top:4px;"></select>

        <input id="wr_from" type="hidden">
        <input id="wr_to" type="hidden">

        <button id="runNowBtn" style="width:100%;margin-top:8px;">📤 Xuất báo cáo</button>
        <button id="exportExcelBtn" style="width:100%;margin-top:4px;">📥 Xuất Excel</button>
      </div>
    `;

        document.body.appendChild(box);

        // collapse
        const content = box.querySelector('#content');
        const btn = box.querySelector('#collapseBtn');
        btn.onclick = () => {
            const c = box.dataset.collapsed === "true";
            content.style.display = c ? "block" : "none";
            box.style.width = c ? "300px" : "48px";
            btn.innerHTML = c ? "◀" : "▶";
            box.dataset.collapsed = String(!c);
        };

        // users
        const userSelect = $("#wr_user");
        const currentUsid = getCurrentUserUsidFromCookie();

        userSelect.innerHTML =
            `<option value="ALL">📌 Tất cả</option>` +
            USER_IDS.map(u => `<option value="${u.user_id}">${u.display_name}</option>`).join('');

        if (currentUsid && USER_IDS.some(u => String(u.user_id) === String(currentUsid))) {
            userSelect.value = String(currentUsid);
        } else {
            userSelect.value = "ALL";
        }

        // weeks
        const weeks = getWeeksOfCurrentMonth();
        const weekSelect = $("#wr_week");
        weekSelect.innerHTML = weeks.map(w => `<option value="${w.index}">${w.label}</option>`).join('');

        const todayISO = fmtISO(new Date());
        const currentWeek = weeks.find(w => todayISO >= w.fromISO && todayISO <= w.toISO);
        weekSelect.value = currentWeek ? currentWeek.index : 1;

        function applyWeek() {
            const w = weeks.find(x => String(x.index) === String(weekSelect.value));
            if (!w) return;
            $("#wr_from").value = w.fromISO;
            $("#wr_to").value = w.toISO;
        }
        weekSelect.onchange = applyWeek;
        applyWeek();

        // actions
        $("#runNowBtn").onclick = async () => {
            const data = await getWeeklyReportData();
            sendToGAS(data);
        };

        $("#exportExcelBtn").onclick = async () => {
            const data = await getWeeklyReportData();
            exportTasksToExcel(data);
        };

        // when user changes -> check again + reset notify cache
        userSelect.addEventListener("change", () => {
            resetNotifyCacheForUser();
            checkCurrentTasksForSelectedUser();
        });

    }

    /*********************************************************
   * INIT
   *********************************************************/
    setTimeout(() => {
        createReportUI();
        checkCurrentTasksForSelectedUser();
    }, CONFIG.UI_INIT_DELAY_MS);

})();
