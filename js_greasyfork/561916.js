// ==UserScript==
// @name         Linux.do 帖子导出到 Notion
// @namespace    https://linux.do/
// @version      1.1.6
// @description  导出 Linux.do 帖子到 Notion（支持筛选、图片引用、丰富格式、文件附件）
// @author       flobby
// @license      MIT
// @match        https://linux.do/t/*
// @match        https://linux.do/t/topic/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.notion.com
// @connect      *.amazonaws.com
// @connect      s3.amazonaws.com
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561916/Linuxdo%20%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BA%E5%88%B0%20Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/561916/Linuxdo%20%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BA%E5%88%B0%20Notion.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // -----------------------
    // 存储 key
    // -----------------------
    const K = {
        // 筛选相关
        RANGE_MODE: "ld_notion_range_mode",
        RANGE_START: "ld_notion_range_start",
        RANGE_END: "ld_notion_range_end",
        FILTER_ONLY_FIRST: "ld_notion_filter_only_first",
        FILTER_ONLY_OP: "ld_notion_filter_only_op",
        FILTER_IMG: "ld_notion_filter_img",
        FILTER_USERS: "ld_notion_filter_users",
        FILTER_INCLUDE: "ld_notion_filter_include",
        FILTER_EXCLUDE: "ld_notion_filter_exclude",
        FILTER_MINLEN: "ld_notion_filter_minlen",
        // UI 状态
        PANEL_COLLAPSED: "ld_notion_panel_collapsed",
        ADVANCED_OPEN: "ld_notion_panel_advanced_open",
        PANEL_MINIMIZED: "ld_notion_panel_minimized",
        MINI_POS_X: "ld_notion_mini_pos_x",
        MINI_POS_Y: "ld_notion_mini_pos_y",
        // Notion 配置
        NOTION_API_KEY: "ld_notion_api_key",
        NOTION_PAGE_ID: "ld_notion_page_id",
        NOTION_PANEL_OPEN: "ld_notion_panel_open",
        NOTION_IMG_MODE: "ld_notion_img_mode",
    };

    const DEFAULTS = {
        rangeMode: "all",
        rangeStart: 1,
        rangeEnd: 999999,
        onlyFirst: false,
        onlyOp: false,
        imgFilter: "none",
        users: "",
        include: "",
        exclude: "",
        minLen: 0,
        notionApiKey: "",
        notionPageId: "",
        notionImgMode: "external",
    };

    // -----------------------
    // Emoji 名称到 Unicode 映射
    // -----------------------
    const EMOJI_MAP = {
        // 笑脸表情
        grinning_face: "😀", smiley: "😃", grinning_face_with_smiling_eyes: "😄", grin: "😁",
        laughing: "😆", sweat_smile: "😅", rofl: "🤣", joy: "😂",
        slightly_smiling_face: "🙂", upside_down_face: "🙃", melting_face: "🫠",
        wink: "😉", blush: "😊", innocent: "😇",
        smiling_face_with_three_hearts: "🥰", heart_eyes: "😍", star_struck: "🤩",
        face_blowing_a_kiss: "😘", kissing_face: "😗", smiling_face: "☺️",
        kissing_face_with_closed_eyes: "😚", kissing_face_with_smiling_eyes: "😙",
        smiling_face_with_tear: "🥲",
        // 舌头表情
        face_savoring_food: "😋", face_with_tongue: "😛", winking_face_with_tongue: "😜",
        zany_face: "🤪", squinting_face_with_tongue: "😝", money_mouth_face: "🤑",
        // 手势类表情
        hugs: "🤗", face_with_hand_over_mouth: "🤭", face_with_open_eyes_and_hand_over_mouth: "🫢",
        face_with_peeking_eye: "🫣", shushing_face: "🤫", thinking: "🤔", saluting_face: "🫡",
        // 嘴部表情
        zipper_mouth_face: "🤐", face_with_raised_eyebrow: "🤨", neutral_face: "😐",
        expressionless: "😑", expressionless_face: "😑", face_without_mouth: "😶",
        dotted_line_face: "🫥", face_in_clouds: "😶‍🌫️",
        // 斜眼表情
        smirk: "😏", smirking_face: "😏", unamused: "😒", unamused_face: "😒",
        roll_eyes: "🙄", rolling_eyes: "🙄", grimacing: "😬", face_exhaling: "😮‍💨",
        lying_face: "🤥", shaking_face: "🫨",
        head_shaking_horizontally: "🙂‍↔️", head_shaking_vertically: "🙂‍↕️",
        // 疲惫表情
        relieved: "😌", relieved_face: "😌", pensive: "😔", pensive_face: "😔",
        sleepy: "😪", sleepy_face: "😪", drooling_face: "🤤", sleeping: "😴", sleeping_face: "😴",
        face_with_bags_under_eyes: "🫩",
        // 生病表情
        mask: "😷", face_with_medical_mask: "😷", face_with_thermometer: "🤒",
        face_with_head_bandage: "🤕", nauseated_face: "🤢", face_vomiting: "🤮",
        sneezing_face: "🤧", hot_face: "🥵", cold_face: "🥶", woozy_face: "🥴",
        face_with_crossed_out_eyes: "😵", face_with_spiral_eyes: "😵‍💫", exploding_head: "🤯",
        // 帽子和眼镜表情
        cowboy_hat_face: "🤠", face_with_cowboy_hat: "🤠", partying_face: "🥳", disguised_face: "🥸",
        sunglasses: "😎", smiling_face_with_sunglasses: "😎", nerd_face: "🤓", face_with_monocle: "🧐",
        // 困惑表情
        confused: "😕", face_with_diagonal_mouth: "🫤", worried: "😟",
        slightly_frowning_face: "🙁", frowning: "☹️",
        // 惊讶表情
        open_mouth: "😮", hushed_face: "😯", astonished_face: "😲", flushed_face: "😳",
        distorted_face: "🫨", pleading_face: "🥺", face_holding_back_tears: "🥹",
        frowning_face_with_open_mouth: "😦", anguished_face: "😧",
        // 恐惧表情
        fearful: "😨", anxious_face_with_sweat: "😰", sad_but_relieved_face: "😥",
        cry: "😢", sob: "😭", scream: "😱",
        confounded: "😖", confounded_face: "😖", persevering_face: "😣",
        disappointed: "😞", disappointed_face: "😞", sweat: "😓", downcast_face_with_sweat: "😓",
        weary_face: "😩", tired_face: "😫", yawning_face: "🥱",
        // 愤怒表情
        face_with_steam_from_nose: "😤", enraged_face: "😡", angry: "😠", rage: "😡",
        face_with_symbols_on_mouth: "🤬",
        smiling_face_with_horns: "😈", angry_face_with_horns: "👿",
        // 骷髅和怪物
        skull: "💀", skull_and_crossbones: "☠️", poop: "💩", clown_face: "🤡",
        ogre: "👹", goblin: "👺", ghost: "👻", alien: "👽", alien_monster: "👾", robot: "🤖",
        // 猫咪表情
        grinning_cat: "😺", grinning_cat_with_smiling_eyes: "😸", joy_cat: "😹",
        smiling_cat_with_heart_eyes: "😻", cat_with_wry_smile: "😼", kissing_cat: "😽",
        weary_cat: "🙀", crying_cat: "😿", pouting_cat: "😾",
        // 三猴子
        see_no_evil_monkey: "🙈", hear_no_evil_monkey: "🙉", speak_no_evil_monkey: "🙊",
        // 心形类
        love_letter: "💌", heart_with_arrow: "💘", heart_with_ribbon: "💝",
        sparkling_heart: "💖", growing_heart: "💗", beating_heart: "💓",
        revolving_hearts: "💞", two_hearts: "💕", heart_decoration: "💟",
        heart_exclamation: "❣️", broken_heart: "💔", heart_on_fire: "❤️‍🔥", mending_heart: "❤️‍🩹",
        heart: "❤️", pink_heart: "🩷", orange_heart: "🧡", yellow_heart: "💛",
        green_heart: "💚", blue_heart: "💙", light_blue_heart: "🩵", purple_heart: "💜",
        brown_heart: "🤎", black_heart: "🖤", grey_heart: "🩶", white_heart: "🤍",
        // 符号类
        kiss_mark: "💋", "100": "💯", anger_symbol: "💢", fight_cloud: "💨",
        collision: "💥", dizzy: "💫", sweat_droplets: "💦", sweat_drops: "💦",
        dashing_away: "💨", dash: "💨", hole: "🕳️",
        speech_balloon: "💬", eye_in_speech_bubble: "👁️️🗨️", left_speech_bubble: "🗨️",
        right_anger_bubble: "🗯️", thought_balloon: "💭", zzz: "💤",
        // 兼容旧版本的别名
        smile: "😊", grinning: "😀", kissing: "😗", kissing_heart: "😘",
        stuck_out_tongue: "😛", heartpulse: "💗", heartbeat: "💓", cupid: "💘", gift_heart: "💝",
        // 手势
        thumbsup: "👍", thumbsdown: "👎", "+1": "👍", "-1": "👎",
        ok_hand: "👌", punch: "👊", fist: "✊", v: "✌️", wave: "👋",
        raised_hand: "✋", open_hands: "👐", muscle: "💪", pray: "🙏",
        point_up: "☝️", point_up_2: "👆", point_down: "👇", point_left: "👈", point_right: "👉",
        clap: "👏", raised_hands: "🙌", handshake: "🤝",
        // 通用符号
        star: "⭐", star2: "🌟", sparkles: "✨", zap: "⚡", fire: "🔥",
        boom: "💥", droplet: "💧",
        check: "✅", white_check_mark: "✅", x: "❌", cross_mark: "❌",
        heavy_check_mark: "✔️", heavy_multiplication_x: "✖️",
        question: "❓", exclamation: "❗", warning: "⚠️", no_entry: "⛔",
        triangular_flag: "🚩", triangular_flag_on_post: "🚩",
        sos: "🆘", ok: "🆗", cool: "🆒", new: "🆕", free: "🆓",
        // 动物
        dog: "🐕", cat: "🐈", mouse: "🐁", rabbit: "🐇", bear: "🐻",
        panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐄",
        pig: "🐷", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦",
        frog: "🐸", turtle: "🐢", snake: "🐍", dragon: "🐉", whale: "🐋",
        dolphin: "🐬", fish: "🐟", octopus: "🐙", bug: "🐛", bee: "🐝",
        // 食物
        apple: "🍎", green_apple: "🍏", banana: "🍌", orange: "🍊", lemon: "🍋",
        grapes: "🍇", watermelon: "🍉", strawberry: "🍓", peach: "🍑", cherries: "🍒",
        pizza: "🍕", hamburger: "🍔", fries: "🍟", hotdog: "🌭", taco: "🌮",
        coffee: "☕", tea: "🍵", beer: "🍺", wine_glass: "🍷", tropical_drink: "🍹",
        cake: "🍰", cookie: "🍪", chocolate_bar: "🍫", candy: "🍬", lollipop: "🍭",
        // 物品
        gift: "🎁", balloon: "🎈", tada: "🎉", confetti_ball: "🎊",
        trophy: "🏆", medal: "🏅", first_place_medal: "🥇", second_place_medal: "🥈", third_place_medal: "🥉",
        soccer: "⚽", basketball: "🏀", football: "🏈", tennis: "🎾", volleyball: "🏐",
        computer: "💻", keyboard: "⌨️", desktop_computer: "🖥️", printer: "🖨️", mouse_three_button: "🖱️",
        phone: "📱", telephone: "☎️", email: "📧", envelope: "✉️", memo: "📝",
        book: "📖", books: "📚", newspaper: "📰", bookmark: "🔖",
        bulb: "💡", flashlight: "🔦", candle: "🕯️",
        lock: "🔒", unlock: "🔓", key: "🔑",
        // 交通与天气
        rocket: "🚀", airplane: "✈️", car: "🚗", bus: "🚌", train: "🚆",
        sun: "☀️", cloud: "☁️", umbrella: "☂️", rainbow: "🌈", snowflake: "❄️",
        clock: "🕐", alarm_clock: "⏰", stopwatch: "⏱️", timer_clock: "⏲️",
        hourglass: "⌛", watch: "⌚",
        globe_showing_americas: "🌎", globe_showing_europe_africa: "🌍", globe_showing_asia_australia: "🌏",
        earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏",
        bullseye: "🎯", dart: "🎯",
        // 国旗
        cn: "🇨🇳", us: "🇺🇸", jp: "🇯🇵", kr: "🇰🇷", gb: "🇬🇧",
    };

    // -----------------------
    // 工具函数
    // -----------------------
    function getTopicId() {
        const m =
            window.location.pathname.match(/\/topic\/(\d+)/) ||
            window.location.pathname.match(/\/t\/[^/]+\/(\d+)/);
        return m ? m[1] : null;
    }

    function absoluteUrl(src) {
        if (!src) return "";
        if (src.startsWith("http://") || src.startsWith("https://")) return src;
        if (src.startsWith("//")) return window.location.protocol + src;
        if (src.startsWith("/")) return window.location.origin + src;
        return window.location.origin + "/" + src.replace(/^\.?\//, "");
    }

    function clampInt(n, min, max, fallback) {
        const x = parseInt(String(n), 10);
        if (Number.isNaN(x)) return fallback;
        return Math.max(min, Math.min(max, x));
    }

    function normalizeListInput(s) {
        return (s || "")
            .split(/[\s,，;；]+/g)
            .map((x) => x.trim())
            .filter(Boolean);
    }

    function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }



    // -----------------------
    // Notion 支持的代码语言
    // -----------------------
    const NOTION_LANGUAGES = new Set([
        "abap", "abc", "agda", "arduino", "ascii art", "assembly", "bash", "basic", "bnf", "c", "c#", "c++",
        "clojure", "coffeescript", "coq", "css", "dart", "dhall", "diff", "docker", "ebnf", "elixir", "elm",
        "erlang", "flow", "fortran", "gherkin", "glsl", "go", "graphql", "groovy", "haskell", "hcl", "html",
        "idris", "java", "javascript", "json", "julia", "kotlin", "latex", "less", "lisp", "livescript",
        "llvm ir", "lua", "makefile", "markdown", "markup", "matlab", "mathematica", "mermaid", "nix",
        "notion formula", "objective-c", "ocaml", "pascal", "perl", "php", "plain text", "powershell",
        "prolog", "protobuf", "purescript", "python", "r", "racket", "reason", "ruby", "rust", "sass",
        "scala", "scheme", "scss", "shell", "smalltalk", "solidity", "sql", "swift", "toml", "typescript",
        "vb.net", "verilog", "vhdl", "visual basic", "webassembly", "xml", "yaml", "java/c/c++/c#"
    ]);

    function normalizeLanguage(lang) {
        if (!lang) return "plain text";

        const lower = lang.toLowerCase().trim();

        // 直接匹配
        if (NOTION_LANGUAGES.has(lower)) return lower;

        // 常见别名映射
        const aliases = {
            "auto": "plain text",
            "text": "plain text",
            "plaintext": "plain text",
            "js": "javascript",
            "ts": "typescript",
            "py": "python",
            "rb": "ruby",
            "sh": "shell",
            "yml": "yaml",
            "md": "markdown",
            "cpp": "c++",
            "csharp": "c#",
            "cs": "c#",
            "golang": "go",
            "rs": "rust",
            "kt": "kotlin",
            "jsx": "javascript",
            "tsx": "typescript",
            "vue": "html",
            "svelte": "html",
            "dockerfile": "docker",
            "makefile": "makefile",
            "cmake": "makefile",
            "bat": "powershell",
            "cmd": "powershell",
            "ps1": "powershell",
            "zsh": "shell",
            "fish": "shell",
            "asm": "assembly",
            "s": "assembly",
            "objc": "objective-c",
            "obj-c": "objective-c",
            "objective c": "objective-c",
            "vb": "visual basic",
            "vbnet": "vb.net",
            "tex": "latex",
            "ml": "ocaml",
            "fs": "f#",
            "fsharp": "f#",
            "ex": "elixir",
            "exs": "elixir",
            "erl": "erlang",
            "hs": "haskell",
            "jl": "julia",
            "nim": "plain text",
            "v": "verilog",
            "sv": "verilog",
            "vhd": "vhdl",
        };

        if (aliases[lower]) return aliases[lower];

        // 如果包含某些关键词
        if (lower.includes("script")) {
            if (lower.includes("java")) return "javascript";
            if (lower.includes("type")) return "typescript";
            if (lower.includes("coffee")) return "coffeescript";
            if (lower.includes("live")) return "livescript";
        }

        // 默认返回 plain text
        return "plain text";
    }

    // -----------------------
    // DOM -> Notion Blocks
    // -----------------------
    function cookedToNotionBlocks(cookedHtml, settings) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(cookedHtml || "", "text/html");
        const root = doc.body;

        const blocks = [];
        const imgMode = settings?.notion?.imgMode || "external";

        // 辅助函数:将超长文本拆分成多个 rich_text 对象
        function splitLongText(text, annotations = {}) {
            const maxLength = 2000;
            const chunks = [];

            if (text.length <= maxLength) {
                chunks.push({
                    type: "text",
                    text: { content: text },
                    annotations: { ...annotations },
                });
            } else {
                let remaining = text;
                while (remaining.length > 0) {
                    const chunk = remaining.substring(0, maxLength);
                    chunks.push({
                        type: "text",
                        text: { content: chunk },
                        annotations: { ...annotations },
                    });
                    remaining = remaining.substring(maxLength);
                }
            }

            return chunks;
        }

        function serializeRichText(node) {
            const result = [];

            function processNode(n, annotations = {}) {
                if (!n) return;

                if (n.nodeType === Node.TEXT_NODE) {
                    const text = n.nodeValue || "";
                    if (text) {
                        // 使用拆分函数处理超长文本
                        result.push(...splitLongText(text, annotations));
                    }
                    return;
                }

                if (n.nodeType !== Node.ELEMENT_NODE) return;

                const el = n;
                const tag = el.tagName.toLowerCase();

                // 处理 emoji 图片
                if (tag === "img") {
                    const src = el.getAttribute("src") || el.getAttribute("data-src") || "";
                    const emojiMatch = src.match(/\/images\/emoji\/(?:twemoji|apple|google|twitter)\/([^/.]+)\.png/i);
                    if (emojiMatch) {
                        const emojiName = emojiMatch[1];
                        const emoji = EMOJI_MAP[emojiName] || el.getAttribute("alt") || el.getAttribute("title") || `:${emojiName}:`;
                        if (emoji) {
                            result.push({
                                type: "text",
                                text: { content: emoji },
                                annotations: { ...annotations },
                            });
                        }
                        return;
                    }
                    return;
                }

                // 处理链接
                if (tag === "a") {
                    const href = el.getAttribute("href") || "";
                    const classes = el.getAttribute("class") || "";
                    // 跳过 Discourse 的标题锚点链接
                    if (classes.includes("anchor") || href.startsWith("#")) {
                        Array.from(el.childNodes).forEach((c) => processNode(c, annotations));
                        return;
                    }
                    const hasImg = el.querySelector("img");
                    if (hasImg) {
                        Array.from(el.childNodes).forEach((c) => processNode(c, annotations));
                        return;
                    }
                    const link = absoluteUrl(href);
                    if (link) {
                        // 收集链接内的文本内容
                        const linkTexts = [];
                        const collectText = (node) => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                linkTexts.push(node.nodeValue || "");
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                Array.from(node.childNodes).forEach(collectText);
                            }
                        };
                        Array.from(el.childNodes).forEach(collectText);
                        const linkText = linkTexts.join("");
                        if (linkText) {
                            // 使用拆分函数处理超长链接文本
                            const chunks = splitLongText(linkText, annotations);
                            chunks.forEach(chunk => {
                                chunk.text.link = { url: link };
                            });
                            result.push(...chunks);
                        }
                    } else {
                        Array.from(el.childNodes).forEach((c) => processNode(c, annotations));
                    }
                    return;
                }

                // 处理格式标签
                if (tag === "strong" || tag === "b") {
                    Array.from(el.childNodes).forEach((c) => processNode(c, { ...annotations, bold: true }));
                    return;
                }
                if (tag === "em" || tag === "i") {
                    Array.from(el.childNodes).forEach((c) => processNode(c, { ...annotations, italic: true }));
                    return;
                }
                if (tag === "s" || tag === "del" || tag === "strike") {
                    Array.from(el.childNodes).forEach((c) => processNode(c, { ...annotations, strikethrough: true }));
                    return;
                }
                if (tag === "code") {
                    const text = el.textContent || "";
                    if (text) {
                        // 使用拆分函数处理超长代码文本
                        const chunks = splitLongText(text, { ...annotations, code: true });
                        result.push(...chunks);
                    }
                    return;
                }

                // 其他元素，递归处理子节点
                Array.from(el.childNodes).forEach((c) => processNode(c, annotations));
            }

            processNode(node);
            return result;
        }

        function processElement(el) {
            if (!el) return;
            if (el.nodeType !== Node.ELEMENT_NODE) return;

            const tag = el.tagName.toLowerCase();

            // 跳过 Discourse 的图片元信息容器
            if (el.classList && el.classList.contains('meta')) {
                return;
            }

            // 处理 Discourse 的表格容器
            if (el.classList && el.classList.contains('md-table')) {
                const table = el.querySelector("table");
                if (table) {
                    const result = processElementToBlock(table);
                    if (result) {
                        if (Array.isArray(result)) {
                            blocks.push(...result);
                        } else {
                            blocks.push(result);
                        }
                    }
                }
                return;
            }

            // 处理 Discourse 的 lightbox 图片容器
            if (el.classList && (el.classList.contains('lightbox-wrapper') || el.classList.contains('image-wrapper'))) {
                const img = el.querySelector("img");
                if (img) {
                    const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
                    const full = absoluteUrl(src);
                    if (full) {
                        // 检测是否为 emoji 图片
                        const emojiMatch = src.match(/\/images\/emoji\/(?:twemoji|apple|google|twitter)\/([^/.]+)\.png/i);
                        if (!emojiMatch) {
                            // 根据文件处理模式决定如何处理
                            if (imgMode === "skip") {
                                // 跳过图片,不添加 block
                                return;
                            } else if (imgMode === "upload") {
                                // 标记需要上传,稍后批量处理
                                blocks.push({
                                    type: "image",
                                    image: {
                                        type: "external",
                                        external: { url: full },
                                    },
                                    _needsUpload: true,
                                    _originalUrl: full,
                                    _fileType: "image",
                                });
                            } else {
                                // external 模式,直接引用
                                blocks.push({
                                    type: "image",
                                    image: {
                                        type: "external",
                                        external: { url: full },
                                    },
                                });
                            }
                        }
                    }
                }
                return;
            }

            // 处理 Discourse 引用块
            if (tag === "aside" && el.classList.contains("quote")) {
                const titleLink = el.querySelector(".quote-title__text-content a") || el.querySelector(".title > a");
                const title = titleLink?.textContent?.trim() || "引用";
                const href = titleLink?.getAttribute("href") || "";

                const blockquote = el.querySelector("blockquote");
                if (blockquote) {
                    const childBlocks = [];
                    Array.from(blockquote.children).forEach((child) => {
                        const childResult = processElementToBlock(child);
                        if (childResult) {
                            if (Array.isArray(childResult)) {
                                childBlocks.push(...childResult);
                            } else {
                                childBlocks.push(childResult);
                            }
                        }
                    });

                    // 构建标题的 rich_text，将链接改为可点击格式
                    const headerRichText = [];
                    headerRichText.push({ type: "text", text: { content: title } });
                    if (href) {
                        const fullUrl = absoluteUrl(href);
                        headerRichText.push({ type: "text", text: { content: " - " } });
                        headerRichText.push({ type: "text", text: { content: fullUrl, link: { url: fullUrl } } });
                    }

                    blocks.push({
                        type: "quote",
                        quote: {
                            rich_text: headerRichText,
                            children: childBlocks.slice(0, 100), // Notion 限制
                        },
                    });
                }
                return;
            }

            // 处理 Discourse onebox（链接预览）
            if (tag === "aside" && el.classList.contains("onebox")) {
                const titleEl = el.querySelector("h3 a") || el.querySelector("header a");
                const title = titleEl?.textContent?.trim() || "";
                const href = titleEl?.getAttribute("href") || "";
                const desc = el.querySelector("article p")?.textContent?.trim() || "";

                if (href) {
                    const link = absoluteUrl(href);
                    const content = desc ? `${title}\n${desc}` : title || link;
                    blocks.push({
                        type: "paragraph",
                        paragraph: {
                            rich_text: [{ type: "text", text: { content: content, link: { url: link } } }],
                        },
                    });
                }
                return;
            }

            const result = processElementToBlock(el);
            if (result) {
                if (Array.isArray(result)) {
                    blocks.push(...result);
                } else {
                    blocks.push(result);
                }
            }
        }

        function processElementToBlock(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;

            const tag = el.tagName.toLowerCase();

            // 段落
            if (tag === "p") {
                // 检查段落中是否有图片或附件，如果有，需要分别处理
                const images = el.querySelectorAll("img");
                const attachments = el.querySelectorAll("a.attachment");
                const hasImages = images.length > 0;
                const hasAttachments = attachments.length > 0;

                if (hasImages || hasAttachments) {
                    // 段落中有图片或附件，需要拆分处理
                    const results = [];

                    // 先提取段落中的文本内容（不包括图片和附件）
                    const textContent = [];
                    const collectTextNodes = (node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            const text = node.nodeValue?.trim();
                            if (text) textContent.push(text);
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            const tag = node.tagName.toLowerCase();
                            // 跳过图片和附件链接
                            if (tag !== "img" && !node.classList.contains("attachment")) {
                                Array.from(node.childNodes).forEach(collectTextNodes);
                            }
                        }
                    };
                    Array.from(el.childNodes).forEach(collectTextNodes);

                    // 如果有文本内容，创建段落 block
                    if (textContent.length > 0) {
                        const richText = serializeRichText(el);
                        if (richText.length > 0) {
                            results.push({
                                type: "paragraph",
                                paragraph: { rich_text: richText },
                            });
                        }
                    }

                    // 为每个图片创建独立的 image block
                    images.forEach((img) => {
                        const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
                        const full = absoluteUrl(src);
                        if (!full) return;

                        // 检测是否为 emoji 图片
                        const emojiMatch = src.match(/\/images\/emoji\/(?:twemoji|apple|google|twitter)\/([^/.]+)\.png/i);
                        if (emojiMatch) return;

                        // 根据图片处理模式决定如何处理
                        if (imgMode === "skip") {
                            // 跳过图片
                            return;
                        } else if (imgMode === "upload") {
                            // 标记需要上传
                            results.push({
                                type: "image",
                                image: {
                                    type: "external",
                                    external: { url: full },
                                },
                                _needsUpload: true,
                                _originalUrl: full,
                                _fileType: "image",
                            });
                        } else {
                            // external 模式
                            results.push({
                                type: "image",
                                image: {
                                    type: "external",
                                    external: { url: full },
                                },
                            });
                        }
                    });

                    // 为每个附件创建独立的 file block
                    attachments.forEach((attachment) => {
                        const href = attachment.getAttribute("href") || "";
                        const fileName = attachment.textContent?.trim() || "attachment";
                        const full = absoluteUrl(href);
                        if (!full) return;

                        // 根据文件处理模式决定如何处理
                        if (imgMode === "skip") {
                            // 跳过附件
                            return;
                        } else if (imgMode === "upload") {
                            // 标记需要上传
                            results.push({
                                type: "file",
                                file: {
                                    type: "external",
                                    external: { url: full },
                                    caption: [{ type: "text", text: { content: fileName } }],
                                },
                                _needsUpload: true,
                                _originalUrl: full,
                                _fileType: "file",
                                _fileName: fileName,
                            });
                        } else {
                            // external 模式
                            results.push({
                                type: "file",
                                file: {
                                    type: "external",
                                    external: { url: full },
                                    caption: [{ type: "text", text: { content: fileName } }],
                                },
                            });
                        }
                    });

                    return results.length > 0 ? results : null;
                }

                // 没有图片或附件，正常处理段落
                const richText = serializeRichText(el);
                if (richText.length === 0) return null;
                return {
                    type: "paragraph",
                    paragraph: { rich_text: richText },
                };
            }

            // 代码块
            if (tag === "pre") {
                const codeEl = el.querySelector("code");
                const langClass = codeEl?.getAttribute("class") || "";
                const rawLang = (langClass.match(/lang(?:uage)?-([a-z0-9_+-]+)/i) || [])[1] || "plain text";
                const lang = normalizeLanguage(rawLang);
                const code = (codeEl ? codeEl.textContent : el.textContent) || "";

                // 将超长代码拆分成多个 rich_text 对象 (每个最多 2000 字符)
                const richTextArray = [];
                const maxLength = 2000;

                if (code.length <= maxLength) {
                    richTextArray.push({ type: "text", text: { content: code } });
                } else {
                    let remaining = code;
                    while (remaining.length > 0) {
                        const chunk = remaining.substring(0, maxLength);
                        richTextArray.push({ type: "text", text: { content: chunk } });
                        remaining = remaining.substring(maxLength);
                    }
                }

                return {
                    type: "code",
                    code: {
                        rich_text: richTextArray,
                        language: lang,
                    },
                };
            }

            // 引用块（非 Discourse aside）
            if (tag === "blockquote") {
                const richText = serializeRichText(el);
                if (richText.length === 0) return null;
                return {
                    type: "quote",
                    quote: { rich_text: richText },
                };
            }

            // 标题
            if (/^h[1-3]$/.test(tag)) {
                const level = parseInt(tag.substring(1));
                const richText = serializeRichText(el);
                if (richText.length === 0) return null;
                return {
                    type: `heading_${level}`,
                    [`heading_${level}`]: { rich_text: richText },
                };
            }

            // 列表项
            if (tag === "ul") {
                const items = [];
                Array.from(el.children).forEach((li) => {
                    if (li.tagName.toLowerCase() === "li") {
                        const richText = serializeRichText(li);
                        if (richText.length > 0) {
                            items.push({
                                type: "bulleted_list_item",
                                bulleted_list_item: { rich_text: richText },
                            });
                        }
                    }
                });
                return items;
            }

            if (tag === "ol") {
                const items = [];
                Array.from(el.children).forEach((li) => {
                    if (li.tagName.toLowerCase() === "li") {
                        const richText = serializeRichText(li);
                        if (richText.length > 0) {
                            items.push({
                                type: "numbered_list_item",
                                numbered_list_item: { rich_text: richText },
                            });
                        }
                    }
                });
                return items;
            }

            // 表格
            if (tag === "table") {
                const rows = [];
                let hasHeader = false;

                // 处理表头
                const thead = el.querySelector("thead");
                if (thead) {
                    hasHeader = true;
                    const headerRows = thead.querySelectorAll("tr");
                    headerRows.forEach((tr) => {
                        const cells = [];
                        const ths = tr.querySelectorAll("th, td");
                        ths.forEach((th) => {
                            const richText = serializeRichText(th);
                            cells.push(richText.length > 0 ? richText : [{ type: "text", text: { content: "" } }]);
                        });
                        if (cells.length > 0) {
                            rows.push({ cells });
                        }
                    });
                }

                // 处理表体
                const tbody = el.querySelector("tbody");
                const bodyRows = tbody ? tbody.querySelectorAll("tr") : el.querySelectorAll("tr");
                bodyRows.forEach((tr) => {
                    const cells = [];
                    const tds = tr.querySelectorAll("td, th");
                    tds.forEach((td) => {
                        const richText = serializeRichText(td);
                        cells.push(richText.length > 0 ? richText : [{ type: "text", text: { content: "" } }]);
                    });
                    if (cells.length > 0) {
                        rows.push({ cells });
                    }
                });

                if (rows.length === 0) return null;

                // 计算表格宽度（列数）
                const tableWidth = Math.max(...rows.map(r => r.cells.length));

                // 构建 Notion 表格 block
                const tableBlock = {
                    type: "table",
                    table: {
                        table_width: tableWidth,
                        has_column_header: hasHeader,
                        has_row_header: false,
                        children: rows.map(row => ({
                            type: "table_row",
                            table_row: {
                                cells: row.cells
                            }
                        }))
                    }
                };

                return tableBlock;
            }

            // 图片
            if (tag === "img") {
                const src = el.getAttribute("src") || el.getAttribute("data-src") || "";
                const full = absoluteUrl(src);
                if (!full) return null;

                // 检测是否为 emoji 图片
                const emojiMatch = src.match(/\/images\/emoji\/(?:twemoji|apple|google|twitter)\/([^/.]+)\.png/i);
                if (emojiMatch) {
                    return null; // emoji 已在 rich text 中处理
                }

                // 根据图片处理模式决定如何处理
                if (imgMode === "skip") {
                    return null;
                } else if (imgMode === "upload") {
                    return {
                        type: "image",
                        image: {
                            type: "external",
                            external: { url: full },
                        },
                        _needsUpload: true,
                        _originalUrl: full,
                        _fileType: "image",
                    };
                } else {
                    return {
                        type: "image",
                        image: {
                            type: "external",
                            external: { url: full },
                        },
                    };
                }
            }

            return null;
        }

        // 处理根节点的所有子元素
        Array.from(root.children).forEach(processElement);

        // 额外处理：查找所有 lightbox-wrapper（可能被 DOMParser 重新组织）
        const lightboxWrappers = root.querySelectorAll(".lightbox-wrapper");
        lightboxWrappers.forEach((wrapper) => {
            const img = wrapper.querySelector("img");
            if (img) {
                const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
                const full = absoluteUrl(src);
                if (full) {
                    // 检测是否为 emoji 图片
                    const emojiMatch = src.match(/\/images\/emoji\/(?:twemoji|apple|google|twitter)\/([^/.]+)\.png/i);
                    if (!emojiMatch) {
                        // 检查是否已经添加过这个图片
                        const alreadyAdded = blocks.some(b =>
                            b.type === "image" && (b.image?.external?.url === full || b._originalUrl === full)
                        );
                        if (!alreadyAdded) {
                            // 根据图片处理模式决定如何处理
                            if (imgMode === "skip") {
                                // 跳过图片
                                return;
                            } else if (imgMode === "upload") {
                                blocks.push({
                                    type: "image",
                                    image: {
                                        type: "external",
                                        external: { url: full },
                                    },
                                    _needsUpload: true,
                                    _originalUrl: full,
                                    _fileType: "image",
                                });
                            } else {
                                blocks.push({
                                    type: "image",
                                    image: {
                                        type: "external",
                                        external: { url: full },
                                    },
                                });
                            }
                        }
                    }
                }
            }
        });

        return blocks;
    }

    // -----------------------
    // 生成楼层 Callout Block
    // -----------------------
    function generatePostCalloutBlock(post, topic, settings) {
        const isOp = (post.username || "").toLowerCase() === (topic.opUsername || "").toLowerCase();
        const dateStr = post.created_at ? new Date(post.created_at).toLocaleString("zh-CN") : "";

        const emoji = isOp ? "🏠" : "💬";
        const opBadge = isOp ? " 楼主" : "";

        let title = `#${post.post_number} ${post.name || post.username || "匿名"}`;
        if (post.name && post.username && post.name !== post.username) {
            title += ` (@${post.username})`;
        }
        title += opBadge;
        if (dateStr) title += ` · ${dateStr}`;

        const contentBlocks = cookedToNotionBlocks(post.cooked, settings);

        // 如果有回复,添加回复信息
        const children = [];
        if (post.reply_to_post_number) {
            children.push({
                type: "paragraph",
                paragraph: {
                    rich_text: [
                        { type: "text", text: { content: `↩️ 回复 #${post.reply_to_post_number}楼` } }
                    ],
                },
            });
        }

        children.push(...contentBlocks);

        return {
            type: "callout",
            callout: {
                icon: { type: "emoji", emoji },
                rich_text: [{ type: "text", text: { content: title } }],
                children: children.slice(0, 100), // Notion 限制每个 block 最多 100 个子 block
            },
        };
    }

    // -----------------------
    // Notion API
    // -----------------------
    function createNotionPage(title, blocks, apiKey, parentPageId) {
        return new Promise((resolve, reject) => {
            const initialBlocks = blocks.slice(0, 100);
            const remainingBlocks = blocks.slice(100);

            const requestData = {
                parent: {
                    type: "page_id",
                    page_id: parentPageId,
                },
                properties: {
                    title: {
                        title: [{ text: { content: title } }],
                    },
                },
                children: initialBlocks,
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.notion.com/v1/pages",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28",
                },
                data: JSON.stringify(requestData),
                onload: async (response) => {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            const pageId = data.id;

                            // 如果有剩余 blocks，分批追加
                            if (remainingBlocks.length > 0) {
                                await appendBlocksToPage(pageId, remainingBlocks, apiKey);
                            }

                            resolve(data);
                        } else {
                            reject(new Error(`创建页面失败: ${response.status} ${response.statusText}\n${response.responseText}`));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: (error) => {
                    reject(new Error(`网络请求失败: ${error}`));
                },
            });
        });
    }

    function appendBlocksToPage(pageId, blocks, apiKey) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            for (let i = 0; i < blocks.length; i += 100) {
                chunks.push(blocks.slice(i, i + 100));
            }

            let completed = 0;

            const appendChunk = (chunk) => {
                return new Promise((res, rej) => {
                    GM_xmlhttpRequest({
                        method: "PATCH",
                        url: `https://api.notion.com/v1/blocks/${pageId}/children`,
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                            "Notion-Version": "2022-06-28",
                        },
                        data: JSON.stringify({ children: chunk }),
                        onload: (response) => {
                            if (response.status === 200) {
                                completed++;
                                ui.setStatus(`追加内容中 (${completed}/${chunks.length})`, "#a855f7");
                                res();
                            } else {
                                rej(new Error(`追加 blocks 失败: ${response.status} ${response.statusText}`));
                            }
                        },
                        onerror: (error) => rej(new Error(`网络请求失败: ${error}`)),
                    });
                });
            };

            // 顺序追加所有 chunks
            (async () => {
                try {
                    for (const chunk of chunks) {
                        await appendChunk(chunk);
                        await sleep(300); // 避免速率限制
                    }
                    resolve();
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    // -----------------------
    // Notion File Upload API
    // -----------------------
    /**
     * 创建文件上传
     * 官方文档：https://developers.notion.com/reference/create-a-file-upload
     * @param {string} filename - 文件名
     * @param {string} contentType - MIME 类型
     * @param {string} apiKey - Notion API Key
     * @returns {Promise<Object>} FileUpload 对象
     */
    function createFileUpload(filename, contentType, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.notion.com/v1/file_uploads",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28",
                },
                data: JSON.stringify({
                    mode: "single_part",
                    filename: filename,
                    content_type: contentType,
                }),
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`创建文件上传失败: ${response.status}\n${response.responseText || ""}`));
                    }
                },
                onerror: (error) => reject(new Error(`网络请求失败: ${error}`)),
            });
        });
    }

    /**
     * 上传文件内容
     * @param {string} uploadUrl - 上传 URL
     * @param {Blob} blob - 文件 Blob
     * @param {string} contentType - MIME 类型
     * @param {string} apiKey - Notion API Key
     * @param {string} filename - 文件名
     * @returns {Promise<void>}
     */
    function sendFileUpload(uploadUrl, blob, contentType, apiKey, filename) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                // 生成 multipart boundary
                const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

                // 构建 multipart/form-data 格式的请求体
                const arrayBuffer = reader.result;
                const uint8Array = new Uint8Array(arrayBuffer);

                const header = `--${boundary}\r\n` +
                    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
                    `Content-Type: ${contentType}\r\n\r\n`;

                const headerBytes = new TextEncoder().encode(header);
                const footerBytes = new TextEncoder().encode(`\r\n--${boundary}--\r\n`);

                // 合并所有部分
                const totalLength = headerBytes.length + uint8Array.length + footerBytes.length;
                const body = new Uint8Array(totalLength);

                body.set(headerBytes, 0);
                body.set(uint8Array, headerBytes.length);
                body.set(footerBytes, headerBytes.length + uint8Array.length);

                // 使用 GM_xmlhttpRequest 发送
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: uploadUrl,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    },
                    data: body.buffer,
                    binary: true,
                    onload: (response) => {
                        if (response.status === 200 || response.status === 204) {
                            resolve();
                        } else {
                            reject(new Error(`上传文件失败: ${response.status}\n${response.responseText || ""}`));
                        }
                    },
                    onerror: (error) => reject(new Error(`网络请求失败: ${error}`)),
                });
            };

            reader.onerror = () => reject(new Error("读取文件数据失败"));
            reader.readAsArrayBuffer(blob);
        });
    }

    /**
     * 检查文件扩展名是否被 Notion File Upload API 支持
     * 基于 Notion 官方文档: https://developers.notion.com/docs/working-with-files-and-media
     * @param {string} ext - 文件扩展名（不含点）
     * @returns {boolean}
     */
    function isSupportedFileType(ext) {
        const supportedExtensions = [
            // Audio
            'aac', 'adts', 'mid', 'midi', 'mp3', 'mpga', 'm4a', 'm4b', 'mp4', 'oga', 'ogg', 'wav', 'wma',
            // Document
            'pdf', 'txt', 'json', 'doc', 'dot', 'docx', 'dotx', 'xls', 'xlt', 'xla', 'xlsx', 'xltx',
            'ppt', 'pot', 'pps', 'ppa', 'pptx', 'potx',
            // Image
            'gif', 'heic', 'jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp', 'ico',
            // Video
            'amv', 'asf', 'wmv', 'avi', 'f4v', 'flv', 'gifv', 'm4v', 'mkv', 'webm', 'mov', 'qt', 'mpeg',
        ];
        return supportedExtensions.includes(ext.toLowerCase());
    }

    /**
     * 下载并上传文件到 Notion
     * @param {string} fileUrl - 文件 URL
     * @param {string} apiKey - Notion API Key
     * @param {string} originalFileName - 原始文件名（可选）
     * @returns {Promise<string>} FileUpload ID，如果不支持上传则返回 null
     */
    async function uploadFileToNotion(fileUrl, apiKey, originalFileName = null) {
        try {
            const urlObj = new URL(fileUrl);
            // 移除 URL 参数，只保留路径部分来提取扩展名
            let pathname = urlObj.pathname;
            let ext = pathname.split(".").pop()?.toLowerCase() || "";

            // 如果提供了原始文件名，优先使用它的扩展名
            if (originalFileName) {
                const origExt = originalFileName.split(".").pop()?.toLowerCase();
                if (origExt && origExt.length <= 10 && /^[a-z0-9]+$/i.test(origExt)) {
                    ext = origExt;
                }
            }

            // 验证扩展名格式
            if (!ext || ext.length > 10 || !/^[a-z0-9]+$/i.test(ext)) {
                ext = "bin";
            }

            if (!isSupportedFileType(ext)) {
                throw new Error(`UNSUPPORTED_FILE_TYPE: .${ext}`);
            }

            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error(`下载失败: ${response.status}`);

            const blob = await response.blob();

            // Notion 官方支持的 Content-Type 映射表
            const extToContentType = {
                // Audio
                'aac': 'audio/aac',
                'adts': 'audio/aac',
                'mid': 'audio/midi',
                'midi': 'audio/midi',
                'mp3': 'audio/mpeg',
                'mpga': 'audio/mpeg',
                'm4a': 'audio/mp4',
                'm4b': 'audio/mp4',
                'oga': 'audio/ogg',
                'ogg': 'audio/ogg',
                'wav': 'audio/wav',
                'wma': 'audio/x-ms-wma',
                // Document
                'pdf': 'application/pdf',
                'txt': 'text/plain',
                'json': 'application/json',
                'doc': 'application/msword',
                'dot': 'application/msword',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'dotx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
                'xls': 'application/vnd.ms-excel',
                'xlt': 'application/vnd.ms-excel',
                'xla': 'application/vnd.ms-excel',
                'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'xltx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
                'ppt': 'application/vnd.ms-powerpoint',
                'pot': 'application/vnd.ms-powerpoint',
                'pps': 'application/vnd.ms-powerpoint',
                'ppa': 'application/vnd.ms-powerpoint',
                'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'potx': 'application/vnd.openxmlformats-officedocument.presentationml.template',
                // Image
                'gif': 'image/gif',
                'heic': 'image/heic',
                'jpeg': 'image/jpeg',
                'jpg': 'image/jpeg',
                'png': 'image/png',
                'svg': 'image/svg+xml',
                'tif': 'image/tiff',
                'tiff': 'image/tiff',
                'webp': 'image/webp',
                'ico': 'image/vnd.microsoft.icon',
                // Video
                'amv': 'video/x-amv',
                'asf': 'video/x-ms-asf',
                'wmv': 'video/x-ms-asf',
                'avi': 'video/x-msvideo',
                'f4v': 'video/x-f4v',
                'flv': 'video/x-flv',
                'gifv': 'video/x-flv',
                'm4v': 'video/mp4',
                'mp4': 'video/mp4',  // 默认视频格式，如果是音频服务器会返回 audio/mp4
                'mkv': 'video/mp4',
                'webm': 'video/webm',
                'mov': 'video/quicktime',
                'qt': 'video/quicktime',
                'mpeg': 'video/mpeg',
            };

            let contentType = blob.type;

            // 优先使用服务器返回的 Content-Type
            if (!contentType || contentType === 'application/octet-stream') {
                // 服务器未提供有效的 Content-Type，使用映射表
                contentType = extToContentType[ext] || 'application/octet-stream';
            }

            const typedBlob = new Blob([blob], { type: contentType });
            const filename = originalFileName || `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

            const fileUpload = await createFileUpload(filename, contentType, apiKey);

            if (!fileUpload || !fileUpload.upload_url) {
                throw new Error("创建文件上传失败: 未返回有效的 upload_url");
            }

            await sendFileUpload(fileUpload.upload_url, typedBlob, contentType, apiKey, filename);

            return fileUpload.id;
        } catch (error) {
            throw error;
        }
    }

    // -----------------------
    // 网络请求
    // -----------------------
    async function fetchJson(url, opts, retries = 2) {
        let lastErr = null;
        for (let i = 0; i <= retries; i++) {
            try {
                const res = await fetch(url, opts);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
            } catch (e) {
                lastErr = e;
                if (i < retries) await sleep(250 * (i + 1));
            }
        }
        throw lastErr || new Error("fetchJson failed");
    }

    function getRequestOpts() {
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        const headers = { "x-requested-with": "XMLHttpRequest" };
        if (csrf) headers["x-csrf-token"] = csrf;
        return { headers };
    }

    // -----------------------
    // 拉取所有帖子
    // -----------------------
    async function fetchAllPostsDetailed(topicId) {
        const opts = getRequestOpts();

        const idData = await fetchJson(
            `${window.location.origin}/t/${topicId}/post_ids.json?post_number=0&limit=99999`,
            opts
        );
        let postIds = idData.post_ids || [];

        const mainData = await fetchJson(`${window.location.origin}/t/${topicId}.json`, opts);
        const mainFirstPost = mainData.post_stream?.posts?.[0];
        if (mainFirstPost && !postIds.includes(mainFirstPost.id)) postIds.unshift(mainFirstPost.id);

        const opUsername =
            mainData?.details?.created_by?.username ||
            mainData?.post_stream?.posts?.[0]?.username ||
            "";

        const domCategory = document.querySelector(".badge-category__name")?.textContent?.trim() || "";
        const domTags = Array.from(document.querySelectorAll(".discourse-tag"))
            .map((t) => t.textContent.trim())
            .filter(Boolean);

        const topic = {
            topicId: String(topicId || ""),
            title: mainData?.title ? String(mainData.title) : document.title,
            category: domCategory,
            tags: (Array.isArray(mainData?.tags) && mainData.tags.length ? mainData.tags : domTags) || [],
            url: window.location.href,
            opUsername: opUsername || "",
        };

        let allPosts = [];
        for (let i = 0; i < postIds.length; i += 200) {
            const chunk = postIds.slice(i, i + 200);
            const q = chunk.map((id) => `post_ids[]=${encodeURIComponent(id)}`).join("&");
            const data = await fetchJson(
                `${window.location.origin}/t/${topicId}/posts.json?${q}&include_suggested=false`,
                opts
            );
            const posts = data.post_stream?.posts || [];
            allPosts = allPosts.concat(posts);
            ui.setProgress(Math.min(i + 200, postIds.length), postIds.length, "拉取帖子数据");
        }

        allPosts.sort((a, b) => a.post_number - b.post_number);
        return { topic, posts: allPosts };
    }

    // -----------------------
    // 筛选
    // -----------------------
    function postHasImageFast(post) {
        const cooked = post?.cooked || "";
        return cooked.includes("<img");
    }

    function buildPlainCache(posts) {
        const cache = new Map();
        for (const p of posts) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(p.cooked || "", "text/html");
            const text = doc.body.textContent || "";
            cache.set(p.id, text);
        }
        return cache;
    }

    function applyFilters(topic, posts, settings) {
        const { rangeMode, rangeStart, rangeEnd, onlyFirst, filters } = settings;
        const op = (topic.opUsername || "").toLowerCase();

        const wantUsers = new Set(normalizeListInput(filters.users).map((u) => u.toLowerCase()));
        const includeKws = normalizeListInput(filters.include);
        const excludeKws = normalizeListInput(filters.exclude);
        const minLen = clampInt(filters.minLen, 0, 999999, 0);

        const needTextCheck = includeKws.length > 0 || excludeKws.length > 0 || minLen > 0;
        const plainCache = needTextCheck ? buildPlainCache(posts) : null;

        const inRange = (n) => {
            if (rangeMode !== "range") return true;
            return n >= rangeStart && n <= rangeEnd;
        };

        const matchKeywords = (txt, kws) => {
            if (!kws.length) return true;
            const low = txt.toLowerCase();
            return kws.some((k) => low.includes(k.toLowerCase()));
        };

        const hitExclude = (txt, kws) => {
            if (!kws.length) return false;
            const low = txt.toLowerCase();
            return kws.some((k) => low.includes(k.toLowerCase()));
        };

        const selected = [];
        for (const p of posts) {
            const pn = p.post_number || 0;

            // 如果启用了"只导出主题（1楼）"，则只保留第1楼
            if (onlyFirst && pn !== 1) continue;

            if (!inRange(pn)) continue;

            if (filters.onlyOp && op) {
                if ((p.username || "").toLowerCase() !== op) continue;
            }

            if (wantUsers.size) {
                if (!wantUsers.has((p.username || "").toLowerCase())) continue;
            }

            // 图片筛选
            if (filters.imgFilter === "withImg") {
                if (!postHasImageFast(p)) continue;
            } else if (filters.imgFilter === "noImg") {
                if (postHasImageFast(p)) continue;
            }

            if (needTextCheck) {
                const txt = plainCache.get(p.id) || "";
                if (minLen > 0 && txt.replace(/\s+/g, "").length < minLen) continue;
                if (!matchKeywords(txt, includeKws)) continue;
                if (hitExclude(txt, excludeKws)) continue;
            }

            selected.push(p);
        }

        return { selected, opUsername: topic.opUsername || "" };
    }

    function buildFilterSummary(settings, topic) {
        const { rangeMode, rangeStart, rangeEnd, onlyFirst, filters } = settings;
        const parts = [];
        if (onlyFirst) {
            parts.push("只导出主题（1楼）");
        } else {
            parts.push(rangeMode === "range" ? `范围=${rangeStart}-${rangeEnd}` : "范围=全部");
        }
        if (filters.onlyOp) parts.push(`只楼主=@${topic.opUsername || "OP"}`);
        if (filters.imgFilter === "withImg") parts.push("仅含图");
        if (filters.imgFilter === "noImg") parts.push("仅无图");
        if ((filters.users || "").trim()) parts.push(`用户=${filters.users.trim()}`);
        if ((filters.include || "").trim()) parts.push(`包含=${filters.include.trim()}`);
        if ((filters.exclude || "").trim()) parts.push(`排除=${filters.exclude.trim()}`);
        if ((filters.minLen || 0) > 0) parts.push(`最短=${filters.minLen}`);
        return parts.join("；");
    }

    // -----------------------
    // Panel UI
    // -----------------------
    const ui = {
        container: null,
        progressBar: null,
        progressText: null,
        statusText: null,
        btnNotion: null,
        btnOpenNotion: null,

        selRangeMode: null,
        inputRangeStart: null,
        inputRangeEnd: null,

        chkOnlyOp: null,
        selImgFilter: null,
        inputUsers: null,
        inputInclude: null,
        inputExclude: null,
        inputMinLen: null,

        advancedWrap: null,
        notionWrap: null,

        inputNotionApiKey: null,

        init() {
            if (this.container) return;

            const wrap = document.createElement("div");
            wrap.id = "ld-notion-panel";
            wrap.innerHTML = `
<!-- 最小化标签 -->
<div id="ld-mini-tab" style="
  position:fixed;z-index:99999;
  background:linear-gradient(180deg,rgba(15,23,42,.95),rgba(30,41,59,.98));
  border:1px solid rgba(148,163,184,0.25);border-radius:12px;
  box-shadow:0 24px 60px rgba(2,6,23,.7),0 2px 6px rgba(0,0,0,.45);
  padding:10px 14px;
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
  font-size:12px;color:#e5e7eb;user-select:none;
  cursor:move;
  display:none;
  min-width:140px;
">
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-size:16px;color:#6366f1;">◆</span>
    <button id="ld-mini-export" style="
      flex:1;border:none;border-radius:8px;padding:7px 12px;
      font-size:12px;font-weight:700;cursor:pointer;
      background:#6366f1;color:#fff;
      transition:all 0.2s;
    ">导出</button>
    <button id="ld-mini-expand" style="
      border:none;border-radius:8px;padding:7px 10px;
      font-size:12px;font-weight:600;cursor:pointer;
      background:rgba(148,163,184,0.2);color:#cbd5e1;
      transition:all 0.2s;
    ">展开</button>
  </div>
</div>

<!-- 完整面板 -->
<div id="ld-panel-container" style="
  position:fixed;bottom:16px;right:16px;z-index:99999;
  width:320px;max-height:90vh;overflow-y:auto;overflow-x:hidden;
  background:linear-gradient(180deg,rgba(15,23,42,.95),rgba(30,41,59,.98));
  border:1px solid rgba(148,163,184,0.25);border-radius:18px;
  box-shadow:0 24px 60px rgba(2,6,23,.7),0 2px 6px rgba(0,0,0,.45);
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
  font-size:13px;color:#e5e7eb;user-select:none;">

  <div id="ld-header" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px 8px;border-bottom:1px solid rgba(148,163,184,0.15);">
    <span style="font-weight:800;font-size:14px;color:#f8fafc;"><span style="color:#6366f1;">◆</span> Linux.do Notion Export</span>
    <div style="display:flex;align-items:center;gap:8px;">
      <span id="ld-minimize-btn" style="color:#94a3b8;font-size:14px;cursor:pointer;" title="最小化">−</span>
      <span id="ld-notion-toggle" style="color:#94a3b8;font-size:14px;cursor:pointer;">▾</span>
    </div>
  </div>

  <div id="ld-notion-body" style="padding:10px 14px 14px;">
    <div style="background:rgba(30,41,59,0.8);border:1px solid rgba(148,163,184,0.15);border-radius:10px;padding:8px 10px;margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:6px;">
        <div id="ld-progress-bar" style="flex:1;height:6px;border-radius:99px;background:rgba(148,163,184,0.2);overflow:hidden;">
          <div id="ld-progress-fill" style="width:0%;height:100%;background:#6366f1;transition:width .2s;"></div>
        </div>
        <span id="ld-progress-text" style="min-width:60px;text-align:right;font-size:11px;color:#a5b4fc;">准备就绪</span>
      </div>
      <div id="ld-status" style="margin-top:5px;font-size:11px;color:#6ee7b7;word-break:break-all;"></div>
    </div>

    <button id="ld-open-notion" style="
      width:100%;margin-bottom:10px;display:none;
      border:none;border-radius:10px;padding:11px 12px;
      font-size:13px;font-weight:700;cursor:pointer;color:white;
      background:#10b981;
    ">🔗 打开 Notion 页面</button>

    <button id="ld-export-notion" style="
      width:100%;margin-bottom:10px;
      border:none;border-radius:10px;padding:11px 12px;
      font-size:13px;font-weight:700;cursor:pointer;color:white;
      background:#6366f1;
    ">导出到 Notion</button>

    <div id="ld-notion-config-toggle" style="
      display:flex;align-items:center;justify-content:space-between;
      padding:8px 0;cursor:pointer;font-size:12px;color:#cbd5e1;
      border-top:1px solid rgba(148,163,184,0.1);margin-top:4px;
    "><span>▸ Notion 连接设置</span><span id="ld-notion-arrow" style="font-size:10px;">▾</span></div>

    <div id="ld-notion-wrap" style="display:none;padding-top:8px;">
      <input id="ld-notion-api-key" type="password" placeholder="Notion API Key（在 Notion Integrations 中创建）" style="width:100%;margin-bottom:6px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;font-size:12px;outline:none;" />
      <input id="ld-notion-page-id" type="text" placeholder="父页面 ID（从 Notion 页面 URL 复制）" style="width:100%;margin-bottom:6px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;font-size:12px;outline:none;" />
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
        <span style="color:#cbd5e1;font-size:12px;white-space:nowrap;">文件处理：</span>
        <select id="ld-notion-img-mode" style="flex:1;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:6px 10px;font-size:12px;outline:none;">
          <option value="external">直接引用（快速）</option>
          <option value="upload">上传到 Notion（推荐）</option>
          <option value="skip">跳过文件</option>
        </select>
      </div>
      <div style="color:#94a3b8;font-size:10px;line-height:1.4;margin-bottom:6px;">
        💡 上传到 Notion 模式会将文件永久保存在 Notion 中，但导出速度较慢
      </div>
      <div style="color:#94a3b8;font-size:10px;line-height:1.4;">
        提示：1. 访问 <a href="https://www.notion.so/my-integrations" target="_blank" style="color:#60a5fa;">Notion Integrations</a> 创建 Integration<br/>
        2. 在 Notion 中创建一个父页面，将 Integration 添加到该页面<br/>
        3. 复制页面 URL 中的 ID（32位字符串）
      </div>
    </div>

    <div id="ld-advanced-toggle" style="
      display:flex;align-items:center;justify-content:space-between;
      padding:8px 0;cursor:pointer;font-size:12px;color:#cbd5e1;
      border-top:1px solid rgba(148,163,184,0.1);margin-top:4px;
    "><span>▸ 高级筛选</span><span id="ld-advanced-arrow" style="font-size:10px;">▾</span></div>

    <div id="ld-advanced-wrap" style="display:none;padding-top:8px;">
      <div style="font-size:12px;font-weight:700;color:#e5e7eb;margin-bottom:8px;">楼层范围</div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <select id="ld-range-mode" style="background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:6px 10px;font-size:12px;outline:none;">
          <option value="all">全部楼层</option>
          <option value="range">指定范围</option>
        </select>
        <input id="ld-range-start" type="number" placeholder="起始" style="width:60px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:6px 8px;font-size:12px;outline:none;" />
        <span style="color:#94a3b8;">-</span>
        <input id="ld-range-end" type="number" placeholder="结束" style="width:60px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:6px 8px;font-size:12px;outline:none;" />
      </div>
      <div style="margin-bottom:8px;">
        <label style="display:flex;align-items:center;gap:4px;color:#cbd5e1;font-size:12px;">
          <input id="ld-only-first" type="checkbox" style="accent-color:#6366f1;" /> 只导出主题（1楼）
        </label>
      </div>

      <div style="height:1px;background:rgba(148,163,184,0.1);margin:10px 0;"></div>

      <div style="font-size:12px;font-weight:700;color:#e5e7eb;margin-bottom:8px;">筛选条件</div>
      <div style="display:flex;gap:12px;margin-bottom:8px;">
        <label style="display:flex;align-items:center;gap:4px;color:#cbd5e1;font-size:12px;">
          <input id="ld-only-op" type="checkbox" style="accent-color:#6366f1;" /> 只看楼主
        </label>
      </div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <span style="color:#cbd5e1;font-size:12px;white-space:nowrap;">图片筛选：</span>
        <select id="ld-img-filter" style="flex:1;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:6px 10px;font-size:12px;outline:none;">
          <option value="none">无（不筛选）</option>
          <option value="withImg">仅含图楼层</option>
          <option value="noImg">仅无图楼层</option>
        </select>
      </div>
      <input id="ld-users" type="text" placeholder="指定用户（逗号分隔）" style="width:100%;margin-bottom:6px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;font-size:12px;outline:none;" />
      <input id="ld-include" type="text" placeholder="包含关键词（逗号分隔）" style="width:100%;margin-bottom:6px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;font-size:12px;outline:none;" />
      <input id="ld-exclude" type="text" placeholder="排除关键词（逗号分隔）" style="width:100%;margin-bottom:6px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;font-size:12px;outline:none;" />
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <span style="color:#cbd5e1;font-size:12px;">最少字数：</span>
        <input id="ld-minlen" type="number" placeholder="0" style="width:80px;background:rgba(15,23,42,0.8);color:#e5e7eb;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:6px 8px;font-size:12px;outline:none;" />
      </div>
    </div>
  </div>
</div>`;
            document.body.appendChild(wrap);
            this.container = wrap;

            const panelContainer = wrap.querySelector("#ld-panel-container");
            const miniTab = wrap.querySelector("#ld-mini-tab");

            // 恢复最小化状态
            const isMinimized = GM_getValue(K.PANEL_MINIMIZED, false);

            // 恢复或设置最小化标签位置
            const savedMiniX = GM_getValue(K.MINI_POS_X, null);
            const savedMiniY = GM_getValue(K.MINI_POS_Y, null);

            // 确保位置在屏幕范围内的函数
            const ensureMiniTabInBounds = () => {
                const rect = miniTab.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                let currentX = rect.left;
                let currentY = rect.top;
                let needsUpdate = false;

                if (currentX < 0 || currentX > maxX || currentY < 0 || currentY > maxY) {
                    currentX = Math.max(0, Math.min(currentX, maxX));
                    currentY = Math.max(0, Math.min(currentY, maxY));
                    needsUpdate = true;
                }

                if (needsUpdate) {
                    miniTab.style.right = "auto";
                    miniTab.style.bottom = "auto";
                    miniTab.style.transform = "none";
                    miniTab.style.left = currentX + "px";
                    miniTab.style.top = currentY + "px";
                    GM_setValue(K.MINI_POS_X, currentX);
                    GM_setValue(K.MINI_POS_Y, currentY);
                }
            };

            if (savedMiniX !== null && savedMiniY !== null) {
                // 检查保存的位置是否在当前屏幕范围内
                const maxX = window.innerWidth - 140; // 最小宽度约140px
                const maxY = window.innerHeight - 50;  // 最小高度约50px
                const safeX = Math.max(0, Math.min(savedMiniX, maxX));
                const safeY = Math.max(0, Math.min(savedMiniY, maxY));
                miniTab.style.left = safeX + "px";
                miniTab.style.top = safeY + "px";
            } else {
                // 默认位置：右侧中间
                miniTab.style.right = "16px";
                miniTab.style.top = "50%";
                miniTab.style.transform = "translateY(-50%)";
            }

            // 监听窗口大小变化，确保标签始终在屏幕内
            window.addEventListener("resize", () => {
                if (miniTab.style.display !== "none") {
                    ensureMiniTabInBounds();
                }
            });

            // 根据状态显示对应的UI
            if (isMinimized) {
                panelContainer.style.display = "none";
                miniTab.style.display = "block";
            } else {
                panelContainer.style.display = "block";
                miniTab.style.display = "none";
            }

            // 最小化标签拖拽功能
            let isMiniDragging = false;
            let startX = 0;
            let startY = 0;
            let initialX = 0;
            let initialY = 0;

            miniTab.addEventListener("mousedown", (e) => {
                // 不在按钮上时才触发拖拽
                if (e.target.id === "ld-mini-export" || e.target.id === "ld-mini-expand") return;

                isMiniDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = miniTab.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;

                // 移除 right/bottom/transform 定位，改用 left/top
                miniTab.style.right = "auto";
                miniTab.style.bottom = "auto";
                miniTab.style.transform = "none";
                miniTab.style.left = initialX + "px";
                miniTab.style.top = initialY + "px";

                e.preventDefault();
            });

            document.addEventListener("mousemove", (e) => {
                if (!isMiniDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newX = initialX + deltaX;
                let newY = initialY + deltaY;

                // 边界限制
                const maxX = window.innerWidth - miniTab.offsetWidth;
                const maxY = window.innerHeight - miniTab.offsetHeight;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                miniTab.style.left = newX + "px";
                miniTab.style.top = newY + "px";
            });

            document.addEventListener("mouseup", () => {
                if (isMiniDragging) {
                    isMiniDragging = false;

                    // 保存位置
                    const rect = miniTab.getBoundingClientRect();
                    GM_setValue(K.MINI_POS_X, rect.left);
                    GM_setValue(K.MINI_POS_Y, rect.top);
                }
            });

            // 最小化/展开切换
            const minimizeBtn = wrap.querySelector("#ld-minimize-btn");
            const expandBtn = wrap.querySelector("#ld-mini-expand");

            minimizeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                panelContainer.style.display = "none";
                miniTab.style.display = "block";
                GM_setValue(K.PANEL_MINIMIZED, true);
            });

            expandBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                miniTab.style.display = "none";
                panelContainer.style.display = "block";
                GM_setValue(K.PANEL_MINIMIZED, false);
            });

            this.progressBar = wrap.querySelector("#ld-progress-fill");
            this.progressText = wrap.querySelector("#ld-progress-text");
            this.statusText = wrap.querySelector("#ld-status");
            this.btnNotion = wrap.querySelector("#ld-export-notion");
            this.btnOpenNotion = wrap.querySelector("#ld-open-notion");

            this.selRangeMode = wrap.querySelector("#ld-range-mode");
            this.inputRangeStart = wrap.querySelector("#ld-range-start");
            this.inputRangeEnd = wrap.querySelector("#ld-range-end");
            this.chkOnlyFirst = wrap.querySelector("#ld-only-first");

            this.chkOnlyOp = wrap.querySelector("#ld-only-op");
            this.selImgFilter = wrap.querySelector("#ld-img-filter");
            this.inputUsers = wrap.querySelector("#ld-users");
            this.inputInclude = wrap.querySelector("#ld-include");
            this.inputExclude = wrap.querySelector("#ld-exclude");
            this.inputMinLen = wrap.querySelector("#ld-minlen");

            this.advancedWrap = wrap.querySelector("#ld-advanced-wrap");
            this.notionWrap = wrap.querySelector("#ld-notion-wrap");

            this.inputNotionApiKey = wrap.querySelector("#ld-notion-api-key");
            this.inputNotionPageId = wrap.querySelector("#ld-notion-page-id");
            this.selNotionImgMode = wrap.querySelector("#ld-notion-img-mode");

            // 恢复状态
            const rangeMode = GM_getValue(K.RANGE_MODE, DEFAULTS.rangeMode);
            const rangeStart = GM_getValue(K.RANGE_START, DEFAULTS.rangeStart);
            const rangeEnd = GM_getValue(K.RANGE_END, DEFAULTS.rangeEnd);
            const onlyFirst = GM_getValue(K.FILTER_ONLY_FIRST, DEFAULTS.onlyFirst);
            const onlyOp = GM_getValue(K.FILTER_ONLY_OP, DEFAULTS.onlyOp);
            const imgFilter = GM_getValue(K.FILTER_IMG, DEFAULTS.imgFilter);
            const users = GM_getValue(K.FILTER_USERS, DEFAULTS.users);
            const include = GM_getValue(K.FILTER_INCLUDE, DEFAULTS.include);
            const exclude = GM_getValue(K.FILTER_EXCLUDE, DEFAULTS.exclude);
            const minLen = GM_getValue(K.FILTER_MINLEN, DEFAULTS.minLen);
            const notionApiKey = GM_getValue(K.NOTION_API_KEY, DEFAULTS.notionApiKey);
            const notionPageId = GM_getValue(K.NOTION_PAGE_ID, DEFAULTS.notionPageId);
            const notionImgMode = GM_getValue(K.NOTION_IMG_MODE, DEFAULTS.notionImgMode);

            this.selRangeMode.value = rangeMode;
            this.inputRangeStart.value = String(rangeStart);
            this.inputRangeEnd.value = String(rangeEnd);
            this.chkOnlyFirst.checked = !!onlyFirst;
            this.chkOnlyOp.checked = !!onlyOp;
            this.selImgFilter.value = imgFilter || DEFAULTS.imgFilter;
            this.inputUsers.value = users || "";
            this.inputInclude.value = include || "";
            this.inputExclude.value = exclude || "";
            this.inputMinLen.value = String(minLen || 0);
            this.inputNotionApiKey.value = notionApiKey || "";
            this.inputNotionPageId.value = notionPageId || "";
            this.selNotionImgMode.value = notionImgMode || DEFAULTS.notionImgMode;

            // 面板折叠
            const toggleIcon = wrap.querySelector("#ld-notion-toggle");
            const bodyDiv = wrap.querySelector("#ld-notion-body");
            const collapsed = GM_getValue(K.PANEL_COLLAPSED, false);
            if (collapsed) {
                bodyDiv.style.display = "none";
                toggleIcon.textContent = "▴";
            }

            // 只在点击折叠按钮时触发折叠
            toggleIcon.addEventListener("click", (e) => {
                e.stopPropagation();
                const isHidden = bodyDiv.style.display === "none";
                bodyDiv.style.display = isHidden ? "" : "none";
                toggleIcon.textContent = isHidden ? "▾" : "▴";
                GM_setValue(K.PANEL_COLLAPSED, !isHidden);
            });

            // Notion 设置面板展开
            const notionBtn = wrap.querySelector("#ld-notion-config-toggle");
            const notionArrow = wrap.querySelector("#ld-notion-arrow");
            const notionPanelOpen = GM_getValue(K.NOTION_PANEL_OPEN, false);
            const notionApiKeyEmpty = !GM_getValue(K.NOTION_API_KEY, "");
            if (notionApiKeyEmpty || notionPanelOpen) {
                this.notionWrap.style.display = "";
                notionArrow.textContent = "▴";
            }
            notionBtn.addEventListener("click", () => {
                const open = this.notionWrap.style.display !== "none";
                this.notionWrap.style.display = open ? "none" : "";
                notionArrow.textContent = open ? "▾" : "▴";
                GM_setValue(K.NOTION_PANEL_OPEN, !open);
            });

            // 高级设置展开
            const advBtn = wrap.querySelector("#ld-advanced-toggle");
            const advArrow = wrap.querySelector("#ld-advanced-arrow");
            const advOpen = GM_getValue(K.ADVANCED_OPEN, false);
            if (advOpen) {
                this.advancedWrap.style.display = "";
                advArrow.textContent = "▴";
            }
            advBtn.addEventListener("click", () => {
                const open = this.advancedWrap.style.display !== "none";
                this.advancedWrap.style.display = open ? "none" : "";
                advArrow.textContent = open ? "▾" : "▴";
                GM_setValue(K.ADVANCED_OPEN, !open);
            });

            // 保存配置事件
            const saveRange = () => {
                const mode = this.selRangeMode.value === "range" ? "range" : "all";
                const start = clampInt(this.inputRangeStart.value, 1, 999999, DEFAULTS.rangeStart);
                const end = clampInt(this.inputRangeEnd.value, 1, 999999, DEFAULTS.rangeEnd);
                const onlyFirst = !!this.chkOnlyFirst.checked;
                GM_setValue(K.RANGE_MODE, mode);
                GM_setValue(K.RANGE_START, start);
                GM_setValue(K.RANGE_END, end);
                GM_setValue(K.FILTER_ONLY_FIRST, onlyFirst);
                const disabled = mode !== "range";
                this.inputRangeStart.disabled = disabled;
                this.inputRangeEnd.disabled = disabled;
                this.inputRangeStart.style.opacity = disabled ? "0.55" : "1";
                this.inputRangeEnd.style.opacity = disabled ? "0.55" : "1";
            };
            this.selRangeMode.addEventListener("change", saveRange);
            this.inputRangeStart.addEventListener("change", saveRange);
            this.inputRangeEnd.addEventListener("change", saveRange);
            this.chkOnlyFirst.addEventListener("change", saveRange);
            saveRange();

            const saveFilters = () => {
                GM_setValue(K.FILTER_ONLY_OP, !!this.chkOnlyOp.checked);
                GM_setValue(K.FILTER_IMG, this.selImgFilter.value || "none");
                GM_setValue(K.FILTER_USERS, this.inputUsers.value || "");
                GM_setValue(K.FILTER_INCLUDE, this.inputInclude.value || "");
                GM_setValue(K.FILTER_EXCLUDE, this.inputExclude.value || "");
                GM_setValue(K.FILTER_MINLEN, clampInt(this.inputMinLen.value, 0, 999999, 0));
            };
            [this.chkOnlyOp].forEach((el) => el.addEventListener("change", saveFilters));
            [this.selImgFilter].forEach((el) => el.addEventListener("change", saveFilters));
            [this.inputUsers, this.inputInclude, this.inputExclude, this.inputMinLen].forEach((el) => el.addEventListener("change", saveFilters));

            // Notion 配置保存
            this.inputNotionApiKey.addEventListener("change", () => GM_setValue(K.NOTION_API_KEY, this.inputNotionApiKey.value || ""));
            this.inputNotionPageId.addEventListener("change", () => GM_setValue(K.NOTION_PAGE_ID, this.inputNotionPageId.value || ""));
            this.selNotionImgMode.addEventListener("change", () => GM_setValue(K.NOTION_IMG_MODE, this.selNotionImgMode.value || DEFAULTS.notionImgMode));

            this.setProgress(0, 1, "准备就绪");
            this.setStatus("", "#6ee7b7");
            this.setBusy(false);
        },

        getSettings() {
            const rangeMode = this.selRangeMode.value === "range" ? "range" : "all";
            const rangeStart = clampInt(this.inputRangeStart.value, 1, 999999, DEFAULTS.rangeStart);
            const rangeEnd = clampInt(this.inputRangeEnd.value, 1, 999999, DEFAULTS.rangeEnd);
            const onlyFirst = !!this.chkOnlyFirst.checked;

            const onlyOp = !!this.chkOnlyOp.checked;
            const imgFilter = this.selImgFilter.value || DEFAULTS.imgFilter;
            const users = this.inputUsers.value || "";
            const include = this.inputInclude.value || "";
            const exclude = this.inputExclude.value || "";
            const minLen = clampInt(this.inputMinLen.value, 0, 999999, 0);

            const notionApiKey = this.inputNotionApiKey.value || "";
            const notionPageId = this.inputNotionPageId.value || "";
            const notionImgMode = this.selNotionImgMode.value || DEFAULTS.notionImgMode;

            return {
                rangeMode,
                rangeStart,
                rangeEnd,
                onlyFirst,
                filters: { onlyOp, imgFilter, users, include, exclude, minLen },
                notion: { apiKey: notionApiKey, pageId: notionPageId, imgMode: notionImgMode },
            };
        },

        setProgress(completed, total, stageText) {
            if (!this.container) this.init();
            total = total || 1;
            const percent = Math.round((completed / total) * 100);
            this.progressBar.style.width = percent + "%";
            this.progressText.textContent = `${stageText} (${completed}/${total}，${percent}%)`;
        },

        setStatus(msg, color) {
            if (!this.container) this.init();
            this.statusText.textContent = msg;
            this.statusText.style.color = color || "#6ee7b7";
        },

        setBusy(busy) {
            if (!this.container) this.init();
            this.btnNotion.disabled = busy;
            this.btnNotion.style.opacity = busy ? "0.6" : "1";
        },
    };

    // -----------------------
    // 导出主流程
    // -----------------------
    async function exportToNotion() {
        const topicId = getTopicId();
        if (!topicId) return alert("未检测到帖子 ID");

        ui.init();

        // 如果是最小化状态，自动展开面板以显示进度
        const panelContainer = document.querySelector("#ld-panel-container");
        const miniTab = document.querySelector("#ld-mini-tab");
        const wasMinimized = GM_getValue(K.PANEL_MINIMIZED, false);

        if (wasMinimized) {
            miniTab.style.display = "none";
            panelContainer.style.display = "block";
            GM_setValue(K.PANEL_MINIMIZED, false);
        }

        ui.setBusy(true);
        ui.setStatus("正在拉取帖子内容…", "#6366f1");
        ui.setProgress(0, 1, "准备中");

        try {
            const settings = ui.getSettings();

            if (!settings.notion.apiKey) {
                ui.notionWrap.style.display = "";
                ui.container.querySelector("#ld-notion-arrow").textContent = "▴";
                GM_setValue(K.NOTION_PANEL_OPEN, true);

                ui.setStatus("⚠️ 请先配置 Notion API Key", "#facc15");
                ui.setBusy(false);
                return;
            }

            if (!settings.notion.pageId) {
                ui.notionWrap.style.display = "";
                ui.container.querySelector("#ld-notion-arrow").textContent = "▴";
                GM_setValue(K.NOTION_PANEL_OPEN, true);

                ui.setStatus("⚠️ 请先配置 Notion 父页面 ID", "#facc15");
                ui.setBusy(false);
                return;
            }

            const data = await fetchAllPostsDetailed(topicId);

            if (settings.rangeMode === "range" && settings.rangeStart > settings.rangeEnd) {
                ui.setStatus("⚠️ 起始楼层不能大于结束楼层", "#facc15");
                ui.setBusy(false);
                return;
            }

            const { selected } = applyFilters(data.topic, data.posts, settings);

            if (!selected.length) {
                ui.setStatus("筛选后无可导出的楼层", "#facc15");
                ui.setBusy(false);
                return;
            }

            ui.setStatus("正在转换为 Notion 格式…", "#6366f1");

            // 构建页面内容
            let blocks = [];

            // 添加帖子信息 callout
            const now = new Date();
            const filterSummary = buildFilterSummary(settings, data.topic);

            // 构建信息块的子内容
            const infoChildren = [];

            // 原始链接 - 使用超链接格式
            infoChildren.push({
                type: "paragraph",
                paragraph: {
                    rich_text: [
                        { type: "text", text: { content: "原始链接: " } },
                        { type: "text", text: { content: data.topic.url, link: { url: data.topic.url } } }
                    ],
                },
            });

            // 其他信息 - 纯文本
            const otherInfo = [
                `主题 ID: ${data.topic.topicId}`,
                `楼主: @${data.topic.opUsername || "未知"}`,
                `分类: ${data.topic.category || "无"}`,
                `标签: ${data.topic.tags.join(", ")}`,
                `导出时间: ${now.toLocaleString("zh-CN")}`,
                `楼层数: ${selected.length}`,
            ];
            if (filterSummary) {
                otherInfo.push(`筛选条件: ${filterSummary}`);
            }

            otherInfo.forEach(line => {
                infoChildren.push({
                    type: "paragraph",
                    paragraph: {
                        rich_text: [{ type: "text", text: { content: line } }],
                    },
                });
            });

            blocks.push({
                type: "callout",
                callout: {
                    icon: { type: "emoji", emoji: "ℹ️" },
                    rich_text: [{ type: "text", text: { content: "帖子信息" } }],
                    children: infoChildren,
                },
            });

            // 添加分隔线
            blocks.push({
                type: "divider",
                divider: {},
            });

            // 添加所有楼层
            ui.setStatus("正在生成楼层内容…", "#6366f1");
            let processedCount = 0;
            for (const post of selected) {
                const postBlock = generatePostCalloutBlock(post, data.topic, settings);
                blocks.push(postBlock);
                processedCount++;
                if (processedCount % 10 === 0) {
                    ui.setProgress(processedCount, selected.length, "生成楼层");
                }
            }

            // 批量上传文件到 Notion (如果选择了 upload 模式)
            if (settings.notion.imgMode === "upload") {
                ui.setStatus("正在上传文件到 Notion…", "#6366f1");

                // 收集所有需要上传的文件（包括图片和附件）
                const filesToUpload = [];
                const fileUrlCache = new Map(); // URL → FileUpload ID 缓存,用于去重

                const collectFiles = (blocks) => {
                    for (const block of blocks) {
                        if (block._needsUpload && block._originalUrl) {
                            // 检查是否已经在列表中(去重)
                            if (!fileUrlCache.has(block._originalUrl)) {
                                filesToUpload.push(block);
                                fileUrlCache.set(block._originalUrl, null); // 占位
                            }
                        }
                        // 递归处理子 blocks
                        if (block.callout?.children) {
                            collectFiles(block.callout.children);
                        }
                        if (block.quote?.children) {
                            collectFiles(block.quote.children);
                        }
                        if (block.table?.children) {
                            collectFiles(block.table.children);
                        }
                    }
                };
                collectFiles(blocks);

                if (filesToUpload.length > 0) {
                    ui.setStatus(`正在上传 ${filesToUpload.length} 个文件到 Notion…`, "#6366f1");

                    // 批量上传文件
                    let uploadedCount = 0;
                    let failedCount = 0;
                    let unsupportedCount = 0;

                    for (const fileBlock of filesToUpload) {
                        const fileUrl = fileBlock._originalUrl;
                        const fileName = fileBlock._fileName || '未命名';

                        try {
                            const fileUploadId = await uploadFileToNotion(
                                fileUrl, 
                                settings.notion.apiKey,
                                fileName
                            );

                            // 缓存 FileUpload ID
                            fileUrlCache.set(fileUrl, fileUploadId);
                            uploadedCount++;

                            ui.setProgress(uploadedCount + failedCount + unsupportedCount, filesToUpload.length, "上传文件");
                        } catch (error) {
                            const errorMsg = error.message || String(error);

                            if (errorMsg.startsWith("UNSUPPORTED_FILE_TYPE")) {
                                unsupportedCount++;
                                fileUrlCache.set(fileUrl, "UNSUPPORTED");
                            } else {
                                failedCount++;
                                fileUrlCache.set(fileUrl, "FAILED");
                            }
                        }

                        // 避免速率限制
                        await sleep(250);
                    }

                    // 更新所有文件 block
                    const updateFileBlocks = (blocks) => {
                        return blocks.filter(block => {
                            if (block._needsUpload && block._originalUrl) {
                                const fileUploadId = fileUrlCache.get(block._originalUrl);
                                // 如果上传成功且文件类型支持，更新 block
                                if (fileUploadId && fileUploadId !== "FAILED" && fileUploadId !== "UNSUPPORTED") {
                                    // 根据文件类型更新对应的属性
                                    if (block._fileType === "image") {
                                        // 更新图片 block
                                        block.image = {
                                            type: "file_upload",
                                            file_upload: { id: fileUploadId },
                                        };
                                    } else {
                                        // 更新文件 block
                                        block.file = {
                                            type: "file_upload",
                                            file_upload: { id: fileUploadId },
                                            caption: block.file?.caption || [],
                                        };
                                    }
                                    // 清理临时标记
                                    delete block._needsUpload;
                                    delete block._originalUrl;
                                    delete block._fileType;
                                    delete block._fileName;
                                    return true; // 保留这个 block
                                } else {
                                    // 上传失败或不支持的文件，移除这个 block
                                    return false;
                                }
                            }
                            // 递归处理子 blocks
                            if (block.callout?.children) {
                                block.callout.children = updateFileBlocks(block.callout.children);
                            }
                            if (block.quote?.children) {
                                block.quote.children = updateFileBlocks(block.quote.children);
                            }
                            if (block.table?.children) {
                                block.table.children = updateFileBlocks(block.table.children);
                            }
                            return true; // 保留非文件 block
                        });
                    };
                    blocks = updateFileBlocks(blocks);

                    // 构建成功消息
                    let successMsg = `已上传 ${uploadedCount} 个文件`;
                    const details = [];
                    if (unsupportedCount > 0) {
                        details.push(`${unsupportedCount} 个不支持上传`);
                    }
                    if (failedCount > 0) {
                        details.push(`${failedCount} 个失败`);
                    }
                    if (details.length > 0) {
                        successMsg += ` (${details.join(", ")})`;
                    }

                    ui.setStatus(successMsg, "#6ee7b7");
                }
            }

            ui.setStatus("正在创建 Notion 页面…", "#6366f1");

            const pageData = await createNotionPage(data.topic.title, blocks, settings.notion.apiKey, settings.notion.pageId);

            ui.setProgress(1, 1, "导出完成");
            ui.setStatus(`✅ 已导出到 Notion: ${pageData.url}`, "#6ee7b7");

            // 显示打开 Notion 按钮
            ui.btnOpenNotion.style.display = "";
            ui.btnOpenNotion.onclick = () => {
                window.open(pageData.url, "_blank");
            };

            // 3秒后打开页面
            setTimeout(() => {
                if (confirm("导出成功！是否打开 Notion 页面？")) {
                    window.open(pageData.url, "_blank");
                }
            }, 500);
        } catch (e) {
            ui.setStatus("导出失败：" + (e?.message || e), "#fecaca");
            alert("Notion 导出失败：" + (e?.message || e));
        } finally {
            ui.setBusy(false);
        }
    }

    // -----------------------
    // 入口
    // -----------------------
    let lastUrl = "";
    let lastTopicId = null;

    function init() {
        const topicId = getTopicId();

        // 不在帖子页面时隐藏面板
        if (!topicId) {
            if (ui.container) {
                ui.container.style.display = "none";
            }
            lastTopicId = null;
            return;
        }

        // 在帖子页面时显示/初始化面板
        if (ui.container) {
            ui.container.style.display = "";
        } else {
            ui.init();
            ui.btnNotion.addEventListener("click", exportToNotion);

            const miniExportBtn = document.querySelector("#ld-mini-export");
            if (miniExportBtn) {
                miniExportBtn.addEventListener("click", exportToNotion);
            }
        }

        lastTopicId = topicId;
    }

    function checkUrlChange() {
        const currentUrl = window.location.href;
        const currentTopicId = getTopicId();

        // URL 变化或帖子 ID 变化时重新初始化
        if (currentUrl !== lastUrl || currentTopicId !== lastTopicId) {
            lastUrl = currentUrl;
            init();
        }
    }

    // 立即执行一次初始化
    (function immediateInit() {
        lastUrl = window.location.href;
        init();
    })();

    // DOMContentLoaded 时再次检查
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            lastUrl = window.location.href;
            init();
        });
    }

    // load 事件时再次检查
    window.addEventListener("load", () => {
        lastUrl = window.location.href;
        init();
    });

    // 监听浏览器前进/后退
    window.addEventListener("popstate", () => {
        setTimeout(checkUrlChange, 50);
    });

    // 拦截 pushState/replaceState（SPA导航核心）
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(checkUrlChange, 50);
        setTimeout(checkUrlChange, 200);
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(checkUrlChange, 50);
        setTimeout(checkUrlChange, 200);
    };

    // 监听 Discourse 的页面切换事件
    document.addEventListener("page:change", checkUrlChange);
    document.addEventListener("turbo:load", checkUrlChange);

    // 使用 MutationObserver 监听 body 变化（Discourse 会替换主内容区域）
    const bodyObserver = new MutationObserver(() => {
        const topicId = getTopicId();
        if (topicId && !ui.container) {
            init();
        } else if (topicId && ui.container && ui.container.style.display === "none") {
            ui.container.style.display = "";
        }
    });

    if (document.body) {
        bodyObserver.observe(document.body, { childList: true, subtree: false });
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            bodyObserver.observe(document.body, { childList: true, subtree: false });
        });
    }

    // 备用：定期检查（处理边缘情况）
    setInterval(checkUrlChange, 500);
})();
