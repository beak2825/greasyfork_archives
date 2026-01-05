// ==UserScript==
// @name        Hide market entries in ppomppu e-cig forum
// @name:ko     전담포럼 장터글 숨김
// @namespace   
// @description 뽐뿌 전자담배포럼에서 장터글을 숨기거나 보이도록 설정할 수 있습니다.
// @include     http://www.ppomppu.co.kr/zboard/zboard.php?id=e_cig*
// @include     http://ppomppu.co.kr/zboard/zboard.php?id=e_cig*
// @version     1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/9315/Hide%20market%20entries%20in%20ppomppu%20e-cig%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/9315/Hide%20market%20entries%20in%20ppomppu%20e-cig%20forum.meta.js
// ==/UserScript==

var optionsEnum = { "COLLAPSE":1, "HIDE":2, "SHOW":3 };

function showhide(flag) {
  var key=document.querySelectorAll('td .han4');
  for (var i in key) {
    if (key[i].textContent==='장터') {
      // key[i].parentNode.parentNode.style.visibility = (flag==1)?'collapse':(flag==2)?'hidden':'visible';
      // use 'display:none' instead of 'visibility:collapse' due to a defect of chrome.
      key[i].parentNode.parentNode.style.display = (flag==optionsEnum.COLLAPSE) ? 'none':'';
      key[i].parentNode.parentNode.style.visibility = (flag==optionsEnum.HIDE) ? 'hidden':'';
      if (flag==optionsEnum.HIDE) key[i].style.visibility = 'visible';
    }
  }
}

// 검색중이거나 장터탭이 아닐 때만
if (! /category=4|search_type=/.test(window.location) ) {
    var flag = GM_getValue('hideMarketEntries', optionsEnum.SHOW);
    
    var optSelector = document.createElement('div');
    optSelector.style.display = 'inline-block';
    optSelector.style.color = 'red';
    optSelector.innerHTML='장터글\
        <select id="marketFlag">\
        <option value="1">숨김\
        <option value="2">가리기\
        <option value="3">보이기\
    ';
    document.getElementById('navlist').appendChild(optSelector);
    
    marketFlag.selectedIndex = flag-1;
    marketFlag.onchange=function(){GM_setValue('hideMarketEntries',flag=this.value); showhide(flag);};
        
    showhide(flag);
}
