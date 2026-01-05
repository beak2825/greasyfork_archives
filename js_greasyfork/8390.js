// ==UserScript==
// @name        njuCoursesPart2
// @namespace   http://handsomeone.com
// @description 补选南京大学的通识课（下）
// @include     http://*.nju.edu.cn:8080/jiaowu/student/elective/courseList.do?method=submitDiscussRenew&classId=*&campus=*
// @version     2.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8390/njuCoursesPart2.user.js
// @updateURL https://update.greasyfork.org/scripts/8390/njuCoursesPart2.meta.js
// ==/UserScript==
domain = location.hostname.slice(0, - 11);
campus = document.getElementById('campusList').options[document.getElementById('campusList').selectedIndex].value;
window.location.href = 'http://' + domain + '.nju.edu.cn:8080/jiaowu/student/elective/courseList.do?method=discussRenewCourseList&campus=' + campus;
