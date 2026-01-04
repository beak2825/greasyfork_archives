// ==UserScript==
// @name         Impression Zombie Buster(mod)
// @namespace    http://tampermonkey.net/
// @version      2025-10-08
// @description  Auto fire to Impression Zombies with Japanese Twitter!
// @author       Ganohr, @rmc_km
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      CC BY-SA 4.0
// @license url  https://creativecommons.org/licenses/by-sa/4.0/deed.ja
// @source page  https://ganohr.net/blog/a-monkey-soldier-who-automatically-exterminates-the-zombies-infesting-x/
// @downloadURL https://update.greasyfork.org/scripts/549888/Impression%20Zombie%20Buster%28mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549888/Impression%20Zombie%20Buster%28mod%29.meta.js
// ==/UserScript==

(function () {
    "use strict";
    setInterval(() => {
        const menuGet = (e) =>
            e.parentElement.parentElement.querySelector(
                "button[aria-haspopup='menu']"
            );
        document
            .querySelectorAll(
                "div[data-testid='Tweet-User-Avatar']:not(:has(button))"
            )
            .forEach((e) => {
                if (!menuGet(e)) {
                    return;
                }
                const button = document.createElement("button");
                button.style = "font-size:7pt;height:30pt;";
                button.textContent = "block";
                button.onclick = () => {
                    const menuButton = menuGet(e);
                    menuButton.click();
                    const i1 = setInterval(() => {
                        const blockButton = document.querySelector(
                            "div[role='menuitem'][data-testid='block']"
                        );
                        if (!blockButton) {
                            return;
                        }
                        clearInterval(i1);
                        blockButton.click();
                        const i2 = setInterval(() => {
                            const confirmButton = document.querySelector(
                                "button[data-testid='confirmationSheetConfirm']"
                            );
                            if (!confirmButton) {
                                return;
                            }
                            clearInterval(i2);
                            confirmButton.click();
                        }, 100);
                    }, 100);
                };
                e.append(button);
            });
    }, 1000);

    const urlReg =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const emojiReg =
        /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g;
    const punctuationReg =
        /[　\$\uFFE5\^\+=`~<>{}\[\]|\u3000-\u303F!-#%-\x2A,-/:;\x3F@\x5B-\x5D_\x7B}\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/g;
    const getPostedDate = (e) => {
        if (!e) {
            return new Date();
        }
        const time = e.querySelector("time[datetime]");
        return time ? new Date(time.attributes.datetime.value) : null;
    };
    const getPostedText = (e, plain = false) => {
        if (!e) {
            return null;
        }
        const tweet = e.querySelector('div[data-testid="tweetText"]');
        const plainer = (text) =>
            plain ? text : text.replace(punctuationReg, "");
        return tweet ? plainer(tweet.innerText.trim()) : null;
    };
    const getPostedAccount = (e) => {
        if (!e) {
            return null;
        }
        const account = e.querySelector(
            "div[data-testid='User-Name']>div:last-child"
        );
        return account ? account.innerText.split("\n")[0].trim() : null;
    };
    const getPostedAccountName = (e) => {
        if (!e) {
            return null;
        }
        const accountName = e.querySelector(
            "div[data-testid='User-Name'] span"
        );
        return accountName ? accountName.innerText.split("\n")[0].trim() : null;
    };
    const checkZombieCarrier = (e) => {
        const firstFoundCarrier = e.querySelector(
            "svg[aria-label='認証済みアカウント']"
        );
        const rePostingCarrier = e.querySelector(
            "div[role='link']  svg[aria-label='認証済みアカウント']"
        );
        if (
            firstFoundCarrier &&
            rePostingCarrier &&
            firstFoundCarrier !== rePostingCarrier
        ) {
            return true;
        }
        if (firstFoundCarrier && !rePostingCarrier) {
            return true;
        }
        return false;
    };
    const hasEmoji = (e) => {
        let hasEmoji = false;
        e.querySelectorAll("img[alt]").forEach((img) => {
            if (hasEmoji) {
                return;
            }
            const html = img.outerHTML;
            if (emojiReg.test(html) || /emoji/.test(html)) {
                hasEmoji = true;
            }
        });
        return hasEmoji;
    };
    const checkEmojiOnlyPost = (e) => {
        if (!e) {
            return false;
        }
        const text = getPostedText(e);
        if (text) {
            return text.replace(emojiReg, "").trim().length === 0;
        }
        return hasEmoji(e);
    };
    const checkRePostOnlyPost = (e) => {
        if (!e) {
            return false;
        }
        const text = e.innerText;
        if (/ブロックしているアカウントによるポストです。/g.test(text)) {
            return true;
        }
        if (!/引用/g.test(text)) {
            return false;
        }
        const textArray = e.innerText.split("\n");
        const NOT_FOUND = -1;
        const START_INDEX = 4;
        let searchIndex = NOT_FOUND;
        let startOffset = 0;
        textArray.forEach((line, index) => {
            if (index === 0 && line === "Block") {
                startOffset = 1;
            }
            if (searchIndex !== NOT_FOUND) {
                return;
            }
            if (line === "引用") {
                searchIndex = index;
            }
        });
        if (searchIndex === START_INDEX + startOffset) {
            return true;
        }
        let post = "";
        for (
            let index = START_INDEX + startOffset;
            index < searchIndex;
            index++
        ) {
            post += textArray[index];
        }
        return (
            post
                .replace(urlReg, "")
                .replace(emojiReg, "")
                .replace(punctuationReg, "")
                .replace(/[\s\r\n　]/g, "").length === 0
        );
    };
    const checkSpamTweet = (e) => {
        const innerText = e.innerText;
        if (/(dmm\.co\.jp|app\.link|a\.r10\.to|lin\.ee)/.test(innerText)) {
            return true;
        }

        // ドメイン検出を最初に行う（innerTextとtextの両方をチェック）
        const suspiciousDomainReg =
            /\.(?:xyz|tk|ml|ga|cf|live|site|click|top|info|biz|pw|win)(?:$|\/|[:?#])|[a-z0-9]{8,}\..*kabu.*\.xyz|news[a-z0-9]{6,}\.[a-z0-9]+\.xyz|[a-z0-9]{10,}\.[a-z0-9]+\.(?:xyz|tk|live)|[a-z0-9]{6,}\.(?:tosayo|nayoto|newekuk|yilife|liveright)\.xyz|[a-z0-9]{6,}\.fangp\.top|[a-z0-9]{6,}\.yuizoo[a-z]{2,}\.xyz/gi;

        if (suspiciousDomainReg.test(innerText)) {
            return true;
        }

        const text = getPostedText(e, true);

        // textでもドメインチェック
        if (suspiciousDomainReg.test(text)) {
            return true;
        }

        if (
            /(^| |\n|\r)(\$BEYOND|\$PARAM|\$BUBBLE|\@ricyofficial|\$RICY|\$XTER|\$COOKIE|\$BUBBLE|\$LOL|@Cookie3_com)($| |\n|\r)/gi.test(
                text
            )
        ) {
            return true;
        }
        if (
            /打扰楼主帖子|发个推广|借楼主宝|价不亏|的点击主页联系|此推特不|作任何回|([良よ](かったら|ければ))?(プロフ(ィール)?|ぷろふ)[のを]?(URL|リンク)?(から)?([き来]て|[見み]て|確認|かくにん|チェック|ちぇっく|check)|[気き]になったから(リプ|りぷ)(ライ|らい)?し|今フォローした.+?資産.+倍|ＮＵＤＥＳ\s*ＩＮ\s*ＰＲＯＦＩＬＥ|NUDES\s*IN\s*PROFILE|月超絶材料[↓⬇︎▼▽⤋⤓⇩⇊⤸]{0,3}|株主優待制度.+?(拡充|の|を).+?(発表|拡充)|来週は.?S高.?(行く|いく)|S高.?(行く|いく).?の.?かい.?？?|明日は.?(ストップ高|S高)|ストップ高.?(期待|狙い|確実|決まり|買い気配)|爆益|爆上げ|テンバガー|業績修正|決算発表.+?(ストップ高|S高)|株式分割.+?(好感|材料)|自己株式.+?取得/gi.test(
                text
            )
        ) {
            return true;
        }
        if (
            /\s*[→⇒]\s*@/g.test(text) &&
            hasEmoji(e) &&
            /(プロフ(ィール)?(URL)?から|ぷろふ(ぃーる)?(URL)から|こんにち[はわ]|こんばん[はわ]|連絡(してね?)?|絡みましょう?|絡もう?|からもう?|お?話しし?ま(しょ|せんか|よう|する)|こっち|ここ)/gi.test(
                text
            ) &&
            /よろしくね?|よろしくおねがいします|お?返事(待ってるね?|待ってます|してね?|ちょうだい|楽しみ|たのしみ|ください|下さい)/gi.test(
                text
            )
        ) {
            return true;
        }
        if (
            (/(りぷ|リプ)頂戴|お?(話|はな)しし?ましょう?|(ぷろふ(ぃー?る)?|プロフ(ィー?ル))?から([来き]て|よろしく|宜しく)|profみて|qr(コード)?を(スマホで?|すまほで)?([読よ]んでね?|読み?[こ込]んで)|♡と(ふぉろー?|フォロー)|(ふぉろー?|フォロー?)(らぶ|ラブ)?(りつ|リツ)\s*(して|で)/i.test(
                text
            ) ||
                /(おな|オナ|ｵﾅ|すか|ｽｶ|スカ|マン|ﾏﾝ|まん|パイ|ぱい|ﾊﾟｲ|チン|ﾁﾝ|ちん)凸|無修正|(スカトロ|すかとろ)|レズ(ビアン)?|([おぉオォ][なナﾅ][二に][いぃーイィ]?)|ハメ撮り|のくぱぁ欲しい人|初めての人優先でDM送ります|発情期|おな凸|R18|18以上だけだよ|依存相手募集中|[MＭSＳ][女男]|裏(アカ|あか)[男女]|写メ|おじさんすき/i.test(
                    text
                )) &&
            hasEmoji(e) &&
            text.length > "おはなししましょう🙌🙌🙌".length
        ) {
            return true;
        }
        if (
            /#pr|即現?金|即.+?円|総額.+?円|本日限定|稼[が-ご]|登録|報酬|#ad/i.test(
                text
            ) &&
            /ポイ活|tiktok\s*lite|ポイント|マイル|クーポン|GET|プレゼント|ゲット[！!しすせだ]|paypay|追加報酬|過去最高|登録/i.test(
                text
            ) &&
            text.length > 64
        ) {
            return true;
        }
        const accountName = getPostedAccountName(e);
        const spamSiteReg =
            /bokuao-antena\.antenam\.jp|kinmirainews\.com|bnc\.lt/g;
        const sensitiveNGWordReg = /オフパコ|セフレ|おかず|オカズ/g;
        const followMeReg =
            /(follow|フォロー?|ふぉろー?)しても(OK|いい|良い|大丈夫)(かな|ですか?)?/g;
        if (
            false ||
            spamSiteReg.test(text) ||
            (true &&
                (false ||
                    sensitiveNGWordReg.test(text) ||
                    sensitiveNGWordReg.test(accountName)) &&
                followMeReg.test(text)) ||
            (true &&
                followMeReg.test(text) &&
                (false || hasEmoji(e) || emojiReg.test(text)))
        ) {
            return true;
        }
        return false;
    };
    const zombieQueue = {};
    const targettingZombie = (e) => {
        const zombie = getPostedAccount(e);
        if (zombieQueue.hasOwnProperty(zombie)) {
            return;
        }
        zombieQueue[zombie] = e;
    };
    const postQueue = [];
    const NEED_POST_LENGTH = 8;
    const checkNearString = (a, b) => {
        // https://qiita.com/gomaoaji/items/603904e31f965d759293
        // https://www.k-intl.co.jp/blog/B_200729A
        // thanx KIマーケティングチーム-川村インターナショナル, @gomaoaji-Qiita
        const getToNgram = (text, n = 3) => {
            let ret = {};
            for (var m = 0; m < n; m++) {
                for (var i = 0; i < text.length - m; i++) {
                    const c = text.substring(i, i + m + 1);
                    ret[c] = ret[c] ? ret[c] + 1 : 1;
                }
            }
            return ret;
        };
        const getValuesSum = (obj) => {
            return Object.values(obj).reduce(
                (prev, current) => prev + current,
                0
            );
        };
        const calculate = (a, b) => {
            const aGram = getToNgram(a);
            const bGram = getToNgram(b);
            const keyOfAGram = Object.keys(aGram);
            const keyOfBGram = Object.keys(bGram);
            // aGramとbGramに共通するN-gramのkeyの配列
            const abKey = keyOfAGram.filter((n) => keyOfBGram.includes(n));

            // aGramとbGramの内積(0と1の掛け算のため、小さいほうの値を足し算すれば終わる。)
            let dot = abKey.reduce(
                (prev, key) => prev + Math.min(aGram[key], bGram[key]),
                0
            );

            // 長さの積(平方根の積は積の平方根)
            const abLengthMul = Math.sqrt(
                getValuesSum(aGram) * getValuesSum(bGram)
            );
            return dot / abLengthMul;
        };
        return calculate(a, b) * 100;
    };
    const checkSamePost = (text, date, e, isZombieCarrier) => {
        const postText = text.replace(emojiReg, "").toLowerCase().trim();
        if (postText.length < NEED_POST_LENGTH) {
            return false;
        }
        let isSamePost = false;
        let targetElement = null;
        const removeIndex = [];
        postQueue.forEach((post, i) => {
            const postedText = post.text;
            const postedDate = post.date;
            const postedIsCarrier = post.isCarrier;
            targetElement = post.element;
            if (isSamePost) {
                return;
            }
            if (postText != postedText) {
                if (checkNearString(postText, postedText) <= 90) {
                    return;
                }
            }
            if (date < postedDate) {
                if (
                    (postedIsCarrier && targetElement) ||
                    (!postedIsCarrier &&
                        targetElement &&
                        postedText.length >= 15)
                ) {
                    targettingZombie(targetElement);
                }
                removeIndex.push(i);
                return;
            }
            isSamePost = true;
        });
        removeIndex
            .sort()
            .reverse()
            .forEach((i) => {
                postQueue.splice(i, 1);
            });
        if (!isSamePost) {
            postQueue.push({
                text: postText,
                date: date,
                element: e,
                isCarrier: isZombieCarrier,
            });
            return false;
        }
        return targetElement;
    };
    const checkedPostQueue = {};
    const checkAlreadyCheckedPost = (post, date, account) => {
        const key = account + date;
        if (!checkedPostQueue.hasOwnProperty(key)) {
            checkedPostQueue[key] = post;
            return false;
        }
        if (checkedPostQueue[key] !== post) {
            return false;
        }
        return true;
    };
    const checkMoreReplyLoadded = () => {
        let hasMoreReplyLoadded = false;
        document
            .querySelectorAll('div[data-testid="cellInnerDiv"] h2 span')
            .forEach((e) => {
                if (hasMoreReplyLoadded) {
                    return;
                }
                if (/返信をさらに表示/.test(e.innerText)) {
                    hasMoreReplyLoadded = true;
                }
            });
        return hasMoreReplyLoadded;
    };
    const checkAndClickMoreReply = () => {
        if (checkMoreReplyLoadded()) {
            return false;
        }
        let hasMoreReply = false;
        document
            .querySelectorAll('div[data-testid="cellInnerDiv"] span')
            .forEach((e) => {
                if (hasMoreReply) {
                    return;
                }
                if (/返信をさらに表示/.test(e.innerText)) {
                    e.click();
                    hasMoreReply = true;
                } else if (/さらに返信を表示する/.test(e.innerText)) {
                    const button =
                        e.parentElement.parentElement.parentElement.querySelector(
                            "button[role='button']:has(span span)"
                        );
                    if (button) {
                        button.click();
                        hasMoreReply = true;
                    }
                }
            });
        return hasMoreReply;
    };
    const checkZombie = (e) => {
        const post = getPostedText(e);
        const date = getPostedDate(e);
        const account = getPostedAccount(e);
        if (post === null || !date) {
            return false;
        }
        if (checkAlreadyCheckedPost(post, date, account)) {
            return false;
        }
        if (postAuthor && account && postAuthor === account) {
            return false;
        }
        if (checkSpamTweet(e)) {
            return true;
        }
        if (!checkZombieCarrier(e)) {
            checkSamePost(post, date, e, false);
            return false;
        }
        return (
            false ||
            checkEmojiOnlyPost(e) ||
            checkSamePost(post, date, e, true) ||
            checkRePostOnlyPost(e)
        );
    };
    const loggingZombie = (message, e) =>
        console.log("Can't bust Zombie! " + message, e);
    const SHOOT_MODE_MENU = 1;
    const SHOOT_MODE_BLOCK = 2;
    const SHOOT_MODE_CONFIRM = 3;
    const SHOOT_WAIT = 20;
    let shootMode = SHOOT_MODE_MENU;
    let shootWait = SHOOT_WAIT;
    const initShoot = () => {
        shootMode = SHOOT_MODE_MENU;
        shootWait = SHOOT_WAIT;
    };
    const removeZombieFromQueue = (zombie) => {
        delete zombieQueue[zombie];
        initShoot();
    };
    const LS_KEY_KILLED_ZOMBIE = "ganohrs_izb_killed";
    const getKilledZombieCount = () => {
        const num = Number(localStorage.getItem(LS_KEY_KILLED_ZOMBIE));
        if (Number.isNaN(num)) {
            return 0;
        }
        return num;
    };
    const LS_KEY_KILLED_LIST = "ganohrs_izb_list";
    const getKilledZombieList = () => {
        const csv = localStorage.getItem(LS_KEY_KILLED_LIST);
        if (!csv) {
            return [];
        }
        return csv.split(",");
    };
    const killedZombie = (zombie) => {
        const count = getKilledZombieCount() + 1;
        localStorage.setItem(LS_KEY_KILLED_ZOMBIE, count);
        const list = getKilledZombieList();
        list.push(zombie);
        localStorage.setItem(LS_KEY_KILLED_LIST, list);
        return count;
    };
    const shootZombie = () => {
        const entries = Object.entries(zombieQueue);
        if (!entries || entries.length === 0) {
            return;
        }
        const zombie = entries[0][0];
        const e = entries[0][1];
        const post = getPostedText(e, true);
        const date = getPostedDate(e);

        shootWait--;
        if (shootWait <= 0) {
            loggingZombie(
                "Can't bust Zombie! zombie named: [" +
                    zombie +
                    "], mode = " +
                    shootMode,
                e
            );
            removeZombieFromQueue(zombie);
            return;
        }
        const fireZombie = (nextMode, needRemove, e) => {
            if (e) {
                e.click();
                shootWait = SHOOT_WAIT;
                shootMode = nextMode;
                if (needRemove) {
                    removeZombieFromQueue(zombie);
                }
            }
        };

        switch (shootMode) {
            case SHOOT_MODE_MENU: {
                fireZombie(
                    SHOOT_MODE_BLOCK,
                    false,
                    e.querySelector(
                        'button[aria-expanded="false"][aria-haspopup="menu"][aria-label="もっと見る"]'
                    )
                );
                return;
            }
            case SHOOT_MODE_BLOCK: {
                const topMenuItem = document.querySelector(
                    "div[data-testid='Dropdown'] div[role='menuitem']"
                );
                if (!topMenuItem) {
                    return;
                }
                if (/さんのフォローを解除$/.test(topMenuItem.innerText)) {
                    debugger;
                    e.querySelector(
                        'div[aria-expanded="true"][aria-haspopup="menu"][aria-label="もっと見る"]'
                    ).click();
                    removeZombieFromQueue(zombie);
                    shootMode = SHOOT_MODE_MENU;
                    return;
                }
                fireZombie(
                    SHOOT_MODE_CONFIRM,
                    false,
                    document.querySelector(
                        'div[role="menuitem"][data-testid="block"]'
                    )
                );
                return;
            }
            case SHOOT_MODE_CONFIRM: {
                fireZombie(
                    SHOOT_MODE_MENU,
                    true,
                    document.querySelector(
                        'button[role="button"][data-testid="confirmationSheetConfirm"]'
                    )
                );
                const killedZombieCount = killedZombie(zombie);
                console.log(
                    "killed zombie named: [" +
                        zombie +
                        "], total: " +
                        killedZombieCount
                );
                console.log(
                    "\tpost is : [" +
                        post +
                        "], datetime : [" +
                        date.toLocaleString() +
                        "]"
                );
                return;
            }
            default: {
                removeZombieFromQueue(zombie);
                return;
            }
        }
    };
    let postAuthor = "";
    let nowLocation = location.href;
    const clearProperties = (o) => {
        Object.keys(o).forEach((k) => {
            delete o[k];
        });
    };
    const needSkip = () =>
        /\/(home|notifications|explore|messages|lists)/.test(nowLocation);
    const isEndOfTimeLine = () => {
        let foundMore = false;
        document
            .querySelectorAll("div[data-testid='cellInnerDiv']")
            .forEach((e) => {
                if (foundMore && e.clientHeight > 0) {
                    return;
                }
                if (
                    /もっと見つける/.test(e.innerText) &&
                    /Xから/.test(e.innerText)
                ) {
                    foundMore = true;
                }
            });
        return foundMore;
    };
    let loadingMoreReply = false;
    const cooldown = () => {
        nowLocation = location.href;
        clearProperties(zombieQueue);
        clearProperties(postQueue);
        postAuthor = "";
        loadingMoreReply = false;
        initShoot();
    };
    const searchZombie = () => {
        if (nowLocation !== location.href) {
            cooldown();
        }
        if (needSkip()) {
            return;
        }
        if (loadingMoreReply) {
            if (checkMoreReplyLoadded()) {
                loadingMoreReply = false;
            }
        } else if (checkAndClickMoreReply()) {
            loadingMoreReply = true;
            return;
        }
        document
            .querySelectorAll(
                "article[data-testid='tweet'] div[aria-labelledby][id^='id'] button.redblock-btn" +
                    ", article[data-testid='tweet']:has(button.redblock-btn):has(div[data-testid='tweetPhoto']) button.redblock-btn" +
                    ", article[data-testid='tweet']:has(button.redblock-btn):has(div[data-testid^='card']) button.redblock-btn" +
                    ", article[data-testid='tweet']:has(article .r-x572qd) button.redblock-btn"
                // + ", article[data-testid='tweet']:has(button.redblock-btn):has(img[src^='https://abs-0.twimg.com/emoji/v2/svg/']) button.redblock-btn"
                // + ", article[data-testid='tweet']:has(button.redblock-btn):has(svg[aria-label='認証済みアカウント']) button.redblock-btn"
            )
            .forEach((e) => {
                e.style.display = "block";
            });
        document.querySelectorAll("time[datetime]").forEach((t) => {
            t.innerText = new Date(new Date(t.dateTime) * 1 + 9 * 3600 * 1000)
                .toISOString()
                .substring(2, 16)
                .replace(/T/, " ");
        });

        if (isEndOfTimeLine()) {
            return;
        }
        document
            .querySelectorAll("article[data-testid='tweet']")
            .forEach((e) => {
                postAuthor = getPostedAccount(document);
                if (checkZombie(e)) {
                    targettingZombie(e);
                }
            });
    };
    cooldown();
    setInterval(shootZombie, 50);
    setInterval(searchZombie, 1000);
})();
