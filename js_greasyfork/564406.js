// ==UserScript==
// @name         呼伦贝尔继续教育自动学习助手（父脚本）
// @namespace    hlbe.chinahrt.cn
// @version      1.2.0
// @description  自动解析项目课程列表、自动播放onlineVideo章节、接收OutVideo子站完成消息并自动切换下一门未完成课程，直至全部课程100%完成；项目页/onlineVideo/OutVideo统一从course_study.asp抓取课程列表，保留项目名+整体进度+目录列表+高亮功能；每1小时自动刷新当前页面，暴露登录是否过期；取消“单节1小时兜底完成”限制，仅按视频实际进度判断。
// @author       ChatGPT
// @license      MIT
// @match        https://hlbe.chinahrt.cn/course_study.asp*
// @match        https://hlbe.chinahrt.cn/onlineVideo.asp*
// @match        https://hlbe.chinahrt.cn/OutVideo.asp*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/564406/%E5%91%BC%E4%BC%A6%E8%B4%9D%E5%B0%94%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E7%88%B6%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564406/%E5%91%BC%E4%BC%A6%E8%B4%9D%E5%B0%94%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E7%88%B6%E8%84%9A%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******************************************************************
   * 全局配置
   ******************************************************************/
  const SCAN_INTERVAL_MS = 3000;        // 主循环扫描间隔
  const AUTO_START_DELAY_MS = 5000;     // 自动开启“按未完成顺序学习”的延迟
  const ONLINE_CHAPTER_END_THRESHOLD = 5; // 章节结束阈值（秒）
  // 已取消：单章节最长学习时长兜底
  // const ONLINE_MAX_PER_CHAPTER = 3600;

  // 每隔 1 小时自动刷新当前页面，用来暴露登录是否过期
  const PAGE_RELOAD_INTERVAL_MS = 60 * 60 * 1000; // 1 小时

  /******************************************************************
   * 全局状态
   ******************************************************************/
  const state = {
    scriptEnabled: true,     // 总开关：默认开启
    runningMain: true,       // 自动按“未完成课程顺序学习”（默认开启）
    startTime: Date.now(),
    pseudoStudySeconds: 0,
    lastAction: '脚本启动',
    lastLogLines: [],
    projectTitle: '',
    projectProgressText: '',
    courseListCache: [],     // { title, href, progressText, completed, kcid, id }
    lastPageType: '',
    autoStarted: false,      // 是否已自动开启过runningMain（保留字段）
  };

  /******************************************************************
   * 工具函数
   ******************************************************************/
  function log() {
    const msg = Array.prototype.slice.call(arguments).join(' ');
    console.log('[HLBE-MAIN]', msg);
    state.lastLogLines.push(msg);
    if (state.lastLogLines.length > 80) state.lastLogLines.shift();
    updateLogUI();
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function formatSeconds(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = n => (n < 10 ? '0' + n : '' + n);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function getUrlParam(url, name) {
    try {
      const u = new URL(url, location.origin);
      return u.searchParams.get(name) || '';
    } catch (e) {
      return '';
    }
  }

  function sameCourseKeyFromUrl(url) {
    const kcid = getUrlParam(url, 'kcid') || '';
    const id = getUrlParam(url, 'id') || '';
    return `${kcid}_${id}`;
  }

  function getCurrentCourseKey() {
    return sameCourseKeyFromUrl(location.href);
  }

  /******************************************************************
   * 页面类型识别
   ******************************************************************/
  function isCourseStudyPage() {
    return /course_study\.asp/i.test(location.href);
  }

  function isOnlineVideoPage() {
    return /onlineVideo\.asp/i.test(location.href);
  }

  function isOutVideoPage() {
    return /OutVideo\.asp/i.test(location.href);
  }

  function detectPageType() {
    if (isCourseStudyPage()) return '课程列表页';
    if (isOnlineVideoPage()) return 'onlineVideo 播放页';
    if (isOutVideoPage()) return 'OutVideo 播放页';
    return '其他页面';
  }

  /******************************************************************
   * 自动每 1 小时整页刷新
   ******************************************************************/
  function setupAutoPageReload() {
    setInterval(() => {
      console.log(
        '[HLBE-MAIN] 已运行一段时间，自动刷新页面以检查登录是否过期。'
      );
      location.reload();
    }, PAGE_RELOAD_INTERVAL_MS);
  }

  /******************************************************************
   * 项目信息 & 课程列表解析（保持你原来的 DOM 逻辑）
   ******************************************************************/
  function parseProjectInfoFromDoc(doc) {
    try {
      const box = doc.querySelector('.ckkc-desc');
      if (!box) {
        log('未找到 .ckkc-desc 容器，项目名称与整体进度可能无法识别。');
        return { title: '', progressText: '' };
      }
      // 项目名称
      let title = '';
      const tSpan = box.querySelector('p.pt25 span.font18');
      if (tSpan && tSpan.textContent.trim()) {
        title = tSpan.textContent.trim();
      }
      // 整体进度
      let progressText = '';
      const ps = box.querySelectorAll('.class-desc p');
      for (const p of ps) {
        const txt = (p.textContent || '').replace(/\s+/g, '');
        if (txt.indexOf('学习进度') >= 0 && txt.indexOf('已完成') >= 0) {
          const m = txt.match(/已完成[:：]([^%]+%)/);
          if (m) {
            progressText = '已完成：' + m[1];
          } else {
            progressText = p.textContent.trim();
          }
          break;
        }
      }
      return { title, progressText };
    } catch (e) {
      log('解析项目名称/整体进度出错：', e.message);
      return { title: '', progressText: '' };
    }
  }

  function parseCourseListFromDoc(doc) {
    const list = [];
    try {
      const lis = doc.querySelectorAll('.ckkc-desc ul.ui-bxkc li');
      if (!lis || !lis.length) {
        log('未在 .ckkc-desc ul.ui-bxkc 中找到课程 li 元素。');
        return [];
      }
      lis.forEach((li, idx) => {
        let a = li.querySelector('a[href*="onlineVideo.asp"],a[href*="OutVideo.asp"]');
        if (!a) return;
        let href = a.getAttribute('href') || '';
        if (!/^(https?:)?\/\//i.test(href)) {
          href = location.origin + (href.startsWith('/') ? href : '/' + href);
        }
        let title = '';
        const atitle = li.querySelector('a.kj_title');
        if (atitle && atitle.textContent.trim()) {
          title = atitle.textContent.trim();
        } else if (li.getAttribute('title')) {
          title = li.getAttribute('title').trim();
        } else {
          title = '课程' + (idx + 1);
        }
        let progText = '';
        const progP = li.querySelector('.lanbg p,.hongbg p');
        if (progP && progP.textContent.trim()) {
          progText = progP.textContent.trim();
        }
        let completed = false;
        const lower = (progText || '').toLowerCase().replace(/\s+/g, '');
        if (lower === 'ok') {
          completed = true;
        } else if (/%/.test(progText)) {
          const m = progText.match(/([\d.]+)\s*%/);
          if (m) {
            const v = parseFloat(m[1]);
            if (!isNaN(v) && v >= 99.9) completed = true;
          }
        }
        const kcid = getUrlParam(href, 'kcid');
        const id = getUrlParam(href, 'id');
        list.push({
          title,
          href,
          progressText: progText || (completed ? 'ok' : '0%'),
          completed,
          kcid,
          id,
        });
      });
      log('解析课程列表成功：共', list.length, '门课程。');
    } catch (e) {
      log('解析课程列表出错：', e.message);
    }
    return list;
  }

  /**
   * 播放页统一：从项目页抓取 HTML，并解析项目信息+课程列表。
   */
  async function fetchProjectPageAndParse() {
    try {
      const cur = new URL(location.href);
      const gcid = cur.searchParams.get('gcid');
      const kcid =
        cur.searchParams.get('kcid') ||
        cur.searchParams.get('id'); // 兼容只有 id 的情况

      if (!gcid || !kcid) {
        log('当前 URL 未包含 gcid/kcid(id)，无法自动构造 course_study 页面地址。');
        return null;
      }

      const url = `${location.origin}/course_study.asp?id=${encodeURIComponent(
        kcid
      )}&gcid=${encodeURIComponent(gcid)}`;
      log('尝试 fetch 项目页面：', url);
      const resp = await fetch(url, { credentials: 'include' });
      if (!resp.ok) {
        log('fetch 项目页面失败：HTTP', resp.status);
        return null;
      }
      const html = await resp.text();
      const tmpDoc = new DOMParser().parseFromString(html, 'text/html');
      return tmpDoc;
    } catch (e) {
      log('fetch 项目页面异常：', e.message);
      return null;
    }
  }

  /******************************************************************
   * 课程列表 & 下一门未完成课程
   ******************************************************************/
  function getCourseList() {
    return state.courseListCache || [];
  }

  function findNextIncompleteCourse() {
    const list = getCourseList();
    for (const c of list) {
      if (!c.completed) return c;
    }
    return null;
  }

  function openNextIncompleteCourse() {
    if (!state.scriptEnabled) {
      log('脚本总开关已关闭，不再自动切换课程。');
      return false;
    }
    const course = findNextIncompleteCourse();
    if (!course) {
      log('未找到未完成课程，可能全部已完成，自动学习将停止。');
      state.runningMain = false;
      state.lastAction = '所有课程可能已完成，自动学习已停止';
      updateMainUI();
      return false;
    }
    state.lastAction = `打开未完成课程：${course.title}（进度：${course.progressText}）`;
    log(state.lastAction);
    updateMainUI();
    location.href = course.href;
    return true;
  }

  /******************************************************************
   * 主面板 UI
   ******************************************************************/
  let panel,
    logEl,
    infoEl,
    projectProgressEl,
    courseListEl,
    statusEl,
    btnMainToggle,
    btnScriptToggle;

  function createMainPanel() {
    if (panel) return;
    panel = document.createElement('div');
    panel.id = 'hlbe-main-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      left: '10px',
      bottom: '10px',
      width: '380px',
      maxHeight: '380px',
      background: 'rgba(255,255,255,0.97)',
      boxShadow: '0 10px 25px rgba(15,23,42,0.35)',
      borderRadius: '8px',
      fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
      fontSize: '12px',
      color: '#111827',
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    });

    // 头部
    const header = document.createElement('div');
    Object.assign(header.style, {
      padding: '6px 10px',
      background: 'linear-gradient(to right,#1d4ed8,#3b82f6)',
      color: '#fff',
      cursor: 'move',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    });
    const title = document.createElement('div');
    title.textContent = '呼伦贝尔市专业技术人员继续教育在线学习平台';
    title.style.fontWeight = '600';
    title.style.fontSize = '12px';

    const subtitle = document.createElement('div');
    subtitle.textContent = '学习助手';
    subtitle.style.fontSize = '11px';
    subtitle.style.opacity = '0.85';

    header.appendChild(title);
    header.appendChild(subtitle);
    panel.appendChild(header);

    // 可拖动
    makeDraggable(panel, header);

    const body = document.createElement('div');
    Object.assign(body.style, {
      padding: '6px 10px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      fontSize: '12px',
      overflow: 'hidden',
    });
    panel.appendChild(body);

    // 按钮区域：脚本总开关 + 自动学习开关
    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, {
      display: 'flex',
      gap: '6px',
      marginBottom: '4px',
    });
    body.appendChild(btnRow);

    // 1）脚本总开关按钮
    btnScriptToggle = document.createElement('button');
    btnScriptToggle.id = 'hlbe-script-toggle';
    Object.assign(btnScriptToggle.style, {
      padding: '4px 8px',
      fontSize: '12px',
      borderRadius: '999px',
      border: '1px solid rgba(37,99,235,.25)',
      cursor: 'pointer',
      flexShrink: '0',
    });
    btnScriptToggle.onclick = () => {
      state.scriptEnabled = !state.scriptEnabled;
      state.lastAction = state.scriptEnabled
        ? '用户：开启脚本（总开关）'
        : '用户：关闭脚本（总开关）';
      log(state.lastAction);
      updateMainUI();
    };
    btnRow.appendChild(btnScriptToggle);

    // 2）自动学习按钮
    btnMainToggle = document.createElement('button');
    btnMainToggle.id = 'hlbe-main-toggle';
    Object.assign(btnMainToggle.style, {
      padding: '4px 8px',
      fontSize: '12px',
      borderRadius: '999px',
      border: '1px solid rgba(37,99,235,.25)',
      cursor: 'pointer',
      flexShrink: '0',
    });
    btnMainToggle.onclick = () => {
      if (!state.scriptEnabled) {
        log('脚本总开关已关闭，无法开启自动学习。请先打开“脚本开关”。');
        return;
      }
      state.runningMain = !state.runningMain;
      state.lastAction = state.runningMain
        ? '用户：开启“自动按未完成课程顺序学习”'
        : '用户：关闭“自动按未完成课程顺序学习”';
      log(state.lastAction);
      updateMainUI();
    };
    btnRow.appendChild(btnMainToggle);

    // 当前信息
    infoEl = document.createElement('div');
    Object.assign(infoEl.style, {
      fontSize: '12px',
      lineHeight: '1.4',
    });
    body.appendChild(infoEl);

    // 整体进度
    projectProgressEl = document.createElement('div');
    Object.assign(projectProgressEl.style, {
      marginTop: '2px',
      fontSize: '12px',
      color: '#4b5563',
    });
    body.appendChild(projectProgressEl);

    // 课程列表
    courseListEl = document.createElement('div');
    Object.assign(courseListEl.style, {
      marginTop: '4px',
      padding: '4px',
      borderRadius: '4px',
      border: '1px solid rgba(148,163,184,0.8)',
      background: '#f9fafb',
      maxHeight: '140px',
      overflowY: 'auto',
      fontSize: '12px',
    });
    body.appendChild(courseListEl);

    // 状态栏
    statusEl = document.createElement('div');
    Object.assign(statusEl.style, {
      marginTop: '4px',
      fontSize: '11px',
      color: '#4b5563',
    });
    body.appendChild(statusEl);

    // 日志
    logEl = document.createElement('div');
    Object.assign(logEl.style, {
      marginTop: '4px',
      padding: '4px',
      borderRadius: '4px',
      background: '#0f172a',
      color: '#e5e7eb',
      fontFamily: 'ui-monospace,monospace',
      fontSize: '11px',
      maxHeight: '110px',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
    });
    body.appendChild(logEl);

    // 底部说明
    const foot = document.createElement('div');
    foot.textContent =
      '· 自动学习：按课程列表中“未完成”顺序自动进入下一门课程。';
    Object.assign(foot.style, {
      marginTop: '2px',
      fontSize: '10px',
      color: '#6b7280',
    });
    body.appendChild(foot);

    document.body.appendChild(panel);
    updateMainUI();
    updateLogUI();
  }

  function makeDraggable(box, handle) {
    let isDown = false;
    let startX = 0,
      startY = 0,
      boxX = 0,
      boxY = 0;
    handle.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = box.getBoundingClientRect();
      boxX = rect.left;
      boxY = rect.top;
      box.style.transition = 'none';
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      box.style.left = boxX + dx + 'px';
      box.style.top = boxY + dy + 'px';
      box.style.bottom = 'auto';
    });
    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      box.style.transition = 'box-shadow 150ms ease';
    });
  }

  function detectCourseTitle() {
    try {
      const t = document.querySelector('title');
      if (t && t.textContent.trim()) return t.textContent.trim();
      return '';
    } catch (e) {
      return '';
    }
  }

  function updateMainUI() {
    if (!panel) return;
    const pageType = detectPageType();
    const courseTitle = detectCourseTitle();

    // 脚本总开关按钮
    if (btnScriptToggle) {
      btnScriptToggle.textContent = state.scriptEnabled
        ? '脚本开关：已经开启'
        : '脚本开关：已经关闭';
      btnScriptToggle.style.background = state.scriptEnabled ? '#22c55e' : '#fee2e2';
      btnScriptToggle.style.color = state.scriptEnabled ? '#fff' : '#b91c1c';
    }

    // 自动学习按钮
    if (btnMainToggle) {
      const autoOn = state.scriptEnabled && state.runningMain;
      btnMainToggle.textContent = autoOn
        ? '自动学习：已经开启（按未完成顺序）'
        : '自动学习：已经关闭';
      btnMainToggle.style.background = autoOn ? '#22c55e' : '#fee2e2';
      btnMainToggle.style.color = autoOn ? '#fff' : '#b91c1c';
      btnMainToggle.disabled = !state.scriptEnabled;
      btnMainToggle.style.opacity = state.scriptEnabled ? '1' : '.6';
    }

    if (infoEl) {
      infoEl.innerHTML =
        `<div><strong>当前项目：</strong>${state.projectTitle || courseTitle || '未知项目'}</div>` +
        `<div><strong>当前页面：</strong>${pageType}</div>` +
        `<div><strong>本页估算学习时间：</strong>${formatSeconds(
          state.pseudoStudySeconds
        )}</div>`;
    }

    // 整体进度 + 课程列表
    updateCourseListInPanel();

    // 状态栏
    if (statusEl) {
      const on = state.scriptEnabled && state.runningMain;
      const autoTxt = on ? '开启' : '关闭';
      const runTime = formatSeconds((Date.now() - state.startTime) / 1000);
      statusEl.textContent =
        `【自动学习：${autoTxt}】｜ 本次运行：${runTime} ｜ 最近：${
          state.lastAction || '无'
        }`;
    }
  }

  function updateCourseListInPanel() {
    if (!courseListEl) return;
    const list = getCourseList();
    const total = list.length;
    const finished = list.filter(c => c.completed).length;

    // 整体进度
    if (!total) {
      const txt = state.projectProgressText
        ? `当前项目整体进度：平台：${state.projectProgressText} ｜ 课程：-- / --`
        : '当前项目整体进度：--（平台未识别） ｜ 课程：-- / --';
      if (projectProgressEl) projectProgressEl.textContent = txt;
      courseListEl.innerHTML =
        '<div style="color:#9ca3af;">（暂无可用课程列表，正在尝试自动获取…）</div>';
      return;
    } else {
      const plat = state.projectProgressText || '未知';
      if (projectProgressEl) {
        projectProgressEl.textContent =
          `当前项目整体进度：平台：${plat} ｜ 课程：${finished} / ${total}（已完成 / 总课程）`;
      }
    }

    // 当前课程 key
    const curKey = getCurrentCourseKey();

    const itemsHtml = list
      .map((c, idx) => {
        const key = sameCourseKeyFromUrl(c.href);
        const isCur = curKey && key && curKey === key;
        const isDone = c.completed;
        const prog = c.progressText || (isDone ? 'ok' : '0%');

        const rowBg = isCur
          ? 'background:#dbeafe;'
          : isDone
          ? 'background:#ecfdf3;'
          : 'background:#ffffff;';
        const textColor = isDone ? '#166534' : '#111827';
        const progColor = isDone ? '#16a34a' : '#dc2626';

        return `<div data-idx="${idx}" style="
          padding:2px 4px;
          cursor:pointer;
          ${rowBg}
          border-radius:4px;
          margin-bottom:1px;
          display:flex;
          align-items:center;
        ">
          <span style="display:inline-block;min-width:52px;color:${progColor};font-variant-numeric:tabular-nums;">
            [${prog}]
          </span>
          <span style="flex:1;color:${textColor};">${c.title}</span>
        </div>`;
      })
      .join('');

    courseListEl.innerHTML = itemsHtml;

    // 点击跳转
    Array.from(courseListEl.querySelectorAll('div[data-idx]')).forEach(div => {
      div.onclick = () => {
        const idx = parseInt(div.getAttribute('data-idx') || '0', 10);
        const list2 = getCourseList();
        if (!list2[idx]) return;
        const c = list2[idx];
        log('面板点击课程：', c.title, '进度：', c.progressText || '未知');
        location.href = c.href;
      };
    });

    // 自动滚动到当前课程
    if (curKey && curKey !== '_') {
      const curRow = Array.from(
        courseListEl.querySelectorAll('div[data-idx]')
      ).find(div => {
        const idx = parseInt(div.getAttribute('data-idx') || '0', 10);
        const c = list[idx];
        if (!c) return false;
        const key = sameCourseKeyFromUrl(c.href);
        return key === curKey;
      });
      if (curRow) {
        curRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function updateLogUI() {
    if (!logEl) return;
    logEl.textContent = state.lastLogLines.join('\n');
    logEl.scrollTop = logEl.scrollHeight;
  }

  /******************************************************************
   * onlineVideo 页面：自动静音、章节连播（无“1小时兜底完成”）
   ******************************************************************/
  let onlineLoopStarted = false;

  async function runOnlineVideoController() {
    if (!isOnlineVideoPage()) return;
    if (onlineLoopStarted) return;
    onlineLoopStarted = true;
    log('onlineVideo 播放助手：启动。');

    // 尝试多次获取 video 元素
    let video = null;
    for (let i = 0; i < 20; i++) {
      video =
        document.querySelector('video.pv-video') ||
        document.querySelector('video#chmyiglbpidnnszzni') ||
        document.querySelector('video');
      if (video) break;
      await wait(500);
    }
    if (!video) {
      log('onlineVideo：未找到 video 元素，将仅进行时间等待，不做章节连播。');
      return;
    }

    // 静音处理：短时间内反复设置
    (function ensureMute() {
      try {
        video.muted = true;
        video.volume = 0;
      } catch (e) {}
      setTimeout(ensureMute, 2000);
    })();

    // 自动播放
    try {
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(err => {
          const msg = err && err.message ? String(err.message) : '';
          // 过滤常见“被 pause 打断”的误报
          if (
            msg.includes(
              'The play() request was interrupted by a call to pause()'
            )
          ) {
            log('onlineVideo：play() 被站点 pause() 打断一次，忽略该错误。', msg);
            return;
          }
          log('onlineVideo：自动播放可能被浏览器拦截：', msg);
        });
      }
    } catch (e) {
      log('onlineVideo：调用 video.play() 出错：', e.message);
    }

    // 章节连播主循环
    monitorOnlineChapters(video);
  }

  function getOnlineChapters() {
    let items = [];
    const list1 = document.querySelectorAll('#cc li a');
    const list2 = document.querySelectorAll('.videoList li a');
    const useList = list1.length ? list1 : list2;
    useList.forEach(a => {
      const title = (a.textContent || '').trim() || '未命名章节';
      let isCurrent = false;
      const li = a.closest('li');
      if (
        (a.className || '').indexOf('current') >= 0 ||
        (a.className || '').indexOf('on') >= 0 ||
        (li && (li.className || '').indexOf('cur') >= 0)
      ) {
        isCurrent = true;
      }
      items.push({ a, title, isCurrent });
    });
    return items;
  }

  async function monitorOnlineChapters(video) {
    if (!video) return;

    function findCurrentIndex(chaps) {
      let idx = -1;
      chaps.forEach((c, i) => {
        if (idx === -1 && c.isCurrent) idx = i;
      });
      if (idx === -1 && chaps.length) idx = 0;
      return idx;
    }

    while (true) {
      if (!state.scriptEnabled) {
        await wait(1000);
        continue;
      }

      const chaps = getOnlineChapters();
      const totalChaps = chaps.length;
      if (!totalChaps) {
        await monitorSingleOnlineVideo(video);
        return;
      }

      let idx = findCurrentIndex(chaps);
      if (idx < 0) idx = 0;
      for (; idx < totalChaps; idx++) {
        const chap = chaps[idx];
        log(`onlineVideo：开始播放章节 [${idx + 1}/${totalChaps}]：${chap.title}`);
        await playOneOnlineChapter(video);
        if (!state.scriptEnabled) {
          log('onlineVideo：脚本总开关关闭，停止章节连播。');
          return;
        }
        if (idx < totalChaps - 1) {
          const nextChap = chaps[idx + 1];
          log('onlineVideo：进入下一章节：', nextChap.title);
          nextChap.a.click();
          await wait(3000);
        }
      }

      log('onlineVideo：本课程所有章节已播放完成。');
      if (state.scriptEnabled && state.runningMain) {
        log('onlineVideo：自动学习开启，2 秒后切换下一门未完成课程。');
        await wait(2000);
        openNextIncompleteCourse();
      } else {
        log('onlineVideo：自动学习未开启或脚本总开关关闭，不自动切下一门课程。');
      }
      return;
    }
  }

  async function playOneOnlineChapter(video) {
    while (true) {
      if (!state.scriptEnabled) break;
      try {
        const duration = video.duration || 0;
        const currentTime = video.currentTime || 0;
        const remain = duration - currentTime;
        if (duration && remain <= ONLINE_CHAPTER_END_THRESHOLD) {
          log(
            `onlineVideo：检测到章节接近结束（剩余 ${Math.round(
              remain
            )} 秒），视为完成。`
          );
          break;
        }
      } catch (e) {}
      await wait(2000);
    }
  }

  async function monitorSingleOnlineVideo(video) {
    // 不再用“时间兜底完成”，只是持续等待，直到你手动干预或页面刷新
    while (true) {
      if (!state.scriptEnabled) break;
      await wait(2000);
    }
  }

  /******************************************************************
   * OutVideo：接收子站完成消息
   ******************************************************************/
  function setupOutVideoMessageListener() {
    if (!isOutVideoPage()) return;
    window.addEventListener('message', event => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'HXT_COURSE_FINISHED') {
        const title = data.courseTitle || '未知课程';
        log('OutVideo：收到子页面课程完成信号：', title);
        if (state.scriptEnabled && state.runningMain) {
          log('OutVideo：自动学习开启，2 秒后切换下一门未完成课程。');
          setTimeout(() => {
            openNextIncompleteCourse();
          }, 2000);
        } else {
          log('OutVideo：自动学习未开启或脚本总开关关闭，不自动切换课程。');
        }
      }
    });
  }

  /******************************************************************
   * 主循环
   ******************************************************************/
  async function mainLoop() {
    // 启动 1 小时自动刷新逻辑
    setupAutoPageReload();

    createMainPanel();
    log('脚本已注入，开始主循环。');

    // 保持：默认自动学习开启（state.runningMain 已初始为 true）

    // OutVideo 消息监听
    setupOutVideoMessageListener();

    // onlineVideo 控制
    if (isOnlineVideoPage()) {
      runOnlineVideoController().catch(e => {
        log('onlineVideo 控制器异常：', e.message);
      });
    }

    while (true) {
      try {
        // 伪学习时长统计
        state.pseudoStudySeconds += SCAN_INTERVAL_MS / 1000;
        const nowPageType = detectPageType();
        if (nowPageType !== state.lastPageType) {
          state.lastPageType = nowPageType;
          log('页面类型切换：', nowPageType);
        }

        if (!state.scriptEnabled) {
          updateMainUI();
          await wait(SCAN_INTERVAL_MS);
          continue;
        }

        // 课程列表页：直接解析当前 DOM
        if (isCourseStudyPage()) {
          const doc = document;
          const proj = parseProjectInfoFromDoc(doc);
          state.projectTitle = proj.title || state.projectTitle;
          state.projectProgressText = proj.progressText || state.projectProgressText;
          state.courseListCache = parseCourseListFromDoc(doc);
        } else if (isOnlineVideoPage() || isOutVideoPage()) {
          // 播放页：统一 fetch 项目页解析
          const tmpDoc = await fetchProjectPageAndParse();
          if (tmpDoc) {
            const proj = parseProjectInfoFromDoc(tmpDoc);
            state.projectTitle = proj.title || state.projectTitle;
            state.projectProgressText = proj.progressText || state.projectProgressText;
            state.courseListCache = parseCourseListFromDoc(tmpDoc);
          }
        }

        // 在课程列表页并且自动学习开启：自动进入下一门未完成课程
        if (isCourseStudyPage() && state.runningMain) {
          const next = findNextIncompleteCourse();
          if (next) {
            log('课程列表页：检测到未完成课程，自动进入：', next.title);
            state.lastAction = '从课程列表页自动进入：' + next.title;
            updateMainUI();
            location.href = next.href;
            return;
          } else {
            log('课程列表页：未找到未完成课程，可能全部已完成。');
            state.runningMain = false;
            state.lastAction = '所有课程可能已完成，自动学习已停止';
          }
        }

        updateMainUI();
        await wait(SCAN_INTERVAL_MS);
      } catch (e) {
        log('主循环异常：', e.message);
        await wait(SCAN_INTERVAL_MS);
      }
    }
  }

  // 入口
  mainLoop().catch(e => {
    console.error('[HLBE-MAIN] 脚本入口异常：', e);
  });
})();