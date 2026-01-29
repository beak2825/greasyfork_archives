// ==UserScript==
// @name         呼伦贝尔继续教育自动学习助手（子脚本 - 外部子站 HXT）
// @namespace    hlbe.chinahrt.cn.hxtxstu
// @version      1.2.0
// @description  在 hxtxstu 外部子站页面自动静音播放、连播所有小节，完成后通知父页面切换下一门课程，并在页面右下角显示状态面板；取消单节/整课时间兜底，只按视频进度判断完成，并过滤 play/pause 误报错误提示。
// @author       ChatGPT
// @license      MIT
// @match        https://hxtxstu.zpwedu.com/hxtx/detail-study*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564407/%E5%91%BC%E4%BC%A6%E8%B4%9D%E5%B0%94%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%AD%90%E8%84%9A%E6%9C%AC%20-%20%E5%A4%96%E9%83%A8%E5%AD%90%E7%AB%99%20HXT%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564407/%E5%91%BC%E4%BC%A6%E8%B4%9D%E5%B0%94%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%AD%90%E8%84%9A%E6%9C%AC%20-%20%E5%A4%96%E9%83%A8%E5%AD%90%E7%AB%99%20HXT%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******************************************************************
   * 配置：仅保留“接近尾部”的完成阈值
   ******************************************************************/
  const END_THRESHOLD = 8; // 距离结束 <= 8s 视为完成本小节
  // 已取消：单小节 / 整课 时长兜底
  // const MAX_SECTION_SECONDS = 3600;
  // const MAX_COURSE_SECONDS  = 4 * 3600;

  const LOG_PREFIX = '[HLBE-SUB]';

  function log() {
    console.log(LOG_PREFIX, ...arguments);
  }
  function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /******************************************************************
   * UI 面板
   ******************************************************************/
  const uiState = {
    status: '已注入',
    sectionTitle: '',
    progressText: '',
    errorText: '',
  };
  let uiPanel = null;

  function createSubPanel() {
    if (uiPanel) return uiPanel;
    uiPanel = document.createElement('div');
    uiPanel.id = 'hlbe-sub-panel';
    Object.assign(uiPanel.style, {
      position: 'fixed',
      right: '10px',
      bottom: '10px',
      zIndex: 999999,
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontSize: '12px',
      padding: '8px 10px',
      borderRadius: '6px',
      maxWidth: '280px',
      lineHeight: '1.4',
      fontFamily: 'Segoe UI,Helvetica,Arial,sans-serif',
    });
    uiPanel.innerHTML = `
      <div style="font-weight:bold;margin-bottom:4px;">
        子脚本状态（外部子站）
      </div>
      <div id="hlbe-sub-status">状态：初始化...</div>
      <div id="hlbe-sub-section">当前小节：-</div>
      <div id="hlbe-sub-progress">进度：-</div>
      <div id="hlbe-sub-error" style="color:#ff8080;display:none;">错误：-</div>
    `;
    document.body.appendChild(uiPanel);
    return uiPanel;
  }

  function updateSubPanel() {
    if (!uiPanel) return;
    const statusEl = uiPanel.querySelector('#hlbe-sub-status');
    const sectionEl = uiPanel.querySelector('#hlbe-sub-section');
    const progressEl = uiPanel.querySelector('#hlbe-sub-progress');
    const errorEl = uiPanel.querySelector('#hlbe-sub-error');
    statusEl.textContent = `状态：${uiState.status}`;
    sectionEl.textContent = `当前小节：${uiState.sectionTitle || '-'}`;
    progressEl.textContent = `进度：${uiState.progressText || '-'}`;
    if (uiState.errorText) {
      errorEl.style.display = '';
      errorEl.textContent = `错误：${uiState.errorText}`;
    } else {
      errorEl.style.display = 'none';
    }
  }

  /******************************************************************
   * 课程 / 小节结构解析
   ******************************************************************/
  function getCourseTitle() {
    const el =
      document.querySelector('.desc-title') ||
      document.querySelector('.course-title,.detail-title,h1,h2');
    if (el && el.textContent.trim()) return el.textContent.trim();
    const t = document.querySelector('title');
    if (t && t.textContent.trim()) return t.textContent.trim();
    return '外部子站课程';
  }

  function getSectionList() {
    const items = Array.from(document.querySelectorAll('.videoList .item'));
    return items.map((item, index) => {
      const titleEl = item.querySelector('.text');
      const title =
        (titleEl && titleEl.textContent.trim()) || `小节${index + 1}`;
      const percentSpan = item.querySelector('.ml50');
      const percentText = percentSpan ? percentSpan.textContent.trim() : '';
      const done =
        /100\s*%/.test(percentText) ||
        percentText === '已完成' ||
        percentText === '完成';
      const isActive = item.classList.contains('active');
      return { item, title, percentText, done, isActive };
    });
  }

  function findCurrentSectionIndex(sections) {
    let idx = sections.findIndex(s => s.isActive);
    if (idx < 0) idx = 0;
    return idx;
  }

  function clickSection(index) {
    const sections = getSectionList();
    if (!sections[index]) return false;
    const sec = sections[index];
    log('切换到小节：', `[${index + 1}/${sections.length}]`, sec.title);
    sec.item.click();
    return true;
  }

  /******************************************************************
   * 视频控制：静音 + 自动播放
   ******************************************************************/
  async function getVideoElement() {
    let video = null;
    for (let i = 0; i < 40; i++) {
      video =
        document.querySelector('video.pv-video') ||
        document.querySelector('#player video') ||
        document.querySelector('video');
      if (video) break;
      await wait(500);
    }
    if (!video) {
      log('未找到 <video> 元素（pv-video），后续仅能用时间兜底判断完成。');
    } else {
      log('找到 video 元素：', video);
    }
    return video;
  }

  function ensureMuteLoop(video) {
    if (!video) return;
    (function muteOnce() {
      try {
        video.muted = true;
        video.volume = 0;
      } catch (e) {}
      setTimeout(muteOnce, 2000);
    })();
  }

  async function forceAutoPlayLoop(video) {
    if (!video) return;
    let lastTime = video.currentTime || 0;
    let stablePlayCount = 0;

    while (true) {
      try {
        const cur = video.currentTime || 0;
        if (cur > lastTime + 1) {
          stablePlayCount++;
          if (stablePlayCount >= 3) {
            log('检测到视频 currentTime 持续前进，认为已成功自动播放。');
            // 一旦确定已经成功播放，清掉历史错误提示
            uiState.errorText = '';
            updateSubPanel();
            return;
          }
        } else {
          stablePlayCount = 0;
        }
        lastTime = cur;

        if (video.paused || video.readyState >= 2) {
          log('尝试强制自动播放 video...');
          const p = video.play();
          if (p && typeof p.catch === 'function') {
            p.catch(err => {
              const msg = err && err.message ? String(err.message) : '';
              log('自动播放可能被浏览器限制或被站点脚本打断：', msg);

              // 过滤“被 pause 打断”的常见误报，不在 UI 里展示
              if (
                msg.includes(
                  'The play() request was interrupted by a call to pause()'
                )
              ) {
                return;
              }

              uiState.errorText = `自动播放受限：${msg}`;
              updateSubPanel();
            });
          }
        }
      } catch (e) {
        log('forceAutoPlayLoop 出错：', e.message);
        uiState.errorText = `自动播放异常：${e.message}`;
        updateSubPanel();
      }
      await wait(3000);
    }
  }

  /******************************************************************
   * 小节完成检测：仅按“接近尾部”判断
   ******************************************************************/
  async function waitOneSectionFinished(video) {
    log('开始监控课程播放进度……');
    while (true) {
      if (video) {
        try {
          const duration = video.duration || 0;
          const current = video.currentTime || 0;
          const remain = duration - current;
          log(
            `监控中：duration=${duration ? duration.toFixed(1) : '0.0'}，current=${
              current ? current.toFixed(1) : '0.0'
            }，remain=${remain ? remain.toFixed(1) : '0.0'}`
          );

          if (duration && !isNaN(duration)) {
            if (remain <= END_THRESHOLD) {
              log(
                `检测到小节接近结束：duration=${duration.toFixed(
                  1
                )}，current=${current.toFixed(
                  1
                )}，remain=${remain.toFixed(1)}，视为本小节完成。`
              );
              return;
            }
          }
        } catch (e) {
          log('读取视频进度异常：', e.message);
          uiState.errorText = `进度读取异常：${e.message}`;
          updateSubPanel();
        }
      }

      // 已取消基于时间的兜底，不做 elapsed 判断
      await wait(5000);
    }
  }

  /******************************************************************
   * 完成后通知父页面
   ******************************************************************/
  function sendCourseFinished() {
    const title = getCourseTitle();
    log('所有小节学习完成，向父页面发送完成消息：', title);
    try {
      window.parent.postMessage(
        {
          type: 'HXT_COURSE_FINISHED',
          courseTitle: title,
        },
        '*'
      );
    } catch (e) {
      log('postMessage 发送失败：', e.message);
      uiState.errorText = `postMessage 失败：${e.message}`;
      updateSubPanel();
    }
  }

  /******************************************************************
   * 主流程：连播所有小节
   ******************************************************************/
  async function runCourseSequence() {
    const courseTitle = getCourseTitle();
    log('子站自动学习：开始处理课程：', courseTitle);

    createSubPanel();
    uiState.status = '已注入';
    uiState.sectionTitle = '';
    uiState.progressText = '';
    uiState.errorText = '';
    updateSubPanel();

    let video = await getVideoElement();
    ensureMuteLoop(video);
    forceAutoPlayLoop(video); // 后台循环，不 await

    while (true) {
      const sections = getSectionList();
      if (!sections.length) {
        log('未找到右侧小节目录（.videoList .item），按单一大视频模式处理。');
        uiState.status = '监控中';
        uiState.sectionTitle = '未找到目录，小节未知';
        uiState.progressText = '';
        updateSubPanel();

        await waitOneSectionFinished(video);

        uiState.status = '已完成';
        uiState.sectionTitle = '单视频模式完成';
        uiState.progressText = '';
        updateSubPanel();
        sendCourseFinished();
        return;
      }

      const nextUnDoneIndex = sections.findIndex(s => !s.done);
      if (nextUnDoneIndex === -1) {
        log('检测到所有小节百分比均为 100%（或完成状态），课程完成。');
        uiState.status = '已完成';
        uiState.sectionTitle = '全部小节已完成';
        uiState.progressText = '100%';
        updateSubPanel();
        sendCourseFinished();
        return;
      }

      let curIndex = findCurrentSectionIndex(sections);
      if (sections[curIndex].done && !sections[nextUnDoneIndex].isActive) {
        curIndex = nextUnDoneIndex;
        clickSection(curIndex);
        await wait(3000);
        video = await getVideoElement();
        ensureMuteLoop(video);
        forceAutoPlayLoop(video);
      }

      const curSec = getSectionList()[curIndex];
      log(
        `开始学习小节 [${curIndex + 1}/${sections.length}]：${curSec.title}，当前进度：${
          curSec.percentText || '未知'
        }`
      );

      uiState.status = '监控中';
      uiState.sectionTitle = curSec.title;
      uiState.progressText = curSec.percentText || '未知';
      uiState.errorText = '';
      updateSubPanel();

      await waitOneSectionFinished(video);
      await wait(3000); // 等 DOM 刷新小节进度
    }
  }

  /******************************************************************
   * 入口
   ******************************************************************/
  async function main() {
    log('子脚本已注入，准备自动学习外部子站课程。');
    createSubPanel();
    uiState.status = '已注入';
    updateSubPanel();
    await runCourseSequence();
  }

  main().catch(e => {
    console.error(LOG_PREFIX, '入口异常：', e);
    createSubPanel();
    uiState.status = '错误';
    uiState.errorText = `入口异常：${e.message}`;
    updateSubPanel();
  });
})();