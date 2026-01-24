// ==UserScript==
// @name         PrairieLearn → Unified DDL Calendar (.ics)
// @namespace    prairie-tools
// @version      2.0
// @description  Gather all DDLs from all non-Proficiency courses on PrairieLearn and export them as one .ics calendar file
// @match        https://us.prairielearn.com/o
// @grant        none
// @author       cicero.elead.apollonius@gmail.com
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/563852/PrairieLearn%20%E2%86%92%20Unified%20DDL%20Calendar%20%28ics%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563852/PrairieLearn%20%E2%86%92%20Unified%20DDL%20Calendar%20%28ics%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Utility: Convert Date to ICS format (UTC)
  function toICSDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  // Utility: Extract "End" date from Access Details popover
  function extractEndDate(content) {
    const match = content.match(/<td>(\d{4}-\d{2}-\d{2} [^<]*)<\/td>\s*<\/tr>\s*<\/table>/);
    if (!match) return null;
    const dateStr = match[1].replace(/\(.*\)/, '').trim(); // remove timezone text
    return new Date(dateStr);
  }

  // Utility: Parse all assessments from a course HTML text
  function parseAssessments(courseName, html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('table tbody tr');
    const events = [];

    rows.forEach((tr) => {
      const name = tr.querySelector('td a')?.innerText.trim();
      const btn = tr.querySelector('button[data-bs-title="Access details"]');
      if (!name || !btn) return;

      const content = btn.getAttribute('data-bs-content');
      if (!content) return;

      // Skip rows where all credits are "None"
      if (content.includes('<td>None</td>')) {
        const onlyNone = !content.match(/<td>(?!None)[^<]+<\/td>/);
        if (onlyNone) return;
      }

      const rows = Array.from(content.matchAll(/<tr>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<\/tr>/g));
      rows.forEach(([, credit, start, end]) => {
        if (credit.includes('None')) return;
        const endDate = new Date(end.replace(/\(.*\)/, '').trim());
        if (isNaN(endDate)) return;

        events.push({
          name: `${courseName}: ${name}`,
          end: endDate,
        });
      });
    });

    return events;
  }

  // Utility: Build ICS content
  function buildICS(events) {
    const header = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PrairieLearn//DDL Export//EN',
      'X-WR-CALNAME:PrairieLearn Deadlines',
      'X-APPLE-CALENDAR-COLOR:#5CC5FF'
    ].join('\n');

    const body = events
      .map(
        (e) =>
          [
            'BEGIN:VEVENT',
            `UID:${btoa(e.name + e.end.toISOString()).replace(/=/g, '')}@prairielearn.com`,
            `DTSTAMP:${toICSDate(new Date())}`,
            `DTSTART:${toICSDate(e.end)}`,
            `DTEND:${toICSDate(new Date(e.end.getTime() + 60 * 60 * 1000))}`, // +1h duration
            `SUMMARY:${e.name}`,
            'END:VEVENT',
          ].join('\n')
      )
      .join('\n');

    const footer = 'END:VCALENDAR';
    return [header, body, footer].join('\n');
  }

  // Helper: download as .ics
  function downloadICS(content, filename = 'PrairieLearn_All_Courses.ics') {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Step 1: collect all non-Proficiency course links from homepage
  function getCourseLinks() {
    return Array.from(document.querySelectorAll('table a'))
      .filter((a) => !/Proficiency Exam/i.test(a.textContent))
      .map((a) => ({
        name: a.textContent.match(/^([A-Z]+\s*\d+)/)?.[1] || 'Course',
        url: a.href,
      }));
  }

  // Step 2: fetch assessments page for each course
  async function fetchCourseAssessments(course) {
    const assessUrl = course.url.endsWith('/')
      ? `${course.url}assessments`
      : `${course.url}/assessments`;
    console.log(`Fetching ${assessUrl}...`);
    const res = await fetch(assessUrl, { credentials: 'include' });
    if (!res.ok) {
      console.error('Failed to fetch:', assessUrl);
      return [];
    }
    const html = await res.text();
    return parseAssessments(course.name, html);
  }

  // Step 3: gather all courses’ DDLs
  async function gatherAllDDLs() {
    const courses = getCourseLinks();
    if (!courses.length) {
      alert('No courses found on this page.');
      return;
    }
    const allEvents = [];
    for (const course of courses) {
      const events = await fetchCourseAssessments(course);
      allEvents.push(...events);
    }
    allEvents.sort((a, b) => a.end - b.end);
    const ics = buildICS(allEvents);
    downloadICS(ics);
  }

  // Step 4: add export button
  function addExportButton() {
    if (document.getElementById('exportAllDDLs')) return;
    const btn = document.createElement('button');
    btn.textContent = '📅 Export All Course Deadlines (.ics)';
    btn.id = 'exportAllDDLs';
    btn.className = 'btn btn-primary mt-3';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.onclick = gatherAllDDLs;
    document.body.appendChild(btn);
  }

  window.addEventListener('load', addExportButton);
})();
