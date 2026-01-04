// ==UserScript==
// @name         Stripe支付自动填充(Cursor/Augment/OpenAI)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  现代化界面设计的Stripe支付自动填充工具，支持固定卡号配置，手动操作，无快捷键
// @author       ltw
// @license      MIT
// @match        https://checkout.stripe.com/*
// @match        https://billing.augmentcode.com/*
// @match        https://pay.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554738/Stripe%E6%94%AF%E4%BB%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%28CursorAugmentOpenAI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554738/Stripe%E6%94%AF%E4%BB%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%28CursorAugmentOpenAI%29.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // 默认配置
  const DEFAULT_CONFIG = {
    name: "陳明",
    address: "忠孝東路四段88號, 大安區, 台北市, 106",
    city: "台北市",
    postal: "106",
    country: "TW"
  }

  // 地址配置 - 多国家/地区
  const ADDRESS_CONFIGS = {
    US: {
      name: "John Smith",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "Carson",
      state: "CO",
      postalCode: "81003",
      country: "US"
    },
    CN: {
      name: "李伟",
      addressLine1: "建国门外大街28号8号楼",
      addressLine2: "朝阳区",
      city: "北京",
      state: "北京市",
      postalCode: "100022",
      country: "CN"
    },
    TW: {
      name: "陳明",
      addressLine1: "忠孝東路四段88號",
      addressLine2: "大安區",
      city: "台北市",
      state: "台北市",
      postalCode: "106",
      country: "TW"
    }
  }

  // 当前选中的地址
  let currentAddressRegion = "TW"

  // 固定卡号配置 - 特定URL使用固定卡号而非缓存
  const FIXED_CARD_CONFIG = {
    "pay.openai.com": "4154644401562377|06|2029|000",
    "billing.augmentcode.com": "5154620020408058|09|2029|306"
  }

  // 卡号缓存管理器
  class CardCacheManager {
    constructor() {
      this.cacheKey = "stripe-autofill-card-cache"
    }

    // 从localStorage加载卡号缓存
    loadCardCache() {
      try {
        const cached = localStorage.getItem(this.cacheKey)
        return cached ? JSON.parse(cached) : []
      } catch (error) {
        console.error("加载卡号缓存失败:", error)
        return []
      }
    }

    // 保存卡号缓存到localStorage
    saveCardCache(cards) {
      try {
        localStorage.setItem(this.cacheKey, JSON.stringify(cards))
        return true
      } catch (error) {
        console.error("保存卡号缓存失败:", error)
        return false
      }
    }

    // 批量添加卡号到缓存
    addCardsToCache(cardStrings) {
      const currentCache = this.loadCardCache()
      const newCards = cardStrings
        .map(card => card.trim())
        .filter(card => card && this.validateCardFormat(card))

      const updatedCache = [...currentCache, ...newCards]
      return this.saveCardCache(updatedCache)
    }

    // 验证卡号格式
    validateCardFormat(cardString) {
      const parts = cardString.split("|")
      return (
        parts.length === 4 &&
        parts[0].length >= 13 &&
        parts[1].length >= 1 &&
        parts[2].length >= 2 &&
        parts[3].length >= 3
      )
    }

    // 从缓存随机获取一个卡号
    getRandomCardFromCache() {
      const cache = this.loadCardCache()
      if (cache.length === 0) return null

      const randomIndex = Math.floor(Math.random() * cache.length)
      return cache[randomIndex]
    }

    // 从缓存中删除已使用的卡号
    removeCardFromCache(cardString) {
      const cache = this.loadCardCache()
      const updatedCache = cache.filter(card => card !== cardString)
      return this.saveCardCache(updatedCache)
    }

    // 获取缓存中的卡号数量
    getCacheSize() {
      return this.loadCardCache().length
    }

    // 清空缓存
    clearCache() {
      return this.saveCardCache([])
    }
  }

  // 创建全局缓存管理器实例
  const cardCache = new CardCacheManager()

  // 根据当前URL获取固定卡号（如果配置了的话）
  function getFixedCardForUrl() {
    const currentUrl = window.location.hostname

    // 遍历固定卡号配置，查找匹配的域名
    for (const domain in FIXED_CARD_CONFIG) {
      if (currentUrl.includes(domain)) {
        return {
          cardInfo: FIXED_CARD_CONFIG[domain],
          fromCache: false,
          isFixed: true // 标记为固定卡号
        }
      }
    }

    return null // 没有匹配的固定卡号
  }

  // 随机账单信息数据库
  const RANDOM_BILLING_DATA = [
    {
      name: "Michael Johnson",
      addressLine1: "123 Oak Street",
      addressLine2: "Apt 4B",
      city: "Austin",
      state: "TX",
      postalCode: "73301",
      country: "US"
    },
    {
      name: "Sarah Williams",
      addressLine1: "456 Pine Avenue",
      addressLine2: "Suite 200",
      city: "Denver",
      state: "CO",
      postalCode: "80202",
      country: "US"
    },
    {
      name: "David Brown",
      addressLine1: "789 Maple Drive",
      addressLine2: "",
      city: "Phoenix",
      state: "AZ",
      postalCode: "85001",
      country: "US"
    },
    {
      name: "Emily Davis",
      addressLine1: "321 Cedar Lane",
      addressLine2: "Unit 15",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "US"
    },
    {
      name: "Robert Miller",
      addressLine1: "654 Birch Road",
      addressLine2: "",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "US"
    },
    {
      name: "Jessica Wilson",
      addressLine1: "987 Elm Street",
      addressLine2: "Floor 3",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "US"
    },
    {
      name: "Christopher Moore",
      addressLine1: "147 Spruce Court",
      addressLine2: "",
      city: "Las Vegas",
      state: "NV",
      postalCode: "89101",
      country: "US"
    },
    {
      name: "Amanda Taylor",
      addressLine1: "258 Willow Way",
      addressLine2: "Apt 7A",
      city: "Portland",
      state: "OR",
      postalCode: "97201",
      country: "US"
    },
    {
      name: "James Anderson",
      addressLine1: "369 Poplar Place",
      addressLine2: "",
      city: "Nashville",
      state: "TN",
      postalCode: "37201",
      country: "US"
    },
    {
      name: "Lisa Thomas",
      addressLine1: "741 Hickory Hill",
      addressLine2: "Building B",
      city: "Atlanta",
      state: "GA",
      postalCode: "30301",
      country: "US"
    }
  ]

  // 全局状态管理 - 防止重复执行
  const STATE = {
    isFillingInProgress: false,
    lastFillTime: 0,
    fillCooldown: 3000, // 3秒冷却时间
    observer: null,
    autoDetectInterval: null,
    panelCreated: false,
    shouldAutoSubmit: false, // 双击后自动提交标记
    // 双击检测状态
    doubleClickState: {
      cardOnlyBtn: { lastClickTime: 0, clickCount: 0 },
      fillBtn: { lastClickTime: 0, clickCount: 0 }
    },
    doubleClickInterval: 500 // 500ms内的两次点击视为双击
  }

  // 获取配置
  function getConfig() {
    const saved = localStorage.getItem("stripe-autofill-config")
    if (saved) {
      const config = JSON.parse(saved)
      // 清理旧的cardInfo字段，因为现在使用缓存管理
      if (config.cardInfo) {
        delete config.cardInfo
        // 保存清理后的配置
        saveConfig(config)
      }
      return config
    }
    return DEFAULT_CONFIG
  }

  // 保存配置
  function saveConfig(config) {
    localStorage.setItem("stripe-autofill-config", JSON.stringify(config))
  }

  // 双击检测函数
  function detectDoubleClick(buttonId) {
    const now = Date.now()
    const buttonState = STATE.doubleClickState[buttonId]

    if (!buttonState) {
      console.log(`[双击检测] buttonId ${buttonId} 不存在`)
      return false
    }

    const timeSinceLastClick = now - buttonState.lastClickTime
    console.log(
      `[双击检测] buttonId: ${buttonId}, 距离上次点击: ${timeSinceLastClick}ms, 阈值: ${STATE.doubleClickInterval}ms`
    )

    // 检查是否在双击时间间隔内
    if (buttonState.lastClickTime > 0 && timeSinceLastClick < STATE.doubleClickInterval) {
      // 这是第二次点击,视为双击
      console.log(`[双击检测] 检测到双击!`)
      buttonState.clickCount = 0
      buttonState.lastClickTime = 0
      return true
    } else {
      // 这是第一次点击或超时后的点击
      console.log(`[双击检测] 第一次点击,记录时间戳`)
      buttonState.clickCount = 1
      buttonState.lastClickTime = now
      return false
    }
  }

  // 自动提交表单函数
  async function autoSubmitForm() {
    try {
      // 等待填充完成后再提交
      await new Promise(resolve => setTimeout(resolve, 800))

      const submitButton = document.querySelector('[data-testid="hosted-payment-submit-button"]')
      if (submitButton) {
        updateStatus("🚀 检测到双击,正在自动提交...", "info")
        await new Promise(resolve => setTimeout(resolve, 500))
        submitButton.click()
        updateStatus("✅ 表单已自动提交!", "success")
      } else {
        updateStatus("⚠️ 未找到提交按钮", "info")
      }
    } catch (error) {
      console.error("自动提交失败:", error)
      updateStatus("❌ 自动提交失败: " + error.message, "error")
    }
  }

  // 显示卡号输入弹窗
  function showCardInputDialog() {
    const modal = createCardInputModal()
    document.body.appendChild(modal)

    // 添加弹窗动画
    setTimeout(() => {
      modal.style.opacity = "1"
      modal.querySelector(".modal-content").style.transform = "scale(1)"
    }, 10)
  }

  // 清除所有卡号
  function clearAllCards() {
    // 显示确认对话框
    const currentCount = cardCache.getCacheSize()

    if (currentCount === 0) {
      updateStatus("⚠️ 缓存中没有卡号", "info")
      return
    }

    if (confirm(`确定要清除所有 ${currentCount} 个缓存卡号吗？\n\n此操作不可恢复！`)) {
      if (cardCache.clearCache()) {
        updateStatus("✅ 已清除所有缓存卡号", "success")
        updateCacheStatus()
      } else {
        updateStatus("❌ 清除失败，请重试", "error")
      }
    }
  }

  // 创建卡号输入弹窗
  function createCardInputModal() {
    const modal = document.createElement("div")
    modal.id = "card-input-modal"
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(8px);
    `

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>添加银行卡信息</h2>
          <p>请按格式输入银行卡信息，每行一个</p>
        </div>
        
        <div class="modal-body">
          <label>银行卡信息</label>
          <textarea id="card-input-textarea" placeholder="5552700145507352|02|2028|962&#10;5552700145526840|02|2028|816&#10;..."></textarea>
          <div class="form-hint">格式：卡号|月份|年份|CVV，每行一个</div>
        </div>
        
        <div class="modal-footer">
          <button id="cancel-card-input">取消</button>
          <button id="save-card-input">保存</button>
        </div>
      </div>
    `

    // 应用样式
    applyModalStyles(modal)

    // 绑定事件
    const cancelBtn = modal.querySelector("#cancel-card-input")
    const saveBtn = modal.querySelector("#save-card-input")
    const textarea = modal.querySelector("#card-input-textarea")

    cancelBtn.addEventListener("click", () => {
      modal.style.opacity = "0"
      setTimeout(() => modal.remove(), 300)
    })

    saveBtn.addEventListener("click", () => {
      const cardData = textarea.value.trim()
      if (cardData) {
        const cards = cardData.split("\n").filter(line => line.trim())
        if (cardCache.addCardsToCache(cards)) {
          updateStatus(`✅ 成功添加 ${cards.length} 个卡号到缓存`, "success")
          modal.style.opacity = "0"
          setTimeout(() => modal.remove(), 300)
        } else {
          updateStatus("❌ 保存卡号失败，请检查格式", "error")
        }
      } else {
        updateStatus("⚠️ 请输入至少一个卡号", "error")
      }
    })

    // 点击背景关闭
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.opacity = "0"
        setTimeout(() => modal.remove(), 300)
      }
    })

    return modal
  }

  // 应用弹窗样式
  function applyModalStyles(modal) {
    // 弹窗内容样式
    const modalContent = modal.querySelector(".modal-content")
    modalContent.style.cssText = `
      background: linear-gradient(145deg, #ffffff, #f8fafc);
      border-radius: 20px;
      padding: 32px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.9);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `

    // 弹窗头部样式
    const modalHeader = modal.querySelector(".modal-header")
    modalHeader.style.cssText = `
      text-align: center;
      margin-bottom: 24px;
    `

    const headerTitle = modalHeader.querySelector("h2")
    headerTitle.style.cssText = `
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 8px 0;
      letter-spacing: 0.5px;
    `

    const headerDesc = modalHeader.querySelector("p")
    headerDesc.style.cssText = `
      color: #6b7280;
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
    `

    // 弹窗主体样式
    const modalBody = modal.querySelector(".modal-body")
    modalBody.style.cssText = `
      margin-bottom: 20px;
    `

    const label = modalBody.querySelector("label")
    label.style.cssText = `
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      font-size: 14px;
    `

    const textarea = modalBody.querySelector("textarea")
    textarea.style.cssText = `
      width: 100%;
      height: 200px;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      resize: vertical;
      outline: none;
      transition: border-color 0.3s ease;
      background: #ffffff;
      box-sizing: border-box;
    `

    const formHint = modalBody.querySelector(".form-hint")
    formHint.style.cssText = `
      color: #6b7280;
      font-size: 12px;
      margin-top: 6px;
      line-height: 1.4;
    `

    // 弹窗底部样式
    const modalFooter = modal.querySelector(".modal-footer")
    modalFooter.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `

    const cancelBtn = modalFooter.querySelector("#cancel-card-input")
    cancelBtn.style.cssText = `
      padding: 12px 24px;
      border: 2px solid #e5e7eb;
      background: #ffffff;
      color: #6b7280;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    `

    const saveBtn = modalFooter.querySelector("#save-card-input")
    saveBtn.style.cssText = `
      padding: 12px 24px;
      border: none;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    `

    // 添加按钮交互效果
    cancelBtn.addEventListener("mouseenter", () => {
      cancelBtn.style.borderColor = "#d1d5db"
      cancelBtn.style.background = "#f9fafb"
    })

    cancelBtn.addEventListener("mouseleave", () => {
      cancelBtn.style.borderColor = "#e5e7eb"
      cancelBtn.style.background = "#ffffff"
    })

    saveBtn.addEventListener("mouseenter", () => {
      saveBtn.style.background = "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
      saveBtn.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)"
    })

    saveBtn.addEventListener("mouseleave", () => {
      saveBtn.style.background = "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      saveBtn.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"
    })

    // 添加textarea交互效果
    textarea.addEventListener("focus", () => {
      textarea.style.borderColor = "#6366f1"
      textarea.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)"
    })

    textarea.addEventListener("blur", () => {
      textarea.style.borderColor = "#e5e7eb"
      textarea.style.boxShadow = "none"
    })
  }

  // 生成随机银行卡信息（使用缓存）
  function generateRandomCardInfo() {
    const randomCard = cardCache.getRandomCardFromCache()
    if (!randomCard) {
      // 如果缓存为空，显示输入弹窗
      showCardInputDialog()
      return null
    }
    // 为缓存卡号添加来源标识
    return {
      cardInfo: randomCard,
      fromCache: true
    }
  }

  // 生成随机账单信息
  function generateRandomBillingInfo() {
    const randomIndex = Math.floor(Math.random() * RANDOM_BILLING_DATA.length)
    return RANDOM_BILLING_DATA[randomIndex]
  }

  // 仅填充卡号功能
  function fillCardOnlyFromInput() {
    // 检测双击
    const isDoubleClick = detectDoubleClick("cardOnlyBtn")
    console.log("[fillCardOnlyFromInput] 双击检测结果:", isDoubleClick)

    // 如果检测到双击,设置标记并等待当前填充完成
    if (isDoubleClick) {
      console.log("[fillCardOnlyFromInput] 检测到双击,设置自动提交标记")
      STATE.shouldAutoSubmit = true
      // 如果正在填充中,直接返回,等待当前填充完成后自动提交
      if (STATE.isFillingInProgress) {
        updateStatus("⚠️ 检测到双击,填充完成后将自动提交", "info")
        return
      }
    }

    // 检查是否正在填充中(非双击情况)
    if (STATE.isFillingInProgress) {
      updateStatus("⚠️ 填充正在进行中...", "info")
      return
    }

    // 检查冷却时间 - 双击时跳过冷却检查
    const now = Date.now()
    if (!isDoubleClick && now - STATE.lastFillTime < STATE.fillCooldown) {
      const remainingTime = Math.ceil((STATE.fillCooldown - (now - STATE.lastFillTime)) / 1000)
      updateStatus(`⏰ 请等待 ${remainingTime} 秒后再试`, "info")
      return
    }

    // 获取用户输入的卡号
    const cardInput = document.getElementById("card-config")
    let cardInfo = null
    let fromCache = false
    let isFixed = false

    if (cardInput && cardInput.value.trim()) {
      // 使用用户手动输入的卡号
      cardInfo = cardInput.value.trim()
      fromCache = false
      isFixed = false
    } else {
      // 优先检查是否有固定卡号
      const fixedCard = getFixedCardForUrl()
      if (fixedCard) {
        cardInfo = fixedCard.cardInfo
        fromCache = false
        isFixed = true
      } else {
        // 如果没有固定卡号，从缓存获取
        if (cardCache.getCacheSize() === 0) {
          updateStatus("⚠️ 请先输入卡号或添加卡号到缓存", "error")
          return
        }

        const randomCardData = generateRandomCardInfo()
        if (!randomCardData) {
          updateStatus("⚠️ 无法获取卡号，请先添加卡号", "error")
          return
        }
        cardInfo = randomCardData.cardInfo
        fromCache = randomCardData.fromCache
        isFixed = false
      }
    }

    // 直接调用填充逻辑，不通过fillCardOnly函数
    fillCardOnlyDirect(cardInfo, fromCache, isFixed)
  }

  // 直接填充卡号的函数
  async function fillCardOnlyDirect(cardInfo, fromCache = false, isFixed = false) {
    console.log(
      "[fillCardOnlyDirect] 接收到的参数 - cardInfo:",
      cardInfo,
      "shouldAutoSubmit:",
      STATE.shouldAutoSubmit
    )
    try {
      STATE.isFillingInProgress = true
      STATE.lastFillTime = Date.now()

      updateStatus("正在填充银行卡信息...", "info")

      // 解析银行卡信息
      const cardData = parseCardInfo(cardInfo)

      // 检查是否需要点击银行卡按钮（兼容不同页面类型）
      const cardButton = document.querySelector('[data-testid="card-accordion-item-button"]')
      if (cardButton && cardButton.offsetParent !== null) {
        cardButton.click()
        await new Promise(resolve => setTimeout(resolve, 300)) // 点击后等待300ms
      }

      // 批量填充银行卡信息 - 无需等待
      console.log("[fillCardOnlyDirect] 批量填充银行卡信息")
      await Promise.all([
        fillField("#cardNumber", cardData.number),
        fillField("#cardExpiry", cardData.expiry),
        fillField("#cardCvc", cardData.cvc)
      ])

      // 固定卡号不删除，可重复使用；只有来自缓存的卡号才删除（一卡一用）
      if (isFixed) {
        updateStatus("✅ 银行卡信息填充完成！(使用固定卡号)", "success")
      } else if (fromCache) {
        cardCache.removeCardFromCache(cardInfo)
        updateStatus(`✅ 银行卡信息填充完成！剩余卡号: ${cardCache.getCacheSize()}`, "success")
      } else {
        updateStatus("✅ 银行卡信息填充完成！", "success")
      }

      // 如果设置了自动提交标记，自动提交表单
      console.log(
        "[fillCardOnlyDirect] 检查是否需要自动提交 - shouldAutoSubmit:",
        STATE.shouldAutoSubmit
      )
      if (STATE.shouldAutoSubmit) {
        console.log("[fillCardOnlyDirect] 触发自动提交表单")
        STATE.shouldAutoSubmit = false // 重置标记
        await autoSubmitForm()
      }
    } catch (error) {
      updateStatus("❌ 银行卡填充失败: " + error.message, "error")
    } finally {
      // 重置填充状态
      STATE.isFillingInProgress = false
      STATE.shouldAutoSubmit = false // 确保重置标记
    }
  }

  // 只填充银行卡信息的函数
  async function fillCardOnly(cardInfo) {
    // 检查是否正在填充中
    if (STATE.isFillingInProgress) {
      updateStatus("⚠️ 填充正在进行中...", "info")
      return
    }

    // 检查冷却时间
    const now = Date.now()
    if (now - STATE.lastFillTime < STATE.fillCooldown) {
      const remainingTime = Math.ceil((STATE.fillCooldown - (now - STATE.lastFillTime)) / 1000)
      updateStatus(`⏰ 请等待 ${remainingTime} 秒后再试`, "info")
      return
    }

    // 处理卡号信息
    let actualCardInfo = cardInfo
    let fromCache = false

    if (!cardInfo) {
      // 如果没有提供卡号信息，从缓存中获取
      const randomCardData = generateRandomCardInfo()
      if (!randomCardData) {
        updateStatus("⚠️ 缓存中没有可用的卡号，请先添加卡号", "error")
        return
      }
      actualCardInfo = randomCardData.cardInfo
      fromCache = randomCardData.fromCache
    } else if (typeof cardInfo === "object" && cardInfo.fromCache) {
      // 如果传入的是对象且来自缓存
      actualCardInfo = cardInfo.cardInfo
      fromCache = cardInfo.fromCache
    }

    try {
      STATE.isFillingInProgress = true
      STATE.lastFillTime = now

      updateStatus("正在填充银行卡信息...", "info")

      // 解析银行卡信息
      const cardData = parseCardInfo(actualCardInfo)

      // 等待页面加载完成
      await new Promise(resolve => setTimeout(resolve, 500))

      // 检查是否需要点击银行卡按钮（兼容不同页面类型）
      const cardButton = document.querySelector('[data-testid="card-accordion-item-button"]')
      if (cardButton && cardButton.offsetParent !== null) {
        cardButton.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // 填充银行卡信息
      await fillField("#cardNumber", cardData.number)
      await new Promise(resolve => setTimeout(resolve, 300))

      await fillField("#cardExpiry", cardData.expiry)
      await new Promise(resolve => setTimeout(resolve, 300))

      await fillField("#cardCvc", cardData.cvc)
      await new Promise(resolve => setTimeout(resolve, 300))

      // 只有来自缓存的卡号才删除（一卡一用）
      if (fromCache) {
        cardCache.removeCardFromCache(actualCardInfo)
        updateStatus(`✅ 银行卡信息填充完成！剩余卡号: ${cardCache.getCacheSize()}`, "success")
      } else {
        updateStatus("✅ 银行卡信息填充完成！", "success")
      }
    } catch (error) {
      updateStatus("❌ 银行卡填充失败: " + error.message, "error")
    } finally {
      // 重置填充状态
      STATE.isFillingInProgress = false
    }
  }

  // 智能解析地址信息
  function parseAddressInfo(addressText) {
    if (!addressText || typeof addressText !== "string") {
      return {
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: ""
      }
    }

    // 智能识别分隔符类型
    let parts = []
    if (addressText.includes("\n")) {
      // 换行符分隔
      parts = addressText.split("\n")
    } else if (addressText.includes(",")) {
      // 逗号分隔
      parts = addressText.split(",")
    } else {
      // 空格分隔（作为备选）
      parts = addressText.split(/\s{2,}/) // 两个或更多空格
    }

    // 清理和过滤部分
    parts = parts.map(part => part.trim()).filter(part => part)

    let addressLine1 = ""
    let addressLine2 = ""
    let city = ""
    let postalCode = ""

    // 先找邮编（5位数字或5位数字-4位数字格式）
    const zipRegex = /\b\d{5}(-\d{4})?\b/
    for (let i = 0; i < parts.length; i++) {
      const match = parts[i].match(zipRegex)
      if (match) {
        postalCode = match[0]
        parts.splice(i, 1)
        break
      }
    }

    // 剩余部分按顺序分配
    if (parts.length >= 1) {
      // 第一部分作为地址第一行
      addressLine1 = parts[0]
    }

    if (parts.length >= 2) {
      // 第二部分 → 地址第二行
      addressLine2 = parts[1]
    }

    if (parts.length >= 3) {
      // 第三部分 → 城市
      city = parts[2]
    }

    const result = {
      addressLine1,
      addressLine2,
      city,
      postalCode
    }

    return result
  }

  // 解析银行卡信息
  function parseCardInfo(cardString) {
    const parts = cardString.split("|")
    if (parts.length !== 4) {
      throw new Error("格式错误：应为 卡号|月份|年份|CVV")
    }

    let [cardNumber, month, year, cvv] = parts
    cardNumber = cardNumber.replace(/\s/g, "")

    if (year.length === 2) {
      year = "20" + year
    } else if (year.length === 4) {
      year = year.slice(-2)
    }

    return {
      number: cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "),
      expiry: `${month.padStart(2, "0")}/${year}`,
      cvc: cvv
    }
  }

  // 等待元素
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector)
        if (element) {
          observer.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })
      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Element ${selector} not found`))
      }, timeout)
    })
  }

  // 强力填充函数 - 专门处理Stripe的React组件
  function forceSetValue(element, value) {
    // 方法1: 直接设置value属性
    element.value = value

    // 方法2: 使用原生setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set
    nativeInputValueSetter.call(element, value)

    // 方法3: 清除React的value tracker
    if (element._valueTracker) {
      element._valueTracker.setValue("")
    }

    // 方法4: 触发React事件
    const inputEvent = new Event("input", { bubbles: true })
    element.dispatchEvent(inputEvent)

    // 方法5: 模拟键盘输入
    element.focus()
    element.select()
    document.execCommand("insertText", false, value)
  }

  // 改进的填充字段函数 - 优化焦点跳转
  function fillField(selector, value) {
    const element = document.querySelector(selector)
    if (!element) {
      return Promise.resolve(false)
    }

    // 如果值为空或未定义，仍然尝试填充（可能是清空字段）
    const fillValue = value || ""

    return new Promise(resolve => {
      try {
        // 一次性聚焦和填充，避免重复焦点操作
        element.focus()

        // 短暂延迟确保焦点生效
        setTimeout(() => {
          // 清空并设置值
          element.value = ""
          forceSetValue(element, fillValue)

          // 触发必要的事件
          const events = ["input", "change"]
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true })
            element.dispatchEvent(event)
          })

          // 移除焦点，避免后续跳转
          element.blur()

          // 简单验证
          if (element.value === fillValue) {
            resolve(true)
          } else {
            // 最后一次尝试
            forceSetValue(element, fillValue)
            resolve(true)
          }
        }, 100) // 减少延迟时间
      } catch (error) {
        resolve(false)
      }
    })
  }

  // 填充选择框
  async function fillSelect(selector, value) {
    try {
      const element = await waitForElement(selector)
      if (!element) {
        throw new Error(`Select element ${selector} not found`)
      }

      element.value = value
      element.dispatchEvent(new Event("change", { bubbles: true }))
      element.dispatchEvent(new Event("blur", { bubbles: true }))

      return true
    } catch (error) {
      return false
    }
  }

  // 切换地址区域并直接填充（仅填充地址，不填充银行卡）
  function switchAddressRegion(region) {
    // 检查是否正在填充中
    if (STATE.isFillingInProgress) {
      updateStatus("⚠️ 填充正在进行中...", "info")
      return
    }

    // 地址区域切换无需冷却时间,可以快速切换
    console.log("[switchAddressRegion] 切换地址区域到:", region)

    currentAddressRegion = region
    const addressConfig = ADDRESS_CONFIGS[region]

    // 更新界面输入框
    const nameInput = document.getElementById("name-config")
    const addressInput = document.getElementById("address-config")

    if (nameInput) {
      nameInput.value = addressConfig.name
      nameInput.dispatchEvent(new Event("input"))
    }

    if (addressInput) {
      // 组合地址信息
      const fullAddress = `${addressConfig.addressLine1}\n${addressConfig.addressLine2}\n${addressConfig.city}\n${addressConfig.postalCode}`
      addressInput.value = fullAddress
      addressInput.dispatchEvent(new Event("input"))
    }

    // 更新按钮状态
    updateAddressButtonStates(region)

    // 显示提示
    const regionNames = { US: "美国", CN: "中国", TW: "台湾" }
    updateStatus(`🌍 正在切换到${regionNames[region]}地址...`, "info")

    // 只填充地址信息，不填充银行卡
    fillAddressOnly(addressConfig)
  }

  // 只填充地址信息（不填充银行卡）
  async function fillAddressOnly(addressConfig) {
    try {
      STATE.isFillingInProgress = true
      STATE.lastFillTime = Date.now()

      updateStatus("正在填充地址信息...", "info")

      // 优化填充顺序：先填充国家，再批量填充其他字段
      // 1. 首先填充国家（如果需要且字段存在）
      console.log("[fillAddressOnly] 填充国家")
      if (addressConfig.country && document.querySelector("#billingCountry")) {
        await fillSelect("#billingCountry", addressConfig.country)
        await new Promise(resolve => setTimeout(resolve, 300)) // 国家选择后等待300ms
      }

      // 2. 填充省/州信息（如果存在）
      if (addressConfig.state && document.querySelector("#billingAdministrativeArea")) {
        await fillSelect("#billingAdministrativeArea", addressConfig.state)
      }

      // 3. 批量填充姓名和地址信息 - 无需等待
      console.log("[fillAddressOnly] 批量填充姓名和地址信息")
      await Promise.all([
        fillField("#billingName", addressConfig.name),
        fillField("#billingAddressLine1", addressConfig.addressLine1),
        fillField("#billingAddressLine2", addressConfig.addressLine2),
        fillField("#billingLocality", addressConfig.city),
        document.querySelector("#billingPostalCode")
          ? fillField("#billingPostalCode", addressConfig.postalCode)
          : Promise.resolve()
      ])

      updateStatus("✅ 地址信息填充完成！", "success")
    } catch (error) {
      updateStatus("❌ 地址填充失败: " + error.message, "error")
    } finally {
      // 重置填充状态
      STATE.isFillingInProgress = false
    }
  }

  // 更新地址按钮状态
  function updateAddressButtonStates(activeRegion) {
    const buttons = {
      US: document.getElementById("address-btn-us"),
      CN: document.getElementById("address-btn-cn"),
      TW: document.getElementById("address-btn-tw")
    }

    Object.keys(buttons).forEach(region => {
      const btn = buttons[region]
      if (btn) {
        if (region === activeRegion) {
          btn.style.background = "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
          btn.style.color = "white"
          btn.style.borderColor = "#6366f1"
          btn.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.3)"
        } else {
          btn.style.background = "#ffffff"
          btn.style.color = "#6b7280"
          btn.style.borderColor = "#e5e7eb"
          btn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.08)"
        }
      }
    })
  }

  // 手动填充 - 使用面板配置和地址解析
  function manualFill() {
    // 检测双击
    const isDoubleClick = detectDoubleClick("fillBtn")
    console.log("[manualFill] 双击检测结果:", isDoubleClick)

    // 如果检测到双击,设置标记并等待当前填充完成
    if (isDoubleClick) {
      console.log("[manualFill] 检测到双击,设置自动提交标记")
      STATE.shouldAutoSubmit = true
      // 如果正在填充中,直接返回,等待当前填充完成后自动提交
      if (STATE.isFillingInProgress) {
        updateStatus("⚠️ 检测到双击,填充完成后将自动提交", "info")
        return
      }
    }

    // 检查是否正在填充中(非双击情况)
    if (STATE.isFillingInProgress) {
      updateStatus("⚠️ 填充正在进行中...", "info")
      return
    }

    // 检查冷却时间 - 双击时跳过冷却检查
    const now = Date.now()
    if (!isDoubleClick && now - STATE.lastFillTime < STATE.fillCooldown) {
      const remainingTime = Math.ceil((STATE.fillCooldown - (now - STATE.lastFillTime)) / 1000)
      updateStatus(`⏰ 请等待 ${remainingTime} 秒后再试`, "info")
      return
    }

    // 直接从表单获取当前配置
    const cardInput = document.getElementById("card-config")
    const nameInput = document.getElementById("name-config")
    const addressInput = document.getElementById("address-config")

    // 获取卡号信息
    let cardInfo = null
    let fromCache = false
    let isFixed = false

    if (cardInput && cardInput.value.trim()) {
      // 如果用户手动输入了卡号，使用手动输入的卡号
      cardInfo = cardInput.value.trim()
      fromCache = false
      isFixed = false
    } else {
      // 优先检查是否有固定卡号
      const fixedCard = getFixedCardForUrl()
      if (fixedCard) {
        cardInfo = fixedCard.cardInfo
        fromCache = false
        isFixed = true
      } else {
        // 如果没有固定卡号，从缓存获取
        if (cardCache.getCacheSize() === 0) {
          updateStatus("⚠️ 缓存中没有卡号，请先添加卡号或手动输入卡号", "error")
          showCardInputDialog()
          return
        }

        const randomCardData = generateRandomCardInfo()
        if (!randomCardData) {
          updateStatus("⚠️ 无法获取卡号，请先添加卡号或手动输入卡号", "error")
          showCardInputDialog()
          return
        }
        cardInfo = randomCardData.cardInfo
        fromCache = randomCardData.fromCache
        isFixed = false
      }
    }

    const config = {
      cardInfo: cardInfo,
      fromCache: fromCache,
      isFixed: isFixed,
      name: (nameInput ? nameInput.value : "") || DEFAULT_CONFIG.name,
      address: (addressInput ? addressInput.value : "") || DEFAULT_CONFIG.address,
      city: DEFAULT_CONFIG.city,
      postal: DEFAULT_CONFIG.postal,
      country: DEFAULT_CONFIG.country,
      useAddressParsing: true // 标记使用地址解析
    }

    try {
      STATE.isFillingInProgress = true
      STATE.lastFillTime = now

      updateStatus("正在准备填充...", "info")

      // 直接开始填充，performFilling函数内部会处理银行卡按钮
      performFilling(config)
    } catch (error) {
      updateStatus("❌ 填充失败: " + error.message, "error")
      STATE.isFillingInProgress = false
    }
  }

  // 自动填充 - 使用默认硬编码地址
  function autoFill() {
    // 检查是否正在填充中
    if (STATE.isFillingInProgress) {
      updateStatus("⚠️ 填充正在进行中...", "info")
      return
    }

    // 检查冷却时间
    const now = Date.now()
    if (now - STATE.lastFillTime < STATE.fillCooldown) {
      const remainingTime = Math.ceil((STATE.fillCooldown - (now - STATE.lastFillTime)) / 1000)
      updateStatus(`⏰ 请等待 ${remainingTime} 秒后再试`, "info")
      return
    }

    // 获取卡号信息
    let cardInfo = null
    let fromCache = false
    let isFixed = false

    // 优先检查是否有固定卡号
    const fixedCard = getFixedCardForUrl()
    if (fixedCard) {
      cardInfo = fixedCard.cardInfo
      fromCache = false
      isFixed = true
    } else {
      // 自动填充从缓存获取卡号
      if (cardCache.getCacheSize() === 0) {
        updateStatus("⚠️ 缓存中没有卡号，请先添加卡号", "error")
        showCardInputDialog()
        return
      }

      const randomCardData = generateRandomCardInfo()
      if (!randomCardData) {
        updateStatus("⚠️ 无法获取卡号，请先添加卡号", "error")
        showCardInputDialog()
        return
      }
      cardInfo = randomCardData.cardInfo
      fromCache = randomCardData.fromCache
      isFixed = false
    }

    // 使用默认配置，不解析地址
    const config = {
      cardInfo: cardInfo,
      fromCache: fromCache,
      isFixed: isFixed,
      name: DEFAULT_CONFIG.name,
      city: DEFAULT_CONFIG.city,
      postal: DEFAULT_CONFIG.postal,
      country: DEFAULT_CONFIG.country,
      state: "台北市",
      addressLine1: "忠孝東路四段88號",
      addressLine2: "大安區",
      useAddressParsing: false // 标记不使用地址解析
    }

    try {
      STATE.isFillingInProgress = true
      STATE.lastFillTime = now

      updateStatus("正在准备填充...", "info")

      // 直接开始填充，performFilling函数内部会处理银行卡按钮
      performFilling(config)
    } catch (error) {
      updateStatus("❌ 填充失败: " + error.message, "error")
      STATE.isFillingInProgress = false
    }
  }

  // 执行实际的填充操作 - 优化为顺序填充避免焦点跳转
  async function performFilling(config) {
    console.log("[performFilling] 开始填充, shouldAutoSubmit:", STATE.shouldAutoSubmit)
    try {
      // 解析银行卡信息
      const cardData = parseCardInfo(config.cardInfo)

      updateStatus("正在填充银行卡信息...")

      // 等待页面加载完成
      await new Promise(resolve => setTimeout(resolve, 500))

      // 检查是否需要点击银行卡按钮（兼容不同页面类型）
      const cardButton = document.querySelector('[data-testid="card-accordion-item-button"]')
      if (cardButton && cardButton.offsetParent !== null) {
        cardButton.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // 批量填充银行卡信息 - 无需等待
      console.log("[performFilling] 批量填充银行卡信息")
      await Promise.all([
        fillField("#cardNumber", cardData.number),
        fillField("#cardExpiry", cardData.expiry),
        fillField("#cardCvc", cardData.cvc)
      ])

      updateStatus("正在填充持卡人信息...")
      await fillField("#billingName", config.name)

      updateStatus("正在填充地址信息...")

      if (config.useAddressParsing && config.address) {
        // 手动填充：解析地址信息
        const addressInfo = parseAddressInfo(config.address)

        // 优化填充顺序：先填充国家，再批量填充其他字段
        // 1. 首先填充国家（如果需要且字段存在）
        console.log("[performFilling] 填充国家")
        if (config.country && document.querySelector("#billingCountry")) {
          await fillSelect("#billingCountry", config.country)
          await new Promise(resolve => setTimeout(resolve, 300)) // 国家选择后等待300ms
        }

        // 2. 批量填充地址信息 - 无需等待
        console.log("[performFilling] 批量填充地址信息")
        const cityValue = addressInfo.city || config.city || ""
        const postalValue = addressInfo.postalCode || config.postal || ""

        await Promise.all([
          fillField("#billingAddressLine1", addressInfo.addressLine1 || ""),
          fillField("#billingAddressLine2", addressInfo.addressLine2 || ""),
          fillField("#billingLocality", cityValue),
          document.querySelector("#billingPostalCode")
            ? fillField("#billingPostalCode", postalValue)
            : Promise.resolve()
        ])
      } else {
        // 自动填充：使用硬编码地址（优化填充顺序）

        // 1. 首先填充国家（如果需要且字段存在）
        console.log("[performFilling] 填充国家")
        if (config.country && document.querySelector("#billingCountry")) {
          await fillSelect("#billingCountry", config.country)
          await new Promise(resolve => setTimeout(resolve, 300)) // 国家选择后等待300ms
        }

        // 2. 填充省/州信息（如果存在）
        if (config.state && document.querySelector("#billingAdministrativeArea")) {
          await fillSelect("#billingAdministrativeArea", config.state)
        }

        // 3. 批量填充地址信息 - 无需等待
        console.log("[performFilling] 批量填充地址信息")
        await Promise.all([
          fillField("#billingAddressLine1", config.addressLine1 || "忠孝東路四段88號"),
          fillField("#billingAddressLine2", config.addressLine2 || "大安區"),
          fillField("#billingLocality", config.city),
          document.querySelector("#billingPostalCode")
            ? fillField("#billingPostalCode", config.postal)
            : Promise.resolve()
        ])
      }

      // 固定卡号不删除，可重复使用；只有来自缓存的卡号才删除（一卡一用）
      if (config.isFixed) {
        updateStatus("✅ 填充完成！(使用固定卡号)", "success")
      } else if (config.cardInfo && config.fromCache) {
        cardCache.removeCardFromCache(config.cardInfo)
        updateStatus(`✅ 填充完成！剩余卡号: ${cardCache.getCacheSize()}`, "success")
      } else {
        updateStatus("✅ 填充完成！", "success")
      }

      // 如果设置了自动提交标记，自动提交表单
      console.log(
        "[performFilling] 检查是否需要自动提交 - shouldAutoSubmit:",
        STATE.shouldAutoSubmit
      )
      if (STATE.shouldAutoSubmit) {
        console.log("[performFilling] 触发自动提交表单")
        STATE.shouldAutoSubmit = false // 重置标记
        await autoSubmitForm()
      }
    } catch (error) {
      updateStatus("❌ 填充失败: " + error.message, "error")
    } finally {
      // 重置填充状态
      STATE.isFillingInProgress = false
      STATE.shouldAutoSubmit = false // 确保重置标记
    }
  }

  // 随机账单信息填充
  async function fillRandomBillingInfo() {
    // 检查是否正在填充中
    if (STATE.isFillingInProgress) {
      updateStatus("⚠️ 填充正在进行中...", "info")
      return
    }

    // 检查冷却时间
    const now = Date.now()
    if (now - STATE.lastFillTime < STATE.fillCooldown) {
      const remainingTime = Math.ceil((STATE.fillCooldown - (now - STATE.lastFillTime)) / 1000)
      updateStatus(`⏰ 请等待 ${remainingTime} 秒后再试`, "info")
      return
    }

    try {
      STATE.isFillingInProgress = true
      STATE.lastFillTime = now

      updateStatus("正在生成随机信息...", "info")

      // 获取卡号信息
      let randomCardData = null
      let isFixed = false

      // 优先检查是否有固定卡号
      const fixedCard = getFixedCardForUrl()
      if (fixedCard) {
        randomCardData = {
          cardInfo: fixedCard.cardInfo,
          fromCache: false
        }
        isFixed = true
      } else {
        // 检查缓存中是否有卡号
        if (cardCache.getCacheSize() === 0) {
          updateStatus("⚠️ 缓存中没有卡号，请先添加卡号", "error")
          showCardInputDialog()
          STATE.isFillingInProgress = false
          return
        }

        // 生成随机银行卡信息（从缓存）
        randomCardData = generateRandomCardInfo()
        if (!randomCardData) {
          updateStatus("⚠️ 无法获取卡号，请先添加卡号", "error")
          STATE.isFillingInProgress = false
          return
        }
        isFixed = false
      }

      const cardData = parseCardInfo(randomCardData.cardInfo)

      // 生成随机账单信息
      const randomBilling = generateRandomBillingInfo()

      // 等待页面加载完成
      await new Promise(resolve => setTimeout(resolve, 500))

      // 检查是否需要点击银行卡按钮（兼容不同页面类型）
      const cardButton = document.querySelector('[data-testid="card-accordion-item-button"]')
      if (cardButton && cardButton.offsetParent !== null) {
        cardButton.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      updateStatus("正在填充随机银行卡信息...")

      // 批量填充银行卡信息 - 无需等待
      console.log("[fillRandomBillingInfo] 批量填充银行卡信息")
      await Promise.all([
        fillField("#cardNumber", cardData.number),
        fillField("#cardExpiry", cardData.expiry),
        fillField("#cardCvc", cardData.cvc)
      ])

      updateStatus("正在填充随机账单信息...")

      // 优化填充顺序：先填充国家，再批量填充其他字段
      // 1. 首先填充国家（如果需要且字段存在）
      console.log("[fillRandomBillingInfo] 填充国家")
      if (randomBilling.country && document.querySelector("#billingCountry")) {
        await fillSelect("#billingCountry", randomBilling.country)
        await new Promise(resolve => setTimeout(resolve, 300)) // 国家选择后等待300ms
      }

      // 2. 填充省/州信息（如果存在）
      if (randomBilling.state && document.querySelector("#billingAdministrativeArea")) {
        await fillSelect("#billingAdministrativeArea", randomBilling.state)
      }

      // 3. 批量填充姓名和地址信息 - 无需等待
      console.log("[fillRandomBillingInfo] 批量填充姓名和地址信息")
      await Promise.all([
        fillField("#billingName", randomBilling.name),
        fillField("#billingAddressLine1", randomBilling.addressLine1),
        randomBilling.addressLine2
          ? fillField("#billingAddressLine2", randomBilling.addressLine2)
          : Promise.resolve(),
        fillField("#billingLocality", randomBilling.city),
        document.querySelector("#billingPostalCode")
          ? fillField("#billingPostalCode", randomBilling.postalCode)
          : Promise.resolve()
      ])

      // 固定卡号不删除，可重复使用；只有来自缓存的卡号才删除（一卡一用）
      if (isFixed) {
        updateStatus("✅ 随机银行卡和账单信息填充完成！(使用固定卡号)", "success")
      } else if (randomCardData.fromCache) {
        cardCache.removeCardFromCache(randomCardData.cardInfo)
        updateStatus(
          `✅ 随机银行卡和账单信息填充完成！剩余卡号: ${cardCache.getCacheSize()}`,
          "success"
        )
      } else {
        updateStatus("✅ 随机银行卡和账单信息填充完成！", "success")
      }
    } catch (error) {
      updateStatus("❌ 随机填充失败: " + error.message, "error")
    } finally {
      // 重置填充状态
      STATE.isFillingInProgress = false
    }
  }

  // 更新状态
  function updateStatus(message, type = "info") {
    const statusEl = document.getElementById("autofill-status")
    if (statusEl) {
      statusEl.textContent = message
      statusEl.style.display = "block"

      // 现代化状态样式
      let bgGradient = "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))"
      let textColor = "#4f46e5"
      let borderColor = "rgba(59, 130, 246, 0.2)"
      let shadowColor = "rgba(59, 130, 246, 0.1)"

      if (type === "success") {
        bgGradient = "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))"
        textColor = "#059669"
        borderColor = "rgba(16, 185, 129, 0.3)"
        shadowColor = "rgba(16, 185, 129, 0.2)"
      } else if (type === "error") {
        bgGradient = "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))"
        textColor = "#dc2626"
        borderColor = "rgba(239, 68, 68, 0.3)"
        shadowColor = "rgba(239, 68, 68, 0.2)"
      }

      statusEl.style.cssText = `
        font-size: 13px;
        padding: 12px 16px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 600;
        background: ${bgGradient};
        color: ${textColor};
        border: 1px solid ${borderColor};
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px ${shadowColor};
        display: block;
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        min-height: 44px;
      `

      // 添加成功或错误图标效果 - 移除自动隐藏逻辑,保持提示语固定显示
      if (type === "success" || type === "error") {
        statusEl.style.animation = "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1), pulse 0.5s ease 0.3s"

        // 更新缓存状态显示
        updateCacheStatus()

        // 不再自动隐藏提示语,保持布局稳定
        // 注释掉原有的自动隐藏代码
        // setTimeout(() => {
        //   statusEl.style.animation = "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse"
        //   setTimeout(() => {
        //     statusEl.style.display = "none"
        //     statusEl.textContent = ""
        //   }, 300)
        // }, 3000)
      }
    }
  }

  // 创建控制面板 - 添加重复创建防护
  function createPanel() {
    // 检查是否已存在面板或正在创建中
    if (document.getElementById("stripe-autofill-panel") || STATE.panelCreated) {
      return
    }

    STATE.panelCreated = true
    const panel = document.createElement("div")
    panel.id = "stripe-autofill-panel"

    // 移除CSS样式表，改为直接应用到元素

    // 设置面板样式 - 现代化玻璃拟态设计，自适应高度
    panel.style.cssText = `
        position: fixed !important;
        top: 24px !important;
        right: 24px !important;
        width: 320px !important;
        max-height: 90vh !important;
        height: auto !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 16px !important;
        box-shadow:
          0 8px 32px rgba(0, 0, 0, 0.12),
          0 4px 16px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
        z-index: 999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'SF Pro Display', sans-serif !important;
        overflow: visible !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        transform: translateX(0) scale(1) !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    `

    panel.innerHTML = `
            <div class="autofill-panel">
                <div class="autofill-header" id="autofill-header">
                    <div id="header-logo-container">
                        <div id="status-indicator"></div>
                        <span id="header-title">Stripe 自动填充</span>
                    </div>
                    <button class="toggle-btn" id="toggle-panel-btn">−</button>
                </div>
                <div class="autofill-content" id="panel-content">
                    <div id="autofill-status" class="status">💡 就绪 - 双击按钮可自动提交表单</div>

                    <div class="floating-label">
                        <input type="text" id="card-config" placeholder=" " />
                        <label>银行卡信息</label>
                        <div class="form-hint">格式：卡号|月份|年份|CVV</div>
                    </div>

                    <div class="floating-label">
                        <input type="text" id="name-config" placeholder=" " />
                        <label>持卡人姓名</label>
                    </div>

                    <div class="address-section">
                        <div class="address-switch-container">
                            <span class="address-switch-label">地址区域：</span>
                            <div class="address-switch-buttons">
                                <button id="address-btn-us" class="address-switch-btn">🇺🇸 美国</button>
                                <button id="address-btn-cn" class="address-switch-btn">🇨🇳 中国</button>
                                <button id="address-btn-tw" class="address-switch-btn active">🇹🇼 台湾</button>
                            </div>
                        </div>
                        <div class="floating-label">
                            <textarea id="address-config" placeholder=" " rows="3"></textarea>
                            <label>完整地址</label>
                            <div class="form-hint">粘贴完整地址，自动识别街道、城市、邮编</div>
                        </div>
                    </div>

                    <div id="button-container">
                       <button id="card-only-btn" class="premium-button btn-card-only">
                          <span>仅填充卡号</span>
                        </button>
                        <div class="button-row">
                          <button id="fill-btn" class="premium-button btn-primary">
                            <span>自动填充</span>
                          </button>
                          <button id="random-btn" class="premium-button btn-random">
                            <span>随机信息</span>
                          </button>
                        </div>
                    </div>

                    <div class="card-section">
                        <div class="section-title">缓存状态</div>
                        <div id="cache-status-container">
                            <div id="cache-status">剩余卡号: 0</div>
                            <div class="cache-button-row">
                                <button id="add-cards-btn">添加卡号</button>
                                <button id="clear-cards-btn">移除所有</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

    // 添加入场动画
    panel.style.transform = "translateX(100%) scale(0.9)"
    panel.style.opacity = "0"

    document.body.appendChild(panel)

    // 应用所有元素样式
    applyElementStyles()

    // 触发入场动画
    setTimeout(() => {
      panel.style.transform = "translateX(0) scale(1)"
      panel.style.opacity = "1"
    }, 50)

    // 绑定事件
    setTimeout(() => {
      bindPanelEvents()
      loadConfig()
      addPanelInteractions()
    }, 100)
  }

  // 应用元素样式函数 - 现代化样式直接应用
  function applyElementStyles() {
    // 标题栏样式 - 现代化设计
    const header = document.getElementById("autofill-header")
    if (header) {
      header.style.cssText = `
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        padding: 20px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        backdrop-filter: blur(10px);
      `
    }

    // Logo容器样式
    const logoContainer = document.getElementById("header-logo-container")
    if (logoContainer) {
      logoContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 14px;
      `
    }

    // 状态指示器样式 - 脉冲动画
    const statusIndicator = document.getElementById("status-indicator")
    if (statusIndicator) {
      statusIndicator.style.cssText = `
        width: 10px;
        height: 10px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        position: relative;
      `

      // 添加脉冲效果
      setInterval(() => {
        if (statusIndicator) {
          statusIndicator.style.transform =
            statusIndicator.style.transform === "scale(1.2)" ? "scale(1)" : "scale(1.2)"
          statusIndicator.style.opacity = statusIndicator.style.opacity === "0.7" ? "1" : "0.7"
        }
      }, 1000)
    }

    // 标题样式
    const headerTitle = document.getElementById("header-title")
    if (headerTitle) {
      headerTitle.style.cssText = `
        font-size: 17px;
        font-weight: 700;
        color: #1f2937;
        letter-spacing: 0.3px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      `
    }

    // 折叠按钮样式 - 现代化设计
    const toggleBtn = document.getElementById("toggle-panel-btn")
    if (toggleBtn) {
      toggleBtn.style.cssText = `
        background: linear-gradient(135deg, #ffffff, #f8f9fa);
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: #6b7280;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      `
    }

    // 内容区域样式
    const panelContent = document.getElementById("panel-content")
    if (panelContent) {
      panelContent.style.cssText = `
        padding: 18px 20px 24px 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        min-height: auto;
        height: auto;
        overflow: visible;
      `
    }

    // 状态提示区域样式 - 固定显示,避免布局抖动
    const autofillStatus = document.getElementById("autofill-status")
    if (autofillStatus) {
      autofillStatus.style.cssText = `
        font-size: 13px;
        padding: 12px 16px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 600;
        display: block;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        color: #4f46e5;
        border: 1px solid rgba(59, 130, 246, 0.2);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
        min-height: 44px;
        position: relative;
        overflow: hidden;
      `
    }

    // 应用浮动标签样式
    applyFloatingLabelStyles()

    // 应用地址切换样式
    applyAddressSwitchStyles()

    // 应用按钮样式
    applyButtonStyles()
  }

  // 应用地址切换样式
  function applyAddressSwitchStyles() {
    const addressSection = document.querySelector("#stripe-autofill-panel .address-section")
    if (addressSection) {
      addressSection.style.cssText = `
        margin-bottom: 18px;
      `
    }

    const switchContainer = document.querySelector(
      "#stripe-autofill-panel .address-switch-container"
    )
    if (switchContainer) {
      switchContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      `
    }

    const switchLabel = document.querySelector("#stripe-autofill-panel .address-switch-label")
    if (switchLabel) {
      switchLabel.style.cssText = `
        font-size: 13px;
        font-weight: 600;
        color: #374151;
        white-space: nowrap;
      `
    }

    const switchButtons = document.querySelector("#stripe-autofill-panel .address-switch-buttons")
    if (switchButtons) {
      switchButtons.style.cssText = `
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      `
    }

    const addressBtns = document.querySelectorAll("#stripe-autofill-panel .address-switch-btn")
    addressBtns.forEach(btn => {
      btn.style.cssText = `
        padding: 6px 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        background: #ffffff;
        color: #6b7280;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        white-space: nowrap;
      `

      btn.addEventListener("mouseenter", () => {
        if (btn.id !== `address-btn-${currentAddressRegion.toLowerCase()}`) {
          btn.style.transform = "translateY(-2px)"
          btn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)"
          btn.style.borderColor = "#9ca3af"
        }
      })

      btn.addEventListener("mouseleave", () => {
        if (btn.id !== `address-btn-${currentAddressRegion.toLowerCase()}`) {
          btn.style.transform = "translateY(0)"
          btn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.08)"
          btn.style.borderColor = "#e5e7eb"
        }
      })

      btn.addEventListener("mousedown", () => {
        btn.style.transform = "scale(0.95)"
      })

      btn.addEventListener("mouseup", () => {
        btn.style.transform = "scale(1)"
      })
    })

    // 初始化默认选中状态
    updateAddressButtonStates(currentAddressRegion)
  }

  // 应用浮动标签样式
  function applyFloatingLabelStyles() {
    const floatingLabels = document.querySelectorAll("#stripe-autofill-panel .floating-label")
    floatingLabels.forEach(label => {
      label.style.cssText = `
        position: relative;
        margin-bottom: 18px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `

      const input = label.querySelector("input") || label.querySelector("textarea")
      if (input) {
        input.style.cssText = `
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          background: linear-gradient(145deg, #ffffff, #f9fafb);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          color: #374151;
          font-weight: 500;
          outline: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
          resize: vertical;
          font-family: inherit;
        `

        // 添加交互事件
        input.addEventListener("focus", () => {
          input.style.borderColor = "#6366f1"
          input.style.boxShadow =
            "0 0 0 3px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(99, 102, 241, 0.2)"
          input.style.transform = "translateY(-2px)"
          input.style.background = "#ffffff"
        })

        input.addEventListener("blur", () => {
          if (!input.value) {
            input.style.borderColor = "#e5e7eb"
            input.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.08)"
            input.style.transform = "translateY(0)"
            input.style.background = "linear-gradient(145deg, #ffffff, #f9fafb)"
          }
        })

        input.addEventListener("mouseenter", () => {
          if (document.activeElement !== input) {
            input.style.borderColor = "#d1d5db"
            input.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.12)"
            input.style.transform = "translateY(-1px)"
          }
        })

        input.addEventListener("mouseleave", () => {
          if (document.activeElement !== input) {
            input.style.borderColor = input.value ? "#6366f1" : "#e5e7eb"
            input.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.08)"
            input.style.transform = "translateY(0)"
          }
        })
      }

      const labelEl = label.querySelector("label")
      if (labelEl) {
        labelEl.style.cssText = `
          position: absolute;
          left: 20px;
          top: 18px;
          font-size: 15px;
          color: #9ca3af;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          background: linear-gradient(145deg, #ffffff, #f9fafb);
          padding: 0 8px;
          font-weight: 500;
          border-radius: 6px;
        `

        // 检查输入框是否有值，调整标签位置
        const updateLabelPosition = () => {
          if (!input || !labelEl) return // 防止 undefined 错误

          const hasValue = input.value && input.value.trim() !== ""
          const isFocused = document.activeElement === input

          if (hasValue || isFocused) {
            labelEl.style.top = "-12px"
            labelEl.style.left = "14px"
            labelEl.style.fontSize = "12px"
            labelEl.style.color = "#6366f1"
            labelEl.style.fontWeight = "600"
            labelEl.style.background = "#ffffff"
            labelEl.style.boxShadow = "0 2px 4px rgba(99, 102, 241, 0.1)"
          } else {
            labelEl.style.top = "14px"
            labelEl.style.left = "16px"
            labelEl.style.fontSize = "14px"
            labelEl.style.color = "#9ca3af"
            labelEl.style.fontWeight = "500"
            labelEl.style.background = "linear-gradient(145deg, #ffffff, #f9fafb)"
            labelEl.style.boxShadow = "none"
          }
        }

        if (input && labelEl) {
          input.addEventListener("focus", updateLabelPosition)
          input.addEventListener("blur", updateLabelPosition)
          input.addEventListener("input", updateLabelPosition)
          // 延迟初始化，确保元素完全加载
          setTimeout(updateLabelPosition, 100)
        }
      }

      const hint = label.querySelector(".form-hint")
      if (hint) {
        hint.style.cssText = `
          color: #6b7280;
          font-size: 13px;
          margin-top: 8px;
          margin-left: 6px;
          font-weight: 400;
          line-height: 1.5;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        `

        label.addEventListener("mouseenter", () => {
          hint.style.opacity = "1"
          hint.style.color = "#4b5563"
        })

        label.addEventListener("mouseleave", () => {
          hint.style.opacity = "0.8"
          hint.style.color = "#6b7280"
        })
      }
    })
  }

  // 应用按钮样式
  function applyButtonStyles() {
    const buttons = document.querySelectorAll("#stripe-autofill-panel .premium-button")
    buttons.forEach(button => {
      button.style.cssText = `
        position: relative;
        overflow: hidden;
        border: none;
        border-radius: 16px;
        padding: 16px 24px;
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        text-transform: none;
        letter-spacing: 0.3px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        min-height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      `

      // 按钮类型特定样式
      if (button.classList.contains("btn-primary")) {
        button.style.background = "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        button.style.color = "white"
        button.style.border = "1px solid rgba(255, 255, 255, 0.2)"
      } else if (button.classList.contains("btn-card-only")) {
        button.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        button.style.color = "white"
        button.style.border = "1px solid rgba(255, 255, 255, 0.2)"
      } else if (button.classList.contains("btn-random")) {
        button.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        button.style.color = "white"
        button.style.border = "1px solid rgba(255, 255, 255, 0.2)"
      } else if (button.classList.contains("btn-success")) {
        button.style.background = "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
        button.style.color = "white"
        button.style.border = "1px solid rgba(255, 255, 255, 0.2)"
      }

      // 添加交互事件
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-3px) scale(1.02)"
        if (button.classList.contains("btn-primary")) {
          button.style.background = "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
          button.style.boxShadow = "0 12px 35px rgba(59, 130, 246, 0.4)"
        } else if (button.classList.contains("btn-card-only")) {
          button.style.background = "linear-gradient(135deg, #059669 0%, #047857 100%)"
          button.style.boxShadow = "0 12px 35px rgba(16, 185, 129, 0.4)"
        } else if (button.classList.contains("btn-random")) {
          button.style.background = "linear-gradient(135deg, #e879f9 0%, #ef4444 100%)"
          button.style.boxShadow = "0 12px 35px rgba(240, 147, 251, 0.4)"
        } else if (button.classList.contains("btn-success")) {
          button.style.background = "linear-gradient(135deg, #38a169 0%, #2f855a 100%)"
          button.style.boxShadow = "0 12px 35px rgba(72, 187, 120, 0.4)"
        }
      })

      button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(0) scale(1)"
        button.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.15)"
        if (button.classList.contains("btn-primary")) {
          button.style.background = "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        } else if (button.classList.contains("btn-card-only")) {
          button.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        } else if (button.classList.contains("btn-random")) {
          button.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        } else if (button.classList.contains("btn-success")) {
          button.style.background = "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
        }
      })

      button.addEventListener("mousedown", () => {
        button.style.transform = "translateY(-1px) scale(0.98)"
      })

      button.addEventListener("mouseup", () => {
        button.style.transform = "translateY(-3px) scale(1.02)"
      })

      // 波纹效果
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span")
        const rect = this.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          transform: scale(0);
          pointer-events: none;
        `

        this.appendChild(ripple)

        // 动画波纹
        let scale = 0
        const animate = () => {
          scale += 0.1
          ripple.style.transform = `scale(${scale})`
          ripple.style.opacity = `${1 - scale / 4}`
          if (scale < 4) {
            requestAnimationFrame(animate)
          } else {
            ripple.remove()
          }
        }
        requestAnimationFrame(animate)
      })
    })

    // 按钮容器样式
    const buttonContainer = document.getElementById("button-container")
    if (buttonContainer) {
      buttonContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 8px;
      `
    }

    // 按钮行样式（用于将多个按钮放在同一行）
    const buttonRows = document.querySelectorAll("#stripe-autofill-panel .button-row")
    buttonRows.forEach(row => {
      row.style.cssText = `
        display: flex;
        gap: 10px;
      `
    })

    // 银行卡区域样式
    const cardSection = document.querySelector("#stripe-autofill-panel .card-section")
    if (cardSection) {
      cardSection.style.cssText = `
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      `
    }

    // 缓存状态容器样式
    const cacheStatusContainer = document.getElementById("cache-status-container")
    if (cacheStatusContainer) {
      cacheStatusContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
      `
    }

    // 缓存状态显示样式
    const cacheStatus = document.getElementById("cache-status")
    if (cacheStatus) {
      cacheStatus.style.cssText = `
        text-align: center;
        padding: 12px;
        background: linear-gradient(145deg, #f8fafc, #e2e8f0);
        border-radius: 12px;
        color: #6b7280;
        font-size: 14px;
        font-weight: 600;
      `
    }

    // 缓存按钮行样式
    const cacheButtonRow = document.querySelector("#stripe-autofill-panel .cache-button-row")
    if (cacheButtonRow) {
      cacheButtonRow.style.cssText = `
        display: flex;
        gap: 8px;
        margin-top: 8px;
      `
    }

    // 添加卡号按钮样式
    const addCardsBtn = document.getElementById("add-cards-btn")
    if (addCardsBtn) {
      addCardsBtn.style.cssText = `
        flex: 1;
        padding: 10px;
        border: 2px solid #e5e7eb;
        background: #ffffff;
        color: #6b7280;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 13px;
      `

      // 添加按钮交互效果
      addCardsBtn.addEventListener("mouseenter", () => {
        addCardsBtn.style.borderColor = "#10b981"
        addCardsBtn.style.background = "#f0fdf4"
        addCardsBtn.style.color = "#10b981"
      })

      addCardsBtn.addEventListener("mouseleave", () => {
        addCardsBtn.style.borderColor = "#e5e7eb"
        addCardsBtn.style.background = "#ffffff"
        addCardsBtn.style.color = "#6b7280"
      })

      addCardsBtn.addEventListener("mousedown", () => {
        addCardsBtn.style.transform = "scale(0.98)"
      })

      addCardsBtn.addEventListener("mouseup", () => {
        addCardsBtn.style.transform = "scale(1)"
      })
    }

    // 清除卡号按钮样式
    const clearCardsBtn = document.getElementById("clear-cards-btn")
    if (clearCardsBtn) {
      clearCardsBtn.style.cssText = `
        flex: 1;
        padding: 10px;
        border: 2px solid #e5e7eb;
        background: #ffffff;
        color: #6b7280;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 13px;
      `

      // 清除按钮交互效果
      clearCardsBtn.addEventListener("mouseenter", () => {
        clearCardsBtn.style.borderColor = "#ef4444"
        clearCardsBtn.style.background = "#fef2f2"
        clearCardsBtn.style.color = "#ef4444"
      })

      clearCardsBtn.addEventListener("mouseleave", () => {
        clearCardsBtn.style.borderColor = "#e5e7eb"
        clearCardsBtn.style.background = "#ffffff"
        clearCardsBtn.style.color = "#6b7280"
      })

      clearCardsBtn.addEventListener("mousedown", () => {
        clearCardsBtn.style.transform = "scale(0.98)"
      })

      clearCardsBtn.addEventListener("mouseup", () => {
        clearCardsBtn.style.transform = "scale(1)"
      })
    }

    // 区域标题样式
    const sectionTitle = document.querySelector("#stripe-autofill-panel .section-title")
    if (sectionTitle) {
      sectionTitle.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 12px;
        text-align: center;
        letter-spacing: 0.3px;
      `
    }

    // 常用银行卡容器样式
    const commonCardsContainer = document.getElementById("common-cards-container")
    if (commonCardsContainer) {
      commonCardsContainer.style.cssText = `
        display: flex;
        gap: 8px;
        justify-content: space-between;
      `
    }

    // 银行卡按钮样式
    const cardButtons = document.querySelectorAll("#stripe-autofill-panel .card-button")
    cardButtons.forEach(button => {
      button.style.cssText = `
        flex: 1;
        padding: 12px 8px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        background: linear-gradient(145deg, #ffffff, #f9fafb);
        color: #374151;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      `

      // 银行卡按钮交互效果
      button.addEventListener("mouseenter", () => {
        button.style.borderColor = "#6366f1"
        button.style.background = "linear-gradient(145deg, #f8fafc, #e2e8f0)"
        button.style.transform = "translateY(-2px)"
        button.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.2)"
        button.style.color = "#6366f1"
      })

      button.addEventListener("mouseleave", () => {
        button.style.borderColor = "#e5e7eb"
        button.style.background = "linear-gradient(145deg, #ffffff, #f9fafb)"
        button.style.transform = "translateY(0)"
        button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.08)"
        button.style.color = "#374151"
      })

      button.addEventListener("mousedown", () => {
        button.style.transform = "translateY(0) scale(0.98)"
      })

      button.addEventListener("mouseup", () => {
        button.style.transform = "translateY(-2px) scale(1)"
      })
    })
  }

  // 添加面板交互效果 - 简化版本，避免重复绑定
  function addPanelInteractions() {
    // 折叠按钮特效
    const toggleBtn = document.getElementById("toggle-panel-btn")
    if (toggleBtn) {
      toggleBtn.addEventListener("mouseenter", () => {
        toggleBtn.style.background = "linear-gradient(135deg, #f3f4f6, #e5e7eb)"
        toggleBtn.style.borderColor = "#d1d5db"
        toggleBtn.style.transform = "scale(1.05)"
      })

      toggleBtn.addEventListener("mouseleave", () => {
        toggleBtn.style.background = "linear-gradient(135deg, #ffffff, #f8f9fa)"
        toggleBtn.style.borderColor = "rgba(0, 0, 0, 0.1)"
        toggleBtn.style.transform = "scale(1)"
      })
    }

    // 面板hover效果
    const panel = document.getElementById("stripe-autofill-panel")
    if (panel) {
      panel.addEventListener("mouseenter", () => {
        panel.style.boxShadow = `
          0 10px 40px rgba(0, 0, 0, 0.15),
          0 6px 20px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8)
        `
        panel.style.transform = "translateY(-2px)"
      })

      panel.addEventListener("mouseleave", () => {
        panel.style.boxShadow = `
          0 8px 32px rgba(0, 0, 0, 0.12),
          0 4px 16px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.6)
        `
        panel.style.transform = "translateY(0)"
      })
    }
  }

  // 绑定面板事件
  function bindPanelEvents() {
    const fillBtn = document.getElementById("fill-btn")
    const cardOnlyBtn = document.getElementById("card-only-btn")
    const randomBtn = document.getElementById("random-btn")
    const toggleBtn = document.getElementById("toggle-panel-btn")

    if (fillBtn) {
      fillBtn.addEventListener("click", manualFill) // 手动点击使用解析地址
    }

    if (cardOnlyBtn) {
      cardOnlyBtn.addEventListener("click", fillCardOnlyFromInput) // 仅填充卡号
    }

    if (randomBtn) {
      randomBtn.addEventListener("click", fillRandomBillingInfo)
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", togglePanel)
    }

    // 绑定地址切换按钮事件
    const addressBtnUS = document.getElementById("address-btn-us")
    const addressBtnCN = document.getElementById("address-btn-cn")
    const addressBtnTW = document.getElementById("address-btn-tw")

    if (addressBtnUS) {
      addressBtnUS.addEventListener("click", () => switchAddressRegion("US"))
    }

    if (addressBtnCN) {
      addressBtnCN.addEventListener("click", () => switchAddressRegion("CN"))
    }

    if (addressBtnTW) {
      addressBtnTW.addEventListener("click", () => switchAddressRegion("TW"))
    }

    // 绑定添加卡号按钮事件
    const addCardsBtn = document.getElementById("add-cards-btn")
    if (addCardsBtn) {
      addCardsBtn.addEventListener("click", showCardInputDialog)
    }

    // 绑定清除所有卡号按钮事件
    const clearCardsBtn = document.getElementById("clear-cards-btn")
    if (clearCardsBtn) {
      clearCardsBtn.addEventListener("click", clearAllCards)
    }

    // 更新缓存状态显示
    updateCacheStatus()
  }

  // 切换面板
  function togglePanel() {
    const content = document.getElementById("panel-content")
    const button = document.getElementById("toggle-panel-btn")
    const panel = document.getElementById("stripe-autofill-panel")

    if (content && button && panel) {
      if (content.style.display === "none") {
        // 展开面板
        content.style.display = "block"
        content.style.opacity = "0"
        content.style.transform = "translateY(-10px)"

        // 平滑展开动画
        setTimeout(() => {
          content.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          content.style.opacity = "1"
          content.style.transform = "translateY(0)"
        }, 10)

        button.textContent = "−"
        button.style.transform = "scale(1) rotate(0deg)"

        // 恢复面板自适应高度
        panel.style.height = "auto"
      } else {
        // 折叠面板
        content.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        content.style.opacity = "0"
        content.style.transform = "translateY(-10px)"

        setTimeout(() => {
          content.style.display = "none"
          content.style.transition = "none"
        }, 300)

        button.textContent = "+"
        button.style.transform = "scale(1.1) rotate(90deg)"

        // 面板高度自动调整为只显示标题栏
        panel.style.height = "auto"
      }
    }
  }

  // 更新缓存状态显示
  function updateCacheStatus() {
    const cacheStatusEl = document.getElementById("cache-status")
    if (cacheStatusEl) {
      const cacheSize = cardCache.getCacheSize()
      cacheStatusEl.textContent = `剩余卡号: ${cacheSize}`

      // 根据缓存数量改变颜色
      if (cacheSize === 0) {
        cacheStatusEl.style.color = "#ef4444"
        cacheStatusEl.style.background = "linear-gradient(145deg, #fef2f2, #fee2e2)"
      } else if (cacheSize < 5) {
        cacheStatusEl.style.color = "#f59e0b"
        cacheStatusEl.style.background = "linear-gradient(145deg, #fffbeb, #fef3c7)"
      } else {
        cacheStatusEl.style.color = "#10b981"
        cacheStatusEl.style.background = "linear-gradient(145deg, #ecfdf5, #d1fae5)"
      }
    }
  }

  // 加载配置
  function loadConfig() {
    const config = getConfig()
    const cardInput = document.getElementById("card-config")
    const nameInput = document.getElementById("name-config")
    const addressInput = document.getElementById("address-config")

    if (cardInput) {
      cardInput.value = config.cardInfo || ""
      cardInput.dispatchEvent(new Event("input"))
    }

    // 初始化默认地址（台湾），只更新输入框，不触发填充
    const addressConfig = ADDRESS_CONFIGS["TW"]
    if (nameInput) {
      nameInput.value = addressConfig.name
      nameInput.dispatchEvent(new Event("input"))
    }

    if (addressInput) {
      const fullAddress = `${addressConfig.addressLine1}\n${addressConfig.addressLine2}\n${addressConfig.city}\n${addressConfig.postalCode}`
      addressInput.value = fullAddress
      addressInput.dispatchEvent(new Event("input"))
    }

    // 更新按钮状态
    updateAddressButtonStates("TW")
  }

  // 初始化用户提供的卡号数据
  function initializeUserCardData() {
    const userCardData = []

    // 检查是否已经初始化过
    if (cardCache.getCacheSize() === 0) {
      cardCache.addCardsToCache(userCardData)
      console.log(`已初始化 ${userCardData.length} 个用户卡号到缓存`)
    }
  }

  // 检测是否为支付页面
  function isPaymentPage() {
    // 检查URL是否包含支付相关路径
    const url = window.location.href
    if (
      !url.includes("checkout.stripe.com") &&
      !url.includes("billing.augmentcode.com") &&
      !url.includes("pay.openai.com")
    ) {
      return false
    }

    // 检查页面是否包含支付表单元素
    const paymentIndicators = [
      "#cardNumber",
      '[data-testid="card-accordion-item-button"]',
      'input[placeholder*="card"]',
      'input[placeholder*="Card"]',
      ".CardNumberField",
      ".CardField"
    ]

    return paymentIndicators.some(selector => document.querySelector(selector))
  }

  // 自动检测并填充 - 添加重复检测防护
  function autoDetectAndFill() {
    // 防止重复启动检测
    if (STATE.autoDetectInterval) {
      return
    }

    // 如果正在填充中，跳过检测
    if (STATE.isFillingInProgress) {
      return
    }

    let checkCount = 0
    const maxChecks = 12 // 减少检查次数，避免过度检测

    STATE.autoDetectInterval = setInterval(() => {
      checkCount++

      if (checkCount > maxChecks) {
        clearInterval(STATE.autoDetectInterval)
        STATE.autoDetectInterval = null
        return
      }

      if (isPaymentPage() && !STATE.isFillingInProgress) {
        clearInterval(STATE.autoDetectInterval)
        STATE.autoDetectInterval = null

        // 等待页面完全加载后再执行填充
        setTimeout(() => {
          if (!STATE.isFillingInProgress) {
            // 再次检查状态
            updateStatus("🎯 检测到支付页面，自动填充中...", "info")
            autoFill()
          }
        }, 1200) // 减少等待时间
      }
    }, 1000) // 每秒检查一次
  }

  // 监听页面变化（适用于单页应用）- 添加防重复监听
  function observePageChanges() {
    // 防止重复创建观察器
    if (STATE.observer) {
      return STATE.observer
    }

    let lastTriggerTime = 0
    const triggerCooldown = 2000 // 2秒冷却时间

    STATE.observer = new MutationObserver(mutations => {
      const now = Date.now()

      // 防止频繁触发
      if (now - lastTriggerTime < triggerCooldown) {
        return
      }

      let shouldCheck = false

      mutations.forEach(mutation => {
        // 检查是否有新的节点添加
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查是否包含支付相关元素
              if (
                node.querySelector &&
                (node.querySelector("#cardNumber") ||
                  node.querySelector('[data-testid="card-accordion-item-button"]') ||
                  node.querySelector('input[placeholder*="card"]') ||
                  node.querySelector('input[placeholder*="Card"]'))
              ) {
                shouldCheck = true
              }
            }
          })
        }
      })

      if (shouldCheck) {
        lastTriggerTime = now

        // 检查冷却时间和填充状态，避免重复填充
        const timeSinceLastFill = now - STATE.lastFillTime
        if (timeSinceLastFill >= STATE.fillCooldown && !STATE.isFillingInProgress) {
          setTimeout(() => {
            if (isPaymentPage() && !STATE.isFillingInProgress) {
              updateStatus("🎯 检测到页面变化，自动填充中...", "info")
              autoFill()
            }
          }, 600) // 减少延迟时间
        } else {
        }
      }
    })

    STATE.observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return STATE.observer
  }

  // 初始化 - 添加重复初始化防护
  function init() {
    // 防止重复初始化
    if (window.stripeAutoFillInitialized) {
      return
    }

    window.stripeAutoFillInitialized = true

    // 初始化用户卡号数据
    initializeUserCardData()

    // 延迟创建面板
    setTimeout(() => {
      createPanel()
    }, 1500) // 减少延迟

    // 启动自动检测和填充
    setTimeout(() => {
      autoDetectAndFill()
    }, 2500) // 减少延迟

    // 启动页面变化监听
    observePageChanges()
  }

  // 清理资源函数
  function cleanup() {
    if (STATE.observer) {
      STATE.observer.disconnect()
      STATE.observer = null
    }
    if (STATE.autoDetectInterval) {
      clearInterval(STATE.autoDetectInterval)
      STATE.autoDetectInterval = null
    }
    STATE.isFillingInProgress = false
    STATE.panelCreated = false
    window.stripeAutoFillInitialized = false
  }

  // 页面卸载时清理资源
  window.addEventListener("beforeunload", cleanup)
  window.addEventListener("unload", cleanup)

  // 测试银行卡解析功能
  function testCardParsing() {
    // 测试常用银行卡数据

    COMMON_CARD_DATA.forEach((cardData, index) => {
      try {
        const result = parseCardInfo(cardData.info)
      } catch (error) {}
    })

    // 测试随机银行卡数据

    RANDOM_CARD_DATA.forEach((cardInfo, index) => {
      try {
        const result = parseCardInfo(cardInfo)
      } catch (error) {}
    })
  }

  // 测试地址解析功能
  function testAddressParsing() {
    // 测试用例1：你提供的地址格式
    const testAddress1 = "1909 Mersington Court\nKansas City\nMO\nMissouri\n64127"

    const result1 = parseAddressInfo(testAddress1)

    // 测试用例2：默认配置地址
    const testAddress2 = DEFAULT_CONFIG.address

    const result2 = parseAddressInfo(testAddress2)

    // 测试用例3：逗号分隔的地址
    const testAddress3 = "1909 Mersington Court, Kansas City, MO, Missouri, 64127"

    const result3 = parseAddressInfo(testAddress3)

    // 验证结果

    if (result1.addressLine1 && result1.city && result1.postalCode) {
    } else {
    }
  }

  // 启动脚本
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }

  // 运行测试
  testCardParsing()
  testAddressParsing()
})()
