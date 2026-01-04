// ==UserScript==
// @name        [루시퍼홍] 부동산 매물 가격 필터(based on 모느나님)_엑셀값붙여넣기_옵션A
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     1.10-fix-excel-values-optA
// @author      루시퍼홍
// @description 엑셀에 가로 4셀로 '값 붙여넣기' 되도록 TSV/CSV로만 복사(HTML 제거). 업데이트 팝업 비활성화.
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/555205/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%A7%A4%EB%AC%BC%20%EA%B0%80%EA%B2%A9%20%ED%95%84%ED%84%B0%28based%20on%20%EB%AA%A8%EB%8A%90%EB%82%98%EB%8B%98%29_%EC%97%91%EC%85%80%EA%B0%92%EB%B6%99%EC%97%AC%EB%84%A3%EA%B8%B0_%EC%98%B5%EC%85%98A.user.js
// @updateURL https://update.greasyfork.org/scripts/555205/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%A7%A4%EB%AC%BC%20%EA%B0%80%EA%B2%A9%20%ED%95%84%ED%84%B0%28based%20on%20%EB%AA%A8%EB%8A%90%EB%82%98%EB%8B%98%29_%EC%97%91%EC%85%80%EA%B0%92%EB%B6%99%EC%97%AC%EB%84%A3%EA%B8%B0_%EC%98%B5%EC%85%98A.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ✅ 옵션 A: 업데이트 팝업 끄기
  const ENABLE_UPDATE_POPUP = false;

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11362470';
  const popupDismissKey = 'scriptUpdatePopupDismissed';
  const dismissDuration = 24 * 60 * 60 * 1000; // 24h

  console.log(`${scriptName} currentVersion: ${currentVersion}`);

  function getKoreanTime() {
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utcNow + (9 * 60 * 60 * 1000));
  }
  function formatDateTo24Hour(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }
  function shouldDismissPopup() {
    const lastDismissTime = localStorage.getItem(popupDismissKey);
    if (!lastDismissTime) return false;
    const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
    return timeSinceDismiss < dismissDuration;
  }
  function dismissPopup() {
    const formattedTime = formatDateTo24Hour(getKoreanTime());
    localStorage.setItem(popupDismissKey, formattedTime);
  }
  function showUpdatePopup(latestVersion) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '10000';

    const message = document.createElement('p');
    message.innerHTML = `${scriptName} (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
    popup.appendChild(message);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '확인';
    confirmButton.style.marginRight = '10px';
    confirmButton.onclick = () => {
      window.open(cafeUrl, '_blank');
      document.body.removeChild(popup);
    };
    popup.appendChild(confirmButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = '닫기';
    closeButton.onclick = () => {
      dismissPopup();
      document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
  }

  // 업데이트 체크 비활성화
  if (ENABLE_UPDATE_POPUP && updateUrl) {
    fetch(`${updateUrl}?_=${Date.now()}`)
      .then(response => response.text())
      .then(meta => {
        const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);
        if (latestVersionMatch) {
          const latestVersion = latestVersionMatch[1];
          console.log(`${scriptName} latestVersion: ${latestVersion}`);
          if (currentVersion !== latestVersion) {
            if (!shouldDismissPopup()) showUpdatePopup(latestVersion);
          }
        }
      })
      .catch(error => {
        console.error('Failed to fetch the latest version information:', error);
      });
  }
})();

/* ====== 전역 설정/상수 ====== */
const AREA_CHECK = 'area_check';
const LOW_JEONSE_CHECK = 'low_jeonse_check';
const ASSOCI_CHECK = 'associ_check';
const SEANGO_CHECK = 'seango_check';
const SHINHO_RADIO = 'shiho_radio';

const STORE_NAME = 'wolbu_price_filter';
const STORE_VALUE = { [AREA_CHECK]: false, [LOW_JEONSE_CHECK]: false, [SEANGO_CHECK]: false };

const SIGN_LOW_VALUE = 5;
const SIGN_MIDDLE_VALUE = 10;

const validityCheck = {
  [SHINHO_RADIO]: { isCreate: false, value: 1, defValue: [{ val: 1, text: "X1" }, { val: 2, text: "X2" }, { val: 3, text: "X3" }], title: "신호등", type: "radio" },
  [SEANGO_CHECK]: { isCreate: false, value: false, title: "세안고포함", type: "check" },
  [LOW_JEONSE_CHECK]: { isCreate: false, value: false, title: "최저전세값", type: "check" },
  [AREA_CHECK]: { isCreate: false, value: false, title: "35평이상 포함", type: "check" },
  [ASSOCI_CHECK]: { isCreate: false, value: false, title: "협회물건 포함", type: "check" }
};

/* ====== 엑셀 4셀 복사: '값 붙여넣기' 전용 (HTML 제거, TSV/CSV만) ====== */
async function copyExcelFourCells(cells) {
  const [v1, v2, v3, v4] = cells.map((v)=> v ?? '');
  // 윈도우 엑셀 호환 위해 CRLF 사용
  const tsv = `${v1}\t${v2}\t${v3}\t${v4}\r\n`;
  const csv = `${v1},${v2},${v3},${v4}\r\n`;

  // 최신 API 사용: text/plain + text/csv (HTML 미제공 → 서식 영향 최소화)
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({
        'text/plain': new Blob([tsv], { type: 'text/plain' }),
        'text/csv':   new Blob([csv], { type: 'text/csv' })
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (e) {
    console.error('clipboard.write failed, fallback to execCommand', e);
  }

  // 폴백: TSV만 복사
  const ta = document.createElement('textarea');
  ta.value = tsv;
  ta.style.position = 'fixed';
  ta.style.top = '-10000px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return true;
}

/* ====== 로컬 스토리지 ====== */
function getStoreValue(id) {
  let storeVal = localStorage.getItem(STORE_NAME);
  if (!storeVal) {
    localStorage.setItem(STORE_NAME, JSON.stringify(STORE_VALUE));
    storeVal = localStorage.getItem(STORE_NAME);
  }
  return JSON.parse(storeVal)[id];
}
function setStoreValue(id, val) {
  let storeVal = localStorage.getItem(STORE_NAME);
  if (!storeVal) localStorage.setItem(STORE_NAME, JSON.stringify(STORE_VALUE));
  let parseVal = JSON.parse(storeVal);
  parseVal[id] = val;
  localStorage.setItem(STORE_NAME, JSON.stringify(parseVal));
}

/* ====== UI 위젯 ====== */
function CheckBox(id, target) {
  this.div_id = 'div_' + id;
  this.id = id;
  this.labelText = validityCheck[id].title;
  this.divEle = this.init();
  target.after(this.divEle);

  let storeVal = getStoreValue(this.id);
  validityCheck[id].value = storeVal;
  document.querySelector('#' + id).checked = storeVal;

  document.querySelector('#' + id).addEventListener('change', function () {
    validityCheck[id].value = this.checked;
    setStoreValue(id, this.checked);
  });
  validityCheck[id].isCreate = true;
}
CheckBox.prototype = {
  constructor: CheckBox,
  init: function () {
    const divEle = document.createElement('div');
    divEle.setAttribute('id', this.div_id);
    divEle.classList.add('filter_group', 'filter_group--size');
    divEle.style.margin = '6px 10px 0 0';
    divEle.innerHTML = '<input type="checkbox" name="type" id="' + this.id + '" class="checkbox_input" ><label for="' + this.id + '" class="checkbox_label">' + this.labelText + '</label>';
    return divEle;
  }
};

function RadioBox(id, target) {
  this.div_id = 'div_' + id;
  this.id = id;
  this.valArr = validityCheck[id].defValue;
  this.divEle = this.init();
  target.after(this.divEle);

  let storeVal = getStoreValue(this.id) || 1;
  validityCheck[id].value = storeVal;
  $("input:radio[name=signal]:radio[value='" + storeVal + "']").prop("checked", true);
  $('input[type=radio][name=signal]').change(function () {
    validityCheck[id].value = $(this).val();
    setStoreValue(id, $(this).val());
  });
  validityCheck[id].isCreate = true;
}
RadioBox.prototype = {
  constructor: RadioBox,
  init: function () {
    const divEle = document.createElement('div');
    divEle.setAttribute('id', this.div_id);
    divEle.classList.add('filter_group', 'filter_group--size');
    divEle.style.margin = '6px 10px 0 0';

    let radioBoxs = "";
    for (let i = 0; i < this.valArr.length; i++) {
      let val = this.valArr[i];
      radioBoxs += `<input type="radio" name="signal" id="shinho_${i}" class="radio_input" value="${val.val}"><label for="shinho_${i}" class="radio_label" style="margin-right: 10px; padding-left: 20px;">${val.text}</label>`;
    }
    divEle.innerHTML = radioBoxs;
    return divEle;
  }
};

/* ====== 필터/판단 ====== */
function sinhoCheck(signalVal, gap) {
  let multiple = validityCheck[SHINHO_RADIO].value;
  let tootip = `${signalVal}% / ${gap}`;
  if (signalVal < (SIGN_LOW_VALUE * multiple)) return ['green', tootip];
  else if (signalVal <= (SIGN_MIDDLE_VALUE * multiple)) return ['orange', tootip];
  return ['red', tootip];
}

function createBox(key, type) {
  if (type === "check") new CheckBox(key, document.querySelector('.filter_btn_detail'));
  else new RadioBox(key, document.querySelector('.filter_btn_detail'));
}

function checkMandantoryCondition(size) {
  if (validityCheck[AREA_CHECK].value) return true;
  if (/\d+/g.exec(size) > (35 * 3.3)) return false;
  return true;
}
function getFloor(strFloor) { return strFloor.replace("층", "").split('/'); }

function checkItemCondition(tradeType, floor, spec) {
  if (tradeType != "전세" && tradeType != "매매") return false;
  if (!validityCheck[SEANGO_CHECK].value && (spec.includes("끼고") || spec.includes("안고") || spec.includes("승계"))) return false;

  if (tradeType == "매매") {
    var _floorInfo = getFloor(floor);
    if (_floorInfo[0] == "저") return false;
    if ("1|2|3".indexOf(_floorInfo[0]) > -1 || _floorInfo[0] == _floorInfo[1]) return false;
    if (_floorInfo[1] >= 5 && _floorInfo[0] <= 3) return false;
  }
  return true;
}

function parsePrice(tradePrice) {
  tradePrice = tradePrice.replace(" ", "").replace(",", "");
  if (tradePrice.includes("억"))
    return parseInt(tradePrice.split("억")[0] * 10000) + (parseInt(tradePrice.split("억")[1]) || 0);
  else
    return parseInt(tradePrice);
}

function findAgentIndex() {
  const items = document.querySelectorAll('.item');
  let filteredIndex = 0;
  for (let i = 0; i < items.length; i++) {
    if (!items[i].classList.contains('item--child')) {
      const titleElement = items[i].querySelector('.item_agent_title');
      if (titleElement && titleElement.textContent.includes('공인중개사협회매물')) {
        return filteredIndex;
      }
      filteredIndex++;
    }
  }
  return -1;
}

/* ====== 데이터 수집/가공 ====== */
function getPrice_WeolbuStandard() {
  let result = {};
  let dictPricePerSize = {};
  let agentIndex = !validityCheck[ASSOCI_CHECK].value ? findAgentIndex() : 99999;

  let tradeTypeValueFnc = function (tradeType, befVal, newVal) {
    let price, floor, index;
    if (tradeType === '매매') {
      price = befVal[0] > newVal[0] ? newVal[0] : befVal[0];
      floor = befVal[0] > newVal[0] ? newVal[1] : befVal[1];
      index = befVal[0] > newVal[0] ? newVal[4] : befVal[4];
    } else {
      if (validityCheck[LOW_JEONSE_CHECK].value)
        price = befVal[0] < newVal[0] ? befVal[0] : newVal[0];
      else
        price = befVal[0] < newVal[0] ? newVal[0] : befVal[0];
      floor = befVal[0] < newVal[0] ? newVal[1] : befVal[1];
      index = befVal[0] < newVal[0] ? befVal[4] : newVal[4];
    }
    return [price, floor, befVal[2] + newVal[2], ++befVal[3], index];
  };

  document.querySelectorAll("#articleListArea > div").forEach(function (ele, index) {
    if (agentIndex !== -1 && index > agentIndex - 1) { return; }

    let aptInfo = ele.querySelectorAll("div.info_area .line .spec")[0].innerText.split(", ");
    let size = aptInfo[0];
    let floor = aptInfo[1];
    let tradeType = ele.querySelector("div.price_line .type").innerText;
    let tradePrice = parsePrice(ele.querySelector("div.price_line .price").innerText);
    let spec = ele.querySelectorAll(" div.info_area > p:nth-child(2) > span")[0];
    spec = spec ? spec.innerText : "";

    if ("매매|전세".indexOf(tradeType) > -1) {
      if (!checkMandantoryCondition(size)) return;

      if (!(size in result)) {
        result[size] = { '매매': 0, '전세': 0, '갭': 0, '전세가율': '-', '매매층': '-', '전세층': '-', '매매갯수': 0, '전세갯수': '0', '매매신': '', 'id': index };
        dictPricePerSize[size] = { "매매": {}, "전세": {} };
      }

      const grouped = document.querySelector('#address_group2').checked;
      const keyBase = aptInfo.join(',');
      const storeKey = grouped ? `${keyBase}_${tradePrice}` : keyBase;

      if (!dictPricePerSize[size][tradeType][storeKey]) {
        dictPricePerSize[size][tradeType][storeKey] = [tradePrice, getFloor(floor)[0], spec, 1, index !== undefined ? index : -1];
      } else {
        let beforeValue = dictPricePerSize[size][tradeType][storeKey];
        let newValue = [tradePrice, getFloor(floor)[0], spec, 1, index];
        dictPricePerSize[size][tradeType][storeKey] = tradeTypeValueFnc(tradeType, beforeValue, newValue);
      }
    }
  });

  let isGrouped = document.querySelector('#address_group2').checked;

  for (let key in result) {
    let sellObj = dictPricePerSize[key]['매매'];
    let liveObj = dictPricePerSize[key]['전세'];

    let sellCnt = !isGrouped ? Object.keys(sellObj).length
      : Object.entries(sellObj).reduce((acc, [, item]) => (parseInt(acc) + parseInt(item[3])), 0);
    let liveCnt = !isGrouped ? Object.keys(liveObj).length
      : Object.entries(liveObj).reduce((acc, [, item]) => (parseInt(acc) + parseInt(item[3])), 0);

    for (let k2 in sellObj) {
      let aptObj = sellObj[k2];
      if (!checkItemCondition('매매', k2.split(",")[1], aptObj[2])) delete sellObj[k2];
    }

    let finalSellObj = Object.entries(sellObj).sort(([, a], [, b]) => a[0] - b[0]);
    let finalLivelObj = Object.entries(liveObj).sort(([, a], [, b]) => b[0] - a[0]);

    if (finalSellObj && finalSellObj.length) {
      let sellPrice = finalSellObj[0][1][0];
      result[key]['매매'] = finalSellObj[0][1][0];
      result[key]['매매층'] = finalSellObj[0][1][1];
      result[key]['매매index'] =
        (finalSellObj[0][1] && finalSellObj[0][1].length > 4 && finalSellObj[0][1][4] !== undefined)
          ? finalSellObj[0][1][4]
          : "-";

      if (isGrouped) {
        let compareObj = finalSellObj.filter(item => item[1][0] > sellPrice);
        if (compareObj && compareObj.length) {
          let comparePrice = compareObj[0][1][0];
          let compareRate = (100 - (parseInt(sellPrice) / comparePrice * 100)).toFixed(1);
          result[key]['매매신'] = sinhoCheck(compareRate, comparePrice - parseInt(sellPrice));
        }
      }
    }

    result[key]['매매갯수'] = sellCnt;

    if (finalLivelObj && finalLivelObj.length) {
      let idx = validityCheck[LOW_JEONSE_CHECK].value ? finalLivelObj.length - 1 : 0;
      result[key]['전세'] = finalLivelObj[idx][1][0];
      result[key]['전세층'] = finalLivelObj[idx][1][1];
      result[key]['전세갯수'] = liveCnt;
      result[key]['전세index'] = finalLivelObj[idx][1][4] !== undefined ? finalLivelObj[idx][1][4] : " ";
      result[key]['갭'] = parseInt(result[key]['매매']) - parseInt(result[key]['전세']);
      result[key]['전세가율'] = parseInt(parseInt(result[key]['전세']) / parseInt(result[key]['매매']) * 100) + "%";
    }
  }
  return result;
}

/* ====== 신호등 점 ====== */
function makeShinhoDot(shinhoColor) {
  let canvasDiv = document.createElement("div");
  canvasDiv.style.display = "inline";
  if (typeof shinhoColor === 'object') {
    canvasDiv.title = shinhoColor[1];
    shinhoColor = shinhoColor[0];
  }
  let canvas = document.createElement('canvas');
  canvas.width = 20;
  canvas.height = 20;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(8, 8, 4, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = shinhoColor;
  ctx.fill();
  canvasDiv.appendChild(canvas);
  return canvasDiv;
}

/* ====== 외부 API ====== */
async function findLowestFloorByArea() {
  const url = window.location.href;
  const match = url.match(/complexes\/(\d+)/);
  const complexId = match ? match[1] : null;

  const pyeongInfoResponse = await fetch(`https://new.land.naver.com/api/complexes/${parseInt(complexId, 10)}?sameAddressGroup=true`, {
    headers: {
      accept: "*/*",
      "accept-language": "ko-KR,ko;q=0.9,zh-MO;q=0.8,zh;q=0.7,en-US;q=0.6,en;q=0.5",
      authorization: await fetchToken(),
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrerPolicy: "unsafe-url",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });

  const pyeongInfoData = await pyeongInfoResponse.json();
  const pyeongInfoMap = pyeongInfoData.complexPyeongDetailList.reduce((acc, item) => {
    let entranceTypeSymbol = "";
    if (item.entranceType === "계단식") entranceTypeSymbol = "계";
    else if (item.entranceType === "복도식") entranceTypeSymbol = "복";
    else if (item.entranceType === "복합식") entranceTypeSymbol = "합";
    else entranceTypeSymbol = item.entranceType;

    const formattedValue = `${entranceTypeSymbol}/${item.roomCnt}/${item.bathroomCnt}`;
    acc[item.pyeongName] = formattedValue;
    return acc;
  }, {});
  return pyeongInfoMap;
}
async function fetchToken() {
  const tokenUrl = "https://new.land.naver.com/complexes";
  const response = await fetch(tokenUrl, { method: 'GET' });
  const text = await response.text();
  const tokenStartIndex = text.indexOf('token') + 17;
  const tokenEndIndex = text.indexOf('"', tokenStartIndex);
  const token = text.substring(tokenStartIndex, tokenEndIndex);
  return `Bearer ${token}`;
}

/* ====== 화면 표시/동작 ====== */
let hideManually = false;
let screenInfo;

async function addInfoToScreen(infos) {
  let isGrouped = document.querySelector('#address_group2').checked;
  var oldScreenInfo = document.querySelector('.complex_price_info');
  if (oldScreenInfo) oldScreenInfo.remove();

  screenInfo = document.createElement('div');
  screenInfo.setAttribute('class', 'complex_price_info');
  screenInfo.id = "screenInfo";

  Object.assign(screenInfo.style, {
    overflowY: 'auto',
    marginTop: '10px',
    position: 'fixed',
    top: '400px',
    left: '597px',
    transform: 'translate(-50%, -50%)',
    zIndex: '1000',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #ccc',
    padding: '10px',
    maxHeight: '400px',
    width: '390px',
    display: 'none'
  });
  hideManually = false;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'style') {
        const currentDisplay = screenInfo.style.display;
        if (currentDisplay === 'none' && !hideManually) {
          // hover 제어
        }
      }
    });
  });
  observer.observe(screenInfo, { attributes: true, attributeFilter: ['style'] });

  let isFirst = true;
  var typeResult = await findLowestFloorByArea();

  for (let size in infos) {
    var tradeIndex = infos[size]['매매index'];
    var leaseIndex = infos[size]['전세index'];

    // 화면 표시용 링크
    var strTradePriceInfo = (infos[size]['매매'] ? `<a href='#' class='scroll-link' data-index='${tradeIndex}'>${infos[size]['매매']}/${infos[size]['매매층']}</a>` : '0/-');
    var strLeasePriceInfo = (infos[size]['전세'] ? `<a href='#' class='scroll-link' data-index='${leaseIndex}'>${infos[size]['전세']}/${infos[size]['전세층']}</a>` : '0/-');

    // 엑셀 값 붙여넣기용 4셀 데이터
    const cellA = (infos[size]['매매'] || 0);
    const cellB = (infos[size]['매매층'] || '-');
    const cellC = (infos[size]['전세'] || 0);
    const cellD = (infos[size]['전세층'] || '-');

    var additionalInfos = [];
    if (infos[size]['매매'] && infos[size]['전세']) {
      additionalInfos.push(infos[size]['갭']);
      additionalInfos.push(infos[size]['전세가율']);
    }
    if (infos[size]['매매']) {
      var py = parseInt(/\d+/g.exec(size), 10) / 3.3;
      additionalInfos.push(parseInt(infos[size]['매매'] / py) + "/3.3m²");
    }
    var strAdditionalInfo = "";
    if (document.querySelector('#address_group2').checked)
      strAdditionalInfo += additionalInfos.length > 0 ? "  (" + infos[size]['매매갯수'] + "/" + infos[size]['전세갯수'] + ")" : "";

    // 신호등 설명
    if (isGrouped && isFirst) {
      let multiple = validityCheck[SHINHO_RADIO].value;

      let shinhoDesc = document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_trade_wrap > div > dl:nth-child(1)").cloneNode();
      shinhoDesc.setAttribute("added", true);
      let shinhoDt = document.createElement("dt");
      let greenDot = makeShinhoDot('green');
      let orangeDot = makeShinhoDot('orange');
      let redDot = makeShinhoDot('red');

      let greenDescEle = document.createElement("span");
      greenDescEle.innerHTML = `${SIGN_LOW_VALUE * multiple}%미만`;
      greenDescEle.style.margin = "0 8px 0 -3px";
      greenDescEle.classList.add('data');

      let orangeDescEle = document.createElement("span");
      orangeDescEle.innerHTML = `${SIGN_MIDDLE_VALUE * multiple}%미만`;
      orangeDescEle.style.margin = "0 8px 0 -3px";
      orangeDescEle.classList.add('data');

      let redDescEle = document.createElement("span");
      redDescEle.innerHTML = `${SIGN_MIDDLE_VALUE * multiple}%이상`;
      redDescEle.style.margin = "0 8px 0 -3px";
      redDescEle.classList.add('data');

      shinhoDt.appendChild(greenDot);
      shinhoDt.appendChild(greenDescEle);
      shinhoDt.appendChild(orangeDot);
      shinhoDt.appendChild(orangeDescEle);
      shinhoDt.appendChild(redDot);
      shinhoDt.appendChild(redDescEle);

      shinhoDesc.style.lineHeight = '1px';
      shinhoDesc.appendChild(shinhoDt);
      screenInfo.appendChild(shinhoDesc);
      isFirst = false;
    }

    // 한 줄(한 평형) UI 블럭
    var cloned = document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_trade_wrap > div > dl:nth-child(1)").cloneNode(true);
    cloned.setAttribute("added", true);

    const gujo = "(" + typeResult[`${size}`.split('/')[0]] + ")";

    // 버튼 생성 (클릭 시 TSV/CSV 값만 복사 → 엑셀에서 '값 붙여넣기'와 동일한 효과)
    const title = cloned.getElementsByClassName("title")[0];
    title.innerHTML =
      `<button class="excelCopyBtn"
         onMouseOver="this.style.color='red'"
         onMouseOut="this.style.color='#555'"
         onMouseDown="this.style.color='#1F75FE'"
         onMouseUp="this.style.color='red'">
         ${size}${gujo}
       </button>`;

    const btn = title.querySelector('button');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await copyExcelFourCells([cellA, cellB, cellC, cellD]);
      // 팁: 엑셀에서 셀을 '선택만' 한 뒤 Ctrl+V (편집 모드 X)
    });

    var trade = cloned.getElementsByClassName("data")[0];
    var lease = trade.cloneNode(true);
    var additionalInfo = trade.cloneNode(true);
    var delim = trade.cloneNode(true);

    trade.innerHTML = strTradePriceInfo;
    trade.style.color = '#f34c59';
    lease.innerHTML = strLeasePriceInfo;
    lease.style.color = '#4c94e8';
    delim.innerText = " / ";
    delim.style.color = '#ffffff';
    additionalInfo.innerText = strAdditionalInfo;

    cloned.removeChild(trade);
    cloned.appendChild(delim);
    cloned.appendChild(trade);
    cloned.appendChild(delim.cloneNode(true));
    cloned.appendChild(lease);
    cloned.appendChild(delim.cloneNode(true));
    cloned.appendChild(additionalInfo);

    if (isGrouped && infos[size]['매매'] !== 0 && infos[size]['매매신'] !== '')
      cloned.appendChild(makeShinhoDot(infos[size]['매매신']));

    cloned.style.lineHeight = '1px';
    screenInfo.appendChild(cloned);
  }

  document.querySelector("#summaryInfo").insertBefore(screenInfo, document.querySelector("#summaryInfo > dl"));

  // 리스트 스크롤 이동 링크
  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      let targetIndex = this.getAttribute('data-index');
      scrollToItem(targetIndex);
    });
  });

  installHoverRevealOnce();
}

/* ====== hover 표시 ====== */
function installHoverRevealOnce() {
  if (window.__pricePanelHoverInstalled) return;
  window.__pricePanelHoverInstalled = true;

  let hideTimer = null;
  const HOVER_DELAY = 0;

  const inSafeZone = (el) => !!(el && el.closest && el.closest('#screenInfo, .panel_group--upper'));
  const showPanel = () => { if (screenInfo) screenInfo.style.display = 'block'; };
  const hidePanel = () => { if (screenInfo) screenInfo.style.display = 'none'; };

  document.addEventListener('mousemove', (e) => {
    if (inSafeZone(e.target)) {
      clearTimeout(hideTimer);
      showPanel();
    } else {
      clearTimeout(hideTimer);
      const x = e.clientX, y = e.clientY;
      hideTimer = setTimeout(() => {
        const el = document.elementFromPoint(x, y);
        if (!inSafeZone(el)) hidePanel();
      }, HOVER_DELAY);
    }
  }, { passive: true });

  document.body.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab_area_list .tab_item[id^="detailTab"]');
    if (tab && screenInfo) screenInfo.style.display = 'none';
  }, true);
}

/* ====== 기타 유틸 ====== */
function scrollToItem(index) {
  let targetItem = document.querySelector(`#articleListArea > div:nth-child(${parseInt(index) + 1})`);
  let targetItembefore = document.querySelector(`#articleListArea > div:nth-child(${parseInt(index)})`);
  let scrollContainer = document.querySelector("#complexOverviewList > div.list_contents > div.item_area > div");

  if (targetItem && targetItembefore && scrollContainer) {
    targetItembefore.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
    targetItem.style.border = '2px solid red';
    setTimeout(() => { targetItem.style.border = 'none'; }, 2000);
  } else if (targetItem && !targetItembefore && scrollContainer) {
    targetItem.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    targetItem.style.border = '2px solid red';
    setTimeout(() => { targetItem.style.border = 'none'; }, 2000);
  } else {
    alert('해당 매물을 찾을 수 없습니다.');
  }
}

function sortOnKeys(dict) {
  var tempDict = {};
  let sorted = jQuery('#complexOverviewList > div.list_contents > div.list_fixed > div.list_filter > div > div:nth-child(2) > div > div > ul > li label.checkbox_label')
    .map((idx, item) => item.innerText.replace('㎡', ''));
  let keys = Object.keys(dict);

  sorted.map((idx, item) => {
    keys.map((key) => {
      if (key.indexOf(item) === 0) tempDict[key] = dict[key];
    });
  });
  return tempDict;
}

/* ====== 메인 진입 ====== */
var g_lastSelectedApt = "";

function addObserverIfDesiredNodeAvailable() {
  var target = document.getElementsByClassName('map_wrap')[0];
  var inDebounce;
  if (!target) return;

  for (let key in validityCheck) {
    let obj = validityCheck[key];
    if (!obj.isCreate) createBox(key, obj.type);
  }

  jQuery(document).on('click', (e) => {
    if (jQuery(e.target).parents('a.item_link').length > 0 || e.target.className === 'complex_link')
      setTimeout(() => { jQuery('.detail_panel').css("left", "406px"); }, 500);
  });

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      [].slice.call(mutation.addedNodes).forEach(function (addedNode) {
        if (!addedNode.classList || (!addedNode.classList.contains('infinite_scroll') && !addedNode.classList.contains('item'))) {
          return;
        }

        if (!document.querySelector("#complexTitle")) {
          console.log("Unexpected issues #1");
          return;
        }

        if (document.querySelector("#complexTitle").innerText != g_lastSelectedApt) {
          document.querySelectorAll("#summaryInfo > div.complex_summary_info > div.complex_trade_wrap > div > dl").forEach(function (ele) {
            if (ele.hasAttribute("added")) ele.remove();
          });
          g_lastSelectedApt = document.querySelector("#complexTitle").innerText;
        }

        document.querySelector('.filter_popup--type-list')?.getAttribute('aria-hidden') !== 'false' &&
          (document.querySelector("#complexOverviewList > div > div.item_area > div").scrollTop =
            document.querySelector("#complexOverviewList > div > div.item_area > div").scrollHeight);

        var runFnc = function () {
          const isPopupOpened = document.querySelector('.filter_popup--type-list')?.getAttribute('aria-hidden') === 'false';
          if (isPopupOpened) return;
          updateListAndScrollTop();
        };

        if (inDebounce) clearTimeout(inDebounce);
        inDebounce = setTimeout(runFnc, 500);
      });
    });
  });

  var config = { childList: true, subtree: true };
  observer.observe(target, config);
}

async function updateListAndScrollTop() {
  let result = getPrice_WeolbuStandard();
  result = sortOnKeys(result);
  await addInfoToScreen(result);

  const scrollTarget = document.querySelector("#complexOverviewList > div > div.item_area > div");
  if (scrollTarget) scrollTarget.scrollTop = 0;
}

/* detail_panel 감시해서 탭 클릭 숨기기 처리 */
function addTabClickEvent() {
  const tabContainer = document.querySelector('.tab_area_list');
  if (tabContainer) {
    tabContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab_item');
      if (tab && tab.id.startsWith('detailTab')) {
        if (screenInfo) screenInfo.style.display = 'none';
      }
    });
  }
}

const observerDetailPanel = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches('#ct > div.map_wrap > div.detail_panel')) {
          let elapsedTime = 0;
          const interval = setInterval(() => {
            const tabContainer = document.querySelector('.tab_area_list');
            if (tabContainer) {
              clearInterval(interval);
              addTabClickEvent();
            }
            elapsedTime += 100;
            if (elapsedTime >= 10000) clearInterval(interval);
          }, 100);
        }
      });
    }
  });
});
observerDetailPanel.observe(document.body, { childList: true, subtree: true });

function monitorPanelGroupCreation() {
  const observedSet = new WeakSet();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList.contains('panel_group--upper') && !observedSet.has(node)) {
          observedSet.add(node);
          const filterPopup = node.querySelector('.filter_popup--type-list');
          if (filterPopup) observeFilterPopup(filterPopup);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const initialPanel = document.querySelector('.panel_group--upper');
  if (initialPanel && !observedSet.has(initialPanel)) {
    observedSet.add(initialPanel);
    const filterPopup = initialPanel.querySelector('.filter_popup--type-list');
    if (filterPopup) observeFilterPopup(filterPopup);
  }
}

function observeFilterPopup(popupNode) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
        const visible = popupNode.getAttribute('aria-hidden') === 'false';
        if (!visible) {
          const scrollTarget = document.querySelector("#complexOverviewList > div > div.item_area > div");
          if (scrollTarget) {
            document.querySelector('.filter_popup--type-list')?.getAttribute('aria-hidden') !== 'false' &&
            (document.querySelector("#complexOverviewList > div > div.item_area > div").scrollTop =
              document.querySelector("#complexOverviewList > div > div.item_area > div").scrollHeight);

            updateListAndScrollTop();
            const event = new Event('scroll', { bubbles: true });
            scrollTarget.dispatchEvent(event);
            setTimeout(() => { scrollTarget.scrollTop = 0; }, 300);
          }
        }
      }
    });
  });
  observer.observe(popupNode, { attributes: true, attributeFilter: ['aria-hidden'] });
}

/* 시작 */
monitorPanelGroupCreation();
addObserverIfDesiredNodeAvailable();
