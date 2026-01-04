// ==UserScript==
// @license MIT
// @name         抖音-观看体验优化
// @version      1.2
// @namespace    http://tampermonkey.net/
// @description  移除抖音礼物栏，全屏自动关闭右侧聊天栏，删除右上角充值和壁纸按钮
// @author       Jay Wang
// @match        *://*.douyin.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/548070/%E6%8A%96%E9%9F%B3-%E8%A7%82%E7%9C%8B%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548070/%E6%8A%96%E9%9F%B3-%E8%A7%82%E7%9C%8B%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  let timer = null
  // Your code here...
  $(document).ready(function () {
    clearInterval(timer)
    let isChatroomClosed = false
    // header的“充钻石”和“壁纸”图标父元素
    let headerContainer = $(
      '#douyin-header #douyin-header-menuCt pace-island > div'
    )
    // 全屏礼物bar父元素
    let fullscreenGiftContainer = $('.douyin-player-controls-inner').parent()

    // 关闭静音
    setTimeout(() => {
      const e = $.event('keydown')
      e.keyCode = 80 // p
      e.which = 80 // p
      $.event.trigger(e)
    }, 2000)
    timer = setInterval(() => {
      basicRemove()
    }, 500)
    function basicRemove() {
      console.log('关闭按钮')
      // 移除header的“充钻石”和“壁纸”图标
      ;['充钻石', '壁纸'].forEach((text) => {
        removeByText(headerContainer, text)
      })

      // 直播页面
      if (location.href.includes('live.douyin.com')) {
        removeElement($('#BottomLayout'))
        // 移除全屏模式底部礼物bar
        if (!fullscreenGiftContainer.length) {
          fullscreenGiftContainer = $('.douyin-player-controls-inner').parent()
        }
        removeChildElementByIndex(fullscreenGiftContainer, 1)
      }
    }

    // 全屏不显示右侧
    function tryCloseChatroom(attempt = 1) {
      if (attempt > 10) return
      console.log(`尝试关闭聊天窗，第${attempt}次`)
      if ($('.chatroom_close').length) {
        if (isChatroomClosed) return
        console.log('关闭聊天窗, 点关闭')
        $('.chatroom_close').click()
        isChatroomClosed = true
        return
      }
      setTimeout(() => tryCloseChatroom(attempt + 1), 500 * attempt)
    }
    tryCloseChatroom()
    mutationObserver('body', (mutations) => {
      mutations.forEach((mutation) => {
        console.log(
          'mutation',
          mutation,
          mutation.target.className.includes('xgplayer-fullscreen-parent')
        )
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          mutation.target.className.includes('xgplayer-fullscreen-parent')
        ) {
          $('.chatroom_close').click()
        }
      })
    })
  })

  /**
   * 移除包含指定文本的元素
   * @param {*} parentSelector 要移除元素的父元素
   * @param {*} text 要移除元素包含的文本
   */
  function removeByText(parentSelector, text) {
    $(parentSelector)
      .children()
      .each(function () {
        if ($(this).text().includes(text)) {
          $(this).remove()
        }
      })
  }

  /**
   * 移除指定元素
   * @param {*} selector 要移除的元素选择器
   */
  function removeElement(selector) {
    $(selector).remove()
  }

  /**
   * 移除指定元素的第N + 1个子元素
   * @param {*} parentSelector 要移除子元素的父元素选择器
   * @param {*} n 要移除的子元素索引（从0开始）
   */
  function removeChildElementByIndex(parentSelector, n) {
    $(parentSelector).children().eq(n).remove()
  }

  // xgplayer-fullscreen-parent

  function mutationObserver(selector, action) {
    const targetNode = document.querySelector(selector)
    if (!targetNode) {
      return
    }
    const observer = new MutationObserver(action)
    observer.observe(targetNode, {
      attributes: true,
    })
  }
})()


