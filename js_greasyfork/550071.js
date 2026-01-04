// ==UserScript==
// @name         Trakt.tv | Charts - Ratings Distribution
// @description  Adds a ratings distribution (number of users who rated a title 1/10, 2/10 etc.) chart to title summary pages. Also allows for rating the title by clicking on the bars of the chart. See README for details.
// @version      1.0.7
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
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @connect      walter-r2.trakt.tv
// @downloadURL https://update.greasyfork.org/scripts/550071/Trakttv%20%7C%20Charts%20-%20Ratings%20Distribution.user.js
// @updateURL https://update.greasyfork.org/scripts/550071/Trakttv%20%7C%20Charts%20-%20Ratings%20Distribution.meta.js
// ==/UserScript==


/* global Chart */

'use strict';

let $, traktApiModule;
const numFormatCompact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
numFormatCompact.formatTLC = (n) => numFormatCompact.format(n).toLowerCase();


addStyles();

document.addEventListener('turbo:load', async () => {
  if (!/^\/(shows|movies)\//.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  traktApiModule ??= unsafeWindow.userscriptTraktApiModule?.isFulfilled ? await unsafeWindow.userscriptTraktApiModule : null;
  if (!$) return;

  const $summaryWrapper = $('#summary-wrapper'),
        $summaryRatingsWrapper = $summaryWrapper.find('#summary-ratings-wrapper'),
        statsPath = $summaryRatingsWrapper.find('.trakt-rating > a').attr('href');
  if (!statsPath) return;

  const $canvas = $(`<div id="ratings-distribution-chart-wrapper"><canvas></canvas></div>`)
                    .appendTo($summaryWrapper.find('.shadow-base'))
                    .find('canvas');
  const [ratingsData, fanartBrightness] = await Promise.all([getRatingsData(statsPath), getFanartBrightness($summaryWrapper)]);

  const newChart = () => {
    new Chart($canvas[0].getContext('2d'), {
      type: 'bar',
      data: getChartData(ratingsData, fanartBrightness),
      options: getChartOptions(ratingsData, $summaryRatingsWrapper),
    });
  };
  if (!document.hidden) newChart();
  else $(document).one('visibilitychange', newChart);
}, { capture: true });


async function getRatingsData(statsPath) {
  let ratingsData;
  if (traktApiModule) {
    const statsPathSplit = statsPath.split('/').slice(1, -1),
          id = isNaN(statsPathSplit[1]) ? statsPathSplit[1] : $('.summary-user-rating').attr(`data-${statsPathSplit[0].slice(0, -1)}-id`), // /shows/1883 numeric slugs are interpreted as trakt-id by api
          resp = await traktApiModule[(statsPathSplit[4] ?? statsPathSplit[2] ?? statsPathSplit[0])].ratings({ id, season: statsPathSplit[3], episode: statsPathSplit[5] });
    ratingsData = { distribution: Object.values(resp.distribution), votes: resp.votes };
  } else {
    const resp = await fetch(statsPath),
          statsDoc = new DOMParser().parseFromString(await resp.text(), 'text/html'),
          ratDist = JSON.parse($(statsDoc).find('#charts-wrapper script').text().match(/ratingsDistribution = (\[.*\])/)[1]);
    ratingsData = { distribution: ratDist, votes: $('#summary-ratings-wrapper').data('vote-count') };
  }

  if (ratingsData.distribution.length === 11) { // bg logging of titles with malformed (length = 11, [0] === 1 or more, only movs/shows no seasons/eps) ratings distribution data e.g. /shows/chainsaw-man
    // GM_setValue(statsPath, ratingsData.distribution.toString());
    console.warn(GM_info.script.name.replace('Trakt.tv', 'Userscript') + ': Malformed ratings distribution data.', ratingsData.distribution.toString());
    ratingsData.distribution.shift();
  }

  return ratingsData;
}

function getFanartBrightness($summaryWrapper) {
  const $fullScreenshot = $summaryWrapper.find('> .full-screenshot');

  const onBgImgSet = async () => {
    const url = $fullScreenshot.css('background-image').match(/https.*webp/)?.[0];
    if (!url) return 0.5;

    const resp = await GM.xmlHttpRequest({ url, responseType: 'blob', fetch: true });
    if (resp.status !== 200) throw new Error(`XHR for: ${resp.finalUrl} failed with status: ${resp.status}`);

    const blobUrl = URL.createObjectURL(resp.response),
          img = new Image();
    img.src = blobUrl;
    await img.decode();
    URL.revokeObjectURL(blobUrl);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const cropWidth = img.naturalWidth / 4, cropHeight = img.naturalHeight / 4,
          data = ctx.getImageData(3*cropWidth, 2*cropHeight, cropWidth, cropHeight).data;
    let sum = 0, px = data.length / 16;
    for (let i = 0; i < data.length; i += 16) {
      sum += (0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2]) / 255;
    }
    return sum / px;
  }

  if ($fullScreenshot.attr('style')) return onBgImgSet();
  else {
    return new Promise((res) => {
      new MutationObserver((_mutations, mutObs) => {
        mutObs.disconnect();
        res(onBgImgSet());
      }).observe($fullScreenshot[0], { attributeFilter: ['style'] });
    });
  }
}


function getGradientY(context, callerId, yAxisId, ...colors) {
  if (!context) return colors.pop().color;
  const {ctx, chartArea, scales} = context.chart;
  if (!chartArea) return;

  ctx[callerId] ??= {};
  if (!ctx[callerId].gradient ||
      ctx[callerId].height !== chartArea.height ||
      ctx[callerId].yAxisMin !== scales[yAxisId].min ||
      ctx[callerId].yAxisMax !== scales[yAxisId].max) {
    let newBottom = scales[yAxisId].max - scales[yAxisId].min;
    newBottom = newBottom ? scales[yAxisId].max / newBottom : 1;
    newBottom = chartArea.bottom * newBottom;

    ctx[callerId].gradient = ctx.createLinearGradient(0, newBottom, 0, chartArea.top);
    colors.forEach((c) => ctx[callerId].gradient.addColorStop(c.offset, c.color));

    ctx[callerId].height = chartArea.height;
    ctx[callerId].yAxisMin = scales[yAxisId].min;
    ctx[callerId].yAxisMax = scales[yAxisId].max;
  }
  return ctx[callerId].gradient;
}

function getChartData(ratingsData, fanartBrightness) {
  return {
    labels: [...Array(10)].map((_, i) => String(i + 1)),
    datasets: [{
      label: 'Votes',
      data: ratingsData.distribution,
      categoryPercentage: 1,
      barPercentage: 0.97,
      backgroundColor: `rgba(${Array(3).fill(Math.min(fanartBrightness+0.35, 1)*255).join(', ')}, ${Math.min(fanartBrightness+0.3, 0.7)})`,
      hoverBackgroundColor: (context) => getGradientY(context, '_votes', 'y',
        { offset: 0, color: `rgba(155, 66, 200, ${Math.min(fanartBrightness+0.3, 0.7)})` },
        { offset: 0.9, color: `rgba(255, 0, 0, ${Math.min(fanartBrightness+0.3, 0.7)})` }),
    }],
  };
}

function getChartOptions(ratingsData, $summaryRatingsWrapper) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    minBarLength: 2,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      delay: (context) => (context.type === 'data' && context.mode === 'default') ? 250 + context.dataIndex * (750 / (ratingsData.distribution.length - 1)) : 0,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        suggestedMax: 10,
      },
    },
    plugins: {
      tooltip: {
        displayColors: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        caretSize: 10,
        padding: {
          x: 12,
          y: 5,
        },
        titleAlign: 'center',
        titleMarginBottom: 2,
        titleFont: {
          weight: 'bold',
        },
        bodyAlign: 'center',
        bodyColor: 'rgb(170, 170, 170)',
        bodyFont: {
          size: 11,
        },
        footerAlign: 'center',
        footerColor: (context) => `hsl(0, ${context.tooltip.dataPoints[0].parsed.x * 11}%, 35%)`, // approximation
        footerMarginTop: 2,
        footerFont: {
          size: 18,
        },
        callbacks: {
          title: (tooltipItems) => {
            const label = tooltipItems[0].label;
            return `${label} - ${unsafeWindow.ratingsText?.[label]}`;
          },
          label: (tooltipItem) => {
            const y = tooltipItem.parsed.y;
            return `${ratingsData.votes > 0 ? (y*100 / ratingsData.votes).toFixed(1) : '--'}% (${numFormatCompact.formatTLC(y)} v.)`;
          },
          footer: (tooltipItems) => {
            const personalRating = $summaryRatingsWrapper.find('.summary-user-rating > :not([style="display: none;"]) > [class*="rating-"]').first().attr('class')?.match(/rating-(\d+)/)?.[1];
            return tooltipItems[0].parsed.x === personalRating - 1 ? '\u2764' : '';
          },
        },
      },
      legend: {
        display: false,
      },
    },
    onClick: (_evt, activeElems) => {
      if (!activeElems.length) return;

      const rating = activeElems[0].index + 1;
      $summaryRatingsWrapper.find('.summary-user-rating:not(.popover-on)').trigger('click');
      setTimeout(() => $(`.needsclick.rating-${rating}`).trigger('mouseover').trigger('click'), 500);
    },
  };
}


function addStyles() {
  GM_addStyle(`
#summary-wrapper {
  container-type: inline-size;
  --rat-dist-chart-width: 28cqi;
}
#summary-wrapper .shadow-base {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
#ratings-distribution-chart-wrapper {
  position: relative;
  z-index: 30;
  height: 100%;
  width: var(--rat-dist-chart-width);
}
#summary-wrapper:has(#summary-ratings-wrapper) .summary .mobile-title {
  padding-right: calc(var(--rat-dist-chart-width) - ((100cqi - 100%) / 2) + 5px) !important;
}
@media (width <= 767px) {
  #ratings-distribution-chart-wrapper {
    height: 65%;
  }
}


#summary-wrapper .summary .mobile-title .year {
  white-space: nowrap;
}
#summary-wrapper .summary .mobile-title .year::after {
  content: "\\2060";
}
  `);
}