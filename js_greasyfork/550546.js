// ==UserScript==
// @name         Blackboard 增强 Pro | Blackboard Enhanced Pro
// @namespace    npm/vite-plugin-monkey
// @version      1.3.3
// @author       Miang
// @description  Blackboard 增强插件，For SCUPIANS
// @license      MIT
// @match        https://pibb.scu.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/550546/Blackboard%20%E5%A2%9E%E5%BC%BA%20Pro%20%7C%20Blackboard%20Enhanced%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/550546/Blackboard%20%E5%A2%9E%E5%BC%BA%20Pro%20%7C%20Blackboard%20Enhanced%20Pro.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(' .calendar-container{position:fixed;z-index:10000;width:280px;opacity:.8}.portlet#module\\:_bbep_calendar .course{padding:0!important}.calendar-list{width:100%;height:80%;overflow-y:scroll;pointer-events:auto;max-height:300px;scrollbar-width:none;-ms-overflow-style:none}.calendar-list ::-webkit-scrollbar{width:0;background:transparent}.calendar-list::-webkit-scrollbar{width:0;height:0}.calendar-list-flat{width:100%;background:#fff}.calendar-cards{width:100%}.calendar-card{background:#ffffff;border:none;border-left:4px solid #137333;border-radius:8px;margin:8px;padding:8px 10px;box-shadow:0 1px 2px #0000000a;display:flex;flex-direction:column;gap:4px}.calendar-card.accent-red{border-left-color:#d93025}.calendar-card.accent-green{border-left-color:#137333}.calendar-card .line{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;color:#374151}.calendar-card .line.assignment{font-size:15px;font-weight:600;color:#111827}.calendar-card .line.assignment a{color:inherit;text-decoration:none}.calendar-card .line.assignment a:hover{text-decoration:underline}.calendar-card .line.event-type{font-size:12px;color:#6b7280;text-transform:none;display:flex;align-items:center;justify-content:space-between}.calendar-card .line.event-type .status-badge{display:inline-block;margin-left:6px;padding:1px 6px;border-radius:9999px;font-size:11px;line-height:1.6}.calendar-card .line.event-type .status-badge.submitted{background:#e6f4ea;color:#137333}.calendar-card .line.event-type .status-badge.pending{background:#f3f4f6;color:#4b5563}.calendar-card .line.course a{color:#0366d6;text-decoration:none}.calendar-card .line.course a:hover{text-decoration:underline}.calendar-card .line.due{font-variant-numeric:tabular-nums}.calendar-card .meta{display:none}.calendar-card .meta .course a{color:#0366d6;text-decoration:none}.calendar-card .meta .course a:hover{text-decoration:underline}.countdown-pill{padding:2px 8px;border-radius:9999px;font-weight:700;font-size:12px}.countdown-pill.green{background:#e6f4ea;color:#137333}.countdown-pill.red{background:#fce8e6;color:#d93025}.calendar-card .attachments{margin-top:2px}.attachments-link,.attachments-toggle{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:9999px;border:1px solid #d1d5db;background:#f9fafb;color:#374151;cursor:pointer;font-weight:600}.attachments-link .icon{opacity:.8}.attachments-link:hover,.attachments-toggle:hover{background:#f3f4f6;border-color:#cbd5e1}.attachments-link:focus-visible{outline:2px solid #93c5fd;outline-offset:2px}.attachments-link.active{background:#eef2ff;border-color:#c7d2fe;color:#1d4ed8}.attachments-list{margin-top:6px;padding-left:2px;border-top:1px dashed #e5e7eb;padding-top:6px}.attachment-item a{color:#0366d6;text-decoration:none}.attachment-item a:hover{text-decoration:underline}.portlet#module\\:_bbep_calendar .bbep-toggle-btn{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:9999px;border:1px solid #d1d5db;background:#f9fafb;color:#374151;cursor:pointer;font-weight:600}.portlet#module\\:_bbep_calendar .bbep-toggle-btn:hover{background:#f3f4f6;border-color:#cbd5e1}.portlet#module\\:_bbep_calendar .bbep-toggle-btn.active{background:#eef2ff;border-color:#c7d2fe;color:#1d4ed8}.portlet#module\\:_bbep_calendar .bbep-switch{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#374151}.portlet#module\\:_bbep_calendar .bbep-switch input{position:absolute;opacity:0;width:0;height:0}.portlet#module\\:_bbep_calendar .bbep-slider{width:28px;height:16px;background:#e5e7eb;border:1px solid #d1d5db;border-radius:9999px;position:relative;transition:background-color .2s ease,border-color .2s ease}.portlet#module\\:_bbep_calendar .bbep-switch:focus-within .bbep-slider{box-shadow:0 0 0 2px #93c5fd}.portlet#module\\:_bbep_calendar .bbep-slider:after{content:"";position:absolute;top:50%;left:2px;transform:translateY(-50%);width:12px;height:12px;background:#ffffff;border-radius:9999px;box-shadow:0 1px 2px #00000026;transition:left .2s ease}.portlet#module\\:_bbep_calendar .bbep-switch input:checked+.bbep-slider{background:#60a5fa;border-color:#3b82f6}.portlet#module\\:_bbep_calendar .bbep-switch input:checked+.bbep-slider:after{left:14px}.calendar-header,.calendar-row{display:grid;grid-template-columns:2fr 1.2fr 1.4fr 1fr;align-items:center;gap:8px;padding:8px 12px}.calendar-header{position:sticky;top:0;z-index:1;background:#f7f7f9;font-weight:600;border-bottom:1px solid #e5e5ea}.calendar-row{border-bottom:1px solid #ececec}.calendar-row .col-assignment{font-weight:600;color:#1f2328}.calendar-row .col-course a{color:#0366d6;text-decoration:none}.calendar-row .col-course a:hover{text-decoration:underline}.calendar-row .col-due{color:#444;font-variant-numeric:tabular-nums}.calendar-row .col-countdown{font-weight:700}.calendar-row .col-countdown.green{color:#137333}.calendar-row .col-countdown.red{color:#d93025}.calendar-item{width:95%;height:auto;margin-top:8px;border-radius:18px;margin-left:5px;pointer-events:auto;display:flex;flex-direction:column;align-items:left;cursor:move;-webkit-user-select:none;user-select:none}.calendar-item .assignment{margin-top:10px;margin-left:12px;margin-right:12px;font-size:17px;font-weight:700;color:#f5f5f6}.calendar-item .course-name{display:inline;margin-top:5px;margin-left:12px;margin-right:8px;font-weight:700;font-size:10px;color:#e0e0ef;cursor:pointer}.calendar-item .count-down{margin-left:12px;margin-bottom:10px;font-weight:700;font-size:22px;color:#e0e0ce}.memo-container{width:100%;height:auto;background-color:#dff0f4}.memo-container .memo-box{width:100%;height:288px;display:flex;flex-direction:column;align-items:center}.memo-container .memo-box .memo-list{border:1px solid #ccc;margin-top:20px;width:calc(100% - 32px);height:100%;overflow-y:scroll;pointer-events:auto}.memo-container .memo-box .memo-list .memo-input{height:300%;width:calc(100% - 10px);background-color:#fff;padding:5px;outline:none}.memo-container .memo-box .btn-box{margin-top:10px;width:100%;height:47.6px;position:relative}.memo-container .memo-box .btn-box .btn-save{background-color:#dadada;border:0 solid;width:46px;height:27.6px;position:absolute;right:70px;display:flex;justify-content:center;align-items:center;cursor:pointer}.memo-container .memo-box .btn-box .btn-save:hover{background-color:#fff}.memo-container .memo-box .btn-box .btn-clear{background-color:#333;border:0 solid;width:46px;height:27.6px;position:absolute;right:16px;display:flex;justify-content:center;align-items:center;color:#fff;cursor:pointer}.bbep-preview-toolbar{width:100%;display:flex;justify-content:flex-end;gap:8px;margin:6px 0 8px}.bbep-preview-memo{width:100%;margin:6px 0 8px}.bbep-preview-memo .memo-container .memo-box{height:auto}.bbep-preview-memo .memo-container .memo-list{height:auto;max-height:none;overflow:visible}.bbep-preview-memo .memo-container .memo-input{height:auto!important;min-height:1.6em;line-height:1.4}.memo-title{font-size:12px;color:#6b7280;margin:0 2px 2px}.bbep-download-btn{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:9999px;border:1px solid #d1d5db;background:#f9fafb;color:#374151;text-decoration:none}.bbep-download-btn:hover{background:#f3f4f6;border-color:#cbd5e1}.bbep-deductions-bar{width:100%;background:#ffffff;padding:6px 6px 2px;border:1px solid #f3f4f6;box-sizing:border-box;overflow:hidden}.bbep-deductions-grid{display:grid;gap:6px;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));align-items:start;width:100%;box-sizing:border-box}.bbep-deductions-grid .grid-span-2{grid-column:span 2}.bbep-ded-meta-block{display:flex;flex-direction:column;gap:6px;padding:4px 3px;border:1px solid #f5f5f5;border-radius:6px;background:#fcfcfc;box-sizing:border-box}.bbep-header-meta{display:inline-flex;gap:8px;align-items:center;margin-left:8px}.bbep-header-meta .meta-item{display:inline-flex;gap:4px;align-items:center}.bbep-header-meta label{font-size:12px;color:#374151}.bbep-ded-cell{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 3px;border:1px solid #f5f5f5;border-radius:6px;background:#fcfcfc;box-sizing:border-box}.bbep-ded-label{font-size:10px;color:#6b7280}.bbep-ded-input{width:56px;padding:3px 6px;border:1px solid #e5e7eb;border-radius:6px;background:#ffffff;box-sizing:border-box}.bbep-ded-input:focus{outline:2px solid #93c5fd;outline-offset:1px}.bbep-ded-count,.bbep-ded-step{display:inline-flex;align-items:center;gap:6px}.bbep-ded-count label{font-size:12px;color:#374151}.bbep-ded-count-input,.bbep-ded-step-input{width:64px;padding:3px 6px;border:1px solid #d1d5db;border-radius:6px} ');

(function (React, require$$0) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = React, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  async function courseInfoCatch() {
    try {
      const orig_course_info = await get_course_id();
      const course_db = store_course_id(orig_course_info);
      console.log("fetchCourse.js Success");
      return course_db;
    } catch (err) {
      console.log("fetchCourse.js Error: ", err);
    }
  }
  async function get_course_id() {
    const url = "/learn/api/public/v1/calendars/";
    return await fetch(url, { method: "GET" }).then((res) => res.json()).catch(console.log);
  }
  function store_course_id(_orig_course_info) {
    const _course_db = {};
    if (!_orig_course_info)
      return _course_db;
    const list = Array.isArray(_orig_course_info) ? _orig_course_info : _orig_course_info.results || [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!item || !item.id || !item.name)
        continue;
      if (item.id === "INSTITUTION" || item.id === "PERSONAL")
        continue;
      if (_course_db[item.name])
        continue;
      const course_id = item.id;
      const course_name = item.name;
      const launcher = `https://pibb.scu.edu.cn/webapps/blackboard/execute/launcher?type=Course&id=${encodeURIComponent(course_id)}&url=`;
      _course_db[course_name] = {
        id: course_id,
        href: launcher
      };
    }
    return _course_db;
  }
  async function calendarInfoCatch() {
    try {
      var orig_todo_items = await get_calendar();
      var todo_items = await extractItems(orig_todo_items);
      todo_items = await setColor(todo_items);
      todo_items = await enrichRoleAndSubmission(todo_items);
      console.log("fetchCalendar.js Success");
      return todo_items;
    } catch (err) {
      console.log("fetchCalendar.js Error: ", err);
    }
  }
  async function get_calendar() {
    const url = "/webapps/calendar/calendarData/selectedCalendarEvents";
    const start_date = /* @__PURE__ */ new Date();
    start_date.setMonth(start_date.getMonth() - 1);
    const end_date = /* @__PURE__ */ new Date();
    end_date.setMonth(end_date.getMonth() + 1);
    const params = "?start=" + start_date.getTime() + "&end=" + end_date.getTime() + "&course_id=&mode=personal";
    return fetch(url + params, {
      method: "GET"
    }).then((res) => res.json()).then((data) => {
      return data;
    }).catch(console.log);
  }
  async function extractItems(_orig_todo_items) {
    let course_db;
    try {
      course_db = await courseInfoCatch();
    } catch (err) {
    }
    var _todo_items = [];
    for (let i = 0; i < _orig_todo_items.length; i++) {
      const it = _orig_todo_items[i];
      const courseEntry = course_db[it["calendarName"]];
      _todo_items.push({
        "id": i,
        // react key only
        "course": it["calendarName"],
        "todoItem": it["title"],
        "deadline": it["end"],
        "href": courseEntry ? courseEntry["href"] : "#",
        // extra fields for behavior
        "eventType": it["eventType"],
        "launchId": it["id"],
        // used to jump to attempt page for assignments
        "itemSourceId": it["itemSourceId"],
        "courseId": courseEntry ? courseEntry["id"] : null
      });
    }
    if (_todo_items.length === 0) {
      _todo_items.push({
        "id": 0,
        "course": "No DDL Currently",
        "todoItem": "HAVE A NICE DAY",
        // "deadline": _tmp_ddl,
        "href": "#"
      });
    } else {
      _todo_items.sort((a, b) => {
        return Date.parse(a.deadline) - Date.parse(b.deadline);
      });
    }
    console.log(_todo_items);
    return _todo_items;
  }
  async function setColor(_todo_items) {
    const generateGradientColors = (color1, color2, steps) => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const colors = [];
      for (let i = 0; i <= steps; i++) {
        const r = interpolate(rgb1.r, rgb2.r, i, steps);
        const g = interpolate(rgb1.g, rgb2.g, i, steps);
        const b = interpolate(rgb1.b, rgb2.b, i, steps);
        const hex = rgbToHex(r, g, b);
        colors.push(hex);
      }
      return colors;
    };
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgbToHex = (r, g, b) => {
      const hex = (r << 16 | g << 8 | b).toString(16);
      return "#" + hex.padStart(6, "0");
    };
    const interpolate = (start, end, step, totalSteps) => {
      return start + (end - start) * step / totalSteps;
    };
    const colorChoices = [
      ["#ff4e4f", "#ff9d81"],
      ["#032e71", "#b8e9fc"],
      ["#ff2121", "#d14631"]
    ];
    const colorArr = generateGradientColors(colorChoices[1][0], colorChoices[1][1], _todo_items.length);
    for (let i = 0; i < _todo_items.length; i++) {
      _todo_items[i]["color"] = colorArr[i];
    }
    return _todo_items;
  }
  async function enrichRoleAndSubmission(_todo_items) {
    const roleCache = {};
    const getCourseRole = async (courseId) => {
      if (!courseId)
        return "Student";
      if (roleCache[courseId])
        return roleCache[courseId];
      const url = `/learn/api/public/v1/courses/${encodeURIComponent(courseId)}/users/me`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        const role = data && data.courseRoleId ? data.courseRoleId : "Student";
        roleCache[courseId] = role;
        return role;
      } catch (e) {
        console.log("getCourseRole error", e);
        roleCache[courseId] = "Student";
        return "Student";
      }
    };
    const getAttemptStats = async (courseId, itemSourceId) => {
      if (!courseId || !itemSourceId)
        return { total: 0, graded: 0 };
      const url = `/learn/api/public/v2/courses/${encodeURIComponent(courseId)}/gradebook/columns/${encodeURIComponent(itemSourceId)}/attempts`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        const arr = data && Array.isArray(data.results) ? data.results : [];
        const graded = arr.reduce((n2, it) => n2 + (it && it.status === "Completed" ? 1 : 0), 0);
        return { total: arr.length, graded };
      } catch (e) {
        console.log("getAttemptStats error", e);
        return { total: 0, graded: 0 };
      }
    };
    const courseIds = Array.from(new Set(_todo_items.map((it) => it.courseId).filter(Boolean)));
    await Promise.all(courseIds.map((id) => getCourseRole(id)));
    const enriched = await Promise.all(
      _todo_items.map(async (it) => {
        if (it.eventType !== "Assignment")
          return it;
        const role = await getCourseRole(it.courseId);
        const isStudentRole = role === "Student";
        const stats = await getAttemptStats(it.courseId, it.itemSourceId);
        const attemptCount = stats.total;
        const gradedCount = stats.graded;
        const submitted = attemptCount > 0;
        const needsGradingUrl = it.courseId ? `https://pibb.scu.edu.cn/webapps/gradebook/do/instructor/viewNeedsGrading?course_id=${encodeURIComponent(it.courseId)}` : null;
        return {
          ...it,
          isStudentRole,
          roleName: role,
          attemptCount,
          gradedCount,
          submitted,
          needsGradingUrl
        };
      })
    );
    return enriched;
  }
  var client = {};
  var m = require$$0;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  const formatDuration = (ms) => {
    const second = 1e3;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor(ms % day / hour);
    const minutes = Math.floor(ms % hour / minute);
    const seconds = Math.floor(ms % minute / second);
    let result = "";
    if (days > 0) {
      result += days + "天";
    }
    if (hours > 0) {
      result += hours + "小时";
    }
    if (minutes > 0) {
      result += minutes + "分钟";
    }
    if (seconds > 0) {
      result += seconds + "秒";
    }
    return result;
  };
  const formatDue = (isoLike) => {
    if (!isoLike)
      return "-";
    const d = new Date(isoLike);
    if (isNaN(d.getTime()))
      return "-";
    return d.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };
  function Calendar(props) {
    const variant = props.variant || "overlay";
    const draggableEnabled = variant === "overlay";
    const showGraded = !!props.showGraded;
    const [dragging, setDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState([0, 0]);
    const [loc, setLoc] = React.useState(() => draggableEnabled ? _GM_getValue("loc", [150, 150]) : [0, 0]);
    const [now, setNow] = React.useState(Date.now());
    const handleMouseDown = (e) => {
      if (!draggableEnabled)
        return;
      if (e.target && (e.target.closest("a") || e.target.closest("button")))
        return;
      setDragging(true);
      setDragOffset([e.clientX - loc[0], e.clientY - loc[1]]);
    };
    const handleMouseMove = (e) => {
      if (draggableEnabled && dragging) {
        setLoc([e.clientX - dragOffset[0], e.clientY - dragOffset[1]]);
        _GM_setValue("loc", [e.clientX - dragOffset[0], e.clientY - dragOffset[1]]);
      }
    };
    const handleMouseUp = () => {
      if (!draggableEnabled)
        return;
      setDragging(false);
    };
    React.useEffect(() => {
      const it = setInterval(() => setNow(Date.now()), 1e3);
      return () => clearInterval(it);
    }, []);
    const [gradedDb, setGradedDb] = React.useState(() => _GM_getValue("gradedDB", {}));
    const isGraded = (todo) => {
      if (!todo)
        return false;
      const key = `${todo.courseId || ""}:${todo.itemSourceId || ""}`;
      return !!gradedDb[key];
    };
    const toggleGraded = (todo) => {
      const key = `${todo.courseId || ""}:${todo.itemSourceId || ""}`;
      const next = { ...gradedDb, [key]: !gradedDb[key] };
      setGradedDb(next);
      _GM_setValue("gradedDB", next);
    };
    const itemsToShow = (props.todo_items || []).filter((it) => {
      if (it && it.eventType === "Assignment" && typeof it.isStudentRole !== "undefined" && !it.isStudentRole) {
        if (!showGraded && isGraded(it))
          return false;
      }
      return true;
    });
    const cards = itemsToShow.map((todo) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      CalendarCard,
      {
        todo,
        now,
        isGraded: isGraded(todo),
        onToggleGraded: () => toggleGraded(todo),
        draggableEnabled,
        handleMouseDown
      },
      todo.id
    ));
    React.useEffect(() => {
      if (!draggableEnabled)
        return;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragging, draggableEnabled]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "calendar-container",
        style: draggableEnabled ? { top: loc[1], left: loc[0] } : { position: "static", top: "auto", left: "auto", width: "100%", opacity: 1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "calendar-list calendar-cards", children: cards })
      }
    ) });
  }
  function CalendarCard({ todo, now, isGraded, onToggleGraded, draggableEnabled, handleMouseDown }) {
    const deadlineMs = todo["deadline"] ? Date.parse(todo["deadline"]) : NaN;
    const validDeadline = !isNaN(deadlineMs);
    const remain = validDeadline ? deadlineMs - now : NaN;
    const within24h = validDeadline ? remain <= 24 * 60 * 60 * 1e3 : false;
    const overdue = validDeadline ? remain < 0 : false;
    const cntText = validDeadline ? overdue ? "已截止" : formatDuration(remain) : "-";
    const cntClass = overdue || within24h ? "red" : "green";
    const accentClass = overdue || within24h ? "accent-red" : "accent-green";
    let assignHref = null;
    if (todo["eventType"] === "Assignment") {
      if (typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole && todo.courseId) {
        assignHref = todo.needsGradingUrl || `https://pibb.scu.edu.cn/webapps/gradebook/do/instructor/viewNeedsGrading?course_id=${encodeURIComponent(todo.courseId)}`;
      } else if (todo["launchId"]) {
        assignHref = `https://pibb.scu.edu.cn/webapps/calendar/launch/attempt/${encodeURIComponent(todo["launchId"])}`;
      }
    }
    const titleText = `${todo["todoItem"] || ""}`;
    const [expanded, setExpanded] = React.useState(false);
    const [attachments, setAttachments] = React.useState(null);
    const [contentId, setContentId] = React.useState(null);
    const [loadingAtt, setLoadingAtt] = React.useState(false);
    const [errorAtt, setErrorAtt] = React.useState(null);
    const fetchAttachments = async () => {
      if (attachments !== null)
        return;
      if (todo.eventType !== "Assignment") {
        setAttachments([]);
        setContentId(null);
        return;
      }
      if (!todo.courseId || !todo.itemSourceId) {
        setAttachments([]);
        setContentId(null);
        return;
      }
      try {
        setLoadingAtt(true);
        setErrorAtt(null);
        const colUrl = `/learn/api/public/v2/courses/${encodeURIComponent(todo.courseId)}/gradebook/columns/${encodeURIComponent(todo.itemSourceId)}`;
        const colRes = await fetch(colUrl, { method: "GET" });
        const col = await colRes.json();
        const cId = col && col.contentId;
        if (!cId) {
          setContentId(null);
          setAttachments([]);
          setLoadingAtt(false);
          return;
        }
        setContentId(cId);
        const attUrl = `/learn/api/public/v1/courses/${encodeURIComponent(todo.courseId)}/contents/${encodeURIComponent(cId)}/attachments`;
        const attRes = await fetch(attUrl, { method: "GET" });
        const attData = await attRes.json();
        const list = attData && Array.isArray(attData.results) ? attData.results : [];
        setAttachments(list);
      } catch (e) {
        setErrorAtt("加载附件失败");
        setAttachments([]);
      } finally {
        setLoadingAtt(false);
      }
    };
    const onToggle = async () => {
      const next = !expanded;
      setExpanded(next);
      if (next) {
        await fetchAttachments();
      }
    };
    const roleText = typeof todo.roleName === "string" && todo.roleName ? todo.roleName : typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole ? "Instructor" : "Student";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `calendar-card ${accentClass}`,
        onMouseDown: handleMouseDown,
        style: { cursor: draggableEnabled ? "move" : "default" },
        children: [
          todo["eventType"] ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "line event-type", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "left", children: [
              todo["eventType"] === "Assignment" ? `Assignment - ${roleText}` : todo["eventType"],
              todo["eventType"] === "Assignment" ? typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-badge submitted", children: [
                  "已提交",
                  Number.isFinite(todo.attemptCount) ? todo.attemptCount : 0,
                  "份"
                ] }),
                typeof todo.gradedCount === "number" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-badge submitted", children: [
                  "已批改",
                  Number.isFinite(todo.gradedCount) ? todo.gradedCount : 0,
                  "份"
                ] }) : null
              ] }) : typeof todo["submitted"] !== "undefined" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `status-badge ${todo["submitted"] ? "submitted" : "pending"}`, children: todo["submitted"] ? "已提交" : "未提交" }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "right", style: { display: "inline-flex", gap: "6px" }, children: [
              typeof todo.isStudentRole !== "undefined" && !todo.isStudentRole && todo.eventType === "Assignment" && todo.courseId && todo.itemSourceId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: `attachments-link ${isGraded ? "active" : ""}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    onToggleGraded && onToggleGraded();
                  },
                  "aria-pressed": isGraded,
                  title: "标记为已批阅",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isGraded ? "已批阅" : "未批阅" })
                }
              ) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `attachments-link ${expanded ? "active" : ""}`,
                  onClick: onToggle,
                  "aria-expanded": expanded,
                  "aria-label": expanded ? "收起附件" : "查看附件",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "icon", viewBox: "0 0 24 24", width: "14", height: "14", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M16.5 6.5L9 14a3 3 0 11-4.243-4.243l8.485-8.485a5 5 0 117.071 7.071l-9.193 9.193a7 7 0 11-9.9-9.9l7.778-7.778 1.414 1.414L2.636 7.15a5 5 0 107.071 7.071l9.193-9.193a3 3 0 10-4.243-4.243L6.172 8.271l1.414 1.414L16.5 2.771" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: expanded ? "收起附件" : "附件" })
                  ]
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line assignment", children: assignHref ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: assignHref, children: titleText }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: titleText }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line course", children: todo["href"] && todo["href"] !== "#" ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: todo["href"], children: todo["course"] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: todo["course"] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "line due", children: [
            "Due: ",
            formatDue(todo["deadline"])
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line countdown", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `countdown-pill ${cntClass}`, children: cntText }) }),
          expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "attachments-list", children: [
            loadingAtt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: "加载中..." }),
            errorAtt && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: errorAtt }),
            !loadingAtt && !errorAtt && attachments && attachments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: "无附件" }),
            !loadingAtt && !errorAtt && attachments && attachments.length > 0 && attachments.map((att) => {
              const href = contentId ? `https://pibb.scu.edu.cn/learn/api/public/v1/courses/${encodeURIComponent(todo.courseId)}/contents/${encodeURIComponent(contentId)}/attachments/${encodeURIComponent(att.id)}/download` : "#";
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "attachment-item", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: "_blank", rel: "noreferrer", children: att.fileName || "附件" }) }, att.id);
            })
          ] })
        ]
      }
    );
  }
  function writeDeductionsToFeedback(values) {
    try {
      const iframe = document.querySelector("#feedbacktext_ifr");
      if (!iframe || !iframe.contentDocument)
        return;
      const doc = iframe.contentDocument;
      const body = doc.documentElement.querySelector("body");
      if (!body)
        return;
      const lines = [];
      for (let i = 0; i < values.length; i++) {
        const v = Number(values[i]) || 0;
        if (v > 0)
          lines.push(`${i + 1}.-${v}`);
      }
      let holder = doc.getElementById("bbep-deductions");
      if (!holder) {
        holder = doc.createElement("div");
        holder.id = "bbep-deductions";
        body.insertBefore(holder, body.firstChild);
      }
      holder.innerHTML = "";
      lines.forEach((l2) => {
        const lineDiv = doc.createElement("div");
        lineDiv.textContent = l2;
        holder.appendChild(lineDiv);
      });
      body.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (e) {
    }
  }
  function DeductionsToolbar() {
    const [count, setCount] = React.useState(() => _GM_getValue("bbep_ded_count", 5));
    const [step, setStep] = React.useState(() => _GM_getValue("bbep_ded_step", 1));
    const [values, setValues] = React.useState(() => {
      const n2 = typeof count === "number" ? count : 5;
      return new Array(n2).fill(0);
    });
    React.useEffect(() => {
      setValues((prev) => {
        const next = [...prev];
        if (count > next.length) {
          while (next.length < count)
            next.push(0);
        } else if (count < next.length) {
          next.length = count;
        }
        return next;
      });
    }, [count]);
    React.useEffect(() => {
      _GM_setValue("bbep_ded_count", count);
      writeDeductionsToFeedback(values);
    }, [count, values]);
    React.useEffect(() => {
      _GM_setValue("bbep_ded_step", step);
    }, [step]);
    React.useEffect(() => {
      const onCfg = (e) => {
        const d = e.detail || {};
        if (typeof d.count === "number")
          setCount(d.count);
        if (typeof d.step === "number")
          setStep(d.step);
      };
      window.addEventListener("bbep:dedConfig", onCfg);
      return () => window.removeEventListener("bbep:dedConfig", onCfg);
    }, []);
    const handleValueChange = (idx, v) => {
      const num = Math.max(0, parseFloat(v || "")) || 0;
      setValues((prev) => {
        const next = [...prev];
        next[idx] = num;
        return next;
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bbep-deductions-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bbep-deductions-grid", children: values.map((val, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bbep-ded-cell", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bbep-ded-label", children: i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "bbep-ded-input",
          type: "number",
          min: "0",
          step,
          placeholder: "0",
          value: val === 0 ? "" : val,
          onChange: (e) => handleValueChange(i, e.target.value)
        }
      )
    ] }, i)) }) });
  }
  function Memo({ props }) {
    const onInput = (e) => {
      const text = e.currentTarget.innerText;
      props.setEnv({
        ...props.env,
        assignment: {
          ...props.env.assignment,
          memo: text
        }
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-box", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-list", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "memo-input", contentEditable: true, onInput, children: props.env.assignment.memo }) }) }) });
  }
  const jszipBundle = `/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=e()}}(function(){return function s(a,o,h){function u(r,e){if(!o[r]){if(!a[r]){var t="function"==typeof require&&require;if(!e&&t)return t(r,!0);if(l)return l(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return u(t||e)},i,i.exports,s,a,o,h)}return o[r].exports}for(var l="function"==typeof require&&require,e=0;e<h.length;e++)u(h[e]);return u}({1:[function(e,t,r){"use strict";var d=e("./utils"),c=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,h=[],u=0,l=e.length,f=l,c="string"!==d.getTypeOf(e);u<e.length;)f=l-u,n=c?(t=e[u++],r=u<l?e[u++]:0,u<l?e[u++]:0):(t=e.charCodeAt(u++),r=u<l?e.charCodeAt(u++):0,u<l?e.charCodeAt(u++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<f?(15&r)<<2|n>>6:64,o=2<f?63&n:64,h.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,h=0,u="data:";if(e.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=c.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),l[h++]=t,64!==s&&(l[h++]=r),64!==a&&(l[h++]=n);return l}},{"./support":30,"./utils":32}],2:[function(e,t,r){"use strict";var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){"use strict";var n=e("./stream/GenericWorker");r.STORE={magic:"\\0\\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){"use strict";var n=e("./utils");var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}(0|t,e,e.length,0):function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t.charCodeAt(a))];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,t,r){"use strict";var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n}},{lie:37}],7:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function h(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}r.magic="\\b\\0",s.inherits(h,a),h.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}},r.compressWorker=function(e){return new h("Deflate",e)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){"use strict";function A(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function n(e,t,r,n,i,s){var a,o,h=e.file,u=e.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),c=I.transformTo("string",O.utf8encode(h.name)),d=h.comment,p=I.transformTo("string",s(d)),m=I.transformTo("string",O.utf8encode(d)),_=c.length!==h.name.length,g=m.length!==d.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===i?(C=798,z|=function(e,t){var r=e;return e||(r=t?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(e){return 63&(e||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+c,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\\n\\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\\0\\0\\0\\0"+A(z,4)+A(n,4)+f+b+p}}var I=e("../utils"),i=e("../stream/GenericWorker"),O=e("../utf8"),B=e("../crc32"),R=e("../signature");function s(e,t,r,n){i.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,i),s.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,i.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}))},s.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=n(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=n(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),t)this.push({data:function(e){return R.DATA_DESCRIPTOR+A(e.crc32,4)+A(e.compressedSize,4)+A(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,n=function(e,t,r,n,i){var s=I.transformTo("string",i(n));return R.CENTRAL_DIRECTORY_END+"\\0\\0\\0\\0"+A(e,2)+A(e,2)+A(t,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,e,this.zipComment,this.encodeFileName);this.push({data:n,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on("error",function(e){t.error(e)}),this},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(e){var t=this._sources;if(!i.prototype.error.call(this,e))return!1;for(var r=0;r<t.length;r++)try{t[r].error(e)}catch(e){}return!0},s.prototype.lock=function(){i.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){"use strict";var u=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),h=0;try{e.forEach(function(e,t){h++;var r=function(e,t){var r=e||t,n=u[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(e){o.error(e)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){"use strict";function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e}}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.1",n.loadAsync=function(e,t){return(new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){"use strict";var u=e("./utils"),i=e("./external"),n=e("./utf8"),s=e("./zipEntries"),a=e("./stream/Crc32Probe"),l=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new a);r.on("error",function(e){t(e)}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e()}).resume()})}t.exports=function(e,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:n.utf8decode}),l.isNode&&l.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",e,!0,o.optimizedBinaryString,o.base64).then(function(e){var t=new s(o);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(o.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n],s=i.fileNameStr,a=u.resolve(i.fileNameStr);h.file(a,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:o.createFolders}),i.dir||(h.file(a).unsafeOriginalName=s)}return t.zipComment.length&&(h.comment=t.zipComment),h})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t)}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}})}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e)}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){"use strict";var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t)}).on("error",function(e){n.emit("error",e)}).on("end",function(){n.push(null)})}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume()},t.exports=n},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){"use strict";t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}}},{}],15:[function(e,t,r){"use strict";function s(e,t,r){var n,i=u.getTypeOf(t),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=g(e)),s.createFolders&&(n=_(e))&&b.call(this,n,!0);var a="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string");var o=null;o=t instanceof c||t instanceof l?t:p.isNode&&p.isStream(t)?new m(e,t):u.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var h=new d(e,o,s);this.files[e]=h}var i=e("./utf8"),u=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),f=e("./defaults"),c=e("./compressedObject"),d=e("./zipObject"),o=e("./generate"),p=e("./nodejsUtils"),m=e("./nodejs/NodejsStreamInputAdapter"),_=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},g=function(e){return"/"!==e.slice(-1)&&(e+="/"),e},b=function(e,t){return t=void 0!==t?t:f.createFolders,e=g(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function h(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n)},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t)}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(h(e)){var n=e;return this.filter(function(e,t){return!t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=b.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=u.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n)}catch(e){(t=new l("error")).error(e)}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){"use strict";t.exports=e("stream")},{stream:void 0}],17:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){"use strict";var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,r){"use strict";var n=e("./Uint8ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){"use strict";var n=e("./ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),h=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new h(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\x07\\b"},{}],24:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0)}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){"use strict";function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(e){this.emit("error",e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.end()}),e.on("error",function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n},{}],29:[function(e,t,r){"use strict";var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),u=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter")}catch(e){}function l(e,o){return new a.Promise(function(t,r){var n=[],i=e._internalType,s=e._outputType,a=e._mimeType;e.on("data",function(e,t){n.push(e),o&&o(t)}).on("error",function(e){n=[],r(e)}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return u.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e)}catch(e){r(e)}n=[]}).resume()})}function f(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string"}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock()}catch(e){this._worker=new s("error"),this._worker.error(e)}}f.prototype={accumulate:function(e){return l(this,e)},on:function(e,t){var r=this;return"data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta)}):this._worker.on(e,function(){h.delay(t,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size}catch(e){r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch(e){r.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,s){"use strict";for(var o=e("./utils"),h=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),u=new Array(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;u[254]=u[254]=1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null}function l(){n.call(this,"utf-8 encode")}s.utf8encode=function(e){return h.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=h.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return h.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=u[n]))a[r++]=65533,t+=i-1;else{for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(h.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(h.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}(t),i=t;n!==t.length&&(h.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,n),l.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,a){"use strict";var o=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),u=e("./external");function n(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),a.newBlob=function(t,r){a.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var i={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return!1}}()}};function s(e){var t=65536,r=a.getTypeOf(e),n=!0;if("uint8array"===r?n=i.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=i.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return i.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2)}return i.stringifyByChar(e)}function f(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}a.applyFromCharCode=s;var c={};c.string={string:n,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:s,array:n,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return s(new Uint8Array(e))},array:function(e){return f(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:n,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:n,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return f(e,new Uint8Array(e.length))},nodebuffer:n},a.transformTo=function(e,t){if(t=t||"",!e)return t;a.checkSupport(e);var r=a.getTypeOf(t);return c[r][e](t)},a.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var i=t[n];"."===i||""===i&&0!==n&&n!==t.length-1||(".."===i?r.pop():r.push(i))}return r.join("/")},a.getTypeOf=function(e){return"string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":o.nodebuffer&&r.isBuffer(e)?"nodebuffer":o.uint8array&&e instanceof Uint8Array?"uint8array":o.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(e){if(!o[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},a.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[])})},a.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r},a.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},a.prepareContent=function(r,e,n,i,s){return u.Promise.resolve(e).then(function(n){return o.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new u.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result)},e.onerror=function(e){r(e.target.error)},e.readAsArrayBuffer(n)}):n}).then(function(e){var t=a.getTypeOf(e);return t?("arraybuffer"===t?e=a.transformTo("uint8array",e):"string"===t&&(s?e=h.decode(e):n&&!0!==i&&(e=function(e){return l(e,o.uint8array?new Uint8Array(e.length):new Array(e.length))}(e))),e):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=e("./support");function h(e){this.files=[],this.loadOptions=e}h.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),h=e("./compressions"),u=e("./support");function l(e,t){this.options=e,this.loadOptions=t}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in h)if(Object.prototype.hasOwnProperty.call(h,t)&&h[t].magic===e)return h[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i)},handleUTF8:function(){var e=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){"use strict";function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),h=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker))}catch(e){(t=new h("error")).error(e)}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new i(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)n.prototype[u[f]]=l;t.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,l,t){(function(t){"use strict";var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(u),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2}}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){u(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.document.documentElement.appendChild(e)}:function(){setTimeout(u,0)};else{var o=new t.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var e,t;n=!0;for(var r=h.length;r;){for(t=h,h=[],e=-1;++e<r;)t[e]();r=h.length}n=!1}l.exports=function(e){1!==h.push(e)||n||r()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(e,t,r){"use strict";var i=e("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==u&&d(this,e)}function h(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(t,r,n){i(function(){var e;try{e=r(n)}catch(e){return l.reject(t,e)}e===t?l.reject(t,new TypeError("Cannot resolve promise with itself")):l.resolve(t,e)})}function c(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function d(t,e){var r=!1;function n(e){r||(r=!0,l.reject(t,e))}function i(e){r||(r=!0,l.resolve(t,e))}var s=p(function(){e(i,n)});"error"===s.status&&n(s.value)}function p(e,t){var r={};try{r.value=e(t),r.status="success"}catch(e){r.status="error",r.value=e}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(u);this.state!==n?f(r,this.state===a?e:t,this.outcome):this.queue.push(new h(r,e,t));return r},h.prototype.callFulfilled=function(e){l.resolve(this.promise,e)},h.prototype.otherCallFulfilled=function(e){f(this.promise,this.onFulfilled,e)},h.prototype.callRejected=function(e){l.reject(this.promise,e)},h.prototype.otherCallRejected=function(e){f(this.promise,this.onRejected,e)},l.resolve=function(e,t){var r=p(c,t);if("error"===r.status)return l.reject(e,r.value);var n=r.value;if(n)d(e,n);else{e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t)}return e},l.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){if(e instanceof this)return e;return l.resolve(new this(u),e)},o.reject=function(e){var t=new this(u);return l.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);var s=new Array(n),a=0,t=-1,o=new this(u);for(;++t<n;)h(e[t],t);return o;function h(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,l.resolve(o,s))},function(e){i||(i=!0,l.reject(o,e))})}},o.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);var i=-1,s=new this(u);for(;++i<r;)a=e[i],t.resolve(a).then(function(e){n||(n=!0,l.resolve(s,e))},function(e){n||(n=!0,l.reject(s,e))});var a;return s}},{immediate:36}],38:[function(e,t,r){"use strict";var n={};(0,e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){"use strict";var a=e("./zlib/deflate"),o=e("./utils/common"),h=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,c=0,d=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:f,method:d,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==l)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?h.string2buf(t.dictionary):"[object ArrayBuffer]"===u.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==l)throw new Error(i[r]);this._dict_set=!0}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return!1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=h.string2buf(e):"[object ArrayBuffer]"===u.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)))}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==n||(this.onEnd(l),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return(t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return(t=t||{}).gzip=!0,n(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){"use strict";var c=e("./zlib/inflate"),d=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=c.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,c.inflateGetHeader(this.strm,this.header)}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?h.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new d.Buf8(u),h.next_out=0,h.avail_out=u),(r=c.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=c.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(h.output,h.next_out),s=h.next_out-i,a=p.buf2string(h.output,i),h.next_out=s,h.avail_out=u-s,s&&d.arraySet(h.output,h.output,i,s,0),this.onData(a)):this.onData(d.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=c.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e)},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return(t=t||{}).raw=!0,o(e,t)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(n)},{}],42:[function(e,t,r){"use strict";var h=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(e){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){s=!1}for(var u=new h.Buf8(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function l(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,h.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}u[254]=u[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new h.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return l(e,e.length)},r.binstring2buf=function(e){for(var t=new h.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=u[i]))o[n++]=65533,r+=s-1;else{for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i)}return l(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}},{"./common":41}],43:[function(e,t,r){"use strict";t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521}return i|s<<16|0}},{}],44:[function(e,t,r){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,r){"use strict";var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}},{}],46:[function(e,t,r){"use strict";var h,c=e("../utils/common"),u=e("./trees"),d=e("./adler32"),p=e("./crc32"),n=e("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,i=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(e,t){return e.msg=n[t],t}function T(e){return(e<<1)-(4<e?9:0)}function D(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(c.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function N(e,t){u._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function U(e,t){e.pending_buf[e.pending++]=t}function P(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function L(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,h=e.strstart>e.w_size-z?e.strstart-(e.w_size-z):0,u=e.window,l=e.w_mask,f=e.prev,c=e.strstart+S,d=u[s+a-1],p=u[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(u[(r=t)+a]===p&&u[r+a-1]===d&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<c);if(n=S-(c-s),s=c-S,a<n){if(e.match_start=t,o<=(a=n))break;d=u[s+a-1],p=u[s+a]}}}while((t=f[t&l])>h&&0!=--i);return a<=e.lookahead?a:e.lookahead}function j(e){var t,r,n,i,s,a,o,h,u,l,f=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-z)){for(c.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);i+=f}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,h=e.strstart+e.lookahead,u=i,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,c.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=d(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),e.lookahead+=r,e.lookahead+e.insert>=x)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+x-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<x)););}while(e.lookahead<z&&0!==e.strm.avail_in)}function Z(e,t){for(var r,n;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r)),e.match_length>=x)if(n=u._tr_tally(e,e.strstart-e.match_start,e.match_length-x),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=x){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function W(e,t){for(var r,n,i;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=x-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===x&&4096<e.strstart-e.match_start)&&(e.match_length=x-1)),e.prev_length>=x&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-x,n=u._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-x),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=x-1,e.strstart++,n&&(N(e,!1),0===e.strm.avail_out))return A}else if(e.match_available){if((n=u._tr_tally(e,0,e.window[e.strstart-1]))&&N(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return A}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=u._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function M(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new c.Buf16(2*w),this.dyn_dtree=new c.Buf16(2*(2*a+1)),this.bl_tree=new c.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new c.Buf16(k+1),this.heap=new c.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new c.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?C:E,e.adler=2===t.wrap?0:1,t.last_flush=l,u._tr_init(t),m):R(e,_)}function K(e){var t=G(e);return t===m&&function(e){e.window_size=2*e.w_size,D(e.head),e.max_lazy_match=h[e.level].max_lazy,e.good_match=h[e.level].good_length,e.nice_match=h[e.level].nice_length,e.max_chain_length=h[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0}(e.state),t}function Y(e,t,r,n,i,s){if(!e)return _;var a=1;if(t===g&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||y<i||r!==v||n<8||15<n||t<0||9<t||s<0||b<s)return R(e,_);8===n&&(n=9);var o=new H;return(e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new c.Buf8(2*o.w_size),o.head=new c.Buf16(o.hash_size),o.prev=new c.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new c.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,K(e)}h=[new M(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(j(e),0===e.lookahead&&t===l)return A;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,N(e,!1),0===e.strm.avail_out))return A;if(e.strstart-e.block_start>=e.w_size-z&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):(e.strstart>e.block_start&&(N(e,!1),e.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(e,t){return Y(e,t,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?_:(e.state.gzhead=t,m):_},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?R(e,_):_;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&t!==f)return R(e,0===e.avail_out?-5:_);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===C)if(2===n.wrap)e.adler=0,U(n,31),U(n,139),U(n,8),n.gzhead?(U(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),U(n,255&n.gzhead.time),U(n,n.gzhead.time>>8&255),U(n,n.gzhead.time>>16&255),U(n,n.gzhead.time>>24&255),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(U(n,255&n.gzhead.extra.length),U(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(U(n,0),U(n,0),U(n,0),U(n,0),U(n,0),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,3),n.status=E);else{var a=v+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=E,P(n,a),0!==n.strstart&&(P(n,e.adler>>>16),P(n,65535&e.adler)),e.adler=1}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending!==n.pending_buf_size));)U(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103)}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&F(e),n.pending+2<=n.pending_buf_size&&(U(n,255&e.adler),U(n,e.adler>>8&255),e.adler=0,n.status=E)):n.status=E),0!==n.pending){if(F(e),0===e.avail_out)return n.last_flush=-1,m}else if(0===e.avail_in&&T(t)<=T(r)&&t!==f)return R(e,-5);if(666===n.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==l&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(j(e),0===e.lookahead)){if(t===l)return A;break}if(e.match_length=0,r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=S){if(j(e),e.lookahead<=S&&t===l)return A;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=x&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+S;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=S-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=x?(r=u._tr_tally(e,1,e.match_length-x),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):h[n.level].func(n,t);if(o!==O&&o!==B||(n.status=666),o===A||o===O)return 0===e.avail_out&&(n.last_flush=-1),m;if(o===I&&(1===t?u._tr_align(n):5!==t&&(u._tr_stored_block(n,0,0,!1),3===t&&(D(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),F(e),0===e.avail_out))return n.last_flush=-1,m}return t!==f?m:n.wrap<=0?1:(2===n.wrap?(U(n,255&e.adler),U(n,e.adler>>8&255),U(n,e.adler>>16&255),U(n,e.adler>>24&255),U(n,255&e.total_in),U(n,e.total_in>>8&255),U(n,e.total_in>>16&255),U(n,e.total_in>>24&255)):(P(n,e.adler>>>16),P(n,65535&e.adler)),F(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?m:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==C&&69!==t&&73!==t&&91!==t&&103!==t&&t!==E&&666!==t?R(e,_):(e.state=null,t===E?R(e,-3):m):_},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,h,u,l=t.length;if(!e||!e.state)return _;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(e.adler=d(e.adler,t,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new c.Buf8(r.w_size),c.arraySet(u,t,l-r.w_size,r.w_size,0),t=u,l=r.w_size),a=e.avail_in,o=e.next_in,h=e.input,e.avail_in=l,e.next_in=0,e.input=t,j(r);r.lookahead>=x;){for(n=r.strstart,i=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+x-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,e.next_in=o,e.input=h,e.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,t,r){"use strict";t.exports=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,c=r.window,d=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;e:do{p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=m[d&g];t:for(;;){if(d>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(d&(1<<y)-1)];continue t}if(32&y){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}w=65535&v,(y&=15)&&(p<y&&(d+=z[n++]<<p,p+=8),w+=d&(1<<y)-1,d>>>=y,p-=y),p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=_[d&b];r:for(;;){if(d>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(d&(1<<y)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&v,p<(y&=15)&&(d+=z[n++]<<p,(p+=8)<y&&(d+=z[n++]<<p,p+=8)),h<(k+=d&(1<<y)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(d>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=c,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=c[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=c[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(n<i&&s<o);n-=w=p>>3,d&=(1<<(p-=w<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=d,r.bits=p}},{}],49:[function(e,t,r){"use strict";var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function h(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function u(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=h(e,t))!==N&&(e.state=null),r):U}var l,f,c=!0;function j(e){if(c){var t;for(l=new I.Buf32(512),f=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,l,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,f,0,e.work,{bits:5}),c=!1}e.lencode=l,e.lenbits=9,e.distcode=f,e.distbits=5}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(e){return u(e,15)},r.inflateInit2=u,r.inflate=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,f=o,c=h,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(d=r.length)&&(d=o),d&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,d,k)),512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,r.length-=d),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}e.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;u>>>=2,l-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(d=r.length){if(o<d&&(d=o),h<d&&(d=h),0===d)break e;I.arraySet(i,n,s,d,a),o-=d,s+=d,h-=d,a+=d,r.length-=d;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],d=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+d>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;d--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=h){e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,R(e,c),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break e;if(d=c-h,r.offset>d){if((d=r.offset-d)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=d>r.wnext?(d-=r.wnext,r.wsize-d):r.wnext-d,d>r.length&&(d=r.length),m=r.window}else m=i,p=a-r.offset,d=r.length;for(h<d&&(d=h),h-=d,r.length-=d;i[a++]=m[p++],--d;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break e;i[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break e;o--,u|=n[s++]<<l,l+=8}if(c-=h,e.total_out+=c,r.total+=c,c&&(e.adler=r.check=r.flags?B(r.check,i,c,a-c):O(r.check,i,c,a-c)),c=h,(r.flags?u:L(u))!==r.check){e.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return-4;case 32:default:return U}return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,(r.wsize||c!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,c-e.avail_out)?(r.mode=31,-4):(f-=e.avail_in,c-=e.avail_out,e.total_in+=f,e.total_out+=c,r.total+=c,r.wrap&&c&&(e.adler=r.check=r.flags?B(r.check,i,c,e.next_out-c):O(r.check,i,c,e.next_out-c)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===c||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){"use strict";var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var h,u,l,f,c,d,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<n;v++)O[t[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===e||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<n;v++)0!==t[r+v]&&(a[B[t[r+v]]++]=v);if(d=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,c=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<d?(m=0,a[v]):a[v]>d?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;i[c+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=t[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),c+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[l=E&f]=k<<24|x<<16|c-s|0}}return 0!==E&&(i[c+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(e,t,r){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,t,r){"use strict";var i=e("../utils/common"),o=0,h=1;function n(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,a=29,u=256,l=u+1+a,f=30,c=19,_=2*l+1,g=15,d=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));n(z);var C=new Array(2*f);n(C);var E=new Array(512);n(E);var A=new Array(256);n(A);var I=new Array(a);n(I);var O,B,R,T=new Array(f);function D(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function N(e){return e<256?E[e]:E[256+(e>>>7)]}function U(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function P(e,t,r){e.bi_valid>d-r?(e.bi_buf|=t<<e.bi_valid&65535,U(e,e.bi_buf),e.bi_buf=t>>d-e.bi_valid,e.bi_valid+=r-d):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function L(e,t,r){P(e,r[2*t],r[2*t+1])}function j(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function Z(e,t,r){var n,i,s=new Array(g+1),a=0;for(n=1;n<=g;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=j(s[o]++,o))}}function W(e){var t;for(t=0;t<l;t++)e.dyn_ltree[2*t]=0;for(t=0;t<f;t++)e.dyn_dtree[2*t]=0;for(t=0;t<c;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*m]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function M(e){8<e.bi_valid?U(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function H(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&H(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!H(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n}function K(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?L(e,i,t):(L(e,(s=A[i])+u+1,t),0!==(a=w[s])&&P(e,i-=I[s],a),L(e,s=N(--n),r),0!==(a=k[s])&&P(e,n-=T[s],a)),o<e.last_lit;);L(e,m,t)}function Y(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,h=t.stat_desc.elems,u=-1;for(e.heap_len=0,e.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(e.heap[++e.heap_len]=u=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=u<2?++u:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=u,r=e.heap_len>>1;1<=r;r--)G(e,s,r);for(i=h;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,G(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,h=t.dyn_tree,u=t.max_code,l=t.stat_desc.static_tree,f=t.stat_desc.has_stree,c=t.stat_desc.extra_bits,d=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=g;s++)e.bl_count[s]=0;for(h[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<_;r++)p<(s=h[2*h[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),h[2*n+1]=s,u<n||(e.bl_count[s]++,a=0,d<=n&&(a=c[n-d]),o=h[2*n],e.opt_len+=o*(s+a),f&&(e.static_len+=o*(l[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)u<(i=e.heap[--r])||(h[2*i+1]!==s&&(e.opt_len+=(s-h[2*i+1])*h[2*i],h[2*i+1]=s),n--)}}(e,t),Z(s,u,e.bl_count)}function X(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<h&&i===a||(o<u?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[2*b]++):o<=10?e.bl_tree[2*v]++:e.bl_tree[2*y]++,s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4))}function V(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<h&&i===a)){if(o<u)for(;L(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(L(e,i,e.bl_tree),o--),L(e,b,e.bl_tree),P(e,o-3,2)):o<=10?(L(e,v,e.bl_tree),P(e,o-3,3)):(L(e,y,e.bl_tree),P(e,o-11,7));s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4)}}n(T);var q=!1;function J(e,t,r,n){P(e,(s<<1)+(n?1:0),3),function(e,t,r,n){M(e),n&&(U(e,r),U(e,~r)),i.arraySet(e.pending_buf,e.window,t,r,e.pending),e.pending+=r}(e,t,r,!0)}r._tr_init=function(e){q||(function(){var e,t,r,n,i,s=new Array(g+1);for(n=r=0;n<a-1;n++)for(I[n]=r,e=0;e<1<<w[n];e++)A[r++]=n;for(A[r-1]=n,n=i=0;n<16;n++)for(T[n]=i,e=0;e<1<<k[n];e++)E[i++]=n;for(i>>=7;n<f;n++)for(T[n]=i<<7,e=0;e<1<<k[n]-7;e++)E[256+i++]=n;for(t=0;t<=g;t++)s[t]=0;for(e=0;e<=143;)z[2*e+1]=8,e++,s[8]++;for(;e<=255;)z[2*e+1]=9,e++,s[9]++;for(;e<=279;)z[2*e+1]=7,e++,s[7]++;for(;e<=287;)z[2*e+1]=8,e++,s[8]++;for(Z(z,l+1,s),e=0;e<f;e++)C[2*e+1]=5,C[2*e]=j(e,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,c,p)}(),q=!0),e.l_desc=new F(e.dyn_ltree,O),e.d_desc=new F(e.dyn_dtree,B),e.bl_desc=new F(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,W(e)},r._tr_stored_block=J,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return o;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return h;for(t=32;t<u;t++)if(0!==e.dyn_ltree[2*t])return h;return o}(e)),Y(e,e.l_desc),Y(e,e.d_desc),a=function(e){var t;for(X(e,e.dyn_ltree,e.l_desc.max_code),X(e,e.dyn_dtree,e.d_desc.max_code),Y(e,e.bl_desc),t=c-1;3<=t&&0===e.bl_tree[2*S[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?J(e,t,r,n):4===e.strategy||s===i?(P(e,2+(n?1:0),3),K(e,z,C)):(P(e,4+(n?1:0),3),function(e,t,r,n){var i;for(P(e,t-257,5),P(e,r-1,5),P(e,n-4,4),i=0;i<n;i++)P(e,e.bl_tree[2*S[i]+1],3);V(e,e.dyn_ltree,t-1),V(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),K(e,e.dyn_ltree,e.dyn_dtree)),W(e),n&&M(e)},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(A[r]+u+1)]++,e.dyn_dtree[2*N(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){P(e,2,3),L(e,m,z),function(e){16===e.bi_valid?(U(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,r){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,r){(function(e){!function(r,n){"use strict";if(!r.setImmediate){var i,s,t,a,o=1,h={},u=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,i="[object process]"==={}.toString.call(r.process)?function(e){process.nextTick(function(){c(e)})}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*")}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){c(e.data)},function(e){t.port2.postMessage(e)}):l&&"onreadystatechange"in l.createElement("script")?(s=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){c(e),t.onreadystatechange=null,s.removeChild(t),t=null},s.appendChild(t)}):function(e){setTimeout(c,0,e)},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var n={callback:e,args:t};return h[o]=n,i(o),o++},e.clearImmediate=f}function f(e){delete h[e]}function c(e){if(u)setTimeout(c,0,e);else{var t=h[e];if(t){u=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r)}}(t)}finally{f(e),u=!1}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&c(+e.data.slice(a.length))}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[10])(10)});`;
  const docxPreviewBundle = '!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("jszip")):"function"==typeof define&&define.amd?define(["exports","jszip"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).docx={},e.JSZip)}(this,(function(e,t){"use strict";var r;!function(e){e.OfficeDocument="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",e.FontTable="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable",e.Image="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",e.Numbering="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering",e.Styles="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",e.StylesWithEffects="http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects",e.Theme="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",e.Settings="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings",e.WebSettings="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings",e.Hyperlink="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",e.Footnotes="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes",e.Endnotes="http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes",e.Footer="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",e.Header="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header",e.ExtendedProperties="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",e.CoreProperties="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",e.CustomProperties="http://schemas.openxmlformats.org/package/2006/relationships/metadata/custom-properties",e.Comments="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",e.CommentsExtended="http://schemas.microsoft.com/office/2011/relationships/commentsExtended"}(r||(r={}));const a={wordml:"http://schemas.openxmlformats.org/wordprocessingml/2006/main",drawingml:"http://schemas.openxmlformats.org/drawingml/2006/main",picture:"http://schemas.openxmlformats.org/drawingml/2006/picture",compatibility:"http://schemas.openxmlformats.org/markup-compatibility/2006",math:"http://schemas.openxmlformats.org/officeDocument/2006/math"},s={Dxa:{mul:.05,unit:"pt"},Emu:{mul:1/12700,unit:"pt"},FontSize:{mul:.5,unit:"pt"},Border:{mul:.125,unit:"pt"},Point:{mul:1,unit:"pt"},Percent:{mul:.02,unit:"%"},LineHeight:{mul:1/240,unit:""},VmlEmu:{mul:1/12700,unit:""}};function n(e,t=s.Dxa){return null==e||/.+(p[xt]|[%])$/.test(e)?e:`${(parseInt(e)*t.mul).toFixed(2)}${t.unit}`}function l(e,t,r){if(e.namespaceURI!=a.wordml)return!1;switch(e.localName){case"color":t.color=r.attr(e,"val");break;case"sz":t.fontSize=r.lengthAttr(e,"val",s.FontSize);break;default:return!1}return!0}class o{elements(e,t=null){const r=[];for(let a=0,s=e.childNodes.length;a<s;a++){let s=e.childNodes.item(a);1!=s.nodeType||null!=t&&s.localName!=t||r.push(s)}return r}element(e,t){for(let r=0,a=e.childNodes.length;r<a;r++){let a=e.childNodes.item(r);if(1==a.nodeType&&a.localName==t)return a}return null}elementAttr(e,t,r){var a=this.element(e,t);return a?this.attr(a,r):void 0}attrs(e){return Array.from(e.attributes)}attr(e,t){for(let r=0,a=e.attributes.length;r<a;r++){let a=e.attributes.item(r);if(a.localName==t)return a.value}return null}intAttr(e,t,r=null){var a=this.attr(e,t);return a?parseInt(a):r}hexAttr(e,t,r=null){var a=this.attr(e,t);return a?parseInt(a,16):r}floatAttr(e,t,r=null){var a=this.attr(e,t);return a?parseFloat(a):r}boolAttr(e,t,r=null){return function(e,t=!1){switch(e){case"1":case"on":case"true":return!0;case"0":case"off":case"false":return!1;default:return t}}(this.attr(e,t),r)}lengthAttr(e,t,r=s.Dxa){return n(this.attr(e,t),r)}}const i=new o;class c{constructor(e,t){this._package=e,this.path=t}async load(){this.rels=await this._package.loadRelationships(this.path);const e=await this._package.load(this.path),t=this._package.parseXmlDocument(e);this._package.options.keepOrigin&&(this._xmlDocument=t),this.parseXml(t.firstElementChild)}save(){var e;this._package.update(this.path,(e=this._xmlDocument,(new XMLSerializer).serializeToString(e)))}parseXml(e){}}const h={embedRegular:"regular",embedBold:"bold",embedItalic:"italic",embedBoldItalic:"boldItalic"};function m(e,t){return t.elements(e).map((e=>function(e,t){let r={name:t.attr(e,"name"),embedFontRefs:[]};for(let a of t.elements(e))switch(a.localName){case"family":r.family=t.attr(a,"val");break;case"altName":r.altName=t.attr(a,"val");break;case"embedRegular":case"embedBold":case"embedItalic":case"embedBoldItalic":r.embedFontRefs.push(u(a,t))}return r}(e,t)))}function u(e,t){return{id:t.attr(e,"id"),key:t.attr(e,"fontKey"),type:h[e.localName]}}class p extends c{parseXml(e){this.fonts=m(e,this._package.xmlParser)}}function d(e){let t=e.lastIndexOf("/")+1;return[0==t?"":e.substring(0,t),0==t?e:e.substring(t)]}function f(e,t){try{const r="http://docx/";return new URL(e,r+t).toString().substring(r.length)}catch{return`${t}${e}`}}function g(e,t){return e.reduce(((e,r)=>(e[t(r)]=r,e)),{})}function b(e){return e&&"object"==typeof e&&!Array.isArray(e)}function y(e,...t){if(!t.length)return e;const r=t.shift();if(b(e)&&b(r))for(const t in r)if(b(r[t])){y(e[t]??(e[t]={}),r[t])}else e[t]=r[t];return y(e,...t)}function k(e){return Array.isArray(e)?e:[e]}class v{constructor(e,t){this._zip=e,this.options=t,this.xmlParser=new o}get(e){const t=function(e){return e.startsWith("/")?e.substr(1):e}(e);return this._zip.files[t]??this._zip.files[t.replace(/\\//g,"\\\\")]}update(e,t){this._zip.file(e,t)}static async load(e,r){const a=await t.loadAsync(e);return new v(a,r)}save(e="blob"){return this._zip.generateAsync({type:e})}load(e,t="string"){return this.get(e)?.async(t)??Promise.resolve(null)}async loadRelationships(e=null){let t="_rels/.rels";if(null!=e){const[r,a]=d(e);t=`${r}_rels/${a}.rels`}const r=await this.load(t);return r?(a=this.parseXmlDocument(r).firstElementChild,(s=this.xmlParser).elements(a).map((e=>({id:s.attr(e,"Id"),type:s.attr(e,"Type"),target:s.attr(e,"Target"),targetMode:s.attr(e,"TargetMode")})))):null;var a,s}parseXmlDocument(e){return function(e,t=!1){var r;t&&(e=e.replace(/<[?].*[?]>/,"")),e=65279===(r=e).charCodeAt(0)?r.substring(1):r;const a=(new DOMParser).parseFromString(e,"application/xml"),s=(n=a,n.getElementsByTagName("parsererror")[0]?.textContent);var n;if(s)throw new Error(s);return a}(e,this.options.trimXmlDeclaration)}}class S extends c{constructor(e,t,r){super(e,t),this._documentParser=r}parseXml(e){this.body=this._documentParser.parseDocumentFile(e)}}function P(e,t){return{type:t.attr(e,"val"),color:t.attr(e,"color"),size:t.lengthAttr(e,"sz",s.Border),offset:t.lengthAttr(e,"space",s.Point),frame:t.boolAttr(e,"frame"),shadow:t.boolAttr(e,"shadow")}}function w(e,t){var r={};for(let a of t.elements(e))switch(a.localName){case"left":r.left=P(a,t);break;case"top":r.top=P(a,t);break;case"right":r.right=P(a,t);break;case"bottom":r.bottom=P(a,t)}return r}var x,C;function N(e,t=i){var r={};for(let a of t.elements(e))switch(a.localName){case"pgSz":r.pageSize={width:t.lengthAttr(a,"w"),height:t.lengthAttr(a,"h"),orientation:t.attr(a,"orient")};break;case"type":r.type=t.attr(a,"val");break;case"pgMar":r.pageMargins={left:t.lengthAttr(a,"left"),right:t.lengthAttr(a,"right"),top:t.lengthAttr(a,"top"),bottom:t.lengthAttr(a,"bottom"),header:t.lengthAttr(a,"header"),footer:t.lengthAttr(a,"footer"),gutter:t.lengthAttr(a,"gutter")};break;case"cols":r.columns=M(a,t);break;case"headerReference":(r.headerRefs??(r.headerRefs=[])).push(T(a,t));break;case"footerReference":(r.footerRefs??(r.footerRefs=[])).push(T(a,t));break;case"titlePg":r.titlePage=t.boolAttr(a,"val",!0);break;case"pgBorders":r.pageBorders=w(a,t);break;case"pgNumType":r.pageNumber=A(a,t)}return r}function M(e,t){return{numberOfColumns:t.intAttr(e,"num"),space:t.lengthAttr(e,"space"),separator:t.boolAttr(e,"sep"),equalWidth:t.boolAttr(e,"equalWidth",!0),columns:t.elements(e,"col").map((e=>({width:t.lengthAttr(e,"w"),space:t.lengthAttr(e,"space")})))}}function A(e,t){return{chapSep:t.attr(e,"chapSep"),chapStyle:t.attr(e,"chapStyle"),format:t.attr(e,"fmt"),start:t.intAttr(e,"start")}}function T(e,t){return{id:t.attr(e,"id"),type:t.attr(e,"type")}}function E(e,t){let r={};for(let a of t.elements(e))R(a,r,t);return r}function R(e,t,r){return!!l(e,t,r)}function D(e,t){let r={};for(let a of t.elements(e))B(a,r,t);return r}function B(e,t,r){if(e.namespaceURI!=a.wordml)return!1;if(l(e,t,r))return!0;switch(e.localName){case"tabs":t.tabs=function(e,t){return t.elements(e,"tab").map((e=>({position:t.lengthAttr(e,"pos"),leader:t.attr(e,"leader"),style:t.attr(e,"val")})))}(e,r);break;case"sectPr":t.sectionProps=N(e,r);break;case"numPr":t.numbering=function(e,t){var r={};for(let a of t.elements(e))switch(a.localName){case"numId":r.id=t.attr(a,"val");break;case"ilvl":r.level=t.intAttr(a,"val")}return r}(e,r);break;case"spacing":return t.lineSpacing=function(e,t){return{before:t.lengthAttr(e,"before"),after:t.lengthAttr(e,"after"),line:t.intAttr(e,"line"),lineRule:t.attr(e,"lineRule")}}(e,r),!1;case"textAlignment":return t.textAlignment=r.attr(e,"val"),!1;case"keepLines":t.keepLines=r.boolAttr(e,"val",!0);break;case"keepNext":t.keepNext=r.boolAttr(e,"val",!0);break;case"pageBreakBefore":t.pageBreakBefore=r.boolAttr(e,"val",!0);break;case"outlineLvl":t.outlineLevel=r.intAttr(e,"val");break;case"pStyle":t.styleName=r.attr(e,"val");break;case"rPr":t.runProps=E(e,r);break;default:return!1}return!0}function F(e,t){let r={id:t.attr(e,"numId"),overrides:[]};for(let a of t.elements(e))switch(a.localName){case"abstractNumId":r.abstractId=t.attr(a,"val");break;case"lvlOverride":r.overrides.push(L(a,t))}return r}function $(e,t){let r={id:t.attr(e,"abstractNumId"),levels:[]};for(let a of t.elements(e))switch(a.localName){case"name":r.name=t.attr(a,"val");break;case"multiLevelType":r.multiLevelType=t.attr(a,"val");break;case"numStyleLink":r.numberingStyleLink=t.attr(a,"val");break;case"styleLink":r.styleLink=t.attr(a,"val");break;case"lvl":r.levels.push(I(a,t))}return r}function I(e,t){let r={level:t.intAttr(e,"ilvl")};for(let a of t.elements(e))switch(a.localName){case"start":r.start=t.attr(a,"val");break;case"lvlRestart":r.restart=t.intAttr(a,"val");break;case"numFmt":r.format=t.attr(a,"val");break;case"lvlText":r.text=t.attr(a,"val");break;case"lvlJc":r.justification=t.attr(a,"val");break;case"lvlPicBulletId":r.bulletPictureId=t.attr(a,"val");break;case"pStyle":r.paragraphStyle=t.attr(a,"val");break;case"pPr":r.paragraphProps=D(a,t);break;case"rPr":r.runProps=E(a,t)}return r}function L(e,t){let r={level:t.intAttr(e,"ilvl")};for(let a of t.elements(e))switch(a.localName){case"startOverride":r.start=t.intAttr(a,"val");break;case"lvl":r.numberingLevel=I(a,t)}return r}function O(e,t){var r=t.element(e,"pict"),a=r&&t.element(r,"shape"),s=a&&t.element(a,"imagedata");return s?{id:t.attr(e,"numPicBulletId"),referenceId:t.attr(s,"id"),style:t.attr(a,"style")}:null}!function(e){e.Continuous="continuous",e.NextPage="nextPage",e.NextColumn="nextColumn",e.EvenPage="evenPage",e.OddPage="oddPage"}(x||(x={}));class H extends c{constructor(e,t,r){super(e,t),this._documentParser=r}parseXml(e){Object.assign(this,function(e,t){let r={numberings:[],abstractNumberings:[],bulletPictures:[]};for(let a of t.elements(e))switch(a.localName){case"num":r.numberings.push(F(a,t));break;case"abstractNum":r.abstractNumberings.push($(a,t));break;case"numPicBullet":r.bulletPictures.push(O(a,t))}return r}(e,this._package.xmlParser)),this.domNumberings=this._documentParser.parseNumberingFile(e)}}class _ extends c{constructor(e,t,r){super(e,t),this._documentParser=r}parseXml(e){this.styles=this._documentParser.parseStylesFile(e)}}!function(e){e.Document="document",e.Paragraph="paragraph",e.Run="run",e.Break="break",e.NoBreakHyphen="noBreakHyphen",e.Table="table",e.Row="row",e.Cell="cell",e.Hyperlink="hyperlink",e.SmartTag="smartTag",e.Drawing="drawing",e.Image="image",e.Text="text",e.Tab="tab",e.Symbol="symbol",e.BookmarkStart="bookmarkStart",e.BookmarkEnd="bookmarkEnd",e.Footer="footer",e.Header="header",e.FootnoteReference="footnoteReference",e.EndnoteReference="endnoteReference",e.Footnote="footnote",e.Endnote="endnote",e.SimpleField="simpleField",e.ComplexField="complexField",e.Instruction="instruction",e.VmlPicture="vmlPicture",e.MmlMath="mmlMath",e.MmlMathParagraph="mmlMathParagraph",e.MmlFraction="mmlFraction",e.MmlFunction="mmlFunction",e.MmlFunctionName="mmlFunctionName",e.MmlNumerator="mmlNumerator",e.MmlDenominator="mmlDenominator",e.MmlRadical="mmlRadical",e.MmlBase="mmlBase",e.MmlDegree="mmlDegree",e.MmlSuperscript="mmlSuperscript",e.MmlSubscript="mmlSubscript",e.MmlPreSubSuper="mmlPreSubSuper",e.MmlSubArgument="mmlSubArgument",e.MmlSuperArgument="mmlSuperArgument",e.MmlNary="mmlNary",e.MmlDelimiter="mmlDelimiter",e.MmlRun="mmlRun",e.MmlEquationArray="mmlEquationArray",e.MmlLimit="mmlLimit",e.MmlLimitLower="mmlLimitLower",e.MmlMatrix="mmlMatrix",e.MmlMatrixRow="mmlMatrixRow",e.MmlBox="mmlBox",e.MmlBar="mmlBar",e.MmlGroupChar="mmlGroupChar",e.VmlElement="vmlElement",e.Inserted="inserted",e.Deleted="deleted",e.DeletedText="deletedText",e.Comment="comment",e.CommentReference="commentReference",e.CommentRangeStart="commentRangeStart",e.CommentRangeEnd="commentRangeEnd"}(C||(C={}));class z{constructor(){this.children=[],this.cssStyle={}}}class V extends z{constructor(){super(...arguments),this.type=C.Header}}class j extends z{constructor(){super(...arguments),this.type=C.Footer}}class W extends c{constructor(e,t,r){super(e,t),this._documentParser=r}parseXml(e){this.rootElement=this.createRootElement(),this.rootElement.children=this._documentParser.parseBodyElements(e)}}class X extends W{createRootElement(){return new V}}class U extends W{createRootElement(){return new j}}function q(e){if(void 0!==e)return parseInt(e)}class G extends c{parseXml(e){this.props=function(e,t){const r={};for(let a of t.elements(e))switch(a.localName){case"Template":r.template=a.textContent;break;case"Pages":r.pages=q(a.textContent);break;case"Words":r.words=q(a.textContent);break;case"Characters":r.characters=q(a.textContent);break;case"Application":r.application=a.textContent;break;case"Lines":r.lines=q(a.textContent);break;case"Paragraphs":r.paragraphs=q(a.textContent);break;case"Company":r.company=a.textContent;break;case"AppVersion":r.appVersion=a.textContent}return r}(e,this._package.xmlParser)}}class J extends c{parseXml(e){this.props=function(e,t){const r={};for(let a of t.elements(e))switch(a.localName){case"title":r.title=a.textContent;break;case"description":r.description=a.textContent;break;case"subject":r.subject=a.textContent;break;case"creator":r.creator=a.textContent;break;case"keywords":r.keywords=a.textContent;break;case"language":r.language=a.textContent;break;case"lastModifiedBy":r.lastModifiedBy=a.textContent;break;case"revision":a.textContent&&(r.revision=parseInt(a.textContent))}return r}(e,this._package.xmlParser)}}class Z{}function K(e,t){var r={name:t.attr(e,"name"),colors:{}};for(let n of t.elements(e)){var a=t.element(n,"srgbClr"),s=t.element(n,"sysClr");a?r.colors[n.localName]=t.attr(a,"val"):s&&(r.colors[n.localName]=t.attr(s,"lastClr"))}return r}function Y(e,t){var r={name:t.attr(e,"name")};for(let a of t.elements(e))switch(a.localName){case"majorFont":r.majorFont=Q(a,t);break;case"minorFont":r.minorFont=Q(a,t)}return r}function Q(e,t){return{latinTypeface:t.elementAttr(e,"latin","typeface"),eaTypeface:t.elementAttr(e,"ea","typeface"),csTypeface:t.elementAttr(e,"cs","typeface")}}class ee extends c{constructor(e,t){super(e,t)}parseXml(e){this.theme=function(e,t){var r=new Z,a=t.element(e,"themeElements");for(let e of t.elements(a))switch(e.localName){case"clrScheme":r.colorScheme=K(e,t);break;case"fontScheme":r.fontScheme=Y(e,t)}return r}(e,this._package.xmlParser)}}class te{}class re extends te{constructor(){super(...arguments),this.type=C.Footnote}}class ae extends te{constructor(){super(...arguments),this.type=C.Endnote}}class se extends c{constructor(e,t,r){super(e,t),this._documentParser=r}}class ne extends se{constructor(e,t,r){super(e,t,r)}parseXml(e){this.notes=this._documentParser.parseNotes(e,"footnote",re)}}class le extends se{constructor(e,t,r){super(e,t,r)}parseXml(e){this.notes=this._documentParser.parseNotes(e,"endnote",ae)}}function oe(e,t){var r={defaultNoteIds:[]};for(let a of t.elements(e))switch(a.localName){case"numFmt":r.nummeringFormat=t.attr(a,"val");break;case"footnote":case"endnote":r.defaultNoteIds.push(t.attr(a,"id"))}return r}class ie extends c{constructor(e,t){super(e,t)}parseXml(e){this.settings=function(e,t){var r={};for(let a of t.elements(e))switch(a.localName){case"defaultTabStop":r.defaultTabStop=t.lengthAttr(a,"val");break;case"footnotePr":r.footnoteProps=oe(a,t);break;case"endnotePr":r.endnoteProps=oe(a,t);break;case"autoHyphenation":r.autoHyphenation=t.boolAttr(a,"val")}return r}(e,this._package.xmlParser)}}class ce extends c{parseXml(e){this.props=function(e,t){return t.elements(e,"property").map((e=>{const r=e.firstChild;return{formatId:t.attr(e,"fmtid"),name:t.attr(e,"name"),type:r.nodeName,value:r.textContent}}))}(e,this._package.xmlParser)}}class he extends c{constructor(e,t,r){super(e,t),this._documentParser=r}parseXml(e){this.comments=this._documentParser.parseComments(e),this.commentMap=g(this.comments,(e=>e.id))}}class me extends c{constructor(e,t){super(e,t),this.comments=[]}parseXml(e){const t=this._package.xmlParser;for(let r of t.elements(e,"commentEx"))this.comments.push({paraId:t.attr(r,"paraId"),paraIdParent:t.attr(r,"paraIdParent"),done:t.boolAttr(r,"done")});this.commentMap=g(this.comments,(e=>e.paraId))}}const ue=[{type:r.OfficeDocument,target:"word/document.xml"},{type:r.ExtendedProperties,target:"docProps/app.xml"},{type:r.CoreProperties,target:"docProps/core.xml"},{type:r.CustomProperties,target:"docProps/custom.xml"}];class pe{constructor(){this.parts=[],this.partsMap={}}static async load(e,t,r){var a=new pe;return a._options=r,a._parser=t,a._package=await v.load(e,r),a.rels=await a._package.loadRelationships(),await Promise.all(ue.map((e=>{const t=a.rels.find((t=>t.type===e.type))??e;return a.loadRelationshipPart(t.target,t.type)}))),a}save(e="blob"){return this._package.save(e)}async loadRelationshipPart(e,t){if(this.partsMap[e])return this.partsMap[e];if(!this._package.get(e))return null;let a=null;switch(t){case r.OfficeDocument:this.documentPart=a=new S(this._package,e,this._parser);break;case r.FontTable:this.fontTablePart=a=new p(this._package,e);break;case r.Numbering:this.numberingPart=a=new H(this._package,e,this._parser);break;case r.Styles:this.stylesPart=a=new _(this._package,e,this._parser);break;case r.Theme:this.themePart=a=new ee(this._package,e);break;case r.Footnotes:this.footnotesPart=a=new ne(this._package,e,this._parser);break;case r.Endnotes:this.endnotesPart=a=new le(this._package,e,this._parser);break;case r.Footer:a=new U(this._package,e,this._parser);break;case r.Header:a=new X(this._package,e,this._parser);break;case r.CoreProperties:this.corePropsPart=a=new J(this._package,e);break;case r.ExtendedProperties:this.extendedPropsPart=a=new G(this._package,e);break;case r.CustomProperties:a=new ce(this._package,e);break;case r.Settings:this.settingsPart=a=new ie(this._package,e);break;case r.Comments:this.commentsPart=a=new he(this._package,e,this._parser);break;case r.CommentsExtended:this.commentsExtendedPart=a=new me(this._package,e)}if(null==a)return Promise.resolve(null);if(this.partsMap[e]=a,this.parts.push(a),await a.load(),a.rels?.length>0){const[e]=d(a.path);await Promise.all(a.rels.map((t=>this.loadRelationshipPart(f(t.target,e),t.type))))}return a}async loadDocumentImage(e,t){const r=await this.loadResource(t??this.documentPart,e,"blob");return this.blobToURL(r)}async loadNumberingImage(e){const t=await this.loadResource(this.numberingPart,e,"blob");return this.blobToURL(t)}async loadFont(e,t){const r=await this.loadResource(this.fontTablePart,e,"uint8array");return r?this.blobToURL(new Blob([de(r,t)])):r}blobToURL(e){return e?this._options.useBase64URL?function(e){return new Promise(((t,r)=>{const a=new FileReader;a.onloadend=()=>t(a.result),a.onerror=()=>r(),a.readAsDataURL(e)}))}(e):URL.createObjectURL(e):null}findPartByRelId(e,t=null){var r=(t.rels??this.rels).find((t=>t.id==e));const a=t?d(t.path)[0]:"";return r?this.partsMap[f(r.target,a)]:null}getPathById(e,t){const r=e.rels.find((e=>e.id==t)),[a]=d(e.path);return r?f(r.target,a):null}loadResource(e,t,r){const a=this.getPathById(e,t);return a?this._package.load(a,r):Promise.resolve(null)}}function de(e,t){const r=t.replace(/{|}|-/g,""),a=new Array(16);for(let e=0;e<16;e++)a[16-e-1]=parseInt(r.substr(2*e,2),16);for(let t=0;t<32;t++)e[t]=e[t]^a[t%16];return e}function fe(e,t){return{type:C.BookmarkEnd,id:t.attr(e,"id")}}class ge extends z{constructor(){super(...arguments),this.type=C.VmlElement,this.attrs={}}}function be(e,t){var r=new ge;switch(e.localName){case"rect":r.tagName="rect",Object.assign(r.attrs,{width:"100%",height:"100%"});break;case"oval":r.tagName="ellipse",Object.assign(r.attrs,{cx:"50%",cy:"50%",rx:"50%",ry:"50%"});break;case"line":r.tagName="line";break;case"shape":r.tagName="g";break;case"textbox":r.tagName="foreignObject",Object.assign(r.attrs,{width:"100%",height:"100%"});break;default:return null}for(const t of i.attrs(e))switch(t.localName){case"style":r.cssStyleText=t.value;break;case"fillcolor":r.attrs.fill=t.value;break;case"from":const[e,a]=ke(t.value);Object.assign(r.attrs,{x1:e,y1:a});break;case"to":const[s,n]=ke(t.value);Object.assign(r.attrs,{x2:s,y2:n})}for(const a of i.elements(e))switch(a.localName){case"stroke":Object.assign(r.attrs,ye(a));break;case"fill":Object.assign(r.attrs,{});break;case"imagedata":r.tagName="image",Object.assign(r.attrs,{width:"100%",height:"100%"}),r.imageHref={id:i.attr(a,"id"),title:i.attr(a,"title")};break;case"txbxContent":r.children.push(...t.parseBodyElements(a));break;default:const e=be(a,t);e&&r.children.push(e)}return r}function ye(e){return{stroke:i.attr(e,"color"),"stroke-width":i.lengthAttr(e,"weight",s.Emu)??"1px"}}function ke(e){return e.split(",")}class ve extends z{constructor(){super(...arguments),this.type=C.Comment}}class Se extends z{constructor(e){super(),this.id=e,this.type=C.CommentReference}}class Pe extends z{constructor(e){super(),this.id=e,this.type=C.CommentRangeStart}}class we extends z{constructor(e){super(),this.id=e,this.type=C.CommentRangeEnd}}var xe="inherit",Ce="black",Ne="black",Me="transparent";const Ae=[],Te={oMath:C.MmlMath,oMathPara:C.MmlMathParagraph,f:C.MmlFraction,func:C.MmlFunction,fName:C.MmlFunctionName,num:C.MmlNumerator,den:C.MmlDenominator,rad:C.MmlRadical,deg:C.MmlDegree,e:C.MmlBase,sSup:C.MmlSuperscript,sSub:C.MmlSubscript,sPre:C.MmlPreSubSuper,sup:C.MmlSuperArgument,sub:C.MmlSubArgument,d:C.MmlDelimiter,nary:C.MmlNary,eqArr:C.MmlEquationArray,lim:C.MmlLimit,limLow:C.MmlLimitLower,m:C.MmlMatrix,mr:C.MmlMatrixRow,box:C.MmlBox,bar:C.MmlBar,groupChr:C.MmlGroupChar};class Ee{constructor(e){this.options={ignoreWidth:!1,debug:!1,...e}}parseNotes(e,t,r){var a=[];for(let s of i.elements(e,t)){const e=new r;e.id=i.attr(s,"id"),e.noteType=i.attr(s,"type"),e.children=this.parseBodyElements(s),a.push(e)}return a}parseComments(e){var t=[];for(let r of i.elements(e,"comment")){const e=new ve;e.id=i.attr(r,"id"),e.author=i.attr(r,"author"),e.initials=i.attr(r,"initials"),e.date=i.attr(r,"date"),e.children=this.parseBodyElements(r),t.push(e)}return t}parseDocumentFile(e){var t=i.element(e,"body"),r=i.element(e,"background"),a=i.element(t,"sectPr");return{type:C.Document,children:this.parseBodyElements(t),props:a?N(a,i):{},cssStyle:r?this.parseBackground(r):{}}}parseBackground(e){var t={},r=De.colorAttr(e,"color");return r&&(t["background-color"]=r),t}parseBodyElements(e){var t=[];for(let r of i.elements(e))switch(r.localName){case"p":t.push(this.parseParagraph(r));break;case"tbl":t.push(this.parseTable(r));break;case"sdt":t.push(...this.parseSdt(r,(e=>this.parseBodyElements(e))))}return t}parseStylesFile(e){var t=[];return De.foreach(e,(e=>{switch(e.localName){case"style":t.push(this.parseStyle(e));break;case"docDefaults":t.push(this.parseDefaultStyles(e))}})),t}parseDefaultStyles(e){var t={id:null,name:null,target:null,basedOn:null,styles:[]};return De.foreach(e,(e=>{switch(e.localName){case"rPrDefault":var r=i.element(e,"rPr");r&&t.styles.push({target:"span",values:this.parseDefaultProperties(r,{})});break;case"pPrDefault":var a=i.element(e,"pPr");a&&t.styles.push({target:"p",values:this.parseDefaultProperties(a,{})})}})),t}parseStyle(e){var t={id:i.attr(e,"styleId"),isDefault:i.boolAttr(e,"default"),name:null,target:null,basedOn:null,styles:[],linked:null};switch(i.attr(e,"type")){case"paragraph":t.target="p";break;case"table":t.target="table";break;case"character":t.target="span"}return De.foreach(e,(e=>{switch(e.localName){case"basedOn":t.basedOn=i.attr(e,"val");break;case"name":t.name=i.attr(e,"val");break;case"link":t.linked=i.attr(e,"val");break;case"next":t.next=i.attr(e,"val");break;case"aliases":t.aliases=i.attr(e,"val").split(",");break;case"pPr":t.styles.push({target:"p",values:this.parseDefaultProperties(e,{})}),t.paragraphProps=D(e,i);break;case"rPr":t.styles.push({target:"span",values:this.parseDefaultProperties(e,{})}),t.runProps=E(e,i);break;case"tblPr":case"tcPr":t.styles.push({target:"td",values:this.parseDefaultProperties(e,{})});break;case"tblStylePr":for(let r of this.parseTableStyle(e))t.styles.push(r);break;case"rsid":case"qFormat":case"hidden":case"semiHidden":case"unhideWhenUsed":case"autoRedefine":case"uiPriority":break;default:this.options.debug&&console.warn(`DOCX: Unknown style element: ${e.localName}`)}})),t}parseTableStyle(e){var t=[],r=i.attr(e,"type"),a="",s="";switch(r){case"firstRow":s=".first-row",a="tr.first-row td";break;case"lastRow":s=".last-row",a="tr.last-row td";break;case"firstCol":s=".first-col",a="td.first-col";break;case"lastCol":s=".last-col",a="td.last-col";break;case"band1Vert":s=":not(.no-vband)",a="td.odd-col";break;case"band2Vert":s=":not(.no-vband)",a="td.even-col";break;case"band1Horz":s=":not(.no-hband)",a="tr.odd-row";break;case"band2Horz":s=":not(.no-hband)",a="tr.even-row";break;default:return[]}return De.foreach(e,(e=>{switch(e.localName){case"pPr":t.push({target:`${a} p`,mod:s,values:this.parseDefaultProperties(e,{})});break;case"rPr":t.push({target:`${a} span`,mod:s,values:this.parseDefaultProperties(e,{})});break;case"tblPr":case"tcPr":t.push({target:a,mod:s,values:this.parseDefaultProperties(e,{})})}})),t}parseNumberingFile(e){var t=[],r={},a=[];return De.foreach(e,(e=>{switch(e.localName){case"abstractNum":this.parseAbstractNumbering(e,a).forEach((e=>t.push(e)));break;case"numPicBullet":a.push(this.parseNumberingPicBullet(e));break;case"num":var s=i.attr(e,"numId"),n=i.elementAttr(e,"abstractNumId","val");r[n]=s}})),t.forEach((e=>e.id=r[e.id])),t}parseNumberingPicBullet(e){var t=i.element(e,"pict"),r=t&&i.element(t,"shape"),a=r&&i.element(r,"imagedata");return a?{id:i.intAttr(e,"numPicBulletId"),src:i.attr(a,"id"),style:i.attr(r,"style")}:null}parseAbstractNumbering(e,t){var r=[],a=i.attr(e,"abstractNumId");return De.foreach(e,(e=>{if("lvl"===e.localName)r.push(this.parseNumberingLevel(a,e,t))})),r}parseNumberingLevel(e,t,r){var a={id:e,level:i.intAttr(t,"ilvl"),start:1,pStyleName:void 0,pStyle:{},rStyle:{},suff:"tab"};return De.foreach(t,(e=>{switch(e.localName){case"start":a.start=i.intAttr(e,"val");break;case"pPr":this.parseDefaultProperties(e,a.pStyle);break;case"rPr":this.parseDefaultProperties(e,a.rStyle);break;case"lvlPicBulletId":var t=i.intAttr(e,"val");a.bullet=r.find((e=>e?.id==t));break;case"lvlText":a.levelText=i.attr(e,"val");break;case"pStyle":a.pStyleName=i.attr(e,"val");break;case"numFmt":a.format=i.attr(e,"val");break;case"suff":a.suff=i.attr(e,"val")}})),a}parseSdt(e,t){const r=i.element(e,"sdtContent");return r?t(r):[]}parseInserted(e,t){return{type:C.Inserted,children:t(e)?.children??[]}}parseDeleted(e,t){return{type:C.Deleted,children:t(e)?.children??[]}}parseParagraph(e){var t,r,a={type:C.Paragraph,children:[]};for(let s of i.elements(e))switch(s.localName){case"pPr":this.parseParagraphProperties(s,a);break;case"r":a.children.push(this.parseRun(s,a));break;case"hyperlink":a.children.push(this.parseHyperlink(s,a));break;case"smartTag":a.children.push(this.parseSmartTag(s,a));break;case"bookmarkStart":a.children.push((t=s,r=i,{type:C.BookmarkStart,id:r.attr(t,"id"),name:r.attr(t,"name"),colFirst:r.intAttr(t,"colFirst"),colLast:r.intAttr(t,"colLast")}));break;case"bookmarkEnd":a.children.push(fe(s,i));break;case"commentRangeStart":a.children.push(new Pe(i.attr(s,"id")));break;case"commentRangeEnd":a.children.push(new we(i.attr(s,"id")));break;case"oMath":case"oMathPara":a.children.push(this.parseMathElement(s));break;case"sdt":a.children.push(...this.parseSdt(s,(e=>this.parseParagraph(e).children)));break;case"ins":a.children.push(this.parseInserted(s,(e=>this.parseParagraph(e))));break;case"del":a.children.push(this.parseDeleted(s,(e=>this.parseParagraph(e))))}return a}parseParagraphProperties(e,t){this.parseDefaultProperties(e,t.cssStyle={},null,(e=>{if(B(e,t,i))return!0;switch(e.localName){case"pStyle":t.styleName=i.attr(e,"val");break;case"cnfStyle":t.className=Be.classNameOfCnfStyle(e);break;case"framePr":this.parseFrame(e,t);break;case"rPr":break;default:return!1}return!0}))}parseFrame(e,t){"drop"==i.attr(e,"dropCap")&&(t.cssStyle.float="left")}parseHyperlink(e,t){var r={type:C.Hyperlink,parent:t,children:[]},a=i.attr(e,"anchor"),s=i.attr(e,"id");return a&&(r.href="#"+a),s&&(r.id=s),De.foreach(e,(e=>{if("r"===e.localName)r.children.push(this.parseRun(e,r))})),r}parseSmartTag(e,t){var r={type:C.SmartTag,parent:t,children:[]},a=i.attr(e,"uri"),s=i.attr(e,"element");return a&&(r.uri=a),s&&(r.element=s),De.foreach(e,(e=>{if("r"===e.localName)r.children.push(this.parseRun(e,r))})),r}parseRun(e,t){var r={type:C.Run,parent:t,children:[]};return De.foreach(e,(e=>{switch((e=this.checkAlternateContent(e)).localName){case"t":r.children.push({type:C.Text,text:e.textContent});break;case"delText":r.children.push({type:C.DeletedText,text:e.textContent});break;case"commentReference":r.children.push(new Se(i.attr(e,"id")));break;case"fldSimple":r.children.push({type:C.SimpleField,instruction:i.attr(e,"instr"),lock:i.boolAttr(e,"lock",!1),dirty:i.boolAttr(e,"dirty",!1)});break;case"instrText":r.fieldRun=!0,r.children.push({type:C.Instruction,text:e.textContent});break;case"fldChar":r.fieldRun=!0,r.children.push({type:C.ComplexField,charType:i.attr(e,"fldCharType"),lock:i.boolAttr(e,"lock",!1),dirty:i.boolAttr(e,"dirty",!1)});break;case"noBreakHyphen":r.children.push({type:C.NoBreakHyphen});break;case"br":r.children.push({type:C.Break,break:i.attr(e,"type")||"textWrapping"});break;case"lastRenderedPageBreak":r.children.push({type:C.Break,break:"lastRenderedPageBreak"});break;case"sym":r.children.push({type:C.Symbol,font:i.attr(e,"font"),char:i.attr(e,"char")});break;case"tab":r.children.push({type:C.Tab});break;case"footnoteReference":r.children.push({type:C.FootnoteReference,id:i.attr(e,"id")});break;case"endnoteReference":r.children.push({type:C.EndnoteReference,id:i.attr(e,"id")});break;case"drawing":let t=this.parseDrawing(e);t&&(r.children=[t]);break;case"pict":r.children.push(this.parseVmlPicture(e));break;case"rPr":this.parseRunProperties(e,r)}})),r}parseMathElement(e){const t=`${e.localName}Pr`,r={type:Te[e.localName],children:[]};for(const s of i.elements(e)){if(Te[s.localName])r.children.push(this.parseMathElement(s));else if("r"==s.localName){var a=this.parseRun(s);a.type=C.MmlRun,r.children.push(a)}else s.localName==t&&(r.props=this.parseMathProperies(s))}return r}parseMathProperies(e){const t={};for(const r of i.elements(e))switch(r.localName){case"chr":t.char=i.attr(r,"val");break;case"vertJc":t.verticalJustification=i.attr(r,"val");break;case"pos":t.position=i.attr(r,"val");break;case"degHide":t.hideDegree=i.boolAttr(r,"val");break;case"begChr":t.beginChar=i.attr(r,"val");break;case"endChr":t.endChar=i.attr(r,"val")}return t}parseRunProperties(e,t){this.parseDefaultProperties(e,t.cssStyle={},null,(e=>{switch(e.localName){case"rStyle":t.styleName=i.attr(e,"val");break;case"vertAlign":t.verticalAlign=Be.valueOfVertAlign(e,!0);break;default:return!1}return!0}))}parseVmlPicture(e){const t={type:C.VmlPicture,children:[]};for(const r of i.elements(e)){const e=be(r,this);e&&t.children.push(e)}return t}checkAlternateContent(e){if("AlternateContent"!=e.localName)return e;var t=i.element(e,"Choice");if(t){var r=i.attr(t,"Requires"),a=e.lookupNamespaceURI(r);if(Ae.includes(a))return t.firstElementChild}return i.element(e,"Fallback")?.firstElementChild}parseDrawing(e){for(var t of i.elements(e))switch(t.localName){case"inline":case"anchor":return this.parseDrawingWrapper(t)}}parseDrawingWrapper(e){var t={type:C.Drawing,children:[],cssStyle:{}},r="anchor"==e.localName;let a=null,n=i.boolAttr(e,"simplePos");i.boolAttr(e,"behindDoc");let l={relative:"page",align:"left",offset:"0"},o={relative:"page",align:"top",offset:"0"};for(var c of i.elements(e))switch(c.localName){case"simplePos":n&&(l.offset=i.lengthAttr(c,"x",s.Emu),o.offset=i.lengthAttr(c,"y",s.Emu));break;case"extent":t.cssStyle.width=i.lengthAttr(c,"cx",s.Emu),t.cssStyle.height=i.lengthAttr(c,"cy",s.Emu);break;case"positionH":case"positionV":if(!n){let e="positionH"==c.localName?l:o;var h=i.element(c,"align"),m=i.element(c,"posOffset");e.relative=i.attr(c,"relativeFrom")??e.relative,h&&(e.align=h.textContent),m&&(e.offset=De.sizeValue(m,s.Emu))}break;case"wrapTopAndBottom":a="wrapTopAndBottom";break;case"wrapNone":a="wrapNone";break;case"graphic":var u=this.parseGraphic(c);u&&t.children.push(u)}return"wrapTopAndBottom"==a?(t.cssStyle.display="block",l.align&&(t.cssStyle["text-align"]=l.align,t.cssStyle.width="100%")):"wrapNone"==a?(t.cssStyle.display="block",t.cssStyle.position="relative",t.cssStyle.width="0px",t.cssStyle.height="0px",l.offset&&(t.cssStyle.left=l.offset),o.offset&&(t.cssStyle.top=o.offset)):!r||"left"!=l.align&&"right"!=l.align||(t.cssStyle.float=l.align),t}parseGraphic(e){var t=i.element(e,"graphicData");for(let e of i.elements(t))if("pic"===e.localName)return this.parsePicture(e);return null}parsePicture(e){var t={type:C.Image,src:"",cssStyle:{}},r=i.element(e,"blipFill"),a=i.element(r,"blip");t.src=i.attr(a,"embed");var n=i.element(e,"spPr"),l=i.element(n,"xfrm");for(var o of(t.cssStyle.position="relative",i.elements(l)))switch(o.localName){case"ext":t.cssStyle.width=i.lengthAttr(o,"cx",s.Emu),t.cssStyle.height=i.lengthAttr(o,"cy",s.Emu);break;case"off":t.cssStyle.left=i.lengthAttr(o,"x",s.Emu),t.cssStyle.top=i.lengthAttr(o,"y",s.Emu)}return t}parseTable(e){var t={type:C.Table,children:[]};return De.foreach(e,(e=>{switch(e.localName){case"tr":t.children.push(this.parseTableRow(e));break;case"tblGrid":t.columns=this.parseTableColumns(e);break;case"tblPr":this.parseTableProperties(e,t)}})),t}parseTableColumns(e){var t=[];return De.foreach(e,(e=>{if("gridCol"===e.localName)t.push({width:i.lengthAttr(e,"w")})})),t}parseTableProperties(e,t){switch(t.cssStyle={},t.cellStyle={},this.parseDefaultProperties(e,t.cssStyle,t.cellStyle,(e=>{switch(e.localName){case"tblStyle":t.styleName=i.attr(e,"val");break;case"tblLook":t.className=Be.classNameOftblLook(e);break;case"tblpPr":this.parseTablePosition(e,t);break;case"tblStyleColBandSize":t.colBandSize=i.intAttr(e,"val");break;case"tblStyleRowBandSize":t.rowBandSize=i.intAttr(e,"val");break;default:return!1}return!0})),t.cssStyle["text-align"]){case"center":delete t.cssStyle["text-align"],t.cssStyle["margin-left"]="auto",t.cssStyle["margin-right"]="auto";break;case"right":delete t.cssStyle["text-align"],t.cssStyle["margin-left"]="auto"}}parseTablePosition(e,t){var r=i.lengthAttr(e,"topFromText"),a=i.lengthAttr(e,"bottomFromText"),s=i.lengthAttr(e,"rightFromText"),n=i.lengthAttr(e,"leftFromText");t.cssStyle.float="left",t.cssStyle["margin-bottom"]=Be.addSize(t.cssStyle["margin-bottom"],a),t.cssStyle["margin-left"]=Be.addSize(t.cssStyle["margin-left"],n),t.cssStyle["margin-right"]=Be.addSize(t.cssStyle["margin-right"],s),t.cssStyle["margin-top"]=Be.addSize(t.cssStyle["margin-top"],r)}parseTableRow(e){var t={type:C.Row,children:[]};return De.foreach(e,(e=>{switch(e.localName){case"tc":t.children.push(this.parseTableCell(e));break;case"trPr":this.parseTableRowProperties(e,t)}})),t}parseTableRowProperties(e,t){t.cssStyle=this.parseDefaultProperties(e,{},null,(e=>{switch(e.localName){case"cnfStyle":t.className=Be.classNameOfCnfStyle(e);break;case"tblHeader":t.isHeader=i.boolAttr(e,"val");break;default:return!1}return!0}))}parseTableCell(e){var t={type:C.Cell,children:[]};return De.foreach(e,(e=>{switch(e.localName){case"tbl":t.children.push(this.parseTable(e));break;case"p":t.children.push(this.parseParagraph(e));break;case"tcPr":this.parseTableCellProperties(e,t)}})),t}parseTableCellProperties(e,t){t.cssStyle=this.parseDefaultProperties(e,{},null,(e=>{switch(e.localName){case"gridSpan":t.span=i.intAttr(e,"val",null);break;case"vMerge":t.verticalMerge=i.attr(e,"val")??"continue";break;case"cnfStyle":t.className=Be.classNameOfCnfStyle(e);break;default:return!1}return!0}))}parseDefaultProperties(e,t=null,r=null,a=null){return t=t||{},De.foreach(e,(n=>{if(!a?.(n))switch(n.localName){case"jc":t["text-align"]=Be.valueOfJc(n);break;case"textAlignment":t["vertical-align"]=Be.valueOfTextAlignment(n);break;case"color":t.color=De.colorAttr(n,"val",null,Ce);break;case"sz":t["font-size"]=t["min-height"]=i.lengthAttr(n,"val",s.FontSize);break;case"shd":t["background-color"]=De.colorAttr(n,"fill",null,xe);break;case"highlight":t["background-color"]=De.colorAttr(n,"val",null,Me);break;case"vertAlign":break;case"position":t.verticalAlign=i.lengthAttr(n,"val",s.FontSize);break;case"tcW":if(this.options.ignoreWidth)break;case"tblW":t.width=Be.valueOfSize(n,"w");break;case"trHeight":this.parseTrHeight(n,t);break;case"strike":t["text-decoration"]=i.boolAttr(n,"val",!0)?"line-through":"none";break;case"b":t["font-weight"]=i.boolAttr(n,"val",!0)?"bold":"normal";break;case"i":t["font-style"]=i.boolAttr(n,"val",!0)?"italic":"normal";break;case"caps":t["text-transform"]=i.boolAttr(n,"val",!0)?"uppercase":"none";break;case"smallCaps":t["font-variant"]=i.boolAttr(n,"val",!0)?"small-caps":"none";break;case"u":this.parseUnderline(n,t);break;case"ind":case"tblInd":this.parseIndentation(n,t);break;case"rFonts":this.parseFont(n,t);break;case"tblBorders":this.parseBorderProperties(n,r||t);break;case"tblCellSpacing":t["border-spacing"]=Be.valueOfMargin(n),t["border-collapse"]="separate";break;case"pBdr":this.parseBorderProperties(n,t);break;case"bdr":t.border=Be.valueOfBorder(n);break;case"tcBorders":this.parseBorderProperties(n,t);break;case"vanish":i.boolAttr(n,"val",!0)&&(t.display="none");break;case"kern":case"noWrap":break;case"tblCellMar":case"tcMar":this.parseMarginProperties(n,r||t);break;case"tblLayout":t["table-layout"]=Be.valueOfTblLayout(n);break;case"vAlign":t["vertical-align"]=Be.valueOfTextAlignment(n);break;case"spacing":"pPr"==e.localName&&this.parseSpacing(n,t);break;case"wordWrap":i.boolAttr(n,"val")&&(t["overflow-wrap"]="break-word");break;case"suppressAutoHyphens":t.hyphens=i.boolAttr(n,"val",!0)?"none":"auto";break;case"lang":t.$lang=i.attr(n,"val");break;case"bCs":case"iCs":case"szCs":case"tabs":case"outlineLvl":case"contextualSpacing":case"tblStyleColBandSize":case"tblStyleRowBandSize":case"webHidden":case"pageBreakBefore":case"suppressLineNumbers":case"keepLines":case"keepNext":case"widowControl":case"bidi":case"rtl":case"noProof":break;default:this.options.debug&&console.warn(`DOCX: Unknown document element: ${e.localName}.${n.localName}`)}})),t}parseUnderline(e,t){var r=i.attr(e,"val");if(null!=r){switch(r){case"dash":case"dashDotDotHeavy":case"dashDotHeavy":case"dashedHeavy":case"dashLong":case"dashLongHeavy":case"dotDash":case"dotDotDash":t["text-decoration"]="underline dashed";break;case"dotted":case"dottedHeavy":t["text-decoration"]="underline dotted";break;case"double":t["text-decoration"]="underline double";break;case"single":case"thick":case"words":t["text-decoration"]="underline";break;case"wave":case"wavyDouble":case"wavyHeavy":t["text-decoration"]="underline wavy";break;case"none":t["text-decoration"]="none"}var a=De.colorAttr(e,"color");a&&(t["text-decoration-color"]=a)}}parseFont(e,t){var r=[i.attr(e,"ascii"),Be.themeValue(e,"asciiTheme")].filter((e=>e)).join(", ");r.length>0&&(t["font-family"]=r)}parseIndentation(e,t){var r=i.lengthAttr(e,"firstLine"),a=i.lengthAttr(e,"hanging"),s=i.lengthAttr(e,"left"),n=i.lengthAttr(e,"start"),l=i.lengthAttr(e,"right"),o=i.lengthAttr(e,"end");r&&(t["text-indent"]=r),a&&(t["text-indent"]=`-${a}`),(s||n)&&(t["margin-left"]=s||n),(l||o)&&(t["margin-right"]=l||o)}parseSpacing(e,t){var r=i.lengthAttr(e,"before"),a=i.lengthAttr(e,"after"),s=i.intAttr(e,"line",null),n=i.attr(e,"lineRule");if(r&&(t["margin-top"]=r),a&&(t["margin-bottom"]=a),null!==s)switch(n){case"auto":t["line-height"]=`${(s/240).toFixed(2)}`;break;case"atLeast":t["line-height"]=`calc(100% + ${s/20}pt)`;break;default:t["line-height"]=t["min-height"]=s/20+"pt"}}parseMarginProperties(e,t){De.foreach(e,(e=>{switch(e.localName){case"left":t["padding-left"]=Be.valueOfMargin(e);break;case"right":t["padding-right"]=Be.valueOfMargin(e);break;case"top":t["padding-top"]=Be.valueOfMargin(e);break;case"bottom":t["padding-bottom"]=Be.valueOfMargin(e)}}))}parseTrHeight(e,t){i.attr(e,"hRule"),t.height=i.lengthAttr(e,"val")}parseBorderProperties(e,t){De.foreach(e,(e=>{switch(e.localName){case"start":case"left":t["border-left"]=Be.valueOfBorder(e);break;case"end":case"right":t["border-right"]=Be.valueOfBorder(e);break;case"top":t["border-top"]=Be.valueOfBorder(e);break;case"bottom":t["border-bottom"]=Be.valueOfBorder(e)}}))}}const Re=["black","blue","cyan","darkBlue","darkCyan","darkGray","darkGreen","darkMagenta","darkRed","darkYellow","green","lightGray","magenta","none","red","white","yellow"];class De{static foreach(e,t){for(var r=0;r<e.childNodes.length;r++){let a=e.childNodes[r];a.nodeType==Node.ELEMENT_NODE&&t(a)}}static colorAttr(e,t,r=null,a="black"){var s=i.attr(e,t);if(s)return"auto"==s?a:Re.includes(s)?s:`#${s}`;var n=i.attr(e,"themeColor");return n?`var(--docx-${n}-color)`:r}static sizeValue(e,t=s.Dxa){return n(e.textContent,t)}}class Be{static themeValue(e,t){var r=i.attr(e,t);return r?`var(--docx-${r}-font)`:null}static valueOfSize(e,t){var r=s.Dxa;switch(i.attr(e,"type")){case"dxa":break;case"pct":r=s.Percent;break;case"auto":return"auto"}return i.lengthAttr(e,t,r)}static valueOfMargin(e){return i.lengthAttr(e,"w")}static valueOfBorder(e){if("nil"==i.attr(e,"val"))return"none";var t=De.colorAttr(e,"color");return`${i.lengthAttr(e,"sz",s.Border)} solid ${"auto"==t?Ne:t}`}static valueOfTblLayout(e){return"fixed"==i.attr(e,"val")?"fixed":"auto"}static classNameOfCnfStyle(e){const t=i.attr(e,"val");return["first-row","last-row","first-col","last-col","odd-col","even-col","odd-row","even-row","ne-cell","nw-cell","se-cell","sw-cell"].filter(((e,r)=>"1"==t[r])).join(" ")}static valueOfJc(e){var t=i.attr(e,"val");switch(t){case"start":case"left":return"left";case"center":return"center";case"end":case"right":return"right";case"both":return"justify"}return t}static valueOfVertAlign(e,t=!1){var r=i.attr(e,"val");switch(r){case"subscript":return"sub";case"superscript":return t?"sup":"super"}return t?null:r}static valueOfTextAlignment(e){var t=i.attr(e,"val");switch(t){case"auto":case"baseline":return"baseline";case"top":return"top";case"center":return"middle";case"bottom":return"bottom"}return t}static addSize(e,t){return null==e?t:null==t?e:`calc(${e} + ${t})`}static classNameOftblLook(e){const t=i.hexAttr(e,"val",0);let r="";return(i.boolAttr(e,"firstRow")||32&t)&&(r+=" first-row"),(i.boolAttr(e,"lastRow")||64&t)&&(r+=" last-row"),(i.boolAttr(e,"firstColumn")||128&t)&&(r+=" first-col"),(i.boolAttr(e,"lastColumn")||256&t)&&(r+=" last-col"),(i.boolAttr(e,"noHBand")||512&t)&&(r+=" no-hband"),(i.boolAttr(e,"noVBand")||1024&t)&&(r+=" no-vband"),r.trim()}}const Fe={pos:0,leader:"none",style:"left"};function $e(e,t,r,a=.75){const s=e.closest("p"),n=e.getBoundingClientRect(),l=s.getBoundingClientRect(),o=getComputedStyle(s),i=t?.length>0?t.map((e=>({pos:Ie(e.position),leader:e.leader,style:e.style}))).sort(((e,t)=>e.pos-t.pos)):[Fe],c=i[i.length-1],h=l.width*a,m=Ie(r);let u=c.pos+m;if(u<h)for(;u<h&&i.length<50;u+=m)i.push({...Fe,pos:u});const p=parseFloat(o.marginLeft),d=l.left+p,f=(n.left-d)*a,g=i.find((e=>"clear"!=e.style&&e.pos>f));if(null==g)return;let b=1;if("right"==g.style||"center"==g.style){const t=Array.from(s.querySelectorAll(`.${e.className}`)),r=t.indexOf(e)+1,n=document.createRange();n.setStart(e,1),r<t.length?n.setEndBefore(t[r]):n.setEndAfter(s);const o="center"==g.style?.5:1,i=n.getBoundingClientRect(),c=i.left+o*i.width-(l.left-p);b=g.pos-c*a}else b=g.pos-f;switch(e.innerHTML="&nbsp;",e.style.textDecoration="inherit",e.style.wordSpacing=`${b.toFixed(0)}pt`,g.leader){case"dot":case"middleDot":e.style.textDecoration="underline",e.style.textDecorationStyle="dotted";break;case"hyphen":case"heavy":case"underscore":e.style.textDecoration="underline"}}function Ie(e){return parseFloat(e)}const Le="http://www.w3.org/2000/svg",Oe="http://www.w3.org/1998/Math/MathML";class He{constructor(e){this.htmlDocument=e,this.className="docx",this.styleMap={},this.currentPart=null,this.tableVerticalMerges=[],this.currentVerticalMerge=null,this.tableCellPositions=[],this.currentCellPosition=null,this.footnoteMap={},this.endnoteMap={},this.currentEndnoteIds=[],this.usedHederFooterParts=[],this.currentTabs=[],this.tabsTimeout=0,this.commentMap={},this.tasks=[],this.postRenderTasks=[],this.createElement=_e}render(e,t,r=null,a){this.document=e,this.options=a,this.className=a.className,this.rootSelector=a.inWrapper?`.${this.className}-wrapper`:":root",this.styleMap=null,this.tasks=[],this.options.renderComments&&Highlight&&(this.commentHighlight=new Highlight),je(r=r||t),je(t),Ue(r,"docxjs library predefined styles"),r.appendChild(this.renderDefaultStyle()),e.themePart&&(Ue(r,"docxjs document theme values"),this.renderTheme(e.themePart,r)),null!=e.stylesPart&&(this.styleMap=this.processStyles(e.stylesPart.styles),Ue(r,"docxjs document styles"),r.appendChild(this.renderStyles(e.stylesPart.styles))),e.numberingPart&&(this.prodessNumberings(e.numberingPart.domNumberings),Ue(r,"docxjs document numbering styles"),r.appendChild(this.renderNumbering(e.numberingPart.domNumberings,r))),e.footnotesPart&&(this.footnoteMap=g(e.footnotesPart.notes,(e=>e.id))),e.endnotesPart&&(this.endnoteMap=g(e.endnotesPart.notes,(e=>e.id))),e.settingsPart&&(this.defaultTabSize=e.settingsPart.settings?.defaultTabStop),!a.ignoreFonts&&e.fontTablePart&&this.renderFontTable(e.fontTablePart,r);var s=this.renderSections(e.documentPart.body);this.options.inWrapper?t.appendChild(this.renderWrapper(s)):We(t,s),this.commentHighlight&&a.renderComments&&CSS.highlights.set(`${this.className}-comments`,this.commentHighlight),this.refreshTabStops(),this.postRenderTasks.forEach((e=>e()))}renderTheme(e,t){const r={},a=e.theme?.fontScheme;a&&(a.majorFont&&(r["--docx-majorHAnsi-font"]=a.majorFont.latinTypeface),a.minorFont&&(r["--docx-minorHAnsi-font"]=a.minorFont.latinTypeface));const s=e.theme?.colorScheme;if(s)for(let[e,t]of Object.entries(s.colors))r[`--docx-${e}-color`]=`#${t}`;const n=this.styleToString(`.${this.className}`,r);t.appendChild(Xe(n))}renderFontTable(e,t){for(let r of e.fonts)for(let e of r.embedFontRefs)this.tasks.push(this.document.loadFont(e.id,e.key).then((a=>{const s={"font-family":r.name,src:`url(${a})`};"bold"!=e.type&&"boldItalic"!=e.type||(s["font-weight"]="bold"),"italic"!=e.type&&"boldItalic"!=e.type||(s["font-style"]="italic"),Ue(t,`docxjs ${r.name} font`);const n=this.styleToString("@font-face",s);t.appendChild(Xe(n)),this.refreshTabStops()})))}processStyleName(e){return e?`${this.className}_${function(e){return e?.replace(/[ .]+/g,"-").replace(/[&]+/g,"and").toLowerCase()}(e)}`:this.className}processStyles(e){const t=g(e.filter((e=>null!=e.id)),(e=>e.id));for(const a of e.filter((e=>e.basedOn))){var r=t[a.basedOn];if(r){a.paragraphProps=y(a.paragraphProps,r.paragraphProps),a.runProps=y(a.runProps,r.runProps);for(const e of r.styles){const t=a.styles.find((t=>t.target==e.target));t?this.copyStyleProperties(e.values,t.values):a.styles.push({...e,values:{...e.values}})}}else this.options.debug&&console.warn(`Can\'t find base style ${a.basedOn}`)}for(let t of e)t.cssName=this.processStyleName(t.id);return t}prodessNumberings(e){for(let t of e.filter((e=>e.pStyleName))){const e=this.findStyle(t.pStyleName);e?.paragraphProps?.numbering&&(e.paragraphProps.numbering.level=t.level)}}processElement(e){if(e.children)for(var t of e.children)t.parent=e,t.type==C.Table?this.processTable(t):this.processElement(t)}processTable(e){for(var t of e.children)for(var r of t.children)r.cssStyle=this.copyStyleProperties(e.cellStyle,r.cssStyle,["border-left","border-right","border-top","border-bottom","padding-left","padding-right","padding-top","padding-bottom"]),this.processElement(r)}copyStyleProperties(e,t,r=null){if(!e)return t;for(var a of(null==t&&(t={}),null==r&&(r=Object.getOwnPropertyNames(e)),r))e.hasOwnProperty(a)&&!t.hasOwnProperty(a)&&(t[a]=e[a]);return t}createPageElement(e,t){var r=this.createElement("section",{className:e});return t&&(t.pageMargins&&(r.style.paddingLeft=t.pageMargins.left,r.style.paddingRight=t.pageMargins.right,r.style.paddingTop=t.pageMargins.top,r.style.paddingBottom=t.pageMargins.bottom),t.pageSize&&(this.options.ignoreWidth||(r.style.width=t.pageSize.width),this.options.ignoreHeight||(r.style.minHeight=t.pageSize.height))),r}createSectionContent(e){var t=this.createElement("article");return e.columns&&e.columns.numberOfColumns&&(t.style.columnCount=`${e.columns.numberOfColumns}`,t.style.columnGap=e.columns.space,e.columns.separator&&(t.style.columnRule="1px solid black")),t}renderSections(e){const t=[];this.processElement(e);const r=this.splitBySection(e.children,e.props),a=this.groupByPageBreaks(r);let s=null;for(let r=0,l=a.length;r<l;r++){this.currentFootnoteIds=[];let o=a[r][0].sectProps;const i=this.createPageElement(this.className,o);this.renderStyleValues(e.cssStyle,i),this.options.renderHeaders&&this.renderHeaderFooter(o.headerRefs,o,t.length,s!=o,i);for(const e of a[r]){var n=this.createSectionContent(e.sectProps);this.renderElements(e.elements,n),i.appendChild(n),o=e.sectProps}this.options.renderFootnotes&&this.renderNotes(this.currentFootnoteIds,this.footnoteMap,i),this.options.renderEndnotes&&r==l-1&&this.renderNotes(this.currentEndnoteIds,this.endnoteMap,i),this.options.renderFooters&&this.renderHeaderFooter(o.footerRefs,o,t.length,s!=o,i),t.push(i),s=o}return t}renderHeaderFooter(e,t,r,a,s){if(e){var n=(t.titlePage&&a?e.find((e=>"first"==e.type)):null)??(r%2==1?e.find((e=>"even"==e.type)):null)??e.find((e=>"default"==e.type)),l=n&&this.document.findPartByRelId(n.id,this.document.documentPart);if(l){this.currentPart=l,this.usedHederFooterParts.includes(l.path)||(this.processElement(l.rootElement),this.usedHederFooterParts.push(l.path));const[e]=this.renderElements([l.rootElement],s);t?.pageMargins&&(l.rootElement.type===C.Header?(e.style.marginTop=`calc(${t.pageMargins.header} - ${t.pageMargins.top})`,e.style.minHeight=`calc(${t.pageMargins.top} - ${t.pageMargins.header})`):l.rootElement.type===C.Footer&&(e.style.marginBottom=`calc(${t.pageMargins.footer} - ${t.pageMargins.bottom})`,e.style.minHeight=`calc(${t.pageMargins.bottom} - ${t.pageMargins.footer})`)),this.currentPart=null}}}isPageBreakElement(e){return e.type==C.Break&&("lastRenderedPageBreak"==e.break?!this.options.ignoreLastRenderedPageBreak:"page"==e.break)}isPageBreakSection(e,t){return!!e&&(!!t&&(e.pageSize?.orientation!=t.pageSize?.orientation||e.pageSize?.width!=t.pageSize?.width||e.pageSize?.height!=t.pageSize?.height))}splitBySection(e,t){var r={sectProps:null,elements:[],pageBreak:!1},a=[r];for(let t of e){if(t.type==C.Paragraph){const e=this.findStyle(t.styleName);e?.paragraphProps?.pageBreakBefore&&(r.sectProps=s,r.pageBreak=!0,r={sectProps:null,elements:[],pageBreak:!1},a.push(r))}if(r.elements.push(t),t.type==C.Paragraph){const e=t;var s=e.sectionProps,n=-1,l=-1;if(this.options.breakPages&&e.children&&(n=e.children.findIndex((e=>-1!=(l=e.children?.findIndex(this.isPageBreakElement.bind(this))??-1)))),(s||-1!=n)&&(r.sectProps=s,r.pageBreak=-1!=n,r={sectProps:null,elements:[],pageBreak:!1},a.push(r)),-1!=n){let a=e.children[n],s=l<a.children.length-1;if(n<e.children.length-1||s){var o=t.children,i={...t,children:o.slice(n)};if(t.children=o.slice(0,n),r.elements.push(i),s){let e=a.children,r={...a,children:e.slice(0,l)};t.children.push(r),a.children=e.slice(l)}}}}}let c=null;for(let e=a.length-1;e>=0;e--)null==a[e].sectProps?a[e].sectProps=c??t:c=a[e].sectProps;return a}groupByPageBreaks(e){let t,r=[];const a=[r];for(let s of e)r.push(s),(this.options.ignoreLastRenderedPageBreak||s.pageBreak||this.isPageBreakSection(t,s.sectProps))&&a.push(r=[]),t=s.sectProps;return a.filter((e=>e.length>0))}renderWrapper(e){return this.createElement("div",{className:`${this.className}-wrapper`},e)}renderDefaultStyle(){var e=this.className,t=`\\n.${e}-wrapper { background: gray; padding: 30px; padding-bottom: 0px; display: flex; flex-flow: column; align-items: center; } \\n.${e}-wrapper>section.${e} { background: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-bottom: 30px; }\\n.${e} { color: black; hyphens: auto; text-underline-position: from-font; }\\nsection.${e} { box-sizing: border-box; display: flex; flex-flow: column nowrap; position: relative; overflow: hidden; }\\nsection.${e}>article { margin-bottom: auto; z-index: 1; }\\nsection.${e}>footer { z-index: 1; }\\n.${e} table { border-collapse: collapse; }\\n.${e} table td, .${e} table th { vertical-align: top; }\\n.${e} p { margin: 0pt; min-height: 1em; }\\n.${e} span { white-space: pre-wrap; overflow-wrap: break-word; }\\n.${e} a { color: inherit; text-decoration: inherit; }\\n.${e} svg { fill: transparent; }\\n`;return this.options.renderComments&&(t+=`\\n.${e}-comment-ref { cursor: default; }\\n.${e}-comment-popover { display: none; z-index: 1000; padding: 0.5rem; background: white; position: absolute; box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.25); width: 30ch; }\\n.${e}-comment-ref:hover~.${e}-comment-popover { display: block; }\\n.${e}-comment-author,.${e}-comment-date { font-size: 0.875rem; color: #888; }\\n`),Xe(t)}renderNumbering(e,t){var r="",a=[];for(var s of e){var n=`p.${this.numberingClass(s.id,s.level)}`,l="none";if(s.bullet){let e=`--${this.className}-${s.bullet.src}`.toLowerCase();r+=this.styleToString(`${n}:before`,{content:"\' \'",display:"inline-block",background:`var(${e})`},s.bullet.style),this.tasks.push(this.document.loadNumberingImage(s.bullet.src).then((r=>{var a=`${this.rootSelector} { ${e}: url(${r}) }`;t.appendChild(Xe(a))})))}else if(s.levelText){let e=this.numberingCounter(s.id,s.level);const t=e+" "+(s.start-1);s.level>0&&(r+=this.styleToString(`p.${this.numberingClass(s.id,s.level-1)}`,{"counter-reset":t})),a.push(t),r+=this.styleToString(`${n}:before`,{content:this.levelTextToContent(s.levelText,s.suff,s.id,this.numFormatToCssValue(s.format)),"counter-increment":e,...s.rStyle})}else l=this.numFormatToCssValue(s.format);r+=this.styleToString(n,{display:"list-item","list-style-position":"inside","list-style-type":l,...s.pStyle})}return a.length>0&&(r+=this.styleToString(this.rootSelector,{"counter-reset":a.join(" ")})),Xe(r)}renderStyles(e){var t="";const r=this.styleMap,a=g(e.filter((e=>e.isDefault)),(e=>e.target));for(const o of e){var s=o.styles;if(o.linked){var n=o.linked&&r[o.linked];n?s=s.concat(n.styles):this.options.debug&&console.warn(`Can\'t find linked style ${o.linked}`)}for(const e of s){var l=`${o.target??""}.${o.cssName}`;o.target!=e.target&&(l+=` ${e.target}`),a[o.target]==o&&(l=`.${this.className} ${o.target}, `+l),t+=this.styleToString(l,e.values)}}return Xe(t)}renderNotes(e,t,r){var a=e.map((e=>t[e])).filter((e=>e));if(a.length>0){var s=this.createElement("ol",null,this.renderElements(a));r.appendChild(s)}}renderElement(e){switch(e.type){case C.Paragraph:return this.renderParagraph(e);case C.BookmarkStart:return this.renderBookmarkStart(e);case C.BookmarkEnd:return null;case C.Run:return this.renderRun(e);case C.Table:return this.renderTable(e);case C.Row:return this.renderTableRow(e);case C.Cell:return this.renderTableCell(e);case C.Hyperlink:return this.renderHyperlink(e);case C.SmartTag:return this.renderSmartTag(e);case C.Drawing:return this.renderDrawing(e);case C.Image:return this.renderImage(e);case C.Text:case C.Text:return this.renderText(e);case C.DeletedText:return this.renderDeletedText(e);case C.Tab:return this.renderTab(e);case C.Symbol:return this.renderSymbol(e);case C.Break:return this.renderBreak(e);case C.Footer:return this.renderContainer(e,"footer");case C.Header:return this.renderContainer(e,"header");case C.Footnote:case C.Endnote:return this.renderContainer(e,"li");case C.FootnoteReference:return this.renderFootnoteReference(e);case C.EndnoteReference:return this.renderEndnoteReference(e);case C.NoBreakHyphen:return this.createElement("wbr");case C.VmlPicture:return this.renderVmlPicture(e);case C.VmlElement:return this.renderVmlElement(e);case C.MmlMath:return this.renderContainerNS(e,Oe,"math",{xmlns:Oe});case C.MmlMathParagraph:return this.renderContainer(e,"span");case C.MmlFraction:return this.renderContainerNS(e,Oe,"mfrac");case C.MmlBase:return this.renderContainerNS(e,Oe,e.parent.type==C.MmlMatrixRow?"mtd":"mrow");case C.MmlNumerator:case C.MmlDenominator:case C.MmlFunction:case C.MmlLimit:case C.MmlBox:return this.renderContainerNS(e,Oe,"mrow");case C.MmlGroupChar:return this.renderMmlGroupChar(e);case C.MmlLimitLower:return this.renderContainerNS(e,Oe,"munder");case C.MmlMatrix:return this.renderContainerNS(e,Oe,"mtable");case C.MmlMatrixRow:return this.renderContainerNS(e,Oe,"mtr");case C.MmlRadical:return this.renderMmlRadical(e);case C.MmlSuperscript:return this.renderContainerNS(e,Oe,"msup");case C.MmlSubscript:return this.renderContainerNS(e,Oe,"msub");case C.MmlDegree:case C.MmlSuperArgument:case C.MmlSubArgument:return this.renderContainerNS(e,Oe,"mn");case C.MmlFunctionName:return this.renderContainerNS(e,Oe,"ms");case C.MmlDelimiter:return this.renderMmlDelimiter(e);case C.MmlRun:return this.renderMmlRun(e);case C.MmlNary:return this.renderMmlNary(e);case C.MmlPreSubSuper:return this.renderMmlPreSubSuper(e);case C.MmlBar:return this.renderMmlBar(e);case C.MmlEquationArray:return this.renderMllList(e);case C.Inserted:return this.renderInserted(e);case C.Deleted:return this.renderDeleted(e);case C.CommentRangeStart:return this.renderCommentRangeStart(e);case C.CommentRangeEnd:return this.renderCommentRangeEnd(e);case C.CommentReference:return this.renderCommentReference(e)}return null}renderChildren(e,t){return this.renderElements(e.children,t)}renderElements(e,t){if(null==e)return null;var r=e.flatMap((e=>this.renderElement(e))).filter((e=>null!=e));return t&&We(t,r),r}renderContainer(e,t,r){return this.createElement(t,r,this.renderChildren(e))}renderContainerNS(e,t,r,a){return Ve(t,r,a,this.renderChildren(e))}renderParagraph(e){var t=this.createElement("p");const r=this.findStyle(e.styleName);e.tabs??(e.tabs=r?.paragraphProps?.tabs),this.renderClass(e,t),this.renderChildren(e,t),this.renderStyleValues(e.cssStyle,t),this.renderCommonProperties(t.style,e);const a=e.numbering??r?.paragraphProps?.numbering;return a&&t.classList.add(this.numberingClass(a.id,a.level)),t}renderRunProperties(e,t){this.renderCommonProperties(e,t)}renderCommonProperties(e,t){null!=t&&(t.color&&(e.color=t.color),t.fontSize&&(e["font-size"]=t.fontSize))}renderHyperlink(e){var t=this.createElement("a");if(this.renderChildren(e,t),this.renderStyleValues(e.cssStyle,t),e.href)t.href=e.href;else if(e.id){const r=this.document.documentPart.rels.find((t=>t.id==e.id&&"External"===t.targetMode));t.href=r?.target}return t}renderSmartTag(e){var t=this.createElement("span");return this.renderChildren(e,t),t}renderCommentRangeStart(e){if(!this.options.renderComments)return null;const t=new Range;this.commentHighlight?.add(t);const r=this.htmlDocument.createComment(`start of comment #${e.id}`);return this.later((()=>t.setStart(r,0))),this.commentMap[e.id]=t,r}renderCommentRangeEnd(e){if(!this.options.renderComments)return null;const t=this.commentMap[e.id],r=this.htmlDocument.createComment(`end of comment #${e.id}`);return this.later((()=>t?.setEnd(r,0))),r}renderCommentReference(e){if(!this.options.renderComments)return null;var t=this.document.commentsPart?.commentMap[e.id];if(!t)return null;const r=new DocumentFragment,a=_e("span",{className:`${this.className}-comment-ref`},["💬"]),s=_e("div",{className:`${this.className}-comment-popover`});return this.renderCommentContent(t,s),r.appendChild(this.htmlDocument.createComment(`comment #${t.id} by ${t.author} on ${t.date}`)),r.appendChild(a),r.appendChild(s),r}renderCommentContent(e,t){t.appendChild(_e("div",{className:`${this.className}-comment-author`},[e.author])),t.appendChild(_e("div",{className:`${this.className}-comment-date`},[new Date(e.date).toLocaleString()])),this.renderChildren(e,t)}renderDrawing(e){var t=this.createElement("div");return t.style.display="inline-block",t.style.position="relative",t.style.textIndent="0px",this.renderChildren(e,t),this.renderStyleValues(e.cssStyle,t),t}renderImage(e){let t=this.createElement("img");return this.renderStyleValues(e.cssStyle,t),this.document&&this.tasks.push(this.document.loadDocumentImage(e.src,this.currentPart).then((e=>{t.src=e}))),t}renderText(e){return this.htmlDocument.createTextNode(e.text)}renderDeletedText(e){return this.options.renderEndnotes?this.htmlDocument.createTextNode(e.text):null}renderBreak(e){return"textWrapping"==e.break?this.createElement("br"):null}renderInserted(e){return this.options.renderChanges?this.renderContainer(e,"ins"):this.renderChildren(e)}renderDeleted(e){return this.options.renderChanges?this.renderContainer(e,"del"):null}renderSymbol(e){var t=this.createElement("span");return t.style.fontFamily=e.font,t.innerHTML=`&#x${e.char};`,t}renderFootnoteReference(e){var t=this.createElement("sup");return this.currentFootnoteIds.push(e.id),t.textContent=`${this.currentFootnoteIds.length}`,t}renderEndnoteReference(e){var t=this.createElement("sup");return this.currentEndnoteIds.push(e.id),t.textContent=`${this.currentEndnoteIds.length}`,t}renderTab(e){var t=this.createElement("span");if(t.innerHTML="&emsp;",this.options.experimental){t.className=this.tabStopClass();var r=function(e,t){var r=e.parent;for(;null!=r&&r.type!=t;)r=r.parent;return r}(e,C.Paragraph)?.tabs;this.currentTabs.push({stops:r,span:t})}return t}renderBookmarkStart(e){var t=this.createElement("span");return t.id=e.name,t}renderRun(e){if(e.fieldRun)return null;const t=this.createElement("span");if(e.id&&(t.id=e.id),this.renderClass(e,t),this.renderStyleValues(e.cssStyle,t),e.verticalAlign){const r=this.createElement(e.verticalAlign);this.renderChildren(e,r),t.appendChild(r)}else this.renderChildren(e,t);return t}renderTable(e){let t=this.createElement("table");return this.tableCellPositions.push(this.currentCellPosition),this.tableVerticalMerges.push(this.currentVerticalMerge),this.currentVerticalMerge={},this.currentCellPosition={col:0,row:0},e.columns&&t.appendChild(this.renderTableColumns(e.columns)),this.renderClass(e,t),this.renderChildren(e,t),this.renderStyleValues(e.cssStyle,t),this.currentVerticalMerge=this.tableVerticalMerges.pop(),this.currentCellPosition=this.tableCellPositions.pop(),t}renderTableColumns(e){let t=this.createElement("colgroup");for(let r of e){let e=this.createElement("col");r.width&&(e.style.width=r.width),t.appendChild(e)}return t}renderTableRow(e){let t=this.createElement("tr");return this.currentCellPosition.col=0,this.renderClass(e,t),this.renderChildren(e,t),this.renderStyleValues(e.cssStyle,t),this.currentCellPosition.row++,t}renderTableCell(e){let t=this.createElement("td");const r=this.currentCellPosition.col;return e.verticalMerge?"restart"==e.verticalMerge?(this.currentVerticalMerge[r]=t,t.rowSpan=1):this.currentVerticalMerge[r]&&(this.currentVerticalMerge[r].rowSpan+=1,t.style.display="none"):this.currentVerticalMerge[r]=null,this.renderClass(e,t),this.renderChildren(e,t),this.renderStyleValues(e.cssStyle,t),e.span&&(t.colSpan=e.span),this.currentCellPosition.col+=t.colSpan,t}renderVmlPicture(e){var t=_e("div");return this.renderChildren(e,t),t}renderVmlElement(e){var t=ze("svg");t.setAttribute("style",e.cssStyleText);const r=this.renderVmlChildElement(e);return e.imageHref?.id&&this.tasks.push(this.document?.loadDocumentImage(e.imageHref.id,this.currentPart).then((e=>r.setAttribute("href",e)))),t.appendChild(r),requestAnimationFrame((()=>{const e=t.firstElementChild.getBBox();t.setAttribute("width",`${Math.ceil(e.x+e.width)}`),t.setAttribute("height",`${Math.ceil(e.y+e.height)}`)})),t}renderVmlChildElement(e){const t=ze(e.tagName);Object.entries(e.attrs).forEach((([e,r])=>t.setAttribute(e,r)));for(let r of e.children)r.type==C.VmlElement?t.appendChild(this.renderVmlChildElement(r)):t.appendChild(...k(this.renderElement(r)));return t}renderMmlRadical(e){const t=e.children.find((e=>e.type==C.MmlBase));if(e.props?.hideDegree)return Ve(Oe,"msqrt",null,this.renderElements([t]));const r=e.children.find((e=>e.type==C.MmlDegree));return Ve(Oe,"mroot",null,this.renderElements([t,r]))}renderMmlDelimiter(e){const t=[];return t.push(Ve(Oe,"mo",null,[e.props.beginChar??"("])),t.push(...this.renderElements(e.children)),t.push(Ve(Oe,"mo",null,[e.props.endChar??")"])),Ve(Oe,"mrow",null,t)}renderMmlNary(e){const t=[],r=g(e.children,(e=>e.type)),a=r[C.MmlSuperArgument],s=r[C.MmlSubArgument],n=a?Ve(Oe,"mo",null,k(this.renderElement(a))):null,l=s?Ve(Oe,"mo",null,k(this.renderElement(s))):null,o=Ve(Oe,"mo",null,[e.props?.char??"∫"]);return n||l?t.push(Ve(Oe,"munderover",null,[o,l,n])):n?t.push(Ve(Oe,"mover",null,[o,n])):l?t.push(Ve(Oe,"munder",null,[o,l])):t.push(o),t.push(...this.renderElements(r[C.MmlBase].children)),Ve(Oe,"mrow",null,t)}renderMmlPreSubSuper(e){const t=[],r=g(e.children,(e=>e.type)),a=r[C.MmlSuperArgument],s=r[C.MmlSubArgument],n=a?Ve(Oe,"mo",null,k(this.renderElement(a))):null,l=s?Ve(Oe,"mo",null,k(this.renderElement(s))):null,o=Ve(Oe,"mo",null);return t.push(Ve(Oe,"msubsup",null,[o,l,n])),t.push(...this.renderElements(r[C.MmlBase].children)),Ve(Oe,"mrow",null,t)}renderMmlGroupChar(e){const t="bot"===e.props.verticalJustification?"mover":"munder",r=this.renderContainerNS(e,Oe,t);return e.props.char&&r.appendChild(Ve(Oe,"mo",null,[e.props.char])),r}renderMmlBar(e){const t=this.renderContainerNS(e,Oe,"mrow");switch(e.props.position){case"top":t.style.textDecoration="overline";break;case"bottom":t.style.textDecoration="underline"}return t}renderMmlRun(e){const t=Ve(Oe,"ms");return this.renderClass(e,t),this.renderStyleValues(e.cssStyle,t),this.renderChildren(e,t),t}renderMllList(e){const t=Ve(Oe,"mtable");this.renderClass(e,t),this.renderStyleValues(e.cssStyle,t),this.renderChildren(e);for(let r of this.renderChildren(e))t.appendChild(Ve(Oe,"mtr",null,[Ve(Oe,"mtd",null,[r])]));return t}renderStyleValues(e,t){for(let r in e)r.startsWith("$")?t.setAttribute(r.slice(1),e[r]):t.style[r]=e[r]}renderClass(e,t){e.className&&(t.className=e.className),e.styleName&&t.classList.add(this.processStyleName(e.styleName))}findStyle(e){return e&&this.styleMap?.[e]}numberingClass(e,t){return`${this.className}-num-${e}-${t}`}tabStopClass(){return`${this.className}-tab-stop`}styleToString(e,t,r=null){let a=`${e} {\\r\\n`;for(const e in t)e.startsWith("$")||(a+=`  ${e}: ${t[e]};\\r\\n`);return r&&(a+=r),a+"}\\r\\n"}numberingCounter(e,t){return`${this.className}-num-${e}-${t}`}levelTextToContent(e,t,r,a){return`"${e.replace(/%\\d*/g,(e=>{let t=parseInt(e.substring(1),10)-1;return`"counter(${this.numberingCounter(r,t)}, ${a})"`}))}${{tab:"\\\\9",space:"\\\\a0"}[t]??""}"`}numFormatToCssValue(e){return{none:"none",bullet:"disc",decimal:"decimal",lowerLetter:"lower-alpha",upperLetter:"upper-alpha",lowerRoman:"lower-roman",upperRoman:"upper-roman",decimalZero:"decimal-leading-zero",aiueo:"katakana",aiueoFullWidth:"katakana",chineseCounting:"simp-chinese-informal",chineseCountingThousand:"simp-chinese-informal",chineseLegalSimplified:"simp-chinese-formal",chosung:"hangul-consonant",ideographDigital:"cjk-ideographic",ideographTraditional:"cjk-heavenly-stem",ideographLegalTraditional:"trad-chinese-formal",ideographZodiac:"cjk-earthly-branch",iroha:"katakana-iroha",irohaFullWidth:"katakana-iroha",japaneseCounting:"japanese-informal",japaneseDigitalTenThousand:"cjk-decimal",japaneseLegal:"japanese-formal",thaiNumbers:"thai",koreanCounting:"korean-hangul-formal",koreanDigital:"korean-hangul-formal",koreanDigital2:"korean-hanja-informal",hebrew1:"hebrew",hebrew2:"hebrew",hindiNumbers:"devanagari",ganada:"hangul",taiwaneseCounting:"cjk-ideographic",taiwaneseCountingThousand:"cjk-ideographic",taiwaneseDigital:"cjk-decimal"}[e]??e}refreshTabStops(){this.options.experimental&&(clearTimeout(this.tabsTimeout),this.tabsTimeout=setTimeout((()=>{const e=function(e=document.body){const t=document.createElement("div");t.style.width="100pt",e.appendChild(t);const r=100/t.offsetWidth;return e.removeChild(t),r}();for(let t of this.currentTabs)$e(t.span,t.stops,this.defaultTabSize,e)}),500))}later(e){this.postRenderTasks.push(e)}}function _e(e,t,r){return Ve(void 0,e,t,r)}function ze(e,t,r){return Ve(Le,e,t,r)}function Ve(e,t,r,a){var s=e?document.createElementNS(e,t):document.createElement(t);return Object.assign(s,r),a&&We(s,a),s}function je(e){e.innerHTML=""}function We(e,t){t.forEach((t=>{return e.appendChild("string"==typeof(r=t)||r instanceof String?document.createTextNode(t):t);var r}))}function Xe(e){return _e("style",{innerHTML:e})}function Ue(e,t){e.appendChild(document.createComment(t))}const qe={ignoreHeight:!1,ignoreWidth:!1,ignoreFonts:!1,breakPages:!0,debug:!1,experimental:!1,className:"docx",inWrapper:!0,trimXmlDeclaration:!0,ignoreLastRenderedPageBreak:!0,renderHeaders:!0,renderFooters:!0,renderFootnotes:!0,renderEndnotes:!0,useBase64URL:!1,renderChanges:!1,renderComments:!1};function Ge(e,t){const r={...qe,...t};return pe.load(e,new Ee(r),r)}async function Je(e,t,r,a){const s={...qe,...a},n=new He(window.document);return n.render(e,t,r,s),Promise.allSettled(n.tasks)}e.defaultOptions=qe,e.parseAsync=Ge,e.renderAsync=async function(e,t,r,a){const s=await Ge(e,a);return await Je(s,t,r,a),s},e.renderDocument=Je}));\n//# sourceMappingURL=docx-preview.min.js.map\n';
  const _DownloadPreviewer = class _DownloadPreviewer {
    constructor(gradeProps) {
      this.timer = null;
      this.objectUrl = null;
      this.inited = false;
      this.iframe = null;
      this.container = null;
      this.maxHeightPx = null;
      this.toolbar = null;
      this.dedRoot = null;
      this.memoRoot = null;
      this.gradeProps = gradeProps;
      this.hiddenEls = [];
      this.isLoading = false;
      this.isLoaded = false;
      this.nextTryAt = 0;
      this.checkDOMReady();
    }
    checkDOMReady() {
      this.timer = setInterval(() => {
        try {
          if (this.isLoaded) {
            if (this.timer) {
              clearInterval(this.timer);
              this.timer = null;
            }
            return;
          }
          const btn = this._findDownloadButton();
          const previewer = document.querySelector("#previewer");
          const inner = document.querySelector("#previewerInner") || previewer || document.getElementById("currentAttempt_submission") || document.getElementById("content") || document.getElementById("contentPanel");
          if (btn && previewer && inner) {
            if (!this.isLoading && Date.now() >= this.nextTryAt) {
              this.handleDownloadButton(btn, inner);
            }
          }
        } catch (e) {
        }
      }, 500);
    }
    async handleDownloadButton(btn, container) {
      try {
        if (this.isLoaded || this.isLoading)
          return;
        this.isLoading = true;
        const href = this._getHref(btn);
        const absHref = this._toAbsoluteUrl(href);
        const nameGuess = this._guessFileName(btn, href);
        const lower = (nameGuess || "").toLowerCase();
        const looksPdfByName = lower.endsWith(".pdf");
        const looksDocxByName = lower.endsWith(".docx");
        const looksDocByName = lower.endsWith(".doc") && !lower.endsWith(".docx");
        let isPdf = looksPdfByName;
        let isDocx = looksDocxByName;
        let isDoc = looksDocByName;
        if (!isPdf && !isDocx && !isDoc) {
          try {
            const res = await fetch(absHref, { method: "HEAD", credentials: "include" });
            const ct = (res.headers.get("content-type") || "").toLowerCase();
            if (ct.includes("application/pdf"))
              isPdf = true;
            if (ct.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
              isDocx = true;
            if (ct.includes("application/msword"))
              isDoc = true;
          } catch (_) {
          }
        }
        const enablePdf = !(this.gradeProps && this.gradeProps.env && this.gradeProps.env.assignment && this.gradeProps.env.assignment.enablePdfPreview === false);
        const enableDocx = !(this.gradeProps && this.gradeProps.env && this.gradeProps.env.assignment && this.gradeProps.env.assignment.enableDocxPreview === false);
        if (isPdf && enablePdf) {
          await this.replaceWithPdfIframe(absHref, container);
        } else if (isDocx && enableDocx) {
          await this.replaceWithDocxIframe(absHref, container);
        } else if (isDoc) {
          this.isLoading = false;
          this.nextTryAt = Date.now() + 3e3;
        } else {
          this.isLoading = false;
          this.nextTryAt = Date.now() + 3e3;
        }
      } catch (_) {
      }
    }
    _getHref(btn) {
      var _a;
      let href = btn && btn.getAttribute("href");
      if (!href || href.startsWith("javascript")) {
        const dataHref = btn && (btn.getAttribute("data-href") || ((_a = btn.dataset) == null ? void 0 : _a.href));
        if (dataHref)
          href = dataHref;
      }
      return href;
    }
    _findDownloadButton() {
      let el = document.querySelector("#downloadPanelButton, #downloadButton");
      if (el)
        return el;
      const anchors = Array.from(document.querySelectorAll("#downloadPanel a, #previewer a, a"));
      for (const a of anchors) {
        const href = a.getAttribute("href") || a.getAttribute("data-href") || "";
        const txt = (a.textContent || "").trim().toLowerCase();
        const title = (a.getAttribute("title") || "").toLowerCase();
        const aria = (a.getAttribute("aria-label") || "").toLowerCase();
        const looksDownload = txt.includes("download") || txt.includes("下载") || title.includes("download") || title.includes("下载") || aria.includes("download") || aria.includes("下载") || a.id && a.id.toLowerCase().includes("download") || (a.className || "").toLowerCase().includes("download");
        const looksFile = /\.(pdf|docx?)($|\?|#)/i.test(href || "");
        if (looksDownload || looksFile)
          return a;
      }
      return null;
    }
    _guessFileName(btn, href) {
      try {
        const dl = btn.getAttribute("download");
        if (dl)
          return dl;
        if (href) {
          try {
            const u = new URL(href, window.location.href);
            const qs = u.searchParams;
            const cand = qs.get("filename") || qs.get("fileName") || qs.get("name");
            if (cand)
              return decodeURIComponent(cand);
            const path = decodeURIComponent(u.pathname || "");
            const seg = path.split("/").filter(Boolean).pop();
            if (seg && /\.[a-z0-9]{2,5}$/i.test(seg))
              return seg;
          } catch (_) {
          }
        }
        const panel = document.getElementById("downloadPanel") || document.getElementById("previewer");
        if (panel) {
          const text = panel.textContent || "";
          const m2 = text.match(/\b[^\s]+\.(pdf|docx?)\b/i);
          if (m2)
            return m2[0];
        }
      } catch (_) {
      }
      return null;
    }
    _toAbsoluteUrl(href) {
      try {
        if (!href)
          return href;
        return new URL(href, window.location.href).href;
      } catch (_) {
        return href;
      }
    }
    async _ensureDocxPreviewIn(targetWin) {
      if (!targetWin)
        return null;
      if (targetWin.docx && targetWin.JSZip)
        return targetWin.docx;
      const existing = _DownloadPreviewer._docxPreviewPromises.get(targetWin);
      if (existing)
        return existing;
      const p2 = Promise.resolve().then(() => {
        try {
          const wrap = (code) => `;(function(){
  try { var module = undefined; var exports = undefined; var define = undefined; } catch(_){}
  ${code}
})();`;
          const Fn = targetWin.Function;
          new Fn(wrap(jszipBundle))();
          if (!targetWin.JSZip && typeof targetWin.JSZip === "undefined" && typeof targetWin.JSZip !== "function" && typeof JSZip !== "undefined") {
            try {
              targetWin.JSZip = JSZip;
            } catch (_) {
            }
          }
          new Fn(wrap(docxPreviewBundle))();
        } catch (_) {
        }
        return targetWin.docx;
      });
      _DownloadPreviewer._docxPreviewPromises.set(targetWin, p2);
      return p2;
    }
    async replaceWithPdfIframe(href, container) {
      try {
        const loading = document.getElementById("loadingMessage");
        if (loading)
          loading.style.display = "";
        const blob = await this._downloadPdfWithRetry(href, 3);
        if (!blob) {
          if (loading)
            loading.style.display = "none";
          const extra = document.getElementById("downloadPanelExtraMessage");
          if (extra) {
            extra.textContent = "无法在线预览，请重新刷新页面。若仍不行，请点击下方“Download”查看。";
            extra.style.display = "";
          }
          this.isLoading = false;
          this.nextTryAt = Date.now() + 3e3;
          return;
        }
        if (this.objectUrl)
          URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = URL.createObjectURL(blob);
        try {
          const outer = document.getElementById("previewer");
          let h = 0;
          if (outer)
            h = outer.getBoundingClientRect().height;
          if (!h && container)
            h = container.getBoundingClientRect().height;
          if (h)
            this.maxHeightPx = Math.max(100, Math.floor(h));
        } catch (_) {
        }
        const enableTools = !(this.gradeProps && this.gradeProps.enableTools === false);
        if (enableTools) {
          while (container.firstChild)
            container.removeChild(container.firstChild);
          const dedMount = document.createElement("div");
          container.appendChild(dedMount);
          try {
            this.dedRoot = client.createRoot(dedMount);
            this.dedRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(DeductionsToolbar, {}));
          } catch (_) {
          }
          const memoHost = document.createElement("div");
          memoHost.className = "bbep-preview-memo";
          container.appendChild(memoHost);
          try {
            this.memoRoot = client.createRoot(memoHost);
            this.memoRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Memo, { props: this.gradeProps }));
          } catch (_) {
          }
          this.toolbar = memoHost;
        }
        const iframe = document.createElement("iframe");
        iframe.src = this.objectUrl;
        iframe.style.width = "100%";
        iframe.style.border = "0";
        iframe.style.visibility = "hidden";
        iframe.setAttribute("title", "Assignment Preview");
        if (enableTools) {
          container.appendChild(iframe);
        } else {
          const existing = container.querySelector("iframe, object, embed");
          if (existing && existing.parentNode === container) {
            container.replaceChild(iframe, existing);
          } else {
            container.appendChild(iframe);
          }
        }
        this.iframe = iframe;
        this.container = container;
        this.updateIframeHeight();
        iframe.onload = () => {
          try {
            iframe.style.visibility = "";
            this.updateIframeHeight();
          } catch (_) {
          }
          const downloadPanel = document.getElementById("downloadPanel");
          if (downloadPanel)
            downloadPanel.style.display = "none";
          if (loading)
            loading.style.display = "none";
          if (enableTools) {
            this.collapseTopAreas();
          }
          if (enableTools)
            setTimeout(() => this.scrollToPanelButton(), 0);
          this.isLoaded = true;
          this.isLoading = false;
          if (this.timer) {
            try {
              clearInterval(this.timer);
            } catch (_) {
            }
            this.timer = null;
          }
        };
      } catch (e) {
        const loading = document.getElementById("loadingMessage");
        if (loading)
          loading.style.display = "none";
        this.isLoading = false;
        this.nextTryAt = Date.now() + 3e3;
      }
    }
    async replaceWithDocxIframe(absHref, container) {
      var _a;
      try {
        const loading = document.getElementById("loadingMessage");
        if (loading)
          loading.style.display = "";
        const arrayBuffer = await this._downloadArrayBufferWithRetry(absHref, 3);
        if (!arrayBuffer) {
          if (loading)
            loading.style.display = "none";
          this.isLoading = false;
          this.nextTryAt = Date.now() + 3e3;
          return;
        }
        const enableTools = !(this.gradeProps && this.gradeProps.enableTools === false);
        if (enableTools) {
          while (container.firstChild)
            container.removeChild(container.firstChild);
          const dedMount = document.createElement("div");
          container.appendChild(dedMount);
          try {
            this.dedRoot = client.createRoot(dedMount);
            this.dedRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(DeductionsToolbar, {}));
          } catch (_) {
          }
          const memoHost = document.createElement("div");
          memoHost.className = "bbep-preview-memo";
          container.appendChild(memoHost);
          try {
            this.memoRoot = client.createRoot(memoHost);
            this.memoRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Memo, { props: this.gradeProps }));
          } catch (_) {
          }
          this.toolbar = memoHost;
        }
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.border = "0";
        iframe.style.visibility = "hidden";
        iframe.setAttribute("title", "Assignment Preview");
        if (enableTools) {
          container.appendChild(iframe);
        } else {
          const existing = container.querySelector("iframe, object, embed");
          if (existing && existing.parentNode === container) {
            container.replaceChild(iframe, existing);
          } else {
            container.appendChild(iframe);
          }
        }
        this.iframe = iframe;
        this.container = container;
        const doc = iframe.contentDocument || ((_a = iframe.contentWindow) == null ? void 0 : _a.document);
        if (!doc)
          throw new Error("no iframe document");
        doc.open();
        doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:16px;"></body></html>');
        doc.close();
        const host = doc.createElement("div");
        host.id = "bbep-docx-root";
        doc.body.appendChild(host);
        try {
          const outer = document.getElementById("previewer");
          let h = 0;
          if (outer)
            h = outer.getBoundingClientRect().height;
          if (!h && container)
            h = container.getBoundingClientRect().height;
          if (h)
            this.maxHeightPx = Math.max(100, Math.floor(h));
        } catch (_) {
        }
        this.updateIframeHeight();
        const targetWin = doc.defaultView || iframe.contentWindow;
        const docx = await this._ensureDocxPreviewIn(targetWin).catch(() => null);
        if (!docx)
          throw new Error("docx-preview not available");
        try {
          let dataForDocx = null;
          try {
            dataForDocx = new targetWin.Uint8Array(arrayBuffer);
          } catch (_) {
            try {
              dataForDocx = new targetWin.Blob([arrayBuffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            } catch (_2) {
              dataForDocx = arrayBuffer;
            }
          }
          await docx.renderAsync(dataForDocx, host, void 0, { inWrapper: true, className: "bbep-docx" });
        } catch (e) {
          try {
            console.warn("[BBEP] docx-preview renderAsync error", e);
          } catch (_) {
          }
          throw e;
        }
        try {
          iframe.style.visibility = "";
          this.updateIframeHeight();
        } catch (_) {
        }
        const downloadPanel = document.getElementById("downloadPanel");
        if (downloadPanel)
          downloadPanel.style.display = "none";
        if (loading)
          loading.style.display = "none";
        if (enableTools) {
          this.collapseTopAreas();
          setTimeout(() => this.scrollToPanelButton(), 0);
        }
        this.isLoaded = true;
        this.isLoading = false;
        if (this.timer) {
          try {
            clearInterval(this.timer);
          } catch (_) {
          }
          this.timer = null;
        }
      } catch (e) {
        const loading = document.getElementById("loadingMessage");
        if (loading)
          loading.style.display = "none";
        this.isLoading = false;
        this.nextTryAt = Date.now() + 3e3;
        const extra = document.getElementById("downloadPanelExtraMessage");
        if (extra) {
          extra.textContent = "无法在线预览此 DOCX，请点击下方“Download”查看。";
          extra.style.display = "";
        }
      }
    }
    collapseTopAreas() {
      const targets = ["#globalNavPageNavArea", "#breadcrumbs", "#actionbar"];
      targets.forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          const prev = el.style.display;
          this.hiddenEls.push({ el, prev });
          el.style.display = "none";
        }
      });
    }
    scrollToPanelButton() {
      try {
        const el = document.getElementById("panelbutton2");
        if (!el)
          return;
        if (el.scrollIntoView) {
          el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        } else {
          const y = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 8;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } catch (_) {
      }
    }
    updateIframeHeight() {
      var _a, _b, _c;
      if (!this.iframe || !this.container)
        return;
      try {
        let base = this.maxHeightPx;
        if (!base) {
          const outer = document.getElementById("previewer");
          if (outer)
            base = Math.floor(outer.getBoundingClientRect().height);
          if (!base && this.container)
            base = Math.floor(this.container.getBoundingClientRect().height);
        }
        if (!base || base <= 0)
          base = 600;
        const toolbarH = this.toolbar ? Math.ceil(this.toolbar.getBoundingClientRect().height) : 0;
        let desired = base - toolbarH;
        try {
          const doc = this.iframe.contentDocument || ((_a = this.iframe.contentWindow) == null ? void 0 : _a.document);
          if (doc) {
            const contentH = Math.max(
              ((_b = doc.body) == null ? void 0 : _b.scrollHeight) || 0,
              ((_c = doc.documentElement) == null ? void 0 : _c.scrollHeight) || 0
            );
            if (contentH > 0)
              desired = Math.max(desired, Math.min(contentH + 20, 2e3));
          }
        } catch (_) {
        }
        if (desired < 120)
          desired = 120;
        this.iframe.style.height = desired + "px";
      } catch (_) {
      }
    }
    async _downloadPdfWithRetry(href, maxAttempts = 3) {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await fetch(href, { method: "GET", credentials: "include" });
          if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          let isPdf = false;
          const ct = (res.headers.get("content-type") || "").toLowerCase();
          if (ct.includes("application/pdf")) {
            isPdf = true;
          } else {
            try {
              const head = await blob.slice(0, 5).text();
              if (head && head.startsWith("%PDF"))
                isPdf = true;
            } catch (_) {
            }
          }
          if (isPdf)
            return blob;
          throw new Error("Not PDF");
        } catch (e) {
          if (attempt < maxAttempts) {
            await sleep(600 * attempt);
            continue;
          } else {
            return null;
          }
        }
      }
      return null;
    }
    async _downloadArrayBufferWithRetry(href, maxAttempts = 3) {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await fetch(href, { method: "GET", credentials: "include" });
          if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
          return await res.arrayBuffer();
        } catch (e) {
          if (attempt < maxAttempts) {
            await sleep(600 * attempt);
            continue;
          } else {
            return null;
          }
        }
      }
      return null;
    }
    // mammoth fallback removed
    remove() {
      if (this.timer)
        clearInterval(this.timer);
      if (this.objectUrl) {
        try {
          URL.revokeObjectURL(this.objectUrl);
        } catch (_) {
        }
      }
      if (this.dedRoot) {
        try {
          this.dedRoot.unmount();
        } catch (_) {
        }
        this.dedRoot = null;
      }
      if (this.memoRoot) {
        try {
          this.memoRoot.unmount();
        } catch (_) {
        }
        this.memoRoot = null;
      }
      if (this.hiddenEls && this.hiddenEls.length) {
        this.hiddenEls.forEach(({ el, prev }) => {
          try {
            el.style.display = prev;
          } catch (_) {
          }
        });
        this.hiddenEls = [];
      }
    }
  };
  // mammoth removed
  // Lazy-load docx-preview/JSZip into a target window (iframe-safe)
  __publicField(_DownloadPreviewer, "_docxPreviewPromises", /* @__PURE__ */ new WeakMap());
  let DownloadPreviewer = _DownloadPreviewer;
  function HeaderDedMeta() {
    const [count, setCount] = React.useState(() => _GM_getValue("bbep_ded_count", 5));
    const [step, setStep] = React.useState(() => _GM_getValue("bbep_ded_step", 1));
    React.useEffect(() => {
      _GM_setValue("bbep_ded_count", count);
      window.dispatchEvent(new CustomEvent("bbep:dedConfig", { detail: { count } }));
    }, [count]);
    React.useEffect(() => {
      _GM_setValue("bbep_ded_step", step);
      window.dispatchEvent(new CustomEvent("bbep:dedConfig", { detail: { step } }));
    }, [step]);
    const onCount = (e) => {
      const v = Math.max(1, Math.min(100, parseInt(e.target.value || "0", 10)));
      setCount(v);
    };
    const onStep = (e) => {
      let v = parseFloat(e.target.value || "");
      if (!isFinite(v) || v <= 0)
        v = 1;
      v = Math.min(100, Math.max(1e-3, v));
      setStep(v);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bbep-header-meta", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "meta-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "题目数" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "bbep-ded-count-input",
            type: "number",
            min: "1",
            max: "100",
            value: count,
            onChange: onCount
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "meta-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "步长" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "bbep-ded-step-input",
            type: "number",
            min: "0.001",
            step: "0.1",
            value: step,
            onChange: onStep
          }
        )
      ] })
    ] });
  }
  class PrettierPage {
    constructor() {
      this.expand;
      this.fb;
      this.checkDOMReady();
    }
    checkDOMReady() {
      try {
        const checkInterval = setInterval(() => {
          this.expand = document.querySelector("#currentAttempt_gradeDataPanel");
          this.fb = document.querySelector("#feedbacktext_tbl > tbody > tr > td > span");
          const help = document.getElementById("helpPageTitle");
          if (this.expand && this.fb) {
            this.expand.style.display = "";
            this.fb.remove();
            clearInterval(checkInterval);
          }
          if (help) {
            try {
              help.remove();
            } catch (_) {
            }
          }
        }, 500);
      } catch (err) {
      }
    }
  }
  class AutoCalculator {
    constructor() {
      this.textArea;
      this.fillSpace;
      this.totolGrade;
      this.lastGrade;
      this.checkDOMReady();
    }
    checkDOMReady() {
      const checkInterval = setInterval(() => {
        try {
          this.textArea = this.return_textArea();
          this.fillSpace = this.return_fillSpace();
          this.totolGrade = this.return_totalGrade();
          this.lastGrade = this.return_lastGrade();
          if (this.textArea && this.fillSpace && this.totolGrade && this.lastGrade) {
            clearInterval(checkInterval);
            this.setupEventListeners();
          }
        } catch (err) {
        }
      }, 500);
    }
    setupEventListeners() {
      this.textArea.addEventListener("input", this.handleInput.bind(this));
      if (this.lastGrade != "-") {
        this.fillSpace.value = this.lastGrade;
      } else {
        this.fillSpace.value = this.totolGrade;
      }
    }
    return_textArea() {
      return document.querySelector("#feedbacktext_ifr").contentDocument.documentElement.querySelector("body");
    }
    return_fillSpace() {
      return document.querySelector("#currentAttempt_grade");
    }
    return_totalGrade() {
      return parseFloat(document.querySelector("#currentAttempt_pointsPossible").innerHTML.split("/")[1]);
    }
    return_lastGrade() {
      return document.querySelector("#aggregateGrade").value;
    }
    handleInput(e) {
      const numsArr = e.target.innerHTML.match(/-\d+(\.\d+)?/g);
      if (!numsArr) {
        this.fillSpace.value = this.totolGrade;
      } else {
        let grade = this.totolGrade;
        numsArr.forEach((num) => {
          grade += parseFloat(num);
        });
        this.fillSpace.value = grade;
      }
    }
    remove() {
      if (this.textArea) {
        this.textArea.removeEventListener("input", this.handleInput);
      }
    }
  }
  function GradeAssignment(props) {
    React.useEffect(() => {
      new PrettierPage();
      const AC = new AutoCalculator();
      const DP = new DownloadPreviewer(props);
      const bro = document.querySelector("#currentAttempt_submission");
      const app = document.createElement("div");
      bro.parentNode.style.height = "auto";
      bro.parentNode.insertBefore(app, bro);
      const root = client.createRoot(app);
      root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {}));
      let headerRoot = null;
      let headerHost = null;
      try {
        const titleExtra = document.getElementById("_titlebarExtraContent") || document.getElementById("pageTitleBar");
        if (titleExtra) {
          headerHost = document.createElement("span");
          headerHost.className = "bbep-header-meta-container";
          titleExtra.appendChild(headerHost);
          headerRoot = client.createRoot(headerHost);
          headerRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(HeaderDedMeta, {}));
        }
      } catch (_) {
      }
      return () => {
        if (root) {
          root.unmount();
        }
        AC.remove();
        DP.remove();
        if (headerRoot) {
          try {
            headerRoot.unmount();
          } catch (_) {
          }
          if (headerHost && headerHost.parentNode)
            headerHost.parentNode.removeChild(headerHost);
        }
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  }
  function StudentSubmissionPreview({ env }) {
    React.useEffect(() => {
      const DP = new DownloadPreviewer({ enableTools: false, env });
      return () => {
        try {
          DP.remove();
        } catch (_) {
        }
      };
    }, [env]);
    return null;
  }
  async function fetchCourseMyGrades(course) {
    var _a, _b, _c, _d;
    const url = `/webapps/bb-mygrades-BBLEARN/myGrades?course_id=${encodeURIComponent(course.id)}&stream_name=mygrades&is_stream=false`;
    try {
      const res = await fetch(url, { method: "GET", credentials: "include" });
      const html = await res.text();
      const debug = {
        courseId: course.id,
        courseName: course.name,
        url,
        httpStatus: res.status,
        hasWrapper: false,
        rowCount: 0,
        itemsExtracted: 0,
        itemsPreview: [],
        notes: []
      };
      const doc = new DOMParser().parseFromString(html, "text/html");
      const wrapper = doc.querySelector("#grades_wrapper");
      if (!wrapper)
        return { items: [], debug };
      debug.hasWrapper = true;
      const rows = Array.from(wrapper.querySelectorAll('div.sortable_item_row[role="row"], div.row[role="row"], div[role="row"]'));
      debug.rowCount = rows.length;
      const items = [];
      for (const row of rows) {
        try {
          const lastMsStr = row.getAttribute("lastactivity");
          const dueMsStr = row.getAttribute("duedate");
          const lastMs = lastMsStr && lastMsStr !== "9223372036854775807" ? parseInt(lastMsStr, 10) : NaN;
          const dueMs = dueMsStr && dueMsStr !== "9223372036854775807" ? parseInt(dueMsStr, 10) : NaN;
          const cellGradable = row.querySelector(".cell.gradable");
          const cellActivity = row.querySelector(".cell.activity");
          const cellGrade = row.querySelector(".cell.grade");
          const nameEl = cellGradable ? cellGradable.querySelector("a[id]") || cellGradable.querySelector("span[id]") : null;
          const itemName = nameEl ? (nameEl.textContent || "").trim() : "";
          const itemType = cellGradable ? (((_a = cellGradable.querySelector(".itemCat")) == null ? void 0 : _a.textContent) || "").trim() || (row.classList.contains("calculatedRow") ? "Calculated" : "") : "";
          const dueText = cellGradable ? (((_b = cellGradable.querySelector(".activityType")) == null ? void 0 : _b.textContent) || "").trim() : "";
          const lastActivityText = cellActivity ? (((_c = cellActivity.querySelector(".lastActivityDate")) == null ? void 0 : _c.textContent) || "").trim() : "";
          let gradeMain = "";
          if (cellGrade) {
            const gNodes = cellGrade.querySelectorAll(".grade");
            if (gNodes && gNodes.length) {
              gradeMain = (gNodes[gNodes.length - 1].textContent || "").trim();
            } else {
              gradeMain = (cellGrade.textContent || "").trim();
            }
          }
          const pointsText = cellGrade ? (((_d = cellGrade.querySelector(".pointsPossible")) == null ? void 0 : _d.textContent) || "").trim() : "";
          const item = {
            courseId: course.id,
            courseName: course.name,
            itemType,
            itemName,
            gradeText: gradeMain + (pointsText ? ` ${pointsText}` : ""),
            lastActivityMs: isFinite(lastMs) ? lastMs : NaN,
            lastActivityText,
            dueMs: isFinite(dueMs) ? dueMs : NaN,
            dueText
          };
          items.push(item);
          debug.itemsPreview.push({
            itemType,
            itemName,
            gradeText: item.gradeText,
            lastActivityText,
            lastActivityMs: item.lastActivityMs,
            dueText,
            dueMs: item.dueMs,
            rowClass: row.className
          });
        } catch (e) {
          debug.notes.push(`parse row failed: ${String(e && e.message || e)}`);
        }
      }
      debug.itemsExtracted = items.length;
      return { items, debug };
    } catch (_) {
      return { items: [], debug: { courseId: course.id, courseName: course.name, url, error: "fetch failed" } };
    }
  }
  async function fetchAllMyGrades() {
    const courseDb = await courseInfoCatch();
    const entries = Object.entries(courseDb).map(([name, v]) => ({ id: v.id, name }));
    const out = [];
    const debugAll = { time: Date.now(), courseCount: entries.length, courses: [] };
    const batchSize = 4;
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((c) => fetchCourseMyGrades(c)));
      for (const r of batchResults) {
        if (r && r.items)
          out.push(...r.items);
        if (r && r.debug)
          debugAll.courses.push(r.debug);
      }
    }
    out.sort((a, b) => {
      const la = isFinite(a.lastActivityMs) ? a.lastActivityMs : isFinite(a.dueMs) ? a.dueMs : -Infinity;
      const lb = isFinite(b.lastActivityMs) ? b.lastActivityMs : isFinite(b.dueMs) ? b.dueMs : -Infinity;
      return lb - la;
    });
    const hasRealGrade = (t) => {
      if (!t)
        return false;
      const s = String(t).trim();
      if (!s)
        return false;
      if (s === "-" || s.startsWith("-"))
        return false;
      return true;
    };
    const gradedOnly = out.filter((it) => hasRealGrade(it.gradeText));
    const filtered = gradedOnly.filter((it) => (it.itemName || "").trim().toLowerCase() !== "total");
    try {
      console.groupCollapsed("[BBEP MyGrades] Aggregated Grades JSON");
      console.log(JSON.stringify({ summary: { time: debugAll.time, courseCount: debugAll.courseCount, itemCount: filtered.length }, detail: debugAll }, null, 2));
      console.groupEnd();
    } catch (_) {
    }
    return filtered;
  }
  function formatDateTime(ms) {
    if (!isFinite(ms))
      return "";
    try {
      const d = new Date(ms);
      return d.toLocaleString();
    } catch (_) {
      return "";
    }
  }
  function MyGrades({ items: presetItems, updatedAt, updatedFresh = false }) {
    const [items, setItems] = React.useState(presetItems || null);
    const [error, setError] = React.useState(null);
    const [ts, setTs] = React.useState(Date.now());
    const [selfFresh, setSelfFresh] = React.useState(false);
    React.useEffect(() => {
      try {
        if (Array.isArray(items)) {
          console.log("[BBEP MyGrades] render items length:", items.length);
        }
      } catch (_) {
      }
    }, [items]);
    React.useEffect(() => {
      if (presetItems && Array.isArray(presetItems)) {
        setItems(presetItems);
        return;
      }
      let alive = true;
      (async () => {
        try {
          const data = await fetchAllMyGrades();
          if (alive) {
            setItems(data);
            setTs(Date.now());
            setSelfFresh(true);
          }
        } catch (e) {
          if (alive)
            setError("Failed to load grades");
        }
      })();
      return () => {
        alive = false;
      };
    }, [ts, presetItems]);
    const shownUpdatedAt = updatedAt || ts;
    const toolbar = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px 0" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "12px", color: "#666" }, children: [
      "Updated: ",
      new Date(shownUpdatedAt).toLocaleTimeString(),
      " ",
      updatedFresh || selfFresh ? "已更新" : ""
    ] }) });
    if (error)
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        toolbar,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px", color: "#b00" }, children: error })
      ] });
    if (!items)
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        toolbar,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px" }, children: "Loading grades…" })
      ] });
    if (!items.length)
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        toolbar,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px" }, children: "No recent grades." })
      ] });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px", width: "100%", boxSizing: "border-box", overflowX: "hidden" }, children: [
      toolbar,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gap: "8px", width: "100%", boxSizing: "border-box", overflowX: "hidden" }, children: items.map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr auto", columnGap: "12px", padding: "10px 12px", borderRadius: "6px", background: "#f6f7f9", border: "1px solid #e3e6ea", width: "100%", boxSizing: "border-box", overflow: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, fontSize: "12px", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
            it.courseName,
            it.itemType ? ` - ${it.itemType}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "16px", fontWeight: 700, color: "#222", marginTop: "2px", overflowWrap: "anywhere" }, children: it.itemName || "(Unnamed)" }),
          it.dueText && String(it.dueText).trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "12px", color: "#666", marginTop: "2px" }, children: it.dueText }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", whiteSpace: "nowrap", minWidth: "fit-content" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: "18px", color: "#111" }, children: it.gradeText }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "12px", color: "#666", marginTop: "2px" }, children: it.lastActivityText || (isFinite(it.lastActivityMs) ? formatDateTime(it.lastActivityMs) : "") })
        ] })
      ] }, idx)) })
    ] });
  }
  function menuControl(env, setEnv) {
    var _a, _b, _c, _d, _e;
    try {
      const prev = window.__bbep_menuIds || [];
      prev.forEach((id) => {
        try {
          _GM_unregisterMenuCommand(id);
        } catch (_) {
        }
      });
    } catch (_) {
    }
    const ids = [];
    try {
      ids.push(_GM_registerMenuCommand(`${((_a = env.calendar) == null ? void 0 : _a.display) ? "✓" : "✗"} 启用 DDL Poster`, () => {
        setEnv((prev) => ({ ...prev, calendar: { ...prev.calendar, display: !prev.calendar.display } }));
      }));
    } catch (_) {
    }
    try {
      ids.push(_GM_registerMenuCommand(`${((_b = env.mygrades) == null ? void 0 : _b.display) ? "✓" : "✗"} 启用 My Grades`, () => {
        setEnv((prev) => ({ ...prev, mygrades: { ...prev.mygrades || {}, display: !(prev.mygrades || {}).display } }));
      }));
    } catch (_) {
    }
    try {
      ids.push(_GM_registerMenuCommand(`${((_c = env.assignment) == null ? void 0 : _c.display) ? "✓" : "✗"} 启用批改辅助`, () => {
        setEnv((prev) => ({ ...prev, assignment: { ...prev.assignment, display: !prev.assignment.display } }));
      }));
    } catch (_) {
    }
    try {
      ids.push(_GM_registerMenuCommand(`${((_d = env.assignment) == null ? void 0 : _d.enablePdfPreview) ?? true ? "✓" : "✗"} 开启PDF预览`, () => {
        setEnv((prev) => {
          var _a2;
          return { ...prev, assignment: { ...prev.assignment, enablePdfPreview: !(((_a2 = prev.assignment) == null ? void 0 : _a2.enablePdfPreview) ?? true) } };
        });
      }));
    } catch (_) {
    }
    try {
      ids.push(_GM_registerMenuCommand(`${((_e = env.assignment) == null ? void 0 : _e.enableDocxPreview) ?? true ? "✓" : "✗"} 开启Word预览`, () => {
        setEnv((prev) => {
          var _a2;
          return { ...prev, assignment: { ...prev.assignment, enableDocxPreview: !(((_a2 = prev.assignment) == null ? void 0 : _a2.enableDocxPreview) ?? true) } };
        });
      }));
    } catch (_) {
    }
    try {
      ids.push(_GM_registerMenuCommand("清除缓存 · 日历", () => {
        try {
          _GM_setValue("calendarCache", null);
        } catch (_) {
        }
      }));
    } catch (_) {
    }
    try {
      ids.push(_GM_registerMenuCommand("清除缓存 · 成绩", () => {
        try {
          _GM_setValue("myGradesCache", null);
        } catch (_) {
        }
      }));
    } catch (_) {
    }
    window.__bbep_menuIds = ids;
  }
  function App() {
    var _a, _b, _c;
    const [env, setEnv] = React.useState(() => {
      const defaults = {
        calendar: { display: true, showSubmitted: true, showGraded: false },
        mygrades: { display: true },
        assignment: { display: true, memo: "", enablePdfPreview: true, enableDocxPreview: true }
      };
      const stored = _GM_getValue("env", {});
      return {
        calendar: { ...defaults.calendar, ...stored.calendar || {} },
        mygrades: { ...defaults.mygrades, ...stored.mygrades || {} },
        assignment: { ...defaults.assignment, ...stored.assignment || {} }
      };
    });
    menuControl(env, setEnv);
    const [todoItems, setTodoItems] = React.useState(null);
    const [calendarUpdatedAt, setCalendarUpdatedAt] = React.useState(null);
    const [calendarIsFresh, setCalendarIsFresh] = React.useState(false);
    const [myGradesItems, setMyGradesItems] = React.useState(null);
    const [myGradesUpdatedAt, setMyGradesUpdatedAt] = React.useState(null);
    const [myGradesIsFresh, setMyGradesIsFresh] = React.useState(false);
    React.useEffect(() => {
      const isPortalTabAction = window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction");
      if (!isPortalTabAction || !env.calendar.display)
        return;
      try {
        const c = _GM_getValue("calendarCache", null);
        if (c && Array.isArray(c.items)) {
          setTodoItems(c.items);
          setCalendarUpdatedAt(c.ts || Date.now());
          setCalendarIsFresh(false);
        }
      } catch (_) {
      }
      let alive = true;
      (async () => {
        try {
          const items = await calendarInfoCatch();
          if (!alive)
            return;
          const ts = Date.now();
          setTodoItems(items);
          setCalendarUpdatedAt(ts);
          setCalendarIsFresh(true);
          try {
            _GM_setValue("calendarCache", { items, ts });
          } catch (_) {
          }
        } catch (_) {
        }
      })();
      return () => {
        alive = false;
      };
    }, [env.calendar.display]);
    React.useEffect(() => {
      _GM_setValue("env", env);
      console.log("Setting Saved");
    }, [env]);
    React.useEffect(() => {
      const isPortalTabAction = window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction");
      if (!isPortalTabAction || !env.calendar.display || !todoItems)
        return;
      const host = document.getElementById("column2") || document.querySelector("#column1") || document.querySelector(".column-3") || document.body;
      let moduleEl = document.getElementById("module:_bbep_calendar");
      if (!moduleEl) {
        moduleEl = document.createElement("div");
        moduleEl.className = "portlet clearfix reorderableModule";
        moduleEl.id = "module:_bbep_calendar";
        const html = `
        <h2 class="clearfix" style="cursor: default;">
          <span class="moduleTitle">DDL Poster</span>
          <span class="bbep-actions" style="float:right; display:flex; gap:8px; align-items:center;">
            <label class="bbep-switch">
              <span class="bbep-switch-text">显示已提交</span>
              <input id="bbep_toggle_show_submitted" type="checkbox" />
              <span class="bbep-slider" aria-hidden="true"></span>
            </label>
            <label class="bbep-switch">
              <span class="bbep-switch-text">显示已批阅</span>
              <input id="bbep_toggle_show_graded" type="checkbox" />
              <span class="bbep-slider" aria-hidden="true"></span>
            </label>
          </span>
        </h2>
        <div class="collapsible" style="overflow: auto;" aria-expanded="true" id="BBEP_Calendar_Module">
          <div id="bbep_calendar_updated" style="padding:6px 8px; font-size:12px; color:#666;"></div>
          <div id="div_bbep_calendar_root"></div>
        </div>
      `;
        moduleEl.innerHTML = html;
        try {
          if (host && (host.firstElementChild || host.firstChild)) {
            host.insertBefore(moduleEl, host.firstElementChild || host.firstChild);
          } else if (host) {
            host.appendChild(moduleEl);
          }
        } catch (_) {
          host.appendChild(moduleEl);
        }
      }
      const toggleInput = moduleEl.querySelector("#bbep_toggle_show_submitted");
      if (toggleInput) {
        toggleInput.checked = !!env.calendar.showSubmitted;
        toggleInput.setAttribute("aria-checked", env.calendar.showSubmitted ? "true" : "false");
        toggleInput.onchange = (e) => {
          const checked = !!e.target.checked;
          setEnv((prev) => ({
            ...prev,
            calendar: { ...prev.calendar, showSubmitted: checked }
          }));
        };
      }
      const toggleGraded = moduleEl.querySelector("#bbep_toggle_show_graded");
      if (toggleGraded) {
        toggleGraded.checked = !!env.calendar.showGraded;
        toggleGraded.setAttribute("aria-checked", env.calendar.showGraded ? "true" : "false");
        toggleGraded.onchange = (e) => {
          const checked = !!e.target.checked;
          setEnv((prev) => ({
            ...prev,
            calendar: { ...prev.calendar, showGraded: checked }
          }));
        };
      }
      const mountPoint = moduleEl.querySelector("#div_bbep_calendar_root");
      const updatedEl = moduleEl.querySelector("#bbep_calendar_updated");
      if (updatedEl) {
        try {
          const ts = calendarUpdatedAt || Date.now();
          const suffix = calendarIsFresh ? " 已更新" : "";
          updatedEl.textContent = `Updated: ${new Date(ts).toLocaleTimeString()}${suffix}`;
        } catch (_) {
        }
      }
      const root = client.createRoot(mountPoint);
      const itemsFiltered = env.calendar.showSubmitted ? todoItems : todoItems.filter((it) => !(it.eventType === "Assignment" && it.submitted));
      const itemsForRender = (itemsFiltered || []).slice().sort((a, b) => {
        const aSub = a.eventType === "Assignment" && a.submitted ? 1 : 0;
        const bSub = b.eventType === "Assignment" && b.submitted ? 1 : 0;
        if (aSub !== bSub)
          return aSub - bSub;
        const ad = a.deadline ? Date.parse(a.deadline) : Infinity;
        const bd = b.deadline ? Date.parse(b.deadline) : Infinity;
        return ad - bd;
      });
      root.render(
        /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { todo_items: itemsForRender, showGraded: env.calendar.showGraded, variant: "module" }) })
      );
      return () => {
        try {
          root.unmount();
        } catch (_) {
        }
      };
    }, [todoItems, env.calendar.display, env.calendar.showSubmitted, calendarUpdatedAt, calendarIsFresh]);
    React.useEffect(() => {
      const isPortalTabAction = window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction");
      if (!isPortalTabAction || !(env.mygrades && env.mygrades.display))
        return;
      try {
        const c = _GM_getValue("myGradesCache", null);
        if (c && Array.isArray(c.items)) {
          setMyGradesItems(c.items);
          setMyGradesUpdatedAt(c.ts || Date.now());
          setMyGradesIsFresh(false);
        }
      } catch (_) {
      }
      let alive = true;
      (async () => {
        try {
          const data = await fetchAllMyGrades();
          if (!alive)
            return;
          const ts = Date.now();
          setMyGradesItems(data);
          setMyGradesUpdatedAt(ts);
          setMyGradesIsFresh(true);
          try {
            _GM_setValue("myGradesCache", { items: data, ts });
          } catch (_) {
          }
        } catch (_) {
        }
      })();
      return () => {
        alive = false;
      };
    }, [(_a = env.mygrades) == null ? void 0 : _a.display]);
    React.useEffect(() => {
      const isPortalTabAction = window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction");
      if (!isPortalTabAction)
        return;
      let id = null;
      try {
        id = _GM_addValueChangeListener("myGradesCache", (_name, _old, nv) => {
          if (!nv || !Array.isArray(nv.items))
            return;
          setMyGradesItems(nv.items);
          setMyGradesUpdatedAt(nv.ts || Date.now());
          setMyGradesIsFresh(true);
        });
      } catch (_) {
      }
      return () => {
        if (id && typeof id === "number" && window.GM_removeValueChangeListener) {
          try {
            window.GM_removeValueChangeListener(id);
          } catch (_) {
          }
        }
      };
    }, []);
    React.useEffect(() => {
      var _a2;
      const isPortalTabAction = window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction");
      if (!isPortalTabAction)
        return;
      const poster = document.getElementById("module:_bbep_calendar");
      const host = poster && poster.parentElement || document.getElementById("column2") || document.querySelector("#column2") || document.getElementById("column1") || document.querySelector("#column1");
      if (!host)
        return;
      let moduleEl = document.getElementById("module:_bbep_mygrades");
      if (!moduleEl) {
        moduleEl = document.createElement("div");
        moduleEl.className = "portlet clearfix reorderableModule";
        moduleEl.id = "module:_bbep_mygrades";
        const html = `
        <h2 class="clearfix" style="cursor: default;">
          <span class="moduleTitle">My Grades</span>
        </h2>
        <div class="collapsible" style="overflow: auto; display: block; height: 320px;" aria-expanded="true" id="BBEP_MyGrades_Module">
          <div id="div_bbep_mygrades_root"></div>
        </div>
      `;
        moduleEl.innerHTML = html;
        try {
          if (poster && poster.parentElement === host) {
            const next = poster.nextSibling;
            if (next)
              host.insertBefore(moduleEl, next);
            else
              host.appendChild(moduleEl);
          } else {
            host.appendChild(moduleEl);
          }
        } catch (_) {
          host.appendChild(moduleEl);
        }
      } else {
        try {
          if (poster && poster.parentElement === host) {
            const next = poster.nextSibling;
            if (moduleEl.parentElement !== host || next && next !== moduleEl) {
              if (next)
                host.insertBefore(moduleEl, next);
              else
                host.appendChild(moduleEl);
            }
          }
        } catch (_) {
        }
      }
      const mountPoint = moduleEl.querySelector("#div_bbep_mygrades_root");
      const coll = moduleEl.querySelector("#BBEP_MyGrades_Module");
      if (coll) {
        try {
          coll.style.display = "block";
          coll.style.height = "320px";
          coll.style.maxHeight = "320px";
          coll.style.overflowX = "hidden";
          coll.setAttribute("aria-expanded", "true");
        } catch (_) {
        }
      }
      if (!mountPoint)
        return;
      let root = mountPoint.__bbepRoot;
      if (!root) {
        root = client.createRoot(mountPoint);
        mountPoint.__bbepRoot = root;
      }
      root.render(
        /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: ((_a2 = env.mygrades) == null ? void 0 : _a2.display) ? /* @__PURE__ */ jsxRuntimeExports.jsx(MyGrades, { items: myGradesItems || [], updatedAt: myGradesUpdatedAt || Date.now(), updatedFresh: !!myGradesIsFresh }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px", fontSize: "12px", color: "#666" }, children: "My Grades 已关闭" }) })
      );
    }, [myGradesItems, myGradesUpdatedAt, (_b = env.mygrades) == null ? void 0 : _b.display]);
    React.useEffect(() => {
      var _a2;
      const modCal = document.getElementById("module:_bbep_calendar");
      if (modCal)
        modCal.style.display = env.calendar.display ? "" : "none";
      const modGrades = document.getElementById("module:_bbep_mygrades");
      if (modGrades)
        modGrades.style.display = ((_a2 = env.mygrades) == null ? void 0 : _a2.display) ? "" : "none";
    }, [env.calendar.display, (_c = env.mygrades) == null ? void 0 : _c.display]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/assignment/gradeAssignmentRedirector") && env.assignment.display ? /* @__PURE__ */ jsxRuntimeExports.jsx(GradeAssignment, { env, setEnv }) : null,
      window.location.href.startsWith("https://pibb.scu.edu.cn/webapps/assignment/uploadAssignment") && env.assignment.display ? /* @__PURE__ */ jsxRuntimeExports.jsx(StudentSubmissionPreview, { env }) : null
    ] });
  }
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
  );

})(React, ReactDOM);