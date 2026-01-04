// ==UserScript==
// @name         屏蔽Bilibili(B站)评论区
// @namespace    http://tampermonkey.net/
// @version      2025-11-24
// @description  一个屏蔽Bilibili(B站)视频评论区的插件
// @author       wangjh email:ns4jzw@gmail.com
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556760/%E5%B1%8F%E8%94%BDBilibili%28B%E7%AB%99%29%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/556760/%E5%B1%8F%E8%94%BDBilibili%28B%E7%AB%99%29%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const interval = 1000; // 毫秒
  function clear(){
     const commentapp = document.getElementById("commentapp");
     if(commentapp){
         commentapp.innerHTML = "";
     }
  }
  clear()
  const timerId = setInterval(clear,interval);
  setTimeout(() => {
      clearInterval(timerId);
      console.log('stop clearing comments');
  }, 3000);
})();