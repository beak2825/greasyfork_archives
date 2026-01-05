// ==UserScript==
// @name         SteamPY叮咚鸡
// @namespace    https://docs.scriptcat.org/
// @version      0.1.0
// @description  美化你的STEAMPY
// @author       Harmog
// @run-at       document-end
// @match        https://steampy.com/*
// @match        https://steampy.com
// @supportURL   https://github.com/heerheer/SteamPY-DDJ
// @icon         https://raw.githubusercontent.com/heerheer/SteamPY-DDJ/main/%E5%8F%AE%E5%92%9A%E9%B8%A1_removebg.png
// @grant        none
// @license      MIT   
// @downloadURL https://update.greasyfork.org/scripts/558988/SteamPY%E5%8F%AE%E5%92%9A%E9%B8%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/558988/SteamPY%E5%8F%AE%E5%92%9A%E9%B8%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待某个元素出现
    function waitForElement(selector, callback) {
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            }
        }, 300);
    }

    function hookSPAPageChange(onChange) {
        const _push = history.pushState
        const _replace = history.replaceState

        function handle() {
            onChange()
        }

        history.pushState = function () {
            _push.apply(this, arguments)
            handle()
        }

        history.replaceState = function () {
            _replace.apply(this, arguments)
            handle()
        }

        window.addEventListener('popstate', handle)
    }

    // 有关/cdkey页面的美化
    function registerCdkeyPage() {
        // 卡片动画
        function injectEnterAnimationStyle() {
            if (document.getElementById('tm-enter-style')) return

            const style = document.createElement('style')
            style.id = 'tm-enter-style'
            style.textContent = `
            .tm-enter {
                opacity: 0;
                transform: translateY(12px) scale(0.98);
            }
            .tm-enter.tm-enter-active {
                opacity: 1;
                transform: translateY(0) scale(1);
                transition:
                    opacity 0.35s ease-out,
                    transform 0.35s cubic-bezier(.22,.61,.36,1);
            }
            `
            document.head.appendChild(style)
        }

        function animateGameBlocks(blocks) {
            blocks.forEach((el, i) => {
                if (el.dataset.tmAnimated) return
                el.dataset.tmAnimated = '1'

                el.classList.add('tm-enter')

                // 错峰入场（关键）
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        el.classList.add('tm-enter-active')
                    }, i * 30) // 40ms 间隔，很舒服
                })
            })
        }

        injectEnterAnimationStyle()

        // 首次页面已有的
        animateGameBlocks(
            document.querySelectorAll('.gameblock')
        )

        // 监听 Vue SPA 后续渲染
        const observer = new MutationObserver(mutations => {
            const added = []
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return
                    if (node.classList?.contains('gameblock')) {
                        added.push(node)
                    } else {
                        added.push(...node.querySelectorAll?.('.gameblock') || [])
                    }
                })
            })
            if (added.length) {
                animateGameBlocks(added)
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        let lastSignature = ''

        function onListChanged() {
            const blocks = document.querySelectorAll('.gameblock')
            if (!blocks.length) return

            // 用内容生成签名（id / 文本都行）
            const signature = [...blocks].map(el => el.textContent.slice(0, 20)).join('|')

            if (signature === lastSignature) return
            lastSignature = signature

            // reset
            blocks.forEach(el => {
                el.classList.remove('tm-enter', 'tm-enter-active')
                delete el.dataset.tmAnimated
            })

            requestAnimationFrame(() => {
                animateGameBlocks(blocks)
            })
        }

        const listObserver = new MutationObserver(onListChanged)
        listObserver.observe(document.body, {
            childList: true,
            subtree: true
        })
    }

    registerCdkeyPage();

    //删除无用元素
    waitForElement('.contactTip', (el) => {
        el.remove()
    })


    //registerCdkeyTable();
    // Your code here...
})();
