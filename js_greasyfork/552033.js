// ==UserScript==
// @name         LinuxDo字体修改
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.3.0
// @description  修改L站全局字体,保护眼睛
// @license      GPL version 3 or any later version
// @author       冰冻大西瓜
// @match        https://linux.do/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/pangu@7.2.0/dist/browser/pangu.umd.js
// @downloadURL https://update.greasyfork.org/scripts/552033/LinuxDo%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/552033/LinuxDo%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

// 在此处键入代码……

GM_addStyle(`
  /* 设置全局字体 */
  html:root{
    --base-family:FiraCode Nerd Font Mono,圆体-简 !important;
    --font-family: var(--base-family);
    --d-font-family--monospace: var(--base-family);
    --heading-font-family:var(--base-family);
  }
    
  /* 设置标题部分为粗体 */
  details .action-title,.names.trigger-user-card,.sidebar-sections{
    font-weight:bold;
  }
}
`)
// 添加回帖框的格式化按钮
function addFormatButton() {
  const saveOrCancel = document.querySelector('.save-or-cancel')
  if (!saveOrCancel) return

  // 检查是否已经添加过按钮，避免重复添加
  if (saveOrCancel.querySelector('.pangu-format-btn')) return

  const panguBtn = document.createElement('button')
  panguBtn.className = 'btn btn-icon-text btn-primary create pangu-format-btn'
  panguBtn.textContent = '格式化'

  panguBtn.addEventListener('click', function () {
    const textArea = document.querySelector('.ember-text-area')
    if (!textArea) return

    const originalValue = textArea.value
    const formattedValue = pangu.spacingText(originalValue)

    // 对于 Ember.js，需要触发相应的事件来更新内部状态
    textArea.value = formattedValue

    // 创建并触发 input 事件
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    })
    textArea.dispatchEvent(inputEvent)

    // 创建并触发 change 事件
    const changeEvent = new Event('change', {
      bubbles: true,
      cancelable: true,
    })
    textArea.dispatchEvent(changeEvent)

    // 尝试触发 Ember 特定的事件
    if (textArea._state) {
      // 如果存在 Ember 内部状态
      textArea._state = formattedValue
    }

    // 模拟用户输入
    textArea.focus()

    // 设置光标位置到末尾
    textArea.setSelectionRange(formattedValue.length, formattedValue.length)
  })

  saveOrCancel.insertAdjacentElement('afterbegin', panguBtn)
}

// 使用 MutationObserver 监听 DOM 变化
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === 'childList') {
      // 检查新添加的节点中是否包含 .save-or-cancel
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          // 元素节点
          if (node.classList && node.classList.contains('save-or-cancel')) {
            addFormatButton()
          }
          // 也检查子节点
          if (node.querySelector) {
            const saveOrCancel = node.querySelector('.save-or-cancel')
            if (saveOrCancel) {
              addFormatButton()
            }
          }
        }
      })
    }
  })
})

// 开始观察 document.body 的变化
observer.observe(document.body, {
  childList: true,
  subtree: true,
})

// 页面加载时也检查一次
addFormatButton()
