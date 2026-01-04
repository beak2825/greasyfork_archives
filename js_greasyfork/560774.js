// ==UserScript==
// @name         linuxdo保活
// @namespace    http://tampermonkey.net/
// @version      0.2.5.6
// @description  linuxdo自动浏览帖子，自动点赞
// @author       oxzk
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/560774-linuxdo%E4%BF%9D%E6%B4%BB
// @downloadURL https://update.greasyfork.org/scripts/560774/linuxdo%E4%BF%9D%E6%B4%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/560774/linuxdo%E4%BF%9D%E6%B4%BB.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // ==================== 配置 ====================
    const CONFIG = {
        scroll: {
            interval: 1200, // 滚动间隔(毫秒)
            step: 600, // 每次滚动像素
            duration: 30, // 滚动持续时间(秒)
        },
        limits: {
            maxTopics: 500, // 最大浏览帖子数
            maxLikesPerPost: 1, // 每帖最大点赞数
            likeInterval: 3000, // 点赞间隔(毫秒)
            maxRunTime: 600, // 最大运行时间(分钟)
            browseTimeout: 60000, // 单帖浏览超时(毫秒)
        },
        urls: {
            base: 'https://linux.do/new',
        },
        iframe: {
            width: '50%',
            height: '100%',
            top: '0px',
            left: '0px',
            position: 'fixed',
            zIndex: '9999',
        },
        logging: {
            enabled: true,
            levels: { error: true, warn: true, info: true, debug: false },
        },
        storage: {
            stats: 'linuxdoStats',
            enabled: 'linuxdoHelperEnabled',
        },
    }

    // ==================== 工具函数 ====================
    const utils = {
        // 延时函数
        sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

        // 随机延时
        randomSleep: (maxMs) => utils.sleep(Math.floor(Math.random() * maxMs) + 1000),

        // Promise 超时包装
        withTimeout: (promise, ms) =>
            Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('操作超时')), ms))]),

        // 格式化时间
        formatDuration: (seconds) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return `${h}时${m}分${s}秒`
        },

        // 解析浏览量
        parseViewCount: (text) => {
            const match = text?.match(/此话题已被浏览\s*([\d,]+)\s*次/)
            return match ? parseInt(match[1].replace(/,/g, '')) : 0
        },

        // 数组随机打乱
        shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
    }

    // ==================== 日志模块 ====================
    const logger = {
        _log: (level, ...args) => {
            if (CONFIG.logging.enabled && CONFIG.logging.levels[level]) {
                const method =
                    level === 'error' ? 'error' : level === 'warn' ? 'warn' : level === 'debug' ? 'debug' : 'log'
                console[method](`[LinuxDo助手]`, ...args)
            }
        },
        error: (...args) => logger._log('error', '❌', ...args),
        warn: (...args) => logger._log('warn', '⚠️', ...args),
        info: (...args) => logger._log('info', ...args),
        debug: (...args) => logger._log('debug', '🔍', ...args),
    }

    // ==================== 统计模块 ====================
    const stats = {
        totalViews: 0,
        totalLikes: 0,
        sessionViews: 0,
        sessionLikes: 0,
        startTime: Date.now(),
        lastResetDate: '', // 上次重置日期

        load() {
            const saved = GM_getValue(CONFIG.storage.stats, {})
            const today = new Date().toDateString()

            // 检查是否跨天，需要重置
            if (saved.lastResetDate && saved.lastResetDate !== today) {
                logger.info('🔄 新的一天，重置统计数据')
                this.totalViews = 0
                this.totalLikes = 0
                this.sessionViews = 0
                this.sessionLikes = 0
                this.startTime = Date.now()
            } else {
                this.totalViews = saved.totalViews || 0
                this.totalLikes = saved.totalLikes || 0
                this.sessionViews = saved.sessionViews || 0
                this.sessionLikes = saved.sessionLikes || 0
                this.startTime = saved.startTime || Date.now()
            }

            this.lastResetDate = today
            this.save()
            logger.info('📊 今日统计 - 浏览:', this.totalViews, '点赞:', this.totalLikes)
        },

        save() {
            GM_setValue(CONFIG.storage.stats, {
                totalViews: this.totalViews,
                totalLikes: this.totalLikes,
                sessionViews: this.sessionViews,
                sessionLikes: this.sessionLikes,
                startTime: this.startTime,
                lastResetDate: this.lastResetDate,
            })
        },

        addView() {
            this.sessionViews++
            this.totalViews++
            this.save()
        },

        addLike() {
            this.sessionLikes++
            this.totalLikes++
            this.save()
        },

        getRunTime() {
            return Math.floor((Date.now() - this.startTime) / 1000)
        },

        print() {
            logger.info('\n📊 统计信息')
            logger.info('-------------------')
            logger.info(`🕒 运行时间：${utils.formatDuration(this.getRunTime())}`)
            logger.info(`👀 本次浏览：${this.sessionViews}帖`)
            logger.info(`❤️ 本次点赞：${this.sessionLikes}次`)
            logger.info(`📈 总浏览数：${this.totalViews}帖`)
            logger.info(`💖 总点赞数：${this.totalLikes}次`)
            logger.info('-------------------\n')
        },
    }

    // ==================== 开关控制 ====================
    const switchControl = {
        get enabled() {
            return GM_getValue(CONFIG.storage.enabled, false)
        },

        set enabled(value) {
            GM_setValue(CONFIG.storage.enabled, value)
        },

        toggle() {
            const newState = !this.enabled
            this.enabled = newState
            logger.info(`助手已${newState ? '启用' : '禁用'}`)
            if (newState) {
                window.location.href = CONFIG.urls.base
            }
            return newState
        },
    }

    // ==================== UI 模块 ====================
    const ui = {
        link: null,
        use: null,
        statsPanel: null,
        statsTimer: null,

        updateIcon(enabled) {
            if (this.use) {
                this.use.setAttribute('href', enabled ? '#pause' : '#play')
            }
            if (this.link) {
                this.link.title = enabled ? '停止助手' : '启动助手'
                this.link.classList.toggle('active', enabled)
            }
            // 显示/隐藏统计面板
            if (enabled) {
                this.showStatsPanel()
            } else {
                this.hideStatsPanel()
            }
        },

        createStatsPanel() {
            if (this.statsPanel) return

            this.statsPanel = document.createElement('div')
            this.statsPanel.id = 'linuxdo-stats-panel'
            this.statsPanel.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 13px;
                line-height: 1.6;
                z-index: 10000;
                min-width: 160px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                display: none;
            `
            document.body.appendChild(this.statsPanel)
        },

        updateStatsPanel() {
            if (!this.statsPanel) return

            // 检查 429 限制是否已过期，自动恢复
            if (core.likeLimited && core.likeLimitedUntil && Date.now() >= core.likeLimitedUntil) {
                core.likeLimited = false
                core.likeLimitedWaitTime = ''
                core.likeLimitedUntil = 0
                logger.info('✅ 点赞限制已解除，恢复点赞')
            }

            // 构建 429 限制提示（带倒计时）
            let limitInfo = ''
            if (core.likeLimited) {
                let countdown = ''
                if (core.likeLimitedUntil) {
                    const remaining = Math.max(0, Math.ceil((core.likeLimitedUntil - Date.now()) / 1000))
                    countdown = ` (${utils.formatDuration(remaining)})`
                }
                limitInfo = `<div style="color: #ff6b6b; margin-top: 6px;">🚫 点赞受限${countdown}</div>`
            }

            this.statsPanel.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 6px;">📊 LinuxDo助手</div>
                <div>🕒 运行: ${utils.formatDuration(stats.getRunTime())}</div>
                <div>👀 浏览: ${stats.sessionViews}/${CONFIG.limits.maxTopics}</div>
                <div>❤️ 点赞: ${stats.sessionLikes}</div>
                <div>📈 总浏览: ${stats.totalViews}</div>
                <div>💖 总点赞: ${stats.totalLikes}</div>
                ${limitInfo}
            `
        },

        showStatsPanel() {
            this.createStatsPanel()
            this.statsPanel.style.display = 'block'
            this.updateStatsPanel()
            // 每秒更新
            if (!this.statsTimer) {
                this.statsTimer = setInterval(() => this.updateStatsPanel(), 1000)
            }
        },

        hideStatsPanel() {
            if (this.statsPanel) {
                this.statsPanel.style.display = 'none'
            }
            if (this.statsTimer) {
                clearInterval(this.statsTimer)
                this.statsTimer = null
            }
        },

        createSwitchIcon() {
            const container = document.getElementById('toggle-current-user')?.parentElement
            if (!container) {
                logger.error('未找到导航栏容器')
                return
            }

            const li = document.createElement('li')
            li.className = 'header-dropdown-toggle linux-do-tools'

            this.link = document.createElement('a')
            this.link.href = 'javascript:void(0)'
            this.link.className = 'btn no-text icon btn-flat'
            this.link.tabIndex = 0

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            svg.setAttribute('class', 'fa d-icon svg-icon prefix-icon svg-string')

            this.use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

            this.updateIcon(switchControl.enabled)
            svg.appendChild(this.use)
            this.link.appendChild(svg)
            li.appendChild(this.link)

            this.link.addEventListener('click', () => {
                this.updateIcon(switchControl.toggle())
            })

            container.parentNode.insertBefore(li, container.nextSibling)
        },
    }

    // ==================== 核心功能 ====================
    const core = {
        currentIframe: null,
        popstateHandler: null,
        likeLimited: false, // 429 限制标志
        likeLimitedWaitTime: '', // 429 等待时间（显示用）
        likeLimitedUntil: 0, // 429 限制解除时间戳

        // 检查是否应停止
        shouldStop() {
            if (stats.sessionViews >= CONFIG.limits.maxTopics) {
                logger.info(`🛑 已达最大浏览数 ${CONFIG.limits.maxTopics}`)
                return true
            }
            if (stats.getRunTime() >= CONFIG.limits.maxRunTime * 60) {
                logger.info(`🛑 已达最大运行时间 ${CONFIG.limits.maxRunTime}分钟`)
                return true
            }
            return false
        },

        // 停止脚本
        stop() {
            switchControl.enabled = false
            stats.print()
            logger.info('✨ 脚本已停止')
        },

        // 获取帖子列表
        getTopics() {
            const topics = []
            const elements = document.querySelectorAll('#list-area .title')

            elements.forEach((el) => {
                const row = el.closest('tr')
                if (!row || row.querySelector('.topic-statuses .pinned')) return

                const viewsEl = row.querySelector('.num.views .number')
                const viewsTitle = viewsEl?.getAttribute('title') || ''

                topics.push({
                    title: el.textContent.trim(),
                    url: el.href,
                    views: utils.parseViewCount(viewsTitle),
                })
            })

            logger.info(`📋 找到 ${topics.length} 个帖子`)
            return topics
        },

        // 点赞操作
        async likePost(targetWindow) {
            if (this.likeLimited) {
                logger.warn('点赞已被限制(429)，跳过')
                return
            }

            const doc = targetWindow.document
            const csrfToken = doc.querySelector('meta[name="csrf-token"]')?.content
            if (!csrfToken) {
                logger.warn('未找到 CSRF token，跳过点赞')
                return
            }

            // 筛选可点赞的帖子
            const likeable = [...doc.querySelectorAll('button.btn-toggle-reaction-like')]
                .filter((btn) => btn.title.includes('点赞此帖子'))
                .map((btn) => btn.closest('article[data-post-id]')?.dataset?.postId)
                .filter(Boolean)
                .slice(0, CONFIG.limits.maxLikesPerPost)

            if (!likeable.length) {
                logger.debug('无可点赞帖子')
                return
            }

            for (const postId of likeable) {
                if (this.likeLimited) break

                const ok = await this.sendLike(postId, csrfToken, targetWindow)
                if (ok) {
                    stats.addLike()
                    logger.info('👍 点赞成功')
                }
                if(CONFIG.limits.maxLikesPerPost > 1){
	                await utils.randomSleep(CONFIG.limits.likeInterval)
	              }
            }
        },

        // 发送点赞请求（使用 iframe 的 fetch 绕过5秒盾）
        async sendLike(postId, csrfToken, targetWindow) {
            try {
                // 使用 iframe 的 fetch，复用已通过 CF 验证的会话
                const fetchFn = targetWindow?.fetch || fetch
                const response = await fetchFn.call(
                    targetWindow || window,
                    `https://linux.do/discourse-reactions/posts/${postId}/custom-reactions/heart/toggle.json`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': csrfToken,
                        },
                        credentials: 'include',
                    }
                )

                if (response.status === 429) {
                    let waitTime = ''
                    let waitSeconds = 0
                    try {
                        const text = await response.text()
                        const match = text.match(/(\d+)\s*(分钟|小时|秒)后/)
                        if (match) {
                            const num = parseInt(match[1])
                            const unit = match[2]
                            waitTime = `${num} ${unit}后`
                            // 转换为秒
                            waitSeconds = unit === '小时' ? num * 3600 : unit === '分钟' ? num * 60 : num
                        }
                    } catch {}

                    this.likeLimited = true
                    this.likeLimitedWaitTime = waitTime || '未知'
                    this.likeLimitedUntil = waitSeconds ? Date.now() + waitSeconds * 1000 : 0
                    logger.warn(`🚫 点赞频率限制(429)，${waitTime ? waitTime + '可恢复' : '后续不再点赞'}`)
                    return false
                }

                if (!response.ok) {
                    logger.warn(`点赞失败: ${response.status}`)
                    return false
                }
                return true
            } catch (e) {
                logger.error('点赞请求失败:', e.message)
                return false
            }
        },

        // 浏览单个帖子
        async browseTopic(topic) {
            logger.info(`📖 浏览: ${topic.title}`)
            stats.addView()

            const iframe = document.createElement('iframe')
            Object.assign(iframe.style, CONFIG.iframe)
            iframe.src = `${topic.url}?_t=${Date.now()}`

            // 清理旧的 iframe
            if (this.currentIframe) {
                this.currentIframe.remove()
            }
            this.currentIframe = iframe

            // 防止 history 污染（只添加一次）
            if (!this.popstateHandler) {
                this.popstateHandler = (e) => e.stopPropagation()
                window.addEventListener('popstate', this.popstateHandler, true)
            }

            document.body.appendChild(iframe)

            // 等待加载
            await new Promise((resolve) => {
                iframe.onload = resolve
            })

            // 点赞
            await this.likePost(iframe.contentWindow)

            // 滚动浏览
            await this.scrollIframe(iframe)

            // 清理
            iframe.remove()
            this.currentIframe = null
            stats.print()
        },

        // iframe 滚动
        async scrollIframe(iframe) {
            return new Promise((resolve) => {
                const startTime = Date.now()
                const { interval, step, duration } = CONFIG.scroll

                const timer = setInterval(() => {
                    try {
                        const win = iframe.contentWindow
                        const doc = win.document.documentElement
                        const atBottom = win.scrollY + win.innerHeight + 1 >= doc.scrollHeight
                        const timeout = Date.now() - startTime >= duration * 1000

                        if (atBottom || timeout) {
                            clearInterval(timer)
                            resolve()
                            return
                        }
                        win.scrollBy(0, step)
                    } catch (e) {
                        clearInterval(timer)
                        resolve()
                    }
                }, interval)
            })
        },

        // 主浏览循环
        async browseLoop() {
            try {
                const topics = utils.shuffle(this.getTopics())

                for (const topic of topics) {
                    if (this.shouldStop()) {
                        this.stop()
                        return
                    }
                    if (!switchControl.enabled) {
                        logger.info('⏹️ 用户停止')
                        return
                    }

                    try {
                        await utils.withTimeout(this.browseTopic(topic), CONFIG.limits.browseTimeout)
                    } catch (e) {
                        logger.warn(`帖子浏览超时，跳过: ${topic.title}`)
                    }

                    await utils.randomSleep(3000)
                }

                // 继续下一轮（保留统计信息）
                if (!this.shouldStop() && switchControl.enabled) {
                    logger.info('📄 当前页面完成')
                    await utils.randomSleep(20000)

                    logger.info('🔄 重新开始浏览...')
                    window.location.href = CONFIG.urls.base // 直接刷新页面重新加载帖子列表
                }
            } catch (e) {
                logger.error('浏览出错:', e.message)
            }
        },
    }

    // ==================== 入口 ====================
    async function main() {
        ui.createSwitchIcon()

        if (!switchControl.enabled) return

        stats.load()

        if (window.location.href.includes(CONFIG.urls.base)) {
            if (core.shouldStop()) {
                core.stop()
                return
            }
            await core.browseLoop()
        }
    }

    // 启动（检查是否在 iframe 中，避免重复执行）
    if (window.self !== window.top) {
        logger.debug('当前在 iframe 中，跳过主逻辑')
    } else {
        const tryStart = () => {
            if (document.body && document.getElementById('toggle-current-user')?.parentElement) {
                main()
                return true
            }
            return false
        }

        if (document.readyState === 'complete') {
            tryStart() || setTimeout(main, 1000)
        } else {
            let started = false
            const startOnce = () => {
                if (started) return
                started = tryStart()
            }

            // 多重保障：DOMContentLoaded、load、超时
            document.addEventListener('DOMContentLoaded', startOnce)
            window.addEventListener('load', startOnce)

            // 超时兜底，防止页面长时间未加载完
            setTimeout(() => {
                if (!started) {
                    started = true
                    logger.warn('页面加载超时，强制启动')
                    main()
                }
            }, 50000)
        }
    }
})()
