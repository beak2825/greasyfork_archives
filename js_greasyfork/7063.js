// ==UserScript==
// @name        MyMunzeeFriends
// @namespace   MyMunzeeFriends
// @include     https://www.munzee.com/friends/
// @version     1.0.1
// @grant       none
// @description my Munzee friends script
// @downloadURL https://update.greasyfork.org/scripts/7063/MyMunzeeFriends.user.js
// @updateURL https://update.greasyfork.org/scripts/7063/MyMunzeeFriends.meta.js
// ==/UserScript==
// <div>
//   <div style="height: 10px; margin-bottom: 0px;" class="progress progress-striped"> 
//     <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
//   </div>
// </div> 

jQuery(document).ready(function ($) {
  var scoreArray = [5, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 625, 700, 775, 825, 900, 1000, 1100, 1200, 1300, 1400, 1500,
                    1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3200, 3400, 3600, 3800, 4000, 4200,
                    4400, 4600, 4800, 5000, 5900, 6800, 7700, 8600, 9500, 10400, 11100, 12000, 12900, 13800, 14700, 15600, 16500, 17400, 18300,
                    19200, 20100, 21000, 21900, 22800, 23700, 24600, 25500, 26400, 27300, 28200, 29100, 30000, 30900, 31800, 32700, 33600, 34500,
                    35400, 36300, 37200, 38100, 39000, 39900, 40800, 41700, 42600, 43500, 44400, 45300, 46200, 47100, 48000, 48900, 50000, 100000,
                    150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000,
                    950000, 1000000, 2000000, 3000000, 4000000];
  $('.clan-member').each(function(i, obj) {
    var score = $(this).next().next().next().next().text().replace(/,/g, '');
    var level = $(this).next().text().replace(',', '');
    if (level < 122) {
      var levelUp = scoreArray[level];
      var levelDown = 0;
      if (level > 1) 
        levelDown = scoreArray[level - 1];
      var percent = Math.round(((score - levelDown) / (levelUp - levelDown)) * 100);
      var levelBuffer = '<div style="margin-top: 3px;">' +
                        '<div style="height: 8px; margin-bottom: 0px; border-radius: 2px;" class="progress progress-striped">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%"></div></div>' +
                        '<div style="font-size: 10px; float: left;">' + levelDown + '-' + levelUp + '</div>' +
                        '<div style="font-size: 10px; float: right;">' + (levelUp - score)  + '</div>' +
                        '<div style="clear:both;height: 1px; overflow: hidden"></div></div>';
      $(this).append(levelBuffer);
    }
  });
});

