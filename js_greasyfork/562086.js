// ==UserScript==
// @name         💎 #1 Duolingo Cheat - DuoUltimate 💎 FASTEST XP FARMING, FREE SUPER TRIAL, DUO MAX
// @namespace    http://tampermonkey.net/
// @version      v1.0.1
// @description  duolingo cheat, duolingo hack, duolingo pro, duohacker, duolingo farming tool
// @author       Freepentests
// @match        *://*.duolingo.com/*
// @match        *://*.duolingo.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/562086/%F0%9F%92%8E%201%20Duolingo%20Cheat%20-%20DuoUltimate%20%F0%9F%92%8E%20FASTEST%20XP%20FARMING%2C%20FREE%20SUPER%20TRIAL%2C%20DUO%20MAX.user.js
// @updateURL https://update.greasyfork.org/scripts/562086/%F0%9F%92%8E%201%20Duolingo%20Cheat%20-%20DuoUltimate%20%F0%9F%92%8E%20FASTEST%20XP%20FARMING%2C%20FREE%20SUPER%20TRIAL%2C%20DUO%20MAX.meta.js
// ==/UserScript==

const jwtToken = document.cookie.split('jwt_token=')[1].split(';')[0];
const sub = JSON.parse(atob(jwtToken.split('.')[1])).sub;
const versionNumber = 'v1';

// the @require directive doesn't work for some reason, so I'm using a custom function to import libraries

const importLib = async (url) => {
    const resp = await fetch(url);
    const text = await resp.text();
    eval(text);
};

importLib('https://cdn.jsdelivr.net/npm/sweetalert2@11');

class ApiInterception { // this is the class for intercepting fetch requests, used for modifying requests and responses to disable or modify certain functionality of the duolingo app
    constructor() {
        this.easyMode = unsafeWindow.localStorage.easyModeEnabled === 'y';
        this.duoMax = unsafeWindow.localStorage.maxEnabled === 'y';

        unsafeWindow.originalFetchFunction = unsafeWindow.fetch;
        unsafeWindow.fetch = this.customFetchFunction.bind(this);

        // automatically refresh the tab if you get a normal question on easy mode
        /*
        setInterval(() => {
            if (this.easyMode && (unsafeWindow.location.pathname === '/lesson' || unsafeWindow.location.pathname === '/practice')) {
                if (document.getElementsByClassName('_3EOK0')[0].children[0].innerText !== 'Select the correct meaning') {
                    unsafeWindow.location.reload();
                };

                if (document.getElementsByClassName('_20npu')[0].innerText !== 'What is the best way to get XP on Duolingo?') {
                    unsafeWindow.location.reload();
                };
            };
        }, 2000);
        */
    };

    customFetchFunction(resource, options) {
        const url = resource instanceof Request ? resource.url : resource;

        if (/https?:\/\/(?:[a-zA-Z0-9-]+\.)?duolingo\.[a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?\/\d{4}-\d{2}-\d{2}\/users\/.+/.test(url) && unsafeWindow.localStorage.maxEnabled === 'y') { // credits to apersongithub for the regex pattern
            return unsafeWindow.originalFetchFunction(url, options).then(async (response) => {
                const clonedResponse = response.clone();
                const clonedRespText = await clonedResponse.text();
                const clonedRespJson = JSON.parse(clonedRespText);

                clonedRespJson.shopItems = {
                    gold_subscription: {
                        itemName: "gold_subscription",
                        subscriptionInfo: {
                            vendor: "STRIPE",
                            renewing: true,
                            isFamilyPlan: true,
                            expectedExpiration: 9999999999000
                        }
                    }
                }

                const modified = JSON.stringify(clonedRespJson);

                return new Response(modified, { status: response.status, statusText: response.statusText, headers: response.headers });
            });
        };
        if (url.endsWith('2023-05-23/sessions') && unsafeWindow.localStorage.easyModeEnabled === 'y') { // this code was copied from my previous script, it is called duolingo lesson solver and XP earner
            return unsafeWindow.originalFetchFunction(url, options).then(async (response) => {
                let numOfQuestions = 1;

                const clonedResponse = response.clone();
                const clonedRespText = await clonedResponse.text();
                const clonedRespJson = JSON.parse(clonedRespText);

                if (clonedRespJson.type.startsWith('LEGENDARY')) {
                    numOfQuestions = 2; // legendaries require at least 2 questions
                };

                const challengePayload = {"character":{"url":"https://d2pur3iezf4d1j.cloudfront.net/images/51d3bded9ecbd8bf6e9869041c437ba9","image":{"pdf":"https://d2pur3iezf4d1j.cloudfront.net/images/51d3bded9ecbd8bf6e9869041c437ba9","svg":"https://d2pur3iezf4d1j.cloudfront.net/images/0f284113af41f7f7296263183701a13b"},"gender":"MALE","correctAnimation":"https://simg-ssl.duolingo.com/lottie/Falstaff_CORRECT_Cropped_NotBad.json","incorrectAnimation":"https://simg-ssl.duolingo.com/lottie/Bear_INCORRECT_Cropped.json","idleAnimation":"https://simg-ssl.duolingo.com/lottie/Falstaff_IDLE_Cropped.json","name":"FALSTAFF","avatarIconImage":{"pdf":"https://simg-ssl.duolingo.com/world-characters/avatars/falstaff_avatar_icon.pdf","svg":"https://simg-ssl.duolingo.com/world-characters/avatars/falstaff_avatar_icon.svg"}},"prompt":"What is the best way to get XP on Duolingo?","correctIndex":0,"options":[{"text":"By using this script ✅💎💎💎"},{"text":"By doing lessons yourself 😴😴😴"}],"type":"assist","metadata":{"challenge_construction_insights":{"birdbrain_probability":0.98932004,"birdbrain_source":"birdbrain_v2","content_length":7,"best_solution":"THIS CHEAT","is_adaptive":false,"cefr_level":"CEFR_A1","cefr_subsection":"A1.0","tagged_kc_ids":["d34dd0c4df69ca91b277730638b12a4a"],"teaching_kc_ids":["d34dd0c4df69ca91b277730638b12a4a"],"content_versions":[]},"highlight":[],"learning_language":"es","other_options":["By doing lessons yourself 😴😴😴"],"solution_key":"d34dd0c4df69ca91b277730638b12a4a","translation":"By using this script ✅💎💎💎","ui_language":"en","word":"What is the best way to get XP on Duolingo?","language":"es","type":"assist","content_versions":[],"lexeme_ids_to_update":["d34dd0c4df69ca91b277730638b12a4a"],"specific_type":"assist","lexemes_to_update":["d34dd0c4df69ca91b277730638b12a4a"],"generic_lexeme_map":{},"num_comments":0,"from_language":"en","skill_tree_id":"209338530709d160ba0049addfd664ee"},"newWords":[],"progressUpdates":[],"challengeGeneratorIdentifier":{"specificType":"assist","generatorId":"d34dd0c4df69ca91b277730638b12a4a"}};
                clonedRespJson.challenges = Array(numOfQuestions).fill(challengePayload);

                const modified = JSON.stringify(clonedRespJson);

                console.log(new Response(modified, { status: response.status, statusText: response.statusText, headers: response.headers }));
                return new Response(modified, { status: response.status, statusText: response.statusText, headers: response.headers });
            });
        };

        return unsafeWindow.originalFetchFunction(url, options);
    };
};

const apiInterception = new ApiInterception();

class Cheats {
    constructor(jwt, sub) {
        this.jwt = jwt;
        this.sub = sub;
    };

    farmGemOnce() {
        fetch("https://www.duolingo.com/2023-05-23/users/" + this.sub + "/rewards/SKILL_COMPLETION_BALANCED-dd2495f4_d44e_3fc3_8ac8_94e2191506f0-2-GEMS", {
            "headers": {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.jwt
            },
            "body": JSON.stringify({consumed:true}),
            "method": "PATCH"
        });
    };

    farmXpOnce() {
        fetch("https://stories.duolingo.com/api2/stories/fr-en-le-passeport/complete", {
            "headers": {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.jwt
            },
            "body": JSON.stringify({
                awardXp: true,
                completedBonusChallenge: true,
                fromLanguage: "en",
                learningLanguage: "fr",
                isFeaturedStoryInPracticeHub: true,
                isLegendaryMode: true,
                masterVersion: true,
                maxScore: 0,
                score: 0,
                happyHourBonusXp: 469,
                startTime: Math.floor(Date.now() / 1000),
                endTime: Math.floor(Date.now() / 1000)
            }),
            "method": "POST"
        });
    };

    async getSuperTrial() {
        const resp = await fetch("https://www.duolingo.com/2017-06-30/users/" + this.sub + "/shop-items", {
            "headers": {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.jwt
            },
            "body": JSON.stringify({itemName:"immersive_subscription",productId:"com.duolingo.immersive_free_trial_subscription"}),
            "method": "POST",
        });

        if (resp.status == 400) {
            console.log('asdf');
            return false;
        } else {
            return true;
        };
    };

    getFreeItem(itemId) {
        fetch("https://www.duolingo.com/2017-06-30/users/" + this.sub + "/shop-items", {
            "headers": {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.jwt
            },
            "body": "{\"itemName\":\"" + itemId + "\",\"isFree\":true,\"consumed\":true}",
            "method": "POST",
            "mode": "cors"
        });
    };
};

class Farmer {
    constructor() {
        this.farmingXp = false;
        this.farmingGems = false;
        this.cheats = new Cheats(jwtToken, sub);

        this.initDashboard();

        this.setupFarmIntervals();
    };

    setupFarmIntervals() {
        setInterval(() => {
            if (this.farmingGems) {
                this.cheats.farmGemOnce();
            };
        }, 300);

        setInterval(() => {
            if (this.farmingXp) {
                this.cheats.farmXpOnce();
            };
        }, 400);
    };

    toggleGemFarm() {
        this.farmingGems = !this.farmingGems;

        if (!this.farmingGems) {
            document.getElementById('startGemFarm').innerText = 'Start Farming Gems (30gems/0.3sec)';
        } else {
            document.getElementById('startGemFarm').innerText = 'Stop Farming Gems (30gems/0.3sec)';
        };

        Swal.fire({
            title: (this.farmingGems) ? 'Started Gem Farm' : 'Stopped Gem Farm',
            icon: 'success'
        });
    };

    toggleXpFarm() {
        this.farmingXp = !this.farmingXp;

        if (!this.farmingXp) {
            document.getElementById('startXpFarm').innerText = 'Start Farming XP (499xp/0.4sec)';
        } else {
            document.getElementById('startXpFarm').innerText = 'Stop Farming XP (499xp/0.4sec)';
        };

        Swal.fire({
            title: (this.farmingXp) ? 'Started XP Farm' : 'Stopped XP Farm',
            icon: 'success'
        });
    };

    toggleEasyMode() {
        if (localStorage.easyModeEnabled === 'y') {
            localStorage.easyModeEnabled = 'n';
        } else {
            localStorage.easyModeEnabled = 'y';
        };

         Swal.fire({
            title: (localStorage.easyModeEnabled === 'y') ? 'Enabled Easy Mode' : 'Disabled Easy Mode',
            icon: 'success'
        });

        document.getElementById('enableEasyMode').innerText = (unsafeWindow.localStorage.easyModeEnabled === 'y') ? 'Disable Easy Mode' : 'Enable Easy Mode';
    };

    toggleDuoMax() {
        if (localStorage.maxEnabled === 'y') {
            localStorage.maxEnabled = 'n';
        } else {
            localStorage.maxEnabled = 'y';
        };

         Swal.fire({
            title: (localStorage.maxEnabled === 'y') ? 'Enabled Max' : 'Disabled Max',
            icon: 'success'
        });

        document.getElementById('enableDuoMax').innerText = (unsafeWindow.localStorage.maxEnabled === 'y') ? 'Disable Duolingo Max' : 'Enable Duolingo Max';
    };

    async getSuperTrial() {
        const resp = await this.cheats.getSuperTrial();
        console.log(await resp);

        Swal.fire({
            title: (resp) ? 'Successfully Redeemed Super' : 'Super Activation Failed',
            icon: (resp) ? 'success' : 'error'
        });
    };

    async createFreeShop() {
        const resp = await fetch("https://www.duolingo.com/2023-05-23/shop-items", {
            "headers": {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            },
            "method": "GET",
        });

        const json = await resp.json();

        json.shopItems.forEach((item) => {
            if (!item.id.startsWith('premium') && !item.id.endsWith('gift')) {
                const element = document.createElement('button');
                element.innerText = 'Get ' + item.id;
                element.addEventListener('click', () => {
                    this.cheats.getFreeItem(item.id);
                    Swal.fire({
                        title: 'Got',
                        icon: 'success'
                    });
                });
                document.getElementById('freeShopItems').appendChild(element);

                document.getElementById('freeShopItems').appendChild(document.createElement('br'));
            };
        });
    };

    initDashboard() {
        document.title = 'DuoUltimate Dashboard';

        document.body.innerHTML = `
        <center>
        <img src="data:image/png;base64,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" height="100" width="100" draggable="false">
        <h1 class="main-heading">DuoUltimate ${versionNumber}</h1>
        <p>Join the <a href="https://discord.gg/VU8t67TBKs" target="_blank">Discord server</a> if you like this script.</p>
        <div class="gui">
            <h2>Farming</h2>
            <button id="startGemFarm">Start Farming Gems (30gems/0.3sec)</button>
            <button id="startXpFarm">Start Farming XP (499xp/0.4sec)</button>
            <button id="getSuperTrial">Get 3 Day Super Trial</button>
            <br><br>
            <h5>The 3 day super trial might not work if you've redeemed it many times in the past.</h6>
            <hr>
            <h2>Extra tools</h2>
            <button id="enableEasyMode">Enable Easy Mode</button>
            <button id="enableDuoMax">Enable Duolingo Max</button>
            <br><br>
            <h5>Easy mode makes it easy for you to complete lessons, practices, and legendaries without doing any work at all.</h6>
            <h5>Easy mode is very buggy. If you receive normal lessons, just refresh the lesson.</h5>
            <hr>
            <h2>Free shop</h2>
            <h5>A lot of these items are no longer available, hence they do nothing. If you look for items you know are available, then you can get these for free here.</h5>
            <h5>For a health refill, get health_refill. For a streak freeze, get streak_freeze or streak_freeze_society. For an XP boost, get general_xp_boost.</h1>
            <br><br>
            <div id="freeShopItems"></div>
        </div>
        </center>
        `;

        const style = document.createElement('style');
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Comic+Relief:wght@400;700&display=swap');

        :root {
            --color-primary: #180B26;
            --color-secondary: #32174D;
            --color-tertiary: #4B2374;
            --color-quaternary: #652E9C;
            --color-quinary: #7E3AC3; // i had to look up the word quinary
        }

        body {
            background: var(--color-primary);
            color: var(--color-quinary);
            font-family: 'Comic Relief', 'Arial', sans-serif !important;
            user-select: none;
        }

        a {
            color: var(--color-quinary);
            font-weight: 900;
        }

        h5 {
            margin-bottom: 0;
            margin-top: 0
        }

        hr {
            margin-bottom: 25px;
            margin-top: 25px;
        }

        img {
            border-radius: 25px;
            border: 5px solid var(--color-secondary);
        }

        button {
            padding: 10px;
            border-radius: 100px;
            border: 5px solid var(--color-tertiary);
            background-color: var(--color-secondary);
            color: var(--color-quinary);
            font-weight: 900;
            cursor: pointer;
            transition: 1s;
        }

        button:hover {
            transform: translateY(-10px);
            background-color: var(--color-primary);
        }

        button:active {
            transition: 0s;
            background-color: var(--color-secondary);
        }

        .main-heading {
            font-size: 40px;
        }

        .gui {
            border: 5px solid var(--color-tertiary);
            border-radius: 25px;
            width: 75%;
            overflow: scroll;
            height: 75%;
            padding: 25px;
        }

        .swal2-popup {
            background-color: var(--color-secondary);
            color: var(--color-quinary);
        }
        `;
        document.head.appendChild(style);

        document.getElementById('enableEasyMode').innerText = (unsafeWindow.localStorage.easyModeEnabled === 'y') ? 'Disable Easy Mode' : 'Enable Easy Mode';
        document.getElementById('enableDuoMax').innerText = (unsafeWindow.localStorage.maxEnabled === 'y') ? 'Disable Duolingo Max' : 'Enable Duolingo Max';

        document.getElementById('startGemFarm').addEventListener('click', this.toggleGemFarm.bind(this));
        document.getElementById('startXpFarm').addEventListener('click', this.toggleXpFarm.bind(this));
        document.getElementById('getSuperTrial').addEventListener('click', this.getSuperTrial.bind(this));

        document.getElementById('enableEasyMode').addEventListener('click', this.toggleEasyMode.bind(this));
        document.getElementById('enableDuoMax').addEventListener('click', this.toggleDuoMax.bind(this));

        this.createFreeShop();
    };
};

if (unsafeWindow.location.pathname === '/errors/farmDashboard') {
    //alert('This script will not work unless you join the Discord server first.\n\nURL: https://discord.gg/VU8t67TBKs');
    const farmer = new Farmer();
} else {
const antiBan = async () => {
        // this function temporarily locks the user out of their account so that they don't get banned. the user will be able to get back into their account at any time they want.
        const jwt = document.cookie.split('jwt_token=')[1].split(';')[0];
        const jwtPayload = JSON.parse(atob(jwt.split('.')[1]));
        const sub = jwtPayload.sub;
 
        const randUser = crypto.randomUUID().split('-')[0];
        const randEmail = randUser + '@sharklasers.com';
        const randName = 'wuefabwrabc ' + randUser;
 
        const resp = await fetch("https://www.duolingo.com/2023-05-23/users/" + sub + "?fields=email,name", {
            "credentials": "include",
            "headers": {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": "Bearer " + jwt,
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "referrer": "https://www.duolingo.com/settings/profile",
            "body": "{\"email\" : \"" + randEmail + "\", \"name\" : \"" + randName + "\"}",
            "method": "PATCH",
            "mode": "cors"
        });
 
        await fetch("https://www.duolingo.com/2023-05-23/users/" + sub + "?fields=email,googleId,hasGoogleId,name,trackingProperties", {
            "credentials": "include",
            "headers": {
                "User-Agent": navigator.userAgent,
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": "Bearer " + jwt,
            },
            "referrer": "https://www.duolingo.com/settings/social",
            "body": "{\"signal\":null,\"googleToken\":null}",
            "method": "PATCH",
            "mode": "cors"
        });
 
        for (let key of Object.keys(localStorage)) {
            localStorage[key] = '';
        };
 
        await fetch("https://www.duolingo.com/logout", {
            "credentials": "include",
            "headers": {
                "User-Agent": navigator.userAgent,
                "Authorization": "Bearer " + jwt
            },
            "referrer": "https://www.duolingo.com/learn",
            "method": "POST",
            "mode": "cors"
        });
 
        window.location.reload();
    };
antiBan();
    const openDashboardButton = document.createElement('button');
    openDashboardButton.style = 'z-index:9999999;position:fixed;bottom:0;left:0;font-size:25px;padding:25px;cursor:pointer;';
    openDashboardButton.innerText = 'Open DuoUltimate Dashboard';
    openDashboardButton.addEventListener('click', () => {
        window.open('/errors/farmDashboard');
    });

    // we gotta wait for document.body to load first
    let openDashboardInterval = setInterval(() => {
        try {
            document.body.appendChild(openDashboardButton);
            clearInterval(openDashboardInterval);
        } catch(e) {
            ;
        };
    }, 1000);
};
