// ==UserScript==
// @name         IM Filler
// @namespace    http://tampermonkey.net/
// @version      1.5
// @author       WTV1
// @description  Item Market Filler with Calculation
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      weav3r.dev
// @connect      script.google.com
// @downloadURL https://update.greasyfork.org/scripts/564303/IM%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/564303/IM%20Filler.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const isPDA = window.innerWidth <= 700;
    let settings = {};
    let trendData = null;

    function loadSettings() {
        settings = {
            apiKey: GM_getValue("tornApiKey", ""),
            undercutVal: parseFloat(GM_getValue("undercutVal", 1)) || 0,
            undercutType: GM_getValue("undercutType", "fixed"),
            undercutPos: parseInt(GM_getValue("undercutPos", 1)) || 1,
            priceSource: GM_getValue("priceSource", "im"),
            skippedItems: JSON.parse(GM_getValue("skippedItems", "{}"))
        };
    }
    loadSettings();

    function fetchTrendColors() {
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxtyZmClPhnEbdX8vl00kwWAXheSSgLv620CVZOFOgJjoCT0_JhXcu4A2wtJ0u9mm1a/exec";
        GM_xmlhttpRequest({
            method: "GET",
            url: WEB_APP_URL,
            onload: (res) => { try { trendData = JSON.parse(res.responseText); } catch(e){} }
        });
    }
    fetchTrendColors();

    const styleBlock = `
        .header-links-container { display: inline-flex; gap: 8px; margin-left: 12px; vertical-align: middle; align-items: center; }
        .fill-btn-link, .filler-nav-link { cursor: pointer; font-size: 11px; font-weight: bold; text-transform: uppercase; text-decoration: none; }
        .qty-link { color: #00aaff; }
        .all-link { color: #7cfc00; }
        .filler-nav-link { color: #ccc; }
        .filler-relative { position: relative !important; }
        .pda-skip-container { position: absolute !important; left: 5px !important; top: 50% !important; transform: translateY(-50%) !important; z-index: 11; }
        .fill-wrapper-left { position: absolute !important; left: 110px !important; top: 50% !important; transform: translateY(-50%) !important; z-index: 10; }
        .add-wrapper { position: absolute !important; right: 5px !important; top: 50% !important; transform: translateY(-50%) !important; z-index: 10; }
        .row-fill-btn { padding: 0 8px; height: 22px; cursor: pointer; border: 1px solid #444; border-radius: 3px; background: #222; display: flex; align-items: center; color: #7cfc00; font-size: 10px; font-weight: bold; }
        .item-toggle-btn { width: 24px; height: 24px; cursor: pointer; border: 1px solid #444; border-radius: 3px; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; color: #ffde00; font-size: 14px; font-weight: bold; }
        .filler-skip-checkbox { cursor: pointer; width: 18px; height: 18px; accent-color: #ff3b3b; margin: 0; }
        #filler-config-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px; z-index: 2147483647; display: none; width: 300px; border: 1px solid #333; box-shadow: 0 0 30px #000; }
        .cfg-field { margin-bottom: 12px; }
        .cfg-field label { display: block; font-size: 10px; font-weight: bold; color: #aaa; text-transform: uppercase; margin-bottom: 4px; }
        .cfg-field input, .cfg-field select { background: #fff; color: #000; border: none; padding: 10px; border-radius: 2px; width: 100%; box-sizing: border-box; font-size: 14px; }
        .btn-save { width: 48%; background: #7cfc00; color: #000; border: none; padding: 12px; cursor: pointer; font-weight: bold; border-radius: 4px; }
        .btn-close { width: 48%; background: #333; color: #fff; border: none; padding: 12px; cursor: pointer; border-radius: 4px; margin-left: 4%; }
        .draggable-popup { position: fixed !important; z-index: 999999998; background: #1a1a1a; color: #fff; border: 1px solid #444; border-radius: 5px; width: 230px; display: none; box-shadow: 0 8px 30px rgba(0,0,0,0.9); overflow: hidden; font-family: Arial, sans-serif; touch-action: none; }
        .popup-header { background: #222; padding: 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; font-weight: bold; color: #ffde00; font-size: 12px; user-select: none; }
        .mv-banner { background: #111; padding: 6px; text-align: center; font-weight: bold; border-bottom: 1px solid #333; font-size: 11px; color: #fff; display: flex !important; align-items: center; justify-content: center; min-height: 25px; }
        .market-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .market-table th { background: #222; font-size: 10px; color: #888; text-transform: uppercase; padding: 6px; border-bottom: 1px solid #333; }
        .market-table td { padding: 12px 2px; text-align: center; border-bottom: 1px solid #222; cursor: pointer; font-size: 11px; font-weight: bold; color: #7cfc00; border-right: 1px solid #222; overflow: hidden; white-space: nowrap; }
        .qty-label { color: #aaa; font-size: 9px; font-weight: normal; margin-right: 4px; }
    `;
    $("<style>").html(styleBlock).appendTo("head");

    function updateTornInput($input, value) {
        if ($input.length) {
            const el = $input[0];
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            setter.call(el, Math.max(0, Math.floor(value)));
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function getQty($row) {
        const txt = $row.text();
        const match = txt.match(/x\s?(\d+)/i);
        return match ? match[1] : "1";
    }

    function makeDraggable(el) {
        let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
        const header = el.querySelector(".popup-header");
        const dragStart = (e) => {
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            p3 = touch.clientX; p4 = touch.clientY;
            if (e.type === 'mousedown') { document.onmousemove = dragging; document.onmouseup = dragEnd; } 
            else { document.ontouchmove = dragging; document.ontouchend = dragEnd; }
        };
        const dragging = (e) => {
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            p1 = p3 - touch.clientX; p2 = p4 - touch.clientY;
            p3 = touch.clientX; p4 = touch.clientY;
            el.style.top = (el.offsetTop - p2) + "px"; el.style.left = (el.offsetLeft - p1) + "px";
        };
        const dragEnd = () => { document.onmousemove = null; document.onmouseup = null; document.ontouchmove = null; document.ontouchend = null; };
        header.addEventListener('mousedown', dragStart); header.addEventListener('touchstart', dragStart);
    }

    function showDualTable(e, $row, itemId, rawItemName) {
        e.stopPropagation();
        let $popup = $('.draggable-popup');
        if (!$popup.length) {
            $popup = $(`<div class="draggable-popup"><div class="popup-header"><span class="item-label"></span><span class="close-x" style="cursor:pointer; padding: 5px;">&times;</span></div><div class="mv-banner">Loading...</div><div class="popup-body"></div></div>`).appendTo('body');
            makeDraggable($popup[0]);
            $popup.find('.close-x').on('touchstart click', (ev) => { ev.preventDefault(); $popup.hide(); });
        }
        let cleanName = rawItemName.split('$')[0].split('RRP')[0].trim();
        const rect = e.currentTarget.getBoundingClientRect();
        let topPos = rect.top - 50; let leftPos = rect.left - 240;
        if (leftPos < 10) leftPos = 10; if (topPos < 10) topPos = 10;
        $popup.show().css({ position: 'fixed', top: topPos + 'px', left: leftPos + 'px' });
        $popup.find('.item-label').text(cleanName.substring(0, 25)).attr('data-id', itemId);
        $popup.find('.popup-body').html(`<table class="market-table"><tr><th>Market</th><th>Bazaar</th></tr>` + Array(5).fill('<tr><td class="im-row">--</td><td class="bz-row">--</td></tr>').join('') + `</table>`);
        const applyPrice = (p) => { let final = settings.undercutType === "percent" ? p * (1 - (settings.undercutVal/100)) : p - settings.undercutVal; updateTornInput($row.find('input[placeholder="Price"]'), final); updateTornInput($row.find('input[placeholder="Qty"]'), getQty($row)); $popup.hide(); };
        GM_xmlhttpRequest({ method: "GET", url: `https://api.torn.com/v2/torn/${itemId}/items?key=${settings.apiKey}`, onload: r => { const mv = JSON.parse(r.responseText).items?.[0]?.value?.market_price || 0; $popup.find(".mv-banner").text(`MV: $${mv.toLocaleString()}`); }});
        GM_xmlhttpRequest({ method: "GET", url: `https://api.torn.com/v2/market/${itemId}/itemmarket?key=${settings.apiKey}`, onload: r => { const list = JSON.parse(r.responseText).itemmarket?.listings || []; list.slice(0, 5).forEach((item, i) => { $popup.find(`.im-row`).eq(i).html(`<span class="qty-label">${item.amount.toLocaleString()} x</span>$${item.price.toLocaleString()}`).off().on('touchstart click', (ev) => { ev.preventDefault(); applyPrice(item.price); }); }); }});
        GM_xmlhttpRequest({ method: "GET", url: `https://weav3r.dev/api/marketplace/${itemId}`, onload: r => { const list = JSON.parse(r.responseText).listings || []; list.slice(0, 5).forEach((item, i) => { $popup.find(`.bz-row`).eq(i).html(`<span class="qty-label">${item.quantity.toLocaleString()} x</span>$${item.price.toLocaleString()}`).off().on('touchstart click', (ev) => { ev.preventDefault(); applyPrice(item.price); }); }); }});
    }

    function handleFillPrice($row, itemId) {
        let url = settings.priceSource === "mv" ? `https://api.torn.com/v2/torn/${itemId}/items?key=${settings.apiKey}` :
                  settings.priceSource === "im" ? `https://api.torn.com/v2/market/${itemId}/itemmarket?key=${settings.apiKey}` : 
                  `https://weav3r.dev/api/marketplace/${itemId}`;
        GM_xmlhttpRequest({
            method: "GET", url: url,
            onload: r => {
                const data = JSON.parse(r.responseText);
                let target = 0;
                if (settings.priceSource === "mv") target = data.items?.[0]?.value?.market_price || 0;
                else { const list = (settings.priceSource === "im" ? data.itemmarket?.listings : data.listings) || []; target = list[Math.min(settings.undercutPos - 1, list.length - 1)]?.price; }
                if (target) { let final = settings.undercutType === "percent" ? target * (1 - (settings.undercutVal/100)) : target - settings.undercutVal; updateTornInput($row.find('input[placeholder="Price"]'), final); updateTornInput($row.find('input[placeholder="Qty"]'), getQty($row)); }
            }
        });
    }

    // SPARKLINE OBSERVER
    (function() {
        const trendObserver = new MutationObserver(() => {
            const $p = $('.draggable-popup');
            const $mvLine = $p.find('.mv-banner');
            const itemId = $p.find('.item-label').attr('data-id');
            if ($p.is(':visible') && $mvLine.length > 0 && $mvLine.find('.pro-trend').length === 0 && trendData && itemId) {
                if (trendData[itemId]) {
                    const h = trendData[itemId].history, latest = h[h.length - 1], prev = h[h.length - 2] || latest, hi = Math.max(...h), lo = Math.min(...h);
                    const change = (((latest - prev) / prev) * 100).toFixed(2), col = change > 0 ? "#7cfc00" : (change < 0 ? "#ff3b3b" : "#aaa");
                    let stat = latest >= hi ? "🔥" : (latest <= lo ? "🧊" : "");
                    const pts = h.map((p, i) => `${(i / (h.length - 1 || 1)) * 40},${10 - ((p - lo) / (hi - lo || 1)) * 10}`).join(' ');
                    $mvLine.append(`<span class="pro-trend" style="margin-left:10px; display:inline-flex; align-items:center; border-left: 1px solid #444; padding-left: 10px;"><span style="color:${col}; font-weight:bold; font-size:12px; margin-right:5px;">${stat} ${change}%</span><svg width="40" height="12"><polyline fill="none" stroke="${col}" stroke-width="1.5" points="${pts}"/></svg></span>`);
                }
            }
        });
        trendObserver.observe(document.body, { childList: true, subtree: true });
    })();

    function inject() {
        const isAddPage = window.location.hash.includes("/addListing");
        if (!isAddPage) {
            $(".header-links-container, .row-fill-btn, .item-toggle-btn, .pda-skip-container").remove();
            return;
        }

        const header = $("[class*='itemsHeader___'] [class*='title___']").first();
        if (header.length && !$(".header-links-container").length) {
            header.append(`<span class="header-links-container">
                <a class="fill-btn-link qty-link" id="im-qty">FILL QTY</a>
                <a class="fill-btn-link all-link" id="im-all">FILL ALL</a>
                <a class="filler-nav-link" id="im-cfg">SETTINGS</a>
            </span>`);
            $("#im-cfg").on('click', (e) => { e.preventDefault(); $("#filler-config-modal").show(); });
            $("#im-all, #im-qty").on('click', function(e) {
                e.preventDefault();
                const action = $(this).attr('id');
                $("[class*='itemRow___']").each(function() {
                    const $r = $(this);
                    if (!$r.find('.filler-skip-checkbox').is(':checked')) {
                        const id = $r.find('img').attr('src')?.match(/\/(\d+)\//)?.[1];
                        if (action === 'im-all' && id) handleFillPrice($r, id);
                        else updateTornInput($r.find('input[placeholder="Qty"]'), getQty($r));
                    }
                });
            });
        }

        $("[class*='itemRow___']").each(function() {
            const $row = $(this);
            if ($row.find(".row-fill-btn").length) return;
            const itemId = $row.find('img').attr('src')?.match(/\/(\d+)\//)?.[1];
            if (!itemId) return;

            if (isPDA) {
                $row.addClass("filler-relative");
                $(`<div class="pda-skip-container"><input type="checkbox" class="filler-skip-checkbox" data-id="${itemId}" ${settings.skippedItems[itemId] ? "checked" : ""}></div>`).appendTo($row);
                $('<div class="fill-wrapper-left"><div class="row-fill-btn">FILL</div></div>').appendTo($row).on('click touchstart', (e) => { e.preventDefault(); e.stopPropagation(); handleFillPrice($row, itemId); });
                $('<div class="add-wrapper"><div class="item-toggle-btn">$</div></div>').appendTo($row).on('click touchstart', (e) => { e.preventDefault(); e.stopPropagation(); showDualTable(e, $row, itemId, $row.text().trim()); });
            } else {
                const $title = $row.find("[class*='title___']");
                const $cont = $(`<div style="display:flex; gap:8px; align-items:center; margin-left:auto;">
                    <input type="checkbox" class="filler-skip-checkbox" data-id="${itemId}" ${settings.skippedItems[itemId] ? "checked" : ""}>
                    <div class="row-fill-btn">FILL</div>
                    <div class="item-toggle-btn">$</div>
                </div>`).appendTo($title);
                $cont.find(".row-fill-btn").on('click', (e) => { e.stopPropagation(); handleFillPrice($row, itemId); });
                $cont.find(".item-toggle-btn").on('click', (e) => { e.stopPropagation(); showDualTable(e, $row, itemId, $row.text().trim()); });
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
                <select id="cfg-source">
                    <option value="bz" ${settings.priceSource === 'bz' ? 'selected' : ''}>Bazaar</option>
                    <option value="im" ${settings.priceSource === 'im' ? 'selected' : ''}>Item Market</option>
                    <option value="mv" ${settings.priceSource === 'mv' ? 'selected' : ''}>Market Value (MV)</option>
                </select>
            </div>
            <div style="margin-top:20px;"><button class="btn-save" id="cfg-save">SAVE</button><button class="btn-close" id="cfg-close">CLOSE</button></div>
        </div>`).appendTo("body");
        $("#cfg-save").on('click', () => { GM_setValue("tornApiKey", $("#cfg-api").val()); GM_setValue("undercutVal", $("#cfg-val").val()); GM_setValue("undercutType", $("#cfg-type").val()); GM_setValue("undercutPos", $("#cfg-pos").val()); GM_setValue("priceSource", $("#cfg-source").val()); loadSettings(); $("#filler-config-modal").hide(); });
        $("#cfg-close").on('click', () => { $("#filler-config-modal").hide(); });
    }

    $(document).on('change', '.filler-skip-checkbox', function() {
        settings.skippedItems[$(this).data('id')] = $(this).is(':checked');
        GM_setValue("skippedItems", JSON.stringify(settings.skippedItems));
    });

    const observer = new MutationObserver(inject);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', inject);
    inject();
})();
