// ==UserScript==
// @name        Qingju ReadBoost
// @namespace   qingju_ReadBoost
// @match       https://qingju.me/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     1.0
// @license MIT
// @author      顶尖程序员（为您服务）
// @description Qingju ReadBoost是专为qingju.me论坛设计的自动阅读脚本，模拟真实阅读行为，安全稳定
// @description:zh-TW Qingju ReadBoost是專為qingju.me論壇設計的自動閱讀腳本，模擬真實閱讀行為，安全穩定
// @description:en Qingju ReadBoost is an auto-reading script specifically designed for the qingju.me forum, simulating real reading behavior, safe and stable
// @downloadURL https://update.greasyfork.org/scripts/560140/Qingju%20ReadBoost.user.js
// @updateURL https://update.greasyfork.org/scripts/560140/Qingju%20ReadBoost.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // 域名验证
    const currentDomain = window.location.hostname
    if (currentDomain !== 'qingju.me') {
        console.log('[Qingju ReadBoost] 不是qingju.me域名，脚本停止')
        return
    }

    // 风险提示（仅首次运行）
    const hasAgreed = GM_getValue("hasAgreed", false)
    if (!hasAgreed) {
        const userInput = prompt(`[ Qingju ReadBoost ]\n检测到这是你第一次使用，使用前请知晓：\n\n1. 使用第三方脚本可能违反论坛规则\n2. 账号存在被限制或封禁的风险\n3. 脚本开发者不承担任何责任\n\n如果你理解并接受风险，请输入"明白"`)
        if (userInput !== "明白") {
            alert("您未同意风险提示，脚本已停止运行。")
            return
        }
        GM_setValue("hasAgreed", true)
    }

    // 默认配置
    const DEFAULT_CONFIG = {
        baseDelay: 2800,
        randomDelayRange: 1200,
        minReqSize: 6,
        maxReqSize: 15,
        minReadTime: 1000,
        maxReadTime: 3500,
        autoStart: false,
        startFromCurrent: false
    }

    let config = { ...DEFAULT_CONFIG, ...getStoredConfig() }
    let isRunning = false
    let shouldStop = false
    let statusLabel = null
    let initTimeout = null

    // 检查是否是帖子页面
    function isTopicPage() {
        // Discourse帖子URL模式: /t/主题标题/主题ID
        return /^https:\/\/qingju\.me\/t\/[^/]+\/\d+/.test(window.location.href)
    }

    // 获取API端点
    function getTimingsAPIEndpoint() {
        return 'https://qingju.me/topics/timings'
    }

    // 获取页面信息
    function getPageInfo() {
        if (!isTopicPage()) {
            throw new Error("不在帖子页面")
        }

        // 获取主题ID
        const pathParts = window.location.pathname.split("/")
        const topicID = pathParts[2] // /t/标题/ID -> ID是第3部分

        // 获取当前进度和总回复数
        // Discourse通常在 .timeline-replies 或类似元素中显示 "1/50"
        const repliesElement = document.querySelector(".timeline-replies, .topic-map .numbers, [class*='replies']")
        
        // 获取CSRF Token
        const csrfElement = document.querySelector("meta[name=csrf-token]")

        if (!repliesElement || !csrfElement) {
            throw new Error("无法获取页面信息，请确认在正确的帖子页面")
        }

        const repliesInfo = repliesElement.textContent.trim()
        // 解析 "1/50" 或 "1 of 50" 格式
        const match = repliesInfo.match(/(\d+)\D+(\d+)/)
        if (!match) {
            throw new Error("无法解析回复数")
        }
        
        const currentPosition = parseInt(match[1], 10)
        const totalReplies = parseInt(match[2], 10)
        const csrfToken = csrfElement.getAttribute("content")

        return { topicID, currentPosition, totalReplies, csrfToken }
    }

    // 获取存储的配置
    function getStoredConfig() {
        return {
            baseDelay: GM_getValue("baseDelay", DEFAULT_CONFIG.baseDelay),
            randomDelayRange: GM_getValue("randomDelayRange", DEFAULT_CONFIG.randomDelayRange),
            minReqSize: GM_getValue("minReqSize", DEFAULT_CONFIG.minReqSize),
            maxReqSize: GM_getValue("maxReqSize", DEFAULT_CONFIG.maxReqSize),
            minReadTime: GM_getValue("minReadTime", DEFAULT_CONFIG.minReadTime),
            maxReadTime: GM_getValue("maxReadTime", DEFAULT_CONFIG.maxReadTime),
            autoStart: GM_getValue("autoStart", DEFAULT_CONFIG.autoStart),
            startFromCurrent: GM_getValue("startFromCurrent", DEFAULT_CONFIG.startFromCurrent)
        }
    }

    // 保存配置
    function saveConfig(newConfig) {
        Object.keys(newConfig).forEach(key => {
            GM_setValue(key, newConfig[key])
            config[key] = newConfig[key]
        })
        location.reload()
    }

    // 创建状态标签
    function createStatusLabel() {
        const existingLabel = document.getElementById("qingjuReadBoostStatusLabel")
        if (existingLabel) {
            existingLabel.remove()
        }

        // 在顶部导航栏创建状态标签
        const headerButtons = document.querySelector(".header-buttons")
        if (!headerButtons) return null

        const labelSpan = document.createElement("span")
        labelSpan.id = "qingjuReadBoostStatusLabel"
        labelSpan.style.cssText = `
            margin-left: 10px;
            margin-right: 10px;
            padding: 6px 12px;
            border-radius: 6px;
            background: var(--primary-low, #e8f4fd);
            color: var(--primary, #1b6dce);
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            border: 1px solid var(--primary, #1b6dce);
            transition: all 0.2s;
        `
        labelSpan.textContent = "QingjuBoost ⚙️"
        labelSpan.addEventListener("mouseenter", () => {
            labelSpan.style.transform = "scale(1.05)"
            labelSpan.style.boxShadow = "0 2px 8px rgba(27, 109, 206, 0.3)"
        })
        labelSpan.addEventListener("mouseleave", () => {
            labelSpan.style.transform = "scale(1)"
            labelSpan.style.boxShadow = "none"
        })
        labelSpan.addEventListener("click", showSettingsUI)

        headerButtons.appendChild(labelSpan)
        return labelSpan
    }

    // 更新状态显示
    function updateStatus(text, type = "info") {
        if (!statusLabel) return

        const colors = {
            info: "#1b6dce",
            success: "#2e8b57",
            warning: "#ff8c00",
            error: "#dc3545",
            running: "#007bff"
        }

        statusLabel.textContent = text + " ⚙️"
        statusLabel.style.color = colors[type] || colors.info
        statusLabel.style.background = type === "running" ? "#e7f3ff" : "var(--primary-low, #e8f4fd)"
    }

    // 显示设置界面
    function showSettingsUI() {
        const overlay = document.createElement("div")
        overlay.id = "qingjuSettingsOverlay"
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `

        const settingsDiv = document.createElement("div")
        settingsDiv.style.cssText = `
            background: var(--secondary, #ffffff);
            color: var(--primary, #1b6dce);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--primary-low, #e8f4fd);
            min-width: 450px;
            max-width: 550px;
            max-height: 85vh;
            overflow-y: auto;
        `

        const autoStartChecked = config.autoStart ? "checked" : ""
        const startFromCurrentChecked = config.startFromCurrent ? "checked" : ""
        
        settingsDiv.innerHTML = `
            <h3 style="margin-top: 0; color: var(--primary); text-align: center; border-bottom: 2px solid var(--primary-low); padding-bottom: 10px;">
                Qingju ReadBoost 设置
            </h3>

            <div style="display: grid; gap: 15px; margin-top: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="font-weight: 600;">基础延迟(ms):</span>
                        <input id="baseDelay" type="number" value="${config.baseDelay}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary); color: var(--primary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="font-weight: 600;">随机延迟范围(ms):</span>
                        <input id="randomDelayRange" type="number" value="${config.randomDelayRange}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary); color: var(--primary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="font-weight: 600;">最小每次请求量:</span>
                        <input id="minReqSize" type="number" value="${config.minReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary); color: var(--primary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="font-weight: 600;">最大每次请求量:</span>
                        <input id="maxReqSize" type="number" value="${config.maxReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary); color: var(--primary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="font-weight: 600;">最小阅读时间(ms):</span>
                        <input id="minReadTime" type="number" value="${config.minReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary); color: var(--primary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span style="font-weight: 600;">最大阅读时间(ms):</span>
                        <input id="maxReadTime" type="number" value="${config.maxReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary); color: var(--primary);">
                    </label>
                </div>
                <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap; padding: 10px 0; border-top: 1px solid var(--primary-low); border-bottom: 1px solid var(--primary-low);">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="autoStart" ${autoStartChecked} style="transform: scale(1.2);">
                        <span>自动运行</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="startFromCurrent" ${startFromCurrentChecked} style="transform: scale(1.2);">
                        <span>从当前位置开始</span>
                    </label>
                </div>
                <div style="font-size: 12px; color: #666; text-align: center; padding: 10px 0;">
                    <p>专为 <strong>qingju.me</strong> 优化 | 安全第一</p>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button id="saveSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #2e8b57; color: white; cursor: pointer; font-weight: bold;">💾 保存设置</button>
                    <button id="resetDefaults" style="padding: 10px 20px; border: none; border-radius: 6px; background: #6c757d; color: white; cursor: pointer;">🔄 重置默认</button>
                    <button id="closeSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #dc3545; color: white; cursor: pointer;">❌ 关闭</button>
                </div>
            </div>
        `

        overlay.appendChild(settingsDiv)
        document.body.appendChild(overlay)

        // 关闭设置
        function closeSettings() {
            overlay.remove()
        }

        // 保存设置
        document.getElementById("saveSettings").addEventListener("click", () => {
            const newConfig = {
                baseDelay: parseInt(document.getElementById("baseDelay").value, 10),
                randomDelayRange: parseInt(document.getElementById("randomDelayRange").value, 10),
                minReqSize: parseInt(document.getElementById("minReqSize").value, 10),
                maxReqSize: parseInt(document.getElementById("maxReqSize").value, 10),
                minReadTime: parseInt(document.getElementById("minReadTime").value, 10),
                maxReadTime: parseInt(document.getElementById("maxReadTime").value, 10),
                autoStart: document.getElementById("autoStart").checked,
                startFromCurrent: document.getElementById("startFromCurrent").checked
            }

            saveConfig(newConfig)
            closeSettings()
            updateStatus("设置已保存", "success")
        })

        // 重置默认
        document.getElementById("resetDefaults").addEventListener("click", () => {
            if (confirm("确定要重置为默认设置吗？")) {
                saveConfig(DEFAULT_CONFIG)
                closeSettings()
                updateStatus("已重置为默认", "info")
            }
        })

        // 关闭按钮
        document.getElementById("closeSettings").addEventListener("click", closeSettings)

        // 点击遮罩层关闭
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeSettings()
            }
        })
    }

    // 开始阅读
    async function startReading() {
        if (isRunning) {
            updateStatus("脚本正在运行中...", "warning")
            return
        }

        try {
            const pageInfo = getPageInfo()
            isRunning = true
            shouldStop = false

            updateStatus("正在启动...", "running")
            console.log(`[QingjuBoost] 开始处理 - 主题ID: ${pageInfo.topicID}, 总回复: ${pageInfo.totalReplies}`)

            await processReading(pageInfo)

            if (!shouldStop) {
                updateStatus("处理完成", "success")
                console.log(`[QingjuBoost] 处理完成`)
            }
        } catch (error) {
            console.error("[QingjuBoost] 执行错误:", error)
            if (error.message === "用户停止执行") {
                updateStatus("已停止", "info")
            } else {
                updateStatus("执行失败: " + error.message, "error")
            }
        } finally {
            isRunning = false
        }
    }

    // 停止阅读
    function stopReading() {
        if (!isRunning) {
            updateStatus("脚本未运行", "info")
            return
        }
        shouldStop = true
        updateStatus("正在停止...", "warning")
    }

    // 处理阅读逻辑
    async function processReading(pageInfo) {
        const { topicID, currentPosition, totalReplies, csrfToken } = pageInfo
        const startPosition = config.startFromCurrent ? currentPosition : 1

        console.log(`[QingjuBoost] 起始位置: ${startPosition}, 总回复: ${totalReplies}`)

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        async function sendBatch(startId, endId, retryCount = 3) {
            // 停止检查
            if (shouldStop) throw new Error("用户停止执行")

            const params = new URLSearchParams()

            // 构建timings参数
            for (let i = startId; i <= endId; i++) {
                params.append(`timings[${i}]`, getRandomInt(config.minReadTime, config.maxReadTime).toString())
            }

            // 计算主题总阅读时间
            const topicTime = getRandomInt(
                config.minReadTime * (endId - startId + 1),
                config.maxReadTime * (endId - startId + 1)
            ).toString()

            params.append('topic_time', topicTime)
            params.append('topic_id', topicID)

            try {
                const response = await fetch(getTimingsAPIEndpoint(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-CSRF-Token": csrfToken,
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: params,
                    credentials: "include"
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                // 再次检查是否应该停止
                if (shouldStop) throw new Error("用户停止执行")

                const progress = Math.round((endId / totalReplies) * 100)
                updateStatus(`处理 ${startId}-${endId} (${progress}%)`, "running")
                console.log(`[QingjuBoost] 处理回复 ${startId}-${endId}，进度 ${progress}%`)

            } catch (error) {
                if (shouldStop) throw error

                if (retryCount > 0) {
                    updateStatus(`重试 ${startId}-${endId} (剩余${retryCount}次)`, "warning")
                    console.log(`[QingjuBoost] 请求失败，重试中...`)
                    await new Promise(r => setTimeout(r, 2000))
                    return await sendBatch(startId, endId, retryCount - 1)
                }
                throw error
            }

            // 延迟期间也检查停止信号
            const delay = config.baseDelay + getRandomInt(0, config.randomDelayRange)
            console.log(`[QingjuBoost] 等待 ${delay}ms 后继续...`)
            
            for (let i = 0; i < delay; i += 100) {
                if (shouldStop) throw new Error("用户停止执行")
                await new Promise(r => setTimeout(r, Math.min(100, delay - i)))
            }
        }

        // 批量处理循环
        for (let i = startPosition; i <= totalReplies;) {
            if (shouldStop) break

            const batchSize = getRandomInt(config.minReqSize, config.maxReqSize)
            const startId = i
            const endId = Math.min(i + batchSize - 1, totalReplies)

            await sendBatch(startId, endId)
            i = endId + 1
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand("🚀 开始执行", startReading)
    GM_registerMenuCommand("⏹️ 停止执行", stopReading)
    GM_registerMenuCommand("⚙️ 设置", showSettingsUI)

    // 初始化函数
    function init() {
        // 强制停止之前的任务
        shouldStop = true

        // 等待当前任务停止
        if (isRunning) {
            setTimeout(init, 1000)
            return
        }

        // 重置状态
        isRunning = false
        shouldStop = false

        // 清除之前的超时
        if (initTimeout) {
            clearTimeout(initTimeout)
        }

        // 检查是否是帖子页面
        if (!isTopicPage()) {
            // 移除现有的状态标签（如果存在）
            const existingLabel = document.getElementById("qingjuReadBoostStatusLabel")
            if (existingLabel) {
                existingLabel.remove()
            }
            return
        }

        try {
            const pageInfo = getPageInfo()
            console.log(`[QingjuBoost] 已加载 - 主题ID: ${pageInfo.topicID}, 总回复: ${pageInfo.totalReplies}`)

            // 创建状态标签
            statusLabel = createStatusLabel()
            if (statusLabel) {
                updateStatus("QingjuBoost", "info")
            }

            // 如果设置了自动运行，延迟启动
            if (config.autoStart) {
                console.log(`[QingjuBoost] 自动启动模式已开启，1秒后开始...`)
                initTimeout = setTimeout(() => {
                    startReading()
                }, 1000)
            }

        } catch (error) {
            console.error("[QingjuBoost] 初始化失败:", error)
            // 1秒后重试
            initTimeout = setTimeout(init, 1000)
        }
    }

    // 监听 URL 变化（用于单页应用导航）
    function setupRouteListener() {
        let lastUrl = location.href
        const originalPushState = history.pushState
        history.pushState = function () {
            originalPushState.apply(history, arguments)
            if (location.href !== lastUrl) {
                lastUrl = location.href
                setTimeout(init, 500)
            }
        }
        
        // 也监听 popstate 事件（浏览器前进后退）
        window.addEventListener('popstate', () => {
            setTimeout(init, 500)
        })
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init()
            setupRouteListener()
        })
    } else {
        init()
        setupRouteListener()
    }

})()
