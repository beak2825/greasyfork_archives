// ==UserScript==
// @name         深蓝加点
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自定义魔力值赠送
// @author       江畔
// @match        *://pterclub.net/mybonus.php*
// @match        *://et8.org/mybonus.php*
// @match        *://open.cd/mybonus.php*
// @match        *://www.open.cd/mybonus.php*
// @match        *://hdhome.org/mybonus.php*
// @match        *://hdsky.me/details.php?id=*
// @include      *://springsunday.net*/forums.php*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557531/%E6%B7%B1%E8%93%9D%E5%8A%A0%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/557531/%E6%B7%B1%E8%93%9D%E5%8A%A0%E7%82%B9.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const siteConfig = {
    'pterclub.net': {
      option: 13,
      maxAmount: 50000,
      unit: '克猫粮',
      unitName: '猫粮',
      rowSelector: '#outer tbody > tr:nth-last-child(3)',
      btnSelector: 'input[name="submit"]',
      useInt: true,
      hasMessage: true,
    },
    'et8.org': {
      option: 7,
      maxAmount: 10000,
      unit: '个魔力值',
      unitName: '魔力值',
      rowSelector: null, // 使用通用选择器
      btnSelector: 'input[name="submit"][value="赠送"]',
      useInt: false,
      hasMessage: false,
    },
    'open.cd': {
      option: 8,
      maxAmount: 50000,
      unit: '个魔力值',
      unitName: '魔力值',
      rowSelector: null,
      btnSelector: 'input[name="submit"][value="赠送"]',
      useInt: false,
      hasMessage: true,
    },
    'hdhome.org': {
      option: 7,
      maxAmount: 100000,
      unit: '个魔力值',
      unitName: '魔力值',
      rowSelector: null,
      btnSelector: 'input[name="submit"][value="赠送"]',
      useInt: false,
      hasMessage: true,
    },
  }

  const DEFAULT_HOST = 'et8.org'
  const normalizedHost = window.location.host.replace(/^www\./i, '')
  const normalizedPath = window.location.pathname

  const getSiteConfig = hostKey => siteConfig[hostKey] || siteConfig[DEFAULT_HOST]

  const insertButtonStyles = () => {
    const STYLE_ID = 'tm-custom-bonus-button-style'
    if (document.getElementById(STYLE_ID)) {
      return
    }
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      #send_ml {
        padding: 5px 14px;
        border-radius: 6px;
        border: none;
        background: #5c7cff;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      #send_ml:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(92, 124, 255, 0.35);
      }
      #send_ml:active {
        transform: translateY(0);
      }
    `
    document.head.appendChild(style)
  }

  const initCustomBonusForm = hostKey => {
    const config = getSiteConfig(hostKey)
    let sendedAmount = 0
    let username = null
    let giftcustom = null
    let message = null

    const send = (usernameValue, bonusgift, messageValue) => {
      const data = `username=${usernameValue}&bonusgift=${bonusgift}&message=${messageValue}&option=${config.option}&submit=赠送`
      const url = `${window.location.protocol}//${window.location.host}/mybonus.php?action=exchange`

      GM.xmlHttpRequest({
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data,
        onload: response => {
          if (response.response.indexOf('错误') === -1) {
            sendedAmount += bonusgift
            $('#sended-amount').text(sendedAmount)
          }
        },
      })
    }

    const resetFields = () => {
      if (username && username.length > 0) {
        username.val('')
      }
      if (giftcustom && giftcustom.length > 0) {
        giftcustom.val('')
      }
      if (message && message.length > 0) {
        message.val('')
      }
      sendedAmount = 0
    }

    const langData = {
      pterclub: {
        简体中文: {
          btnText: '自定义猫粮赠送!',
          numAlertText: '您输入的猫粮数值有误，请重新输入！',
          userAlertText: '请输入受赠人的用户名！',
        },
        繁體中文: {
          btnText: '自定義貓糧贈送!',
          numAlertText: '您輸入的貓糧數值有誤，請重新輸入！',
          userAlertText: '請輸入受贈人的用戶名！',
        },
        English: {
          btnText: 'Custom Karma Gift!',
          numAlertText: 'Wrong points, please input point number again!',
          userAlertText: 'Please input username!',
        },
      },
      default: {
        简体中文: {
          btnText: '自定义魔力值赠送!',
          numAlertText: '您输入的魔力值数值有误，请重新输入！',
          userAlertText: '请输入受赠人的用户名！',
        },
        繁體中文: {
          btnText: '自定義魔力值贈送!',
          numAlertText: '您輸入的魔力值數值有誤，請重新輸入！',
          userAlertText: '請輸入受贈人的用戶名！',
        },
        English: {
          btnText: 'Custom Bonus Gift!',
          numAlertText: 'Wrong points, please input point number again!',
          userAlertText: 'Please input username!',
        },
      },
    }

    let lang = '简体中文'
    const langImg = $('#lang-selector > img')
    if (langImg.length > 0) {
      const langTitle = langImg.attr('title')
      if (langTitle) {
        lang = langTitle
      }
    }

    const langConfigSource =
      hostKey === 'pterclub.net' ? langData.pterclub : langData.default
    const langConfig = langConfigSource[lang] || langConfigSource['简体中文']
    const { btnText, numAlertText, userAlertText } = langConfig

    const handleSend = () => {
      if (!username || !giftcustom || username.length === 0 || giftcustom.length === 0) {
        console.error('表单元素未找到')
        return
      }

      let amount = config.useInt ? parseInt(giftcustom.val()) : parseFloat(giftcustom.val())
      if (isNaN(amount)) {
        alert(numAlertText)
        giftcustom.val('')
        return
      }

      if (username.val() === '') {
        alert(userAlertText)
        username.val('')
        return
      }

      $('#send_ml').after(
        `<p>向 ${username.val()}  成功赠送: <span id="sended-amount">${sendedAmount}</span>${config.unit}！</p>`
      )

      while (amount > config.maxAmount) {
        send(username.val(), config.maxAmount, message.length > 0 ? message.val() : '')
        amount -= config.maxAmount
      }

      if (amount) {
        send(username.val(), amount, message.length > 0 ? message.val() : '')
      }

      resetFields()
    }

    let row = null
    if (config.rowSelector) {
      row = $(config.rowSelector)
    } else {
      row = $('tr:has(h1:contains("赠送魔力值"))')
      if (row.length === 0) {
        const form = $('form[action*="?action=exchange"], form[action*="mybonus.php?action=exchange"]')
        row = form.closest('tr')
      }
    }

    if (row.length === 0) {
      console.error('未找到赠送表单')
      return
    }

    username = row.find('input[name="username"]')
    giftcustom = row.find('#giftcustom')

    message = row.find('input[name="message"]')
    if (message.length === 0 && !config.hasMessage) {
      message = $('<input type="text" name="message" style="display:none" value="">')
      row.append(message)
    }

    const btn = row.find(config.btnSelector)
    if (btn.length === 0) {
      console.error('未找到赠送按钮')
      return
    }

    insertButtonStyles()
    const newBtn = `<button type="button" id="send_ml">${btnText}</button>`
    btn.after(newBtn)
    $('#send_ml').on('click', handleSend)
  }

  const initForumBonusInputs = () => {
    const processedContainers = new Set()

    const processBonusContainer = (container, containerId) => {
      if (!containerId || processedContainers.has(containerId)) {
        if (container.querySelector('.custom-bonus-container')) {
          if (containerId) {
            processedContainers.add(containerId)
          }
        }
        return
      }

      if (container.querySelector('.custom-bonus-container')) {
        processedContainers.add(containerId)
        return
      }

      if (container.querySelector('.btn-givebonus')) {
        const inputContainer = document.createElement('div')
        inputContainer.className = 'custom-bonus-container'
        inputContainer.style.cssText = `
          display: inline-flex;
          margin-left: 5px;
        `

        const input = document.createElement('input')
        input.type = 'number'
        input.min = '1'
        input.placeholder = '自定义数量'
        input.style.cssText = `
          width: 90px;
          padding: 2px 5px;
          margin-right: 5px;
          border: 1px solid #BBBBBB;
          border-radius: 3px;
          font-size: 0.9em;
          outline: none;
        `

        const confirmBtn = document.createElement('button')
        confirmBtn.textContent = '赠送'
        confirmBtn.className = 'btn-givebonus'
        confirmBtn.style.cssText = `
          padding: 2px 5px;
          background: #DEDEDE;
          color: #000;
          border: 1px solid #BBBBBB;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.9em;
        `

        confirmBtn.addEventListener('mouseover', function () {
          this.style.background = '#CDCDCD'
        })
        confirmBtn.addEventListener('mouseout', function () {
          this.style.background = '#DEDEDE'
        })

        confirmBtn.addEventListener('click', function () {
          const amount = input.value.trim()
          if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
            alert('请输入有效的茉莉数量')
            return
          }

          const confirmMsg = `确定赠送 ${amount} 茉莉吗？`
          givebonus_post(containerId, parseInt(amount), confirmMsg)
        })

        input.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            confirmBtn.click()
          }
        })

        inputContainer.appendChild(input)
        inputContainer.appendChild(confirmBtn)

        container.appendChild(inputContainer)
        processedContainers.add(containerId)
      }
    }

    const findAndProcessContainers = () => {
      const bonusContainers = document.querySelectorAll('td.toolbox:not(.nowrap)[align="left"]')
      const containerIdsHtml = document.querySelectorAll('td.embedded > a:first-child')
      const containerIds = []
      containerIdsHtml.forEach(item => {
        const href = item.getAttribute('href') || ''
        const anchor = href.split('#')[1] || ''
        const id = anchor ? anchor.substring(3) : ''
        containerIds.push(id)
      })

      bonusContainers.forEach((container, index) => {
        processBonusContainer(container, containerIds[index])
      })
    }

    const initObserver = () => {
      const observer = new MutationObserver(mutations => {
        let shouldCheck = false
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldCheck = true
            break
          }
        }
        if (shouldCheck) {
          findAndProcessContainers()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }

    const init = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', findAndProcessContainers)
      } else {
        findAndProcessContainers()
      }

      initObserver()
      setTimeout(findAndProcessContainers, 500)
      setTimeout(findAndProcessContainers, 1000)
      setTimeout(findAndProcessContainers, 2000)
    }

    init()
  }

  // ========== 配置开关 ==========
  // 是否启用 HDSKY 自定义魔力值奖励功能
  const ENABLE_HDSKY_BONUS_INPUT = true
  // ==============================

  // ========== HDSKY 自定义魔力值奖励功能 ==========
  const initHdskyBonusInput = () => {
    if (!ENABLE_HDSKY_BONUS_INPUT) {
      return
    }

    const MIN_BONUS = 10
    const MAX_BONUS = 100000
    const STYLE_ID = 'tm-meeds-style'
    const WRAPPER_ID = 'tm-meeds-input-wrapper'
    const INPUT_ID = 'tm-meedsinput' // 使用唯一的 id，避免与原有 input 冲突
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

    const insertStyles = () => {
      if (document.getElementById(STYLE_ID)) {
        return
      }
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = `
        .tm-meeds-input {
          margin: 8px 0 10px;
          padding: 10px 14px;
          background: linear-gradient(135deg, rgba(125, 170, 255, 0.12), rgba(255, 255, 255, 0.5));
          border: 1px solid rgba(88, 129, 232, 0.4);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          font-size: 13px;
          box-shadow: 0 2px 6px rgba(60, 74, 97, 0.08);
          width: fit-content;
          max-width: 100%;
        }
        .tm-meeds-input strong {
          color: #3d4c6c;
        }
        .tm-meeds-input input[type="number"] {
          width: 110px;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgba(88, 129, 232, 0.6);
          font-weight: 600;
          color: #244065;
          background-color: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tm-meeds-input input[type="number"]:focus {
          outline: none;
          border-color: #5c7cff;
          box-shadow: 0 0 0 3px rgba(92, 124, 255, 0.28);
        }
        .tm-meeds-input button {
          padding: 5px 14px;
          border-radius: 6px;
          border: none;
          background: #5c7cff;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .tm-meeds-input button:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(92, 124, 255, 0.35);
        }
        .tm-meeds-input button:disabled {
          background: #a3acd6;
          cursor: not-allowed;
          box-shadow: none;
        }
        .tm-meeds-helper {
          color: #546488;
          font-size: 12px;
          opacity: 0.85;
        }
      `
      document.head.appendChild(style)
    }

    const createInputBlock = torrentId => {
      const wrapper = document.createElement('div')
      wrapper.id = WRAPPER_ID
      wrapper.className = 'tm-meeds-input'

      const helper = document.createElement('div')
      helper.className = 'tm-meeds-helper'
      helper.textContent = `范围 (${MIN_BONUS} - ${MAX_BONUS})`

      const label = document.createElement('strong')
      label.textContent = '自定义魔力值奖励'

      const input = document.createElement('input')
      input.type = 'number'
      input.id = INPUT_ID // 使用唯一的 id，避免与原有 input 冲突
      input.placeholder = '输入魔力值'
      input.min = MIN_BONUS
      input.max = MAX_BONUS
      input.step = 1
      input.value = MAX_BONUS

      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = '确定'

      const clampValue = value => {
        const num = Number(value)
        if (Number.isNaN(num)) {
          return MIN_BONUS
        }
        return Math.min(MAX_BONUS, Math.max(MIN_BONUS, Math.round(num)))
      }

      const dispatchBonus = () => {
        const payload = clampValue(input.value)
        input.value = payload
        if (typeof pageWindow.saymeeds === 'function') {
          button.disabled = true
          pageWindow.saymeeds(torrentId, 'torrent', payload)
          setTimeout(() => {
            button.disabled = false
          }, 800)
        } else {
          alert('页面尚未加载完成，请稍后再试')
        }
      }

      button.addEventListener('click', dispatchBonus)
      input.addEventListener('change', () => {
        input.value = clampValue(input.value)
      })
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault()
          dispatchBonus()
        }
      })

      wrapper.appendChild(label)
      wrapper.appendChild(input)
      wrapper.appendChild(button)
      wrapper.appendChild(helper)

      return wrapper
    }

    // 移动包含"魔力值奖励"的 tr 到"字幕"tr 下面
    const moveBonusTr = () => {
      const bonusHead = Array.from(document.querySelectorAll('td.rowhead, td.rowhead.nowrap, td.rowheadnowrap'))
        .find(cell => cell.textContent?.replace(/\s+/g, '').includes('魔力值奖励'))
      if (!bonusHead) return false

      const bonusTr = bonusHead.closest('tr')
      const tbody = bonusTr?.closest('tbody') || document.querySelector('tbody')
      if (!bonusTr || !tbody) return false

      // 查找"字幕"tr
      const subtitleHead = Array.from(document.querySelectorAll('td.rowhead, td.rowhead.nowrap, td.rowheadnowrap'))
        .find(cell => cell.textContent?.replace(/\s+/g, '').includes('字幕'))
      if (!subtitleHead) return false // 如果找不到"字幕"tr，不移动

      const subtitleTr = subtitleHead.closest('tr')
      if (!subtitleTr || subtitleTr === bonusTr) return false

      // 如果"魔力值奖励"tr 已经在"字幕"tr 下面，不需要移动
      if (subtitleTr.nextElementSibling === bonusTr) return false

      // 移除"魔力值奖励"tr，然后插入到"字幕"tr 后面
      bonusTr.remove()
      tbody.insertBefore(bonusTr, subtitleTr.nextSibling)
    }

    const insertBlock = () => {
      if (document.getElementById(WRAPPER_ID)) {
        return true
      }

      const params = new URLSearchParams(window.location.search)
      const torrentId = params.get('id')
      if (!torrentId) {
        return false
      }

      // 重新查找 targetHead（因为 tr 可能已经移动）
      const rowHeads = Array.from(
        document.querySelectorAll('td.rowhead, td.rowhead.nowrap, td.rowheadnowrap')
      )
      const targetHead = rowHeads.find(cell => {
        return (
          cell.textContent &&
          cell.textContent.replace(/\s+/g, '').includes('魔力值奖励')
        )
      })

      if (!targetHead || !targetHead.nextElementSibling) {
        return false
      }

      insertStyles()
      const block = createInputBlock(torrentId)
      targetHead.nextElementSibling.insertBefore(block, targetHead.nextElementSibling.firstChild)
      return true
    }

    let hdskyObserver = null
    let trMoved = false // 标记 tr 是否已经处理过（移动或检查过）

    const tryInsert = () => {
      // 先尝试移动 tr（只执行一次）
      if (!trMoved) {
        moveBonusTr() // 执行移动逻辑（无论是否成功移动，都标记为已处理）
        trMoved = true
      }

      // 然后尝试插入输入框
      if (insertBlock() && hdskyObserver) {
        hdskyObserver.disconnect()
      }
    }

    hdskyObserver = new MutationObserver(() => {
      tryInsert()
    })

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInsert)
    } else {
      tryInsert()
    }

    window.addEventListener('load', tryInsert)
    hdskyObserver.observe(document.documentElement, { childList: true, subtree: true })
  }
  // ================================================

  // 根据路径和域名初始化相应功能
  if (normalizedPath.includes('mybonus.php')) {
    initCustomBonusForm(normalizedHost)
  }

  if (/springsunday\.net/i.test(normalizedHost) && normalizedPath.includes('forums.php')) {
    initForumBonusInputs()
  }

  if (/hdsky\.me/i.test(normalizedHost) && normalizedPath.includes('details.php')) {
    initHdskyBonusInput()
  }
})()
