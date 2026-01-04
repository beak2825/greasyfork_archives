// ==UserScript==
// @name         Twitter 添加顶部底部按钮
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  添加回到顶/底部按钮
// @author       Ari
// @match        *.twitter.com/*
// @match        *.x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/558314/Twitter%20%E6%B7%BB%E5%8A%A0%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/558314/Twitter%20%E6%B7%BB%E5%8A%A0%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

;(function () {
  ;('use strict')

  // 顶部按钮图标 (Base64)
  const top =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABIklEQVR4nO2W207DMAxAXb4k/jYekPYT3ARsIO44HfCX9jMYbaVoQilytyWkko/kt6g9p02jAjiO4ziO4zhZQJITjDKHCcvr90wrAqOcbsj3s4ApgCRnCfluSK6hZpDkfFD+Z/gGpisvdUZglPnAllmuJx1Sx4cdSC5SgoHkHY71AFSbQPySXBP5tm75nhojQpRLk7wt4q6sPMnVKHlDBBLf1y1vjVBt8pirNhj5YSd5U4Qs9x+xkid+3It88QjNIG+JiPK6e0S3bZ6yyNsi3raP6C78nFXeGjH6XiXlc0RglLbcCfH7exv8d2rBChIfYuSPIk/e8iaIP5F4BmPYjCgmn4rYRr4ntHy0fnU5t82fJ6C0K4fBNY7jOI7jOI4D/8kXHULAQQ3MPf4AAAAASUVORK5CYII='

  // 底部按钮图标 (Base64)
  const bottom =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNUlEQVR4nO2WWU4DMQxAU04S340/DkFZW/bVnoI4pf0NRgOa0kpTl8w0USr5Sfls8l6WUUNwHMdxHMdxnCoB4kMgeQ/HelB8cdVJRH4FkqMR8vwJJBpJPopGqE4iCbZrA/JXcsSqfDeKReiKfDdSI4CkWZtgOZEs2gVyygPKondtkiZpooj80jdRtpPQnp3/GwPeYbsbxM9FInSL/OBTLxGhpvzb+Cv7cy/5KUuEGvI7fW+/J/G404hi8jki7GvTZP3SRZTZqAhz5/khq/wyguRyUIQhH4nvs4uvRaBcJEXY8ndF5ZMjapTviCTnZoQlj3wbagBI5ps+h8Z/m3moCUA52yDaM/gm1AignG6VR7kONQMkJ0bAVdgHoD9iP+Q7AGVa7YNNikCZ/vsHjuM4juM4TkjhG1BTwHjA3CU3AAAAAElFTkSuQmCC'

  const name = 'Twitter Helper'
  const logPrefix = ['%c' + name, `background:#1d9bf0;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`]
  function log(...args) {
    console.log(...logPrefix, ...args)
  }

  function addScrollButton() {
    log('addScrollButton...')

    let text = `<div id="nogi-scroll" style="position: fixed;bottom: 100px;left: 55px;z-index: 999;">
      <div class='nogi-line' id='top' >
        <img class='nogi-icon' src="${top}">
      </div>
      <div class='nogi-line' id='bottom' >
        <img class='nogi-icon' src="${bottom}">
      </div>
    </div>`

    let style = document.createElement('style')
    style.innerHTML = `
    #nogi-scroll {
        display: flex;
        background: transparent;
        border-radius: 26px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    #top {
        display: block;
    }
    #bottom {
        display: block;
    }
    .nogi-line {
        border: 1px solid #1d9bf0;
        border-radius:50%;
        margin: 5px;
        background: white;
    }
    .nogi-line:hover {
        background: #d2ecfd;
    }
    .nogi-icon {
        position: relative;
        border-radius:50%;
        padding: 5px 5px 0px 5px;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
    `

    let el = document.createElement('div')
    el.innerHTML = text

    document.head.append(style)
    document.body.append(el)

    let topButton = document.getElementById('top')
    let bottomButton = document.getElementById('bottom')

    // 回到顶部事件
    topButton.onclick = function () {
      let scrollInterval = setInterval(() => {
        let nowY = window.scrollY;

        // 到达顶部（或非常接近顶部）时停止
        if (nowY <= 0) {
          clearInterval(scrollInterval);
          window.scrollTo(0, 0); // 确保归零
        } else {
          // 每次向上移动剩余距离的 1/5 (模拟减速效果)，最少移动 50px
          let speed = Math.max(50, nowY / 5);
          window.scrollBy(0, -speed);
        }
      }, 15); // 每 15ms 执行一次，比原生 smooth 更强硬
    }

    // 去到底部事件
    bottomButton.onclick = function () {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }
  }


  // 每隔0.5秒检查一次按钮是否存在（防止页面刷新后消失）
  let dd = setInterval(() => {
    let nogiScroll = document.querySelector('#nogi-scroll')
    if (nogiScroll == null) {
      addScrollButton()
    }
  }, 500)

  // 10秒后停止定时检查，节省性能
  window.onload = () => {
    setTimeout(() => {
      clearInterval(dd)
    }, 10000)
  }
})()