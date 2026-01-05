// ==UserScript==
// @name         X (Twitter) Grok Commander V20.1 (Multilingual)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  X Post AI Commander [Multi-language precision strike version]. Added "Automatically close the drawing window", "Force clear the input box after sending" and "Traditional Chinese button fingerprint lock". Supports Traditional Chinese, Simplified Chinese, English, Japanese, and Korean.
// @author       GFgatus
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559373/X%20%28Twitter%29%20Grok%20Commander%20V201%20%28Multilingual%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559373/X%20%28Twitter%29%20Grok%20Commander%20V201%20%28Multilingual%29.meta.js
// ==/UserScript==

(function() {
    'use strict';





    const DEFAULT_CONFIG = {
        lang: "auto",
        templates: {
            "zh-TW": {
                factcheck: { label: "事實查核", icon: "🕵️", prompt: "【指令：請進行事實查核】\n請詳細分析以下這則貼文的真實性，指出可能的錯誤、誤導資訊或缺乏證據的地方，並提供正確的背景脈絡：\n\n" },
                analysis: { label: "深度分析", icon: "📊", prompt: "【指令：深度分析】\n請擔任資深的社群觀察家，解析這則推文。請分析其潛在的語氣、情緒導向、目標受眾，以及發文者可能隱含的動機或立場：\n\n" },
                translate: { label: "梗文翻譯", icon: "🌐", prompt: "【指令：翻譯與解釋】\n請將這則推文翻譯成通順、道地的台灣繁體中文（口語化）。如果內容包含網路流行語、迷因（Meme）或文化梗，請務必補充解釋其背景含義：\n\n" },
                tree: { label: "分析樹狀圖", icon: "🌳", prompt: "【指令：結構化 ASCII 樹狀圖】\n請分析這則推文，提取「核心主題」以及相關的「人、事、物」。\n請不要寫任何前言或結語，直接將分析結果轉換為「檔案系統風格」的 ASCII 樹狀圖呈現。\n\n**格式要求：**\n1. 使用 ├──, │, └── 符號。\n2. 根節點是推文主題。\n\n**輸出範例：**\n主題_ROOT\n├── [分類A]\n│   └── 內容\n└── [分類B]\n    └── 內容\n\n以下是推文內容：\n\n" },
                solution: { label: "解決建議", icon: "💡", prompt: "【指令：日常解決辦法建議】\n針對這則推文提到的問題、困境或情境，請提供 3 個具體、可行且務實的「日常解決辦法」或建議：\n\n" }
            },
            "zh-CN": {
                factcheck: { label: "事实核查", icon: "🕵️", prompt: "【指令：请进行事实核查】\n请详细分析以下这则帖子的真实性，指出可能的错误、误导信息或缺乏证据的地方，并提供正确的背景脉络：\n\n" },
                analysis: { label: "深度分析", icon: "📊", prompt: "【指令：深度分析】\n请担任资深的社群观察家，解析这则推文。请分析其潜在的语气、情绪导向、目标受众，以及发文者可能隐含的动机或立场：\n\n" },
                translate: { label: "推文翻译", icon: "🌐", prompt: "【指令：翻译与解释】\n请将这则推文翻译成通顺、地道的简体中文。如果内容包含网络流行语、迷因（Meme）或文化梗，请务必补充解释其背景含义：\n\n" },
                tree: { label: "分析树状图", icon: "🌳", prompt: "【指令：结构化 ASCII 树状图】\n请分析这则推文，提取“核心主题”以及相关的“人、事、物”。\n请不要写任何前言或结语，直接将分析结果转换为“文件系统风格”的 ASCII 树状图呈现。\n\n**格式要求：**\n1. 使用 ├──, │, └── 符号。\n2. 根节点是推文主题。\n\n**输出范例：**\n主题_ROOT\n├── [分类A]\n│   └── 内容\n└── [分类B]\n    └── 内容\n\n以下是推文内容：\n\n" },
                solution: { label: "解决建议", icon: "💡", prompt: "【指令：日常解决办法建议】\n针对这则推文提到的问题、困境或情境，请提供 3 个具体、可行且务实的“日常解决办法”或建议：\n\n" }
            },
            "en": {
                factcheck: { label: "Fact Check", icon: "🕵️", prompt: "[Instruction: Fact Check]\nPlease conduct a detailed fact-check on the following tweet. Point out potential errors, misleading information, or lack of evidence, and provide the correct context:\n\n" },
                analysis: { label: "Deep Analysis", icon: "📊", prompt: "[Instruction: Deep Analysis]\nAct as a social media observer. Analyze this tweet for its tone, emotional direction, target audience, and any implied motives or stances of the author:\n\n" },
                translate: { label: "Translate", icon: "🌐", prompt: "[Instruction: Translate]\nPlease translate this tweet into fluent English. If it contains internet slang, memes, or cultural references, please explain their background meaning:\n\n" },
                tree: { label: "Tree Diagram", icon: "🌳", prompt: "[Instruction: ASCII Tree Diagram]\nAnalyze this tweet to extract the 'Core Theme' and related 'People, Events, Objects'.\nDo not write any intro or outro. Output the result strictly as a 'File System Style' ASCII tree.\n\n**Format:**\n1. Use ├──, │, └── symbols.\n2. Root node is the theme.\n\n**Example:**\nTHEME_ROOT\n├── [Category A]\n│   └── Content\n└── [Category B]\n    └── Content\n\nTweet Content:\n\n" },
                solution: { label: "Solutions", icon: "💡", prompt: "[Instruction: Daily Solutions]\nProvide 3 concrete, actionable, and pragmatic solutions or suggestions for the problem or situation mentioned in this tweet:\n\n" }
            },
            "ja": {
                factcheck: { label: "ファクトチェック", icon: "🕵️", prompt: "【指令：ファクトチェック】\n以下の投稿の真偽を詳細に分析し、誤りや誤解を招く情報、証拠不足の点を指摘し、正しい背景情報を提供してください：\n\n" },
                analysis: { label: "詳細分析", icon: "📊", prompt: "【指令：詳細分析】\nソーシャルメディアの観察者として、このツイートを分析してください。潜在的なトーン、感情の方向性、ターゲット層、そして投稿者の隠された動機や立場を解析してください：\n\n" },
                translate: { label: "翻訳と解説", icon: "🌐", prompt: "【指令：翻訳と解説】\nこのツイートを自然で流暢な日本語に翻訳してください。ネットスラング、ミーム（Meme）、または文化的背景が含まれている場合は、その意味や背景も必ず補足説明してください：\n\n" },
                tree: { label: "構造化分析", icon: "🌳", prompt: "【指令：構造化 ASCII ツリー図】\nこのツイートを分析し、「核心テーマ」および関連する「人・事・物」を抽出してください。\n前置きや結びの言葉は省略し、結果を「ファイルシステム形式」の ASCII ツリー図として直接出力してください。\n\n**フォーマット要求：**\n1. ├──, │, └── 記号を使用。\n2. ルートノードはテーマ。\n\n**出力例：**\nテーマ_ROOT\n├── [分類A]\n│   └── 内容\n└── [分類B]\n    └── 内容\n\nツイート内容：\n\n" },
                solution: { label: "解決策", icon: "💡", prompt: "【指令：解決策の提案】\nこのツイートで言及されている問題、困難、または状況に対して、具体的かつ実行可能で実用的な3つの「解決策」またはアドバイスを提供してください：\n\n" }
            },
            "ko": {
                factcheck: { label: "팩트 체크", icon: "🕵️", prompt: "【명령: 팩트 체크】\n다음 트윗의 진위 여부를 자세히 분석하고, 오류, 오해의 소지가 있는 정보 또는 증거 부족 부분을 지적하며 올바른 배경 정보를 제공하십시오:\n\n" },
                analysis: { label: "심층 분석", icon: "📊", prompt: "【명령: 심층 분석】\n소셜 미디어 관찰자로서 이 트윗을 분석하십시오. 잠재적인 어조, 감정 방향, 타겟 청중, 그리고 작성자의 내재된 동기나 입장을 분석해 주십시오:\n\n" },
                translate: { label: "번역 및 설명", icon: "🌐", prompt: "【명령: 번역 및 설명】\n이 트윗을 자연스럽고 유창한 한국어로 번역하십시오. 인터넷 속어, 밈(Meme) 또는 문화적 맥락이 포함된 경우 그 배경 의미도 반드시 보충 설명해 주십시오:\n\n" },
                tree: { label: "트리 분석", icon: "🌳", prompt: "【명령: 구조화된 ASCII 트리 다이어그램】\n이 트윗을 분석하여 '핵심 주제'와 관련된 '사람, 사건, 사물'을 추출하십시오.\n서론이나 결론은 작성하지 말고, 분석 결과를 '파일 시스템 스타일'의 ASCII 트리 다이어그램으로 직접 변환하여 출력하십시오.\n\n**형식 요구 사항:**\n1. ├──, │, └── 기호를 사용하십시오.\n2. 루트 노드는 주제입니다.\n\n**출력 예시:**\n주제_ROOT\n├── [분류A]\n│   └── 내용\n└── [분류B]\n    └── 내용\n\n트윗 내용:\n\n" },
                solution: { label: "해결 방안", icon: "💡", prompt: "【명령: 해결 방안 제안】\n이 트윗에서 언급된 문제, 어려움 또는 상황에 대해 구체적이고 실행 가능하며 실용적인 3가지 '해결 방안' 또는 조언을 제공하십시오:\n\n" }
            }
        }
    };





    function loadConfig() {
        const saved = GM_getValue("grok_user_config", null);
        if (saved) return JSON.parse(saved);
        return { lang: "auto", customTemplates: null };
    }

    function saveConfig(config) {
        GM_setValue("grok_user_config", JSON.stringify(config));
    }

    function getCurrentTemplates() {
        const config = loadConfig();
        let lang = config.lang;


        if (lang === "auto") {
            const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
            if (browserLang.includes("zh-tw") || browserLang.includes("hk")) {
                lang = "zh-TW";
            } else if (browserLang.includes("zh")) {
                lang = "zh-CN"; // 簡體中文捕捉
            } else if (browserLang.includes("ja")) {
                lang = "ja";    // 日文
            } else if (browserLang.includes("ko")) {
                lang = "ko";    // 韓文
            } else {
                lang = "en";    // 預設英文
            }
        }

        const defaults = DEFAULT_CONFIG.templates[lang] || DEFAULT_CONFIG.templates["en"];
        if (config.customTemplates && config.customTemplates._lang === lang) {
            return config.customTemplates;
        }
        return defaults;
    }





    const STYLES = `
        #grok-commander-menu {
            position: fixed; z-index: 99990;
            background-color: #000000; border: 1px solid #333639;
            border-radius: 12px; box-shadow: 0 8px 16px rgba(255, 255, 255, 0.1);
            padding: 8px; display: flex; flex-direction: column; gap: 4px;
            min-width: 170px; font-family: sans-serif;
            animation: fadeIn 0.15s ease-out;
        }
        .grok-menu-item {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; color: #E7E9EA; font-size: 14px;
            border-radius: 8px; cursor: pointer; user-select: none;
            transition: background 0.1s;
        }
        .grok-menu-item:hover { background-color: #1D9BF0; color: #fff; }
        .grok-menu-footer {
            margin-top: 4px; border-top: 1px solid #333; padding-top: 4px;
            display: flex; justify-content: flex-end;
        }
        .grok-settings-btn {
            padding: 4px 8px; font-size: 18px; cursor: pointer;
            color: #71767B; border-radius: 4px;
        }
        .grok-settings-btn:hover { background-color: rgba(255,255,255,0.1); color: #fff; }

        #grok-settings-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 99998;
            display: flex; justify-content: center; align-items: center;
        }
        #grok-settings-modal {
            background: #000; border: 1px solid #333; border-radius: 16px;
            width: 500px; max-width: 90%; max-height: 85vh;
            display: flex; flex-direction: column; color: #E7E9EA;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            font-family: sans-serif;
        }
        .grok-modal-header { padding: 16px 20px; border-bottom: 1px solid #333; font-size: 18px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .grok-modal-body { padding: 20px; overflow-y: auto; flex: 1; }
        .grok-modal-footer { padding: 16px 20px; border-top: 1px solid #333; display: flex; justify-content: flex-end; gap: 10px; }
        .grok-form-group { margin-bottom: 20px; }
        .grok-form-label { display: block; margin-bottom: 8px; font-weight: bold; color: #71767B; }
        .grok-input-select { width: 100%; background: #16181C; border: 1px solid #333; color: #fff; padding: 8px; border-radius: 4px; font-size: 14px; }
        .grok-input-textarea { width: 100%; height: 80px; background: #16181C; border: 1px solid #333; color: #fff; padding: 8px; border-radius: 4px; font-size: 13px; resize: vertical; font-family: monospace; }
        .grok-btn { padding: 8px 16px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; font-size: 14px; }
        .grok-btn-primary { background: #1D9BF0; color: #fff; }
        .grok-btn-primary:hover { background: #1A8CD8; }
        .grok-btn-secondary { background: transparent; color: #EFF3F4; border: 1px solid #536471; }
        .grok-btn-danger { background: transparent; color: #F4212E; border: 1px solid #F4212E; margin-right: auto; }

        .my-commander-btn-active {
            color: #FF1493 !important;
            transition: color 0.2s ease;
        }
    `;





    function openSettings() {
        document.getElementById('grok-commander-menu')?.remove();
        const config = loadConfig();
        const currentLang = config.lang;
        const templatesToEdit = getCurrentTemplates();

        const overlay = document.createElement('div');
        overlay.id = 'grok-settings-overlay';

        let html = `
            <div id="grok-settings-modal">
                <div class="grok-modal-header">
                    <span>⚙️ 指揮官設定 (Grok Commander)</span>
                    <span style="cursor:pointer" id="grok-settings-close">✕</span>
                </div>
                <div class="grok-modal-body">
                    <div class="grok-form-group">
                        <label class="grok-form-label">慣用語言 (Language)</label>
                        <select id="grok-lang-select" class="grok-input-select">
                            <option value="auto" ${currentLang === 'auto' ? 'selected' : ''}>自動偵測 (Auto)</option>
                            <option value="zh-TW" ${currentLang === 'zh-TW' ? 'selected' : ''}>繁體中文 (Traditional Chinese)</option>
                            <option value="zh-CN" ${currentLang === 'zh-CN' ? 'selected' : ''}>简体中文 (Simplified Chinese)</option>
                            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                            <option value="ja" ${currentLang === 'ja' ? 'selected' : ''}>日本語 (Japanese)</option>
                            <option value="ko" ${currentLang === 'ko' ? 'selected' : ''}>한국어 (Korean)</option>
                        </select>
                        <div style="font-size:12px; color:#536471; margin-top:4px;">切換後，下方模版將重置為該語言預設值。</div>
                    </div>
                    <hr style="border:0; border-top:1px solid #333; margin: 20px 0;">
                    <div id="grok-template-editors"></div>
                </div>
                <div class="grok-modal-footer">
                    <button id="grok-settings-reset" class="grok-btn grok-btn-danger">恢復預設值</button>
                    <button id="grok-settings-cancel" class="grok-btn grok-btn-secondary">取消</button>
                    <button id="grok-settings-save" class="grok-btn grok-btn-primary">儲存設定</button>
                </div>
            </div>
        `;
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        const editorContainer = document.getElementById('grok-template-editors');
        const keys = ['factcheck', 'analysis', 'tree', 'solution', 'translate'];

        function renderEditors(templates) {
            editorContainer.innerHTML = '';
            keys.forEach(key => {
                const t = templates[key];
                if (!t) return;
                const div = document.createElement('div');
                div.className = 'grok-form-group';
                div.innerHTML = `
                    <label class="grok-form-label">${t.icon} ${t.label} - 提示詞</label>
                    <textarea class="grok-input-textarea" data-key="${key}">${t.prompt}</textarea>
                `;
                editorContainer.appendChild(div);
            });
        }
        renderEditors(templatesToEdit);

        document.getElementById('grok-settings-close').onclick = closeSettings;
        document.getElementById('grok-settings-cancel').onclick = closeSettings;

        const langSelect = document.getElementById('grok-lang-select');
        langSelect.onchange = () => {
            let targetLang = langSelect.value;

            if (targetLang === 'auto') {
                const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
                if (browserLang.includes("zh-tw") || browserLang.includes("hk")) targetLang = "zh-TW";
                else if (browserLang.includes("zh")) targetLang = "zh-CN";
                else if (browserLang.includes("ja")) targetLang = "ja";
                else if (browserLang.includes("ko")) targetLang = "ko";
                else targetLang = "en";
            }
            renderEditors(DEFAULT_CONFIG.templates[targetLang] || DEFAULT_CONFIG.templates["en"]);
        };

        document.getElementById('grok-settings-reset').onclick = () => {
            if (confirm("確定要恢復預設值？這將覆蓋您的自定義模版。")) {
                let targetLang = langSelect.value;
                if (targetLang === 'auto') {
                    const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
                    if (browserLang.includes("zh-tw") || browserLang.includes("hk")) targetLang = "zh-TW";
                    else if (browserLang.includes("zh")) targetLang = "zh-CN";
                    else if (browserLang.includes("ja")) targetLang = "ja";
                    else if (browserLang.includes("ko")) targetLang = "ko";
                    else targetLang = "en";
                }
                renderEditors(DEFAULT_CONFIG.templates[targetLang] || DEFAULT_CONFIG.templates["en"]);
            }
        };

        document.getElementById('grok-settings-save').onclick = () => {
            let selectedLang = langSelect.value;
            let realLangCode = selectedLang;

            if (selectedLang === 'auto') {
                const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
                if (browserLang.includes("zh-tw") || browserLang.includes("hk")) realLangCode = "zh-TW";
                else if (browserLang.includes("zh")) realLangCode = "zh-CN";
                else if (browserLang.includes("ja")) realLangCode = "ja";
                else if (browserLang.includes("ko")) realLangCode = "ko";
                else realLangCode = "en";
            }

            const newConfig = {
                lang: selectedLang,
                customTemplates: {
                    _lang: realLangCode
                }
            };

            let baseTemplates = DEFAULT_CONFIG.templates[realLangCode] || DEFAULT_CONFIG.templates["en"];
            editorContainer.querySelectorAll('textarea').forEach(ta => {
                const key = ta.getAttribute('data-key');
                newConfig.customTemplates[key] = { ...baseTemplates[key], prompt: ta.value };
            });
            saveConfig(newConfig);
            closeSettings();
            alert("設定已儲存！");
        };
    }

    function closeSettings() { document.getElementById('grok-settings-overlay')?.remove(); }






    const GROK_PATTERNS = [
        "M12.745 20.54",
        "M2.5 12C2.5 6.75",
        "M12 2C6.48 2"
    ];


    const SEND_SVG_FINGERPRINT = "M12 3.59l7.457 7.45-1.414 1.42L13 7.41V21h-2V7.41l-5.043 5.05-1.414-1.42L12 3.59z";



    const SEND_BTN_LABELS = [

        "問 Grok 一些問題", "發送", "送出", "发布", "发送", "向 Grok 提问",

        "Grok something", "Send post", "Ask Grok", "Reply",

        "Grokに質問", "ポストする", "送信", "返信",

        "Grok에게 질문하기", "게시하기", "보내기", "답글"
    ];


    const BLACKLIST_LABELS = [
        "image", "picture", "generate", "draw", "create",
        "圖片", "影像", "生成", "繪製", "製作", "照片",
        "图片", "生成",
        "画像", "生成",
        "이미지", "생성"
    ];

    let activeInterval = null;
    let pendingTask = null;

    function resetGlobalState() {
        if (activeInterval) {
            clearInterval(activeInterval);
            activeInterval = null;
        }
        pendingTask = null;
    }

    function isGrokIcon(element) {
        if (!element || element.tagName !== 'path') return false;
        const d = element.getAttribute('d');
        if (!d) return false;
        return GROK_PATTERNS.some(p => d.startsWith(p));
    }


    function simulateEnterKey(element) {
        ['keydown', 'keypress', 'keyup'].forEach(type => {
            element.dispatchEvent(new KeyboardEvent(type, {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                bubbles: true, cancelable: true
            }));
        });
    }


    function setReactValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set;
        (valueSetter && valueSetter !== prototypeValueSetter ? prototypeValueSetter : valueSetter).call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function hijackOperations() {
        const paths = document.querySelectorAll('path');
        paths.forEach(path => {
            if (isGrokIcon(path)) {
                const originalBtn = path.closest('button');
                if (originalBtn && originalBtn.closest('article') && !originalBtn.classList.contains('my-commander-btn')) {
                    const newBtn = originalBtn.cloneNode(true);
                    newBtn.classList.add('my-commander-btn', 'my-commander-btn-active');
                    newBtn.style.color = "#FF1493";
                    newBtn.setAttribute('aria-label', 'Grok Commander');
                    newBtn.title = "AI Commander (Active)";

                    newBtn.onclick = (e) => {
                        e.preventDefault(); e.stopPropagation();
                        const article = newBtn.closest('article');
                        if (!article) return;
                        const textEl = article.querySelector('[data-testid="tweetText"]');
                        const urlEl = article.querySelector('time')?.closest('a');
                        const tweetData = {
                            text: textEl ? textEl.innerText : "",
                            url: urlEl ? urlEl.href : window.location.href
                        };
                        showMenu(e.clientX, e.clientY, tweetData);
                    };

                    if (originalBtn.parentNode) {
                        originalBtn.parentNode.replaceChild(newBtn, originalBtn);
                    }
                }
            }
        });
    }

    function showMenu(x, y, tweetData) {
        document.getElementById('grok-commander-menu')?.remove();
        document.getElementById('grok-menu-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'grok-menu-overlay';
        Object.assign(overlay.style, { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99989, background: 'transparent' });
        overlay.onclick = () => { overlay.remove(); document.getElementById('grok-commander-menu')?.remove(); };
        document.body.appendChild(overlay);

        const currentTemplates = getCurrentTemplates();
        const menu = document.createElement('div');
        menu.id = 'grok-commander-menu';

        const rectWidth = 180; const rectHeight = 250;
        let finalX = x; let finalY = y;
        if (x + rectWidth > window.innerWidth) finalX = window.innerWidth - rectWidth - 20;
        if (y + rectHeight > window.innerHeight) finalY = y - rectHeight;
        menu.style.left = `${finalX}px`; menu.style.top = `${finalY}px`;

        const keys = ['factcheck', 'analysis', 'tree', 'solution', 'translate'];
        keys.forEach(key => {
            const t = currentTemplates[key];
            if (!t) return;
            const item = document.createElement('div');
            item.className = 'grok-menu-item';
            item.innerHTML = `<span style="font-size:16px">${t.icon}</span><span>${t.label}</span>`;
            item.onclick = (e) => {
                e.stopPropagation(); overlay.remove(); menu.remove();
                resetGlobalState();
                executeCommand(t.prompt, tweetData);
            };
            menu.appendChild(item);
        });

        const footer = document.createElement('div');
        footer.className = 'grok-menu-footer';
        footer.innerHTML = `<div class="grok-settings-btn" title="設定 (Settings)">⚙️</div>`;
        footer.onclick = (e) => { e.stopPropagation(); overlay.remove(); menu.remove(); openSettings(); };
        menu.appendChild(footer);

        document.body.appendChild(menu);
    }

    function findGlobalGrokButton() {
        const paths = document.querySelectorAll('path');
        for (let p of paths) {
            if (isGrokIcon(p)) {
                const btn = p.closest('button');
                if (btn && !btn.closest('article') && !btn.classList.contains('my-commander-btn') && btn.offsetParent !== null) {
                    return btn;
                }
            }
        }
        return null;
    }

    function triggerClick(element) {
        if (!element) return;
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        element.click();
    }

    function executeCommand(prompt, tweetData) {
        const fullContent = `${prompt}\n\n[Tweet URL]: ${tweetData.url}\n[Tweet Content]: ${tweetData.text}`;
        pendingTask = { content: fullContent, autoSend: true, textFilled: false, injectCount: 0 };

        const globalBtn = findGlobalGrokButton();
        if (!globalBtn) { alert("錯誤：找不到全域 Grok 按鈕。"); return; }

        const isDrawerOpen = document.querySelector('textarea');
        let activeInput = null;
        if (isDrawerOpen && isDrawerOpen.offsetParent !== null) activeInput = isDrawerOpen;

        if (activeInput) {
            console.log("[Commander] 視窗已開啟 -> 重置...");
            triggerClick(globalBtn); // Close
            setTimeout(() => { triggerClick(globalBtn); startInjection(); }, 500); // Re-open
        } else {
            console.log("[Commander] 視窗未開啟 -> 開啟中...");
            triggerClick(globalBtn); // Open
            startInjection();
        }
    }

    function startInjection() {
        let attempts = 0;
        let privateModeClicked = false;
        let clearedInput = false;

        activeInterval = setInterval(() => {
            attempts++;
            if (attempts > 80 || !pendingTask) { resetGlobalState(); return; }


            const mask = document.querySelector('[data-testid="mask"]');
            const closeBtn = document.querySelector('button[data-testid="app-bar-close"]');
            if (mask && closeBtn) {
                console.warn("[Commander] 攔截到生圖視窗 -> 執行關閉！");
                triggerClick(closeBtn);

                return;
            }


            if (!privateModeClicked) {
                const maskPaths = document.querySelectorAll('path');
                for (let p of maskPaths) {
                    const d = p.getAttribute('d');
                    if (d && (d.includes("M9.375 8.541") || d.includes("M10 3.333c"))) {
                        const btn = p.closest('button');
                        if (btn && btn.offsetParent !== null) {
                            triggerClick(btn);
                            privateModeClicked = true;
                            return;
                        }
                    }
                }
            }


            const textareas = document.querySelectorAll('textarea');
            let targetInput = null;
            for (let ta of textareas) {
                if (ta.offsetParent !== null) { targetInput = ta; break; }
            }

            if (targetInput && privateModeClicked && !pendingTask.textFilled) {
                if (!clearedInput) {
                    setReactValue(targetInput, "");
                    clearedInput = true;
                    return;
                }
                setReactValue(targetInput, pendingTask.content);
                targetInput.focus();
                pendingTask.textFilled = true;
                pendingTask.targetInput = targetInput;
                return;
            }


            if (pendingTask.textFilled && pendingTask.autoSend) {

                if (pendingTask.targetInput) {
                    console.log("[Commander] 模擬 Enter 發送...");
                    simulateEnterKey(pendingTask.targetInput);
                }


                let targetBtn = null;
                const buttons = document.querySelectorAll('button');

                for (let btn of buttons) {

                    const label = btn.getAttribute('aria-label');
                    if (label && BLACKLIST_LABELS.some(bad => label.toLowerCase().includes(bad))) continue; // 黑名單過濾


                    if (label && SEND_BTN_LABELS.some(good => label === good)) {
                        targetBtn = btn;
                        break;
                    }


                    const svgPath = btn.querySelector('path');
                    if (svgPath) {
                        const d = svgPath.getAttribute('d');
                        if (d === SEND_SVG_FINGERPRINT || (d && d.startsWith("M12 3.59"))) {

                            if (!d.startsWith("M3 12")) {
                                targetBtn = btn;
                                break;
                            }
                        }
                    }
                }

                if (targetBtn && !targetBtn.disabled && targetBtn.getAttribute('aria-disabled') !== 'true') {
                    console.log("[Commander] 鎖定發送按鈕 -> 點擊！");
                    triggerClick(targetBtn);


                    setTimeout(() => {
                        if (pendingTask && pendingTask.targetInput) {
                            setReactValue(pendingTask.targetInput, "");
                            console.log("[Commander] 輸入框已強制清空");
                        }
                        resetGlobalState();
                    }, 500);
                }
            }
        }, 100);
    }

    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    const observer = new MutationObserver(() => hijackOperations());
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(hijackOperations, 1000);


    const hasRun = GM_getValue("grok_setup_complete_global", false);
    if (!hasRun) {
        setTimeout(() => { openSettings(); GM_setValue("grok_setup_complete_global", true); }, 2000);
    }

    console.log("X Grok Commander V20.1 (Multilingual) Loaded");

})();