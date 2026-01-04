// ==UserScript==
// @name         EPS XHR Interceptor CSV Export (Single Toggle Function)
// @namespace    http://tampermonkey.net/
// @version      2025.11.09.001
// @description  Toggle XHR intercept; auto-download response.dataletBO.cellBOs as CSV
// @match        *://olap.epsnet.nc.sjuku.top/*
// @match        *://**/* 
// @match        http://*/*
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556267/EPS%20XHR%20Interceptor%20CSV%20Export%20%28Single%20Toggle%20Function%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556267/EPS%20XHR%20Interceptor%20CSV%20Export%20%28Single%20Toggle%20Function%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // console.log("epsnet",window.location.href,window.location.href.includes("epsnet"))
  if (!window.location.href.includes("epsnet")) return;
  const getValue = window.GM_getValue && typeof GM_getValue !== "undefined" ? GM_getValue : (key, value) => (localStorage.getItem(key) === null ? value : JSON.parse(localStorage.getItem(key)));
  const setValue = window.GM_setValue && typeof GM_setValue !== "undefined" ? GM_setValue : (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const sleep = (ms, val = true) => new Promise(r => setTimeout(() => r(val), ms));
  /**
 * Create (or return if exists) a floating control panel with optional font-size controls,
 * draggable handle, and a close button. Position and font-size are persisted by `id`.
 *
 * @param {Object} [options={}] - Panel options
 * @param {string} [options.id='_zlb_root_div_'] - Unique DOM id for the panel container
 * @param {boolean} [options.fontsize=true] - Whether to render font-size controls
 * @param {boolean} [options.drag=true] - Whether to render a draggable handle
 * @param {boolean|function} [options.close=true] - true to show a default close button; a function to run before removal
 * @param {keyof HTMLElementTagNameMap} [options.tagName='button'] - Tag name for interactive controls
 * @returns {HTMLDivElement} The panel DOM element
 */
  function getPanel({
    id = '_zlb_root_div_',
    fontsize = true,
    drag = true,
    close = true,
    tagName = 'button'
  } = {}) {
    const closeButtonId = id + '_close_';
    let panelElement = document.getElementById(id);

    /**
     * Create the close button for a given host element.
     * @param {HTMLElement} host
     */
    const createCloseButton = (host) =>
      appendTo(
        { parent: host, id: closeButtonId },
        tagName,
        'X关闭X',
        () => {
          if (typeof close === 'function') close();
          host.remove();
        }
      );

    // If panel already exists, optionally add/refresh close button and return it.
    if (panelElement) {
      if (close) createCloseButton(panelElement);
      return /** @type {HTMLDivElement} */ (panelElement);
    }

    // Build panel container
    panelElement = document.createElement('div');
    panelElement.id = id;
    panelElement.classList.add('notranslate');
    panelElement.setAttribute('translate', 'no');
    panelElement.onmousedown = panelElement.oncontextmenu = (event) => event.stopPropagation();
    document.body.appendChild(panelElement);

    // Persistent state
    let currentFontSize = Number(getValue(id + ':fs', 12));
    let leftPercent = Math.min(Math.max(Number(getValue(id + ':L', 50)), 0), 95);
    let topPercent = Math.min(Math.max(Number(getValue(id + ':T', 50)), 0), 95);

    // Style element
    const styleElement = document.createElement('style');
    panelElement.appendChild(styleElement);

    /**
     * Update the panel CSS rule (initial position, size, look).
     */
    const updatePanelStyles = () => {
      styleElement.textContent =
        `#${id}{
                    position:fixed;
                    z-index:999999;
                    background-color:rgba(187, 180, 180, 0.9);
                    border:1px solid rgba(191, 70, 173, 0.9);
                    max-width:50vw;
                    left:${leftPercent}%;
                    top:${topPercent}%;
                    user-select:none;
                    font-size:${currentFontSize}px;
                    display:flex;
                    flex-wrap:wrap;
                    }
                    #${id} button{
                    border-radius:${currentFontSize}px;
                    min-width:auto;
                    display: inline-flex;
                    padding:0 4px;
                    } 
                    #${id} span{
                    margin:0 2px
                    }
                    #${id} label{
                    margin:0px 2px;
                    display: inline-flex;
                    border:1px solid rgba(117,70,227,.7);
                    border-radius:${currentFontSize}px; 
                    }`;
    };

    updatePanelStyles();

    // Font-size controls
    if (fontsize) {
      appendTo(panelElement, tagName, '-字号-', () => {
        currentFontSize = Math.max(6, currentFontSize * 0.9);
        setValue(id + ':fs', currentFontSize);
        updatePanelStyles();
      });
      appendTo(panelElement, tagName, '+字号+', () => {
        currentFontSize = currentFontSize * 1.1;
        setValue(id + ':fs', currentFontSize);
        updatePanelStyles();
      });
    }

    // Drag handle
    if (drag) {
      const dragHandleButton = appendTo(panelElement, tagName, '✥拖动✥');
      dragHandleButton.addEventListener('mousedown', (event) => {
        const rect = panelElement.getBoundingClientRect();
        const deltaX = event.clientX - rect.left;
        const deltaY = event.clientY - rect.top;

        const moveHandler = (moveEvent) => {
          panelElement.style.left = (moveEvent.clientX - deltaX) + 'px';
          panelElement.style.top = (moveEvent.clientY - deltaY) + 'px';
        };

        const upHandler = () => {
          document.removeEventListener('mousemove', moveHandler);
          document.removeEventListener('mouseup', upHandler);

          const leftInPercent =
            (parseFloat(panelElement.style.left) / document.documentElement.clientWidth) * 100;
          const topInPercent =
            (parseFloat(panelElement.style.top) / document.documentElement.clientHeight) * 100;

          leftPercent = Math.min(Math.max(leftInPercent, 0), 95);
          topPercent = Math.min(Math.max(topInPercent, 0), 95);

          // Persist and reflect
          panelElement.style.left = leftPercent + '%';
          panelElement.style.top = topPercent + '%';
          setValue(id + ':L', leftPercent);
          setValue(id + ':T', topPercent);
          updatePanelStyles();
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
      });
    }

    // Close button
    if (close) createCloseButton(panelElement);

    // Optional auto-clean if panel has no interactive children (only <style>)
    setTimeout(() => {
      if (panelElement.children.length <= 1 + !!fontsize * 2 + !!drag + !!close) panelElement.remove();
    }, 100);

    return /** @type {HTMLDivElement} */ (panelElement);
  }
  /**
* 创建或复用一个 HTML 元素，并插入到指定位置。
*
* 支持三种插入方式（按优先顺序）：
* 1. `parent`：插入到该元素内部末尾；
* 2. `afterend`：插入到该元素之后；
* 3. `beforebegin`：插入到该元素之前。
*
* 可设置样式、类名、属性与事件。若指定 id 且元素已存在，则复用原元素。
*
* @param {Object|HTMLElement|null} [parentOrOption=null] - 父元素或配置对象。
* @param {HTMLElement} [parentOrOption.parent] - 插入到该元素内部。
* @param {HTMLElement} [parentOrOption.afterend] - 插入到该元素之后。
* @param {HTMLElement} [parentOrOption.beforebegin] - 插入到该元素之前。
* @param {keyof HTMLElementTagNameMap} [parentOrOption.tagName="a"] - 元素标签名。
* @param {string} [parentOrOption.textContent=""] - 元素文本内容。
* @param {Object<string,Function>} [parentOrOption.functions={}] - 事件集合。
* @param {string|Partial<CSSStyleDeclaration>} [parentOrOption.style] - 内联样式。
* @param {string|string[]|DOMTokenList} [parentOrOption.className|classList] - 类名。
* @param {string} [parentOrOption.id] - 元素 ID（复用已有元素）。
* @param {Object} [parentOrOption.other] - 其他任意属性。
* @param {string} [tagName] - （简写模式）标签名。
* @param {string} [textContent] - （简写模式）文本内容。
* @param {Function} [click] - （简写模式）点击事件。
* @param {string} [id] - （简写模式）元素 ID。
* @returns {HTMLElement} 创建或复用的元素。
*/
  function appendTo(parentOrOption = null, tagName = null, textContent = null, click = null, id = null) {
    const isObj = parentOrOption && typeof parentOrOption === "object" && !(parentOrOption instanceof HTMLElement);
    const base = {
      ...(isObj ? parentOrOption : { parent: parentOrOption }),
      ...(tagName && { tagName }),
      ...(textContent && { textContent }),
      ...(click && { click }),
      ...(id && { id }),
    };

    const {
      parent = null,
      afterend = null,
      beforebegin = null,
      tagName: tag = "a",
      textContent: txt = "",
      id: i = "",
      functions = {},
      click: c,
      ...other
    } = base;

    let el = i && document.getElementById(i);
    if (!el) el = document.createElement(tag);

    // ✅ 插入逻辑
    if (parent instanceof HTMLElement && parent !== el.parentElement) parent.appendChild(el);
    else if (afterend instanceof HTMLElement) afterend.insertAdjacentElement("afterend", el);
    else if (beforebegin instanceof HTMLElement) beforebegin.insertAdjacentElement("beforebegin", el);

    if (i) el.id = i;
    if (txt) el.textContent = txt;

    const fns = { ...functions };
    for (const [k, v] of Object.entries(other)) {
      if (!v) continue;
      if (k === "style") typeof v === "string" ? (el.style.cssText = v) : Object.assign(el.style, v);
      else if (k === "className" || k === "classList") {
        const classes = Array.isArray(v) ? v : typeof v === "string" ? v.split(/\s+/) : [...v];
        el.classList.add(...classes.filter(Boolean));
      } else if (typeof v === "function") fns[k] = v;
      else (k in el ? (el[k] = v) : el.setAttribute(k, v));
    }

    if (c) fns.click = c;
    for (const [ev, fn] of Object.entries(fns)) el.addEventListener(ev, e => fn(e, el));

    return el;
  }
  function waitUtil(fn, timeout = 10000, interval = 50, done, ctrl = { cancelled: false }) {
    const start = Date.now();
    const timer = setInterval(() => {
      if (ctrl.cancelled) return clearInterval(timer), done?.(false);
      try {
        const result = fn();
        if (result || Date.now() - start > timeout) {
          clearInterval(timer);
          done?.(result || false);
        }
      } catch { clearInterval(timer), done?.(false); }
    }, interval);
    return ctrl;
  }
  function waitUtilAsync(fn, timeout = 10000, interval = 50, ctrl = { cancelled: false }) {
    return new Promise((resolve) => {
      const start = performance.now();
      (async function loop() {
        if (ctrl.cancelled) return resolve(false);
        const result = await fn();
        if (result) return resolve(result);
        if (performance.now() - start > timeout) return resolve(false);
        setTimeout(loop, interval); // ✅ 控制执行节奏，不阻塞主线程
      })();
    });
  }


  /**
   * 创建一个节流函数，该函数在指定时间间隔内最多执行一次。
   * 支持配置是否在节流周期的开始和结束时执行函数。
   *
   * @param {Function} fn - 需要节流的函数。
   * @param {number} [delay=300] - 节流的时间间隔（毫秒）。
   * @param {Object} [options={}] - 配置选项。
   * @param {boolean} [options.leading=true] - 是否在节流周期的开始时立即执行一次。默认为 true。
   * @param {boolean} [options.trailing=true] - 是否在节流周期的结束时再执行一次。默认为 true。
   * @returns {Function} - 一个新的节流函数。
   */
  function throttle(fn, delay = 300, options = { leading: true, trailing: true }) {
    const { leading = true, trailing = true } = options;

    let last = 0; // 上次执行的时间戳
    let timer = null; // 用于 trailing edge 的定时器

    return function (...args) {
      const now = Date.now();

      // 如果是第一次调用，并且 leading 为 false，则不立即执行
      if (!last && leading === false) {
        last = now;
      }

      const elapsed = now - last;

      // 如果距离上次执行的时间已经超过了 delay
      if (elapsed > delay) {
        // 如果存在 trailing edge 的定时器，清除它
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        // 执行函数
        fn.apply(this, args);
        // 更新 last 时间戳
        last = now;
      }
      // 如果还没到时间，并且需要 trailing edge，且当前没有定时器
      else if (!timer && trailing !== false) {
        // 设置一个定时器，在 delay - elapsed 后执行一次
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, args);
          // 只有在 leading 为 true 时，才更新 last。否则，last 保持为 0，以便下次 leading 调用可以执行。
          if (leading !== false) {
            last = Date.now();
          }
        }, delay - elapsed);
      }
    };
  }
  /**
   * 创建一个防抖函数。
   *
   * @param {Function} fn - 需要防抖的函数。
   * @param {number} [delay=300] - 延迟时间（毫秒）。
   * @param {Object} [options={}] - 配置选项。
   * @param {boolean} [options.leading=false] - 是否在延迟开始前立即执行一次。默认为 false。
   * @returns {Function & { cancel: Function }} - 一个新的防抖函数，该函数具有一个 `cancel` 方法。
   */
  function debounce(fn, delay = 300, options = { leading: false }) {
    const { leading = false } = options;

    let timer = null; // 存储定时器ID
    let isLeadingExecuted = false; // 标记 leading call 是否已执行

    // 定义防抖函数
    const debounced = function (...args) {
      const context = this;

      // 如果存在定时器，清除它
      if (timer) {
        clearTimeout(timer);
        isLeadingExecuted = false; // 重置 leading 标记
      }

      // 如果需要 leading call，并且它尚未执行
      if (leading && !isLeadingExecuted) {
        fn.apply(context, args);
        isLeadingExecuted = true; // 标记为已执行
      }

      // 设置新的定时器
      timer = setTimeout(() => {
        // 在延迟结束后执行函数
        fn.apply(context, args);
        // 重置状态
        timer = null;
        isLeadingExecuted = false;
      }, delay);
    };

    // 为防抖函数添加 cancel 方法
    debounced.cancel = function () {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        isLeadingExecuted = false;
      }
    };

    return debounced;
  }
  /**
 * 更新 HTML 元素的文本、背景色，并将状态等信息存储到元素对象上。
 * 支持传入配置对象 `options` 来定制文本、状态、背景色等。
 * 
 * @param {HTMLElement} el - 目标 HTML 元素（如 button, div, span）。
 * @param {number|string} state - 当前状态，可以是数字、字符串或空字符串，表示索引或具体文本。
 * @param {Object} [options={}] - 可选配置项
 * @param {string} [options.text="计数器"] - 状态文本前缀。
 * @param {string[]} [options.status=["已停止", "运行中"]] - 状态数组。
 * @param {string[]} [options.bgcolors=[]] - 背景色数组（不足时会使用默认颜色）。
 * 
 * @returns {number} 返回 1，表示成功。
 */
  function textToggle(el, state = "", options = {}) {
    const defaultBgColors = [
      "", "#a8d08d", "#ffb6c1", "#f0e68c", "#add8e6", "#ff6347", "#98fb98", "#7b7070", "#ffd700", "#ff1493", "#90ee90", "#ff4500", "#8a2be2", "#32cd32", "#ff8c00", "#d2691e", "#ff0000", "#b0e0e6", "#dcdcdc", "#c7c7c7"
    ];

    // 1️⃣ 默认值配置
    const { text = "", status = [], bgcolors = [] } = options;

    // 2️⃣ 初始化状态
    if (!Array.isArray(el.status)) el.status = [];
    if (Array.isArray(status) && status.length > 0) {
      for (const s of status) if (!el.status.includes(s)) el.status.push(s);
    }

    if (text) el.pre_text = text;
    else if (el.pre_text === undefined) el.pre_text = ""

    // 3️⃣ 处理 `state` 值，支持数字、字符串及空字符串
    const stateValue = (typeof state === "number" || state === "")
      ? (el.status[state] ?? status[state] ?? String(state))
      : state;

    // 如果状态不在 el.status 中，添加它
    if (!el.status.includes(stateValue)) el.status.push(stateValue);

    // 4️⃣ 获取文本和背景色的索引
    const index = el.status.findIndex(v => v === stateValue);
    const colors = bgcolors.length ? bgcolors : defaultBgColors;

    // 设置文本内容和背景颜色
    el.textContent = `${el.pre_text}${stateValue}`;
    el.style.backgroundColor = colors[index] || defaultBgColors[index] || "";

    // 5️⃣ 保存状态信息
    el.currentState = stateValue;
    el.currentIndex = index;
    el.lastUpdate = new Date();

    return 1;
  } textToggle

  // Your code here...  
  function getXHR() {
    let active = false;
    const original = {};
    function downloadCSV(data, filename = 'data.csv', withBOM = true) {
      const csv = data.map(row => row.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([withBOM ? `\ufeff${csv}` : csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }
    function try_download(response, minInterval = 3000) {
      if (!response || !response.dataletBO) return;
      const { cellBOs, metaRows, metaColumns, selectDimensions, sheetInfo, cube } = response.dataletBO;
      if (Array.isArray(cellBOs) && metaRows && metaColumns && selectDimensions && sheetInfo) {
        const checkIndicator = metaRows[0] === 'indicator' && metaColumns[0] === 'region' && metaColumns[1] === 'time'
        const data = cellBOs.map(row => row.map(cell => (cell?.showValue || '').trim()));
        for (let i = 0; i < metaColumns.length; i++) {
          if (!data[0][i] && metaColumns[i])
            data[0][i] = metaColumns[i]
        }

        const { region, time, indicator } = selectDimensions
        const getName = (a) => {
          const f = a[0].dimName.trim(), l = a[a.length - 1].dimName.trim();
          const hasNumberEdge = /^\d|\d$/.test(f);
          const name = a.length > 1
            ? (hasNumberEdge ? `${f}_${a.length}_${l}` : `${f}${a.length}${l}`)
            : f;
          return name.replace(/\s+/g, '');
        };
        let name = ""
        let s = 1, c = 1, r = 1

        for (let i = 0; i < metaColumns.length; i++) {
          name += "=" + getName(selectDimensions[metaColumns[i]])
          s *= selectDimensions[metaColumns[i]].length
          c *= selectDimensions[metaColumns[i]].length
        }
        for (let i = 0; i < metaRows.length; i++) {
          name += "=" + getName(selectDimensions[metaRows[i]])
          s *= selectDimensions[metaRows[i]].length
          r *= selectDimensions[metaRows[i]].length
        }
        const skipRows = metaColumns.length
        const skipCols = metaRows.length
        const nonEmptyLength = data
          .slice(skipRows)                               // 去掉前 n 行
          .flatMap(row => row.slice(skipCols))           // 去掉前 m 列并展开
          .filter(v => {                                 // 过滤条件
            if (v == null || v === '') return false;     // 排除空/null/undefined
            const num = Number(v);
            return !isNaN(num) && num !== 0;             // 仅保留数值且非 0
          }).length;
        const cubeName = (cube?.cubeFnameZh || document.querySelector(".cube-name")?.textContent || "eps").replace(/\s+/g, "")
        const baseName = `${cubeName}=${nonEmptyLength}_${s}${name}`;
        const formatDate = (d = new Date()) =>
          d.getFullYear().toString() +
          String(d.getMonth() + 1).padStart(2, "0") +
          String(d.getDate()).padStart(2, "0") +
          String(d.getHours()).padStart(2, "0") +
          String(d.getMinutes()).padStart(2, "0") +
          String(d.getSeconds()).padStart(2, "0");
        const now = Date.now();
        try_download._last = try_download._last || { name: "", time: 0 };
        let { name: lastName, time: lastTime } = try_download._last;
        if (baseName === lastName && now - lastTime < minInterval) {
          console.warn(`⏩ 跳过${(now - lastTime) / 1000}s重复下载：${baseName}`);
          return;
        }
        try_download._last = { name: baseName, time: now };
        const filename = `${baseName}=${formatDate()}.csv`;
        downloadCSV(data, filename);
        console.log(`✅ 已导出 CSV: ${filename}`);
      }
    }

    function start() {
      console.log('🚀 XHR 拦截已启动');
      if (active) return;
      active = true;
      original.send = XMLHttpRequest.prototype.send;
      if (XMLHttpRequest.prototype._eps_hooked) {
        console.log('⚠️ 已存在拦截器，不重复绑定');
        return;
      }
      XMLHttpRequest.prototype._eps_hooked = true;
      XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener('load', function () {
          if (!active) return;
          try {
            const ct = this.getResponseHeader('content-type') || '';
            let response = this.responseText;
            if (ct.includes('application/json')) {
              try { response = JSON.parse(response); } catch (e) { console.log(e) }
            }
            try_download(response);
          } catch (err) {
            console.warn('XHR 拦截异常:', err);
          }
        });
        return original.send.call(this, body);
      };
    }
    function stop() {
      if (!active) return;
      active = false;
      if (original.send) {
        XMLHttpRequest.prototype.send = original.send;
        XMLHttpRequest.prototype._eps_hooked = false
      }
      console.log('🛑 已停止 XHR 拦截');
    }
    function get() { return { active } }
    return { get, start, stop };
  }
  const panel = getPanel({
    close: () => {
      xhr.stop()
    }
  })
  const xhr_running_key = "xhr_running"
  const eps_watcher_key = "eps:watcher"
  const bgrunning = "#aFa"
  const bgnormal = ""

  const xhr = getXHR()
  if (getValue(xhr_running_key, 1)) xhr.start()

  const onBtnXhrUpdate = (btn) => {
    // btn.textContent = xhr.get().active ? "【拦截已启动】" : "【拦截已暂停】"
    // btn.style.background = xhr.get().active ? "rgba(150, 210, 171, 1)" : ""
    textToggle(btn, xhr.get().active ? "【拦截已启动】" : "【拦截已暂停】", { text: "", status: ["启动拦截", "【拦截已启动】"] })
  }

  const btnXhr = appendTo(
    panel,
    "button",
    "",
    (e) => {
      if (xhr.get().active) xhr.stop()
      else xhr.start()
      setValue(xhr_running_key, xhr.get().active)
      onBtnXhrUpdate(e.target)
    },
  )
  onBtnXhrUpdate(btnXhr)


  const btnSelectAll = appendTo(
    panel, "button", "全选",
    async (e) => {
      const btn = e.target
      if (btn.selectAllRunning) {
        btn.selectAllRunning = false;
        btn.textContent = '全选已停止';
        btn.style.background = '#e67e22';
        return console.log('[EPSNet] 已请求停止全选。');
      }
      btn.selectAllRunning = true;
      btn.textContent = '停止全选';
      btn.style.background = '#c0392b';
      const visibleList = Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !==
        null);
      if (!visibleList) {
        btn.selectAllRunning = false;
        btn.textContent = '全选 (0)';
        btn.style.background = '#16a085';
        return console.warn('[EPSNet] 未找到可见的 .drop-list');
      }
      const area = visibleList.querySelector(".selected-area");
      if (area) area.style.display = "none";
      const allCheckboxes = [...visibleList.querySelectorAll('.ant-tree-checkbox')];
      if (allCheckboxes.length === 0) {
        btn.selectAllRunning = false;
        btn.textContent = '全选 (0)';
        btn.style.background = '#16a085';
        return console.log('[EPSNet] 当前没有可选节点。');
      }
      let clickCount = 0;
      for (const box of allCheckboxes) {
        if (!btn.selectAllRunning) break;
        if (!box.classList.contains('ant-tree-checkbox-checked')) {
          try {
            box.click();
            clickCount++;
            if (clickCount % 1 === 0) {
              let selectedCount = allCheckboxes.filter(f =>
                f.classList.contains('ant-tree-checkbox-checked')).length;
              btn.textContent = `取消全选 (${clickCount}/${selectedCount}/${allCheckboxes.length})`;
            }
            await sleep(1);
          } catch (err) {
            console.warn('[EPSNet] 点击选中出错:', err);
          }
        }
      }
      if (area) area.style.display = "";
      const selectedCount = allCheckboxes.filter(f => f.classList.contains('ant-tree-checkbox-checked'))
        .length;
      btn.selectAllRunning = false;
      btn.textContent = `全选 (${clickCount}/${selectedCount}/${allCheckboxes.length})`;
      btn.style.background = '#27ae60';
      console.log(`[EPSNet] 已全选 ${clickCount} 个节点。`);
    }
  )
  const btnExpandIndicator = appendTo(
    panel, "button", "展开",
    async (e) => {
      const btn = e.target;

      if (btn.expandIndicatorsRunning) { console.warn('[EPSNet] 上一个展开任务尚未结束。'); return 0 }
      btn.expandIndicatorsRunning = true;
      btn.textContent = '停止展开';
      btn.style.background = '#ec6f61ff';
      const visibleList = Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !==
        null);
      if (!visibleList) {
        btn.expandIndicatorsRunning = false;
        btn.textContent = '展开指标';
        btn.style.background = '#27ae60';
        console.log('[EPSNet] 未找到可见的 .drop-list，终止。')
        return 0;
      }
      console.log('[EPSNet] 开始展开可见 .drop-list');
      let loopCount = 0,
        stableRounds = 0;
      while (btn.expandIndicatorsRunning) {
        const elements = [...visibleList.querySelectorAll(
          ".ant-tree-switcher_close, .ant-tree-switcher_open")];
        const need_click = [];
        let root_open = false;
        for (let i = 0; i < elements.length; i++) {
          if (!btn.expandIndicatorsRunning) break;
          const f = elements[i];
          const is_root = f.previousSibling?.previousSibling?.childNodes?.length === 2;
          if (is_root) {
            root_open = f.classList.contains("ant-tree-switcher_open");
            continue;
          }
          const is_open = f.classList.contains("ant-tree-switcher_open");
          if (root_open !== is_open) need_click.push(f);
        }
        if (need_click.length === 0) {
          stableRounds++;
          btn.textContent = (`展开 无需点击，第 ${stableRounds} 次稳定状态。`);
          if (stableRounds >= 2) {
            btn.textContent = ('展开 所有节点已展开（连续两轮无变化），任务结束。');
            break;
          }
          await sleep(600);
          continue;
        }
        stableRounds = 0;
        const uniqueNodes = Array.from(new Set(need_click));
        btn.textContent = (`展开 第 ${++loopCount} 轮：点击 ${uniqueNodes.length} 个节点。`);
        for (const node of uniqueNodes) {
          if (!btn.expandIndicatorsRunning) break;
          setTimeout(() => { node.click(); }, 100);
          await sleep(2);
        }
        await sleep(500);
      }
      btn.expandIndicatorsRunning = false;
      btn.textContent = '展开指标';
      btn.style.background = '#27ae60';
      console.log('[EPSNet] 展开任务结束。');
      return 1
    }
  )
  async function onShowChecked() {
    const btn = btnShowChecked;
    btn.running = !btn.running
    if (!btn.running) { console.log("未运行直接跳出"); return 0; }
    textToggle(btnShowChecked, "正在展开已选树")
    const visibleDropList = Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null);
    if (!visibleDropList) {
      warn('[EPSNet] 未找到可见的 .drop-list'); btn.running = 0; textToggle(btnShowChecked, "展开已选树")
      return 0;
    }
    await waitUtilAsync(() => [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")].length > 2, 10000)
    let ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
    while (btn.running) {
      //展开所有含子节点checked的
      ls = [...Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null).querySelectorAll(".select-area .ant-tree-treenode")]
      const a = ls.filter(a => a.querySelector(".border") && a.querySelector(".ant-tree-switcher_close"))[0]
      // console.log(1, ls.filter(a => a.querySelector(".border") && a.querySelector(".ant-tree-switcher_close")))
      if (a && a.querySelector(".border")) {
        console.log(2)
        textToggle(btnShowChecked, "找到需要展开的已选树")
        const lslength1 = ls.length
        a.querySelector(".border").click()
        await waitUtilAsync(() => lslength1 != [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")].length, 60000)
        continue
      }
      // ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
      // let found = 0
      // for (let i = 0; i < ls.length; i++) {
      //     const a = ls[i]
      //     if (a.querySelector(".selected") && a.querySelector(".ant-tree-node-content-wrapper-close")) {
      //         toggleText(btnShowChecked, "找到需要展开的已选树")
      //         found = 1
      //         const lslength1 = ls.length
      //         a.querySelector(".selected").click()
      //         sleep(100)
      //         await waitUtilAsync(() => lslength1 != [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")].length, 60000)
      //         break
      //     }
      // } 
      break
    }
    textToggle(btnShowChecked, "展开已选树")
    if (btn.running) {
      btn.running = 0
      return 1
    }
    return 0

  }
  const btnShowChecked = appendTo(panel, "button", "展开已选树", onShowChecked)
  textToggle(btnShowChecked, "展开已选树")
  async function onCloseUnchecked() {
    const btn = btnShiftSelection;
    btn.running = !btn.running
    if (!btn.running) { return 0; }
    textToggle(btnCloseUnchecked, "隐藏未选树运行中")
    const visibleDropList = Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null);
    if (!visibleDropList) { console.warn('[EPSNet] 未找到可见的 .drop-list'); btn.running = 0; return 0; }
    await waitUtilAsync(() => [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")].length > 2, 10000)
    let ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
    while (btn.running) {
      //关闭没有选项的树
      ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
      let p_root = undefined
      let checked = 0
      let found = 0
      for (let i = 0; i < ls.length; i++) {
        const a = ls[i]
        const is_root = a.querySelector(".ant-tree-indent").childNodes.length == 2

        if (is_root) {
          if (p_root && p_root != a && !checked && p_root.classList.contains("ant-tree-treenode-switcher-open")) {
            if (p_root.querySelector(".ant-tree-switcher_open")) {
              console.log("找到关闭没有选项的树", checked, p_root)
              textToggle(btnCloseUnchecked, "找到关闭没有选项的树")
              found = 1
              const lslength1 = ls.length
              p_root.querySelector(".ant-tree-switcher_open").click()
              await waitUtilAsync(() => !btn.running || lslength1 != [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")].length, 60000)
              break
            }
          }
          p_root = ls[i]
          checked = 0
          console.log("8.2进入下一个root")
        }
        if (a.querySelector(".ant-tree-checkbox-checked")) {
          checked += 1
        }
      }
      if (!found) {
        break
      }
    }
    textToggle(btnCloseUnchecked, "隐藏未选树")
    if (btn.running) {
      btn.running = 0

      return 1
    }
    return 0
  }
  const btnCloseUnchecked = appendTo(panel, "button", "隐藏未选树", onCloseUnchecked)
  textToggle(btnCloseUnchecked, "隐藏未选树")
  async function onShiftSelection() {
    const btn = btnShiftSelection;
    const start = performance.now();
    const log = (...args) => console.log(`[${((performance.now() - start) / 1000).toFixed(3)}s]`, ...args);
    const warn = (...args) => console.warn(`[${((performance.now() - start) / 1000).toFixed(3)}s]`, ...args);

    btn.running = !btn.running
    textToggle(btn, "", { text: "对称选择" })
    // btn.textContent = btn.running ? "对称选择切换中" : "对称选择"
    // btn.background = "#27ae60"
    await sleep(1)
    if (!btn.running) { log("runing=false 退出"); btn.running = 0; return 0; }
    const visibleDropList = Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null);
    if (!visibleDropList) { warn('[EPSNet] 未找到可见的 .drop-list'); btn.running = 0; return 0; }
    await waitUtilAsync(() => [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")].length > 2, 10000)
    let ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
    log("1.开始", { "ls长度": ls.length })
    // btn.textContent = "对称选择1.开始"

    textToggle(btn, "对称选择1.开始")
    await onShowChecked()
    ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
    log("2.展开所有含子节点checked的节点", { "ls长度": ls.length })
    // btn.textContent = "对称选择1.2.展开所有含子节点"
    textToggle(btn, "对称选择1.2.展开所有含子节点")
    let checked_end = -1
    let checked_count = 0
    let checked_index = []
    for (let i = 0; i < ls.length; i++) {
      const a = ls[i]
      if (a.querySelector(".ant-tree-checkbox-checked")) {
        // a.classList.contains("ant-tree-treenode-checkbox-checked")
        checked_end = i
        checked_count += 1
        checked_index.splice(0, 0, i)
      }
    }
    log(`3.计算点击数量`, { "ls长度": ls.length, "旧选择数量": checked_count, "旧最后选中index": checked_end })
    // btn.textContent = "对称选择1.2.3.计算点击数量"
    textToggle(btn, "对称选择1.2.3.计算点击数量")
    while (btn.running) {
      //展开所有未来需要点选的
      if (checked_end == -1) break;
      let found = 0
      let checkbox_count = 0

      ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]

      for (let i = checked_end; i < ls.length; i++) {
        const a = ls[i]
        if (a.querySelector(".ant-tree-switcher_close")) {
          found = 1
          log("3.1找到close标签", a)
          const lslength1 = ls.length
          a.querySelector(".ant-tree-title span").click()
          log("3.2点击close", a)
          await waitUtilAsync(async () => !btn.running || lslength1 != [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")].length
            , 10000, 300)
          break;
        }
        if (a.querySelector(".ant-tree-checkbox")) {
          checkbox_count += 1
        }
        if (checkbox_count == checked_count + 1) {
          break
        }
      }
      if (!found) break
    }
    ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
    log(`4.展开预计节点后`, { "ls长度": ls.length, "旧选择数量": checked_count, "旧最后选中index": checked_end })
    // btn.textContent = "对称选择1.2.3.4.展开预计节点"
    textToggle(btn, "对称选择1.2.3.4.展开预计节点")
    if (checked_end + 1 == ls.length) {
      log("4.1展开后发现当前已经是最后一个节点。")
      textToggle(btn)
      return 0
    }

    //清空
    visibleDropList.querySelector(".selected-area .clear").click()
    log(`5.清空旧选择`, { "ls长度": ls.length, "旧选择数量": checked_count, "旧最后选中index": checked_end })
    // btn.textContent = "对称选择1.2.3.4.5.清空旧选择"
    textToggle(btn, "对称选择1.2.3.4.5.清空旧选择")
    while (btn.running) {
      ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
      if (ls[checked_end].querySelector(".ant-tree-checkbox-checked")) {
        await sleep(10)
        continue
      }
      break
    }
    //重选
    ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
    log(`6.清空旧选择处理完成`, { "ls长度": ls.length, "旧选择数量": checked_count, "旧最后选中index": checked_end })
    // btn.textContent = "对称选择1.2.3.4.5.6.清空旧选择处理完成"
    textToggle(btn, "对称选择1.2.3.4.5.6.清空旧选择处理完成")
    let clickCount = 0;
    let checked_end_new = -1
    let checked_index_new = []
    for (let i = checked_end + 1; i < ls.length; i++) {
      const a = ls[i]
      const box = a.querySelector('.ant-tree-checkbox')
      if (box) {
        setTimeout(() => { box.click(); }, 100)
        clickCount += 1
        checked_end_new = i
        checked_index_new.splice(0, 0, i)
        await sleep(20)
      }
      if (clickCount == checked_count) {
        await sleep(100)
        break
      }
    }
    log(`7.重选`, { "ls长度": ls.length, "旧选择数量": checked_count, "旧最后选中index": checked_end, "新点击次数": clickCount, "新最后选中index": checked_end_new, "新的选中index": checked_index_new })

    // btn.textContent = "对称选择1.2.3.4.5.6.7.重选"
    textToggle(btn, "对称选择1.2.3.4.5.6.7.重选")
    while (btn.running) {
      //等待点击的checkbox反应
      ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]
      if (ls.length < checked_end_new) {
        log("7.1checked_end_new 超过了范围", checked_end_new, ls.length)
        await sleep(1000)
        continue
      }
      if (!ls[checked_end_new].querySelector(".ant-tree-checkbox-checked")) {
        log("7.2等待点击的checkbox反应")
        await sleep(100)
        continue
      }
      break
    }
    log(`8.等待点击的checkbox反应`, { "ls长度": ls.length, "旧选择数量": checked_count, "旧最后选中index": checked_end, "新点击次数": clickCount, "新最后选中index": checked_end_new })
    textToggle(btn, "对称选择1.2.3.4.5.6.7.8.等待点击的checkbox反应")

    // btn.textContent = "对称选择1.2.3.4.5.6.7.8.等待点击的checkbox反应"
    await onCloseUnchecked()
    ls = [...visibleDropList.querySelectorAll(".select-area .ant-tree-treenode")]

    log(`9.关闭没有选项的树`, { "ls长度": ls.length, "旧选择数量": checked_count, "旧最后选中index": checked_end, "新点击次数": clickCount, "新最后选中index": checked_end_new })
    // btn.textContent = "对称选择1.2.3.4.5.6.7.8.9.关闭没有选项的树"
    textToggle(btn, "对称选择1.2.3.4.5.6.7.8.9.关闭没有选项的树")
    log(`10.[EPSNet] 已取消 ${checked_count} 项，并从第 ${checked_end + 1}  选中 ${clickCount} 项。`);
    // btn.textContent = `对称选择(${clickCount})`;
    // btn.style.background = '';
    textToggle(btn, "")
    btn.running = 0
    return 1
  }
  const btnShiftSelection = appendTo(panel, "button", "对称选择", onShiftSelection)
  async function onQuery() {
    const btn = btnQuery
    textToggle(btn, "查询中")
    // btn.textContent = '查询中...';
    // btn.style.background = '#e67e22';
    console.log('[EPSNet] 开始执行查询...');

    let queryBtn = null;
    for (let b of document.querySelectorAll('.ant-btn.ant-btn-primary')) {
      if (b.textContent.trim() === '查 询') {
        queryBtn = b;
        b.click();
        break;
      }
    }
    if (!queryBtn) {
      // btn.textContent = '查询';
      // btn.style.background = '#8e44ad';
      console.warn('[EPSNet] 未找到“查询”按钮。');
      textToggle(btn, "未找到查询按钮")
      return 0
    } else {
      document.querySelectorAll('.ant-btn.ant-btn-primary')[0].click();
      const appear = await waitUtilAsync(() => document.querySelector(
        '.ant-spin-nested-loading .ant-spin-show-text'), 10000);
      if (!appear) { console.warn('[EPSNet] 未检测到进度条。'); }
      else {
        const disappear = await waitUtilAsync(() => !document.querySelector(
          '.ant-spin-nested-loading .ant-spin-show-text'), 120000);
        if (!disappear) { console.warn('[EPSNet] 进度条未正确关闭。'); }
        else {
          console.log('[EPSNet] 查询完成 ✅');
        }
      }
      // btn.textContent = '查询';
      // btn.style.background = '#8e44ad';
      textToggle(btn, "查询")
      return 1
    }

  }
  const btnQuery = appendTo(panel, "button", "查询", onQuery)
  textToggle(btnQuery, "查询")
  const btnDownload = appendTo(
    panel, "button", "下载", async (e) => {
      for (let b of document.querySelectorAll('.ant-btn.ant-btn-primary')) {
        if (b.textContent.trim() === '下 载') { b.click(); return 1 }
      }
      console.warn('[EPSNet] 未找到“下 载”按钮。');
      btnDownloadUpdateUI()
      return 0

    })
  function btnDownloadUpdateUI() {
    const checked = [...document.querySelectorAll('.ant-radio-wrapper.ant-radio-wrapper-checked')];
    if (checked.length === 0) { return 0 }
    const texts = checked.map(e => e.textContent.trim()).join(',');
    const lastText = btnDownload.getAttribute('data-last') || '';
    if (texts !== lastText) {
      btnDownload.setAttribute('data-last', texts);
      btnDownload.textContent = texts ? `下载(${texts})` : '下载';
    }
    return 1
  }
  btnDownloadUpdateUI()
  const btnFullName = appendTo(
    panel, "button", "全称", async (e) => {
      const btn = e.target
      document.querySelector(".icon-xianshizhibiaoquancheng")?.click();
      textToggle(btn, "切换显示全称")
      await sleep(100)
      btnFullNameUpdateUI()
      setValue("xianshizhibiaoquancheng", !!document.querySelector(".icon-xianshizhibiaoquancheng")?.closest(".active"))
    })

  function btnFullNameUpdateUI() {
    const xianshizhibiaoquancheng = getValue("xianshizhibiaoquancheng") || false
    if (xianshizhibiaoquancheng != !!document.querySelector(".icon-xianshizhibiaoquancheng")?.closest(".active")) {
      document.querySelector(".icon-xianshizhibiaoquancheng")?.click()
    }
    textToggle(btnFullName, document.querySelector(".icon-xianshizhibiaoquancheng")?.closest(".active") ? "已显示全称" : "显示全称", { text: "", status: ["显示全称", "已显示全称"] })
    // const fullNameIcon = document.querySelector(".icon-xianshizhibiaoquancheng")
    // if (fullNameIcon) {
    //     const active = fullNameIcon.parentElement.classList.contains("active")
    //     btnFullName.textContent = active ? "已显示全称" : "未显示全称";
    //     btnFullName.style.background = active ? "rgba(113, 227, 113, 1)" : ""
    // } else
    //     btnFullName.textContent = "显示全称（未知）"
  }
  btnFullNameUpdateUI()

  const btnDimRefresh = appendTo(panel, "button", "刷新维度", () => dimRadioUpdateUI())
  const dimRadioContainer = appendTo({ parent: panel, tagName: "span", style: { display: "flex", flexDirection: "row" } })
  function dimRadioUpdateUI() {
    const dims = [...document.querySelectorAll('.dim-name')];
    const n = [...document.querySelectorAll('.dimensions .ant-dropdown-trigger')].map(a => a?.textContent || "1").map(a => a.match(/\d+/)[0] * 1).reduce((a, b) => a * b, 1) + ""
    const dimStr = dims.map(a => a.textContent).join("===") + "==" + n;
    if (btnDimRefresh.getAttribute("data-dims") == dimStr) {
      return 0;
    }
    btnDimRefresh.setAttribute("data-dims", dimStr);
    [...panel.querySelectorAll(".dimRadioValue")].forEach(f => f.remove())
    dimRadioContainer.innerHTML = n;
    if (dims.length === 0) { dimRadioContainer.innerHTML = '(未检测到维度)'; return 0 }
    const dimRadioValue = getValue("dimRadioValue") || 0

    dims.forEach((d, i) => {
      const label = appendTo({ beforebegin: btnSelectDim, className: "dimRadioValue" }, "label", d.textContent.trim() || `维度${i + 1}`, () => setValue("dimRadioValue", i));
      appendTo({ parent: label, tagName: "input", type: "radio", name: "dimChoice", value: `${d.textContent.trim()}`, ...(dimRadioValue == i && { checked: 1 }) });
      appendTo({ parent: label, tagName: "span", textContent: d.textContent.trim() || `维度${i + 1}`, })

    });
    console.log(`[EPSNet] 已生成 ${dims.length} 个维度选项。`);
    return 1
  }
  async function onSelectDim() {
    const dl = Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null)
    const x = dl ? dl.querySelector(".edit-text").textContent.replace("修改", "") : ""
    const selected = panel.querySelector('input[name="dimChoice"]:checked');
    if (!selected) return console.log('请先选择一个维度');
    const dim_name = selected.value;
    if (dim_name == x) { console.log("面板已经打开"); return 1; }
    const dims = [...document.querySelectorAll('.dim-name')];
    for (const d of document.querySelectorAll('.dim-name')) {
      if (dim_name == d.textContent) {
        console.log("打开面板")
        d.nextElementSibling.click()
        await waitUtilAsync(() => Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null)?.querySelector(".edit-text").textContent.replace("修改", "") == dim_name, 60000)
      }
    }
    return 1
  }
  const btnSelectDim = appendTo(panel, "button", "维度选择", onSelectDim)

  dimRadioUpdateUI()

  function toggleDropListVisible() {
    const visibleList = Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null);
    const hasVisible = !!visibleList;
    for (const btn of [btnShiftSelection, btnExpandIndicator, btnSelectAll]) {
      if (btn) btn.style.display = hasVisible ? 'block' : 'none';
    }
    return 1
  }

  let watcherRunning = getValue(eps_watcher_key, 0)
  let watcherInterval = null
  function toggleWatcherInterval() {
    if (watcherRunning) {
      btnDimRefresh.style.display = "none"
      if (watcherInterval) clearInterval(watcherInterval)
      watcherInterval = setInterval(() => {
        try {
          btnDownloadUpdateUI();
          toggleDropListVisible();
          dimRadioUpdateUI();
          btnFullNameUpdateUI();


        } catch (err) {
          console.warn('[EPSNet] Watcher 出错:', err);
        }
      }, 1000);
    }
    else {
      btnDimRefresh.style.display = ""
      clearInterval(watcherInterval)
      watcherInterval = null
    }
  }
  getPanel({
    close: () => {
      watcherRunning = false
      toggleWatcherInterval()
    }
  })
  toggleWatcherInterval()
  const onWatcherUpdate = (btn) => {

    textToggle(btn, watcherRunning ? "正在监听" : "等待监听", { text: "", status: ["等待监听", "正在监听"] })
    // btn.textContent = watcherRunning ? "正在监听" : "等待监听"
    // btn.style.background = watcherRunning ? "#addbadff" : ""
  }
  onWatcherUpdate(appendTo(
    panel, 'button', "操作监听", (e) => {
      watcherRunning = !watcherRunning
      toggleWatcherInterval()
      setValue(eps_watcher_key, watcherRunning)
      onWatcherUpdate(e.target)

    }
  ))

  const btnAutoQ = appendTo(panel, "button", "自动查询", async (e, btn) => {
    if (!btn.running) {
      btn.running = true
      textToggle(btn, "自动查询中...")
      const start = Date.now();
      const log = (msg) =>
        console.log(`[${new Date().toLocaleTimeString()}]${(((Date.now() - start) / 1000).toFixed(2))}s ${msg} `);


      log("🟢 自动查询开始");

      while (btn.running) {
        log("执行 onSelectDim()");
        textToggle(btn, "自动查询-选择维度")
        if (!(await onSelectDim())) {
          log("❌ onSelectDim 返回 false，退出循环");
          break;
        }
        if (!btn.running) {
          log("⚪ 检测到状态变更，退出循环");
          break;
        }
        log("等待 1 秒后执行 onShiftSelection()");
        await sleep(1000);
        await waitUtilAsync(() => Array.from(document.querySelectorAll('.drop-list')).find(el => el.offsetParent !== null), 10000)
        textToggle(btn, "自动查询-切换选择")
        log("执行 onShiftSelection()");
        if (!(await onShiftSelection())) {
          log("❌ onShiftSelection 返回 false，退出循环");
          break;
        }
        if (!btn.running) {
          log("⚪ 检测到状态变更，退出循环");
          break;
        }

        log("等待 1 秒后执行 onQuery()");
        await sleep(1000);
        textToggle(btn, "自动查询-查询")
        log("执行 onQuery()");
        if (!(await onQuery())) {
          log("❌ onQuery 返回 false，退出循环");
          break;
        }
        if (!btn.running) {
          log("⚪ 检测到状态变更，退出循环");
          break;
        }
        log("循环结束，等待 1 秒进入下一轮");
        await sleep(1000);
      }
      log(`🟡 自动查询结束`);
      btn.running = false
      textToggle(btn, "自动查询")
    } else {
      btn.running = false
      textToggle(btn, "自动查询")
    }
  })

  textToggle(btnAutoQ, "自动查询")

})();
