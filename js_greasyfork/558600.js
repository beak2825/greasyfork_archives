// ==UserScript==
// @name         便捷QQ群成员导出
// @namespace    https://greasyfork.org/zh-CN/users/1449730-%E4%BC%8A%E5%A2%A8
// @version      1.0
// @description  导出QQ群成员为群名+群号+导出时间.csv
// @author       伊墨墨
// @match        https://qun.qq.com/member.html*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558600/%E4%BE%BF%E6%8D%B7QQ%E7%BE%A4%E6%88%90%E5%91%98%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/558600/%E4%BE%BF%E6%8D%B7QQ%E7%BE%A4%E6%88%90%E5%91%98%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        scrollInterval: 800,  // 滚动间隔(ms)
        maxRetries: 20,       // 最大重试次数（判定加载结束）
    };

    let scrollTimer = null;
    let retryCount = 0;
    let lastRowCount = 0;

    // --- 初始化 UI ---
    initUI();

    function initUI() {
        const checkBody = setInterval(() => {
            // 确保页面主体加载完成
            if (document.body && !document.getElementById('qq-export-btn')) {
                const btn = document.createElement('button');
                btn.id = 'qq-export-btn';
                btn.textContent = '导出群成员';
                
                // 悬浮按钮样式
                Object.assign(btn.style, {
                    position: 'fixed',
                    top: '80px',
                    right: '50px',
                    zIndex: '99999',
                    padding: '10px 20px',
                    backgroundColor: '#00a4ff',
                    color: '#fff',
                    border: '2px solid #fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                });

                btn.onmouseover = () => btn.style.backgroundColor = '#008bd9';
                btn.onmouseout = () => btn.style.backgroundColor = '#00a4ff';
                btn.onclick = startProcess;

                document.body.appendChild(btn);
                clearInterval(checkBody);
                console.log('导出按钮已就绪');
            }
        }, 500);
    }

    // --- 流程控制 ---
    function startProcess() {
        const btn = document.getElementById('qq-export-btn');
        const table = document.getElementById('groupMember');

        if (!table) {
            alert('未找到成员表格，请刷新页面重试！');
            return;
        }

        btn.disabled = true;
        btn.style.backgroundColor = '#666';
        
        retryCount = 0;
        lastRowCount = 0;

        // 开始滚动
        scrollTimer = setInterval(() => autoScroll(btn), CONFIG.scrollInterval);
    }

    function autoScroll(btn) {
        // 1. 滚动到底部
        window.scrollTo(0, document.body.scrollHeight);

        // 2. 获取当前已加载的行数
        const rows = document.querySelectorAll('#groupMember tr.mb');
        const currentCount = rows.length;

        // 3. 获取总人数 (从 #groupMemberNum 提取)
        const totalNumEl = document.getElementById('groupMemberNum');
        const totalNum = totalNumEl ? parseInt(totalNumEl.innerText, 10) : 0;

        // 更新按钮状态
        btn.textContent = `加载中... ${currentCount} / ${totalNum || '?'}`;

        // 4. 判定逻辑
        if (currentCount === lastRowCount) {
            retryCount++;
        } else {
            retryCount = 0;
            lastRowCount = currentCount;
        }

        // 停止条件：
        // A. 连续 20 次检查行数都没变 (说明到底了或者卡住了)
        // B. 当前加载数量 >= 页面显示的总人数 (且总人数有效)
        if (retryCount >= CONFIG.maxRetries || (totalNum > 0 && currentCount >= totalNum)) {
            clearInterval(scrollTimer);
            btn.textContent = '正在解析数据...';
            setTimeout(() => parseAndExport(btn), 500);
        }
    }

    // --- 核心：数据提取 ---
    function parseAndExport(btn) {
        try {
            const rows = document.querySelectorAll('#groupMember tr.mb');
            if (rows.length === 0) throw new Error("表格为空");

            // 定义 CSV 表头 (新增了积分列)
            const headers = ['序号', '身份', '群昵称', '群名片', 'QQ号', '性别', 'Q龄', '入群时间', '等级', '积分', '最后发言'];
            let csvContent = '\ufeff' + headers.join(',') + '\n';

            rows.forEach((row) => {
                const cells = row.children;
                if (cells.length < 10) return; 

                // --- 1. 基础信息提取 ---
                const sn = cleanText(cells[1].innerText); // 序号
                
                // 身份与昵称
                const nickTd = cells[2];
                let role = "群员";
                if (nickTd.querySelector('.group-master-a')) role = "群主";
                else if (nickTd.querySelector('.group-manage-a')) role = "管理员";
                
                const nickSpan = nickTd.querySelector('span');
                const nickname = nickSpan ? cleanText(nickSpan.innerText) : "";

                // 群名片
                const cardTd = cells[3];
                const cardSpan = cardTd.querySelector('.group-card');
                const cardName = cardSpan ? cleanText(cardSpan.innerText) : "";

                // 其他基础列
                const qq = cleanText(cells[4].innerText);
                const gender = cleanText(cells[5].innerText);
                const qAge = cleanText(cells[6].innerText);
                const joinTime = cleanText(cells[7].innerText);
                const lastSpeak = cleanText(cells[9].innerText);

                // --- 2. 重点：拆分等级与积分 ---
                // 原始数据格式如: "白雪(1455)" 或 "黑角(0)"
                const rawRank = cleanText(cells[8].innerText); 
                let rankName = rawRank;
                let rankPoints = "0";

                // 使用正则匹配 "名称(数字)" 的格式
                const match = rawRank.match(/^(.*)\((\d+)\)$/);
                if (match) {
                    rankName = match[1]; // "白雪"
                    rankPoints = match[2]; // "1455"
                }

                // --- 3. 组装数据 ---
                const rowData = [
                    sn,
                    role,
                    nickname,
                    cardName,
                    qq,
                    gender,
                    qAge,
                    joinTime,
                    rankName,    // 单独的等级名
                    rankPoints,  // 单独的积分 (Excel里可排序)
                    lastSpeak
                ];

                csvContent += rowData.map(v => escapeCSV(v)).join(',') + '\n';
            });

            downloadCSV(csvContent);
            
            // 恢复按钮
            btn.textContent = '导出完成';
            btn.disabled = false;
            btn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                btn.style.backgroundColor = '#00a4ff';
                btn.textContent = '导出群成员';
            }, 3000);

        } catch (e) {
            console.error(e);
            alert('导出出错: ' + e.message);
            btn.disabled = false;
            btn.textContent = '重试';
        }
    }

    // --- 工具函数 ---

    function cleanText(text) {
        if (!text) return "";
        // 去除首尾空格，并将中间的换行符替换为空格
        return text.trim().replace(/[\r\n]+/g, ' '); 
    }

    function escapeCSV(str) {
        if (str === null || str === undefined) return "";
        str = String(str);
        if (str.search(/("|,|\n)/g) >= 0) {
            str = '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    function downloadCSV(content) {
        // --- 提取群名和群号 ---
        // 对应 DOM: <span id="groupTit">群名(123456)</span>
        let groupName = "未知群";
        let groupID = "";
        
        const titleEl = document.getElementById('groupTit');
        if (titleEl) {
            const fullTitle = cleanText(titleEl.innerText);
            // 尝试匹配 "名称(群号)"
            const match = fullTitle.match(/^(.*?)\((\d+)\)$/);
            if (match) {
                groupName = match[1];
                groupID = match[2];
            } else {
                groupName = fullTitle;
            }
        }

        // 构建文件名: 群名_群号_日期.csv
        const dateStr = new Date().toISOString().slice(0,10);
        let fileName = `${groupName}`;
        if (groupID) fileName += `_${groupID}`;
        fileName += `_${dateStr}.csv`;

        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

})();