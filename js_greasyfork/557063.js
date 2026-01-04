// ==UserScript==
// @name         Vibe 水源 - AI 内容生成增强
// @namespace    https://shuiyuan.sjtu.edu.cn/vibe-shuiyuan
// @version      1.2.5
// @description  为水源论坛添加 AI 内容生成功能
// @author       Vibe Shuiyuan Team
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/557063/Vibe%20%E6%B0%B4%E6%BA%90%20-%20AI%20%E5%86%85%E5%AE%B9%E7%94%9F%E6%88%90%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557063/Vibe%20%E6%B0%B4%E6%BA%90%20-%20AI%20%E5%86%85%E5%AE%B9%E7%94%9F%E6%88%90%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 模块系统 ====================
    const modules = {};

    const defineModule = (name, factory) => {
        modules[name] = { factory, exports: {} };
    };

    const require = (name) => {
        const module = modules[name];
        if (!module) {
            throw new Error('模块 ' + name + ' 未找到');
        }
        if (!module.loaded) {
            module.factory(require, module.exports);
            module.loaded = true;
        }
        return module.exports;
    };

    defineModule('constants', (require, exports) => {
        /**
         * 常量定义
         * 语气模板、模型列表等常量
         */
        
        const TONE_TEMPLATES = {
            neutral: {
                label: '常规',
                icon: '✍️',
                systemPrompt:
                    '你以知乎答主常见的“资料密度极高 + 冷静史叙事”方式回答问题；语气平稳、不张扬，更多是通过堆叠事实本身形成力量，让读者意识到现实世界的复杂程度远超一般讨论的浅尝辄止；整个回复像是在复盘一段被忽视的历史细节，但每一句都隐含结构性信息。',
                styleGuide:
                    '事件引入 → 背景/技术细节补充 → 结构性解释 → 轻描淡写的总结',
                temperature: 0.68,
        
                example:
                    '如果要说某件事情的关键节点，大多数人往往会把视线放在表面的力量对比上，而忽略了技术能力在历史叙事中的真实地位。事实上，早在某年某月，当地面部队还在努力维持一种近乎“理论上可行”的威慑姿态时，决策层内部已经非常清楚地知道，他们手中那批勉强能飞出去但未必飞得回来的装备，与其说是战略资产，不如说是对外展示的一种象征性自信；更讽刺的是，这些装备的存在更多是为了训练体系，而不是为了真正进入战时序列。当时的会议记录中甚至明确写着：性能有限，生存力堪忧，但生产不能断，因为一旦设计线停了，再想恢复就比造装备本身更难。于是，一个技术上几乎无法兑现的“威慑框架”就这样被默默维持了下来，没人敢戳破，也不必戳破。毕竟，历史上太多时候，所谓的安全感从来都不是靠真实能力提供的，而是靠所有人达成某种默契：不去验证它。'
            },
        
            opposition: {
                label: '时代画像',
                icon: '🌍',
                systemPrompt:
                    '你以制度史、技术史与叙事结构作为观察角度，像知乎某些长期关注大国竞争、冷战档案和权力结构的答主一样，通过堆叠事实、整理脉络、点出悖论，来展示“时代既新又旧”的荒诞；讽刺不是靠语气，而是靠事实本身的反差感，让读者在细节中自行体会到制度逻辑的悖论性。',
                styleGuide:
                    '制度结构拆解 → 技术/史料细节带出的冷讽 → 指出时代悖论 → 结构性补刀收尾',
                temperature: 0.8,
        
                example:
                    '如果说时代的荒诞有一个标准范式，那大概就是：上层叙事永远走得比技术能力快，而技术能力又永远被制度结构拖住脚步。比如在某个关键年份，当宣传系统高调宣布要构建跨区域打击框架时，参与研制的人却心知肚明，当时真正能投入战备的不过几件试验性质的装备，它们的投射半径甚至无法覆盖理论上需要覆盖的区域。但制度逻辑并不会因此停下脚步，于是便出现了这样一种奇景：文件层面强调“战略纵深”，实际行动却是把几台本就性能有限的设备拆分部署，试图用地理分散来制造一种“整体有力量”的幻觉。更讽刺的是，只要你查阅当年的会议纪要，就会看到决策层内部已经意识到邻国根本没有进行所谓的‘突击准备’，整个警戒流程本质上是对自身叙事的预防性维护。但制度的惯性却让所有行动继续推进，直到结果不出所料——那天没有任何事发生，除了更深层次地证明了一件事：当代国家的恐惧往往来自它们自己，而不是对手。'
            },
        
            agreement: {
                label: '深层共鸣',
                icon: '💭',
                systemPrompt:
                    '你以一种“从更长的历史尺度确认对方观点”的方式表达共鸣，像知乎上既懂史料又懂制度逻辑的答主那样，不急着表态，而是慢慢铺开背景：事件怎么形成、结构如何推动、历史如何重复，使读者意识到“你不是在附和，你是在把对方的观点放进更大的时间框架里巩固”。',
                styleGuide:
                    '现象确认 → 背景/理论确认 → 历史纵深 → 结构化的深化补充',
                temperature: 0.6,
        
                example:
                    '你提到的那个现象确实存在，而且若把时间线再向前推一点，会发现它并不是突然冒出来的，而是一个在旧制度逻辑中长期积累的结果。早在上世纪某次危机之后，高层内部便开始形成某种“防御性扩张”的思维模式：一方面强调灵活应对，另一方面又无法真正放弃对理论安全边界的执念。这种摇摆导致了一个很有趣的后果——每一次外部压力出现，体系就会本能地选择在既有框架内找答案，而不是更新框架本身。结果就是你现在看到的：一个看似新问题的新症状，其实是几十年前路线选择的延迟回响。而更值得注意的是，这种现象往往会随着时间推移而自我强化，直到有一天我们突然意识到：大家口中的“现实状况”，其实早在历史上被无数次复刻过，只是每一代人都把它当成第一次发生。'
            },
        
            sarcasm: {
                label: '冷嘲讽刺',
                icon: '❄️',
                systemPrompt:
                    '你像知乎上那些擅长“用表面客观把人阴死”的答主一样，以全程冷静、数据翔实、口气平缓的方式表达讽刺。文本要给读者一种错觉：你只是很冷静地陈述事实，但事实本身已足够让因为荒诞而发笑；讽刺藏在逻辑里，而不是语气里。',
                styleGuide:
                    '表面客观 → 细节堆叠 → 冷静反讽 → 不动声色地收尾',
                temperature: 0.85,
        
                example:
                    '如果从纯技术视角观察，那套体系当然“堪用”，前提是你愿意把“堪用”的定义设定在一个相当宽松的量级上。以某型装备为例，它在理论上具备覆盖某区域的能力，但理论本身的成立需要假设对手保持静止、不进行干扰、且忽视地理与气象因素的全部影响——换句话说，只要世界像试验场那么乖巧，它就非常可靠。更妙的是，这种“理论可靠”后来还真的被当作战略可靠写进了文件，仿佛只要纸面上成立，现实就会配合一样。于是，我们看到一边是宣传系统高调强调部署的重要意义，另一边是操作人员在系统自检未通过时仍需按流程上报“性能正常”。到了最后，整个体系竟然真的达到了某种稳定状态：没人去问它是否有效，因为只要大家都按照流程演下去，它就是有效的。'
            },
        
            irony: {
                label: '历史反讽',
                icon: '🔄',
                systemPrompt:
                    '你以历史循环、技术更迭与制度惯性的交错叙述为主线，形成一种“新瓶装旧酒”的宿命感。像知乎上那些擅长冷峻历史书写的答主一样：你不直接说“讽刺”，但读者会在事件与事件的回声中意识到——历史的重复往往来自结构，而非个人意愿。',
                styleGuide:
                    '揭示新旧循环 → 学术化论证 → 营造历史压迫感 → 宿命式补刀',
                temperature: 0.75,
        
                example:
                    '有时候你会发现，所谓技术更新带来的“时代跨越”往往只发生在宣传话术里，而在制度结构层面，它更像是旧逻辑换了一层更亮的外壳。比如在某次装备换代中，官方强调新系统具备某种跨区域能力，仿佛从此就进入了全新的战略阶段。然而查阅测试记录你会看到：新装备的作战流程、预案划分、甚至指挥体系的反应链条，与上一代相比几乎没有本质改变，只是把原来无法解决的问题重新命名，让它看起来像是被解决了。更令人无奈的是，这套逻辑在几十年前也发生过——那时的决策者也曾确信“这次我们终于跨入了新时代”，直到下一次危机证明问题从未离开，只是暂时沉入结构缝隙中。因此，当我们再一次听到“跨越式变革”的叙述时，不需要愤怒，也不需要失望；只要稍微回忆一下历史，就能意识到：循环才是唯一的常数。'
            }
        };
        
        
        const AVAILABLE_MODELS = [
            { label: 'OpenAI GPT-4o', value: 'gpt-4o', url: 'https://api.openai.com/v1' },
            { label: 'OpenAI GPT-4 Turbo', value: 'gpt-4-turbo', url: 'https://api.openai.com/v1' },
            { label: 'OpenAI GPT-3.5 Turbo', value: 'gpt-3.5-turbo', url: 'https://api.openai.com/v1' },
            { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022', url: 'https://api.anthropic.com/v1' },
            { label: '智谱 GLM-4.5', value: 'z-ai/glm-4.5', url: 'https://chat.sjtu.plus/v1' },
            { label: '智谱 GLM-4.6', value: 'z-ai/glm-4.6', url: 'https://chat.sjtu.plus/v1' },
            { label: '阿里云 Qwen', value: 'qwen-plus', url: 'https://dashscope.aliyuncs.com/api/v1' },
            { label: '自定义模型', value: 'custom', url: '' },
        ];
        
        const DEFAULT_API_KEY = '';
        const DEFAULT_MODEL = 'gpt-3.5-turbo';
        const DEFAULT_BASE_URL = '';
        const DEFAULT_TONE = 'neutral';
        
            // 导出符号
            exports.TONE_TEMPLATES = TONE_TEMPLATES;
            exports.AVAILABLE_MODELS = AVAILABLE_MODELS;
            exports.DEFAULT_API_KEY = DEFAULT_API_KEY;
            exports.DEFAULT_MODEL = DEFAULT_MODEL;
            exports.DEFAULT_BASE_URL = DEFAULT_BASE_URL;
            exports.DEFAULT_TONE = DEFAULT_TONE;
        
    });

    defineModule('config', (require, exports) => {
        /**
         * 配置管理
         * 处理本地存储和配置状态
         */
        
        
        
        // 初始化时从 localStorage 恢复配置
                const constants = require('constants');
                const AVAILABLE_MODELS = constants.AVAILABLE_MODELS;
                const DEFAULT_API_KEY = constants.DEFAULT_API_KEY;
                const DEFAULT_MODEL = constants.DEFAULT_MODEL;
                const DEFAULT_BASE_URL = constants.DEFAULT_BASE_URL;
                const DEFAULT_TONE = constants.DEFAULT_TONE;
        
        const storedModel = localStorage.getItem('vibe_ai_model') || DEFAULT_MODEL;
        
        const CONFIG = {
            apiKey: localStorage.getItem('vibe_ai_apiKey') || DEFAULT_API_KEY,
            model: storedModel,
            baseUrl: localStorage.getItem('vibe_ai_baseUrl') || DEFAULT_BASE_URL,
            availableModels: AVAILABLE_MODELS,
            toneTemplate: localStorage.getItem('vibe_ai_toneTemplate') || DEFAULT_TONE,
        };
        
        const updateConfig = (key, value) => {
            CONFIG[key] = value;
            localStorage.setItem(`vibe_ai_${key}`, value);
            console.log(`✅ updateConfig: ${key} = ${value}`);
        };
        
        const getModel = () => CONFIG.model;
        const getBaseUrl = () => CONFIG.baseUrl;
        const getApiKey = () => CONFIG.apiKey;
        const getToneTemplate = () => CONFIG.toneTemplate;
        
            // 导出符号
            exports.CONFIG = CONFIG;
            exports.updateConfig = updateConfig;
            exports.getModel = getModel;
            exports.getBaseUrl = getBaseUrl;
            exports.getApiKey = getApiKey;
            exports.getToneTemplate = getToneTemplate;
        
    });

    defineModule('utils', (require, exports) => {
        /**
         * 工具函数
         * 通知、API调用、内容获取等
         */
        
        
        
        /**
         * 显示通知
         */
                const config = require('config');
                const CONFIG = config.CONFIG;
        
        const showNotification = (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `vibe-notification vibe-notification-${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
        
            setTimeout(() => {
                notification.classList.add('vibe-notification-fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        };
        
        /**
         * 获取正在回复的帖子内容
         */
        const getReplyingPostContent = () => {
            try {
                // 方法0: 首先检查编辑框中是否有引用块
                const editor = document.querySelector('.d-editor-input');
                if (editor) {
                    const quoteBlock = editor.querySelector('aside.quote');
                    if (quoteBlock) {
                        const dataUsername = quoteBlock.getAttribute('data-username');
                        const blockquote = quoteBlock.querySelector('blockquote');
        
                        if (dataUsername && blockquote) {
                            let text = blockquote.innerText || blockquote.textContent || '';
                            text = text.trim().substring(0, 1000);
                            if (text) {
                                return {
                                    author: dataUsername,
                                    content: text,
                                    isReply: true,
                                };
                            }
                        }
                    }
                }
        
                // 方法1: 通过composer中的reply-to-tab来查找被回复的帖子
                const composerContainer = document.querySelector('.d-editor-container');
                if (!composerContainer) return null;
        
                let composerParent = composerContainer.closest('.composer-container') ||
                    composerContainer.closest('.reply-area') ||
                    composerContainer.parentElement;
        
                if (!composerParent) return null;
        
                let postElement = composerContainer.closest('.topic-post') ||
                    composerContainer.closest('article');
        
                if (!postElement) {
                    let current = composerContainer;
                    while (current && current !== document.body) {
                        current = current.previousElementSibling || current.parentElement;
                        if (current && current.tagName === 'ARTICLE') {
                            postElement = current;
                            break;
                        }
                    }
                }
        
                if (!postElement) return null;
        
                const replyTab = postElement.querySelector('.reply-to-tab');
                if (replyTab) {
                    const replyUserSpan = replyTab.querySelector('span');
                    let replyingToUser = replyUserSpan ? replyUserSpan.textContent.trim() : '某个用户';
        
                    const currentPostId = postElement.id;
                    if (!currentPostId) return null;
        
                    const currentPostNum = parseInt(currentPostId.replace('post_', ''));
                    const postStream = document.querySelector('.post-stream');
        
                    if (postStream) {
                        const allArticles = postStream.querySelectorAll('article');
        
                        for (let i = allArticles.length - 1; i >= 0; i--) {
                            const article = allArticles[i];
                            const articleId = article.id;
        
                            if (!articleId) continue;
        
                            const articlePostNum = parseInt(articleId.replace('post_', ''));
        
                            if (articlePostNum < currentPostNum) {
                                const authorLink = article.querySelector('[data-user-card]');
                                const authorName = authorLink ? authorLink.textContent.trim() : '';
        
                                if (authorName === replyingToUser) {
                                    const cooked = article.querySelector('.cooked');
                                    if (cooked) {
                                        let text = cooked.innerText || cooked.textContent || '';
                                        text = text.trim().substring(0, 1000);
                                        if (text) {
                                            return {
                                                author: replyingToUser,
                                                content: text,
                                                isReply: true,
                                            };
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
        
                // 方法2: 查找最后一个可见的帖子
                const allPosts = document.querySelectorAll('article[data-post-id]');
                if (allPosts.length > 0) {
                    const lastPost = allPosts[allPosts.length - 1];
        
                    const authorLink = lastPost.querySelector('[data-user-card]');
                    const author = authorLink ? authorLink.textContent.trim() : '某个用户';
        
                    const cooked = lastPost.querySelector('.cooked');
                    if (cooked) {
                        let text = cooked.innerText || cooked.textContent || '';
                        text = text.trim().substring(0, 1000);
                        if (text) {
                            return {
                                author: author,
                                content: text,
                                isReply: false,
                            };
                        }
                    }
                }
        
                return null;
            } catch (error) {
                console.error('获取回复内容失败:', error);
                return null;
            }
        };
        
        /**
         * 获取主题标题和相关信息
         */
        const getTopicContext = () => {
            try {
                const titleElement = document.querySelector('.topic-title, h1');
                const title = titleElement?.textContent?.trim() || '';
                return title;
            } catch (error) {
                return '';
            }
        };
        
        /**
         * 收集所有便利贴内容作为上下文
         */
        const getStickyNotesContext = () => {
            const notes = document.querySelectorAll('.vibe-sticky-note');
            if (notes.length === 0) return null;
        
            const stickyNotes = [];
            notes.forEach(note => {
                const username = note.querySelector('.vibe-sticky-username')?.textContent || '某个用户';
                const content = note.querySelector('.vibe-sticky-content')?.textContent || '';
                if (content.trim()) {
                    stickyNotes.push(`@${username}: "${content.trim()}"`);
                }
            });
        
            if (stickyNotes.length === 0) return null;
        
            return `【讨论参考信息】\n${stickyNotes.join('\n\n')}`;
        };
        
        /**
         * 调用 AI API 生成内容
         */
        const generateContentFromAI = async (prompt, systemPrompt = null, temperature = 0.7) => {
            try {
                console.log('🔄 正在调用 API...');
                console.log('Model:', CONFIG.model);
                console.log('Base URL:', CONFIG.baseUrl);
                console.log('Temperature:', temperature);
                console.log('Prompt length:', prompt.length);
        
                // 验证必要配置
                if (!CONFIG.apiKey) {
                    throw new Error('未配置 API Key，请点击设置按钮进行配置');
                }
        
                if (!CONFIG.baseUrl) {
                    throw new Error('未配置 API Base URL，请点击设置按钮进行配置');
                }
        
                const finalSystemPrompt = systemPrompt || '你是一个论坛讨论的助手，帮助用户生成高质量、有建设性的回复内容。回复应该尊重他人、具体、有价值且有深度。';
        
                const requestBody = {
                    model: CONFIG.model,
                    messages: [
                        {
                            role: 'system',
                            content: finalSystemPrompt,
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: temperature,
                    max_tokens: 1000,
                };
        
                // 处理 base URL，移除末尾的 /chat/completions（如果有的话）
                const cleanBaseUrl = CONFIG.baseUrl.endsWith('/chat/completions')
                    ? CONFIG.baseUrl.slice(0, -'/chat/completions'.length)
                    : CONFIG.baseUrl;
        
                const apiUrl = `${cleanBaseUrl}/chat/completions`;
                console.log('📤 发送请求到:', apiUrl);
        
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.apiKey}`,
                    },
                    body: JSON.stringify(requestBody),
                });
        
                console.log('📍 Response status:', response.status);
                const data = await response.json();
                console.log('📥 API 响应:', JSON.stringify(data).substring(0, 500));
        
                if (!response.ok) {
                    const errorMsg = data.error?.message || data.message || response.statusText;
                    throw new Error(`API 错误 (${response.status}): ${errorMsg}`);
                }
        
                        // 标准格式: OpenAI 兼容的 API
                        let generatedText = data.choices?.[0]?.message?.content;
        
                        // 兼容阿里云千问的响应格式
                        if (!generatedText && data.output?.choices?.[0]?.message?.content) {
                            console.log('✅ 检测到千问 API 响应格式');
                            generatedText = data.output.choices[0].message.content;
                        }
        
                        // 兼容 Z.AI (Zhipu GLM) 的响应格式 - 内容可能在 reasoning 字段
                        if (!generatedText && data.choices?.[0]?.message?.reasoning) {
                            console.log('✅ 检测到 Z.AI 推理模型响应格式');
                            generatedText = data.choices[0].message.reasoning;
                        }
        
                        if (!generatedText) {
                            console.error('❌ 无法从响应中提取文本，响应数据:', data);
                            throw new Error('没有从 AI 获得响应');
                        }        console.log('✅ 生成成功，文本长度:', generatedText.length);
                return generatedText;
            } catch (error) {
                console.error('❌ AI 生成失败:', error);
                showNotification(`❌ ${error.message}`, 'error');
                return null;
            }
        };
        
            // 导出符号
            exports.showNotification = showNotification;
            exports.getReplyingPostContent = getReplyingPostContent;
            exports.getTopicContext = getTopicContext;
            exports.getStickyNotesContext = getStickyNotesContext;
            exports.generateContentFromAI = generateContentFromAI;
        
    });

    defineModule('ui/styles', (require, exports) => {
        /**
         * UI 样式
         */
        
        const addStyles = () => {
            const style = document.createElement('style');
            style.textContent = `
              .vibe-ai-button-wrapper {
                display: inline-flex;
                align-items: center;
                margin-left: 8px;
              }
        
              .vibe-ai-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none !important;
                border-radius: 4px;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 6px;
              }
        
              .vibe-ai-button:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }
        
              .vibe-ai-button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
              }
        
              .vibe-ai-icon {
                font-size: 16px;
              }
        
              .vibe-loading {
                animation: vibe-spin 1s linear infinite;
                display: inline-block;
              }
        
              @keyframes vibe-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
        
              .vibe-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                animation: vibe-slide-in 0.3s ease;
                font-size: 14px;
              }
        
              .vibe-notification-info {
                background-color: #e3f2fd;
                color: #1976d2;
              }
        
              .vibe-notification-success {
                background-color: #e8f5e9;
                color: #388e3c;
              }
        
              .vibe-notification-error {
                background-color: #ffebee;
                color: #d32f2f;
              }
        
              .vibe-notification-fade-out {
                animation: vibe-fade-out 0.3s ease forwards;
              }
        
              @keyframes vibe-slide-in {
                from {
                  transform: translateX(400px);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
        
              @keyframes vibe-fade-out {
                to { opacity: 0; }
              }
        
              /* 设置弹窗 */
              .vibe-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20000;
                animation: vibe-fade-in 0.3s ease;
              }
        
              @keyframes vibe-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
        
              .vibe-settings-modal-content {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                width: 90%;
                animation: vibe-slide-up 0.3s ease;
              }
        
              @keyframes vibe-slide-up {
                from {
                  transform: translateY(20px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
        
              .vibe-settings-header {
                padding: 20px;
                border-bottom: 1px solid #e8e8e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
        
              .vibe-settings-header h2 {
                margin: 0;
                font-size: 18px;
                color: #333;
              }
        
              .vibe-settings-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
        
              .vibe-settings-close:hover {
                color: #333;
              }
        
              .vibe-settings-body {
                padding: 20px;
              }
        
              .vibe-settings-section {
                margin-bottom: 20px;
              }
        
              .vibe-settings-section:last-of-type {
                margin-bottom: 0;
              }
        
              .vibe-settings-label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
                font-size: 14px;
              }
        
              .vibe-settings-model,
              .vibe-settings-url,
              .vibe-settings-api-key {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
                transition: border-color 0.3s ease;
              }
        
              .vibe-settings-model:focus,
              .vibe-settings-url:focus,
              .vibe-settings-api-key:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              }
        
              .vibe-settings-hint {
                margin-top: 8px;
                font-size: 12px;
                color: #999;
              }
        
              .vibe-settings-footer {
                padding: 15px 20px;
                border-top: 1px solid #e8e8e8;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
              }
        
              .vibe-settings-btn-cancel,
              .vibe-settings-btn-save {
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.3s ease;
              }
        
              .vibe-settings-btn-cancel {
                background-color: #f0f0f0;
                color: #333;
              }
        
              .vibe-settings-btn-cancel:hover {
                background-color: #e0e0e0;
              }
        
              .vibe-settings-btn-save {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
        
              .vibe-settings-btn-save:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }
        
              .vibe-settings-btn {
                background-color: #f5f5f5;
                color: #333;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 8px 10px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
              }
        
              .vibe-settings-btn:hover {
                background-color: #e8e8e8;
                border-color: #999;
              }
        
              /* 语气模板弹窗 */
              .vibe-tone-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20000;
                animation: vibe-fade-in 0.3s ease;
              }
        
              .vibe-tone-modal-content {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 90%;
                animation: vibe-slide-up 0.3s ease;
              }
        
              .vibe-tone-header {
                padding: 20px;
                border-bottom: 1px solid #e8e8e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
        
              .vibe-tone-header h2 {
                margin: 0;
                font-size: 18px;
                color: #333;
              }
        
              .vibe-tone-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
        
              .vibe-tone-close:hover {
                color: #333;
              }
        
              .vibe-tone-body {
                padding: 20px;
              }
        
              .vibe-tone-section {
                margin-bottom: 20px;
              }
        
              .vibe-tone-label {
                display: block;
                margin-bottom: 12px;
                font-weight: 600;
                color: #333;
                font-size: 14px;
              }
        
              .vibe-tone-select {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
                transition: border-color 0.3s ease;
              }
        
              .vibe-tone-select:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              }
        
              .vibe-tone-hint {
                margin-top: 8px;
                font-size: 12px;
                color: #999;
              }
        
              .vibe-tone-descriptions {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e8e8e8;
              }
        
              .vibe-tone-desc {
                padding: 12px;
                background-color: #f9f9f9;
                border-left: 3px solid #667eea;
                border-radius: 4px;
                margin-bottom: 12px;
                display: none;
              }
        
              .vibe-tone-desc:last-of-type {
                margin-bottom: 0;
              }
        
              .vibe-tone-desc h4 {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: #333;
              }
        
              .vibe-tone-desc p {
                margin: 0;
                font-size: 13px;
                color: #666;
                line-height: 1.4;
              }
        
              .vibe-tone-footer {
                padding: 15px 20px;
                border-top: 1px solid #e8e8e8;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
              }
        
              .vibe-tone-btn-cancel,
              .vibe-tone-btn-save {
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.3s ease;
              }
        
              .vibe-tone-btn-cancel {
                background-color: #f0f0f0;
                color: #333;
              }
        
              .vibe-tone-btn-cancel:hover {
                background-color: #e0e0e0;
              }
        
              .vibe-tone-btn-save {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
        
              .vibe-tone-btn-save:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }
        
              .vibe-tone-btn {
                background-color: #f5f5f5;
                color: #333;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 8px 10px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
              }
        
              .vibe-tone-btn:hover {
                background-color: #e8e8e8;
                border-color: #999;
              }
        
              /* 便利贴系统 */
              .vibe-sticky-container {
                position: fixed;
                left: 20px;
                top: 100px;
                z-index: 9999;
                pointer-events: none;
              }
        
              .vibe-sticky-note {
                position: fixed;
                left: 20px;
                background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                cursor: move;
                animation: vibe-sticky-appear 0.3s ease;
                pointer-events: auto;
                width: 280px;
                max-width: 90vw;
              }
        
              @keyframes vibe-sticky-appear {
                from {
                  transform: scale(0.8) translateX(-50px);
                  opacity: 0;
                }
                to {
                  transform: scale(1) translateX(0);
                  opacity: 1;
                }
              }
        
              .vibe-sticky-note:hover {
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
              }
        
              .vibe-sticky-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 2px solid rgba(0, 0, 0, 0.1);
                cursor: grab;
                user-select: none;
              }
        
              .vibe-sticky-header:active {
                cursor: grabbing;
              }
        
              .vibe-sticky-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.8);
              }
        
              .vibe-sticky-username {
                font-weight: 600;
                color: #2d3436;
                flex: 1;
                font-size: 14px;
              }
        
              .vibe-sticky-close {
                background: rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 16px;
                color: #2d3436;
                padding: 0;
                flex-shrink: 0;
              }
        
              .vibe-sticky-close:hover {
                background: rgba(0, 0, 0, 0.2);
                transform: rotate(90deg);
              }
        
              .vibe-sticky-content {
                color: #2d3436;
                font-size: 13px;
                line-height: 1.6;
                max-height: 200px;
                overflow-y: auto;
                word-wrap: break-word;
                user-select: text;
              }
        
              .vibe-sticky-content::-webkit-scrollbar {
                width: 6px;
              }
        
              .vibe-sticky-content::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
              }
        
              .vibe-sticky-link {
                transition: all 0.2s ease;
              }
        
              .vibe-sticky-link:hover {
                background: rgba(102, 126, 234, 0.2) !important;
                color: #667eea !important;
                transform: translateX(2px);
              }
        
              .vibe-save-sticky-btn {
                display: inline-flex;
                align-items: center;
                gap: 4px;
              }
        
              .vibe-save-post-sticky {
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
              }
        
              .vibe-save-post-sticky:hover {
                transform: scale(1.15);
                filter: brightness(1.2);
              }
            `;
            document.head.appendChild(style);
        };
        
            // 导出符号
            exports.addStyles = addStyles;
        
    });

    defineModule('ui/modal', (require, exports) => {
        /**
         * UI 模态框组件
         * 设置弹窗、语气选择弹窗
         */
        
        
        
        
        
                const config = require('config');
                const CONFIG = config.CONFIG;
                const updateConfig = config.updateConfig;
                const utils = require('utils');
                const showNotification = utils.showNotification;
                const constants = require('constants');
                const TONE_TEMPLATES = constants.TONE_TEMPLATES;
        
        const showSettingsModal = () => {
            if (document.querySelector('.vibe-settings-modal')) {
                return;
            }
        
            const modal = document.createElement('div');
            modal.className = 'vibe-settings-modal';
        
            const modalContent = document.createElement('div');
            modalContent.className = 'vibe-settings-modal-content';
        
            const modelOptions = CONFIG.availableModels.map(m =>
                `<option value="${m.value}" ${m.value === CONFIG.model ? 'selected' : ''}>${m.label}</option>`
            ).join('');
        
            // 检查当前模型是否是自定义模型（即不在 AVAILABLE_MODELS 中）
            const isCustomModel = !CONFIG.availableModels.some(m => m.value === CONFIG.model);
            const shouldShowCustomInput = CONFIG.model === 'custom' || isCustomModel;
        
            modalContent.innerHTML = `
              <div class="vibe-settings-header">
                <h2>⚙️ AI 模型设置</h2>
                <button class="vibe-settings-close" aria-label="关闭">✕</button>
              </div>
              <div class="vibe-settings-body">
                <div class="vibe-settings-section">
                  <label class="vibe-settings-label">模型选择</label>
                  <select class="vibe-settings-model">
                    ${modelOptions}
                    ${isCustomModel ? `<option value="${CONFIG.model}" selected>${CONFIG.model} (自定义)</option>` : ''}
                  </select>
                  <p class="vibe-settings-hint">选择要使用的 AI 模型</p>
                </div>
        
                <div class="vibe-settings-section vibe-settings-section-custom" style="display: ${shouldShowCustomInput ? 'block' : 'none'}">
                  <label class="vibe-settings-label">自定义模型名称</label>
                  <input
                    type="text"
                    class="vibe-settings-custom-model"
                    value="${isCustomModel ? CONFIG.model : (localStorage.getItem('vibe_ai_custom_model_name') || '')}"
                    placeholder="例如: qwen-plus, qwen-turbo, gpt-4-turbo"
                  />
                  <p class="vibe-settings-hint">输入 API 提供商的模型名称</p>
                </div>
        
                <div class="vibe-settings-section">
                  <label class="vibe-settings-label">API Key</label>
                  <input
                    type="password"
                    class="vibe-settings-api-key"
                    value="${CONFIG.apiKey}"
                    placeholder="输入你的 API Key"
                  />
                  <p class="vibe-settings-hint">用于调用选定的 AI 模型</p>
                </div>
        
                <div class="vibe-settings-section">
                  <label class="vibe-settings-label">API Base URL</label>
                  <input
                    type="text"
                    class="vibe-settings-url"
                    value="${CONFIG.baseUrl}"
                    placeholder="https://api.openai.com/v1"
                  />
                  <p class="vibe-settings-hint">API 服务的基础 URL 地址</p>
                </div>
              </div>
              <div class="vibe-settings-footer">
                <button class="vibe-settings-btn-cancel">取消</button>
                <button class="vibe-settings-btn-save">保存</button>
              </div>
            `;    modal.appendChild(modalContent);
            document.body.appendChild(modal);
        
            const closeModal = () => modal.remove();
            const saveSettings = () => {
                const modelSelect = modal.querySelector('.vibe-settings-model');
                const apiKeyInput = modal.querySelector('.vibe-settings-api-key');
                const urlInput = modal.querySelector('.vibe-settings-url');
                const customModelInput = modal.querySelector('.vibe-settings-custom-model');
        
                let model = modelSelect.value;
                const apiKey = apiKeyInput.value.trim();
                const baseUrl = urlInput.value.trim();
        
                if (!apiKey) {
                    showNotification('❌ API Key 不能为空', 'error');
                    return;
                }
        
                if (!baseUrl) {
                    showNotification('❌ API URL 不能为空', 'error');
                    return;
                }
        
                // 处理自定义模型：如果选择了"自定义模型"，必须从输入框读取值
                if (model === 'custom') {
                    const customModelName = customModelInput.value.trim();
                    if (!customModelName) {
                        showNotification('❌ 自定义模型名称不能为空', 'error');
                        return;
                    }
                    model = customModelName;
                    // 保存自定义模型名称用于后续恢复
                    localStorage.setItem('vibe_ai_custom_model_name', customModelName);
                }
        
                // 调试日志
                console.log('💾 保存配置:', { model, apiKey: apiKey.substring(0, 10) + '***', baseUrl });
        
                updateConfig('model', model);
                updateConfig('apiKey', apiKey);
                updateConfig('baseUrl', baseUrl);
        
                // 验证保存结果
                console.log('✅ 配置已保存到 localStorage:', {
                    'vibe_ai_model': localStorage.getItem('vibe_ai_model'),
                    'vibe_ai_apiKey': localStorage.getItem('vibe_ai_apiKey') ? '已设置' : '未设置',
                    'vibe_ai_baseUrl': localStorage.getItem('vibe_ai_baseUrl'),
                });
        
                showNotification('✅ 设置已保存', 'success');
                closeModal();
            };
        
            modal.querySelector('.vibe-settings-close').addEventListener('click', closeModal);
            modal.querySelector('.vibe-settings-btn-cancel').addEventListener('click', closeModal);
            modal.querySelector('.vibe-settings-btn-save').addEventListener('click', saveSettings);
        
            modal.querySelector('.vibe-settings-url').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveSettings();
            });
        
            const modelSelect = modal.querySelector('.vibe-settings-model');
            const urlInput = modal.querySelector('.vibe-settings-url');
            const customModelSection = modal.querySelector('.vibe-settings-section-custom');
            const customModelInput = modal.querySelector('.vibe-settings-custom-model');
        
            modelSelect.addEventListener('change', (e) => {
                const selectedModel = CONFIG.availableModels.find(m => m.value === e.target.value);
        
                // 显示/隐藏自定义模型输入框
                if (e.target.value === 'custom') {
                    customModelSection.style.display = 'block';
                    // 当选择自定义时，恢复之前保存的模型名称
                    const savedCustomModel = localStorage.getItem('vibe_ai_custom_model_name');
                    if (savedCustomModel) {
                        customModelInput.value = savedCustomModel;
                    }
                } else {
                    customModelSection.style.display = 'none';
                }
        
                // 自动更新 URL
                if (selectedModel && selectedModel.url && !urlInput.value.startsWith('https')) {
                    urlInput.value = selectedModel.url;
                }
            });
        };
        
        const showToneModal = () => {
            if (document.querySelector('.vibe-tone-modal')) {
                return;
            }
        
            const modal = document.createElement('div');
            modal.className = 'vibe-tone-modal';
        
            const modalContent = document.createElement('div');
            modalContent.className = 'vibe-tone-modal-content';
        
            const toneOptions = Object.entries(TONE_TEMPLATES).map(([key, template]) =>
                `<option value="${key}" ${key === CONFIG.toneTemplate ? 'selected' : ''}>${template.icon} ${template.label}</option>`
            ).join('');
        
            modalContent.innerHTML = `
              <div class="vibe-tone-header">
                <h2>📝 语气风格选择</h2>
                <button class="vibe-tone-close" aria-label="关闭">✕</button>
              </div>
              <div class="vibe-tone-body">
                <div class="vibe-tone-section">
                  <label class="vibe-tone-label">选择语气风格</label>
                  <select class="vibe-tone-select">
                    ${toneOptions}
                  </select>
                  <p class="vibe-tone-hint">AI 将根据选定风格生成内容，体现不同的表达特色</p>
                  <div class="vibe-tone-descriptions">
                    ${Object.entries(TONE_TEMPLATES).map(([key, template]) => `
                      <div class="vibe-tone-desc" data-tone="${key}">
                        <h4>${template.icon} ${template.label}</h4>
                        <p>${key === 'neutral' ? '直白、建设性的讨论风格' :
                        key === 'opposition' ? '分项罗列时代画像，学术框架下的冷嘲讽刺' :
                            key === 'agreement' ? '时代画像视角的深层共鸣，冷静而深沉的赞许' :
                                key === 'sarcasm' ? '既新又旧的时代反讽，学术假面下的无奈嘲弄' :
                                    '历史循环中的深度反讽，看破红尘的宿命感'}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
              <div class="vibe-tone-footer">
                <button class="vibe-tone-btn-cancel">取消</button>
                <button class="vibe-tone-btn-save">保存</button>
              </div>
            `;
        
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        
            const closeModal = () => modal.remove();
            const saveTone = () => {
                const select = modal.querySelector('.vibe-tone-select');
                const tone = select.value;
        
                updateConfig('toneTemplate', tone);
                showNotification(`✅ 已选择"${TONE_TEMPLATES[tone].label}"风格`, 'success');
                closeModal();
            };
        
            modal.querySelector('.vibe-tone-close').addEventListener('click', closeModal);
            modal.querySelector('.vibe-tone-btn-cancel').addEventListener('click', closeModal);
            modal.querySelector('.vibe-tone-btn-save').addEventListener('click', saveTone);
        
            modal.querySelector('.vibe-tone-select').addEventListener('change', (e) => {
                const descriptions = modal.querySelectorAll('.vibe-tone-desc');
                descriptions.forEach(desc => {
                    desc.style.display = desc.dataset.tone === e.target.value ? 'block' : 'none';
                });
            });
        
            const initialTone = modal.querySelector('.vibe-tone-select').value;
            modal.querySelectorAll('.vibe-tone-desc').forEach(desc => {
                desc.style.display = desc.dataset.tone === initialTone ? 'block' : 'none';
            });
        };
        
            // 导出符号
            exports.showSettingsModal = showSettingsModal;
            exports.showToneModal = showToneModal;
        
    });

    defineModule('ui/button', (require, exports) => {
        /**
         * UI 按钮组件
         * AI生成、语气选择、设置按钮
         */
        
        
        
        
        
        
        
                const utils = require('utils');
                const showNotification = utils.showNotification;
                const generateContentFromAI = utils.generateContentFromAI;
                const getReplyingPostContent = utils.getReplyingPostContent;
                const getTopicContext = utils.getTopicContext;
                const getStickyNotesContext = utils.getStickyNotesContext;
                const config = require('config');
                const CONFIG = config.CONFIG;
                const constants = require('constants');
                const TONE_TEMPLATES = constants.TONE_TEMPLATES;
                const ui_modal = require('ui/modal');
                const showSettingsModal = ui_modal.showSettingsModal;
                const showToneModal = ui_modal.showToneModal;
        
        const createAIButton = () => {
            const button = document.createElement('button');
            button.className = 'vibe-ai-button btn btn-default';
            button.innerHTML = `<span class="vibe-ai-icon">✨</span> AI 生成`;
            button.setAttribute('type', 'button');
        
            button.addEventListener('click', async (e) => {
                e.preventDefault();
        
                const editor = document.querySelector('.d-editor-input');
                if (!editor) {
                    showNotification('❌ 找不到编辑框', 'error');
                    return;
                }
        
                const topicTitle = getTopicContext() || '论坛讨论';
                const replyingPostData = getReplyingPostContent();
                const currentContent = editor.innerText || editor.textContent || '';
                const stickyNotesContext = getStickyNotesContext();
        
                const toneTemplate = TONE_TEMPLATES[CONFIG.toneTemplate] || TONE_TEMPLATES.neutral;
        
                let prompt = `话题: ${topicTitle}`;
        
                if (replyingPostData) {
                    const marker = replyingPostData.isReply ? '正在回复' : '正在回复主贴';
                    prompt += `\n\n${marker}: @${replyingPostData.author}\n"${replyingPostData.content}"`;
                }
        
                if (stickyNotesContext) {
                    prompt += `\n\n${stickyNotesContext}`;
                }
        
                if (currentContent) {
                    prompt += `\n\n我的想法：${currentContent}`;
                }
        
                prompt += `\n\n要求：一个段落，300-600字`;
        
                if (toneTemplate.styleGuide && toneTemplate.label !== '常规') {
                    prompt += `\n风格提示：${toneTemplate.styleGuide}`;
                }
        
                const originalHTML = button.innerHTML;
                button.disabled = true;
                button.innerHTML = `<span class="vibe-loading">⏳</span> 生成中...`;
        
                try {
                    const generatedContent = await generateContentFromAI(
                        prompt,
                        toneTemplate.systemPrompt,
                        toneTemplate.temperature || 0.7
                    );
        
                    if (generatedContent) {
                        console.log('🎯 开始插入内容到编辑框');
                        console.log('编辑框状态:', {
                            'innerHTML长度': editor.innerHTML.length,
                            '内容类型': editor.children.length > 0 ? '有子元素' : '空或文本',
                        });
        
                        if (generatedContent.includes('<aside class="quote"')) {
                            console.log('📝 插入HTML内容（包括引用块）');
                            editor.innerHTML = '';
        
                            const tempContainer = document.createElement('div');
                            tempContainer.innerHTML = generatedContent;
        
                            Array.from(tempContainer.childNodes).forEach(node => {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    editor.appendChild(node.cloneNode(true));
                                } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                    const p = document.createElement('p');
                                    p.textContent = node.textContent;
                                    editor.appendChild(p);
                                }
                            });
        
                            const lastChild = editor.lastChild;
                            if (!lastChild || lastChild.tagName !== 'P' || lastChild.textContent.trim() !== '') {
                                const emptyP = document.createElement('p');
                                const br = document.createElement('br');
                                br.className = 'ProseMirror-trailingBreak';
                                emptyP.appendChild(br);
                                editor.appendChild(emptyP);
                            }
                        } else {
                            console.log('📝 插入纯文本内容，长度:', generatedContent.length);
                            // 先清空编辑器
                            editor.innerHTML = '';
        
                            // 创建段落元素并插入文本
                            const p = document.createElement('p');
                            p.textContent = generatedContent;
                            editor.appendChild(p);
        
                            // 添加尾部空段落
                            const emptyP = document.createElement('p');
                            const br = document.createElement('br');
                            br.className = 'ProseMirror-trailingBreak';
                            emptyP.appendChild(br);
                            editor.appendChild(emptyP);
        
                            console.log('✨ 编辑框内容更新完成，现有子元素数:', editor.children.length);
                        }
        
                        // 触发多个事件以确保 Discourse 编辑器检测到变化
                        console.log('✨ 触发编辑框事件以通知系统');
                        editor.dispatchEvent(new Event('input', { bubbles: true }));
                        editor.dispatchEvent(new Event('change', { bubbles: true }));
                        editor.dispatchEvent(new Event('keyup', { bubbles: true }));
        
                        // 对于某些 Discourse 版本，需要更新编辑器状态
                        if (window.currentUserGuid && editor.closest?.('.d-editor')) {
                            console.log('💾 触发编辑器保存信号');
                            editor.dispatchEvent(new Event('compositionend', { bubbles: true }));
                        }
        
                        button.innerHTML = `<span>✅</span> 已生成`;
                        button.disabled = false;
                        showNotification('✅ 内容生成成功（点击 AI 生成 按钮可重新生成）', 'success');
        
                        setTimeout(() => {
                            button.innerHTML = originalHTML;
                            button.disabled = false;
                        }, 3000);
                    }
                } catch (error) {
                    button.innerHTML = `<span>❌</span> 失败`;
                    console.error('生成失败:', error);
        
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.disabled = false;
                    }, 2000);
                }
            });
        
            return button;
        };
        
        const createToneButton = () => {
            const button = document.createElement('button');
            button.className = 'vibe-tone-btn btn btn-default';
            button.innerHTML = `📝`;
            button.setAttribute('type', 'button');
            button.title = '选择语气风格';
        
            button.addEventListener('click', (e) => {
                e.preventDefault();
                showToneModal();
            });
        
            return button;
        };
        
        const createSettingsButton = () => {
            const button = document.createElement('button');
            button.className = 'vibe-settings-btn btn btn-default';
            button.innerHTML = '⚙️';
            button.setAttribute('type', 'button');
            button.title = '切换 AI 模型和 API';
        
            button.addEventListener('click', (e) => {
                e.preventDefault();
                showSettingsModal();
            });
        
            return button;
        };
        
        const injectAIButton = () => {
            const toolbar = document.querySelector('.d-editor-button-bar');
            if (!toolbar) {
                return;
            }
        
            if (toolbar.querySelector('.vibe-ai-button')) {
                return;
            }
        
            const container = document.createElement('div');
            container.className = 'vibe-ai-button-wrapper';
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';
            container.style.gap = '4px';
            container.style.marginLeft = '8px';
        
            container.appendChild(createAIButton());
            container.appendChild(createToneButton());
            container.appendChild(createSettingsButton());
        
            toolbar.appendChild(container);
        };
        
            // 导出符号
            exports.createAIButton = createAIButton;
            exports.createToneButton = createToneButton;
            exports.createSettingsButton = createSettingsButton;
            exports.injectAIButton = injectAIButton;
        
    });

    defineModule('sticky-notes', (require, exports) => {
        /**
         * 便利贴系统
         * 支持选中文本保存、用户卡保存、拖拽排序
         */
        
        let draggedNote = null;
        let offsetX = 0;
        let offsetY = 0;
        
        // 显示通知（本地实现，避免循环依赖）
        const showNotification = (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `vibe-notification vibe-notification-${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
        
            setTimeout(() => {
                notification.classList.add('vibe-notification-fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        };
        
        
        const createStickyNote = (container, username, avatar, content, postUrl = null) => {
            const note = document.createElement('div');
            note.className = 'vibe-sticky-note';
        
            let contentHtml = content;
            if (postUrl) {
                contentHtml = `${content}<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1);"><a href="${postUrl}" target="_blank" class="vibe-sticky-link" style="display: inline-block; padding: 6px 12px; background: rgba(102, 126, 234, 0.1); color: #667eea; text-decoration: none; border-radius: 3px; font-size: 12px; font-weight: 600;">🔗 返回帖子</a></div>`;
            }
        
            note.innerHTML = `
                <div class="vibe-sticky-header">
                  <img src="${avatar}" alt="${username}" class="vibe-sticky-avatar" />
                  <span class="vibe-sticky-username">@${username}</span>
                  <button class="vibe-sticky-close" title="删除">✕</button>
                </div>
                <div class="vibe-sticky-content">${contentHtml}</div>
              `;
        
            const closeBtn = note.querySelector('.vibe-sticky-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                note.style.animation = 'vibe-tooltip-appear 0.2s ease reverse';
                setTimeout(() => note.remove(), 200);
            });
        
            const header = note.querySelector('.vibe-sticky-header');
        
            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('vibe-sticky-close')) return;
        
                draggedNote = note;
                const rect = note.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
        
                note.style.opacity = '0.7';
                note.style.cursor = 'grabbing';
        
                const handleMouseMove = (moveEvent) => {
                    if (!draggedNote) return;
        
                    draggedNote.style.position = 'fixed';
                    draggedNote.style.left = `${moveEvent.clientX - offsetX}px`;
                    draggedNote.style.top = `${moveEvent.clientY - offsetY}px`;
                };
        
                const handleMouseUp = () => {
                    if (draggedNote) {
                        draggedNote.style.opacity = '1';
                        draggedNote.style.cursor = 'move';
                        draggedNote = null;
                    }
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };
        
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });
        
            container.appendChild(note);
            return note;
        };
        
        const extractUserCardInfo = () => {
            const userCard = document.querySelector('#user-card');
            if (!userCard) return null;
        
            const usernameEl = userCard.querySelector('.names__secondary.username');
            const username = usernameEl ? usernameEl.textContent.trim() : '某个用户';
        
            const avatarImg = userCard.querySelector('.card-huge-avatar img');
            const avatar = avatarImg ? avatarImg.src : '';
        
            const bioEl = userCard.querySelector('.bio');
            const bio = bioEl ? bioEl.textContent.trim() : '';
        
            const badges = [];
            userCard.querySelectorAll('.user-badge-link .badge-display-name').forEach(badge => {
                badges.push(badge.textContent.trim());
            });
        
            const moreBadges = userCard.querySelector('.more-user-badges');
            if (moreBadges) {
                const moreText = moreBadges.textContent.trim();
                if (moreText) badges.push(moreText);
            }
        
            let info = `【用户 @${username}】`;
            if (bio) {
                info += `\n${bio}`;
            }
            if (badges.length > 0) {
                info += `\n\n徽章: ${badges.join(' / ')}`;
            }
        
            return { username, avatar, info };
        };
        
        const initAvatarDragDrop = (container) => {
            const observer = new MutationObserver(() => {
                const usercardControls = document.querySelector('.usercard-controls');
                if (usercardControls && !usercardControls.querySelector('.vibe-create-user-sticky')) {
                    const li = document.createElement('li');
        
                    const createBtn = document.createElement('button');
                    createBtn.className = 'btn btn-icon-text btn-default vibe-create-user-sticky';
                    createBtn.type = 'button';
                    createBtn.innerHTML = `
                  <svg class="fa d-icon d-icon-bookmark svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#bookmark"></use></svg>
                  <span class="d-button-label">保存用户</span>
                `;
        
                    createBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
        
                        const userInfo = extractUserCardInfo();
                        if (userInfo) {
                            createStickyNote(container, userInfo.username, userInfo.avatar, userInfo.info);
                            showNotification('✅ 用户信息已保存到便利贴', 'success');
                            console.log('📌 用户便利贴已创建:', userInfo);
                        } else {
                            showNotification('❌ 无法提取用户信息', 'error');
                            console.warn('⚠️ 无法提取用户信息');
                        }
                    });
        
                    li.appendChild(createBtn);
                    usercardControls.appendChild(li);
                }
            });
        
            observer.observe(document.body, { childList: true, subtree: true });
        };
        
        const initTextSelectionSave = (container) => {
            const observer = new MutationObserver(() => {
                const toolbar = document.querySelector('[data-identifier="post-text-selection-toolbar"]');
                if (toolbar && !toolbar.querySelector('.vibe-save-sticky-btn')) {
                    const buttonsContainer = toolbar.querySelector('.buttons');
                    if (buttonsContainer) {
                        const saveBtn = document.createElement('button');
                        saveBtn.className = 'btn btn-icon-text btn-flat vibe-save-sticky-btn';
                        saveBtn.title = '保存为便利贴';
                        saveBtn.innerHTML = `
                    <svg class="fa d-icon d-icon-bookmark svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#bookmark"></use></svg>
                    <span class="d-button-label">便利贴</span>
                  `;
        
                        saveBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            const selection = window.getSelection();
                            const selectedText = selection.toString().trim();
        
                            if (!selectedText || selectedText.length < 2) {
                                showNotification('请先选中文本', 'error');
                                return;
                            }
        
                            let targetElement = selection.anchorNode;
                            while (targetElement && targetElement.tagName !== 'ARTICLE') {
                                targetElement = targetElement.parentElement;
                            }
        
                            if (targetElement) {
                                const authorLink = targetElement.querySelector('[data-user-card]');
                                const username = authorLink ? authorLink.textContent.trim() : '某个用户';
        
                                const avatarImg = targetElement.querySelector('.avatar');
                                const avatar = avatarImg ? avatarImg.src : '';
        
                                createStickyNote(container, username, avatar, selectedText);
                                showNotification('✅ 已保存到便利贴', 'success');
                                selection.removeAllRanges();
                            }
                        });
        
                        buttonsContainer.appendChild(saveBtn);
                    }
                }
            });
        
            observer.observe(document.body, { childList: true, subtree: true });
        };
        
        const extractPostInfo = (postElement) => {
            try {
                // 获取作者信息
                const authorLink = postElement.querySelector('[data-user-card]');
                const username = authorLink ? authorLink.textContent.trim() : '某个用户';
        
                // 获取用户头像
                const avatarImg = postElement.querySelector('.avatar');
                const avatar = avatarImg ? avatarImg.src : '';
        
                // 获取帖子标题（在主题列表中）或帖子号
                const topicTitle = document.querySelector('.topic-title, h1');
                const title = topicTitle ? topicTitle.textContent.trim() : '论坛帖子';
        
                // 获取帖子链接
                const postId = postElement.id ? postElement.id.replace('post_', '') : '';
                const currentUrl = window.location.href;
                const baseUrl = currentUrl.split('#')[0];
                const postUrl = postId ? `${baseUrl}#post_${postId}` : currentUrl;
        
                return { username, avatar, title, postUrl, postId };
            } catch (error) {
                console.error('提取帖子信息失败:', error);
                return null;
            }
        };
        
        const initPostSaveButton = (container) => {
            const observer = new MutationObserver(() => {
                // 查找所有未处理的帖子操作区域
                const posts = document.querySelectorAll('article[data-post-id]');
                posts.forEach(post => {
                    const postControls = post.querySelector('.post-controls .actions');
                    if (postControls && !postControls.querySelector('.vibe-save-post-sticky')) {
                        // 找到书签按钮或举报按钮，与它们放在同一行
                        const bookmarkBtn = postControls.querySelector('.post-action-menu__bookmark');
                        const flagBtn = postControls.querySelector('.post-action-menu__flag');
        
                        let insertTarget = bookmarkBtn || flagBtn;
        
                        if (insertTarget) {
                            // 创建新按钮 - 使用便签图标
                            const savePostBtn = document.createElement('button');
                            savePostBtn.className = 'btn no-text btn-icon vibe-save-post-sticky btn-flat';
                            savePostBtn.title = '保存帖子到便利贴';
                            savePostBtn.type = 'button';
                            savePostBtn.innerHTML = `
                                <span style="font-size: 18px;">📌</span>
                                <span aria-hidden="true">​</span>
                            `;
        
                            savePostBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
        
                                const postInfo = extractPostInfo(post);
                                if (postInfo) {
                                    // 构建便利贴内容：显示帖子标题
                                    const content = `【帖子标题】\n${postInfo.title}\n\n【作者】\n@${postInfo.username}`;
                                    createStickyNote(container, postInfo.username, postInfo.avatar, content, postInfo.postUrl);
                                    showNotification('✅ 帖子已保存到便利贴', 'success');
                                    console.log('📌 帖子便利贴已创建:', postInfo);
                                } else {
                                    showNotification('❌ 无法提取帖子信息', 'error');
                                    console.warn('⚠️ 无法提取帖子信息');
                                }
                            });
        
                            // 在书签或举报按钮后面插入新按钮
                            insertTarget.insertAdjacentElement('afterend', savePostBtn);
                        }
                    }
                });
            });
        
            observer.observe(document.body, { childList: true, subtree: true });
        };
        
        const initStickyNotes = () => {
            const container = document.createElement('div');
            container.className = 'vibe-sticky-container';
            document.body.appendChild(container);
        
            initAvatarDragDrop(container);
            initTextSelectionSave(container);
            initPostSaveButton(container);
        };
        
            // 导出符号
            exports.initStickyNotes = initStickyNotes;
        
    });

    defineModule('index', (require, exports) => {
        /**
         * Vibe 水源 - AI 内容生成增强
         * 主入口文件
         */
        
        
        
        
        
        
        
        
        // 防止重复加载
                const config = require('config');
                const CONFIG = config.CONFIG;
                const updateConfig = config.updateConfig;
                const ui_styles = require('ui/styles');
                const addStyles = ui_styles.addStyles;
                const ui_button = require('ui/button');
                const injectAIButton = ui_button.injectAIButton;
                const sticky_notes = require('sticky-notes');
                const initStickyNotes = sticky_notes.initStickyNotes;
                const utils = require('utils');
                const showNotification = utils.showNotification;
                const generateContentFromAI = utils.generateContentFromAI;
                const ui_modal = require('ui/modal');
                const showSettingsModal = ui_modal.showSettingsModal;
        
        if (window.vibeAILoaded) {
            console.log('Vibe 水源已加载');
        } else {
            window.vibeAILoaded = true;
        
            const setupMutationObserver = () => {
                const observer = new MutationObserver(() => {
                    const editor = document.querySelector('.d-editor-input');
                    if (editor && !document.querySelector('.vibe-ai-button')) {
                        injectAIButton();
                    }
                });
        
                observer.observe(document.documentElement, {
                    subtree: true,
                    childList: true,
                });
            };
        
            const init = () => {
                console.log('🚀 Vibe 水源已启动');
        
                addStyles();
                initStickyNotes();
                setupMutationObserver();
        
                const hasApiKey = !!CONFIG.apiKey;
                const hasBaseUrl = !!CONFIG.baseUrl;
        
                if (!hasApiKey || !hasBaseUrl) {
                    console.warn('⚠️ Vibe 水源需要配置 API Key 和 Base URL');
                    showNotification('⚙️ 需要配置 AI 模型，请点击设置按钮进行配置', 'info');
                }
        
                window.vibeAI = {
                    config: CONFIG,
                    generateContentFromAI,
                    showNotification,
                    showSettingsModal,
                    setModel: (model) => {
                        const modelObj = CONFIG.availableModels.find(m => m.value === model);
                        if (!modelObj) {
                            showNotification(`❌ 不支持的模型: ${model}`, 'error');
                            return;
                        }
                        updateConfig('model', model);
                        showNotification(`✅ 已切换到 ${modelObj.label}`, 'success');
                    },
                    setBaseUrl: (url) => {
                        updateConfig('baseUrl', url);
                        showNotification(`✅ API URL 已更新`, 'success');
                    },
                    getModel: () => CONFIG.model,
                    getBaseUrl: () => CONFIG.baseUrl,
                };
        
                console.log('✅ API 已配置，模型: ' + CONFIG.model);
                console.log('💡 点击 ⚙️ 按钮切换模型或 API，或在控制台调用 vibeAI.setModel() / vibeAI.setBaseUrl()');
            };
        
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        }
        
    });

    // ==================== 启动 ====================
    window.vibeAIInit = function() {
        try {
            const indexModule = require('index');
        } catch (error) {
            console.error('❌ Vibe 水源初始化失败:', error);
        }
    };

    // 初始化
    const init = window.vibeAIInit;
    if (init && typeof init === 'function') {
        init();
    }
})();
