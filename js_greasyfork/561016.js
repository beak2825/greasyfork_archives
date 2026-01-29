// ==UserScript==
// @name         哔哩哔哩过滤评论区
// @description  根据关键词过滤评论区
// @version      2.0.2
// @author       girl-dream
// @license      The Unlicense
// @namespace    https://github.com/girl-dream/
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://space.bilibili.com/*/dynamic
// @match        https://www.bilibili.com/v/topic/detail/*
// @match        https://www.bilibili.com/cheese/play/*
// @match        https://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/blackboard/*
// @match        https://www.bilibili.com/blackroom/ban/*
// @match        https://www.bilibili.com/read/*
// @match        https://manga.bilibili.com/*
// @match        https://www.bilibili.com/v/topic/detail*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561016/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%87%E6%BB%A4%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561016/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%87%E6%BB%A4%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(async () => {
    'use strict'
    let keyWords = GM_getValue('filter_keywords', [
        '关于我升',
        '六级不在',
        '拍个照',
        '合个影',
        '新年快乐'
    ])

    GM_registerMenuCommand('设置过滤关键词', () => {
        if (document.getElementById('bili-filter-settings')) return
        const div = document.createElement('div')
        div.id = 'bili-filter-settings'
        div.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        `
        const content = document.createElement('div')
        content.style.cssText = `
            background: var(--bg1_float);
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color:var(--text1);
        `
        content.innerHTML = `
            <div style="font-size: 1.5rem;">过滤关键词设置</div>
            <p style="color: var(--brt-placeholder-color, var(--text3, #9499a0)); font-size: 14px; margin-bottom: 15px;">
                每行一个关键词/正则表达式,评论包含任意关键词即被过滤
            </p>
            <textarea id="keywords-input"
                     style="background: var(--bg2);
                            height: 200px;
                            padding: 10px;
                            border: 1px solid var(--Ga1);
                            border-radius: 4px;
                            resize: vertical;
                            margin-bottom: 15px;
                            color: var(--text1);
                            box-sizing: border-box;
                            width: 100%;"></textarea>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancel-btn" style="padding: 8px 16px; border: none; background: var(--bpx-dmsend-disable-button-bg,#e7e7e7); border-radius: 4px; cursor: pointer;">
                    取消
                </button>
                <button id="save-btn" style="padding: 8px 16px; border: none; background: var(--brand_blue); color: white; border-radius: 4px; cursor: pointer;">
                    保存
                </button>
            </div>
        `

        // 填充当前关键词
        const textarea = content.querySelector('#keywords-input')
        textarea.value = keyWords.join('\n')

        // 事件处理
        content.querySelector('#cancel-btn').onclick = () => {
            div.remove()
        }

        content.querySelector('#save-btn').onclick = () => {
            const newKeywords = textarea.value
                .split('\n')
                .map(k => k.trim())
                .filter(k => k.length > 0)

            GM_setValue('filter_keywords', newKeywords)
            keyWords = newKeywords
            div.remove()
            location.reload()
        }
        div.appendChild(content)
        document.body.appendChild(div)
    })


    const filterReplies = (replies) => {
        return replies.filter(reply => {
            const msg = reply.content?.message || ''

            // 检查是否包含关键词
            const hasKeyword = keyWords.some(keyword => {
                if (keyword.startsWith('/') && keyword.lastIndexOf('/') > 1) {
                    try {
                        const lastSlash = keyword.lastIndexOf('/')
                        const pattern = keyword.substring(1, lastSlash)
                        const flags = keyword.substring(lastSlash + 1)
                        return new RegExp(pattern, flags).test(msg)
                    } catch {
                        console.error('无效的正则表达式:', keyword)
                        return false
                    }
                } else {
                    return msg.includes(keyword)
                }
            })

            // 如果包含关键词,过滤掉
            if (hasKeyword) {
                return false
            }

            // 如果当前回复有子回复,递归过滤
            if (reply.replies && Array.isArray(reply.replies)) {
                reply.replies = filterReplies(reply.replies)
                // 如果子回复数组为空,设置为 null
                if (reply.replies.length == 0) {
                    reply.replies = null
                }
            }

            return true
        })
    }

    const originalFetch = window.fetch

    unsafeWindow.fetch = async (...args) => {
        const response = await originalFetch.apply(this, args)

        const clonedResponse = response.clone()

        if (args[0].includes('reply')) {

            let data = await clonedResponse.json()

            if (data.data?.replies && Array.isArray(data.data?.replies)) {
                data.data.replies = filterReplies(data.data.replies)
                return new Response(JSON.stringify(data), response)
            }
        }
        return response
    }
})()