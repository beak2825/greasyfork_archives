// ==UserScript==
// @name         1lou.info 帖子过滤 + 自动右键加入黑名单
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  过滤黑名单帖子，并右键选中内容自动加入黑名单
// @author       Jifu
// @match        https://www.1lou.info/*
// @icon         https://images.megabit.co.nz/images/uploads/2025-09-01_231356_087.png
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548027/1louinfo%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%20%2B%20%E8%87%AA%E5%8A%A8%E5%8F%B3%E9%94%AE%E5%8A%A0%E5%85%A5%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/548027/1louinfo%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%20%2B%20%E8%87%AA%E5%8A%A8%E5%8F%B3%E9%94%AE%E5%8A%A0%E5%85%A5%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

;(function () {
    "use strict"

    let blacklist = GM_getValue("blacklist", ["惊悚", "恐怖"])
    let menuId = []

    // 🔹 过滤帖子
    function filterThreads() {
        document
            .querySelectorAll("li.media.thread.tap.hidden-sm")
            .forEach((li) => {
                const tags = Array.from(
                    li.querySelectorAll("a.badge.badge-pill.badge-light")
                ).map((a) => a.textContent.trim())

                const titleEl = li.querySelector(".text-title")
                const title = titleEl ? titleEl.textContent.trim() : ""

                if (
                    tags.some((tag) => blacklist.includes(tag)) ||
                    blacklist.some((word) => title.includes(word))
                ) {
                    li.style.display = "none"
                    console.log("🚫 已隐藏帖子:", title || tags.join(", "))
                }
            })
    }

    filterThreads()
    const observer = new MutationObserver(() => filterThreads())
    observer.observe(document.body, { childList: true, subtree: true })

    // 🔹 右键选中文本加入黑名单
    document.addEventListener("contextmenu", (e) => {
        setTimeout(() => {
            var selectedText = window.getSelection().toString().trim()
            const matches = selectedText.match(/\[([^\]]+)\]/g); // 匹配所有中括号内容，包括括号
            if (matches && matches.length >= 2) {
                selectedText = matches[1].slice(1, -1); // 去掉中括号
            } else {
                console.log("没有找到第二个中括号内容");
            }
            if (selectedText && selectedText.length >= 3 && !blacklist.includes(selectedText)) {
                blacklist.push(selectedText)
                GM_setValue("blacklist", blacklist)
                console.log("✅ 自动加入黑名单:", selectedText)
                filterThreads()
                registerMenuCommand()
            }
        }, 50) // 延迟50ms确保获取选区
    })

    // 🔹 菜单管理
    function registerMenuCommand() {
        if (menuId.length) {
            for (let i = 0; i < menuId.length; i++) {
                GM_unregisterMenuCommand(menuId[i])
            }
            menuId = []
        }
        // 1. 当前黑名单
        menuId.push(
            GM_registerMenuCommand(
                "📋 当前黑名单: " + blacklist.join(", "),
                () => {
                    alert("黑名单标签:\n" + blacklist.join("\n"))
                }
            )
        )
        // 2. 手动添加黑名单
        menuId.push(
            GM_registerMenuCommand("➕ 手动添加黑名单", () => {
                const tag = prompt("请输入要屏蔽的标签/关键词:")
                if (tag && !blacklist.includes(tag.trim())) {
                    blacklist.push(tag.trim())
                    GM_setValue("blacklist", blacklist)
                    alert(`已添加: ${tag}`)
                    filterThreads()
                    registerMenuCommand()
                }
            })
        )

        // 3. 清空黑名单
        menuId.push(
            GM_registerMenuCommand("🗑️ 清空黑名单", () => {
                blacklist = []
                GM_setValue("blacklist", blacklist)
                alert("黑名单已清空")
                filterThreads()
                registerMenuCommand()
            })
        )

        // 4. 重新过滤页面
        menuId.push(
            GM_registerMenuCommand("🔄 重新过滤页面", () => {
                filterThreads()
            })
        )

        // 5. 导出黑名单
        menuId.push(
            GM_registerMenuCommand("📤 导出黑名单", () => {
                if (blacklist.length === 0) {
                    alert("黑名单为空")
                    return
                }
                // 直接复制到剪贴板
                const text = blacklist.join("\n")
                navigator.clipboard.writeText(text).then(
                    () => {
                        alert("黑名单已复制到剪贴板:\n" + text)
                    },
                    () => {
                        alert("复制失败，请手动复制:\n" + text)
                    }
                )
            })
        )

        // 6. 导出黑名单为 txt 文件
        menuId.push(
            GM_registerMenuCommand("💾 下载黑名单文件", () => {
                if (blacklist.length === 0) {
                    alert("黑名单为空")
                    return
                }
                const blob = new Blob([blacklist.join("\n")], {
                    type: "text/plain;charset=utf-8",
                })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "blacklist.txt" // 文件名
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                alert("黑名单已下载为 blacklist.txt")
            })
        )
        // 7. 导入黑名单
        menuId.push(
            GM_registerMenuCommand("📥 导入黑名单文件", () => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = ".txt"
                input.style.display = "none"
                input.onchange = (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (event) => {
                        const lines = event.target.result
                            .split(/\r?\n/)
                            .map(line => line.trim())
                            .filter(line => line.length > 0)
                        // 合并到现有黑名单
                        lines.forEach(line => {
                            if (!blacklist.includes(line)) {
                                blacklist.push(line)
                            }
                        })
                        GM_setValue("blacklist", blacklist)
                        filterThreads()
                        registerMenuCommand()
                        alert(`已导入 ${lines.length} 个黑名单条目`)
                    }
                    reader.readAsText(file, "utf-8")
                }
                document.body.appendChild(input)
                input.click()
                document.body.removeChild(input)
            })
        )

    }

    registerMenuCommand()
})()
