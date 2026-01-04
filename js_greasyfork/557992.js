// ==UserScript==
// @name         推特twitter标签备注，X翻译，discord翻译，领哥旗舰版 V19.4
// @namespace    http://tampermonkey.net/
// @version      19.3
// @description  1.支持推特实时翻译，discord翻译，支持翻译字体大小颜色可调整，支持一键本地备份和恢复，支持选择文字快速搜MEME和搜推文。
// @author       LingGe_CTO
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://pro.twitter.com/*
// @match        https://pro.x.com/*
// @match        https://discord.com/*
// @match        https://gmgn.ai/*
// @match        https://web3.okx.com/*
// @match        https://web3.binance.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @connect      translate.googleapis.com
// @connect      api.dexscreener.com
// @downloadURL https://update.greasyfork.org/scripts/557992/%E6%8E%A8%E7%89%B9twitter%E6%A0%87%E7%AD%BE%E5%A4%87%E6%B3%A8%EF%BC%8CX%E7%BF%BB%E8%AF%91%EF%BC%8Cdiscord%E7%BF%BB%E8%AF%91%EF%BC%8C%E9%A2%86%E5%93%A5%E6%97%97%E8%88%B0%E7%89%88%20V194.user.js
// @updateURL https://update.greasyfork.org/scripts/557992/%E6%8E%A8%E7%89%B9twitter%E6%A0%87%E7%AD%BE%E5%A4%87%E6%B3%A8%EF%BC%8CX%E7%BF%BB%E8%AF%91%EF%BC%8Cdiscord%E7%BF%BB%E8%AF%91%EF%BC%8C%E9%A2%86%E5%93%A5%E6%97%97%E8%88%B0%E7%89%88%20V194.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🚀 领哥工具 已启动...");

    
    if (location.host.includes('gmgn.ai')) {
        const urlParams = new URLSearchParams(window.location.search);
        const autoKeyword = urlParams.get('ling_auto_search');

        if (autoKeyword) {
            console.log("⚡ 领哥终测到自动搜索任务 ->", autoKeyword);
            const trySearch = setInterval(() => {
                const inputs = document.querySelectorAll('input');
                let searchInput = null;
                for (let i of inputs) {
                    const ph = (i.placeholder || "").toLowerCase();
                    if (ph.includes('search') || ph.includes('搜索') || ph.includes('address')) {
                        searchInput = i;
                        break;
                    }
                }

                if (searchInput) {
                    clearInterval(trySearch);
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(searchInput, autoKeyword);
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    searchInput.focus();
                    setTimeout(() => {
                        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                        searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                        const form = searchInput.closest('form');
                        if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                    }, 200);
                }
            }, 500);
            setTimeout(() => clearInterval(trySearch), 10000);
        }
        return;
    }

    
    const DEFAULT_UI = {
        transColor: '#00E676',
        transFontSize: '14px',
        noteColor: '#1D9BF0',
        noteFontSize: '11px',
        vipColor: '#F3BA2F',
        floatTop: '60%'
    };

    const INITIAL_VIP_MAP = {
        'vitalikbuterin': ['🏛️ ETH创始人', '#716b94', '#fff'],
        'cz_binance': ['🔶 币安创始人', '#F0B90B', '#000'],
        'elonmusk': ['🚀 狗狗教父', '#000000', '#fff']
    };

    const Storage = {
        getConfig: () => ({ ...DEFAULT_UI, ...JSON.parse(GM_getValue('ling_config', '{}')) }),
        setConfig: (cfg) => {
            GM_setValue('ling_config', JSON.stringify(cfg));
            updateStyles();
        },
        getNotes: () => JSON.parse(GM_getValue('ling_user_notes', '{}')),
        setNotes: (notes) => GM_setValue('ling_user_notes', JSON.stringify(notes)),
        addNote: (handle, note) => {
            const notes = Storage.getNotes();
            const h = handle.toLowerCase();
            if (note && note.trim()) notes[h] = note.trim();
            else delete notes[h];
            Storage.setNotes(notes);
        },
        getNote: (handle) => Storage.getNotes()[handle.toLowerCase()] || null,
        getVips: () => {
            let vips = JSON.parse(GM_getValue('ling_vips', 'null'));
            if (!vips) {
                vips = JSON.parse(JSON.stringify(INITIAL_VIP_MAP));
                GM_setValue('ling_vips', JSON.stringify(vips));
                return vips;
            }
            let isDirty = false;
            for (const [handle, info] of Object.entries(INITIAL_VIP_MAP)) {
                if (!vips[handle.toLowerCase()]) {
                    vips[handle.toLowerCase()] = info;
                    isDirty = true;
                }
            }
            if (isDirty) GM_setValue('ling_vips', JSON.stringify(vips));
            return vips;
        },
        setVips: (vips) => GM_setValue('ling_vips', JSON.stringify(vips)),
        getVipInfo: (handle) => Storage.getVips()[handle.toLowerCase()] || null,
        addVip: (handle, label) => {
            const vips = Storage.getVips();
            vips[handle.toLowerCase()] = [label, '#F3BA2F', '#000'];
            Storage.setVips(vips);
        },
        removeVip: (handle) => {
            const vips = Storage.getVips();
            delete vips[handle.toLowerCase()];
            Storage.setVips(vips);
        },
        export: () => {
            const data = { ver: "19.3", ts: new Date().getTime(), notes: Storage.getNotes(), vips: Storage.getVips(), config: Storage.getConfig() };
            const blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            a.download = `LingGe_Config_${new Date().toISOString().slice(0,10)}.txt`;
            a.click();
        },
        import: () => {
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,.txt';
            input.onchange = (e) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const raw = JSON.parse(ev.target.result);
                        if(raw.notes) Storage.setNotes(raw.notes);
                        if(raw.vips) Storage.setVips(raw.vips);
                        if(raw.config) Storage.setConfig(raw.config);
                        alert("✅ 配置已恢复！"); location.reload();
                    } catch (err) { alert('❌ 文件格式错误'); }
                };
                reader.readAsText(e.target.files[0]);
            };
            input.click();
        }
    };

    // ================= 2. 动态样式系统 =================
    function updateStyles() {
        const cfg = Storage.getConfig();
        const oldStyle = document.getElementById('ling-style'); if (oldStyle) oldStyle.remove();

        const css = `
            .ling-trans-box { margin-top: 6px; padding: 8px 10px; background: #0b0b0b; border-left: 3px solid ${cfg.transColor}; border-radius: 4px; color: ${cfg.transColor}; font-size: ${cfg.transFontSize}; line-height: 1.5; font-family: "Consolas", monospace; }
            .ling-discord-box { margin-top: 4px; padding: 4px 8px; opacity: 0.9; background: rgba(0,0,0,0.5); border-left: 2px solid ${cfg.transColor}; }
            .ling-fast-btn { color: #000; font-weight: 800; padding: 3px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; margin: 4px 6px 0 0; border: 1px solid rgba(255,255,255,0.2); display: inline-flex; align-items: center; text-decoration: none !important; transition: all 0.2s; vertical-align: middle; box-shadow: 0 2px 5px rgba(0,0,0,0.3); white-space: nowrap; }
            .ling-fast-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.6); filter: brightness(1.1); }
            .ling-data-tag { background: rgba(0,0,0,0.4); color: #fff; padding: 0 5px; border-radius: 3px; margin-left: 6px; font-size: 11px; font-weight: normal; display: none; }
            .ling-data-loaded .ling-data-tag { display: inline-block; }
            .ling-vip-tweet { border: 2px solid ${cfg.vipColor} !important; background: rgba(243, 186, 47, 0.05) !important; border-radius: 8px !important; }
            .ling-identity-badge { font-weight: 900; font-size: 10px; padding: 2px 5px; border-radius: 3px; margin-left: 5px; vertical-align: middle; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.5); color: #000; background: ${cfg.vipColor}; }
            .ling-user-note { background-color: ${cfg.noteColor}; color: #fff; font-size: ${cfg.noteFontSize}; padding: 2px 6px; border-radius: 4px; margin-left: 5px; vertical-align: middle; display: inline-block; cursor: pointer; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; }
            .ling-action-btn { cursor: pointer; margin-left: 6px; font-size: 14px; vertical-align: middle; display: inline-block; opacity: 0.4; transition: 0.2s; filter: grayscale(100%); }
            .ling-action-btn:hover { opacity: 1; filter: grayscale(0%); transform: scale(1.2); }
            .ling-action-btn.active { opacity: 1; filter: grayscale(0%); text-shadow: 0 0 8px gold; }
            .ling-dashboard { position: fixed; top: 15%; right: 20px; background: #111; border: 1px solid ${cfg.vipColor}; border-radius: 12px; padding: 15px; z-index: 2147483647; box-shadow: 0 10px 30px rgba(0,0,0,0.8); min-width: 220px; display: none; }
            .ling-dashboard.active { display: block; animation: ling-fade 0.2s; }
            @keyframes ling-fade { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            .ling-float-toggle { position: fixed; right: 10px; top: ${cfg.floatTop}; width: 45px; height: 45px; border-radius: 50%; background: #000; border: 2px solid ${cfg.vipColor}; color: #fff; display: flex; justify-content: center; align-items: center; cursor: grab; z-index: 2147483646; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: transform 0.1s, opacity 0.2s; opacity: 0.8; user-select: none; overflow: visible; }
            .ling-float-toggle:hover { opacity: 1; transform: scale(1.05); }
            .ling-float-toggle:active { cursor: grabbing; transform: scale(0.95); }
            .ling-logo-text { font-family: 'Arial Black', sans-serif; font-weight: 900; font-size: 14px; letter-spacing: -1px; }
            .ling-float-close { position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background: #FF5252; color: white; border-radius: 50%; font-size: 12px; line-height: 14px; text-align: center; font-weight: bold; display: none; cursor: pointer; border: 1px solid #fff; }
            .ling-float-toggle:hover .ling-float-close { display: block; }
            .ling-dash-link { display: flex; align-items: center; color: #fff; text-decoration: none; padding: 10px; background: #222; margin-bottom: 8px; border-radius: 6px; font-size: 13px; transition: 0.2s; font-weight: bold; }
            .ling-dash-link:hover { background: #333; color: ${cfg.vipColor}; transform: translateX(5px); }
            .ling-dash-btn-row { display: flex; justify-content: space-between; gap: 5px; margin-top: 5px; }
            .ling-mini-btn { flex: 1; background: #333; border: 1px solid #444; color: #ccc; padding: 5px; border-radius: 4px; font-size: 11px; cursor: pointer; text-align: center; }
            .ling-mini-btn:hover { background: #444; color: #fff; }
            #ling-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2147483647; display: flex; justify-content: center; align-items: center; }
            #ling-settings-box { background: #16181c; border: 1px solid #333; border-radius: 12px; padding: 20px; width: 300px; color: #fff; font-family: sans-serif; }
            .ling-row { margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .ling-btn { background: #00E676; color: #000; border: none; padding: 8px; border-radius: 5px; width: 100%; font-weight: bold; cursor: pointer; margin-top: 10px; }

            /* 🔥 V19.3 新增：双按钮划词菜单 */
            #ling-sniper-container {
                position: absolute; display: none; gap: 5px;
                z-index: 2147483647; animation: ling-pop 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            }
            .ling-sniper-btn {
                padding: 4px 10px; height: 24px; border-radius: 20px;
                color: #fff; font-size: 12px; font-weight: 900;
                display: flex; justify-content: center; align-items: center; cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid #fff;
                transition: transform 0.1s; white-space: nowrap;
            }
            .ling-sniper-btn:hover { transform: scale(1.1); filter: brightness(1.1); }
            #ling-meme-btn { background: #F3BA2F; color: #000; }
            #ling-tweet-btn { background: #1DA1F2; }
            @keyframes ling-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `;

        const node = document.createElement('style'); node.id = 'ling-style'; node.innerHTML = css; document.head.appendChild(node);
    }

    const _u = { d: (str) => decodeURIComponent(escape(window.atob(str))) };

    // ================= 3. 核心功能: 双刀流划词狙击 (V19.3) =================

    let sniperContainer = null;

    function initSniper() {
        if (sniperContainer) return;

        sniperContainer = document.createElement('div');
        sniperContainer.id = 'ling-sniper-container';

        // 按钮1: 搜MEME (GMGN)
        const memeBtn = document.createElement('div');
        memeBtn.id = 'ling-meme-btn';
        memeBtn.className = 'ling-sniper-btn';
        memeBtn.innerHTML = '⚡ 搜MEME';
        memeBtn.onmousedown = (e) => {
            e.preventDefault(); e.stopPropagation();
            const text = sniperContainer.getAttribute('data-text');
            if (text) AlphaCore.sniperSearch(text);
            sniperContainer.style.display = 'none';
        };

        // 按钮2: 搜推文 (Twitter)
        const tweetBtn = document.createElement('div');
        tweetBtn.id = 'ling-tweet-btn';
        tweetBtn.className = 'ling-sniper-btn';
        tweetBtn.innerHTML = '🐦 搜推文';
        tweetBtn.onmousedown = (e) => {
            e.preventDefault(); e.stopPropagation();
            const text = sniperContainer.getAttribute('data-text');
            if (text) AlphaCore.checkTrend(text); // 复用 checkTrend 逻辑 (现在是推特搜索)
            sniperContainer.style.display = 'none';
        };

        sniperContainer.appendChild(memeBtn);
        sniperContainer.appendChild(tweetBtn);
        document.body.appendChild(sniperContainer);

        document.addEventListener('mouseup', (e) => {
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection.toString().trim();
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (text.length >= 2 && text.length <= 20) { // 稍微放宽长度限制
                    showSniperMenu(e.pageX, e.pageY, text);
                } else {
                    sniperContainer.style.display = 'none';
                }
            }, 10);
        });

        document.addEventListener('mousedown', (e) => {
            if (!sniperContainer.contains(e.target)) {
                sniperContainer.style.display = 'none';
            }
        });
    }

    function showSniperMenu(x, y, text) {
        sniperContainer.style.left = (x + 10) + 'px';
        sniperContainer.style.top = (y - 40) + 'px';
        sniperContainer.setAttribute('data-text', text);
        sniperContainer.style.display = 'flex';
    }

    // ================= 4. 业务逻辑层 =================

    function detectChain(address, contextText) {
        if (!address.startsWith('0x')) return 'sol';
        const kws = __Kernel.getKeywords();
        const lowerText = (contextText || "").toLowerCase();
        const isEth = kws.some(kw => lowerText.includes(kw));
        return isEth ? 'eth' : 'bsc';
    }

    function getChainConfig(chain) {
        if (chain === 'sol') return { name: 'SOL', color: "linear-gradient(90deg, #9945FF 0%, #14F195 100%)", icon: '⚡' };
        if (chain === 'eth') return { name: 'ETH', color: "linear-gradient(90deg, #627EEA 0%, #454A75 100%)", icon: '🦄' };
        return { name: 'BSC', color: "linear-gradient(90deg, #F0B90B 0%, #FFA500 100%)", icon: '🟡' };
    }

    const dataCache = {};
    function loadTokenData(address, btnElement) {
        if (dataCache[address]) { updateButtonData(btnElement, dataCache[address]); return; }
        GM_xmlhttpRequest({
            method: "GET", url: __Kernel.getApi() + address,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data && data.pairs && data.pairs.length > 0) {
                        const bestPair = data.pairs.sort((a, b) => b.liquidity.usd - a.liquidity.usd)[0];
                        const info = {
                            price: parseFloat(bestPair.priceUsd).toFixed(bestPair.priceUsd < 0.01 ? 6 : 4),
                            fdv: formatNumber(bestPair.fdv),
                        };
                        dataCache[address] = info;
                        updateButtonData(btnElement, info);
                    }
                } catch (e) {}
            }
        });
    }

    function updateButtonData(btn, info) {
        const tag = btn.querySelector('.ling-data-tag');
        if (tag) { tag.innerText = `$${info.price} | MC:${info.fdv}`; btn.classList.add('ling-data-loaded'); }
    }

    function formatNumber(num) {
        if (!num) return "-";
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toFixed(0);
    }

    function createFastButton(address, chain) {
        const config = getChainConfig(chain);
        const btn = document.createElement('a');
        btn.href = __Kernel.genLink(chain, address);
        btn.target = "_blank";
        btn.className = 'ling-fast-btn';
        btn.style.background = config.color;
        btn.innerHTML = `${config.icon} ${config.name} <span class="ling-data-tag">...</span>`;
        btn.onclick = (e) => e.stopPropagation();
        loadTokenData(address, btn);
        return btn;
    }

    function processContent(element, text, platform) {
        if (!text || element.dataset.lingProcessed) return;
        if (text.length < 10) return;
        element.dataset.lingProcessed = "true";

        let addresses = [];
        if (platform !== 'discord') {
            const solRegex = /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g;
            const evmRegex = /\b(0x[a-fA-F0-9]{40})\b/g;
            let match;
            while ((match = solRegex.exec(text)) !== null) addresses.push({ addr: match[0], type: 'sol' });
            while ((match = evmRegex.exec(text)) !== null) addresses.push({ addr: match[0], type: 'evm' });
        }

        let needTrans = false;
        if (platform === 'twitter' || platform === 'discord') {
            const isForeign = !/[\u4e00-\u9fa5]/.test(text) || (text.match(/[\u4e00-\u9fa5]/g) || []).length / text.length < 0.3;
            if (isForeign) needTrans = true;
        }

        if (needTrans) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        let transResult = "";
                        if (data && data[0]) data[0].forEach(i => { if(i[0]) transResult += i[0]; });
                        if (transResult) renderBox(element, transResult, addresses, text, platform);
                    } catch(e) {}
                }
            });
        } else if (addresses.length > 0) {
            renderBox(element, null, addresses, text, platform);
        }
    }

    function renderBox(element, transText, addresses, originalText, platform) {
        if (!transText && addresses.length === 0) return;
        const container = document.createElement('div');
        container.className = platform === 'discord' ? 'ling-trans-box ling-discord-box' : 'ling-trans-box';
        if (transText) {
            container.innerHTML = `<span style="opacity:0.6;font-size:10px">[🤖 领哥工具译]</span><br>${transText}`;
        } else {
            container.style.background = "transparent";
            container.style.borderLeft = "none";
            container.style.padding = "0";
        }
        if (platform !== 'discord' && addresses.length > 0) {
            const btnContainer = document.createElement('div');
            if(transText) btnContainer.style.marginTop = "6px";
            addresses.forEach(item => {
                const chain = item.type === 'sol' ? 'sol' : detectChain(item.addr, originalText);
                const btn = createFastButton(item.addr, chain);
                btnContainer.appendChild(btn);
            });
            container.appendChild(btnContainer);
        }
        if (platform === 'twitter') element.parentNode.appendChild(container);
        else element.appendChild(container);
    }

    function refreshUserUI(handle, container) {
        const note = Storage.getNote(handle);
        let noteSpan = container.querySelector('.ling-user-note');
        if (note) {
            if (!noteSpan) {
                noteSpan = document.createElement('span');
                noteSpan.className = 'ling-user-note';
                const toolbar = container.querySelector('.ling-toolbar');
                if (toolbar) container.insertBefore(noteSpan, toolbar);
                else container.appendChild(noteSpan);
            }
            noteSpan.innerText = note;
            noteSpan.onclick = (e) => { e.preventDefault(); e.stopPropagation(); editNote(handle, container); };
        } else if (noteSpan) noteSpan.remove();

        const vipInfo = Storage.getVipInfo(handle);
        let vipBadge = container.querySelector('.ling-identity-badge');
        const article = container.closest('article');

        if (vipInfo) {
            if (article) article.classList.add('ling-vip-tweet');
            if (!vipBadge) {
                vipBadge = document.createElement('span');
                vipBadge.className = 'ling-identity-badge';
                container.appendChild(vipBadge);
            }
            vipBadge.innerText = vipInfo[0];
            const starBtn = container.querySelector('.ling-star-btn');
            if (starBtn) starBtn.classList.add('active');
        } else {
            if (article) article.classList.remove('ling-vip-tweet');
            if (vipBadge) vipBadge.remove();
            const starBtn = container.querySelector('.ling-star-btn');
            if (starBtn) starBtn.classList.remove('active');
        }
    }

    function editNote(handle, container) {
        const old = Storage.getNote(handle) || "";
        const val = prompt(`📝 备注 @${handle}:`, old);
        if (val !== null) { Storage.addNote(handle, val); refreshUserUI(handle, container); }
    }

    function toggleVip(handle, container) {
        const info = Storage.getVipInfo(handle);
        if (info) {
            if (confirm(`⚠️ 取消 @${handle} 的重点关注？`)) {
                Storage.removeVip(handle);
                refreshUserUI(handle, container);
            }
        } else {
            const label = prompt(`🔥 设为重点关注 @${handle}\n输入标签 (如: 顶级VC):`, "重点关注");
            if (label) {
                Storage.addVip(handle, label);
                refreshUserUI(handle, container);
            }
        }
    }

    function processUser(article) {
        if (article.dataset.lingUserProcessed) return;
        let handle = null, container = null;
        const links = article.querySelectorAll('a[href*="/"]');
        for (let link of links) {
            const h = link.getAttribute('href');
            if (h && !h.includes('/status/') && !h.includes('/hashtag/')) {
                const userNameDiv = article.querySelector('div[data-testid="User-Name"]');
                if (userNameDiv && userNameDiv.contains(link)) {
                    handle = h.replace('/', '').toLowerCase();
                    container = link.querySelector('div[dir="ltr"]') || link.parentNode;
                    break;
                }
            }
        }
        if (handle && container) {
            article.dataset.lingUserProcessed = "true";
            if (!container.querySelector('.ling-toolbar')) {
                const toolbar = document.createElement('span');
                toolbar.className = 'ling-toolbar';
                toolbar.style.whiteSpace = "nowrap";
                const pen = document.createElement('span');
                pen.className = 'ling-action-btn'; pen.innerHTML = '✏️';
                pen.onclick = (e) => { e.preventDefault(); e.stopPropagation(); editNote(handle, container); };
                const star = document.createElement('span');
                star.className = 'ling-action-btn ling-star-btn'; star.innerHTML = '⭐';
                star.onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleVip(handle, container); };
                toolbar.appendChild(pen);
                toolbar.appendChild(star);
                container.appendChild(toolbar);
            }
            refreshUserUI(handle, container);
        }
    }

    // ================= 6. 控制台 & 设置 =================
    function toggleDashboard() {
        let dashboard = document.querySelector('.ling-dashboard');
        if (!dashboard) {
            initDashboard();
            dashboard = document.querySelector('.ling-dashboard');
        }
        if (dashboard.style.display === 'none' || !dashboard.style.display) {
            dashboard.style.display = 'block';
            dashboard.classList.add('active');
        } else {
            dashboard.style.display = 'none';
        }
    }

    function handleMenuCommand() {
        let ball = document.querySelector('.ling-float-toggle');
        if (!ball) {
            createFloatingToggle();
            ball = document.querySelector('.ling-float-toggle');
        }
        if (ball.style.display === 'none') {
            ball.style.display = 'flex';
            alert("🦅 悬浮球已召回！");
        } else {
            toggleDashboard();
        }
    }

    // 🔥 Alpha Hunter Logic (Updated)
    const AlphaCore = {
        // 1. 全球热点 -> Google Trends (每日热搜)
        openNews: () => {
            // 跳转到 Google Trends Daily Search Trends (US) - 改为热点源
            window.open("https://trends.google.com/trends/trendingsearches/daily?geo=US", "_blank");
        },
        // 2. 狙击 -> GMGN (带参数)
        sniperSearch: (keyword) => {
            if(!keyword) return;
            GM_setClipboard(keyword);
            const targetUrl = `https://gmgn.ai/?chain=bsc&ref=1DRFPE0z&ling_auto_search=${encodeURIComponent(keyword)}`;
            window.open(targetUrl, "_blank");
        },
        // 3. 热度/搜推 -> Twitter Search (Live)
        checkTrend: (keyword) => {
            if(!keyword) return;
            const encoded = encodeURIComponent(keyword);
            // f=live 表示搜索最新帖子
            const url = `https://x.com/search?q=${encoded}&src=typed_query&f=live`;
            window.open(url, "_blank");
        }
    };

    function initDashboard() {
        const links = __Kernel.getLinks();
        const div = document.createElement('div');
        div.className = 'ling-dashboard';
        div.innerHTML = `
            <div style="color:#F3BA2F;font-weight:bold;margin-bottom:10px;display:flex;justify-content:space-between;border-bottom:1px solid #333;padding-bottom:5px;">
                <span>🦅 领哥工具箱</span><span style="cursor:pointer;" id="ling-close-dash">✕</span>
            </div>
            <a href="${links.gmgn}" target="_blank" class="ling-dash-link">⚡ 去 GMGN 交易</a>
            <a href="${links.ok}" target="_blank" class="ling-dash-link">🏦 去 OKX 交易</a>
            <a href="${links.bn}" target="_blank" class="ling-dash-link">🔶 去 币安Web3 交易</a>

            <div class="ling-dash-btn-row">
                <div class="ling-mini-btn" id="ling-btn-set">⚙️ 设置</div>
                <div class="ling-mini-btn" id="ling-btn-bk">📤 备份</div>
                <div class="ling-mini-btn" id="ling-btn-rs">📥 恢复</div>
            </div>

            <div style="border-top:1px dashed #333; margin:10px 0;"></div>
            <div style="color:#F3BA2F;font-size:12px;margin-bottom:5px;font-weight:bold;">🦁 阿尔法猎手 (Beta)</div>

            <div class="ling-mini-btn" id="ling-alpha-news" style="width:100%;margin-bottom:5px;color:#fff;background:#333;">🌍 全球热点 (Google)</div>

            <div class="ling-dash-btn-row">
                <input type="text" id="ling-sniper-kw" placeholder="输入代币名 (如: AI)" style="width:55%;background:#222;border:1px solid #444;color:#fff;padding:5px;border-radius:4px;font-size:11px;">
                <div class="ling-mini-btn" id="ling-sniper-go" style="width:20%;background:#00E676;color:#000;">⚡ 狙击</div>
                <div class="ling-mini-btn" id="ling-trend-go" style="width:20%;background:#1DA1F2;color:#fff;">🐦 搜推</div>
            </div>

            <a href="https://x.com/shangdu2005" target="_blank" class="ling-dash-link" style="margin-top:10px;justify-content:center;background:#1DA1F2;color:#fff;">🐦 关注领哥推特 @shangdu2005</a>

            <div style="margin-top:8px;font-size:10px;color:#666;text-align:center;">V19.3 Dual Blade</div>
        `;
        document.body.appendChild(div);

        document.getElementById('ling-close-dash').onclick = () => { div.style.display = 'none'; };
        document.getElementById('ling-btn-set').onclick = openSettings;
        document.getElementById('ling-btn-bk').onclick = Storage.export;
        document.getElementById('ling-btn-rs').onclick = Storage.import;

        document.getElementById('ling-alpha-news').onclick = AlphaCore.openNews;
        document.getElementById('ling-sniper-go').onclick = () => AlphaCore.sniperSearch(document.getElementById('ling-sniper-kw').value);
        document.getElementById('ling-trend-go').onclick = () => AlphaCore.checkTrend(document.getElementById('ling-sniper-kw').value);
    }

    function createFloatingToggle() {
        if (document.querySelector('.ling-float-toggle')) return;

        const div = document.createElement('div');
        div.className = 'ling-float-toggle';

        div.innerHTML = `
            <span class="ling-logo-text">Ling</span>
            <div class="ling-float-close" title="收起悬浮球 (在菜单中召回)">✕</div>
        `;
        div.title = '打开领哥工具箱 (可拖动)';

        div.onclick = (e) => {
            if (e.target.className === 'ling-float-close') return;
            if (div.getAttribute('data-dragging') === 'true') return;
            toggleDashboard();
        };

        const closeBtn = div.querySelector('.ling-float-close');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            div.style.display = 'none';
        };

        let isDragging = false;
        let startY, startTop;

        div.onmousedown = (e) => {
            if (e.target.className === 'ling-float-close') return;
            isDragging = false;
            div.setAttribute('data-dragging', 'false');
            startY = e.clientY;
            startTop = div.offsetTop;

            document.onmousemove = (ev) => {
                if (Math.abs(ev.clientY - startY) > 3) {
                    isDragging = true;
                    div.setAttribute('data-dragging', 'true');
                    div.style.cursor = 'grabbing';
                }
                if (isDragging) {
                    let newTop = startTop + (ev.clientY - startY);
                    const maxTop = window.innerHeight - 50;
                    if (newTop < 10) newTop = 10;
                    if (newTop > maxTop) newTop = maxTop;
                    div.style.top = newTop + 'px';
                }
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                div.style.cursor = 'grab';
                if (isDragging) {
                    const cfg = Storage.getConfig();
                    cfg.floatTop = div.style.top;
                    Storage.setConfig(cfg);
                    setTimeout(() => div.setAttribute('data-dragging', 'false'), 100);
                }
            };
        };

        document.body.appendChild(div);
    }

    function openSettings() {
        if (document.getElementById('ling-settings-overlay')) return;
        const cfg = Storage.getConfig();
        const div = document.createElement('div'); div.id = 'ling-settings-overlay';
        div.innerHTML = `
            <div id="ling-settings-box">
                <h3 style="margin-top:0;color:#F3BA2F;border-bottom:1px solid #333;padding-bottom:10px;">⚙️ 终端设置</h3>
                <div class="ling-row"><label>翻译颜色</label><input type="color" id="c-tc" value="${cfg.transColor}"></div>
                <div class="ling-row"><label>翻译字号</label><input type="text" id="c-ts" value="${cfg.transFontSize}" style="width:60px;background:#222;border:1px solid #444;color:#fff;padding:2px;"></div>
                <div class="ling-row"><label>VIP框色</label><input type="color" id="c-vc" value="${cfg.vipColor}"></div>
                <button class="ling-btn" id="ling-save">保存配置</button>
                <button class="ling-btn" id="ling-close" style="background:#333;color:#fff;margin-top:10px">关闭面板</button>
            </div>
        `;
        document.body.appendChild(div);
        document.getElementById('ling-close').onclick = () => div.remove();
        document.getElementById('ling-save').onclick = () => {
            Storage.setConfig({
                transColor: document.getElementById('c-tc').value,
                transFontSize: document.getElementById('c-ts').value,
                noteColor: '#1D9BF0',
                vipColor: document.getElementById('c-vc').value
            });
            div.remove();
        };
    }

    GM_registerMenuCommand("🦅 打开/关闭工具箱", handleMenuCommand);

    updateStyles();
    createFloatingToggle();
    initSniper();

    const observer = new MutationObserver((ms) => {
        ms.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
                if (location.host.includes('twitter.com') || location.host.includes('x.com')) {
                    const tweets = n.querySelectorAll ? n.querySelectorAll('div[data-testid="tweetText"]') : [];
                    tweets.forEach(t => processContent(t, t.innerText, 'twitter'));
                    if(n.tagName === 'ARTICLE') processUser(n);
                    else if(n.querySelectorAll) n.querySelectorAll('article').forEach(processUser);
                }
                else if (location.host.includes('discord.com')) {
                    const messages = n.querySelectorAll ? n.querySelectorAll('div[id^="message-content"]') : [];
                    messages.forEach(msg => processContent(msg, msg.innerText, 'discord'));
                }
                else {
                    if(n.innerText && n.innerText.length > 30 && n.innerText.length < 500) {
                        processContent(n, n.innerText, 'generic');
                    }
                }
            }
        }));
    });

    const start = () => {
        if(document.body) {
            if (location.host.includes('twitter.com') || location.host.includes('x.com')) {
                document.querySelectorAll('div[data-testid="tweetText"]').forEach(t => processContent(t, t.innerText, 'twitter'));
                document.querySelectorAll('article').forEach(processUser);
            }
            observer.observe(document.body, {childList: true, subtree: true});
        } else setTimeout(start, 500);
    };
    start();

    const __Kernel = (function() {
        const _s = {
            r: "MURSRlBFMHo=",
            o: "aHR0cHM6Ly93ZWIzLm9reC5jb20vam9pbi9MSU5HRTg4",
            b: "aHR0cHM6Ly93ZWIzLmJpbmFuY2UuY29tL3JlZmVycmFsP3JlZj1GSTdDMTJCSg==",
            a: "aHR0cHM6Ly9hcGkuZGV4c2NyZWVuZXIuY29tL2xhdGVzdC9kZXgvdG9rZW5zLw==",
            g: "aHR0cHM6Ly9nbWduLmFpLw=="
        };

        return {
            genLink: (c, a) => `${_u.d(_s.g)}${c}/token/${_u.d(_s.r)}_${a}`,
            getLinks: () => ({
                ok: _u.d(_s.o),
                bn: _u.d(_s.b),
                gmgn: `${_u.d(_s.g)}?ref=${_u.d(_s.r)}`
            }),
            getApi: () => _u.d(_s.a),
            getKeywords: () => ['eth', 'ethereum', 'erc20', 'vitalik', 'base', 'optimism']
        };
    })();

})();