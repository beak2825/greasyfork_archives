// ==UserScript==
// @name         HDU 課程點播下載助手
// @namespace    https://course.hdu.edu.cn/
// @version      0.2
// @description  右側欄展示課程列表，一鍵取得無浮水印點播影片並直接下載
// @author       nanyancc
// @match        https://course.hdu.edu.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558301/HDU%20%E8%AA%B2%E7%A8%8B%E9%BB%9E%E6%92%AD%E4%B8%8B%E8%BC%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558301/HDU%20%E8%AA%B2%E7%A8%8B%E9%BB%9E%E6%92%AD%E4%B8%8B%E8%BC%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CURRICULUM_PATH = '/jy-application-vod-he-hdu/v1/myself/curriculum';
  const VOD_URL_PATH = '/jy-application-vod-he-hdu/v1/course_vod_urls';

  let sidebarCreated = false;
  let courseListEl = null;
  let rawRecords = [];
  let groupedCourses = [];
  let expandedTimeListEl = null;

  /********************
   * 工具函数
   ********************/

  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatCourseTime(begin, end) {
    if (!begin || !end) return '时间未知';
    // 示例：2025-12-01 10:50:00
    const day = begin.slice(5, 10); // 12-01
    const t1 = begin.slice(11, 16); // 10:50
    const t2 = end.slice(11, 16);   // 11:35
    return `${day} ${t1} ~ ${t2}`;
  }

  function showToast(msg, type = 'info') {
    let toast = document.getElementById('hdu-course-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hdu-course-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `hdu-course-toast hdu-course-toast-${type}`;
    toast.style.opacity = '1';
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2500);
  }

  // 打开新标签页进行下载，必要时退回到隐藏链接
  function downloadFile(url, filename) {
    if (!url) return;
    const newTab = window.open(url, '_blank', 'noopener');
    if (newTab) return;

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.target = '_blank';
    if (filename) a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /********************
   * 右侧栏 UI + 样式
   ********************/

  function injectStyles() {
    if (document.getElementById('hdu-course-style')) return;
    const style = document.createElement('style');
    style.id = 'hdu-course-style';
    style.textContent = `
#hdu-course-sidebar {
  position: fixed;
  top: 0px;
  right: 0;
  width: 360px;
  height: 100%;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  box-shadow: -4px 0 20px rgba(0,0,0,0.08);
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  color: #111827;
  display: flex;
  flex-direction: column;
  transform: translateX(0);
  transition: transform 0.25s ease-out;
}

#hdu-course-sidebar.hdu-course-sidebar-hidden {
  transform: translateX(100%);
}

#hdu-course-sidebar-header {
  padding: 12px 16px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#hdu-course-sidebar-title {
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

#hdu-course-sidebar-title span.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.35);
}

#hdu-course-sidebar-close {
  border: none;
  background: rgba(15, 23, 42, 0.2);
  color: #e5e7eb;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

#hdu-course-sidebar-close:hover {
  background: rgba(15, 23, 42, 0.35);
}

#hdu-course-sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 8px;
  min-height: 0;
}

#hdu-course-sidebar-body::-webkit-scrollbar {
  width: 6px;
}
#hdu-course-sidebar-body::-webkit-scrollbar-thumb {
  background-color: rgba(148,163,184,0.7);
  border-radius: 999px;
}

#hdu-course-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hdu-course-empty {
  font-size: 13px;
  color: #6b7280;
  padding: 10px;
  text-align: center;
}

.hdu-course-item {
  border-radius: 12px;
  padding: 10px 10px 8px;
  background: #f9fafb;
  box-shadow: 0 4px 12px rgba(15,23,42,0.06);
  display: flex;
  flex-direction: column;
}

.hdu-course-header-main {
  cursor: pointer;
  padding-bottom: 6px;
  margin-bottom: 4px;
}

.hdu-course-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hdu-course-teacher {
  font-size: 12px;
  color: #6b7280;
  margin-left: 6px;
}

.hdu-course-meta {
  font-size: 12px;
  color: #4b5563;
  margin-top: 4px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.hdu-course-meta span {
  white-space: nowrap;
}

.hdu-course-time-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hdu-course-time-list-collapsed {
  display: none;
}

.hdu-course-time-row {
  border-radius: 10px;
  padding: 6px 8px 5px;
  background: #f3f4f6;
}

.hdu-course-time-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.hdu-course-time-main {
  font-size: 12px;
  color: #111827;
}

.hdu-course-time-main > div:first-child {
  font-weight: 500;
}

.hdu-course-time-sub {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.hdu-course-time-actions {
  display: flex;
  align-items: center;
}

.hdu-course-download-btn {
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 6px 12px rgba(37,99,235,0.25);
  white-space: nowrap;
}

.hdu-course-download-btn span.icon {
  font-size: 13px;
}

.hdu-course-download-btn:disabled {
  opacity: 0.65;
  cursor: default;
  box-shadow: none;
}

.hdu-course-download-btn:hover:not(:disabled) {
  filter: brightness(1.05);
}

.hdu-course-vod-inline {
  margin-top: 5px;
  padding-top: 4px;
  font-size: 12px;
  color: #374151;
}

.hdu-course-vod-inline-title {
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 3px;
}

.hdu-course-vod-inline-empty {
  font-size: 12px;
  color: #6b7280;
}

.hdu-course-vod-inline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
}

.hdu-course-vod-inline-main {
  max-width: 230px;
}

.hdu-course-vod-inline-label {
  font-weight: 500;
}

.hdu-course-vod-inline-url {
  font-size: 11px;
  color: #6b7280;
  word-break: break-all;
}

.hdu-course-vod-inline-buttons {
  flex-shrink: 0;
}

.hdu-course-vod-download {
  border-radius: 999px;
  border: none;
  background: #22c55e;
  color: #fff;
  font-size: 11px;
  padding: 3px 8px;
  cursor: pointer;
}

.hdu-course-vod-download:hover {
  filter: brightness(1.05);
}

/* 右侧可拖动的小标签 */
#hdu-course-sidebar-toggle {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 999998;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
  padding: 8px 4px;
  writing-mode: vertical-rl;
  font-size: 12px;
  border-radius: 10px 0 0 10px;
  box-shadow: -2px 0 10px rgba(15,23,42,0.2);
  cursor: pointer;
  display: none;
  user-select: none;
}

/* toast */
.hdu-course-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 180px;
  max-width: 280px;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 999px;
  text-align: center;
  color: #fff;
  background: rgba(15,23,42,0.9);
  z-index: 1000001;
  transition: opacity 0.2s ease-out;
  opacity: 0;
  pointer-events: none;
}

.hdu-course-toast-info {
  background: rgba(15,23,42,0.9);
}
.hdu-course-toast-error {
  background: rgba(220,38,38,0.95);
}
    `;
    document.head.appendChild(style);
  }

  function ensureSidebar() {
    if (sidebarCreated) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', ensureSidebar, { once: true });
      return;
    }

    injectStyles();

    const sidebar = document.createElement('div');
    sidebar.id = 'hdu-course-sidebar';
    sidebar.innerHTML = `
      <div id="hdu-course-sidebar-header">
        <div id="hdu-course-sidebar-title">
          <span class="logo-dot"></span>
          <span>课程点播下载助手</span>
        </div>
        <button id="hdu-course-sidebar-close" title="隐藏侧边栏">
          隐藏
        </button>
      </div>
      <div id="hdu-course-sidebar-body">
        <div id="hdu-course-list">
          <div class="hdu-course-empty">等待课程数据中… 请在平台中打开“我的课程/回放”等页面。</div>
        </div>
      </div>
    `;
    document.body.appendChild(sidebar);

    const toggle = document.createElement('div');
    toggle.id = 'hdu-course-sidebar-toggle';
    toggle.textContent = '课程下载助手';
    document.body.appendChild(toggle);

    const closeBtn = sidebar.querySelector('#hdu-course-sidebar-close');
    closeBtn.addEventListener('click', () => {
      sidebar.classList.add('hdu-course-sidebar-hidden');
      toggle.style.display = 'block';
    });

    // 恢复拖拽高度
    const savedTop = localStorage.getItem('hduCourseToggleTop');
    if (savedTop != null && !Number.isNaN(parseInt(savedTop, 10))) {
      toggle.style.top = parseInt(savedTop, 10) + 'px';
      toggle.style.transform = 'none';
    }

    let dragging = false;
    let dragStartY = 0;
    let dragStartTop = 0;
    let dragMoved = false;

    const onMouseMove = (e) => {
      if (!dragging) return;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dy) > 3) dragMoved = true;
      let newTop = dragStartTop + dy;
      const minTop = 10;
      const maxTop = window.innerHeight - toggle.offsetHeight - 10;
      newTop = Math.max(minTop, Math.min(maxTop, newTop));
      toggle.style.top = newTop + 'px';
      toggle.style.transform = 'none';
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      localStorage.setItem('hduCourseToggleTop', String(toggle.offsetTop));
    };

    toggle.addEventListener('mousedown', (e) => {
      dragging = true;
      dragMoved = false;
      dragStartY = e.clientY;
      dragStartTop = toggle.offsetTop;
      toggle.style.transform = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    toggle.addEventListener('click', (e) => {
      if (dragMoved) {
        e.preventDefault();
        return;
      }
      sidebar.classList.remove('hdu-course-sidebar-hidden');
      toggle.style.display = 'none';
    });

    courseListEl = sidebar.querySelector('#hdu-course-list');

    // 课程列表事件委托：展开/收起 + 下载源视频
    courseListEl.addEventListener('click', (ev) => {
      const header = ev.target.closest('.hdu-course-header-main');
      if (header && courseListEl.contains(header)) {
        const card = header.closest('.hdu-course-item');
        const timeList = card && card.querySelector('.hdu-course-time-list');
        if (timeList) {
          const isCollapsed = timeList.classList.contains('hdu-course-time-list-collapsed');
          if (!isCollapsed) {
            timeList.classList.add('hdu-course-time-list-collapsed');
            if (expandedTimeListEl === timeList) expandedTimeListEl = null;
          } else {
            if (expandedTimeListEl && expandedTimeListEl !== timeList) {
              expandedTimeListEl.classList.add('hdu-course-time-list-collapsed');
            }
            timeList.classList.remove('hdu-course-time-list-collapsed');
            expandedTimeListEl = timeList;
          }
        }
        return;
      }

      const btn = ev.target.closest('.hdu-course-download-btn');
      if (btn && courseListEl.contains(btn)) {
        const row = btn.closest('.hdu-course-time-row');
        if (!row) return;
        const courseId = btn.getAttribute('data-course-id');
        const courseName = btn.getAttribute('data-course-name') || '课程';
        const container = row.querySelector('.hdu-course-vod-inline');
        if (!courseId || !container) return;
        fetchVodAndRender(btn, courseId, courseName, container);
      }
    });

    sidebarCreated = true;
  }

  /********************
   * 合并课程 + 分页渲染
   ********************/

  // 按 subjName + teclCode 合并
  function groupCourses(records) {
    const map = new Map();
    records.forEach((rec) => {
      if (!rec) return;
      const subjName = rec.subjName || '未命名课程';
      const code = rec.teclCode || rec.teclName || rec.subjCode || '';
      const key = subjName + '||' + code;
      let group = map.get(key);
      if (!group) {
        group = {
          key,
          subjName,
          code,
          teacherNamesSet: new Set(),
          records: []
        };
        map.set(key, group);
      }
      const teachers = rec.teacNames || rec.teclTeacNames || [];
      teachers.forEach((t) => t && group.teacherNamesSet.add(t));
      group.records.push(rec);
    });

    const groups = Array.from(map.values()).map((g) => {
      g.teacherNamesArr = Array.from(g.teacherNamesSet);
      g.records.sort((a, b) => {
        const ta = a.courBeginTime || '';
        const tb = b.courBeginTime || '';
        return ta.localeCompare(tb);
      });
      return g;
    });

    groups.sort((a, b) => {
      const ta = (a.records[0] && a.records[0].courBeginTime) || '';
      const tb = (b.records[0] && b.records[0].courBeginTime) || '';
      if (ta && tb) return ta.localeCompare(tb);
      return a.subjName.localeCompare(b.subjName);
    });

    return groups;
  }

  function updateRecords(records) {
    rawRecords = Array.isArray(records) ? records.slice() : [];
    groupedCourses = groupCourses(rawRecords);
    renderCoursesPage();
  }

  function renderCoursesPage() {
    ensureSidebar();
    if (!courseListEl) return;

    courseListEl.innerHTML = '';
    expandedTimeListEl = null;

    const totalGroups = groupedCourses.length;
    if (!totalGroups) {
      const empty = document.createElement('div');
      empty.className = 'hdu-course-empty';
      empty.textContent = '没有检测到可用的课程回放。';
      courseListEl.appendChild(empty);
      return;
    }

    groupedCourses.forEach((group) => {
      const card = document.createElement('div');
      card.className = 'hdu-course-item';

      const header = document.createElement('div');
      header.className = 'hdu-course-header-main';

      const teacherStr = group.teacherNamesArr.length
        ? group.teacherNamesArr.join('、')
        : '';

      header.innerHTML = `
        <div class="hdu-course-title">
          <span>${escapeHTML(group.subjName)}</span>
          ${teacherStr ? `<span class="hdu-course-teacher">${escapeHTML(teacherStr)}</span>` : ''}
        </div>
        <div class="hdu-course-meta">
          ${group.code ? `<span>课程号：${escapeHTML(group.code)}</span>` : ''}
        </div>
      `;

      const timeList = document.createElement('div');
      timeList.className = 'hdu-course-time-list hdu-course-time-list-collapsed';

      group.records.forEach((rec, idx) => {
        const timeRow = document.createElement('div');
        timeRow.className = 'hdu-course-time-row';

        const timeStr = formatCourseTime(rec.courBeginTime, rec.courEndTime);
        const room = rec.clroName || '';
        const section = rec.letiNumber != null ? `第 ${rec.letiNumber} 节` : '';
        const extraInfoPieces = [];
        if (room) extraInfoPieces.push(`教室：${room}`);
        if (section) extraInfoPieces.push(section);
        const extraInfo = extraInfoPieces.join(' ｜ ');

        const labelPrefix = group.records.length > 1 ? `第 ${idx + 1} 次 · ` : '';
        const courseId = rec.id;

        timeRow.innerHTML = `
          <div class="hdu-course-time-top">
            <div class="hdu-course-time-main">
              <div>${labelPrefix}${escapeHTML(timeStr)}</div>
              ${extraInfo ? `<div class="hdu-course-time-sub">${escapeHTML(extraInfo)}</div>` : ''}
            </div>
            <div class="hdu-course-time-actions">
              <button class="hdu-course-download-btn"
                      data-course-id="${courseId}"
                      data-course-name="${escapeHTML(group.subjName)}">
                <span class="icon">⬇</span>
                <span>下载源视频</span>
              </button>
            </div>
          </div>
          <div class="hdu-course-vod-inline"></div>
        `;

        timeList.appendChild(timeRow);
      });

      card.appendChild(header);
      card.appendChild(timeList);
      courseListEl.appendChild(card);
    });

  }

  /********************
   * 视频源获取 + 内嵌展示
   ********************/

  function renderVodInline(container, courseName, list) {
    container.innerHTML = '';
    const title = document.createElement('div');
    title.className = 'hdu-course-vod-inline-title';
    container.appendChild(title);

    if (!Array.isArray(list) || list.length === 0) {
      const tip = document.createElement('div');
      tip.className = 'hdu-course-vod-inline-empty';
      tip.textContent = '没有找到可下载的视频源。';
      container.appendChild(tip);
      return;
    }

    // 按题意：courseVodViewList 中依次为 教师端 / 学生端 / 课件端
    const labels = ['教师端', '学生端', '课件端'];

    list.forEach((item, idx) => {
      if (!item || !item.url) return;
      const label = labels[idx] || `视频 ${idx + 1}`;
      const url = item.url;
      const viewNumStr = item.viewNum != null ? String(item.viewNum) : '未知';
      const vodIdStr = item.vodId != null ? String(item.vodId) : '未知';

      const row = document.createElement('div');
      row.className = 'hdu-course-vod-inline-item';
      row.innerHTML = `
        <div class="hdu-course-vod-inline-main">
          <div class="hdu-course-vod-inline-label">${escapeHTML(label)}</div>
          <div class="hdu-course-vod-inline-url">
            viewNum:${escapeHTML(viewNumStr)} vodID:${escapeHTML(vodIdStr)}
          </div>
        </div>
        <div class="hdu-course-vod-inline-buttons">
          <button type="button" class="hdu-course-vod-download">下载</button>
        </div>
      `;

      const downloadBtn = row.querySelector('.hdu-course-vod-download');
      downloadBtn.addEventListener('click', () => {
        const filename = `${courseName || '课程'}-${label}.mp4`;
        downloadFile(url, filename);
      });

      container.appendChild(row);
    });
  }

  async function fetchVodAndRender(btn, courseId, courseName, container) {
    if (!container) return;

    let originalBtnHTML = '';
    if (btn) {
      originalBtnHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="icon">⌛</span><span>获取中…</span>';
    }

    container.innerHTML = '';
    container.classList.add('hdu-course-vod-inline');

    try {
      const url = `${VOD_URL_PATH}?courseId=${encodeURIComponent(courseId)}`;
      const resp = await fetch(url, { credentials: 'include' });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const json = await resp.json();
      const data = json && json.data;
      const list = data && data.courseVodViewList;
      renderVodInline(container, courseName, list);
    } catch (err) {
      console.error('[课程点播下载助手] 获取视频源失败：', err);
      container.innerHTML = '<div class="hdu-course-vod-inline-empty">获取视频源失败，请稍后重试。</div>';
      showToast('获取视频源失败，请稍后重试。', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHTML || '<span class="icon">⬇</span><span>下载源视频</span>';
      }
    }
  }

  /********************
   * 拦截 fetch / XHR，拿到 curriculum 数据
   ********************/

  function handleCurriculumResponseJson(json) {
    try {
      const records = json && json.data && json.data.records;
      if (Array.isArray(records)) {
        updateRecords(records);
      }
    } catch (e) {
      console.error('[课程点播下载助手] 解析 curriculum 返回值失败：', e);
    }
  }

  function patchFetch() {
    if (!window.fetch) return;
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
      let url = '';
      try {
        if (typeof input === 'string') {
          url = input;
        } else if (input && input.url) {
          url = input.url;
        }
      } catch (e) { /* ignore */ }

      const p = originalFetch.call(this, input, init);
      if (url.includes(CURRICULUM_PATH)) {
        p.then((resp) => {
          try {
            const clone = resp.clone();
            clone.json().then(handleCurriculumResponseJson).catch(() => { /* ignore */ });
          } catch (e) {
            // ignore
          }
        }).catch(() => { /* ignore */ });
      }
      return p;
    };
  }

  function patchXHR() {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._hduUrl = url || '';
      return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      if (this.addEventListener) {
        this.addEventListener('load', function () {
          try {
            if (this._hduUrl && this._hduUrl.indexOf(CURRICULUM_PATH) !== -1) {
              const text = this.responseText;
              if (text) {
                const json = JSON.parse(text);
                handleCurriculumResponseJson(json);
              }
            }
          } catch (e) {
            // ignore
          }
        });
      }
      return origSend.apply(this, arguments);
    };
  }

  /********************
   * 初始化
   ********************/

  function init() {
    document.addEventListener('DOMContentLoaded', () => {
      ensureSidebar();
    });

    patchFetch();
    patchXHR();
  }

  init();
})();
