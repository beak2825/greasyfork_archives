// ==UserScript==
// @name         Haiyaa Points! - Test
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Streamline your Hyatt points booking experience, Haiyaa!
// @author       World of Haiyaa
// @match        https://www.hyatt.com/explore-hotels/rate-calendar*
// @match        https://www.hyatt.com/*/explore-hotels/rate-calendar*
// @match        https://www.hyatt.com/explore-hotels/map*
// @match        https://www.hyatt.com/*/explore-hotels/map*
// @match        https://www.hyatt.com/search/hotels/*
// @require https://update.greasyfork.org/scripts/515994/1478507/gh_2215_make_GM_xhr_more_parallel_again.js
// @grant        GM_xmlhttpRequest
// @connect      www.hyatt.com
// @downloadURL https://update.greasyfork.org/scripts/551491/Haiyaa%20Points%21%20-%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/551491/Haiyaa%20Points%21%20-%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const priveHotelCodes = new Set(["menph", "suzph", "tusob", "abdcc", "jedph", "istph", "dohph", "selaz", "sanrs", "cgkub", "saogh", "flrub", "apcal", "riogh", "seagh", "selrs", "lisaz", "shagh", "sinrs", "taigh", "tparw", "tyogh", "caict", "paraz", "phlph", "ausra", "bnaub", "bcnub", "msyrf", "balgh", "nasgh", "jcagh", "dohgh", "goagh", "kauai", "musca", "mexhr", "aruba", "chesa", "naprn", "danhr", "guamh", "sanhc", "huahi", "newpo", "hunrh", "champ", "tvllt", "auslp", "oggrm", "ncehr", "phuhr", "scott", "nbsph", "tamay", "thess", "hnlrw", "nycam", "amsaz", "delaz", "longe", "oggaw", "apcrn", "yowaz", "liraz", "sanas", "savrd", "phxaz", "shaaz", "tyoaz", "laxss", "abuph", "sanpa", "bkkph", "beave", "beiph", "bueph", "istct", "mvdhy", "busph", "canbe", "cheph", "chiph", "dxbph", "guaph", "hydph", "mldph", "zuhal", "melph", "milph", "limct", "sclct", "kulph", "nycph", "ninph", "parph", "saiph", "sanph", "selph", "shaph", "repph", "sydph", "tyoph", "romrt", "vieph", "wasph", "madct", "guact", "znzph", "zurph", "goial", "jaial", "cabph", "mxpct", "lgapr", "tyoct", "phlct", "madrp", "aushd", "phxub", "msyum", "skbph", "sinaz", "ammgh", "atlgh", "beigh", "hanph", "cgkph", "bergh", "dxbgh", "bangh", "nycuc", "secim", "dpsbl", "msyub", "colog", "zocur", "zvrim", "cania", "shang", "hkggh", "vcect", "westl", "adbri", "kuagh", "macgh", "melbo", "nayrw", "auhgh", "ptyrp", "satgh", "delrh", "calrc", "chenn", "pierc", "mlact", "dxbhc", "dusse", "hakhr", "kwest", "seplc", "honhr", "drrpc", "kievh", "kyoto", "lonch", "drcfu", "mainz", "bkkhr", "boggh", "cokgh", "coral", "ctgrc", "darhr", "denrd", "guagh", "mucaz", "chiub", "lgatg", "okaro", "satrs", "savrs", "sfors", "vieaz", "madel", "lgajd", "sjcjc", "nycts", "isthr", "szxph", "lgath", "cslth", "bnath", "seath", "zihth", "budub", "chith", "sfojd", "kulal", "mctal", "dpsak", "dpsas", "socal", "dpsau", "dpsav", "hghaw", "sjcal", "itmph", "aklph", "lhrub", "ausob", "egegh", "dxbct", "madrm", "bcnrb", "agart", "sbars", "ctsph", "ctugh", "amdhr", "rdudc", "btvdh", "sepbc", "sofrs", "setpc", "iadth", "pekal", "aqjra", "bnarn", "tyoty", "ruhhr", "secbr", "bosto", "sanen", "szxaz", "xmnaz", "oggal", "biqub", "mcijd", "miact", "dusxd", "addra", "searl", "mrydm", "albob", "rnodh", "dfwth", "satth", "dendv", "sllal", "dpsaz", "austh", "bnerb", "ctuub", "mlarm", "pekub", "pnhrp", "savth", "torph", "zrhrz", "chsdb", "sando", "sanjo", "ibzdh", "laxuf", "usmrk", "dmmgh", "denth", "bnact", "oakub", "laxdi", "canif", "lgatp", "atlct", "melct", "prgaz", "romjd", "arnub", "csxgh", "shegh", "chsdv", "drmpc", "zoehm", "zocdm", "searm", "cunia", "pvrif", "sjdif", "smfct", "jdzub", "dxbcl", "dubct", "ptyub", "jtrub", "sardh", "agpub", "lishr", "mldal", "zoapc", "sepdc", "seccc", "secpm", "sebmi", "drepm", "drbmi", "fswub", "marph", "salct", "xiygh", "utpaz", "jairj", "mexaz", "fukgh", "semrc", "sfous", "bodjd", "edidr", "sford", "iadct", "torjd", "nkgaz", "davub", "pspaz", "pdxct", "seiim", "lhrph", "csxph", "shaal", "fraum", "dohaz", "slcgp", "slcgr", "kmggh", "grggh", "miaob", "johpj", "yulct", "yyzjd", "tivrk", "ausct", "rmugh", "gdlrg", "iahth", "kwigh", "swfuc", "bnadz", "bjxub", "dpaal", "hourw", "sydrs", "slcpc", "bkict", "kmqct", "laxdz", "pmijc", "mangh", "okcub", "tyoub", "lonrb", "bkksb", "huash", "ibzsi", "lgase", "lgash", "lonsl", "melsx", "mldsm", "yvrph", "sinss", "ptyuv", "sepcr", "sjdkp", "zadrz", "satjf", "iahkb", "auskd"]);

    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
        .haiyaa-trigger-btn { background-color: #0D2D52; color: white; border: none; border-radius: 6px; padding: 6px 14px; font-size: 14px; font-weight: bold; cursor: pointer; margin: 0 10px; transition: all 0.2s; }
        .haiyaa-trigger-btn:hover { background-color: #1a4a87; }
        .haiyaa-trigger-btn:disabled { background-color: #888; cursor: not-allowed; }
        .visualizer-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; justify-content: center; align-items: center; }
        .visualizer-modal { background-color: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); width: auto; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; }
        .modal-header h3 { margin: 0; font-size: 18px; white-space: nowrap; }
        .modal-header-right { display: flex; align-items: center; gap: 15px; }
        .modal-header-right select { padding: 5px; border-radius: 5px; border: 1px solid #ccc; font-size: 11px; }
        .prive-link-btn { font-size: 12px; color: #0D2D52; text-decoration: none; font-weight: bold; border: 1px solid #0D2D52; padding: 5px 10px; border-radius: 5px; transition: all 0.2s; white-space: nowrap; }
        .prive-link-btn:hover { background-color: #0D2D52; color: white; }
        .modal-close-btn { font-size: 24px; font-weight: bold; color: #888; cursor: pointer; border: none; background: none; padding: 0; }
        .modal-close-btn:hover { color: #000; }
        .generic-points-legend { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 15px; font-size: 12px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .multi-chart-container { transition: opacity 0.2s; }
        .multi-chart-container h4 { display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; margin: 20px 0 8px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; border-top: 1px solid #eee; padding-top: 20px; }
        .multi-chart-container h4:first-child { border-top: none; margin-top: 0; padding-top: 0; }
        .hotel-legend { display: flex; justify-content: center; align-items: center; gap: 15px; font-size: 11px; margin-bottom: 10px; }
        .calendar-chart-container { display: grid; grid-template-areas: "empty months" "weeks grid"; grid-template-columns: auto 1fr; grid-template-rows: auto 1fr; gap: 5px 3px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        .points-calendar-grid { transition: opacity 0.2s; }
        .calendar-months { grid-area: months; position: relative; height: 15px; }
        .calendar-months .month { position: absolute; top: 0; font-size: 11px; color: #555; }
        .calendar-weeks { grid-area: weeks; font-size: 11px; color: #555; }
        .points-calendar-grid { grid-area: grid; }
        .calendar-weeks .week-day { height: 14px; margin-bottom: 3px; display: flex; align-items: center; }
        .points-calendar-grid { display: grid; grid-template-columns: repeat(53, 14px); grid-template-rows: repeat(7, 14px); grid-auto-flow: column; grid-gap: 3px; }
        .calendar-day { width: 14px; height: 14px; background-color: #ebedf0; border: 1px solid #e1e4e8; border-radius: 3px; transition: all 0.1s; position: relative; }
        .calendar-day.is-holiday { border-width: 2px; box-sizing: border-box; }
        .day-number { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 9px; font-weight: bold; color: #333; text-shadow: none; }
        .calendar-day.off-peak .day-number, .calendar-day.standard .day-number, .calendar-day.peak .day-number { color: white; text-shadow: 0 0 2px rgba(0,0,0,0.7); }
        .calendar-day.clickable:hover { transform: scale(1.2); box-shadow: 0 0 5px rgba(0,0,0,0.5); cursor: pointer; }
        .calendar-day.off-peak { background-color: #216e39; border-color: transparent; }
        .calendar-day.standard { background-color: #9be9a8; border-color: transparent; }
        .calendar-day.peak { background-color: #ff9800; border-color: transparent; }
        .price-tier-1 { background-color: #1a9641; border-color: transparent; } .price-tier-2 { background-color: #a6d96a; border-color: transparent; } .price-tier-3 { background-color: #ffffbf; border-color: transparent; } .price-tier-4 { background-color: #fdae61; border-color: transparent; } .price-tier-5 { background-color: #d7191c; border-color: transparent; }
        .price-tier-1 .day-number, .price-tier-2 .day-number, .price-tier-3 .day-number, .price-tier-4 .day-number, .price-tier-5 .day-number { color: white; text-shadow: 0 0 2px rgba(0,0,0,0.7); }
        .price-tier-3 .day-number { color: #333; text-shadow: none; }
        .calendar-legend, .holiday-legend { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; font-size: 12px; margin-top: 15px; color: #555; }
        .legend-item { display: flex; align-items: center; margin: 2px 8px; }
        .legend-color-box { width: 14px; height: 14px; border-radius: 3px; margin-right: 5px; }
        .holiday-legend { margin-top: 5px; }
        .holiday-legend .legend-color-box { border-width: 2px; border-style: solid; background-color: transparent; }
        .availability-disclaimer { font-size: 13px; font-style: normal; font-weight: 500; color: #333; text-align: center; margin-top: 20px; padding: 12px 15px; border-top: 2px solid #0D2D52; background-color: #f0f4f8; border-radius: 8px; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .availability-disclaimer select { padding: 6px 10px; border-radius: 5px; border: 2px solid #0D2D52; font-size: 13px; font-weight: bold; background-color: white; cursor: pointer; transition: all 0.2s; }
        .availability-disclaimer select:hover { background-color: #0D2D52; color: white; }
        .hidden { display: none !important; }
        .comparison-toggle-container { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .switch { position: relative; display: inline-block; width: 34px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #0D2D52; }
        input:checked + .slider:before { transform: translateX(14px); }
        #hotelSelectionModal ul { list-style-type: none; padding: 0; margin: 20px 0; max-height: 50vh; overflow-y: auto; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
        #hotelSelectionModal li { padding: 8px 4px; border-bottom: 1px solid #eee; }
        #hotelSelectionModal li:last-child { border-bottom: none; }
        #hotelSelectionModal label { margin-left: 8px; font-size: 14px; cursor: pointer; }
        .modal-footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
        .selection-counter { font-size: 12px; color: #666; font-style: italic; }
        .compare-btn { background-color: #0D2D52; color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: bold; cursor: pointer; }
        .compare-btn:disabled { background-color: #888; cursor: not-allowed; }
        .view-total-toggle-container { display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 12px; margin: 10px 0; }
        .calendar-day.is-today { position: relative; overflow: visible; z-index: 10; box-shadow: 0 0 0 2px #0D2D52; }
        .calendar-day.is-today::before { content: 'TODAY'; position: absolute; top: -6px; left: -2px; background-color: #0D2D52; color: white; font-size: 6px; font-weight: bold; padding: 1px 2px; border-radius: 2px; z-index: 11; line-height: 1; }
        .calendar-day.alert-available::after {content: '🔔';position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 8px;pointer-events: none;}
        .calendar-day.alert-available:hover {transform: scale(1.2);box-shadow: 0 0 5px rgba(0,0,0,0.5);cursor: pointer;}
    `);

    const holidays = new Map([...getHolidays(new Date().getFullYear()), ...getHolidays(new Date().getFullYear() + 1)]);

    function getHotelCodeFromURL() {
        return new URLSearchParams(window.location.search).get('spiritCode');
    }

    async function fetchAllData(hotelCode, los = 1, numAdults = 2, numChildren = 0) {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 365);
        let startDateStr = toLocalDateString(today);
        const endDateStr = toLocalDateString(endDate);
        const apiUrl = `https://www.hyatt.com/explore-hotels/service/avail/days?spiritCode=${hotelCode}&startDate=${startDateStr}&endDate=${endDateStr}&numAdults=${numAdults}&numChildren=${numChildren}&roomQuantity=1&los=${los}&isMock=false`;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: apiUrl, headers: { "Accept": "application/json" },
                onload: response => {
                    const allData = { STANDARD_ROOM: new Map(), CLUB: new Map(), STANDARD_SUITE: new Map(), PREMIUM_SUITE: new Map() };
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const days = data.days || {};
                            for (const date in days) {
                                const roomsOnDate = days[date];
                                if (roomsOnDate) {
                                    Object.keys(allData).forEach(roomType => {
                                        if (roomsOnDate[roomType]) {
                                            const roomData = roomsOnDate[roomType];
                                            const level = roomData.pointslevel || roomData.pointsLevel;
                                            const type = level ? level.toLowerCase() : 'unknown';
                                            const pointsArray = Array.isArray(roomData.pointsValue) ? roomData.pointsValue : (roomData.pointsValue ? [roomData.pointsValue] : []);
                                            const points = pointsArray.length > 0 ? pointsArray[0] : null;
                                            const totalPoints = pointsArray.reduce((sum, p) => sum + p, 0);

                                            if (points) {
                                                allData[roomType].set(date, { type, points, pointsArray, totalPoints });
                                            }
                                        }
                                    });
                                }
                            }
                            resolve({ hotelCode, allData });
                        } catch (e) {
                            console.error("Failed to parse JSON for hotel:", hotelCode, e);
                            resolve({ hotelCode, allData, error: 'Failed to parse' });
                        }
                    } else {
                        console.error("Failed to fetch data for hotel:", hotelCode, "Status:", response.status);
                        resolve({ hotelCode, allData, error: `Failed to fetch (Status: ${response.status})` }); 
                    }
                },
                onerror: () => {
                    console.error("Network error fetching data for hotel:", hotelCode);
                    resolve({ hotelCode, allData: { STANDARD_ROOM: new Map(), CLUB: new Map(), STANDARD_SUITE: new Map(), PREMIUM_SUITE: new Map() }, error: 'Network Error' }) 
                }
            });
        });
    }

    function getPointsTiers(priceMap) {
        const tiers = {};
        for (const item of priceMap.values()) {
            if (item.type && item.points && !tiers[item.type]) {
                tiers[item.type] = item.points;
            }
            if (tiers.off_peak && tiers.standard && tiers.peak) break;
        }
        return tiers;
    }

    function toLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getHolidays(year) {
        const holidays = new Map();
        const nthWeekdayOfMonth = (n, weekday, month, year) => { let count = 0; const date = new Date(year, month, 1); while (count < n) { if (date.getDay() === weekday) count++; if (count < n) date.setDate(date.getDate() + 1); } return date; };
        const lastWeekdayOfMonth = (weekday, month, year) => { const date = new Date(year, month + 1, 0); while (date.getDay() !== weekday) { date.setDate(date.getDate() - 1); } return date; };
        const formatDate = (date) => toLocalDateString(date);
        holidays.set(formatDate(new Date(year, 0, 1)), { name: "New Year's Day", color: '#FFD700' });
        holidays.set(formatDate(nthWeekdayOfMonth(3, 1, 0, year)), { name: 'MLK Day', color: '#800080' });
        holidays.set(formatDate(lastWeekdayOfMonth(1, 4, year)), { name: 'Memorial Day', color: '#1E90FF' });
        holidays.set(formatDate(new Date(year, 6, 4)), { name: 'Independence Day', color: '#FF0000' });
        holidays.set(formatDate(nthWeekdayOfMonth(1, 1, 8, year)), { name: 'Labor Day', color: '#008080' });
        holidays.set(formatDate(nthWeekdayOfMonth(4, 4, 10, year)), { name: 'Thanksgiving', color: '#A0522D' });
        holidays.set(formatDate(new Date(year, 11, 25)), { name: 'Christmas Day', color: '#228B22' });
        return holidays;
    }

    function generateCalendarGrid(gridContainer, monthsContainer, weeksContainer, priceMap, hotelCode, losSelector, displayMode = 'default') {
        gridContainer.innerHTML = '';
        monthsContainer.innerHTML = '';
        weeksContainer.innerHTML = '';

        const weekDays = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];
        weekDays.forEach(day => { weeksContainer.innerHTML += `<div class="week-day">${day}</div>`; });

        if (!priceMap) return;

        let monthsHTML = '', lastMonth = -1, lastMonthLabelWeekIndex = -10;
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const dayCount = 53 * 7;

        for (let i = 0; i < dayCount; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            const todayDateString = toLocalDateString(today);
            const currentDateString = toLocalDateString(currentDate);
            if (todayDateString === currentDateString) {
                dayElement.classList.add('is-today');
            }

            const weekIndex = Math.floor(i / 7);
            const currentMonth = currentDate.getMonth();

            if (currentDate.getDate() === 1 && currentMonth !== lastMonth) {
                if (weekIndex > lastMonthLabelWeekIndex + 1) {
                    const monthName = currentDate.toLocaleString('default', { month: 'short' });
                    const leftPosition = weekIndex * 17;
                    monthsHTML += `<div class="month" style="left: ${leftPosition}px;">${monthName}</div>`;
                    lastMonth = currentMonth;
                    lastMonthLabelWeekIndex = weekIndex;
                }
            }

            const dateString = toLocalDateString(currentDate);
            if (currentDate >= today) {
                const dayData = priceMap.get(dateString);
                let title = dateString;
                const holiday = holidays.get(dateString);

                if (currentDate.getDate() === 1) {
                    dayElement.innerHTML = `<div class="day-number">1</div>`;
                }

                if (dayData) {
                    dayElement.classList.add(dayData.type.replace('_', '-'));

                    const checkoutDate = new Date(currentDate);
                    checkoutDate.setDate(checkoutDate.getDate() + parseInt(losSelector.value, 10));
                    const checkoutDateString = toLocalDateString(checkoutDate);
                    const checkoutWeekday = checkoutDate.toLocaleDateString('en-US', { weekday: 'short' });
                    const checkinWeekday = currentDate.toLocaleDateString('en-US', { weekday: 'short' });

                    if (displayMode === 'total' && dayData.pointsArray && dayData.pointsArray.length > 1) {
                        title = `Check-in: ${dateString} (${checkinWeekday})`;
                        title += `\nCheck-out: ${checkoutDateString} (${checkoutWeekday})`;
                        title += `\nNights: ${losSelector.value}`;
                        title += `\nTotal: ${dayData.totalPoints.toLocaleString()} points`;
                        title += `\n(${dayData.pointsArray.map(p => p.toLocaleString()).join(' + ')})`;
                    } else {
                        title += `\nRate: ${dayData.points.toLocaleString()} points (${dayData.type})`;
                    }

                    if (holiday) {
                        dayElement.classList.add('is-holiday');
                        dayElement.style.borderColor = holiday.color;
                        title += `\n${holiday.name}`;
                    }

                    dayElement.classList.add('clickable');
                    title += `\nClick to book!`;
                    dayElement.addEventListener('click', () => {
                        const checkoutDate = new Date(currentDate);
                        checkoutDate.setDate(checkoutDate.getDate() + parseInt(losSelector.value, 10));
                        const checkoutDateString = toLocalDateString(checkoutDate);
                        const bookingUrl = `https://www.hyatt.com/shop/rooms/${hotelCode}?checkinDate=${dateString}&checkoutDate=${checkoutDateString}&rooms=1&adults=1&kids=0&rateFilter=woh`;
                        window.open(bookingUrl, '_blank');
                    });
                } else {
                    // Date has NO availability - link to MaxMyPoint alert
                    if (holiday) {
                        dayElement.classList.add('is-holiday');
                        dayElement.style.borderColor = holiday.color;
                        title += `\n${holiday.name}`;
                    }
                    title += `\nNot Available`;
                    title += `\nClick to set alert on MaxMyPoint!`;

                    dayElement.classList.add('alert-available');
                    dayElement.style.cursor = 'pointer';

                    dayElement.addEventListener('click', () => {
                        const checkoutDate = new Date(currentDate);
                        checkoutDate.setDate(checkoutDate.getDate() + parseInt(losSelector.value, 10));
                        const checkoutDateString = toLocalDateString(checkoutDate);

                        // MaxMyPoint alert URL
                        const alertUrl = `https://maxmypoint.com/hotel/0?alert=true&checkin=${dateString}&checkout=${checkoutDateString}&brand=Hyatt&code=${hotelCode.toUpperCase()}`;
                        window.open(alertUrl, '_blank');
                    });
                }
                dayElement.title = title;
            }
            gridContainer.appendChild(dayElement);
        }
        monthsContainer.innerHTML = monthsHTML;
    }

    function getCategoryFromDOM(container = document) {
        const categoryEl = container.querySelector('[data-locator^="hotel-award-category_"]');
        if (categoryEl) {
            const locator = categoryEl.getAttribute('data-locator');
            const catValue = locator.split('_')[1];
            if (catValue) {
                return `[Cat ${catValue}]`;
            }
        }
        return '';
    }

    function createSingleVisualizerUI(initialResult) {
        const hotelCode = getHotelCodeFromURL();
        let currentAllData = initialResult.allData;
        let isTotalView = false;

        const overlay = document.createElement('div');
        overlay.className = 'visualizer-overlay hidden';
        const modal = document.createElement('div');
        modal.className = 'visualizer-modal';

        const header = document.createElement('div');
        header.className = 'modal-header';
        const title = document.createElement('h3');
        const hotelNameEl = document.querySelector('[data-locator="hotel-name-long"]');
        const categoryString = getCategoryFromDOM();
        const hotelName = hotelNameEl ? hotelNameEl.textContent.trim() : hotelCode;
        title.textContent = `${hotelName} ${categoryString}`;
        header.appendChild(title);

        const headerRight = document.createElement('div');
        headerRight.className = 'modal-header-right';

        if (priveHotelCodes.has(hotelCode)) {
            const priveLink = document.createElement('a');
            priveLink.href = 'https://www.hotelft.com/preferred-program/hyatt-prive';
            priveLink.textContent = 'Enjoy Privé benefits';
            priveLink.target = '_blank';
            priveLink.className = 'prive-link-btn';
            headerRight.appendChild(priveLink);
        }

        const roomSelector = document.createElement('select');
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close-btn';
        closeBtn.innerHTML = `&times;`;
        headerRight.append(roomSelector, closeBtn);
        header.appendChild(headerRight);

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'view-total-toggle-container hidden';
        toggleContainer.innerHTML = `
            <label class="switch">
                <input type="checkbox" id="totalViewToggle">
                <span class="slider"></span>
            </label>
            <span>View total for stay</span>
        `;
        const totalViewToggle = toggleContainer.querySelector('#totalViewToggle');

        const chartContainer = document.createElement('div');
        chartContainer.className = 'calendar-chart-container';
        const monthsContainer = document.createElement('div');
        monthsContainer.className = 'calendar-months';
        const weeksContainer = document.createElement('div');
        weeksContainer.className = 'calendar-weeks';
        const grid = document.createElement('div');
        grid.className = 'points-calendar-grid';
        chartContainer.append(monthsContainer, weeksContainer, grid);

        const legend = document.createElement('div');
        legend.className = 'calendar-legend';
        const holidayLegend = document.createElement('div');
        holidayLegend.className = 'holiday-legend';
        const disclaimer = document.createElement('div');
        disclaimer.className = 'availability-disclaimer';
        const losSelector = document.createElement('select');
        for (let i = 1; i <= 10; i++) {
            losSelector.options.add(new Option(i, i));
        }
        disclaimer.append('Availability based on ', losSelector, ' night(s) stay.');
        modal.append(header, toggleContainer, chartContainer, legend, holidayLegend, disclaimer);
        overlay.appendChild(modal);

        let holidayLegendHTML = '';
        const chronologicalHolidays = Array.from(holidays.values());
        const addedHolidays = new Set();
        for(const holiday of chronologicalHolidays){
            if(!addedHolidays.has(holiday.name)){
                holidayLegendHTML += `<div class="legend-item"><div class="legend-color-box" style="border-color: ${holiday.color};"></div> ${holiday.name}</div>`;
                addedHolidays.add(holiday.name);
            }
        }
        holidayLegend.innerHTML = holidayLegendHTML;

        function updateRoomSelector(data) {
            const currentSelection = roomSelector.value;
            let optionsHTML = '';
            if (data.STANDARD_ROOM?.size > 0) optionsHTML += `<option value="STANDARD_ROOM">Standard Room</option>`;
            if (data.CLUB?.size > 0) optionsHTML += `<option value="CLUB">Club Access</option>`;
            if (data.STANDARD_SUITE?.size > 0) optionsHTML += `<option value="STANDARD_SUITE">Standard Suite</option>`;
            if (data.PREMIUM_SUITE?.size > 0) optionsHTML += `<option value="PREMIUM_SUITE">Premium Suite</option>`;
            roomSelector.innerHTML = optionsHTML;

            if (Array.from(roomSelector.options).some(opt => opt.value === currentSelection)) {
                roomSelector.value = currentSelection;
            }
        }

        function render(roomType) {
            const priceMap = currentAllData[roomType];
            const displayMode = (isTotalView && parseInt(losSelector.value, 10) > 1) ? 'total' : 'default';
            generateCalendarGrid(grid, monthsContainer, weeksContainer, priceMap, hotelCode, losSelector, displayMode);

            grid.querySelectorAll('.calendar-day[class*="price-tier-"]').forEach(el => el.className = el.className.replace(/price-tier-\d/g, '').trim());

            if (displayMode === 'total') {
                const allTotalPoints = Array.from(priceMap.values()).map(d => d.totalPoints);
                const minPoints = Math.min(...allTotalPoints);
                const maxPoints = Math.max(...allTotalPoints);
                const range = maxPoints - minPoints;
                const tierCount = 5;
                const tierSize = range > 0 ? range / tierCount : 0;
                const buckets = Array.from({length: tierCount}, (_, i) => minPoints + ((i + 1) * tierSize));

                let legendHTML = '<span style="font-weight: bold; font-size: 11px;">Total for Stay:</span>';
                const roundUp = (num, factor) => Math.ceil(num / factor) * factor;

                for (let i = 0; i < tierCount; i++) {
                    let lowerBound = minPoints + (i * tierSize);
                    if (i > 0) lowerBound = roundUp(minPoints + (i * tierSize), 500) + 1;
                    let upperBound = minPoints + ((i + 1) * tierSize);
                    if (i < tierCount - 1) upperBound = roundUp(upperBound, 500);
                    if (range === 0) lowerBound = upperBound = minPoints;
                    legendHTML += `<div class="legend-item"><div class="legend-color-box price-tier-${i+1}"></div> ${lowerBound.toLocaleString()} - ${upperBound.toLocaleString()}</div>`;
                }
                legend.innerHTML = legendHTML;
                Array.from(grid.children).forEach(dayEl => {
                    const dateMatch = dayEl.title.match(/Check-in:\s*(\d{4}-\d{2}-\d{2})|^(\d{4}-\d{2}-\d{2})/);
                    if (dateMatch) {
                        const date = dateMatch[1] || dateMatch[2];
                        const dayData = priceMap.get(date);
                        if (dayData) {
                            dayEl.classList.remove('off-peak', 'standard', 'peak');
                            let tier = 0;
                            while(tier < buckets.length -1 && dayData.totalPoints > buckets[tier]) {
                                tier++;
                            }
                            dayEl.classList.add(`price-tier-${tier + 1}`);
                        }
                    }
                });
            } else {
                const pointTiers = getPointsTiers(priceMap);
                const legendOrder = [ { key: 'off-peak', label: 'Off-Peak' }, { key: 'standard', label: 'Standard' }, { key: 'peak', label: 'Peak' } ];
                let legendHTML = '';
                for (const item of legendOrder) {
                    const tierKey = item.key.replace('-', '_');
                    const points = pointTiers[tierKey];
                    if (points) {
                        legendHTML += `<div class="legend-item"><div class="legend-color-box calendar-day ${item.key}"></div> ${item.label} (${points.toLocaleString()})</div>`;
                    }
                }
                legend.innerHTML = legendHTML;
            }
        }

        losSelector.addEventListener('change', async (e) => {
            const newLos = parseInt(e.target.value, 10);
            if (newLos > 1) {
                toggleContainer.classList.remove('hidden');
                isTotalView = true;
                totalViewToggle.checked = true;
            } else {
                toggleContainer.classList.add('hidden');
                isTotalView = false;
                totalViewToggle.checked = false;
            }

            grid.style.opacity = '0.5';
            const result = await fetchAllData(hotelCode, newLos);
            currentAllData = result.allData;
            updateRoomSelector(currentAllData);
            render(roomSelector.value);
            grid.style.opacity = '1';
        });

        totalViewToggle.addEventListener('change', () => {
            isTotalView = totalViewToggle.checked;
            render(roomSelector.value);
        });

        roomSelector.addEventListener('change', () => render(roomSelector.value));
        closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });

        updateRoomSelector(currentAllData);
        if (roomSelector.value) {
            render(roomSelector.value);
        }

        return overlay;
    }

    function createMultiVisualizerUI(initialHotelResults, initialLos = 1) {
        let hotelResults = initialHotelResults;
        let isComparisonMode = false;

        const overlay = document.createElement('div');
        overlay.className = 'visualizer-overlay hidden';
        const modal = document.createElement('div');
        modal.className = 'visualizer-modal';

        const header = document.createElement('div');
        header.className = 'modal-header';
        const title = document.createElement('h3');
        title.textContent = 'Points Calendar Comparison';
        header.appendChild(title);

        const headerRight = document.createElement('div');
        headerRight.className = 'modal-header-right';

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'comparison-toggle-container';
        toggleContainer.innerHTML = `
            <span>Compare Total Points</span>
            <label class="switch">
                <input type="checkbox" id="comparisonToggle">
                <span class="slider"></span>
            </label>
        `;
        const toggle = toggleContainer.querySelector('#comparisonToggle');

        const roomSelector = document.createElement('select');
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close-btn';
        closeBtn.innerHTML = `&times;`;
        headerRight.append(toggleContainer, roomSelector, closeBtn);
        header.appendChild(headerRight);

        const genericLegend = document.createElement('div');
        genericLegend.className = 'generic-points-legend';

        const multiChartContainer = document.createElement('div');
        multiChartContainer.className = 'multi-chart-container';

        const holidayLegend = document.createElement('div');
        holidayLegend.className = 'holiday-legend';

        const disclaimer = document.createElement('div');
        disclaimer.className = 'availability-disclaimer';
        const losSelector = document.createElement('select');
        for (let i = 1; i <= 10; i++) {
            losSelector.options.add(new Option(i, i, i === initialLos, i === initialLos));
        }
        disclaimer.append('Availability based on ', losSelector, ' night(s) stay.');

        modal.append(header, genericLegend, multiChartContainer, holidayLegend, disclaimer);
        overlay.appendChild(modal);

        let holidayLegendHTML = '';
        const chronologicalHolidays = Array.from(holidays.values());
        const addedHolidays = new Set();
        for(const holiday of chronologicalHolidays){
            if(!addedHolidays.has(holiday.name)){
                holidayLegendHTML += `<div class="legend-item"><div class="legend-color-box" style="border-color: ${holiday.color};"></div> ${holiday.name}</div>`;
                addedHolidays.add(holiday.name);
            }
        }
        holidayLegend.innerHTML = holidayLegendHTML;

        function updateRoomSelector() {
            const currentSelection = roomSelector.value;
            const availableRoomTypes = new Set();
            hotelResults.forEach(result => {
                Object.keys(result.allData).forEach(roomType => {
                    if (result.allData[roomType].size > 0) {
                        availableRoomTypes.add(roomType);
                    }
                });
            });

            const roomTypeNames = { STANDARD_ROOM: "Standard Room", CLUB: "Club Access", STANDARD_SUITE: "Standard Suite", PREMIUM_SUITE: "Premium Suite" };
            const roomOrder = ["STANDARD_ROOM", "CLUB", "STANDARD_SUITE", "PREMIUM_SUITE"];
            let optionsHTML = '';
            for (const roomType of roomOrder) {
                if (availableRoomTypes.has(roomType)) {
                    optionsHTML += `<option value="${roomType}">${roomTypeNames[roomType]}</option>`;
                }
            }
            roomSelector.innerHTML = optionsHTML;
            if (Array.from(roomSelector.options).some(opt => opt.value === currentSelection)) {
                roomSelector.value = currentSelection;
            }
        }

        function renderDefaultView(roomType) {
            genericLegend.innerHTML = `
                <div class="legend-item"><div class="legend-color-box calendar-day off-peak"></div> Off-Peak</div>
                <div class="legend-item"><div class="legend-color-box calendar-day standard"></div> Standard</div>
                <div class="legend-item"><div class="legend-color-box calendar-day peak"></div> Peak</div>
            `;
            multiChartContainer.innerHTML = '';
            const displayMode = parseInt(losSelector.value, 10) > 1 ? 'total' : 'default';

            hotelResults.forEach(result => {
                const priceMap = result.allData[roomType];
                if (priceMap && priceMap.size > 0) {
                    const hotelContainer = document.createElement('div');
                    const titleEl = document.createElement('h4');

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = `${result.hotelName} ${result.category || ''}`.trim();
                    titleEl.appendChild(nameSpan);

                    if (priveHotelCodes.has(result.hotelCode)) {
                        const priveLink = document.createElement('a');
                        priveLink.href = 'https://www.hotelft.com/preferred-program/hyatt-prive';
                        priveLink.textContent = 'Enjoy Privé benefits';
                        priveLink.target = '_blank';
                        priveLink.className = 'prive-link-btn';
                        titleEl.appendChild(priveLink);
                    }

                    const legend = document.createElement('div');
                    legend.className = 'hotel-legend';
                    const pointTiers = getPointsTiers(priceMap);
                    const legendOrder = [ { key: 'off-peak', label: 'Off-Peak' }, { key: 'standard', label: 'Standard' }, { key: 'peak', label: 'Peak' } ];
                    let legendHTML = '';
                    for (const item of legendOrder) {
                        const tierKey = item.key.replace('-', '_');
                        const points = pointTiers[tierKey];
                        if (points) {
                            legendHTML += `<div class="legend-item"><div class="legend-color-box calendar-day ${item.key}"></div>${points.toLocaleString()}</div>`;
                        }
                    }
                    legend.innerHTML = legendHTML;

                    const chartContainer = document.createElement('div');
                    chartContainer.className = 'calendar-chart-container';
                    const monthsContainer = document.createElement('div');
                    monthsContainer.className = 'calendar-months';
                    const weeksContainer = document.createElement('div');
                    weeksContainer.className = 'calendar-weeks';
                    const grid = document.createElement('div');
                    grid.className = 'points-calendar-grid';

                    generateCalendarGrid(grid, monthsContainer, weeksContainer, priceMap, result.hotelCode, losSelector, displayMode);

                    chartContainer.append(monthsContainer, weeksContainer, grid);
                    hotelContainer.append(titleEl, legend, chartContainer);
                    multiChartContainer.appendChild(hotelContainer);
                }
            });
        }

        function renderComparisonView(roomType) {
            multiChartContainer.innerHTML = '';
            const useTotalPoints = parseInt(losSelector.value, 10) > 1;

            const allPoints = [];
            hotelResults.forEach(result => {
                const priceMap = result.allData[roomType];
                if (priceMap) {
                    allPoints.push(...Array.from(priceMap.values()).map(d => useTotalPoints ? d.totalPoints : d.points));
                }
            });

            if (allPoints.length === 0) {
                renderDefaultView(roomType);
                return;
            }

            const minPoints = Math.min(...allPoints);
            const maxPoints = Math.max(...allPoints);
            const range = maxPoints - minPoints;
            const tierCount = 5;
            const tierSize = range > 0 ? range / tierCount : 0;

            const buckets = [];
            let legendHTML = '';
            if (useTotalPoints) {
                legendHTML += `<span style="font-weight: bold; font-size: 11px;">Total for Stay:</span>`;
            }
            const roundUp = (num, factor) => Math.ceil(num / factor) * factor;

            for (let i = 0; i < tierCount; i++) {
                const upper = minPoints + ((i + 1) * tierSize);
                buckets.push(upper);

                let lowerBound = minPoints + (i * tierSize);
                if (i > 0) lowerBound = roundUp(minPoints + (i * tierSize), 500) + 1;

                let upperBound = upper;
                if (i < tierCount - 1) upperBound = roundUp(upper, 500);

                if (range === 0) lowerBound = upperBound = minPoints;

                legendHTML += `<div class="legend-item"><div class="legend-color-box price-tier-${i+1}"></div> ${lowerBound.toLocaleString()} - ${upperBound.toLocaleString()}</div>`;
            }
            genericLegend.innerHTML = legendHTML;

            hotelResults.forEach(result => {
                const priceMap = result.allData[roomType];
                if (priceMap && priceMap.size > 0) {
                    const hotelContainer = document.createElement('div');
                    const titleEl = document.createElement('h4');

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = `${result.hotelName} ${result.category || ''}`.trim();
                    titleEl.appendChild(nameSpan);

                    if (priveHotelCodes.has(result.hotelCode)) {
                        const priveLink = document.createElement('a');
                        priveLink.href = 'https://www.hotelft.com/preferred-program/hyatt-prive';
                        priveLink.textContent = 'Enjoy Privé benefits';
                        priveLink.target = '_blank';
                        priveLink.className = 'prive-link-btn';
                        titleEl.appendChild(priveLink);
                    }

                    const chartContainer = document.createElement('div');
                    chartContainer.className = 'calendar-chart-container';
                    const monthsContainer = document.createElement('div');
                    monthsContainer.className = 'calendar-months';
                    const weeksContainer = document.createElement('div');
                    weeksContainer.className = 'calendar-weeks';
                    const grid = document.createElement('div');
                    grid.className = 'points-calendar-grid';

                    const displayMode = useTotalPoints ? 'total' : 'default';
                    generateCalendarGrid(grid, monthsContainer, weeksContainer, priceMap, result.hotelCode, losSelector, displayMode);

                    Array.from(grid.children).forEach(dayEl => {
                        const dateMatch = dayEl.title.match(/Check-in:\s*(\d{4}-\d{2}-\d{2})|^(\d{4}-\d{2}-\d{2})/);
                        if (dateMatch) {
                            const date = dateMatch[1] || dateMatch[2];
                            const dayData = priceMap.get(date);
                            if (dayData) {
                                dayEl.classList.remove('off-peak', 'standard', 'peak');
                                const valueToCompare = useTotalPoints ? dayData.totalPoints : dayData.points;
                                let tier = 0;
                                while(tier < buckets.length -1 && valueToCompare > buckets[tier]) {
                                    tier++;
                                }
                                dayEl.classList.add(`price-tier-${tier + 1}`);
                            }
                        }
                    });

                    chartContainer.append(monthsContainer, weeksContainer, grid);
                    hotelContainer.append(titleEl, chartContainer);
                    multiChartContainer.appendChild(hotelContainer);
                }
            });
        }

        function handleRender() {
            if (isComparisonMode) {
                renderComparisonView(roomSelector.value);
            } else {
                renderDefaultView(roomSelector.value);
            }
        }

        toggle.addEventListener('change', () => {
            isComparisonMode = toggle.checked;
            handleRender();
        });

        roomSelector.addEventListener('change', handleRender);

        losSelector.addEventListener('change', async () => {
            multiChartContainer.style.opacity = '0.5';
            [losSelector, roomSelector, toggle].forEach(el => el.disabled = true);

            const hotelCodes = hotelResults.map(h => h.hotelCode);
            const fetchPromises = hotelCodes.map(code => fetchAllData(code, losSelector.value));
            const newHotelData = await Promise.all(fetchPromises);

            hotelResults = hotelResults.map(originalHotel => {
                const newData = newHotelData.find(res => res.hotelCode === originalHotel.hotelCode);
                return { ...originalHotel, ...newData };
            });

            const newLos = parseInt(losSelector.value, 10);
            if (newLos > 1) {
                isComparisonMode = true;
                toggle.checked = true;
                updateRoomSelector();
                renderComparisonView(roomSelector.value);
            } else {
                isComparisonMode = false;
                toggle.checked = false;
                updateRoomSelector();
                renderDefaultView(roomSelector.value);
            }

            multiChartContainer.style.opacity = '1';
            [losSelector, roomSelector, toggle].forEach(el => el.disabled = false);
        });

        closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });

        updateRoomSelector();

        // Auto-enable comparison mode if multi-night stay
        if (initialLos > 1) {
            isComparisonMode = true;
            toggle.checked = true;
            renderComparisonView(roomSelector.value);
        } else {
            renderDefaultView(roomSelector.value);
        }

        return overlay;
    }

    function createAlertSetupModal(hotelName, hotelCode, dateString, currentLos, currentRoomType, onSetAlertsCallback) {
        const overlay = document.createElement('div');
        overlay.className = 'visualizer-overlay';

        const modal = document.createElement('div');
        modal.className = 'visualizer-modal';
        modal.id = 'alertSetupModal';
        overlay.appendChild(modal);

        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `<h3>Set Alerts for ${hotelName || hotelCode}</h3>`;
        modal.appendChild(header);

        const date = new Date(dateString + 'T00:00:00');
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const subheader = document.createElement('p');
        subheader.textContent = `Check-in Date: ${dateString} (${weekday})`;
        subheader.style.textAlign = 'center';
        subheader.style.marginTop = '-10px';
        subheader.style.marginBottom = '20px';
        modal.appendChild(subheader);

        const losContainer = document.createElement('div');
        losContainer.innerHTML = '<h4>Lengths of Stay (Nights):</h4>';
        const losCheckboxes = document.createElement('div');
        losCheckboxes.className = 'checkbox-group';
        for (let i = 1; i <= 10; i++) {
            const div = document.createElement('div');
            div.innerHTML = `<input type="checkbox" id="los-${i}" value="${i}" ${i == currentLos ? 'checked' : ''}><label for="los-${i}">${i}</label>`;
            losCheckboxes.appendChild(div);
        }
        losContainer.appendChild(losCheckboxes);

        const roomTypeContainer = document.createElement('div');
        roomTypeContainer.innerHTML = '<h4>Room Types:</h4>';
        const roomTypeCheckboxes = document.createElement('div');
        roomTypeCheckboxes.className = 'checkbox-group';
        const roomTypes = { STANDARD_ROOM: "Standard Room", CLUB: "Club Access", STANDARD_SUITE: "Standard Suite", PREMIUM_SUITE: "Premium Suite" };
        Object.entries(roomTypes).forEach(([key, name]) => {
            const div = document.createElement('div');
            div.innerHTML = `<input type="checkbox" id="rt-${key}" value="${key}" ${key === currentRoomType ? 'checked' : ''}><label for="rt-${key}">${name}</label>`;
            roomTypeCheckboxes.appendChild(div);
        });
        roomTypeContainer.appendChild(roomTypeCheckboxes);

        modal.append(losContainer, roomTypeContainer);

        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        modal.appendChild(footer);

        const setAlertsBtn = document.createElement('button');
        setAlertsBtn.textContent = 'Set Selected Alerts';
        setAlertsBtn.className = 'compare-btn';
        footer.appendChild(setAlertsBtn);

        setAlertsBtn.addEventListener('click', () => {
            const selectedLos = Array.from(losContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.value, 10));
            const selectedRoomTypes = Array.from(roomTypeContainer.querySelectorAll('input:checked')).map(cb => cb.value);

            if (selectedLos.length === 0 || selectedRoomTypes.length === 0) {
                alert('Please select at least one Length of Stay and one Room Type.');
                return;
            }

            const combinations = [];
            for (const los of selectedLos) {
                for (const roomType of selectedRoomTypes) {
                    combinations.push({ los, roomType });
                }
            }
            onSetAlertsCallback(combinations);
            overlay.remove();
        });

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close-btn';
        closeBtn.innerHTML = `&times;`;
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '15px';
        closeBtn.style.right = '20px';
        header.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

        return overlay;
    }
    function waitForElement(selector) {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const targetEl = document.querySelector(selector);
                if (targetEl) { observer.disconnect(); resolve(targetEl); }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    async function main() {
        if (window.location.href.includes('/explore-hotels/rate-calendar')) {
            mainForCalendarPage();
        } else if (window.location.href.includes('/explore-hotels/map')) {
            mainForMapPage();
        } else if (window.location.href.includes('/search/')) {
            mainForSearchPage();
        }
    }

    async function mainForCalendarPage() {
        const hotelCode = getHotelCodeFromURL();
        if (!hotelCode) return;
        const injectionSelector = 'body > div.explore-hotels-content > main > div.vrc-cal-container > div.vrc-calendar > div.calendar-body-header > div.calendar-date-container';
        const injectionPoint = await waitForElement(injectionSelector);
        if (!injectionPoint) return;
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'haiyaa-trigger-btn';
        triggerBtn.textContent = 'Haiyaa!';
        injectionPoint.appendChild(triggerBtn);

        triggerBtn.addEventListener('click', async () => {
            const existingModal = document.querySelector('.visualizer-overlay');
            if (existingModal) existingModal.remove();

            triggerBtn.textContent = '...';
            triggerBtn.disabled = true;
            try {
                const initialResult = await fetchAllData(hotelCode, 1);
                const visualizerModal = createSingleVisualizerUI(initialResult);
                document.body.appendChild(visualizerModal);
                visualizerModal.classList.remove('hidden');
            } catch (error) {
                console.error('[Hyatt Visualizer] A critical error occurred:', error);
                triggerBtn.textContent = 'Error!';
                setTimeout(() => { triggerBtn.textContent = 'Haiyaa!'; triggerBtn.disabled = false; }, 2000);
                return;
            }
            triggerBtn.textContent = 'Haiyaa!';
            triggerBtn.disabled = false;
        });
    }

    function createHotelSelectionModal(hotels, limit, callback, currentLos = 1, currentAdults = 2, currentChildren = 0) {
        const overlay = document.createElement('div');
        overlay.className = 'visualizer-overlay';

        const modal = document.createElement('div');
        modal.className = 'visualizer-modal';
        modal.id = 'hotelSelectionModal';
        overlay.appendChild(modal);

        const header = document.createElement('div');
        header.className = 'modal-header';
        modal.appendChild(header);

        const title = document.createElement('h3');
        title.textContent = `Select up to ${limit} hotels`;
        header.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close-btn';
        closeBtn.innerHTML = `&times;`;
        header.appendChild(closeBtn);

        // Parameters container
        const paramsContainer = document.createElement('div');
        paramsContainer.style.cssText = 'margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px;';

        // LOS Selector
        const losContainer = document.createElement('div');
        losContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 10px;';
        losContainer.innerHTML = `
    <label style="font-weight: bold; min-width: 120px;">Length of Stay:</label>
    <select id="modal-los-selector" style="padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 13px;">
        ${Array.from({length: 10}, (_, i) => i + 1).map(n =>
                                                        `<option value="${n}" ${n === currentLos ? 'selected' : ''}>${n} night${n > 1 ? 's' : ''}</option>`
                                                       ).join('')}
    </select>
`;

        // Adults Selector
        const adultsContainer = document.createElement('div');
        adultsContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 10px;';
        adultsContainer.innerHTML = `
    <label style="font-weight: bold; min-width: 120px;">Adults:</label>
    <select id="modal-adults-selector" style="padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 13px;">
        ${Array.from({length: 6}, (_, i) => i + 1).map(n =>
                                                       `<option value="${n}" ${n === currentAdults ? 'selected' : ''}>${n}</option>`
                                                      ).join('')}
    </select>
`;

        // Children Selector
        const childrenContainer = document.createElement('div');
        childrenContainer.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        childrenContainer.innerHTML = `
    <label style="font-weight: bold; min-width: 120px;">Children:</label>
    <select id="modal-children-selector" style="padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 13px;">
        ${Array.from({length: 4}, (_, i) => i).map(n =>
                                                   `<option value="${n}" ${n === currentChildren ? 'selected' : ''}>${n}</option>`
                                                  ).join('')}
    </select>
`;

        paramsContainer.append(losContainer, adultsContainer, childrenContainer);

        const list = document.createElement('ul');
        modal.appendChild(list);

        modal.insertBefore(paramsContainer, list);

        hotels.forEach(hotel => {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = hotel.spiritCode;
            checkbox.id = `hotel-select-${hotel.spiritCode}`;
            const label = document.createElement('label');
            label.textContent = `${hotel.hotelName} ${hotel.category || ''}`.trim();
            label.htmlFor = checkbox.id;
            listItem.append(checkbox, label);
            list.appendChild(listItem);
        });

        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        modal.appendChild(footer);

        const counter = document.createElement('span');
        counter.className = 'selection-counter';
        footer.appendChild(counter);

        const compareBtn = document.createElement('button');
        compareBtn.textContent = 'Compare Selections';
        compareBtn.className = 'compare-btn';
        footer.appendChild(compareBtn);

        function updateState() {
            const checked = list.querySelectorAll('input[type="checkbox"]:checked');
            const count = checked.length;
            counter.textContent = `${count} / ${limit} selected`;
            compareBtn.disabled = count === 0;

            const unchecked = list.querySelectorAll('input[type="checkbox"]:not(:checked)');
            if (count >= limit) {
                unchecked.forEach(cb => cb.disabled = true);
            } else {
                unchecked.forEach(cb => cb.disabled = false);
            }
        }
        list.addEventListener('change', updateState);
        compareBtn.addEventListener('click', () => {
            const selectedCodes = new Set(Array.from(list.querySelectorAll('input:checked')).map(cb => cb.value));
            const selectedHotels = hotels.filter(h => selectedCodes.has(h.spiritCode));

            // Get selected parameters
            const los = parseInt(document.getElementById('modal-los-selector').value, 10);
            const adults = parseInt(document.getElementById('modal-adults-selector').value, 10);
            const children = parseInt(document.getElementById('modal-children-selector').value, 10);

            overlay.remove();
            callback(selectedHotels, los, adults, children);
        });

        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        updateState();
        return overlay;
    }

    async function processAndDisplayHotels(selectedHotels, triggerBtn, los = 1, numAdults = 2, numChildren = 0) {
        try {
            let loadedCount = 0;
            const totalCount = selectedHotels.length;
            triggerBtn.textContent = `0/${totalCount} loaded`;
            triggerBtn.disabled = true;

            const staggerDelay = 200;

            const promises = selectedHotels.map((hotel, index) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        fetchAllData(hotel.spiritCode, los, numAdults, numChildren).then(result => {
                            loadedCount++;
                            triggerBtn.textContent = `${loadedCount}/${totalCount} loaded`;
                            resolve(result);
                        });
                    }, index * (staggerDelay + (Math.random() * 100)));
                });
            });

            const allResults = await Promise.all(promises);

            const hotelResults = [];
            const failedHotels = [];

            allResults.forEach(result => {
                const originalHotel = selectedHotels.find(h => h.spiritCode === result.hotelCode);
                const hotelName = (originalHotel && originalHotel.hotelName) || result.hotelCode;
                const category = (originalHotel && originalHotel.category) || '';

                if (result.error) {
                    failedHotels.push({ name: hotelName, error: result.error });
                } else if (result.allData.STANDARD_ROOM.size > 0 || result.allData.STANDARD_SUITE.size > 0 || result.allData.CLUB.size > 0 || result.allData.PREMIUM_SUITE.size > 0) {
                    hotelResults.push({ ...result,
                                       hotelName: hotelName,
                                       category: category
                                      });
                } else {
                    failedHotels.push({ name: hotelName, error: 'No points data available' });
                }
            });

            if (hotelResults.length > 0) {
                const visualizerModal = createMultiVisualizerUI(hotelResults, los);
                document.body.appendChild(visualizerModal);
                visualizerModal.classList.remove('hidden');
            } else {
                triggerBtn.textContent = 'All failed!';
                setTimeout(() => { triggerBtn.textContent = 'Haiyaa!'; triggerBtn.disabled = false; }, 2000);
            }

            if (failedHotels.length > 0) {
                const errorMsg = `Failed to load data for ${failedHotels.length} hotel(s):\n\n` +
                      failedHotels.map(h => `• ${h.name} (Reason: ${h.error})`).join('\n');
                alert(errorMsg);
            }

        } catch (error) {
            console.error('[Hyatt Visualizer] A critical error occurred on map page:', error);
            triggerBtn.textContent = 'Script Error!';
        } finally {
            if (!triggerBtn.textContent.includes('fail') && !triggerBtn.textContent.includes('Error')) {
                triggerBtn.textContent = 'Haiyaa!';
                triggerBtn.disabled = false;
            }
        }
    }


    async function mainForMapPage() {
        const injectionSelector = 'div[data-locator="num-results-heading"]';
        const injectionPoint = await waitForElement(injectionSelector);
        if (!injectionPoint) return;

        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'haiyaa-trigger-btn';
        triggerBtn.textContent = 'Haiyaa!';
        triggerBtn.style.display = 'none';
        injectionPoint.appendChild(triggerBtn);

        const observer = new MutationObserver(() => {
            const calendarLinks = document.querySelectorAll('a[href*="/explore-hotels/rate-calendar?spiritCode="]');
            triggerBtn.style.display = calendarLinks.length > 0 ? 'inline-block' : 'none';
        });
        observer.observe(document.body, { childList: true, subtree: true });

        triggerBtn.addEventListener('click', async () => {
            const existingModal = document.querySelector('.visualizer-overlay');
            if (existingModal) existingModal.remove();

            const limit = 5;
            const scrapedHotels = Array.from(document.querySelectorAll('a[href*="/explore-hotels/rate-calendar?spiritCode="]')).map(linkEl => {
                const spiritCode = new URLSearchParams(linkEl.search).get('spiritCode');
                if (!spiritCode) return null;

                const hotelCard = linkEl.closest('div[role="listitem"]');
                const hotelNameEl = hotelCard ? hotelCard.querySelector('[data-locator="hotel-name-long"]') : document.querySelector(`#modal-card-label-${spiritCode} [data-locator="hotel-name-long"]`);
                const hotelName = hotelNameEl ? hotelNameEl.textContent.trim() : spiritCode;
                const category = hotelCard ? getCategoryFromDOM(hotelCard) : getCategoryFromDOM(document.querySelector(`#modal-card-label-${spiritCode}`)?.closest('div.hotel-info-container'));

                return { hotelName, spiritCode, category };
            }).filter((h, index, self) => h && self.findIndex(ho => ho.spiritCode === h.spiritCode) === index);

            const selectionModal = createHotelSelectionModal(scrapedHotels, limit, (selectedHotels, los, adults, children) => {
                processAndDisplayHotels(selectedHotels, triggerBtn, los, adults, children);
            });
            document.body.appendChild(selectionModal);
        });
    }

    async function mainForSearchPage() {
        const injectionSelector = '[class*="styles_control-bar__results-text"]';
        const resultsTextElement = await waitForElement(injectionSelector);
        if (!resultsTextElement) {
            console.error('[Hyatt Visualizer] Could not find injection point on search page.');
            return;
        }

        const injectionPoint = resultsTextElement.parentElement;
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'haiyaa-trigger-btn';
        triggerBtn.textContent = 'Haiyaa!';
        injectionPoint.insertBefore(triggerBtn, resultsTextElement);

        triggerBtn.addEventListener('click', async () => {
            const existingModal = document.querySelector('.visualizer-overlay');
            if (existingModal) existingModal.remove();

            const limit = 5;
            const hotelCards = document.querySelectorAll('div[data-spirit-code]');

            const scrapedHotels = Array.from(hotelCards).map(card => {
                const spiritCode = card.dataset.spiritCode;
                if (!spiritCode) return null;

                const categoryEl = card.querySelector('[class*="RatingAndDistance_ratingAndDistance_redesign"]');
                let category = '';
                if (categoryEl) {
                    const match = categoryEl.textContent.match(/Category ([A-Z0-9])/);
                    if (match && match[1]) {
                        category = `[Cat ${match[1]}]`;
                    }
                }

                if (!category) {
                    return null;
                }

                const nameEl = card.querySelector('[class*="HotelCard_info__header-wrapper"] > div');
                const hotelName = nameEl ? nameEl.textContent.trim() : spiritCode;

                return { hotelName, spiritCode, category };
            }).filter((h, index, self) => h && self.findIndex(ho => ho.spiritCode === h.spiritCode) === index);

            if (scrapedHotels.length === 0) {
                alert('No hotels with points calendar links found on this page.');
                return;
            }

            const selectionModal = createHotelSelectionModal(scrapedHotels, limit, (selectedHotels, los, adults, children) => {
                processAndDisplayHotels(selectedHotels, triggerBtn, los, adults, children);
            });
            document.body.appendChild(selectionModal);
        });
    }

    main();

})();