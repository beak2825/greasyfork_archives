// ==UserScript==
// @name         阿里国际站咨询分配记录采集导出
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  采集分配记录并导出为Excel（支持iframe自动采集）
// @author       树洞先生
// @license      MIT
// @match        https://message.alibaba.com/message/default.htm*
// @match        https://message.alibaba.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547996/%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E5%92%A8%E8%AF%A2%E5%88%86%E9%85%8D%E8%AE%B0%E5%BD%95%E9%87%87%E9%9B%86%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/547996/%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E5%92%A8%E8%AF%A2%E5%88%86%E9%85%8D%E8%AE%B0%E5%BD%95%E9%87%87%E9%9B%86%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动注入XLSX库到主页面（如果未定义）
    if (!window.XLSX) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        document.head.appendChild(script);
    }

    // 采集当前页数据（只采集指定字段）
    function parsePage() {
        const results = [];
        document.querySelectorAll('.assign-list-item').forEach(item => {
            const subject = item.querySelector('.inquiry-subject')?.innerText.trim() || '';
            const contact_name = item.querySelector('.contact-name')?.innerText.trim() || '';
            // 新增：采集买家邮箱，修正为通过.contact-email类获取
            const contact_email = item.querySelector('.contact-email')?.innerText.trim() || '';
            const assign_date = item.querySelector('.assign-date')?.innerText.trim() || '';
            const assign_time = item.querySelector('.assign-time')?.innerText.trim() || '';
            const assign_content = item.querySelector('.assign-content')?.innerText.trim() || '';
            const assign_reason = item.querySelector('.assign-reason')?.innerText.trim() || '';
            results.push({
                '主题': subject,
                '买家': contact_name,
                '买家邮箱': contact_email,
                '分配日期': assign_date,
                '分配时间': assign_time,
                '分配人&被分配人': assign_content,
                '原因': assign_reason
            });
        });
        return results;
    }

    // 等待页面加载
    function waitForSelector(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const interval = 200;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if ((elapsed += interval) >= timeout) {
                    clearInterval(timer);
                    reject('Timeout');
                }
            }, interval);
        });
    }

    // 导出为Excel，列宽自适应，首列为序号
    function exportToExcel(data) {
        // 增加序号列
        const dataWithIndex = data.map((row, idx) => ({ '序号': idx + 1, ...row }));
        const ws = XLSX.utils.json_to_sheet(dataWithIndex);
        // 自动列宽
        const cols = Object.keys(dataWithIndex[0] || {}).map(key => {
            const maxLen = Math.max(
                key.length,
                ...dataWithIndex.map(row => (row[key] ? String(row[key]).length : 0))
            );
            return { wch: maxLen + 2 };
        });
        ws['!cols'] = cols;
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "分配记录");
        XLSX.writeFile(wb, "咨询分配明细.xlsx");
    }

    // 翻页并采集所有数据，每采集一页就导出一次Excel
    async function collectAllPagesWithStepExport(btn) {
        let allResults = [];
        let page = 1;
        let lastFirstId = null;
        let failCount = 0;
        const maxFail = 3; // 连续3次超时则停止
        while (true) {
            btn.innerText = `采集中...第${page}页`;
            try {
                await waitForSelector('.assign-list-item', 60000); // 超时60秒
            } catch (e) {
                console.warn(`第${page}页超时，跳过！`);
                failCount++;
                if (failCount >= maxFail) {
                    console.error('连续多页超时，采集终止。');
                    break;
                }
                // 尝试点击下一页
                const nextBtn = document.querySelector('.next-pagination-item.next-next:not([disabled])');
                if (nextBtn && !nextBtn.classList.contains('next-btn-disabled')) {
                    nextBtn.click();
                    page++;
                    await new Promise(r => setTimeout(r, 1000));
                    continue;
                } else {
                    break;
                }
            }
            failCount = 0; // 成功采集后重置失败计数
            let firstItem = document.querySelector('.assign-list-item');
            let firstId = firstItem ? firstItem.innerText : '';
            if (lastFirstId && firstId === lastFirstId) {
                await new Promise(r => setTimeout(r, 500));
                continue;
            }
            lastFirstId = firstId;
            const pageData = parsePage();
            allResults = allResults.concat(pageData);
            console.log(`已采集第${page}页，本页${pageData.length}条，总计${allResults.length}条`);
            // 不再每页导出
            // exportToExcel(allResults);

            const nextBtn = document.querySelector('.next-pagination-item.next-next:not([disabled])');
            if (nextBtn && !nextBtn.classList.contains('next-btn-disabled')) {
                nextBtn.click();
                page++;
                await new Promise(r => setTimeout(r, 1000));
            } else {
                break;
            }
        }
        // 只在全部采集完成后导出一次
        exportToExcel(allResults);
        return allResults;
    }

    // 添加按钮到页面
    function addExportButton() {
        if (document.getElementById('export-assign-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'export-assign-btn';
        btn.innerText = '导出分配记录Excel';
        btn.style.background = '#ff9900';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '8px 15px';
        btn.style.fontSize = '14px';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.marginLeft = '24px';

        btn.onclick = async function() {
            btn.innerText = '检测数据加载中...';
            btn.disabled = true;
            let tryCount = 0;
            while (document.querySelectorAll('.assign-list-item').length === 0 && tryCount < 120) {
                await new Promise(r => setTimeout(r, 500));
                tryCount++;
            }
            if (document.querySelectorAll('.assign-list-item').length === 0) {
                alert('页面数据长时间未加载，请确认已登录且无验证码/滑块，再重试！');
                btn.innerText = '导出分配记录Excel';
                btn.disabled = false;
                return;
            }
            btn.innerText = '采集中...';
            try {
                await collectAllPagesWithStepExport(btn);
                alert('采集完成，已保存为 咨询分配明细.xlsx');
            } catch (e) {
                alert('采集失败: ' + e + '\n已采集数据已保存到 咨询分配明细.xlsx');
            }
            btn.innerText = '导出分配记录Excel';
            btn.disabled = false;
        };

        // 插入到 h1.assign-log-title 右侧，使用 flex 容器
        const h1 = document.querySelector('h1.assign-log-title');
        if (h1 && h1.parentNode) {
            // 检查是否已包裹在 flex 容器
            let flexDiv = h1.parentNode;
            if (!flexDiv.classList.contains('ai-flex-row')) {
                // 创建 flex 容器
                flexDiv = document.createElement('div');
                flexDiv.style.display = 'flex';
                flexDiv.style.alignItems = 'center';
                flexDiv.className = 'ai-flex-row';
                h1.parentNode.insertBefore(flexDiv, h1);
                flexDiv.appendChild(h1);
            }
            flexDiv.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
    }

    // 自动检测当前页面或iframe，插入按钮
    function tryInject() {
        // 如果当前页面有数据，直接插入按钮
        if (document.querySelectorAll('.assign-list-item').length > 0) {
            addExportButton();
            return;
        }
        // 否则查找inquiry-assign-log-iframe
        const iframe = document.getElementById('inquiry-assign-log-iframe');
        if (iframe && iframe.contentWindow) {
            // 注入XLSX库并等待其可用
            function injectXLSXandButton() {
                function waitForXLSXAndInject() {
                    if (iframe.contentWindow.XLSX) {
                        iframe.contentWindow.eval('(' + addExportButton.toString() + ')();');
                    } else {
                        setTimeout(waitForXLSXAndInject, 100);
                    }
                }
                if (!iframe.contentWindow.XLSX) {
                    const script = iframe.contentDocument.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
                    script.onload = waitForXLSXAndInject;
                    iframe.contentDocument.head.appendChild(script);
                } else {
                    waitForXLSXAndInject();
                }
            }
            iframe.addEventListener('load', injectXLSXandButton);
            // 如果iframe已加载，立即注入
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                injectXLSXandButton();
            }
        }
    }

    // 页面加载后自动检测并注入
    window.addEventListener('load', tryInject);

})();