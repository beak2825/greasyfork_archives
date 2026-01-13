// ==UserScript==
// @name        安大校园网定时自动登录（防掉线） - 172.16.253.3
// @namespace   Violentmonkey Scripts
// @match       http://172.16.253.3/*
// @grant       none
// @version     2.0
// @author      shiqi
// @license MIT
// @description 2026//11 21:39:03
// @downloadURL https://update.greasyfork.org/scripts/562327/%E5%AE%89%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%AE%9A%E6%97%B6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E9%98%B2%E6%8E%89%E7%BA%BF%EF%BC%89%20-%20172162533.user.js
// @updateURL https://update.greasyfork.org/scripts/562327/%E5%AE%89%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%AE%9A%E6%97%B6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E9%98%B2%E6%8E%89%E7%BA%BF%EF%BC%89%20-%20172162533.meta.js
// ==/UserScript==
function delayedAlert() {
  timeoutID = window.setTimeout(login, 2000);
  // 每隔6小时（21600000毫秒）刷新一次页面
  window.setInterval(function() {
    location.reload();
  }, 21600000); // 6小时 = 21600000毫秒
}

function login() {
  account = document.querySelector('input[type="text"]');
  console.log(account);
  pwd = document.querySelector('input[type="password"]');
  submit = document.querySelector('input[type="submit"]');
  account.value = '';
  pwd.value = '';
  submit.click();
}

delayedAlert();
