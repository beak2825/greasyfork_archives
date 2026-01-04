// ==UserScript==
// @name         思源黑体网页替换脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将网页字体替换为思源黑体，资源使用外部注入，新增面板配置项，替换更智能
// @author       Claude
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      fontsapi.zeoseven.com
// @connect      cdn.jsdelivr.net
// @connect      fonts.cdnfonts.com
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557391/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557391/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[NotoFont] 脚本开始执行 v2.0');
    console.log('[NotoFont] document.readyState:', document.readyState);
    console.log('[NotoFont] document.head:', !!document.head);

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
            desc: 'Sans/Serif/Mono 基础字体',
            fonts: [`Noto+Sans${wc}`, `Noto+Serif${wc}`, `Noto+Sans+Mono${wc}`, `Noto+Sans+Display${wc}`, `Noto+Serif+Display${wc}`],
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


    // ==================== 智能缺字检测模块 (v2.6.0新增) ====================
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
        // ★★★ v2.7.0: 大字库简化版 - 只有开关，字体列表和顺序写死 ★★★
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
        excludedDomains: [],
        excludedTags: [
            'style', 'script', 'noscript', 'svg', 'path', 'rect', 'circle', 'line',
            'polyline', 'polygon', 'img', 'canvas', 'video', 'audio', 'iframe',
            'embed', 'object', 'template', 'track', 'source', 'meta', 'link',
            'i', 'icon', 'use', 'symbol'
        ],
        excludedSelectors: [
            '.material-symbols-outlined', '.material-icons', '.material-icons-outlined',
            '.fa', '.fas', '.far', '.fal', '.fab', '.fad', '.glyphicon',
            '.icon', '.icons', '.ico', '.docon', '.octicon', '.svg',
            '[class*="icon-"]', '[class*="ico-"]', '[class*="ri-"]', '[class*="nf-"]',
            '[class*="ms-Icon"]', '[class*="Fabric"]', '[class*="fui-Icon"]',
            '[class*="symbols"]', '[class*="video"]', '[class*="player"]',
            '.ms-Button-icon', '[class*="Button"]', '[role="img"]', '[aria-hidden="true"]',
            '.katex', '.katex *', '.MathJax', '.MathJax *', '.mjx-container', '.mjx-math', '.math',
            '.monaco-editor', '.CodeMirror', '.cm-content', '[class*="ace"]', '[class*="icon"]'
        ],
        excludedClassPatterns: ['icon', 'fa-', 'glyph', 'symbol', 'mjx', 'katex'],
        inputSelectors: ['[contenteditable="true"]', '[contenteditable=""]', '[role="textbox"]', '.CodeMirror', '.monaco-editor', '.ace_editor'],
        debugMode: false,
        performanceMode: false,
        cacheTimeout: 30000
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

    // ★★★ v2.7.0: 简化设置迁移 - 大字库只保留enabled开关 ★★★
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
        return settings;
    }

    function loadSettings() {
        try {
            const saved = GM_getValue('notoFontSettings', null);
            if (saved) {
                const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
                const merged = deepMerge(DEFAULT_SETTINGS, parsed);
                // 执行设置迁移
                return migrateSettings(merged);
            }
        } catch (e) { console.error('[NotoFont] 加载设置失败:', e); }
        return { ...DEFAULT_SETTINGS };
    }

    function saveSettings(settings) {
        try { GM_setValue('notoFontSettings', JSON.stringify(settings)); }
        catch (e) { console.error('[NotoFont] 保存设置失败:', e); }
    }

    const SETTINGS = loadSettings();
    console.log('[NotoFont] 设置已加载:', {
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
    function debugLog(...args) { if (SETTINGS.debugMode) console.log('[NotoFont]', ...args); }

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
    const EXCLUDED_CLASS_PATTERNS = SETTINGS.excludedClassPatterns;

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
        'Noto Sans Display',
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

    function buildFontStack(type, lang) {
        const stack = [];
        const customMono = SETTINGS.customMonoFont?.trim();
        const isGlobal = lang === 'global';

        // 获取页面原始 lang 属性（用于非 CJK 语言的字体优先级调整）
        const pageLangAttr = document.documentElement.lang || '';

        // Emoji 优先级（高优先级时放最前）
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
        }

        // CJK 字体
        const cjkLangMap = { sc: 'SC', tc: 'TC', hk: 'HK', jp: 'JP', kr: 'KR' };
        const cjkSuffix = cjkLangMap[lang] || cjkLangMap[SETTINGS.defaultCJKLang] || 'SC';

        // ★★★ 根据 lang 属性构建完整的 CJK 字体栈，将对应语言字体提到最前 ★★★
        const allCjkSuffixes = ['SC', 'TC', 'HK', 'JP', 'KR'];
        // 将当前语言对应的字体提到最前，其余保持原顺序
        const orderedCjkSuffixes = [cjkSuffix, ...allCjkSuffixes.filter(s => s !== cjkSuffix)];

        if (isGlobal) {
            // 全局模式：基础拉丁字体优先，CJK作为fallback
            if (type === 'serif') {
                stack.push('"Noto Serif"');
                orderedCjkSuffixes.forEach(suffix => stack.push(`"Noto Serif ${suffix}"`));
            } else if (type !== 'mono') {
                stack.push('"Noto Sans"');
                orderedCjkSuffixes.forEach(suffix => stack.push(`"Noto Sans ${suffix}"`));
            }
        } else {
            // CJK模式：CJK字体优先
            if (type === 'serif') {
                orderedCjkSuffixes.forEach(suffix => stack.push(`"Noto Serif ${suffix}"`));
                stack.push('"Noto Serif"');
            } else if (type !== 'mono') {
                orderedCjkSuffixes.forEach(suffix => stack.push(`"Noto Sans ${suffix}"`));
                stack.push('"Noto Sans"');
            }
        }

        // Emoji 低优先级
        if (SETTINGS.enableEmojiFont && SETTINGS.emojiConfig?.emojiInFontStack === 'low') {
            stack.push('"Noto Color Emoji"');
        }

        // ★★★ 关键修复：添加扩展语言字体作为fallback，根据 lang 属性调整顺序 ★★★
        if (type === 'serif') {
            // 根据页面 lang 属性重排 Serif 字体列表
            const orderedSerifFamilies = reorderFontsByLang(EXTRA_SERIF_FAMILIES, pageLangAttr, LANG_TO_SERIF_MAP);
            const serifStr = orderedSerifFamilies.map(f => `"${f}"`).join(', ');
            stack.push(serifStr);
        } else if (type !== 'mono') {
            // 根据页面 lang 属性重排 Sans 字体列表
            const orderedSansFamilies = reorderFontsByLang(EXTRA_SANS_FAMILIES, pageLangAttr, LANG_TO_FONT_MAP);
            const sansStr = orderedSansFamilies.map(f => `"${f}"`).join(', ');
            stack.push(sansStr);
        }

        // 系统 Emoji 回退（始终添加）
        stack.push('"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Emoji"');

        // ★★★ v2.7.0: 大字库简化版 - 写死字体列表，按网页字体风格自动匹配 ★★★
        if (SETTINGS.extendedHanFallback?.enabled !== false) {
            // 黑体/无衬线风格 - 用于 sans-serif 和 mono
            const gothicFonts = [
                'Plangothic P1', 'Plangothic P2',    // 遍黑体
                'BabelStone Han',                     // BabelStone Han
                'Genyo Gothic', '源樣黑體',          // 源样黑体
                'Sukima Gothic',                      // 隙间黑体
                'WenQuanYi Micro Hei', 'WenQuanYi Zen Hei'  // 文泉驿
            ];
            // 明体/宋体/衬线风格 - 用于 serif
            const minchoFonts = [
                'HanaMinA', 'HanaMinB', 'HanaMin',   // 花园明朝
                'I.Ming', 'I.MingCP',                 // 一点明体
                'Wenjin Songti',                      // 文津宋体
                'AR PL UMing CN', 'AR PL UMing TW'   // Uming
            ];

            if (type === 'serif') {
                // 衬线字体：明体优先，黑体兜底
                stack.push(...minchoFonts.map(f => `"${f}"`));
                stack.push(...gothicFonts.map(f => `"${f}"`));
            } else {
                // Sans和Mono：黑体优先，明体兜底
                stack.push(...gothicFonts.map(f => `"${f}"`));
                stack.push(...minchoFonts.map(f => `"${f}"`));
            }
        }

        // 通用回退
        if (type === 'mono') stack.push('monospace');
        else if (type === 'serif') stack.push('serif');
        else stack.push('sans-serif');

        return stack.join(', ');
    }

    // ==================== Google Fonts 注入 ====================
    function injectGoogleFonts() {
        const enabledFonts = [];

        // Emoji 字体由 enableEmojiFont 统一控制
        if (SETTINGS.enableEmojiFont) {
            enabledFonts.push('Noto+Color+Emoji');
        }

        for (const key in FONT_GROUP_DEFINITIONS) {
            if (isFontGroupEnabled(key)) {
                enabledFonts.push(...FONT_GROUP_DEFINITIONS[key].fonts);
            }
        }

        if (enabledFonts.length === 0) {
            debugLog('没有启用任何字体组');
            return;
        }

        const fontUrl = `https://fonts.googleapis.com/css2?family=${enabledFonts.join('&family=')}&display=${SETTINGS.fontDisplay}`;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontUrl;
        link.crossOrigin = 'anonymous';

        // 预连接
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://fonts.googleapis.com';

        const preconnectStatic = document.createElement('link');
        preconnectStatic.rel = 'preconnect';
        preconnectStatic.href = 'https://fonts.gstatic.com';
        preconnectStatic.crossOrigin = 'anonymous';

        document.head.prepend(preconnectStatic);
        document.head.prepend(preconnect);
        document.head.appendChild(link);

        debugLog('已注入 Google Fonts，共', enabledFonts.length, '个字体');
        console.log('[NotoFont] Google Fonts 注入完成，字体数:', enabledFonts.length);
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
        console.log('[NotoFont] document.head 已就绪，开始注入字体');
        injectGoogleFonts();
        injectExtendedHanFontFaces();
        injectFontAttributeStyles();
        injectSynthesisStyles();
        console.log('[NotoFont] 所有字体样式注入完成');
    });

    // ==================== 大字库功能（v2.7.0简化版） ====================
    // ★★★ v2.7.0: 大字库字体直接添加到 buildFontStack() 的字体栈中 ★★★
    // - 依赖用户本地安装大字库字体
    // - 不使用unicode-range，让浏览器自行决定何时使用
    // - 按字体风格分类：serif用明体，sans/mono用黑体
    function injectExtendedHanFontFaces() {
        // ★★★ 大字库现在直接在buildFontStack中添加，此函数只用于调试日志 ★★★
        if (SETTINGS.extendedHanFallback?.enabled === false) {
            debugLog('大字库回退已禁用');
        } else {
            debugLog('大字库回退已启用，字体将直接添加到字体栈末尾');
            debugLog('黑体优先列表：Plangothic, BabelStone Han, Genyo Gothic, Sukima Gothic, WenQuanYi');
            debugLog('明体优先列表：HanaMin, I.Ming, Wenjin Songti, AR PL UMing');
        }
    }

    // 注意：injectExtendedHanFontFaces 的调用已移至 ensureHead 回调中

    // ==================== CSS 属性选择器规则注入 ====================
    function injectFontAttributeStyles() {
        const langs = ['sc', 'tc', 'hk', 'jp', 'kr', 'global'];
        let css = '';

        // 生成所有语言和字体类型的组合规则（只生成启用的类型）
        for (const lang of langs) {
            if (SETTINGS.enableSansReplacement) {
                const sansStack = buildFontStack('sans', lang);
                css += `[data-nf-font="sans-${lang}"] { font-family: ${sansStack} !important; }\n`;
            }
            if (SETTINGS.enableSerifReplacement) {
                const serifStack = buildFontStack('serif', lang);
                css += `[data-nf-font="serif-${lang}"] { font-family: ${serifStack} !important; }\n`;
            }
        }

        // 等宽字体单独处理（仅当启用时）
        if (SETTINGS.enableMonoReplacement) {
            const monoStack = buildFontStack('mono', 'global');
            css += `[data-nf-font="mono-sc"], [data-nf-font="mono-tc"], [data-nf-font="mono-hk"], [data-nf-font="mono-jp"], [data-nf-font="mono-kr"], [data-nf-font="mono-global"] { font-family: ${monoStack} !important; font-variant-numeric: tabular-nums !important; }\n`;
        }

        // 抗锯齿（始终应用，与字体替换无关）
        css += `html, body {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: auto !important;
        }\n`;

        const style = document.createElement('style');
        style.id = 'nf-font-rules';
        style.textContent = css;
        document.head.appendChild(style);

        debugLog('已注入 CSS 属性选择器规则');
    }

    // 注意：injectFontAttributeStyles 的调用已移至 ensureHead 回调中

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

    // ★★★ v2.8.3: 获取元素的"直接文本内容"，排除带有独立 lang 属性的子元素 ★★★
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

    function detectFontType(element) {
        if (fontTypeCache.has(element)) return fontTypeCache.get(element);
        let fontType = 'sans';
        try {
            const computedStyle = window.getComputedStyle(element);
            const fontFamily = computedStyle.fontFamily.toLowerCase();
            if (MONO_KEYWORDS.some(kw => fontFamily.includes(kw))) fontType = 'mono';
            else if (SERIF_KEYWORDS.some(kw => fontFamily.includes(kw)) && !fontFamily.includes('sans')) fontType = 'serif';
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
        const className = element.className;
        if (typeof className === 'string' && className.length > 0) {
            const classPatternRegex = new RegExp(EXCLUDED_CLASS_PATTERNS.join('|'), 'i');
            if (classPatternRegex.test(className)) {
                if (EXCLUDED_SELECTORS.some(sel => { try { return element.matches(sel); } catch { return false; } })) return true;
            }
        }
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
        // ★★★ v2.8.3: 对于非输入框元素，使用 getDirectTextContent 排除带有独立 lang 属性的子元素 ★★★
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
        const shouldReplace = (fontType === 'sans' && SETTINGS.enableSansReplacement) ||
                              (fontType === 'serif' && SETTINGS.enableSerifReplacement) ||
                              (fontType === 'mono' && SETTINGS.enableMonoReplacement);

        if (!shouldReplace) return;

        const lang = getLangMode(element);
        const attrValue = `${fontType}-${lang}`;

        // 使用 setAttribute 设置 data-nf-font 属性
        element.setAttribute('data-nf-font', attrValue);

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
                        element.setAttribute('data-nf-font', newAttrValue);
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
            if (mutation.type === 'attributes' && (mutation.attributeName === 'data-nf-font' || mutation.attributeName === 'data-nf-observed')) continue;
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
        const allElements = document.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) pendingNodes.add(allElements[i]);
        processQueue();
        debugLog('初始化完成，处理了', allElements.length, '个元素');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initProcess);
    else initProcess();

    // ==================== 设置面板 ====================
    function createSettingsPanel() {
        if (document.getElementById('nf-settings-panel')) return;

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

                html += `<div class="nf-font-category">
                    <div class="nf-font-category-header">
                        <span class="nf-font-category-name">${catInfo.name}</span>
                        <button class="nf-font-category-toggle" data-category="${cat}" title="全选/取消全选">⊕</button>
                    </div>
                    <div class="nf-font-category-items">`;

                for (const group of groups) {
                    const checked = isFontGroupEnabled(group.key) ? 'checked' : '';
                    html += `<label class="nf-font-group-item" title="${group.desc}&#10;字体: ${group.fonts.length}个">
                        <input type="checkbox" id="nf-fontgroup-${group.key}" data-group="${group.key}" ${checked}>
                        <span class="nf-font-group-emoji">${group.emoji}</span>
                        <span class="nf-font-group-name">${group.name}</span>
                        <span class="nf-font-group-count">${group.fonts.length}</span>
                    </label>`;
                }

                html += `</div></div>`;
            }

            return html;
        }


        const panel = document.createElement('div');
        panel.id = 'nf-settings-panel';
        panel.innerHTML = `
            <div class="nf-overlay"></div>
            <div class="nf-panel">
                <div class="nf-header">
                    <div class="nf-header-left"><span class="nf-logo">🔤</span><div class="nf-title-group"><h2>Noto 字体替换设置</h2><span class="nf-subtitle">✨ V2.0 · 动画增强、性能优化</span></div></div>
                    <button class="nf-close" title="关闭">×</button>
                </div>
                <div class="nf-body">
                    <div class="nf-mobile-tabs">
                        <button class="nf-mobile-tab active" data-tab="basic">🔧 基础</button>
                        <button class="nf-mobile-tab" data-tab="language">🌐 语言</button>
                        <button class="nf-mobile-tab" data-tab="fonts">📦 字体</button>
                        <button class="nf-mobile-tab" data-tab="emoji">🎨 Emoji</button>
                        <button class="nf-mobile-tab" data-tab="synthesis">⚖️ 字重</button>
                        <button class="nf-mobile-tab" data-tab="exclusion">🚫 排除</button>
                        <button class="nf-mobile-tab" data-tab="advanced">⚙️ 高级</button>
                    </div>
                    <div class="nf-sidebar">
                        <button class="nf-nav-item active" data-tab="basic">🔧 基础设置</button>
                        <button class="nf-nav-item" data-tab="language">🌐 语言检测</button>
                        <button class="nf-nav-item" data-tab="fonts">📦 字体组管理</button>
                        <button class="nf-nav-item" data-tab="emoji">🎨 Emoji 配置</button>
                        <button class="nf-nav-item" data-tab="synthesis">⚖️ 字重模拟</button>
                        <button class="nf-nav-item" data-tab="exclusion">🚫 排除规则</button>
                        <button class="nf-nav-item" data-tab="advanced">⚙️ 高级设置</button>
                    </div>
                    <div class="nf-content">
                        <div class="nf-tab-content active" data-tab="basic">
                            <div class="nf-section"><h3>⚡ 功能开关</h3><div class="nf-card">
                                <label class="nf-option-card"><div class="nf-option-emoji">🚀</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">启用脚本</span><input type="checkbox" id="nf-enabled" ${SETTINGS.enabled?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">总开关，控制整个脚本的启用状态。关闭后脚本完全停止工作，不会注入任何字体或修改任何样式。</span></div></label>
                                <label class="nf-option-card"><div class="nf-option-emoji">🔤</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">Sans 字体替换</span><input type="checkbox" id="nf-enableSansReplacement" ${SETTINGS.enableSansReplacement?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">将网页的无衬线字体（如 Arial、Helvetica、微软雅黑）替换为 Noto Sans 系列。这是最常见的网页字体类型，建议开启。</span></div></label>
                                <label class="nf-option-card"><div class="nf-option-emoji">📖</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">Serif 字体替换</span><input type="checkbox" id="nf-enableSerifReplacement" ${SETTINGS.enableSerifReplacement?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">将网页的衬线字体（如 Times New Roman、Georgia、宋体）替换为 Noto Serif 系列。适用于阅读类网站、文档页面。</span></div></label>
                                <label class="nf-option-card"><div class="nf-option-emoji">💻</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">Mono 字体替换</span><input type="checkbox" id="nf-enableMonoReplacement" ${SETTINGS.enableMonoReplacement?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">将网页的等宽字体（如 Consolas、Monaco）替换为 Noto Sans Mono。适用于代码编辑器、终端界面。可在「字体组管理」中设置自定义等宽字体。</span></div></label>
                            </div></div>
                            <div class="nf-section"><h3>🌏 默认 CJK 语言</h3><div class="nf-card"><div class="nf-select-wrapper"><span class="nf-select-icon">🗣️</span>
                                <div class="nf-custom-select" data-select-id="nf-defaultCJKLang">
                                    <div class="nf-select-trigger" tabindex="0">
                                        <span class="nf-select-value"><span class="nf-select-text">请选择</span></span>
                                        <span class="nf-select-arrow">▼</span>
                                    </div>
                                    <div class="nf-select-dropdown">
                                        <div class="nf-select-option" data-value="sc"><span class="nf-select-option-emoji">🇨🇳</span><span class="nf-select-option-text">简体中文（SC）</span></div>
                                        <div class="nf-select-option" data-value="tc"><span class="nf-select-option-emoji">🇹🇼</span><span class="nf-select-option-text">繁体中文（TC）</span></div>
                                        <div class="nf-select-option" data-value="hk"><span class="nf-select-option-emoji">🇭🇰</span><span class="nf-select-option-text">香港繁体（HK）</span></div>
                                        <div class="nf-select-option" data-value="jp"><span class="nf-select-option-emoji">🇯🇵</span><span class="nf-select-option-text">日语（JP）</span></div>
                                        <div class="nf-select-option" data-value="kr"><span class="nf-select-option-emoji">🇰🇷</span><span class="nf-select-option-text">韩语（KR）</span></div>
                                    </div>
                                    <select id="nf-defaultCJKLang" class="nf-select-hidden">
                                        <option value="sc" ${SETTINGS.defaultCJKLang==='sc'?'selected':''}>🇨🇳 简体中文（SC）</option>
                                        <option value="tc" ${SETTINGS.defaultCJKLang==='tc'?'selected':''}>🇹🇼 繁体中文（TC）</option>
                                        <option value="hk" ${SETTINGS.defaultCJKLang==='hk'?'selected':''}>🇭🇰 香港繁体（HK）</option>
                                        <option value="jp" ${SETTINGS.defaultCJKLang==='jp'?'selected':''}>🇯🇵 日语（JP）</option>
                                        <option value="kr" ${SETTINGS.defaultCJKLang==='kr'?'selected':''}>🇰🇷 韩语（KR）</option>
                                    </select>
                                </div>
                            </div><p class="nf-hint-text">📝 当网页没有设置 lang 属性或设置了模糊的「zh」时，使用此语言作为默认值。<br>🀄 <b>SC</b>＝简体中文字形，<b>TC</b>＝台湾繁体字形，<b>HK</b>＝香港繁体字形（部分字形与 TC 不同）<br>🇯🇵 <b>JP</b>＝日语汉字字形（如「直」的写法不同），<b>KR</b>＝韩语汉字字形</p>
                                <label class="nf-option-card" style="margin-top:12px;"><div class="nf-option-emoji">🔒</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">强制使用默认 CJK 语言</span><input type="checkbox" id="nf-forceDefaultCJK" ${SETTINGS.forceDefaultCJK?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">开启后，所有 CJK 内容都将使用上方设置的默认语言字体，忽略网页的 lang 属性和内容检测结果。适合希望统一字体风格的用户。</span></div></label>
                                <p class="nf-hint-text">🔒 <b>强制模式说明</b>：开启后，无论网页标记为 zh-TW、zh-HK 还是 ja、ko，都将统一使用你设置的默认 CJK 语言字体。<br>⚠️ <b>注意</b>：这可能导致部分汉字显示为非本地化字形（如日语页面的汉字显示为简体中文字形）。<br>💡 <b>适用场景</b>：个人偏好统一字体风格、不在意字形本地化差异、或默认检测结果不符合预期时使用。</p>
                            </div></div>
                            <div class="nf-section"><h3>⏱️ 字体显示策略</h3><div class="nf-card"><div class="nf-select-wrapper"><span class="nf-select-icon">🎯</span>
                                <div class="nf-custom-select" data-select-id="nf-fontDisplay">
                                    <div class="nf-select-trigger" tabindex="0">
                                        <span class="nf-select-value"><span class="nf-select-text">请选择</span></span>
                                        <span class="nf-select-arrow">▼</span>
                                    </div>
                                    <div class="nf-select-dropdown">
                                        <div class="nf-select-option" data-value="swap"><span class="nf-select-option-emoji">💫</span><span class="nf-select-option-text">swap（推荐）</span></div>
                                        <div class="nf-select-option" data-value="block"><span class="nf-select-option-emoji">🔲</span><span class="nf-select-option-text">block</span></div>
                                        <div class="nf-select-option" data-value="fallback"><span class="nf-select-option-emoji">🔙</span><span class="nf-select-option-text">fallback</span></div>
                                        <div class="nf-select-option" data-value="optional"><span class="nf-select-option-emoji">❓</span><span class="nf-select-option-text">optional</span></div>
                                    </div>
                                    <select id="nf-fontDisplay" class="nf-select-hidden">
                                        <option value="swap" ${SETTINGS.fontDisplay==='swap'?'selected':''}>💫 swap（推荐）</option>
                                        <option value="block" ${SETTINGS.fontDisplay==='block'?'selected':''}>🔲 block</option>
                                        <option value="fallback" ${SETTINGS.fontDisplay==='fallback'?'selected':''}>🔙 fallback</option>
                                        <option value="optional" ${SETTINGS.fontDisplay==='optional'?'selected':''}>❓ optional</option>
                                    </select>
                                </div>
                            </div><p class="nf-hint-text">💫 <b>swap</b>：立即显示后备字体，字体加载完成后切换（推荐，用户体验最佳）<br>🔲 <b>block</b>：短暂隐藏文字直到字体加载完成（避免字体闪烁，但可能有白屏）<br>🔙 <b>fallback</b>：短暂等待后显示后备字体，之后不再切换<br>❓ <b>optional</b>：由浏览器决定，网络慢时可能不加载字体</p></div></div>
                        </div>
                        <div class="nf-tab-content" data-tab="language">
                            <div class="nf-section"><h3>🔍 精细检测模式</h3><div class="nf-card">
                                <label class="nf-option-card"><div class="nf-option-emoji">🎯</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">启用精细检测</span><input type="checkbox" id="nf-enableFineDetection" ${SETTINGS.enableFineDetection?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">读取每个元素的 lang 属性来决定字体。例如 &lt;span lang="zh-TW"&gt; 会使用台湾繁体字体，&lt;span lang="zh-HK"&gt; 会使用香港繁体字体。严格区分 TC 和 HK 字形。</span></div></label>
                                <label class="nf-option-card" id="nf-contentDetectionRow"><div class="nf-option-emoji">📊</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">内容语言检测（页面文本）</span><input type="checkbox" id="nf-enableContentDetection" ${SETTINGS.enableContentDetection?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">根据文本内容自动判断语言。例如检测到「國」「學」等繁体字会自动切换到繁体字体，检测到「国」「学」会使用简体字体。可覆盖错误的 lang 属性。</span></div></label>
                                <p class="nf-hint-text">💡 <b>两个选项的区别</b>：精细检测依赖网页的 lang 属性标记，内容检测则分析实际文字内容。建议同时开启以获得最佳效果。</p>
                            </div></div>
                            <div class="nf-section"><h3>⌨️ 输入框检测模式</h3><div class="nf-card">
                                <div class="nf-input-row" style="flex-direction:column;align-items:stretch;gap:8px;">
                                    <div class="nf-select-wrapper"><span class="nf-select-icon">✍️</span>
                                        <div class="nf-custom-select" data-select-id="nf-inputLangMode">
                                            <div class="nf-select-trigger" tabindex="0">
                                                <span class="nf-select-value"><span class="nf-select-text">请选择</span></span>
                                                <span class="nf-select-arrow">▼</span>
                                            </div>
                                            <div class="nf-select-dropdown">
                                                <div class="nf-select-option" data-value="dynamic"><span class="nf-select-option-emoji">🔄</span><span class="nf-select-option-text">动态检测（实时识别输入内容）</span></div>
                                                <div class="nf-select-option" data-value="lang-only"><span class="nf-select-option-emoji">🏷️</span><span class="nf-select-option-text">沿用网页 lang 属性</span></div>
                                                <div class="nf-select-option" data-value="default-only"><span class="nf-select-option-emoji">🌐</span><span class="nf-select-option-text">跟随默认 CJK 语言设置</span></div>
                                            </div>
                                            <select id="nf-inputLangMode" class="nf-select-hidden">
                                                <option value="dynamic" ${SETTINGS.inputLangMode==='dynamic'?'selected':''}>🔄 动态检测（实时识别输入内容）</option>
                                                <option value="lang-only" ${SETTINGS.inputLangMode==='lang-only'?'selected':''}>🏷️ 沿用网页 lang 属性</option>
                                                <option value="default-only" ${SETTINGS.inputLangMode==='default-only'?'selected':''}>🌐 跟随默认 CJK 语言设置</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p class="nf-hint-text">🔄 <b>动态检测</b>：实时分析输入内容，自动切换字体。输入中文用中文字体，输入日文假名用日文字体。<br>🏷️ <b>沿用 lang 属性</b>：使用网页设置的语言，不随输入内容变化。<br>🌐 <b>跟随默认</b>：始终使用「默认 CJK 语言」设置的字体。</p>
                                </div>
                            </div></div>
                            <div class="nf-section" id="nf-debounceSection"><h3>⏳ 输入框防抖延迟</h3><div class="nf-card">
                                <div class="nf-input-row" style="flex-direction:column;align-items:stretch;gap:8px;">
                                    <div style="display:flex;align-items:center;gap:12px;">
                                        <span class="nf-input-icon">⏱️</span>
                                        <input type="number" id="nf-inputDebounceDelay" class="nf-input" value="${SETTINGS.inputDebounceDelay || 50}" style="width:100px;">
                                        <span>毫秒（ms）</span>
                                    </div>
                                    <p class="nf-hint-text">⏱️ 输入时等待指定毫秒后才执行字体检测，减少性能消耗。<br>🐢 如果在复杂网页（如 Claude、Notion）上打字卡顿，建议增大到 200～500ms。<br>⚡ 值越小响应越快但更耗性能，默认 50ms 适合大多数情况。</p>
                                </div>
                            </div></div>
                            <div class="nf-section" id="nf-thresholdSection"><h3>📐 检测阈值</h3><div class="nf-card">
                                <div class="nf-input-row" id="nf-pageThresholdRow"><span class="nf-input-icon">📄</span><label>页面内容阈值：</label><input type="number" id="nf-mixedScriptThreshold" class="nf-input nf-number-input" min="1" max="100" step="1" value="${SETTINGS.mixedScriptThreshold}"></div>
                                <div class="nf-input-row" id="nf-inputThresholdRow"><span class="nf-input-icon">⌨️</span><label>输入框阈值：</label><input type="number" id="nf-inputMixedScriptThreshold" class="nf-input nf-number-input" min="1" max="20" step="1" value="${SETTINGS.inputMixedScriptThreshold}"></div>
                                <p class="nf-hint-text">📐 检测到多少个目标语言字符才触发字体切换。<br>📄 <b>页面内容阈值</b>：静态页面文本的检测灵敏度，值越小越灵敏。<br>⌨️ <b>输入框阈值</b>：输入时的检测灵敏度，通常设为 1 以快速响应。</p>
                            </div></div>
                            <div class="nf-section"><h3>🛡️ 权重保护</h3><div class="nf-card">
                                <div class="nf-input-row" style="flex-direction:column;align-items:stretch;gap:8px;">
                                    <div class="nf-select-wrapper"><span class="nf-select-icon">⚖️</span>
                                        <div class="nf-custom-select" data-select-id="nf-weightProtectionMode">
                                            <div class="nf-select-trigger" tabindex="0">
                                                <span class="nf-select-value"><span class="nf-select-text">请选择</span></span>
                                                <span class="nf-select-arrow">▼</span>
                                            </div>
                                            <div class="nf-select-dropdown">
                                                <div class="nf-select-option" data-value="preset"><span class="nf-select-option-emoji">🎯</span><span class="nf-select-option-text">预设（2 倍保护）</span></div>
                                                <div class="nf-select-option" data-value="custom"><span class="nf-select-option-emoji">🔧</span><span class="nf-select-option-text">自定义倍数</span></div>
                                                <div class="nf-select-option" data-value="disabled"><span class="nf-select-option-emoji">❌</span><span class="nf-select-option-text">禁用保护</span></div>
                                            </div>
                                            <select id="nf-weightProtectionMode" class="nf-select-hidden">
                                                <option value="preset" ${(SETTINGS.weightProtection?.mode||'preset')==='preset'?'selected':''}>🎯 预设（2 倍保护）</option>
                                                <option value="custom" ${SETTINGS.weightProtection?.mode==='custom'?'selected':''}>🔧 自定义倍数</option>
                                                <option value="disabled" ${SETTINGS.weightProtection?.mode==='disabled'?'selected':''}>❌ 禁用保护</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="nf-weightProtectionRatioRow" class="nf-input-row" style="${SETTINGS.weightProtection?.mode==='custom'?'':'display:none'}">
                                        <span class="nf-input-icon">🔢</span><label>保护倍数：</label>
                                        <input type="number" id="nf-weightProtectionRatio" class="nf-input" style="width:100px;" step="0.1" min="0.1" value="${SETTINGS.weightProtection?.ratio||2}">
                                    </div>
                                    <div id="nf-weightProtectionError" class="nf-error-box" style="display:none;margin-top:8px;padding:10px 12px;background:rgba(255,59,48,0.1);border:1px solid rgba(255,59,48,0.3);border-radius:8px;color:#ff3b30;font-size:12px;">⚠️ 输入数值无效，请输入大于 0 的数字</div>
                                    <label class="nf-option-card" id="nf-wpApplyToInputRow" style="margin-top:8px;"><div class="nf-option-emoji">⌨️</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">应用到输入框</span><input type="checkbox" id="nf-weightProtectionApplyToInput" ${SETTINGS.weightProtection?.applyToInput!==false?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">输入框也沿用上面的权重保护设置。关闭后输入框达到阈值即切换字体，响应更快。</span></div></label>
                                    <p class="nf-hint-text">🎯 <b>预设（2 倍）</b>：目标语言字符必须是当前语言的 2 倍才切换。适用于所有语言检测（日语、韩语、简繁体）。<br>🔧 <b>自定义</b>：自定义倍数阈值，值越大越保守。<br>❌ <b>禁用</b>：达到检测阈值即切换，实现「非拉丁优先」效果。<br>　　→ 适合「Noto 字体 2.8.0.user.js」这类中英混排，只要有中文就用中文字体。<br>💡 <b>举例</b>：ratio＝2 时，中文页面中夹带少量日语假名（如注音）不会触发切换到日语字体。</p>
                                </div>
                            </div></div>
                        </div>
                        <div class="nf-tab-content" data-tab="fonts">
                            <div class="nf-section">
                                <h3>📦 字体组加载</h3>
                                <p class="nf-hint">✅ 选择需要从 Google Fonts 加载的字体组。只有勾选的字体才会被下载。<br>❎ 未勾选的字体组不会加载，可节省带宽和加载时间。<br>⭐「常用」按钮会选择：基础拉丁、CJK 中日韩、符号系统。</p>
                                <div class="nf-font-groups-toolbar">
                                    <button class="nf-btn nf-btn-sm" id="nf-font-select-all">✅ 全选</button>
                                    <button class="nf-btn nf-btn-sm" id="nf-font-select-none">❎ 全不选</button>
                                    <button class="nf-btn nf-btn-sm" id="nf-font-select-common">⭐ 常用</button>
                                </div>
                                <div class="nf-font-groups-container">
                                    ${generateFontGroupsHTML()}
                                </div>
                            </div>
                            <div class="nf-section"><h3>⌨️ 自定义等宽字体</h3><div class="nf-card">
                                <div class="nf-input-row"><span class="nf-input-icon">💻</span><input type="text" id="nf-customMonoFont" class="nf-input" value="${SETTINGS.customMonoFont}" placeholder="如：Maple Mono, JetBrains Mono"></div>
                                <p class="nf-hint-text">💻 在此输入你喜欢的等宽字体名称，它会被添加到等宽字体栈的最前面。<br>📝 多个字体用逗号分隔，如：「Maple Mono, JetBrains Mono, Fira Code」<br>⚠️ 需要确保该字体已安装在你的电脑上。</p>
                            </div></div>
                        </div>
                        <div class="nf-tab-content" data-tab="emoji">
                            <div class="nf-section"><h3>😀 Emoji 基础</h3><div class="nf-card">
                                <label class="nf-option-card"><div class="nf-option-emoji">🎨</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">启用 Emoji 字体</span><input type="checkbox" id="nf-enableEmojiFont" ${SETTINGS.enableEmojiFont?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">加载 Noto Color Emoji 字体，提供跨平台一致的彩色 Emoji 显示效果。文件较大（约 10MB），首次加载可能较慢。</span></div></label>
                            </div></div>
                            <div class="nf-section" id="nf-emojiStackSection"><h3>📊 字体栈优先级</h3><div class="nf-card">
                                <div class="nf-select-wrapper"><span class="nf-select-icon">📈</span>
                                    <div class="nf-custom-select" data-select-id="nf-emojiInFontStack">
                                        <div class="nf-select-trigger" tabindex="0">
                                            <span class="nf-select-value"><span class="nf-select-text">请选择</span></span>
                                            <span class="nf-select-arrow">▼</span>
                                        </div>
                                        <div class="nf-select-dropdown">
                                            <div class="nf-select-option" data-value="high"><span class="nf-select-option-emoji">⬆️</span><span class="nf-select-option-text">高优先级（靠前）</span></div>
                                            <div class="nf-select-option" data-value="low"><span class="nf-select-option-emoji">⬇️</span><span class="nf-select-option-text">低优先级（靠后）</span></div>
                                            <div class="nf-select-option" data-value="none"><span class="nf-select-option-emoji">🚫</span><span class="nf-select-option-text">不加入字体栈</span></div>
                                        </div>
                                        <select id="nf-emojiInFontStack" class="nf-select-hidden">
                                            <option value="high" ${(SETTINGS.emojiConfig?.emojiInFontStack||'high')==='high'?'selected':''}>⬆️ 高优先级（靠前）</option>
                                            <option value="low" ${SETTINGS.emojiConfig?.emojiInFontStack==='low'?'selected':''}>⬇️ 低优先级（靠后）</option>
                                            <option value="none" ${SETTINGS.emojiConfig?.emojiInFontStack==='none'?'selected':''}>🚫 不加入字体栈</option>
                                        </select>
                                    </div>
                                </div>
                                <p class="nf-hint-text">⬆️ <b>高优先级</b>：Emoji 字体放在字体栈最前面，优先使用 Noto Color Emoji 显示。<br>⬇️ <b>低优先级</b>：Emoji 字体放在 CJK 字体之后，可能会被其他字体中的符号覆盖。<br>🚫 <b>不加入</b>：不将 Emoji 字体加入字体栈，完全由系统决定。</p>
                            </div></div>
                        </div>
                        <div class="nf-tab-content" data-tab="synthesis">
                            <div class="nf-section"><h3>⚖️ 字重模拟</h3><div class="nf-card">
                                <label class="nf-option-card"><div class="nf-option-emoji">🎚️</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">启用字重模拟</span><input type="checkbox" id="nf-synthesisEnabled" ${SETTINGS.fontSynthesis?.enabled?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">当字体缺少某些字重（如 Semi-Bold、Light）时，使用 CSS 技术模拟。可能影响渲染质量，通常不需要开启。</span></div></label>
                            </div></div>
                            <div class="nf-section" id="nf-synthesisMethodSection"><h3>🔧 模拟方式</h3><div class="nf-card">
                                <div class="nf-select-wrapper"><span class="nf-select-icon">🛠️</span>
                                    <div class="nf-custom-select" data-select-id="nf-synthesisMethod">
                                        <div class="nf-select-trigger" tabindex="0">
                                            <span class="nf-select-value"><span class="nf-select-text">请选择</span></span>
                                            <span class="nf-select-arrow">▼</span>
                                        </div>
                                        <div class="nf-select-dropdown">
                                            <div class="nf-select-option" data-value="synthesis"><span class="nf-select-option-emoji">✨</span><span class="nf-select-option-text">font-synthesis（推荐）</span></div>
                                            <div class="nf-select-option" data-value="stroke"><span class="nf-select-option-emoji">✏️</span><span class="nf-select-option-text">描边加粗（仅 bold）</span></div>
                                            <div class="nf-select-option" data-value="compensate"><span class="nf-select-option-emoji">🖊️</span><span class="nf-select-option-text">全局描边补偿</span></div>
                                            <div class="nf-select-option" data-value="shadow"><span class="nf-select-option-emoji">🌑</span><span class="nf-select-option-text">阴影模拟（仅 bold）</span></div>
                                        </div>
                                        <select id="nf-synthesisMethod" class="nf-select-hidden">
                                            <option value="synthesis" ${(SETTINGS.fontSynthesis?.method||'synthesis')==='synthesis'?'selected':''}>✨ font-synthesis（推荐）</option>
                                            <option value="stroke" ${SETTINGS.fontSynthesis?.method==='stroke'?'selected':''}>✏️ 描边加粗（仅 bold）</option>
                                            <option value="compensate" ${SETTINGS.fontSynthesis?.method==='compensate'?'selected':''}>🖊️ 全局描边补偿</option>
                                            <option value="shadow" ${SETTINGS.fontSynthesis?.method==='shadow'?'selected':''}>🌑 阴影模拟（仅 bold）</option>
                                        </select>
                                    </div>
                                </div>
                            </div></div>
                            <div class="nf-section" id="nf-synthesisParamsSection"><h3>🎛️ 参数调整</h3><div class="nf-card">
                                <div class="nf-input-row" id="nf-paramCompensate"><span class="nf-input-icon">✏️</span><label>描边粗细：</label><input type="number" id="nf-compensateWeight" class="nf-input nf-number-input" min="0" max="1" step="0.01" value="${SETTINGS.fontSynthesis?.compensateWeight||0.15}"></div>
                                <div class="nf-input-row" id="nf-paramShadowX"><span class="nf-input-icon">↔️</span><label>阴影 X 偏移：</label><input type="number" id="nf-shadowOffsetX" class="nf-input nf-number-input" min="0" max="2" step="0.1" value="${SETTINGS.fontSynthesis?.shadowOffsetX||0.3}"></div>
                                <div class="nf-input-row" id="nf-paramShadowY"><span class="nf-input-icon">↕️</span><label>阴影 Y 偏移：</label><input type="number" id="nf-shadowOffsetY" class="nf-input nf-number-input" min="0" max="2" step="0.1" value="${SETTINGS.fontSynthesis?.shadowOffsetY||0.3}"></div>
                                <div class="nf-input-row" id="nf-paramShadowBlur"><span class="nf-input-icon">🌫️</span><label>阴影模糊：</label><input type="number" id="nf-shadowBlur" class="nf-input nf-number-input" min="0" max="5" step="0.1" value="${SETTINGS.fontSynthesis?.shadowBlur||0}"></div>
                                <p id="nf-paramHint" class="nf-hint-text">💡 font-synthesis 让浏览器自动合成缺失字重，兼容性最佳</p>
                            </div></div>
                        </div>
                        <div class="nf-tab-content" data-tab="exclusion">
                            <div class="nf-section"><h3>🌐 排除域名</h3><div class="nf-card"><div class="nf-textarea-wrapper"><span class="nf-textarea-icon">🚫</span><textarea id="nf-excludedDomains" class="nf-textarea nf-code" rows="4" placeholder="每行一个域名，支持 *.example.com">${SETTINGS.excludedDomains.join('\n')}</textarea></div>
                                <p class="nf-hint-text">🌐 在这些域名上脚本不会生效。每行一个域名。<br>✳️ 支持通配符：*.example.com 会匹配 sub.example.com、www.example.com 等所有子域名。</p>
                            </div></div>
                            <div class="nf-section"><h3>🎯 排除 CSS 选择器</h3><div class="nf-card"><div class="nf-textarea-wrapper"><span class="nf-textarea-icon">🔍</span><textarea id="nf-excludedSelectors" class="nf-textarea nf-code" rows="6" placeholder='每行一个选择器，如 .icon, [class*="icon-"]'>${SETTINGS.excludedSelectors.join('\n')}</textarea></div>
                                <p class="nf-hint-text">🔍 匹配这些选择器的元素不会被替换字体。用于保护图标字体等特殊元素。<br>📝 支持标准 CSS 选择器语法，如：.icon、[class*="fa-"]、#special-element</p>
                            </div></div>
                            <div class="nf-section"><h3>🏷️ 排除标签</h3><div class="nf-card"><div class="nf-textarea-wrapper"><span class="nf-textarea-icon">📌</span><textarea id="nf-excludedTags" class="nf-textarea nf-code" rows="3" placeholder="每行一个标签名">${SETTINGS.excludedTags.join('\n')}</textarea></div>
                                <p class="nf-hint-text">🏷️ 这些 HTML 标签内的内容不会被替换字体。默认已排除 script、style、svg 等标签。</p>
                            </div></div>
                            <div class="nf-section"><h3>🔤 排除 class 模式</h3><div class="nf-card"><div class="nf-input-row"><span class="nf-input-icon">🔡</span><input type="text" id="nf-excludedClassPatterns" class="nf-input nf-code" value="${SETTINGS.excludedClassPatterns.join(', ')}" placeholder="逗号分隔，如 icon, fa-, glyph"></div>
                                <p class="nf-hint-text">🔤 class 名称包含这些关键词的元素不会被替换。用逗号分隔多个关键词。<br>📝 例如：「icon, fa-, glyph」会排除 class="my-icon"、class="fa-star" 等。</p>
                            </div></div>
                            <div class="nf-section"><h3>⌨️ 输入框选择器</h3><div class="nf-card"><div class="nf-textarea-wrapper"><span class="nf-textarea-icon">✍️</span><textarea id="nf-inputSelectors" class="nf-textarea nf-code" rows="4" placeholder="每行一个选择器">${SETTINGS.inputSelectors.join('\n')}</textarea></div>
                                <p class="nf-hint-text">⌨️ 这些选择器匹配的元素会被识别为输入框，应用输入框相关的检测逻辑。<br>📝 默认已包含 contenteditable、textbox 等常见输入框类型。</p>
                            </div></div>
                        </div>
                        <div class="nf-tab-content" data-tab="advanced">
                            <div class="nf-section"><h3>📚 大字库回退</h3><div class="nf-card">
                                <label class="nf-option-card"><div class="nf-option-emoji">🔌</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">启用大字库回退</span><input type="checkbox" id="nf-extHanEnabled" ${SETTINGS.extendedHanFallback?.enabled!==false?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">为 CJK 扩展区的罕用汉字提供字体回退支持。需要在电脑上安装大字库字体才能生效。</span></div></label>
                                <p class="nf-hint-text">📚 <b>什么是大字库</b>：Unicode 收录了约 10 万个汉字，但常用字体只包含约 2～3 万字。大字库字体可显示罕用汉字。<br>📁 <b>支持的字体</b>：遍黑体（Plangothic）、花园明朝（HanaMin）、BabelStone Han、一点明体（I.Ming）、文泉驿等。<br>🔤 <b>自动匹配</b>：Sans 页面使用黑体系回退，Serif 页面使用明体系回退。</p>
                            </div></div>
                            <div class="nf-section"><h3>🐛 调试选项</h3><div class="nf-card">
                                <label class="nf-option-card"><div class="nf-option-emoji">📋</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">调试模式</span><input type="checkbox" id="nf-debugMode" ${SETTINGS.debugMode?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">在浏览器控制台（F12）输出详细的运行日志，包括字体检测、语言判断等信息。用于排查问题。</span></div></label>
                                <label class="nf-option-card"><div class="nf-option-emoji">⚡</div><div class="nf-option-content"><div class="nf-option-header"><span class="nf-option-title">性能模式</span><input type="checkbox" id="nf-performanceMode" ${SETTINGS.performanceMode?'checked':''}><span class="nf-switch"></span></div><span class="nf-option-desc">减少 DOM 检测频率和批处理数量，降低 CPU 占用。适用于大型复杂网页或低性能设备。</span></div></label>
                            </div></div>
                            <div class="nf-section"><h3>💾 缓存设置</h3><div class="nf-card"><div class="nf-input-row"><span class="nf-input-icon">⏰</span><label>超时（ms）：</label><input type="number" id="nf-cacheTimeout" class="nf-input" value="${SETTINGS.cacheTimeout}" min="1000" max="300000"></div>
                                <p class="nf-hint-text">⏰ 语言检测结果的缓存时间（毫秒）。缓存可减少重复计算，但过长可能导致动态内容检测不及时。默认 30000ms（30 秒）。</p>
                            </div></div>
                            <div class="nf-section"><h3>📂 数据管理</h3><div class="nf-card nf-btn-row">
                                <button class="nf-btn" id="nf-export">📤 导出设置</button>
                                <button class="nf-btn" id="nf-import">📥 导入设置</button>
                                <button class="nf-btn nf-btn-danger" id="nf-reset">🔄 重置默认</button>
                                <input type="file" id="nf-import-file" accept=".json" style="display:none">
                            </div>
                                <p class="nf-hint-text">📤 <b>导出</b>：将当前设置保存为 JSON 文件，可用于备份或迁移到其他设备。<br>📥 <b>导入</b>：从 JSON 文件恢复设置。<br>🔄 <b>重置</b>：将所有设置恢复为默认值（需确认）。</p>
                            </div>
                            <div class="nf-section"><h3>ℹ️ 关于</h3><div class="nf-card nf-about-card">
                                <div class="nf-about-title">🔤 Noto 字体统一替换脚本</div>
                                <div class="nf-about-version">✨ 版本 2.0 · 动画增强、性能优化</div>
                                <div class="nf-about-hint">⌨️ 快捷键：Ctrl+Shift+F 打开设置</div>
                            </div></div>
                        </div>
                    </div>
                </div>
                <div class="nf-footer"><span class="nf-version">✨ V2.0</span><div class="nf-actions"><button id="nf-cancel" class="nf-btn">❌ 取消</button><button id="nf-save" class="nf-btn nf-btn-primary">💾 保存并刷新</button></div></div>
            </div>
        `;

        // ========== 性能优化：预加载样式 ==========
        const styleId = 'nf-settings-panel-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `#nf-settings-panel{--nf-bg:rgba(255,255,255,0.92);--nf-glass:rgba(255,255,255,0.75);--nf-text:#1d1d1f;--nf-text-sec:#6e6e73;--nf-accent:#007aff;--nf-border:rgba(0,0,0,0.12);--nf-hover:rgba(0,0,0,0.06);--nf-card-bg:rgba(255,255,255,0.8);--nf-shadow-text:0 1px 2px rgba(0,0,0,0.1);position:fixed;inset:0;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Noto Sans SC",system-ui,sans-serif !important;font-size:14px;line-height:1.5;color:var(--nf-text);opacity:0;visibility:hidden;transition:opacity 0.15s ease-out,visibility 0.15s ease-out}#nf-settings-panel.nf-visible{opacity:1;visibility:visible}#nf-settings-panel *{font-family:inherit !important}@media(prefers-color-scheme:dark){#nf-settings-panel{--nf-bg:rgba(28,28,30,0.95);--nf-glass:rgba(44,44,46,0.85);--nf-text:#f5f5f7;--nf-text-sec:#a1a1a6;--nf-border:rgba(255,255,255,0.15);--nf-hover:rgba(255,255,255,0.08);--nf-card-bg:rgba(60,60,67,0.6);--nf-shadow-text:0 1px 3px rgba(0,0,0,0.3)}}#nf-settings-panel *{box-sizing:border-box}.nf-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);opacity:0;transition:opacity 0.3s ease}.nf-visible .nf-overlay{opacity:1}.nf-panel{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.92);width:95%;max-width:900px;max-height:90vh;background:var(--nf-bg);backdrop-filter:blur(40px) saturate(180%);-webkit-backdrop-filter:blur(40px) saturate(180%);border-radius:20px;border:1px solid var(--nf-border);box-shadow:0 25px 80px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.1) inset;display:flex;flex-direction:column;overflow:hidden;opacity:0;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.25s ease}.nf-visible .nf-panel{transform:translate(-50%,-50%) scale(1);opacity:1}.nf-header{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:var(--nf-glass);border-bottom:1px solid var(--nf-border)}.nf-header-left{display:flex;align-items:center;gap:12px}.nf-logo{font-size:28px;animation:nf-float 3s ease-in-out infinite}.nf-title-group h2{margin:0;font-size:17px;font-weight:600;text-shadow:var(--nf-shadow-text)}.nf-subtitle{font-size:12px;color:var(--nf-text-sec);text-shadow:var(--nf-shadow-text)}.nf-close{width:32px;height:32px;border:none;background:var(--nf-hover);border-radius:50%;cursor:pointer;color:var(--nf-text-sec);font-size:20px;display:flex;align-items:center;justify-content:center;transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}.nf-close:hover{background:rgba(255,59,48,0.15);color:#ff3b30;transform:rotate(90deg)}.nf-mobile-tabs{display:none;overflow-x:auto;white-space:nowrap;background:var(--nf-glass);border-bottom:1px solid var(--nf-border);scrollbar-width:none}.nf-mobile-tabs::-webkit-scrollbar{display:none}.nf-mobile-tab{flex-shrink:0;padding:12px 16px;border:none;background:transparent;color:var(--nf-text-sec);font-size:13px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.25s ease;text-shadow:var(--nf-shadow-text)}.nf-mobile-tab:hover{color:var(--nf-text);background:var(--nf-hover)}.nf-mobile-tab.active{color:var(--nf-accent);border-bottom-color:var(--nf-accent)}.nf-body{display:flex;flex:1;overflow:hidden}.nf-sidebar{width:160px;background:var(--nf-glass);border-right:1px solid var(--nf-border);padding:12px 8px;display:flex;flex-direction:column;gap:4px}.nf-nav-item{display:flex;align-items:center;gap:8px;padding:10px 12px;border:none;background:none;border-radius:10px;cursor:pointer;color:var(--nf-text-sec);font-size:13px;text-align:left;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);text-shadow:var(--nf-shadow-text);position:relative;overflow:hidden}.nf-nav-item::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,var(--nf-accent),transparent);opacity:0;transition:opacity 0.3s ease}.nf-nav-item:hover{background:var(--nf-hover);color:var(--nf-text);transform:translateX(4px)}.nf-nav-item.active{background:rgba(0,122,255,0.18);color:var(--nf-accent);font-weight:500}.nf-nav-item.active::before{opacity:0.1}.nf-content{flex:1;overflow-y:auto;padding:20px 24px;scroll-behavior:smooth}.nf-tab-content{display:none;opacity:0;transform:translateY(10px);transition:opacity 0.3s ease,transform 0.3s ease}.nf-tab-content.active{display:block;opacity:1;transform:translateY(0);animation:nf-fadeSlideIn 0.35s ease forwards}.nf-section{margin-bottom:24px;opacity:0;animation:nf-sectionFadeIn 0.4s ease forwards;animation-delay:calc(var(--section-index, 0) * 0.05s)}.nf-section h3{margin:0 0 12px 0;font-size:14px;font-weight:600;color:var(--nf-text);letter-spacing:0.3px;text-shadow:var(--nf-shadow-text)}.nf-hint{margin:0 0 12px 0;font-size:12px;color:var(--nf-text-sec);line-height:1.6;text-shadow:var(--nf-shadow-text)}.nf-hint-text{font-size:11px;color:var(--nf-text-sec);margin:8px 0 0 0;padding:10px 14px;background:linear-gradient(135deg,var(--nf-hover),transparent);border-radius:10px;line-height:1.7;border:1px solid var(--nf-border);text-shadow:var(--nf-shadow-text)}.nf-card{background:var(--nf-glass);border:1px solid var(--nf-border);border-radius:14px;padding:6px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:all 0.3s ease}.nf-card:hover{box-shadow:0 6px 20px rgba(0,0,0,0.08);border-color:rgba(0,122,255,0.2)}

/* 新增：选项卡片样式 - 增强可读性 */
.nf-option-card{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:12px;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);background:var(--nf-card-bg);border:1px solid transparent;margin-bottom:6px;position:relative;overflow:hidden}.nf-option-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,122,255,0.05),transparent);opacity:0;transition:opacity 0.3s ease}.nf-option-card:last-child{margin-bottom:0}.nf-option-card:hover{background:var(--nf-hover);border-color:var(--nf-accent);transform:translateY(-2px) scale(1.01);box-shadow:0 8px 24px rgba(0,0,0,0.1)}.nf-option-card:hover::before{opacity:1}.nf-option-card:active{transform:translateY(0) scale(0.99)}.nf-option-emoji{font-size:24px;flex-shrink:0;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--nf-hover),var(--nf-glass));border-radius:12px;transition:transform 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.06)}.nf-option-card:hover .nf-option-emoji{transform:scale(1.1) rotate(-3deg)}.nf-option-content{flex:1;min-width:0}.nf-option-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px}.nf-option-title{font-weight:600;font-size:14px;color:var(--nf-text);text-shadow:var(--nf-shadow-text)}.nf-option-desc{display:block;font-size:12px;color:var(--nf-text-sec);line-height:1.5;text-shadow:var(--nf-shadow-text)}
.nf-option-card input{display:none}.nf-option-card .nf-switch{position:relative;width:51px;height:31px;background:var(--nf-border);border-radius:16px;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);flex-shrink:0;box-shadow:inset 0 2px 4px rgba(0,0,0,0.1)}.nf-option-card .nf-switch::after{content:'';position:absolute;top:2px;left:2px;width:27px;height:27px;background:linear-gradient(180deg,#fff,#f8f8f8);border-radius:50%;transition:transform 0.35s cubic-bezier(0.68,-0.55,0.265,1.55);box-shadow:0 3px 8px rgba(0,0,0,0.2)}.nf-option-card input:checked+.nf-switch{background:linear-gradient(135deg,#34c759,#30b350);box-shadow:0 0 12px rgba(52,199,89,0.4)}.nf-option-card input:checked+.nf-switch::after{transform:translateX(20px)}

/* 保留原有switch样式兼容 */
.nf-switch-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:10px;cursor:pointer;transition:all 0.25s ease}.nf-switch-row:hover{background:var(--nf-hover)}.nf-switch-row input{display:none}.nf-switch-info{flex:1;margin-right:12px}.nf-switch-title{display:block;font-weight:500;color:var(--nf-text);text-shadow:var(--nf-shadow-text)}.nf-switch-desc{display:block;font-size:12px;color:var(--nf-text-sec);margin-top:2px;text-shadow:var(--nf-shadow-text)}.nf-switch{position:relative;width:51px;height:31px;background:var(--nf-border);border-radius:16px;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);flex-shrink:0}.nf-switch::after{content:'';position:absolute;top:2px;left:2px;width:27px;height:27px;background:#fff;border-radius:50%;transition:transform 0.35s cubic-bezier(0.68,-0.55,0.265,1.55);box-shadow:0 2px 4px rgba(0,0,0,0.2)}.nf-switch-row input:checked+.nf-switch{background:#34c759}.nf-switch-row input:checked+.nf-switch::after{transform:translateX(20px)}

/* 带图标的选择器和输入框 */
.nf-select-wrapper{display:flex;align-items:center;gap:10px;padding:4px 8px}.nf-select-icon,.nf-input-icon,.nf-textarea-icon,.nf-slider-icon{font-size:18px;flex-shrink:0}.nf-textarea-wrapper{display:flex;gap:10px;padding:8px}.nf-textarea-wrapper .nf-textarea{flex:1}

.nf-select,.nf-input,.nf-textarea{width:100%;padding:10px 12px;border:1px solid var(--nf-border);border-radius:10px;font-size:14px;background:var(--nf-bg);color:var(--nf-text);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);text-shadow:var(--nf-shadow-text)}.nf-select:focus,.nf-input:focus,.nf-textarea:focus{outline:none;border-color:var(--nf-accent);box-shadow:0 0 0 4px rgba(0,122,255,0.15);transform:translateY(-1px)}#nf-settings-panel .nf-textarea{font-size:13px;resize:vertical;font-family:inherit !important}#nf-settings-panel .nf-textarea.nf-code,#nf-settings-panel .nf-input.nf-code{font-family:"Noto Sans Mono",ui-monospace,SFMono-Regular,Consolas,monospace !important;font-size:12px}.nf-slider-row{display:flex;align-items:center;gap:12px;padding:10px 14px}.nf-slider-row label{min-width:100px;font-size:13px;color:var(--nf-text);text-shadow:var(--nf-shadow-text)}.nf-slider-row input[type="range"]{flex:1;height:6px;-webkit-appearance:none;background:var(--nf-border);border-radius:3px}.nf-slider-row input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#fff;border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.2)}.nf-slider-value{min-width:40px;text-align:right;font-size:13px;color:var(--nf-accent);font-weight:600}.nf-input-row{display:flex;align-items:center;gap:12px;padding:10px 14px}.nf-input-row label{font-size:13px;white-space:nowrap;text-shadow:var(--nf-shadow-text)}.nf-input-row .nf-number-input{width:100px;flex:0 0 auto}.nf-btn-row{display:flex;flex-wrap:wrap;gap:8px;padding:14px}.nf-footer{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:var(--nf-glass);border-top:1px solid var(--nf-border)}.nf-version{font-size:12px;color:var(--nf-text-sec);text-shadow:var(--nf-shadow-text)}.nf-actions{display:flex;gap:10px}.nf-btn{padding:10px 18px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;border:1px solid var(--nf-border);background:var(--nf-bg);color:var(--nf-text);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden;text-shadow:var(--nf-shadow-text)}.nf-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.1),transparent);opacity:0;transition:opacity 0.3s ease}.nf-btn:hover{background:var(--nf-hover);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}.nf-btn:hover::before{opacity:1}.nf-btn:active{transform:translateY(0) scale(0.98)}.nf-btn-primary{background:linear-gradient(135deg,var(--nf-accent),#0051d5);color:#fff;border:none;box-shadow:0 4px 14px rgba(0,122,255,0.3)}.nf-btn-primary:hover{opacity:0.95;box-shadow:0 6px 20px rgba(0,122,255,0.4);transform:translateY(-2px)}.nf-btn-danger{color:#ff3b30;border-color:rgba(255,59,48,0.3)}.nf-btn-danger:hover{background:rgba(255,59,48,0.12);border-color:rgba(255,59,48,0.5)}.nf-btn-sm{padding:6px 12px;font-size:12px}

/* 关于卡片 */
.nf-about-card{padding:20px;text-align:center;background:linear-gradient(135deg,var(--nf-glass),var(--nf-hover))}.nf-about-title{font-size:16px;font-weight:600;margin-bottom:8px;text-shadow:var(--nf-shadow-text)}.nf-about-version{font-size:13px;color:var(--nf-accent);margin-bottom:10px;font-weight:500}.nf-about-hint{font-size:12px;color:var(--nf-text-sec);text-shadow:var(--nf-shadow-text)}

.nf-font-groups-toolbar{display:flex;gap:8px;margin-bottom:12px}.nf-font-groups-container{max-height:400px;overflow-y:auto;border:1px solid var(--nf-border);border-radius:14px;padding:8px}.nf-font-category{margin-bottom:12px}.nf-font-category:last-child{margin-bottom:0}.nf-font-category-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,var(--nf-glass),var(--nf-hover));border-radius:10px;margin-bottom:8px;box-shadow:0 2px 6px rgba(0,0,0,0.04)}.nf-font-category-name{font-weight:600;font-size:13px;text-shadow:var(--nf-shadow-text)}.nf-font-category-toggle{width:26px;height:26px;border:none;background:var(--nf-hover);border-radius:50%;cursor:pointer;color:var(--nf-text-sec);font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}.nf-font-category-toggle:hover{background:var(--nf-accent);color:#fff;transform:rotate(180deg)}.nf-font-category-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:6px;padding:0 4px}.nf-font-group-item{display:flex;align-items:center;gap:6px;padding:10px 12px;border-radius:10px;cursor:pointer;font-size:12px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);background:var(--nf-hover);border:1px solid transparent;text-shadow:var(--nf-shadow-text)}.nf-font-group-item:hover{background:var(--nf-border);border-color:var(--nf-accent);transform:translateX(4px)}.nf-font-group-item input{accent-color:var(--nf-accent);margin:0}.nf-font-group-emoji{font-size:14px}.nf-font-group-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nf-font-group-count{font-size:10px;color:var(--nf-text-sec);background:var(--nf-border);padding:2px 8px;border-radius:10px}

/* 大字库配置面板样式 */
.nf-exthan-list{border:1px solid var(--nf-border);border-radius:14px;padding:8px;max-height:350px;overflow-y:auto}.nf-exthan-item{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;background:var(--nf-hover);margin-bottom:6px;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);border:1px solid transparent}.nf-exthan-item:last-child{margin-bottom:0}.nf-exthan-item:hover{background:var(--nf-border);border-color:var(--nf-accent);transform:translateX(4px)}.nf-exthan-item.dragging{opacity:0.5;background:var(--nf-accent);border-color:var(--nf-accent)}.nf-exthan-item.drag-over{border-color:var(--nf-accent);box-shadow:0 0 0 2px rgba(0,122,255,0.3)}.nf-exthan-drag{cursor:grab;color:var(--nf-text-sec);font-size:14px;user-select:none;padding:4px}.nf-exthan-drag:active{cursor:grabbing}.nf-exthan-arrows{display:flex;flex-direction:column;gap:2px}.nf-exthan-up,.nf-exthan-down{width:20px;height:16px;padding:0;border:1px solid var(--nf-border);border-radius:4px;background:var(--nf-bg);color:var(--nf-text-sec);font-size:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s}.nf-exthan-up:hover,.nf-exthan-down:hover{background:var(--nf-accent);color:#fff;border-color:var(--nf-accent)}.nf-exthan-up:disabled,.nf-exthan-down:disabled{opacity:0.3;cursor:not-allowed}.nf-exthan-label{display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;min-width:0}.nf-exthan-checkbox{accent-color:var(--nf-accent);width:16px;height:16px;margin:0;flex-shrink:0}.nf-exthan-emoji{font-size:16px;flex-shrink:0}.nf-exthan-name{font-weight:500;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:var(--nf-shadow-text)}.nf-exthan-mode{padding:4px 8px;border:1px solid var(--nf-border);border-radius:6px;background:var(--nf-bg);color:var(--nf-text);font-size:11px;cursor:pointer;flex-shrink:0}.nf-exthan-mode:focus{outline:none;border-color:var(--nf-accent)}.nf-exthan-mode option:disabled{color:var(--nf-text-sec)}.nf-exthan-config{padding:4px 8px;border:1px solid var(--nf-border);border-radius:6px;background:var(--nf-bg);color:var(--nf-text);font-size:12px;cursor:pointer;flex-shrink:0;transition:all 0.2s}.nf-exthan-config:hover{background:var(--nf-accent);color:#fff;border-color:var(--nf-accent)}.nf-exthan-info{display:flex;flex-direction:column;gap:8px;padding:12px}.nf-exthan-info-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--nf-hover);border-radius:10px}.nf-exthan-info-icon{font-size:20px;flex-shrink:0}.nf-exthan-info-item b{display:block;margin-bottom:2px;font-size:13px;text-shadow:var(--nf-shadow-text)}.nf-exthan-info-item small{font-size:11px;color:var(--nf-text-sec);line-height:1.5;text-shadow:var(--nf-shadow-text)}
/* 大字库详细配置弹窗 */
.nf-exthan-modal{position:fixed;inset:0;z-index:2147483648;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.25s ease}.nf-exthan-modal.nf-visible{opacity:1}.nf-exthan-modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px)}.nf-exthan-modal-content{position:relative;width:90%;max-width:500px;max-height:80vh;background:var(--nf-bg);border-radius:16px;border:1px solid var(--nf-border);box-shadow:0 20px 60px rgba(0,0,0,0.35);overflow:hidden;display:flex;flex-direction:column;transform:scale(0.9);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1)}.nf-exthan-modal.nf-visible .nf-exthan-modal-content{transform:scale(1)}.nf-exthan-modal-header{padding:16px 20px;background:var(--nf-glass);border-bottom:1px solid var(--nf-border);display:flex;align-items:center;justify-content:space-between}.nf-exthan-modal-header h3{margin:0;font-size:16px;text-shadow:var(--nf-shadow-text)}.nf-exthan-modal-close{width:28px;height:28px;border:none;background:var(--nf-hover);border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;color:var(--nf-text-sec);transition:all 0.25s ease}.nf-exthan-modal-close:hover{background:rgba(255,59,48,0.15);color:#ff3b30;transform:rotate(90deg)}.nf-exthan-modal-body{padding:20px;overflow-y:auto;flex:1}.nf-exthan-modal-section{margin-bottom:16px}.nf-exthan-modal-section:last-child{margin-bottom:0}.nf-exthan-modal-section label{display:block;font-weight:500;margin-bottom:6px;font-size:13px;text-shadow:var(--nf-shadow-text)}.nf-exthan-modal-section input,.nf-exthan-modal-section textarea{width:100%;padding:10px 12px;border:1px solid var(--nf-border);border-radius:8px;background:var(--nf-bg);color:var(--nf-text);font-size:13px;font-family:inherit}#nf-settings-panel .nf-exthan-modal-section textarea{min-height:80px;resize:vertical}#nf-settings-panel .nf-exthan-modal-section textarea.nf-code{font-family:"Noto Sans Mono",ui-monospace,monospace !important;font-size:12px}.nf-exthan-modal-section input:focus,.nf-exthan-modal-section textarea:focus{outline:none;border-color:var(--nf-accent);box-shadow:0 0 0 3px rgba(0,122,255,0.15)}.nf-exthan-modal-section small{display:block;margin-top:4px;font-size:11px;color:var(--nf-text-sec);text-shadow:var(--nf-shadow-text)}.nf-exthan-modal-footer{padding:16px 20px;background:var(--nf-glass);border-top:1px solid var(--nf-border);display:flex;justify-content:flex-end;gap:10px}

@media(max-width:768px){.nf-panel{width:100%;height:100%;max-height:100vh;border-radius:0;top:0;left:0;transform:none}.nf-body{flex-direction:column !important}.nf-mobile-tabs{display:flex !important;flex-shrink:0}.nf-sidebar{display:none !important;width:0 !important}.nf-content{padding:16px;flex:1;width:100% !important}.nf-font-category-items{grid-template-columns:repeat(2,1fr)}.nf-header,.nf-footer{padding:12px 16px}.nf-option-card{padding:12px}.nf-custom-select{max-width:100%}.nf-select-dropdown{max-height:50vh}}

/* ===== 自定义下拉选择器样式 ===== */
.nf-custom-select{position:relative;width:100%;z-index:1}
.nf-custom-select.nf-select-open{z-index:9999}
.nf-section.nf-section-dropdown-open{z-index:9999;position:relative}
.nf-card.nf-card-dropdown-open{overflow:visible;z-index:9999;position:relative}
.nf-disabled{opacity:0.5 !important;pointer-events:none !important}
.nf-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border:1px solid var(--nf-border);border-radius:10px;background:var(--nf-bg);color:var(--nf-text);font-size:14px;cursor:pointer;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);user-select:none}
.nf-select-trigger:hover{border-color:var(--nf-accent);background:var(--nf-hover)}
.nf-select-trigger.active{border-color:var(--nf-accent);box-shadow:0 0 0 3px rgba(0,122,255,0.15);border-radius:10px 10px 0 0}
.nf-select-value{display:flex;align-items:center;gap:8px;flex:1;overflow:hidden}
.nf-select-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nf-select-arrow{width:20px;height:20px;display:flex;align-items:center;justify-content:center;color:var(--nf-text-sec);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1)}
.nf-select-trigger.active .nf-select-arrow{transform:rotate(180deg);color:var(--nf-accent)}
.nf-select-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:-1px;background:var(--nf-bg);border:1px solid var(--nf-accent);border-top:none;border-radius:0 0 10px 10px;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:9999;max-height:240px;overflow-y:auto;overflow-x:hidden;opacity:0;visibility:hidden;transform:translateY(-8px);transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.nf-select-dropdown.show{opacity:1;visibility:visible;transform:translateY(0)}
.nf-select-option{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:all 0.15s ease;border-left:3px solid transparent}
.nf-select-option:hover{background:var(--nf-hover);border-left-color:var(--nf-accent)}
.nf-select-option.selected{background:rgba(0,122,255,0.1);border-left-color:var(--nf-accent);color:var(--nf-accent);font-weight:500}
.nf-select-option:last-child{border-radius:0 0 8px 8px}
.nf-select-option-emoji{font-size:16px;flex-shrink:0}
.nf-select-option-text{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* 隐藏原生select */
.nf-custom-select select.nf-select-hidden{position:absolute;opacity:0;pointer-events:none;width:0;height:0}

/* ===== 增强动画效果 ===== */
@keyframes nf-fadeIn{from{opacity:0}to{opacity:1}}
@keyframes nf-slideUp{from{opacity:0;transform:translate(-50%,-48%)}to{opacity:1;transform:translate(-50%,-50%)}}
@keyframes nf-scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
@keyframes nf-fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes nf-sectionFadeIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes nf-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes nf-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes nf-ripple{0%{transform:scale(0);opacity:0.5}100%{transform:scale(2.5);opacity:0}}
@keyframes nf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes nf-glow{0%,100%{box-shadow:0 0 5px rgba(0,122,255,0.3)}50%{box-shadow:0 0 15px rgba(0,122,255,0.5)}}
@keyframes nf-slideInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes nf-bounceIn{0%{opacity:0;transform:scale(0.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(0.9)}100%{transform:scale(1)}}

/* 加载骨架屏效果 */
@keyframes nf-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.nf-skeleton{background:linear-gradient(90deg,var(--nf-hover) 25%,var(--nf-border) 50%,var(--nf-hover) 75%);background-size:200% 100%;animation:nf-shimmer 1.5s infinite}

/* 微交互动画 */
.nf-card{transition:transform 0.3s cubic-bezier(0.4,0,0.2,1),box-shadow 0.3s ease,border-color 0.3s ease}
.nf-btn{position:relative;overflow:hidden;transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.nf-btn:active{transform:scale(0.96)}
.nf-btn-primary{animation:nf-glow 2s ease-in-out infinite}
.nf-btn-primary:hover{animation:none}
.nf-nav-item{transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.nf-nav-item:active{transform:scale(0.97) translateX(2px)}
.nf-mobile-tab{transition:all 0.25s ease}
.nf-slider-row input[type="range"]::-webkit-slider-thumb{transition:transform 0.2s cubic-bezier(0.4,0,0.2,1),box-shadow 0.2s ease}
.nf-slider-row input[type="range"]::-webkit-slider-thumb:hover{transform:scale(1.15);box-shadow:0 3px 10px rgba(0,0,0,0.3)}
.nf-slider-row input[type="range"]:active::-webkit-slider-thumb{transform:scale(0.95)}
.nf-font-group-item{transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
.nf-font-group-item:active{transform:scale(0.97) translateX(2px)}

/* 涟漪效果 */
.nf-ripple-effect{position:absolute;border-radius:50%;background:rgba(255,255,255,0.5);pointer-events:none;animation:nf-ripple 0.6s ease-out forwards}

/* 高对比度模式支持 */
@media(prefers-contrast:high){#nf-settings-panel{--nf-text:#000;--nf-text-sec:#333;--nf-border:rgba(0,0,0,0.3);--nf-shadow-text:none}@media(prefers-color-scheme:dark){#nf-settings-panel{--nf-text:#fff;--nf-text-sec:#ccc;--nf-border:rgba(255,255,255,0.4)}}}

/* 减少动画模式支持 */
@media(prefers-reduced-motion:reduce){#nf-settings-panel,#nf-settings-panel *{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important}}`;
            document.head.appendChild(style);
        }

        // ========== 性能优化：延迟添加DOM并使用动画显示 ==========
        document.body.appendChild(panel);

        // 使用requestAnimationFrame优化渲染
        requestAnimationFrame(() => {
            // 添加可见性类触发动画
            panel.classList.add('nf-visible');

            // 延迟绑定事件，避免阻塞渲染
            requestAnimationFrame(() => {
                bindPanelEvents(panel);

                // 为section添加动画延迟索引
                panel.querySelectorAll('.nf-section').forEach((section, index) => {
                    section.style.setProperty('--section-index', index);
                });
            });
        });
    }

    function bindPanelEvents(panel) {
        // ========== 自定义下拉选择器初始化 ==========
        function initCustomSelects() {
            panel.querySelectorAll('.nf-custom-select').forEach(container => {
                const trigger = container.querySelector('.nf-select-trigger');
                const dropdown = container.querySelector('.nf-select-dropdown');
                const hiddenSelect = container.querySelector('select');
                const valueDisplay = container.querySelector('.nf-select-text');
                const options = container.querySelectorAll('.nf-select-option');

                // 设置初始值
                const currentValue = hiddenSelect.value;
                options.forEach(opt => {
                    if (opt.dataset.value === currentValue) {
                        opt.classList.add('selected');
                        const emoji = opt.querySelector('.nf-select-option-emoji')?.textContent || '';
                        const text = opt.querySelector('.nf-select-option-text')?.textContent || '';
                        valueDisplay.textContent = emoji + ' ' + text;
                    }
                });

                // 点击触发器
                trigger.onclick = (e) => {
                    e.stopPropagation();
                    const isOpen = trigger.classList.contains('active');

                    // 关闭其他所有下拉框
                    panel.querySelectorAll('.nf-select-trigger.active').forEach(t => {
                        if (t !== trigger) {
                            t.classList.remove('active');
                            const otherContainer = t.closest('.nf-custom-select');
                            otherContainer.classList.remove('nf-select-open');
                            otherContainer.querySelector('.nf-select-dropdown').classList.remove('show');
                            // 移除父级的z-index提升
                            const otherSection = otherContainer.closest('.nf-section');
                            if (otherSection) otherSection.classList.remove('nf-section-dropdown-open');
                            const otherCard = otherContainer.closest('.nf-card');
                            if (otherCard) otherCard.classList.remove('nf-card-dropdown-open');
                        }
                    });

                    if (isOpen) {
                        trigger.classList.remove('active');
                        dropdown.classList.remove('show');
                        container.classList.remove('nf-select-open');
                        // 移除父级的z-index提升
                        const section = container.closest('.nf-section');
                        if (section) section.classList.remove('nf-section-dropdown-open');
                        const card = container.closest('.nf-card');
                        if (card) card.classList.remove('nf-card-dropdown-open');
                    } else {
                        trigger.classList.add('active');
                        dropdown.classList.add('show');
                        container.classList.add('nf-select-open');
                        // 给父级添加z-index提升
                        const section = container.closest('.nf-section');
                        if (section) section.classList.add('nf-section-dropdown-open');
                        const card = container.closest('.nf-card');
                        if (card) card.classList.add('nf-card-dropdown-open');
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
                        container.classList.remove('nf-select-open');
                        const section = container.closest('.nf-section');
                        if (section) section.classList.remove('nf-section-dropdown-open');
                        const card = container.closest('.nf-card');
                        if (card) card.classList.remove('nf-card-dropdown-open');
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
                        const emoji = opt.querySelector('.nf-select-option-emoji')?.textContent || '';
                        const text = opt.querySelector('.nf-select-option-text')?.textContent || '';
                        valueDisplay.textContent = emoji + ' ' + text;

                        // 更新隐藏的select
                        hiddenSelect.value = value;
                        hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));

                        // 关闭下拉框
                        trigger.classList.remove('active');
                        dropdown.classList.remove('show');
                        container.classList.remove('nf-select-open');
                        const section = container.closest('.nf-section');
                        if (section) section.classList.remove('nf-section-dropdown-open');
                        const card = container.closest('.nf-card');
                        if (card) card.classList.remove('nf-card-dropdown-open');
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
                if (!e.target.closest('.nf-custom-select')) {
                    panel.querySelectorAll('.nf-select-trigger.active').forEach(t => {
                        t.classList.remove('active');
                        const selectContainer = t.closest('.nf-custom-select');
                        selectContainer.classList.remove('nf-select-open');
                        selectContainer.querySelector('.nf-select-dropdown').classList.remove('show');
                        const section = selectContainer.closest('.nf-section');
                        if (section) section.classList.remove('nf-section-dropdown-open');
                        const card = selectContainer.closest('.nf-card');
                        if (card) card.classList.remove('nf-card-dropdown-open');
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
            ripple.classList.add('nf-ripple-effect');
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
            element.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        }

        // 为按钮添加涟漪效果
        panel.querySelectorAll('.nf-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                createRipple(e, this);
            });
        });

        // ========== 关闭面板函数（带动画） ==========
        const closePanel = () => {
            panel.classList.remove('nf-visible');
            setTimeout(() => panel.remove(), 300); // 等待动画完成后移除
        };

        panel.querySelector('.nf-close').onclick = closePanel;
        panel.querySelector('.nf-overlay').onclick = closePanel;
        panel.querySelector('#nf-cancel').onclick = closePanel;

        // 支持 ESC 键关闭面板
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closePanel();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        const switchTab = (tabName) => {
            panel.querySelectorAll('.nf-nav-item, .nf-mobile-tab').forEach(t => t.classList.remove('active'));
            panel.querySelectorAll('.nf-tab-content').forEach(c => c.classList.remove('active'));
            panel.querySelectorAll(`[data-tab="${tabName}"]`).forEach(t => t.classList.add('active'));
        };
        panel.querySelectorAll('.nf-nav-item, .nf-mobile-tab').forEach(tab => { tab.onclick = () => switchTab(tab.dataset.tab); });

        // ========== 数值输入验证逻辑 ==========
        const numberInputs = panel.querySelectorAll('.nf-number-input');
        const saveBtn = panel.querySelector('#nf-save');

        function validateAllNumbers() {
            let allValid = true;
            numberInputs.forEach(input => {
                // 检查输入框是否可见（父级row未隐藏且section未被禁用）
                const row = input.closest('.nf-input-row');
                const section = input.closest('.nf-section');
                const isVisible = row && row.style.display !== 'none' &&
                                  section && !section.classList.contains('nf-disabled');

                const value = parseFloat(input.value);
                const min = parseFloat(input.min) || 0;
                const isInvalid = isVisible && (isNaN(value) || value < min);

                // 查找或创建错误提示
                let errorHint = input.parentElement.querySelector('.nf-number-error');
                if (isInvalid) {
                    allValid = false;
                    input.style.borderColor = '#ff3b30';
                    if (!errorHint) {
                        errorHint = document.createElement('span');
                        errorHint.className = 'nf-number-error';
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
            const weightProtectionMode = panel.querySelector('#nf-weightProtectionMode');
            const weightProtectionRatioInput = panel.querySelector('#nf-weightProtectionRatio');
            const weightProtectionRatioRow = panel.querySelector('#nf-weightProtectionRatioRow');
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
            let globalError = panel.querySelector('#nf-global-number-error');
            if (!allValid) {
                if (!globalError) {
                    globalError = document.createElement('div');
                    globalError.id = 'nf-global-number-error';
                    globalError.className = 'nf-hint-text';
                    globalError.style.cssText = 'background:rgba(255,59,48,0.15);border-color:rgba(255,59,48,0.3);margin:12px 24px;';
                    globalError.innerHTML = '⚠️ <b>输入数值无效</b>：请输入大于 0 的数字。';
                    const footer = panel.querySelector('.nf-footer');
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
        const mainSwitch = panel.querySelector('#nf-enabled');
        const contentArea = panel.querySelector('.nf-content');
        const sidebarArea = panel.querySelector('.nf-sidebar');

        function updateDisabledState() {
            const isEnabled = mainSwitch.checked;
            const allTabs = contentArea.querySelectorAll('.nf-tab-content:not([data-tab="basic"])');
            const navItems = sidebarArea.querySelectorAll('.nf-nav-item:not([data-tab="basic"])');
            const basicTabInputs = contentArea.querySelectorAll('.nf-tab-content[data-tab="basic"] input:not(#nf-enabled), .nf-tab-content[data-tab="basic"] select');

            allTabs.forEach(tab => { tab.style.cssText = isEnabled ? '' : 'opacity:0.4;pointer-events:none'; });
            navItems.forEach(nav => { nav.style.cssText = isEnabled ? '' : 'opacity:0.4;pointer-events:none'; });
            basicTabInputs.forEach(input => { input.disabled = !isEnabled; });
        }

        if (mainSwitch) {
            mainSwitch.onchange = updateDisabledState;
            updateDisabledState();
        }

        // 字体组快捷按钮
        const fontSelectAll = panel.querySelector('#nf-font-select-all');
        const fontSelectNone = panel.querySelector('#nf-font-select-none');
        const fontSelectCommon = panel.querySelector('#nf-font-select-common');

        if (fontSelectAll) {
            fontSelectAll.onclick = () => {
                panel.querySelectorAll('.nf-font-group-item input').forEach(cb => cb.checked = true);
            };
        }
        if (fontSelectNone) {
            fontSelectNone.onclick = () => {
                panel.querySelectorAll('.nf-font-group-item input').forEach(cb => cb.checked = false);
            };
        }
        if (fontSelectCommon) {
            fontSelectCommon.onclick = () => {
                // 常用：emoji, basic, cjk, symbols
                const commonGroups = ['g0', 'g1', 'g2', 'g17'];
                panel.querySelectorAll('.nf-font-group-item input').forEach(cb => {
                    cb.checked = commonGroups.includes(cb.dataset.group);
                });
            };
        }

        // 分类全选/取消
        panel.querySelectorAll('.nf-font-category-toggle').forEach(btn => {
            btn.onclick = () => {
                const category = btn.dataset.category;
                const container = btn.closest('.nf-font-category');
                const checkboxes = container.querySelectorAll('input[type="checkbox"]');
                const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                checkboxes.forEach(cb => cb.checked = !allChecked);
            };
        });

        // 字重模拟开关和方式切换
        const synthesisEnabled = panel.querySelector('#nf-synthesisEnabled');
        const synthesisMethod = panel.querySelector('#nf-synthesisMethod');
        const methodSection = panel.querySelector('#nf-synthesisMethodSection');
        const paramsSection = panel.querySelector('#nf-synthesisParamsSection');
        const paramCompensate = panel.querySelector('#nf-paramCompensate');
        const paramShadowX = panel.querySelector('#nf-paramShadowX');
        const paramShadowY = panel.querySelector('#nf-paramShadowY');
        const paramShadowBlur = panel.querySelector('#nf-paramShadowBlur');
        const paramHint = panel.querySelector('#nf-paramHint');
        const synthesisTabContent = panel.querySelector('.nf-tab-content[data-tab="synthesis"]');

        function updateSynthesisUI() {
            const enabled = synthesisEnabled?.checked;
            const method = synthesisMethod?.value || 'synthesis';

            // 使用CSS类来控制禁用状态（避免被动画覆盖）
            if (methodSection) {
                methodSection.classList.toggle('nf-disabled', !enabled);
            }
            if (paramsSection) {
                paramsSection.classList.toggle('nf-disabled', !enabled);
            }

            // 显示或隐藏禁用提示
            let synthesisHint = panel.querySelector('#nf-synthesis-disabled-hint');
            if (!enabled) {
                if (!synthesisHint && synthesisTabContent) {
                    synthesisHint = document.createElement('div');
                    synthesisHint.id = 'nf-synthesis-disabled-hint';
                    synthesisHint.className = 'nf-hint-text';
                    synthesisHint.style.cssText = 'background:rgba(255,149,0,0.15);border-color:rgba(255,149,0,0.3);margin-bottom:16px;';
                    synthesisHint.innerHTML = '⚠️ <b>字重模拟已关闭</b>：下方的模拟方式和参数调整选项已被禁用。开启「启用字重模拟」后可配置这些选项。';
                    const firstSection = synthesisTabContent.querySelector('.nf-section');
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
        const forceDefaultCJKSwitch = panel.querySelector('#nf-forceDefaultCJK');
        const fineDetectionSwitch = panel.querySelector('#nf-enableFineDetection');
        const contentDetectionSwitch = panel.querySelector('#nf-enableContentDetection');
        const thresholdSection = panel.querySelector('#nf-thresholdSection');
        const fineDetectionCard = fineDetectionSwitch?.closest('.nf-option-card');
        const contentDetectionCard = contentDetectionSwitch?.closest('.nf-option-card');
        // 获取语言检测标签页中除强制CJK之外的所有内容
        const languageTabContent = panel.querySelector('.nf-tab-content[data-tab="language"]');

        // 更新强制CJK模式下的UI状态
        function updateForceDefaultCJKUI() {
            const isForced = forceDefaultCJKSwitch?.checked;

            // 禁用精细检测和内容检测选项（使用CSS类）
            if (fineDetectionCard) {
                fineDetectionCard.classList.toggle('nf-disabled', isForced);
            }
            if (contentDetectionCard) {
                contentDetectionCard.classList.toggle('nf-disabled', isForced);
            }
            if (thresholdSection) {
                // 如果强制CJK开启，或者内容检测关闭，都禁用阈值设置
                const shouldDisable = isForced || !contentDetectionSwitch?.checked;
                thresholdSection.classList.toggle('nf-disabled', shouldDisable);
            }

            // 在语言检测标签页显示提示信息
            let forceHint = panel.querySelector('#nf-force-cjk-hint');
            if (isForced) {
                if (!forceHint && languageTabContent) {
                    forceHint = document.createElement('div');
                    forceHint.id = 'nf-force-cjk-hint';
                    forceHint.className = 'nf-hint-text';
                    forceHint.style.cssText = 'background:rgba(255,149,0,0.15);border-color:rgba(255,149,0,0.3);margin-bottom:16px;';
                    forceHint.innerHTML = '⚠️ <b>强制模式已启用</b>：下方的语言检测选项已被禁用，所有 CJK 内容将统一使用「基础设置」中配置的默认语言。';
                    const firstSection = languageTabContent.querySelector('.nf-section');
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
                thresholdSection.classList.toggle('nf-disabled', shouldDisable);
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
        const enableEmojiFontSwitch = panel.querySelector('#nf-enableEmojiFont');
        const emojiStackSection = panel.querySelector('#nf-emojiStackSection');
        const emojiTabContent = panel.querySelector('.nf-tab-content[data-tab="emoji"]');

        function updateEmojiFontUI() {
            const enabled = enableEmojiFontSwitch?.checked;
            if (emojiStackSection) {
                emojiStackSection.classList.toggle('nf-disabled', !enabled);
            }

            // 显示或隐藏禁用提示
            let emojiHint = panel.querySelector('#nf-emoji-disabled-hint');
            if (!enabled) {
                if (!emojiHint && emojiTabContent) {
                    emojiHint = document.createElement('div');
                    emojiHint.id = 'nf-emoji-disabled-hint';
                    emojiHint.className = 'nf-hint-text';
                    emojiHint.style.cssText = 'background:rgba(255,149,0,0.15);border-color:rgba(255,149,0,0.3);margin-bottom:16px;';
                    emojiHint.innerHTML = '⚠️ <b>Emoji 字体已关闭</b>：下方的字体栈优先级选项已被禁用。开启「启用 Emoji 字体」后可配置该选项。';
                    const firstSection = emojiTabContent.querySelector('.nf-section');
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

        // 权重保护模式切换
        const weightProtectionMode = panel.querySelector('#nf-weightProtectionMode');
        const weightProtectionRatioRow = panel.querySelector('#nf-weightProtectionRatioRow');
        const weightProtectionRatioInput = panel.querySelector('#nf-weightProtectionRatio');
        const weightProtectionError = panel.querySelector('#nf-weightProtectionError');

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

        panel.querySelector('#nf-export').onclick = () => {
            const blob = new Blob([JSON.stringify(SETTINGS, null, 2)], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'noto-font-settings.json'; a.click();
        };

        panel.querySelector('#nf-import').onclick = () => panel.querySelector('#nf-import-file').click();
        panel.querySelector('#nf-import-file').onchange = (e) => {
            const file = e.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { try { const imported = JSON.parse(ev.target.result); saveSettings(deepMerge(DEFAULT_SETTINGS, imported)); location.reload(); } catch { alert('导入失败：无效的 JSON 文件'); } };
            reader.readAsText(file);
        };

        panel.querySelector('#nf-reset').onclick = () => { if (confirm('确定重置所有设置为默认值？')) { saveSettings(DEFAULT_SETTINGS); location.reload(); } };

        panel.querySelector('#nf-save').onclick = () => {
            try {
                console.log('[NotoFont] 保存按钮被点击');

                // 收集字体组设置
                const fontGroupEnabled = {};
                panel.querySelectorAll('.nf-font-group-item input').forEach(cb => {
                    fontGroupEnabled[cb.dataset.group] = cb.checked;
                });

                // 【新增】收集防抖延迟设置
                let inputDebounceDelay = parseInt(panel.querySelector('#nf-inputDebounceDelay').value) || 50;

            const newSettings = {
                enabled: panel.querySelector('#nf-enabled').checked,
                enableSansReplacement: panel.querySelector('#nf-enableSansReplacement').checked,
                enableSerifReplacement: panel.querySelector('#nf-enableSerifReplacement').checked,
                enableMonoReplacement: panel.querySelector('#nf-enableMonoReplacement').checked,
                defaultCJKLang: panel.querySelector('#nf-defaultCJKLang').value,
                forceDefaultCJK: panel.querySelector('#nf-forceDefaultCJK').checked,
                fontDisplay: panel.querySelector('#nf-fontDisplay').value,
                enableFineDetection: panel.querySelector('#nf-enableFineDetection').checked,
                enableContentDetection: panel.querySelector('#nf-enableContentDetection').checked,
                inputLangMode: panel.querySelector('#nf-inputLangMode').value,
                mixedScriptThreshold: parseInt(panel.querySelector('#nf-mixedScriptThreshold').value),
                inputMixedScriptThreshold: parseInt(panel.querySelector('#nf-inputMixedScriptThreshold').value),
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
                    emojiInFontStack: panel.querySelector('#nf-emojiInFontStack')?.value || 'high'
                },
                weightProtection: {
                    enabled: panel.querySelector('#nf-weightProtectionMode').value !== 'disabled',
                    mode: panel.querySelector('#nf-weightProtectionMode').value,
                    ratio: Math.max(0.1, parseFloat(panel.querySelector('#nf-weightProtectionRatio').value) || 2.0),
                    applyToInput: panel.querySelector('#nf-weightProtectionApplyToInput')?.checked !== false
                },
                // ★★★ 修复：enableUnihanFallback 已弃用，统一使用 extendedHanFallback.enabled ★★★
                enableEmojiFont: panel.querySelector('#nf-enableEmojiFont').checked,
                // ★★★ v2.7.0: 简化大字库配置，只保存enabled开关 ★★★
                extendedHanFallback: {
                    enabled: panel.querySelector('#nf-extHanEnabled')?.checked !== false
                },
                customMonoFont: panel.querySelector('#nf-customMonoFont').value,
                customFontPriority: SETTINGS.customFontPriority,
                fontSynthesis: {
                    enabled: panel.querySelector('#nf-synthesisEnabled').checked,
                    method: panel.querySelector('#nf-synthesisMethod').value,
                    compensateWeight: parseFloat(panel.querySelector('#nf-compensateWeight').value),
                    shadowOffsetX: parseFloat(panel.querySelector('#nf-shadowOffsetX').value),
                    shadowOffsetY: parseFloat(panel.querySelector('#nf-shadowOffsetY').value),
                    shadowBlur: parseFloat(panel.querySelector('#nf-shadowBlur').value)
                },
                excludedDomains: panel.querySelector('#nf-excludedDomains').value.split('\n').map(s => s.trim()).filter(s => s),
                excludedTags: panel.querySelector('#nf-excludedTags').value.split('\n').map(s => s.trim()).filter(s => s),
                excludedSelectors: panel.querySelector('#nf-excludedSelectors').value.split('\n').map(s => s.trim()).filter(s => s),
                excludedClassPatterns: panel.querySelector('#nf-excludedClassPatterns').value.split(',').map(s => s.trim()).filter(s => s),
                inputSelectors: panel.querySelector('#nf-inputSelectors').value.split('\n').map(s => s.trim()).filter(s => s),
                debugMode: panel.querySelector('#nf-debugMode').checked,
                performanceMode: panel.querySelector('#nf-performanceMode').checked,
                cacheTimeout: parseInt(panel.querySelector('#nf-cacheTimeout').value) || 30000
            };

            console.log('[NotoFont] 准备保存设置:', newSettings);
            saveSettings(newSettings);
            console.log('[NotoFont] 设置已保存，准备刷新页面');
            location.reload();
            } catch (err) {
                console.error('[NotoFont] 保存时出错:', err);
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
        document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.shiftKey && e.key === 'F') { e.preventDefault(); createSettingsPanel(); } });
    }

    registerSettingsEntry();

    if (SETTINGS.debugMode) {
        window.__NotoFontReplacer = { settings: SETTINGS, openSettings: createSettingsPanel, reprocess: initProcess, version: '2.0', fontGroups: FONT_GROUP_DEFINITIONS, glyphDetector: GlyphDetector };
        console.log('[NotoFont] 调试模式已启用，可通过 window.__NotoFontReplacer 访问API');
    }

})();