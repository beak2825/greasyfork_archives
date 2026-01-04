// ==UserScript==
// @name semsportal.com
// @namespace github.com/openstyles/stylus
// @version 202511051
// @description Custom dark theme styling for GoodWe SEMS Portal
// @author shiftgeist
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.semsportal.com/*
// @match https://www.semsportal.com/powerstation/PowerStatusSnMin/*
// @downloadURL https://update.greasyfork.org/scripts/554196/semsportalcom.user.js
// @updateURL https://update.greasyfork.org/scripts/554196/semsportalcom.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.semsportal.com/")) {
  css += `
      @media (prefers-color-scheme: dark) {
          :root {
              --main-text: white;
              --gray-900: #181a1b;
              /* --gray-800: color of filter invert */
              --gray-800: #1e1e1e;
              --muted: #beb8b0;
              --filter: invert(0.75) brightness(1.5) contrast(3);
              --panel-inner-space: 8px;
              --panel-outer-space: 12px;
              --nav-height: 60px;
          }
      }
  `;
}
if (location.href.startsWith("https://www.semsportal.com/powerstation/PowerStatusSnMin/")) {
  css += `
      body {
          background: var(--gray-900);
      }

      h5 {
          color: var(--muted) !important;
      }

      .info-right:has(> .goodwe-station-charts) {
          background: var(--gray-800);
      }

      .dash-board {
          background: var(--gray-800);
      }

      .dash-board p {
          padding-top: 5px;
          background: rgba(0, 0, 0, 0.1) !important;
      }

      .goodwe-power-flow,
      .key-api {
          background: transparent !important;
      }

      #acc_menu {
          display: none;
      }

      /* HEADER */
      @supports (backdrop-filter: blur()) or (-webkit-backdrop-filter: blur()) {
          #header {
              background: transparent;
              backdrop-filter: saturate(180%) blur(20px);
          }
      }

      #header {
          height: var(--nav-height);
      }

      #header h1 {
          display: flex;
      }

      @media (max-width: 768px) {
          #header ul,
          #header div,
          #header a {
              display: none;
          }
      }

      @media (max-width: 1100px) {
          #location_bigscreen {
              display: none;
          }
      }

      /* MAIN */
      .sn-min-8 {
          padding: var(--panel-outer-space);
          margin-top: var(--nav-height);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--panel-outer-space);
      }

      .station-title {
          display: none;
      }


      /* ROWS */
      .row {
          margin: 0 !important;
          padding: 0 !important;
          height: auto !important;
      }

      .info-left {
          width: 100% !important;
      }

      .info-right {
          width: 100%;
      }

      .row:has(.dashboard-con) {
          height: auto !important;
          width: auto;
          margin-top: unset !important;
          padding-top: 0 !important;
          overflow: unset !important;
      }

      .row:has(.dashboard-con),
      .row:has(.station-detail),
      .dashboard-con,
      .dashboard-con .dash-board,
      .dashboard-con .key-api .kpi-wrapper {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
      }

      .dashboard-con,
      .dashboard-con .dash-board {
          justify-content: space-evenly;
      }

      .dashboard-con {
          margin-left: 0;
      }

      /* ROW 1 */
      /* Row 1 - Col 1 */
      .search-station {
          display: none;
      }

      .search-station + .row > .info-left {
          display: none;
      }

      /* Row 1 - Col 2 */
      .dashboard-con,
      .dashboard-con .dash-board,
      .dashboard-con .key-api .kpi-wrapper {
          gap: var(--panel-inner-space);
      }

      .dashboard-con .dash-board #power_div,
      .dashboard-con .dash-board #power_div p,
      .dashboard-con .dash-board #power_div span,
      .dashboard-con .dash-board #power_div canvas,
      .dashboard-con .dash-board #battery_div,
      .dashboard-con .dash-board #battery_div .soc-num,
      .dashboard-con .dash-board #battery_div span {
          position: unset;
      }

      .dashboard-con .dash-board .battery_power_div,
      .dashboard-con .dash-board #battery_div {
          margin-top: 0;
      }

      .dashboard-con .dash-board #battery_div {
          height: auto;
      }

      .dashboard-con .dash-board .battery_power_div {
          display: flex;
          flex-direction: column-reverse;
          margin-left: 0;
          height: unset;
      }

      .dashboard-con .dash-board #power_div p {
          width: unset;
      }

      .dashboard-con .dash-board #power_div p,
      .dashboard-con .dash-board #battery_div .soc-num {
          margin-left: auto;
          margin-bottom: unset !important;
      }

      .dashboard-con .dash-board #battery_div .goodwe-battery-1 {
          margin-top: unset;
      }

      .dash-status {
          position: unset;
          flex: 1 0 100%;
      }

      /* Row 1 - Col 3 */
      .dashboard-con .key-api {
          flex: 1 0 300px;
          margin-left: 0;
      }

      .dashboard-con .dash-board {
          padding: var(--panel-inner-space);
          height: 100%;
          width: 100%;
          flex: 1 0 20%;
      }

      .dashboard-con .key-api .kpi-wrapper {
          padding: 0px;
          display: flex;
          flex-wrap: wrap;
      }

      .dashboard-con .key-api .kpi-wrapper::before,
      .dashboard-con .key-api .kpi-wrapper::after {
          display: none;
      }

      .dashboard-con .key-api .kpi-wrapper .kpi-item {
          flex: 1 0 140px;
          margin: 0;
      }

      /* Row 2 */
      .row:has(.station-detail) {
          display: flex;
          flex-direction: column;
          gap: var(--panel-outer-space);
      }

      .row:has(.station-detail) .info-left {
          display: flex;
          flex-wrap: wrap;
          gap: var(--panel-outer-space);
      }

      .row:has(.station-detail) .info-right {
          margin-left: unset;
      }

      .goodwe-station-charts__chart {
          margin-top: 8px;
          height: 400px;
      }

      .goodwe-station-charts__chart canvas {
          filter: var(--filter);
      }

      .station-detail {
          flex: 1 1;
          padding: var(--panel-inner-space);
          height: auto;
          background: var(--gray-800);
      }

      .station-detail-list {
          display: flex;
          flex-direction: column;
          gap: var(--panel-inner-space);
          width: 100%;
      }

      .station-detail-list li {
          color: var(--main-text);
          padding: 0;
          line-height: unset;
          width: 100%;
          white-space: normal;
      }

      .power-station-weather {
          flex: 2 0;
          gap: var(--panel-inner-space);
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
          width: 100%;
          margin-top: 0;
          height: auto;
      }

      .power-station-weather > .weather-today {
          flex: 1 0 100px;
      }

      .power-station-weather > div:not(.weather-today) {
          width: unset !important;
          flex: 1 0 50px;
      }

      .weather-item {
          background: var(--gray-800);
          margin-right: 0;
      }

      .weather-item.weather-today p {
          width: unset !important;
          margin-left: unset !important;
          position: unset !important;
      }

      .weather-item span {
          position: unset !important;
      }

      /* ROW 4 - DEVICES */
      #foot_tab {
          display: none;
      }

      #goodwePowerFlow {
          display: none;
      }

      .device-carousel:has(#data_carousel) {
          display: block !important;
          height: unset !important;
          min-height: 380px;
      }

      .device-carousel:has(#data_carousel) > div {
          height: unset !important;
      }

      .device-carousel-container {
          top: unset !important;
          position: unset !important;
      }

      #data_carousel {
          height: 100% !important;
          position: unset !important;
      }

      .device-carousel:has(#data_carousel) + div {
          display: none;
      }

      .el-carousel__container {
          height: 100%;
          position: unset;
      }

      .el-carousel__item {
          padding: var(--panel-inner-space);
          padding-top: var(--panel-inner-space) !important;
          overflow: unset !important;
          position: unset !important;
      }

      .el-carousel__item > div {
          display: flex;
          flex-direction: column-reverse;
      }

      ._btn_curve,
      ._btn_data {
          position: unset;
      }

      .device-chart {
          margin-left: 0 !important;
          width: 100%;
      }

      .device-item {
          position: static;
          height: unset !important;
          display: flex;
          flex-wrap: wrap;
      }

      .device-item > div {
          padding: var(--panel-inner-space);
      }

      .device-item > .left-list {
          order: 1;
          flex: 1 1 max(33.33%, 200px);
      }

      .device-item > .right-list + div {
          order: 2;
          flex: 1 0 max(33.33%, 250px);
          position: relative;
          min-height: 336px;
      }

      .device-item > .right-list {
          order: 3;
          flex: 1 1 max(33.33%, 200px);
          height: unset !important;
      }

      .left-total-list {
          left: var(--panel-inner-space) !important;
      }

      .el-scrollbar {
          height: unset !important;
      }

      .el-scrollbar__wrap {
          overflow: auto;
      }

      .today-power-center {
          top: 0;
      }

      .scroll-view {
          right: var(--panel-inner-space) !important;
      }

      .device-status-w {
          display: none;
      }

      .device-item .table-list {
          position: unset;
      }

      .device-detail-name {
          display: none;
      }

      .device-item .table-list li {
          display: flex;
      }

      .device-item .table-list li label {
          flex: 0 0 50%;
          width: unset;
          height: unset;
      }

      .device-item .table-list li span:nth-child(2) {
          float: unset;
      }

      .goodwe-scroll-vertical-bar-wrap {
          display: none;
      }
      
      .multi-charts-list, .goodwe-real-scroll {
          height: 200px;
      }

      .goodwe-real-scroll {
          overflow-y: scroll;
          overflow-x: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 180px;
      }
      
      .goodwe-scroll-lisen {
          opacity: 0;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
