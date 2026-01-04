// ==UserScript==
// @name         汽车平台排行榜数据导出
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键导出汽车之家、易车、懂车帝排行榜数据到CSV
// @author       Leo@Trustwin
// @match        https://chejiahao.autohome.com.cn/Authors/RankListNew*
// @match        https://hao.yiche.com/rank/carbuyerRank/
// @match        https://m.dcdapp.com/motor/inapp/ugcs/mp-rank*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js
// @license      All rights reserved
// @license      Do not copy or modify without permission
// @downloadURL https://update.greasyfork.org/scripts/549009/%E6%B1%BD%E8%BD%A6%E5%B9%B3%E5%8F%B0%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/549009/%E6%B1%BD%E8%BD%A6%E5%B9%B3%E5%8F%B0%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(initScript, 2000);
    });

    function initScript() {
        // 根据当前URL确定平台类型
        const currentUrl = window.location.href;
        let platform = '';

        if (currentUrl.includes('autohome.com.cn')) {
            platform = 'autohome';
        } else if (currentUrl.includes('yiche.com')) {
            platform = 'yiche';
        } else if (currentUrl.includes('dcdapp.com')) {
            platform = 'dcd';
        }

        if (platform) {
            addExportButton(platform);
        }
    }

    function addExportButton(platform) {
        // 创建导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.innerHTML = '📊 导出数据';
        exportBtn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        exportBtn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        };

        exportBtn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        };

        exportBtn.onclick = function() {
            exportData(platform);
        };

        document.body.appendChild(exportBtn);
    }

    function exportData(platform) {
        let data = [];

        switch (platform) {
            case 'autohome':
                data = scrapeAutohome();
                break;
            case 'yiche':
                data = scrapeYiche();
                break;
            case 'dcd':
                data = scrapeDcd();
                break;
        }

        if (data.length > 0) {
            downloadCSV(data, platform);
            showNotification(`成功导出 ${data.length} 条数据`);
        } else {
            showNotification('未找到数据，请检查页面结构', 'error');
        }
    }

    function scrapeAutohome() {
        const authors = [];
        const items = document.querySelectorAll('li.data-order');

        items.forEach(item => {
            try {
                const nameElem = item.querySelector('div.data-name span');
                const scoreElem = item.querySelector('div.data-effect');
                const linkElem = item.querySelector('div.data-name a');

                if (nameElem && scoreElem && linkElem) {
                    const name = nameElem.textContent.trim();
                    const score = scoreElem.textContent.trim();
                    const fullLink = linkElem.href;
                    const uid = fullLink.split('/').pop().split('#')[0];
                    const cleanLink = fullLink.split('#')[0];

                    authors.push({
                        name: name,
                        score: score,
                        link: cleanLink,
                        uid: uid
                    });
                }
            } catch (e) {
                console.error('解析汽车之家数据出错:', e);
            }
        });

        return authors;
    }

    function scrapeYiche() {
        const authors = [];

        // 查找前三名作者
        const topAuthors = document.querySelectorAll('div.top-three-item');
        topAuthors.forEach(item => {
            try {
                const nameElem = item.querySelector('p.nickname');
                const scoreElem = item.querySelector('p.zhzs');
                const linkElem = item.querySelector('a');

                if (nameElem && scoreElem && linkElem) {
                    const name = nameElem.textContent.trim();
                    const score = scoreElem.textContent.trim().replace('影响力指数 ', '');
                    const link = 'https:' + linkElem.href;
                    const uid = link.split('u').pop().split('/')[0];

                    authors.push({
                        name: name,
                        score: score,
                        link: link,
                        uid: uid
                    });
                }
            } catch (e) {
                console.error('解析易车前三名数据出错:', e);
            }
        });

        // 查找其他作者
        const otherAuthors = document.querySelectorAll('ul.other-rank-item');
        otherAuthors.forEach(item => {
            try {
                const nameElem = item.querySelector('div.nickname');
                const scoreElem = item.querySelectorAll('li.col-xs-2')[1];
                const linkElem = item.querySelector('a');

                if (nameElem && scoreElem && linkElem) {
                    const name = nameElem.textContent.trim();
                    const score = scoreElem.textContent.trim();
                    const link = 'https:' + linkElem.href;
                    const uid = link.split('u').pop().split('/')[0];

                    authors.push({
                        name: name,
                        score: score,
                        link: link,
                        uid: uid
                    });
                }
            } catch (e) {
                console.error('解析易车其他作者数据出错:', e);
            }
        });

        return authors;
    }

    function scrapeDcd() {
        const authors = [];
        const items = document.querySelectorAll('.sc-jqUVSM.ibEdAU');

        items.forEach(item => {
            try {
                const nameElem = item.querySelector('h5.user-name');
                const scoreElem = item.querySelector('.user-index .user-index-num');

                if (nameElem && scoreElem) {
                    const name = nameElem.textContent.trim();
                    const score = scoreElem.textContent.trim();

                    authors.push({
                        name: name,
                        score: score,
                        link: window.location.href,
                        uid: '' // 懂车帝可能需要不同的UID提取逻辑
                    });
                }
            } catch (e) {
                console.error('解析懂车帝数据出错:', e);
            }
        });

        return authors;
    }

    function downloadCSV(data, platform) {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        const filename = `${platform}_rank_${dateStr}.csv`;

        // 创建CSV内容
        let csvContent = 'name,score,link,uid\n';
        data.forEach(row => {
            csvContent += `"${row.name}","${row.score}","${row.link}","${row.uid}"\n`;
        });

        // 创建Blob并下载
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function showNotification(message, type = 'success') {
        // 移除现有的通知
        const existingNotice = document.getElementById('export-notification');
        if (existingNotice) {
            existingNotice.remove();
        }

        const notice = document.createElement('div');
        notice.id = 'export-notification';
        notice.textContent = message;
        notice.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 10000;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notice);

        // 3秒后自动消失
        setTimeout(() => {
            if (notice.parentNode) {
                notice.parentNode.removeChild(notice);
            }
        }, 3000);
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

})();
