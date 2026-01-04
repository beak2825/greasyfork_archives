// ==UserScript==
// @name         二战-多功能合一
// @namespace    http://tampermonkey.net/
// @version      2025-11-20
// @description  合并自动领奖、膜拜安抚、科技加速、军官管理/招募、倒计时等功能
// @author       You
// @match        http://ezfk.tqjy666.com:10005/*
// @icon         http://ezfk.tqjy666.com:10005/Public/image/ezfk.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556243/%E4%BA%8C%E6%88%98-%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%90%88%E4%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/556243/%E4%BA%8C%E6%88%98-%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%90%88%E4%B8%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------- 功能1: 自动领取奖励/膜拜+安抚人口 --------
    if (location.pathname.startsWith('/home/task/indexaction') ||
        location.pathname.startsWith('/home/task/index')) {
        // 自动领取奖励
        document.querySelectorAll('a[href*="/home/task/getaction/id/"]').forEach(
            function (rewardA) {
                if (rewardA.classList.contains("auto-get-reward")) {
                    return;
                }
                rewardA.classList.add("auto-get-reward");
                let btn = document.createElement("button");
                btn.textContent = "自动领取";
                btn.style.marginLeft = "8px";
                btn.style.background = "#d2ffd2";
                btn.style.cursor = "pointer";
                btn.onclick = function () {
                    btn.textContent = "领取中...";
                    btn.disabled = true;
                    fetch(rewardA.href, {
                            credentials: "same-origin"
                        })
                        .then(resp => resp.text())
                        .then(data => {
                            if (data.includes("成功") || data.includes("领取成功")) {
                                btn.textContent = "领取成功";
                            } else if (data.includes("已领取") || data.includes("已领取过")) {
                                btn.textContent = "已领取过";
                            } else {
                                btn.textContent = "领取失败";
                                setTimeout(() => {
                                    btn.textContent = "自动领取";
                                    btn.disabled = false;
                                }, 1500);
                            }
                        })
                        .catch(() => {
                            btn.textContent = "网络错误";
                            setTimeout(() => {
                                btn.textContent = "自动领取";
                                btn.disabled = false;
                            }, 1500);
                        });
                };
                rewardA.after(btn);
            });

        // 自动点击全部“自动领取”按钮
        document.querySelectorAll("button").forEach(btn => {
            if (btn.textContent === "自动领取") {
                btn.click();
            }
        });

        // 页面唯一的 膜拜+安抚人口 按钮
        if (!document.querySelector("#autoPraisePlacateBtn")) {
            const btn2 = document.createElement("button");
            btn2.id = "autoPraisePlacateBtn";
            btn2.textContent = "膜拜+安抚人口";
            btn2.style.position = "fixed";
            btn2.style.top = "10px";
            btn2.style.right = "10px";
            btn2.style.zIndex = "9999";
            btn2.style.background = "#fbffeb";
            btn2.style.border = "1px solid #aaa";
            btn2.style.color = "#333";
            btn2.style.cursor = "pointer";
            btn2.style.padding = "5px 12px";
            btn2.style.boxShadow = "0 2px 8px #8882";
            btn2.onclick = function () {
                btn2.textContent = "膜拜中...";
                btn2.disabled = true;
                fetch("/home/ranking/praise/id/333.html", {
                        credentials: "same-origin"
                    })
                    .then(resp => resp.text())
                    .then(data => {
                        if (data.includes("成功") || data.includes("膜拜成功")) {
                            btn2.textContent = "膜拜成功，安抚中...";
                        } else {
                            btn2.textContent = "膜拜失败，安抚中...";
                        }
                        return fetch("/home/city/placate/sure/1.html", {
                            credentials: "same-origin"
                        });
                    })
                    .then(resp => resp.text())
                    .then(data => {
                        if (data.includes("成功") || data.includes("安抚成功")) {
                            btn2.textContent = "膜拜+安抚已成功";
                        } else {
                            btn2.textContent = "安抚失败";
                        }
                        setTimeout(() => {
                            btn2.textContent = "膜拜+安抚人口";
                            btn2.disabled = false;
                        }, 2500);
                    })
                    .catch(() => {
                        btn2.textContent = "网络错误";
                        setTimeout(() => {
                            btn2.textContent = "膜拜+安抚人口";
                            btn2.disabled = false;
                        }, 2000);
                    });
            };
            document.body.appendChild(btn2);
        }
    }

    // -------- 功能2: 升级倒计时页面（军事/科技页面） --------
    if (
        location.pathname.startsWith('/home/building/militaryindex') ||
        // home/building/sourceindex
        location.pathname.startsWith('/home/tech/index') ||
        location.pathname.startsWith('/home/building/sourceindex')

    ) {
        const timeReg = /(\d+时)?(\d+分)?(\d+秒)/g;

        function parseTimeToSeconds(str) {
            let hour = 0,
                min = 0,
                sec = 0;
            let h = str.match(/(\d+)时/);
            let m = str.match(/(\d+)分/);
            let s = str.match(/(\d+)秒/);
            if (h) {
                hour = Number(h[1]);
            }
            if (m) {
                min = Number(m[1]);
            }
            if (s) {
                sec = Number(s[1]);
            }
            return hour * 3600 + min * 60 + sec;
        }

        function formatSeconds(secs) {
            if (secs <= 0) {
                return "已结束";
            }
            let h = Math.floor(secs / 3600);
            let m = Math.floor((secs % 3600) / 60);
            let s = secs % 60;
            let text = "";
            if (h) {
                text += h + "时";
            }
            if (m || h) {
                text += m + "分";
            }
            text += s + "秒";
            return text;
        }

        let nodeList = [];
        let triggeredRefresh = false;

        function scanTextNodes() {
            nodeList = [];
            const walker = document.createTreeWalker(document.body,
                NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                let originText = node.nodeValue;
                let matches = [],
                    m;
                while ((m = timeReg.exec(originText)) !== null) {
                    let countdown = parseTimeToSeconds(m[0]);
                    if (countdown > 0) {
                        matches.push({
                            index: m.index,
                            length: m[0].length,
                            remain: countdown,
                            raw: m[0]
                        });
                    }
                }
                if (matches.length > 0) {
                    nodeList.push({
                        node: node,
                        origin: originText,
                        times: matches
                    });
                }
            }
        }

        scanTextNodes();
        setInterval(() => {
            if (triggeredRefresh) {
                return;
            }
            nodeList.forEach(item => {
                let txt = item.origin;
                let offset = 0;
                item.times.forEach((t, i) => {
                    if (t.remain > 0) {
                        t.remain--;
                        let newStr = formatSeconds(t.remain);
                        txt = txt.slice(0, t.index + offset) + newStr + txt.slice(
                            t.index + offset + t.length);
                        offset += newStr.length - t.length;
                        t.length = newStr.length;
                    } else if (t.remain === 0) {
                        let newStr = "已结束";
                        txt = txt.slice(0, t.index + offset) + newStr + txt.slice(
                            t.index + offset + t.length);
                        offset += newStr.length - t.length;
                        t.length = newStr.length;
                        t.remain = -1;
                        //alert("升级完成");
                        if (!triggeredRefresh) {
                            triggeredRefresh = true;
                            setTimeout(function () {
                                location.reload();
                            }, 300);
                        }
                    }
                });
                item.node.nodeValue = txt;
            });
        }, 1000);
        const observer = new MutationObserver(() => {
            scanTextNodes();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // -------- 功能3: 科技加速按钮（仅含加速/取消行） --------
    if (location.pathname.startsWith('/home/tech/index')) {
        const table = document.querySelector("table");
        if (table) {
            Array.from(table.querySelectorAll("tr")).forEach(tr => {
                let lastTd = tr.lastElementChild;
                if (!lastTd) {
                    return;
                }
                let quickenA = lastTd.querySelector(
                    'a[href*="/home/tech/prequicken/id/"]');
                let cancelA = lastTd.querySelector(
                    'a[href*="/home/tech/precancel/id/"]');
                let id = null;
                if (quickenA) {
                    let m = quickenA.href.match(/id\/(\d+)/);
                    if (m) {
                        id = m[1];
                    }
                } else if (cancelA) {
                    let m = cancelA.href.match(/id\/(\d+)/);
                    if (m) {
                        id = m[1];
                    }
                }
                if (!id) {
                    return;
                }
                let btn15 = document.createElement("a");
                btn15.textContent = "[加速15分钟]";
                btn15.href =
                    `/home/tech/quicken/user_tech_id/${id}/build_sure/sure/user_goods_id/49933.html`;
                btn15.style.marginLeft = "8px";
                btn15.style.color = "#1976d2";
                let btn60 = document.createElement("a");
                btn60.textContent = "[加速60分钟]";
                btn60.href =
                    `/home/tech/quicken/user_tech_id/${id}/build_sure/sure/user_goods_id/51482.html`;
                btn60.style.marginLeft = "8px";
                btn60.style.color = "#d2691e";
                lastTd.appendChild(btn15);
                lastTd.appendChild(btn60);
            });
        }
    }

    // -------- 功能4: 军官管理页面（任命市长、穿衣等按钮） --------
    if (location.pathname.startsWith('/home/acade/index')) {
        function findMayorId() {
            let mayorId = null;
            document.querySelectorAll(
                'a[href*="/home/acade/view/acade_id/"]').forEach(viewA => {
                let found = false;
                let node = viewA;
                for (let i = 0; i < 30 && node; i++) {
                    node = node.nextSibling;
                    if (!node) {
                        break;
                    }
                    if (node.nodeType === 3 && node.nodeValue && node.nodeValue.indexOf(
                            "状态:市长") >= 0) {
                        found = true;
                        break;
                    }
                    if (node.nodeType === 1 && node.textContent &&
                        node.textContent.indexOf("状态:市长") >= 0) {
                        found = true;
                        break;
                    }
                }
                if (found && !mayorId) {
                    let mid = viewA.href.match(/acade_id\/(\d+)/);
                    if (mid) {
                        mayorId = mid[1];
                    }
                }
            });
            return mayorId;
        }

        function addAjaxButton(text, url, color) {
            let btn = document.createElement('a');
            btn.href = 'javascript:void(0);';
            btn.textContent = text;
            btn.style.marginLeft = '8px';
            btn.style.color = color;
            btn.style.cursor = 'pointer';
            btn.className = 'autobot-mayor-btn';

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                btn.textContent = text + '...';
                const isMayorBtn = text.includes('任命市长') || text.includes(
                    '[任命市长]');
                fetch(url, {
                        credentials: 'same-origin'
                    })
                    .then(resp => resp.text())
                    .then(data => {
                        if (isMayorBtn) {
                            if (data.includes("设立市长成功")) {
                                btn.textContent = text + '✅';
                                setTimeout(() => location.reload(), 500);
                            } else {
                                btn.textContent = text + '❌失败';
                                setTimeout(() => {
                                    btn.textContent = text;
                                }, 2000);
                            }
                        } else {
                            btn.textContent = text + '✅';
                            setTimeout(() => location.reload(), 500);
                        }
                    })
                    .catch(() => {
                        btn.textContent = text + '❌';
                        setTimeout(() => {
                            btn.textContent = text;
                        }, 1500);
                    });
            });
            return btn;
        }

        function addSwapMayorButton(anchor, myid) {
            const btn = document.createElement('a');
            btn.href = "javascript:void(0);";
            btn.textContent = "[换衣服当市长]";
            btn.style.marginLeft = '8px';
            btn.style.color = "#e36518";
            btn.className = 'autobot-mayor-swap-btn';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                btn.textContent = "[处理中...]";
                btn.style.pointerEvents = "none";
                const curMayorId = findMayorId();
                if (!curMayorId) {
                    btn.textContent = "[未找到市长]";
                    setTimeout(() => {
                        btn.textContent = "[换衣服当市长]";
                        btn.style.pointerEvents = "";
                    }, 2000);
                    return;
                }
                fetch(`/home/acade/unmaskall/acade_id/${curMayorId}.html`, {
                        credentials: 'same-origin'
                    })
                    .then(r => r.text())
                    .then(() => fetch(`/home/acade/oneclickequip/acade_id/${myid}.html`, {
                        credentials: 'same-origin'
                    }))
                    .then(r => r.text())
                    .then(() => fetch(`/home/acade/setmayor/acade_id/${myid}.html`, {
                        credentials: 'same-origin'
                    }))
                    .then(r => r.text())
                    .then(() => {
                        btn.textContent = "[成功✅]";
                        setTimeout(() => {
                            location.reload();
                        }, 500);
                    })
                    .catch(() => {
                        btn.textContent = "[失败❌]";
                        setTimeout(() => {
                            btn.textContent = "[换衣服当市长]";
                            btn.style.pointerEvents = "";
                        }, 2000);
                    });
            });
            anchor.insertAdjacentElement('afterend', btn);
        }

        document.querySelectorAll('a[href*="/home/acade/view/acade_id/"]').forEach(
            viewA => {
                if (viewA.nextSibling && viewA.nextSibling.className &&
                    viewA.nextSibling.className.includes('autobot-mayor')) {
                    return;
                }
                let match = viewA.href.match(/acade_id\/(\d+)/);
                if (!match) {
                    return;
                }
                let id = match[1];
                let mayor = addAjaxButton('[任命市长]',
                    `/home/acade/setmayor/acade_id/${id}.html`, "#2d8c2d");
                let unmask = addAjaxButton('[脱衣服]',
                    `/home/acade/unmaskall/acade_id/${id}.html`, "#ad3012");
                let eq = addAjaxButton('[穿衣服]',
                    `/home/acade/oneclickequip/acade_id/${id}.html`, "#2b3887");
                viewA.insertAdjacentElement('afterend', eq);
                eq.insertAdjacentElement('beforebegin', unmask);
                unmask.insertAdjacentElement('beforebegin', mayor);
                addSwapMayorButton(eq, id);
            });
    }

    // -------- 功能5: 军官招募页面，gap分析与自动刷新 --------
    if (location.pathname === '/home/acade/search.html') {
        /* const starMax = {
           '1星': 129,
           '2星': 135,
           '3星': 145,
           '4星': 160,
           '5星': 181
         };
         let gaps = [];
         let tables = document.querySelectorAll('table.outSide');
         tables.forEach(table => {
           let rows = table.querySelectorAll('tr');
           rows.forEach((row, idx) => {
             if (idx === 0) {
               return;
             }
             let tds = row.querySelectorAll('td');
             if (tds.length < 6) {
               return;
             }
             let star = tds[2].textContent.match(/(\d星)/);
             let lv = tds[1].textContent.match(/(\d+)/);
             let props = tds[3].textContent.match(/(\d+)\/(\d+)\/(\d+)/);
             if (star && props && lv) {
               let vStar = star[1];
               let maxVal = starMax[vStar] || 0;
               let level = parseInt(lv[1]);
               let sum = parseInt(props[1]) + parseInt(props[2]) + parseInt(
                   props[3]);
               let gap = maxVal - (sum - level);
               gaps.push(gap);
               let hireTd = tds[5];
               let hireA = hireTd.querySelector('a');
               if (hireA) {
                 if (!hireA.nextSibling || !hireA.nextSibling.textContent.match(
                     /^（\-?\d+）$/)) {
                   let span = document.createElement('span');
                   span.textContent = `（${gap}）`;
                   span.style.color = gap < 10 ? 'red' : 'green';
                   span.style.marginLeft = '4px';
                   hireA.after(span);
                 }
               }
             }
           });
         });
         setInterval(function () {
           if (gaps.some(gap => gap < 5)) {
             alert('发现有 gap < 5 的军官！请注意招募。');
           } else {
             location.reload();
           }
         }, 60000); */
    }

    // ----主导航按钮（每页右侧居中、仅插一次）----
    if (!document.querySelector('#zhandou-nav-box')) {
     // ---主导航按钮配置---
    const buttons = [
        //

        { url: "/home/building/militaryindex.html", text: "军事区" },
        { url: "/home/acade/index.html", text: "军官" },
        { url: "/home/city_troop/index.html", text: "军队" },
        { url: "/home/tech/index.html", text: "科技" },
        { url: "/home/map/index.html", text: "地图" },
        { url: "/home/chat/index/type/1.html", text: "公共聊天" }, 


    ];

    // 缓存相关配置
    const CITY_CACHE_KEY = 'zhandouCityListHtml';
    const CITY_CACHE_TIME_KEY = 'zhandouCityListTime';
    // 缓存有效期：5分钟（毫秒）
    const CITY_CACHE_TTL = 5 * 60 * 1000;

    // ----主面板插入（防止重复）----
    if (document.querySelector('#zhandou-nav-box')) {
        return;
    }

    // 主容器
    const nav = document.createElement('div');
    nav.id = 'zhandou-nav-box';
    nav.style.position = 'fixed';
    nav.style.top = '50%';
    nav.style.right = '8px';
    nav.style.transform = 'translateY(-50%)';
    nav.style.zIndex = '99999';
    nav.style.display = 'flex';
    nav.style.flexDirection = 'row';  // 两列横向并排
    nav.style.gap = '16px';
    nav.style.background = 'rgba(255,255,255,0.92)';
    nav.style.borderRadius = '10px';
    nav.style.boxShadow = '0 0 12px #9995';
    nav.style.padding = '12px 10px';
    nav.style.border = '1px solid #cad6f7';

    // ----主按钮列----
    const navCol1 = document.createElement('div');
    navCol1.style.display = 'flex';
    navCol1.style.flexDirection = 'column';
    navCol1.style.gap = '10px';

    // 主区收缩/展开按钮
    const mainToggleBtn = document.createElement('button');
    mainToggleBtn.textContent = '⇦'; // or '≡'
    mainToggleBtn.title = '收起导航';
    mainToggleBtn.style.width = '36px';
    mainToggleBtn.style.height = '30px';
    mainToggleBtn.style.margin = '0 auto 8px auto';
    mainToggleBtn.style.background = '#59a8ef';
    mainToggleBtn.style.color = '#fff';
    mainToggleBtn.style.border = 'none';
    mainToggleBtn.style.borderRadius = '16px';
    mainToggleBtn.style.cursor = 'pointer';
    mainToggleBtn.style.fontSize = '18px';
    mainToggleBtn.style.boxShadow = '0 1px 6px #468bc544';

    navCol1.appendChild(mainToggleBtn);

    // 主按钮容器
    const btnsBox = document.createElement('div');
    btnsBox.style.display = 'flex';
    btnsBox.style.flexDirection = 'column';
    btnsBox.style.gap = '10px';

    buttons.forEach(cfg => {
        let a = document.createElement('a');
        a.href = cfg.url;
        a.target = '_self';
        a.style.textDecoration = 'none';
        a.style.display = 'block';

        let btn = document.createElement('button');
        btn.textContent = cfg.text;
        btn.style.width = '96px';
        btn.style.minWidth = '96px';
        btn.style.height = '32px';
        btn.style.fontSize = '16px';
        btn.style.whiteSpace = 'nowrap';
        btn.style.textAlign = 'center';
        btn.style.background = '#59a8ef';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 8px #468bc533';

        a.appendChild(btn);
        btnsBox.appendChild(a);
    });

    navCol1.appendChild(btnsBox);

    // ----城市列----
    const navCol2 = document.createElement('div');
    navCol2.style.display = 'flex';
    navCol2.style.flexDirection = 'column';
    navCol2.style.gap = '10px';

    // 城市区收缩/展开按钮
    const cityToggleBtn = document.createElement('button');
    cityToggleBtn.textContent = '⇨';
    cityToggleBtn.title = '收起城市列表';
    cityToggleBtn.style.width = '36px';
    cityToggleBtn.style.height = '30px';
    cityToggleBtn.style.margin = '0 auto 4px auto';
    cityToggleBtn.style.background = '#fc9d31';
    cityToggleBtn.style.color = '#fff';
    cityToggleBtn.style.border = 'none';
    cityToggleBtn.style.borderRadius = '16px';
    cityToggleBtn.style.cursor = 'pointer';
    cityToggleBtn.style.fontSize = '18px';
    cityToggleBtn.style.boxShadow = '0 1px 6px #a5620444';

    navCol2.appendChild(cityToggleBtn);

    // 【新增】城市列表刷新按钮
    const cityRefreshBtn = document.createElement('button');
    cityRefreshBtn.textContent = '刷新';
    cityRefreshBtn.title = '强制重新加载城市列表';
    cityRefreshBtn.style.width = '52px';
    cityRefreshBtn.style.height = '24px';
    cityRefreshBtn.style.margin = '0 auto 6px auto';
    cityRefreshBtn.style.background = '#f0b45a';
    cityRefreshBtn.style.color = '#fff';
    cityRefreshBtn.style.border = 'none';
    cityRefreshBtn.style.borderRadius = '12px';
    cityRefreshBtn.style.cursor = 'pointer';
    cityRefreshBtn.style.fontSize = '13px';
    cityRefreshBtn.style.boxShadow = '0 1px 4px #a5620444';

    // navCol2.appendChild(cityRefreshBtn);

    // 城市按钮容器
    const cityBtnsBox = document.createElement('div');
    cityBtnsBox.style.display = 'flex';
    cityBtnsBox.style.flexDirection = 'column';
    cityBtnsBox.style.gap = '10px';
                // ===== NEW: 城市列表过多时限制高度并滚动（最小改动） =====
        cityBtnsBox.style.maxHeight = '70vh';     // 视口高度的 70%
        cityBtnsBox.style.overflowY = 'auto';     // 垂直滚动
        cityBtnsBox.style.overflowX = 'hidden';   // 避免横向滚动条
        cityBtnsBox.style.paddingRight = '6px';   // 给滚动条留点空间（可选）



    navCol2.appendChild(cityBtnsBox);


    // 两列入主面板
    nav.appendChild(navCol1);
    nav.appendChild(navCol2);

    document.body.appendChild(nav);

    // ---主区收缩持久化---
    let mainCollapsed = false;
    if (localStorage.getItem('zhandouNavMainCollapsed') === '1') {
        mainCollapsed = true;
        btnsBox.style.display = 'none';
        mainToggleBtn.textContent = '⇒';
        mainToggleBtn.title = '展开导航';
    }
    mainToggleBtn.onclick = function () {
        mainCollapsed = !mainCollapsed;
        localStorage.setItem('zhandouNavMainCollapsed', mainCollapsed ? '1' : '0');
        btnsBox.style.display = mainCollapsed ? 'none' : 'flex';
        mainToggleBtn.textContent = mainCollapsed ? '⇒' : '⇦';
        mainToggleBtn.title = mainCollapsed ? '展开导航' : '收起导航';
    };

    // ---城市区收缩持久化---
    let cityCollapsed = false;
    if (localStorage.getItem('zhandouNavCityCollapsed') === '1') {
        cityCollapsed = true;
        cityBtnsBox.style.display = 'none';
        cityToggleBtn.textContent = '⇦';
        cityToggleBtn.title = '展开城市列表';
    }
    cityToggleBtn.onclick = function () {
        cityCollapsed = !cityCollapsed;
        localStorage.setItem('zhandouNavCityCollapsed', cityCollapsed ? '1' : '0');
        cityBtnsBox.style.display = cityCollapsed ? 'none' : 'flex';
        cityToggleBtn.textContent = cityCollapsed ? '⇦' : '⇨';
        cityToggleBtn.title = cityCollapsed ? '展开城市列表' : '收起城市列表';
    };

    // ---------- 城市列表渲染函数 ----------
    function renderCityListFromHtml(html) {
        // 清空旧内容
        cityBtnsBox.innerHTML = '';

        let lines = html.split(/<br>/g);
        lines.forEach(line => {
            // 解析：城市 + 坐标
            let match = line.match(/<a\s+href="(\/home\/city\/view\/city_id\/(\d+)\.html)">([^<]+)<\/a>\(([^)]+)\)/);
            if (!match) return;

            let cityUrl = match[1];
            let cityId = match[2];
            let cityName = match[3].trim();
            let cityXY = match[4].trim();

            let paqMatch = line.match(/<a\s+href="([^"]+)">派遣<\/a>/);
            let yunMatch = line.match(/<a\s+href="([^"]+)">运输<\/a>/);

            const cityBox = document.createElement('div');
            cityBox.style.display = 'flex';
            cityBox.style.flexDirection = 'column';
            cityBox.style.alignItems = 'center';

            const btnCity = document.createElement('button');
            btnCity.textContent = cityName + ' (' + cityXY + ')';
            btnCity.style.width = '120px';
            btnCity.style.minWidth = '120px';
            btnCity.style.height = '32px';
            btnCity.style.fontSize = '15px';
            btnCity.style.whiteSpace = 'nowrap';
            btnCity.style.textAlign = 'center';
            btnCity.style.background = '#fc9d31';
            btnCity.style.color = '#fff';
            btnCity.style.border = 'none';
            btnCity.style.borderRadius = '5px';
            btnCity.style.cursor = 'pointer';
            btnCity.style.boxShadow = '0 2px 8px #a5620444';
            btnCity.title = cityXY;

            // ---异步切换城市---
            btnCity.onclick = function (e) {
                e.preventDefault(); // 阻止默认跳转
                fetch(cityUrl, { credentials: 'include' })
                    .then(resp => {
                        if (!resp.ok) throw new Error('切换城市失败');
                        return resp.text();
                    })
                    .then(() => {
                        location.reload(); // 成功后刷新当前页面
                    })
                    .catch(err => {
                        alert(err.message);
                    });
            };

            cityBox.appendChild(btnCity);

            // 派遣和运输（如有）
            const opsRow = document.createElement('div');
            opsRow.style.display = 'flex';
            opsRow.style.flexDirection = 'row';
            opsRow.style.gap = '8px';
            opsRow.style.marginTop = '3px';

            if (paqMatch) {
                const btnPaq = document.createElement('button');
                btnPaq.textContent = '派遣';
                btnPaq.style.width = '52px';
                btnPaq.style.height = '26px';
                btnPaq.style.fontSize = '13px';
                btnPaq.style.background = '#5a95d3';
                btnPaq.style.color = '#fff';
                btnPaq.style.border = 'none';
                btnPaq.style.borderRadius = '4px';
                btnPaq.style.cursor = 'pointer';
                btnPaq.style.boxShadow = '0 1px 6px #2222';
                btnPaq.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = paqMatch[1];
                };
                opsRow.appendChild(btnPaq);
            }
            if (yunMatch) {
                const btnYun = document.createElement('button');
                btnYun.textContent = '运输';
                btnYun.style.width = '52px';
                btnYun.style.height = '26px';
                btnYun.style.fontSize = '13px';
                btnYun.style.background = '#55c58f';
                btnYun.style.color = '#fff';
                btnYun.style.border = 'none';
                btnYun.style.borderRadius = '4px';
                btnYun.style.cursor = 'pointer';
                btnYun.style.boxShadow = '0 1px 6px #2222';
                btnYun.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = yunMatch[1];
                };
                opsRow.appendChild(btnYun);
            }

            if (opsRow.children.length) cityBox.appendChild(opsRow);

            cityBtnsBox.appendChild(cityBox);
        });

        if (!cityBtnsBox.children.length) {
            const emptyDiv = document.createElement('div');
            emptyDiv.textContent = '暂无城市数据';
            emptyDiv.style.color = '#666';
            emptyDiv.style.fontSize = '13px';
            cityBtnsBox.appendChild(emptyDiv);
        }
    }

    // ---------- 城市列表加载函数（带缓存） ----------
    function loadCityList(forceRefresh = false) {
        // 如果不强制刷新，先尝试从缓存拿
        if (!forceRefresh) {
            try {
                const cachedHtml = localStorage.getItem(CITY_CACHE_KEY);
                const cachedTime = parseInt(localStorage.getItem(CITY_CACHE_TIME_KEY) || '0', 10);
                if (cachedHtml && cachedTime && (Date.now() - cachedTime) < CITY_CACHE_TTL) {
                    // 使用缓存渲染
                    renderCityListFromHtml(cachedHtml);
                    return;
                }
            } catch (e) {
                console.warn('读取城市缓存失败:', e);
            }
        }

        /* 显示加载中
        cityBtnsBox.innerHTML = '';
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = '城市列表加载中...';
        loadingDiv.style.color = '#555';
        loadingDiv.style.fontSize = '13px';
        cityBtnsBox.appendChild(loadingDiv);*/

        // 真正请求
        fetch('/home/city/citylist.html', {
            credentials: 'include'
        }).then(res => res.text()).then(html => {
            // 写入缓存
            try {
                localStorage.setItem(CITY_CACHE_KEY, html);
                localStorage.setItem(CITY_CACHE_TIME_KEY, String(Date.now()));
            } catch (e) {
                console.warn('写入城市缓存失败:', e);
            }
            // 渲染
            renderCityListFromHtml(html);
        }).catch(err => {
            cityBtnsBox.innerHTML = '';
            const errDiv = document.createElement('div');
            errDiv.textContent = '城市列表加载失败!';
            errDiv.style.color = '#cc2929';
            errDiv.style.fontSize = '13px';
            cityBtnsBox.appendChild(errDiv);
            console.error(err);
        });
    }

    // 刷新按钮绑定：强制刷新
    cityRefreshBtn.onclick = function () {
        loadCityList(true);
    };
     loadCityList(false);
    // 初次加载（用缓存或网络）
    loadCityList(true);
    }

    // 只在军事队列页面执行 加速按钮
    if (location.pathname.startsWith('/home/building/militaryindex') ||

        location.pathname.startsWith('/home/building/sourceindex')
    ) {
        // 查询所有含“加速”链接的行（不是表格，而是一堆 <br> 段落，需遍历所有“加速/取消”a标签）

        // 兼容“取消”链接（有的行加速与取消按钮反向）
        document.querySelectorAll(
            'a[href*="/home/building/precancel/building_id/"]').forEach(
            function (cancelBtn) {
                var match = cancelBtn.href.match(/building_id\/(\d+)\.html/);
                if (!match) {
                    return;
                }
                var id = match[1];

                // 检查已经有加速按钮了
                if (cancelBtn.nextSibling && cancelBtn.nextSibling.textContent &&
                    cancelBtn.nextSibling.textContent.includes(
                        "加速15分钟")) {
                    return;
                }
                if (cancelBtn.previousSibling && cancelBtn.previousSibling.textContent &&
                    cancelBtn.previousSibling.textContent.includes(
                        "加速15分钟")) {
                    return;
                }

                // 构造按钮
                var btn15 = document.createElement("a");
                btn15.textContent = "[加速15分钟]";
                // /home/building/quicken/building_id/${id}/build_sure/sure/user_goods_id/49643.html
                btn15.href =
                    `/home/building/quicken/building_id/${id}/build_sure/sure/user_goods_id/49643.html`;
                btn15.style.marginLeft = "8px";
                btn15.style.color = "#1976d2";

                var btn60 = document.createElement("a");
                btn60.textContent = "[加速60分钟]";
                // /home/building/quicken/building_id/${id}/build_sure/sure/user_goods_id/50549.html
                btn60.href =
                    `/home/building/quicken/building_id/${id}/build_sure/sure/user_goods_id/53217.html`;
                btn60.style.marginLeft = "8px";
                btn60.style.color = "#d2691e";

                cancelBtn.parentNode.insertBefore(btn15, cancelBtn.nextSibling);
                cancelBtn.parentNode.insertBefore(btn60, btn15.nextSibling);
            });
    }

    // 添加建筑直接升级按钮
    document.querySelectorAll(
        'a[href*="/home/building/preupdate/building_id/"][href*="/status/2.html"]').forEach(
        function (upA) {
            // 检查右侧已加按钮避免重复
            if (upA.nextSibling && upA.nextSibling.className ===
                'direct-upgrade-btn') {
                return;
            }

            // 提取building_id
            let m = upA.href.match(/building_id\/(\d+)/);
            if (!m) {
                return;
            }
            let id = m[1];

            // 构造按钮
            let directBtn = document.createElement('a');
            directBtn.textContent = "[直接升级]";
            directBtn.href = `/home/building/preupdate/building_id/${id}/build_sure/sure/status/2.html`;
            directBtn.className = "direct-upgrade-btn";
            directBtn.style.marginLeft = "8px";
            directBtn.style.color = "#d2691e";
            directBtn.style.fontWeight = "bold";
            directBtn.style.textDecoration = "none";
            upA.parentNode.insertBefore(directBtn, upA.nextSibling);


                        // 构造按钮
            let directBtn2 = document.createElement('a');
            directBtn2.textContent = "[直接拆]";
            directBtn2.href = `/home/building/preupdate/building_id/${id}/build_sure/sure/status/3.html`;
            directBtn2.className = "direct-upgrade-btn";
            directBtn2.style.marginLeft = "8px";
            directBtn2.style.color = "red";
            directBtn2.style.fontWeight = "bold";
            directBtn2.style.textDecoration = "none";
            upA.parentNode.insertBefore(directBtn2, directBtn.nextSibling);
        });

    // 军队直接取消按钮
    if (location.pathname.startsWith('/home/city_troop/factory/building_id')) {
        // 只对军队训练队列页面生效，必要时你可加url判断
        document.querySelectorAll(
            'a[href*="/home/city_troop/precancel/id/"]').forEach(
            function (cancelA) {
                // 防止重复添加
                if (cancelA.nextSibling && cancelA.nextSibling.className ===
                    'direct-cancel-btn') {
                    return;
                }

                let m = cancelA.href.match(/id\/(\d+)/);
                if (!m) {
                    return;
                }
                let id = m[1];

                // 创建异步“直接取消”按钮
                let directBtn = document.createElement('a');
                directBtn.textContent = "[直接取消]";
                directBtn.href = 'javascript:void(0);';
                directBtn.className = "direct-cancel-btn";
                directBtn.style.marginLeft = "8px";
                directBtn.style.color = "#d2691e";
                directBtn.style.fontWeight = "bold";
                directBtn.style.textDecoration = "none";
                directBtn.style.cursor = "pointer";
                directBtn.onclick = function (e) {
                    e.preventDefault();
                    directBtn.textContent = "[取消中...]";
                    directBtn.style.pointerEvents = "none";
                    fetch(`/home/city_troop/precancel/id/${id}/sure/1.html`, {
                            credentials: "same-origin"
                        })
                        .then(resp => resp.text())
                        .then(data => {
                            directBtn.textContent = "[已取消]";
                            setTimeout(function () {
                                location.reload();
                            }, 400);
                        })
                        .catch(() => {
                            directBtn.textContent = "[网络错误]";
                            setTimeout(function () {
                                directBtn.textContent = "[直接取消]";
                                directBtn.style.pointerEvents = "";
                            }, 1500);
                        });
                }
                cancelA.parentNode.insertBefore(directBtn, cancelA.nextSibling);
            });

        // ===== 批量直接取消功能 =====
        if (!document.querySelector('#batchDirectCancelBtn')) {
            // 插入批量按钮到页面右上角
            var batchBtn = document.createElement('button');
            batchBtn.id = 'batchDirectCancelBtn';
            batchBtn.textContent = '批量直接取消';
            batchBtn.style.position = 'fixed';
            batchBtn.style.top = '38px';
            batchBtn.style.right = '24px';
            batchBtn.style.zIndex = 99999;
            batchBtn.style.background = '#fbdede';
            batchBtn.style.color = '#b10b0b';
            batchBtn.style.border = '1px solid #bca2a2';
            batchBtn.style.padding = '8px 18px';
            batchBtn.style.fontSize = '16px';
            batchBtn.style.borderRadius = '6px';
            batchBtn.style.cursor = 'pointer';
            batchBtn.style.boxShadow = '0 2px 6px #643a3a22';

            batchBtn.onclick = function () {
                var cancelBtns = Array.from(
                        document.querySelectorAll('.direct-cancel-btn'))
                    .filter(btn => btn.textContent === '[直接取消]');
                if (cancelBtns.length === 0) {
                    batchBtn.textContent = "没有可取消项";
                    setTimeout(() => {
                        batchBtn.textContent = "批量直接取消";
                    }, 1500);
                    return;
                }
                batchBtn.disabled = true;
                batchBtn.textContent = `批量取消中(0/${cancelBtns.length})`;

                let success = 0,
                    total = cancelBtns.length;
                let finished = 0;

                function callback() {
                    finished++;
                    batchBtn.textContent = `批量取消中(${success}/${total})`;
                    if (finished === total) {
                        batchBtn.textContent = "批量已完成,刷新中...";
                        setTimeout(() => location.reload(), 600);
                    }
                }

                cancelBtns.forEach(btn => {
                    // 防止重复点击
                    btn.onclick && btn.onclick({
                        preventDefault: () => {}
                    });
                    // 监听按钮已取消就+1
                    btn.textContent = "[取消中...]";
                    btn.style.pointerEvents = "none";
                    // 直接复用单个按钮的请求逻辑
                    let href = btn.previousElementSibling &&
                        btn.previousElementSibling.href;
                    let m = href && href.match(/id\/(\d+)/);
                    let id = m && m[1];
                    if (!id) {
                        callback();
                        return;
                    }
                    fetch(`/home/city_troop/precancel/id/${id}/sure/1.html`, {
                            credentials: "same-origin"
                        })
                        .then(resp => resp.text())
                        .then(data => {
                            btn.textContent = "[已取消]";
                            success++;
                            callback();
                        }).catch(() => {
                            btn.textContent = "[网络错误]";
                            callback();
                        });
                });
            };
            document.body.appendChild(batchBtn);
        }
    }
 

})();