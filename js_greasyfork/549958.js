// ==UserScript==
// @name         广东省继续教育（含公需课、职业培训、技工教育、广东远程职业培训平台）自动刷课
// @version      5.0
// @description  广东省继续教育（含公需课、职业培训、技工教育、广东远程职业培训平台）刷课，自动答题 + 自动关闭弹窗 + 完成自动进入下章
// @author       lzhzssy
// @icon         https://ggfw.gdhrss.gov.cn/favicon.ico
// @match        http*://ggfw.hrss.gd.gov.cn/zxpx/auc/play/player*
// @match        *://videoadmin.chinahrt.com/*
// @match        *://ggfw.hrss.gd.gov.cn/*
// @license      GPLv3
// @namespace https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/549958/%E5%B9%BF%E4%B8%9C%E7%9C%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E5%90%AB%E5%85%AC%E9%9C%80%E8%AF%BE%E3%80%81%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E3%80%81%E6%8A%80%E5%B7%A5%E6%95%99%E8%82%B2%E3%80%81%E5%B9%BF%E4%B8%9C%E8%BF%9C%E7%A8%8B%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%EF%BC%89%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/549958/%E5%B9%BF%E4%B8%9C%E7%9C%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BC%88%E5%90%AB%E5%85%AC%E9%9C%80%E8%AF%BE%E3%80%81%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E3%80%81%E6%8A%80%E5%B7%A5%E6%95%99%E8%82%B2%E3%80%81%E5%B9%BF%E4%B8%9C%E8%BF%9C%E7%A8%8B%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%EF%BC%89%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 当前页面 URL
  const url = window.location.href;

  // =================== 广东远程职业培训平台 ===================
  if (/^https?:\/\/ggfw\.hrss\.gd\.gov\.cn\/gdzxpx/.test(url)) {
      (function () {
          'use strict';

          console.log('[广东远程职业培训平台脚本启动] PrismPlayer 自动静音 + 防暂停 + 自动下一课');

          // ---- 1. 防止切换页面暂停 ----
          const noop = () => {};
          const blockEvents = ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'];

          window.onblur = noop;
          window.onfocus = noop;
          document.onvisibilitychange = noop;

          // Hook事件监听，阻止页面绑定暂停逻辑
          const rawAddEventListener = EventTarget.prototype.addEventListener;
          EventTarget.prototype.addEventListener = function (type, listener, options) {
              if (blockEvents.includes(type)) {
                  console.log(`[拦截事件监听] ${type}`);
                  return;
              }
              return rawAddEventListener.call(this, type, listener, options);
          };

          // ---- 2. 自动静音并保持播放 ----
          const keepPlaying = setInterval(() => {
              const video = document.querySelector('#J_prismPlayer video');
              if (video) {
                  // 自动静音
                  if (!video.muted) {
                      video.muted = true;
                      console.log('[静音] 已自动静音');
                  }

                  // 播放状态检测
                  if (video.paused) {
                      video.play().catch(() => {});
                      console.log('[保持播放] 自动恢复播放');
                  }

                  // 强制播放速度为 1.0（防止网站倍速检测）
                  if (video.playbackRate !== 1.0) {
                      video.playbackRate = 1.0;
                  }
              }
          }, 2000);

          setInterval(() => {
              const video = document.querySelector('#J_prismPlayer video');
              // 如果当前视频已播放到末尾（接近结束）
              if (video.duration && video.currentTime >= video.duration - 2) {
                  console.log('[检测到视频播放结束] 正在跳转到下一课...');
                  jumpToNextCourse();
              }
          }, 1000);


          // ---- 3. 页面加载时立即执行一次 ----
          window.addEventListener('load', () => {
              const video = document.querySelector('#J_prismPlayer video');
              if (video) {
                  video.muted = true;
                  video.play().catch(() => {});
                  console.log('[初始化] 视频自动播放并静音');
              }
          });

          // ---- 4. 自动跳转到下一课 ----
          function jumpToNextCourse() {
              // 当前选中的课程项
              const current = document.querySelector('.directory_scroll_list .courseItem.active');
              if (!current) {
                  console.warn('[跳转失败] 未找到当前课程项');
                  return;
              }

              // 找到下一课
              const next = current.nextElementSibling;
              if (next && next.classList.contains('courseItem')) {
                  console.log('[自动跳转] 下一课：', next.textContent.trim());

                  // 模拟点击事件（触发页面加载）
                  next.click();

                  // 等待新视频加载后自动播放
                  setTimeout(() => {
                      const newVideo = document.querySelector('#J_prismPlayer video');
                      if (newVideo) {
                          newVideo.muted = true;
                          newVideo.play().catch(() => {});
                          console.log('[新视频] 已自动开始播放');
                      } else {
                          console.warn('[新视频未加载] 稍后将重试播放');
                      }
                  }, 4000);
              } else {
                  console.log('[提示] 已是最后一课或未检测到下一课。');
                  clearInterval(keepPlaying);
              }
          }
      })();
  }

  // =================== 广东继教网站逻辑 ===================
  if (/^https?:\/\/ggfw\.hrss\.gd\.gov\.cn\/zxpx\/auc\/play\/player/.test(url)) {
      (function gd_continueEdu() {
          console.log('[广东继教公需课脚本] 启动✅');


          // ===== 广东公需课刷课脚本 =====
          setTimeout(function () {
              // 静音
              p.tag.muted = true;
              var errChecking = setInterval(function () {
                  if ($('.learnpercent').text().indexOf('已完成') != -1) {
                      var learnlist = $("a:contains('未完成')").length != 0 ? $("a:contains('未完成')") : $("a:contains('未开始')");
                      if (learnlist.length == 0) {
                          if (confirm('本课程全部学习完成!即将关闭页面！')) {
                              window.close();
                          }
                      } else {
                          learnlist.each(function () {
                              this.click();
                          })
                      }
                  }
                  // 暂停时自动开始播放
                  if (p.paused()) {
                      p.play()
                  }
              }, 500);
          }, 1000);





          // ====== 自动答题 + 通用弹窗持续处理（修复版）======
          (function () {
              const TRY_INTERVAL = 1000;
              let answeredThisQuestion = false;
              let currentQuestionId = null;
              let processedDialogs = new WeakSet();
              let isRetrying = false;
              let waitingForNextQuestion = false; // 新增：等待下一题加载的标志
              let lastAnswerTime = 0; // 记录最后一次答题时间

              // ================= 工具函数 =================
              function clickEl(el) {
                  if (!el) return false;
                  try {
                      el.click();
                      return true;
                  } catch (e) {
                      try {
                          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                          return true;
                      } catch (err) {
                          console.warn('click failed', err);
                          return false;
                      }
                  }
              }

              function setInputChecked(input) {
                  if (!input) return;
                  input.checked = true;
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                  input.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
              }

              function submitAnswer() {
                  const submitBtn = document.querySelector('.reply-sub');
                  if (submitBtn) {
                      clickEl(submitBtn);
                      return true;
                  }
                  if (typeof window.subAnswer === 'function') {
                      try { window.subAnswer(); return true; } catch (e) { }
                  }
                  return false;
              }

              // 获取题目唯一标识
              function getQuestionId() {
                  const form = document.querySelector('#from_ejectque');
                  if (!form) return null;

                  // 综合多个因素生成唯一ID
                  const questionText = form.querySelector('.eject-title, .question-text, h3, .title');
                  const text = questionText ? questionText.innerText.trim() : '';

                  // 获取所有选项的状态
                  const inputs = Array.from(form.querySelectorAll("input[name='panduan']"));
                  const optionsState = inputs.map(i => `${i.value}:${i.checked}`).join('|');

                  // 组合生成ID
                  return `${text}_${optionsState}`;
              }

              // 检查是否有可见的题目表单
              function hasVisibleQuestion() {
                  const form = document.querySelector('#from_ejectque');
                  if (!form) return false;
                  const style = window.getComputedStyle(form);
                  return style.display !== 'none' && form.offsetParent !== null;
              }

              // ================= 答题自动化部分 =================
              function tryAutoAnswerOnce() {
                  const form = document.querySelector('#from_ejectque');
                  if (!form) return false;

                  // 如果正在等待下一题或表单不可见，跳过
                  if (waitingForNextQuestion || !hasVisibleQuestion()) {
                      return false;
                  }

                  // 防抖：2秒内不重复答题
                  const now = Date.now();
                  if (now - lastAnswerTime < 2000) {
                      return false;
                  }

                  // 检查是否是新题目
                  const questionId = getQuestionId();
                  if (!questionId) return false;

                  if (questionId !== currentQuestionId) {
                      console.log('[AutoAnswer] 检测到新题目');
                      currentQuestionId = questionId;
                      answeredThisQuestion = false;
                      isRetrying = false;
                      waitingForNextQuestion = false;
                  }

                  // 如果已经回答过或正在重试，跳过
                  if (answeredThisQuestion || isRetrying) return false;

                  let opt = form.querySelector("input[name='panduan'][value='0']");
                  if (!opt) opt = form.querySelector("input[name='panduan']");
                  if (!opt) return false;

                  console.log('[AutoAnswer] 尝试提交答案：选项0');
                  setInputChecked(opt);
                  setTimeout(() => {
                      if (submitAnswer()) {
                          answeredThisQuestion = true;
                          lastAnswerTime = Date.now();
                          console.log('[AutoAnswer] 答案已提交');
                      }
                  }, 500);
                  return true;
              }

              // =============== 通用弹窗检测处理 ===============
              function findVisibleDialogs() {
                  const dialogs = Array.from(document.querySelectorAll('.messager-window, .panel.window, .prism-ErrorMessage'));
                  return dialogs.filter(d => {
                      if (processedDialogs.has(d)) return false;

                      const style = window.getComputedStyle(d);
                      if (style.display !== 'none' && d.offsetParent !== null) return true;
                      const inline = d.getAttribute('style') || '';
                      return inline.includes('display: block');
                  });
              }

              function handleDialog(dialog) {
                  processedDialogs.add(dialog);

                  const text = dialog.innerText.trim();
                  if (!text) return;
                  console.log('[PopupHandler] 检测到弹窗：', text);

                  if (text.includes('答案错误')) {
                      console.log('[PopupHandler] 处理：答案错误 → 准备切换选项');

                      clickDialogOk(dialog);
                      isRetrying = true;
                      answeredThisQuestion = false;

                      setTimeout(() => {
                          const form = document.querySelector('#from_ejectque');
                          if (!form) {
                              isRetrying = false;
                              return;
                          }

                          const alt = form.querySelector("input[name='panduan'][value='1']");
                          if (alt && !alt.checked) {
                              console.log('[PopupHandler] 切换到选项1');
                              setInputChecked(alt);
                              setTimeout(() => {
                                  submitAnswer();
                                  answeredThisQuestion = true;
                                  lastAnswerTime = Date.now();
                                  isRetrying = false;
                              }, 500);
                          } else {
                              const anyOpt = Array.from(form.querySelectorAll("input[name='panduan']"));
                              const unchecked = anyOpt.find(o => !o.checked);
                              if (unchecked) {
                                  console.log('[PopupHandler] 切换到其他选项');
                                  setInputChecked(unchecked);
                                  setTimeout(() => {
                                      submitAnswer();
                                      answeredThisQuestion = true;
                                      lastAnswerTime = Date.now();
                                      isRetrying = false;
                                  }, 500);
                              } else {
                                  isRetrying = false;
                              }
                          }
                      }, 1200);
                  }
                  else if (text.includes('答案正确')) {
                      console.log('[PopupHandler] 处理：答案正确 → 点击确定，等待下一题');

                      // 设置等待标志，防止在题目切换前重复答题
                      waitingForNextQuestion = true;

                      setTimeout(() => {
                          clickDialogOk(dialog);
                          console.log('[PopupHandler] 已点击确定，等待5秒后恢复答题');

                          // 延长等待时间，确保题目完全切换
                          setTimeout(() => {
                              currentQuestionId = null; // 强制重新识别题目
                              waitingForNextQuestion = false;
                              answeredThisQuestion = false;
                              console.log('[PopupHandler] 恢复答题检测');
                          }, 5000); // 等待5秒
                      }, 800);
                  }
                  else if (text.includes('网络') || text.includes('播放错误') || text.includes('重试')) {
                      console.log('[PopupHandler] 处理：网络/播放错误 → 点击刷新或重试');
                      const refreshBtn = dialog.querySelector('.prism-button-refresh, .prism-button-retry');
                      if (refreshBtn) clickEl(refreshBtn);
                      else clickDialogOk(dialog);
                  }
                  else {
                      console.log('[PopupHandler] 处理：其他提示弹窗 → 点击确定');
                      setTimeout(() => clickDialogOk(dialog), 800);
                  }
              }

              function clickDialogOk(dialog) {
                  let okBtn = Array.from(dialog.querySelectorAll('a.l-btn, .prism-button, button'))
                  .find(a => (a.textContent || '').includes('确定') || (a.textContent || '').includes('刷新') || (a.textContent || '').includes('重试'));
                  if (!okBtn) {
                      const span = dialog.querySelector('.l-btn-text');
                      if (span && /确定|刷新|重试/.test(span.textContent)) okBtn = span.closest('a') || span;
                  }
                  if (!okBtn) {
                      okBtn = dialog.querySelector('.panel-tool-close');
                  }
                  if (okBtn) {
                      clickEl(okBtn);
                      console.log('[PopupHandler] 已点击弹窗按钮');
                  }
              }

              // =============== 主循环：持续检测 ===============
              const mainInterval = setInterval(() => {
                  try {
                      if (!isRetrying) {
                          tryAutoAnswerOnce();
                      }

                      const dialogs = findVisibleDialogs();
                      dialogs.forEach(dialog => handleDialog(dialog));
                  } catch (err) {
                      console.error('[AutoAnswer] 主循环错误：', err);
                  }
              }, TRY_INTERVAL);

              setInterval(() => {
                  processedDialogs = new WeakSet();
              }, 30000);

              console.log('[AutoAnswer] 自动答题 + 弹窗处理脚本已启动 ✅');
          })();




          // 拖拉进度 + 倍速播放（但是没用，因为有要求学习时长）
          (function () {
              'use strict';

              function enableVideoControl() {
                  const video = document.querySelector('video');
                  if (!video) return;

                  console.log('[Prism增强] 找到视频元素，开始启用自定义控制。');

                  // 允许拖动（有的播放器禁用 onseeked/onseeking）
                  video.removeAttribute('disablepictureinpicture');
                  video.controls = true; // 显示控制栏

                  // 默认倍速
                  video.playbackRate = 1.0;

                  // 添加快捷键控制
                  document.addEventListener('keydown', (e) => {
                      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;

                      switch (e.key) {
                          case '>': // Shift + .
                              video.playbackRate = Math.min(video.playbackRate + 0.25, 4);
                              showTip(`倍速：${video.playbackRate.toFixed(2)}x`);
                              break;
                          case '<': // Shift + ,
                              video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25);
                              showTip(`倍速：${video.playbackRate.toFixed(2)}x`);
                              break;
                          case 'ArrowRight':
                              video.currentTime += 10;
                              showTip('快进10秒');
                              break;
                          case 'ArrowLeft':
                              video.currentTime -= 10;
                              showTip('后退10秒');
                              break;
                          case ' ': // 空格暂停/播放
                              e.preventDefault();
                              video.paused ? video.play() : video.pause();
                              break;
                      }
                  });

                  // 倍速提示
                  function showTip(text) {
                      let tip = document.getElementById('speed-tip');
                      if (!tip) {
                          tip = document.createElement('div');
                          tip.id = 'speed-tip';
                          tip.style.cssText =
                              'position:fixed;bottom:15%;left:50%;transform:translateX(-50%);' +
                              'background:rgba(0,0,0,0.7);color:#fff;padding:8px 15px;border-radius:8px;font-size:16px;z-index:999999;transition:opacity 0.5s;';
                          document.body.appendChild(tip);
                      }
                      tip.textContent = text;
                      tip.style.opacity = '1';
                      clearTimeout(tip._timer);
                      tip._timer = setTimeout(() => (tip.style.opacity = '0'), 1200);
                  }
              }

              // 监听页面动态加载（Prism Player 是异步初始化的）
              const observer = new MutationObserver(() => {
                  if (document.querySelector('video')) {
                      enableVideoControl();
                      observer.disconnect();
                  }
              });

              observer.observe(document.body, { childList: true, subtree: true });
          })();
      })();
  }


  // =================== 广东省职业培训和技工教育协会专业技术人员继续教育学习平台 ===================
    else if (window.location.href.match(/:\/\/videoadmin\.chinahrt\.com/)) {
        console.log("✅ 检测到广东省职业培训和技工教育协会专业技术人员继续教育学习平台页面");

        (function() {
            'use strict';

            // ---- 屏蔽页面失焦、切换标签页的暂停检测 ----
            const noop = () => {}; // 空函数

            // 覆盖常见事件处理
            window.onblur = noop;
            window.onfocus = noop;
            document.onvisibilitychange = noop;
            document.onblur = noop;
            document.onfocus = noop;

            // 拦截 addEventListener 调用（防止网站动态绑定暂停事件）
            const rawAddEvent = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (['visibilitychange', 'blur', 'focus', 'mouseleave', 'mouseout'].includes(type)) {
                    console.log('[拦截] 屏蔽事件监听:', type);
                    return; // 不注册这些事件
                }
                return rawAddEvent.call(this, type, listener, options);
            };

            // ---- 定时保持视频播放状态 ----
            const keepPlaying = setInterval(() => {
                const video = document.querySelector('video');
                if (video) {
                    if (video.paused) {
                        video.play().catch(() => {});
                        console.log('[自动恢复播放]');
                    }
                    video.muted = true;
                    video.playbackRate = 1.0; // 倍速
                }
            }, 3000); // 每3秒检测一次

            // ---- 页面加载后第一次设置 ----
            window.addEventListener('load', () => {
                const video = document.querySelector('video');
                if (video) {
                    video.muted = true;
                    video.playbackRate = 1.0;
                    video.play().catch(() => {});
                    console.log('[初始化] 已自动播放视频');
                }
            });
        })();
    }

})();