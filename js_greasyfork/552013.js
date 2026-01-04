// ==UserScript==
// @name        Open2ch Kome UID Display
// @namespace   https://greasyfork.org/ja/users/864059
// @version     3.0.4
// @description Open2chのkomeチャットの発言にUIDを明示的に表示し、UIDごとに色を付けて表示します。
// @author      七色の彩り
// @match       https://*.open2ch.net/test/read.cgi/*
// @icon        https://open2ch.net/favicon.ico
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM.info
// @grant       GM_listValues
// @run-at      document-idle
// @exclude       https://open.open2ch.net/test/ad.cgi/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552013/Open2ch%20Kome%20UID%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/552013/Open2ch%20Kome%20UID%20Display.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const scriptVersion = GM.info.script.version;
    const scriptName = GM.info.script.name;
    console.log(`[${scriptName}] v${scriptVersion} - スクリプトが読み込まれました。`);

    const uidColorMap = {};
    let isScrolledToBottom = true;
    const SCROLL_TOLERANCE = 20;

    let COMMENT_MAP = null;
    let UID_SETTINGS = null;
    let CUSTOM_COLORS = null;
    let DEFAULT_SETTINGS = null;

    const PRESET_COLORS = {
        // --- 1 ~ 49: 既存の色を維持 (もし #FFFFFF がこの範囲になければそのまま) ---
        'preset_1':  '#FF5252', 'preset_2':  '#FF8A80', 'preset_3':  '#FF6E40', 'preset_4':  '#FF9800', 'preset_5':  '#FFAB40',
        'preset_6':  '#FFC107', 'preset_7':  '#FFD740', 'preset_8':  '#FFEE58', 'preset_9':  '#FFEB3B', 'preset_10': '#C6FF00',
        'preset_11': '#B2FF59', 'preset_12': '#76FF03', 'preset_13': '#69F0AE', 'preset_14': '#00C853', 'preset_15': '#4CAF50',
        'preset_16': '#66BB6A', 'preset_17': '#81C784', 'preset_18': '#4DB6AC', 'preset_19': '#00BFA5', 'preset_20': '#00BCD4',
        'preset_21': '#4DD0E1', 'preset_22': '#00B0FF', 'preset_23': '#42A5F5', 'preset_24': '#2196F3', 'preset_25': '#448AFF',
        'preset_26': '#3F51B5', 'preset_27': '#5C6BC0', 'preset_28': '#7986CB', 'preset_29': '#9FA8DA', 'preset_30': '#C5CAE9',
        'preset_31': '#D1C4E9', 'preset_32': '#E1BEE7', 'preset_33': '#CE93D8', 'preset_34': '#BA68C8', 'preset_35': '#9C27B0',
        'preset_36': '#AA00FF', 'preset_37': '#D500F9', 'preset_38': '#FF80AB', 'preset_39': '#F48FB1', 'preset_40': '#F50057',
        'preset_41': '#FF4081', 'preset_42': '#FFCDD2', 'preset_43': '#BCAAA4', 'preset_44': '#E0E0E0', 'preset_45': '#9E9E9E',
        'preset_46': '#757575', 'preset_47': '#BDBDBD', 'preset_48': '#FFD54F', 'preset_49': '#FF5722',

        // --- 50 ~ 150: 明るめのグラデーションで拡張 (黒(#FFFFFF)は除外) ---
        // 明るい赤・オレンジ系 (50-60)
        'preset_50': '#FFD0A0', 'preset_51': '#FFB080', 'preset_52': '#FFA080', 'preset_53': '#FF9070', 'preset_54': '#FF8060',
        'preset_55': '#FF7050', 'preset_56': '#FF6040', 'preset_57': '#FFA500', 'preset_58': '#FFC44D', 'preset_59': '#FFD966',
        // 明るい黄・緑系 (60-70)
        'preset_60': '#FFFF99', 'preset_61': '#FFFF66', 'preset_62': '#E6E600', 'preset_63': '#CCFF66', 'preset_64': '#B2FF66',
        'preset_65': '#99FF66', 'preset_66': '#80FF4D', 'preset_67': '#66FF33', 'preset_68': '#4DFF1A', 'preset_69': '#33CC00',
        // 明るいミント・シアン系 (70-80)
        'preset_70': '#66FFB2', 'preset_71': '#4DFFE6', 'preset_72': '#33FFFF', 'preset_73': '#1AFFFF', 'preset_74': '#00FFFF',
        'preset_75': '#00E6E6', 'preset_76': '#00CCCC', 'preset_77': '#00B2B2', 'preset_78': '#009999', 'preset_79': '#008080',
        // 明るい青・紺系 (80-90)
        'preset_80': '#B3CCFF', 'preset_81': '#99B2FF', 'preset_82': '#8099FF', 'preset_83': '#6680FF', 'preset_84': '#4D66FF',
        'preset_85': '#334DFF', 'preset_86': '#1A33FF', 'preset_87': '#0019E6', 'preset_88': '#0000CC', 'preset_89': '#19198C',
        // 明るい紫・マゼンタ系 (90-100)
        'preset_90': '#CCB3FF', 'preset_91': '#B299FF', 'preset_92': '#9980FF', 'preset_93': '#8066FF', 'preset_94': '#664DFF',
        'preset_95': '#4D33FF', 'preset_96': '#331AFF', 'preset_97': '#8000FF', 'preset_98': '#9900CC', 'preset_99': '#B200FF',
        // 明るいピンク・赤紫系 (100-110)
        'preset_100': '#FFB3FF', 'preset_101': '#FF99FF', 'preset_102': '#FF80FF', 'preset_103': '#FF66FF', 'preset_104': '#FF4DFF',
        'preset_105': '#FF33FF', 'preset_106': '#FF1AFF', 'preset_107': '#E600E6', 'preset_108': '#CC00CC', 'preset_109': '#B300B3',
        // 淡いパステルカラー (110-120)
        'preset_110': '#FFB3BA', 'preset_111': '#FFD1AA', 'preset_112': '#FFFFB3', 'preset_113': '#C4FFB3', 'preset_114': '#B3FFD6',
        'preset_115': '#B3FFFF', 'preset_116': '#B3D6FF', 'preset_117': '#D6B3FF', 'preset_118': '#FFB3FF', 'preset_119': '#FFB3D6',
        // 淡いウォームカラー (120-130)
        'preset_120': '#FFE0B2', 'preset_121': '#FFCC80', 'preset_122': '#FFB380', 'preset_123': '#FFAA80', 'preset_124': '#FF9980',
        'preset_125': '#FF8080', 'preset_126': '#F48C8C', 'preset_127': '#FFD740', 'preset_128': '#FFE57F', 'preset_129': '#FFFF8D',
        // 淡いクールカラー (130-140)
        'preset_130': '#E0F7FA', 'preset_131': '#B2EBF2', 'preset_132': '#80DEEA', 'preset_133': '#4DD0E1', 'preset_134': '#26C6DA',
        'preset_135': '#00BCD4', 'preset_136': '#00ACC1', 'preset_137': '#0097A7', 'preset_138': '#00838F', 'preset_139': '#006064',
        // グレー・ブラウン系 (140-150)
        'preset_140': '#D7CCC8', 'preset_141': '#BCAAA4', 'preset_142': '#A1887F', 'preset_143': '#8D6E63', 'preset_144': '#795548',
        'preset_145': '#6D4C41', 'preset_146': '#5D4037', 'preset_147': '#4E342E', 'preset_148': '#3E2723', 'preset_149': '#F5F5F5', // 薄いグレー
        'preset_150': '#E0E0E0' // やや濃いグレー
    };

    const PRESET_UIDS_MAP = {};
    for (let i = 1; i <= 150; i++) {
        PRESET_UIDS_MAP[`preset_${i}`] = `PRESET_${i}_UIDS`;
    }

    async function saveUidSettings(uid, memo, color, includeUid, reset = false) {
        const allSettings = await GM_getValue('UID_SETTINGS', {});
        const allComments = await GM_getValue('COMMENT_MAP', {});
        let customColors = await GM_getValue('CUSTOM_COLORS', {});
        const defaultSettings = await GM_getValue('DEFAULT_SETTINGS', { includeUid: true, enableRandomColors: true }); // デフォルト設定を取得

        let allPresetUids = {};
        for (const key of Object.keys(PRESET_UIDS_MAP)) {
            allPresetUids[key] = await GM_getValue(PRESET_UIDS_MAP[key], []);
            // まず該当UIDを全てのプリセットリストから除外
            allPresetUids[key] = allPresetUids[key].filter(id => id !== uid);
        }

        delete customColors[uid]; // カスタムカラーを一旦削除（後で再追加する可能性あり）

        let isDefaultState = false;

        // 1. デフォルト状態かどうかのチェック
        const isMemoEmpty = memo === '' || memo === null;
        const isColorUnset = !color || color === '';
        const isIncludeUidDefault = includeUid === defaultSettings.includeUid;

        if (reset || (isMemoEmpty && isColorUnset && isIncludeUidDefault)) {
            // リセットボタンが押された、または設定がすべてデフォルトに戻った場合
            isDefaultState = true;
        }

        if (isDefaultState) {
            // 全てのデータを削除
            delete allSettings[uid];
            delete allComments[uid];
            // customColors と allPresetUids からは既に削除済み
        } else {
            // データを保存・更新
            allSettings[uid] = { includeUid: includeUid };
            allComments[uid] = memo;
            if (color && color.startsWith('#')) {
                customColors[uid] = color;
            } else if (PRESET_UIDS_MAP[color]) {
                // プリセットカラーが選択された場合、該当リストに追加
                if (!allPresetUids[color].includes(uid)) {
                    allPresetUids[color].push(uid);
                }
            }
        }

        // GMストレージへの書き込み
        const promises = [
            GM_setValue('UID_SETTINGS', allSettings),
            GM_setValue('COMMENT_MAP', allComments),
            GM_setValue('CUSTOM_COLORS', customColors)
        ];
        for (const key of Object.keys(PRESET_UIDS_MAP)) {
            promises.push(GM_setValue(PRESET_UIDS_MAP[key], allPresetUids[key]));
        }
        await Promise.all(promises);

        // グローバル変数の更新
        for (const key of Object.keys(PRESET_UIDS_MAP)) {
            window[PRESET_UIDS_MAP[key]] = allPresetUids[key];
        }
        COMMENT_MAP = allComments;
        CUSTOM_COLORS = customColors;
        UID_SETTINGS = allSettings; // グローバル変数も忘れずに更新

        // 表示の更新
        updateAllUids();
        await updateUidMemoDisplay(uid);
    }
    function setupScrollListener() {
        const scrollElement = getKomeScrollElement();
        if (scrollElement) {
            scrollElement.addEventListener('scroll', () => checkScrollPosition(scrollElement));
            //console.log(`[${scriptName}] スクロールイベントリスナーを設定しました。`);
        } else {
            // 要素が見つからなかった場合、少し待って再試行
            setTimeout(setupScrollListener, 500);
        }
    }

    async function init() {
        [
            COMMENT_MAP,
            UID_SETTINGS,
            CUSTOM_COLORS,
            DEFAULT_SETTINGS
        ] = await Promise.all([
            GM_getValue('COMMENT_MAP', {}),
            GM_getValue('UID_SETTINGS', {}),
            GM_getValue('CUSTOM_COLORS', {}),
            GM_getValue('DEFAULT_SETTINGS', {
                includeUid: true,
                enableRandomColors: true,
                ...DEFAULT_RANDOM_COLOR_SETTINGS
                // ランダムカラーの調整値の初期値
            })
        ]);

        const presetPromises = [];
        for (const key of Object.keys(PRESET_UIDS_MAP)) {
            presetPromises.push(GM_getValue(PRESET_UIDS_MAP[key], []));
        }
        const presetResults = await Promise.all(presetPromises);
        let i = 0;
        for (const key of Object.keys(PRESET_UIDS_MAP)) {
            window[PRESET_UIDS_MAP[key]] = presetResults[i];
            i++;
        }

        await waitForElement('#klog_view', (element) => {
            komeScrollElement = element;
            initMutationObserver();
            setupGlobalClickListener();
            setupScrollListener();

            setTimeout(() => {
                displayUids();
                const komeView = document.getElementById('klog_view');
                if (komeView) {
                    fixYoutubeUrlsInNode(komeView);
                    parseAndReplaceUrl(komeView);
                }
                checkScrollPosition(komeScrollElement); // 初期化時の位置を正確に判定

                if (isScrolledToBottom) {
                    setTimeout(scrollToBottom, 500); // 最下部にいるならスクロールを継続
                }

            }, 1000);
        });
    }

    window.addEventListener('load', init);

    function getRandomColor() {
        const settings = DEFAULT_SETTINGS;

        // 色相 (Hue): 0からrandomHueRangeまでの範囲で乱数を生成
        let hue = Math.floor(Math.random() * settings.randomHueRange);

        hue = (hue + settings.randomHueStart) % 360;

        // 彩度 (Saturation): 最小値から最大値の範囲
        const satRange = settings.randomSatMax - settings.randomSatMin;
        const saturation = Math.floor(Math.random() * satRange) + settings.randomSatMin;

        // 明度 (Lightness): 最小値から最大値の範囲
        const lightRange = settings.randomLightMax - settings.randomLightMin;
        const lightness = Math.floor(Math.random() * lightRange) + settings.randomLightMin;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    GM_addStyle(`
        .klog_content .kcomm_wrap {
            position: relative;
            box-sizing: border-box !important;
            line-height: 1.33 !important;
            font-size: 12px !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            height: auto !important;
            min-height: 20px !important;

        }
        .klog_content .kcomm_wrap .kcomm {
            display: inline-block !important;
            height: auto !important;
            line-height: 1.33 !important;
            font-size: 12px !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }

        .klog_content .kcomm_wrap .inserted-uid {
            display: inline-block !important;
            width: 35px !important;
            text-align: center !important;
            font-size: 0.8em !important;
            font-weight: bold !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            box-sizing: border-box !important;
            cursor: pointer;
            min-height: 18px !important;
            line-height: 1.33 !important;
            padding-top: 3px !important;
            vertical-align: middle !important;
        }

        .klog_content .kcomm_wrap .inserted-uid:hover {
            opacity: 0.8;
        }

        .klog_content .kcomm_wrap .kkick {
            display: none;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.95);
            width: 10px;
            text-align: center;
            vertical-align: top;
            padding: 5px !important;
            color: #eee;
            text-decoration: none;
            font-size: 3pt;
            cursor: pointer;
        }

        .klog_content .kcomm_wrap .kkick.visible {
            display: inline-block !important;
        }
        .klog_content .kcomm_wrap .kdtag {
            vertical-align: middle !important;
            display: inline-block !important;
        }
        .klog_content .kcomm_wrap .kdtag kt {
            vertical-align: middle;
        }
        .klog_content .kcomm_wrap .kcomm_base > * {
            vertical-align: middle;
        }
        .klog_content .kcomm_wrap .kcomm_base {
            display: inline !important;
            vertical-align: middle; !important;
            height: auto !important;
            line-height: 16px !important;
        }

        /* 自分のUIDのスタイルをCSSで強制的に固定 */
        .klog_content .kcomm_wrap.my-comment .inserted-uid.my-uid-display {
            content: attr(data-my-name) !important;
            cursor: text !important;
            text-align: center !important;
            color: #FFFFFF !important;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px #000000;
            width: 35px !important;
            background-color: transparent !important;
            display: inline-block !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
        }
        .klog_content .kcomm_wrap.my-comment .inserted-uid:empty:before {
            content: 'Your Name';
            opacity: 0.5;
        }
        /* kkorabo (サムネイル画像) 以外の画像にのみサイズ制約を適用する */
        .klog_content .kcomm_wrap img:not(.kkorabo),
        .klog_content .kcomm_wrap a img:not(.kkorabo) {
            vertical-align: middle !important;
            max-width: 100% !important;
            height: auto !important;
        }
        /* 画像サムネイルのサイズを縦横比を保ちつつ、高さを80pxに制限 */
        .klog_content .kcomm_wrap img.kkorabo {
            height: 80px !important;
            width: auto !important;
            line-height: normal !important;
            vertical-align: top !important;
        }

        /* 以下はUID設定UIのスタイルです。 */
        .uid-settings-ui {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            padding: 10px !important;
            background-color: #f5f5f5 !important;
            color: #333 !important;
            filter: invert(0) hue-rotate(0deg) !important;
        }
        .ui-hr {
            margin: 15px 0;
            border: 0;
            border-top: 1px solid #ddd;
        }
        .ui-button {
            width: 100%;
            padding: 8px 12px;
            margin-top: 5px;
            background-color: #e0e0e0;
            border: 1px solid #aaa;
            color: #333;
            border-radius: 4px;
            cursor: pointer;
            box-sizing: border-box;
        }
        .primary-button {
            background-color: #2196F3; /* 青 */
            color: #fff;
            width: auto;
            margin-right: 5px;
            display: inline-block;
        }
        .secondary-button {
        width: auto;
        display: inline-block;
        }
        /* --- 折りたたみUI (Accordion) のスタイル --- */
        .ui-accordion {
            border: 1px solid #ddd;
            border-radius: 6px;
            margin-bottom: 10px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .ui-accordion-summary {
            padding: 3px;
            font-weight: bold;
            cursor: pointer;
            color: #333 !important;
        }
        .ui-accordion-content {
            padding: 5px;
            border-top: 1px solid #eee;
        }
        .uid-settings-ui input[type="color"] {
            -webkit-appearance: none;
            border: none;
            width: 30px;
            height: 30px;
            padding: 0;
            margin: 0;
            background-color: transparent;
            cursor: pointer;
            border: 1px solid #555;
            border-radius: 5px;
            vertical-align: middle;
        }
        .uid-settings-ui input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
        }
        .uid-settings-ui input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 5px;
        }
        .uid-settings-ui button {
            padding: 5px 10px;
            font-size: 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .uid-settings-ui .color-preset-container {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
        }
        .uid-settings-ui .color-swatch {
            width: 15px;
            height: 15px;
            border: 1px solid #555;
            border-radius: 3px;
            cursor: pointer;
            transition: transform 0.1s ease-in-out;
            position: relative;
        }
        .uid-settings-ui .color-swatch:hover {
            transform: scale(1.1);
        }
        .uid-settings-ui .color-swatch.selected {
            border: 2px solid #00bfff;
            box-shadow: 0 0 5px #00bfff;
        }
        .uid-settings-ui .color-swatch::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 2px solid transparent;
            border-radius: 4px;
            pointer-events: none;
        }
        .uid-settings-ui .color-swatch.selected::after {
            border-color: #007bff;
        }
        /* 設定UI内のスライダーの基本スタイル */
        .uid-settings-ui input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: #ccc;
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
            border-radius: 4px;
            vertical-align: middle;
        }
        .uid-settings-ui input[type="range"]:hover {
            opacity: 1;
        }
        .uid-settings-ui input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #007bff; /* スライダーのつまみ色 */
            cursor: pointer;
            border: 1px solid #fff;
            box-shadow: 0 0 2px rgba(0,0,0,0.5);
        }
        .uid-settings-ui input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #007bff;
            cursor: pointer;
            border: 1px solid #fff;
            box-shadow: 0 0 2px rgba(0,0,0,0.5);
        }
        /* スライダーと現在の値を並べるためのスタイル */
        .uid-settings-ui .slider-group {
            display: flex;
            flex-direction: column; /* 垂直に並べる */
            gap: 3px;
            margin-bottom: 5px;
        }
        .uid-settings-ui .slider-input-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .uid-settings-ui .current-value {
            width: 40px; /* 値の表示領域を確保 */
            text-align: right;
            font-weight: bold;
        }
        .uid-settings-ui input[type="number"] {
            width: 60px;
            padding: 2px;
            border: 1px solid #ccc;
            border-radius: 3px;
            text-align: center;
        }
    `);

    let komeScrollElement = null;
    let DEFAULT_RANDOM_COLOR_SETTINGS = {
        randomHueRange: 360, // 色相の範囲 (0-360)
        randomHueStart: 0, // 色相の開始角度 (オフセット)
        randomSatMin: 70, // 最小彩度 (0-100)
        randomSatMax: 90, // 最大彩度 (0-100)
        randomLightMin: 60, // 最小明度 (0-100)
        randomLightMax: 80 // 最大明度 (0-100)
    };

    function getKomeScrollElement() {
        if (!komeScrollElement) {
            komeScrollElement = document.querySelector('#klog_view');
        }
        return komeScrollElement;
    }
    /**
     * 既に<a>タグになっているが、'='記号が抜けているなど不正なURLを修正します。
     * @param {Node} node 処理対象のDOMノード
     */
    function fixYoutubeUrlsInNode(node) {
        const links = node.querySelectorAll('a[href]');

        links.forEach(link => {
            const href = link.href;
            let videoId = null;

            // 1. youtube.com/watch?v の形式からIDを抽出
            const watchIdRegex = /watch\?v(=)?([a-zA-Z0-9_-]{11})/;
            const watchMatch = href.match(watchIdRegex);

            // 2. youtu.be/ の形式からIDを抽出
            const shortIdRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
            const shortMatch = href.match(shortIdRegex);

            // 抽出ロジックをシンプルに
            if (watchMatch) {
                videoId = watchMatch[2];
            } else if (shortMatch) {
                videoId = shortMatch[1];
            }

            if (videoId) {
                let finalUrl = `https://www.youtube.com/watch?v=${videoId}`;

                // クエリパラメータ抽出を動画IDの直後を対象に限定
                const extraMatch = href.match(/([a-zA-Z0-9_-]{11})([&?#].*)/);

                if (extraMatch) {
                    let extra = extraMatch[2];
                    // クエリパラメータとして正しい形式になるよう修正
                    extra = extra.replace(/&amp;/g, '&');
                    // 既にv=があるため、追加パラメータの先頭が?の場合は&に修正
                    if (extra.startsWith('?')) {
                        extra = extra.replace('?', '&');
                    }
                    finalUrl += extra;
                }

                link.href = finalUrl;
                link.textContent = finalUrl;
            }
        });
    }

    /**
     * テキストノード内のYouTube URLを検索し、リンクに変換して修正します。
     * @param {Node} node 処理対象のDOMノード
     */
    function parseAndReplaceUrl(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            // watch?v(=)? or youtu.be/ の後に11文字ID、その後にクエリパラメータが続く場合も許可
            // 1: プロトコルとホスト名, 2: =（あれば）, 3: 動画ID, 4: クエリパラメータ
            const youtuBeRegex = /(https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\??v(=)?))([a-zA-Z0-9_-]{11})([&?#].*)?/g;
            const matches = [...text.matchAll(youtuBeRegex)];

            if (matches.length > 0) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                matches.forEach(match => {
                    const matchStart = match.index;
                    const matchEnd = match.index + match[0].length;

                    if (matchStart > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
                    }

                    const videoId = match[3];

                    let finalUrl = `https://www.youtube.com/watch?v=${videoId}`;

                    // タイムスタンプなどの追加クエリパラメータを保持
                    const extraParams = match[4] || '';
                    if (extraParams) {
                        // クエリパラメータとして正しい形式になるよう修正
                        let extra = extraParams.replace(/&amp;/g, '&');

                        // v=の後に続く情報が?の場合は&に修正（重複防止）
                        if (extra.startsWith('?')) {
                            extra = extra.replace('?', '&');
                        }

                        // 既にv=があるため、追加パラメータを連結
                        finalUrl += extra;
                    }

                    const a = document.createElement('a');
                    a.href = finalUrl;
                    a.textContent = finalUrl;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    fragment.appendChild(a);

                    lastIndex = matchEnd;
                });

                if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                node.parentNode.replaceChild(fragment, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // スクリプトとスタイルタグをスキップ対象に追加することで、より安全に（Kome UID display側には不要かもしれませんが念のため）
            if (node.tagName !== 'A' && node.tagName !== 'BUTTON' && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                for (const childNode of node.childNodes) {
                    parseAndReplaceUrl(childNode);
                }
            }
        }
    }

    // カーソルを末尾に移動させる関数
    function setCursorToEnd(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    async function processSingleKcommWrap(wrap) {
        try {
        // 1. スクロール要素を取得
        const scrollElement = getKomeScrollElement();
        if (!scrollElement) return false; // 要素がなければ処理を終了 (以前はtrueだったが、UID未処理のためfalseがより適切)

        if (wrap.classList.contains('uid-processed')) {
            return false;
        }
        wrap.classList.add('uid-processed');

        // システムメッセージ（sound属性があるもの）の早期判定
        if (wrap.closest('klog[sound]')) {
            return false;
        }

        const kkickLink = wrap.querySelector('.kkick');
        const kdtagElement = wrap.querySelector('.kdtag');

        const isMyComment = !kkickLink && wrap.closest('klog') && wrap.closest('klog').style.color === 'yellow';

        let uid;
        if (isMyComment) {
            uid = 'My_UID';
        } else if (kkickLink) {
            uid = kkickLink.getAttribute('uid');
        } else {
            return false;
        }

        const isStandardPost = !!kdtagElement;
        if (!isStandardPost) {
            return false;
        }

        const kcommBase = wrap.querySelector('.kcomm_base');

        if (isMyComment) {
            const myName = await GM_getValue('my_uid_name', 'Name');
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.maxLength = 5;
            nameInput.value = myName;
            nameInput.classList.add('inserted-uid', 'my-comment', 'my-uid-display');
            nameInput.style.cssText = `
                border: none;
                background: none;
                color: inherit;
                width: 5ch;
                padding: 0;
                font-size: 0.8em;
                font-family: inherit;
                text-align: center;
                cursor: text;
            `;
            nameInput.removeAttribute('data-darkreader-inline-color');
            nameInput.style.setProperty('color', 'yellow', 'important');
            nameInput.style.setProperty('background-color', 'transparent', 'important'); // 背景色を透明に固定
            nameInput.style.removeProperty('--darkreader-inline-color');
            nameInput.style.removeProperty('--darkreader-inline-bgcolor');

            nameInput.addEventListener('blur', async () => {
                let newName = nameInput.value.trim();
                if (newName === '') {
                    newName = 'Name';
                }
                await GM_setValue('my_uid_name', newName);
            });

            if (kcommBase) {
                kcommBase.prepend(nameInput);
            } else {
                wrap.prepend(nameInput);
            }
        } else {
            const uidToDisplay = uid;
            const uidElement = document.createElement('span');
            uidElement.className = 'inserted-uid';
            // UIDごとに一意のIDを付与し、CSSでターゲットにする
            uidElement.id = `uid-color-override-${uidToDisplay}`;

            const uidSettings = await GM_getValue(`uid_settings_${uid}`, null);
            const defaultSettings = await GM_getValue('DEFAULT_SETTINGS', { includeUid: true, enableRandomColors: true });

            uidElement.textContent = uidToDisplay;
            uidElement.addEventListener('click', (e) => {
                e.stopPropagation();
                showSettingsUI(uidElement, uidToDisplay);
            });
            updateUidColor(uidElement, uidToDisplay, null, uidSettings, defaultSettings);
            updateTooltip(uidElement, uidToDisplay);

            if (kcommBase) {
                kcommBase.prepend(uidElement);
            } else {
                wrap.prepend(uidElement);
            }
        }

        if (!scrollElement) return true; // 要素がなければ何もしない

        // 2. 現在のスクロール位置をチェック（直前のDOM変更の影響を見るため）
        checkScrollPosition(scrollElement);

        const imageElement = wrap.querySelector('img.kkorabo');

        // 条件付きでスクロールを実行する共通の関数
        const conditionalScroll = () => {
            // 画像読み込み完了時や画像がない場合、最下部にいる場合のみスクロールを実行
            checkScrollPosition(scrollElement);
            if (isScrolledToBottom) {
                // スムーズなスクロールのためにscrollToBottomを呼び出す
                scrollToBottom(scrollElement);
            }
        };

        if (imageElement) {
            // 画像がある場合：ロード完了時のみ判定付きスクロール

            // 描画フレームを待つラッパー関数
            const scrollAfterPaint = () => {
                // 画像の高さが確定した後の描画完了を待つ
                window.requestAnimationFrame(() => {
                    // 画像挿入で isScrolledToBottom が false になる問題を回避するため、
                    // ここでは判定を省略し、isScrolledToBottomがtrueの場合のみ直接スクロール
                    if (isScrolledToBottom) {
                        scrollToBottom(scrollElement);
                    }
                });
            };

            imageElement.addEventListener('load', scrollAfterPaint);

            // 既に完了している場合も判定付きスクロール
            if (imageElement.complete) {
                scrollAfterPaint();
            }
            // 画像がある場合、画像ロード前はスクロールしない
        } else {
            // 画像がない場合（外部拡張機能による後入れの可能性があるケース）

            // コメント内容を取得し、URLが含まれているかチェック
            const commentText = wrap.textContent || '';
            const hasUrl = /(http|https):\/\/[^\s]+/.test(commentText);
            const isTwitterUrl = /(twitter\.com|x\.com)/i.test(commentText);

            if (hasUrl && !isTwitterUrl) {
                // 処理開始時の「底にいたか」を一時的にメモ
                const wasScrolledToBottom = isScrolledToBottom;

                // 1. まず、テキストが表示された瞬間にスクロール
                if (wasScrolledToBottom) {
                    scrollToBottom(scrollElement, false); // スムーズ
                }

                // 2. PageExpand等の後入れ要素を想定して、時間差で「追い打ち」スクロール
                window.requestAnimationFrame(() => {
                    setTimeout(() => {
                        // 最初に底にいたなら、画像が出てきた後でも強制的に底へ移動
                        if (wasScrolledToBottom) {
                            scrollToBottom(scrollElement, true); // 画像分は即時(true)で補正
                        }
                    }, 500);
                });

            } else {
                // 通常コメントの場合
                checkScrollPosition(scrollElement);
                if (isScrolledToBottom) {
                    scrollToBottom(scrollElement, false);
                }
            }
        }

        return true;
            } catch (e) { // catch ブロックの開始
            // エラーが発生しても、ログに出力するだけで処理は中断しない
            console.error('Kome UID display: Error processing kcomm_wrap:', e);

            // UID未処理に戻すことで、再実行の機会を与える（オプション）
            wrap.classList.remove('uid-processed');
            return false;
        } // catch ブロックの終了
    }

    function setupGlobalClickListener() {
        const klogView = document.querySelector('#klog_view');
        if (!klogView) return;

        klogView.addEventListener('click', (e) => {
            const clickedKcommBase = e.target.closest('.kcomm_base');
            const currentlyVisible = document.querySelector('.kkick.visible');

            if (clickedKcommBase) {
                const kkickButton = clickedKcommBase.querySelector('.kkick');

                if (kkickButton) {
                    if (kkickButton === currentlyVisible) {
                        kkickButton.classList.remove('visible');
                    } else {
                        if (currentlyVisible) {
                            currentlyVisible.classList.remove('visible');
                        }
                        kkickButton.classList.add('visible');
                    }
                }
            } else {
                if (currentlyVisible) {
                    currentlyVisible.classList.remove('visible');
                }
            }
        });
    }

    async function updateUidColor(uidElement, uid) {
        if (!uidElement) {
            // 見つからなかった場合、エラーではなく情報としてコンソールに表示
            console.info(`[${GM.info.script.name}] UIDエレメントがクリック時に見つかりませんでした。UID: ${uid}`);
            return;
        }
        if (uidElement.classList.contains('my-uid-display')) {
            return;
        }

        const defaultSettings = await GM_getValue('DEFAULT_SETTINGS', { includeUid: true, enableRandomColors: true });

        // 既存のプリセットとカスタムカラーのロジック
        let isPreset = false;
        let presetKey = null;
        for (const key of Object.keys(PRESET_UIDS_MAP)) {
            if (window[PRESET_UIDS_MAP[key]]?.includes(uid)) {
                uidElement.style.backgroundColor = PRESET_COLORS[key];
                isPreset = true;
                presetKey = key;
                break;
            }
        }

        if (isPreset) {
            const hex = PRESET_COLORS[presetKey];
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            const y = (0.299 * r + 0.587 * g + 0.114 * b);
            uidElement.style.setProperty('background-color', hex, 'important');
            uidElement.style.setProperty('color', (y > 128) ? '#000000' : '#FFFFFF', 'important');
            uidElement.style.removeProperty('--darkreader-inline-bgcolor');
            uidElement.style.removeProperty('--darkreader-inline-color');
            uidElement.setAttribute('data-darkreader-inline-bgcolor', '');
            uidElement.setAttribute('data-darkreader-inline-color', '');
            return;
        }

        const customColor = CUSTOM_COLORS[uid];
        if (customColor && customColor.startsWith('#')) {
            uidElement.style.setProperty('background-color', customColor, 'important');
            uidElement.setAttribute('data-darkreader-inline-bgcolor', '');
            const r = parseInt(customColor.substring(1, 3), 16);
            const g = parseInt(customColor.substring(3, 5), 16);
            const b = parseInt(customColor.substring(5, 7), 16);
            const y = (0.299 * r + 0.587 * g + 0.114 * b);
            uidElement.style.setProperty('color', (y > 128) ? '#000000' : '#FFFFFF', 'important');
            uidElement.setAttribute('data-darkreader-inline-color', '');
            uidElement.style.removeProperty('--darkreader-inline-bgcolor');
            uidElement.style.removeProperty('--darkreader-inline-color');
            return;
        }

        if (defaultSettings.enableRandomColors) {
            uidElement.style.backgroundColor = '';
            let uidColor = uidColorMap[uid];
            if (!uidColor) {
                uidColor = getRandomColor();
                uidColorMap[uid] = uidColor;
            }
            // Dark Readerの文字色関連の属性と変数を削除
            uidElement.removeAttribute('data-darkreader-inline-color');
            uidElement.style.removeProperty('--darkreader-inline-color');

            // ランダムカラーを文字色として強制適用
            uidElement.style.setProperty('color', uidColor, 'important');

            // 背景色とフィルターのリセット（念のため）
            uidElement.style.setProperty('background-color', 'transparent', 'important');
            uidElement.style.setProperty('filter', 'none', 'important');
        } else {
            // ランダムカラーを無効にする場合の処理
            uidElement.style.backgroundColor = '';
            uidElement.style.color = 'inherit';
            uidElement.style.setProperty('filter', 'none', 'important'); // Dark Reader対策
        }
    }
    /**
     * 特定のUIDを持つすべてのコメント要素のメモ/ツールチップ表示を更新します。
     * @param {string} uid - 更新対象のUID
     */
    async function updateUidMemoDisplay(uid) {
        const uidSettings = UID_SETTINGS[uid] || {};
        const currentMemo = COMMENT_MAP[uid] || '';
        // デフォルト設定のみ非同期で取得する
        const defaultSettings = await GM_getValue('DEFAULT_SETTINGS', { includeUid: true, enableRandomColors: true });
        const currentIncludeUid = uidSettings.includeUid ?? defaultSettings.includeUid;

        let memoText = currentMemo;

        // UIDを含めるかどうかのロジック
        if (currentIncludeUid && memoText) {
            memoText = `UID: ${uid}\n${memoText}`;
        } else if (currentIncludeUid) {
            // メモが空で、UIDを含める設定の場合
            memoText = `UID: ${uid}`;
        }

        // 該当UIDのすべての要素を探す
        const uidElements = document.querySelectorAll(`.inserted-uid[title$="${uid}"]`);

        uidElements.forEach(uidElement => {
            // コメント要素の親（メモをツールチップとして表示している要素）を取得
            let targetElement = uidElement.closest('.kcomm_base') || uidElement.closest('.kcomm_wrap');

            if (targetElement) {
                // メモ/ツールチップ（title属性）を最新の内容で再適用
                targetElement.setAttribute('title', memoText);
            }
        });
    }

    function updateAllUids() {
        const uidElements = document.querySelectorAll('.inserted-uid');
        uidElements.forEach(uidElement => {
            if (uidElement.classList.contains('my-uid-display')) {
                return;
            }
            const uid = uidElement.textContent;
            if (uid) {
                updateUidColor(uidElement, uid);
                updateTooltip(uidElement, uid);
            }
        });
    }

    function updateTooltip(uidElement, uid) {
        const memo = COMMENT_MAP[uid];
        const settings = UID_SETTINGS[uid] || { includeUid: false };
        const uidPrefix = settings.includeUid ? `UID: ${uid}` : '';
        const tooltipText = (uidPrefix + (uidPrefix && memo ? '\n' : '') + (memo || '')).trim();

        if (tooltipText) {
            uidElement.title = tooltipText;
        } else {
            uidElement.removeAttribute('title');
        }
    }

    async function showSettingsUI(targetElement, uid) {
        const existingUI = document.querySelector('.uid-settings-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const settingsUI = document.createElement('div');
        settingsUI.className = 'uid-settings-ui';
        settingsUI.style.cssText = `
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            z-index: 1000;
            min-width: 250px;
            color: #333;
        `;

        const currentMemo = COMMENT_MAP[uid] || '';
        const uidSettings = UID_SETTINGS[uid] || {};
        const defaultSettings = await GM_getValue('DEFAULT_SETTINGS', {
            ...DEFAULT_RANDOM_COLOR_SETTINGS,
            includeUid: true,
            enableRandomColors: true
        });
        const currentIncludeUid = uidSettings.includeUid ?? defaultSettings.includeUid;

        const currentCustomColor = CUSTOM_COLORS[uid] || '';
        let currentPreset = null;
        for (const key of Object.keys(PRESET_UIDS_MAP)) {
            if (window[PRESET_UIDS_MAP[key]]?.includes(uid)) {
                currentPreset = key;
                break;
            }
        }

        let presetSwatchesHtml = '';
        for (const [key, color] of Object.entries(PRESET_COLORS)) {
            const isSelected = currentPreset === key;
            presetSwatchesHtml += `<div
                class="color-swatch ${isSelected ? 'selected' : ''}"
                data-color="${color}"
                data-preset-name="${key}"
                style="background-color: ${color} !important;
                       --darkreader-inline-bgcolor: initial !important;"
                       data-darkreader-inline-bgcolor=""
            ></div>`;
        }

        settingsUI.innerHTML = `
    <div style="font-size:0.8em; color:#333; margin-bottom: 5px;">UID: <span style="font-weight:bold; color:#000;">${uid}</span> の設定</div>
    <label for="uid-memo" style="font-weight: bold;">メモ:</label><span style="font-size:0.8em; color:#555; margin-left: 5px;">（ツールチップとして表示されます）</span>
    <textarea id="uid-memo" style="width: 90%; background-color:#fff; color:#000; border:1px solid #ccc; padding:2px; height: 50px; resize: vertical;">${currentMemo}</textarea>
    <br>
    <input type="checkbox" id="include-uid-in-memo" style="margin-right: 5px;" ${currentIncludeUid ? 'checked' : ''}>
    <label for="include-uid-in-memo">メモにUIDを含める</label>
    <br>
    <span style="font-weight: bold;">背景色:</span><span style="font-size:0.8em; color:#555; margin-left: 5px;">（特定のUIDを目立たせたい時に）</span>
    <div id="preset-pagination-selector" style="margin-bottom: 5px;">
        <input type="radio" name="preset-page" id="page-1" value="1" checked>
        <label for="page-1" style="margin-right: 10px;">1 - 50</label>

        <input type="radio" name="preset-page" id="page-2" value="2">
        <label for="page-2" style="margin-right: 10px;">51 - 100</label>

        <input type="radio" name="preset-page" id="page-3" value="3">
        <label for="page-3">101 - 150</label>
    </div>

    <div class="color-preset-container" id="color-preset-swatches">
        </div>

    <hr style="border: none; border-top: 1px dashed #ccc; margin: 10px 0;">

    <input type="color" id="uid-color-picker" value="${currentCustomColor || '#000000'}">
    <span style="font-size:0.8em; color:#555; margin-left: 5px;">カスタムカラー</span>
    <button id="no-color-button" style="margin-left: auto; background-color: #fff; border: 1px solid #aaa; color: #333;">背景色取り消し</button>
    </div>

    <button id="save-uid-settings" class="ui-button primary-button">設定を保存</button>
    <button id="reset-uid-settings" class="ui-button secondary-button">リセット</button>

    <hr class="ui-hr">

    <details id="default-settings-details" class="ui-accordion">
        <summary class="ui-accordion-summary">デフォルト設定</summary>

        <div class="ui-accordion-content">
            <input type="checkbox" id="default-include-uid" style="margin-right: 5px;" ${defaultSettings.includeUid ? 'checked' : ''}>
            <label for="default-include-uid">メモにUIDを含める</label>
            <br>
            <input type="checkbox" id="default-random-colors" style="margin-right: 5px;" ${defaultSettings.enableRandomColors ? 'checked' : ''}>
            <label for="default-random-colors">ランダムカラーを有効にする</label>

            <div style="margin-top: 10px; font-size: 0.85em; background-color: #eee; padding: 5px; border-radius: 4px; color: #333;">
                <div style="font-weight: bold; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                    ランダムカラーの調整 (H/S/L)
                    <div id="hue-ring-container" style="
                        position: relative;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        overflow: hidden;
                        filter: none !important;
                        --darkreader-inline-filter: none !important;
                    " data-darkreader-inline-filter="">

                        <div id="hue-ring-visual" style="width: 100%; height: 100%; border-radius: 50%; position: absolute; top: 0px; left: 0px; background: conic-gradient(rgb(255, 26, 26), rgb(255, 255, 26), rgb(26, 255, 26), rgb(26, 255, 255), rgb(26, 26, 255), rgb(255, 26, 255), rgb(255, 26, 26)); filter: brightness(1.27273) saturate(0.8); --darkreader-inline-filter: none !important; opacity: 1 !important; mix-blend-mode: normal !important; --darkreader-inline-bgimage: conic-gradient(var(--darkreader-background-ff1a1a, #bc0000), var(--darkreader-background-ffff1a, #8d8d00), var(--darkreader-background-1aff1a, #2fbc00), var(--darkreader-background-1affff, #00bcbc), var(--darkreader-background-1a1aff, #0000bc), var(--darkreader-background-ff1aff, #bc00bc), var(--darkreader-background-ff1a1a, #bc0000)); --darkreader-inline-bgcolor: initial; transform: rotate(0deg);" data-darkreader-inline-filter="" data-darkreader-inline-bgimage="" data-darkreader-inline-bgcolor=""></div>

                        <div id="hue-ring-mask" style="width: 100%; height: 100%; border-radius: 50%; position: absolute; top: 0px; left: 0px; background: black; transform-origin: 50% 50%; mix-blend-mode: color; opacity: 0; --darkreader-inline-bgimage: initial; --darkreader-inline-bgcolor: var(--darkreader-background-000000, #000000);" data-darkreader-inline-bgimage="" data-darkreader-inline-bgcolor=""></div>

                        <div style="width: 60%; height: 60%; border-radius: 50%; background-color: rgb(238, 238, 238); position: absolute; top: 20%; left: 20%; filter: none !important; --darkreader-inline-filter: none !important; --darkreader-inline-bgcolor: var(--darkreader-background-eeeeee, #222426);" data-darkreader-inline-filter="" data-darkreader-inline-bgcolor=""></div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 3px; margin-top: 5px;">

                    <label for="random-hue-range-slider">色相の範囲 (Hue 0-360):</label>
                    <div class="slider-input-row">
                        <input type="range" id="random-hue-range" min="0" max="360" step="1" value="${defaultSettings.randomHueRange}">
                        <span id="random-hue-range-value" class="current-value">${defaultSettings.randomHueRange}</span>
                    </div>

                    <label for="random-hue-start-slider">色相の開始角度 (Hue 0-360):</label>
                    <div class="slider-input-row">
                        <input type="range" id="random-hue-start" min="0" max="360" step="1" value="${defaultSettings.randomHueStart}">
                        <span id="random-hue-start-value" class="current-value">${defaultSettings.randomHueStart}</span>
                    </div>

                    <label>彩度 (Saturation %):</label>
                    <div class="slider-group">
                        <div class="slider-input-row" style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
                            Min: <input type="range" id="random-sat-min" min="0" max="100" step="1" value="${defaultSettings.randomSatMin}" style="flex-grow: 1; margin: 0;">
                            <span id="random-sat-min-value" class="current-value">${defaultSettings.randomSatMin}</span>
                        </div>
                        <div class="slider-input-row" style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
                            Max: <input type="range" id="random-sat-max" min="0" max="100" step="1" value="${defaultSettings.randomSatMax}" style="flex-grow: 1; margin: 0;">
                            <span id="random-sat-max-value" class="current-value">${defaultSettings.randomSatMax}</span>
                        </div>
                    </div>

                    <label>明度 (Lightness %):</label> <span style="font-size: 0.8em; color: #666;">(0: 真っ黒, 100: 真っ白)</span>
                    <div class="slider-group">
                        <div class="slider-input-row" style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
                            Min: <input type="range" id="random-light-min" min="0" max="100" step="1" value="${defaultSettings.randomLightMin}" style="flex-grow: 1; margin: 0;">
                            <span id="random-light-min-value" class="current-value">${defaultSettings.randomLightMin}</span>
                        </div>
                        <div class="slider-input-row" style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
                            Max: <input type="range" id="random-light-max" min="0" max="100" step="1" value="${defaultSettings.randomLightMax}" style="flex-grow: 1; margin: 0;">
                            <span id="random-light-max-value" class="current-value">${defaultSettings.randomLightMax}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button id="save-default-settings" class="ui-button" style="margin-left: 0; margin-top: 10px;">保存</button>
        </div>
    </details>

    <hr class="ui-hr">

    <details id="import-export-details" class="ui-accordion">
        <summary class="ui-accordion-summary">設定のインポート/エクスポート</summary>

        <div class="ui-accordion-content">
            <div style="font-size: 0.8em; color:#555; margin-bottom: 10px;">※バックアップや別PCへの移行に便利です。</div>
            <button id="export-button" class="ui-button">設定をJSONファイルとしてダウンロード</button>
            <hr style="border-color: #ddd;">
            <div style="font-weight: bold; margin-bottom: 5px;">設定のインポート (ファイルから)</div>
            <input type="file" id="import-file-input" accept=".json" style="width: 100%; box-sizing: border-box; margin-bottom: 5px;">
            <button id="import-button" class="ui-button">インポート実行</button>
            <div style="font-size: 0.8em; color:#555; margin-top: 5px;">※ファイルを選択後に「インポート実行」ボタンを押してください。</div>
        </div>
    </details>
`;
        /**
         * 指定されたページのスウォッチHTMLを生成し、コンテナに挿入する
         * @param {number} page - 1, 2, or 3
         * @param {string} currentPreset - 現在選択されているプリセットキー
         */
        const renderPresetSwatches = (page, currentPreset) => {
            const container = settingsUI.querySelector('#color-preset-swatches');
            if (!container) return;

            const start = (page - 1) * 50 + 1;
            const end = page * 50;

            let html = '';
            for (let i = start; i <= end; i++) {
                const key = `preset_${i}`;
                const color = PRESET_COLORS[key];

                // プリセットが存在しない場合はスキップ
                if (!color) continue;

                const isSelected = currentPreset === key;
                html += `<div
                    class="color-swatch ${isSelected ? 'selected' : ''}"
                    data-color="${color}"
                    data-preset-name="${key}"
                    style="background-color: ${color} !important; --darkreader-inline-bgcolor: initial !important;"
                    data-darkreader-inline-bgcolor=""
                ></div>`;
            }
            container.innerHTML = html;

            // スウォッチの再描画後、イベントリスナーを再設定
            attachPresetSwatchListeners(container);
        };
        /**
         * スウォッチコンテナにプリセットクリックリスナーを設定する
         * @param {HTMLElement} container - スウォッチが含まれるコンテナ要素 (#color-preset-swatches)
         */
        const attachPresetSwatchListeners = (container) => {
            const presetSwatches = container.querySelectorAll('.color-swatch');

            presetSwatches.forEach(swatch => {
                swatch.addEventListener('click', async () => {
                    const presetName = swatch.dataset.presetName;

                    // UIの選択状態を更新 (同じページの他のスウォッチを解除)
                    const allSwatchesInPage = container.querySelectorAll('.color-swatch');
                    allSwatchesInPage.forEach(s => s.classList.remove('selected'));
                    swatch.classList.add('selected');

                    // selectedColor にプリセットキーを設定
                    selectedColor = presetName;

                    // カスタムカラー入力欄とカスタムスウォッチの選択をクリア
                    const colorPicker = settingsUI.querySelector('#uid-color-picker');
                    const customSwatches = settingsUI.querySelectorAll('#custom-color-swatches .color-swatch');

                    if (colorPicker) colorPicker.value = '#000000';
                    if (customSwatches) customSwatches.forEach(s => s.classList.remove('selected'));

                    // UI表示の更新
                    //const currentUidElement = document.querySelector(`.inserted-uid[title$="${uid}"]`); //
                    //updateUidColor(currentUidElement, uid);
                });
            });
        };
        targetElement.parentNode.insertBefore(settingsUI, targetElement.nextSibling);
        const hueRingVisual = settingsUI.querySelector('#hue-ring-visual');
        const hueRingMask = settingsUI.querySelector('#hue-ring-mask');
        const hueRingContainer = settingsUI.querySelector('#hue-ring-container');

        const inputIds = [
            '#random-hue-range', '#random-hue-start',
            '#random-sat-min', '#random-sat-max',
            '#random-light-min', '#random-light-max'
        ];

        const inputElements = inputIds.map(id => settingsUI.querySelector(id)).filter(el => el);
        const valueDisplayElements = {
            range: settingsUI.querySelector('#random-hue-range-value'),
            start: settingsUI.querySelector('#random-hue-start-value'),
            satMin: settingsUI.querySelector('#random-sat-min-value'),
            satMax: settingsUI.querySelector('#random-sat-max-value'),
            lightMin: settingsUI.querySelector('#random-light-min-value'),
            lightMax: settingsUI.querySelector('#random-light-max-value'),
        };

        let animationFrameId = null;

        function updateHueRingVisual() {
            if (!hueRingVisual || !hueRingMask) return;
            // 値の取得は inputElements を使って行う (ただし settingsUI.querySelector は避けられない)
            const range = parseFloat(inputElements[0].value || 0);
            const start = parseFloat(inputElements[1].value || 0);
            const satMin = parseFloat(inputElements[2].value || 0);
            const satMax = parseFloat(inputElements[3].value || 0);
            const lightMin = parseFloat(inputElements[4].value || 0);
            const lightMax = parseFloat(inputElements[5].value || 0);

            // DOMアクセスをローカル変数に置き換え
            if (valueDisplayElements.range) valueDisplayElements.range.textContent = range;
            if (valueDisplayElements.start) valueDisplayElements.start.textContent = start;
            if (valueDisplayElements.satMin) valueDisplayElements.satMin.textContent = satMin;
            if (valueDisplayElements.satMax) valueDisplayElements.satMax.textContent = satMax;
            if (valueDisplayElements.lightMin) valueDisplayElements.lightMin.textContent = lightMin;
            if (valueDisplayElements.lightMax) valueDisplayElements.lightMax.textContent = lightMax;

            const avgSat = (satMin + satMax) / 200;
            const avgLight = (lightMin + lightMax) / 200;
            const brightnessFactor = (avgLight / 0.55);

            const finalSaturate = Math.max(0.01, avgSat);
            const finalBrightness = Math.max(0.01, brightnessFactor);

                hueRingVisual.style.filter = `
                brightness(${finalBrightness})
                saturate(${finalSaturate})
            `;

                const startRotation = -start;
                hueRingVisual.style.transform = `rotate(${startRotation}deg)`;

                if (range >= 360) {
                    // 範囲が360度の場合
                    if (parseFloat(hueRingMask.style.opacity) !== 0) {
                        hueRingMask.style.opacity = '0';
                    }
                } else {
                    // 範囲が360度未満の場合
                    if (parseFloat(hueRingMask.style.opacity) !== 1) {
                        hueRingMask.style.opacity = '1';
                    }

                    hueRingMask.style.background = `
                    conic-gradient(
                    transparent 0deg,
                    transparent ${range}deg,
                    black ${range}deg,
                    black 360deg
                )
            `;
                    // 回転
                    const rotation = (range / 2) - 90;
                    // 連続的な更新を避けるため、値が変化した場合のみ transform を更新
                    if (hueRingMask.style.transform !== `rotate(${rotation}deg)`) {
                        hueRingMask.style.transform = `rotate(${rotation}deg)`;
                    }
                }
        }
        // イベントリスナーの設定
        inputElements.forEach(input => {
            // 'input'イベントが発生したら、requestAnimationFrameを使って描画を最適化する
            input.addEventListener('input', () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                animationFrameId = requestAnimationFrame(updateHueRingVisual);
            });
        });
        // 初回表示時の更新
        updateHueRingVisual();

        const memoInput = settingsUI.querySelector('#uid-memo');
        const saveButton = settingsUI.querySelector('#save-uid-settings');
        const resetButton = settingsUI.querySelector('#reset-uid-settings');
        const noColorButton = settingsUI.querySelector('#no-color-button');
        const colorPicker = settingsUI.querySelector('#uid-color-picker');
        const colorSwatches = settingsUI.querySelectorAll('.color-swatch');

        colorSwatches.forEach(swatch => {
            // Dark Readerが挿入したCSS変数を強制的に削除
            swatch.style.removeProperty('--darkreader-inline-bgcolor');
            swatch.style.removeProperty('--darkreader-inline-color');
        });

        const defaultIncludeUidCheckbox = settingsUI.querySelector('#default-include-uid');
        const defaultRandomColorsCheckbox = settingsUI.querySelector('#default-random-colors');
        const saveDefaultButton = settingsUI.querySelector('#save-default-settings');

        const exportButton = settingsUI.querySelector('#export-button');
        const importButton = settingsUI.querySelector('#import-button');

        settingsUI.addEventListener('click', (e) => e.stopPropagation());

        let selectedColor = currentCustomColor || currentPreset;

        if (currentCustomColor) {
            colorSwatches.forEach(s => s.classList.remove('selected'));
        }

        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                colorSwatches.forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                colorPicker.value = swatch.dataset.color;
                selectedColor = swatch.dataset.presetName;
            });
        });

        colorPicker.addEventListener('input', () => {
            colorSwatches.forEach(s => s.classList.remove('selected'));
            selectedColor = colorPicker.value;
        });

        noColorButton.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('selected'));
            colorPicker.value = '#000000';
            selectedColor = '';
        });

        saveButton.addEventListener('click', async () => {
            const newMemo = memoInput.value.trim();
            const newIncludeUid = settingsUI.querySelector('#include-uid-in-memo').checked;

            await saveUidSettings(uid, newMemo, selectedColor, newIncludeUid);
            settingsUI.remove();
        });

        resetButton.addEventListener('click', async () => {
            if (confirm('このUIDの設定をリセットしますか？')) {
                const defaultSettings = await GM_getValue('DEFAULT_SETTINGS', { includeUid: false, enableRandomColors: true });
                await saveUidSettings(uid, '', '', defaultSettings.includeUid, true); // メモと色を空に
                settingsUI.remove();
            }
        });

        saveDefaultButton.addEventListener('click', async () => {
            const newDefaultIncludeUid = defaultIncludeUidCheckbox.checked;
            const newDefaultRandomColors = defaultRandomColorsCheckbox.checked;
            const newHueRange = parseInt(settingsUI.querySelector('#random-hue-range').value) ?? 360;
            const newHueStart = parseInt(settingsUI.querySelector('#random-hue-start').value) ?? 0;
            const newSatMin = parseInt(settingsUI.querySelector('#random-sat-min').value) ?? 70;
            const newSatMax = parseInt(settingsUI.querySelector('#random-sat-max').value) ?? 90;
            const newLightMin = parseInt(settingsUI.querySelector('#random-light-min').value) ?? 60;
            const newLightMax = parseInt(settingsUI.querySelector('#random-light-max').value) ?? 80;

            await GM_setValue('DEFAULT_SETTINGS', {
                includeUid: newDefaultIncludeUid,
                enableRandomColors: newDefaultRandomColors,
                randomHueRange: Math.min(Math.max(0, newHueRange), 360), // 0-360の範囲に制限
                randomHueStart: Math.min(Math.max(0, newHueStart), 360), // 0-360の範囲に制限
                randomSatMin: Math.min(Math.max(0, newSatMin), 100), // 0-100の範囲に制限
                randomSatMax: Math.min(Math.max(0, newSatMax), 100), // 0-100の範囲に制限
                randomLightMin: Math.min(Math.max(0, newLightMin), 100), // 0-100の範囲に制限
                randomLightMax: Math.min(Math.max(0, newLightMax), 100) // 0-100の範囲に制限
            });
            // グローバル変数DEFAULT_SETTINGSも更新
            DEFAULT_SETTINGS = await GM_getValue('DEFAULT_SETTINGS');

            alert('デフォルト設定が保存されました。次回スクリプト起動時に適用されます。');
        });
        // 色相環の視覚化関数
        const updateHueRing = () => {
            // 入力値を取得。値がない場合はデフォルト値を使用 (HTML側は??を使っていないのでここでは || を使用)
            const range = parseInt(settingsUI.querySelector('#random-hue-range').value) || 360;
            const start = parseInt(settingsUI.querySelector('#random-hue-start').value) || 0;
            const overlay = settingsUI.querySelector('#hue-ring-overlay');

            if (!overlay) return;

            // マスクの開始角度と終了角度を計算
            const darkAngleStart = start;
            const darkAngleEnd = start + range;

            let conicGradient = '';

            if (range >= 360) {
                // 360度全体が選択されている場合は、全体を透明にする
                conicGradient = `rgba(0,0,0,0) 0deg 360deg`;
            } else {
                // 未選択の範囲（暗くする部分）を計算し、透明な選択範囲でマスクする
                conicGradient = `
                    rgba(0, 0, 0, 0.4) 0deg,
                    rgba(0, 0, 0, 0.4) ${darkAngleStart}deg,
                    rgba(0, 0, 0, 0) ${darkAngleStart}deg,
                    rgba(0, 0, 0, 0) ${darkAngleEnd}deg,
                    rgba(0, 0, 0, 0.4) ${darkAngleEnd}deg
                `.replace(/\s/g, ''); // 空白文字を削除
            }

            // CSSのconic-gradientの基準を調整
            overlay.style.backgroundImage = `conic-gradient(${conicGradient})`;
            overlay.style.transform = `rotate(-90deg)`; // グラデーションを時計回りで調整
        };

        // 入力欄にイベントリスナーを設定
        const hueRangeInput = settingsUI.querySelector('#random-hue-range');
        const hueStartInput = settingsUI.querySelector('#random-hue-start');

        // 要素が確実に存在するかチェックしてからイベントリスナーを追加
        if (hueRangeInput) hueRangeInput.addEventListener('input', updateHueRing);
        if (hueStartInput) hueStartInput.addEventListener('input', updateHueRing);

        // 初期表示
        updateHueRing();
        // 1. 現在選択されているプリセットに基づいて初期ページを決定
        let currentPage = 1;

        if (currentPreset) {
            const presetNumber = parseInt(currentPreset.split('_')[1]);
            if (presetNumber >= 51 && presetNumber <= 100) {
                currentPage = 2;
            } else if (presetNumber >= 101 && presetNumber <= 150) {
                currentPage = 3;
            }
        }

        // 2. ラジオボタンのチェックとイベントリスナーの設定 (DOMに挿入されている要素に対して行う)
        const pageInputs = settingsUI.querySelectorAll('input[name="preset-page"]');

        // 初回は現在のプリセットに基づいてラジオボタンをチェック
        const initialPageInput = settingsUI.querySelector(`#page-${currentPage}`);
        if(initialPageInput) {
            initialPageInput.checked = true;
        }

        pageInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const newPage = parseInt(e.target.value);
                // ページ変更時、renderPresetSwatchesを呼び出してスウォッチを更新
                // 注意: currentPreset はスコープ内にあるため参照可能
                renderPresetSwatches(newPage, currentPreset);
            });
        });

        // 3. 初回描画
        renderPresetSwatches(currentPage, currentPreset);

        exportButton.addEventListener('click', exportSettings);

        importButton.addEventListener('click', () => {
            // settingsUIはimportSettingsの外側で定義されているので、引数として渡す
            importSettings(settingsUI);
        });

        document.addEventListener('click', (e) => {
            if (!settingsUI.contains(e.target) && e.target !== targetElement) {
                settingsUI.remove();
            }
        }, { once: true });
    }

    async function exportSettings() {
        try {
            const settingsToExport = {
                'UID_SETTINGS': await GM_getValue('UID_SETTINGS', {}),
                'COMMENT_MAP': await GM_getValue('COMMENT_MAP', {}),
                'CUSTOM_COLORS': await GM_getValue('CUSTOM_COLORS', {}),
                'DEFAULT_SETTINGS': await GM_getValue('DEFAULT_SETTINGS', {})
            };
            const jsonString = JSON.stringify(settingsToExport, null, 2);

            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'kome_uid_settings.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('設定ファイルをダウンロードしました！');

        } catch (err) {
            console.error('設定ファイルの作成またはダウンロードに失敗しました:', err);
            alert('設定ファイルのダウンロードに失敗しました。コンソールを確認してください。');
        }
    }

    async function importSettings(settingsUI) {
        // 1. ファイル入力要素を取得
        const fileInput = settingsUI.querySelector('#import-file-input');

        // 2. ファイルが選択されているか確認
        const file = fileInput.files[0];
        if (!file) {
            alert('インポートするJSONファイルを選択してください。');
            return;
        }

        // FileReaderを使ってファイルの内容を非同期で読み込む
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const jsonText = event.target.result;
                // 3. JSONを解析
                const importedData = JSON.parse(jsonText);

                // 4. 必須キーのチェック
                if (!importedData || !importedData.UID_SETTINGS || !importedData.DEFAULT_SETTINGS) {
                    throw new Error("インポートデータの形式が不正です。ファイルの内容を確認してください。");
                }

                if (confirm('現在の設定を上書きしてインポートしますか？')) {
                    // 5. GMストレージに書き込み
                    await GM_setValue('UID_SETTINGS', importedData.UID_SETTINGS);
                    await GM_setValue('COMMENT_MAP', importedData.COMMENT_MAP);
                    await GM_setValue('CUSTOM_COLORS', importedData.CUSTOM_COLORS);
                    await GM_setValue('DEFAULT_SETTINGS', importedData.DEFAULT_SETTINGS);

                    alert('設定をインポートしました！ページをリロードして反映させてください。');
                    settingsUI.remove();
                }
            } catch (e) {
                alert('ファイルの読み込みまたは解析に失敗しました。ファイルの内容を確認してください。');
                console.error('インポート失敗:', e);
            }
        };

        // ファイルをテキストとして読み込み開始
        reader.readAsText(file);
    }

    function scrollToBottom(scrollElement, isInstant = false) {
        if (!scrollElement) return;
        scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: isInstant ? 'auto' : 'smooth'
        });
        isScrolledToBottom = true; // スクロールさせたのでフラグを立てる
    }

    function checkScrollPosition(scrollElement) {
        if (scrollElement) {
            isScrolledToBottom = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - SCROLL_TOLERANCE;
        }
    }

    function displayUids() {
        const scrollElement = getKomeScrollElement();
        // scrollElement が存在しない場合はここで終了
        if (!scrollElement) {
            return;
        }
        // 1. 最新のスクロール位置をチェック（checkScrollPositionにfalseへの更新ロジックがある前提）
        checkScrollPosition(scrollElement);

        const kcommWraps = scrollElement.querySelectorAll('.kcomm_wrap:not(.uid-processed)');
        if (kcommWraps.length === 0) {
            return;
        }

        // Promise.all を使って全ての非同期処理の完了を待つ
        const processPromises = Array.from(kcommWraps).map(wrap => {
            return processSingleKcommWrap(wrap);
        });

        Promise.all(processPromises).then(results => {
            // 処理されたコメントがあるか確認
            const processedCount = results.filter(success => success).length;

            if (processedCount > 0) {
                // 3. 全てのDOM変更が確定した後、再度スクロール位置をチェック
                checkScrollPosition(scrollElement);

                // 4. 一番下にいる場合のみスクロールを実行
                if (isScrolledToBottom) {
                    window.requestAnimationFrame(() => {
                        // 1フレーム後: 描画が完了しているはずなので、スクロールを実行
                        scrollToBottom(scrollElement);

                        // 念のため、もう1フレーム待って最終的な位置を強制
                        window.requestAnimationFrame(() => {
                            scrollToBottom(scrollElement);
                        });
                    });
                }
            }
        });
    }

    let observer = null;

    function initMutationObserver() {
        const targetElement = getKomeScrollElement();
        if (!targetElement) {
            return;
        }

        targetElement.addEventListener('scroll', () => checkScrollPosition(targetElement));
        checkScrollPosition(targetElement); // 引数を渡す

        observer = new MutationObserver((mutations) => {
            let needsUidProcessing = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 要素ノードの場合
                            // 追加されたノードと、その子孫ノードを対象にURL修正を試みる
                            if (node.classList.contains('kcomm_base') || node.querySelector('.kcomm_base')) {
                                fixYoutubeUrlsInNode(node);
                                parseAndReplaceUrl(node);
                            }
                            // UID処理のフラグは維持
                            if (node.classList.contains('kcomm_wrap') || node.querySelector('.kcomm_wrap')) {
                                needsUidProcessing = true;
                                // break はせずに全ての追加ノードをチェック
                            }
                        }
                    }
                }
            }
            if (needsUidProcessing) {
                displayUids(); // 遅延させずに即時実行
            }
        });
        observer.observe(targetElement, { childList: true, subtree: true });
    }

    function waitForElement(selector, callback, timeout = 20000, interval = 200) {
        let elapsed = 0;
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else {
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(timer);
                    console.error(`要素 "${selector}" が ${timeout}ms 以内に見つかりませんでした。UID表示機能は動作しません。`);
                }
            }
        }, interval);
    }
})();