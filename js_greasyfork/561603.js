// ==UserScript==
// @name         智能网页分析助手
// @name:en      Smart Webpage Analyzer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  使用AI分析网页内容，提供摘要和相关推荐
// @description:en  Analyze webpage content with AI, provide summary and recommendations
// @author       WebAnalyzer
// @match        *://*/*
// @exclude      *://localhost/*
// @exclude      *://127.0.0.1/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.openai.com
// @connect      generativelanguage.googleapis.com
// @connect      dashscope.aliyuncs.com
// @connect      open.bigmodel.cn
// @connect      api.anthropic.com
// @connect      api.siliconflow.cn
// @connect      api.ohmygpt.com
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561603/%E6%99%BA%E8%83%BD%E7%BD%91%E9%A1%B5%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561603/%E6%99%BA%E8%83%BD%E7%BD%91%E9%A1%B5%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(() => {
  // 配置项
  const CONFIG = {
    API_PROVIDER: window.GM_getValue("api_provider", "openai"), // openai, gemini, qwen, zhipu, claude, siliconflow, ohmygpt
    API_KEY: window.GM_getValue("api_key", ""),
    MODEL: window.GM_getValue("api_model", "gpt-4o-mini"),
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000,
    REQUEST_COOLDOWN: 15000,
    CACHE_EXPIRY: 3600000,
  }

  // API提供商的详细配置
  const API_PROVIDERS = {
    openai: {
      name: "OpenAI",
      endpoint: "https://api.openai.com/v1/chat/completions",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
      defaultModel: "gpt-4o-mini",
      authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
      requestFormat: "openai",
      helpUrl: "https://platform.openai.com/api-keys",
    },
    gemini: {
      name: "Google Gemini",
      endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
      models: [
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash-thinking-exp-1219",
        "gemini-exp-1206",
        "gemini-1.5-flash-8b",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
      ],
      defaultModel: "gemini-2.0-flash-exp",
      authHeader: (key) => ({}),
      requestFormat: "gemini",
      helpUrl: "https://makersuite.google.com/app/apikey",
    },
    claude: {
      name: "Claude (Anthropic)",
      endpoint: "https://api.anthropic.com/v1/messages",
      models: [
        "claude-3-5-sonnet-20241022",
        "claude-3-5-haiku-20241022",
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
      ],
      defaultModel: "claude-3-5-sonnet-20241022",
      authHeader: (key) => ({ "x-api-key": key.trim() }),
      requestFormat: "claude",
      helpUrl: "https://console.anthropic.com/settings/keys",
    },
    qwen: {
      name: "通义千问 (阿里云)",
      endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      models: ["qwen-turbo", "qwen-plus", "qwen-max"],
      defaultModel: "qwen-turbo",
      authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
      requestFormat: "qwen",
      helpUrl: "https://dashscope.console.aliyun.com/apiKey",
    },
    zhipu: {
      name: "智谱AI (GLM)",
      endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      models: ["glm-4-plus", "glm-4-0520", "glm-4-air", "glm-4-flash"],
      defaultModel: "glm-4-flash",
      authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
      requestFormat: "openai",
      helpUrl: "https://open.bigmodel.cn/usercenter/apikeys",
    },
    siliconflow: {
      name: "SiliconFlow (硅基流动)",
      endpoint: "https://api.siliconflow.cn/v1/chat/completions",
      models: [
        "deepseek-ai/DeepSeek-V3",
        "Qwen/Qwen2.5-7B-Instruct",
        "Qwen/Qwen2.5-72B-Instruct",
        "01-ai/Yi-Lightning",
        "Pro/01-ai/Yi-Lightning",
        "THUDM/glm-4-9b-chat",
        "meta-llama/Meta-Llama-3.1-8B-Instruct",
        "meta-llama/Meta-Llama-3.1-70B-Instruct",
        "meta-llama/Meta-Llama-3.1-405B-Instruct",
      ],
      defaultModel: "deepseek-ai/DeepSeek-V3",
      authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
      requestFormat: "openai",
      helpUrl: "https://cloud.siliconflow.cn/account/ak",
    },
    ohmygpt: {
      name: "OhMyGPT",
      endpoint: "https://api.ohmygpt.com/v1/chat/completions",
      models: [
        "gpt-4o",
        "gpt-4o-mini",
        "gpt-4-turbo",
        "gpt-3.5-turbo",
        "claude-3-5-sonnet-20241022",
        "claude-3-opus-20240229",
        "gemini-2.0-flash-exp",
        "gemini-1.5-pro",
      ],
      defaultModel: "gpt-4o-mini",
      authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
      requestFormat: "openai",
      helpUrl: "https://www.ohmygpt.com/",
    },
  }

  // 全局状态
  let isAnalyzing = false
  let analysisResult = null
  let lastRequestTime = 0
  const analysisCache = {}

  function getCacheKey() {
    const url = window.location.href
    const title = document.title
    return `${url}_${title}`
  }

  function getCache(key) {
    const cached = analysisCache[key]
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_EXPIRY) {
      console.log("[v0] 使用缓存的分析结果")
      return cached.data
    }
    return null
  }

  function setCache(key, data) {
    analysisCache[key] = {
      data: data,
      timestamp: Date.now(),
    }
    console.log("[v0] 分析结果已缓存")
  }

  function clearAllCache() {
    for (const key in analysisCache) {
      delete analysisCache[key]
    }
    console.log("[v0] 清除所有缓存")
  }

  // 提取网页核心内容
  function extractPageContent() {
    const content = {
      title: document.title,
      url: window.location.href,
      description: document.querySelector('meta[name="description"]')?.content || "",
      keywords: document.querySelector('meta[name="keywords"]')?.content || "",
      text: "",
    }

    // 提取主要文本内容
    const mainElements = document.querySelectorAll("article, main, .content, .post-content, .article-content, p")
    const textParts = []

    mainElements.forEach((el) => {
      const text = el.innerText?.trim()
      if (text && text.length > 50) {
        textParts.push(text)
      }
    })

    content.text = textParts.join("\n").substring(0, 5000) // 限制长度
    return content
  }

  // 延迟函数
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function formatRequestData(provider, model, messages) {
    const providerConfig = API_PROVIDERS[provider]

    if (providerConfig.requestFormat === "gemini") {
      // Gemini API格式
      return {
        contents: messages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }
    } else if (providerConfig.requestFormat === "claude") {
      // Claude API格式
      const systemMessage = messages.find((msg) => msg.role === "system")
      const userMessages = messages.filter((msg) => msg.role !== "system")

      return {
        model: model,
        max_tokens: 2000,
        temperature: 0.7,
        system: systemMessage ? systemMessage.content : undefined,
        messages: userMessages.map((msg) => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        })),
      }
    } else if (providerConfig.requestFormat === "qwen") {
      // 通义千问格式
      return {
        model: model,
        input: {
          messages: messages,
        },
        parameters: {
          temperature: 0.7,
          max_tokens: 2000,
        },
      }
    } else {
      // OpenAI格式（也适用于智谱AI）
      return {
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }
    }
  }

  function parseAPIResponse(provider, data) {
    const providerConfig = API_PROVIDERS[provider]

    if (providerConfig.requestFormat === "gemini") {
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("API响应格式错误：缺少candidates数组")
      }
      const candidate = data.candidates[0]
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error("API响应格式错误：缺少content.parts")
      }
      return { content: candidate.content.parts[0].text, data }
    } else if (providerConfig.requestFormat === "claude") {
      // Claude响应格式
      if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
        console.error("[v0] Claude响应数据:", data)
        throw new Error("API响应格式错误：缺少content数组")
      }
      const textContent = data.content.find((item) => item.type === "text")
      if (!textContent || !textContent.text) {
        console.error("[v0] Claude content数组:", data.content)
        throw new Error("API响应格式错误：缺少文本内容")
      }
      return { content: textContent.text, data }
    } else if (providerConfig.requestFormat === "qwen") {
      // 通义千问响应格式
      if (!data.output || !data.output.choices || data.output.choices.length === 0) {
        throw new Error("API响应格式错误：缺少output")
      }
      const content = data.output.choices[0]?.message?.content
      if (!content) {
        throw new Error("API响应格式错误：缺少内容")
      }
      return { content, data }
    } else {
      // OpenAI格式
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new Error("API响应格式错误：缺少choices数组")
      }
      const firstChoice = data.choices[0]
      if (!firstChoice || !firstChoice.message || !firstChoice.message.content) {
        throw new Error("API响应格式错误：缺少message内容")
      }
      return { content: firstChoice.message.content, data }
    }
  }

  function getAPIEndpoint(provider, model) {
    const providerConfig = API_PROVIDERS[provider]
    if (provider === "gemini") {
      return providerConfig.endpoint.replace("{model}", model) + `?key=${CONFIG.API_KEY}`
    }
    return providerConfig.endpoint
  }

  async function callAPIWithRetry(messages, retryCount = 0) {
    const timeSinceLastRequest = Date.now() - lastRequestTime
    if (timeSinceLastRequest < CONFIG.REQUEST_COOLDOWN) {
      const waitTime = CONFIG.REQUEST_COOLDOWN - timeSinceLastRequest
      console.log(`[v0] 等待冷却时间: ${(waitTime / 1000).toFixed(1)}秒`)
      await delay(waitTime)
    }

    lastRequestTime = Date.now()

    const provider = CONFIG.API_PROVIDER
    const model = CONFIG.MODEL
    const providerConfig = API_PROVIDERS[provider]
    const endpoint = getAPIEndpoint(provider, model)
    const requestData = formatRequestData(provider, model, messages)

    const apiKey = CONFIG.API_KEY.trim()
    const headers = {
      "Content-Type": "application/json",
      ...providerConfig.authHeader(apiKey),
    }

    // Claude需要特殊的anthropic-version header
    if (provider === "claude") {
      headers["anthropic-version"] = "2023-06-01"
      console.log("[v0] Claude请求headers:", Object.keys(headers))
    }

    return new Promise((resolve, reject) => {
      window.GM_xmlhttpRequest({
        method: "POST",
        url: endpoint,
        headers: headers,
        data: JSON.stringify(requestData),
        onload: async (response) => {
          try {
            if (response.status === 401) {
              let errorData
              try {
                errorData = JSON.parse(response.responseText)
              } catch (e) {
                errorData = { message: response.responseText }
              }

              let errorMessage = `API密钥验证失败 (HTTP 401)`

              if (provider === "claude") {
                errorMessage += `\n\n请检查：\n1. API密钥格式是否正确（应以 'sk-ant-' 开头）\n2. 密钥是否已过期或被撤销\n3. 是否有足够的API额度\n\n获取新密钥：${providerConfig.helpUrl}`
              } else {
                errorMessage += `\n请检查API密钥是否正确配置\n获取密钥：${providerConfig.helpUrl}`
              }

              console.error("[v0] 认证错误详情:", errorData)
              throw new Error(errorMessage)
            }

            if (response.status === 429) {
              if (retryCount < CONFIG.MAX_RETRIES) {
                const retryDelay = CONFIG.RETRY_DELAY * Math.pow(3, retryCount)
                console.log(
                  `[v0] 遇到速率限制，${(retryDelay / 1000).toFixed(0)}秒后重试 (${retryCount + 1}/${CONFIG.MAX_RETRIES})`,
                )
                await delay(retryDelay)
                const result = await callAPIWithRetry(messages, retryCount + 1)
                resolve(result)
                return
              } else {
                throw new Error("API请求超过速率限制，请稍后再试。等待建议1分钟后重新分析。")
              }
            }

            if (response.status < 200 || response.status >= 300) {
              const errorMsg = `API请求失败 (HTTP ${response.status})`
              let errorDetail = ""
              try {
                const errorData = JSON.parse(response.responseText)
                errorDetail = JSON.stringify(errorData)
                console.error("[v0] API错误详情:", errorData)
              } catch (e) {
                errorDetail = response.responseText
              }
              throw new Error(`${errorMsg}: ${errorDetail}`)
            }

            if (!response.responseText) {
              throw new Error("API返回空响应")
            }

            const { content, data } = parseAPIResponse(provider, JSON.parse(response.responseText))

            resolve({ content, rawData: data })
          } catch (error) {
            console.error("[v0] API响应处理错误:", error)
            console.error("[v0] 原始响应:", response.responseText)
            reject(error)
          }
        },
        onerror: (error) => {
          console.error("[v0] 请求错误:", error)
          reject(new Error("网络请求失败"))
        },
        ontimeout: () => {
          console.error("[v0] 请求超时")
          reject(new Error("API请求超时，请检查网络连接"))
        },
        timeout: 60000,
      })
    })
  }

  async function analyzeWebPage() {
    if (isAnalyzing) return

    if (!CONFIG.API_KEY) {
      showError("请先配置 API Key")
      showSettings()
      return
    }

    const cacheKey = getCacheKey()
    const cached = getCache(cacheKey)
    if (cached) {
      console.log("[v0] 使用缓存的分析结果")
      analysisResult = cached
      displayAnalysis(cached)
      return
    }

    try {
      isAnalyzing = true
      const analyzeBtn = document.getElementById("analyze-btn")
      if (analyzeBtn) {
        analyzeBtn.textContent = "分析中..."
        analyzeBtn.disabled = true
      }

      const content = extractPageContent()
      const messages = [
        {
          role: "system",
          content: "你是一个专业的网页内容分析助手。请以简洁、专业的方式分析网页内容，并提供有价值的建议。",
        },
        {
          role: "user",
          content: `请分析以下网页内容，并按照以下JSON格式返回结果：

{
  "summary": "网页内容的简要总结（2-3句话）",
  "keyPoints": ["要点1", "要点2", "要点3"],
  "contentType": "网页类型（如：博客文章、产品页面、技术文档等）",
  "recommendations": [
    {
      "title": "推荐网站标题",
      "url": "推荐URL",
      "reason": "推荐理由"
    }
  ]
}

网页内容：
标题: ${content.title}
正文: ${content.text.substring(0, 3000)}`,
        },
      ]

      const result = await callAPIWithRetry(messages)
      let analysisData

      try {
        const cleanedContent = result.content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim()
        analysisData = JSON.parse(cleanedContent)
      } catch (e) {
        console.error("[v0] JSON解析失败，使用原始文本")
        analysisData = {
          summary: result.content,
          keyPoints: [],
          contentType: "未知",
          recommendations: [],
        }
      }

      analysisResult = analysisData
      setCache(cacheKey, analysisData)
      displayAnalysis(analysisData)
    } catch (error) {
      console.error("[v0] 分析失败:", error)
      showError(`解析API响应失败: ${error.message}`)
    } finally {
      isAnalyzing = false
      const analyzeBtn = document.getElementById("analyze-btn")
      if (analyzeBtn) {
        analyzeBtn.textContent = "开始分析"
        analyzeBtn.disabled = false
      }
    }
  }

  // 显示错误信息
  function showError(message) {
    const panel = document.getElementById("webpage-analyzer-panel")
    const content = panel.querySelector(".analyzer-content")
    content.innerHTML = `
            <div class="analyzer-error">
                <p>❌ 错误</p>
                <p>${message}</p>
            </div>
        `
  }

  // 创建UI样式
  function createStyles() {
    const style = document.createElement("style")
    style.textContent = `
            #webpage-analyzer-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 360px;
                max-height: 80vh;
                background: rgba(255, 255, 255, 0.98);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                backdrop-filter: blur(10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(0, 0, 0, 0.08);
            }

            #webpage-analyzer-panel.dark-mode {
                background: rgba(26, 26, 26, 0.98);
                border-color: rgba(255, 255, 255, 0.1);
                color: #e5e5e5;
            }

            #webpage-analyzer-panel.minimized {
                width: 56px;
                height: 56px;
                border-radius: 28px;
                overflow: hidden;
            }

            #webpage-analyzer-panel.minimized .analyzer-content,
            #webpage-analyzer-panel.minimized .analyzer-header-text {
                display: none;
            }

            .analyzer-header {
                padding: 16px 20px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: move;
            }

            .dark-mode .analyzer-header {
                border-bottom-color: rgba(255, 255, 255, 0.1);
            }

            .analyzer-header-text {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 15px;
            }

            .analyzer-icon {
                font-size: 20px;
            }

            .analyzer-controls {
                display: flex;
                gap: 6px;
            }

            .analyzer-btn {
                width: 32px;
                height: 32px;
                border: none;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                padding: 0;
            }

            .analyzer-btn:hover {
                background: rgba(0, 0, 0, 0.1);
                transform: scale(1.05);
            }

            .dark-mode .analyzer-btn {
                background: rgba(255, 255, 255, 0.1);
                color: #e5e5e5;
            }

            .dark-mode .analyzer-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .analyzer-btn.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .analyzer-btn.primary:hover {
                background: linear-gradient(135deg, #5568d3 0%, #63398e 100%);
            }
            
            .analyzer-btn.close {
                background: rgba(239, 68, 68, 0.1);
                color: #dc2626;
            }

            .analyzer-btn.close:hover {
                background: rgba(239, 68, 68, 0.2);
                transform: scale(1.05);
            }

            .dark-mode .analyzer-btn.close {
                background: rgba(239, 68, 68, 0.15);
                color: #f87171;
            }

            .dark-mode .analyzer-btn.close:hover {
                background: rgba(239, 68, 68, 0.25);
            }

            .analyzer-content {
                padding: 20px;
                max-height: calc(80vh - 64px);
                overflow-y: auto;
            }

            .analyzer-content::-webkit-scrollbar {
                width: 6px;
            }

            .analyzer-content::-webkit-scrollbar-track {
                background: transparent;
            }

            .analyzer-content::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 3px;
            }

            .dark-mode .analyzer-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
            }

            .analyzer-section {
                margin-bottom: 24px;
            }

            .analyzer-section:last-child {
                margin-bottom: 0;
            }

            .analyzer-section-title {
                font-size: 13px;
                font-weight: 600;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 12px;
            }

            .dark-mode .analyzer-section-title {
                color: #999;
            }

            .analyzer-summary {
                font-size: 14px;
                line-height: 1.6;
                color: #333;
                background: rgba(0, 0, 0, 0.03);
                padding: 16px;
                border-radius: 12px;
                border-left: 3px solid #1a1a1a;
            }

            .dark-mode .analyzer-summary {
                color: #d4d4d4;
                background: rgba(255, 255, 255, 0.05);
                border-left-color: #e5e5e5;
            }

            .analyzer-key-points {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .key-point {
                font-size: 14px;
                line-height: 1.5;
                color: #333;
                padding: 12px;
                background: rgba(0, 0, 0, 0.03);
                border-radius: 10px;
                display: flex;
                gap: 10px;
            }

            .dark-mode .key-point {
                color: #d4d4d4;
                background: rgba(255, 255, 255, 0.05);
            }

            .key-point-bullet {
                color: #1a1a1a;
                font-weight: 600;
                flex-shrink: 0;
            }

            .dark-mode .key-point-bullet {
                color: #e5e5e5;
            }

            .analyzer-recommendations {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .recommendation-item {
                padding: 14px;
                background: rgba(0, 0, 0, 0.03);
                border-radius: 12px;
                transition: all 0.2s;
                cursor: pointer;
                border: 1px solid transparent;
            }

            .dark-mode .recommendation-item {
                background: rgba(255, 255, 255, 0.05);
            }

            .recommendation-item:hover {
                background: rgba(0, 0, 0, 0.06);
                border-color: rgba(0, 0, 0, 0.1);
                transform: translateX(4px);
            }

            .dark-mode .recommendation-item:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.15);
            }

            .recommendation-name {
                font-size: 14px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .dark-mode .recommendation-name {
                color: #e5e5e5;
            }

            .recommendation-desc {
                font-size: 13px;
                line-height: 1.5;
                color: #666;
            }

            .dark-mode .recommendation-desc {
                color: #999;
            }

            .analyzer-loading {
                text-align: center;
                padding: 40px 20px;
            }

            .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(0, 0, 0, 0.1);
                border-top-color: #1a1a1a;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin: 0 auto 16px;
            }

            .dark-mode .spinner {
                border-color: rgba(255, 255, 255, 0.1);
                border-top-color: #e5e5e5;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .analyzer-loading-text {
                font-size: 14px;
                color: #666;
            }

            .dark-mode .analyzer-loading-text {
                color: #999;
            }

            .analyzer-error {
                padding: 16px;
                background: rgba(239, 68, 68, 0.1);
                border-radius: 12px;
                color: #dc2626;
                font-size: 14px;
                line-height: 1.5;
                border-left: 3px solid #dc2626;
            }

            .dark-mode .analyzer-error {
                background: rgba(239, 68, 68, 0.15);
                color: #f87171;
                border-left-color: #f87171;
            }

            .analyzer-empty {
                text-align: center;
                padding: 40px 20px;
                color: #999;
                font-size: 14px;
                line-height: 1.6;
            }

            .analyzer-toggle-btn {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 56px;
                height: 56px;
                background: #1a1a1a;
                color: white;
                border: none;
                border-radius: 28px;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                z-index: 999998;
                transition: all 0.2s;
            }

            .dark-mode .analyzer-toggle-btn {
                background: #e5e5e5;
                color: #1a1a1a;
            }

            .analyzer-toggle-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            .analyzer-toggle-btn.visible {
                display: flex;
            }

            .settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000000;
                display: none;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
            }

            .settings-modal.visible {
                display: flex;
            }

            .settings-modal-content {
                background: white;
                border-radius: 16px;
                padding: 24px;
                width: 90%;
                max-width: 480px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }

            .dark-mode .settings-modal-content {
                background: #1a1a1a;
                color: #e5e5e5;
            }

            .settings-modal-header {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #1a1a1a;
            }

            .dark-mode .settings-modal-header {
                color: #e5e5e5;
            }

            .settings-form-group {
                margin-bottom: 20px;
            }

            .settings-label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 8px;
                color: #333;
            }

            .dark-mode .settings-label {
                color: #d4d4d4;
            }

            .settings-input {
                width: 100%;
                padding: 10px 14px;
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 8px;
                font-size: 14px;
                font-family: 'Courier New', monospace;
                box-sizing: border-box;
            }

            .dark-mode .settings-input {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.15);
                color: #e5e5e5;
            }

            .settings-input:focus {
                outline: none;
                border-color: #1a1a1a;
            }

            .dark-mode .settings-input:focus {
                border-color: #e5e5e5;
            }

            .settings-help {
                font-size: 12px;
                color: #666;
                margin-top: 6px;
            }

            .dark-mode .settings-help {
                color: #999;
            }

            .settings-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }

            .settings-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .settings-btn.primary {
                background: #1a1a1a;
                color: white;
            }

            .dark-mode .settings-btn.primary {
                background: #e5e5e5;
                color: #1a1a1a;
            }

            .settings-btn.primary:hover {
                background: #333;
            }

            .dark-mode .settings-btn.primary:hover {
                background: #fff;
            }

            .settings-btn.secondary {
                background: rgba(0, 0, 0, 0.05);
                color: #333;
            }

            .dark-mode .settings-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #d4d4d4;
            }

            .settings-btn.secondary:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            .dark-mode .settings-btn.secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        `
    document.head.appendChild(style)
  }

  // 创建UI
  function createUI() {
    // 主面板
    const panel = document.createElement("div")
    panel.id = "webpage-analyzer-panel"
    panel.innerHTML = `
            <div class="analyzer-header">
                <div class="analyzer-header-text">
                    <span class="analyzer-icon">🤖</span>
                    <span>智能分析助手</span>
                </div>
                <div class="analyzer-controls">
                    <button class="analyzer-btn" id="analyzer-theme-btn" title="切换主题">🌙</button>
                    <button class="analyzer-btn" id="analyzer-settings-btn" title="设置">⚙️</button>
                    <button class="analyzer-btn primary" id="analyze-btn" title="开始分析">▶️</button>
                    <button class="analyzer-btn" id="analyzer-minimize-btn" title="最小化">−</button>
                    <button class="analyzer-btn close" id="analyzer-close-btn" title="关闭">✕</button>
                </div>
            </div>
            <div class="analyzer-content">
                <div class="analyzer-empty">
                    <p>👋 欢迎使用智能网页分析助手！</p>
                    <p>点击播放按钮开始分析当前页面</p>
                </div>
            </div>
        `
    document.body.appendChild(panel)

    // 切换按钮
    const toggleBtn = document.createElement("button")
    toggleBtn.className = "analyzer-toggle-btn"
    toggleBtn.id = "analyzer-toggle-btn"
    toggleBtn.innerHTML = "🤖"
    toggleBtn.title = "打开分析助手"
    document.body.appendChild(toggleBtn)

    // 绑定事件
    setupEventListeners()

    // 拖动功能
    setupDragging(panel)

    panel.style.display = "none"
    toggleBtn.classList.add("visible")
  }

  // 设置拖拽
  function setupDragging(panel) {
    let isDragging = false
    let currentX
    let currentY
    let initialX
    let initialY

    const header = panel.querySelector(".analyzer-header")

    header.addEventListener("mousedown", (e) => {
      if (e.target.closest(".analyzer-btn")) return

      isDragging = true
      initialX = e.clientX - panel.offsetLeft
      initialY = e.clientY - panel.offsetTop
    })

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault()
        currentX = e.clientX - initialX
        currentY = e.clientY - initialY

        panel.style.left = currentX + "px"
        panel.style.top = currentY + "px"
        panel.style.right = "auto"
      }
    })

    document.addEventListener("mouseup", () => {
      isDragging = false
    })
  }

  // 设置事件监听
  function setupEventListeners() {
    const panel = document.getElementById("webpage-analyzer-panel")
    const toggleBtn = document.getElementById("analyzer-toggle-btn")
    const minimizeBtn = document.getElementById("analyzer-minimize-btn")
    const analyzeBtn = document.getElementById("analyze-btn")
    const themeBtn = document.getElementById("analyzer-theme-btn")
    const settingsBtn = document.getElementById("analyzer-settings-btn")
    const closeBtn = document.getElementById("analyzer-close-btn")

    toggleBtn.addEventListener("click", () => {
      panel.style.display = "block"
      panel.classList.remove("minimized")
      toggleBtn.classList.remove("visible")
    })

    // 最小化
    minimizeBtn.addEventListener("click", () => {
      panel.classList.add("minimized")
      toggleBtn.classList.add("visible")
    })

    closeBtn.addEventListener("click", () => {
      // 关闭设置弹窗
      const settingsModal = document.getElementById("settings-modal")
      if (settingsModal) {
        settingsModal.remove()
      }

      // 隐藏面板
      panel.style.display = "none"

      // 显示切换按钮
      toggleBtn.classList.add("visible")

      // 移除最小化状态
      panel.classList.remove("minimized")
    })

    // 分析按钮
    analyzeBtn.addEventListener("click", async () => {
      await analyzeWebPage()
    })

    // 主题切换
    themeBtn.addEventListener("click", () => {
      panel.classList.toggle("dark-mode")
      toggleBtn.classList.toggle("dark-mode")
      const settingsModal = document.getElementById("settings-modal")
      if (settingsModal) {
        settingsModal.querySelector(".settings-modal-content").parentElement.classList.toggle("dark-mode")
      }

      themeBtn.textContent = panel.classList.contains("dark-mode") ? "☀️" : "🌙"
    })

    // 设置按钮
    settingsBtn.addEventListener("click", () => {
      showSettings()
    })
  }

  // 显示分析结果
  function displayAnalysis(result) {
    const panel = document.getElementById("webpage-analyzer-panel")
    const content = panel.querySelector(".analyzer-content")

    content.innerHTML = `
            <div class="analyzer-section">
                <div class="analyzer-section-title">摘要</div>
                <div class="analyzer-summary">${result.summary}</div>
            </div>
            <div class="analyzer-section">
                <div class="analyzer-section-title">关键点</div>
                <div class="analyzer-key-points">
                    ${result.keyPoints
                      .map(
                        (point, index) => `
                        <div class="key-point">
                            <span class="key-point-bullet">${index + 1}.</span>
                            <span>${point}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            <div class="analyzer-section">
                <div class="analyzer-section-title">类型</div>
                <div class="analyzer-summary">${result.contentType}</div>
            </div>
            <div class="analyzer-section">
                <div class="analyzer-section-title">推荐</div>
                <div class="analyzer-recommendations">
                    ${result.recommendations
                      .map(
                        (recommendation) => `
                        <div class="recommendation-item">
                            <div class="recommendation-name">${recommendation.title}</div>
                            <div class="recommendation-desc">${recommendation.reason}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `
  }

  function showSettings() {
    const modal = document.getElementById("settings-modal")
    if (modal) {
      modal.style.display = "flex"
      return
    }

    const settingsModal = document.createElement("div")
    settingsModal.className = "settings-modal"
    settingsModal.id = "settings-modal"

    const providerOptions = Object.entries(API_PROVIDERS)
      .map(
        ([key, config]) =>
          `<option value="${key}" ${CONFIG.API_PROVIDER === key ? "selected" : ""}>${config.name}${config.note ? " - " + config.note : ""}</option>`,
      )
      .join("")

    const currentProvider = API_PROVIDERS[CONFIG.API_PROVIDER]
    const modelOptions = currentProvider.models
      .map((model) => `<option value="${model}" ${CONFIG.MODEL === model ? "selected" : ""}>${model}</option>`)
      .join("")

    settingsModal.innerHTML = `
            <div class="settings-modal-content">
                <div class="settings-modal-header">API 设置</div>
                
                <div class="settings-form-group">
                    <label class="settings-label">AI 提供商</label>
                    <select class="settings-input" id="api-provider-select">
                        ${providerOptions}
                    </select>
                </div>

                <div class="settings-form-group">
                    <label class="settings-label">模型</label>
                    <select class="settings-input" id="api-model-select">
                        ${modelOptions}
                    </select>
                </div>
                
                <div class="settings-form-group">
                    <label class="settings-label">API Key</label>
                    <input type="password" class="settings-input" id="api-key-input" 
                           placeholder="请输入 API Key" value="${CONFIG.API_KEY}">
                    <div class="settings-help">
                        从 <a href="${currentProvider.helpUrl}" target="_blank" style="color: inherit; text-decoration: underline;" id="api-help-link">${currentProvider.name} 平台</a> 获取您的 API Key
                    </div>
                </div>
                
                <div class="settings-actions">
                    <button class="settings-btn secondary" id="settings-cancel-btn">取消</button>
                    <button class="settings-btn primary" id="settings-save-btn">保存</button>
                </div>
            </div>
        `
    document.body.appendChild(settingsModal)

    const providerSelect = document.getElementById("api-provider-select")
    providerSelect.addEventListener("change", (e) => {
      const selectedProvider = e.target.value
      const provider = API_PROVIDERS[selectedProvider]

      // 更新模型选项
      const modelSelect = document.getElementById("api-model-select")
      modelSelect.innerHTML = provider.models.map((model) => `<option value="${model}">${model}</option>`).join("")

      // 更新帮助链接
      const helpLink = document.getElementById("api-help-link")
      helpLink.href = provider.helpUrl
      helpLink.textContent = `${provider.name} 平台`
    })

    // 保存设置
    document.getElementById("settings-save-btn").addEventListener("click", () => {
      const provider = document.getElementById("api-provider-select").value
      const model = document.getElementById("api-model-select").value
      const apiKey = document.getElementById("api-key-input").value.trim()

      if (!apiKey) {
        alert("请输入 API Key")
        return
      }

      window.GM_setValue("api_provider", provider)
      window.GM_setValue("api_model", model)
      window.GM_setValue("api_key", apiKey)

      CONFIG.API_PROVIDER = provider
      CONFIG.MODEL = model
      CONFIG.API_KEY = apiKey

      settingsModal.style.display = "none"

      // 清除缓存以使用新的API
      clearAllCache()
      alert(`已保存 ${API_PROVIDERS[provider].name} 设置`)
    })

    // 取消按钮
    document.getElementById("settings-cancel-btn").addEventListener("click", () => {
      settingsModal.style.display = "none"
    })

    // 点击外部关闭
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = "none"
      }
    })
  }

  // 初始化
  function init() {
    createStyles()
    createUI()
  }

  init()
})()