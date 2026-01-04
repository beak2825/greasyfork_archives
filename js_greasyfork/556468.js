// ==UserScript==
// @name        自动填写日志内容和工时、完成比例
// @namespace   Violentmonkey Scripts
// @match       https://oa.epoint.com.cn/dailyreportmanage/pages/dailyrecord/dailyrecordaddv2/gzrz/gzrzcontentold*
// @grant       none
// @version     1.1
// @author      lihao
// @description 2025/11/19 09:28:26
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556468/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%97%A5%E5%BF%97%E5%86%85%E5%AE%B9%E5%92%8C%E5%B7%A5%E6%97%B6%E3%80%81%E5%AE%8C%E6%88%90%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556468/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%97%A5%E5%BF%97%E5%86%85%E5%AE%B9%E5%92%8C%E5%B7%A5%E6%97%B6%E3%80%81%E5%AE%8C%E6%88%90%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==



(function() {
  'use strict';
  console.clear();


  setInterval(function(){
    if(mini.get('missionName').getValue()==''){
      return;
    }

    var currentRow = mini.get('taskGrid').getCurrentCell()[0];

    var realworkdays=0;
    if(currentRow.realworkdays!=""){
      realworkdays = currentRow.realworkdays;
    }

    var gongshi = (currentRow.expectcosted*100-realworkdays*100)/100;

    if(mini.get('completePercent').getValue()!=currentRow.completepercent ){
      return;
    }

    gongshi = Math.floor(gongshi * 10) / 10;
    mini.get('gongZuoNR').setValue(currentRow.missionname);
    mini.get('gongZuoSJ').setValue(gongshi);
    mini.get('completePercent').setValue(100); // 完成比例

  }, 500);



})();