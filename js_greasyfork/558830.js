// ==UserScript==
// @name         为了川香酱
// @namespace    http://tampermonkey.net/
// @version      2025-12-13
// @description  思想政治不及格
// @author       wechat Zkl1923325014
// @match        https://qmbbs.17el.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558830/%E4%B8%BA%E4%BA%86%E5%B7%9D%E9%A6%99%E9%85%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/558830/%E4%B8%BA%E4%BA%86%E5%B7%9D%E9%A6%99%E9%85%B1.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log(window.location.href)
  if (window.location.href.startsWith('https://qmbbs.17el.cn/personal')) {
      alert("自动挂机脚本启动...")
  }

  function getUnfinishedButtons() {
    console.log("点击未完成的按钮")
    const rows = document.querySelectorAll('#tbody tr');
    let finished = true;
    for (const row of rows) {
      const progressTd = row.children[4]; // 进度列
      if (progressTd) {
        const progress = progressTd.innerText.trim();
        console.log("进度为", progress)
        if (progress !== '已学完') {
          const btn = row.querySelector('button.cellButton');
          if (btn) {
            console.log("点击按钮", btn)
            btn.click()
            finished = false;
            break;
          }
        }
      }
    }
    if (finished) {
      goNextPage();
    }
  }

  function goNextPage() {
    console.log('🎉 检查下一页');
    const nextBtn = document.querySelector(
      '.J-paginationjs-next'
    );

    if (!nextBtn) {
      console.log('🎉 没有下一页，任务完成');
      return;
    }

    console.log('➡ 前往下一页');
    nextBtn.click();

    setTimeout(() => {
      getUnfinishedButtons();
    }, 10000);
  }


  window.addEventListener('message', (event) => {

    const data = event.data;

    if (data?.type === 'KELI_NEXT_PAGE') {
      console.log('✅ 下一个视频', data);
      setTimeout(() => {
        getUnfinishedButtons();
      }, 30000);
    }
  });

  window.addEventListener('message', (event) => {

    const data = event.data;

    if (data?.type === 'PROGRESS_DONE') {
      console.log('✅ iframe 通知：播放完成', data);
      window.opener.postMessage(
        {
          type: 'KELI_NEXT_PAGE'
        },
        '*'
      );
      onlineCourse();

    }
  });

  let t2 = setTimeout(() => {
    getUnfinishedButtons();
  }, 3000);

  const INTERVAL = 3000; // 每 1 秒检查一次

  let timer = setInterval(() => {
    const alertDialog = document.querySelector(".layui-layer");
    if (alertDialog) {
      const yesButton = alertDialog.querySelector('.layui-layer-btn0');
      console.log("yesButton", yesButton)
      if (yesButton) {
        console.log("自动点击了‘是’按钮");
        yesButton.click();
      }
    }

    const playBtn = document.querySelector('.xgplayer-start')
    if (playBtn) {
      console.log("自动点击了‘播放’按钮");
      playBtn.click();
    }


    const els = document.querySelectorAll('.item-title');

    if (els.length === 0) {
      console.log('⏳ 进度元素尚未出现');
      return;
    }
    let f1 = true
    for (const el of els) {
      const p = el.querySelector(".percentText")
      const text = p.innerText.trim();
      const value = parseInt(text.replace('%', ''), 10);
      if(value<100){
        f1 = false
        if(!el.classList.contains('selected')){
          el.click()
        }
        break;
      }
    }
    if(f1){
      console.log('🎉 所有进度均为 100%，执行下一步');
      clearInterval(timer);

      window.parent.postMessage(
        {
          type: 'PROGRESS_DONE',
          progress: 100
        },
        '*'
      );
    }
  }, INTERVAL);
})();