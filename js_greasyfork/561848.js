// ==UserScript==
// @name         哔哩哔哩过滤视频
// @namespace    https://github.com/girl-dream/
// @version      1.0.0
// @description  根据关键词过滤视频
// @author       girl-dream
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      The Unlicense
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561848/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%87%E6%BB%A4%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/561848/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%87%E6%BB%A4%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(async () => {
    'use strict'

    let keyWords = GM_getValue('filter_keywords', [
        'Rust',
        '00'
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
                每行一个关键词/正则表达式,视频包含任意关键词即被过滤
            </p>
            <textarea id="keywords-input"
                     style="width: 90%;
                     background: var(--bg2);
                            height: 200px;
                            padding: 10px;
                            border: 1px solid var(--Ga1);
                            border-radius: 4px;
                            resize: vertical;
                            margin-bottom: 15px;"></textarea>
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

    if (window.location.href == 'https://www.bilibili.com/') {
        document.querySelectorAll('.feed-card').forEach(e => {
            let title = e.querySelector('.bili-video-card__info a')
            dom(e, title?.textContent)
        })
    }

    if (window.location.href.startsWith('https://www.bilibili.com/video/')) {
        // 视频页 todo临时方案
        setTimeout(() => {
            document.querySelectorAll('.video-page-card-small').forEach(e => {
                let title = e.querySelector('p')
                dom(e, title?.textContent)
            }
            )

            document.querySelector('.rec-footer').onclick = () => {
                document.querySelectorAll('.video-page-card-small').forEach(e => {
                    let title = e.querySelector('p')
                    dom(e, title?.textContent)
                }
                )
            }

        }, 3000)
    }

    const originalFetch = window.fetch
    window.fetch = async (...args) => {
        let bool
        // 首页
        if (args[0].includes('web-interface/wbi/index/top/feed/rcmd')) {
            bool = true
        }

        const response = await originalFetch.apply(this, args)

        if (bool) {
            let data = await response.json()
            let list = data['data']['item']
            list.forEach(e => {
                if (filter(e['title'])) {
                    list.splice(list.indexOf(e), 1)
                }
            })
            return new Response(JSON.stringify(data), response)
        }
        return response
    }
})();
