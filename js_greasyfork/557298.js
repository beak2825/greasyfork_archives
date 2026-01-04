// ==UserScript==
// @name         Typingerz Ritual Hook
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Typingerz通信掌握儀式 - 全通信網羅版（ソケット競合修正版）
// @match        https://typingerz.com/battlemenu/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557298/Typingerz%20Ritual%20Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/557298/Typingerz%20Ritual%20Hook.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if (document.getElementById('th-panel')) {
        console.log('[TH] UIが既に存在するため中断します。');
        return;
    }

    console.log('%c[TH] 初期化開始...', 'color: #00ff00; font-weight: bold; font-size: 14px;');

    if (!window.TH) {

    // メイン機能オブジェクト
    window.TH = {
        _intervals: [],
        playerNum: 1, // デフォルトプレイヤー番号

        // 常に最新のソケットを取得する関数
        _getActiveSocket: function() {
            let socket = null;

            if (typeof io !== 'undefined') {
                // 方法1: Socket.IOマネージャーから最新のソケットを取得
                if (io.managers) {
                    for (let url in io.managers) {
                        const manager = io.managers[url];
                        if (manager && manager.nsps) {
                            for (let nsp in manager.nsps) {
                                const candidateSocket = manager.nsps[nsp];
                                // 接続されているソケットを優先
                                if (candidateSocket && candidateSocket.connected) {
                                    socket = candidateSocket;
                                    break;
                                }
                                // 接続されていなくても、存在するソケットを保持
                                if (!socket && candidateSocket) {
                                    socket = candidateSocket;
                                }
                            }
                        }
                        if (socket && socket.connected) break;
                    }
                }
            }

            return socket;
        },

        // 安全な送信（常に最新のソケットを使用）
        _emit: function(event, data) {
            return new Promise((resolve, reject) => {
                try {
                    // 送信前に必ず最新のソケットを取得
                    const currentSocket = this._getActiveSocket();

                    if (!currentSocket) {
                        console.error('[TH] Socket未検出。ページをリロードしてください。');
                        reject(new Error('Socket未検出'));
                        return;
                    }

                    if (!currentSocket.connected) {
                        console.warn('[TH] Socket未接続。再接続試行中...');
                        currentSocket.connect();
                        setTimeout(() => {
                            if (currentSocket.connected) {
                                currentSocket.emit(event, data);
                                console.log(`[TH] 再接続後送信成功: ${event}`);
                                resolve(true);
                            } else {
                                reject(new Error('再接続失敗'));
                            }
                        }, 1000);
                    } else {
                        currentSocket.emit(event, data);
                        resolve(true);
                    }
                } catch(e) {
                    console.error('[TH] 送信エラー:', e);
                    reject(e);
                }
            });
        },

        // ==================== バトル関連 ====================

        // ダメージ送信（修正版）
        damage: async function(target, amount = 100) {
            if (typeof target !== 'number') {
                console.error('[TH] 使い方: TH.damage(1 or 2, ダメージ数)');
                return false;
            }

            try {
                if (target === 1) {
                    // プレイヤー1にダメージ
                    await this._emit('damage', amount);
                    console.log(`%c[TH] ✓ プレイヤー1にダメージ: ${amount}`, 'color: #ff6b6b;');
                } else if (target === 2) {
                    // プレイヤー2にダメージ
                    await this._emit('cdamage', amount);
                    console.log(`%c[TH] ✓ プレイヤー2にダメージ: ${amount}`, 'color: #ff6b6b;');
                } else {
                    console.error('[TH] ターゲットは 1 または 2 を指定してください');
                    return false;
                }
                return true;
            } catch(e) {
                console.error('[TH] ✗ ダメージ送信失敗:', e.message);
                return false;
            }
        },

        // ペナルティダメージ（修正版）
        penalty: async function(target, amount = 50) {
            if (typeof target !== 'number') {
                console.error('[TH] 使い方: TH.penalty(1 or 2, ペナルティ数)');
                return false;
            }

            try {
                if (target === 1) {
                    // プレイヤー1にペナルティ
                    await this._emit('penaDamage', amount);
                    console.log(`%c[TH] ✓ プレイヤー1にペナルティ: ${amount}`, 'color: #ff6348;');
                } else if (target === 2) {
                    // プレイヤー2にペナルティ
                    await this._emit('cpenaDamage', amount);
                    console.log(`%c[TH] ✓ プレイヤー2にペナルティ: ${amount}`, 'color: #ff6348;');
                } else {
                    console.error('[TH] ターゲットは 1 または 2 を指定してください');
                    return false;
                }
                return true;
            } catch(e) {
                console.error('[TH] ✗ ペナルティ送信失敗:', e.message);
                return false;
            }
        },

        // ミス送信
        miss: async function(count = 1) {
            try {
                await this._emit('miss', count);
                console.log(`%c[TH] ✓ ミス送信: ${count}回`, 'color: #95afc0;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ ミス送信失敗:', e.message);
                return false;
            }
        },

        // 必殺技発動
        hadou: async function(hadouID = 1, missCount = 0, playerNum = null) {
            try {
                await this._emit('hadouOn', {
                    hadoumiss: missCount,
                    hadouID: hadouID,
                    playerNum: playerNum || this.playerNum,
                    hadouImageStop: 0
                });
                console.log(`%c[TH] ✓ 必殺技発動: ID=${hadouID}, Miss=${missCount}`, 'color: #ffd93d;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ 必殺技発動失敗:', e.message);
                return false;
            }
        },

        // ハンデ送信
        sendHandi: async function(handiP, handiHP, handiDamageRate) {
            try {
                await this._emit('sendHandi', {
                    handiP: handiP,
                    handiHP: handiHP,
                    handiDamageRate: handiDamageRate
                });
                console.log(`%c[TH] ✓ ハンデ送信: P=${handiP}, HP=${handiHP}`, 'color: #a29bfe;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ ハンデ送信失敗:', e.message);
                return false;
            }
        },

        // ==================== プレイヤー情報 ====================

        // プレイヤー参加
        joinBattle: async function(userData = {}) {
            const defaultData = {
                pn: 1,
                monsterID: 1,
                tabletemp: [],
                str: 10,
                vit: 10,
                dex: 10,
                hp: 100,
                lv: 1,
                typingerRank: 'H',
                nickname: 'Player',
                speed: 100,
                handiflag: 0,
                userid: 'test123',
                renshou: 0,
                chatOnOff: 'on'
            };

            const data = Object.assign({}, defaultData, userData);

            try {
                await this._emit('st_koukan', data);
                console.log(`%c[TH] ✓ プレイヤー情報送信`, 'color: #4ecdc4;', data);
                return true;
            } catch(e) {
                console.error('[TH] ✗ プレイヤー情報送信失敗:', e.message);
                return false;
            }
        },

        // レーティング交換
        sendRating: async function(rating = 1500, rd = 350, volatility = 0.06, nickname = 'Player', rank = 'H') {
            try {
                await this._emit('ratingKoukan', {
                    rating: rating,
                    rd: rd,
                    volatility: volatility,
                    nickname: nickname,
                    rank: rank
                });
                console.log(`%c[TH] ✓ レーティング送信: ${rating}`, 'color: #ffd93d;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ レーティング送信失敗:', e.message);
                return false;
            }
        },

        // 結果交換
        sendResult: async function(speed, seikakusei, penaltyNum, machigaisuu) {
            try {
                await this._emit('kekkaKoukan', {
                    speed: speed || 0,
                    seikakusei: seikakusei || 0,
                    penaltyNum: penaltyNum || 0,
                    machigaisuu: machigaisuu || 0
                });
                console.log(`%c[TH] ✓ 結果送信完了`, 'color: #00ff00;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ 結果送信失敗:', e.message);
                return false;
            }
        },

        // ==================== チャット関連 ====================

        // チャット送信
        chat: async function(message) {
            try {
                await this._emit('chat_send', message);
                console.log(`%c[TH] ✓ チャット: "${message}"`, 'color: #4ecdc4;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ チャット送信失敗:', e.message);
                return false;
            }
        },

        // チャットOFF送信
        chatOff: async function() {
            try {
                await this._emit('chatoff_send');
                console.log(`%c[TH] ✓ チャットOFF通知送信`, 'color: #95afc0;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ チャットOFF送信失敗:', e.message);
                return false;
            }
        },

        // ==================== 接続・マッチング ====================

        // マッチング参加
        joinMatch: async function(handiflag = 0, userid = 'test123', preuserid = [], friendPass = null, speed = 100, limitNum = 0) {
            try {
                await this._emit('setRandom', {
                    handiflag: handiflag,
                    userid: userid,
                    preuserid: preuserid,
                    friendPass: friendPass,
                    speed: speed,
                    limitNum: limitNum
                });
                console.log(`%c[TH] ✓ マッチング参加`, 'color: #a29bfe;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ マッチング参加失敗:', e.message);
                return false;
            }
        },

        // レアキーボード使用通知
        rareKeyboard: async function() {
            try {
                await this._emit('rareKbdOn');
                console.log(`%c[TH] ✓ レアキーボード通知`, 'color: #ffd93d;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ レアキーボード通知失敗:', e.message);
                return false;
            }
        },

        // バトル開始
        startBattle: async function(playerNum) {
            try {
                await this._emit('battleStart', playerNum);
                console.log(`%c[TH] ✓ バトル開始: プレイヤー${playerNum}`, 'color: #00ff00; font-weight: bold;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ バトル開始失敗:', e.message);
                return false;
            }
        },

        // 再戦終了
        endBattleAgain: async function() {
            try {
                await this._emit('battleAgainEnd');
                console.log(`%c[TH] ✓ 再戦終了通知`, 'color: #95afc0;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ 再戦終了失敗:', e.message);
                return false;
            }
        },

        // 再戦要求
        requestBattleAgain: async function() {
            try {
                await this._emit('battleAgain');
                console.log(`%c[TH] ✓ 再戦要求送信`, 'color: #ffd93d;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ 再戦要求失敗:', e.message);
                return false;
            }
        },

        // 接続確認
        setConnection: async function() {
            try {
                await this._emit('setuzokuConf');
                console.log(`%c[TH] ✓ 接続確認送信`, 'color: #4ecdc4;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ 接続確認失敗:', e.message);
                return false;
            }
        },

        // 初期化要求
        reset: async function() {
            try {
                await this._emit('shokika');
                console.log(`%c[TH] ✓ 初期化要求送信`, 'color: #ff6348;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ 初期化失敗:', e.message);
                return false;
            }
        },

        // 自分の接続切断通知
        disconnectSelf: async function(typingend) {
            try {
                await this._emit('jibunSetuzokugire', typingend);
                console.log(`%c[TH] ✓ 切断通知送信`, 'color: #ff6348;');
                return true;
            } catch(e) {
                console.error('[TH] ✗ 切断通知失敗:', e.message);
                return false;
            }
        },

        // ==================== 自動化機能 ====================

        // 連続攻撃
        autoAttack: function(target, damage = 50, interval = 100, count = 10) {
            if (typeof target !== 'number' || (target !== 1 && target !== 2)) {
                console.error('[TH] 使い方: TH.autoAttack(1 or 2, ダメージ, 間隔ms, 回数)');
                return;
            }

            console.log(`%c[TH] 連続攻撃開始: P${target}に${damage}dmg × ${count}回`, 'color: #ff6b6b; font-weight: bold;');

            let i = 0;
            const attackInterval = setInterval(async () => {
                if (i >= count) {
                    clearInterval(attackInterval);
                    console.log('%c[TH] 連続攻撃完了', 'color: #00ff00; font-weight: bold;');
                    return;
                }

                await this.damage(target, damage);
                i++;
            }, interval);

            this._intervals.push(attackInterval);
            return attackInterval;
        },

        // 連続ペナルティ
        autoPenalty: function(target, amount = 50, interval = 100, count = 10) {
            if (typeof target !== 'number' || (target !== 1 && target !== 2)) {
                console.error('[TH] 使い方: TH.autoPenalty(1 or 2, ペナルティ, 間隔ms, 回数)');
                return;
            }

            console.log(`%c[TH] 連続ペナルティ開始: P${target}に${amount} × ${count}回`, 'color: #ff6348; font-weight: bold;');

            let i = 0;
            const penaltyInterval = setInterval(async () => {
                if (i >= count) {
                    clearInterval(penaltyInterval);
                    console.log('%c[TH] 連続ペナルティ完了', 'color: #00ff00; font-weight: bold;');
                    return;
                }

                await this.penalty(target, amount);
                i++;
            }, interval);

            this._intervals.push(penaltyInterval);
            return penaltyInterval;
        },

        // チャットスパム
        spamChat: function(message, interval = 1000, count = 5) {
            console.log(`%c[TH] チャットスパム開始: "${message}" × ${count}回`, 'color: #4ecdc4;');

            let i = 0;
            const chatInterval = setInterval(async () => {
                if (i >= count) {
                    clearInterval(chatInterval);
                    console.log('%c[TH] チャットスパム完了', 'color: #00ff00;');
                    return;
                }

                await this.chat(message);
                i++;
            }, interval);

            this._intervals.push(chatInterval);
            return chatInterval;
        },

        // すべての自動処理停止
        stopAll: function() {
            this._intervals.forEach(id => clearInterval(id));
            this._intervals = [];
            console.log('%c[TH] すべての自動処理を停止しました', 'color: #ffaa00; font-weight: bold;');
        },

        // ==================== 監視機能 ====================

        // イベント監視
        monitor: function(enable = true) {
            const events = [
                // 受信イベント
                'damage_from_server', 'cdamage_from_server',
                'penaDamage_from_server', 'cpenaDamage_from_server',
                'chat_from_server_jibun', 'chat_from_server_aite',
                'chatOff_from_server',
                'miss_from_server', 'hadouOn_from_server',
                'playerNum', 'getPlayer', 'playerJoin',
                'battleStart', 'winFlag', 'kekkaKoukan',
                'ratingGet', 'sendHandi',
                'battleAgainEnd', 'setuzokuOK',
                'shokika', 'jibunSetuzokugire',
                'rareKbdOn',
                // 接続イベント
                'connect', 'disconnect', 'connect_error',
                'reconnect', 'reconnect_attempt'
            ];

            const socket = this._getActiveSocket();
            if (!socket) {
                console.error('[TH] Socket未検出のため監視不可');
                return;
            }

            if (enable) {
                events.forEach(event => {
                    socket.on(event, (data) => {
                        console.log(`%c[EVENT] ${event}`, 'color: #a29bfe; font-weight: bold;', data);
                    });
                });
                console.log('%c[TH] イベント監視開始（全イベント）', 'color: #00ff00; font-weight: bold;');
            } else {
                events.forEach(event => socket.off(event));
                console.log('%c[TH] イベント監視停止', 'color: #ffaa00;');
            }
        },

        // 接続状態確認
        status: function() {
            const socket = this._getActiveSocket();
            const connected = socket && socket.connected;
            const info = `
╔═══════════════════════════════════╗
║        接続状態                    ║
╚═══════════════════════════════════╝
Socket: ${socket ? '✓ 存在' : '✗ なし'}
接続: ${connected ? '✓ 接続中' : '✗ 切断中'}
URL: ${socket && socket.io ? socket.io.uri : '不明'}
デフォルトプレイヤー番号: ${this.playerNum}
`;
            console.log(connected ? `%c${info}` : `%c${info}`, connected ? 'color: #00ff00;' : 'color: #ff0000;');
            return connected;
        },

        // ==================== ヘルプ ====================

        help: function() {
            console.log(`%c
╔═══════════════════════════════════════════════╗
║     Typingerz 完全版ハックツール v3.1         ║
║     (ソケット競合完全修正版)                   ║
╚═══════════════════════════════════════════════╝
`, 'color: #00ff00; font-weight: bold; font-size: 16px;');

            console.log(`%c
【バトル攻撃】
TH.damage(1, 100)          - プレイヤー1に100ダメージ
TH.damage(2, 100)          - プレイヤー2に100ダメージ
TH.penalty(1, 50)          - プレイヤー1に50ペナルティ
TH.penalty(2, 50)          - プレイヤー2に50ペナルティ
TH.miss(5)                 - 5回ミス送信
TH.hadou(1, 0)             - 必殺技ID1を発動

【プレイヤー情報】
TH.joinBattle({...})       - バトル参加（詳細はコード参照）
TH.sendRating(1500,...)    - レーティング送信
TH.sendResult(...)         - 結果送信

【チャット】
TH.chat("message")         - チャット送信
TH.chatOff()               - チャットOFF通知
TH.spamChat("hi", 1000, 5) - チャットスパム

【接続・マッチング】
TH.joinMatch()             - マッチング参加
TH.startBattle(1)          - バトル開始
TH.requestBattleAgain()    - 再戦要求
TH.endBattleAgain()        - 再戦終了
TH.setConnection()         - 接続確認
TH.reset()                 - 初期化
TH.disconnectSelf(0)       - 切断通知

【自動化】
TH.autoAttack(2,100,50,20) - P2に100dmgを50ms間隔で20回
TH.autoPenalty(1,50,100,10)- P1に50ペナを100ms間隔で10回
TH.stopAll()               - すべての自動処理停止

【監視・確認】
TH.monitor(true)           - 全イベント監視ON
TH.monitor(false)          - 監視OFF
TH.status()                - 接続状態確認

【使用例】
await TH.damage(2, 200)    // 相手(P2)に200ダメージ
await TH.penalty(1, 100)   // 自分(P1)に100ペナルティ
TH.autoAttack(2, 100, 50, 20)  // 相手に連続攻撃
TH.chat("gg")              // チャット
TH.monitor(true)           // 監視開始

【v3.1の変更点】
✓ 常に最新のSocketを自動取得（競合問題完全解決）
✓ 送信前に毎回ソケット状態を確認
✓ 日本語コメントで文字化け防止
`, 'color: #4ecdc4;');
        }
    };

    // エイリアス
    window.th = window.TH;

    // 起動完了
    console.log(`%c
╔════════════════════════════════════════════════╗
║                                                ║
║        準備完了！TH.help() でヘルプ表示       ║
║                                                ║
╚════════════════════════════════════════════════╝
`, 'color: #00ff00; font-weight: bold; font-size: 16px;');

    TH.help();
    TH.status();
    }

        // テンプレートデータ
    const templates = [
        { code: 'TH.damage(1, 100)', desc: 'プレイヤー1に100ダメージ' },
        { code: 'TH.damage(2, 100)', desc: 'プレイヤー2に100ダメージ' },
        { code: 'TH.penalty(1, 50)', desc: 'プレイヤー1に50ペナルティ' },
        { code: 'TH.penalty(1,9999999999999999999)', desc: '最強☆' },
        { code: 'TH.miss(5)', desc: '5回ミス送信' },
        { code: 'TH.hadou(1, 0)', desc: '必殺技ID1を発動' },
        { code: 'TH.chat("message")', desc: 'チャット送信' },
        { code: 'TH.chatOff()', desc: 'チャットOFF通知' },
        { code: 'TH.autoAttack(2, 100, 50, 20)', desc: 'P2に100dmgを50ms間隔で20回' },
        { code: 'TH.autoPenalty(1, 50, 100, 10)', desc: 'P1に50ペナを100ms間隔で10回' },
        { code: 'TH.spamChat("hi", 1000, 5)', desc: 'チャットスパム' },
        { code: 'TH.stopAll()', desc: 'すべての自動処理停止' },
        { code: 'TH.joinBattle({})', desc: 'バトル参加' },
        { code: 'TH.sendRating(1500)', desc: 'レーティング送信' },
        { code: 'TH.sendResult()', desc: '結果送信' },
        { code: 'TH.joinMatch()', desc: 'マッチング参加' },
        { code: 'TH.startBattle(1)', desc: 'バトル開始' },
        { code: 'TH.requestBattleAgain()', desc: '再戦要求' },
        { code: 'TH.endBattleAgain()', desc: '再戦終了' },
        { code: 'TH.setConnection()', desc: '接続確認' },
        { code: 'TH.reset()', desc: '初期化' },
        { code: 'TH.disconnectSelf(0)', desc: '切断通知' },
        { code: 'TH.monitor(true)', desc: '全イベント監視ON' },
        { code: 'TH.monitor(false)', desc: '監視OFF' },
        { code: 'TH.status()', desc: '接続状態確認' }
    ];

    // スタイル追加
    const style = document.createElement('style');
    style.textContent = `
        #th-panel {
            position: fixed;
            left: 15px;
            top: 260px;
            right: auto;
            width: 320px;
            min-width: 320px;
            min-height: 250px;
            background: linear-gradient(145deg, rgba(25, 15, 45, 0.95) 0%, rgba(15, 10, 35, 0.98) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(138, 116, 249, 0.3);
            border-radius: 20px;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.6),
                0 0 80px rgba(138, 116, 249, 0.15),
                inset 0 0 60px rgba(138, 116, 249, 0.05);
            z-index: 999999;
            font-family: 'Noto Sans JP', sans-serif;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: panelFadeIn 0.5s ease-out;
        }

        @keyframes panelFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #th-panel-header {
            background: linear-gradient(135deg, rgba(138, 116, 249, 0.2) 0%, rgba(98, 76, 209, 0.15) 100%);
            padding: 16px 20px;
            cursor: move;
            border-bottom: 1px solid rgba(138, 116, 249, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(10px);
        }

        #th-panel-title {
            color: #c9b8ff;
            font-weight: 500;
            font-size: 15px;
            letter-spacing: 1.5px;
            text-shadow: 0 0 20px rgba(138, 116, 249, 0.5);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #th-panel-title::before {
            content: '✨';
            animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        #th-panel-close {
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 71, 87, 0.3) 100%);
            border: 1px solid rgba(255, 107, 107, 0.4);
            color: #ffb3ba;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #th-panel-close:hover {
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.4) 0%, rgba(255, 71, 87, 0.5) 100%);
            transform: rotate(90deg);
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
        }

        #th-panel-content {
            padding: 20px;
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        #th-panel-content::-webkit-scrollbar {
            width: 8px;
        }

        #th-panel-content::-webkit-scrollbar-track {
            background: rgba(138, 116, 249, 0.05);
            border-radius: 10px;
        }

        #th-panel-content::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(138, 116, 249, 0.3) 0%, rgba(98, 76, 209, 0.3) 100%);
            border-radius: 10px;
        }

        #th-panel-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(138, 116, 249, 0.5) 0%, rgba(98, 76, 209, 0.5) 100%);
        }

        #th-input-wrapper {
            position: relative;
        }

        #th-input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(15, 10, 35, 0.6);
            border: 1px solid rgba(138, 116, 249, 0.3);
            border-radius: 12px;
            color: #c9b8ff;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        #th-input:focus {
            outline: none;
            border-color: rgba(138, 116, 249, 0.6);
            background: rgba(15, 10, 35, 0.8);
            box-shadow:
                inset 0 2px 10px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(138, 116, 249, 0.3);
        }

        #th-input::placeholder {
            color: rgba(201, 184, 255, 0.4);
        }

        #th-buttons {
            display: flex;
            gap: 12px;
        }

        .th-btn {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 500;
            font-size: 13px;
            transition: all 0.3s ease;
            font-family: 'Noto Sans JP', sans-serif;
            position: relative;
            overflow: hidden;
        }

        .th-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .th-btn:hover::before {
            width: 300px;
            height: 300px;
        }

        #th-execute {
            background: linear-gradient(135deg, rgba(138, 249, 200, 0.3) 0%, rgba(98, 209, 160, 0.4) 100%);
            color: #b8ffd9;
            border: 1px solid rgba(138, 249, 200, 0.4);
            box-shadow: 0 4px 15px rgba(138, 249, 200, 0.2);
        }

        #th-execute:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(138, 249, 200, 0.4);
            border-color: rgba(138, 249, 200, 0.6);
        }

        #th-template-toggle {
            background: linear-gradient(135deg, rgba(138, 180, 249, 0.3) 0%, rgba(98, 140, 209, 0.4) 100%);
            color: #b8d9ff;
            border: 1px solid rgba(138, 180, 249, 0.4);
            box-shadow: 0 4px 15px rgba(138, 180, 249, 0.2);
        }

        #th-template-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(138, 180, 249, 0.4);
            border-color: rgba(138, 180, 249, 0.6);
        }

        #th-templates {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #th-templates.show {
            max-height: 450px;
            overflow-y: auto;
        }

        #th-templates::-webkit-scrollbar {
            width: 6px;
        }

        #th-templates::-webkit-scrollbar-track {
            background: rgba(138, 116, 249, 0.05);
            border-radius: 10px;
        }

        #th-templates::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(138, 116, 249, 0.3) 0%, rgba(98, 76, 209, 0.3) 100%);
            border-radius: 10px;
        }

        .th-template-item {
            padding: 12px 16px;
            background: rgba(15, 10, 35, 0.4);
            border: 1px solid rgba(138, 116, 249, 0.2);
            border-radius: 10px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            color: #c9b8ff;
            font-size: 12px;
            font-family: 'Courier New', monospace;
        }

        .th-template-item:hover {
            background: rgba(138, 116, 249, 0.15);
            border-color: rgba(138, 116, 249, 0.5);
            transform: translateX(5px);
            box-shadow: 0 4px 20px rgba(138, 116, 249, 0.2);
        }

        .th-template-tooltip {
            position: fixed;
            background: linear-gradient(135deg, rgba(25, 15, 45, 0.98) 0%, rgba(35, 25, 55, 0.98) 100%);
            color: #e0d4ff;
            padding: 10px 16px;
            border-radius: 10px;
            font-size: 12px;
            font-family: 'Noto Sans JP', sans-serif;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            border: 1px solid rgba(138, 116, 249, 0.4);
            z-index: 1000000;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.6),
                0 0 30px rgba(138, 116, 249, 0.3);
            backdrop-filter: blur(10px);
        }

        .th-template-item:hover .th-template-tooltip {
            opacity: 1;
        }

        .th-template-tooltip::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 50%;
            transform: translateY(-50%);
            border-right: 8px solid rgba(138, 116, 249, 0.4);
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
        }

        .th-template-tooltip::after {
            content: '';
            position: absolute;
            left: -7px;
            top: 50%;
            transform: translateY(-50%);
            border-right: 7px solid rgba(25, 15, 45, 0.98);
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
        }

        #th-resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 24px;
            height: 24px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 45%, rgba(138, 116, 249, 0.3) 50%);
            border-bottom-right-radius: 20px;
            transition: all 0.3s ease;
        }

        #th-resize-handle:hover {
            background: linear-gradient(135deg, transparent 45%, rgba(138, 116, 249, 0.6) 50%);
        }

        #th-output {
            background: rgba(15, 10, 35, 0.6);
            border: 1px solid rgba(138, 116, 249, 0.2);
            border-radius: 12px;
            padding: 14px;
            color: #c9b8ff;
            font-size: 11px;
            font-family: 'Courier New', monospace;
            max-height: 180px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
            line-height: 1.6;
        }

        #th-output::-webkit-scrollbar {
            width: 6px;
        }

        #th-output::-webkit-scrollbar-track {
            background: rgba(138, 116, 249, 0.05);
            border-radius: 10px;
        }

        #th-output::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(138, 116, 249, 0.3) 0%, rgba(98, 76, 209, 0.3) 100%);
            border-radius: 10px;
        }

        #th-output:empty::before {
            content: '実行結果がここに表示されます...';
            color: rgba(201, 184, 255, 0.3);
            font-style: italic;
        }
    `;
    document.head.appendChild(style);

    // パネルHTML作成
    const panel = document.createElement('div');
    panel.id = 'th-panel';
    panel.innerHTML = `
        <div id="th-panel-header">
            <span id="th-panel-title">TH Control Panel</span>
            <button id="th-panel-close">×</button>
        </div>
        <div id="th-panel-content">
 <div id="th-input-wrapper">
    <textarea id="th-input" placeholder="TH.damage(1, 100)" rows="5" style="resize:vertical;width:100%;"></textarea>
  </div>
            <div id="th-buttons">
                <button class="th-btn" id="th-execute">▶ 実行</button>
                <button class="th-btn" id="th-template-toggle">📋 テンプレート</button>
            </div>
            <div id="th-templates"></div>
            <div id="th-output"></div>
        </div>
        <div id="th-resize-handle"></div>
    `;
    document.body.appendChild(panel);

    // 要素取得
    const input = document.getElementById('th-input');
    const executeBtn = document.getElementById('th-execute');
    const templateToggle = document.getElementById('th-template-toggle');
    const templatesDiv = document.getElementById('th-templates');
    const output = document.getElementById('th-output');
    const closeBtn = document.getElementById('th-panel-close');
    const header = document.getElementById('th-panel-header');
    const resizeHandle = document.getElementById('th-resize-handle');

    // ツールチップ要素を作成
    const tooltip = document.createElement('div');
    tooltip.className = 'th-template-tooltip';
    document.body.appendChild(tooltip);

    // テンプレート表示生成
    templates.forEach(template => {
        const item = document.createElement('div');
        item.className = 'th-template-item';
        item.textContent = template.code;

        // マウスオーバーでツールチップ表示
        item.addEventListener('mouseenter', (e) => {
            const rect = item.getBoundingClientRect();
            tooltip.textContent = template.desc;
            tooltip.style.left = (rect.right + 15) + 'px';
            tooltip.style.top = (rect.top + rect.height / 2) + 'px';
            tooltip.style.transform = 'translateY(-50%)';
            tooltip.style.opacity = '1';
        });

        item.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        item.addEventListener('click', () => {
            input.value = template.code;
            input.focus();
            tooltip.style.opacity = '0';
        });

        templatesDiv.appendChild(item);
    });

    // テンプレート表示切替
    let templatesVisible = false;
    templateToggle.addEventListener('click', () => {
        templatesVisible = !templatesVisible;
        if (templatesVisible) {
            templatesDiv.classList.add('show');
        } else {
            templatesDiv.classList.remove('show');
            tooltip.style.opacity = '0';
        }
    });

    // コード実行
    async function executeCode() {
        const code = input.value.trim();
        if (!code) return;

        output.textContent = `> ${code}\n`;

        try {
            const result = await eval(code);
            output.textContent += `✓ 実行成功\n`;
            if (result !== undefined) {
                output.textContent += `結果: ${JSON.stringify(result)}\n`;
            }
        } catch (error) {
            output.textContent += `✗ エラー: ${error.message}\n`;
        }

        output.scrollTop = output.scrollHeight;
    }

    executeBtn.addEventListener('click', executeCode);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeCode();
        }
    });

    // 閉じるボタン
    closeBtn.addEventListener('click', () => {
        panel.remove(); // 要素をぶっ壊す
        tooltip.remove(); // ツールチップもついでにぶっ壊す
    });

    // ドラッグ移動
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX - panel.offsetLeft;
        initialY = e.clientY - panel.offsetTop;
        tooltip.style.opacity = '0';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
            panel.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // リサイズ機能
    let isResizing = false;
    let startWidth;
    let startHeight;
    let startX;
    let startY;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startWidth = panel.offsetWidth;
        startHeight = panel.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        tooltip.style.opacity = '0';
        e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);

            if (width >= 320) {
                panel.style.width = width + 'px';
            }
            if (height >= 250) {
                panel.style.height = height + 'px';
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    console.log('%c✨ [TH UI] パネル読み込み完了！', 'color: #c9b8ff; font-weight: bold; font-size: 14px;');

})();