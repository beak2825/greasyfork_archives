// ==UserScript==
// @name         Rem4rk's Torn Auction House Filters
// @namespace    https://www.torn.com/
// @version      1.1
// @description  A script that filters Auction House Items for you based on user-defined filters, includes a min/max price slider, a days remaining slider, buttons to hide items that the user has already bid on, or items they have been outbid on. Any auction listings that end within 1 hour will be highlighted with a gold outline to make auction sniping easier. The script also shows how many items are visible/hidden on the page, e.g. Visible: 10/12.
// @author       rem4rk [2375926] - https://www.torn.com/profiles.php?XID=2375926
// @match        https://www.torn.com/amarket.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561198/Rem4rk%27s%20Torn%20Auction%20House%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/561198/Rem4rk%27s%20Torn%20Auction%20House%20Filters.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const PRICE_STEPS = [
        0, 10_000, 20_000, 30_000, 40_000, 50_000,
        100_000, 200_000, 300_000, 400_000, 500_000,
        1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000,
        10_000_000, 15_000_000, 20_000_000, 25_000_000, 30_000_000,
        35_000_000, 40_000_000, 45_000_000, 50_000_000,
        100_000_000, 200_000_000, 300_000_000, 400_000_000, 500_000_000,
        1_000_000_000, 2_000_000_000, 3_000_000_000, 4_000_000_000,
        5_000_000_000, 10_000_000_000
    ];
    const DAY_STEPS = [1,2,3,4,5,6,7];
    const SNIPE_SECONDS = 3600;
    const LS_KEY = 'tornAuctionFilters';

    const state = Object.assign({
        minIdx: 0,
        maxIdx: PRICE_STEPS.length - 1,
        daysIdx: DAY_STEPS.length - 1,
        hideBid: false,
        hideOutbid: false
    }, JSON.parse(localStorage.getItem(LS_KEY) || '{}'));
    const save = () => localStorage.setItem(LS_KEY, JSON.stringify(state));

    const css = document.createElement('style');
    css.textContent = `
        .taf-box { position: fixed; bottom: 18px; left: 18px; width: 360px;
            background: linear-gradient(180deg,#24262e,#1b1d23);
            color: #f1f2f6; border-radius: 16px; padding: 22px; font-family: system-ui,sans-serif;
            box-shadow: 0 20px 45px rgba(0,0,0,.7); z-index: 9999; }
        .taf-title { text-align: center; font-size: 18px; font-weight: 800; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,.12); }
        .taf-section { margin-bottom: 24px; }
        .taf-label { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #cfd2dc; }
        .taf-value { font-weight: 600; color: #fff; }
        .taf-slider { position: relative; height: 36px; padding: 0 10px; }
        .taf-track { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 6px; background: #3a3d48; border-radius: 6px; }
        .taf-range { position: absolute; top: 50%; transform: translateY(-50%); height: 6px; background: linear-gradient(90deg,#5ddcff,#7afcff); border-radius: 6px; pointer-events:none; }
        .taf-slider input { position: absolute; width: 100%; height: 36px; background: none; appearance: none; pointer-events: none; }
        .taf-slider input::-webkit-slider-thumb { appearance: none; pointer-events: all; width: 18px; height: 18px; border-radius: 50%; background: #5ddcff; cursor: pointer; box-shadow: 0 0 0 4px rgba(93,220,255,.25); }
        .taf-btn { width: 100%; padding: 12px; font-weight: 600; background: #2c2f39; border-radius: 10px; border: none; color: #fff; cursor: pointer; margin-top: 10px; }
        .taf-btn.green.active { box-shadow: 0 0 12px rgba(0,255,0,.8); }
        .taf-btn.red.active { box-shadow: 0 0 12px rgba(255,0,0,.8); }
        .taf-stats { margin-top: 14px; padding-top: 12px; font-size: 12px; color: #cfd2dc; border-top: 1px solid rgba(255,255,255,.12); }
        li.taf-snipe { outline: 2px solid gold; outline-offset: -2px; animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 rgba(255,215,0,.2); } 50% { box-shadow: 0 0 18px rgba(255,215,0,.7); } 100% { box-shadow: 0 0 0 rgba(255,215,0,.2); } }
    `;
    document.head.appendChild(css);

    const box = document.createElement('div');
    box.className = 'taf-box';
    box.innerHTML = `
        <div class="taf-title">Auction Filters</div>
        <div class="taf-section">
            <div class="taf-label"><span>Price Range</span><span class="taf-value" id="priceText"></span></div>
            <div class="taf-slider">
                <div class="taf-track"></div>
                <div class="taf-range" id="priceFill"></div>
                <input type="range" id="minRange" min="0" max="${PRICE_STEPS.length-1}">
                <input type="range" id="maxRange" min="0" max="${PRICE_STEPS.length-1}">
            </div>
        </div>
        <div class="taf-section">
            <div class="taf-label"><span>Ends Within</span><span class="taf-value" id="timeText"></span></div>
            <div class="taf-slider">
                <div class="taf-track"></div>
                <div class="taf-range" id="timeFill"></div>
                <input type="range" id="timeRange" min="0" max="${DAY_STEPS.length-1}">
            </div>
        </div>
        <button id="bidBtn" class="taf-btn green">Hide Already Bid</button>
        <button id="outbidBtn" class="taf-btn red">Hide Outbid</button>
        <div class="taf-stats" id="stats"></div>
    `;
    document.body.appendChild(box);

    const container = document.querySelector('.auction-market-main-cont');
    const minR = box.querySelector('#minRange');
    const maxR = box.querySelector('#maxRange');
    const timeR = box.querySelector('#timeRange');
    const priceFill = box.querySelector('#priceFill');
    const timeFill = box.querySelector('#timeFill');
    const priceText = box.querySelector('#priceText');
    const timeText = box.querySelector('#timeText');
    const stats = box.querySelector('#stats');
    const bidBtn = box.querySelector('#bidBtn');
    const outbidBtn = box.querySelector('#outbidBtn');

    function updateUI(){
        const minVal = PRICE_STEPS[state.minIdx];
        const maxVal = PRICE_STEPS[state.maxIdx];
        const maxText = (state.maxIdx===PRICE_STEPS.length-1) ? "10B+" : maxVal.toLocaleString();
        priceText.textContent = `$${minVal.toLocaleString()} – $${maxText}`;
        timeText.textContent = `${DAY_STEPS[state.daysIdx]} day(s)`;

        const track = minR.parentElement.querySelector('.taf-track');
        const trackRect = track.getBoundingClientRect();
        const trackWidth = trackRect.width;
        const thumbWidth = 18;

        const minCenter = (state.minIdx/(PRICE_STEPS.length-1)) * trackWidth;
        const maxCenter = (state.maxIdx/(PRICE_STEPS.length-1)) * trackWidth;
        priceFill.style.left = `${Math.min(minCenter,maxCenter)}px`;
        priceFill.style.width = `${Math.max(Math.abs(maxCenter-minCenter), 2)}px`;

        const timeCenter = (state.daysIdx/(DAY_STEPS.length-1)) * trackWidth;
        timeFill.style.left = `0px`;
        timeFill.style.width = `${timeCenter}px`;

        minR.value = state.minIdx;
        maxR.value = state.maxIdx;
        timeR.value = state.daysIdx;

        bidBtn.classList.toggle('active', state.hideBid);
        outbidBtn.classList.toggle('active', state.hideOutbid);
    }

    function applyFilters(){
        let total=0, visible=0;
        const min = PRICE_STEPS[state.minIdx];
        const max = PRICE_STEPS[state.maxIdx];
        const maxTime = DAY_STEPS[state.daysIdx]*86400;

        container.querySelectorAll('li[id]').forEach(li=>{
            total++;
            let hide=false;
            const price = +(li.querySelector('.c-bid-wrap')?.textContent.replace(/[^0-9]/g,'')||0);
            const time = +(li.querySelector('.time[timer]')?.getAttribute('timer')||0);
            const bid = li.classList.contains('bg-green');
            const out = li.classList.contains('bg-red');

            const priceOk = bid || (price>=min && (state.maxIdx===PRICE_STEPS.length-1 || price<=max));
            if(!priceOk) hide=true;
            if(time>maxTime) hide=true;
            if(state.hideBid && bid) hide=true;
            if(state.hideOutbid && out) hide=true;

            li.classList.toggle('taf-snipe', !hide && time<=SNIPE_SECONDS);
            li.style.display = hide ? 'none' : '';
            if(!hide) visible++;
        });
        stats.textContent=`Visible: ${visible}/${total}`;
    }

    function handleSlider(slider,type){
        slider.addEventListener('input',()=>{
            const val = +slider.value;
            if(type==='min'){ state.minIdx = Math.min(val,state.maxIdx); }
            else{ state.maxIdx = Math.max(val,state.minIdx); }
            save(); updateUI(); applyFilters();
        });
    }

    handleSlider(minR,'min');
    handleSlider(maxR,'max');

    timeR.addEventListener('input',()=>{
        state.daysIdx = +timeR.value; save(); updateUI(); applyFilters();
    });

    bidBtn.onclick=()=>{ state.hideBid=!state.hideBid; save(); updateUI(); applyFilters(); };
    outbidBtn.onclick=()=>{ state.hideOutbid=!state.hideOutbid; save(); updateUI(); applyFilters(); };

    // Hide items for 4 seconds initially
    container.querySelectorAll('li[id]').forEach(li=> li.style.display='none');
    setTimeout(()=>{
        updateUI();
        applyFilters();
        setInterval(applyFilters,1000);
    },4000);

})();
