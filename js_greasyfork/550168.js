// ==UserScript==
// @name         LunaLens
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2.7
// @description  通过HTTP API连接LunaTranslator实现浏览器上的原文的分词、翻译、朗读和查词功能
// @description:en Split, translate, read and query words on the browser through the HTTP API of LunaTranslator
// @description:ja LunaTranslatorのHTTP APIを通じてブラウザ上で分詞、翻訳、読み上げ、辞書検索機能を実現
// @author       Raindrop213
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/550168/LunaLens.user.js
// @updateURL https://update.greasyfork.org/scripts/550168/LunaLens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        // ※重点：填写你的服务器地址，同步设置@connect如： @connect 192.168.6.229
        API_URL: 'http://127.0.0.1:2333',

        // 分句设置
        // 分句：断句的符号基准
        SENTENCE_DELIMITERS: '。．.!?！？…',
        // 分句：句子字数阈值
        SENTENCE_LENGTH: 50, 
        // 最小内容长度
        MIN_CONTENT_LENGTH: 2,
        // 最大内容长度
        MAX_CONTENT_LENGTH: 1000,
        // 是否移除注音

        // 选择器设置
        // 选择的标签
        INCLUDE_TAGS: 'p, h1, h2, h3, h4, h5, h6',
        // 排除的标签
        EXCLUDE_TAGS: '',
        // 包含的class id
        INCLUDE_CLASS_IDS: '',
        // 排除的class id
        EXCLUDE_CLASS_IDS: '',
        // 停止容器
        STOP_CONTAINERS: 'article, main, section, div.content, div.main-content',

        // 顶栏常用设置
        // 是否使用句子模式
        DISPLAY_SENTENCE_MODE: false,
        // 是否打开翻译
        TRANSLATION_ENABLED: false,
        // 是否激活标签就自动朗读
        TTS_AUTO: false,
        // 是否打开设置栏
        SETTING_DISPLAY: false,
        BUTTON_TEXT: {
            TTS: {true: 'TTS:auto', false: 'TTS'},
            TRANSLATION: {true: '翻译:auto', false: '翻译'},
            DISPLAY: {true: '句子', false: '段落'}
        },

        // 其他设置
        // API请求等待的最大时限
        TIMEOUT: 5000
    };
    
    // 当前配置，初始化为默认配置的副本
    const CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    // 面板样式
    const STYLE =  `
        .lunalens-highlighted {
            outline: 2px solid rgba(59, 122, 83, 0.52) !important;
        }
        .lunalens-word {
            display: inline-block;
            position: relative;
            margin: 1px;
            cursor: pointer;
        }
        .lunalens-word.flash {
            animation: word-flash 0.3s ease-out;
        }
        @keyframes word-flash {
            0% { background-color: rgba(255, 206, 30, 0.5); }
            100% { background-color: transparent; }
        }
        /* 仅在词典窗内使用的高亮样式 */
        .lunalens-dict-context .lunalens-word.active-word {
            background-color:rgba(255, 206, 30, 0.5);
        }
        .lunalens-word rt {
            font-size: 0.7em;
            color: #b91a1a;
        }
        /* LunaLens面板 */
        .lunalens-panel {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 92%;
            background-color: #fff;
            border-top: 1px solid #ccc;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
            transition: transform 0.2s ease;
            transform: translateY(100%);
            writing-mode: horizontal-tb !important;
            -webkit-writing-mode: horizontal-tb !important;
        }
        .lunalens-panel.visible {
            transform: translateY(0);
        }
        .lunalens-panel input::placeholder {
            color: #aaa;
            opacity: 0.8;
        }
        .lunalens-header {
            display: flex;
            justify-content: space-between;
            background: #ffffff;
            border-bottom: 1px solid #ddd;
            height: 40px;
        }
        .lunalens-title {
            font-size: 16px;
            font-weight: bold;
            padding: 8px 10px;
            margin: 0;
            line-height: 20px;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .lunalens-title:hover {
            color: #007acc;
        }
        .lunalens-header-buttons {
            display: flex;
            align-items: stretch;
            height: 100%;
        }
        .lunalens-header-button {
            cursor: pointer;
            color: #666;
            font-size: 14px;
            padding: 0 12px;
            margin: 0;
            border: none;
            border-radius: 0;
            border-left: 1px solid #ddd;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lunalens-square-button {
            width: 40px;
            color: white;
            border: none;
            border-radius: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            margin: 0;
        }
        .lunalens-setting-toggle {
            background-color: #929292;
        }
        .lunalens-setting-toggle.active {
            background-color: #1288ab;
        }
        .lunalens-close {
            background-color: #000000;
        }
        .lunalens-dict-context-wrapper {
            position: relative;
            background: #f9f9f9;
            border-bottom: 1px solid #eee;
            max-height: 20vh;
            overflow: hidden;
        }
        .lunalens-context-buttons {
            position: absolute;
            bottom: 4px;
            right: 4px;
            display: flex;
            gap: 4px;
            z-index: 10;
        }
        .lunalens-dict-context {
            padding: 8px 10px 30px 10px;
            font-size: 15px;
            line-height: 1.5;
            overflow-y: auto;
            height: 100%;
            box-sizing: border-box;
        }
        .lunalens-dict-query-box {
            display: flex;
            padding: 0;
            border-bottom: 1px solid #eee;
            height: 40px;
        }
        .lunalens-dict-query-input {
            flex: 1;
            padding: 0 10px;
            border: 1px solid transparent;
            border-right: 1px solid #ddd;
            border-radius: 0;
            margin: 0;
            height: 100%;
            outline: none;
            box-sizing: border-box;
        }
        .lunalens-dict-query-input:focus {
            border: 1px solid #000000;
        }
        .lunalens-dict-query-button {
            background: #23ab12;
        }
        .lunalens-tts-button {
            background: #a51dd1;
        }
        .lunalens-context-copy-button {
            width: 32px;
            height: 32px;
            color: #4a90e2;
            background: rgba(74, 144, 226, 0.1);
            border: 1px solid rgba(74, 144, 226, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s ease;
        }
        .lunalens-context-translate-button {
            width: 32px;
            height: 32px;
            color: #50c878;
            background: rgba(80, 200, 120, 0.1);
            border: 1px solid rgba(80, 200, 120, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s ease;
        }
        .lunalens-context-tts-button {
            width: 32px;
            height: 32px;
            color: #a51dd1;
            background:rgba(165, 29, 209, 0.1);
            border: 1px solid rgba(165, 29, 209, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.2s ease;
        }
        .lunalens-dict-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .lunalens-dict-tabs {
            display: flex;
            flex-direction: row;
            background: #f9f9f9;
            overflow-x: auto;
            white-space: nowrap;
        }
        .lunalens-dict-tab {
            padding: 8px 15px;
            cursor: pointer;
            border-right: 1px solid #eee;
            font-size: 13px;
        }
        .lunalens-dict-tab.active {
            background: #fff;
            font-weight: bold;
            border-top: 3px solid #b91a1a;
            border-left: none;
        }
        .lunalens-dict-entries {
            flex: 1;
            overflow-y: auto;
            padding-top: 10px;
        }
        .lunalens-dict-entry {
            display: none;
        }
        .lunalens-dict-entry.active {
            display: block;
        }
        .lunalens-dict-loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        /* 翻译区域样式 */
        .lunalens-translation {
            padding: 8px 10px;
            border-bottom: 1px solid #e0e6f5;
            font-size: 13px;
            line-height: 1.5;
            max-height: 15vh;
            overflow-y: auto;
        }
        .lunalens-translator-item {
            position: relative;
            padding-right: 40px;
        }
        .lunalens-translator-name {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 10px;
            color: #bbb;
            font-style: italic;
        }
        .lunalens-hr {
            border: none;
            border-top: 1px dashed #c1c1c17d;
            margin: 5px 0;
        }
        /* 设置窗口样式 */
        .lunalens-setting-window {
            display: none;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
            overflow-y: auto;
        }
        .lunalens-setting-window.visible {
            display: flex;
        }
        .lunalens-dict-window {
            display: none;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .lunalens-dict-window.visible {
            display: flex;
        }
        .lunalens-setting-api-url {
            padding: 8px 10px;
            border-bottom: 1px solid #eee;
        }
        .lunalens-setting-api-url label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 13px;
            color: #333;
        }
        .lunalens-setting-api-url input {
            width: 100%;
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 0;
            font-size: 14px;
            outline: none;
            box-sizing: border-box;
        }
        .lunalens-setting-api-url input:focus {
            border: 1px solid #000000;
        }
        .lunalens-setting-tabs {
            display: flex;
            flex-direction: row;
            background: #f9f9f9;
            overflow-x: auto;
            white-space: nowrap;
        }
        .lunalens-setting-tab {
            padding: 8px 15px;
            cursor: pointer;
            border-right: 1px solid #eee;
            font-size: 13px;
        }
        .lunalens-setting-tab.active {
            background: #fff;
            font-weight: bold;
            border-top: 3px solid #b91a1a;
            border-bottom: none;
            border-left: none;
        }
        .lunalens-setting-contents {
            flex: 1;
            overflow-y: auto;
        }
        .lunalens-setting-content {
            display: none;
            padding: 10px;
            border-top: none;
        }
        .lunalens-setting-content.active {
            display: block;
        }
        .lunalens-setting-item {
            margin-bottom: 12px;
            padding-bottom: 8px;
        }
        .lunalens-setting-item:last-child {
            border-bottom: none;
        }
        .lunalens-setting-item label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 13px;
        }
        .lunalens-setting-item input[type="text"] {
            width: 100%;
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 0;
            outline: none;
            box-sizing: border-box;
        }
        .lunalens-setting-item input[type="text"]:focus {
            border: 1px solid #000000;
        }
        .lunalens-setting-item input[type="checkbox"] {
            margin-right: 8px;
            vertical-align: middle;
        }
        .lunalens-setting-description {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .lunalens-setting-description kbd {
            background-color:rgba(223, 223, 223, 0.5);
            padding: 0px 3px;
            border-radius: 3px;
        }
        .lunalens-setting-button {
            background-color: #23ab12;
            color: white;
            border: none;
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 0;
            margin-top: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            align-self: flex-start;
            margin-right: 10px;
        }
        .lunalens-reset-settings {
            background-color: #cc3333;
        }
        .lunalens-setting-buttons {
            display: flex;
            flex-direction: row;
        }
        .lunalens-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 10001;
            display: none;
            animation: fadeInOut 2s ease-in-out;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 14px;
            max-width: 80%;
            text-align: center;
            writing-mode: horizontal-tb;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -10px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
        }
    `

    // 全局变量
    let activeElement = null;
    let originalContent = null;
    let dictionaryPanel = null;
    let currentWord = '';
    let activeWordElements = []; // 改为数组存储所有激活的单词元素
    let contextSentence = null;
    let translationArea = null; // 翻译区域
    let lastTranslatedText = ''; // 上次翻译的文本，用于避免重复翻译
    let currentAudio = null; // 当前播放的音频对象
    let pendingTTSRequests = []; // 待处理的TTS请求数组

    // 添加样式到文档
    function addStyle(doc) {
        if (!doc.querySelector('#anon-simple-style')) {
            const style = doc.createElement('style');
            style.id = 'anon-simple-style';
            style.textContent = STYLE;
            doc.head.appendChild(style);
        }
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => console.log(`Copy: ${text}`))
            .catch(err => console.log('Failed to copy text: ', err));
    }

    // 获取纯文本（移除rp、rt）
    function getPlainText(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        
        // 先找出所有ruby元素
        div.querySelectorAll('ruby').forEach(ruby => {
            // 创建文本节点，只包含主要内容（不包含rt中的注音）
            const mainText = Array.from(ruby.childNodes)
                .filter(node => node.nodeName !== 'RT' && node.nodeName !== 'RP')
                .map(node => node.textContent)
                .join('');
                
            // 替换整个ruby标签为纯文本
            const textNode = document.createTextNode(mainText);
            ruby.parentNode.replaceChild(textNode, ruby);
        });
        
        return div.textContent || '';
    }

    // 辅助函数：判断片假名和平假名是否等价
    function isKanaEquivalent(word, kana) {
        if (!word || !kana) return false;
        // 简单转换为片假名进行比较
        const toKatakana = str => {
            const hiraRange = [0x3041, 0x3096];
            return str.split('')
                .map(char => {
                    const code = char.charCodeAt(0);
                    if (code >= hiraRange[0] && code <= hiraRange[1]) {
                        return String.fromCharCode(code + 0x60);
                    }
                    return char;
                })
                .join('');
        };
        return toKatakana(word) === toKatakana(kana);
    }
    
    // 片假名转平假名
    function katakanaToHiragana(text) {
        if (!text) return '';
        
        // 片假名的Unicode范围是：U+30A0 to U+30FF
        return text.replace(/[\u30A0-\u30FF]/g, function(match) {
            const code = match.charCodeAt(0) - 0x60;
            return String.fromCharCode(code);
        });
    }

    // 处理分词API请求
    function processMecabAPI(text, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${CONFIG.API_URL}/api/mecab?text=${encodeURIComponent(text)}`,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        callback(data);
                    } catch (e) {
                        console.error('解析API响应失败:', e);
                        showToast('分词API请求失败，请检查API连接', true);
                        callback(null);
                    }
                } else {
                    console.error('API请求失败:', response.status);
                    showToast('API请求失败，HTTP状态码: ' + response.status, true);
                    callback(null);
                }
            },
            onerror: function(error) {
                console.error('API请求错误:', error);
                showToast('分词API请求失败，请检查API连接', true);
                callback(null);
            },
            ontimeout: function() {
                console.error('API请求超时');
                showToast('分词API请求超时', true);
                callback(null);
            },
            timeout: CONFIG.TIMEOUT
        });
    }

    // 显示设置面板的辅助函数
    function showSettingsPanel() {
        // 先显示词典面板
        showPanel();
        
        // 然后切换到设置页面
        if (dictionaryPanel) {
            dictionaryPanel.querySelector('.lunalens-dict-window').classList.remove('visible');
            dictionaryPanel.querySelector('.lunalens-setting-window').classList.add('visible');
            dictionaryPanel.querySelector('.lunalens-setting-toggle').classList.add('active');
        }
    }

    // 生成带注音的HTML标记，添加唯一索引
    function generateRubyHTML(word, index) {
        const indexAttr = `data-original-index="${index}"`;
        
        if (word.isdeli || !word.kana || isKanaEquivalent(word.word, word.kana)) {
            return `<span class="lunalens-word" data-word="${word.word}" ${indexAttr}>${word.word}</span>`;
        } else {
            // 将片假名转换为平假名
            const hiragana = katakanaToHiragana(word.kana);
            return `<span class="lunalens-word" data-word="${word.word}" ${indexAttr}><ruby>${word.word}<rt>${hiragana}</rt></ruby></span>`;
        }
    }

    // 处理文本并生成带注音的分句HTML
    function processTextWithTokenization(html, callback) {
        // 1. 获取纯文本
        const plainText = getPlainText(html);
        
        // 2. 一次性请求API进行分词
        processMecabAPI(plainText, function(words) {
            if (!words) {
                callback(html); // 如果API失败，返回原HTML
                showSettingsPanel();
                return;
            }
            
            // 3. 按句子分隔符构建句子数组
            const sentences = [];
            let currentSentence = [];
            let currentSentenceLength = 0;
            let wordIndex = 0;
            
            // 遍历所有词汇，构建句子
            words.forEach(word => {
                // 生成当前词的HTML，添加唯一索引
                const wordHTML = generateRubyHTML(word, wordIndex++);
                currentSentence.push(wordHTML);
                currentSentenceLength += word.word.length;
                
                // 如果当前词是句子分隔符，检查是否应结束当前句子
                if (CONFIG.SENTENCE_DELIMITERS.indexOf(word.word) !== -1 && currentSentenceLength >= CONFIG.SENTENCE_LENGTH) {
                    sentences.push(`<span class="lunalens-sentence">${currentSentence.join('')}</span>`);
                    currentSentence = [];
                    currentSentenceLength = 0;
                }
            });
            
            // 处理剩余的词
            if (currentSentence.length > 0) {
                sentences.push(`<span class="lunalens-sentence">${currentSentence.join('')}</span>`);
            }
            
            callback(sentences.join(''));
        });
    }

    // 查询按钮点击事件（添加下一个单词）
    function setupQueryButton(queryButton, queryInput) {
        queryButton.addEventListener('click', function() {
            if (activeWordElements.length > 0) {
                // 获取最后一个激活的单词元素的索引
                const lastActiveIndex = activeWordElements[activeWordElements.length - 1];
                let lastActiveElement;
                
                // 在主页和词典上下文中查找元素
                const allWords = document.querySelectorAll('.lunalens-word');
                for (const word of allWords) {
                    if (word.dataset.originalIndex === lastActiveIndex || 
                        (typeof lastActiveIndex === 'object' && 
                         lastActiveIndex.dataset && 
                         lastActiveIndex.dataset.originalIndex === word.dataset.originalIndex)) {
                        lastActiveElement = word;
                        // 一旦在主页上找到匹配的元素，优先使用
                        if (activeElement.contains(word)) {
                            break;
                        }
                    }
                }
                
                if (!lastActiveElement) return;
                
                // 寻找下一个单词元素
                let nextWord = null;
                if (activeElement.contains(lastActiveElement)) {
                    // 如果最后激活的单词在主页上，直接找下一个相邻元素
                    nextWord = lastActiveElement.nextElementSibling;
                    while (nextWord && !nextWord.classList.contains('lunalens-word')) {
                        nextWord = nextWord.nextElementSibling;
                    }
                } else {
                    // 如果最后激活的单词在词典上下文中，需要找到主页上对应的单词，再找下一个
                    const mainPageWords = activeElement.querySelectorAll('.lunalens-word');
                    for (let i = 0; i < mainPageWords.length; i++) {
                        if (mainPageWords[i].dataset.originalIndex === lastActiveIndex) {
                            if (i < mainPageWords.length - 1) {
                                nextWord = mainPageWords[i + 1];
                            }
                            break;
                        }
                    }
                }
                
                if (nextWord && nextWord.classList.contains('lunalens-word')) {
                    
                    // 记录下一个单词，保留之前的记录
                    activeWordElements.push(nextWord.dataset.originalIndex || nextWord);
                    
                    // 获取当前查询框内容
                    const currentQuery = queryInput.value.trim();
                    
                    // 将下一个单词添加到查询框
                    queryInput.value = currentQuery + nextWord.dataset.word;
                    
                    // 更新上下文
                    updateContext();
                    
                    // 触发查询
                    lookupWord(queryInput.value);
                }
            }
        });
    }
    
    // 上下文区域点击事件处理
    function setupContextAreaEvents(contextArea, queryInput) {
        // 使用事件委托，避免在每次更新上下文时都要重新绑定事件
        contextArea.addEventListener('click', function(e) {
            // 阻止事件冒泡到document，防止触发deactivateElement
            e.stopPropagation();
            
            // 寻找被点击的单词元素，包括临时容器中的元素
            let targetWord = null;
            if (e.target.classList && e.target.classList.contains('lunalens-word')) {
                targetWord = e.target;
            } else {
                targetWord = e.target.closest('.lunalens-word');
            }
            
            if (targetWord) {
                // 清除所有已激活的高亮样式
                contextArea.querySelectorAll('.lunalens-word.active-word').forEach(word => {
                    word.classList.remove('active-word');
                });
                
                // 清空激活单词数组
                activeWordElements = [];
                
                // 直接给当前单词添加高亮类
                targetWord.classList.add('active-word');
                
                // 记录当前激活的单词
                activeWordElements.push(targetWord.dataset.originalIndex || targetWord);
                
                // 更新查询框内容
                queryInput.value = targetWord.dataset.word;
                
                // 触发查询
                lookupWord(targetWord.dataset.word);
                
                // 找到主页上对应的单词并添加临时闪烁效果
                const originalIndex = targetWord.dataset.originalIndex;
                if (originalIndex && activeElement) {
                    const mainPageWord = activeElement.querySelector(`.lunalens-word[data-original-index="${originalIndex}"]`);
                    if (mainPageWord) {
                        mainPageWord.classList.add('flash');
                        setTimeout(() => {
                            mainPageWord.classList.remove('flash');
                        }, 1000);
                    }
                }
            }
        });
    }

    // 创建词典面板
    function createDictionaryPanel() {
        // 检查是否已存在
        if (document.querySelector('.lunalens-panel')) {
            return document.querySelector('.lunalens-panel');
        }

        // 创建面板
        const panel = document.createElement('div');
        panel.className = 'lunalens-panel';
        panel.innerHTML = `
            <div class="lunalens-header">
                <div class="lunalens-title">LunaLens</div>
                <div class="lunalens-header-buttons">
                    <span class="lunalens-header-button lunalens-auto-tts-toggle" title="自动朗读开关">
                        ${CONFIG.BUTTON_TEXT.TTS[CONFIG.TTS_AUTO]}
                    </span>
                    <span class="lunalens-header-button lunalens-translation-toggle" title="切换翻译功能">
                        ${CONFIG.BUTTON_TEXT.TRANSLATION[CONFIG.TRANSLATION_ENABLED]}
                    </span>
                    <span class="lunalens-header-button lunalens-context-toggle" title="切换句子/段落">
                        ${CONFIG.BUTTON_TEXT.DISPLAY[CONFIG.DISPLAY_SENTENCE_MODE]}
                    </span>
                    <button class="lunalens-square-button lunalens-setting-toggle" title="设置">⚙</button>
                    <button class="lunalens-square-button lunalens-close" title="关闭面板">×</button>
                </div>
            </div>
            <div class="lunalens-dict-window">
                <div class="lunalens-dict-context-wrapper">
                    <div class="lunalens-dict-context"></div>
                    <div class="lunalens-context-buttons">
                        <button class="lunalens-context-copy-button" title="复制内容">⧉</button>
                        <button class="lunalens-context-translate-button" title="翻译内容">翻</button>
                        <button class="lunalens-context-tts-button" title="朗读上下文">♬</button>
                    </div>
                </div>
                <div class="lunalens-translation"></div>
                <div class="lunalens-dict-query-box">
                    <input type="text" class="lunalens-dict-query-input" placeholder="输入要查询的单词">
                    <button class="lunalens-square-button lunalens-dict-query-button">+</button>
                    <button class="lunalens-square-button lunalens-tts-button" title="朗读单词">♬</button>
                </div>
                <div class="lunalens-dict-content">
                    <div class="lunalens-dict-tabs"></div>
                    <div class="lunalens-dict-entries">
                        <div class="lunalens-dict-loading">请点击任意单词或输入要查询的词</div>
                    </div>
                </div>
            </div>
            <div class="lunalens-setting-window">
                <div class="lunalens-setting-api-url">
                    <label for="lunalens-api-url">API URL:</label>
                    <input type="text" id="lunalens-api-url" value="${CONFIG.API_URL}" placeholder="例如：http://127.0.0.1:2333">
                    <div class="lunalens-setting-description">通常为LunaTranslator的网络服务地址</div>
                </div>
                <div class="lunalens-setting-tabs">
                    <div class="lunalens-setting-tab active" data-tab="sentence-settings">分句设置</div>
                    <div class="lunalens-setting-tab" data-tab="selector-settings">选择器设置</div>
                    <div class="lunalens-setting-tab" data-tab="other-settings">其他设置</div>
                </div>
                <div class="lunalens-setting-contents">
                    <div class="lunalens-setting-content active" id="sentence-settings">
                        <div class="lunalens-setting-item">
                            <label for="sentence-delimiters">分句断句符号</label>
                            <input type="text" id="sentence-delimiters" value="${CONFIG.SENTENCE_DELIMITERS}" placeholder="切分为多个句子单元的符合">
                        </div>
                        <div class="lunalens-setting-item">
                            <label for="sentence-length">句子字数阈值</label>
                            <input type="text" id="sentence-length" value="${CONFIG.SENTENCE_LENGTH}" placeholder="防止句子过短而设置的最小句子长度">
                        </div>
                        <div class="lunalens-setting-item">
                            <label for="min-content-length">最小内容长度</label>
                            <input type="text" id="min-content-length" value="${CONFIG.MIN_CONTENT_LENGTH}" placeholder="过短的文本不会被选中">
                        </div>
                        <div class="lunalens-setting-item">
                            <label for="max-content-length">最大内容长度</label>
                            <input type="text" id="max-content-length" value="${CONFIG.MAX_CONTENT_LENGTH}" placeholder="过长的文本不会被选中">
                        </div>
                        <div class="lunalens-setting-description">※注意：默认去除原句的振假名注音（ruby 中的 rt 和 rp）</div>
                    </div>
                    <div class="lunalens-setting-content" id="selector-settings">
                        <div class="lunalens-setting-item">
                            <label for="include-tags">包含的标签</label>
                            <input type="text" id="include-tags" value="${CONFIG.INCLUDE_TAGS}" placeholder="例如：p, h1, h2, h3, h4, h5, h6, div">
                        </div>
                        <div class="lunalens-setting-item">
                            <label for="exclude-tags">排除的标签</label>
                            <input type="text" id="exclude-tags" value="${CONFIG.EXCLUDE_TAGS}" placeholder="例如： a, img, em, dd, code, button">
                        </div>
                        <div class="lunalens-setting-item">
                            <label for="include-class-ids">包含的class/id</label>
                            <input type="text" id="include-class-ids" value="${CONFIG.INCLUDE_CLASS_IDS}" placeholder="例如：.article-content, #main-content">
                        </div>
                        <div class="lunalens-setting-item">
                            <label for="exclude-class-ids">排除的class/id</label>
                            <input type="text" id="exclude-class-ids" value="${CONFIG.EXCLUDE_CLASS_IDS}" placeholder="例如：.sidebar, #ads, .popup, #comments">
                        </div>
                        <div class="lunalens-setting-item">
                            <label for="stop-containers">停止容器</label>
                            <input type="text" id="stop-containers" value="${CONFIG.STOP_CONTAINERS}" placeholder="例如：article, main, section, div.content, div.main-content">
                        </div>
                        <div class="lunalens-setting-description">※注意class和id的写法：<br><kbd>class</kbd> 前加 <kbd>.</kbd><br><kbd>id</kbd> 前加 <kbd>#</kbd><br>用逗号分隔</div>
                        <div class="lunalens-setting-description">如果你看不懂又选不中文本的时候，请试试在第一栏加多个加上 <kbd>div</kbd> 提高选中率</div>
                    </div>
                    <div class="lunalens-setting-content" id="other-settings">
                        <div class="lunalens-setting-item">
                            <label for="timeout">API请求超时(ms)</label>
                            <input type="text" id="timeout" value="${CONFIG.TIMEOUT}">
                        </div>
                    </div>
                </div>
                <div class="lunalens-setting-buttons">
                    <button class="lunalens-setting-button lunalens-save-settings">保存设置</button>
                    <button class="lunalens-setting-button lunalens-reset-settings">重置设置</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 保存翻译区域引用
        translationArea = panel.querySelector('.lunalens-translation');

        // 添加事件处理
        const titleElement = panel.querySelector('.lunalens-title');
        const closeButton = panel.querySelector('.lunalens-close');
        const contextToggle = panel.querySelector('.lunalens-context-toggle');
        const translationToggle = panel.querySelector('.lunalens-translation-toggle');
        const ttsToggle = panel.querySelector('.lunalens-auto-tts-toggle');
        const settingToggle = panel.querySelector('.lunalens-setting-toggle');
        const queryInput = panel.querySelector('.lunalens-dict-query-input');
        const queryButton = panel.querySelector('.lunalens-dict-query-button');
        const contextArea = panel.querySelector('.lunalens-dict-context');
        const ttsButton = panel.querySelector('.lunalens-tts-button');
        const contextTtsButton = panel.querySelector('.lunalens-context-tts-button');
        const contextCopyButton = panel.querySelector('.lunalens-context-copy-button');
        const contextTranslateButton = panel.querySelector('.lunalens-context-translate-button');
        const settingTabs = panel.querySelectorAll('.lunalens-setting-tab');
        const saveButton = panel.querySelector('.lunalens-save-settings');
        const dictWindow = panel.querySelector('.lunalens-dict-window');
        const settingWindow = panel.querySelector('.lunalens-setting-window');
        
        // 切换到设置面板
        settingToggle.addEventListener('click', function() {
            const isSettingVisible = this.classList.contains('active');
            this.classList.toggle('active');
            
            if (isSettingVisible) {
                // 从设置切换到词典
                dictWindow.classList.add('visible');
                settingWindow.classList.remove('visible');
            } else {
                // 从词典切换到设置
                dictWindow.classList.remove('visible');
                settingWindow.classList.add('visible');
                // 加载保存的设置
                loadSettings();
            }
        });
        
        // 设置面板中的标签切换
        settingTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有标签的活动状态
                settingTabs.forEach(t => t.classList.remove('active'));
                // 添加当前标签的活动状态
                this.classList.add('active');
                
                // 隐藏所有内容
                panel.querySelectorAll('.lunalens-setting-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 显示当前标签对应的内容
                const tabId = this.getAttribute('data-tab');
                const tabContent = panel.querySelector(`#${tabId}`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
        
        // 保存设置
        saveButton.addEventListener('click', function() {
            // 收集所有设置输入
            const apiUrl = panel.querySelector('#lunalens-api-url').value.trim();
            const sentenceDelimiters = panel.querySelector('#sentence-delimiters').value;
            const sentenceLength = parseInt(panel.querySelector('#sentence-length').value) || 50;
            const minContentLength = parseInt(panel.querySelector('#min-content-length').value) || 2;
            const maxContentLength = parseInt(panel.querySelector('#max-content-length').value) || 1000;
            const includeSelectors = panel.querySelector('#include-tags').value;
            const excludeSelectors = panel.querySelector('#exclude-tags').value;
            const includeClassIds = panel.querySelector('#include-class-ids').value;
            const excludeClassIds = panel.querySelector('#exclude-class-ids').value;
            const stopContainers = panel.querySelector('#stop-containers').value;
            const timeout = parseInt(panel.querySelector('#timeout').value) || 5000;
            
            // 更新配置
            CONFIG.API_URL = apiUrl;
            CONFIG.SENTENCE_DELIMITERS = sentenceDelimiters;
            CONFIG.SENTENCE_LENGTH = sentenceLength;
            CONFIG.MIN_CONTENT_LENGTH = minContentLength;
            CONFIG.MAX_CONTENT_LENGTH = maxContentLength;
            CONFIG.INCLUDE_TAGS = includeSelectors;
            CONFIG.EXCLUDE_TAGS = excludeSelectors;
            CONFIG.INCLUDE_CLASS_IDS = includeClassIds;
            CONFIG.EXCLUDE_CLASS_IDS = excludeClassIds;
            CONFIG.STOP_CONTAINERS = stopContainers;
            CONFIG.TIMEOUT = timeout;
            
            // 保存到本地存储
            saveSettings();
            
            // 显示通知
            showToast('设置已保存', false);
        });

        // 标题点击关闭面板
        titleElement.addEventListener('click', function() {
            // 停止当前播放的语音
            stopReading();
            hidePanel();
        });

        // 关闭词典面板
        closeButton.addEventListener('click', function() {
            // 停止当前播放的语音
            stopReading();
            hidePanel();
        });

        // 切换句子/段落
        contextToggle.addEventListener('click', function() {
            CONFIG.DISPLAY_SENTENCE_MODE = !CONFIG.DISPLAY_SENTENCE_MODE;
            this.textContent = CONFIG.BUTTON_TEXT.DISPLAY[CONFIG.DISPLAY_SENTENCE_MODE];
            
            // 更新上下文
            updateContext();
            
            // 保存设置到本地存储
            saveSettings();
        });

        // 切换翻译功能
        translationToggle.addEventListener('click', function() {
            CONFIG.TRANSLATION_ENABLED = !CONFIG.TRANSLATION_ENABLED;
            this.textContent = CONFIG.BUTTON_TEXT.TRANSLATION[CONFIG.TRANSLATION_ENABLED];
            this.classList.toggle('active', CONFIG.TRANSLATION_ENABLED);
            
            if (CONFIG.TRANSLATION_ENABLED) {
                translationArea.style.display = 'block';
                // 如果有上下文内容且不同于上次翻译的内容，立即翻译
                const currentContextText = getContextText();
                if (currentContextText && currentContextText !== lastTranslatedText) {
                    translateContextText(currentContextText);
                }
            } else {
                translationArea.style.display = 'none';
            }
            
            // 保存设置到本地存储
            saveSettings();
        });
        
        // 切换TTS功能
        ttsToggle.addEventListener('click', function() {
            CONFIG.TTS_AUTO = !CONFIG.TTS_AUTO;
            this.textContent = CONFIG.BUTTON_TEXT.TTS[CONFIG.TTS_AUTO];
            this.classList.toggle('active', CONFIG.TTS_AUTO);
            
            // 保存设置到本地存储
            saveSettings();
        });
        
        // 单词发音按钮
        ttsButton.addEventListener('click', function() {
            const word = queryInput.value.trim();
            if (word) {
                readText(word);
            }
        });
        
        // 上下文朗读按钮
        contextTtsButton.addEventListener('click', function() {
            const contextText = getContextText();
            if (contextText) {
                readText(contextText);
            }
        });
        
        // 上下文复制按钮
        contextCopyButton.addEventListener('click', function() {
            const contextText = getContextText();
            copyToClipboard(contextText);
        });
        
        // 上下文翻译按钮
        contextTranslateButton.addEventListener('click', function() {
            const contextText = getContextText();
            if (contextText) {
                // 临时显示翻译区域
                translationArea.style.display = 'block';
                // 手动触发翻译（即使总开关关闭也能工作）
                translateContextText(contextText, true);
            }
        });

        // 查询框输入事件
        queryInput.addEventListener('input', function() {
            const word = this.value.trim();
            if (word) {
                lookupWord(word);
            }
        });

        // 查询按钮点击事件（添加下一个单词）
        setupQueryButton(queryButton, queryInput);

        // 上下文区域点击事件：点击上下文中的单词
        setupContextAreaEvents(contextArea, queryInput);

        // 初始设置翻译区域显示状态
        translationArea.style.display = CONFIG.TRANSLATION_ENABLED ? 'block' : 'none';
        
        // 添加重置设置按钮事件处理
        const resetButton = panel.querySelector('.lunalens-reset-settings');
        resetButton.addEventListener('click', function() {
            resetSettings();
            showToast('设置已重置为默认值', false);
        });

        // 阻止滚动事件冒泡到主页
        panel.addEventListener('wheel', function(e) {
            e.stopPropagation();
        });
        panel.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        });

        return panel;
    }

    // 显示词典面板
    function showPanel() {
        if (dictionaryPanel) {
            dictionaryPanel.classList.add('visible');
            dictionaryPanel.querySelector('.lunalens-dict-window').classList.add('visible');
            dictionaryPanel.querySelector('.lunalens-setting-window').classList.remove('visible');
            dictionaryPanel.querySelector('.lunalens-setting-toggle').classList.remove('active');
        }
        document.documentElement.style.overflow = 'hidden';
    }

    // 隐藏词典面板
    function hidePanel() {
        if (dictionaryPanel) {
            dictionaryPanel.classList.remove('visible');
        }
        document.documentElement.style.overflow = 'auto';
    }

    // 更新词典面板上下文（句子或段落）
    function updateContext() {
        if (!dictionaryPanel || !activeElement || !contextSentence) return;
        
        const contextArea = dictionaryPanel.querySelector('.lunalens-dict-context');
        
        // 保存当前滚动位置
        const scrollTop = contextArea.scrollTop;
        
        // 清空上下文区域
        contextArea.innerHTML = '';
        
        // 创建临时容器
        const tempContainer = document.createElement('div');
        
        if (!CONFIG.DISPLAY_SENTENCE_MODE) {
            // 段落模式：显示整个段落的内容
            tempContainer.innerHTML = activeElement.innerHTML;
        } else {
            // 句子模式：只显示当前句子的内容
            tempContainer.innerHTML = contextSentence.innerHTML;
        }
        
        // 将内容添加到上下文区域，不带原始事件监听器
        contextArea.appendChild(tempContainer);
        
        // 重新标记激活的单词
        if (activeWordElements.length > 0) {
            contextArea.querySelectorAll('.lunalens-word').forEach(word => {
                const isActive = activeWordElements.some(activeWord => 
                    activeWord === word.dataset.originalIndex || // 通过索引匹配
                    (typeof activeWord === 'object' && 
                     activeWord.dataset && 
                     activeWord.dataset.originalIndex === word.dataset.originalIndex)
                );
                
                if (isActive) {
                    word.classList.add('active-word');
                } else {
                    word.classList.remove('active-word');
                }
            });
        }
        
        // 恢复滚动位置
        contextArea.scrollTop = scrollTop;
        
        // 检查上下文内容是否变化，如果变化且翻译功能开启，才翻译上下文内容
        if (CONFIG.TRANSLATION_ENABLED) {
            const currentContextText = getContextText();
            if (currentContextText !== lastTranslatedText) {
                translateContextText(currentContextText);
            }
        }
    }

    // 获取上下文区域的纯文本
    function getContextText() {
        if (!dictionaryPanel) return '';
        
        const contextArea = dictionaryPanel.querySelector('.lunalens-dict-context');
        if (!contextArea) return '';
        
        // 去除振假名
        return getPlainText(contextArea.innerHTML).trim();
    }

    // 翻译上下文内容
    function translateContextText(text, forceTranslate = false) {
        if (!translationArea || (!CONFIG.TRANSLATION_ENABLED && !forceTranslate)) return;
        
        // 如果未提供文本参数，则获取当前上下文文本
        if (!text) {
            text = getContextText();
        }
        
        if (!text) {
            translationArea.innerHTML = '<div class="lunalens-translator-item">没有可翻译的文本</div>';
            return;
        }
        
        // 避免重复翻译相同的文本
        if (text === lastTranslatedText) {
            return;
        }
        
        // 更新上次翻译的文本
        lastTranslatedText = text;
        
        // 清空翻译区域，显示加载信息
        translationArea.innerHTML = '<div class="lunalens-translator-item">正在获取翻译...</div>';
        
        // 获取翻译器列表并发起请求
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${CONFIG.API_URL}/api/list/translator`,
            timeout: CONFIG.TIMEOUT,
            onload: (response) => {
                try {
                    const translators = JSON.parse(response.responseText);
                    if (Array.isArray(translators) && translators.length > 0) {
                        // 清空翻译容器
                        translationArea.innerHTML = '';
                        
                        // 对每个翻译器发起请求
                        translators.forEach((translator, index) => {
                            // 为每个翻译器创建一个项，先显示加载中
                            const translatorItem = document.createElement('div');
                            translatorItem.className = 'lunalens-translator-item';
                            translatorItem.innerHTML = `加载中...<span class="lunalens-translator-name">${translator.name}</span>`;
                            translationArea.appendChild(translatorItem);
                            
                            // 如果不是最后一个翻译器，添加分隔线
                            if (index < translators.length - 1) {
                                const hr = document.createElement('hr');
                                hr.className = 'lunalens-hr';
                                translationArea.appendChild(hr);
                            }
                            
                            // 发起翻译请求
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `${CONFIG.API_URL}/api/translate?text=${encodeURIComponent(text)}&id=${encodeURIComponent(translator.id)}`,
                                timeout: CONFIG.TIMEOUT,
                                onload: (response) => {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        translatorItem.innerHTML = `${data.result || '翻译失败'}<span class="lunalens-translator-name">${translator.name}</span>`;
                                    } catch (error) {
                                        translatorItem.innerHTML = `翻译结果解析失败<span class="lunalens-translator-name">${translator.name}</span>`;
                                    }
                                },
                                onerror: () => {
                                    translatorItem.innerHTML = `翻译请求失败<span class="lunalens-translator-name">${translator.name}</span>`;
                                },
                                ontimeout: () => {
                                    translatorItem.innerHTML = `翻译请求超时<span class="lunalens-translator-name">${translator.name}</span>`;
                                }
                            });
                        });
                    } else {
                        translationArea.innerHTML = '<div class="lunalens-translator-item">未找到可用的翻译器</div>';
                    }
                } catch (error) {
                    translationArea.innerHTML = '<div class="lunalens-translator-item">获取翻译器列表失败</div>';
                }
            },
            onerror: () => {
                translationArea.innerHTML = '<div class="lunalens-translator-item">获取翻译器列表失败</div>';
            },
            ontimeout: () => {
                translationArea.innerHTML = '<div class="lunalens-translator-item">获取翻译器列表超时</div>';
            }
        });
    }

    // 激活元素
    function activateElement(element) {
        // 取消激活当前元素
        deactivateElement();
        
        // 设置新的激活元素
        activeElement = element;
        // 保存原始内容以便后续恢复
        originalContent = element.innerHTML;
        element.classList.add('lunalens-highlighted');
        
        // 重置上次翻译的文本
        lastTranslatedText = '';
        
        // 创建一个取消标志，用于标识当前处理是否仍然有效
        const requestId = Date.now();
        element.dataset.requestId = requestId;
        
        // 如果TTS功能开启，尝试朗读文本
        if (CONFIG.TTS_AUTO) {
            const plainText = getPlainText(originalContent);
            setTimeout(() => {
                // 使用重构后的TTS朗读功能
                readText(plainText);
            }, 50);
        }
        
        // 处理文本并添加分词标记
        processTextWithTokenization(originalContent, html => {
            // 如果元素已经不是当前激活的元素或者请求ID不匹配，则不更新内容
            if (element !== activeElement || element.dataset.requestId != requestId) {
                return;
            }
            
            element.innerHTML = html;
            
            // 为所有单词添加点击事件
            element.querySelectorAll('.lunalens-word').forEach(word => {
                word.addEventListener('click', e => {
                    e.stopPropagation();
                    
                    // 获取单词文本
                    const wordText = word.dataset.word;
                    
                    // 获取所在句子
                    contextSentence = word.closest('.lunalens-sentence');
                    if (!contextSentence) contextSentence = element;
                    
                    // 给单词添加临时闪烁效果
                    word.classList.add('flash');
                    setTimeout(() => {
                        word.classList.remove('flash');
                    }, 1000);
                    
                    // 首先清空之前的激活状态
                    const contextArea = dictionaryPanel.querySelector('.lunalens-dict-context');
                    if (contextArea) {
                        contextArea.querySelectorAll('.lunalens-word.active-word').forEach(w => {
                            w.classList.remove('active-word');
                        });
                    }
                    activeWordElements = [];
                    
                    // 记录当前活跃词
                    activeWordElements.push(word.dataset.originalIndex || word);
                    
                    // 显示词典面板
                    showPanel();
                    
                    // 更新面板上下文
                    updateContext();
                    
                    // 设置查词框内容
                    const queryInput = dictionaryPanel.querySelector('.lunalens-dict-query-input');
                    queryInput.value = wordText;
                    
                    // 查询单词
                    lookupWord(wordText);
                });
            });
        });
    }

    // 取消激活元素
    function deactivateElement() {
        if (activeElement && originalContent) {
            activeElement.innerHTML = originalContent;
            activeElement.classList.remove('lunalens-highlighted');
            activeElement = null;
            originalContent = null;
            
            // 清除激活单词记录
            activeWordElements = [];
            
            // 清除上次翻译的文本记录
            lastTranslatedText = '';
        }
    }

    // 处理点击事件
    function handleClick(e) {
        // 如果点击发生在词典面板内，不处理
        if (dictionaryPanel && dictionaryPanel.contains(e.target)) {
            return;
        }
        
        if (activeElement && activeElement.contains(e.target)) {
            if (e.target.classList.contains('lunalens-sentence') || 
                e.target.classList.contains('lunalens-word') || 
                e.target.closest('.lunalens-word')) {
                e.preventDefault();
                return;
            }
        } else if (isElementSelectable(e.target)) {
            // 检查内容是否为空或只有空白字符
            const textContent = e.target.textContent.trim();
            if (textContent.length < CONFIG.MIN_CONTENT_LENGTH || textContent.length > CONFIG.MAX_CONTENT_LENGTH) {
                return;
            }
            
            e.preventDefault();
            activateElement(e.target);
        } else if (!e.target.closest('.lunalens-panel')) {
            // 只有当点击不在词典面板内时才停用元素
            deactivateElement();
        }
    }
    
    // 判断元素是否符合选择器设置
    function isElementSelectable(element) {
        if (!element) return false;
        
        const tagName = element.tagName.toLowerCase();
        
        // 处理逗号分隔的配置字符串并返回有效的数组
        function parseConfigList(configString) {
            return configString.split(',').map(item => item.trim()).filter(Boolean);
        }
        
        // 1. 检查标签是否在包含列表中
        const includeTags = parseConfigList(CONFIG.INCLUDE_TAGS);
        if (includeTags.length > 0 && !includeTags.includes(tagName)) {
            return false;
        }
        
        // 2. 检查标签是否在排除列表中
        const excludeTags = parseConfigList(CONFIG.EXCLUDE_TAGS);
        if (excludeTags.length > 0 && excludeTags.includes(tagName)) {
            return false;
        }
        
        // 3. 检查class和id是否在包含列表中
        const includeClassIds = parseConfigList(CONFIG.INCLUDE_CLASS_IDS);
        if (includeClassIds.length > 0) {
            let matched = false;
            for (const selector of includeClassIds) {
                if (selector.startsWith('.') && element.classList.contains(selector.substring(1))) {
                    matched = true;
                    break;
                } else if (selector.startsWith('#') && element.id === selector.substring(1)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) return false;
        }
        
        // 4. 检查class和id是否在排除列表中
        const excludeClassIds = parseConfigList(CONFIG.EXCLUDE_CLASS_IDS);
        if (excludeClassIds.length > 0) {
            for (const selector of excludeClassIds) {
                if (selector.startsWith('.') && element.classList.contains(selector.substring(1))) {
                    return false;
                } else if (selector.startsWith('#') && element.id === selector.substring(1)) {
                    return false;
                }
            }
        }
        
        // 5. 检查是否在停止容器内
        const stopContainers = parseConfigList(CONFIG.STOP_CONTAINERS);
        if (stopContainers.length > 0) {
            for (const selector of stopContainers) {
                let closestContainer = null;
                
                try {
                    closestContainer = element.closest(selector);
                } catch (e) {
                    console.error(`无效的选择器: ${selector}`, e);
                }
                
                if (closestContainer) {
                    // 如果元素本身就是停止容器，允许选择
                    if (closestContainer === element) {
                        return true;
                    }
                    
                    // 如果元素在停止容器内，需要确保它不是深层嵌套的
                    const parentContainer = element.parentElement.closest(selector);
                    if (!parentContainer || parentContainer === closestContainer) {
                        return true;
                    }
                    
                    return false;
                }
            }
        }
        
        return true;
    }

    // 处理iframe
    function handleIframe(iframe) {
        try {
            function setupIframe() {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                addStyle(iframeDoc);
                iframeDoc.addEventListener('click', handleClick);
            }

            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                setupIframe();
            } else {
                iframe.addEventListener('load', setupIframe);
            }
        } catch (e) {
            console.log('无法访问iframe:', e);
        }
    }

    // 处理所有iframe
    function handleAllIframes() {
        document.querySelectorAll('iframe').forEach(handleIframe);
    }

    // 初始化函数
    function init() {
        addStyle(document);
        document.addEventListener('click', handleClick);
        
        // 创建常驻词典面板
        dictionaryPanel = createDictionaryPanel();
        
        // 处理现有iframe
        handleAllIframes();
        
        // 监听新添加的iframe
        new MutationObserver(handleAllIframes).observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 加载保存的设置
        loadSettings();
    }

    setTimeout(init, 500);

    // 显示通知
    function showToast(message, isError = false) {
        // 创建通知元素
        const toast = document.createElement('div');
        toast.className = 'lunalens-toast';
        toast.textContent = message;
        
        // 错误消息使用红色背景
        if (isError) {
            toast.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
        } else {
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
        
        // 添加到文档中并显示
        document.body.appendChild(toast);
        
        // 强制回流以触发动画
        void toast.offsetWidth;
        toast.style.display = 'block';
        
        // 动画结束后移除元素
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }
    
    // 保存设置到本地存储
    function saveSettings() {
        const settings = {
            API_URL: CONFIG.API_URL,
            SENTENCE_DELIMITERS: CONFIG.SENTENCE_DELIMITERS,
            SENTENCE_LENGTH: CONFIG.SENTENCE_LENGTH,
            MIN_CONTENT_LENGTH: CONFIG.MIN_CONTENT_LENGTH,
            MAX_CONTENT_LENGTH: CONFIG.MAX_CONTENT_LENGTH,
            INCLUDE_TAGS: CONFIG.INCLUDE_TAGS,
            EXCLUDE_TAGS: CONFIG.EXCLUDE_TAGS,
            INCLUDE_CLASS_IDS: CONFIG.INCLUDE_CLASS_IDS,
            EXCLUDE_CLASS_IDS: CONFIG.EXCLUDE_CLASS_IDS,
            STOP_CONTAINERS: CONFIG.STOP_CONTAINERS,
            TIMEOUT: CONFIG.TIMEOUT,
            DISPLAY_SENTENCE_MODE: CONFIG.DISPLAY_SENTENCE_MODE,
            TRANSLATION_ENABLED: CONFIG.TRANSLATION_ENABLED,
            TTS_AUTO: CONFIG.TTS_AUTO
        };
        
        try {
            localStorage.setItem('lunalens_settings', JSON.stringify(settings));
        } catch (e) {
            console.error('保存设置失败:', e);
        }
    }
    
    // 从本地存储加载设置
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('lunalens_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                // 更新CONFIG对象
                Object.keys(settings).forEach(key => {
                    if (typeof CONFIG[key] !== 'undefined') {
                        CONFIG[key] = settings[key];
                    }
                });
                
                // 更新设置表单值
                if (dictionaryPanel) {
                    const panel = dictionaryPanel;
                    
                    // 更新基本设置
                    const updateField = (id, value) => {
                        const field = panel.querySelector(`#${id}`);
                        if (field) field.value = value;
                    };
                    
                    updateField('lunalens-api-url', CONFIG.API_URL);
                    updateField('sentence-delimiters', CONFIG.SENTENCE_DELIMITERS);
                    updateField('sentence-length', CONFIG.SENTENCE_LENGTH);
                    updateField('min-content-length', CONFIG.MIN_CONTENT_LENGTH);
                    updateField('max-content-length', CONFIG.MAX_CONTENT_LENGTH);
                    updateField('include-tags', CONFIG.INCLUDE_TAGS);
                    updateField('exclude-tags', CONFIG.EXCLUDE_TAGS);
                    updateField('include-class-ids', CONFIG.INCLUDE_CLASS_IDS);
                    updateField('exclude-class-ids', CONFIG.EXCLUDE_CLASS_IDS);
                    updateField('stop-containers', CONFIG.STOP_CONTAINERS);
                    updateField('timeout', CONFIG.TIMEOUT);
                    
                    // 更新顶栏按钮状态
                    panel.querySelector('.lunalens-context-toggle').textContent = 
                        CONFIG.BUTTON_TEXT.DISPLAY[CONFIG.DISPLAY_SENTENCE_MODE];
                    
                    panel.querySelector('.lunalens-translation-toggle').textContent = 
                        CONFIG.BUTTON_TEXT.TRANSLATION[CONFIG.TRANSLATION_ENABLED];
                    panel.querySelector('.lunalens-translation-toggle').classList.toggle('active', CONFIG.TRANSLATION_ENABLED);
                    
                    panel.querySelector('.lunalens-auto-tts-toggle').textContent = 
                        CONFIG.BUTTON_TEXT.TTS[CONFIG.TTS_AUTO];
                    panel.querySelector('.lunalens-auto-tts-toggle').classList.toggle('active', CONFIG.TTS_AUTO);
                    
                    // 显示/隐藏翻译区域
                    if (translationArea) {
                        translationArea.style.display = CONFIG.TRANSLATION_ENABLED ? 'block' : 'none';
                    }
                }
            }
        } catch (e) {
            console.error('加载设置失败:', e);
        }
    }
    
    // 重置设置为默认值
    function resetSettings() {
        // 从DEFAULT_CONFIG复制所有属性到CONFIG
        Object.keys(DEFAULT_CONFIG).forEach(key => {
            CONFIG[key] = DEFAULT_CONFIG[key];
        });
        
        // 更新UI上的设置值
        if (dictionaryPanel) {
            const panel = dictionaryPanel;
            
            // 更新基本设置
            const updateField = (id, value) => {
                const field = panel.querySelector(`#${id}`);
                if (field) field.value = value;
            };
            
            updateField('lunalens-api-url', CONFIG.API_URL);
            updateField('sentence-delimiters', CONFIG.SENTENCE_DELIMITERS);
            updateField('sentence-length', CONFIG.SENTENCE_LENGTH);
            updateField('min-content-length', CONFIG.MIN_CONTENT_LENGTH);
            updateField('max-content-length', CONFIG.MAX_CONTENT_LENGTH);
            updateField('include-tags', CONFIG.INCLUDE_TAGS);
            updateField('exclude-tags', CONFIG.EXCLUDE_TAGS);
            updateField('include-class-ids', CONFIG.INCLUDE_CLASS_IDS);
            updateField('exclude-class-ids', CONFIG.EXCLUDE_CLASS_IDS);
            updateField('stop-containers', CONFIG.STOP_CONTAINERS);
            updateField('timeout', CONFIG.TIMEOUT);
            
            // 更新顶栏按钮状态
            panel.querySelector('.lunalens-context-toggle').textContent = 
                CONFIG.BUTTON_TEXT.DISPLAY[CONFIG.DISPLAY_SENTENCE_MODE];
            
            panel.querySelector('.lunalens-translation-toggle').textContent = 
                CONFIG.BUTTON_TEXT.TRANSLATION[CONFIG.TRANSLATION_ENABLED];
            panel.querySelector('.lunalens-translation-toggle').classList.toggle('active', CONFIG.TRANSLATION_ENABLED);
            
            panel.querySelector('.lunalens-auto-tts-toggle').textContent = 
                CONFIG.BUTTON_TEXT.TTS[CONFIG.TTS_AUTO];
            panel.querySelector('.lunalens-auto-tts-toggle').classList.toggle('active', CONFIG.TTS_AUTO);
            
            // 显示/隐藏翻译区域
            if (translationArea) {
                translationArea.style.display = CONFIG.TRANSLATION_ENABLED ? 'block' : 'none';
            }
        }
        
        // 从本地存储中移除保存的设置
        localStorage.removeItem('lunalens_settings');
    }

    // 查词典并显示结果
    function lookupWord(word) {
        if (!word) return;
        if (word === currentWord) return;

        currentWord = word;

        // 获取词典面板
        const panel = document.querySelector('.lunalens-panel');
        if (!panel) return;

        const tabsContainer = panel.querySelector('.lunalens-dict-tabs');
        const entriesContainer = panel.querySelector('.lunalens-dict-entries');
        
        // 清空现有内容
        tabsContainer.innerHTML = '';
        entriesContainer.innerHTML = `<div class="lunalens-dict-loading">正在查询${word}</div>`;
        
        // 使用兼容模式查询
        fetchDictionaryByGM(word, tabsContainer, entriesContainer);
    }

    // 使用GM_xmlhttpRequest并行获取多个词典数据
    function fetchDictionaryByGM(word, tabsContainer, entriesContainer, dictIds = []) {
        // 生成唯一请求ID
        const requestId = Date.now().toString();
        dictionaryPanel.setAttribute('data-request-id', requestId);
        
        // 如果没有提供词典ID列表，则先获取可用词典列表
        if (!dictIds || dictIds.length === 0) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.API_URL}/api/list/dictionary`,
                onload: (response) => {
                    // 检查响应是否匹配当前请求
                    if (dictionaryPanel.getAttribute('data-request-id') !== requestId) return;
                    
                    try {
                        const dictList = JSON.parse(response.responseText);
                        if (Array.isArray(dictList) && dictList.length > 0) {
                            // 提取词典ID列表
                            const ids = dictList.map(dict => dict.id);
                            // 递归调用，使用获取的词典ID列表
                            fetchDictionaryByGM(word, tabsContainer, entriesContainer, ids);
                        } else {
                            // 没有找到词典
                            showDictionaryStatus(entriesContainer, '');
                        }
                    } catch (error) {
                        console.error('获取词典列表失败:', error);
                        showDictionaryStatus(entriesContainer, '');
                    }
                },
                onerror: () => {
                    // 检查响应是否匹配当前请求
                    if (dictionaryPanel.getAttribute('data-request-id') !== requestId) return;
                    
                    showDictionaryStatus(entriesContainer, '');
                }
            });
            return;
        }
        
        // 记录未完成的请求数
        let pendingRequests = dictIds.length;
        
        // 添加MDICT内部标签切换函数
        if (entriesContainer.parentNode && !entriesContainer.parentNode.querySelector('script[data-mdict-function]')) {
            const script = document.createElement('script');
            script.setAttribute('data-mdict-function', 'true');
            script.textContent = `
                function onclickbtn_mdict_internal(_id) {
                    tabPanes = document.querySelectorAll('.tab-widget_mdict_internal .tab-pane_mdict_internal');
                    tabButtons = document.querySelectorAll('.tab-widget_mdict_internal .tab-button_mdict_internal');
                    for (i = 0; i < tabButtons.length; i++)
                        tabButtons[i].classList.remove('active');
                    for (i = 0; i < tabPanes.length; i++)
                        tabPanes[i].classList.remove('active');

                    document.getElementById(_id).classList.add('active');

                    tabId = document.getElementById(_id).getAttribute('data-tab');
                    tabPane = document.getElementById(tabId);
                    tabPane.classList.add('active');
                }
            `;
            entriesContainer.parentNode.appendChild(script);
        }
        
        // 并行请求每个词典
        dictIds.forEach(dictId => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.API_URL}/api/dictionary?id=${dictId}&word=${encodeURIComponent(word)}`,
                onload: (response) => {
                    // 检查响应是否匹配当前请求
                    if (dictionaryPanel.getAttribute('data-request-id') !== requestId) return;
                    
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        // 隐藏加载提示
                        const loadingIndicator = entriesContainer.querySelector('.lunalens-dict-loading');
                        if (loadingIndicator) loadingIndicator.style.display = 'none';
                        
                        // 添加词典条目
                        addDictionaryEntry(tabsContainer, entriesContainer, data);
                    } catch (error) {
                        console.error(`获取词典 ${dictId} 失败:`, error);
                    }
                    
                    // 减少未完成请求计数
                    pendingRequests--;
                    
                    // 如果所有请求都完成了，但没有词典结果，则显示提示
                    if (pendingRequests === 0 && tabsContainer.children.length === 0) {
                        showDictionaryStatus(entriesContainer, '');
                    }
                },
                onerror: () => {
                    // 检查响应是否匹配当前请求
                    if (dictionaryPanel.getAttribute('data-request-id') !== requestId) return;
                    
                    console.error(`获取词典 ${dictId} 失败`);
                    
                    // 减少未完成请求计数
                    pendingRequests--;
                    
                    // 如果所有请求都完成了，但没有词典结果，则显示提示
                    if (pendingRequests === 0 && tabsContainer.children.length === 0) {
                        showDictionaryStatus(entriesContainer, '');
                    }
                }
            });
        });
    }

    // 显示词典状态信息
    function showDictionaryStatus(container, message) {
        const loadingIndicator = container.querySelector('.lunalens-dict-loading');
        if (loadingIndicator) {
            loadingIndicator.textContent = message;
        } else {
            container.innerHTML = `<div class="lunalens-dict-loading">${message}</div>`;
        }
    }

    // 添加词典条目
    function addDictionaryEntry(tabsContainer, entriesContainer, data, isFirst) {
        // 如果没有词典名称，直接跳过
        if (!data.name) return;
        
        const dictName = data.name;
        const dictId = `dict-${dictName.replace(/\s+/g, '-')}`;
        
        // 检查是否已有该词典结果
        let entryDiv = document.getElementById(dictId);
        
        if (!entryDiv) {
            // 创建新词典条目
            entryDiv = document.createElement('div');
            entryDiv.className = 'lunalens-dict-entry';
            if (isFirst || tabsContainer.children.length === 0) entryDiv.classList.add('active');
            entryDiv.id = dictId;
            entryDiv.setAttribute('data-dict', dictName);
            entryDiv.innerHTML = `<div class="lunalens-dict-content">${data.result || ''}</div>`;
            entriesContainer.appendChild(entryDiv);
            
            // 添加词典标签
            const tab = document.createElement('div');
            tab.className = 'lunalens-dict-tab';
            if (isFirst || tabsContainer.children.length === 0) tab.classList.add('active');
            tab.textContent = dictName;
            tab.setAttribute('data-dict', dictName);
            
            tab.addEventListener('click', function() {
                // 更新标签状态
                document.querySelectorAll('.lunalens-dict-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 更新词典显示
                const dictName = this.getAttribute('data-dict');
                document.querySelectorAll('.lunalens-dict-entry').forEach(entry => {
                    if (entry.getAttribute('data-dict') === dictName) {
                        entry.classList.add('active');
                    } else {
                        entry.classList.remove('active');
                    }
                });
            });
            
            tabsContainer.appendChild(tab);
        } else {
            // 更新现有词典内容
            const contentDiv = entryDiv.querySelector('.lunalens-dict-content');
            if (contentDiv) contentDiv.innerHTML = data.result || '';
        }
    }

    // TTS朗读功能
    function readText(text, element = null) {
        if (!text || !text.trim()) return false;

        stopReading();

        // 检测设备类型并使用适当的播放方法
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // 在移动设备上直接使用Audio元素和原始URL
            playWithDirectUrl(text);
        } else {
            // 在桌面设备上使用ArrayBuffer加音频解码
            fetchAndPlayTTS(text);
        }
        
        return true;
    }
    
    // 停止朗读
    function stopReading() {
        // 取消所有待处理的TTS请求
        pendingTTSRequests.forEach(request => {
            if (request && request.abort) {
                try {
                    request.abort();
                } catch(e) {
                    console.log('取消TTS请求失败:', e);
                }
            }
        });
        pendingTTSRequests = [];
        
        // 停止当前播放的音频
        if (currentAudio) {
            try {
                currentAudio.pause();
                if (currentAudio.src) {
                    URL.revokeObjectURL(currentAudio.src);
                }
                
                // 释放资源
                if (currentAudio.source && currentAudio.context) {
                    try {
                        currentAudio.source.stop();
                        currentAudio.context.close();
                    } catch(e) {}
                }
            } catch(e) {
                console.error('停止播放时出错:', e);
            } finally {
                currentAudio = null;
            }
        }
    }
    
    
    // 直接通过URL播放（适用于移动设备）
    function playWithDirectUrl(text) {

        const audio = new Audio();
        audio.src = `${CONFIG.API_URL}/api/tts?text=${encodeURIComponent(text)}`;
        
        currentAudio = {
            element: audio,
            pause: function() {
                try {
                    this.element.pause();
                } catch(e) {
                    console.error('停止播放失败:', e);
                }
            }
        };
        
        audio.onended = () => {
            currentAudio = null;
        };
        
        audio.onerror = (e) => {
            console.error('音频播放失败:', e);
            currentAudio = null;
        };
        
        audio.play().catch(e => fetchAndPlayTTS(text));
    }

    // 获取并播放TTS（适用于桌面设备）
    function fetchAndPlayTTS(text) {
        const request = GM_xmlhttpRequest({
            method: 'GET',
            url: `${CONFIG.API_URL}/api/tts?text=${encodeURIComponent(text)}`,
            responseType: 'arraybuffer',
            timeout: CONFIG.TIMEOUT,
            onload: response => {
                // 从待处理列表中移除该请求
                const index = pendingTTSRequests.indexOf(request);
                if (index > -1) {
                    pendingTTSRequests.splice(index, 1);
                }
                
                if (response.status >= 200 && response.status < 300) {
                    playAudioBlob(response.response);
                } else {
                    console.error('TTS请求失败! 状态:', response.status);
                }
            },
            onerror: error => {
                // 从待处理列表中移除该请求
                const index = pendingTTSRequests.indexOf(request);
                if (index > -1) {
                    pendingTTSRequests.splice(index, 1);
                }
                console.error('TTS请求失败:', error);
            },
            ontimeout: () => {
                // 从待处理列表中移除该请求
                const index = pendingTTSRequests.indexOf(request);
                if (index > -1) {
                    pendingTTSRequests.splice(index, 1);
                }
                console.error('TTS请求超时');
            }
        });
        
        // 将请求添加到待处理列表
        pendingTTSRequests.push(request);
    }
    
    // 播放音频数据（仅用于桌面设备）
    function playAudioBlob(arrayBuffer) {
        // 如果已经有音频在播放或者系统已停止，则不播放新音频
        if (currentAudio) {
            return;
        }
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            audioContext.decodeAudioData(arrayBuffer, 
                (buffer) => {
                    const source = audioContext.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioContext.destination);
                    
                    currentAudio = {
                        source: source,
                        context: audioContext,
                        pause: function() {
                            try {
                                this.source.stop();
                                this.context.close();
                            } catch(e) {}
                        }
                    };
                    
                    source.onended = () => {
                        audioContext.close().catch(() => {});
                        currentAudio = null;
                    };
                    
                    source.start(0);
                },
                () => console.error('音频播放失败')
            );
        } catch (e) {
            console.error('音频播放失败:', e);
            playWithDirectUrl(text);
        }
    }
})();