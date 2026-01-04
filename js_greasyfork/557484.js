// ==UserScript==
// @name         长江雨课堂for_FZU
// @namespace    https://github.com/camerayuhang
// @version      1.1.0
// @description  自动学习：展开课程、自动播放视频、检测完成并返回；课程跑完后回到“课程班级”并进入下一门未完成课程；记忆已完成课程
// @author       camerayuhang
// @match        https://changjiang.yuketang.cn/v2/web/*
// @icon         https://www.google.com/s2/favicons?domain=yuketang.cn
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557484/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82for_FZU.user.js
// @updateURL https://update.greasyfork.org/scripts/557484/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82for_FZU.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =======================
  // 🌐 自动检测 URL 变化逻辑
  // =======================
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      console.log(`🔄 检测到 URL 变化: ${lastUrl} → ${currentUrl}`);
      lastUrl = currentUrl;
      onUrlChange(currentUrl);
    }
  }).observe(document, { subtree: true, childList: true });

  onUrlChange(location.href);

  // ⭐ 新增：全局常量 & 本地存储（课程已完成集合）
  const FIN_KEY = 'yt_finished_classes_v1';
  const MAX_WAIT_MINUTES = 40;

  function loadFinishedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(FIN_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }
  function saveFinishedSet(set) {
    try {
      localStorage.setItem(FIN_KEY, JSON.stringify([...set]));
    } catch (e) {
      console.log('⚠️ 保存已完成课程到本地失败：', e);
    }
  }
  // 根据“课程标题 + 班级名”生成唯一键（两处页面均可获取）
  function buildCourseKey({ title, className }) {
    return `${(title || '').trim()}|${(className || '').trim()}`.replace(/\s+/g, ' ');
  }

  function onUrlChange(url) {
    if (url.includes('/studentLog/')) {
      console.log('📘 当前是课程信息页');
      handleStudentLogPage();
    } else if (url.includes('/video-student/')) {
      console.log('🎬 当前是视频学习页');
      handleVideoPage();
    } else if (/\/v2\/web\/(index)?$/.test(url) || url.includes('/v2/web/index')) {
      console.log('🏠 当前是课程列表页（我听的课）');
      handleIndexPage();
    } else {
      console.log('ℹ️ 当前页面不需要自动化操作');
    }
  }

    // =============== 学习日志页逻辑 ===============
    function handleStudentLogPage() {
        // 更精确的选择器（按你贴的结构）
        const TITLE_SEL = '.headerCard h1 .title-inner-wrapper';
        const CLASS_SEL = '.headerCard .classroom-name .title-inner-wrapper';

        let booted = false;
        const POLL_MS = 400;
        const MAX_MS = 15000;
        const startAt = Date.now();

        const timer = setInterval(() => {
            if (Date.now() - startAt > MAX_MS) {
                clearInterval(timer);
                console.log('⚠️ 等待标题超时，直接尝试任务扫描');
                proceed({ title: '', className: '' });
                return;
            }

            const titleEl = document.querySelector(TITLE_SEL);
            if (!titleEl) return;

            // 读取标题与班级名
            const title = (titleEl.textContent || '').trim();
            const classNameEl = document.querySelector(CLASS_SEL);
            // 兜底：有些页面 classNameEl 可能不存在，尝试取 .classroom-name 整块文本
            const className =
                  (classNameEl && classNameEl.textContent.trim()) ||
                  (document.querySelector('.headerCard .classroom-name')?.textContent || '').trim() ||
                  '';

            clearInterval(timer);
            console.log('✅ 当前课程名称:', title || '(未读取到)');
            console.log('✅ 班级名称:', className || '(未读取到)');
            proceed({ title, className });
        }, POLL_MS);

        function proceed(lessonMeta) {
            if (booted) return; // 防抖
            booted = true;

            // ---- 你的原逻辑（基本不动）----
            function tryDoTask() {
                const expandButtons = Array.from(document.querySelectorAll('span.blue.ml20'))
                .filter(el => el.textContent.includes('展开'));
                if (expandButtons.length > 0) {
                    console.log(`✅ 找到 ${expandButtons.length} 个“展开”按钮，正在点击...`);
                    expandButtons.forEach(btn => btn.click());
                    console.log('✅ 所有“展开”按钮已点击完成');
                    setTimeout(findAndClickFirstUnstarted, 3000);
                    return;
                }
                console.log('⏳ 未找到“展开”按钮，1秒后重试...');
                setTimeout(tryDoTask, 1000);
            }

            function findAndClickFirstUnstarted() {
                const activities = document.querySelectorAll('.activity__wrap');
                if (!activities || activities.length === 0) {
                    console.log('⏳ 未找到任务卡片，1秒后重试...');
                    setTimeout(findAndClickFirstUnstarted, 1000);
                    return;
                }

                let clicked = false;
                for (const act of activities) {
                    const typeUse = act.querySelector('.activity-info .tag use');
                    if (!typeUse) continue;
                    const iconHref = typeUse.getAttribute('xlink:href') || '';
                    if (iconHref !== '#icon-shipin' && iconHref !== '#icon-tuwen') continue;

                    const aside = act.querySelector('.statistics-box .aside');
                    if (!aside) continue;
                    const spans = aside.querySelectorAll('span');
                    if (spans.length === 0) continue;
                    const statusText = spans[spans.length - 1].textContent.trim();

                    if (['已完成', '已读', '未发言'].includes(statusText)) continue;

                    if (statusText === '未开始' || statusText === '进行中') {
                        console.log(`🎯 点击第一个 ${statusText} 图文/视频任务:`, act.innerText.trim());
                        act.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        const clickable = act.querySelector('.activity-info') || act;
                        clickable.click();
                        clicked = true;
                        break;
                    }
                }

                if (!clicked) {
                    console.log('✅ 没有未开始/进行中的图文或视频 → 视为该课程已完成，准备返回课程列表');
                    markCurrentCourseFinishedAndBack(lessonMeta);
                } else {
                    console.log('✅ 已点击一个未开始/进行中图文/视频任务');
                }
            }

            function markCurrentCourseFinishedAndBack(meta) {
                const finished = loadFinishedSet();
                const key = buildCourseKey(meta);
                if (key && !finished.has(key)) {
                    finished.add(key);
                    saveFinishedSet(finished);
                    console.log('🧠 已记录完成课程：', key);
                } else {
                    console.log('🧠 完成课程记录已存在或无效key：', key);
                }
                goBackToCourseList();
            }

            // 启动实际动作
            setTimeout(tryDoTask, 2000);
        }
    }


  // ⭐ 新增：返回“课程班级”（左侧菜单），失败则直接跳转 index
  function goBackToCourseList() {
    const tryClickMenu = () => {
      const lis = Array.from(document.querySelectorAll('.left__menu ul li'));
      const target = lis.find(li => (li.textContent || '').includes('课程班级'));
      if (target) {
        console.log('↩️ 点击左侧菜单 “课程班级”');
        target.click();
        return true;
      }
      return false;
    };

    if (!tryClickMenu()) {
      console.log('⚠️ 未找到“课程班级”菜单，直接跳转到 index');
      location.href = '/v2/web/index';
    }
  }

  // =============== 视频页逻辑 ===============
  function handleVideoPage() {
    const CHECK_INTERVAL = 3000;
    let elapsedChecks = 0;

    // 🔇 进入页面立即尝试静音
    function tryMuteVideo() {
      let tries = 0;
      const MAX_TRIES = 120; // ~1min

      const muteInterval = setInterval(() => {
        tries++;

        const muteIcon = document.querySelector('.xt_video_player_volume .xt_video_player_common_icon');
        const video = document.querySelector('video');

        if (muteIcon) {
          const isMuted = muteIcon.classList.contains('xt_video_player_common_icon_muted');
          if (!isMuted) {
            console.log('🔇 检测到未静音状态，点击音量图标静音');
            muteIcon.click();
          } else {
            if (video) {
              video.muted = true;
              video.volume = 0;
            }
          }
        } else if (video) {
          video.muted = true;
          video.volume = 0;
        }

        if (tries >= MAX_TRIES) {
          console.log('✅ 静音守护结束（持续1分钟）');
          clearInterval(muteInterval);
        }
      }, 500);
    }

    setTimeout(tryMuteVideo, 1000);

    function monitorVideo() {
      elapsedChecks++;
      const video = document.querySelector('video');
      const progressText = document.querySelector('.progress-wrap .text');

      if (!video) {
        console.log('⏳ 未检测到视频元素，稍后重试...');
        setTimeout(monitorVideo, CHECK_INTERVAL);
        return;
      }

      const isPaused = video.paused;
      const progress = progressText ? progressText.textContent.trim() : '';
      const completed = progress.includes('100%') || document.querySelector('.finish');

      console.log(`🎞️ 播放状态: ${isPaused ? '暂停' : '播放中'} | 进度: ${progress}`);

      if (isPaused && !completed) {
        video.muted = true;
        video.play().catch(() => {
          console.log('⚠️ 自动播放被阻止，等待用户交互或重试');
        });
      }

      if (completed) {
        console.log('✅ 视频已完成播放或检测到已完成标志！2秒后返回课程页...');
        setTimeout(goBackToClassPage, 2000);
        return;
      }

      if (elapsedChecks > (MAX_WAIT_MINUTES * 60 * 1000 / CHECK_INTERVAL)) {
        console.log('⚠️ 超时未检测到完成状态，强制返回课程页');
        goBackToClassPage();
        return;
      }

      setTimeout(monitorVideo, CHECK_INTERVAL);
    }

    function goBackToClassPage() {
      const backBtn = document.querySelector('.header-bar .f14.back');
      if (backBtn) {
        console.log('↩️ 点击返回按钮');
        backBtn.click();
        setTimeout(() => {
          if (location.href.includes('/studentLog/')) {
            console.log('🔄 返回课程页后刷新以确保内容加载');
            location.reload();
          } else {
            console.log('⌛ 等待课程页出现...');
            const checkInterval = setInterval(() => {
              if (location.href.includes('/studentLog/')) {
                clearInterval(checkInterval);
                console.log('🔄 检测到课程页，刷新页面');
                location.reload();
              }
            }, 1000);
          }
        }, 2000);
      } else {
        console.log('⚠️ 未找到返回按钮，尝试使用浏览器后退');
        history.back();
        const checkInterval = setInterval(() => {
          if (location.href.includes('/studentLog/')) {
            clearInterval(checkInterval);
            console.log('🔄 检测到课程页（通过后退），刷新页面');
            location.reload();
          }
        }, 1000);
      }
    }

    setTimeout(monitorVideo, 4000);
  }

  // =============== 课程列表页（我听的课）逻辑 ===============
  // ⭐ 新增：自动选择“我听的课”页签；查找下一门未完成课程并点击
  function handleIndexPage() {
    // 确保切到“我听的课”
    function ensureStudentTab(cb) {
      const studentTab = document.querySelector('#tab-student');
      const active = studentTab && studentTab.classList.contains('is-active');
      if (!studentTab) {
        console.log('⚠️ 未找到“我听的课”页签，稍后重试');
        setTimeout(() => ensureStudentTab(cb), 800);
        return;
      }
      if (!active) {
        console.log('🗂️ 切换到“我听的课”页签');
        studentTab.click();
        setTimeout(cb, 800);
      } else {
        cb();
      }
    }

    function clickNextUnfinished() {
      const finished = loadFinishedSet();
      const cards = Array.from(document.querySelectorAll('.TCardGroup .lesson-cardS .el-card__body'))
        .map(body => ({
          body,
          title: (body.querySelector('.left .top h1')?.textContent || '').trim(),
          className: (body.querySelector('.left .bottom .className')?.textContent || '').trim()
        }))
        .filter(x => x.title);

      if (!cards.length) {
        console.log('⏳ 未找到课程卡片，1秒后重试...');
        setTimeout(clickNextUnfinished, 1000);
        return;
      }

      // 依顺序找第一门未记录完成的课
      let target = null;
      for (const c of cards) {
        const key = buildCourseKey(c);
        if (!finished.has(key)) {
          target = { ...c, key };
          break;
        }
      }

      if (!target) {
        console.log('🎉 没有新的未完成课程（列表中课程均已标记完成）。');
        return;
      }

      console.log('👉 即将进入下一门未完成课程：', target.title, target.className ? `（${target.className}）` : '');
      // 点击整卡右/左区都可以触发进入，一般点击 body 的父卡片更稳
      const clickableCard = target.body.closest('.el-card') || target.body;
      clickableCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => clickableCard.click(), 300);
    }

    // 尝试点击左侧菜单“课程班级”（如果当前不是该视图）
    const inCourseList = !!document.querySelector('.index__view');
    if (!inCourseList) {
      console.log('ℹ️ 不是标准课程列表主视图，尝试点击左侧“课程班级”');
      const ok = (() => {
        const lis = Array.from(document.querySelectorAll('.left__menu ul li'));
        const target = lis.find(li => (li.textContent || '').includes('课程班级'));
        if (target) {
          target.click();
          return true;
        }
        return false;
      })();
      if (!ok) {
        location.href = '/v2/web/index';
      }
      // 待页面切换完再执行
      setTimeout(() => ensureStudentTab(clickNextUnfinished), 1000);
    } else {
      ensureStudentTab(clickNextUnfinished);
    }
  }
})();
