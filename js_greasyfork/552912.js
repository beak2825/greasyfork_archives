// ==UserScript==
// @name         DeepCo Statistics Tampermonkey V5.12
// @namespace    https://deepco.app/
// @version      2025-10-16v5.12
// @description  Track RC rate and chart it.
// @author       Corns(original script), Zoltan (migrated to new architecture)
// @match        https://deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://code.highcharts.com/highcharts.js
// @require      https://code.highcharts.com/modules/boost.js
// @require      https://code.highcharts.com/modules/mouse-wheel-zoom.js
// @downloadURL https://update.greasyfork.org/scripts/552912/DeepCo%20Statistics%20Tampermonkey%20V512.user.js
// @updateURL https://update.greasyfork.org/scripts/552912/DeepCo%20Statistics%20Tampermonkey%20V512.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const SCHEMA = [['Timestamp', 'TileCount', 'RC', 'Level', 'DC', 'DCIncome', 'Processing Rating']];

  // Load existing logs or initialize with header row
  let db = await GM.getValue('nudgeLogs', SCHEMA);
  fixTimestamps(db);
  let myChart = null;
  let recursionTime = null;
  let startingRC = null; // in case reset happens in the middle of a run

  new MutationObserver((mutation, observer) => {
    const deptScaling = document.getElementById('main-panel');
    if (deptScaling) {
      observer.disconnect();
      console.log("[DeepCo Stats] Started");
      applyFontPatch();
      waitForTargetAndObserve()
    }
  }).observe(document.body, { childList: true, subtree: true, characterdata: true });

  function waitForTargetAndObserve() {

    const frame = document.getElementById('recursion-header');
    createPanel();

    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const text = node.innerHTML.trim();
          if (text.includes('[DC]')) {
            logStats(text);
          }
        }
      }
    }).observe(document.body , { childList: true, subtree: true, characterdata: true });
  }

  function createPanel() {
    const grid = document.getElementById('main-panel');
    const panelContainer = document.createElement("div");
    panelContainer.className = 'grid-wrapper';
    // add buttons
    const btnContainer = document.createElement("div");
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';
    btnContainer.style.gap = '10px'; // optional spacing between buttons
    // Export button
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Export Player Stats";
    exportBtn.addEventListener("click", exportStats);
    btnContainer.appendChild(exportBtn);

    // Reset button
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Stats";
    resetBtn.addEventListener("click", resetStats);
    btnContainer.appendChild(resetBtn);

    // 2. Create container for buttons
    const chartContainer = document.createElement('div');
    chartContainer.id = 'hc-container';

    panelContainer.appendChild(chartContainer);
    panelContainer.appendChild(btnContainer);
    grid.appendChild(panelContainer);

    const playerSpan = document.querySelector('a.text-success');
    const playerColor = "red"; //playerSpan.style.color;
    const savedZoom = JSON.parse(localStorage.getItem('chartZoom') || 'null');
    const chartData = calcData();

    // 3. Render Highcharts chart
    myChart = Highcharts.chart('hc-container', {
      chart: {
        zooming: {
          type: 'x',
          mouseWheel: {
            enabled: true,
            type: 'x'
          }
        }
      },
      title: { text: 'RC/hr' },
      subtitle: {
        text: document.ontouchstart === undefined ?
        'Click and drag in the plot area to zoom in' :
        'Pinch the chart to zoom in'
      },
      xAxis: {
        type: 'datetime',
        events: {
          afterSetExtremes: function (e) {
            const zoomState = {
              min: e.min,
              max: e.max
            };
            localStorage.setItem('chartZoom', JSON.stringify(zoomState));
          }
        },
        // Optional: apply saved zoom on load
        //min: savedZoom?.min,
       // max: savedZoom?.max
      },
      yAxis: {
        title: { text: 'RC/hr' }
      },
      plotOptions: {
        series: {
          events: {
            // Fires when legend item is clicked (toggles visibility)
            legendItemClick: function () {
              const visibility = this.chart.series.map(s => s.visible);
              localStorage.setItem('chartVisibility', JSON.stringify(visibility));
            }
          }
        }
      },
      series: [{
        name: 'Since Recursion',
        data: chartData[0],
      }, {
        name: 'Past Minute',
        data: chartData[1],
        color: playerColor
      }],
      tooltip: {
        xDateFormat: '%Y-%m-%d %H:%M:%S.%L',
        pointFormat: 'RC/hr: <b>{point.y:.2f}</b><br/>'
      }
    });
        // restore chart settings
    restoreSeriesVisibility(myChart);

    // reattach panel if removed
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        for (const removedNode of mutation.removedNodes) {
          if (removedNode === panelContainer) {
            observer.disconnect();
            createPanel();
          }
        }
      }
    }).observe(grid, { childList: true });;
  }

   function calcData() {
    const seriesData = [[], []];

    // start at 1 to skip header
    for (let i = 1; i < db.length; i++) {
      const currentTime = db[i][0];
      const currentRC = db[i][2];

      // avg since last recursion
      // first row of data or RC decrease -> set recursion time to now
      if (i === 1 || currentRC < db[i-1][2]) {
        recursionTime = currentTime;
        startingRC = currentRC;
      }
      if (recursionTime) {
        const timeElapsed = (currentTime - recursionTime) / 3600_000;
        const rcDelta = currentRC - startingRC;
        const rcPerHrSinceRecursion = rcDelta === 0 ? 0 : rcDelta / timeElapsed;
        seriesData[0].push([currentTime, rcPerHrSinceRecursion]);
      }

      // avg past minute
      // Find the earliest entry within the past 60 seconds
      let j = i;
      while (j > 0 && db[j][0] > currentTime - 60_000) {
        j--;
      }
      const pastTime = db[j][0];
      const pastRC = db[j][2];

      const deltaRC = currentRC - pastRC;
      const deltaTime = (currentTime - pastTime) / 3600_000; // in hours

      const rcPerHourPastMinute = deltaTime > 0 ? deltaRC / deltaTime : 0;
      if (pastRC !== 0 && deltaRC > 0) {
        seriesData[1].push([currentTime, rcPerHourPastMinute]);
      }
    }
    return seriesData;
  }

  async function logStats(flashMessage) {
    const timestamp = Date.now();
    const tileCount = getTileCount();
    const rc = getRCCount();
    const level = getLevel();
    const dc = getDCCount();
    const dcIncome = getDCIncome(flashMessage);
    const rating = getProcessingRating();

    // push to database
    db.push([timestamp, tileCount, rc, level, dc, dcIncome, rating]);
    await GM.setValue('nudgeLogs', db);

    const timeElapsed = (timestamp - recursionTime) / (1000 * 60 * 60);
    const rcDelta = rc - startingRC;
    const rcPerMin = rcDelta === 0 ? 0 : rcDelta / timeElapsed;

    // update chart
    // RC since recursion
    myChart.series[0].addPoint([timestamp, rcPerMin], true, false);
    scrollChartToEnd(myChart);

    // RC past minute
    // Find the earliest entry within the past 60 seconds
    let j = db.length - 1;
    while (j > 0 && db[j][0] > timestamp - 60_000) {
      j--;
    }
    const pastTime = db[j][0];
    const pastRC = db[j][2];

    const deltaRC = rc - pastRC;
    const deltaTime = (timestamp - pastTime) / 3600_000; // in hours

    const rcPerHourPastMinute = deltaTime > 0 ? deltaRC / deltaTime : 0;
    if (pastRC !== 0 && deltaRC > 0) {
      myChart.series[1].addPoint([timestamp, rcPerHourPastMinute], true, false);
    }
  }

  async function exportStats() {
    const logs = await GM.getValue('nudgeLogs', []);
    if (logs.length === 0) {
      console.log('[DeepCo Stats] No logs to save.');
      return;
    }

    // Wrap values with commas in quotes
    const csvContent = logs.map(row =>
                                row.map(value =>
                                        /,/.test(value) ? `"${value}"` : value
                                       ).join(',')
                               ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dc_player_stats_${new Date().toISOString().replace(/[:.]/g, "_")}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    console.log('[CSV Export] Downloaded CSV with', logs.length, 'rows.');
  }

  async function resetStats() {
    if (confirm('Are you sure you want to clear player stats?')) {
      db = SCHEMA;
      await GM.setValue('nudgeLogs', db);
      alert('Tile logs have been cleared.');
    }
  }

  function getTimestampForSheets() {
    const d = new Date();
    const pad = (n, z = 2) => String(n).padStart(z, '0');

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    const milliseconds = pad(d.getMilliseconds(), 3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  // convert to ISO 8601 format i.e. milliseconds since epoch
  function fixTimestamps(db) {
    for (let i = 1; i < db.length; i++) {
      const ts = db[i][0];

      if (typeof ts === 'string') {
        db[i][0] = new Date(ts.replace(' ', 'T')).getTime();
      }
    }
  }

  function getTileCount() {
    const frame = document.querySelector('.nudge-animation').innerHTML.trim();
    if (!frame) {
      console.log('[DeepCo Stats] turbo-frame element not found.');
      return;
    }
    const value = parseInt(frame.replace(/[^\d]/g, ""), 10);
    return value;
  }

   function getRCCount() {
    // Find RC value
    const recursionSpan = document.querySelector('span.flex:nth-child(2) > span:nth-child(1)').innerHTML;

    let rc = 0;
    if (recursionSpan) {
          rc = parseFloat(recursionSpan.replace(/[^0-9\.]+/g, '').trim());
    }
    return rc;
  }

  function getDCCount() {
    // Find the UPGRADES link with badge
    const upgradesLink = document.querySelector('#worker_coins').children[0].children[0].children[1].innerHTML;
    // Parse current DC value from its text
    const match = upgradesLink.match(/\b\d+(\.\d+)?\s*\[DC\]/i);
    const currentDC = parseFloat(match);

    return currentDC;
  }

  function getDCIncome(flashMessage) {
    // parse flashMessage which has DC income amount
    const match = document.querySelector('[data-controller="flash"]').innerHTML;
    const amount = parseFloat(match);
    return amount;
  }

  function getProcessingRating() {
    const rating = document.querySelector('[data-section="stats"] [data-tip="Processing Rating"] [data-stat="damage_rating"]').textContent.trim();
    return rating;
  }

  function getLevel() {
    // Find the department-stats element
    const deptStats = document.querySelector('[class="space-y-4"]').children[2].children[0].innerHTML;

    let dcValue = 0; // default if not found

    if (deptStats) {
      const text = deptStats.trim();

      // Match DC followed by optional + and digits, e.g., DC4A or DC+4
      const match = text.match(/DC\+?(\d+)/i);
      if (match) {
        dcValue = parseInt(match[1], 10);

      }
    }

    return dcValue;
  }

  function scrollChartToEnd(chart, bufferRatio = 0.01) {
    const xAxis = chart.xAxis[0];
    const extremes = xAxis.getExtremes();

    const viewSize = extremes.max - extremes.min;
    const dataMax = extremes.dataMax;

    const isAtEnd = Math.abs(extremes.max - dataMax) < viewSize * 0.05; // ~5% tolerance

    if (isAtEnd) {
      const buffer = viewSize * bufferRatio;
      const newMax = dataMax + buffer;
      const newMin = newMax - viewSize;

      xAxis.setExtremes(newMin, newMax);
    }
  }

  function restoreSeriesVisibility(chart) {
    const saved = localStorage.getItem('chartVisibility');
    if (!saved) return;

    const visibility = JSON.parse(saved);
    chart.series.forEach((s, i) => {
      if (visibility[i] === false) {
        s.hide();
      } else {
        s.show();
      }
    });
  }


  // stylise highcharts font
  function applyFontPatch() {
    if (typeof Highcharts === 'undefined' || !document.body) {
      requestAnimationFrame(applyFontPatch);
      return;
    }

    const bodyStyles = getComputedStyle(document.body);
    const bodyFont = bodyStyles.fontFamily;
    const fontColor = bodyStyles.color;
    const backgroundColor = bodyStyles.backgroundColor;


    Highcharts.setOptions({
      chart: {
        backgroundColor: 'rgb(17, 17, 17)',
        style: {
          color: fontColor,
          fontFamily: bodyFont
        }
      },
      title: {
        style: {
          color: fontColor
        }
      },
      subtitle: {
        style: {
          color: fontColor
        }
      },
      xAxis: {
        labels: {
          style: {
            color: fontColor
          }
        },
        title: {
          style: {
            color: fontColor
          }
        }
      },
      yAxis: {
        labels: {
          style: {
            color: fontColor
          }
        },
        title: {
          style: {
            color: fontColor
          }
        }
      },
      legend: {
        itemStyle: {
          color: fontColor
        }
      },
      tooltip: {
        backgroundColor: backgroundColor,
        style: {
          color: fontColor
        }
      },
    });
  }
})();