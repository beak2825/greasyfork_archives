// ==UserScript==
// @name         hmc olo-live configuration
// @namespace    http://tampermonkey.net/
// @version      2025-11-06
// @description  olo라이브 로컬프로퍼티 설정
// @author       dh.jo
// @match        https://kop.kolonmall.com/kophmc/com/configuration/process.do
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/554955/hmc%20olo-live%20configuration.user.js
// @updateURL https://update.greasyfork.org/scripts/554955/hmc%20olo-live%20configuration.meta.js
// ==/UserScript==


(function() {
    'use strict';


const select = document.createElement('select');
select.onchange = function () {
  const propertyKey = document.getElementById('propertyKey');
  const propertyValue = document.getElementById('propertyValue');

  propertyKey.value = this.value;
  propertyValue.value = '';
  propertyValue.focus(); // 포커스 이동
};

// option 목록 추가
const options = [
  'joykolon.kop.livecommerce.enable',
  'joykolon.kop.livecommerce.day',
  'joykolon.kop.livecommerce.campaignKey',
  'joykolon.kop.livecommerce.brandId'
];

options.forEach(value => {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
});

// #propertyKey 앞에 삽입
const propertyKey = document.getElementById('propertyKey');
propertyKey.parentNode.insertBefore(select, propertyKey);

// #propertyKey 스타일 지정
propertyKey.style.width = '240px';
propertyKey.style.marginLeft = '10px';

})();