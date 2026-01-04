// ==UserScript==
// @name         豆瓣前250名作品采集
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动采集豆瓣排行榜前250作品详细信息并导出（反爬）
// @author       专业开发
// @license      GPL License
// @match        https://movie.douban.com/top250*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547985/%E8%B1%86%E7%93%A3%E5%89%8D250%E5%90%8D%E4%BD%9C%E5%93%81%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/547985/%E8%B1%86%E7%93%A3%E5%89%8D250%E5%90%8D%E4%BD%9C%E5%93%81%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // 样式定义
    const STYLE = `
        #douban-crawler-box {
            position: fixed;
            top: 60px;
            right: 30px;
            background: #fff;
            border: 1px solid #67c23a;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            z-index: 99999;
            border-radius: 8px;
            padding: 16px;
            font-size: 14px;
            min-width: 280px;
            max-width: 400px;
        }
        .crawler-progress {
            margin: 10px 0;
        }
        .crawler-btn {
            background: #67c23a;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin: 4px;
        }
        .crawler-btn:hover {
            background: #409EFF;
        }
        .crawler-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .crawler-log {
            max-height: 150px;
            overflow-y: auto;
            color: #333;
            font-size: 12px;
            margin-top: 6px;
            line-height: 1.5;
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 4px;
            background: #f9f9f9;
        }
        .progress-bar {
            width: 100%;
            height: 6px;
            background: #eee;
            border-radius: 3px;
            overflow: hidden;
            margin: 8px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #67c23a, #409EFF);
            width: 0%;
            transition: width 0.3s ease;
        }
        .status-success { color: #67c23a; font-weight: bold; }
        .status-error { color: #f56c6c; font-weight: bold; }
        .status-warning { color: #e6a23c; font-weight: bold; }
    `;
    GM_addStyle(STYLE);

    // UI界面
    const box = document.createElement('div');
    box.id = 'douban-crawler-box';
    box.innerHTML = `
        <b style='color:#67c23a'>🎬 豆瓣前100采集器</b>
        <div class='crawler-progress'>
            进度：<span id='crawler-rate'>0/100</span>
            <div class='progress-bar'>
                <div class='progress-fill' id='progress-fill'></div>
            </div>
        </div>
        <div>
            <button class='crawler-btn' id='startCrawler'>开始采集</button>
            <button class='crawler-btn' id='pauseCrawler' disabled>暂停</button>
            <button class='crawler-btn' id='exportJSON'>导出JSON</button>
            <button class='crawler-btn' id='exportCSV'>导出CSV</button>
        </div>
        <div class='crawler-log' id='crawlerLog'>点击"开始采集"启动抓取...</div>
    `;
    document.body.appendChild(box);

    // 数据和状态
    let movieList = [];
    let isRunning = false;
    let isPaused = false;
    let currentIndex = 0;

    // 通用请求函数（带反爬措施）
    function makeRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                timeout: 15000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else if (response.status === 418) {
                        reject(new Error('被豆瓣反爬虫拦截 (418)'));
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 日志函数
    function log(message, type = 'info') {
        const logEl = document.getElementById('crawlerLog');
        const time = new Date().toLocaleTimeString();
        const className = type === 'success' ? 'status-success' :
                         type === 'error' ? 'status-error' :
                         type === 'warning' ? 'status-warning' : '';

        logEl.innerHTML += `<div class="${className}">[${time}] ${message}</div>`;
        logEl.scrollTop = logEl.scrollHeight;
        console.log(`[豆瓣采集] ${message}`);
    }

    // 更新进度
    function updateProgress(current, total) {
        document.getElementById('crawler-rate').textContent = `${current}/${total}`;
        const percentage = (current / total) * 100;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }

    // 解析单页数据
    function parsePage(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('.item');
        const movies = [];

        items.forEach(item => {
            try {
                const titleEl = item.querySelector('.title');
                const title = titleEl ? titleEl.textContent.trim() : '';

                const infoEl = item.querySelector('.bd p');
                const infoText = infoEl ? infoEl.textContent.trim() : '';

                // 解析导演和主演
                const infoLines = infoText.split('\n').filter(line => line.trim());
                const firstLine = infoLines || '';
                const secondLine = infoLines[1] || '';

                const ratingEl = item.querySelector('.rating_num');
                const rating = ratingEl ? ratingEl.textContent.trim() : '';

                const linkEl = item.querySelector('.hd a');
                const link = linkEl ? linkEl.href : '';

                const quoteEl = item.querySelector('.quote .inq');
                const quote = quoteEl ? quoteEl.textContent.trim() : '';

                // 提取年份和地区
                const yearMatch = secondLine.match(/(\d{4})/);
                const year = yearMatch ? yearMatch[1] : '';

                movies.push({
                    title: title,
                    director_actors: firstLine,
                    year: year,
                    region_genre: secondLine,
                    rating: rating,
                    quote: quote,
                    link: link,
                    rank: movieList.length + movies.length + 1
                });
            } catch (e) {
                log(`解析单个条目失败: ${e.message}`, 'warning');
            }
        });

        return movies;
    }

    // 主采集函数
    async function startCrawling() {
        if (isRunning) return;

        isRunning = true;
        isPaused = false;
        movieList = [];
        currentIndex = 0;

        document.getElementById('startCrawler').disabled = true;
        document.getElementById('pauseCrawler').disabled = false;

        log('🚀 开始采集豆瓣TOP250前100部电影...', 'success');

        try {
            // 采集前4页（每页25部，共100部）
            for (let page = 0; page < 4; page++) {
                if (!isRunning || isPaused) break;

                const url = `https://movie.douban.com/top250?start=${page * 25}`;
                log(`正在采集第${page + 1}页...`);

                try {
                    const html = await makeRequest(url);
                    const movies = parsePage(html);
                    movieList.push(...movies);

                    currentIndex = movieList.length;
                    updateProgress(currentIndex, 100);

                    log(`第${page + 1}页采集完成，获得${movies.length}部电影`, 'success');

                    // 控制请求频率，避免被封
                    if (page < 3) {
                        log('等待3秒防止反爬...');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                } catch (error) {
                    log(`第${page + 1}页采集失败: ${error.message}`, 'error');

                    // 如果是418错误，等待更长时间
                    if (error.message.includes('418')) {
                        log('检测到反爬拦截，等待10秒后重试...', 'warning');
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        page--; // 重试当前页
                        continue;
                    }
                }
            }

            // 只保留前100部
            movieList = movieList.slice(0, 100);
            updateProgress(movieList.length, 100);

            log(`🎉 采集完成！成功获取${movieList.length}部电影信息`, 'success');

        } catch (error) {
            log(`采集过程出错: ${error.message}`, 'error');
        } finally {
            isRunning = false;
            document.getElementById('startCrawler').disabled = false;
            document.getElementById('pauseCrawler').disabled = true;
        }
    }

    // 暂停功能
    function pauseCrawling() {
        isPaused = true;
        isRunning = false;
        log('⏸️ 用户暂停采集', 'warning');
        document.getElementById('startCrawler').disabled = false;
        document.getElementById('pauseCrawler').disabled = true;
    }

    // 导出JSON
    function exportJSON() {
        if (movieList.length === 0) {
            alert('没有数据可导出！');
            return;
        }

        const jsonData = JSON.stringify(movieList, null, 2);
        GM_setClipboard(jsonData);

        // 同时触发下载
        const blob = new Blob([jsonData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `豆瓣TOP100_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        log(`✅ JSON数据已复制到剪贴板并下载，共${movieList.length}条记录`, 'success');
    }

    // 导出CSV
    function exportCSV() {
        if (movieList.length === 0) {
            alert('没有数据可导出！');
            return;
        }

        const headers = ['排名', '电影名称', '导演主演', '年份', '地区类型', '评分', '经典台词', '豆瓣链接'];
        const csvRows = [headers];

        movieList.forEach(movie => {
            csvRows.push([
                movie.rank,
                `"${movie.title}"`,
                `"${movie.director_actors}"`,
                movie.year,
                `"${movie.region_genre}"`,
                movie.rating,
                `"${movie.quote}"`,
                movie.link
            ]);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], {type: 'text/csv;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `豆瓣TOP100_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.createObjectURL(url);

        log(`✅ CSV文件已下载，共${movieList.length}条记录`, 'success');
    }

    // 绑定事件
    document.getElementById('startCrawler').onclick = startCrawling;
    document.getElementById('pauseCrawler').onclick = pauseCrawling;
    document.getElementById('exportJSON').onclick = exportJSON;
    document.getElementById('exportCSV').onclick = exportCSV;

    log('🎬 豆瓣采集器已就绪！请点击"开始采集"按钮开始抓取数据', 'success');
})();
