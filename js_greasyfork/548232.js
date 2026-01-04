// ==UserScript==
// @name         FB Marketplace Slide Item Viewer
// @icon         https://www.facebook.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      13.4
// @description  Facebook Marketplace 商品卡片預覽：列表 hover 顯示浮動卡片、最後 hover 位置固定、單頁模式右側固定、上下拖曳、SPA 支援、節流與快取、CSS 美化、淡入淡出效果
// @author       HY
// @match        *://www.facebook.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548232/FB%20Marketplace%20Slide%20Item%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/548232/FB%20Marketplace%20Slide%20Item%20Viewer.meta.js
// ==/UserScript==

(function(){
    'use strict';

    /* -------------------- 配置與狀態 -------------------- */
    const DELAY_THROTTLE_MS = 600; // hover 請求節流延遲 (毫秒)
    let isDragging = false; // 卡片拖曳狀態
    let hoverTimeout = null; // hover 節流定時器
    let currentHoverItemId = null; // 當前 hover 的 itemId
    let lastHoverPos = null; // 最後 hover 的卡片位置
    let hoverEnabled = true; // hover 是否啟用（單頁模式停用）

    /* -------------------- CSS -------------------- */
    const style = document.createElement('style');
    style.textContent =
        `
        /* ---------- 卡片容器 ---------- */
        #fb-marketplace-card {
            position: fixed;
            width: 320px;
            background: #fff;
            border: 1px solid #dcdcdc;
            border-radius: 12px;
            padding: 12px 14px;
            z-index: 99999;
            box-shadow: 0 6px 18px rgba(0,0,0,0.08);
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #111;
            display: none;      /* 初始隱藏 */
            opacity: 0;
            transition: opacity 0.2s;
            user-select: auto;
            cursor: grab;
            overflow: visible;
        }

    /* ---------- 顯示狀態 ---------- */
    #fb-marketplace-card.show {
        opacity: 1;
    }

    /* ---------- 關閉按鈕 ---------- */
    #fb-marketplace-card .close-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        cursor: pointer;
        font-size: 16px;
        color: #555;
    }

    /* ---------- 標籤與分隔線 ---------- */
    #fb-marketplace-card .tag-icon { margin-right: 2px; }
    #fb-marketplace-card .divider { border-bottom: 1px solid #e0e0e0; width: 100%; box-sizing: border-box; margin: 8px 0; }

    /* ---------- 日期時間 ---------- */
    #fb-marketplace-card .date-time {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 8px;
    }

    /* ---------- 描述區塊 ---------- */
    #fb-marketplace-card .description {
        max-height: 200px;
        overflow-y: auto;
        padding: 4px 0;
        scrollbar-width: none;       /* Firefox */
        -ms-overflow-style: none;    /* IE 10+ */
    }
    #fb-marketplace-card .description::-webkit-scrollbar { display: none; }

    /* ---------- 小標籤 ---------- */
    #fb-marketplace-card .tag {
        display: inline-block;
        background: #eee;
        color: #555;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        margin: 0 4px 4px 0;  /* 合併 margin-right 和 margin-bottom */
    }

    /* ---------- 文字區塊 ---------- */
    #fb-marketplace-card .item-id, .title, .attributes, .date-time, .price,.seller, .description { margin: 4px 0; }
    #fb-marketplace-card .item-id { font-size: 12px; color: #888; font-weight: 500; text-align: left; }
    #fb-marketplace-card .title { font-weight: 800; }

    /* ---------- 價格 ---------- */
    #fb-marketplace-card .price {
        font-weight: 700;
        color: #2e7d32;
        text-align: center;
        padding: 8px 0;
        border-radius: 6px;
        background: #eaf7ea;
        margin-bottom: 10px;
    }

    /* ---------- 賣家區塊 ---------- */
    #fb-marketplace-card .seller .seller-name,
        #fb-marketplace-card .seller .seller-group-name {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 6px;
            font-weight: 600;
            text-decoration: none;
            margin: 0 6px 4px 0;  /* 合併 margin-right 和 margin-bottom */
        }

    #fb-marketplace-card .seller .seller-name { background: #eef3ff; }
    #fb-marketplace-card .seller .seller-group-name { background: #f7e8fb; }
    `
    ;
    document.head.appendChild(style);

    /* -------------------- Fetcher with Cache -------------------- */
    const FBMarketplaceFetcher = (() => {
        let cachedFbDtsg = null;
        let cachedDocID = null;
        let cache = new Map();
        let inflight = {};

        /** 取得 GraphQL doc_id */
        async function getDocid() {
            if(cachedDocID) return cachedDocID;
            try{
                if (typeof window.require !== 'function') throw "defined ReactJS require function";
                /* __d("MarketplacePDPContainerQuery_facebookRelayOperation") */
                const id = window.require("MarketplacePDPContainerQuery_facebookRelayOperation");
                if (typeof id !== "string") throw "require isn't string"
                cachedDocID = id;
            }catch(err) {
                console.error("取得 doc_id 失敗:",err)
                cachedDocID = "24056064890761782";
            }
            return cachedDocID
        }

        /** 取得 fb_dtsg token */
        async function getFbDtsg(){
            if(cachedFbDtsg) return cachedFbDtsg;
            try{
                const res = await fetch('https://www.facebook.com/ajax/dtsg/?__a=true', {credentials:'include'});
                const text = await res.text();
                const data = JSON.parse(text.replace('for (;;);',''));
                cachedFbDtsg = data?.payload?.token || null;
                return cachedFbDtsg;
            }catch(err){ console.error("取得 fb_dtsg 失敗:",err); return null; }
        }

        /** GraphQL 請求 */
        async function fetchItemRaw(targetId){
            //type 56 = require("FeedbackSourceType").MARKETPLACE_MEGAMALL
            const baseURL = "https://www.facebook.com/api/graphql/";
            const doc_id = await getDocid();
            const fb_dtsg = await getFbDtsg();
            const variables = encodeURIComponent(JSON.stringify({
                feedbackSource:56,
                feedLocation:"MARKETPLACE_MEGAMALL",
                referralCode:"marketplace_top_picks",
                scale:1,
                targetId,
                useDefaultActor:false,
                __relay_internal__pv__CometUFICommentAvatarStickerAnimatedImagerelayprovider: false,
                __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
                __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: false,
                __relay_internal__pv__CometUFI_dedicated_comment_routable_dialog_gkrelayprovider: false,
                __relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider: false,
                __relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider:false,
                __relay_internal__pv__IsWorkUserrelayprovider: false,
                __relay_internal__pv__MarketplacePDPRedesignrelayprovider: false
            }));
            const body = `&fb_dtsg=${fb_dtsg}&variables=${variables}&doc_id=${doc_id}&fb_api_req_friendly_name=MarketplacePDPContainerQuery`;
            const res = await fetch(baseURL, {
                method:"POST",
                headers:{"Content-Type":"application/x-www-form-urlencoded","x-fb-friendly-name":"MarketplacePDPContainerQuery"},
                referrer:"https://www.facebook.com/marketplace",
                credentials:"include",
                mode:"cors",
                body
            });
            return res.json();
        }

        /** Cache 控制與 inflight 控制 */
        async function fetchItemWithCache(itemId){
            if(cache.has(itemId)) return cache.get(itemId);
            if(inflight[itemId]) return inflight[itemId];
            const p = fetchItemRaw(itemId)
            .then(res => { cache.set(itemId,res); delete inflight[itemId]; return res; })
            .catch(err => { delete inflight[itemId]; throw err; });
            inflight[itemId] = p;
            return p;
        }

        /** 單頁模式顯示右側固定卡片 */
        async function showByItemId(itemId){
            try{
                showPreview('loading');
                const data = await fetchItemWithCache(itemId);
                renderItemData(data);
            }catch(e){ showPreview('error'); }
        }

        return { fetchItemWithCache, showByItemId };
    })();

    /* -------------------- Card DOM & UI -------------------- */
    function createCard(){
        let card = document.getElementById('fb-marketplace-card');
        if(card) return card;

        card = document.createElement('div');
        card.id = 'fb-marketplace-card';
        const content = document.createElement('div'); content.className = 'content';
        card.appendChild(content);

        // 關閉按鈕
        const closeBtn = document.createElement('div'); closeBtn.className='close-btn'; closeBtn.textContent='×';
        closeBtn.addEventListener('click', ()=>{
            card.style.display='none';
            card.dataset.mode='';
            lastHoverPos=null;
            card.classList.remove('show');
        });
        card.appendChild(closeBtn);
        document.body.appendChild(card);

        // 拖曳（Y 軸）
        let startY=0,startTop=0;
        card.addEventListener('mousedown', e=>{
            if(e.target===closeBtn) return;
            isDragging = true; startY = e.clientY; startTop = card.offsetTop; card.style.cursor='grabbing'; e.preventDefault();
        });
        document.addEventListener('mousemove', e=>{
            if(!isDragging) return;
            let newTop = startTop + (e.clientY - startY);
            newTop = Math.max(10, Math.min(newTop, window.innerHeight - card.offsetHeight - 10));
            card.style.top = newTop + 'px';
            card.dataset.top = newTop;
        });
        document.addEventListener('mouseup', ()=>{ if(isDragging){ isDragging=false; card.style.cursor='grab'; } });

        return card;
    }

    /** 調整卡片位置避免超出螢幕 */
    function adjustCardWithinScreen(card){
        const rect = card.getBoundingClientRect();
        let left = rect.left, top = rect.top;
        const width = rect.width, height = rect.height;
        const margin = 20;
        if(left < margin) left = margin;
        if(left + width > window.innerWidth - margin) left = window.innerWidth - width - margin;
        if(top < margin) top = margin;
        if(top + height > window.innerHeight - margin) top = window.innerHeight - height - margin;
        card.style.left = left+'px';
        card.style.top = top+'px';
    }

    /** 顯示 Loading / Error 預覽 */
    function showPreview(status){
        const card = createCard();
        const content = card.querySelector('.content');
        if(status==='loading') content.innerHTML='<div style="text-align:center;color:#888;padding:10px">Loading...</div>';
        else if(status==='error') content.innerHTML='<div style="text-align:center;color:red;padding:10px">Failed!</div>';
        if(lastHoverPos){ card.style.left=lastHoverPos.x+'px'; card.style.top=lastHoverPos.y+'px'; }
        card.style.display='block'; card.classList.add('show'); adjustCardWithinScreen(card);
    }

    /** 渲染商品資料 */
    function renderItemData(json){
        if(!json){ showPreview('error'); return; }
        const card = createCard();
        const item = json?.data?.viewer?.marketplace_product_details_page?.target || {};
        card.querySelector('.content').innerHTML = generateContentHTML(item);
        if(lastHoverPos){ card.style.left=lastHoverPos.x+'px'; card.style.top=lastHoverPos.y+'px'; }
        card.style.display='block'; card.classList.add('show'); adjustCardWithinScreen(card);
    }

    /** 生成卡片 HTML */
    function generateContentHTML(item){
        const itemId = item.id || 'N/A', title = item.marketplace_listing_title || 'N/A', price = item.formatted_price?.text || item.listing_price?.amount || 'N/A';
        const sellerName = item.marketplace_listing_seller?.name || 'N/A', sellerId = item.marketplace_listing_seller?.id || 'N/A';
        const sellerUrl = sellerId?`https://www.facebook.com/${sellerId}`:'';
        const sellerGroup = item.origin_group?.name || null, sellerGroupUrl = item.share_uri || '';
        const sellerGroupHTML = sellerGroup ? `<div class="seller-group-name"><a href="${sellerGroupUrl}" target="_blank">${sellerGroup}</a></div>`:'';
        const locationText = item.location_text?.text || item.location?.reverse_geocode_detailed?.city || 'N/A';
        const description = item.redacted_description?.text || '';
        const tagsHTML = generateTags(item.marketplace_listing_category_name, item.attribute_data, locationText);
        const {dateStr,timeStr} = formatCreationTime(item.creation_time);
        const descriptionHTML = description?`<div class="divider"></div><div class="description">${description.replace(/\n/g,'<br>')}</div>`:'';
        return `<div class="item-id">#${itemId}</div>
                <div class="title">${title}</div>
                <div class="attributes">${tagsHTML}</div>
                <div class="date-time"><div class="date">${dateStr}</div><div class="time">${timeStr}</div></div>
                <div class="divider"></div>
                <div class="price">${price}</div>
                <div class="seller">
                <div class="seller-name"><a href="${sellerUrl}" target="_blank">${sellerName}</a></div>${sellerGroupHTML}</div>
                ${descriptionHTML}`;
    }

    /** 生成標籤 HTML */
    function generateTags(categoryName, attributes=[], locationText=''){
        const locationTag = locationText?`<span class="tag"><span class="tag-icon">📍</span>${locationText}</span>`:'';
        const categoryTag = categoryName?`<span class="tag"><span class="tag-icon">🏷️</span>${categoryName}</span>`:'';
        const attrTags = (attributes||[]).map(a=>`<span class="tag"><span class="tag-icon">📏</span>${a.label}</span>`).join('');
        return locationTag + categoryTag + attrTags;
    }

    /** 格式化時間 */
    function formatCreationTime(timestamp){
        if(!timestamp) return {dateStr:'',timeStr:''};
        const d=new Date(timestamp*1000), now=new Date();
        const diffM=Math.floor((now-d)/(1000*60)), diffH=Math.floor(diffM/60), diffD=Math.floor(diffH/24);
        const dateStr=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const timeStr=diffM<60?`${diffM} 分鐘前`:diffH<24?`${diffH} 小時前`:diffD===1?`昨天 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`:`${diffD} 天前 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        return {dateStr,timeStr};
    }

    /* -------------------- Hover Delegate (/marketplace) -------------------- */
    function setupHoverDelegate(){
        document.body.addEventListener('mouseover', e=>{
            if(!hoverEnabled) return;
            if(!location.pathname.startsWith('/marketplace')) return;
            if(/\/marketplace\/item\/\d+/.test(location.pathname)) return;
            const a = e.target.closest && e.target.closest('a[href*="/marketplace/item/"]'); if(!a) return;
            const m = (a.getAttribute('href')||a.href||'').match(/\/marketplace\/item\/(\d+)/);
            const itemId = m?m[1]:null; if(!itemId) return;
            if(currentHoverItemId===itemId) return;
            currentHoverItemId = itemId;
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(async ()=>{
                lastHoverPos = {x:e.clientX+10, y:e.clientY-240-10};
                FBMarketplaceFetcher.showByItemId(itemId);
            }, DELAY_THROTTLE_MS);
        }, true);

        document.body.addEventListener('mouseout', e=>{
            if(!hoverEnabled) return;
            if(!location.pathname.startsWith('/marketplace')) return;
            if(/\/marketplace\/item\/\d+/.test(location.pathname)) return;
            const card = createCard();
            const related = e.relatedTarget;
            const anchor = e.target.closest('a[href*="/marketplace/item/"]');
            if(anchor && related && anchor.contains(related)) return;
            if(related && card.contains(related)) return;
            clearTimeout(hoverTimeout);
            card.style.display='none';
            card.classList.remove('show');
            lastHoverPos=null;
            currentHoverItemId=null;
        }, true);
    }

    /* -------------------- SPA URL 監控 -------------------- */
    function setupGlobalUrlWatcher(){
        const card = createCard();
        function handleUrlChange(){
            const itemPageMatch = location.pathname.match(/\/marketplace\/item\/(\d+)/);
            if(itemPageMatch){
                if(card.style.display === 'block') return;
                // 單頁模式，右側固定卡片，停用 hover
                clearTimeout(hoverTimeout);
                hoverEnabled = false;
                FBMarketplaceFetcher.showByItemId(itemPageMatch[1]);
                resetCardToRight();
            } else if(location.pathname.startsWith('/marketplace')){
                hoverEnabled = true;
            } else {
                card.style.display='none'; card.classList.remove('show'); lastHoverPos=null; currentHoverItemId=null;
                hoverEnabled = false;
            }
        }
        // 攔截 SPA 方法
        const pushStateOrig = history.pushState;
        history.pushState = function(){ const ret=pushStateOrig.apply(this,arguments); setTimeout(handleUrlChange,50); return ret; };
        const replaceStateOrig = history.replaceState;
        history.replaceState = function(){ const ret=replaceStateOrig.apply(this,arguments); setTimeout(handleUrlChange,50); return ret; };
        window.addEventListener('popstate', ()=>setTimeout(handleUrlChange,50));
        const mo = new MutationObserver(debounce(handleUrlChange,100));
        mo.observe(document.body,{childList:true,subtree:true});
        handleUrlChange();
    }

    /* -------------------- 固定右側卡片 -------------------- */
    function resetCardToRight(){
        const card = createCard(); card.dataset.mode='fixed';
        if(window.innerWidth<500){ card.style.left='50%'; card.style.right='auto'; card.style.transform='translateX(-50%)'; }
        else { card.style.left='auto'; card.style.right='20px'; card.style.transform='none'; }
        if(!card.dataset.top){ const t=Math.max(window.innerHeight*0.08,60); card.style.top=t+'px'; card.dataset.top=t; }
        else card.style.top=card.dataset.top+'px';
        card.style.display='block'; card.classList.add('show'); adjustCardWithinScreen(card);
    }

    /* -------------------- 工具函式 -------------------- */
    function debounce(fn,delay){ let t=null; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),delay); }; }

    /* -------------------- 啟動 -------------------- */
    createCard();
    setupHoverDelegate();
    setupGlobalUrlWatcher();

})();
