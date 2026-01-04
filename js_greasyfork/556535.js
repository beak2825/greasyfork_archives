// ==UserScript==
// @name         HDKylin/AGSVPT SeedBox Batch Registrar
// @namespace    https://www.hdkyl.in/
// @namespace    https://www.agsvpt.com/
// @version      0.1.0
// @description  为 HDKylin/AGSVPT 用户面板添加 SeedBox 批量登记助手，支持一次性提交多条 IPv4/IPv6 记录。
// @author       ai
// @match        https://www.hdkyl.in/usercp.php*
// @match        https://hdkyl.in/usercp.php*
// @match        https://www.agsvpt.com/usercp.php*
// @match        https://agsvpt.com/usercp.php*
// @icon         https://www.hdkyl.in/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556535/HDKylinAGSVPT%20SeedBox%20Batch%20Registrar.user.js
// @updateURL https://update.greasyfork.org/scripts/556535/HDKylinAGSVPT%20SeedBox%20Batch%20Registrar.meta.js
// ==/UserScript==

(function () {
    'use strict'

    const SEEDBOX_BUTTON_SELECTOR = '#add-seed-box-btn'
    const ACTION_URL = 'ajax.php'
    const MODAL_ID = 'seedbox-batch-modal'
    const STATUS_ID = 'seedbox-batch-status'
    const FORM_ID = 'seedbox-batch-form'
    const AUTO_RELOAD_ID = 'seedbox-batch-autoreload'

    const state = {
        modal: null,
        statusBox: null,
        form: null,
        submitBtn: null,
        cancelBtn: null,
    }

    waitForElement(SEEDBOX_BUTTON_SELECTOR)
        .then(anchor => {
            if (!anchor || document.getElementById('seedbox-batch-btn')) {
                return
            }
            injectStyles()
            createBatchButton(anchor)
            createModal()
        })
        .catch(err => console.warn('[SeedBoxBatch] 初始化失败:', err))

    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(selector)
            if (existing) {
                resolve(existing)
                return
            }

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector)
                if (el) {
                    observer.disconnect()
                    resolve(el)
                }
            })

            observer.observe(document.documentElement, {childList: true, subtree: true})

            setTimeout(() => {
                observer.disconnect()
                reject(new Error(`元素 ${selector} 超时未出现`))
            }, timeout)
        })
    }

    function injectStyles() {
        if (document.getElementById('seedbox-batch-style')) {
            return
        }
        const style = document.createElement('style')
        style.id = 'seedbox-batch-style'
        style.textContent = `
        #seedbox-batch-btn {
            margin-left: 6px;
            padding: 2px 10px;
            font-size: 12px;
            cursor: pointer;
        }
        #${MODAL_ID} {
            position: fixed;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.45);
            z-index: 10000;
        }
        #${MODAL_ID}.is-visible {
            display: flex;
        }
        #${MODAL_ID} .seedbox-modal__dialog {
            width: 520px;
            max-width: calc(100% - 32px);
            background: #fff;
            border-radius: 6px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            font-size: 13px;
            color: #111;
        }
        #${MODAL_ID} .seedbox-modal__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid #ececec;
            font-weight: bold;
        }
        #${MODAL_ID} .seedbox-modal__close {
            border: none;
            background: transparent;
            font-size: 18px;
            cursor: pointer;
        }
        #${MODAL_ID} form {
            padding: 16px;
        }
        #${MODAL_ID} label {
            display: block;
            margin-bottom: 10px;
        }
        #${MODAL_ID} label span {
            display: inline-block;
            min-width: 90px;
            color: #444;
        }
        #${MODAL_ID} input[type="text"],
        #${MODAL_ID} input[type="number"],
        #${MODAL_ID} textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 13px;
        }
        #${MODAL_ID} textarea {
            min-height: 160px;
            resize: vertical;
            font-family: Consolas, 'Courier New', monospace;
        }
        #${MODAL_ID} .seedbox-modal__tips {
            font-size: 12px;
            color: #777;
            margin-top: -6px;
            margin-bottom: 12px;
            line-height: 1.5;
        }
        #${MODAL_ID} .seedbox-modal__actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 12px;
        }
        #${MODAL_ID} button.seedbox-btn {
            padding: 6px 14px;
            border-radius: 4px;
            border: 1px solid transparent;
            cursor: pointer;
        }
        #${MODAL_ID} button.seedbox-btn.primary {
            background: #4caf50;
            color: #fff;
            border-color: #449a49;
        }
        #${MODAL_ID} button.seedbox-btn.secondary {
            background: #f1f1f1;
            border-color: #d5d5d5;
        }
        #${MODAL_ID} button.seedbox-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        #${STATUS_ID} {
            margin-top: 14px;
            max-height: 180px;
            overflow-y: auto;
            border: 1px solid #ececec;
            border-radius: 4px;
            padding: 10px;
            background: #fafafa;
            font-size: 12px;
            line-height: 1.5;
        }
        #${STATUS_ID} ul {
            padding-left: 18px;
            margin: 0;
        }
        #${STATUS_ID} li {
            margin-bottom: 4px;
        }
        #${STATUS_ID} li.success {
            color: #2e7d32;
        }
        #${STATUS_ID} li.error {
            color: #c62828;
        }
        #${STATUS_ID} li.skip {
            color: #ff9800;
        }
        #${STATUS_ID} li.info {
            color: #1565c0;
        }
        `
        document.head.appendChild(style)
    }

    function createBatchButton(anchor) {
        const batchBtn = document.createElement('input')
        batchBtn.type = 'button'
        batchBtn.id = 'seedbox-batch-btn'
        batchBtn.value = '批量登记'
        batchBtn.addEventListener('click', openModal)
        anchor.insertAdjacentElement('afterend', batchBtn)
    }

    function createModal() {
        const modal = document.createElement('div')
        modal.id = MODAL_ID
        modal.innerHTML = `
            <div class="seedbox-modal__dialog">
                <div class="seedbox-modal__header">
                    <span>SeedBox 批量登记</span>
                    <button type="button" class="seedbox-modal__close" aria-label="关闭">×</button>
                </div>
                <form id="${FORM_ID}">
                    <label>
                        <span>运营商 *</span>
                        <input type="text" name="operator" placeholder="例如：netcup / hetzner" required />
                    </label>
                    <label>
                        <span>带宽 (Mbps) *</span>
                        <input type="number" name="bandwidth" placeholder="1000" min="1" required />
                    </label>
                    <label>
                        <span>备注</span>
                        <input type="text" name="comment" placeholder="可选，统一备注" maxlength="120" />
                    </label>
                    <label>
                        <span>IP 列表 *</span>
                        <textarea name="entries" placeholder="每行：IPv4/IPv6，例如&#10;8.8.8.8/2001:4860:4860::8888"></textarea>
                    </label>
                    <div class="seedbox-modal__tips">
                        - IPv4 / IPv6 之间用斜杠分隔；留空的会被跳过。<br />
                        - 也可以只写 IPv4 或只写 IPv6（无需斜杠）。<br />
                        - 无效或重复的输入会跳过并给出提示。
                    </div>
                    <label style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                        <input type="checkbox" id="${AUTO_RELOAD_ID}" checked />
                        <span>全部成功后自动刷新页面</span>
                    </label>
                    <div class="seedbox-modal__actions">
                        <button type="button" class="seedbox-btn secondary" data-role="cancel">取消</button>
                        <button type="submit" class="seedbox-btn primary">开始登记</button>
                    </div>
                    <div id="${STATUS_ID}" style="display:none"></div>
                </form>
            </div>
        `
        document.body.appendChild(modal)

        state.modal = modal
        state.form = modal.querySelector(`#${FORM_ID}`)
        state.statusBox = modal.querySelector(`#${STATUS_ID}`)
        state.submitBtn = modal.querySelector('button[type="submit"]')
        state.cancelBtn = modal.querySelector('button[data-role="cancel"]')

        modal.querySelector('.seedbox-modal__close').addEventListener('click', closeModal)
        modal.addEventListener('click', evt => {
            if (evt.target === modal) {
                closeModal()
            }
        })
        state.cancelBtn.addEventListener('click', closeModal)
        state.form.addEventListener('submit', handleBatchSubmit)
    }

    function openModal() {
        if (!state.modal) {
            return
        }
        state.form.reset()
        state.statusBox.style.display = 'none'
        state.statusBox.innerHTML = ''
        state.modal.classList.add('is-visible')
        const firstInput = state.form.querySelector('input[name="operator"]')
        if (firstInput) {
            firstInput.focus()
        }
    }

    function closeModal() {
        if (state.modal) {
            state.modal.classList.remove('is-visible')
        }
    }

    async function handleBatchSubmit(event) {
        event.preventDefault()
        if (!state.form) {
            return
        }

        const operator = state.form.operator.value.trim()
        const bandwidth = state.form.bandwidth.value.trim()
        const comment = state.form.comment.value.trim()
        const rawEntries = state.form.entries.value.trim()

        if (!rawEntries) {
            renderStatus([{type: 'error', text: '请至少填写一行 IP 数据。'}])
            return
        }

        const {validEntries, skippedLines} = parseEntries(rawEntries)

        if (!validEntries.length) {
            renderStatus([{type: 'error', text: '没有检测到有效的 IPv4/IPv6 地址。'}])
            return
        }

        toggleFormDisabled(true)
        renderStatus([{type: 'info', text: `准备登记 ${validEntries.length} 条记录...`}])

        const results = []
        for (const entry of validEntries) {
            updateLiveStatus(entry)
            try {
                await submitSeedBox({operator, bandwidth, comment, ip: entry.ip})
                results.push({type: 'success', text: `${entry.family} ${entry.ip} - 成功`})
            } catch (err) {
                console.warn('[SeedBoxBatch] 提交失败', entry, err)
                results.push({type: 'error', text: `${entry.family} ${entry.ip} - ${err.message || '提交失败'}`})
            }
        }

        skippedLines.forEach(item => {
            results.push({type: 'skip', text: `第 ${item.line} 行已跳过：${item.value}`})
        })

        renderStatus(results)
        toggleFormDisabled(false)

        const hasError = results.some(item => item.type === 'error')
        const successCount = results.filter(item => item.type === 'success').length
        const shouldReload = document.getElementById(AUTO_RELOAD_ID)?.checked

        if (!hasError && successCount === validEntries.length && shouldReload) {
            results.push({type: 'info', text: '全部成功，3 秒后刷新页面。'})
            renderStatus(results)
            setTimeout(() => window.location.reload(), 3000)
        }
    }

    function toggleFormDisabled(disabled) {
        state.submitBtn.disabled = disabled
        state.cancelBtn.disabled = disabled
        const closeBtn = state.modal.querySelector('.seedbox-modal__close')
        closeBtn.disabled = disabled
        state.submitBtn.textContent = disabled ? '处理中...' : '开始登记'
    }

    function updateLiveStatus(entry) {
        state.statusBox.style.display = 'block'
        state.statusBox.innerHTML = `<div>正在登记：${entry.family} ${entry.ip}</div>`
    }

    async function submitSeedBox({operator, bandwidth, comment, ip}) {
        const payload = new URLSearchParams()
        payload.append('action', 'addSeedBoxRecord')
        payload.append('params[operator]', operator)
        payload.append('params[bandwidth]', bandwidth)
        payload.append('params[ip_begin]', '')
        payload.append('params[ip_end]', '')
        payload.append('params[ip]', ip)
        payload.append('params[comment]', comment)

        const response = await fetch(ACTION_URL, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: payload.toString(),
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        if (data.ret !== 0) {
            throw new Error(data.msg || '接口返回错误')
        }

        return data
    }

    function parseEntries(text) {
        const lines = text.split(/\r?\n/)
        const validEntries = []
        const skippedLines = []

        lines.forEach((line, index) => {
            const trimmed = line.trim()
            if (!trimmed) {
                return
            }

            const slashIndex = trimmed.indexOf('/')
            const hasSlash = slashIndex > -1
            const firstPart = hasSlash ? trimmed.slice(0, slashIndex).trim() : trimmed
            const secondPart = hasSlash ? trimmed.slice(slashIndex + 1).trim() : ''

            let found = false

            if (hasSlash) {
                if (firstPart && isValidIPv4(firstPart)) {
                    validEntries.push({ip: firstPart, family: 'IPv4', line: index + 1})
                    found = true
                }
                if (secondPart && isValidIPv6(secondPart)) {
                    validEntries.push({ip: secondPart, family: 'IPv6', line: index + 1})
                    found = true
                }
            } else {
                if (isValidIPv4(firstPart)) {
                    validEntries.push({ip: firstPart, family: 'IPv4', line: index + 1})
                    found = true
                } else if (isValidIPv6(firstPart)) {
                    validEntries.push({ip: firstPart, family: 'IPv6', line: index + 1})
                    found = true
                }
            }

            if (!found) {
                skippedLines.push({line: index + 1, value: trimmed})
            }
        })

        return {validEntries, skippedLines}
    }

    function isValidIPv4(ip) {
        const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
        return ipv4Regex.test(ip)
    }

    function isValidIPv6(ip) {
        if (!ip || ip.length > 39 || !/^[0-9a-fA-F:]+$/.test(ip)) {
            return false
        }
        if (ip.includes(':::')) {
            return false
        }

        const parts = ip.split('::')
        if (parts.length > 2) {
            return false
        }

        const hextetValid = segment => segment.length > 0 && segment.length <= 4 && /^[0-9a-fA-F]+$/.test(segment)
        const listSegments = segment => (segment ? segment.split(':').filter(Boolean) : [])

        const left = listSegments(parts[0])
        const right = listSegments(parts[1])

        if (!left.every(hextetValid) || !right.every(hextetValid)) {
            return false
        }

        if (parts.length === 1) {
            return left.length === 8
        }

        return left.length + right.length < 8
    }

    function renderStatus(items) {
        state.statusBox.style.display = 'block'
        const listItems = items
            .map(item => `<li class="${item.type}">${escapeHtml(item.text)}</li>`)
            .join('')
        state.statusBox.innerHTML = `<ul>${listItems}</ul>`
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    }
})()
