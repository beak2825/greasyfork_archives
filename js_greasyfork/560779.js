// ==UserScript==
// @name         Pixiv 小说 TTS 阅读器 (CosyVoice)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调用本地 CosyVoice API 朗读 Pixiv 小说，支持全文朗读、选段朗读、进度控制
// @author       Moear
// @match        https://www.pixiv.net/novel/show.php?id=*
// @connect      127.0.0.1
// @connect      localhost
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://www.pixiv.net/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560779/Pixiv%20%E5%B0%8F%E8%AF%B4%20TTS%20%E9%98%85%E8%AF%BB%E5%99%A8%20%28CosyVoice%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560779/Pixiv%20%E5%B0%8F%E8%AF%B4%20TTS%20%E9%98%85%E8%AF%BB%E5%99%A8%20%28CosyVoice%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    const DEFAULT_API_URL = 'http://127.0.0.1:9880';
    let API_URL = GM_getValue('api_url', DEFAULT_API_URL);
    let NARRATOR_SPEAKER = GM_getValue('narrator_speaker', '');
    let DIALOGUE_SPEAKER = GM_getValue('dialogue_speaker', '');
    let PLAYBACK_SPEED = GM_getValue('playback_speed', 1.0);
    let SHOW_INLINE_BTNS = GM_getValue('show_inline_btns', true);

    // === 状态 ===
    let audioQueue = [];
    let isPlaying = false;
    let currentAudio = null;
    
    // 缓冲播放相关
    let audioCache = {}; // 存放已生成的 blob URL (当前会话)
    const globalAudioCache = new Map(); // 全局缓存 text -> blobUrl (跨会话复用)
    let generationIndex = 0; // 生成进度
    let playbackIndex = 0;   // 播放进度
    let isGenerating = false;
    let isPlayingAudio = false;

    // 全局进度相关
    let paragraphMap = new Map(); // element -> { chunks: [], startIndex: int }
    let globalTotalChunks = 0;
    let globalChunkOffset = 0; // 当前播放队列相对于全文的偏移量
    let isGlobalContext = false; // 是否处于全文/段落模式

    let totalChunks = 0;
    let speakers = [];

    // === UI 元素 ===
    let container, statusDiv, progressCanvas, narratorSelect, dialogueSelect, speedInput;

    // 等待页面加载
    window.addEventListener('load', init);

    function init() {
        // 注册菜单命令
        GM_registerMenuCommand("设置 API 地址", configureApiUrl);

        // 分析页面结构
        // Pixiv 内容可能动态加载，稍微延迟一下或使用 MutationObserver 更好，
        // 但为了简单起见，先尝试直接分析，如果不行可能需要手动触发
        setTimeout(() => {
            analyzePage();
            injectInlineButtons();
        }, 1000);

        // 创建 UI
        createUI();

        // 获取角色列表
        fetchSpeakers();

        // 添加右键菜单监听
        document.addEventListener('contextmenu', handleContextMenu);
    }

    // === API 交互 ===

    function configureApiUrl() {
        const url = prompt("请输入 CosyVoice API 地址 (例如 http://127.0.0.1:9880):", API_URL);
        if (url) {
            API_URL = url.replace(/\/$/, ''); // 去除末尾斜杠
            GM_setValue('api_url', API_URL);
            fetchSpeakers(); // 重新获取角色
            showNotification('API 地址已更新', 'success');
        }
    }

    function fetchSpeakers() {
        updateStatus('正在获取角色列表...', 'loading');
        GM_xmlhttpRequest({
            method: "GET",
            url: `${API_URL}/api/characters`, // 使用 /api/characters 获取列表
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // 兼容处理：可能是字符串数组 ["Role1", "Role2"] 或 对象数组 [{name: "Role1"}, ...]
                        if (Array.isArray(data)) {
                            speakers = data.map(item => {
                                if (typeof item === 'object' && item !== null) {
                                    return item.name || item.voice_id || "Unknown";
                                }
                                return String(item);
                            });
                        } else {
                            // 可能是对象字典 { "Role1": {...} }
                            speakers = Object.keys(data);
                        }
                        
                        updateSpeakerSelect();
                        updateStatus('就绪', 'idle');
                    } catch (e) {
                        console.error("解析角色列表失败", e);
                        updateStatus('获取角色失败', 'error');
                    }
                } else {
                    updateStatus('连接 API 失败', 'error');
                }
            },
            onerror: function(err) {
                console.error("API 请求错误", err);
                updateStatus('无法连接到本地服务', 'error');
            }
        });
    }

    function generateAudio(text, speaker, callback) {
        // 使用 /api/tts 接口
        const payload = {
            text: text,
            character_name: speaker,
            speed: parseFloat(PLAYBACK_SPEED) || 1.0
        };
        
        console.log("Sending TTS request:", payload);

        const data = JSON.stringify(payload);

        GM_xmlhttpRequest({
            method: "POST",
            url: `${API_URL}/api/tts`,
            headers: {
                "Content-Type": "application/json"
            },
            data: data,
            responseType: "blob",
            onload: function(response) {
                if (response.status === 200) {
                    const blob = response.response;
                    const url = URL.createObjectURL(blob);
                    callback(url);
                } else {
                    console.error("TTS 生成失败", response);
                    // 尝试读取错误信息
                    if (response.responseType === 'blob') {
                        const reader = new FileReader();
                        reader.onload = function() {
                            console.error("错误详情:", reader.result);
                        }
                        reader.readAsText(response.response);
                    } else {
                        console.error("错误详情:", response.responseText);
                    }
                    callback(null);
                }
            },
            onerror: function(err) {
                console.error("TTS 请求错误", err);
                callback(null);
            }
        });
    }

    // === 核心逻辑 ===

    function getReadContent() {
        // Pixiv 小说正文通常在 main 标签内
        return document.querySelector('main');
    }

    function getParagraphs() {
        const content = getReadContent();
        if (!content) return [];
        // Pixiv 的段落通常是 p 标签
        return content.querySelectorAll('p');
    }

    function analyzePage() {
        const paragraphs = getParagraphs();
        if (!paragraphs.length) return;
        
        let currentGlobalIndex = 0;
        paragraphMap.clear();
        
        paragraphs.forEach(p => {
            const text = getCleanText(p);
            if (!text) {
                paragraphMap.set(p, { chunks: [], startIndex: currentGlobalIndex });
                return;
            }
            
            // 使用新的分段逻辑
            const segments = parseTextByQuotes(text);
            let pChunks = [];
            
            segments.forEach(seg => {
                const chunks = splitTextToChunks(seg.text);
                pChunks = pChunks.concat(chunks);
            });
            
            paragraphMap.set(p, { chunks: pChunks, startIndex: currentGlobalIndex });
            currentGlobalIndex += pChunks.length;
        });
        globalTotalChunks = currentGlobalIndex;
        console.log(`Page analyzed: ${globalTotalChunks} chunks total.`);
    }

    function playFullText() {
        const paragraphs = getParagraphs();
        if (paragraphs.length === 0) {
            showNotification('未找到正文内容', 'error');
            return;
        }
        
        const queue = buildQueueFromElements(paragraphs);
        startQueue(queue, 0, true);
    }

    function playSelection() {
        const selection = window.getSelection().toString().trim();
        if (!selection) {
            showNotification('请先选择文字', 'warning');
            return;
        }
        // 选中文本没有对应的元素高亮，使用纯文本模式
        const queue = buildQueueFromText(selection);
        startQueue(queue, 0, false);
    }

    function startQueue(queueItems, offset = 0, isGlobal = false) {
        stopPlayback(); // 重置状态

        if (queueItems.length === 0) return;

        audioQueue = queueItems;
        totalChunks = queueItems.length;
        globalChunkOffset = offset;
        isGlobalContext = isGlobal;
        
        // 初始化状态
        generationIndex = 0;
        playbackIndex = 0;
        audioCache = {};
        isPlaying = true;
        isGenerating = true;
        isPlayingAudio = false;

        drawProgressBar();
        
        // 启动生产者（生成）和消费者（播放）
        generateNext();
        tryPlayNext();
    }

    function getCleanText(element) {
        const clone = element.cloneNode(true);
        // 移除按钮和脚本
        clone.querySelectorAll('script, style, .tts-inline-btn-container').forEach(el => el.remove());
        // 替换 <br> 为换行
        clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
        
        let text = clone.textContent.trim();
        // 再次清理可能残留的按钮文本（双重保险）
        text = text.replace(/▶ 读此段|⏩ 从这读/g, '');
        return text;
    }

    function buildQueueFromElements(elements) {
        const queue = [];
        elements.forEach(el => {
            const text = getCleanText(el);
            if (!text) return;
            
            const segments = parseTextByQuotes(text);
            
            segments.forEach(seg => {
                const chunks = splitTextToChunks(seg.text);
                chunks.forEach(chunk => {
                    queue.push({
                        text: chunk,
                        element: el, // 关联 DOM 元素用于高亮
                        type: seg.type // 'narrator' | 'dialogue'
                    });
                });
            });
        });
        return queue;
    }

    function buildQueueFromText(text) {
        // 清理文本中的按钮文字
        text = text.replace(/▶ 读此段|⏩ 从这读/g, '');
        
        const segments = parseTextByQuotes(text);
        const queue = [];
        
        segments.forEach(seg => {
            const chunks = splitTextToChunks(seg.text);
            chunks.forEach(chunk => {
                queue.push({
                    text: chunk,
                    element: null,
                    type: seg.type
                });
            });
        });
        return queue;
    }

    function parseTextByQuotes(text) {
        // 匹配引号内容，保留分隔符
        // 支持中文双引号 “...”，直角引号 「...」，英文双引号 "..."
        // 使用 [\s\S] 确保能匹配包含换行符的对话
        const regex = /([“][\s\S]*?[”]|[「][\s\S]*?[」]|"[\s\S]*?")/g;
        const parts = text.split(regex);
        const segments = [];
        
        parts.forEach(part => {
            if (!part) return;
            // 检查是否是引号包裹的内容
            if (/^([“][\s\S]*[”]|[「][\s\S]*[」]|"[\s\S]*")$/.test(part)) {
                segments.push({ text: part, type: 'dialogue' });
            } else {
                if (part.trim()) {
                    segments.push({ text: part, type: 'narrator' });
                }
            }
        });
        return segments;
    }

    function splitTextToChunks(text) {
        // 目标每段长度 30-50 字
        const MIN_LENGTH = 30;
        // 使用更细的粒度分割，包含逗号
        const parts = text.split(/([。！？；\n，,]+)/);
        const chunks = [];
        let currentChunk = '';

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            currentChunk += part;
            
            // 如果当前块长度超过最小值，且当前部分是标点（尽量在标点处断开）
            // 或者长度实在太长了(>80)，强制断开
            if ((currentChunk.length >= MIN_LENGTH && /^[。！？；\n，,]+$/.test(part)) || currentChunk.length > 80) {
                chunks.push(currentChunk);
                currentChunk = '';
            }
        }
        if (currentChunk.trim()) chunks.push(currentChunk.trim());

        return chunks;
    }

    // 生产者：负责连续生成音频
    function generateNext() {
        if (!isPlaying || !isGenerating || generationIndex >= totalChunks) {
            isGenerating = false;
            return;
        }

        const currentIndex = generationIndex;
        const item = audioQueue[currentIndex];
        const text = item.text;
        
        // 确定角色
        let speaker = NARRATOR_SPEAKER;
        if (item.type === 'dialogue') {
            speaker = DIALOGUE_SPEAKER;
        }
        // 如果没有设置，回退到默认逻辑（虽然现在应该都有值）
        if (!speaker) speaker = NARRATOR_SPEAKER;

        if (!speaker) {
            showNotification('请先选择角色', 'error');
            stopPlayback();
            return;
        }

        // 限制缓冲数量
        if (generationIndex - playbackIndex > 5) {
            setTimeout(generateNext, 1000);
            return;
        }

        updateStatus(`正在生成第 ${currentIndex + 1}/${totalChunks} 段...`, 'loading');
        drawProgressBar(); // 更新生成状态(黄色)
        
        // 检查全局缓存 (key 需要包含角色名，因为不同角色读同一段话声音不同)
        const cacheKey = `${speaker}:${text}`;
        
        if (globalAudioCache.has(cacheKey)) {
            const url = globalAudioCache.get(cacheKey);
            audioCache[currentIndex] = url;
            if (item.element) {
                item.element.classList.add('tts-cached');
            }
            generationIndex++; // 命中缓存也要推进进度
            drawProgressBar(); // 更新缓存状态(绿色)
            tryPlayNext();
            // 立即处理下一段，使用 setTimeout 避免递归栈溢出
            setTimeout(generateNext, 0);
            return;
        }

        // 标记缓存状态（如果有关联元素）
        if (item.element) {
            item.element.classList.add('tts-cached');
        }

        generationIndex++; 
        drawProgressBar(); // 更新生成进度

        generateAudio(text, speaker, (audioUrl) => {
            if (!isPlaying) return; 

            if (audioUrl) {
                audioCache[currentIndex] = audioUrl;
                globalAudioCache.set(cacheKey, audioUrl); // 存入全局缓存 (带角色key)
                drawProgressBar(); // 更新完成状态(绿色)
                tryPlayNext();
            } else {
                console.error(`第 ${currentIndex + 1} 段生成失败`);
                audioCache[currentIndex] = 'error'; 
                tryPlayNext();
            }

            generateNext();
        });
    }

    // 消费者：负责连续播放音频
    function tryPlayNext() {
        if (!isPlaying || isPlayingAudio) return; 

        if (playbackIndex >= totalChunks) {
            updateStatus('播放结束', 'idle');
            isPlaying = false;
            return;
        }

        const url = audioCache[playbackIndex];
        const item = audioQueue[playbackIndex];

        drawProgressBar(); // 更新播放游标

        if (url) {
            if (url === 'error') {
                playbackIndex++;
                updateProgress();
                tryPlayNext();
                return;
            }

            updateStatus(`正在播放第 ${playbackIndex + 1}/${totalChunks} 段`, 'playing');
            
            // 高亮当前段落
            highlightElement(item.element);
            
            playAudio(url);
        } else {
            updateStatus(`缓冲中... (${playbackIndex + 1}/${totalChunks})`, 'loading');
        }
    }

    function highlightElement(element) {
        // 移除旧的高亮
        document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading'));
        
        if (element) {
            element.classList.add('tts-reading');
            // 滚动到可视区域
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function playAudio(url) {
        if (currentAudio) {
            currentAudio.pause();
            // 不再 revoke，以便复用
            // URL.revokeObjectURL(currentAudio.src);
        }

        isPlayingAudio = true;
        currentAudio = new Audio(url);
        currentAudio.playbackRate = 1.0; 
        
        currentAudio.onended = () => {
            isPlayingAudio = false;
            // 不再 revoke，以便复用
            // URL.revokeObjectURL(url);
            delete audioCache[playbackIndex]; // 清除当前会话缓存引用
            
            playbackIndex++;
            updateProgress();
            tryPlayNext(); // 播放下一段
        };

        currentAudio.onerror = () => {
            console.error("音频播放出错");
            isPlayingAudio = false;
            playbackIndex++;
            tryPlayNext();
        };

        currentAudio.play().catch(e => {
            console.error("播放被阻止", e);
            showNotification('自动播放被阻止，请点击页面', 'warning');
            isPlayingAudio = false;
            // 这种情况下可能需要用户交互才能继续，或者暂停
            isPlaying = false;
        });
    }

    function stopPlayback() {
        isPlaying = false;
        isGenerating = false;
        isPlayingAudio = false;
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        // 清理当前会话缓存，但不 revoke URL (因为全局缓存还在用)
        audioCache = {};
        audioQueue = [];
        
        // 清除高亮
        document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading'));
        // 保留 .tts-cached 样式，因为全局缓存还在，用户可以看到哪些段落已经有缓存了
        // document.querySelectorAll('.tts-cached').forEach(el => el.classList.remove('tts-cached'));
        
        updateStatus('已停止', 'idle');
        updateProgress(true);
    }

    // === UI 构建 ===

    function createUI() {
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .tts-reading { 
                background-color: rgba(0, 255, 255, 0.2) !important; 
                border: 1px solid #00bcd4;
                border-radius: 4px; 
                box-shadow: 0 0 10px rgba(0, 188, 212, 0.3);
                transition: all 0.3s; 
            }
            .tts-cached { 
                border-left: 4px solid #4CAF50; 
                padding-left: 8px; 
                margin-left: -12px; 
            }
        `;
        document.head.appendChild(style);

        // 主容器
        container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 220px;
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: sans-serif;
            backdrop-filter: blur(5px);
            border: 1px solid #eee;
        `;

        // 标题
        const title = document.createElement('div');
        title.textContent = '🎧 Pixiv TTS';
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;';
        container.appendChild(title);

        // 角色选择区域
        const speakerContainer = document.createElement('div');
        speakerContainer.style.cssText = 'margin-bottom: 10px; border: 1px solid #eee; padding: 5px; border-radius: 4px; background: #f9f9f9;';
        
        // 旁白
        const narratorLabel = document.createElement('div');
        narratorLabel.textContent = '旁白配音:';
        narratorLabel.style.fontSize = '12px';
        narratorLabel.style.color = '#666';
        speakerContainer.appendChild(narratorLabel);

        narratorSelect = document.createElement('select');
        narratorSelect.style.cssText = 'width: 100%; margin-bottom: 5px; padding: 3px; border: 1px solid #ccc; border-radius: 3px;';
        narratorSelect.addEventListener('change', (e) => {
            NARRATOR_SPEAKER = e.target.value;
            GM_setValue('narrator_speaker', NARRATOR_SPEAKER);
        });
        speakerContainer.appendChild(narratorSelect);

        // 对话
        const dialogueLabel = document.createElement('div');
        dialogueLabel.textContent = '对话配音:';
        dialogueLabel.style.fontSize = '12px';
        dialogueLabel.style.color = '#666';
        speakerContainer.appendChild(dialogueLabel);

        dialogueSelect = document.createElement('select');
        dialogueSelect.style.cssText = 'width: 100%; padding: 3px; border: 1px solid #ccc; border-radius: 3px;';
        dialogueSelect.addEventListener('change', (e) => {
            DIALOGUE_SPEAKER = e.target.value;
            GM_setValue('dialogue_speaker', DIALOGUE_SPEAKER);
        });
        speakerContainer.appendChild(dialogueSelect);

        container.appendChild(speakerContainer);

        // 语速控制
        const speedContainer = document.createElement('div');
        speedContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px; gap: 5px;';
        
        const speedLabel = document.createElement('span');
        speedLabel.textContent = '语速:';
        speedLabel.style.fontSize = '12px';
        
        speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.step = '0.1';
        speedInput.min = '0.5';
        speedInput.max = '2.0';
        speedInput.value = PLAYBACK_SPEED;
        speedInput.style.cssText = 'width: 50px; padding: 2px;';
        speedInput.addEventListener('change', (e) => {
            PLAYBACK_SPEED = e.target.value;
            GM_setValue('playback_speed', PLAYBACK_SPEED);
        });

        speedContainer.appendChild(speedLabel);
        speedContainer.appendChild(speedInput);
        container.appendChild(speedContainer);

        // 段落按钮开关
        const toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px; gap: 5px;';
        
        const toggleLabel = document.createElement('span');
        toggleLabel.textContent = '显示段落按钮:';
        toggleLabel.style.fontSize = '12px';
        
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = SHOW_INLINE_BTNS;
        toggleInput.addEventListener('change', (e) => {
            SHOW_INLINE_BTNS = e.target.checked;
            GM_setValue('show_inline_btns', SHOW_INLINE_BTNS);
            toggleInlineButtons();
        });

        toggleContainer.appendChild(toggleLabel);
        toggleContainer.appendChild(toggleInput);
        container.appendChild(toggleContainer);

        // 按钮区域
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'display: flex; gap: 5px; margin-bottom: 10px;';

        const playBtn = createButton('▶ 全文', '#4CAF50');
        playBtn.onclick = playFullText;
        
        const stopBtn = createButton('⏹ 停止', '#f44336');
        stopBtn.onclick = stopPlayback;

        btnContainer.appendChild(playBtn);
        btnContainer.appendChild(stopBtn);
        container.appendChild(btnContainer);

        // 状态显示
        statusDiv = document.createElement('div');
        statusDiv.textContent = '就绪';
        statusDiv.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
        container.appendChild(statusDiv);

        // 进度条 (Canvas)
        const canvasContainer = document.createElement('div');
        canvasContainer.style.cssText = 'width: 100%; height: 12px; background: #333; border-radius: 2px; overflow: hidden; margin-top: 5px;';
        progressCanvas = document.createElement('canvas');
        progressCanvas.width = 440; // 2x resolution for sharpness
        progressCanvas.height = 24;
        progressCanvas.style.cssText = 'width: 100%; height: 100%; display: block;';
        canvasContainer.appendChild(progressCanvas);
        container.appendChild(canvasContainer);

        document.body.appendChild(container);
    }

    function drawProgressBar() {
        if (!progressCanvas || !progressCanvas.getContext) return;
        const ctx = progressCanvas.getContext('2d');
        const w = progressCanvas.width;
        const h = progressCanvas.height;
        
        ctx.clearRect(0, 0, w, h);
        
        // 决定总长度
        const total = isGlobalContext && globalTotalChunks > 0 ? globalTotalChunks : totalChunks;
        if (total === 0) return;
        
        const chunkW = w / total;
        
        for (let i = 0; i < total; i++) {
            let color = '#333'; // 默认背景
            
            // 计算当前 i 对应的 audioQueue 索引
            let localIndex = -1;
            let isSkipped = false;
            
            if (isGlobalContext) {
                if (i < globalChunkOffset) {
                    isSkipped = true;
                    color = '#222'; // 跳过的部分(前面)
                } else if (i >= globalChunkOffset + totalChunks) {
                    isSkipped = true;
                    color = '#222'; // 跳过的部分(后面)
                } else {
                    localIndex = i - globalChunkOffset;
                }
            } else {
                localIndex = i;
            }
            
            if (!isSkipped && localIndex >= 0 && localIndex < totalChunks) {
                const item = audioQueue[localIndex];
                // 检查缓存 (注意 key 变化)
                let speaker = item.type === 'dialogue' ? DIALOGUE_SPEAKER : NARRATOR_SPEAKER;
                const cacheKey = `${speaker}:${item.text}`;
                
                if (audioCache[localIndex] || (item && globalAudioCache.has(cacheKey))) {
                    color = '#4CAF50'; // 绿色 (已缓存)
                } else if (localIndex === generationIndex && isGenerating) {
                    color = '#FFEB3B'; // 黄色 (正在推理)
                } else {
                    color = '#555'; // 队列中等待生成
                }
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(i * chunkW, 0, chunkW, h);
            
            // 绘制播放进度指示
            if (!isSkipped && localIndex === playbackIndex && isPlaying) {
                ctx.fillStyle = 'rgba(33, 150, 243, 0.8)'; 
                ctx.fillRect(i * chunkW, 0, chunkW, h);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.strokeRect(i * chunkW, 0, chunkW, h);
            }
        }
    }

    function createButton(text, color) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            flex: 1;
            background: ${color};
            color: white;
            border: none;
            padding: 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: opacity 0.2s;
        `;
        btn.onmouseover = () => btn.style.opacity = '0.9';
        btn.onmouseout = () => btn.style.opacity = '1';
        return btn;
    }

    function injectInlineButtons() {
        const paragraphs = getParagraphs();
        if (!paragraphs.length) return;

        paragraphs.forEach((p, index) => {
            if (!p.textContent.trim()) return; // 跳过空段落

            const btnContainer = document.createElement('span');
            btnContainer.className = 'tts-inline-btn-container';
            btnContainer.style.cssText = `
                display: ${SHOW_INLINE_BTNS ? 'inline-flex' : 'none'};
                gap: 5px;
                margin-left: 10px;
                vertical-align: middle;
            `;

            const playFromHereBtn = createInlineButton('⏩ 从这读', '#2196F3');
            playFromHereBtn.onclick = (e) => {
                e.stopPropagation();
                // 获取从当前段落开始的所有段落元素
                const remainingParagraphs = Array.from(paragraphs).slice(index);
                const queue = buildQueueFromElements(remainingParagraphs);
                
                // 计算全局偏移
                const meta = paragraphMap.get(p);
                const offset = meta ? meta.startIndex : 0;
                
                startQueue(queue, offset, true);
            };

            const playThisBtn = createInlineButton('▶ 读此段', '#4CAF50');
            playThisBtn.onclick = (e) => {
                e.stopPropagation();
                const queue = buildQueueFromElements([p]);
                
                // 计算全局偏移
                const meta = paragraphMap.get(p);
                const offset = meta ? meta.startIndex : 0;
                
                startQueue(queue, offset, true);
            };

            btnContainer.appendChild(playThisBtn);
            btnContainer.appendChild(playFromHereBtn);
            p.appendChild(btnContainer);
        });
    }

    function createInlineButton(text, color) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            background: ${color};
            color: white;
            border: none;
            padding: 2px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;
        btn.onmouseover = () => btn.style.opacity = '1';
        btn.onmouseout = () => btn.style.opacity = '0.7';
        return btn;
    }

    function toggleInlineButtons() {
        const containers = document.querySelectorAll('.tts-inline-btn-container');
        containers.forEach(c => {
            c.style.display = SHOW_INLINE_BTNS ? 'inline-flex' : 'none';
        });
    }

    function updateSpeakerSelect() {
        narratorSelect.innerHTML = '';
        dialogueSelect.innerHTML = '';
        
        if (speakers.length === 0) {
            const opt = document.createElement('option');
            opt.textContent = '无可用角色';
            narratorSelect.appendChild(opt.cloneNode(true));
            dialogueSelect.appendChild(opt);
            return;
        }

        speakers.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            
            const opt2 = opt.cloneNode(true);
            
            if (name === NARRATOR_SPEAKER) opt.selected = true;
            if (name === DIALOGUE_SPEAKER) opt2.selected = true;
            
            narratorSelect.appendChild(opt);
            dialogueSelect.appendChild(opt2);
        });

        // 默认值处理
        if ((!NARRATOR_SPEAKER || !speakers.includes(NARRATOR_SPEAKER)) && speakers.length > 0) {
            NARRATOR_SPEAKER = speakers[0];
            narratorSelect.value = NARRATOR_SPEAKER;
            GM_setValue('narrator_speaker', NARRATOR_SPEAKER);
        }
        
        if ((!DIALOGUE_SPEAKER || !speakers.includes(DIALOGUE_SPEAKER)) && speakers.length > 0) {
            // 尝试找第二个角色作为对话，如果没有就用第一个
            DIALOGUE_SPEAKER = speakers.length > 1 ? speakers[1] : speakers[0];
            dialogueSelect.value = DIALOGUE_SPEAKER;
            GM_setValue('dialogue_speaker', DIALOGUE_SPEAKER);
        }
    }

    function updateStatus(text, type) {
        // 如果正在播放，显示全局进度
        if (isPlaying && type === 'playing') {
             if (isGlobalContext) {
                 const currentGlobal = globalChunkOffset + playbackIndex + 1;
                 statusDiv.textContent = `播放: ${currentGlobal}/${globalTotalChunks} 段`;
             } else {
                 statusDiv.textContent = `播放: ${playbackIndex + 1}/${totalChunks} 段`;
             }
        } else {
             statusDiv.textContent = text;
        }

        if (type === 'error') statusDiv.style.color = '#f44336';
        else if (type === 'playing') statusDiv.style.color = '#2196F3';
        else statusDiv.style.color = '#666';
    }

    function updateProgress(reset = false) {
        drawProgressBar();
    }

    // === 右键菜单处理 ===
    
    function handleContextMenu(e) {
        const selection = window.getSelection().toString().trim();
        if (!selection) return;

        // 阻止默认菜单（可选，这里我们选择不完全阻止，而是添加一个自定义浮窗）
        // 为了不破坏原生体验，我们不阻止默认菜单，而是在鼠标位置显示一个临时按钮
        
        e.preventDefault(); // 阻止默认右键菜单，因为用户明确要求"右键文字tts"

        // 移除旧的菜单
        const oldMenu = document.getElementById('tts-context-menu');
        if (oldMenu) oldMenu.remove();

        const menu = document.createElement('div');
        menu.id = 'tts-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            padding: 5px 0;
            border-radius: 4px;
            z-index: 10001;
            min-width: 120px;
        `;

        const item = document.createElement('div');
        item.textContent = '🔊 朗读选中文字';
        item.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
        `;
        item.onmouseover = () => item.style.background = '#f0f0f0';
        item.onmouseout = () => item.style.background = 'white';
        
        item.onclick = () => {
            playSelection();
            menu.remove();
        };

        menu.appendChild(item);
        document.body.appendChild(menu);

        // 点击其他地方关闭菜单
        const closeMenu = (ev) => {
            if (ev.target !== menu && !menu.contains(ev.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        // 延时添加监听，防止触发点击事件立即关闭
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10002;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            background: ${type === 'success' ? '#4CAF50' : (type === 'warning' ? '#FF9800' : '#f44336')};
            animation: fadeIn 0.3s;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

})();
