// ==UserScript==
// @name         Shadowverse-WB 卡圖批次下載（按費用分類版）
// @namespace    http://tampermonkey.net/
// @version      7.8
// @description  自動按每個費用分別下載所有卡圖（檔名格式：cost_卡名.png）
// @match        https://shadowverse-wb.com/cht/deck/cardslist/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      shadowverse-wb.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551712/Shadowverse-WB%20%E5%8D%A1%E5%9C%96%E6%89%B9%E6%AC%A1%E4%B8%8B%E8%BC%89%EF%BC%88%E6%8C%89%E8%B2%BB%E7%94%A8%E5%88%86%E9%A1%9E%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551712/Shadowverse-WB%20%E5%8D%A1%E5%9C%96%E6%89%B9%E6%AC%A1%E4%B8%8B%E8%BC%89%EF%BC%88%E6%8C%89%E8%B2%BB%E7%94%A8%E5%88%86%E9%A1%9E%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const DOWNLOAD_DELAY = 300;  // 每張延遲(ms)
    const COST_DELAY = 2000;     // 每個費用延遲(ms)

    // === UI 元件 ===
    const btn = document.createElement('button');
    btn.textContent = '🪄 開始批次下載';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '30px', right: '30px', zIndex: '9999',
        padding: '14px 18px', background: '#1d72b8', color: 'white',
        border: 'none', borderRadius: '50px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        fontSize: '16px', cursor: 'pointer', transition: '0.3s'
    });
    btn.onmouseenter = () => btn.style.background = '#155a8a';
    btn.onmouseleave = () => btn.style.background = '#1d72b8';
    document.body.appendChild(btn);

    const progressBox = document.createElement('div');
    Object.assign(progressBox.style, {
        position: 'fixed', top: '20px', right: '20px', background: 'rgba(0,0,0,0.9)',
        color: 'white', padding: '15px 20px', borderRadius: '8px', zIndex: '9999',
        fontSize: '14px', display: 'none', maxWidth: '400px', maxHeight: '80vh',
        overflow: 'auto', lineHeight: '1.6'
    });
    document.body.appendChild(progressBox);

    btn.onclick = function() {
        btn.disabled = true;
        btn.textContent = '⏳ 下載中...';
        progressBox.style.display = 'block';
        progressBox.innerHTML = '';

        startBatchDownloadByCost()
            .then(() => {
                btn.textContent = '✅ 完成';
                setTimeout(() => { btn.textContent = '🪄 重新下載'; btn.disabled = false; }, 3000);
            })
            .catch(e => {
                console.error(e);
                log('❌ 錯誤: ' + e.message);
                btn.textContent = '❌ 錯誤';
                btn.disabled = false;
            });
    };

    // === 主函式 ===
    async function startBatchDownloadByCost() {
        log('🔍 開始分析頁面...');
        ensureDetailedSearchOpen();

        const availableCosts = getAllCostOptions();
        const uniqueCosts = [...new Set(availableCosts.map(Number))].sort((a,b)=>a-b); // 0~10 排序
        log('✅ 偵測到費用選項: ' + uniqueCosts.join(', '));

        if (uniqueCosts.length === 0) { log('❌ 找不到費用選項'); return; }

        let totalDownloaded = 0, totalFailed = 0;

        for (const cost of uniqueCosts) {
            log('\n━━━━━━━━━━━━━━━━━━━━━━');
            log('📌 開始處理費用 ' + cost);
            const cards = await fetchCardsByCost(cost);
            if (cards.length === 0) { log(`⚠️ 費用 ${cost} 沒有找到卡片`); continue; }
            log(`✅ 費用 ${cost} 找到 ${cards.length} 張卡片`);
            const result = await downloadCardsWithPrefix(cards, cost);
            totalDownloaded += result.success; totalFailed += result.failed;
            log(`✓ 費用 ${cost} 完成：成功 ${result.success}，失敗 ${result.failed}`);
            await delay(COST_DELAY);
        }

        log(`🎉 全部完成！總共下載: ${totalDownloaded}，失敗: ${totalFailed}`);
    }

    // === 展開詳細搜尋 ===
    function ensureDetailedSearchOpen() {
        const toggleBtn = document.querySelector('.js-reset-search-btn.btn-toggle-detailed-search');
        if (toggleBtn && toggleBtn.classList.contains('closed')) toggleBtn.click();
    }

    // === 取得所有 cost 選項 ===
    function getAllCostOptions() {
        const checkboxes = document.querySelectorAll('input[name="cost"]');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // === 抓取指定 cost 的所有卡片 ===
    function fetchCardsByCost(cost) {
        return new Promise(resolve => {
            // ✅ 每次篩選前點擊「全部清除」
            const resetBtn = document.querySelector('.js-reset-search-btn.reset-action-btn[data-reset-type="all"]');
            if (resetBtn) resetBtn.click();

            setTimeout(() => {
                uncheckAllCostCheckboxes();
                const target = document.querySelector(`input[name="cost"][value="${cost}"]`);
                if (!target) { log(`❌ 找不到費用 ${cost}`); resolve([]); return; }
                target.checked = true;

                const searchBtn = document.querySelector('.search-action-btn');
                if (!searchBtn) { log('❌ 找不到搜尋按鈕'); resolve([]); return; }
                searchBtn.click();

                // 等待 DOM 更新
                setTimeout(() => {
                    const totalItems = parseInt(document.querySelector('#hitCount .num')?.textContent || '0');
                    let cards = extractCardsFromCurrentPage();
                    const totalPages = Math.ceil(totalItems / (cards.length || totalItems));
                    if (totalPages > 1) fetchRemainingPagesByCost(cost, 2, totalPages, cards, resolve);
                    else resolve(cards);
                }, 2000);

            }, 500); // 給 resetBtn 一點反應
        });
    }

    function uncheckAllCostCheckboxes() {
        document.querySelectorAll('input[name="cost"]').forEach(cb => cb.checked = false);
    }

    function extractCardsFromCurrentPage() {
        const cards = [];
        let elems = document.querySelectorAll('#card-list li.card-wrapper');
        if (!elems.length) elems = document.querySelectorAll('.card-wrapper');
        elems.forEach(cardElem => {
            const img = cardElem.querySelector('img.card-img');
            if (!img) return;
            let url = img.src.startsWith('/') ? 'https://shadowverse-wb.com'+img.src : img.src;
            cards.push({ name: img.alt || '未命名', url });
        });
        return cards;
    }

    function fetchRemainingPagesByCost(cost, currentPage, totalPages, allCards, callback) {
        if (currentPage > totalPages) { callback(allCards); return; }
        const pageLink = document.querySelector(`.pagination a[href*="page=${currentPage}"]`);
        if (!pageLink) {
            const url = new URL(location.href); url.searchParams.set('page', currentPage); location.href = url.toString();
            return;
        }
        pageLink.click();
        setTimeout(() => {
            const pageCards = extractCardsFromCurrentPage();
            allCards = allCards.concat(pageCards);
            fetchRemainingPagesByCost(cost, currentPage+1, totalPages, allCards, callback);
        }, 2000);
    }

    function downloadCardsWithPrefix(cards, costPrefix) {
        let counter=0, success=0, fail=0;
        const downloadNext = () => {
            if (counter >= cards.length) return Promise.resolve({success, failed:fail});
            const card = cards[counter++]; 
            return downloadCard(card, costPrefix, counter, cards.length)
                .then(suc => { suc?success++:fail++; return delay(DOWNLOAD_DELAY); })
                .then(downloadNext);
        };
        return downloadNext();
    }

    function downloadCard(card, costPrefix, index, total) {
        return new Promise(resolve => {
            const filename = `${costPrefix}_${sanitizeFilename(card.name)}.png`;
            log(`⬇️ [${index}/${total}] ${card.name}`);
            if (typeof GM_download==='undefined'){ log('❌ GM_download 未授權'); resolve(false); return; }
            try {
                GM_download({url:card.url, name:filename, saveAs:false, 
                    onload:()=>resolve(true),
                    onerror:()=>{ log(`❌ 失敗: ${card.name}`); resolve(false); },
                    ontimeout:()=>{ log(`⏱️ 逾時: ${card.name}`); resolve(false); }
                });
            } catch(e){ log(`❌ 錯誤: ${e.message}`); resolve(false); }
        });
    }

    function sanitizeFilename(name){ return name.replace(/[\\\/:*?"<>|]/g,'_'); }
    function delay(ms){ return new Promise(res=>setTimeout(res,ms)); }
    function log(msg){ console.log('[SV-DL]', msg); progressBox.innerHTML+=msg+'<br>'; progressBox.scrollTop=progressBox.scrollHeight; }

    log('💡 點擊右下角按鈕開始下載（會自動處理所有費用）');
})();