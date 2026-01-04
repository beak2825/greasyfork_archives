// ==UserScript==
// @name         Open In New Tab
// @namespace    https://github.com/xiaowulang-turbo/OpenInNewTab
// @version      1.1.5
// @description  Force all links to open in new tab using whitelist mode
// @author       Xiaowu
// @match        *://*/*
// @updateUrl    https://github.com/xiaowulang-turbo/OpenInNewTab/blob/main/userscript/OpenInNewTab.user.js
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551033/Open%20In%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/551033/Open%20In%20New%20Tab.meta.js
// ==/UserScript==

;(function () {
    "use strict"

    /**
     * Default whitelisted domains
     * These are the initial domains that will be included
     */
    const DEFAULT_DOMAINS = []

    /**
     * Get user whitelist from storage
     * @returns {Array} Array of whitelisted domains
     */
    function getUserWhitelist() {
        const stored = GM_getValue("userWhitelist", [])
        return Array.isArray(stored) ? stored : DEFAULT_DOMAINS
    }

    /**
     * Save user whitelist to storage
     * @param {Array} domains Array of domains to save
     */
    function saveUserWhitelist(domains) {
        GM_setValue("userWhitelist", domains)
    }

    /**
     * Check if current domain is in whitelist
     * @returns {boolean} True if domain is whitelisted
     */
    function isWhitelisted() {
        const currentDomain = window.location.hostname
        const userWhitelist = getUserWhitelist()
        return userWhitelist.some(
            (domain) =>
                currentDomain === domain || currentDomain.endsWith("." + domain)
        )
    }

    /**
     * Add current domain to whitelist
     */
    function addCurrentDomainToWhitelist() {
        const currentDomain = window.location.hostname
        const userWhitelist = getUserWhitelist()
        const lang = detectLanguage()

        if (!userWhitelist.includes(currentDomain)) {
            userWhitelist.push(currentDomain)
            saveUserWhitelist(userWhitelist)
            alert(`${currentDomain} ${getText("addedToWhitelist", lang)}`)
        } else {
            alert(`${currentDomain} ${getText("alreadyInWhitelist", lang)}`)
        }
    }

    /**
     * Detect browser language setting
     * @returns {string} Language code ('en' or 'zh')
     */
    function detectLanguage() {
        const userLang = navigator.language || navigator.userLanguage || "en"
        return userLang.startsWith("zh") ? "zh" : "en"
    }

    /**
     * Language resources for internationalization
     */
    const languageResources = {
        en: {
            modalTitle: "Whitelist Management",
            inputPlaceholder: "Enter domain, e.g., example.com",
            addButton: "Add",
            removeButton: "Remove",
            closeButton: "×",
            addedToWhitelist: "Added to whitelist!",
            alreadyInWhitelist: "Already in whitelist",
            removedFromWhitelist: "Removed from whitelist",
            noDomains: "No domains in whitelist",
            addToWhitelist: "Add to Whitelist",
            manageWhitelist: "Manage Whitelist",
        },
        zh: {
            modalTitle: "白名单管理",
            inputPlaceholder: "输入域名，如：example.com",
            addButton: "添加",
            removeButton: "移除",
            closeButton: "×",
            addedToWhitelist: "已添加到白名单！",
            alreadyInWhitelist: "已在白名单中",
            removedFromWhitelist: "已从白名单移除",
            noDomains: "白名单中没有域名",
            addToWhitelist: "添加白名单",
            manageWhitelist: "管理白名单",
        },
    }

    /**
     * Get text by language
     * @param {string} key Text key
     * @param {string} lang Language code
     * @returns {string} Localized text
     */
    function getText(key, lang = null) {
        const language = lang || detectLanguage()
        return (
            languageResources[language]?.[key] ||
            languageResources.en[key] ||
            key
        )
    }

    /**
     * Detect if the browser is in dark mode
     * @returns {boolean} True if in dark mode
     */
    function isDarkMode() {
        return (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        )
    }

    /**
     * Get CSS variables based on theme
     * @returns {Object} CSS color variables
     */
    function getThemeColors() {
        const isDark = isDarkMode()
        return {
            bgPrimary: isDark ? "#1a1a1a" : "#ffffff",
            bgSecondary: isDark ? "#2d2d2d" : "#f8f9fa",
            textPrimary: isDark ? "#ffffff" : "#333333",
            textSecondary: isDark ? "#cccccc" : "#666666",
            borderColor: isDark ? "#404040" : "#dddddd",
            shadowColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)",
            inputBg: isDark ? "#333333" : "#ffffff",
            inputBorder: isDark ? "#555555" : "#dddddd",
            inputText: isDark ? "#ffffff" : "#333333",
        }
    }

    /**
     * Create whitelist management modal
     */
    function createWhitelistModal() {
        const lang = detectLanguage()
        const modal = document.createElement("div")
        modal.className = "openinnewtabs-modal"
        modal.innerHTML = `
            <div class="openinnewtabs-modal-content">
                <div class="openinnewtabs-modal-header">
                    <h3>${getText("modalTitle", lang)}</h3>
                    <button class="openinnewtabs-close">${getText(
                        "closeButton",
                        lang
                    )}</button>
                </div>
                <div class="openinnewtabs-modal-body">
                    <div class="openinnewtabs-input-group">
                        <input type="text" id="openinnewtabs-new-domain" placeholder="${getText(
                            "inputPlaceholder",
                            lang
                        )}">
                        <button id="openinnewtabs-add-domain">${getText(
                            "addButton",
                            lang
                        )}</button>
                    </div>
                    <div class="openinnewtabs-domains-list" id="openinnewtabs-domains-list">
                        <!-- Domains will be added here -->
                    </div>
                </div>
            </div>
        `

        const colors = getThemeColors()

        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
                sans-serif;
        `

        const modalContent = modal.querySelector(".openinnewtabs-modal-content")
        modalContent.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${colors.bgPrimary};
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 12px;
            box-shadow: 0 8px 32px ${colors.shadowColor};
            border: 1px solid ${colors.borderColor};
        `

        const header = modal.querySelector(".openinnewtabs-modal-header")
        header.style.cssText = `
            padding: 20px 24px;
            border-bottom: 1px solid ${colors.borderColor};
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: ${colors.bgSecondary};
            border-radius: 12px 12px 0 0;
        `

        const headerTitle = header.querySelector("h3")
        headerTitle.style.cssText = `
            margin: 0;
            color: ${colors.textPrimary};
            font-size: 18px;
            font-weight: 600;
        `

        const closeBtn = modal.querySelector(".openinnewtabs-close")
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: ${colors.textSecondary};
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        `

        const body = modal.querySelector(".openinnewtabs-modal-body")
        body.style.cssText = `
            padding: 24px;
            color: ${colors.textPrimary};
        `

        const inputGroup = modal.querySelector(".openinnewtabs-input-group")
        inputGroup.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
        `

        const input = modal.querySelector("#openinnewtabs-new-domain")
        input.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            border: 2px solid ${colors.inputBorder};
            border-radius: 8px;
            font-size: 14px;
            background: ${colors.inputBg};
            color: ${colors.inputText};
            outline: none;
            transition: border-color 0.2s ease;
        `

        const addBtn = modal.querySelector("#openinnewtabs-add-domain")
        addBtn.style.cssText = `
            padding: 12px 24px;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        `

        // Add hover effects
        closeBtn.addEventListener("mouseover", () => {
            closeBtn.style.background = isDarkMode() ? "#404040" : "#e9ecef"
            closeBtn.style.color = colors.textPrimary
        })

        closeBtn.addEventListener("mouseout", () => {
            closeBtn.style.background = "none"
            closeBtn.style.color = colors.textSecondary
        })

        addBtn.addEventListener("mouseover", () => {
            addBtn.style.transform = "translateY(-1px)"
            addBtn.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.4)"
        })

        addBtn.addEventListener("mouseout", () => {
            addBtn.style.transform = "translateY(0)"
            addBtn.style.boxShadow = "0 2px 8px rgba(76, 175, 80, 0.3)"
        })

        input.addEventListener("focus", () => {
            input.style.borderColor = "#4caf50"
        })

        input.addEventListener("blur", () => {
            input.style.borderColor = colors.inputBorder
        })

        document.body.appendChild(modal)

        // Event listeners
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none"
        })

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none"
            }
        })

        addBtn.addEventListener("click", () => {
            const input = modal.querySelector("#openinnewtabs-new-domain")
            const domain = input.value.trim()
            if (domain) {
                addDomainToWhitelist(domain)
                input.value = ""
                updateWhitelistDisplay()
            }
        })

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addBtn.click()
            }
        })

        return modal
    }

    /**
     * Add domain to whitelist
     * @param {string} domain Domain to add
     */
    function addDomainToWhitelist(domain) {
        const userWhitelist = getUserWhitelist()
        const lang = detectLanguage()

        if (!userWhitelist.includes(domain)) {
            userWhitelist.push(domain)
            saveUserWhitelist(userWhitelist)
            alert(`${domain} ${getText("addedToWhitelist", lang)}`)
        } else {
            alert(`${domain} ${getText("alreadyInWhitelist", lang)}`)
        }
    }

    /**
     * Remove domain from whitelist
     * @param {string} domain Domain to remove
     */
    function removeDomainFromWhitelist(domain) {
        const userWhitelist = getUserWhitelist()
        const lang = detectLanguage()
        const index = userWhitelist.indexOf(domain)

        if (index > -1) {
            userWhitelist.splice(index, 1)
            saveUserWhitelist(userWhitelist)
            alert(`${domain} ${getText("removedFromWhitelist", lang)}`)
            updateWhitelistDisplay()
        }
    }

    /**
     * Update whitelist display in modal
     */
    function updateWhitelistDisplay() {
        const modal = document.querySelector(".openinnewtabs-modal")
        if (!modal) return

        const domainsList = modal.querySelector("#openinnewtabs-domains-list")
        const userWhitelist = getUserWhitelist()
        const colors = getThemeColors()
        const lang = detectLanguage()

        if (userWhitelist.length === 0) {
            domainsList.innerHTML = `
                <div style="
                    text-align: center;
                    color: ${colors.textSecondary};
                    font-size: 14px;
                    padding: 32px 16px;
                ">
                    ${getText("noDomains", lang)}
                </div>
            `
            return
        }

        domainsList.innerHTML = userWhitelist
            .map(
                (domain) => `
            <div class="openinnewtabs-domain-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border: 1px solid ${colors.borderColor};
                margin-bottom: 8px;
                border-radius: 8px;
                background: ${colors.bgSecondary};
                transition: all 0.2s ease;
            ">
                <span style="
                    color: ${colors.textPrimary};
                    font-size: 14px;
                    font-weight: 500;
                    flex: 1;
                ">${domain}</span>
                <button class="openinnewtabs-remove-domain" data-domain="${domain}" style="
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
                ">${getText("removeButton", lang)}</button>
            </div>
        `
            )
            .join("")

        // Add event listeners and hover effects for remove buttons
        domainsList
            .querySelectorAll(".openinnewtabs-remove-domain")
            .forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const domain = e.target.getAttribute("data-domain")
                    removeDomainFromWhitelist(domain)
                })

                btn.addEventListener("mouseover", () => {
                    btn.style.transform = "translateY(-1px)"
                    btn.style.boxShadow = "0 4px 12px rgba(244, 67, 54, 0.4)"
                })

                btn.addEventListener("mouseout", () => {
                    btn.style.transform = "translateY(0)"
                    btn.style.boxShadow = "0 2px 8px rgba(244, 67, 54, 0.3)"
                })
            })

        // Add hover effects for domain items
        domainsList
            .querySelectorAll(".openinnewtabs-domain-item")
            .forEach((item) => {
                item.addEventListener("mouseover", () => {
                    item.style.transform = "translateY(-1px)"
                    item.style.boxShadow = `0 4px 12px ${colors.shadowColor}`
                })

                item.addEventListener("mouseout", () => {
                    item.style.transform = "translateY(0)"
                    item.style.boxShadow = "none"
                })
            })
    }

    /**
     * Open whitelist management modal
     */
    function openWhitelistManager() {
        let modal = document.querySelector(".openinnewtabs-modal")
        if (!modal) {
            modal = createWhitelistModal()
        }
        modal.style.display = "block"
        updateWhitelistDisplay()
    }

    /**
     * Force all links to open in new tab
     */
    function forceNewTab() {
        if (!isWhitelisted()) {
            return
        }

        // Handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const links = node.querySelectorAll("a[href]")
                        links.forEach((link) => {
                            if (
                                !link.target &&
                                !link.hasAttribute("download")
                            ) {
                                link.target = "_blank"
                                link.rel = "noopener noreferrer"
                            }
                        })
                    }
                })
            })
        })

        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })

        // Handle existing links immediately
        document.querySelectorAll("a[href]").forEach((link) => {
            if (!link.target && !link.hasAttribute("download")) {
                link.target = "_blank"
                link.rel = "noopener noreferrer"
            }
        })
    }

    // Initialize when DOM is ready
    function initialize() {
        const lang = detectLanguage()

        // Register menu command for adding current domain to whitelist
        GM_registerMenuCommand(
            getText("addToWhitelist", lang),
            addCurrentDomainToWhitelist
        )

        // Register menu command for whitelist management
        GM_registerMenuCommand(
            getText("manageWhitelist", lang),
            openWhitelistManager
        )

        // Start forcing new tab
        forceNewTab()
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize)
    } else {
        initialize()
    }
})()
