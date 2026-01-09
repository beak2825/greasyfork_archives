// ==UserScript==
// @name         SCUT自动评教脚本
// @namespace    http://tampermonkey.net/
// @version      2026-01-08
// @description  先手动进入评教的具体打分题目页面,此后自动填写(按满分),自动提交,自动点击直到最后一份评教完成,卡了就刷新/点击一下。
// @author       RXCCCCCC
// @match        https://pj.jw.scut.edu.cn/*
// @icon         https://www.scut.edu.cn/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561829/SCUT%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/561829/SCUT%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function triggerEvent(element, eventName) {
    const event = new Event(eventName, { bubbles: true });
    element.dispatchEvent(event);
  }

  function forceFillTextarea(textarea, text) {
    textarea.textContent = text;
    textarea.innerHTML = text;
    const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeValueSetter.call(textarea, text);
    triggerEvent(textarea, 'input');
    triggerEvent(textarea, 'change');
  }

  function autoClickConfirm() {
    const observer = new MutationObserver(() => {
      const confirmBtn = document.querySelector('.ant-modal-body .ant-btn-primary');
      if (confirmBtn) {
        observer.disconnect();
        setTimeout(() => {
          confirmBtn.click();
          triggerEvent(confirmBtn, 'click');
          console.log("✅ 已自动点击‘确定’按钮");
          // 点击确定后 1s 再点击“下一门课程”按钮（如果存在），然后继续自动填写下一门
          setTimeout(() => {
            try {
              const candidates = Array.from(document.querySelectorAll('button, a'));
              const nextBtn = candidates.find(el => el.textContent && el.textContent.trim().includes('下一'));
              if (nextBtn) {
                nextBtn.click();
                triggerEvent(nextBtn, 'click');
                console.log("✅ 已自动点击‘下一’按钮");
                // 给页面一点时间加载下一项后重新启动填表流程
                setTimeout(() => {
                  try { autoFillEvaluation(); } catch (e) { /* ignore */ }
                }, 1000);
              }
            } catch (e) {
              console.error('❌ 点击下一门失败:', e);
            }
          }, 1000);
        }, 4000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function autoFillEvaluation() {
    const interval = setInterval(() => {
      try {
        const questions = Array.from(document.querySelectorAll('.index__subjectItem--XWS1b')).filter(q => q.isConnected);
        const submitBtn = document.querySelector('.index__submit--jiKIA');

        if (questions.length >= 14 && submitBtn) {
          clearInterval(interval);
          console.log("✅ 检测到题目和提交按钮，开始填写...");

          questions.forEach(question => {
            const radios = question.querySelectorAll('input[type="radio"]:not([disabled])');
            if (radios.length > 0) {
              // 选择第一个选项（索引 0），不再随机
              radios[0].click();
              triggerEvent(radios[0], 'change');
            }

            const textarea = question.querySelector('textarea.index__UEditoTextarea--yga85');
            if (textarea) {
              forceFillTextarea(textarea, "老师教学认真，内容充实，推荐！");
            }
          });

          // 自动提交：短随机延迟后点击提交并等待弹窗确认
          setTimeout(() => {
            submitBtn.click();
            triggerEvent(submitBtn, 'click');
            console.log("✅ 已提交评价，等待弹窗...");
            autoClickConfirm();
          }, 1000);
        }
      } catch (error) {
        console.error("❌ 脚本执行出错:", error);
      }
    }, 500);
  }

  window.addEventListener('load', autoFillEvaluation);
})();
