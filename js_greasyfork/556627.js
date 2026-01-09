// ==UserScript==
// @name         苹方字体网页替换脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将网页字体替换为苹方字体，Inter作为拉丁字符显示，大字库使用SimSun CDN，支持Shadow DOM
// @author       Wolfe
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      fontsapi.zeoseven.com
// @connect      cdn.jsdelivr.net
// @connect      fonts.cdnfonts.com
// @connect      rsms.me
// @connect      db.onlinewebfonts.com
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556627/%E8%8B%B9%E6%96%B9%E5%AD%97%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556627/%E8%8B%B9%E6%96%B9%E5%AD%97%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[PingFang] 脚本开始执行 v2.3.9 (YouTube增强扫描版)');
    console.log('[PingFang] document.readyState:', document.readyState);
    console.log('[PingFang] document.head:', !!document.head);

    const processedShadowRoots = new WeakSet();

    // ==================== CDN 配置 ====================
    // 多 CDN 备选，优先使用国内镜像
    const CDN_CONFIG = {
        // Google Fonts CDN 列表（按优先级排序，包含国内镜像）
        googleFonts: [
            { name: 'loli.net镜像', api: 'https://fonts.loli.net', static: 'https://gstatic.loli.net' },
            { name: 'font.im镜像', api: 'https://fonts.font.im', static: 'https://fonts.gstatic.com' },
            { name: 'zeoseven镜像', api: 'https://fontsapi.zeoseven.com', static: 'https://fonts.zeoseven.com' },
            { name: 'Google官方', api: 'https://fonts.googleapis.com', static: 'https://fonts.gstatic.com' },
        ],
        // Inter 字体 CDN 列表
        inter: [
            { name: 'jsdelivr-fontsource', url: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5/index.css', preconnect: 'https://cdn.jsdelivr.net' },
            { name: 'unpkg-fontsource', url: 'https://unpkg.com/@fontsource/inter@5/index.css', preconnect: 'https://unpkg.com' },
            { name: 'rsms官方', url: 'https://rsms.me/inter/inter.css', preconnect: 'https://rsms.me' }
        ],
        // 当前使用的 CDN 索引
        currentGoogleFontsIndex: 0,
        currentInterIndex: 0
    };

    // 基于 Google Fonts Noto 字体和维基百科语言列表
    const SCRIPT_FONT_MAP = {
        // ========== 东亚文字 ==========
        han_sc: { // 简体中文
            langs: ['zh-CN', 'zh-Hans', 'zh-SG', 'zh-MY', 'wuu', 'gan', 'hsn', 'nan', 'hak', 'cdo', 'cjy', 'lzh', 'zh'],
            regex: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
            sansFonts: ['Noto Sans SC'],
            serifFonts: ['Noto Serif SC'],
            fontKey: 'Noto+Sans+SC', serifKey: 'Noto+Serif+SC'
        },
        han_tc: { // 繁体中文（台湾）
            langs: ['zh-TW', 'zh-Hant'],
            regex: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
            sansFonts: ['Noto Sans TC'],
            serifFonts: ['Noto Serif TC'],
            fontKey: 'Noto+Sans+TC', serifKey: 'Noto+Serif+TC'
        },
        han_hk: { // 繁体中文（香港）
            langs: ['zh-HK', 'zh-MO', 'yue'],
            regex: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
            sansFonts: ['Noto Sans HK'],
            serifFonts: ['Noto Serif HK'],
            fontKey: 'Noto+Sans+HK', serifKey: 'Noto+Serif+HK'
        },
        japanese: { // 日语
            langs: ['ja', 'ja-JP'],
            regex: /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/,
            sansFonts: ['Noto Sans JP'],
            serifFonts: ['Noto Serif JP'],
            fontKey: 'Noto+Sans+JP', serifKey: 'Noto+Serif+JP'
        },
        korean: { // 韩语
            langs: ['ko', 'ko-KR', 'ko-KP'],
            regex: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F]/,
            sansFonts: ['Noto Sans KR'],
            serifFonts: ['Noto Serif KR'],
            fontKey: 'Noto+Sans+KR', serifKey: 'Noto+Serif+KR'
        },

        // ========== 南亚文字 ==========
        devanagari: { // 天城文（印地语、梵语、马拉地语、尼泊尔语等）
            langs: ['hi', 'mr', 'ne', 'sa', 'bh', 'bho', 'mai', 'new', 'awa', 'doi', 'ks', 'sd-Deva', 'raj'],
            regex: /[\u0900-\u097F\uA8E0-\uA8FF]/,
            sansFonts: ['Noto Sans Devanagari'],
            serifFonts: ['Noto Serif Devanagari'],
            fontKey: 'Noto+Sans+Devanagari', serifKey: 'Noto+Serif+Devanagari'
        },
        bengali: { // 孟加拉文
            langs: ['bn', 'as', 'bpy', 'mni-Beng', 'sat-Beng', 'syl'],
            regex: /[\u0980-\u09FF]/,
            sansFonts: ['Noto Sans Bengali'],
            serifFonts: ['Noto Serif Bengali'],
            fontKey: 'Noto+Sans+Bengali', serifKey: 'Noto+Serif+Bengali'
        },
        tamil: { // 泰米尔文
            langs: ['ta'],
            regex: /[\u0B80-\u0BFF]/,
            sansFonts: ['Noto Sans Tamil'],
            serifFonts: ['Noto Serif Tamil'],
            fontKey: 'Noto+Sans+Tamil', serifKey: 'Noto+Serif+Tamil'
        },
        telugu: { // 泰卢固文
            langs: ['te'],
            regex: /[\u0C00-\u0C7F]/,
            sansFonts: ['Noto Sans Telugu'],
            serifFonts: ['Noto Serif Telugu'],
            fontKey: 'Noto+Sans+Telugu', serifKey: 'Noto+Serif+Telugu'
        },
        kannada: { // 卡纳达文
            langs: ['kn'],
            regex: /[\u0C80-\u0CFF]/,
            sansFonts: ['Noto Sans Kannada'],
            serifFonts: ['Noto Serif Kannada'],
            fontKey: 'Noto+Sans+Kannada', serifKey: 'Noto+Serif+Kannada'
        },
        malayalam: { // 马拉雅拉姆文
            langs: ['ml'],
            regex: /[\u0D00-\u0D7F]/,
            sansFonts: ['Noto Sans Malayalam'],
            serifFonts: ['Noto Serif Malayalam'],
            fontKey: 'Noto+Sans+Malayalam', serifKey: 'Noto+Serif+Malayalam'
        },
        gujarati: { // 古吉拉特文
            langs: ['gu'],
            regex: /[\u0A80-\u0AFF]/,
            sansFonts: ['Noto Sans Gujarati'],
            serifFonts: ['Noto Serif Gujarati'],
            fontKey: 'Noto+Sans+Gujarati', serifKey: 'Noto+Serif+Gujarati'
        },
        gurmukhi: { // 古木基文（旁遮普语）
            langs: ['pa', 'pa-Guru'],
            regex: /[\u0A00-\u0A7F]/,
            sansFonts: ['Noto Sans Gurmukhi'],
            serifFonts: ['Noto Serif Gurmukhi'],
            fontKey: 'Noto+Sans+Gurmukhi', serifKey: 'Noto+Serif+Gurmukhi'
        },
        oriya: { // 奥里亚文
            langs: ['or'],
            regex: /[\u0B00-\u0B7F]/,
            sansFonts: ['Noto Sans Oriya'],
            serifFonts: ['Noto Serif Oriya'],
            fontKey: 'Noto+Sans+Oriya', serifKey: 'Noto+Serif+Oriya'
        },
        sinhala: { // 僧伽罗文
            langs: ['si'],
            regex: /[\u0D80-\u0DFF]/,
            sansFonts: ['Noto Sans Sinhala'],
            serifFonts: ['Noto Serif Sinhala'],
            fontKey: 'Noto+Sans+Sinhala', serifKey: 'Noto+Serif+Sinhala'
        },

        // ========== 东南亚文字 ==========
        thai: { // 泰文
            langs: ['th'],
            regex: /[\u0E00-\u0E7F]/,
            sansFonts: ['Noto Sans Thai'],
            serifFonts: ['Noto Serif Thai'],
            fontKey: 'Noto+Sans+Thai', serifKey: 'Noto+Serif+Thai'
        },
        lao: { // 老挝文
            langs: ['lo'],
            regex: /[\u0E80-\u0EFF]/,
            sansFonts: ['Noto Sans Lao'],
            serifFonts: ['Noto Serif Lao'],
            fontKey: 'Noto+Sans+Lao', serifKey: 'Noto+Serif+Lao'
        },
        myanmar: { // 缅甸文
            langs: ['my', 'shn', 'mnw'],
            regex: /[\u1000-\u109F\uAA60-\uAA7F]/,
            sansFonts: ['Noto Sans Myanmar'],
            serifFonts: ['Noto Serif Myanmar'],
            fontKey: 'Noto+Sans+Myanmar', serifKey: 'Noto+Serif+Myanmar'
        },
        khmer: { // 高棉文
            langs: ['km'],
            regex: /[\u1780-\u17FF\u19E0-\u19FF]/,
            sansFonts: ['Noto Sans Khmer'],
            serifFonts: ['Noto Serif Khmer'],
            fontKey: 'Noto+Sans+Khmer', serifKey: 'Noto+Serif+Khmer'
        },
        javanese: { // 爪哇文
            langs: ['jv-Java'],
            regex: /[\uA980-\uA9DF]/,
            sansFonts: ['Noto Sans Javanese'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Javanese'
        },
        balinese: { // 巴厘文
            langs: ['ban-Bali'],
            regex: /[\u1B00-\u1B7F]/,
            sansFonts: ['Noto Sans Balinese'],
            serifFonts: ['Noto Serif Balinese'],
            fontKey: 'Noto+Sans+Balinese', serifKey: 'Noto+Serif+Balinese'
        },
        sundanese: { // 巽他文
            langs: ['su-Sund'],
            regex: /[\u1B80-\u1BBF\u1CC0-\u1CCF]/,
            sansFonts: ['Noto Sans Sundanese'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Sundanese'
        },

        // ========== 中东文字 ==========
        arabic: { // 阿拉伯文
            langs: ['ar', 'fa', 'ur', 'ps', 'ku-Arab', 'ug', 'sd', 'ckb', 'pnb', 'azb', 'glk', 'mzn', 'lrc', 'ary', 'arz', 'aeb', 'acm'],
            regex: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
            sansFonts: ['Noto Sans Arabic'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Arabic', altFonts: ['Noto Naskh Arabic', 'Noto Kufi Arabic']
        },
        hebrew: { // 希伯来文
            langs: ['he', 'yi', 'lad'],
            regex: /[\u0590-\u05FF\uFB1D-\uFB4F]/,
            sansFonts: ['Noto Sans Hebrew'],
            serifFonts: ['Noto Serif Hebrew'],
            fontKey: 'Noto+Sans+Hebrew', serifKey: 'Noto+Serif+Hebrew'
        },
        syriac: { // 叙利亚文
            langs: ['syc', 'arc'],
            regex: /[\u0700-\u074F]/,
            sansFonts: ['Noto Sans Syriac'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Syriac'
        },
        thaana: { // 塔纳文（马尔代夫）
            langs: ['dv'],
            regex: /[\u0780-\u07BF]/,
            sansFonts: ['Noto Sans Thaana'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Thaana'
        },

        // ========== 欧洲文字 ==========
        cyrillic: { // 西里尔文
            langs: ['ru', 'uk', 'be', 'bg', 'sr', 'mk', 'mn', 'kk', 'ky', 'tg', 'tt', 'ba', 'cv', 'ce', 'os', 'ab', 'av', 'sah', 'myv', 'mhr', 'kv', 'udm', 'mdf', 'cu'],
            regex: /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/,
            sansFonts: ['Noto Sans'],
            serifFonts: ['Noto Serif'],
            fontKey: 'Noto+Sans', serifKey: 'Noto+Serif'
        },
        greek: { // 希腊文
            langs: ['el', 'grc', 'pnt'],
            regex: /[\u0370-\u03FF\u1F00-\u1FFF]/,
            sansFonts: ['Noto Sans'],
            serifFonts: ['Noto Serif'],
            fontKey: 'Noto+Sans', serifKey: 'Noto+Serif'
        },
        armenian: { // 亚美尼亚文
            langs: ['hy', 'hyw'],
            regex: /[\u0530-\u058F\uFB00-\uFB17]/,
            sansFonts: ['Noto Sans Armenian'],
            serifFonts: ['Noto Serif Armenian'],
            fontKey: 'Noto+Sans+Armenian', serifKey: 'Noto+Serif+Armenian'
        },
        georgian: { // 格鲁吉亚文
            langs: ['ka', 'xmf', 'lzz'],
            regex: /[\u10A0-\u10FF\u2D00-\u2D2F\u1C90-\u1CBF]/,
            sansFonts: ['Noto Sans Georgian'],
            serifFonts: ['Noto Serif Georgian'],
            fontKey: 'Noto+Sans+Georgian', serifKey: 'Noto+Serif+Georgian'
        },

        // ========== 非洲文字 ==========
        ethiopic: { // 吉兹文（阿姆哈拉语、提格里尼亚语等）
            langs: ['am', 'ti', 'om-Ethi', 'gez'],
            regex: /[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\uAB00-\uAB2F]/,
            sansFonts: ['Noto Sans Ethiopic'],
            serifFonts: ['Noto Serif Ethiopic'],
            fontKey: 'Noto+Sans+Ethiopic', serifKey: 'Noto+Serif+Ethiopic'
        },
        tifinagh: { // 提非纳文（柏柏尔语）
            langs: ['ber', 'tzm', 'zgh', 'shi', 'kab', 'rif'],
            regex: /[\u2D30-\u2D7F]/,
            sansFonts: ['Noto Sans Tifinagh'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Tifinagh'
        },
        vai: { // 瓦伊文
            langs: ['vai'],
            regex: /[\uA500-\uA63F]/,
            sansFonts: ['Noto Sans Vai'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Vai'
        },
        nko: { // 恩科文
            langs: ['nqo'],
            regex: /[\u07C0-\u07FF]/,
            sansFonts: ['Noto Sans NKo'],
            serifFonts: null,
            fontKey: 'Noto+Sans+NKo'
        },
        adlam: { // 阿德拉姆文（富拉语）
            langs: ['ff-Adlm'],
            regex: /[\u1E900-\u1E95F]/,
            sansFonts: ['Noto Sans Adlam'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Adlam'
        },

        // ========== 美洲文字 ==========
        canadian_aboriginal: { // 加拿大原住民音节文字
            langs: ['cr', 'oj', 'iu', 'bla'],
            regex: /[\u1400-\u167F\u18B0-\u18FF]/,
            sansFonts: ['Noto Sans Canadian Aboriginal'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Canadian+Aboriginal'
        },
        cherokee: { // 切罗基文
            langs: ['chr'],
            regex: /[\u13A0-\u13FF\uAB70-\uABBF]/,
            sansFonts: ['Noto Sans Cherokee'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Cherokee'
        },

        // ========== 其他文字 ==========
        mongolian: { // 传统蒙古文
            langs: ['mn-Mong', 'mnc'],
            regex: /[\u1800-\u18AF]/,
            sansFonts: ['Noto Sans Mongolian'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Mongolian'
        },
        tibetan: { // 藏文
            langs: ['bo', 'dz'],
            regex: /[\u0F00-\u0FFF]/,
            sansFonts: null,
            serifFonts: ['Noto Serif Tibetan'],
            serifKey: 'Noto+Serif+Tibetan'
        },
        yi: { // 彝文
            langs: ['ii'],
            regex: /[\uA000-\uA48F\uA490-\uA4CF]/,
            sansFonts: ['Noto Sans Yi'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Yi'
        },
        lisu: { // 傈僳文
            langs: ['lis'],
            regex: /[\uA4D0-\uA4FF]/,
            sansFonts: ['Noto Sans Lisu'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Lisu'
        },
        meetei_mayek: { // 曼尼普尔文
            langs: ['mni'],
            regex: /[\uABC0-\uABFF\uAAE0-\uAAFF]/,
            sansFonts: ['Noto Sans Meetei Mayek'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Meetei+Mayek'
        },
        ol_chiki: { // 桑塔利文
            langs: ['sat'],
            regex: /[\u1C50-\u1C7F]/,
            sansFonts: ['Noto Sans Ol Chiki'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Ol+Chiki'
        },
        tagalog: { // 塔加洛文
            langs: ['tl-Tglg'],
            regex: /[\u1700-\u171F]/,
            sansFonts: ['Noto Sans Tagalog'],
            serifFonts: null,
            fontKey: 'Noto+Sans+Tagalog'
        }
    };

    // 构建 lang 属性到文字系统的快速查找表
    const LANG_TO_SCRIPT = {};
    for (const [scriptId, data] of Object.entries(SCRIPT_FONT_MAP)) {
        for (const lang of data.langs) {
            LANG_TO_SCRIPT[lang.toLowerCase()] = scriptId;
        }
    }


    // ==================== 苹方字体 CDN 配置 ====================
    const PINGFANG_CDN = {
        baseUrl: 'https://cdn.jsdelivr.net/gh/ZWolken/PingFang@main',
        variants: {
            SC: { name: '简体中文', weights: { Thin: 100, Ultralight: 200, Light: 300, Regular: 400, Medium: 500, Semibold: 600 } },
            TC: { name: '繁体中文', weights: { Thin: 100, Ultralight: 200, Light: 300, Regular: 400, Medium: 500, Semibold: 600 } },
            HK: { name: '香港繁体', weights: { Thin: 100, Ultralight: 200, Light: 300, Regular: 400, Medium: 500, Semibold: 600 } }
        }
    };

    // ==================== 字体组定义 ====================
    const wc = ':wght@100..900';

    // 详细的字体组定义（带分类和描述）
    // 注：Emoji 字体由"Emoji 基础"设置统一控制，不在此处定义
    const FONT_GROUP_DEFINITIONS = {
        // === 基础拉丁 ===
        g1: {
            name: '基础拉丁',
            category: 'basic',
            emoji: '🔤',
            desc: 'Inter/Serif/Mono 基础字体（Inter替代Noto Sans）',
            fonts: [`Inter${wc}`, `Noto+Serif${wc}`, `Noto+Sans+Mono${wc}`, `Noto+Serif+Display${wc}`],
            settingKey: 'enableBaseLatin'
        },
        // === CJK 中日韩 ===
        g2: {
            name: 'CJK 中日韩',
            category: 'cjk',
            emoji: '🈳',
            desc: '简繁中文/日文/韩文',
            fonts: [`Noto+Sans+SC${wc}`, `Noto+Sans+TC${wc}`, `Noto+Sans+HK${wc}`, `Noto+Sans+JP${wc}`, `Noto+Sans+KR${wc}`, `Noto+Serif+SC${wc}`, `Noto+Serif+TC${wc}`, `Noto+Serif+HK${wc}`, `Noto+Serif+JP${wc}`, `Noto+Serif+KR${wc}`],
            settingKey: 'enableCJK'
        },
        // === 东南亚现代 ===
        g3: {
            name: '东南亚现代',
            category: 'sea',
            emoji: '🌏',
            desc: '泰/高棉/缅/老/爪哇/巴厘',
            fonts: [`Noto+Sans+Thai${wc}`, `Noto+Serif+Thai${wc}`, `Noto+Sans+Khmer${wc}`, `Noto+Serif+Khmer${wc}`, `Noto+Sans+Myanmar${wc}`, `Noto+Serif+Myanmar${wc}`, `Noto+Sans+Lao${wc}`, `Noto+Serif+Lao${wc}`, `Noto+Sans+Javanese${wc}`, `Noto+Sans+Balinese${wc}`, `Noto+Sans+Sundanese${wc}`],
            settingKey: 'enableSoutheastAsian'
        },
        // === 中东文字 ===
        g4: {
            name: '中东文字',
            category: 'mideast',
            emoji: '🕌',
            desc: '阿拉伯/希伯来/叙利亚/塔纳',
            fonts: [`Noto+Sans+Arabic${wc}`, `Noto+Naskh+Arabic${wc}`, `Noto+Kufi+Arabic${wc}`, `Noto+Sans+Hebrew${wc}`, `Noto+Serif+Hebrew${wc}`, `Noto+Sans+Syriac${wc}`, `Noto+Sans+Thaana${wc}`],
            settingKey: 'enableMiddleEast'
        },
        // === 印度现代 ===
        g5: {
            name: '印度现代',
            category: 'indic',
            emoji: '🇮🇳',
            desc: '天城/孟加拉/泰米尔等',
            fonts: [`Noto+Sans+Devanagari${wc}`, `Noto+Serif+Devanagari${wc}`, `Noto+Sans+Bengali${wc}`, `Noto+Serif+Bengali${wc}`, `Noto+Sans+Tamil${wc}`, `Noto+Serif+Tamil${wc}`, `Noto+Sans+Telugu${wc}`, `Noto+Serif+Telugu${wc}`, `Noto+Sans+Kannada${wc}`, `Noto+Serif+Kannada${wc}`, `Noto+Sans+Malayalam${wc}`, `Noto+Serif+Malayalam${wc}`, `Noto+Sans+Gujarati${wc}`, `Noto+Serif+Gujarati${wc}`, `Noto+Sans+Gurmukhi${wc}`, `Noto+Serif+Gurmukhi${wc}`, `Noto+Sans+Oriya${wc}`, `Noto+Serif+Oriya${wc}`],
            settingKey: 'enableIndic'
        },
        // === 非洲文字 ===
        g6: {
            name: '非洲文字',
            category: 'african',
            emoji: '🌍',
            desc: '埃塞俄比亚/提非纳/瓦伊等',
            fonts: [`Noto+Sans+Ethiopic${wc}`, `Noto+Serif+Ethiopic${wc}`, `Noto+Sans+Tifinagh${wc}`, `Noto+Sans+Vai${wc}`, `Noto+Sans+Bamum${wc}`, `Noto+Sans+Adlam${wc}`, `Noto+Sans+Osmanya`],
            settingKey: 'enableAfrican'
        },
        // === 美洲原住民 ===
        g7: {
            name: '美洲原住民',
            category: 'americas',
            emoji: '🌎',
            desc: '加拿大原住民音节/切罗基',
            fonts: [`Noto+Sans+Canadian+Aboriginal${wc}`, `Noto+Sans+Cherokee${wc}`],
            settingKey: 'enableAmericas'
        },
        // === 菲律宾文字 ===
        g8: {
            name: '菲律宾文字',
            category: 'sea',
            emoji: '🇵🇭',
            desc: '塔加洛/哈努诺/布希德等',
            fonts: [`Noto+Sans+Tagalog`, `Noto+Sans+Hanunoo`, `Noto+Sans+Buhid`, `Noto+Sans+Tagbanwa`, `Noto+Sans+Buginese`, `Noto+Sans+Batak`],
            settingKey: 'enablePhilippine'
        },
        // === 藏蒙文字 ===
        g9: {
            name: '藏蒙文字',
            category: 'eastasia',
            emoji: '🏔️',
            desc: '藏文/蒙古文',
            fonts: [`Noto+Sans+Mongolian`, `Noto+Sans+Tibetan`, `Noto+Serif+Tibetan${wc}`],
            settingKey: 'enableTibetanMongolian'
        },
        // === 印度历史文字 ===
        g10: {
            name: '印度历史文字',
            category: 'historical',
            emoji: '📜',
            desc: '婆罗米/凯提等古印度文',
            fonts: [`Noto+Sans+Brahmi`, `Noto+Sans+Kaithi`, `Noto+Sans+Kharoshthi`, `Noto+Sans+Sharada`, `Noto+Sans+Siddham`, `Noto+Sans+Grantha`, `Noto+Sans+Takri`, `Noto+Sans+Mahajani`, `Noto+Sans+Modi`, `Noto+Sans+Khojki`, `Noto+Sans+Khudawadi`, `Noto+Sans+Multani`, `Noto+Sans+Tirhuta`, `Noto+Sans+Saurashtra`, `Noto+Sans+Syloti+Nagri`],
            settingKey: 'enableIndicHistorical'
        },
        // === 东南亚历史/少数民族 ===
        g11: {
            name: '东南亚历史/少数民族',
            category: 'historical',
            emoji: '🏛️',
            desc: '八思巴/傈僳/苗文等',
            fonts: [`Noto+Sans+PhagsPa`, `Noto+Sans+Lisu${wc}`, `Noto+Sans+Yi`, `Noto+Sans+Miao`, `Noto+Sans+New+Tai+Lue${wc}`, `Noto+Sans+Tai+Le`, `Noto+Sans+Tai+Tham${wc}`, `Noto+Sans+Pahawh+Hmong`, `Noto+Sans+Kayah+Li${wc}`, `Noto+Sans+Cham${wc}`],
            settingKey: 'enableSEAsiaHistorical'
        },
        // === 贡迪文字 ===
        g12: {
            name: '贡迪文字',
            category: 'indic',
            emoji: '🔠',
            desc: '贡贾拉/玛萨拉姆贡迪等',
            fonts: [`Noto+Sans+Gunjala+Gondi${wc}`, `Noto+Sans+Masaram+Gondi`, `Noto+Sans+Wancho`, `Noto+Sans+Sora+Sompeng`],
            settingKey: 'enableGondi'
        },
        // === 古近东文字 ===
        g13: {
            name: '古近东文字',
            category: 'ancient',
            emoji: '🏺',
            desc: '楔形/圣书体/古波斯等',
            fonts: [`Noto+Sans+Cuneiform`, `Noto+Sans+Egyptian+Hieroglyphs`, `Noto+Sans+Anatolian+Hieroglyphs`, `Noto+Sans+Ugaritic`, `Noto+Sans+Phoenician`, `Noto+Sans+Old+Persian`, `Noto+Sans+Imperial+Aramaic`, `Noto+Sans+Inscriptional+Pahlavi`, `Noto+Sans+Inscriptional+Parthian`, `Noto+Sans+Avestan`, `Noto+Sans+Mandaic`],
            settingKey: 'enableAncientNearEast'
        },
        // === 古欧洲文字 ===
        g14: {
            name: '古欧洲文字',
            category: 'ancient',
            emoji: '🏛️',
            desc: '科普特/哥特/卢恩/线形等',
            fonts: [`Noto+Sans+Coptic`, `Noto+Sans+Gothic`, `Noto+Sans+Runic`, `Noto+Sans+Ogham`, `Noto+Sans+Linear+A`, `Noto+Sans+Linear+B`, `Noto+Sans+Cypriot`, `Noto+Sans+Cypro+Minoan`, `Noto+Sans+Old+Italic`, `Noto+Sans+Glagolitic${wc}`, `Noto+Sans+Old+Hungarian`],
            settingKey: 'enableAncientEurope'
        },
        // === 中亚历史 ===
        g15: {
            name: '中亚历史',
            category: 'ancient',
            emoji: '🐫',
            desc: '粟特/于阗/突厥/回鹘等',
            fonts: [`Noto+Sans+Sogdian`, `Noto+Sans+Old+Sogdian`, `Noto+Sans+Khotan+Saka`, `Noto+Sans+Old+Turkic`, `Noto+Sans+Old+Uyghur`, `Noto+Sans+Manichaean`, `Noto+Sans+Psalter+Pahlavi`, `Noto+Sans+Chorasmian`, `Noto+Sans+Elymaic`, `Noto+Sans+Hatran`, `Noto+Sans+Palmyrene`, `Noto+Sans+Nabataean`],
            settingKey: 'enableCentralAsiaHistorical'
        },
        // === 南亚少数民族 ===
        g16: {
            name: '南亚少数民族',
            category: 'indic',
            emoji: '🌿',
            desc: '列普查/林布/桑塔尔等',
            fonts: [`Noto+Sans+Lepcha`, `Noto+Sans+Limbu`, `Noto+Sans+Ol+Chiki`, `Noto+Sans+Sinhala${wc}`, `Noto+Serif+Sinhala${wc}`, `Noto+Sans+Chakma`, `Noto+Sans+Meetei+Mayek${wc}`],
            settingKey: 'enableSouthAsiaMinority'
        },
        // === 符号系统 ===
        g17: {
            name: '符号系统',
            category: 'symbols',
            emoji: '♾️',
            desc: '数学/音乐/箭头/形状等',
            fonts: [`Noto+Sans+Math`, `Noto+Sans+Symbols${wc}`, `Noto+Sans+Symbols+2`, `Noto+Music`],
            settingKey: 'enableSymbols'
        },
        // === 其他小众 ===
        g18: {
            name: '其他小众',
            category: 'misc',
            emoji: '🔣',
            desc: '西夏/女书/创世纪等',
            fonts: [`Noto+Sans+Tangut`, `Noto+Sans+Nushu`, `Noto+Sans+Pau+Cin+Hau`, `Noto+Sans+Mende+Kikakui`, `Noto+Sans+Medefaidrin`, `Noto+Sans+Bassa+Vah${wc}`, `Noto+Sans+Duployan`, `Noto+Sans+SignWriting`],
            settingKey: 'enableMisc'
        },
        // === 格鲁吉亚/亚美尼亚 ===
        g19: {
            name: '格/亚文字',
            category: 'caucasus',
            emoji: '⛰️',
            desc: '格鲁吉亚/亚美尼亚/高加索',
            fonts: [`Noto+Sans+Georgian${wc}`, `Noto+Serif+Georgian${wc}`, `Noto+Sans+Armenian${wc}`, `Noto+Serif+Armenian${wc}`, `Noto+Sans+Caucasian+Albanian`],
            settingKey: 'enableCaucasus'
        },
        // === 古希腊扩展 ===
        g20: {
            name: '古希腊扩展',
            category: 'ancient',
            emoji: '🏺',
            desc: '古希腊语/卡利亚/吕基亚等',
            fonts: [`Noto+Sans+Old+Permic`, `Noto+Sans+Carian`, `Noto+Sans+Lycian`, `Noto+Sans+Lydian`, `Noto+Sans+Meroitic`, `Noto+Sans+Old+South+Arabian`, `Noto+Sans+Old+North+Arabian`, `Noto+Sans+Samaritan`, `Noto+Sans+Marchen`, `Noto+Sans+Newa${wc}`, `Noto+Sans+Bhaiksuki`],
            settingKey: 'enableAncientGreekExt'
        }
    };

    // 分类信息（emoji 已由独立设置控制，不在字体组中显示）
    const FONT_CATEGORIES = {
        basic: { name: '🔤 基础拉丁', order: 1 },
        cjk: { name: '🀄 中日韩文字', order: 2 },
        sea: { name: '🌴 东南亚文字', order: 3 },
        mideast: { name: '🕌 中东文字', order: 4 },
        indic: { name: '🪷 印度系文字', order: 5 },
        african: { name: '🌍 非洲文字', order: 6 },
        americas: { name: '🦅 美洲文字', order: 7 },
        eastasia: { name: '🏔️ 东亚少数民族', order: 8 },
        caucasus: { name: '⛰️ 高加索文字', order: 9 },
        symbols: { name: '✨ 符号系统', order: 10 },
        historical: { name: '📜 历史文字', order: 11 },
        ancient: { name: '🏛️ 古代文字', order: 12 },
        misc: { name: '🔮 其他小众', order: 13 }
    };


    // ==================== 智能缺字检测模块 ====================
    const GlyphDetector = {
        canvas: null,
        ctx: null,
        cache: new Map(),
        testSize: 100,

        init() {
            if (this.canvas) return;
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.testSize;
            this.canvas.height = this.testSize;
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        },

        // 检测单个字符在指定字体中是否有字形
        hasGlyph(char, fontFamily) {
            this.init();
            const cacheKey = `${char}_${fontFamily}`;
            if (SETTINGS.extendedHanFallback?.detectionCache && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const ctx = this.ctx;
            const size = this.testSize;

            // 清空画布并绘制测试字符
            ctx.clearRect(0, 0, size, size);
            ctx.font = `${size * 0.8}px "${fontFamily}"`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.fillText(char, size / 2, size / 2);

            const testData = ctx.getImageData(0, 0, size, size).data;

            // 绘制一个已知不存在的字符作为对比
            ctx.clearRect(0, 0, size, size);
            ctx.fillText('\uFFFF', size / 2, size / 2);
            const blankData = ctx.getImageData(0, 0, size, size).data;

            // 计算像素差异
            let diffCount = 0;
            for (let i = 0; i < testData.length; i += 4) {
                if (testData[i + 3] !== blankData[i + 3]) diffCount++;
            }

            const hasGlyph = diffCount > 10;
            if (SETTINGS.extendedHanFallback?.detectionCache) {
                this.cache.set(cacheKey, hasGlyph);
            }
            return hasGlyph;
        },

        // 检测字符是否属于CJK扩展区
        isExtendedHan(char) {
            const code = char.codePointAt(0);
            if (!code) return false;
            const ranges = [
                [0x3400, 0x4DBF], [0x20000, 0x2A6DF], [0x2A700, 0x2B73F],
                [0x2B740, 0x2B81F], [0x2B820, 0x2CEAF], [0x2CEB0, 0x2EBEF],
                [0x2EBF0, 0x2EE5F], [0x30000, 0x3134F], [0x31350, 0x323AF],
                [0x2F800, 0x2FA1F]
            ];
            return ranges.some(([start, end]) => code >= start && code <= end);
        },

        // 获取字符所属的扩展区名称
        getExtensionName(char) {
            const code = char.codePointAt(0);
            if (!code) return null;
            // ★ Unicode CJK扩展区完整范围（含扩展J，Unicode 16.0）
            const extensions = [
                { range: [0x4E00, 0x9FFF], name: '基本区' },
                { range: [0x3400, 0x4DBF], name: '扩展A' },
                { range: [0x20000, 0x2A6DF], name: '扩展B' },
                { range: [0x2A700, 0x2B73F], name: '扩展C' },
                { range: [0x2B740, 0x2B81F], name: '扩展D' },
                { range: [0x2B820, 0x2CEAF], name: '扩展E' },
                { range: [0x2CEB0, 0x2EBEF], name: '扩展F' },
                { range: [0x2EBF0, 0x2EE5F], name: '扩展I' },  // I在F后面（按码位顺序）
                { range: [0x30000, 0x3134F], name: '扩展G' },
                { range: [0x31350, 0x323AF], name: '扩展H' },
                { range: [0x323B0, 0x3347F], name: '扩展J' },  // Unicode 16.0新增
                { range: [0x2F800, 0x2FA1F], name: '兼容补充' },
                { range: [0xF900, 0xFAFF], name: '兼容汉字' },
            ];
            for (const ext of extensions) {
                if (code >= ext.range[0] && code <= ext.range[1]) return ext.name;
            }
            return null;
        },

        // 找到第一个能显示该字符的字体
        findFallbackFont(char) {
            if (!SETTINGS.extendedHanFallback?.enableSmartDetection) return null;
            const fallbackConfig = SETTINGS.extendedHanFallback || {};
            const fonts = fallbackConfig.fonts || {};
            const order = fallbackConfig.order || Object.keys(fonts);
            for (const fontKey of order) {
                const fontConfig = fonts[fontKey];
                if (!fontConfig?.enabled) continue;
                const fontFamily = fontConfig.fontFamily || fontConfig.name;
                if (this.hasGlyph(char, fontFamily)) return fontFamily;
            }
            return null;
        },

        clearCache() { this.cache.clear(); }
    };

// ==================== 默认设置 ====================
    const DEFAULT_SETTINGS = {
        enabled: true,
        enableSansReplacement: true,
        enableSerifReplacement: true,
        enableMonoReplacement: true,
        defaultCJKLang: 'sc',
        forceDefaultCJK: false,
        fontDisplay: 'swap',
        enableFineDetection: true,
        enableContentDetection: true,
        inputLangMode: 'dynamic',
        mixedScriptThreshold: 3,
        inputMixedScriptThreshold: 1,
        inputDebounceDelay: 50,
        loadAllWeights: true,  // 苹方字体：是否加载全部字重
        primaryWeights: ['Regular', 'Medium'],  // 苹方字体：精简模式下加载的字重
        fontGroupEnabled: (() => {
            const enabled = {};
            for (const key in FONT_GROUP_DEFINITIONS) {
                // 默认只启用常用字体组（g0 emoji 已由 enableEmojiFont 控制）
                const commonGroups = ['g1', 'g2', 'g17'];
                enabled[key] = commonGroups.includes(key);
            }
            return enabled;
        })(),
        fontInjection: {
            // 注：enableEmoji 已移除，Emoji由 enableEmojiFont 统一控制
            enableBaseLatin: true,
            enableCJK: true,
            enableSoutheastAsian: false,
            enableMiddleEast: false,
            enableIndic: false,
            enableAfrican: false,
            enableAmericas: false,
            enablePhilippine: false,
            enableTibetanMongolian: false,
            enableIndicHistorical: false,
            enableSEAsiaHistorical: false,
            enableGondi: false,
            enableAncientNearEast: false,
            enableAncientEurope: false,
            enableCentralAsiaHistorical: false,
            enableSouthAsiaMinority: false,
            enableSymbols: true,
            enableMisc: false,
            enableCaucasus: false,
            enableAncientGreekExt: false
        },
        emojiConfig: {
            preferColorEmoji: true,
            emojiInFontStack: 'high'
        },
        weightProtection: {
            enabled: true,
            mode: 'preset',  // preset | custom | disabled
            ratio: 2.0,
            applyToInput: true
        },
        // ★★★ 已弃用：保留用于向后兼容，实际使用 extendedHanFallback.enabled ★★★
        enableUnihanFallback: true,
        enableEmojiFont: true,
        // ★★★ 大字库简化版 - 只有开关，字体列表和顺序写死 ★★★
        // 使用全局回退，按网页字体风格匹配（sans用黑体，serif用明体）
        extendedHanFallback: {
            enabled: true  // 唯一的配置项：总开关
        },
        customMonoFont: '',
        customFontPriority: [],
        fontSynthesis: {
            enabled: false,
            method: 'synthesis',
            compensateWeight: 0.15,
            shadowOffsetX: 0.3,
            shadowOffsetY: 0.3,
            shadowBlur: 0
        },

        excludedDomains: [''],
        excludedTags: [
            'style', 'script', 'noscript', 'svg', 'path', 'rect', 'circle', 'line',
            'polyline', 'polygon', 'img', 'canvas', 'video', 'audio', 'iframe',
            'embed', 'object', 'template', 'track', 'source', 'meta', 'link',
            'i', 'icon', 'use', 'symbol'
        ],
        // 支持两种格式：CSS选择器 或 简单关键词（自动转换为 [class*="xxx"]）
        excludedSelectors: [
            '.material-symbols-outlined', '.material-icons', '.material-icons-outlined',
            '.fa', '.fas', '.far', '.fal', '.fab', '.fad', '.glyphicon',
            '.icon', '.icons', '.ico', '.docon', '.octicon', '.svg',
            '[class*="icon-"]', '[class*="ico-"]', '[class*="ri-"]', '[class*="pf-"]',
            '[class*="ms-Icon"]', '[class*="Fabric"]', '[class*="fui-Icon"]',
            '[class*="symbols"]', '[class*="video"]', '[class*="player"]',
            '.ms-Button-icon', '[class*="Button"]', '[role="img"]', '[aria-hidden="true"]',
            '.katex', '.katex *', '.MathJax', '.MathJax *', '.mjx-container', '.mjx-math', '.math',
            '.monaco-editor', '.CodeMirror', '.cm-content', '[class*="ace"]',
            // 简单关键词（自动转换为类名模糊匹配）
            'icon', 'fa-', 'glyph', 'symbol', 'mjx', 'katex'
        ],
        inputSelectors: ['[contenteditable="true"]', '[contenteditable=""]', '[role="textbox"]', '.CodeMirror', '.monaco-editor', '.ace_editor'],
        debugMode: false,
        performanceMode: false,
        cacheTimeout: 30000,

        cdnConfig: {
            enableFallbackCDN: true,  // 启用备用 CDN 自动切换
            preferredGoogleFontsCDN: 0,  // 首选 Google Fonts CDN 索引 (0=官方, 1=loli, 2=font.im, 3=css.net)
            preferredInterCDN: 0,  // 首选 Inter CDN 索引 (0=rsms, 1=jsdelivr, 2=unpkg)
            cdnTimeout: 5000  // CDN 超时时间（毫秒）
        },

        languageDetection: {
            enableUnicodeDetection: true,  // 启用 Unicode 范围检测
            enableLangAttrDetection: true,  // 启用 lang 属性检测
            preferLangAttr: true  // 优先使用 lang 属性（而非内容检测）
        }
    };

    // ==================== 工具函数 ====================
    function deepMerge(target, source) {
        const output = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                output[key] = deepMerge(target[key] || {}, source[key]);
            } else {
                output[key] = source[key];
            }
        }
        return output;
    }


    function migrateSettings(settings) {
        // 确保 extendedHanFallback 存在
        if (!settings.extendedHanFallback) {
            settings.extendedHanFallback = { enabled: true };
        }
        // 迁移旧版复杂配置：只保留enabled开关
        if (typeof settings.extendedHanFallback === 'object') {
            const oldEnabled = settings.extendedHanFallback.enabled;
            settings.extendedHanFallback = {
                enabled: oldEnabled !== false
            };
        }

        if (settings.excludedClassPatterns && Array.isArray(settings.excludedClassPatterns) && settings.excludedClassPatterns.length > 0) {
            const existing = new Set(settings.excludedSelectors || []);
            for (const pattern of settings.excludedClassPatterns) {
                if (pattern && !existing.has(pattern)) {
                    settings.excludedSelectors.push(pattern);
                }
            }
            delete settings.excludedClassPatterns;
            console.log('[PingFang] 已迁移 excludedClassPatterns 到 excludedSelectors');
        }
        return settings;
    }

    function loadSettings() {
        try {
            const saved = GM_getValue('pingfangFontSettings', null);
            if (saved) {
                const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
                const merged = deepMerge(DEFAULT_SETTINGS, parsed);
                // 执行设置迁移
                return migrateSettings(merged);
            }
        } catch (e) { console.error('[PingFang] 加载设置失败:', e); }
        return { ...DEFAULT_SETTINGS };
    }

    function saveSettings(settings) {
        try { GM_setValue('pingfangFontSettings', JSON.stringify(settings)); }
        catch (e) { console.error('[PingFang] 保存设置失败:', e); }
    }

    const SETTINGS = loadSettings();
    console.log('[PingFang] 设置已加载:', {
        enabled: SETTINGS.enabled,
        enableSansReplacement: SETTINGS.enableSansReplacement,
        fontGroupEnabled: SETTINGS.fontGroupEnabled,
        extendedHanFallback: SETTINGS.extendedHanFallback?.enabled
    });

    // 判断字体组是否启用
    function isFontGroupEnabled(groupKey) {
        // 优先使用新的fontGroupEnabled
        if (SETTINGS.fontGroupEnabled && SETTINGS.fontGroupEnabled[groupKey] !== undefined) {
            return SETTINGS.fontGroupEnabled[groupKey];
        }
        // 向后兼容：使用旧的fontInjection
        const def = FONT_GROUP_DEFINITIONS[groupKey];
        if (def && SETTINGS.fontInjection && SETTINGS.fontInjection[def.settingKey] !== undefined) {
            return SETTINGS.fontInjection[def.settingKey];
        }
        // 默认启用
        return true;
    }

    // 调试日志
    function debugLog(...args) { if (SETTINGS.debugMode) console.log('[PingFang]', ...args); }

    // ==================== 域名检测 ====================
    const currentHost = location.hostname;
    const isDisabled = !SETTINGS.enabled || SETTINGS.excludedDomains.some(pattern => {
        if (pattern.startsWith('*.')) {
            const suffix = pattern.slice(1);
            return currentHost.endsWith(suffix) || currentHost === pattern.slice(2);
        }
        return currentHost === pattern;
    });

    if (isDisabled) {
        debugLog('脚本已禁用于此域名');
        // 仍然注册设置入口
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('⚙️ Noto 字体设置', () => {
                if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createSettingsPanel);
                else createSettingsPanel();
            });
        }
        return;
    }

    // ==================== 排除规则 ====================
    const EXCLUDED_TAGS = new Set([...SETTINGS.excludedTags.map(t => t.toLowerCase())]);
    const EXCLUDED_SELECTORS = SETTINGS.excludedSelectors;

    const EXCLUSION_RULES = (() => {
        const cssSelectors = [];
        const classPatterns = [];
        for (const rule of EXCLUDED_SELECTORS) {
            if (/^[.#\[]|[*=:\s>+~]/.test(rule)) {
                cssSelectors.push(rule);
            } else {
                classPatterns.push(rule);
            }
        }
        return {
            cssSelectors,
            classPatternRegex: classPatterns.length > 0 ? new RegExp(classPatterns.join('|'), 'i') : null
        };
    })();

    // ==================== 字体栈构建 ====================
    // 辅助函数：给含空格的字体名加引号
    function quoteFontName(name) {
        if (name.includes(' ') && !name.startsWith('"') && !name.startsWith("'")) {
            return `"${name}"`;
        }
        return name;
    }

    // 默认的扩展区 unicode-range（保留用于参考，但不再使用）
    // const DEFAULT_EXT_HAN_UNICODE_RANGE = 'U+3400-4DBF, U+20000-2A6DF, U+2A700-2B73F, U+2B740-2B81F, U+2B820-2CEAF, U+2CEB0-2EBEF, U+2EBF0-2EE5F, U+30000-3134F, U+31350-323AF, U+2F800-2FA1F';

    // ==================== 语言代码到Noto字体名的映射 ====================
    // 用于根据 lang 属性将对应字体提到字体栈最前
    const LANG_TO_FONT_MAP = {
        // 东南亚
        th: ['Noto Sans Thai', 'Noto Sans Thai Looped'],
        km: ['Noto Sans Khmer'],
        my: ['Noto Sans Myanmar'],
        lo: ['Noto Sans Lao', 'Noto Sans Lao Looped'],
        jv: ['Noto Sans Javanese'],
        su: ['Noto Sans Sundanese'],
        ban: ['Noto Sans Balinese'],
        cja: ['Noto Sans Cham'],
        // 中东/阿拉伯
        ar: ['Noto Sans Arabic', 'Noto Kufi Arabic', 'Noto Naskh Arabic'],
        fa: ['Noto Sans Arabic', 'Noto Naskh Arabic'],  // 波斯语
        ur: ['Noto Nastaliq Urdu', 'Noto Sans Arabic'],
        he: ['Noto Sans Hebrew', 'Noto Rashi Hebrew'],
        yi: ['Noto Sans Hebrew'],  // 意第绪语
        syr: ['Noto Sans Syriac'],
        dv: ['Noto Sans Thaana'],  // 迪维希语（马尔代夫）
        // 高加索
        ka: ['Noto Sans Georgian'],
        hy: ['Noto Sans Armenian'],
        // 印度次大陆
        hi: ['Noto Sans Devanagari'],  // 印地语
        mr: ['Noto Sans Devanagari'],  // 马拉地语
        ne: ['Noto Sans Devanagari'],  // 尼泊尔语
        sa: ['Noto Sans Devanagari'],  // 梵语
        bn: ['Noto Sans Bengali'],     // 孟加拉语
        as: ['Noto Sans Bengali'],     // 阿萨姆语
        ta: ['Noto Sans Tamil'],
        te: ['Noto Sans Telugu'],
        kn: ['Noto Sans Kannada'],
        ml: ['Noto Sans Malayalam'],
        gu: ['Noto Sans Gujarati'],
        pa: ['Noto Sans Gurmukhi'],    // 旁遮普语
        or: ['Noto Sans Oriya'],
        si: ['Noto Sans Sinhala'],     // 僧伽罗语
        // 非洲
        am: ['Noto Sans Ethiopic'],    // 阿姆哈拉语
        ti: ['Noto Sans Ethiopic'],    // 提格里尼亚语
        ber: ['Noto Sans Tifinagh'],   // 柏柏尔语
        vai: ['Noto Sans Vai'],
        bax: ['Noto Sans Bamum'],
        ff: ['Noto Sans Adlam'],       // 富拉语
        // 美洲
        cr: ['Noto Sans Canadian Aboriginal'],  // 克里语
        oj: ['Noto Sans Canadian Aboriginal'],  // 奥吉布瓦语
        iu: ['Noto Sans Canadian Aboriginal'],  // 因纽特语
        chr: ['Noto Sans Cherokee'],
        osa: ['Noto Sans Osage'],
        // 藏蒙
        bo: ['Noto Sans Tibetan'],
        mn: ['Noto Sans Mongolian'],
        // 其他东南亚
        tdd: ['Noto Sans Tai Tham'],   // 傣仂语
        khb: ['Noto Sans New Tai Lue'] // 新傣仂语
    };

    // Serif 版本的映射（部分语言有 Serif 变体）
    const LANG_TO_SERIF_MAP = {
        th: ['Noto Serif Thai'],
        km: ['Noto Serif Khmer'],
        my: ['Noto Serif Myanmar'],
        lo: ['Noto Serif Lao'],
        ban: ['Noto Serif Balinese'],
        ka: ['Noto Serif Georgian'],
        hy: ['Noto Serif Armenian'],
        he: ['Noto Serif Hebrew'],
        hi: ['Noto Serif Devanagari'],
        mr: ['Noto Serif Devanagari'],
        ne: ['Noto Serif Devanagari'],
        sa: ['Noto Serif Devanagari'],
        bn: ['Noto Serif Bengali'],
        as: ['Noto Serif Bengali'],
        ta: ['Noto Serif Tamil'],
        te: ['Noto Serif Telugu'],
        kn: ['Noto Serif Kannada'],
        ml: ['Noto Serif Malayalam'],
        gu: ['Noto Serif Gujarati'],
        pa: ['Noto Serif Gurmukhi'],
        or: ['Noto Serif Oriya'],
        si: ['Noto Serif Sinhala'],
        am: ['Noto Serif Ethiopic'],
        ti: ['Noto Serif Ethiopic'],
        bo: ['Noto Serif Tibetan']
    };

    // 辅助函数：根据 lang 属性重排字体数组，将匹配的字体提到最前
    function reorderFontsByLang(fonts, langAttr, fontMap) {
        if (!langAttr) return fonts;
        const lang = langAttr.toLowerCase().split('-')[0];  // 取主语言代码
        const priorityFonts = fontMap[lang];
        if (!priorityFonts || priorityFonts.length === 0) return fonts;

        // 将匹配的字体提到前面，其余保持原顺序
        const prioritySet = new Set(priorityFonts);
        const matched = fonts.filter(f => prioritySet.has(f));
        const rest = fonts.filter(f => !prioritySet.has(f));
        return [...matched, ...rest];
    }

    // ==================== 扩展语言字体列表（关键！） ====================
    // 这些字体会作为fallback添加到字体栈中，确保各种语言都能正确显示
    const EXTRA_SANS_FAMILIES = [
        // 注意：已移除 Noto Sans 和 Noto Sans Display，由 Inter 替代
        // 东南亚
        'Noto Sans Thai', 'Noto Sans Thai Looped', 'Noto Sans Khmer', 'Noto Sans Myanmar',
        'Noto Sans Lao', 'Noto Sans Lao Looped', 'Noto Sans Javanese', 'Noto Sans Balinese',
        'Noto Sans Sundanese', 'Noto Sans Cham', 'Noto Sans Tai Tham', 'Noto Sans Tai Le',
        'Noto Sans Tai Viet', 'Noto Sans New Tai Lue',
        // 中东/阿拉伯
        'Noto Sans Arabic', 'Noto Kufi Arabic', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu',
        'Noto Sans Hebrew', 'Noto Rashi Hebrew', 'Noto Sans Syriac', 'Noto Sans Thaana',
        // 高加索
        'Noto Sans Georgian', 'Noto Sans Armenian',
        // 印度次大陆
        'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu',
        'Noto Sans Kannada', 'Noto Sans Malayalam', 'Noto Sans Gujarati', 'Noto Sans Gurmukhi',
        'Noto Sans Oriya', 'Noto Sans Sinhala',
        // 非洲
        'Noto Sans Ethiopic', 'Noto Sans Tifinagh', 'Noto Sans Vai', 'Noto Sans Bamum', 'Noto Sans Adlam',
        // 美洲
        'Noto Sans Canadian Aboriginal', 'Noto Sans Cherokee', 'Noto Sans Osage',
        // 藏蒙
        'Noto Sans Mongolian', 'Noto Sans Tibetan',
        // 符号
        'Noto Sans Math', 'Noto Sans Symbols', 'Noto Sans Symbols 2'
    ];

    const EXTRA_SERIF_FAMILIES = [
        'Noto Serif Display',
        // 东南亚
        'Noto Serif Thai', 'Noto Serif Khmer', 'Noto Serif Myanmar', 'Noto Serif Lao', 'Noto Serif Balinese',
        // 高加索
        'Noto Serif Armenian', 'Noto Serif Georgian',
        // 中东
        'Noto Serif Hebrew',
        // 印度次大陆
        'Noto Serif Devanagari', 'Noto Serif Bengali', 'Noto Serif Tamil', 'Noto Serif Telugu',
        'Noto Serif Kannada', 'Noto Serif Malayalam', 'Noto Serif Gujarati', 'Noto Serif Gurmukhi',
        'Noto Serif Oriya', 'Noto Serif Sinhala',
        // 非洲
        'Noto Serif Ethiopic',
        // 藏文
        'Noto Serif Tibetan'
    ];

    // 注：globalSansStr 和 globalSerifStr 已移除，改为在 buildFontStack 中根据 lang 动态生成


    // 大字库 unicode-range：只覆盖扩展B及以后（苹方/Noto不完整的区域）
    const EXT_HAN_UNICODE_RANGE = 'U+20000-2A6DF, U+2A700-2B73F, U+2B740-2B81F, U+2B820-2CEAF, U+2CEB0-2EBEF, U+2EBF0-2EE5F, U+30000-3134F, U+31350-323AF, U+2F800-2FA1F';
    // 大字库字体：仅使用 SimSun 宋体（CDN 注入）
    const EXT_HAN_FONT_NAME = 'PF-ExtHan-SimSun';
    const EXT_HAN_CDN_URL = 'https://db.onlinewebfonts.com/t/b4a89f5837a3f561b244965550593f37.woff2';

    function buildFontStack(type, lang) {
        const stack = [];
        const customMono = SETTINGS.customMonoFont?.trim();

        // 获取页面原始 lang 属性（用于非 CJK 语言的字体优先级调整）
        const pageLangAttr = document.documentElement.lang || '';

        // ★★★ Inter 始终放在最前面（非 mono 和 serif 时） ★★★
        if (type !== 'mono' && type !== 'serif') {
            stack.push('"Inter"');
        }

        // Emoji 优先级（高优先级时放在 Inter 后面）
        if (SETTINGS.enableEmojiFont && SETTINGS.emojiConfig?.emojiInFontStack === 'high') {
            stack.push('"Noto Color Emoji"');
        }

        // 自定义优先字体
        if (SETTINGS.customFontPriority?.length) {
            stack.push(...SETTINGS.customFontPriority.map(quoteFontName));
        }

        // 等宽字体特殊处理
        if (type === 'mono') {
            if (customMono) stack.push(quoteFontName(customMono));
            stack.push('"Noto Sans Mono"');
            // mono字体栈只使用等宽字体，直接返回
            stack.push('monospace');
            return stack.join(', ');
        }

        // ★★★ 苹方字体语言映射 ★★★
        const pfLangMap = { sc: 'SC', tc: 'TC', hk: 'HK', jp: 'SC', kr: 'SC' };
        const pfSuffix = pfLangMap[lang] || pfLangMap[SETTINGS.defaultCJKLang] || 'SC';

        // Noto CJK 字体映射
        const cjkLangMap = { sc: 'SC', tc: 'TC', hk: 'HK', jp: 'JP', kr: 'KR' };
        const cjkSuffix = cjkLangMap[lang] || cjkLangMap[SETTINGS.defaultCJKLang] || 'SC';

        // ★★★ 根据 lang 属性构建完整的 CJK 字体栈 ★★★
        const allCjkSuffixes = ['SC', 'TC', 'HK', 'JP', 'KR'];
        const allPfSuffixes = ['SC', 'TC', 'HK'];
        const orderedCjkSuffixes = [cjkSuffix, ...allCjkSuffixes.filter(s => s !== cjkSuffix)];
        const orderedPfSuffixes = [pfSuffix, ...allPfSuffixes.filter(s => s !== pfSuffix)];

        // ★★★ 构建字体栈 ★★★
        if (type === 'serif') {
            // Serif: 只使用Noto Serif系列（苹方是黑体，不适合作为衬线回退）
            stack.push('"Noto Serif"');
            orderedCjkSuffixes.forEach(suffix => stack.push(`"Noto Serif ${suffix}"`));
            debugLog('构建Serif字体栈:', stack.slice(0, 5).join(', '), '...');
        } else if (type !== 'mono') {
            // Sans: Inter已在最前，苹方次之，Noto Sans CJK 回退
            orderedPfSuffixes.forEach(suffix => stack.push(`"PingFang ${suffix}"`));
            orderedCjkSuffixes.forEach(suffix => stack.push(`"Noto Sans ${suffix}"`));
        }

        // Emoji 低优先级
        if (SETTINGS.enableEmojiFont && SETTINGS.emojiConfig?.emojiInFontStack === 'low') {
            stack.push('"Noto Color Emoji"');
        }

        // ★★★ 添加扩展语言字体作为fallback ★★★
        if (type === 'serif') {
            const orderedSerifFamilies = reorderFontsByLang(EXTRA_SERIF_FAMILIES, pageLangAttr, LANG_TO_SERIF_MAP);
            const serifStr = orderedSerifFamilies.map(f => `"${f}"`).join(', ');
            stack.push(serifStr);
        } else if (type !== 'mono') {
            const orderedSansFamilies = reorderFontsByLang(EXTRA_SANS_FAMILIES, pageLangAttr, LANG_TO_FONT_MAP);
            const sansStr = orderedSansFamilies.map(f => `"${f}"`).join(', ');
            stack.push(sansStr);
        }

        // 系统 Emoji 回退
        stack.push('"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Emoji"');


        if (SETTINGS.extendedHanFallback?.enabled !== false) {
            stack.push(`"${EXT_HAN_FONT_NAME}"`);
        }

        // 通用回退
        if (type === 'mono') stack.push('monospace');
        else if (type === 'serif') stack.push('serif');
        else stack.push('sans-serif');

        return stack.join(', ');
    }


    // ==================== 苹方字体 @font-face 注入 ====================
    function injectPingFangFonts() {
        let css = '';
        const display = SETTINGS.fontDisplay || 'swap';

        for (const [variant, config] of Object.entries(PINGFANG_CDN.variants)) {
            const weights = SETTINGS.loadAllWeights
                ? config.weights
                : Object.fromEntries(Object.entries(config.weights).filter(([name]) => SETTINGS.primaryWeights.includes(name)));

            for (const [weightName, weightValue] of Object.entries(weights)) {
                const url = `${PINGFANG_CDN.baseUrl}/PingFang${variant}-${weightName}.otf`;
                css += `@font-face {
    font-family: "PingFang ${variant}";
    src: url("${url}") format("opentype");
    font-weight: ${weightValue};
    font-style: normal;
    font-display: ${display};
}\n`;
            }
        }

        const style = document.createElement('style');
        style.id = 'pf-pingfang-fonts';
        style.textContent = css;
        document.head.appendChild(style);
        debugLog('已注入苹方字体 @font-face');
    }

    // ==================== Inter 字体注入（带CDN备选）====================
    function injectInterFont(cdnIndex = null) {
        // 使用设置中的首选 CDN 或传入的索引
        const startIndex = cdnIndex !== null ? cdnIndex : (SETTINGS.cdnConfig?.preferredInterCDN || 0);
        const cdn = CDN_CONFIG.inter[startIndex];
        if (!cdn) {
            console.error('[PingFang] 所有 Inter CDN 都不可用');
            return;
        }

        console.log(`[PingFang] 尝试加载 Inter 字体 (${cdn.name}): ${cdn.url}`);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cdn.url;
        link.crossOrigin = 'anonymous';
        link.id = 'pf-inter-font';

        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = cdn.preconnect;
        preconnect.id = 'pf-inter-preconnect';

        // 加载成功回调
        link.onload = () => {
            console.log(`[PingFang] ✓ Inter 字体加载成功 (${cdn.name})`);
            CDN_CONFIG.currentInterIndex = startIndex;
        };

        // 加载失败，尝试下一个 CDN（如果启用了备用 CDN）
        link.onerror = () => {
            console.warn(`[PingFang] ✗ Inter CDN 加载失败 (${cdn.name})`);
            link.remove();
            preconnect.remove();

            if (SETTINGS.cdnConfig?.enableFallbackCDN !== false && startIndex + 1 < CDN_CONFIG.inter.length) {
                console.log('[PingFang] 尝试备用 Inter CDN...');
                injectInterFont(startIndex + 1);
            } else {
                console.error('[PingFang] 所有 Inter CDN 都加载失败或备用 CDN 已禁用');
            }
        };

        document.head.prepend(preconnect);
        document.head.appendChild(link);
        debugLog('已注入 Inter 字体');
    }

    // ==================== Google Fonts 注入（带CDN备选和字体检测）====================
    function injectGoogleFonts(cdnIndex = null) {
        // 使用设置中的首选 CDN 或传入的索引
        const startIndex = cdnIndex !== null ? cdnIndex : (SETTINGS.cdnConfig?.preferredGoogleFontsCDN || 0);
        const cdn = CDN_CONFIG.googleFonts[startIndex];
        if (!cdn) {
            console.error('[PingFang] 所有 Google Fonts CDN 都不可用');
            return;
        }

        const enabledFonts = [];

        // Emoji 字体由 enableEmojiFont 统一控制
        if (SETTINGS.enableEmojiFont) {
            enabledFonts.push('Noto+Color+Emoji');
        }

        for (const key in FONT_GROUP_DEFINITIONS) {
            if (isFontGroupEnabled(key)) {
                const fonts = FONT_GROUP_DEFINITIONS[key].fonts.filter(f => !f.startsWith('Inter'));
                enabledFonts.push(...fonts);
            }
        }

        if (enabledFonts.length === 0) {
            debugLog('没有启用任何字体组');
            return;
        }

        const fontUrl = `${cdn.api}/css2?family=${enabledFonts.join('&family=')}&display=${SETTINGS.fontDisplay}`;

        console.log(`[PingFang] 尝试加载 Google Fonts (${cdn.name})`);
        console.log(`[PingFang] 启用的字体数: ${enabledFonts.length}`);
        debugLog('Google Fonts URL:', fontUrl.substring(0, 150) + '...');

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontUrl;
        link.crossOrigin = 'anonymous';
        link.id = 'pf-google-fonts';

        // 预连接
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = cdn.api;
        preconnect.id = 'pf-google-fonts-preconnect';

        const preconnectStatic = document.createElement('link');
        preconnectStatic.rel = 'preconnect';
        preconnectStatic.href = cdn.static;
        preconnectStatic.crossOrigin = 'anonymous';
        preconnectStatic.id = 'pf-google-fonts-preconnect-static';

        // 加载成功回调
        link.onload = () => {
            console.log(`[PingFang] ✓ Google Fonts CSS 加载成功 (${cdn.name})`);
            CDN_CONFIG.currentGoogleFontsIndex = startIndex;

            // 延迟检测关键字体是否真正可用
            setTimeout(() => {
                checkCriticalFonts(startIndex);
            }, 2000);
        };

        // 加载失败，尝试下一个 CDN（如果启用了备用 CDN）
        link.onerror = () => {
            console.warn(`[PingFang] ✗ Google Fonts CDN 加载失败 (${cdn.name})`);
            link.remove();
            preconnect.remove();
            preconnectStatic.remove();

            if (SETTINGS.cdnConfig?.enableFallbackCDN !== false && startIndex + 1 < CDN_CONFIG.googleFonts.length) {
                console.log('[PingFang] 尝试备用 Google Fonts CDN...');
                injectGoogleFonts(startIndex + 1);
            } else {
                console.error('[PingFang] 所有 Google Fonts CDN 都加载失败或备用 CDN 已禁用');
            }
        };

        document.head.prepend(preconnectStatic);
        document.head.prepend(preconnect);
        document.head.appendChild(link);

        debugLog('已注入 Google Fonts，共', enabledFonts.length, '个字体');
    }

    // ==================== 关键字体检测 ====================
    function checkCriticalFonts(cdnIndex) {
        const criticalFonts = [
            { name: 'Noto Serif SC', type: 'serif-cjk' },
            { name: 'Noto Sans SC', type: 'sans-cjk' },
            { name: 'Noto Serif', type: 'serif-latin' },
            { name: 'Inter', type: 'sans-latin' }
        ];

        console.log('[PingFang] ========== 字体可用性检测 ==========');

        let allAvailable = true;
        const unavailable = [];

        criticalFonts.forEach(font => {
            // 使用 document.fonts.check 检测字体
            const testString = font.type.includes('cjk') ? '测试文字' : 'Test';
            const isAvailable = document.fonts.check(`16px "${font.name}"`, testString);
            const status = isAvailable ? '✓ 可用' : '✗ 不可用';
            console.log(`[PingFang] ${font.name}: ${status}`);

            if (!isAvailable) {
                allAvailable = false;
                unavailable.push(font.name);
            }
        });

        // 列出所有已加载的字体
        const loadedFonts = [];
        document.fonts.forEach(font => {
            if (font.status === 'loaded') {
                loadedFonts.push(font.family);
            }
        });
        const uniqueFonts = [...new Set(loadedFonts)];
        console.log(`[PingFang] 已加载字体 (${uniqueFonts.length}): ${uniqueFonts.slice(0, 10).join(', ')}${uniqueFonts.length > 10 ? '...' : ''}`);
        console.log('[PingFang] ==========================================');

        // 如果关键字体不可用且还有备用CDN且启用了备用CDN，尝试切换
        if (!allAvailable && SETTINGS.cdnConfig?.enableFallbackCDN !== false && cdnIndex + 1 < CDN_CONFIG.googleFonts.length) {
            console.warn(`[PingFang] 部分关键字体不可用: ${unavailable.join(', ')}`);
            console.log(`[PingFang] 尝试切换到备用 CDN...`);

            // 移除当前的 Google Fonts 链接
            const oldLink = document.getElementById('pf-google-fonts');
            const oldPreconnect = document.getElementById('pf-google-fonts-preconnect');
            const oldPreconnectStatic = document.getElementById('pf-google-fonts-preconnect-static');
            if (oldLink) oldLink.remove();
            if (oldPreconnect) oldPreconnect.remove();
            if (oldPreconnectStatic) oldPreconnectStatic.remove();

            // 尝试下一个 CDN
            injectGoogleFonts(cdnIndex + 1);
        } else if (allAvailable) {
            console.log('[PingFang] ✓ 所有关键字体都已成功加载');
        } else if (!allAvailable) {
            console.warn(`[PingFang] 部分字体不可用: ${unavailable.join(', ')}（备用 CDN 已禁用或已用尽）`);
        }
    }

    // ==================== 等待 head 存在的辅助函数 ====================
    function ensureHead(callback) {
        if (document.head) {
            callback();
        } else {
            // 监听 head 出现
            const observer = new MutationObserver((mutations, obs) => {
                if (document.head) {
                    obs.disconnect();
                    callback();
                }
            });
            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true
            });
            // 备用：DOMContentLoaded
            document.addEventListener('DOMContentLoaded', () => {
                observer.disconnect();
                if (document.head) callback();
            }, { once: true });
        }
    }

    // 确保 head 存在后再注入字体
    ensureHead(() => {
        console.log('[PingFang] document.head 已就绪，开始注入字体');
        try {
            injectPingFangFonts();
            console.log('[PingFang] ✓ injectPingFangFonts 完成');
        } catch(e) { console.error('[PingFang] ✗ injectPingFangFonts 出错:', e); }

        try {
            injectInterFont();
            console.log('[PingFang] ✓ injectInterFont 完成');
        } catch(e) { console.error('[PingFang] ✗ injectInterFont 出错:', e); }

        try {
            injectGoogleFonts();
            console.log('[PingFang] ✓ injectGoogleFonts 完成');
        } catch(e) { console.error('[PingFang] ✗ injectGoogleFonts 出错:', e); }

        try {
            injectExtendedHanFontFaces();
            console.log('[PingFang] ✓ injectExtendedHanFontFaces 完成');
        } catch(e) { console.error('[PingFang] ✗ injectExtendedHanFontFaces 出错:', e); }

        try {
            injectFontAttributeStyles();
            console.log('[PingFang] ✓ injectFontAttributeStyles 完成');
        } catch(e) { console.error('[PingFang] ✗ injectFontAttributeStyles 出错:', e); }


        try {
            injectGlobalFontStyles();
            console.log('[PingFang] ✓ injectGlobalFontStyles 完成');
        } catch(e) { console.error('[PingFang] ✗ injectGlobalFontStyles 出错:', e); }

        try {
            injectSynthesisStyles();
            console.log('[PingFang] ✓ injectSynthesisStyles 完成');
        } catch(e) { console.error('[PingFang] ✗ injectSynthesisStyles 出错:', e); }

        console.log('[PingFang] 所有字体样式注入完成');
    });


    function injectExtendedHanFontFaces() {
        if (SETTINGS.extendedHanFallback?.enabled === false) {
            debugLog('大字库回退已禁用');
            return;
        }

        const display = SETTINGS.fontDisplay || 'swap';
        const css = `@font-face {
    font-family: "${EXT_HAN_FONT_NAME}";
    src: url("${EXT_HAN_CDN_URL}") format("woff2");
    unicode-range: ${EXT_HAN_UNICODE_RANGE};
    font-display: ${display};
}`;

        const style = document.createElement('style');
        style.id = 'pf-exthan-fonts';
        style.textContent = css;
        document.head.appendChild(style);

        debugLog('已注入大字库 @font-face（SimSun CDN）');
    }

    // 注意：injectExtendedHanFontFaces 的调用已移至 ensureHead 回调中

    // ==================== CSS 属性选择器规则注入 ====================
    function needsGlobalFallback() {
        if (!SETTINGS.globalFallback?.enabled) return false;
        const sites = SETTINGS.globalFallback?.sites || [];
        return sites.some(pattern => {
            // 正则表达式模式：/pattern/
            if (pattern.startsWith('/') && pattern.endsWith('/') && pattern.length > 2) {
                try {
                    const regex = new RegExp(pattern.slice(1, -1));
                    return regex.test(currentHost);
                } catch (e) {
                    debugLog(`全局兜底正则解析失败: ${pattern}`, e);
                    return false;
                }
            }
            // 通配符前缀模式：*.domain.com
            if (pattern.startsWith('*.')) {
                const suffix = pattern.slice(1);
                return currentHost.endsWith(suffix) || currentHost === pattern.slice(2);
            }
            // 普通包含匹配
            return currentHost.includes(pattern);
        });
    }

    function injectFontAttributeStyles() {
        console.log('[PingFang] injectFontAttributeStyles 开始执行');
        const langs = ['sc', 'tc', 'hk', 'jp', 'kr', 'global'];
        let css = '';

        // 生成所有语言和字体类型的组合规则（只生成启用的类型）
        for (const lang of langs) {
            if (SETTINGS.enableSansReplacement) {
                const sansStack = buildFontStack('sans', lang);
                css += `[data-pf-font="sans-${lang}"] { font-family: ${sansStack} !important; }\n`;
            }
            if (SETTINGS.enableSerifReplacement) {
                const serifStack = buildFontStack('serif', lang);
                css += `[data-pf-font="serif-${lang}"] { font-family: ${serifStack} !important; }\n`;
            }
        }

        // 等宽字体单独处理（仅当启用时）
        if (SETTINGS.enableMonoReplacement) {
            const monoStack = buildFontStack('mono', 'global');
            css += `[data-pf-font="mono-sc"], [data-pf-font="mono-tc"], [data-pf-font="mono-hk"], [data-pf-font="mono-jp"], [data-pf-font="mono-kr"], [data-pf-font="mono-global"] { font-family: ${monoStack} !important; font-variant-numeric: tabular-nums !important; }\n`;
        }

        // 抗锯齿（始终应用，与字体替换无关）
        css += `html, body {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: auto !important;
        }\n`;

        const style = document.createElement('style');
        style.id = 'pf-font-rules';
        style.textContent = css;
        document.head.appendChild(style);

        console.log('[PingFang] pf-font-rules 已创建，长度:', css.length);
        debugLog('已注入基础 CSS 属性选择器规则');
    }

    function injectGlobalFontStyles() {
        const isYouTube = currentHost.includes('youtube.com') || currentHost.includes('youtu.be');
        const isGlobalFallback = needsGlobalFallback();

        // 只有 YouTube 或 globalFallback 站点才需要全局 * {} 样式
        if (!isYouTube && !isGlobalFallback) return;

        const defaultLang = getPagePrimaryCJKLang();
        let css = '';

        if (SETTINGS.enableSansReplacement) {
            const sansStack = buildFontStack('sans', defaultLang);
            css += `
/* 全局字体覆盖 */
* {
    font-family: ${sansStack} !important;
}
`;
        }

        if (css) {
            const style = document.createElement('style');
            style.id = 'pf-global-font-rules';
            style.textContent = css;
            document.head.appendChild(style);
            console.log('[PingFang] pf-global-font-rules 已创建', isYouTube ? '(YouTube)' : '(globalFallback)');
            debugLog('已注入全局字体样式');
        }
    }

    // 注意：injectFontAttributeStyles 的调用已移至 ensureHead 回调中

    function needsShadowDOMSupport() {
        return currentHost.includes('youtube.com') ||
               currentHost.includes('youtu.be') ||
               needsGlobalFallback();
    }

    /**
     * 获取用于 Shadow DOM 注入的 CSS
     */
    function getGlobalFallbackCSSForShadow() {
        if (!needsShadowDOMSupport()) return null;

        const defaultLang = getPagePrimaryCJKLang();
        let css = '';

        if (SETTINGS.enableSansReplacement) {
            const sansStack = buildFontStack('sans', defaultLang);
            css += `* { font-family: ${sansStack} !important; }\n`;
        }

        css += `* {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }\n`;

        return css;
    }

    /**
     * 为 Shadow Root 注入全局兜底样式
     */
    function injectGlobalFallbackIntoShadow(shadowRoot) {
        if (!shadowRoot || processedShadowRoots.has(shadowRoot)) return;
        if (!needsShadowDOMSupport()) return;

        processedShadowRoots.add(shadowRoot);

        const css = getGlobalFallbackCSSForShadow();
        if (!css) return;

        // 方式1：使用 adoptedStyleSheets（现代浏览器，性能更好）
        if ('adoptedStyleSheets' in shadowRoot) {
            try {
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(css);
                shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
                debugLog('Shadow DOM: 使用 adoptedStyleSheets 注入样式');
                return;
            } catch (e) {
                debugLog('Shadow DOM: adoptedStyleSheets 失败，回退到 style 标签', e);
            }
        }

        // 方式2：插入 style 标签
        const style = document.createElement('style');
        style.id = 'pf-shadow-global-fallback';
        style.textContent = css;
        shadowRoot.prepend(style);
        debugLog('Shadow DOM: 使用 style 标签注入样式');
    }

    /**
     * 递归遍历并处理所有 Shadow Root
     */
    function processAllShadowRoots(root = document) {
        if (!needsShadowDOMSupport()) return;

        const elements = root.querySelectorAll ? root.querySelectorAll('*') : [];

        for (const element of elements) {
            if (element.shadowRoot) {
                injectGlobalFallbackIntoShadow(element.shadowRoot);
                processShadowDOMElements(element.shadowRoot);
                processAllShadowRoots(element.shadowRoot);
            }
        }
    }

    /**
     * 直接对 YouTube 自定义元素设置内联样式（不走 processElement 流程，因为可能被排除）
     * 同时设置 data-pf-font 属性以保持一致性
     */
    function processYouTubeElements() {
        if (!currentHost.includes('youtube.com') && !currentHost.includes('youtu.be')) return;

        const defaultLang = getPagePrimaryCJKLang();
        const fontStack = buildFontStack('sans', defaultLang);

        const ytSelectors = [
            // 自定义元素标签
            'yt-formatted-string',
            'yt-dynamic-text-view-model',
            'yt-content-metadata-view-model',
            'yt-description-preview-view-model',
            'yt-tab-shape',
            'yt-chip-cloud-chip-renderer',
            'ytd-video-renderer',
            'ytd-rich-item-renderer',
            'ytd-compact-video-renderer',
            'ytd-comment-renderer',
            'ytd-channel-name',
            'ytd-video-meta-block',
            'ytd-badge-supported-renderer',
            'yt-live-chat-text-message-renderer',
            // ID 选择器
            '#video-title',
            '#channel-name',
            '#metadata',
            '#description',
            '#content',
            '#tabs',
            '#tabsContent',
            // 通用 class 选择器（关键！）
            '[class*="yt-"]',
            '[class*="ytd-"]',
            '[class*="yt-core"]',
            '[class*="yt-tab"]',
            '[class*="yt-spec"]',
            '[class*="yt-simple"]',
            // 特定 class
            '.title',
            '.ytd-video-renderer',
            '.yt-core-attributed-string',
            // 页面特定区域
            '#page-header',
            '#header',
            '#masthead',
            '#guide',
            '#items',
            '#contents',
            '#primary',
            '#secondary'
        ];

        let count = 0;

        // ★★★ 直接设置内联样式，确保生效 ★★★
        ytSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    el.setAttribute('data-pf-font', `sans-${defaultLang}`);
                    el.style.setProperty('font-family', fontStack, 'important');
                    processedElements.add(el);
                    count++;
                });
            } catch (e) {}
        });

        debugLog('已处理', count, '个 YouTube 元素');
    }

    function processShadowDOMElements(shadowRoot) {
        if (!shadowRoot) return;

        const elements = shadowRoot.querySelectorAll ? shadowRoot.querySelectorAll('*') : [];
        let count = 0;

        for (const el of elements) {
            if (!processedElements.has(el)) {
                // 由于 Shadow DOM 内元素无法通过普通 pendingNodes 处理
                // 我们直接调用 processElement 的逻辑
                try {
                    if (!el.tagName || isExcluded(el)) continue;

                    const fontType = detectFontType(el);
                    const shouldReplace = (fontType === 'sans' && SETTINGS.enableSansReplacement) ||
                                          (fontType === 'serif' && SETTINGS.enableSerifReplacement) ||
                                          (fontType === 'mono' && SETTINGS.enableMonoReplacement);

                    if (shouldReplace && fontType !== 'code') {
                        const lang = getLangMode(el);
                        const attrValue = `${fontType}-${lang}`;
                        el.setAttribute('data-pf-font', attrValue);
                        const fontStack = buildFontStack(fontType, lang);
                        el.style.setProperty('font-family', fontStack, 'important');
                        processedElements.add(el);
                        count++;
                    }
                } catch (e) {}
            }

            // 递归处理嵌套的 Shadow DOM
            if (el.shadowRoot) {
                processShadowDOMElements(el.shadowRoot);
            }
        }

        if (count > 0) {
            debugLog('已处理 Shadow DOM 内', count, '个元素');
        }
    }

    /**
     * 监听新创建的 Shadow Root
     */
    function observeShadowRootCreation() {
        if (!needsShadowDOMSupport()) return;

        const originalAttachShadow = Element.prototype.attachShadow;

        Element.prototype.attachShadow = function(options) {
            const shadowRoot = originalAttachShadow.call(this, options);

            // 延迟注入，等待内容填充
            setTimeout(() => {
                injectGlobalFallbackIntoShadow(shadowRoot);

                // 观察 Shadow DOM 内的变化，处理嵌套的 Shadow Root
                const shadowObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1) {
                                if (node.shadowRoot) {
                                    injectGlobalFallbackIntoShadow(node.shadowRoot);
                                }
                                // 检查子元素
                                if (node.querySelectorAll) {
                                    const descendants = node.querySelectorAll('*');
                                    for (const desc of descendants) {
                                        if (desc.shadowRoot) {
                                            injectGlobalFallbackIntoShadow(desc.shadowRoot);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                shadowObserver.observe(shadowRoot, {
                    childList: true,
                    subtree: true
                });
            }, 0);

            return shadowRoot;
        };

        debugLog('已启用 Shadow Root 创建监听');
    }

    // ==================== 字重模拟样式 ====================
    function injectSynthesisStyles() {
        if (!SETTINGS.fontSynthesis?.enabled) return;

        const method = SETTINGS.fontSynthesis.method;
        let css = '';

        switch (method) {
            case 'synthesis':
                css = `* { font-synthesis: weight style !important; }`;
                break;
            case 'stroke':
                css = `b, strong, [style*="font-weight: bold"], [style*="font-weight:bold"], [style*="font-weight: 700"], [style*="font-weight:700"] { -webkit-text-stroke: ${SETTINGS.fontSynthesis.compensateWeight}px currentColor; }`;
                break;
            case 'compensate':
                css = `* { -webkit-text-stroke: ${SETTINGS.fontSynthesis.compensateWeight}px currentColor; }`;
                break;
            case 'shadow':
                css = `b, strong, [style*="font-weight: bold"], [style*="font-weight:bold"] { text-shadow: ${SETTINGS.fontSynthesis.shadowOffsetX}px ${SETTINGS.fontSynthesis.shadowOffsetY}px ${SETTINGS.fontSynthesis.shadowBlur}px currentColor; }`;
                break;
        }

        if (css) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            debugLog('已注入字重模拟样式:', method);
        }
    }

    // 注意：injectSynthesisStyles 的调用已移至 ensureHead 回调中

    // ==================== 语言检测 ====================
    const CJK_LANGS = new Set(['sc', 'tc', 'hk', 'jp', 'kr']);
    const EDITABLE_TAGS = new Set(['input', 'textarea']);

    const LANG_PATTERNS = {
        jp: /[\u3040-\u309F\u30A0-\u30FF]/g,
        kr: /[\uAC00-\uD7AF\u1100-\u11FF]/g,
        // 简体独有字形（繁体中写法不同的高频字）- 扩展版
        sc: /[国为开学书长门马东车风飞鱼鸟龙云电语说话时过这进远运还边发办对关头实现见观应当经动务区业乐机会专难问买卖写读听处众从个么义习乡亲产亩华单历县叶团园图场块坏够声备复岁岛带广庄张归录总战护报择挂挥损据掘换摇热爱独献状环异盖积称窗练细终结统绩继网织给绿编缺罗联肃胜脑节规觉让证识试谁调请诉变费责质购赵轻载辑达选递邮量钟钢钱铁银错间阴阵队际随险隐页预领饭验骨齐齿龟龄丰汇优数码网络体验设计标准简洁资讯传输设备显示终端浏览储存档案处理编程软件硬件调试运维营销优化评测认证执照签约贷汇转账]/g,
        // 繁体独有字形（简体中写法不同的高频字）- 扩展版
        // 包含更多金融、科技、商务常用字
        tc: /[國為開學書長門馬東車風飛魚鳥龍雲電語說話時過這進遠運還邊發辦對關頭實現見觀應當經動務區業樂機會專難問買賣寫讀聽處眾從個麼義習鄉親產畝華單歷縣葉團園圖場塊壞夠聲備復歲島帶廣莊張歸錄總戰護報擇掛揮損據掘換搖熱愛獨獻狀環異蓋積稱窗練細終結統績繼網織給綠編缺羅聯肅勝腦節規覺讓證識試誰調請訴變費責質購趙輕載輯達選遞郵量鐘鋼錢鐵銀錯間陰陣隊際隨險隱頁預領飯驗骨齊齒龜齡豐匯滙優數碼網絡體驗設計標準簡潔資訊傳輸設備顯示終端瀏覽儲存檔案處理編程軟件軟體硬件硬體調試運維營銷優化評測認證執照簽約貸匯轉賬鈔務僅繫於佈據說網際經濟營運顧問諮詢評論觀點發佈發布時間視頻視訊廣告贊助訂閱關註聯絡]/g,
        cjk: /[\u4E00-\u9FFF\u3400-\u4DBF]/g,
        latin: /[a-zA-Z]/g
    };

    const LANG_ATTR_MAP = {
        'zh-cn': 'sc', 'zh-sg': 'sc', 'zh-my': 'sc', 'zh-hans': 'sc', 'cmn-hans': 'sc',
        'zh-tw': 'tc', 'zh-hant': 'tc', 'cmn-hant': 'tc',
        'zh-hk': 'hk', 'zh-mo': 'hk', 'yue': 'hk', 'yue-hant': 'hk',
        'ja': 'jp', 'ja-jp': 'jp',
        'ko': 'kr', 'ko-kr': 'kr'
    };

    // 私有使用区正则（PUA）
    const PUA_REGEX = /[\uE000-\uF8FF\uF0000-\uFFFFD\u100000-\u10FFFD]/;

    // 缓存
    const langCache = new WeakMap();
    const fontTypeCache = new WeakMap();
    const processedElements = new WeakSet();

    // 防抖定时器Map
    const debounceTimers = new WeakMap();

    // 获取防抖延迟
    function getDebounceDelay() {
        const delay = SETTINGS.inputDebounceDelay;
        if (typeof delay === 'number' && delay >= 5 && delay <= 9999) {
            return delay;
        }
        return 100; // 默认值
    }

    // 获取页面主语言
    function getPagePrimaryCJKLang() {
        const htmlLang = document.documentElement.lang?.toLowerCase() || '';
        if (LANG_ATTR_MAP[htmlLang]) return LANG_ATTR_MAP[htmlLang];

        const prefix = htmlLang.split('-')[0];
        if (LANG_ATTR_MAP[prefix]) return LANG_ATTR_MAP[prefix];

        return SETTINGS.defaultCJKLang || 'sc';
    }

    // 这样可以避免混合语言内容（如中文说明+日语引用）被错误判断
    function getDirectTextContent(element) {
        // 如果元素没有子元素，直接返回 textContent
        if (!element.children || element.children.length === 0) {
            return element.textContent || '';
        }

        // 获取元素自身的 lang 属性（用于判断子元素是否有"不同的" lang）
        const elementLang = element.lang?.toLowerCase() || element.closest('[lang]')?.lang?.toLowerCase() || '';

        let result = '';
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查这个元素是否有自己的、不同的 lang 属性
                        const nodeLang = node.lang?.toLowerCase();
                        if (nodeLang && nodeLang !== elementLang) {
                            // 跳过整个子树（不同语言的内容）
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            }
        }

        return result;
    }

    function countMatches(text, regex) {
        const matches = text.match(regex);
        return matches ? matches.length : 0;
    }

    // ==================== 语言检测核心（三级优先级） ====================
    // 优先级1: 明确的 lang 属性 (zh-CN, zh-TW, ja, ko 等)
    // 优先级2: 模糊 lang 属性 (zh) → 使用用户默认设置
    // 优先级3: 内容检测 + 权重保护（需要压倒性优势才切换）

    // 检查是否为明确的语言标签（返回语言代码或 null）
    function getExplicitCJKLang(langAttr) {
        if (!langAttr) return null;
        const lang = langAttr.toLowerCase().trim();

        // 明确的语言标签映射
        const explicitMap = {
            // 简体中文
            'zh-cn': 'sc', 'zh-sg': 'sc', 'zh-my': 'sc',
            'zh-hans': 'sc', 'zh-hans-cn': 'sc', 'zh-hans-sg': 'sc', 'zh-hans-my': 'sc',
            'cmn-hans': 'sc', 'cmn-hans-cn': 'sc',

            // 繁体中文（台湾）
            'zh-tw': 'tc', 'zh-hant': 'tc', 'zh-hant-tw': 'tc',
            'cmn-hant': 'tc', 'cmn-hant-tw': 'tc',

            // 繁体中文（港澳）
            'zh-hk': 'hk', 'zh-mo': 'hk', 'zh-hant-hk': 'hk', 'zh-hant-mo': 'hk',

            // 粤语
            'yue': 'hk', 'yue-hant': 'hk', 'yue-hk': 'hk', 'yue-mo': 'hk',
            'yue-hans': 'sc', 'yue-cn': 'sc',  // 简体粤语（广东）
            'zh-yue': 'hk', 'zh-yue-hk': 'hk', 'zh-yue-hant': 'hk',

            // 吴语（上海话等）- 通常用简体
            'wuu': 'sc', 'wuu-hans': 'sc', 'wuu-cn': 'sc', 'zh-wuu': 'sc',
            'wuu-hant': 'tc',  // 繁体吴语较少见

            // 闽南语
            'nan': 'tc', 'nan-tw': 'tc', 'nan-hant': 'tc', 'zh-nan': 'tc',  // 台湾闽南语
            'nan-cn': 'sc', 'nan-hans': 'sc',  // 大陆闽南语

            // 闽东语（福州话）
            'cdo': 'sc', 'cdo-hans': 'sc',
            'cdo-hant': 'tc',

            // 客家话
            'hak': 'tc', 'hak-tw': 'tc', 'hak-hant': 'tc', 'zh-hak': 'tc',  // 台湾客家
            'hak-cn': 'sc', 'hak-hans': 'sc',  // 大陆客家

            // 赣语
            'gan': 'sc', 'gan-hans': 'sc', 'zh-gan': 'sc',
            'gan-hant': 'tc',

            // 湘语
            'hsn': 'sc', 'hsn-hans': 'sc',

            // 晋语
            'cjy': 'sc', 'cjy-hans': 'sc',

            // 文言文/古文
            'lzh': 'tc', 'lzh-hant': 'tc', 'zh-lzh': 'tc', 'zh-classical': 'tc',
            'lzh-hans': 'sc',

            // 日语
            'ja': 'jp', 'ja-jp': 'jp', 'jpn': 'jp',
            'ja-latn': 'jp',  // 罗马字日语仍用日语字形

            // 韩语
            'ko': 'kr', 'ko-kr': 'kr', 'kor': 'kr',
            'ko-kp': 'kr',  // 朝鲜

            // 越南语汉喃（历史用途，用繁体字形）
            'vi-hani': 'tc', 'vi-hant': 'tc'
        };

        // 直接匹配
        if (explicitMap[lang]) return explicitMap[lang];

        // 尝试匹配前缀（处理 zh-Hans-CN 这类带额外后缀的情况）
        for (const [key, value] of Object.entries(explicitMap)) {
            if (lang.startsWith(key + '-')) return value;
        }

        return null;
    }

    // 检查是否为模糊的中文标签
    function isAmbiguousChineseLang(langAttr) {
        if (!langAttr) return false;
        const lang = langAttr.toLowerCase().trim();
        // 这些标签不明确指定简繁
        return ['zh', 'cmn', 'zh-cmn', 'chinese', 'chi', 'zho'].includes(lang);
    }

    // 统计文本中各语言特征字符数量
    function countLangFeatures(text) {
        return {
            jp: countMatches(text, LANG_PATTERNS.jp),      // 日语假名
            kr: countMatches(text, LANG_PATTERNS.kr),      // 韩语谚文
            sc: countMatches(text, LANG_PATTERNS.sc),      // 简体特征字
            tc: countMatches(text, LANG_PATTERNS.tc),      // 繁体特征字
            cjk: countMatches(text, LANG_PATTERNS.cjk),    // 所有CJK汉字
            latin: countMatches(text, LANG_PATTERNS.latin) // 拉丁字母
        };
    }

    // 返回检测到的文字系统 ID 及其字体配置
    function detectScriptFromUnicode(text) {
        if (!text || !SETTINGS.languageDetection?.enableUnicodeDetection) return null;

        const scriptCounts = {};

        // 遍历所有文字系统，统计匹配的字符数
        for (const [scriptId, config] of Object.entries(SCRIPT_FONT_MAP)) {
            if (config.regex) {
                const matches = text.match(config.regex);
                if (matches && matches.length > 0) {
                    scriptCounts[scriptId] = matches.length;
                }
            }
        }

        // 找出匹配字符最多的文字系统
        let maxScript = null;
        let maxCount = 0;
        for (const [scriptId, count] of Object.entries(scriptCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxScript = scriptId;
            }
        }

        if (maxScript && maxCount >= 2) {
            debugLog('Unicode 检测到文字系统:', maxScript, '字符数:', maxCount);
            return { scriptId: maxScript, config: SCRIPT_FONT_MAP[maxScript], charCount: maxCount };
        }

        return null;
    }

    function getScriptFromLangAttr(langAttr) {
        if (!langAttr || !SETTINGS.languageDetection?.enableLangAttrDetection) return null;

        const lang = langAttr.toLowerCase().trim();

        // 直接查找完整匹配
        if (LANG_TO_SCRIPT[lang]) {
            const scriptId = LANG_TO_SCRIPT[lang];
            debugLog('lang 属性匹配文字系统:', lang, '->', scriptId);
            return { scriptId, config: SCRIPT_FONT_MAP[scriptId] };
        }

        // 尝试匹配语言前缀（如 zh-CN -> zh）
        const langPrefix = lang.split('-')[0];
        if (langPrefix !== lang && LANG_TO_SCRIPT[langPrefix]) {
            const scriptId = LANG_TO_SCRIPT[langPrefix];
            debugLog('lang 前缀匹配文字系统:', langPrefix, '->', scriptId);
            return { scriptId, config: SCRIPT_FONT_MAP[scriptId] };
        }

        // 特殊处理中文变体
        if (lang.startsWith('zh')) {
            if (lang.includes('hans') || lang.includes('cn') || lang.includes('sg')) {
                return { scriptId: 'han_sc', config: SCRIPT_FONT_MAP.han_sc };
            }
            if (lang.includes('hant') || lang.includes('tw')) {
                return { scriptId: 'han_tc', config: SCRIPT_FONT_MAP.han_tc };
            }
            if (lang.includes('hk') || lang.includes('mo') || lang.includes('yue')) {
                return { scriptId: 'han_hk', config: SCRIPT_FONT_MAP.han_hk };
            }
            // 默认简体中文
            return { scriptId: 'han_sc', config: SCRIPT_FONT_MAP.han_sc };
        }

        return null;
    }

    function getScriptFonts(scriptConfig, fontType = 'sans') {
        if (!scriptConfig) return null;

        if (fontType === 'serif' && scriptConfig.serifFonts) {
            return scriptConfig.serifFonts;
        }
        if (fontType === 'sans' && scriptConfig.sansFonts) {
            return scriptConfig.sansFonts;
        }
        // 回退：如果没有对应类型的字体，使用另一种类型
        return scriptConfig.sansFonts || scriptConfig.serifFonts || null;
    }

    // 带权重保护的内容语言检测
    // baseLang: 基础语言（来自 lang 属性或用户默认）
    // 返回: 应该切换到的语言，或 null（保持 baseLang）
    //
    // 模式说明：
    // - preset: 预设（2倍保护），目标语言必须是当前语言的2倍才切换
    // - custom: 自定义倍数
    // - disabled: 禁用保护，达到阈值即切换（非拉丁优先效果）
    function detectLangWithProtection(text, baseLang, threshold) {
        if (!text || text.length < (threshold || 1)) return null;

        const counts = countLangFeatures(text);
        const wp = SETTINGS.weightProtection || { enabled: true, mode: 'preset', ratio: 2.0 };
        const useProtection = wp.enabled && wp.mode !== 'disabled';
        const ratio = (wp.mode === 'custom' ? (wp.ratio ?? 2.0) : 2.0);

        // 负数或零表示激进模式：达到阈值即切换
        const aggressiveMode = ratio <= 0;

        // 日语检测（假名）- 对所有非日语基础语言生效
        if (baseLang !== 'jp' && counts.jp >= threshold) {
            if (!useProtection || aggressiveMode) return 'jp';
            // 权重保护：假名数量 × ratio > 汉字数量 才切换
            // 即：大量假名时才判定为日语，少量假名（如注音）不切换
            if (counts.jp * ratio > counts.cjk) return 'jp';
        }

        // 韩语检测（谚文）- 对所有非韩语基础语言生效
        if (baseLang !== 'kr' && counts.kr >= threshold) {
            if (!useProtection || aggressiveMode) return 'kr';
            // 权重保护：谚文数量 × ratio > 汉字数量 才切换
            if (counts.kr * ratio > counts.cjk) return 'kr';
        }

        // 从 global 切换到 CJK 字体
        // 当基础语言是 global（非CJK页面）时，检测是否应该使用 CJK 字体
        if (baseLang === 'global' && counts.cjk >= threshold) {
            if (!useProtection || aggressiveMode) {
                // 禁用保护：达到阈值即切换（非拉丁优先效果）
                if (counts.tc > counts.sc) return 'tc';
                return SETTINGS.defaultCJKLang || 'sc';
            } else {
                // 有保护：CJK 字符必须是拉丁的 ratio 倍以上才切换
                if (counts.cjk > counts.latin * ratio) {
                    if (counts.tc > counts.sc * ratio) return 'tc';
                    return SETTINGS.defaultCJKLang || 'sc';
                }
            }
        }

        // 简繁检测 - 只在中文语境下进行（baseLang 已经是 CJK）
        if (['sc', 'tc', 'hk'].includes(baseLang)) {
            const scCount = counts.sc;
            const tcCount = counts.tc;

            // 基础语言是简体，检测是否应切换到繁体
            if (baseLang === 'sc' && tcCount >= threshold) {
                if (!useProtection || aggressiveMode) {
                    // 无保护或激进模式：繁体特征字更多就切换
                    if (tcCount > scCount) return 'tc';
                } else {
                    // 有保护：繁体特征字必须是简体的 ratio 倍以上才切换
                    if (tcCount > scCount * ratio) return 'tc';
                }
            }

            // 基础语言是繁体，检测是否应切换到简体
            if (['tc', 'hk'].includes(baseLang) && scCount >= threshold) {
                if (!useProtection || aggressiveMode) {
                    if (scCount > tcCount) return 'sc';
                } else {
                    // 有保护：简体特征字必须是繁体的 ratio 倍以上才切换
                    if (scCount > tcCount * ratio) return 'sc';
                }
            }
        }

        return null; // 保持原语言
    }

    // 简单内容检测（用于输入框，不带权重保护）
    function detectContentLang(text, threshold = null) {
        // ★★★ 修复：移除硬编码的长度限制，改为基于阈值判断 ★★★
        // 原来的 text.length < 3 会导致"這個"(2字符)无法触发检测
        const minThreshold = threshold || SETTINGS.mixedScriptThreshold || 1;
        if (!text || text.length < minThreshold) return null;
        const counts = countLangFeatures(text);

        // 找出数量最多且达到阈值的语言
        const candidates = [
            { lang: 'jp', count: counts.jp },
            { lang: 'kr', count: counts.kr },
            { lang: 'sc', count: counts.sc },
            { lang: 'tc', count: counts.tc }
        ].filter(c => c.count >= minThreshold);

        if (candidates.length === 0) return null;
        candidates.sort((a, b) => b.count - a.count);
        return candidates[0].lang;
    }

    function isChineseLangCode(lang) {
        return lang.startsWith('zh') || lang.startsWith('yue') || lang.startsWith('wuu') ||
               lang.startsWith('nan') || lang.startsWith('hak') || lang.startsWith('gan') ||
               lang.startsWith('lzh') || lang.startsWith('cmn');
    }

    function parseLangAttr(langAttr) {
        if (!langAttr) return 'global';
        const lang = langAttr.toLowerCase().trim();
        if (!SETTINGS.enableFineDetection) {
            const pageLang = getPagePrimaryCJKLang();
            if (CJK_LANGS.has(pageLang)) return pageLang;
        }
        if (LANG_ATTR_MAP[lang]) return LANG_ATTR_MAP[lang];
        const prefix = lang.split('-')[0];
        if (LANG_ATTR_MAP[prefix]) return LANG_ATTR_MAP[prefix];
        if (isChineseLangCode(lang)) {
            if (lang.includes('yue')) return 'hk';
            if (lang.includes('hk') || lang.includes('mo')) return 'hk';
            if (lang.includes('tw') || lang.includes('hant')) return 'tc';
            if (lang.startsWith('wuu') || lang.startsWith('nan') || lang.startsWith('hak') ||
                lang.startsWith('gan') || lang.startsWith('lzh')) return 'tc';
            if (lang.includes('cn') || lang.includes('sg') || lang.includes('my') || lang.includes('hans')) return 'sc';
            if (lang === 'zh' || lang === 'cmn' || lang === 'zh-cmn') return getPagePrimaryCJKLang();
            return SETTINGS.defaultCJKLang || 'sc';
        }
        return 'global';
    }

    function parseLangAttrWithoutForce(langAttr) {
        if (!langAttr) return 'global';
        const lang = langAttr.toLowerCase().trim();
        if (LANG_ATTR_MAP[lang]) return LANG_ATTR_MAP[lang];
        const prefix = lang.split('-')[0];
        if (LANG_ATTR_MAP[prefix]) return LANG_ATTR_MAP[prefix];
        if (isChineseLangCode(lang)) {
            if (lang.includes('yue')) return 'hk';
            if (lang.includes('hk') || lang.includes('mo')) return 'hk';
            if (lang.includes('tw') || lang.includes('hant')) return 'tc';
            if (lang.startsWith('wuu') || lang.startsWith('nan') || lang.startsWith('hak') ||
                lang.startsWith('gan') || lang.startsWith('lzh')) return 'tc';
            if (lang.includes('cn') || lang.includes('sg') || lang.includes('my') || lang.includes('hans')) return 'sc';
            return SETTINGS.defaultCJKLang || 'sc';
        }
        return 'global';
    }

    const SERIF_KEYWORDS = ['serif', 'times', 'georgia', 'garamond', '宋体', 'simsun', '明朝', 'mincho', 'ming', 'batang', 'songti', 'song'];
    const MONO_KEYWORDS = ['mono', 'monospace', 'courier', 'consolas', 'menlo', 'fira code', 'jetbrains', 'source code'];

    const codeRegionCache = new WeakMap();

    /**
     * 通过计算样式和内容特征检测是否为代码区域
     * 完全不依赖 CSS 选择器、class、tag 等
     */
    function isCodeRegion(element) {
        if (!element || !element.tagName) return false;
        if (codeRegionCache.has(element)) return codeRegionCache.get(element);

        let isCode = false;

        try {
            const style = window.getComputedStyle(element);
            const fontFamily = style.fontFamily.toLowerCase();
            const whiteSpace = style.whiteSpace;
            const display = style.display;
            const overflowX = style.overflowX;
            const tabSize = style.tabSize;

            // ========== 1. 字体特征检测 ==========
            // 检测是否使用等宽字体（代码区域的核心特征）
            const monoFontPatterns = [
                'mono', 'consolas', 'courier', 'menlo', 'monaco',
                'fira code', 'source code', 'jetbrains', 'hack',
                'inconsolata', 'droid sans mono', 'liberation mono',
                'ubuntu mono', 'roboto mono', 'sf mono', 'cascadia',
                'dejavu sans mono', 'lucida console', 'andale mono',
                'noto sans mono', 'ibm plex mono', 'fantasque',
                '等线', 'yahei mono', 'sarasa', 'iosevka'
            ];
            const hasMonoFont = monoFontPatterns.some(pattern => fontFamily.includes(pattern));

            // ========== 2. 布局特征检测 ==========
            // 代码区域通常保留空白字符
            const preservesWhitespace = ['pre', 'pre-wrap', 'pre-line', 'break-spaces'].includes(whiteSpace);

            // 代码块通常是块级元素
            const isBlockLevel = ['block', 'flex', 'grid'].includes(display);

            // 代码区域通常允许水平滚动
            const hasHorizontalScroll = ['auto', 'scroll'].includes(overflowX);

            // 自定义 tab-size 是代码区域的强特征
            const hasCustomTabSize = tabSize && tabSize !== '8' && tabSize !== 'normal';

            // ========== 3. 背景特征检测 ==========
            const bgColor = style.backgroundColor;
            const textColor = style.color;

            // 解析颜色
            const parsedBg = parseColor(bgColor);
            const parsedText = parseColor(textColor);

            // 检测是否有不同于默认的背景色（代码块常有灰色或深色背景）
            let hasDistinctBg = false;
            if (parsedBg) {
                const bgLuminance = getLuminance(parsedBg);
                // 深色背景 (luminance < 0.3) 或浅灰色背景 (RGB 差异小且不是纯白)
                const isGrayish = Math.abs(parsedBg.r - parsedBg.g) < 20 &&
                                  Math.abs(parsedBg.g - parsedBg.b) < 20 &&
                                  parsedBg.r < 250;
                hasDistinctBg = bgLuminance < 0.3 || (bgLuminance > 0.85 && bgLuminance < 0.98 && isGrayish);
            }

            // ========== 4. 内容特征检测 ==========
            const textContent = element.textContent || '';
            let contentScore = 0;

            if (textContent.length > 10 && textContent.length < 50000) {
                // 代码特征字符和模式
                const codePatterns = {
                    // 编程语法
                    brackets: /[{}\[\]()]/g,
                    operators: /[=+\-*/<>!&|^~%]/g,
                    semicolons: /;/g,
                    arrows: /=>|->|<-/g,

                    // 常见代码模式
                    functionDef: /\b(function|def|fn|func|sub|proc)\s*\w*\s*\(/gi,
                    classKeyword: /\b(class|struct|interface|enum|trait|impl)\s+\w+/gi,
                    controlFlow: /\b(if|else|elif|for|while|switch|case|try|catch|finally|return|break|continue|throw|yield|await|async)\b/gi,
                    variableDecl: /\b(var|let|const|int|float|double|string|bool|void|auto|val)\s+\w+/gi,
                    imports: /\b(import|require|include|using|from)\b.*[;'"]/gi,

                    // 代码注释
                    comments: /\/\/.*|\/\*[\s\S]*?\*\/|#.*|<!--[\s\S]*?-->/g,

                    // 字符串字面量
                    strings: /(['"`])(?:\\.|[^\\])*?\1/g,

                    // 数字字面量（十六进制、科学计数法等）
                    numbers: /\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*[eE][+-]?\d+\b/g,

                    // 命名规范（驼峰、下划线、全大写常量）
                    camelCase: /\b[a-z]+[A-Z][a-zA-Z]*\b/g,
                    snakeCase: /\b[a-z]+_[a-z_]+\b/g,
                    constants: /\b[A-Z][A-Z0-9_]{2,}\b/g,

                    // 特殊代码结构
                    methodChain: /\.\w+\(.*?\)\.\w+/g,
                    arrayAccess: /\w+\[\w+\]/g,
                    ternary: /\?.*?:/g,

                    // 命令行/shell 特征
                    shellPrompt: /^\s*[$#>]\s+\w+/gm,
                    flags: /\s--?\w+/g,
                    pipes: /\s\|\s/g,

                    // 路径和 URL
                    paths: /[\/\\][\w.-]+[\/\\][\w.-]+/g,

                    // 连续缩进行（代码块特征）
                    indentedLines: /^[ \t]{2,}\S/gm
                };

                // 计算各特征的出现频率
                const textLen = textContent.length;

                for (const [name, pattern] of Object.entries(codePatterns)) {
                    const matches = textContent.match(pattern);
                    if (matches) {
                        const density = matches.length / (textLen / 100);
                        // 根据密度加分
                        if (density > 0.5) contentScore += 2;
                        else if (density > 0.2) contentScore += 1;
                    }
                }

                // 检测行结构
                const lines = textContent.split('\n');
                if (lines.length > 3) {
                    // 一致的缩进模式
                    const indents = lines.filter(l => l.trim()).map(l => l.match(/^(\s*)/)[1].length);
                    const uniqueIndents = new Set(indents);
                    // 代码通常有规律的缩进层级（2、4、8等）
                    if (uniqueIndents.size > 2 && uniqueIndents.size < lines.length / 2) {
                        contentScore += 2;
                    }

                    // 短行特征（代码行通常较短）
                    const avgLineLen = lines.reduce((sum, l) => sum + l.length, 0) / lines.length;
                    if (avgLineLen < 80 && avgLineLen > 10) contentScore += 1;
                }
            }

            // ========== 5. 综合判定 ==========
            // 强特征：等宽字体 + 保留空白
            if (hasMonoFont && preservesWhitespace) {
                isCode = true;
            }
            // 强特征：等宽字体 + 特殊背景 + 块级
            else if (hasMonoFont && hasDistinctBg && isBlockLevel) {
                isCode = true;
            }
            // 强特征：等宽字体 + 自定义 tab-size
            else if (hasMonoFont && hasCustomTabSize) {
                isCode = true;
            }
            // 强特征：等宽字体 + 水平滚动
            else if (hasMonoFont && hasHorizontalScroll && isBlockLevel) {
                isCode = true;
            }
            // 中等特征组合：等宽字体 + 内容代码特征明显
            else if (hasMonoFont && contentScore >= 5) {
                isCode = true;
            }
            // 仅依赖内容特征：代码特征极其明显
            else if (contentScore >= 10 && preservesWhitespace) {
                isCode = true;
            }

            // ========== 6. 向上检查父元素（代码区域的子元素也应该被识别） ==========
            if (!isCode && element.parentElement) {
                // 只向上查找3层，避免性能问题
                let parent = element.parentElement;
                let depth = 0;
                while (parent && depth < 3) {
                    if (codeRegionCache.has(parent) && codeRegionCache.get(parent)) {
                        isCode = true;
                        break;
                    }
                    // 检查父元素的样式特征
                    const parentStyle = window.getComputedStyle(parent);
                    const parentFont = parentStyle.fontFamily.toLowerCase();
                    const parentWhiteSpace = parentStyle.whiteSpace;
                    if (monoFontPatterns.some(p => parentFont.includes(p)) &&
                        ['pre', 'pre-wrap'].includes(parentWhiteSpace)) {
                        isCode = true;
                        break;
                    }
                    parent = parent.parentElement;
                    depth++;
                }
            }

        } catch (e) {
            debugLog('代码区域检测出错:', e);
        }

        codeRegionCache.set(element, isCode);
        if (isCode) {
            debugLog('检测到代码区域:', element.tagName,
                     element.className ? `class="${element.className.toString().slice(0, 50)}"` : '');
        }
        return isCode;
    }

    /**
     * 解析 CSS 颜色值为 RGB 对象
     */
    function parseColor(colorStr) {
        if (!colorStr || colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') return null;

        // rgb(r, g, b) 或 rgba(r, g, b, a)
        const rgbMatch = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
        if (rgbMatch) {
            return {
                r: parseInt(rgbMatch[1]),
                g: parseInt(rgbMatch[2]),
                b: parseInt(rgbMatch[3])
            };
        }
        return null;
    }

    /**
     * 计算相对亮度 (0-1)
     */
    function getLuminance(rgb) {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function detectFontType(element) {
        if (fontTypeCache.has(element)) return fontTypeCache.get(element);
        if (isCodeRegion(element)) {
            fontTypeCache.set(element, 'code');
            return 'code';
        }

        let fontType = 'sans';
        try {
            const computedStyle = window.getComputedStyle(element);
            const fontFamily = computedStyle.fontFamily.toLowerCase();

            if (MONO_KEYWORDS.some(kw => fontFamily.includes(kw))) {
                fontType = 'mono';
            } else {
                // 检测 serif 的多种情况：
                // 1. fontFamily 以 ", serif" 或 "serif" 结尾（CSS声明了serif通用字体族）
                const endsWithSerif = /,\s*serif\s*$|^serif$/i.test(fontFamily);
                // 2. 包含明确的 serif 字体名（排除 sans-serif，但允许 "Noto Sans" 等）
                const hasSerifKeyword = SERIF_KEYWORDS.some(kw => fontFamily.includes(kw));
                // 3. 排除条件：如果包含 sans-serif 通用字体族，则不是 serif
                const hasSansSerif = fontFamily.includes('sans-serif');

                if (endsWithSerif || (hasSerifKeyword && !hasSansSerif)) {
                    fontType = 'serif';
                }
            }
        } catch (e) {}
        fontTypeCache.set(element, fontType);
        return fontType;
    }

    function isEditableElement(element) {
        if (!element || !element.tagName) return false;
        const tagName = element.tagName.toLowerCase();
        if (EDITABLE_TAGS.has(tagName)) return true;
        if (element.isContentEditable) return true;
        if (element.getAttribute('contenteditable') === 'true' || element.getAttribute('contenteditable') === '') return true;
        if (element.getAttribute('role') === 'textbox') return true;
        return SETTINGS.inputSelectors.some(sel => { try { return element.matches(sel); } catch { return false; } });
    }

    function findEditableRoot(element) {
        let current = element;
        while (current) {
            if (current.isContentEditable || current.getAttribute('contenteditable') === 'true' || current.getAttribute('contenteditable') === '') return current;
            if (current.getAttribute('role') === 'textbox') return current;
            if (SETTINGS.inputSelectors.some(sel => { try { return current.matches(sel); } catch { return false; } })) return current;
            current = current.parentElement;
        }
        return null;
    }

    function isEditableRoot(element) { return findEditableRoot(element) === element; }

    function isExcluded(element) {
        if (isEditableElement(element)) return false;
        if (EXCLUDED_TAGS.has(element.tagName.toLowerCase())) return true;

        if (EXCLUSION_RULES.classPatternRegex) {
            // 检查当前元素
            const className = element.className;
            if (typeof className === 'string' && className.length > 0 && EXCLUSION_RULES.classPatternRegex.test(className)) {
                return true;
            }
            // 检查祖先元素（向上遍历直到 body）
            let ancestor = element.parentElement;
            while (ancestor && ancestor !== document.body) {
                const ancestorClass = ancestor.className;
                if (typeof ancestorClass === 'string' && ancestorClass.length > 0 && EXCLUSION_RULES.classPatternRegex.test(ancestorClass)) {
                    return true;
                }
                ancestor = ancestor.parentElement;
            }
        }

        // 检查CSS选择器
        if (EXCLUSION_RULES.cssSelectors.some(sel => { try { return element.matches(sel); } catch { return false; } })) return true;

        if (!EDITABLE_TAGS.has(element.tagName.toLowerCase()) && element.children.length === 0 && element.textContent) {
            const text = element.textContent.trim();
            if (text.length === 1 && PUA_REGEX.test(text)) return true;
        }
        return false;
    }

    // 获取元素语言模式（三级优先级检测）
    function getLangMode(element, isInputRecheck = false) {
        if (!isInputRecheck && langCache.has(element)) return langCache.get(element);

        // ★★★ 新增：强制默认 CJK 模式 ★★★
        if (SETTINGS.forceDefaultCJK) {
            const forcedLang = SETTINGS.defaultCJKLang || 'sc';
            langCache.set(element, forcedLang);
            return forcedLang;
        }

        // ========== 确定基础语言 ==========
        let baseLang;
        let langFromAttr = false;  // 标记语言是否来自 lang 属性

        if (!SETTINGS.enableFineDetection) {
            // ★★★ 精细检测关闭：忽略内联 lang 属性，统一使用页面语言 ★★★
            baseLang = getPagePrimaryCJKLang();
        } else {
            // ========== 精细检测开启：考虑内联 lang 属性 ==========
            const langNode = element.closest('[lang]');
            const langAttr = langNode ? langNode.lang : document.documentElement.lang;

            // 优先级1: 明确的 lang 属性
            const explicitLang = getExplicitCJKLang(langAttr);
            if (explicitLang) {
                baseLang = explicitLang;
                langFromAttr = true;
                // ★★★ 关键修改：不再直接返回，继续进行内容检测验证 ★★★
            } else {
                // 优先级2: 模糊中文标签 → 用户默认设置；非中文或无标签 → global
                baseLang = isAmbiguousChineseLang(langAttr)
                    ? (SETTINGS.defaultCJKLang || 'sc')
                    : (isChineseLangCode(langAttr || '') ? (SETTINGS.defaultCJKLang || 'sc') : 'global');
            }
        }

        // ========== 获取文本内容 ==========
        const tagName = element.tagName.toLowerCase();
        const isEditable = EDITABLE_TAGS.has(tagName) || element.isContentEditable;
        const text = isEditable ? (element.value || element.textContent) : getDirectTextContent(element);

        // ========== 输入框特殊处理 ==========
        if (isEditable) {
            switch (SETTINGS.inputLangMode) {
                case 'lang-only':
                    langCache.set(element, baseLang);
                    return baseLang;
                case 'default-only':
                    langCache.set(element, SETTINGS.defaultCJKLang);
                    return SETTINGS.defaultCJKLang;
                case 'dynamic':
                    if (text && text.length > 0) {
                        const counts = countLangFeatures(text);
                        const inputThreshold = SETTINGS.inputMixedScriptThreshold || 1;

                        // ★★★ 读取权重保护设置 ★★★
                        const wp = SETTINGS.weightProtection || { enabled: true, mode: 'preset', ratio: 2.0, applyToInput: true };
                        const useInputProtection = wp.applyToInput !== false && wp.enabled && wp.mode !== 'disabled';
                        const ratio = (wp.mode === 'custom' ? (wp.ratio ?? 2.0) : 2.0);
                        // 负数或零表示激进模式：达到阈值即切换
                        const aggressiveMode = ratio <= 0;

                        // ★★★ 计算所有非拉丁字符（CJK 汉字 + 日语假名 + 韩语谚文） ★★★
                        const nonLatinCount = counts.cjk + counts.jp + counts.kr;

                        // ★★★ 日语假名检测（应用权重保护） ★★★
                        if (counts.jp >= inputThreshold) {
                            if (!useInputProtection || aggressiveMode) {
                                // 无保护：假名比汉字多就切换
                                if (counts.jp > counts.cjk) {
                                    langCache.set(element, 'jp');
                                    return 'jp';
                                }
                            } else {
                                // 有保护：假名 × ratio > 汉字 才切换
                                if (counts.jp * ratio > counts.cjk) {
                                    langCache.set(element, 'jp');
                                    return 'jp';
                                }
                            }
                        }

                        // ★★★ 韩语谚文检测（应用权重保护） ★★★
                        if (counts.kr >= inputThreshold) {
                            if (!useInputProtection || aggressiveMode) {
                                // 无保护：谚文比汉字多就切换
                                if (counts.kr > counts.cjk) {
                                    langCache.set(element, 'kr');
                                    return 'kr';
                                }
                            } else {
                                // 有保护：谚文 × ratio > 汉字 才切换
                                if (counts.kr * ratio > counts.cjk) {
                                    langCache.set(element, 'kr');
                                    return 'kr';
                                }
                            }
                        }

                        // ★★★ CJK 汉字检测 - 根据权重保护设置决定切换条件 ★★★
                        if (nonLatinCount >= inputThreshold) {
                            let shouldSwitch = false;

                            if (!useInputProtection || aggressiveMode) {
                                // 无保护或激进模式：达到阈值即切换
                                shouldSwitch = true;
                            } else if (ratio > 0) {
                                // 有保护：非拉丁字符必须 >= 拉丁字符
                                shouldSwitch = nonLatinCount >= counts.latin;
                            }

                            if (shouldSwitch) {
                                // 检测具体是哪种 CJK 语言
                                const detected = detectContentLang(text, inputThreshold);
                                if (detected && CJK_LANGS.has(detected)) {
                                    langCache.set(element, detected);
                                    return detected;
                                }
                                langCache.set(element, SETTINGS.defaultCJKLang);
                                return SETTINGS.defaultCJKLang;
                            }
                        }

                        // 未达切换条件，使用全局字体
                        langCache.set(element, 'global');
                        return 'global';
                    }
                    break;
            }
        }

        // ========== 优先级3: 内容检测 + 权重保护 ==========
        // ★★★ 修复：使用阈值设置而非硬编码的3 ★★★
        const pageThreshold = SETTINGS.mixedScriptThreshold || 3;
        if (SETTINGS.enableContentDetection && text && text.length >= pageThreshold) {
            const detectedLang = detectLangWithProtection(text, baseLang, pageThreshold);
            if (detectedLang) {
                baseLang = detectedLang;
            }
        }

        langCache.set(element, baseLang);
        return baseLang;
    }

    // ==================== 核心处理 ====================
    function processElement(element) {
        if (!element || !element.tagName || processedElements.has(element)) return;
        if (isExcluded(element)) return;

        const fontType = detectFontType(element);

        if (fontType === 'code') {
            processedElements.add(element);
            debugLog('跳过代码区域:', element.tagName);
            return;
        }

        const shouldReplace = (fontType === 'sans' && SETTINGS.enableSansReplacement) ||
                              (fontType === 'serif' && SETTINGS.enableSerifReplacement) ||
                              (fontType === 'mono' && SETTINGS.enableMonoReplacement);

        if (!shouldReplace) return;

        const lang = getLangMode(element);
        const attrValue = `${fontType}-${lang}`;

        // 使用 setAttribute 设置 data-pf-font 属性
        element.setAttribute('data-pf-font', attrValue);

        // ★★★ 关键：直接设置内联样式，优先级最高 ★★★
        const fontStack = buildFontStack(fontType, lang);
        element.style.setProperty('font-family', fontStack, 'important');

        // 输入框动态检测
        if (isEditableElement(element) && SETTINGS.inputLangMode === 'dynamic') {
            if (!element.dataset.nfObserved) {
                element.dataset.nfObserved = 'true';

                // 使用防抖的更新函数
                const updateInputFont = () => {
                    // 清除之前的定时器
                    if (debounceTimers.has(element)) {
                        clearTimeout(debounceTimers.get(element));
                    }

                    // 设置新的定时器
                    const timer = setTimeout(() => {
                        langCache.delete(element);
                        const newLang = getLangMode(element, true);
                        const newAttrValue = `${fontType}-${newLang}`;
                        element.setAttribute('data-pf-font', newAttrValue);
                        // ★★★ 同步更新内联样式 ★★★
                        const newFontStack = buildFontStack(fontType, newLang);
                        element.style.setProperty('font-family', newFontStack, 'important');
                        debounceTimers.delete(element);
                    }, getDebounceDelay());

                    debounceTimers.set(element, timer);
                };

                element.addEventListener('input', updateInputFont);
                element.addEventListener('compositionend', updateInputFont);

                // IME 组合开始时也触发（某些输入法需要）
                element.addEventListener('compositionstart', () => {
                    // 可选：组合开始时预设为CJK字体
                });

                // paste事件特殊处理：延迟到下一个事件循环，确保内容已插入
                element.addEventListener('paste', () => {
                    updateInputFont();
                    setTimeout(updateInputFont, 0);
                });

                // 对于contenteditable，还需要监听DOM变化（使用防抖）
                if (element.isContentEditable || element.getAttribute('contenteditable')) {
                    new MutationObserver(updateInputFont).observe(element, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                }
            }
        }

        processedElements.add(element);
    }

    let pendingNodes = new Set();
    let processingTimer = null;

    function processQueue() {
        if (pendingNodes.size === 0) { processingTimer = null; return; }
        const nodesToProcess = Array.from(pendingNodes);
        pendingNodes.clear();
        const batchSize = SETTINGS.performanceMode ? 50 : 200;
        for (let i = 0; i < nodesToProcess.length; i++) {
            processElement(nodesToProcess[i]);
            if (SETTINGS.performanceMode && i > 0 && i % batchSize === 0) break;
        }
        if (pendingNodes.size > 0 || nodesToProcess.length > batchSize) processingTimer = requestAnimationFrame(processQueue);
        else processingTimer = null;
    }

    const observer = new MutationObserver((mutations) => {
        let hasUpdates = false;
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && (mutation.attributeName === 'data-pf-font' || mutation.attributeName === 'data-pf-observed')) continue;
            if (mutation.type === 'characterData') { if (mutation.target.parentElement) { pendingNodes.add(mutation.target.parentElement); hasUpdates = true; } continue; }
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    pendingNodes.add(node);
                    const descendants = node.getElementsByTagName('*');
                    for (let i = 0; i < descendants.length; i++) pendingNodes.add(descendants[i]);
                    hasUpdates = true;
                }
            }
        }
        if (hasUpdates && !processingTimer) processingTimer = requestAnimationFrame(processQueue);
    });

    if (!isDisabled) observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: false });

    function initProcess() {
        if (isDisabled) return;
        debugLog('开始初始化处理');

        const isYouTube = currentHost.includes('youtube.com') || currentHost.includes('youtu.be');
        const needsShadowSupport = isYouTube || needsGlobalFallback();

        if (needsShadowSupport) {
            observeShadowRootCreation();
            debugLog('已启用 Shadow DOM 支持', isYouTube ? '(YouTube)' : '(globalFallback)');
        }

        const allElements = document.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) pendingNodes.add(allElements[i]);

        if (needsShadowSupport) {
            processAllShadowRoots();

            if (isYouTube) {
                processYouTubeElements();
            }

            const scanDelays = [100, 300, 500, 800, 1000, 1500, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 30000];
            scanDelays.forEach(delay => {
                setTimeout(() => {
                    debugLog(`延迟 ${delay}ms 扫描`);
                    processAllShadowRoots();
                    if (isYouTube) {
                        processYouTubeElements();
                    }
                }, delay);
            });

            const shadowObserver = new MutationObserver((mutations) => {
                let needsScan = false;
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            // 检查新添加的元素及其子元素是否有 Shadow Root
                            if (node.shadowRoot) {
                                injectGlobalFallbackIntoShadow(node.shadowRoot);
                                processShadowDOMElements(node.shadowRoot);
                                needsScan = true;
                            }
                            if (node.querySelectorAll) {
                                node.querySelectorAll('*').forEach(el => {
                                    if (el.shadowRoot) {
                                        injectGlobalFallbackIntoShadow(el.shadowRoot);
                                        processShadowDOMElements(el.shadowRoot);
                                        needsScan = true;
                                    }
                                });
                            }

                            if (isYouTube) {
                                const tagName = node.tagName?.toLowerCase() || '';
                                const className = (typeof node.className === 'string' ? node.className :
                                                   (node.className?.baseVal || String(node.className || ''))).toLowerCase();
                                // 扩展判断条件
                                const isYTElement = tagName.startsWith('yt') ||
                                                    tagName.startsWith('ytd') ||
                                                    tagName.startsWith('tp-yt') ||
                                                    className.includes('yt-') ||
                                                    className.includes('ytd-') ||
                                                    className.includes('yt_') ||
                                                    node.id?.includes('yt-') ||
                                                    node.id?.includes('ytd-');

                                if (isYTElement) {
                                    const fontStack = buildFontStack('sans', getPagePrimaryCJKLang());
                                    const lang = getPagePrimaryCJKLang();
                                    node.setAttribute('data-pf-font', `sans-${lang}`);
                                    node.style.setProperty('font-family', fontStack, 'important');
                                    processedElements.add(node);
                                }

                                // 也处理其所有子元素（不管是否是 YT 元素）
                                if (node.querySelectorAll) {
                                    const fontStack = buildFontStack('sans', getPagePrimaryCJKLang());
                                    const lang = getPagePrimaryCJKLang();
                                    node.querySelectorAll('*').forEach(child => {
                                        const childClass = (typeof child.className === 'string' ? child.className :
                                                           (child.className?.baseVal || String(child.className || ''))).toLowerCase();
                                        const childTag = child.tagName?.toLowerCase() || '';
                                        const childId = child.id?.toLowerCase() || '';
                                        if (childTag.startsWith('yt') || childTag.startsWith('ytd') || childTag.startsWith('tp-yt') ||
                                            childClass.includes('yt-') || childClass.includes('ytd-') || childClass.includes('yt_') ||
                                            childId.includes('yt-') || childId.includes('ytd-')) {
                                            child.setAttribute('data-pf-font', `sans-${lang}`);
                                            child.style.setProperty('font-family', fontStack, 'important');
                                            processedElements.add(child);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                if (needsScan) {
                    processAllShadowRoots();
                }
            });

            shadowObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
            debugLog('已启用 Shadow DOM 持续监听');
        }

        processQueue();
        debugLog('初始化完成，处理了', allElements.length, '个元素');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initProcess);
    else initProcess();

    // ==================== 设置面板 ====================
    function createSettingsPanel() {
        if (document.getElementById('pf-settings-panel')) return;

        // 生成字体组HTML（按分类）
        function generateFontGroupsHTML() {
            const categoryGroups = {};

            // 按分类分组
            for (const key in FONT_GROUP_DEFINITIONS) {
                const def = FONT_GROUP_DEFINITIONS[key];
                const cat = def.category;
                if (!categoryGroups[cat]) categoryGroups[cat] = [];
                categoryGroups[cat].push({ key, ...def });
            }

            // 排序分类
            const sortedCategories = Object.keys(categoryGroups).sort((a, b) => {
                return (FONT_CATEGORIES[a]?.order || 99) - (FONT_CATEGORIES[b]?.order || 99);
            });

            let html = '';
            for (const cat of sortedCategories) {
                const catInfo = FONT_CATEGORIES[cat] || { name: cat };
                const groups = categoryGroups[cat];

                html += `<div class="pf-font-category">
                    <div class="pf-font-category-header">
                        <span class="pf-font-category-name">${catInfo.name}</span>
                        <button class="pf-font-category-toggle" data-category="${cat}" title="全选/取消全选">⊕</button>
                    </div>
                    <div class="pf-font-category-items">`;

                for (const group of groups) {
                    const checked = isFontGroupEnabled(group.key) ? 'checked' : '';
                    html += `<label class="pf-font-group-item" title="${group.desc}&#10;字体: ${group.fonts.length}个">
                        <input type="checkbox" id="pf-fontgroup-${group.key}" data-group="${group.key}" ${checked}>
                        <span class="pf-font-group-emoji">${group.emoji}</span>
                        <span class="pf-font-group-name">${group.name}</span>
                        <span class="pf-font-group-count">${group.fonts.length}</span>
                    </label>`;
                }

                html += `</div></div>`;
            }

            return html;
        }


        const panel = document.createElement('div');
        panel.id = 'pf-settings-panel';
        panel.innerHTML = `
            <div class="pf-overlay"></div>
            <div class="pf-panel">
                <div class="pf-header">
                    <div class="pf-header-left"><span class="pf-logo">🍎</span><div class="pf-title-group"><h2>苹方字体替换设置</h2><span class="pf-subtitle">✨ V2.0 · YouTube全覆盖</span></div></div>
                    <button class="pf-close" title="关闭">×</button>
                </div>
                <div class="pf-body">
                    <div class="pf-mobile-tabs">
                        <button class="pf-mobile-tab active" data-tab="basic">🔧 基础</button>
                        <button class="pf-mobile-tab" data-tab="language">🌐 语言</button>
                        <button class="pf-mobile-tab" data-tab="fonts">📦 字体</button>
                        <button class="pf-mobile-tab" data-tab="emoji">🎨 Emoji</button>
                        <button class="pf-mobile-tab" data-tab="synthesis">⚖️ 字重</button>
                        <button class="pf-mobile-tab" data-tab="exclusion">🚫 排除</button>
                        <button class="pf-mobile-tab" data-tab="advanced">⚙️ 高级</button>
                    </div>
                    <div class="pf-sidebar">
                        <button class="pf-nav-item active" data-tab="basic">🔧 基础设置</button>
                        <button class="pf-nav-item" data-tab="language">🌐 语言检测</button>
                        <button class="pf-nav-item" data-tab="fonts">📦 字体组管理</button>
                        <button class="pf-nav-item" data-tab="emoji">🎨 Emoji 配置</button>
                        <button class="pf-nav-item" data-tab="synthesis">⚖️ 字重模拟</button>
                        <button class="pf-nav-item" data-tab="exclusion">🚫 排除规则</button>
                        <button class="pf-nav-item" data-tab="advanced">⚙️ 高级设置</button>
                    </div>
                    <div class="pf-content">
                        <div class="pf-tab-content active" data-tab="basic">
                            <div class="pf-section"><h3>⚡ 功能开关</h3><div class="pf-card">
                                <label class="pf-option-card"><div class="pf-option-emoji">🚀</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">启用脚本</span><input type="checkbox" id="pf-enabled" ${SETTINGS.enabled?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">总开关，控制整个脚本的启用状态。关闭后脚本完全停止工作，不会注入任何字体或修改任何样式。</span></div></label>
                                <label class="pf-option-card"><div class="pf-option-emoji">🔤</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">Sans 字体替换</span><input type="checkbox" id="pf-enableSansReplacement" ${SETTINGS.enableSansReplacement?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">将网页的无衬线字体替换为 Inter（拉丁）+ 苹方（中文）系列。这是最常见的网页字体类型，建议开启。</span></div></label>
                                <label class="pf-option-card"><div class="pf-option-emoji">📖</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">Serif 字体替换</span><input type="checkbox" id="pf-enableSerifReplacement" ${SETTINGS.enableSerifReplacement?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">将网页的衬线字体替换为苹方 + Noto Serif 回退。适用于阅读类网站、文档页面。</span></div></label>
                                <label class="pf-option-card"><div class="pf-option-emoji">💻</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">Mono 字体替换</span><input type="checkbox" id="pf-enableMonoReplacement" ${SETTINGS.enableMonoReplacement?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">将网页的等宽字体替换为 Noto Sans Mono（等宽字体不变）。适用于代码编辑器、终端界面。可在「字体组管理」中设置自定义等宽字体。</span></div></label>
                            </div></div>
                            <div class="pf-section"><h3>🌐 全局字体兜底</h3><div class="pf-card">
                                <label class="pf-option-card"><div class="pf-option-emoji">🎯</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">启用全局兜底</span><input type="checkbox" id="pf-globalFallbackEnabled" ${SETTINGS.globalFallback?.enabled!==false?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">对列表中的网站强制应用 * {} 全局字体规则，解决部分网站字体替换不完全的问题。</span></div></label>
                                <div id="pf-globalFallbackSitesWrapper" style="${SETTINGS.globalFallback?.enabled===false?'opacity:0.5;pointer-events:none':''}">
                                    <div class="pf-textarea-wrapper" style="margin-top:8px;"><span class="pf-textarea-icon">🌐</span><textarea id="pf-globalFallbackSites" class="pf-textarea pf-code" rows="3" placeholder="每行一个域名匹配规则">${(SETTINGS.globalFallback?.sites || []).join('\n')}</textarea></div>
                                    <p class="pf-hint-text">💡 支持三种匹配格式：<br>📝 <code>youtube.com</code>（包含匹配）<br>✳️ <code>*.example.com</code>（后缀匹配）<br>🔣 <code>/正则表达式/</code>（高级匹配）</p>
                                </div>
                            </div></div>
                            <div class="pf-section"><h3>🌏 默认 CJK 语言</h3><div class="pf-card"><div class="pf-select-wrapper"><span class="pf-select-icon">🗣️</span>
                                <div class="pf-custom-select" data-select-id="pf-defaultCJKLang">
                                    <div class="pf-select-trigger" tabindex="0">
                                        <span class="pf-select-value"><span class="pf-select-text">请选择</span></span>
                                        <span class="pf-select-arrow">▼</span>
                                    </div>
                                    <div class="pf-select-dropdown">
                                        <div class="pf-select-option" data-value="sc"><span class="pf-select-option-emoji">🇨🇳</span><span class="pf-select-option-text">简体中文（SC）</span></div>
                                        <div class="pf-select-option" data-value="tc"><span class="pf-select-option-emoji">🇹🇼</span><span class="pf-select-option-text">繁体中文（TC）</span></div>
                                        <div class="pf-select-option" data-value="hk"><span class="pf-select-option-emoji">🇭🇰</span><span class="pf-select-option-text">香港繁体（HK）</span></div>
                                        <div class="pf-select-option" data-value="jp"><span class="pf-select-option-emoji">🇯🇵</span><span class="pf-select-option-text">日语（JP）</span></div>
                                        <div class="pf-select-option" data-value="kr"><span class="pf-select-option-emoji">🇰🇷</span><span class="pf-select-option-text">韩语（KR）</span></div>
                                    </div>
                                    <select id="pf-defaultCJKLang" class="pf-select-hidden">
                                        <option value="sc" ${SETTINGS.defaultCJKLang==='sc'?'selected':''}>🇨🇳 简体中文（SC）</option>
                                        <option value="tc" ${SETTINGS.defaultCJKLang==='tc'?'selected':''}>🇹🇼 繁体中文（TC）</option>
                                        <option value="hk" ${SETTINGS.defaultCJKLang==='hk'?'selected':''}>🇭🇰 香港繁体（HK）</option>
                                        <option value="jp" ${SETTINGS.defaultCJKLang==='jp'?'selected':''}>🇯🇵 日语（JP）</option>
                                        <option value="kr" ${SETTINGS.defaultCJKLang==='kr'?'selected':''}>🇰🇷 韩语（KR）</option>
                                    </select>
                                </div>
                            </div><p class="pf-hint-text">📝 当网页没有设置 lang 属性或设置了模糊的「zh」时，使用此语言作为默认值。<br>🀄 <b>SC</b>＝简体中文字形，<b>TC</b>＝台湾繁体字形，<b>HK</b>＝香港繁体字形（部分字形与 TC 不同）<br>🇯🇵 <b>JP</b>＝日语汉字字形（如「直」的写法不同），<b>KR</b>＝韩语汉字字形</p>
                                <label class="pf-option-card" style="margin-top:12px;"><div class="pf-option-emoji">🔒</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">强制使用默认 CJK 语言</span><input type="checkbox" id="pf-forceDefaultCJK" ${SETTINGS.forceDefaultCJK?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">开启后，所有 CJK 内容都将使用上方设置的默认语言字体，忽略网页的 lang 属性和内容检测结果。适合希望统一字体风格的用户。</span></div></label>
                                <p class="pf-hint-text">🔒 <b>强制模式说明</b>：开启后，无论网页标记为 zh-TW、zh-HK 还是 ja、ko，都将统一使用你设置的默认 CJK 语言字体。<br>⚠️ <b>注意</b>：这可能导致部分汉字显示为非本地化字形（如日语页面的汉字显示为简体中文字形）。<br>💡 <b>适用场景</b>：个人偏好统一字体风格、不在意字形本地化差异、或默认检测结果不符合预期时使用。</p>
                            </div></div>
                            <div class="pf-section"><h3>⏱️ 字体显示策略</h3><div class="pf-card"><div class="pf-select-wrapper"><span class="pf-select-icon">🎯</span>
                                <div class="pf-custom-select" data-select-id="pf-fontDisplay">
                                    <div class="pf-select-trigger" tabindex="0">
                                        <span class="pf-select-value"><span class="pf-select-text">请选择</span></span>
                                        <span class="pf-select-arrow">▼</span>
                                    </div>
                                    <div class="pf-select-dropdown">
                                        <div class="pf-select-option" data-value="swap"><span class="pf-select-option-emoji">💫</span><span class="pf-select-option-text">swap（推荐）</span></div>
                                        <div class="pf-select-option" data-value="block"><span class="pf-select-option-emoji">🔲</span><span class="pf-select-option-text">block</span></div>
                                        <div class="pf-select-option" data-value="fallback"><span class="pf-select-option-emoji">🔙</span><span class="pf-select-option-text">fallback</span></div>
                                        <div class="pf-select-option" data-value="optional"><span class="pf-select-option-emoji">❓</span><span class="pf-select-option-text">optional</span></div>
                                    </div>
                                    <select id="pf-fontDisplay" class="pf-select-hidden">
                                        <option value="swap" ${SETTINGS.fontDisplay==='swap'?'selected':''}>💫 swap（推荐）</option>
                                        <option value="block" ${SETTINGS.fontDisplay==='block'?'selected':''}>🔲 block</option>
                                        <option value="fallback" ${SETTINGS.fontDisplay==='fallback'?'selected':''}>🔙 fallback</option>
                                        <option value="optional" ${SETTINGS.fontDisplay==='optional'?'selected':''}>❓ optional</option>
                                    </select>
                                </div>
                            </div><p class="pf-hint-text">💫 <b>swap</b>：立即显示后备字体，字体加载完成后切换（推荐，用户体验最佳）<br>🔲 <b>block</b>：短暂隐藏文字直到字体加载完成（避免字体闪烁，但可能有白屏）<br>🔙 <b>fallback</b>：短暂等待后显示后备字体，之后不再切换<br>❓ <b>optional</b>：由浏览器决定，网络慢时可能不加载字体</p></div></div>
                        </div>
                        <div class="pf-tab-content" data-tab="language">
                            <div class="pf-section"><h3>🔍 精细检测模式</h3><div class="pf-card">
                                <label class="pf-option-card"><div class="pf-option-emoji">🎯</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">启用精细检测</span><input type="checkbox" id="pf-enableFineDetection" ${SETTINGS.enableFineDetection?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">读取每个元素的 lang 属性来决定字体。例如 &lt;span lang="zh-TW"&gt; 会使用台湾繁体字体，&lt;span lang="zh-HK"&gt; 会使用香港繁体字体。严格区分 TC 和 HK 字形。</span></div></label>
                                <label class="pf-option-card" id="pf-contentDetectionRow"><div class="pf-option-emoji">📊</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">内容语言检测（页面文本）</span><input type="checkbox" id="pf-enableContentDetection" ${SETTINGS.enableContentDetection?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">根据文本内容自动判断语言。例如检测到「國」「學」等繁体字会自动切换到繁体字体，检测到「国」「学」会使用简体字体。可覆盖错误的 lang 属性。</span></div></label>
                                <p class="pf-hint-text">💡 <b>两个选项的区别</b>：精细检测依赖网页的 lang 属性标记，内容检测则分析实际文字内容。建议同时开启以获得最佳效果。</p>
                            </div></div>
                            <div class="pf-section"><h3>⌨️ 输入框检测模式</h3><div class="pf-card">
                                <div class="pf-input-row" style="flex-direction:column;align-items:stretch;gap:8px;">
                                    <div class="pf-select-wrapper"><span class="pf-select-icon">✍️</span>
                                        <div class="pf-custom-select" data-select-id="pf-inputLangMode">
                                            <div class="pf-select-trigger" tabindex="0">
                                                <span class="pf-select-value"><span class="pf-select-text">请选择</span></span>
                                                <span class="pf-select-arrow">▼</span>
                                            </div>
                                            <div class="pf-select-dropdown">
                                                <div class="pf-select-option" data-value="dynamic"><span class="pf-select-option-emoji">🔄</span><span class="pf-select-option-text">动态检测（实时识别输入内容）</span></div>
                                                <div class="pf-select-option" data-value="lang-only"><span class="pf-select-option-emoji">🏷️</span><span class="pf-select-option-text">沿用网页 lang 属性</span></div>
                                                <div class="pf-select-option" data-value="default-only"><span class="pf-select-option-emoji">🌐</span><span class="pf-select-option-text">跟随默认 CJK 语言设置</span></div>
                                            </div>
                                            <select id="pf-inputLangMode" class="pf-select-hidden">
                                                <option value="dynamic" ${SETTINGS.inputLangMode==='dynamic'?'selected':''}>🔄 动态检测（实时识别输入内容）</option>
                                                <option value="lang-only" ${SETTINGS.inputLangMode==='lang-only'?'selected':''}>🏷️ 沿用网页 lang 属性</option>
                                                <option value="default-only" ${SETTINGS.inputLangMode==='default-only'?'selected':''}>🌐 跟随默认 CJK 语言设置</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p class="pf-hint-text">🔄 <b>动态检测</b>：实时分析输入内容，自动切换字体。输入中文用中文字体，输入日文假名用日文字体。<br>🏷️ <b>沿用 lang 属性</b>：使用网页设置的语言，不随输入内容变化。<br>🌐 <b>跟随默认</b>：始终使用「默认 CJK 语言」设置的字体。</p>
                                </div>
                            </div></div>
                            <div class="pf-section" id="pf-debounceSection"><h3>⏳ 输入框防抖延迟</h3><div class="pf-card">
                                <div class="pf-input-row" style="flex-direction:column;align-items:stretch;gap:8px;">
                                    <div style="display:flex;align-items:center;gap:12px;">
                                        <span class="pf-input-icon">⏱️</span>
                                        <input type="number" id="pf-inputDebounceDelay" class="pf-input" value="${SETTINGS.inputDebounceDelay || 50}" style="width:100px;">
                                        <span>毫秒（ms）</span>
                                    </div>
                                    <p class="pf-hint-text">⏱️ 输入时等待指定毫秒后才执行字体检测，减少性能消耗。<br>🐢 如果在复杂网页（如 Claude、Notion）上打字卡顿，建议增大到 200～500ms。<br>⚡ 值越小响应越快但更耗性能，默认 50ms 适合大多数情况。</p>
                                </div>
                            </div></div>
                            <div class="pf-section" id="pf-thresholdSection"><h3>📐 检测阈值</h3><div class="pf-card">
                                <div class="pf-input-row" id="pf-pageThresholdRow"><span class="pf-input-icon">📄</span><label>页面内容阈值：</label><input type="number" id="pf-mixedScriptThreshold" class="pf-input pf-number-input" min="1" max="100" step="1" value="${SETTINGS.mixedScriptThreshold}"></div>
                                <div class="pf-input-row" id="pf-inputThresholdRow"><span class="pf-input-icon">⌨️</span><label>输入框阈值：</label><input type="number" id="pf-inputMixedScriptThreshold" class="pf-input pf-number-input" min="1" max="20" step="1" value="${SETTINGS.inputMixedScriptThreshold}"></div>
                                <p class="pf-hint-text">📐 检测到多少个目标语言字符才触发字体切换。<br>📄 <b>页面内容阈值</b>：静态页面文本的检测灵敏度，值越小越灵敏。<br>⌨️ <b>输入框阈值</b>：输入时的检测灵敏度，通常设为 1 以快速响应。</p>
                            </div></div>
                            <div class="pf-section"><h3>🛡️ 权重保护</h3><div class="pf-card">
                                <div class="pf-input-row" style="flex-direction:column;align-items:stretch;gap:8px;">
                                    <div class="pf-select-wrapper"><span class="pf-select-icon">⚖️</span>
                                        <div class="pf-custom-select" data-select-id="pf-weightProtectionMode">
                                            <div class="pf-select-trigger" tabindex="0">
                                                <span class="pf-select-value"><span class="pf-select-text">请选择</span></span>
                                                <span class="pf-select-arrow">▼</span>
                                            </div>
                                            <div class="pf-select-dropdown">
                                                <div class="pf-select-option" data-value="preset"><span class="pf-select-option-emoji">🎯</span><span class="pf-select-option-text">预设（2 倍保护）</span></div>
                                                <div class="pf-select-option" data-value="custom"><span class="pf-select-option-emoji">🔧</span><span class="pf-select-option-text">自定义倍数</span></div>
                                                <div class="pf-select-option" data-value="disabled"><span class="pf-select-option-emoji">❌</span><span class="pf-select-option-text">禁用保护</span></div>
                                            </div>
                                            <select id="pf-weightProtectionMode" class="pf-select-hidden">
                                                <option value="preset" ${(SETTINGS.weightProtection?.mode||'preset')==='preset'?'selected':''}>🎯 预设（2 倍保护）</option>
                                                <option value="custom" ${SETTINGS.weightProtection?.mode==='custom'?'selected':''}>🔧 自定义倍数</option>
                                                <option value="disabled" ${SETTINGS.weightProtection?.mode==='disabled'?'selected':''}>❌ 禁用保护</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="pf-weightProtectionRatioRow" class="pf-input-row" style="${SETTINGS.weightProtection?.mode==='custom'?'':'display:none'}">
                                        <span class="pf-input-icon">🔢</span><label>保护倍数：</label>
                                        <input type="number" id="pf-weightProtectionRatio" class="pf-input" style="width:100px;" step="0.1" min="0.1" value="${SETTINGS.weightProtection?.ratio||2}">
                                    </div>
                                    <div id="pf-weightProtectionError" class="pf-error-box" style="display:none;margin-top:8px;padding:10px 12px;background:rgba(255,59,48,0.1);border:1px solid rgba(255,59,48,0.3);border-radius:8px;color:#ff3b30;font-size:12px;">⚠️ 输入数值无效，请输入大于 0 的数字</div>
                                    <label class="pf-option-card" id="pf-wpApplyToInputRow" style="margin-top:8px;"><div class="pf-option-emoji">⌨️</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">应用到输入框</span><input type="checkbox" id="pf-weightProtectionApplyToInput" ${SETTINGS.weightProtection?.applyToInput!==false?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">输入框也沿用上面的权重保护设置。关闭后输入框达到阈值即切换字体，响应更快。</span></div></label>
                                    <p class="pf-hint-text">🎯 <b>预设（2 倍）</b>：目标语言字符必须是当前语言的 2 倍才切换。适用于所有语言检测（日语、韩语、简繁体）。<br>🔧 <b>自定义</b>：自定义倍数阈值，值越大越保守。<br>❌ <b>禁用</b>：达到检测阈值即切换，实现「非拉丁优先」效果。<br>　　→ 适合「Noto 字体 2.8.0.user.js」这类中英混排，只要有中文就用中文字体。<br>💡 <b>举例</b>：ratio＝2 时，中文页面中夹带少量日语假名（如注音）不会触发切换到日语字体。</p>
                                </div>
                            </div></div>
                        </div>
                        <div class="pf-tab-content" data-tab="fonts">
                            <div class="pf-section">
                                <h3>🍎 苹方字体设置</h3>
                                <div class="pf-card">
                                    <label class="pf-option-card"><div class="pf-option-emoji">📦</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">加载全部字重</span><input type="checkbox" id="pf-loadAllWeights" ${SETTINGS.loadAllWeights?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">加载全部 6 种字重（Thin/Ultralight/Light/Regular/Medium/Semibold）。关闭后只加载 Regular 和 Medium 字重，可节省加载时间。</span></div></label>
                                </div>
                            </div>

                            <div class="pf-section">
                                <h3>📦 Noto 回退字体组</h3>
                                <p class="pf-hint">✅ 选择需要从 Google Fonts 加载的 Noto 字体组。这些字体作为苹方字体的回退。<br>❎ 未勾选的字体组不会加载，可节省带宽和加载时间。<br>⭐「常用」按钮会选择：基础拉丁、CJK 中日韩、符号系统。</p>
                                <div class="pf-font-groups-toolbar">
                                    <button class="pf-btn pf-btn-sm" id="pf-font-select-all">✅ 全选</button>
                                    <button class="pf-btn pf-btn-sm" id="pf-font-select-none">❎ 全不选</button>
                                    <button class="pf-btn pf-btn-sm" id="pf-font-select-common">⭐ 常用</button>
                                </div>
                                <div class="pf-font-groups-container">
                                    ${generateFontGroupsHTML()}
                                </div>
                            </div>
                            <div class="pf-section"><h3>⌨️ 自定义等宽字体</h3><div class="pf-card">
                                <div class="pf-input-row"><span class="pf-input-icon">💻</span><input type="text" id="pf-customMonoFont" class="pf-input" value="${SETTINGS.customMonoFont}" placeholder="如：Maple Mono, JetBrains Mono"></div>
                                <p class="pf-hint-text">💻 在此输入你喜欢的等宽字体名称，它会被添加到等宽字体栈的最前面。<br>📝 多个字体用逗号分隔，如：「Maple Mono, JetBrains Mono, Fira Code」<br>⚠️ 需要确保该字体已安装在你的电脑上。</p>
                            </div></div>
                        </div>
                        <div class="pf-tab-content" data-tab="emoji">
                            <div class="pf-section"><h3>😀 Emoji 基础</h3><div class="pf-card">
                                <label class="pf-option-card"><div class="pf-option-emoji">🎨</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">启用 Emoji 字体</span><input type="checkbox" id="pf-enableEmojiFont" ${SETTINGS.enableEmojiFont?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">加载 Noto Color Emoji 字体，提供跨平台一致的彩色 Emoji 显示效果。文件较大（约 10MB），首次加载可能较慢。</span></div></label>
                            </div></div>
                            <div class="pf-section" id="pf-emojiStackSection"><h3>📊 字体栈优先级</h3><div class="pf-card">
                                <div class="pf-select-wrapper"><span class="pf-select-icon">📈</span>
                                    <div class="pf-custom-select" data-select-id="pf-emojiInFontStack">
                                        <div class="pf-select-trigger" tabindex="0">
                                            <span class="pf-select-value"><span class="pf-select-text">请选择</span></span>
                                            <span class="pf-select-arrow">▼</span>
                                        </div>
                                        <div class="pf-select-dropdown">
                                            <div class="pf-select-option" data-value="high"><span class="pf-select-option-emoji">⬆️</span><span class="pf-select-option-text">高优先级（靠前）</span></div>
                                            <div class="pf-select-option" data-value="low"><span class="pf-select-option-emoji">⬇️</span><span class="pf-select-option-text">低优先级（靠后）</span></div>
                                            <div class="pf-select-option" data-value="none"><span class="pf-select-option-emoji">🚫</span><span class="pf-select-option-text">不加入字体栈</span></div>
                                        </div>
                                        <select id="pf-emojiInFontStack" class="pf-select-hidden">
                                            <option value="high" ${(SETTINGS.emojiConfig?.emojiInFontStack||'high')==='high'?'selected':''}>⬆️ 高优先级（靠前）</option>
                                            <option value="low" ${SETTINGS.emojiConfig?.emojiInFontStack==='low'?'selected':''}>⬇️ 低优先级（靠后）</option>
                                            <option value="none" ${SETTINGS.emojiConfig?.emojiInFontStack==='none'?'selected':''}>🚫 不加入字体栈</option>
                                        </select>
                                    </div>
                                </div>
                                <p class="pf-hint-text">⬆️ <b>高优先级</b>：Emoji 字体放在字体栈最前面，优先使用 Noto Color Emoji 显示。<br>⬇️ <b>低优先级</b>：Emoji 字体放在 CJK 字体之后，可能会被其他字体中的符号覆盖。<br>🚫 <b>不加入</b>：不将 Emoji 字体加入字体栈，完全由系统决定。</p>
                            </div></div>
                        </div>
                        <div class="pf-tab-content" data-tab="synthesis">
                            <div class="pf-section"><h3>⚖️ 字重模拟</h3><div class="pf-card">
                                <label class="pf-option-card"><div class="pf-option-emoji">🎚️</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">启用字重模拟</span><input type="checkbox" id="pf-synthesisEnabled" ${SETTINGS.fontSynthesis?.enabled?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">当字体缺少某些字重（如 Semi-Bold、Light）时，使用 CSS 技术模拟。可能影响渲染质量，通常不需要开启。</span></div></label>
                            </div></div>
                            <div class="pf-section" id="pf-synthesisMethodSection"><h3>🔧 模拟方式</h3><div class="pf-card">
                                <div class="pf-select-wrapper"><span class="pf-select-icon">🛠️</span>
                                    <div class="pf-custom-select" data-select-id="pf-synthesisMethod">
                                        <div class="pf-select-trigger" tabindex="0">
                                            <span class="pf-select-value"><span class="pf-select-text">请选择</span></span>
                                            <span class="pf-select-arrow">▼</span>
                                        </div>
                                        <div class="pf-select-dropdown">
                                            <div class="pf-select-option" data-value="synthesis"><span class="pf-select-option-emoji">✨</span><span class="pf-select-option-text">font-synthesis（推荐）</span></div>
                                            <div class="pf-select-option" data-value="stroke"><span class="pf-select-option-emoji">✏️</span><span class="pf-select-option-text">描边加粗（仅 bold）</span></div>
                                            <div class="pf-select-option" data-value="compensate"><span class="pf-select-option-emoji">🖊️</span><span class="pf-select-option-text">全局描边补偿</span></div>
                                            <div class="pf-select-option" data-value="shadow"><span class="pf-select-option-emoji">🌑</span><span class="pf-select-option-text">阴影模拟（仅 bold）</span></div>
                                        </div>
                                        <select id="pf-synthesisMethod" class="pf-select-hidden">
                                            <option value="synthesis" ${(SETTINGS.fontSynthesis?.method||'synthesis')==='synthesis'?'selected':''}>✨ font-synthesis（推荐）</option>
                                            <option value="stroke" ${SETTINGS.fontSynthesis?.method==='stroke'?'selected':''}>✏️ 描边加粗（仅 bold）</option>
                                            <option value="compensate" ${SETTINGS.fontSynthesis?.method==='compensate'?'selected':''}>🖊️ 全局描边补偿</option>
                                            <option value="shadow" ${SETTINGS.fontSynthesis?.method==='shadow'?'selected':''}>🌑 阴影模拟（仅 bold）</option>
                                        </select>
                                    </div>
                                </div>
                            </div></div>
                            <div class="pf-section" id="pf-synthesisParamsSection"><h3>🎛️ 参数调整</h3><div class="pf-card">
                                <div class="pf-input-row" id="pf-paramCompensate"><span class="pf-input-icon">✏️</span><label>描边粗细：</label><input type="number" id="pf-compensateWeight" class="pf-input pf-number-input" min="0" max="1" step="0.01" value="${SETTINGS.fontSynthesis?.compensateWeight||0.15}"></div>
                                <div class="pf-input-row" id="pf-paramShadowX"><span class="pf-input-icon">↔️</span><label>阴影 X 偏移：</label><input type="number" id="pf-shadowOffsetX" class="pf-input pf-number-input" min="0" max="2" step="0.1" value="${SETTINGS.fontSynthesis?.shadowOffsetX||0.3}"></div>
                                <div class="pf-input-row" id="pf-paramShadowY"><span class="pf-input-icon">↕️</span><label>阴影 Y 偏移：</label><input type="number" id="pf-shadowOffsetY" class="pf-input pf-number-input" min="0" max="2" step="0.1" value="${SETTINGS.fontSynthesis?.shadowOffsetY||0.3}"></div>
                                <div class="pf-input-row" id="pf-paramShadowBlur"><span class="pf-input-icon">🌫️</span><label>阴影模糊：</label><input type="number" id="pf-shadowBlur" class="pf-input pf-number-input" min="0" max="5" step="0.1" value="${SETTINGS.fontSynthesis?.shadowBlur||0}"></div>
                                <p id="pf-paramHint" class="pf-hint-text">💡 font-synthesis 让浏览器自动合成缺失字重，兼容性最佳</p>
                            </div></div>
                        </div>
                        <div class="pf-tab-content" data-tab="exclusion">
                            <div class="pf-section"><h3>🌐 排除域名</h3><div class="pf-card"><div class="pf-textarea-wrapper"><span class="pf-textarea-icon">🚫</span><textarea id="pf-excludedDomains" class="pf-textarea pf-code" rows="4" placeholder="每行一个域名，支持 *.example.com">${SETTINGS.excludedDomains.join('\n')}</textarea></div>
                                <p class="pf-hint-text">🌐 在这些域名上脚本不会生效。每行一个域名。<br>✳️ 支持通配符：*.example.com 会匹配 sub.example.com、www.example.com 等所有子域名。</p>
                            </div></div>
                            <div class="pf-section"><h3>🎯 排除选择器/关键词</h3><div class="pf-card"><div class="pf-textarea-wrapper"><span class="pf-textarea-icon">🔍</span><textarea id="pf-excludedSelectors" class="pf-textarea pf-code" rows="8" placeholder='每行一个，支持两种格式'>${SETTINGS.excludedSelectors.join('\n')}</textarea></div>
                                <p class="pf-hint-text">🔍 匹配这些规则的元素不会被替换字体。支持两种格式：<br>📝 <b>CSS选择器</b>：.icon、[class*="fa-"]、#special-element<br>🔤 <b>简单关键词</b>：icon、fa-（自动匹配 class 包含该词的元素）</p>
                            </div></div>
                            <div class="pf-section"><h3>🏷️ 排除标签</h3><div class="pf-card"><div class="pf-textarea-wrapper"><span class="pf-textarea-icon">📌</span><textarea id="pf-excludedTags" class="pf-textarea pf-code" rows="3" placeholder="每行一个标签名">${SETTINGS.excludedTags.join('\n')}</textarea></div>
                                <p class="pf-hint-text">🏷️ 这些 HTML 标签内的内容不会被替换字体。默认已排除 script、style、svg 等标签。</p>
                            </div></div>
                            <div class="pf-section"><h3>⌨️ 输入框选择器</h3><div class="pf-card"><div class="pf-textarea-wrapper"><span class="pf-textarea-icon">✍️</span><textarea id="pf-inputSelectors" class="pf-textarea pf-code" rows="4" placeholder="每行一个选择器">${SETTINGS.inputSelectors.join('\n')}</textarea></div>
                                <p class="pf-hint-text">⌨️ 这些选择器匹配的元素会被识别为输入框，应用输入框相关的检测逻辑。<br>📝 默认已包含 contenteditable、textbox 等常见输入框类型。</p>
                            </div></div>
                        </div>
                        <div class="pf-tab-content" data-tab="advanced">
                            <div class="pf-section"><h3>📚 大字库回退</h3><div class="pf-card">
                                <label class="pf-option-card"><div class="pf-option-emoji">🔌</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">启用大字库回退</span><input type="checkbox" id="pf-extHanEnabled" ${SETTINGS.extendedHanFallback?.enabled!==false?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">为 CJK 扩展区的罕用汉字提供字体回退支持。需要在电脑上安装大字库字体才能生效。</span></div></label>
                                <p class="pf-hint-text">📚 <b>什么是大字库</b>：Unicode 收录了约 10 万个汉字，但常用字体只包含约 2～3 万字。大字库字体可显示罕用汉字。<br>🌐 <b>CDN 字体</b>：使用 SimSun 宋体（通过 CDN 在线加载，无需本地安装）。<br>🔤 <b>适用范围</b>：仅对 CJK 扩展区 B 及以后的罕用字生效。</p>
                            </div></div>
                            <div class="pf-section"><h3>🐛 调试选项</h3><div class="pf-card">
                                <label class="pf-option-card"><div class="pf-option-emoji">📋</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">调试模式</span><input type="checkbox" id="pf-debugMode" ${SETTINGS.debugMode?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">在浏览器控制台（F12）输出详细的运行日志，包括字体检测、语言判断等信息。用于排查问题。</span></div></label>
                                <label class="pf-option-card"><div class="pf-option-emoji">⚡</div><div class="pf-option-content"><div class="pf-option-header"><span class="pf-option-title">性能模式</span><input type="checkbox" id="pf-performanceMode" ${SETTINGS.performanceMode?'checked':''}><span class="pf-switch"></span></div><span class="pf-option-desc">减少 DOM 检测频率和批处理数量，降低 CPU 占用。适用于大型复杂网页或低性能设备。</span></div></label>
                            </div></div>
                            <div class="pf-section"><h3>💾 缓存设置</h3><div class="pf-card"><div class="pf-input-row"><span class="pf-input-icon">⏰</span><label>超时（ms）：</label><input type="number" id="pf-cacheTimeout" class="pf-input" value="${SETTINGS.cacheTimeout}" min="1000" max="300000"></div>
                                <p class="pf-hint-text">⏰ 语言检测结果的缓存时间（毫秒）。缓存可减少重复计算，但过长可能导致动态内容检测不及时。默认 30000ms（30 秒）。</p>
                            </div></div>
                            <div class="pf-section"><h3>📂 数据管理</h3><div class="pf-card pf-btn-row">
                                <button class="pf-btn" id="pf-export">📤 导出设置</button>
                                <button class="pf-btn" id="pf-import">📥 导入设置</button>
                                <button class="pf-btn pf-btn-danger" id="pf-reset">🔄 重置默认</button>
                                <input type="file" id="pf-import-file" accept=".json" style="display:none">
                            </div>
                                <p class="pf-hint-text">📤 <b>导出</b>：将当前设置保存为 JSON 文件，可用于备份或迁移到其他设备。<br>📥 <b>导入</b>：从 JSON 文件恢复设置。<br>🔄 <b>重置</b>：将所有设置恢复为默认值（需确认）。</p>
                            </div>
                            <div class="pf-section"><h3>ℹ️ 关于</h3><div class="pf-card pf-about-card">
                                <div class="pf-about-title">🔤 苹方字体统一替换脚本</div>
                                <div class="pf-about-version">✨ 版本 2.0 · Inter + 苹方 完整版</div>
                                <div class="pf-about-hint">⌨️ 快捷键：Ctrl+Shift+P 打开设置</div>
                            </div></div>
                        </div>
                    </div>
                </div>
                <div class="pf-footer"><span class="pf-version">✨ V2.0 · YouTube全覆盖</span><div class="pf-actions"><button id="pf-cancel" class="pf-btn">❌ 取消</button><button id="pf-save" class="pf-btn pf-btn-primary">💾 保存并刷新</button></div></div>
            </div>
        `;

        // ========== 性能优化：预加载样式 ==========
        const styleId = 'pf-settings-panel-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `#pf-settings-panel{--pf-bg:rgba(255,255,255,0.92);--pf-glass:rgba(255,255,255,0.75);--pf-text:#1d1d1f;--pf-text-sec:#6e6e73;--pf-accent:#007aff;--pf-border:rgba(0,0,0,0.12);--pf-hover:rgba(0,0,0,0.06);--pf-card-bg:rgba(255,255,255,0.8);--pf-shadow-text:0 1px 2px rgba(0,0,0,0.1);position:fixed;inset:0;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Noto Sans SC",system-ui,sans-serif !important;font-size:14px;line-height:1.5;color:var(--pf-text);opacity:0;visibility:hidden;transition:opacity 0.15s ease-out,visibility 0.15s ease-out}#pf-settings-panel.pf-visible{opacity:1;visibility:visible}#pf-settings-panel *{font-family:inherit !important}@media(prefers-color-scheme:dark){#pf-settings-panel{--pf-bg:rgba(28,28,30,0.95);--pf-glass:rgba(44,44,46,0.85);--pf-text:#f5f5f7;--pf-text-sec:#a1a1a6;--pf-border:rgba(255,255,255,0.15);--pf-hover:rgba(255,255,255,0.08);--pf-card-bg:rgba(60,60,67,0.6);--pf-shadow-text:0 1px 3px rgba(0,0,0,0.3)}}#pf-settings-panel *{box-sizing:border-box}.pf-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);opacity:0;transition:opacity 0.3s ease}.pf-visible .pf-overlay{opacity:1}.pf-panel{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.92);width:95%;max-width:900px;max-height:90vh;background:var(--pf-bg);backdrop-filter:blur(40px) saturate(180%);-webkit-backdrop-filter:blur(40px) saturate(180%);border-radius:20px;border:1px solid var(--pf-border);box-shadow:0 25px 80px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.1) inset;display:flex;flex-direction:column;overflow:hidden;opacity:0;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.25s ease}.pf-visible .pf-panel{transform:translate(-50%,-50%) scale(1);opacity:1}.pf-header{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:var(--pf-glass);border-bottom:1px solid var(--pf-border)}.pf-header-left{display:flex;align-items:center;gap:12px}.pf-logo{font-size:28px;animation:pf-float 3s ease-in-out infinite}.pf-title-group h2{margin:0;font-size:17px;font-weight:600;text-shadow:var(--pf-shadow-text)}.pf-subtitle{font-size:12px;color:var(--pf-text-sec);text-shadow:var(--pf-shadow-text)}.pf-close{width:32px;height:32px;border:none;background:var(--pf-hover);border-radius:50%;cursor:pointer;color:var(--pf-text-sec);font-size:20px;display:flex;align-items:center;justify-content:center;transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}.pf-close:hover{background:rgba(255,59,48,0.15);color:#ff3b30;transform:rotate(90deg)}.pf-mobile-tabs{display:none;overflow-x:auto;white-space:nowrap;background:var(--pf-glass);border-bottom:1px solid var(--pf-border);scrollbar-width:none}.pf-mobile-tabs::-webkit-scrollbar{display:none}.pf-mobile-tab{flex-shrink:0;padding:12px 16px;border:none;background:transparent;color:var(--pf-text-sec);font-size:13px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.25s ease;text-shadow:var(--pf-shadow-text)}.pf-mobile-tab:hover{color:var(--pf-text);background:var(--pf-hover)}.pf-mobile-tab.active{color:var(--pf-accent);border-bottom-color:var(--pf-accent)}.pf-body{display:flex;flex:1;overflow:hidden}.pf-sidebar{width:160px;background:var(--pf-glass);border-right:1px solid var(--pf-border);padding:12px 8px;display:flex;flex-direction:column;gap:4px}.pf-nav-item{display:flex;align-items:center;gap:8px;padding:10px 12px;border:none;background:none;border-radius:10px;cursor:pointer;color:var(--pf-text-sec);font-size:13px;text-align:left;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);text-shadow:var(--pf-shadow-text);position:relative;overflow:hidden}.pf-nav-item::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,var(--pf-accent),transparent);opacity:0;transition:opacity 0.3s ease}.pf-nav-item:hover{background:var(--pf-hover);color:var(--pf-text);transform:translateX(4px)}.pf-nav-item.active{background:rgba(0,122,255,0.18);color:var(--pf-accent);font-weight:500}.pf-nav-item.active::before{opacity:0.1}.pf-content{flex:1;overflow-y:auto;padding:20px 24px;scroll-behavior:smooth}.pf-tab-content{display:none;opacity:0;transform:translateY(10px);transition:opacity 0.3s ease,transform 0.3s ease}.pf-tab-content.active{display:block;opacity:1;transform:translateY(0);animation:pf-fadeSlideIn 0.35s ease forwards}.pf-section{margin-bottom:24px;opacity:0;animation:pf-sectionFadeIn 0.4s ease forwards;animation-delay:calc(var(--section-index, 0) * 0.05s)}.pf-section h3{margin:0 0 12px 0;font-size:14px;font-weight:600;color:var(--pf-text);letter-spacing:0.3px;text-shadow:var(--pf-shadow-text)}.pf-hint{margin:0 0 12px 0;font-size:12px;color:var(--pf-text-sec);line-height:1.6;text-shadow:var(--pf-shadow-text)}.pf-hint-text{font-size:11px;color:var(--pf-text-sec);margin:8px 0 0 0;padding:10px 14px;background:linear-gradient(135deg,var(--pf-hover),transparent);border-radius:10px;line-height:1.7;border:1px solid var(--pf-border);text-shadow:var(--pf-shadow-text)}.pf-card{background:var(--pf-glass);border:1px solid var(--pf-border);border-radius:14px;padding:6px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:all 0.3s ease}.pf-card:hover{box-shadow:0 6px 20px rgba(0,0,0,0.08);border-color:rgba(0,122,255,0.2)}

/* 新增：选项卡片样式 - 增强可读性 */
.pf-option-card{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:12px;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);background:var(--pf-card-bg);border:1px solid transparent;margin-bottom:6px;position:relative;overflow:hidden}.pf-option-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,122,255,0.05),transparent);opacity:0;transition:opacity 0.3s ease}.pf-option-card:last-child{margin-bottom:0}.pf-option-card:hover{background:var(--pf-hover);border-color:var(--pf-accent);transform:translateY(-2px) scale(1.01);box-shadow:0 8px 24px rgba(0,0,0,0.1)}.pf-option-card:hover::before{opacity:1}.pf-option-card:active{transform:translateY(0) scale(0.99)}.pf-option-emoji{font-size:24px;flex-shrink:0;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--pf-hover),var(--pf-glass));border-radius:12px;transition:transform 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.06)}.pf-option-card:hover .pf-option-emoji{transform:scale(1.1) rotate(-3deg)}.pf-option-content{flex:1;min-width:0}.pf-option-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px}.pf-option-title{font-weight:600;font-size:14px;color:var(--pf-text);text-shadow:var(--pf-shadow-text)}.pf-option-desc{display:block;font-size:12px;color:var(--pf-text-sec);line-height:1.5;text-shadow:var(--pf-shadow-text)}
.pf-option-card input{display:none}.pf-option-card .pf-switch{position:relative;width:51px;height:31px;background:var(--pf-border);border-radius:16px;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);flex-shrink:0;box-shadow:inset 0 2px 4px rgba(0,0,0,0.1)}.pf-option-card .pf-switch::after{content:'';position:absolute;top:2px;left:2px;width:27px;height:27px;background:linear-gradient(180deg,#fff,#f8f8f8);border-radius:50%;transition:transform 0.35s cubic-bezier(0.68,-0.55,0.265,1.55);box-shadow:0 3px 8px rgba(0,0,0,0.2)}.pf-option-card input:checked+.pf-switch{background:linear-gradient(135deg,#34c759,#30b350);box-shadow:0 0 12px rgba(52,199,89,0.4)}.pf-option-card input:checked+.pf-switch::after{transform:translateX(20px)}

/* 保留原有switch样式兼容 */
.pf-switch-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:10px;cursor:pointer;transition:all 0.25s ease}.pf-switch-row:hover{background:var(--pf-hover)}.pf-switch-row input{display:none}.pf-switch-info{flex:1;margin-right:12px}.pf-switch-title{display:block;font-weight:500;color:var(--pf-text);text-shadow:var(--pf-shadow-text)}.pf-switch-desc{display:block;font-size:12px;color:var(--pf-text-sec);margin-top:2px;text-shadow:var(--pf-shadow-text)}.pf-switch{position:relative;width:51px;height:31px;background:var(--pf-border);border-radius:16px;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);flex-shrink:0}.pf-switch::after{content:'';position:absolute;top:2px;left:2px;width:27px;height:27px;background:#fff;border-radius:50%;transition:transform 0.35s cubic-bezier(0.68,-0.55,0.265,1.55);box-shadow:0 2px 4px rgba(0,0,0,0.2)}.pf-switch-row input:checked+.pf-switch{background:#34c759}.pf-switch-row input:checked+.pf-switch::after{transform:translateX(20px)}

/* 带图标的选择器和输入框 */
.pf-select-wrapper{display:flex;align-items:center;gap:10px;padding:4px 8px}.pf-select-icon,.pf-input-icon,.pf-textarea-icon,.pf-slider-icon{font-size:18px;flex-shrink:0}.pf-textarea-wrapper{display:flex;gap:10px;padding:8px}.pf-textarea-wrapper .pf-textarea{flex:1}

.pf-select,.pf-input,.pf-textarea{width:100%;padding:10px 12px;border:1px solid var(--pf-border);border-radius:10px;font-size:14px;background:var(--pf-bg);color:var(--pf-text);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);text-shadow:var(--pf-shadow-text)}.pf-select:focus,.pf-input:focus,.pf-textarea:focus{outline:none;border-color:var(--pf-accent);box-shadow:0 0 0 4px rgba(0,122,255,0.15);transform:translateY(-1px)}#pf-settings-panel .pf-textarea{font-size:13px;resize:vertical;font-family:inherit !important}#pf-settings-panel .pf-textarea.pf-code,#pf-settings-panel .pf-input.pf-code{font-family:"Noto Sans Mono",ui-monospace,SFMono-Regular,Consolas,monospace !important;font-size:12px}.pf-slider-row{display:flex;align-items:center;gap:12px;padding:10px 14px}.pf-slider-row label{min-width:100px;font-size:13px;color:var(--pf-text);text-shadow:var(--pf-shadow-text)}.pf-slider-row input[type="range"]{flex:1;height:6px;-webkit-appearance:none;background:var(--pf-border);border-radius:3px}.pf-slider-row input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#fff;border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.2)}.pf-slider-value{min-width:40px;text-align:right;font-size:13px;color:var(--pf-accent);font-weight:600}.pf-input-row{display:flex;align-items:center;gap:12px;padding:10px 14px}.pf-input-row label{font-size:13px;white-space:nowrap;text-shadow:var(--pf-shadow-text)}.pf-input-row .pf-number-input{width:100px;flex:0 0 auto}.pf-btn-row{display:flex;flex-wrap:wrap;gap:8px;padding:14px}.pf-footer{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:var(--pf-glass);border-top:1px solid var(--pf-border)}.pf-version{font-size:12px;color:var(--pf-text-sec);text-shadow:var(--pf-shadow-text)}.pf-actions{display:flex;gap:10px}.pf-btn{padding:10px 18px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;border:1px solid var(--pf-border);background:var(--pf-bg);color:var(--pf-text);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden;text-shadow:var(--pf-shadow-text)}.pf-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.1),transparent);opacity:0;transition:opacity 0.3s ease}.pf-btn:hover{background:var(--pf-hover);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}.pf-btn:hover::before{opacity:1}.pf-btn:active{transform:translateY(0) scale(0.98)}.pf-btn-primary{background:linear-gradient(135deg,var(--pf-accent),#0051d5);color:#fff;border:none;box-shadow:0 4px 14px rgba(0,122,255,0.3)}.pf-btn-primary:hover{opacity:0.95;box-shadow:0 6px 20px rgba(0,122,255,0.4);transform:translateY(-2px)}.pf-btn-danger{color:#ff3b30;border-color:rgba(255,59,48,0.3)}.pf-btn-danger:hover{background:rgba(255,59,48,0.12);border-color:rgba(255,59,48,0.5)}.pf-btn-sm{padding:6px 12px;font-size:12px}

/* 关于卡片 */
.pf-about-card{padding:20px;text-align:center;background:linear-gradient(135deg,var(--pf-glass),var(--pf-hover))}.pf-about-title{font-size:16px;font-weight:600;margin-bottom:8px;text-shadow:var(--pf-shadow-text)}.pf-about-version{font-size:13px;color:var(--pf-accent);margin-bottom:10px;font-weight:500}.pf-about-hint{font-size:12px;color:var(--pf-text-sec);text-shadow:var(--pf-shadow-text)}

.pf-font-groups-toolbar{display:flex;gap:8px;margin-bottom:12px}.pf-font-groups-container{max-height:400px;overflow-y:auto;border:1px solid var(--pf-border);border-radius:14px;padding:8px}.pf-font-category{margin-bottom:12px}.pf-font-category:last-child{margin-bottom:0}.pf-font-category-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,var(--pf-glass),var(--pf-hover));border-radius:10px;margin-bottom:8px;box-shadow:0 2px 6px rgba(0,0,0,0.04)}.pf-font-category-name{font-weight:600;font-size:13px;text-shadow:var(--pf-shadow-text)}.pf-font-category-toggle{width:26px;height:26px;border:none;background:var(--pf-hover);border-radius:50%;cursor:pointer;color:var(--pf-text-sec);font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}.pf-font-category-toggle:hover{background:var(--pf-accent);color:#fff;transform:rotate(180deg)}.pf-font-category-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:6px;padding:0 4px}.pf-font-group-item{display:flex;align-items:center;gap:6px;padding:10px 12px;border-radius:10px;cursor:pointer;font-size:12px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);background:var(--pf-hover);border:1px solid transparent;text-shadow:var(--pf-shadow-text)}.pf-font-group-item:hover{background:var(--pf-border);border-color:var(--pf-accent);transform:translateX(4px)}.pf-font-group-item input{accent-color:var(--pf-accent);margin:0}.pf-font-group-emoji{font-size:14px}.pf-font-group-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pf-font-group-count{font-size:10px;color:var(--pf-text-sec);background:var(--pf-border);padding:2px 8px;border-radius:10px}

/* 大字库配置面板样式 */
.pf-exthan-list{border:1px solid var(--pf-border);border-radius:14px;padding:8px;max-height:350px;overflow-y:auto}.pf-exthan-item{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;background:var(--pf-hover);margin-bottom:6px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);border:1px solid transparent}.pf-exthan-item:last-child{margin-bottom:0}.pf-exthan-item:hover{background:var(--pf-border);border-color:var(--pf-accent);transform:translateX(4px)}.pf-exthan-item.dragging{opacity:0.5;background:var(--pf-accent);border-color:var(--pf-accent)}.pf-exthan-item.drag-over{border-color:var(--pf-accent);box-shadow:0 0 0 2px rgba(0,122,255,0.3)}.pf-exthan-drag{cursor:grab;color:var(--pf-text-sec);font-size:14px;user-select:none;padding:4px}.pf-exthan-drag:active{cursor:grabbing}.pf-exthan-arrows{display:flex;flex-direction:column;gap:2px}.pf-exthan-up,.pf-exthan-down{width:20px;height:16px;padding:0;border:1px solid var(--pf-border);border-radius:4px;background:var(--pf-bg);color:var(--pf-text-sec);font-size:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s}.pf-exthan-up:hover,.pf-exthan-down:hover{background:var(--pf-accent);color:#fff;border-color:var(--pf-accent)}.pf-exthan-up:disabled,.pf-exthan-down:disabled{opacity:0.3;cursor:not-allowed}.pf-exthan-label{display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;min-width:0}.pf-exthan-checkbox{accent-color:var(--pf-accent);width:16px;height:16px;margin:0;flex-shrink:0}.pf-exthan-emoji{font-size:16px;flex-shrink:0}.pf-exthan-name{font-weight:500;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:var(--pf-shadow-text)}.pf-exthan-mode{padding:4px 8px;border:1px solid var(--pf-border);border-radius:6px;background:var(--pf-bg);color:var(--pf-text);font-size:11px;cursor:pointer;flex-shrink:0}.pf-exthan-mode:focus{outline:none;border-color:var(--pf-accent)}.pf-exthan-mode option:disabled{color:var(--pf-text-sec)}.pf-exthan-config{padding:4px 8px;border:1px solid var(--pf-border);border-radius:6px;background:var(--pf-bg);color:var(--pf-text);font-size:12px;cursor:pointer;flex-shrink:0;transition:all 0.2s}.pf-exthan-config:hover{background:var(--pf-accent);color:#fff;border-color:var(--pf-accent)}.pf-exthan-info{display:flex;flex-direction:column;gap:8px;padding:12px}.pf-exthan-info-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--pf-hover);border-radius:10px}.pf-exthan-info-icon{font-size:20px;flex-shrink:0}.pf-exthan-info-item b{display:block;margin-bottom:2px;font-size:13px;text-shadow:var(--pf-shadow-text)}.pf-exthan-info-item small{font-size:11px;color:var(--pf-text-sec);line-height:1.5;text-shadow:var(--pf-shadow-text)}
/* 大字库详细配置弹窗 */
.pf-exthan-modal{position:fixed;inset:0;z-index:2147483648;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.25s ease}.pf-exthan-modal.pf-visible{opacity:1}.pf-exthan-modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px)}.pf-exthan-modal-content{position:relative;width:90%;max-width:500px;max-height:80vh;background:var(--pf-bg);border-radius:16px;border:1px solid var(--pf-border);box-shadow:0 20px 60px rgba(0,0,0,0.35);overflow:hidden;display:flex;flex-direction:column;transform:scale(0.9);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1)}.pf-exthan-modal.pf-visible .pf-exthan-modal-content{transform:scale(1)}.pf-exthan-modal-header{padding:16px 20px;background:var(--pf-glass);border-bottom:1px solid var(--pf-border);display:flex;align-items:center;justify-content:space-between}.pf-exthan-modal-header h3{margin:0;font-size:16px;text-shadow:var(--pf-shadow-text)}.pf-exthan-modal-close{width:28px;height:28px;border:none;background:var(--pf-hover);border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;color:var(--pf-text-sec);transition:all 0.25s ease}.pf-exthan-modal-close:hover{background:rgba(255,59,48,0.15);color:#ff3b30;transform:rotate(90deg)}.pf-exthan-modal-body{padding:20px;overflow-y:auto;flex:1}.pf-exthan-modal-section{margin-bottom:16px}.pf-exthan-modal-section:last-child{margin-bottom:0}.pf-exthan-modal-section label{display:block;font-weight:500;margin-bottom:6px;font-size:13px;text-shadow:var(--pf-shadow-text)}.pf-exthan-modal-section input,.pf-exthan-modal-section textarea{width:100%;padding:10px 12px;border:1px solid var(--pf-border);border-radius:8px;background:var(--pf-bg);color:var(--pf-text);font-size:13px;font-family:inherit}#pf-settings-panel .pf-exthan-modal-section textarea{min-height:80px;resize:vertical}#pf-settings-panel .pf-exthan-modal-section textarea.pf-code{font-family:"Noto Sans Mono",ui-monospace,monospace !important;font-size:12px}.pf-exthan-modal-section input:focus,.pf-exthan-modal-section textarea:focus{outline:none;border-color:var(--pf-accent);box-shadow:0 0 0 3px rgba(0,122,255,0.15)}.pf-exthan-modal-section small{display:block;margin-top:4px;font-size:11px;color:var(--pf-text-sec);text-shadow:var(--pf-shadow-text)}.pf-exthan-modal-footer{padding:16px 20px;background:var(--pf-glass);border-top:1px solid var(--pf-border);display:flex;justify-content:flex-end;gap:10px}

@media(max-width:768px){.pf-panel{width:100%;height:100%;max-height:100vh;border-radius:0;top:0;left:0;transform:none}.pf-body{flex-direction:column !important}.pf-mobile-tabs{display:flex !important;flex-shrink:0}.pf-sidebar{display:none !important;width:0 !important}.pf-content{padding:16px;flex:1;width:100% !important}.pf-font-category-items{grid-template-columns:repeat(2,1fr)}.pf-header,.pf-footer{padding:12px 16px}.pf-option-card{padding:12px}.pf-custom-select{max-width:100%}.pf-select-dropdown{max-height:50vh}}

/* ===== 自定义下拉选择器样式 ===== */
.pf-custom-select{position:relative;width:100%;z-index:1}
.pf-custom-select.pf-select-open{z-index:9999}
.pf-section.pf-section-dropdown-open{z-index:9999;position:relative}
.pf-card.pf-card-dropdown-open{overflow:visible;z-index:9999;position:relative}
.pf-disabled{opacity:0.5 !important;pointer-events:none !important}
.pf-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border:1px solid var(--pf-border);border-radius:10px;background:var(--pf-bg);color:var(--pf-text);font-size:14px;cursor:pointer;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);user-select:none}
.pf-select-trigger:hover{border-color:var(--pf-accent);background:var(--pf-hover)}
.pf-select-trigger.active{border-color:var(--pf-accent);box-shadow:0 0 0 3px rgba(0,122,255,0.15);border-radius:10px 10px 0 0}
.pf-select-value{display:flex;align-items:center;gap:8px;flex:1;overflow:hidden}
.pf-select-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pf-select-arrow{width:20px;height:20px;display:flex;align-items:center;justify-content:center;color:var(--pf-text-sec);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1)}
.pf-select-trigger.active .pf-select-arrow{transform:rotate(180deg);color:var(--pf-accent)}
.pf-select-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:-1px;background:var(--pf-bg);border:1px solid var(--pf-accent);border-top:none;border-radius:0 0 10px 10px;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:9999;max-height:240px;overflow-y:auto;overflow-x:hidden;opacity:0;visibility:hidden;transform:translateY(-8px);transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.pf-select-dropdown.show{opacity:1;visibility:visible;transform:translateY(0)}
.pf-select-option{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:all 0.15s ease;border-left:3px solid transparent}
.pf-select-option:hover{background:var(--pf-hover);border-left-color:var(--pf-accent)}
.pf-select-option.selected{background:rgba(0,122,255,0.1);border-left-color:var(--pf-accent);color:var(--pf-accent);font-weight:500}
.pf-select-option:last-child{border-radius:0 0 8px 8px}
.pf-select-option-emoji{font-size:16px;flex-shrink:0}
.pf-select-option-text{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* 隐藏原生select */
.pf-custom-select select.pf-select-hidden{position:absolute;opacity:0;pointer-events:none;width:0;height:0}

/* ===== 增强动画效果 ===== */
@keyframes pf-fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pf-slideUp{from{opacity:0;transform:translate(-50%,-48%)}to{opacity:1;transform:translate(-50%,-50%)}}
@keyframes pf-scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
@keyframes pf-fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pf-sectionFadeIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes pf-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes pf-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes pf-ripple{0%{transform:scale(0);opacity:0.5}100%{transform:scale(2.5);opacity:0}}
@keyframes pf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes pf-glow{0%,100%{box-shadow:0 0 5px rgba(0,122,255,0.3)}50%{box-shadow:0 0 15px rgba(0,122,255,0.5)}}
@keyframes pf-slideInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pf-bounceIn{0%{opacity:0;transform:scale(0.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(0.9)}100%{transform:scale(1)}}

/* 加载骨架屏效果 */
@keyframes pf-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.pf-skeleton{background:linear-gradient(90deg,var(--pf-hover) 25%,var(--pf-border) 50%,var(--pf-hover) 75%);background-size:200% 100%;animation:pf-shimmer 1.5s infinite}

/* 微交互动画 */
.pf-card{transition:transform 0.3s cubic-bezier(0.4,0,0.2,1),box-shadow 0.3s ease,border-color 0.3s ease}
.pf-btn{position:relative;overflow:hidden;transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.pf-btn:active{transform:scale(0.96)}
.pf-btn-primary{animation:pf-glow 2s ease-in-out infinite}
.pf-btn-primary:hover{animation:none}
.pf-nav-item{transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.pf-nav-item:active{transform:scale(0.97) translateX(2px)}
.pf-mobile-tab{transition:all 0.25s ease}
.pf-slider-row input[type="range"]::-webkit-slider-thumb{transition:transform 0.2s cubic-bezier(0.4,0,0.2,1),box-shadow 0.2s ease}
.pf-slider-row input[type="range"]::-webkit-slider-thumb:hover{transform:scale(1.15);box-shadow:0 3px 10px rgba(0,0,0,0.3)}
.pf-slider-row input[type="range"]:active::-webkit-slider-thumb{transform:scale(0.95)}
.pf-font-group-item{transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.pf-font-group-item:active{transform:scale(0.97) translateX(2px)}

/* 涟漪效果 */
.pf-ripple-effect{position:absolute;border-radius:50%;background:rgba(255,255,255,0.5);pointer-events:none;animation:pf-ripple 0.6s ease-out forwards}

/* 高对比度模式支持 */
@media(prefers-contrast:high){#pf-settings-panel{--pf-text:#000;--pf-text-sec:#333;--pf-border:rgba(0,0,0,0.3);--pf-shadow-text:none}@media(prefers-color-scheme:dark){#pf-settings-panel{--pf-text:#fff;--pf-text-sec:#ccc;--pf-border:rgba(255,255,255,0.4)}}}

/* 减少动画模式支持 */
@media(prefers-reduced-motion:reduce){#pf-settings-panel,#pf-settings-panel *{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important}}`;
            document.head.appendChild(style);
        }

        // ========== 性能优化：延迟添加DOM并使用动画显示 ==========
        document.body.appendChild(panel);

        // 使用requestAnimationFrame优化渲染
        requestAnimationFrame(() => {
            // 添加可见性类触发动画
            panel.classList.add('pf-visible');

            // 延迟绑定事件，避免阻塞渲染
            requestAnimationFrame(() => {
                bindPanelEvents(panel);

                // 为section添加动画延迟索引
                panel.querySelectorAll('.pf-section').forEach((section, index) => {
                    section.style.setProperty('--section-index', index);
                });
            });
        });
    }

    function bindPanelEvents(panel) {
        // ========== 自定义下拉选择器初始化 ==========
        function initCustomSelects() {
            panel.querySelectorAll('.pf-custom-select').forEach(container => {
                const trigger = container.querySelector('.pf-select-trigger');
                const dropdown = container.querySelector('.pf-select-dropdown');
                const hiddenSelect = container.querySelector('select');
                const valueDisplay = container.querySelector('.pf-select-text');
                const options = container.querySelectorAll('.pf-select-option');

                // 设置初始值
                const currentValue = hiddenSelect.value;
                options.forEach(opt => {
                    if (opt.dataset.value === currentValue) {
                        opt.classList.add('selected');
                        const emoji = opt.querySelector('.pf-select-option-emoji')?.textContent || '';
                        const text = opt.querySelector('.pf-select-option-text')?.textContent || '';
                        valueDisplay.textContent = emoji + ' ' + text;
                    }
                });

                // 点击触发器
                trigger.onclick = (e) => {
                    e.stopPropagation();
                    const isOpen = trigger.classList.contains('active');

                    // 关闭其他所有下拉框
                    panel.querySelectorAll('.pf-select-trigger.active').forEach(t => {
                        if (t !== trigger) {
                            t.classList.remove('active');
                            const otherContainer = t.closest('.pf-custom-select');
                            otherContainer.classList.remove('pf-select-open');
                            otherContainer.querySelector('.pf-select-dropdown').classList.remove('show');
                            // 移除父级的z-index提升
                            const otherSection = otherContainer.closest('.pf-section');
                            if (otherSection) otherSection.classList.remove('pf-section-dropdown-open');
                            const otherCard = otherContainer.closest('.pf-card');
                            if (otherCard) otherCard.classList.remove('pf-card-dropdown-open');
                        }
                    });

                    if (isOpen) {
                        trigger.classList.remove('active');
                        dropdown.classList.remove('show');
                        container.classList.remove('pf-select-open');
                        // 移除父级的z-index提升
                        const section = container.closest('.pf-section');
                        if (section) section.classList.remove('pf-section-dropdown-open');
                        const card = container.closest('.pf-card');
                        if (card) card.classList.remove('pf-card-dropdown-open');
                    } else {
                        trigger.classList.add('active');
                        dropdown.classList.add('show');
                        container.classList.add('pf-select-open');
                        // 给父级添加z-index提升
                        const section = container.closest('.pf-section');
                        if (section) section.classList.add('pf-section-dropdown-open');
                        const card = container.closest('.pf-card');
                        if (card) card.classList.add('pf-card-dropdown-open');
                    }
                };

                // 键盘支持
                trigger.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        trigger.click();
                    } else if (e.key === 'Escape') {
                        trigger.classList.remove('active');
                        dropdown.classList.remove('show');
                        container.classList.remove('pf-select-open');
                        const section = container.closest('.pf-section');
                        if (section) section.classList.remove('pf-section-dropdown-open');
                        const card = container.closest('.pf-card');
                        if (card) card.classList.remove('pf-card-dropdown-open');
                    }
                };

                // 选项点击
                options.forEach(opt => {
                    opt.onclick = (e) => {
                        e.stopPropagation();
                        const value = opt.dataset.value;

                        // 更新选中状态
                        options.forEach(o => o.classList.remove('selected'));
                        opt.classList.add('selected');

                        // 更新显示文本
                        const emoji = opt.querySelector('.pf-select-option-emoji')?.textContent || '';
                        const text = opt.querySelector('.pf-select-option-text')?.textContent || '';
                        valueDisplay.textContent = emoji + ' ' + text;

                        // 更新隐藏的select
                        hiddenSelect.value = value;
                        hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));

                        // 关闭下拉框
                        trigger.classList.remove('active');
                        dropdown.classList.remove('show');
                        container.classList.remove('pf-select-open');
                        const section = container.closest('.pf-section');
                        if (section) section.classList.remove('pf-section-dropdown-open');
                        const card = container.closest('.pf-card');
                        if (card) card.classList.remove('pf-card-dropdown-open');
                    };

                    // 悬停高亮效果
                    opt.onmouseenter = () => {
                        opt.style.transform = 'translateX(4px)';
                    };
                    opt.onmouseleave = () => {
                        opt.style.transform = '';
                    };
                });
            });

            // 点击外部关闭下拉框
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.pf-custom-select')) {
                    panel.querySelectorAll('.pf-select-trigger.active').forEach(t => {
                        t.classList.remove('active');
                        const selectContainer = t.closest('.pf-custom-select');
                        selectContainer.classList.remove('pf-select-open');
                        selectContainer.querySelector('.pf-select-dropdown').classList.remove('show');
                        const section = selectContainer.closest('.pf-section');
                        if (section) section.classList.remove('pf-section-dropdown-open');
                        const card = selectContainer.closest('.pf-card');
                        if (card) card.classList.remove('pf-card-dropdown-open');
                    });
                }
            });
        }

        // 初始化自定义下拉选择器
        initCustomSelects();

        // ========== 涟漪效果函数 ==========
        function createRipple(e, element) {
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.classList.add('pf-ripple-effect');
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
            element.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        }

        // 为按钮添加涟漪效果
        panel.querySelectorAll('.pf-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                createRipple(e, this);
            });
        });

        // ========== 关闭面板函数（带动画） ==========
        const closePanel = () => {
            panel.classList.remove('pf-visible');
            setTimeout(() => panel.remove(), 300); // 等待动画完成后移除
        };

        panel.querySelector('.pf-close').onclick = closePanel;
        panel.querySelector('.pf-overlay').onclick = closePanel;
        panel.querySelector('#pf-cancel').onclick = closePanel;

        // 支持 ESC 键关闭面板
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closePanel();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        const switchTab = (tabName) => {
            panel.querySelectorAll('.pf-nav-item, .pf-mobile-tab').forEach(t => t.classList.remove('active'));
            panel.querySelectorAll('.pf-tab-content').forEach(c => c.classList.remove('active'));
            panel.querySelectorAll(`[data-tab="${tabName}"]`).forEach(t => t.classList.add('active'));
        };
        panel.querySelectorAll('.pf-nav-item, .pf-mobile-tab').forEach(tab => { tab.onclick = () => switchTab(tab.dataset.tab); });

        // ========== 数值输入验证逻辑 ==========
        const numberInputs = panel.querySelectorAll('.pf-number-input');
        const saveBtn = panel.querySelector('#pf-save');

        function validateAllNumbers() {
            let allValid = true;
            numberInputs.forEach(input => {
                // 检查输入框是否可见（父级row未隐藏且section未被禁用）
                const row = input.closest('.pf-input-row');
                const section = input.closest('.pf-section');
                const isVisible = row && row.style.display !== 'none' &&
                                  section && !section.classList.contains('pf-disabled');

                const value = parseFloat(input.value);
                const min = parseFloat(input.min) || 0;
                const isInvalid = isVisible && (isNaN(value) || value < min);

                // 查找或创建错误提示
                let errorHint = input.parentElement.querySelector('.pf-number-error');
                if (isInvalid) {
                    allValid = false;
                    input.style.borderColor = '#ff3b30';
                    if (!errorHint) {
                        errorHint = document.createElement('span');
                        errorHint.className = 'pf-number-error';
                        errorHint.style.cssText = 'color:#ff3b30;font-size:11px;margin-left:8px;';
                        errorHint.textContent = '⚠️ 无效';
                        input.parentElement.appendChild(errorHint);
                    }
                } else {
                    input.style.borderColor = '';
                    if (errorHint) errorHint.remove();
                }
            });

            // 同时检查权重保护倍数（只在自定义模式且输入框可见时）
            const weightProtectionMode = panel.querySelector('#pf-weightProtectionMode');
            const weightProtectionRatioInput = panel.querySelector('#pf-weightProtectionRatio');
            const weightProtectionRatioRow = panel.querySelector('#pf-weightProtectionRatioRow');
            if (weightProtectionMode?.value === 'custom' &&
                weightProtectionRatioInput &&
                weightProtectionRatioRow?.style.display !== 'none') {
                const value = parseFloat(weightProtectionRatioInput.value);
                if (isNaN(value) || value <= 0) {
                    allValid = false;
                }
            }

            if (saveBtn) {
                saveBtn.disabled = !allValid;
                saveBtn.style.opacity = allValid ? '' : '0.5';
                saveBtn.style.cursor = allValid ? '' : 'not-allowed';
            }

            // 显示或隐藏全局错误提示
            let globalError = panel.querySelector('#pf-global-number-error');
            if (!allValid) {
                if (!globalError) {
                    globalError = document.createElement('div');
                    globalError.id = 'pf-global-number-error';
                    globalError.className = 'pf-hint-text';
                    globalError.style.cssText = 'background:rgba(255,59,48,0.15);border-color:rgba(255,59,48,0.3);margin:12px 24px;';
                    globalError.innerHTML = '⚠️ <b>输入数值无效</b>：请输入大于 0 的数字。';
                    const footer = panel.querySelector('.pf-footer');
                    if (footer) footer.parentElement.insertBefore(globalError, footer);
                }
            } else {
                if (globalError) globalError.remove();
            }

            return allValid;
        }

        numberInputs.forEach(input => {
            input.addEventListener('input', validateAllNumbers);
            input.addEventListener('change', validateAllNumbers);
        });

        // 初始化验证
        validateAllNumbers();

        // ========== 总开关联动禁用逻辑 ==========
        const mainSwitch = panel.querySelector('#pf-enabled');
        const contentArea = panel.querySelector('.pf-content');
        const sidebarArea = panel.querySelector('.pf-sidebar');

        function updateDisabledState() {
            const isEnabled = mainSwitch.checked;
            const allTabs = contentArea.querySelectorAll('.pf-tab-content:not([data-tab="basic"])');
            const navItems = sidebarArea.querySelectorAll('.pf-nav-item:not([data-tab="basic"])');
            const basicTabInputs = contentArea.querySelectorAll('.pf-tab-content[data-tab="basic"] input:not(#pf-enabled), .pf-tab-content[data-tab="basic"] select');

            allTabs.forEach(tab => { tab.style.cssText = isEnabled ? '' : 'opacity:0.4;pointer-events:none'; });
            navItems.forEach(nav => { nav.style.cssText = isEnabled ? '' : 'opacity:0.4;pointer-events:none'; });
            basicTabInputs.forEach(input => { input.disabled = !isEnabled; });
        }

        if (mainSwitch) {
            mainSwitch.onchange = updateDisabledState;
            updateDisabledState();
        }

        // 字体组快捷按钮
        const fontSelectAll = panel.querySelector('#pf-font-select-all');
        const fontSelectNone = panel.querySelector('#pf-font-select-none');
        const fontSelectCommon = panel.querySelector('#pf-font-select-common');

        if (fontSelectAll) {
            fontSelectAll.onclick = () => {
                panel.querySelectorAll('.pf-font-group-item input').forEach(cb => cb.checked = true);
            };
        }
        if (fontSelectNone) {
            fontSelectNone.onclick = () => {
                panel.querySelectorAll('.pf-font-group-item input').forEach(cb => cb.checked = false);
            };
        }
        if (fontSelectCommon) {
            fontSelectCommon.onclick = () => {
                // 常用：emoji, basic, cjk, symbols
                const commonGroups = ['g0', 'g1', 'g2', 'g17'];
                panel.querySelectorAll('.pf-font-group-item input').forEach(cb => {
                    cb.checked = commonGroups.includes(cb.dataset.group);
                });
            };
        }

        // 分类全选/取消
        panel.querySelectorAll('.pf-font-category-toggle').forEach(btn => {
            btn.onclick = () => {
                const category = btn.dataset.category;
                const container = btn.closest('.pf-font-category');
                const checkboxes = container.querySelectorAll('input[type="checkbox"]');
                const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                checkboxes.forEach(cb => cb.checked = !allChecked);
            };
        });

        // 字重模拟开关和方式切换
        const synthesisEnabled = panel.querySelector('#pf-synthesisEnabled');
        const synthesisMethod = panel.querySelector('#pf-synthesisMethod');
        const methodSection = panel.querySelector('#pf-synthesisMethodSection');
        const paramsSection = panel.querySelector('#pf-synthesisParamsSection');
        const paramCompensate = panel.querySelector('#pf-paramCompensate');
        const paramShadowX = panel.querySelector('#pf-paramShadowX');
        const paramShadowY = panel.querySelector('#pf-paramShadowY');
        const paramShadowBlur = panel.querySelector('#pf-paramShadowBlur');
        const paramHint = panel.querySelector('#pf-paramHint');
        const synthesisTabContent = panel.querySelector('.pf-tab-content[data-tab="synthesis"]');

        function updateSynthesisUI() {
            const enabled = synthesisEnabled?.checked;
            const method = synthesisMethod?.value || 'synthesis';

            // 使用CSS类来控制禁用状态（避免被动画覆盖）
            if (methodSection) {
                methodSection.classList.toggle('pf-disabled', !enabled);
            }
            if (paramsSection) {
                paramsSection.classList.toggle('pf-disabled', !enabled);
            }

            // 显示或隐藏禁用提示
            let synthesisHint = panel.querySelector('#pf-synthesis-disabled-hint');
            if (!enabled) {
                if (!synthesisHint && synthesisTabContent) {
                    synthesisHint = document.createElement('div');
                    synthesisHint.id = 'pf-synthesis-disabled-hint';
                    synthesisHint.className = 'pf-hint-text';
                    synthesisHint.style.cssText = 'background:rgba(255,149,0,0.15);border-color:rgba(255,149,0,0.3);margin-bottom:16px;';
                    synthesisHint.innerHTML = '⚠️ <b>字重模拟已关闭</b>：下方的模拟方式和参数调整选项已被禁用。开启「启用字重模拟」后可配置这些选项。';
                    const firstSection = synthesisTabContent.querySelector('.pf-section');
                    if (firstSection && firstSection.nextElementSibling) {
                        synthesisTabContent.insertBefore(synthesisHint, firstSection.nextElementSibling);
                    }
                }
            } else {
                if (synthesisHint) synthesisHint.remove();
            }

            // 根据方法显示对应参数
            if (enabled) {
                if (paramCompensate) paramCompensate.style.display = ['stroke', 'compensate'].includes(method) ? '' : 'none';
                if (paramShadowX) paramShadowX.style.display = method === 'shadow' ? '' : 'none';
                if (paramShadowY) paramShadowY.style.display = method === 'shadow' ? '' : 'none';
                if (paramShadowBlur) paramShadowBlur.style.display = method === 'shadow' ? '' : 'none';
                if (paramHint) paramHint.style.display = method === 'synthesis' ? '' : 'none';
            }

            // 切换模式后重新验证数值
            validateAllNumbers();
        }

        if (synthesisEnabled) {
            synthesisEnabled.onchange = updateSynthesisUI;
        }
        if (synthesisMethod) {
            synthesisMethod.onchange = updateSynthesisUI;
        }
        // 初始化时设置状态
        updateSynthesisUI();

        // ★★★ 强制CJK语言联动禁用逻辑 ★★★
        const forceDefaultCJKSwitch = panel.querySelector('#pf-forceDefaultCJK');
        const fineDetectionSwitch = panel.querySelector('#pf-enableFineDetection');
        const contentDetectionSwitch = panel.querySelector('#pf-enableContentDetection');
        const thresholdSection = panel.querySelector('#pf-thresholdSection');
        const fineDetectionCard = fineDetectionSwitch?.closest('.pf-option-card');
        const contentDetectionCard = contentDetectionSwitch?.closest('.pf-option-card');
        // 获取语言检测标签页中除强制CJK之外的所有内容
        const languageTabContent = panel.querySelector('.pf-tab-content[data-tab="language"]');

        // 更新强制CJK模式下的UI状态
        function updateForceDefaultCJKUI() {
            const isForced = forceDefaultCJKSwitch?.checked;

            // 禁用精细检测和内容检测选项（使用CSS类）
            if (fineDetectionCard) {
                fineDetectionCard.classList.toggle('pf-disabled', isForced);
            }
            if (contentDetectionCard) {
                contentDetectionCard.classList.toggle('pf-disabled', isForced);
            }
            if (thresholdSection) {
                // 如果强制CJK开启，或者内容检测关闭，都禁用阈值设置
                const shouldDisable = isForced || !contentDetectionSwitch?.checked;
                thresholdSection.classList.toggle('pf-disabled', shouldDisable);
            }

            // 在语言检测标签页显示提示信息
            let forceHint = panel.querySelector('#pf-force-cjk-hint');
            if (isForced) {
                if (!forceHint && languageTabContent) {
                    forceHint = document.createElement('div');
                    forceHint.id = 'pf-force-cjk-hint';
                    forceHint.className = 'pf-hint-text';
                    forceHint.style.cssText = 'background:rgba(255,149,0,0.15);border-color:rgba(255,149,0,0.3);margin-bottom:16px;';
                    forceHint.innerHTML = '⚠️ <b>强制模式已启用</b>：下方的语言检测选项已被禁用，所有 CJK 内容将统一使用「基础设置」中配置的默认语言。';
                    const firstSection = languageTabContent.querySelector('.pf-section');
                    if (firstSection) {
                        languageTabContent.insertBefore(forceHint, firstSection);
                    }
                }
            } else {
                if (forceHint) forceHint.remove();
            }
        }

        // 阈值设置跟随内容检测的开关状态
        function updateContentDetectionUI() {
            const isForced = forceDefaultCJKSwitch?.checked;
            const enabled = contentDetectionSwitch?.checked;
            if (thresholdSection) {
                const shouldDisable = isForced || !enabled;
                thresholdSection.classList.toggle('pf-disabled', shouldDisable);
            }
            // 重新验证数值
            validateAllNumbers();
        }

        if (forceDefaultCJKSwitch) {
            forceDefaultCJKSwitch.onchange = () => {
                updateForceDefaultCJKUI();
                updateContentDetectionUI();
            };
            updateForceDefaultCJKUI(); // 初始化状态
        }

        if (contentDetectionSwitch) {
            contentDetectionSwitch.onchange = updateContentDetectionUI;
            updateContentDetectionUI(); // 初始化状态
        }

        // ★★★ Emoji字体开关联动禁用逻辑 ★★★
        const enableEmojiFontSwitch = panel.querySelector('#pf-enableEmojiFont');
        const emojiStackSection = panel.querySelector('#pf-emojiStackSection');
        const emojiTabContent = panel.querySelector('.pf-tab-content[data-tab="emoji"]');

        function updateEmojiFontUI() {
            const enabled = enableEmojiFontSwitch?.checked;
            if (emojiStackSection) {
                emojiStackSection.classList.toggle('pf-disabled', !enabled);
            }

            // 显示或隐藏禁用提示
            let emojiHint = panel.querySelector('#pf-emoji-disabled-hint');
            if (!enabled) {
                if (!emojiHint && emojiTabContent) {
                    emojiHint = document.createElement('div');
                    emojiHint.id = 'pf-emoji-disabled-hint';
                    emojiHint.className = 'pf-hint-text';
                    emojiHint.style.cssText = 'background:rgba(255,149,0,0.15);border-color:rgba(255,149,0,0.3);margin-bottom:16px;';
                    emojiHint.innerHTML = '⚠️ <b>Emoji 字体已关闭</b>：下方的字体栈优先级选项已被禁用。开启「启用 Emoji 字体」后可配置该选项。';
                    const firstSection = emojiTabContent.querySelector('.pf-section');
                    if (firstSection && firstSection.nextElementSibling) {
                        emojiTabContent.insertBefore(emojiHint, firstSection.nextElementSibling);
                    }
                }
            } else {
                if (emojiHint) emojiHint.remove();
            }
        }

        if (enableEmojiFontSwitch) {
            enableEmojiFontSwitch.onchange = updateEmojiFontUI;
            updateEmojiFontUI(); // 初始化状态
        }

        // ★★★ 输入框检测模式联动禁用逻辑 ★★★
        const inputLangModeSelect = panel.querySelector('#pf-inputLangMode');
        const wpApplyToInputRow = panel.querySelector('#pf-wpApplyToInputRow');

        function updateInputLangModeUI() {
            const isDynamic = inputLangModeSelect?.value === 'dynamic';

            // 禁用「应用到输入框」选项
            if (wpApplyToInputRow) {
                wpApplyToInputRow.classList.toggle('pf-disabled', !isDynamic);
            }

            // 显示或隐藏禁用提示（在权重保护区域）
            let inputModeHint = panel.querySelector('#pf-input-mode-hint');
            if (!isDynamic) {
                if (!inputModeHint) {
                    inputModeHint = document.createElement('div');
                    inputModeHint.id = 'pf-input-mode-hint';
                    inputModeHint.className = 'pf-hint-text';
                    inputModeHint.style.cssText = 'background:rgba(255,149,0,0.15);border-color:rgba(255,149,0,0.3);margin-top:8px;';
                    inputModeHint.innerHTML = '⚠️ <b>输入框非动态检测模式</b>：「应用到输入框」选项已被禁用。只有当「输入框检测模式」设为「动态检测」时，权重保护才能应用到输入框。';
                    // 插入到wpApplyToInputRow后面
                    if (wpApplyToInputRow && wpApplyToInputRow.parentNode) {
                        wpApplyToInputRow.parentNode.insertBefore(inputModeHint, wpApplyToInputRow.nextSibling);
                    }
                }
            } else {
                if (inputModeHint) inputModeHint.remove();
            }
        }

        if (inputLangModeSelect) {
            inputLangModeSelect.onchange = updateInputLangModeUI;
            updateInputLangModeUI(); // 初始化状态
        }

        // 权重保护模式切换
        const weightProtectionMode = panel.querySelector('#pf-weightProtectionMode');
        const weightProtectionRatioRow = panel.querySelector('#pf-weightProtectionRatioRow');
        const weightProtectionRatioInput = panel.querySelector('#pf-weightProtectionRatio');
        const weightProtectionError = panel.querySelector('#pf-weightProtectionError');

        // 验证权重保护倍数
        const validateWeightProtectionRatio = () => {
            const value = parseFloat(weightProtectionRatioInput?.value);
            const isCustomMode = weightProtectionMode?.value === 'custom';
            const isInvalid = isCustomMode && (isNaN(value) || value <= 0);

            if (weightProtectionError) {
                weightProtectionError.style.display = isInvalid ? '' : 'none';
            }
            if (weightProtectionRatioInput) {
                weightProtectionRatioInput.style.borderColor = isInvalid ? '#ff3b30' : '';
            }

            // 调用全局验证函数更新保存按钮状态
            validateAllNumbers();

            return !isInvalid;
        };

        if (weightProtectionMode && weightProtectionRatioRow) {
            weightProtectionMode.onchange = () => {
                weightProtectionRatioRow.style.display = weightProtectionMode.value === 'custom' ? '' : 'none';
                validateWeightProtectionRatio();
            };
        }

        if (weightProtectionRatioInput) {
            weightProtectionRatioInput.oninput = validateWeightProtectionRatio;
            weightProtectionRatioInput.onchange = validateWeightProtectionRatio;
            // 初始化验证
            validateWeightProtectionRatio();
        }

        panel.querySelector('#pf-export').onclick = () => {
            const blob = new Blob([JSON.stringify(SETTINGS, null, 2)], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'noto-font-settings.json'; a.click();
        };

        panel.querySelector('#pf-import').onclick = () => panel.querySelector('#pf-import-file').click();
        panel.querySelector('#pf-import-file').onchange = (e) => {
            const file = e.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { try { const imported = JSON.parse(ev.target.result); saveSettings(deepMerge(DEFAULT_SETTINGS, imported)); location.reload(); } catch { alert('导入失败：无效的 JSON 文件'); } };
            reader.readAsText(file);
        };

        const globalFallbackEnabled = panel.querySelector('#pf-globalFallbackEnabled');
        const globalFallbackSitesWrapper = panel.querySelector('#pf-globalFallbackSitesWrapper');
        if (globalFallbackEnabled && globalFallbackSitesWrapper) {
            globalFallbackEnabled.onchange = () => {
                if (globalFallbackEnabled.checked) {
                    globalFallbackSitesWrapper.style.opacity = '1';
                    globalFallbackSitesWrapper.style.pointerEvents = 'auto';
                } else {
                    globalFallbackSitesWrapper.style.opacity = '0.5';
                    globalFallbackSitesWrapper.style.pointerEvents = 'none';
                }
            };
        }

        panel.querySelector('#pf-reset').onclick = () => { if (confirm('确定重置所有设置为默认值？')) { saveSettings(DEFAULT_SETTINGS); location.reload(); } };

        panel.querySelector('#pf-save').onclick = () => {
            try {
                console.log('[PingFang] 保存按钮被点击');

                // 收集字体组设置
                const fontGroupEnabled = {};
                panel.querySelectorAll('.pf-font-group-item input').forEach(cb => {
                    fontGroupEnabled[cb.dataset.group] = cb.checked;
                });

                // 【新增】收集防抖延迟设置
                let inputDebounceDelay = parseInt(panel.querySelector('#pf-inputDebounceDelay').value) || 50;

            const newSettings = {
                enabled: panel.querySelector('#pf-enabled').checked,
                enableSansReplacement: panel.querySelector('#pf-enableSansReplacement').checked,
                enableSerifReplacement: panel.querySelector('#pf-enableSerifReplacement').checked,
                enableMonoReplacement: panel.querySelector('#pf-enableMonoReplacement').checked,
                defaultCJKLang: panel.querySelector('#pf-defaultCJKLang').value,
                forceDefaultCJK: panel.querySelector('#pf-forceDefaultCJK').checked,
                fontDisplay: panel.querySelector('#pf-fontDisplay').value,
                enableFineDetection: panel.querySelector('#pf-enableFineDetection').checked,
                enableContentDetection: panel.querySelector('#pf-enableContentDetection').checked,
                inputLangMode: panel.querySelector('#pf-inputLangMode').value,
                mixedScriptThreshold: parseInt(panel.querySelector('#pf-mixedScriptThreshold').value),
                inputMixedScriptThreshold: parseInt(panel.querySelector('#pf-inputMixedScriptThreshold').value),
                inputDebounceDelay: inputDebounceDelay,
                fontGroupEnabled: fontGroupEnabled,
                // 保持向后兼容的fontInjection（从fontGroupEnabled同步）
                fontInjection: (() => {
                    const fi = {};
                    for (const key in FONT_GROUP_DEFINITIONS) {
                        const def = FONT_GROUP_DEFINITIONS[key];
                        fi[def.settingKey] = fontGroupEnabled[key] !== false;
                    }
                    return fi;
                })(),
                emojiConfig: {
                    preferColorEmoji: true,
                    emojiInFontStack: panel.querySelector('#pf-emojiInFontStack')?.value || 'high'
                },
                weightProtection: {
                    enabled: panel.querySelector('#pf-weightProtectionMode').value !== 'disabled',
                    mode: panel.querySelector('#pf-weightProtectionMode').value,
                    ratio: Math.max(0.1, parseFloat(panel.querySelector('#pf-weightProtectionRatio').value) || 2.0),
                    applyToInput: panel.querySelector('#pf-weightProtectionApplyToInput')?.checked !== false
                },
                // ★★★ 修复：enableUnihanFallback 已弃用，统一使用 extendedHanFallback.enabled ★★★
                enableEmojiFont: panel.querySelector('#pf-enableEmojiFont').checked,
                extendedHanFallback: {
                    enabled: panel.querySelector('#pf-extHanEnabled')?.checked !== false
                },
                customMonoFont: panel.querySelector('#pf-customMonoFont').value,
                customFontPriority: SETTINGS.customFontPriority,
                fontSynthesis: {
                    enabled: panel.querySelector('#pf-synthesisEnabled').checked,
                    method: panel.querySelector('#pf-synthesisMethod').value,
                    compensateWeight: parseFloat(panel.querySelector('#pf-compensateWeight').value),
                    shadowOffsetX: parseFloat(panel.querySelector('#pf-shadowOffsetX').value),
                    shadowOffsetY: parseFloat(panel.querySelector('#pf-shadowOffsetY').value),
                    shadowBlur: parseFloat(panel.querySelector('#pf-shadowBlur').value)
                },
                excludedDomains: panel.querySelector('#pf-excludedDomains').value.split('\n').map(s => s.trim()).filter(s => s),
                excludedTags: panel.querySelector('#pf-excludedTags').value.split('\n').map(s => s.trim()).filter(s => s),
                excludedSelectors: panel.querySelector('#pf-excludedSelectors').value.split('\n').map(s => s.trim()).filter(s => s),
                inputSelectors: panel.querySelector('#pf-inputSelectors').value.split('\n').map(s => s.trim()).filter(s => s),
                globalFallback: {
                    enabled: panel.querySelector('#pf-globalFallbackEnabled')?.checked !== false,
                    sites: panel.querySelector('#pf-globalFallbackSites')?.value.split('\n').map(s => s.trim()).filter(s => s) || []
                },
                debugMode: panel.querySelector('#pf-debugMode').checked,
                performanceMode: panel.querySelector('#pf-performanceMode').checked,
                cacheTimeout: parseInt(panel.querySelector('#pf-cacheTimeout').value) || 30000
            };

            console.log('[PingFang] 准备保存设置:', newSettings);
            saveSettings(newSettings);
            console.log('[PingFang] 设置已保存，准备刷新页面');
            location.reload();
            } catch (err) {
                console.error('[PingFang] 保存时出错:', err);
                alert('保存设置时出错: ' + err.message + '\n\n请打开浏览器控制台(F12)查看详细错误信息');
            }
        };
    }

    function registerSettingsEntry() {
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('⚙️ Noto 字体设置', () => {
                if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createSettingsPanel);
                else createSettingsPanel();
            });
        }
        document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.shiftKey && e.key === 'P') { e.preventDefault(); createSettingsPanel(); } });
    }

    registerSettingsEntry();

    if (SETTINGS.debugMode) {
        window.__PingFangReplacer = {
            settings: SETTINGS,
            openSettings: createSettingsPanel,
            reprocess: initProcess,
            version: '2.3.9',
            fontGroups: FONT_GROUP_DEFINITIONS,
            glyphDetector: GlyphDetector,
            isCodeRegion: isCodeRegion,
            codeRegionCache: codeRegionCache,
            cdnConfig: CDN_CONFIG,
            checkFonts: () => checkCriticalFonts(CDN_CONFIG.currentGoogleFontsIndex),
            switchGoogleFontsCDN: (index) => {
                const oldLink = document.getElementById('pf-google-fonts');
                const oldPreconnect = document.getElementById('pf-google-fonts-preconnect');
                const oldPreconnectStatic = document.getElementById('pf-google-fonts-preconnect-static');
                if (oldLink) oldLink.remove();
                if (oldPreconnect) oldPreconnect.remove();
                if (oldPreconnectStatic) oldPreconnectStatic.remove();
                injectGoogleFonts(index);
            },
            switchInterCDN: (index) => {
                const oldLink = document.getElementById('pf-inter-font');
                const oldPreconnect = document.getElementById('pf-inter-preconnect');
                if (oldLink) oldLink.remove();
                if (oldPreconnect) oldPreconnect.remove();
                injectInterFont(index);
            },
            scriptFontMap: SCRIPT_FONT_MAP,
            langToScript: LANG_TO_SCRIPT,
            detectScriptFromUnicode: detectScriptFromUnicode,
            getScriptFromLangAttr: getScriptFromLangAttr,
            getScriptFonts: getScriptFonts,
            listSupportedLanguages: () => {
                console.log('[PingFang] ========== 支持的语言和文字系统 ==========');
                for (const [scriptId, config] of Object.entries(SCRIPT_FONT_MAP)) {
                    console.log(`${scriptId}: ${config.langs.join(', ')}`);
                    console.log(`  Sans: ${config.sansFonts?.join(', ') || '无'}`);
                    console.log(`  Serif: ${config.serifFonts?.join(', ') || '无'}`);
                }
                console.log('[PingFang] =======================================');
            }
        };
        console.log('[PingFang] 调试模式已启用，可通过 window.__PingFangReplacer 访问API');
        console.log('[PingFang] 可用命令:');
        console.log('  - checkFonts(): 检测关键字体加载状态');
        console.log('  - switchGoogleFontsCDN(index): 切换 Google Fonts CDN (0-3)');
        console.log('  - switchInterCDN(index): 切换 Inter CDN (0-2)');
        console.log('  - cdnConfig: 查看当前 CDN 配置');
        console.log('  - listSupportedLanguages(): 列出所有支持的语言');
        console.log('  - detectScriptFromUnicode(text): 检测文本的文字系统');
    }

})();