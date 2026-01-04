// ==UserScript==
// @name         Volleyball China – Tabulka s odkazy
// @namespace    vc-live-api-final
// @version      1.1
// @description  Na ofiku pro čínský volejbal vygeneruje tabulku s odkazy do API LIVE URL
// @author       JV
// @license      MIT
// @match        https://league20252026.volleyballchina.com/schedule*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559365/Volleyball%20China%20%E2%80%93%20Tabulka%20s%20odkazy.user.js
// @updateURL https://update.greasyfork.org/scripts/559365/Volleyball%20China%20%E2%80%93%20Tabulka%20s%20odkazy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LIVE_API_BASE =
    'https://league20252026.volleyballchina.com:8443/prod-api/match/getMatchGameRealTimeDataInfo/';

  const PROVINCE_TRANSLATIONS = {
    '辽宁': 'Liaoning','吉林': 'Jilin','黑龙江': 'Heilongjiang',
    '河北': 'Hebei','山西': 'Shanxi','山东': 'Shandong',
    '河南': 'Henan','江苏': 'Jiangsu','浙江': 'Zhejiang',
    '安徽': 'Anhui','福建': 'Fujian','江西': 'Jiangxi',
    '广东': 'Guangdong','广西': 'Guangxi','海南': 'Hainan',
    '四川': 'Sichuan','贵州': 'Guizhou','云南': 'Yunnan',
    '陕西': 'Shaanxi','甘肃': 'Gansu','青海': 'Qinghai'
  };

  const MUNICIPALITIES = {
    '北京': 'Beijing',
    '上海': 'Shanghai',
    '天津': 'Tianjin',
    '重庆': 'Chongqing'
  };

  const CITY_TO_PROVINCE = {
    '青岛': '山东','保定': '河北','福清': '福建',
    '石家庄': '河北','唐山': '河北',
    '沈阳': '辽宁','大连': '辽宁',
    '杭州': '浙江','宁波': '浙江',
    '南京': '江苏','苏州': '江苏',
    '广州': '广东','深圳': '广东'
  };

  let matchRecords = [];
  let rendered = false;

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', () => {
      if (this._url && this._url.includes('queryMatchInfo')) {
        try {
          const json = JSON.parse(this.responseText);
          matchRecords = json?.data?.records || [];
          renderOnce();
        } catch {}
      }
    });
    return origSend.apply(this, arguments);
  };

  function translateTeam(name) {
    if (!name) return '';

    for (const m in MUNICIPALITIES) {
      if (name.includes(m)) return MUNICIPALITIES[m] + ' VC';
    }

    for (const p in PROVINCE_TRANSLATIONS) {
      if (name.includes(p)) return PROVINCE_TRANSLATIONS[p] + ' VC';
    }

    for (const city in CITY_TO_PROVINCE) {
      if (name.includes(city)) {
        return PROVINCE_TRANSLATIONS[CITY_TO_PROVINCE[city]] + ' VC';
      }
    }

    return name;
  }

  function getGender(r) {
    if (r.homeTeamName.includes('男子')) return 'Men';
    if (r.homeTeamName.includes('女子')) return 'Women';
    return '';
  }

  function renderOnce() {
    if (rendered || !matchRecords.length) return;
    rendered = true;
    renderTable();
  }

  function renderTable() {
    if (document.getElementById('live-api-panel')) return;

    const groupA = matchRecords.filter(
      r => r.groupName === 'A级' || r.groupName === 'A组'
    );

    if (!groupA.length) return;

    const panel = document.createElement('div');
    panel.id = 'live-api-panel';
    panel.style.cssText = `
      margin:16px auto;
      display:inline-block;
      padding:0 10px;
      background:#fff;
      border-radius:12px;
      border:1px solid #ebeef5;
      box-shadow:0 6px 16px rgba(0,0,0,.08);
      font-size:12px;
    `;

    panel.innerHTML = `
      <div style="
        padding:6px 10px;
        font-weight:600;
        font-size:13px;
        background:linear-gradient(90deg,#409EFF,#66b1ff);
        color:#fff;
        text-align:center;
        border-radius:10px 10px 0 0;
      ">
        API LIVE URL – CVL A
      </div>
      <table style="border-collapse:separate;border-spacing:0">
        <thead>
          <tr>
            <th>DateTime</th>
            <th>Gender</th>
            <th>Home</th>
            <th>Away</th>
            <th>API</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;

    const tbody = panel.querySelector('tbody');

    groupA.forEach(r => {
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${r.matchTime}</td>
          <td>${getGender(r)}</td>
          <td>${translateTeam(r.homeTeamName)}</td>
          <td>${translateTeam(r.awayTeamName)}</td>
          <td><a href="${LIVE_API_BASE + r.matchKey}" target="_blank">OPEN</a></td>
        </tr>
      `);
    });

    const style = document.createElement('style');
    style.textContent = `
      #live-api-panel th,
      #live-api-panel td {
        padding:6px 12px;
        text-align:center;
        vertical-align:middle;
        white-space:nowrap;
        border-bottom:1px solid #ebeef5;
        #live-api-panel td:nth-child(3),
        #live-api-panel td:nth-child(4)
        sfont-weight: 600;
      }
      #live-api-panel th:not(:last-child),
      #live-api-panel td:not(:last-child)
        border-right:1px solid #ebeef5;
      }

      #live-api-panel th {
        background:#f5f7fa;
        color:#606266;
        font-weight:500;
      }

      #live-api-panel tbody tr:hover {
        background:#f0f9ff;
      }

      #live-api-panel a {
        color:#409EFF;
        font-weight:600;
        text-decoration:none;
      }
    `;
    document.head.appendChild(style);

    const searchDiv = document.querySelector('.search-div');
    if (searchDiv) searchDiv.after(panel);
  }
})();