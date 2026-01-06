// ==UserScript==
// @name         Bing Rewards移动端专用版
// @namespace    https://greasyfork.org/users/1465776
// @version      1.2.0-Mobile
// @description  专为移动端优化：屏幕右下角悬浮按钮控制，支持跳过等待，支持多api (Modified for Android)
// @author       Yuxcoo
// @license      MIT
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @match        https://rewards.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.guiguiya.com
// @connect      api.gmya.net
// @downloadURL https://update.greasyfork.org/scripts/561613/Bing%20Rewards%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%93%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561613/Bing%20Rewards%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%93%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

const CONFIG = {
    api: {
        keywordApi: 'https://api.gmya.net/Api/',
        searchHost: 'https://www.bing.com'
    },
    search: {
        times: 35,             // 总搜索次数
        delaySecondsMin: 20,   // 常规最小等待 (秒)
        delaySecondsMax: 35,   // 常规最大等待 (秒)
        delaySecondsFirst: 3,  // 首次启动等待 (秒)
        
        // --- 新增：长暂停配置 ---
        longPauseFreq: 4,      // 每隔多少次搜索休息一次
        longPauseMin: 900,     // 长暂停最短时间 (秒)
        longPauseMax: 1100     // 长暂停最长时间 (秒)
    }
};

(function() {
    'use strict';
    if (window.top !== window.self) return;

    const keywordsKey = 'mobile_search_keywords';
    const countKey = 'mobile_count';
    const searchParamKey = 'mobile_param';

    const searchKeySource = [
        { name: '百度热点', action: 'BaiduHot' },
        { name: '抖音热榜', action: 'DouYinHot' },
        { name: 'B站热搜', action: 'BiliHot' },
        { name: '微博热搜', action: 'WeiBoHot' }
    ];

	//适用于guiguiyaApi
    // const searchKeySource = [
        // { name: '百度', action: 'type=baidu' },
        // { name: '抖音', action: 'type=douyin' },
        // { name: '搜狗', action: 'type=sogou' },
        // { name: '哔哩哔哩 热搜榜', action: 'type=bilihot' },
        // { name: '微博', action: 'type=weibo' },
        // { name: '知乎', action: 'type=zhihu' },
        // { name: '今日头条', action: 'type=toutiao' },
        // { name: '网易新闻', action: 'type=netease_news' }
    // ];

    // 默认兜底词库 (当API失败时使用)
    const defaultKeywords = ['大漠孤烟直','海上生明月','飞流直下三千尺','白日依山尽','接天莲叶无穷碧','明月松间照','春风又绿江南岸','欲穷千里目','会当凌绝顶','忽如一夜春风来','人生若只如初见','沉舟侧畔千帆过','不识庐山真面目','有约不来过夜半','醉后不知天在水','休对故人思故国','山有木兮木有枝','侯门一入深如海','桃李春风一杯酒','劝君莫惜金缕衣','采得百花成蜜后','宁可枝头抱香死','年年岁岁花相似','众里寻他千百度','露从今夜白','但愿人长久','浮云游子意','莫愁前路无知己','劝君更尽一杯酒','山回路转不见君','近水楼台先得月','细雨鱼儿出','沾衣欲湿杏花雨','小楼一夜听春雨','停车坐爱枫林晚','窗含西岭千秋雪','黄河远上白云间','采菊东篱下','春蚕到死丝方尽','黄沙百战穿金甲'];

    // --- 样式注入 ---
    GM_addStyle(`
        /* 悬浮球：纯白色不透明，高层级 */
        #mobile-helper-fab {
            position: fixed !important;
            bottom: 80px !important;
            right: 15px !important;
            width: 50px !important;
            height: 50px !important;
            background: rgba(255, 255, 255, 0.65); !important; /* 纯白色半透明背景 */
            border: 2px solid #0078d4 !important;
            border-radius: 50% !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
            z-index: 2147483647 !important; /* 最高层级 */
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            font-size: 24px !important;
            transition: transform 0.2s;
        }
        }#mobile-helper-fab:active { transform: scale(0.9); }

        /* 菜单：白色背景 */
        #mobile-helper-menu {
            position: fixed !important;
            bottom: 140px !important;
            right: 15px !important;
            background: #FFFFFF !important;
            padding: 12px !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25) !important;
            display: none;
            flex-direction: column !important;
            gap: 10px !important;
            z-index: 2147483646 !important;
            width: 140px !important;
            border: 1px solid #eee !important;
        }
        #mobile-helper-menu.show { display: flex !important; }

        .mh-btn {
            background: #f8f9fa !important;
            border: 1px solid #ddd !important;
            padding: 10px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            color: #333 !important;
            text-align: center !important;
        }
        .mh-btn.primary { background: #0078d4 !important; color: white !important; border: none !important; }

        /* 任务面板 */
        #reward-task-mobile {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 88vw !important;
            max-width: 350px !important;
            background: white !important;
            border-radius: 16px !important;
            box-shadow: 0 0 30px rgba(0,0,0,0.5) !important;
            z-index: 2147483647 !important;
            padding: 20px !important;
            text-align: left !important;
        }
        .m-progress { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; margin: 15px 0; }
        .m-bar { height: 100%; background: #0078d4; width: 0%; transition: width 0.3s; }
        .rt-btn-group { display: flex; gap: 10px; margin-top: 15px; }
        .rt-btn { flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; color: white; }
    `);

    // --- 模拟翻页逻辑 ---
    let scrollInterval = null;
    const startSimulatedScroll = () => {
        stopSimulatedScroll();
        scrollInterval = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            const currentScroll = window.scrollY;
            const viewHeight = window.innerHeight;
            
            // 到底回顶
            if ((currentScroll + viewHeight) >= scrollHeight - 50) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
				
				stopSimulatedScroll();
				
                return;
            }

            // 随机决定方向：80%概率向下，20%概率向上
            const isScrollDown = Math.random() > 0.2;
            
            if (isScrollDown) {
                // 向下滑动 (步长 50-150)
                const step = Math.floor(Math.random() * 100) + 50;
                window.scrollBy({ top: step, behavior: 'smooth' });
            } else {
                // 向上滑动 (步长 30-80)，前提是没在顶部
                if (currentScroll > 100) {
                    const step = Math.floor(Math.random() * 50) + 30;
                    window.scrollBy({ top: -step, behavior: 'smooth' });
                }
            }
        }, 300 + Math.random() * 1000); // 间隔也稍微随机一点
    };

    const stopSimulatedScroll = () => {
        if (scrollInterval) clearInterval(scrollInterval);
    };

    // --- 核心搜索逻辑 ---
    const search = () => {
        // 当前第几次 (1开始)
        const count = GM_getValue(countKey, 1);
        
        // 检查完成
        if (count > CONFIG.search.times) {
            alert('今日任务已完成！');
            GM_setValue(countKey, 1);
            return;
        }

        // 计算延迟时间
        let delay = 0;
        let isLongWait = false;

        if (count === 1) {
            delay = CONFIG.search.delaySecondsFirst;
        } else {
            // 检查是否需要长暂停 (已完成次数 % 4 == 0)
            // count-1 是已完成的次数，count是当前
            const completed = count - 1;
            if (completed > 0 && completed % CONFIG.search.longPauseFreq === 0) {
                // 触发长暂停
                delay = Math.floor(Math.random() * (CONFIG.search.longPauseMax - CONFIG.search.longPauseMin + 1)) + CONFIG.search.longPauseMin;
                isLongWait = true;
            } else {
                // 普通随机延迟
                delay = Math.floor(Math.random() * (CONFIG.search.delaySecondsMax - CONFIG.search.delaySecondsMin + 1)) + CONFIG.search.delaySecondsMin;
            }
        }

        // UI显示
        startSimulatedScroll(); // 开始模拟翻页
        showTaskUI(count, delay, isLongWait, () => {
            stopSimulatedScroll();
            getKeywords().then(word => {
                // 构造搜索URL
                const param = `?q=${encodeURIComponent(word)}&form=QBLH&cvid=${generateRandomString(32)}`;
                
                GM_setValue(countKey, count + 1);
                GM_setValue(searchParamKey, param);
                
                location.href = CONFIG.api.searchHost + '/search' + param;
            });
        });
    };

	// --- 获取关键词 (含默认词兜底 + 随机后缀) ---
    const getKeywords = (force = false) => {
        return new Promise((resolve) => {
            const cache = GM_getValue(keywordsKey);
            const today = new Date().setHours(0,0,0,0);

            // 1. 使用缓存
            if (!force && cache && cache.time === today && cache.list.length > 0) {
                const word = cache.list.shift();
                GM_setValue(keywordsKey, cache);
                // 缓存取词时添加后缀
                resolve(word + " " + generateRandomString(4));
                return;
            }

            // 2. 请求API
            const source = searchKeySource[Math.floor(Math.random() * searchKeySource.length)];
            const url = CONFIG.api.keywordApi + source.action + '?format=json';

            console.log("Fetching keywords from:", url);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 5000,
                onload: (res) => {
                    try {
                        const json = JSON.parse(res.responseText);
                        let list = [];
                        if (json && json.data && Array.isArray(json.data)) {
                             list = json.data.map(i => i.title || i.name || i.content).filter(x => x);
                        }

                        if (list.length === 0) throw new Error("API返回空数据");

                        // 成功获取
                        GM_setValue(keywordsKey, { time: today, list: list });
                        
                        // API获取新词时，添加后缀
                        if (force) {
                            resolve(list.length);
                        } else {
                            resolve(list[0] + " " + generateRandomString(4));
                        }

                    } catch (e) {
                        console.error("API解析失败，使用默认词库", e);
                        resolve(useDefaultKeyword(force));
                    }
                },
                onerror: (e) => {
                    console.error("网络请求失败，使用默认词库", e);
                    resolve(useDefaultKeyword(force));
                },
                ontimeout: () => {
                    console.error("请求超时，使用默认词库");
                    resolve(useDefaultKeyword(force));
                }
            });
        });
    };
	
	
    // 辅助：获取默认词
    const useDefaultKeyword = (isCount = false) => {
        if (isCount) return 0; // 更新模式下失败返回0
        const word = defaultKeywords[Math.floor(Math.random() * defaultKeywords.length)];
        return word + " " + generateRandomString(4); // 加随机后缀防止完全重复
    };

    const generateRandomString = (len) => Math.random().toString(36).substring(2, 2 + len);

    // --- UI 创建 ---
    const createUI = () => {
        if (document.getElementById('mobile-helper-fab')) return;

        const fab = document.createElement('div');
        fab.id = 'mobile-helper-fab';
        fab.innerHTML = '🎁';
        fab.onclick = () => document.getElementById('mobile-helper-menu').classList.toggle('show');
        document.body.appendChild(fab);

        const menu = document.createElement('div');
        menu.id = 'mobile-helper-menu';
        menu.innerHTML = `
            <div style="font-size:12px;color:#999;text-align:center;margin-bottom:5px">积分助手 V1.2</div>
            <button class="mh-btn primary" id="mh-start">开始搜索</button>
            <button class="mh-btn" id="mh-update">更新词库</button>
            <button class="mh-btn" id="mh-reset">重置计数</button>
            <button class="mh-btn" id="mh-go-reward">积分面板</button>
        `;
        document.body.appendChild(menu);

        document.getElementById('mh-start').onclick = () => {
            document.getElementById('mobile-helper-menu').classList.remove('show');
            search();
        };

        // 更新词库 + 自动重置
        document.getElementById('mh-update').onclick = () => {
            const btn = document.getElementById('mh-update');
            const originalText = btn.innerText;
            btn.innerText = '更新中...';
            btn.disabled = true;
            
            getKeywords(true).then(n => {
                // 更新成功后重置计数
                GM_setValue(countKey, 1);
                alert(`词库更新成功 (${n}条)\n搜索次数已自动重置为 0`);
            }).catch(() => {
                GM_setValue(countKey, 1);
                alert('更新遇到问题，已重置次数，将使用默认词库。');
            }).finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        };

        document.getElementById('mh-reset').onclick = () => {
            GM_setValue(countKey, 1);
            alert('计数已重置为 0');
        };
        document.getElementById('mh-go-reward').onclick = () => {
            location.href = 'https://rewards.bing.com/';
        };
    };

    // 显示倒计时卡片
    const showTaskUI = (current, delay, isLongWait, callback) => {
        const old = document.getElementById('reward-task-mobile');
        if (old) old.remove();

        // UI显示：已完成 current - 1，current 是“当前第几次”
        // 当 current=1 时，显示 已完成 0
        const completed = current - 1;
        const total = CONFIG.search.times;
        const percentage = (completed / total) * 100;

        const statusText = isLongWait 
            ? `<span style="color:#FF5722;font-weight:bold">☕ 休息中...</span>` 
            : `<span style="color:#0078d4">⚡ 正在运行...</span>`;

        const ui = document.createElement('div');
        ui.id = 'reward-task-mobile';
        ui.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font-weight:bold;font-size:16px">积分助手</span>
                <span style="font-size:12px;background:#eee;padding:2px 6px;border-radius:4px">V1.2</span>
            </div>
            
            <div class="rt-row" style="margin-bottom:5px;font-size:14px">
                <span>状态:</span> ${statusText}
            </div>
            <div class="rt-row" style="font-size:14px">
                <span>已完成:</span> <strong>${completed} / ${total}</strong>
            </div>

            <div class="m-progress"><div class="m-bar" style="width:${percentage}%"></div></div>
            
            <div id="rt-timer" style="color:#E6A23C;font-size:15px;text-align:center;font-weight:bold;margin:15px 0">
                等待倒计时: ${delay} s
            </div>
            
            <div style="font-size:12px;color:#999;text-align:center;margin-bottom:10px">
                🤖 正在帮你浏览...
            </div>
            
            <div class="rt-btn-group">
                <button class="rt-btn" style="background:#4CAF50" id="rt-skip">跳过等待</button>
                <button class="rt-btn" style="background:#f44336" id="rt-stop">停止运行</button>
            </div>
        `;
        document.body.appendChild(ui);

        let remain = delay;
        // 使用 Worker 计时防止后台冻结
        const blob = new Blob([`
            let timer = null;
            self.onmessage = function(e) {
                if (e.data === 'start') {
                    timer = setInterval(() => self.postMessage('tick'), 1000);
                } else if (e.data === 'stop') {
                    clearInterval(timer);
                }
            }
        `]);
        const worker = new Worker(URL.createObjectURL(blob));
        
        worker.onmessage = () => {
            remain--;
            const timerEl = document.getElementById('rt-timer');
            if (timerEl) {
                timerEl.innerText = `等待倒计时: ${remain} s`;
                if (isLongWait) {
                     timerEl.innerText += ` (休息中)`;
                }
            }

            if (remain <= 0) {
                finish();
            }
        };
        worker.postMessage('start');

        const finish = () => {
            worker.postMessage('stop');
            worker.terminate();
            if(document.getElementById('reward-task-mobile')) {
                document.getElementById('reward-task-mobile').remove();
            }
            callback();
        };

        document.getElementById('rt-skip').onclick = finish;
        document.getElementById('rt-stop').onclick = () => {
            worker.postMessage('stop');
            worker.terminate();
            stopSimulatedScroll();
            if(document.getElementById('reward-task-mobile')) {
                document.getElementById('reward-task-mobile').remove();
            }
        };
    };

    // --- 初始化入口 ---
    if (location.host.includes('bing.com')) {
        createUI();
        const lastParam = GM_getValue(searchParamKey);
        
        // 自动接续运行判定
        if (location.search === lastParam && location.pathname.includes('/search')) {
            // 稍作延迟，让人眼能看到页面
            setTimeout(search, 2000);
        }
    }
})();