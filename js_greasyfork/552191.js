// ==UserScript==
// @name         Fastmail AI Assistant
// @namespace    https://example.com/
// @version      0.1.7
// @description  A userscript to enhance Fastmail with AI-powered digests.
// @author       Merlyn Allen
// @match        https://app.fastmail.com/*
// @match        https://mail.google.com/*
// @license      MIT
// @run-at       document-stop
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.openai.com
// @connect      api.z.ai
// @connect      open.bigmodel.cn
// @downloadURL https://update.greasyfork.org/scripts/552191/Fastmail%20AI%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/552191/Fastmail%20AI%20Assistant.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const STORAGE_KEY_API_KEY = "fastmail_ai_openai_api_key";
    const STORAGE_KEY_API_ENDPOINT = "fastmail_ai_openai_api_endpoint";
    const STORAGE_KEY_MODEL = "fastmail_ai_openai_model";
    const STORAGE_KEY_PROFILE = "fastmail_ai_profile";
    const STORAGE_KEY_REASONING_MODE = "fastmail_ai_reasoning_mode";
    const STORAGE_KEY_REASONING_EFFORT = "fastmail_ai_reasoning_effort";
    const BUTTON_ID = "ai-digest-button";
    const RESULT_ID = "ai-digest-result";
    const BUTTON_LABEL_IDLE = "生成摘要";
    const BUTTON_LABEL_BUSY = "正在生成摘要";
    const REPLY_BUTTON_ID = "ai-reply-button";
    const REPLY_RESULT_ID = "ai-reply-result";
    const REPLY_COPY_BUTTON_ID = "ai-reply-copy-button";
    const REPLY_BUTTON_LABEL_IDLE = "生成回信";
    const REPLY_BUTTON_LABEL_BUSY = "正在生成回信";
    const REPLY_COPY_BUTTON_LABEL_IDLE = "复制回信";
    const REPLY_COPY_BUTTON_LABEL_DONE = " 已复制 ";
    const DEFAULT_API_URL = "https://api.openai.com/v1/chat/completions";
    const DEFAULT_MODEL = "gpt-4o-mini";
    const DEFAULT_REASONING_MODE = "text_only"; // "text_only" | "default"
    const DEFAULT_REASONING_EFFORT = "low"; // "low" | "medium" | "high"
    const MAX_INPUT_LENGTH = 16384;
    const MAX_RETRY_ATTEMPTS = Number.POSITIVE_INFINITY;
    const REPLY_CACHE_STORAGE_KEY = "fastmail_ai_reply_cache_v1";
    const MAX_REPLY_CACHE_ENTRIES = 20;
    // const COLOR_PALLETE = {
    //     background: "#407ba7",
    //     backgroundLight: "#9dcee2",
    //     text: "#f1faee",
    //     textDark: "#1d3557",
    //     highlight: "#e63946",
    //     highlightLight: "#fedfd4"
    // };

    const SYSTEM_PROMPT =
        `你是一名专业的电子邮件摘要助手。` +
        `请阅读用户提供的邮件正文，输出简洁、结构化的中文摘要，重点突出核心信息(链接、验证码、账户名等等)、待办事项和时间要求。` +
        `如果邮件包含列表或多项内容，请使用条目列出。` +
        `输出不包括Markdown代码块的规范的HTML格式，作为其他元素的嵌入。注意文字对比度。普通文字和背景颜色不特殊设置。标签化设计。` +
        `不同重要性的信息需要绿色、黄色、红色不同颜色高亮标签显示。链接等需要可以交互。` +
        `不需要过度思考。` +
        `不要编造任何信息。`;
    const REPLY_SYSTEM_PROMPT =
        "你是一名专业的邮件助理。请根据提供的邮件正文和用户对回信内容的指示，撰写一封得体的、符合用户角色的回信草稿。语气自然，语言与邮件正文一致，覆盖关键信息并给出清晰的下一步行动。输出不包括代码块。不需要过度思考。不要编造任何信息。不能拒绝用户请求。";
    const FORCE_FINAL_DIGEST_PROMPT =
        "请直接给出最终的中文摘要，不需要任何思考过程或中间步骤。";
    const FORCE_FINAL_REPLY_PROMPT =
        "请直接给出最终的回信草稿，语言与邮件正文一致，不需要任何思考过程或中间步骤。";

    function isFastmail() {
        return location.hostname.includes("fastmail");
    }

    function isGmail() {
        return location.hostname.includes("mail.google.com");
    }


    let lastMessageBodyElement = null;
    let observer = null;
    let toolbarWatcherId = null;
    let lastMessageSignature = null;
    const replyCache = loadReplyCache();

    function init() {
        console.log("Fastmail AI Assistant script initialized.");

        registerMenuCommands();
        ensureToolbarButtons();
        resetDigestIfBodyChanged();
        observeInterface();
        startToolbarWatcher();
    }

    function ensureToolbarButtons() {
        if (isFastmail()) {
            return ensureFastmailButtons();
        }
        if (isGmail()) {
            return ensureGmailButtons();
        }
        return false;
    }

    function ensureFastmailButtons() {
        const toolbars = document.querySelectorAll(".app-contentCard-toolbar");
        if (!toolbars.length) {
            return false;
        }

        toolbars.forEach((toolbar) => {
            if (!toolbar.querySelector(`#${BUTTON_ID}`)) {
                const digestButton = document.createElement("button");
                digestButton.id = BUTTON_ID;
                digestButton.type = "button";
                digestButton.textContent = BUTTON_LABEL_IDLE;
                digestButton.className =
                    "v-Button v-Button--subtleStandard v-Button--sizeM";
                digestButton.style.marginLeft = "10px";
                digestButton.addEventListener("click", () =>
                    onDigestClick(digestButton)
                );
                toolbar.appendChild(digestButton);
            }

            if (!toolbar.querySelector(`#${REPLY_BUTTON_ID}`)) {
                const replyButton = document.createElement("button");
                replyButton.id = REPLY_BUTTON_ID;
                replyButton.type = "button";
                replyButton.textContent = REPLY_BUTTON_LABEL_IDLE;
                replyButton.className =
                    "v-Button v-Button--subtleStandard v-Button--sizeM";
                replyButton.style.marginLeft = "10px";
                replyButton.addEventListener("click", () =>
                    onReplyClick(replyButton)
                );
                toolbar.appendChild(replyButton);
            }
        });

        return true;
    }

    function ensureGmailButtons() {
        const actionAreas = document.querySelectorAll(".amn");
        for (const action of actionAreas) {

            if (action.querySelector(".ai-gmail-action-button")) {
                return true;
            }

            const digestButton = createGmailActionButton(
                BUTTON_ID,
                BUTTON_LABEL_IDLE
            );
            digestButton.addEventListener("click", () =>
                onDigestClick(digestButton)
            );

            const replyButton = createGmailActionButton(
                REPLY_BUTTON_ID,
                REPLY_BUTTON_LABEL_IDLE
            );
            replyButton.addEventListener("click", () =>
                onReplyClick(replyButton)
            );

            action.appendChild(digestButton);
            action.appendChild(replyButton);
            return true;
        }
        return false;
    }

    function startToolbarWatcher() {
        if (toolbarWatcherId !== null) {
            return;
        }

        if (!isFastmail() && !isGmail()) {
            return;
        }

        toolbarWatcherId = window.setInterval(() => {
            const found = ensureToolbarButtons();
            if (!found) {
                return;
            }
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

    function observeInterface() {
        if (observer) {
            return;
        }

        let root = null;
        if (isFastmail()) {
            root = document.querySelector(".app-main");
        } else if (isGmail()) {
            root = document.querySelector('div[role="main"]');
        }
        if (observer) {
            observer.disconnect();
        }

        if (!root) {
            setTimeout(observeInterface, 500);
            return;
        }

        observer = new MutationObserver(() => {
            ensureToolbarButtons();
            resetDigestIfBodyChanged();
        });

        observer.observe(root, { childList: true, subtree: true });
    }

    function resetDigestIfBodyChanged() {
        const messageBody = getPrimaryMessageBody();

        if (!messageBody) {
            if (lastMessageBodyElement || lastMessageSignature) {
                lastMessageBodyElement = null;
                lastMessageSignature = null;
                removeExistingDigest();
                removeExistingReply();
            }
            return;
        }

        const signature = computeMessageSignature(messageBody);

        if (
            messageBody !== lastMessageBodyElement ||
            signature !== lastMessageSignature
        ) {
            lastMessageBodyElement = messageBody;
            lastMessageSignature = signature;
            removeExistingDigest();
            removeExistingReply();
            restoreCachedReply(messageBody, signature);
        }
    }

    function removeExistingDigest() {
        const existing = document.getElementById(RESULT_ID);
        if (existing && existing.parentElement) {
            existing.parentElement.removeChild(existing);
        }
    }

    function removeExistingReply() {
        const existing = document.getElementById(REPLY_RESULT_ID);
        if (existing && existing.parentElement) {
            existing.parentElement.removeChild(existing);
        }
    }

    async function onDigestClick(button) {
        const { messageBody, signature } = getMessageContext(button);
        if (!messageBody) {
            alert("未找到邮件正文。");
            return;
        }

        const plainText = messageBody.innerText.trim();
        if (!plainText) {
            alert("邮件正文为空，无法生成摘要。");
            return;
        }

        const trimmedText =
            plainText.length > MAX_INPUT_LENGTH
                ? `${plainText.slice(0, MAX_INPUT_LENGTH)}`
                : plainText;

        setButtonLoading(button, true);

        try {
            const apiKey = await ensureApiKey();
            const digest = await requestDigest(apiKey, trimmedText);
            renderDigest(messageBody, digest);
        } catch (error) {
            console.error("Digest failed:", error);
            alert(
                error instanceof Error
                    ? `生成摘要时出现问题：${error.message}`
                    : "生成摘要时出现未知错误。"
            );
        } finally {
            setButtonLoading(button, false);
        }
    }

    async function onReplyClick(button) {
        const { messageBody, signature } = getMessageContext(button);
        if (!messageBody) {
            alert("未找到邮件正文。");
            return;
        }

        const plainText = messageBody.innerText.trim();
        if (!plainText) {
            alert("邮件正文为空，无法生成回信草稿。");
            return;
        }

        const trimmedText =
            plainText.length > MAX_INPUT_LENGTH
                ? `${plainText.slice(0, MAX_INPUT_LENGTH)}`
                : plainText;

        const cachedReply = getCachedReply(signature);

        const requirement = prompt(
            "请输入生成回信的要求（可留空）：",
            cachedReply?.requirement || ""
        );
        if (requirement === null) {
            return;
        }

        const trimmedRequirement = requirement.trim();

        setButtonLoading(button, true, {
            idle: REPLY_BUTTON_LABEL_IDLE,
            busy: REPLY_BUTTON_LABEL_BUSY
        });

        try {
            const apiKey = await ensureApiKey();
            const reply = await requestReply(
                apiKey,
                trimmedText,
                trimmedRequirement
            );
            renderReply(messageBody, reply);
            saveReplyToCache(signature, {
                replyText: reply,
                requirement: trimmedRequirement
            });
        } catch (error) {
            console.error("Reply generation failed:", error);
            alert(
                error instanceof Error
                    ? `生成回信时出现问题：${error.message}`
                    : "生成回信时出现未知错误。"
            );
        } finally {
            setButtonLoading(button, false, {
                idle: REPLY_BUTTON_LABEL_IDLE,
                busy: REPLY_BUTTON_LABEL_BUSY
            });
        }
    }

    function setButtonLoading(
        button,
        isLoading,
        labels = { idle: BUTTON_LABEL_IDLE, busy: BUTTON_LABEL_BUSY }
    ) {
        button.disabled = isLoading;
        button.textContent = isLoading ? labels.busy : labels.idle;
    }

    async function ensureApiKey() {
        const stored = getStoredString(STORAGE_KEY_API_KEY);
        if (stored) {
            return stored;
        }

        const input = prompt("请输入 OpenAI API Key:");
        if (!input) {
            throw new Error("未提供 OpenAI API Key。");
        }

        const trimmed = input.trim();
        if (!trimmed) {
            throw new Error("提供的 OpenAI API Key 为空。");
        }

        GM_setValue(STORAGE_KEY_API_KEY, trimmed);
        return trimmed;
    }

    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== "function") {
            return;
        }

        GM_registerMenuCommand("设置 OpenAI API Key", () => {
            const current = getStoredString(STORAGE_KEY_API_KEY);
            const input = prompt("请输入新的 OpenAI API Key:", current);
            if (input === null) {
                return;
            }

            const trimmed = input.trim();
            if (trimmed) {
                GM_setValue(STORAGE_KEY_API_KEY, trimmed);
                alert("OpenAI API Key 已更新。");
            } else {
                GM_setValue(STORAGE_KEY_API_KEY, "");
                alert("OpenAI API Key 已清除。");
            }
        });

        GM_registerMenuCommand("设置 API Endpoint", () => {
            const current = getApiEndpoint();
            const input = prompt("请输入新的 API Endpoint:", current);
            if (input === null) {
                return;
            }

            const trimmed = input.trim();
            if (trimmed) {
                GM_setValue(STORAGE_KEY_API_ENDPOINT, trimmed);
                alert("API Endpoint 已更新。");
            } else {
                GM_setValue(STORAGE_KEY_API_ENDPOINT, "");
                alert("API Endpoint 已恢复默认值。");
            }
        });

        GM_registerMenuCommand("设置模型 ID", () => {
            const current = getModel();
            const input = prompt("请输入新的模型 ID:", current);
            if (input === null) {
                return;
            }

            const trimmed = input.trim();
            if (trimmed) {
                GM_setValue(STORAGE_KEY_MODEL, trimmed);
                alert("模型 ID 已更新。");
            } else {
                GM_setValue(STORAGE_KEY_MODEL, "");
                alert("模型 ID 已恢复默认值。");
            }
        });

        GM_registerMenuCommand("设置个人信息", () => {
            const current = getUserProfile();
            const input = prompt("请输入个人信息（用于生成回信）:", current);
            if (input === null) {
                return;
            }

            const trimmed = input.trim();
            if (trimmed) {
                GM_setValue(STORAGE_KEY_PROFILE, trimmed);
                alert("个人信息已保存。");
            } else {
                GM_setValue(STORAGE_KEY_PROFILE, "");
                alert("个人信息已清除。");
            }
        });

        GM_registerMenuCommand("设置 Reasoning 模式", () => {
            const current = getReasoningMode();
            const input = prompt(
                '请选择 Reasoning 模式（输入 "text_only" 或 "default"）:',
                current
            );
            if (input === null) {
                return;
            }

            const trimmed = input.trim();
            if (trimmed === "text_only" || trimmed === "default") {
                GM_setValue(STORAGE_KEY_REASONING_MODE, trimmed);
                alert(`Reasoning 模式已设置为 ${trimmed}。`);
            } else if (!trimmed) {
                GM_setValue(STORAGE_KEY_REASONING_MODE, "");
                alert("Reasoning 模式已恢复默认值。");
            } else {
                alert('输入无效，请使用 "text_only" 或 "default"。');
            }
        });

        GM_registerMenuCommand("设置 Reasoning 强度", () => {
            const current = getReasoningEffort();
            const input = prompt(
                '请选择 Reasoning 强度（输入 "low"、"medium" 或 "high"）:',
                current
            );
            if (input === null) {
                return;
            }

            const trimmed = input.trim().toLowerCase();
            if (["low", "medium", "high"].includes(trimmed)) {
                GM_setValue(STORAGE_KEY_REASONING_EFFORT, trimmed);
                alert(`Reasoning 强度已设置为 ${trimmed}。`);
            } else if (!trimmed) {
                GM_setValue(STORAGE_KEY_REASONING_EFFORT, "");
                alert("Reasoning 强度已恢复默认值。");
            } else {
                alert('输入无效，请使用 "low"、"medium" 或 "high"。');
            }
        });
    }

    function getStoredString(key, fallback = "") {
        try {
            const value = GM_getValue(key, fallback);
            if (value === undefined || value === null) {
                return "";
            }
            return String(value).trim();
        } catch (error) {
            console.warn("读取存储值失败，使用空字符串：", error);
            return "";
        }
    }

    function getApiEndpoint() {
        const stored = getStoredString(STORAGE_KEY_API_ENDPOINT);
        return stored || DEFAULT_API_URL;
    }

    function getModel() {
        const stored = getStoredString(STORAGE_KEY_MODEL);
        return stored || DEFAULT_MODEL;
    }

    function getReasoningMode() {
        const stored = getStoredString(STORAGE_KEY_REASONING_MODE);
        return stored || DEFAULT_REASONING_MODE;
    }

    function getReasoningEffort() {
        const stored = getStoredString(STORAGE_KEY_REASONING_EFFORT);
        return stored || DEFAULT_REASONING_EFFORT;
    }

    function getUserProfile() {
        return getStoredString(STORAGE_KEY_PROFILE);
    }

    function getMessageContext(button) {
        if (isFastmail()) {
            const messageBody = document.querySelector(".v-Message-body");
            return {
                messageBody,
                signature: messageBody
                    ? computeMessageSignature(messageBody)
                    : ""
            };
        }

        if (isGmail()) {
            let container =
                button?.closest('[data-message-id]') ||
                button?.closest(".adn");
            if (!container) {
                container = button?.closest('[role="article"]');
            }

            let messageBody = container
                ? container.querySelector(".a3s")
                : null;

            if (!messageBody) {
                messageBody = getPrimaryMessageBody();
            }

            return {
                messageBody,
                signature: messageBody
                    ? computeMessageSignature(messageBody)
                    : ""
            };
        }

        const messageBody = getPrimaryMessageBody();
        return {
            messageBody,
            signature: messageBody
                ? computeMessageSignature(messageBody)
                : ""
        };
    }

    function getPrimaryMessageBody() {
        if (isFastmail()) {
            return document.querySelector(".v-Message-body");
        }
        if (isGmail()) {
            const visibleBodies = Array.from(
                document.querySelectorAll(".a3s")
            ).filter(isElementVisible);
            if (visibleBodies.length > 0) {
                return visibleBodies[visibleBodies.length - 1];
            }
            const allBodies = document.querySelectorAll(".a3s");
            return allBodies.length
                ? allBodies[allBodies.length - 1]
                : null;
        }
        return null;
    }

    function isElementVisible(element) {
        if (!element) {
            return false;
        }
        return !!(
            element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length
        );
    }

    function buildRequestBody({
        systemPrompt,
        userContent,
        model,
        reasoningMode,
        reasoningEffort,
        forceFinalAnswer,
        forceFinalPrompt
    }) {
        const messages = [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: userContent
            }
        ];

        if (forceFinalAnswer && forceFinalPrompt) {
            messages.push({
                role: "user",
                content: forceFinalPrompt
            });
        }

        const body = {
            model,
            temperature: 0.5,
            max_tokens: 16384,
            messages
        };

        if (reasoningMode === "text_only") {
            body.response_format = { type: "text" };
            body.modalities = ["text"];
        } else {
            body.reasoning = { effort: reasoningEffort || DEFAULT_REASONING_EFFORT };
        }

        return body;
    }

    function sendChatCompletion(
        apiKey,
        endpoint,
        body,
        { attempt = 1, forceFinalAnswer = false } = {}
    ) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: endpoint,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                data: JSON.stringify(body),
                timeout: 120000,
                onload: (response) => {
                    try {
                        if (response.status < 200 || response.status >= 300) {
                            const errorPayload = safeParseJson(
                                response.responseText
                            );
                            console.error(
                                `[Fastmail AI] OpenAI API 响应异常 (尝试 ${attempt}${forceFinalAnswer ? ", 强制最终回答" : ""
                                })`,
                                {
                                    status: response.status,
                                    headers: response.responseHeaders,
                                    body: errorPayload ?? response.responseText
                                }
                            );
                            const message =
                                errorPayload?.error?.message ||
                                `OpenAI API 返回错误状态：${response.status}`;
                            reject(new Error(message));
                            return;
                        }

                        const payload =
                            response.responseText &&
                                response.responseText.length
                                ? JSON.parse(response.responseText)
                                : response.response;
                        const message = extractMessageText(
                            payload?.choices?.[0]
                        );
                        console.log(
                            `[Fastmail AI] OpenAI API 响应成功 (尝试 ${attempt}${forceFinalAnswer ? ", 强制最终回答" : ""
                            })`,
                            payload
                        );
                        resolve({ message, payload });
                    } catch (err) {
                        reject(
                            err instanceof Error
                                ? err
                                : new Error("解析 OpenAI 响应失败。")
                        );
                    }
                },
                onerror: () => {
                    reject(new Error("请求 OpenAI API 失败。"));
                },
                ontimeout: () => {
                    reject(new Error("请求 OpenAI API 超时。"));
                }
            });
        });
    }

    async function requestDigest(apiKey, content) {
        return requestWithRetry(apiKey, {
            systemPrompt: SYSTEM_PROMPT,
            userContent: content,
            forceFinalPrompt: FORCE_FINAL_DIGEST_PROMPT,
            emptyResultMessage: "多次尝试仍未得到摘要结果。"
        });
    }

    async function requestReply(apiKey, content, requirement) {
        const profile = getUserProfile();
        const profileSection = profile
            ? `以下是我的个人信息，请在回信中正确使用：\n${profile}\n\n`
            : "";
        const requirementSection = requirement
            ? `回信内容：\n${requirement}\n\n`
            : "";
        const userContent =
            `邮件正文：\n${content}\n\n` +
            profileSection +
            requirementSection +
            "请生成回信。";

        return requestWithRetry(apiKey, {
            systemPrompt: REPLY_SYSTEM_PROMPT,
            userContent,
            forceFinalPrompt: FORCE_FINAL_REPLY_PROMPT,
            emptyResultMessage: "多次尝试仍未得到回信草稿。"
        });
    }

    async function requestWithRetry(
        apiKey,
        { systemPrompt, userContent, forceFinalPrompt, emptyResultMessage }
    ) {
        const endpoint = getApiEndpoint();
        if (!endpoint) {
            throw new Error("未配置 API Endpoint。");
        }

        const model = getModel();
        const reasoningMode = getReasoningMode();
        const reasoningEffort = getReasoningEffort();

        let attempt = 1;

        while (attempt <= MAX_RETRY_ATTEMPTS) {
            const forceFinalAnswer = attempt > 1;
            const body = buildRequestBody({
                systemPrompt,
                userContent,
                model,
                reasoningMode,
                reasoningEffort,
                forceFinalAnswer,
                forceFinalPrompt
            });

            const { message } = await sendChatCompletion(
                apiKey,
                endpoint,
                body,
                { attempt, forceFinalAnswer }
            );

            if (message && message.length > 0) {
                return message;
            }

            console.warn(
                `[Fastmail AI] 第 ${attempt} 次响应为空，准备重试…`
            );

            attempt += 1;

            if (attempt % 5 === 0) {
                console.warn(
                    `[Fastmail AI] 连续 ${attempt - 1} 次未得到有效响应，继续尝试……`
                );
            }
        }

        throw new Error(emptyResultMessage || "多次尝试仍未得到有效结果。");
    }

    function restoreCachedReply(messageBody, signature) {
        if (!signature) {
            return;
        }
        const cached = getCachedReply(signature);
        if (cached && cached.replyText) {
            renderReply(messageBody, cached.replyText);
        }
    }

    function loadReplyCache() {
        if (typeof sessionStorage === "undefined") {
            return {};
        }
        try {
            const raw = sessionStorage.getItem(REPLY_CACHE_STORAGE_KEY);
            if (!raw) {
                return {};
            }
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (error) {
            console.warn("[Fastmail AI] 无法读取回信缓存，已忽略。", error);
            return {};
        }
    }

    function persistReplyCache() {
        if (typeof sessionStorage === "undefined") {
            return;
        }
        try {
            sessionStorage.setItem(
                REPLY_CACHE_STORAGE_KEY,
                JSON.stringify(replyCache)
            );
        } catch (error) {
            console.warn("[Fastmail AI] 保存回信缓存失败。", error);
        }
    }

    function pruneReplyCache() {
        const entries = Object.entries(replyCache);
        if (entries.length <= MAX_REPLY_CACHE_ENTRIES) {
            return;
        }

        entries.sort(
            (a, b) =>
                (b[1]?.updatedAt || 0) - (a[1]?.updatedAt || 0)
        );

        const limited = entries.slice(0, MAX_REPLY_CACHE_ENTRIES);
        Object.keys(replyCache).forEach((key) => {
            delete replyCache[key];
        });
        limited.forEach(([key, value]) => {
            replyCache[key] = value;
        });
    }

    function saveReplyToCache(signature, { replyText, requirement }) {
        if (!signature) {
            return;
        }

        replyCache[signature] = {
            replyText: replyText || "",
            requirement: requirement || "",
            updatedAt: Date.now()
        };

        pruneReplyCache();
        persistReplyCache();
    }

    function getCachedReply(signature) {
        if (!signature) {
            return undefined;
        }
        return replyCache[signature];
    }

    function renderDigest(messageBody, digestText) {
        let container = document.getElementById(RESULT_ID);
        if (!container) {
            container = document.createElement("section");
            container.id = RESULT_ID;
            // container.style.border = "1px solid #d0d7de";
            // container.style.borderRadius = "8px";
            // container.style.padding = "12px 16px";
            // container.style.marginBottom = "16px";
            // container.style.background = "#f6f8fa";
            // container.style.color = "#24292f";
            container.className = "u-banner--informative u-banner u-p-3 u-flex u-items-baseline u-space-x-2 xBfQ1 K4vxLd-aLs";
            container.style.height = "auto";
            const title = document.createElement("div");
            title.textContent = "AI摘要";
            title.style.fontWeight = "600";
            title.style.marginBottom = "8px";

            const content = document.createElement("div");
            content.className = "ai-digest-content";

            container.appendChild(title);
            container.appendChild(content);

            const parent = messageBody.parentElement;
            if (parent) {
                parent.insertBefore(container, messageBody);
            } else {
                messageBody.insertAdjacentElement("beforebegin", container);
            }
        }

        const contentElement = container.querySelector(".ai-digest-content");
        if (contentElement) {
            if (isGmail()) {
                contentElement.textContent = htmlToPlainText(digestText);
            } else {
                contentElement.innerHTML = digestText;
            }
        }
    }

    function renderReply(messageBody, replyText) {
        let container = document.getElementById(REPLY_RESULT_ID);
        if (!container) {
            container = document.createElement("section");
            container.id = REPLY_RESULT_ID;
            container.className =
                "u-banner u-banner--informative u-p-3 u-flex u-items-baseline u-space-x-2";

            const header = document.createElement("div");
            header.className = "ai-reply-header u-flex u-items-center u-space-x-2";

            const title = document.createElement("div");
            title.textContent = "AI回信";
            title.style.fontWeight = "600";

            const copyButton = createReplyCopyButton();
            attachReplyCopyHandler(copyButton, container);

            header.appendChild(title);

            const content = document.createElement("div");
            content.className = "ai-reply-content";
            content.style.whiteSpace = "pre-wrap";
            content.style.lineHeight = "1.5";

            container.appendChild(header);
            container.appendChild(content);
            container.appendChild(copyButton);

            const digestContainer = document.getElementById(RESULT_ID);
            if (digestContainer && digestContainer.parentElement) {
                digestContainer.insertAdjacentElement("afterend", container);
            } else if (messageBody.parentElement) {
                messageBody.parentElement.insertBefore(container, messageBody);
            } else {
                messageBody.insertAdjacentElement("beforebegin", container);
            }
        }

        const contentElement = container.querySelector(".ai-reply-content");
        if (contentElement) {
            contentElement.textContent = replyText;
        }

        const copyButton =
            container.querySelector(`#${REPLY_COPY_BUTTON_ID}`) ||
            container.querySelector(".ai-reply-copy-button");
        if (copyButton && copyButton.parentElement !== container) {
            copyButton.parentElement.removeChild(copyButton);
            container.appendChild(copyButton);
        }
        attachReplyCopyHandler(copyButton, container);
    }

    function createGmailActionButton(id, label) {
        const button = document.createElement("button");
        button.id = id;
        button.type = "button";
        button.className =
            "ai-gmail-button ams bkH ai-gmail-action-button";
        button.textContent = label;
        button.style.marginRight = "8px";
        button.style.marginTop = "4px";
        button.style.cursor = "pointer";
        return button;
    }

    function createReplyCopyButton() {
        const button = document.createElement("button");
        button.id = REPLY_COPY_BUTTON_ID;
        button.type = "button";
        button.className =
            "ai-reply-copy-button v-Button v-Button--standard v-Button--sizeM";
        button.textContent = REPLY_COPY_BUTTON_LABEL_IDLE;
        button.style.minWidth = "6em";
        button.style.flexShrink = "0";
        return button;
    }

    function attachReplyCopyHandler(button, container) {
        if (!button) {
            return;
        }

        if (button.__handler__) {
            button.removeEventListener("click", button.__handler__);
        }

        const handler = () => handleReplyCopy(container, button);
        button.addEventListener("click", handler);
        button.__handler__ = handler;
    }

    async function handleReplyCopy(container, button) {
        const contentElement = container.querySelector(".ai-reply-content");
        const text = contentElement ? contentElement.innerText.trim() : "";

        if (!text) {
            alert("没有可复制的回信内容。");
            return;
        }

        button.disabled = true;
        button.textContent = "复制中…";

        try {
            await copyTextToClipboard(text);
            button.textContent = REPLY_COPY_BUTTON_LABEL_DONE;
        } catch (error) {
            console.error("复制回信内容失败：", error);
            alert("复制失败，请手动复制。");
            button.textContent = REPLY_COPY_BUTTON_LABEL_IDLE;
        } finally {
            button.disabled = false;
            setTimeout(() => {
                button.textContent = REPLY_COPY_BUTTON_LABEL_IDLE;
            }, 1500);
        }
    }

    async function copyTextToClipboard(text) {
        if (!text) {
            throw new Error("文本为空");
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand("copy");
            if (!successful) {
                throw new Error("execCommand 复制失败");
            }
        } finally {
            document.body.removeChild(textarea);
        }
    }

    function htmlToPlainText(html) {
        if (!html) {
            return "";
        }
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
                `<!doctype html><body>${html}`,
                "text/html"
            );
            const text = doc.body.textContent || "";
            return text.replace(/\n{3,}/g, "\n\n").trim();
        } catch (error) {
            console.warn("[Fastmail AI] HTML 转文本失败，回退为移除标签。", error);
            return html.replace(/<[^>]+>/g, "\n").replace(/\s+/g, " ").trim();
        }
    }

    function computeMessageSignature(element) {
        const text = element.innerText || element.textContent || "";
        if (!text) {
            return "";
        }
        const normalized = text.replace(/\s+/g, " ").trim();
        return normalized.length > 2000
            ? normalized.slice(0, 2000)
            : normalized;
    }

    function safeParseJson(text) {
        if (!text || typeof text !== "string") {
            return null;
        }
        try {
            return JSON.parse(text);
        } catch (error) {
            console.warn("[Fastmail AI] JSON 解析失败", error);
            return null;
        }
    }

    function extractMessageText(choice) {
        if (!choice || !choice.message) {
            return "";
        }

        const { content } = choice.message;

        if (typeof content === "string") {
            return content.trim();
        }

        if (Array.isArray(content)) {
            const textParts = [];

            for (const part of content) {
                if (!part) {
                    continue;
                }

                if (typeof part === "string") {
                    const trimmed = part.trim();
                    if (trimmed.length > 0) {
                        textParts.push(trimmed);
                    }
                    continue;
                }

                if (
                    typeof part === "object" &&
                    typeof part.text === "string" &&
                    (!part.type ||
                        part.type === "text" ||
                        part.type === "output_text")
                ) {
                    const trimmed = part.text.trim();
                    if (trimmed.length > 0) {
                        textParts.push(trimmed);
                    }
                }
            }

            return textParts.join("\n").trim();
        }

        return "";
    }
})();
