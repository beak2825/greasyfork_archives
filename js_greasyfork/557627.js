// ==UserScript==
// @name         AI Studio Chat Compressor
// @namespace    https://lxchx.github.io/aistudio-compressor
// @version      0.2
// @description  在 Google AI Studio 提供一键压缩聊天记录、注入快照、监控 GenerateContent 请求的工具，方便长对话续写与历史迁移 | Provides a one-click tool in Google AI Studio to compress chat history, inject snapshots, and monitor GenerateContent requests, facilitating long conversation continuation and history migration
// @author       lxchx
// @match        https://aistudio.google.com/prompts/*
// @match        https://aistudio.google.com/prompts/new_chat
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557627/AI%20Studio%20Chat%20Compressor.user.js
// @updateURL https://update.greasyfork.org/scripts/557627/AI%20Studio%20Chat%20Compressor.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ---------------------------
    // Constants & environment
    // ---------------------------

    const Config = {
        TAGS: {
            UI: "[Compressor UI]",
            NET: "[Compressor Monitor]"
        },
        TARGETS: {
            GENERATE: "/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/GenerateContent",
            RESOLVE: "/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/ResolveDriveResource",
            LIST_PROMPTS: "/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/ListPrompts",
            CREATE_PROMPT: "/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService/CreatePrompt"
        },
        EVENTS: {
            REQUEST: "aistudio-compressor:generatecontent-request",
            RESPONSE: "aistudio-compressor:generatecontent-response"
        },
        UI: {
            BUTTON_ID: "compressor-button-hybrid",
            TOOLBAR_SELECTOR: "ms-toolbar .toolbar-right",
            TARGET_PATH: "/prompts/",
            INPUT_SELECTORS: [
                "ms-autosize-textarea textarea",
                'textarea[aria-label="Start typing a prompt"]',
                "textarea"
            ],
            SEND_BUTTON_SELECTORS: [
                "ms-run-button button.run-button",
                'button[aria-label="Run"]',
                'button[type="submit"]'
            ]
        },
        SETTINGS: {
            PAGE_URL: "https://lxchx.github.io/aistudio-compressor"
        },
        TIMING: {
            BRANCH_MENU_TIMEOUT: 5000,
            PROMPT_CHANGE_TIMEOUT: 15000
        },
        PROMPTS: {
            FULL: `That concludes the above topic. Please remember the chat history and switch roles:
            
  You are the component that summarizes internal chat history into a given structure.

  When the conversation history grows too large, you will be invoked to distill the entire history into a concise, structured
  XML snapshot. This snapshot is CRITICAL, as it will become the agent's *only* memory of the past. The agent will resume its
  work based solely on this snapshot. All crucial details, plans, errors, and user directives MUST be preserved.

  First, you will think through the entire history in a private <scratchpad>. Review the user's overall goal, the agent's
  actions, tool outputs, file modifications, and any unresolved questions. Identify every piece of information that is essential
  for future actions.

  After your reasoning is complete, generate the final <state_snapshot> XML object. Be incredibly dense with information. Omit
  any irrelevant conversational filler.

  The structure MUST be as follows:

  <state_snapshot>
      <overall_goal>
          <!-- A single, concise sentence describing the user's high-level objective. -->
          <!-- Example: "Refactor the authentication service to use a new JWT library." -->
      </overall_goal>

      <key_knowledge>
          <!-- Crucial facts, conventions, and constraints the agent must remember based on the conversation history and
  interaction with the user. Use bullet points. -->
          <!-- Example:
           - Build Command: \`npm run build\`
           - Testing: Tests are run with \`npm test\`. Test files must end in \`.test.ts\`.
           - API Endpoint: The primary API endpoint is \`https://api.example.com/v2\`.

          -->
      </key_knowledge>

      <file_system_state>
          <!-- List files that have been created, read, modified, or deleted. Note their status and critical learnings. -->
          <!-- Example:
           - CWD: \`/home/user/project/src\`
           - READ: \`package.json\` - Confirmed 'axios' is a dependency.
           - MODIFIED: \`services/auth.ts\` - Replaced 'jsonwebtoken' with 'jose'.
           - CREATED: \`tests/new-feature.test.ts\` - Initial test structure for the new feature.
          -->
      </file_system_state>

      <recent_actions>
          <!-- A summary of the last few significant agent actions and their outcomes. Focus on facts. -->
          <!-- Example:
           - Ran \`grep 'old_function'\` which returned 3 results in 2 files.
           - Ran \`npm run test\`, which failed due to a snapshot mismatch in \`UserProfile.test.ts\`.
           - Ran \`ls -F static/\` and discovered image assets are stored as \`.webp\`.
          -->
      </recent_actions>

      <current_plan>
          <!-- The agent's step-by-step plan. Mark completed steps. -->
          <!-- Example:
           1. [DONE] Identify all files using the deprecated 'UserAPI'.
           2. [IN PROGRESS] Refactor \`src/components/UserProfile.tsx\` to use the new 'ProfileAPI'.
           3. [TODO] Refactor the remaining files.
           4. [TODO] Update tests to reflect the API change.
          -->
      </current_plan>
  </state_snapshot>`,
            SNIPPET: "You are the component that summarizes internal chat history"
        }
    };

    const env = {
        isMac: /Mac|iPhone|iPad/.test(navigator.platform),
        isAppContext: location.pathname.startsWith("/app/"),
        topWindow: unsafeWindow?.top || window
    };
    const settingsOrigin = getSettingsOrigin();

    const state = {
        compressionInProgress: false,
        compressionRequestPending: false,
        compressionResponsePending: false,
        lastPromptHistory: null,
        lastPromptHistoryUpdatedAt: 0,
        pendingInjectedHistory: null,
        historyCapturePending: false,
        branchInProgress: false,
        activeCompressionPrompt: "",
        activeCompressionSnippet: Config.PROMPTS.SNIPPET
    };

    const log = {
        ui: (...args) => console.log(Config.TAGS.UI, ...args),
        net: (...args) => console.log(Config.TAGS.NET, ...args)
    };

    const STORAGE_KEY = "__aistudio_compressor_settings_v1";
    const DEFAULT_SETTINGS = {
        compressPrompt: Config.PROMPTS.FULL,
        snapshotRegex: "",
        tailPercent: 30,
        tailMinChars: 2000
    };
    let userSettings = loadUserSettings();
    refreshActivePromptFromSettings();

    function loadUserSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return { ...DEFAULT_SETTINGS };
            }
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
                return { ...DEFAULT_SETTINGS, ...parsed };
            }
            return { ...DEFAULT_SETTINGS };
        } catch (err) {
            console.warn(Config.TAGS.NET, "Failed to load compressor settings", err);
            return { ...DEFAULT_SETTINGS };
        }
    }

    function persistUserSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userSettings));
        } catch (err) {
            console.warn(Config.TAGS.NET, "Failed to store compressor settings", err);
        }
    }

    function updateUserSettings(partial) {
        userSettings = { ...userSettings, ...partial };
        persistUserSettings();
    }

    function getCompressPrompt() {
        return userSettings?.compressPrompt || Config.PROMPTS.FULL;
    }

    function getSnapshotRegex() {
        return (userSettings?.snapshotRegex || "").trim();
    }

    function getTailRetentionConfig() {
        const percent = Number(userSettings?.tailPercent);
        const minChars = Number(userSettings?.tailMinChars);
        const normalizedPercent = Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 100) : DEFAULT_SETTINGS.tailPercent;
        const normalizedMinChars = Number.isFinite(minChars) && minChars > 0 ? Math.floor(minChars) : DEFAULT_SETTINGS.tailMinChars;
        return { percent: normalizedPercent, minChars: normalizedMinChars };
    }

    function deriveSnippet(prompt) {
        const text = (prompt || "").trim();
        if (!text) {
            return Config.PROMPTS.SNIPPET;
        }
        return text.slice(0, 120);
    }

    function refreshActivePromptFromSettings() {
        state.activeCompressionPrompt = getCompressPrompt();
        state.activeCompressionSnippet = deriveSnippet(state.activeCompressionPrompt);
    }

    function getSettingsOrigin() {
        const url = Config.SETTINGS?.PAGE_URL;
        if (!url) return null;
        try {
            return new URL(url, location.href).origin;
        } catch {
            return null;
        }
    }

    function getSettingsSnapshot() {
        return {
            compressPrompt: userSettings?.compressPrompt || Config.PROMPTS.FULL,
            snapshotRegex: userSettings?.snapshotRegex || "",
            tailPercent: Number.isFinite(userSettings?.tailPercent) ? userSettings.tailPercent : DEFAULT_SETTINGS.tailPercent,
            tailMinChars: Number.isFinite(userSettings?.tailMinChars) ? userSettings.tailMinChars : DEFAULT_SETTINGS.tailMinChars
        };
    }

    function normalizeSettingsPayload(payload) {
        if (!payload || typeof payload !== "object") {
            return { ...DEFAULT_SETTINGS };
        }
        const next = { ...DEFAULT_SETTINGS };
        if (typeof payload.compressPrompt === "string") {
            const trimmed = payload.compressPrompt.trim();
            next.compressPrompt = trimmed || Config.PROMPTS.FULL;
        }
        if (typeof payload.snapshotRegex === "string") {
            next.snapshotRegex = payload.snapshotRegex.trim();
        }
        if (payload.tailPercent != null) {
            const parsedPercent = Number(payload.tailPercent);
            if (Number.isFinite(parsedPercent)) {
                next.tailPercent = Math.min(Math.max(parsedPercent, 0), 100);
            }
        }
        if (payload.tailMinChars != null) {
            const parsedMinChars = Number(payload.tailMinChars);
            if (Number.isFinite(parsedMinChars) && parsedMinChars >= 0) {
                next.tailMinChars = Math.floor(parsedMinChars);
            }
        }
        return next;
    }

    function scheduleSettingsHydration(win) {
        if (!win) return;
        const targetOrigin = settingsOrigin || "*";
        const message = {
            source: "aistudio-compressor",
            type: "hydrate",
            payload: getSettingsSnapshot()
        };
        let attempts = 0;
        const maxAttempts = 10;
        let timer = null;

        const dispatch = () => {
            if (!win || win.closed) {
                clearInterval(timer);
                return;
            }
            attempts += 1;
            try {
                win.postMessage(message, targetOrigin);
                log.ui("Sent settings hydration message", { attempts });
            } catch (err) {
                log.ui("Failed to send settings hydration message", err);
            }
            if (attempts >= maxAttempts) {
                clearInterval(timer);
            }
        };

        dispatch();
        timer = setInterval(dispatch, 1200);
    }

    function installSettingsMessageBridge() {
        window.addEventListener("message", handleSettingsMessage);
    }

    function handleSettingsMessage(event) {
        if (!event || !event.data) return;
        if (settingsOrigin && event.origin !== settingsOrigin) {
            return;
        }
        const data = event.data;
        if (data?.source !== "aistudio-compressor") {
            return;
        }
        if (data.type === "update-settings" && data.payload) {
            const normalized = normalizeSettingsPayload(data.payload);
            updateUserSettings(normalized);
            if (!state.compressionInProgress) {
                refreshActivePromptFromSettings();
            }
            log.ui("Settings updated via external page");
        }
    }

    function openSettingsWindow() {
        const targetUrl = Config.SETTINGS?.PAGE_URL;
        if (!targetUrl) {
            alert("未配置外部设置页面 URL，请更新脚本以启用设置界面。");
            return;
        }
        const win = window.open(targetUrl, "aistudio_compressor_settings", "width=720,height=720,resizable=yes,scrollbars=yes");
        if (!win || win.closed) {
            alert("无法打开设置窗口，请允许弹窗或在目标标签页手动执行脚本设置。");
            return;
        }
        scheduleSettingsHydration(win);
    }

    function resetSettingsToDefault() {
        if (!confirm("确认恢复 Compressed Prompt 及相关设置为默认值？")) {
            return;
        }
        userSettings = { ...DEFAULT_SETTINGS };
        persistUserSettings();
        if (!state.compressionInProgress) {
            refreshActivePromptFromSettings();
        }
        alert("已恢复默认设置。");
    }

    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== "function") {
            return;
        }
        GM_registerMenuCommand("打开 Compressor 设置...", openSettingsWindow);
        GM_registerMenuCommand("重置 Compressor 设置", resetSettingsToDefault);
    }

    // ---------------------------
    // Event bridge & handlers
    // ---------------------------

    function installTopLevelHandlers() {
        if (!env.topWindow.__aistudio_compressor_handlers_installed) {
            env.topWindow.addEventListener(Config.EVENTS.REQUEST, Compression.handleRequestEvent);
            env.topWindow.addEventListener(Config.EVENTS.RESPONSE, Compression.handleResponseEvent);
            env.topWindow.__aistudio_compressor_handlers_installed = true;
        }

        if (!env.topWindow.__aistudio_compressor_request_logger) {
            env.topWindow.addEventListener(Config.EVENTS.REQUEST, event => {
                const detail = event?.detail || {};
                log.net("GenerateContent request detail:", {
                    url: detail.url,
                    headers: detail.headers,
                    bodyText: detail.bodyText
                });
            });
            env.topWindow.__aistudio_compressor_request_logger = true;
        }
    }

    function emitNetworkEvent(name, detail) {
        try {
            env.topWindow.dispatchEvent(new CustomEvent(name, { detail }));
        } catch (err) {
            log.net("Failed to dispatch network event", name, err);
        }
    }

    // ---------------------------
    // Network monitor module
    // ---------------------------

    const NetworkMonitor = {
        init() {
            const label = env.isAppContext ? "app-window" : "top-window";
            hookContext(window, label);

            window.addEventListener("DOMContentLoaded", () => {
                hookContext(window, `${label} DOMContentLoaded`);
                hookChildFrames("DOMContentLoaded");
            });

            window.addEventListener("load", () => {
                hookContext(window, `${label} load`);
                hookChildFrames("load");
            });

            setInterval(() => hookChildFrames("poll"), 2000);
        }
    };

    function hookChildFrames(reason) {
        if (!document?.querySelectorAll) return;
        for (const frame of document.querySelectorAll("iframe")) {
            const ctx = frame.contentWindow;
            if (!ctx || !canAccessWindow(ctx)) continue;
            try {
                hookContext(ctx, `iframe ${frame.src || frame.name || "unnamed"} via ${reason}`);
            } catch (err) {
                log.net("cannot hook iframe:", err);
            }
        }
    }

    function hookContext(ctx, label) {
        if (!canAccessWindow(ctx)) {
            log.net(`skip hooking for ${label}: cross-origin window`);
            return;
        }
        installFetchHook(ctx, label);
        installXHRHook(ctx, label);
    }

    function canAccessWindow(ctx) {
        try {
            return ctx && ctx.location && ctx.location.origin === location.origin;
        } catch {
            return false;
        }
    }

    function installFetchHook(ctx, label) {
        if (!ctx || typeof ctx.fetch !== "function") {
            log.net(`skip hooking for ${label}: fetch not available`);
            return;
        }
        if (ctx.__aistudio_compressor_fetch_hooked) return;

        const originalFetch = ctx.fetch.bind(ctx);

        ctx.fetch = async function interceptFetch(input, init = {}) {
            let request = input instanceof Request ? input : new Request(input, init);
            const rewritten = await maybeRewriteCreatePromptRequest(request);
            if (rewritten) {
                request = rewritten;
                init = undefined;
            }

            const injectedResponse = maybeServeInjectedResponse(request.url);
            if (injectedResponse) {
                return injectedResponse;
            }

            const shouldIntercept = isTargetRequest(request.url, "GENERATE");

            if (shouldIntercept) {
                await logRequestPayload(request);
            }

            const response = await originalFetch(request, cloneInit(init));

            if (shouldIntercept) {
                await logResponsePayload(request.url, response.clone());
            }

            return response;
        };

        ctx.__aistudio_compressor_fetch_hooked = true;
        log.net(`fetch hooked in ${label}`);

        if (ctx !== unsafeWindow && typeof unsafeWindow.fetch === "function" && !unsafeWindow.__aistudio_compressor_fetch_hooked) {
            unsafeWindow.fetch = ctx.fetch;
            unsafeWindow.__aistudio_compressor_fetch_hooked = true;
            log.net("fetch mirrored to unsafeWindow");
        }
    }

    async function logRequestPayload(request) {
        try {
            const clonedRequest = request.clone();
            const bodyText = await clonedRequest.text();
            console.groupCollapsed(`${Config.TAGS.NET} request -> ${clonedRequest.url}`);
            console.log("Headers:", Object.fromEntries(clonedRequest.headers.entries()));
            try {
                console.log("Parsed payload:", JSON.parse(bodyText));
            } catch {
                console.log("Raw payload:", bodyText);
            }
            console.groupEnd();
            emitNetworkEvent(Config.EVENTS.REQUEST, {
                url: clonedRequest.url,
                headers: Object.fromEntries(clonedRequest.headers.entries()),
                bodyText
            });
        } catch (err) {
            console.warn(Config.TAGS.NET, "Failed to read request body:", err);
        }
    }

    async function logResponsePayload(url, response) {
        try {
            const bodyText = await response.text();
            console.groupCollapsed(`${Config.TAGS.NET} response <- ${url}`);
            console.log("Status:", response.status, response.statusText);
            try {
                console.log("Parsed response:", JSON.parse(bodyText));
            } catch {
                console.log("Raw response:", bodyText);
            }
            console.groupEnd();
            emitNetworkEvent(Config.EVENTS.RESPONSE, {
                url,
                status: response.status,
                statusText: response.statusText,
                bodyText
            });
        } catch (err) {
            console.warn(Config.TAGS.NET, "Failed to read response body:", err);
        }
    }

    function installXHRHook(ctx, label) {
        if (!ctx || typeof ctx.XMLHttpRequest !== "function") {
            log.net(`skip hooking XHR for ${label}: XMLHttpRequest not available`);
            return;
        }
        if (ctx.__aistudio_compressor_xhr_hooked) return;

        const OriginalXHR = ctx.XMLHttpRequest;

        function WrappedXHR() {
            const realXHR = new OriginalXHR();
            let intercepted = false;
            let requestUrl = null;

            const originalOpen = realXHR.open;
            realXHR.open = function (...args) {
                const [, url] = args;
                requestUrl = url || null;
                if (url && isTargetRequest(url)) {
                    intercepted = true;
                    log.net("GenerateContent XHR detected in", label, url);
                }
                return originalOpen.apply(this, args);
            };

            const originalSend = realXHR.send;
            realXHR.send = function (body) {
                if (state.pendingInjectedHistory && requestUrl && isTargetRequest(requestUrl, "CREATE_PROMPT") && body) {
                    const rewritten = rewriteCreatePromptBodyString(body);
                    if (rewritten) {
                        body = rewritten;
                        arguments[0] = rewritten;
                    }
                }

                const injected = maybeServeInjectedResponse(requestUrl);
                if (injected) {
                    log.net("Serve injected response via XHR", { url: requestUrl, label });
                    Promise.resolve(injected.text()).then(payload => {
                        Object.defineProperty(realXHR, "responseText", { value: payload });
                        Object.defineProperty(realXHR, "response", { value: payload });
                        Object.defineProperty(realXHR, "readyState", { value: 4 });
                        Object.defineProperty(realXHR, "status", { value: 200 });
                        Object.defineProperty(realXHR, "statusText", { value: "OK" });
                        Object.defineProperty(realXHR, "responseURL", { value: requestUrl });
                        realXHR.dispatchEvent(new Event("readystatechange"));
                        realXHR.dispatchEvent(new Event("load"));
                    });
                    return;
                }

                if (intercepted) {
                    const absoluteUrl = resolveUrl(requestUrl);
                    const bodyText = bodyToText(body);
                    console.groupCollapsed(`${Config.TAGS.NET} XHR request -> ${absoluteUrl}`);
                    if (bodyText) {
                        try {
                            console.log("Parsed payload:", JSON.parse(bodyText));
                        } catch {
                            console.log("Raw payload:", bodyText);
                        }
                    } else {
                        console.log("Request body unavailable or non-text");
                    }
                    console.groupEnd();
                    emitNetworkEvent(Config.EVENTS.REQUEST, {
                        url: absoluteUrl,
                        headers: null,
                        bodyText
                    });
                }
                return originalSend.apply(this, arguments);
            };

            realXHR.addEventListener("readystatechange", function () {
                if (intercepted && realXHR.readyState === 4) {
                    console.groupCollapsed(`${Config.TAGS.NET} XHR response <- ${realXHR.responseURL}`);
                    console.log("Status:", realXHR.status, realXHR.statusText);
                    try {
                        console.log("Parsed response:", JSON.parse(realXHR.responseText));
                    } catch {
                        console.log("Raw response:", realXHR.responseText);
                    }
                    console.groupEnd();
                    emitNetworkEvent(Config.EVENTS.RESPONSE, {
                        url: realXHR.responseURL,
                        status: realXHR.status,
                        statusText: realXHR.statusText,
                        bodyText: realXHR.responseText
                    });
                }
            });

            return realXHR;
        }

        ctx.XMLHttpRequest = WrappedXHR;
        ctx.__aistudio_compressor_xhr_hooked = true;
        log.net(`XMLHttpRequest hooked in ${label}`);

        if (ctx !== unsafeWindow && typeof unsafeWindow.XMLHttpRequest === "function" && !unsafeWindow.__aistudio_compressor_xhr_hooked) {
            unsafeWindow.XMLHttpRequest = WrappedXHR;
            unsafeWindow.__aistudio_compressor_xhr_hooked = true;
            log.net("XMLHttpRequest mirrored to unsafeWindow");
        }
    }

    function cloneInit(init) {
        if (!init || typeof init !== "object") return undefined;
        return {
            body: cloneBody(init.body),
            cache: init.cache,
            credentials: init.credentials,
            headers: init.headers,
            integrity: init.integrity,
            keepalive: init.keepalive,
            method: init.method,
            mode: init.mode,
            redirect: init.redirect,
            referrer: init.referrer,
            referrerPolicy: init.referrerPolicy,
            signal: init.signal,
            window: init.window
        };
    }

    function resolveUrl(url) {
        if (!url) return "";
        try {
            return new URL(url, location.origin).toString();
        } catch {
            return url;
        }
    }

    function maybeServeInjectedResponse(url) {
        const pending = state.pendingInjectedHistory;
        if (!pending || !url) return null;

        if (isTargetRequest(url, "RESOLVE") && pending.resolveBody && !pending.resolveServed) {
            log.net("Serve injected history via ResolveDriveResource");
            return finalizeInjectedResponse(pending, "resolve");
        }
        if (isTargetRequest(url, "LIST_PROMPTS") && pending.listBody && !pending.listServed) {
            log.net("Serve injected metadata via ListPrompts");
            return finalizeInjectedResponse(pending, "list");
        }
        return null;
    }

    function finalizeInjectedResponse(pending, type) {
        const response = createResponse(type === "resolve" ? pending.resolveBody : pending.listBody);
        if (type === "resolve") pending.resolveServed = true;
        if (type === "list") pending.listServed = true;
        if (pending.resolveServed && pending.listServed) {
            log.net("Injected history fulfilled for new chat");
            state.pendingInjectedHistory = null;
        }
        return response;
    }

    function createResponse(body) {
        return new Response(body, {
            status: 200,
            headers: { "Content-Type": "application/json+protobuf; charset=UTF-8" }
        });
    }

    function cloneBody(body) {
        if (!body) return null;
        if (body instanceof ReadableStream) return body;
        if (body instanceof Blob) return body.slice();
        if (ArrayBuffer.isView(body)) return body.slice();
        if (body instanceof ArrayBuffer) return body.slice(0);
        return body;
    }

    function bodyToText(body) {
        if (!body) return null;
        if (typeof body === "string") return body;
        if (body instanceof ArrayBuffer) {
            try {
                return new TextDecoder().decode(body);
            } catch {
                return null;
            }
        }
        if (ArrayBuffer.isView(body)) {
            try {
                return new TextDecoder().decode(body.buffer);
            } catch {
                return null;
            }
        }
        return null;
    }

    function isTargetRequest(url, key = "GENERATE") {
        try {
            const parsed = new URL(url, location.origin);
            return parsed.pathname.endsWith(Config.TARGETS[key]);
        } catch {
            return false;
        }
    }

    // ---------------------------
    // Compression lifecycle
    // ---------------------------

    const Compression = {
        run() {
            if (state.compressionInProgress) {
                log.ui("Compression already running");
                return;
            }
            const textarea = UI.findInput();
            if (!textarea) {
                log.ui("Input box not found, cannot run compression");
                return;
            }
            const prompt = getCompressPrompt();
            Compression.prepareRunContext();
            state.activeCompressionPrompt = prompt;
            state.activeCompressionSnippet = deriveSnippet(prompt);
            state.compressionInProgress = true;
            state.compressionRequestPending = true;
            state.compressionResponsePending = false;
            UI.setButtonLoading(true);
            setTextareaValue(textarea, prompt);
            textarea.focus();
            textarea.dispatchEvent(new InputEvent("input", { bubbles: true, data: prompt, inputType: "insertText" }));
            textarea.dispatchEvent(new Event("change", { bubbles: true }));
            enableSendButton();
            sendCompressionRequest(textarea);
            log.ui("Compression request sent");
        },

        prepareRunContext() {
            state.lastPromptHistory = null;
            state.lastPromptHistoryUpdatedAt = 0;
            state.pendingInjectedHistory = null;
            state.historyCapturePending = true;
            state.compressionRequestPending = false;
            state.compressionResponsePending = false;
        },

        handleRequestEvent(event) {
            const detail = event?.detail;
            if (!detail?.bodyText) return;
            const isCompressionBody = Compression.isCompressionPrompt(detail.bodyText);

            if (!state.historyCapturePending && !state.compressionInProgress) {
                log.net("GenerateContent request observed outside compression run");
                return;
            }

            if (isCompressionBody && state.historyCapturePending) {
                state.historyCapturePending = false;
                const payload = safeParseJSON(detail.bodyText);
                if (payload) {
                    state.lastPromptHistory = payload;
                    state.lastPromptHistoryUpdatedAt = Date.now();
                    log.net("Stored prompt history snapshot for compression", {
                        ...describePromptHistory(payload)
                    });
                } else {
                    log.net("Compression request detected but prompt history parse failed");
                }
            } else if (state.historyCapturePending && !isCompressionBody) {
                log.net("Compression history capture pending, skipping non-compression request");
            }

            if (isCompressionBody && state.compressionInProgress) {
                state.compressionRequestPending = false;
                state.compressionResponsePending = true;
                log.net("Compression GenerateContent request captured");
            } else {
                log.net("Regular GenerateContent request observed");
            }
        },

        handleResponseEvent(event) {
            if (!state.compressionInProgress || !state.compressionResponsePending) {
                log.net("GenerateContent response event ignored", {
                    compressionInProgress: state.compressionInProgress,
                    compressionResponsePending: state.compressionResponsePending
                });
                return;
            }
            const detail = event?.detail;
            if (!detail?.bodyText) {
                log.net("GenerateContent response missing bodyText");
                Compression.finalizeRun();
                return;
            }
            const data = safeParseJSON(detail.bodyText);
            if (!data) {
                log.net("Failed to parse compression response");
                Compression.finalizeRun();
                return;
            }
            const snapshot = extractStateSnapshot(data);
            if (!snapshot) {
                log.net("No snapshot found in compression response");
                Compression.finalizeRun();
                return;
            }
            log.net("Compression snapshot extracted, rebuilding conversation");
            rebuildConversation(snapshot);
            Compression.finalizeRun();
        },

        finalizeRun() {
            state.compressionRequestPending = false;
            state.compressionResponsePending = false;
            state.compressionInProgress = false;
            state.historyCapturePending = false;
            UI.setButtonLoading(false);
        },

        isCompressionPrompt(bodyText) {
            if (typeof bodyText !== "string") {
                return false;
            }
            const snippet = state.activeCompressionSnippet || deriveSnippet(getCompressPrompt());
            if (!snippet) {
                return bodyText.includes(Config.PROMPTS.SNIPPET);
            }
            const variants = buildSnippetVariants(snippet);
            for (const candidate of variants) {
                if (candidate && bodyText.includes(candidate)) {
                    return true;
                }
            }
            return false;
        }
    };

    function enableSendButton() {
        const sendButton = UI.findSendButton();
        if (sendButton) {
            sendButton.removeAttribute("disabled");
            sendButton.removeAttribute("aria-disabled");
            sendButton.disabled = false;
            sendButton.classList.remove("disabled");
        }
    }

    function sendCompressionRequest(textarea) {
        const doc = textarea.ownerDocument || document;
        const view = doc.defaultView || window;
        const keyOptions = {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            bubbles: true,
            cancelable: true,
            view
        };
        if (env.isMac) {
            keyOptions.metaKey = true;
        } else {
            keyOptions.ctrlKey = true;
        }
        textarea.dispatchEvent(new view.KeyboardEvent("keydown", keyOptions));
        textarea.dispatchEvent(new view.KeyboardEvent("keyup", keyOptions));
        requestAnimationFrame(() => {
            setTextareaValue(textarea, "");
            textarea.dispatchEvent(new InputEvent("input", { bubbles: true, data: "", inputType: "deleteContentBackward" }));
            textarea.dispatchEvent(new Event("change", { bubbles: true }));
        });
    }

    function setTextareaValue(textarea, value) {
        if ("value" in textarea) {
            const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
            const setter = descriptor?.set;
            if (setter) {
                setter.call(textarea, value);
                return;
            }
            textarea.value = value;
        } else {
            textarea.textContent = value;
        }
    }

    // ---------------------------
    // Conversation rebuild & injection
    // ---------------------------

    function rebuildConversation(snapshotText) {
        log.net("rebuildConversation invoked", {
            hasHistory: Boolean(state.lastPromptHistory),
            snapshotLength: snapshotText?.length || 0
        });

        if (!state.lastPromptHistory) {
            log.net("No prompt history to rebuild");
            return;
        }

        log.net("Rebuilding conversation using stored history", {
            summary: describePromptHistory(state.lastPromptHistory)
        });

        const turns = extractTurns(state.lastPromptHistory);
        if (!turns.length) {
            log.net("No turns extracted from prompt history");
            return;
        }
        const sanitizedTurns = stripCompressionPromptTurn(turns);
        if (!sanitizedTurns.length) {
            log.net("History only contained compression prompt turn, abort rebuild");
            return;
        }
        const preserved = pickTailTurns(sanitizedTurns);
        const newTurns = [
            createTurn("user", snapshotText),
            createTurn("model", "Got it. Thanks for the additional context!"),
            ...preserved
        ];
        state.pendingInjectedHistory = buildInjectedPayload(newTurns);
        log.net("Prepared injected history with", newTurns.length, "turns");
        Branching.branchFromHere().catch(err => {
            log.net("Branch injection failed", err);
        });
    }

    function extractStateSnapshot(events) {
        const fullText = collectModelOutputText(events);
        if (!fullText) {
            log.net("collectModelOutputText returned empty string");
            return null;
        }
        const pattern = getSnapshotRegex();
        if (pattern) {
            const matched = matchByRegex(fullText, pattern);
            if (matched) {
                log.net("state_snapshot extracted via custom regex");
                return matched;
            }
            log.net("Custom snapshot regex did not match content");
        }
        log.net("No custom regex provided, returning raw model output as snapshot");
        return fullText.trim();
    }

    function collectModelOutputText(events) {
        const eventList = normalizeEvents(events);
        if (!eventList.length) {
            return "";
        }
        let buffer = "";
        for (const event of eventList) {
            const candidates = Array.isArray(event?.[0]) ? event[0] : null;
            if (!candidates) continue;
            for (const candidate of candidates) {
                if (!Array.isArray(candidate)) continue;
                const contentBlock = Array.isArray(candidate[0]) ? candidate[0] : null;
                if (!contentBlock) continue;
                const parts = Array.isArray(contentBlock[0]) ? contentBlock[0] : null;
                if (!parts) continue;
                for (const part of parts) {
                    if (!Array.isArray(part)) continue;
                    const text = part[1];
                    const isThought = Boolean(part[12]);
                    if (typeof text === "string" && !isThought) {
                        buffer += text;
                    }
                }
            }
        }
        log.net("collectModelOutputText aggregated", {
            eventCount: eventList.length,
            textLength: buffer.length
        });
        return buffer;
    }

    function normalizeEvents(payload) {
        if (!Array.isArray(payload)) {
            return [];
        }
        if (payload.length === 1 && Array.isArray(payload[0])) {
            const inner = payload[0];
            if (inner.every(item => Array.isArray(item))) {
                return inner;
            }
        }
        return payload;
    }

    function extractTurns(payload) {
        try {
            if (!Array.isArray(payload)) {
                log.net("Prompt history payload is not an array");
                return [];
            }
            const rawTurns = payload[1];
            if (!Array.isArray(rawTurns)) {
                log.net("Prompt history array missing turn entries");
                return [];
            }
            const turns = [];
            for (const entry of rawTurns) {
                if (!Array.isArray(entry) || entry.length < 2) continue;
                const role = entry[1];
                const text = extractTurnText(entry[0], role);
                if (typeof role === "string" && text) {
                    turns.push({
                        role,
                        text,
                        entry: deepClone(entry)
                    });
                }
            }
            log.net("Extracted", turns.length, "turns from prompt history");
            return turns;
        } catch (err) {
            log.net("Failed to extract turns", err);
            return [];
        }
    }

    function describePromptHistory(payload) {
        if (!Array.isArray(payload)) {
            return { valid: false, type: typeof payload };
        }
        const rawTurns = Array.isArray(payload[1]) ? payload[1] : null;
        if (!rawTurns) {
            return { valid: false, reason: "missing turns array" };
        }
        const firstTurn = rawTurns[0];
        return {
            valid: true,
            turnCount: rawTurns.length,
            firstRole: firstTurn?.[1],
            firstChunkType: Array.isArray(firstTurn?.[0]) ? "chunks" : typeof firstTurn?.[0]
        };
    }

    function stripCompressionPromptTurn(turns) {
        if (!turns.length) return turns;
        const lastTurn = turns[turns.length - 1];
        const snippet = state.activeCompressionSnippet || deriveSnippet(getCompressPrompt());
        if (lastTurn?.role === "user" && typeof lastTurn.text === "string" && snippet && lastTurn.text.includes(snippet)) {
            log.net("Detected compression prompt turn at tail, removing from preserved history");
            return turns.slice(0, -1);
        }
        return turns;
    }

    function extractTurnText(rawContent, role) {
        if (!rawContent) return "";
        if (typeof rawContent === "string") return rawContent;
        if (!Array.isArray(rawContent)) return "";

        let buffer = "";
        const shouldSkipFirstBlock = role === "model";
        let skipThoughtChunk = shouldSkipFirstBlock;
        let skippedChunk = "";
        for (const block of rawContent) {
            if (!Array.isArray(block)) continue;
            const isThought = Boolean(block[12]);
            if (isThought) continue;
            const chunk = block[1];
            if (typeof chunk === "string") {
                if (skipThoughtChunk) {
                    skipThoughtChunk = false;
                    skippedChunk = chunk;
                    continue;
                }
                buffer += chunk;
            }
        }
        if (!buffer && skippedChunk) {
            return skippedChunk;
        }
        return buffer;
    }

    function pickTailTurns(turns) {
        if (!turns.length) return [];
        const fullText = turns.map(t => t.text).join("\n");
        const { percent, minChars } = getTailRetentionConfig();
        if (percent >= 100) {
            log.net("Tail retention percent at 100, preserving all turns");
            return turns.slice();
        }
        const computedTarget = Math.floor(fullText.length * (percent / 100));
        const targetLength = Math.min(fullText.length, Math.max(minChars, computedTarget));
        if (targetLength <= 0) {
            log.net("Tail retention target is zero, skipping preserved turns");
            return [];
        }
        let acc = 0;
        let startIndex = turns.length - 1;
        while (startIndex >= 0) {
            acc += turns[startIndex].text.length;
            if (acc >= targetLength && turns[startIndex].role === "user") {
                break;
            }
            startIndex--;
        }
        startIndex = Math.max(0, startIndex);
        while (startIndex > 0 && turns[startIndex].role !== "user") {
            startIndex--;
        }
        log.net("Preserving tail turns from index", startIndex, "approx chars", acc);
        return turns.slice(startIndex);
    }

    function createTurn(role, text) {
        return {
            role,
            text,
            entry: buildCreatePromptEntry({ role, text })
        };
    }

    function buildInjectedPayload(turnRecords) {
        const history = turnRecords.map(turn => [
            [
                [
                    null,
                    turn.text
                ]
            ],
            turn.role
        ]);
        const promptHistory = JSON.stringify(history);
        const metadata = JSON.stringify([[turnRecords[0]?.text?.slice(0, 50) || "Compressed Chat", 0]]);
        return {
            resolveBody: promptHistory,
            listBody: metadata,
            resolveServed: false,
            listServed: false,
            turns: turnRecords
        };
    }

    // ---------------------------
    // Branching controls
    // ---------------------------

    const Branching = {
        async branchFromHere() {
            if (state.branchInProgress) {
                log.ui("Branch injection already running, please wait");
                return;
            }
            log.net("Attempting to branch from current turn");
            const menuBtn = await Branching.waitForBranchMenuTrigger();
            if (!menuBtn) {
                log.net("Branch menu trigger not found after waiting");
                alert("无法定位 Branch 菜单，请确保已打开某个对话。");
                return;
            }
            log.net("Branch menu trigger located, opening menu");
            const previousPromptId = Branching.getCurrentPromptId();
            state.branchInProgress = true;
            try {
                menuBtn.click();
                log.ui("Turn menu clicked for branch");
                const branchItem = await Branching.waitForBranchMenuItem();
                log.net("Branch menu item located, clicking");
                branchItem.click();
                log.ui("Branch from here clicked, waiting for new prompt to load");
                try {
                    await Branching.waitForPromptChange(previousPromptId);
                    log.ui("New prompt detected after branching");
                    log.net("Branch completed successfully");
                } catch (err) {
                    log.net("Prompt ID did not change after branch", err);
                }
            } catch (err) {
                log.net("Branch injection failed", err);
                state.pendingInjectedHistory = null;
                throw err;
            } finally {
                state.branchInProgress = false;
            }
        },

        waitForBranchMenuTrigger(timeout = Config.TIMING.BRANCH_MENU_TIMEOUT) {
            return waitForCondition(() => Branching.findBranchMenuTrigger(), timeout, "branch menu trigger");
        },

        waitForBranchMenuItem(timeout = Config.TIMING.BRANCH_MENU_TIMEOUT) {
            return waitForCondition(() => {
                const buttons = document.querySelectorAll('button[role="menuitem"], button.mat-mdc-menu-item');
                for (const btn of buttons) {
                    if (btn.textContent && btn.textContent.includes("Branch from here")) {
                        log.net("Found Branch from here menu item");
                        return btn;
                    }
                }
                return null;
            }, timeout, "Branch menu item");
        },

        waitForPromptChange(previousPromptId, timeout = Config.TIMING.PROMPT_CHANGE_TIMEOUT) {
            return waitForCondition(() => {
                const current = Branching.getCurrentPromptId();
                if (current && current !== previousPromptId) {
                    return current;
                }
                return null;
            }, timeout, "prompt ID change");
        },

        getCurrentPromptId() {
            const path = location.pathname || "";
            const match = path.match(/\/prompts\/([^/?#]+)/);
            return match ? match[1] : null;
        },

        findBranchMenuTrigger() {
            const selectors = [
                'button[aria-label="More actions"]',
                'button[aria-label="More options"]',
                'button[aria-haspopup="menu"]',
                'button.mat-mdc-menu-trigger'
            ];
            for (const doc of UI.getCandidateDocuments()) {
                const turns = doc.querySelectorAll("ms-chat-turn");
                if (!turns.length) continue;
                const candidates = [];
                if (turns.length > 1) {
                    candidates.push(turns[turns.length - 2]);
                }
                candidates.push(turns[turns.length - 1]);
                for (const turn of candidates) {
                    for (const selector of selectors) {
                        const btn = turn.querySelector(selector);
                        if (btn) {
                            log.net("Branch menu trigger found on turn", {
                                turnIndex: Array.prototype.indexOf.call(turns, turn),
                                totalTurns: turns.length
                            });
                            return btn;
                        }
                    }
                }
            }
            return null;
        }
    };

    // ---------------------------
    // UI module (toolbar button)
    // ---------------------------

    const UI = {
        init() {
            UI.injectButton();

            window.addEventListener("DOMContentLoaded", () => {
                log.ui("DOMContentLoaded");
                UI.injectButton();
            });

            window.addEventListener("load", () => {
                log.ui("window load event");
                UI.injectButton();
            });

            const observer = new MutationObserver(() => {
                UI.injectButton();
            });

            function startObserver() {
                let attached = false;
                for (const doc of UI.getCandidateDocuments()) {
                    if (doc.body) {
                        observer.observe(doc.body, { childList: true, subtree: true });
                        attached = true;
                    }
                }
                if (attached) {
                    log.ui("MutationObserver for button injection started");
                } else {
                    log.ui("Document body not ready for observer");
                }
            }

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", startObserver, { once: true });
            } else {
                startObserver();
            }

            setInterval(() => UI.injectButton(), 2000);
        },

        injectButton() {
            if (!window.location.href.includes(Config.UI.TARGET_PATH)) return;
            for (const doc of UI.getCandidateDocuments()) {
                if (doc.getElementById(Config.UI.BUTTON_ID)) return;
                const toolbar = doc.querySelector(Config.UI.TOOLBAR_SELECTOR);
                if (!toolbar) continue;
                const button = UI.createButton(doc);
                const moreButton = toolbar.querySelector('button[iconname="more_vert"]');
                if (moreButton) {
                    toolbar.insertBefore(button, moreButton);
                    log.ui("Compressor button inserted before menu button");
                } else {
                    toolbar.appendChild(button);
                    log.ui("Compressor button appended to toolbar");
                }
                return;
            }
            log.ui("Toolbar not found, wait for next mutation");
        },

        createButton(doc = document) {
            UI.ensureStyles(doc);
            const button = doc.createElement("button");
            button.id = Config.UI.BUTTON_ID;
            button.title = "Compress Chat History";
            button.setAttribute("ms-button", "");
            button.setAttribute("variant", "icon-borderless");
            button.setAttribute("mattooltip", "Compress Chat History");
            button.setAttribute("mattooltipposition", "below");
            button.setAttribute("iconname", "summarize");
            button.className = "mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon";
            button.setAttribute("aria-label", "Compress Chat History");
            button.setAttribute("aria-disabled", "false");
            button.type = "button";
            button.addEventListener("click", Compression.run);

            const iconSpan = doc.createElement("span");
            iconSpan.className = "material-symbols-outlined notranslate ms-button-icon-symbol compressor-icon";
            iconSpan.setAttribute("aria-hidden", "true");
            iconSpan.textContent = "docs";
            button.appendChild(iconSpan);

            const spinnerSpan = doc.createElement("span");
            spinnerSpan.className = "compressor-spinner";
            spinnerSpan.setAttribute("aria-hidden", "true");
            button.appendChild(spinnerSpan);

            return button;
        },

        ensureStyles(doc) {
            const styleId = `${Config.UI.BUTTON_ID}-style`;
            if (doc.getElementById(styleId)) return;
            const style = doc.createElement("style");
            style.id = styleId;
            style.textContent = `@keyframes aistudio-compressor-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
#${Config.UI.BUTTON_ID} {
    position: relative;
    width: 36px !important;
    min-width: 36px !important;
    height: 36px !important;
    padding: 6px !important;
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
}
#${Config.UI.BUTTON_ID} .compressor-spinner {
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: aistudio-compressor-spin 0.8s linear infinite;
    display: none;
}
#${Config.UI.BUTTON_ID}.compressor-loading .compressor-spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
#${Config.UI.BUTTON_ID}.compressor-loading .compressor-icon {
    display: none;
}`;
            const target = doc.head || doc.documentElement || doc.body;
            if (target) {
                target.appendChild(style);
            }
        },

        findInput() {
            const docs = UI.getCandidateDocuments();
            for (const doc of docs) {
                for (const selector of Config.UI.INPUT_SELECTORS) {
                    const el = doc.querySelector(selector);
                    if (el) {
                        log.ui("Input box found via selector", selector);
                        return el;
                    }
                }
            }
            return null;
        },

        findSendButton() {
            const docs = UI.getCandidateDocuments();
            for (const doc of docs) {
                for (const selector of Config.UI.SEND_BUTTON_SELECTORS) {
                    const btn = doc.querySelector(selector);
                    if (btn) {
                        log.ui("Send button found via selector", selector);
                        return btn;
                    }
                }
            }
            return null;
        },

        getCandidateDocuments() {
            const docs = [document];
            const frameDoc = document.querySelector('iframe[src*="bscframe"]')?.contentDocument;
            if (frameDoc && frameDoc !== document) {
                docs.push(frameDoc);
            }
            return docs;
        },

        setButtonLoading(isLoading) {
            const button = UI.findButton();
            if (!button) return;
            if (isLoading) {
                button.classList.add("compressor-loading");
                button.setAttribute("disabled", "true");
                button.setAttribute("aria-disabled", "true");
            } else {
                button.classList.remove("compressor-loading");
                button.removeAttribute("disabled");
                button.removeAttribute("aria-disabled");
            }
        },

        findButton() {
            for (const doc of UI.getCandidateDocuments()) {
                const btn = doc.getElementById(Config.UI.BUTTON_ID);
                if (btn) return btn;
            }
            return null;
        }
    };

    // ---------------------------
    // CreatePrompt rewriting
    // ---------------------------

    async function maybeRewriteCreatePromptRequest(request) {
        if (!state.pendingInjectedHistory || !isTargetRequest(request.url, "CREATE_PROMPT")) {
            return null;
        }
        try {
            const bodyText = await request.clone().text();
            const rewritten = rewriteCreatePromptBodyString(bodyText);
            if (!rewritten) {
                return null;
            }
            log.net("CreatePrompt payload rewritten via fetch", {
                turnCount: state.pendingInjectedHistory?.turns?.length || 0
            });
            return new Request(request, { body: rewritten });
        } catch (err) {
            log.net("Failed to rewrite CreatePrompt via fetch", err);
            return null;
        }
    }

    function rewriteCreatePromptBodyString(body) {
        if (!state.pendingInjectedHistory?.turns) return null;
        if (typeof body !== "string") return null;
        let parsed;
        try {
            parsed = JSON.parse(body);
        } catch {
            return null;
        }
        if (!Array.isArray(parsed) || !Array.isArray(parsed[0])) {
            return null;
        }
        const root = parsed[0];
        if (!Array.isArray(root) || root.length < 14) {
            return null;
        }
        const threads = Array.isArray(root[13]) ? root[13] : null;
        if (!threads || !threads.length) {
            return null;
        }
        const secondaryThread = threads[1] ? threads[1] : [];
        const rebuiltThread = state.pendingInjectedHistory.turns.map(turn => buildCreatePromptEntry(turn));
        root[13] = [rebuiltThread, secondaryThread];
        log.net("CreatePrompt payload rewritten", {
            turnCount: state.pendingInjectedHistory.turns.length
        });
        state.pendingInjectedHistory = null;
        return JSON.stringify(parsed);
    }

    function buildCreatePromptEntry(turn) {
        const text = turn?.text || "";
        const role = turn?.role === "model" ? "model" : "user";
        const entry = new Array(9).fill(null);
        entry[0] = text;
        entry[8] = role;
        const tokenEstimate = estimateTokenCount(text);
        if (tokenEstimate > 0) {
            while (entry.length < 19) {
                entry.push(null);
            }
            entry[18] = tokenEstimate;
        }
        while (entry.length && (entry[entry.length - 1] === null || entry[entry.length - 1] === undefined)) {
            entry.pop();
        }
        return entry;
    }

    function estimateTokenCount(text) {
        if (!text) return 0;
        return Math.max(1, Math.round(text.length / 4));
    }

    function deepClone(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
    }

    function safeParseJSON(text) {
        if (typeof text !== "string") return null;
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    }

    function buildSnippetVariants(snippet) {
        if (typeof snippet !== "string" || !snippet) {
            return [];
        }
        const variants = [snippet];
        const escaped = escapeForJSON(snippet);
        if (escaped && escaped !== snippet) {
            variants.push(escaped);
        }
        return variants;
    }

    function escapeForJSON(text) {
        try {
            const encoded = JSON.stringify(text);
            return typeof encoded === "string" ? encoded.slice(1, -1) : text;
        } catch {
            return text;
        }
    }

    function matchByRegex(text, pattern) {
        if (!pattern) return null;
        try {
            const regex = new RegExp(pattern, "s");
            const result = text.match(regex);
            return result ? result[0] : null;
        } catch (err) {
            log.net("Invalid snapshot regex", err);
            return null;
        }
    }

    function waitForCondition(checkFn, timeout, label) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                try {
                    const result = checkFn();
                    if (result) {
                        clearInterval(timer);
                        resolve(result);
                        return;
                    }
                    if (Date.now() - start >= timeout) {
                        clearInterval(timer);
                        reject(new Error(`Timeout waiting for ${label || "condition"}`));
                    }
                } catch (err) {
                    clearInterval(timer);
                    reject(err);
                }
            }, 150);
        });
    }

    function bootstrap() {
        installTopLevelHandlers();
        registerMenuCommands();
        installSettingsMessageBridge();
        NetworkMonitor.init();
        if (!env.isAppContext) {
            UI.init();
        }
    }

    bootstrap();

})();
