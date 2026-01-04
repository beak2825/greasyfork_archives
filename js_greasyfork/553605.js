// ==UserScript==
// @name         Halloweek - Leader Edition
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Halloweek competition tracker - hunt cursed players, claim bounties, collect enchanted pumpkins
// @author       Mistborn [3037268]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      fonts.googleapis.com
// @connect      i.ibb.co
// @connect      raw.githubusercontent.com
// @connect      torn-attack-logger-default-rtdb.europe-west1.firebasedatabase.app
// @connect      torn-pumpkins-default-rtdb.europe-west1.firebasedatabase.app
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553605/Halloweek%20-%20Leader%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/553605/Halloweek%20-%20Leader%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // FIRST LINE: Confirm script is loading
    console.log('HAL: 🎃 Halloween Targets script STARTING...');
    console.log('HAL: 🎃 User Agent:', navigator.userAgent);

    // Only run in top frame (not iframes) - prevents multiple executions
    if (window.self !== window.top) {
        console.log('HAL: ⚠️ Running in iframe - exiting');
        return;
    }

    console.log('HAL: ✅ Top frame confirmed - continuing');

    // PDA-specific duplicate execution guard
    // NOTE: Desktop uses @run-at document-start, PDA uses document-end
    // PDA sometimes executes the script multiple times - prevent this
    const isPDAUserAgent = navigator.userAgent.includes('com.manuito.tornpda');
    if (isPDAUserAgent && window.__HALLOWEEN_SCRIPT_LOADED) {
        console.log('HAL: ⚠️ PDA: Script already loaded - preventing duplicate execution');
        return;
    }
    if (isPDAUserAgent) {
        window.__HALLOWEEN_SCRIPT_LOADED = true;
    }

    // ========================================================================
    // MASTER KEY CONFIGURATION
    // ========================================================================
    // DELETE THIS SECTION (lines 27-32) for member distribution
    // ========================================================================
    const MASTER_LEADER_KEY = 'xK9mP2nQ7wR5tL3vB8';
    console.log('HAL: 🔑 MASTER_LEADER_KEY loaded:', typeof MASTER_LEADER_KEY, MASTER_LEADER_KEY);
    // ========================================================================

    // ========================================================================
    // PRELOAD CONFIGURATION (Optional)
    // ========================================================================
    // Paste exported JSON here to auto-import on first script load
    // Leaders: Use preloadLeaderConfig
    // Members: Use preloadMemberConfig (leave MASTER_LEADER_KEY section deleted)
    //
    // Example:
    // const preloadLeaderConfig = `{"version":"1.0","type":"leader",...}`;
    // const preloadMemberConfig = `{"version":"1.0","type":"member",...}`;
    //
    // Note: Arcane Rituals imports will override preloaded config
    // ========================================================================
    const preloadLeaderConfig = `{"version":"1.0","type":"leader","timestamp":1761346078585,"config":{"primaryColor":"#ff6b35","secondaryColor":"#f7931e","menuPanelImage":"icon","tileImage":"https://i.ibb.co/Jj6hKvXW/hal-tile-3-1024.jpg","factionBanner":"","factionIcon":"https://i.ibb.co/fYD8KsYX/carved-king-250.png","attackLogsFirebaseURL":"https://torn-attack-logger-default-rtdb.europe-west1.firebasedatabase.app","rtdbKey":"AIzaSyCh1KavaUIEweW-SgVbF7a4HU6cW3sn-BI","collectionsFirebaseURL":"https://torn-pumpkins-default-rtdb.europe-west1.firebasedatabase.app"},"leaderSeed":"LEADER_MGHZDOKP_6FTT5VJ6E4A","teamSeed":"T5VJ6E4A","targetPairs":["67","11","07","74","79","43","80","26","02","97","94","20","98","55","12","65","96","70","42","54"],"halloween_enchanted_pages":[{"url":"https://www.torn.com/gym.php","matchType":"exact"},{"url":"https://www.torn.com/index.php","matchType":"exact"},{"url":"https://www.torn.com/factions.php","matchType":"contains"},{"url":"https://www.torn.com/city.php","matchType":"exact"},{"url":"https://www.torn.com/item.php","matchType":"exact"},{"url":"https://www.torn.com/page.php?sid=stocks","matchType":"exact"},{"url":"https://www.torn.com/casino.php","matchType":"exact"},{"url":"https://www.torn.com/loader.php?sid=missions","matchType":"exact"},{"url":"https://www.torn.com/hospitalview.php","matchType":"exact"},{"url":"https://www.torn.com/calendar.php","matchType":"exact"},{"url":"https://www.torn.com/page.php?sid=points","matchType":"exact"},{"url":"https://www.torn.com/page.php?sid=awards","matchType":"exact"},{"url":"https://www.torn.com/page.php?sid=events","matchType":"exact"},{"url":"https://www.torn.com/page.php?sid=crimes","matchType":"contains"},{"url":"https://www.torn.com/page.php?sid=hof","matchType":"contains"},{"url":"https://www.torn.com/page.php?sid=ItemMarket","matchType":"contains"},{"url":"https://www.torn.com/forums.php","matchType":"contains"}],"halloween_excluded_ids":"1414939,1864491,2052659,2102855,2226570,2266855,2318003,2340664,2441890,2524142,2587317,2648680,2672598,2680252,2696548,2747546,2753024,2761015,2764103,2779099,2792642,2806594,2813659,2821148,3016004,3037268,3067315,3118062,3150819,3187516,3203987,3244940,3253734,3255376,3286216,3345891,3346995,3478376,3523986,3585912,3588058,3606458,3609227,3618255,3630386,3673083,3704702,3714196,3721230,3738374,3818563,3848301,3871061,3872212,42161,1059126,1368915,1722243,1987896,2124398,2194066,2269451,2304665,2360244,2413893,2416321,2483508,2487160,2576403,2589050,2621572,2637039,2678611,2727218,2744957,2769137,2771222,2776324,2777163,2777970,2788241,2797183,2797924,2800583,2803455,2805967,2807247,2810748,2816678,2828920,2829335,2851051,2860561,2901611,2902280,2909733,2984372,2989985,3126616,3196820,3200192,3676620,3897670,500544,710249,1033165,1457203,2219725,2219828,2234600,2291344,2434502,2642182,2675976,2683570,2692988,2802993,2842410,2873567,2877456,2971845,3101935,3141718,3183479,3196103,3196512,3359634,3648737,15902,26376,32356,70644,95589,107581,108922,116536,117506,146014,161925,176766,179315,206777,222379,237547,242574,247024,247677,272957,305019,317322,345928,350930,356070,370000,437431,459981,522924,638316,819107,1026424,1026643,1028750,1032659,1044539,1137061,1147611,1210900,1311530,1339003,1381911,1432829,1483921,1609018,1613388,1655145,1675373,1678537,1687344,1720620,1844717,1941838,1962056,1965075,1972648,1979767,2035318,2091043,2095381,2095815,2116030,2159241,2227900,2306400,2323221,2523313,2531279,2683908,2698264,2727201,2746284,2769534,2779079,2789760,2834086,2853982,2869615,2881299,2882518,2892169,2893957,2933884,3018393,3093892,3114861,3116697,3153937,3193345,3210051,3243039,3277316,3295955,3391107,3434664,3444222,3528214,3566707,3577947,3790472,126091,1623374,1746138,1860888,1947807,2061976,2090366,2101236,2204009,2219354,2219699,2246260,2322640,2323714,2324211,2352519,2388394,2394830,2404098,2526169,2526248,2564758,2577529,2578149,2610682,2628747,2635515,2644671,2645263,2654397,2655433,2657876,2670452,2672476,2681581,2687693,2689728,2697135,2701250,2716377,2742555,2749171,2762483,2762500,2798831,2856787,2856951,2874816,2878339,2890035,2905581,2926632,2930269,2944210,2951121,2976788,2992848,2997639,3014210,3043406,3054265,3055942,3055944,3072815,3100553,3106135,3120321,3125513,3159831,3159904,3164016,3182393,3182441,3183072,3185016,3197599,3202725,3203087,3203942,3204684,3217455,3221871,3232847,3235023,3240836,3243222,3272042,3365104,3373054,3378375,3378837,3381390,3409934,3413109,3534870,3549234,3564382,3624568,3805171,3805370,3961885,287614,495897,541808,565019,877457,888456,1195126,1208073,1616537,1682869,1710336,1789340,1829786,1833178,1935190,1950274,2072463,2073441,2079229,2101473,2117233,2120121,2123435,2135154,2146718,2158896,2178769,2183408,2200342,2246548,2308219,2343072,2463218,2481410,2504458,2579012,2655482,2667449,2697817,2705305,2768124,2929494,2943143,3157631,3447281,3473783,3478763,3488006,2786549,2798649,2808334,2828174,3904136","halloweenAnnouncements":[{"message":"🎃 The Halloween Hunt is underway...","enabled":true},{"message":"👻 Defeat Spooky targets to appease the Carved King","enabled":true},{"message":"🔮 Something is brewing in the Witches Spellroom","enabled":true},{"message":"🐺 Night Stalkers are on the prowl...","enabled":true},{"message":"🎃 Have you found the collectible pumpkins? They're never too far away","enabled":true},{"message":"👑 He sees you idle… and he disapproves.","enabled":true},{"message":"👑 The Carved King demands tribute. Will you offer yours?","enabled":true},{"message":"🎃 Pumpkin Collectibles have appeared — find them before they vanish!","enabled":true},{"message":"✨ One team to rule them all — only the Carved King decides who is worthy.","enabled":true},{"message":"🪦 If you hear scratching behind your screen… it’s too late.","enabled":true},{"message":"👑 All hail the Carved King.","enabled":true},{"message":"📜 Have you solved the Carved King's riddles?","enabled":true},{"message":"👻 Your screen flickered… did you see him?","enabled":true},{"message":"📜 Slow your scrolling. The King is reading too.","enabled":true},{"message":"🪦 Do not trust the next message. It isn’t from us.","enabled":true},{"message":"📜 He moves between the messages now.","enabled":true},{"message":"🩸 The Vampires are stirring — the scent of blood has reached them.","enabled":true},{"message":"🐺 The Werewolves are restless. Howls pierce the silence like knives.","enabled":true},{"message":"🔮 The Witches whispered your name into the mist. The mist whispered back.","enabled":true},{"message":"🧙 The Wizards found a new spell. It cost them their shadows.","enabled":true},{"message":"👑 The King is amused by your struggle. Keep fighting, little monsters.","enabled":true},{"message":"🏆 The throne creaks — he’s waiting for a champion.","enabled":true},{"message":"🍭 Trick or Treat - Are you brave enough to spin the wheel?","enabled":true},{"message":"📙 The Grimoire is active. Open it and be enlightened.","enabled":true},{"message":"🎯 The King demands for his bounties to be claimed.","enabled":true},{"message":"🎯 Unclaimed bounties expire at dawn. The King does not wait.","enabled":true},{"message":"⚰️ The leaderboard shifted. Someone offered a great tribute.","enabled":true},{"message":"🐺 The Werewolves smell weakness. Prove them wrong. ","enabled":true},{"message":"🔮 The Witches pulled ahead while you were sleeping.","enabled":true},{"message":"🦇 The Vampires haven't stopped hunting. Have you?","enabled":true},{"message":"🧙 The Wizards' power grows. Can you feel the arcane shift?","enabled":true},{"message":"🐺 The Werewolves hunt in packs. Your team needs you.","enabled":true},{"message":"👑 You're reading this. He's reading you.","enabled":true},{"message":"💀 Don't look at the reflection in your screen. Not yet.","enabled":true},{"message":"👑 You just thought about closing this tab. He felt that.","enabled":true},{"message":"🎃 The walls in your room are the same distance apart as yesterday. Probably.","enabled":true},{"message":"🌬️ Something just touched the back of your neck. Probably just a draft.","enabled":true},{"message":"💀 You've cleared your throat 6 times in the last hour. Nervous? You should be.","enabled":true},{"message":"✨ Your last 6 clicks formed a sigil. You didn't mean to draw it. It's too late now.","enabled":true},{"message":"✨ You found a pumpkin that wasn't supposed to spawn for 3 more hours. Keep it. Say nothing.","enabled":true},{"message":"🎃 Your pumpkin collection empowers your team. Every. Single. One.","enabled":true},{"message":"🎃 Five pumpkin varieties. Each one strengthens your covenant. Hunt them all.","enabled":true},{"message":"🕯️ The candles in the throne room just went out. All 847 of them. Simultaneously.","enabled":true},{"message":"🏆 Your covenant is in the Top 5!","enabled":true},{"message":"🔮 The Witches chant your team's name. It's either a blessing or a hex. Time will tell.","enabled":true},{"message":"👆 Your cursor hesitated over that button. Indecision. The King finds it endearing.","enabled":true},{"message":"🎵  Only the brave have Spectral Echoes enabled.","enabled":true},{"message":"🏆 Second place is first loser. The Carved King knows this. Do you?","enabled":true},{"message":"🎃 Corrupt Pumpkins are rare. Gold Pumpkins are rarer. Your chance of winning is rarest.","enabled":true},{"message":"🎯 The King's bounties test your worth. Have you proven yours today?","enabled":true},{"message":"📜 The Grimoire doesn't give answers. It gives clues. The worthy solve them.","enabled":true},{"message":"👑 Your device knows your patterns. The King knows your device. Do the math.","enabled":true},{"message":"👑 You just second-guessed yourself. Good instinct.","enabled":true},{"message":"👀 You're watching the screen. The screen is watching you. The King is watching both.","enabled":true},{"message":"🪦 Idle hands carve nothing. Idle players earn nothing. The throne remembers inaction.","enabled":true},{"message":"💀 Procrastination tastes like defeat.","enabled":true},{"message":"🎃 A Gold Pumpkin appeared for someone. It wasn't you. How does that feel?","enabled":true},{"message":"🕯️ The King lit a candle for your effort. Then he blew it out. Earn it back.","enabled":true},{"message":"👻 Every profile could be marked. Every click could be victory.","enabled":true},{"message":"🎃 Your collection is incomplete. The King notices gaps more than achievements.","enabled":true},{"message":"🪦 Glory is carved, not given. Your chisel is your mouse. Get to work.","enabled":true}],"dateAnnouncements":[{"message":"🌘 The first night has fallen, the hunt is underway...","date":"26/10/2025"},{"message":"🌑 The second night has fallen, did you give it your all yesterday?","date":"27/10/2025"},{"message":"🌒 Three nights down, four remain - are you ahead or behind?","date":"28/10/2025"},{"message":"🌓 Four nights behind you, three ahead - are you doing enough to win?","date":"29/10/2025"},{"message":"🌔 Five nights down, two remain - Halloween Eve is here...","date":"30/10/2025"},{"message":"🌕 The last night is almost upon us, this is your final chance...","date":"31/10/2025"}],"tickerSettings":{"duration":7,"frequency":21,"color":"#ff6b35"},"competitionSettings":{"startDate":"2025-10-25","startTime":"16:00","duration":7,"collectionsFirebaseURL":"https://torn-pumpkins-default-rtdb.europe-west1.firebasedatabase.app","active":true,"testingMode":false},"spookyTargetsSettings":{"startDate":"2025-10-25","startTime":"16:00","endDate":"2025-11-01","endTime":"16:00","active":true},"effectSettings":{"spooky":{"effectType":"emoji","customImageUrl":"https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png","maxScale":"2.5"},"bounty":{"effectType":"image","customImageUrl":"https://i.ibb.co/V0G9HNP5/hallo-bountyv5.png","maxScale":"1.5","glowEnabled":"true","glowColor":"#d10000"}},"bountyConfig":{"active":true,"testing":false,"bounties":[{"url":"https://www.torn.com/profiles.php?XID=133075","date":"2025-10-25"},{"url":"https://www.torn.com/profiles.php?XID=2139951","date":"2025-10-26"},{"url":"https://www.torn.com/profiles.php?XID=3358347","date":"2025-10-27"},{"url":"https://www.torn.com/profiles.php?XID=2680594","date":"2025-10-28"},{"url":"https://www.torn.com/profiles.php?XID=3259815","date":"2025-10-29"},{"url":"https://www.torn.com/profiles.php?XID=2753024","date":"2025-10-30"}]}}`;  // Paste leader export JSON here (as string)
    const preloadMemberConfig = null;  // Paste member export JSON here (as string)
    // ========================================================================

    // ========================================================================
    // TORN PDA COMPATIBILITY LAYER
    // ========================================================================
    // Official documentation: https://github.com/Manuito83/torn-pda
    // Phase 1: Detection using user agent (safe, synchronous)
    // Phase 2: Platform readiness wait for flutterInAppWebViewPlatformReady event
    // Phase 3: HTTP adapter for PDA_httpGet/PDA_httpPost handlers
    // ========================================================================

    // Phase 1: PDA Detection
    // SAFE: User agent check - synchronous, no object access required
    const isPDA = navigator.userAgent.includes('com.manuito.tornpda');

    if (isPDA) {
        console.log('HAL: 📱 Torn PDA detected via user agent');
    }

    // PDA-safe JSON parse helper
    // PDA's GM_getValue can return the STRING "undefined" for missing keys
    // Standard || fallback doesn't work because "undefined" is truthy
    function safeParse(value, fallback) {
        return JSON.parse((value && value !== 'undefined') ? value : fallback);
    }

    // Phase 2: Platform Readiness Wait
    // MUST wait for flutterInAppWebViewPlatformReady event before calling handlers
    // Official docs: "you need to wait for the underlying Flutter InAppWebView platform to be ready"
    function waitForPDAReady() {
        return new Promise((resolve) => {
            if (!isPDA) {
                // Browser environment - ready immediately
                resolve();
                return;
            }

            console.log('HAL: 📱 Waiting for PDA platform ready event (for HTTP handlers)...');

            // PDA environment - wait for platform ready event
            window.addEventListener('flutterInAppWebViewPlatformReady', function() {
                console.log('HAL: 📱 PDA platform ready event received');
                resolve();
            }, { once: true });

            // Timeout fallback (2 seconds) - platform might already be ready
            setTimeout(() => {
                console.log('HAL: ⚠️ PDA platform ready timeout - proceeding with HTTP request');
                resolve();
            }, 2000);
        });
    }

    // Phase 3: HTTP Adapter for PDA
    // Wraps GM_xmlhttpRequest to use PDA handlers when in PDA environment
    // Official docs: "Both handlers return a logical response object similar to GM_xmlhttpRequest()"
    function httpRequest(config) {
        if (!isPDA) {
            // Browser - use standard GM function
            return GM_xmlhttpRequest(config);
        }

        // PDA - wait for platform ready before calling handlers
        // Platform ready is only needed for callHandler(), not GM_ functions
        waitForPDAReady().then(() => {
            const method = (config.method || 'GET').toUpperCase();
            const url = config.url;
            const headers = config.headers || {};

            if (method === 'GET') {
                // Use PDA_httpGet handler
                window.flutter_inappwebview.callHandler('PDA_httpGet', url, headers)
                .then(response => {
                    // PDA response matches GM_xmlhttpRequest format
                    if (config.onload) {
                        config.onload({
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText,
                            responseHeaders: response.responseHeaders
                        });
                    }
                })
                .catch(error => {
                    console.error('HAL: 📱 PDA_httpGet error:', error);
                    if (config.onerror) {
                        config.onerror(error);
                    }
                });
        } else if (method === 'POST' || method === 'PUT') {
            // Use PDA_httpPost handler
            const body = config.data || '';
            window.flutter_inappwebview.callHandler('PDA_httpPost', url, headers, body)
                .then(response => {
                    // PDA response matches GM_xmlhttpRequest format
                    if (config.onload) {
                        config.onload({
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText,
                            responseHeaders: response.responseHeaders
                        });
                    }
                })
                .catch(error => {
                    console.error('HAL: 📱 PDA_httpPost error:', error);
                    if (config.onerror) {
                        config.onerror(error);
                    }
                });
            } else {
                // Unsupported method - fallback to GM (will likely fail in PDA but better than nothing)
                console.warn('HAL: 📱 PDA: Unsupported HTTP method', method, '- attempting GM fallback');
                return GM_xmlhttpRequest(config);
            }
        });
    }

    // ========================================================================
    // END TORN PDA COMPATIBILITY LAYER
    // ========================================================================

    // Mathematical Obfuscation Core - Anti-Reverse Engineering
    const HalloweenMath = {
        // Mersenne Twister chaos generator
        mersenneTwister: function(seed) {
            const mt = new Array(624);
            let index = 0;
            mt[0] = seed;
            for (let i = 1; i < 624; i++) {
                mt[i] = (1812433253 * (mt[i-1] ^ (mt[i-1] >>> 30)) + i) & 0xffffffff;
            }

            return function() {
                if (index >= 624) {
                    for (let i = 0; i < 624; i++) {
                        const y = (mt[i] & 0x80000000) + (mt[(i + 1) % 624] & 0x7fffffff);
                        mt[i] = mt[(i + 397) % 624] ^ (y >>> 1);
                        if (y % 2 !== 0) mt[i] = mt[i] ^ 0x9908b0df;
                    }
                    index = 0;
                }
                let y = mt[index++];
                y = y ^ (y >>> 11);
                y = y ^ ((y << 7) & 0x9d2c5680);
                y = y ^ ((y << 15) & 0xefc60000);
                y = y ^ (y >>> 18);
                return (y >>> 0) / 0x100000000;
            };
        },

        // Polynomial evaluation with chaos injection
        polynomial: function(x, coeffs, chaosFunc) {
            let result = 0;
            let power = 1;
            for (let i = 0; i < coeffs.length; i++) {
                const chaosBoost = 1 + chaosFunc() * 0.1;
                result += coeffs[i] * power * chaosBoost;
                power *= x;
            }
            return result;
        },

        // Multi-layer hash cascade
        hash: function(input, layers = 3) {
            let result = input;
            for (let layer = 0; layer < layers; layer++) {
                let hash = 0;
                const str = result.toString();
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                result = Math.abs(hash);
            }
            return result;
        },

        // Nested Base64 Encoding - Anti-AI Analysis Layer
        encodeNested: function(data, depth = 3) {
            let encoded = JSON.stringify(data);
            for (let i = 0; i < depth; i++) {
                encoded = btoa(encoded);
                // Inject noise patterns to confuse pattern recognition
                const noise = String.fromCharCode(65 + (i * 7) % 26);
                encoded = encoded.slice(0, i + 3) + noise + encoded.slice(i + 3);
            }
            return encoded;
        },

        decodeNested: function(encoded, depth = 3) {
            let decoded = encoded;
            for (let i = depth - 1; i >= 0; i--) {
                // Remove noise patterns
                decoded = decoded.slice(0, i + 3) + decoded.slice(i + 4);
                decoded = atob(decoded);
            }
            return JSON.parse(decoded);
        },

        // Fibonacci Sequence Integration - Mathematical Obfuscation
        fibonacci: function(n) {
            if (n <= 1) return n;
            let a = 0, b = 1, temp;
            for (let i = 2; i <= n; i++) {
                temp = a + b;
                a = b;
                b = temp;
            }
            return b;
        },

        fibonacciMatrix: function(n) {
            // Matrix exponentiation for Fibonacci - more obfuscated
            if (n === 0) return 0;
            const matrix = [[1, 1], [1, 0]];
            const result = this.matrixPower(matrix, n - 1);
            return result[0][0];
        },

        // Matrix/Vector Mathematics - Linear Algebra Obfuscation
        matrixMultiply: function(a, b) {
            const rows = a.length;
            const cols = b[0].length;
            const result = Array(rows).fill().map(() => Array(cols).fill(0));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    for (let k = 0; k < a[0].length; k++) {
                        result[i][j] += a[i][k] * b[k][j];
                    }
                }
            }
            return result;
        },

        matrixPower: function(matrix, n) {
            if (n === 1) return matrix;
            if (n % 2 === 0) {
                const half = this.matrixPower(matrix, n / 2);
                return this.matrixMultiply(half, half);
            } else {
                return this.matrixMultiply(matrix, this.matrixPower(matrix, n - 1));
            }
        },

        vectorTransform: function(vector, transformMatrix) {
            const result = [];
            for (let i = 0; i < transformMatrix.length; i++) {
                let sum = 0;
                for (let j = 0; j < vector.length; j++) {
                    sum += transformMatrix[i][j] * vector[j];
                }
                result.push(sum);
            }
            return result;
        },

        // Advanced Entropy Generation - Multi-Source Randomness
        entropyPool: function() {
            const sources = [
                Date.now() % 982451653,
                Math.random() * 982451653,
                performance.now() % 982451653,
                (navigator.userAgent.length * 31) % 982451653,
                (window.innerWidth * window.innerHeight) % 982451653
            ];

            // Mix entropy sources using polynomial chaos
            let entropy = 0;
            const fibCoeffs = [this.fibonacci(7), this.fibonacci(11), this.fibonacci(13)];

            for (let i = 0; i < sources.length; i++) {
                entropy ^= this.polynomial(sources[i], fibCoeffs, () => Math.random());
            }

            return Math.abs(entropy) % 982451653;
        },

        // Enhanced Browser Environment Fingerprinting
        environmentFingerprint: function() {
            const features = [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                navigator.platform,
                navigator.cookieEnabled ? 'cookies' : 'nocookies',
                typeof(Worker) !== 'undefined' ? 'worker' : 'noworker',
                window.location.protocol
            ];

            let fingerprint = 0;
            for (let feature of features) {
                fingerprint = this.hash(fingerprint + feature.toString(), 2);
            }

            return fingerprint;
        },

        // Data Validation with CRC32 Checksums
        crc32: function(data) {
            const table = [];
            let crc = 0;

            // Generate CRC table
            for (let i = 0; i < 256; i++) {
                crc = i;
                for (let j = 0; j < 8; j++) {
                    crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
                }
                table[i] = crc;
            }

            // Calculate CRC32
            crc = 0xFFFFFFFF;
            const str = JSON.stringify(data);
            for (let i = 0; i < str.length; i++) {
                crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
            }
            return (crc ^ 0xFFFFFFFF) >>> 0;
        },

        validateIntegrity: function(data, expectedCrc) {
            const actualCrc = this.crc32(data);
            const timingStart = performance.now();

            // Add timing-based validation to detect debugging
            const validation = actualCrc === expectedCrc;
            const timingEnd = performance.now();

            if (timingEnd - timingStart > 50) {
                // Potential debugging detected
                return false;
            }

            return validation;
        },

        // Core target generation algorithm - Deterministic and secure
        generateTargets: function(seedString) {
            // Validate seed requirements
            if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                HalloweenDebug.log(3, '🎃 Master key not found');
                return Array(20).fill('00');
            }

            if (seedString.length < 20) {
                HalloweenDebug.log(3, '🎃 Seed too short (requires 20+ chars)');
                return Array(20).fill('00');
            }

            const primes = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107];

            // Pure deterministic seed processing (no entropy, no randomness)
            const seedHash = this.hash(seedString, 7);

            // Fibonacci-enhanced Mersenne Twister initialization (deterministic)
            const fibSeed = this.fibonacciMatrix(seedHash % 30);
            const chaos = this.mersenneTwister(fibSeed);

            // Matrix transformation for mathematical obfuscation
            const transformMatrix = [
                [this.fibonacci(7), this.fibonacci(11)],
                [this.fibonacci(13), this.fibonacci(17)]
            ];

            const targets = [];
            const usedTargets = new Set();

            for (let i = 0; i < 20; i++) {
                let targetStr;
                let attempts = 0;
                const maxAttempts = 100;

                // Keep generating until we get a unique target
                do {
                    const offset = attempts; // Add offset for uniqueness

                    // Fibonacci-enhanced coefficient generation
                    const fibBase = this.fibonacci(i + offset + 5);
                    const coeffs = [
                        Math.sin((i + offset + seedHash + fibBase) * Math.PI / this.fibonacci(10)) * 100,
                        Math.cos((i + offset + seedHash + fibBase) * Math.PI / this.fibonacci(7)) * 50,
                        Math.tan((i + offset + seedHash + fibBase) * Math.PI / this.fibonacci(13)) * 25,
                        chaos() * this.fibonacci(8)
                    ];

                    // Polynomial evaluation with deterministic chaos
                    const polyResult = this.polynomial(seedHash + i + offset + fibBase, coeffs, chaos);

                    // Vector transformation for additional obfuscation
                    const vector = [polyResult % 1000, (polyResult * chaos()) % 1000];
                    const transformedVector = this.vectorTransform(vector, transformMatrix);

                    // Multi-layer hashing with matrix results
                    const hashedResult = this.hash(Math.floor(transformedVector[0] + transformedVector[1]), 6);
                    const primeIndex = hashedResult % primes.length;

                    // Deterministic target calculation (removed entropy boost)
                    const targetDigits = (primes[primeIndex] + Math.floor(chaos() * 78)) % 100;

                    targetStr = String(targetDigits).padStart(2, '0');
                    attempts++;

                    if (attempts >= maxAttempts) {
                        HalloweenDebug.log(1, `⚠️ Max attempts reached generating unique target at index ${i}, using fallback`);
                        // Fallback: generate deterministic unique value
                        targetStr = String((seedHash + i) % 100).padStart(2, '0');
                        break;
                    }
                } while (usedTargets.has(targetStr));

                usedTargets.add(targetStr);
                targets.push(targetStr);
            }

            HalloweenDebug.log(2, `🎃 Generated ${targets.length} deterministic targets from seed`);
            return targets;
        },

        // Hash string input for seed conversion
        hashString: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash);
        }
    };

    // Lightweight Storage Encryption
    const StorageCrypto = {
        // Generate encryption key from seed + browser fingerprint
        generateKey: function(seed) {
            const fingerprint = navigator.userAgent + screen.width + screen.height;
            const combined = seed + fingerprint + 'HALLOW_CRYPT';
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
                hash = ((hash << 5) - hash + combined.charCodeAt(i)) & 0xffffffff;
            }
            return Math.abs(hash).toString(16).padStart(8, '0');
        },

        // Fast XOR encryption (Unicode-safe)
        encrypt: function(data, key) {
            const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

            // Encode Unicode to UTF-8 bytes first
            const utf8Encoded = encodeURIComponent(dataStr);

            let encrypted = '';
            for (let i = 0; i < utf8Encoded.length; i++) {
                const keyChar = key.charCodeAt(i % key.length);
                const dataChar = utf8Encoded.charCodeAt(i);
                encrypted += String.fromCharCode(dataChar ^ keyChar);
            }
            return btoa(encrypted);
        },

        // Fast XOR decryption (Unicode-safe)
        decrypt: function(encryptedData, key) {
            try {
                const encrypted = atob(encryptedData);
                let decrypted = '';
                for (let i = 0; i < encrypted.length; i++) {
                    const keyChar = key.charCodeAt(i % key.length);
                    const encChar = encrypted.charCodeAt(i);
                    decrypted += String.fromCharCode(encChar ^ keyChar);
                }

                // Decode UTF-8 bytes back to Unicode
                return decodeURIComponent(decrypted);
            } catch (e) {
                return null;
            }
        },

        // ========================================================================
        // ANIMATION CACHE SYSTEM (Obfuscated Target Encryption)
        // ========================================================================
        // These methods handle "animation caching" (actually target encryption)
        // Uses member seed as encryption key for target array decryption
        // ========================================================================

        // Derive animation cache key from seed
        deriveAnimationKey: function(seedString) {
            // Create consistent key from seed for animation state validation
            const salt = 'ANIM_CACHE_V2';
            const combined = seedString + salt;
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
                hash = ((hash << 5) - hash + combined.charCodeAt(i)) & 0xffffffff;
            }
            return Math.abs(hash).toString(16).padStart(16, '0');
        },

        // Save animation state to cache (encrypt targets)
        saveAnimationCache: function(targets, seedKey) {
            const key = this.deriveAnimationKey(seedKey);
            const targetData = JSON.stringify(targets);
            return this.encrypt(targetData, key);
        },

        // Restore animation state from cache (decrypt targets)
        restoreAnimationCache: function(encryptedCache, seedKey) {
            try {
                const key = this.deriveAnimationKey(seedKey);
                const decrypted = this.decrypt(encryptedCache, key);
                if (!decrypted) return null;
                return JSON.parse(decrypted);
            } catch (e) {
                HalloweenDebug.log(3, '🎃 Animation cache restoration failed:', e.message);
                return null;
            }
        },

        // ========================================================================
        // ENCHANTED PAGES ENCRYPTION (Similar to Animation Cache Pattern)
        // ========================================================================

        // Encrypt enchanted pages using team seed
        encryptEnchantedPages: function(pages, teamSeed) {
            const key = this.deriveAnimationKey(teamSeed);
            const pagesData = JSON.stringify(pages);
            return this.encrypt(pagesData, key);
        },

        // Decrypt enchanted pages with retry logic
        decryptEnchantedPages: function(encryptedPages, teamSeed, retryCount = 0) {
            try {
                const key = this.deriveAnimationKey(teamSeed);
                const decrypted = this.decrypt(encryptedPages, key);
                if (!decrypted || decrypted === 'undefined') {
                    if (retryCount < 3) {
                        HalloweenDebug.log(2, `🔮 Enchanted pages decryption failed, retry ${retryCount + 1}/3`);
                        // Retry after 3 seconds with fresh seed fetch
                        return new Promise(resolve => {
                            setTimeout(() => {
                                const freshSeed = SeedManager.getSeed('enchanted-pages-retry');
                                resolve(this.decryptEnchantedPages(encryptedPages, freshSeed, retryCount + 1));
                            }, 3000);
                        });
                    }
                    return null;
                }
                return JSON.parse(decrypted);
            } catch (e) {
                if (retryCount < 3) {
                    HalloweenDebug.log(2, `🔮 Enchanted pages decryption error: ${e.message}, retry ${retryCount + 1}/3`);
                    return new Promise(resolve => {
                        setTimeout(() => {
                            const freshSeed = SeedManager.getSeed('enchanted-pages-retry');
                            resolve(this.decryptEnchantedPages(encryptedPages, freshSeed, retryCount + 1));
                        }, 3000);
                    });
                }
                HalloweenDebug.log(2, `🔮 Enchanted pages decryption failed after 3 retries: ${e.message}`);
                return null;
            }
        }
    };

    // Seed Management System for Coordinated Targeting
    const SeedManager = {
        defaultSeed: 'HALLOWEEN2024_DEFAULT',
        currentSeed: null,
        cachedTargets: null,
        isLeaderMode: typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY,
        menuPanelView: GM_getValue('halloween_menu_panel_view', 'member'),
        leaderSeed: null,
        excludedPlayerIds: new Set(
            GM_getValue('halloween_excluded_ids', '').split(',').filter(Boolean)
        ),

        getSeed: function(caller = 'unknown') {
            if (this.currentSeed) {
                HalloweenDebug.log(3, `🎃 getSeed [${caller}]: returning cached seed`, this.currentSeed);
                return this.currentSeed;
            }

            // First generation - keep detailed logs at level 1
            HalloweenDebug.log(1, '🎃 getSeed: generating new seed (not cached)');

            HalloweenDebug.log(1, '🎃 getSeed: has MASTER_LEADER_KEY?', typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY);
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const leaderSeed = this.getLeaderSeed();
                HalloweenDebug.log(1, '🎃 getSeed: leaderSeed =', leaderSeed);
                // Leaders use FULL seed for target generation (required for 20+ char validation)
                this.currentSeed = leaderSeed;
                HalloweenDebug.log(1, '🎃 getSeed: using full leader seed for generation =', this.currentSeed);
            } else {
                const stored = GM_getValue('halloween_seed', null);
                HalloweenDebug.log(1, '🎃 getSeed: stored seed =', stored);
                HalloweenDebug.log(1, '🎃 getSeed: defaultSeed =', this.defaultSeed);
                this.currentSeed = stored || this.defaultSeed;
                HalloweenDebug.log(1, '🎃 getSeed: final member seed =', this.currentSeed);
            }

            HalloweenDebug.log(1, '🎃 getSeed: FINAL RESULT =', this.currentSeed);
            return this.currentSeed;
        },

        getLeaderSeed: function() {
            if (this.leaderSeed) return this.leaderSeed;

            const stored = GM_getValue('halloween_leader_seed', null);
            this.leaderSeed = stored || this.generateLeaderSeed();
            return this.leaderSeed;
        },

        generateLeaderSeed: function() {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substring(2, 15);
            const newLeaderSeed = `LEADER_${timestamp}_${random}`.toUpperCase();

            GM_setValue('halloween_leader_seed', newLeaderSeed);
            this.leaderSeed = newLeaderSeed;

            // Automatically derive and set the team seed for member panels
            const derivedTeamSeed = this.deriveTeamSeed(newLeaderSeed);
            GM_setValue('halloween_seed', derivedTeamSeed);

            // Clear current seed cache to force regeneration with new team seed
            this.currentSeed = null;
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, '🎃 Auto-derived team seed for member panels:', derivedTeamSeed);

            return newLeaderSeed;
        },

        deriveTeamSeed: function(leaderSeed) {
            // Team seed is last 8 characters of leader seed
            return leaderSeed.slice(-8);
        },

        setLeaderMode: function(enabled) {
            this.isLeaderMode = enabled;
            GM_setValue('halloween_leader_mode', enabled.toString());

            // Clear current seed to force regeneration
            this.currentSeed = null;
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, `Leader mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
            return true;
        },

        setLeaderSeed: function(newLeaderSeed) {
            if (!newLeaderSeed || typeof newLeaderSeed !== 'string') {
                console.error('🎃 Invalid leader seed format.');
                return false;
            }

            const cleanSeed = newLeaderSeed.trim().toUpperCase();
            if (cleanSeed.length < 8) {
                console.error('🎃 Leader seed too short. Must be at least 8 characters.');
                return false;
            }

            this.leaderSeed = cleanSeed;
            GM_setValue('halloween_leader_seed', cleanSeed);

            // Force regeneration of team seed and targets
            this.currentSeed = null;
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, `Leader seed updated: ${cleanSeed}`);
            return true;
        },

        setSeed: function(newSeed) {
            if (!newSeed || typeof newSeed !== 'string') {
                console.error('🎃 Invalid seed format. Must be a non-empty string.');
                return false;
            }

            const cleanSeed = newSeed.trim().toUpperCase();
            if (cleanSeed.length < 3) {
                console.error('🎃 Seed too short. Must be at least 3 characters.');
                return false;
            }

            this.currentSeed = cleanSeed;
            GM_setValue('halloween_seed', cleanSeed);

            // Clear cached targets when seed changes
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, `Seed updated to: ${cleanSeed}`);
            return true;
        },

        getTargets: function(caller = 'unknown') {
            if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                HalloweenDebug.log(3, '🎃 getTargets() requires key');
                return Array(20).fill('00');
            }

            const currentSeed = this.getSeed(caller);
            const encryptionKey = StorageCrypto.generateKey(currentSeed);

            // Return cached targets if available for current seed
            if (this.cachedTargets) {
                const storedSeed = GM_getValue('halloween_targets_seed_encrypted');
                if (storedSeed && StorageCrypto.decrypt(storedSeed, encryptionKey) === currentSeed) {
                    HalloweenDebug.log(3, `🎃 getTargets [${caller}]: using cached ${this.cachedTargets.length} targets for ${currentSeed}`);
                    return this.cachedTargets;
                } else {
                    this.cachedTargets = null;
                }
            }

            // Try to load from encrypted storage first
            const encryptedTargets = GM_getValue('halloween_targets_cache_encrypted');
            const encryptedSeed = GM_getValue('halloween_targets_seed_encrypted');

            if (encryptedTargets && encryptedSeed) {
                const decryptedSeed = StorageCrypto.decrypt(encryptedSeed, encryptionKey);
                if (decryptedSeed === currentSeed) {
                    const decryptedTargets = StorageCrypto.decrypt(encryptedTargets, encryptionKey);
                    if (decryptedTargets) {
                        try {
                            this.cachedTargets = JSON.parse(decryptedTargets);
                            HalloweenDebug.log(3, `🎃 getTargets [${caller}]: loaded ${this.cachedTargets.length} encrypted cached targets for ${currentSeed}`);
                            return this.cachedTargets;
                        } catch (e) {
                            HalloweenDebug.log(1, 'Failed to parse cached targets, regenerating');
                        }
                    }
                }
            }

            // Generate new targets for current seed
            HalloweenDebug.log(1, 'Generating new targets for seed:', currentSeed);
            const start = performance.now();
            const targets = HalloweenMath.generateTargets(currentSeed);
            const duration = performance.now() - start;

            // Cache the results with encryption
            this.cachedTargets = targets;
            const encryptedTargetsData = StorageCrypto.encrypt(JSON.stringify(targets), encryptionKey);
            const encryptedSeedData = StorageCrypto.encrypt(currentSeed, encryptionKey);

            GM_setValue('halloween_targets_cache_encrypted', encryptedTargetsData);
            GM_setValue('halloween_targets_seed_encrypted', encryptedSeedData);

            // Clean up old unencrypted storage
            localStorage.removeItem('halloween_targets_cache');
            localStorage.removeItem('halloween_targets_seed');

            HalloweenDebug.log(1, `Generated ${targets.length} target pairs in ${duration.toFixed(2)}ms`);
            HalloweenDebug.log(1, 'Target pairs generated and encrypted (hidden for competitive gameplay)');

            return targets;
        },

        clearCache: function() {
            this.cachedTargets = null;
            // Clear encrypted storage
            GM_deleteValue('halloween_targets_cache_encrypted');
            GM_deleteValue('halloween_targets_seed_encrypted');
            // Clear old unencrypted storage (migration cleanup)
            localStorage.removeItem('halloween_targets_cache');
            localStorage.removeItem('halloween_targets_seed');
            HalloweenDebug.log(1, 'Target cache cleared (encrypted storage)');
        },

        validateSeed: function(seed) {
            if (!seed || typeof seed !== 'string') return false;
            const cleaned = seed.trim();
            return cleaned.length >= 3 && cleaned.length <= 50;
        },

        getSeedInfo: function() {
            const seed = this.getSeed('getSeedInfo');
            const targets = this.getTargets('getSeedInfo');
            const cached = !!this.cachedTargets;

            const info = {
                currentSeed: seed,
                targetCount: targets.length,
                isCached: cached,
                totalPotentialTargets: targets.length * 39420, // ~39,420 players per pair
                isLeaderMode: this.isLeaderMode,
                menuPanelView: this.menuPanelView
            };

            // Only include leader-specific info if leader has the key (capability-based)
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                info.leaderSeed = this.getLeaderSeed();
                info.teamSeed = this.deriveTeamSeed(seed); // Derive 8-char team seed for member export
                info.targetPairs = targets; // Leaders can see targets
            }

            return info;
        },

        // Internal target checking - Optimized for leader/member architecture
        _checkTarget: function(playerDigits, playerID = null) {
            // Check exclusion list first (if full player ID provided)
            if (playerID && this.excludedPlayerIds.has(playerID)) {
                HalloweenDebug.log(2, `🚫 Player ${playerID} excluded from spooky targets`);
                return false;
            }

            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const targets = this.getTargets('_checkTarget');
                return targets.includes(playerDigits);
            } else {
                const encryptedCache = GM_getValue('halloween_animation_cache');
                const memberSeed = GM_getValue('halloween_seed');

                if (!encryptedCache || !memberSeed) {
                    HalloweenDebug.log(3, '🎃 Animation cache not found - member needs to import config');
                    return false;
                }

                const targets = StorageCrypto.restoreAnimationCache(encryptedCache, memberSeed);

                if (!targets || !Array.isArray(targets)) {
                    HalloweenDebug.log(3, '🎃 Failed to restore animation cache');
                    return false;
                }

                return targets.includes(playerDigits);
            }
        },

        // Legacy public method for backward compatibility (redirects to internal)
        checkTarget: function(playerDigits, playerID = null) {
            return this._checkTarget(playerDigits, playerID);
        },

        // Helper methods for exclusion list management
        addExcludedPlayer: function(playerID) {
            if (!playerID || !/^\d{5,8}$/.test(playerID)) {
                HalloweenUI.showArcaneToast('Invalid player ID format (must be 5-8 digits)', 'error');
                return false;
            }

            this.excludedPlayerIds.add(playerID);
            this.saveExclusionList();
            HalloweenUI.showArcaneToast(`✅ Player ${playerID} added to exclusion list`, 'success');
            HalloweenDebug.log(1, `🚫 Added player ${playerID} to exclusion list`);
            return true;
        },

        removeExcludedPlayer: function(playerID) {
            if (!playerID || !/^\d{5,8}$/.test(playerID)) {
                HalloweenUI.showArcaneToast('Invalid player ID format (must be 5-8 digits)', 'error');
                return false;
            }

            const existed = this.excludedPlayerIds.delete(playerID);
            if (existed) {
                this.saveExclusionList();
                HalloweenUI.showArcaneToast(`✅ Player ${playerID} removed from exclusion list`, 'success');
                HalloweenDebug.log(1, `🚫 Removed player ${playerID} from exclusion list`);
            } else {
                HalloweenUI.showArcaneToast(`Player ${playerID} was not in exclusion list`, 'warning');
            }
            return existed;
        },

        saveExclusionList: function() {
            const csv = Array.from(this.excludedPlayerIds).join(',');
            GM_setValue('halloween_excluded_ids', csv);
            HalloweenDebug.log(2, `🚫 Saved ${this.excludedPlayerIds.size} excluded player IDs to storage`);
        },

        loadExclusionList: function() {
            this.excludedPlayerIds = new Set(
                GM_getValue('halloween_excluded_ids', '').split(',').filter(Boolean)
            );
            HalloweenDebug.log(2, `🚫 Loaded ${this.excludedPlayerIds.size} excluded player IDs from storage`);
        },

        validateAndCleanExclusionList: function(input) {
            const ids = input.split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0);

            const valid = [];
            const invalid = [];

            ids.forEach(id => {
                if (/^\d{5,8}$/.test(id)) {
                    valid.push(id);
                } else {
                    invalid.push(id);
                }
            });

            return {
                valid,
                invalid,
                validCount: valid.length,
                invalidCount: invalid.length,
                cleanedCSV: valid.join(',')
            };
        }
    };

    // Faction Configuration System for Leader Customization
    const FactionConfig = {
        defaultConfig: {
            primaryColor: '#ff6b35',
            secondaryColor: '#f7931e',
            menuPanelImage: 'icon',
            tileImage: 'https://i.ibb.co/YBgXYFzf/hallow-tile.png',
            factionBanner: '',
            factionIcon: 'https://i.ibb.co/fYD8KsYX/carved-king-250.png',
            attackLogsFirebaseURL: 'https://torn-attack-logger-default-rtdb.europe-west1.firebasedatabase.app',
            rtdbKey: '',
            collectionsFirebaseURL: 'https://torn-pumpkins-default-rtdb.europe-west1.firebasedatabase.app'
        },

        getConfig: function() {
            const stored = GM_getValue('halloween_faction_config', null);
            if (stored && stored !== 'undefined') {
                try {
                    return { ...this.defaultConfig, ...JSON.parse(stored) };
                } catch (e) {
                    console.warn('🎃 Invalid faction config, using defaults');
                }
            }
            return { ...this.defaultConfig };
        },

        setConfig: function(newConfig) {
            const currentConfig = this.getConfig();
            const updatedConfig = { ...currentConfig, ...newConfig };

            GM_setValue('halloween_faction_config', JSON.stringify(updatedConfig));
            this.applyConfig(updatedConfig);

            HalloweenDebug.log(2, 'Faction config updated:', updatedConfig);
            return updatedConfig;
        },

        applyConfig: function(config = null) {
            const actualConfig = config || this.getConfig();

            // Update CSS custom properties for dynamic theming
            const root = document.documentElement;
            root.style.setProperty('--halloween-primary', actualConfig.primaryColor);
            root.style.setProperty('--halloween-secondary', actualConfig.secondaryColor);

            // Update pumpkin trigger if custom icon is set
            this.updateTriggerIcon(actualConfig.factionIcon);

            HalloweenDebug.log(2, 'Applied faction config');
        },

        updateTriggerIcon: function(iconUrl) {
            const trigger = document.getElementById('halloween-pumpkin-trigger');
            if (trigger) {
                // Responsive sizing: 90px for desktop (768+), 75px for mobile
                const isDesktop = window.innerWidth >= 768;
                const size = isDesktop ? 90 : 75;

                if (iconUrl && iconUrl.trim()) {
                    trigger.innerHTML = `<img src="${iconUrl}" style="width: ${size}px; height: ${size}px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(255, 107, 53, 1)) drop-shadow(0 0 22px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 33px rgba(255, 69, 0, 0.7));">`;
                } else {
                    // Use carved king as default instead of emoji
                    trigger.innerHTML = `<img src="https://i.ibb.co/fYD8KsYX/carved-king-250.png" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 10px rgba(255, 107, 53, 1)) drop-shadow(0 0 22px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 33px rgba(255, 69, 0, 0.7));">`;
                }
            }
        },

        applyCustomBackground: function(imageUrl) {
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Wait for Torn to load before applying tile on mobile
                this.waitForTornAndApplyTile(imageUrl);
                return;
            }

            // Desktop: immediate application
            this.applyTileBackground(imageUrl);
        },

        waitForTornAndApplyTile: function(imageUrl) {
            // Check if Torn element exists (indicates CSS loaded)
            const checkTornLoaded = () => {
                const tornElement = document.querySelector('.header-wrapper-bottom') || document.querySelector('#sidebarroot');
                if (tornElement) {
                    this.applyTileBackground(imageUrl);
                    return true;
                }
                return false;
            };

            // Try immediately
            if (checkTornLoaded()) return;

            // Poll every 50ms, timeout after 3 seconds
            let attempts = 0;
            const maxAttempts = 60; // 3 seconds / 50ms
            const interval = setInterval(() => {
                if (checkTornLoaded() || attempts >= maxAttempts) {
                    clearInterval(interval);
                }
                attempts++;
            }, 50);
        },

        applyTileBackground: function(imageUrl) {
            // ALWAYS re-add body class (gets wiped on page navigation)
            document.body.classList.add('halloween-target');

            // Check if CSS re-injection can be skipped
            const existingStyle = document.getElementById('halloween-background-override');
            if (this._cachedTileUrl === imageUrl && existingStyle) {
                // URL unchanged and style exists - skip re-injection
                return;
            }

            // Need to inject CSS (URL changed or style missing)
            if (existingStyle) existingStyle.remove();

            const style = document.createElement('style');
            style.id = 'halloween-background-override';
            style.textContent = `
                /* Target-specific background (higher priority than generic) */
                body.halloween-target.halloween-background-enabled {
                    background-image: url('${imageUrl}') !important;
                    background-repeat: repeat !important;
                    background-attachment: scroll !important;
                }

                body.halloween-target.halloween-background-enabled .content-wrapper,
                body.halloween-target.halloween-background-enabled #mainContainer,
                body.halloween-target.halloween-background-enabled .main-container {
                    background: rgba(0, 0, 0, 0.85) !important;
                }

                /* Hide Torn custom backdrops when Halloween tile is active */
                body.halloween-target.halloween-background-enabled .backdrops-container {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);

            // Cache the URL
            this._cachedTileUrl = imageUrl;
        },

        generateExportData: function(forMembers = false) {
            const config = this.getConfig();
            const seedInfo = SeedManager.getSeedInfo();

            // Delete API collection complete flag before export (fresh state for import)
            GM_deleteValue('halloween_api_collection_complete');
            HalloweenDebug.log(2, '🔄 Deleted API collection complete flag for export');

            const exportData = {
                version: '1.0',
                type: forMembers ? 'member' : 'leader',
                timestamp: Date.now(),
                config: config
            };

            if (forMembers) {
                // Member export configuration
                const memberSeed = seedInfo.teamSeed;
                const cacheData = seedInfo.targetPairs || [];

                // Save animation state for members
                const encryptedTargets = StorageCrypto.saveAnimationCache(cacheData, memberSeed);

                // Include member configuration
                exportData.halloween_seed = memberSeed;
                exportData.halloween_animation_cache = encryptedTargets;

                // Encrypt enchanted pages for members
                if (typeof HalloweenUI !== 'undefined' &&
                    HalloweenUI.competitionSettings &&
                    HalloweenUI.competitionSettings.enchantedPages &&
                    HalloweenUI.competitionSettings.enchantedPages.length > 0) {

                    const encryptedPages = StorageCrypto.encryptEnchantedPages(
                        HalloweenUI.competitionSettings.enchantedPages,
                        memberSeed
                    );
                    exportData.halloween_enchanted_pages_encrypted = encryptedPages;
                    HalloweenDebug.log(2, `🔮 Encrypted ${HalloweenUI.competitionSettings.enchantedPages.length} enchanted pages for member export`);
                }

                // Include excluded player IDs for members
                exportData.halloween_excluded_ids = GM_getValue('halloween_excluded_ids', '');
                HalloweenDebug.log(2, `🚫 Included excluded player IDs in member export`);

                HalloweenDebug.log(2, `🎃 Member export configured with team seed`);
            } else {
                // Leader export includes full configuration
                exportData.leaderSeed = seedInfo.leaderSeed;
                exportData.teamSeed = seedInfo.teamSeed;
                if (seedInfo.targetPairs) {
                    exportData.targetPairs = seedInfo.targetPairs;
                }

                // Include enchanted pages for leaders (plain)
                if (typeof HalloweenUI !== 'undefined' &&
                    HalloweenUI.competitionSettings &&
                    HalloweenUI.competitionSettings.enchantedPages &&
                    HalloweenUI.competitionSettings.enchantedPages.length > 0) {
                    exportData.halloween_enchanted_pages = HalloweenUI.competitionSettings.enchantedPages;
                    HalloweenDebug.log(2, `🔮 Included ${HalloweenUI.competitionSettings.enchantedPages.length} enchanted pages in leader export`);
                }

                // Include excluded player IDs for leaders
                exportData.halloween_excluded_ids = GM_getValue('halloween_excluded_ids', '');
                HalloweenDebug.log(2, `🚫 Included excluded player IDs in leader export`);
            }

            // Include Halloween announcements (regular)
            const halloweenAnnouncements = HalloweenUI.halloweenAnnouncements || [];
            if (halloweenAnnouncements.length > 0) {
                if (forMembers) {
                    // Encrypt announcements for members to prevent spoiling surprises
                    const memberSeed = seedInfo.teamSeed;
                    exportData.halloween_encrypted_announcements = StorageCrypto.encrypt(halloweenAnnouncements, memberSeed);
                    HalloweenDebug.log(2, '🎃 Announcements encrypted for member export');
                } else {
                    // Leaders get plain announcements
                    exportData.halloweenAnnouncements = halloweenAnnouncements;
                }
            }

            // Include date-specific announcements
            const dateAnnouncements = HalloweenUI.dateAnnouncements || [];
            if (dateAnnouncements.length > 0) {
                if (forMembers) {
                    // Encrypt date announcements for members
                    const memberSeed = seedInfo.teamSeed;
                    exportData.halloween_encrypted_date_announcements = StorageCrypto.encrypt(dateAnnouncements, memberSeed);
                    HalloweenDebug.log(2, '🎃 Date announcements encrypted for member export');
                } else {
                    // Leaders get plain date announcements
                    exportData.dateAnnouncements = dateAnnouncements;
                }
            }

            // Include ticker timing settings
            exportData.tickerSettings = {
                duration: GM_getValue('halloween_ticker_duration', 4),
                frequency: GM_getValue('halloween_ticker_frequency', 15),
                color: GM_getValue('halloween_ticker_color', '#ff6b35')
            };

            // Include competition settings (dates for all)
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                exportData.competitionSettings = {
                    startDate: HalloweenUI.competitionSettings.startDate,
                    startTime: HalloweenUI.competitionSettings.startTime,
                    duration: HalloweenUI.competitionSettings.duration,
                    collectionsFirebaseURL: HalloweenUI.competitionSettings.collectionsFirebaseURL
                };

                // Include toggles for config portability
                if (!forMembers) {
                    exportData.competitionSettings.active = HalloweenUI.competitionSettings.active;
                    exportData.competitionSettings.testingMode = HalloweenUI.competitionSettings.testingMode;
                }
            }

            // Include spooky targets settings (dates for all)
            exportData.spookyTargetsSettings = {
                startDate: GM_getValue('halloween_spooky_start_date', ''),
                startTime: GM_getValue('halloween_spooky_start_time', '00:00'),
                endDate: GM_getValue('halloween_spooky_end_date', ''),
                endTime: GM_getValue('halloween_spooky_end_time', '23:59')
            };

            // Include active toggle for config portability
            if (!forMembers) {
                exportData.spookyTargetsSettings.active = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';
            }

            // Include effect type settings (separate for spooky and bounty)
            exportData.effectSettings = {
                spooky: {
                    effectType: GM_getValue('halloween_spooky_effect_type', 'emoji'),
                    customImageUrl: GM_getValue('halloween_spooky_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png'),
                    maxScale: GM_getValue('halloween_spooky_max_scale', '2.5')
                },
                bounty: {
                    effectType: GM_getValue('halloween_bounty_effect_type', 'emoji'),
                    customImageUrl: GM_getValue('halloween_bounty_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png'),
                    maxScale: GM_getValue('halloween_bounty_max_scale', '2.5'),
                    glowEnabled: GM_getValue('halloween_bounty_glow_enabled', 'true'),
                    glowColor: GM_getValue('halloween_bounty_glow_color', '#ff6b35')
                }
            };

            // Include bounty configuration
            const bountyConfig = BountyManager.getConfig();
            if (forMembers) {
                // Encrypt bounty config for members
                const memberBountyConfig = {
                    bounties: bountyConfig.bounties || []
                };
                const memberSeed = seedInfo.teamSeed;
                exportData.halloween_bounty_config_encrypted = StorageCrypto.encrypt(memberBountyConfig, memberSeed);
                HalloweenDebug.log(2, '🔥 Bounty config encrypted for member export');
            } else {
                // Leader export: Full config including active/testing flags
                exportData.bountyConfig = bountyConfig;
                HalloweenDebug.log(2, '🔥 Bounty config included in leader export');
            }

            // Return as string literal (with backticks) for direct copy-paste into preload section
            return '`' + JSON.stringify(exportData) + '`';
        },

        importData: function(importJson, setManualImportFlag = true) {
            try {
                // Strip backticks if present (from export format)
                let jsonString = importJson;
                if (typeof jsonString === 'string' && jsonString.startsWith('`') && jsonString.endsWith('`')) {
                    jsonString = jsonString.slice(1, -1);
                }

                const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;

                if (!data.version || !data.type) {
                    throw new Error('Invalid import format');
                }

                // ===================================
                // SMART IMPORT: Preserve competition data if seed unchanged
                // ===================================

                const currentSeedInfo = SeedManager.getSeedInfo();
                const importedSeed = data.teamSeed; // Use teamSeed for comparison (same for leaders and members)
                const isSameSeed = currentSeedInfo.currentSeed === importedSeed;

                let preservedData = null;

                if (isSameSeed && importedSeed) {
                    // Same seed - preserve competition data
                    preservedData = {
                        defeats_counted: GM_getValue('halloween_defeats_counted', '[]'),
                        verify_queue: GM_getValue('halloween_verify_queue', '[]'),
                        verify_failed: GM_getValue('halloween_verify_failed', '[]'),
                        defeats_unverified: GM_getValue('halloween_defeats_unverified', '[]'),
                        collected_pumpkins: GM_getValue('halloween_collected_pumpkins', '{}')
                    };

                    HalloweenDebug.log(1, '🔄 Smart Import: Same seed detected - preserving competition data');
                } else if (importedSeed) {
                    HalloweenDebug.log(1, '🔄 Smart Import: New seed detected - resetting competition data');
                }

                // Apply visual configuration
                if (data.config) {
                    this.setConfig(data.config);
                }

                // Handle seed configuration based on type
                if (data.type === 'leader' && data.leaderSeed) {
                    SeedManager.setLeaderSeed(data.leaderSeed);
                } else if (data.type === 'member') {

                    // Member imports: Store encrypted animation cache and seed (decryption key)
                    if (data.halloween_seed) {
                        GM_setValue('halloween_seed', data.halloween_seed);
                        HalloweenDebug.log(2, '🎃 Stored member seed (animation key)');
                    }
                    if (data.halloween_animation_cache) {
                        GM_setValue('halloween_animation_cache', data.halloween_animation_cache);
                        HalloweenDebug.log(2, '🎃 Stored animation cache (encrypted targets)');
                    }

                    // Store encrypted enchanted pages for members
                    if (data.halloween_enchanted_pages_encrypted) {
                        GM_setValue('halloween_enchanted_pages_encrypted', data.halloween_enchanted_pages_encrypted);
                        HalloweenDebug.log(2, '🔮 Stored encrypted enchanted pages (will decrypt at runtime)');
                    }

                    // Legacy support: Also check for old teamSeed format
                    if (!data.halloween_seed && data.teamSeed) {
                        GM_setValue('halloween_seed', data.teamSeed);
                        HalloweenDebug.log(2, '🎃 Stored legacy team seed');
                    }
                }

                // Restore preserved competition data if applicable
                if (preservedData) {
                    GM_setValue('halloween_defeats_counted', preservedData.defeats_counted);
                    GM_setValue('halloween_verify_queue', preservedData.verify_queue);
                    GM_setValue('halloween_verify_failed', preservedData.verify_failed);
                    GM_setValue('halloween_defeats_unverified', preservedData.defeats_unverified);
                    GM_setValue('halloween_collected_pumpkins', preservedData.collected_pumpkins);

                    HalloweenDebug.log(1, '✅ Smart Import: Competition data preserved');
                }

                // Import Halloween announcements (regular) if present
                if (data.halloween_encrypted_announcements) {
                    // Member import: Decrypt announcements with team seed
                    const teamSeed = data.halloween_seed || GM_getValue('halloween_seed', '');
                    if (teamSeed) {
                        const decryptedStr = StorageCrypto.decrypt(data.halloween_encrypted_announcements, teamSeed);
                        if (decryptedStr) {
                            try {
                                const decryptedAnnouncements = JSON.parse(decryptedStr);
                                HalloweenUI.halloweenAnnouncements = decryptedAnnouncements;
                                HalloweenUI.saveHalloweenAnnouncements();
                                HalloweenDebug.log(1, `🎃 Decrypted and imported ${decryptedAnnouncements.length} Halloween announcements`);
                            } catch (e) {
                                HalloweenDebug.log(1, '⚠️ Failed to parse decrypted announcements');
                            }
                        } else {
                            HalloweenDebug.log(1, '⚠️ Failed to decrypt announcements');
                        }
                    }
                } else if (data.halloweenAnnouncements && Array.isArray(data.halloweenAnnouncements)) {
                    // Leader import: Plain announcements
                    HalloweenUI.halloweenAnnouncements = data.halloweenAnnouncements;
                    HalloweenUI.saveHalloweenAnnouncements();
                    HalloweenDebug.log(1, `🎃 Imported ${data.halloweenAnnouncements.length} Halloween announcements`);
                }

                // Import date-specific announcements if present
                if (data.halloween_encrypted_date_announcements) {
                    // Member import: Decrypt date announcements with team seed
                    const teamSeed = data.halloween_seed || GM_getValue('halloween_seed', '');
                    if (teamSeed) {
                        const decryptedStr = StorageCrypto.decrypt(data.halloween_encrypted_date_announcements, teamSeed);
                        if (decryptedStr) {
                            try {
                                const decryptedDateAnnouncements = JSON.parse(decryptedStr);
                                HalloweenUI.dateAnnouncements = decryptedDateAnnouncements;
                                HalloweenUI.saveDateAnnouncements();
                                HalloweenDebug.log(1, `🎃 Decrypted and imported ${decryptedDateAnnouncements.length} date-specific announcements`);
                            } catch (e) {
                                HalloweenDebug.log(1, '⚠️ Failed to parse decrypted date announcements');
                            }
                        } else {
                            HalloweenDebug.log(1, '⚠️ Failed to decrypt date announcements');
                        }
                    }
                } else if (data.dateAnnouncements && Array.isArray(data.dateAnnouncements)) {
                    // Leader import: Plain date announcements
                    HalloweenUI.dateAnnouncements = data.dateAnnouncements;
                    HalloweenUI.saveDateAnnouncements();
                    HalloweenDebug.log(1, `🎃 Imported ${data.dateAnnouncements.length} date-specific announcements`);
                }

                // Import enchanted pages (leader import: plain pages)
                if (data.halloween_enchanted_pages && Array.isArray(data.halloween_enchanted_pages) && data.type === 'leader') {
                    if (typeof HalloweenUI !== 'undefined') {
                        HalloweenUI.competitionSettings = HalloweenUI.competitionSettings || {};
                        HalloweenUI.competitionSettings.enchantedPages = data.halloween_enchanted_pages;
                        GM_setValue('halloween_enchanted_pages', JSON.stringify(data.halloween_enchanted_pages));
                        HalloweenDebug.log(1, `🔮 Imported ${data.halloween_enchanted_pages.length} enchanted pages`);
                    }
                }

                // Import excluded player IDs (both member and leader)
                if (data.halloween_excluded_ids !== undefined) {
                    GM_setValue('halloween_excluded_ids', data.halloween_excluded_ids || '');
                    SeedManager.loadExclusionList(); // Reload in-memory Set
                    const count = data.halloween_excluded_ids ? data.halloween_excluded_ids.split(',').filter(Boolean).length : 0;
                    HalloweenDebug.log(1, `🚫 Imported ${count} excluded player IDs`);
                }

                // Import ticker timing settings if present
                if (data.tickerSettings) {
                    GM_setValue('halloween_ticker_duration', data.tickerSettings.duration);
                    GM_setValue('halloween_ticker_frequency', data.tickerSettings.frequency);
                    if (data.tickerSettings.color) {
                        GM_setValue('halloween_ticker_color', data.tickerSettings.color);
                        HalloweenUI.tickerColor = data.tickerSettings.color;
                    }
                    HalloweenUI.tickerDuration = data.tickerSettings.duration * 1000; // Convert to ms
                    HalloweenUI.tickerFrequency = data.tickerSettings.frequency * 1000; // Convert to ms
                    HalloweenDebug.log(1, `🎃 Imported ticker settings: ${data.tickerSettings.duration}s display, ${data.tickerSettings.frequency}s cycle, ${data.tickerSettings.color || '#ff6b35'} color`);
                }

                // Import competition settings if present
                if (data.competitionSettings) {
                    if (typeof HalloweenUI !== 'undefined') {
                        HalloweenUI.competitionSettings = HalloweenUI.competitionSettings || {};

                        // Import dates for everyone (leaders and members)
                        HalloweenUI.competitionSettings.startDate = data.competitionSettings.startDate || '';
                        HalloweenUI.competitionSettings.startTime = data.competitionSettings.startTime || '18:00';
                        HalloweenUI.competitionSettings.duration = data.competitionSettings.duration || 7;
                        HalloweenUI.competitionSettings.collectionsFirebaseURL = data.competitionSettings.collectionsFirebaseURL || '';

                        // Import toggles for leaders only (members get defaults)
                        if (data.type === 'leader') {
                            HalloweenUI.competitionSettings.active = data.competitionSettings.active || false;
                            HalloweenUI.competitionSettings.testingMode = data.competitionSettings.testingMode || false;
                        } else {
                            // Members: Always active (dates control when features work)
                            HalloweenUI.competitionSettings.active = true;
                            HalloweenUI.competitionSettings.testingMode = false;
                            HalloweenUI.competitionSettings.testingDisplay = 'single';
                            HalloweenUI.competitionSettings.testingTestPagesOnly = false;
                            HalloweenUI.competitionSettings.testingRespawnAllowed = false;
                        }

                        // Save to GM storage
                        HalloweenUI.saveCompetitionSettings();

                        // Update UI
                        HalloweenUI.updateManifestationsUI();

                        HalloweenDebug.log(1, `🔮 Imported competition settings: ${data.competitionSettings.duration}-day competition starting ${data.competitionSettings.startDate} ${data.competitionSettings.startTime} GMT`);
                    }
                }

                // Import spooky targets settings if present
                if (data.spookyTargetsSettings) {
                    // Import dates for everyone (leaders and members)
                    GM_setValue('halloween_spooky_start_date', data.spookyTargetsSettings.startDate || '');
                    GM_setValue('halloween_spooky_start_time', data.spookyTargetsSettings.startTime || '00:00');
                    GM_setValue('halloween_spooky_end_date', data.spookyTargetsSettings.endDate || '');
                    GM_setValue('halloween_spooky_end_time', data.spookyTargetsSettings.endTime || '23:59');

                    // Import toggle for leaders only
                    if (data.type === 'leader' && data.spookyTargetsSettings.active !== undefined) {
                        GM_setValue('halloween_spooky_targets_active', (data.spookyTargetsSettings.active || false).toString());
                    }

                    // Re-evaluate spooky targets state
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    HalloweenDebug.log(1, `🎯 Imported spooky targets dates: ${data.spookyTargetsSettings.startDate} ${data.spookyTargetsSettings.startTime} - ${data.spookyTargetsSettings.endDate} ${data.spookyTargetsSettings.endTime}`);
                }

                // Members: Force all testing modes OFF (dates control activation)
                if (data.type === 'member') {
                    GM_setValue('halloween_spooky_testing_mode', 'false');
                    GM_setValue('halloween_api_testing_mode', false);
                    HalloweenDebug.log(2, '🔒 Member import: All testing modes disabled');
                }

                // Import effect settings if present
                if (data.effectSettings) {
                    // New format: separate spooky and bounty settings
                    if (data.effectSettings.spooky) {
                        if (data.effectSettings.spooky.effectType) {
                            GM_setValue('halloween_spooky_effect_type', data.effectSettings.spooky.effectType);
                        }
                        if (data.effectSettings.spooky.customImageUrl) {
                            GM_setValue('halloween_spooky_custom_image_url', data.effectSettings.spooky.customImageUrl);
                        }
                        if (data.effectSettings.spooky.maxScale) {
                            GM_setValue('halloween_spooky_max_scale', data.effectSettings.spooky.maxScale);
                        }
                        HalloweenDebug.log(1, `🎃 Imported spooky effect settings: ${data.effectSettings.spooky.effectType}`);
                    }
                    if (data.effectSettings.bounty) {
                        if (data.effectSettings.bounty.effectType) {
                            GM_setValue('halloween_bounty_effect_type', data.effectSettings.bounty.effectType);
                        }
                        if (data.effectSettings.bounty.customImageUrl) {
                            GM_setValue('halloween_bounty_custom_image_url', data.effectSettings.bounty.customImageUrl);
                        }
                        if (data.effectSettings.bounty.maxScale) {
                            GM_setValue('halloween_bounty_max_scale', data.effectSettings.bounty.maxScale);
                        }
                        if (data.effectSettings.bounty.glowEnabled !== undefined) {
                            GM_setValue('halloween_bounty_glow_enabled', data.effectSettings.bounty.glowEnabled);
                        }
                        if (data.effectSettings.bounty.glowColor) {
                            GM_setValue('halloween_bounty_glow_color', data.effectSettings.bounty.glowColor);
                        }
                        HalloweenDebug.log(1, `🔥 Imported bounty effect settings: ${data.effectSettings.bounty.effectType}`);
                    }
                    // Legacy format support (old single effect type)
                    if (data.effectSettings.effectType && !data.effectSettings.spooky) {
                        GM_setValue('halloween_spooky_effect_type', data.effectSettings.effectType);
                        GM_setValue('halloween_bounty_effect_type', data.effectSettings.effectType);
                        HalloweenDebug.log(1, `🎨 Imported legacy effect settings: ${data.effectSettings.effectType}`);
                    }
                }

                // Import bounty configuration
                if (data.halloween_bounty_config_encrypted && data.type === 'member') {
                    // Member import: Decrypt bounty config with team seed
                    const teamSeed = data.halloween_seed || GM_getValue('halloween_seed', '');
                    if (teamSeed) {
                        const decryptedStr = StorageCrypto.decrypt(data.halloween_bounty_config_encrypted, teamSeed);
                        if (decryptedStr) {
                            try {
                                const decryptedBountyConfig = JSON.parse(decryptedStr);
                                // Set safe defaults for members
                                const safeBountyConfig = {
                                    active: true,      // Always on for members (dates control when bounties show)
                                    testing: false,    // Always production mode for members (date checking enabled)
                                    bounties: decryptedBountyConfig.bounties || []
                                };
                                GM_setValue('halloween_bounty_config', JSON.stringify(safeBountyConfig));
                                HalloweenDebug.log(1, `🔥 Decrypted and imported bounty config: ${safeBountyConfig.bounties?.length || 0} bounties`);
                            } catch (e) {
                                HalloweenDebug.log(1, '⚠️ Failed to parse decrypted bounty config');
                            }
                        } else {
                            HalloweenDebug.log(1, '⚠️ Failed to decrypt bounty config');
                        }
                    }
                } else if (data.bountyConfig && data.type === 'leader') {
                    // Leader import: Plain bounty config
                    GM_setValue('halloween_bounty_config', JSON.stringify(data.bountyConfig));
                    HalloweenDebug.log(1, `🔥 Imported bounty config: ${data.bountyConfig.bounties?.length || 0} bounties`);
                }

                // Delete API collection complete flag on import (allow fresh collection)
                GM_deleteValue('halloween_api_collection_complete');
                HalloweenDebug.log(2, '🔄 Deleted API collection complete flag for fresh collection');

                // Set manual import flag if this is a user-initiated import (not auto-import)
                if (setManualImportFlag) {
                    GM_setValue('halloween_manual_import_done', true);
                    HalloweenDebug.log(2, '🎃 Manual import flag set - preload will be skipped on future loads');
                }

                HalloweenDebug.log(1, `🎃 Successfully imported ${data.type} configuration`);
                return true;

            } catch (error) {
                console.error('🎃 Import failed:', error.message);
                return false;
            }
        }
    };

    // Daily Bounties System for Targeted Daily Challenges
    const BountyManager = {
        getConfig: function() {
            const defaultConfig = {
                active: false,
                testing: false,
                bounties: [] // {url: string, date: string}[], max 7
            };
            const saved = GM_getValue('halloween_bounty_config', null);
            return (saved && saved !== 'undefined') ? JSON.parse(saved) : defaultConfig;
        },

        setConfig: function(config) {
            // Limit to 7 bounties
            if (config.bounties && config.bounties.length > 7) {
                config.bounties = config.bounties.slice(0, 7);
            }
            GM_setValue('halloween_bounty_config', JSON.stringify(config));
            HalloweenDebug.log(2, 'Bounty config saved:', config);
        },

        getClaims: function() {
            const saved = GM_getValue('halloween_bounty_claims', '{}');
            return safeParse(saved, '{}');
        },

        setClaim: function(playerID, claimData) {
            const claims = this.getClaims();
            claims[playerID] = claimData;
            GM_setValue('halloween_bounty_claims', JSON.stringify(claims));
            HalloweenDebug.log(2, 'Bounty claim saved for player:', playerID, claimData);
        },

        getClaim: function(playerID) {
            const claims = this.getClaims();
            return claims[playerID] || null;
        },

        getTodaysBounties: function() {
            const config = this.getConfig();
            if (!config.active) return [];

            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            return config.bounties.filter(bounty => {
                if (!bounty.url || !bounty.date) return false;
                // In testing mode, return all bounties
                if (config.testing) return true;
                // Otherwise, only return bounties for today
                return bounty.date === today;
            });
        },

        getActiveBounty: function(profileURL) {
            const todaysBounties = this.getTodaysBounties();

            // Extract player ID from URL (supports both profile and attack page URLs)
            // Profile: profiles.php?XID=12345
            // Attack: loader.php?sid=attack&user2ID=12345
            let urlMatch = profileURL.match(/XID=(\d+)/);

            // If no XID found, check if it's an attack page with user2ID
            if (!urlMatch && profileURL.includes('sid=attack')) {
                urlMatch = profileURL.match(/user2ID=(\d+)/);
            }

            if (!urlMatch) return null;
            const profileID = urlMatch[1];

            // Check if this profile matches any of today's bounties
            for (const bounty of todaysBounties) {
                const bountyMatch = bounty.url.match(/XID=(\d+)/);
                if (bountyMatch && bountyMatch[1] === profileID) {
                    return bounty;
                }
            }
            return null;
        },

        extractPlayerID: function(url) {
            const match = url.match(/XID=(\d+)/);
            return match ? match[1] : null;
        },

        // ===================================
        // VERIFICATION METHODS
        // ===================================

        /**
         * Get all bounties that need verification (encountered but not verified)
         * @returns {Array} Array of {playerID, date, encounterTime, scheduledCheck}
         */
        getUnverifiedBounties: function() {
            const claims = this.getClaims();
            const unverified = [];

            for (const [playerID, claimData] of Object.entries(claims)) {
                if (!claimData.verified && !claimData.missed) {
                    unverified.push({
                        playerID: playerID,
                        date: claimData.date,
                        encounterTime: claimData.encounterTime,
                        scheduledCheck: claimData.scheduledCheck
                    });
                }
            }

            return unverified;
        },

        /**
         * Get bounties for a specific date that need verification
         * @param {string} date - YYYY-MM-DD format
         * @returns {Array} Array of player IDs
         */
        getUnverifiedBountiesForDate: function(date) {
            const unverified = this.getUnverifiedBounties();
            return unverified.filter(b => b.date === date).map(b => b.playerID);
        },

        /**
         * Mark a bounty as verified with attack data
         * @param {string} playerID
         * @param {Object} attackData - {result, timestamp, respect}
         */
        markBountyVerified: function(playerID, attackData) {
            let claim = this.getClaim(playerID);

            // Create claim if it doesn't exist (API mode can verify without encounter)
            if (!claim) {
                claim = {
                    playerID: playerID,
                    claimedAt: Date.now()
                };
            }

            claim.verified = true;
            claim.verifiedAt = Date.now();
            claim.attackData = attackData;
            delete claim.scheduledCheck; // No longer needed

            this.setClaim(playerID, claim);
            HalloweenDebug.log(1, `✅ Bounty verified for player ${playerID} (${attackData.result})`);

            // Update member panel display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                HalloweenUI.updateBountiesClaimed();
            }

            return true;
        },

        /**
         * Mark a bounty as missed (day passed, no attack found)
         * @param {string} playerID
         */
        markBountyMissed: function(playerID) {
            let claim = this.getClaim(playerID);

            // Create claim if it doesn't exist (API mode can mark missed without encounter)
            if (!claim) {
                claim = {
                    playerID: playerID,
                    claimedAt: Date.now()
                };
            }

            claim.missed = true;
            claim.missedAt = Date.now();
            delete claim.scheduledCheck; // No longer needed

            this.setClaim(playerID, claim);
            HalloweenDebug.log(1, `⏭️ Bounty marked as missed for player ${playerID}`);

            // Update member panel display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                HalloweenUI.updateBountiesClaimed();
            }

            return true;
        },

        /**
         * Get timestamp of last spooky verification run (for piggyback decision)
         * @returns {number} Unix timestamp in seconds
         */
        getLastSpookyVerificationTime: function() {
            return GM_getValue('halloween_last_spooky_verification', 0);
        },

        /**
         * Update timestamp of last spooky verification run
         * @param {number} timestamp - Unix timestamp in seconds
         */
        setLastSpookyVerificationTime: function(timestamp) {
            GM_setValue('halloween_last_spooky_verification', timestamp);
        },

        /**
         * Get bounties configured for a specific date
         * @param {string} date - YYYY-MM-DD format
         * @returns {Array} Array of bounties {url, date}
         */
        getBountiesForDate: function(date) {
            const config = this.getConfig();
            if (!config.active) return [];

            return config.bounties.filter(bounty => {
                if (!bounty.url || !bounty.date) return false;
                return bounty.date === date;
            });
        },

        /**
         * Verify a single bounty using API attack data
         * @param {string} playerID - The bounty target player ID
         * @param {Object} apiAttacks - All attacks from API (from APIDefeatVerification.getAllAttacks())
         * @returns {boolean} True if bounty was verified, false otherwise
         */
        verifyBountyWithAPIData: function(playerID, apiAttacks) {
            // Get bounty from config
            const config = this.getConfig();

            // Find bounty in config (PDA-safe URL parsing)
            let bounty = null;
            for (const b of config.bounties) {
                let urlMatch = b.url.match(/XID=(\d+)/);
                if (!urlMatch) {
                    urlMatch = b.url.match(/user2ID=(\d+)/);
                }

                if (urlMatch && urlMatch[1] == playerID) {
                    bounty = b;
                    break;
                }
            }

            if (!bounty) {
                HalloweenDebug.log(2, `🔥 Bounty ${playerID} not found in config - skipping`);
                return false; // Not in config
            }

            // Check if already processed
            const claim = this.getClaim(playerID);
            if (claim?.verified) {
                HalloweenDebug.log(3, `🔥 Bounty ${playerID} already verified - skipping`);
                return false;
            }

            const bountyDate = bounty.date; // From CONFIG, not claim!

            HalloweenDebug.log(2, `🔥 Verifying bounty for player ${playerID} (date: ${bountyDate})`);

            // Get all attacks as array
            const attackValues = Object.values(apiAttacks);

            let dateWindowAttacks;
            if (config.testing) {
                // Testing mode: check ALL attacks, ignore date window
                dateWindowAttacks = attackValues;
                HalloweenDebug.log(2, `🔥 TESTING MODE: Checking all ${dateWindowAttacks.length} attacks (ignoring date window)`);
            } else {
                // Production mode: filter to attacks within the bounty's date window
                const startOfDay = new Date(bountyDate + 'T00:00:00Z').getTime() / 1000;
                const endOfDay = new Date(bountyDate + 'T23:59:59Z').getTime() / 1000;
                dateWindowAttacks = attackValues.filter(a =>
                    a.timestamp_started >= startOfDay &&
                    a.timestamp_started <= endOfDay
                );
                HalloweenDebug.log(2, `🔥 Attacks in bounty date window: ${dateWindowAttacks.length}`);
            }

            // Look for a defeat against this player (outgoing attacks only)
            // Bounties accept Assist (unlike Spooky Targets which require solo defeats)
            const BOUNTY_DEFEAT_RESULTS = ['Attacked', 'Hospitalized', 'Mugged', 'Assist'];
            const found = dateWindowAttacks.find(a =>
                a.attack_type === 'outgoing' &&  // Only count YOUR attacks
                a.defender_id == playerID &&
                BOUNTY_DEFEAT_RESULTS.includes(a.result)
            );

            if (found) {
                // VERIFIED!
                HalloweenDebug.log(1, `✅ Bounty ${playerID} verified via API: ${found.result} at ${HalloweenDebug.formatTimestamp(found.timestamp_started)}`);
                this.markBountyVerified(playerID, {
                    result: found.result,
                    timestamp: found.timestamp_started,
                    respect: found.respect || 0
                });
                return true;
            }

            HalloweenDebug.log(2, `🔥 Bounty ${playerID} not found in ${dateWindowAttacks.length} attacks (date window: ${bountyDate})`);
            return false;
        },

        /**
         * Process scheduled bounty verifications (15-min checks, retries, expiry)
         * Called periodically from background processing (every 60 seconds)
         */
        processBountyVerifications: function() {
            if (!APIDefeatVerification.isAPIMode()) return; // Only works in API mode

            const config = this.getConfig();
            if (!config.active || !config.bounties || config.bounties.length === 0) return;

            const now = Date.now();
            const apiAttacks = APIDefeatVerification.getAllAttacks();

            // ===================================
            // REGULAR CHECKS (when API refreshed)
            // ===================================

            const lastAPIRefresh = GM_getValue('halloween_api_last_refresh', 0);
            const lastBountyCheck = GM_getValue('halloween_api_last_bounty_check', 0);

            if (lastAPIRefresh > lastBountyCheck) {
                // Fresh API data! Check bounties
                GM_setValue('halloween_api_last_bounty_check', Date.now() / 1000);

                // Determine which bounties to check
                let bountiesToCheck;
                if (config.testing) {
                    // TESTING MODE: Check ALL bounties (ignore dates completely)
                    // Even if Day 2 bounty, we check if defeated ANY time
                    bountiesToCheck = config.bounties;
                    HalloweenDebug.log(2, `🔥 API bounty check (TESTING MODE): Checking ${bountiesToCheck.length} bounties (all dates, all attacks)`);
                } else {
                    // PRODUCTION: Check ALL unverified bounties (date validation happens inside verifyBountyWithAPIData)
                    bountiesToCheck = config.bounties;
                    HalloweenDebug.log(2, `🔥 API bounty check: Checking ${bountiesToCheck.length} bounties (all unverified)`);
                }

                // Check each bounty (encountered or not!)
                for (const bounty of bountiesToCheck) {
                    // Extract playerID from URL (PDA-safe pattern)
                    let urlMatch = bounty.url.match(/XID=(\d+)/);
                    if (!urlMatch) {
                        urlMatch = bounty.url.match(/user2ID=(\d+)/);
                    }

                    if (!urlMatch) {
                        HalloweenDebug.log(1, `⚠️ Could not parse player ID from bounty URL: ${bounty.url}`);
                        continue;
                    }

                    const playerID = urlMatch[1];

                    // verifyBountyWithAPIData will use testing mode setting internally
                    // Testing mode: checks ALL API attacks (ignores date)
                    // Production: checks only attacks within bounty's date window
                    this.verifyBountyWithAPIData(playerID, apiAttacks);
                }
            }

            // ===================================
            // MIDNIGHT SWEEP (mark missed ❌)
            // ===================================

            // Check if midnight sweep already ran today
            const today = new Date().toISOString().split('T')[0];
            const lastSweepDate = GM_getValue('halloween_api_last_midnight_sweep', '');

            if (lastSweepDate !== today) {
                // Sweep hasn't run today - check all past unclaimed bounties
                HalloweenDebug.log(1, `🌙 API Midnight sweep: Checking all past unclaimed bounties`);

                // Loop through all bounties in config (already sorted by date)
                for (const bounty of config.bounties) {
                    // Skip if bounty is for today or future
                    if (bounty.date >= today) continue;

                    // Extract playerID (PDA-safe)
                    let urlMatch = bounty.url.match(/XID=(\d+)/);
                    if (!urlMatch) {
                        urlMatch = bounty.url.match(/user2ID=(\d+)/);
                    }

                    if (!urlMatch) {
                        HalloweenDebug.log(1, `⚠️ Could not parse player ID from bounty URL: ${bounty.url}`);
                        continue;
                    }

                    const playerID = urlMatch[1];
                    const claim = this.getClaim(playerID);

                    // Skip if already verified (already counted)
                    if (claim?.verified) {
                        continue;
                    }

                    // Check unmarked or missed bounties (allows daily recheck for missed)
                    HalloweenDebug.log(1, `🌙 API Midnight sweep: Checking ${bounty.date} bounty (player ${playerID})`);
                    const verified = this.verifyBountyWithAPIData(playerID, apiAttacks);

                    if (verified) {
                        HalloweenDebug.log(1, `✅ API Midnight sweep: Bounty ${playerID} verified!`);
                    } else if (!claim?.missed) {
                        // Only mark as missed if not already marked
                        HalloweenDebug.log(1, `❌ API Midnight sweep: Marking bounty ${playerID} as missed`);
                        this.markBountyMissed(playerID);
                    }
                }

                // Mark sweep as complete for today
                GM_setValue('halloween_api_last_midnight_sweep', today);
                HalloweenDebug.log(1, `🌙 API Midnight sweep complete for ${today}`);
            }
        },

        /**
         * Verify all today's unclaimed bounties (called during spooky verification piggyback)
         * @param {Object} apiAttacks - All attacks from API
         * @returns {number} Number of bounties verified
         */
        verifyTodaysBounties: function(apiAttacks) {
            const config = this.getConfig();
            if (!config.active || !config.bounties || config.bounties.length === 0) {
                return 0;
            }

            // Get bounties to check from CONFIG (not claims)
            const today = new Date().toISOString().split('T')[0];
            const bountiesToCheck = [];

            for (const bounty of config.bounties) {
                // Skip bounties without URL or date
                if (!bounty.url || !bounty.date) continue;

                // Extract player ID from URL (PDA-safe)
                let urlMatch = bounty.url.match(/XID=(\d+)/);
                if (!urlMatch) {
                    urlMatch = bounty.url.match(/user2ID=(\d+)/);
                }
                if (!urlMatch) continue; // Invalid URL format

                const playerID = urlMatch[1];

                // Check if already verified (allow missed to be re-verified if evidence found)
                const claim = this.getClaim(playerID);
                if (claim?.verified) {
                    HalloweenDebug.log(3, `🔥 Skipping bounty ${playerID} - already verified`);
                    continue;
                }

                // Log if re-checking a previously missed bounty
                if (claim?.missed) {
                    HalloweenDebug.log(2, `🔄 Re-checking previously missed bounty ${playerID} - will upgrade to verified if evidence found`);
                }

                // No date filter - check ALL unverified bounties (date validation happens inside verifyBountyWithAPIData)
                bountiesToCheck.push(playerID);
            }

            if (config.testing) {
                HalloweenDebug.log(2, `🔥 Piggybacking (TESTING MODE): Checking ${bountiesToCheck.length} config bounties (all dates)`);
            } else {
                HalloweenDebug.log(2, `🔥 Piggybacking: Checking ${bountiesToCheck.length} config bounties (all unverified)`);
            }

            if (bountiesToCheck.length === 0) return 0;

            let verified = 0;
            for (const playerID of bountiesToCheck) {
                HalloweenDebug.log(2, `🔥 Checking bounty for player ${playerID}...`);
                if (this.verifyBountyWithAPIData(playerID, apiAttacks)) {
                    verified++;
                }
            }

            if (verified > 0) {
                HalloweenDebug.log(1, `🔥 Piggyback verification: ${verified} bounties verified`);
            }

            return verified;
        },

        updateBountyStatus: function() {
            const statusElement = document.getElementById('bounty-status');
            if (!statusElement) return;

            const config = this.getConfig();

            // Show testing mode indicator if active
            if (config.testing) {
                statusElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                statusElement.style.color = '#00ff00';
                return;
            }

            // Check if bounties is disabled
            if (!config.active) {
                statusElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🚫</span> Bounty Targets Disabled';
                statusElement.style.color = '#ff4444';
                return;
            }

            // Calculate which bounty number we're on based on current day
            const totalBounties = config.bounties.filter(b => b.url && b.date).length;
            if (totalBounties === 0) {
                statusElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">⚙️</span> Awaiting Configuration';
                statusElement.style.color = '#888';
                return;
            }

            // Find current bounty based on today's date
            const today = new Date().toISOString().split('T')[0];
            let currentBountyNumber = 0;
            for (let i = 0; i < config.bounties.length; i++) {
                if (config.bounties[i].date && config.bounties[i].url) {
                    if (config.bounties[i].date === today) {
                        currentBountyNumber = i + 1;
                        break;
                    }
                }
            }

            if (currentBountyNumber > 0) {
                statusElement.innerHTML = `Active: Bounty ${currentBountyNumber} of ${totalBounties}`;
                statusElement.style.color = 'var(--carved-cyan)';
            } else {
                statusElement.innerHTML = `Active: ${totalBounties} Bounties Set`;
                statusElement.style.color = 'var(--carved-cyan)';
            }
        }
    };

    // Page Detection and Performance Optimization
    const PageDetector = {
        isProfilePage: () => {
            // Match other people's profiles: /profiles.php?XID=12345
            // Match own profile patterns: /profiles.php, /profiles.php?, /profiles.php#, etc.
            return /\/profiles\.php(\?XID=(\d+))?/.test(location.href) ||
                   /\/profiles\.php($|\?|#)/.test(location.href);
        },
        isAttackPage: () => /\/loader\.php\?sid=attack&user2ID=(\d+)/.test(location.href),

        extractPlayerID: function() {
            // Extract from other people's profiles
            const profileMatch = location.href.match(/\/profiles\.php\?XID=(\d+)/);
            if (profileMatch) return profileMatch[1];

            // Extract from attack pages
            const attackMatch = location.href.match(/\/loader\.php\?sid=attack&user2ID=(\d+)/);
            if (attackMatch) return attackMatch[1];

            // For own profile (no XID in URL), try to extract from page elements
            if (this.isProfilePage() && !profileMatch) {
                // Try to find player ID from page elements
                const userInfoElement = document.querySelector('[class*="user-info"]') ||
                                      document.querySelector('[data-user]') ||
                                      document.querySelector('#profile-container [href*="XID="]');

                if (userInfoElement) {
                    const userDataMatch = userInfoElement.outerHTML.match(/XID=(\d+)/);
                    if (userDataMatch) return userDataMatch[1];
                }

                // Fallback: try to get from any link that contains XID
                const xidLink = document.querySelector('a[href*="XID="]');
                if (xidLink) {
                    const xidMatch = xidLink.href.match(/XID=(\d+)/);
                    if (xidMatch) return xidMatch[1];
                }

                HalloweenDebug.log(3, '🎯 Own profile detected but could not extract player ID from page elements');
            }

            return null;
        },

        isRelevantPage: function() {
            // Only profile and attack pages trigger target detection
            return this.isProfilePage() || this.isAttackPage();
        }
    };

    // Halloween Visual Effects and Theming
    const HalloweenEffects = {
        halloweenTileUrl: 'https://i.ibb.co/YBgXYFzf/hallow-tile.png',

        getEffectCounter: function() {
            return GM_getValue('halloween_effect_counter', 0);
        },

        setEffectCounter: function(value) {
            GM_setValue('halloween_effect_counter', value);
        },


        createSpookyEffect: function() {
            // Check effect type selection from GM storage (not DOM to support imports)
            const savedEffectType = GM_getValue('halloween_spooky_effect_type', 'emoji');
            const useImageEffect = savedEffectType === 'image';

            if (useImageEffect) {
                return this.createImageSpookyEffect();
            }

            // Default to emoji patterns
            const effects = [
                '👻💀🎃💀👻',
                '🕷️🕸️🎃🕸️🕷️',
                '🦇🌙🎃🌙🦇',
                '⚰️💀🎃💀⚰️',
                '⚰️🌙🎃🌙⚰️',
                '🦴💀🎃💀🦴'
            ];

            // Use cycling instead of random selection with localStorage persistence
            const currentCounter = this.getEffectCounter();
            const selectedEffect = effects[currentCounter % effects.length];
            this.setEffectCounter(currentCounter + 1);

            // Calculate responsive font size for mobile
            const isMobile = window.innerWidth <= 768;
            const fontSize = isMobile
                ? Math.max(20, Math.min(window.innerWidth * 0.08, 32))
                : 56;

            const effect = document.createElement('div');
            effect.className = 'halloween-spooky-effect';
            effect.innerHTML = selectedEffect;
            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
                font-size: ${fontSize}px;
                z-index: 9999;
                animation: spookyFloat 5s ease-in-out, spookyRotate 5s ease-in-out;
                pointer-events: none;
                text-shadow: 0 0 20px var(--halloween-primary);
            `;
            return effect;
        },

        // Image-based spooky effect
        createImageSpookyEffect: function() {
            const effect = document.createElement('div');
            effect.className = 'halloween-image-spooky-effect';

            // Get custom image URL from GM storage (not DOM - supports imports)
            const imageUrl = GM_getValue('halloween_spooky_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png');

            // Get max scale setting
            const maxScale = GM_getValue('halloween_spooky_max_scale', '2.5');

            effect.innerHTML = `
                <div class="halloween-image-container">
                    <img src="${imageUrl}" alt="Halloween Effect" class="halloween-skull-image" onerror="this.src='https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';">
                </div>
            `;

            // Create custom animation with max scale
            const animationName = `spookyImagePulse_${maxScale.replace('.', '_')}`;
            const styleId = `spooky-scale-style-${maxScale.replace('.', '_')}`;

            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    @keyframes ${animationName} {
                        0% {
                            opacity: 0;
                            transform: translate(-50%, -50%) scale(0.1);
                        }
                        50% {
                            opacity: 1;
                            transform: translate(-50%, -50%) scale(${maxScale});
                        }
                        100% {
                            opacity: 0;
                            transform: translate(-50%, -50%) scale(0);
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                pointer-events: none;
                animation: ${animationName} 4s ease-in-out;
            `;

            return effect;
        },

        createBountyEffect: function() {
            // Check effect type selection from GM storage (not DOM to support imports)
            const savedEffectType = GM_getValue('halloween_bounty_effect_type', 'emoji');
            const useImageEffect = savedEffectType === 'image';

            if (useImageEffect) {
                return this.createImageBountyEffect();
            }

            // Red-themed bounty emoji effects
            const effects = [
                '🔥💀🎯💀🔥',
                '⚔️🔥🎯🔥⚔️',
                '💥🔥🎯🔥💥',
                '⚡🔥🎯🔥⚡',
                '💣🔥🎯🔥💣'
            ];

            const currentCounter = this.getEffectCounter();
            const selectedEffect = effects[currentCounter % effects.length];
            this.setEffectCounter(currentCounter + 1);

            // Calculate responsive font size for mobile
            const isMobile = window.innerWidth <= 768;
            const fontSize = isMobile
                ? Math.max(20, Math.min(window.innerWidth * 0.08, 32))
                : 56;

            const effect = document.createElement('div');
            effect.className = 'halloween-bounty-effect';
            effect.innerHTML = selectedEffect;
            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
                font-size: ${fontSize}px;
                z-index: 9999;
                animation: spookyFloat 5s ease-in-out, spookyRotate 5s ease-in-out;
                pointer-events: none;
                text-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
            `;
            return effect;
        },

        createImageBountyEffect: function() {
            const effect = document.createElement('div');
            effect.className = 'halloween-image-bounty-effect';

            // Get custom image URL from GM storage (not DOM - supports imports)
            const imageUrl = GM_getValue('halloween_bounty_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png');

            // Get glow settings
            const glowEnabled = GM_getValue('halloween_bounty_glow_enabled', 'true') === 'true';
            const glowColor = GM_getValue('halloween_bounty_glow_color', '#ff6b35');
            const maxScale = GM_getValue('halloween_bounty_max_scale', '2.5');

            effect.innerHTML = `
                <div class="halloween-image-container">
                    <img src="${imageUrl}" alt="Bounty Effect" class="halloween-skull-image" onerror="this.src='https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';">
                </div>
            `;

            // Create custom animation with or without glow
            const animationName = glowEnabled ? `bountyImagePulseGlow_${glowColor.replace('#', '')}_${maxScale.replace('.', '_')}` : `bountyImagePulseNoGlow_${maxScale.replace('.', '_')}`;

            // Inject custom keyframes if glow is enabled with custom color
            if (glowEnabled) {
                const styleId = `bounty-glow-style-${glowColor.replace('#', '')}-${maxScale.replace('.', '_')}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    style.textContent = `
                        @keyframes ${animationName} {
                            0% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0.1);
                                filter: drop-shadow(0 0 5px ${glowColor}) brightness(1);
                            }
                            50% {
                                opacity: 1;
                                transform: translate(-50%, -50%) scale(${maxScale});
                                filter: drop-shadow(0 0 50px ${glowColor}) brightness(1.8);
                            }
                            100% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0);
                                filter: drop-shadow(0 0 0px ${glowColor}) brightness(1);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                // No glow animation
                const styleId = `bounty-noglow-style-${maxScale.replace('.', '_')}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    style.textContent = `
                        @keyframes ${animationName} {
                            0% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0.1);
                            }
                            50% {
                                opacity: 1;
                                transform: translate(-50%, -50%) scale(${maxScale});
                            }
                            100% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }

            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                pointer-events: none;
                animation: ${animationName} 4s ease-in-out;
            `;

            return effect;
        },

        applyHalloweenBackground: function() {
            const config = FactionConfig.getConfig();
            FactionConfig.applyCustomBackground(config.tileImage);
            HalloweenDebug.log(2, 'Applied Halloween target background tile');
        },

        applyGenericHalloweenBackground: function() {
            // Apply a generic Halloween background for all pages
            const existingGeneric = document.getElementById('halloween-generic-background');
            if (existingGeneric) existingGeneric.remove();

            const style = document.createElement('style');
            style.id = 'halloween-generic-background';
            style.textContent = `
                body.halloween-background-enabled {
                    background:
                        radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(247, 147, 30, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(139, 0, 0, 0.05) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 20, 10, 0.95) 100%) !important;
                    background-attachment: fixed !important;
                }

                body.halloween-background-enabled .content-wrapper,
                body.halloween-background-enabled #mainContainer,
                body.halloween-background-enabled .main-container {
                    background: rgba(0, 0, 0, 0.5) !important;
                }

                /* Mobile-optimized: Simplified gradients for better performance */
                @media (max-width: 768px) {
                    body.halloween-background-enabled {
                        background:
                            radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 60%),
                            linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 20, 10, 0.95) 100%) !important;
                        background-attachment: fixed !important;
                    }
                }
            `;
            document.head.appendChild(style);
            HalloweenDebug.log(3, 'Applied generic Halloween background');
        },

        addStylesheet: function() {
            HalloweenDebug.log(1, 'HAL: 🎨 HalloweenEffects.addStylesheet() starting...');
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Fjalla+One:wght@400&family=Creepster&family=Metal+Mania&display=swap');

                :root {
                    /* Carved King Theme - Spectral Gothic */
                    --carved-midnight: #0a0b2e;            /* Deep midnight blue */
                    --carved-void: #1a1b4a;                /* Medium blue-purple */
                    --carved-purple: #2a0845;              /* Deep purple */
                    --carved-cyan: #00ffff;                /* Electric cyan */
                    --carved-magenta: #ff69b4;             /* Hot magenta */
                    --carved-orange: #ff4500;              /* Vibrant orange */
                    --carved-teal: #40e0d0;                /* Teal accent */
                    --carved-text: #ffffff;                /* Pure white */
                    --carved-text-dim: #cccccc;            /* Dimmed white */
                    --carved-panel: rgba(10, 11, 46, 0.8); /* Semi-transparent panel */
                    --carved-border: rgba(0, 255, 255, 0.3); /* Cyan border */
                    --carved-glow: rgba(0, 255, 255, 0.6); /* Cyan glow */

                    /* Legacy compatibility */
                    --halloween-primary: var(--carved-cyan);
                    --halloween-secondary: var(--carved-magenta);
                    --halloween-bg: var(--carved-midnight);
                    --halloween-accent: var(--carved-orange);
                    --halloween-text: var(--carved-text);
                    --halloween-border: var(--carved-teal);
                    --halloween-hover: var(--carved-magenta);
                    --halloween-glow: var(--carved-glow);
                    --halloween-font: 'Fjalla One', 'Orbitron', sans-serif;
                }

                /* V2 Pumpkin King Animations */
                @keyframes pumpkinPulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 20px var(--carved-cyan), 0 0 40px var(--pumpkin-shadow), inset 0 0 10px rgba(0,255,255,0.1);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 30px var(--carved-magenta), 0 0 60px var(--pumpkin-glow), inset 0 0 15px rgba(255,20,147,0.2);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px var(--carved-cyan), 0 0 40px var(--pumpkin-shadow), inset 0 0 10px rgba(0,255,255,0.1);
                    }
                }

                @keyframes cyberpunkGlow {
                    0% {
                        box-shadow:
                            0 0 20px var(--carved-cyan),
                            0 0 40px var(--pumpkin-shadow),
                            inset 0 0 10px rgba(0,255,255,0.1);
                        border-color: var(--carved-cyan);
                    }
                    33% {
                        box-shadow:
                            0 0 30px var(--carved-magenta),
                            0 0 60px var(--pumpkin-glow),
                            inset 0 0 15px rgba(255,20,147,0.2);
                        border-color: var(--carved-magenta);
                    }
                    66% {
                        box-shadow:
                            0 0 25px var(--carved-cyan),
                            0 0 50px rgba(64,224,208,0.3),
                            inset 0 0 12px rgba(64,224,208,0.15);
                        border-color: var(--carved-cyan);
                    }
                    100% {
                        box-shadow:
                            0 0 20px var(--carved-cyan),
                            0 0 40px var(--pumpkin-shadow),
                            inset 0 0 10px rgba(0,255,255,0.1);
                        border-color: var(--carved-cyan);
                    }
                }

                @keyframes neonFlicker {
                    0%, 100% { opacity: 1; text-shadow: 0 0 10px var(--carved-cyan), 0 0 20px var(--carved-cyan); }
                    2% { opacity: 0.8; text-shadow: 0 0 5px var(--carved-cyan); }
                    4% { opacity: 1; text-shadow: 0 0 10px var(--carved-cyan), 0 0 20px var(--carved-cyan); }
                    6% { opacity: 0.9; text-shadow: 0 0 8px var(--carved-cyan); }
                    8% { opacity: 1; text-shadow: 0 0 10px var(--carved-cyan), 0 0 20px var(--carved-cyan); }
                }

                @keyframes flickerText {
                    0%, 94%, 100% { opacity: 1; }
                    95% { opacity: 0.8; }
                    96% { opacity: 1; }
                    97% { opacity: 0.9; }
                    98% { opacity: 1; }
                    99% { opacity: 0.95; }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
                }

                @keyframes flutter {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }

                /* Legacy compatibility animations */
                @keyframes halloweenPulse {
                    0% { transform: scale(1); opacity: 1; }
                    25% { transform: scale(1.02); opacity: 0.95; }
                    50% { transform: scale(1.08); opacity: 0.85; }
                    75% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes halloweenGlow {
                    0% { box-shadow: 0 0 30px var(--halloween-primary), inset 0 0 10px rgba(0,0,0,0.3); }
                    50% { box-shadow: 0 0 50px var(--halloween-secondary), inset 0 0 15px rgba(0,0,0,0.5); }
                    100% { box-shadow: 0 0 30px var(--halloween-primary), inset 0 0 10px rgba(0,0,0,0.3); }
                }

                @keyframes spookyFloat {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
                }

                @keyframes spookyRotate {
                    0% { filter: hue-rotate(0deg) brightness(1); }
                    33% { filter: hue-rotate(120deg) brightness(1.2); }
                    66% { filter: hue-rotate(240deg) brightness(0.8); }
                    100% { filter: hue-rotate(360deg) brightness(1); }
                }

                @keyframes halloweenImagePulse {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.1);
                        filter: drop-shadow(0 0 5px #ff6b35) brightness(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(2.5);
                        filter: drop-shadow(0 0 50px #ff6b35) brightness(1.8);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0);
                        filter: drop-shadow(0 0 0px #ff6b35) brightness(1);
                    }
                }

                .halloween-skull-image {
                    width: 120px;
                    height: 120px;
                    object-fit: contain;
                    image-rendering: -webkit-optimize-contrast;
                }


                @keyframes spookyThrob {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .halloween-target-highlight {
                    background: linear-gradient(45deg, var(--halloween-primary), var(--halloween-secondary)) !important;
                    border: 3px solid var(--halloween-primary) !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 15px var(--halloween-primary), inset 0 0 10px var(--halloween-secondary) !important;
                    position: relative !important;
                }
                .halloween-target-highlight.throb {
                    animation: spookyThrob 1.5s ease-in-out infinite !important;
                }

                .halloween-target-highlight::before {
                    content: '🎯';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    z-index: 1000;
                    animation: halloweenPulse 2s infinite;
                    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
                }

                .halloween-bounty-highlight {
                    background: linear-gradient(45deg, rgba(255, 0, 0, 0.2), rgba(255, 69, 0, 0.2)) !important;
                    border: 3px solid #ff0000 !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 15px #ff0000, inset 0 0 10px rgba(255, 69, 0, 0.5) !important;
                    position: relative !important;
                }
                .halloween-bounty-highlight.throb {
                    animation: bountyThrob 1.5s ease-in-out infinite !important;
                }

                @keyframes bountyThrob {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .halloween-bounty-highlight::before {
                    content: '⏱️';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    z-index: 1000;
                    animation: bountyPulse 2s infinite;
                    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
                }

                @keyframes bountyPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                }

                /* Attack page opponent highlighting - subtle animation */
                @keyframes attackPageThrob {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.005); }
                    100% { transform: scale(1); }
                }

                .halloween-attack-spooky-highlight {
                    border: 3px solid var(--halloween-primary) !important;
                    border-radius: 5px !important;
                    position: relative !important;
                    animation: attackPageThrob 3s ease-in-out infinite !important;
                }

                .halloween-attack-spooky-highlight::before {
                    content: '🎯';
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    font-size: 12px;
                    z-index: 1000;
                    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
                    pointer-events: none;
                }

                .halloween-attack-bounty-highlight {
                    border: 3px solid #ff0000 !important;
                    border-radius: 5px !important;
                    position: relative !important;
                    animation: attackPageThrob 3s ease-in-out infinite !important;
                }

                .halloween-attack-bounty-highlight::before {
                    content: '⏱️';
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    font-size: 12px;
                    z-index: 1000;
                    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
                    pointer-events: none;
                }

                .halloween-screen-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(circle, var(--halloween-primary) 0%, var(--halloween-secondary) 50%, rgba(0,0,0,0.1) 100%);
                    pointer-events: none;
                    z-index: 9996;
                    animation: halloweenAura 12s ease-in-out infinite;
                    opacity: 0.08;
                }

                @keyframes halloweenAura {
                    0% { opacity: 0; }
                    20% { opacity: 0.08; }
                    40% { opacity: 0.12; }
                    60% { opacity: 0.12; }
                    80% { opacity: 0.08; }
                    100% { opacity: 0; }
                }

                /* Hide number input spinners */
                #ticker-duration::-webkit-outer-spin-button,
                #ticker-duration::-webkit-inner-spin-button,
                #ticker-frequency::-webkit-outer-spin-button,
                #ticker-frequency::-webkit-inner-spin-button {
                    -webkit-appearance: none !important;
                    margin: 0 !important;
                }

                /* Halloween Competition Pumpkin Animations */
                @keyframes pumpkinThrob {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                @keyframes pumpkinGoldGlow {
                    0% { filter: drop-shadow(0 0 8px #FFD700); }
                    50% { filter: drop-shadow(0 0 15px #FFD700) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #FFD700); }
                }

                @keyframes pumpkinCorruptGlow {
                    0% { filter: drop-shadow(0 0 8px #8B0000); }
                    50% { filter: drop-shadow(0 0 15px #8B0000) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #8B0000); }
                }

                @keyframes pumpkinCyberGlow {
                    0% { filter: drop-shadow(0 0 8px #00FFFF); }
                    50% { filter: drop-shadow(0 0 15px #00FFFF) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #00FFFF); }
                }

                @keyframes pumpkinPureGlow {
                    0% { filter: drop-shadow(0 0 8px #FFFFFF); }
                    50% { filter: drop-shadow(0 0 15px #FFFFFF) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #FFFFFF); }
                }

                @keyframes pumpkinCandyGlow {
                    0% { filter: drop-shadow(0 0 8px #ff69b4); }
                    50% { filter: drop-shadow(0 0 15px #ff69b4) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #ff69b4); }
                }

                @keyframes pumpkinCollect {
                    0% { transform: scale(1) rotate(0deg); opacity: 1; }
                    25% { transform: scale(1.3) rotate(0deg); opacity: 1; }
                    100% { transform: scale(0) rotate(360deg); opacity: 0; }
                }

                /* Pumpkin competition element styling */
                .halloween-competition-pumpkin {
                    background-color: transparent !important;
                    border: none !important;
                    outline: none !important;
                }

                .halloween-competition-pumpkin:hover {
                    cursor: pointer !important;
                }

                @keyframes collectionNotificationShow {
                    0% {
                        transform: translate(-50%, -50%) scale(0.3);
                        opacity: 0;
                    }
                    20% {
                        transform: translate(-50%, -50%) scale(1.1);
                        opacity: 1;
                    }
                    80% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0;
                    }
                }

                /* Mobile responsive adjustments */
                @media (max-width: 768px) {
                    #halloween-competition-end-notification,
                    #spooky-targets-end-notification {
                        max-width: 90% !important;
                        padding: 20px 25px !important;
                        font-size: 14px !important;
                    }

                    #halloween-competition-end-notification > div:first-child,
                    #spooky-targets-end-notification > div:first-child {
                        font-size: 16px !important;
                    }

                    /* Menu height adjustments for mobile */
                    #halloween-dropdown-menu,
                    #halloween-sliding-menu {
                        max-height: 75vh !important;
                        z-index: 99999 !important;
                    }
                }
            `;
            document.head.appendChild(style);
            HalloweenDebug.log(1, 'HAL: ✅ HalloweenEffects.addStylesheet() complete - styles injected!');
        },

        createScreenOverlay: function() {
            const overlay = document.createElement('div');
            overlay.className = 'halloween-screen-overlay';
            return overlay;
        }
    };

    // Debug and Development Tools
    const DebugTools = {
        enabled: GM_getValue('halloween_debug', false),

        log: function(...args) {
            if (this.enabled) {
                HalloweenDebug.log(3, '[HALLOWEEN DEBUG]', ...args);
            }
        },

        toggle: function() {
            this.enabled = !this.enabled;
            GM_setValue('halloween_debug', this.enabled);
            HalloweenDebug.log(3, 'Halloween Debug Mode:', this.enabled ? 'ENABLED' : 'DISABLED');
            return this.enabled;
        },

        testTargetGeneration: function(testSeed) {
            const seed = testSeed || SeedManager.getSeed('testTargetGeneration');
            HalloweenDebug.log(3, `Testing target generation for seed: ${seed}`);
            const start = performance.now();
            const targets = HalloweenMath.generateTargets(seed);
            const duration = performance.now() - start;

            HalloweenDebug.log(3, `Generated ${targets.length} target pairs (hidden for competitive gameplay)`);
            HalloweenDebug.log(3, `Generation took: ${duration.toFixed(2)}ms`);
            HalloweenDebug.log(3, `Potential player targets: ~${(targets.length * 39420).toLocaleString()}`);

            return { duration, seed, targetCount: targets.length };
        },

        runPerformanceTest: function() {
            HalloweenDebug.log(3, '🎃 Running Halloween Targets Performance Test...');
            const testSeeds = ['TEST_SEED_1', 'TEST_SEED_2', 'PERFORMANCE_TEST', 'HALLOWEEN2024', 'FACTION_ALPHA'];
            const results = [];

            testSeeds.forEach(seed => {
                const iterations = 50;
                const start = performance.now();

                for (let i = 0; i < iterations; i++) {
                    HalloweenMath.generateTargets(seed);
                }

                const totalTime = performance.now() - start;
                const avgTime = totalTime / iterations;

                results.push({
                    seed,
                    avgTime: avgTime.toFixed(3),
                    totalTime: totalTime.toFixed(2)
                });

                HalloweenDebug.log(3, `Seed "${seed}": ${avgTime.toFixed(3)}ms avg (${iterations} iterations)`);
            });

            const overallAvg = results.reduce((sum, r) => sum + parseFloat(r.avgTime), 0) / results.length;
            HalloweenDebug.log(3, `Overall average: ${overallAvg.toFixed(3)}ms`);
            HalloweenDebug.log(3, `Performance target (<5ms): ${overallAvg < 5 ? '✅ PASS' : '❌ FAIL'}`);

            // Test caching performance
            HalloweenDebug.log(3, '\n🎃 Testing cache performance...');
            const currentSeed = SeedManager.getSeed('performanceTest');
            const cacheStart = performance.now();
            SeedManager.getTargets('performanceTest'); // Should use cache
            const cacheTime = performance.now() - cacheStart;
            HalloweenDebug.log(3, `Cache retrieval: ${cacheTime.toFixed(3)}ms`);

            return results;
        },

        validateMathematicalIntegrity: function() {
            HalloweenDebug.log(3, '🎃 Validating Mathematical Integrity...');

            // Test deterministic behavior with seeds
            const testSeed = 'VALIDATION_TEST_SEED';
            const result1 = HalloweenMath.generateTargets(testSeed);
            const result2 = HalloweenMath.generateTargets(testSeed);

            const isDeterministic = JSON.stringify(result1) === JSON.stringify(result2);
            HalloweenDebug.log(3, `Deterministic test: ${isDeterministic ? '✅ PASS' : '❌ FAIL'}`);

            // Test target count
            const hasCorrectCount = result1.length === 20;
            HalloweenDebug.log(3, `Target count test (20): ${hasCorrectCount ? '✅ PASS' : '❌ FAIL'}`);

            // Test format consistency
            const allValidFormat = result1.every(target => /^\d{2}$/.test(target));
            HalloweenDebug.log(3, `Format consistency test: ${allValidFormat ? '✅ PASS' : '❌ FAIL'}`);

            // Test range validity
            const allInRange = result1.every(target => {
                const num = parseInt(target);
                return num >= 0 && num <= 99;
            });
            HalloweenDebug.log(3, `Range validity test (00-99): ${allInRange ? '✅ PASS' : '❌ FAIL'}`);

            // Test seed uniqueness
            const differentSeed = 'DIFFERENT_SEED';
            const result3 = HalloweenMath.generateTargets(differentSeed);
            const isDifferent = JSON.stringify(result1) !== JSON.stringify(result3);
            HalloweenDebug.log(3, `Seed uniqueness test: ${isDifferent ? '✅ PASS' : '❌ FAIL'}`);

            // Test current seed system
            const currentTargets = SeedManager.getTargets('currentSeedTest');
            const currentSeed = SeedManager.getSeed('currentSeedTest');
            HalloweenDebug.log(3, `Current seed: ${currentSeed}`);
            HalloweenDebug.log(3, `Current target count: ${currentTargets.length} (pairs hidden for competitive gameplay)`);

            return {
                deterministic: isDeterministic,
                correctCount: hasCorrectCount,
                validFormat: allValidFormat,
                validRange: allInRange,
                seedUniqueness: isDifferent,
                currentSeed: currentSeed,
                targetCount: currentTargets.length
            };
        },

        simulateTargetDetection: function(playerID) {
            HalloweenDebug.log(3, `🎃 Simulating target detection for player ID: ${playerID}`);

            if (!playerID) {
                HalloweenDebug.log(3, '❌ No player ID provided');
                return false;
            }

            const lastTwoDigits = playerID.toString().slice(-2).padStart(2, '0');
            HalloweenDebug.log(3, `Extracted digits: ${lastTwoDigits}`);

            const start = performance.now();
            const isTarget = SeedManager.checkTarget(lastTwoDigits);
            const duration = performance.now() - start;

            HalloweenDebug.log(3, `Target check time: ${duration.toFixed(2)}ms`);
            HalloweenDebug.log(3, `Is target: ${isTarget ? '🎯 YES' : '❌ NO'}`);

            if (isTarget) {
                HalloweenDebug.log(3, '🎃 Would trigger Halloween effects!');
            }

            return {
                playerID,
                lastTwoDigits,
                isTarget,
                checkTime: duration
            };
        },

        getStoredTargets: function() {
            const storedValue = GM_getValue('halloween_encounters', '{}');
            const stored = safeParse(storedValue, '{}');
            HalloweenDebug.log(3, `Found ${Object.keys(stored).length} unique encounters:`, stored);
            return stored;
        },

        clearStoredTargets: function() {
            GM_setValue('halloween_encounters', '{}');
            HalloweenDebug.log(3, '🎃 Cleared all encounter data');
        },

        getSeedInfo: function() {
            const info = SeedManager.getSeedInfo();
            HalloweenDebug.log(3, '🎃 Current Seed Information:');
            HalloweenDebug.log(3, `Seed: ${info.currentSeed}`);
            HalloweenDebug.log(3, `Target Count: ${info.targetCount} pairs (hidden for competitive gameplay)`);
            HalloweenDebug.log(3, `Cached: ${info.isCached ? 'Yes' : 'No'}`);
            HalloweenDebug.log(3, `Total Potential Targets: ~${info.totalPotentialTargets.toLocaleString()}`);
            return info;
        },

        setSeed: function(newSeed) {
            const result = SeedManager.setSeed(newSeed);
            if (result) {
                HalloweenDebug.log(1, `🎃 Seed updated successfully to: ${newSeed}`);
                HalloweenDebug.log(1, 'New targets generated. Use halloweenSeedInfo() to view.');
            } else {
                console.error('🎃 Failed to set seed. Check format and try again.');
            }
            return result;
        },

        clearCache: function() {
            SeedManager.clearCache();
            HalloweenDebug.log(1, '🎃 Target cache cleared');
        },

        showDebugPanel: function() {
            // Legacy debug panel - use HalloweenUI.toggleMenu() instead
            HalloweenDebug.log(3, '🎃 Use window.halloweenMenu() or click the pumpkin icon for the new interface');
            HalloweenUI.toggleMenu();
        }
    };

    // Tiered Debug System with HAL: prefix for console filtering
    const HalloweenDebug = {
        level: GM_getValue('hallo_debug_level', 0),

        log: function(level, ...args) {
            if (level <= this.level) {
                console.log('HAL:', ...args);
            }
        },

        trace: function(level, ...args) {
            if (level <= this.level) {
                console.trace();
            }
        },

        setLevel: function(newLevel) {
            this.level = newLevel;
            GM_setValue('hallo_debug_level', newLevel);
            console.log('HAL: 🎃 Debug level set to', newLevel);
            HalloweenDebug.log(1, 'HAL: 🎃 Debug levels: 0=none, 1=basic, 2=detailed, 3=full');
            return this.level;
        },

        getLevel: function() {
            return this.level;
        },

        info: function() {
            HalloweenDebug.log(1, 'HAL: 🎃 Current debug level:', this.level);
            HalloweenDebug.log(1, 'HAL: 🎃 Available levels:');
            HalloweenDebug.log(1, 'HAL:   0 = No debug output (production)');
            HalloweenDebug.log(1, 'HAL:   1 = Basic flow (getSeed, getTargets, cache)');
            HalloweenDebug.log(1, 'HAL:   2 = Detailed (anti-tampering, validation, menu)');
            HalloweenDebug.log(1, 'HAL:   3 = Full (stack traces, raw data, all operations)');
            HalloweenDebug.log(1, 'HAL: 🎃 Use HalloweenDebug.setLevel(X) to change level');
        },

        showHelp: function() {
            this.info(); // Alias for info()
        },

        // Format timestamp as GMT/UTC string (Torn API uses GMT)
        formatTimestamp: function(unixTimestamp) {
            const date = new Date(unixTimestamp * 1000);
            return date.toUTCString();
        },

        // ===================================
        // API MODE DEBUG COMMANDS
        // ===================================

        apiStatus: function() {
            console.log('HAL: === API MODE STATUS ===');
            console.log('HAL: Enabled:', APIDefeatVerification.isAPIMode());
            if (APIDefeatVerification.isAPIMode()) {
                console.log('HAL: Player ID:', APIDefeatVerification.getMemberID());
                console.log('HAL: Player Name:', APIDefeatVerification.getMemberName());
                console.log('HAL: Start Timestamp:', new Date(GM_getValue('halloween_api_start_timestamp', 0) * 1000));
                console.log('HAL: Last Refresh:', new Date(GM_getValue('halloween_api_last_refresh', 0) * 1000));

                const bonusStats = APIDefeatVerification.getBonusStats();
                console.log('HAL: --- Bonus Stats ---');
                console.log('HAL: Total Attacks:', bonusStats.totalAttacks);
                console.log('HAL: Unique Opponents:', bonusStats.uniqueOpponents);
                console.log('HAL: Total Defeated:', bonusStats.totalDefeats);

                const queue = APIDefeatVerification.getPendingVerifications();
                console.log('HAL: --- Verification Queue ---');
                console.log('HAL: Pending:', queue.length);
                if (queue.length > 0) {
                    console.table(queue);
                }
            } else {
                console.log('HAL: API Mode is not enabled');
            }
        },

        showAttackLogs: function(limit = 10) {
            if (!APIDefeatVerification.isAPIMode()) {
                console.log('HAL: API Mode is not enabled');
                return;
            }

            const attacks = APIDefeatVerification.getAllAttacks();
            const attacksArray = Object.entries(attacks).slice(0, limit).map(([id, data]) => ({
                id,
                code: data.code,
                timestamp: HalloweenDebug.formatTimestamp(data.timestamp_started),
                defender: data.defender_id,
                result: data.result
            }));

            console.log('HAL: === ATTACK LOGS (showing', attacksArray.length, 'of', Object.keys(attacks).length, ') ===');
            console.table(attacksArray);
        },

        forceRefresh: function() {
            if (!APIDefeatVerification.isAPIMode()) {
                console.log('HAL: ❌ API Mode is not enabled');
                return;
            }

            console.log('HAL: 🔄 Forcing attack log refresh...');
            APIDefeatVerification.refreshAttackLog();
            console.log('HAL: ✅ Refresh initiated (check logs in a moment)');
        },

        simulateSpookyDefeat: function(defenderId) {
            if (!defenderId) {
                HalloweenDebug.log(1, 'HAL: Usage: HalloweenDebug.simulateSpookyDefeat(defenderId)');
                HalloweenDebug.log(1, 'HAL: Example: HalloweenDebug.simulateSpookyDefeat(2893574)');
                return;
            }

            HalloweenDebug.log(1, 'HAL: 🎃 Simulating spooky defeat for defender', defenderId);

            // Check if it's a spooky target
            if (!AttackPageDetection.isSpookyTarget(defenderId)) {
                HalloweenDebug.log(1, `⚠️ Warning: ${defenderId} is not a spooky target (doesn't match seed)`);
                HalloweenDebug.log(1, 'HAL: Proceeding anyway for testing...');
            }

            // Queue for verification
            const timestamp = Math.floor(Date.now() / 1000);
            if (APIDefeatVerification.isAPIMode()) {
                HalloweenDebug.log(2, '📡 Using API mode verification');
                APIDefeatVerification.queueVerification(defenderId, timestamp);
            } else {
                HalloweenDebug.log(2, '🔥 Using Firebase mode verification');
                FirebaseDefeatVerification.addToQueue(defenderId, timestamp);
            }

            HalloweenDebug.log(2, '✅ Defeat queued for verification');
        },

        checkVerificationStatus: function(defenderId) {
            if (!defenderId) {
                HalloweenDebug.log(1, 'HAL: Usage: HalloweenDebug.checkVerificationStatus(defenderId)');
                HalloweenDebug.log(1, 'HAL: Example: HalloweenDebug.checkVerificationStatus(2893574)');
                return;
            }

            console.log('HAL: === VERIFICATION STATUS:', defenderId, '===');

            // Check if already counted
            const counted = GM_getValue('halloween_defeats_counted', '[]');
            const countedArray = safeParse(counted, '[]');
            const alreadyCounted = countedArray.includes(defenderId.toString());

            console.log('HAL: Already Counted:', alreadyCounted);

            if (APIDefeatVerification.isAPIMode()) {
                // Check pending queue
                const queue = APIDefeatVerification.getPendingVerifications();
                const inQueue = queue.find(q => q.defenderId == defenderId);
                console.log('HAL: In Verification Queue:', !!inQueue);
                if (inQueue) {
                    console.log('HAL: Queue Details:', inQueue);
                }

                // Try verification
                const result = APIDefeatVerification.verifyDefeat(defenderId);
                console.log('HAL: Verification Result:', result);
            } else {
                // Firebase mode
                const queue = GM_getValue('halloween_verify_queue', '[]');
                const queueArray = safeParse(queue, '[]');
                const inQueue = queueArray.find(q => q.defenderId == defenderId);
                HalloweenDebug.log(2, 'In Verification Queue:', !!inQueue);
                if (inQueue) {
                    HalloweenDebug.log(3, 'Queue Details:', inQueue);
                }
            }
        },

        showAllDebugCommands: function() {
            HalloweenDebug.log(1, 'HAL: === HALLOWEEN DEBUG COMMANDS ===');
            HalloweenDebug.log(1, 'HAL: ');
            HalloweenDebug.log(1, 'HAL: General:');
            HalloweenDebug.log(1, 'HAL:   HalloweenDebug.setLevel(0-3) - Set debug verbosity');
            HalloweenDebug.log(1, 'HAL:   HalloweenDebug.info() - Show debug level info');
            HalloweenDebug.log(1, 'HAL: ');
            HalloweenDebug.log(1, 'HAL: API Mode:');
            HalloweenDebug.log(1, 'HAL:   HalloweenDebug.apiStatus() - Show API mode status & stats');
            HalloweenDebug.log(1, 'HAL:   HalloweenDebug.showAttackLogs(10) - Show recent attack logs');
            HalloweenDebug.log(1, 'HAL:   HalloweenDebug.forceRefresh() - Force attack log refresh');
            HalloweenDebug.log(1, 'HAL: ');
            HalloweenDebug.log(1, 'HAL: Testing:');
            HalloweenDebug.log(1, 'HAL:   HalloweenDebug.simulateSpookyDefeat(defenderId) - Test defeat verification');
            HalloweenDebug.log(1, 'HAL:   HalloweenDebug.checkVerificationStatus(defenderId) - Check defeat status');
            HalloweenDebug.log(1, 'HAL: ');
            HalloweenDebug.log(1, 'HAL: Example workflow:');
            HalloweenDebug.log(1, 'HAL:   1. HalloweenDebug.apiStatus() - Check current status');
            HalloweenDebug.log(1, 'HAL:   2. HalloweenDebug.simulateSpookyDefeat(2893574) - Queue a test defeat');
            HalloweenDebug.log(1, 'HAL:   3. HalloweenDebug.checkVerificationStatus(2893574) - Verify it worked');
        }
    };

    // Halloween UI System - Sliding Pumpkin Menu
    const HalloweenUI = {
        menuOpen: false,
        soundEnabled: GM_getValue('halloween_sound_enabled', true),
        backgroundEnabled: GM_getValue('halloween_background', true),
        collectibleHelperEnabled: GM_getValue('halloween_collectible_helper', false),
        menuPosition: GM_getValue('halloween_menu_position', 'side'), // 'side' or 'top'
        statsUpdateInterval: null, // Menu-only stats update interval
        arcaneToastTimer: null, // Timer for hiding arcane toast
        enchantedPageIndex: GM_getValue('halloween_collectible_page_index', 0), // Current index for logo cycling (persisted across pages)
        originalLogoHref: null, // Store original logo href
        logoClickHandler: null, // Store bound handler for proper cleanup

        // Initialize bound event handlers once (prevents listener leaks on menu rebuild)
        initBoundHandlers: function() {
            if (this._boundHandlersInitialized) return;

            // Bind all toggle/button handlers once and store as properties
            this.boundToggleLeaderMode = this.toggleLeaderMode.bind(this);
            this.boundToggleBackground = this.toggleBackground.bind(this);
            this.boundToggleSound = this.toggleSound.bind(this);
            this.boundToggleCollectibleHelper = this.toggleCollectibleHelper.bind(this);
            this.boundImportConfig = this.importConfig.bind(this);
            this.boundExportForLeaders = this.exportForLeaders.bind(this);
            this.boundExportForMembers = this.exportForMembers.bind(this);
            this.boundGenerateLeaderSeed = this.generateLeaderSeed.bind(this);
            this.boundSetLeaderSeed = this.setLeaderSeed.bind(this);
            this.boundToggleMenu = this.toggleMenu.bind(this);

            // Pre-bind debug level handlers (0-3)
            this.boundDebugLevels = [
                () => this.setDebugLevel(0),
                () => this.setDebugLevel(1),
                () => this.setDebugLevel(2),
                () => this.setDebugLevel(3)
            ];

            this._boundHandlersInitialized = true;
            HalloweenDebug.log(2, '🎃 Event handlers bound once (prevents listener leaks)');
        },

        init: function() {
            console.log('HAL: 🎃 HalloweenUI.init() starting... menuPosition:', this.menuPosition);

            // Initialize bound handlers once to prevent listener leaks
            this.initBoundHandlers();

            try {
                // Always create side menu (top menu position removed)
                HalloweenDebug.log(1, 'HAL: 🎃 Creating side menu...');
                document.body.classList.remove('halloween-menu-top');
                this.createPumpkinTrigger();
                this.createSlidingMenu();
                console.log('HAL: ✅ Menu creation complete');

                HalloweenDebug.log(1, 'HAL: 🎃 Updating menu content...');
                this.updateMenuContent();
                console.log('HAL: ✅ Menu content updated');

                // Restore saved tile image
                HalloweenDebug.log(1, 'HAL: 🎃 Checking for saved tile image...');
                const savedTile = GM_getValue('halloween_tile_image', '');
                if (savedTile) {
                    HalloweenDebug.log(1, 'HAL: 🎃 Applying saved tile image:', savedTile);
                    this.applyTileImage(savedTile);
                } else {
                    HalloweenDebug.log(1, 'HAL: ℹ️ No saved tile image');
                }

                // Ensure carved king icon is applied (fixes faction config override)
                console.log('HAL: 🎃 Getting faction config...');
                const config = FactionConfig.getConfig();
                HalloweenDebug.log(1, 'HAL: 🎃 Updating trigger icon...');
                FactionConfig.updateTriggerIcon(config.factionIcon);
                HalloweenDebug.log(1, 'HAL: ✅ Trigger icon updated');

                // Initialize ticker hijacking with delay to ensure page is loaded
                setTimeout(() => {
                    HalloweenDebug.log(1, 'HAL: 🎃 Initializing ticker hijacking...');
                    this.initTickerHijacking();
                }, 3000);

                // Initialize collectible helper if enabled
                if (this.collectibleHelperEnabled) {
                    setTimeout(() => {
                        HalloweenDebug.log(1, 'HAL: 🎃 Initializing Collectible Helper...');
                        this.hijackTornLogo();
                    }, 1000); // Shorter delay since logo loads quickly
                }

                console.log('HAL: ✅ HalloweenUI.init() complete!');
            } catch (error) {
                console.error('HAL: ❌ Error in HalloweenUI.init():', error);
            }
        },

        createPumpkinTrigger: function() {
            const trigger = document.createElement('div');
            trigger.id = 'halloween-pumpkin-trigger';

            // Responsive sizing: 90px for desktop (768+), 75px for mobile
            const isDesktop = window.innerWidth >= 768;
            const size = isDesktop ? 90 : 75;
            const closedOffset = isDesktop ? -45 : -37.5;

            trigger.innerHTML = `<img src="https://i.ibb.co/fYD8KsYX/carved-king-250.png" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 0 10px rgba(255, 107, 53, 1)) drop-shadow(0 0 22px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 33px rgba(255, 69, 0, 0.7));">`;
            trigger.title = 'Grimoire - Carved Edition';
            trigger.style.cssText = `
                position: fixed;
                top: 50%;
                right: ${closedOffset}px;
                width: ${size}px;
                height: ${size}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-family: var(--halloween-font);
                cursor: pointer;
                z-index: 19999;
                transition: all 0.3s ease;
                user-select: none;
                transform: translateY(-50%);
            `;

            trigger.addEventListener('mouseenter', () => {
                trigger.style.right = '-15px';
                trigger.style.transform = 'translateY(-50%) scale(1.1)';
                const img = trigger.querySelector('img');
                if (img) img.style.filter = 'drop-shadow(0 0 14px rgba(255, 107, 53, 1)) drop-shadow(0 0 28px rgba(255, 165, 0, 1)) drop-shadow(0 0 44px rgba(255, 69, 0, 0.8))';
            });

            trigger.addEventListener('mouseleave', () => {
                if (!this.menuOpen) {
                    const isDesktop = window.innerWidth >= 768;
                    const closedOffset = isDesktop ? -45 : -37.5;
                    trigger.style.right = `${closedOffset}px`;
                    trigger.style.transform = 'translateY(-50%) scale(1)';
                    const img = trigger.querySelector('img');
                    if (img) img.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 53, 1)) drop-shadow(0 0 22px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 33px rgba(255, 69, 0, 0.7))';
                }
            });

            trigger.addEventListener('click', () => {
                HalloweenUI.toggleMenu();
            });

            // Debug: Test if the handler was attached
            HalloweenDebug.log(1, 'HAL: 🎃 HANDLER DEBUG: Trigger click handler attached to element:', trigger);

            // Safety check for document.body (critical for document-start)
            if (!document.body) {
                console.log('HAL: ⚠️ document.body not ready yet - waiting...');
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        console.log('HAL: ✅ DOMContentLoaded fired - appending trigger');
                        document.body.appendChild(trigger);
                    });
                } else {
                    console.error('HAL: ❌ document.body is null but readyState is not loading!');
                }
                return;
            }

            HalloweenDebug.log(1, 'HAL: ✅ Appending trigger to document.body');
            document.body.appendChild(trigger);
            HalloweenDebug.log(1, 'HAL: ✅ Trigger appended successfully');
        },

        createSlidingMenu: function() {
            const menu = document.createElement('div');
            menu.id = 'halloween-sliding-menu';
            menu.style.cssText = `
                position: fixed;
                top: 50%;
                right: -340px;
                width: 320px;
                height: auto;
                max-height: 80vh;
                background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(139,0,0,0.9));
                border: 2px solid #ff6b35;
                border-radius: 15px 0 0 15px;
                z-index: 20000;
                transition: right 0.4s ease;
                transform: translateY(-50%);
                overflow-y: auto;
                box-shadow: -5px 0 25px rgba(0,0,0,0.7);
            `;

            document.body.appendChild(menu);
        },

        toggleMenu: function() {
            // Always toggle side menu (top menu position removed)
            this.toggleSideMenu();
        },

        toggleSideMenu: function() {
            const trigger = document.getElementById('halloween-pumpkin-trigger');
            const menu = document.getElementById('halloween-sliding-menu');

            if (!this.menuOpen) {
                // Open menu
                menu.style.right = '0px';
                trigger.style.right = '15px';
                trigger.style.transform = 'translateY(-50%) scale(1.1) rotate(180deg)';
                this.menuOpen = true;
                this.updateMenuContent();

                // Check for API refresh on menu open (event-driven optimization)
                if (APIDefeatVerification.isAPIMode()) {
                    APIDefeatVerification.checkAttackLogRefresh();
                }

                // Start menu-only stats update interval
                this.startStatsUpdateInterval();
            } else {
                // Close menu
                menu.style.right = '-330px';
                this.menuOpen = false;
                // Responsive sizing: 90px for desktop (768+), 75px for mobile
                const isDesktop = window.innerWidth >= 768;
                const closedOffset = isDesktop ? -45 : -37.5;
                trigger.style.right = `${closedOffset}px`;
                trigger.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
                // Reset glow filter to default state
                const img = trigger.querySelector('img');
                if (img) img.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 53, 1)) drop-shadow(0 0 22px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 33px rgba(255, 69, 0, 0.7))';
                // Cleanup empty announcements on menu close
                this.cleanupEmptyAnnouncements();

                // Stop menu-only stats update interval
                this.stopStatsUpdateInterval();
            }
        },

        updateMenuContent: function() {
            try {
                // Always use side menu (top menu position removed)
                const menu = document.getElementById('halloween-sliding-menu');

                const seedInfo = SeedManager.getSeedInfo();

                const stats = this.getPersonalStats();

                const config = FactionConfig.getConfig();

                HalloweenDebug.log(2, '🎃 Updating menu content, leader mode:', seedInfo.isLeaderMode);
                HalloweenDebug.log(2, '🎃 Menu element found:', !!menu);
                HalloweenDebug.log(2, '🎃 SeedInfo:', seedInfo);
                HalloweenDebug.log(2, '🎃 Stats:', stats);
                HalloweenDebug.log(2, '🎃 Config:', config);

                let bannerHtml = '';
                if (config.factionBanner) {
                    bannerHtml = `
                        <div style="margin-bottom: 15px; text-align: center;">
                            <img src="${config.factionBanner}" style="max-width: 100%; max-height: 60px; object-fit: contain;">
                        </div>
                    `;
                }

                // Use clean menu rebuild
                menu.innerHTML = this.buildCleanMenu(seedInfo, stats, config);

                // Add event listeners for toggles after DOM is updated
                this.attachToggleListeners();

                // Reattach manifestations panel listeners (enchanted pages, etc.)
                this.reattachManifestationsListeners();

                // Restore manifestations checkbox states from GM storage
                this.updateManifestationsUI();

                // Setup member countdown handlers and update displays
                this.setupMemberStatusHandlers();
                this.updateMemberCountdowns();

                // Reattach Switch to API mode handler
                this.setupSwitchToAPIHandler();

                // Update defeat verification stats (if FirebaseDefeatVerification exists)
                if (typeof FirebaseDefeatVerification !== 'undefined') {
                    this.updateDefeatVerificationStats();
                }

                // Update bounties claimed display
                this.updateBountiesClaimed();

                // Update debug level displays and button states
                const currentLevel = HalloweenDebug.getLevel();

                // Update footer debug level display (leader only)
                const footerLevelDisplay = document.getElementById('debug-level-footer');
                const levelNameDisplay = document.getElementById('debug-level-name');
                if (footerLevelDisplay) {
                    footerLevelDisplay.textContent = currentLevel;
                }
                if (levelNameDisplay) {
                    levelNameDisplay.textContent = this.getDebugLevelName(currentLevel);
                }

                this.updateDebugButtonStates(currentLevel);
            } catch (error) {
                console.error('HAL: ❌ Error in updateMenuContent:', error);
                console.error('HAL: ❌ Error stack:', error.stack);
                throw error; // Re-throw so outer catch can see it too
            }
        },

        updateDefeatVerificationStats: function() {
            // Check if API mode is enabled
            const isAPIMode = GM_getValue('halloween_api_mode', false);

            // Get stats from appropriate system
            const stats = isAPIMode
                ? APIDefeatVerification.getStats()
                : FirebaseDefeatVerification.getStats();

            // Find the boxes container
            const boxesContainer = document.getElementById('defeat-verification-boxes');
            if (!boxesContainer) return;

            // Build boxes HTML based on mode
            let boxesHTML = '';

            if (isAPIMode) {
                // API Mode: 3 boxes in one row
                boxesHTML = `
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        <div style="text-align: center; padding: 6px; background: rgba(0, 255, 0, 0.1); border-radius: 4px; border: 1px solid rgba(0, 255, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #00ff00; margin-bottom: 2px;">${stats.verifiedDefeats}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Verified</div>
                        </div>
                        <div style="text-align: center; padding: 6px; background: rgba(255, 165, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 165, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ffa500; margin-bottom: 2px;">${stats.pendingVerification}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Pending</div>
                        </div>
                        <div style="text-align: center; padding: 6px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 0, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ff6666; margin-bottom: 2px;">${stats.unverified}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Unverified</div>
                        </div>
                    </div>
                `;
            } else {
                // Firebase Mode: 4 boxes in one row
                boxesHTML = `
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                        <div style="display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 8px 6px; background: rgba(0, 255, 0, 0.1); border-radius: 4px; border: 1px solid rgba(0, 255, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #00ff00; margin-bottom: 4px;">${stats.verifiedDefeats}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Verified</div>
                        </div>
                        <div style="display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 8px 6px; background: rgba(255, 165, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 165, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ffa500; margin-bottom: 4px;">${stats.pendingVerification}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Pending</div>
                        </div>
                        <div style="display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 8px 6px; background: rgba(255, 255, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 255, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ffff00; margin-bottom: 4px;">${stats.hourlyRetry}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Retry 1h</div>
                        </div>
                        <div style="display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 8px 6px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 0, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ff6666; margin-bottom: 4px;">${stats.unverified}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Unverified</div>
                        </div>
                    </div>
                `;
            }

            // Update the DOM
            boxesContainer.innerHTML = boxesHTML;

            // Show/hide API elements based on mode
            const refreshInfoSection = document.getElementById('api-refresh-info-section');
            const refreshLink = document.getElementById('api-refresh-link');
            const refreshSeparator = document.getElementById('api-refresh-link-separator');

            if (refreshInfoSection) {
                refreshInfoSection.style.display = isAPIMode ? 'block' : 'none';
            }
            if (refreshLink) {
                refreshLink.style.display = isAPIMode ? 'inline' : 'none';
            }
            if (refreshSeparator) {
                refreshSeparator.style.display = isAPIMode ? 'inline' : 'none';
            }

            // Update last refresh time if in API mode
            if (isAPIMode) {
                const lastRefresh = GM_getValue('halloween_api_last_refresh', 0);
                const lastRefreshTime = document.getElementById('api-last-refresh-time');
                if (lastRefreshTime && lastRefresh > 0) {
                    const now = Date.now() / 1000;
                    const minutesAgo = Math.floor((now - lastRefresh) / 60);
                    if (minutesAgo < 1) {
                        lastRefreshTime.textContent = 'Just now';
                    } else if (minutesAgo === 1) {
                        lastRefreshTime.textContent = '1 minute ago';
                    } else {
                        lastRefreshTime.textContent = `${minutesAgo} minutes ago`;
                    }
                }
            }

            HalloweenDebug.log(2, `🎃 Updated defeat verification stats (${isAPIMode ? 'API' : 'Firebase'} mode):`, stats);
        },

        // Start menu-only stats update interval (60 seconds)
        startStatsUpdateInterval: function() {
            // Clear any existing interval first
            this.stopStatsUpdateInterval();

            // Start new 60-second interval for stats updates
            this.statsUpdateInterval = setInterval(() => {
                if (this.menuOpen) {
                    this.updateDefeatVerificationStats();
                    HalloweenDebug.log(3, '🔄 Menu stats updated (60s interval)');
                } else {
                    // Safety: stop interval if menu somehow closed
                    this.stopStatsUpdateInterval();
                }
            }, 60 * 1000);

            HalloweenDebug.log(2, '⏱️ Started menu-only stats update interval (60s)');
        },

        // Stop menu-only stats update interval
        stopStatsUpdateInterval: function() {
            if (this.statsUpdateInterval) {
                clearInterval(this.statsUpdateInterval);
                this.statsUpdateInterval = null;
                HalloweenDebug.log(2, '⏹️ Stopped menu-only stats update interval');
            }
        },

        // Event-driven element updates (no full menu rebuild)
        updateSoulsBanished: function() {
            // Update just the Souls Banished number
            const stats = APIDefeatVerification.isAPIMode()
                ? APIDefeatVerification.getStats()
                : FirebaseDefeatVerification.getStats();

            // Find the element (different IDs for member vs leader)
            const soulsBanishedElements = document.querySelectorAll('[id*="souls-banished"]');
            soulsBanishedElements.forEach(el => {
                const numElement = el.querySelector('div:first-child');
                if (numElement) {
                    numElement.textContent = stats.uniqueDefeats;
                }
            });

            HalloweenDebug.log(2, `🎃 Updated Souls Banished: ${stats.uniqueDefeats}`);
        },

        updateHalloweekStats: function() {
            // Update Halloweek Stats (API mode only)
            if (!GM_getValue('halloween_api_mode', false)) return;

            const bonusStats = APIDefeatVerification.getBonusStats();

            // Update outgoing (offense) stats
            const totalAttacksEl = document.getElementById('stat-competition-attacks');
            if (totalAttacksEl) totalAttacksEl.textContent = bonusStats.totalAttacks;

            const uniqueOpponentsEl = document.getElementById('stat-unique-opponents');
            if (uniqueOpponentsEl) uniqueOpponentsEl.textContent = bonusStats.uniqueOpponents;

            const totalDefeatsEl = document.getElementById('stat-total-defeats');
            if (totalDefeatsEl) totalDefeatsEl.textContent = bonusStats.totalDefeats;

            // Update incoming (defense) stats
            const totalAttackedEl = document.getElementById('stat-total-attacked');
            if (totalAttackedEl) totalAttackedEl.textContent = bonusStats.totalAttacked;

            const uniqueAttackersEl = document.getElementById('stat-unique-attackers');
            if (uniqueAttackersEl) uniqueAttackersEl.textContent = bonusStats.uniqueAttackers;

            const totalDefendsEl = document.getElementById('stat-total-defends');
            if (totalDefendsEl) totalDefendsEl.textContent = bonusStats.totalDefends;

            HalloweenDebug.log(2, `HAL: 🎃 Updated Halloweek Stats - Offense: ${bonusStats.totalAttacks} attacks, ${bonusStats.uniqueOpponents} opponents, ${bonusStats.totalDefeats} defeated | Defense: ${bonusStats.totalAttacked} attacked, ${bonusStats.uniqueAttackers} attackers, ${bonusStats.totalDefends} defends`);
        },

        updateBountiesClaimed: function() {
            HalloweenDebug.log(2, '🔥 updateBountiesClaimed called');

            // Get bounty config
            const config = BountyManager.getConfig();
            const section = document.getElementById('bounties-claimed-section');
            const grid = document.getElementById('bounties-claimed-grid');

            if (!section || !grid) {
                HalloweenDebug.log(2, '🔥 Bounties section/grid not found in DOM - menu likely closed');
                return;
            }

            // Show/hide section based on bounties active
            if (!config.active || config.bounties.length === 0) {
                section.style.display = 'none';
                HalloweenDebug.log(2, '🔥 Bounties inactive or no bounties configured');
                return;
            }

            section.style.display = 'block';

            // Get today's date for highlighting active day
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // Get all claims
            const claims = BountyManager.getClaims();
            HalloweenDebug.log(2, '🔥 Current bounty claims:', claims);

            // Sort bounties by date
            const sortedBounties = [...config.bounties].sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            // Calculate square size based on number of bounties (1-7)
            const numBounties = sortedBounties.length;
            const squareSize = numBounties <= 3 ? '65px' :
                              numBounties <= 5 ? '48px' : '40px';
            const fontSize = numBounties <= 5 ? '22px' : '20px';
            const padding = numBounties <= 5 ? '5px' : '4px';

            // Generate HTML for each bounty square
            const squaresHTML = sortedBounties.map((bounty, index) => {
                const playerID = BountyManager.extractPlayerID(bounty.url);
                const claim = claims[playerID];

                // Determine status and emoji
                let emoji, emojiColor;

                if (claim && claim.verified) {
                    // Verified - Cyan checkmark
                    emoji = '✓';
                    emojiColor = 'var(--carved-cyan)';
                } else if (claim && claim.missed) {
                    // Missed - Grey X
                    emoji = '✗';
                    emojiColor = '#666666';
                } else {
                    // Unclaimed - Grey circle outline
                    emoji = '○';
                    emojiColor = '#666666';
                }

                // Highlight active day (today) in cyan, dim inactive days
                const dayLabelColor = bounty.date === today ? 'var(--carved-cyan)' : 'rgba(255, 255, 255, 0.6)';

                return `
                    <div style="flex: 1 1 auto; text-align: center; padding: ${padding}; background: rgba(0, 0, 0, 0.3); border-radius: 4px; box-sizing: border-box;">
                        <div style="font-size: ${fontSize}; color: ${emojiColor}; margin-top: 2px; margin-bottom: 6px; font-weight: bold;">${emoji}</div>
                        <div style="font-size: 9px; font-weight: bold; color: ${dayLabelColor};">Day ${index + 1}</div>
                    </div>
                `;
            }).join('');

            // Update grid HTML with forced repaint
            const oldHTML = grid.innerHTML;

            // Clear first, then update (forces browser to repaint)
            grid.innerHTML = '';
            void grid.offsetHeight; // Force reflow
            grid.innerHTML = squaresHTML;
            void grid.offsetHeight; // Force another reflow

            if (oldHTML !== squaresHTML) {
                HalloweenDebug.log(2, `🔥 Bounty display updated (HTML changed) - forced repaint`);
            } else {
                HalloweenDebug.log(2, `🔥 Bounty display unchanged (same HTML)`);
            }

            HalloweenDebug.log(2, `🔥 Updated Bounties Claimed display: ${numBounties} bounties`);
            HalloweenDebug.log(3, `🔥 Grid element:`, grid);
        },

        buildCleanMenu: function(seedInfo, stats, config) {
            HalloweenDebug.log(3, '🎃 buildCleanMenu called - toggle should be 25px, image should be centered');
            HalloweenDebug.log(3, '🎃 seedInfo.isLeaderMode:', seedInfo.isLeaderMode);
            HalloweenDebug.log(3, '🎃 seedInfo.menuPanelView:', seedInfo.menuPanelView);

            // Pre-calculate toggle values based on menu panel view preference
            const menuPanelView = seedInfo.menuPanelView;
            const showLeaderPanel = menuPanelView === 'leader';
            const leaderToggleClass = showLeaderPanel ? 'active' : '';
            const leaderToggleBg = showLeaderPanel ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)';
            const leaderToggleLeft = showLeaderPanel ? '25px' : '2px';

            // Build different menu content based on leader mode
            const memberContent = `
                <!-- PLAYER IDENTITY Section (Member Only) -->
                ${this.generatePlayerIdentitySection()}

                <!-- TEAM BADGE (Member Only) -->
                ${this.generateTeamBadge()}

                <!-- Combined Competition Countdown (shown when both competitions active and ends match) -->
                <div style="margin-bottom: 15px;">
                    <div style="text-align: center; margin-bottom: 5px;">
                        <span id="member-combined-status-link" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: none; opacity: 0.8;">Show Competition Status</span>
                    </div>
                    <div id="member-combined-countdown-container" style="display: none; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 6px; padding: 10px 15px; text-align: center;">
                        <span id="member-combined-countdown-text" style="font-weight: bold; color: var(--carved-cyan); font-size: 12px;">Competitions end in...</span>
                    </div>
                </div>

                <!-- SPOOKY TARGETS Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 14px; font-weight: bold; color: var(--carved-cyan);">SPOOKY TARGETS</span>
                        <span id="member-spooky-status-link" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: none; opacity: 0.8;">Show Status</span>
                    </div>

                    <!-- Spooky Countdown (hidden by default, shown in individual mode) -->
                    <div id="member-spooky-countdown" style="display: none; margin-bottom: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 6px; padding: 10px 15px; text-align: center;">
                        <span id="member-spooky-countdown-text" style="font-weight: bold; color: var(--carved-cyan); font-size: 12px;">Ends in...</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                        <div id="souls-banished-member" style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; margin: 6px 0;">${stats.uniqueDefeats}</div>
                            <div style="font-size: 11px; opacity: 0.8;">Souls Banished</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; margin: 6px 0;">${stats.uniqueEncounters}</div>
                            <div style="font-size: 11px; opacity: 0.8;">Targets Found</div>
                        </div>
                    </div>

                    <!-- Defeat Verification Stats -->
                    <div id="defeat-verification-stats" style="padding-top: 12px; border-top: 1px solid rgba(0, 255, 255, 0.2);">
                        <div id="defeat-verification-header" style="font-size: 11px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 8px; text-align: center; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <span>Defeat Verification Status</span>
                            <span id="defeat-verification-toggle" style="font-size: 10px; transition: transform 0.3s ease;">&#9660;</span>
                        </div>
                        <div id="defeat-verification-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <div id="defeat-verification-boxes" style="margin-top: 8px;">
                                <!-- Boxes will be dynamically inserted here -->
                            </div>

                            <!-- API Last Refresh Info (only shown in API mode) -->
                            <div id="api-refresh-info-section" style="display: none; margin-top: 8px; text-align: center; font-size: 9px; color: rgba(0, 255, 255, 0.6);">
                                Last refresh: <span id="api-last-refresh-time">Never</span>
                            </div>
                        </div>
                    </div>

                    <!-- Switch to API Mode Link (Member ID users only) -->
                    ${this.generateSwitchToAPILink()}
                </div>

                ${this.generateCollectiblesSection()}

                ${this.generateBonusStatsSection()}

                <!-- PHANTOM SETTINGS Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div id="phantom-settings-header" style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>PHANTOM SETTINGS</span>
                        <span id="phantom-settings-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <div id="phantom-settings-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Ethereal Manifestations</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Toggle background visual effects</div>
                        </div>
                        <div class="toggle ${HalloweenUI.backgroundEnabled ? 'active' : ''}" id="bg-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${HalloweenUI.backgroundEnabled ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${HalloweenUI.backgroundEnabled ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>

                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Spectral Echoes</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Enable audio feedback sounds</div>
                        </div>
                        <div class="toggle ${HalloweenUI.soundEnabled ? 'active' : ''}" id="sound-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${HalloweenUI.soundEnabled ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${HalloweenUI.soundEnabled ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>

                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Collectible Helper</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Click Torn logo to navigate enchanted pages</div>
                        </div>
                        <div class="toggle ${HalloweenUI.collectibleHelperEnabled ? 'active' : ''}" id="collectible-helper-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${HalloweenUI.collectibleHelperEnabled ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${HalloweenUI.collectibleHelperEnabled ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>

                    </div>
                </div>

                <!-- ARCANE RITUALS Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div id="arcane-rituals-header" style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>ARCANE RITUALS</span>
                        <span id="arcane-rituals-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <div id="arcane-rituals-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <textarea id="halloween-import-json" placeholder="Inscribe spirit configuration runes..." style="
                        width: 100%; height: 80px; background: rgba(0, 0, 0, 0.7);
                        border: 1px solid var(--carved-cyan); border-radius: 6px;
                        color: white; padding: 12px; font-family: 'Fjalla One', 'Orbitron', sans-serif;
                        font-size: 12px; resize: vertical; margin-bottom: 12px; box-sizing: border-box;
                    "></textarea>

                    <button id="import-config" style="width: 100%; padding: 12px; background: linear-gradient(45deg, #4b0082, var(--carved-magenta)); color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: bold; margin-bottom: 15px; cursor: pointer;">INVOKE RITUAL</button>

                    <!-- Toast Notification Area -->
                    <div id="arcane-rituals-toast" style="
                        display: none;
                        margin-top: 8px;
                        padding: 8px;
                        font-size: 10px;
                        text-align: center;
                        border-radius: 4px;
                        line-height: 1.4;
                        transition: opacity 0.3s ease;
                    "></div>

                    </div>
                </div>

                ${typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY ? `
                <!-- DOMINION MODE Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 15px;">DOMINION MODE</div>
                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Spectral Authority</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Command ethereal forces</div>
                        </div>
                        <div class="toggle ${showLeaderPanel ? 'active' : ''}" id="leader-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${showLeaderPanel ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${showLeaderPanel ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Ethereal Seed Display -->
                <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(0, 255, 255, 0.2);">
                    <div style="font-size: 10px; opacity: 0.6; color: var(--carved-cyan);">
                        Ethereal seed: ${seedInfo.currentSeed || 'None'}
                    </div>
                    <div style="font-size: 10px; opacity: 0.6; color: var(--carved-cyan); margin-top: 4px;">
                        ${(() => {
                            const isAPIMode = GM_getValue('halloween_api_mode', false);
                            if (isAPIMode) {
                                const memberName = GM_getValue('halloween_api_member_name', '');
                                const memberID = GM_getValue('halloween_api_member_id', 0);
                                return `Member: ${memberName || 'Unknown'} ${memberID ? `(${memberID})` : ''}`.trim();
                            } else {
                                const memberID = GM_getValue('halloween_player_id', '');
                                return memberID ? `Member: ${memberID}` : 'Member: Not enrolled';
                            }
                        })()}
                    </div>
                </div>

                <!-- Reset Script and Refresh API Link -->
                <div style="text-align: center; margin-top: 10px;">
                    <span id="reset-script-trigger" style="font-size: 10px; color: rgba(255, 255, 255, 0.5); cursor: pointer; text-decoration: underline; transition: color 0.3s;">Reset Script</span>
                    <span id="api-refresh-link-separator" style="display: none; font-size: 10px; color: rgba(255, 255, 255, 0.3);">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <span id="api-refresh-link" style="display: none; font-size: 10px; color: rgba(255, 255, 255, 0.5); cursor: pointer; text-decoration: underline; transition: color 0.3s;">Refresh API</span>

                    <!-- Toast Notification Area -->
                    <div id="api-refresh-toast" style="
                        display: none;
                        margin-top: 8px;
                        padding: 6px;
                        font-size: 10px;
                        text-align: center;
                        border-radius: 4px;
                        transition: opacity 0.3s ease;
                    "></div>

                    <div id="reset-confirmation" style="display: none; margin-top: 10px; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 4px;">
                        <div style="color: #ff4444; font-size: 11px; font-weight: bold; margin-bottom: 8px; line-height: 1.3; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">⚠️ RESET OPTIONS</div>
                        <!-- <div style="color: #fff; font-size: 10px; margin-bottom: 8px; line-height: 1.4;">Choose reset type:</div> -->

                        <!-- Reset Settings Option -->
                        <!-- COMMENTED OUT: Reset Settings Only (UI preferences can be toggled manually)
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 4px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.2);">
                            <div style="font-size: 10px; font-weight: bold; color: #ffa500; margin-bottom: 4px;">Reset Settings Only</div>
                            <div style="font-size: 9px; opacity: 0.7; margin-bottom: 6px; line-height: 1.3;">Clears UI preferences, preserves competition data</div>
                            <button id="reset-settings" style="width: 100%; padding: 6px; background: #ffa500; color: white; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold;">RESET SETTINGS</button>
                        </div>
                        -->

                        <!-- Reset Progress Option -->
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid rgba(255, 165, 0, 0.3);">
                            <div style="font-size: 10px; font-weight: bold; color: #ffa500; margin-bottom: 4px;">Reset Progress</div>
                            <div style="font-size: 9px; opacity: 0.7; margin-bottom: 6px; line-height: 1.3;">Clears API logs, defeats, collectibles - preserves imported config</div>
                            <button id="reset-all" style="width: 100%; padding: 6px; background: #ffa500; color: white; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold;">RESET PROGRESS</button>
                        </div>

                        <button id="cancel-reset" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px; font-size: 9px; cursor: pointer;">CANCEL</button>
                    </div>
                </div>
            `;

            const leaderContent = `
                <!-- DOMINION MODE Section (Leader Mode) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 15px;">DOMINION MODE</div>
                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(255, 105, 180, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-magenta);">Spectral Authority</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Return to Member Panel</div>
                        </div>
                        <div class="toggle ${showLeaderPanel ? 'active' : ''}" id="leader-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${showLeaderPanel ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${showLeaderPanel ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>
                </div>

                <!-- TARGET PAIRS MANAGEMENT Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="target-pairs-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>TARGET PAIRS MANAGEMENT</span>
                        <span id="target-pairs-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>
                    <div id="target-pairs-content" style="display: block; overflow: hidden; transition: max-height 0.3s ease; max-height: 0px;">
                        <div style="font-size: 11px; margin-bottom: 8px; opacity: 0.8; color: #fff;">Target Pairs from Seed:</div>
                    <div id="target-pairs-display" style="
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 5px;
                        padding: 8px;
                        font-family: monospace;
                        font-size: 10px;
                        line-height: 1.2;
                    ">
                        ${this.generateTargetPairsDisplay()}
                    </div>
                    </div>
                </div>

                <!-- SPOOKY TARGETS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="spooky-schedule-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>SPOOKY TARGETS</span>
                        <span id="spooky-schedule-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <!-- Spooky Targets Countdown/Status - Always Visible -->
                    <div id="spooky-targets-countdown" style="text-align: center; margin-bottom: 10px; padding: 10px; background: rgba(0, 255, 255, 0.1); border-radius: 6px; font-weight: bold; color: var(--carved-cyan); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: clamp(10px, 2.5vw, 13px); line-height: 1.2;">
                        ⚙️ Awaiting Configuration
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="spooky-schedule-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Configure Spooky Targets
                    </div>

                    <div id="spooky-schedule-content" style="display: block; overflow: hidden; transition: max-height 0.3s ease; max-height: 0px;">

                        <!-- Spooky Targets Active Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Spooky Targets Active:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="spooky-targets-active-toggle" style="transform: scale(1.2);">
                                <span id="spooky-targets-active-status" style="font-size: 11px; color: var(--carved-magenta); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Testing Mode Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Testing Mode (Override Dates):</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="spooky-testing-mode-toggle" style="transform: scale(1.2);">
                                <span id="spooky-testing-mode-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Start Date & Time -->
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; font-size: 10px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 4px; margin-left: 2px;">START DATE & TIME</label>
                            <div style="display: flex; gap: 6px;">
                                <input type="date" id="spooky-start-date" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                                <input type="time" id="spooky-start-time" style="padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            </div>
                        </div>

                        <!-- End Date & Time -->
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; font-size: 10px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 4px; margin-left: 2px;">END DATE & TIME</label>
                            <div style="display: flex; gap: 6px;">
                                <input type="date" id="spooky-end-date" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                                <input type="time" id="spooky-end-time" style="padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            </div>
                        </div>

                        <!-- DISABLED: Purple popup notification
                        <div style="font-size: 9px; color: #ccc; margin-top: 8px; opacity: 0.7; line-height: 1.3; text-align: center;">
                            End notification triggers automatically on end date
                        </div>
                        <div style="text-align: center; margin-top: 6px;">
                            <span id="preview-spooky-end-notification" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: underline; opacity: 0.8;">Preview</span>
                        </div>
                        -->

                        <!-- Show Excluded Player IDs Link -->
                        <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(255, 105, 180, 0.3);">
                            <a id="show-excluded-ids-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                                Show Excluded Player IDs
                            </a>
                        </div>

                        <!-- Excluded Player IDs Management (Hidden by default) -->
                        <div id="excluded-ids-section" style="display: none; margin-top: 15px; padding: 12px; background: rgba(255, 105, 180, 0.05); border: 1px solid rgba(255, 105, 180, 0.3); border-radius: 6px;">
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px;">Excluded Player IDs</div>
                            <div style="font-size: 9px; color: #ccc; margin-bottom: 10px; opacity: 0.8; display: flex; align-items: center; gap: 5px;">
                                <span style="font-size: 12px;">💡</span>
                                <span>Comma-separated values (excludes faction/allied members from spooky targets)</span>
                            </div>

                            <!-- Validation Feedback (Above textarea) -->
                            <div id="exclusion-validation-feedback" style="margin-bottom: 8px; font-size: 11px; padding: 6px; border-radius: 4px; display: none;">
                                <!-- Feedback will be dynamically inserted here -->
                            </div>

                            <!-- Textarea for IDs -->
                            <textarea id="excluded-ids-textarea"
                                      placeholder="1414939,1864491,2052659,..."
                                      style="width: 100%;
                                             max-height: 150px;
                                             min-height: 80px;
                                             overflow-y: auto;
                                             overflow-x: hidden;
                                             -webkit-overflow-scrolling: touch;
                                             scrollbar-gutter: stable;
                                             padding: 8px;
                                             border: 1px solid var(--carved-magenta);
                                             border-radius: 4px;
                                             background: rgba(0, 0, 0, 0.5);
                                             color: #fff;
                                             font-size: 11px;
                                             font-family: 'Courier New', monospace;
                                             box-sizing: border-box;
                                             resize: vertical;"></textarea>
                            <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7;">Changes save automatically when you click outside the box</div>
                        </div>

                    </div>
                </div>

                <!-- MANIFESTATIONS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="manifestations-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>MANIFESTATIONS</span>
                        <span id="manifestations-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Competition Countdown/Status - Always Visible -->
                    <div id="competition-countdown" style="text-align: center; margin-bottom: 10px; padding: 10px; background: rgba(0, 255, 255, 0.1); border-radius: 6px; font-weight: bold; color: var(--carved-cyan); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: clamp(10px, 2.5vw, 13px); line-height: 1.2;">
                        🧪 TESTING MODE ACTIVE
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="manifestations-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Configure Collectible distribution
                    </div>

                    <div id="manifestations-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <!-- Competition Active Toggle -->
                    <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold;">Competition Active:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="competition-active-toggle" style="transform: scale(1.2);">
                            <span id="competition-active-status" style="font-size: 11px; color: var(--carved-magenta); font-weight: bold;">OFF</span>
                        </div>
                    </div>

                    <!-- Testing Mode Toggle -->
                    <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold;">Testing Mode:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="testing-mode-toggle" style="transform: scale(1.2);">
                            <span id="testing-mode-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                        </div>
                    </div>

                    <!-- Testing Display Mode (only visible when Testing Mode is ON) -->
                    <div id="testing-display-mode" style="margin-bottom: 12px; display: none; padding: 8px; background: rgba(255, 165, 0, 0.1); border-radius: 4px; border: 1px solid var(--carved-orange);">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Testing Display:</label>
                        <div style="display: flex; gap: 12px;">
                            <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="radio" name="testing-display" value="all" style="transform: scale(1.1);">
                                <span>All Spawns</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="radio" name="testing-display" value="single" checked style="transform: scale(1.1);">
                                <span>Single Random</span>
                            </label>
                        </div>
                        <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.8;">
                            All: Show entire competition at once | Single: Show one random pumpkin (realistic simulation)
                        </div>

                        <!-- Test Pages Only Toggle -->
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 165, 0, 0.3);">
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="checkbox" id="testing-test-pages-only" style="transform: scale(1.1);">
                                <span>Use Test Pages only</span>
                            </label>
                            <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.8;">
                                When enabled, testing spawns only appear on the home page (index.php)
                            </div>
                        </div>

                        <!-- Respawn Toggle -->
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 165, 0, 0.3);">
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="checkbox" id="testing-respawn-allowed" style="transform: scale(1.1);">
                                <span>Respawn Allowed (immediate respawn after collection)</span>
                            </label>
                            <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.8;">
                                When enabled, collectibles respawn immediately after collection for continuous testing
                            </div>
                        </div>
                    </div>

                    <!-- Competition Start Date/Time -->
                    <div style="margin-bottom: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Competition Start (GMT):</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="date" id="competition-start-date" style="flex: 1; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px;">
                            <input type="time" id="competition-start-time" style="flex: 1; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px;">
                        </div>
                    </div>

                    <!-- Competition Duration -->
                    <div style="margin-bottom: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Competition Duration:</label>
                        <select id="competition-duration" style="width: 100%; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px;">
                            <!-- Temporarily disabled - only 7-day format fully tested
                            <option value="3">3 Days</option>
                            <option value="5">5 Days</option>
                            -->
                            <option value="7" selected>7 Days (Standard)</option>
                            <!-- Temporarily disabled - only 7-day format fully tested
                            <option value="10">10 Days</option>
                            <option value="14">14 Days</option>
                            -->
                        </select>
                    </div>

                    <!-- Collections Firebase Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-collections-firebase-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Collections Firebase URL
                        </a>
                    </div>

                    <!-- Collections Firebase URL (Hidden by default) -->
                    <div id="collections-firebase-section" style="display: none; margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Collections Firebase URL:</label>
                        <input type="url" id="collections-firebase-url" placeholder="https://your-project.firebasedatabase.app" style="width: 100%; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px; box-sizing: border-box;">
                        <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7;">Logs pumpkin spawns & collections for audit trail</div>
                    </div>

                    <!-- Show Enchanted Pages Link -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-enchanted-pages-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Enchanted Pages
                        </a>
                    </div>

                    <!-- Enchanted Pages Management (Hidden by default) -->
                    <div id="enchanted-pages-section" style="display: none; margin-top: 15px; padding: 12px; background: rgba(139, 0, 139, 0.05); border: 1px solid rgba(139, 0, 139, 0.3); border-radius: 6px;">
                        <div style="font-size: 12px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px;">Enchanted Pages</div>
                        <div style="font-size: 9px; color: #ccc; margin-bottom: 10px; opacity: 0.8;">
                            Configure where pumpkins can spawn during the competition
                        </div>

                        <!-- URL Rows Container -->
                        <div id="enchanted-pages-rows" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; margin-bottom: 10px;">
                            <!-- Dynamic rows will be added here -->
                        </div>

                        <!-- Add Page Button -->
                        <button id="add-enchanted-page" style="width: 100%; padding: 8px; background: linear-gradient(45deg, #4b0082, var(--carved-magenta)); color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">
                            + Add Page
                        </button>
                    </div>

                    </div> <!-- End manifestations-content -->
                </div>

                <!-- DAILY BOUNTIES Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="daily-bounties-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>DAILY BOUNTIES</span>
                        <span id="daily-bounties-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Bounty Status - Always Visible -->
                    <div id="bounty-status" style="text-align: center; margin-bottom: 10px; padding: 10px; background: rgba(0, 255, 255, 0.1); border-radius: 6px; font-weight: bold; color: var(--carved-cyan); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: clamp(10px, 2.5vw, 13px); line-height: 1.2;">
                        ⚙️ Awaiting Configuration
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="daily-bounties-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Configure daily bounties (7 max)
                    </div>

                    <div id="daily-bounties-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                        <!-- Bounties Active Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Bounties Active:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="bounties-active-toggle" style="transform: scale(1.2);">
                                <span id="bounties-active-status" style="font-size: 11px; color: var(--carved-magenta); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Testing Mode Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Use Testing Mode:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="bounties-testing-toggle" style="transform: scale(1.2);">
                                <span id="bounties-testing-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Note about Halloweek -->
                        <div style="font-size: 9px; color: #ff9900; margin-bottom: 12px; padding: 8px; background: rgba(255, 153, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 153, 0, 0.3); line-height: 1.4;">
                            <strong>Note:</strong> Bounties must be active ONLY during official Halloweek for attack collection to function properly.
                        </div>

                        <!-- Bounties List Container -->
                        <div id="bounties-list" style="margin-bottom: 12px;">
                            <!-- Dynamic rows will be inserted here -->
                        </div>

                        <!-- Add Bounty Button -->
                        <button id="add-bounty-btn" style="width: 100%; padding: 8px; background: linear-gradient(45deg, #4b0082, var(--carved-magenta)); color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold;">+ ADD BOUNTY (MAX 7)</button>
                    </div>
                </div>

                <!-- ETHEREAL COMMAND Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="ethereal-command-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>ETHEREAL COMMAND</span>
                        <span id="ethereal-command-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="ethereal-command-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Master seed controls and import
                    </div>

                    <div id="ethereal-command-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                        <div style="font-size: 11px; margin-bottom: 8px; margin-left: 2px;">Master Essence: ${seedInfo.leaderSeed || 'None'}</div>
                        <div style="display: flex; margin-bottom: 8px;">
                            <input type="text" id="halloween-leader-seed-input" placeholder="Enter leader essence for channeling..." style="
                                flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.5);
                                border: 1px solid var(--carved-magenta); border-radius: 4px;
                                color: #fff; font-size: 10px;
                            " />
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button id="generate-leader-seed" style="flex: 1; padding: 8px; background: var(--carved-cyan); color: black; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">MANIFEST</button>
                            <button id="set-leader-seed" style="flex: 1; padding: 8px; background: var(--carved-magenta); color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">CHANNEL</button>
                        </div>
                    </div>
                </div>

                <!-- SPECTRAL FORGE Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="spectral-forge-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>SPECTRAL FORGE</span>
                        <span id="spectral-forge-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="spectral-forge-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Faction customization and branding tools
                    </div>

                    <div id="spectral-forge-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <!-- Colour Settings Toggle -->
                    <div style="text-align: center; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-colour-settings-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Colour Settings
                        </a>
                    </div>

                    <!-- Colour Settings Section (Hidden by default) -->
                    <div id="colour-settings-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <div style="margin-bottom: 12px; display: flex; gap: 12px;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">PRIMARY COLOR</label>
                                <input type="color" id="halloween-primary-color" value="#ff6b35" style="width: 100%; height: 25px; padding: 2px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; cursor: pointer; box-sizing: border-box;">
                                <input type="text" id="halloween-primary-color-text" value="#ff6b35" placeholder="#ff6b35" style="width: 100%; margin-top: 5px; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; text-align: center; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 4px; opacity: 0.7; text-align: center; margin-left: 2px;">Clear to reset default</div>
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">SECONDARY COLOR</label>
                                <input type="color" id="halloween-secondary-color" value="#f7931e" style="width: 100%; height: 25px; padding: 2px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; cursor: pointer; box-sizing: border-box;">
                                <input type="text" id="halloween-secondary-color-text" value="#f7931e" placeholder="#f7931e" style="width: 100%; margin-top: 5px; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; text-align: center; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 4px; opacity: 0.7; text-align: center; margin-left: 2px;">Clear to reset default</div>
                            </div>
                        </div>
                    </div>

                    <!-- Image Settings Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-image-settings-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Image Settings
                        </a>
                    </div>

                    <!-- Image Settings Section (Hidden by default) -->
                    <div id="image-settings-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <!-- Menu Panel Image -->
                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 8px;">MENU PANEL IMAGE</div>
                            <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                                <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                    <input type="radio" name="menu-panel-image" value="icon" id="menu-panel-icon" checked style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                    <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🎨 Icon (Circular)</span>
                                </label>
                                <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                    <input type="radio" name="menu-panel-image" value="banner" id="menu-panel-banner" style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                    <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🖼️ Banner (Wide)</span>
                                </label>
                            </div>

                            <!-- Icon URL Field (shown when Icon selected) -->
                            <div id="icon-url-field" style="display: block;">
                                <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Icon URL:</label>
                                <input type="url" id="halloween-icon-url" placeholder="https://example.com/icon.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 2px; padding-top: 2px; padding-left: 2px; opacity: 0.7;">Circular icon for menu toggle & Icon mode panel header</div>
                            </div>

                            <!-- Banner URL Field (shown when Banner selected) -->
                            <div id="banner-url-field" style="display: none;">
                                <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Banner URL:</label>
                                <input type="url" id="halloween-banner-url" placeholder="https://example.com/banner.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 2px; padding-top: 2px; padding-left: 2px; opacity: 0.7;">Wide banner image for Banner mode panel header</div>
                            </div>
                        </div>

                        <!-- Background Tile Image -->
                        <div style="margin-bottom: 0;">
                            <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">BACKGROUND TILE IMAGE</label>
                            <input type="url" id="halloween-tile-image" placeholder="https://example.com/tile.png" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7; margin-left: 2px;">Optional: Repeating tile image for page background</div>
                        </div>
                    </div>

                    <!-- Target Effect Types Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-target-effects-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Target Effect Types
                        </a>
                    </div>

                    <!-- Target Effect Types Section (Hidden by default) -->
                    <div id="target-effects-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <div style="font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 8px;">SPOOKY TARGET EFFECT TYPE</div>
                        <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="spooky-effect-type" value="emoji" id="spooky-effect-type-emoji" checked style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🎃 Emoji Patterns</span>
                            </label>
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="spooky-effect-type" value="image" id="spooky-effect-type-image" style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🖼️ Custom Image</span>
                            </label>
                        </div>
                        <div id="spooky-custom-image-field" style="display: none;">
                            <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Image URL:</label>
                            <input type="url" id="spooky-custom-image-url" placeholder="https://example.com/image.png" value="https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                            <div style="font-size: 8px; color: #ccc; margin-top: 2px; opacity: 0.7;">Recommended: PNG/JPG, 100-200px size</div>

                            <!-- Max Scale Slider -->
                            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 105, 180, 0.2);">
                                <div style="font-size: 8px; color: #ccc; margin-bottom: 4px; opacity: 0.7;">Max scale of grow effect. Default 2.5x</div>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="range" id="spooky-max-scale" min="0" max="5" step="0.25" value="2.5" style="flex: 1; accent-color: var(--carved-magenta);">
                                    <span id="spooky-max-scale-value" style="font-size: 10px; color: #fff; min-width: 35px; text-align: right;">2.5x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bounty Effect Types Section (Hidden by default) -->
                    <div id="bounty-effects-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <div style="font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 8px;">BOUNTY TARGET EFFECT TYPE</div>
                        <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="bounty-effect-type" value="emoji" id="bounty-effect-type-emoji" checked style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🔥 Emoji Patterns</span>
                            </label>
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="bounty-effect-type" value="image" id="bounty-effect-type-image" style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🖼️ Custom Image</span>
                            </label>
                        </div>
                        <div id="bounty-custom-image-field" style="display: none;">
                            <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Image URL:</label>
                            <input type="url" id="bounty-custom-image-url" placeholder="https://example.com/image.png" value="https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                            <div style="font-size: 8px; color: #ccc; margin-top: 2px; opacity: 0.7;">Recommended: PNG/JPG, 100-200px size</div>

                            <!-- Max Scale Slider -->
                            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 105, 180, 0.2);">
                                <div style="font-size: 8px; color: #ccc; margin-bottom: 4px; opacity: 0.7;">Max scale of grow effect. Default 2.5x</div>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="range" id="bounty-max-scale" min="0" max="5" step="0.25" value="2.5" style="flex: 1; accent-color: var(--carved-magenta);">
                                    <span id="bounty-max-scale-value" style="font-size: 10px; color: #fff; min-width: 35px; text-align: right;">2.5x</span>
                                </div>
                            </div>

                            <!-- Glow Effect Settings -->
                            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 105, 180, 0.2);">
                                <label style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #fff; cursor: pointer; margin-bottom: 8px;">
                                    <input type="checkbox" id="bounty-glow-enabled" checked style="accent-color: var(--carved-magenta);">
                                    <span>Enable Glow Effect</span>
                                </label>

                                <div id="bounty-glow-settings" style="display: block;">
                                    <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Glow Color:</label>
                                    <div style="display: flex; gap: 6px; align-items: center;">
                                        <input type="color" id="bounty-glow-color" value="#ff6b35" style="width: 40px; height: 25px; padding: 2px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; cursor: pointer;">
                                        <input type="text" id="bounty-glow-color-text" value="#ff6b35" placeholder="#ff6b35" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; text-align: center;">
                                    </div>
                                    <div style="font-size: 8px; color: #ccc; margin-top: 2px; opacity: 0.7;">Clear to reset to default (#ff6b35)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Firebase Attack Config Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-firebase-config-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Firebase Attack Config
                        </a>
                    </div>

                    <!-- Firebase Attack Config Section (Hidden by default) -->
                    <div id="firebase-config-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <!-- Attack Logs Firebase URL -->
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">ATTACK LOGS FIREBASE URL</label>
                            <input type="url" id="attack-logs-firebase-url" placeholder="https://your-project.firebaseio.com" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7; margin-left: 2px;">Firebase Realtime Database URL for defeat verification</div>
                        </div>

                        <!-- RTDB Key -->
                        <div style="margin-bottom: 0;">
                            <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">RTDB KEY</label>
                            <input type="text" id="rtdb-key" placeholder="Enter database authentication key" autocomplete="off" data-form-type="other" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7; margin-left: 2px;">Required for secure database access</div>
                        </div>
                    </div>

                    </div> <!-- End spectral-forge-content -->
                </div>

                <!-- VOID TRANSMISSIONS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="halloween-announcements-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>VOID TRANSMISSIONS</span>
                        <span id="halloween-announcements-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="void-transmissions-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Customise news ticker hijacking
                    </div>

                    <div id="halloween-announcements-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                        <div style="font-size: 11px; margin-bottom: 10px; opacity: 0.8; color: #fff;">Configure spooky messages for news ticker hijacking:</div>

                        <!-- Ticker Timing Controls -->
                        <div style="margin-bottom: 15px; display: flex; gap: 12px; align-items: center;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 10px; color: #fff; opacity: 0.8; margin-bottom: 2px; text-align: center;">Display (sec)</label>
                                <input type="number" id="ticker-duration" min="1" max="10" step="1" value="4" style="width: 100%; padding: 4px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; text-align: center; box-sizing: border-box; -moz-appearance: textfield;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 10px; color: #fff; opacity: 0.8; margin-bottom: 2px; text-align: center;">Cycle (sec)</label>
                                <input type="number" id="ticker-frequency" min="10" max="60" step="5" value="15" style="width: 100%; padding: 4px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; text-align: center; box-sizing: border-box; -moz-appearance: textfield;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 10px; color: #fff; opacity: 0.8; margin-bottom: 2px; text-align: center;">Default: #ff6b35</label>
                                <input type="color" id="ticker-color" value="#ff6b35" style="width: 100%; height: 24px; padding: 0; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; cursor: pointer; box-sizing: border-box;">
                            </div>
                        </div>

                        <!-- Announcement Count Display -->
                        <div id="announcements-count-feedback" style="margin-bottom: 8px; font-size: 11px; padding: 6px; border-radius: 4px; background: rgba(0, 255, 0, 0.1); border: 1px solid rgba(0, 255, 0, 0.3); color: #90EE90; display: none;">
                            <!-- Count will be dynamically inserted here -->
                        </div>

                        <div id="halloween-announcements-list" style="max-height: 250px; overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; margin-bottom: 10px;">
                            <!-- Dynamic announcement fields will be inserted here -->
                        </div>
                        <button id="add-announcement" style="width: 100%; padding: 6px; background: var(--carved-cyan); color: black; border: none; border-radius: 4px; font-size: 10px; cursor: pointer; margin-top: 8px;">ADD MESSAGE</button>
                        <div style="margin-top: 8px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px; font-size: 9px; color: #fff; opacity: 0.7;">
                            💡 Start messages with emojis to replace ticker icon. Leave empty to auto-cleanup on menu close.
                        </div>

                        <!-- Date Specific Messages subsection -->
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255, 105, 180, 0.3);">
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px;">Date specific messages</div>
                            <div id="halloween-date-announcements-list">
                                <!-- Dynamic date announcement fields will be inserted here -->
                            </div>
                            <button id="add-date-announcement" style="width: 100%; padding: 6px; background: var(--carved-cyan); color: black; border: none; border-radius: 4px; font-size: 10px; cursor: pointer; margin-top: 8px;">ADD MESSAGE</button>
                            <div style="margin-top: 8px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px; font-size: 9px; color: #fff; opacity: 0.7;">
                                💡 Messages only appear on their specified date (dd/mm/yyyy). Leave message empty to auto-cleanup on menu close.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SOUL CONDUIT Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="soul-conduit-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>SOUL CONDUIT</span>
                        <span id="soul-conduit-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="soul-conduit-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Export configurations for team distribution
                    </div>

                    <div id="soul-conduit-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <!-- Reload Config Button -->
                    <button id="reload-preload-config" style="width: 100%; padding: 8px; background: #4b0082; color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer; margin-bottom: 12px;">
                        🔄 RELOAD CONFIG FROM SCRIPT
                    </button>

                    <!-- Reload Message (hidden by default) -->
                    <div id="reload-config-message" style="display: none; padding: 10px; background: rgba(0, 255, 0, 0.1); border: 1px solid rgba(0, 255, 0, 0.3); border-radius: 4px; margin-bottom: 12px; text-align: center;">
                        <div style="font-size: 11px; color: #00ff00; font-weight: bold;">✅ Config reset - refresh page to re-import</div>
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <button id="export-leader" style="flex: 1; padding: 8px; background: var(--carved-magenta); color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">EXPORT LEADER</button>
                        <button id="export-member" style="flex: 1; padding: 8px; background: var(--carved-cyan); color: black; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">EXPORT MEMBER</button>
                    </div>

                    <!-- Export Display (hidden by default, shown when export buttons clicked) -->
                    <div id="export-fallback-container" style="display: none; margin-top: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <label style="font-size: 11px; font-weight: bold; color: var(--carved-magenta);">EXPORTED CONFIGURATION</label>
                            <div style="display: flex; gap: 6px;">
                                <button id="copy-export-btn" style="padding: 4px 8px; background: var(--carved-cyan); color: black; border: none; border-radius: 3px; font-size: 10px; cursor: pointer; font-weight: bold;">COPY</button>
                                <button id="dismiss-export-btn" style="padding: 4px 8px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 3px; font-size: 10px; cursor: pointer; font-weight: bold;">DISMISS</button>
                            </div>
                        </div>
                        <textarea id="export-fallback-output" readonly style="width: 100%; height: 100px; background: rgba(0, 0, 0, 0.7); border: 1px solid var(--carved-magenta); border-radius: 6px; color: white; padding: 12px; font-family: 'Courier New', monospace; font-size: 10px; overflow-y: auto; box-sizing: border-box;"></textarea>
                        <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.7;">Click COPY to copy configuration to clipboard.</div>
                    </div>
                    </div> <!-- End soul-conduit-content -->
                </div>

                <!-- UNDERWORLD RITUALS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="underworld-rituals-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>UNDERWORLD RITUALS</span>
                        <span id="underworld-rituals-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="underworld-rituals-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Console commands and debugging
                    </div>

                    <div id="underworld-rituals-content" style="display: block; overflow: hidden; transition: max-height 0.3s ease; max-height: 0px;">
                        <!-- API Testing Mode Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Testing API Data:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="api-testing-mode-toggle" style="transform: scale(1.2);">
                                <span id="api-testing-mode-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>
                        <div style="font-size: 10px; margin-bottom: 12px; padding: 8px; background: rgba(255, 165, 0, 0.05); border-radius: 4px; color: rgba(255, 255, 255, 0.7); line-height: 1.3;">
                            When enabled, uses enrollment timestamp instead of competition start for API attack data collection
                        </div>

                        <!-- Override Enrollment Date Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label for="api-override-date-toggle" style="font-size: 12px; color: #fff; font-weight: bold;">Override Start Date:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="api-override-date-toggle" disabled style="transform: scale(1.2);">
                                <span id="api-override-date-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Override Date/Time Picker (hidden by default) -->
                        <div id="api-override-date-picker" style="display: none; margin-bottom: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 10px; color: rgba(255, 255, 255, 0.8); display: block; margin-bottom: 6px;">Override Date & Time (TCT):</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="date" id="api-override-date" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-cyan); border-radius: 3px; color: #fff; font-size: 11px;">
                                <input type="time" id="api-override-time" value="00:00" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-cyan); border-radius: 3px; color: #fff; font-size: 11px;">
                            </div>
                            <div style="font-size: 9px; margin-top: 6px; color: rgba(255, 255, 255, 0.6); line-height: 1.3;">
                                Backdates attack collection start for PDA stress testing (e.g., set to 1 week ago)
                            </div>
                        </div>

                        <!-- Override Period Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label for="api-override-period-toggle" style="font-size: 12px; color: #fff; font-weight: bold;">Override Period:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="api-override-period-toggle" disabled style="transform: scale(1.2);">
                                <span id="api-override-period-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Override Period Picker (hidden by default) -->
                        <div id="api-override-period-picker" style="display: none; margin-bottom: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 10px; color: rgba(255, 255, 255, 0.8); display: block; margin-bottom: 6px;">Period Start Date & Time (TCT):</label>
                            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                                <input type="date" id="api-period-start-date" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-cyan); border-radius: 3px; color: #fff; font-size: 11px;">
                                <input type="time" id="api-period-start-time" value="00:00" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-cyan); border-radius: 3px; color: #fff; font-size: 11px;">
                            </div>
                            <label style="font-size: 10px; color: rgba(255, 255, 255, 0.8); display: block; margin-bottom: 6px;">Duration:</label>
                            <select id="api-period-duration" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-cyan); border-radius: 3px; color: #fff; font-size: 11px;">
                                <option value="" disabled selected>Select duration...</option>
                                <option value="3">3 Days</option>
                                <option value="5">5 Days</option>
                                <option value="7">7 Days</option>
                                <option value="10">10 Days</option>
                                <option value="14">14 Days</option>
                            </select>
                            <div style="font-size: 9px; margin-top: 6px; color: rgba(255, 255, 255, 0.6); line-height: 1.3;">
                                Locks API data to a specific historical window (prevents fetching excessive data)
                            </div>
                        </div>

                        <!-- Clear API Data Button -->
                        <div style="margin-bottom: 12px; padding: 8px; background: rgba(255, 69, 0, 0.1); border: 1px solid rgba(255, 69, 0, 0.3); border-radius: 4px;">
                            <button id="clear-api-data-btn" style="width: 100%; padding: 8px; background: rgba(255, 69, 0, 0.2); border: 1px solid var(--carved-orange); border-radius: 3px; color: #fff; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s;">
                                Clear API Attack Data
                            </button>
                            <div style="font-size: 9px; margin-top: 6px; color: rgba(255, 255, 255, 0.6); line-height: 1.3;">
                                Removes all stored API attack data. Settings and config are preserved.
                            </div>
                        </div>

                        <div id="console-commands-toggle" style="font-size: 11px; margin-bottom: 8px; opacity: 0.8; color: #fff; margin-left: 2px; cursor: pointer; user-select: none;">
                            <span id="console-commands-arrow" style="transition: transform 0.2s; vertical-align: middle;">&#9654;</span> Console commands for advanced user support
                        </div>
                    <div id="console-commands-box" style="
                        display: none;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 5px;
                        padding: 8px;
                        font-family: monospace;
                        font-size: 10px;
                        line-height: 1.4;
                        color: #fff;
                        margin-bottom: 8px;
                    ">
                        <div style="margin-bottom: 6px;">
                            <div style="color: var(--carved-magenta); font-weight: bold;">Clear All Data:</div>
                            <div style="color: #fff; margin-bottom: 2px;"><code>HalloweenUI.clearData()</code></div>
                            <div style="color: #ccc; font-size: 9px;">Removes all encounters, defeats, and cached data. Use only if user needs complete reset.</div>
                        </div>
                        <div style="margin-bottom: 6px; border-top: 1px solid rgba(255, 105, 180, 0.3); padding-top: 6px;">
                            <div style="color: var(--carved-magenta); font-weight: bold;">Check API Queue:</div>
                            <div style="color: #fff; margin-bottom: 2px;"><code>checkAPIQueue()</code></div>
                            <div style="color: #ccc; font-size: 9px;">Shows pending verifications, counted defeats, and unverified attacks for API mode debugging.</div>
                        </div>
                        <div style="margin-bottom: 6px; border-top: 1px solid rgba(255, 105, 180, 0.3); padding-top: 6px;">
                            <div style="color: var(--carved-magenta); font-weight: bold;">Debug Controls:</div>
                            <div style="margin-bottom: 4px;">
                                <div style="color: #fff; margin-bottom: 2px;"><code>HalloweenDebug.getLevel()</code></div>
                                <div style="color: #ccc; font-size: 9px;">Check current debug level (0-3).</div>
                            </div>
                            <div style="margin-bottom: 4px;">
                                <div style="color: #fff; margin-bottom: 2px;"><code>HalloweenDebug.showHelp()</code></div>
                                <div style="color: #ccc; font-size: 9px;">Show all available debug commands and level descriptions.</div>
                            </div>
                            <div style="margin-bottom: 4px;">
                                <div style="color: #fff; margin-bottom: 2px;"><code>halloweenDebugGeneration()</code></div>
                                <div style="color: #ccc; font-size: 9px;">Test target generation system with timing and validation checks (Leader Mode only).</div>
                            </div>
                        </div>
                    </div>

                    <!-- Debug Level Buttons -->
                    <div style="margin-top: 10px;">
                        <div style="display: flex; gap: 5px; margin-bottom: 3px;">
                            <button id="debug-level-0" data-level="0" style="flex: 1; padding: 6px; background: #f8c8dc; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 0</button>
                            <button id="debug-level-1" data-level="1" style="flex: 1; padding: 6px; background: #f1a7c7; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 1</button>
                            <button id="debug-level-2" data-level="2" style="flex: 1; padding: 6px; background: #e685b2; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 2</button>
                            <button id="debug-level-3" data-level="3" style="flex: 1; padding: 6px; background: #db649d; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 3</button>
                        </div>
                        <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">PRODUCTION</div>
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">BASIC</div>
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">DETAILED</div>
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">FULL</div>
                        </div>
                        <div id="debug-feedback" style="padding-top: 2px; min-height: 10px; font-size: 10px; color: var(--carved-cyan); text-align: center; opacity: 0; transition: opacity 0.3s;"></div>
                    </div>
                    </div>
                </div>

            `;

            return `
                <div id="halloween-menu-content" style="
                    background: linear-gradient(180deg, var(--carved-midnight) 0%, var(--carved-void) 50%, var(--carved-purple) 100%);
                    padding: 20px;
                    color: var(--carved-text);
                    font-family: var(--halloween-font);
                    border-radius: 12px;
                    min-height: 600px;
                ">
                    <!-- Header -->
                    <div style="margin-bottom: 20px; border-bottom: 1px solid var(--carved-cyan); padding-bottom: 15px; position: relative; height: 100px;">
                        <button id="halloween-close" style="position: absolute; top: 5px; right: 5px; background: rgba(0, 255, 255, 0.1); border: 2px solid var(--carved-cyan); color: var(--carved-cyan); font-size: 18px; font-weight: bold; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s ease; z-index: 1000;">&times;</button>
                        ${config.menuPanelImage === 'banner' && config.factionBanner ? `
                            <img src="${config.factionBanner}" alt="Faction Banner" style="
                                max-width: 90%; max-height: 80px; object-fit: contain;
                                position: absolute; left: 50%; transform: translateX(-50%); top: 10px;
                            ">
                        ` : `
                            <img src="${config.factionIcon}" alt="Faction Icon" style="
                                width: 60px; height: 60px;
                                filter:
                                    drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))
                                    drop-shadow(0 0 40px rgba(255, 107, 53, 0.6))
                                    drop-shadow(0 0 60px rgba(255, 107, 53, 0.4));
                                animation: pulse 6s ease-in-out infinite;
                                position: absolute; left: 50%; transform: translateX(-50%); top: 10px;
                            ">
                        `}
                        <div style="font-size: 18px; font-weight: bold; color: var(--carved-cyan); text-align: center; position: absolute; left: 50%; transform: translateX(-50%); top: 80px; width: 100%;">GRIMOIRE - CARVED EDITION</div>
                    </div>

                    <!-- Content based on menu panel view preference -->
                    ${(typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY && showLeaderPanel) ? leaderContent : memberContent}

                    <!-- Debug Level Display (Leader Only) -->
                    ${(typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY && showLeaderPanel) ? `<div style="text-align: center; font-size: 10px; opacity: 0.7; margin-top: 15px; color: var(--carved-magenta); display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 12px; margin-right: 4px;">&#x1F527;</span> Debug Level: <span id="debug-level-footer">0</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span id="debug-level-name">Production</span>
                    </div>` : ''}

                    <!-- Footer -->
                    <div style="text-align: center; font-size: 11px; opacity: 0.6; margin-top: 10px; padding-top: 15px; border-top: 1px solid rgba(0,255,255,0.3);">
                        Carved Edition &copy; 2025 Mistborn Publishings
                    </div>
                </div>
            `;
        },

        attachToggleListeners: function() {
            HalloweenDebug.log(2, '🎃 Attaching toggle event listeners...');

            // Leader Mode Toggle (only if MASTER_LEADER_KEY exists)
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const leaderToggleDiv = document.getElementById('leader-toggle-div');
                if (leaderToggleDiv) {
                    leaderToggleDiv.removeEventListener('click', this.boundToggleLeaderMode);
                    leaderToggleDiv.addEventListener('click', this.boundToggleLeaderMode);
                    HalloweenDebug.log(2, '🎃 Leader toggle listener attached to div');

                    // Debug: Check the actual toggle positioning (with delay for DOM rendering)
                    setTimeout(() => {
                        const toggleCircle = leaderToggleDiv.querySelector('div');
                        if (toggleCircle) {
                            const computedStyle = window.getComputedStyle(toggleCircle);
                            HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: Circle left position:', computedStyle.left);
                        HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: Circle computed styles:', {
                            left: computedStyle.left,
                            width: computedStyle.width,
                            position: computedStyle.position
                        });

                            // Also check the actual inline style attribute
                            HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: Inline style attribute:', toggleCircle.getAttribute('style'));
                        } else {
                            HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: No toggle circle found inside toggle div');
                        }
                    }, 100);
                } else {
                    HalloweenDebug.log(2, '🎃 ERROR: leader-toggle-div not found!');
                }
            } else {
                HalloweenDebug.log(2, '🎃 Skipping leader toggle listener (member mode)');
            }

            // Debug: Check Carved King centering (with delay)
            setTimeout(() => {
                const carvedKingImg = document.querySelector('img[alt="Carved King"]');
                if (carvedKingImg) {
                    const parentDiv = carvedKingImg.parentElement;
                    const computedParentStyle = window.getComputedStyle(parentDiv);
                    HalloweenDebug.log(3, '🎃 CARVED KING DEBUG: Parent div styles:', {
                        display: computedParentStyle.display,
                        justifyContent: computedParentStyle.justifyContent,
                        textAlign: computedParentStyle.textAlign
                    });
                    HalloweenDebug.log(3, '🎃 CARVED KING DEBUG: Parent inline style:', parentDiv.getAttribute('style'));
                } else {
                    HalloweenDebug.log(3, '🎃 CARVED KING DEBUG: No Carved King image found');
                }
            }, 150);

            // Close button
            const closeButton = document.getElementById('halloween-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    // Always close side menu (top menu position removed)
                    if (HalloweenUI.menuOpen) {
                        const trigger = document.getElementById('halloween-pumpkin-trigger');
                        const menu = document.getElementById('halloween-sliding-menu');
                        if (menu && trigger) {
                            menu.style.right = '-330px';
                            // Responsive sizing: 90px for desktop (768+), 75px for mobile
                            const isDesktop = window.innerWidth >= 768;
                            const closedOffset = isDesktop ? -45 : -37.5;
                            trigger.style.right = `${closedOffset}px`;
                            trigger.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
                            // Reset glow filter to default state
                            const img = trigger.querySelector('img');
                            if (img) img.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 53, 1)) drop-shadow(0 0 22px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 33px rgba(255, 69, 0, 0.7))';
                        }
                        HalloweenUI.menuOpen = false;
                        HalloweenDebug.log(2, '🎃 Menu properly closed via close button');
                    }
                });
                closeButton.addEventListener('mouseover', () => {
                    closeButton.style.backgroundColor = 'rgba(0,255,255,0.2)';
                });
                closeButton.addEventListener('mouseout', () => {
                    closeButton.style.backgroundColor = 'rgba(0,255,255,0.1)';
                });
                HalloweenDebug.log(2, '🎃 Close button listener attached');
            }

            // Background Toggle
            const bgToggleDiv = document.getElementById('bg-toggle-div');
            if (bgToggleDiv) {
                bgToggleDiv.removeEventListener('click', this.boundToggleBackground);
                bgToggleDiv.addEventListener('click', this.boundToggleBackground);
                HalloweenDebug.log(2, '🎃 Background toggle listener attached');
            }

            // Sound Toggle
            const soundToggleDiv = document.getElementById('sound-toggle-div');
            if (soundToggleDiv) {
                soundToggleDiv.removeEventListener('click', this.boundToggleSound);
                soundToggleDiv.addEventListener('click', this.boundToggleSound);
                HalloweenDebug.log(2, '🎃 Sound toggle listener attached');
            }

            // Collectible Helper Toggle
            const collectibleHelperToggleDiv = document.getElementById('collectible-helper-toggle-div');
            if (collectibleHelperToggleDiv) {
                collectibleHelperToggleDiv.removeEventListener('click', this.boundToggleCollectibleHelper);
                collectibleHelperToggleDiv.addEventListener('click', this.boundToggleCollectibleHelper);
                HalloweenDebug.log(2, '🎃 Collectible Helper toggle listener attached');
            }

            // Menu Position Toggle
            const positionToggleDiv = document.getElementById('position-toggle-div');
            if (positionToggleDiv) {
                positionToggleDiv.removeEventListener('click', this.boundToggleMenuPosition);
                positionToggleDiv.addEventListener('click', this.boundToggleMenuPosition);
                HalloweenDebug.log(2, '🎃 Position toggle listener attached');
            }

            // Button listeners for clean menu
            const importBtn = document.getElementById('import-config');
            if (importBtn) {
                importBtn.removeEventListener('click', this.boundImportConfig);
                importBtn.addEventListener('click', this.boundImportConfig);
            }

            // Export buttons (Soul Conduit - Leader only)
            const exportLeaderBtn = document.getElementById('export-leader');
            if (exportLeaderBtn) {
                exportLeaderBtn.removeEventListener('click', this.boundExportForLeaders);
                exportLeaderBtn.addEventListener('click', this.boundExportForLeaders);
                HalloweenDebug.log(2, '🎃 EXPORT LEADER button listener attached');
            }

            const exportMemberBtn = document.getElementById('export-member');
            if (exportMemberBtn) {
                exportMemberBtn.removeEventListener('click', this.boundExportForMembers);
                exportMemberBtn.addEventListener('click', this.boundExportForMembers);
                HalloweenDebug.log(2, '🎃 EXPORT MEMBER button listener attached');
            }

            // Reload Config button (Soul Conduit - Leader only)
            const reloadConfigBtn = document.getElementById('reload-preload-config');
            if (reloadConfigBtn) {
                reloadConfigBtn.addEventListener('click', () => {
                    // Clear the manual import flag
                    GM_deleteValue('halloween_manual_import_done');
                    HalloweenDebug.log(1, '🔄 Manual import flag cleared - ready to re-import on page refresh');

                    // Show message
                    const message = document.getElementById('reload-config-message');
                    if (message) {
                        message.style.display = 'block';
                    }

                    // Hide button after click
                    reloadConfigBtn.style.display = 'none';
                });
                HalloweenDebug.log(2, '🎃 RELOAD CONFIG button listener attached');
            }

            // Export buttons
            const copyExportBtn = document.getElementById('copy-export-btn');
            if (copyExportBtn) {
                copyExportBtn.addEventListener('click', () => {
                    const textarea = document.getElementById('export-fallback-output');
                    if (textarea) {
                        textarea.select();
                        document.execCommand('copy');

                        // Show feedback
                        const originalText = copyExportBtn.textContent;
                        copyExportBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyExportBtn.textContent = originalText;
                        }, 2000);

                        HalloweenDebug.log(2, '🎃 Export JSON copied to clipboard');
                    }
                });
            }

            const dismissExportBtn = document.getElementById('dismiss-export-btn');
            if (dismissExportBtn) {
                dismissExportBtn.addEventListener('click', () => {
                    this.hideExportFallback();
                    HalloweenDebug.log(2, '🎃 Export display dismissed');
                });
            }

            // MANIFEST and CHANNEL buttons (Leader Mode)
            const generateLeaderSeedBtn = document.getElementById('generate-leader-seed');
            if (generateLeaderSeedBtn) {
                generateLeaderSeedBtn.removeEventListener('click', this.boundGenerateLeaderSeed);
                generateLeaderSeedBtn.addEventListener('click', this.boundGenerateLeaderSeed);
                HalloweenDebug.log(2, '🎃 MANIFEST button listener attached');
            }

            const setLeaderSeedBtn = document.getElementById('set-leader-seed');
            if (setLeaderSeedBtn) {
                setLeaderSeedBtn.removeEventListener('click', this.boundSetLeaderSeed);
                setLeaderSeedBtn.addEventListener('click', this.boundSetLeaderSeed);
                HalloweenDebug.log(2, '🎃 CHANNEL button listener attached');
            }

            // Close Button
            const closeBtn = document.getElementById('halloween-close-btn');
            if (closeBtn) {
                closeBtn.removeEventListener('click', this.boundToggleMenu);
                closeBtn.addEventListener('click', this.boundToggleMenu);
                HalloweenDebug.log(2, '🎃 Close button listener attached');
            }

            // Debug Level Buttons
            for (let i = 0; i <= 3; i++) {
                const debugBtn = document.getElementById(`debug-level-${i}`);
                if (debugBtn) {
                    debugBtn.removeEventListener('click', this.boundDebugLevels[i]);
                    debugBtn.addEventListener('click', this.boundDebugLevels[i]);
                }
            }
            HalloweenDebug.log(2, '🎃 Debug level button listeners attached');

            // Console Commands Toggle
            const consoleCommandsToggle = document.getElementById('console-commands-toggle');
            const consoleCommandsBox = document.getElementById('console-commands-box');
            const consoleCommandsArrow = document.getElementById('console-commands-arrow');
            if (consoleCommandsToggle && consoleCommandsBox && consoleCommandsArrow) {
                consoleCommandsToggle.addEventListener('click', () => {
                    const isVisible = consoleCommandsBox.style.display !== 'none';
                    consoleCommandsBox.style.display = isVisible ? 'none' : 'block';
                    consoleCommandsArrow.innerHTML = isVisible ? '&#9654;' : '&#9660;';
                });
                HalloweenDebug.log(2, '🎃 Console commands toggle listener attached');
            }

            // Battle Analytics Icon Click Handler
            const battleAnalyticsIcon = document.getElementById('battle-analytics-icon');
            if (battleAnalyticsIcon) {
                battleAnalyticsIcon.addEventListener('click', () => {
                    HalloweenDebug.log(2, '📊 Battle Analytics icon clicked');
                    this.openBattleAnalyticsModal();
                });
                HalloweenDebug.log(2, '🎃 Battle Analytics icon listener attached');
            }

            // API Testing Mode Toggle (Leader Only - in Underworld Rituals)
            const apiTestingToggle = document.getElementById('api-testing-mode-toggle');
            const apiTestingStatus = document.getElementById('api-testing-mode-status');
            if (apiTestingToggle && apiTestingStatus) {
                // Load saved state
                const savedState = GM_getValue('halloween_api_testing_mode', false);
                apiTestingToggle.checked = savedState;
                apiTestingStatus.textContent = savedState ? 'ON' : 'OFF';
                apiTestingStatus.style.color = savedState ? '#00ff00' : 'var(--carved-orange)';

                apiTestingToggle.addEventListener('change', () => {
                    const isEnabled = apiTestingToggle.checked;
                    GM_setValue('halloween_api_testing_mode', isEnabled);
                    apiTestingStatus.textContent = isEnabled ? 'ON' : 'OFF';
                    apiTestingStatus.style.color = isEnabled ? '#00ff00' : 'var(--carved-orange)';

                    // Enable/disable Override Start Date toggle based on testing mode
                    const overrideToggle = document.getElementById('api-override-date-toggle');
                    if (overrideToggle) {
                        overrideToggle.disabled = !isEnabled;
                        if (!isEnabled) {
                            // If testing mode disabled, also disable override
                            overrideToggle.checked = false;
                            GM_setValue('halloween_api_override_enabled', false);
                            const overrideStatus = document.getElementById('api-override-date-status');
                            const overridePicker = document.getElementById('api-override-date-picker');
                            if (overrideStatus) {
                                overrideStatus.textContent = 'OFF';
                                overrideStatus.style.color = 'var(--carved-orange)';
                            }
                            if (overridePicker) {
                                overridePicker.style.display = 'none';
                            }
                        }
                    }

                    // Enable/disable Override Period toggle based on testing mode
                    const periodToggle = document.getElementById('api-override-period-toggle');
                    if (periodToggle) {
                        periodToggle.disabled = !isEnabled;
                        if (!isEnabled) {
                            // If testing mode disabled, also disable period override
                            periodToggle.checked = false;
                            GM_setValue('halloween_api_period_enabled', false);
                            const periodStatus = document.getElementById('api-override-period-status');
                            const periodPicker = document.getElementById('api-override-period-picker');
                            if (periodStatus) {
                                periodStatus.textContent = 'OFF';
                                periodStatus.style.color = 'var(--carved-orange)';
                            }
                            if (periodPicker) {
                                periodPicker.style.display = 'none';
                            }
                        }
                    }

                    HalloweenDebug.log(1, `🧪 API Testing Mode ${isEnabled ? 'enabled' : 'disabled'}`);

                    // Trigger immediate refresh if enabled
                    if (isEnabled && typeof APIDefeatVerification !== 'undefined') {
                        HalloweenDebug.log(1, '🧪 Triggering immediate attack log refresh in testing mode');
                        APIDefeatVerification.refreshAttackLog();
                    }
                });
                HalloweenDebug.log(2, '🎃 API Testing Mode toggle listener attached');
            }

            // Override Start Date Toggle (Leader Only - in Underworld Rituals)
            const overrideToggle = document.getElementById('api-override-date-toggle');
            const overrideStatus = document.getElementById('api-override-date-status');
            const overridePicker = document.getElementById('api-override-date-picker');
            const overrideDateInput = document.getElementById('api-override-date');
            const overrideTimeInput = document.getElementById('api-override-time');

            if (overrideToggle && overrideStatus && overridePicker) {
                // Load saved state
                const savedOverrideEnabled = GM_getValue('halloween_api_override_enabled', false);
                const savedOverrideTimestamp = GM_getValue('halloween_api_override_timestamp', 0);
                const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);

                // Enable override toggle only if testing mode is on
                overrideToggle.disabled = !apiTestingMode;
                overrideToggle.checked = savedOverrideEnabled;
                overrideStatus.textContent = savedOverrideEnabled ? 'ON' : 'OFF';
                overrideStatus.style.color = savedOverrideEnabled ? '#00ff00' : 'var(--carved-orange)';
                overridePicker.style.display = savedOverrideEnabled ? 'block' : 'none';

                // Load saved date/time if exists
                if (savedOverrideTimestamp > 0) {
                    const date = new Date(savedOverrideTimestamp * 1000);
                    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    const timeStr = date.toTimeString().substring(0, 5); // HH:MM
                    if (overrideDateInput) overrideDateInput.value = dateStr;
                    if (overrideTimeInput) overrideTimeInput.value = timeStr;
                }

                // Toggle change event
                overrideToggle.addEventListener('change', () => {
                    const isEnabled = overrideToggle.checked;
                    GM_setValue('halloween_api_override_enabled', isEnabled);
                    overrideStatus.textContent = isEnabled ? 'ON' : 'OFF';
                    overrideStatus.style.color = isEnabled ? '#00ff00' : 'var(--carved-orange)';
                    overridePicker.style.display = isEnabled ? 'block' : 'none';

                    HalloweenDebug.log(1, `🧪 Override Start Date ${isEnabled ? 'enabled' : 'disabled'}`);
                });

                // Date/time change events - save timestamp
                const saveOverrideTimestamp = () => {
                    if (!overrideDateInput.value || !overrideTimeInput.value) return;

                    const dateTimeStr = `${overrideDateInput.value}T${overrideTimeInput.value}:00Z`;
                    const timestamp = Math.floor(new Date(dateTimeStr).getTime() / 1000);
                    GM_setValue('halloween_api_override_timestamp', timestamp);
                    HalloweenDebug.log(1, `🧪 Override timestamp set to: ${HalloweenDebug.formatTimestamp(timestamp)}`);
                };

                if (overrideDateInput) overrideDateInput.addEventListener('change', saveOverrideTimestamp);
                if (overrideTimeInput) overrideTimeInput.addEventListener('change', saveOverrideTimestamp);

                HalloweenDebug.log(2, '🎃 Override Start Date listeners attached');
            }

            // Override Period Toggle (Leader Only - in Underworld Rituals)
            const periodToggle = document.getElementById('api-override-period-toggle');
            const periodStatus = document.getElementById('api-override-period-status');
            const periodPicker = document.getElementById('api-override-period-picker');
            const periodStartDateInput = document.getElementById('api-period-start-date');
            const periodStartTimeInput = document.getElementById('api-period-start-time');
            const periodDurationSelect = document.getElementById('api-period-duration');

            if (periodToggle && periodStatus && periodPicker) {
                // Load saved state
                const savedPeriodEnabled = GM_getValue('halloween_api_period_enabled', false);
                const savedPeriodStartTimestamp = GM_getValue('halloween_api_period_start', 0);
                const savedPeriodDuration = GM_getValue('halloween_api_period_duration', 7);
                const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);

                // Enable period toggle only if testing mode is on
                periodToggle.disabled = !apiTestingMode;
                periodToggle.checked = savedPeriodEnabled;
                periodStatus.textContent = savedPeriodEnabled ? 'ON' : 'OFF';
                periodStatus.style.color = savedPeriodEnabled ? '#00ff00' : 'var(--carved-orange)';
                periodPicker.style.display = savedPeriodEnabled ? 'block' : 'none';

                // Load saved date/time/duration if exists
                if (savedPeriodStartTimestamp > 0) {
                    const date = new Date(savedPeriodStartTimestamp * 1000);
                    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    const timeStr = date.toTimeString().substring(0, 5); // HH:MM
                    if (periodStartDateInput) periodStartDateInput.value = dateStr;
                    if (periodStartTimeInput) periodStartTimeInput.value = timeStr;
                }
                if (periodDurationSelect) periodDurationSelect.value = savedPeriodDuration;

                // Toggle change event - make mutually exclusive with Override Start Date
                periodToggle.addEventListener('change', () => {
                    const isEnabled = periodToggle.checked;

                    // If enabling Override Period, disable Override Start Date
                    if (isEnabled && overrideToggle) {
                        overrideToggle.checked = false;
                        GM_setValue('halloween_api_override_enabled', false);
                        if (overrideStatus) {
                            overrideStatus.textContent = 'OFF';
                            overrideStatus.style.color = 'var(--carved-orange)';
                        }
                        if (overridePicker) overridePicker.style.display = 'none';
                    }

                    GM_setValue('halloween_api_period_enabled', isEnabled);
                    periodStatus.textContent = isEnabled ? 'ON' : 'OFF';
                    periodStatus.style.color = isEnabled ? '#00ff00' : 'var(--carved-orange)';
                    periodPicker.style.display = isEnabled ? 'block' : 'none';

                    HalloweenDebug.log(1, `🧪 Override Period ${isEnabled ? 'enabled' : 'disabled'}`);
                });

                // Date/time change events - save timestamp
                const savePeriodSettings = () => {
                    if (!periodStartDateInput.value || !periodStartTimeInput.value) return;

                    const dateTimeStr = `${periodStartDateInput.value}T${periodStartTimeInput.value}:00Z`;
                    const timestamp = Math.floor(new Date(dateTimeStr).getTime() / 1000);
                    GM_setValue('halloween_api_period_start', timestamp);

                    const duration = parseInt(periodDurationSelect.value);
                    GM_setValue('halloween_api_period_duration', duration);

                    HalloweenDebug.log(1, `🧪 Override period set: ${HalloweenDebug.formatTimestamp(timestamp)} for ${duration} days`);
                };

                if (periodStartDateInput) periodStartDateInput.addEventListener('change', savePeriodSettings);
                if (periodStartTimeInput) periodStartTimeInput.addEventListener('change', savePeriodSettings);
                if (periodDurationSelect) periodDurationSelect.addEventListener('change', savePeriodSettings);

                // Make Override Start Date and Override Period mutually exclusive
                if (overrideToggle) {
                    overrideToggle.addEventListener('change', () => {
                        if (overrideToggle.checked && periodToggle) {
                            periodToggle.checked = false;
                            GM_setValue('halloween_api_period_enabled', false);
                            if (periodStatus) {
                                periodStatus.textContent = 'OFF';
                                periodStatus.style.color = 'var(--carved-orange)';
                            }
                            if (periodPicker) periodPicker.style.display = 'none';
                        }
                    });
                }

                HalloweenDebug.log(2, '🎃 Override Period listeners attached');
            }

            // Clear API Data Button
            const clearAPIDataBtn = document.getElementById('clear-api-data-btn');
            if (clearAPIDataBtn) {
                clearAPIDataBtn.addEventListener('click', () => {
                    this.clearAPIData();
                });
                // Add hover effect
                clearAPIDataBtn.addEventListener('mouseenter', () => {
                    clearAPIDataBtn.style.background = 'rgba(255, 69, 0, 0.4)';
                });
                clearAPIDataBtn.addEventListener('mouseleave', () => {
                    clearAPIDataBtn.style.background = 'rgba(255, 69, 0, 0.2)';
                });
                HalloweenDebug.log(2, '🎃 Clear API Data button listener attached');
            }

            // Halloween Announcements functionality
            this.initHalloweenAnnouncements();

            // Manifestations (Competition Management) functionality
            this.initManifestations();

            // Team Badge Toggle
            const teamBadgeHeader = document.getElementById('team-badge-header');
            if (teamBadgeHeader) {
                teamBadgeHeader.addEventListener('click', () => {
                    const membersList = document.getElementById('team-badge-members');
                    const arrow = document.getElementById('team-badge-arrow');

                    if (membersList && arrow) {
                        if (membersList.style.display === 'none' || !membersList.style.display) {
                            // Expand
                            membersList.style.display = 'grid';
                            arrow.innerHTML = '&#9650;'; // Up arrow
                            HalloweenDebug.log(2, '🎖️ Team badge expanded');
                        } else {
                            // Collapse
                            membersList.style.display = 'none';
                            arrow.innerHTML = '&#9660;'; // Down arrow
                            HalloweenDebug.log(2, '🎖️ Team badge collapsed');
                        }
                    }
                });

                // Add hover effect
                teamBadgeHeader.addEventListener('mouseover', () => {
                    teamBadgeHeader.style.filter = 'brightness(1.1)';
                    teamBadgeHeader.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
                });
                teamBadgeHeader.addEventListener('mouseout', () => {
                    teamBadgeHeader.style.filter = '';
                    teamBadgeHeader.style.boxShadow = '';
                });

                HalloweenDebug.log(2, '🎖️ Team badge listeners attached');
            }

            // Team Member Links Hover
            const memberLinks = document.querySelectorAll('.team-member-link');
            memberLinks.forEach(link => {
                link.addEventListener('mouseover', () => {
                    link.style.textDecoration = 'underline';
                    link.style.color = '#40e0d0'; // Teal hover
                });
                link.addEventListener('mouseout', () => {
                    link.style.textDecoration = 'none';
                    link.style.color = 'var(--carved-cyan)';
                });
            });
        },

        initHalloweenAnnouncements: function() {
            // Initialize default announcements if none exist
            if (!this.halloweenAnnouncements) {
                this.halloweenAnnouncements = [];
                this.loadHalloweenAnnouncements();
            }

            // Initialize date-specific announcements if none exist
            if (!this.dateAnnouncements) {
                this.dateAnnouncements = [];
                this.loadDateAnnouncements();
            }

            // Setup announcements section
            this.setupAnnouncementsToggle();
            this.setupManifestationsToggle();
            this.setupEtherealCommandToggle();
            this.setupSpectralForgeToggle();
            this.setupDailyBountiesToggle();
            this.setupDailyBountiesHandlers();
            this.setupSoulConduitToggle();
            this.setupUnderworldRitualsToggle();
            this.setupTargetPairsToggle();
            this.setupSpookyScheduleToggle();
            this.setupPhantomSettingsToggle();
            this.setupArcaneRitualsToggle();
            this.setupEffectTypeToggle();
            this.setupDefeatVerificationToggle();
            this.setupTileImageHandler();
            this.setupFactionIconHandler();
            this.setupPrimaryColorHandler();
            this.setupSecondaryColorHandler();
            this.setupMenuPanelImageHandler();
            this.setupFactionBannerHandler();
            this.setupFirebaseURLHandler();
            this.setupPlayerIdentityHandlers();
            this.setupSpookyDatesHandlers();
            this.setupResetHandlers();
            this.checkSpookyTargetsEndDate();
            this.populateAnnouncementFields();
            this.populateDateAnnouncementFields();
            this.populateTickerSettings();
            this.attachAnnouncementListeners();
        },

        loadHalloweenAnnouncements: function() {
            const stored = GM_getValue('halloween_announcements', '');
            if (stored && stored !== 'undefined') {
                try {
                    this.halloweenAnnouncements = JSON.parse(stored);
                } catch (e) {
                    this.halloweenAnnouncements = [];
                }
            } else {
                // Default announcements
                this.halloweenAnnouncements = [
                    { message: '🎃 The Halloween Hunt begins...', enabled: true },
                    { message: '👻 Spectral targets detected', enabled: true },
                    { message: '🦇 Night stalkers on the prowl', enabled: false }
                ];
                this.saveHalloweenAnnouncements();
            }

            // Load ticker timing settings
            this.tickerDuration = GM_getValue('halloween_ticker_duration', 4) * 1000; // Convert to ms
            this.tickerFrequency = GM_getValue('halloween_ticker_frequency', 15) * 1000; // Convert to ms
            this.tickerColor = GM_getValue('halloween_ticker_color', '#ff6b35');
        },

        saveHalloweenAnnouncements: function() {
            GM_setValue('halloween_announcements', JSON.stringify(this.halloweenAnnouncements));
        },

        loadDateAnnouncements: function() {
            const stored = GM_getValue('halloween_date_announcements', '');
            if (stored && stored !== 'undefined') {
                try {
                    this.dateAnnouncements = JSON.parse(stored);
                } catch (e) {
                    this.dateAnnouncements = [];
                }
            } else {
                // No default date-specific announcements
                this.dateAnnouncements = [];
            }
        },

        saveDateAnnouncements: function() {
            GM_setValue('halloween_date_announcements', JSON.stringify(this.dateAnnouncements));
        },

        saveTickerSettings: function() {
            const durationInput = document.getElementById('ticker-duration');
            const frequencyInput = document.getElementById('ticker-frequency');
            const colorInput = document.getElementById('ticker-color');

            if (durationInput && frequencyInput && colorInput) {
                const duration = parseInt(durationInput.value) || 4;
                const frequency = parseInt(frequencyInput.value) || 15;
                const color = colorInput.value || '#ff6b35';

                this.tickerDuration = duration * 1000; // Convert to ms
                this.tickerFrequency = frequency * 1000; // Convert to ms
                this.tickerColor = color;

                GM_setValue('halloween_ticker_duration', duration);
                GM_setValue('halloween_ticker_frequency', frequency);
                GM_setValue('halloween_ticker_color', color);

                HalloweenDebug.log(1, `🎃 Ticker settings saved: ${duration}s display, ${frequency}s cycle, ${color} color`);
            }
        },

        populateTickerSettings: function() {
            const durationInput = document.getElementById('ticker-duration');
            const frequencyInput = document.getElementById('ticker-frequency');
            const colorInput = document.getElementById('ticker-color');

            if (durationInput && frequencyInput && colorInput) {
                durationInput.value = (this.tickerDuration / 1000).toString();
                frequencyInput.value = (this.tickerFrequency / 1000).toString();
                colorInput.value = this.tickerColor;
            }
        },

        setupAnnouncementsToggle: function() {
            const header = document.getElementById('halloween-announcements-header');
            const content = document.getElementById('halloween-announcements-content');
            const toggle = document.getElementById('halloween-announcements-toggle');
            const helpBox = document.getElementById('void-transmissions-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        // Cleanup empty messages before collapsing
                        this.cleanupEmptyAnnouncements();

                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '2000px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupManifestationsToggle: function() {
            const header = document.getElementById('manifestations-header');
            const content = document.getElementById('manifestations-content');
            const toggle = document.getElementById('manifestations-toggle');
            const countdown = document.getElementById('competition-countdown');
            const helpBox = document.getElementById('manifestations-help');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                if (helpBox) helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        if (countdown) countdown.style.marginBottom = '10px';
                        if (helpBox) {
                            helpBox.style.display = 'block';
                            helpBox.style.marginBottom = '0px';
                        }
                    } else {
                        content.style.maxHeight = '1200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        if (countdown) countdown.style.marginBottom = '10px';
                        if (helpBox) {
                            helpBox.style.display = 'none';
                            helpBox.style.marginBottom = '0px';
                        }
                    }
                });
            }
        },

        setupUnderworldRitualsToggle: function() {
            const header = document.getElementById('underworld-rituals-header');
            const content = document.getElementById('underworld-rituals-content');
            const toggle = document.getElementById('underworld-rituals-toggle');
            const helpBox = document.getElementById('underworld-rituals-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '700px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupTargetPairsToggle: function() {
            const header = document.getElementById('target-pairs-header');
            const content = document.getElementById('target-pairs-content');
            const toggle = document.getElementById('target-pairs-toggle');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                    }
                });
            }
        },

        setupSpectralForgeToggle: function() {
            const header = document.getElementById('spectral-forge-header');
            const content = document.getElementById('spectral-forge-content');
            const toggle = document.getElementById('spectral-forge-toggle');
            const helpBox = document.getElementById('spectral-forge-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '1200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }

            // Colour Settings Toggle
            const colourSettingsLink = document.getElementById('show-colour-settings-link');
            const colourSettingsSection = document.getElementById('colour-settings-section');
            if (colourSettingsLink && colourSettingsSection) {
                colourSettingsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = colourSettingsSection.style.display === 'none';
                    if (isHidden) {
                        colourSettingsSection.style.display = 'block';
                        colourSettingsLink.textContent = 'Hide Colour Settings';
                    } else {
                        colourSettingsSection.style.display = 'none';
                        colourSettingsLink.textContent = 'Show Colour Settings';
                    }
                });
            }

            // Image Settings Toggle
            const imageSettingsLink = document.getElementById('show-image-settings-link');
            const imageSettingsSection = document.getElementById('image-settings-section');
            if (imageSettingsLink && imageSettingsSection) {
                imageSettingsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = imageSettingsSection.style.display === 'none';
                    if (isHidden) {
                        imageSettingsSection.style.display = 'block';
                        imageSettingsLink.textContent = 'Hide Image Settings';
                    } else {
                        imageSettingsSection.style.display = 'none';
                        imageSettingsLink.textContent = 'Show Image Settings';
                    }
                });
            }

            // Target Effect Types Toggle
            const targetEffectsLink = document.getElementById('show-target-effects-link');
            const targetEffectsSection = document.getElementById('target-effects-section');
            const bountyEffectsSection = document.getElementById('bounty-effects-section');
            if (targetEffectsLink && targetEffectsSection && bountyEffectsSection) {
                targetEffectsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = targetEffectsSection.style.display === 'none';
                    if (isHidden) {
                        targetEffectsSection.style.display = 'block';
                        bountyEffectsSection.style.display = 'block';
                        targetEffectsLink.textContent = 'Hide Target Effect Types';
                    } else {
                        targetEffectsSection.style.display = 'none';
                        bountyEffectsSection.style.display = 'none';
                        targetEffectsLink.textContent = 'Show Target Effect Types';
                    }
                });
            }

            // Firebase Attack Config Toggle
            const firebaseConfigLink = document.getElementById('show-firebase-config-link');
            const firebaseConfigSection = document.getElementById('firebase-config-section');
            if (firebaseConfigLink && firebaseConfigSection) {
                firebaseConfigLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = firebaseConfigSection.style.display === 'none';
                    if (isHidden) {
                        firebaseConfigSection.style.display = 'block';
                        firebaseConfigLink.textContent = 'Hide Firebase Attack Config';
                    } else {
                        firebaseConfigSection.style.display = 'none';
                        firebaseConfigLink.textContent = 'Show Firebase Attack Config';
                    }
                });
            }
        },

        setupDailyBountiesToggle: function() {
            const header = document.getElementById('daily-bounties-header');
            const content = document.getElementById('daily-bounties-content');
            const toggle = document.getElementById('daily-bounties-toggle');
            const helpBox = document.getElementById('daily-bounties-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        this.saveDailyBounties();
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '1200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupDailyBountiesHandlers: function() {
            const activeToggle = document.getElementById('bounties-active-toggle');
            const activeStatus = document.getElementById('bounties-active-status');

            if (activeToggle && activeStatus) {
                const config = BountyManager.getConfig();
                activeToggle.checked = config.active;
                activeStatus.textContent = config.active ? 'ON' : 'OFF';
                activeStatus.style.color = config.active ? 'var(--carved-cyan)' : '#ff4444';

                activeToggle.addEventListener('change', () => {
                    const newConfig = BountyManager.getConfig();
                    newConfig.active = activeToggle.checked;
                    BountyManager.setConfig(newConfig);
                    activeStatus.textContent = activeToggle.checked ? 'ON' : 'OFF';
                    activeStatus.style.color = activeToggle.checked ? 'var(--carved-cyan)' : '#ff4444';

                    // Update status display
                    BountyManager.updateBountyStatus();

                    // Update member panel display
                    if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                        HalloweenUI.updateBountiesClaimed();
                    }
                });
            }

            const testingToggle = document.getElementById('bounties-testing-toggle');
            const testingStatus = document.getElementById('bounties-testing-status');

            if (testingToggle && testingStatus) {
                const config = BountyManager.getConfig();
                testingToggle.checked = config.testing;
                testingStatus.textContent = config.testing ? 'ON' : 'OFF';
                testingStatus.style.color = config.testing ? 'var(--carved-cyan)' : '#ff4444';

                testingToggle.addEventListener('change', () => {
                    const newConfig = BountyManager.getConfig();
                    newConfig.testing = testingToggle.checked;
                    BountyManager.setConfig(newConfig);
                    testingStatus.textContent = testingToggle.checked ? 'ON' : 'OFF';
                    testingStatus.style.color = testingToggle.checked ? 'var(--carved-cyan)' : '#ff4444';

                    // Update status display
                    BountyManager.updateBountyStatus();
                });
            }

            const addBtn = document.getElementById('add-bounty-btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    // Save current values before adding new row
                    this.saveDailyBounties();

                    const config = BountyManager.getConfig();
                    if (config.bounties.length < 7) {
                        config.bounties.push({url: '', date: ''});
                        BountyManager.setConfig(config);
                        this.renderBountiesList();
                        BountyManager.updateBountyStatus();
                    }
                });
            }

            this.renderBountiesList();

            // Update status display on initial setup
            BountyManager.updateBountyStatus();
        },

        renderBountiesList: function() {
            const container = document.getElementById('bounties-list');
            if (!container) return;

            const config = BountyManager.getConfig();
            container.innerHTML = '';

            config.bounties.forEach((bounty, index) => {
                const row = document.createElement('div');
                row.style.cssText = 'margin-bottom: 8px; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 6px; border: 1px solid rgba(255, 105, 180, 0.2);';

                row.innerHTML = `
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <input type="text" data-bounty-index="${index}" data-bounty-field="url" value="${bounty.url || ''}" placeholder="Profile URL (e.g., torn.com/profiles.php?XID=123456)" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; text-align: right;">
                        <input type="date" data-bounty-index="${index}" data-bounty-field="date" value="${bounty.date || ''}" style="width: 135px; padding: 6px; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px;">
                    </div>
                `;

                container.appendChild(row);
            });

            // Attach blur handlers for auto-save
            container.querySelectorAll('input[data-bounty-field]').forEach(input => {
                input.addEventListener('blur', () => {
                    this.saveDailyBounties();
                });
            });
        },

        saveDailyBounties: function() {
            const container = document.getElementById('bounties-list');
            if (!container) return;

            const config = BountyManager.getConfig();
            const inputs = container.querySelectorAll('input[data-bounty-field]');

            inputs.forEach(input => {
                const index = parseInt(input.getAttribute('data-bounty-index'));
                const field = input.getAttribute('data-bounty-field');
                if (config.bounties[index]) {
                    config.bounties[index][field] = input.value.trim();
                }
            });

            config.bounties = config.bounties.filter(b => b.url && b.url.trim() !== '');
            BountyManager.setConfig(config);
            HalloweenDebug.log(2, 'Daily bounties saved:', config.bounties);

            // Update status display
            BountyManager.updateBountyStatus();

            // Update member panel display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                HalloweenUI.updateBountiesClaimed();
            }
        },

        setupSoulConduitToggle: function() {
            const header = document.getElementById('soul-conduit-header');
            const content = document.getElementById('soul-conduit-content');
            const toggle = document.getElementById('soul-conduit-toggle');
            const helpBox = document.getElementById('soul-conduit-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '300px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupSpookyScheduleToggle: function() {
            const header = document.getElementById('spooky-schedule-header');
            const content = document.getElementById('spooky-schedule-content');
            const toggle = document.getElementById('spooky-schedule-toggle');
            const helpBox = document.getElementById('spooky-schedule-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '500px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupEtherealCommandToggle: function() {
            const header = document.getElementById('ethereal-command-header');
            const content = document.getElementById('ethereal-command-content');
            const toggle = document.getElementById('ethereal-command-toggle');
            const helpBox = document.getElementById('ethereal-command-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '300px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupPhantomSettingsToggle: function() {
            const header = document.getElementById('phantom-settings-header');
            const content = document.getElementById('phantom-settings-content');
            const toggle = document.getElementById('phantom-settings-toggle');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        // Collapse
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '0px';
                        GM_setValue('phantom_settings_expanded', false);
                    } else {
                        // Expand
                        content.style.maxHeight = '300px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        GM_setValue('phantom_settings_expanded', true);
                    }
                });

                // Restore saved expanded state
                const wasExpanded = GM_getValue('phantom_settings_expanded', false);
                if (wasExpanded) {
                    content.style.maxHeight = '300px';
                    content.style.marginTop = '';
                    content.style.marginBottom = '';
                    toggle.innerHTML = '&#9650;';
                    toggle.style.transform = 'rotate(180deg)';
                    header.style.marginBottom = '10px';
                }
            }
        },

        setupArcaneRitualsToggle: function() {
            const header = document.getElementById('arcane-rituals-header');
            const content = document.getElementById('arcane-rituals-content');
            const toggle = document.getElementById('arcane-rituals-toggle');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                    }
                });
            }
        },

        setupSpookyDatesHandlers: function() {
            // Load saved dates into input fields (handlers now in PumpkinCompetition.setupSpookyHandlers)
            const startDateInput = document.getElementById('spooky-start-date');
            const startTimeInput = document.getElementById('spooky-start-time');
            const endDateInput = document.getElementById('spooky-end-date');
            const endTimeInput = document.getElementById('spooky-end-time');

            if (startDateInput && startTimeInput && endDateInput && endTimeInput) {
                const savedStartDate = GM_getValue('halloween_spooky_start_date', '');
                const savedStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
                const savedEndDate = GM_getValue('halloween_spooky_end_date', '');
                const savedEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

                if (savedStartDate) startDateInput.value = savedStartDate;
                if (savedStartTime) startTimeInput.value = savedStartTime;
                if (savedEndDate) endDateInput.value = savedEndDate;
                if (savedEndTime) endTimeInput.value = savedEndTime;
            }
        },

        checkSpookyTargetsEndDate: function() {
            // Check if spooky targets competition has ended based on date and time
            const endDate = GM_getValue('halloween_spooky_end_date', '');
            const endTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!endDate) {
                return; // No end date configured
            }

            const now = new Date();
            const competitionEnd = new Date(`${endDate}T${endTime}`);

            // Check if current time is on or after end date/time
            if (now >= competitionEnd) {
                // Competition has ended - disable toggle regardless of notification status
                const wasActive = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';

                if (wasActive) {
                    GM_setValue('halloween_spooky_targets_active', 'false');

                    // Update cached state in HalloweenTargets
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    // Update UI toggle if visible
                    const spookyToggle = document.getElementById('spooky-targets-active-toggle');
                    const spookyStatus = document.getElementById('spooky-targets-active-status');
                    if (spookyToggle && spookyStatus) {
                        spookyToggle.checked = false;
                        spookyStatus.textContent = 'OFF';
                        spookyStatus.style.color = '#ff4444';
                    }

                    // Update countdown
                    if (typeof PumpkinCompetition !== 'undefined' && PumpkinCompetition.updateSpookyTargetsCountdown) {
                        PumpkinCompetition.updateSpookyTargetsCountdown();
                    }

                    HalloweenDebug.log(1, '🎯 Spooky targets disabled - competition ended');
                }

                // Show notification (only once)
                // DISABLED: Purple popup panel for spooky targets end (menu panel status still active)
                // HalloweenCompetition.showSpookyTargetsEndNotification();
            }
        },

        setupEffectTypeToggle: function() {
            // SPOOKY TARGET EFFECT TYPE
            const spookyEmojiRadio = document.getElementById('spooky-effect-type-emoji');
            const spookyImageRadio = document.getElementById('spooky-effect-type-image');
            const spookyCustomImageField = document.getElementById('spooky-custom-image-field');
            const spookyCustomImageUrl = document.getElementById('spooky-custom-image-url');

            if (spookyEmojiRadio && spookyImageRadio && spookyCustomImageField) {
                // Load saved spooky settings
                const savedSpookyEffectType = GM_getValue('halloween_spooky_effect_type', 'emoji');
                const savedSpookyImageUrl = GM_getValue('halloween_spooky_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png');

                // Apply saved spooky settings
                if (savedSpookyEffectType === 'image') {
                    spookyImageRadio.checked = true;
                    spookyCustomImageField.style.display = 'block';
                } else {
                    spookyEmojiRadio.checked = true;
                    spookyCustomImageField.style.display = 'none';
                }

                if (spookyCustomImageUrl) {
                    spookyCustomImageUrl.value = savedSpookyImageUrl;
                }

                // Handle spooky emoji radio selection
                spookyEmojiRadio.addEventListener('change', () => {
                    if (spookyEmojiRadio.checked) {
                        spookyCustomImageField.style.display = 'none';
                        GM_setValue('halloween_spooky_effect_type', 'emoji');
                        HalloweenDebug.log(1, '🎃 Spooky effect type set to emoji patterns');
                    }
                });

                // Handle spooky image radio selection
                spookyImageRadio.addEventListener('change', () => {
                    if (spookyImageRadio.checked) {
                        spookyCustomImageField.style.display = 'block';
                        GM_setValue('halloween_spooky_effect_type', 'image');
                        HalloweenDebug.log(1, '🎃 Spooky effect type set to custom image');
                    }
                });

                // Handle spooky custom image URL changes
                if (spookyCustomImageUrl) {
                    spookyCustomImageUrl.addEventListener('blur', () => {
                        const url = spookyCustomImageUrl.value || 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';
                        GM_setValue('halloween_spooky_custom_image_url', url);
                        HalloweenDebug.log(1, `🎃 Spooky custom image URL saved: ${url}`);
                    });
                }

                // Handle spooky max scale slider
                const spookyMaxScaleSlider = document.getElementById('spooky-max-scale');
                const spookyMaxScaleValue = document.getElementById('spooky-max-scale-value');
                if (spookyMaxScaleSlider && spookyMaxScaleValue) {
                    // Load saved value
                    const savedMaxScale = GM_getValue('halloween_spooky_max_scale', '2.5');
                    spookyMaxScaleSlider.value = savedMaxScale;
                    spookyMaxScaleValue.textContent = `${savedMaxScale}x`;

                    // Update display and save on change
                    spookyMaxScaleSlider.addEventListener('input', () => {
                        const value = spookyMaxScaleSlider.value;
                        spookyMaxScaleValue.textContent = `${value}x`;
                        GM_setValue('halloween_spooky_max_scale', value);
                        HalloweenDebug.log(1, `🎃 Spooky max scale set to ${value}x`);
                    });
                }
            }

            // BOUNTY TARGET EFFECT TYPE
            const bountyEmojiRadio = document.getElementById('bounty-effect-type-emoji');
            const bountyImageRadio = document.getElementById('bounty-effect-type-image');
            const bountyCustomImageField = document.getElementById('bounty-custom-image-field');
            const bountyCustomImageUrl = document.getElementById('bounty-custom-image-url');

            if (bountyEmojiRadio && bountyImageRadio && bountyCustomImageField) {
                // Load saved bounty settings
                const savedBountyEffectType = GM_getValue('halloween_bounty_effect_type', 'emoji');
                const savedBountyImageUrl = GM_getValue('halloween_bounty_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png');

                // Apply saved bounty settings
                if (savedBountyEffectType === 'image') {
                    bountyImageRadio.checked = true;
                    bountyCustomImageField.style.display = 'block';
                } else {
                    bountyEmojiRadio.checked = true;
                    bountyCustomImageField.style.display = 'none';
                }

                if (bountyCustomImageUrl) {
                    bountyCustomImageUrl.value = savedBountyImageUrl;
                }

                // Handle bounty emoji radio selection
                bountyEmojiRadio.addEventListener('change', () => {
                    if (bountyEmojiRadio.checked) {
                        bountyCustomImageField.style.display = 'none';
                        GM_setValue('halloween_bounty_effect_type', 'emoji');
                        HalloweenDebug.log(1, '🔥 Bounty effect type set to emoji patterns');
                    }
                });

                // Handle bounty image radio selection
                bountyImageRadio.addEventListener('change', () => {
                    if (bountyImageRadio.checked) {
                        bountyCustomImageField.style.display = 'block';
                        GM_setValue('halloween_bounty_effect_type', 'image');
                        HalloweenDebug.log(1, '🔥 Bounty effect type set to custom image');
                    }
                });

                // Handle bounty custom image URL changes
                if (bountyCustomImageUrl) {
                    bountyCustomImageUrl.addEventListener('blur', () => {
                        const url = bountyCustomImageUrl.value || 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';
                        GM_setValue('halloween_bounty_custom_image_url', url);
                        HalloweenDebug.log(1, `🔥 Bounty custom image URL saved: ${url}`);
                    });
                }

                // Handle bounty max scale slider
                const bountyMaxScaleSlider = document.getElementById('bounty-max-scale');
                const bountyMaxScaleValue = document.getElementById('bounty-max-scale-value');
                if (bountyMaxScaleSlider && bountyMaxScaleValue) {
                    // Load saved value
                    const savedMaxScale = GM_getValue('halloween_bounty_max_scale', '2.5');
                    bountyMaxScaleSlider.value = savedMaxScale;
                    bountyMaxScaleValue.textContent = `${savedMaxScale}x`;

                    // Update display and save on change
                    bountyMaxScaleSlider.addEventListener('input', () => {
                        const value = bountyMaxScaleSlider.value;
                        bountyMaxScaleValue.textContent = `${value}x`;
                        GM_setValue('halloween_bounty_max_scale', value);
                        HalloweenDebug.log(1, `🔥 Bounty max scale set to ${value}x`);
                    });
                }

                // GLOW EFFECT SETTINGS
                const glowEnabledCheckbox = document.getElementById('bounty-glow-enabled');
                const glowSettings = document.getElementById('bounty-glow-settings');
                const glowColorPicker = document.getElementById('bounty-glow-color');
                const glowColorText = document.getElementById('bounty-glow-color-text');

                if (glowEnabledCheckbox && glowSettings) {
                    // Load saved glow settings
                    const savedGlowEnabled = GM_getValue('halloween_bounty_glow_enabled', 'true') === 'true';
                    const savedGlowColor = GM_getValue('halloween_bounty_glow_color', '#ff6b35');

                    glowEnabledCheckbox.checked = savedGlowEnabled;
                    glowSettings.style.display = savedGlowEnabled ? 'block' : 'none';

                    if (glowColorPicker) glowColorPicker.value = savedGlowColor;
                    if (glowColorText) glowColorText.value = savedGlowColor;

                    // Handle glow enabled/disabled toggle
                    glowEnabledCheckbox.addEventListener('change', () => {
                        const isEnabled = glowEnabledCheckbox.checked;
                        GM_setValue('halloween_bounty_glow_enabled', isEnabled ? 'true' : 'false');
                        glowSettings.style.display = isEnabled ? 'block' : 'none';
                        HalloweenDebug.log(1, `🔥 Bounty glow effect ${isEnabled ? 'enabled' : 'disabled'}`);
                    });

                    // Sync color picker and text input
                    if (glowColorPicker && glowColorText) {
                        glowColorPicker.addEventListener('input', () => {
                            glowColorText.value = glowColorPicker.value;
                            GM_setValue('halloween_bounty_glow_color', glowColorPicker.value);
                            HalloweenDebug.log(1, `🔥 Bounty glow color changed: ${glowColorPicker.value}`);
                        });

                        glowColorText.addEventListener('blur', () => {
                            const colorValue = glowColorText.value.trim();
                            if (colorValue === '') {
                                // Reset to default
                                glowColorPicker.value = '#ff6b35';
                                glowColorText.value = '#ff6b35';
                                GM_setValue('halloween_bounty_glow_color', '#ff6b35');
                                HalloweenDebug.log(1, '🔥 Bounty glow color reset to default: #ff6b35');
                            } else if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
                                // Valid hex color
                                glowColorPicker.value = colorValue;
                                GM_setValue('halloween_bounty_glow_color', colorValue);
                                HalloweenDebug.log(1, `🔥 Bounty glow color saved: ${colorValue}`);
                            } else {
                                // Invalid, restore previous value
                                glowColorText.value = glowColorPicker.value;
                            }
                        });
                    }
                }
            }
        },

        setupDefeatVerificationToggle: function() {
            const header = document.getElementById('defeat-verification-header');
            const content = document.getElementById('defeat-verification-content');
            const toggle = document.getElementById('defeat-verification-toggle');

            if (header && content && toggle) {
                // Start collapsed
                content.style.maxHeight = '0px';
                header.style.marginBottom = '0px';
                toggle.innerHTML = '&#9660;';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        // Collapse
                        content.style.maxHeight = '0px';
                        header.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                    } else {
                        // Expand
                        content.style.maxHeight = '300px'; // Increased to accommodate button
                        header.style.marginBottom = '8px';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                    }
                });
            }

            // Set up API refresh link handler
            const refreshLink = document.getElementById('api-refresh-link');
            if (refreshLink) {
                // Add hover effects
                refreshLink.addEventListener('mouseenter', () => {
                    if (refreshLink.style.pointerEvents !== 'none') {
                        refreshLink.style.color = 'rgba(255, 255, 255, 0.8)';
                    }
                });
                refreshLink.addEventListener('mouseleave', () => {
                    refreshLink.style.color = 'rgba(255, 255, 255, 0.5)';
                });

                // Add click handler
                refreshLink.addEventListener('click', () => {
                    // Check if API mode is enabled
                    if (!GM_getValue('halloween_api_mode', false)) return;

                    // Check rate limiting (dynamic based on API testing mode)
                    const lastManualRefresh = GM_getValue('halloween_api_last_manual_refresh', 0);
                    const now = Date.now() / 1000;
                    const timeSinceLastRefresh = now - lastManualRefresh;
                    const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);
                    const cooldownSeconds = apiTestingMode ? 10 : 61; // 10s in testing, 61s in production

                    if (timeSinceLastRefresh < cooldownSeconds) {
                        // Still in cooldown period
                        const remainingSeconds = Math.ceil(cooldownSeconds - timeSinceLastRefresh);
                        const remainingMinutes = Math.ceil(remainingSeconds / 60);
                        this.showToast(`Please wait ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} before refreshing again`, 'warning');
                        return;
                    }

                    // Update last manual refresh time
                    GM_setValue('halloween_api_last_manual_refresh', now);

                    // Show loading state
                    const originalText = refreshLink.textContent;
                    refreshLink.textContent = 'Refreshing...';
                    refreshLink.style.pointerEvents = 'none';
                    refreshLink.style.opacity = '0.5';

                    // Trigger refresh
                    HalloweenDebug.log(1, '🔄 Manual API refresh triggered by user');
                    if (typeof APIDefeatVerification !== 'undefined') {
                        APIDefeatVerification.refreshAttackLog();
                    }

                    // Show requested toast immediately
                    this.showToast('API update requested', 'info');

                    // Reset link state after 3 seconds
                    setTimeout(() => {
                        refreshLink.textContent = originalText;
                        refreshLink.style.pointerEvents = 'auto';
                        refreshLink.style.opacity = '1';
                        refreshLink.style.color = 'rgba(255, 255, 255, 0.5)';

                        // Update stats display
                        this.updateDefeatVerificationStats();
                    }, 3000);
                });
            }
        },

        showToast: function(message, type = 'info') {
            const toast = document.getElementById('api-refresh-toast');
            if (!toast) return;

            // Set colors based on type
            const colors = {
                success: { bg: 'rgba(0, 255, 0, 0.1)', border: 'rgba(0, 255, 0, 0.3)', text: '#00ff00' },
                warning: { bg: 'rgba(255, 165, 0, 0.1)', border: 'rgba(255, 165, 0, 0.3)', text: '#ffa500' },
                error: { bg: 'rgba(255, 0, 0, 0.1)', border: 'rgba(255, 0, 0, 0.3)', text: '#ff6666' },
                info: { bg: 'rgba(0, 255, 255, 0.1)', border: 'rgba(0, 255, 255, 0.3)', text: '#00ffff' }
            };

            const color = colors[type] || colors.info;

            // Style and show toast
            toast.style.background = color.bg;
            toast.style.border = `1px solid ${color.border}`;
            toast.style.color = color.text;
            toast.textContent = message;
            toast.style.display = 'block';
            toast.style.opacity = '1';

            // Auto-hide after 3 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 300);
            }, 3000);
        },

        showDecryptionError: function() {
            this.showToast('Target page decryption error', 'error');
            HalloweenDebug.log(1, '🔮 Enchanted pages decryption failed after retries');
        },

        generatePlayerIdentitySection: function() {
            // Check if player ID is already set
            const playerId = GM_getValue('halloween_player_id', '');

            if (playerId) {
                // Player ID is set, don't show the input field
                return '';
            }

            // Player ID not set, show dual-mode enrollment
            return `
                <div id="player-identity-section" style="margin-bottom: 15px; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.4); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 10px;">COMPETITION ENROLLMENT</div>

                    <!-- Mode Selection -->
                    <div style="margin-bottom: 0;">
                        <div style="font-size: 11px; color: #fff; margin-bottom: 10px; opacity: 0.8;">Choose enrollment method:</div>
                        <div style="display: flex; gap: 15px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                <input type="radio" name="enrollment-mode" value="member-id" checked style="cursor: pointer;">
                                <span style="font-size: 11px; color: #fff;">Player ID</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                <input type="radio" name="enrollment-mode" value="api-key" style="cursor: pointer;">
                                <span style="font-size: 11px; color: #fff;">API Key (Instant)</span>
                            </label>
                        </div>
                    </div>

                    <!-- Mode Description (changes based on selection) -->
                    <div style="margin: 10px 0; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px; text-align: center;">
                        <div id="member-id-description" style="font-size: 9px; color: rgba(255, 255, 255, 0.7); display: block;">
                            30-90 second verification delay \u2022 Basic logs only
                        </div>
                        <div id="api-key-description" style="font-size: 9px; color: rgba(255, 255, 255, 0.7); display: none;">
                            Real-time verification \u2022 Bonus stats \u2022 Full Logs
                        </div>
                    </div>

                    <!-- Member ID Mode -->
                    <div id="member-id-mode" style="display: block;">
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="player-id-input" placeholder="Enter Player ID..." style="flex: 1; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid #FFD700; border-radius: 4px; color: #fff; font-size: 11px;">
                            <button id="set-player-id" style="padding: 8px 12px; background: #FFD700; color: black; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">ENROLL</button>
                        </div>
                    </div>

                    <!-- API Key Mode -->
                    <div id="api-key-mode" style="display: none;">
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="api-key-input" placeholder="Enter API Key..." style="flex: 1; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid #FFD700; border-radius: 4px; color: #fff; font-size: 11px;">
                            <button id="set-api-key" style="padding: 8px 12px; background: #FFD700; color: black; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">ENROLL</button>
                        </div>
                    </div>

                    <div style="font-size: 10px; color: rgba(255, 255, 255, 0.6); margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 215, 0, 0.2); text-align: center;">
                        <span style="vertical-align: 1px; font-size: 12px;">&#9888;&#xFE0F;</span> API provides bonus stats - add now or connect later
                    </div>
                </div>
            `;
        },

        generateSwitchToAPILink: function() {
            // Only show if player is enrolled but not in API mode
            const playerId = GM_getValue('halloween_player_id', '');
            const apiMode = APIDefeatVerification.isAPIMode();

            if (!playerId || apiMode) {
                return ''; // Don't show if not enrolled or already in API mode
            }

            return `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0, 255, 255, 0.2); text-align: center;">
                    <a id="switch-to-api-mode-link" style="
                        font-size: 11px;
                        color: #FFD700;
                        text-decoration: underline;
                        cursor: pointer;
                        opacity: 0.9;
                        transition: opacity 0.3s;
                    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">
                        Switch to API Mode
                    </a>
                    <div style="font-size: 9px; color: rgba(255, 255, 255, 0.5); margin-top: 4px;">
                        Enable faster verification & bonus stats
                    </div>
                </div>
            `;
        },

        generateTeamBadge: function() {
            // Check if team badge is set
            const teamDataStr = GM_getValue('halloween_team_badge', null);
            if (!teamDataStr) {
                return ''; // No team badge set
            }

            try {
                const teamData = safeParse(teamDataStr, null);
                if (!teamData || !teamData.team || !teamData.members) {
                    return '';
                }

                const team = teamData.team;
                const leader = teamData.leader;
                const members = teamData.members;

                // Team configurations
                const teamConfig = {
                    witches: {
                        name: 'THE WITCHES',
                        emoji: '&#x1F52E;', // 🔮
                        gradient: 'linear-gradient(135deg, #6b21a8 0%, #a855f7 100%)',
                        border: '#a855f7'
                    },
                    wizards: {
                        name: 'THE WIZARDS',
                        emoji: '&#x1F9D9;', // 🧙
                        gradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                        border: '#10b981'
                    },
                    werewolves: {
                        name: 'THE WEREWOLVES',
                        emoji: '&#x1F43A;', // 🐺
                        gradient: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                        border: '#fb923c'
                    },
                    vampires: {
                        name: 'THE VAMPIRES',
                        emoji: '&#x1F9DB;', // 🧛
                        gradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
                        border: '#ef4444'
                    }
                };

                const config = teamConfig[team];
                if (!config) {
                    return '';
                }

                // Generate leader row
                let leaderRow = '';
                if (leader && leader.name && leader.id) {
                    const leaderProfileUrl = `https://www.torn.com/profiles.php?XID=${leader.id}`;
                    leaderRow = `
                        <div style="
                            grid-column: 1 / -1;
                            text-align: center;
                            padding: 8px;
                            border-bottom: 1px solid ${config.border};
                            margin-bottom: 8px;
                            font-size: 11px;
                            font-family: var(--halloween-font);
                            color: #ffffff;
                        ">
                            Team Leader: <a href="${leaderProfileUrl}" target="_blank" style="color: ${config.border}; text-decoration: none; font-family: var(--halloween-font);">${leader.name} [${leader.id}]</a>
                        </div>
                    `;
                }

                // Generate member grid (each member as a grid item)
                const memberLinks = members.map(member => {
                    const profileUrl = `https://www.torn.com/profiles.php?XID=${member.id}`;
                    return `<div style="text-align: center;"><a href="${profileUrl}" target="_blank" class="team-member-link" style="color: #ffffff; font-size: 11px; cursor: pointer; text-decoration: none; font-family: var(--halloween-font);">${member.name}</a></div>`;
                }).join('');

                return `
                <div style="margin-bottom: 15px; position: relative;">
                    <div id="team-badge-header" style="
                        padding: 6px;
                        border-radius: 8px;
                        background: ${config.gradient};
                        border: 1px solid ${config.border};
                        color: #ffffff;
                        font-weight: bold;
                        font-size: 12px;
                        font-family: var(--halloween-font);
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        z-index: 10000;
                    ">
                        <span style="display: inline-flex; align-items: center; gap: 6px;">
                            <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; margin-top: -2px;">${config.emoji}</span>
                            <span>${config.name}</span>
                        </span>
                        <span id="team-badge-arrow" style="font-size: 10px; position: absolute; right: 6px;">&#9660;</span>
                    </div>
                    <div id="team-badge-members" style="
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        margin-top: -6px;
                        padding: 12px;
                        background: rgba(0, 0, 0, 0.95);
                        border: 1px solid ${config.border};
                        border-radius: 0 0 8px 8px;
                        z-index: 9999;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                    ">${leaderRow}${memberLinks}</div>
                </div>
                `;
            } catch (e) {
                HalloweenDebug.log(1, `⚠️ Error generating team badge: ${e.message}`);
                return '';
            }
        },

        generateCollectiblesSection: function() {
            // Get current collectible counts
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = safeParse(collectibles, '{}');

            return `
                <!-- COLLECTIBLES FOUND Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 14px; font-weight: bold; color: var(--carved-cyan);">COLLECTIBLES FOUND</span>
                        <span id="member-manifestations-status-link" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: none; opacity: 0.8;">Show Status</span>
                    </div>

                    <!-- Manifestations Countdown (hidden by default, shown in individual mode) -->
                    <div id="member-manifestations-countdown" style="display: none; margin-bottom: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 6px; padding: 10px 15px; text-align: center;">
                        <span id="member-manifestations-countdown-text" style="font-weight: bold; color: var(--carved-cyan); font-size: 12px;">Ends in...</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; min-width: 0;">
                        <!-- Gold Collectible (Ultra Rare) -->
                        <div style="text-align: center; padding: 6px; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/67ffM1nP/Gold.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin: 6px 0;">${counts.gold || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #FFD700;">Gold</div>
                        </div>
                        <!-- Corrupt Collectible (Rare) -->
                        <div style="text-align: center; padding: 6px 5px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/FkpnKh7Z/Corrupt.png" style="width: 18px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #00FFFF; margin: 6px 0;">${counts.corrupt || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #00FFFF;">Corrupt</div>
                        </div>
                        <!-- Cyber Collectible (Uncommon) -->
                        <div style="text-align: center; padding: 6px; background: rgba(183, 148, 246, 0.1); border: 1px solid rgba(183, 148, 246, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/fdSK5bNM/Cyber.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #b794f6; margin: 6px 0;">${counts.cyber || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #b794f6;">Cyber</div>
                        </div>
                        <!-- Pure Collectible (Common) -->
                        <div style="text-align: center; padding: 6px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/Xf7FR9gP/Pure.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #FFFFFF; margin: 6px 0;">${counts.pure || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #FFFFFF;">Pure</div>
                        </div>
                        <!-- Candy Collectible (Most Common) -->
                        <div style="text-align: center; padding: 6px; background: rgba(243, 152, 186, 0.1); border: 1px solid rgba(243, 152, 186, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/sd0SzWJz/candyv2.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #f398ba; margin: 6px 0;">${counts.candy || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #f398ba;">Candy</div>
                        </div>
                    </div>
                </div>

                <!-- BOUNTIES CLAIMED Section (Member Only - shown when bounties active) -->
                <div id="bounties-claimed-section" style="display: none; margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 12px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 8px;">BOUNTIES CLAIMED</div>
                    <div id="bounties-claimed-grid" style="display: flex; gap: 4px; flex-wrap: nowrap; justify-content: flex-start; margin-bottom: 10px;">
                        <!-- Bounty squares will be dynamically inserted here -->
                    </div>
                    <div style="font-size: 9px; color: rgba(255, 255, 255, 0.6); text-align: center;">
                        Bounties made by decree, check Discord for today's target
                    </div>
                </div>
            `;
        },

        generateBonusStatsSection: function() {
            // Only show bonus stats in API mode
            if (!APIDefeatVerification.isAPIMode()) {
                return '';
            }

            const bonusStats = APIDefeatVerification.getBonusStats();

            // Get refresh interval text
            const refreshInterval = APIDefeatVerification.getRefreshInterval();
            const refreshText = refreshInterval === 60 ? '60 seconds' : '5 minutes';

            // Calculate date range display based on report mode
            let dateRangeText = '';
            const reportMode = GM_getValue('halloween_report_mode', 'default');

            if (reportMode === '7d') {
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const dateStr = `${sevenDaysAgo.getDate()}/${sevenDaysAgo.getMonth() + 1}`;
                dateRangeText = `${dateStr} - Now`;
            } else if (reportMode === 'historical') {
                const startTimestamp = GM_getValue('halloween_historical_period_start', 0);
                const endTimestamp = GM_getValue('halloween_historical_period_end', 0);

                if (startTimestamp && endTimestamp) {
                    const startDate = new Date(startTimestamp * 1000);
                    const endDate = new Date(endTimestamp * 1000);
                    const startStr = `${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear().toString().slice(-2)}`;
                    const endStr = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear().toString().slice(-2)}`;
                    dateRangeText = `${startStr} - ${endStr}`;
                }
            }
            // default mode - no date range shown

            // Get last attack timestamp
            const attacks = APIDefeatVerification.getAllAttacks();
            const attackValues = Object.values(attacks);
            let lastAttackText = 'No attacks yet';

            if (attackValues.length > 0) {
                const timestamps = attackValues.map(a => a.timestamp_started);
                const newestTimestamp = Math.max(...timestamps);
                const attackDate = new Date(newestTimestamp * 1000);

                // Format as GMT (TCT)
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                const attackDay = new Date(attackDate.getFullYear(), attackDate.getMonth(), attackDate.getDate());

                let dayLabel;
                if (attackDay.getTime() === today.getTime()) {
                    dayLabel = 'Today';
                } else if (attackDay.getTime() === yesterday.getTime()) {
                    dayLabel = 'Yesterday';
                } else {
                    dayLabel = attackDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                }

                const timeStr = attackDate.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'GMT',
                    hour12: false
                });

                lastAttackText = `${dayLabel} at ${timeStr}`;
            }

            return `
                <!-- HALLOWEEK STATS Section (API Mode Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline;">
                        <span><span id="battle-analytics-icon" style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; font-size: 12px; display: inline-block; vertical-align: middle; position: relative; top: -1px; cursor: pointer;">📊</span> HALLOWEEK STATS</span>
                        ${dateRangeText ? `<span style="font-size: 9px; font-weight: 200; color: rgba(255, 255, 255, 0.6);">${dateRangeText}</span>` : ''}
                    </div>

                    <!-- Outgoing Stats (Offense) -->
                    <div style="font-size: 10px; font-weight: bold; color: rgba(200, 200, 200, 0.8); margin-bottom: 6px; display: flex; justify-content: center; align-items: center; gap: 4px;">
                        <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">⚔️</span>
                        <span>OFFENSE</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: #fff; margin: 6px 0;" id="stat-competition-attacks">${bonusStats.totalAttacks}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Attacks</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: #fff; margin: 6px 0;" id="stat-unique-opponents">${bonusStats.uniqueOpponents}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Opponents</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: #fff; margin: 6px 0;" id="stat-total-defeats">${bonusStats.totalDefeats}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Defeated</div>
                        </div>
                    </div>

                    <!-- Incoming Stats (Defense) -->
                    <div style="font-size: 10px; font-weight: bold; color: rgba(200, 200, 200, 0.8); margin-bottom: 6px; display: flex; justify-content: center; align-items: center; gap: 4px;">
                        <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🛡️</span>
                        <span>DEFENSE</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: rgba(200, 200, 200, 0.9); margin: 6px 0;" id="stat-total-attacked">${bonusStats.totalAttacked}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Attacked</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: rgba(200, 200, 200, 0.9); margin: 6px 0;" id="stat-unique-attackers">${bonusStats.uniqueAttackers}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Attackers</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: rgba(200, 200, 200, 0.9); margin: 6px 0;" id="stat-total-defends">${bonusStats.totalDefends}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Defends</div>
                        </div>
                    </div>

                    <div style="font-size: 9px; color: var(--carved-cyan); margin-top: 8px; text-align: center; padding: 8px 0 0 0; border-top: 1px solid rgba(0, 255, 255, 0.2);">
                        Last attack: ${lastAttackText}
                    </div>
                    <div style="font-size: 9px; color: rgba(255, 255, 255, 0.6); text-align: center; padding: 4px 0 0 0;">
                        Data from personal API logs \u2022 Updated every ${refreshText}
                    </div>
                </div>
            `;
        },

        setupTileImageHandler: function() {
            const tileImageInput = document.getElementById('halloween-tile-image');

            if (tileImageInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                if (currentConfig.tileImage) {
                    tileImageInput.value = currentConfig.tileImage;
                }

                // Auto-save on blur
                tileImageInput.addEventListener('blur', () => {
                    const tileUrl = tileImageInput.value.trim();

                    // Get current config and update just the tile image
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.tileImage = tileUrl;
                    FactionConfig.setConfig(updatedConfig);

                    // Apply the background if URL is provided
                    if (tileUrl && HalloweenUI.backgroundEnabled) {
                        FactionConfig.applyCustomBackground(tileUrl);
                        HalloweenDebug.log(2, '🎃 Background tile image auto-saved and applied');
                    }
                });
            }
        },

        setupFirebaseURLHandler: function() {
            const firebaseURLInput = document.getElementById('attack-logs-firebase-url');

            if (firebaseURLInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                if (currentConfig.attackLogsFirebaseURL) {
                    firebaseURLInput.value = currentConfig.attackLogsFirebaseURL;
                }

                // Auto-save on blur
                firebaseURLInput.addEventListener('blur', () => {
                    let firebaseURL = firebaseURLInput.value.trim();

                    // Remove trailing slash if present
                    if (firebaseURL.endsWith('/')) {
                        firebaseURL = firebaseURL.slice(0, -1);
                        firebaseURLInput.value = firebaseURL; // Update field display
                    }

                    // Get current config and update just the Firebase URL
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.attackLogsFirebaseURL = firebaseURL;
                    FactionConfig.setConfig(updatedConfig);

                    HalloweenDebug.log(2, '🎃 Attack Logs Firebase URL auto-saved:', firebaseURL);
                });
            }

            // RTDB Key handler
            const rtdbKeyInput = document.getElementById('rtdb-key');

            if (rtdbKeyInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                if (currentConfig.rtdbKey) {
                    rtdbKeyInput.value = currentConfig.rtdbKey;
                }

                // Auto-save on blur
                rtdbKeyInput.addEventListener('blur', () => {
                    const rtdbKey = rtdbKeyInput.value.trim();

                    // Get current config and update just the RTDB key
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.rtdbKey = rtdbKey;
                    FactionConfig.setConfig(updatedConfig);

                    HalloweenDebug.log(2, '🎃 RTDB Key auto-saved');
                });
            }
        },

        setupFactionIconHandler: function() {
            const iconInput = document.getElementById('halloween-icon-url');

            if (iconInput) {
                // Populate field with saved value OR default
                const currentConfig = FactionConfig.getConfig();
                const defaultIcon = 'https://i.ibb.co/fYD8KsYX/carved-king-250.png';
                iconInput.value = currentConfig.factionIcon || defaultIcon;

                // Auto-save on blur
                iconInput.addEventListener('blur', () => {
                    const iconUrl = iconInput.value.trim() || defaultIcon;

                    // Update config
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.factionIcon = iconUrl;
                    FactionConfig.setConfig(updatedConfig);

                    // Apply the icon immediately
                    FactionConfig.updateTriggerIcon(iconUrl);

                    HalloweenDebug.log(2, '🎃 Faction icon auto-saved and applied:', iconUrl);
                });
            }
        },

        setupPrimaryColorHandler: function() {
            const colorPicker = document.getElementById('halloween-primary-color');
            const colorText = document.getElementById('halloween-primary-color-text');
            const defaultColor = '#ff6b35';

            if (colorPicker && colorText) {
                // Populate fields with saved value
                const currentConfig = FactionConfig.getConfig();
                const savedColor = currentConfig.primaryColor || defaultColor;
                colorPicker.value = savedColor;
                colorText.value = savedColor;

                // Sync: Color picker input -> update text field
                colorPicker.addEventListener('input', () => {
                    colorText.value = colorPicker.value;
                });

                // Sync: Text field blur -> update picker and save
                colorText.addEventListener('blur', () => {
                    const textValue = colorText.value.trim();
                    let finalColor;

                    if (textValue === '') {
                        // Reset to default
                        finalColor = defaultColor;
                        colorPicker.value = defaultColor;
                        colorText.value = defaultColor;
                        HalloweenDebug.log(2, '🎃 Primary color reset to default:', defaultColor);
                    } else if (/^#[0-9A-F]{6}$/i.test(textValue)) {
                        // Valid hex color
                        finalColor = textValue;
                        colorPicker.value = textValue;
                        HalloweenDebug.log(2, '🎃 Primary color updated:', finalColor);
                    } else {
                        // Invalid - revert to current saved value
                        finalColor = currentConfig.primaryColor || defaultColor;
                        colorText.value = finalColor;
                        colorPicker.value = finalColor;
                        HalloweenDebug.log(2, '🎃 Invalid hex - reverted to saved:', finalColor);
                        return;
                    }

                    // Update config and apply
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.primaryColor = finalColor;
                    FactionConfig.setConfig(updatedConfig);
                    document.documentElement.style.setProperty('--halloween-primary', finalColor);
                });
            }
        },

        setupSecondaryColorHandler: function() {
            const colorPicker = document.getElementById('halloween-secondary-color');
            const colorText = document.getElementById('halloween-secondary-color-text');
            const defaultColor = '#f7931e';

            if (colorPicker && colorText) {
                // Populate fields with saved value
                const currentConfig = FactionConfig.getConfig();
                const savedColor = currentConfig.secondaryColor || defaultColor;
                colorPicker.value = savedColor;
                colorText.value = savedColor;

                // Sync: Color picker input -> update text field
                colorPicker.addEventListener('input', () => {
                    colorText.value = colorPicker.value;
                });

                // Sync: Text field blur -> update picker and save
                colorText.addEventListener('blur', () => {
                    const textValue = colorText.value.trim();
                    let finalColor;

                    if (textValue === '') {
                        // Reset to default
                        finalColor = defaultColor;
                        colorPicker.value = defaultColor;
                        colorText.value = defaultColor;
                        HalloweenDebug.log(2, '🎃 Secondary color reset to default:', defaultColor);
                    } else if (/^#[0-9A-F]{6}$/i.test(textValue)) {
                        // Valid hex color
                        finalColor = textValue;
                        colorPicker.value = textValue;
                        HalloweenDebug.log(2, '🎃 Secondary color updated:', finalColor);
                    } else {
                        // Invalid - revert to current saved value
                        finalColor = currentConfig.secondaryColor || defaultColor;
                        colorText.value = finalColor;
                        colorPicker.value = finalColor;
                        HalloweenDebug.log(2, '🎃 Invalid hex - reverted to saved:', finalColor);
                        return;
                    }

                    // Update config and apply
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.secondaryColor = finalColor;
                    FactionConfig.setConfig(updatedConfig);
                    document.documentElement.style.setProperty('--halloween-secondary', finalColor);
                });
            }
        },

        setupMenuPanelImageHandler: function() {
            const iconRadio = document.getElementById('menu-panel-icon');
            const bannerRadio = document.getElementById('menu-panel-banner');
            const iconUrlField = document.getElementById('icon-url-field');
            const bannerUrlField = document.getElementById('banner-url-field');

            if (iconRadio && bannerRadio && iconUrlField && bannerUrlField) {
                // Load saved settings
                const currentConfig = FactionConfig.getConfig();
                const currentMode = currentConfig.menuPanelImage || 'icon';

                // Apply saved settings and show correct field
                if (currentMode === 'banner') {
                    bannerRadio.checked = true;
                    iconUrlField.style.display = 'none';
                    bannerUrlField.style.display = 'block';
                } else {
                    iconRadio.checked = true;
                    iconUrlField.style.display = 'block';
                    bannerUrlField.style.display = 'none';
                }

                // Handle Icon radio selection
                iconRadio.addEventListener('change', () => {
                    if (iconRadio.checked) {
                        iconUrlField.style.display = 'block';
                        bannerUrlField.style.display = 'none';

                        // Update config
                        const updatedConfig = FactionConfig.getConfig();
                        updatedConfig.menuPanelImage = 'icon';
                        FactionConfig.setConfig(updatedConfig);

                        // Refresh menu to show icon mode
                        HalloweenMenu.updateMenuContent();

                        HalloweenDebug.log(2, '🎃 Menu panel image mode set to icon');
                    }
                });

                // Handle Banner radio selection
                bannerRadio.addEventListener('change', () => {
                    if (bannerRadio.checked) {
                        iconUrlField.style.display = 'none';
                        bannerUrlField.style.display = 'block';

                        // Update config
                        const updatedConfig = FactionConfig.getConfig();
                        updatedConfig.menuPanelImage = 'banner';
                        FactionConfig.setConfig(updatedConfig);

                        // Refresh menu to show banner mode
                        HalloweenMenu.updateMenuContent();

                        HalloweenDebug.log(2, '🎃 Menu panel image mode set to banner');
                    }
                });
            }
        },

        setupFactionBannerHandler: function() {
            const bannerInput = document.getElementById('halloween-banner-url');
            if (bannerInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                bannerInput.value = currentConfig.factionBanner || '';

                // Auto-save on blur
                bannerInput.addEventListener('blur', () => {
                    const bannerUrl = bannerInput.value.trim();

                    // Update config
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.factionBanner = bannerUrl;
                    FactionConfig.setConfig(updatedConfig);

                    // Refresh menu if banner mode is active
                    if (updatedConfig.menuPanelImage === 'banner') {
                        HalloweenMenu.updateMenuContent();
                    }

                    HalloweenDebug.log(2, '🎃 Faction banner auto-saved:', bannerUrl);
                });
            }
        },

        setupPlayerIdentityHandlers: function() {
            // Setup radio button toggles
            const radioButtons = document.querySelectorAll('input[name="enrollment-mode"]');
            const memberIdMode = document.getElementById('member-id-mode');
            const apiKeyMode = document.getElementById('api-key-mode');
            const memberIdDescription = document.getElementById('member-id-description');
            const apiKeyDescription = document.getElementById('api-key-description');

            radioButtons.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'member-id') {
                        memberIdMode.style.display = 'block';
                        apiKeyMode.style.display = 'none';
                        memberIdDescription.style.display = 'block';
                        apiKeyDescription.style.display = 'none';
                    } else {
                        memberIdMode.style.display = 'none';
                        apiKeyMode.style.display = 'block';
                        memberIdDescription.style.display = 'none';
                        apiKeyDescription.style.display = 'block';
                    }
                });
            });

            // ===================================
            // MEMBER ID MODE HANDLER
            // ===================================
            const setPlayerIdBtn = document.getElementById('set-player-id');
            const playerIdInput = document.getElementById('player-id-input');

            if (setPlayerIdBtn && playerIdInput) {
                setPlayerIdBtn.addEventListener('click', () => {
                    const playerId = playerIdInput.value.trim();
                    if (playerId.length >= 3) {
                        // Save the player ID and enrollment timestamp
                        GM_setValue('halloween_player_id', playerId);
                        GM_setValue('halloween_enrollment_timestamp', Math.floor(Date.now() / 1000));
                        HalloweenDebug.log(1, `🎃 Player ID set: ${playerId}`);

                        // Show success message in identity section
                        const identitySection = document.getElementById('player-identity-section');
                        if (identitySection) {
                            identitySection.innerHTML = `
                                <div style="
                                    background: rgba(255, 215, 0, 0.1);
                                    border: 1px solid rgba(255, 215, 0, 0.4);
                                    border-radius: 8px;
                                    padding: 15px;
                                    text-align: center;
                                ">
                                    <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 8px;">ENROLLMENT COMPLETE</div>
                                    <div style="font-size: 12px; color: #fff;">Player ID "${playerId}" enrolled! Using Firebase verification.</div>
                                </div>
                            `;

                            // Rebuild menu after 5 seconds to show enrolled state
                            setTimeout(() => {
                                this.updateMenuContent();
                            }, 5000);
                        }
                    } else {
                        alert('Player ID must be at least 3 characters long');
                    }
                });

                // Allow Enter key to submit
                playerIdInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        setPlayerIdBtn.click();
                    }
                });
            }

            // ===================================
            // API KEY MODE HANDLER
            // ===================================
            const setApiKeyBtn = document.getElementById('set-api-key');
            const apiKeyInput = document.getElementById('api-key-input');

            if (setApiKeyBtn && apiKeyInput) {
                setApiKeyBtn.addEventListener('click', async () => {
                    const apiKey = apiKeyInput.value.trim();

                    if (apiKey.length < 10) {
                        alert('Please enter a valid API key');
                        return;
                    }

                    // Disable button and show loading
                    setApiKeyBtn.disabled = true;
                    setApiKeyBtn.textContent = 'VALIDATING...';

                    try {
                        // Validate API key and enable API mode
                        const result = await APIDefeatVerification.enableAPIMode(apiKey);

                        if (result.success) {
                            // Save player ID (from API validation)
                            GM_setValue('halloween_player_id', result.playerId.toString());

                            HalloweenDebug.log(1, `🎃 API Mode enabled for ${result.playerName} [${result.playerId}]`);

                            // Show competition time picker
                            this.showCompetitionTimePicker(result.playerName, result.playerId);
                        } else {
                            // Show error
                            alert(`API Validation Failed: ${result.error}`);
                            setApiKeyBtn.disabled = false;
                            setApiKeyBtn.textContent = 'ENROLL';
                        }
                    } catch (error) {
                        alert(`Error: ${error.message}`);
                        setApiKeyBtn.disabled = false;
                        setApiKeyBtn.textContent = 'ENROLL';
                    }
                });

                // Allow Enter key to submit
                apiKeyInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        setApiKeyBtn.click();
                    }
                });
            }
        },

        showCompetitionTimePicker: function(playerName, playerId) {
            // Generate time options (10:00 to 16:00 TCT in 15-min intervals)
            const timeOptions = [];
            for (let hour = 10; hour <= 16; hour++) {
                for (let minute = 0; minute < 60; minute += 15) {
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    timeOptions.push(timeStr);
                    if (hour === 16 && minute === 0) break; // Stop at 16:00
                }
            }

            // Replace enrollment panel content with time picker
            // Try to find the container - could be standard enrollment or switch to API mode
            let container = document.getElementById('player-identity-section');

            // Fallback for "Switch to API Mode" flow (API key form is showing)
            if (!container) {
                const validateBtn = document.getElementById('validate-api-key-btn');
                if (validateBtn) {
                    // Navigate up to find the main container (parent of the form)
                    container = validateBtn.closest('div[style*="margin-top"]') || validateBtn.parentElement?.parentElement;
                }
            }

            if (!container) return;

            container.innerHTML = `
                <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 10px;">COMPETITION START TIME</div>

                <div style="font-size: 11px; color: #fff; margin-bottom: 12px; opacity: 0.9; line-height: 1.4;">
                    Select when the Halloween competition starts for you.<br>
                    Competition runs: Oct 25 - Nov 1, 2025
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 11px; color: #fff; margin-bottom: 6px; opacity: 0.8;">Start Time (TCT)</label>
                    <select id="competition-start-time-select" style="
                        width: 100%;
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid #FFD700;
                        border-radius: 4px;
                        color: #fff;
                        font-size: 11px;
                        cursor: pointer;
                    ">
                        ${timeOptions.map(time => `
                            <option value="${time}" ${time === '14:00' ? 'selected' : ''}>${time} TCT</option>
                        `).join('')}
                    </select>
                </div>

                <button id="confirm-competition-time" style="
                    width: 100%;
                    padding: 10px;
                    background: #FFD700;
                    color: black;
                    border: none;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                ">CONFIRM START TIME</button>
            `;

            // Handle confirm button
            const confirmBtn = document.getElementById('confirm-competition-time');
            const timeSelect = document.getElementById('competition-start-time-select');

            confirmBtn.addEventListener('click', () => {
                const selectedTime = timeSelect.value;
                const [hours, minutes] = selectedTime.split(':').map(Number);

                // Calculate competition timestamps (Oct 25 - Nov 1, 2025 at selected time)
                const startTimestamp = Math.floor(Date.UTC(2025, 9, 25, hours, minutes, 0) / 1000); // Oct = month 9
                const endTimestamp = Math.floor(Date.UTC(2025, 10, 1, hours, minutes, 0) / 1000);   // Nov = month 10

                // Save timestamps
                GM_setValue('halloween_competition_start_timestamp', startTimestamp);
                GM_setValue('halloween_competition_end_timestamp', endTimestamp);
                GM_setValue('halloween_enrollment_timestamp', Math.floor(Date.now() / 1000));

                HalloweenDebug.log(1, `🎃 Competition times set: ${selectedTime} TCT (${startTimestamp} - ${endTimestamp})`);

                // Trigger immediate API backfill from competition start time
                if (APIDefeatVerification.isAPIMode()) {
                    HalloweenDebug.log(1, '🔄 Triggering API backfill from competition start...');
                    APIDefeatVerification.refreshAttackLog();
                }

                // Replace enrollment section content with success notification
                container.innerHTML = `
                    <div style="
                        background: rgba(255, 215, 0, 0.1);
                        border: 1px solid rgba(255, 215, 0, 0.4);
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                    ">
                        <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 8px;">ENROLLMENT COMPLETE</div>
                        <div style="font-size: 12px; color: #fff;">Good Luck ${playerName}!</div>
                    </div>
                `;

                // Rebuild menu after 5 seconds to show enrolled state
                setTimeout(() => {
                    this.updateMenuContent();
                }, 5000);
            });
        },


        setupSwitchToAPIHandler: function() {
            const switchLink = document.getElementById('switch-to-api-mode-link');

            if (switchLink) {
                switchLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currentPlayerId = GM_getValue('halloween_player_id', '');
                    this.showAPIKeyInput(currentPlayerId);
                });
            }
        },

        showAPIKeyInput: function(currentPlayerId) {
            // Find the switch link and replace its parent container with the API key form
            const switchLink = document.getElementById('switch-to-api-mode-link');
            if (!switchLink) return;

            const container = switchLink.parentElement;
            if (!container) return;

            container.innerHTML = `
                <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 10px;">SWITCH TO API MODE</div>

                <div style="font-size: 11px; color: #fff; margin-bottom: 12px; opacity: 0.9; line-height: 1.4;">
                    Enter your Torn API key to enable faster verification and bonus stats.
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 11px; color: #fff; margin-bottom: 6px; opacity: 0.8;">Torn API Key</label>
                    <input type="text" id="api-key-input" placeholder="Enter your API key" style="
                        width: 100%;
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid #FFD700;
                        border-radius: 4px;
                        color: #fff;
                        font-size: 11px;
                        box-sizing: border-box;
                    ">
                </div>

                <div id="api-key-error" style="display: none; color: #ff4444; font-size: 10px; margin-bottom: 12px; padding: 8px; background: rgba(255, 68, 68, 0.1); border: 1px solid rgba(255, 68, 68, 0.3); border-radius: 4px;"></div>

                <button id="validate-api-key-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: #FFD700;
                    color: black;
                    border: none;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 8px;
                ">VALIDATE API KEY</button>

                <button id="cancel-api-switch-btn" style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                    font-size: 11px;
                    cursor: pointer;
                ">CANCEL</button>
            `;

            // Setup handlers
            const validateBtn = document.getElementById('validate-api-key-btn');
            const cancelBtn = document.getElementById('cancel-api-switch-btn');
            const apiKeyInput = document.getElementById('api-key-input');
            const errorDiv = document.getElementById('api-key-error');

            // Focus input
            apiKeyInput.focus();

            // Handle Enter key
            apiKeyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    validateBtn.click();
                }
            });

            // Handle validation
            validateBtn.addEventListener('click', async () => {
                const apiKey = apiKeyInput.value.trim();

                if (!apiKey) {
                    errorDiv.textContent = 'Please enter an API key';
                    errorDiv.style.display = 'block';
                    return;
                }

                // Disable button and show loading
                validateBtn.disabled = true;
                validateBtn.textContent = 'VALIDATING...';
                errorDiv.style.display = 'none';

                try {
                    HalloweenDebug.log(2, 'Starting API key validation...');

                    // Validate API key
                    const result = await APIDefeatVerification.validateAPIKey(apiKey);
                    HalloweenDebug.log(2, 'Validation complete. Player:', result.name, result.player_id);

                    // Check if API key belongs to the same player
                    HalloweenDebug.log(2, 'Comparing player IDs:', result.player_id.toString(), 'vs', currentPlayerId);

                    if (result.player_id.toString() !== currentPlayerId) {
                        HalloweenDebug.log(2, 'Player ID mismatch!');
                        errorDiv.textContent = `Error: This API key belongs to ${result.name} [${result.player_id}], but you're enrolled as player ID ${currentPlayerId}. Please use your own API key.`;
                        errorDiv.style.display = 'block';
                        validateBtn.disabled = false;
                        validateBtn.textContent = 'VALIDATE API KEY';
                        return;
                    }

                    HalloweenDebug.log(2, 'Player ID matches! Enabling API mode...');

                    // API key is valid and matches! Enable API mode
                    await APIDefeatVerification.enableAPIMode(apiKey);
                    HalloweenDebug.log(2, 'API mode enabled. Showing time picker...');

                    HalloweenDebug.log(1, `🎃 Switched to API Mode for ${result.name} [${result.player_id}]`);

                    // Show competition time picker
                    this.showCompetitionTimePicker(result.name, result.player_id);
                    HalloweenDebug.log(2, 'Time picker shown');

                } catch (error) {
                    HalloweenDebug.log(2, 'Validation error:', error);
                    errorDiv.textContent = `API Validation Failed: ${error.message}`;
                    errorDiv.style.display = 'block';
                    validateBtn.disabled = false;
                    validateBtn.textContent = 'VALIDATE API KEY';
                }
            });

            // Handle cancel
            cancelBtn.addEventListener('click', () => {
                // Refresh menu to restore original content
                this.updateMenuContent();
            });
        },

        setupResetHandlers: function() {
            const resetTrigger = document.getElementById('reset-script-trigger');
            const resetConfirmation = document.getElementById('reset-confirmation');
            const resetSettingsBtn = document.getElementById('reset-settings');
            const resetAllBtn = document.getElementById('reset-all');
            const cancelReset = document.getElementById('cancel-reset');

            if (resetTrigger && resetConfirmation) {
                resetTrigger.addEventListener('click', () => {
                    resetConfirmation.style.display = resetConfirmation.style.display === 'none' ? 'block' : 'none';
                });
            }

            // COMMENTED OUT: Reset Settings Only (UI preferences can be toggled manually)
            /*
            if (resetSettingsBtn) {
                resetSettingsBtn.addEventListener('click', () => {
                    // Clear UI preferences only
                    GM_deleteValue('halloween_sound_enabled');
                    GM_deleteValue('halloween_background');
                    GM_deleteValue('halloween_menu_position');
                    GM_deleteValue('halloween_ticker_duration');
                    GM_deleteValue('halloween_ticker_frequency');
                    GM_deleteValue('halloween_ticker_color');
                    GM_deleteValue('halloween_announcements');
                    GM_deleteValue('halloween_effect_type');
                    GM_deleteValue('halloween_custom_image_url');
                    GM_deleteValue('halloween_effect_counter');
                    GM_deleteValue('halloween_tile_image');
                    GM_deleteValue('halloween_faction_name');
                    GM_deleteValue('halloween_faction_config');
                    GM_deleteValue('halloween_manual_import_done');

                    HalloweenDebug.log(1, '🎃 Settings cleared - competition data preserved');

                    // Show notification in reset box
                    if (resetConfirmation) {
                        resetConfirmation.innerHTML = `
                            <div style="
                                background: rgba(255, 0, 0, 0.1);
                                border: 1px solid rgba(255, 0, 0, 0.3);
                                border-radius: 4px;
                                padding: 15px;
                                text-align: center;
                            ">
                                <div style="font-size: 12px; font-weight: bold; color: #ffa500; margin-bottom: 6px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">⚙️ SETTINGS RESET</div>
                                <div style="font-size: 11px; color: #fff;">Competition data preserved</div>
                            </div>
                        `;
                    }

                    // Reload the page after notification
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                });
            }
            */

            // Reset Progress (member-safe reset - clears progress but preserves imported config)
            if (resetAllBtn) {
                resetAllBtn.addEventListener('click', () => {
                    HalloweenDebug.log(1, '🗑️ Starting member-safe progress reset...');

                    // Keys to preserve (imported member configuration)
                    const preserveKeys = [
                        'halloween_seed',
                        'halloween_animation_cache',
                        'halloween_enchanted_pages_encrypted',
                        'halloween_bounty_config',
                        'halloween_ticker_duration',
                        'halloween_ticker_frequency',
                        'halloween_ticker_color',
                        'halloween_competition_start_date',
                        'halloween_competition_start_time',
                        'halloween_competition_duration',
                        'halloween_spooky_start_date',
                        'halloween_spooky_start_time',
                        'halloween_spooky_end_date',
                        'halloween_spooky_end_time',
                        'halloween_manual_import_done'
                    ];

                    let gmCount = 0;
                    let lsCount = 0;

                    // Clear GM storage - Dynamic pattern matching (but preserve imported config)
                    const gmKeys = GM_listValues();
                    gmKeys.forEach(key => {
                        if ((key.startsWith('halloween_') || key.startsWith('firebase_') || key.startsWith('phantom_')) &&
                            !preserveKeys.includes(key)) {
                            GM_deleteValue(key);
                            gmCount++;
                            HalloweenDebug.log(2, `🗑️ Cleared GM key: ${key}`);
                        }
                    });

                    // Clear specific member keys and debug key
                    const specificKeys = [
                        'hallo_debug_level',
                        'member_combined_countdown_visible',
                        'member_combined_in_final_6_hours',
                        'member_manifestations_countdown_visible',
                        'member_manifestations_in_final_6_hours',
                        'member_spooky_countdown_visible',
                        'member_spooky_in_final_6_hours'
                    ];
                    specificKeys.forEach(key => {
                        GM_deleteValue(key);
                        gmCount++;
                        HalloweenDebug.log(2, `🗑️ Cleared specific GM key: ${key}`);
                    });

                    // Clear localStorage - Only keys containing 'halloween'
                    const lsKeys = Object.keys(localStorage).filter(k => k.includes('halloween'));
                    lsKeys.forEach(key => {
                        localStorage.removeItem(key);
                        lsCount++;
                        HalloweenDebug.log(2, `🗑️ Cleared localStorage key: ${key}`);
                    });

                    HalloweenDebug.log(1, `✅ Progress reset: Cleared ${gmCount} GM keys and ${lsCount} localStorage keys (config preserved)`);

                    // Show notification in reset box
                    if (resetConfirmation) {
                        resetConfirmation.innerHTML = `
                            <div style="
                                background: rgba(255, 165, 0, 0.1);
                                border: 1px solid rgba(255, 165, 0, 0.3);
                                border-radius: 4px;
                                padding: 15px;
                                text-align: center;
                            ">
                                <div style="font-size: 12px; font-weight: bold; color: #ffa500; margin-bottom: 6px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🔄 PROGRESS RESET</div>
                                <div style="font-size: 11px; color: #fff;">API logs & progress cleared<br>Imported config preserved</div>
                            </div>
                        `;
                    }

                    // Reload the page after notification
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                });
            }

            if (cancelReset && resetConfirmation) {
                cancelReset.addEventListener('click', () => {
                    resetConfirmation.style.display = 'none';
                });
            }
        },

        populateAnnouncementFields: function() {
            const container = document.getElementById('halloween-announcements-list');
            if (!container) return;

            container.innerHTML = '';

            this.halloweenAnnouncements.forEach((announcement, index) => {
                const field = this.createAnnouncementField(announcement, index);
                container.appendChild(field);
            });

            // Update count display
            this.updateAnnouncementCount();
        },

        // Update announcement count feedback display
        updateAnnouncementCount: function() {
            const feedbackDiv = document.getElementById('announcements-count-feedback');
            if (!feedbackDiv) return;

            // Only count non-empty announcements (actually saved)
            const count = this.halloweenAnnouncements.filter(ann => ann.message.trim() !== '').length;

            if (count === 0) {
                feedbackDiv.style.display = 'none';
                return;
            }

            feedbackDiv.style.display = 'block';
            feedbackDiv.innerHTML = `✅ ${count} Announcement${count === 1 ? '' : 's'} Saved`;
        },

        createAnnouncementField: function(announcement, index) {
            const field = document.createElement('div');
            field.style.cssText = 'display: flex; gap: 8px; margin-bottom: 6px; align-items: center;';
            field.setAttribute('data-announcement-index', index);

            field.innerHTML = `
                <input type="text"
                       class="announcement-input"
                       value="${announcement.message}"
                       placeholder="🎃 Enter spooky message..."
                       style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px;">
                <input type="checkbox"
                       class="announcement-checkbox"
                       ${announcement.enabled ? 'checked' : ''}
                       style="transform: scale(1.2); cursor: pointer;">
            `;

            return field;
        },

        attachAnnouncementListeners: function() {
            // Add Message button (regular announcements)
            const addBtn = document.getElementById('add-announcement');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    this.addAnnouncementField();
                });
            }

            // Input and checkbox listeners (delegated to container - regular announcements)
            const container = document.getElementById('halloween-announcements-list');
            if (container) {
                container.addEventListener('input', (e) => {
                    if (e.target.classList.contains('announcement-input')) {
                        this.updateAnnouncement(e.target);
                    }
                });

                container.addEventListener('change', (e) => {
                    if (e.target.classList.contains('announcement-checkbox')) {
                        this.updateAnnouncement(e.target);
                    }
                });
            }

            // Add Message button (date-specific announcements)
            const addDateBtn = document.getElementById('add-date-announcement');
            if (addDateBtn) {
                addDateBtn.addEventListener('click', () => {
                    this.addDateAnnouncementField();
                });
            }

            // Input listeners for date-specific announcements (delegated to container)
            const dateContainer = document.getElementById('halloween-date-announcements-list');
            if (dateContainer) {
                dateContainer.addEventListener('input', (e) => {
                    if (e.target.classList.contains('date-announcement-input') ||
                        e.target.classList.contains('date-announcement-date')) {
                        this.updateDateAnnouncement(e.target);
                    }
                });
            }

            // Ticker timing controls
            const durationInput = document.getElementById('ticker-duration');
            const frequencyInput = document.getElementById('ticker-frequency');
            const colorInput = document.getElementById('ticker-color');

            if (durationInput) {
                durationInput.addEventListener('change', () => {
                    this.saveTickerSettings();
                });
            }

            if (frequencyInput) {
                frequencyInput.addEventListener('change', () => {
                    this.saveTickerSettings();
                });
            }

            if (colorInput) {
                colorInput.addEventListener('change', () => {
                    this.saveTickerSettings();
                });
            }
        },

        addAnnouncementField: function() {
            this.halloweenAnnouncements.push({ message: '', enabled: false });
            this.populateAnnouncementFields();
            this.saveHalloweenAnnouncements();
        },

        updateAnnouncement: function(element) {
            const field = element.closest('[data-announcement-index]');
            if (!field) return;

            const index = parseInt(field.getAttribute('data-announcement-index'));
            const input = field.querySelector('.announcement-input');
            const checkbox = field.querySelector('.announcement-checkbox');

            if (this.halloweenAnnouncements[index]) {
                this.halloweenAnnouncements[index].message = input.value;
                this.halloweenAnnouncements[index].enabled = checkbox.checked;
                this.saveHalloweenAnnouncements();
            }
        },

        cleanupEmptyAnnouncements: function() {
            // Remove empty announcements (no minimum requirement)
            const nonEmpty = this.halloweenAnnouncements.filter(ann => ann.message.trim() !== '');

            this.halloweenAnnouncements = nonEmpty;
            this.saveHalloweenAnnouncements();
            this.populateAnnouncementFields();

            // Also cleanup date-specific announcements (remove empty messages)
            this.cleanupEmptyDateAnnouncements();
        },

        // Date-Specific Announcements Functions
        populateDateAnnouncementFields: function() {
            const container = document.getElementById('halloween-date-announcements-list');
            if (!container) return;

            container.innerHTML = '';

            this.dateAnnouncements.forEach((announcement, index) => {
                const field = this.createDateAnnouncementField(announcement, index);
                container.appendChild(field);
            });
        },

        createDateAnnouncementField: function(announcement, index) {
            const field = document.createElement('div');
            field.style.cssText = 'display: flex; gap: 8px; margin-bottom: 6px; align-items: center;';
            field.setAttribute('data-date-announcement-index', index);

            field.innerHTML = `
                <input type="text"
                       class="date-announcement-input"
                       value="${announcement.message || ''}"
                       placeholder="🎃 Enter date-specific message..."
                       style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px;">
                <input type="text"
                       class="date-announcement-date"
                       value="${announcement.date || ''}"
                       placeholder="dd/mm/yyyy"
                       style="width: 85px; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-cyan); border-radius: 4px; color: #fff; font-size: 10px; text-align: center;">
            `;

            return field;
        },

        addDateAnnouncementField: function() {
            this.dateAnnouncements.push({ message: '', date: '' });
            this.populateDateAnnouncementFields();
            this.saveDateAnnouncements();
        },

        updateDateAnnouncement: function(element) {
            const field = element.closest('[data-date-announcement-index]');
            if (!field) return;

            const index = parseInt(field.getAttribute('data-date-announcement-index'));
            const messageInput = field.querySelector('.date-announcement-input');
            const dateInput = field.querySelector('.date-announcement-date');

            if (this.dateAnnouncements[index]) {
                this.dateAnnouncements[index].message = messageInput.value;
                this.dateAnnouncements[index].date = dateInput.value;
                this.saveDateAnnouncements();
            }
        },

        cleanupEmptyDateAnnouncements: function() {
            // Remove date announcements with empty messages
            this.dateAnnouncements = this.dateAnnouncements.filter(ann => ann.message && ann.message.trim() !== '');
            this.saveDateAnnouncements();
            this.populateDateAnnouncementFields();
        },

        // MANIFESTATIONS (Competition Management) Functions
        initManifestations: function() {
            // Load competition settings
            this.loadCompetitionSettings();

            // Setup event handlers
            this.setupManifestationsHandlers();
            this.setupSpookyHandlers();
            this.setupMemberStatusHandlers();

            // Initialize countdown timer
            this.startCountdownTimer();

            // Update UI with current settings
            this.updateManifestationsUI();

            // Update countdown displays
            this.updateCountdownDisplay();
            this.updateSpookyTargetsCountdown();
            this.updateMemberCountdowns();

            HalloweenDebug.log(2, '🔮 Manifestations system initialized');
        },

        loadCompetitionSettings: function() {
            // Load settings from GM storage with defaults
            this.competitionSettings = {
                active: GM_getValue('halloween_competition_active', false),
                startDate: GM_getValue('halloween_competition_start_date', ''),
                startTime: GM_getValue('halloween_competition_start_time', '18:00'),
                duration: GM_getValue('halloween_competition_duration', 7),
                testingMode: GM_getValue('halloween_testing_mode', 'false') === 'true',
                testingDisplay: (() => { try { return GM_getValue('halloween_testing_display', 'single'); } catch (e) { return 'single'; } })(),
                testingTestPagesOnly: (() => { try { return GM_getValue('halloween_testing_test_pages_only', false); } catch (e) { return false; } })(),
                testingRespawnAllowed: (() => { try { return GM_getValue('halloween_testing_respawn_allowed', true); } catch (e) { return true; } })(),
                collectionsFirebaseURL: FactionConfig.getConfig().collectionsFirebaseURL || '',
                enchantedPages: []
            };

            // Load enchanted pages (leaders from plain storage, members from encrypted)
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const plainPages = GM_getValue('halloween_enchanted_pages', '[]');
                try {
                    this.competitionSettings.enchantedPages = JSON.parse((plainPages && plainPages !== 'undefined') ? plainPages : '[]');
                    HalloweenDebug.log(2, `🔮 Loaded ${this.competitionSettings.enchantedPages.length} enchanted pages (plain)`);
                } catch (e) {
                    HalloweenDebug.log(2, `🔮 Failed to parse enchanted pages: ${e.message}`);
                    this.competitionSettings.enchantedPages = [];
                }
            } else {
                const encryptedPages = GM_getValue('halloween_enchanted_pages_encrypted', '');
                if (encryptedPages && encryptedPages !== 'undefined') {
                    const memberSeed = SeedManager.getSeed('enchanted-pages-load');
                    const decryptResult = StorageCrypto.decryptEnchantedPages(encryptedPages, memberSeed);

                    // Handle async decryption (with retries)
                    if (decryptResult && typeof decryptResult.then === 'function') {
                        decryptResult.then(pages => {
                            if (pages) {
                                this.competitionSettings.enchantedPages = pages;
                                HalloweenDebug.log(2, `🔮 Decrypted ${pages.length} enchanted pages`);
                            } else {
                                this.competitionSettings.enchantedPages = [];
                                this.showDecryptionError();
                            }
                        });
                    } else if (decryptResult) {
                        this.competitionSettings.enchantedPages = decryptResult;
                        HalloweenDebug.log(2, `🔮 Decrypted ${decryptResult.length} enchanted pages`);
                    } else {
                        this.competitionSettings.enchantedPages = [];
                        this.showDecryptionError();
                    }
                }
            }

            // Update HalloweenCompetition settings
            if (typeof HalloweenCompetition !== 'undefined') {
                HalloweenCompetition.TESTING_MODE = this.competitionSettings.testingMode;
                HalloweenCompetition.TESTING_DISPLAY = this.competitionSettings.testingDisplay;
                HalloweenCompetition.USE_TEST_PAGES_ONLY = this.competitionSettings.testingTestPagesOnly;
                // Invalidate page pool cache when settings change
                HalloweenCompetition._cachedPagePool = null;
                HalloweenCompetition._pagePoolCacheKey = null;
                HalloweenDebug.log(2, `🔮 Competition settings loaded - Testing Mode: ${this.competitionSettings.testingMode}, Display: ${this.competitionSettings.testingDisplay}, Test Pages Only: ${this.competitionSettings.testingTestPagesOnly}, Active: ${this.competitionSettings.active}`);
            }
        },

        saveCompetitionSettings: function() {
            // Security: Members cannot enable testing mode (enforced at save level)
            if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                this.competitionSettings.testingMode = false;
            }

            // PDA-safe saves with fallbacks
            GM_setValue('halloween_competition_active', this.competitionSettings.active);
            GM_setValue('halloween_competition_start_date', this.competitionSettings.startDate || '');
            GM_setValue('halloween_competition_start_time', this.competitionSettings.startTime || '18:00');
            GM_setValue('halloween_competition_duration', this.competitionSettings.duration || 7);
            GM_setValue('halloween_testing_mode', (this.competitionSettings.testingMode || false).toString());
            GM_setValue('halloween_testing_display', this.competitionSettings.testingDisplay || 'single');
            GM_setValue('halloween_testing_test_pages_only', this.competitionSettings.testingTestPagesOnly || false);
            GM_setValue('halloween_testing_respawn_allowed', this.competitionSettings.testingRespawnAllowed !== false);
            FactionConfig.setConfig({ collectionsFirebaseURL: this.competitionSettings.collectionsFirebaseURL });

            // Save enchanted pages
            if (this.competitionSettings.enchantedPages) {
                if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                    GM_setValue('halloween_enchanted_pages', JSON.stringify(this.competitionSettings.enchantedPages));
                } else {
                    HalloweenDebug.log(2, `🔮 Member mode: enchanted pages not saved to plain storage`);
                }
            }

            // Update HalloweenCompetition settings
            if (typeof HalloweenCompetition !== 'undefined') {
                HalloweenCompetition.TESTING_MODE = this.competitionSettings.testingMode;
                HalloweenCompetition.TESTING_DISPLAY = this.competitionSettings.testingDisplay;
                HalloweenCompetition.USE_TEST_PAGES_ONLY = this.competitionSettings.testingTestPagesOnly;
                // Invalidate page pool cache when settings change
                HalloweenCompetition._cachedPagePool = null;
                HalloweenCompetition._pagePoolCacheKey = null;
            }

            HalloweenDebug.log(3, '🔮 Competition settings saved');
        },

        setupManifestationsHandlers: function() {
            // Competition Active Toggle
            const competitionToggle = document.getElementById('competition-active-toggle');
            if (competitionToggle) {
                competitionToggle.addEventListener('change', () => {
                    this.competitionSettings.active = competitionToggle.checked;
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Competition Start Date
            const startDateInput = document.getElementById('competition-start-date');
            if (startDateInput) {
                startDateInput.addEventListener('change', () => {
                    this.competitionSettings.startDate = startDateInput.value;
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Competition Start Time
            const startTimeInput = document.getElementById('competition-start-time');
            if (startTimeInput) {
                startTimeInput.addEventListener('change', () => {
                    this.competitionSettings.startTime = startTimeInput.value;
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Competition Duration
            const durationSelect = document.getElementById('competition-duration');
            if (durationSelect) {
                durationSelect.addEventListener('change', () => {
                    this.competitionSettings.duration = parseInt(durationSelect.value);
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Testing Mode Toggle
            const testingToggle = document.getElementById('testing-mode-toggle');
            if (testingToggle) {
                testingToggle.addEventListener('change', () => {
                    this.competitionSettings.testingMode = testingToggle.checked;

                    // When enabling testing mode, keep the saved testingDisplay setting
                    // (Don't override - respect user's previous choice)

                    this.saveCompetitionSettings();
                    this.updateManifestationsUI();
                    this.updateCountdownDisplay();
                    this.toggleTestingDisplayVisibility();

                    // Refresh spawns to show/hide pumpkins based on testing mode
                    if (typeof HalloweenCompetition !== 'undefined' && HalloweenCompetition.refreshSpawns) {
                        HalloweenCompetition.refreshSpawns();
                    }

                    HalloweenDebug.log(2, `🔮 Testing mode toggled: ${testingToggle.checked}`);
                });
            }

            // Testing Display Mode Radio Buttons
            const testingDisplayRadios = document.querySelectorAll('input[name="testing-display"]');
            testingDisplayRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        this.competitionSettings.testingDisplay = radio.value;
                        this.saveCompetitionSettings();
                        // Refresh spawns with new display mode
                        if (typeof HalloweenCompetition !== 'undefined' && HalloweenCompetition.refreshSpawns) {
                            HalloweenCompetition.refreshSpawns();
                        }
                        HalloweenDebug.log(2, `🔮 Testing display mode changed to: ${radio.value}`);
                    }
                });
            });

            // Testing Test Pages Only Toggle
            const testPagesOnlyToggle = document.getElementById('testing-test-pages-only');
            if (testPagesOnlyToggle) {
                testPagesOnlyToggle.addEventListener('change', () => {
                    this.competitionSettings.testingTestPagesOnly = testPagesOnlyToggle.checked;
                    this.saveCompetitionSettings();
                    // Update HalloweenCompetition setting
                    if (typeof HalloweenCompetition !== 'undefined') {
                        HalloweenCompetition.USE_TEST_PAGES_ONLY = testPagesOnlyToggle.checked;
                        // Invalidate page pool cache when settings change
                        HalloweenCompetition._cachedPagePool = null;
                        HalloweenCompetition._pagePoolCacheKey = null;
                        // Regenerate schedule with new page pool
                        if (HalloweenCompetition.TESTING_MODE) {
                            HalloweenCompetition.generateSpawnSchedule();
                            HalloweenCompetition.refreshSpawns();
                        }
                    }
                    HalloweenDebug.log(2, `🔮 Testing test pages only: ${testPagesOnlyToggle.checked}`);
                });
            }

            // Testing Respawn Allowed Toggle
            const respawnToggle = document.getElementById('testing-respawn-allowed');
            if (respawnToggle) {
                respawnToggle.addEventListener('change', () => {
                    this.competitionSettings.testingRespawnAllowed = respawnToggle.checked;
                    this.saveCompetitionSettings();
                    HalloweenDebug.log(2, `🔮 Testing respawn allowed: ${respawnToggle.checked}`);
                });
            }

            // Collections Firebase URL
            const collectionsURLInput = document.getElementById('collections-firebase-url');
            if (collectionsURLInput) {
                collectionsURLInput.addEventListener('blur', () => {
                    let collectionsURL = collectionsURLInput.value.trim();

                    // Remove trailing slash if present
                    if (collectionsURL.endsWith('/')) {
                        collectionsURL = collectionsURL.slice(0, -1);
                        collectionsURLInput.value = collectionsURL; // Update field display
                    }

                    this.competitionSettings.collectionsFirebaseURL = collectionsURL;
                    this.saveCompetitionSettings();
                    HalloweenDebug.log(2, `🎃 Collections Firebase URL saved: ${collectionsURL}`);
                });
            }

            // Enchanted pages listeners are now handled by reattachManifestationsListeners()
            // (called every time menu opens to handle DOM rebuild)
        },

        renderEnchantedPages: function() {
            const rowsContainer = document.getElementById('enchanted-pages-rows');
            if (!rowsContainer) return;

            // Clear existing rows
            rowsContainer.innerHTML = '';

            // Initialize array if doesn't exist
            if (!this.competitionSettings.enchantedPages) {
                this.competitionSettings.enchantedPages = [];
            }

            // Render each saved page
            this.competitionSettings.enchantedPages.forEach((page, index) => {
                const row = this.renderEnchantedPageRow(page, index);
                rowsContainer.appendChild(row);
            });

            HalloweenDebug.log(2, `🔮 Rendered ${this.competitionSettings.enchantedPages.length} enchanted page rows`);
        },

        renderEnchantedPageRow: function(pageData, index) {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';

            // URL input
            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.value = pageData.url || '';
            urlInput.placeholder = 'Enter page URL...';
            urlInput.style.cssText = 'flex: 1; min-width: 0; padding: 6px 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(139, 0, 139, 0.5); border-radius: 4px; color: #fff; font-size: 11px; direction: rtl;';

            // Auto-save on blur
            urlInput.addEventListener('blur', () => {
                this.competitionSettings.enchantedPages[index].url = urlInput.value.trim();
                this.saveCompetitionSettings();
                HalloweenDebug.log(2, `🔮 Saved enchanted page URL [${index}]: ${urlInput.value.trim()}`);

                // Regenerate spawn schedule with updated URL
                if (typeof HalloweenCompetition !== 'undefined' && this.competitionSettings.enchantedPages.length > 0) {
                    GM_deleteValue('halloween_spawn_schedule_encrypted');
                    HalloweenCompetition.generateSpawnSchedule();
                    HalloweenCompetition.refreshSpawns();
                    HalloweenDebug.log(2, '🔮 Spawn schedule regenerated after URL change');
                }
            });

            // Match type dropdown
            const matchTypeSelect = document.createElement('select');
            matchTypeSelect.style.cssText = 'padding: 6px; margin-right: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(139, 0, 139, 0.5); border-radius: 4px; color: #fff; font-size: 11px; cursor: pointer;';

            const matchTypes = [
                { value: 'exact', label: 'Exact' },
                { value: 'contains', label: 'Contains' },
                { value: 'hashFlexible', label: 'Incl #' }
            ];

            matchTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.value;
                option.textContent = type.label;
                if (pageData.matchType === type.value) {
                    option.selected = true;
                }
                matchTypeSelect.appendChild(option);
            });

            // Auto-save on change
            matchTypeSelect.addEventListener('change', () => {
                this.competitionSettings.enchantedPages[index].matchType = matchTypeSelect.value;
                this.saveCompetitionSettings();
                HalloweenDebug.log(2, `🔮 Saved enchanted page match type [${index}]: ${matchTypeSelect.value}`);

                // Regenerate spawn schedule with updated match type
                if (typeof HalloweenCompetition !== 'undefined' && this.competitionSettings.enchantedPages.length > 0) {
                    GM_deleteValue('halloween_spawn_schedule_encrypted');
                    HalloweenCompetition.generateSpawnSchedule();
                    HalloweenCompetition.refreshSpawns();
                    HalloweenDebug.log(2, '🔮 Spawn schedule regenerated after match type change');
                }
            });

            row.appendChild(urlInput);
            row.appendChild(matchTypeSelect);

            return row;
        },

        cleanupEnchantedPages: function() {
            if (!this.competitionSettings.enchantedPages) return;

            const beforeCount = this.competitionSettings.enchantedPages.length;
            this.competitionSettings.enchantedPages = this.competitionSettings.enchantedPages.filter(page => {
                return page.url && page.url.trim() !== '';
            });
            const afterCount = this.competitionSettings.enchantedPages.length;

            if (beforeCount !== afterCount) {
                this.saveCompetitionSettings();
                HalloweenDebug.log(2, `🔮 Cleaned up ${beforeCount - afterCount} empty enchanted page rows`);
            }

            // Regenerate spawn schedule after cleanup if pages changed
            if (typeof HalloweenCompetition !== 'undefined' && this.competitionSettings.enchantedPages.length > 0) {
                GM_deleteValue('halloween_spawn_schedule_encrypted');
                HalloweenCompetition.generateSpawnSchedule();
                HalloweenCompetition.refreshSpawns();
                HalloweenDebug.log(2, '🔮 Spawn schedule regenerated with updated enchanted pages');
            }
        },

        reattachManifestationsListeners: function() {
            // Reattach manifestations listeners after menu rebuild
            // (DOM elements are destroyed/recreated, so listeners need to be reattached)

            // Collections Firebase URL Toggle
            const showCollectionsFirebaseLink = document.getElementById('show-collections-firebase-link');
            const collectionsFirebaseSection = document.getElementById('collections-firebase-section');
            if (showCollectionsFirebaseLink && collectionsFirebaseSection) {
                showCollectionsFirebaseLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = collectionsFirebaseSection.style.display === 'none';

                    if (isHidden) {
                        collectionsFirebaseSection.style.display = 'block';
                        showCollectionsFirebaseLink.textContent = 'Hide Collections Firebase URL';
                    } else {
                        collectionsFirebaseSection.style.display = 'none';
                        showCollectionsFirebaseLink.textContent = 'Show Collections Firebase URL';
                    }

                    HalloweenDebug.log(2, `🔮 Collections Firebase section ${isHidden ? 'shown' : 'hidden'}`);
                });
            }

            // Enchanted Pages Toggle
            const showEnchantedPagesLink = document.getElementById('show-enchanted-pages-link');
            const enchantedPagesSection = document.getElementById('enchanted-pages-section');
            if (showEnchantedPagesLink && enchantedPagesSection) {
                showEnchantedPagesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = enchantedPagesSection.style.display === 'none';

                    if (isHidden) {
                        enchantedPagesSection.style.display = 'block';
                        showEnchantedPagesLink.textContent = 'Hide Enchanted Pages';
                        this.renderEnchantedPages();
                    } else {
                        this.cleanupEnchantedPages();
                        enchantedPagesSection.style.display = 'none';
                        showEnchantedPagesLink.textContent = 'Show Enchanted Pages';
                    }

                    HalloweenDebug.log(2, `🔮 Enchanted pages section ${isHidden ? 'shown' : 'hidden'}`);
                });
            }

            const addEnchantedPageBtn = document.getElementById('add-enchanted-page');
            if (addEnchantedPageBtn) {
                addEnchantedPageBtn.addEventListener('click', () => {
                    if (!this.competitionSettings.enchantedPages) {
                        this.competitionSettings.enchantedPages = [];
                    }
                    this.competitionSettings.enchantedPages.push({ url: '', matchType: 'exact' });
                    this.renderEnchantedPages();
                    HalloweenDebug.log(2, `🔮 Added new enchanted page row`);
                });
            }

            // Excluded Player IDs Toggle
            const showExcludedIdsLink = document.getElementById('show-excluded-ids-link');
            const excludedIdsSection = document.getElementById('excluded-ids-section');
            if (showExcludedIdsLink && excludedIdsSection) {
                showExcludedIdsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = excludedIdsSection.style.display === 'none';

                    if (isHidden) {
                        excludedIdsSection.style.display = 'block';
                        showExcludedIdsLink.textContent = 'Hide Excluded Player IDs';
                        this.populateExcludedIds();
                    } else {
                        excludedIdsSection.style.display = 'none';
                        showExcludedIdsLink.textContent = 'Show Excluded Player IDs';
                    }

                    HalloweenDebug.log(2, `🚫 Excluded IDs section ${isHidden ? 'shown' : 'hidden'}`);
                });
            }

            // Excluded IDs Textarea Blur (auto-save and validate)
            const excludedIdsTextarea = document.getElementById('excluded-ids-textarea');
            if (excludedIdsTextarea) {
                excludedIdsTextarea.addEventListener('blur', () => {
                    const validation = SeedManager.validateAndCleanExclusionList(excludedIdsTextarea.value);

                    // Save clean CSV to storage
                    GM_setValue('halloween_excluded_ids', validation.cleanedCSV);

                    // Reload in-memory Set
                    SeedManager.loadExclusionList();

                    // Update validation feedback
                    this.updateExclusionValidationFeedback(validation);

                    HalloweenDebug.log(1, `🚫 Saved ${validation.validCount} excluded player IDs`);
                });
            }

            HalloweenDebug.log(2, '🔮 Manifestations listeners reattached');
        },

        // Populate excluded IDs textarea from storage
        populateExcludedIds: function() {
            const textarea = document.getElementById('excluded-ids-textarea');
            if (textarea) {
                const storedIds = GM_getValue('halloween_excluded_ids', '');
                textarea.value = storedIds;

                // Show initial validation if there's data
                if (storedIds) {
                    const validation = SeedManager.validateAndCleanExclusionList(storedIds);
                    this.updateExclusionValidationFeedback(validation);
                }
            }
        },

        // Update validation feedback div
        updateExclusionValidationFeedback: function(validation) {
            const feedbackDiv = document.getElementById('exclusion-validation-feedback');
            if (!feedbackDiv) return;

            if (validation.validCount === 0 && validation.invalidCount === 0) {
                feedbackDiv.style.display = 'none';
                return;
            }

            feedbackDiv.style.display = 'block';

            let html = '';
            let bgColor = '';

            if (validation.invalidCount === 0) {
                // All valid
                html = `✅ ${validation.validCount} valid ID${validation.validCount === 1 ? '' : 's'}`;
                bgColor = 'rgba(0, 255, 0, 0.1)';
                feedbackDiv.style.border = '1px solid rgba(0, 255, 0, 0.3)';
                feedbackDiv.style.color = '#90EE90';
            } else {
                // Some invalid
                const invalidList = validation.invalid.slice(0, 5).map(id => `'${id}'`).join(', ');
                const moreText = validation.invalid.length > 5 ? ` (+${validation.invalid.length - 5} more)` : '';
                html = `⚠️ ${validation.validCount} valid, ${validation.invalidCount} invalid (ignored): ${invalidList}${moreText}`;
                bgColor = 'rgba(255, 165, 0, 0.1)';
                feedbackDiv.style.border = '1px solid rgba(255, 165, 0, 0.3)';
                feedbackDiv.style.color = '#FFA500';
            }

            feedbackDiv.style.backgroundColor = bgColor;
            feedbackDiv.innerHTML = html;
        },

        setupSpookyHandlers: function() {
            // Spooky Targets Active Toggle
            const spookyToggle = document.getElementById('spooky-targets-active-toggle');
            const spookyStatus = document.getElementById('spooky-targets-active-status');
            if (spookyToggle && spookyStatus) {
                // Load saved state
                const savedActive = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';
                spookyToggle.checked = savedActive;
                spookyStatus.textContent = savedActive ? 'ON' : 'OFF';
                spookyStatus.style.color = savedActive ? 'var(--carved-cyan)' : '#ff4444';

                // Toggle event handler
                spookyToggle.addEventListener('change', () => {
                    const isActive = spookyToggle.checked;
                    GM_setValue('halloween_spooky_targets_active', isActive.toString());
                    spookyStatus.textContent = isActive ? 'ON' : 'OFF';
                    spookyStatus.style.color = isActive ? 'var(--carved-cyan)' : '#ff4444';

                    // Update cached state in HalloweenTargets
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    // Update countdown display
                    this.updateSpookyTargetsCountdown();

                    HalloweenDebug.log(1, `🎃 Spooky Targets ${isActive ? 'enabled' : 'disabled'}`);
                });
            }

            // Spooky Testing Mode Toggle
            const spookyTestingToggle = document.getElementById('spooky-testing-mode-toggle');
            const spookyTestingStatus = document.getElementById('spooky-testing-mode-status');
            if (spookyTestingToggle && spookyTestingStatus) {
                // Load saved state
                const savedTesting = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
                spookyTestingToggle.checked = savedTesting;
                spookyTestingStatus.textContent = savedTesting ? 'ON' : 'OFF';
                spookyTestingStatus.style.color = savedTesting ? 'var(--carved-cyan)' : 'var(--carved-orange)';

                // Toggle event handler
                spookyTestingToggle.addEventListener('change', () => {
                    const isActive = spookyTestingToggle.checked;
                    GM_setValue('halloween_spooky_testing_mode', isActive.toString());
                    spookyTestingStatus.textContent = isActive ? 'ON' : 'OFF';
                    spookyTestingStatus.style.color = isActive ? 'var(--carved-cyan)' : 'var(--carved-orange)';

                    // Update cached state in HalloweenTargets
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    // Update countdown display
                    this.updateSpookyTargetsCountdown();

                    HalloweenDebug.log(1, `🎃 Spooky Targets Testing Mode ${isActive ? 'enabled (overriding dates)' : 'disabled'}`);
                });
            }

            // Date/Time Inputs Auto-save
            const startDateInput = document.getElementById('spooky-start-date');
            const startTimeInput = document.getElementById('spooky-start-time');
            const endDateInput = document.getElementById('spooky-end-date');
            const endTimeInput = document.getElementById('spooky-end-time');

            const saveSpookyDates = () => {
                if (!startDateInput || !startTimeInput || !endDateInput || !endTimeInput) return;

                const startDate = startDateInput.value;
                const startTime = startTimeInput.value;
                const endDate = endDateInput.value;
                const endTime = endTimeInput.value;

                // Only save if all fields have values
                if (!startDate || !startTime || !endDate || !endTime) return;

                // Validate dates
                const startDateTime = new Date(`${startDate}T${startTime}`);
                const endDateTime = new Date(`${endDate}T${endTime}`);

                // Check if dates are valid
                if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                    // Invalid date format - silently return (user might still be typing)
                    return;
                }

                if (startDateTime >= endDateTime) {
                    alert('End date/time must be after start date/time');
                    return;
                }

                // Save dates and times
                GM_setValue('halloween_spooky_start_date', startDate);
                GM_setValue('halloween_spooky_start_time', startTime);
                GM_setValue('halloween_spooky_end_date', endDate);
                GM_setValue('halloween_spooky_end_time', endTime);

                HalloweenDebug.log(1, `🎃 Spooky Targets schedule saved: ${startDate} ${startTime} to ${endDate} ${endTime}`);

                // Update countdown display
                this.updateSpookyTargetsCountdown();
            };

            if (startDateInput) {
                startDateInput.addEventListener('blur', () => saveSpookyDates());
            }
            if (startTimeInput) {
                startTimeInput.addEventListener('blur', () => saveSpookyDates());
            }
            if (endDateInput) {
                endDateInput.addEventListener('blur', () => saveSpookyDates());
            }
            if (endTimeInput) {
                endTimeInput.addEventListener('blur', () => saveSpookyDates());
            }

            // Preview notification link
            const previewLink = document.getElementById('preview-spooky-end-notification');
            if (previewLink) {
                previewLink.addEventListener('click', () => {
                    this.previewSpookyTargetsEndNotification();
                });
            }
        },

        updateManifestationsUI: function() {
            // Update toggle states
            const competitionToggle = document.getElementById('competition-active-toggle');
            const competitionStatus = document.getElementById('competition-active-status');
            if (competitionToggle && competitionStatus) {
                competitionToggle.checked = this.competitionSettings.active;
                competitionStatus.textContent = this.competitionSettings.active ? 'ON' : 'OFF';
                competitionStatus.style.color = this.competitionSettings.active ? 'var(--carved-cyan)' : '#ff4444';
            }

            // Update date/time inputs
            const startDateInput = document.getElementById('competition-start-date');
            const startTimeInput = document.getElementById('competition-start-time');
            if (startDateInput) startDateInput.value = this.competitionSettings.startDate;
            if (startTimeInput) startTimeInput.value = this.competitionSettings.startTime;

            // Update duration select
            const durationSelect = document.getElementById('competition-duration');
            if (durationSelect) durationSelect.value = this.competitionSettings.duration;

            // Update testing mode
            const testingToggle = document.getElementById('testing-mode-toggle');
            const testingStatus = document.getElementById('testing-mode-status');
            if (testingToggle && testingStatus) {
                testingToggle.checked = this.competitionSettings.testingMode;
                testingStatus.textContent = this.competitionSettings.testingMode ? 'ON' : 'OFF';
                testingStatus.style.color = this.competitionSettings.testingMode ? 'var(--carved-cyan)' : '#ff4444';
            }

            // Update Collections Firebase URL input
            const collectionsURLInput = document.getElementById('collections-firebase-url');
            if (collectionsURLInput) collectionsURLInput.value = this.competitionSettings.collectionsFirebaseURL;

            // Update testing display radio buttons
            const testingDisplayRadios = document.querySelectorAll('input[name="testing-display"]');
            testingDisplayRadios.forEach(radio => {
                radio.checked = radio.value === this.competitionSettings.testingDisplay;
            });

            // Update test pages only toggle
            const testPagesOnlyToggle = document.getElementById('testing-test-pages-only');
            if (testPagesOnlyToggle) {
                testPagesOnlyToggle.checked = this.competitionSettings.testingTestPagesOnly || false;
            }

            // Update respawn allowed toggle
            const respawnToggle = document.getElementById('testing-respawn-allowed');
            if (respawnToggle) {
                // Default to true if not set
                respawnToggle.checked = this.competitionSettings.testingRespawnAllowed ?? true;
            }

            // Update testing display visibility
            this.toggleTestingDisplayVisibility();

            // Update countdown display
            this.updateCountdownDisplay();
        },

        toggleTestingDisplayVisibility: function() {
            const testingDisplaySection = document.getElementById('testing-display-mode');
            if (testingDisplaySection) {
                const shouldShow = this.competitionSettings.testingMode;
                testingDisplaySection.style.display = shouldShow ? 'block' : 'none';
                HalloweenDebug.log(2, `🔮 Testing display visibility: ${shouldShow ? 'SHOWN' : 'HIDDEN'} (testingMode: ${this.competitionSettings.testingMode})`);
            } else {
                HalloweenDebug.log(3, `❌ Testing display section not found in DOM (${SeedManager.isLeaderMode ? 'leader' : 'member'} mode)`);
            }
        },

        startCountdownTimer: function() {
            // Initial update
            this.updateCountdownDisplay();
            this.updateSpookyTargetsCountdown();
            this.updateMemberCountdowns();

            // Start timer with smart refresh intervals
            this.countdownInterval = setInterval(() => {
                this.updateCountdownDisplay();
                this.updateSpookyTargetsCountdown();
                this.updateMemberCountdowns();
            }, this.getCountdownRefreshInterval());

            HalloweenDebug.log(3, '🔮 Countdown timer started');
        },

        // Stop countdown interval
        stopCountdown: function() {
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
                HalloweenDebug.log(2, '⏹️ Stopped countdown interval');
            }
        },

        getCountdownRefreshInterval: function() {
            if (this.competitionSettings.testingMode) {
                return 60000; // 1 minute in testing mode
            }

            const now = new Date();
            const timeRemaining = this.getTimeUntilStateChange();

            if (!timeRemaining || timeRemaining <= 0) {
                return 60000; // 1 minute for completed competitions
            }

            // Smart intervals based on time remaining
            if (timeRemaining < 60 * 1000) { // < 1 minute
                return 5000; // 5 seconds
            } else if (timeRemaining < 60 * 60 * 1000) { // < 1 hour
                return 60000; // 1 minute
            } else if (timeRemaining < 24 * 60 * 60 * 1000) { // < 24 hours
                return 10 * 60 * 1000; // 10 minutes
            } else {
                return 30 * 60 * 1000; // 30 minutes
            }
        },

        updateCountdownDisplay: function() {
            const countdownElement = document.getElementById('competition-countdown');
            if (!countdownElement) return;

            // Show testing mode indicator if active
            if (this.competitionSettings.testingMode) {
                countdownElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                countdownElement.style.color = '#00ff00';
                return;
            }

            // Check if competition is disabled
            if (!this.competitionSettings.active) {
                countdownElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🚫</span> Collectibles Disabled';
                countdownElement.style.color = '#ff4444';
                return;
            }

            const competitionState = this.getCompetitionState();
            let displayText = '';
            let color = 'var(--carved-cyan)';

            switch (competitionState.status) {
                case 'pending':
                    const timeUntilStart = this.formatTimeRemaining(competitionState.timeUntilStart);
                    displayText = `<span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">⏳</span> Starts in ${timeUntilStart}`;
                    color = 'var(--carved-magenta)';
                    break;

                case 'active':
                    const timeUntilEnd = this.formatTimeRemaining(competitionState.timeUntilEnd);
                    displayText = `Day ${competitionState.currentDay} of ${this.competitionSettings.duration} - ${timeUntilEnd} remaining`;
                    color = 'var(--carved-cyan)';
                    break;

                case 'completed':
                    displayText = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competition Ended';
                    color = '#888';
                    break;

                default:
                    displayText = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">⚙️</span> Awaiting Configuration';
                    color = '#888';
                    break;
            }

            countdownElement.innerHTML = displayText;
            countdownElement.style.color = color;
        },

        getCompetitionState: function() {
            if (!this.competitionSettings.startDate) {
                HalloweenDebug.log(2, '🔮 Competition state: unconfigured (no start date)');
                return { status: 'unconfigured' };
            }

            const now = new Date();
            const startDateTime = new Date(`${this.competitionSettings.startDate}T${this.competitionSettings.startTime}:00.000Z`);
            const durationMs = this.competitionSettings.duration * 24 * 60 * 60 * 1000;
            const endDateTime = new Date(startDateTime.getTime() + durationMs);

            if (now < startDateTime) {
                return {
                    status: 'pending',
                    timeUntilStart: startDateTime.getTime() - now.getTime()
                };
            } else if (now <= endDateTime) {
                const timeElapsed = now.getTime() - startDateTime.getTime();
                const currentDay = Math.floor(timeElapsed / (24 * 60 * 60 * 1000)) + 1;

                // Block-based system: 12-hour blocks from competition start
                const hoursElapsed = timeElapsed / (60 * 60 * 1000);
                const currentBlock = Math.floor(hoursElapsed / 12) + 1;
                const maxBlocks = this.competitionSettings.duration * 2; // 2 blocks per day

                return {
                    status: 'active',
                    currentDay: Math.min(currentDay, this.competitionSettings.duration),
                    currentBlock: Math.min(currentBlock, maxBlocks),
                    timeUntilEnd: endDateTime.getTime() - now.getTime()
                };
            } else {
                return { status: 'completed' };
            }
        },

        getTimeUntilStateChange: function() {
            const state = this.getCompetitionState();
            switch (state.status) {
                case 'pending':
                    return state.timeUntilStart;
                case 'active':
                    return state.timeUntilEnd;
                default:
                    return null;
            }
        },

        previewSpookyTargetsEndNotification: function() {
            // Show notification in preview mode (doesn't mark as shown, doesn't disable anything)
            // DISABLED: Purple popup panel preview
            // HalloweenCompetition.showSpookyTargetsEndNotification(true);
            HalloweenDebug.log(2, '🎃 Spooky Targets end notification preview disabled');
        },

        getSpookyTargetsState: function() {
            // Check if start date is configured
            const startDate = GM_getValue('halloween_spooky_start_date', '');
            if (!startDate) {
                HalloweenDebug.log(2, '🔮 Spooky targets state: unconfigured (no start date)');
                return { status: 'unconfigured' };
            }

            const startTime = GM_getValue('halloween_spooky_start_time', '00:00');
            const endDate = GM_getValue('halloween_spooky_end_date', '');
            const endTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!endDate) {
                HalloweenDebug.log(2, '🔮 Spooky targets state: unconfigured (no end date)');
                return { status: 'unconfigured' };
            }

            const now = new Date();
            const startDateTime = new Date(`${startDate}T${startTime}:00.000Z`);
            const endDateTime = new Date(`${endDate}T${endTime}:00.000Z`);

            if (now < startDateTime) {
                return {
                    status: 'pending',
                    timeUntilStart: startDateTime.getTime() - now.getTime()
                };
            } else if (now <= endDateTime) {
                return {
                    status: 'active',
                    timeUntilEnd: endDateTime.getTime() - now.getTime()
                };
            } else {
                return { status: 'completed' };
            }
        },

        updateSpookyTargetsCountdown: function() {
            const countdownElement = document.getElementById('spooky-targets-countdown');
            if (!countdownElement) return;

            // Show testing mode indicator if active
            const testingMode = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
            if (testingMode) {
                countdownElement.innerHTML = '🧪 TESTING MODE ACTIVE';
                countdownElement.style.color = '#00ff00';
                return;
            }

            // Check if spooky targets is disabled
            const active = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';
            if (!active) {
                countdownElement.innerHTML = '🚫 Spooky Targets Disabled';
                countdownElement.style.color = '#ff4444';
                return;
            }

            const spookyState = this.getSpookyTargetsState();
            let displayText = '';
            let color = 'var(--carved-cyan)';

            switch (spookyState.status) {
                case 'pending':
                    const timeUntilStart = this.formatTimeRemaining(spookyState.timeUntilStart);
                    displayText = `⏳ Starts in ${timeUntilStart}`;
                    color = 'var(--carved-magenta)';
                    break;

                case 'active':
                    const timeUntilEnd = this.formatTimeRemaining(spookyState.timeUntilEnd);
                    displayText = `Active - ${timeUntilEnd} remaining`;
                    color = 'var(--carved-cyan)';
                    break;

                case 'completed':
                    displayText = '🏁 Spooky Targets Ended';
                    color = '#888';
                    break;

                default:
                    displayText = '⚙️ Awaiting Configuration';
                    color = '#888';
                    break;
            }

            countdownElement.textContent = displayText;
            countdownElement.style.color = color;
        },

        formatTimeRemaining: function(milliseconds) {
            if (milliseconds <= 0) return '0 seconds';

            const totalSeconds = Math.floor(milliseconds / 1000);
            const days = Math.floor(totalSeconds / (24 * 60 * 60));
            const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = totalSeconds % 60;

            if (days > 0) {
                return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
            } else if (hours > 0) {
                return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else if (minutes > 0) {
                return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
                return `${seconds} second${seconds !== 1 ? 's' : ''}`;
            }
        },

        // ========================================================================
        // MEMBER PANEL COUNTDOWN FUNCTIONS
        // ========================================================================

        determineMemberCountdownMode: function() {
            // Determine if we should show combined or individual countdowns
            // Combined mode: Both competitions active AND end times match
            // Individual mode: Everything else

            const spookyState = this.getSpookyTargetsState();
            const manifestationsState = this.getCompetitionState();

            // Get timestamps for both competitions
            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');
            const manifestationsStartDate = this.competitionSettings.startDate;
            const manifestationsStartTime = this.competitionSettings.startTime;
            const manifestationsDuration = this.competitionSettings.duration;

            // Validate we have necessary data
            if (!spookyEndDate || !manifestationsStartDate) {
                return 'individual'; // One or both not configured
            }

            const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}:00.000Z`).getTime();
            const manifestationsStart = new Date(`${manifestationsStartDate}T${manifestationsStartTime}:00.000Z`).getTime();
            const manifestationsEnd = manifestationsStart + (manifestationsDuration * 24 * 60 * 60 * 1000);

            // Check if end times match
            const endsMatch = (spookyEnd === manifestationsEnd);

            // Check if both are active
            const bothActive = (spookyState.status === 'active' && manifestationsState.status === 'active');

            // Combined mode: both active AND ends match (starts don't matter)
            if (bothActive && endsMatch) {
                HalloweenDebug.log(2, '🎯 Member countdown mode: COMBINED (both active, ends match)');
                return 'combined';
            }

            HalloweenDebug.log(2, '🎯 Member countdown mode: INDIVIDUAL');
            return 'individual';
        },

        updateMemberCountdowns: function() {
            // Main orchestrator for member panel countdowns
            HalloweenDebug.log(1, '🎯 updateMemberCountdowns() called');

            const mode = this.determineMemberCountdownMode();
            HalloweenDebug.log(1, `🎯 Countdown mode: ${mode}`);

            const combinedContainer = document.getElementById('member-combined-countdown-container');
            const combinedLink = document.getElementById('member-combined-status-link');
            const spookyLink = document.getElementById('member-spooky-status-link');
            const spookyCountdown = document.getElementById('member-spooky-countdown');
            const manifestationsLink = document.getElementById('member-manifestations-status-link');
            const manifestationsCountdown = document.getElementById('member-manifestations-countdown');

            HalloweenDebug.log(1, `🎯 Elements found - Combined: ${!!combinedContainer}, Spooky: ${!!spookyLink}, Manifestations: ${!!manifestationsLink}`);

            if (mode === 'combined') {
                // Show combined, hide individuals
                if (combinedContainer) combinedContainer.style.display = 'block';
                if (combinedLink) combinedLink.style.display = 'inline';
                if (spookyLink) spookyLink.style.display = 'none';
                if (spookyCountdown) spookyCountdown.style.display = 'none';
                if (manifestationsLink) manifestationsLink.style.display = 'none';
                if (manifestationsCountdown) manifestationsCountdown.style.display = 'none';

                // Update combined countdown
                this.updateMemberCombinedStatus();
            } else {
                // Hide combined, show individuals
                if (combinedContainer) combinedContainer.style.display = 'none';
                if (combinedLink) combinedLink.style.display = 'none';
                if (spookyLink) spookyLink.style.display = 'inline';
                if (manifestationsLink) manifestationsLink.style.display = 'inline';

                // Update individual countdowns
                this.updateMemberSpookyStatus();
                this.updateMemberManifestationsStatus();
            }
        },

        updateMemberCombinedStatus: function() {
            const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

            const countdownText = document.getElementById('member-combined-countdown-text');
            const statusLink = document.getElementById('member-combined-status-link');
            const container = document.getElementById('member-combined-countdown-container');

            if (!countdownText || !statusLink || !container) {
                return;
            }

            // Get both states (we know both are active if we're in combined mode)
            const spookyState = this.getSpookyTargetsState();
            const manifestationsState = this.getCompetitionState();

            // If either is not active, we shouldn't be in combined mode - bail out
            if (spookyState.status !== 'active' && spookyState.status !== 'completed') {
                return; // Spooky is pending or unconfigured
            }
            if (manifestationsState.status !== 'active' && manifestationsState.status !== 'completed') {
                return; // Manifestations is pending or unconfigured
            }

            // Use spooky state (since ends match, doesn't matter which we use for countdown)
            const state = spookyState;

            // Get user preference
            const visible = GM_getValue('member_combined_countdown_visible', false);

            // Determine state and behavior
            if (state.status === 'completed') {
                // STATE 3: Competition ended
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competitions Ended';
                container.style.display = 'block';
                statusLink.style.display = 'none'; // Remove link
                HalloweenDebug.log(2, '🏁 Combined competitions ended');
            } else if (state.status === 'active' && state.timeUntilEnd <= SIX_HOURS_MS) {
                // STATE 2: Final 6 hours
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Competitions end in ${timeStr}`;

                // Check if just entered final 6 hours (auto-show once)
                const wasInFinal6Hours = GM_getValue('member_combined_in_final_6_hours', false);
                if (!wasInFinal6Hours) {
                    GM_setValue('member_combined_countdown_visible', true);
                    GM_setValue('member_combined_in_final_6_hours', true);
                }

                // Show/hide based on user preference
                if (GM_getValue('member_combined_countdown_visible', true)) {
                    container.style.display = 'block';
                    statusLink.textContent = 'Hide Competition Status';
                } else {
                    container.style.display = 'none';
                    statusLink.textContent = 'Show Competition Status';
                }
            } else {
                // STATE 1: Normal (> 6 hours) - simple toggle
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Competitions end in ${timeStr}`;

                // Show/hide based on user preference
                if (visible) {
                    container.style.display = 'block';
                    statusLink.textContent = 'Hide Competition Status';
                } else {
                    container.style.display = 'none';
                    statusLink.textContent = 'Show Competition Status';
                }
            }
        },

        updateMemberSpookyStatus: function() {
            HalloweenDebug.log(2, 'HAL: 🎯 updateMemberSpookyStatus() called');

            const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

            const countdownText = document.getElementById('member-spooky-countdown-text');
            const statusLink = document.getElementById('member-spooky-status-link');
            const countdown = document.getElementById('member-spooky-countdown');

            HalloweenDebug.log(2, `HAL: 🎯 Elements - countdownText: ${!!countdownText}, statusLink: ${!!statusLink}, countdown: ${!!countdown}`);

            if (!countdownText || !statusLink || !countdown) {
                HalloweenDebug.log(2, 'HAL: 🎯 Early return - missing elements');
                return;
            }

            const state = this.getSpookyTargetsState();

            // Check for testing mode or disabled
            const testingMode = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
            const active = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';

            if (testingMode) {
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
                return;
            }

            if (!active) {
                countdownText.textContent = 'Spooky Targets Disabled';
                countdown.style.display = 'none';
                statusLink.style.display = 'inline';
                return;
            }

            if (state.status === 'unconfigured') {
                countdownText.textContent = 'Awaiting Configuration';
                countdown.style.display = 'none';
                statusLink.style.display = 'inline';
                return;
            }

            // Get user preference
            const visible = GM_getValue('member_spooky_countdown_visible', false);

            if (state.status === 'completed') {
                // STATE 3: Competition ended
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competition Ended';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
            } else if (state.status === 'pending') {
                // Pending start
                const timeStr = this.formatTimeRemaining(state.timeUntilStart);
                countdownText.innerHTML = `Starts in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else if (state.status === 'active' && state.timeUntilEnd <= SIX_HOURS_MS) {
                // STATE 2: Final 6 hours
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                // Check if just entered final 6 hours
                const wasInFinal6Hours = GM_getValue('member_spooky_in_final_6_hours', false);
                if (!wasInFinal6Hours) {
                    GM_setValue('member_spooky_countdown_visible', true);
                    GM_setValue('member_spooky_in_final_6_hours', true);
                    HalloweenDebug.log(1, '⏰ Spooky countdown: Entered final 6 hours, auto-showing');
                }

                if (GM_getValue('member_spooky_countdown_visible', true)) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else {
                // STATE 1: Normal (> 6 hours) - simple toggle
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            }
        },

        updateMemberManifestationsStatus: function() {
            HalloweenDebug.log(2, 'HAL: 🎯 updateMemberManifestationsStatus() called');

            const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

            const countdownText = document.getElementById('member-manifestations-countdown-text');
            const statusLink = document.getElementById('member-manifestations-status-link');
            const countdown = document.getElementById('member-manifestations-countdown');

            HalloweenDebug.log(2, `HAL: 🎯 Elements - countdownText: ${!!countdownText}, statusLink: ${!!statusLink}, countdown: ${!!countdown}`);

            if (!countdownText || !statusLink || !countdown) {
                HalloweenDebug.log(2, 'HAL: 🎯 Early return - missing elements');
                return;
            }

            const state = this.getCompetitionState();

            // Check for testing mode using state (not GM storage for consistency)
            const testingMode = GM_getValue('halloween_testing_mode', 'false') === 'true';

            HalloweenDebug.log(1, `🎯 DEBUG: testingMode=${testingMode}, state.status=${state.status}`);

            if (testingMode) {
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
                HalloweenDebug.log(1, '🎯 DEBUG: Early return - testing mode');
                return;
            }

            if (state.status === 'unconfigured') {
                countdownText.textContent = 'Awaiting Configuration';
                countdown.style.display = 'none';
                statusLink.style.display = 'inline';
                HalloweenDebug.log(1, '🎯 DEBUG: Early return - unconfigured');
                return;
            }

            // Get user preference
            const visible = GM_getValue('member_manifestations_countdown_visible', false);

            if (state.status === 'completed') {
                // STATE 3: Competition ended
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competition Ended';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
            } else if (state.status === 'pending') {
                // Pending start
                const timeStr = this.formatTimeRemaining(state.timeUntilStart);
                countdownText.innerHTML = `Starts in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else if (state.status === 'active' && state.timeUntilEnd <= SIX_HOURS_MS) {
                // STATE 2: Final 6 hours
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                // Check if just entered final 6 hours
                const wasInFinal6Hours = GM_getValue('member_manifestations_in_final_6_hours', false);
                if (!wasInFinal6Hours) {
                    GM_setValue('member_manifestations_countdown_visible', true);
                    GM_setValue('member_manifestations_in_final_6_hours', true);
                    HalloweenDebug.log(1, '⏰ Manifestations countdown: Entered final 6 hours, auto-showing');
                }

                if (GM_getValue('member_manifestations_countdown_visible', true)) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else {
                // STATE 1: Normal (> 6 hours) - simple toggle
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            }

            // Debug: Check final link state
            HalloweenDebug.log(1, `🎯 DEBUG: Manifestations link - display: ${statusLink.style.display}, text: "${statusLink.textContent}", opacity: ${statusLink.style.opacity}`);
        },

        setupMemberStatusHandlers: function() {
            // Event handlers for member panel countdown status links

            // Combined countdown handler
            const combinedLink = document.getElementById('member-combined-status-link');
            if (combinedLink && !combinedLink.dataset.handlerAttached) {
                combinedLink.dataset.handlerAttached = 'true';
                combinedLink.addEventListener('click', () => {
                    const state = this.getSpookyTargetsState();
                    const currentlyVisible = GM_getValue('member_combined_countdown_visible', false);

                    if (state.status === 'completed') {
                        return; // No action when ended
                    }

                    // Toggle visibility and preference (same for both normal and final 6 hours)
                    GM_setValue('member_combined_countdown_visible', !currentlyVisible);
                    this.updateMemberCombinedStatus();
                });

                // Add hover effects
                combinedLink.addEventListener('mouseover', () => {
                    combinedLink.style.opacity = '1';
                    combinedLink.style.textDecoration = 'underline';
                });

                combinedLink.addEventListener('mouseout', () => {
                    combinedLink.style.opacity = '0.8';
                    combinedLink.style.textDecoration = 'none';
                });
            }

            // Spooky countdown handler
            const spookyLink = document.getElementById('member-spooky-status-link');
            if (spookyLink && !spookyLink.dataset.handlerAttached) {
                spookyLink.dataset.handlerAttached = 'true';
                spookyLink.addEventListener('click', () => {
                    const state = this.getSpookyTargetsState();
                    const currentlyVisible = GM_getValue('member_spooky_countdown_visible', false);

                    if (state.status === 'completed') {
                        return; // No action when ended
                    }

                    // Toggle visibility and preference (same for both normal and final 6 hours)
                    GM_setValue('member_spooky_countdown_visible', !currentlyVisible);
                    this.updateMemberSpookyStatus();
                });

                // Add hover effects
                spookyLink.addEventListener('mouseover', () => {
                    spookyLink.style.opacity = '1';
                    spookyLink.style.textDecoration = 'underline';
                });

                spookyLink.addEventListener('mouseout', () => {
                    spookyLink.style.opacity = '0.8';
                    spookyLink.style.textDecoration = 'none';
                });
            }

            // Manifestations countdown handler
            const manifestationsLink = document.getElementById('member-manifestations-status-link');
            if (manifestationsLink && !manifestationsLink.dataset.handlerAttached) {
                manifestationsLink.dataset.handlerAttached = 'true';
                HalloweenDebug.log(1, '🎯 DEBUG: Manifestations handler ATTACHED to element', manifestationsLink);
                manifestationsLink.addEventListener('click', () => {
                    HalloweenDebug.log(1, '🎯 DEBUG: MANIFESTATIONS CLICK DETECTED');
                    const state = this.getCompetitionState();
                    HalloweenDebug.log(1, `🎯 DEBUG: Manifestations state: ${state.status}`);
                    const currentlyVisible = GM_getValue('member_manifestations_countdown_visible', false);
                    HalloweenDebug.log(1, `🎯 DEBUG: Current visible state: ${currentlyVisible}`);

                    if (state.status === 'completed') {
                        return; // No action when ended
                    }

                    // Toggle visibility and preference (same for both normal and final 6 hours)
                    GM_setValue('member_manifestations_countdown_visible', !currentlyVisible);
                    this.updateMemberManifestationsStatus();
                });

                // Add hover effects
                manifestationsLink.addEventListener('mouseover', () => {
                    manifestationsLink.style.opacity = '1';
                    manifestationsLink.style.textDecoration = 'underline';
                });

                manifestationsLink.addEventListener('mouseout', () => {
                    manifestationsLink.style.opacity = '0.8';
                    manifestationsLink.style.textDecoration = 'none';
                });
            }

            HalloweenDebug.log(2, '🎯 Member status handlers initialized');
        },

        setSeed: function() {
            const input = document.getElementById('seed-input');
            const newSeed = input.value.trim();

            if (newSeed) {
                const result = SeedManager.setSeed(newSeed);
                if (result) {
                    input.value = '';
                    this.updateMenuContent();
                    HalloweenDebug.log(2, '🎃 Team seed updated successfully');
                } else {
                    alert('Invalid seed format. Must be 3-50 characters.');
                }
            }
        },

        extractPlayerId: function(url) {
            const profileMatch = url.match(/\/profiles\.php\?XID=(\d+)/);
            const attackMatch = url.match(/\/loader\.php\?sid=attack&user2ID=(\d+)/);
            return profileMatch ? profileMatch[1] : (attackMatch ? attackMatch[1] : null);
        },


        toggleBackground: function() {
            HalloweenDebug.log(2, '🎃 toggleBackground() function called!');
            this.backgroundEnabled = !this.backgroundEnabled;
            GM_setValue('halloween_background', this.backgroundEnabled);

            if (this.backgroundEnabled) {
                // Add body class for generic background
                document.body.classList.add('halloween-background-enabled');

                // Apply generic Halloween background
                HalloweenEffects.applyGenericHalloweenBackground();

                // Apply tile background if configured (no delay for user action)
                const config = FactionConfig.getConfig();
                if (config.tileImage) {
                    FactionConfig.applyCustomBackground(config.tileImage);
                }
            } else {
                // Remove body classes
                document.body.classList.remove('halloween-background-enabled');
                document.body.classList.remove('halloween-target');

                // Remove both generic and target-specific backgrounds
                const existing = document.getElementById('halloween-background-override');
                if (existing) existing.remove();
                const generic = document.getElementById('halloween-generic-background');
                if (generic) generic.remove();
            }

            this.updateMenuContent();
        },

        toggleSound: function() {
            HalloweenDebug.log(2, '🎃 toggleSound() function called!');
            this.soundEnabled = !this.soundEnabled;
            GM_setValue('halloween_sound_enabled', this.soundEnabled);
            HalloweenDebug.log(2, `🔊 Audio setting saved: halloween_sound_enabled = "${this.soundEnabled}"`);
            HalloweenDebug.log(2, '🔊 Verification read:', GM_getValue('halloween_sound_enabled'));
            this.updateMenuContent();
        },

        toggleCollectibleHelper: function() {
            HalloweenDebug.log(2, '🎃 toggleCollectibleHelper() function called!');
            this.collectibleHelperEnabled = !this.collectibleHelperEnabled;
            GM_setValue('halloween_collectible_helper', this.collectibleHelperEnabled);

            if (this.collectibleHelperEnabled) {
                this.hijackTornLogo();
            } else {
                this.unhijackTornLogo();
            }

            this.updateMenuContent();
        },

        hijackTornLogo: function() {
            // Try multiple selectors for desktop/mobile compatibility
            const logoLink = document.querySelector('.logo-link') ||
                           document.querySelector('#tcLogo a') ||
                           document.querySelector('a[aria-label="Index page"]');

            if (!logoLink) {
                HalloweenDebug.log(1, '⚠️ Collectible Helper: Logo link not found');
                return;
            }

            // Store original href
            this.originalLogoHref = logoLink.getAttribute('href');

            // Load persisted index (don't reset - preserve cycling position)
            this.enchantedPageIndex = GM_getValue('halloween_collectible_page_index', 0);

            // Create and store bound handler
            this.logoClickHandler = this.handleLogoClick.bind(this);

            // Override click behavior
            logoLink.addEventListener('click', this.logoClickHandler);

            HalloweenDebug.log(2, '🎃 Collectible Helper: Logo hijacked');
        },

        handleLogoClick: function(e) {
            e.preventDefault();
            e.stopPropagation();

            const pages = this.competitionSettings?.enchantedPages || [];

            if (pages.length === 0) {
                HalloweenDebug.log(1, '⚠️ Collectible Helper: No enchanted pages configured');
                // Fallback to homepage
                window.location.href = '/index.php';
                return;
            }

            // Get current page
            const currentPage = pages[this.enchantedPageIndex];
            const currentIndex = this.enchantedPageIndex;

            // Increment index (wrap around) and persist to storage
            this.enchantedPageIndex = (this.enchantedPageIndex + 1) % pages.length;
            GM_setValue('halloween_collectible_page_index', this.enchantedPageIndex);

            HalloweenDebug.log(2, `🎃 Collectible Helper: Navigating to page ${currentIndex + 1}/${pages.length}: ${currentPage.url}`);

            // Navigate
            window.location.href = currentPage.url;
        },

        unhijackTornLogo: function() {
            const logoLink = document.querySelector('.logo-link') ||
                           document.querySelector('#tcLogo a') ||
                           document.querySelector('a[aria-label="Index page"]');

            if (!logoLink) return;

            // Remove event listener using stored handler
            if (this.logoClickHandler) {
                logoLink.removeEventListener('click', this.logoClickHandler);
                this.logoClickHandler = null;
            }

            // Reset state and storage
            this.enchantedPageIndex = 0;
            GM_setValue('halloween_collectible_page_index', 0);
            this.originalLogoHref = null;

            HalloweenDebug.log(2, '🎃 Collectible Helper: Logo unhijacked');
        },

        generateTargetPairsDisplay: function() {
            try {
                const currentSeed = SeedManager.getSeed('generateTargetPairsDisplay');
                const targets = SeedManager.getTargets('generateTargetPairsDisplay');
                HalloweenDebug.log(3, '🎃 DEBUG generateTargetPairsDisplay: got targets =', targets?.length, 'pairs');
                if (!targets || targets.length === 0) {
                    return '<div style="color: #ff6b35; text-align: center;">No targets available</div>';
                }

                // Display targets in a compact 5-column grid to match your image
                const rows = [];
                for (let i = 0; i < targets.length; i += 5) {
                    const row = targets.slice(i, i + 5);
                    const rowHTML = row.map(target =>
                        `<span style="color: #000; background: #ff69b4; padding: 3px 6px; border-radius: 3px; margin: 1px; display: inline-block; min-width: 20px; text-align: center; font-weight: bold;">${target}</span>`
                    ).join(' ');
                    rows.push(`<div style="margin-bottom: 4px; text-align: center;">${rowHTML}</div>`);
                }

                let displayHTML = rows.join('');
                displayHTML += `<div style="margin-top: 6px; font-size: 9px; opacity: 0.6; text-align: center; color: #fff;">Total: ${targets.length} pairs | Seed: ${currentSeed}</div>`;

                return displayHTML;
            } catch (error) {
                HalloweenDebug.log(2, 'Error generating target pairs display:', error);
                return '<div style="color: #ff6b35; text-align: center;">Error loading targets</div>';
            }
        },

        clearData: function() {
            if (confirm('Clear all Halloween data? This cannot be undone.')) {
                GM_setValue('halloween_encounters', '{}');
                // Clear GM defeats data (now using Firebase verification system)
                GM_deleteValue('halloween_defeats_counted');
                GM_deleteValue('halloween_verify_queue');
                GM_deleteValue('halloween_verify_failed');
                GM_deleteValue('halloween_defeats_unverified');
                // Clear pumpkin expiration tracking
                GM_deleteValue('halloween_logged_expirations');
                // Clear Override Period testing values
                GM_deleteValue('halloween_api_period_enabled');
                GM_deleteValue('halloween_api_period_start');
                GM_deleteValue('halloween_api_period_duration');
                SeedManager.clearCache();
                this.updateMenuContent();
                HalloweenDebug.log(3, '🎃 All Halloween data cleared');
            }
        },

        clearAPIData: function() {
            if (confirm('Clear all API attack data? Settings and config will be preserved.')) {
                // Only clear the attack data, not config/settings
                GM_setValue('halloween_api_all_attacks', '{}');
                GM_deleteValue('halloween_api_last_saved_timestamp'); // Clear the last fetch timestamp
                HalloweenDebug.log(1, '🎃 API attack data cleared');
                alert('API attack data has been cleared. Settings preserved.');

                // Refresh the menu to show updated stats
                this.updateMenuContent();
            }
        },

        setDebugLevel: function(level) {
            HalloweenDebug.setLevel(level);

            // Update footer debug level display (leader only)
            const footerLevelDisplay = document.getElementById('debug-level-footer');
            const levelNameDisplay = document.getElementById('debug-level-name');
            if (footerLevelDisplay) {
                footerLevelDisplay.textContent = level;
            }
            if (levelNameDisplay) {
                levelNameDisplay.textContent = this.getDebugLevelName(level);
            }

            // Update button visual states
            this.updateDebugButtonStates(level);

            // Show confirmation message
            const feedback = document.getElementById('debug-feedback');
            if (feedback) {
                const messages = {
                    0: 'Production mode: Only essential messages',
                    1: 'Basic flow: Seed, API & cache operations enabled',
                    2: 'Detailed mode: Menu & event debugging enabled',
                    3: 'Full debug: All operations & DOM debugging enabled'
                };

                feedback.textContent = messages[level];
                feedback.style.opacity = '1';

                // Hide after 5 seconds
                setTimeout(() => {
                    feedback.style.opacity = '0';
                }, 5000);
            }
        },

        getDebugLevelName: function(level) {
            const names = {
                0: 'Production',
                1: 'Basic',
                2: 'Detailed',
                3: 'Full'
            };
            return names[level] || 'Unknown';
        },

        updateDebugButtonStates: function(activeLevel) {
            // Define the button colors (soft candy pink to vibrant pink)
            const colors = {
                inactive: {
                    0: '#f8c8dc', // Soft candy pink
                    1: '#f1a7c7', // Light pink
                    2: '#e685b2', // Medium pink
                    3: '#db649d'  // Strong pink
                },
                active: {
                    background: 'var(--carved-magenta)', // Vibrant magenta for active
                    color: 'white',
                    boxShadow: '0 0 8px rgba(255, 105, 180, 0.6)'
                }
            };

            // Update all buttons
            for (let i = 0; i <= 3; i++) {
                const button = document.getElementById(`debug-level-${i}`);
                if (button) {
                    if (i === activeLevel) {
                        // Active button - vibrant magenta with glow
                        button.style.background = colors.active.background;
                        button.style.color = colors.active.color;
                        button.style.boxShadow = colors.active.boxShadow;
                        button.style.transform = 'scale(1.05)';
                    } else {
                        // Inactive button - soft candy pink gradient
                        button.style.background = colors.inactive[i];
                        button.style.color = 'black';
                        button.style.boxShadow = 'none';
                        button.style.transform = 'scale(1)';
                    }
                }
            }
        },

        clearCache: function() {
            HalloweenDebug.log(3, '🎃 CLEAR CACHE button clicked');

            // Step 1: Check what's currently in storage
            HalloweenDebug.log(3, '🎃 BEFORE CLEARING:');
            const beforeTargets = GM_getValue('halloween_targets_cache_encrypted');
            const beforeSeed = GM_getValue('halloween_targets_seed_encrypted');
            HalloweenDebug.log(3, '🎃 Current targets in GM storage:', beforeTargets ? 'EXISTS' : 'NULL');
            HalloweenDebug.log(3, '🎃 Current seed in GM storage:', beforeSeed ? beforeSeed : 'NULL');
            HalloweenDebug.log(3, '🎃 Current memory cache exists:', !!SeedManager.cachedTargets);
            HalloweenDebug.log(3, '🎃 Current memory seed:', SeedManager.currentSeed);

            // Step 2: Clear encrypted target cache with error handling
            try {
                HalloweenDebug.log(3, '🎃 Calling GM_deleteValue for targets...');
                GM_deleteValue('halloween_targets_cache_encrypted');
                HalloweenDebug.log(3, '🎃 GM_deleteValue for targets completed');
            } catch (e) {
                console.error('🎃 ERROR deleting targets:', e);
            }

            try {
                HalloweenDebug.log(3, '🎃 Calling GM_deleteValue for seed...');
                GM_deleteValue('halloween_targets_seed_encrypted');
                HalloweenDebug.log(3, '🎃 GM_deleteValue for seed completed');
            } catch (e) {
                console.error('🎃 ERROR deleting seed:', e);
            }

            // Step 3: Clear SeedManager cache aggressively
            HalloweenDebug.log(3, '🎃 Clearing memory cache...');
            SeedManager.cachedTargets = null;
            SeedManager.currentSeed = null;
            HalloweenDebug.log(3, '🎃 Memory cache cleared');

            // Step 4: Verify deletion worked
            HalloweenDebug.log(3, '🎃 AFTER CLEARING:');
            const afterTargets = GM_getValue('halloween_targets_cache_encrypted');
            const afterSeed = GM_getValue('halloween_targets_seed_encrypted');
            HalloweenDebug.log(3, '🎃 Targets after deletion:', afterTargets ? 'STILL EXISTS!' : 'Successfully deleted');
            HalloweenDebug.log(3, '🎃 Seed after deletion:', afterSeed ? afterSeed + ' STILL EXISTS!' : 'Successfully deleted');

            if (afterTargets || afterSeed) {
                console.error('🎃 CACHE CLEARING FAILED! Some values still exist.');
                alert('🎃 WARNING: Cache clearing failed! Some data still exists. Try again or contact support.');
            } else {
                HalloweenDebug.log(3, '🎃 Cache clearing successful!');
                alert('🎃 Cache cleared successfully! Reload the page to generate fresh targets.');
            }
        },

        updateTileImage: function() {
            const halloweenTiles = [
                'https://i.ibb.co/4KpXxKh/halloween-pumpkin-tile.png',
                'https://i.ibb.co/7X2Y1Kw/halloween-ghost-tile.png',
                'https://i.ibb.co/5BxGz2k/halloween-bat-tile.png',
                'https://i.ibb.co/DGq8Kzh/halloween-skull-tile.png',
                'https://i.ibb.co/Yk9B1pq/halloween-witch-tile.png'
            ];

            const tileNames = [
                '🎃 Pumpkin Terror',
                '👻 Ghostly Apparition',
                '🦇 Vampire Bat',
                '💀 Skull Crusher',
                '🧙‍♀️ Witch Master'
            ];

            let optionsHTML = '';
            halloweenTiles.forEach((url, index) => {
                optionsHTML += `<option value="${url}">${tileNames[index]}</option>`;
            });

            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.8); z-index: 99999; display: flex;
                justify-content: center; align-items: center; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
            `;

            modal.innerHTML = `
                <div style="background: linear-gradient(145deg, #2a0845, #1a0530); padding: 30px; border-radius: 15px;
                           border: 3px solid var(--halloween-primary); box-shadow: 0 0 30px var(--halloween-primary);
                           text-align: center; max-width: 400px; color: white;">
                    <h3 style="color: var(--halloween-secondary); margin-bottom: 20px; font-size: 18px;">🎃 Halloween Tile Images</h3>
                    <p style="margin-bottom: 20px; font-size: 13px; color: #ccc;">Choose a spooky tile image for your profile:</p>
                    <select id="halloween-tile-select" style="width: 100%; padding: 10px; margin-bottom: 20px;
                           background: rgba(0,0,0,0.7); color: var(--halloween-primary); border: 2px solid var(--halloween-primary);
                           border-radius: 5px; font-size: 12px;">
                        <option value="">🔄 Restore Original</option>
                        ${optionsHTML}
                    </select>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="apply-tile" style="padding: 10px 20px; background: var(--halloween-primary);
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Apply Tile
                        </button>
                        <button id="cancel-tile" style="padding: 10px 20px; background: #666;
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Cancel
                        </button>
                    </div>
                    <div style="margin-top: 15px; font-size: 11px; color: #888;">
                        ⚠️ Tile changes are visual only and temporary
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Event handlers
            document.getElementById('apply-tile').onclick = () => {
                const selectedTile = document.getElementById('halloween-tile-select').value;
                this.applyTileImage(selectedTile);
                document.body.removeChild(modal);
            };

            document.getElementById('cancel-tile').onclick = () => {
                document.body.removeChild(modal);
            };

            // Close on background click
            modal.onclick = (e) => {
                if (e.target === modal) document.body.removeChild(modal);
            };
        },

        applyTileImage: function(imageUrl) {
            // Remove existing Halloween tile override
            const existingStyle = document.getElementById('halloween-tile-override');
            if (existingStyle) existingStyle.remove();

            if (imageUrl) {
                // Apply new Halloween tile
                const tileStyle = document.createElement('style');
                tileStyle.id = 'halloween-tile-override';
                tileStyle.textContent = `
                    .profile-image img,
                    .user-info img,
                    .profile-image-wrapper img,
                    img[src*="profileimages.torn.com"] {
                        content: url('${imageUrl}') !important;
                        border-radius: 8px !important;
                        border: 2px solid var(--halloween-primary) !important;
                        box-shadow: 0 0 10px var(--halloween-primary) !important;
                    }
                `;
                document.head.appendChild(tileStyle);

                // Store preference
                GM_setValue('halloween_tile_image', imageUrl);
                HalloweenDebug.log(3, '🎃 Halloween tile image applied:', imageUrl);
            } else {
                // Restore original
                GM_deleteValue('halloween_tile_image');
                HalloweenDebug.log(3, '🎃 Original tile image restored');
            }
        },

        updateFactionName: function() {
            const currentName = GM_getValue('halloween_faction_name', 'Your Faction');

            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.8); z-index: 99999; display: flex;
                justify-content: center; align-items: center; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
            `;

            modal.innerHTML = `
                <div style="background: linear-gradient(145deg, #2a0845, #1a0530); padding: 30px; border-radius: 15px;
                           border: 3px solid var(--halloween-primary); box-shadow: 0 0 30px var(--halloween-primary);
                           text-align: center; max-width: 400px; color: white;">
                    <h3 style="color: var(--halloween-secondary); margin-bottom: 20px; font-size: 18px;">🏴‍☠️ Faction Name</h3>
                    <p style="margin-bottom: 20px; font-size: 13px; color: #ccc;">Customize your faction display name in Halloween UI:</p>
                    <input type="text" id="halloween-faction-input" value="${currentName}"
                           style="width: 100%; padding: 10px; margin-bottom: 20px; background: rgba(0,0,0,0.7);
                                  color: var(--halloween-primary); border: 2px solid var(--halloween-primary);
                                  border-radius: 5px; font-size: 12px; text-align: center;"
                           placeholder="Enter coven name..." maxlength="30">
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="apply-faction" style="padding: 10px 20px; background: var(--halloween-primary);
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Apply Name
                        </button>
                        <button id="cancel-faction" style="padding: 10px 20px; background: #666;
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Cancel
                        </button>
                    </div>
                    <div style="margin-top: 15px; font-size: 11px; color: #888;">
                        💡 This name appears in Halloween UI elements and notifications
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Focus the input
            const input = document.getElementById('halloween-faction-input');
            input.focus();
            input.select();

            // Event handlers
            document.getElementById('apply-faction').onclick = () => {
                const newName = input.value.trim();
                if (newName) {
                    GM_setValue('halloween_faction_name', newName);
                    this.updateMenuContent(); // Refresh menu to show new name
                    HalloweenDebug.log(2, '🎃 Faction name updated to:', newName);
                }
                document.body.removeChild(modal);
            };

            document.getElementById('cancel-faction').onclick = () => {
                document.body.removeChild(modal);
            };

            // Apply on Enter key
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('apply-faction').click();
                }
            };

            // Close on background click
            modal.onclick = (e) => {
                if (e.target === modal) document.body.removeChild(modal);
            };
        },

        getFactionName: function() {
            return GM_getValue('halloween_faction_name', 'Your Faction');
        },

        // Leader Mode Functions
        toggleLeaderMode: function() {
            HalloweenDebug.log(2, '🎃 toggleLeaderMode() function called!');
            const currentView = SeedManager.menuPanelView;
            const newView = currentView === 'leader' ? 'member' : 'leader';

            HalloweenDebug.log(2, '🎃 Toggling menu panel view from:', currentView, 'to:', newView);

            SeedManager.menuPanelView = newView;
            GM_setValue('halloween_menu_panel_view', newView);

            this.updateMenuContent();
            HalloweenDebug.log(2, '🎃 Menu panel view updated to:', SeedManager.menuPanelView);
        },

        generateLeaderSeed: function() {
            const newSeed = SeedManager.generateLeaderSeed();
            this.updateMenuContent();
            HalloweenDebug.log(1, '🎃 Generated new leader seed:', newSeed);
        },

        setLeaderSeed: function() {
            const input = document.getElementById('halloween-leader-seed-input');
            const newSeed = input.value.trim();

            if (newSeed) {
                const result = SeedManager.setLeaderSeed(newSeed);
                if (result) {
                    input.value = '';
                    this.updateMenuContent();
                    HalloweenDebug.log(1, '🎃 Leader seed loaded successfully');
                } else {
                    alert('Invalid leader seed format. Must be at least 8 characters.');
                }
            }
        },

        applyCustomization: function() {
            const newConfig = {
                primaryColor: document.getElementById('halloween-primary-color').value,
                secondaryColor: document.getElementById('halloween-secondary-color').value,
                menuPanelImage: document.querySelector('input[name="menu-panel-image"]:checked').value,
                tileImage: document.getElementById('halloween-tile-image').value.trim(),
                factionBanner: document.getElementById('halloween-banner-url').value.trim(),
                factionIcon: document.getElementById('halloween-icon-url').value.trim()
            };

            FactionConfig.setConfig(newConfig);
            this.updateMenuContent();
            HalloweenDebug.log(2, '🎃 Faction customization applied');
        },

        exportForLeaders: function() {
            const jsonString = FactionConfig.generateExportData(false);
            this.showExportDisplay(jsonString);
            HalloweenDebug.log(2, '🎃 Leader configuration exported');
        },

        exportForMembers: function() {
            const jsonString = FactionConfig.generateExportData(true);
            this.showExportDisplay(jsonString);
            HalloweenDebug.log(2, '🎃 Member configuration exported');
        },

        showExportDisplay: function(jsonString) {
            const container = document.getElementById('export-fallback-container');
            const textarea = document.getElementById('export-fallback-output');

            if (container && textarea) {
                textarea.value = jsonString;
                container.style.display = 'block';
                HalloweenDebug.log(2, '🎃 Export configuration displayed');
            }
        },

        hideExportFallback: function() {
            const container = document.getElementById('export-fallback-container');
            if (container) {
                container.style.display = 'none';
            }
        },

        importConfig: function() {
            const input = document.getElementById('halloween-import-json');
            let inputString = input.value.trim();

            if (!inputString) return;

            // Strip backticks if present (matches export format)
            if (inputString.startsWith('`') && inputString.endsWith('`')) {
                inputString = inputString.slice(1, -1);
            }

            // Strip single quotes if present (in case users copy with quotes)
            if (inputString.startsWith("'") && inputString.endsWith("'")) {
                inputString = inputString.slice(1, -1);
            }

            // Route based on input type
            if (inputString.startsWith('sc.')) {
                // Secret command
                this.handleSecretCommand(inputString);
            } else if (inputString.startsWith('{"version":')) {
                // JSON import (any version)
                const result = FactionConfig.importData(inputString);
                if (result) {
                    input.value = '';
                    this.updateMenuContent();
                    // Refresh Halloween announcements UI if announcements were imported
                    if (this.halloweenAnnouncements && this.populateAnnouncementFields) {
                        this.populateAnnouncementFields();
                    }
                    // Refresh date-specific announcements UI if date announcements were imported
                    if (this.dateAnnouncements && this.populateDateAnnouncementFields) {
                        this.populateDateAnnouncementFields();
                    }
                    // Refresh ticker timing settings UI if settings were imported
                    if (this.populateTickerSettings) {
                        this.populateTickerSettings();
                    }
                    alert('Configuration imported successfully!');

                    // Apply the new configuration immediately
                    FactionConfig.applyConfig();

                    // Apply tile background if configured and backgrounds enabled (no delay for user action)
                    if (HalloweenUI.backgroundEnabled) {
                        const config = FactionConfig.getConfig();
                        if (config.tileImage) {
                            FactionConfig.applyCustomBackground(config.tileImage);
                        }
                    }
                } else {
                    alert('Failed to import configuration. Please check the JSON format.');
                }
            } else {
                // Invalid input format
                this.showArcaneToast('Invalid input format', 'error');
            }
        },

        handleSecretCommand: function(command) {
            const trimmed = command.trim();

            if (trimmed === 'sc.reset.collectibles.override') {
                // Execute spawn schedule regeneration
                this.regenerateSpawnSchedule();
            } else if (trimmed === 'sc.reset.master.nuclear') {
                // Execute master nuclear reset (complete wipe)
                this.masterNuclearReset();
            } else if (trimmed === 'sc.reimportonrefresh') {
                // Clear manual import flag to allow preload reimport
                this.clearManualImportFlag();
            } else if (trimmed.startsWith('sc.setteam.')) {
                // Set team badge
                this.setTeamBadge(trimmed);
            } else if (trimmed === 'sc.clearteambadge') {
                // Clear team badge
                this.clearTeamBadge();
            } else if (trimmed.startsWith('sc.flushapi.')) {
                // Flush API mode and restore Member ID mode
                this.flushAPIMode(trimmed);
            } else if (trimmed.startsWith('sc.updatebounty.')) {
                // Update a single bounty by date
                this.updateBounty(trimmed);
            } else if (trimmed === 'sc.auditapi') {
                // Audit API data integrity and fill gaps
                this.auditAPIData();
            } else if (trimmed === 'sc.syncdefeats') {
                // Sync defeats from API storage to counted defeats
                this.syncDefeatsFromAPI();
            } else if (trimmed === 'sc.showunverified') {
                // Show unverified defeats with details
                this.showUnverifiedDefeats();
            } else if (trimmed.startsWith('sc.debug.')) {
                // Set debug level
                this.setDebugLevelFromCommand(trimmed);
            } else if (trimmed === 'sc.apistart') {
                // Show oldest attack timestamp
                this.showOldestAttackTimestamp();
            } else if (trimmed === 'sc.apiend') {
                // Show newest attack timestamp
                this.showNewestAttackTimestamp();
            } else if (trimmed.startsWith('sc.forceapifrom.')) {
                // Force collection from specific timestamp (backfill gaps at start)
                this.forceCollectionFrom(trimmed);
            } else if (trimmed.startsWith('sc.forceapito.')) {
                // Force collection to specific timestamp (extend collection at end)
                this.forceCollectionTo(trimmed);
            } else if (trimmed === 'sc.report.7d') {
                // Switch to 7-day report mode
                this.setReportMode('7d');
            } else if (trimmed === 'sc.report.default') {
                // Switch to default (global comp dates) report mode
                this.setReportMode('default');
            } else if (trimmed.startsWith('sc.collect7dhistorical.')) {
                // Collect 7 days of historical data from specified timestamp
                this.collect7dHistorical(trimmed);
            } else if (trimmed === 'sc.clearhistorical') {
                // Clear all historical data
                this.clearHistorical();
            } else if (trimmed === 'sc.resetcollectibles') {
                // Reset collectibles spawn schedule (forces regeneration)
                this.resetCollectiblesSchedule();
            } else if (trimmed === 'sc.resetcollectibles.expirations') {
                // Reset collectibles spawn schedule AND clear expiration logs
                this.resetCollectiblesScheduleWithExpirations();
            } else if (trimmed === 'sc.report.historical') {
                // Switch to historical report mode
                this.showHistoricalReport();
            } else if (trimmed === 'sc.showbountyconfig') {
                // Show current bounty config for diagnostics
                this.showBountyConfigDiagnostic();
            } else if (trimmed === 'sc.showfullconfig') {
                // Show full script diagnostic for troubleshooting
                this.showFullConfigDiagnostic();
            } else if (trimmed.startsWith('sc.reconfig.globalstart.')) {
                // Reconfigure global competition start time
                this.reconfigGlobalStart(trimmed);
            } else if (trimmed.startsWith('sc.excludeplayer.')) {
                // Add player ID to exclusion list
                this.excludePlayer(trimmed);
            } else if (trimmed.startsWith('sc.includeplayer.')) {
                // Remove player ID from exclusion list (re-include)
                this.includePlayer(trimmed);
            } else {
                // Invalid secret command
                this.showArcaneToast('Secret command invalid', 'error');
            }
        },

        regenerateSpawnSchedule: function() {
            try {
                // Delete encrypted spawn schedule
                GM_deleteValue('halloween_spawn_schedule_encrypted');

                // Reset failure counter
                GM_setValue('halloween_spawn_decrypt_failures', 0);

                // Regenerate spawn schedule
                if (typeof HalloweenCompetition !== 'undefined' && HalloweenCompetition.generateSpawnSchedule) {
                    HalloweenCompetition.generateSpawnSchedule();
                }

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                // Show success message
                this.showArcaneToast(
                    'Success! Spawn schedule cleared, regenerated and adjusted for current competition duration.',
                    'success'
                );

                HalloweenDebug.log(1, '🎃 Spawn schedule regenerated via secret command');

            } catch (e) {
                this.showArcaneToast('Error regenerating spawn schedule', 'error');
                HalloweenDebug.log(1, `⚠️ Spawn regeneration error: ${e.message}`);
            }
        },

        resetCollectiblesSchedule: function() {
            try {
                // Clear encrypted spawn schedule (forces regeneration)
                GM_deleteValue('halloween_spawn_schedule_encrypted');
                GM_setValue('halloween_spawn_decrypt_failures', 0);

                // Clear spawn tracking arrays (collected/expired IDs)
                GM_deleteValue('halloween_collected_pumpkin_ids');
                GM_deleteValue('halloween_expired_pumpkin_ids');

                // Clear late joiner flag (will re-run adjustment)
                if (typeof HalloweenCompetition !== 'undefined') {
                    HalloweenCompetition.lateJoinerAdjusted = false;

                    // Clear in-memory schedule
                    HalloweenCompetition.spawnSchedule = [];
                    HalloweenCompetition.currentSpawns.clear();
                    HalloweenCompetition.spawnedOnCurrentPage.clear();
                }

                // DO NOT clear collected data - preserve player progress
                // halloween_collectibles stays intact

                this.showArcaneToast('Collectibles schedule reset - will regenerate on next page load', 'success', 5000);
                HalloweenDebug.log(1, '🎃 Collectibles schedule reset (collected data preserved)');

                // Trigger immediate regeneration
                if (typeof HalloweenCompetition !== 'undefined' && HalloweenCompetition.generateSpawnSchedule) {
                    HalloweenCompetition.generateSpawnSchedule();
                }

            } catch (error) {
                this.showArcaneToast('Error resetting collectibles schedule', 'error');
                HalloweenDebug.log(1, `⚠️ Reset collectibles error: ${error.message}`);
            }
        },

        resetCollectiblesScheduleWithExpirations: function() {
            try {
                // Clear encrypted spawn schedule (forces regeneration)
                GM_deleteValue('halloween_spawn_schedule_encrypted');
                GM_setValue('halloween_spawn_decrypt_failures', 0);

                // Clear spawn tracking arrays (collected/expired IDs)
                GM_deleteValue('halloween_collected_pumpkin_ids');
                GM_deleteValue('halloween_expired_pumpkin_ids');

                // Clear expiration log tracking (allows expired spawns to be re-logged with new format)
                GM_deleteValue('halloween_logged_expirations');
                // Note: We don't clear the actual Firebase database, just the local tracking
                // This allows expirations to be re-logged to Firebase with new schedule/format

                // Clear late joiner flag (will re-run adjustment)
                if (typeof HalloweenCompetition !== 'undefined') {
                    HalloweenCompetition.lateJoinerAdjusted = false;
                    HalloweenCompetition.loggedExpirations = new Set();

                    // Clear in-memory schedule
                    HalloweenCompetition.spawnSchedule = [];
                    HalloweenCompetition.currentSpawns.clear();
                    HalloweenCompetition.spawnedOnCurrentPage.clear();
                }

                // DO NOT clear collected data - preserve player progress
                // halloween_collectibles stays intact

                this.showArcaneToast('Collectibles schedule & expiration logs cleared - will regenerate and re-log expirations', 'success', 5000);
                HalloweenDebug.log(1, '🎃 Collectibles schedule & expiration log tracking cleared (collected data preserved)');

                // Trigger immediate regeneration
                if (typeof HalloweenCompetition !== 'undefined' && HalloweenCompetition.generateSpawnSchedule) {
                    HalloweenCompetition.generateSpawnSchedule();
                }

            } catch (error) {
                this.showArcaneToast('Error resetting collectibles schedule', 'error');
                HalloweenDebug.log(1, `⚠️ Reset collectibles with expirations error: ${error.message}`);
            }
        },

        masterNuclearReset: function() {
            try {
                HalloweenDebug.log(1, '☢️ Starting master nuclear reset (COMPLETE WIPE)...');

                let gmCount = 0;
                let lsCount = 0;

                // Clear GM storage - Everything with halloween/firebase/phantom prefix
                const gmKeys = GM_listValues();
                gmKeys.forEach(key => {
                    if (key.startsWith('halloween_') ||
                        key.startsWith('firebase_') ||
                        key.startsWith('phantom_')) {
                        GM_deleteValue(key);
                        gmCount++;
                        HalloweenDebug.log(2, `☢️ Cleared GM key: ${key}`);
                    }
                });

                // Clear specific member keys and debug key
                const specificKeys = [
                    'hallo_debug_level',
                    'member_combined_countdown_visible',
                    'member_combined_in_final_6_hours',
                    'member_manifestations_countdown_visible',
                    'member_manifestations_in_final_6_hours',
                    'member_spooky_countdown_visible',
                    'member_spooky_in_final_6_hours'
                ];
                specificKeys.forEach(key => {
                    GM_deleteValue(key);
                    gmCount++;
                    HalloweenDebug.log(2, `☢️ Cleared specific GM key: ${key}`);
                });

                // Clear localStorage - Only keys containing 'halloween'
                const lsKeys = Object.keys(localStorage).filter(k => k.includes('halloween'));
                lsKeys.forEach(key => {
                    localStorage.removeItem(key);
                    lsCount++;
                    HalloweenDebug.log(2, `☢️ Cleared localStorage key: ${key}`);
                });

                HalloweenDebug.log(1, `☢️ Master nuclear reset: Cleared ${gmCount} GM keys and ${lsCount} localStorage keys`);

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                // Show success message
                this.showArcaneToast(
                    'Master nuclear reset complete. All data wiped. Refresh page when ready.',
                    'success',
                    10000  // Show for 10 seconds
                );

            } catch (e) {
                this.showArcaneToast('Error during master nuclear reset', 'error');
                HalloweenDebug.log(1, `⚠️ Master nuclear reset error: ${e.message}`);
            }
        },

        clearManualImportFlag: function() {
            try {
                // Delete the manual import flag
                GM_deleteValue('halloween_manual_import_done');

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                // Show success message
                this.showArcaneToast(
                    'Manual import flag cleared. Preload will auto-import on page refresh.',
                    'success'
                );

                HalloweenDebug.log(1, '🔄 Manual import flag cleared via secret command');

            } catch (e) {
                this.showArcaneToast('Error clearing manual import flag', 'error');
                HalloweenDebug.log(1, `⚠️ Clear import flag error: ${e.message}`);
            }
        },

        setTeamBadge: function(command) {
            try {
                // Extract team and member list from command
                // Format: sc.setteam.{team}(Member1 [ID1], Member2 [ID2], ...)
                const match = command.match(/^sc\.setteam\.(\w+)\((.+)\)$/);

                if (!match) {
                    this.showArcaneToast('Invalid team badge format. Use: sc.setteam.{team}(Name [ID], ...)', 'error');
                    return;
                }

                const teamName = match[1].toLowerCase();
                const memberListString = match[2];

                // Validate team name
                const validTeams = ['witches', 'wizards', 'vampires', 'werewolves'];
                if (!validTeams.includes(teamName)) {
                    this.showArcaneToast('Invalid team. Use: witches, wizards, vampires, or werewolves', 'error');
                    return;
                }

                // Parse member list (returns { leader, members })
                const parsed = this.parseTeamMembers(memberListString);

                if (!parsed.leader) {
                    this.showArcaneToast('No leader found. Use format: Leader: Name [ID], Member1 [ID], ...', 'error');
                    return;
                }

                if (parsed.members.length === 0) {
                    this.showArcaneToast('No members found. Include at least one member after the leader.', 'error');
                    return;
                }

                // Save to GM storage
                const teamData = {
                    team: teamName,
                    leader: parsed.leader,
                    members: parsed.members
                };

                GM_setValue('halloween_team_badge', JSON.stringify(teamData));

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                // Show success message
                const teamDisplayNames = {
                    witches: 'The Witches',
                    wizards: 'The Wizards',
                    vampires: 'The Vampires',
                    werewolves: 'The Werewolves'
                };

                this.showArcaneToast(
                    `Team badge set: ${teamDisplayNames[teamName]} - Leader: ${parsed.leader.name}, ${parsed.members.length} members`,
                    'success'
                );

                HalloweenDebug.log(1, `🎖️ Team badge set: ${teamName} - Leader: ${parsed.leader.name}, ${parsed.members.length} members`);

                // Refresh menu to show badge after 3 seconds (let toast display first)
                if (this.menuOpen) {
                    setTimeout(() => {
                        this.updateMenuContent();
                    }, 3000);
                }

            } catch (e) {
                this.showArcaneToast('Error setting team badge', 'error');
                HalloweenDebug.log(1, `⚠️ Set team badge error: ${e.message}`);
            }
        },

        parseTeamMembers: function(memberString) {
            let leader = null;
            const members = [];

            try {
                // First, extract leader if present (format: Leader: Name [ID])
                const leaderRegex = /Leader:\s*([^[]+)\s*\[(\d+)\]/i;
                const leaderMatch = memberString.match(leaderRegex);

                if (leaderMatch) {
                    leader = {
                        name: leaderMatch[1].trim(),
                        id: leaderMatch[2].trim()
                    };
                    // Remove leader from string to avoid duplicate parsing
                    memberString = memberString.replace(leaderRegex, '');
                }

                // Then parse remaining members (format: Name [ID])
                const memberRegex = /([^[]+)\s*\[(\d+)\]/g;
                let match;

                while ((match = memberRegex.exec(memberString)) !== null) {
                    let name = match[1].trim();
                    const id = match[2].trim();

                    // Strip leading commas and whitespace
                    name = name.replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');

                    // Skip if empty after cleanup
                    if (name && id) {
                        members.push({ name, id });
                    }
                }
            } catch (e) {
                HalloweenDebug.log(1, `⚠️ Parse team members error: ${e.message}`);
            }

            return { leader, members };
        },

        clearTeamBadge: function() {
            try {
                GM_deleteValue('halloween_team_badge');

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                this.showArcaneToast('Team badge cleared', 'success');
                HalloweenDebug.log(1, '🎖️ Team badge cleared via secret command');

                // Refresh menu to hide badge after 3 seconds (let toast display first)
                if (this.menuOpen) {
                    setTimeout(() => {
                        this.updateMenuContent();
                    }, 3000);
                }

            } catch (e) {
                this.showArcaneToast('Error clearing team badge', 'error');
                HalloweenDebug.log(1, `⚠️ Clear team badge error: ${e.message}`);
            }
        },

        showBountyConfigDiagnostic: function() {
            try {
                const config = BountyManager.getConfig();
                const claims = BountyManager.getClaims();

                const message = `Bounty Config: active=${config.active}, testing=${config.testing}, bounties=${config.bounties?.length || 0} | Claims: ${Object.keys(claims).length}`;

                // Show in toast for 15 seconds
                this.showArcaneToast(message, 'success', 15000);

                // Also log to console for detailed inspection
                console.log('🔥 Bounty Config Diagnostic:', {
                    config: config,
                    claims: claims
                });

                HalloweenDebug.log(1, `🔥 Bounty config diagnostic: active=${config.active}, testing=${config.testing}, bounties=${config.bounties?.length || 0}, claims=${Object.keys(claims).length}`);

            } catch (e) {
                this.showArcaneToast('Error reading bounty config', 'error');
                HalloweenDebug.log(1, `⚠️ Show bounty config error: ${e.message}`);
            }
        },

        showFullConfigDiagnostic: function() {
            try {
                // Helper function to format timestamps
                const formatTimestamp = (timestamp) => {
                    if (!timestamp) return 'Not Set';
                    const date = new Date(timestamp * 1000);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')} GMT/TCT`;
                };

                // Generate timestamp for this diagnostic
                const now = Date.now() / 1000;
                const generatedTime = formatTimestamp(now);

                // [PLAYER IDENTITY]
                const playerID = GM_getValue('halloween_player_id', 'Not Set');
                const apiMode = GM_getValue('halloween_api_mode', false);
                const apiMemberName = GM_getValue('halloween_api_member_name', 'N/A');

                // [ENROLLMENT]
                const globalStart = GM_getValue('halloween_competition_start_timestamp', null);
                const globalEnd = GM_getValue('halloween_competition_end_timestamp', null);

                // Spooky Targets - parse date+time strings
                const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
                const spookyStartTime = GM_getValue('halloween_spooky_start_time', '');
                const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
                const spookyEndTime = GM_getValue('halloween_spooky_end_time', '');
                let spookyStart = null;
                let spookyEnd = null;
                if (spookyStartDate && spookyStartTime) {
                    try {
                        spookyStart = Math.floor(new Date(`${spookyStartDate}T${spookyStartTime}:00.000Z`).getTime() / 1000);
                    } catch (e) {}
                }
                if (spookyEndDate && spookyEndTime) {
                    try {
                        spookyEnd = Math.floor(new Date(`${spookyEndDate}T${spookyEndTime}:00.000Z`).getTime() / 1000);
                    } catch (e) {}
                }

                // Bounties - parse all dates from config
                const bountyConfig = (typeof BountyManager !== 'undefined' && BountyManager) ? BountyManager.getConfig() : null;
                const bountyActive = bountyConfig?.active || false;
                const bountyCount = bountyConfig?.bounties?.length || 0;
                const bountyTesting = bountyConfig?.testing || false;
                let bountiesStartCSV = 'Not Set';
                if (bountyConfig?.bounties && bountyConfig.bounties.length > 0) {
                    try {
                        const dates = bountyConfig.bounties.map(b => {
                            const d = new Date(b.date);
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return `${months[d.getMonth()]} ${d.getDate()}`;
                        });
                        bountiesStartCSV = dates.join(', ');
                    } catch (e) {}
                }

                // Collectibles - parse date+time+duration
                const collectiblesStartDate = GM_getValue('halloween_competition_start_date', '');
                const collectiblesStartTime = GM_getValue('halloween_competition_start_time', '');
                const collectiblesDuration = GM_getValue('halloween_competition_duration', 7);
                let collectiblesStart = null;
                let collectiblesEnd = null;
                if (collectiblesStartDate && collectiblesStartTime) {
                    try {
                        const [year, month, day] = collectiblesStartDate.split('-').map(Number);
                        const [hours, minutes] = collectiblesStartTime.split(':').map(Number);
                        collectiblesStart = Math.floor(Date.UTC(year, month - 1, day, hours, minutes, 0) / 1000);
                        collectiblesEnd = collectiblesStart + (collectiblesDuration * 24 * 60 * 60);
                    } catch (e) {}
                }

                const lateJoiner = GM_getValue('halloween_late_joiner_adjusted', false);

                // [COMPETITION STATUS]
                const globalActive = globalStart && globalEnd && now >= globalStart && now <= globalEnd;
                const spookyActive = spookyStart && spookyEnd && now >= spookyStart && now <= spookyEnd;
                const collectiblesActive = collectiblesStart && collectiblesEnd && now >= collectiblesStart && now <= collectiblesEnd;

                // [CONFIGURATION]
                const etherealSeed = (typeof SeedManager !== 'undefined' && SeedManager) ? (SeedManager.getSeed('diagnostic') || 'Not Set') : 'Not Set';
                const isLeader = (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY);
                const preloadDone = GM_getValue('halloween_manual_import_done', false);
                const collectionsFirebaseURL = this.competitionSettings?.collectionsFirebaseURL;
                const attackLogsFirebaseURL = (typeof FactionConfig !== 'undefined' && FactionConfig) ? FactionConfig.getConfig().attackLogsFirebaseURL : null;

                // [TRACKING STATUS]
                const defeatMode = apiMode ? 'API Mode' : 'Firebase Mode';
                const stats = (apiMode && typeof APIDefeatVerification !== 'undefined' && APIDefeatVerification)
                    ? (APIDefeatVerification.getStats() || {})
                    : (typeof FirebaseDefeatVerification !== 'undefined' && FirebaseDefeatVerification)
                    ? (FirebaseDefeatVerification.getStats() || {})
                    : {};
                const soulsBanished = stats.uniqueDefeats || 0;

                // Count unique encounters directly from storage
                const encountersJSON = GM_getValue('halloween_encounters', '{}');
                let targetsFound = 0;
                try {
                    const encounters = JSON.parse(encountersJSON);
                    targetsFound = Object.keys(encounters).length;
                } catch (e) {
                    HalloweenDebug.log(1, '⚠️ Failed to parse encounters:', e.message);
                }

                const bountyClaims = (typeof BountyManager !== 'undefined' && BountyManager) ? (BountyManager.getClaims() || {}) : {};
                const bountiesClaimed = Object.keys(bountyClaims).filter(id => bountyClaims[id]?.verified).length;

                const collectiblesJSON = GM_getValue('halloween_collectibles', '{}');
                let pumpkinCounts = { white: 0, candy: 0, cyber: 0, corrupt: 0, gold: 0 };
                try {
                    pumpkinCounts = JSON.parse(collectiblesJSON);
                } catch (e) {
                    HalloweenDebug.log(1, '⚠️ Failed to parse collectibles:', e.message);
                }

                // [TECHNICAL]
                const scriptVersion = GM_info.script.version;
                const isPDA = navigator.userAgent.includes('com.manuito.tornpda');
                const debugLevel = GM_getValue('hallo_debug_level', 0);
                const lastAPIRefresh = GM_getValue('halloween_api_last_refresh', null);
                const collectionComplete = GM_getValue('halloween_api_collection_complete', false);

                // Build diagnostic text
                const diagnosticText = `=== HALLOWEEN SCRIPT DIAGNOSTICS ===
Generated: ${generatedTime}

[PLAYER IDENTITY]
Member ID: ${playerID}
API Mode: ${apiMode ? 'Yes' : 'No'}
API Member Name: ${apiMemberName}

[ENROLLMENT]
Global Competition Start: ${formatTimestamp(globalStart)}
Spooky Targets Start: ${formatTimestamp(spookyStart)}
Bounties Start: ${bountiesStartCSV}
Collectibles Start: ${formatTimestamp(collectiblesStart)}
Late Joiner (Pumpkins): ${lateJoiner ? 'Yes' : 'No'}

[COMPETITION STATUS]
Global Competition: ${globalActive ? 'Active' : 'Inactive'} (${globalStart ? new Date(globalStart * 1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A'} - ${globalEnd ? new Date(globalEnd * 1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A'})
Spooky Targets: ${spookyActive ? 'Active' : 'Inactive'} (${spookyStart ? new Date(spookyStart * 1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A'} - ${spookyEnd ? new Date(spookyEnd * 1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A'})
Bounties: ${bountyActive ? 'Active' : 'Inactive'} (${bountyCount} bounties, Testing: ${bountyTesting ? 'Yes' : 'No'})
Collectibles: ${collectiblesActive ? 'Active' : 'Inactive'} (${collectiblesStart ? new Date(collectiblesStart * 1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A'} - ${collectiblesEnd ? new Date(collectiblesEnd * 1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A'})

[CONFIGURATION]
Ethereal Seed: ${etherealSeed}
Leader: ${isLeader ? 'Yes' : 'No'}
Preload Config: ${preloadDone ? 'Complete' : 'Not Set'}
Firebase URL (Collections): ${collectionsFirebaseURL ? 'Configured' : 'Missing'}
Firebase URL (Attacks): ${attackLogsFirebaseURL ? 'Configured' : 'Missing'}

[TRACKING STATUS]
Defeat Verification: ${defeatMode}
Souls Banished: ${soulsBanished}
Targets Found: ${targetsFound}
Bounties Claimed: ${bountiesClaimed}/${bountyCount}
Pumpkins: White(${pumpkinCounts.white || 0}) Candy(${pumpkinCounts.candy || 0}) Cyber(${pumpkinCounts.cyber || 0}) Corrupt(${pumpkinCounts.corrupt || 0}) Gold(${pumpkinCounts.gold || 0})

[TECHNICAL]
Script Version: ${scriptVersion}
PDA Detected: ${isPDA ? 'Yes' : 'No'}
Debug: ${debugLevel}
Last API Refresh: ${lastAPIRefresh ? formatTimestamp(lastAPIRefresh) : 'Never'}
Collection Complete: ${collectionComplete ? 'Yes' : 'No'}

=== END DIAGNOSTICS ===`;

                // Create modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100000;
                    font-family: 'Fjalla One', 'Orbitron', sans-serif;
                `;

                const content = document.createElement('div');
                content.style.cssText = `
                    background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%);
                    border: 2px solid var(--carved-cyan);
                    border-radius: 8px;
                    padding: 20px;
                    max-width: 800px;
                    width: 90%;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
                `;

                const title = document.createElement('h2');
                title.textContent = 'Script Diagnostics';
                title.style.cssText = `
                    color: var(--carved-cyan);
                    margin: 0 0 15px 0;
                    font-size: 20px;
                    text-align: center;
                `;

                const textarea = document.createElement('textarea');
                textarea.value = diagnosticText;
                textarea.readOnly = true;
                textarea.style.cssText = `
                    width: 100%;
                    height: 400px;
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid var(--carved-magenta);
                    border-radius: 4px;
                    color: #fff;
                    font-size: 11px;
                    font-family: monospace;
                    resize: vertical;
                    box-sizing: border-box;
                    margin-bottom: 15px;
                    overflow-y: auto;
                `;

                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                `;

                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Copy to Clipboard';
                copyBtn.style.cssText = `
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.2s;
                `;

                copyBtn.addEventListener('click', () => {
                    textarea.select();
                    document.execCommand('copy');
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy to Clipboard';
                    }, 2000);
                });

                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Close';
                closeBtn.style.cssText = `
                    padding: 10px 20px;
                    background: rgba(0, 255, 255, 0.2);
                    color: var(--carved-cyan);
                    border: 1px solid var(--carved-cyan);
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.2s;
                `;

                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });

                buttonContainer.appendChild(copyBtn);
                buttonContainer.appendChild(closeBtn);

                content.appendChild(title);
                content.appendChild(textarea);
                content.appendChild(buttonContainer);
                modal.appendChild(content);

                document.body.appendChild(modal);

                // Also log to console
                console.log(diagnosticText);
                HalloweenDebug.log(1, '📊 Full config diagnostic generated');

            } catch (e) {
                this.showArcaneToast('Error generating diagnostic', 'error');
                HalloweenDebug.log(1, `⚠️ Show full config error: ${e.message}`);
            }
        },

        flushAPIMode: function(command) {
            try {
                // Extract player ID from command (format: sc.flushapi.3037268)
                const parts = command.split('.');
                if (parts.length !== 3) {
                    this.showArcaneToast('Invalid command format. Use: sc.flushapi.<playerid>', 'error');
                    return;
                }

                const playerId = parts[2].trim();
                if (!playerId || playerId.length < 3) {
                    this.showArcaneToast('Invalid player ID', 'error');
                    return;
                }

                // Delete all API-related GM storage keys
                GM_deleteValue('halloween_api_mode');
                GM_deleteValue('halloween_api_key');
                GM_deleteValue('halloween_api_member_id');
                GM_deleteValue('halloween_api_member_name');
                GM_deleteValue('halloween_api_start_timestamp');
                GM_deleteValue('halloween_api_last_refresh');
                GM_deleteValue('halloween_api_all_attacks');
                GM_deleteValue('halloween_api_pending_verifications');
                GM_deleteValue('halloween_api_last_bounty_check');
                GM_deleteValue('halloween_api_last_midnight_sweep');
                GM_deleteValue('halloween_api_last_manual_refresh');
                GM_deleteValue('halloween_api_last_saved_timestamp');
                GM_deleteValue('halloween_api_testing_mode');
                GM_deleteValue('halloween_api_override_enabled');
                GM_deleteValue('halloween_api_override_timestamp');
                GM_deleteValue('halloween_api_period_enabled');
                GM_deleteValue('halloween_api_period_start');
                GM_deleteValue('halloween_api_period_duration');

                // Set player ID to provided value (restores Member ID mode)
                GM_setValue('halloween_player_id', playerId);

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                this.showArcaneToast(`API mode flushed. Player ID restored to ${playerId}. Refresh page to continue.`, 'success');
                HalloweenDebug.log(1, `🔄 API mode flushed. Player ID restored to ${playerId}`);

            } catch (e) {
                this.showArcaneToast('Error flushing API mode', 'error');
                HalloweenDebug.log(1, `⚠️ Flush API mode error: ${e.message}`);
            }
        },

        updateBounty: function(command) {
            try {
                // Extract date and URL from command (format: sc.updatebounty.2025-10-26.https://www.torn.com/profiles.php?XID=3037268)
                const parts = command.split('.');

                // Need at least: sc, updatebounty, date, and URL parts
                if (parts.length < 4) {
                    this.showArcaneToast('Invalid command format. Use: sc.updatebounty.YYYY-MM-DD.URL', 'error');
                    return;
                }

                const date = parts[2].trim();
                // Rejoin remaining parts in case URL contains dots
                const url = parts.slice(3).join('.');

                // Validate date format (basic check)
                if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    this.showArcaneToast('Invalid date format. Use: YYYY-MM-DD', 'error');
                    return;
                }

                // Validate URL
                if (!url.startsWith('http')) {
                    this.showArcaneToast('Invalid URL. Must start with http:// or https://', 'error');
                    return;
                }

                // Load existing bounty config
                const configStr = GM_getValue('halloween_bounty_config', '{}');
                let config;
                try {
                    config = JSON.parse(configStr);
                } catch (e) {
                    this.showArcaneToast('Failed to parse bounty config', 'error');
                    return;
                }

                // Ensure bounties array exists
                if (!config.bounties || !Array.isArray(config.bounties)) {
                    this.showArcaneToast('No bounties found in config', 'error');
                    return;
                }

                // Find bounty with matching date
                const bountyIndex = config.bounties.findIndex(b => b.date === date);

                if (bountyIndex === -1) {
                    this.showArcaneToast(`No bounty found for date: ${date}`, 'error');
                    return;
                }

                // Update the bounty URL
                const oldUrl = config.bounties[bountyIndex].url;
                config.bounties[bountyIndex].url = url;

                // Save updated config
                GM_setValue('halloween_bounty_config', JSON.stringify(config));

                // Update BountyManager if available
                if (typeof BountyManager !== 'undefined' && BountyManager.loadConfig) {
                    BountyManager.loadConfig();
                }

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                this.showArcaneToast(`Bounty for ${date} updated successfully`, 'success');
                HalloweenDebug.log(1, `🔥 Updated bounty for ${date}: ${oldUrl} → ${url}`);

            } catch (e) {
                this.showArcaneToast('Error updating bounty', 'error');
                HalloweenDebug.log(1, `⚠️ Update bounty error: ${e.message}`);
            }
        },

        auditAPIData: function() {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled', 'error');
                    return;
                }

                // Get master date range
                const { masterStart, masterEnd } = APIDefeatVerification.getMasterDateRange();

                if (!masterStart) {
                    this.showArcaneToast('No competition dates configured', 'error');
                    return;
                }

                // Get current timestamp
                const now = Math.floor(Date.now() / 1000);

                // Use current time as end (don't go into the future)
                const auditEnd = Math.min(now, masterEnd || now);

                // Count existing attacks before audit
                const beforeCount = Object.keys(APIDefeatVerification.getAllAttacks()).length;

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                const startDate = new Date(masterStart * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
                const endDate = new Date(auditEnd * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

                this.showArcaneToast(`Auditing API data: ${startDate} to ${endDate}. Please wait...`, 'success', 10000);
                HalloweenDebug.log(1, `🔍 Starting API audit: ${startDate} to ${endDate}`);

                // Trigger audit collection
                setTimeout(() => {
                    if (APIDefeatVerification && APIDefeatVerification.auditAPICollection) {
                        APIDefeatVerification.auditAPICollection(masterStart, auditEnd, beforeCount);
                    }
                }, 1000);

            } catch (e) {
                this.showArcaneToast('Error starting API audit', 'error');
                HalloweenDebug.log(1, `⚠️ API audit error: ${e.message}`);
            }
        },

        syncDefeatsFromAPI: function() {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled', 'error');
                    return;
                }

                // Get spooky competition dates
                const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
                const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
                const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
                const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

                if (!spookyStartDate || !spookyEndDate) {
                    this.showArcaneToast('No spooky competition dates configured', 'error');
                    return;
                }

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                const spookyStart = new Date(`${spookyStartDate}T${spookyStartTime}:00Z`).getTime() / 1000;
                const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}:59Z`).getTime() / 1000;

                const startDate = new Date(spookyStart * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
                const endDate = new Date(spookyEnd * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

                this.showArcaneToast(`Syncing defeats from API data: ${startDate} to ${endDate}. Please wait...`, 'success', 10000);
                HalloweenDebug.log(1, `🔄 Starting defeat sync: ${startDate} to ${endDate}`);

                // Trigger scan
                setTimeout(() => {
                    if (APIDefeatVerification && APIDefeatVerification.scanStoredAttacks) {
                        APIDefeatVerification.scanStoredAttacks(spookyStart, spookyEnd);
                    }
                }, 1000);

            } catch (e) {
                this.showArcaneToast('Error starting defeat sync', 'error');
                HalloweenDebug.log(1, `⚠️ Defeat sync error: ${e.message}`);
            }
        },

        showUnverifiedDefeats: function() {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled - unverified tracking only available in API mode', 'error', 10000);
                    return;
                }

                // Read unverified defeats directly from storage
                const unverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
                const unverified = safeParse(unverifiedValue, '[]');

                if (unverified.length === 0) {
                    this.showArcaneToast('No unverified defeats', 'success', 5000);
                    return;
                }

                // Update to object format if needed (migration)
                const unverifiedList = unverified.map(item =>
                    typeof item === 'string' ? { defenderId: item, lastCheck: 0 } : item
                );

                // Sort by lastCheck timestamp (newest first)
                unverifiedList.sort((a, b) => (b.lastCheck || 0) - (a.lastCheck || 0));

                // Generate output text
                let outputText = `=== UNVERIFIED DEFEATS ===\n`;
                outputText += `Total: ${unverified.length}\n`;
                outputText += `Generated: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC\n\n`;

                unverifiedList.forEach((item, index) => {
                    const defenderId = item.defenderId;
                    const lastCheck = item.lastCheck || 0;
                    const checkDate = lastCheck > 0
                        ? new Date(lastCheck * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
                        : 'Unknown';

                    outputText += `${index + 1}. Player ID: ${defenderId}\n`;
                    outputText += `   Last Checked: ${checkDate}\n`;
                    outputText += `   Profile: https://www.torn.com/profiles.php?XID=${defenderId}\n\n`;
                });

                outputText += `=== END UNVERIFIED DEFEATS ===`;

                // Create modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                `;

                const content = document.createElement('div');
                content.style.cssText = `
                    background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(30, 30, 40, 0.95) 100%);
                    padding: 25px;
                    border-radius: 8px;
                    border: 2px solid var(--carved-magenta);
                    box-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                `;

                const title = document.createElement('h3');
                title.textContent = '❌ Unverified Defeats';
                title.style.cssText = `
                    color: var(--carved-magenta);
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    text-align: center;
                `;

                const textarea = document.createElement('textarea');
                textarea.value = outputText;
                textarea.readOnly = true;
                textarea.style.cssText = `
                    width: 100%;
                    height: 400px;
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid var(--carved-magenta);
                    border-radius: 4px;
                    color: #fff;
                    font-size: 11px;
                    font-family: monospace;
                    resize: vertical;
                    box-sizing: border-box;
                    margin-bottom: 15px;
                    overflow-y: auto;
                `;

                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                `;

                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Copy to Clipboard';
                copyBtn.style.cssText = `
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.2s;
                `;

                copyBtn.addEventListener('click', () => {
                    textarea.select();
                    document.execCommand('copy');
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy to Clipboard';
                    }, 2000);
                });

                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Close';
                closeBtn.style.cssText = `
                    padding: 10px 20px;
                    background: rgba(0, 255, 255, 0.2);
                    color: var(--carved-cyan);
                    border: 1px solid var(--carved-cyan);
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.2s;
                `;

                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });

                buttonContainer.appendChild(copyBtn);
                buttonContainer.appendChild(closeBtn);

                content.appendChild(title);
                content.appendChild(textarea);
                content.appendChild(buttonContainer);
                modal.appendChild(content);

                document.body.appendChild(modal);

                // Also log to console
                console.log(outputText);
                HalloweenDebug.log(1, `❌ Showing ${unverified.length} unverified defeats`);

            } catch (e) {
                this.showArcaneToast('Error showing unverified defeats', 'error');
                HalloweenDebug.log(1, `⚠️ Show unverified error: ${e.message}`);
            }
        },

        setDebugLevelFromCommand: function(command) {
            try {
                // Extract debug level from command (format: sc.debug.2)
                const parts = command.split('.');
                if (parts.length !== 3) {
                    this.showArcaneToast('Invalid command format. Use: sc.debug.<0-3>', 'error');
                    return;
                }

                const level = parseInt(parts[2].trim());
                if (isNaN(level) || level < 0 || level > 3) {
                    this.showArcaneToast('Debug level must be 0-3', 'error');
                    return;
                }

                // Set debug level using HalloweenDebug
                HalloweenDebug.setLevel(level);

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                const levelNames = ['None', 'Basic', 'Detailed', 'Full'];
                this.showArcaneToast(`Debug level set to ${level} (${levelNames[level]})`, 'success');

            } catch (e) {
                this.showArcaneToast('Error setting debug level', 'error');
                HalloweenDebug.log(1, `⚠️ Set debug level error: ${e.message}`);
            }
        },

        showOldestAttackTimestamp: function() {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled', 'error', 10000);
                    return;
                }

                // Get all attacks (exclude historical)
                const allAttacks = APIDefeatVerification.getAllAttacks();
                const currentAttacks = Object.values(allAttacks).filter(a => !a.historical);
                const attackCount = currentAttacks.length;

                if (attackCount === 0) {
                    this.showArcaneToast('No current year attacks collected yet', 'error', 10000);
                    return;
                }

                // Find oldest timestamp (current year only)
                const timestamps = currentAttacks.map(a => a.timestamp_started);
                const oldestTimestamp = Math.min(...timestamps);
                const oldestDate = new Date(oldestTimestamp * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                // Show toast with 10 second duration
                this.showArcaneToast(`Oldest attack: ${oldestDate} (${attackCount} total)`, 'success', 10000);
                HalloweenDebug.log(1, `📊 Oldest attack timestamp: ${oldestTimestamp} (${oldestDate})`);

            } catch (e) {
                this.showArcaneToast('Error retrieving oldest attack', 'error', 10000);
                HalloweenDebug.log(1, `⚠️ Show oldest attack error: ${e.message}`);
            }
        },

        showNewestAttackTimestamp: function() {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled', 'error', 10000);
                    return;
                }

                // Get all attacks (exclude historical)
                const allAttacks = APIDefeatVerification.getAllAttacks();
                const currentAttacks = Object.values(allAttacks).filter(a => !a.historical);
                const attackCount = currentAttacks.length;

                if (attackCount === 0) {
                    this.showArcaneToast('No current year attacks collected yet', 'error', 10000);
                    return;
                }

                // Find newest timestamp (current year only)
                const timestamps = currentAttacks.map(a => a.timestamp_started);
                const newestTimestamp = Math.max(...timestamps);
                const newestDate = new Date(newestTimestamp * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                // Show toast with 10 second duration
                this.showArcaneToast(`Newest attack: ${newestDate} (${attackCount} total)`, 'success', 10000);
                HalloweenDebug.log(1, `📊 Newest attack timestamp: ${newestTimestamp} (${newestDate})`);

            } catch (e) {
                this.showArcaneToast('Error retrieving newest attack', 'error', 10000);
                HalloweenDebug.log(1, `⚠️ Show newest attack error: ${e.message}`);
            }
        },

        forceCollectionFrom: function(command) {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled', 'error');
                    return;
                }

                // Extract timestamp from command (format: sc.forceapifrom.1730000000)
                const parts = command.split('.');
                if (parts.length !== 3) {
                    this.showArcaneToast('Invalid format. Use: sc.forceapifrom.<timestamp>', 'error');
                    return;
                }

                const targetTimestamp = parseInt(parts[2].trim());
                if (isNaN(targetTimestamp) || targetTimestamp <= 0) {
                    this.showArcaneToast('Invalid timestamp', 'error');
                    return;
                }

                // Get current oldest attack (exclude historical)
                const allAttacks = APIDefeatVerification.getAllAttacks();
                const currentAttacks = Object.values(allAttacks).filter(a => !a.historical);
                let currentOldest = null;

                if (currentAttacks.length > 0) {
                    const timestamps = currentAttacks.map(a => a.timestamp_started);
                    currentOldest = Math.min(...timestamps);
                }

                // Validate: target must be earlier than current oldest (backfilling at start)
                if (currentOldest && targetTimestamp >= currentOldest) {
                    this.showArcaneToast('Target must be earlier than current oldest attack', 'error');
                    return;
                }

                // Clear completion flag to allow collection
                GM_deleteValue('halloween_api_collection_complete');

                // Set last saved timestamp to target (API will collect backward from here)
                GM_setValue('halloween_api_last_saved_timestamp', targetTimestamp);

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                const targetDate = new Date(targetTimestamp * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
                this.showArcaneToast(`Force collection from ${targetDate}. Triggering refresh...`, 'success');

                HalloweenDebug.log(1, `🔧 Force collection FROM: ${targetTimestamp} (${targetDate})`);

                // Trigger immediate API refresh (backfill from target timestamp)
                setTimeout(() => {
                    if (APIDefeatVerification && APIDefeatVerification.refreshAttackLog) {
                        APIDefeatVerification.refreshAttackLog();
                    }
                }, 1000);

            } catch (e) {
                this.showArcaneToast('Error executing force collection from', 'error');
                HalloweenDebug.log(1, `⚠️ Force collection from error: ${e.message}`);
            }
        },

        forceCollectionTo: function(command) {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled', 'error');
                    return;
                }

                // Extract timestamp from command (format: sc.forceapito.1730000000)
                const parts = command.split('.');
                if (parts.length !== 3) {
                    this.showArcaneToast('Invalid format. Use: sc.forceapito.<timestamp>', 'error');
                    return;
                }

                const targetTimestamp = parseInt(parts[2].trim());
                if (isNaN(targetTimestamp) || targetTimestamp <= 0) {
                    this.showArcaneToast('Invalid timestamp', 'error');
                    return;
                }

                // Get current newest attack (exclude historical)
                const allAttacks = APIDefeatVerification.getAllAttacks();
                const currentAttacks = Object.values(allAttacks).filter(a => !a.historical);
                let currentNewest = null;

                if (currentAttacks.length > 0) {
                    const timestamps = currentAttacks.map(a => a.timestamp_started);
                    currentNewest = Math.max(...timestamps);
                }

                // Validate: target must be later than current newest (extending at end)
                if (currentNewest && targetTimestamp <= currentNewest) {
                    this.showArcaneToast('Target must be later than current newest attack', 'error');
                    return;
                }

                // Clear completion flag to allow collection
                GM_deleteValue('halloween_api_collection_complete');

                // Update last saved timestamp to current newest (so API continues from there)
                if (currentNewest) {
                    GM_setValue('halloween_api_last_saved_timestamp', currentNewest);
                }

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                const targetDate = new Date(targetTimestamp * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
                this.showArcaneToast(`Force collection to ${targetDate}. Triggering refresh...`, 'success');

                HalloweenDebug.log(1, `🔧 Force collection TO: ${targetTimestamp} (${targetDate})`);
                HalloweenDebug.log(1, `🔧 Collection will continue until reaching target or newer`);

                // Trigger immediate API refresh (continue forward to target timestamp)
                setTimeout(() => {
                    if (APIDefeatVerification && APIDefeatVerification.refreshAttackLog) {
                        APIDefeatVerification.refreshAttackLog();
                    }
                }, 1000);

            } catch (e) {
                this.showArcaneToast('Error executing force collection to', 'error');
                HalloweenDebug.log(1, `⚠️ Force collection to error: ${e.message}`);
            }
        },

        setReportMode: function(mode) {
            try {
                // Validate mode
                if (mode !== '7d' && mode !== 'default') {
                    this.showArcaneToast('Invalid report mode. Use: 7d or default', 'error');
                    return;
                }

                // Set report mode flag
                GM_setValue('halloween_report_mode', mode);

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                const modeText = mode === '7d' ? 'Last 7 Days' : 'Global Competition Dates';
                this.showArcaneToast(`Report mode set to: ${modeText}`, 'success');

                HalloweenDebug.log(1, `📊 Report mode changed to: ${mode}`);

                // Refresh Battle Analytics if it's open
                const battleAnalyticsModal = document.getElementById('battle-analytics-modal');
                if (battleAnalyticsModal && battleAnalyticsModal.style.display === 'block') {
                    if (typeof APIDefeatVerification !== 'undefined' && APIDefeatVerification.calculateBattleAnalytics) {
                        APIDefeatVerification.calculateBattleAnalytics();
                        HalloweenDebug.log(1, '🔄 Battle Analytics refreshed with new date range');
                    }
                }

                // Refresh Halloweek Stats if needed
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateHalloweekStats) {
                    HalloweenUI.updateHalloweekStats();
                    HalloweenDebug.log(1, '🔄 Halloweek Stats refreshed with new date range');
                }

                // Refresh menu content to update date range display
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateMenuContent) {
                    HalloweenUI.updateMenuContent();
                    HalloweenDebug.log(1, '🔄 Menu content refreshed with new date range');
                }

            } catch (e) {
                this.showArcaneToast('Error setting report mode', 'error');
                HalloweenDebug.log(1, `⚠️ Set report mode error: ${e.message}`);
            }
        },

        collect7dHistorical: function(command) {
            try {
                // Check if API mode is enabled
                if (!APIDefeatVerification || !APIDefeatVerification.isAPIMode || !APIDefeatVerification.isAPIMode()) {
                    this.showArcaneToast('API mode not enabled', 'error');
                    return;
                }

                // Extract timestamp from command (format: sc.collect7dhistorical.1698192000)
                const parts = command.split('.');
                if (parts.length !== 3) {
                    this.showArcaneToast('Invalid format. Use: sc.collect7dhistorical.<timestamp>', 'error');
                    return;
                }

                const targetStart = parseInt(parts[2].trim());
                if (isNaN(targetStart) || targetStart <= 0) {
                    this.showArcaneToast('Invalid timestamp', 'error');
                    return;
                }

                // Calculate 7-day end timestamp
                const targetEnd = targetStart + (7 * 24 * 60 * 60);

                // Check collection state
                const historicPeriodStart = GM_getValue('halloween_historical_period_start', 0);
                const historicPeriodEnd = GM_getValue('halloween_historical_period_end', 0);
                const historicComplete = GM_getValue('halloween_historical_complete', false);

                if (historicComplete) {
                    // Already complete
                    this.showArcaneToast('Historical collection already complete. Use sc.clearhistorical to reset.', 'error');
                    return;
                }

                if (historicPeriodStart > 0 && historicPeriodStart !== targetStart) {
                    // Different period in progress
                    const existingDate = new Date(historicPeriodStart * 1000).toISOString().split('T')[0];
                    this.showArcaneToast(`Different historical period in progress (${existingDate}). Use sc.clearhistorical first.`, 'error');
                    return;
                }

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                if (historicPeriodStart > 0) {
                    // Resuming interrupted collection
                    const allAttacks = APIDefeatVerification.getAllAttacks();
                    const historicalAttacks = Object.values(allAttacks).filter(a => a.historical);

                    if (historicalAttacks.length > 0) {
                        const timestamps = historicalAttacks.map(a => a.timestamp_started);
                        const newestHistorical = Math.max(...timestamps);

                        // Resume from newest historical + 1
                        HalloweenDebug.log(1, `🔄 Resuming historical collection from ${new Date((newestHistorical + 1) * 1000).toISOString()}`);
                    }

                    this.showArcaneToast(`Resuming historical collection: ${new Date(targetStart * 1000).toISOString().split('T')[0]} - 7 days. Do not close panel.`, 'success', 30000);
                } else {
                    // Fresh collection - set flags
                    GM_setValue('halloween_historical_period_start', targetStart);
                    GM_setValue('halloween_historical_period_end', targetEnd);

                    const startDate = new Date(targetStart * 1000).toISOString().split('T')[0];
                    const endDate = new Date(targetEnd * 1000).toISOString().split('T')[0];
                    this.showArcaneToast(`Collecting historical data: ${startDate} to ${endDate}. Do not close panel.`, 'success', 30000);

                    HalloweenDebug.log(1, `📊 Starting 7-day historical collection: ${startDate} to ${endDate}`);
                }

                // Trigger historical collection
                if (typeof APIDefeatVerification !== 'undefined' && APIDefeatVerification.refreshHistoricalAttackLog) {
                    setTimeout(() => {
                        APIDefeatVerification.refreshHistoricalAttackLog();
                    }, 1000);
                }

            } catch (e) {
                this.showArcaneToast('Error starting historical collection', 'error');
                HalloweenDebug.log(1, `⚠️ Historical collection error: ${e.message}`);
            }
        },

        clearHistorical: function() {
            try {
                const allAttacks = APIDefeatVerification.getAllAttacks();
                const historicalCount = Object.values(allAttacks).filter(a => a.historical).length;

                if (historicalCount === 0) {
                    this.showArcaneToast('No historical data to clear', 'error');
                    return;
                }

                // Remove all historical attacks (PDA-safe for loop)
                const filtered = {};
                for (const [id, attack] of Object.entries(allAttacks)) {
                    if (!attack.historical) {
                        filtered[id] = attack;
                    }
                }

                GM_setValue('halloween_api_all_attacks', JSON.stringify(filtered));

                // Clear integrity flags
                GM_deleteValue('halloween_historical_period_start');
                GM_deleteValue('halloween_historical_period_end');
                GM_deleteValue('halloween_historical_complete');

                // Clear textarea
                const textarea = document.getElementById('halloween-import-json');
                if (textarea) {
                    textarea.value = '';
                }

                this.showArcaneToast(`Cleared ${historicalCount} historical attacks`, 'success');
                HalloweenDebug.log(1, `🗑️ Cleared ${historicalCount} historical attacks`);

            } catch (e) {
                this.showArcaneToast('Error clearing historical data', 'error');
                HalloweenDebug.log(1, `⚠️ Clear historical error: ${e.message}`);
            }
        },

        showHistoricalReport: function() {
            try {
                const historicPeriodStart = GM_getValue('halloween_historical_period_start', 0);
                const historicPeriodEnd = GM_getValue('halloween_historical_period_end', 0);
                const historicComplete = GM_getValue('halloween_historical_complete', false);

                if (!historicPeriodStart) {
                    this.showArcaneToast('No historical data found. Use sc.collect7dhistorical.<start> first.', 'error');
                    return;
                }

                if (!historicComplete) {
                    this.showArcaneToast('Historical collection incomplete. Please re-run sc.collect7dhistorical.<start>', 'error');
                    return;
                }

                // Set report mode to historical
                GM_setValue('halloween_report_mode', 'historical');

                // Show success toast with date range
                const startDate = new Date(historicPeriodStart * 1000).toISOString().split('T')[0];
                const endDate = new Date(historicPeriodEnd * 1000).toISOString().split('T')[0];
                this.showArcaneToast(`Report mode: Historical (${startDate} to ${endDate})`, 'success');

                HalloweenDebug.log(1, `📊 Report mode changed to historical: ${startDate} to ${endDate}`);

                // Refresh Battle Analytics if it's open
                const battleAnalyticsModal = document.getElementById('battle-analytics-modal');
                if (battleAnalyticsModal && battleAnalyticsModal.style.display === 'block') {
                    if (typeof APIDefeatVerification !== 'undefined' && APIDefeatVerification.calculateBattleAnalytics) {
                        APIDefeatVerification.calculateBattleAnalytics();
                        HalloweenDebug.log(1, '🔄 Battle Analytics refreshed with historical date range');
                    }
                }

                // Refresh Halloweek Stats
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateHalloweekStats) {
                    HalloweenUI.updateHalloweekStats();
                    HalloweenDebug.log(1, '🔄 Halloweek Stats refreshed with historical date range');
                }

                // Refresh menu content to update date range display
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateMenuContent) {
                    HalloweenUI.updateMenuContent();
                    HalloweenDebug.log(1, '🔄 Menu content refreshed with new date range');
                }

            } catch (e) {
                this.showArcaneToast('Error showing historical report', 'error');
                HalloweenDebug.log(1, `⚠️ Show historical report error: ${e.message}`);
            }
        },

        reconfigGlobalStart: function(command) {
            try {
                // Extract HHMM from command (format: sc.reconfig.globalstart.1130)
                const parts = command.split('.');
                const timeStr = parts[parts.length - 1];

                // Validate HHMM format (4 digits)
                if (!/^\d{4}$/.test(timeStr)) {
                    this.showArcaneToast('Invalid time format. Use HHMM (e.g., 1130 for 11:30)', 'error');
                    return;
                }

                const hours = parseInt(timeStr.substring(0, 2));
                const minutes = parseInt(timeStr.substring(2, 4));

                // Validate time range
                if (hours > 23 || minutes > 59) {
                    this.showArcaneToast('Invalid time. Hours: 00-23, Minutes: 00-59', 'error');
                    return;
                }

                // Get current timestamps
                const startTimestamp = GM_getValue('halloween_competition_start_timestamp', 0);
                const endTimestamp = GM_getValue('halloween_competition_end_timestamp', 0);

                if (!startTimestamp || !endTimestamp) {
                    this.showArcaneToast('No competition times configured yet', 'error');
                    return;
                }

                // Parse to Date objects (Unix timestamps are in seconds)
                const startDate = new Date(startTimestamp * 1000);
                const endDate = new Date(endTimestamp * 1000);

                // Set new time (keeping date intact) - use UTC methods for GMT/TCT
                startDate.setUTCHours(hours, minutes, 0, 0);
                endDate.setUTCHours(hours, minutes, 0, 0);

                // Convert back to Unix timestamps (seconds)
                const newStartTimestamp = Math.floor(startDate.getTime() / 1000);
                const newEndTimestamp = Math.floor(endDate.getTime() / 1000);

                // Save new timestamps
                GM_setValue('halloween_competition_start_timestamp', newStartTimestamp);
                GM_setValue('halloween_competition_end_timestamp', newEndTimestamp);

                // Format for display
                const startStr = startDate.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                });
                const endStr = endDate.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                });

                this.showArcaneToast(`Competition times updated: ${startStr} to ${endStr}`, 'success', 8000);
                HalloweenDebug.log(1, `📅 Global start/end times reconfigured: ${startStr} to ${endStr}`);

                // API Mode: Trigger backfill if NOW is after new start time
                if (typeof APIDefeatVerification !== 'undefined' && APIDefeatVerification.isAPIMode()) {
                    const now = Math.floor(Date.now() / 1000);

                    if (now > newStartTimestamp) {
                        // Trigger backfill from new start time
                        HalloweenDebug.log(1, '📡 Triggering API backfill from revised start time...');
                        this.showArcaneToast('Backfilling API data from revised start time...', 'info', 5000);

                        if (typeof APIDefeatVerification.forceCollectionFrom === 'function') {
                            APIDefeatVerification.forceCollectionFrom(newStartTimestamp);
                        }
                    } else {
                        HalloweenDebug.log(1, '⏰ New start time is in future - no API backfill needed');
                    }
                }

                // Refresh menu content to update any displays
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateMenuContent) {
                    HalloweenUI.updateMenuContent();
                }

            } catch (e) {
                this.showArcaneToast('Error reconfiguring global start time', 'error');
                HalloweenDebug.log(1, `⚠️ Reconfig global start error: ${e.message}`);
            }
        },

        excludePlayer: function(command) {
            try {
                // Extract player ID from command (format: sc.excludeplayer.1234567)
                const parts = command.split('.');
                const playerID = parts[parts.length - 1];

                // Validate player ID format (5-8 digits)
                if (!/^\d{5,8}$/.test(playerID)) {
                    this.showArcaneToast('Invalid player ID format (must be 5-8 digits)', 'error');
                    return;
                }

                // Add to exclusion list using SeedManager
                const success = SeedManager.addExcludedPlayer(playerID);

                if (success) {
                    // Clear textarea
                    const textarea = document.getElementById('halloween-import-json');
                    if (textarea) {
                        textarea.value = '';
                    }

                    // Refresh excluded IDs textarea if visible
                    const excludedIdsTextarea = document.getElementById('excluded-ids-textarea');
                    if (excludedIdsTextarea && excludedIdsTextarea.offsetParent !== null) {
                        HalloweenUI.populateExcludedIds();
                    }
                }

            } catch (e) {
                this.showArcaneToast('Error excluding player', 'error');
                HalloweenDebug.log(1, `⚠️ Exclude player error: ${e.message}`);
            }
        },

        includePlayer: function(command) {
            try {
                // Extract player ID from command (format: sc.includeplayer.1234567)
                const parts = command.split('.');
                const playerID = parts[parts.length - 1];

                // Validate player ID format (5-8 digits)
                if (!/^\d{5,8}$/.test(playerID)) {
                    this.showArcaneToast('Invalid player ID format (must be 5-8 digits)', 'error');
                    return;
                }

                // Remove from exclusion list using SeedManager
                const success = SeedManager.removeExcludedPlayer(playerID);

                if (success) {
                    // Clear textarea
                    const textarea = document.getElementById('halloween-import-json');
                    if (textarea) {
                        textarea.value = '';
                    }

                    // Refresh excluded IDs textarea if visible
                    const excludedIdsTextarea = document.getElementById('excluded-ids-textarea');
                    if (excludedIdsTextarea && excludedIdsTextarea.offsetParent !== null) {
                        HalloweenUI.populateExcludedIds();
                    }
                }

            } catch (e) {
                this.showArcaneToast('Error including player', 'error');
                HalloweenDebug.log(1, `⚠️ Include player error: ${e.message}`);
            }
        },

        showArcaneToast: function(message, type = 'success', duration = 5000) {
            const toast = document.getElementById('arcane-rituals-toast');
            if (!toast) return;

            // Clear any existing timer to prevent premature hiding
            if (this.arcaneToastTimer) {
                clearTimeout(this.arcaneToastTimer);
                this.arcaneToastTimer = null;
            }

            // Style based on type
            if (type === 'success') {
                toast.style.background = 'rgba(0, 255, 0, 0.1)';
                toast.style.border = '1px solid rgba(0, 255, 0, 0.3)';
                toast.style.color = '#00ff00';
            } else if (type === 'error') {
                toast.style.background = 'rgba(255, 0, 0, 0.1)';
                toast.style.border = '1px solid rgba(255, 0, 0, 0.3)';
                toast.style.color = '#ff4444';
            }

            toast.textContent = message;
            toast.style.display = 'block';

            // Auto-hide after specified duration
            this.arcaneToastTimer = setTimeout(() => this.hideArcaneToast(), duration);
        },

        hideArcaneToast: function() {
            const toast = document.getElementById('arcane-rituals-toast');
            if (toast) {
                toast.style.display = 'none';
            }
        },

        getPersonalStats: function() {
            // Use GM storage for verified defeats (from Firebase verification system)
            const defeatsValue = GM_getValue('halloween_defeats_counted', '[]');
            const defeatsArray = safeParse(defeatsValue, '[]');
            const encountersValue = GM_getValue('halloween_encounters', '{}');
            const encounters = safeParse(encountersValue, '{}');

            // Calculate total encounters (sum of all encounter counts)
            let totalEncounters = 0;
            Object.values(encounters).forEach(encounter => {
                totalEncounters += encounter.encounterCount || 1;
            });

            return {
                uniqueDefeats: defeatsArray.length, // GM defeats_counted is array of defender IDs
                totalDefeats: totalEncounters, // Keep this name for now to avoid breaking existing code
                uniqueEncounters: Object.keys(encounters).length // Direct count of unique player IDs
            };
        },

        // recordDefeat has been replaced by FirebaseDefeatVerification system
        // Defeats are now verified via Firebase and tracked in GM storage

        // Halloween Ticker Hijacking System
        initTickerHijacking: function() {
            // Check if ticker exists and announcements are enabled
            const ticker = document.querySelector('#news-ticker-slider-wrapper');
            if (!ticker || !this.halloweenAnnouncements || this.halloweenAnnouncements.length === 0) {
                return;
            }

            const enabledAnnouncements = this.halloweenAnnouncements.filter(ann => ann.enabled && ann.message.trim() !== '');
            if (enabledAnnouncements.length === 0) {
                return;
            }

            HalloweenDebug.log(1, '🎃 Initializing Halloween ticker hijacking...');
            this.currentAnnouncementIndex = 0;
            this.startTickerMonitoring();
        },

        startTickerMonitoring: function() {
            // Watch for Torn's ticker animation class changes, then hijack 4 seconds after
            const tickerWrapper = document.getElementById('news-ticker-slider-wrapper');
            if (!tickerWrapper) {
                HalloweenDebug.log(2, '🎃 No ticker wrapper found for monitoring');
                return;
            }

            let hasDetectedChange = false;
            const observer = new MutationObserver((mutations) => {
                // Watch for class changes on any descendant
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const currentClasses = mutation.target.className;

                        // Detect when class includes 'news-ticker-enter-active' (new ticker is entering)
                        if (currentClasses.includes('news-ticker-enter-active') && !hasDetectedChange) {
                            hasDetectedChange = true;
                            observer.disconnect();
                            HalloweenDebug.log(2, '🎃 Torn ticker change detected (news-ticker-enter-active), hijacking in 4 seconds...');

                            // Wait 4 seconds after Torn's ticker change, then start our hijack schedule
                            setTimeout(() => {
                                this.attemptTickerHijack();
                            }, 4000);
                        }
                    }
                });
            });

            // Watch for class attribute changes on wrapper and all descendants
            observer.observe(tickerWrapper, {
                attributes: true,
                attributeFilter: ['class'],
                subtree: true  // Watch all descendants
            });

            HalloweenDebug.log(1, '🎃 Ticker monitoring started - waiting for first Torn ticker change');
            // Note: Subsequent hijacks are scheduled recursively after each hijack completes
            // This ensures the frequency delay happens BETWEEN hijacks, not overlapping with display time
        },

        attemptTickerHijack: function() {
            const headlineContent = document.querySelector('.headline-content span');
            if (!headlineContent) {
                HalloweenDebug.log(2, '🎃 No headline content found, skipping hijack');
                return;
            }

            // Check stability
            const currentContent = headlineContent.innerHTML;

            setTimeout(() => {
                const checkContent = document.querySelector('.headline-content span');
                if (checkContent && checkContent.innerHTML === currentContent) {
                    this.hijackTicker();
                } else {
                    HalloweenDebug.log(2, '🎃 Ticker unstable, skipping this cycle');
                }
            }, 500);
        },

        hijackTicker: function() {
            const headlineContent = document.querySelector('.headline-content span');
            const scrollWrap = document.querySelector('.scroll-wrap');

            if (!headlineContent || !scrollWrap) {
                HalloweenDebug.log(2, '🎃 Missing ticker elements');
                return;
            }

            // Get enabled regular announcements
            const enabledRegularAnnouncements = this.halloweenAnnouncements.filter(ann => ann.enabled && ann.message.trim() !== '');

            // Get today's date in dd/mm/yyyy format
            const today = new Date();
            const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

            // Get date-specific announcements that match today's date
            const todayDateAnnouncements = (this.dateAnnouncements || []).filter(ann => {
                return ann.message && ann.message.trim() !== '' && ann.date === todayStr;
            });

            // Merge both pools
            let announcementPool = [
                ...enabledRegularAnnouncements.map(a => ({ message: a.message })),
                ...todayDateAnnouncements.map(a => ({ message: a.message }))
            ];

            if (announcementPool.length === 0) {
                return;
            }

            // Randomize pool using Fisher-Yates shuffle (only if pool changed or not yet shuffled)
            if (!this.shuffledAnnouncementPool || this.lastPoolSize !== announcementPool.length) {
                this.shuffledAnnouncementPool = this.shuffleArray([...announcementPool]);
                this.lastPoolSize = announcementPool.length;
                this.currentAnnouncementIndex = 0;
                HalloweenDebug.log(2, `🎃 Ticker pool shuffled: ${announcementPool.length} messages (${enabledRegularAnnouncements.length} regular + ${todayDateAnnouncements.length} date-specific)`);
            }

            // Store original scroll-wrap content (includes all styling, classes, and structure)
            const originalScrollWrapContent = scrollWrap.innerHTML;

            // Get next announcement from shuffled pool
            const selectedAnnouncement = this.shuffledAnnouncementPool[this.currentAnnouncementIndex];
            this.currentAnnouncementIndex = (this.currentAnnouncementIndex + 1) % this.shuffledAnnouncementPool.length;

            // Extract emoji and clean message
            const { emoji, cleanMessage } = this.extractEmojiFromMessage(selectedAnnouncement.message);

            // Apply Metal Mania font styling
            const styledMessage = this.applyHalloweenStyling(cleanMessage);

            // Build complete ticker HTML structure (emoji + message) and insert as one unit
            const isMobile = window.innerWidth <= 768;
            const paddingLeft = isMobile ? '5px' : '1px';

            // Build emoji icon HTML
            const emojiHTML = emoji
                ? `<span style="font-size: 11px; display: inline-block; margin-right: 8px; padding-left: ${paddingLeft}; padding-top: 1px; padding-bottom: 1px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">${emoji}</span>`
                : '';

            // Build complete scroll-wrap content with headline-content structure
            scrollWrap.innerHTML = `
                ${emojiHTML}
                <div class="headline-content" style="white-space: nowrap;">
                    <span>${styledMessage}</span>
                </div>
            `;

            // Re-query for the new headline-content element (old reference is now detached)
            const newHeadlineContent = document.querySelector('.headline-content span');

            // Apply vertical alignment immediately to prevent drop when scroll starts
            if (newHeadlineContent) {
                const innerSpanImmediate = newHeadlineContent.querySelector('span');
                if (innerSpanImmediate) {
                    innerSpanImmediate.style.display = 'inline-block';
                    innerSpanImmediate.style.verticalAlign = 'middle';
                }
            }

            // Hide countdown timer if present (e.g., CaffeineCon events)
            const countdown = document.querySelector('.headline-content .news-ticker-countdown');
            if (countdown) {
                countdown.style.display = 'none';
                HalloweenDebug.log(1, '🎃 Countdown timer hidden');
            }

            // Smart scroll for long messages - measure AFTER content is set
            setTimeout(() => {
                // Re-query for current headline element (in case DOM changed)
                const currentHeadlineForScroll = document.querySelector('.headline-content span');
                if (!currentHeadlineForScroll) return;

                // Find the actual ticker container (.scroll-wrap or similar)
                const tickerContainer = document.querySelector('.scroll-wrap') || currentHeadlineForScroll.closest('[class*="scroll"]');
                const headlineParent = currentHeadlineForScroll.parentElement;

                // Get container width from the actual visible ticker area
                const containerWidth = tickerContainer ? tickerContainer.offsetWidth : (headlineParent ? headlineParent.offsetWidth : window.innerWidth);

                // Measure emoji width to calculate available text space
                let emojiWidth = 0;
                if (emoji && tickerContainer) {
                    // Query for emoji span (first child of scroll-wrap, before .headline-content)
                    const emojiSpan = tickerContainer.querySelector('span:not(.headline-content span)');
                    if (emojiSpan) {
                        // Get emoji width including margin-right (8px)
                        emojiWidth = emojiSpan.offsetWidth + 8;
                        HalloweenDebug.log(2, `🎃 Emoji width: ${emojiWidth}px (element: ${emojiSpan.offsetWidth}px + 8px margin)`);
                    }
                }

                // Calculate available width for text (container minus emoji space)
                const availableTextWidth = containerWidth - emojiWidth;

                // Measure the inner styled span, not the outer container
                const innerSpan = currentHeadlineForScroll.querySelector('span');

                // Force reflow to ensure measurements are accurate
                if (innerSpan) {
                    void innerSpan.offsetHeight; // Force browser reflow
                }

                // Try multiple measurement approaches
                const scrollWidth = innerSpan ? innerSpan.scrollWidth : 0;
                const offsetWidth = innerSpan ? innerSpan.offsetWidth : 0;
                const clientWidth = innerSpan ? innerSpan.clientWidth : 0;
                const bboxWidth = innerSpan ? innerSpan.getBoundingClientRect().width : 0;

                // For ticker text, we need the ACTUAL text width (not constrained by container)
                // Create temporary element to measure true text width
                let trueTextWidth = 0;
                if (innerSpan) {
                    const temp = document.createElement('span');
                    temp.style.cssText = window.getComputedStyle(innerSpan).cssText;
                    temp.style.position = 'absolute';
                    temp.style.visibility = 'hidden';
                    temp.style.whiteSpace = 'nowrap';
                    temp.style.width = 'auto';
                    temp.textContent = innerSpan.textContent;
                    document.body.appendChild(temp);
                    trueTextWidth = temp.getBoundingClientRect().width;
                    document.body.removeChild(temp);
                }

                // Use the largest non-zero value, preferring true text width
                const textWidth = trueTextWidth || Math.max(scrollWidth, offsetWidth, clientWidth, bboxWidth);

                // Add small threshold to avoid scrolling for tiny overflows
                const needsScroll = textWidth > (availableTextWidth + 10);
                // For scrolling messages: tickerDuration + 3000ms (split: duration/2 start, 3s scroll, duration/2 end)
                const effectiveDuration = needsScroll ? (this.tickerDuration + 3000) : this.tickerDuration;

                HalloweenDebug.log(2, `🎃 Ticker scroll check: Container=${containerWidth}px, Emoji=${emojiWidth}px, Available=${availableTextWidth}px, Text=${textWidth}px (true=${trueTextWidth}, scroll=${scrollWidth}, offset=${offsetWidth}, client=${clientWidth}, bbox=${bboxWidth}), NeedsScroll=${needsScroll}, Duration=${effectiveDuration}ms`);

                // Apply scroll animation if needed with symmetrical timing
                if (needsScroll) {
                    // Scroll exactly enough to show the end - no buffer
                    const scrollDistance = textWidth - availableTextWidth;
                    const scrollDuration = 3000;
                    // Timing: duration/2 start, 3s scroll, duration/2 end (symmetrical)
                    const scrollStartDelay = this.tickerDuration / 2;
                    const scrollEndDelay = this.tickerDuration / 2;
                    HalloweenDebug.log(1, `🎃 Scroll timing: ${scrollStartDelay}ms start → ${scrollDuration}ms scroll → ${scrollEndDelay}ms end (total: ${effectiveDuration}ms)`);

                    // Set overflow on currentHeadlineForScroll (outer span) to clip at available text boundary
                    currentHeadlineForScroll.style.overflow = 'hidden';
                    currentHeadlineForScroll.style.display = 'inline-block';
                    currentHeadlineForScroll.style.verticalAlign = 'middle'; // Keep vertically centered with emoji
                    currentHeadlineForScroll.style.maxWidth = `${availableTextWidth}px`; // Constrain to available space (after emoji)

                    // Ensure parent doesn't interfere
                    if (headlineParent) {
                        headlineParent.style.overflow = 'visible';
                    }

                    // Start scrolling after balanced delay (equal time at start and end)
                    setTimeout(() => {
                        // Animate the inner span if it exists, otherwise the outer container
                        const elementToAnimate = innerSpan || currentHeadlineForScroll;

                        // Force CSS properties needed for transform to work
                        elementToAnimate.style.display = 'inline-block';
                        elementToAnimate.style.verticalAlign = 'middle'; // Center with emoji
                        elementToAnimate.style.whiteSpace = 'nowrap';
                        elementToAnimate.style.willChange = 'transform';

                        elementToAnimate.style.transition = `transform ${scrollDuration}ms linear`;
                        elementToAnimate.style.transform = `translateX(-${scrollDistance}px)`;
                        HalloweenDebug.log(2, `🎃 Scroll animation applied to ${innerSpan ? 'inner span' : 'headline content'}, distance=-${scrollDistance}px over ${scrollDuration}ms`);
                    }, scrollStartDelay);
                }

                // Store effective duration for restore timeout
                this._currentTickerDuration = effectiveDuration;

                // Setup restore timeout inside the delay to ensure _currentTickerDuration is set
                HalloweenDebug.log(2, '🎃 Ticker hijacked:', cleanMessage, emoji ? `| Icon: ${emoji}` : '');
                HalloweenDebug.log(2, `🎃 Ticker will restore in ${effectiveDuration}ms`);

                setTimeout(() => {
                    const currentScrollWrap = document.querySelector('.scroll-wrap');

                    // Restore entire scroll-wrap innerHTML (includes anchor, headline-content, and all styling)
                    if (currentScrollWrap) {
                        currentScrollWrap.innerHTML = originalScrollWrapContent;
                    }

                    // Reset any transforms/transitions that may have been applied
                    const restoredHeadline = document.querySelector('.headline-content span');
                    const restoredInnerSpan = restoredHeadline ? restoredHeadline.querySelector('span') : null;

                    if (restoredHeadline) {
                        restoredHeadline.style.transform = '';
                        restoredHeadline.style.transition = '';
                    }
                    if (restoredInnerSpan) {
                        restoredInnerSpan.style.transform = '';
                        restoredInnerSpan.style.transition = '';
                    }

                    // Restore countdown visibility
                    const countdownRestore = document.querySelector('.headline-content .news-ticker-countdown');
                    if (countdownRestore) {
                        countdownRestore.style.display = '';
                    }

                    HalloweenDebug.log(2, '🎃 Ticker restored to original');

                    // Schedule next hijack after frequency delay (recursive scheduling)
                    setTimeout(() => {
                        this.attemptTickerHijack();
                    }, this.tickerFrequency || 15000);
                }, effectiveDuration);
            }, 100); // Small delay to ensure DOM has updated
        },

        shuffleArray: function(array) {
            // Fisher-Yates shuffle algorithm
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        extractEmojiFromMessage: function(message) {
            const emojiRegex = /\p{Emoji}/u;
            const match = message.match(emojiRegex);

            if (match) {
                const emoji = match[0];
                const cleanMessage = message.substring(match.index + emoji.length).trim();
                return { emoji, cleanMessage };
            }

            return { emoji: null, cleanMessage: message.trim() };
        },

        applyHalloweenStyling: function(message) {
            return `<span style="font-family: 'Metal Mania', cursive; font-weight: normal; color: ${HalloweenUI.tickerColor}; font-size: 13px;">${message}</span>`;
        },

        // ===================================
        // BATTLE ANALYTICS MODAL
        // ===================================

        /**
         * Calculate comprehensive battle analytics from API attack data
         * @returns {Object} Analytics data for all sections
         */
        calculateBattleAnalytics: function() {
            console.log('HAL: 📊 calculateBattleAnalytics() START');
            const allAttacks = APIDefeatVerification.getAllAttacks();
            console.log('HAL: 📊 All attacks retrieved:', Object.keys(allAttacks).length);
            const attackValues = Object.values(allAttacks);
            console.log('HAL: 📊 Attack values count:', attackValues.length);

            // Determine date range based on API testing mode
            const apiTestingModeValue = GM_getValue('halloween_api_testing_mode', false);
            const apiTestingMode = apiTestingModeValue === true || apiTestingModeValue === 'true';
            HalloweenDebug.log(1, 'HAL: 📊 API Testing Mode check:', { apiTestingModeValue, apiTestingMode });
            let startTimestamp, endTimestamp;

            if (apiTestingMode) {
                // Check if Override Period is enabled
                const periodEnabled = GM_getValue('halloween_api_period_enabled', false);
                const overrideEnabled = GM_getValue('halloween_api_override_enabled', false);

                if (periodEnabled) {
                    // Override Period: Use specific historical window (locked start and end)
                    const periodStart = GM_getValue('halloween_api_period_start', 0);
                    const periodDuration = GM_getValue('halloween_api_period_duration', 7);
                    startTimestamp = periodStart;
                    endTimestamp = periodStart + (periodDuration * 24 * 60 * 60);
                    HalloweenDebug.log(1, 'HAL: 📊 Override Period mode:', {
                        periodStart: new Date(periodStart * 1000).toISOString(),
                        periodEnd: new Date(endTimestamp * 1000).toISOString(),
                        duration: periodDuration + ' days',
                        startTimestamp,
                        endTimestamp
                    });
                    HalloweenDebug.log(2, `[Analytics] Override Period: ${periodDuration} days from ${HalloweenDebug.formatTimestamp(periodStart)}`);
                } else if (overrideEnabled) {
                    // Override Start Date: Show 7 days from override start (for modal display)
                    const overrideStart = GM_getValue('halloween_api_override_timestamp', 0);
                    startTimestamp = overrideStart > 0 ? overrideStart : (Date.now() / 1000 - (7 * 24 * 60 * 60));
                    endTimestamp = startTimestamp + (7 * 24 * 60 * 60);
                    HalloweenDebug.log(1, 'HAL: 📊 Override Start Date mode:', {
                        overrideStart: new Date(startTimestamp * 1000).toISOString(),
                        overrideEnd: new Date(endTimestamp * 1000).toISOString(),
                        startTimestamp,
                        endTimestamp
                    });
                    HalloweenDebug.log(2, `[Analytics] Override Start: 7 days from ${HalloweenDebug.formatTimestamp(startTimestamp)}`);
                } else {
                    // Standard testing mode: last 7 days from now
                    const now = Date.now() / 1000;
                    const sevenDaysAgo = now - (7 * 24 * 60 * 60);
                    startTimestamp = sevenDaysAgo;
                    endTimestamp = now;
                    HalloweenDebug.log(1, 'HAL: 📊 Testing mode date range:', {
                        now: new Date(now * 1000).toISOString(),
                        sevenDaysAgo: new Date(sevenDaysAgo * 1000).toISOString(),
                        startTimestamp,
                        endTimestamp
                    });
                    HalloweenDebug.log(2, '[Analytics] Testing mode: Using last 7 days');
                }
            } else {
                // Production: Check report mode flag
                const reportMode = GM_getValue('halloween_report_mode', 'default');

                if (reportMode === '7d') {
                    // Last 7 days mode
                    const now = Date.now() / 1000;
                    startTimestamp = now - (7 * 24 * 60 * 60);
                    endTimestamp = now;
                    console.log('HAL: 📊 Production mode - Last 7 days:', {
                        startTimestamp,
                        endTimestamp,
                        startDate: new Date(startTimestamp * 1000).toISOString(),
                        endDate: new Date(endTimestamp * 1000).toISOString()
                    });
                    HalloweenDebug.log(2, '[Analytics] Production mode: Using last 7 days');
                } else if (reportMode === 'historical') {
                    // Historical mode - use stored historical period
                    const historicPeriodStart = GM_getValue('halloween_historical_period_start', 0);
                    const historicPeriodEnd = GM_getValue('halloween_historical_period_end', 0);

                    if (historicPeriodStart === 0 || historicPeriodEnd === 0) {
                        HalloweenDebug.log(1, '[Analytics] Historical period not configured');
                        return null;
                    }

                    startTimestamp = historicPeriodStart;
                    endTimestamp = historicPeriodEnd;
                    console.log('HAL: 📊 Production mode - Historical period:', {
                        startTimestamp,
                        endTimestamp,
                        startDate: new Date(startTimestamp * 1000).toISOString(),
                        endDate: new Date(endTimestamp * 1000).toISOString()
                    });
                    HalloweenDebug.log(2, '[Analytics] Production mode: Using historical period');
                } else {
                    // Default: Use global competition dates (Halloweek)
                    startTimestamp = GM_getValue('halloween_competition_start_timestamp', 0);
                    endTimestamp = GM_getValue('halloween_competition_end_timestamp', 0);

                    console.log('HAL: 📊 Production mode - Global competition dates:', {
                        startTimestamp,
                        endTimestamp,
                        startDate: new Date(startTimestamp * 1000).toISOString(),
                        endDate: new Date(endTimestamp * 1000).toISOString()
                    });

                    if (startTimestamp === 0 || endTimestamp === 0) {
                        HalloweenDebug.log(1, '[Analytics] Global competition dates not set');
                        return null;
                    }

                    HalloweenDebug.log(2, '[Analytics] Production mode: Using global competition dates (Halloweek)');
                }
            }

            // Filter attacks to date range and historical flag
            const reportMode = GM_getValue('halloween_report_mode', 'default');
            const filteredAttacks = attackValues.filter(a => {
                const timestamp = a.timestamp_started || 0;
                const inDateRange = timestamp >= startTimestamp && timestamp <= endTimestamp;

                // In historical mode: only include historical attacks
                if (reportMode === 'historical') {
                    return inDateRange && a.historical === true;
                }

                // In other modes: exclude historical attacks
                return inDateRange && !a.historical;
            });

            HalloweenDebug.log(1, `[Analytics] Filtered ${filteredAttacks.length} attacks in date range`);

            // Split into outgoing and incoming
            const outgoingAttacks = filteredAttacks.filter(a => a.attack_type === 'outgoing');
            const incomingAttacks = filteredAttacks.filter(a => a.attack_type === 'incoming');

            // Chain bonus respect values to exclude
            const CHAIN_BONUS_RESPECT = [10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480, 40960];
            const isChainBonus = (respect) => CHAIN_BONUS_RESPECT.includes(Math.round(respect || 0));

            // Defeat result types
            const DEFEAT_RESULTS = ['Attacked', 'Hospitalized', 'Mugged'];

            // Calculate headline stats
            const uniqueAttackers = new Set(incomingAttacks.map(a => a.attacker_id).filter(id => id)).size;
            const defends = incomingAttacks.filter(a => !DEFEAT_RESULTS.includes(a.result || '')).length;

            // Calculate all analytics
            const analytics = {
                dateRange: { start: startTimestamp, end: endTimestamp },
                totalAttacks: filteredAttacks.length,
                outgoingCount: outgoingAttacks.length,
                incomingCount: incomingAttacks.length,
                uniqueAttackers,
                defends,

                // Section 1: Attack Activity Overview
                activityOverview: this.calculateActivityOverview(filteredAttacks, startTimestamp),

                // Section 2: Offensive Performance
                offensivePerformance: this.calculateOffensivePerformance(outgoingAttacks, DEFEAT_RESULTS),

                // Section 3: Defensive Performance
                defensivePerformance: this.calculateDefensivePerformance(incomingAttacks, outgoingAttacks),

                // Section 4: Stealth Operations
                stealthOperations: this.calculateStealthOperations(outgoingAttacks, incomingAttacks),

                // Section 5: Performance Metrics
                performanceMetrics: this.calculatePerformanceMetrics(outgoingAttacks, isChainBonus),

                // Section 6: The Summoning
                summoningStats: this.calculateSummoningStats(outgoingAttacks)
            };

            return analytics;
        },

        /**
         * Calculate Section 1: Attack Activity Overview
         */
        calculateActivityOverview: function(attacks, startTimestamp) {
            // Initialize 7 days × 24 hours grid
            const dailyData = Array(7).fill(0);
            const hourlyData = Array(7).fill(null).map(() => Array(24).fill(0));

            attacks.forEach(attack => {
                const timestamp = attack.timestamp_started || 0;
                const date = new Date(timestamp * 1000);

                // Calculate day index (0-6) from competition start
                const daysSinceStart = Math.floor((timestamp - startTimestamp) / (24 * 60 * 60));
                const dayIndex = Math.max(0, Math.min(6, daysSinceStart));

                // Get hour (0-23) in GMT
                const hour = date.getUTCHours();

                dailyData[dayIndex]++;
                hourlyData[dayIndex][hour]++;
            });

            // Calculate global min/max for heatmap (across all 168 cells)
            let globalMin = Infinity;
            let globalMax = 0;
            hourlyData.forEach(day => {
                day.forEach(count => {
                    if (count > 0) {
                        globalMin = Math.min(globalMin, count);
                        globalMax = Math.max(globalMax, count);
                    }
                });
            });
            if (globalMin === Infinity) globalMin = 0;

            // Find busiest hour and day
            let busiestHour = { hour: 0, count: 0 };
            let busiestDay = { day: 0, count: 0 };

            hourlyData.forEach((day, dayIdx) => {
                let dayTotal = 0;
                day.forEach((count, hourIdx) => {
                    dayTotal += count;
                    if (count > busiestHour.count) {
                        busiestHour = { hour: hourIdx, count };
                    }
                });
                if (dayTotal > busiestDay.count) {
                    busiestDay = { day: dayIdx + 1, count: dayTotal };
                }
            });

            // Calculate average attacks per day (only count days with data)
            const daysWithData = dailyData.filter(count => count > 0).length;
            const avgAttacksPerDay = daysWithData > 0
                ? (attacks.length / daysWithData).toFixed(1)
                : 0;

            // Find peak burst (most attacks in 1 hour)
            const peakBurst = busiestHour.count;

            return {
                dailyData,
                hourlyData,
                heatmapMinMax: { min: globalMin, max: globalMax },
                busiestHour: busiestHour.hour,
                busiestDay: busiestDay.day,
                avgAttacksPerDay,
                peakBurst
            };
        },

        /**
         * Calculate Section 2: Offensive Performance
         */
        calculateOffensivePerformance: function(outgoingAttacks, DEFEAT_RESULTS) {
            // Most attacked opponent
            const opponentCounts = {};
            outgoingAttacks.forEach(a => {
                const defenderId = a.defender_id || 'Unknown';
                const defenderName = a.defender_name || 'Unknown';
                if (!opponentCounts[defenderId]) {
                    opponentCounts[defenderId] = { name: defenderName, count: 0 };
                }
                opponentCounts[defenderId].count++;
            });
            const topOpponent = Object.entries(opponentCounts)
                .sort((a, b) => b[1].count - a[1].count)[0] || ['Unknown', { name: 'Unknown', count: 0 }];

            // Most attacked faction (exclude "None")
            const factionCounts = {};
            outgoingAttacks.forEach(a => {
                const factionName = a.defender_factionname;
                if (factionName && factionName !== '' && factionName !== 'None') {
                    if (!factionCounts[factionName]) {
                        factionCounts[factionName] = 0;
                    }
                    factionCounts[factionName]++;
                }
            });
            const topFaction = Object.entries(factionCounts)
                .sort((a, b) => b[1] - a[1])[0] || ['None', 0];

            // Opponent diversity
            const uniqueOpponents = Object.keys(opponentCounts).length;
            const repeatAttacks = outgoingAttacks.length - uniqueOpponents;

            // Result types breakdown (include Assist in pie chart)
            const resultBreakdown = {};
            outgoingAttacks.forEach(a => {
                const result = a.result || 'Unknown';
                if (DEFEAT_RESULTS.includes(result) || result === 'Assist') {
                    resultBreakdown[result] = (resultBreakdown[result] || 0) + 1;
                }
            });

            // Attacks per defeat ratio
            const totalDefeats = Object.values(resultBreakdown).reduce((sum, count) => sum + count, 0);
            const attacksPerDefeat = totalDefeats > 0
                ? (outgoingAttacks.length / totalDefeats).toFixed(2)
                : 0;

            // First attack success rate (first attack on each opponent)
            const firstAttacks = {};
            outgoingAttacks.forEach(a => {
                const defenderId = a.defender_id || 'Unknown';
                if (!firstAttacks[defenderId]) {
                    firstAttacks[defenderId] = a;
                }
            });
            const firstAttackSuccesses = Object.values(firstAttacks)
                .filter(a => DEFEAT_RESULTS.includes(a.result || '')).length;
            const firstAttackRate = Object.keys(firstAttacks).length > 0
                ? ((firstAttackSuccesses / Object.keys(firstAttacks).length) * 100).toFixed(1)
                : 0;

            // Comeback victories (defeats after initial losses)
            let comebackVictories = 0;
            const opponentHistory = {};
            outgoingAttacks.forEach(a => {
                const defenderId = a.defender_id || 'Unknown';
                if (!opponentHistory[defenderId]) {
                    opponentHistory[defenderId] = [];
                }
                opponentHistory[defenderId].push(a.result || 'Unknown');
            });
            Object.values(opponentHistory).forEach(history => {
                if (history.length > 1) {
                    // Check if there's ANY loss followed by a win
                    let hadComeback = false;
                    for (let i = 0; i < history.length - 1; i++) {
                        // If this attack was a loss
                        if (!DEFEAT_RESULTS.includes(history[i])) {
                            // Check if any subsequent attack was a win
                            if (history.slice(i + 1).some(result => DEFEAT_RESULTS.includes(result))) {
                                hadComeback = true;
                                break;
                            }
                        }
                    }
                    if (hadComeback) {
                        comebackVictories++;
                    }
                }
            });

            return {
                topOpponent: { name: topOpponent[1].name, count: topOpponent[1].count },
                topFaction: { name: topFaction[0], count: topFaction[1] },
                uniqueOpponents,
                repeatAttacks,
                resultBreakdown,
                attacksPerDefeat,
                firstAttackRate,
                comebackVictories
            };
        },

        /**
         * Calculate Section 3: Defensive Performance
         */
        calculateDefensivePerformance: function(incomingAttacks, outgoingAttacks) {
            // Player who attacked us most (exclude stealth/unknown attackers)
            const attackerCounts = {};
            incomingAttacks.forEach(a => {
                const attackerId = a.attacker_id;
                const attackerName = a.attacker_name;
                // Skip if attacker info is missing (stealth attacks)
                if (!attackerId || !attackerName || attackerName === 'Unknown' || attackerName === '') {
                    return;
                }
                if (!attackerCounts[attackerId]) {
                    attackerCounts[attackerId] = { name: attackerName, count: 0 };
                }
                attackerCounts[attackerId].count++;
            });
            const topAttacker = Object.entries(attackerCounts)
                .sort((a, b) => b[1].count - a[1].count)[0] || ['Unknown', { name: 'None', count: 0 }];

            // Faction that attacked us most (exclude stealth/no faction)
            const factionCounts = {};
            incomingAttacks.forEach(a => {
                const factionName = a.attacker_factionname;
                // Skip if faction info is missing or empty
                if (!factionName || factionName === 'None' || factionName === '') {
                    return;
                }
                if (!factionCounts[factionName]) {
                    factionCounts[factionName] = 0;
                }
                factionCounts[factionName]++;
            });
            const topAttackingFaction = Object.entries(factionCounts)
                .sort((a, b) => b[1] - a[1])[0] || ['None', 0];

            // Revenge ratio (you attacked someone who attacked you)
            const incomingAttackerIds = new Set(incomingAttacks.map(a => a.attacker_id).filter(id => id));
            const revengeAttacks = outgoingAttacks.filter(a => incomingAttackerIds.has(a.defender_id));
            const revengeRatio = incomingAttackerIds.size > 0
                ? ((revengeAttacks.length / incomingAttacks.length) * 100).toFixed(1)
                : 0;

            return {
                topAttacker: { name: topAttacker[1].name, count: topAttacker[1].count },
                topAttackingFaction: { name: topAttackingFaction[0], count: topAttackingFaction[1] },
                revengeRatio
            };
        },

        /**
         * Calculate Section 4: Stealth Operations
         */
        calculateStealthOperations: function(outgoingAttacks, incomingAttacks) {
            const stealthOutgoing = outgoingAttacks.filter(a => a.stealthed === 1).length;
            const stealthIncoming = incomingAttacks.filter(a => a.stealthed === 1).length;

            return {
                stealthOutgoing,
                stealthIncoming
            };
        },

        /**
         * Calculate Section 5: Performance Metrics
         */
        calculatePerformanceMetrics: function(outgoingAttacks, isChainBonus) {
            // Respect & Rewards
            const respectValues = outgoingAttacks.map(a => a.respect || 0);
            const totalRespect = respectValues.reduce((sum, r) => sum + r, 0).toFixed(2);
            const avgRespect = outgoingAttacks.length > 0
                ? (totalRespect / outgoingAttacks.length).toFixed(2)
                : 0;

            // Highest respect (exclude chain bonuses)
            const nonBonusRespect = outgoingAttacks
                .filter(a => !isChainBonus(a.respect))
                .map(a => a.respect || 0);
            const highestRespect = nonBonusRespect.length > 0
                ? Math.max(...nonBonusRespect).toFixed(2)
                : 0;

            // Chain Efficiency (exclude non-counted results)
            const excludedResults = ['Stalemate', 'Timeout', 'Lost', 'Interrupted', 'Escape', 'Assist'];
            const countableAttacks = outgoingAttacks.filter(a => !excludedResults.includes(a.result));
            const hitsInChain = countableAttacks.filter(a => (a.chain || 0) > 10).length;
            const hitsOutsideChain = countableAttacks.filter(a => (a.chain || 0) <= 10).length;
            const chainRatio = hitsOutsideChain > 0
                ? `${Math.round(hitsInChain / hitsOutsideChain)}:1`
                : hitsInChain > 0 ? `${hitsInChain}:0` : '0:0';

            // Fair Fight Analysis
            const fairFightValues = outgoingAttacks.map(a => {
                // Fair Fight is nested in modifiers.fair_fight
                return (a.modifiers && a.modifiers.fair_fight) ? a.modifiers.fair_fight : 0;
            });

            const avgFairFight = fairFightValues.length > 0
                ? (fairFightValues.reduce((sum, ff) => sum + ff, 0) / fairFightValues.length).toFixed(2)
                : 0;

            // Fair Fight distribution (Fair Fight ranges from 1.0 to 3.0)
            const ffDistribution = {
                under2: fairFightValues.filter(ff => ff < 2.0).length,
                range2to3: fairFightValues.filter(ff => ff >= 2.0 && ff < 3.0).length,
                exactly3: fairFightValues.filter(ff => ff === 3.0).length
            };

            return {
                totalRespect,
                avgRespect,
                highestRespect,
                hitsInChain,
                hitsOutsideChain,
                chainRatio,
                avgFairFight,
                ffDistribution
            };
        },

        /**
         * Calculate The Summoning stats (attacks against M'aol and his minions)
         */
        calculateSummoningStats: function(outgoingAttacks) {
            // M'aol - the main target
            const maolAttacks = outgoingAttacks.filter(a => a.defender_id === 23).length;

            // Minions - exact ID matches only
            const dynoAttacks = outgoingAttacks.filter(a => a.defender_id === 100).length;
            const nolAttacks = outgoingAttacks.filter(a => a.defender_id === 101).length;
            const asmolAttacks = outgoingAttacks.filter(a => a.defender_id === 102).length;
            const syloAttacks = outgoingAttacks.filter(a => a.defender_id === 103).length;
            const ladsoAttacks = outgoingAttacks.filter(a => a.defender_id === 104).length;

            return {
                maolAttacks,
                minions: {
                    dyno: dynoAttacks,
                    nol: nolAttacks,
                    asmol: asmolAttacks,
                    sylo: syloAttacks,
                    ladso: ladsoAttacks
                }
            };
        },

        /**
         * Generate HTML for daily bar chart (7 bars)
         */
        generateDailyBarChart: function(dailyData) {
            const maxCount = Math.max(...dailyData, 1);
            const bars = dailyData.map((count, idx) => {
                const heightPx = (count / maxCount) * 120; // Fixed pixel height
                const hasData = count > 0;
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="font-size: 10px; color: ${hasData ? '#00ffff' : '#666'}; font-weight: bold;">${count}</div>
                        <div style="width: 100%; background: ${hasData ? 'rgba(0, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.3)'}; height: ${Math.max(heightPx, 5)}px; border-radius: 3px 3px 0 0; align-self: flex-end;"></div>
                        <div style="font-size: 9px; color: #999;">Day ${idx + 1}</div>
                    </div>
                `;
            }).join('');

            return `
                <div style="display: flex; gap: 6px; align-items: flex-end; height: 170px; padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px;">
                    ${bars}
                </div>
            `;
        },

        /**
         * Generate HTML for attack frequency heatmap (7 days × 24 hours)
         */
        generateHeatmap: function(hourlyData, minMax) {
            const { min, max } = minMax;

            const getHeatmapColor = (count) => {
                if (count === 0) return { bg: 'rgba(0, 0, 0, 0.3)', text: '#666' };

                const normalized = max === min ? 1 : (count - min) / (max - min);

                // Gradient: background → cyan (low) → rose pink (high)
                // 0.0 - 0.5: fade in cyan
                // 0.5 - 1.0: transition from cyan to rose pink
                let bgColor, textColor;

                if (normalized < 0.5) {
                    // Low intensity: fade in cyan
                    const opacity = 0.3 + (normalized * 1.4); // 0.3 to 1.0
                    bgColor = `rgba(0, 255, 255, ${opacity})`;
                    textColor = normalized > 0.3 ? '#333' : '#fff';
                } else {
                    // High intensity: transition from cyan to rose pink
                    const transitionAmount = (normalized - 0.5) * 2; // 0 to 1
                    // Cyan (#00ffff) → Rose Pink (#ff6b9d)
                    const r = Math.round(0 + (255 - 0) * transitionAmount);
                    const g = Math.round(255 - (255 - 107) * transitionAmount);
                    const b = Math.round(255 - (255 - 157) * transitionAmount);
                    bgColor = `rgb(${r}, ${g}, ${b})`;
                    textColor = '#333';
                }

                return { bg: bgColor, text: textColor };
            };

            const rows = hourlyData.map((dayData, dayIdx) => {
                const cells = dayData.map((count, hourIdx) => {
                    const colors = getHeatmapColor(count);
                    return `
                        <div style="background: ${colors.bg}; border: 1px solid rgba(0, 0, 0, 0.2); flex: 1; aspect-ratio: 1; min-width: 0; display: flex; align-items: center; justify-content: center; font-size: 5px; color: ${colors.text}; border-radius: 1px; font-weight: bold;" title="Day ${dayIdx + 1}, Hour ${hourIdx}: ${count} attacks">
                            ${count > 0 ? count : ''}
                        </div>
                    `;
                }).join('');

                return `
                    <div style="display: flex; gap: 1px; align-items: center;">
                        <div style="font-size: 7px; color: #999; width: 25px; flex-shrink: 0;">Day ${dayIdx + 1}</div>
                        <div style="display: flex; gap: 1px; flex: 1;">
                            ${cells}
                        </div>
                    </div>
                `;
            }).join('');

            // Hour labels (show 0, 4, 8, 12, 16, 20)
            const hourLabels = Array(24).fill(0).map((_, idx) => {
                let label = '';
                if (idx % 4 === 0) {
                    label = idx;
                }
                return `<div style="flex: 1; font-size: 5px; color: #666; text-align: center; min-width: 0;">${label}</div>`;
            }).join('');

            return `
                <div style="padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px;">
                    <div style="display: flex; gap: 1px; align-items: center; margin-bottom: 4px;">
                        <div style="width: 25px; flex-shrink: 0;"></div>
                        <div style="display: flex; gap: 1px; flex: 1;">
                            ${hourLabels}
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        ${rows}
                    </div>
                </div>
            `;
        },

        /**
         * Generate SVG pie chart for result types
         */
        generatePieChart: function(resultBreakdown) {
            const total = Object.values(resultBreakdown).reduce((sum, count) => sum + count, 0);
            if (total === 0) {
                return '<div style="text-align: center; color: #999; padding: 20px;">No defeat data available</div>';
            }

            const colors = {
                'Attacked': '#00ffff',
                'Hospitalized': '#ff6b9d',
                'Mugged': '#34d399',
                'Assist': '#a78bfa'
            };

            let currentAngle = 0;
            const slices = Object.entries(resultBreakdown).map(([result, count]) => {
                const percent = (count / total) * 100;
                const angle = (count / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle = endAngle;

                let path;
                // Special case: if this is 100% (full circle), draw a circle instead of arc
                if (angle >= 359.9) {
                    path = `M 50,10 A 40,40 0 1,1 49.99,10 Z`;
                } else {
                    // Calculate arc path
                    const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                    const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                    const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                    const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                    const largeArc = angle > 180 ? 1 : 0;

                    path = `M 50,50 L ${startX},${startY} A 40,40 0 ${largeArc},1 ${endX},${endY} Z`;
                }

                // Calculate label position (middle of slice)
                const midAngle = (startAngle + endAngle) / 2;
                const labelX = 50 + 25 * Math.cos((midAngle - 90) * Math.PI / 180);
                const labelY = 50 + 25 * Math.sin((midAngle - 90) * Math.PI / 180);

                return {
                    path,
                    color: colors[result] || '#fff',
                    labelX,
                    labelY,
                    count,
                    percent: percent.toFixed(1)
                };
            });

            const svgSlices = slices.map((slice, idx) => `
                <path d="${slice.path}" fill="${slice.color}" opacity="0.8" stroke="#000" stroke-width="0.5"/>
                ${parseFloat(slice.percent) >= 10 ? `<text x="${slice.labelX}" y="${slice.labelY}" text-anchor="middle" dominant-baseline="middle" font-size="6" fill="#fff" font-weight="bold">${slice.count}</text>` : ''}
            `).join('');

            const legend = Object.entries(resultBreakdown).map(([result, count]) => `
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 12px; height: 12px; background: ${colors[result] || '#fff'}; border-radius: 2px; opacity: 0.8;"></div>
                    <div style="font-size: 10px; color: #fff;">${result}: <span style="color: ${colors[result] || '#fff'}; font-weight: bold;">${count}</span></div>
                </div>
            `).join('');

            return `
                <div style="display: flex; align-items: center; gap: 20px; justify-content: center; padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px;">
                    <svg viewBox="0 0 100 100" style="width: 120px; height: 120px;">
                        ${svgSlices}
                    </svg>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${legend}
                    </div>
                </div>
            `;
        },

        /**
         * Generate a stat box (reusable component)
         */
        generateStatBox: function(label, value, color = '#00ffff', percentage = null) {
            return `
                <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                    <div style="font-size: 18px; font-weight: bold; color: ${color}; margin: 0 0 4px 0;">${value}${percentage !== null ? ` <span style="font-size: 9px; color: #ccc;">(${percentage})</span>` : ''}</div>
                    <div style="font-size: 9px; color: #999; margin: 0;">${label}</div>
                </div>
            `;
        },

        /**
         * Open the Battle Analytics modal
         */
        openBattleAnalyticsModal: function() {
            console.log('HAL: 📊 openBattleAnalyticsModal called');

            // Close menu if open
            if (this.menuOpen) {
                console.log('HAL: 📊 Closing menu...');
                this.toggleMenu();
            }

            // Check if API mode is enabled
            console.log('HAL: 📊 Checking API mode...');
            if (!APIDefeatVerification.isAPIMode()) {
                console.log('HAL: ❌ API mode not enabled');
                alert('Battle Analytics requires API mode to be enabled.');
                return;
            }
            console.log('HAL: ✅ API mode enabled');

            // Calculate analytics
            console.log('HAL: 📊 Calculating analytics...');
            try {
                const analytics = this.calculateBattleAnalytics();
                console.log('HAL: 📊 Analytics calculated:', analytics);

                if (!analytics) {
                    console.log('HAL: ❌ Analytics returned null/undefined');
                    alert('Unable to calculate analytics. Please check competition dates are configured.');
                    return;
                }
                console.log('HAL: ✅ Analytics data ready');

                HalloweenDebug.log(1, '[Analytics] Opening Battle Analytics modal');

            // Format date range for subtitle
            const startDate = new Date(analytics.dateRange.start * 1000);
            const endDate = new Date(analytics.dateRange.end * 1000);
            const dateRangeText = `Data from API logs (${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')})`;

            // Detect PDA and generate Data URI for link if needed
            const isPDA = navigator.userAgent.includes('com.manuito.tornpda');
            let fullReportLinkHref = '#';
            let fullReportLinkTarget = '';

            if (isPDA) {
                // PDA: Generate Data URI for direct link (bypasses window.open issue)
                const fullReportHTML = this.generateFullReportHTML(analytics);
                fullReportLinkHref = 'data:text/html;charset=utf-8,' + encodeURIComponent(fullReportHTML);
                fullReportLinkTarget = ' target="_blank"';
                HalloweenDebug.log(1, '[Analytics] PDA detected - using Data URI link');
            }

            // Use fixed width optimized for mobile (works well on all devices)
            const modalWidth = '95vw';

            // Generate HTML for all sections
            const modalHTML = `
                <div id="battle-analytics-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 999999; display: flex; align-items: center; justify-content: center;">
                    <div id="battle-analytics-modal" style="width: ${modalWidth}; max-width: 340px; max-height: 85vh; background: linear-gradient(180deg, var(--carved-midnight) 0%, var(--carved-void) 50%, var(--carved-purple) 100%); border: 2px solid var(--carved-cyan); border-radius: 12px; box-shadow: 0 0 40px rgba(0, 255, 255, 0.5); overflow: hidden; display: flex; flex-direction: column; font-family: var(--halloween-font);">

                        <!-- Header -->
                        <div style="padding: 15px 20px; border-bottom: 1px solid var(--carved-cyan); display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-size: 18px; font-weight: bold; color: var(--carved-cyan); display: flex; align-items: center; gap: 6px;">
                                    <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; font-size: 16px; margin-top: -2px;">📊</span>
                                    <span>HALLOWEEK ANALYTICS</span>
                                </div>
                                <div style="font-size: 10px; color: #999; margin-top: 4px;">${dateRangeText}</div>
                            </div>
                            <button id="battle-analytics-close" style="background: none; border: none; color: var(--carved-cyan); font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">✕</button>
                        </div>

                        <!-- Scrollable Content -->
                        <div style="overflow-y: auto; padding: 20px; flex: 1;">

                            <!-- Headline Stats -->
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                                    OVERVIEW
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <div style="font-size: 12px; font-weight: bold; color: #ccc; margin-bottom: 8px;">
                                        <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; vertical-align: middle;">⚔️</span> OFFENSE
                                    </div>
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                        ${this.generateStatBox('Total Attacks', analytics.outgoingCount, '#00ffff')}
                                        ${this.generateStatBox('Total Opponents', analytics.offensivePerformance.uniqueOpponents, '#a78bfa')}
                                        ${this.generateStatBox('Total Defeats', Object.values(analytics.offensivePerformance.resultBreakdown).reduce((sum, count) => sum + count, 0), '#34d399')}
                                    </div>
                                </div>

                                <div>
                                    <div style="font-size: 12px; font-weight: bold; color: #ccc; margin-bottom: 8px;">
                                        <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; vertical-align: middle;">🛡️</span> DEFENSE
                                    </div>
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                        ${this.generateStatBox('Attacked', analytics.incomingCount, '#00ffff')}
                                        ${this.generateStatBox('Attackers', analytics.uniqueAttackers, '#a78bfa')}
                                        ${this.generateStatBox('Defends', analytics.defends, '#34d399')}
                                    </div>
                                </div>
                            </div>

                            <!-- Section 1: Attack Activity Overview -->
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                                    ATTACK ACTIVITY
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <div style="font-size: 11px; color: #ccc; margin-bottom: 6px;">Daily Attack Distribution</div>
                                    ${this.generateDailyBarChart(analytics.activityOverview.dailyData)}
                                </div>

                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
                                    ${this.generateStatBox('Busiest Hour (TCT)', `${String(analytics.activityOverview.busiestHour).padStart(2, '0')}:00 - ${String((analytics.activityOverview.busiestHour + 1) % 24).padStart(2, '0')}:00`, '#ccc')}
                                    ${this.generateStatBox('Most Active Day', `Day ${analytics.activityOverview.busiestDay}`, '#ccc')}
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                                    ${this.generateStatBox('Avg Attacks/Day', analytics.activityOverview.avgAttacksPerDay, '#a78bfa')}
                                    ${this.generateStatBox('Peak Burst (1hr)', analytics.activityOverview.peakBurst, '#ff6b9d')}
                                </div>



                                <div>
                                    <div style="font-size: 11px; color: #ccc; margin-bottom: 6px;">Attack Frequency Heatmap (7 Days × 24 Hours)</div>
                                    ${this.generateHeatmap(analytics.activityOverview.hourlyData, analytics.activityOverview.heatmapMinMax)}
                                </div>
                            </div>

                            <!-- Section 2: Offensive Performance -->
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                                    OFFENSIVE PERFORMANCE
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
                                        <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                                            <div style="font-size: 18px; font-weight: bold; color: #00ffff; margin-bottom: 4px;">${analytics.offensivePerformance.topOpponent.name} <span style="color: #999;">(${analytics.offensivePerformance.topOpponent.count}x)</span></div>
                                            <div style="font-size: 9px; color: #999;">Most Attacked Opponent</div>
                                        </div>
                                        <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                                            <div style="font-size: 18px; font-weight: bold; color: #00ffff; margin-bottom: 4px;">${analytics.offensivePerformance.topFaction.name} <span style="color: #999;">(${analytics.offensivePerformance.topFaction.count}x)</span></div>
                                            <div style="font-size: 9px; color: #999;">Most Attacked Faction</div>
                                        </div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
                                        ${this.generateStatBox('Unique Opponents', analytics.offensivePerformance.uniqueOpponents, '#a78bfa')}
                                        ${this.generateStatBox('Attacks per Defeat', analytics.offensivePerformance.attacksPerDefeat, '#34d399')}
                                    </div>
                                    <div>
                                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                            ${this.generateStatBox('First Attack Success', `${analytics.offensivePerformance.firstAttackRate}%`, '#34d399')}
                                            ${this.generateStatBox('Comeback Victories', analytics.offensivePerformance.comebackVictories, '#ff6b9d')}
                                        </div>
                                        <div style="font-size: 8px; color: #999; margin-top: 6px; margin-left: 2px; line-height: 1.3;"><strong>Comeback Victories:</strong> Opponents where your first attack failed, but you came back and defeated them later.</div>
                                    </div>
                                </div>

                                <div>
                                    <div style="font-size: 11px; color: #ccc; margin-bottom: 6px;">Result Types Breakdown</div>
                                    ${this.generatePieChart(analytics.offensivePerformance.resultBreakdown)}
                                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">
                                        ${this.generateStatBox('Attacked', analytics.offensivePerformance.resultBreakdown['Attacked'] || 0, '#00ffff')}
                                        ${this.generateStatBox('Hospitalized', analytics.offensivePerformance.resultBreakdown['Hospitalized'] || 0, '#ff6b9d')}
                                        ${this.generateStatBox('Mugged', analytics.offensivePerformance.resultBreakdown['Mugged'] || 0, '#34d399')}
                                        ${this.generateStatBox('Assist', analytics.offensivePerformance.resultBreakdown['Assist'] || 0, '#a78bfa')}
                                    </div>
                                </div>
                            </div>

                            <!-- Section 3: Defensive Performance -->
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                                    DEFENSIVE PERFORMANCE
                                </div>

                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                                    <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                                        <div style="font-size: 18px; font-weight: bold; color: #ff6b9d; margin-bottom: 4px;">${analytics.defensivePerformance.topAttacker.name} <span style="color: #999;">(${analytics.defensivePerformance.topAttacker.count}x)</span></div>
                                        <div style="font-size: 9px; color: #999;">Top Attacker</div>
                                    </div>
                                    <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                                        <div style="font-size: 18px; font-weight: bold; color: #ff6b9d; margin-bottom: 4px;">${analytics.defensivePerformance.topAttackingFaction.name} <span style="color: #999;">(${analytics.defensivePerformance.topAttackingFaction.count}x)</span></div>
                                        <div style="font-size: 9px; color: #999;">Top Attacking Faction</div>
                                    </div>
                                    <div>
                                        ${this.generateStatBox('Revenge Ratio', `${analytics.defensivePerformance.revengeRatio}%`, '#fb923c')}
                                        <div style="font-size: 8px; color: #999; margin-top: 6px; margin-left: 2px; line-height: 1.3;"><strong>Revenge Ratio:</strong> Percentage of attackers you hit back after being attacked. Can exceed 100% if you attacked them multiple times.</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 4: Stealth Operations -->
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                                    STEALTH OPERATIONS
                                </div>

                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    ${this.generateStatBox('Stealthed Outgoing', analytics.stealthOperations.stealthOutgoing, '#a78bfa', `${analytics.outgoingCount > 0 ? ((analytics.stealthOperations.stealthOutgoing / analytics.outgoingCount) * 100).toFixed(1) : '0.0'}%`)}
                                    ${this.generateStatBox('Stealthed Incoming', analytics.stealthOperations.stealthIncoming, '#a78bfa', `${analytics.incomingCount > 0 ? ((analytics.stealthOperations.stealthIncoming / analytics.incomingCount) * 100).toFixed(1) : '0.0'}%`)}
                                </div>
                            </div>

                            <!-- Section 5: Performance Metrics -->
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                                    OTHER METRICS
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <div style="font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 8px;">Respect</div>
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                        ${this.generateStatBox('Total Respect', analytics.performanceMetrics.totalRespect, '#34d399')}
                                        ${this.generateStatBox('Avg R/Attack', analytics.performanceMetrics.avgRespect, '#34d399')}
                                        ${this.generateStatBox('Highest Respect', analytics.performanceMetrics.highestRespect, '#34d399')}
                                    </div>
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <div style="font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 8px;">Chains</div>
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                        ${this.generateStatBox('Hits in Chain', analytics.performanceMetrics.hitsInChain, '#60a5fa')}
                                        ${this.generateStatBox('Hits Outside Chain', analytics.performanceMetrics.hitsOutsideChain, '#999')}
                                        ${this.generateStatBox('Chain Ratio', analytics.performanceMetrics.chainRatio, '#a78bfa')}
                                    </div>
                                </div>

                                <div>
                                    <div style="font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 8px;">Fair Fight</div>
                                    <div style="margin-bottom: 10px;">
                                        ${this.generateStatBox('Average Fair Fight', analytics.performanceMetrics.avgFairFight, '#60a5fa')}
                                    </div>
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                                        ${this.generateStatBox('< 2.0', analytics.performanceMetrics.ffDistribution.under2, '#999')}
                                        ${this.generateStatBox('2.0 - 2.99', analytics.performanceMetrics.ffDistribution.range2to3, '#999')}
                                        ${this.generateStatBox('3.0', analytics.performanceMetrics.ffDistribution.exactly3, '#999')}
                                    </div>
                                </div>
                            </div>

                            <!-- Section 6: The Summoning -->
                            <div style="margin-bottom: 25px;">
                                <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                                    THE SUMMONING
                                </div>

                                <!-- M'aol (main target) -->
                                <div style="margin-bottom: 10px;">
                                    ${this.generateStatBox("M'aol", analytics.summoningStats.maolAttacks, '#ff6b9d')}
                                </div>

                                <!-- Minions -->
                                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;">
                                    ${this.generateStatBox("Dyno'", analytics.summoningStats.minions.dyno, '#a78bfa')}
                                    ${this.generateStatBox("Nol'", analytics.summoningStats.minions.nol, '#a78bfa')}
                                    ${this.generateStatBox("Asmol'", analytics.summoningStats.minions.asmol, '#a78bfa')}
                                    ${this.generateStatBox("Sylo'", analytics.summoningStats.minions.sylo, '#a78bfa')}
                                    ${this.generateStatBox("Ladso'", analytics.summoningStats.minions.ladso, '#a78bfa')}
                                </div>
                            </div>

                            <!-- View Full Report Link -->
                            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(0, 255, 255, 0.3);">
                                <a id="view-full-report-link" href="${fullReportLinkHref}"${fullReportLinkTarget} style="color: var(--carved-cyan); text-decoration: none; font-size: 12px; font-weight: bold; transition: all 0.2s;">
                                    View Full Report (for screenshots)
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            `;

                // Inject modal into DOM
                console.log('HAL: 📊 Injecting modal HTML...');
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                console.log('HAL: ✅ Modal HTML injected');

                // Attach close handlers
                HalloweenDebug.log(1, 'HAL: 📊 Attaching close handlers...');
                const overlay = document.getElementById('battle-analytics-overlay');
                const closeBtn = document.getElementById('battle-analytics-close');
                const modal = document.getElementById('battle-analytics-modal');

                if (!overlay || !closeBtn || !modal) {
                    console.error('HAL: ❌ Modal elements not found!', { overlay, closeBtn, modal });
                    alert('Error: Modal elements not found in DOM');
                    return;
                }

                closeBtn.addEventListener('click', () => this.closeBattleAnalyticsModal());
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.closeBattleAnalyticsModal();
                    }
                });

                // ESC key handler
                const escHandler = (e) => {
                    if (e.key === 'Escape') {
                        this.closeBattleAnalyticsModal();
                        document.removeEventListener('keydown', escHandler);
                    }
                };
                document.addEventListener('keydown', escHandler);

                // View Full Report link handler (only for non-PDA)
                if (!isPDA) {
                    const viewFullReportLink = document.getElementById('view-full-report-link');
                    if (viewFullReportLink) {
                        viewFullReportLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.openFullReportView(analytics);
                        });
                        // Add hover effect
                        viewFullReportLink.addEventListener('mouseenter', () => {
                            viewFullReportLink.style.textDecoration = 'underline';
                        });
                        viewFullReportLink.addEventListener('mouseleave', () => {
                            viewFullReportLink.style.textDecoration = 'none';
                        });
                    }
                }

                // Log modal dimensions for sizing analysis
                const modalElement = document.getElementById('battle-analytics-modal');
                if (modalElement) {
                    const rect = modalElement.getBoundingClientRect();
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    HalloweenDebug.log(1, '📊 MODAL DIMENSIONS:', {
                        modalWidth: `${rect.width}px`,
                        modalHeight: `${rect.height}px`,
                        screenWidth: `${screenWidth}px`,
                        screenHeight: `${screenHeight}px`,
                        widthPercentage: `${((rect.width / screenWidth) * 100).toFixed(1)}%`,
                        heightPercentage: `${((rect.height / screenHeight) * 100).toFixed(1)}%`
                    });
                    HalloweenDebug.log(1, `📊 Modal: ${rect.width}px × ${rect.height}px | Screen: ${screenWidth}px × ${screenHeight}px`);
                }

                console.log('HAL: ✅ Modal displayed successfully');
                HalloweenDebug.log(2, '[Analytics] Modal displayed successfully');

            } catch (error) {
                console.error('HAL: ❌ Error in openBattleAnalyticsModal:', error);
                console.error('HAL: ❌ Error stack:', error.stack);
                alert(`Error opening Battle Analytics: ${error.message}`);
            }
        },

        /**
         * Close the Battle Analytics modal
         */
        closeBattleAnalyticsModal: function() {
            const overlay = document.getElementById('battle-analytics-overlay');
            if (overlay) {
                overlay.remove();
                HalloweenDebug.log(2, '[Analytics] Modal closed');
            }
        },

        /**
         * Generate full report HTML (helper for PDA and window.open)
         */
        generateFullReportHTML: function(analytics) {
            // Format date range for subtitle
            const startDate = new Date(analytics.dateRange.start * 1000);
            const endDate = new Date(analytics.dateRange.end * 1000);
            const dateRangeText = `Data from API logs (${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')})`;

            return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halloweek Analytics - Full Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Fjalla+One:wght@400&family=Creepster&family=Metal+Mania&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 40px 20px;
            background: #1a0033;
            font-family: 'Fjalla One', 'Orbitron', sans-serif;
            display: flex;
            justify-content: center;
            min-height: 100vh;
        }
        .report-container {
            width: 100%;
            max-width: 340px;
            background: linear-gradient(180deg, #1a0033 0%, #0a001a 50%, #2d0066 100%);
            border: 2px solid #00ffff;
            border-radius: 12px;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
            overflow: hidden;
            font-family: 'Fjalla One', 'Orbitron', sans-serif;
        }
        .report-header {
            padding: 15px 20px;
            border-bottom: 1px solid #00ffff;
        }
        .report-title {
            font-size: 18px;
            font-weight: bold;
            color: #00ffff;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 4px;
        }
        .report-subtitle {
            font-size: 10px;
            color: #999;
        }
        .report-content {
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="report-header">
            <div class="report-title">
                <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; font-size: 16px; margin-top: -2px;">📊</span>
                <span>HALLOWEEK ANALYTICS</span>
            </div>
            <div class="report-subtitle">${dateRangeText}</div>
        </div>

        <!-- All sections content -->
        <div class="report-content">
            <!-- Headline Stats -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 14px; font-weight: bold; color: #00ffff; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                    OVERVIEW
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; font-weight: bold; color: #ccc; margin-bottom: 8px;">
                        <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; vertical-align: middle;">⚔️</span> OFFENSE
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        ${this.generateStatBox('Total Attacks', analytics.outgoingCount, '#00ffff')}
                        ${this.generateStatBox('Total Opponents', analytics.offensivePerformance.uniqueOpponents, '#a78bfa')}
                        ${this.generateStatBox('Total Defeats', Object.values(analytics.offensivePerformance.resultBreakdown).reduce((sum, count) => sum + count, 0), '#34d399')}
                    </div>
                </div>

                <div>
                    <div style="font-size: 12px; font-weight: bold; color: #ccc; margin-bottom: 8px;">
                        <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; vertical-align: middle;">🛡️</span> DEFENSE
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        ${this.generateStatBox('Attacked', analytics.incomingCount, '#00ffff')}
                        ${this.generateStatBox('Attackers', analytics.uniqueAttackers, '#a78bfa')}
                        ${this.generateStatBox('Defends', analytics.defends, '#34d399')}
                    </div>
                </div>
            </div>

            <!-- Section 1: Attack Activity Overview -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 14px; font-weight: bold; color: #00ffff; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                    ATTACK ACTIVITY
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 11px; color: #ccc; margin-bottom: 6px;">Daily Attack Distribution</div>
                    ${this.generateDailyBarChart(analytics.activityOverview.dailyData)}
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
                    ${this.generateStatBox('Busiest Hour (TCT)', String(analytics.activityOverview.busiestHour).padStart(2, '0') + ':00 - ' + String((analytics.activityOverview.busiestHour + 1) % 24).padStart(2, '0') + ':00', '#ccc')}
                    ${this.generateStatBox('Most Active Day', 'Day ' + analytics.activityOverview.busiestDay, '#ccc')}
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                    ${this.generateStatBox('Avg Attacks/Day', analytics.activityOverview.avgAttacksPerDay, '#a78bfa')}
                    ${this.generateStatBox('Peak Burst (1hr)', analytics.activityOverview.peakBurst, '#ff6b9d')}
                </div>

                <div>
                    <div style="font-size: 11px; color: #ccc; margin-bottom: 6px;">Attack Frequency Heatmap (7 Days × 24 Hours)</div>
                    ${this.generateHeatmap(analytics.activityOverview.hourlyData, analytics.activityOverview.heatmapMinMax)}
                </div>
            </div>

            <!-- Section 2: Offensive Performance -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 14px; font-weight: bold; color: #00ffff; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                    OFFENSIVE PERFORMANCE
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
                        <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                            <div style="font-size: 18px; font-weight: bold; color: #00ffff; margin-bottom: 4px;">${analytics.offensivePerformance.topOpponent.name} <span style="color: #999;">(${analytics.offensivePerformance.topOpponent.count}x)</span></div>
                            <div style="font-size: 9px; color: #999;">Most Attacked Opponent</div>
                        </div>
                        <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                            <div style="font-size: 18px; font-weight: bold; color: #00ffff; margin-bottom: 4px;">${analytics.offensivePerformance.topFaction.name} <span style="color: #999;">(${analytics.offensivePerformance.topFaction.count}x)</span></div>
                            <div style="font-size: 9px; color: #999;">Most Attacked Faction</div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
                        ${this.generateStatBox('Unique Opponents', analytics.offensivePerformance.uniqueOpponents, '#a78bfa')}
                        ${this.generateStatBox('Attacks per Defeat', analytics.offensivePerformance.attacksPerDefeat, '#34d399')}
                    </div>
                    <div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                            ${this.generateStatBox('First Attack Success', analytics.offensivePerformance.firstAttackRate + '%', '#34d399')}
                            ${this.generateStatBox('Comeback Victories', analytics.offensivePerformance.comebackVictories, '#ff6b9d')}
                        </div>
                        <div style="font-size: 8px; color: #999; margin-top: 6px; margin-left: 2px; line-height: 1.3;"><strong>Comeback Victories:</strong> Opponents where your first attack failed, but you came back and defeated them later.</div>
                    </div>
                </div>

                <div>
                    <div style="font-size: 11px; color: #ccc; margin-bottom: 6px;">Result Types Breakdown</div>
                    ${this.generatePieChart(analytics.offensivePerformance.resultBreakdown)}
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">
                        ${this.generateStatBox('Attacked', analytics.offensivePerformance.resultBreakdown['Attacked'] || 0, '#00ffff')}
                        ${this.generateStatBox('Hospitalized', analytics.offensivePerformance.resultBreakdown['Hospitalized'] || 0, '#ff6b9d')}
                        ${this.generateStatBox('Mugged', analytics.offensivePerformance.resultBreakdown['Mugged'] || 0, '#34d399')}
                        ${this.generateStatBox('Assist', analytics.offensivePerformance.resultBreakdown['Assist'] || 0, '#a78bfa')}
                    </div>
                </div>
            </div>

            <!-- Section 3: Defensive Performance -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 14px; font-weight: bold; color: #00ffff; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                    DEFENSIVE PERFORMANCE
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: #ff6b9d; margin-bottom: 4px;">${analytics.defensivePerformance.topAttacker.name} <span style="color: #999;">(${analytics.defensivePerformance.topAttacker.count}x)</span></div>
                        <div style="font-size: 9px; color: #999;">Top Attacker</div>
                    </div>
                    <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 6px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; color: #ff6b9d; margin-bottom: 4px;">${analytics.defensivePerformance.topAttackingFaction.name} <span style="color: #999;">(${analytics.defensivePerformance.topAttackingFaction.count}x)</span></div>
                        <div style="font-size: 9px; color: #999;">Top Attacking Faction</div>
                    </div>
                    <div>
                        ${this.generateStatBox('Revenge Ratio', analytics.defensivePerformance.revengeRatio + '%', '#fb923c')}
                        <div style="font-size: 8px; color: #999; margin-top: 6px; margin-left: 2px; line-height: 1.3;"><strong>Revenge Ratio:</strong> Percentage of attackers you hit back after being attacked. Can exceed 100% if you attacked them multiple times.</div>
                    </div>
                </div>
            </div>

            <!-- Section 4: Stealth Operations -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 14px; font-weight: bold; color: #00ffff; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                    STEALTH OPERATIONS
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${this.generateStatBox('Stealthed Outgoing', analytics.stealthOperations.stealthOutgoing, '#a78bfa', (analytics.outgoingCount > 0 ? ((analytics.stealthOperations.stealthOutgoing / analytics.outgoingCount) * 100).toFixed(1) : '0.0') + '%')}
                    ${this.generateStatBox('Stealthed Incoming', analytics.stealthOperations.stealthIncoming, '#a78bfa', (analytics.incomingCount > 0 ? ((analytics.stealthOperations.stealthIncoming / analytics.incomingCount) * 100).toFixed(1) : '0.0') + '%')}
                </div>
            </div>

            <!-- Section 5: Performance Metrics -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 14px; font-weight: bold; color: #00ffff; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                    OTHER METRICS
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 8px;">Respect</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        ${this.generateStatBox('Total Respect', analytics.performanceMetrics.totalRespect, '#34d399')}
                        ${this.generateStatBox('Avg R/Attack', analytics.performanceMetrics.avgRespect, '#34d399')}
                        ${this.generateStatBox('Highest Respect', analytics.performanceMetrics.highestRespect, '#34d399')}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 8px;">Chains</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        ${this.generateStatBox('Hits in Chain', analytics.performanceMetrics.hitsInChain, '#60a5fa')}
                        ${this.generateStatBox('Hits Outside Chain', analytics.performanceMetrics.hitsOutsideChain, '#999')}
                        ${this.generateStatBox('Chain Ratio', analytics.performanceMetrics.chainRatio, '#a78bfa')}
                    </div>
                </div>

                <div>
                    <div style="font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 8px;">Fair Fight</div>
                    <div style="margin-bottom: 10px;">
                        ${this.generateStatBox('Average Fair Fight', analytics.performanceMetrics.avgFairFight, '#60a5fa')}
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                        ${this.generateStatBox('< 2.0', analytics.performanceMetrics.ffDistribution.under2, '#999')}
                        ${this.generateStatBox('2.0 - 2.99', analytics.performanceMetrics.ffDistribution.range2to3, '#ff6b9d')}
                        ${this.generateStatBox('3.0', analytics.performanceMetrics.ffDistribution.exactly3, '#999')}
                    </div>
                </div>
            </div>

            <!-- Section 6: The Summoning -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 14px; font-weight: bold; color: #00ffff; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
                    THE SUMMONING
                </div>

                <!-- M'aol (main target) -->
                <div style="margin-bottom: 10px;">
                    ${this.generateStatBox("M'aol", analytics.summoningStats.maolAttacks, '#ff6b9d')}
                </div>

                <!-- Minions -->
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;">
                    ${this.generateStatBox("Dyno'", analytics.summoningStats.minions.dyno, '#a78bfa')}
                    ${this.generateStatBox("Nol'", analytics.summoningStats.minions.nol, '#a78bfa')}
                    ${this.generateStatBox("Asmol'", analytics.summoningStats.minions.asmol, '#a78bfa')}
                    ${this.generateStatBox("Sylo'", analytics.summoningStats.minions.sylo, '#a78bfa')}
                    ${this.generateStatBox("Ladso'", analytics.summoningStats.minions.ladso, '#a78bfa')}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
            `;
        },

        /**
         * Open full report view in new tab (for screenshots)
         */
        openFullReportView: function(analytics) {
            HalloweenDebug.log(1, '[Analytics] Opening full report view');

            // Generate HTML
            const fullReportHTML = this.generateFullReportHTML(analytics);

            // Open with Blob URL (desktop/mobile browsers)
            const blob = new Blob([fullReportHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const newTab = window.open(url, '_blank');

            if (newTab) {
                HalloweenDebug.log(1, '[Analytics] Full report opened in new tab (Blob URL)');
            } else {
                alert('Please allow popups to view the full report');
            }
        }
    };

    // Halloween Pumpkin Competition System
    const HalloweenCompetition = {
        // Effect tracking to prevent duplicate triggers
        triggeredEffects: new Set(),

        // Page pool caching (prevents repeated calls and log spam)
        _cachedPagePool: null,
        _pagePoolCacheKey: null,
        _pagePoolLoggedCallers: new Set(),

        // Competition configuration
        TESTING_MODE: false, // Set to true for testing (spawns every minute)
        TESTING_DISPLAY: 'single', // 'all' or 'single' for testing mode (default: single)
        USE_TEST_PAGES_ONLY: false, // When true in test mode, only uses test page

        // Test page (plain text, not encrypted)
        // TODO: Change back to 'https://www.torn.com/index.php' after war testing
        TEST_PAGE: 'https://www.torn.com/page.php?sid=travel',

        // Production pages (17 URLs) - Will be stored encrypted for members
        // Leaders see plain URLs, members get encrypted version via export
        PRODUCTION_PAGES: {
            // Exact match (12 URLs)
            exact: [
                'https://www.torn.com/index.php',
                'https://www.torn.com/gym.php',
                'https://www.torn.com/item.php',
                'https://www.torn.com/city.php',
                'https://www.torn.com/page.php?sid=stocks',
                'https://www.torn.com/casino.php',
                'https://www.torn.com/loader.php?sid=missions',
                'https://www.torn.com/hospitalview.php',
                'https://www.torn.com/calendar.php',
                'https://www.torn.com/page.php?sid=points',
                'https://www.torn.com/page.php?sid=awards',
                'https://www.torn.com/page.php?sid=events'
            ],
            // Base URL match with hash flexibility (3 URLs)
            hashFlexible: [
                'https://www.torn.com/page.php?sid=crimes',
                'https://www.torn.com/page.php?sid=hof',
                'https://www.torn.com/page.php?sid=ItemMarket'
            ],
            // Contains match (2 URLs)
            contains: [
                'https://www.torn.com/factions.php',
                'https://www.torn.com/forums.php'
            ]
        },

        // Get page pool based on current settings
        getPagePool: function() {
            // Generate cache key based on current settings
            const enchantedPagesCount = (typeof HalloweenUI !== 'undefined' &&
                HalloweenUI.competitionSettings &&
                HalloweenUI.competitionSettings.enchantedPages) ?
                HalloweenUI.competitionSettings.enchantedPages.length : 0;

            const cacheKey = `${this.TESTING_MODE}_${this.USE_TEST_PAGES_ONLY}_${enchantedPagesCount}`;

            // Return cached result if key matches
            if (this._cachedPagePool !== null && this._pagePoolCacheKey === cacheKey) {
                return this._cachedPagePool;
            }

            // Cache miss - regenerate page pool
            let pagePool;

            if (this.TESTING_MODE && this.USE_TEST_PAGES_ONLY) {
                // Testing mode with test pages only: return single test page
                pagePool = [{url: this.TEST_PAGE, matchType: 'exact'}];
            } else if (typeof HalloweenUI !== 'undefined' &&
                HalloweenUI.competitionSettings &&
                HalloweenUI.competitionSettings.enchantedPages &&
                HalloweenUI.competitionSettings.enchantedPages.length > 0) {

                // Use dynamic enchanted pages from settings ONLY
                pagePool = HalloweenUI.competitionSettings.enchantedPages.filter(page => page.url && page.url.trim() !== '');

                // Log with caller tracking to prevent spam
                const caller = new Error().stack.split('\n')[2]?.trim() || 'unknown';
                if (!this._pagePoolLoggedCallers.has(caller)) {
                    this._pagePoolLoggedCallers.add(caller);
                    HalloweenDebug.log(3, `🔮 Using ${pagePool.length} enchanted pages from settings`);
                }
            } else {
                // No pages configured - return empty array (no spawns)
                HalloweenDebug.log(3, `🔮 No enchanted pages configured - no spawns will occur`);
                pagePool = [];
            }

            // Cache the result
            this._cachedPagePool = pagePool;
            this._pagePoolCacheKey = cacheKey;

            return pagePool;
        },

        // Base pumpkin distribution rules (per day per player for 7-day competition)
        BASE_DAILY_DISTRIBUTION: {
            candy: 3,     // Most common
            pure: 3,      // Common
            cyber: 1.5,   // Uncommon (randomly rounds to 1 or 2)
            corrupt: 1,   // Rare
            gold: 3/7     // Ultra rare (3 spawns across 7 days)
        },

        // Get distribution adjusted for current competition duration
        getDynamicDistribution: function() {
            const competitionDuration = this.getCompetitionDuration();
            const distribution = {};

            // Scale most types proportionally
            for (const [type, baseDaily] of Object.entries(this.BASE_DAILY_DISTRIBUTION)) {
                if (type === 'gold') {
                    // Gold gets special handling
                    distribution[type] = 3 / Math.max(competitionDuration, 3); // Maintain ~3 total across competition
                } else {
                    // Other types maintain daily rate
                    distribution[type] = baseDaily;
                }
            }

            return distribution;
        },

        getCompetitionDuration: function() {
            // Get duration from HalloweenUI competition settings or default to 7
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                return HalloweenUI.competitionSettings.duration || 7;
            }
            return 7; // Default fallback
        },

        // 2-hour spawn window duration
        SPAWN_DURATION_HOURS: 2,

        // Block duration in hours (12-hour blocks)
        BLOCK_DURATION_HOURS: 12,

        // Competition state
        isActive: false,
        competitionId: null,
        playerId: null,
        spawnSchedule: null,
        currentSpawns: new Map(), // Track active spawns
        lateJoinerAdjusted: false, // Track if late joiner adjustment has been done
        currentPageUrl: null, // Track current page URL
        spawnedOnCurrentPage: new Set(), // Track spawns that have already shown on this page load

        init: function() {
            HalloweenDebug.log(1, '🎃 Initializing Halloween Competition System...');

            // Check if competition should be active
            const seedInfo = SeedManager.getSeedInfo();
            this.playerId = GM_getValue('halloween_player_id', '');

            if (seedInfo.currentSeed && this.playerId) {
                this.activateCompetition(seedInfo.currentSeed);
            } else {
                HalloweenDebug.log(1, '🎃 Competition inactive - no seed or player ID');
            }
        },

        activateCompetition: function(seed) {
            HalloweenDebug.log(1, `🎃 Activating competition for player: ${this.playerId}`);

            this.isActive = true;
            this.competitionId = this.extractCompetitionId(seed);

            // Load logged expirations tracking to prevent duplicate Firebase logs
            const storedExpirations = GM_getValue('halloween_logged_expirations', '[]');
            try {
                this.loggedExpirations = new Set(safeParse(storedExpirations, '[]'));
                HalloweenDebug.log(2, `🎃 Loaded ${this.loggedExpirations.size} previously logged expirations`);
            } catch (e) {
                this.loggedExpirations = new Set();
                HalloweenDebug.log(2, '🎃 Initialized empty expiration tracking');
            }

            // Generate unique spawn schedule for this player
            this.generateSpawnSchedule();

            // Select random spawn for single testing mode (only in testing mode)
            if (this.TESTING_MODE) {
                this.selectRandomTestSpawn();
            }

            // Start monitoring for spawns
            this.startSpawnMonitoring();

            HalloweenDebug.log(1, '🎃 Competition activated successfully');
        },

        selectRandomTestSpawn: function() {
            if (this.spawnSchedule && this.spawnSchedule.length > 0) {
                // Testing mode: Cycle through pumpkin types in order
                const typeOrder = ['candy', 'pure', 'cyber', 'corrupt', 'gold'];

                // Load persisted type index from storage (survives page refreshes)
                if (this.currentTestTypeIndex === undefined) {
                    const stored = GM_getValue('halloween_test_type_index', 0);
                    this.currentTestTypeIndex = parseInt(stored, 10);
                }

                const targetType = typeOrder[this.currentTestTypeIndex];

                // Find first spawn of this type (ignore expiration for testing)
                const typeSpawn = this.spawnSchedule.find(spawn => spawn.pumpkinType === targetType);

                if (typeSpawn) {
                    this.selectedTestSpawn = typeSpawn.spawnId;
                    HalloweenDebug.log(2, `🎃 Selected test spawn: ${this.selectedTestSpawn} (${targetType}, index: ${this.currentTestTypeIndex}) for single mode`);
                } else {
                    // Fallback to first spawn if type not found
                    this.selectedTestSpawn = this.spawnSchedule[0].spawnId;
                    HalloweenDebug.log(2, `🎃 Type ${targetType} not found, using fallback: ${this.selectedTestSpawn}`);
                }

                // Move to next type for next collection/refresh and save to storage
                this.currentTestTypeIndex = (this.currentTestTypeIndex + 1) % typeOrder.length;
                GM_setValue('halloween_test_type_index', this.currentTestTypeIndex);
                HalloweenDebug.log(3, `🎃 Next test type will be: ${typeOrder[this.currentTestTypeIndex]} (index: ${this.currentTestTypeIndex})`);
            }
        },

        refreshSpawns: function() {
            // Hide all current spawns
            this.currentSpawns.forEach((spawn, spawnId) => {
                this.hidePumpkin(spawnId);
            });

            // If in single mode, select a new random spawn (only if respawn allowed)
            if (this.TESTING_MODE && this.TESTING_DISPLAY === 'single') {
                const respawnAllowed = document.getElementById('testing-respawn-allowed')?.checked ?? true;
                if (respawnAllowed) {
                    this.selectRandomTestSpawn();
                    HalloweenDebug.log(2, '🎃 Respawn allowed - selecting new random spawn');
                } else {
                    // Clear selected spawn to prevent respawn
                    this.selectedTestSpawn = null;
                    HalloweenDebug.log(2, '🎃 Respawn disabled - no new spawn until page reload');
                }
            }

            // Trigger immediate spawn check
            this.checkForSpawns();

            HalloweenDebug.log(2, `🎃 Spawns refreshed for ${this.TESTING_DISPLAY} mode`);
        },

        extractCompetitionId: function(seed) {
            return 'halloween-2025';
        },

        generateSpawnSchedule: function() {
            // Check if encrypted schedule already exists in storage (with expired/collected flags)
            const existingEncryptedSchedule = GM_getValue('halloween_spawn_schedule_encrypted', null);
            if (existingEncryptedSchedule && existingEncryptedSchedule !== 'undefined') {
                try {
                    // Decrypt schedule
                    const playerSeed = this.playerId + this.competitionId;
                    const encryptionKey = StorageCrypto.generateKey(playerSeed);
                    const decryptedSchedule = StorageCrypto.decrypt(existingEncryptedSchedule, encryptionKey);

                    if (decryptedSchedule) {
                        this.spawnSchedule = JSON.parse(decryptedSchedule);
                        // Reset failure counter on successful load
                        GM_setValue('halloween_spawn_decrypt_failures', 0);
                        HalloweenDebug.log(2, `🎃 Loaded existing spawn schedule from encrypted storage: ${this.spawnSchedule.length} spawns`);

                        // Debug level 3: Show sample spawns from each block to verify block/date alignment
                        if (HalloweenDebug.level >= 3) {
                            const competitionDuration = this.getCompetitionDuration();
                            const maxBlocks = competitionDuration * 2;
                            for (let block = 1; block <= Math.min(maxBlocks, 6); block++) {
                                const blockSpawns = this.spawnSchedule.filter(s => s.blockNumber === block);
                                const samples = blockSpawns.slice(0, 2); // First 2 spawns per block

                                const sampleInfo = samples.map(s => {
                                    const label = `${s.label.type}-block${s.label.block}-${s.label.date}-${s.label.ampm}`;
                                    return `${label} (${s.spawnDateTime.substr(0, 16)})`;
                                }).join(' | ');

                                HalloweenDebug.log(3, `🎃 [Spawn Schedule] Block ${block} samples: ${sampleInfo}`);
                            }
                        }

                        return; // Use existing schedule (preserves expired/collected flags)
                    } else {
                        // Decryption failed - track failures
                        const failures = GM_getValue('halloween_spawn_decrypt_failures', 0) + 1;
                        GM_setValue('halloween_spawn_decrypt_failures', failures);
                        HalloweenDebug.log(1, `⚠️ Spawn schedule decryption failed (attempt ${failures}) - will retry on next page load`);

                        // Log to Firebase after 10 consecutive failures
                        if (failures === 10) {
                            this.logDecryptionFailureToFirebase(failures);
                        }

                        this.spawnSchedule = [];
                        return;
                    }
                } catch (e) {
                    // Parse error - track failures
                    const failures = GM_getValue('halloween_spawn_decrypt_failures', 0) + 1;
                    GM_setValue('halloween_spawn_decrypt_failures', failures);
                    HalloweenDebug.log(1, `⚠️ Spawn schedule parse failed (attempt ${failures}) - will retry on next page load`);

                    if (failures === 10) {
                        this.logDecryptionFailureToFirebase(failures);
                    }

                    this.spawnSchedule = [];
                    return;
                }
            }

            HalloweenDebug.log(2, '🎃 Generating spawn schedule...');

            const schedule = [];
            const pagePool = this.getPagePool();
            const competitionDuration = this.getCompetitionDuration();

            // Create deterministic random generator using player ID + competition ID + duration
            const randomSeed = this.hashString(this.playerId + this.competitionId + competitionDuration);
            const rng = this.createSeededRandom(randomSeed);

            // Generate spawns for competition duration
            for (let day = 1; day <= competitionDuration; day++) {
                const daySchedule = this.generateDaySchedule(day, rng, pagePool, competitionDuration);
                schedule.push(...daySchedule);
            }

            this.spawnSchedule = schedule;

            // Store schedule encrypted for security (prevent members from spying on spawn times)
            const playerSeed = this.playerId + this.competitionId;
            const encryptionKey = StorageCrypto.generateKey(playerSeed);
            const encryptedSchedule = StorageCrypto.encrypt(JSON.stringify(schedule), encryptionKey);
            GM_setValue('halloween_spawn_schedule_encrypted', encryptedSchedule);

            HalloweenDebug.log(2, `🎃 Generated ${schedule.length} spawn events across ${competitionDuration} days (encrypted)`);

            // Debug level 3: Show sample spawns from each block to verify block/date alignment
            if (HalloweenDebug.level >= 3) {
                const maxBlocks = competitionDuration * 2;
                for (let block = 1; block <= Math.min(maxBlocks, 6); block++) {
                    const blockSpawns = schedule.filter(s => s.blockNumber === block);
                    const samples = blockSpawns.slice(0, 2); // First 2 spawns per block

                    const sampleInfo = samples.map(s => {
                        const label = `${s.label.type}-block${s.label.block}-${s.label.date}-${s.label.ampm}`;
                        return `${label} (${s.spawnDateTime.substr(0, 16)})`;
                    }).join(' | ');

                    HalloweenDebug.log(3, `🎃 [Spawn Schedule] Block ${block} samples: ${sampleInfo}`);
                }
            }
        },

        generateDaySchedule: function(dayNumber, rng, pagePool, competitionDuration) {
            const daySpawns = [];

            // Calculate this day's 2 block numbers
            const blockA = (dayNumber * 2) - 1; // First block of day
            const blockB = dayNumber * 2;        // Second block of day

            // Get dynamic distribution based on competition duration
            const distribution = this.getDynamicDistribution();

            // For each pumpkin type, determine how many to spawn this day
            for (const [type, dailyCount] of Object.entries(distribution)) {
                let spawnCount;

                if (type === 'cyber') {
                    // Cyber: randomly 1 or 2 per day (average 1.5)
                    spawnCount = rng() < 0.5 ? 1 : 2;
                } else if (type === 'gold') {
                    // Gold: Avoid Day 1 (blocks 1-2) and Day 7 (blocks 13-14)
                    const firstDay = Math.max(2, 1);
                    const lastDay = Math.max(competitionDuration - 1, competitionDuration);
                    const eligibleDays = Math.max(lastDay - firstDay + 1, 1);

                    if (dayNumber >= firstDay && dayNumber <= lastDay && competitionDuration >= 3) {
                        // Apply proportional scaling based on competition length
                        const targetGoldTotal = 3;
                        const chancePerDay = targetGoldTotal / eligibleDays;
                        spawnCount = rng() < chancePerDay ? 1 : 0;
                    } else if (competitionDuration < 3) {
                        // Special handling for shortened competition periods
                        const reducedChance = 3 / competitionDuration / competitionDuration;
                        spawnCount = rng() < reducedChance ? 1 : 0;
                    } else {
                        spawnCount = 0;
                    }
                } else {
                    spawnCount = Math.floor(dailyCount);
                }

                // Distribute spawns across the day's 2 blocks for timezone fairness
                for (let i = 0; i < spawnCount; i++) {
                    // Randomly assign to Block A or Block B
                    const targetBlock = rng() < 0.5 ? blockA : blockB;

                    const spawn = this.generateSingleSpawn(targetBlock, type, rng, pagePool);
                    if (spawn) {
                        daySpawns.push(spawn);
                    }
                }
            }

            return daySpawns;
        },

        generateSingleSpawn: function(blockNumber, pumpkinType, rng, pagePool) {
            // Select random page
            const pageIndex = Math.floor(rng() * pagePool.length);
            const pageUrl = pagePool[pageIndex];

            // Generate random time within the 12-hour block
            let blockOffsetHours, blockOffsetMinutes;

            if (this.TESTING_MODE) {
                // Testing mode: spawn every minute for easy testing
                blockOffsetHours = Math.floor(rng() * 24);
                blockOffsetMinutes = Math.floor(rng() * 60);
            } else {
                // Production mode: Random time within 12-hour block
                blockOffsetHours = Math.floor(rng() * this.BLOCK_DURATION_HOURS);
                blockOffsetMinutes = Math.floor(rng() * 60);
            }

            // Calculate absolute spawn time from competition start
            const competitionStart = this.getCompetitionStartTime();
            if (!competitionStart) {
                HalloweenDebug.log(1, `⚠️ Cannot generate spawn - no competition start time`);
                return null;
            }

            // Block start time = competition start + (blockNumber - 1) * 12 hours
            const blockStartMs = competitionStart.getTime() + ((blockNumber - 1) * this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
            const blockStartTime = new Date(blockStartMs);

            // Spawn time = block start + random offset
            const spawnOffsetMs = (blockOffsetHours * 60 + blockOffsetMinutes) * 60 * 1000;
            const spawnDateTime = new Date(blockStartMs + spawnOffsetMs);

            // Determine GMT-based AM/PM label (for Firebase readability only)
            const gmtHour = spawnDateTime.getUTCHours();
            const ampmLabel = gmtHour < 12 ? 'AM' : 'PM';

            // Format date for Firebase label (DD-MM) - dash instead of slash to avoid path issues
            const day = String(spawnDateTime.getUTCDate()).padStart(2, '0');
            const month = String(spawnDateTime.getUTCMonth() + 1).padStart(2, '0');
            const dateLabel = `${day}-${month}`;

            // Create spawn ID
            const randomSuffix = Math.floor(rng() * 1000);
            const spawnId = `${this.playerId}-${pumpkinType}-block${blockNumber}-${randomSuffix}`;

            return {
                spawnId: spawnId,
                playerId: this.playerId,
                pumpkinType: pumpkinType,
                pageUrl: pageUrl,
                blockNumber: blockNumber,
                spawnDateTime: spawnDateTime.toISOString(),
                spawnTime: {
                    block: blockNumber,
                    hour: spawnDateTime.getUTCHours(),
                    minute: spawnDateTime.getUTCMinutes()
                },
                // Label components for Firebase path (human-readable)
                label: {
                    block: blockNumber,
                    type: pumpkinType,
                    date: dateLabel,
                    ampm: ampmLabel,
                    suffix: randomSuffix
                },
                windowDuration: this.SPAWN_DURATION_HOURS * 60, // minutes
                collected: false,
                expired: false
            };
        },

        // Utility functions for deterministic randomization
        hashString: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash);
        },

        createSeededRandom: function(seed) {
            let state = seed;
            return function() {
                state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
                return state / Math.pow(2, 32);
            };
        },

        startSpawnMonitoring: function() {
            // Prevent multiple intervals from being created
            if (this.spawnMonitoringInterval) {
                HalloweenDebug.log(2, '🎃 Spawn monitoring already active - skipping duplicate initialization');
                return;
            }

            HalloweenDebug.log(2, '🎃 Starting spawn monitoring...');

            // Check for spawns every 30 seconds in production, every 5 seconds in testing
            const checkInterval = this.TESTING_MODE ? 5000 : 30000;

            this.spawnMonitoringInterval = setInterval(() => {
                this.checkForSpawns();
            }, checkInterval);

            // Also check immediately
            this.checkForSpawns();
        },

        // Stop spawn monitoring interval
        stopSpawnMonitoring: function() {
            if (this.spawnMonitoringInterval) {
                clearInterval(this.spawnMonitoringInterval);
                this.spawnMonitoringInterval = null;
                HalloweenDebug.log(2, '⏹️ Stopped spawn monitoring interval');
            }
        },

        isSpawnActiveNow: function(spawn, currentTime) {
            // In testing mode, handle spawn display based on testing display mode
            if (this.TESTING_MODE) {
                // Testing mode: collected flag is for stats/Firebase only, not display
                // Type cycling handles variety, collected status persists for logging

                if (this.TESTING_DISPLAY === 'single') {
                    // Only show the selected random spawn for this session
                    return spawn.spawnId === this.selectedTestSpawn;
                } else {
                    // Show all spawns (default behavior)
                    return true;
                }
            }

            // Check if competition is active and configured
            if (!this.isCompetitionActive()) {
                return false;
            }

            // Get competition state from HalloweenUI
            const competitionState = this.getCompetitionState();
            if (competitionState.status !== 'active') {
                return false; // Competition not active
            }

            // Block-based system: Check if we're in the correct block
            if (spawn.blockNumber !== competitionState.currentBlock) {
                return false; // Wrong block
            }

            // Check if we're in the spawn's time window (2-hour window)
            return this.isInSpawnTimeWindow(spawn, currentTime);
        },

        isCompetitionActive: function() {
            // Check if competition is enabled in UI settings
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                return HalloweenUI.competitionSettings.active;
            }
            return false;
        },

        getCompetitionState: function() {
            // Delegate to HalloweenUI for state management
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.getCompetitionState) {
                return HalloweenUI.getCompetitionState();
            }
            return { status: 'unconfigured' };
        },

        isInSpawnTimeWindow: function(spawn, currentTime) {
            try {
                const now = new Date(currentTime);

                // Block-based system: spawn has absolute spawnDateTime already calculated
                if (!spawn.spawnDateTime) {
                    HalloweenDebug.log(2, `🎃 No spawnDateTime for spawn ${spawn.spawnId}`);
                    return false;
                }

                const spawnDate = new Date(spawn.spawnDateTime);
                if (isNaN(spawnDate.getTime())) {
                    HalloweenDebug.log(2, `🎃 Invalid spawnDateTime for spawn ${spawn.spawnId}: ${spawn.spawnDateTime}`);
                    return false;
                }

                // Define 2-hour spawn window
                const windowStart = spawnDate;
                const windowEnd = new Date(spawnDate.getTime() + (this.SPAWN_DURATION_HOURS * 60 * 60 * 1000));

                // Check if current time is within spawn window
                const isInWindow = now >= windowStart && now <= windowEnd;

                HalloweenDebug.log(3, `🎃 Spawn ${spawn.spawnId}: window ${windowStart.toISOString()} to ${windowEnd.toISOString()}, current ${now.toISOString()}, active: ${isInWindow}`);

                return isInWindow;
            } catch (error) {
                HalloweenDebug.log(2, `🎃 Error checking spawn window for ${spawn.spawnId}: ${error.message}`);
                return false;
            }
        },

        getCompetitionStartTime: function() {
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                const { startDate, startTime } = HalloweenUI.competitionSettings;
                if (startDate && startTime) {
                    return new Date(`${startDate}T${startTime}:00.000Z`);
                }
            }
            return null;
        },

        // Late Joiner Logic - Handle players joining mid-competition
        adjustScheduleForLateJoiner: function() {
            const competitionState = this.getCompetitionState();

            if (competitionState.status === 'active' && this.spawnSchedule) {
                const currentBlock = competitionState.currentBlock;

                // Mark all spawns from past blocks as missed/expired
                const skippedLateJoiners = [];
                this.spawnSchedule.forEach(spawn => {
                    if (spawn.blockNumber < currentBlock && !spawn.expired) {
                        spawn.expired = true;
                        HalloweenDebug.log(3, `🎃 Marked spawn ${spawn.spawnId} as expired (Block ${spawn.blockNumber} < Current Block ${currentBlock})`);

                        // Log late joiner expiration to Firebase
                        const logged = this.logExpirationEvent(spawn, 'late_joiner', currentBlock);
                        if (logged === false) {
                            skippedLateJoiners.push(spawn.spawnId);
                        }
                    }
                });

                // Log summary of skipped late joiner expirations
                if (skippedLateJoiners.length > 0) {
                    HalloweenDebug.log(2, `🎃 [Firebase] Skipped ${skippedLateJoiners.length} already-logged expirations (late_joiner): [${skippedLateJoiners.join(', ')}]`);
                }

                // For current block, mark past spawns as expired (window ended)
                const now = new Date();
                const skippedTimeExpired = [];
                this.spawnSchedule.forEach(spawn => {
                    if (spawn.blockNumber === currentBlock) {
                        const spawnTime = new Date(spawn.spawnDateTime);
                        const windowEnd = new Date(spawnTime.getTime() + (this.SPAWN_DURATION_HOURS * 60 * 60 * 1000));

                        if (now > windowEnd && !spawn.expired) {
                            spawn.expired = true;
                            HalloweenDebug.log(3, `🎃 Marked current block spawn ${spawn.spawnId} as expired (past window)`);

                            // Log time expired to Firebase
                            const logged = this.logExpirationEvent(spawn, 'time_expired', currentBlock);
                            if (logged === false) {
                                skippedTimeExpired.push(spawn.spawnId);
                            }
                        }
                    }
                });

                // Log summary of skipped time expired expirations
                if (skippedTimeExpired.length > 0) {
                    HalloweenDebug.log(2, `🎃 [Firebase] Skipped ${skippedTimeExpired.length} already-logged expirations (time_expired): [${skippedTimeExpired.join(', ')}]`);
                }

                // Track expired IDs (secure - only stores IDs, not future spawn times)
                const expiredIds = safeParse(GM_getValue('halloween_expired_pumpkin_ids', '[]'), []);
                let expiredAdded = 0;
                this.spawnSchedule.forEach(spawn => {
                    if (spawn.expired && !expiredIds.includes(spawn.spawnId)) {
                        expiredIds.push(spawn.spawnId);
                        expiredAdded++;
                    }
                });
                if (expiredAdded > 0) {
                    GM_setValue('halloween_expired_pumpkin_ids', JSON.stringify(expiredIds));
                    HalloweenDebug.log(2, `🎃 Tracked ${expiredAdded} expired spawn IDs from late joiner adjustment`);
                }

                HalloweenDebug.log(2, `🎃 Late joiner adjustment completed for Block ${currentBlock}`);
            }
        },

        getSpawnDateTime: function(spawn) {
            // Block-based system: spawn has absolute spawnDateTime already calculated
            if (spawn.spawnDateTime) {
                return new Date(spawn.spawnDateTime);
            }
            return null;
        },

        // Enhanced spawn checking that respects expired status
        checkForSpawns: function() {
            if (!this.spawnSchedule || this.spawnSchedule.length === 0) {
                return;
            }

            const currentTime = Date.now();
            const currentUrl = window.location.href;

            // Debug level 3: Check if any spawns are available right now
            if (HalloweenDebug.level >= 3) {
                const competitionState = this.getCompetitionState();
                if (competitionState.status === 'active') {
                    // Calculate and log current block end time
                    const competitionStart = this.getCompetitionStartTime();
                    if (competitionStart) {
                        const blockEndMs = competitionStart.getTime() + (competitionState.currentBlock * this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
                        const blockEndTime = new Date(blockEndMs);
                        const blockEndStr = blockEndTime.toISOString().substring(0, 16).replace('T', ' ') + ' UTC';
                        HalloweenDebug.log(3, `🎃 Current Block ${competitionState.currentBlock}, ends at ${blockEndStr}`);
                    }

                    // Find spawns for current block that are in active time window
                    const currentBlockSpawns = this.spawnSchedule.filter(s =>
                        s.blockNumber === competitionState.currentBlock &&
                        !s.expired &&
                        !s.collected
                    );

                    const activeSpawns = currentBlockSpawns.filter(s =>
                        this.isInSpawnTimeWindow(s, currentTime)
                    );

                    if (activeSpawns.length > 0) {
                        const spawnTypes = activeSpawns.map(s => `${s.pumpkinType} (${s.spawnId})`).join(', ');
                        HalloweenDebug.log(3, `🎃 SPAWN AVAILABLE NOW - ${activeSpawns.length} active spawn(s): ${spawnTypes}`);
                    } else {
                        // Find next upcoming spawn in current block
                        const upcomingInBlock = currentBlockSpawns.filter(s => {
                            const spawnTime = this.getSpawnDateTime(s);
                            return spawnTime && spawnTime.getTime() > currentTime;
                        }).sort((a, b) => {
                            const aTime = this.getSpawnDateTime(a);
                            const bTime = this.getSpawnDateTime(b);
                            return aTime.getTime() - bTime.getTime();
                        });

                        if (upcomingInBlock.length > 0) {
                            const nextSpawn = upcomingInBlock[0];
                            const nextSpawnTime = this.getSpawnDateTime(nextSpawn);
                            const minutesUntil = Math.floor((nextSpawnTime.getTime() - currentTime) / 60000);
                            HalloweenDebug.log(3, `🎃 No spawn available - Next: ${nextSpawn.pumpkinType} in ${minutesUntil} minutes (${nextSpawnTime.toISOString()})`);
                        } else {
                            HalloweenDebug.log(3, `🎃 No spawn available - No more spawns scheduled for this block (Block ${competitionState.currentBlock})`);
                        }
                    }
                }
            }

            // Track page changes - clear spawn history when URL changes
            if (this.currentPageUrl !== currentUrl) {
                HalloweenDebug.log(2, `🎃 Page changed - clearing spawn history for new page`);
                this.spawnedOnCurrentPage.clear();
                this.currentPageUrl = currentUrl;
            }

            // Adjust for late joiners (only once)
            if (!this.lateJoinerAdjusted) {
                this.adjustScheduleForLateJoiner();
                this.lateJoinerAdjusted = true;
            }

            // Get page pool ONCE before the loop (optimization to prevent repeated calls)
            const cachedPagePool = this.getPagePool();

            // Load collected/expired IDs once (performance optimization)
            const collectedIds = safeParse(GM_getValue('halloween_collected_pumpkin_ids', '[]'), []);
            const expiredIds = safeParse(GM_getValue('halloween_expired_pumpkin_ids', '[]'), []);

            this.spawnSchedule.forEach(spawn => {
                // Skip expired spawns (except in testing mode)
                if (spawn.expired && !this.TESTING_MODE) {
                    return;
                }

                // Skip if already collected (check persistent storage)
                if (spawn.collected || collectedIds.includes(spawn.spawnId)) {
                    return;
                }

                // Skip if marked as expired in storage
                if (expiredIds.includes(spawn.spawnId)) {
                    return;
                }

                // Check if this spawn should be active now
                const isActive = this.isSpawnActiveNow(spawn, currentTime);

                // Page check: In testing mode, show on appropriate pages based on USE_TEST_PAGES_ONLY
                let isOnPage;
                if (this.TESTING_MODE) {
                    if (this.USE_TEST_PAGES_ONLY) {
                        // Testing mode with test pages only: show on test page
                        isOnPage = this.isOnCorrectPage({url: this.TEST_PAGE, matchType: 'exact'}, currentUrl);
                    } else {
                        // Testing mode with production pages: show on any production page (use cached pool)
                        isOnPage = cachedPagePool.some(pageConfig => this.isOnCorrectPage(pageConfig, currentUrl));
                    }
                } else {
                    // Production mode: show only on spawn's assigned page
                    isOnPage = this.isOnCorrectPage(spawn.pageUrl, currentUrl);
                }

                if (isActive && isOnPage) {
                    // Prevent multiple spawns on same page (unless respawn is allowed in testing mode)
                    const allowRespawn = this.TESTING_MODE && this.ALLOW_RESPAWN_IN_TESTING;
                    const alreadySpawnedOnPage = this.spawnedOnCurrentPage.has(spawn.spawnId);

                    if (alreadySpawnedOnPage && !allowRespawn) {
                        HalloweenDebug.log(3, `🎃 Spawn ${spawn.spawnId} already shown on this page - skipping`);
                        return;
                    }

                    // Show the pumpkin if not already showing
                    if (!this.currentSpawns.has(spawn.spawnId)) {
                        this.showPumpkin(spawn);
                        this.spawnedOnCurrentPage.add(spawn.spawnId); // Mark as spawned on this page
                    }
                } else {
                    // Hide the pumpkin if it was showing
                    if (this.currentSpawns.has(spawn.spawnId)) {
                        this.hidePumpkin(spawn.spawnId);
                    }
                }
            });
        },

        isOnCorrectPage: function(pageConfig, currentUrl) {
            // Handle legacy format (string or regex)
            if (typeof pageConfig === 'string') {
                return currentUrl.includes(pageConfig);
            }
            if (pageConfig instanceof RegExp) {
                return pageConfig.test(currentUrl);
            }

            // New format: {url: string, matchType: 'exact'|'contains'|'hashFlexible'}
            if (pageConfig && typeof pageConfig === 'object' && pageConfig.url) {
                const { url, matchType } = pageConfig;

                switch (matchType) {
                    case 'exact':
                        // Exact string match
                        return currentUrl === url;

                    case 'contains':
                        // URL contains the string
                        return currentUrl.includes(url);

                    case 'hashFlexible':
                        // Match base URL, ignore hash fragments
                        const currentWithoutHash = currentUrl.split('#')[0];
                        return currentWithoutHash === url;

                    default:
                        // Default to contains for backward compatibility
                        return currentUrl.includes(url);
                }
            }

            return false;
        },

        showPumpkin: function(spawn) {
            HalloweenDebug.log(2, `🎃 Showing ${spawn.pumpkinType} pumpkin: ${spawn.spawnId}`);

            // Track that this spawn is active
            this.currentSpawns.set(spawn.spawnId, spawn);

            // Create visual pumpkin element on page
            this.createPumpkinElement(spawn);

            // Play spawn detection sound
            HalloweenDebug.log(2, '🎃 About to call playSpawnSound()');
            this.playSpawnSound();
            HalloweenDebug.log(2, '🎃 playSpawnSound() call completed');

            // Log spawn event to Firebase (future implementation)
            this.logSpawnEvent(spawn);
        },

        hidePumpkin: function(spawnId) {
            HalloweenDebug.log(2, `🎃 Hiding pumpkin: ${spawnId}`);

            // Remove from active spawns
            this.currentSpawns.delete(spawnId);

            // Remove visual pumpkin element from page
            this.removePumpkinElement(spawnId);
        },

        collectPumpkin: function(spawnId) {
            const spawn = this.currentSpawns.get(spawnId);
            if (!spawn) return false;

            HalloweenDebug.log(1, `🎃 Collecting ${spawn.pumpkinType} pumpkin: ${spawnId}`);

            // Mark as collected in schedule (in-memory only)
            const scheduleSpawn = this.spawnSchedule.find(s => s.spawnId === spawnId);
            if (scheduleSpawn) {
                scheduleSpawn.collected = true;

                // TESTING MODE: Skip storage saving (allows respawn testing without contaminating production data)
                if (!this.TESTING_MODE) {
                    // Track collected ID (secure - only stores IDs, not future spawn times)
                    const collectedIds = safeParse(GM_getValue('halloween_collected_pumpkin_ids', '[]'), []);
                    if (!collectedIds.includes(spawnId)) {
                        collectedIds.push(spawnId);
                        GM_setValue('halloween_collected_pumpkin_ids', JSON.stringify(collectedIds));
                        HalloweenDebug.log(2, `🎃 Tracked collection: ${spawnId}`);
                    }

                    // GOLD PUMPKIN SPECIAL: Cancel all future gold spawns after first collection
                    if (spawn.pumpkinType === 'gold') {
                        const futureGolds = this.spawnSchedule.filter(s =>
                            s.pumpkinType === 'gold' &&
                            s.spawnId !== spawnId &&
                            !s.collected
                        );
                        futureGolds.forEach(goldSpawn => {
                            goldSpawn.collected = true;
                            if (!collectedIds.includes(goldSpawn.spawnId)) {
                                collectedIds.push(goldSpawn.spawnId);
                            }
                        });
                        if (futureGolds.length > 0) {
                            GM_setValue('halloween_collected_pumpkin_ids', JSON.stringify(collectedIds));
                            HalloweenDebug.log(1, `🏆 Gold collected! Cancelled ${futureGolds.length} future gold spawn(s)`);
                        }
                    }
                } else {
                    HalloweenDebug.log(2, `🎃 TESTING MODE: Collection not saved to storage (in-memory only)`);
                }

                // Update collectibles count
                this.updateCollectibleCount(spawn.pumpkinType);

                // Log collection event
                this.logCollectionEvent(spawn);

                // Fade out spawn audio
                this.fadeOutSpawnSound(3000); // 3 second fade out

                // Remove from active spawns (but don't hide yet - let animation play)
                this.currentSpawns.delete(spawnId);

                // Show notification (no collection sound)
                this.showCollectionFeedback(spawn);

                // In testing mode, refresh spawns to advance type (respects respawn setting)
                if (this.TESTING_MODE) {
                    // Delay slightly to let collection animation play
                    setTimeout(() => {
                        this.refreshSpawns();
                    }, 500);
                }

                return true;
            }

            return false;
        },

        updateCollectibleCount: function(pumpkinType) {
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = safeParse(collectibles, '{}');

            counts[pumpkinType] = (counts[pumpkinType] || 0) + 1;

            GM_setValue('halloween_collectibles', JSON.stringify(counts));

            HalloweenDebug.log(2, `🎃 Updated ${pumpkinType} count to: ${counts[pumpkinType]}`);

            // Refresh menu if open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }
        },

        showCollectionFeedback: function(spawn) {
            // Delay notification to allow spin animation to be visible
            setTimeout(() => {
                this.createCollectionNotification(spawn);
            }, 300); // 300ms delay allows animation to be seen

            // Update UI immediately if menu is open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }

            HalloweenDebug.log(1, `🎃 Collection feedback shown for ${spawn.pumpkinType} pumpkin (delayed 300ms)`);
        },

        playSpawnSound: function() {
            HalloweenDebug.log(2, '🔊 playSpawnSound() called');

            try {
                // Don't play sound on attack page (interferes with combat)
                if (PageDetector.isAttackPage()) {
                    HalloweenDebug.log(2, '🔊 Attack page detected - skipping spawn sound');
                    return;
                }

                const soundEnabled = GM_getValue('halloween_sound_enabled', true);
                HalloweenDebug.log(2, `🔊 Sound setting check: halloween_sound_enabled = "${soundEnabled}"`);

                if (soundEnabled) {
                    HalloweenDebug.log(2, '🔊 Creating audio element...');
                    // GitHub hosted Halloween pumpkin spawn sound (laughter)
                    this.currentSpawnAudio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-laughter-loop.mp3');
                    this.currentSpawnAudio.volume = 0.7;

                    // Check if we can load the audio file
                    this.currentSpawnAudio.addEventListener('canplaythrough', () => {
                        HalloweenDebug.log(2, '🔊 Audio file loaded successfully');
                    });

                    this.currentSpawnAudio.addEventListener('error', (e) => {
                        HalloweenDebug.log(1, '❌ Audio file failed to load:', e.message);
                    });

                    HalloweenDebug.log(2, '🔊 Attempting to play audio...');
                    this.currentSpawnAudio.play().then(() => {
                        HalloweenDebug.log(1, '✅ Pumpkin spawn sound played successfully');
                    }).catch(e => {
                        HalloweenDebug.log(1, '❌ Spawn sound failed to play:', e.message);
                        HalloweenDebug.log(2, `🔊 Audio error details: ${e.name} - ${e.message}`);

                        // Check if it's an autoplay policy issue
                        if (e.name === 'NotAllowedError') {
                            HalloweenDebug.log(1, '🚫 Chrome autoplay policy blocked audio - user interaction required');
                            HalloweenDebug.log(1, '💡 Try clicking anywhere on the page first, then refresh the pumpkin');
                        }
                    });
                } else {
                    HalloweenDebug.log(2, '🔇 Spawn sound disabled - setting is not "true"');
                }
            } catch (e) {
                HalloweenDebug.log(1, '❌ Spawn sound error:', e.message);
            }
        },

        fadeOutSpawnSound: function(duration = 500) {
            if (!this.currentSpawnAudio) return;

            HalloweenDebug.log(2, `🔊 Fading out spawn audio over ${duration}ms`);

            const audio = this.currentSpawnAudio;
            const startVolume = audio.volume;
            const fadeStep = startVolume / (duration / 50); // 50ms intervals

            const fadeInterval = setInterval(() => {
                if (audio.volume > fadeStep) {
                    audio.volume -= fadeStep;
                } else {
                    audio.volume = 0;
                    audio.pause();
                    clearInterval(fadeInterval);
                    HalloweenDebug.log(2, '🔊 Spawn audio faded out and stopped');
                }
            }, 50);
        },

        playCollectionSound: function() {
            // Collection sound removed - audio only plays on spawn detection
            HalloweenDebug.log(2, '🔇 Collection sound disabled - spawn detection audio only');
        },

        createCollectionNotification: function(spawn) {
            const pumpkinConfig = this.getPumpkinConfig(spawn.pumpkinType);

            // Create dramatic notification element with no background badge
            const notification = document.createElement('div');
            notification.className = 'halloween-collection-notification';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.5);
                color: ${pumpkinConfig.textColor};
                font-family: 'Metal Mania', cursive;
                font-weight: normal;
                z-index: 10001;
                text-shadow:
                    0 0 20px ${pumpkinConfig.glowColor},
                    0 0 40px ${pumpkinConfig.glowColor},
                    0 0 60px ${pumpkinConfig.glowColor},
                    4px 4px 8px rgba(0,0,0,0.9);
                animation: collectionNotificationShow 2s ease-out forwards;
                pointer-events: none;
                user-select: none;
                text-align: center;
                filter: drop-shadow(0 0 30px ${pumpkinConfig.glowColor});
            `;

            // Set notification content with responsive sizing
            const rarity = this.getPumpkinRarity(spawn.pumpkinType);
            notification.innerHTML = `
                <div style="font-size: 4.5em; line-height: 1; margin-bottom: 0.2em; letter-spacing: 0.05em;">
                    PUMPKIN COLLECTED!
                </div>
                <div style="font-size: 2.7em; opacity: 0.9; letter-spacing: 0.03em;">
                    ${spawn.pumpkinType.toUpperCase()}
                </div>
                <div style="font-size: 1.65em; opacity: 0.7; margin-top: 0.2em;">
                    ${rarity}
                </div>
            `;

            document.body.appendChild(notification);

            // Remove notification on click or after 4 seconds
            notification.style.cursor = 'pointer';
            notification.style.pointerEvents = 'auto';

            const removeNotification = () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            };

            notification.addEventListener('click', removeNotification);
            setTimeout(removeNotification, 4000);
        },

        showCompetitionEndNotification: function(totalAttacks, uniqueOpponents, totalDefeats) {
            // Create permanent celebration notification for Halloween competition end
            const notification = document.createElement('div');
            notification.id = 'halloween-competition-end-notification';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, rgba(255, 140, 0, 0.95) 0%, rgba(255, 69, 0, 0.95) 100%);
                color: #fff;
                padding: 25px 35px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: bold;
                z-index: 10001;
                border: 3px solid #FFD700;
                box-shadow: 0 0 30px rgba(255, 140, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3);
                text-align: center;
                max-width: 400px;
                cursor: pointer;
            `;

            notification.innerHTML = `
                <div style="font-size: 20px; margin-bottom: 12px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🎃 HALLOWEEN COMPETITION ENDED! 🎃</div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 15px; line-height: 1.5;">
                    Stats preserved: <strong>${totalAttacks}</strong> attacks, <strong>${uniqueOpponents}</strong> opponents, <strong>${totalDefeats}</strong> defeated
                </div>
                <div style="font-size: 10px; opacity: 0.7; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 10px;">
                    Click to dismiss \u2022 Won't show again until next reset
                </div>
            `;

            document.body.appendChild(notification);

            // Remove on click
            notification.addEventListener('click', () => {
                notification.remove();
            });
        },

        showSpookyTargetsEndNotification: function(isPreview = false) {
            // Check if already shown (skip for preview)
            if (!isPreview && GM_getValue('halloween_spooky_targets_end_shown', false)) {
                return;
            }

            // Create permanent celebration notification for Spooky Targets end
            const notification = document.createElement('div');
            notification.id = 'spooky-targets-end-notification';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, rgba(74, 20, 140, 0.95) 0%, rgba(40, 10, 90, 0.95) 100%);
                color: #fff;
                padding: 25px 35px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: bold;
                z-index: 10001;
                border: 3px solid #FFD700;
                box-shadow: 0 0 30px rgba(74, 20, 140, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3);
                text-align: center;
                max-width: 400px;
                cursor: pointer;
            `;

            notification.innerHTML = `
                <div style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Metal Mania', cursive; font-weight: normal; font-size: 20px; margin-bottom: 12px;">👻 SPOOKY TARGETS ENDED! 👻</div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 15px; line-height: 1.5;">
                    Final scores will be validated and shared soon!
                </div>
                <div style="font-size: 10px; opacity: 0.7; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 10px;">
                    Click to dismiss${isPreview ? ' \u2022 PREVIEW MODE' : ' \u2022 Won\'t show again until next reset'}
                </div>
            `;

            document.body.appendChild(notification);

            // Mark as shown (skip for preview)
            if (!isPreview) {
                GM_setValue('halloween_spooky_targets_end_shown', true);
            }

            // Remove on click
            notification.addEventListener('click', () => {
                notification.remove();
            });
        },

        getPumpkinRarity: function(pumpkinType) {
            const rarities = {
                gold: 'ULTRA RARE',
                corrupt: 'RARE',
                cyber: 'UNCOMMON',
                pure: 'COMMON',
                candy: 'COMMON'
            };
            return rarities[pumpkinType] || 'COMMON';
        },

        createPumpkinElement: function(spawn) {
            // Get pumpkin configuration based on type
            const pumpkinConfig = this.getPumpkinConfig(spawn.pumpkinType);

            // Calculate random position within safe viewport bounds
            const position = this.calculateRandomPosition();

            // Create pumpkin container
            const pumpkinElement = document.createElement('div');
            pumpkinElement.id = `halloween-pumpkin-${spawn.spawnId}`;
            pumpkinElement.className = `halloween-competition-pumpkin ${spawn.pumpkinType}-pumpkin`;
            pumpkinElement.style.cssText = `
                position: absolute;
                left: ${position.x}px;
                top: ${position.y}px;
                width: 45px;
                height: 45px;
                background-image: url('${pumpkinConfig.imageUrl}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                cursor: pointer;
                z-index: 9999;
                animation: pumpkinThrob 2s ease-in-out infinite, ${pumpkinConfig.glowAnimation} 3s ease-in-out infinite;
                filter: drop-shadow(0 0 8px ${pumpkinConfig.glowColor});
                transition: transform 0.2s ease, filter 0.2s ease;
                user-select: none;
            `;

            // Add hover effects
            pumpkinElement.addEventListener('mouseenter', () => {
                pumpkinElement.style.transform = 'scale(1.1)';
                pumpkinElement.style.filter = `drop-shadow(0 0 12px ${pumpkinConfig.glowColor})`;
            });

            pumpkinElement.addEventListener('mouseleave', () => {
                pumpkinElement.style.transform = 'scale(1)';
                pumpkinElement.style.filter = `drop-shadow(0 0 8px ${pumpkinConfig.glowColor})`;
            });

            // Add click handler for collection
            pumpkinElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.collectPumpkin(spawn.spawnId)) {
                    // Successful collection animation (1.5 seconds to see the spin)
                    pumpkinElement.style.animation = 'pumpkinCollect 1.5s ease-out forwards';
                    setTimeout(() => {
                        this.removePumpkinElement(spawn.spawnId);
                    }, 1500);
                }
            });

            // Add to page
            document.body.appendChild(pumpkinElement);

            HalloweenDebug.log(3, `🎃 Created visual pumpkin at (${position.x}, ${position.y}): ${spawn.spawnId}`);
        },

        removePumpkinElement: function(spawnId) {
            const element = document.getElementById(`halloween-pumpkin-${spawnId}`);
            if (element) {
                element.remove();
                HalloweenDebug.log(3, `🎃 Removed visual pumpkin: ${spawnId}`);
            }
        },

        calculateRandomPosition: function() {
            // Get viewport dimensions
            const pageWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Get actual content height, excluding pumpkin elements that may inflate page
            // Remove any existing pumpkins temporarily to get true content height
            const existingPumpkins = document.querySelectorAll('.halloween-competition-pumpkin');
            const pumpkinDisplay = [];
            existingPumpkins.forEach(p => {
                pumpkinDisplay.push(p.style.display);
                p.style.display = 'none';
            });

            const rawHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            // Restore pumpkin visibility
            existingPumpkins.forEach((p, i) => {
                p.style.display = pumpkinDisplay[i];
            });

            // Cap height to reasonable maximum (prevents rules page inflation bug)
            // Use viewport height * 3 as reasonable maximum for scrollable pages
            const maxCap = viewportHeight * 3;
            const pageHeight = Math.min(rawHeight, maxCap);

            // SPAWN ZONE LOGIC (SEE: docs/pumpkin-spawn-logic.md)
            // Calculate if we heavily capped the page (difference >= 25%)
            const difference = Math.abs(rawHeight - pageHeight);
            const differencePercent = (difference / rawHeight) * 100;

            // If page was heavily capped (>25% difference), use full capped height
            // If page is natural size (<25% difference), avoid bottom 25%
            const spawnableHeight = differencePercent >= 25
                ? pageHeight  // Large difference - use full capped area
                : pageHeight * 0.75;  // Small difference - keep 25% bottom buffer

            // Define safe margins
            const margin = 50;
            const pumpkinSize = 45;

            // Calculate safe bounds
            const minX = margin;
            const maxX = pageWidth - margin - pumpkinSize;
            const minY = 150; // Exclude top 150px for mobile menu area
            const maxY = spawnableHeight - margin - pumpkinSize;

            HalloweenDebug.log(3, `🎃 Spawn zone calculation:
  - Viewport: ${viewportHeight}px
  - Page height: raw=${rawHeight}px, capped=${pageHeight}px
  - Cap difference: ${differencePercent.toFixed(1)}% ${differencePercent >= 25 ? '(using full height)' : '(using 75% buffer)'}
  - Y bounds: min=${minY}px, max=${maxY}px
  - Available spawn height: ${maxY - minY}px`);

            // Generate random position
            const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

            HalloweenDebug.log(3, `🎃 Pumpkin spawned at: x=${x}px, y=${y}px`);

            return { x, y };
        },

        getPumpkinConfig: function(pumpkinType) {
            const configs = {
                gold: {
                    imageUrl: 'https://i.ibb.co/67ffM1nP/Gold.png',
                    glowColor: '#FFD700',
                    textColor: '#8B4513',
                    glowAnimation: 'pumpkinGoldGlow'
                },
                corrupt: {
                    imageUrl: 'https://i.ibb.co/FkpnKh7Z/Corrupt.png',
                    glowColor: '#8B0000',
                    textColor: '#3e5058',
                    glowAnimation: 'pumpkinCorruptGlow'
                },
                cyber: {
                    imageUrl: 'https://i.ibb.co/fdSK5bNM/Cyber.png',
                    glowColor: '#00FFFF',
                    textColor: '#632d9f',
                    glowAnimation: 'pumpkinCyberGlow'
                },
                pure: {
                    imageUrl: 'https://i.ibb.co/Xf7FR9gP/Pure.png',
                    glowColor: '#FFFFFF',
                    textColor: '#ff4500',
                    glowAnimation: 'pumpkinPureGlow'
                },
                candy: {
                    imageUrl: 'https://i.ibb.co/sd0SzWJz/candyv2.png',
                    glowColor: '#f398ba',
                    textColor: '#f22f73',
                    glowAnimation: 'pumpkinCandyGlow'
                }
            };

            return configs[pumpkinType] || configs.candy;
        },

        logSpawnEvent: function(spawn) {
            try {
                // Calculate block times for Firebase
                const competitionStart = this.getCompetitionStartTime();
                const blockStartMs = competitionStart.getTime() + ((spawn.blockNumber - 1) * this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
                const blockEndMs = blockStartMs + (this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
                const spawnTime = new Date(spawn.spawnDateTime);
                const windowEndMs = spawnTime.getTime() + (this.SPAWN_DURATION_HOURS * 60 * 60 * 1000);

                const eventData = {
                    eventType: 'pumpkin_spawn',
                    timestamp: new Date().toISOString(),
                    playerId: this.playerId,
                    spawnId: spawn.spawnId,
                    pumpkinType: spawn.pumpkinType,
                    blockNumber: spawn.blockNumber,
                    spawnDateTime: spawn.spawnDateTime,
                    spawnWindowEnd: new Date(windowEndMs).toISOString(),
                    blockStartTime: new Date(blockStartMs).toISOString(),
                    blockEndTime: new Date(blockEndMs).toISOString(),
                    pageUrl: spawn.pageUrl,
                    userAgent: navigator.userAgent.substring(0, 100),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };

                // Send to Firebase with new label format
                this.sendToFirebase('spawn_events', spawn, eventData);

                HalloweenDebug.log(3, `🎃 [Firebase] Spawn event logged: ${spawn.spawnId}`);
            } catch (e) {
                HalloweenDebug.log(2, `🎃 [Firebase] Spawn logging error: ${e.message}`);
            }
        },

        logCollectionEvent: function(spawn) {
            try {
                // Calculate block times for Firebase
                const competitionStart = this.getCompetitionStartTime();
                const blockStartMs = competitionStart.getTime() + ((spawn.blockNumber - 1) * this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
                const blockEndMs = blockStartMs + (this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
                const spawnTime = new Date(spawn.spawnDateTime);
                const windowEndMs = spawnTime.getTime() + (this.SPAWN_DURATION_HOURS * 60 * 60 * 1000);

                const eventData = {
                    eventType: 'pumpkin_collection',
                    timestamp: new Date().toISOString(),
                    playerId: this.playerId,
                    spawnId: spawn.spawnId,
                    pumpkinType: spawn.pumpkinType,
                    blockNumber: spawn.blockNumber,
                    spawnDateTime: spawn.spawnDateTime,
                    spawnWindowEnd: new Date(windowEndMs).toISOString(),
                    blockStartTime: new Date(blockStartMs).toISOString(),
                    blockEndTime: new Date(blockEndMs).toISOString(),
                    pageUrl: spawn.pageUrl,
                    collectionTime: performance.now(),
                    totalCollected: this.getTotalCollectedCount(),
                    typeCollected: this.getTypeCollectedCount(spawn.pumpkinType)
                };

                // Send to Firebase with new label format
                this.sendToFirebase('collection_events', spawn, eventData);

                HalloweenDebug.log(3, `🎃 [Firebase] Collection event logged: ${spawn.spawnId}`);
            } catch (e) {
                HalloweenDebug.log(2, `🎃 [Firebase] Collection logging error: ${e.message}`);
            }
        },

        sendToFirebase: function(collection, spawn, data) {
            const firebaseURL = FactionConfig.getConfig().collectionsFirebaseURL;

            if (!firebaseURL) {
                HalloweenDebug.log(2, '🎃 [Firebase] No collections Firebase URL configured - data not sent');
                return;
            }

            // Determine testing vs production mode
            const mode = HalloweenUI.competitionSettings.testingMode ? 'testing' : 'production';

            // Build label from spawn.label components: block3-pure-20/10-PM-847
            const firebaseLabel = `block${spawn.label.block}-${spawn.label.type}-${spawn.label.date}-${spawn.label.ampm}-${spawn.label.suffix}`;

            // Structure: /collection/mode/{playerId}/{label}.json
            const path = `${collection}/${mode}/${this.playerId}/${firebaseLabel}.json`;
            const url = `${firebaseURL}/${path}`;

            httpRequest({
                method: 'PUT',
                url: url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        HalloweenDebug.log(3, `🎃 [Firebase] ${collection} logged: ${firebaseLabel}`);
                    } else {
                        HalloweenDebug.log(2, `🎃 [Firebase] Error logging ${collection}: HTTP ${response.status}`);
                    }
                },
                onerror: function(error) {
                    HalloweenDebug.log(2, `🎃 [Firebase] Error logging ${collection}: ${error}`);
                }
            });
        },

        logDecryptionFailureToFirebase: function(failureCount) {
            try {
                const firebaseURL = FactionConfig.getConfig().collectionsFirebaseURL;

                if (!firebaseURL) {
                    HalloweenDebug.log(2, '🎃 [Firebase] No collections Firebase URL configured - failure not logged');
                    return;
                }

                // Determine testing vs production mode
                const mode = HalloweenUI.competitionSettings.testingMode ? 'testing' : 'production';

                // Structure: consecutive-failure/{mode}/{playerId}.json
                const path = `consecutive-failure/${mode}/${this.playerId}.json`;
                const url = `${firebaseURL}/${path}`;

                const eventData = {
                    playerId: this.playerId,
                    failureCount: failureCount,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent.substring(0, 100),
                    competitionId: this.competitionId,
                    competitionDay: this.getCurrentCompetitionDay()
                };

                httpRequest({
                    method: 'PUT',
                    url: url,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(eventData),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            HalloweenDebug.log(1, `🎃 [Firebase] Decryption failure logged (${failureCount} consecutive failures)`);
                        } else {
                            HalloweenDebug.log(2, `🎃 [Firebase] Error logging decryption failure: HTTP ${response.status}`);
                        }
                    },
                    onerror: function(error) {
                        HalloweenDebug.log(2, `🎃 [Firebase] Error logging decryption failure: ${error}`);
                    }
                });
            } catch (e) {
                HalloweenDebug.log(2, `🎃 [Firebase] Decryption failure logging error: ${e.message}`);
            }
        },

        logExpirationEvent: function(spawn, expirationType, currentBlock) {
            // Check if already logged to prevent duplicates on every page load
            if (this.loggedExpirations && this.loggedExpirations.has(spawn.spawnId)) {
                return false; // Already logged, skip silently
            }

            try {
                // Calculate block times for Firebase
                const competitionStart = this.getCompetitionStartTime();
                const blockStartMs = competitionStart.getTime() + ((spawn.blockNumber - 1) * this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
                const blockEndMs = blockStartMs + (this.BLOCK_DURATION_HOURS * 60 * 60 * 1000);
                const spawnTime = new Date(spawn.spawnDateTime);
                const windowEndMs = spawnTime.getTime() + (this.SPAWN_DURATION_HOURS * 60 * 60 * 1000);

                const eventData = {
                    eventType: 'pumpkin_expired',
                    expirationType: expirationType,  // 'late_joiner' or 'time_expired'
                    timestamp: new Date().toISOString(),
                    playerId: this.playerId,
                    spawnId: spawn.spawnId,
                    pumpkinType: spawn.pumpkinType,
                    blockNumber: spawn.blockNumber,
                    currentBlock: currentBlock,
                    spawnDateTime: spawn.spawnDateTime,
                    spawnWindowEnd: new Date(windowEndMs).toISOString(),
                    blockStartTime: new Date(blockStartMs).toISOString(),
                    blockEndTime: new Date(blockEndMs).toISOString(),
                    pageUrl: spawn.pageUrl,
                    userAgent: navigator.userAgent.substring(0, 100),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };

                this.sendToFirebase('expiration_events', spawn, eventData);
                HalloweenDebug.log(3, `🎃 [Firebase] Expiration logged: ${spawn.spawnId} (${expirationType})`);

                // Mark as logged to prevent duplicate logging
                if (!this.loggedExpirations) {
                    this.loggedExpirations = new Set();
                }
                this.loggedExpirations.add(spawn.spawnId);

                // Persist to GM storage
                GM_setValue('halloween_logged_expirations', JSON.stringify([...this.loggedExpirations]));

                return true; // Successfully logged
            } catch (e) {
                HalloweenDebug.log(2, `🎃 [Firebase] Expiration logging error: ${e.message}`);
                return false;
            }
        },

        getCurrentCompetitionDay: function() {
            // Calculate which day of the competition we're on
            const startDateStr = GM_getValue('halloween_competition_start_date', '');
            const startTimeStr = GM_getValue('halloween_competition_start_time', '18:00');
            const duration = GM_getValue('halloween_competition_duration', 7);

            if (!startDateStr) {
                HalloweenDebug.log(2, '🎃 No competition start date set - defaulting to day 1');
                return 1;
            }

            // Combine date and time for accurate calculation
            const competitionStart = new Date(`${startDateStr}T${startTimeStr}:00Z`);
            const now = new Date();
            const diffTime = Math.abs(now - competitionStart);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Cap at configured competition duration
            return Math.min(diffDays, duration);
        },

        getTotalCollectedCount: function() {
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = safeParse(collectibles, '{}');
            return Object.values(counts).reduce((sum, count) => sum + count, 0);
        },

        getTypeCollectedCount: function(pumpkinType) {
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = safeParse(collectibles, '{}');
            return counts[pumpkinType] || 0;
        }
    };

    // Main Halloween Target Detection System
    const HalloweenTargets = {
        _initialized: false,
        spookyTargetsEnabled: false, // Cached state for performance

        evaluateSpookyTargetsState: function() {
            // Testing mode overrides everything - check FIRST
            const testingMode = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
            if (testingMode) {
                this.spookyTargetsEnabled = true;
                HalloweenDebug.log(2, '🎃 Spooky targets enabled (TESTING MODE - overrides dates)');
                return; // Short-circuit - skip all other checks
            }

            // Determine if this is a member or leader
            const isMember = typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY;

            // Get dates (needed for both members and leaders)
            const startDate = GM_getValue('halloween_spooky_start_date', '');
            const startTime = GM_getValue('halloween_spooky_start_time', '00:00');
            const endDate = GM_getValue('halloween_spooky_end_date', '');
            const endTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!startDate || !endDate) {
                this.spookyTargetsEnabled = false;
                HalloweenDebug.log(2, '🎃 Spooky targets disabled (no dates configured)');
                return;
            }

            const now = new Date();
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);

            if (isMember) {
                // MEMBERS: Derive active state from dates only (no toggle)
                this.spookyTargetsEnabled = now >= start && now <= end;
                HalloweenDebug.log(2, `🎃 Spooky targets (member) ${this.spookyTargetsEnabled ? 'enabled (within competition dates)' : 'disabled (outside competition dates)'}`);
            } else {
                // LEADERS: Check toggle AND dates
                const toggle = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';
                if (!toggle) {
                    this.spookyTargetsEnabled = false;
                    HalloweenDebug.log(2, '🎃 Spooky targets (leader) disabled (toggle OFF)');
                    return;
                }

                this.spookyTargetsEnabled = now >= start;
                HalloweenDebug.log(2, `🎃 Spooky targets (leader) ${this.spookyTargetsEnabled ? 'enabled' : 'disabled (start date not reached)'}`);
            }
        },

        init: function() {
            console.log('HAL: 🎃 HalloweenTargets.init() called');

            // Prevent multiple initialization
            if (this._initialized) {
                console.log('HAL: ⚠️ HalloweenTargets already initialized, skipping...');
                HalloweenDebug.log(3, '🎃 Halloween Targets already initialized, skipping...');
                return;
            }

            console.log('HAL: 🎃 HalloweenTargets initializing...');
            HalloweenDebug.log(1, '🎃 Halloween Targets initializing...');

            // Evaluate spooky targets state on init
            this.evaluateSpookyTargetsState();

            // Create global functions with protection against overwriting
            if (!window.halloweenSeedInfo) {
                window.halloweenSeedInfo = function() {
                    const seedInfo = SeedManager.getSeedInfo();

                    // Security: Limit output for members
                    if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                        const limitedInfo = {
                            currentSeed: seedInfo.currentSeed,
                            targetCount: seedInfo.targetCount,
                            isCached: seedInfo.isCached
                        };
                        HalloweenDebug.log(3, '🎃 Current seed:', limitedInfo.currentSeed);
                        HalloweenDebug.log(3, '🎃 Target count:', limitedInfo.targetCount);
                        HalloweenDebug.log(3, '🎃 Is cached:', limitedInfo.isCached);
                        return limitedInfo;
                    }

                    // Full info for leaders
                    HalloweenDebug.log(3, '🎃 Current seed:', seedInfo.currentSeed);
                    HalloweenDebug.log(3, '🎃 Is leader mode:', seedInfo.isLeaderMode);
                    HalloweenDebug.log(3, '🎃 Target count:', seedInfo.targetCount);
                    HalloweenDebug.log(3, '🎃 Is cached:', seedInfo.isCached);
                    return seedInfo;
                };
            }

            if (!window.checkAPIQueue) {
                window.checkAPIQueue = function() {
                    console.log('HAL: === API Defeat Verification Status ===');
                    const pendingValue = GM_getValue('halloween_api_pending_verifications', '[]');
                    const pending = safeParse(pendingValue, '[]');
                    const countedValue = GM_getValue('halloween_defeats_counted', '[]');
                    const counted = safeParse(countedValue, '[]');
                    const unverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
                    const unverified = safeParse(unverifiedValue, '[]');
                    console.log('HAL: API Pending:', pending);
                    console.log('HAL: Defeats Counted:', counted);
                    console.log('HAL: Unverified:', unverified);
                    return { pending, counted, unverified };
                };
            }

            // Expose checkAPIQueue to unsafeWindow for console access
            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.checkAPIQueue = window.checkAPIQueue;
            }

            if (!window.halloweenDebugGeneration) {
                window.halloweenDebugGeneration = function() {
                    // Security: Require MASTER_LEADER_KEY for debug generation
                    if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                        HalloweenDebug.log(1, 'HAL: 🎃 halloweenDebugGeneration() requires leader authentication');
                        HalloweenDebug.log(1, 'HAL: This function is only available to authorized leaders');
                        return { error: 'Leader authentication required' };
                    }

                    HalloweenDebug.log(3, '🔍 Target Generation Debug:');
                    const seed = SeedManager.getSeed('halloweenDebugGeneration');
                    HalloweenDebug.log(3, 'Current seed:', seed);

                    // Test each protection layer
                    const entropy = HalloweenMath.entropyPool();
                    const envFingerprint = HalloweenMath.environmentFingerprint();
                    HalloweenDebug.log(3, 'Entropy value:', entropy);
                    HalloweenDebug.log(3, 'Environment fingerprint:', envFingerprint);
                    HalloweenDebug.log(3, 'Fingerprint % 1000:', envFingerprint % 1000);
                    HalloweenDebug.log(3, 'Environment check passes:', (envFingerprint % 1000) >= 10);

                    // Test timing
                    const start = performance.now();
                    const targets = HalloweenMath.generateTargets(seed);
                    const duration = performance.now() - start;
                    HalloweenDebug.log(3, 'Generation duration (ms):', duration);
                    HalloweenDebug.log(3, 'Timing check passes:', duration <= 100);
                    HalloweenDebug.log(3, 'Generated targets:', targets);

                    return {
                        envCheck: (envFingerprint % 1000) >= 10,
                        timingCheck: duration <= 100,
                        targets: targets
                    };
                };
            }

            if (!window.halloweenMenu) {
                window.halloweenMenu = HalloweenUI.toggleMenu.bind(HalloweenUI);
            }


            // Initialize core systems first (so functions can reference them)
            this.initializeSystems();

            HalloweenDebug.log(2, '🎃 Global functions created successfully');
            this._initialized = true;

            // Add manual sound test function
            window.halloweenSoundTest = HalloweenTargets.playSpookySound.bind(HalloweenTargets);

            // Expose HalloweenDebug globally for console access
            window.HalloweenDebug = HalloweenDebug;
            // Also try unsafeWindow as fallback for userscript environments
            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.HalloweenDebug = HalloweenDebug;
            }

            // Add encrypted storage verification functions
            window.halloweenVerifyEncryption = function() {
                const encryptedTargets = GM_getValue('halloween_targets_cache_encrypted');
                const encryptedSeed = GM_getValue('halloween_targets_seed_encrypted');
                const currentSeed = SeedManager.getSeed();
                const encryptionKey = StorageCrypto.generateKey(currentSeed);

                HalloweenDebug.log(3, '🔐 Encryption Verification:');
                HalloweenDebug.log(3, 'Encrypted targets exist:', !!encryptedTargets);
                HalloweenDebug.log(3, 'Encrypted seed exists:', !!encryptedSeed);
                HalloweenDebug.log(3, 'Raw encrypted data (should be gibberish):', encryptedTargets?.substring(0, 50) + '...');

                if (encryptedTargets && encryptedSeed) {
                    const decryptedSeed = StorageCrypto.decrypt(encryptedSeed, encryptionKey);
                    HalloweenDebug.log(3, 'Decrypted seed matches current:', decryptedSeed === currentSeed);
                    HalloweenDebug.log(3, 'Old localStorage entries exist:', !!localStorage.getItem('halloween_targets_cache'));
                }

                return {
                    encrypted: !!encryptedTargets,
                    secure: !localStorage.getItem('halloween_targets_cache'),
                    working: encryptedTargets && encryptedSeed
                };
            };

            window.halloweenStorageTest = function() {
                HalloweenDebug.log(3, '🧪 Storage Security Test:');
                HalloweenDebug.log(3, 'GM Storage Keys:', GM_listValues());
                HalloweenDebug.log(3, 'localStorage keys:', Object.keys(localStorage).filter(k => k.includes('halloween')));
                HalloweenDebug.log(3, 'Encryption Key (for current seed):', StorageCrypto.generateKey(SeedManager.getSeed()));
                return window.halloweenVerifyEncryption();
            };


            // Expose HalloweenUI functions globally for inline onclick handlers
            window.HalloweenUI = HalloweenUI;
        },

        // Consolidated initialization system
        initializeSystems: function() {
            console.log('HAL: 🚀 initializeSystems() starting...');

            try {
                // Initialize seed system
                console.log('HAL: 🎃 Loading seed system...');
                SeedManager.getSeed(); // Load current seed
                console.log('HAL: ✅ Seed loaded');

                console.log('HAL: 🎃 Getting targets...');
                const initialTargets = SeedManager.getTargets(); // Generate/load targets
                console.log('HAL: ✅ Targets loaded');
                HalloweenDebug.log(1, 'HAL: ✅ Targets loaded:', initialTargets ? initialTargets.length : 0);

                // Initialize Halloween UI (with protection against multiple calls)
                console.log('HAL: 🎃 Checking UI initialization...');
                if (typeof HalloweenUI._uiInitialized === 'undefined' || !HalloweenUI._uiInitialized) {
                    console.log('HAL: 🎃 Initializing UI...');
                    HalloweenUI.init();
                    HalloweenUI._uiInitialized = true;
                    console.log('HAL: ✅ UI initialized');
                } else {
                    HalloweenDebug.log(1, 'HAL: ℹ️ UI already initialized, skipping');
                }

                // Add Halloween styling (with protection against multiple calls)
                HalloweenDebug.log(1, 'HAL: 🎃 Checking stylesheet initialization...');
                if (typeof HalloweenEffects._stylesheetInitialized === 'undefined' || !HalloweenEffects._stylesheetInitialized) {
                    HalloweenDebug.log(1, 'HAL: 🎃 Adding stylesheet...');
                    HalloweenEffects.addStylesheet();
                    HalloweenEffects._stylesheetInitialized = true;
                    console.log('HAL: ✅ Stylesheet added');
                } else {
                    HalloweenDebug.log(1, 'HAL: ℹ️ Stylesheet already initialized, skipping');
                }

                console.log('HAL: ✅ initializeSystems() complete!');
            } catch (error) {
                console.error('HAL: ❌ Error in initializeSystems():', error);
                throw error; // Re-throw to see full stack trace
            }

            // Apply faction configuration first
            FactionConfig.applyConfig();

            // Apply background effects if enabled (with delay for Torn CSS to load on mobile)
            if (HalloweenUI.backgroundEnabled) {
                if (typeof HalloweenEffects._backgroundInitialized === 'undefined' || !HalloweenEffects._backgroundInitialized) {
                    setTimeout(() => {
                        document.body.classList.add('halloween-background-enabled');
                        HalloweenEffects.applyGenericHalloweenBackground();
                        // Apply tile background if configured
                        const config = FactionConfig.getConfig();
                        if (config.tileImage) {
                            FactionConfig.applyCustomBackground(config.tileImage);
                        }
                        HalloweenEffects._backgroundInitialized = true;
                    }, 150); // 150ms delay for mobile network CSS loading
                }
            }

            // Start monitoring for targets
            this.startTargetDetection();

            // Show available debug commands and current status
            const seedInfo = SeedManager.getSeedInfo();
            console.log('HAL: 🎃 Halloween Targets v1.0 - Coordinated Edition');
            console.log('HAL: Current Seed:', seedInfo.currentSeed);
            HalloweenDebug.log(1, 'HAL: Target Count:', seedInfo.targetCount, 'pairs (hidden for competitive gameplay)');
            console.log('HAL: Potential Targets: ~' + seedInfo.totalPotentialTargets.toLocaleString());
            HalloweenDebug.log(1, '\n📋 Available Commands:');
            HalloweenDebug.log(1, '   window.halloweenSeedInfo() - Current seed information');
            HalloweenDebug.log(1, '   window.halloweenDebugGeneration() - Debug target generation');
            HalloweenDebug.log(1, '   window.halloweenMenu() - Toggle Halloween menu');

            console.log('HAL: 🎃 Halloween Targets initialized successfully 🎃');
        },

        startTargetDetection: function() {
            // Prevent multiple detection instances
            if (this._detectionStarted) {
                HalloweenDebug.log(3, '🎯 Target detection already started, skipping...');
                return;
            }
            this._detectionStarted = true;

            // Initialize triggeredEffects Set if not already created
            if (!this.triggeredEffects) {
                this.triggeredEffects = new Set();
                HalloweenDebug.log(1, '🔄 Initialized triggeredEffects Set');
            }
            const checkForTargets = () => {
                HalloweenDebug.log(1, '🎯 checkForTargets() called on URL:', location.href);

                // Performance optimization - only run on relevant pages
                if (!PageDetector.isRelevantPage()) {
                    HalloweenDebug.log(2, 'Skipping irrelevant page:', location.href);
                    return;
                }

                const playerID = PageDetector.extractPlayerID();
                HalloweenDebug.log(1, '🎯 Extracted player ID:', playerID);
                if (!playerID) {
                    HalloweenDebug.log(2, '❌ No player ID found on page');
                    return;
                }

                // Add red X overlay if player is excluded (regardless of target status)
                if (SeedManager.excludedPlayerIds.has(playerID)) {
                    HalloweenDebug.log(2, `🚫 Player ${playerID} is excluded - adding red X overlay`);
                    this.addExclusionOverlay();
                }

                // Early exit if both systems are disabled
                const bountyConfig = BountyManager.getConfig();
                const bountiesEnabled = bountyConfig.active;
                const spookyEnabled = this.spookyTargetsEnabled;

                if (!bountiesEnabled && !spookyEnabled) {
                    HalloweenDebug.log(1, '🎯 Both spooky targets and bounties disabled - skipping all detection');
                    return;
                }

                HalloweenDebug.log(2, '🎯 isProfilePage():', PageDetector.isProfilePage());
                HalloweenDebug.log(2, '🎯 isAttackPage():', PageDetector.isAttackPage());
                HalloweenDebug.log(2, '🎯 isRelevantPage():', PageDetector.isRelevantPage());

                const lastTwoDigits = playerID.slice(-2);
                HalloweenDebug.log(1, `Checking player ID: ${playerID}, last two digits: ${lastTwoDigits}`);

                // Check BOTH conditions first, then prioritize
                let isBounty = false;
                let isSpooky = false;
                let bountyData = null;

                // Check for daily bounties if enabled
                if (bountiesEnabled) {
                    const bounty = BountyManager.getActiveBounty(location.href);
                    if (bounty) {
                        isBounty = true;
                        bountyData = bounty;
                    }
                }

                // Check for spooky targets if enabled
                if (spookyEnabled) {
                    // Get cached targets using seed system
                    const start = performance.now();
                    const targets = SeedManager.getTargets();
                    const duration = performance.now() - start;

                    HalloweenDebug.log(1, `Target retrieval took ${duration.toFixed(2)}ms`);
                    HalloweenDebug.log(1, 'Current seed:', SeedManager.getSeed());
                    HalloweenDebug.log(1, `Loaded ${targets.length} target pairs (hidden for competitive gameplay)`);

                    if (SeedManager.checkTarget(lastTwoDigits, playerID)) {
                        isSpooky = true;
                    }
                }

                // Execute effects with priority: bounty supersedes spooky
                HalloweenDebug.log(1, `🎃 Target check results: isBounty=${isBounty}, isSpooky=${isSpooky}`);

                if (isBounty && isSpooky) {
                    HalloweenDebug.log(1, `🎃 Target is BOTH bounty and spooky - bounty takes priority`);
                    this.onBountyFound(playerID, bountyData);
                    // Also store as spooky target detected (bounty effects take priority, but still count as detected)
                    const seedInfo = SeedManager.getSeedInfo();
                    this.storeTargetData(playerID, lastTwoDigits, seedInfo.currentSeed);
                    HalloweenDebug.log(1, `🎃 Dual target stored in targets detected`);
                } else if (isBounty) {
                    HalloweenDebug.log(1, `🎃 Target is ONLY bounty`);
                    this.onBountyFound(playerID, bountyData);
                } else if (isSpooky) {
                    HalloweenDebug.log(1, `🎃 Target is ONLY spooky`);
                    this.onTargetFound(playerID, lastTwoDigits);
                } else {
                    HalloweenDebug.log(1, `🎃 Target is neither bounty nor spooky`);
                }
            };

            // Throttled checking to prevent excessive computation
            let checkTimeout;
            const throttledCheck = () => {
                clearTimeout(checkTimeout);
                checkTimeout = setTimeout(checkForTargets, 50);
            };

            // Check immediately on page load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', throttledCheck);
            } else {
                throttledCheck();
            }

            // Performance Optimization: MutationObserver #2 removed (2025-10-22)
            // Navigation detection not needed because:
            // - Profile → Profile navigation = full page reload = automatic re-initialization
            // - checkForTargets() already runs on every page load (above)
            // - API refresh covered by page load (line 18055) and menu open (lines 3595, 3627)
            // - triggeredEffects automatically fresh on page reload (new Set created)
            // - Hash navigation (forums, crimes, etc.) = continuous session = effects stay visible (intended)
            // Eliminated ~1000+ unnecessary DOM mutation checks per page
        },

        onTargetFound: function(playerID, digits) {
            // Create unique key for this target trigger
            const effectKey = `target_${playerID}_${digits}`;

            // Check if we've already triggered effects for this target
            if (this.triggeredEffects.has(effectKey)) {
                HalloweenDebug.log(2, '🎯 Target effects already triggered for', effectKey, 'skipping...');
                return;
            }

            // Check if a bounty effect was already triggered for this player (bounty supersedes spooky)
            const bountyEffectPattern = `bounty_${playerID}_`;
            const hasBountyEffect = Array.from(this.triggeredEffects).some(key => key.startsWith(bountyEffectPattern));

            if (hasBountyEffect) {
                HalloweenDebug.log(2, '🎯 Bounty effect already triggered for this player, skipping spooky effects (bounty supersedes)');
                // Still mark as triggered and store data, just skip visual/audio effects
                this.triggeredEffects.add(effectKey);
                const seedInfo = SeedManager.getSeedInfo();
                this.storeTargetData(playerID, digits, seedInfo.currentSeed);
                if (HalloweenUI.menuOpen) {
                    HalloweenUI.updateMenuContent();
                }
                return;
            }

            // Mark as triggered
            this.triggeredEffects.add(effectKey);

            const seedInfo = SeedManager.getSeedInfo();
            HalloweenDebug.log(0, `🎯 TARGET FOUND! Player ID: ${playerID}`);
            HalloweenDebug.log(1, `Using seed: ${seedInfo.currentSeed}`);

            // Apply Halloween background if enabled (may already be applied from page load)
            if (HalloweenUI.backgroundEnabled) {
                const config = FactionConfig.getConfig();
                if (config.tileImage) {
                    FactionConfig.applyCustomBackground(config.tileImage);
                }
            }

            // Create enhanced visual effects (PROFILE PAGES ONLY)
            let spookyEffect = null;
            let screenOverlay = null;

            if (PageDetector.isProfilePage()) {
                spookyEffect = HalloweenEffects.createSpookyEffect();
                screenOverlay = HalloweenEffects.createScreenOverlay();

                document.body.appendChild(spookyEffect);
                document.body.appendChild(screenOverlay);

                // Highlight player elements
                this.highlightPlayerElements();
            }

            // Highlight attack page opponent if on attack page
            if (PageDetector.isAttackPage()) {
                this.highlightAttackPageOpponent(false); // false = spooky (not bounty)
            }

            // Play spooky sound effect if enabled (not on attack page)
            HalloweenDebug.log(2, '🔊 TARGET AUDIO DEBUG: HalloweenUI.soundEnabled =', HalloweenUI.soundEnabled);
            HalloweenDebug.log(2, '🔊 TARGET AUDIO DEBUG: GM halloween_sound_enabled =', GM_getValue('halloween_sound_enabled', false));

            if (HalloweenUI.soundEnabled && !PageDetector.isAttackPage()) {
                HalloweenDebug.log(0, '🔊 Sound is enabled, attempting to play spooky sound...');
                this.playSpookySound();
            } else if (PageDetector.isAttackPage()) {
                HalloweenDebug.log(0, '🔇 Attack page detected - skipping spooky sound');
            } else {
                HalloweenDebug.log(0, '🔇 Sound is disabled in settings - need to toggle Spectral Echoes ON');
            }

            // Auto-remove effects after animation (only if they were created)
            if (spookyEffect) {
                setTimeout(() => {
                    spookyEffect.remove();
                }, 4000);
            }


            // Store target data with seed info
            this.storeTargetData(playerID, digits, seedInfo.currentSeed);

            // Update UI menu if open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }
        },

        playSpookySound: function() {
            try {
                HalloweenDebug.log(1, '🎵 playSpookySound() called');
                // Simply play the sound - permission granted by menu click
                this.generateSpookySound();
            } catch (error) {
                HalloweenDebug.log(2, '❌ Could not play spooky sound:', error.message);
            }
        },

        generateSpookySound: function() {
            try {
                HalloweenDebug.log(1, '🔊 Playing horror whoosh audio...');

                // GitHub hosted Halloween target detection sound (whoosh)
                const audio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-whoosh.mp3');

                // Set audio properties
                audio.volume = 0.7;
                audio.preload = 'auto';

                // Play the audio
                audio.play().then(() => {
                    HalloweenDebug.log(0, '🎵 Horror whoosh audio playing successfully');
                }).catch(error => {
                    HalloweenDebug.log(2, '❌ Failed to play horror whoosh audio:', error.message);
                });

            } catch (error) {
                HalloweenDebug.log(2, '❌ Could not load horror whoosh audio:', error.message);
            }
        },

        onBountyFound: function(playerID, bounty) {
            // Create unique key for this bounty trigger
            const effectKey = `bounty_${playerID}_${bounty.date}`;

            HalloweenDebug.log(1, `🔥 onBountyFound called for ${effectKey}`);
            HalloweenDebug.log(1, `🔥 Current triggeredEffects:`, Array.from(this.triggeredEffects));

            // Check if we've already triggered effects for this bounty
            if (this.triggeredEffects.has(effectKey)) {
                HalloweenDebug.log(1, `🔥 Bounty effects already triggered for ${effectKey}, skipping...`);
                return;
            }

            // Mark as triggered
            this.triggeredEffects.add(effectKey);
            HalloweenDebug.log(1, `🔥 BOUNTY FOUND! Player ID: ${playerID}, Date: ${bounty.date}`);

            // Apply Halloween background if enabled
            if (HalloweenUI.backgroundEnabled) {
                const config = FactionConfig.getConfig();
                if (config.tileImage) {
                    FactionConfig.applyCustomBackground(config.tileImage);
                }
            }

            // Create red bounty effects (PROFILE PAGES ONLY)
            if (PageDetector.isProfilePage()) {
                const bountyEffect = HalloweenEffects.createBountyEffect();
                const screenOverlay = HalloweenEffects.createScreenOverlay();

                document.body.appendChild(bountyEffect);
                document.body.appendChild(screenOverlay);

                // Highlight player elements with red bounty styling
                this.highlightPlayerElementsForBounty();

                // Auto-remove effects after animation
                setTimeout(() => {
                    bountyEffect.remove();
                }, 4000);
            }

            // Highlight attack page opponent if on attack page
            if (PageDetector.isAttackPage()) {
                this.highlightAttackPageOpponent(true); // true = bounty
            }

            // Play sound if enabled (not on attack page)
            if (HalloweenUI.soundEnabled && !PageDetector.isAttackPage()) {
                this.playSpookySound();
            } else if (PageDetector.isAttackPage()) {
                HalloweenDebug.log(0, '🔇 Attack page detected - skipping bounty sound');
            }

            // Store bounty encounter
            const claim = BountyManager.getClaim(playerID);
            if (!claim || !claim.verified) {
                BountyManager.setClaim(playerID, {
                    date: bounty.date,
                    verified: false,
                    encounterTime: Date.now(),
                    scheduledCheck: Date.now() + 45000 // 45 seconds from now
                });
                HalloweenDebug.log(1, `Bounty encounter stored, verification scheduled for 45 seconds`);
            }

            // Schedule API refresh only if on attack page (60s delay since we don't have exit detection for bounties)
            // Profile pages don't trigger API refresh (user might not attack)
            if (APIDefeatVerification.isAPIMode() && PageDetector.isAttackPage()) {
                const refreshTime = Math.floor(Date.now() / 1000) + 60; // 60s for attack page (no exit detection)
                GM_setValue('halloween_api_next_refresh', refreshTime);
                HalloweenDebug.log(1, `🔄 Bounty attack detected - API refresh scheduled for ${new Date(refreshTime * 1000).toLocaleTimeString()}`);
            }

            // Update UI menu if open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }
        },

        highlightPlayerElementsForBounty: function() {
            // Same selectors as spooky targets
            const selectors = [
                '.profile-wrapper .profile-left-wrapper',
                '.profile-status'
            ];

            HalloweenDebug.log(3, '🔥 BOUNTY HIGHLIGHTING: Applying halloween-bounty-highlight class...');
            let totalHighlighted = 0;

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                HalloweenDebug.log(3, `🔥 BOUNTY HIGHLIGHTING: Found ${elements.length} elements for selector: ${selector}`);
                elements.forEach(el => {
                    el.classList.add('halloween-bounty-highlight');
                    el.classList.add('throb'); // Use throb animation
                    totalHighlighted++;
                    HalloweenDebug.log(3, `🔥 BOUNTY HIGHLIGHTING: Applied class to:`, el.tagName, el.className);
                });
            });

            HalloweenDebug.log(3, `🔥 BOUNTY HIGHLIGHTING: Total elements highlighted: ${totalHighlighted}`);
        },

        highlightAttackPageOpponent: function(isBounty) {
            // Delayed retry approach to handle PDA reinitialization
            const attemptHighlight = (retryCount = 0) => {
                const opponentHeader = document.querySelector('[class*="headerWrapper"][class*="rose"]');

                if (opponentHeader) {
                    const className = isBounty ? 'halloween-attack-bounty-highlight' : 'halloween-attack-spooky-highlight';
                    const oppositeClassName = isBounty ? 'halloween-attack-spooky-highlight' : 'halloween-attack-bounty-highlight';

                    // Remove opposite class (bounty supersedes spooky)
                    opponentHeader.classList.remove(oppositeClassName);
                    opponentHeader.classList.add(className);

                    HalloweenDebug.log(1, `🎃 Attack page opponent highlighted: ${isBounty ? 'Bounty (red)' : 'Spooky (orange)'} (attempt ${retryCount + 1})`);
                } else {
                    HalloweenDebug.log(2, `🎃 Attack page opponent header not found (attempt ${retryCount + 1})`);

                    // Retry up to 5 times with increasing delays (handles PDA reinitialization)
                    if (retryCount < 5) {
                        const delay = (retryCount + 1) * 500; // 500ms, 1000ms, 1500ms, 2000ms, 2500ms
                        HalloweenDebug.log(2, `🎃 Will retry highlighting in ${delay}ms...`);
                        setTimeout(() => attemptHighlight(retryCount + 1), delay);
                    } else {
                        HalloweenDebug.log(2, '🎃 Attack page highlighting failed after 5 attempts');
                    }
                }
            };

            // Start first attempt immediately
            attemptHighlight();
        },

        highlightPlayerElements: function() {
            // First, let's see what the actual DOM looks like
            HalloweenDebug.log(3, '🎃 DOM DEBUG: Looking for profile-related elements...');
            const profileDivs = document.querySelectorAll('div[class*="profile"]');
            const containerDivs = document.querySelectorAll('div[class*="container"]');
            HalloweenDebug.log(3, `🎃 DOM DEBUG: Found ${profileDivs.length} divs with "profile" in class name`);
            HalloweenDebug.log(3, `🎃 DOM DEBUG: Found ${containerDivs.length} divs with "container" in class name`);

            profileDivs.forEach((div, i) => {
                HalloweenDebug.log(3, `🎃 DOM DEBUG Profile div ${i}:`, div.className);
            });

            containerDivs.forEach((div, i) => {
                HalloweenDebug.log(3, `🎃 DOM DEBUG Container div ${i}:`, div.className);
            });

            const selectors = [
                '.profile-wrapper .profile-left-wrapper',
                '.profile-status'
            ];

            HalloweenDebug.log(3, '🎃 HIGHLIGHTING: Starting to apply halloween-target-highlight class...');
            let totalHighlighted = 0;

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                HalloweenDebug.log(3, `🎃 HIGHLIGHTING: Found ${elements.length} elements for selector: ${selector}`);
                elements.forEach(el => {
                    el.classList.add('halloween-target-highlight');
                    el.classList.add('throb'); // Always use throb animation
                    totalHighlighted++;
                    HalloweenDebug.log(3, `🎃 HIGHLIGHTING: Applied class to:`, el.tagName, el.className);
                });
            });

            HalloweenDebug.log(3, `🎃 HIGHLIGHTING: Total elements highlighted: ${totalHighlighted}`);

            // EXTREME DEBUG: Let's manually check everything
            const allElements = document.querySelectorAll('.halloween-target-highlight');
            HalloweenDebug.log(3, `🎃 EXTREME DEBUG: Found ${allElements.length} elements with halloween-target-highlight class`);

            allElements.forEach((el, index) => {
                const styles = window.getComputedStyle(el);
                HalloweenDebug.log(3, `🎃 EXTREME DEBUG Element ${index}:`, {
                    element: el,
                    tagName: el.tagName,
                    className: el.className,
                    animation: styles.animation,
                    background: styles.background,
                    border: styles.border,
                    boxShadow: styles.boxShadow,
                    position: styles.position,
                    transform: styles.transform
                });
            });

            // Also check if CSS is loaded with a test element
            const testEl = document.createElement('div');
            testEl.className = 'halloween-target-highlight';
            testEl.style.position = 'fixed';
            testEl.style.top = '10px';
            testEl.style.left = '10px';
            testEl.style.width = '100px';
            testEl.style.height = '50px';
            testEl.style.zIndex = '9999';
            testEl.textContent = 'TEST';
            document.body.appendChild(testEl);

            setTimeout(() => {
                const computedStyle = window.getComputedStyle(testEl);
                HalloweenDebug.log(3, `🎃 CSS CHECK: Test element animation:`, computedStyle.animation);
                HalloweenDebug.log(3, `🎃 CSS CHECK: Test element background:`, computedStyle.background);
                HalloweenDebug.log(3, `🎃 CSS CHECK: Test element visible:`, testEl.offsetHeight > 0);
                // Keep test element visible for 5 seconds so you can see it
                setTimeout(() => testEl.remove(), 5000);
            }, 100);
        },

        storeTargetData: function(playerID, digits, seed) {
            // Get current encounters object from GM storage
            const encountersValue = GM_getValue('halloween_encounters', '{}');
            const encounters = safeParse(encountersValue, '{}');

            const currentTime = Date.now();
            const encounterData = {
                digits,
                seed,
                lastEncounter: currentTime,
                url: location.href
            };

            // Update or create encounter record
            if (encounters[playerID]) {
                // Existing target - increment count and update data
                encounters[playerID].encounterCount += 1;
                encounters[playerID].lastEncounter = currentTime;
                encounters[playerID].url = location.href; // Update to latest URL
            } else {
                // New target - create record
                encounters[playerID] = {
                    ...encounterData,
                    encounterCount: 1,
                    firstEncounter: currentTime
                };
            }

            // Save to GM storage
            GM_setValue('halloween_encounters', JSON.stringify(encounters));
            HalloweenDebug.log(1, 'Target encounter stored:', playerID, encounters[playerID]);
        },

        // Add red X overlay to attack button for excluded players
        addExclusionOverlay: function(attempt = 0) {
            const maxAttempts = 10; // Try for ~2 seconds (10 attempts * 200ms)

            // Try multiple selectors for desktop/mobile compatibility (PDA-safe)
            const attackButton = document.querySelector('a.profile-button.profile-button-attack') ||
                                document.querySelector('a[aria-label="Attack"]') ||
                                document.querySelector('a[href*="sid=attack"]') ||
                                document.querySelector('a[href*="getInAttack"]');

            if (!attackButton) {
                if (attempt < maxAttempts) {
                    // Retry after 200ms delay
                    setTimeout(() => {
                        this.addExclusionOverlay(attempt + 1);
                    }, 200);
                    if (attempt === 0) {
                        HalloweenDebug.log(2, '🚫 Attack button not found yet - retrying...');
                    }
                } else {
                    HalloweenDebug.log(2, '🚫 Attack button not found after retries - giving up');
                }
                return;
            }

            // Check if overlay already exists
            if (attackButton.querySelector('.halloween-exclusion-overlay')) {
                HalloweenDebug.log(2, '🚫 Exclusion overlay already exists');
                return;
            }

            // Make button container relative positioned
            attackButton.style.position = 'relative';

            // Create red X overlay SVG (just X lines, no background circle)
            const overlay = document.createElement('div');
            overlay.className = 'halloween-exclusion-overlay';
            overlay.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="46"
                     height="46"
                     viewBox="0 0 24 24"
                     style="position: absolute !important;
                            top: 50% !important;
                            left: 50% !important;
                            transform: translate(-50%, -50%) !important;
                            z-index: 1000 !important;
                            pointer-events: none !important;">
                    <line x1="4" y1="4" x2="20" y2="20" stroke="#ff0000" stroke-width="3" stroke-linecap="round"/>
                    <line x1="20" y1="4" x2="4" y2="20" stroke="#ff0000" stroke-width="3" stroke-linecap="round"/>
                </svg>
            `;

            attackButton.appendChild(overlay);
            HalloweenDebug.log(2, `🚫 Red X overlay added to attack button (attempt ${attempt + 1})`);
        },

        // ===================================
        // SPOOKY TARGET VALIDATION
        // ===================================

        isSpookyTarget: function(defenderId) {
            if (!defenderId) return false;

            // Get last 2 digits
            const lastTwoDigits = defenderId.toString().slice(-2).padStart(2, '0');

            // Check against seed (pass full defenderId for exclusion check)
            const isTarget = SeedManager.checkTarget(lastTwoDigits, defenderId);

            if (isTarget) {
                HalloweenDebug.log(2, `HAL: 🎃 Spooky target detected: ${defenderId} (${lastTwoDigits})`);
            }

            return isTarget;
        }
    };

    // ===================================
    // FIREBASE DEFEAT VERIFICATION MODULE
    // ===================================
    const FirebaseDefeatVerification = {
        // Firebase configuration (will be set from menu panel)
        getFirebaseURL: function() {
            const config = FactionConfig.getConfig();
            return config.attackLogsFirebaseURL || null;
        },

        // ===================================
        // GM STORAGE MANAGEMENT
        // ===================================

        getCountedDefeats: function() {
            try {
                const defeatsValue = GM_getValue('halloween_defeats_counted', '[]');
                return safeParse(defeatsValue, '[]');
            } catch (e) {
                return [];
            }
        },

        addCountedDefeat: function(defenderId) {
            // Normalize to string to prevent type coercion issues
            defenderId = String(defenderId);

            // First check
            const counted = this.getCountedDefeats();
            if (!counted.includes(defenderId)) {
                // Double-check pattern: re-read to prevent race condition
                const recheck = this.getCountedDefeats();
                if (!recheck.includes(defenderId)) {
                    recheck.push(defenderId);
                    GM_setValue('halloween_defeats_counted', JSON.stringify(recheck));
                    return true;
                }
            }
            return false;
        },

        isAlreadyCounted: function(defenderId) {
            return this.getCountedDefeats().includes(defenderId);
        },

        getVerifyQueue: function() {
            try {
                const queueValue = GM_getValue('halloween_verify_queue', '[]');
                return safeParse(queueValue, '[]');
            } catch (e) {
                return [];
            }
        },

        setVerifyQueue: function(queue) {
            GM_setValue('halloween_verify_queue', JSON.stringify(queue));
        },

        updateQueueTimestamp: function(defenderId, newTimestamp) {
            const queue = this.getVerifyQueue();
            const entry = queue.find(item => item.defenderId === defenderId);

            if (entry) {
                const oldTimestamp = entry.attackTimestamp;
                entry.attackTimestamp = newTimestamp;
                this.setVerifyQueue(queue);

                HalloweenDebug.log(2, `⏱️ Updated timestamp for defender ${defenderId}: ${oldTimestamp} → ${newTimestamp} (${newTimestamp - oldTimestamp}s later)`);
            } else {
                HalloweenDebug.log(3, `⚠️ Could not update timestamp for defender ${defenderId} - not found in queue`);
            }
        },

        getFailedQueue: function() {
            try {
                const failedValue = GM_getValue('halloween_verify_failed', '[]');
                return safeParse(failedValue, '[]');
            } catch (e) {
                return [];
            }
        },

        setFailedQueue: function(queue) {
            GM_setValue('halloween_verify_failed', JSON.stringify(queue));
        },

        getUnverified: function() {
            try {
                const value = GM_getValue('halloween_defeats_unverified', '[]');
                return safeParse(value, '[]');
            } catch (e) {
                return [];
            }
        },

        addUnverified: function(defenderId, reason) {
            const unverified = this.getUnverified();
            unverified.push({
                defenderId: defenderId,
                reason: reason,
                checkedAt: Math.floor(Date.now() / 1000)
            });
            GM_setValue('halloween_defeats_unverified', JSON.stringify(unverified));
        },

        // ===================================
        // FIREBASE AUTHENTICATION
        // ===================================

        getFirebaseAuthToken: async function() {
            // Get API key from faction config (set by leader, distributed via import)
            const config = FactionConfig.getConfig();
            const apiKey = config.rtdbKey;

            if (!apiKey) {
                throw new Error('Database key not configured - contact faction leadership');
            }

            // Check cache first (tokens valid for 1 hour)
            const cachedToken = GM_getValue('firebase_auth_token', null);
            const cachedExpiry = GM_getValue('firebase_auth_expiry', 0);
            const now = Math.floor(Date.now() / 1000);

            if (cachedToken && cachedExpiry > now) {
                return cachedToken;
            }

            // Get new anonymous auth token
            const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

            return new Promise((resolve, reject) => {
                httpRequest({
                    method: 'POST',
                    url: authUrl,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({ returnSecureToken: true }),
                    onload: function(response) {
                        try {
                            const authData = JSON.parse(response.responseText);

                            if (authData.idToken) {
                                const token = authData.idToken;
                                const expiresIn = parseInt(authData.expiresIn) || 3600; // Default 1 hour
                                const expiry = now + expiresIn - 60; // Refresh 1 min early

                                // Cache token
                                GM_setValue('firebase_auth_token', token);
                                GM_setValue('firebase_auth_expiry', expiry);

                                HalloweenDebug.log(3, '🔥 Firebase auth token obtained');
                                resolve(token);
                            } else {
                                HalloweenDebug.log(1, '❌ Firebase auth failed: No token in response');
                                reject(new Error('No token in auth response'));
                            }
                        } catch (error) {
                            HalloweenDebug.log(1, `❌ Firebase auth error: ${error.message}`);
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        HalloweenDebug.log(1, `❌ Firebase auth request failed: ${error}`);
                        reject(new Error('Auth request failed'));
                    }
                });
            });
        },

        // ===================================
        // FIREBASE QUERY
        // ===================================

        queryFirebase: async function(defenderId) {
            const firebaseURL = this.getFirebaseURL();

            if (!firebaseURL) {
                return {
                    success: false,
                    error: 'Firebase URL not configured',
                    isServerError: false
                };
            }

            // Get auth token
            let token;
            try {
                token = await this.getFirebaseAuthToken();
            } catch (error) {
                return {
                    success: false,
                    error: `Auth failed: ${error.message}`,
                    isServerError: true
                };
            }

            const url = `${firebaseURL}/attacks-by-defender/${defenderId}.json?auth=${token}`;

            return new Promise((resolve) => {
                httpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve({
                                    success: true,
                                    data: data || {},
                                    isServerError: false
                                });
                            } catch (error) {
                                resolve({
                                    success: false,
                                    error: `JSON parse error: ${error.message}`,
                                    isServerError: false
                                });
                            }
                        } else {
                            // Server error (500, 503, etc.)
                            resolve({
                                success: false,
                                error: `Firebase server error: ${response.status}`,
                                isServerError: true
                            });
                        }
                    },
                    onerror: function(error) {
                        // Network error, timeout, etc.
                        resolve({
                            success: false,
                            error: `Network error: ${error}`,
                            isServerError: true
                        });
                    }
                });
            });
        },

        // ===================================
        // VERIFICATION LOGIC
        // ===================================

        verifyDefeat: async function(defenderId, attackTimestamp) {
            const playerId = GM_getValue('halloween_player_id', '');

            if (!playerId) {
                HalloweenDebug.log(1, '❌ Cannot verify defeat: Player ID not set');
                return {
                    verified: false,
                    reason: 'player_id_not_set'
                };
            }

            // Query Firebase
            const result = await this.queryFirebase(defenderId);

            if (!result.success) {
                // Firebase query failed
                return {
                    verified: false,
                    reason: result.isServerError ? 'server_error' : 'query_failed',
                    error: result.error,
                    isServerError: result.isServerError
                };
            }

            // Parse attacks data
            const attacks = result.data;

            if (!attacks || Object.keys(attacks).length === 0) {
                // No attacks found for this defender
                return {
                    verified: false,
                    reason: 'no_attacks_found',
                    isServerError: false
                };
            }

            // Filter for qualifying attacks
            const qualifyingResults = ['Attacked', 'Hospitalized', 'Mugged'];

            for (const [attackCode, attack] of Object.entries(attacks)) {
                // Check if it's YOUR attack
                if (attack.attackerId.toString() !== playerId.toString()) {
                    continue;
                }

                // Check if attack happened during SPOOKY competition window
                const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
                const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
                const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
                const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

                if (!spookyStartDate || !spookyEndDate) {
                    HalloweenDebug.log(1, '⚠️ Spooky competition dates not set');
                    continue;
                }

                const spookyStart = new Date(`${spookyStartDate}T${spookyStartTime}:00Z`).getTime() / 1000;
                const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}:59Z`).getTime() / 1000;

                if (attack.timestampStarted < spookyStart ||
                    attack.timestampStarted > spookyEnd) {
                    continue; // Outside spooky competition timeframe
                }

                // Check if result qualifies
                if (!qualifyingResults.includes(attack.result)) {
                    continue;
                }

                // Found a qualifying attack!
                HalloweenDebug.log(2, `✅ Defeat verified: ${attack.attackerName} ${attack.result} ${attack.defenderName}`);

                return {
                    verified: true,
                    attack: attack
                };
            }

            // No qualifying attacks found
            return {
                verified: false,
                reason: 'no_qualifying_attacks',
                isServerError: false
            };
        },

        // ===================================
        // BOUNTY VERIFICATION (FIREBASE MODE)
        // ===================================

        verifyBountyWithFirebaseData: async function(playerID) {
            // Get claim for bounty date
            const claim = BountyManager.getClaim(playerID);
            if (!claim) {
                return {verified: false, reason: 'no_claim'};
            }

            const bountyDate = claim.date; // YYYY-MM-DD format

            // Query Firebase for this player's attacks
            const result = await this.queryFirebase(playerID);
            if (!result.success) {
                return {
                    verified: false,
                    reason: result.error,
                    isServerError: result.isServerError
                };
            }

            const attacks = result.data || {};
            const attackValues = Object.values(attacks);

            // Filter by date window (or skip if testing mode)
            const bountyConfig = BountyManager.getConfig();
            let dateWindowAttacks;

            if (bountyConfig.testing) {
                // Testing mode: check ALL attacks, ignore date
                dateWindowAttacks = attackValues;
                HalloweenDebug.log(2, `🔥 Bounty verification (TESTING MODE): Checking all ${attackValues.length} attacks`);
            } else {
                // Production: filter to bounty's assigned date (00:00 to 23:59)
                const startOfDay = new Date(bountyDate + 'T00:00:00Z').getTime() / 1000;
                const endOfDay = new Date(bountyDate + 'T23:59:59Z').getTime() / 1000;
                dateWindowAttacks = attackValues.filter(a =>
                    a.timestampStarted >= startOfDay &&
                    a.timestampStarted <= endOfDay
                );
                HalloweenDebug.log(2, `🔥 Bounty verification: ${dateWindowAttacks.length} attacks in date window (${bountyDate})`);
            }

            // Look for qualifying defeats
            // Bounties accept Assist (unlike Spooky Targets which require solo defeats)
            const BOUNTY_DEFEAT_RESULTS = ['Attacked', 'Hospitalized', 'Mugged', 'Assist'];
            const playerId = GM_getValue('halloween_player_id', '');

            for (const attack of dateWindowAttacks) {
                if (attack.attackerId == playerId && BOUNTY_DEFEAT_RESULTS.includes(attack.result)) {
                    // FOUND!
                    HalloweenDebug.log(1, `✅ Bounty verified via Firebase: ${attack.result} against player ${playerID}`);
                    BountyManager.markBountyVerified(playerID, {
                        result: attack.result,
                        timestamp: attack.timestampStarted,
                        respect: attack.respect || 0
                    });
                    return {verified: true, attack};
                }
            }

            return {verified: false, reason: 'no_qualifying_attacks'};
        },

        processBountyChecks: async function() {
            // Only run every 15 minutes
            const lastCheck = GM_getValue('halloween_last_bounty_check', 0);
            const now = Date.now();

            if (now - lastCheck < 15 * 60 * 1000) {
                return; // Not time yet
            }

            GM_setValue('halloween_last_bounty_check', now);

            const bountyConfig = BountyManager.getConfig();
            if (!bountyConfig.active) return;

            // Get unverified bounties
            const unverified = BountyManager.getUnverifiedBounties();
            if (unverified.length === 0) return;

            // Filter for today (or all if testing)
            let toCheck;
            if (bountyConfig.testing) {
                toCheck = unverified; // All bounties
                HalloweenDebug.log(2, `🔥 15-min bounty check (TESTING MODE): Checking ${toCheck.length} bounties`);
            } else {
                const today = new Date().toISOString().split('T')[0];
                toCheck = unverified.filter(b => b.date === today);
                HalloweenDebug.log(2, `🔥 15-min bounty check: Checking ${toCheck.length} bounties for ${today}`);
            }

            for (const bounty of toCheck) {
                const playerID = bounty.playerID;
                const claim = BountyManager.getClaim(playerID);

                if (claim?.verified || claim?.missed) {
                    continue; // Skip verified/missed
                }

                await this.verifyBountyWithFirebaseData(playerID);

                // Check if verified to optimize next iteration
                const updatedClaim = BountyManager.getClaim(playerID);
                if (updatedClaim?.verified) {
                    HalloweenDebug.log(1, `✅ Bounty ${playerID} verified - stopping checks`);
                    break; // Stop checking if one is verified
                }
            }
        },

        processEncounterChecks: async function() {
            const bountyConfig = BountyManager.getConfig();
            if (!bountyConfig.active) return;

            const now = Date.now();
            const unverified = BountyManager.getUnverifiedBounties();

            for (const bounty of unverified) {
                const playerID = bounty.playerID;
                const claim = BountyManager.getClaim(playerID);

                if (!claim || claim.verified || claim.missed) {
                    continue;
                }

                let shouldCheck = false;
                let updateClaim = false;

                // CHECK 1: 45-second scheduled check
                if (claim.scheduledCheck && now >= claim.scheduledCheck) {
                    shouldCheck = true;
                    updateClaim = true;
                    HalloweenDebug.log(2, `🔥 Encounter check (45s): Bounty ${playerID}`);
                    delete claim.scheduledCheck;
                    claim.retryCheck = now + 60000; // +60s
                }
                // CHECK 2: First 60s retry
                else if (claim.retryCheck && now >= claim.retryCheck) {
                    shouldCheck = true;
                    updateClaim = true;
                    HalloweenDebug.log(2, `🔥 Encounter check (60s retry 1): Bounty ${playerID}`);
                    delete claim.retryCheck;
                    claim.retryCheck2 = now + 60000; // +60s
                }
                // CHECK 3: Second 60s retry
                else if (claim.retryCheck2 && now >= claim.retryCheck2) {
                    shouldCheck = true;
                    updateClaim = true;
                    HalloweenDebug.log(2, `🔥 Encounter check (60s retry 2): Bounty ${playerID}`);
                    delete claim.retryCheck2;
                    // Resume 15-min cycle after this
                }

                if (shouldCheck) {
                    await this.verifyBountyWithFirebaseData(playerID);
                }

                if (updateClaim) {
                    BountyManager.setClaim(playerID, claim);
                }
            }
        },

        processMidnightSweep: async function() {
            const bountyConfig = BountyManager.getConfig();
            if (!bountyConfig.active) return;

            // Check if midnight sweep already ran today
            const today = new Date().toISOString().split('T')[0];
            const lastSweepDate = GM_getValue('halloween_last_midnight_sweep', '');

            if (lastSweepDate === today) {
                return; // Sweep already ran today
            }

            // Sweep hasn't run today - check all past unclaimed bounties
            HalloweenDebug.log(1, `🌙 Midnight sweep: Checking all past unclaimed bounties`);

            // Loop through all bounties in config (already sorted by date)
            for (const bounty of bountyConfig.bounties) {
                // Skip if bounty is for today or future
                if (bounty.date >= today) continue;

                // Extract playerID from URL (inline, no helper)
                let urlMatch = bounty.url.match(/XID=(\d+)/);
                if (!urlMatch) {
                    urlMatch = bounty.url.match(/user2ID=(\d+)/);
                }

                if (!urlMatch) {
                    HalloweenDebug.log(1, `⚠️ Midnight sweep: Could not parse player ID from URL: ${bounty.url}`);
                    continue;
                }

                const playerID = urlMatch[1];
                const claim = BountyManager.getClaim(playerID);

                // Skip if already verified (already counted)
                if (claim?.verified) {
                    continue;
                }

                // Check unmarked or missed bounties (allows daily recheck for missed)
                HalloweenDebug.log(1, `🌙 Midnight sweep: Checking ${bounty.date} bounty (player ${playerID})`);
                const result = await this.verifyBountyWithFirebaseData(playerID);

                if (result.verified) {
                    HalloweenDebug.log(1, `✅ Midnight sweep: Bounty ${playerID} verified!`);
                } else if (!claim?.missed) {
                    // Only mark as missed if not already marked
                    HalloweenDebug.log(1, `❌ Midnight sweep: Marking bounty ${playerID} as missed`);
                    BountyManager.markBountyMissed(playerID);
                }
            }

            // Mark sweep as complete for today
            GM_setValue('halloween_last_midnight_sweep', today);
            HalloweenDebug.log(1, `🌙 Midnight sweep complete for ${today}`);
        },

        // ===================================
        // QUEUE MANAGEMENT
        // ===================================

        addToQueue: function(defenderId, attackTimestamp) {
            // Skip if already confirmed as defeated
            if (this.isAlreadyCounted(defenderId)) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already counted - skipping`);
                return;
            }

            const queue = this.getVerifyQueue();

            // Check if already in queue
            const existing = queue.find(item => item.defenderId === defenderId);
            if (existing) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already in verification queue`);
                return;
            }

            // If previously unverified, remove and give second chance
            // (User might have returned and actually attacked this time)
            const unverified = this.getUnverified();
            if (unverified.find(u => u.defenderId == defenderId)) {
                const filtered = unverified.filter(u => u.defenderId != defenderId);
                GM_setValue('halloween_defeats_unverified', JSON.stringify(filtered));
                HalloweenDebug.log(2, `♻️ Defender ${defenderId} removed from unverified, re-queueing`);
            }

            const now = Math.floor(Date.now() / 1000);
            queue.push({
                defenderId: defenderId,
                attackTimestamp: attackTimestamp,
                queuedAt: now, // Track when queued for 1-hour timeout
                attempts: 0,
                nextCheckTime: now + 60, // First check in 60 seconds (NEW)
                lastError: null
            });

            this.setVerifyQueue(queue);
            HalloweenDebug.log(2, `📝 Added defender ${defenderId} to verification queue`);

            // Start processing queue
            this.scheduleQueueProcessing();
        },

        scheduleQueueProcessing: function() {
            // Process queue every 10 seconds
            if (this.queueProcessingInterval) {
                return; // Already scheduled
            }

            this.queueProcessingInterval = setInterval(() => {
                this.processQueue();
            }, 60000); // Check every 60 seconds
        },

        // Stop queue processing interval
        stopQueueProcessing: function() {
            if (this.queueProcessingInterval) {
                clearInterval(this.queueProcessingInterval);
                this.queueProcessingInterval = null;
                HalloweenDebug.log(2, '⏹️ Stopped queue processing interval');
            }
        },

        processQueue: async function() {
            // Bounty verification system (Firebase mode only)
            await this.processBountyChecks();        // 15-min cycle
            await this.processEncounterChecks();     // 45s/60s/60s encounter-triggered
            await this.processMidnightSweep();       // Finalize yesterday's bounty

            // Check if competition ended (triggers final sweep)
            const competitionEnded = await this.checkCompetitionEnd();
            if (competitionEnded) {
                return; // Final sweep already processed everything
            }

            const queue = this.getVerifyQueue();
            const currentTime = Math.floor(Date.now() / 1000);

            const updatedQueue = [];
            const itemsToCheck = [];

            // Collect items that need checking
            for (const item of queue) {
                // Check if it's time to verify this item
                if (item.nextCheckTime > currentTime) {
                    updatedQueue.push(item);
                    continue;
                }

                // Check if we've been trying for over 1 hour
                const elapsed = currentTime - item.queuedAt;
                if (elapsed >= 3600) {
                    // 1 hour passed - mark as unverified
                    HalloweenDebug.log(2, `❌ Defender ${item.defenderId}: 1 hour elapsed, marking unverified`);
                    this.addUnverified(item.defenderId, 'Not found after 1 hour of checking');
                    continue; // Don't add back to queue
                }

                itemsToCheck.push(item);
            }

            // Process items in parallel if ≥3 items
            if (itemsToCheck.length >= 3) {
                HalloweenDebug.log(2, `⚡ Processing ${itemsToCheck.length} items in parallel`);
                const results = await Promise.all(
                    itemsToCheck.map(item => this.verifyDefeat(item.defenderId, item.attackTimestamp))
                );

                for (let i = 0; i < itemsToCheck.length; i++) {
                    const item = itemsToCheck[i];
                    const result = results[i];
                    this.processVerificationResult(item, result, currentTime, updatedQueue);
                }
            } else {
                // Process sequentially if < 3 items
                for (const item of itemsToCheck) {
                    const result = await this.verifyDefeat(item.defenderId, item.attackTimestamp);
                    this.processVerificationResult(item, result, currentTime, updatedQueue);
                }
            }

            this.setVerifyQueue(updatedQueue);
        },

        processVerificationResult: function(item, result, currentTime, updatedQueue) {
            if (result.verified) {
                // Success! Mark as defeated
                this.addCountedDefeat(item.defenderId);
                HalloweenDebug.log(1, `✅ Defeat confirmed for defender ${item.defenderId}`);
                return; // Don't add back to queue
            }

            // Verification failed - update state
            item.attempts++;
            item.lastError = result.reason;

            // Schedule next check based on attempts
            // NEW: 60s → 120s → 5-min intervals
            let delay;
            if (item.attempts === 1) {
                delay = 60; // 60 seconds
                HalloweenDebug.log(2, `⏭️ Defender ${item.defenderId}: First attempt failed, retry in 60s`);
            } else if (item.attempts === 2) {
                delay = 120; // 120 seconds (2 minutes)
                HalloweenDebug.log(2, `⏭️ Defender ${item.defenderId}: Second attempt failed, retry in 2 mins`);
            } else {
                delay = 300; // 300 seconds (5 minutes)
                HalloweenDebug.log(2, `⏭️ Defender ${item.defenderId}: Retry in 5 mins (attempt ${item.attempts})`);
            }

            item.nextCheckTime = currentTime + delay;
            updatedQueue.push(item);
        },

        moveToHourlyQueue: function(item) {
            const failed = this.getFailedQueue();

            failed.push({
                defenderId: item.defenderId,
                attackTimestamp: item.attackTimestamp,
                attempts: item.attempts,
                firstAttempt: item.attackTimestamp + 30,
                lastError: item.lastError,
                lastCheckTime: Math.floor(Date.now() / 1000)
            });

            this.setFailedQueue(failed);
        },

        // ===================================
        // UNVERIFIED RECHECK (6-hour intervals)
        // ===================================

        recheckUnverified: async function() {
            const unverified = this.getUnverified();

            if (unverified.length === 0) {
                HalloweenDebug.log(2, '✅ Unverified recheck: No items to process');
                return;
            }

            const now = Math.floor(Date.now() / 1000);
            const SIX_HOURS = 21600; // 6 hours in seconds
            const itemsToCheck = [];

            // Collect items that need rechecking (6 hours since last check)
            for (const item of unverified) {
                const timeSinceLastCheck = now - (item.lastCheck || 0);
                if (timeSinceLastCheck >= SIX_HOURS) {
                    itemsToCheck.push(item);
                }
            }

            if (itemsToCheck.length === 0) {
                HalloweenDebug.log(2, '✅ Unverified recheck: No items ready for recheck');
                return;
            }

            HalloweenDebug.log(1, `🔄 Rechecking ${itemsToCheck.length} unverified items (6hr interval)`);

            // Process in parallel if ≥3 items
            let results;
            if (itemsToCheck.length >= 3) {
                HalloweenDebug.log(2, `⚡ Processing ${itemsToCheck.length} unverified items in parallel`);
                results = await Promise.all(
                    itemsToCheck.map(item => this.verifyDefeat(item.defenderId, item.attackTimestamp))
                );
            } else {
                results = [];
                for (const item of itemsToCheck) {
                    const result = await this.verifyDefeat(item.defenderId, item.attackTimestamp);
                    results.push(result);
                }
            }

            // Process results
            const updatedUnverified = this.getUnverified(); // Get fresh list
            for (let i = 0; i < itemsToCheck.length; i++) {
                const item = itemsToCheck[i];
                const result = results[i];

                const unverifiedEntry = updatedUnverified.find(u => u.defenderId == item.defenderId);
                if (!unverifiedEntry) continue; // Already removed

                if (result.verified) {
                    // Found it! Remove from unverified, add to counted
                    this.addCountedDefeat(item.defenderId);
                    const filtered = updatedUnverified.filter(u => u.defenderId != item.defenderId);
                    GM_setValue('halloween_defeats_unverified', JSON.stringify(filtered));
                    HalloweenDebug.log(1, `✅ Unverified defender ${item.defenderId} now verified!`);
                } else {
                    // Still not found - update last check time
                    unverifiedEntry.lastCheck = now;
                    GM_setValue('halloween_defeats_unverified', JSON.stringify(updatedUnverified));
                    HalloweenDebug.log(2, `⏰ Defender ${item.defenderId} still unverified, will recheck in 6 hours`);
                }
            }

            HalloweenDebug.log(1, '✅ Unverified recheck complete');
        },

        startUnverifiedRecheck: function() {
            // Run unverified recheck every 6 hours
            if (this.unverifiedRecheckInterval) {
                return; // Already scheduled
            }

            // Run immediately, then every 6 hours
            this.recheckUnverified();

            this.unverifiedRecheckInterval = setInterval(() => {
                this.recheckUnverified();
            }, 21600000); // 6 hours
        },

        // Stop unverified recheck interval
        stopUnverifiedRecheck: function() {
            if (this.unverifiedRecheckInterval) {
                clearInterval(this.unverifiedRecheckInterval);
                this.unverifiedRecheckInterval = null;
                HalloweenDebug.log(2, '⏹️ Stopped unverified recheck interval');
            }
        },

        // ===================================
        // COMPETITION END SWEEP
        // ===================================

        finalVerificationSweep: async function() {
            const queue = this.getVerifyQueue();
            if (queue.length === 0) {
                HalloweenDebug.log(2, '🏁 Final verification sweep: No pending entries');
                return;
            }

            HalloweenDebug.log(1, `🏁 Final verification sweep: Checking ${queue.length} pending entries`);

            // Check ALL pending entries in parallel
            const results = await Promise.all(
                queue.map(item => this.verifyDefeat(item.defenderId, item.attackTimestamp))
            );

            for (let i = 0; i < queue.length; i++) {
                const item = queue[i];
                const result = results[i];

                if (result.verified) {
                    // Found it!
                    this.addCountedDefeat(item.defenderId);
                    HalloweenDebug.log(1, `✅ Defeat confirmed for defender ${item.defenderId} (final sweep)`);
                } else {
                    // Still not found after final sweep - mark as unverified
                    HalloweenDebug.log(2, `❌ Defender ${item.defenderId}: Not found in final sweep, marking unverified`);
                    this.addUnverified(item.defenderId, 'Not found in final sweep');
                }
            }

            // Clear queue
            this.setVerifyQueue([]);
            HalloweenDebug.log(1, '🏁 Final verification sweep complete');
        },

        checkCompetitionEnd: async function() {
            // Check if competition has ended
            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!spookyEndDate) return false;

            const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}:59Z`).getTime() / 1000;
            const now = Math.floor(Date.now() / 1000);

            if (now >= spookyEnd) {
                // Competition ended - check if final sweep already done
                if (!GM_getValue('halloween_firebase_final_sweep_done', false)) {
                    HalloweenDebug.log(1, '🏁 Spooky competition ended - performing final verification sweep');
                    await this.finalVerificationSweep();
                    GM_setValue('halloween_firebase_final_sweep_done', true);
                    return true;
                }
            }

            return false;
        },

        // ===================================
        // INITIALIZATION
        // ===================================

        init: function() {
            HalloweenDebug.log(2, '🎯 Firebase Defeat Verification initialized');

            // Start queue processing
            this.scheduleQueueProcessing();

            // Start 6-hour unverified recheck
            this.startUnverifiedRecheck();
        },

        // ===================================
        // STATISTICS
        // ===================================

        getStats: function() {
            const countedDefeats = this.getCountedDefeats().length;
            return {
                verifiedDefeats: countedDefeats,
                uniqueDefeats: countedDefeats, // Alias for compatibility with updateSoulsBanished()
                pendingVerification: this.getVerifyQueue().length,
                hourlyRetry: this.getFailedQueue().length,
                unverified: this.getUnverified().length
            };
        },

        // ===================================
        // COMPETITION RESET
        // ===================================

        resetCompetition: function() {
            if (confirm('Reset defeat tracking for this competition? This will clear all verified defeats, pending verifications, and unverified attacks.')) {
                GM_setValue('halloween_defeats_counted', '[]');
                GM_setValue('halloween_verify_queue', '[]');
                GM_setValue('halloween_verify_failed', '[]');
                GM_setValue('halloween_defeats_unverified', '[]');
                // Clear spawn schedule and expiration tracking to force regeneration
                GM_deleteValue('halloween_spawn_schedule');
                GM_deleteValue('halloween_logged_expirations');
                HalloweenDebug.log(1, '🔄 Competition defeat tracking, spawn schedule, and expiration logs reset');
            }
        }
    };

    // ===================================
    // API MODE DEFEAT VERIFICATION MODULE
    // ===================================
    const APIDefeatVerification = {
        // Defeat result values that count as defeats
        DEFEAT_RESULTS: ['Attacked', 'Hospitalized', 'Mugged'],

        // Background refresh interval (dynamic based on API testing mode)
        getRefreshInterval: function() {
            const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);
            return apiTestingMode ? 60 : 300; // 60s in testing, 5min in production
        },

        // Verification retry settings
        RETRY_FAST_INTERVAL: 30, // 30 seconds
        RETRY_FAST_ATTEMPTS: 3,
        RETRY_SLOW_INTERVAL: 120, // 2 minutes
        RETRY_SLOW_DURATION: 600, // 10 minutes total

        // ===================================
        // API MODE STATE MANAGEMENT
        // ===================================

        isAPIMode: function() {
            return GM_getValue('halloween_api_mode', false);
        },

        getAPIKey: function() {
            return GM_getValue('halloween_api_key', '');
        },

        getMemberID: function() {
            return GM_getValue('halloween_api_member_id', 0);
        },

        getMemberName: function() {
            return GM_getValue('halloween_api_member_name', '');
        },

        // ===================================
        // DEFEAT STORAGE MANAGEMENT (shared with Firebase mode)
        // ===================================

        getCountedDefeats: function() {
            try {
                const defeatsValue = GM_getValue('halloween_defeats_counted', '[]');
                return safeParse(defeatsValue, '[]');
            } catch (e) {
                return [];
            }
        },

        addCountedDefeat: function(defenderId) {
            // Normalize to string to prevent type coercion issues
            defenderId = String(defenderId);

            // First check
            const counted = this.getCountedDefeats();
            if (!counted.includes(defenderId)) {
                // Double-check pattern: re-read to prevent race condition
                const recheck = this.getCountedDefeats();
                if (!recheck.includes(defenderId)) {
                    recheck.push(defenderId);
                    GM_setValue('halloween_defeats_counted', JSON.stringify(recheck));
                    return true;
                }
            }
            return false;
        },

        isAlreadyCounted: function(defenderId) {
            return this.getCountedDefeats().includes(defenderId);
        },

        // ===================================
        // API VALIDATION
        // ===================================

        validateAPIKey: async function(apiKey) {
            return new Promise((resolve, reject) => {
                const url = `https://api.torn.com/user/?selections=profile&key=${apiKey}`;

                httpRequest({
                    url: url,
                    method: 'GET',
                    onload: function(response) {
                        try {
                            const profile = JSON.parse(response.responseText);

                            if (profile.error) {
                                reject(new Error('Invalid API key: ' + profile.error.error));
                                return;
                            }

                            resolve({
                                player_id: profile.player_id,
                                name: profile.name,
                                valid: true
                            });
                        } catch (e) {
                            reject(new Error('Failed to parse API response'));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('API request failed'));
                    }
                });
            });
        },

        enableAPIMode: async function(apiKey) {
            try {
                // Validate API key and get player info
                const playerInfo = await this.validateAPIKey(apiKey);

                // Store API credentials
                GM_setValue('halloween_api_key', apiKey);
                GM_setValue('halloween_api_member_id', playerInfo.player_id);
                GM_setValue('halloween_api_member_name', playerInfo.name);
                GM_setValue('halloween_api_mode', true);

                // Initialize timestamps (no initial fetch)
                const now = Date.now() / 1000;
                GM_setValue('halloween_api_start_timestamp', now);
                GM_setValue('halloween_api_last_refresh', now);

                // Initialize empty attack log
                GM_setValue('halloween_api_all_attacks', '{}');
                GM_setValue('halloween_api_pending_verifications', '[]');

                HalloweenDebug.log(1, `✅ API Mode enabled for ${playerInfo.name} [${playerInfo.player_id}]`);

                return {
                    success: true,
                    playerName: playerInfo.name,
                    playerId: playerInfo.player_id
                };
            } catch (error) {
                HalloweenDebug.log(1, `❌ API Mode activation failed: ${error.message}`);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // ===================================
        // ATTACK LOG MANAGEMENT
        // ===================================

        getAllAttacks: function() {
            try {
                const value = GM_getValue('halloween_api_all_attacks', '{}');
                return safeParse(value, '{}');
            } catch (e) {
                return {};
            }
        },

        /**
         * Calculate master date range from all attack-based competitions
         * Returns earliest start and latest end across spooky targets and global competition
         * @returns {Object} { masterStart: timestamp, masterEnd: timestamp }
         */
        getMasterDateRange: function() {
            const timestamps = [];

            // Get spooky targets dates
            const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
            const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (spookyStartDate && spookyEndDate) {
                const spookyStart = Math.floor(new Date(`${spookyStartDate}T${spookyStartTime}:00Z`).getTime() / 1000);
                const spookyEnd = Math.floor(new Date(`${spookyEndDate}T${spookyEndTime}:59Z`).getTime() / 1000);
                timestamps.push({ start: spookyStart, end: spookyEnd, source: 'spooky' });
            }

            // Get global competition dates
            const globalStart = GM_getValue('halloween_competition_start_timestamp', 0);
            const globalEnd = GM_getValue('halloween_competition_end_timestamp', 0);

            if (globalStart > 0 && globalEnd > 0) {
                timestamps.push({ start: globalStart, end: globalEnd, source: 'global' });
            }

            // If no valid competitions found, return nulls
            if (timestamps.length === 0) {
                return { masterStart: null, masterEnd: null };
            }

            // Calculate earliest start and latest end
            const masterStart = Math.min(...timestamps.map(t => t.start));
            const masterEnd = Math.max(...timestamps.map(t => t.end));

            HalloweenDebug.log(2, `📅 Master Date Range: ${new Date(masterStart * 1000).toISOString()} to ${new Date(masterEnd * 1000).toISOString()}`);

            return { masterStart, masterEnd };
        },

        refreshAttackLog: function(isRetry = false, paginationFrom = null) {
            if (!this.isAPIMode()) return;

            // Check if collection is already complete (unless this is a forced refresh)
            const collectionComplete = GM_getValue('halloween_api_collection_complete', false);
            if (collectionComplete && !isRetry) {
                HalloweenDebug.log(1, '⏸️ API collection complete - skipping refresh');
                return;
            }

            const apiKey = this.getAPIKey();
            const memberID = this.getMemberID();

            // Check if API testing mode is enabled
            const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);

            // Check for Override Period (locked historical window)
            const periodEnabled = GM_getValue('halloween_api_period_enabled', false);
            const periodStart = GM_getValue('halloween_api_period_start', 0);
            const periodDuration = GM_getValue('halloween_api_period_duration', 7);

            // Check for testing override (backdated collection start for stress testing)
            const overrideEnabled = GM_getValue('halloween_api_override_enabled', false);
            const overrideTimestamp = GM_getValue('halloween_api_override_timestamp', 0);

            // Get master date range for production mode
            const { masterStart, masterEnd } = this.getMasterDateRange();

            // Use enrollment timestamp if testing, otherwise use master start
            const enrollmentTimestamp = GM_getValue('halloween_enrollment_timestamp', 0);

            // Determine effective start with priority: period > override > enrollment (testing) > master start
            let effectiveStart, effectiveEnd;
            if (apiTestingMode && periodEnabled && periodStart > 0) {
                effectiveStart = periodStart;
                effectiveEnd = periodStart + (periodDuration * 24 * 60 * 60);
                HalloweenDebug.log(1, `🧪 Using OVERRIDE PERIOD: ${periodDuration} days from ${new Date(periodStart * 1000).toISOString()} (TCT)`);
            } else if (apiTestingMode && overrideEnabled && overrideTimestamp > 0) {
                effectiveStart = overrideTimestamp;
                effectiveEnd = overrideTimestamp + (7 * 24 * 60 * 60); // 7 days from override
                HalloweenDebug.log(1, '🧪 Using OVERRIDE START DATE:', new Date(overrideTimestamp * 1000).toISOString(), '(TCT)');
            } else if (apiTestingMode) {
                effectiveStart = enrollmentTimestamp;
                effectiveEnd = null; // No end limit in testing mode
            } else {
                effectiveStart = masterStart || GM_getValue('halloween_competition_start_timestamp', 0);
                effectiveEnd = masterEnd || GM_getValue('halloween_competition_end_timestamp', 0);
                HalloweenDebug.log(1, `📅 Using MASTER DATE RANGE: ${new Date(effectiveStart * 1000).toISOString()} to ${new Date(effectiveEnd * 1000).toISOString()}`);
            }

            // Use paginationFrom if provided (for recursive pagination), otherwise use last saved
            let lastSavedTimestamp;
            if (paginationFrom !== null) {
                lastSavedTimestamp = paginationFrom;
                HalloweenDebug.log(1, '[API] Using pagination timestamp:', paginationFrom);
            } else {
                lastSavedTimestamp = GM_getValue('halloween_api_last_saved_timestamp', effectiveStart);
            }

            const effectiveStartLabel = apiTestingMode ? 'testing mode - enrollment/override' : 'production mode - master start';
            HalloweenDebug.log(1, `[API] effectiveStart (${effectiveStartLabel}):`, effectiveStart);
            HalloweenDebug.log(1, '[API] lastSavedTimestamp from storage:', lastSavedTimestamp);
            const allAttacks = this.getAllAttacks();

            // Calculate and log storage size
            const attackCount = Object.keys(allAttacks).length;
            const rawStorageValue = GM_getValue('halloween_api_all_attacks', '{}');
            const storageSizeBytes = new Blob([rawStorageValue]).size;
            const storageSizeKB = (storageSizeBytes / 1024).toFixed(2);
            const storageSizeMB = (storageSizeBytes / (1024 * 1024)).toFixed(2);

            HalloweenDebug.log(1, '[API] Total attacks currently stored:', attackCount);
            HalloweenDebug.log(1, `[API] Storage size: ${storageSizeKB} KB (${storageSizeMB} MB) - ${storageSizeBytes} bytes`);

            // In testing mode, ensure we never fetch from before enrollment
            if (apiTestingMode && lastSavedTimestamp < effectiveStart) {
                HalloweenDebug.log(1, '[API] Resetting stale timestamp - using enrollment instead');
                lastSavedTimestamp = effectiveStart;
            }

            if (!apiKey || !memberID) {
                HalloweenDebug.log(1, '❌ Cannot refresh: API key or member ID missing');
                return;
            }

            if (apiTestingMode) {
                if (!enrollmentTimestamp) {
                    HalloweenDebug.log(1, '❌ Cannot refresh: Enrollment timestamp not set');
                    return;
                }
                HalloweenDebug.log(2, '🧪 API Testing Mode: Using enrollment timestamp', enrollmentTimestamp);
            } else {
                if (!effectiveStart || !effectiveEnd) {
                    HalloweenDebug.log(1, '❌ Cannot refresh: Competition timestamps not set');
                    return;
                }
            }

            const now = Math.floor(Date.now() / 1000);
            const competitionEnded = !apiTestingMode && now > effectiveEnd;

            // Build URL with from parameter (no to limit - smart stop handles end detection)
            let url = `https://api.torn.com/user/?key=${apiKey}&from=${lastSavedTimestamp}&selections=attacks`;
            const mode = apiTestingMode ? '(Testing Mode)' : '';
            HalloweenDebug.log(2, `🔄 Refreshing attack log from timestamp ${lastSavedTimestamp} ${mode}`);

            // Add cache-busting parameter to URL (force fresh data)
            url += `&_=${Date.now()}`;

            HalloweenDebug.log(1, '[API] Request URL:', url);

            httpRequest({
                url: url,
                method: 'GET',
                nocache: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                onload: (response) => {
                    try {
                        HalloweenDebug.log(1, '[API] Response status:', response.status);
                        HalloweenDebug.log(1, '[API] Response text:', response.responseText);

                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            HalloweenDebug.log(1, `❌ Attack log refresh failed: ${data.error.error}`);

                            // Retry once after 61 seconds (allows API rate limit window to reset)
                            if (!isRetry) {
                                HalloweenDebug.log(1, '⏱️ Scheduling retry in 61 seconds...');
                                setTimeout(() => {
                                    this.refreshAttackLog(true);
                                }, 61 * 1000);
                            } else {
                                HalloweenDebug.log(1, '❌ Retry failed - resuming normal schedule');
                            }
                            return;
                        }

                        // Store ALL attacks (both incoming and outgoing) with full data
                        const myAttacks = {};
                        // Calculate Override Period end timestamp if enabled
                        let periodEndTimestamp = null;
                        if (apiTestingMode && periodEnabled && periodStart > 0) {
                            periodEndTimestamp = periodStart + (periodDuration * 24 * 60 * 60);
                            HalloweenDebug.log(1, `[API] Override Period end: ${new Date(periodEndTimestamp * 1000).toISOString()} (TCT)`);
                        }

                        let outgoingCount = 0;
                        let incomingCount = 0;
                        let filteredCount = 0;
                        let reachedMasterEnd = false;

                        for (const [attackId, attack] of Object.entries(data.attacks || {})) {
                            const attackTimestamp = attack.timestamp_started || 0;

                            // Filter out attacks outside Override Period window (testing mode)
                            if (periodEndTimestamp !== null) {
                                if (attackTimestamp > periodEndTimestamp) {
                                    filteredCount++;
                                    continue; // Skip attacks after period end
                                }
                            }

                            // Filter out attacks beyond master end date (production mode)
                            if (!apiTestingMode && effectiveEnd && attackTimestamp > effectiveEnd) {
                                HalloweenDebug.log(1, `⏹️ Reached attack beyond master end date: ${new Date(attackTimestamp * 1000).toISOString()}`);
                                reachedMasterEnd = true;
                                filteredCount++;
                                continue; // Skip attacks after master end
                            }

                            // Determine attack type based on member ID
                            let attack_type;
                            if (attack.attacker_id == memberID) {
                                attack_type = 'outgoing';
                                outgoingCount++;
                            } else if (attack.defender_id == memberID) {
                                attack_type = 'incoming';
                                incomingCount++;
                            } else {
                                // Skip attacks where we're neither attacker nor defender
                                continue;
                            }

                            // Store ALL attack data plus custom attack_type field
                            myAttacks[attackId] = {
                                ...attack,  // Keep all API fields (including nested modifiers)
                                attack_type: attack_type  // Add custom field
                            };
                        }

                        if (filteredCount > 0) {
                            HalloweenDebug.log(1, `[API] Filtered ${filteredCount} attacks outside Override Period window`);
                        }

                        // Check if we reached master end date (production mode only)
                        if (reachedMasterEnd) {
                            GM_setValue('halloween_api_collection_complete', true);
                            HalloweenDebug.log(1, `✅ Collection complete - reached attack beyond master end date (${new Date(effectiveEnd * 1000).toISOString()})`);
                            HalloweenDebug.log(1, '⏸️ Future auto-refreshes will be paused. Use force collection commands to extend.');
                        }

                        HalloweenDebug.log(1, '[API] Total attacks in response:', Object.keys(data.attacks || {}).length);
                        HalloweenDebug.log(1, '[API] Outgoing attacks:', outgoingCount);
                        HalloweenDebug.log(1, '[API] Incoming attacks:', incomingCount);
                        HalloweenDebug.log(1, '[API] Your member ID:', memberID);

                        // Merge with existing attacks
                        const stored = this.getAllAttacks();
                        const updated = {...stored, ...myAttacks};
                        GM_setValue('halloween_api_all_attacks', JSON.stringify(updated));

                        // Update last saved timestamp to newest attack (for next incremental fetch)
                        // Exclude historical attacks from this calculation
                        let newestTimestamp = null;
                        const currentYearAttacks = Object.values(myAttacks).filter(a => !a.historical);
                        if (currentYearAttacks.length > 0) {
                            const timestamps = currentYearAttacks.map(a => a.timestamp_started);
                            newestTimestamp = Math.max(...timestamps);
                            GM_setValue('halloween_api_last_saved_timestamp', newestTimestamp);
                        }

                        // Update last refresh timestamp
                        GM_setValue('halloween_api_last_refresh', Date.now() / 1000);

                        HalloweenDebug.log(2, `✅ Attack log refreshed: ${Object.keys(myAttacks).length} new attacks`);

                        // PAGINATION: If we got 100 attacks, there may be more - fetch next batch
                        const attackCount = Object.keys(myAttacks).length;

                        // Check if we should stop pagination
                        let stopPagination = false;

                        // Stop if reached Override Period end (testing mode)
                        if (periodEndTimestamp !== null && newestTimestamp !== null && newestTimestamp >= periodEndTimestamp) {
                            HalloweenDebug.log(1, `📄 Stopping pagination - reached Override Period end (${new Date(periodEndTimestamp * 1000).toISOString()})`);
                            stopPagination = true;
                        }

                        // Stop if reached master end date (production mode)
                        if (reachedMasterEnd) {
                            HalloweenDebug.log(1, `📄 Stopping pagination - reached master end date`);
                            stopPagination = true;
                        }

                        if (attackCount === 100 && newestTimestamp !== null && !competitionEnded && !stopPagination) {
                            HalloweenDebug.log(1, `📄 Got 100 attacks - paginating from timestamp ${newestTimestamp}`);
                            // Recursive call with next timestamp (don't process UI updates until final batch)
                            setTimeout(() => {
                                this.refreshAttackLog(false, newestTimestamp);
                            }, 500); // Small delay to avoid rate limiting
                            return; // Skip UI updates until pagination complete
                        }

                        HalloweenDebug.log(2, `✅ Pagination complete - final batch had ${attackCount} attacks`);

                        // Event-driven UI update for Halloweek Stats
                        if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateHalloweekStats) {
                            HalloweenUI.updateHalloweekStats();
                        }

                        // COMPREHENSIVE SPOOKY TARGET SCANNING (Safety net / backup detection)
                        // Scan new attacks to catch any spooky targets that weren't detected via attack page
                        try {
                            // Get spooky window dates for validation
                            const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
                            const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
                            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
                            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

                            if (spookyStartDate && spookyEndDate) {
                                const spookyStart = new Date(`${spookyStartDate}T${spookyStartTime}:00Z`).getTime() / 1000;
                                const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}:59Z`).getTime() / 1000;

                                let foundCount = 0;
                                for (const [attackId, attack] of Object.entries(myAttacks)) {
                                    // Check if outgoing attack (only count YOUR attacks)
                                    if (attack.attack_type !== 'outgoing') continue;

                                    // Check if defender is a spooky target
                                    if (!HalloweenTargets.isSpookyTarget(attack.defender_id)) continue;

                                    // Check if within spooky window (skip in testing mode)
                                    if (!apiTestingMode && (attack.timestamp_started < spookyStart || attack.timestamp_started > spookyEnd)) continue;

                                    // Check if result is a defeat
                                    if (!this.DEFEAT_RESULTS.includes(attack.result)) continue;

                                    // Check if not already counted
                                    if (this.isAlreadyCounted(attack.defender_id)) continue;

                                    // Found unrecorded spooky target defeat!
                                    HalloweenDebug.log(1, `🎯 BACKUP DETECTION: Found spooky target ${attack.defender_id} in API data (${attack.result})`);
                                    this.recordDefeat(attack.defender_id, attack);
                                    foundCount++;
                                }

                                if (foundCount > 0) {
                                    HalloweenDebug.log(1, `🛡️ Backup detection recorded ${foundCount} missed spooky target(s)`);
                                }
                            }
                        } catch (e) {
                            // If scanning fails, don't break anything - just log it
                            HalloweenDebug.log(3, `⚠️ Backup spooky target scanning failed: ${e.message}`);
                        }

                        // Competition ended - removed final_sweep_done flag (redundant with smart stop collection_complete)
                        // if (competitionEnded) {
                        //     GM_setValue('halloween_api_final_sweep_done', true);
                        //     HalloweenDebug.log(1, '🏁 Final attack log sweep complete - competition ended');
                        //
                        //     // Celebration notification commented out - users see final stats on panel
                        //     // const bonusStats = this.getBonusStats();
                        //     // if (typeof HalloweenUI !== 'undefined' && HalloweenUI.showCompetitionEndNotification) {
                        //     //     HalloweenUI.showCompetitionEndNotification(bonusStats.totalAttacks, bonusStats.uniqueOpponents, bonusStats.totalDefeats);
                        //     // }
                        // }

                        // Update bonus stats display
                        this.updateBonusStats();

                        // Process any pending verifications (event-driven or final sweep)
                        if (competitionEnded) {
                            // Final sweep: force-check ALL pending regardless of nextRetry
                            this.finalVerificationSweep();
                        } else {
                            this.processPendingVerifications(true);
                        }

                        // Recheck unverified targets (daily or final sweep)
                        this.recheckUnverified();

                        // Update defeat verification stats display
                        if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                            HalloweenUI.updateDefeatVerificationStats();
                        }

                    } catch (e) {
                        HalloweenDebug.log(1, `❌ Failed to parse attack log: ${e.message}`);

                        // Retry once after 61 seconds (allows API rate limit window to reset)
                        if (!isRetry) {
                            HalloweenDebug.log(1, '⏱️ Scheduling retry in 61 seconds...');
                            setTimeout(() => {
                                this.refreshAttackLog(true);
                            }, 61 * 1000);
                        } else {
                            HalloweenDebug.log(1, '❌ Retry failed - resuming normal schedule');
                        }
                    }
                },
                onerror: (error) => {
                    HalloweenDebug.log(1, `❌ Attack log refresh request failed`);

                    // Retry once after 61 seconds (allows API rate limit window to reset)
                    if (!isRetry) {
                        HalloweenDebug.log(1, '⏱️ Scheduling retry in 61 seconds...');
                        setTimeout(() => {
                            this.refreshAttackLog(true);
                        }, 61 * 1000);
                    } else {
                        HalloweenDebug.log(1, '❌ Retry failed - resuming normal schedule');
                    }
                }
            });
        },

        /**
         * Collect historical attack data for a specific 7-day period
         * Used to gather previous year's Halloweek data for comparison
         * @param {number} paginationFrom - Optional timestamp to continue pagination from
         */
        refreshHistoricalAttackLog: function(paginationFrom = null) {
            if (!this.isAPIMode()) {
                HalloweenUI.showArcaneToast('API mode required for historical collection', 'error', 5000);
                return;
            }

            const apiKey = this.getAPIKey();
            const memberID = this.getMemberID();

            if (!apiKey || !memberID) {
                HalloweenUI.showArcaneToast('API credentials missing', 'error', 5000);
                return;
            }

            // Read historical period flags
            const historicPeriodStart = GM_getValue('halloween_historical_period_start', 0);
            const historicPeriodEnd = GM_getValue('halloween_historical_period_end', 0);

            if (!historicPeriodStart || !historicPeriodEnd) {
                HalloweenUI.showArcaneToast('Historical period not configured', 'error', 5000);
                return;
            }

            HalloweenDebug.log(1, `🕰️ Historical Collection: ${new Date(historicPeriodStart * 1000).toISOString()} to ${new Date(historicPeriodEnd * 1000).toISOString()}`);

            // Determine starting timestamp for this request
            let fromTimestamp;
            if (paginationFrom !== null) {
                // Continuing pagination
                fromTimestamp = paginationFrom;
                HalloweenDebug.log(1, `📄 Historical pagination from ${new Date(fromTimestamp * 1000).toISOString()}`);
            } else {
                // Check if resuming interrupted collection
                const allAttacks = this.getAllAttacks();
                const historicalAttacks = Object.values(allAttacks).filter(a => a.historical);

                if (historicalAttacks.length > 0) {
                    // Resume from newest historical attack
                    const timestamps = historicalAttacks.map(a => a.timestamp_started);
                    const newestHistorical = Math.max(...timestamps);
                    fromTimestamp = newestHistorical;
                    HalloweenDebug.log(1, `🔄 Resuming historical collection from ${new Date(fromTimestamp * 1000).toISOString()}`);
                } else {
                    // Fresh start
                    fromTimestamp = historicPeriodStart;
                    HalloweenDebug.log(1, `🆕 Starting fresh historical collection from ${new Date(fromTimestamp * 1000).toISOString()}`);
                }
            }

            // Build API URL with from and to parameters
            const url = `https://api.torn.com/user/?key=${apiKey}&from=${fromTimestamp}&to=${historicPeriodEnd}&selections=attacks&_=${Date.now()}`;

            HalloweenDebug.log(1, '[Historical API] Request URL:', url);

            httpRequest({
                url: url,
                method: 'GET',
                nocache: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                onload: (response) => {
                    try {
                        HalloweenDebug.log(1, '[Historical API] Response status:', response.status);
                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            HalloweenDebug.log(1, `❌ Historical collection failed: ${data.error.error}`);
                            HalloweenUI.showArcaneToast(`Historical collection error: ${data.error.error}`, 'error', 10000);
                            return;
                        }

                        // Process attacks and tag as historical
                        const historicalAttacks = {};
                        let outgoingCount = 0;
                        let incomingCount = 0;
                        let filteredCount = 0;

                        for (const [attackId, attack] of Object.entries(data.attacks || {})) {
                            const attackTimestamp = attack.timestamp_started || 0;

                            // Filter out attacks outside the historical period
                            if (attackTimestamp < historicPeriodStart || attackTimestamp > historicPeriodEnd) {
                                filteredCount++;
                                continue;
                            }

                            // Determine attack type based on member ID
                            let attack_type;
                            if (attack.attacker_id == memberID) {
                                attack_type = 'outgoing';
                                outgoingCount++;
                            } else if (attack.defender_id == memberID) {
                                attack_type = 'incoming';
                                incomingCount++;
                            } else {
                                // Skip attacks where we're neither attacker nor defender
                                continue;
                            }

                            // Store attack data with historical flag
                            historicalAttacks[attackId] = {
                                ...attack,
                                attack_type: attack_type,
                                historical: true  // Critical flag for filtering
                            };
                        }

                        if (filteredCount > 0) {
                            HalloweenDebug.log(1, `[Historical API] Filtered ${filteredCount} attacks outside period`);
                        }

                        HalloweenDebug.log(1, `[Historical API] Collected ${outgoingCount} outgoing, ${incomingCount} incoming`);

                        // Merge with existing attacks
                        const stored = this.getAllAttacks();
                        const updated = {...stored, ...historicalAttacks};
                        GM_setValue('halloween_api_all_attacks', JSON.stringify(updated));

                        // Calculate newest timestamp from this batch
                        let newestTimestamp = null;
                        if (Object.keys(historicalAttacks).length > 0) {
                            const timestamps = Object.values(historicalAttacks).map(a => a.timestamp_started);
                            newestTimestamp = Math.max(...timestamps);
                        }

                        // Check for pagination
                        const attackCount = Object.keys(historicalAttacks).length;

                        if (attackCount === 100 && newestTimestamp !== null && newestTimestamp < historicPeriodEnd) {
                            // More attacks available - continue pagination
                            HalloweenDebug.log(1, `📄 Historical pagination: got 100 attacks, continuing from ${new Date(newestTimestamp * 1000).toISOString()}`);
                            setTimeout(() => {
                                this.refreshHistoricalAttackLog(newestTimestamp);
                            }, 500); // Small delay to avoid rate limiting
                            return; // Don't show completion yet
                        }

                        // Collection complete!
                        GM_setValue('halloween_historical_complete', true);

                        // Count total historical attacks
                        const allAttacks = this.getAllAttacks();
                        const totalHistorical = Object.values(allAttacks).filter(a => a.historical).length;

                        HalloweenDebug.log(1, `✅ Historical collection complete - ${totalHistorical} total historical attacks`);
                        HalloweenUI.showArcaneToast(`Historical collection complete - ${totalHistorical} attacks collected`, 'success', 20000);

                    } catch (e) {
                        HalloweenDebug.log(1, `❌ Failed to parse historical response: ${e.message}`);
                        HalloweenUI.showArcaneToast(`Historical collection error: ${e.message}`, 'error', 10000);
                    }
                },
                onerror: (error) => {
                    HalloweenDebug.log(1, `❌ Historical collection request failed`);
                    HalloweenUI.showArcaneToast('Historical collection request failed', 'error', 10000);
                }
            });
        },

        auditAPICollection: function(auditStart, auditEnd, beforeCount, paginationFrom = null) {
            if (!this.isAPIMode()) {
                HalloweenUI.showArcaneToast('API mode required for audit', 'error', 5000);
                return;
            }

            const apiKey = this.getAPIKey();
            const memberID = this.getMemberID();

            if (!apiKey || !memberID) {
                HalloweenUI.showArcaneToast('API credentials missing', 'error', 5000);
                return;
            }

            HalloweenDebug.log(1, `🔍 Audit Collection: ${new Date(auditStart * 1000).toISOString()} to ${new Date(auditEnd * 1000).toISOString()}`);

            // Determine starting timestamp for this request
            let fromTimestamp = paginationFrom !== null ? paginationFrom : auditStart;

            HalloweenDebug.log(1, `📄 Audit pagination from ${new Date(fromTimestamp * 1000).toISOString()}`);

            // Build API URL with from and to parameters
            const url = `https://api.torn.com/user/?key=${apiKey}&from=${fromTimestamp}&to=${auditEnd}&selections=attacks&_=${Date.now()}`;

            HalloweenDebug.log(1, '[Audit API] Request URL:', url);

            httpRequest({
                url: url,
                method: 'GET',
                nocache: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                onload: (response) => {
                    try {
                        HalloweenDebug.log(1, '[Audit API] Response status:', response.status);
                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            HalloweenDebug.log(1, `❌ Audit failed: ${data.error.error}`);
                            HalloweenUI.showArcaneToast(`Audit error: ${data.error.error}`, 'error', 10000);
                            return;
                        }

                        // Process attacks (NO historical flag - these are current competition attacks)
                        const auditAttacks = {};
                        let outgoingCount = 0;
                        let incomingCount = 0;
                        let filteredCount = 0;

                        for (const [attackId, attack] of Object.entries(data.attacks || {})) {
                            const attackTimestamp = attack.timestamp_started || 0;

                            // Filter out attacks outside the audit period
                            if (attackTimestamp < auditStart || attackTimestamp > auditEnd) {
                                filteredCount++;
                                continue;
                            }

                            // Determine attack type based on member ID
                            let attack_type;
                            if (attack.attacker_id == memberID) {
                                attack_type = 'outgoing';
                                outgoingCount++;
                            } else if (attack.defender_id == memberID) {
                                attack_type = 'incoming';
                                incomingCount++;
                            } else {
                                // Skip attacks where we're neither attacker nor defender
                                continue;
                            }

                            // Store attack data WITHOUT historical flag
                            auditAttacks[attackId] = {
                                ...attack,
                                attack_type: attack_type
                            };
                        }

                        if (filteredCount > 0) {
                            HalloweenDebug.log(1, `[Audit API] Filtered ${filteredCount} attacks outside period`);
                        }

                        HalloweenDebug.log(1, `[Audit API] Collected ${outgoingCount} outgoing, ${incomingCount} incoming`);

                        // Merge with existing attacks (skip duplicates, only add new attacks)
                        const stored = this.getAllAttacks();
                        const newAttacks = {};
                        let duplicateCount = 0;

                        for (const [attackId, attack] of Object.entries(auditAttacks)) {
                            if (!stored[attackId]) {
                                newAttacks[attackId] = attack;
                            } else {
                                duplicateCount++;
                            }
                        }

                        const updated = {...stored, ...newAttacks};
                        GM_setValue('halloween_api_all_attacks', JSON.stringify(updated));

                        if (duplicateCount > 0) {
                            HalloweenDebug.log(1, `[Audit API] Skipped ${duplicateCount} duplicate attacks`);
                        }

                        // Calculate newest timestamp from this batch
                        let newestTimestamp = null;
                        if (Object.keys(auditAttacks).length > 0) {
                            const timestamps = Object.values(auditAttacks).map(a => a.timestamp_started);
                            newestTimestamp = Math.max(...timestamps);
                        }

                        // Check for pagination
                        const attackCount = Object.keys(auditAttacks).length;

                        if (attackCount === 100 && newestTimestamp !== null && newestTimestamp < auditEnd) {
                            // More attacks available - continue pagination
                            HalloweenDebug.log(1, `📄 Audit pagination: got 100 attacks, continuing from ${new Date(newestTimestamp * 1000).toISOString()}`);
                            setTimeout(() => {
                                this.auditAPICollection(auditStart, auditEnd, beforeCount, newestTimestamp);
                            }, 500); // Small delay to avoid rate limiting
                            return; // Don't show completion yet
                        }

                        // Audit complete!
                        const afterCount = Object.keys(this.getAllAttacks()).length;
                        const addedCount = afterCount - beforeCount;

                        HalloweenDebug.log(1, `✅ Audit complete - ${addedCount} attacks added (${beforeCount} → ${afterCount})`);

                        if (addedCount > 0) {
                            HalloweenUI.showArcaneToast(`Audit complete - ${addedCount} missing attacks added`, 'success', 20000);
                        } else {
                            HalloweenUI.showArcaneToast('Audit complete - no missing attacks found', 'success', 10000);
                        }

                    } catch (e) {
                        HalloweenDebug.log(1, `❌ Failed to parse audit response: ${e.message}`);
                        HalloweenUI.showArcaneToast(`Audit error: ${e.message}`, 'error', 10000);
                    }
                },
                onerror: (error) => {
                    HalloweenDebug.log(1, `❌ Audit request failed`);
                    HalloweenUI.showArcaneToast('Audit request failed', 'error', 10000);
                }
            });
        },

        scanStoredAttacks: function(spookyStart, spookyEnd) {
            try {
                HalloweenDebug.log(1, `🔍 Scanning stored attacks for missing defeats`);

                // Get all stored attacks
                const allAttacks = this.getAllAttacks();
                const attackCount = Object.keys(allAttacks).length;

                if (attackCount === 0) {
                    HalloweenUI.showArcaneToast('No API attacks found in storage', 'error', 10000);
                    return;
                }

                HalloweenDebug.log(1, `📊 Scanning ${attackCount} stored attacks`);

                // Count defeats before scan
                const beforeCount = this.getCountedDefeats().length;

                // Get API testing mode to skip window check if enabled
                const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);

                // Filter to outgoing attacks only (ignore incoming/defensive attacks)
                const outgoingAttacks = Object.entries(allAttacks).filter(([_, attack]) => attack.attack_type === 'outgoing');
                const outgoingCount = outgoingAttacks.length;

                let foundCount = 0;
                let skippedNotSpooky = 0;
                let skippedNotInWindow = 0;
                let skippedNotDefeat = 0;
                let skippedAlreadyCounted = 0;

                // Loop through outgoing attacks only
                for (const [attackId, attack] of outgoingAttacks) {
                    // Check 1: Is defender a spooky target
                    if (!HalloweenTargets.isSpookyTarget(attack.defender_id)) {
                        skippedNotSpooky++;
                        continue;
                    }

                    // Check 3: Is within spooky window (skip in testing mode)
                    if (!apiTestingMode && (attack.timestamp_started < spookyStart || attack.timestamp_started > spookyEnd)) {
                        skippedNotInWindow++;
                        continue;
                    }

                    // Check 4: Is result a defeat
                    if (!this.DEFEAT_RESULTS.includes(attack.result)) {
                        skippedNotDefeat++;
                        continue;
                    }

                    // Check 5: Is NOT already counted
                    if (this.isAlreadyCounted(attack.defender_id)) {
                        skippedAlreadyCounted++;
                        continue;
                    }

                    // Found unrecorded spooky target defeat!
                    HalloweenDebug.log(1, `🎯 SYNC: Found missing defeat for spooky target ${attack.defender_id} (${attack.result})`);
                    this.recordDefeat(attack.defender_id, attack);
                    foundCount++;
                }

                // Count defeats after scan
                const afterCount = this.getCountedDefeats().length;
                const addedCount = afterCount - beforeCount;

                // Log statistics
                HalloweenDebug.log(1, `📊 Scan statistics:`);
                HalloweenDebug.log(1, `   - Total attacks in storage: ${attackCount}`);
                HalloweenDebug.log(1, `   - Outgoing attacks scanned: ${outgoingCount}`);
                HalloweenDebug.log(1, `   - Skipped (not spooky): ${skippedNotSpooky}`);
                HalloweenDebug.log(1, `   - Skipped (not in window): ${skippedNotInWindow}`);
                HalloweenDebug.log(1, `   - Skipped (not defeat): ${skippedNotDefeat}`);
                HalloweenDebug.log(1, `   - Skipped (already counted): ${skippedAlreadyCounted}`);
                HalloweenDebug.log(1, `   - Missing defeats found: ${foundCount}`);
                HalloweenDebug.log(1, `✅ Defeat sync complete: ${addedCount} defeats added (${beforeCount} → ${afterCount})`);

                // Show result toast
                if (addedCount > 0) {
                    HalloweenUI.showArcaneToast(`Sync complete - ${addedCount} missing defeats added`, 'success', 20000);
                } else {
                    HalloweenUI.showArcaneToast('Sync complete - no missing defeats found', 'success', 10000);
                }

                // Trigger UI updates
                if (typeof HalloweenUI !== 'undefined') {
                    if (HalloweenUI.updateSoulsBanished) {
                        HalloweenUI.updateSoulsBanished();
                    }
                    if (HalloweenUI.updateDefeatVerificationStats) {
                        HalloweenUI.updateDefeatVerificationStats();
                    }
                }

            } catch (e) {
                HalloweenDebug.log(1, `❌ Defeat sync failed: ${e.message}`);
                HalloweenUI.showArcaneToast(`Sync error: ${e.message}`, 'error', 10000);
            }
        },

        checkAttackLogRefresh: function() {
            if (!this.isAPIMode()) return;

            const now = Date.now() / 1000;

            // Priority 1: Check for event-driven refresh (attack exit or bounty detection)
            const nextRefresh = GM_getValue('halloween_api_next_refresh', 0);
            if (nextRefresh > 0 && now >= nextRefresh) {
                HalloweenDebug.log(1, `🔄 Event-driven refresh triggered (scheduled at ${new Date(nextRefresh * 1000).toLocaleTimeString()})`);
                GM_deleteValue('halloween_api_next_refresh'); // Clear flag
                this.refreshAttackLog();
                return; // Don't check interval (refresh just happened)
            }

            // Priority 2: Fallback to 5-minute interval check
            const lastRefresh = GM_getValue('halloween_api_last_refresh', 0);
            const refreshInterval = this.getRefreshInterval();

            // Refresh if interval has elapsed
            if (now - lastRefresh >= refreshInterval) {
                HalloweenDebug.log(2, `🔄 Auto-refresh triggered (${refreshInterval}s elapsed)`);
                this.refreshAttackLog();
            }
        },

        // ===================================
        // DEFEAT VERIFICATION
        // ===================================

        verifyDefeat: function(defenderId) {
            const allAttacks = this.getAllAttacks();
            const attackValues = Object.values(allAttacks);

            // Get spooky competition timeframe
            const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
            const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!spookyStartDate || !spookyEndDate) {
                HalloweenDebug.log(1, '⚠️ Spooky competition dates not set - cannot verify');
                return 'pending';
            }

            const spookyStart = new Date(`${spookyStartDate}T${spookyStartTime}:00Z`).getTime() / 1000;
            const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}:59Z`).getTime() / 1000;

            HalloweenDebug.log(1, `HAL: 🎯 Verifying defender ${defenderId}`);
            HalloweenDebug.log(1, `HAL: 🎯 Spooky window: ${HalloweenDebug.formatTimestamp(spookyStart)} to ${HalloweenDebug.formatTimestamp(spookyEnd)}`);
            HalloweenDebug.log(1, `HAL: 🎯 Total attacks in API data: ${attackValues.length}`);

            // Filter attacks to spooky competition window only
            const spookyWindowAttacks = attackValues.filter(a =>
                a.timestamp_started >= spookyStart &&
                a.timestamp_started <= spookyEnd
            );

            HalloweenDebug.log(1, `HAL: 🎯 Attacks in spooky window: ${spookyWindowAttacks.length}`);

            // Get newest timestamp from ALL stored attacks (for unverified check)
            const timestamps = attackValues.map(a => a.timestamp_started);
            const newestStoredTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;

            // Look for defeat WITHIN spooky window (outgoing attacks only)
            HalloweenDebug.log(1, `HAL: 🎯 Checking ${spookyWindowAttacks.length} attacks for defender ${defenderId}...`);
            spookyWindowAttacks.forEach(a => {
                const isMatch = a.defender_id == defenderId;
                const isDefeat = this.DEFEAT_RESULTS.includes(a.result);
                const isOutgoing = a.attack_type === 'outgoing';
                HalloweenDebug.log(1, `🎯   - Attack vs ${a.defender_id}: result=${a.result}, type=${a.attack_type}, match=${isMatch}, defeat=${isDefeat}, outgoing=${isOutgoing}, time=${HalloweenDebug.formatTimestamp(a.timestamp_started)}`);
            });

            const found = spookyWindowAttacks.find(a =>
                a.attack_type === 'outgoing' &&  // Only count YOUR attacks
                a.defender_id == defenderId &&
                this.DEFEAT_RESULTS.includes(a.result)
            );

            if (found) {
                // VERIFIED!
                HalloweenDebug.log(1, `✅ API Defeat verified: ${defenderId} (${found.result})`);
                this.recordDefeat(defenderId, found);
                this.removeFromQueue(defenderId);
                return 'verified';
            }

            // 10-minute buffer check
            const queue = this.getPendingVerifications();
            const queueEntry = queue.find(q => q.defenderId == defenderId);

            if (queueEntry) {
                const detectionTime = queueEntry.queuedAt;
                const bufferTime = 10 * 60; // 10 minutes in seconds
                const now = Math.floor(Date.now() / 1000);

                // Check: Has 10+ minutes passed AND do we have data covering that period?
                const timeElapsed = now - detectionTime;
                const hasEnoughData = newestStoredTimestamp >= (detectionTime + bufferTime);

                if (timeElapsed >= bufferTime && hasEnoughData) {
                    // Attack logs have data ≥10 min after detection, attack not found = missing
                    HalloweenDebug.log(1, `⚠️ API Defeat unverified: ${defenderId} (not in API after 10 min buffer)`);
                    this.markAsUnverified(defenderId);
                    this.removeFromQueue(defenderId);
                    return 'unverified';
                }
            }

            // Need to retry (not enough time elapsed or data coverage)
            HalloweenDebug.log(1, `HAL: 🎯 Defender ${defenderId} still pending (waiting for 10min buffer or more API data)`);
            if (queueEntry) {
                const timeElapsed = Math.floor(Date.now() / 1000) - queueEntry.queuedAt;
                const hasEnoughData = newestStoredTimestamp >= (queueEntry.queuedAt + 600);
                HalloweenDebug.log(1, `HAL: 🎯   - Time elapsed: ${timeElapsed}s (need 600s), Has data: ${hasEnoughData}, Newest API timestamp: ${HalloweenDebug.formatTimestamp(newestStoredTimestamp)}`);
            }
            return 'pending';
        },

        queueVerification: function(defenderId, attackTimestamp) {
            // Skip if already confirmed as defeated
            if (this.isAlreadyCounted(defenderId)) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already counted - skipping`);
                return;
            }

            // Skip if currently in pending queue
            const queue = this.getPendingVerifications();
            if (queue.find(q => q.defenderId == defenderId)) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already in queue - skipping`);
                return;
            }

            // If previously unverified, remove and give second chance
            // (User might have returned and actually attacked this time)
            const unverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
            const unverified = safeParse(unverifiedValue, '[]');
            if (unverified.find(u => u.defenderId == defenderId)) {
                const filtered = unverified.filter(u => u.defenderId != defenderId);
                GM_setValue('halloween_defeats_unverified', JSON.stringify(filtered));
                HalloweenDebug.log(2, `♻️ Defender ${defenderId} removed from unverified, re-queueing`);
            }

            // Use provided timestamp or current time
            const timestamp = attackTimestamp || Math.floor(Date.now() / 1000);
            const now = Math.floor(Date.now() / 1000);

            // Add to pending queue with NEW structure
            // exitDetected starts as false, gets set to true when exit is detected
            if (!queue.find(q => q.defenderId == defenderId)) {
                queue.push({
                    defenderId: defenderId,
                    queuedAt: timestamp,
                    exitDetected: false, // NEW: Track if exit was detected
                    checkState: 'initial', // NEW: 'initial', '2min_retry', 'event_driven'
                    attempts: 0,
                    nextRetry: now + 30 // Initial check in 30s (will be immediate if exit detected)
                });
                GM_setValue('halloween_api_pending_verifications', JSON.stringify(queue));

                HalloweenDebug.log(2, `📋 Queued API verification for defender ${defenderId} (timestamp: ${timestamp}, initial check in 30s)`);

                // Event-driven UI update
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                    HalloweenUI.updateDefeatVerificationStats();
                }
            }
        },

        getPendingVerifications: function() {
            try {
                const value = GM_getValue('halloween_api_pending_verifications', '[]');
                return safeParse(value, '[]');
            } catch (e) {
                return [];
            }
        },

        updateQueueTimestamp: function(defenderId, newTimestamp) {
            const queue = this.getPendingVerifications();
            const entry = queue.find(q => q.defenderId == defenderId);

            if (entry) {
                const oldTimestamp = entry.queuedAt;
                entry.queuedAt = newTimestamp;
                entry.exitDetected = true; // Mark that exit was detected
                entry.nextRetry = Math.floor(Date.now() / 1000); // Check immediately
                GM_setValue('halloween_api_pending_verifications', JSON.stringify(queue));

                HalloweenDebug.log(2, `⏱️ Updated timestamp for defender ${defenderId}: ${oldTimestamp} → ${newTimestamp} (${newTimestamp - oldTimestamp}s later, exit detected, immediate check)`);
            } else {
                HalloweenDebug.log(3, `⚠️ Could not update timestamp for defender ${defenderId} - not found in queue`);
            }
        },

        processPendingVerifications: function(eventDriven = false) {
            const queue = this.getPendingVerifications();
            const now = Math.floor(Date.now() / 1000);
            let queueModified = false;

            // Get newest API timestamp for unverified check
            const allAttacks = this.getAllAttacks();
            const attackValues = Object.values(allAttacks);
            const timestamps = attackValues.map(a => a.timestamp_started);
            const newestAPITimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;

            // Update last spooky verification timestamp for bounty piggyback logic
            BountyManager.setLastSpookyVerificationTime(now);

            // PIGGYBACK: Verify today's unclaimed bounties alongside spooky targets
            const verifiedCount = BountyManager.verifyTodaysBounties(allAttacks);
            if (verifiedCount > 0 && typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                HalloweenUI.updateBountiesClaimed();
            }

            for (const entry of queue) {
                // Check if we should verify this entry
                const shouldCheck = eventDriven || (now >= entry.nextRetry);

                if (!shouldCheck) continue;

                const result = this.verifyDefeat(entry.defenderId);

                if (result === 'pending') {
                    // Still not found - update state
                    queueModified = true;

                    if (entry.checkState === 'initial') {
                        // Initial check failed - schedule 30s retry
                        entry.checkState = 'retry_1';
                        entry.nextRetry = now + 30; // 30 seconds
                        HalloweenDebug.log(2, `⏳ Defender ${entry.defenderId}: Initial check failed, retry in 30s`);
                    } else if (entry.checkState === 'retry_1') {
                        // 30s retry failed - move to event-driven
                        entry.checkState = 'event_driven';
                        entry.nextRetry = Infinity; // No more scheduled checks
                        HalloweenDebug.log(2, `⏳ Defender ${entry.defenderId}: 30s retry failed, now event-driven`);
                    } else if (entry.checkState === 'event_driven') {
                        // Event-driven check - check if we should mark as unverified
                        // If API has data newer than 1 hour after queue time, mark unverified
                        if (newestAPITimestamp > (entry.queuedAt + 3600)) {
                            HalloweenDebug.log(2, `❌ Defender ${entry.defenderId}: API data covers 1hr+ after attack, marking unverified`);
                            this.markAsUnverified(entry.defenderId);
                            this.removeFromQueue(entry.defenderId);
                            queueModified = true;
                        }
                    }
                }
                // Note: 'verified' and 'unverified' cases handle their own queue removal in verifyDefeat
            }

            // Save queue if modified
            if (queueModified) {
                const currentQueue = this.getPendingVerifications(); // Get fresh queue after any removals
                GM_setValue('halloween_api_pending_verifications', JSON.stringify(currentQueue));
            }
        },

        removeFromQueue: function(defenderId) {
            const queue = this.getPendingVerifications();
            const filtered = queue.filter(q => q.defenderId != defenderId);
            GM_setValue('halloween_api_pending_verifications', JSON.stringify(filtered));
        },

        recordDefeat: function(defenderId, attackData) {
            // Add to counted defeats using API's own method
            this.addCountedDefeat(defenderId);

            // Clean up unverified list if this defender was in it
            const unverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
            const unverified = safeParse(unverifiedValue, '[]');
            if (unverified.find(u => u.defenderId == defenderId)) {
                const filtered = unverified.filter(u => u.defenderId != defenderId);
                GM_setValue('halloween_defeats_unverified', JSON.stringify(filtered));
                HalloweenDebug.log(2, `🧹 Removed ${defenderId} from unverified list (defeat confirmed)`);
            }

            // Add to encounters if not already there (for accurate "Targets Found" count)
            const encountersValue = GM_getValue('halloween_encounters', '{}');
            const encounters = safeParse(encountersValue, '{}');

            if (!encounters[defenderId]) {
                // Target defeated via API without detection - add minimal encounter record
                const currentTime = Date.now();
                const seed = GM_getValue('halloween_seed', 'unknown');

                encounters[defenderId] = {
                    digits: 'unknown', // No detection, digits not known
                    seed: seed,
                    lastEncounter: currentTime,
                    firstEncounter: currentTime,
                    encounterCount: 1,
                    url: `https://www.torn.com/profiles.php?XID=${defenderId}`, // Construct profile URL
                    apiDetected: true // Flag to indicate this was found via API, not page detection
                };

                GM_setValue('halloween_encounters', JSON.stringify(encounters));
                HalloweenDebug.log(1, `🎃 API defeat encounter added: ${defenderId} (found via API backup detection)`);
            }

            HalloweenDebug.log(1, `🎃 API defeat recorded: ${defenderId}`);

            // Event-driven UI updates
            if (typeof HalloweenUI !== 'undefined') {
                if (HalloweenUI.updateSoulsBanished) {
                    HalloweenUI.updateSoulsBanished();
                }
                if (HalloweenUI.updateDefeatVerificationStats) {
                    HalloweenUI.updateDefeatVerificationStats();
                }
            }
        },

        markAsUnverified: function(defenderId) {
            // Add to unverified list with timestamp (for daily recheck tracking)
            const unverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
            const unverified = safeParse(unverifiedValue, '[]');

            // Update to object format if needed (migration from old string array)
            const unverifiedList = unverified.map(item =>
                typeof item === 'string' ? { defenderId: item, lastCheck: 0 } : item
            );

            if (!unverifiedList.find(u => u.defenderId == defenderId)) {
                unverifiedList.push({
                    defenderId: defenderId,
                    lastCheck: Math.floor(Date.now() / 1000)
                });
                GM_setValue('halloween_defeats_unverified', JSON.stringify(unverifiedList));
                HalloweenDebug.log(2, `❌ Marked defender ${defenderId} as unverified`);

                // Event-driven UI update
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                    HalloweenUI.updateDefeatVerificationStats();
                }
            }
        },

        recheckUnverified: function() {
            if (!this.isAPIMode()) return;

            const unverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
            const unverified = safeParse(unverifiedValue, '[]');
            if (unverified.length === 0) return;

            // Update to object format if needed (migration)
            const unverifiedList = unverified.map(item =>
                typeof item === 'string' ? { defenderId: item, lastCheck: 0 } : item
            );

            const now = Math.floor(Date.now() / 1000);
            const DAY_IN_SECONDS = 86400;
            let modified = false;

            HalloweenDebug.log(2, `🔄 Checking ${unverifiedList.length} unverified targets for daily recheck`);

            for (const entry of unverifiedList) {
                const timeSinceLastCheck = now - entry.lastCheck;

                // Recheck if 24 hours have passed
                if (timeSinceLastCheck >= DAY_IN_SECONDS) {
                    HalloweenDebug.log(2, `🔍 Rechecking unverified defender ${entry.defenderId} (${Math.floor(timeSinceLastCheck / 3600)}hrs since last check)`);

                    const result = this.verifyDefeat(entry.defenderId);

                    if (result === 'verified') {
                        // Found it! verifyDefeat already handled adding to counted
                        HalloweenDebug.log(2, `✅ Unverified defender ${entry.defenderId} now verified!`);
                        modified = true;
                    } else {
                        // Still not found, update last check time
                        entry.lastCheck = now;
                        modified = true;
                    }
                }
            }

            // Save if modified
            if (modified) {
                // Remove verified entries (they were removed in verifyDefeat)
                const currentUnverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
                const currentUnverified = safeParse(currentUnverifiedValue, '[]');
                GM_setValue('halloween_defeats_unverified', JSON.stringify(currentUnverified));
            }
        },

        finalVerificationSweep: function() {
            if (!this.isAPIMode()) return;

            const queue = this.getPendingVerifications();
            if (queue.length === 0) {
                HalloweenDebug.log(2, '🏁 Final verification sweep: No pending entries');
                return;
            }

            HalloweenDebug.log(1, `🏁 Final verification sweep: Checking ${queue.length} pending entries`);

            // Check ALL pending entries, regardless of nextRetry time
            for (const entry of queue) {
                const result = this.verifyDefeat(entry.defenderId);

                if (result === 'pending') {
                    // Still not found after final sweep - mark as unverified
                    HalloweenDebug.log(2, `❌ Defender ${entry.defenderId}: Not found in final sweep, marking unverified`);
                    this.markAsUnverified(entry.defenderId);
                    this.removeFromQueue(entry.defenderId);
                }
                // Verified cases handled in verifyDefeat
            }

            HalloweenDebug.log(1, '🏁 Final verification sweep complete');
        },

        // ===================================
        // HALLOWEEK STATS
        // ===================================

        getBonusStats: function() {
            const attacks = this.getAllAttacks();
            const attackValues = Object.values(attacks);

            // Determine date range based on report mode
            const reportMode = GM_getValue('halloween_report_mode', 'default');
            let startTimestamp, endTimestamp;
            let filteredAttacks = attackValues;

            if (reportMode === '7d') {
                // Last 7 days mode
                const now = Math.floor(Date.now() / 1000);
                startTimestamp = now - (7 * 24 * 60 * 60);
                endTimestamp = now;
                HalloweenDebug.log(2, `📊 Halloweek Stats using last 7 days (${new Date(startTimestamp * 1000).toISOString()} to ${new Date(endTimestamp * 1000).toISOString()})`);

                // Filter by date range (exclude historical)
                filteredAttacks = attackValues.filter(a => {
                    if (a.historical) return false; // Exclude historical attacks
                    const timestamp = a.timestamp_started || 0;
                    return timestamp >= startTimestamp && timestamp <= endTimestamp;
                });
                HalloweenDebug.log(2, `📊 Filtered ${attackValues.length} attacks to ${filteredAttacks.length} within last 7 days`);

            } else if (reportMode === 'historical') {
                // Historical mode - use stored historical period
                const historicPeriodStart = GM_getValue('halloween_historical_period_start', 0);
                const historicPeriodEnd = GM_getValue('halloween_historical_period_end', 0);

                if (historicPeriodStart > 0 && historicPeriodEnd > 0) {
                    startTimestamp = historicPeriodStart;
                    endTimestamp = historicPeriodEnd;
                    HalloweenDebug.log(2, `📊 Halloweek Stats using historical period (${new Date(startTimestamp * 1000).toISOString()} to ${new Date(endTimestamp * 1000).toISOString()})`);

                    // Filter to only historical attacks within the period
                    filteredAttacks = attackValues.filter(a => {
                        if (!a.historical) return false; // Only include historical attacks
                        const timestamp = a.timestamp_started || 0;
                        return timestamp >= startTimestamp && timestamp <= endTimestamp;
                    });
                    HalloweenDebug.log(2, `📊 Filtered ${attackValues.length} attacks to ${filteredAttacks.length} historical attacks`);
                } else {
                    HalloweenDebug.log(1, '⚠️ Historical period not configured - returning empty stats');
                    filteredAttacks = [];
                }

            } else {
                // Default: Use global competition dates (exclude historical)
                startTimestamp = GM_getValue('halloween_competition_start_timestamp', 0);
                endTimestamp = GM_getValue('halloween_competition_end_timestamp', 0);
                HalloweenDebug.log(2, `📊 Halloweek Stats using global competition dates (${new Date(startTimestamp * 1000).toISOString()} to ${new Date(endTimestamp * 1000).toISOString()})`);

                // Filter by date range if timestamps are valid
                if (startTimestamp > 0 && endTimestamp > 0) {
                    filteredAttacks = attackValues.filter(a => {
                        if (a.historical) return false; // Exclude historical attacks
                        const timestamp = a.timestamp_started || 0;
                        return timestamp >= startTimestamp && timestamp <= endTimestamp;
                    });
                    HalloweenDebug.log(2, `📊 Filtered ${attackValues.length} attacks to ${filteredAttacks.length} within date range`);
                }
            }

            // Split into outgoing and incoming
            const outgoingAttacks = filteredAttacks.filter(a => a.attack_type === 'outgoing');
            const incomingAttacks = filteredAttacks.filter(a => a.attack_type === 'incoming');

            // OUTGOING STATS (original stats - your attacks)
            const totalAttacks = outgoingAttacks.length;
            const uniqueOpponents = new Set(outgoingAttacks.map(a => a.defender_id)).size;
            const totalDefeats = outgoingAttacks.filter(a =>
                this.DEFEAT_RESULTS.includes(a.result)  // Attacked, Hospitalized, Mugged
            ).length;

            // INCOMING STATS (defensive stats - attacks against you)
            const totalAttacked = incomingAttacks.length;  // Total times you were attacked
            const uniqueAttackers = new Set(incomingAttacks.map(a => a.attacker_id)).size;  // Unique players who attacked you
            const DEFEND_RESULTS = ['Lost', 'Interrupted', 'Stalemate'];  // Results where attacker failed
            const totalDefends = incomingAttacks.filter(a =>
                DEFEND_RESULTS.includes(a.result)  // Times you successfully defended
            ).length;

            return {
                // Outgoing (offense)
                totalAttacks,
                uniqueOpponents,
                totalDefeats,
                // Incoming (defense)
                totalAttacked,
                uniqueAttackers,
                totalDefends
            };
        },

        updateBonusStats: function() {
            if (!this.isAPIMode()) return;

            const stats = this.getBonusStats();

            // Update outgoing (offense) stats
            const attacksEl = document.getElementById('stat-competition-attacks');
            const opponentsEl = document.getElementById('stat-unique-opponents');
            const defeatsEl = document.getElementById('stat-total-defeats');

            if (attacksEl) attacksEl.textContent = stats.totalAttacks;
            if (opponentsEl) opponentsEl.textContent = stats.uniqueOpponents;
            if (defeatsEl) defeatsEl.textContent = stats.totalDefeats;

            // Update incoming (defense) stats
            const attackedEl = document.getElementById('stat-total-attacked');
            const attackersEl = document.getElementById('stat-unique-attackers');
            const defendsEl = document.getElementById('stat-total-defends');

            if (attackedEl) attackedEl.textContent = stats.totalAttacked;
            if (attackersEl) attackersEl.textContent = stats.uniqueAttackers;
            if (defendsEl) defendsEl.textContent = stats.totalDefends;
        },

        // ===================================
        // STATISTICS
        // ===================================

        getStats: function() {
            const countedDefeats = this.getCountedDefeats().length;
            const unverifiedValue = GM_getValue('halloween_defeats_unverified', '[]');
            return {
                verifiedDefeats: countedDefeats,
                uniqueDefeats: countedDefeats, // Alias for compatibility with updateSoulsBanished()
                pendingVerification: this.getPendingVerifications().length,
                unverified: safeParse(unverifiedValue, '[]').length
            };
        },

        // ===================================
        // INITIALIZATION
        // ===================================

        initialize: function() {
            if (!this.isAPIMode()) return;

            HalloweenDebug.log(2, '🎃 API Mode active - initializing');

            // Check for attack log refresh on page load (includes final sweep if competition ended)
            this.checkAttackLogRefresh();

            // Process any pending verifications
            this.processPendingVerifications();

            // Process bounty verifications (15-min checks, retries, expiry)
            BountyManager.processBountyVerifications();

            // Update defeat verification stats display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                HalloweenUI.updateDefeatVerificationStats();
            }

            // Performance optimization: Removed background 60s intervals
            // API refresh now checks on page load/navigation (event-driven)
            // Stats update interval only runs when menu is open (see HalloweenUI.toggleMenu)
            HalloweenDebug.log(2, '✅ API Mode initialized - event-driven checks active');
        }
    };

    // ===================================
    // ATTACK PAGE DETECTION MODULE
    // ===================================
    const AttackPageDetection = {
        currentDefenderId: null,
        attackTimestamp: null,

        // ===================================
        // ATTACK PAGE DETECTION
        // ===================================

        isAttackPage: function() {
            const url = window.location.href;
            return url.includes('loader.php?sid=attack') && url.includes('user2ID=');
        },

        extractDefenderId: function() {
            const url = window.location.href;
            const match = url.match(/user2ID=(\d+)/);
            return match ? match[1] : null;
        },

        // ===================================
        // SPOOKY CRITERIA CHECK
        // ===================================

        isSpookyTarget: function(defenderId) {
            if (!defenderId) return false;

            // Get last 2 digits
            const lastTwoDigits = defenderId.toString().slice(-2).padStart(2, '0');

            // Check against seed (pass full defenderId for exclusion check)
            const isTarget = SeedManager.checkTarget(lastTwoDigits, defenderId);

            if (isTarget) {
                HalloweenDebug.log(2, `HAL: 🎃 Spooky target detected: ${defenderId} (${lastTwoDigits})`);
            }

            return isTarget;
        },

        // ===================================
        // PAGE LIFECYCLE
        // ===================================

        onAttackPageLoad: function() {
            HalloweenDebug.log(1, `🎯 onAttackPageLoad() called, URL: ${window.location.href}`);
            const defenderId = this.extractDefenderId();

            HalloweenDebug.log(1, `🎯 Extracted defender ID: ${defenderId}`);
            if (!defenderId) {
                HalloweenDebug.log(3, '⚠️ Could not extract defender ID from attack page');
                return;
            }

            // Check if it's a spooky target
            if (!this.isSpookyTarget(defenderId)) {
                HalloweenDebug.log(3, `⏭️ Defender ${defenderId} is not a spooky target - ignoring`);
                return;
            }

            // Check if already counted (works for both modes - same defeats_counted array)
            const alreadyCounted = APIDefeatVerification.isAPIMode()
                ? APIDefeatVerification.isAlreadyCounted(defenderId)
                : FirebaseDefeatVerification.isAlreadyCounted(defenderId);

            if (alreadyCounted) {
                HalloweenDebug.log(2, `✅ Defender ${defenderId} already counted this competition - ignoring`);
                return;
            }

            // Store for exit tracking (still used for logging)
            this.currentDefenderId = defenderId;
            this.attackTimestamp = Math.floor(Date.now() / 1000);

            HalloweenDebug.log(1, `🎯 Attack page loaded for spooky target ${defenderId}`);

            // IMMEDIATE QUEUING: Queue verification right away (don't wait for exit)
            // This ensures we capture the attack even if navigation detection fails
            if (APIDefeatVerification.isAPIMode()) {
                HalloweenDebug.log(1, `🎯 Immediately queueing for API verification`);
                APIDefeatVerification.queueVerification(defenderId, this.attackTimestamp);
            } else {
                HalloweenDebug.log(1, `🎯 Immediately queueing for Firebase verification`);
                FirebaseDefeatVerification.addToQueue(defenderId, this.attackTimestamp);
            }

            // Log current pending queue for visibility
            if (APIDefeatVerification.isAPIMode()) {
                const queue = APIDefeatVerification.getPendingVerifications();
                HalloweenDebug.log(1, `🎯 Current pending queue: [${queue.map(q => q.defenderId).join(', ')}] (${queue.length} total)`);
            } else {
                const queue = FirebaseDefeatVerification.getVerifyQueue();
                HalloweenDebug.log(1, `🎯 Current pending queue: [${queue.map(q => q.defenderId).join(', ')}] (${queue.length} total)`);
            }

            HalloweenDebug.log(2, `🎯 Attack page loaded: Defender ${defenderId} (spooky target, queued for verification)`);
        },

        onAttackPageExit: function() {
            HalloweenDebug.log(1, `🎯 onAttackPageExit() called`);

            if (!this.currentDefenderId) {
                HalloweenDebug.log(2, `🎯 No currentDefenderId set, exit ignored`);
                return; // No spooky target to track
            }

            const exitTimestamp = Math.floor(Date.now() / 1000);
            HalloweenDebug.log(1, `🎯 Exiting attack page for defender ${this.currentDefenderId}`);
            HalloweenDebug.log(2, `👋 Exiting attack page: Updating timestamp for defender ${this.currentDefenderId}`);

            // UPDATE TIMESTAMP: The attack likely happened just before exit, so update
            // the queued timestamp to be more accurate (closer to actual attack time)
            if (APIDefeatVerification.isAPIMode()) {
                HalloweenDebug.log(1, `🎯 Updating API queue timestamp to exit time (more accurate)`);
                APIDefeatVerification.updateQueueTimestamp(this.currentDefenderId, exitTimestamp);

                // Schedule API refresh for 30s from now (survives page navigation via GM storage)
                const refreshTime = Math.floor(Date.now() / 1000) + 30;
                GM_setValue('halloween_api_next_refresh', refreshTime);
                HalloweenDebug.log(1, `🔄 Attack page exit detected - API refresh scheduled for ${new Date(refreshTime * 1000).toLocaleTimeString()}`);
            } else {
                HalloweenDebug.log(1, `🎯 Updating Firebase queue timestamp to exit time (more accurate)`);
                FirebaseDefeatVerification.updateQueueTimestamp(this.currentDefenderId, exitTimestamp);
            }

            // Clear current tracking
            this.currentDefenderId = null;
            this.attackTimestamp = null;
        },

        // ===================================
        // INITIALIZATION
        // ===================================

        init: function() {
            HalloweenDebug.log(2, '🎯 Attack Page Detection initialized');

            // Check if currently on attack page
            if (this.isAttackPage()) {
                this.onAttackPageLoad();

                // Listen for page unload
                window.addEventListener('beforeunload', () => {
                    this.onAttackPageExit();
                });

                // Listen for navigation away (modern SPAs)
                window.addEventListener('pagehide', () => {
                    this.onAttackPageExit();
                });
            }

            // Performance Optimization: MutationObserver #3 removed (2025-10-22)
            // Attack page navigation detection not needed because:
            // - Profile → Attack page = full page reload (confirmed via Network tab: "document" type)
            // - Attack page → Anywhere = full page reload (confirmed via Network tab: "document" type)
            // - Entry detection: init() runs on reload → isAttackPage() check → onAttackPageLoad() (line 18195-18196)
            // - Exit detection: beforeunload/pagehide events fire on reload → onAttackPageExit() (line 18199-18206)
            // - 30-second API scheduler: onAttackPageExit() sets GM flag → checkAttackLogRefresh() checks on next load
            // - Attack highlighting: Triggered by target detection (onTargetFound/onBountyFound), not observer
            // - Observer was watching for SPA-style navigation that never happens on attack pages
            // Eliminated ~1000+ unnecessary DOM mutation checks per page
        }
    };

    // ===================================
    // PRELOAD AUTO-IMPORT
    // ===================================
    // Auto-import preloaded config if present and no manual import has been done
    function autoImportPreloadedConfig() {
        // Check if user has done a manual import (which should override preload)
        const manualImportDone = GM_getValue('halloween_manual_import_done', false);
        if (manualImportDone) {
            return; // Manual import takes precedence
        }

        // Determine which preload to use (leader vs member)
        let preloadData = null;
        if (typeof MASTER_LEADER_KEY !== 'undefined' && preloadLeaderConfig) {
            preloadData = preloadLeaderConfig;
            HalloweenDebug.log(1, '🎃 Auto-importing preloaded leader config');
        } else if (preloadMemberConfig) {
            preloadData = preloadMemberConfig;
            HalloweenDebug.log(1, '🎃 Auto-importing preloaded member config');
        }

        if (preloadData) {
            try {
                // Use the same import logic as Arcane Rituals, but don't set manual flag
                const success = FactionConfig.importData(preloadData, true); // true = set manual import flag after first import
                if (success) {
                    HalloweenDebug.log(1, '✅ Preloaded config auto-imported successfully');
                } else {
                    HalloweenDebug.log(1, '⚠️ Failed to import preloaded config');
                }
            } catch (e) {
                HalloweenDebug.log(1, '⚠️ Failed to parse preloaded config:', e.message);
            }
        }
    }

    // Auto-import preloaded config (GM_ functions don't need platform ready)
    HalloweenDebug.log(1, 'HAL: 🎃 Running autoImportPreloadedConfig...');
    autoImportPreloadedConfig();
    console.log('HAL: ✅ autoImportPreloadedConfig complete');

    // Initialize when DOM ready - single initialization point
    // NOTE: GM_ storage functions work immediately in PDA (don't need platform ready)
    // Only HTTP handlers (in httpRequest function) need platform ready
    HalloweenDebug.log(1, 'HAL: 🎃 Checking document.readyState:', document.readyState);
    if (document.readyState === 'loading') {
        HalloweenDebug.log(1, 'HAL: ⏳ Document loading - adding DOMContentLoaded listener...');
        document.addEventListener('DOMContentLoaded', () => {
            HalloweenDebug.log(1, 'HAL: ✅ DOMContentLoaded fired - initializing systems...');
            HalloweenTargets.init();
            HalloweenCompetition.init();
            APIDefeatVerification.initialize();
            FirebaseDefeatVerification.init();
            AttackPageDetection.init();
            console.log('HAL: ✅ All systems initialized (via DOMContentLoaded)');
        });
    } else {
        HalloweenDebug.log(1, 'HAL: ✅ Document already loaded - initializing systems immediately...');
        HalloweenTargets.init();
        HalloweenCompetition.init();
        APIDefeatVerification.initialize();
        FirebaseDefeatVerification.init();
        AttackPageDetection.init();
        console.log('HAL: ✅ All systems initialized (immediate)');
    }

    // ASCII art - PDA conditional
    if (!isPDA) {
        console.log(`
  ▀█▀ █▀█ █ █▀▀ █▄▀   █▀█ █▀█   ▀█▀ █▀█ █▀▀ ▄▀█ ▀█▀
   █  █▀▄ █ █▄▄ █ █   █▄█ █▀▄    █  █▀▄ ██▄ █▀█  █

 W E A P O N S  O F  M A S S  D I S T R A C T I O N

  ═════════════════════════════════════════════════
  📸 Send screenshot to Mist or WB for bonus points
  ═════════════════════════════════════════════════
`);
    } else {
        console.log('HAL: 🎃 TRICK OR TREAT - WEAPONS OF MASS DISTRACTION');
        console.log('HAL: 📸 Send screenshot to Mist or WB for bonus points');
    }

    // Global click listener to grant audio permission on first click (for page refreshes)
    let audioPermissionGranted = false;
    document.addEventListener('click', function grantAudioPermission() {
        if (!audioPermissionGranted) {
            audioPermissionGranted = true;
            const permissionAudio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-whoosh.mp3');
            permissionAudio.volume = 0; // Completely silent (volume 0 still grants permission)
            permissionAudio.play().catch(() => {}); // Ignore errors
            HalloweenDebug.log(0, '🔊 Audio permission granted via click');
        }
    }, { once: false }); // Keep listener active to handle permission state

    // ===================================
    // GLOBAL CLEANUP SYSTEM
    // ===================================

    const HalloweenCleanup = {
        cleanup: function() {
            HalloweenDebug.log(1, '🧹 Starting global cleanup...');

            // Stop all intervals (HalloweenCompetition)
            if (typeof HalloweenCompetition !== 'undefined') {
                if (HalloweenCompetition.stopSpawnMonitoring) {
                    HalloweenCompetition.stopSpawnMonitoring();
                }
                if (HalloweenCompetition.stopCountdown) {
                    HalloweenCompetition.stopCountdown();
                }
            }

            // Stop stats update interval (HalloweenUI)
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.stopStatsUpdateInterval) {
                HalloweenUI.stopStatsUpdateInterval();
            }

            // Stop Firebase mode intervals
            if (typeof FirebaseDefeatVerification !== 'undefined') {
                if (FirebaseDefeatVerification.stopQueueProcessing) {
                    FirebaseDefeatVerification.stopQueueProcessing();
                }
                if (FirebaseDefeatVerification.stopUnverifiedRecheck) {
                    FirebaseDefeatVerification.stopUnverifiedRecheck();
                }
            }

            // Stop API mode intervals
            if (typeof APIDefeatVerification !== 'undefined') {
                if (APIDefeatVerification.stopQueueProcessing) {
                    APIDefeatVerification.stopQueueProcessing();
                }
                if (APIDefeatVerification.stopUnverifiedRecheck) {
                    APIDefeatVerification.stopUnverifiedRecheck();
                }
            }

            // Clear data structures to free memory
            if (typeof HalloweenCompetition !== 'undefined') {
                if (HalloweenCompetition.triggeredEffects) {
                    HalloweenCompetition.triggeredEffects.clear();
                }
                if (HalloweenCompetition.currentSpawns) {
                    HalloweenCompetition.currentSpawns.clear();
                }
            }

            HalloweenDebug.log(1, '✅ Global cleanup complete');
        }
    };

    // Auto-cleanup on page unload (tab close or navigation)
    window.addEventListener('beforeunload', () => {
        HalloweenCleanup.cleanup();
    });

    // Expose cleanup for manual debugging/testing
    window.halloweenCleanup = HalloweenCleanup.cleanup.bind(HalloweenCleanup);

})();