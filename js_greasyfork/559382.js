// ==UserScript==
// @name         Twitter/X 廣告與詐騙過濾器
// @namespace    http://tampermonkey.net/
// @version      11.2
// @description  過濾推特廣告與詐騙。修正「圖案+文字」的順序讀取問題，確保 Emoji 在前或在後都能精準過濾，可以自行加入關鍵字和布想要的圖案會自動篩除。
// @author       程式夥伴
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559382/TwitterX%20%E5%BB%A3%E5%91%8A%E8%88%87%E8%A9%90%E9%A8%99%E9%81%8E%E6%BF%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559382/TwitterX%20%E5%BB%A3%E5%91%8A%E8%88%87%E8%A9%90%E9%A8%99%E9%81%8E%E6%BF%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 救援清單 ---
    const recoveredKeywords = "";

    // 讀取設定
    let blockKeywords = GM_getValue('block_keywords_v3', recoveredKeywords).split(',').map(k => k.trim().toLowerCase()).filter(k => k);
    let hideAds = GM_getValue('hide_ads', true);
    let debugMode = GM_getValue('debug_mode', false);

    // --- 2. CSS 樣式 ---
    GM_addStyle(`
        .filtered-placeholder {
            background-color: #16181c; color: #71767b; font-size: 13px;
            text-align: center; padding: 10px 0; margin: 5px 0;
            border-radius: 8px; border: 1px dashed #2f3336;
            display: flex; justify-content: center; align-items: center; gap: 10px;
        }
        .view-btn {
            background: rgba(29, 155, 240, 0.1); color: #1d9bf0; border: 1px solid #1d9bf0;
            padding: 2px 8px; border-radius: 12px; cursor: pointer; font-size: 11px; font-weight: bold;
        }
        .view-btn:hover { background: #1d9bf0; color: white; }

        #filter-panel-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); z-index: 99999;
            display: flex; justify-content: center; align-items: center;
        }
        #filter-panel {
            background: #000; color: #e7e9ea; padding: 20px;
            border-radius: 16px; width: 450px; max-width: 90%; border: 1px solid #333;
            box-shadow: 0 0 20px rgba(255,255,255,0.1); font-family: sans-serif;
        }
        #keyword-list {
            display: flex; flex-wrap: wrap; gap: 8px; max-height: 250px; overflow-y: auto;
            margin-bottom: 15px; padding: 8px; background: #111; border-radius: 8px; border: 1px solid #333;
        }
        .kw-tag {
            background: #1d9bf0; color: white; padding: 4px 10px;
            border-radius: 20px; font-size: 13px; display: flex; align-items: center; gap: 6px;
        }
        .kw-tag span { cursor: pointer; font-weight: bold; opacity: 0.7; }
        .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
        #new-kw-input { flex: 1; padding: 10px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; }
        #add-kw-btn { background: #00ba7c; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; font-weight:bold;}
        .panel-actions { display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #333; padding-top: 15px; }
    `);

    // --- 3. UI 介面 ---
    function createManagerUI() {
        if (document.getElementById('filter-panel-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'filter-panel-overlay';
        overlay.innerHTML = `
            <div id="filter-panel">
                <h3 style="margin:0 0 15px 0;border-bottom:1px solid #333;padding-bottom:10px;">🚫 關鍵字過濾管理 (v10.0)</h3>
                <div style="margin-bottom:10px; display:flex; gap:10px;">
                    <button id="export-btn" style="background:#222;color:#1d9bf0;border:1px solid #555;cursor:pointer;padding:5px 10px;border-radius:4px;">📤 匯出</button>
                    <button id="import-btn" style="background:#222;color:#1d9bf0;border:1px solid #555;cursor:pointer;padding:5px 10px;border-radius:4px;">📥 匯入</button>
                </div>
                <div id="keyword-list"></div>
                <div class="input-group">
                    <input type="text" id="new-kw-input" placeholder="輸入關鍵字 (支援文字/Emoji)">
                    <button id="add-kw-btn">新增</button>
                </div>
                <div class="panel-actions">
                    <button id="close-btn" style="background:transparent;color:#ccc;border:1px solid #555;padding:6px 15px;cursor:pointer;border-radius:20px;">關閉</button>
                    <button id="save-btn" style="background:#fff;color:#000;border:none;padding:6px 15px;cursor:pointer;border-radius:20px;font-weight:bold;">儲存並套用</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const listDiv = document.getElementById('keyword-list');
        const input = document.getElementById('new-kw-input');
        let tempKeywords = [...blockKeywords]; 

        function renderTags() {
            listDiv.innerHTML = '';
            if (tempKeywords.length === 0) listDiv.innerHTML = '<div style="color:#666;font-size:12px;padding:5px;">無關鍵字</div>';
            tempKeywords.forEach((kw, index) => {
                const tag = document.createElement('div');
                tag.className = 'kw-tag';
                tag.innerHTML = `${kw} <span title="刪除">✕</span>`;
                tag.querySelector('span').onclick = () => { tempKeywords.splice(index, 1); renderTags(); };
                listDiv.appendChild(tag);
            });
        }
        function addKeyword(val) {
            val = val.trim().toLowerCase();
            if (val && !tempKeywords.includes(val)) { tempKeywords.push(val); return true; }
            return false;
        }

        document.getElementById('export-btn').onclick = () => { GM_setClipboard(tempKeywords.join(',')); alert('✅ 已複製清單'); };
        document.getElementById('import-btn').onclick = () => {
            const d = prompt("貼上清單(逗號分隔)"); if(d) { d.split(',').forEach(w=>addKeyword(w)); renderTags(); }
        };
        document.getElementById('add-kw-btn').onclick = () => { if(addKeyword(input.value)) input.value=''; renderTags(); };
        input.onkeypress = (e) => { if(e.key==='Enter'){ if(addKeyword(input.value)) input.value=''; renderTags(); }};
        document.getElementById('close-btn').onclick = () => overlay.remove();
        document.getElementById('save-btn').onclick = () => {
            blockKeywords = tempKeywords; GM_setValue('block_keywords_v3', blockKeywords.join(','));
            overlay.remove(); location.reload();
        };
        renderTags();
    }
    
    function registerMenus() {
        GM_registerMenuCommand(`⚙️ 管理關鍵字`, createManagerUI);
        const adStatus = hideAds ? "✅" : "❌";
        GM_registerMenuCommand(`📢 隱藏廣告 (${adStatus})`, () => {
            GM_setValue('hide_ads', !hideAds); location.reload();
        });
        const debugStatus = debugMode ? "✅" : "❌";
        GM_registerMenuCommand(`🐞 除錯模式 (${debugStatus})`, () => {
            GM_setValue('debug_mode', !debugMode); 
            alert(`除錯模式已${!debugMode ? "開啟" : "關閉"}`);
            location.reload();
        });
    }
    registerMenus();

    // --- 4. 核心邏輯 (v11.2: 依序讀取 DOM) ---
    function normalize(str) {
        if (!str) return "";
        return str.toLowerCase().replace(/\s+/g, ''); 
    }

    // 遞迴掃描 DOM，依照視覺順序獲取文字與圖片含義
    function getVisualTextContent(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            // 如果是圖片 (Emoji)
            if (node.tagName === 'IMG' && node.alt) {
                return node.alt;
            }
            // 如果是 SVG (圖標)
            if (node.tagName === 'SVG') {
                return node.getAttribute('aria-label') || "";
            }
            // 忽略隱藏元素 (避免讀到沒顯示的 metadata)
            // 但 Twitter 的結構比較複雜，這裡暫時不做太嚴格的 style 檢查以免漏掉
            
            let result = "";
            for (let child of node.childNodes) {
                result += getVisualTextContent(child);
            }
            return result;
        }
        return "";
    }

    function processTweets() {
        const tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]:not(.processed)');

        tweets.forEach(tweetCell => {
            
            let shouldBlock = false;
            let blockReason = "";
            
            // 使用新的讀取器，確保順序正確
            const visualText = getVisualTextContent(tweetCell);
            const cleanContent = normalize(visualText);

            if (debugMode) {
                console.log(`v11掃描: ${cleanContent.substring(0, 100)}...`);
            }

            // A. 廣告過濾
            if (hideAds) {
                const adIndicators = tweetCell.querySelectorAll('[dir="ltr"] > span');
                for (let span of adIndicators) {
                    if (['Ad', 'Promoted', '推廣', '廣告'].includes(span.innerText)) {
                        shouldBlock = true;
                        blockReason = "廣告";
                        break;
                    }
                }
            }

            // B. 關鍵字過濾
            if (!shouldBlock && blockKeywords.length > 0) {
                const hitKeyword = blockKeywords.find(keyword => {
                    const cleanKeyword = normalize(keyword);
                    // 檢查包含關係
                    return cleanContent.includes(cleanKeyword);
                });

                if (hitKeyword) {
                    shouldBlock = true;
                    blockReason = `關鍵字: ${hitKeyword}`;
                }
            }

            // C. 執行過濾 (隱藏 + 偷看按鈕)
            if (shouldBlock) {
                tweetCell.classList.add('processed');
                const children = Array.from(tweetCell.children);
                children.forEach(child => {
                    if (!child.classList.contains('filtered-placeholder')) {
                        child.style.display = 'none';
                        child.classList.add('original-content-hidden');
                    }
                });

                if (!tweetCell.querySelector('.filtered-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'filtered-placeholder';
                    placeholder.innerHTML = `
                        <span>🚫 已過濾 (${blockReason})</span>
                        <button class="view-btn">👀 查看</button>
                    `;
                    const btn = placeholder.querySelector('.view-btn');
                    btn.onclick = function(e) {
                        e.stopPropagation();
                        const hiddenContents = tweetCell.querySelectorAll('.original-content-hidden');
                        const isCurrentlyHidden = hiddenContents[0].style.display === 'none';
                        if (isCurrentlyHidden) {
                            hiddenContents.forEach(el => el.style.display = '');
                            btn.innerText = '🙈 隱藏';
                            btn.style.background = '#333';
                            btn.style.color = '#ccc';
                        } else {
                            hiddenContents.forEach(el => el.style.display = 'none');
                            btn.innerText = '👀 查看';
                            btn.style.background = '';
                            btn.style.color = '';
                        }
                    };
                    tweetCell.appendChild(placeholder);
                }
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) processTweets();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(processTweets, 1000);

})();