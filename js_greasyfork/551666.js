// ==UserScript==
// @name         Colab Pro 计算单元外显
// @namespace    http://tampermonkey.net/
// @version      2025-10-05
// @description  实时显示 Colab Pro 当前消耗的运行时单元
// @author       ctrn43062
// @match        https://colab.research.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=colab.research.google.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551666/Colab%20Pro%20%E8%AE%A1%E7%AE%97%E5%8D%95%E5%85%83%E5%A4%96%E6%98%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/551666/Colab%20Pro%20%E8%AE%A1%E7%AE%97%E5%8D%95%E5%85%83%E5%A4%96%E6%98%BE.meta.js
// ==/UserScript==

// 不同运行时每小时消耗的计算单元
const RUNTIME_UNITS_PERHOURS = {
    'CPU': 0.07,
    'L4': 1.71,
    'T4': 1.32,
    'A100': 5
}

// 保存当前运行时类型
const global = {
    CURRENT_RUNTIME: null,
    close: false,
    cancelQueryRuntime: false
}

GM_addStyle(`
#floating-container {
  z-index: 114514;
  position: fixed;
  top: 20%;
  right: 5%;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  padding: 5px;
}

#inner-info-container {
 display: flex;
 flex-flow: column;
}

#floating-container p {
  margin: 5px;
  font-size: 12px;
}

#time {
display: flex;
flex-flow: column;
}

#time span {
 margin-bottom: 2px
}

#close {
font-size: 24px;
margin: 4px 0 0 8px;
}
`)

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}

async function watingForRuntimeConnected() {
    const query = () => document.querySelector("body > div.notebook-vertical > colab-status-bar")?.shadowRoot?.querySelector("span.right > colab-runtime-status")?.shadowRoot?.querySelector("#runtime-options")?.shadowRoot?.querySelector("#button > span.label > slot")
    let el = query()

    while(!global.close && !global.cancelQueryRuntime && !el ) {
        console.info('wating for connection')
        el = query()
        await sleep(1000)
    }

    return el
}

function updateTime(innerInfoContainer) {
    const s = innerInfoContainer.querySelector.bind(innerInfoContainer)
    const runtime = s('#runtime').value

    const [unitsPerHoursEl, start, current, duration] = [s('#units'), s('#start'), s('#current'), s('#duration')]

    const formatTime = (date) => {
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
   }


    const now = new Date()
    if(!start.textContent) {
        start.innerText = 'start: ' + formatTime(now)
        start.startTimestamp = now.getTime()
    }

    current.innerText = 'current: ' + formatTime(now)
    const durationMinutes = ((now.getTime() - start.startTimestamp) / 1000 / 60).toFixed(1)
    duration.innerText = `duration: ${durationMinutes} min`
    const usedUnitsEl = s('#used-units')
    const { CURRENT_RUNTIME } = global

    const unitsPerHours = RUNTIME_UNITS_PERHOURS[runtime == 'Unknown' ? CURRENT_RUNTIME : runtime] || 'N/A'
    unitsPerHoursEl.innerText = `~ ${unitsPerHours}/hr`

    if(unitsPerHours <= 0) {
        usedUnitsEl.innerText = `Unkonwn runtime: ${runtime}`
        return
    }

    const usedUnits= ((unitsPerHours / 60) * durationMinutes).toFixed(3)
    usedUnitsEl.innerText = `Used Units: ${runtime} ${usedUnits}`
}


async function init() {
    const floatingContainer = document.createElement('div')
    floatingContainer.id = 'floating-container'
    const innerInfoContainer = document.createElement('div')
    innerInfoContainer.id = 'inner-info-container'

    floatingContainer.appendChild(innerInfoContainer)

    innerInfoContainer.innerHTML = `
    <div>
    <label for="runtime">Runtime</label>
    <select id="runtime">
        <option value="Unknown">Unknown</option>
        <option value="CPU">CPU</option>
        <option value="T4">GPU T4</option>
        <option value="L4">GPU L4</option>
    </select>
    <span id="close">×</span>
    </div>

    <p id="time">
        <span id="units"></span>
        <span id="start"></span>
        <span id="current"></span>
        <span id="duration"></span>
    </p>
    <p id="used-units"></p>
 `

    innerInfoContainer.querySelector('#close').addEventListener('click', () => {
        floatingContainer.remove()
    })

    // 用户手动选择运行时，停止轮询运行时
    innerInfoContainer.querySelector('#runtime').addEventListener('change', () => {
        global.cancelQueryRuntime = true
    })

    document.body.appendChild(floatingContainer)

    updateTime(innerInfoContainer)

    const runtimeLabel = await watingForRuntimeConnected()
    // 轮询到运行时
    if(!global.cancelQueryRuntime) {
        const runtime = runtimeLabel.assignedNodes()[0].textContent.split(/\s/g)[0]
        // 已连接，并且找到 GPU
        if(RUNTIME_UNITS_PERHOURS[runtime]) {
            global.CURRENT_RUNTIME = runtime
        } else {
            // 已连接但是没找到 GPU
            global.CURRENT_RUNTIME = 'CPU'
        }

        innerInfoContainer.querySelector('#runtime').value = global.CURRENT_RUNTIME
    }

    const timer = setInterval(() => {
        updateTime(innerInfoContainer)

        if(global.close) {
            clearInterval(timer)
        }
    }, 1000)
    }

(function() {
    'use strict';
    init()
})();