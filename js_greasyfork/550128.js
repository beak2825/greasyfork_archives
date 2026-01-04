// ==UserScript==
// @name         HWH Auto-Buyer
// @namespace    HWHAutoBuyer
// @version      1.2.2
// @description  Extension for HeroWarsHelper script - Buys items from shops based on user-defined rules.
// @author       Bartjan
// @match        https://www.hero-wars.com/*
// @match        https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550128/HWH%20Auto-Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/550128/HWH%20Auto-Buyer.meta.js
// ==/UserScript==

(function () {
    if (!this.HWHClasses || !this.HWHFuncs || !this.Caller) {
        console.log('%cHWH dependencies not found for Auto-Buyer extension', 'color: red');
        return;
    }
    console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: green');
    const { HWHClasses, HWHFuncs, HWHData, cheats, Caller } = this;
    const { addExtentionName, getSaveVal, setSaveVal, setProgress } = HWHFuncs;
    addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);

    const settings = {
        coin1: { input: null, default: true },
        coin2: { input: null, default: true },
        coin3: { input: null, default: true },
        coin4: { input: null, default: true },
        coin5: { input: null, default: true },
        coin6: { input: null, default: true },
        maxGear: { input: null, default: 3 },
        maxFragment: { input: null, default: 80 },
        minCoins: { input: null, default: 100000 },
        chaosPetShop: { input: null, default: false }, // << NEW SETTING
    };

    const COINS = [
        { id: '1', name: 'Arena Coin', setting: 'coin1' },
        { id: '2', name: 'Grand Arena Coin', setting: 'coin2' },
        { id: '3', name: 'Tower Coin', setting: 'coin3' },
        { id: '4', name: 'Outland Coin', setting: 'coin4' },
        { id: '5', name: 'Soul Coin', setting: 'coin5' },
        { id: '6', name: 'Friendship Coin', setting: 'coin6' },
        // Pet Soul Coin is not in default shops, handled manually for shopId 17
    ];

    const ALLOWED_COIN_IDS = COINS.map(coin => coin.id);
    const ALLOWED_REWARD_TYPES = ['gear', 'fragmentGear', 'fragmentScroll'];
    const SHOP_NAMES = {
        1: 'Town Shop', 4: 'Arena Shop', 5: 'Grand Arena Shop',
        6: 'Tower Shop', 8: 'Soul Shop', 9: 'Friendship Shop', 10: 'Outland Shop',
        17: 'Pet Soul Stone Shop',
    };

    function getItemName(rewardType, rewardData) {
        try {
            const itemId = Object.keys(rewardData)[0];
            let libType = rewardType.charAt(0).toUpperCase() + rewardType.slice(1);
            if (rewardType.startsWith('fragment')) {
                libType = rewardType.replace('fragment', '').charAt(0).toUpperCase() + rewardType.replace('fragment', '').slice(1);
            }
            const libName = `LIB_${libType.toUpperCase()}_NAME_${itemId}`;
            const translated = cheats.translate(libName);
            return translated.startsWith('LIB_') ? `${rewardType} ${itemId}` : translated;
        } catch (e) {
            return `${rewardType} ID`;
        }
    }

    async function autoBuyFromShops() {
        console.log('=== AUTO-BUYER START ===');
        setProgress('Starting Auto-Buyer...');
        const maxGear = parseInt(settings.maxGear.input.value) || settings.maxGear.default;
        const maxFragment = parseInt(settings.maxFragment.input.value) || settings.maxFragment.default;
        const minCoins = parseInt(settings.minCoins.input.value) || settings.minCoins.default;
        const enabledCoins = {};
        COINS.forEach(coin => {
            enabledCoins[coin.id] = settings[coin.setting].input.checked;
        });
        const buyChaosPetShop = settings.chaosPetShop.input.checked;
        const [shops, inventory, userInfo] = await Caller.send(['shopGetAll', 'inventoryGet', 'userGetInfo']);
        const currencyTracker = { ...inventory.coin, gold: userInfo.gold, ...inventory.petcoin }; // include petcoin if structure matches
        const callsToMake = [];
        const itemsToLog = [];

        for (const shopId in shops) {
            const idNum = parseInt(shopId);
            const currentShop = shops[shopId];
            if (!currentShop.slots) continue;


// Handle Pet Soul Stone Shop (17) for chaos particles via Pet Soul Coins, NO cost/balance checks
if (idNum === 17) {
    console.log("something in pet shop");
    if (!buyChaosPetShop) continue;
    // Only buy from slot 4, check reward is chaos particles
    const slot = currentShop.slots['4'];
    if (!slot || slot.bought || !slot.reward || !slot.cost) continue;
    // Confirm slot actually rewards chaos particles
    const rewardType = Object.keys(slot.reward)[0];
 //   if (!rewardType || !rewardType.toLowerCase().includes('chaos')) continue;
    // Remove all coin/cost checks: always buy if available
    callsToMake.push({
        name: 'shopBuy',
        args: {
            shopId: currentShop.id,
            slot: slot.id,
            cost: slot.cost,
            reward: slot.reward,
        },
        ident: `shopBuy_${currentShop.id}_${slot.id}`,
    });
    const rewardData = slot.reward[rewardType];
    const amount = Object.values(rewardData)[0];
    itemsToLog.push(`• ${getItemName(rewardType, rewardData)} (x${amount}) from Pet Soul Stone Shop (Chaos Particles)`);
    continue;
}


            // Normal logic for other shops (original logic, but skip shopId 17)
            if (idNum >= 11) continue;
            for (const slotId in currentShop.slots) {
                const slot = currentShop.slots[slotId];
                let shouldBuy = true;
                if (slot.bought || !slot.reward || !slot.cost) shouldBuy = false;
                if (shouldBuy) {
                    const costType = Object.keys(slot.cost)[0];
                    const costCurrencyId = Object.keys(slot.cost[costType])[0];
                    if (costType !== 'coin' || !ALLOWED_COIN_IDS.includes(costCurrencyId) || !enabledCoins[costCurrencyId]) {
                        shouldBuy = false;
                    }
                }
                if (shouldBuy) {
                    const costAmount = slot.cost[Object.keys(slot.cost)[0]][Object.keys(slot.cost[Object.keys(slot.cost)[0]])[0]];
                    const playerBalance = currencyTracker[Object.keys(slot.cost[Object.keys(slot.cost)[0]])[0]] || 0;
                    if (playerBalance < costAmount + minCoins) shouldBuy = false;
                }
                if (shouldBuy) {
                    for (const [rewardType, rewardData] of Object.entries(slot.reward)) {
                        if (!ALLOWED_REWARD_TYPES.includes(rewardType)) {
                            shouldBuy = false;
                            break;
                        }
                        const itemId = Object.keys(rewardData)[0];
                        let inventoryCount = 0;
                        if (inventory[rewardType] && inventory[rewardType][itemId]) {
                            inventoryCount = inventory[rewardType][itemId];
                        }
                        if ((rewardType === 'gear' || rewardType === 'scroll') && inventoryCount >= maxGear) {
                            shouldBuy = false;
                            break;
                        }
                        if ((rewardType === 'fragmentGear' || rewardType === 'fragmentScroll') && inventoryCount >= maxFragment) {
                            shouldBuy = false;
                            break;
                        }
                    }
                }
                if (shouldBuy) {
                    callsToMake.push({
                        name: 'shopBuy',
                        args: {
                            shopId: currentShop.id,
                            slot: slot.id,
                            cost: slot.cost,
                            reward: slot.reward,
                        },
                        ident: `shopBuy_${currentShop.id}_${slot.id}`,
                    });
                    const rewardType = Object.keys(slot.reward)[0];
                    const rewardData = slot.reward[rewardType];
                    const amount = Object.values(rewardData)[0];
                    itemsToLog.push(`• ${getItemName(rewardType, rewardData)} (x${amount}) from ${SHOP_NAMES[shopId] || `Shop ${shopId}`}`);
                    const costType = Object.keys(slot.cost)[0];
                    const costCurrencyId = Object.keys(slot.cost[costType])[0];
                    const costAmount = slot.cost[costType][costCurrencyId];
                    currencyTracker[costCurrencyId] -= costAmount;
                }
            }
        }

        if (callsToMake.length > 0) {
            console.log(`Attempting to buy ${callsToMake.length} items...`);
            setProgress(`Buying ${callsToMake.length} items...`);
            try {
                const buyResult = await Caller.send(callsToMake);
                if (buyResult) {
                    const boughtString = itemsToLog.join('\n');
                    console.log('%c--- Items Bought Successfully ---', 'color: lightgreen; font-weight: bold;');
                    console.log(boughtString);
                    setProgress(
                        `Bought ${itemsToLog.length} items! \n\n${boughtString}`,
                        true
                    );
                } else {
                    throw new Error("Buy command failed to return a result.");
                }
            } catch (error) {
                console.error('An error occurred during purchase:', error);
                setProgress('Error during purchase. Check console.', true);
            }
        } else {
            console.log('No items to buy based on current settings.');
            setProgress('No items to buy based on current settings.', true);
        }
        console.log('=== AUTO-BUYER END ===');
    }

    function initializeExtension() {
        function addShopCheckerControls() {
            const { ScriptMenu } = HWHClasses;
            const scriptMenu = ScriptMenu.getInst();
            const details = scriptMenu.addDetails('Auto-Buy Settings', 'autoBuySettings');
            COINS.forEach(coin => {
                settings[coin.setting].input = scriptMenu.addCheckbox(
                    `Buy with ${coin.name}`,
                    `Allows buying items using ${coin.name}`,
                    details
                );
            });
            settings.maxGear.input = scriptMenu.addInputText('Max Gear/Scroll Count:', 'e.g., 3', details);
            settings.maxFragment.input = scriptMenu.addInputText('Max Fragment Count:', 'e.g., 80', details);
            settings.minCoins.input = scriptMenu.addInputText('Min Coin Reserve:', 'e.g., 100000', details);
            // Pet Chaos checkbox
            settings.chaosPetShop.input = scriptMenu.addCheckbox(
                'Buy CP from Pet Shop',
                'Allows auto-buy of Chaos Particles (slot 4) from Pet shop with Pet Soul Coins',
                details
            );
            for (const key in settings) {
                const isCheckbox = settings[key].input.type === 'checkbox';
                const savedValue = getSaveVal(`shopChecker_${key}`, settings[key].default);
                if (isCheckbox) {
                    settings[key].input.checked = savedValue;
                    settings[key].input.addEventListener('change', (e) => {
                        setSaveVal(`shopChecker_${key}`, e.target.checked);
                    });
                } else {
                    settings[key].input.value = savedValue;
                    settings[key].input.addEventListener('input', (e) => {
                        setSaveVal(`shopChecker_${key}`, parseInt(e.target.value, 10) || settings[key].default);
                    });
                }
            }
        }

        addShopCheckerControls();
        const { buttons } = HWHData;
        buttons.autoBuyer = {
            get name() { return 'Auto-Buy Items'; },
            get title() { return 'Automatically buys allowed items from shops with ID < 11 based on your settings and Chaos from Pet Shop if enabled.'; },
            onClick: autoBuyFromShops,
            color: 'green',
        };
        console.log('%cAuto-Buyer extension loaded and attached to HWH menu.', 'color: green');
    }

    const { ScriptMenu } = HWHClasses;
    const scriptMenu = ScriptMenu.getInst();
    if (scriptMenu && scriptMenu.mainMenu) {
        initializeExtension();
    } else if (scriptMenu && scriptMenu.on) {
        scriptMenu.on('afterInit', initializeExtension);
    } else {
        initializeExtension();
    }
})();
