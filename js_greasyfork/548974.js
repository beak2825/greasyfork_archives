// ==UserScript==
// @name         Comick 2+ Chapter Timer Fix
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Shows timer for next chapter when 2+ chapters are available
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548974/Comick%202%2B%20Chapter%20Timer%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/548974/Comick%202%2B%20Chapter%20Timer%20Fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const API_BASE = 'https://api.comick.dev';
  const processed = new WeakSet();
  let timers = new Map();

  function extractSlug(href) {
    const match = href.match(/\/comic\/([^\/\?#]+)/);
    return match?.[1];
  }

  function getCurrentChapter(element) {
    const text = element.textContent || '';
    const match = text.match(/Current\s+(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  async function fetchJSON(url) {
    try {
      const response = await fetch(url);
      return response.ok ? await response.json() : null;
    } catch {
      return null;
    }
  }

  function createTimer(targetTime, element) {
    const timer = document.createElement('div');
    timer.className = 'mt-3 pr-2';
    timer.innerHTML = `
      <a class="btn w-full text-center text-xs px-0 border-none" style="pointer-events: none;">
        <div class="text-orange-600 dark:text-orange-400">
          <p><span class="time">00:00:00</span></p>
        </div>
      </a>
    `;

    const update = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        timer.innerHTML = `
          <div class="flex items-center h-8">
            <span class="btn w-full text-center text-xs px-0 border-none text-green-600">Available Now</span>
          </div>
        `;
        clearInterval(timers.get(element));
        timers.delete(element);
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      timer.querySelector('.time').textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    update();
    const intervalId = setInterval(update, 1000);
    timers.set(element, intervalId);

    const existingDiv = element.querySelector('.mt-3.pr-2');
    if (existingDiv) {
      existingDiv.replaceWith(timer);
    } else {
      element.appendChild(timer);
    }
  }

  async function processElement(element) {
    if (processed.has(element)) return;
    processed.add(element);

    const currentChapter = getCurrentChapter(element);
    if (!currentChapter) return;

    const comicLink = element.querySelector('a[href*="/comic/"]:not([href*="/chapter/"])');
    if (!comicLink) return;

    const slug = extractSlug(comicLink.href);
    if (!slug) return;

    const comicData = await fetchJSON(`${API_BASE}/comic/${slug}?tachiyomi=true`);
    if (!comicData?.comic) return;

    const chaptersData = await fetchJSON(`${API_BASE}/comic/${comicData.comic.hid}/chapters?lang=en&chap-order=1&limit=300`);
    if (!chaptersData?.chapters) return;

    const chapters = chaptersData.chapters;
    const chapterNumbers = chapters.map(c => parseFloat(c.chap)).filter(n => !isNaN(n));
    const maxChapter = Math.max(...chapterNumbers);

    if (maxChapter - currentChapter < 2) return;

    const now = new Date();
    const upcoming = chapters
      .filter(c => c.publish_at && new Date(c.publish_at) > now)
      .sort((a, b) => new Date(a.publish_at) - new Date(b.publish_at));

    if (upcoming.length > 0) {
      createTimer(new Date(upcoming[0].publish_at), element);
    }
  }

  function scan() {
    const cards = new Set();

    document.querySelectorAll('a[href*="/comic/"]:not([href*="/chapter/"])').forEach(link => {
      const card = link.closest('div');
      if (card && card.textContent.includes('Current')) {
        cards.add(card);
      }
    });

    cards.forEach(card => processElement(card));
  }

  function init() {
    scan();
    new MutationObserver(() => setTimeout(scan, 100)).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  setInterval(scan, 30000);
})();