// ==UserScript==
// @name          Bazaar Filler
// @namespace     http://tampermonkey.net/
// @version       3.6.2
// @author        WTV1
// @description   Advanced Bazaar Filler with Market and Bazaar Price Points + Fill All + Trade Fill
// @match         https://www.torn.com/bazaar.php*
// @match         https://www.torn.com/trade.php*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @connect       api.torn.com
// @connect       weav3r.dev
// @downloadURL https://update.greasyfork.org/scripts/559516/Bazaar%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/559516/Bazaar%20Filler.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const isPDA = window.innerWidth <= 700;
    let settings = {};

    function loadSettings() {
        settings = {
            apiKey: GM_getValue("tornApiKey", ""),
            undercutVal: parseFloat(GM_getValue("undercutVal", 1)),
            undercutType: GM_getValue("undercutType", "fixed"),
            undercutPos: parseInt(GM_getValue("undercutPos", 1)),
            priceSource: GM_getValue("priceSource", "bz")
        };
    }
    loadSettings();

    const styleBlock = `
        .filler-header-links { float: right; margin-right: 10px; height: 34px; display: flex; align-items: center; }
        .fill-all-btn { cursor: pointer; margin-left: 15px; font-size: 12px; color: #7cfc00; text-transform: uppercase; font-weight: bold; }
        .fill-qty-btn { cursor: pointer; margin-left: 15px; font-size: 12px; color: #00aaff; text-transform: uppercase; font-weight: bold; }
        .filler-nav-link { cursor: pointer; margin-left: 15px; font-size: 12px; color: #ccc; text-transform: uppercase; font-weight: bold; }

        @media screen and (max-width: 600px) {
            .title-black { height: auto !important; min-height: 34px; padding-bottom: 5px !important; }
            .filler-header-links { float: none !important; width: 100%; justify-content: space-around; margin-top: 5px; border-top: 1px solid #333; padding-top: 5px; }
            .fill-all-btn, .fill-qty-btn, .filler-nav-link { margin-left: 0 !important; }
        }

        .filler-relative { position: relative !important; }
        .fill-wrapper-left { position: absolute !important; right: 175px !important; top: 50% !important; transform: translateY(-50%) !important; z-index: 10; }
        .add-wrapper { position: absolute !important; right: 8px !important; top: 50% !important; transform: translateY(-50%) !important; z-index: 10; }
        .pc-filler-container { display: inline-flex; gap: 4px; align-items: center; margin-left: auto; padding-right: 5px; }

        .row-fill-btn { padding: 0 8px; height: 24px; cursor: pointer; border: 1px solid #444; border-radius: 3px; background: #222; display: flex; align-items: center; justify-content: center; color: #7cfc00; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .item-toggle-btn { width: 24px; height: 24px; cursor: pointer; border: 1px solid #444; border-radius: 3px; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; color: #ffde00; font-size: 14px; font-weight: bold; }

        .draggable-popup { position: fixed !important; z-index: 999999998; background: #1a1a1a; color: #fff; border: 1px solid #444; border-radius: 5px; width: 220px; display: none; box-shadow: 0 8px 30px rgba(0,0,0,0.9); overflow: hidden; font-family: Arial, sans-serif; touch-action: none; }
        .popup-header { background: #222; padding: 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; font-weight: bold; color: #ffde00; font-size: 12px; user-select: none; }
        .mv-banner { background: #111; padding: 6px; text-align: center; font-weight: bold; border-bottom: 1px solid #333; font-size: 11px; color: #fff; }
        .market-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .market-table th { background: #222; font-size: 10px; color: #888; text-transform: uppercase; padding: 6px; border-bottom: 1px solid #333; }
        .market-table td { padding: 12px 2px; text-align: center; border-bottom: 1px solid #222; cursor: pointer; font-size: 11px; font-weight: bold; color: #7cfc00; border-right: 1px solid #222; overflow: hidden; white-space: nowrap; }
        .qty-label { color: #aaa; font-size: 9px; font-weight: normal; margin-right: 4px; }
        .fill-max-btn { width: 100%; background: #222; color: #7cfc00; border: none; border-top: 1px solid #444; padding: 14px; cursor: pointer; font-weight: bold; font-size: 12px; text-transform: uppercase; }

        .filler-force-hide { display: none !important; }
        #filler-config-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px; z-index: 2147483647; display: none; width: 280px; border: 1px solid #333; box-shadow: 0 0 30px #000; }
        .cfg-field { margin-bottom: 12px; }
        .cfg-field label { display: block; font-size: 10px; font-weight: bold; color: #aaa; text-transform: uppercase; margin-bottom: 4px; }
        .cfg-field input, .cfg-field select { background: #fff; color: #000; border: none; padding: 10px; border-radius: 2px; width: 100%; box-sizing: border-box; font-size: 14px; }
        .btn-save { width: 48%; background: #7cfc00; color: #000; border: none; padding: 12px; cursor: pointer; font-weight: bold; border-radius: 4px; }
        .btn-close { width: 48%; background: #333; color: #fff; border: none; padding: 12px; cursor: pointer; border-radius: 4px; margin-left: 4%; }
    `;
    $("<style>").html(styleBlock).appendTo("head");

    $(document).on('touchstart mousedown', function (e) {
        if ($("#filler-config-modal").is(":visible") && !$(e.target).closest("#filler-config-modal, #f-cfg").length) $("#filler-config-modal").hide();
        if ($(".draggable-popup").is(":visible") && !$(e.target).closest(".draggable-popup, .item-toggle-btn").length) $(".draggable-popup").hide();
    });

    function updateTornInput($input, value) {
        if ($input.length) {
            const el = $input[0];
            const val = Math.max(0, Math.floor(value));
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            setter.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            $(el).blur();
        }
    }

    function handleFillSingleRow($row, itemId, $btn) {
        if (!settings.apiKey) return alert("Set API Key.");
        if ($btn) $btn.text('...');
        let url = settings.priceSource === "mv" ? `https://api.torn.com/v2/torn/${itemId}/items?key=${settings.apiKey}` :
                  settings.priceSource === "im" ? `https://api.torn.com/v2/market/${itemId}/itemmarket?key=${settings.apiKey}` :
                  `https://weav3r.dev/api/marketplace/${itemId}`;
        GM_xmlhttpRequest({
            method: "GET", url: url,
            onload: r => {
                try {
                    const data = JSON.parse(r.responseText);
                    let targetPrice = 0;
                    if (settings.priceSource === "mv") targetPrice = data.items?.[0]?.value?.market_price || 0;
                    else {
                        const list = (settings.priceSource === "im" ? data.itemmarket?.listings : data.listings) || [];
                        targetPrice = list[Math.min(settings.undercutPos - 1, list.length - 1)]?.price;
                    }
                    if (targetPrice) {
                        let final = settings.undercutType === "percent" ? targetPrice * (1 - (settings.undercutVal/100)) : targetPrice - settings.undercutVal;
                        updateTornInput($row.find('input[placeholder*="Price"], .input-money, [aria-label="Price"]'), final);
                        updateTornInput($row.find('input[placeholder*="Amount"], input[name="amount"], [aria-label="Amount"]'), $row.find('[class*="amount"], .amount, .count').first().text().replace(/[^0-9]/g, ''));
                    }
                } catch(e) {}
                if ($btn) $btn.text('FILL');
            }
        });
    }

    function makeDraggable(el) {
        let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
        const header = el.querySelector('.popup-header') || el;
        const dragStart = (e) => {
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            p3 = touch.clientX; p4 = touch.clientY;
            if (e.type === 'mousedown') {
                document.addEventListener('mousemove', dragging); document.addEventListener('mouseup', dragEnd);
            } else {
                document.addEventListener('touchmove', dragging, { passive: false }); document.addEventListener('touchend', dragEnd);
            }
        };
        const dragging = (e) => {
            if (e.type === 'touchmove') e.preventDefault();
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            p1 = p3 - touch.clientX; p2 = p4 - touch.clientY;
            p3 = touch.clientX; p4 = touch.clientY;
            el.style.top = (el.offsetTop - p2) + "px"; el.style.left = (el.offsetLeft - p1) + "px";
        };
        const dragEnd = () => {
            document.removeEventListener('mousemove', dragging); document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', dragging); document.removeEventListener('touchend', dragEnd);
        };
        header.addEventListener('mousedown', dragStart); header.addEventListener('touchstart', dragStart);
    }

    function showDualTable(e, $row, itemId, itemName) {
        let $popup = $('.draggable-popup');
        if (!$popup.length) {
            $popup = $(`<div class="draggable-popup"><div class="popup-header"><span class="item-label"></span><span class="close-x" style="cursor:pointer; padding: 5px;">&times;</span></div><div class="mv-banner">Loading...</div><div class="popup-body"></div><button class="fill-max-btn">Fill Max Quantity</button></div>`).appendTo('body');
            $popup.find('.close-x').on('touchstart click', (ev) => { ev.preventDefault(); $popup.hide(); });
            makeDraggable($popup[0]);
        }
        const rect = e.currentTarget.getBoundingClientRect();
        $popup.show().css({ top: Math.max(10, rect.top - 100), left: Math.max(10, rect.left - 230) });
        $popup.find('.item-label').text(itemName.substring(0, 22));
        $popup.find('.popup-body').html(`<table class="market-table"><tr><th>Market</th><th>Bazaar</th></tr>` + Array(5).fill('<tr><td class="im-row">--</td><td class="bz-row">--</td></tr>').join('') + `</table>`);

        $popup.find('.fill-max-btn').off().on('touchstart click', function(ev) {
            ev.preventDefault();
            const maxVal = $row.find('[class*="amount"], .amount, .count').first().text().replace(/[^0-9]/g, '');
            updateTornInput($row.find('input[placeholder*="Amount"], input[name="amount"], [aria-label="Amount"]'), maxVal);
            $popup.hide();
        });

        const handlePriceClick = (price) => {
            let final = settings.undercutType === "percent" ? price * (1 - (settings.undercutVal/100)) : price - settings.undercutVal;
            updateTornInput($row.find('input[placeholder*="Price"], .input-money, [aria-label="Price"]'), final);
            updateTornInput($row.find('input[placeholder*="Amount"], input[name="amount"], [aria-label="Amount"]'), $row.find('[class*="amount"], .amount, .count').first().text().replace(/[^0-9]/g, ''));
            $popup.hide();
        };

        GM_xmlhttpRequest({ method: "GET", url: `https://api.torn.com/v2/torn/${itemId}/items?key=${settings.apiKey}`, onload: r => { const mv = JSON.parse(r.responseText).items?.[0]?.value?.market_price || 0; $popup.find(".mv-banner").text(`MV: $${mv.toLocaleString()}`); }});
        GM_xmlhttpRequest({ method: "GET", url: `https://api.torn.com/v2/market/${itemId}/itemmarket?key=${settings.apiKey}`, onload: r => { const list = JSON.parse(r.responseText).itemmarket?.listings || []; list.slice(0, 5).forEach((item, i) => { $popup.find(`.im-row`).eq(i).html(`<span class="qty-label">${item.amount.toLocaleString()} x</span>$${item.price.toLocaleString()}`).off().on('touchstart click', (ev) => { ev.preventDefault(); handlePriceClick(item.price); }); }); }});
        GM_xmlhttpRequest({ method: "GET", url: `https://weav3r.dev/api/marketplace/${itemId}`, onload: r => { const list = JSON.parse(r.responseText).listings || []; list.slice(0, 5).forEach((item, i) => { $popup.find(`.bz-row`).eq(i).html(`<span class="qty-label">${item.quantity.toLocaleString()} x</span>$${item.price.toLocaleString()}`).off().on('touchstart click', (ev) => { ev.preventDefault(); handlePriceClick(item.price); }); }); }});
    }

    function inject() {
        const hash = window.location.hash;
        const isManage = hash.includes('#/manage');
        const isAdd = hash.includes('#/add');
        if ($('input.torn-btn[value="CONFIRM"]').length > 0) {
            $(".pc-filler-container, .fill-wrapper-left, .add-wrapper, .filler-header-links").addClass("filler-force-hide"); return;
        } else {
            $(".pc-filler-container, .fill-wrapper-left, .add-wrapper, .filler-header-links").removeClass("filler-force-hide");
        }
        if (isPDA && !isAdd) return;

        const header = isManage ? $(".panelHeader___PHqEv:contains('Manage your Bazaar')") : $(".title-black:contains('Add items to your Bazaar')");
        if (header.length && $(".fill-all-btn").length === 0) {
            header.append(`<div class="filler-header-links"><a class="fill-qty-btn" id="f-qty">Fill Qty</a><a class="fill-all-btn" id="f-all">Fill All</a><a class="filler-nav-link" id="f-cfg">Settings</a></div>`);
            $("#f-cfg").on('touchstart click', (e) => { e.preventDefault(); $("#filler-config-modal").show(); });
            $("#f-all").on('touchstart click', (e) => { e.preventDefault(); $("li:visible, [class*='listItem___'], [class*='row___']").each(function() { const id = $(this).find('img[src*="/items/"]').attr('src')?.match(/\/(\d+)\//)?.[1]; if(id && $(this).find('input').length > 0) handleFillSingleRow($(this), id, null); }); });
            $("#f-qty").on('touchstart click', (e) => { e.preventDefault(); $("li:visible, [class*='listItem___'], [class*='row___']").each(function() { if ($(this).find('input').length > 0) { const max = $(this).find('[class*="amount"], .amount, .count').first().text().replace(/[^0-9]/g, ''); updateTornInput($(this).find('input[placeholder*="Amount"], input[name="amount"], [aria-label="Amount"]'), max); } }); });
        }

        $("li, [class*='listItem___'], [class*='row___']").each(function () {
            const $row = $(this);
            if ($row.find(".row-fill-btn").length > 0) return;
            const itemId = $row.find('img[src*="/items/"]').attr('src')?.match(/\/(\d+)\//)?.[1];
            if (!itemId || $row.find('input').length === 0) return;

            if (isPDA && isAdd) {
                $row.addClass("filler-relative");
                const $fW = $('<div class="fill-wrapper-left"><div class="row-fill-btn">FILL</div></div>').appendTo($row);
                $fW.on('touchstart click', (e) => { e.preventDefault(); handleFillSingleRow($row, itemId, $fW.find('.row-fill-btn')); });
                $('<div class="add-wrapper"><div class="item-toggle-btn">$</div></div>').appendTo($row).on('touchstart click', (e) => { e.preventDefault(); e.stopPropagation(); showDualTable(e, $row, itemId, $row.find('[class*="name"]').first().text().trim()); });
            } else if (!isPDA) {
                let $target = isAdd ? $row.find('.info-wrap') : $row.find('[class*="bonuses___pTH_L"]');
                if ($target.length) {
                    $target.css('display', 'flex');
                    const $cont = $('<div class="pc-filler-container"></div>').appendTo($target);
                    const $f = $('<div class="row-fill-btn">FILL</div>').appendTo($cont).on('click', (e) => { e.stopPropagation(); handleFillSingleRow($row, itemId, $f); });
                    $('<div class="item-toggle-btn">$</div>').appendTo($cont).on('click', (e) => { e.stopPropagation(); showDualTable(e, $row, itemId, $row.find('[class*="name"]').first().text().trim()); });
                }
            }
        });
    }

    if ($("#filler-config-modal").length === 0) {
        $(`<div id="filler-config-modal">
            <span style="color:#ffde00;font-weight:bold;font-size:14px;display:block;margin-bottom:15px;">Settings</span>
            <div class="cfg-field"><label>API Key</label><input type="text" id="cfg-api" value="${settings.apiKey}"></div>
            <div class="cfg-field"><label>Undercut Value</label><input type="number" id="cfg-val" value="${settings.undercutVal}"></div>
            <div class="cfg-field"><label>Undercut Type</label><select id="cfg-type"><option value="fixed" ${settings.undercutType === 'fixed' ? 'selected' : ''}>Fixed ($)</option><option value="percent" ${settings.undercutType === 'percent' ? 'selected' : ''}>Percent (%)</option></select></div>
            <div class="cfg-field"><label>Undercut Position (1-5)</label><input type="number" id="cfg-pos" min="1" max="5" value="${settings.undercutPos}"></div>
            <div class="cfg-field"><label>Auto-Fill Source</label>
                <select id="cfg-source"><option value="bz" ${settings.priceSource === 'bz' ? 'selected' : ''}>Bazaar</option><option value="im" ${settings.priceSource === 'im' ? 'selected' : ''}>Item Market</option><option value="mv" ${settings.priceSource === 'mv' ? 'selected' : ''}>Market Value (MV)</option></select>
            </div>
            <div style="margin-top:20px;"><button class="btn-save" id="cfg-save">SAVE</button><button class="btn-close" id="cfg-close">CLOSE</button></div>
        </div>`).appendTo("body");
        $("#cfg-save").on('touchstart click', (e) => { e.preventDefault(); GM_setValue("tornApiKey", $("#cfg-api").val()); GM_setValue("undercutVal", $("#cfg-val").val()); GM_setValue("undercutType", $("#cfg-type").val()); GM_setValue("undercutPos", $("#cfg-pos").val()); GM_setValue("priceSource", $("#cfg-source").val()); loadSettings(); $("#filler-config-modal").hide(); });
        $("#cfg-close").on('touchstart click', (e) => { e.preventDefault(); $("#filler-config-modal").hide(); });
    }

    const obs = new MutationObserver(inject);
    obs.observe(document.body, { childList: true, subtree: true });
    inject();

    // ---------------------------------------------------------
    // TREND / HEAT INDICATOR LOGIC (RESTORED)
    // ---------------------------------------------------------
    (function() {
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxtyZmClPhnEbdX8vl00kwWAXheSSgLv620CVZOFOgJjoCT0_JhXcu4A2wtJ0u9mm1a/exec";
        let trendData = null;
        function fetchTrends() { GM_xmlhttpRequest({ method: "GET", url: WEB_APP_URL, onload: (res) => { trendData = JSON.parse(res.responseText); } }); }
        fetchTrends();
        const trendObserver = new MutationObserver(() => {
            const $popup = $('.draggable-popup');
            const $mvLine = $popup.find('.mv-banner');
            if ($popup.is(':visible') && $mvLine.length > 0 && $mvLine.find('.pro-trend').length === 0 && trendData) {
                const itemName = $popup.find('.item-label').text().trim();
                const $itemRow = $("li, [class*='listItem___']").filter(function() { return $(this).text().includes(itemName); });
                const itemId = $itemRow.find('img[src*="/items/"]').attr('src')?.match(/\/(\d+)\//)?.[1];
                if (itemId && trendData[itemId]) {
                    const h = trendData[itemId].history;
                    const latest = h[h.length - 1];
                    const previous = h[h.length - 2] || latest;
                    const high = Math.max(...h);
                    const low = Math.min(...h);
                    const change = (((latest - previous) / previous) * 100).toFixed(2);
                    const color = change > 0 ? "#7cfc00" : (change < 0 ? "#ff3b3b" : "#aaa");
                    let status = latest >= high ? "🔥" : (latest <= low ? "🧊" : "");
                    const range = high - low || 1;
                    const points = h.map((p, i) => `${(i / (h.length - 1 || 1)) * 40},${10 - ((p - low) / range) * 10}`).join(' ');
                    $mvLine.append(`<span class="pro-trend" style="margin-left:10px; display:inline-flex; align-items:center; border-left: 1px solid #444; padding-left: 10px;" title="7D High: $${high.toLocaleString()} | 7D Low: $${low.toLocaleString()}"><span style="color:${color}; font-weight:bold; font-size:12px; margin-right:5px;">${status} ${change}%</span><svg width="40" height="12" style="background:rgba(255,255,255,0.05); border-radius:2px;"><polyline fill="none" stroke="${color}" stroke-width="1.5" points="${points}"/></svg></span>`);
                }
            }
        });
        trendObserver.observe(document.body, { childList: true, subtree: true });
    })();

    // ---------------------------------------------------------
    // TRADE FILL LOGIC (HEADER SINGLE BUTTON + QTY 1 FIX)
    // ---------------------------------------------------------
    function injectTradeFill() {
        if (!window.location.href.includes('trade.php')) return;
        
        const topFooter = $(".items-footer.clearfix").first(); 
        
        if (topFooter.length && !$("#trade-fill-qty-single").length) {
            const $btn = $('<a id="trade-fill-qty-single" style="cursor: pointer; margin-left: 15px; font-size: 12px; color: #00aaff; text-transform: uppercase; font-weight: bold; line-height: 24px;">Fill Qty</a>');
            topFooter.append($btn);

            $btn.on('click', function(e) {
                e.preventDefault();
                $("li.clearfix.no-mods").each(function() {
                    const $row = $(this);
                    const $nameWrap = $row.find(".name-wrap");
                    const qtyMatch = $nameWrap.text().match(/x(\d+)/);
                    
                    // Default to 1 if no 'x' found (single item rows)
                    const maxQty = qtyMatch ? qtyMatch[1] : "1";
                    
                    const $input = $row.find("input[type='text']");
                    if ($input.length) {
                        updateTornInput($input, maxQty);
                    }
                });
            });
        }
    }

    const tradeObs = new MutationObserver(injectTradeFill);
    tradeObs.observe(document.body, { childList: true, subtree: true });
    injectTradeFill();

})();