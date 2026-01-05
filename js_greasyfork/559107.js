// ==UserScript==
// @name         CSDN 自动AI神评助手 (全配置版)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  增加前端配置能力 -> 支持自定义系统提示词(Prompt) -> 自定义接口和模型 -> 气泡提示 -> 深度清洗 DeepSeek 思考标签
// @author       Gemini Assistant
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/article/details/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559107/CSDN%20%E8%87%AA%E5%8A%A8AI%E7%A5%9E%E8%AF%84%E5%8A%A9%E6%89%8B%20%28%E5%85%A8%E9%85%8D%E7%BD%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559107/CSDN%20%E8%87%AA%E5%8A%A8AI%E7%A5%9E%E8%AF%84%E5%8A%A9%E6%89%8B%20%28%E5%85%A8%E9%85%8D%E7%BD%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 🔧 配置区域 (动态获取) =================
    // 默认配置，如果用户未设置过，则使用这些值
    const DEFAULT_CONFIG = {
        aiApiUrl: "http://127.0.0.1:11434/api/generate",
        aiModel: "deepseek-r1:1.5b",
        // 默认提示词
        aiSystemPrompt: "你是一个技术博主。请阅读下文，写一句100字以内的专业评论，要对作者带有鼓励性质，要写出自己的真实评论，不要让人看着像ai生成的评论，评论风格要幽默风趣，不要呆板。直接输出内容：",
        submitUrl: "https://blog.csdn.net/phoenix/web/v1/comment/submit",
        aiTimeout: 60000,
        startDelay: 3000
    };

    // 获取当前配置 (优先读取本地存储)
    function getConfig() {
        return {
            aiApiUrl: GM_getValue('ai_api_url', DEFAULT_CONFIG.aiApiUrl),
            aiModel: GM_getValue('ai_model', DEFAULT_CONFIG.aiModel),
            // 新增：读取存储中的提示词
            aiSystemPrompt: GM_getValue('ai_system_prompt', DEFAULT_CONFIG.aiSystemPrompt),
            submitUrl: DEFAULT_CONFIG.submitUrl,
            aiTimeout: DEFAULT_CONFIG.aiTimeout,
            startDelay: DEFAULT_CONFIG.startDelay
        };
    }

    // ================= ⚙️ 菜单配置功能 (核心升级) =================

    function registerMenu() {
        // 1. 设置接口地址
        GM_registerMenuCommand("⚙️ 设置 AI 接口地址", () => {
            const current = GM_getValue('ai_api_url', DEFAULT_CONFIG.aiApiUrl);
            const input = window.prompt("请输入 AI 服务端接口地址 (例如 Ollama):", current);
            if (input !== null) {
                if (input.trim().startsWith('http')) {
                    GM_setValue('ai_api_url', input.trim());
                    showToast('✅ 接口地址已保存', 'success');
                } else {
                    showToast('❌ 地址格式错误，需以 http 开头', 'error');
                }
            }
        });

        // 2. 设置模型名称
        GM_registerMenuCommand("🤖 设置 AI 模型名称", () => {
            const current = GM_getValue('ai_model', DEFAULT_CONFIG.aiModel);
            const input = window.prompt("请输入模型名称 (例如 deepseek-r1:7b):", current);
            if (input !== null && input.trim() !== "") {
                GM_setValue('ai_model', input.trim());
                showToast(`✅ 模型已切换为: ${input}`, 'success');
            }
        });

        // 3. 设置系统提示词 (新增)
        GM_registerMenuCommand("📝 设置 AI 提示词 (Prompt)", () => {
            const current = GM_getValue('ai_system_prompt', DEFAULT_CONFIG.aiSystemPrompt);
            // 注意：window.prompt 输入框较小，适合简短修改。如果需要大幅修改，建议复制出来改好再粘贴进去。
            const input = window.prompt("请输入 AI 系统提示词 (决定评论风格):", current);
            if (input !== null && input.trim() !== "") {
                GM_setValue('ai_system_prompt', input.trim());
                showToast('✅ 提示词已更新，下次评论生效', 'success');
            }
        });

        // 4. 重置配置
        GM_registerMenuCommand("🔄 重置所有配置", () => {
            if(confirm("确定要重置所有 AI 配置（接口、模型、提示词）为默认值吗？")) {
                GM_setValue('ai_api_url', DEFAULT_CONFIG.aiApiUrl);
                GM_setValue('ai_model', DEFAULT_CONFIG.aiModel);
                GM_setValue('ai_system_prompt', DEFAULT_CONFIG.aiSystemPrompt);
                showToast('已重置为默认配置', 'info');
            }
        });
    }

    // 注册菜单
    registerMenu();


    // ================= 🎨 UI 交互函数 =================

    /**
     * 显示气泡提示 (Toast)
     */
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.innerText = message;

        Object.assign(toast.style, {
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%) translateY(-20px)',
            zIndex: '999999',
            padding: '12px 24px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '500',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: '0',
            transition: 'all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            pointerEvents: 'none'
        });

        if (type === 'success') {
            toast.style.backgroundColor = '#2ecc71';
            toast.style.borderLeft = '5px solid #27ae60';
        } else if (type === 'error') {
            toast.style.backgroundColor = '#e74c3c';
            toast.style.borderLeft = '5px solid #c0392b';
        } else {
            toast.style.backgroundColor = '#3498db';
            toast.style.borderLeft = '5px solid #2980b9';
        }

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if(document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 1000);
        }, duration);
    }

    // ================= 🛠️ 逻辑工具函数 =================

    function getArticleId() {
        const match = location.pathname.match(/\/details\/(\d+)/);
        return match ? match[1] : null;
    }

    function checkLoginStatus() {
        return document.cookie.length > 0;
    }

    function extractContent() {
        const box = document.querySelector('.blog-content-box');
        if (box) {
            box.style.border = "5px solid #2ecc71";
            return box.innerText.substring(0, 1000).replace(/\s+/g, ' ');
        }
        return null;
    }

    // 4. 请求 AI (使用动态配置)
    function getAIResponse(articleText) {
        const config = getConfig(); // 获取最新配置 (含最新的提示词)

        return new Promise((resolve, reject) => {
            showToast(`🧠 正在思考 (${config.aiModel})...`, 'info', 5000);
            console.log(`🧠 [AI] 正在思考... \n接口: ${config.aiApiUrl} \n模型: ${config.aiModel} \nPrompt: ${config.aiSystemPrompt.substring(0,20)}...`);

            GM_xmlhttpRequest({
                method: "POST",
                url: config.aiApiUrl,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    "model": config.aiModel,
                    // 使用配置中的 System Prompt
                    "prompt": `${config.aiSystemPrompt}\n\n【文章片段】\n${articleText}`,
                    "stream": false
                }),
                timeout: config.aiTimeout,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            let reply = data.response;

                            // 清洗 DeepSeek 的 <think> 标签
                            reply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                            reply = reply.replace(/[\r\n"]/g, '');

                            console.log("🤖 [AI] 生成完毕:", reply);
                            resolve(reply);
                        } catch (e) { reject("AI解析失败"); }
                    } else {
                        reject("AI状态码: " + response.status);
                    }
                },
                ontimeout: () => reject("⏳ AI 生成超时"),
                onerror: (err) => reject("AI 网络连接失败")
            });
        });
    }

    function submitToCSDN(articleId, text) {
        const config = getConfig();
        console.log(`📤 [发送] 目标ID: ${articleId} | 内容: ${text}`);

        GM_xmlhttpRequest({
            method: "POST",
            url: config.submitUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://blog.csdn.net",
                "Referer": location.href,
                "Cookie": document.cookie
            },
            data: `commentId=&content=${encodeURIComponent(text)}&articleId=${articleId}`,
            onload: (res) => {
                try {
                    const json = JSON.parse(res.responseText);
                    if (json.code === 200) {
                        console.log("✅ [成功] 评论已发布");
                        const box = document.querySelector('.blog-content-box');
                        if(box) box.style.border = "5px solid gold";
                        showToast(`🎉 评论成功：${text.substring(0, 15)}...`, 'success');
                    } else {
                        console.error("❌ CSDN 返回错误:", json);
                        showToast(`❌ 发送失败 (${json.code}): ${json.message}`, 'error');
                    }
                } catch(e) {
                    console.error("❌ 响应解析失败:", res.responseText);
                    showToast("❌ 响应解析失败", 'error');
                }
            }
        });
    }

    // ================= 🚀 主程序 =================
    async function main() {
        if (!checkLoginStatus()) return;

        // 延迟执行
        const config = getConfig();
        await new Promise(r => setTimeout(r, config.startDelay));

        const articleId = getArticleId();
        const content = extractContent();

        if (!articleId || !content) {
            console.log("❌ 未找到文章内容或ID");
            return;
        }

        try {
            const reply = await getAIResponse(content);
            if (reply) {
                setTimeout(() => {
                    submitToCSDN(articleId, reply);
                }, 1500);
            }
        } catch (error) {
            console.error("❌ 流程中断:", error);
            showToast(`⚠️ ${error}`, 'error');
        }
    }

    main();

})();