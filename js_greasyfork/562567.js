// ==UserScript==
// @name         国民大朱哥之撸区团播
// @namespace    http://tampermonkey.net/
// @version      10.1
// @description  集大成之作：智能队列 + 独立刷新 + 拖拽/滚动 + 实时英雄显示 + OP.GG直达。
// @author       You
// @match        *://www.douyu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/562567/%E5%9B%BD%E6%B0%91%E5%A4%A7%E6%9C%B1%E5%93%A5%E4%B9%8B%E6%92%B8%E5%8C%BA%E5%9B%A2%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/562567/%E5%9B%BD%E6%B0%91%E5%A4%A7%E6%9C%B1%E5%93%A5%E4%B9%8B%E6%92%B8%E5%8C%BA%E5%9B%A2%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // ⚠️ 核心配置
    // ============================================

    const RIOT_API_KEY = "RGAPI-b18a8d86-5e6b-4d22-960b-f50b17a0c3e7";

    const MY_ROOMS = [
        { id: "8362016", name: "藤原拓海", riotId: "Feofferit#jp1" },
        { id: "12765525", name: "久米隆", riotId:"Dragon9#9000"},
        { id: "11162745", name: "塔塔酱", riotId:"Never Trust LPL#Pyo"},
        { id: "9969774", name: "步成雪", riotId:"Arvyagaberinalbi#JP1"},
        { id: "12742519", name: "羽泽鸫", riotId:"网友張順飛#f8fq"},
        { id: null, name: "青野南", riotId:"qinyenan#9527"},
        { id:"12741089", name: "大飞科", riotId:"Sebastian#10240"},
        { id: null, name: "皮特", riotId:"SKT otto#pite"},
        { id: "2326583", name: "Judy", riotId: "Judy#oasis" },
    ];

    // 全局变量
    let CHAMPION_MAP = null;
    let queryQueue = []; // 自动轮询的队列
    let isQuerying = false;

    // ============================================
    // 样式设置
    // ============================================
    GM_addStyle(`
        @keyframes live-pulse { 0% { box-shadow: 0 0 0 0 rgba(50, 205, 50, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(50, 205, 50, 0); } 100% { box-shadow: 0 0 0 0 rgba(50, 205, 50, 0); } }
        @keyframes game-pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(0, 191, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0); } }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* 主面板 */
        #my-room-nav {
            position: fixed;
            top: 15%;
            right: 20px;
            width: 290px; /* 稍微加宽一点给按钮腾位置 */
            max-height: 80vh;
            background: rgba(20, 20, 35, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            color: #eee;
            font-size: 13px;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: transform 0.1s linear;
            display: flex;
            flex-direction: column;
        }
        #my-room-nav.hidden { transform: translateX(270px) !important; transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }

        .nav-toggle {
            position: absolute; left: -18px; top: 50%; transform: translateY(-50%);
            width: 18px; height: 50px; background: rgba(20, 20, 35, 0.95);
            border-radius: 6px 0 0 6px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; color: #aaa; border: 1px solid rgba(255,255,255,0.1); border-right: none;
        }

        .nav-header-row {
            display: flex; justify-content: center; align-items: center;
            padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);
            cursor: move; user-select: none; flex-shrink: 0;
        }
        .nav-title { margin: 0; font-weight: bold; color: #FFD700; letter-spacing: 1px; pointer-events: none;}

        #room-list-container {
            padding: 10px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #555 transparent;
        }
        #room-list-container::-webkit-scrollbar { width: 6px; }
        #room-list-container::-webkit-scrollbar-track { background: transparent; }
        #room-list-container::-webkit-scrollbar-thumb { background-color: #555; border-radius: 3px; }

        /* 全局刷新按钮 */
        .refresh-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #4ade80; border-radius: 4px; cursor: pointer; font-size: 12px; padding: 2px 8px; margin-left: 10px; transition: all 0.2s; display: inline-flex; align-items: center; height: 24px; }
        .refresh-btn:hover { background: rgba(74, 222, 128, 0.2); border-color: #4ade80; color: #fff; }
        .refresh-icon.rotating { animation: spin 1s linear infinite; }

        .room-item { margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; position: relative; }
        .room-item:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

        .room-header { display: flex; align-items: center; margin-bottom: 6px; padding-bottom: 4px; }
        .room-header:hover .room-name { color: #FFA500; text-decoration: underline; }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #555; margin-right: 8px; flex-shrink: 0; }
        .status-dot.live { background: #32CD32 !important; box-shadow: 0 0 6px #32CD32; animation: live-pulse 2s infinite; }
        .room-name { font-weight: bold; color: #fff; flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 5px; }

        /* 独立刷新按钮 */
        .item-refresh {
            color: #666; font-size: 14px; padding: 0 4px; border-radius: 4px; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .item-refresh:hover { color: #4ade80; background: rgba(255,255,255,0.1); }
        .item-refresh.rotating { animation: spin 0.8s linear infinite; color: #4ade80; pointer-events: none; }

        .ingame-tag { font-size: 10px; color: #00BFFF; border: 1px solid #00BFFF; padding: 0 4px; border-radius: 3px; margin-left: 6px; animation: game-pulse 2s infinite; white-space: nowrap; display: inline-block; vertical-align: middle; }
        .lol-stats { font-size: 11px; color: #aaa; display: flex; flex-direction: column; gap: 4px; }
        .lol-row { display: flex; justify-content: space-between; align-items: center; }
        .time-ago { font-size: 10px; color: #9CA3AF; margin-bottom: 2px; display: block; }
        .rank-text { color: #e0e0e0; font-weight: bold; }
        .match-tag { padding: 1px 5px; border-radius: 3px; font-weight: bold; font-size: 10px; }
        .win { background: #064e3b; color: #34d399; border: 1px solid #059669; }
        .loss { background: #7f1d1d; color: #f87171; border: 1px solid #b91c1c; }
        .champ-name { margin-left: 5px; color: #ddd; }
        .kda-text { margin-left: auto; color: #999; }
        .loading { color: #888; font-style: italic; font-size: 10px; }
        .error-msg { color: #f87171; font-weight: bold; font-size: 11px; }
    `);

    // ============================================
    // UI 初始化
    // ============================================

    function initUI() {
        if(document.getElementById('my-room-nav')) return;
        const container = document.createElement('div');
        container.id = 'my-room-nav';

        // 拖拽逻辑
        let isDragging = false;
        let currentX; let currentY;
        let initialX; let initialY;
        let xOffset = 0; let yOffset = 0;

        function dragStart(e) {
            if (e.target.closest('.nav-header-row') && !e.target.closest('.refresh-btn')) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === container || container.contains(e.target)) isDragging = true;
            }
        }
        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        document.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        // 侧边开关
        const toggle = document.createElement('div');
        toggle.className = 'nav-toggle';
        toggle.innerHTML = '>';
        toggle.onclick = () => {
            container.classList.toggle('hidden');
            toggle.innerText = container.classList.contains('hidden') ? '<' : '>';
        };
        container.appendChild(toggle);

        // 头部
        const headerRow = document.createElement('div');
        headerRow.className = 'nav-header-row';
        headerRow.title = "按住拖拽";

        const title = document.createElement('div');
        title.className = 'nav-title';
        title.innerText = '国民大朱哥撸区团播';

        // 全局刷新按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'refresh-btn';
        refreshBtn.innerHTML = '<span class="refresh-icon">↻</span>';
        refreshBtn.title = '全部刷新 (排队执行)';
        refreshBtn.onclick = () => {
            const icon = refreshBtn.querySelector('.refresh-icon');
            if(icon) icon.classList.add('rotating');
            refreshAll();
            setTimeout(() => { if(icon) icon.classList.remove('rotating'); }, 200);
        };

        headerRow.appendChild(title);
        headerRow.appendChild(refreshBtn);
        container.appendChild(headerRow);

        const listContainer = document.createElement('div');
        listContainer.id = 'room-list-container';
        container.appendChild(listContainer);
        document.body.appendChild(container);

        preloadChampionData();
        refreshAll();
        setInterval(refreshAll, 1200000); // 20分钟全局刷新
    }

    // ============================================
    // 渲染 & 逻辑
    // ============================================
    function refreshAll() {
        const listDiv = document.getElementById('room-list-container');
        listDiv.innerHTML = '';

        queryQueue = [];
        isQuerying = false;

        MY_ROOMS.forEach((room) => {
            const item = document.createElement('div');
            item.className = 'room-item';

            let statsHtml = '';
            if (room.riotId) {
                statsHtml = `
                    <div class="lol-stats loading" id="stats-${room.id}">
                        <span style="color:#666">⏳ 队列中...</span>
                    </div>
                `;
            }

            item.innerHTML = `
                <div class="room-header" title="点击跳转直播间">
                    <div class="status-dot" id="status-${room.id}"></div>
                    <div class="room-name">
                        ${room.name}
                        <span id="ingame-${room.id}"></span>
                    </div>
                    <div class="item-refresh" title="立即刷新此人">↻</div>
                </div>
                ${statsHtml}
            `;

            // --- 事件绑定 ---
            const douyuUrl = `https://www.douyu.com/${room.id}`;
            const header = item.querySelector('.room-header');
            const refreshIcon = item.querySelector('.item-refresh');

            // 1. 独立刷新按钮逻辑
            refreshIcon.onclick = (e) => {
                e.stopPropagation(); // 阻止冒泡，不跳直播间

                // 视觉反馈
                refreshIcon.classList.add('rotating');

                // 立即执行查询
                checkLiveStatus(room.id, item);
                if (room.riotId) {
                    const sDiv = item.querySelector(`#stats-${room.id}`);
                    const iSpan = item.querySelector(`#ingame-${room.id}`);
                    if(sDiv) sDiv.innerText = "正在刷新...";

                    fetchJpData(room.riotId, sDiv, iSpan)
                        .finally(() => {
                            // 移除动画
                            refreshIcon.classList.remove('rotating');
                        });
                } else {
                    // 如果没有riotId，单纯转圈0.5秒示意一下
                    setTimeout(() => refreshIcon.classList.remove('rotating'), 500);
                }
            };

            // 2. 头部点击 -> 直播间
            if (room.riotId) {
                const opggUrl = `https://www.op.gg/summoners/jp/${room.riotId.replace('#', '-')}`;
                item.onclick = () => window.open(opggUrl, '_blank');
                item.title = "点击查看 OP.GG";

                header.onclick = (e) => {
                    // 如果点的是刷新按钮，上面已经stopPropagation了，这里不会触发
                    // 确保没有点到别的
                    e.stopPropagation();
                    window.location.href = douyuUrl;
                };
            } else {
                item.onclick = () => window.location.href = douyuUrl;
            }
            item.onauxclick = (e) => { if(e.button === 1) { e.stopPropagation(); window.open(douyuUrl, '_blank'); } };

            listDiv.appendChild(item);

            // 3. 初始自动加载逻辑
            checkLiveStatus(room.id, item);
            if (room.riotId) {
                queryQueue.push({
                    riotId: room.riotId,
                    statsDiv: item.querySelector(`#stats-${room.id}`),
                    ingameSpan: item.querySelector(`#ingame-${room.id}`)
                });
            }
        });

        processQueue();
    }

    // 队列处理
    function processQueue() {
        if (queryQueue.length === 0) {
            isQuerying = false;
            return;
        }
        isQuerying = true;
        const task = queryQueue.shift();
        if(task.statsDiv) task.statsDiv.innerText = "查询中...";

        fetchJpData(task.riotId, task.statsDiv, task.ingameSpan)
            .finally(() => {
                setTimeout(processQueue, 200);
            });
    }

    function checkLiveStatus(rid, domElement) {
        const dot = domElement.querySelector('.status-dot');
        const nameDiv = domElement.querySelector('.room-name');

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://open.douyucdn.cn/api/RoomApi/room/${rid}`,
            responseType: "json",
            onload: function(response) {
                // nameDiv 里面现在包含了 span 和 textNode，小心操作
                let textNode = nameDiv.childNodes[0];
                let baseName = textNode.textContent;

                if (response.status === 200 && response.response?.data?.room_status === "1") {
                    dot.style.background = ''; dot.className = 'status-dot live';
                    domElement.style.opacity = '1';
                    textNode.textContent = baseName.replace(" (未开播)", "");
                } else {
                    dot.style.background = ''; dot.className = 'status-dot';
                    domElement.style.opacity = '0.7';
                    if (!baseName.includes("(未开播)")) {
                        textNode.textContent += " (未开播)";
                    }
                }
            }
        });
    }

    // ============================================
    // 拳头 API
    // ============================================
    async function fetchJpData(riotIdStr, statsDiv, ingameSpan) {
        if (!statsDiv) return;

        const PLATFORM_HOST = "jp1.api.riotgames.com";
        const REGION_HOST = "asia.api.riotgames.com";
        const [gameName, tagLine] = riotIdStr.split('#');

        // [调试] 输出正在查询谁
        console.log(`[调试] 开始查询: ${riotIdStr}`);

        try {
            statsDiv.innerText = "验证账号...";
            const accountUrl = `https://${REGION_HOST}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${RIOT_API_KEY}`;
            const accountData = await riotRequest(accountUrl);
            const puuid = accountData.puuid;

            statsDiv.innerText = "获取数据...";
            const activeGameUrl = `https://${PLATFORM_HOST}/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${RIOT_API_KEY}`;
            const rankUrl = `https://${PLATFORM_HOST}/lol/league/v4/entries/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
            const matchIdsUrl = `https://${REGION_HOST}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${RIOT_API_KEY}`;

            // 并行查询
            const [rankEntries, matchIds, activeGameResult] = await Promise.all([
                riotRequest(rankUrl),
                riotRequest(matchIdsUrl),
                // [调试] 这里捕获 404 并打印日志
                riotRequest(activeGameUrl).catch(e => {
                    if (e.status === 404) {
                        console.log(`[调试] ${riotIdStr} 游戏状态: 404 (没在玩/延迟/自定义)`);
                        return null;
                    }
                    console.error(`[调试] ${riotIdStr} 游戏状态查询报错:`, e);
                    return Promise.reject(e);
                })
            ]);

            // --- 游戏状态逻辑 ---
            if (activeGameResult && activeGameResult.gameId) {
                console.log(`[调试] ${riotIdStr} 游戏状态: 200 (正在游戏中!)`);
                // 1. 立即显示状态
                ingameSpan.innerHTML = `<span class="ingame-tag">● 游戏中</span>`;

                // 2. 找英雄名
                if (activeGameResult.participants) {
                    const me = activeGameResult.participants.find(p => p.puuid === puuid);
                    if (me) {
                        console.log(`[调试] ${riotIdStr} 找到玩家，英雄ID: ${me.championId}`);
                        getChampionNameById(me.championId).then(champName => {
                            console.log(`[调试] ${riotIdStr} 英雄名解析: ${champName}`);
                            ingameSpan.innerHTML = `<span class="ingame-tag">● 游戏中 (${champName})</span>`;
                        });
                    } else {
                        console.warn(`[调试] ${riotIdStr} 在游戏中，但在玩家列表里找不到自己? PUUID: ${puuid}`);
                    }
                }
            } else {
                // 如果是 404，这里会清空
                ingameSpan.innerHTML = ``;
            }

            // ... (下方段位和战绩代码保持不变，省略以节省篇幅) ...
            // 请保留原脚本下方关于 rankText 和 matchHtml 的处理逻辑

            // --- 为了保证代码完整，这里补全剩余部分 ---
            let rankText = "Unranked";
            const soloRank = rankEntries.find(r => r.queueType === "RANKED_SOLO_5x5");
            if (soloRank) {
                const tiers = { "CHALLENGER": "王者", "GRANDMASTER": "宗师", "MASTER": "大师", "DIAMOND": "钻石", "EMERALD": "翡翠", "PLATINUM": "铂金", "GOLD": "黄金", "SILVER": "白银", "BRONZE": "青铜", "IRON": "黑铁" };
                const tierName = tiers[soloRank.tier] || soloRank.tier;
                rankText = `${tierName} ${soloRank.rank} ${soloRank.leaguePoints}点`;
            }

            let matchHtml = `<div class="lol-row"><span>暂无记录</span></div>`;
            let timeAgoHtml = "";

            if (matchIds.length > 0) {
                const matchDetailUrl = `https://${REGION_HOST}/lol/match/v5/matches/${matchIds[0]}?api_key=${RIOT_API_KEY}`;
                const matchDetail = await riotRequest(matchDetailUrl);

                // ... (时间计算逻辑保持不变) ...
                if (matchDetail.info.gameEndTimestamp) {
                    const diffMs = Date.now() - matchDetail.info.gameEndTimestamp;
                    const diffMins = Math.floor(diffMs / 60000);
                    let timeStr = diffMins < 1 ? "刚刚" : diffMins < 60 ? `${diffMins}分钟前` : diffMins < 1440 ? `${Math.floor(diffMins / 60)}小时前` : `${Math.floor(diffMins / 1440)}天前`;
                    timeAgoHtml = `<span class="time-ago">${timeStr}</span>`;
                }

                const p = matchDetail.info.participants.find(p => p.puuid === puuid);
                if (p) {
                    const isWin = p.win;
                    const kda = `${p.kills}/${p.deaths}/${p.assists}`;
                    const champ = p.championName;
                    const tagClass = isWin ? "win" : "loss";
                    const tagText = isWin ? "胜利" : "失败";
                    matchHtml = `
                        <div class="lol-row">
                            <div style="display:flex; align-items:center;">
                                <span class="match-tag ${tagClass}">${tagText}</span>
                                <span class="champ-name">${champ}</span>
                            </div>
                            <span class="kda-text">${kda}</span>
                        </div>
                    `;
                }
            }

            statsDiv.classList.remove('loading');
            statsDiv.innerHTML = `${timeAgoHtml}<div class="lol-row"><span class="rank-text">${rankText}</span></div>${matchHtml}`;

        } catch (e) {
            console.error("[LOL API Error]", e);
            // ... (错误处理保持不变) ...
            let errMsg = "查询失败";
            if (typeof e === 'object' && e.status) {
                if (e.status === 403) errMsg = "Key无效";
                else if (e.status === 404) errMsg = "查无此人";
                else if (e.status === 429) errMsg = "请求太快";
                else errMsg = `Err ${e.status}`;
            }
            statsDiv.innerHTML = `<span class="error-msg">${errMsg}</span>`;
        }
    }

    function ddragonRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: (res) => {
                    if (res.status === 200) { try { resolve(JSON.parse(res.responseText)); } catch(e) { reject("JSON Bad"); } } else { reject("Status " + res.status); }
                },
                onerror: (err) => reject("Net Err")
            });
        });
    }

    async function preloadChampionData() {
        if (CHAMPION_MAP) return;
        try {
            const versions = await ddragonRequest("https://ddragon.leagueoflegends.com/api/versions.json");
            const latestVer = versions[0];
            const champData = await ddragonRequest(`https://ddragon.leagueoflegends.com/cdn/${latestVer}/data/zh_CN/champion.json`);
            CHAMPION_MAP = {};
            for (let key in champData.data) {
                const champ = champData.data[key];
                CHAMPION_MAP[champ.key] = champ.name;
            }
        } catch (e) { console.error("英雄数据下载失败", e); }
    }

    async function getChampionNameById(id) {
        if (!CHAMPION_MAP) await preloadChampionData();
        return (CHAMPION_MAP && CHAMPION_MAP[id]) ? CHAMPION_MAP[id] : "未知";
    }

    function riotRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, headers: { "User-Agent": navigator.userAgent },
                onload: (res) => {
                    if (res.status === 200) { try { resolve(JSON.parse(res.responseText)); } catch(e) { reject({status: 0, msg: "JSON Bad"}); } } else { reject({status: res.status, msg: res.statusText}); }
                },
                onerror: (err) => reject({status: 0, msg: "Net Err"})
            });
        });
    }

    initUI();
})();