// ==UserScript==
// @name         Homoer Forum Modern UI
// @namespace    http://tampermonkey.net/
// @version      19.8.2
// @description  Homoer 論壇現代化
// @author       AI Assistant
// @match        https://www.homoer.com/discuss_club.php*
// @match        https://www.homoer.com/discuss_detail.php*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557227/Homoer%20Forum%20Modern%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/557227/Homoer%20Forum%20Modern%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const API_CACHE_KEY = 'homoer_api_isp_';
    // 核心樣式
    const css = `
        :root {
            --primary: #1877f2;
            --primary-dark: #166fe5;
            --bg: #f0f2f5;
            --card-bg: #ffffff;
            --text-black: #000000 !important;
            --text-gray: #65676b;
            --border: #e5e6e9;
            --radius: 12px;
            --shadow: 0 2px 4px rgba(0,0,0,0.08);
            
            /* 備註專用配色 (橘色系) - 只有備註會高亮 */
            --remark-bg: #ff9800; 
            --remark-text: #ffffff;
        }

        /* 深色模式變數定義 */
        [data-theme='dark'] {
            --bg: #18191a;
            --card-bg: #242526;
            --text-black: #e4e6eb !important;
            --text-gray: #b0b3b8;
            --border: #3e4042;
            --shadow: 0 2px 4px rgba(0,0,0,0.3);
            
            --remark-bg: #e65100;
            --remark-text: #ffffff;
        }

        /* 修正深色模式下文章主體文字顏色 */
        [data-theme='dark'] .HTML_info,
        [data-theme='dark'] .HTML_info * {
            color: var(--text-black) !important;
        }

        body { background: var(--bg) !important; transition: background 0.3s; }
        .main_container { max-width: 1000px !important; margin: 0 auto !important; padding: 140px 15px 40px 15px !important; box-sizing: border-box !important; }
        .main_title_h1_3, .main_title_h1_4 { color: var(--text-black) !important; text-align: left !important; margin-bottom: 20px !important; font-size: 24px !important; }
        .subject-link { color: var(--text-black) !important; text-align: left !important; display: block !important; width: 100% !important; font-weight: 700 !important; text-decoration: none !important; }

        #page_block { display: flex !important; flex-wrap: wrap !important; justify-content: center !important; align-items: center !important; gap: 6px !important; margin: 30px 0 !important; line-height: 1 !important; }
        #page_block a, #page_block span { display: inline-flex !important; align-items: center !important; justify-content: center !important; min-width: 34px !important; height: 34px !important; padding: 0 8px !important; border-radius: 8px !important; border: 1px solid var(--border) !important; background: var(--card-bg) !important; font-weight: bold !important; font-size: 13px !important; color: var(--text-gray) !important; text-decoration: none !important; box-sizing: border-box !important; }
        #page_block span.page_current { background: var(--primary) !important; color: #fff !important; border: none !important; }

        input[type="button"], input[type="submit"], button, .form_button { background: var(--card-bg) !important; border: 1px solid var(--border) !important; border-radius: 8px !important; padding: 8px 16px !important; color: var(--text-gray) !important; font-weight: bold !important; cursor: pointer !important; transition: all 0.2s !important; font-size: 14px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important; }
        #sub1, .reply_here, input[value*="發表"] { background: var(--primary) !important; border-color: var(--primary-dark) !important; color: #ffffff !important; }

        .modern-row, .guest_box { background: var(--card-bg) !important; margin-bottom: 16px !important; border-radius: var(--radius) !important; border: 1px solid var(--border) !important; box-shadow: var(--shadow) !important; overflow: hidden !important; display: block !important; }
        .modern-cell { padding: 16px 20px !important; text-align: left !important; }

        .navgation_bar, .banner, th, .left.news_info { display: none !important; }
        .reply_table { width: 100% !important; background: transparent !important; }
        .form_message_guest { padding: 20px !important; background: var(--card-bg) !important; border-radius: var(--radius) !important; color: var(--text-black) !important; }
        .inputtext, input[type="number"] { border: 1px solid var(--border) !important; border-radius: 6px !important; padding: 8px 12px !important; margin: 5px 0 !important; background: var(--bg) !important; color: var(--text-black) !important; }
        .form_message_textarea { width: 100% !important; min-height: 150px !important; border: 1px solid var(--border) !important; border-radius: 8px !important; padding: 15px !important; box-sizing: border-box !important; background: var(--bg) !important; color: var(--text-black) !important; }

        #only_condition { background: var(--bg) !important; padding: 12px !important; border-radius: 8px !important; margin-bottom: 15px !important; font-size: 13px !important; color: var(--text-gray) !important; }
        .ip-flag-img { width: 16px; height: 11px; vertical-align: middle; margin-right: 4px; }
        
        /* 網路標籤樣式 (ISP) */
        .net-type-badge { 
            font-size: 10px !important; 
            background: var(--bg); 
            color: var(--text-gray); 
            padding: 1px 6px; 
            border-radius: 4px; 
            margin-left: 5px; 
            font-weight: 700; 
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.2s;
            display: inline-block;
            min-width: 20px;
            text-align: center;
        }
        
        .net-type-badge:hover {
            opacity: 0.8;
            transform: translateY(-1px);
        }

        /* 隱藏打賞、送花、送咖啡按鈕 */
        .reply_donate, .reply_gift_flower, .reply_gift_coffee {
        display: none !important;
        }

        /* 備註樣式 (橘色) */
        .net-type-badge.is-remark {
            background: var(--remark-bg) !important;
            color: var(--remark-text) !important;
            border-color: var(--remark-bg) !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        /* 深色模式切換按鈕樣式 */
        #theme-toggle-btn {
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 9999;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--card-bg);
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: transform 0.2s;
        }
        #theme-toggle-btn:active { transform: scale(0.9); }
    `;

    // --- 核心 ISP 判斷邏輯 ---
        const getLocalISPInfo = (ip) => {
        if (!ip) return null;
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4 || parts.some(isNaN)) return null;
        const [p1, p2, p3] = parts;

        // 1. 【台灣大哥大】判定
        // 台哥大是 49 開頭的最大宗，必須最先處理
        if (p1 === 49) {
            // 49.158.x.x 和 49.159.x.x 通常是台灣大寬頻 (固網)
            if (p2 === 158 || p2 === 159) return "台灣大哥大(固網)";

            // 49.214 ~ 49.219 全段都是行動 (包含 49.216)
            if (p2 >= 214 && p2 <= 219) return "台灣大哥大(行動)";

            // 剩下 49 開頭大部分也都是行動，預設回傳行動
            return "台灣大哥大(行動)";
        }

        // 101 開頭混雜中華與台哥大
        if (p1 === 101) {
            if (p2 === 9) return "中華電信(行動)"; // 101.9
            if (p2 === 136 || p2 === 137) return "台灣大哥大(行動)"; // 101.136-137
            if (p2 >= 8 && p2 <= 15) return "台灣大哥大(行動)";
            return "台灣大哥大(行動)"; // 預設歸給台哥大
        }

        if (p1 === 115 || p1 === 112) return "台灣大哥大(行動)";


        // 2. 【中華電信】判定
        // 1.200 是中華行動常見段，容易被誤判為固網，優先攔截
        if (p1 === 1 && p2 === 200) return "中華電信(行動)";

        if (p1 === 42 && (p2 >= 72 && p2 <= 79)) return "中華電信(行動)";
        if (p1 === 111 && (p2 >= 64 && p2 <= 95)) return "中華電信(行動)";
        if (p1 === 223 && (p2 >= 136 && p2 <= 143)) return "中華電信(行動)";
        if (p1 === 114 && (p2 >= 136 && p2 <= 139)) return "中華電信(行動)";


        // 3. 【遠傳電信 / 亞太】判定
        if (p1 === 27 || p1 === 39 || p1 === 110 || p1 === 117) return "遠傳電信(行動)";
        // 210 開頭極少數是遠傳行動
        if (p1 === 210 && (p2 !== 6 && p2 !== 7 && p2 !== 244)) return "遠傳電信(行動)";


        // 4. 【Apple iCloud / 機房】
        if ((p1 === 172 && p2 >= 224 && p2 <= 227) || (p1 === 104 && p2 === 28)) return "Apple(行動)";


        // 5. 【固網與其他】
        // 當上方行動規則都沒命中時，才進行固網檢查

        // 中華電信固網 (Hinet)
        const hinetFixed = [1, 36, 59, 60, 61, 111, 114, 118, 122, 125, 168, 175, 211, 218, 220];
        if (hinetFixed.includes(p1)) return "中華電信(固網)";

        // 台灣大哥大固網 (TFN / Twn Mobile Fixed)
        if (p1 === 219 && p2 >= 80 && p2 <= 91) return "台灣大哥大(固網)";

        // 有線電視寬頻 (中嘉、凱擘等)
        const cableFixed = [123, 124, 180, 219, 103, 119, 150, 43, 203];
        if (cableFixed.includes(p1)) return "有線寬頻(固網)";

        // 學術與政府
        if ([140, 163, 192, 120, 210].includes(p1)) return "學術/政府(固網)";

        return null; // 回傳 null 讓後續走 API
    };

    const determineConnectionType = (ispName) => {
        const n = ispName.toLowerCase();

        // 台灣業者全稱翻譯
        if (n.includes("taiwan mobile")) return "台灣大哥大(行動)";
        if (n.includes("chunghwa")) return "中華電信(固網)";
        if (n.includes("far eastone") || n.includes("fareastone")) return "遠傳電信(行動)";

        // 注意：API 常回傳 Taiwan Fixed Network 但其實是行動網路，
        // 這裡不直接判斷，依賴 getLocalISPInfo 的攔截，
        // 若漏網之魚跑到這，通常是冷門 IP，暫標固網
        if (n.includes("taiwan fixed")) return "台灣大哥大(固網)";

        if (n.includes("apple") || n.includes("icloud")) return "Apple(行動)";
        if (n.includes("cyberzone") || n.includes("server") || n.includes("vps") || n.includes("m247") || n.includes("layer7")) return "[機房/VPN]";

        // 境外特徵偵測
        if (n.match(/mobile|cellular|wireless|gsm|lte/)) return "境外(行動)";
        return "";
    };

    const fetchISPFromAPI = async (ip, badgeElement) => {
        const cached = localStorage.getItem(API_CACHE_KEY + ip);
        if (cached) { updateBadgeUI(badgeElement, cached, ''); return; }
        try {
            const response = await fetch(`https://ipwho.is/${ip}?lang=zh-TW`);
            const data = await response.json();
            if (data.success) {
                let ispOrg = data.connection.isp || data.connection.org || "未知";
                let typeTag = determineConnectionType(ispOrg);
                let country = data.country_code || "??";
                let finalText = "";

                if (typeTag) {
                    finalText = `[${country}] ${typeTag}`;
                } else {
                    let cleanName = ispOrg.split(',')[0].split(' ')[0].trim();
                    finalText = (country === 'TW') ? `[TW] ${cleanName}(固網)` : `[${country}] ${cleanName}`;
                }
                localStorage.setItem(API_CACHE_KEY + ip, finalText);
                updateBadgeUI(badgeElement, finalText, '');
            }
        } catch (e) { updateBadgeUI(badgeElement, "API 錯誤", ''); }
    };


    // 統一更新 Badge UI 的輔助函式
    const updateBadgeUI = (el, text, className) => {
        el.innerText = text;
        el.style.opacity = "1";
        // 清除所有狀態 class
        el.classList.remove('is-remark');
        // 加入新狀態 (如果有)
        if (className) el.classList.add(className);
    };

    const App = {
        isList: location.pathname.includes('discuss_club.php'),
        isDetail: location.pathname.includes('discuss_detail.php'),

        init() {
            GM_addStyle(css);
            this.initTheme();
            this.createThemeButton();
            this.initRemarkListener();
            this.observe();
        },

        initTheme() {
            const savedTheme = localStorage.getItem('homoer-theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
        },

        createThemeButton() {
            const btn = document.createElement('div');
            btn.id = 'theme-toggle-btn';
            btn.innerHTML = '🌓';
            btn.title = '點擊：模式 | 長按：清除快取';

            let pressTimer;
            let isLongPress = false;

            const startPress = () => {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;

                    // --- Safari 暴力讀取邏輯 ---
                    let cacheKeys = [];
                    try {
                        // 不使用 filter，直接用最傳統的迴圈遍歷所有 Key
                        for (let i = 0; i < window.localStorage.length; i++) {
                            let key = window.localStorage.key(i);
                            // 這裡直接寫死字串，完全不依賴任何外部變數
                            if (key && key.indexOf('homoer_api_isp_') === 0) {
                                cacheKeys.push(key);
                            }
                        }
                    } catch (e) {
                        console.error("讀取快取失敗:", e);
                    }

                    if (confirm(`發現 ${cacheKeys.length} 筆 IP 快取，確定清除嗎？`)) {
                        cacheKeys.forEach(k => window.localStorage.removeItem(k));
                        alert('快取已清除，即將重整！');
                        window.location.reload();
                    }
                }, 1000);
            };

            const cancelPress = () => clearTimeout(pressTimer);

            // 事件監聽
            btn.addEventListener('mousedown', startPress);
            btn.addEventListener('mouseup', cancelPress);
            btn.addEventListener('mouseleave', cancelPress);

            // Safari 手機端需要明確禁止預設行為，否則長按會變成「選取文字」
            btn.addEventListener('touchstart', (e) => {
                startPress();
            }, { passive: true });

            btn.addEventListener('touchend', cancelPress, { passive: true });

            btn.addEventListener('click', (e) => {
                if (isLongPress) {
                    e.preventDefault();
                    return;
                }
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                window.localStorage.setItem('homoer-theme', next);
            });

            document.body.appendChild(btn);
        },

            
        initRemarkListener() {
            document.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('net-type-badge') && target.dataset.ip) {
                    const ip = target.dataset.ip;
                    const savedRemark = localStorage.getItem('homoer_remark_' + ip) || '';
                    
                    const newRemark = prompt(`IP: ${ip} 設定備註\n(清空：自動判斷 / API 查詢)`, savedRemark);
                    
                    if (newRemark !== null) {
                        if (newRemark.trim() === "") {
                            localStorage.removeItem('homoer_remark_' + ip);
                        } else {
                            localStorage.setItem('homoer_remark_' + ip, newRemark.trim());
                        }
                        this.refreshAllBadges(ip);
                    }
                }
            });
        },
        
        refreshAllBadges(ip) {
            document.querySelectorAll(`.net-type-badge[data-ip="${ip}"]`).forEach(badge => {
                this.resolveBadgeContent(badge, ip);
            });
        },

        // 核心邏輯
        resolveBadgeContent(badge, ip) {
            // 1. 檢查備註 (最高權限)
            const savedRemark = localStorage.getItem('homoer_remark_' + ip);
            if (savedRemark) {
                updateBadgeUI(badge, '備註： ' + savedRemark, 'is-remark');
                return;
            }

            // 2. 檢查本地 CIDR 資料庫
            const localResult = getLocalISPInfo(ip);
            if (localResult) {
                updateBadgeUI(badge, localResult, '');
                return;
            }

            // 3. 調用 API
            fetchISPFromAPI(ip, badge);
        },

        rebuildList(row) {
            if (row.classList.contains('modern-row') || row.cells.length < 5 || row.querySelector('th')) return;
            const tds = row.cells;
            const linkWrap = tds[0].querySelector('a[href*="discuss_detail.php"]');
            if (!linkWrap) return;

            const title = linkWrap.querySelector('.subject')?.innerText || linkWrap.innerText;
            const author = tds[3].querySelector('a')?.innerText || "匿名";
            const date = tds[3].querySelector('.post_date')?.innerText || "";
            const replies = tds[1].innerText.trim();
            const views = tds[2].innerText.trim();
            const lastUser = tds[4].innerText.replace(tds[4].querySelector('.post_date')?.innerText || "", "").trim();
            const lastTime = tds[4].querySelector('.post_date')?.innerText || "";

            row.className = 'modern-row';
            row.innerHTML = `
                <div class="modern-cell">
                    <a href="${linkWrap.href}" class="subject-link" style="font-size:17px; margin-bottom:8px;">${title}</a>
                    <div style="display:flex; gap:12px; font-size:12px; color:var(--text-gray); align-items:center;">
                        <span style="font-weight:bold; color:var(--text-black);">${author}</span>
                        <span>${date}</span>
                        <span style="background:var(--bg); padding:2px 6px; border-radius:4px;">💬 ${replies}</span>
                        <span style="background:var(--bg); padding:2px 6px; border-radius:4px;">🔥 ${views}</span>
                    </div>
                </div>
                <div style="background:rgba(0,0,0,0.02); padding:8px 20px; border-top:1px solid var(--border); font-size:12px; display:flex; justify-content:space-between; color:var(--text-gray);">
                    <div>最新：<span style="color:var(--primary); font-weight:bold;">${lastUser}</span></div>
                    <div>${lastTime}</div>
                </div>
            `;
        },

        rebuildDetail(box) {
            // 防止重複處理
            if (box.dataset.done) return;

            const titleEl = box.querySelector('.guest_title');
            if (!titleEl) return;

            // 1. 判斷是否為回覆區 (有輸入框就是)
            const isReplyArea = box.querySelector('textarea') || box.querySelector('form');

            // --- 樣式重置與設定 ---
            // 讓標題區變成彈性盒子 (Flexbox)，方便我們把東西塞進去排排站
            titleEl.style.display = 'flex';
            titleEl.style.flexWrap = 'wrap';       // 手機版空間不夠時自動換行
            titleEl.style.alignItems = 'center';
            titleEl.style.gap = '6px';             // 元素之間的間距
            titleEl.style.padding = '10px 15px';
            titleEl.style.borderBottom = '1px solid var(--border)';
            titleEl.style.marginBottom = '10px';

            // 美化作者名稱 (如果找得到的話)
            const authorEl = box.querySelector('.reply_by');
            if (authorEl) {
                authorEl.style.fontWeight = 'bold';
                authorEl.style.fontSize = '15px';
                authorEl.style.color = 'var(--text-black)';
                authorEl.style.marginRight = '5px';
            }

            // --- 關鍵修復：把下面的日期 IP 整塊搬上來 ---
            if (!isReplyArea) {
                const dateEl = box.querySelector('.guest_date');
                if (dateEl) {
                    // 1. 先抓出 IP 做 ISP 偵測 (功能面)
                    const ipMatch = dateEl.innerText.match(/\d+\.\d+\.\d+\.\d+/);
                    if (ipMatch) {
                        const ip = ipMatch[0];
                        // 建立 ISP 標籤
                        if (!titleEl.querySelector('.net-type-badge')) {
                            const badge = document.createElement('span');
                            badge.className = 'net-type-badge';
                            badge.innerText = '...';
                            badge.dataset.ip = ip;
                            badge.style.fontSize = '11px';
                            
                            // 插入標籤到作者後面 (如果作者存在)
                            if (authorEl && authorEl.nextSibling) {
                                titleEl.insertBefore(badge, authorEl.nextSibling);
                            } else {
                                titleEl.appendChild(badge);
                            }
                            
                            this.resolveBadgeContent(badge, ip);
                        }
                    }

                    // 2. 把原本的日期 IP 區塊「搬」進標題欄 (顯示面)
                    // 使用 appendChild 會把元素從原本的位置「移動」過來，而不是複製
                    titleEl.appendChild(dateEl);

                    // 3. 調整這個搬過來的區塊樣式
                    dateEl.style.display = 'inline-block'; // 確保顯示
                    dateEl.style.margin = '0';
                    dateEl.style.marginLeft = 'auto'; // 這招會把它推到最右邊
                    dateEl.style.fontSize = '12px';
                    dateEl.style.color = 'var(--text-gray)';
                    
                    // 稍微清理一下多餘的換行 (讓它緊湊一點)
                    dateEl.innerHTML = dateEl.innerHTML.replace(/<br>/g, ' '); 
                }
            }

            // --- 針對回覆區的按鈕美化 ---
            if (isReplyArea) {
                const btns = box.querySelectorAll('input[type="submit"], input[type="button"]');
                btns.forEach(btn => {
                    btn.style.padding = '6px 15px';
                    btn.style.borderRadius = '5px';
                    btn.style.border = '1px solid var(--primary)';
                    btn.style.background = 'var(--bg)';
                    btn.style.marginTop = '5px';
                    btn.style.cursor = 'pointer';
                });
            }

            // 標記完成
            box.dataset.done = "true";
        },




        observe() {
            const runner = () => {
                if (this.isList) document.querySelectorAll('#article_list tr').forEach(r => this.rebuildList(r));
                if (this.isDetail) document.querySelectorAll('.guest_box').forEach(b => this.rebuildDetail(b));
            };
            runner();
            new MutationObserver(runner).observe(document.documentElement, { childList: true, subtree: true });
        }
    };

    App.init();
    

    
})();
