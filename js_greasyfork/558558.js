// ==UserScript==
// @name         Item Market Armor Preview
// @namespace    https://torn.com
// @version      1.4.6
// @description  Try an armor before buying in the Item Market
// @author       JESUUS [2353554]
// @copyright    2025, JESUUS - All rights reserved
// @license      MIT
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @match        *://www.torn.com/imarket.php*
// @match        *://www.torn.com/bazaar.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558558/Item%20Market%20Armor%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/558558/Item%20Market%20Armor%20Preview.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if (typeof PDA_httpGet !== 'undefined' || window.innerWidth < 768) return;

    const API_KEY = localStorage.getItem('tornApiKey') || '';

    let currentEquipment = [];
    let tryOnConfig = JSON.parse(localStorage.getItem('armorPreviewTryOn') || '{}');

    function formatPrice(price) {
        if (!price && price !== 0) return '-';
        return '$' + price.toLocaleString('en-US');
    }

    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        const cleaned = priceStr.replace(/[$,\s]/g, '');
        return parseInt(cleaned, 10) || 0;
    }

    function getTotalPrice() {
        return Object.values(tryOnConfig).reduce((sum, item) => sum + (item.price || 0), 0);
    }

    let bazaarAvailabilityCache = {};
    let marketAvailabilityCache = {};

    function extractBazaarUserId(url) {
        if (!url || !url.includes('bazaar.php')) return null;
        const match = url.match(/user[Ii][Dd]=(\d+)/);
        return match ? match[1] : null;
    }

    async function checkBazaarAvailability(item) {
        if (!API_KEY || !item.sourceUrl) return null;

        const userId = extractBazaarUserId(item.sourceUrl);
        if (!userId) return null;

        const cacheKey = `${userId}_${item.id}`;
        if (bazaarAvailabilityCache[cacheKey] !== undefined) {
            return bazaarAvailabilityCache[cacheKey];
        }

        try {
            const response = await fetch(`https://api.torn.com/user/${userId}?selections=bazaar&key=${API_KEY}`);
            const data = await response.json();

            if (data.error) {
                bazaarAvailabilityCache[cacheKey] = null;
                return null;
            }

            const bazaarItems = data.bazaar || [];
            const totalQuantity = bazaarItems
                .filter(bazaarItem => bazaarItem.ID === item.id)
                .reduce((sum, bazaarItem) => sum + (bazaarItem.quantity || 1), 0);
            const result = totalQuantity > 0 ? { available: true, quantity: totalQuantity } : { available: false, quantity: 0 };

            bazaarAvailabilityCache[cacheKey] = result;
            return result;
        } catch (error) {
            bazaarAvailabilityCache[cacheKey] = null;
            return null;
        }
    }

    async function checkMarketAvailability(item) {
        if (!API_KEY || !item.id) return null;

        const cacheKey = `market_${item.id}`;
        if (marketAvailabilityCache[cacheKey] !== undefined) {
            return marketAvailabilityCache[cacheKey];
        }

        try {
            const response = await fetch(`https://api.torn.com/v2/market/${item.id}/itemmarket?key=${API_KEY}`);
            const data = await response.json();

            if (data.error) {
                marketAvailabilityCache[cacheKey] = null;
                return null;
            }

            const listings = data.itemmarket?.listings || [];
            const totalQuantity = listings.reduce((sum, listing) => sum + (listing.quantity || 1), 0);
            const result = totalQuantity > 0 ? { available: true, quantity: totalQuantity } : { available: false, quantity: 0 };

            marketAvailabilityCache[cacheKey] = result;
            return result;
        } catch (error) {
            marketAvailabilityCache[cacheKey] = null;
            return null;
        }
    }

    async function checkAllBazaarAvailability() {
        if (!API_KEY) return {};

        const results = {};
        const promises = [];

        Object.entries(tryOnConfig).forEach(([slot, item]) => {
            if (item.sourceUrl && item.sourceUrl.includes('bazaar.php')) {
                promises.push(
                    checkBazaarAvailability(item).then(available => {
                        results[slot] = available;
                    })
                );
            } else {
                promises.push(
                    checkMarketAvailability(item).then(available => {
                        results[slot] = available;
                    })
                );
            }
        });

        await Promise.all(promises);
        return results;
    }

    const DEFENSIVE_SLOTS = {
        helmet: { name: 'Helmet', zIndex: 5 },
        body: { name: 'Body', zIndex: 4 },
        pants: { name: 'Pants', zIndex: 3 },
        gloves: { name: 'Gloves', zIndex: 2 },
        boots: { name: 'Boots', zIndex: 1 }
    };

    const CLOTHING_SLOTS = {
        head: { name: 'Head', zIndex: 20 },
        eye: { name: 'Eye', zIndex: 19 },
        mouth: { name: 'Mouth', zIndex: 18 },
        nose: { name: 'Nose', zIndex: 17 },
        mask: { name: 'Mask', zIndex: 16 },
        neck: { name: 'Neck', zIndex: 15 },
        shirt: { name: 'Shirt', zIndex: 14 },
        torso: { name: 'Torso', zIndex: 15 },
        hand: { name: 'Hand', zIndex: 13 },
        leg: { name: 'Leg', zIndex: 12 },
        foot: { name: 'Foot', zIndex: 11 }
    };

    const ALL_SLOTS = { ...DEFENSIVE_SLOTS, ...CLOTHING_SLOTS };

    const DEFENSIVE_IDS = new Set([32,33,34,49,50,176,178,332,333,334,348,538,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,848,1164,1165,1166,1167,1168,1174,1307,1308,1309,1310,1311,1355,1356,1357,1358,1359]);
    const CLOTHING_IDS = new Set([46,47,48,101,107,278,347,404,412,413,414,430,562,582,598,606,607,608,609,610,621,622,623,624,625,626,633,635,698,703,704,719,726,727,728,729,730,743,791,803,806,807,808,809,810,811,812,813,816,828,834,835,836,841,842,843,849,851,869,921,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972,973,974,975,982,983,988,989,990,991,992,995,996,998,1001,1002,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,1024,1025,1026,1027,1036,1037,1038,1043,1044,1045,1046,1047,1048,1049,1050,1051,1052,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1126,1127,1128,1129,1130,1131,1132,1133,1134,1135,1136,1137,1138,1139,1140,1141,1142,1143,1144,1145,1150,1151,1169,1177,1180,1181,1182,1183,1184,1185,1186,1187,1188,1190,1191,1192,1193,1194,1195,1196,1197,1291,1295,1299,1313,1360,1367,1368,1369,1449,1450,1452,1453,1475]);
    const EOD_IDS = new Set([680, 681, 682, 683, 684]);

    const DEFENSIVE_LAYERS = {
        helmet: [
            { id: 665, item: "Assault Helmet", layers: [3] },
            { id: 651, item: "Combat Helmet", layers: [3] },
            { id: 660, item: "Dune Helmet", layers: [3] },
            { id: 670, item: "Delta Gas Mask", layers: [5, 4, 3] },
            { id: 680, item: "EOD Helmet", layers: [5, 4, 3] },
            { id: 538, item: "Medieval Helmet", layers: [5, 4, 3] },
            { id: 642, item: "Motorcycle Helmet", layers: [5, 4, 3] },
            { id: 644, item: "Welding Helmet", layers: [5, 4, 3] },
            { id: 655, item: "Riot Helmet", layers: [4, 3] },
            { id: 675, item: "Marauder Face Mask", layers: [3] },
            { id: 647, item: "Leather Helmet", layers: [3] },
            { id: 641, item: "WWII Helmet", layers: [3] },
            { id: 643, item: "Construction Helmet", layers: [3] }
        ],
        body: [
            { id: 666, item: "Assault Body", layers: [3] },
            { id: 332, item: "Combat Vest", layers: [3] },
            { id: 661, item: "Dune Vest", layers: [3] },
            { id: 671, item: "Delta Body", layers: [3] },
            { id: 681, item: "EOD Apron", layers: [3] },
            { id: 348, item: "Hazmat Suit", layers: [5, 4, 3] },
            { id: 676, item: "Marauder Body", layers: [3] },
            { id: 656, item: "Riot Body", layers: [3] },
            { id: 32, item: "Leather Vest", layers: [3] },
            { id: 33, item: "Police Vest", layers: [3] },
            { id: 34, item: "Bulletproof Vest", layers: [3] },
            { id: 49, item: "Full Body Armor", layers: [3] },
            { id: 50, item: "Outer Tactical Vest", layers: [3] },
            { id: 176, item: "Chain Mail", layers: [3] },
            { id: 178, item: "Flak Jacket", layers: [3] },
            { id: 333, item: "Liquid Body Armor", layers: [3] },
            { id: 334, item: "Flexible Body Armor", layers: [3] },
            { id: 848, item: "Kevlar Lab Coat", layers: [3] }
        ],
        pants: [
            { id: 667, item: "Assault Pants", layers: [3] },
            { id: 652, item: "Combat Pants", layers: [3] },
            { id: 662, item: "Dune Pants", layers: [3] },
            { id: 672, item: "Delta Pants", layers: [3] },
            { id: 682, item: "EOD Pants", layers: [3] },
            { id: 648, item: "Leather Pants", layers: [3] },
            { id: 677, item: "Marauder Pants", layers: [3] },
            { id: 657, item: "Riot Pants", layers: [3] }
        ],
        gloves: [
            { id: 669, item: "Assault Gloves", layers: [3] },
            { id: 654, item: "Combat Gloves", layers: [3] },
            { id: 664, item: "Dune Gloves", layers: [3] },
            { id: 674, item: "Delta Gloves", layers: [3] },
            { id: 684, item: "EOD Gloves", layers: [3] },
            { id: 640, item: "Kevlar Gloves", layers: [3] },
            { id: 650, item: "Leather Gloves", layers: [3] },
            { id: 679, item: "Marauder Gloves", layers: [3] },
            { id: 659, item: "Riot Gloves", layers: [3] }
        ],
        boots: [
            { id: 668, item: "Assault Boots", layers: [3] },
            { id: 653, item: "Combat Boots", layers: [3] },
            { id: 663, item: "Dune Boots", layers: [3] },
            { id: 673, item: "Delta Boots", layers: [3] },
            { id: 683, item: "EOD Boots", layers: [3] },
            { id: 649, item: "Leather Boots", layers: [3] },
            { id: 678, item: "Marauder Boots", layers: [3] },
            { id: 658, item: "Riot Boots", layers: [3] },
            { id: 645, item: "Safety Boots", layers: [3] },
            { id: 646, item: "Hiking Boots", layers: [3] }
        ]
    };

    const CLOTHING_LAYERS = {
        head: [
            { id: 680, item: "Paper Bag", layers: [5, 4] },
            { id: 726, item: "Scrooge's Top Hat", layers: [5, 4] },
            { id: 995, item: "Sun Hat", layers: [5, 4] },
            { id: 598, item: "Witch's Hat", layers: [5, 4] },
            { id: 1130, item: "Bunny Ears", layers: [5] },
            { id: 1149, item: "Bunny Suit", layers: [5] },
            { id: 1129, item: "Cat Ears", layers: [5] },
            { id: 1133, item: "Hair Bow", layers: [5] },
            { id: 1131, item: "Puppy Ears", layers: [5] },
            { id: 608, item: "Santa Hat", layers: [5] },
            { id: 1135, item: "Unicorn Horn", layers: [6] },
            { id: 1108, item: "Wedding Veil", layers: [5] },
            { id: 927, item: "Baseball Cap", layers: [4] },
            { id: 1019, item: "Bingo Visor", layers: [4] },
            { id: 1068, item: "Bucket Hat", layers: [4] },
            { id: 931, item: "Bush Hat", layers: [4] },
            { id: 935, item: "Cork Hat", layers: [4] },
            { id: 1052, item: "Denim Cap", layers: [4] },
            { id: 1106, item: "Fascinator Hat", layers: [4] },
            { id: 937, item: "Fisherman Hat", layers: [4] },
            { id: 990, item: "Fur Hat", layers: [4] },
            { id: 1109, item: "Head Scarf", layers: [4] },
            { id: 719, item: "Helmet of Justice", layers: [4] },
            { id: 636, item: "Jester's Cap", layers: [4] },
            { id: 1104, item: "Maid Hat", layers: [4] },
            { id: 1074, item: "Panama Hat", layers: [4] },
            { id: 1043, item: "Paper Crown - Green", layers: [4] },
            { id: 1044, item: "Paper Crown - Yellow", layers: [4] },
            { id: 1045, item: "Paper Crown - Red", layers: [4] },
            { id: 1046, item: "Paper Crown - Blue", layers: [4] },
            { id: 1070, item: "Durag", layers: [2] },
            { id: 582, item: "Tin Foil Hat", layers: [4] }
        ],
        nose: [
            { id: 1151, item: "Bunny Nose", layers: [4] },
            { id: 621, item: "Snorkel", layers: [4] },
            { id: 1182, item: "Head Bandage", layers: [3] }
        ],
        mask: [
            { id: 1177, item: "Sandworm Mask", layers: [6] }, // Layers over EVERYTHING
            { id: 597, item: "Scream Mask", layers: [5] },
            { id: 1075, item: "Pipe", layers: [4] },
            { id: 1037, item: "Anatomy Mask", layers: [3] },
            { id: 1101, item: "Ball Gag", layers: [3] },
            { id: 404, item: "Bandana", layers: [3] },
            { id: 1144, item: "Chin Diaper", layers: [3] },
            { id: 828, item: "Donald Trump Mask", layers: [3] },
            { id: 869, item: "Elon Musk Mask", layers: [3] },
            { id: 807, item: "Exotic Gentleman Mask", layers: [3] },
            { id: 808, item: "Ginger Kid Mask", layers: [3] },
            { id: 1036, item: "Greta Mask", layers: [3] },
            { id: 926, item: "Gronch Mask", layers: [3] },
            { id: 1295, item: "Hell Priest Mask", layers: [3] },
            { id: 1013, item: "Jigsaw Mask", layers: [3] },
            { id: 278, item: "Kabuki Mask", layers: [3] },
            { id: 1181, item: "Krampus Mask", layers: [3] },
            { id: 1143, item: "Medical Mask", layers: [3] },
            { id: 921, item: "Michael Myers Mask", layers: [3] },
            { id: 810, item: "Moustache Man Mask", layers: [3] },
            { id: 813, item: "Nun Mask", layers: [3] },
            { id: 816, item: "Old Lady Mask", layers: [3] },
            { id: 1141, item: "Pennywise Mask", layers: [3] },
            { id: 1180, item: "Prince Philip Mask", layers: [3] },
            { id: 812, item: "Psycho Clown Mask", layers: [3] },
            { id: 1299, item: "Queen Elizabeth II Mask", layers: [3] },
            { id: 611, item: "Santa Beard", layers: [3] },
            { id: 811, item: "Scarred Man Mask", layers: [3] },
            { id: 1150, item: "Balaclava", layers: [2] },
            { id: 803, item: "Duke's Gimp Mask", layers: [3] }
        ],
        neck: [
            { id: 1193, item: "Neck Brace", layers: [5] },
            { id: 968, item: "Bow Tie", layers: [4] },
            { id: 959, item: "Choker", layers: [3] },
            { id: 1100, item: "Collar", layers: [3] },
            { id: 989, item: "Fur Scarf", layers: [3] },
            { id: 969, item: "Neck Tie", layers: [3] },
            { id: 1076, item: "Shoulder Sweater", layers: [3] }
        ],
        eye: [
            { id: 1020, item: "Cover-ups", layers: [5] },
            { id: 983, item: "Bandit Mask", layers: [4] },
            { id: 1102, item: "Blindfold", layers: [4] },
            { id: 414, item: "Glasses", layers: [4] },
            { id: 1132, item: "Heart Sunglasses", layers: [4] },
            { id: 1183, item: "Medical Eye Patch", layers: [4] },
            { id: 975, item: "Monocle", layers: [4] },
            { id: 1014, item: "Reading Glasses", layers: [4] },
            { id: 1066, item: "Shutter Shades", layers: [4] },
            { id: 412, item: "Sports Shades", layers: [4] },
            { id: 996, item: "Square Sunglasses", layers: [4] }
        ],
        shirt: [
            { id: 1105, item: "Ball Gown", layers: [2] },
            { id: 929, item: "Blouse", layers: [2] },
            { id: 743, item: "Christmas Sweater '15", layers: [2] },
            { id: 936, item: "Crop Top", layers: [2] },
            { id: 1047, item: "Denim Shirt", layers: [2] },
            { id: 1103, item: "Maid Uniform", layers: [2] },
            { id: 943, item: "Peplum Top", layers: [2] },
            { id: 1137, item: "Polka Dot Dress", layers: [2] },
            { id: 944, item: "Polo Shirt", layers: [2] },
            { id: 1067, item: "Silver Hoodie", layers: [2] },
            { id: 835, item: "String Vest", layers: [2] },
            { id: 562, item: "Sweater", layers: [2] },
            { id: 1107, item: "Wedding Dress", layers: [2] },
            { id: 624, item: "Bikini", layers: [1] },
            { id: 930, item: "Boob Tube", layers: [1] },
            { id: 932, item: "Camisole", layers: [1] },
            { id: 430, item: "Coconut Bra", layers: [1] },
            { id: 967, item: "Fitted Shirt", layers: [1] },
            { id: 791, item: "Mediocre T-Shirt", layers: [1] },
            { id: 46, item: "Tank Top", layers: [1] },
            { id: 1064, item: "Tube Dress", layers: [1] },
            { id: 625, item: "Wetsuit", layers: [1] }
        ],
        torso: [
            { id: 1027, item: "Badge : 15th Anniversary", layers: [6] },
            { id: 1186, item: "Torso Bandage", layers: [6] },
            { id: 1071, item: "Onesie", layers: [5, 4] },
            { id: 945, item: "Poncho", layers: [5, 4] },
            { id: 635, item: "Straitjacket", layers: [5, 4] },
            { id: 1025, item: "Bathrobe", layers: [5] },
            { id: 1049, item: "Denim Jacket", layers: [5] },
            { id: 843, item: "Duster", layers: [5] },
            { id: 988, item: "Fur Coat", layers: [5] },
            { id: 1197, item: "Hospital Gown", layers: [5] },
            { id: 947, item: "Mackintosh", layers: [5] },
            { id: 1110, item: "Nightgown", layers: [5] },
            { id: 965, item: "Nipple Tassels", layers: [5] },
            { id: 727, item: "Scrooge's Topcoat", layers: [5] },
            { id: 1077, item: "Sports Jacket", layers: [5] },
            { id: 107, item: "Trench Coat", layers: [5] },
            { id: 1072, item: "Baseball Jacket", layers: [4] },
            { id: 1062, item: "Basketball Shirt", layers: [4] },
            { id: 971, item: "Blazer", layers: [4] },
            { id: 1073, item: "Braces", layers: [4] },
            { id: 934, item: "Cardigan", layers: [4] },
            { id: 958, item: "Chest Harness", layers: [4] },
            { id: 1016, item: "Collared Shawl", layers: [4] },
            { id: 1048, item: "Denim Vest", layers: [4] },
            { id: 998, item: "Floral Dress", layers: [4] },
            { id: 48, item: "Jacket", layers: [4] },
            { id: 1061, item: "Oversized Shirt", layers: [4] },
            { id: 1069, item: "Puffer Jacket", layers: [4] },
            { id: 946, item: "Puffer Vest", layers: [4] },
            { id: 1111, item: "Pullover", layers: [4] },
            { id: 940, item: "Raincoat", layers: [4] },
            { id: 609, item: "Santa Jacket", layers: [4] },
            { id: 1001, item: "Shrug", layers: [4] },
            { id: 974, item: "Smoking Jacket", layers: [4] }
        ],
        hand: [
            { id: 1192, item: "Plaster Cast Arm", layers: [6] },
            { id: 626, item: "Diving Gloves", layers: [4] },
            { id: 1190, item: "Hook Hand", layers: [4] },
            { id: 633, item: "Latex Gloves", layers: [4] },
            { id: 1098, item: "Opera Gloves", layers: [4] },
            { id: 607, item: "Santa Gloves", layers: [4] },
            { id: 730, item: "Scrooge's Gloves", layers: [4] },
            { id: 1187, item: "Prosthetic Arm", layers: [6] }
        ],
        leg: [
            { id: 1191, item: "Plaster Cast Leg", layers: [6] },
            { id: 1188, item: "Prosthetic Leg", layers: [6] },
            { id: 1184, item: "Knee Brace", layers: [5] },
            { id: 1097, item: "Assless Chaps", layers: [4] },
            { id: 928, item: "Bermudas", layers: [4] },
            { id: 1136, item: "Check Skirt", layers: [4] },
            { id: 1015, item: "Chinos", layers: [4] },
            { id: 1050, item: "Denim Jeans", layers: [4] },
            { id: 1139, item: "Dungarees", layers: [4] },
            { id: 1134, item: "Lolita Dress", layers: [4] },
            { id: 1196, item: "Medical Diaper", layers: [4] },
            { id: 964, item: "Mini Skirt", layers: [4] },
            { id: 1063, item: "Parachute Pants", layers: [4] },
            { id: 698, item: "Peg Leg", layers: [4] },
            { id: 942, item: "Pencil Skirt", layers: [4] },
            { id: 842, item: "Pinstripe Suit Trousers", layers: [4] },
            { id: 1017, item: "Pleated Skirt", layers: [4] },
            { id: 982, item: "Ripped Jeans", layers: [4] },
            { id: 1060, item: "Saggy Pants", layers: [4] },
            { id: 610, item: "Santa Trousers", layers: [4] },
            { id: 728, item: "Scrooge's Trousers", layers: [4] },
            { id: 948, item: "Shorts", layers: [4] },
            { id: 949, item: "Skirt", layers: [4] },
            { id: 972, item: "Suit Trousers", layers: [4] },
            { id: 834, item: "Sweatpants", layers: [4] },
            { id: 1126, item: "Tutu", layers: [4] },
            { id: 933, item: "Capri Pants", layers: [3] },
            { id: 1099, item: "Booty Shorts", layers: [2] },
            { id: 938, item: "Gym Shorts", layers: [2] },
            { id: 1145, item: "Tighty Whities", layers: [2] },
            { id: 960, item: "Fishnet Stockings", layers: [1] },
            { id: 941, item: "Pantyhose", layers: [1] },
            { id: 623, item: "Speedo", layers: [1] },
            { id: 347, item: "Thong", layers: [1] },
            { id: 1140, item: "Tights", layers: [1] },
            { id: 952, item: "Yoga Pants", layers: [1] }
        ],
        foot: [
            { id: 622, item: "Flippers", layers: [5] },
            { id: 606, item: "Santa Boots", layers: [5] },
            { id: 973, item: "Derby Shoes", layers: [4] },
            { id: 1138, item: "Ballet Shoes", layers: [4] },
            { id: 836, item: "Black Oxfords", layers: [4] },
            { id: 1051, item: "Denim Shoes", layers: [4] },
            { id: 1018, item: "Flip Flops", layers: [4] },
            { id: 1065, item: "Gold Sneakers", layers: [4] },
            { id: 1128, item: "Kitty Shoes", layers: [4] },
            { id: 991, item: "Platform Shoes", layers: [4] },
            { id: 1021, item: "Sandals", layers: [4] },
            { id: 729, item: "Scrooge's Boots", layers: [4] },
            { id: 992, item: "Silver Flats", layers: [4] },
            { id: 1024, item: "Slippers", layers: [4] },
            { id: 950, item: "Sports Sneakers", layers: [4] },
            { id: 953, item: "Trainers", layers: [4] },
            { id: 314, item: "Hiking Boots", layers: [3] },
            { id: 703, item: "Festive Socks", layers: [2] },
            { id: 1022, item: "Golf Socks", layers: [2] },
            { id: 1127, item: "Knee Socks", layers: [2] },
            { id: 1023, item: "Travel Socks", layers: [2] }
        ]
    };

    function getItemLayers(itemId) {
        for (const slot in DEFENSIVE_LAYERS) {
            const item = DEFENSIVE_LAYERS[slot].find(i => i.id === itemId);
            if (item) {
                return { slot, layers: item.layers, name: item.item, isDefensive: true };
            }
        }
        for (const bodyPart in CLOTHING_LAYERS) {
            const item = CLOTHING_LAYERS[bodyPart].find(i => i.id === itemId);
            if (item) {
                return { slot: bodyPart, layers: item.layers, name: item.item, isDefensive: false };
            }
        }
        return null;
    }

    function getItemZIndex(itemId) {
        const layerInfo = getItemLayers(itemId);
        if (layerInfo) {
            const maxLayer = Math.max(...layerInfo.layers);
            let zIndex = maxLayer * 10;
            if (layerInfo.isDefensive) {
                if (layerInfo.slot === 'body') zIndex += 15;
                if (layerInfo.slot === 'helmet') zIndex += 5;
                if (EOD_IDS.has(itemId)) zIndex += 20;
            }
            else if (layerInfo.slot === 'torso' || layerInfo.slot === 'shirt') {
                zIndex += 6;
            }
            return zIndex;
        }
        if (DEFENSIVE_IDS.has(itemId)) {
            return 35;
        }
        if (CLOTHING_IDS.has(itemId)) {
            return 20;
        }
        return 30;
    }

    function isPreviewableItem(itemId) {
        return DEFENSIVE_IDS.has(itemId) || CLOTHING_IDS.has(itemId);
    }

    function saveTryOnConfig() {
        const data = JSON.stringify(tryOnConfig);
        try {
            localStorage.removeItem('armorPreviewTryOn');
            localStorage.setItem('armorPreviewTryOn', data);
        } catch (e) {
            console.error('localStorage quota exceeded');
            alert('localStorage is full! Clear browser data for torn.com');
        }
    }

    function resetTryOnConfig() {
        tryOnConfig = {};
        localStorage.removeItem('armorPreviewTryOn');
    }

    async function loadCurrentEquipment() {
        if (!API_KEY) return;

        try {
            const response = await fetch(`https://api.torn.com/v2/user/equipment?key=${API_KEY}`);
            const data = await response.json();

            if (data.error) return;

            if (data.equipment && Array.isArray(data.equipment)) {
                currentEquipment = data.equipment.filter(item => {
                    return isPreviewableItem(item.id);
                }).map(item => ({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    slot: item.slot
                }));
            }
        } catch (error) {}
    }

    const style = document.createElement('style');
    style.textContent = `
        .armor-preview-btn {
            background: linear-gradient(180deg, #4a9 0%, #286 100%);
            border: 1px solid #1a5;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 5px;
        }
        .armor-preview-btn:hover {
            background: linear-gradient(180deg, #5ba 0%, #397 100%);
        }
        .armor-preview-btn.remove {
            background: linear-gradient(180deg, #c55 0%, #933 100%);
            border-color: #a33;
            padding: 2px 6px;
            font-size: 10px;
        }
        .armor-preview-btn.remove:hover {
            background: linear-gradient(180deg, #d66 0%, #a44 100%);
        }
        .armor-preview-btn.buy {
            background: linear-gradient(180deg, #48f 0%, #26c 100%);
            border-color: #15b;
            padding: 2px 6px;
            font-size: 10px;
        }
        .armor-preview-btn.buy:hover {
            background: linear-gradient(180deg, #5af 0%, #37d 100%);
        }
        .armor-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .armor-preview-content {
            background: #2a2a2a;
            border-radius: 10px;
            padding: 20px;
            max-width: 1100px;
            width: 95%;
            border: 1px solid #444;
            position: relative;
            display: flex;
            gap: 20px;
        }
        .armor-preview-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: #c33;
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            z-index: 10;
        }
        .armor-preview-close:hover {
            background: #e44;
        }
        .armor-preview-title {
            color: #fff;
            text-align: center;
            margin: 0 0 10px;
            font-size: 12px;
        }
        .armor-preview-left {
            flex: 1;
        }
        .armor-preview-right {
            flex: 1;
            border-left: 1px solid #444;
            padding-left: 20px;
        }
        .armor-preview-models {
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        .armor-preview-model-col {
            text-align: center;
        }
        .armor-preview-model {
            position: relative;
            width: 200px;
            height: 300px;
            margin: 0 auto;
        }
        .armor-preview-model img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .armor-preview-toggle-container {
            text-align: center;
            margin-top: 15px;
        }
        .armor-preview-toggle-btn {
            background: #444;
            border: 1px solid #555;
            color: #fff;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        .armor-preview-toggle-btn.active {
            background: #4a9;
            border-color: #5ba;
        }
        .armor-preview-toggle-btn:hover {
            background: #555;
        }
        .armor-preview-toggle-btn.active:hover {
            background: #5ba;
        }
        .armor-preview-slot-list {
            margin-top: 10px;
        }
        .armor-preview-slot {
            background: #333;
            border: 1px solid #555;
            border-radius: 6px;
            padding: 8px 10px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .armor-preview-slot.has-item {
            border-color: #4a9;
        }
        .armor-preview-slot.trying-on {
            border-color: #f90;
            background: #3a3020;
        }
        .armor-preview-slot-icon {
            width: 40px;
            height: 40px;
            background: #222;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .armor-preview-slot-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .armor-preview-slot-info {
            flex: 1;
            min-width: 0;
        }
        .armor-preview-slot-name {
            color: #fff;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 2px;
        }
        .armor-preview-slot-label {
            color: #888;
            font-size: 10px;
            text-transform: uppercase;
            line-height: 1.4;
        }
        .armor-preview-slot-trying {
            color: #f90;
            font-size: 9px;
        }
        .armor-preview-actions {
            display: flex;
            gap: 5px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        .armor-preview-actions button {
            flex: 1;
            min-width: 80px;
        }
        .armor-preview-section-title {
            color: #aaa;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #444;
        }
        .armor-preview-badge {
            font-size: 9px;
            padding: 1px 4px;
            border-radius: 3px;
            margin-left: 5px;
        }
        .armor-preview-badge.in-list {
            background: #4a9;
            color: #fff;
        }
        .armor-preview-badge.trying {
            background: #f90;
            color: #000;
        }
        .armor-preview-slot.is-previewing {
            border-color: #58f;
            background: #203050;
        }
        .armor-preview-slot-price {
            color: #82C91E;
            font-size: 10px;
            margin-top: 2px;
        }
        .armor-preview-total {
            color: #888;
            font-size: 10px;
            margin-top: 10px;
            text-align: center;
            padding: 8px;
            background: #222;
            border-radius: 4px;
        }
        .armor-preview-total-price {
            color: #82C91E;
            font-size: 12px;
            font-weight: bold;
            margin-top: 4px;
        }
    `;
    document.head.appendChild(style);

    let playerGender = 'male';

    function getSlotFromItem(itemName, itemId) {
        for (const slot in DEFENSIVE_LAYERS) {
            const found = DEFENSIVE_LAYERS[slot].find(i => i.id === itemId);
            if (found) return slot;
        }
        for (const bodyPart in CLOTHING_LAYERS) {
            const found = CLOTHING_LAYERS[bodyPart].find(i => i.id === itemId);
            if (found) return bodyPart;
        }
        const name = (itemName || '').toLowerCase();
        const isDefensive = DEFENSIVE_IDS.has(itemId);
        if (isDefensive) {
            if (name.includes('helmet') || name.includes('respirator') || name.includes('mask') || name.includes('visage')) return 'helmet';
            if (name.includes('vest') || name.includes('armor') || name.includes('apron') || name.includes('mail') || name.includes('spathe') || name.includes('breastplate') || name.includes('body')) return 'body';
            if (name.includes('pants') || name.includes('britches')) return 'pants';
            if (name.includes('gloves') || name.includes('clawshields')) return 'gloves';
            if (name.includes('boots') || name.includes('hooves')) return 'boots';
            return 'body';
        }
        const isClothing = CLOTHING_IDS.has(itemId);
        if (isClothing) {
            if (name.includes('hat') || name.includes('cap') || name.includes('helmet') || name.includes('ears') || name.includes('horn') || name.includes('veil') || name.includes('crown') || name.includes('visor') || name.includes('durag')) return 'head';
            if (name.includes('glasses') || name.includes('shades') || name.includes('monocle') || name.includes('blindfold') || name.includes('patch') || name.includes('cover-up')) return 'eye';
            if (name.includes('nose') || name.includes('snorkel') || name.includes('bandage')) return 'nose';
            if (name.includes('mask') || name.includes('bandana') || name.includes('balaclava') || name.includes('beard') || name.includes('gag') || name.includes('pipe')) return 'mask';
            if (name.includes('tie') || name.includes('collar') || name.includes('choker') || name.includes('scarf') || name.includes('brace') || name.includes('sweater')) return 'neck';
            if (name.includes('glove') || name.includes('cast arm') || name.includes('hook hand') || name.includes('prosthetic arm')) return 'hand';
            if (name.includes('jacket') || name.includes('coat') || name.includes('blazer') || name.includes('cardigan') || name.includes('poncho') || name.includes('pullover') || name.includes('raincoat') || name.includes('bathrobe') || name.includes('duster')) return 'torso';
            if (name.includes('t-shirt') || name.includes('shirt') || name.includes('top') || name.includes('blouse') || name.includes('camisole') || name.includes('tank') || name.includes('bikini') || name.includes('bra') || name.includes('lingerie') || name.includes('mankini') || name.includes('wetsuit') || name.includes('tube')) return 'shirt';
            if (name.includes('pants') || name.includes('trousers') || name.includes('shorts') || name.includes('skirt') || name.includes('jeans') || name.includes('dress') || name.includes('gown') || name.includes('robe') || name.includes('uniform') || name.includes('chaps') || name.includes('tutu') || name.includes('diaper') || name.includes('onesie') || name.includes('dungarees') || name.includes('speedo') || name.includes('thong') || name.includes('stockings') || name.includes('pantyhose') || name.includes('tights') || name.includes('yoga') || name.includes('cast leg') || name.includes('prosthetic leg')) return 'leg';
            if (name.includes('boots') || name.includes('shoes') || name.includes('trainers') || name.includes('sneakers') || name.includes('flippers') || name.includes('sandals') || name.includes('slippers') || name.includes('socks') || name.includes('flats') || name.includes('oxfords') || name.includes('flip flop')) return 'foot';
            return 'shirt';
        }
        return 'body';
    }

    function getItemForSlot(slot) {
        if (tryOnConfig[slot]) {
            return { ...tryOnConfig[slot], isTryingOn: true };
        }
        const equipped = currentEquipment.find(item => getSlotFromItem(item.name, item.id) === slot);
        return equipped ? { ...equipped, isTryingOn: false } : null;
    }

    function buildLayers(includeNewItem = null, excludeSlot = null) {
        let layers = '';

        Object.keys(ALL_SLOTS).forEach(slot => {
            if (slot === excludeSlot) return;

            const item = getItemForSlot(slot);
            if (item) {
                const zIndex = getItemZIndex(item.id);
                layers += `<img src="/images/v2/items/model-items/${item.id}${playerGender.charAt(0)}.png" style="position:absolute;z-index:${zIndex}" onerror="this.src='/images/v2/items/model-items/${item.id}.png'">`;
            }
        });

        if (includeNewItem) {
            const zIndex = getItemZIndex(includeNewItem.id);
            layers += `<img src="/images/v2/items/model-items/${includeNewItem.id}${playerGender.charAt(0)}.png" style="position:absolute;z-index:${zIndex}" onerror="this.src='/images/v2/items/model-items/${includeNewItem.id}.png'">`;
        }

        return layers;
    }

    async function showPreview(itemId, itemName, itemPrice = 0) {
        document.querySelectorAll('.armor-preview-modal').forEach(m => m.remove());

        const newItemSlot = getSlotFromItem(itemName, itemId);
        const isAlreadyInList = tryOnConfig[newItemSlot]?.id === itemId;

        const bazaarAvailability = await checkAllBazaarAvailability();

        function generateSlotHtml(slots, hideEmpty = false) {
            let html = '';
            Object.entries(slots).forEach(([slotKey, slotInfo]) => {
                const item = getItemForSlot(slotKey);
                const isCurrentSlot = slotKey === newItemSlot;
                const hasItem = !!item;
                const isInList = item?.isTryingOn;

                let displayItem = item;
                let isPreviewing = false;

                if (isCurrentSlot && !isAlreadyInList) {
                    isPreviewing = true;
                    displayItem = { id: itemId, name: itemName };
                } else if (isCurrentSlot && isAlreadyInList) {
                    displayItem = item;
                }

                if (hideEmpty && !hasItem && !isPreviewing) {
                    return;
                }

                let slotClass = 'armor-preview-slot';
                if (hasItem || isPreviewing) slotClass += ' has-item';
                if (isInList && !isPreviewing) slotClass += ' trying-on';
                if (isPreviewing) slotClass += ' is-previewing';

                let badge = '';
                if (isPreviewing) {
                    badge = '<span class="armor-preview-badge trying">TRYING</span>';
                } else if (isInList) {
                    badge = '<span class="armor-preview-badge in-list">IN LIST</span>';
                }

                const showItem = displayItem || item;
                const showRemoveBtn = isInList && !isPreviewing;

                let priceDisplay = '';
                if (isPreviewing && itemPrice) {
                    priceDisplay = `<div class="armor-preview-slot-price">${formatPrice(itemPrice)}</div>`;
                } else if (isInList && item?.price) {
                    priceDisplay = `<div class="armor-preview-slot-price">${formatPrice(item.price)}</div>`;
                }

                let buyBtnHtml = '';
                if (isInList && item?.id) {
                    const buyUrl = (item.sourceUrl && item.sourceUrl.length > 0) ? item.sourceUrl : `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${item.id}`;
                    const isBazaarItem = item.sourceUrl && item.sourceUrl.includes('bazaar.php');

                    let availabilityHtml = '';
                    let isOutOfStock = false;

                    if (API_KEY) {
                        const availability = bazaarAvailability[slotKey];
                        const qty = availability?.quantity || 0;
                        isOutOfStock = availability && qty === 0;

                        if (availability) {
                            const qtyDisplay = qty > 10 ? '+10' : qty;
                            const sourceType = isBazaarItem ? 'bazaar' : 'market';

                            let color;
                            if (qty >= 3) {
                                color = '#82C91E';
                            } else if (qty >= 1) {
                                color = '#f90';
                            } else {
                                color = '#c55';
                            }

                            availabilityHtml = `<div style="font-size:9px;text-align:center;margin-top:2px;color:${color}" title="${sourceType}: ${qty}">● (${qtyDisplay})</div>`;
                        }
                    }

                    const cartBtnStyle = isOutOfStock ? 'opacity:0.4;pointer-events:none;cursor:not-allowed' : '';
                    const cartTitle = isOutOfStock ? 'Out of stock' : `Buy ${item.name}`;

                    buyBtnHtml = `<div style="display:flex;flex-direction:column;align-items:center">
                        <a href="${buyUrl}" target="_blank" class="armor-preview-btn buy" data-item-id="${item.id}" title="${cartTitle}" style="${cartBtnStyle}"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></a>
                        ${availabilityHtml}
                    </div>`;
                }

                html += `
                    <div class="${slotClass}" data-slot="${slotKey}">
                        <div class="armor-preview-slot-icon">
                            ${showItem ? `<img src="/images/items/${showItem.id}/medium.png" onerror="this.style.display='none'">` : ''}
                        </div>
                        <div class="armor-preview-slot-info">
                            <div class="armor-preview-slot-label">${slotInfo.name}${badge}</div>
                            <div class="armor-preview-slot-name">${showItem ? showItem.name : '(empty)'}</div>
                            ${priceDisplay}
                        </div>
                        ${buyBtnHtml}
                        ${showRemoveBtn ? `<button class="armor-preview-btn remove" data-slot="${slotKey}">✕</button>` : ''}
                    </div>
                `;
            });
            return html;
        }

        const defensiveSlotsHtml = generateSlotHtml(DEFENSIVE_SLOTS, false);
        const clothingSlotsHtml = generateSlotHtml(CLOTHING_SLOTS, true);

        const isCurrentItemClothing = CLOTHING_IDS.has(itemId);
        const hasClothingEquipped = currentEquipment.some(item => CLOTHING_IDS.has(item.id));
        const hasClothingInList = Object.keys(CLOTHING_SLOTS).some(slot => tryOnConfig[slot]);
        const showClothingColumn = isCurrentItemClothing || hasClothingEquipped || hasClothingInList;

        const beforeLayers = buildLayers();
        const afterLayers = buildLayers(null, newItemSlot) +
            `<img src="/images/v2/items/model-items/${itemId}${playerGender.charAt(0)}.png" style="position:absolute;z-index:${getItemZIndex(itemId)}" onerror="this.src='/images/v2/items/model-items/${itemId}.png'">`;

        const modal = document.createElement('div');
        modal.className = 'armor-preview-modal';
        modal.innerHTML = `
            <div class="armor-preview-content">
                <button class="armor-preview-close">&times;</button>

                <div class="armor-preview-left" style="flex:${showClothingColumn ? '1' : '3'}">
                    <h3 class="armor-preview-title">Try On: ${itemName}</h3>
                    <div class="armor-preview-models">
                        <div class="armor-preview-model-col">
                            <div style="color:#aaa;margin-bottom:10px;font-size:12px">Current Setup</div>
                            <div class="armor-preview-model" id="preview-before">
                                <img src="/images/v2/attack/models/${playerGender}_model.png" alt="Model" style="z-index:1">
                                ${beforeLayers}
                            </div>
                        </div>
                        <div class="armor-preview-model-col">
                            <div style="color:#4a9;margin-bottom:10px;font-size:12px">With ${itemName}</div>
                            <div class="armor-preview-model" id="preview-after">
                                <img src="/images/v2/attack/models/${playerGender}_model.png" alt="Model" style="z-index:1">
                                ${afterLayers}
                            </div>
                        </div>
                    </div>
                    <div class="armor-preview-toggle-container">
                        <button class="armor-preview-toggle-btn" data-gender="male">Male</button>
                        <button class="armor-preview-toggle-btn" data-gender="female">Female</button>
                    </div>
                </div>

                <div class="armor-preview-right" style="display:flex;flex-direction:column;${showClothingColumn ? 'flex:1;min-width:420px' : 'flex:2'}">
                    <div style="display:flex;gap:15px">
                        <div class="armor-preview-column" style="flex:1">
                            <div class="armor-preview-section-title">Defensive</div>
                            <div class="armor-preview-slot-list">
                                ${defensiveSlotsHtml}
                            </div>
                        </div>
                        ${showClothingColumn ? `
                        <div class="armor-preview-column" style="flex:1;min-width:200px">
                            <div class="armor-preview-section-title">Clothing</div>
                            <div class="armor-preview-slot-list">
                                ${clothingSlotsHtml}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div style="padding:15px 0;border-top:1px solid #444;margin-top:15px">
                        <div class="armor-preview-actions" style="margin:0;display:flex;gap:5px">
                            <button class="armor-preview-btn" id="add-to-tryon" style="flex:1;background:linear-gradient(180deg,#f90 0%,#c60 100%);border-color:#a50">
                                + Add List
                            </button>
                            <button class="armor-preview-btn" id="reset-tryon" style="flex:1;background:linear-gradient(180deg,#666 0%,#444 100%);border-color:#555">
                                Reset All
                            </button>
                        </div>
                        <div class="armor-preview-total" style="margin-top:10px;text-align:center">
                            ${Object.keys(tryOnConfig).length > 0
                                ? `<div>${Object.keys(tryOnConfig).length} item(s) in list</div><div class="armor-preview-total-price">Total: ${formatPrice(getTotalPrice())}</div>`
                                : 'No items in list'}
                        </div>
                    </div>
                </div>
                <div style="position:absolute;bottom:10px;left:0;right:0;text-align:center;font-size:12px;color:#888">
                    Item Market Armor Preview Script (By <a href="https://www.torn.com/profiles.php?XID=2353554" target="_blank" style="color:#4a9;text-decoration:none">JESUUS</a>)
                </div>
            </div>
        `;

        modal.querySelector('.armor-preview-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelectorAll('.armor-preview-toggle-btn').forEach(btn => {
            if (btn.dataset.gender === playerGender) btn.classList.add('active');
            btn.addEventListener('click', () => {
                playerGender = btn.dataset.gender;
                modal.remove();
                showPreview(itemId, itemName);
            });
        });

        modal.querySelector('#add-to-tryon').addEventListener('click', async () => {
            const newItem = {
                id: itemId,
                name: itemName,
                price: itemPrice,
                sourceUrl: window.location.href
            };
            tryOnConfig[newItemSlot] = newItem;
            saveTryOnConfig();

            const beforeModel = modal.querySelector('#preview-before');
            if (beforeModel) {
                const modelImg = beforeModel.querySelector('img[alt="Model"]');
                beforeModel.innerHTML = '';
                if (modelImg) beforeModel.appendChild(modelImg);
                beforeModel.insertAdjacentHTML('beforeend', buildLayers());
            }

            const slotEl = modal.querySelector(`.armor-preview-slot[data-slot="${newItemSlot}"]`);
            if (slotEl) {
                slotEl.classList.remove('is-previewing', 'has-item');
                slotEl.classList.add('trying-on');
                slotEl.style.borderColor = '#f90';
                slotEl.style.background = '#3a3020';
                const badge = slotEl.querySelector('.armor-preview-badge');
                if (badge) {
                    badge.className = 'armor-preview-badge in-list';
                    badge.textContent = 'IN LIST';
                }

                if (!slotEl.querySelector('.armor-preview-btn.remove')) {
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'armor-preview-btn remove';
                    removeBtn.dataset.slot = newItemSlot;
                    removeBtn.textContent = '✕';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        delete tryOnConfig[newItemSlot];
                        saveTryOnConfig();
                        modal.remove();
                        showPreview(itemId, itemName, itemPrice);
                    });
                    slotEl.appendChild(removeBtn);
                }

                if (!slotEl.querySelector('.armor-preview-btn.buy')) {
                    const isBazaarItem = newItem.sourceUrl && newItem.sourceUrl.includes('bazaar.php');
                    const buyUrl = newItem.sourceUrl || `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}`;

                    const buyContainer = document.createElement('div');
                    buyContainer.style.cssText = 'display:flex;flex-direction:column;align-items:center';

                    const buyLink = document.createElement('a');
                    buyLink.href = buyUrl;
                    buyLink.target = '_blank';
                    buyLink.className = 'armor-preview-btn buy';
                    buyLink.dataset.itemId = itemId;
                    buyLink.title = `Buy ${itemName}`;
                    buyLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
                    buyContainer.appendChild(buyLink);

                    slotEl.insertBefore(buyContainer, slotEl.querySelector('.armor-preview-btn.remove'));

                    if (API_KEY) {
                        const availability = isBazaarItem
                            ? await checkBazaarAvailability(newItem)
                            : await checkMarketAvailability(newItem);

                        if (availability) {
                            const qty = availability.quantity || 0;
                            const qtyDisplay = qty > 10 ? '+10' : qty;
                            const sourceType = isBazaarItem ? 'bazaar' : 'market';
                            const isOutOfStock = qty === 0;

                            let color;
                            if (qty >= 3) color = '#82C91E';
                            else if (qty >= 1) color = '#f90';
                            else color = '#c55';

                            const availabilityDiv = document.createElement('div');
                            availabilityDiv.style.cssText = `font-size:9px;text-align:center;margin-top:2px;color:${color}`;
                            availabilityDiv.title = `${sourceType}: ${qty}`;
                            availabilityDiv.textContent = `● (${qtyDisplay})`;
                            buyContainer.appendChild(availabilityDiv);

                            if (isOutOfStock) {
                                buyLink.style.cssText = 'opacity:0.4;pointer-events:none;cursor:not-allowed';
                                buyLink.title = 'Out of stock';
                            }
                        }
                    }
                }
            }

            const totalEl = modal.querySelector('.armor-preview-total');
            if (totalEl) {
                const count = Object.keys(tryOnConfig).length;
                totalEl.innerHTML = count > 0
                    ? `<div>${count} item(s) in list</div><div class="armor-preview-total-price">Total: ${formatPrice(getTotalPrice())}</div>`
                    : 'No items in list';
            }

            const headerIndicator = document.querySelector('.armor-preview-tryon-indicator');
            const tryOnCount = Object.keys(tryOnConfig).length;
            if (headerIndicator) {
                headerIndicator.innerHTML = `<span style="font-weight:bold">${tryOnCount}</span> in try-on list`;
            } else if (tryOnCount > 0) {
                const headerContainer = document.querySelector('.armor-preview-header-container');
                if (headerContainer) {
                    const tryOnIndicator = document.createElement('div');
                    tryOnIndicator.className = 'armor-preview-tryon-indicator';
                    tryOnIndicator.style.cssText = `
                        display:inline-flex;align-items:center;gap:4px;
                        padding:4px 8px;border-radius:4px;font-size:11px;
                        background:#3a2015;border:1px solid #5a3520;color:#C66230;
                    `;
                    tryOnIndicator.innerHTML = `<span style="font-weight:bold">${tryOnCount}</span> in try-on list`;
                    headerContainer.appendChild(tryOnIndicator);
                }
            }
        });

        modal.querySelector('#reset-tryon').addEventListener('click', () => {
            resetTryOnConfig();
            modal.remove();
            showPreview(itemId, itemName, itemPrice);
        });

        modal.querySelectorAll('.armor-preview-btn.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const slot = btn.dataset.slot;
                delete tryOnConfig[slot];
                saveTryOnConfig();
                modal.remove();
                showPreview(itemId, itemName, itemPrice);
            });
        });

        document.body.appendChild(modal);
    }


    function addButtons() {
        const isBazaar = window.location.href.includes('bazaar.php');

        if (isBazaar) {
            const bazaarItems = document.querySelectorAll('[data-testid="item"]');
            bazaarItems.forEach(item => {
                if (item.querySelector('.armor-preview-btn')) return;

                const img = item.querySelector('img[alt]');
                const itemName = img?.alt;

                const imgSrc = img?.src || '';
                const idMatch = imgSrc.match(/\/images\/items\/(\d+)\//);
                const itemId = idMatch ? parseInt(idMatch[1]) : null;

                if (itemId && itemName && isPreviewableItem(itemId)) {
                    const priceEl = item.querySelector('[data-testid="price"]');
                    const priceText = priceEl?.textContent || '';
                    const itemPrice = parsePrice(priceText);

                    const btn = document.createElement('button');
                    btn.className = 'armor-preview-btn';
                    btn.textContent = 'Try On';
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showPreview(itemId, itemName, itemPrice);
                    });

                    const controlPanel = item.querySelector('[data-testid="control-panel"]');
                    if (controlPanel) {
                        controlPanel.appendChild(btn);
                    }
                }
            });
        } else {
            const itemTiles = document.querySelectorAll('[class*="itemTile"]');
            itemTiles.forEach(item => {
                if (item.querySelector('.armor-preview-btn')) return;

                const infoBtn = item.querySelector('button[aria-controls*="itemInfo-"]');
                const match = infoBtn?.getAttribute('aria-controls')?.match(/itemInfo-(\d+)/);
                const itemId = match ? parseInt(match[1]) : null;

                const img = item.querySelector('img[alt]');
                const itemName = img?.alt;

                if (itemId && itemName && isPreviewableItem(itemId)) {
                    const priceEl = item.querySelector('[class*="priceAndTotal"]');
                    const priceText = priceEl?.textContent || '';
                    const itemPrice = parsePrice(priceText);

                    const btn = document.createElement('button');
                    btn.className = 'armor-preview-btn';
                    btn.textContent = 'Try On';
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showPreview(itemId, itemName, itemPrice);
                    });

                    const actionsWrapper = item.querySelector('[class*="actionsWrapper"]');
                    if (actionsWrapper) {
                        actionsWrapper.appendChild(btn);
                    }
                }
            });
        }
    }

    function showApiModal() {
        document.querySelectorAll('.armor-api-modal').forEach(m => m.remove());

        const modal = document.createElement('div');
        modal.className = 'armor-preview-modal armor-api-modal';
        modal.innerHTML = `
            <div style="background:#2a2a2a;border-radius:8px;padding:15px;max-width:300px;width:90%;border:1px solid #444;position:relative">
                <button class="armor-preview-close" style="width:24px;height:24px;font-size:14px;top:8px;right:10px">&times;</button>
                <h3 style="color:#fff;text-align:center;margin:0 0 12px;font-size:13px">API Key Setup</h3>
                ${API_KEY ? `
                    <div style="color:#82C91E;text-align:center;margin-bottom:10px;font-size:11px">● Connected</div>
                    <input type="text" id="api-key-input" value="${API_KEY}" style="width:100%;padding:8px;border-radius:4px;border:1px solid #555;background:#333;color:#fff;font-family:monospace;font-size:11px;box-sizing:border-box;margin-bottom:10px">
                    <div style="display:flex;gap:8px">
                        <button id="api-save-btn" class="armor-preview-btn" style="flex:1;padding:6px;font-size:11px">Save</button>
                        <button id="api-remove-btn" class="armor-preview-btn remove" style="flex:1;padding:6px;font-size:11px">Remove</button>
                    </div>
                ` : `
                    <button id="api-create-btn" class="armor-preview-btn" style="width:100%;padding:8px;margin-bottom:8px;font-size:11px;background:linear-gradient(180deg,#f90 0%,#c60 100%);border-color:#a50">
                        Create New Key (Auto)
                    </button>
                    <div style="color:#555;text-align:center;margin:6px 0;font-size:10px">— or paste existing —</div>
                    <input type="text" id="api-key-input" placeholder="API key (16 chars)" style="width:100%;padding:8px;border-radius:4px;border:1px solid #555;background:#333;color:#fff;font-family:monospace;font-size:11px;box-sizing:border-box;margin-bottom:8px">
                    <button id="api-save-btn" class="armor-preview-btn" style="width:100%;padding:6px;font-size:11px">Save Key</button>
                `}
            </div>
        `;

        modal.querySelector('.armor-preview-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

        const createBtn = modal.querySelector('#api-create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                window.open('https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=ArmorPreview&type=4&user=bazaar,equipment&market=itemmarket', '_blank');
                modal.querySelector('#api-key-input').focus();
            });
        }

        modal.querySelector('#api-save-btn').addEventListener('click', () => {
            const key = modal.querySelector('#api-key-input').value.trim();
            if (key.length === 16) {
                localStorage.setItem('tornApiKey', key);
                location.reload();
            } else {
                alert('API key must be 16 characters');
            }
        });

        const removeBtn = modal.querySelector('#api-remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                localStorage.removeItem('tornApiKey');
                location.reload();
            });
        }

        document.body.appendChild(modal);
        modal.querySelector('#api-key-input')?.focus();
    }

    function addConfigButton() {
        if (document.querySelector('.armor-preview-header-container')) return;

        const header = document.querySelector('[class*="itemsHeader"]');
        if (header) {
            const container = document.createElement('div');
            container.className = 'armor-preview-header-container';
            container.style.cssText = 'display:inline-flex;align-items:center;gap:8px;margin-left:10px;vertical-align:middle';

            const apiStatus = document.createElement('div');
            apiStatus.className = 'armor-preview-api-status';
            apiStatus.style.cssText = `
                display:inline-flex;align-items:center;gap:4px;
                padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;
                background:${API_KEY ? '#1a2e12' : '#3a2015'};
                border:1px solid ${API_KEY ? '#3a5a25' : '#5a3520'};
                color:${API_KEY ? '#82C91E' : '#C66230'};
            `;
            apiStatus.innerHTML = API_KEY
                ? '<span style="color:#82C91E">●</span> API Connected'
                : '<span style="color:#C66230">○</span> API Not Set';
            apiStatus.title = API_KEY ? 'Click to change API key' : 'Click to set your API key';
            apiStatus.addEventListener('click', showApiModal);
            container.appendChild(apiStatus);

            const tryOnCount = Object.keys(tryOnConfig).length;
            if (tryOnCount > 0) {
                const tryOnIndicator = document.createElement('div');
                tryOnIndicator.className = 'armor-preview-tryon-indicator';
                tryOnIndicator.style.cssText = `
                    display:inline-flex;align-items:center;gap:4px;
                    padding:4px 8px;border-radius:4px;font-size:11px;
                    background:#3a2015;border:1px solid #5a3520;color:#C66230;
                `;
                tryOnIndicator.innerHTML = `<span style="font-weight:bold">${tryOnCount}</span> in try-on list`;
                container.appendChild(tryOnIndicator);
            }

            header.appendChild(container);
        }
    }

    async function init() {
        await loadCurrentEquipment();
        addButtons();
        addConfigButton();
    }

    const observer = new MutationObserver(() => {
        setTimeout(() => {
            addButtons();
            addConfigButton();
        }, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(init, 500);
    setTimeout(addButtons, 1500);
    setTimeout(addButtons, 3000);
})();
