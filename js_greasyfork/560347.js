// ==UserScript==
// @name         Codeforces Training Performance Graph
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows a training performance graph for the last 365 days
// @author       Douglas
// @match        https://codeforces.com/profile/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560347/Codeforces%20Training%20Performance%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/560347/Codeforces%20Training%20Performance%20Graph.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /* ===================== Utils ===================== */

  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  function daysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return Math.floor(d.getTime() / 1000);
  }

  function formatDate(ts) {
    const d = new Date(ts * 1000);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }

  /* ===================== Get user ===================== */

  const handle = location.pathname.split('/').pop();

  /* ===================== Load Chart.js ===================== */

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  document.head.appendChild(script);
  await new Promise(r => script.onload = r);

  /* ===================== Background plugin ===================== */

  const backgroundPlugin = {
    id: 'backgroundZones',
    beforeDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;

      const y = scales.y;

      const zones = [
        [0, 399, 'rgba(200,200,200,0.25)'],
        [400, 799, 'rgba(0,200,0,0.20)'],
        [800, 1199, 'rgba(0,200,200,0.20)'],
        [1200, 1599, 'rgba(0,0,200,0.20)'],
        [1600, 1999, 'rgba(128,0,128,0.20)'],
        [2000, 2399, 'rgba(255,165,0,0.25)'],
        [2400, 2800, 'rgba(200,0,0,0.25)'],
        [2800, y.max, 'rgba(0,0,0,0.25)']
      ];

      zones.forEach(([min, max, color]) => {
        const yTop = y.getPixelForValue(max);
        const yBottom = y.getPixelForValue(min);

        ctx.fillStyle = color;
        ctx.fillRect(
          chartArea.left,
          yTop,
          chartArea.right - chartArea.left,
          yBottom - yTop
        );
      });
    }
  };

  /* ===================== Fetch data ===================== */

  const userInfo = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  ).then(r => r.json());

  if (userInfo.status !== 'OK') return;

  const userRating = userInfo.result[0].rating ?? 0;

  const submissions = await fetch(
    `https://codeforces.com/api/user.status?handle=${handle}`
  ).then(r => r.json());

  if (submissions.status !== 'OK') return;

  const solved = submissions.result.filter(
    s => s.verdict === 'OK'
  );

  const solvedProblems = solved.map(s => ({
    time: s.creationTimeSeconds,
    rating: s.problem.rating ?? userRating
  }));

  /* ===================== Compute points ===================== */

  const labels = [];
  const data = [];

  for (let d = 364; d >= 0; d--) {
    const dayEnd = daysAgo(d);
    const dayStart = dayEnd - 30 * 24 * 3600;

    let sum = 0;

    for (const p of solvedProblems) {
      if (p.time >= dayStart && p.time <= dayEnd) {
        sum += sigmoid((p.rating - userRating) / 100) * 35;
      }
    }

    labels.push(formatDate(dayEnd));
    data.push(Number(sum.toFixed(2)));
  }

  /* ===================== Insert canvas at bottom ===================== */

  const container = document.createElement('div');
  container.style.margin = '40px 0';

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  document.querySelector('#pageContent').appendChild(container);

  /* ===================== Render chart ===================== */

  new Chart(canvas, {
    type: 'line',
    plugins: [backgroundPlugin],
    data: {
      labels,
      datasets: [{
        label: 'Training Performance (last year)',
        data,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.25
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 12
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Score'
          }
        }
      }
    }
  });

})();
