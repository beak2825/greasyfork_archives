// ==UserScript==
// @name             Neopets: Dynamic Bookmarks Pane
// @namespace        kmtxcxjx
// @version          1.0.6
// @description      Adds a dropdown dynamic bookmarks pane to the Neopets navigation bar
// @match            *://*.neopets.com/*
// @grant            GM.getValue
// @grant            GM.setValue
// @grant            GM.setClipboard
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/552709/Neopets%3A%20Dynamic%20Bookmarks%20Pane.user.js
// @updateURL https://update.greasyfork.org/scripts/552709/Neopets%3A%20Dynamic%20Bookmarks%20Pane.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // This setting gives headers a right-click option to open all active links in a new tab
    // Disabled by default, because having the ability to generate multiple requests to Neopets with a single click is potentially risky
    // Set to true to enable it anyways
    const allowOpenAllInNewTab = false;

    if (window.location.hostname === 'account.neopets.com') return;

    // The user's offset from the Neopian Timezone, in milliseconds
    const ntOffsetMs = new Date().getTime() - new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).getTime();

    // Whether to show inactive links in the dropdown pane
    let showInactive = false;

    const undoQueue = (await GM.getValue('undoQueue')) ?? [];
    const redoQueue = [];

    // This is used to allow multiple copies of this plugin to work simultaneously, by allowing us to differentiate between them
    const id = Math.random().toString(36).slice(2, 7);

    const defaultData = {"text":"Bookmarks","icon":"https://images.neopets.com/themes/h5/basic/images/np-icon.svg","panicIcon":"https://images.neopets.com/images/buddy/aim_alarmclock.gif","links":{"questLog":{"name":"Quest Log","key":"questLog","checkType":"alwaysAvailable","params":[],"url":"https://www.neopets.com/questlog/","header":"Quick Links","icon":"https://images.neopets.com/themes/h5/basic/images/quests-icon.svg","enabled":true,"panic":false,"newTab":false},"inventory":{"name":"Inventory","key":"inventory","checkType":"alwaysAvailable","params":[],"url":"https://www.neopets.com/inventory.phtml","header":"Quick Links","icon":"https://images.neopets.com/themes/h5/common/inventory/images/inventory-chest.png","enabled":true,"panic":false,"newTab":false},"safetyDepositBox":{"name":"Safety Deposit Box","key":"safetyDepositBox","checkType":"alwaysAvailable","params":[],"url":"https://www.neopets.com/safetydeposit.phtml","header":"Quick Links","icon":"https://images.neopets.com/neoboards/avatars/sdb.gif","enabled":true,"panic":false,"newTab":false},"quickstock":{"name":"Quickstock","key":"quickstock","checkType":"alwaysAvailable","params":[],"url":"https://www.neopets.com/quickstock.phtml","header":"Quick Links","icon":"https://images.neopets.com/themes/h5/altadorcup/images/quickstock-icon.png","enabled":true,"panic":false,"newTab":false},"myPets":{"name":"My Pets","key":"myPets","checkType":"alwaysAvailable","params":[],"url":"https://www.neopets.com/home/index.phtml","header":"Quick Links","icon":"https://images.neopets.com/themes/h5/basic/images/v3/mypets-icon.svg","enabled":true,"panic":false,"newTab":false},"bank":{"name":"Bank","key":"bank","checkType":"alwaysAvailable","params":[],"url":"https://www.neopets.com/bank.phtml","header":"Quick Links","icon":"https://images.neopets.com/themes/h5/common/bank/images/dial-icon.svg","enabled":true,"panic":false,"newTab":false},"jellyneo":{"name":"Jellyneo","key":"jellyneo","checkType":"alwaysAvailable","params":[],"url":"https://www.jellyneo.net/","header":"Quick Links","icon":"https://www.jellyneo.net/layout/imgs/mainsite/favicon.png","enabled":true,"panic":false,"newTab":true},"itemdb":{"name":"itemdb","key":"itemdb","checkType":"alwaysAvailable","params":[],"url":"https://itemdb.com.br/","header":"Quick Links","icon":"https://images.neopets.com/themes/h5/altadorcup/images/quickstock-icon.png","enabled":true,"panic":false,"newTab":false},"shopOfOffers":{"name":"Shop Of Offers","key":"shopOfOffers","checkType":"daily","params":[0],"url":"https://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes","header":"Fast Dailies","icon":"https://images.neopets.com/neoboards/avatars/slorg.gif","enabled":true,"panic":false,"newTab":false},"giantOmelette":{"name":"Giant Omelette","key":"giantOmelette","checkType":"daily","params":[0],"url":"https://www.neopets.com/prehistoric/omelette.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/neoboards/avatars/ava_cookbook_omelette.gif","enabled":true,"panic":false,"newTab":false},"giantJelly":{"name":"Giant Jelly","key":"giantJelly","checkType":"daily","params":[0],"url":"https://www.neopets.com/jelly/jelly.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/jelly/giantjelly.gif","enabled":true,"panic":false,"newTab":false},"anchorManagement":{"name":"Anchor Management","key":"anchorManagement","checkType":"daily","params":[0],"url":"https://www.neopets.com/pirates/anchormanagement.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/items/fur_pirate_anchor.gif","enabled":true,"panic":false,"newTab":false},"yeOldeFishingVortex":{"name":"Ye Olde Fishing Vortex","key":"yeOldeFishingVortex","checkType":"daily","params":[0],"url":"https://www.neopets.com/water/fishing.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/neoboards/avatars/fishsquid.gif","enabled":true,"panic":false,"newTab":false},"tikiTackTombola":{"name":"Tiki Tack Tombola","key":"tikiTackTombola","checkType":"daily","params":[0],"url":"https://www.neopets.com/island/tombola.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/new_shopkeepers/t_139.gif","enabled":true,"panic":false,"newTab":false},"theSnowager":{"name":"The Snowager","key":"theSnowager","checkType":"hoursAvailable","params":[[6,14,22]],"url":"https://www.neopets.com/winter/snowager.phtml","header":"Every so often","icon":"https://images.neopets.com/neoboards/avatars/snowager.gif","enabled":true,"panic":true,"newTab":false},"coltzanSShrine":{"name":"Coltzan's Shrine","key":"coltzanSShrine","checkType":"or","params":[[["daily",[[26]]],["cooldown",[[780]]]]],"url":"https://www.neopets.com/desert/shrine.phtml","header":"Every so often","icon":"https://images.neopets.com/neoboards/avatars/ava_coltzan_shrine.gif","enabled":true,"panic":false,"newTab":false},"trudySSurprise":{"name":"Trudy's Surprise","key":"trudySSurprise","checkType":"daily","params":[0],"url":"https://www.neopets.com/trudys_surprise.phtml","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/trudyavatar.gif","enabled":true,"panic":false,"newTab":false},"fruitMachine":{"name":"Fruit Machine","key":"fruitMachine","checkType":"daily","params":[0],"url":"https://www.neopets.com/desert/fruit/index.phtml","header":"Dailies","icon":"https://images.neopets.com//games/clicktoplay/icon_20.gif","enabled":true,"panic":false,"newTab":false},"forgottenShore":{"name":"Forgotten Shore","key":"forgottenShore","checkType":"daily","params":[0],"url":"https://www.neopets.com/pirates/forgottenshore.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/neoboards/avatars/forgshore.gif","enabled":true,"panic":false,"newTab":false},"buriedTreasure":{"name":"Buried Treasure","key":"buriedTreasure","checkType":"cooldown","params":[180],"url":"https://www.neopets.com/pirates/buriedtreasure/index.phtml","header":"Every so often","icon":"https://images.neopets.com/neoboards/avatars/aishascalawag.gif","enabled":true,"panic":false,"newTab":false},"discardedMagicalBlueGrundoPlushieOfProsperity":{"name":"Discarded Magical Blue Grundo Plushie of Prosperity","key":"discardedMagicalBlueGrundoPlushieOfProsperity","checkType":"daily","params":[0],"url":"https://www.neopets.com/faerieland/tdmbgpop.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/neoboards/avatars/tdmbgpop.gif","enabled":true,"panic":false,"newTab":false},"appleBobbing":{"name":"Apple Bobbing","key":"appleBobbing","checkType":"daily","params":[0],"url":"https://www.neopets.com/halloween/applebobbing.phtml","header":"Fast Dailies","icon":"https://images.neopets.com/neoboards/avatars/imposterapple.gif","enabled":true,"panic":false,"newTab":false},"wiseOldKing":{"name":"Wise Old King","key":"wiseOldKing","checkType":"daily","params":[0],"url":"https://www.neopets.com/medieval/wiseking.phtml","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/kinghagan.gif","enabled":true,"panic":false,"newTab":false},"grumpyOldKing":{"name":"Grumpy Old King","key":"grumpyOldKing","checkType":"daily","params":[0],"url":"https://www.neopets.com/medieval/grumpyking.phtml","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/jester.gif","enabled":true,"panic":false,"newTab":false},"desertedTomb":{"name":"Deserted Tomb","key":"desertedTomb","checkType":"daily","params":[0],"url":"https://www.neopets.com/worlds/geraptiku/tomb.phtml","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/geraptiku_tomb.gif","enabled":true,"panic":false,"newTab":false},"wheelOfKnowledge":{"name":"Wheel of Knowledge","key":"wheelOfKnowledge","checkType":"daily","params":[0],"url":"https://www.neopets.com/medieval/knowledge.phtml","header":"Wheels","icon":"https://images.neopets.com/neoboards/avatars/brightvale.gif","enabled":true,"panic":false,"newTab":false},"wheelOfExcitement":{"name":"Wheel of Excitement","key":"wheelOfExcitement","checkType":"cooldown","params":[120],"url":"https://www.neopets.com/faerieland/wheel.phtml","header":"Wheels","icon":"https://images.neopets.com/neoboards/avatars/wheelofexcitement.gif","enabled":true,"panic":false,"newTab":false},"wheelOfMisfortune":{"name":"Wheel of Misfortune","key":"wheelOfMisfortune","checkType":"cooldown","params":[120],"url":"https://www.neopets.com/halloween/wheel/index.phtml","header":"Wheels","icon":"https://images.neopets.com/neoboards/avatars/misfortune.gif","enabled":true,"panic":false,"newTab":false},"wheelOfMediocrity":{"name":"Wheel of Mediocrity","key":"wheelOfMediocrity","checkType":"cooldown","params":[40],"url":"https://www.neopets.com/prehistoric/mediocrity.phtml","header":"Wheels","icon":"https://images.neopets.com/neoboards/avatars/mediocrity.gif","enabled":true,"panic":false,"newTab":false},"testYourStrength":{"name":"Test Your Strength","key":"testYourStrength","checkType":"cooldown","params":[360],"url":"https://www.neopets.com/halloween/strtest/index.phtml","header":"Every so often","icon":"https://images.neopets.com/halloween/strtest/h5/images/wood-hammer3.png","enabled":true,"panic":false,"newTab":false},"spaceFaerieScratchcard":{"name":"Space Faerie Scratchcard","key":"spaceFaerieScratchcard","checkType":"weekly","params":[5],"url":"https://www.neopets.com/premium/sc/","header":"Every so often","icon":"https://images.neopets.com/premium/2023/icon-scratchcards.png","enabled":true,"panic":false,"newTab":false},"wheelOfStarlight":{"name":"Wheel of Starlight","key":"wheelOfStarlight","checkType":"daily","params":[0],"url":"https://www.neopets.com/premium/wheel.phtml","header":"Wheels","icon":"https://images.neopets.com/themes/h5/basic/images/premiumwheel-icon.png","enabled":true,"panic":false,"newTab":false},"graveDanger":{"name":"Grave Danger","key":"graveDanger","checkType":"cooldown","params":[600],"url":"https://www.neopets.com/halloween/gravedanger/","header":"Every so often","icon":"https://images.neopets.com/images/buddy/aim_hauntedwoods_1.gif","enabled":true,"panic":false,"newTab":false},"wheelOfMonotony":{"name":"Wheel of Monotony","key":"wheelOfMonotony","checkType":"daily","params":[0],"url":"https://www.neopets.com/prehistoric/monotony/monotony.phtml","header":"Wheels","icon":"https://images.neopets.com/neoboards/avatars/monotony.gif","enabled":true,"panic":false,"newTab":false},"obelisk":{"name":"Obelisk","key":"obelisk","checkType":"weekly","params":[1],"url":"https://www.neopets.com/prehistoric/battleground/","header":"Every so often","icon":"https://images.neopets.com/neoboards/avatars/obeliskwar_ayfb89s.gif","enabled":true,"panic":false,"newTab":false},"coconutShy":{"name":"Coconut Shy","key":"coconutShy","checkType":"daily","params":[0],"url":"https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=3","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/evilcoconut.gif","enabled":true,"panic":false,"newTab":false},"qasalanExpellibox_1":{"name":"Qasalan Expellibox","key":"qasalanExpellibox_1","checkType":"cooldown","params":[427],"url":"https://ncmall.neopets.com/games/giveaway/process_giveaway.phtml","header":"Dailies","icon":"https://images.neopets.com/games/pages/icons/screenshots/905/1.png","enabled":true,"panic":false,"newTab":false},"theLottery":{"name":"The Lottery","key":"theLottery","checkType":"daily","params":[0],"url":"https://www.neopets.com/games/lottery.phtml","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/lottery.gif","enabled":true,"panic":false,"newTab":false},"wishingWell":{"name":"Wishing Well","key":"wishingWell","checkType":"daily","params":[0],"url":"https://www.neopets.com/wishing.phtml","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/wishingwell.gif","enabled":true,"panic":false,"newTab":false},"voidworks":{"name":"Voidworks","key":"voidworks","checkType":"daily","params":[0],"url":"https://www.neopets.com/games/voidworks/","header":"Dailies","icon":"https://images.neopets.com/neoboards/avatars/ava_voidworks_capsule.gif","enabled":true,"panic":false,"newTab":false},"healingSprings":{"name":"Healing Springs","key":"healingSprings","checkType":"cooldown","params":[30],"url":"https://www.neopets.com/faerieland/springs.phtml","header":"Every so often","icon":"https://images.neopets.com/items/pot_healingspringsres.gif","enabled":true,"panic":false,"newTab":false},"desertedFairgroundScratchcards":{"name":"Deserted Fairground Scratchcards","key":"desertedFairgroundScratchcards","checkType":"cooldown","params":[120],"url":"https://www.neopets.com/halloween/scratch.phtml","header":"Every so often","icon":"https://images.neopets.com/neoboards/avatars/sssidney.gif","enabled":true,"panic":false,"newTab":false},"monthlyFreebies":{"name":"Monthly Freebies","key":"monthlyFreebies","checkType":"monthly","params":[1],"url":"https://www.neopets.com/freebies/index.phtml","header":"Every so often","icon":"https://images.neopets.com/items/nbo_monthofeating.gif","enabled":true,"panic":false,"newTab":false}},"columnWidth":"176","manualSort":false,"columnStack":true,"version":1.111112,"headerOrder":["Quick Links","Fast Dailies","Dailies","Every so often","Wheels"],"headers":{"Quick Links":{"name":"Quick Links","linkCount":0,"open":true,"hidden":false,"order":["questLog","inventory","safetyDepositBox","quickstock","myPets","bank","jellyneo","itemdb"]},"Fast Dailies":{"name":"Fast Dailies","linkCount":0,"open":true,"hidden":false,"order":["shopOfOffers","giantOmelette","giantJelly","anchorManagement","yeOldeFishingVortex","tikiTackTombola","forgottenShore","discardedMagicalBlueGrundoPlushieOfProsperity","appleBobbing"]},"Every so often":{"name":"Every so often","linkCount":0,"open":true,"hidden":false,"order":["theSnowager","coltzanSShrine","buriedTreasure","testYourStrength","spaceFaerieScratchcard","graveDanger","obelisk","healingSprings","desertedFairgroundScratchcards","monthlyFreebies"]},"Dailies":{"name":"Dailies","linkCount":0,"open":true,"hidden":false,"order":["trudySSurprise","fruitMachine","wiseOldKing","grumpyOldKing","desertedTomb","theLottery","wishingWell","voidworks","qasalanExpellibox_1","coconutShy"]},"Wheels":{"name":"Wheels","linkCount":0,"open":true,"hidden":false,"order":["wheelOfKnowledge","wheelOfExcitement","wheelOfMisfortune","wheelOfMediocrity","wheelOfStarlight","wheelOfMonotony"]}}};

    const helpText = `• Click the ➕ in the lower left of the dropdown to add a new link.
    • When adding a new link, it will auto-populate the URL with the current page, make a good guess at the link title, and, for many pages, auto-pick a decent icon.

• This is a dynamic bookmark pane: Links will only appear when they're relevant. For example, the Wheel of Excitement, if properly added and configured, will only show up if it hasn't been visited in the last two hours.
    • Link timers will only update if accessed through the menu itself - not through other links.

• Right click things to interact with them. You can right click the main button, category headers, links, and the background of the dropdown. Almost everything is customizable - try things out!

• Click the 👁️ in the lower left of the dropdown to toggle between showing all links, and only links which are active.

• If you click Export, a long string of save data will be saved to your system clipboard.
    • If you then import this data, it will restore all links and their timings. This is useful for testing changes without committing, or syncing menus between computers.
    • Note that importing will overwrite any existing links - use it carefully!

• When moving links around in manual sort mode (which you can toggle by right clicking the dropdown background), you can use your keyboard's arrow keys for a nicer experience.

• Undo and redo will only undo and redo the action of clicking a link - meaning the timer associated with that link will be undone or redone. Nothing else is undone or redone.

• If opening links in new tabs isn't working right, you may need to give neopets.com permission to open popups in your browser settings.

• If you really want to, you can duplicate the plugin to get multiple buttons, and this works fine. They will all function independently of each other.
    • Beware, though, that if you add too many, the Neopets layout might not fit them all gracefully. You can alleviate this somewhat by giving them shorter names.`;

    // --- Links list ---
    let data, links;
    await setData(undefined, false);

    // --- Availability checkers ---

    const availabilityCheckers = {
        alwaysAvailable: (key, last) => { return -Infinity; },

        daily: (key, last, offset = 0, excludeHours = []) => {
            // Resets at midnight by default, if offset is 0 or undefined
            // Otherwise resets at midnight + offset minutes
            offset = +offset;
            if (!Number.isInteger(offset) || offset < 0 || offset >= 1440) return NaN;

            if (!Array.isArray(excludeHours) || !excludeHours.every(h => Number.isInteger(h) && h >= 0 && h <= 23)) return NaN;
            let next = new Date(last);
            next.setHours(24, offset, 0, 0); // NST, midnight+offset the same day

            if (excludeHours.length) {
                // First, make sure next isn't during an excluded hour
                while (excludeHours.includes(next.getHours())) {
                    // Advance next to a non-excluded hour
                    next.setHours(next.getHours() + 1, 0, 0, 0);
                }
                // Check if event is currently active
                if (next.getTime() + ntOffsetMs < Date.now()) {
                    // If it is, make sure it's not currently an excluded hour - otherwise, advance it to the next good hour
                    const nowNT = new Date()
                    nowNT.setTime(nowNT.getTime() - ntOffsetMs); // NST
                    let hoursToAdd = 0;
                    while (excludeHours.includes((nowNT.getHours() + hoursToAdd) % 24)) hoursToAdd++;
                    next = new Date(nowNT.setHours(nowNT.getHours() + hoursToAdd, 0, 0, 0));
                }
            }
            next.setTime(next.getTime() + ntOffsetMs); // User's local timezone
            while (next.getTime() - 24*60*60*1000 > last) next.setTime(next.getTime() - 24*60*60*1000); // Advance by 1 day
            const timeLeft = Math.round((next.getTime() - Date.now()) / 1000);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        weekly: (key, last, day = 0) => {
            day = +day;
            if (!Number.isInteger(day) || day < 0 || day > 6) return NaN;

            const next = new Date(last);
            next.setHours(0, 0, 0, 0);
            next.setDate(next.getDate() + ((7 + day - next.getDay()) % 7 || 7));
            next.setTime(next.getTime() + ntOffsetMs);
            const timeLeft = Math.round((next.getTime() - Date.now()) / 1000);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        monthly: (key, last, day = 1) => {
            day = +day;
            // Resets when the month has changed
            if (!Number.isInteger(day) || day < 0 || day > 31) return NaN;

            const next = new Date(last);
            next.setMonth(next.getMonth() + 1, day);
            next.setHours(0, 0, 0, 0);
            next.setTime(next.getTime() + ntOffsetMs);
            const timeLeft = Math.round((next.getTime() - Date.now()) / 1000);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        isMonth: (key, last, month) => {
            month = +month;
            if (!Number.isInteger(month) || month < 0 || month > 11) return NaN;

            const nowNT = new Date();
            nowNT.setTime(nowNT.getTime() - ntOffsetMs);
            if (nowNT.getMonth() === month) return -1;
            const next = new Date();
            next.setMonth(month, 1);
            next.setHours(0, 0, 0, 0);
            next.setTime(next.getTime() + ntOffsetMs);
            while (next.getTime() < nowNT.getTime()) next.setFullYear(next.getFullYear() + 1);
            const timeLeft = Math.round((next.getTime() - Date.now()) / 1000);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        date: (key, last, month, day) => {
            month = +month; day = +day;
            if (!Number.isInteger(month) || month < 0 || month > 11) return NaN;
            if (!Number.isInteger(day)) return NaN;
            const test = new Date(2000, month, day);
            if (test.getMonth() !== month || test.getFullYear() !== 2000) return NaN;

            const next = new Date();
            next.setMonth(month, day);
            next.setHours(0, 0, 0, 0);
            next.setTime(next.getTime() + ntOffsetMs);
            const nowNT = new Date()
            nowNT.setTime(nowNT.getTime() - ntOffsetMs);
            while (nowNT.getTime() > next.getTime() + 86400000 || last > next.getTime()) next.setFullYear(next.getFullYear() + 1);
            const timeLeft = Math.round((next.getTime() - Date.now()) / 1000);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        cooldown: (key, last, minutes) => {
            minutes = +minutes;
            if (!Number.isInteger(minutes) || minutes <= 0) return NaN;

            const next = last + 60000 * minutes;
            const timeLeft = Math.round((next - Date.now()) / 1000);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        hoursAvailable: (key, last, hours) => {
            // Used by events that are available only during specific hours
            // Like Snowager, or Deadly Dice
            // Pass it an array of valid hours (in NT), like [6, 14, 22] for Snowager
            if (!Array.isArray(hours) || !hours.every(h => Number.isInteger(h) && h >= 0 && h <= 23) || hours.length === 0) return NaN;

            const nowNT = new Date()
            nowNT.setTime(nowNT.getTime() - ntOffsetMs);
            let hour = nowNT.getHours();
            if (hours.includes(hour) && Date.now() - last < 3600000) hour = (hour + 1) % 24;
            while (!hours.includes(hour)) hour = (hour + 1) % 24;
            const hourChange = (hour - nowNT.getHours() + 24) % 24; // +24 because javascript modulus not guaranteed to be positive
            const next = new Date().setMinutes(0, 0, 0) + 3600000 * hourChange;
            const timeLeft = Math.round((next - Date.now()) / 1000);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        or: (key, last, checks) => {
            if (!Array.isArray(checks) || checks.length === 0) return NaN;

            let results;
            try {
                results = checks.map(check => availabilityCheckers[check[0]](key, last, ...check[1]));
            } catch {
                return NaN;
            }
            const timeLeft = Math.min(...results);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        and: (key, last, checks) => {
            if (!Array.isArray(checks) || checks.length === 0) return NaN;

            let results;
            try {
                results = checks.map(check => availabilityCheckers[check[0]](key, last, ...check[1]));
            } catch {
                return NaN;
            }
            const timeLeft = Math.max(...results);
            //console.error(`${key} has ${formatS(timeLeft)} left`);
            return timeLeft;
        },

        not: (key, last, check) => {
            let result;
            try {
                result = availabilityCheckers[check[0]](key, last, ...check[1]);
            } catch {
                return NaN;
            }
            return result < 0 ? 1 : -1;
        },
    }

    // Creates the bookmarks-container div
    function buildBookmarksDiv(top) {
        // Classes and IDs I added myself all include the word 'bookmarks'
        // All other classes and IDs match exactly those that Neopets uses, to use their CSS

        // Container
        // Will contain the button and the dropdown
        const bookmarksDiv = document.createElement('div');
        bookmarksDiv.className = `nav-dropdown-button bookmarks-container-${id}`;
        // Must set this here, inline, and not in CSS, so
        // it may be hidden when the search button is clicked
        bookmarksDiv.style.display = 'inline-block';

        // Button includes the icon, text, and arrow
        const buttonDiv = document.createElement('div');
        buttonDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showContextMenu([
                { label: 'Edit', action: openSettingsPopup },
            ], e.pageX, e.pageY);
        });
        buttonDiv.className = 'nav-button bookmarks-button';
        buttonDiv.style.display = '';
        buttonDiv.tabIndex = 0;
        if (top) buttonDiv.setAttribute('onclick', `toggleDropdownArrow('bookmarks_arrow_${id}');toggleNavDropdown__2020(bookmarks_dropdown_${id});`);
        else buttonDiv.setAttribute('onclick', `toggleNavDropdownBottom__2020(bookmarks_dropdown_bottom_${id});`);
        // Allows activating button with enter after selecting with tab
        buttonDiv.addEventListener('keydown', e => {
            if (e.key === 'Enter') buttonDiv.click();
        });
        buttonDiv.addEventListener('click', e => {
            populateDropdown();
        });

        const iconDiv = document.createElement('div');
        iconDiv.className = 'nav-link-icon bookmarks-icon';

        const textDiv = document.createElement('div');
        textDiv.className = 'nav-text__2020';
        textDiv.textContent = data.text;

        const arrowDiv = document.createElement('div');
        arrowDiv.id = `bookmarks_arrow_${id}`;
        arrowDiv.className = 'nav-dropdown-arrow__2020';

        buttonDiv.appendChild(iconDiv);
        buttonDiv.appendChild(textDiv);
        buttonDiv.appendChild(arrowDiv);
        bookmarksDiv.appendChild(buttonDiv);

        /// Dropdown
        const dropdown = document.createElement('div');
        dropdown.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu([
                { label: showInactive ? 'Hide inactive' : 'Show inactive', action: () => {showInactive = !showInactive; populateDropdown();} },
                { label: 'Undo', action: undo },
                { label: 'Redo', action: redo },
                { label: 'New link', action: openEditPopup },
                { label: 'Reset timers', action: resetTimers },
                { label: data.manualSort ? 'Swap to time sort' : 'Swap to manual sort', action: toggleSortType },
            ], e.pageX, e.pageY);
        });

        if (top) dropdown.id = `bookmarks_dropdown_${id}`;
        else dropdown.id = `bookmarks_dropdown_bottom_${id}`;
        dropdown.className = `nav-dropdown__2020 nav-toggle-dropdown__2020 bookmarks-dropdown-${id} `;
        if (!top) dropdown.className += 'nav-dropdown-bottom__2020 ';
        dropdown.style.display = 'none';
        dropdown.addEventListener('click', e=>{const a=e.target.closest('a.bm-link'); if(a){e.preventDefault(); e.stopImmediatePropagation();}}, true);
        dropdown.addEventListener('auxclick', e=>{const a=e.target.closest('a.bm-link'); if(a){e.preventDefault(); e.stopImmediatePropagation();}}, true);
        bookmarksDiv.appendChild(dropdown);

        // Context menu
        if (top) createContextMenu();

        return bookmarksDiv;
    }

    // === Populate dropdown ===
    async function populateDropdown(firstRun = false, force = false) {
        let dropdown;
        if (window.innerWidth > 824) dropdown = document.getElementById(`bookmarks_dropdown_${id}`);
        else dropdown = document.getElementById(`bookmarks_dropdown_bottom_${id}`)
        if (!dropdown) return;
        if (!firstRun && !dropdown.getClientRects().length) return; // Dropdown not opened

        data = await GM.getValue('data') ?? defaultData;
        links = data.links;

        const dropdownDiv = document.createElement('div');
        dropdownDiv.className = 'dropdown-container';

        const nonEmpty = processLinks();

        // Changes the icon of the Bookmarks button if a special event is active
        setBookmarksButtonIcon(nonEmpty);

        for (const header in nonEmpty) {
            const col = nonEmpty[header];
            const ul = document.createElement('ul');
            ul.className = 'bookmarks-column';
            if (data.headers[header].hidden) ul.className += ' hidden-column';
            ul.style.width = `${data.columnWidth}px`;

            // Header
            const headerA = document.createElement('a');
            const headerLi = document.createElement('li');
            headerLi.className = 'header';
            const h4 = document.createElement('h4');
            headerA.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showContextMenu([
                    { label: header, labelOnly: true },
                    ...(allowOpenAllInNewTab ? [{ label: 'Open all active in new tabs', action: () => openAllActive(col) }] : []),
                    { label: 'Rename', action: () => renameHeader(header) },
                    { label: 'Move left', action: () => moveHeader(header, true) },
                    { label: 'Move right', action: () => moveHeader(header, false) },
                    { label: data.headers[header].open ? 'Collapse' : 'Expand', action: () => toggleHeader(header) },
                    { label: data.headers[header].hidden ? 'Unhide category' : 'Hide category', action: () => toggleColumnVisibility(header) },
                    { label: 'Delete', action: () => deleteColumn(header) },
                ], e.pageX, e.pageY);
            });
            h4.textContent = header;
            headerLi.appendChild(h4);
            headerA.appendChild(headerLi);
            ul.appendChild(headerA);

            if (!data.headers[header].open) {
                ul.appendChild(document.createElement('a'));
                dropdownDiv.appendChild(ul);
                continue;
            }
            // Links
            col.links.forEach(link => {
                const a = document.createElement('a');
                a.className = 'bm-link';
                a.href = link.url;
                a.title = link.name;
                a.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showContextMenu([
                        { label: link.name, labelOnly: true },
                        { label: 'Open in new tab', action: () => clickLink(link, true) },
                        { label: 'Open in new tab without updating', action: () => openUrl(link.url, true) },
                        { label: link.enabled ? 'Disable' : 'Enable', action: () => toggleEnabled(link.key) },
                        { label: 'Edit', action: () => openEditPopup(link) },
                        { label: 'Delete', action: () => deleteLink(link) },
                        { linkNavigation: data.manualSort, link: link.key },
                    ], e.pageX, e.pageY);
                });
                a.addEventListener('mouseup', (e) => {
                    if (e.button === 0) return clickLink(link); // Left click
                    if (e.button === 1) return clickLink(link, true); // Middle click
                    if (e.button === 2) return; // Right click
                });

                const li = document.createElement('li');
                if (link.checkVal < 0 && link.enabled && link.panic) li.className = 'bm-panic';
                if (!link.enabled) li.className = 'bm-disabled';
                if (Number.isNaN(link.checkVal)) li.className = 'bm-error';

                const iconDiv = document.createElement('div');
                iconDiv.className = 'bookmarks-link-icon';
                iconDiv.style.background = `url(${link.icon}) center center no-repeat`;
                iconDiv.style.backgroundSize = 'contain';
                li.appendChild(iconDiv);

                const h4 = document.createElement('h4');

                const span = document.createElement('span');
                span.textContent = link.name;
                if (showInactive && link.checkVal > 0) span.textContent = formatS(link.checkVal);
                if (showInactive && !link.enabled) span.textContent = 'Disabled';
                if (Number.isNaN(link.checkVal)) span.textContent = 'Error';

                h4.appendChild(span);
                li.appendChild(h4);
                a.appendChild(li);
                ul.appendChild(a);
            });
            // This last <a> is just to foil a Neopets CSS rule that removes the final bottom border
            ul.appendChild(document.createElement('a'));
            dropdownDiv.appendChild(ul);
        }

        // Add on the bottom options list
        const optionsUl = defineOptionsUl();
        dropdownDiv.appendChild(optionsUl);

        // Scale width to number of columns
        const numCols = Object.keys(nonEmpty).length || 1;
        dropdownDiv.style.width = (data.columnWidth * numCols + 4) + 'px'; // + 4 for the border width
        dropdown.style.width = Math.min((data.columnWidth * numCols + 4), window.innerWidth) + 'px'; // + 4 for the border width
        // Only allow horizontal scrolling if it's necessary
        // Otherwise it allows scrolling even when it's not relevant for some reason - HTML whitespace?
        dropdown.style.overflowX = (dropdownDiv.style.width !== dropdown.style.width) ? 'auto' : 'hidden';
        if (numCols === 0 || numCols === 1) {
            // Remove the spacer in the options - when there are this few columns the options just barely all fit
            optionsUl.removeChild(optionsUl.children[2]);
        }



        // Position the dropdown properly to avoid overflow, etc
        moveDropdown(dropdown);

        // Add scroll animation for link names which are too long
        document.querySelectorAll(`.bookmarks-dropdown-${id} ul:not(.bookmarks-options) a li:not(.header)`).forEach(li => {
            const h4 = li.querySelector('h4');

            const span = h4.querySelector('span');
            if (!span) return;

            const overflow = span.scrollWidth - h4.clientWidth;
            if (overflow <= 0) return;

            const scrollDuration = overflow / 30; // 30px/sec
            const pause = 1; // seconds
            const totalDuration = scrollDuration + pause * 2;

            const startPct = (pause / totalDuration) * 100;
            const endPct = ((pause + scrollDuration) / totalDuration) * 100;

            const matchingH4 = [...dropdownDiv.querySelectorAll('h4')].find(dH4 => dH4.textContent === h4.textContent);

            if (!matchingH4) return;

            matchingH4.className = 'marquee';
            const matchingSpan = matchingH4.querySelector('span');
            if (!matchingSpan) return;

            // Create a unique keyframe for this text
            const keyframeName = 'marquee-' + h4.textContent.replace(/\s+/g,'-').replace(/[^a-zA-Z0-9-_]/g,'');
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ${keyframeName} {
                    0%, ${startPct}% { transform: translateX(0); }
                    ${endPct}%, 100% { transform: translateX(-${overflow}px); }
                }
            `;
            document.head.appendChild(style);

            matchingSpan.style.display = 'inline-block';
            matchingSpan.style.animation = `${keyframeName} ${totalDuration}s linear infinite`;

        });

        // Remove existing dropdownDiv
        const existing = dropdown.querySelector('.dropdown-container');
        if (existing) {
            if (existing.innerHTML === dropdownDiv.innerHTML && !force) return;
            existing.remove();
        }
        dropdown.appendChild(dropdownDiv);
    }

    function toggleSortType() {
        data.manualSort = !data.manualSort;
        GM.setValue('data', data).then(populateDropdown);
    }

    function toggleColumnVisibility(column) {
        data.headers[column].hidden = !data.headers[column].hidden;
        GM.setValue('data', data).then(populateDropdown);
    }

    function resetTimers() {
        for (const link of Object.values(links)) {
            delete link.last;
        }
        GM.setValue('data', data);
        populateDropdown();
    }

    function defineOptionsUl() {
        const optionsUl = document.createElement('ul');
        optionsUl.className = 'bookmarks-options';

        // Add link button
        const addLinkA = document.createElement('a');
        const addLinkLi = document.createElement('li');
        addLinkA.href = '#';
        addLinkA.title = 'Add a new link';
        addLinkA.addEventListener('click', e => {
            e.preventDefault();
            openEditPopup();
        });
        addLinkLi.textContent = '➕';
        addLinkA.appendChild(addLinkLi);
        optionsUl.appendChild(addLinkA);
        // ↺ ↻

        // Show inactive checkbox
        const toggleActiveA = document.createElement('a');
        const toggleActiveLi = document.createElement('li');
        toggleActiveA.href = '#';
        toggleActiveA.addEventListener('click', e => {
            e.preventDefault();
            showInactive = !showInactive;
            populateDropdown();
        });
        toggleActiveLi.textContent = '👁️';
        toggleActiveA.title = 'Hide inactive links';
        if (!showInactive) {
            toggleActiveA.title = 'Show inactive links';
            // Makes a diagonal red strikethrough through the eye
            toggleActiveLi.style.position = 'relative';
            const line = document.createElement('div');
            line.className = 'bm-strikethrough';
            toggleActiveLi.appendChild(line);
        }
        toggleActiveA.appendChild(toggleActiveLi);
        optionsUl.appendChild(toggleActiveA);

        // Spacer between left+right options
        const spacerLi = document.createElement('li');
        // Remove hover effect and hover cursor from spacer element
        spacerLi.style.background = 'transparent';
        spacerLi.style.cursor = 'default';
        optionsUl.appendChild(spacerLi);

        // Export values button
        const exportA = document.createElement('a');
        const exportLi = document.createElement('li');
        exportA.href = '#';
        exportA.addEventListener('click', async (e) => {
            e.preventDefault();
            exportData();
        });
        exportLi.textContent = 'Export';
        exportA.appendChild(exportLi);
        optionsUl.appendChild(exportA);

        // Import values button
        const importA = document.createElement('a');
        const importLi = document.createElement('li');
        importA.href = '#';
        importA.addEventListener('click', async (e) => {
            e.preventDefault();
            importData();
        });
        importLi.textContent = 'Import';
        importA.appendChild(importLi);
        optionsUl.appendChild(importA);

        return optionsUl
    }

    async function exportData() {
        const exportData = btoa(JSON.stringify({ data })).replace(/\//g, '_').replace(/=+$/, '');
        if (data.kvdbBucket && data.kvdbBucket !== '') {
            const kvdbUrl = `https://kvdb.io/${data.kvdbBucket}/NeopetsDynamicBookmarksPaneExportData${data.id}`;
            try {
                const res = await fetch(kvdbUrl, {
                    method: 'POST',
                    body: exportData
                });

                if (res.ok) {
                    alert('Successfully uploaded export data to kvdb.io bucket.');
                } else {
                    alert(`Failed to upload to kvdb.io bucket, with HTTP response ${res.status}. Copied data to system clipboard instead.`);
                    GM.setClipboard(exportData);
                }
            } catch (err) {
                console.error('Network error:', err);
            }
        } else {
            GM.setClipboard(exportData);
            alert('Export data copied to clipboard.');
        }
    }

    async function importData() {
        let input;
        if (data.kvdbBucket && data.kvdbBucket !== '') {
            const kvdbUrl = `https://kvdb.io/${data.kvdbBucket}/NeopetsDynamicBookmarksPaneExportData${data.id}`;
            try {
                const kvdbRes = await fetch(kvdbUrl, { method: 'GET', cache: 'no-store' });
                if (!kvdbRes.ok) {
                    alert(`Failed to import from kvdb with HTTP response code ${kvdbRes.status}.`);
                    return;
                }
                input = await kvdbRes.text(); // full page HTML/text is now in kvdbContents
                if (input === '') {
                    alert('kvdb bucket was empty, not importing.');
                    return;
                }
            } catch (err) {
                return;
            }
        } else {
            input = prompt('Paste export data here:');
        }
        if (!input) return alert('No data given - not importing.');
        const raw = input.replace(/_/g, '/');
        if (!raw) return alert('No data given - not importing.');

        let importData;
        try {
            importData = JSON.parse(atob(raw));
        } catch {
            return alert('Invalid JSON.');
        }

        if (typeof importData !== 'object' || importData === null || Array.isArray(importData)) {
            return alert('Invalid import data.');
        }
        if ('data' in importData) {
            setData(importData.data);
        }
        else return alert('Invalid import data.');

        populateDropdown();
    }

    function toggleButton() {
        const bookmarksDiv = document.querySelector(`.nav-dropdown-button.bookmarks-container-${id}`);
        if (bookmarksDiv.getClientRects().length) bookmarksDiv.style.display = 'none';
        else bookmarksDiv.style.display = 'inline-block';
    }

    // Formats totalSec seconds into a timestamp representing that many seconds, like '8h42m33s'
    function formatS(totalSec) {
        const neg = totalSec < 0;
        totalSec = Math.abs(totalSec);
        const days = Math.floor(totalSec / 86400);
        totalSec %= 86400;
        const hours = Math.floor(totalSec / 3600);
        totalSec %= 3600;
        const minutes = Math.floor(totalSec / 60);
        const seconds = totalSec % 60;

        const pad = (n) => n.toString().padStart(2, '0');

        if (days > 0) return `${neg ? '-' : ''}${days}d${pad(hours)}h${pad(minutes)}m${pad(seconds)}s`;
        return `${neg ? '-' : ''}${hours}h${pad(minutes)}m${pad(seconds)}s`;
    }

    function processLinks(colsOnly = false) {
        // Makes sure each column is in the correct order
        const columns = Object.fromEntries(
            Object.entries(data.headers)
            .sort(([a, ], [b, ]) => data.headerOrder.indexOf(a) - data.headerOrder.indexOf(b))
            .map(([key]) => [key, { links: [], order: data.headers[key].order, hidden: data.headers[key].hidden }])
        );
        for (const link of Object.values(links)) {
            if (!colsOnly) link.checkVal = availabilityCheckers[link.checkType](link.key, link.last ?? 0, ...link.params);
            // if link is inactive or has an error or is disabled, and we're not showing inactive links, then skip
            if ((link.checkVal > 0 || Number.isNaN(link.checkVal) || !link.enabled) && !showInactive) continue;
            columns[link.header].links.push(link);
        }
        for (const header in columns) {
            // Remove empty columns and hidden columns (unless showing all)
            if (columns[header].links.length === 0 || (columns[header].hidden && !showInactive)) {
                delete columns[header];
                continue;
            }
            if (colsOnly) continue;
            // Sort links in columns
            if (data.manualSort) {
                columns[header].links.sort((a, b) => {
                    const posA = columns[header].order.indexOf(a.key);
                    const posB = columns[header].order.indexOf(b.key);
                    return posA - posB;
                });
            } else {
                columns[header].links.sort((a, b) => {
                    const getSortVal = link => Number.isNaN(link.checkVal) ? 2 : !link.enabled ? 1 : 0;
                    const va = getSortVal(a), vb = getSortVal(b);
                    if (va !== vb) return va - vb; // NaN last, inactive next, normal first

                    if (a.checkVal !== b.checkVal) return a.checkVal - b.checkVal;

                    // fallback: manual order
                    const posA = columns[header].order.indexOf(a.key);
                    const posB = columns[header].order.indexOf(b.key);
                    return posA - posB;
                });
            }
        }
        if (colsOnly) return Object.keys(columns);
        return columns;
    }

    function moveLink(linkToMoveKey, up = false, down = false, left = false, right = false) {
        // Only allow moving in exactly one direction at a time
        if ((up + down + left + right) !== 1) return;
        const linkToMove = links[linkToMoveKey];
        if (up || down) { // Move the link up or down the current column
            // Current column's links list
            const linksArr = data.headers[linkToMove.header].order;
            const pos = linksArr.indexOf(linkToMove.key);
            if (pos === -1) return; // not found, bail
            if ((pos === 0 && up) || (pos === linksArr.length - 1 && down)) return; // Already where it needs to be
            const dir = up ? -1 : 1;
            let newPos = pos + dir;
            while (newPos >= 0 && newPos < linksArr.length) {
                const link = links[linksArr[newPos]];
                if ((link.enabled && link.checkVal < 0) || showInactive) break;
                newPos += dir;
            }
            if (newPos < 0 || newPos >= linksArr.length) return;
            linksArr.splice(pos, 1);
            linksArr.splice(newPos, 0, linkToMove.key);
        } else { // Left or right
            const columns = processLinks();
            const columnKeys = Object.keys(columns);
            const colPos = columnKeys.indexOf(linkToMove.header);
            if ((left && colPos === 0) || (right && colPos === columnKeys.length - 1)) return;
            const dir = left ? -1 : 1;
            const oldCol = data.headers[linkToMove.header];
            const newCol = data.headers[columnKeys[colPos + dir]];
            const oldI = oldCol.order.indexOf(linkToMove.key);
            let newI = columns[oldCol.name].links; // The visible links in the old column
            newI = newI.findIndex(link => link.key === linkToMove.key); // The index of this link in the old column, amongst visible links
            if (newI < columns[newCol.name].links.length) {
                newI = columns[newCol.name].links[newI].key; // The key of the corresponding visible item in the same row, in the new column
                newI = newCol.order.indexOf(newI); // The actual index of that corresponding item, including hidden links
                if (newI === -1) return;
            } else {
                newI = columns[newCol.name].links[ columns[newCol.name].links.length - 1 ].key;
                newI = newCol.order.indexOf(newI) + 1;
            }
            links[linkToMove.key].header = newCol.name;
            oldCol.order.splice(oldI, 1);
            newCol.order.splice(newI, 0, linkToMove.key);
        }
        GM.setValue('data', data).then(populateDropdown);
    }

    function setBookmarksButtonIcon() {
        const iconDiv1 = document.querySelector(`.bookmarks-container-${id} .bookmarks-icon`);
        const iconDiv2 = document.querySelector(`.bookmarksButtonsBottom .bookmarks-container-${id} .bookmarks-icon`);
        iconDiv1.style.background = `url(${data.icon}) center center no-repeat`;
        if (iconDiv2) iconDiv2.style.background = `url(${data.icon}) center center no-repeat`;
        for (const link of Object.values(links)) {
            if (link.panic && link.enabled && link.checkVal < 0) {
                iconDiv1.style.background = `url(${data.panicIcon}) center center no-repeat`;
                if (iconDiv2) iconDiv2.style.background = `url(${data.panicIcon}) center center no-repeat`;
            }
        }
        iconDiv1.style.backgroundSize = 'contain'
        if (iconDiv2) iconDiv2.style.backgroundSize = 'contain'
    }

    function moveDropdown(dropdown) {
        // Resize the dropdown if it's too small for its contents
        const widthDeficit = parseInt(dropdown.style.width) - 4 - dropdown.clientWidth;
        if (widthDeficit > 0) dropdown.style.width = `${parseInt(dropdown.style.width) + widthDeficit}px`;
        // Adjust the dropdown horizontal position to account for overflow or underflow
        const parentRect = dropdown.parentElement.getBoundingClientRect();
        // Better than using its rectangle because it's valid even when dropdown is not visible
        const dropdownWidth = parseInt(dropdown.style.width);

        if (dropdown.id === `bookmarks_dropdown_${id}`) {
            let left; // Position is relative to its parent div
            if (parentRect.left + dropdownWidth <= document.documentElement.clientWidth) {
                // No overflow issues, line up left of menu with left of button
                left = 0;
            } else if (dropdownWidth <= document.documentElement.clientWidth) {
                // Overflow issues, but no risk of underflow: Move left so
                // right edge of dropdown matches up with right edge of window
                left = document.documentElement.clientWidth - dropdownWidth - parentRect.left;
            } else {
                // Overflow issues, and the dropdown is too large to fit in the window at all
                // Just line its left edge up with the left edge of the window, and let it
                // overflow freely on the right
                left = -parentRect.left;
            }
            dropdown.style.left = `${left}px`;
        } else if (dropdown.id === `bookmarks_dropdown_bottom_${id}`) {
            let left = -(dropdownWidth - parentRect.width)/2;
            if (parentRect.left + left < 0) left = -parentRect.left;
            dropdown.style.left = `${left}px`;
        }
    }

    const StyleManager = (() => {
        const styles = {
            button: `
                /* Container holding button & dropdown - keeps it positioned properly + sets font */
                .bookmarksButtons, .bookmarksButtonsBottom {
                    margin-left: auto !important;
                    font-family: "Cafeteria", 'Arial Bold', sans-serif;
                }
                .nav-dropdown-button.bookmarks-container-${id} {
                    margin-left: 5px !important;
                    font-family: "Cafeteria", 'Arial Bold', sans-serif;
                    height: 100%;
                }
                /* Set size of bookmarks icon div */
                .bookmarks-container-${id} .nav-link-icon.bookmarks-icon {
                    background: url(${data.icon}) center center no-repeat;
                    background-size: contain;
                    height: 40px;
                    width: 50px;
                }

                .bookmarks-container-${id} div.bm-strikethrough {
                    position: absolute;
                    top: 50%;
                    left: 20%;
                    width: 80%;
                    height: 3px;
                    background-color: red;
                    transform: rotate(-35deg);
                    transform-origin: center;
                }
            `,
            dropdown: `
                .bookmarks-container-${id} .bookmarks-dropdown-${id} ul li:not(.header) h4 {
                    white-space: nowrap;
                    text-align: left;
                    overflow: hidden;
                    display: block;
                }
                .bookmarks-container-${id} .bookmarks-dropdown-${id} ul li h4 {
                    background-color: rgba(0, 0, 0, 0) !important;
                }
                .bookmarks-container-${id} .bookmarks-dropdown-${id} ul li:not(.header) h4.marquee span {
                    display: inline-block;
                }
                @keyframes marquee {
                    0%, var(--scroll-start) { transform: translateX(0); }
                    var(--scroll-end), 100% { transform: translateX(var(--translate-x)); }
                }

                /* Styles for each column of the dropdown */
                .bookmarks-container-${id} ul.bookmarks-column {
                    float: left;
                    padding: 0px;
                    margin: 0px;
                    font-family: "Cafeteria", 'Arial Bold', sans-serif;
                    font-size: 13pt;
                }
                .bookmarks-container-${id} ul.hidden-column {
                    filter: grayscale(100%);
                    background-color: gainsboro;
                }
                /* Styles for dropdown column headers */
                .bookmarks-container-${id} ul.bookmarks-column li.header {
                    text-transform: uppercase;
                    pointer-events: none;
                    white-space: nowrap;
                    cursor: not-allowed !important;
                }

                /* Distinctive background colors for inactive and error links */
                .bookmarks-container-${id} ul.bookmarks-column li.bm-disabled {
                    filter: grayscale(100%);
                    background-color: #bbbbbb;
                }
                .bookmarks-container-${id} ul.bookmarks-column li.bm-error {
                    background-color: #cc7777;
                }

                /* Flash background of panicking links red */
                .bookmarks-container-${id} ul.bookmarks-column li.bm-panic {
                    animation: ping-bg 1.3s infinite;
                }
                @keyframes ping-bg {
                    0%   { background-color: inherit; }
                    10%  { background-color: red; }
                    100% { background-color: inherit; }
                }

                /* Reset positioning set by Neopets so we can handle ourselves easier. */
                .bookmarks-container-${id} .nav-dropdown__2020.bookmarks-dropdown-${id} {
                    margin-left: 0px;
                }
                /* Remove all bottom borders on our options <ul> */
                .bookmarks-container-${id} .nav-dropdown__2020 ul.bookmarks-options li {
                    border-bottom: none !important;
                }
                /* Size of each link icon */
               .bookmarks-container-${id}  .bookmarks-link-icon {
                    width: 30px;
                    height: 30px;
                }
                /* Styles for options div - makes it full width so it appears at
                the bottom, and flex so its <li>s appear side-by-side */
                .bookmarks-container-${id} .bookmarks-options {
                    display: flex;
                    width: 100% !important;
                    font-size: 13pt;
                    padding: 0px;
                    margin: 0px;
                }
                /* Styles for options */
                .bookmarks-container-${id} .bookmarks-options li {
                    display: flex !important;
                    height: 100%;
                    white-space: nowrap;
                }
            `,
            contextMenu: `
                /* Styles for context menu */
                #bookmarks_context_menu {
                    position: absolute;
                    background: #fff;
                    border: 1px solid #d4b106;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
                    display: none;
                    z-index: 2147483648;
                    font-family: sans-serif;
                    font-size: 14px;
                    user-select: none;
                    padding: 4px 0;
                }
                #bookmarks_context_menu ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                #bookmarks_context_menu li {
                    padding: 6px 20px;
                    cursor: default;
                    text-align: left;
                    white-space: nowrap;
                }
                #bookmarks_context_menu li:hover {
                    background: #ffe066;
                    color: #5a4000;
                }
                #bookmarks_context_menu li.bm-context-label {
                    font-weight: bold;
                    cursor: default;
                    background: transparent;
                    color: #333;
                }
                #bookmarks_context_menu li.bm-context-label:hover {
                    background: transparent; /* no highlight */
                }
            `,
            settings: `
                .bm-form {
                    --max-w:760px;
                    --gap:8px;
                    --pad:8px;
                    --input-h:34px;
                    --muted:#6b7280;
                    --border:#e3e6ea;
                    --accent:#0ea5a3;
                    --bg:#eee;
                    --radius:8px;
                    --font:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial;
                }
                .bm-form {
                    text-align: left;
                    max-width:var(--max-w);
                    margin:8px auto;
                    padding:10px;
                    font-family:var(--font);
                    color:#0b1220;
                    font-size:13px;
                    background:transparent;
                }
                .bm-row {
                    margin-bottom:10px;
                    display:block;
                }
                /* compact label above input, tight spacing */
                .bm-row label { display:block; font-weight:600; margin-bottom:6px; font-size:13px; }
                .bm-row input[type="text"],
                .bm-row select {
                    width:100%;
                    height:var(--input-h);
                    padding:6px 8px;
                    box-sizing:border-box;
                    border-radius:6px;
                    border:1px solid var(--border);
                    background:var(--bg);
                    font-size:13px;
                    outline: none;
                }
                .bm-row input[type="text"]::placeholder { color:#9aa3ab; }

                /* reserved wrappers to prevent jump when inner elements are hidden by JS */
                .reserved { width:100%; min-height:54px; display:flex; align-items:flex-start; box-sizing:border-box; padding-top:6px; }
                .reserved--small { min-height:48px; }

                /* Check Type + extras grouped visually */
                .group {
                    border-left:3px solid rgba(14,165,163,0.08);
                    padding-left:10px;
                    margin-top:6px;
                    display:flex;
                    flex-direction:column;             /* stacked vertically (each extra on its own row) */
                    gap:8px;
                    width:100%;
                    box-sizing:border-box;
                }

                /* ensure each extra wrapper looks identical and stacks input + small text */
                #bm_edit_extra_wrapper_1,
                #bm_edit_extra_wrapper_2 {
                    width:100%;
                    display:flex;
                    flex-direction:column;
                    gap:6px;
                    box-sizing:border-box;
                }
                #bm_edit_extra_wrapper_1 input,
                #bm_edit_extra_wrapper_2 input {
                    width:100%;
                    height:var(--input-h);
                    padding:6px 8px;
                    border-radius:6px;
                    border:1px solid var(--border);
                    box-sizing:border-box;
                    background:var(--bg);
                }
                #bm_edit_extra_info_1,
                #bm_edit_extra_info_2 {
                    color:#666;
                    font-size:12px;
                    line-height:1.2;
                    margin-top:2px;
                    min-height:16px;
                }

                /* Icon row: preview + input; improved fallback centering */
                .icon-row { display:flex; align-items:center; gap:8px; margin-top:6px; }
                .icon-box {
                    width:30px; height:30px; border-radius:4px; background:#fff;
                    display:inline-flex; align-items:center; justify-content:center;
                    border:1px solid #111; flex:0 0 30px; position:relative; overflow:hidden;
                }
                /* Keep the <img id="bm_edit_icon_preview"> exactly as-is (ID preserved).
                     When its src is empty, hide the image and show the fallback .icon-fallback. */
                .icon-box img { width:100%; height:100%; object-fit:contain; display:block; }
                .icon-box img[src=""] { visibility:hidden; }                             /* empty src => hide img */
                .icon-box .icon-fallback { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:14px; color:#666; pointer-events:none; }
                .icon-box img:not([src=""]) + .icon-fallback { display:none; } /* hide fallback when img has src */

                /* small helper text */
                small { color:#666; display:block; margin-top:6px; font-size:12px; }

                /* active/checkbox + action row */
                .controls-inline { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-top:8px; }
                .controls-inline .left { flex:1; }
                .controls-inline .right { white-space:nowrap; }

                .controls-inline .right button {
                    height:34px; padding:6px 12px; border-radius:6px; border:1px solid var(--border);
                    background:var(--accent); color:#fff; font-weight:600; cursor:pointer;
                }
                .controls-inline .right button[disabled] { opacity:0.6; cursor:not-allowed; }

                @media (max-width:640px){
                    .controls-inline { flex-direction:column; align-items:stretch; gap:8px; }
                    .icon-row { align-items:flex-start; }
                    .group { gap:6px; }
                }
            `,
            newSite: `
                @media screen and (min-width: 825px) and (max-width: 1179px) {
                    .bookmarks-container-${id} .nav-link-icon.bookmarks-icon {
                        min-width: 32px;
                        width: 100%;
                        height: 32px;
                        margin-top: 3px;
                    }
                }
                @media screen and (max-width: 824px) {
                    .nav-top-grid__2020 .nav-button.bookmarks-button {
                        display: none;
                    }
                    .bookmarksButtons {
                        display: none;
                    }
                    .bookmarks-container-${id} #bookmarks_arrow_${id} {
                        display: none;
                    }
                    .bookmarksButtonsBottom {
                        grid-column: 1/2;
                    }
                    .bookmarks-container-${id} .nav-link-icon.bookmarks-icon {
                        min-width: 32px;
                        width: 100%;
                        height: 32px;
                    }
                }
                @media screen and (min-width: 825px) {
                    .bookmarksButtons {
                        grid-column: 1/2;
                    }
                }
            `,
        };

        function inject(name) {
            if (!styles[name]) return;
            const style = document.createElement('style');
            style.textContent = styles[name];
            document.head.appendChild(style);
        }

        function oldSite() {
            // Following bits pull colors from the page to use for theming the dropdown
            // Best choices for colors was chosen experimentally - these options work surprisingly well for almost all themes
            // bg color is color of the dropdowns on the nav bar
            const bgColor = window.getComputedStyle(document.querySelector('li.nav_image ul.dropdown')).getPropertyValue('background-color');
            // highlight color is the unseen, always-covered background color of the #header, behind the nav bar
            const highlightColor = window.getComputedStyle(document.getElementById('header')).getPropertyValue('background-color');
            // Border color defaults to the link color, but this is rarely the same color as bgColor
            const borderColor1 = window.getComputedStyle(document.querySelector('a')).getPropertyValue('color');
            const borderColor2 = window.getComputedStyle(document.getElementById('header')).getPropertyValue('border-bottom-color');
            let borderColor;
            if (borderColor1 === bgColor) borderColor = borderColor2;
            else borderColor = (borderColor2 !== 'rgb(0, 0, 0)') ? borderColor2 : borderColor1;
            // When it's the bgColor too, change it to the bottom border color of the #header, which is often covered / not visible but is a good choice regardless
            //if (borderColor === bgColor) borderColor = window.getComputedStyle(document.querySelector('a')).getPropertyValue('color');
            // Attempts were made to find colors for the link text, but nothing worked consistently well, and #363636 looks good in pretty much any theme anyways
            styles.oldSite = `
                /* Prevent username, NP, NC, Logout from word wrapping */
                td.user.medText {
                    white-space: nowrap;
                }
                /* Positioning code relies on this */
                .bookmarks-container-${id} {
                    position: relative;
                }
                /* Styles for actual text div, keeps text centered and div full-size */
                .nav-text__2020 {
                    font-family: "Cafeteria", 'Arial Bold', sans-serif;
                    font-size: 13pt;
                    display: flex;
                    align-items: center;
                    height: 36px;
                }
                /* Size of the icon */
                .nav-link-icon {
                    height: 34px !important;
                }
                /* Keeps icon, text, and arrow horizontally laid out instead of vertically */
                .bookmarks-button {
                    display: flex;
                }
                /* Keeps the dropdown hidden on initial page load */
                .bookmarks-dropdown-${id} {
                    display: none;
                }
                a.bm-link:hover {
                    text-decoration: none;
                }
                /* Defines the font used by the menu text */
                @font-face {
                    font-family: "Cafeteria";
                    src: url(https://images.neopets.com/js/fonts/cafeteria-black.otf) format("opentype");
                }
                /* Styles for the dropdown itself */
                .nav-dropdown__2020 {
                    position: absolute;
                    text-align: left;
                    border-radius: 0 0 5px 5px;
                    overflow-y: unset;
                    box-sizing: border-box !important;
                    z-index: 9002;
                    background-color: ${bgColor};
                    color: #363636;
                    border: 2px solid ${borderColor};
                }
                /* Style for vertical scrollbar, if present */
                .nav-dropdown__2020::-webkit-scrollbar {
                    width: 0;
                }
                /* Styles for the link texts */
                .nav-dropdown__2020 ul li h4 {
                    margin: 5px 0;
                    letter-spacing: 0.5pt;
                    white-space: normal; /* Allows word wrap */
                    font-size: 13pt;
                }
                .nav-dropdown__2020 ul li.header h4 {
                    white-space: nowrap;
                }
                /* Styles for each cell of the dropdown */
                .nav-dropdown__2020 ul li {
                    cursor: pointer;
                    display: grid;
                    width: 100%;
                    grid-template-columns: 30px 1fr;
                    grid-gap: 10px;
                    align-items: center;
                    justify-content: center;
                    padding: 5px 5px 5px 10px;
                    box-sizing: border-box;
                    border-bottom: 2px solid ${borderColor};
                }
                /* Changes cell background color on hover */
                .nav-dropdown__2020 ul li:hover {
                    background-color: ${highlightColor};
                }
                /* Visited links don't change color */
                .nav-dropdown__2020 a, Reset.nav-dropdown__2020 a:visited {
                    color: #363636 !important;
                }
                /* Subtly rotates the button icon on hover */
                .nav-link-icon:hover {
                    transform: rotate(-10deg);
                }
                /* Sets display and animation parameters for dropdown arrow */
                .nav-dropdown-arrow__2020 {
                    background-image: url(https://images.neopets.com/themes/h5/basic/images/dropdown-arrow.svg);
                    width: 18px;
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    margin-left: 10px;
                    transition: all 0.25s;
                }
                /* Makes button elements grow slightly when hovered */
                .nav-button:hover {
                    transform: scale(1.1);
                    cursor: pointer;
                }
                /* Styles for the shade effect when menu is open */
                #bookmarks_shade_overlay_${id} {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.3);
                    z-index: 9001; /* just below dropdown */
                }
            `;
            inject('oldSite');
        }

        function init() {
            inject('button');
            inject('dropdown');
            inject('contextMenu');
            inject('settings');
        }

        init();

        return { inject, oldSite };
    })();

    let target;
    const topNavBar = document.querySelector('.nav-top-grid__2020');
    const botNavBar = document.querySelector('.nav-bottom__2020');
    if (topNavBar && botNavBar) { // 2020 redesign
        target = topNavBar.querySelector('div.nst.nav-top-nst');
        //if (!target) return; // I think this only happens on the login page
        const topCommunityDiv = topNavBar.querySelector('.nav-community__2020');
        const botCommunityDiv = botNavBar.querySelector('.nav-community__2020');
        const topBookmarksDiv = buildBookmarksDiv(true);
        const botBookmarksDiv = buildBookmarksDiv(false);
        let bookmarksButtonsDiv = document.querySelector('.bookmarksButtons');
        if (!bookmarksButtonsDiv) {
            bookmarksButtonsDiv = document.createElement('div');
            bookmarksButtonsDiv.className = 'nav-dropdown-button bookmarksButtons';
            topNavBar.insertBefore(bookmarksButtonsDiv, topCommunityDiv);
        }
        let bookmarksButtonsBottomDiv = document.querySelector('.bookmarksButtonsBottom');
        if (!bookmarksButtonsBottomDiv) {
            bookmarksButtonsBottomDiv = document.createElement('div');
            bookmarksButtonsBottomDiv.className = 'nav-dropdown-button bookmarksButtonsBottom';
            botNavBar.insertBefore(bookmarksButtonsBottomDiv, botCommunityDiv);
        }
        bookmarksButtonsDiv.appendChild(topBookmarksDiv);
        bookmarksButtonsBottomDiv.appendChild(botBookmarksDiv);
        populateDropdown(true);
        const searchButton = document.querySelector('.nav-search-icon__2020');
        if (searchButton) {
            searchButton.addEventListener('click', () => { toggleButton(); });
        }
        const searchButtonBack = document.getElementById('navSearchBack');
        if (searchButtonBack) {
            searchButtonBack.addEventListener('click', () => { toggleButton(); });
        }
        StyleManager.inject('newSite');
    } else { // Legacy website
        // The tr containing the td we want to insert before
        const targetTr = document.querySelector('div#header table tbody tr');
        if (!targetTr) return;

        StyleManager.oldSite();

        if (!targetTr) return;
        // The td we'll want to insert before, containing the username, neopoints, neocash, and logout button
        const targetTd = targetTr.querySelector('td.user.medText');

        // The td we will insert before targetTd
        const newTd = document.createElement('td');
        newTd.className = 'user medText';
        // The div containing our bookmarks pane button
        const bookmarksDiv = buildBookmarksDiv(true);
        newTd.appendChild(bookmarksDiv);
        targetTr.insertBefore(newTd, targetTd);

        // The nav td now has to span one more column
        const navTd = document.querySelector('td#navigation');
        if (navTd) navTd.colSpan += 1;


        // Remove the existing onclick, add our own
        const button = document.querySelector(`.bookmarks-container-${id} .nav-button.bookmarks-button`);
        button.removeAttribute('onclick');
        button.addEventListener('mouseup', () => {
            const dropdown = bookmarksDiv.querySelector(`.bookmarks-dropdown-${id}`);
            if (!dropdown) return;
            if (dropdown.style.display === 'block') hideDropdown();
            else showDropdown();
        });

        const shade = document.createElement('div');
        shade.id = `bookmarks_shade_overlay_${id}`;
        shade.addEventListener('click', hideDropdown);
        document.body.appendChild(shade);

        target = document.querySelector('td#nst');
        populateDropdown(true);
    }
    if (target) {
        // Updates the dropdown or sidebar whenever the NST clock changes
        // (once per second)
        const observer = new MutationObserver((arg) => {
            const time = arg[0].target.innerText.split(/[: ]/)[2];
            // '7:38:42 am NST' to ['7', '38', '42', 'am', 'NST']
            if (time == '00') populateDropdown(true);
            else populateDropdown();
        });
        observer.observe(target, { childList: true });
    }


    function showDropdown() {
        // Show shade, show dropdown, flip arrow
        populateDropdown();
        const shade = document.querySelector(`#bookmarks_shade_overlay_${id}`);
        if (shade) shade.style.display = 'block';
        const dropdown = document.querySelector(`.bookmarks-dropdown-${id}`);
        if (dropdown) dropdown.style.display = 'block';
        const arrow = document.querySelector(`#bookmarks_arrow_${id}`);
        if (arrow) arrow.style.transform = 'rotate(-180deg)';
    }

    function hideDropdown() {
        // Hide shade, hide dropdown, unflip arrow
        const shade = document.querySelector(`#bookmarks_shade_overlay_${id}`);
        if (shade) shade.style.display = 'none';
        const dropdown = document.querySelector(`.bookmarks-dropdown-${id}`);
        if (dropdown) dropdown.style.display = 'none';
        const arrow = document.querySelector(`#bookmarks_arrow_${id}`);
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }

    function openSettingsPopup() {
        // Remove any existing popup/shade
        document.querySelectorAll('.bm-edit-shade, .bm-settings-popup').forEach(el => el.remove());

        // Shade layer
        const shade = document.createElement('div');
        shade.className = 'bm-edit-shade';
        Object.assign(shade.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '9998'
        });
        document.body.appendChild(shade);

        // Popup
        const popup = document.createElement('div');
        popup.className = 'bm-settings-popup';
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ddd',
            padding: '20px',
            borderRadius: '10px',
            zIndex: '9999',
            width: '320px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            fontFamily: 'sans-serif'
        });

        popup.innerHTML = `
            <div class="bm-form">
                <div class="bm-row">
                    <label>Button Text:</label>
                    <input type="text" id="bm_btn_text" style="width:100%">
                </div>

                <div class="bm-row">
                    <label>Column Width:</label>
                    <div style="position: relative; width: 100%;">
                        <input type="number" min="100" max="350" step="1" id="bm_col_width" style="width:100%; padding-right: 2em;">
                        <span style="position: absolute; right: 0.5em; top: 50%; transform: translateY(-50%); pointer-events: none; color: #555;">px</span>
                    </div>
                    <small>Neopets default is 176px</small>
                </div>

                <div class="bm-row">
                    <label>kvdb.io Bucket ID:</label>
                    <input type="text" id="kvdb_text" style="width:100%">
                    <small>If a kvdb.io bucket ID is given here, the import/export buttons will read/write from/to it, instead of the system clipboard</small>
                </div>

                <div class="bm-row">
                    <label>Script ID:</label>
                    <input type="text" id="id_text" style="width:100%">
                    <small>The script's internal ID. If syncing with kvdb, this must be the same on all devices. Otherwise, you can just leave it. If you have multiple copies of this script, make sure this is different for every copy.</small>
                </div>

                <div class="bm-row">
                    <label>Button Icon:</label>
                    <div class="icon-row">
                        <div class="icon-box">
                            <img id="bm_btn_icon_preview" src="" alt="">
                            <span class="icon-fallback">❌</span>
                        </div>
                        <input type="text" id="bm_btn_icon" style="width:100%">
                    </div>
                </div>

                <div class="bm-row">
                    <label>Button Panic Icon:</label>
                    <div class="icon-row">
                        <div class="icon-box">
                            <img id="bm_btn_panic_icon_preview" src="" alt="">
                            <span class="icon-fallback">❌</span>
                        </div>
                        <input type="text" id="bm_btn_panic_icon" style="width:100%">
                    </div>
                </div>

                <div class="controls-inline" style="margin-top:6px">
                    <div class="left"></div>
                    <div class="right">
                        <button id="bm_btn_save" disabled style="margin-right:8px; cursor:not-allowed;">Save</button>
                        <button id="bm_btn_cancel">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        // Elements of the popup
        const btnTextInput = popup.querySelector('#bm_btn_text');
        const colWidthInput = popup.querySelector('#bm_col_width');
        const kvdbInput = popup.querySelector('#kvdb_text');
        const idInput = popup.querySelector('#id_text');
        const iconPreview1 = popup.querySelector('#bm_btn_icon_preview');
        const iconInput1 = popup.querySelector('#bm_btn_icon');
        const iconPreview2 = popup.querySelector('#bm_btn_panic_icon_preview');
        const iconInput2 = popup.querySelector('#bm_btn_panic_icon');
        const saveBtn = popup.querySelector('#bm_btn_save');
        const cancelBtn = popup.querySelector('#bm_btn_cancel');

        btnTextInput.value = data.text;
        colWidthInput.value = data.columnWidth;
        iconInput1.value = data.icon;
        iconInput2.value = data.panicIcon;
        kvdbInput.value = data.kvdbBucket ?? '';
        idInput.value = data.id;

        // Validation state
        let validators = {
            name: false,
            colWidth: false,
            icon1: true,
            icon2: true,
            kvdb: true,
            id: true,
        };

        // Outlines invalid fields in red
        function setFieldValidity(el, ok) {
            if (!el) return;
            el.style.outline = ok ? 'none' : '2px solid #e05';
        }

        // Name validator: Allow anything, even empty names
        function validateText() {
            const ok = true;
            validators.name = ok;
            setFieldValidity(btnTextInput, ok);
            updateSaveState();
            return ok;
        }

        function validateWidth() {
            const input = colWidthInput.value.trim();
            const num = Number(input);
            const ok = Number.isInteger(num) && input !== '' && num >= 100 && num <= 350;
            validators.colWidth = ok;
            setFieldValidity(colWidthInput, ok);
            updateSaveState();
            return ok;
        }

        // Check whether a given kvdb bucket ID is valid or not
        // Valid ones return a 400 error when going to the url below
        // Invalid ones return a 404
        function validateKvdb() {
            const input = kvdbInput.value.trim();
            if (input === '') {
                setFieldValidity(kvdbInput, true);
                updateSaveState();
                return Promise.resolve(true);
            }
            const url = `https://kvdb.io/${input}`;
            return fetch(url, { method: 'POST' }).then(res => {
                const ok = (res.status === 400);
                setFieldValidity(kvdbInput, ok);
                updateSaveState();
                return ok;
            }).catch(() => {
                setFieldValidity(kvdbInput, false);
                updateSaveState();
                return false;
            });
        }

        function validateId() {
            const input = btnTextInput.value.trim().replace(/ /g, '');
            btnTextInput.value = input;
            const ok = input.length > 0;
            validators.name = ok;
            setFieldValidity(btnTextInput, ok);
            updateSaveState();
            return ok;
        }

        // Icon validator: empty => valid; non-empty => must be valid URL and image must load
        let iconCheckToken = 0;
        function validateIcon(iconInput, iconPreview) {
            const val = iconInput.value.trim();
            if (!val) {
                validators.icon = true;
                setFieldValidity(iconInput, true);
                // still show the red X as visual fallback
                showX(iconPreview);
                updateSaveState();
                return Promise.resolve(true);
            }
            // Try to load the image to verify it's an image resource
            const currentToken = ++iconCheckToken;
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => {
                    if (currentToken !== iconCheckToken) return; // stale
                    validators.icon = true;
                    setFieldValidity(iconInput, true);
                    // show the loaded image in preview
                    iconPreview.src = val;
                    iconPreview.style.background = 'none';
                    iconPreview.alt = '';
                    updateSaveState();
                    resolve(true);
                };
                img.onerror = () => {
                    if (currentToken !== iconCheckToken) return; // stale
                    validators.icon = false;
                    setFieldValidity(iconInput, false);
                    showX(iconPreview);
                    updateSaveState();
                    resolve(false);
                };
                img.src = val;
            });
        }

        // Show red X fallback in preview
        function showX(iconPreview) {
            iconPreview.src = '';
            iconPreview.alt = '❌';
            // leave iconPreview visible (we always reserve the space)
        }

        // Check overall validation status and enable/disable Save accordingly
        function updateSaveState() {
            // If icon is currently being validated async, we still rely on validators.icon which will be set by async result.
            const allOk = validators.name && validators.colWidth && validators.icon1 && validators.icon2 && validators.kvdb && validators.id;
            saveBtn.disabled = !allOk;
            saveBtn.style.cursor = allOk ? 'pointer' : 'not-allowed';
            saveBtn.style.opacity = allOk ? '1' : '0.6';
        }

        // Close logic
        function closePopup() {
            shade.remove();
            popup.remove();
        };

        // Wire up input events
        btnTextInput.addEventListener('input', validateText);
        colWidthInput.addEventListener('input', validateWidth);
        idInput.addEventListener('input', validateId);
        kvdbInput.addEventListener('input', () => {
            validateKvdb();
        });
        // Icon input: kick off image validation (async)
        iconInput1.addEventListener('input', () => {
            // start validation; we don't await here — the async will update validators.icon when complete
            validateIcon(iconInput1, iconPreview1);
        });
        iconInput2.addEventListener('input', () => {
            // start validation; we don't await here — the async will update validators.icon when complete
            validateIcon(iconInput2, iconPreview2);
        });
        cancelBtn.addEventListener('click', closePopup);
        shade.addEventListener('click', closePopup);

        // initialize states/UI
        showX(iconPreview1);
        showX(iconPreview2);
        // run initial synchronous validators
        validateText();
        validateWidth();
        // initial icon validation (empty -> valid)
        validateIcon(iconInput1, iconPreview1).then(() => {
            validateIcon(iconInput2, iconPreview2);
        });
        // initial kvdb bucket validation
        validateKvdb().then(() => {
            validateKvdb();
        });

        // Save behavior (only possible if validators pass)
        saveBtn.addEventListener('click', async () => {
            // Ensure icon validation finished before saving (in case user typed URL right before clicking)
            await validateIcon(iconInput1, iconPreview1);
            await validateIcon(iconInput2, iconPreview2);
            // Likewise for kvdb bucket
            await validateKvdb();

            // Final quick check, shouldn't happen because Save is disabled, but guard anyway
            if (!(validators.name && validators.colWidth && validators.icon1 && validators.icon2 && validators.kvdb && validators.id)) return closePopup();

            data.text = btnTextInput.value;
            data.columnWidth = colWidthInput.value;
            data.icon = iconInput1.value;
            data.panicIcon = iconInput2.value;
            data.kvdbBucket = kvdbInput.value;
            data.id = idInput.value;
            GM.setValue('data', data).then(() => {
                setBookmarksButtonIcon();
                const textDiv1 = document.querySelector(`.bookmarksButtons .bookmarks-container-${id} .bookmarks-button .nav-text__2020`);
                const textDiv2 = document.querySelector(`.bookmarksButtonsBottom .bookmarks-container-${id} .bookmarks-button .nav-text__2020`);
                textDiv1.textContent = data.text;
                textDiv2.textContent = data.text;
            });

            // Buh-bye
            closePopup();
        });
    }

    function openEditPopup(link) {
        // Remove any existing popup/shade
        document.querySelectorAll('.bm-edit-shade, .bm-edit-popup').forEach(el => el.remove());

        // Shade layer
        const shade = document.createElement('div');
        shade.className = 'bm-edit-shade';
        Object.assign(shade.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '9998'
        });
        document.body.appendChild(shade);

        // Popup
        const popup = document.createElement('div');
        popup.className = 'bm-edit-popup';
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ddd',
            padding: '20px',
            borderRadius: '10px',
            zIndex: '9999',
            width: '320px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            fontFamily: 'sans-serif'
        });

        const defaultIcons = {
            "https://www.neopets.com/winter/snowager.phtml": "https://images.neopets.com/neoboards/avatars/snowager.gif",
            "https://www.neopets.com/desert/shrine.phtml": "https://images.neopets.com/neoboards/avatars/ava_coltzan_shrine.gif",
            "https://www.neopets.com/winter/adventcalendar.phtml": "https://images.neopets.com/neoboards/avatars/ac_christmas_aisha.gif",
            "https://www.neopets.com/questlog/": "https://images.neopets.com/themes/h5/basic/images/quests-icon.svg",
            "https://www.neopets.com/inventory.phtml": "https://images.neopets.com/themes/h5/common/inventory/images/inventory-chest.png",
            "https://www.neopets.com/safetydeposit.phtml": "https://images.neopets.com/neoboards/avatars/sdb.gif",
            "https://www.neopets.com/quickstock.phtml": "https://images.neopets.com/themes/h5/altadorcup/images/quickstock-icon.png",
            "https://www.neopets.com/home/index.phtml": "https://images.neopets.com/themes/h5/basic/images/v3/mypets-icon.svg",
            "https://www.neopets.com/bank.phtml": "https://images.neopets.com/themes/h5/common/bank/images/dial-icon.svg",
            "https://www.jellyneo.net/": "https://www.jellyneo.net/layout/imgs/mainsite/favicon.png",
            "https://www.neopets.com/halloween/applebobbing.phtml": "https://images.neopets.com/neoboards/avatars/imposterapple.gif",
            "https://www.neopets.com/medieval/wiseking.phtml": "https://images.neopets.com/neoboards/avatars/kinghagan.gif",
            "https://www.neopets.com/medieval/grumpyking.phtml": "https://images.neopets.com/neoboards/avatars/jester.gif",
            "https://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes": "https://images.neopets.com/neoboards/avatars/slorg.gif",
            "https://www.neopets.com/prehistoric/omelette.phtml": "https://images.neopets.com/neoboards/avatars/ava_cookbook_omelette.gif",
            "https://www.neopets.com/jelly/jelly.phtml": "https://images.neopets.com/jelly/giantjelly.gif",
            "https://www.neopets.com/faerieland/tdmbgpop.phtml": "https://images.neopets.com/neoboards/avatars/tdmbgpop.gif",
            "https://www.neopets.com/pirates/anchormanagement.phtml": "https://images.neopets.com/items/fur_pirate_anchor.gif",
            "https://www.neopets.com/water/fishing.phtml": "https://images.neopets.com/neoboards/avatars/fishsquid.gif",
            "https://www.neopets.com/island/tombola.phtml": "https://images.neopets.com/new_shopkeepers/t_139.gif",
            "https://www.neopets.com/magma/quarry.phtml": "https://images.neopets.com/items/mmat_obsidian.gif",
            "https://www.neopets.com/medieval/knowledge.phtml": "https://images.neopets.com/neoboards/avatars/brightvale.gif",
            "https://www.neopets.com/games/lostinthedark/": "https://images.neopets.com/neoboards/avatars/ava_lostindark.gif",
            "https://www.neopets.com/desert/extravagance.phtml": "https://images.neopets.com/neoboards/avatars/extravagance.gif",
            "https://www.neopets.com/trudys_surprise.phtml": "https://images.neopets.com/neoboards/avatars/trudyavatar.gif",
            "https://www.neopets.com/desert/fruit/index.phtml": "https://images.neopets.com//games/clicktoplay/icon_20.gif",
            "https://www.neopets.com/pirates/forgottenshore.phtml": "https://images.neopets.com/neoboards/avatars/forgshore.gif",
            "https://www.neopets.com/worlds/geraptiku/tomb.phtml": "https://images.neopets.com/neoboards/avatars/geraptiku_tomb.gif",
            "https://www.neopets.com/moon/meteor.phtml": "https://images.neopets.com/moon/meteor_empty.gif",
            "https://www.neopets.com/pirates/foodclub.phtml": "https://images.neopets.com/neoboards/avatars/ava_food_club_smmmmm.gif",
            "https://www.neopets.com/pirates/foodclub.phtml?type=collect": "https://images.neopets.com/neoboards/avatars/ava_food_club_smmmmm.gif",
            "https://www.neopets.com/pirates/foodclub.phtml?type=bet": "https://images.neopets.com/neoboards/avatars/ava_food_club_smmmmm.gif",
            "https://www.neopets.com/pirates/foodclub.phtml?type=current_bets": "https://images.neopets.com/neoboards/avatars/ava_food_club_smmmmm.gif",
            "https://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true": "https://images.neopets.com/neoboards/avatars/neodaqtick.gif",
            "https://www.neopets.com/stockmarket.phtml": "https://images.neopets.com/neoboards/avatars/neodaqtick.gif",
            "https://www.neopets.com/lab.phtml": "https://images.neopets.com/art/misc/lab_ray_scientist.gif",
            "https://www.neopets.com/petpetlab.phtml": "https://images.neopets.com/games/petpetlab/scientist.gif",
            "https://www.neopets.com/shenkuu/lunar/?show=puzzle": "https://images.neopets.com/shenkuu/lunar/phases/5.gif",
            "https://www.neopets.com/premium/wheel.phtml": "https://images.neopets.com/themes/h5/basic/images/premiumwheel-icon.png",
            "https://www.neopets.com/faerieland/caverns/index.phtml": "https://images.neopets.com/nt/nt_images/509_faerie_caves.gif",
            "https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=1": "https://images.neopets.com/neoboards/avatars/evilcoconut.gif",
            "https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=2": "https://images.neopets.com/neoboards/avatars/evilcoconut.gif",
            "https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=3": "https://images.neopets.com/neoboards/avatars/evilcoconut.gif",
            "https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=4": "https://images.neopets.com/neoboards/avatars/evilcoconut.gif",
            "https://www.neopets.com/halloween/process_cocoshy.phtml?coconut=5": "https://images.neopets.com/neoboards/avatars/evilcoconut.gif",
            "https://www.neopets.com/halloween/coconutshy.phtml": "https://images.neopets.com/neoboards/avatars/evilcoconut.gif",
            "https://www.neopets.com/prehistoric/mediocrity.phtml": "https://images.neopets.com/neoboards/avatars/mediocrity.gif",
            "https://www.neopets.com/faerieland/wheel.phtml": "https://images.neopets.com/neoboards/avatars/wheelofexcitement.gif",
            "https://www.neopets.com/halloween/wheel/index.phtml": "https://images.neopets.com/neoboards/avatars/misfortune.gif",
            "https://www.neopets.com/halloween/scratch.phtml": "https://images.neopets.com/neoboards/avatars/sssidney.gif",
            "https://www.neopets.com/pirates/buriedtreasure/index.phtml": "https://images.neopets.com/neoboards/avatars/aishascalawag.gif",
            "https://www.neopets.com/halloween/strtest/index.phtml": "https://images.neopets.com/halloween/strtest/h5/images/wood-hammer3.png",
            "http://www.neopets.com/halloween/strtest/process_strtest.phtml": "https://images.neopets.com/halloween/strtest/h5/images/wood-hammer3.png",
            "https://www.neopets.com/halloween/gravedanger/": "https://images.neopets.com/images/buddy/aim_hauntedwoods_1.gif",
            "https://www.neopets.com/faerieland/springs.phtml": "https://images.neopets.com/items/pot_healingspringsres.gif",
            "https://www.neopets.com/freebies/index.phtml": "https://images.neopets.com/items/nbo_monthofeating.gif",
            "https://www.neopets.com/games/giveaway/giveaway_game.phtml": "https://images.neopets.com/games/pages/icons/screenshots/905/1.png",
            "http://ncmall.neopets.com/games/giveaway/process_giveaway.phtml": "https://images.neopets.com/games/pages/icons/screenshots/905/1.png",
            "https://www.neopets.com/island/training.phtml?type=status": "https://images.neopets.com/themes/000_def_f65b1/rotations/12.png",
            "https://www.neopets.com/shenkuu/neggcave/": "https://images.neopets.com/neoboards/avatars/nfy14.gif",
            "https://www.neopets.com/games/voidworks/": "https://images.neopets.com/neoboards/avatars/ava_voidworks_capsule.gif",
            "https://www.neopets.com/games/game.phtml?game_id=500": "https://images.neopets.com/neoboards/avatars/meercachase.gif",
            "https://www.neopets.com/premium/sc/": "https://images.neopets.com/premium/2023/icon-scratchcards.png",
            "https://www.neopets.com/worlds/kiko/kpop/": "https://images.neopets.com/items/toy_balloon_kiko.gif",
            "https://www.neopets.com/prehistoric/battleground/": "https://images.neopets.com/neoboards/avatars/obeliskwar_ayfb89s.gif",
            "https://www.neopets.com/hospital/volunteer.phtml": "https://images.neopets.com/neoboards/avatars/ava_devotedcaretaker.gif",
            "https://www.neopets.com/wishing.phtml": "https://images.neopets.com/neoboards/avatars/wishingwell.gif",
            "https://www.neopets.com/medieval/cheeseroller.phtml": "https://images.neopets.com/neoboards/avatars/cheeseroller.gif",
            "https://www.neopets.com/dome/fight.phtml": "https://images.neopets.com/themes/h5/basic/images/battledome-icon.png",
            "https://www.neopets.com/games/attackonaltador/": "https://images.neopets.com/neoboards/avatars/ava_best_strategist.gif",
            "https://www.neopets.com/space/coincidence.phtml": "https://images.neopets.com/neoboards/avatars/randomevents2014.gif",
            "https://itemdb.com.br/": "https://images.neopets.com/themes/h5/altadorcup/images/quickstock-icon.png",
            "https://www.neopets.com/faerieland/darkfaerie.phtml": "https://images.neopets.com/neoboards/avatars/jhudorascloud.gif",
            "https://www.neopets.com/games/crossword/index.phtml": "https://images.neopets.com/neoboards/avatars/library_faerie.gif",
            "https://www.neopets.com/halloween/witchtower.phtml": "https://images.neopets.com/neoboards/avatars/ednacackle.gif",
            "https://www.neopets.com/halloween/braintree.phtml": "https://images.neopets.com/neoboards/avatars/braintree.gif",
            "https://www.neopets.com/halloween/esophagor.phtml": "https://images.neopets.com/halloween/spooky_suprise/quest_esophagor.gif",
            "https://www.neopets.com/desert/sc/kiosk.phtml": "https://images.neopets.com/images/frontpage/lostdesert_scratchcard_2005.gif",
            "https://www.neopets.com/medieval/symolhole.phtml": "https://images.neopets.com/neoboards/avatars/symol.gif",
            "https://www.neopets.com/medieval/turdleracing.phtml": "https://images.neopets.com/medieval/turdleracing/turdle2.jpg",
            "https://www.neopets.com/medieval/earthfaerie.phtml": "https://images.neopets.com/neoboards/avatars/illusensglade.gif",
            "https://www.neopets.com/medieval/pickyourown_index.phtml": "https://www.jellyneo.net/assets/imgs/avatars/97.gif",
            "https://www.neopets.com/medieval/turmaculus.phtml": "https://images.neopets.com/neoboards/avatars/turmaculus.gif",
            "https://www.neopets.com/island/kitchen.phtml": "https://images.neopets.com/old_images/water/water_chef1.gif",
            "https://www.neopets.com/community/": "https://images.neopets.com/themes/h5/common/communitycentral/images/puzzle-puzzlepiece.svg",
            "https://www.neopets.com/games/lottery.phtml": "https://images.neopets.com/neoboards/avatars/lottery.gif",
            "https://www.neopets.com/soupkitchen.phtml": "https://images.neopets.com/neoboards/avatars/soup_faerie_kind.gif",
            "https://www.neopets.com/worlds/deadlydice.phtml": "https://images.neopets.com/neoboards/avatars/deadlydice.gif",
            "https://www.neopets.com/winter/kiosk.phtml": "https://images.neopets.com/neoboards/avatars/kioskwocky.gif",
            "https://www.neopets.com/winter/snowfaerie.phtml": "https://images.neopets.com/neoboards/avatars/taelia.gif",
            "https://www.neopets.com/space/strangelever.phtml": "https://images.neopets.com/neoboards/avatars/leverofdoom.gif",
            "https://www.neopets.com/halloween/bagatelle.phtml": "https://images.neopets.com/images/buddy/aim_bagatelle.gif",
            "http://www.neopets.com/halloween/process_bagatelle.phtml": "https://images.neopets.com/images/buddy/aim_bagatelle.gif",
            "https://www.neopets.com/halloween/corkgun.phtml": "https://images.neopets.com/images/buddy/gypsy2.gif",
            "http://www.neopets.com/halloween/process_corkgun.phtml": "https://images.neopets.com/images/buddy/gypsy2.gif",
            "https://www.neopets.com/prehistoric/monotony/monotony.phtml": "https://images.neopets.com/neoboards/avatars/monotony.gif",
            "https://www.neopets.com/games/kadoatery/index.phtml": "https://images.neopets.com/neoboards/avatars/kadoatery.gif",
            "https://www.neopets.com/medieval/rubbishdump.phtml": "https://images.neopets.com/neoboards/avatars/thatsnotrubbish.gif",
            "https://www.neopets.com/donations.phtml": "https://images.neopets.com/new_shopkeepers/t_89.gif",
            "https://www.neopets.com/prehistoric/concerthall.phtml": "https://images.neopets.com/neoboards/avatars/groovychomby.gif",
            "https://www.neopets.com/prehistoric/ticketbooth.phtml": "https://images.neopets.com/neoboards/avatars/groovychomby.gif",
            "https://www.neopets.com/island/training.phtml?type=status": "https://images.neopets.com/neoboards/avatars/codestones.gif",
            "https://www.neopets.com/island/training.phtml?type=courses": "https://images.neopets.com/neoboards/avatars/codestones.gif",
            "https://www.neopets.com/island/training.phtml": "https://images.neopets.com/neoboards/avatars/codestones.gif",
            "https://www.neopets.com/pirates/academy.phtml": "https://images.neopets.com/neoboards/avatars/smuggleddubloon.gif",
            "https://www.neopets.com/pirates/academy.phtml?type=status": "https://images.neopets.com/neoboards/avatars/smuggleddubloon.gif",
            "https://www.neopets.com/pirates/academy.phtml?type=courses": "https://images.neopets.com/neoboards/avatars/smuggleddubloon.gif",
            "https://www.neopets.com/island/fight_training.phtml?type=status": "https://images.neopets.com/items/codestone13.gif",
            "https://www.neopets.com/island/fight_training.phtml?type=courses": "https://images.neopets.com/items/codestone13.gif",
            "https://www.neopets.com/island/fight_training.phtml": "https://images.neopets.com/items/codestone13.gif",
            "https://www.neopets.com/neomessages.phtml": "https://images.neopets.com/neoboards/avatars/neomailaddict.gif",
            "https://www.neopets.com/faerieland/poogleracing.phtml": "https://images.neopets.com/neoboards/avatars/pooglewinner.gif",
            "https://www.neopets.com/neoboards/index.phtml": "https://images.neopets.com/neoboards/avatars/default.gif",
            "https://www.neopets.com/tvw/": "https://images.neopets.com/themes/h5/basic/images/tvw-icon.png",
            "https://www.neopets.com/faeriefestival/": "https://images.neopets.com/themes/h5/basic/images/faeriefestival-icon.png",
            "https://www.neopets.com/faeriefestival/freethefaeries.phtml": "https://images.neopets.com/themes/h5/basic/images/ff-nc-icon.png",
            "https://www.neopets.com/explore.phtml": "https://images.neopets.com/themes/h5/basic/images/v3/explore-icon.svg",
            "https://www.neopets.com/altador/colosseum/": "https://images.neopets.com/neoboards/avatars/altadorcup.gif",
            "https://www.neopets.com/games/": "https://images.neopets.com/neoboards/avatars/topgamer.gif",
            "https://www.neopets.com/shops/wizard.phtml": "https://images.neopets.com/shopkeepers/shopwizard2.png",
            "https://ncmall.neopets.com/mall/shop.phtml?page=giveaway": "https://images.neopets.com/games/pages/icons/screenshots/905/1.png",
            "https://ncmall.neopets.com/games/giveaway/process_giveaway.phtml": "https://images.neopets.com/games/pages/icons/screenshots/905/1.png",
            "https://www.neopets.com/mall/wheel/": "https://images.neopets.com/ncmall/fortune/pushdowns/wheel-cookie.png",
        };

        popup.innerHTML = `
            <div class="bm-form">
                <div class="bm-row">
                    <label>Name:</label>
                    <input type="text" id="bm_edit_name" style="width:100%">
                </div>

                <div class="bm-row">
                    <label>URL:</label>
                    <input type="text" id="bm_edit_url" style="width:100%">
                </div>

                <div class="bm-row">
                    <label>Category:</label>
                    <select id="bm_edit_category" style="width:100%"></select>

                    <!-- outer reserve prevents layout jumps; your JS may toggle display on the inner input by ID -->
                    <div class="reserved" style="margin-top:6px;">
                        <input type="text" id="bm_edit_new_category" placeholder="Enter new category name"
                                     style="width:100%; display:none; margin-top:0;">
                    </div>
                </div>

                <div class="bm-row">
                    <label>Check Type:</label>
                    <select id="bm_edit_checkType" style="width:100%">
                        <option value="alwaysAvailable">Always available</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="date">Date</option>
                        <option value="cooldown">Cooldown</option>
                        <option value="hoursAvailable">Specific hours</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <!-- extras are grouped directly under Check Type; outer .reserved keeps spacing when inner content is hidden -->
                    <div class="reserved group" style="margin-top:8px;">
                        <div id="bm_edit_extra_wrapper_1">
                            <input type="text" id="bm_edit_extra_1" placeholder="Extra details..." >
                            <small id="bm_edit_extra_info_1"></small>
                        </div>

                        <div id="bm_edit_extra_wrapper_2">
                            <input type="text" id="bm_edit_extra_2" placeholder="Extra details..." >
                            <small id="bm_edit_extra_info_2"></small>
                        </div>

                        <div id="bm_edit_extra_wrapper_days">
                            <select id="bm_edit_days_of_week" style="width:100%">
                                <option value="0">Sunday</option>
                                <option value="1">Monday</option>
                                <option value="2">Tuesday</option>
                                <option value="3">Wednesday</option>
                                <option value="4">Thursday</option>
                                <option value="5">Friday</option>
                                <option value="6">Saturday</option>
                            </select>
                        </div>

                        <div id="bm_edit_extra_wrapper_units">
                            <select id="bm_edit_units" style="width:100%">
                                <option value="1">Minutes</option>
                                <option value="60">Hours</option>
                                <option value="1440">Days</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="bm-row">
                    <label>Icon URL:</label>
                    <div class="icon-row">
                        <div class="icon-box">
                            <img id="bm_edit_icon_preview" src="" alt="">
                            <span class="icon-fallback">❌</span>
                        </div>
                        <input type="text" id="bm_edit_icon" style="width:100%">
                    </div>
                </div>

                <div class="controls-inline" style="margin-top:6px">
                    <div class="left">
                        <label><input type="checkbox" id="bm_edit_enabled" checked> Enabled</label><br>
                        <label><input type="checkbox" id="bm_edit_panic"> Panic when active</label><br>
                        <label><input type="checkbox" id='bm_edit_new_tab'> Open in new tab</label>
                    </div>

                    <div class="right">
                        <button id="bm_edit_save" disabled style="margin-right:8px; cursor:not-allowed;">Save</button>
                        <button id="bm_edit_cancel">Cancel</button>
                    </div>
                </div>

                <div>
                    <p>Tip: You can right click the toolbar button, column headers, each link, and the dropdown background!</p>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        // Elements of the popup
        const nameInput = popup.querySelector('#bm_edit_name');
        const urlInput = popup.querySelector('#bm_edit_url');
        const categorySelect = popup.querySelector('#bm_edit_category');
        const newCategoryField = popup.querySelector('#bm_edit_new_category');
        const checkType = popup.querySelector('#bm_edit_checkType');
        const extraWrapper1 = popup.querySelector('#bm_edit_extra_wrapper_1');
        const extraField1 = popup.querySelector('#bm_edit_extra_1');
        const extraInfo1 = popup.querySelector('#bm_edit_extra_info_1');
        const extraWrapper2 = popup.querySelector('#bm_edit_extra_wrapper_2');
        const extraField2 = popup.querySelector('#bm_edit_extra_2');
        const extraInfo2 = popup.querySelector('#bm_edit_extra_info_2');
        const daysWrapper = popup.querySelector('#bm_edit_extra_wrapper_days');
        const daysField = popup.querySelector('#bm_edit_days_of_week');
        const unitsWrapper = popup.querySelector('#bm_edit_extra_wrapper_units');
        const unitsField = popup.querySelector('#bm_edit_units');
        const iconPreview = popup.querySelector('#bm_edit_icon_preview');
        const iconInput = popup.querySelector('#bm_edit_icon');
        const enabledCheck = popup.querySelector('#bm_edit_enabled');
        const panicCheck = popup.querySelector('#bm_edit_panic');
        const tabCheck = popup.querySelector('#bm_edit_new_tab');
        const saveBtn = popup.querySelector('#bm_edit_save');
        const cancelBtn = popup.querySelector('#bm_edit_cancel');

        // Populate the category dropdown with our headers
        for (const header in data.headers) {
            categorySelect.appendChild(new Option(header, header));
        }
        categorySelect.appendChild(new Option('New category...', 'newCategory'));

        // If a link was provided, pre-fill the form with its details
        if (link !== undefined) {
            nameInput.value = link.name;
            urlInput.value = link.url;
            categorySelect.value = link.header;
            switch (link.checkType) {
                case 'alwaysAvailable':
                    checkType.value = link.checkType;
                    break;
                case 'daily':
                    checkType.value = link.checkType;
                    if (link.params.length) {
                        const offset = link.params[0];
                        const hours = Math.floor(offset / 60);
                        const minutes = offset % 60;
                        const timeStr = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
                        extraField1.value = timeStr;
                    }
                    else extraField1.value = '00:00';
                    if (link.params.length && link.params.length > 1) {
                        extraField2.value = link.params[1].join(', ');
                    }
                    else extraField2.value = '';
                    break;
                case 'weekly':
                    checkType.value = link.checkType;
                    daysField.value = link.params[0] ?? 0;
                    break;
                case 'monthly':
                    checkType.value = link.checkType;
                    extraField1.value = link.params[0] ?? 1;
                    break;
                case 'date': {
                    checkType.value = link.checkType;
                    const month = link.params[0] + 1;
                    const day = link.params[1];
                    extraField1.value = `2025-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    break;
                } case 'cooldown':
                    checkType.value = link.checkType;
                    extraField1.value = link.params[0];
                    unitsField.value = '1';
                    break;
                case 'hoursAvailable':
                    checkType.value =link.checkType;
                    extraField1.value = link.params[0].join(', ');
                    break;
                case 'or':
                    checkType.value = 'advanced';
                    extraField1.value = link.checkType;
                    try { extraField2.value = JSON.stringify(link.params[0]).replace(/,/g, ', ').replace(/\[/g, '[ ').replace(/\]/g, ' ]'); }
                    catch { extraField2.value = ''; }
                    break;
                case 'and':
                    checkType.value = 'advanced';
                    extraField1.value = link.checkType;
                    try { extraField2.value = JSON.stringify(link.params[0]).replace(/,/g, ', ').replace(/\[/g, '[ ').replace(/\]/g, ' ]'); }
                    catch { extraField2.value = ''; }
                    break;
                default:
                    break;
            }
            iconInput.value = link.icon;
            enabledCheck.checked = link.enabled;
            panicCheck.checked = link.panic;
            tabCheck.checked = link.newTab;
        } else {
            nameInput.value = document.title.replace(/^Neopets - /, '');
            urlInput.value = window.location;
            if (window.location in defaultIcons) {
                iconInput.value = defaultIcons[window.location];
            }
        }

        // Validation state
        let validators = {
            name: false,
            url: false,
            category: false,
            checkType: false,
            icon: true // true if empty OR if image loads successfully
        };

        // Outlines invalid fields in red
        function setFieldValidity(el, ok) {
            if (!el) return;
            el.style.outline = ok ? 'none' : '2px solid #e05';
        }

        // Name validator: non-empty
        function validateName() {
            const ok = nameInput.value.trim().length > 0;
            validators.name = ok;
            setFieldValidity(nameInput, ok);
            updateSaveState();
            return ok;
        }

        // URL validator: non-empty
        function validateUrl() {
            const val = urlInput.value.trim();
            const ok = Boolean(val)
            validators.url = ok;
            setFieldValidity(urlInput, ok);
            updateSaveState();
            if (ok && val in defaultIcons && !iconInput.value) {
                iconInput.value = defaultIcons[val];
                validateIcon();
            }
            return ok;
        }

        // Category validator
        function validateCategory() {
            let ok = true;
            if (categorySelect.value === 'newCategory') {
                const name = newCategoryField.value.trim().toLowerCase();
                // Non-empty and not already in use
                ok = name.length > 0 && !Object.keys(data.headers).some(header => header.toLowerCase() === name);
            }
            setFieldValidity(newCategoryField, ok);
            validators.category = ok;
            updateSaveState();
            return ok;
        }

        // CheckType validator
        function validateCheckType() {
            const input1 = extraField1.value;
            const input2 = extraField2.value;
            let ok;
            switch (checkType.value) {
                case 'alwaysAvailable':
                    ok = true;
                    break;
                case 'daily': {
                    ok = input1 !== '';
                    if (!input2) break;
                    let hours = input2.replace(/ /g, '').split(',');
                    let alsoOk = hours.every(h => /^\d+$/.test(h) && +h >= 0 && +h <= 23)
                    ok = ok && alsoOk
                    break;
                } case 'weekly':
                    ok = true;
                    break;
                case 'monthly': {
                    const n = Number(input1);
                    ok = Number.isInteger(n) && n >= 1 && n <= 31;
                    break;
                } case 'date':
                    ok = input1 !== '';
                    break;
                case 'cooldown': {
                    const n = Number(input1);
                    ok = Number.isInteger(n) && n > 0;
                    break;
                } case 'hoursAvailable': {
                    if (!input1.trim()) {
                        ok = false; // empty string is invalid
                        break;
                    }
                    const parts = input1.split(',');
                    for (const part of parts) {
                        const n = Number(part.trim());
                        if (!Number.isInteger(n) || n < 0 || n > 23) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok === undefined) ok = true;
                    break;
                } case 'advanced': {
                    if (availabilityCheckers[input1] === undefined) {
                        ok = false;
                        extraInfo2.textContent = 'Invalid function name';
                        break;
                    }
                    let userInput;
                    try {
                        userInput = JSON.parse(`[${input2.replace(/'/g, '"')}]`);
                    } catch {
                        ok = false;
                        extraInfo2.textContent = 'Syntax error: Failed to parse';
                        break;
                    }
                    const result = availabilityCheckers[input1]('key', Date.now(), ...userInput);
                    if (Number.isNaN(result)) {
                        ok = false;
                        extraInfo2.textContent = 'Invalid function parameters';
                    }
                    else {
                        ok = true;
                        extraInfo2.textContent = '';
                    }
                    break;
                } default:
                    ok = false;
            }
            setFieldValidity(extraField1, ok);
            setFieldValidity(extraField2, ok);
            validators.checkType = ok;
            updateSaveState();
            return ok;
        }

        // Icon validator: empty => valid; non-empty => must be valid URL and image must load
        let iconCheckToken = 0;
        function validateIcon() {
            const val = iconInput.value.trim();
            if (!val) {
                validators.icon = true;
                setFieldValidity(iconInput, true);
                // still show the red X as visual fallback
                showX();
                updateSaveState();
                return Promise.resolve(true);
            }
            // Try to load the image to verify it's an image resource
            const currentToken = ++iconCheckToken;
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => {
                    if (currentToken !== iconCheckToken) return; // stale
                    validators.icon = true;
                    setFieldValidity(iconInput, true);
                    // show the loaded image in preview
                    iconPreview.src = val;
                    iconPreview.style.background = 'none';
                    iconPreview.alt = '';
                    updateSaveState();
                    resolve(true);
                };
                img.onerror = () => {
                    if (currentToken !== iconCheckToken) return; // stale
                    validators.icon = false;
                    setFieldValidity(iconInput, false);
                    showX();
                    updateSaveState();
                    resolve(false);
                };
                img.src = val;
            });
        }

        // Show red X fallback in preview
        function showX() {
            iconPreview.src = '';
            iconPreview.alt = '❌';
            // leave iconPreview visible (we always reserve the space)
        }

        // Update UI for checkType -> extra wrapper
        function updateExtraFieldUI() {
            let msg1 = '';
            let msg2 = '';
            extraWrapper1.style.display = 'none';
            extraWrapper2.style.display = 'none';
            daysWrapper.style.display = 'none';
            unitsWrapper.style.display = 'none';
            switch (checkType.value) {
                case 'always':
                    break;
                case 'daily':
                    msg1 = 'Enter the time of day it should reset, in NST.';
                    extraField1.type = 'time';
                    link ?? (extraField1.value = '00:00');
                    extraWrapper1.style.display = 'block';
                    msg2 = 'Enter any specific hours (0-23) to exclude.'
                    extraField2.type = 'text';
                    link ?? (extraField2.value = '');
                    extraField2.placeholder = 'Excluded hours (0-23)';
                    extraWrapper2.style.display = 'block';
                    break;
                case 'weekly':
                    daysWrapper.style.display = 'block';
                    break;
                case 'monthly':
                    msg1 = 'Enter the day of the month (e.g. 15).';
                    extraField1.type = 'text';
                    extraField1.placeholder = 'Day of month...';
                    link ?? (extraField1.value = '1');
                    extraWrapper1.style.display = 'block';
                    break;
                case 'date':
                    msg1 = 'Enter a specific date (Year will be ignored).';
                    extraField1.type = 'date';
                    link ?? (extraField1.value = '2025-01-01');
                    extraWrapper1.style.display = 'block';
                    break;
                case 'cooldown':
                    msg1 = 'Enter cooldown duration.';
                    extraField1.type = 'text';
                    extraField1.placeholder = '';
                    link ?? (extraField1.value = '');
                    extraWrapper1.style.display = 'block';
                    unitsWrapper.style.display = 'block';
                    break;
                case 'hoursAvailable':
                    msg1 = 'Comma-separated list of valid hours, 0-23, in NST. So Snowager would be "6,14,22".';
                    extraField1.type = 'text';
                    extraField1.placeholder = '';
                    link ?? (extraField1.value = '');
                    extraWrapper1.style.display = 'block';
                    break;
                case 'advanced':
                    extraField1.type = 'text';
                    extraField1.placeholder = 'Function name';
                    link ?? (extraField1.value = '');
                    extraField2.type = 'text';
                    extraField2.placeholder = 'Function parameters';
                    link ?? (extraField2.value = '');
                    extraWrapper1.style.display = 'block';
                    extraWrapper2.style.display = 'block';
                    break;
                default:
            }
            extraInfo1.textContent = msg1;
            extraInfo2.textContent = msg2;
            validateCheckType();
        }

        // Category UI helper - hides or unhides the input box for new categories
        function updateCategoryFieldUI() {
            if (categorySelect.value === 'newCategory') {
                newCategoryField.style.display = 'block';
            } else {
                newCategoryField.style.display = 'none';
                newCategoryField.value = '';
            }
        }

        // Check overall validation status and enable/disable Save accordingly
        function updateSaveState() {
            // If icon is currently being validated async, we still rely on validators.icon which will be set by async result.
            const allOk = validators.name && validators.url && validators.category && validators.checkType && validators.icon;
            saveBtn.disabled = !allOk;
            saveBtn.style.cursor = allOk ? 'pointer' : 'not-allowed';
            saveBtn.style.opacity = allOk ? '1' : '0.6';
        }

        // Build a new link from the form information
        function buildLink() {
            const newLink = {};
            newLink.name = nameInput.value;
            if (link) newLink.key = link.key;
            else {
                let key = newLink.name.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
                if (!(key in links)) newLink.key = key;
                else {
                    let n = 1;
                    while (`${key}_${n}` in links) n++;
                    newLink.key = `${key}_${n}`;
                }
            }
            switch (checkType.value) {
                case 'alwaysAvailable':
                    newLink.checkType = checkType.value;
                    newLink.params = [];
                    break;
                case 'daily': {
                    newLink.checkType = checkType.value;
                    const offset = extraField1.value.split(':').reduce((h, m, i) => h + (i === 0 ? +m * 60 : +m), 0);
                    newLink.params = [+offset];
                    if (!extraField2.value) break;
                    let excludeHours = extraField2.value.replace(/ /g, '').split(',');
                    excludeHours = excludeHours.map(h => +h);
                    newLink.params.push(excludeHours);
                    break;
                } case 'weekly':
                    newLink.checkType = checkType.value;
                    newLink.params = [+daysField.value];
                    break;
                case 'monthly':
                    newLink.checkType = checkType.value;
                    newLink.params = [+extraField1.value];
                    break;
                case 'date': {
                    newLink.checkType = checkType.value;
                    const [year, month, day] = extraField1.value.split('-').map(Number);
                    newLink.params = [+month - 1, +day]
                    break;
                } case 'cooldown': {
                    newLink.checkType = checkType.value;
                    const value = +extraField1.value * +unitsField.value;
                    newLink.params = [+value];
                    break;
                } case 'hoursAvailable': {
                    newLink.checkType = checkType.value;
                    const hours = extraField1.value.split(',').map(s => +s.trim());
                    newLink.params = [hours];
                    break;
                } case 'advanced':
                    newLink.checkType = extraField1.value;
                    newLink.params = JSON.parse(`[${extraField2.value.replace(/'/g, '"')}]`);
                    break;
                default:
                    break;
            }
            newLink.url = urlInput.value;
            newLink.header = (categorySelect.value === 'newCategory') ? newCategoryField.value : categorySelect.value;
            newLink.icon = iconInput.value;
            newLink.enabled = enabledCheck.checked;
            newLink.panic = panicCheck.checked;
            newLink.newTab = tabCheck.checked;
            if (link && link.last) newLink.last = link.last;
            else newLink.last = 0;
            return newLink;
        }

        // Close logic
        function closePopup() {
            shade.remove();
            popup.remove();
        };

        // Wire up input events
        nameInput.addEventListener('input', validateName);
        urlInput.addEventListener('input', validateUrl);
        categorySelect.addEventListener('change', () => {
            updateCategoryFieldUI();
            validateCategory();
        });
        newCategoryField.addEventListener('input', validateCategory);
        checkType.addEventListener('change', () => {
            updateExtraFieldUI();
            validateCheckType();
        });
        extraField1.addEventListener('input', validateCheckType);
        extraField2.addEventListener('input', validateCheckType);
        daysField.addEventListener('change', validateCheckType);
        unitsField.addEventListener('change', validateCheckType);
        // Icon input: kick off image validation (async)
        iconInput.addEventListener('input', () => {
            // start validation; we don't await here — the async will update validators.icon when complete
            validateIcon();
        });
        cancelBtn.addEventListener('click', closePopup);
        shade.addEventListener('click', closePopup);

        // initialize states/UI
        updateCategoryFieldUI();
        updateExtraFieldUI();
        showX();
        // run initial synchronous validators
        validateName();
        validateUrl();
        validateCategory();
        validateCheckType();
        // initial icon validation (empty -> valid)
        validateIcon();

        // Save behavior (only possible if validators pass)
        saveBtn.addEventListener('click', async () => {
            // Ensure icon validation finished before saving (in case user typed URL right before clicking)
            await validateIcon();

            // Final quick check, shouldn't happen because Save is disabled, but guard anyway
            if (!(validators.name && validators.url && validators.category && validators.checkType && validators.icon)) return;

            // Build and add new link
            const newLink = buildLink();
            addOrChangeLink(newLink)

            // Buh-bye
            closePopup();
        });
    }

    function createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.id = 'bookmarks_context_menu';
        contextMenu.innerHTML = `<ul></ul>`;
        document.body.appendChild(contextMenu);
        // Close menu on any click outside
        document.addEventListener('mousedown', (e) => {
            if (contextMenu.getClientRects().length && !contextMenu.contains(e.target)) {
                closeContextMenu();
            }
        });
    }

    function closeContextMenu() {
        if (contextKeyHandler) {
            document.removeEventListener('keydown', contextKeyHandler);
            contextKeyHandler = null;
        }
        const contextMenu = document.getElementById('bookmarks_context_menu');
        contextMenu.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        contextMenu.style.display = 'none';
    }

    let contextKeyHandler = null;
    let timeoutId;

    function dimMenu(contextMenu) {
        if (timeoutId) clearTimeout(timeoutId);
        contextMenu.style.opacity = '25%';
        timeoutId = setTimeout(() => { contextMenu.style.opacity = '100%' }, 500);
    }

    function addContextLinkNavigation(contextMenu, option, ul) {
        // Single row with four arrow buttons
        const li = document.createElement('li');
        li.title = 'Try the keyboard arrow keys!';
        li.classList.add('bm-context-link-nav'); // optional class for styling

        const directions = [
            { label: '↑', up: true },
            { label: '↓', down: true },
            { label: '←', left: true },
            { label: '→', right: true }
        ];

        directions.forEach(dir => {
            const btn = document.createElement('button');
            btn.textContent = dir.label;
            btn.title = 'Try the keyboard arrow keys!';
            btn.addEventListener('mouseup', () => {
                dimMenu(contextMenu);
                moveLink(option.link, !!dir.up, !!dir.down, !!dir.left, !!dir.right);
            });
            li.appendChild(btn);
        });

        ul.appendChild(li);

        contextKeyHandler = (e) => {
            const keyMap = {
                ArrowUp: { up: true },
                ArrowDown: { down: true },
                ArrowLeft: { left: true },
                ArrowRight: { right: true }
            };
            const dir = keyMap[e.key];
            if (dir) {
                dimMenu(contextMenu);
                moveLink(option.link, !!dir.up, !!dir.down, !!dir.left, !!dir.right);
                e.preventDefault(); // prevent scrolling
                // Do NOT close the menu or remove the listener
            }
        };
        document.addEventListener('keydown', contextKeyHandler);
    }

    function showContextMenu(options, x, y) {
        const contextMenu = document.getElementById('bookmarks_context_menu');
        const ul = contextMenu.querySelector('ul');
        ul.innerHTML = ''; // Clear old options

        let openTime = Date.now();
        options.push({ label: 'Help', action: () => alert(helpText) });
        options.forEach(option => {
            if (option.linkNavigation && data.manualSort) {
                addContextLinkNavigation(contextMenu, option, ul);
            } else {
                const li = document.createElement('li');
                li.textContent = option.label;
                if (option.labelOnly) {
                    li.classList.add('bm-context-label');
                } else {
                    li.addEventListener('mouseup', () => {
                        if (Date.now() < openTime + 150) return;
                        option.action();
                        closeContextMenu();
                    });
                }
                ul.appendChild(li);
            }
        });
        // Make menu visible, adjust position to avoid appearing off-screen
        contextMenu.style.display = 'block';
        // document.documentElement.clientWidth accounts for the width of the scroll bar, while window.innerWidth does not
        const xOverflow = Math.max(x + contextMenu.clientWidth - document.documentElement.clientWidth, 0);
        // document.documentElement.clientHeight does not update properly, so window.innerHeight is used
        const yOverflow = Math.max(y + contextMenu.clientHeight - window.innerHeight, 0);
        contextMenu.style.top = `${y - yOverflow}px`;
        contextMenu.style.left = `${x - xOverflow}px`;
    }


    function undo() {
        if (undoQueue.length) {
            const action = undoQueue.pop();
            redoQueue.push([action[0], links[action[0]].last]);
            links[action[0]].last = action[1];
            GM.setValue('data', data);
            populateDropdown();
        }
    }

    function redo() {
        if (redoQueue.length) {
            const action = redoQueue.pop();
            undoQueue.push([action[0], links[action[0]].last]);
            links[action[0]].last = action[1];
            GM.setValue('data', data);
            populateDropdown();
        }
    }

    function toggleEnabled(key) {
        if (key in links) {
            links[key].enabled = !links[key].enabled;
            GM.setValue('data', data);
            populateDropdown();
        }
    }

    function openAllActive(col) {
        // Iterate backwards so, when done, tabs are in column order
        for (let i = col.links.length - 1; i >= 0; i--) {
            const link = col.links[i];
            let now = Date.now();
            if (link.checkVal < 0) {
                undoQueue.push([link.key, link.last]);
                while (undoQueue.length > 30) undoQueue.shift();
                links[link.key].last = now++;
                openUrl(link.url, false, true);
                // Below line doesn't work - only opens first link
                // Unideal because below line opens in background, above in foreground, but whatever
                //openUrl(link.url, true);
            }
        }
        GM.setValue('data', data);
        GM.setValue('undoQueue', undoQueue);
        populateDropdown();
    }

    function clickLink(link, newTab = false) {
        undoQueue.push([link.key, link.last]);
        while (undoQueue.length > 30) undoQueue.shift();
        links[link.key].last = Date.now();
        GM.setValue('data', data);
        GM.setValue('undoQueue', undoQueue);
        populateDropdown();
        openUrl(link.url, newTab, link.newTab);
    }

    function openUrl(url, bgTab = false, fgTab = false) {
        if (!bgTab) {
            if (fgTab) window.open(url, '_blank');
            else location.href = url;
            return;
        }
        //return openUrl(url, false, true);
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        const ev = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
        a.dispatchEvent(ev);
        a.remove();
    }

    async function setData(newData, save = true) {
        newData ||= (await GM.getValue('data')) ?? defaultData;
        data = newData;
        const version = 1.11111
        if (!data.version || data.version < version) {
            delete data.headers;
            delete data.headerOrder;
            data.version = version;
            save = true;
        }
        if (!('links' in data &&
              'headerOrder' in data &&
              'headers' in data &&
              data.columnWidth &&
              data.text &&
              data.icon &&
              data.panicIcon &&
              data.manualSort &&
              data.columnStack &&
              data.kvdbBucket &&
              data.id)) save = true;
        if (!('id' in data)) data.id = Math.random().toString(36).slice(2, 10);
        if (!('kvdbBucket' in data)) data.kvdbBucket = null;
        if (!('links' in data)) data.links = {};
        links = data.links;
        if (!('headerOrder' in data)) data.headerOrder = [];
        if (!('headers' in data)) {
            let i = 0;
            const headers = { };
            for (const link of Object.values(links)) {
                if (!(link.header in headers)) {
                    headers[link.header] = {
                        name: link.header,
                        linkCount: 0,
                        open: true,
                        hidden: false,
                        order: [link.key],
                    };
                    data.headerOrder.push(link.header);
                } else {
                    headers[link.header].order.push(link.key);
                }
            }
            data.headers = headers;
        }
        data.columnWidth ?? (data.columnWidth = defaultData.columnWidth);
        data.columnStack ?? (data.columnStack = defaultData.columnStack);
        data.manualSort ?? (data.manualSort = defaultData.manualSort);
        data.text ?? (data.text = defaultData.text);
        data.icon ?? (data.icon = defaultData.icon);
        data.panicIcon ?? (data.panicIcon = defaultData.panicIcon);
        if (save) GM.setValue('data', data);
    }

    function addOrChangeLink(newLink) {
        if (newLink.key in links) {
            // Changing an existing link
            const oldHeader = links[newLink.key].header;
            if (oldHeader !== newLink.header) {
                // The header changed - let's remove from the old header's links
                const i = data.headers[oldHeader].order.indexOf(newLink.key);
                if (i !== -1) data.headers[oldHeader].order.splice(i, 1);
                // Delete the old header if that was the last link in it
                if (data.headers[oldHeader].order.length === 0) deleteHeader(oldHeader);
            } else {
                // Same header - just update the link, save, return
                links[newLink.key] = newLink;
                GM.setValue('data', data).then(() => populateDropdown(false, true));
                return;
            }
        }
        // Update new header
        if (!(newLink.header in data.headers)) {
            // Header doesn't exist yet - make it
            data.headers[newLink.header] = {
                name: newLink.header,
                linkCount: 1,
                open: true,
                hidden: false,
                order: [newLink.key],
            };
            data.headerOrder.push(newLink.header);
        } else {
            // Header already exists - increment its links
            data.headers[newLink.header].order.push(newLink.key);
        }
        links[newLink.key] = newLink;
        GM.setValue('data', data).then(() => populateDropdown(false, true));
    }

    function deleteLink(linkToDelete) {
        if (!confirm(`Are you sure you want to delete "${linkToDelete.name}"?`)) return;
        delete links[linkToDelete.key];
        const i = data.headers[linkToDelete.header].order.indexOf(linkToDelete.key);
        if (i !== -1) data.headers[linkToDelete.header].order.splice(i, 1);
        if (data.headers[linkToDelete.header].order.length === 0) deleteHeader(linkToDelete.header)
        GM.setValue('data', data).then(populateDropdown);
    }

    function renameHeader(oldName) {
        const newName = prompt(`Enter new header name for "${oldName}":`, oldName);
        if (!newName || newName === oldName) return;
        // Change the header of all links with the old name to the new one
        for (const link of Object.values(links)) {
            if (link.header === oldName) link.header = newName;
        }
        if (newName in data.headers) {
            // Merging headers, so merge links
            data.headers[newName].order.push(...data.headers[oldName].order);
            // Delete the old header from the order list
            const i = data.headerOrder.indexOf(oldName);
            if (i !== -1) data.headerOrder.splice(i, 1);
        } else {
            // Brand new header
            // Just copy the old one but change the name
            data.headers[newName] = data.headers[oldName];
            data.headers[newName].name = newName;
            const i = data.headerOrder.indexOf(oldName);
            data.headerOrder[i] = newName;
        }
        delete data.headers[oldName];
        GM.setValue('data', data).then(populateDropdown);
    }

    function moveHeader(headerToMove, left) {
        const columns = processLinks(true);
        let colPos = columns.indexOf(headerToMove);
        if ((left && colPos === 0) || (!left && colPos === columns.length - 1)) return;
        const pos = data.headerOrder.indexOf(headerToMove);
        const dir = left ? -1 : 1;
        let newPos = data.headerOrder.indexOf(columns[colPos + dir]);
        data.headerOrder.splice(pos, 1);
        data.headerOrder.splice(newPos, 0, headerToMove);
        GM.setValue('data', data).then(populateDropdown);
    }

    function toggleHeader(header) {
        data.headers[header].open = !data.headers[header].open;
        GM.setValue('data', data).then(populateDropdown);
    }

    function deleteHeader(headerToDelete) {
        const i = data.headerOrder.indexOf(headerToDelete);
        if (i !== -1) data.headerOrder.splice(i, 1);
        delete data.headers[headerToDelete];
    }

    function deleteColumn(headerToDelete) {
        if (!confirm(`Are you SURE you want to delete the column "${headerToDelete}"? This will also delete all of its links, and can NOT be undone!`)) return;
        for (const link of data.headers[headerToDelete].order) {
            delete links[link];
        }
        deleteHeader(headerToDelete);
        GM.setValue('data', data).then(populateDropdown);
    }
})();