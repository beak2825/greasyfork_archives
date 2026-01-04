// ==UserScript==
// @name        DISCOURSE reader
// @namespace   discourse_reader
// @match       https://*/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     0.1.1
// @author      sean908
// @license     GPL-3.0-or-later
// @description DISCOURSE reader 可以帮您实现自动阅读指定主题
// @description:en DISCOURSE reader can help you automatically read specified topics
// @downloadURL https://update.greasyfork.org/scripts/550439/DISCOURSE%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/550439/DISCOURSE%20reader.meta.js
// ==/UserScript==

(function () {
    'use strict'
    // 语言包
    const LANG_PACK = {
        zh: {
            firstTimePrompt: "[ DISCOURSE reader ]\n检测到这是你第一次使用DISCOURSE reader，使用前你必须知晓：使用该第三方脚本可能会导致包括并不限于账号被限制、被封禁的潜在风险，脚本不对出现的任何风险负责，这是一个开源脚本，你可以自由审核其中的内容，如果你同意以上内容，请输入'明白'",
            understand: "明白",
            riskNotAgreed: "您未同意风险提示，脚本已停止运行。",
            notOnTopicPage: "不在帖子页面",
            cannotGetPageInfo: "无法获取页面信息，请确认在正确的帖子页面",
            scriptRunning: "脚本正在运行中...",
            starting: "正在启动...",
            processComplete: "处理完成",
            executionFailed: "执行失败: ",
            userStopped: "用户停止执行",
            stopping: "正在停止...",
            settingsTitle: "DISCOURSE reader 设置",
            baseDelay: "基础延迟(ms):",
            randomDelayRange: "随机延迟范围(ms):",
            minReqSize: "最小每次请求量:",
            maxReqSize: "最大每次请求量:",
            minReadTime: "最小阅读时间(ms):",
            maxReadTime: "最大阅读时间(ms):",
            language: "语言:",
            advancedMode: "高级设置模式",
            autoStart: "自动运行",
            startFromCurrent: "从当前浏览位置开始",
            saveSettings: "保存设置",
            resetDefaults: "重置默认",
            close: "关闭",
            advancedWarning: "高级设置可能增加账号风险，确定要启用吗？",
            settingsSaved: "设置已保存",
            resetToDefaults: "已重置为默认设置",
            confirmReset: "确定要重置为默认设置吗？",
            processing: "处理回复",
            retrying: "重试",
            remaining: "剩余",
            times: "次",
            menuStart: "🚀 开始执行",
            menuSettings: "⚙️ 设置",
            initializationFailed: "初始化失败:",
            loadedMessage: "DISCOURSE reader 已加载",
            topicInfo: "帖子ID:",
            totalReplies: "总回复:"
        },
        en: {
            firstTimePrompt: "[ DISCOURSE reader ]\nThis is your first time using DISCOURSE reader. Please be aware: using this third-party script may result in risks including but not limited to account restriction or ban. The script is not responsible for any risks. This is an open-source script that you can freely review. If you agree to the above, please enter 'OK'",
            understand: "OK",
            riskNotAgreed: "You did not agree to the risk notice. The script has been stopped.",
            notOnTopicPage: "Not on topic page",
            cannotGetPageInfo: "Cannot get page information, please confirm you are on the correct topic page",
            scriptRunning: "Script is running...",
            starting: "Starting...",
            processComplete: "Process completed",
            executionFailed: "Execution failed: ",
            userStopped: "User stopped execution",
            stopping: "Stopping...",
            settingsTitle: "DISCOURSE reader Settings",
            baseDelay: "Base Delay (ms):",
            randomDelayRange: "Random Delay Range (ms):",
            minReqSize: "Min Request Size:",
            maxReqSize: "Max Request Size:",
            minReadTime: "Min Read Time (ms):",
            maxReadTime: "Max Read Time (ms):",
            language: "Language:",
            advancedMode: "Advanced Mode",
            autoStart: "Auto Start",
            startFromCurrent: "Start from Current Position",
            saveSettings: "Save Settings",
            resetDefaults: "Reset Defaults",
            close: "Close",
            advancedWarning: "Advanced settings may increase account risk, are you sure to enable?",
            settingsSaved: "Settings saved",
            resetToDefaults: "Reset to default settings",
            confirmReset: "Are you sure to reset to default settings?",
            processing: "Processing replies",
            retrying: "Retrying",
            remaining: "remaining",
            times: "times",
            menuStart: "🚀 Start",
            menuStop: "⏹️ Stop",
            menuSettings: "⚙️ Settings",
            initializationFailed: "Initialization failed:",
            loadedMessage: "DISCOURSE reader loaded",
            topicInfo: "Topic ID:",
            totalReplies: "Total replies:"
        }
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
        startFromCurrent: false,
        language: 'auto'
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
            startFromCurrent: GM_getValue("startFromCurrent", DEFAULT_CONFIG.startFromCurrent),
            language: GM_getValue("language", DEFAULT_CONFIG.language)
        }
    }

    let config = { ...DEFAULT_CONFIG, ...getStoredConfig() }
    // 获取浏览器语言
    function detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage
        if (browserLang.startsWith('zh')) {
            return 'zh'
        }
        return 'en'
    }

    // 翻译函数
    function t(key) {
        const currentLang = config && config.language && config.language !== 'auto' ? config.language : detectLanguage()
        return LANG_PACK[currentLang]?.[key] || LANG_PACK.en[key] || key
    }

    const hasAgreed = GM_getValue("hasAgreed", false)
    if (!hasAgreed) {
        const userInput = prompt(t('firstTimePrompt'))
        if (userInput !== t('understand')) {
            alert(t('riskNotAgreed'))
            return
        }
        GM_setValue("hasAgreed", true)
    }

    let isRunning = false
    let shouldStop = false
    let statusLabel = null
    let initTimeout = null
    function isTopicPage() {
        return /\/t\/[^\/]+\/\d+/.test(window.location.pathname)
    }

    function getPageInfo() {
        if (!isTopicPage()) {
            throw new Error(t('notOnTopicPage'))
        }
        const topicID = window.location.pathname.split("/")[3]
        const repliesElement = document.querySelector("div[class=timeline-replies]")
        const csrfElement = document.querySelector("meta[name=csrf-token]")

        if (!repliesElement || !csrfElement) {
            throw new Error(t('cannotGetPageInfo'))
        }

        const repliesInfo = repliesElement.textContent.trim()
        const [currentPosition, totalReplies] = repliesInfo.split("/").map(part => parseInt(part.trim(), 10))
        const csrfToken = csrfElement.getAttribute("content")

        return { topicID, currentPosition, totalReplies, csrfToken }
    }


    function saveConfig(newConfig) {
        Object.keys(newConfig).forEach(key => {
            GM_setValue(key, newConfig[key])
            config[key] = newConfig[key]
        })
        // 如果语言设置改变，重新创建状态标签以更新文本
        if (statusLabel) {
            const existingLabel = document.getElementById("readBoostStatusLabel")
            if (existingLabel) {
                existingLabel.remove()
            }
            statusLabel = createStatusLabel()
        }
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
        labelSpan.textContent = "DISCOURSE reader"+" ⚙️"
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
            <h3 style="margin-top: 0; color: var(--primary); text-align: center;">${t('settingsTitle')}</h3>
            <div style="display: grid; gap: 15px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>${t('baseDelay')}</span>
                        <input id="baseDelay" type="number" value="${config.baseDelay}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>${t('randomDelayRange')}</span>
                        <input id="randomDelayRange" type="number" value="${config.randomDelayRange}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>${t('minReqSize')}</span>
                        <input id="minReqSize" type="number" value="${config.minReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>${t('maxReqSize')}</span>
                        <input id="maxReqSize" type="number" value="${config.maxReqSize}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>${t('minReadTime')}</span>
                        <input id="minReadTime" type="number" value="${config.minReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>${t('maxReadTime')}</span>
                        <input id="maxReadTime" type="number" value="${config.maxReadTime}"
                               style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                    </label>
                </div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                    <label style="display: flex; flex-direction: column; gap: 5px;">
                        <span>${t('language')}</span>
                        <select id="language" style="padding: 8px; border: 1px solid var(--primary-low); border-radius: 4px; background: var(--secondary);">
                            <option value="auto" ${config.language === 'auto' ? 'selected' : ''}>Auto (${config.language === 'auto' ? (detectLanguage() === 'zh' ? '中文' : 'English') : (config.language === 'zh' ? '中文' : 'English')})</option>
                            <option value="zh" ${config.language === 'zh' ? 'selected' : ''}>中文</option>
                            <option value="en" ${config.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </label>
                </div>
                <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="advancedMode" style="transform: scale(1.2);">
                        <span>${t('advancedMode')}</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="autoStart" ${autoStartChecked} style="transform: scale(1.2);">
                        <span>${t('autoStart')}</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="startFromCurrent" ${startFromCurrentChecked} style="transform: scale(1.2);">
                        <span>${t('startFromCurrent')}</span>
                    </label>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button id="saveSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #007bff; color: white; cursor: pointer;">${t('saveSettings')}</button>
                    <button id="resetDefaults" style="padding: 10px 20px; border: none; border-radius: 6px; background: #6c757d; color: white; cursor: pointer;">${t('resetDefaults')}</button>
                    <button id="closeSettings" style="padding: 10px 20px; border: none; border-radius: 6px; background: #dc3545; color: white; cursor: pointer;">${t('close')}</button>
                </div>
            </div>
        `

        document.body.appendChild(settingsDiv)

        toggleAdvancedInputs(false)

        document.getElementById("advancedMode").addEventListener("change", (e) => {
            if (e.target.checked) {
                const confirmed = confirm(t('advancedWarning'))
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
                startFromCurrent: document.getElementById("startFromCurrent").checked,
                language: document.getElementById("language").value
            }

            saveConfig(newConfig)
            settingsDiv.remove()
            updateStatus(t('settingsSaved'), "success")

        })

        document.getElementById("resetDefaults").addEventListener("click", () => {
            if (confirm(t('confirmReset'))) {
                saveConfig(DEFAULT_CONFIG)
                settingsDiv.remove()
                updateStatus(t('resetToDefaults'), "info")
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
            updateStatus(t('scriptRunning'), "warning")
            return
        }

        try {
            const pageInfo = getPageInfo()
            isRunning = true
            shouldStop = false

            updateStatus(t('starting'), "running")

            await processReading(pageInfo)

            updateStatus(t('processComplete'), "success")
        } catch (error) {
            console.error("执行错误:", error)
            if (error.message === t('userStopped')) {
                updateStatus("DISCOURSE reader", "info")
            } else {
                updateStatus(t('executionFailed') + error.message, "error")
            }
        } finally {
            isRunning = false
        }
    }


    function stopReading() {
        shouldStop = true
        updateStatus(t('stopping'), "warning")
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
            if (shouldStop) throw new Error(t('userStopped'))

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
                const response = await fetch(`${window.location.origin}/topics/timings`, {
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
                if (shouldStop) throw new Error(t('userStopped'))

                updateStatus(`${t('processing')} ${startId}-${endId} (${Math.round((endId / totalReplies) * 100)}%)`, "running")

            } catch (error) {
                if (shouldStop) throw error // 如果是停止信号，直接抛出

                if (retryCount > 0) {
                    updateStatus(`${t('retrying')} ${startId}-${endId} (${t('remaining')}${retryCount}${t('times')})`, "warning")
                    await new Promise(r => setTimeout(r, 2000))
                    return await sendBatch(startId, endId, retryCount - 1)
                }
                throw error
            }

            // 延迟期间也检查停止信号
            const delay = config.baseDelay + getRandomInt(0, config.randomDelayRange)
            for (let i = 0; i < delay; i += 100) {
                if (shouldStop) throw new Error(t('userStopped'))
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
    GM_registerMenuCommand(t('menuStart'), startReading)
    GM_registerMenuCommand(t('menuStop'), stopReading)
    GM_registerMenuCommand(t('menuSettings'), showSettingsUI)

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
            console.log(t('loadedMessage'))
            console.log(`${t('topicInfo')} ${pageInfo.topicID}, ${t('totalReplies')} ${pageInfo.totalReplies}`)

            statusLabel = createStatusLabel()


            if (config.autoStart) {
                initTimeout = setTimeout(startReading, 1000)
            }

        } catch (error) {
            console.error(t('initializationFailed'), error)
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