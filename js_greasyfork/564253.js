// ==UserScript==
// @name        去掉v2free的烦人对话框
// @description 去掉登录时烦人的确认对话框
// @namespace   249c0e38-4770-4cc7-ba23-f5ec70425bd1
// @match       https://v2free.org/auth/*
// @grant       unsafeWindow
// @version     1.0
// @author      -
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/564253/%E5%8E%BB%E6%8E%89v2free%E7%9A%84%E7%83%A6%E4%BA%BA%E5%AF%B9%E8%AF%9D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/564253/%E5%8E%BB%E6%8E%89v2free%E7%9A%84%E7%83%A6%E4%BA%BA%E5%AF%B9%E8%AF%9D%E6%A1%86.meta.js
// ==/UserScript==

unsafeWindow.confirm = new Proxy(unsafeWindow.confirm, {
  apply() {
    return true
  }
})
