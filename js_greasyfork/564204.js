// ==UserScript==
// @name         みんなのきょげち（独り言・統計・多機嫌バリエーション版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ピクトセンスの画面上に「きょげち」を召喚します。独り言を呟いたり、お世話の統計を記録したりします。
// @author       YourName
// @match        https://pictsense.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564204/%E3%81%BF%E3%82%93%E3%81%AA%E3%81%AE%E3%81%8D%E3%82%87%E3%81%92%E3%81%A1%EF%BC%88%E7%8B%AC%E3%82%8A%E8%A8%80%E3%83%BB%E7%B5%B1%E8%A8%88%E3%83%BB%E5%A4%9A%E6%A9%9F%E5%AB%8C%E3%83%90%E3%83%AA%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564204/%E3%81%BF%E3%82%93%E3%81%AA%E3%81%AE%E3%81%8D%E3%82%87%E3%81%92%E3%81%A1%EF%BC%88%E7%8B%AC%E3%82%8A%E8%A8%80%E3%83%BB%E7%B5%B1%E8%A8%88%E3%83%BB%E5%A4%9A%E6%A9%9F%E5%AB%8C%E3%83%90%E3%83%AA%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // データの保存キー
    const STORAGE_KEY = "shared_pet_kyogechi";
    const STATS_KEY = "kyogechi_stats";

    // ペットの初期状態と統計データ
    let pet = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { name: "きょげち", hunger: 50, mood: 50, health: 100 };
    let stats = JSON.parse(localStorage.getItem(STATS_KEY)) || { feed: 0, pet: 0, praise: 0, toy: 0, hit: 0, heal: 0 };

    const savePet = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        updateUI();
    };

    const handleAction = (type) => {
        let pool = [];
        let effect = () => {};

        if (type === 'feed') {
            stats.feed++;
            if (pet.hunger >= 100) {
                pool = ["きょげち にエサを差し出した！しかしお腹がいっぱいのようで、静かにそれを見つめている。"];
            } else if (pet.hunger <= 30) {
                pool = ["きょげち にエサを投げた！猛烈な勢いでがっつき、一瞬で完食してしまった！"];
                effect = () => pet.hunger = Math.min(100, pet.hunger + 15);
            } else {
                pool = [
                    "きょげち に美味しそうなエサをあげた！もぐもぐしている。",
                    "きょげち の前にお皿を置いた！満足そうに食べ始めた。",
                    "きょげち は差し出されたエサを器用に掴んで、幸せそうに頬張っている。"
                ];
                effect = () => pet.hunger = Math.min(100, pet.hunger + 10);
            }
        } 
        else if (type === 'pet') {
            stats.pet++;
            if (pet.mood >= 90) {
                pool = [
                    "きょげち をなでた！うっとりと蕩けるような表情で、あなたの手に全体重を預けてきた！",
                    "きょげち をなでた！あまりの気持ちよさに、きょげち はふにゃふにゃになっている。",
                    "きょげち をなでた！これ以上ないというほどの笑顔を見せている！"
                ];
                effect = () => pet.mood = Math.min(100, pet.mood + 10);
            } else if (pet.mood < 30) {
                pool = ["きょげち をなでようとしたが、ぷいっと横を向かれて拒否されてしまった…"];
                effect = () => pet.mood = Math.max(0, pet.mood - 2);
            } else {
                pool = [
                    "きょげち の頭をなでた！うれしそうに目を細めた。",
                    "きょげち を優しくなでた！うれしそうに鳴いている！",
                    "きょげち をなでた。喉があるのかは不明だが、ゴロゴロと音が聞こえる気がする。"
                ];
                effect = () => pet.mood = Math.min(100, pet.mood + 5);
            }
        }
        else if (type === 'praise') {
            stats.praise++;
            if (pet.mood <= 20) {
                pool = ["きょげち を褒めたが、今はそんな気分ではないようだ。完全に無視されている…"];
            } else if (pet.mood > 80) {
                pool = [
                    "きょげち を褒めちぎった！きょげち は天にも昇る心地で舞い踊っている！",
                    "きょげち を全力で褒めた！あまりの嬉しさに、きょげち は発光しそうな勢いだ！",
                    "きょげち を褒めた！「もっと言って」と言わんばかりに胸を張っている！"
                ];
                effect = () => pet.mood = Math.min(100, pet.mood + 10);
            } else {
                pool = [
                    "きょげち に「可愛いね」と言った！調子に乗って踊り出した！",
                    "きょげち を全力で褒めちぎった！きょげち はドヤ顔をしている。",
                    "きょげち を褒めた。照れているのか、もじもじと足元を見つめている。"
                ];
                effect = () => pet.mood = Math.min(100, pet.mood + 5);
            }
        }
        else if (type === 'toy') {
            stats.toy++;
            pool = [
                "きょげち の前に新しい玩具を置いた！興味津々で遊び始めた。",
                "きょげち と玩具で遊んだ！きょげち は楽しそうに跳ね回っている！",
                "きょげち に玩具を投げた！必死に追いかけて、満足げに戻ってきた。"
            ];
            effect = () => pet.mood = Math.min(100, pet.mood + 15);
        }
        else if (type === 'hit') {
            stats.hit++;
            if (pet.health <= 30) {
                pool = ["きょげち を殴ろうとした！しかし きょげち はガタガタと震え、怯えながら距離を置いてこちらを見ている…"];
                effect = () => pet.mood = Math.max(0, pet.mood - 5);
            } else {
                pool = ["きょげち を叩いた！痛みに耐えている…", "きょげち に蹴った！きょげち はボロボロだ…", "きょげち を強く怒鳴りつけた！きょげち は涙を浮かべている。"];
                effect = () => { pet.mood = Math.max(0, pet.mood - 20); pet.health = Math.max(0, pet.health - 10); };
            }
        }
        else if (type === 'heal') {
            stats.heal++;
            pool = ["きょげち に苦い薬を飲ませた！少し顔色が良くなったようだ。", "きょげち に苦い薬を飲ませた！きょげち は苦そうにしている"];
            effect = () => { pet.health = Math.min(100, pet.health + 20); pet.mood = Math.max(0, pet.mood - 10); };
        }
        else if (type === 'observe') {
            if (pet.health < 30) pool = ["きょげち は顔色が悪い…ぐったりとして動かない。"];
            else if (pet.hunger < 20) pool = ["きょげち はお腹が空きすぎて、あなたの指を食べ物だと思っているようだ。"];
            else if (pet.mood > 80) pool = [
                "きょげち は最高に上機嫌だ！尻尾があれば振っていそうな勢いだ。",
                "きょげち はるんるん気分でステップを踏んでいる。",
                "きょげち はキラキラした瞳でこちらを注視している。"
            ];
            else if (pet.mood < 20) pool = ["きょげち は何かに腹を立てている。近寄りがたい雰囲気だ。"];
            else pool = [
                "きょげち はのんびりとしている。平和な時間が流れている。",
                "きょげち は何をするでもなく、部屋の隅を眺めている。",
                "きょげち はあくびをして、リラックスした様子だ。"
            ];
        }

        const msg = pool[Math.floor(Math.random() * pool.length)];
        effect();
        return msg;
    };

    // --- 独り言システム（5分ごとに10%の確率） ---
    setInterval(() => {
        if (Math.random() < 0.1) {
            let monologue = "";
            if (pet.hunger < 20) {
                monologue = "きょげち はお腹を空かせて、床を舐めようとしている…";
            } else if (pet.health < 40) {
                monologue = "きょげち は苦しそうに、小さな声で鳴いている…";
            } else if (pet.mood < 20) {
                monologue = "きょげち は地面に「の」の字を書いていじけている。";
            } else {
                const normalPool = [
                    "きょげち はぼーっとキャンバスの方を眺めている。",
                    "きょげち はご機嫌に鼻歌を歌っている！",
                    "きょげち が膝をつんつんしてきた。",
                    "きょげち は自分の影を追いかけて、くるくる回っている。",
                    "きょげち は虚空を見つめて、何かに頷いている…",
                    "きょげち はあなたの袖を甘噛みしている。",
                    "きょげち はふあぁ…と大きなあくびをした。",
                    "きょげち は楽しそうに小刻みに震えている。",
                    "きょげち は部屋の隅で丸まって、うとうとしている。",
                    "きょげち はキャンバスの裏に隠れて、こちらを覗いている。",
                    "きょげち は満足げな顔で、自分の体をぺろぺろと整えている。",
                    "きょげち は一瞬、人間のような言葉を呟いた気がするが…気のせいだろう。",
                    "きょげち は小さな石ころを宝物のように抱えている。",
                    "きょげち はあなたの足元に、どこから持ってきたのか分からない「謎の木の実」を置いた。"
                ];
                monologue = normalPool[Math.floor(Math.random() * normalPool.length)];
            }
            sendChat(monologue);
        }
    }, 300000);

    // --- UI作成 ---
    const container = document.createElement("div");
    container.id = "petChatUI";
    container.style.cssText = "display:block; position:fixed; top:120px; right:10px; z-index:9999; background:#222; padding:0; border-radius:10px; color:#fff; font-family:sans-serif; width:220px; border:1px solid #444; box-shadow: 0 4px 15px rgba(0,0,0,0.5); user-select:none;";

    container.innerHTML = `
        <div id="dragHeaderPet" style="background:#333; padding:8px; border-top-left-radius:10px; border-top-right-radius:10px; cursor:move; font-size:11px; color:#888; text-align:center; border-bottom:1px solid #444;">きょげち操作（ドラッグ可）</div>
        <div style="padding:15px;">
            <div style="margin-bottom:15px; background:#111; padding:10px; border-radius:5px; border:1px solid #333;">
                <div style="font-size:11px; margin-bottom:3px; color:#aaa;">HUNGER <span id="val_hunger" style="color:#ffcc00; float:right;">${pet.hunger}</span></div>
                <div style="width:100%; height:4px; background:#444; border-radius:2px; overflow:hidden; margin-bottom:8px;"><div id="bar_hunger" style="width:${pet.hunger}%; height:100%; background:#ffcc00; transition:0.3s;"></div></div>
                <div style="font-size:11px; margin-bottom:3px; color:#aaa;">MOOD <span id="val_mood" style="color:#00ffcc; float:right;">${pet.mood}</span></div>
                <div style="width:100%; height:4px; background:#444; border-radius:2px; overflow:hidden; margin-bottom:8px;"><div id="bar_mood" style="width:${pet.mood}%; height:100%; background:#00ffcc; transition:0.3s;"></div></div>
                <div style="font-size:11px; margin-bottom:3px; color:#aaa;">HEALTH <span id="val_health" style="color:#ff3366; float:right;">${pet.health}</span></div>
                <div style="width:100%; height:4px; background:#444; border-radius:2px; overflow:hidden;"><div id="bar_health" style="width:${pet.health}%; height:100%; background:#ff3366; transition:0.3s;"></div></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                <button class="c-btn" data-msg="/stat">📊 統計</button>
                <button class="c-btn" style="background:#444;" data-msg="/kansatsu">🔍 観察</button>
                <button class="c-btn" data-msg="/esa">🍚 飯</button>
                <button class="c-btn" data-msg="/nade">✋ なで</button>
                <button class="c-btn" data-msg="/home">💬 ほめ</button>
                <button class="c-btn" style="background:#d2691e;" data-msg="/omocha">🧸 玩具</button>
                <button class="c-btn" data-msg="/tataku">👊 殴</button>
                <button class="c-btn" style="background:#800080;" data-msg="/kusuri">💊 薬</button>
            </div>
        </div>
        <style>
            .c-btn { background: #0056b3; color: #fff; border: none; padding: 6px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: 0.1s; font-weight: bold; width: 100%; }
            .c-btn:hover { background: #007bff; }
        </style>
    `;
    document.body.appendChild(container);

    const updateUI = () => {
        const h = document.getElementById("val_hunger"); if(h) h.innerText = pet.hunger;
        const bh = document.getElementById("bar_hunger"); if(bh) bh.style.width = pet.hunger + "%";
        const m = document.getElementById("val_mood"); if(m) m.innerText = pet.mood;
        const bm = document.getElementById("bar_mood"); if(bm) bm.style.width = pet.mood + "%";
        const hl = document.getElementById("val_health"); if(hl) hl.innerText = pet.health;
        const bhl = document.getElementById("bar_health"); if(bhl) bhl.style.width = pet.health + "%";
    };

    setInterval(() => {
        pet.hunger = Math.max(0, pet.hunger - 1);
        if (Math.random() > 0.5) pet.mood = Math.max(0, pet.mood - 1);
        if (pet.hunger <= 0) pet.health = Math.max(0, pet.health - 5);
        else if (pet.hunger > 50 && pet.health < 100) pet.health = Math.min(100, pet.health + 1);
        savePet();
    }, 60000);

    const sendChat = (text) => {
        const input = document.querySelector("#chatText");
        const btn = document.querySelector("#chatSubmitButton");
        if (input && btn && text) { input.value = text; input.dispatchEvent(new Event('input', { bubbles: true })); btn.click(); }
    };

    container.querySelectorAll(".c-btn").forEach(btn => {
        btn.onclick = () => sendChat(btn.getAttribute("data-msg"));
    });

    const startObserve = () => {
        const targetList = document.querySelector("#chatMessage");
        if (!targetList) { setTimeout(startObserve, 500); return; }

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeName !== "LI") continue;
                    const text = node.innerText;
                    // 他人の投稿やシステムメッセージに反応しないためのガード
                    if (text.includes("！】") || text.includes("！") || text.includes("。")) continue;

                    let resultMsg = "";
                    if (text.includes("/stat")) {
                        resultMsg = `現在 腹:${pet.hunger} 機:${pet.mood} 健:${pet.health} 【統計】飯:${stats.feed} 撫:${stats.pet} 褒:${stats.praise} 玩:${stats.toy} 殴:${stats.hit} 薬:${stats.heal}`;
                    } else if (text.includes("/kansatsu")) resultMsg = handleAction('observe');
                    else if (text.includes("/esa")) resultMsg = handleAction('feed');
                    else if (text.includes("/nade")) resultMsg = handleAction('pet');
                    else if (text.includes("/home")) resultMsg = handleAction('praise');
                    else if (text.includes("/omocha")) resultMsg = handleAction('toy');
                    else if (text.includes("/tataku")) resultMsg = handleAction('hit');
                    else if (text.includes("/kusuri")) {
                        if (pet.hunger <= 0) resultMsg = "きょげち はお腹が空きすぎて薬を受け付けなかった！";
                        else if (pet.mood < 20) {
                            resultMsg = "きょげち は機嫌が悪くて薬を投げ捨てた！";
                            pet.mood = Math.max(0, pet.mood - 5);
                        } else {
                            resultMsg = handleAction('heal');
                        }
                    }

                    if (resultMsg) { savePet(); setTimeout(() => sendChat(resultMsg), 800); }
                }
            }
        });
        observer.observe(targetList, { childList: true });
    };
    startObserve();

    // ドラッグ移動機能
    let isDragging = false; let offset = { x: 0, y: 0 };
    const header = document.getElementById("dragHeaderPet");
    header.onmousedown = (e) => { isDragging = true; offset.x = e.clientX - container.offsetLeft; offset.y = e.clientY - container.offsetTop; };
    document.addEventListener("mousemove", (e) => { if (!isDragging) return; container.style.left = (e.clientX - offset.x) + "px"; container.style.top = (e.clientY - offset.y) + "px"; container.style.right = "auto"; });
    document.addEventListener("mouseup", () => { isDragging = false; });

})();