// ==UserScript==
// @name         哔哩哔哩过滤视频
// @namespace    https://github.com/girl-dream/
// @version      1.0.1
// @description  根据关键词过滤视频
// @author       girl-dream
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/video/*
// @match        https://search.bilibili.com/*
// @license      The Unlicensea
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561848/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%87%E6%BB%A4%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/561848/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%87%E6%BB%A4%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(() => {
    'use strict'

    const url = window.location.href.split('?')[0]
    let keyWords = GM_getValue('filter_keywords', [
        '终末地'
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
            max-height: 80vh;
            overflow-y: auto;
            color:var(--text1);
        `
        content.innerHTML = `
            <div style="font-size: 1.5rem;margin-bottom: 10px;">过滤关键词设置</div>
            <p style="color: var(--brt-placeholder-color, var(--text3, #9499a0)); font-size: 14px; margin-bottom: 15px;">
                每行一个关键词/正则表达式,评论包含任意关键词即被过滤
            </p>
            <textarea id="keywords-input"
                    style="width: 100%;
                    background: var(--bg2);
                    box-sizing: border-box;
                    height: 200px;
                    padding: 10px;
                    border: 1px solid var(--Ga1);
                    border-radius: 4px;
                    resize: vertical;
                    margin-bottom: 15px;
                    font-size: 1rem;
                    color: var(--text1);"></textarea>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancel-btn" style="padding: 8px 16px; border: none; background: var(--bpx-dmsend-disable-button-bg,var(--graph_bg_thin));color: var(--text1);border-radius: 4px; cursor: pointer;">
                    取消
                </button>
                <button id="save-btn" style="padding: 8px 16px; border: none; background: var(--brand_blue); color: var(--text1); border-radius: 4px; cursor: pointer;">
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

    // 检测评论并删除
    const dom = (node, text) => {
        if (keyWords.some((item) => {
            if (item.startsWith('/') && item.lastIndexOf('/') > 0 && eval(item) instanceof RegExp) {
                return eval(item).test(text)
            } else {
                return text.includes(item)
            }
        })) {
            node.remove()
        }
    }

    if (url == 'https://www.bilibili.com/') {
        document.querySelectorAll('.feed-card').forEach(card => {
            const title = card.querySelector('.bili-video-card__info a')?.textContent
            title && dom(card, title)
        })
    }

    if (url.startsWith('https://www.bilibili.com/video/')) {
        if (document.querySelector('.rec-list').children.length == 0) return
        const fn = () => {
            document.querySelectorAll('.card-box').forEach(e => {
                const title = e.querySelector('p')?.textContent
                title && dom(e, title)
            })
        }

        fn()

        document.querySelector('.rec-footer').onclick = () => {
            fn()
        }
    }

    if (url.startsWith('https://search.bilibili.com')) {
        document.querySelectorAll('.bili-video-card__info--tit').forEach(e => {
            const container = e.closest('.video-list-item, .col_3')
            container && dom(container, e.textContent.trim())
        })
    }

    const filterReplies = (e) => {
        return e.filter(e => {
            const title = e.title || ''

            // 检查是否包含关键词
            return !keyWords.some(keyword => {
                if (keyword.startsWith('/') && keyword.lastIndexOf('/') > 0 && eval(keyword) instanceof RegExp) {
                    return eval(keyword).test(title)
                } else {
                    return title.includes(keyword)
                }
            })

        })
    }

    const originalFetch = window.fetch
    unsafeWindow.fetch = async (...args) => {
        const response = await originalFetch.apply(this, args)
        const clonedResponse = response.clone()
        if (args[0].includes('top/feed/rcmd')) {
            let data = await clonedResponse.json()
            if (data.data?.item && Array.isArray(data.data?.item)) {
                data.data.item = filterReplies(data.data.item)
                return new Response(JSON.stringify(data), response)
            }
        }
        if (args[0].includes('search/type')) {
            let data = await clonedResponse.json()
            if (data.data?.result && Array.isArray(data.data?.result)) {
                data.data.result = filterReplies(data.data.result)
                return new Response(JSON.stringify(data), response)
            }
        }
        return response
    }
})();
