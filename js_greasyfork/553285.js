// ==UserScript==
// @name         隐藏手机端知乎跳转app按钮
// @namespace    none
// @version      1.0.0.6
// @description  删除主页和问题页的app按钮,回答页标题栏增加跳转,主要为了适配Via浏览器
// @author       ming
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553285/%E9%9A%90%E8%97%8F%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%ACapp%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/553285/%E9%9A%90%E8%97%8F%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%ACapp%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const removeDiv = () => {
        const need_remove = [
            'div.OpenInAppButton.is-higher.css-189wwwq',
            'css-wfkf2m',
            'OpenInAppButton is-higher css-189wwwq',
            'css-1gapyfo',
        ]

        for (const name of need_remove) {
            const elements = document.getElementsByClassName(name)
            if (elements.length > 0) {
                elements[0].remove()
            }
        }

        const btn = document.querySelector('button.Button.Button--secondary.Button--grey.css-ebmf5v')
        if (btn) { btn.click() }

        loaded()
    }

    //via不会触发load事件
    var run_once = false
    const loaded = () => {
        if (run_once)
            return
        run_once = true
        let quest_link = window.location.href.split("/answer")
        if (quest_link.length > 0) {
            const questionDiv = document.querySelector('div[data-za-detail-view-element_name="Question"].QuestionHeader-title')
            const link = document.createElement('a')
            link.href = quest_link[0]
            link.textContent = `${questionDiv.textContent}  (超链接)`
            questionDiv.textContent = ''
            questionDiv.appendChild(link)
        }
    }

    window.addEventListener('load', loaded)
    const observer = new MutationObserver(removeDiv)
    observer.observe(document.body, { childList: true, subtree: true })
})()