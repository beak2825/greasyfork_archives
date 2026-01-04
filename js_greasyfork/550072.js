// ==UserScript==
// @name         Trakt.tv | Charts - Seasons
// @description  Adds a line chart to /seasons pages which shows the ratings (personal + general) and the number of watchers and comments for each individual episode. See README for details.
// @version      0.1.5
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection#readme
// @supportURL   https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection/issues
// @icon         https://trakt.tv/assets/logos/logomark.square.gradient-b644b16c38ff775861b4b1f58c1230f6a097a2466ab33ae00445a505c33fcb91.svg
// @match        https://trakt.tv/*
// @match        https://classic.trakt.tv/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.2.0/dist/chartjs-plugin-zoom.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/550072/Trakttv%20%7C%20Charts%20-%20Seasons.user.js
// @updateURL https://update.greasyfork.org/scripts/550072/Trakttv%20%7C%20Charts%20-%20Seasons.meta.js
// ==/UserScript==

/* README
### General
- Clicking on the individual data points takes you to the summary page of the respective episode (or the comment page for comment data points).
- For charts with more than eight episodes, you can also zoom in by highlighting a section of the x-axis with your mouse. You can zoom out again by clicking anywhere inside the chart.
- This script won't work (well) on mobile devices and the chart is no beauty on light mode either. Basically the whole thing needs an overhaul and is not even close to being finished,
    but the core functionality is there and it might be while until I get back to it, which is why I'm putting it out there as it is right now.
*/


/* global Chart */

'use strict';

let $, traktApiModule;
let $grid, isSeasonChart, filterSpecials, labelsCallback, chart, datasetsData, firstRunDelay;

Chart.defaults.borderColor = 'rgb(44 44 44 / 0.5)';
const numFormatCompact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
numFormatCompact.formatTLC = (n) => numFormatCompact.format(n).toLowerCase();


addStyles();

document.addEventListener('turbo:load', async () => {
  if (!/^\/shows\/[^/]+\/seasons\/[^/]+$/.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  traktApiModule ??= unsafeWindow.userscriptTraktApiModule?.isFulfilled ? await unsafeWindow.userscriptTraktApiModule : null;
  if (!$) return;

  $grid = $('#seasons-episodes-sortable');
  if (!$grid.length) return;
  isSeasonChart = location.pathname.includes('/seasons/');
  filterSpecials = !location.pathname.includes('/seasons/0');
  labelsCallback = isSeasonChart ? (e) => `${e.seasonNum}x${String(e.episodeNum).padStart(2, '0')} ${e.watched ? '\u2714' : '\u2718'}` : (e) => `S. ${e.seasonNum} ${e.watched ? (e.watched == 100 ? '\u2714' : `(${e.watched}%)`) : '\u2718'}`;
  chart = null;
  datasetsData = [];
  firstRunDelay = true;
  if (!isSeasonChart && +$('.season-count').text().split(' ')[0] < 4 ||
      location.pathname.includes('/alternate/') && location.pathname.split('/').filter(Boolean).length < 6) return;

  $grid.on('arrangeComplete', () => {
    if ($grid.data('isotope')) {
      if (!chart) initializeChart();
      else updateChart();
    }
  });
  $(document).off('ajaxSuccess.userscript48372').on('ajaxSuccess.userscript48372', (_evt, _xhr, opt) => {
    if (opt.url.includes('/rate') && chart) updateChart();
  });
}, { capture: true });


function initializeChart() {
  const canvas = $('<div id="seasons-episodes-chart-wrapper"><canvas></canvas></div>').insertBefore($grid).children()[0];

  chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: getChartData(),
    options: getChartOptions(),
  });

  const intObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        intObs.disconnect();
        if (!document.hidden) updateChart();
        else $(document).one('visibilitychange', updateChart);
      };
    });
  }, { threshold: 1.0 });
  intObs.observe(canvas);

  canvas.addEventListener('click', (event) => { // TODO integrate into chart options
    const points = chart.getElementsAtEventForMode(event, 'nearest', { axis: 'x', intersect: false }, true);
    if (!points.length) return;
    const closestPoint = points.sort((p1, p2) => Math.abs(p1.element.y - event.layerY) - Math.abs(p2.element.y - event.layerY))[0];

    if (Math.abs(closestPoint.element.y - event.layerY) < 10) {
      const url = `${datasetsData[closestPoint.index].urlFull}${closestPoint.datasetIndex === 3 ? '/comments' : ''}`;
      GM_openInTab(url, { active: true });
    } else {
      if (chart.isZoomedOrPanned()) {
        chart.resetZoom('active');
      }
    }
  });
}

async function updateChart() {
  const newDatasetsData = await getDatasetsData();
  if (JSON.stringify(datasetsData) !== JSON.stringify(newDatasetsData)) {
    datasetsData = newDatasetsData;
    chart.data = getChartData();
    chart.options = getChartOptions();
    chart.update();
    if (firstRunDelay) firstRunDelay = false;
  }
}

function getDatasetsData() {
  const datasetsData = $grid.data('isotope').filteredItems.filter((i) => filterSpecials ? i.element.dataset.seasonNumber !== '0' : true).map(async (i) => {
    const itemData = {
      generalRating: i.sortData.percentage,
      votes: i.sortData.votes,
      watchers: i.sortData.watchers,
      episodeNum: i.element.dataset.number || null,
      seasonNum: i.element.dataset.seasonNumber,
      urlFull: $(i.element).find('meta[itemprop="url"]').attr('content'),
      personalRating: $(i.element).find('.corner-rating > .text').text() || null,
      watched: $(i.element).find('a.watch.selected').attr('data-percentage') ?? 0,
      releaseDate: $(i.element).find('.percentage').attr('data-earliest-release-date'),
    };

    if (isSeasonChart) {
      itemData.mainTitle = $(i.element).find('.under-info .main-title').text();
      itemData.comments = $(i.element).find('.episode-stats > a[data-original-title="Comments"]').text() || 0;
    } else {
      itemData.mainTitle = $(i.element).find('div[data-type="season"] .titles-link h3').text();
      if (traktApiModule) { // TODO
        const respJSON = await traktApiModule.seasons.comments({ id: i.element.dataset.showId, season: itemData.seasonNum, pagination: true, limit: 1 });
        itemData.comments = respJSON.pagination.item_count;
      } else {
        const resp = await fetch(i.element.dataset.url + '.json');
        if (!resp.ok) throw new Error(`XHR for: ${resp.url} failed with status: ${resp.status}`);
        itemData.comments = (await resp.json()).stats.comment_count;
      }
    }

    return itemData;
  });
  return Promise.all(isSeasonChart ? datasetsData : datasetsData.reverse());
}


function getGradientY(context, callerID, yAxisID, ...colors) {
  if (!context) return colors.pop().color;
  const {ctx, chartArea, scales} = context.chart;
  if (!chartArea) return;
  ctx[callerID] ??= { };

  if (!ctx[callerID].gradient || ctx[callerID].height !== chartArea.height ||
      ctx[callerID].yAxisMin !== scales[yAxisID].min || ctx[callerID].yAxisMax !== scales[yAxisID].max) {
    ctx[callerID].height = chartArea.height;
    ctx[callerID].yAxisMin = scales[yAxisID].min;
    ctx[callerID].yAxisMax = scales[yAxisID].max;

    let newBottom = scales[yAxisID].max - scales[yAxisID].min;
    newBottom = newBottom ? scales[yAxisID].max / newBottom : 1;
    newBottom = chartArea.bottom * newBottom;

    ctx[callerID].gradient = ctx.createLinearGradient(0, newBottom, 0, chartArea.top);
    colors.forEach((c) => ctx[callerID].gradient.addColorStop(c.offset, c.color));
  }
  return ctx[callerID].gradient;
}

function getChartData() {
  return {
    labels: datasetsData.map(labelsCallback),
    datasets: [
      {
        label: 'Personal Rating',
        data: datasetsData.map((e) => e.personalRating ? e.personalRating * 10 : null),
        yAxisID: 'yAxisRating',
        borderColor: (context) => getGradientY(context, '_ratingPersonal', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(175 2 0)' }),
        backgroundColor: (context) => getGradientY(context, '_ratingPersonal', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(175 2 0)' }),
      },
      {
        label: 'General Rating',
        data: datasetsData.map((e) => e.generalRating),
        yAxisID: 'yAxisRating',
        fill: {
          target: '-1',
          above: `rgb(255 0 0 / ${$('body').hasClass('dark-knight') ? 0.15 : 0.3})`,
          below: `rgb(0 255 0 / ${$('body').hasClass('dark-knight') ? 0.15 : 0.3})`,
        },
        borderColor: (context) => getGradientY(context, '_ratingGeneral', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(225 31 117)' }),
        backgroundColor: (context) => getGradientY(context, '_ratingGeneral', 'yAxisRating',
          { offset: 0, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 0.1, color: 'rgb(97 97 97 / 0.6)' },
          { offset: 1, color: 'rgb(225 31 117)' }),
      },
      {
        label: 'Watchers',
        data: datasetsData.map((e) => e.watchers),
        yAxisID: 'yAxisWatchers',
        borderColor: (context) => getGradientY(context, '_watchers', 'yAxisWatchers',
          { offset: 0, color: 'rgb(154 67 201 / 0.2)' },
          { offset: 1, color: 'rgb(154 67 201)' }),
        backgroundColor: (context) => getGradientY(context, '_watchers', 'yAxisWatchers',
          { offset: 0, color: 'rgb(154 67 201 / 0.2)' },
          { offset: 1, color: 'rgb(154 67 201)' }),
      },
      {
        label: 'Comments',
        data: datasetsData.map((e) => e.comments),
        yAxisID: 'yAxisComments',
        borderColor: (context) => getGradientY(context, '_comments', 'yAxisComments',
          { offset: 0, color: 'rgb(54 157 226 / 0.2)' },
          { offset: 1, color: 'rgb(54 157 226)' }),
        backgroundColor: (context) => getGradientY(context, '_comments', 'yAxisComments',
          { offset: 0, color: 'rgb(54 157 226 / 0.2)' },
          { offset: 1, color: 'rgb(54 157 226)' }),
      },
    ],
  };
}

function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    animation: {
      delay: (context) => (context.type === 'data' && context.mode === 'default') ?
        (firstRunDelay ? 500 : 0) + context.dataIndex * (750 / Math.max(datasetsData.length - 1, 1)) + context.datasetIndex * 100 : 0,
    },
    scales: {
      x: {
        offset: true,
      },
      yAxisRating: {
        type: 'linear',
        position: 'left',
        offset: true,
        suggestedMin: 60,
        max: 100,
        title: {
          display: true,
          text: 'Rating',
        },
        grid: {
          color: (context) => !(context.tick.value % 10) ? 'rgb(55 55 55)' : Chart.defaults.borderColor,
        },
        ticks: {
          callback: (tickValue) => `${tickValue}%`,
        },
      },
      yAxisWatchers: {
        type: 'linear',
        position: 'right',
        offset: true,
        min: 0,
        suggestedMax: 10,
        title: {
          display: true,
          text: 'Watchers',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (tickValue) => numFormatCompact.formatTLC(tickValue),
        }
      },
      yAxisComments: {
        type: 'linear',
        position: 'right',
        offset: true,
        min: 0,
        suggestedMax: 10,
        title: {
          display: true,
          text: 'Comments',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      tooltip: {
        usePointStyle: true,
        boxPadding: 5,
        backgroundColor: 'rgb(0 0 0 / 0.5)',
        caretSize: 10,
        padding: {
          x: 18,
          y: 6,
        },
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        callbacks: {
          title: (tooltipItems) => {
            let mainTitle = datasetsData[tooltipItems[0].parsed.x].mainTitle;
            mainTitle = mainTitle.length > 20 ? mainTitle.slice(0, 20).trim() + '...' : mainTitle;
            return `${tooltipItems[0].label}${mainTitle ? `\n${mainTitle}` : ''}`;
          },
          label: (tooltipItem) => {
            const x = tooltipItem.parsed.x,
                  y = tooltipItem.parsed.y,
                  avgRatings = unsafeWindow.userscriptAvgSeasonEpisodeRatings;

            if (tooltipItem.datasetIndex === 0) {
              return `${y / 10}` +
                     `${avgRatings?.personal?.average ? `  (avg: ${avgRatings.personal.average.toFixed(1)})` : ''}`;
            } else if (tooltipItem.datasetIndex === 1) {
              return `${y}%  (${numFormatCompact.formatTLC(datasetsData[x].votes)} v.)` +
                     `${avgRatings?.general ? `  (avg: ${avgRatings.general.average ? Math.round(avgRatings.general.average) : '--'}%)` : ''}`;
            } else if (tooltipItem.datasetIndex === 2) {
              return `${numFormatCompact.formatTLC(y)}${datasetsData[0].watchers ? `  (${Math.round(y * 100 / datasetsData[0].watchers)}%)`: ''}`;
            } else {
              return `${y}`;
            }
          },
          labelColor: (tooltipItem) => {
            return {
              borderColor: tooltipItem.dataset.borderColor(),
              backgroundColor: tooltipItem.dataset.backgroundColor(),
            };
          },
          footer: (tooltipItems) => {
            const releaseDate = datasetsData[tooltipItems[0].parsed.x].releaseDate;
            return releaseDate ? unsafeWindow.formatDate?.(releaseDate) || releaseDate : undefined;
          },
        },
      },
      legend: {
        labels: {
          usePointStyle: true,
          filter: (legendItem, chartData) => chartData.datasets[legendItem.datasetIndex].data.some((v) => v !== null),
        },
      },
      filler: {
        propagate: false,
      },
      zoom: {
        zoom: {
          mode: 'x',
          drag: {
            enabled: true,
            threshold: 0,
          },
        },
        limits: {
          x: {
            minRange: 8,
          },
        },
      },
    },
  };
}


function addStyles() {
  GM_addStyle(`
#seasons-episodes-chart-wrapper {
  position: relative;
  margin-top: 20px;
  width: 100%;
  height: 250px;
}
@media (width <= 767px) {
  #seasons-episodes-chart-wrapper {
    margin-left: -10px;
    margin-right: -10px;
    width: calc(100% + 20px);
  }
}
@media (991px < width) {
  #seasons-episodes-chart-wrapper {
    height: 300px;
  }
}
  `);
}