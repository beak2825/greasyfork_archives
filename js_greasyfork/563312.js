// ==UserScript==
// @name         栞栞Shiori 歌单跳转助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击歌单显示漂亮的弹窗，确认后跳转B站
// @author       SecurityReseacher
// @match        https://www.shiori.xin/
// @grant        GM_openInTab
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563312/%E6%A0%9E%E6%A0%9EShiori%20%E6%AD%8C%E5%8D%95%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563312/%E6%A0%9E%E6%A0%9EShiori%20%E6%AD%8C%E5%8D%95%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const songDatabase = {
        "Honey": "https://www.bilibili.com/video/BV1o2421N7TT",
        "忽然之间": "https://www.bilibili.com/video/BV1NRkgByEfV",
        "一个像夏天一个像秋天": "https://www.bilibili.com/video/BV1gJBABDEjB",
        "2002年的第一场雪": "https://www.bilibili.com/video/BV1BLksBqEiP",
        "太聪明": "https://www.bilibili.com/video/BV15es6zUEgh",
        "ぶる～べりぃ♡とれいん": "https://www.bilibili.com/video/BV1jo1uBNEVm",
        "我是你的小狗": "https://www.bilibili.com/video/BV1MRsGzhEmo",
        "第一天": "https://www.bilibili.com/video/BV1Jpx2z5E1y",
        "快乐星猫": "https://www.bilibili.com/video/BV1H7x2zmETA",
        "阿拉斯加海湾": "https://www.bilibili.com/video/BV1EBUkBME72",
        "樱花草": "https://www.bilibili.com/video/BV1tLsczbERT",
        "虚拟": "https://www.bilibili.com/video/BV1BkSEBgEdh",
        "おちゃめ功能（半首）": "https://www.bilibili.com/video/BV1hsrjBvER8",
        "猪猪侠": "https://www.bilibili.com/video/BV1FMrjB7Enc",
        "雨爱": "https://www.bilibili.com/video/BV1H7x2zmEEt",
        "空色デイズ（半首）": "https://www.bilibili.com/video/BV1qGrjBCEYF",
        "暖暖": "https://www.bilibili.com/video/BV1JTsazNE6v",
        "群青（半首）": "https://www.bilibili.com/video/BV1E8rBBrEZ4",
        "要抱抱": "https://www.bilibili.com/video/BV1Kj4wzeEVU",
        "God": "https://www.bilibili.com/video/BV14ukkBvERW",
        "你被写在我的歌里": "https://www.bilibili.com/video/BV1Ng48zGE8P",
        "愛してるばんざーい！": "https://www.bilibili.com/video/BV1fa4wzpEzt",
        "左手指月": "https://www.bilibili.com/video/BV1vW4UzLERK",
        "風になる": "https://www.bilibili.com/video/BV19zxNzHE2o",
        "お願い!": "https://www.bilibili.com/video/BV1iQrvBfEuj",
        "全是爱（半首）": "https://www.bilibili.com/video/BV1iDrvB8EDH",
        "下一个天亮": "https://www.bilibili.com/video/BV1VwBkBiErX",
        "GO": "https://www.bilibili.com/video/BV1yarvBkEqD",
        "愛言葉Ⅲ": "https://www.bilibili.com/video/BV1hm6RBgE6z",
        "触动心": "https://www.bilibili.com/video/BV1ip11BPE1n",
        "カワキヲアメク": "https://www.bilibili.com/video/BV1e1qPBZEuf",
        "ヒッチコック": "https://www.bilibili.com/video/BV1txrGBEEEu",
        "追光者": "https://www.bilibili.com/video/BV1wLr3BTEGF",
        "青花瓷": "https://www.bilibili.com/video/BV18grKBNE4e",
        "恋爱ing": "https://www.bilibili.com/video/BV1b3rKBeE5z",
        "小鸡小鸡": "https://www.bilibili.com/video/BV1HRidBSE6R",
        "至少还有你": "https://www.bilibili.com/video/BV1sxmmBoEAZ",
        "可不可以": "https://www.bilibili.com/video/BV1xiqWBiE1i",
        "花の塔": "https://www.bilibili.com/video/BV1vYixBpE1q",
        "跳楼机": "https://www.bilibili.com/video/BV14RxNz3ELR",
        "夢の河": "https://www.bilibili.com/video/BV1FYiEBgEFs",
        "嘉宾": "https://www.bilibili.com/video/BV1mdW4zAERr",
        "分手快乐": "https://www.bilibili.com/video/BV1cqieBXEJm",
        "あいわな": "https://www.bilibili.com/video/BV1MBihBsEHc",
        "モア！ジャンプ！モア！": "https://www.bilibili.com/video/BV1RKiaBNEJB",
        "恋人未满": "https://www.bilibili.com/video/BV1N1vfB8EjP",
        "如果可以": "https://www.bilibili.com/video/BV123v9B7EQ9",
        "ファースト・ラビット": "https://www.bilibili.com/video/BV1NbvDBuEDm",
        "吵架歌": "https://www.bilibili.com/video/BV1WzydBgEGJ",
        "夢をかなえてドラえもん": "https://www.bilibili.com/video/BV16V11BgES9",
        "恋爱サーキュレーション": "https://www.bilibili.com/video/BV1GTvWBzEag",
        "自娱自乐": "https://www.bilibili.com/video/BV1JNydBYEkj",
        "隐形的翅膀": "https://www.bilibili.com/video/BV1C62iBREg5",
        "Virtual": "https://www.bilibili.com/video/BV1RCsczuEPo",
        "Spring": "https://www.bilibili.com/video/BV1SgBkBFEbf",
        "永不失联的爱": "https://www.bilibili.com/video/BV1zUmJBME7d",
        "ジングルベル": "https://www.bilibili.com/video/BV16sBQBrEUp",
        "届かない恋": "https://www.bilibili.com/video/BV1KdBQBnEwy",
        "快乐女孩": "https://www.bilibili.com/video/BV1snsGz9E6v",
        "认真的雪": "https://www.bilibili.com/video/BV1sFBuBZEvM",
        "雪の華": "https://www.bilibili.com/video/BV1mdBMBhEjw",
        "我怀念的": "https://www.bilibili.com/video/BV1ujqSBjE2w",
        "圈住你": "https://www.bilibili.com/video/BV1ooq2BnE2W",
        "心墙": "https://www.bilibili.com/video/BV16vyQBxEoR",
        "遇见": "https://www.bilibili.com/video/BV1RMsNzUEBj",
        "有点甜": "https://www.bilibili.com/video/BV1iZs3zzEQA",
        "胆小鬼": "https://www.bilibili.com/video/BV1LDykBsE7p",
        "客官不可以": "https://www.bilibili.com/video/BV13UqVBmEHJ",
        "坏女孩": "https://www.bilibili.com/video/BV1ZUqYBEEZ8",
        "莫名其妙爱上你": "https://www.bilibili.com/video/BV1JH1LBWErv",
        "时间煮雨": "https://www.bilibili.com/video/BV1kyqWBcEUt",
        "一直很安静": "https://www.bilibili.com/video/BV11Y2wBhEMS",
        "告白气球": "https://www.bilibili.com/video/BV1bYspzxELp",
        "晚安曲": "https://www.bilibili.com/video/BV16emmBHECj",
        "匆匆那年": "https://www.bilibili.com/video/BV163mGBnE3z",
        "最后一页": "https://www.bilibili.com/video/BV1CqydB6EJZ",
        "如果的事": "https://www.bilibili.com/video/BV1qsmtBdEmk",
        "遇见你的时候所有星星都落到我头上": "https://www.bilibili.com/video/BV1ayW4z6ES4",
        "爱你": "https://www.bilibili.com/video/BV174x2zrEjk",
        "小酒窝": "https://www.bilibili.com/video/BV1CW4VztE5B",
        "奇妙能力歌": "https://www.bilibili.com/video/BV1bbsnznERy",
        "私じゃなかったんだね": "https://www.bilibili.com/video/BV12t2pBxEqK",
        "两个恰恰好": "https://www.bilibili.com/video/BV15PyPBVEJR",
        "化身孤岛的鲸": "https://www.bilibili.com/video/BV14RxNz3EkJ",
        "说爱你": "https://www.bilibili.com/video/BV1cHyCBPEjR",
        "素颜": "https://www.bilibili.com/video/BV1JJ1LBREBt",
        "爱的魔法": "https://www.bilibili.com/video/BV1RQCiBvEc6",
        "我还有点小糊涂": "https://www.bilibili.com/video/BV1pDSKBjErs",
        "猪之歌": "https://www.bilibili.com/video/BV1zfsmzyEui",
        "大家一起喜羊羊": "https://www.bilibili.com/video/BV1EtSgBUE2s",
        "当你": "https://www.bilibili.com/video/BV1Dp2wBMEjX",
        "もぎゅっと“love”で接近中!": "https://www.bilibili.com/video/BV1NeUABqEL8",
        "夜车": "https://www.bilibili.com/video/BV1Tj4wzeEKi",
        "食虫植物": "https://www.bilibili.com/video/BV1KMUwBiEsD",
        "冬がくれた予感": "https://www.bilibili.com/video/BV1jH4Uz2EnZ",
        "跟我在一起": "https://www.bilibili.com/video/BV1ErWJz8ExE",
        "夏天的风": "https://www.bilibili.com/video/BV1qby3BMEkK",
        "メランコリック": "https://www.bilibili.com/video/BV1V9WyztEmA",
        "小星星": "https://www.bilibili.com/video/BV1H8CRBYEig",
        "magnet": "https://www.bilibili.com/video/BV1G6ypB8E71",
        "凑热闹": "https://www.bilibili.com/video/BV1k7x2zmEPS",
        "下雨天": "https://www.bilibili.com/video/BV19AW4zBEP2",
        "ドライフラワー": "https://www.bilibili.com/video/BV1rYkUBVE7C",
        "私奔到月球": "https://www.bilibili.com/video/BV1ZJsmz3Euz",
        "星間飛行": "https://www.bilibili.com/video/BV1Ao1SBtEEx",
        "快乐的扑满": "https://www.bilibili.com/video/BV18F14BTEXc",
        "セーラー服を脱がさないで": "https://www.bilibili.com/video/BV1xT14BaERy",
        "爱丫爱丫": "https://www.bilibili.com/video/BV18F14BTEju",
        "后来": "https://www.bilibili.com/video/BV18HsDzqEns",
        "リテラチュア": "https://www.bilibili.com/video/BV1WX1LBwEYo",
        "いかないで": "https://www.bilibili.com/video/BV1Ng48zGEJV",
        "专属天使": "https://www.bilibili.com/video/BV1r41gByE6J",
        "April": "https://www.bilibili.com/video/BV11JsczREiN",
        "简单爱": "https://www.bilibili.com/video/BV1D6yaBnEUM",
        "与你有关": "https://www.bilibili.com/video/BV1DryaBDEKJ",
        "恶作剧": "https://www.bilibili.com/video/BV13WyWBcEq2",
        "勇气大爆发": "https://www.bilibili.com/video/BV1JbxNzFEsb",
        "可能": "https://www.bilibili.com/video/BV1SHsDzqELc",
        "青春修炼手册": "https://www.bilibili.com/video/BV14XxNzkEyZ",
        "钢铁直男": "https://www.bilibili.com/video/BV1Z3sazaETN",
        "我的悲伤是水做的": "https://www.bilibili.com/video/BV1iH4Uz2Erb",
        "恋爱告急": "https://www.bilibili.com/video/BV1PwksB7Efo",
        "いつも何度でも": "https://www.bilibili.com/video/BV1w44Vz4E2N",
        "感恩的心": "https://www.bilibili.com/video/BV1JNydBYEhD",
        "ハートサングラス": "https://www.bilibili.com/video/BV1kzydBuEex",
        "数鸭子(清唱片段)": "https://www.bilibili.com/video/BV1CW4VztE6A",
        "怎么办": "https://www.bilibili.com/video/BV1NeydBCE39",
        "恋ノ行方": "https://www.bilibili.com/video/BV1NeydBCEJG",
        "39": "https://www.bilibili.com/video/BV1eu15BkEkP",
        "爱的城堡": "https://www.bilibili.com/video/BV15u15BkEsE",
        "Calc.": "https://www.bilibili.com/video/BV1Vu15BkEyL",
        "銀色飛行船": "https://www.bilibili.com/video/BV1zJ1LB9Eq7",
        "不可思议": "https://www.bilibili.com/video/BV1fH1LBpEbs",
        "泪桥": "https://www.bilibili.com/video/BV1qR1uBiELo",
        "我愛你-上海蟹-": "https://www.bilibili.com/video/BV1FQ1uBzEAv",
        "目及皆是你": "https://www.bilibili.com/video/BV1Z1ykBZEBz",
        "小情歌": "https://www.bilibili.com/video/BV1XAW4zBEbx",
        "梦的光点": "https://www.bilibili.com/video/BV1YRszzLEhy",
        "清く正しくカブタック(半首)": "https://www.bilibili.com/video/BV1bPs6zuErW",
        "栞(半首)": "https://www.bilibili.com/video/BV136s6zyEN1",
        "小跳蛙": "https://www.bilibili.com/video/BV1k44VzxEjJ",
        "不怕": "https://www.bilibili.com/video/BV1sp4VzFEeM",
        "愛言葉Ⅱ": "https://www.bilibili.com/video/BV1g1shznEo1",
        "万有引力": "https://www.bilibili.com/video/BV1bhspzoEfX",
        "稻香(片段)": "https://www.bilibili.com/video/BV18hspzoE8p",
        "巴啦啦小魔仙": "https://www.bilibili.com/video/BV1SYspzxE5W",
        "香格里拉": "https://www.bilibili.com/video/BV1bYspzxEaf",
        "亲亲": "https://www.bilibili.com/video/BV17ZspzuEpA",
        "星座になれたら": "https://www.bilibili.com/video/BV1QpsnzsErk",
        "靠近一点点": "https://www.bilibili.com/video/BV1dLsnzFEzL",
        "我们快出发": "https://www.bilibili.com/video/BV1wz4gzDEDj",
        "可愛くてごめん": "https://www.bilibili.com/video/BV1Pg48zGEQn",
        "不完美女孩": "https://www.bilibili.com/video/BV1rPsazTEL4",
        "恋するフォーチュンクッキー": "https://www.bilibili.com/video/BV1v8sbzQECo",
        "獭中毒": "https://www.bilibili.com/video/BV1HoWRzKE6P",
        "ドラえもんのうた": "https://www.bilibili.com/video/BV19gsNz7Ex7",
        "爸爸去哪儿": "https://www.bilibili.com/video/BV1RgsNz7EAj",
        "ふわふわ♪（半首）": "https://www.bilibili.com/video/BV1S7sNzkEUp",
        "百万个吻": "https://www.bilibili.com/video/BV1KJsczdE5G",
        "恭喜发财": "https://www.bilibili.com/video/BV11JsczREWs",
        "旅行的意义": "https://www.bilibili.com/video/BV1ZY4wzQEat",
        "下个，路口，见": "https://www.bilibili.com/video/BV1XAW4zBEPD",
        "海芋恋": "https://www.bilibili.com/video/BV1amW4zBENC",
        "睫毛弯弯": "https://www.bilibili.com/video/BV1q64Bz9E61",
        "小さな恋のうた（半首）": "https://www.bilibili.com/video/BV1yH4VzfEWR",
        "snow": "https://www.bilibili.com/video/BV1Fa4wzWETe",
        "小手拉大手": "https://www.bilibili.com/video/BV1Kj4wzeEBG",
        "虫儿飞": "https://www.bilibili.com/video/BV1fY4wzQE3k"
        // 在这里继续添加...
    };
    // ===========================================

    function openLink(url) {
        if (typeof GM_openInTab === 'function') {
            GM_openInTab(url, { active: true });
        } else {
            window.open(url, '_blank');
        }
    }

    document.addEventListener('click', function(e) {
        const card = e.target.closest('.song-card');

        if (card) {
            e.preventDefault();
            e.stopPropagation();

            const nameElement = card.querySelector('.song-name');
            if (nameElement) {
                const songName = card.dataset.originName || nameElement.textContent.trim();
                if (songDatabase[songName]) {
                    Swal.fire({
                        title: `找到《${songName}》啦！`,
                        text: "要去 Bilibili 观看这个切片吗？",
                        icon: 'success',
                        showCancelButton: true,
                        confirmButtonColor: '#4a90e2',
                        cancelButtonColor: '#7db4d4',
                        confirmButtonText: '好耶，立刻播放！',
                        cancelButtonText: '再逛逛',
                        background: '#fff'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            openLink(songDatabase[songName]);
                        }
                    });
                } else {
                    Swal.fire({
                        title: `暂无《${songName}》的直达链接`,
                        text: "是否尝试在 Bilibili 搜索栞栞唱的这首歌？",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#4a90e2',
                        cancelButtonColor: '#ccc',
                        confirmButtonText: '去搜索看看',
                        cancelButtonText: '取消'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const searchUrl = `https://search.bilibili.com/all?keyword=栞栞shiori ${encodeURIComponent(songName)}`;
                            openLink(searchUrl);
                        }
                    });
                }
            }
        }
    }, true);

    // 视觉优化 Observer
    const observer = new MutationObserver((mutations) => {
        const cards = document.querySelectorAll('.song-card');
        cards.forEach(card => {
            if (card.dataset.processed) return;

            const nameEl = card.querySelector('.song-name');
            if (nameEl) {
                const rawName = nameEl.textContent.trim();
                card.dataset.originName = rawName;

                if (songDatabase[rawName]) {
                    nameEl.style.color = '#ff69b4';
                    nameEl.style.fontWeight = 'bold';
                    nameEl.innerHTML = '▶ ' + rawName;
                    card.setAttribute('title', '点击播放');
                }

                card.dataset.processed = "true";
            }
        });
    });

    const playlistContainer = document.getElementById('playlist-list');
    if (playlistContainer) {
        observer.observe(playlistContainer, { childList: true, subtree: true });
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();