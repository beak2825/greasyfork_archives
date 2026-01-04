// ==UserScript==
// @name         哔哩哔哩过滤评论区
// @namespace    https://github.com/girl-dream/
// @version      1.1.2
// @description  根据关键词过滤评论区
// @author       girl-dream
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @license      The Unlicense
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
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

    const isElementLoaded = async (selector, root = document) => {
        const getElement = () => root.querySelector(selector)
        return new Promise((resolve) => {
            const element = getElement()
            if (element) return resolve(element)
            const observer = new MutationObserver(() => {
                const element2 = getElement()
                if (!element2) return
                resolve(element2)
                observer.disconnect()
            })
            observer.observe(root === document ? root.documentElement : root, {
                childList: true,
                subtree: true
            })
        })
    }

    function f(selector, root = document) {
        return new Promise((resolve) => {
            let timer = setInterval(async () => {
                let temp = await isElementLoaded(selector, root)
                if (temp.shadowRoot) {
                    clearInterval(timer)
                    resolve(temp.shadowRoot)
                }
            }, 100)
        })
    }

    const feed = await isElementLoaded('#feed', await f('bili-comments'))
    feed.children.forEach(async (node) => {
        if (Boolean(node.shadowRoot)) {
            let text = (await f('#comment', node.shadowRoot)).querySelector('#content bili-rich-text').shadowRoot.querySelector('span').innerHTML
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
    })

    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(async (node) => {
                if (Boolean(node.shadowRoot)) {
                    let text = (await f('#comment', node.shadowRoot)).querySelector('#content bili-rich-text').shadowRoot.querySelector('span').innerHTML
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
            })
        })
    })

    observer.observe(feed, { childList: true, subtree: true, characterData: true })
})();

