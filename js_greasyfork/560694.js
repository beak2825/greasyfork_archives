// ==UserScript==
// @name         토미미 쉐이록라 한글패치
// @namespace    http://tampermonkey.net/
// @version      2025-12-31
// @description  토미미 쉐이록라 맵이름 한글패치
// @author       ktp
// @match        https://tomimi.dev/*
// @icon         https://tomimi.dev/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560694/%ED%86%A0%EB%AF%B8%EB%AF%B8%20%EC%89%90%EC%9D%B4%EB%A1%9D%EB%9D%BC%20%ED%95%9C%EA%B8%80%ED%8C%A8%EC%B9%98.user.js
// @updateURL https://update.greasyfork.org/scripts/560694/%ED%86%A0%EB%AF%B8%EB%AF%B8%20%EC%89%90%EC%9D%B4%EB%A1%9D%EB%9D%BC%20%ED%95%9C%EA%B8%80%ED%8C%A8%EC%B9%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customTranslations = {
"狡鼷三窟": "무스비스트 동굴",
"赶集": "장 보기",
"正经生意": "정당한 사업",
"老戏骨": "원로 배우",
"驱虫": "해충 구제(DLC)",
"凭票入内": "입장권 필수(DLC)",
"有教无类": "무차별 교육",
"飞来横祸": "마른하늘에 날벼락",
"所守者，义": "지키는 것, 의",
"明抢暗偷": "날강도",
"救援行动": "구조 작전(DLC)",
"玩具兵将": "장난감 군대(DLC)",
"啖之以利": "이득",
"长驱不复": "전진불퇴",
"背山面水": "배산임수",
"去晦": "살풀이",
"落叶归根": "낙엽귀근",
"山海必争": "산해중 쟁탈전",
"贪饵": "매혹적인 미끼",
"识文": "식자",
"赶场戏班": "순회 극단",
"峥嵘战功": "탁월한 전공",
"暗箭难防": "암전난방",
"青山不语": "청산 무언",
"离域检查": "퇴장 검사",
"薄礼一份": "약소한 선물",
"往事喑哑": "묻혀버린 과거",
"邙山镇地方志": "망산 마을 지방지",
"不成烟火": "불성연화",
"炎灼": "작열",
"人镇": "인기로 진압",
"越山海": "신해의 저편",
"借力打力": "차력타력(DLC)",
"月华寒": "차가운 달빛",
"剑·刀·矛": "검·도·창",
"点化": "일깨움",
"夕娥忆": "석아의 기억",
"仁·义·武": "인·의·무",
"求道": "구도",
"破岁阵祀": "파'쉐이'진사",
"昔字如烟": "연기 같은 옛 글자",
"天数将易": "천수지변",
"往昔难忆": "희미한 과거",
"谋岁者": "쉐이를 꾀하는 자",
"末狩": "마지막 사냥",
"源源不断": "끊임없이",
"闪闪发光": "반짝반짝",
"循循善诱": "차근차근 유도",
"易易鸭鸭": "덕로드와 이",
"劫罚": "겁벌",
"生百相": "천태만상",
"硕果累累": "풍성한 결실",
"以逸待劳": "이일대로",
"喜从驮来": "버든비스트의 기쁨",
"硅基伥的宴席": "규기창의 연회",
"彻底失控": "완전 폭주",
"为崖作伥": "벼랑끝에 선 자",
"神游天外": "꿈속 여행",
"作壁上观": "수수방관",
"谤天(双)": "방천(2)",
"迎雷(双)": "영뢰(2)",
"蔑震(双)": "멸진(2)",
"谤天(单)": "방천",
"迎雷(单)": "영뢰",
"蔑震(单)": "멸진",
"赴陨(双)": "부운(2)",
"斥洪(双)": "척홍(2)",
"赴陨(单)": "부운",
"斥洪(单)": "척홍",
"分明": "분명",
"夕江对擂": "석강 결투",
"南武群英会": "남무군영회",
"地有四难": "네 가지 어려움",
"忘形": "우쭐함",
"奇谭": "기담",
"破局": "파국",
"地有四难 b": "네 가지 어려움 b",
"忘形 b": "우쭐함 b",
"奇谭 b": "기담 b",
"破局 b": "파국 b",
"不鉴": "불검",
"靡靡之音": "미미지음",
"迷惘": "미망",
"不鉴 b": "불검 b",
"靡靡之音 b": "미미지음 b",
"迷惘 b": "미망 b",
"凭器 a": "기물에 의지 a",
"凭器 b": "기물에 의지 b",
"凭器 c": "기물에 의지 c",
"愠怒 a": "노여움 a",
"愠怒 b": "노여움 b",
"愠怒 c": "노여움 c",
"震坎": "진감(DLC)",
"四方": "사방(DLC)",
"贪妄": "탐욕과 망념",
"地有四难": "네 가지 어려움",
"忘形": "우쭐함",
"奇谭": "기담",
"破局": "파국",
"地有四难 b": "네 가지 어려움 b",
"忘形 b": "우쭐함 b",
"奇谭 b": "기담 b",
"破局 b": "파국 b",
"不鉴": "불검",
"靡靡之音": "미미지음",
"迷惘": "미망",
"不鉴 b": "불검 b",
"靡靡之音 b": "미미지음 b",
"迷惘 b": "미망 b",
"愠怒": "노여움",
"贪妄": "탐욕과 망념",
"鼷獣の巣穴": "무스비스트 동굴",
"露店市場へ": "장 보기",
"まともな商売": "정당한 사업",
"老練の役者": "원로 배우",
"教え有りて類無し": "무차별 교육",
"飛来する災い": "마른하늘에 날벼락",
"守りしものは義なり": "지키는 것, 의",
"強盗と泥棒": "날강도",
"甘い誘い": "이득",
"ひたすらな前進": "전진불퇴",
"後方に山、前方に水": "배산임수",
"邪気払い": "살풀이",
"落葉の帰る場所": "낙엽귀근",
"山海の争い": "산해중 쟁탈전",
"食い意地": "매혹적인 미끼",
"文字を知る": "식자",
"舞台への出演": "순회 극단",
"輝かしい戦功": "탁월한 전공",
"闇討ちは防ぎ難し": "암전난방",
"青嶺は語らず": "청산 무언",
"退場検査": "퇴장 검사",
"ささやかな謝礼": "약소한 선물",
"過去の沈黙": "묻혀버린 과거",
"邙山町郷土誌": "망산 마을 지방지",
"煙火に成らず": "불성연화",
"灼熱の炎": "작열",
"人により鎮める": "인기로 진압",
"月華の寒気": "차가운 달빛",
"剣・刀・矛": "검·도·창",
"教え導く": "일깨움",
"夕娥の記憶": "석아의 기억",
"仁・義・武": "인·의·무",
"歳破りし陣を祀る": "파'쉐이'진사",
"古き文字は煙の如し": "연기 같은 옛 글자",
"歳を謀る者": "쉐이를 꾀하는 자",
"底なし": "끊임없이",
"きらきら輝いて": "반짝반짝",
"商売禁止": "차근차근 유도",
"良いカモ": "덕로드와 이",
"劫罰": "겁벌",
"生ける百面相": "천태만상",
"鈴なりの果実": "풍성한 결실",
"逸を以て労を待つ": "이일대로",
"喜びは駄獣より来たる": "버든비스트의 기쁨",
"ケイ素器鬼の宴": "규기창의 연회",
"完全制御不能": "완전 폭주",
"崖の下の器鬼": "벼랑끝에 선 자",
"心ここにあらず": "꿈속 여행",
"高みの見物": "수수방관",
"謗天(双)": "방천(2)",
"迎雷(双)": "영뢰(2)",
"蔑震(双)": "멸진(2)",
"謗天(単)": "방천",
"迎雷(単)": "영뢰",
"蔑震(単)": "멸진",
"赴隕(双)": "부운(2)",
"斥洪(双)": "척홍(2)",
"赴隕(単)": "부운",
"斥洪(単)": "척홍",
"明瞭": "분명",
"夕江にて対擂す": "석강 결투",
"地に四難有り": "네 가지 어려움",
"我を忘れる": "우쭐함",
"奇譚": "기담",
"局面打破": "파국",
"地に四難有り b": "네 가지 어려움 b",
"我を忘れる b": "우쭐함 b",
"奇譚 b": "기담 b",
"局面打破 b": "파국 b",
"教訓とせず": "불검",
"退廃の音": "미미지음",
"迷い": "미망",
"教訓とせず b": "불검 b",
"退廃の音 b": "미미지음 b",
"迷い b": "미망 b",
"器頼み a": "기물에 의지 a",
"器頼み b": "기물에 의지 b",
"器頼み c": "기물에 의지 c",
"憤怒 a": "노여움 a",
"憤怒 b": "노여움 b",
"憤怒 c": "노여움 c",
"貪欲にして妄執": "탐욕과 망념",
"Whack-A-Mus": "무스비스트 동굴",
"To Market": "장 보기",
"Serious Business": "정당한 사업",
"Veteran Actor": "원로 배우",
"Learning for All": "무차별 교육",
"Look Out Above": "마른하늘에 날벼락",
"Guardian of Justice": "지키는 것, 의",
"Daylight Robbery": "날강도",
"Hook, Line, and Sinker": "이득",
"Stopping the Advance": "전진불퇴",
"Feng Shui": "배산임수",
"Away, Hui!": "살풀이",
"Return to Your Roots": "낙엽귀근",
"Shanhaizhong Scramble": "산해중 쟁탈전",
"Sugared Bait": "매혹적인 미끼",
"Cultured": "식자",
"Take the Stage": "순회 극단",
"Exemplary Service": "탁월한 전공",
"Beware the Shadows": "암전난방",
"Green Hills Speak Not": "청산 무언",
"Departing Inspection": "퇴장 검사",
"A Humble Gift": "약소한 선물",
"Muted Past": "묻혀버린 과거",
"Mangshan Town Records": "망산 마을 지방지",
"Unlit Sparks": "불성연화",
"Inferno": "작열",
"Garrison": "인기로 진압",
"Cold Moonlight": "차가운 달빛",
"Sword, Glaive, Spear": "검·도·창",
"Enlightenment": "일깨움",
"Memories of Dusk Beauty": "석아의 기억",
"Compassion, Justice, Valor": "인·의·무",
"Seeking the Way": "구도",
"The Suppression of Sui": "파'쉐이'진사",
"Words Past Like Smoke": "연기 같은 옛 글자",
"The Sui Strategist": "쉐이를 꾀하는 자",
"Steady Stream": "끊임없이",
"Sparkling Shine": "반짝반짝",
"Reeducation": "차근차근 유도",
"Duck and Yi": "덕로드와 이",
"Calamitous Punishment": "겁벌",
"Of Hundred Forms": "천태만상",
"Feast of Fruit": "풍성한 결실",
"Biding Time": "이일대로",
"Joy From Burdenbeast": "버든비스트의 기쁨",
"Silicon Geist's Banquet": "규기창의 연회",
"Totally Out of Control": "완전 폭주",
"Cliff of Geists": "벼랑끝에 선 자",
"Astral Projection": "꿈속 여행",
"Sit Back and Watch": "수수방관",
"Slandering Heaven (2)": "방천(2)",
"Amidst Thunder (2)": "영뢰(2)",
"Defying Quakes (2)": "멸진(2)",
"Slandering Heaven (1)": "방천",
"Amidst Thunder (1)": "영뢰",
"Defying Quakes (2)": "멸진",
"To the Fall (2)": "부운(2)",
"Against the Flood (2)": "척홍(2)",
"To the Fall (1)": "부운",
"Against the Flood (1)": "척홍",
"Clarity": "분명",
"Bout by the Dusk River": "석강 결투",
"Heroes of Nanwu": "남무군영회",
"The Four Difficulties": "네 가지 어려움",
"To Forget Oneself": "우쭐함",
"Strange Tales": "기담",
"Breakthrough": "파국",
"The Four Difficulties b": "네 가지 어려움 b",
"To Forget Oneself b": "우쭐함 b",
"Strange Tales b": "기담 b",
"Breakthrough b": "파국 b",
"Unreflecting": "불검",
"Frivolous Tunes": "미미지음",
"Confusion": "미망",
"Unreflecting b": "불검 b",
"Frivolous Tunes b": "미미지음 b",
"Confusion b": "미망 b",
"Ware-User a": "기물에 의지 a",
"Ware-User b": "기물에 의지 b",
"Ware-User c": "기물에 의지 c",
"Inner Rage a": "노여움 a",
"Inner Rage b": "노여움 b",
"Inner Rage c": "노여움 c",
"Avarice": "탐욕과 망념",
"初期COST": "초기 배치 코스트",
"同時配置可能数": "배치 가능 인원수",
"ステージ図": "맵 지도",
"出現率100%のみ表示している": "출현율 100%만 표시하고 있음",
"難易度": "난이도",
"Difficulty": "난이도",
"敵ルート演算": "적 루트 연산",
"演算モード": "연산 모드",
"通常": "통상",
"追加召喚": "추가 소환",
"作戦モード": "작전 모드",
"オプション": "옵션",
"宝箱": "호리병",
"隐蝶墨": "은접묵(히든1)",
"花-鸭爵金币": "덕로드 주화",
"ランダム・グループ選択モード": "랜덤 그룹 선택 모드",
"事前定義": "사전 정의",
"ユーザー選択": "사용자 선택",
"ウェーブ": "웨이브",
"敵数": "적 수",
"敵順列": "적 순열",
"装置順列": "장치 순열",
"ランダム": "랜덤",
"これはあくまでデータからの不完全な再現で、実際の動きとは異なる場合があります": "이것은 어디까지나 데이터로부터의 불완전한 재현으로, 실제 움직임과는 다를 수 있습니다",
"攻撃範囲表示": "공격범위 표시",
"待機残り時間表示": "남은 대기시간 표시",
"敵出現表表示": "적 출현 표 표시",
"カメラロック": "카메라 잠금",
"スクリーン調整": "화면 조정",
"装置": "장치",
"拡大率": "확대율",
"ステ補正確認": "스탯 보정 확인",
"デバグ用": "디버그용",
"ここに表示されている値は四捨五入されています": "계산결과는 반올림 되어 있습니다",
"攻撃力": "공격력",
"防御力": "방어력",
"最終乗算": "최종계산",
"階層補正": "계층 보정"
    };

    function applyTranslation(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            let translatedText = node.textContent;
            let changed = false;

            for (const [key, value] of Object.entries(customTranslations)) {
                if (translatedText.includes(key)) {
                    const regex = new RegExp(escapeRegExp(key), 'g');
                    translatedText = translatedText.replace(regex, value);
                    changed = true;
                }
            }

            if (changed) {
                node.textContent = translatedText;
            }
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function translateElementContent(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            // 부모 요소 체크
            const parent = node.parentNode;
            if (parent && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE' &&
                !parent.hasAttribute('data-no-translate') &&
                !parent.classList.contains('no-translate')) {
                applyTranslation(node);
            }
        }
    }

    // 초기 실행
    translateElementContent(document.body);

    // Observer 설정 보강
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        translateElementContent(node);
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        applyTranslation(node);
                    }
                });
            } else if (mutation.type === 'characterData') {
                applyTranslation(mutation.target);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();