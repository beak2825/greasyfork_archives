// ==UserScript==
// @name        LINUXDO&IDCFlare&NodeLoc ReadBoost
// @namespace   linux.do&idcflare&nodeloc_ReadBoost
// @match       https://linux.do/*
// @match       https://idcflare.com/*
// @match       https://www.nodeloc.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     2.2
// @author      Clina
// @description LINUXDO ReadBoost是一个LINUXDO刷取已读帖量脚本，理论上支持所有Discourse论坛
// @description:zh-TW LINUXDO ReadBoost是一個LINUXDO刷取已讀帖量腳本，理論上支持所有Discourse論壇
// @description:en LINUXDO ReadBoost is a script for LINUXDO to boost the number of read posts. It theoretically supports all Discourse forums.
// @downloadURL https://update.greasyfork.org/scripts/560304/LINUXDOIDCFlareNodeLoc%20ReadBoost.user.js
// @updateURL https://update.greasyfork.org/scripts/560304/LINUXDOIDCFlareNodeLoc%20ReadBoost.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // 获取当前域名
    const currentDomain = window.location.hostname

    const hasAgreed = GM_getValue("hasAgreed", false)
    if (!hasAgreed) {
        const userInput = prompt(`[ ${currentDomain.toUpperCase()} ReadBoost ]\n检测到这是你第一次使用 ReadBoost，使用前你必须知晓：使用该第三方脚本可能会导致包括并不限于账号被限制、被封禁的潜在风险，脚本不对出现的任何风险负责，这是一个开源脚本，你可以自由审核其中的内容，如果你同意以上内容，请输入'明白'`)
        if (userInput !== "明白") {
            alert("您未同意风险提示，脚本已停止运行。")
            return
        }
        GM_setValue("hasAgreed", true)
    }

    // 默认参数
    const DEFAULT_CONFIG = {
        baseDelay: 2500,
        randomDelayRange: 800,
        minReqSize: 8,
        maxReqSize: 20,
        minReadTime: 800,
        maxReadTime: 3000,
        autoStart: false,
        startFromCurrent: false
    }

    let config = { ...DEFAULT_CONFIG, ...getStoredConfig() }
    let isRunning = false
    let shouldStop = false
    let statusLabel = null
    let initTimeout = null

    // 根据域名适配不同的URL模式和API端点
    function isTopicPage() {
        const patterns = {
            'linux.do': /^https:\/\/linux\.do\/t\/[^/]+\/\d+/,
            'idcflare.com': /^https:\/\/idcflare\.com\/t\/[^/]+\/\d+/,
            'www.nodeloc.com':/^https:\/\/www\.nodeloc\.com\/t\/[^/]+\/\d+/
        }
        return patterns[currentDomain]?.test(window.location.href) || false
    }

    function getTimingsAPIEndpoint() {
        const endpoints = {
            'linux.do': 'https://linux.do/topics/timings',
            'idcflare.com': 'https://idcflare.com/topics/timings',
            'www.nodeloc.com': 'https://www.nodeloc.com/topics/timings'
        }
        return endpoints[currentDomain] || `https://${currentDomain}/topics/timings`
    }

    function getPageInfo() {
        if (!isTopicPage()) {
            throw new Error("不在帖子页面")
        }
        const topicID = window.location.pathname.split("/")[3]
        const repliesElement = document.querySelector("div[class=timeline-replies]")
        const csrfElement = document.querySelector("meta[name=csrf-token]")

        if (!repliesElement || !csrfElement) {
            throw new Error("无法获取页面信息，请确认在正确的帖子页面")
        }

        const repliesInfo = repliesElement.textContent.trim()
        const [currentPosition, totalReplies] = repliesInfo.split("/").map(part => parseInt(part.trim(), 10))
        const csrfToken = csrfElement.getAttribute("content")

        return { topicID, currentPosition, totalReplies, csrfToken }
    }


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

    function saveConfig(newConfig) {
        Object.keys(newConfig).forEach(key => {
            GM_setValue(key, newConfig[key])
            config[key] = newConfig[key]
        })
        location.reload()
    }

    function createStatusLabel() {
        // 移除已存在的状态标签
        const existingLabel = document.getElementById("readBoostStatusLabel")
        if (existingLabel) {
            existingLabel.remove()
        }

        const headerButtons = document.querySelector(".header-buttons")
        if (!headerButtons) return null

        const labelSpan = document.createElement("span")
        labelSpan.id = "readBoostStatusLabel"
        labelSpan.style.cssText = `
            margin-left: 10px;
            margin-right: 10px;
            padding: 5px 10px;
            border-radius: 4px;
            background: var(--primary-low);
            color: var(--primary);
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
        `
        labelSpan.textContent = "ReadBoost"+" ⚙️"
        labelSpan.addEventListener("click", showSettingsUI)

        headerButtons.appendChild(labelSpan)
        return labelSpan
    }

    // 更新状态
    function updateStatus(text, type = "info") {
        if (!statusLabel) return

        const colors = {
            info: "var(--primary)",
            success: "#2e8b57",
            warning: "#ff8c00",
            error: "#dc3545",
            running: "#007bff"
        }

        statusLabel.textContent = text + " ⚙️"
        statusLabel.style.color = colors[type] || colors.info
    }

    function showSettingsUI() {
        const settingsDiv = document.createElement("div")
        settingsDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 25px;
            border-radius: 12px;
            z-index: 10000;
            background: var(--secondary);
            color: var(--primary);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--primary-low);
            min-width: 400px;
            max-width: 500px;
        `

        const autoStartChecked = config.autoStart ? "checked" : ""
        const startFromCurrentChecked = config.startFromCurrent ? "checked" : ""
        settingsDiv.innerHTML = `
            <h3 style="margin-top: 0; color: var(--primary); text-align: center;">ReadBoost 设置 (${currentDomain})</h3>


            <div style="display: grid; gap: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>基础延迟(ms):</span>
                        <input id="baseDelay" type="number" value="${config.baseDelay}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>随机延迟范围(ms):</span>
                        <input id="randomDelayRange" type="number" value="${config.randomDelayRange}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最小每次请求量:</span>
                        <input id="minReqSize" type="number" value="${config.minReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最大每次请求量:</span>
                        <input id="maxReqSize" type="number" value="${config.maxReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最小阅读时间(ms):</span>
                        <input id="minReadTime" type="number" value="${config.minReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>最大阅读时间(ms):</span>
                        <input id="maxReadTime" type="number" value="${config.maxReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="advancedMode" style="transform: scale(1.2);">
                        <span>高级设置模式</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="autoStart" ${autoStartChecked} style="transform: scale(1.2);">
                        <span>自动运行</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="startFromCurrent" ${startFromCurrentChecked} style="transform: scale(1.2);">
                        <span>从当前浏览位置开始</span>
                    </label>
                </div>
                    <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;"><p>由 <a href="https://linux.do/u/adodo/summary">@adodo</a> 开发</p><br/>
                    <p><a href="https://wuyuan.dev">@Sunwuyuan</a></p><p><a href="https://150191.xyz">@Clina</a></p>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button id="saveSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #007bff; color: white; cursor: pointer;">保存设置</button>
                    <button id="resetDefaults" style="padding: 10px 20px; border: none; border-radius: 6px; background: #6c757d; color: white; cursor: pointer;">重置默认</button>
                    <button id="closeSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #dc3545; color: white; cursor: pointer;">关闭</button>
                </div>
            </div>
        `

        document.body.appendChild(settingsDiv)

        toggleAdvancedInputs(false)

        document.getElementById("advancedMode").addEventListener("change", (e) => {
            if (e.target.checked) {
                const confirmed = confirm("高级设置可能增加账号风险，确定要启用吗？")
                if (!confirmed) {
                    e.target.checked = false
                    return
                }
            }
            toggleAdvancedInputs(e.target.checked)
        })

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
            settingsDiv.remove()
            updateStatus("设置已保存", "success")

        })

        document.getElementById("resetDefaults").addEventListener("click", () => {
            if (confirm("确定要重置为默认设置吗？")) {
                saveConfig(DEFAULT_CONFIG)
                settingsDiv.remove()
                updateStatus("已重置为默认设置", "info")
            }
        })

        document.getElementById("closeSettings").addEventListener("click", () => {
            settingsDiv.remove()
        })

        function toggleAdvancedInputs(enabled) {
            const inputs = ["baseDelay", "randomDelayRange", "minReqSize", "maxReqSize", "minReadTime", "maxReadTime"]
            inputs.forEach(id => {
                const input = document.getElementById(id)
                if (input) {
                    input.disabled = !enabled
                    input.style.opacity = enabled ? "1" : "0.6"
                }
            })
        }
    }

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

            await processReading(pageInfo)

            updateStatus("处理完成", "success")
        } catch (error) {
            console.error("执行错误:", error)
            if (error.message === "用户停止执行") {
                updateStatus("ReadBoost", "info")
            } else {
                updateStatus("执行失败: " + error.message, "error")
            }
        } finally {
            isRunning = false
        }
    }


    function stopReading() {
        shouldStop = true
        updateStatus("正在停止...", "warning")
    }

    // 处理阅读逻辑
    async function processReading(pageInfo) {
        const { topicID, currentPosition, totalReplies, csrfToken } = pageInfo
        const startPosition = config.startFromCurrent ? currentPosition : 1

        console.log(`开始处理，起始位置: ${startPosition}, 总回复: ${totalReplies}`)

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        async function sendBatch(startId, endId, retryCount = 3) {
            // 停止检查
            if (shouldStop) throw new Error("用户停止执行")

            const params = new URLSearchParams()

            for (let i = startId; i <= endId; i++) {
                params.append(`timings[${i}]`, getRandomInt(config.minReadTime, config.maxReadTime).toString())
            }

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

                updateStatus(`处理回复 ${startId}-${endId} (${Math.round((endId / totalReplies) * 100)}%)`, "running")

            } catch (error) {
                if (shouldStop) throw error // 如果是停止信号，直接抛出

                if (retryCount > 0) {
                    updateStatus(`重试 ${startId}-${endId} (剩余${retryCount}次)`, "warning")
                    await new Promise(r => setTimeout(r, 2000))
                    return await sendBatch(startId, endId, retryCount - 1)
                }
                throw error
            }

            // 延迟期间也检查停止信号
            const delay = config.baseDelay + getRandomInt(0, config.randomDelayRange)
            for (let i = 0; i < delay; i += 100) {
                if (shouldStop) throw new Error("用户停止执行")
                await new Promise(r => setTimeout(r, Math.min(100, delay - i)))
            }
        }

        // 批量处理
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

    function init() {
        statusLabel = createStatusLabel()
        // 强制停止之前的任务
        shouldStop = true

        // 等待当前任务停止后再继续
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
        if (!isTopicPage()) return

        try {
            const pageInfo = getPageInfo()
            console.log(`${currentDomain.toUpperCase()} ReadBoost 已加载`)
            console.log(`帖子ID: ${pageInfo.topicID}, 总回复: ${pageInfo.totalReplies}`)

            statusLabel = createStatusLabel()


            if (config.autoStart) {
                initTimeout = setTimeout(startReading, 1000)
            }

        } catch (error) {
            console.error("初始化失败:", error)
            initTimeout = setTimeout(init, 1000)
        }
    }
    // 监听 URL 变化
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
    }
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
