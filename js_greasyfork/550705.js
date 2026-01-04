// ==UserScript==
// @name         MAM Series Tags on Author Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows series overlay on MAM pages when searching by author
// @author       You
// @match        https://www.myanonamouse.net/tor/browse.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550705/MAM%20Series%20Tags%20on%20Author%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/550705/MAM%20Series%20Tags%20on%20Author%20Page.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function mamLog(...args) {
    console.log('%c[MAM Author Series]', 'color:purple;font-weight:bold;', ...args);
  }

  function processAuthorPage() {
    const seriesData = extractSeriesData();

    if (seriesData.length > 0) {
      createSeriesOverlay(seriesData);
    }
  }

  function extractSeriesData() {
    const seriesMap = new Map();

    let rows = document.querySelectorAll('table.coltable tr:not(.colhead)');
    if (rows.length === 0) {
      rows = document.querySelectorAll('table tr:not(.colhead)');
    }

    rows.forEach((row, index) => {
      const seriesLink = row.querySelector('a.series');
      if (!seriesLink) {
        return;
      }

      const seriesName = seriesLink.textContent.trim();
      const seriesHref = seriesLink.href;

      // Find date cell - look for dates in format YYYY-MM-DD HH:MM:SS
      const allCells = Array.from(row.querySelectorAll('td'));
      const dateCells = allCells.filter((cell) => {
        const text = cell.textContent;
        return /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(text);
      });

      if (dateCells.length > 0) {
        const dateText = dateCells[0].textContent.trim();
        const dateMatch = dateText.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);

        if (dateMatch) {
          const dateStr = dateMatch[1];
          const date = new Date(dateStr);
          
          // Skip invalid dates
          if (isNaN(date.getTime())) {
            return;
          }

          if (!seriesMap.has(seriesName)) {
            seriesMap.set(seriesName, {
              name: seriesName,
              href: seriesHref,
              date: date,
              dateStr: dateStr,
              count: 1,
            });
          } else {
            const existing = seriesMap.get(seriesName);
            existing.count++;
            if (date < existing.date) {
              existing.date = date;
              existing.dateStr = dateStr;
            }
          }
        }
      }
    });

    const result = Array.from(seriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }

  // group series by common words in their names
  function groupSeriesByName(seriesData) {
    const groups = [];
    const processedSeries = new Set();

    seriesData.forEach((series, index) => {
      if (processedSeries.has(series.name)) return;

      const currentGroup = [series.name];
      processedSeries.add(series.name);

      // Extract significant words from the current series name
      const currentWords = extractSignificantWords(series.name);

      // Find other series with similar words
      seriesData.slice(index + 1).forEach((otherSeries) => {
        if (processedSeries.has(otherSeries.name)) return;

        const otherWords = extractSignificantWords(otherSeries.name);

        // Check if they share significant words
        if (hasCommonWords(currentWords, otherWords)) {
          currentGroup.push(otherSeries.name);
          processedSeries.add(otherSeries.name);
        }
      });

      groups.push(currentGroup);
    });

    return groups;
  }

  // Extract significant words from series name (ignore common words)
  function extractSignificantWords(seriesName) {
    const commonWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'up',
      'out',
      'if',
      'about',
      'who',
      'get',
      'all',
      'her',
      'my',
      'make',
      'can',
      'had',
      'has',
      'was',
      'one',
      'our',
      'day',
      'man',
      'new',
      'now',
      'old',
      'see',
      'him',
      'two',
      'how',
      'its',
      'series',
      'book',
      'books',
      'novel',
      'novels',
      'volume',
      'vol',
      'part',
      'trilogy',
      'saga',
      'chronicles',
      'adventure',
      'adventures',
      'collection',
      'anthology',
      'story',
      'stories',
      'tale',
      'tales',
    ]);

    return seriesName
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word))
      .filter((word) => !/^\d+$/.test(word)); // Remove pure numbers
  }

  function hasCommonWords(words1, words2) {
    if (words1.length === 0 || words2.length === 0) return false;

    const intersection = words1.filter((word) => words2.includes(word));

    // Consider them related if they share at least one significant word
    // and that word is at least 3 characters long
    return intersection.some((word) => word.length >= 3);
  }

  function createSeriesOverlay(seriesData) {
    if (document.getElementById('mam-series-overlay')) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'mam-series-overlay';
    overlay.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 20px;
      background: rgb(44, 44, 44);
      border: 1px solid rgb(66 65 65);
      border-radius: 4px;
      padding: 10px;
      max-width: 350px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 10000;
      font-size: 13px;
      color: #fff;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;

    // Create header with close button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #555;
    `;

    const title = document.createElement('h3');
    title.textContent = `Series on this page (${seriesData.length})`;
    title.style.cssText = `
      margin: 0;
      font-size: 11px;
      color: #fff;
      font-weight: normal;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeButton.onclick = () => overlay.remove();

    header.appendChild(title);
    header.appendChild(closeButton);
    overlay.appendChild(header);

    const list = document.createElement('div');

    const seriesGroups = groupSeriesByName(seriesData);
    const groupColors = [
      '#007acc',
      '#ff6b35',
      '#4ecdc4',
      '#45b7d1',
      '#96ceb4',
      '#feca57',
      '#ff9ff3',
      '#54a0ff',
      '#5f27cd',
      '#00d2d3',
      '#ff9f43',
      '#a55eea',
      '#26de81',
      '#fc5c65',
      '#fed330',
      '#fd79a8',
      '#6c5ce7',
      '#fdcb6e',
    ];

    seriesData.forEach((series) => {
      const groupIndex = seriesGroups.findIndex((group) => group.includes(series.name));
      const currentGroup = groupIndex >= 0 ? seriesGroups[groupIndex] : [series.name];
      const borderColor = groupColors[Math.max(0, groupIndex) % groupColors.length];

      // Highlight series that have similar names (groups with more than 1 member)
      const hasSimilarSeries = currentGroup.length > 1;
      const backgroundColor = hasSimilarSeries ? '#4a4a1a' : '#3a3a3a'; 

      const item = document.createElement('div');
      item.style.cssText = `
        margin-bottom: 8px;
        padding: 6px 8px;
        background: ${backgroundColor};
        border-radius: 4px;
        border-left: 3px solid ${borderColor};
        ${hasSimilarSeries ? 'box-shadow: 0 0 8px rgba(255, 255, 0, 0.2);' : ''}
      `;

      const link = document.createElement('a');
      link.href = series.href;
      link.textContent = `${series.name} (${series.count})`;
      link.style.cssText = `
        color: #4a9eff;
        text-decoration: none;
        font-weight: bold;
        display: block;
        margin-bottom: 2px;
      `;
      link.onmouseover = () => (link.style.color = '#66b3ff');
      link.onmouseout = () => (link.style.color = '#4a9eff');

      const dateSpan = document.createElement('div');
      const dateOnly = series.dateStr ? series.dateStr.split(' ')[0] : 'Unknown';
      dateSpan.textContent = `Earliest: ${dateOnly}`;
      dateSpan.style.cssText = `
        color: #bbb;
        font-size: 11px;
      `;

      item.appendChild(link);
      item.appendChild(dateSpan);
      list.appendChild(item);
    });

    overlay.appendChild(list);
    document.body.appendChild(overlay);
  }

  // Main execution - only run on author browse pages
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Check if we're on a browse page filtered by author
      if (location.pathname === '/tor/browse.php' && location.href.includes('authorID')) {
        mamLog('MAM Author Series Tags initialized');
        processAuthorPage();
      }
    }, 1000);
  });
})();
