// ==UserScript==
// @name        TruyenFull Downloader with Concurrent Workers
// @namespace   Violentmonkey Scripts
// @match       https://truyenfull.vision/*
// @grant       none
// @version     2.0
// @description Download chapters concurrently with progress bar at bottom
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/557364/TruyenFull%20Downloader%20with%20Concurrent%20Workers.user.js
// @updateURL https://update.greasyfork.org/scripts/557364/TruyenFull%20Downloader%20with%20Concurrent%20Workers.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class WorkersPool {
    constructor(totalWorkers = 15, maxAttempts = 3) {
      this.totalWorkers = totalWorkers;
      this.maxAttempts = maxAttempts;
      this.queue = [];
      this.results = [];
      this.activeWorkers = 0;
      this.resolveWhenDone = () => {};
      this.cancelled = false;
      this.onProgress = () => {};
    }

    addTask(task, args) {
      this.queue.push({ addedAt: Date.now(), args, task, attempts: 0 });
    }

    _next() {
      if (this.cancelled) return;

      // If nothing left and no active workers, finalize
      if (this.queue.length === 0 && this.activeWorkers === 0) {
        this._finalize();
        return;
      }

      // Fill available worker slots
      while (this.queue.length > 0 && this.activeWorkers < this.totalWorkers) {
        const task = this.queue.shift();
        this.activeWorkers++;

        (async () => {
          try {
            const data = await task.task(task.args);
            if (data) this.results.push({ addedAt: task.addedAt, data });
          } catch {
            if (task.attempts < this.maxAttempts) {
              task.attempts++;
              this.queue.push(task);
            }
          } finally {
            this.activeWorkers--;
            this.onProgress(this.results.length, this.totalTasks);
            this._next(); // refill slots
          }
        })();
      }
    }

    _finalize() {
      this.results.sort((a, b) => a.addedAt - b.addedAt);
      this.resolveWhenDone();
    }

    runAll(totalTasks) {
      return new Promise((resolve) => {
        this.resolveWhenDone = resolve;
        this.totalTasks = totalTasks;
        this._next();
      });
    }

    cancel() {
      this.cancelled = true;
      this.queue = [];
      this.results = [];
      this.activeWorkers = 0;
      this.resolveWhenDone();
    }
  }

  async function getChapterContent(url) {
    const regexIndexOf = (str, regex, start = 0) => {
      const idx = str.substring(start).search(regex);
      return idx >= 0 ? idx + start : idx;
    };

    try {
      const text = await fetch(url).then((res) => res.text());
      const [sTitle, cTitle] = text
        .match(/<a class="chapter-title" [^>]+?title="([^">]+)">/i)[1]
        .split('-');

      let content = text.slice(regexIndexOf(text, /id="ads-chapter-pc-top"[^>]+><\/div>/));
      content = content.slice(content.indexOf('</div>') + '</div>'.length);
      content = content.slice(0, content.indexOf('</div>'));
      content = content.replaceAll(/<br\/?>|<\/?p[^>]*>/gi, '\n');
      content = content.replaceAll(/<[^>]*>/gi, '');

      return { sTitle: sTitle.trim(), cTitle: cTitle.trim(), content };
    } catch {
      return false;
    }
  }

  function getMaxChapter() {
    const lastOption = document.querySelector('div.btn-group > select > option:last-child');
    if (lastOption) {
      return Promise.resolve(lastOption.value.split('-')[1]);
    }

    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        setTimeout(() => {
          const option = document.querySelector('div.btn-group > select > option:last-child');
          if (option) {
            observer.disconnect();
            resolve(option.value.split('-')[1]);
          }
        }, 5);
      });

      observer.observe(document.querySelector('div.btn-group'), {
        childList: true,
        subtree: true,
      });

      document.querySelector('div.btn-group > button')?.click();
    });
  }

  async function download(progressBar, cancelBtn, statusText) {
    const [, basePath] = location.href.match(/(https?:\/\/truyenfull\.vision\/[\w\-]+)\/chuong-\d+\//i);
    const maxChapter = parseInt(await getMaxChapter(), 10);

    const pool = new WorkersPool();
    for (let i = 1; i <= maxChapter; i++) {
      pool.addTask(getChapterContent, `${basePath}/chuong-${i}/`);
    }

    pool.onProgress = (completed, total) => {
      progressBar.value = completed;
      progressBar.max = total;
      statusText.textContent = `Downloading chapter ${completed} of ${total}...`;
    };

    cancelBtn.onclick = () => {
      pool.cancel();
      statusText.textContent = 'Download cancelled.';
    };

    await pool.runAll(maxChapter);
    if (pool.results.length === 0 || pool.cancelled) return;

    const sTitle = pool.results[0].data.sTitle;
    const content = pool.results
      .map((c) => `${c.data.cTitle}\n${c.data.content}\n`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = sTitle;
    link.click();

    setTimeout(() => URL.revokeObjectURL(link.href), 10);
    statusText.textContent = 'Download complete!';
  }

  // Only run on chapter pages
  if (!/https?:\/\/truyenfull\.vision\/[\w\-]+\/chuong-\d+\//i.test(location.href)) return;

  // Create Download button
  const btn = document.createElement('button');
  btn.textContent = 'Download';
  btn.style.cssText = 'position:fixed; top:5px; left:5px; z-index:9999;';
  document.body.appendChild(btn);

  // Create progress bar container (hidden initially)
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed; bottom:0; left:0; right:0; z-index:9999; background:#fff; padding:5px; border-top:1px solid #ccc; display:none;';

  const progressBar = document.createElement('progress');
  progressBar.value = 0;
  progressBar.max = 100;
  progressBar.style.width = '70%';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.marginLeft = '10px';

  const statusText = document.createElement('span');
  statusText.style.marginLeft = '10px';
  statusText.textContent = 'Idle';

  container.appendChild(progressBar);
  container.appendChild(cancelBtn);
  container.appendChild(statusText);
  document.body.appendChild(container);

  btn.onclick = () => {
    btn.remove(); // remove button
    container.style.display = 'block'; // show progress bar at bottom
    progressBar.value = 0;
    statusText.textContent = 'Starting download...';
    download(progressBar, cancelBtn, statusText);
  };
})();