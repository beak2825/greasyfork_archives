// ==UserScript==
// @name         VJudge-Sync
// @namespace    https://github.com/Tabris-ZX/vjudge-sync
// @version      2.2.3
// @description  VJudge 一键同步归档已绑定的oj过题记录,目前支持洛谷,牛客,cf,atc,qoj,uoj
// @author       Tabris_ZX
// @match        https://vjudge.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// @license      AGPL-3.0

// @connect      vjudge.net
// @connect      luogu.com.cn
// @connect      nowcoder.com
// @connect      codeforces.com
// @connect      kenkoooo.com
// @connect      qoj.ac
// @connect      uoj.ac

// @downloadURL https://update.greasyfork.org/scripts/559149/VJudge-Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/559149/VJudge-Sync.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (!location.host.includes('vjudge.net')) return;

    /*配置项*/
    const GITHUB_CSS_URL = 'https://raw.githubusercontent.com/Tabris-ZX/vjudge-sync/main/Tampermonkey/panel.css';
    const unarchivable_oj = new Set(['牛客']);
    const language_map = new Map([['C++', '2'], ['Java', '4'], ['Python3', '11'], ['C', '39']]);

    /* ================= 加载 CSS 样式 ================= */
    function injectCSS(cssText) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(cssText);
        } else {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = cssText;
            document.head.appendChild(styleEl);
        }
    }

    function loadCSS() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: GITHUB_CSS_URL,
            onload: function (res) {
                if (res.status === 200) injectCSS(res.responseText);
                else console.error('GitHub CSS加载失败，状态码:', res.status);
            },
            onerror: function (err) {
                console.error('GitHub CSS请求失败:', err);
            }
        });
    }

    loadCSS();

    /* ================= 2. 构建 UI DOM ================= */
    const panel = document.createElement('div');
    panel.id = 'vj-sync-panel';
    panel.innerHTML = `
<div id="vj-sync-header">
    <span>vjのAC自动机</span>
    <span id="vj-toggle-btn" class="vj-btn-icon" title="收起/展开">−</span>
</div>
<div id="vj-sync-body">
<span>同步前确保vj上已经绑定好相应oj的账号</span>
    <div class="vj-input-group">
        <label><input type="checkbox" id="vj-lg" /> 洛谷</label>
    </div>
    <div class="vj-input-group">
        <label><input type="checkbox" id="vj-nc" /> 牛客(未完善)</label>
    </div>
    <div class="vj-input-group">
        <label><input type="checkbox" id="vj-cf" /> CodeForces</label>
    </div>
    <div class="vj-input-group">
        <label><input type="checkbox" id="vj-atc" /> AtCoder</label>
    </div>
    <div class="vj-input-group">
        <label><input type="checkbox" id="vj-qoj" /> QOJ</label>
    </div>
    <div class="vj-input-group">
        <label><input type="checkbox" id="vj-uoj" /> UOJ</label>
    </div>
    <button id="vj-sync-btn">一键同步</button>
    <div id="vj-sync-log"></div>
</div>
`;
    document.body.appendChild(panel);

    /* ================= 3. 交互逻辑 (拖拽、折叠、存储) ================= */
    const header = document.getElementById('vj-sync-header');
    const toggleBtn = document.getElementById('vj-toggle-btn');
    const content = document.getElementById('vj-sync-body');
    const logBox = document.getElementById('vj-sync-log');
    // --- 恢复位置 ---
    const savedPos = JSON.parse(localStorage.getItem('vj_panel_pos') || '{"top":"100px","right":"20px"}');
    // 简单的防止溢出屏幕检查
    if (parseInt(savedPos.top) > window.innerHeight - 50) savedPos.top = '100px';
    panel.style.top = savedPos.top;
    panel.style.right = 'auto';
    panel.style.left = savedPos.left || 'auto';
    if (!savedPos.left) panel.style.right = savedPos.right;

    let isCollapsed = localStorage.getItem('vj_panel_collapsed') === 'true';
    if (isCollapsed) {
        content.style.display = 'none';
        toggleBtn.textContent = '+';
    }
    // 恢复各 OJ 的勾选状态
    ['vj-lg', 'vj-cf', 'vj-atc', 'vj-qoj', 'vj-nc', 'vj-uoj'].forEach(id => {
        const saved = localStorage.getItem(id + '_checked');
        if (saved === 'true') {
            const el = document.getElementById(id);
            if (el) el.checked = true;
        }
    });

    ['vj-lg', 'vj-cf', 'vj-atc', 'vj-qoj', 'vj-nc', 'vj-uoj'].forEach(id => {
        document.getElementById(id).addEventListener('change', (e) => {
            localStorage.setItem(id + '_checked', e.target.checked);
        });
    });

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isCollapsed = !isCollapsed;
        content.style.display = isCollapsed ? 'none' : 'block';
        toggleBtn.textContent = isCollapsed ? '+' : '−';
        localStorage.setItem('vj_panel_collapsed', isCollapsed);
    });

    let isDragging = false;
    let dragStart = {x: 0, y: 0};
    let panelStart = {x: 0, y: 0};

    header.addEventListener('mousedown', (e) => {
        if (e.target === toggleBtn) return;
        isDragging = true;
        dragStart = {x: e.clientX, y: e.clientY};
        const rect = panel.getBoundingClientRect();
        panelStart = {x: rect.left, y: rect.top};
        header.style.cursor = 'grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        const newLeft = panelStart.x + dx;
        const newTop = panelStart.y + dy;

        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
        panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'move';
            localStorage.setItem('vj_panel_pos', JSON.stringify({
                left: panel.style.left,
                top: panel.style.top
            }));
        }
    });
    // --- 按钮事件 ---
    document.getElementById('vj-sync-btn').onclick = async function () {
        const btn = this;
        btn.disabled = true;
        btn.textContent = '同步中...';
        logBox.innerHTML = '';

        vjArchived = {};
        const needLg = document.getElementById('vj-lg').checked;
        const needCf = document.getElementById('vj-cf').checked;
        const needAtc = document.getElementById('vj-atc').checked;
        const needQoj = document.getElementById('vj-qoj').checked;
        const needNc = document.getElementById('vj-nc').checked;
        const needUoj = document.getElementById('vj-uoj').checked;

        fetchVJudgeArchived(() => {
            const tasks = [];
            if (needLg) {
                tasks.push(verifyAccount('洛谷').then(account => {
                        if (account == null) log('❌未找到洛谷账号信息');
                        else fetchLuogu(account.match(/\/user\/(\d+)/)[1]);
                    })
                );
            }
            if (needCf) {
                tasks.push(verifyAccount('CodeForces').then(account => {
                        if (account == null) log('❌未找到CodeForces账号信息');
                        else fetchCodeForces(account.replace(/<[^>]*>/g, ''));
                    })
                );
            }
            if (needAtc) {
                tasks.push(verifyAccount('AtCoder').then(account => {
                        if (account == null) log('❌未找到AtCoder账号信息');
                        else fetchAtCoder(account.replace(/<[^>]*>/g, ''));
                    })
                );
            }
            if (needQoj) {
                tasks.push(verifyAccount('QOJ').then(account => {
                        if (account == null) log('❌未找到QOJ账号信息');
                        else fetchQOJ(account.replace(/<[^>]*>/g, ''));
                    })
                );
            }
            if (needNc) {
                tasks.push(verifyAccount('牛客').then(account => {
                        if (account == null) log('❌未找到牛客账号信息');
                        else fetchNowCoder(account.match(/\/profile\/(\d+)/)[1]);
                    })
                );
            }
            if (needUoj) {
                tasks.push(verifyAccount('UniversalOJ').then(account => {
                        if (account == null) log('❌未找到UOJ账号信息');
                        else fetchUOJ(account.replace(/<[^>]*>/g, ''));
                    })
                );
            }
            Promise.all(tasks).finally(() => {
                btn.disabled = false;
                btn.textContent = '一键同步';
            });
        });
    };

    let nc_id;
    let vjArchived = {};

    function log(msg) {
        logBox.style.display = 'block';
        logBox.innerHTML += `<div>${msg}</div>`;
        logBox.scrollTop = logBox.scrollHeight;
    }

    function getVJudgeUsername() {
        const urlMatch = location.pathname.match(/\/user\/([^\/]+)/);
        if (urlMatch) return urlMatch[1];
        const userLink = document.querySelector('a[href^="/user/"]');
        if (userLink) {
            const match = userLink.getAttribute('href').match(/\/user\/([^\/]+)/);
            if (match) return match[1];
        }
        return null;
    }

    //检查vj登录状态
    function fetchVJudgeArchived(callback) {
        const username = getVJudgeUsername();
        if (!username) {
            log('VJudge未登录');
            vjArchived = {};
            if (callback) callback();
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://vjudge.net/user/solveDetail/${username}`,
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    vjArchived = json.acRecords || {};
                    let total = 0;
                    for (let k in vjArchived) total += vjArchived[k].length;
                    log(`VJudge已AC ${total} 题`);
                    if (callback) callback();
                } catch (err) {
                    log('获取VJ记录失败');
                    if (callback) callback();
                }
            }
        });
    }

    // --- 各个OJ的获取逻辑 ---
    function fetchLuogu(user) {
        log('🔄正在同步洛谷数据...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.luogu.com.cn/user/${user}/practice`,
            headers: {'X-Lentille-Request': 'content-only'},
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    const passed = json?.data?.passed || [];
                    const pids = passed.map(x => x.pid);
                    submitVJ('洛谷', pids);
                } catch (err) {
                    log('洛谷数据解析失败');
                    console.log(err)
                }
            },
            onerror: () => log('洛谷请求失败')
        });
    }

    async function fetchNowCoder(user) {
        log('🔄正在同步牛客数据...');
        nc_id = user;
        try {
            const fst = await ncGet(`https://ac.nowcoder.com/acm/contest/profile/${user}/practice-coding?pageSize=1&statusTypeFilter=5&page=1`)
            const cnt = new DOMParser().parseFromString(fst.responseText, "text/html");
            const totalPage = Math.ceil(Number(cnt.querySelector(".my-state-item .state-num")?.innerText) / 200);
            let pids = [];
            for (let i = 1; i <= totalPage; i++) {
                try {
                    const data = await ncGet(`https://ac.nowcoder.com/acm/contest/profile/${user}/practice-coding?pageSize=200&statusTypeFilter=5&page=${i}`)
                    const problems = getNcDetail(data);
                    pids = pids.concat(problems);
                } catch (e) {
                    log(`牛客第 ${i} 页获取失败`);
                }
            }
            const preUniquePids = Array.from(new Map(pids.map(item => [item.problemId, item])).values());
            // 并发检查所有题目的权限
            const checkPromises = preUniquePids.map(async (item) => {
                try {
                    const res = await ncGet(`https://ac.nowcoder.com/acm/problem/${item.problemId}`);
                    const html = res.responseText || '';
                    if (html.includes('没有查看题目的权限哦')) {
                        return null;
                    }
                    return item;
                } catch (e) {
                    return item;
                }
            });
            const results = await Promise.all(checkPromises);
            const uniquePids = results.filter(item => item !== null);
            submitVJ('牛客', uniquePids);
        } catch (err) {
            log(err)
        }
    }

    function fetchCodeForces(user) {
        log('正在同步CF数据...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://codeforces.com/api/user.status?handle=${user}`,
            onload: res => {
                try {
                    const result = JSON.parse(res.responseText).result || [];
                    const pids = result
                        .filter(r => r.verdict === 'OK')
                        .map(r => `${r.problem.contestId}${r.problem.index}`);
                    const uniquePids = [...new Set(pids)];
                    submitVJ('CodeForces', uniquePids);
                } catch (err) {
                    log('CF数据解析失败');
                    console.log(err)
                }
            },
            onerror: () => log('CF请求失败')
        });
    }

    //数据来源:https://github.com/kenkoooo/AtCoderProblems
    function fetchAtCoder(user) {
        log('🔄正在同步AtCoder数据...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${user}&from_second=0`,
            onload: res => {
                try {
                    const list = JSON.parse(res.responseText) || [];
                    const pids = list
                        .filter(r => r.result === 'AC')
                        .map(r => `${r.problem_id}`);
                    const uniquePids = [...new Set(pids)];
                    submitVJ('AtCoder', uniquePids);
                } catch (err) {
                    log('ATC数据解析失败');
                    console.log(err)
                }
            },
            onerror: () => log('ATC请求失败')
        });
    }

    function fetchQOJ(user) {
        log('🔄正在同步QOJ数据...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://qoj.ac/user/profile/${user}`,
            onload: res => {
                try {
                    const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                    const pids = [];
                    doc.querySelectorAll('p.list-group-item-text a').forEach(a => pids.push(a.textContent.trim()));
                    submitVJ('QOJ', pids);
                } catch (err) {
                    log('QOJ解析失败');
                    console.log(err)
                }
            },
            onerror: () => log('QOJ请求失败')
        });
    }

    function fetchUOJ(user) {
        log('🔄正在同步UOJ数据...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://uoj.ac/user/profile/${user}`,
            onload: res => {
                try {
                    const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                    const pids = [];
                    doc.querySelectorAll('ul.uoj-ac-problems-list li a').forEach(a => {
                        const match = a.getAttribute('href').match(/\/problem\/(\d+)/);
                        if (match) pids.push(match[1]);
                    });
                    submitVJ('UniversalOJ', pids);
                } catch (err) {
                    log('UOJ解析失败');
                    console.log(err)
                }
            },
            onerror: () => log('UOJ请求失败')
        });
    }

    // 检查 VJudge 上是否已绑定指定 OJ 账号
    function verifyAccount(oj) {
        log(`🔄正在检查${oj}账号信息...`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://vjudge.net/user/verifiedAccount?oj=${oj}`,
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        const account = data && data.accountDisplay ? data.accountDisplay : null;
                        resolve(account);
                    } catch (err) {
                        resolve(null);
                    }
                },
                onerror: () => log(`${oj}请求失败`)
            });
        });
    }

    // --- 提交逻辑 ---
    async function submitVJ(oj, pids) {
        log(`${oj}:发现${pids.length} AC`);
        const archivedSet = new Set(vjArchived[oj] || []);
        const toSubmit = unarchivable_oj.has(oj)
            ? pids.filter(p => !archivedSet.has(p.problemId))
            : pids.filter(pid => !archivedSet.has(pid));

        if (toSubmit.length === 0) {
            log(`✅${oj}: 所有题目已同步`);
            return;
        }

        // 牛客：同步（顺序）提交
        if (oj === '牛客') {
            let submitCnt = 0;
            let successful = 0;
            const baseDelay = 60000; // 每次提交间隔60秒

            for (let index = 0; index < toSubmit.length; index++) {
                const problem = toSubmit[index];

                const delay = baseDelay + Math.random()*1000 + 10000;
                if (index > 0) {
                    log(`等待 ${Math.round(delay/1000)} 秒后提交下一题...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                const key = `${oj}-${problem.problemId}`;
                let submitted = false;
                try {
                    const check = await ncGet(`https://vjudge.net/problem/data?length=1&OJId=牛客&probNum=${problem.problemId}`);
                    const checkJson = JSON.parse(check.responseText);
                    if (checkJson.data.length === 0) {
                        log(`${oj} ${problem.problemId} 不存在,等待6秒刷新`);
                        await new Promise(resolve => setTimeout(resolve, 6000));
                        const checkAgain = await ncGet(`https://vjudge.net/problem/data?length=1&OJId=牛客&probNum=${problem.problemId}`);
                        const checkAgainJson = JSON.parse(checkAgain.responseText);
                        if (checkAgainJson.data.length === 0) {
                            log(`${oj} ${problem.problemId} 不存在,等待6秒刷新失败`);
                            submitted = true; // 标记为已处理，跳过提交
                            continue;
                        }
                    }
                    const codeResp = await ncGet(`https://ac.nowcoder.com/acm/contest/view-submission?submissionId=${problem.submitId}&returnHomeType=1&uid=${nc_id}`);
                    const code = getNcCode(codeResp.responseText || '');
                    const rd = `\n//${Math.random()}`; // 确保不被判定重复提交
                    const resp = await fetch(`https://vjudge.net/problem/submit/${key}`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: `method=1&language=${encodeURIComponent(problem.language)}&open=1&source=${encodeURIComponent(code + rd)}`
                    });
                    const result = await resp.json();

                    if (result?.runId) {
                        successful++;
                        log(`✅${oj} ${problem.problemId} success`);
                        submitted = true;
                    } else {
                        const isRateLimit = result?.error && result.error.includes('moment')

                        if (isRateLimit){
                            log(`❌${oj} ${problem.problemId} 速率限制,提交暂停`);
                            return;
                        }
                    }
                } catch (err) {
                    log(`❌${oj} ${problem.problemId} error: \n${err.message}`);
                }
                submitCnt++;
                // 每三次提交额外等待20秒
                if (submitCnt % 3 === 0) {
                    const restDelay = 20000;
                    log(`牛客已提交 ${submitCnt} 次，额外等待 ${Math.round(restDelay/1000)} 秒...`);
                    await new Promise(resolve => setTimeout(resolve, restDelay));
                    log('等待完成，继续提交牛客题目');
                }
            }
            log(`🌟${oj}: 同步完成，更新 ${successful} 题`);
            return;
        }

        // 其他 OJ：并发提交
        const promises = toSubmit.map(async (problem, index) => {
            await new Promise(resolve => setTimeout(resolve, index * 50));
            const key = `${oj}-${problem}`;
            try {
                const resp = await fetch(`https://vjudge.net/problem/submit/${key}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: 'method=2&language=&open=0&source='
                });
                const result = await resp.json();
                if (result?.runId) {
                    log(`✅${oj} ${problem} success`);
                    return {success: true, pid: problem};
                } else {
                    log(`❌${oj} ${problem} failed:\n ${result.error}`);
                    return {success: false, pid: problem};
                }
            } catch (err) {
                log(`❌${oj} ${problem} error: \n${err.message}`);
                return {success: false, pid: problem};
            }
        });

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r =>
            r.status === 'fulfilled' && r.value?.success
        ).length;
        log(`🌟${oj}: 同步完成，更新 ${successful} 题`);
    }

    //不能归档的oj专用函数(目前只有牛客)
    const headers = {cookie: 't=23D4F038EFBB4D806311285491E06B25'}; //人机cookie
    function ncGet(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url, headers,
                onload: res => resolve(res),
                onerror: err => reject(err),
            });
        });
    }

    function getNcDetail(data) {
        const result = [];
        const doc = new DOMParser().parseFromString(data.responseText, "text/html");
        doc.querySelectorAll("table.table-hover tbody tr").forEach(tr => {
            const tds = tr.querySelectorAll("td");
            if (tds.length < 8) return;
            const submitId = tds[0].innerText.trim();
            const problemLink = tds[1].querySelector("a")?.getAttribute("href") || "";
            const problemId = problemLink.split("/").pop();
            const language = language_map.get(tds[7].innerText.trim());
            result.push({problemId, submitId, language});
        });
        return result;
    }

    function getNcCode(html) {
        const re = /<pre[^>]*>([\s\S]*?)<\/pre>/i;
        const match = html.match(re);
        if (!match) return '';
        const origCode = match[1];
        return origCode
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    }
}
)
();