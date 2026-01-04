// ==UserScript==
// @name         学习通作业/考试/任务列表（优化版）
// @namespace    https://github.com/Cooanyh
// @version      1.7.0
// @author       甜檸Cirtron (lcandy2); Modified by Coren
// @description  【优化版】支持作业、考试、课程任务列表快速查看。基于原版脚本修改：1. 新增支持在 https://i.chaoxing.com/ 空间页面显示；2. 优化考试与作业列表 UI；3. 新增"任务"/“课程任务”标签，汇总所有课程的待办任务；4. 新增待办即将过期任务提醒。
// @license      AGPL-3.0-or-later
// @copyright    lcandy2 All Rights Reserved
// @copyright    2025, Coren (Modified based on original work)
// @source       https://github.com/lcandy2/user.js/tree/main/websites/chaoxing.com/chaoxing-assignment
// @match        *://mooc1-api.chaoxing.com/work/stu-work*
// @match        *://i.chaoxing.com/*
// @match        *://i.chaoxing.com/base*
// @match        *://i.mooc.chaoxing.com/space/index*
// @match        *://i.mooc.chaoxing.com/settings*
// @match        *://mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode*
// @match        *://mooc1.chaoxing.com/exam-ans/exam/test/examcode/examlist*
// @require      https://registry.npmmirror.com/vue/3.4.27/files/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.js
// @require      data:application/javascript,%3B
// @resource     VuetifyStyle                                                   https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.css
// @resource     material-design-icons-iconfont/dist/material-design-icons.css  https://fonts.googlefonts.cn/css?family=Material+Icons
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @connect      mooc1-api.chaoxing.com
// @connect      mobilelearn.chaoxing.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559587/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E4%BB%BB%E5%8A%A1%E5%88%97%E8%A1%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559587/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E4%BB%BB%E5%8A%A1%E5%88%97%E8%A1%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function (vuetify, vue) {
  'use strict';

  // --- 核心工具函数 ---
  const wrapElements = () => {
    const wrapper = document.createElement("body");
    wrapper.id = "chaoxing-assignment-wrapper";
    while (document.body.firstChild) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
    wrapper.style.display = "none";
  };
  const removeStyles = () => {
    removeHtmlStyle();
    const styles = document.querySelectorAll("link[rel=stylesheet]");
    styles.forEach((style) => {
      var _a;
      if ((_a = style.getAttribute("href")) == null ? void 0 : _a.includes("chaoxing")) {
        style.remove();
      }
    });
  };
  const removeHtmlStyle = () => {
    const html = document.querySelector("html");
    html == null ? void 0 : html.removeAttribute("style");
  };
  const keepRemoveHtmlStyle = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          removeHtmlStyle();
        }
      });
    });
    const html = document.querySelector("html");
    html && observer.observe(html, { attributes: true });
  };
  const removeScripts = () => {
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => {
      var _a;
      if ((_a = script.getAttribute("src")) == null ? void 0 : _a.includes("chaoxing")) {
        script.remove();
      }
    });
  };

  const urlDetection = () => {
    const url = window.location.href;
    const hash = window.location.hash;

    if (hash.includes("chaoxing-assignment-activities")) {
      return "activities";
    }
    if (hash.includes("chaoxing-assignment-todo")) {
      return "todo";
    }

    if (hash.includes("chaoxing-assignment")) {
      if (url.includes("mooc1-api.chaoxing.com/work/stu-work")) {
        return "homework";
      }
      if (url.includes("mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode")) {
        return "exam";
      }
    }
    if (url.includes("mooc1.chaoxing.com/exam-ans/exam/test/examcode/examlist")) {
      return "exam";
    }
    if (url.includes("i.chaoxing.com")) {
      return "home";
    }
    if (url.includes("i.mooc.chaoxing.com/space/index") || url.includes("i.mooc.chaoxing.com/settings")) {
      return "legacyHome";
    }
  };

  const fixCssConflict = () => {
    const style = document.createElement('style');
    style.textContent = `
      .menu-list .label-item h3 {
        font-size: 14px !important;
        margin: 0 !important;
        line-height: 24px !important;
        font-weight: normal !important;
      }
      div.menubar a h5 {
        font-size: 14px !important;
        margin: 0 !important;
        line-height: normal !important;
        font-weight: bold !important; 
        white-space: nowrap !important;
      }
      .leftnav h3, .left_nav h3, .funclistul h3, .user-info h3, 
      div[class*="menu"] h3, div[class*="nav"] h3, #space_left h3, .space-left h3 {
        font-size: 14px !important;
      }
      .space_opt .manageBtn {
        font-size: 12px !important;
        line-height: 24px !important;
        height: auto !important;
        width: auto !important;
        padding: 0 10px !important;
        margin: 0 5px !important;
        display: inline-block !important;
        box-sizing: content-box !important;
        text-align: center !important;
        white-space: nowrap !important;
        border-radius: 4px !important;
      }
      .space_opt a.manageBtn {
        text-decoration: none !important;
        color: #333 !important;
      }
    `;
    document.head.appendChild(style);
  };

  const createMenuItem = (id, text, iconClass, targetUrl, insertFunc) => {
    const url = targetUrl;
    const menubarElement = document.querySelector('div.menubar[role="menubar"]');
    if (menubarElement) {
      const a = document.createElement("a");
      a.setAttribute("role", "menuitem");
      a.setAttribute("tabindex", "-1");
      a.id = `first${id}`;
      a.setAttribute("onclick", `setUrl('${id}','${url}',this,'0','${text}')`);
      a.setAttribute("dataurl", url);

      const icon = document.createElement("span");
      icon.className = `icon-space ${iconClass}`;
      a.appendChild(icon);

      const h5 = document.createElement("h5");
      h5.title = text;
      h5.innerHTML = `<b>${text}</b>`;
      a.appendChild(h5);

      const arrow = document.createElement("span");
      arrow.className = "arrow icon-uniE900";
      a.appendChild(arrow);

      if (insertFunc) insertFunc(menubarElement, a);
      else menubarElement.prepend(a);
    }
  };

  const createMenuItemNew = (id, text, iconClass, targetUrl, insertFunc) => {
    const menuListElement = document.querySelector("ul.menu-list-ul");
    if (menuListElement) {
      const li = document.createElement("li");
      li.setAttribute("level", "1");
      li.setAttribute("table-type", "1");
      li.setAttribute("data-id", `chaoxing-assignment-${id}`);

      const div = document.createElement("div");
      div.className = "label-item";
      div.setAttribute("role", "menuitem");
      div.setAttribute("level", "1");
      div.setAttribute("tabindex", "-1");
      div.setAttribute("name", text);
      div.setAttribute("id", `first_chaoxing_assignment_${id}`);
      div.setAttribute("onclick", `setUrl('chaoxing-assignment-${id}','${targetUrl}',this,'0','${text}')`);
      div.setAttribute("dataurl", targetUrl);

      const icon = document.createElement("span");
      icon.className = `icon-space ${iconClass}`;
      div.appendChild(icon);

      const h3 = document.createElement("h3");
      h3.title = text;
      h3.textContent = text;
      div.appendChild(h3);

      const arrow = document.createElement("span");
      arrow.className = "slide-arrow icon-h-arrow-l hide";
      div.appendChild(arrow);

      li.appendChild(div);
      li.appendChild(Object.assign(document.createElement("div"), { className: "school-level" })).appendChild(document.createElement("ul"));

      if (insertFunc) insertFunc(menuListElement, li);
      else menuListElement.prepend(li);
    }
  };

  const createMenuItemLegacy = (id, text, iconClass, targetUrl) => {
    const list = document.querySelector("ul.funclistul");
    if (list && !document.querySelector(`#li_chaoxing-assignment-${id}`)) {
      const li = document.createElement("li");
      li.id = `li_chaoxing-assignment-${id}`;
      li.className = '';
      li.innerHTML = `<span></span><a id="chaoxing-assignment-${id}" href="javascript:switchM('chaoxing-assignment-${id}','${targetUrl}')" target="_top" title="${text}" class=""><b class="liticons znewyun ${iconClass}"></b><em>${text}</em></a>`;
      list.prepend(li);
    }
  };

  // URL 常量
  const URL_HOMEWORK = 'https://mooc1-api.chaoxing.com/work/stu-work#chaoxing-assignment';
  const URL_EXAM = 'https://mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode#chaoxing-assignment';
  const URL_TODO = 'https://mooc1-api.chaoxing.com/work/stu-work#chaoxing-assignment-todo';
  const URL_ACTIVITIES = 'https://mooc1-api.chaoxing.com/work/stu-work#chaoxing-assignment-activities';
  const API_COURSE_LIST = 'https://mooc1-api.chaoxing.com/mycourse/backclazzdata?view=json&mcode=';

  const initMenus = () => {
    if (document.querySelector('div.menubar[role="menubar"]')) {
      if (!document.querySelector('#first1000004')) {
        createMenuItem('1000004', '课程任务', 'icon-bj', URL_ACTIVITIES);
      }
      if (!document.querySelector('#first1000002')) {
        createMenuItem('1000002', '全部考试', 'icon-cj', URL_EXAM);
      }
      if (!document.querySelector('#first1000001')) {
        createMenuItem('1000001', '全部作业', 'icon-bj', URL_HOMEWORK);
      }
      // 待办任务放在最后添加，这样会显示在最前面
      if (!document.querySelector('#first1000003')) {
        createMenuItem('1000003', '待办任务', 'icon-bj', URL_TODO);
      }
    }
    else if (document.querySelector("ul.menu-list-ul")) {
      if (!document.querySelector('#first_chaoxing_assignment_activities')) {
        createMenuItemNew('activities', '课程任务', 'icon-bj', URL_ACTIVITIES);
      }
      if (!document.querySelector('#first_chaoxing_assignment_exam')) {
        createMenuItemNew('exam', '全部考试', 'icon-cj', URL_EXAM);
      }
      if (!document.querySelector('#first_chaoxing_assignment_homework')) {
        createMenuItemNew('homework', '全部作业', 'icon-bj', URL_HOMEWORK);
      }
      // 待办任务放在最后添加，这样会显示在最前面
      if (!document.querySelector('#first_chaoxing_assignment_todo')) {
        createMenuItemNew('todo', '待办任务', 'icon-bj', URL_TODO);
      }
    }
    else if (document.querySelector("ul.funclistul")) {
      createMenuItemLegacy('activities', '课程任务', 'zne_bj_icon', URL_ACTIVITIES);
      createMenuItemLegacy('exam', '全部考试', 'zne_jc_icon', URL_EXAM);
      createMenuItemLegacy('task', '全部作业', 'zne_bj_icon', URL_HOMEWORK);
      // 待办任务放在最后添加，这样会显示在最前面
      createMenuItemLegacy('todo', '待办任务', 'zne_bj_icon', URL_TODO);
    }
  };

  // 新标签页打开的菜单项创建函数
  const createMenuItemNewTab = (id, text, iconClass, targetUrl) => {
    const menubarElement = document.querySelector('div.menubar[role="menubar"]');
    if (menubarElement) {
      const a = document.createElement("a");
      a.setAttribute("role", "menuitem");
      a.setAttribute("tabindex", "-1");
      a.id = `first${id}`;
      a.href = targetUrl;
      a.target = "_blank";
      a.style.cursor = "pointer";

      const icon = document.createElement("span");
      icon.className = `icon-space ${iconClass}`;
      a.appendChild(icon);

      const h5 = document.createElement("h5");
      h5.title = text;
      h5.innerHTML = `<b>${text}</b>`;
      a.appendChild(h5);

      const arrow = document.createElement("span");
      arrow.className = "arrow icon-uniE900";
      a.appendChild(arrow);

      menubarElement.prepend(a);
    }
  };

  const createMenuItemNewTabNew = (id, text, iconClass, targetUrl) => {
    const menuListElement = document.querySelector("ul.menu-list-ul");
    if (menuListElement) {
      const li = document.createElement("li");
      li.setAttribute("level", "1");
      li.setAttribute("table-type", "1");
      li.setAttribute("data-id", `chaoxing-assignment-${id}`);

      const div = document.createElement("div");
      div.className = "label-item";
      div.setAttribute("role", "menuitem");
      div.setAttribute("level", "1");
      div.setAttribute("tabindex", "-1");
      div.setAttribute("name", text);
      div.setAttribute("id", `first_chaoxing_assignment_${id}`);
      div.style.cursor = "pointer";
      div.onclick = () => window.open(targetUrl, '_blank');

      const icon = document.createElement("span");
      icon.className = `icon-space ${iconClass}`;
      div.appendChild(icon);

      const h3 = document.createElement("h3");
      h3.title = text;
      h3.textContent = text;
      div.appendChild(h3);

      const arrow = document.createElement("span");
      arrow.className = "slide-arrow icon-h-arrow-l hide";
      div.appendChild(arrow);

      li.appendChild(div);
      li.appendChild(Object.assign(document.createElement("div"), { className: "school-level" })).appendChild(document.createElement("ul"));

      menuListElement.prepend(li);
    }
  };

  const createMenuItemLegacyNewTab = (id, name, iconClass, url) => {
    const list = document.querySelector("ul.funclistul");
    if (list && !document.querySelector(`#first_chaoxing_assignment_${id}`)) {
      const existingItem = list.querySelector('li a');
      if (existingItem) {
        const li = document.createElement("li");
        li.id = `first_chaoxing_assignment_${id}`;

        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.title = name;

        const span = document.createElement("span");
        span.className = iconClass;
        a.appendChild(span);
        a.appendChild(document.createTextNode(name));

        li.appendChild(a);
        list.prepend(li);
      }
    }
  };

  // --- 课程任务汇总功能 ---
  // GM_xmlhttpRequest 封装为 Promise
  const gmFetch = (url, options = {}) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || 'GET',
        url: url,
        headers: options.headers || {},
        responseType: options.responseType || 'text',
        onload: (response) => {
          if (response.status >= 200 && response.status < 400) {
            resolve(response);
          } else {
            reject(new Error(`Request failed: ${response.status}`));
          }
        },
        onerror: (error) => reject(error),
        ontimeout: () => reject(new Error('Request timeout'))
      });
    });
  };

  // 获取所有课程列表
  const fetchCourseList = async () => {
    try {
      console.log('[课程任务] 正在获取课程列表:', API_COURSE_LIST);
      const response = await gmFetch(API_COURSE_LIST);
      console.log('[课程任务] 课程列表原始响应:', response.responseText.substring(0, 1000));
      const data = JSON.parse(response.responseText);
      console.log('[课程任务] 解析后数据:', data);

      if (!data.channelList) {
        console.log('[课程任务] 没有 channelList');
        return [];
      }

      const courses = [];
      for (const channel of data.channelList) {
        const content = channel.content;
        if (!content) continue;

        // 检查是否是课程（有 course 对象）
        if (content.course && content.course.data && content.course.data.length > 0) {
          const courseInfo = content.course.data[0];

          // 尝试多种方式获取 clazzId
          let clazzId = '';
          if (content.clazz && content.clazz.data && content.clazz.data.length > 0) {
            clazzId = String(content.clazz.data[0].id);
          } else if (content.id) {
            clazzId = String(content.id);
          } else if (channel.key) {
            clazzId = String(channel.key);
          }

          // 只添加有 clazzId 的课程（API 需要此参数）
          if (courseInfo && clazzId) {
            courses.push({
              courseId: String(courseInfo.id),
              courseName: courseInfo.name || '未知课程',
              clazzId: clazzId,
              cpi: String(content.cpi || ''),
              teacherName: courseInfo.teacherfactor || ''
            });
            console.log(`[课程任务] 解析课程: ${courseInfo.name}, clazzId=${clazzId}`);
          } else if (courseInfo) {
            console.log(`[课程任务] 跳过无 clazzId 的课程: ${courseInfo.name}`);
          }
        }
      }
      console.log('[课程任务] 最终解析到课程:', courses.length, '个');
      return courses;
    } catch (error) {
      console.error('[课程任务] 获取课程列表失败:', error);
      return [];
    }
  };

  // 获取单个课程的活动/任务列表 (使用 JSON API)
  const fetchCourseActivities = async (course) => {
    try {
      // 使用正确的 JSON API 接口
      const timestamp = Date.now();
      const url = `https://mobilelearn.chaoxing.com/v2/apis/active/student/activelist?fid=0&courseId=${course.courseId}&classId=${course.clazzId}&showNotStartedActive=0&_=${timestamp}`;
      console.log(`[课程任务] 获取课程任务 ${course.courseName}:`, url);
      const response = await gmFetch(url);
      console.log(`[课程任务] ${course.courseName} 原始响应:`, response.responseText.substring(0, 300));

      const data = JSON.parse(response.responseText);
      console.log(`[课程任务] ${course.courseName} 解析后:`, data);

      // 尝试多种可能的数据结构
      let activeList = null;
      if (data.data && data.data.activeList) {
        activeList = data.data.activeList;
      } else if (data.activeList) {
        activeList = data.activeList;
      } else if (Array.isArray(data.data)) {
        activeList = data.data;
      } else if (Array.isArray(data)) {
        activeList = data;
      }

      if (!activeList || activeList.length === 0) {
        console.log(`[课程任务] ${course.courseName} 没有找到任务列表`);
        return [];
      }

      console.log(`[课程任务] ${course.courseName} 找到 ${activeList.length} 个任务`);

      const activities = activeList.map((item) => {
        // 活动类型映射
        const typeMap = {
          0: '签到', 2: '签到', 4: '抢答', 5: '主题讨论', 6: '投票',
          14: '问卷', 17: '直播', 23: '随堂练习', 35: '分组任务', 42: '随堂练习',
          43: '评分', 45: '拍照', 47: '作业', 64: '笔记'
        };

        // 状态判断：status=1 进行中，status=2 已结束
        const isOngoing = item.status === 1;
        const isEnded = item.status === 2;

        return {
          activeId: item.id || item.activeId || '',
          title: item.nameOne || item.name || item.title || '未知任务',
          type: typeMap[item.activeType] || typeMap[item.type] || `类型${item.activeType || item.type}`,
          status: isOngoing ? '进行中' : (isEnded ? '已结束' : '未开始'),
          time: item.startTime ? new Date(item.startTime).toLocaleString() : '',
          endTime: item.endTime ? new Date(item.endTime).toLocaleString() : '',
          courseName: course.courseName,
          courseId: course.courseId,
          clazzId: course.clazzId,
          cpi: course.cpi,
          finished: isEnded,
          ongoing: isOngoing,
          activeType: item.activeType || item.type
        };
      });

      return activities;
    } catch (error) {
      console.error(`[课程任务] 获取课程 ${course.courseName} 的任务失败:`, error);
      return [];
    }
  };

  // 获取所有课程的任务汇总
  const fetchAllActivities = async () => {
    const courses = await fetchCourseList();
    console.log(`[课程任务] 找到 ${courses.length} 个课程`);

    if (courses.length === 0) {
      return [];
    }

    // 并发获取所有课程的任务（限制并发数防止请求过多）
    const batchSize = 5;
    const allActivities = [];

    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(course => fetchCourseActivities(course))
      );
      allActivities.push(...batchResults.flat());
    }

    console.log(`[课程任务] 共获取 ${allActivities.length} 个任务`);
    return allActivities;
  };


  function extractTasks(doc = document) {
    let taskElements = doc.querySelectorAll("#chaoxing-assignment-wrapper ul.nav > li");
    if (taskElements.length === 0) taskElements = doc.querySelectorAll("ul.nav > li");

    const tasks = Array.from(taskElements).map((task) => {
      var _a, _b, _c;
      const optionElement = task.querySelector('div[role="option"]');
      let title = "";
      let status = "";
      let uncommitted = false;
      let course = "";
      let leftTime = "";
      if (optionElement) {
        title = ((_a = optionElement.querySelector("p")) == null ? void 0 : _a.textContent) || "";
        const statusElement = optionElement.querySelector("span:nth-of-type(1)");
        status = (statusElement == null ? void 0 : statusElement.textContent) || "";
        uncommitted = (statusElement == null ? void 0 : statusElement.className.includes("status")) || false;
        course = ((_b = optionElement.querySelector("span:nth-of-type(2)")) == null ? void 0 : _b.textContent) || "";
        leftTime = ((_c = optionElement.querySelector(".fr")) == null ? void 0 : _c.textContent) || "";
      }
      const raw = task.getAttribute("data") || "";
      let workId = "";
      let courseId = "";
      let clazzId = "";
      if (raw) {
        const rawUrl = new URL(raw);
        const searchParams = rawUrl.searchParams;
        workId = searchParams.get("taskrefId") || "";
        courseId = searchParams.get("courseId") || "";
        clazzId = searchParams.get("clazzId") || "";
      }
      return { type: "作业", title, status, uncommitted, course, leftTime, workId, courseId, clazzId, raw };
    });
    return tasks;
  }

  function extractExams(doc = document) {
    let examElements = doc.querySelectorAll("#chaoxing-assignment-wrapper ul.ks_list > li");
    if (examElements.length === 0) examElements = doc.querySelectorAll("ul.ks_list > li");

    const exams = Array.from(examElements).map((exam) => {
      var _a, _b, _c, _d;
      const dlElement = exam.querySelector("dl");
      const imgElement = exam.querySelector("div.ks_pic > img");
      let title = "";
      let timeLeft = "";
      let status = "";
      let expired = false;
      let examId = "";
      let courseId = "";
      let classId = "";
      if (dlElement) {
        title = ((_a = dlElement.querySelector("dt")) == null ? void 0 : _a.textContent) || "";
        timeLeft = ((_b = dlElement.querySelector("dd")) == null ? void 0 : _b.textContent) || "";
      }
      if (imgElement) {
        expired = ((_c = imgElement.getAttribute("src")) == null ? void 0 : _c.includes("ks_02")) || false;
      }
      status = ((_d = exam.querySelector("span.ks_state")) == null ? void 0 : _d.textContent) || "";
      const raw = exam.getAttribute("data") || "";
      if (raw) {
        let fullRaw = raw;
        if (raw.startsWith('/')) fullRaw = window.location.protocol + "//" + window.location.host + raw;
        try {
          const rawUrl = new URL(fullRaw);
          const searchParams = rawUrl.searchParams;
          examId = searchParams.get("taskrefId") || "";
          courseId = searchParams.get("courseId") || "";
          classId = searchParams.get("classId") || "";
        } catch (e) { }
      }
      const finished = status.includes("已完成") || status.includes("待批阅");
      return { type: "考试", title, status, timeLeft, expired, finished, examId, courseId, classId, raw };
    });
    return exams;
  }

  function extractExamsFromTable(doc = document) {
    let examRows = doc.querySelectorAll("table.dataTable tr.dataTr");
    if (examRows.length === 0) return [];

    const exams = Array.from(examRows).map((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 9) return null;

      const index = cells[0]?.textContent?.trim() || "";
      const title = cells[1]?.textContent?.trim() || "";
      const timeRange = cells[2]?.textContent?.trim() || "";
      const duration = cells[3]?.textContent?.trim() || "";
      const examStatus = cells[4]?.textContent?.trim() || "";
      const answerStatus = cells[5]?.textContent?.trim() || "";
      const score = cells[6]?.textContent?.trim() || "---";
      const examMethod = cells[7]?.textContent?.trim() || "";

      // 从操作链接中提取参数
      const actionLink = cells[8]?.querySelector("a");
      const actionText = actionLink?.textContent?.trim() || "";
      const onclickAttr = actionLink?.getAttribute("onclick") || "";

      let courseId = "";
      let classId = "";
      let examId = "";
      let raw = "";

      const goMatch = onclickAttr.match(/go\(['"]([^'"]+)['"]\)/);
      if (goMatch) {
        raw = goMatch[1];
        try {
          const fullUrl = new URL(raw, window.location.origin);
          const refer = fullUrl.searchParams.get("refer") || "";
          const referDecoded = decodeURIComponent(refer);
          const referUrl = new URL(referDecoded, window.location.origin);
          courseId = referUrl.searchParams.get("courseId") || fullUrl.searchParams.get("moocId") || "";
          classId = referUrl.searchParams.get("classId") || fullUrl.searchParams.get("clazzid") || "";
          examId = referUrl.searchParams.get("examId") || "";
        } catch (e) {
          const moocMatch = onclickAttr.match(/moocId=(\d+)/);
          const clazzMatch = onclickAttr.match(/clazzid=(\d+)/);
          const examIdMatch = onclickAttr.match(/examId=(\d+)/);
          if (moocMatch) courseId = moocMatch[1];
          if (clazzMatch) classId = clazzMatch[1];
          if (examIdMatch) examId = examIdMatch[1];
        }
      }

      const expired = examStatus.includes("已结束");
      const finished = answerStatus.includes("已完成") || answerStatus.includes("待批阅");
      const status = answerStatus || examStatus;
      const timeLeft = expired ? "已结束" : timeRange;

      return {
        type: "考试",
        title,
        status,
        timeLeft,
        timeRange,
        duration,
        examStatus,
        answerStatus,
        score,
        examMethod,
        expired,
        finished,
        examId,
        courseId,
        classId,
        raw
      };
    }).filter(e => e !== null);

    return exams;
  }

  const API_VISIT_COURSE = "https://mooc1.chaoxing.com/visit/stucoursemiddle?ismooc2=1";
  const API_EXAM_LIST = "https://mooc1.chaoxing.com/exam-ans/exam/test/examcode/examlist?edition=1&nohead=0&fid=";
  const API_OPEN_EXAM = "https://mooc1-api.chaoxing.com/exam-ans/exam/test/examcode/examnotes";
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("VuetifyStyle");

  // --- Vue Components ---
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "tasks-list",
    setup(__props) {
      const extractedData = extractTasks();
      const headers = [
        { key: "title", title: "作业名称" },
        { key: "course", title: "课程" },
        { key: "leftTime", title: "剩余时间" },
        { key: "status", title: "状态" },
        { key: "action", title: "", sortable: false }
      ];
      const search = vue.ref("");
      const getCourseLinkHref = (item) => {
        const courseId = item.courseId;
        const clazzId = item.clazzId;
        const requestUrl = new URL(API_VISIT_COURSE);
        requestUrl.searchParams.append("courseid", courseId);
        requestUrl.searchParams.append("clazzid", clazzId);
        requestUrl.searchParams.append("pageHeader", "8");
        return requestUrl.href;
      };
      return (_ctx, _cache) => {
        const _component_v_text_field = vue.resolveComponent("v-text-field");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_data_table = vue.resolveComponent("v-data-table");
        const _component_v_card = vue.resolveComponent("v-card");
        return vue.openBlock(), vue.createBlock(_component_v_card, { title: "作业列表", variant: "flat" }, {
          text: vue.withCtx(() => [
            vue.createVNode(_component_v_text_field, {
              modelValue: search.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
              label: "搜索", "prepend-inner-icon": "search", variant: "outlined", "hide-details": "", "single-line": ""
            })
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_data_table, {
              items: vue.unref(extractedData), search: search.value, hover: "", headers, sticky: "", "items-per-page": "-1", "hide-default-footer": ""
            }, {
              "item.action": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_btn, {
                  variant: item.uncommitted ? "tonal" : "plain", color: "primary", href: getCourseLinkHref(item), target: "_blank"
                }, {
                  default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(item.uncommitted ? "立即完成" : "查看详情"), 1)])
                }, 1032, ["variant", "href"])
              ])
            }, 8, ["items", "search"])
          ])
        });
      };
    }
  });

  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$2);
      };
    }
  });

  cssLoader("material-design-icons-iconfont/dist/material-design-icons.css");

  // --- Vuetify Helper Functions (恢复原版代码) ---
  // 这些是原脚本为了适配图标组件而手写的一堆辅助函数，之前被误删
  function isObject(obj) {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
  }
  function pick(obj, paths) {
    const found = {};
    const keys = new Set(Object.keys(obj));
    for (const path of paths) {
      if (keys.has(path)) {
        found[path] = obj[path];
      }
    }
    return found;
  }
  function mergeDeep() {
    let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let target = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let arrayFn = arguments.length > 2 ? arguments[2] : void 0;
    const out = {};
    for (const key in source) {
      out[key] = source[key];
    }
    for (const key in target) {
      const sourceProperty = source[key];
      const targetProperty = target[key];
      if (isObject(sourceProperty) && isObject(targetProperty)) {
        out[key] = mergeDeep(sourceProperty, targetProperty, arrayFn);
        continue;
      }
      if (Array.isArray(sourceProperty) && Array.isArray(targetProperty) && arrayFn) {
        out[key] = arrayFn(sourceProperty, targetProperty);
        continue;
      }
      out[key] = targetProperty;
    }
    return out;
  }
  function toKebabCase() {
    let str = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    if (toKebabCase.cache.has(str))
      return toKebabCase.cache.get(str);
    const kebab = str.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
    toKebabCase.cache.set(str, kebab);
    return kebab;
  }
  toKebabCase.cache = /* @__PURE__ */ new Map();
  function consoleWarn(message) {
    vue.warn(`Vuetify: ${message}`);
  }
  function propsFactory(props, source) {
    return (defaults) => {
      return Object.keys(props).reduce((obj, prop) => {
        const isObjectDefinition = typeof props[prop] === "object" && props[prop] != null && !Array.isArray(props[prop]);
        const definition = isObjectDefinition ? props[prop] : {
          type: props[prop]
        };
        if (defaults && prop in defaults) {
          obj[prop] = {
            ...definition,
            default: defaults[prop]
          };
        } else {
          obj[prop] = definition;
        }
        if (source && !obj[prop].source) {
          obj[prop].source = source;
        }
        return obj;
      }, {});
    };
  }
  const DefaultsSymbol = Symbol.for("vuetify:defaults");
  function injectDefaults() {
    const defaults = vue.inject(DefaultsSymbol);
    if (!defaults)
      throw new Error("[Vuetify] Could not find defaults instance");
    return defaults;
  }
  function propIsDefined(vnode, prop) {
    var _a, _b;
    return typeof ((_a = vnode.props) == null ? void 0 : _a[prop]) !== "undefined" || typeof ((_b = vnode.props) == null ? void 0 : _b[toKebabCase(prop)]) !== "undefined";
  }
  function internalUseDefaults() {
    let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let name = arguments.length > 1 ? arguments[1] : void 0;
    let defaults = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : injectDefaults();
    const vm = getCurrentInstance("useDefaults");
    name = name ?? vm.type.name ?? vm.type.__name;
    if (!name) {
      throw new Error("[Vuetify] Could not determine component name");
    }
    const componentDefaults = vue.computed(() => {
      var _a;
      return (_a = defaults.value) == null ? void 0 : _a[props._as ?? name];
    });
    const _props = new Proxy(props, {
      get(target, prop) {
        var _a, _b, _c, _d;
        const propValue = Reflect.get(target, prop);
        if (prop === "class" || prop === "style") {
          return [(_a = componentDefaults.value) == null ? void 0 : _a[prop], propValue].filter((v) => v != null);
        } else if (typeof prop === "string" && !propIsDefined(vm.vnode, prop)) {
          return ((_b = componentDefaults.value) == null ? void 0 : _b[prop]) ?? ((_d = (_c = defaults.value) == null ? void 0 : _c.global) == null ? void 0 : _d[prop]) ?? propValue;
        }
        return propValue;
      }
    });
    const _subcomponentDefaults = vue.shallowRef();
    vue.watchEffect(() => {
      if (componentDefaults.value) {
        const subComponents = Object.entries(componentDefaults.value).filter((_ref) => {
          let [key] = _ref;
          return key.startsWith(key[0].toUpperCase());
        });
        _subcomponentDefaults.value = subComponents.length ? Object.fromEntries(subComponents) : void 0;
      } else {
        _subcomponentDefaults.value = void 0;
      }
    });
    function provideSubDefaults() {
      const injected = injectSelf(DefaultsSymbol, vm);
      vue.provide(DefaultsSymbol, vue.computed(() => {
        return _subcomponentDefaults.value ? mergeDeep((injected == null ? void 0 : injected.value) ?? {}, _subcomponentDefaults.value) : injected == null ? void 0 : injected.value;
      }));
    }
    return {
      props: _props,
      provideSubDefaults
    };
  }
  function defineComponent(options) {
    options._setup = options._setup ?? options.setup;
    if (!options.name) {
      consoleWarn("The component is missing an explicit name, unable to generate default prop value");
      return options;
    }
    if (options._setup) {
      options.props = propsFactory(options.props ?? {}, options.name)();
      const propKeys = Object.keys(options.props).filter((key) => key !== "class" && key !== "style");
      options.filterProps = function filterProps(props) {
        return pick(props, propKeys);
      };
      options.props._as = String;
      options.setup = function setup(props, ctx) {
        const defaults = injectDefaults();
        if (!defaults.value)
          return options._setup(props, ctx);
        const {
          props: _props,
          provideSubDefaults
        } = internalUseDefaults(props, props._as ?? options.name, defaults);
        const setupBindings = options._setup(_props, ctx);
        provideSubDefaults();
        return setupBindings;
      };
    }
    return options;
  }
  function genericComponent() {
    let exposeDefaults = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    return (options) => (exposeDefaults ? defineComponent : vue.defineComponent)(options);
  }
  function getCurrentInstance(name, message) {
    const vm = vue.getCurrentInstance();
    if (!vm) {
      throw new Error(`[Vuetify] ${name} ${"must be called from inside a setup function"}`);
    }
    return vm;
  }
  function injectSelf(key) {
    let vm = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstance("injectSelf");
    const {
      provides
    } = vm;
    if (provides && key in provides) {
      return provides[key];
    }
    return void 0;
  }
  const IconValue = [String, Function, Object, Array];
  const makeIconProps = propsFactory({
    icon: {
      type: IconValue
    },
    tag: {
      type: String,
      required: true
    }
  }, "icon");
  genericComponent()({
    name: "VComponentIcon",
    props: makeIconProps(),
    setup(props, _ref) {
      let {
        slots
      } = _ref;
      return () => {
        const Icon = props.icon;
        return vue.createVNode(props.tag, null, {
          default: () => {
            var _a;
            return [props.icon ? vue.createVNode(Icon, null, null) : (_a = slots.default) == null ? void 0 : _a.call(slots)];
          }
        });
      };
    }
  });
  defineComponent({
    name: "VSvgIcon",
    inheritAttrs: false,
    props: makeIconProps(),
    setup(props, _ref2) {
      let {
        attrs
      } = _ref2;
      return () => {
        return vue.createVNode(props.tag, vue.mergeProps(attrs, {
          "style": null
        }), {
          default: () => [vue.createVNode("svg", {
            "class": "v-icon__svg",
            "xmlns": "http://www.w3.org/2000/svg",
            "viewBox": "0 0 24 24",
            "role": "img",
            "aria-hidden": "true"
          }, [Array.isArray(props.icon) ? props.icon.map((path) => Array.isArray(path) ? vue.createVNode("path", {
            "d": path[0],
            "fill-opacity": path[1]
          }, null) : vue.createVNode("path", {
            "d": path
          }, null)) : vue.createVNode("path", {
            "d": props.icon
          }, null)])]
        });
      };
    }
  });
  const VLigatureIcon = defineComponent({
    name: "VLigatureIcon",
    props: makeIconProps(),
    setup(props) {
      return () => {
        return vue.createVNode(props.tag, null, {
          default: () => [props.icon]
        });
      };
    }
  });
  defineComponent({
    name: "VClassIcon",
    props: makeIconProps(),
    setup(props) {
      return () => {
        return vue.createVNode(props.tag, {
          "class": props.icon
        }, null);
      };
    }
  });
  const aliases = {
    collapse: "keyboard_arrow_up",
    complete: "check",
    cancel: "cancel",
    close: "close",
    delete: "cancel",
    clear: "cancel",
    success: "check_circle",
    info: "info",
    warning: "priority_high",
    error: "warning",
    prev: "chevron_left",
    next: "chevron_right",
    checkboxOn: "check_box",
    checkboxOff: "check_box_outline_blank",
    checkboxIndeterminate: "indeterminate_check_box",
    delimiter: "fiber_manual_record",
    sortAsc: "arrow_upward",
    sortDesc: "arrow_downward",
    expand: "keyboard_arrow_down",
    menu: "menu",
    subgroup: "arrow_drop_down",
    dropdown: "arrow_drop_down",
    radioOn: "radio_button_checked",
    radioOff: "radio_button_unchecked",
    edit: "edit",
    ratingEmpty: "star_border",
    ratingFull: "star",
    ratingHalf: "star_half",
    loading: "cached",
    first: "first_page",
    last: "last_page",
    unfold: "unfold_more",
    file: "attach_file",
    plus: "add",
    minus: "remove",
    calendar: "event",
    treeviewCollapse: "arrow_drop_down",
    treeviewExpand: "arrow_right",
    eyeDropper: "colorize"
  };
  const md = {
    component: (props) => vue.h(VLigatureIcon, {
      ...props,
      class: "material-icons"
    })
  };

  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "exams-list",
    setup(__props) {
      const extractedData = extractExams();
      const headers = [
        { key: "title", title: "考试名称" },
        { key: "timeLeft", title: "剩余时间" },
        { key: "status", title: "状态" },
        { key: "action", title: "", sortable: false }
      ];
      const search = vue.ref("");
      const getCourseLinkHref = (item) => {
        const requestUrl = new URL(API_OPEN_EXAM);
        requestUrl.searchParams.append("courseId", item.courseId);
        requestUrl.searchParams.append("classId", item.classId);
        requestUrl.searchParams.append("examId", item.examId);
        return requestUrl.href;
      };
      return (_ctx, _cache) => {
        const _component_v_text_field = vue.resolveComponent("v-text-field");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_data_table = vue.resolveComponent("v-data-table");
        const _component_v_card = vue.resolveComponent("v-card");
        return vue.openBlock(), vue.createBlock(_component_v_card, { title: "考试列表", variant: "flat" }, {
          text: vue.withCtx(() => [
            vue.createVNode(_component_v_text_field, {
              modelValue: search.value, "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
              label: "搜索", "prepend-inner-icon": "search", variant: "outlined", "hide-details": "", "single-line": ""
            })
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_data_table, {
              items: vue.unref(extractedData), search: search.value, hover: "", headers, sticky: "", "items-per-page": "-1", "hide-default-footer": ""
            }, {
              "item.action": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_btn, {
                  variant: item.finished || item.expired ? "plain" : "tonal", color: "primary", href: getCourseLinkHref(item), target: "_blank"
                }, {
                  default: vue.withCtx(() => [vue.createTextVNode(vue.toDisplayString(item.finished || item.expired ? "查看详情" : "前往考试"), 1)])
                }, 1032, ["variant", "href"])
              ])
            }, 8, ["items", "search"])
          ])
        });
      };
    }
  });

  const _sfc_todo = /* @__PURE__ */ vue.defineComponent({
    __name: "todo-list",
    setup(__props) {
      const allTodoItems = vue.ref([]);  // 所有待办项
      const loading = vue.ref(true);
      const search = vue.ref("");
      const showActivities = vue.ref(true);  // 是否显示课程任务（默认开启）
      const showUrgentOnly = vue.ref(false);  // 是否只显示紧急任务

      // 计算属性：根据开关过滤显示的列表
      const todoList = vue.computed(() => {
        let list = allTodoItems.value;

        // 如果启用紧急模式，只显示紧急任务
        if (showUrgentOnly.value) {
          return urgentTasks.value;
        }

        // 如果关闭课程任务显示，过滤掉 isActivity 项
        if (!showActivities.value) {
          list = list.filter(item => !item.isActivity);
        }

        return list;
      });

      const headers = [
        { key: "type", title: "类型" },
        { key: "title", title: "任务名称" },
        { key: "course", title: "课程" },
        { key: "info", title: "截止/剩余时间" },
        { key: "status", title: "状态" },
        { key: "action", title: "", sortable: false }
      ];

      // 检测24小时内截止的紧急任务
      const urgentTasks = vue.computed(() => {
        return allTodoItems.value.filter(item => {
          // 获取剩余时间字符串（作业用 leftTime，考试用 timeLeft）
          const timeStr = item.leftTime || item.timeLeft || item.info || '';

          // 尝试解析截止时间
          if (timeStr.includes('小时')) {
            const hours = parseInt(timeStr);
            return !isNaN(hours) && hours <= 24;
          }
          if (timeStr.includes('天')) {
            const days = parseInt(timeStr);
            return !isNaN(days) && days < 1;
          }
          if (timeStr.includes('分钟') || timeStr.includes('分')) {
            return true; // 还剩分钟肯定是紧急的
          }
          // 进行中的课程任务也算紧急
          if (item.isActivity && item.status === '进行中') {
            return true;
          }
          return false;
        });
      });

      const getLink = (item) => {
        if (item.isActivity) {
          // 课程活动跳转到课程页面
          const requestUrl = new URL(API_VISIT_COURSE);
          requestUrl.searchParams.append("courseid", item.courseId);
          requestUrl.searchParams.append("clazzid", item.clazzId);
          requestUrl.searchParams.append("pageHeader", "0"); // 任务页面
          return requestUrl.href;
        } else if (item.type === "作业") {
          const requestUrl = new URL(API_VISIT_COURSE);
          requestUrl.searchParams.append("courseid", item.courseId);
          requestUrl.searchParams.append("clazzid", item.clazzId);
          requestUrl.searchParams.append("pageHeader", "8");
          return requestUrl.href;
        } else {
          const requestUrl = new URL(API_OPEN_EXAM);
          requestUrl.searchParams.append("courseId", item.courseId);
          requestUrl.searchParams.append("classId", item.classId);
          requestUrl.searchParams.append("examId", item.examId);
          return requestUrl.href;
        }
      };

      vue.onMounted(async () => {
        const currentTasks = extractTasks();
        const pendingTasks = currentTasks.filter(t => t.uncommitted).map(t => ({
          ...t,
          info: t.leftTime
        }));

        let pendingExams = [];
        const seenExamIds = new Set();

        try {
          const res1 = await fetch('https://mooc1-api.chaoxing.com/exam-ans/exam/phone/examcode');
          const text1 = await res1.text();
          const parser1 = new DOMParser();
          const doc1 = parser1.parseFromString(text1, 'text/html');
          const exams1 = extractExams(doc1);
          exams1.filter(e => !e.finished && !e.expired).forEach(e => {
            const key = e.examId || e.title;
            if (!seenExamIds.has(key)) {
              seenExamIds.add(key);
              pendingExams.push({
                ...e,
                course: "考试课程",
                info: e.timeLeft
              });
            }
          });
        } catch (e) {
          console.error("Fetch exams from old API failed", e);
        }

        try {
          const res2 = await fetch(API_EXAM_LIST);
          const text2 = await res2.text();
          const parser2 = new DOMParser();
          const doc2 = parser2.parseFromString(text2, 'text/html');
          const exams2 = extractExamsFromTable(doc2);
          exams2.filter(e => !e.finished && !e.expired).forEach(e => {
            const key = e.examId || e.title;
            if (!seenExamIds.has(key)) {
              seenExamIds.add(key);
              pendingExams.push({
                ...e,
                course: "考试课程",
                info: e.timeLeft
              });
            }
          });
        } catch (e) {
          console.error("Fetch exams from new API failed", e);
        }

        // 获取进行中的课程任务（签到、讨论等）
        let ongoingActivities = [];
        try {
          const courses = await fetchCourseList();
          console.log('[待办任务] 获取到课程:', courses.length, '个');

          // 限制并发数
          const batchSize = 5;
          for (let i = 0; i < courses.length; i += batchSize) {
            const batch = courses.slice(i, i + batchSize);
            const batchResults = await Promise.all(
              batch.map(course => fetchCourseActivities(course))
            );
            batchResults.flat()
              .filter(activity => activity.ongoing)
              .forEach(activity => {
                ongoingActivities.push({
                  type: activity.type,
                  title: activity.title,
                  course: activity.courseName,
                  info: activity.endTime || '进行中',
                  status: '进行中',
                  courseId: activity.courseId,
                  clazzId: activity.clazzId,
                  isActivity: true
                });
              });
          }
          console.log('[待办任务] 进行中任务:', ongoingActivities.length, '个');
        } catch (e) {
          console.error('[待办任务] 获取课程任务失败:', e);
        }

        // 排序：作业和考试在前，课程任务在后
        allTodoItems.value = [...pendingTasks, ...pendingExams, ...ongoingActivities];
        loading.value = false;
      });

      return (_ctx, _cache) => {
        const _component_v_text_field = vue.resolveComponent("v-text-field");
        const _component_v_switch = vue.resolveComponent("v-switch");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_data_table = vue.resolveComponent("v-data-table");
        const _component_v_card = vue.resolveComponent("v-card");
        const _component_v_chip = vue.resolveComponent("v-chip");
        const _component_v_row = vue.resolveComponent("v-row");
        const _component_v_col = vue.resolveComponent("v-col");
        const _component_v_alert = vue.resolveComponent("v-alert");

        return vue.openBlock(), vue.createBlock(_component_v_card, {
          title: showUrgentOnly.value ? "🚨 紧急任务" : "待办任务",
          variant: "flat"
        }, {
          text: vue.withCtx(() => [
            // 紧急模式下显示"返回全部"按钮
            showUrgentOnly.value ? vue.createVNode(_component_v_alert, {
              type: "info",
              variant: "tonal",
              class: "mb-4"
            }, {
              default: () => [
                vue.createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                  vue.createVNode("span", {}, `正在查看 ${urgentTasks.value.length} 个紧急任务`),
                  vue.createVNode(_component_v_btn, {
                    variant: "outlined",
                    size: "small",
                    onClick: () => { showUrgentOnly.value = false; }
                  }, { default: () => [vue.createTextVNode("← 返回全部待办")] })
                ])
              ]
            }) : (
              // 非紧急模式下显示紧急任务提醒
              urgentTasks.value.length > 0 ? vue.createVNode(_component_v_alert, {
                type: "warning",
                variant: "tonal",
                class: "mb-4",
                prominent: true,
                icon: "warning"
              }, {
                default: () => [
                  vue.createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                    vue.createVNode("div", {}, [
                      vue.createVNode("div", { class: "font-weight-bold" }, `⚠️ 有 ${urgentTasks.value.length} 个任务即将到期！`),
                      vue.createVNode("div", { class: "text-caption" },
                        urgentTasks.value.slice(0, 2).map(t => t.title).join('、') +
                        (urgentTasks.value.length > 2 ? ` 等${urgentTasks.value.length}个任务` : '')
                      )
                    ]),
                    vue.createVNode(_component_v_btn, {
                      variant: "elevated",
                      color: "warning",
                      size: "small",
                      onClick: () => { showUrgentOnly.value = true; }
                    }, { default: () => [vue.createTextVNode("去查看 →")] })
                  ])
                ]
              }) : null
            ),
            vue.createVNode(_component_v_row, { align: "center", class: "mb-2" }, {
              default: () => [
                vue.createVNode(_component_v_col, { cols: "8" }, {
                  default: () => [
                    vue.createVNode(_component_v_text_field, {
                      modelValue: search.value, "onUpdate:modelValue": ($event) => search.value = $event,
                      label: "搜索待办", "prepend-inner-icon": "search", variant: "outlined", "hide-details": "", "single-line": "", density: "compact"
                    })
                  ]
                }),
                vue.createVNode(_component_v_col, { cols: "4" }, {
                  default: () => [
                    vue.createVNode(_component_v_switch, {
                      modelValue: showActivities.value, "onUpdate:modelValue": ($event) => showActivities.value = $event,
                      label: "显示课程任务", color: "primary", "hide-details": "", density: "compact"
                    })
                  ]
                })
              ]
            })
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_data_table, {
              items: todoList.value, loading: loading.value, search: search.value, hover: "", headers, sticky: "", "items-per-page": "-1", "hide-default-footer": ""
            }, {
              "item.type": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_chip, {
                  color: item.isActivity ? 'orange' : (item.type === '作业' ? 'blue' : 'purple'),
                  size: 'small',
                  label: ''
                }, { default: () => [vue.createTextVNode(item.type)] })
              ]),
              "item.action": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_btn, {
                  variant: "tonal", color: "error", href: getLink(item), target: "_blank"
                }, {
                  default: vue.withCtx(() => [vue.createTextVNode("立即去办")])
                }, 8, ["href"])
              ])
            }, 8, ["items", "loading", "search"])
          ])
        });
      };
    }
  });

  // 课程任务列表组件
  const _sfc_activities = /* @__PURE__ */ vue.defineComponent({
    __name: "activities-list",
    setup(__props) {
      const activitiesList = vue.ref([]);
      const loading = vue.ref(true);
      const search = vue.ref("");
      const progress = vue.ref("");

      const headers = [
        { key: "courseName", title: "课程" },
        { key: "title", title: "任务名称" },
        { key: "type", title: "类型" },
        { key: "endTime", title: "结束时间" },
        { key: "status", title: "状态" },
        { key: "action", title: "", sortable: false }
      ];

      const getCourseLink = (item) => {
        const requestUrl = new URL(API_VISIT_COURSE);
        requestUrl.searchParams.append("courseid", item.courseId);
        requestUrl.searchParams.append("clazzid", item.clazzId);
        return requestUrl.href;
      };

      vue.onMounted(async () => {
        try {
          progress.value = "正在获取课程列表...";
          const courses = await fetchCourseList();
          progress.value = `找到 ${courses.length} 个课程，正在获取任务...`;

          const allActivities = [];
          const batchSize = 3;

          for (let i = 0; i < courses.length; i += batchSize) {
            const batch = courses.slice(i, i + batchSize);
            progress.value = `正在获取课程任务 (${Math.min(i + batchSize, courses.length)}/${courses.length})...`;

            const batchResults = await Promise.all(
              batch.map(course => fetchCourseActivities(course))
            );
            allActivities.push(...batchResults.flat());
          }

          activitiesList.value = allActivities;
          progress.value = "";
        } catch (error) {
          console.error('[课程任务] 加载失败:', error);
          progress.value = "加载失败，请刷新重试";
        } finally {
          loading.value = false;
        }
      });

      return (_ctx, _cache) => {
        const _component_v_text_field = vue.resolveComponent("v-text-field");
        const _component_v_chip = vue.resolveComponent("v-chip");
        const _component_v_btn = vue.resolveComponent("v-btn");
        const _component_v_data_table = vue.resolveComponent("v-data-table");
        const _component_v_card = vue.resolveComponent("v-card");
        const _component_v_progress_linear = vue.resolveComponent("v-progress-linear");

        return vue.openBlock(), vue.createBlock(_component_v_card, { title: "课程任务列表", variant: "flat", subtitle: progress.value }, {
          text: vue.withCtx(() => [
            vue.createVNode(_component_v_text_field, {
              modelValue: search.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
              label: "搜索", "prepend-inner-icon": "search", variant: "outlined", "hide-details": "", "single-line": ""
            }),
            loading.value ? vue.createVNode(_component_v_progress_linear, { indeterminate: "", color: "primary", class: "mt-4" }) : null
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_v_data_table, {
              items: activitiesList.value, loading: loading.value, search: search.value, hover: "", headers, sticky: "", "items-per-page": "-1", "hide-default-footer": ""
            }, {
              "item.type": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_chip, {
                  color: 'teal',
                  size: 'small',
                  label: ''
                }, { default: () => [vue.createTextVNode(item.type || '活动')] })
              ]),
              "item.status": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_chip, {
                  color: item.ongoing ? 'orange' : 'grey',
                  size: 'small',
                  label: ''
                }, { default: () => [vue.createTextVNode(item.status)] })
              ]),
              "item.action": vue.withCtx(({ item }) => [
                vue.createVNode(_component_v_btn, {
                  variant: item.finished ? "plain" : "tonal", color: "primary", href: getCourseLink(item), target: "_blank"
                }, {
                  default: vue.withCtx(() => [vue.createTextVNode(item.finished ? "查看详情" : "前往完成")])
                }, 8, ["variant", "href"])
              ])
            }, 8, ["items", "loading", "search"])
          ])
        }, 8, ["subtitle"]);
      };
    }
  });

  const appendApp = () => {
    // 这里的 aliases 和 md 现在能正确引用到了
    const vuetify$1 = vuetify.createVuetify({
      icons: {
        defaultSet: "md",
        aliases,
        sets: {
          md
        }
      }
    });
    let app = _sfc_main$1;
    const urlDetect2 = urlDetection();
    if (urlDetect2 === "homework") app = _sfc_main$2;
    if (urlDetect2 === "exam") app = _sfc_main;
    if (urlDetect2 === "todo") app = _sfc_todo;
    if (urlDetect2 === "activities") app = _sfc_activities;

    vue.createApp(app).use(vuetify$1).mount(
      (() => {
        const app2 = document.createElement("div");
        document.body.append(app2);
        return app2;
      })()
    );
  };
  const urlDetect = urlDetection();
  if (urlDetect === "homework" || urlDetect === "todo" || urlDetect === "activities") {
    wrapElements();
    removeStyles();
    removeScripts();
    appendApp();
  }
  if (urlDetect === "exam") {
    wrapElements();
    removeStyles();
    removeScripts();
    keepRemoveHtmlStyle();
    appendApp();
  }
  if (urlDetect === "home") {
    fixCssConflict();
    initMenus();
    // 延迟后自动点击待办任务菜单
    setTimeout(() => {
      const todoMenuItem = document.querySelector('#first1000003') ||
        document.querySelector('#first_chaoxing_assignment_todo');
      if (todoMenuItem) {
        todoMenuItem.click();
        console.log('[脚本] 自动切换到待办任务');
      }
    }, 500);
  }
  if (urlDetect === "legacyHome") {
    fixCssConflict();
    initMenus();
    // 延迟后自动点击待办任务菜单
    setTimeout(() => {
      const todoMenuItem = document.querySelector('#first_chaoxing_assignment_todo') ||
        document.querySelector('a[href*="chaoxing-assignment-todo"]');
      if (todoMenuItem) {
        todoMenuItem.click();
        console.log('[脚本] 自动切换到待办任务');
      }
    }, 500);
  }

})(Vuetify, Vue);