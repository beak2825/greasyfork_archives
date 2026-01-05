// ==UserScript==
// @name        njuCoursesPart1
// @namespace   http://handsomeone.com
// @description 补选南京大学的通识课（上）
// @include     http://*.nju.edu.cn:8080/jiaowu/student/elective/courseList.do?method=discussRenewCourseList&campus=*
// @version     2.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8389/njuCoursesPart1.user.js
// @updateURL https://update.greasyfork.org/scripts/8389/njuCoursesPart1.meta.js
// ==/UserScript==
domain = location.hostname.slice(0, - 11);
campus = document.getElementById('campusList').options[document.getElementById('campusList').selectedIndex].value;
inputs = document.getElementsByTagName('input');
if (inputs.length == 1) {
  location = location;
} 
else {
  luck = inputs[parseInt(Math.random() * (inputs.length - 1))];
  name = luck.parentNode.parentNode.childNodes[2].innerHTML;
  date = luck.parentNode.parentNode.childNodes[4].innerHTML;
  //  排除特定日期课程 可自行修改
  if (name != localStorage.lastName) {
    //  以下用于记录刷出课程 可注释
    if (localStorage.i) {
      localStorage.i = eval(localStorage.i) + 1;
      localStorage.n += ',' + name;
    } 
    else {
      localStorage.i = 1;
      localStorage.n = name;
    }
    localStorage.lastName = name;
    location = 'http://' + domain + '.nju.edu.cn:8080/jiaowu/student/elective/courseList.do?method=submitDiscussRenew&classId=' + luck.value + '&campus=' + campus;
  } 
  else {
    location = location;
  }
}