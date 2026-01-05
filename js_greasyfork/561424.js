// ==UserScript==
// @name         PS Calendar to ICS (iZJU)
// @namespace    https://github.com/THEzsc/Peoplesoft-Calendar-to-ICS
// @version      0.5.1
// @description  将 PeopleSoft「我的每周课程表-列表查看」导出为 ICS 文件（支持中文/英文标签，Asia/Shanghai）
// @author       You
// @match        https://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/*
// @match        file:///*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561424/PS%20Calendar%20to%20ICS%20%28iZJU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561424/PS%20Calendar%20to%20ICS%20%28iZJU%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const APP_NAME = "PS Calendar to ICS";
  const TZID = "Asia/Shanghai"; // China Standard Time (no DST)
  const HOST_HINT = "scrsprd.zju.edu.cn";
  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  // 2025-2026学年春夏学期学术日历
  const ACADEMIC_CALENDAR_2025_2026 = {
    holidays: [
      // 寒假（至报到注册前）
      { start: new Date(2026, 0, 26), end: new Date(2026, 2, 1), name: "寒假" },
      // 清明节放假
      { start: new Date(2026, 3, 5), end: new Date(2026, 3, 5), name: "清明节放假" },
      // 劳动节放假
      { start: new Date(2026, 4, 1), end: new Date(2026, 4, 5), name: "劳动节放假" },
      // 端午节放假
      { start: new Date(2026, 5, 19), end: new Date(2026, 5, 19), name: "端午节放假" }
    ],
    makeupClasses: [
      // 劳动节调休：5月9日（周六）补5月1日（周五）课
      { date: new Date(2026, 4, 9), originalDay: 5, name: "劳动节调休补班" }
    ],
    specialEvents: [
      // 春夏学期课程开始
      { date: new Date(2026, 0, 12), name: "春夏学期课程开始", type: "allday" },
      // 学生寒假开始（2月17日春节）
      { date: new Date(2026, 0, 26), name: "学生寒假开始（2月17日春节）", type: "allday" },
      // 本科生、研究生报到注册，春季入学博士新生报到
      { date: new Date(2026, 2, 1), name: "本科生、研究生报到注册，春季入学博士新生报到", type: "allday" },
      // 春夏学期开始上课
      { date: new Date(2026, 2, 2), name: "春夏学期开始上课", type: "allday" },
      // 春季研究生毕业教育及离校（含春季毕业典礼）
      { start: new Date(2026, 2, 21), end: new Date(2026, 2, 30), name: "春季研究生毕业教育及离校（含春季毕业典礼）", type: "allday" },
      // 清明节放假（调休、补课安排另行通知）
      { date: new Date(2026, 3, 5), name: "清明节放假（调休、补课安排另行通知）", type: "allday" },
      // 春季校运动会
      { start: new Date(2026, 3, 18), end: new Date(2026, 3, 19), name: "春季校运动会", type: "allday" },
      // 劳动节放假（调休、补课安排另行通知）
      { start: new Date(2026, 4, 1), end: new Date(2026, 4, 5), name: "劳动节放假（调休、补课安排另行通知）", type: "allday" },
      // 校庆日
      { date: new Date(2026, 4, 21), name: "校庆日", type: "allday" },
      // 课程结束
      { date: new Date(2026, 4, 22), name: "课程结束", type: "allday" },
      // 复习与考试
      { start: new Date(2026, 4, 23), end: new Date(2026, 5, 3), name: "复习与考试", type: "allday" },
      // 学生暑假开始（非毕业生）
      { date: new Date(2026, 5, 4), name: "学生暑假开始（非毕业生）", type: "allday" },
      // 端午节放假
      { date: new Date(2026, 5, 19), name: "端午节放假", type: "allday" },
      // 毕业教育及离校（含夏季毕业典礼）
      { start: new Date(2026, 5, 21), end: new Date(2026, 5, 30), name: "毕业教育及离校（含夏季毕业典礼）", type: "allday" }
    ]
  };

  /**
   * Main bootstrap function
   */
  function bootstrap() {
    tryInjectForDocument(window.document);
    observeForSchedule(window.document);

    // Handle target iframes
    const iframeSelector = "iframe.ps_target-iframe";
    const iframeList = Array.from(document.querySelectorAll(iframeSelector));
    iframeList.forEach((iframe) => attachIframeListener(iframe));

    // Observe future iframes
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLIFrameElement &&
              node.classList.contains("ps_target-iframe")
            ) {
              attachIframeListener(node);
            }
          });
        }
      }
    });
    obs.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
  }

  function attachIframeListener(iframe) {
    iframe.addEventListener("load", () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        tryInjectForDocument(doc);
        observeForSchedule(doc);
      } catch (_) {
        // ignore cross-origin issues
      }
    });
  }

  function observeForSchedule(doc) {
    const observer = new MutationObserver(() => {
      if (findScheduleRoot(doc)) {
        injectExportButton(doc);
      }
    });
    observer.observe(doc.documentElement || doc.body, {
      subtree: true,
      childList: true,
      attributes: false,
    });
  }

  function tryInjectForDocument(doc) {
    if (findScheduleRoot(doc)) {
      injectExportButton(doc);
    }
  }

  function findScheduleRoot(doc) {
    return doc.querySelector('table[id^="CLASS_MTG_VW$scroll"]') ||
           doc.querySelector('div[id^="win0divDERIVED_REGFRM1_DESCR20"]');
  }

  function injectExportButton(doc) {
    // Avoid duplicate buttons
    if (doc.querySelector("#ps-ics-export-btn")) return;

    const scheduleRoot = findScheduleRoot(doc);
    if (!scheduleRoot) return;

    // Create export button
    const btn = doc.createElement("button");
    btn.id = "ps-ics-export-btn";
    btn.textContent = "导出 ICS";
    btn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 8px 16px;
      background: #007cba;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-family: sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    
    btn.addEventListener("click", () => {
      try {
        console.log(APP_NAME, "开始解析课程表...");
        const parsed = parseScheduleFromDocument(doc);
        console.log(APP_NAME, "解析结果:", parsed);
        
        if (!parsed.events || parsed.events.length === 0) {
          alert("未找到课程信息。请确保您处于\"列表查看\"界面。");
          return;
        }
        
        const icsText = buildICS(parsed);
        const fileName = buildSuggestedFileName(parsed);
        triggerDownload(icsText, fileName);
        console.log(APP_NAME, "导出完成，文件名:", fileName);
      } catch (err) {
        console.error(APP_NAME, err);
        alert("导出失败：" + (err && err.message ? err.message : String(err)));
      }
    });

    // Insert button into the document
    doc.body.appendChild(btn);
    console.log(APP_NAME, "导出按钮已注入");
  }

  /**
   * Parse schedule from document using real HTML structure
   */
  function parseScheduleFromDocument(doc) {
    const events = [];
    let termTitle = detectTermTitle(doc);

    // Find all course containers
    const courseContainers = Array.from(
      doc.querySelectorAll('div[id^="win0divDERIVED_REGFRM1_DESCR20"]')
    ).filter(container => container.querySelector('table[id^="CLASS_MTG_VW$scroll"]'));
    
    console.log(APP_NAME, `找到 ${courseContainers.length} 个课程容器`);

    for (const container of courseContainers) {
      try {
        const courseEvents = parseCourseContainer(container);
        events.push(...courseEvents);
      } catch (err) {
        console.warn(APP_NAME, "解析课程容器时出错:", err);
      }
    }

    return { termTitle, events };
  }

  function parseCourseContainer(container) {
    const events = [];
    
    // Get course title from PAGROUPDIVIDER
    const courseTitleElement = container.querySelector('td.PAGROUPDIVIDER');
    const courseTitle = courseTitleElement ? cleanText(courseTitleElement.textContent) : "";

    console.log(APP_NAME, `解析课程: ${courseTitle || "课程"}`);

    // Find the meeting times table
    const meetingTable = container.querySelector('table[id^="CLASS_MTG_VW$scroll"]');
    if (!meetingTable) {
      console.warn(APP_NAME, "未找到课程时间表");
      return events;
    }

    // Parse each row of the meeting table
    const rows = Array.from(meetingTable.querySelectorAll('tr'));
    const current = {
      classNumber: "",
      section: "",
      component: "",
      room: "",
      instructor: ""
    };

    for (let i = 1; i < rows.length; i++) { // Skip header row
      const row = rows[i];
      const cells = Array.from(row.querySelectorAll('td'));
      
      if (cells.length < 7) continue;

      try {
        const classNumber = cleanText(cells[0].textContent);
        const section = cleanText(cells[1].textContent);
        const component = cleanText(cells[2].textContent);
        const dateTimeLines = getCellLines(cells[3]);
        const roomLines = getCellLines(cells[4]);
        const instructorLines = getCellLines(cells[5]);

        const dateTimeText = cleanText(cells[3].textContent);
        const roomText = roomLines.length > 0 ? roomLines[0] : cleanText(cells[4].textContent);
        const instructorText = instructorLines.length > 0 ? instructorLines[0] : cleanText(cells[5].textContent);
        const startEndDate = cleanText(cells[6].textContent);

        if (classNumber) current.classNumber = classNumber;
        if (section) current.section = section;
        if (component) current.component = component;
        if (roomText) current.room = roomText;
        if (instructorText) current.instructor = instructorText;

        // Skip rows without essential information
        if ((dateTimeLines.length === 0 && !dateTimeText) || !startEndDate) continue;

        const timeSources = dateTimeLines.length > 0 ? dateTimeLines : [dateTimeText];
        const timeEntries = [];

        for (let lineIndex = 0; lineIndex < timeSources.length; lineIndex++) {
          const entries = parseDateTimeEntries(timeSources[lineIndex]);
          for (const entry of entries) {
            timeEntries.push({ entry, lineIndex });
          }
        }

        if (timeEntries.length === 0) {
          const event = parseScheduleRow({
            courseTitle,
            classNumber: current.classNumber,
            section: current.section,
            component: current.component,
            dateTime: dateTimeText,
            room: roomText || current.room,
            instructor: instructorText || current.instructor,
            startEndDate
          });

          if (event) {
            events.push(event);
          }
          continue;
        }

        for (const { entry, lineIndex } of timeEntries) {
          const event = parseScheduleRow({
            courseTitle,
            classNumber: current.classNumber,
            section: current.section,
            component: current.component,
            dateTime: timeSources[lineIndex],
            timeInfo: entry,
            room: roomLines[lineIndex] || roomText || current.room,
            instructor: instructorLines[lineIndex] || instructorText || current.instructor,
            startEndDate
          });

          if (event) {
            events.push(event);
          }
        }

      } catch (err) {
        console.warn(APP_NAME, "解析课程行时出错:", err);
      }
    }

    return events;
  }

  function parseScheduleRow(data) {
    const { courseTitle, classNumber, section, component, dateTime, room, instructor, startEndDate, timeInfo } = data;

    // Parse date range
    const dateRange = parseStartEndDate(startEndDate);
    if (!dateRange) {
      console.warn(APP_NAME, "无法解析日期范围:", startEndDate);
      return null;
    }

    // Parse time and days
    const parsedTime = timeInfo || parseDateTimeInfo(dateTime);
    if (!parsedTime) {
      console.warn(APP_NAME, "无法解析时间信息:", dateTime);
      return null;
    }

    // Build event summary using course title + component (calendar-friendly format)
    const titleBase = courseTitle || "课程";
    let summary = titleBase;
    if (component) summary += ` - ${component}`;
    if (section) summary += ` (${section})`;

    const dateRangeList = Array.isArray(dateRange.dateRanges) ? dateRange.dateRanges : [];
    const firstRange = dateRangeList.length > 0 ? dateRangeList[0] : null;
    const lastRange = dateRangeList.length > 0 ? dateRangeList[dateRangeList.length - 1] : null;

    return {
      summary,
      courseTitle: titleBase,
      component,
      section,
      classNumber,
      location: room || "",
      instructor: instructor || "",
      days: parsedTime.days,
      startTime: parsedTime.startTime,
      endTime: parsedTime.endTime,
      startDate: firstRange ? firstRange.start : dateRange.start,
      endDate: lastRange ? lastRange.end : dateRange.end,
      dateRanges: dateRangeList,
      isBiweekly: Boolean(dateRange.isBiweekly)
    };
  }

   function parseStartEndDate(dateStr) {
     if (!dateStr) return null;

     // Parse single date range: "15/09/2025 - 21/09/2025"
     // Or multiple date ranges: "15/09/2025 - 21/09/2025, 29/09/2025 - 05/10/2025, ..."
     const dateRangePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/g;
     const matches = Array.from(dateStr.matchAll(dateRangePattern));

     if (matches.length === 0) return null;

     // Parse all date ranges
     const dateRanges = matches.map(match => {
       const [, startDay, startMonth, startYear, endDay, endMonth, endYear] = match;
       return {
         start: new Date(parseInt(startYear, 10), parseInt(startMonth, 10) - 1, parseInt(startDay, 10)),
         end: new Date(parseInt(endYear, 10), parseInt(endMonth, 10) - 1, parseInt(endDay, 10))
       };
     });

     return {
       start: dateRanges[0].start,
       end: dateRanges[dateRanges.length - 1].end,
       dateRanges,
       isBiweekly: dateRanges.length > 1
     };
   }

  function getCellLines(cell) {
    if (!cell) return [];
    const raw = cell.innerText || cell.textContent || "";
    return raw
      .split(/\r?\n+/)
      .map((line) => cleanText(line))
      .filter(Boolean);
  }

  function parseTimeRange(timePart) {
    if (!timePart) return null;
    const timeMatch = timePart.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?\s*-\s*(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (!timeMatch) return null;

    let startHour24 = parseInt(timeMatch[1], 10);
    let endHour24 = parseInt(timeMatch[4], 10);
    const startAmPm = timeMatch[3];
    const endAmPm = timeMatch[6];

    if (startAmPm) {
      if (startAmPm.toUpperCase() === 'PM' && startHour24 !== 12) startHour24 += 12;
      if (startAmPm.toUpperCase() === 'AM' && startHour24 === 12) startHour24 = 0;
    }
    if (endAmPm) {
      if (endAmPm.toUpperCase() === 'PM' && endHour24 !== 12) endHour24 += 12;
      if (endAmPm.toUpperCase() === 'AM' && endHour24 === 12) endHour24 = 0;
    }

    return {
      startTime: { hour: startHour24, minute: parseInt(timeMatch[2], 10) },
      endTime: { hour: endHour24, minute: parseInt(timeMatch[5], 10) }
    };
  }

  function parseDateTimeEntries(timeStr) {
    if (!timeStr) return [];

    const text = cleanText(timeStr);
    if (!text) return [];

    const zhDayMap = { '日': 0, '天': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6 };
    const enDayMap = {
      'su': 0, 'sun': 0, 'sun.': 0, 'sunday': 0,
      'mo': 1, 'mon': 1, 'mon.': 1, 'monday': 1,
      'tu': 2, 'tue': 2, 'tue.': 2, 'tues': 2, 'tues.': 2, 'tuesday': 2,
      'we': 3, 'wed': 3, 'wed.': 3, 'wednesday': 3,
      'th': 4, 'thu': 4, 'thu.': 4, 'thur': 4, 'thur.': 4, 'thursday': 4,
      'fr': 5, 'fri': 5, 'fri.': 5, 'friday': 5,
      'sa': 6, 'sat': 6, 'sat.': 6, 'saturday': 6
    };

    const matches = [];
    const zhPattern = /(?:星期|周)([一二三四五六日天])\s*(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*-\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/gi;
    const enPattern = /(Su|Mo|Tu|We|Th|Fr|Sa|Sun\.?|Mon\.?|Tue\.?|Tues\.?|Wed\.?|Thu\.?|Thur\.?|Fri\.?|Sat\.?|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b\s*(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*-\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/gi;

    for (const match of text.matchAll(zhPattern)) {
      matches.push({ index: match.index || 0, token: match[1], timePart: match[2], locale: "zh" });
    }
    for (const match of text.matchAll(enPattern)) {
      matches.push({ index: match.index || 0, token: match[1], timePart: match[2], locale: "en" });
    }

    if (matches.length === 0) return [];

    matches.sort((a, b) => a.index - b.index);

    const entries = [];
    for (const match of matches) {
      const dayOfWeek = match.locale === "zh"
        ? zhDayMap[match.token]
        : enDayMap[match.token.toLowerCase()];
      if (dayOfWeek === null || dayOfWeek === undefined) continue;

      const timeRange = parseTimeRange(match.timePart);
      if (!timeRange) continue;

      entries.push({
        days: [dayOfWeek],
        startTime: timeRange.startTime,
        endTime: timeRange.endTime
      });
    }

    if (matches.length === 1 && entries.length === 1) {
      const timeRangePattern = /(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*-\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/gi;
      const seenRanges = new Set(matches.map((match) => cleanText(match.timePart)));
      const dayOfWeek = entries[0].days[0];

      for (const match of text.matchAll(timeRangePattern)) {
        const rangeText = cleanText(match[1]);
        if (!rangeText || seenRanges.has(rangeText)) continue;
        const timeRange = parseTimeRange(rangeText);
        if (!timeRange) continue;
        seenRanges.add(rangeText);
        entries.push({
          days: [dayOfWeek],
          startTime: timeRange.startTime,
          endTime: timeRange.endTime
        });
      }
    }

    return entries;
  }

  function parseDateTimeInfo(timeStr) {
    const entries = parseDateTimeEntries(timeStr);
    return entries.length > 0 ? entries[0] : null;
  }

  function detectTermTitle(doc) {
    const termEl = doc.querySelector('span[id^="DERIVED_REGFRM1_SSR_STDNTKEY_DESCR"]');
    const termText = termEl ? cleanText(termEl.textContent) : "";
    if (termText) return termText;

    const title = cleanText(doc.title || "");
    return title || "课程表";
  }

  /**
   * Academic calendar helper functions
   */
  function isHoliday(date) {
    for (const holiday of ACADEMIC_CALENDAR_2025_2026.holidays) {
      if (isDateInRange(date, holiday.start, holiday.end)) {
        return true;
      }
    }
    return false;
  }

  function isMakeupClassDay(date) {
    for (const makeup of ACADEMIC_CALENDAR_2025_2026.makeupClasses) {
      if (isSameDate(date, makeup.date)) {
        return makeup;
      }
    }
    return null;
  }

  function isSpecialEvent(date) {
    for (const event of ACADEMIC_CALENDAR_2025_2026.specialEvents) {
      if (event.start && event.end) {
        if (isDateInRange(date, event.start, event.end)) {
          return event;
        }
      } else if (event.date) {
        if (isSameDate(date, event.date)) {
          return event;
        }
      }
    }
    return null;
  }

  function shouldSkipDate(date) {
    // Skip if it's a holiday
    if (isHoliday(date)) {
      return true;
    }

    // Skip if it's a special no-class event
    const specialEvent = isSpecialEvent(date);
    if (specialEvent && specialEvent.type === 'no_class') {
      return true;
    }

    return false;
  }

  function isWeeklyRecurringPattern(event) {
    if (!event) return false;
    if (event.isBiweekly) {
      return false;
    }
    if (typeof event.weekCoverage === "number") {
      return event.weekCoverage >= 0.7;
    }
    return true;
  }

  function generateIndividualEventsForDateRange(event) {
    const sourceDates = Array.isArray(event.occurrenceDates) && event.occurrenceDates.length > 0
      ? event.occurrenceDates
      : enumerateOccurrencesFromRanges(event.dateRanges || [], event.days || []);

    const seenKeys = new Set();
    const filteredDates = [];

    for (const date of sourceDates) {
      const normalized = normalizeDate(date);
      if (!normalized || shouldSkipDate(normalized)) continue;
      const key = toDateString(normalized);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      filteredDates.push(new Date(normalized.getTime()));
    }

    const targetDays = Array.isArray(event.days) ? event.days : [];
    const startDate = normalizeDate(event.startDate);
    const endDate = normalizeDate(event.endDate);

    if (startDate && endDate && targetDays.length > 0) {
      let checkDate = new Date(startDate.getTime());
      while (checkDate <= endDate) {
        const makeupClass = isMakeupClassDay(checkDate);
        if (makeupClass && targetDays.includes(makeupClass.originalDay)) {
          const key = toDateString(checkDate);
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            filteredDates.push(new Date(checkDate.getTime()));
          }
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }
    }

    filteredDates.sort((a, b) => a - b);

    return filteredDates.map((date) => ({
      date: new Date(date.getTime()),
      startTime: event.startTime,
      endTime: event.endTime,
      summary: event.summary,
      location: event.location,
      component: event.component,
      instructor: event.instructor,
      section: event.section
    }));
  }

  function normalizeDate(date) {
    if (!(date instanceof Date)) return null;
    const normalized = new Date(date.getTime());
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  function alignDateToDay(rangeStart, targetDay) {
    const base = normalizeDate(rangeStart);
    if (!base) return null;
    const diff = (targetDay - base.getDay() + 7) % 7;
    base.setDate(base.getDate() + diff);
    return base;
  }

  function enumerateOccurrencesFromRanges(ranges, days) {
    if (!Array.isArray(ranges) || ranges.length === 0 || !Array.isArray(days) || days.length === 0) {
      return [];
    }

    const occurrences = [];
    const seenKeys = new Set();
    const uniqueDays = Array.from(new Set(days));

    for (const range of ranges) {
      const start = normalizeDate(range && range.start);
      const end = normalizeDate(range && range.end);
      if (!start || !end || start > end) continue;

      for (const day of uniqueDays) {
        let current = alignDateToDay(start, day);
        if (!current) continue;
        if (current < start) {
          current.setDate(current.getDate() + 7);
        }
        while (current <= end) {
          const key = current.toISOString().slice(0, 10);
          if (!seenKeys.has(key)) {
            occurrences.push(new Date(current.getTime()));
            seenKeys.add(key);
          }
          current.setDate(current.getDate() + 7);
        }
      }
    }

    occurrences.sort((a, b) => a - b);
    return occurrences;
  }

  function startOfWeekMonday(date) {
    const normalized = normalizeDate(date);
    if (!normalized) return null;
    const diff = (normalized.getDay() + 6) % 7;
    normalized.setDate(normalized.getDate() - diff);
    return normalized;
  }

  function getWeekKey(date) {
    const weekStart = startOfWeekMonday(date);
    return weekStart ? weekStart.toISOString().slice(0, 10) : "";
  }

  function calculateWeekCoverage(dates) {
    if (!Array.isArray(dates) || dates.length === 0) {
      return { coverage: 1, totalWeeks: 0 };
    }

    const sorted = dates.slice().sort((a, b) => a - b);
    const weekKeys = new Set(sorted.map(getWeekKey).filter(Boolean));

    const firstWeek = startOfWeekMonday(sorted[0]);
    const lastWeek = startOfWeekMonday(sorted[sorted.length - 1]);
    if (!firstWeek || !lastWeek) {
      return { coverage: 1, totalWeeks: 0 };
    }

    const totalWeeks = Math.max(1, Math.round((lastWeek - firstWeek) / (7 * DAY_IN_MS)) + 1);
    return {
      coverage: weekKeys.size / totalWeeks,
      totalWeeks
    };
  }

  function buildAggregatedEvent(events) {
    if (!Array.isArray(events) || events.length === 0) {
      return null;
    }

    const representative = events.find(ev => ev.section) || events[0];
    const aggregated = { ...representative };
    const ranges = [];
    const seenRanges = new Set();
    let hasBiweeklyFlag = Boolean(representative && representative.isBiweekly);

    for (const ev of events) {
      if (ev && ev.isBiweekly) {
        hasBiweeklyFlag = true;
      }

      const list = Array.isArray(ev && ev.dateRanges) ? ev.dateRanges : [];
      for (const range of list) {
        const start = normalizeDate(range && range.start);
        const end = normalizeDate(range && range.end);
        if (!start || !end || start > end) continue;

        const key = `${start.getTime()}-${end.getTime()}`;
        if (!seenRanges.has(key)) {
          ranges.push({ start, end });
          seenRanges.add(key);
        }
      }
    }

    ranges.sort((a, b) => a.start - b.start);

    aggregated.dateRanges = ranges;
    aggregated.occurrenceDates = enumerateOccurrencesFromRanges(ranges, aggregated.days || []);

    if (aggregated.occurrenceDates.length > 0) {
      aggregated.startDate = new Date(aggregated.occurrenceDates[0]);
      aggregated.endDate = new Date(aggregated.occurrenceDates[aggregated.occurrenceDates.length - 1]);
    } else if (ranges.length > 0) {
      aggregated.startDate = new Date(ranges[0].start);
      aggregated.endDate = new Date(ranges[ranges.length - 1].end);
    }

    const { coverage, totalWeeks } = calculateWeekCoverage(aggregated.occurrenceDates);
    aggregated.weekCoverage = coverage;
    aggregated.totalWeeks = totalWeeks;
    aggregated.isBiweekly = hasBiweeklyFlag || coverage < 0.7;

    return aggregated;
  }

  function generateRRuleAndExceptions(event) {
    // Generate RRULE with EXDATE for holidays and separate makeup dates
    const startDate = normalizeDate(event.startDate);
    const endDate = normalizeDate(event.endDate);
    const targetDaysOfWeek = Array.isArray(event.days) ? event.days : [];

    if (!startDate || !endDate || targetDaysOfWeek.length === 0) {
      const fallback = startDate || new Date();
      return {
        firstOccurrence: fallback,
        weekCount: 1,
        dayOfWeek: fallback.getDay(),
        exceptionDates: [],
        makeupDates: []
      };
    }
    
    // Find the first occurrence date
    let firstOccurrence = new Date(startDate.getTime());
    while (firstOccurrence <= endDate && !targetDaysOfWeek.includes(firstOccurrence.getDay())) {
      firstOccurrence.setDate(firstOccurrence.getDate() + 1);
    }
    
    // Generate all dates to find exceptions
    const exceptionDates = [];
    const makeupDates = [];
    const makeupKeys = new Set();
    
    let currentDate = new Date(firstOccurrence.getTime());
    let weekCount = 0;
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      if (targetDaysOfWeek.includes(dayOfWeek)) {
        // Check if this date should be excluded (holiday)
        if (shouldSkipDate(currentDate)) {
          exceptionDates.push(new Date(currentDate));
        }
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
        weekCount += 1;
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Find makeup classes
    let checkDate = new Date(startDate);
    while (checkDate <= endDate) {
      const makeupClass = isMakeupClassDay(checkDate);
      if (makeupClass && targetDaysOfWeek.includes(makeupClass.originalDay)) {
        const key = toDateString(checkDate);
        if (!makeupKeys.has(key)) {
          makeupKeys.add(key);
          makeupDates.push(new Date(checkDate));
        }
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    return {
      firstOccurrence,
      weekCount: Math.max(1, weekCount),
      dayOfWeek: firstOccurrence.getDay(),
      exceptionDates,
      makeupDates
    };
  }
  
  function getDayName(dayOfWeek) {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days[dayOfWeek];
  }

  /**
   * Build ICS text from parsed data
   */
  function buildICS(parsed) {
    const lines = [];
    const now = new Date();
    const dtstamp = toUTCStringBasic(now);

    lines.push("BEGIN:VCALENDAR");
    lines.push("PRODID:-//" + APP_NAME + " (iZJU)//EN");
    lines.push("VERSION:2.0");
    lines.push("CALSCALE:GREGORIAN");

    lines.push("BEGIN:VTIMEZONE");
    lines.push("TZID:" + TZID);
    lines.push("BEGIN:STANDARD");
    lines.push("DTSTART:19700101T000000");
    lines.push("TZOFFSETFROM:+0800");
    lines.push("TZOFFSETTO:+0800");
    lines.push("TZNAME:CST");
    lines.push("END:STANDARD");
    lines.push("END:VTIMEZONE");

    const eventGroups = new Map();

    for (const ev of parsed.events) {
      let baseSummary = ev.courseTitle || ev.summary || "课程";
      if (ev.component) {
        baseSummary += ` - ${ev.component}`;
      }
      const timeKey = buildTimeKey(ev.startTime, ev.endTime);
      const groupKey = `${baseSummary}|${ev.location}|${ev.instructor}|${(ev.days || []).join(',')}|${timeKey}`;
      if (!eventGroups.has(groupKey)) {
        eventGroups.set(groupKey, []);
      }
      eventGroups.get(groupKey).push(ev);
    }

    console.log(APP_NAME, `共 ${parsed.events.length} 个事件分组为 ${eventGroups.size} 组`);

    for (const events of eventGroups.values()) {
      const aggregatedEvent = buildAggregatedEvent(events);
      if (!aggregatedEvent) {
        continue;
      }

      if (isWeeklyRecurringPattern(aggregatedEvent)) {
        const rruleData = generateRRuleAndExceptions(aggregatedEvent);

        console.log(
          APP_NAME,
          `常规课程 "${aggregatedEvent.summary}": ${rruleData.weekCount} 次, ${rruleData.exceptionDates.length} 个例外, ${rruleData.makeupDates.length} 个补课`
        );

        const dtStart = combineDateAndTime(rruleData.firstOccurrence, aggregatedEvent.startTime);
        const dtEnd = combineDateAndTime(rruleData.firstOccurrence, aggregatedEvent.endTime);

        lines.push("BEGIN:VEVENT");
        lines.push("UID:" + buildUID(aggregatedEvent, now, 0));
        lines.push("DTSTAMP:" + dtstamp + "Z");
        lines.push("DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(dtStart));
        lines.push("DTEND;TZID=" + TZID + ":" + toLocalStringBasic(dtEnd));

        const dayName = getDayName(rruleData.dayOfWeek);
        lines.push(`RRULE:FREQ=WEEKLY;COUNT=${rruleData.weekCount};BYDAY=${dayName}`);

        if (rruleData.exceptionDates.length > 0) {
          const exdates = rruleData.exceptionDates
            .map((date) => toLocalStringBasic(combineDateAndTime(date, aggregatedEvent.startTime)))
            .join(",");
          lines.push(`EXDATE;TZID=${TZID}:${exdates}`);
        }

        lines.push("SUMMARY:" + escapeICSText(aggregatedEvent.summary));

        if (aggregatedEvent.location) {
          lines.push("LOCATION:" + escapeICSText(aggregatedEvent.location));
        }

        const desc = [];
        if (aggregatedEvent.component) desc.push(`类型: ${aggregatedEvent.component}`);
        if (aggregatedEvent.section) desc.push(`班级: ${aggregatedEvent.section}`);
        if (aggregatedEvent.instructor) desc.push(`讲师: ${aggregatedEvent.instructor}`);
        if (desc.length > 0) {
          lines.push("DESCRIPTION:" + escapeICSText(desc.join("\n")));
        }

        lines.push("END:VEVENT");

        if (rruleData.makeupDates.length > 0) {
          for (let i = 0; i < rruleData.makeupDates.length; i++) {
            const makeupDate = rruleData.makeupDates[i];
            const makeupStart = combineDateAndTime(makeupDate, aggregatedEvent.startTime);
            const makeupEnd = combineDateAndTime(makeupDate, aggregatedEvent.endTime);

            lines.push("BEGIN:VEVENT");
            lines.push("UID:" + buildUID(aggregatedEvent, now, `makeup-${toDateString(makeupDate)}-${i}`));
            lines.push("DTSTAMP:" + dtstamp + "Z");
            lines.push("DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(makeupStart));
            lines.push("DTEND;TZID=" + TZID + ":" + toLocalStringBasic(makeupEnd));
            lines.push("SUMMARY:" + escapeICSText(aggregatedEvent.summary));

            if (aggregatedEvent.location) {
              lines.push("LOCATION:" + escapeICSText(aggregatedEvent.location));
            }

            const desc = [];
            if (aggregatedEvent.component) desc.push(`类型: ${aggregatedEvent.component}`);
            if (aggregatedEvent.section) desc.push(`班级: ${aggregatedEvent.section}`);
            if (aggregatedEvent.instructor) desc.push(`讲师: ${aggregatedEvent.instructor}`);
            if (desc.length > 0) {
              lines.push("DESCRIPTION:" + escapeICSText(desc.join("\n")));
            }

            lines.push("END:VEVENT");
          }
        }
      } else {
        const individualEvents = generateIndividualEventsForDateRange(aggregatedEvent);

        console.log(APP_NAME, `单双周课程 "${aggregatedEvent.summary}": 生成 ${individualEvents.length} 个独立事件`);

        for (let i = 0; i < individualEvents.length; i++) {
          const event = individualEvents[i];
          const dtStart = combineDateAndTime(event.date, event.startTime);
          const dtEnd = combineDateAndTime(event.date, event.endTime);

          lines.push("BEGIN:VEVENT");
          lines.push("UID:" + buildUID(aggregatedEvent, now, `individual-${i}`));
          lines.push("DTSTAMP:" + dtstamp + "Z");
          lines.push("DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(dtStart));
          lines.push("DTEND;TZID=" + TZID + ":" + toLocalStringBasic(dtEnd));
          lines.push("SUMMARY:" + escapeICSText(event.summary));

          if (event.location) {
            lines.push("LOCATION:" + escapeICSText(event.location));
          }

          const desc = [];
          if (event.component) desc.push(`类型: ${event.component}`);
          if (event.section) desc.push(`班级: ${event.section}`);
          if (event.instructor) desc.push(`讲师: ${event.instructor}`);
          if (desc.length > 0) {
            lines.push("DESCRIPTION:" + escapeICSText(desc.join("\n")));
          }

          lines.push("END:VEVENT");
        }
      }
    }

    addSpecialEventsToICS(lines, dtstamp);

    lines.push("END:VCALENDAR");

    console.log(APP_NAME, `生成的 ICS 数据长度: ${lines.join('\r\n').length} 字节`);
    return lines.join("\r\n");
  }

  function addSpecialEventsToICS(lines, dtstamp) {
    const specialEvents = Array.isArray(ACADEMIC_CALENDAR_2025_2026.specialEvents)
      ? ACADEMIC_CALENDAR_2025_2026.specialEvents
      : [];

    for (const event of specialEvents) {
      if (event.type && event.type !== "allday") continue;
      const startDate = event.date || event.start;
      if (!startDate || !event.name) continue;

      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + event.name.replace(/\s/g, '') + "@ps-calendar");
      lines.push("DTSTAMP:" + dtstamp + "Z");
      lines.push("DTSTART;VALUE=DATE:" + toDateString(startDate));
      if (event.end) {
        const endDate = new Date(event.end.getTime());
        endDate.setDate(endDate.getDate() + 1);
        lines.push("DTEND;VALUE=DATE:" + toDateString(endDate));
      }
      lines.push("SUMMARY:" + escapeICSText(event.name));
      lines.push("TRANSP:TRANSPARENT");
      lines.push("END:VEVENT");
    }
  }

  function buildUID(ev, now, index = 0) {
    const timeKey = buildTimeKey(ev.startTime, ev.endTime);
    const base = [
      ev.courseTitle || ev.summary,
      ev.component || "",
      ev.section || "",
      ev.location,
      ev.instructor,
      ev.days.join(""),
      timeKey,
      index.toString()
    ].filter(Boolean).join("-");
    
    const hash = simpleHash(base);
    const timestamp = Math.floor(now.getTime() / 1000);
    return `${hash}-${timestamp}@${HOST_HINT}`;
  }

  function buildSuggestedFileName(parsed) {
    const termPart = parsed.termTitle || "课程表";
    const now = new Date();
    const datePart = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    return `iZJU-${termPart}-${datePart}.ics`;
  }

  function triggerDownload(content, filename) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Helper functions
  function formatTimeKey(time) {
    if (!time || typeof time !== "object") return "";
    const hour = time.hour !== undefined ? time.hour : time.h;
    const minute = time.minute !== undefined ? time.minute : time.m;
    if (hour === undefined || minute === undefined || isNaN(hour) || isNaN(minute)) {
      return "";
    }
    return `${Number(hour).toString().padStart(2, "0")}${Number(minute).toString().padStart(2, "0")}`;
  }

  function buildTimeKey(startTime, endTime) {
    const startKey = formatTimeKey(startTime);
    const endKey = formatTimeKey(endTime);
    if (!startKey && !endKey) return "";
    return `${startKey}-${endKey}`;
  }

  function cleanText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function combineDateAndTime(date, time) {
    const result = new Date(date);
    
    if (!time || typeof time !== 'object') {
      console.error(APP_NAME, "Invalid time object:", time);
      return result;
    }
    
    const hour = time.hour !== undefined ? time.hour : time.h;
    const minute = time.minute !== undefined ? time.minute : time.m;
    
    if (hour === undefined || minute === undefined || isNaN(hour) || isNaN(minute)) {
      console.error(APP_NAME, "Invalid time values:", { hour, minute, originalTime: time });
      return result;
    }
    
    result.setHours(Number(hour), Number(minute), 0, 0);
    return result;
  }

  function toLocalStringBasic(date) {
    return date.getFullYear() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0') + 'T' +
           date.getHours().toString().padStart(2, '0') +
           date.getMinutes().toString().padStart(2, '0') +
           date.getSeconds().toString().padStart(2, '0');
  }

  function toUTCStringBasic(date) {
    return date.getUTCFullYear() +
           (date.getUTCMonth() + 1).toString().padStart(2, '0') +
           date.getUTCDate().toString().padStart(2, '0') + 'T' +
           date.getUTCHours().toString().padStart(2, '0') +
           date.getUTCMinutes().toString().padStart(2, '0') +
           date.getUTCSeconds().toString().padStart(2, '0');
  }

  function toDateString(date) {
    return date.getFullYear() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0');
  }

  function escapeICSText(text) {
    if (!text) return "";
    
    // RFC 5545 compliant text escaping
    return text
      .replace(/\\/g, "\\\\")    // Escape backslashes first
      .replace(/,/g, "\\,")      // Escape commas
      .replace(/;/g, "\\;")      // Escape semicolons
      .replace(/\n/g, "\\n")     // Escape newlines  
      .replace(/\r/g, "");       // Remove carriage returns
  }
  
  function formatDescription(parts) {
    if (!parts || parts.length === 0) return "";
    return parts.join("\n");
  }

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  function isDateInRange(date, start, end) {
    return date >= start && date <= end;
  }

  // Start the script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }

})();
