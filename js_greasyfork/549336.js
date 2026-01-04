// ==UserScript==
// @name         ZodGame 一键签到/赚分
// @namespace    https://greasyfork.org/zh-CN/users/309232-3989364
// @version      2025-08-31
// @description  在 Zod 首页添加一键签到/赚分按钮
// @author       ctrn43062
// @match        https://zodgame.xyz/
// @match        https://zodgame.xyz/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zodgame.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549336/ZodGame%20%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0%E8%B5%9A%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/549336/ZodGame%20%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0%E8%B5%9A%E5%88%86.meta.js
// ==/UserScript==

const parseDOMFromString = (text) => {
    const parser = new DOMParser()
    return parser.parseFromString(text, 'text/html')
}

const getPageDOM = async (url, params) => {
    const resp = await fetch(url, params)
    const text = await resp.text()

    return parseDOMFromString(text)
}

/**
* 执行签到，返回签到结果
*/
const doSign = async () => {
    const dom = await getPageDOM('plugin.php?id=dsu_paulsign:sign')
    const formhash = document.querySelector('#scbar_form input[name="formhash"]').value

    const formData = new FormData()
    formData.append('formhash', formhash)
    formData.append('qdxq', 'fd')

    const api = `plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1`

    const resp = await fetch(api, {
        method: 'POST',
        body: formData,
    })

    const text = await resp.text()

    return parseDOMFromString(text).querySelector('.c').textContent.trim()
}

const sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout( () => resolve(), ms)
    }
                      )
}

/**
* 点击赚分
*/
const getAdUrlList = async () => {
    const dom = await getPageDOM('plugin.php?id=jnbux')
    // 获取任务列表
    const taskElementList = Array.from(dom.querySelectorAll("#wp tr > td:last-child > a") || [])

    if (!taskElementList.length) {
        return []
    }

    const openWindowFnNameList = taskElementList.map(el => el.getAttribute('onclick').toString().match(/(open\w+)/)).filter(s => s).map(s => s[1])

    if (!openWindowFnNameList.length) {
        throw '无法获取打开新窗口函数名'
    }

    // 获取脚本中打开新窗口的代码文本
    const openWindowFnCodeList = [...dom.querySelectorAll('script')].map(el => el.textContent).filter(text => openWindowFnNameList.some(name => text.match(new RegExp(`function ${name}`))))

    // 获取广告 url
    const adUrlList = openWindowFnCodeList.map(s => s.match(/window\.open\("(.+?)"\)?/)[1])

    return adUrlList
}

const watchAD = async (adUrl) => {
    return new Promise( (resolve, reject) => {
        const iframe = document.createElement('iframe')
        iframe.src = adUrl

        iframe.sandbox.add('allow-same-origin')
        iframe.sandbox.add('allow-scripts')

        Object.assign(iframe.style, {
            display: 'none'
        })

        iframe.addEventListener('load', async () => {
            for (let cnt = 0; cnt < 200; cnt++) {
                const selector = (iframe.contentDocument || iframe.contentWindow.document)

                if (selector) {
                    const status = selector.querySelector('.jnbux_hd')

                    if (status && status.textContent.includes('成功')) {
                        iframe.remove()
                        // 执行成功回调
                        return resolve()
                    }
                }

                await sleep(500)
            }

            reject('任务超时')
        }
                               )

        document.documentElement.appendChild(iframe)
    }
                      )
}

const messages = []

function writeLog(message, logEl, append=true) {
    console.info(message)
    if (logEl) {
        if (append) {
            logEl.textContent += message + '\n\n'
        } else {
            logEl.textContent = message
        }
    }
}

async function main() {
    const initLogger = () => {
        if (typeof showDialog == 'function') {
            window.showDialog('', 'notice')
            const dialogContentEl = document.querySelector('#fwin_dialog .alert_info')

            Object.assign(dialogContentEl.style, {
                'white-space': 'break-spaces',
                'word-break': 'break-all'
            })

            return (message) => writeLog(message, dialogContentEl, true)
        } else {
            alert('点击确认按钮开始执行任务，F12 打开控制台查看执行结果')
            return writeLog
        }
    }

    const writeLogDefault = initLogger()
    writeLogDefault('* 此窗口关闭后可在控制台查看执行过程；观看广告任务开始后请勿刷新页面导致无法获取奖励')

    writeLogDefault('开始签到：')
    writeLogDefault(await doSign())

    writeLogDefault('开始获取点击赚分任务列表：')
    debugger
    const adUrlList = await getAdUrlList()

    if (adUrlList.length) {
        let no = 1
        for (const url of adUrlList) {
            writeLogDefault('观看广告： ' + no)
            await watchAD(url)
            no++
        }
    } else {
        writeLogDefault('未找到可观看广告/所有任务已完成')
    }

    writeLogDefault('任务完成，请关闭该窗口')
}

function createOperationButton() {
    const qmenu = document.querySelector('#qmenu')
    const btn = document.createElement('a')
    btn.id = 'qmenu'
    btn.innerText = `一键签到/赚分`
    btn.href = '#'

    qmenu.parentElement.insertBefore(btn, qmenu)

    btn.addEventListener('click', async (e) => {
        e.preventDefault()
        await main()
    })
}


(function() {
    'use strict';
    createOperationButton()
})();