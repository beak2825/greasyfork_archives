// ==UserScript==
// @name         BUAA 研究生选课助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测课程余量，悬浮窗+页面表格增强
// @match        https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/course.html*
// @grant        GM_addStyle
// @author       Harr1son
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/547944/BUAA%20%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547944/BUAA%20%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
      #xk-helper {
        position: fixed;
        top: 100px;
        right: 20px;
        width: 600px;
        height: 450px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        resize: both;
        overflow: auto;
        transition: all 0.3s ease;
      }
      #xk-helper.minimized {
        width: 120px;
        height: auto;
        resize: none;
      }
      #xk-header {
        cursor: move;
        background: #f2f2f2;
        padding: 5px;
        font-weight: bold;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #xk-header .title {
        flex: 1;
      }
      #minimize-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 0 5px;
        color: #666;
        margin: 0 !important;
      }
      #minimize-btn:hover {
        background: #e0e0e0;
        border-radius: 3px;
      }
      #xk-body { padding: 8px; }
      #xk-helper.minimized #xk-body > *:not(#startBtn) {
        display: none;
      }
      #xk-helper button, #xk-helper select {
        margin-top: 5px;
        padding: 4px 8px;
      }
      #xk-results table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }
      #xk-results th, #xk-results td {
        border: 1px solid #ddd;
        padding: 4px;
        text-align: center;
      }
      #xk-results tr.no-seats {
        background-color: #ffcccc !important;
      }
      #xk-footer {
        margin-top: 6px;
        font-size: 12px;
        color: #555;
      }
      #xk-log {
        margin-top: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        max-height: 150px;
        overflow-y: auto;
        background: #f9f9f9;
      }
      #xk-log-title {
        background: #e9e9e9;
        padding: 4px 8px;
        font-weight: bold;
        font-size: 12px;
        border-bottom: 1px solid #ddd;
      }
      #xk-log-content {
        padding: 4px;
        font-size: 11px;
      }
      .log-entry {
        padding: 2px 4px;
        margin-bottom: 2px;
        border-radius: 2px;
        background: white;
        border-left: 3px solid #007acc;
      }
      .log-entry.increase {
        border-left-color: #ff6b6b;
        background: #fff5f5;
      }
      .log-entry.decrease {
        border-left-color: #4ecdc4;
        background: #f0fffe;
      }
      .log-time {
        color: #666;
        font-size: 10px;
      }

      /* 课程超额提醒弹窗样式 */
      .course-alert {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        z-index: 10000;
        font-size: 14px;
        font-weight: bold;
        max-width: 300px;
        animation: slideInUp 0.3s ease-out;
        cursor: pointer;
      }

      .course-alert:hover {
        background: #ff3742;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
        transition: all 0.2s ease;
      }

      .course-alert .alert-title {
        font-size: 16px;
        margin-bottom: 5px;
      }

      .course-alert .alert-content {
        font-size: 13px;
        opacity: 0.9;
      }

      .course-alert .alert-close {
        position: absolute;
        top: 5px;
        right: 8px;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.7;
      }

      .course-alert .alert-close:hover {
        opacity: 1;
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(100px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideOutDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(100px);
        }
      }
    `);

    // 插入悬浮窗
    const panel = document.createElement("div");
    panel.id = "xk-helper";
    panel.className = "minimized"; // 默认为缩小状态
    panel.innerHTML = `
      <div id="xk-header">
        <div class="title">课程监控助手</div>
        <button id="minimize-btn" title="展开">+</button>
      </div>
      <div id="xk-body">
        <button id="startBtn">开始检测</button>
        <select id="filterFull">
          <option value="all">全部</option>
          <option value="full">已选满</option>
          <option value="notfull">未选满</option>
        </select>
        <select id="filterCampus">
          <option value="all">全部校区</option>
        </select>
        <div id="xk-results"></div>
        <div id="xk-footer">未刷新</div>
        <div id="xk-log">
          <div id="xk-log-title">人数变动日志</div>
          <div id="xk-log-content">暂无变动记录</div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    const startBtn = document.getElementById("startBtn");
    const resultDiv = document.getElementById("xk-results");
    const filterFull = document.getElementById("filterFull");
    const filterCampus = document.getElementById("filterCampus");
    const footer = document.getElementById("xk-footer");
    const minimizeBtn = document.getElementById("minimize-btn");
    const logContent = document.getElementById("xk-log-content");

    let timer = null;
    let lastData = [];
    let campuses = new Set();
    let selectedCourses = []; // 用户已选课程
    let isMinimized = true; // 记录当前状态，默认为缩小状态
    let previousData = []; // 保存上一次的数据用于比较

    // 可拖动
    (function makeDraggable() {
        const header = document.getElementById("xk-header");
        let offsetX, offsetY, isDown = false;
        header.addEventListener("mousedown", function(e) {
            // 如果点击的是缩小按钮，不进行拖动
            if (e.target.id === "minimize-btn") return;
            isDown = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        });
        function move(e) {
            if (!isDown) return;
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
        }
        function up() {
            isDown = false;
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
        }
    })();

    // 缩小/展开功能
    minimizeBtn.addEventListener("click", function() {
        isMinimized = !isMinimized;
        if (isMinimized) {
            panel.classList.add("minimized");
            minimizeBtn.textContent = "+";
            minimizeBtn.title = "展开";
        } else {
            panel.classList.remove("minimized");
            minimizeBtn.textContent = "−";
            minimizeBtn.title = "缩小";
        }
    });

    // 获取已选课程（一次性）- 带反爬策略
    async function fetchSelectedCourses() {
        const url = "https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/xsxkCourse/loadKbxx.do?sfyx=1&sfjzsyzz=1";
        try {
            const res = await fetch(url, {
                credentials: "include",
                headers: {
                    "User-Agent": getRandomUserAgent(),
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": "https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/course.html"
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            selectedCourses = data.xkjgList || [];
            console.log(`获取到 ${selectedCourses.length} 个已选课程`);
            return selectedCourses;
        } catch (e) {
            console.error("获取已选课程失败:", e);
            return [];
        }
    }

    // 获取课程余量（根据课程代码 + 班级）- 带反爬策略
    async function fetchCourse(code, retryCount = 0) {
        const url = "https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/xsxkCourse/loadAllCourseInfo.do";
        const formData = new URLSearchParams({
            query_keyword: code,
            query_xnxq: "20251",
            query_kkyx: "",
            query_kksx: "",
            fixedAutoSubmitBug: "",
            query_jxsjhnkc: "0",
            query_jxsfankc: "0",
            pageIndex: "1",
            pageSize: "20",
            sortField: "",
            sortOrder: ""
        });

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": getRandomUserAgent(),
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": "https://yjsxk.buaa.edu.cn/yjsxkapp/sys/xsxkappbuaa/course.html"
                },
                body: formData.toString(),
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            return data.datas || [];
        } catch (e) {
            console.error(`请求失败 (课程代码: ${code}, 重试次数: ${retryCount}):`, e);

            // 重试机制：最多重试2次
            if (retryCount < 2) {
                const retryDelay = (retryCount + 1) * 2000 + Math.random() * 1000; // 递增延迟
                console.log(`${retryDelay/1000}秒后重试...`);
                await sleep(retryDelay);
                return fetchCourse(code, retryCount + 1);
            }

            return [];
        }
    }

    // 渲染表格
    function renderResult(courseList) {
        let filtered = courseList;
        if (filterFull.value === "full") {
            filtered = filtered.filter(c => c.YXXKJGRS >= c.KXRS);
        } else if (filterFull.value === "notfull") {
            filtered = filtered.filter(c => c.YXXKJGRS < c.KXRS);
        }
        if (filterCampus.value !== "all") {
            filtered = filtered.filter(c => c.XQMC === filterCampus.value);
        }

        let html = `
          <table>
            <thead>
              <tr>
                <th>班级</th><th>课程名</th><th>校区</th><th>总学时</th><th>容量</th><th>已选</th>
              </tr>
            </thead><tbody>
        `;
        for (let c of filtered) {
            const noSeats = c.YXXKJGRS > c.KXRS ? "no-seats" : "";
            html += `<tr class="${noSeats}">
              <td>${c.BJMC}</td><td>${c.KCMC}</td><td>${c.XQMC}</td>
              <td>${c.KCZXS}</td><td>${c.KXRS}</td><td>${c.YXXKJGRS}</td>
            </tr>`;
        }
        html += "</tbody></table>";
        resultDiv.innerHTML = html;
        footer.textContent = `上次刷新: ${new Date().toLocaleTimeString()} | 共 ${courseList.length} 门课程`;

        // 同步更新页面表格
        updatePageTable(courseList);
    }

    // 随机延迟
    function getRandomDelay() {
        return (3 + Math.random() * 2) * 1000;
    }

    // 获取随机延迟（用于请求间隔）
    // 0.1-0.5秒
    function getRequestDelay() {
        return (0.1 + Math.random() * 0.4) * 1000;
    }

    // 随机User-Agent列表
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];

    // 获取随机User-Agent
    function getRandomUserAgent() {
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 显示课程超额提醒弹窗
    function showCourseAlert(course) {
        // 检查是否已经有同样的弹窗存在
        const existingAlert = document.querySelector(`.course-alert[data-course="${course.KCDM}-${course.BJMC}"]`);
        if (existingAlert) {
            return; // 避免重复弹窗
        }

        const alert = document.createElement('div');
        alert.className = 'course-alert';
        alert.setAttribute('data-course', `${course.KCDM}-${course.BJMC}`);

        alert.innerHTML = `
            <div class="alert-close">×</div>
            <div class="alert-title">🚨 课程超额提醒</div>
            <div class="alert-content">
                <div><strong>${course.KCMC}</strong></div>
                <div>班级：${course.BJMC}</div>
                <div>已选：${course.YXXKJGRS}/${course.KXRS}人</div>
                <div style="margin-top: 5px; font-size: 12px;">该课程已超过限额！</div>
            </div>
        `;

        document.body.appendChild(alert);

        // 播放提示音效（使用浏览器原生音效）
        try {
            // 创建一个简单的提示音
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('音效播放失败:', e);
        }

        // 添加关闭按钮事件
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAlert(alert);
        });

        // 点击弹窗也可以关闭
        alert.addEventListener('click', () => {
            closeAlert(alert);
        });

        // 5秒后自动关闭
        setTimeout(() => {
            if (document.body.contains(alert)) {
                closeAlert(alert);
            }
        }, 5000);

        console.log(`🚨 课程超额提醒: ${course.KCMC}(${course.BJMC}) ${course.YXXKJGRS}/${course.KXRS}人`);
    }

    // 关闭弹窗的函数
    function closeAlert(alert) {
        alert.style.animation = 'slideOutDown 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        }, 300);
    }

    // 记录人数变动日志
    function logCourseChange(courseList) {
        if (previousData.length === 0) {
            previousData = courseList.map(c => ({...c}));
            return;
        }

        const changes = [];
        const now = new Date();
        const timeStr = now.toLocaleTimeString();

        courseList.forEach(current => {
            const previous = previousData.find(p => p.KCDM === current.KCDM && p.BJMC === current.BJMC);
            if (previous && previous.YXXKJGRS !== current.YXXKJGRS) {
                const change = current.YXXKJGRS - previous.YXXKJGRS;
                const changeType = change > 0 ? 'increase' : 'decrease';
                const changeText = change > 0 ? `增加${change}人` : `减少${Math.abs(change)}人`;

                // 检测课程从未满变为超额的状态变化
                const wasNotFull = previous.YXXKJGRS <= previous.KXRS;  // 之前未满或正好满
                const isNowOverFull = current.YXXKJGRS > current.KXRS;   // 现在超额

                if (wasNotFull && isNowOverFull) {
                    // 触发超额提醒弹窗
                    showCourseAlert(current);
                }

                changes.push({
                    time: timeStr,
                    course: current.KCMC,
                    class: current.BJMC,
                    change: changeText,
                    type: changeType,
                    from: previous.YXXKJGRS,
                    to: current.YXXKJGRS
                });
            }
        });

        if (changes.length > 0) {
            updateLogDisplay(changes);
        }

        // 更新上一次的数据
        previousData = courseList.map(c => ({...c}));
    }

    // 更新日志显示
    function updateLogDisplay(changes) {
        const existingLogs = logContent.innerHTML === '暂无变动记录' ? '' : logContent.innerHTML;

        let newLogsHtml = '';
        changes.forEach(change => {
            newLogsHtml += `
                <div class="log-entry ${change.type}">
                    <div>${change.course} (${change.class})</div>
                    <div>${change.from} → ${change.to} (${change.change})</div>
                    <div class="log-time">${change.time}</div>
                </div>
            `;
        });

        logContent.innerHTML = newLogsHtml + existingLogs;

        // 同步更新页面日志
        const div = document.getElementById("m_wapkcDiv_yx");
        if (div) {
            const pageLogContent = div.querySelector(".page-log-content");
            if (pageLogContent) {
                pageLogContent.innerHTML = logContent.innerHTML;
            }
        }
    }

    // 主逻辑：根据已选课程获取对应的班级余量
    async function checkCourses() {
        let allCourses = [];

        // 串行请求，避免并发过多
        for (let i = 0; i < selectedCourses.length; i++) {
            const sc = selectedCourses[i];

            // 如果不是第一个请求，添加随机延迟
            if (i > 0) {
                const delay = getRequestDelay();
                // console.log(`等待 ${(delay/1000).toFixed(1)} 秒后请求下一个课程...`);
                await sleep(delay);
            }

            // console.log(`正在获取课程 ${sc.KCDM} 的信息... (${i + 1}/${selectedCourses.length})`);
            const data = await fetchCourse(sc.KCDM);
            const matched = data.find(c => c.BJMC === sc.BJMC);
            if (matched) {
                allCourses.push(matched);
                // console.log(`✓ 课程 ${matched.KCMC}(${matched.BJMC}) 数据获取成功`);
            } else {
                console.warn(`⚠ 课程 ${sc.KCDM}(${sc.BJMC}) 未找到匹配数据`);
            }
        }

        // console.log(`本轮检测完成，共获取 ${allCourses.length} 个课程数据`);

        // 记录人数变动
        logCourseChange(allCourses);

        lastData = allCourses;

        campuses.clear();
        allCourses.forEach(c => campuses.add(c.XQMC));
        updateCampusFilter();

        renderResult(allCourses);

        // 下次检测的随机延迟
        const nextDelay = getRandomDelay();
        // console.log(`${(nextDelay/1000).toFixed(1)} 秒后开始下一轮检测`);
        timer = setTimeout(() => checkCourses(), nextDelay);
    }

    // 更新校区下拉
    function updateCampusFilter() {
        const current = filterCampus.value;
        filterCampus.innerHTML = `<option value="all">全部校区</option>`;
        campuses.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c;
            filterCampus.appendChild(opt);
        });
        if ([...campuses].includes(current)) {
            filterCampus.value = current;
        }
    }

    // 更新页面表格：插入容量和已选
    function updatePageTable(courseList) {
        const div = document.getElementById("m_wapkcDiv_yx");
        if (!div) return;
        const table = div.querySelector("table");
        if (!table) return;
        const headerRow = table.querySelector("thead tr");
        if (!headerRow) return;

        // 如果没加过，则插入列
        if (!headerRow.querySelector(".cap-col")) {
            const thCap = document.createElement("td");
            thCap.textContent = "容量";
            thCap.classList.add("kb_header","cap-col");
            headerRow.insertBefore(thCap, headerRow.children[6]);
            const thSel = document.createElement("td");
            thSel.textContent = "已选";
            thSel.classList.add("kb_header","cap-col");
            headerRow.insertBefore(thSel, headerRow.children[7]);
        }

        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
            const cols = row.querySelectorAll("td");
            if (cols.length < 2) return;
            const courseText = cols[1].innerText.trim(); // 课程信息

            // 反向查找：从courseList中拼接显示名称，然后匹配
            // 考虑多种可能的括号格式
            const found = courseList.find(c => {
                const possibleNames = [
                    `${c.KCDM}-${c.KCMC}（${c.BJMC}）`,  // 中文括号
                    `${c.KCDM}-${c.KCMC}(${c.BJMC})`,   // 英文括号
                    `${c.KCDM}-${c.KCMC}［${c.BJMC}］`,  // 方括号
                    `${c.KCDM}-${c.KCMC}【${c.BJMC}】`   // 中文方括号
                ];
                return possibleNames.includes(courseText);
            });

            let capCell = row.querySelector(".cap-cell");
            let selCell = row.querySelector(".sel-cell");
            if (!capCell) {
                capCell = document.createElement("td");
                capCell.classList.add("cap-cell");
                row.insertBefore(capCell, row.children[6]);
            }
            if (!selCell) {
                selCell = document.createElement("td");
                selCell.classList.add("sel-cell");
                row.insertBefore(selCell, row.children[7]);
            }
            if (found) {
                capCell.textContent = found.KXRS;
                selCell.textContent = found.YXXKJGRS;
                if (found.YXXKJGRS > found.KXRS) {
                    row.style.backgroundColor = "#ffcccc";
                } else {
                    row.style.backgroundColor = "";
                }
            } else {
                // 调试信息：如果没找到匹配，输出课程文本以便调试
                console.log(`未找到匹配的课程: "${courseText}"`);
            }
        });

        // 刷新时间
        let footer = div.querySelector(".refresh-time");
        if (!footer) {
            footer = document.createElement("div");
            footer.classList.add("refresh-time");
            footer.style.marginTop = "5px";
            footer.style.fontSize = "12px";
            footer.style.color = "#555";
            div.appendChild(footer);
        }
        footer.textContent = "课程余量刷新时间: " + new Date().toLocaleTimeString();

        // 添加页面日志区域
        let pageLogDiv = div.querySelector(".page-log-area");
        if (!pageLogDiv) {
            pageLogDiv = document.createElement("div");
            pageLogDiv.classList.add("page-log-area");
            pageLogDiv.style.marginTop = "10px";
            pageLogDiv.style.border = "1px solid #ddd";
            pageLogDiv.style.borderRadius = "4px";
            pageLogDiv.style.backgroundColor = "#f9f9f9";
            pageLogDiv.innerHTML = `
                <div style="background: #e9e9e9; padding: 4px 8px; font-weight: bold; font-size: 12px; border-bottom: 1px solid #ddd;">
                    人数变动日志
                </div>
                <div class="page-log-content" style="padding: 4px; font-size: 11px; max-height: 120px; overflow-y: auto;">
                    暂无变动记录
                </div>
            `;
            div.appendChild(pageLogDiv);
        }

        // 同步日志内容到页面
        const pageLogContent = pageLogDiv.querySelector(".page-log-content");
        if (pageLogContent && logContent.innerHTML !== '暂无变动记录') {
            pageLogContent.innerHTML = logContent.innerHTML;
        }
    }

    // 筛选重新渲染
    filterFull.addEventListener("change", () => renderResult(lastData));
    filterCampus.addEventListener("change", () => renderResult(lastData));

    // 开始/停止检测
    startBtn.addEventListener("click", async () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            startBtn.textContent = "开始检测";
            footer.textContent = "检测已停止";
            return;
        }
        await fetchSelectedCourses();
        if (selectedCourses.length === 0) {
            alert("未获取到已选课程，请确认是否已登录或有课程");
            return;
        }
        startBtn.textContent = "停止检测";
        checkCourses();
    });

})();
