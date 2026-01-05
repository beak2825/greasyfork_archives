// ==UserScript==
// @name         XJTU课程录像分集功能修复
// @namespace    https://github.com/chengdidididi
// @version      1.0
// @description  自动预加载、按课号缓存、按时间排序、分集列表
// @author       chnaxoeng
// @match        *://class.xjtu.edu.cn/course/*
// @match        *://class-rms.xjtu.edu.cn/*
// @connect      class.xjtu.edu.cn
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558424/XJTU%E8%AF%BE%E7%A8%8B%E5%BD%95%E5%83%8F%E5%88%86%E9%9B%86%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/558424/XJTU%E8%AF%BE%E7%A8%8B%E5%BD%95%E5%83%8F%E5%88%86%E9%9B%86%E5%8A%9F%E8%83%BD%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const pageSize = 100 //每次读取的课程数
    const CACHE_PREFIX = "xjtu_course_cache_"; // 缓存前缀，避免和其他数据冲突
    const TARGET_SELECTOR = 'div[data-name="PLAY_RATE"]'; // 注入锚点

    // --- 核心逻辑 ---
    const Core = {//iframe内外的href属性不同，因此要分开处理匹配逻辑

        getCourseId: function() {//提取课号

            const url = window.location.href;
            const pathMatch = url.match(/\/course\/(\d+)/);
            if (pathMatch) return pathMatch[1];

            const paramMatch = url.match(/[?&]course_id=(\d+)/);
            if (paramMatch) return paramMatch[1];
            return null;

        },

        getCurrentActivityId: function() {//尝试获取当前视频的 Activity ID

            const ref = window.location.href;
            const hashMatch = ref.match(/learning-activity#\/(\d+)/);
            if (hashMatch) return parseInt(hashMatch[1]);

            const paramMatch = ref.match(/[?&]activity_id=(\d+)/);
            if (paramMatch) return parseInt(paramMatch[1]);
            return null;
        },


        // iframe内发请求会跨域，要使用GM_xmlhttpRequest封装跨域请求
        request: function(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // 自动携带 cookie
                    anonymous: false,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } catch (e) {
                                reject("解析JSON失败");
                            }
                        } else {
                            reject("HTTP错误: " + response.status);
                        }
                    },
                    onerror: function(err) {
                        reject("网络请求错误");
                    }
                });
            });
        },

        getData: function(callback) {//获取数据 (先读缓存后请求)
            const courseId = this.getCourseId();
            if (!courseId) {
                console.error("无法提取课号，脚本停止");
                return;
            }

            const cacheKey = CACHE_PREFIX + courseId;

            const cachedJson = sessionStorage.getItem(cacheKey);//检查缓存
            if (cachedJson) {
                console.log(`命中缓存 (课号 ${courseId})`);
                callback(JSON.parse(cachedJson));
                return;
            }

            console.log(`正在请求数据 (课号 ${courseId})...`);//无缓存，请求网络

            const conditions = encodeURIComponent(JSON.stringify({// 构造 API 参数
                category: "lesson", class_ids: [], itemsSortBy: { predicate: "chapter", reverse: false }
            }));
            const apiUrl = `https://class.xjtu.edu.cn/api/course/${courseId}/coursewares?conditions=${conditions}&page=1&page_size=${pageSize}`;

            this.request(apiUrl)
            .then(data => {
                if (data && data.activities) {
                    let list = data.activities.map(item => ({
                        id: item.id,
                        title: item.title,
                        time: new Date(item.start_time || item.created_at || 0).getTime()
                    }));

                    list.sort((a, b) => a.time - b.time);

                    sessionStorage.setItem(cacheKey, JSON.stringify(list));
                    console.log(`数据已缓存，共 ${list.length} 集`);

                    callback(list);
                }
            })
            .catch(err => console.error(`请求失败`, err));
        },

        jump: function(activityId) {//执行跳转
            const courseId = this.getCourseId();
            const url = `https://class.xjtu.edu.cn/course/${courseId}/learning-activity#/${activityId}`;
            try {
                window.top.location.href = url;
            } catch (e) {
                window.open(url, '_top');
            }
        }
    };

    // --- 界面 UI ---
    const UI = {

        showList: function(list) {// 创建分集列表弹窗
            const old = document.getElementById('xjtu-helper-list');// 移除旧弹窗
            if (old) old.remove();

            const currentId = Core.getCurrentActivityId();

            const modal = document.createElement('div');// 容器样式
            modal.id = 'xjtu-helper-list';
            modal.style = `
                position: fixed; top: 50px; right: 20px; bottom: 50px; width: 280px;
                background: rgba(30, 30, 30, 0.95); z-index: 99999; color: #fff;
                overflow-y: auto; padding: 15px; border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-size: 13px; font-family: sans-serif;
                scrollbar-width: thin; scrollbar-color: #666 #222;
            `;

            // 标题栏
            const header = document.createElement('div');
            header.innerHTML = `<strong>分集列表 (${list.length})</strong><span style="float:right;cursor:pointer">✖</span>`;
            header.style = "border-bottom: 1px solid #444; padding-bottom: 8px; margin-bottom: 10px;";
            header.querySelector('span').onclick = () => modal.remove();
            modal.appendChild(header);

            // 生成列表项
            list.forEach((item, idx) => {
                const row = document.createElement('div');
                const isCurrent = item.id === currentId;

                // 简单的标题处理：截取日期后的部分，如果太长就截断
                let displayTitle = item.title;

                row.innerText = `${idx + 1}. ${displayTitle}`;
                row.style = `
                    padding: 6px 4px; border-bottom: 1px solid #333; cursor: pointer;
                    color: ${isCurrent ? '#4caf50' : '#ccc'};
                    background: ${isCurrent ? '#2a2a2a' : 'transparent'};
                    font-weight: ${isCurrent ? 'bold' : 'normal'};
                    transition: all 0.2s;
                `;

                // 自动滚动到当前播放的位置
                if (isCurrent) setTimeout(() => row.scrollIntoView({block: "center"}), 100);

                row.onmouseover = () => { if(!isCurrent) row.style.color = '#fff'; row.style.background = '#444'; };
                row.onmouseout = () => { if(!isCurrent) row.style.color = '#ccc'; row.style.background = isCurrent ? '#2a2a2a' : 'transparent'; };

                row.onclick = () => {
                    Core.jump(item.id);
                    modal.remove();
                };
                modal.appendChild(row);
            });

            document.body.appendChild(modal);
        },

        // 创建按钮通用方法
        addBtn: function(text, handler) {
            const btn = document.createElement('div');
            // 样式完全复刻原版倍速按钮
            btn.className = document.querySelector(TARGET_SELECTOR).className;
            btn.style.marginRight = "10px";
            btn.style.cursor = "pointer";

            const span = document.createElement('span');
            span.innerText = text;
            // 尝试复刻内部 span 样式，兜底白色
            const refSpan = document.querySelector(TARGET_SELECTOR + ' span');
            if(refSpan) span.className = refSpan.className;
            else { span.style.color = "#fff"; span.style.fontSize = "14px"; span.style.fontWeight = "600"; }

            btn.appendChild(span);
            btn.onclick = (e) => { e.stopPropagation(); handler(); };
            return btn;
        }
    };

    // --- 启动流程 ---
    function init() {

        Core.getData(() => {}); //预加载数据

        const timer = setInterval(() => {//循环等待注入点
            const target = document.querySelector(TARGET_SELECTOR);
            if (target && target.parentNode) {
                if (document.getElementById('xjtu-helper-flag')) return; // 防止重复
                clearInterval(timer);

                const flag = document.createElement('span'); // 标记已注入
                flag.id = 'xjtu-helper-flag';
                target.parentNode.appendChild(flag);

                // --- 注入分集按钮 ---
                const listBtn = UI.addBtn("分集", () => {
                    Core.getData((list) => UI.showList(list));
                });

                // --- 注入下一集按钮 ---
                const nextBtn = UI.addBtn("下一集", () => {
                    Core.getData((list) => {
                        const currId = Core.getCurrentActivityId();
                        const idx = list.findIndex(i => i.id === currId);

                        if (idx === -1) alert("未找到当前集信息 (可能是新课程，请清除缓存)");
                        else if (idx + 1 < list.length) Core.jump(list[idx + 1].id);
                        else alert("已经是最后一集了");
                    });
                });

                // 插入顺序：分集 -> 下一集 -> 倍速
                target.parentNode.insertBefore(nextBtn, target);
                target.parentNode.insertBefore(listBtn, nextBtn);

                console.log("按钮注入完毕");
            }
        }, 800);
    }

    init();
})();