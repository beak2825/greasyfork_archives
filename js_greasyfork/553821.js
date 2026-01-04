// ==UserScript==
// @name         楽天迷惑メール自動解除
// @name:ja      楽天迷惑メール自動解除
// @name:en      Rakuten automatically uncheck spam email options
// @version      0.2
// @description  Work in progress to uncheck all the garbage on rakuten's checkout pages
// @description:ja この仕掛品は楽天の迷惑メールのチェックボックスを自動解除します
// @description:en  Work in progress to uncheck all the garbage on rakuten's checkout pages
// @license      MIT
// @author       d_p
// @match       https://cart.step.rakuten.co.jp/order-confirmation*
// @match       https://books.step.rakuten.co.jp/rms/mall/book/bs/kobo/ConfirmOrder*
// @match       https://books.step.rakuten.co.jp/rms/mall/book/bs/books/ConfirmOrder*
// @grant        none
// @run-at       document-idle
// @noframes
// @namespace https://greasyfork.org/users/1531107
// @downloadURL https://update.greasyfork.org/scripts/553821/%E6%A5%BD%E5%A4%A9%E8%BF%B7%E6%83%91%E3%83%A1%E3%83%BC%E3%83%AB%E8%87%AA%E5%8B%95%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/553821/%E6%A5%BD%E5%A4%A9%E8%BF%B7%E6%83%91%E3%83%A1%E3%83%BC%E3%83%AB%E8%87%AA%E5%8B%95%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

// Should work on regular cart step for shopping
document.querySelectorAll("button[aria-label=すべての選択を解除]").forEach(a => a.click());

// For rakuten kobo (ebooks)
document.querySelectorAll("input[name=news_check]").forEach(a => a.checked = false);
document.querySelectorAll("input[name=bookmark_check]").forEach(a => a.checked = false);

// Uncheck series and author (regular books)
document.querySelectorAll("input[name=bookmark_series_check]").forEach(a => a.checked = false);
document.querySelectorAll("input[name=bookmark_authors_check]").forEach(a => a.checked = false);
