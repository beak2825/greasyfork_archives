// ==UserScript==
// @name       SoccerLine Comments Filter
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @namespace  http://www.soccerline.co.kr/
// @version    0.3
// @description  SoccerLine Comments Filtering by Nickname
// @match      http://www.soccerline.co.kr/slboard/view.php*
// @run-at document-start
// @copyright  2014.02, tmfflqj
// @downloadURL https://update.greasyfork.org/scripts/7253/SoccerLine%20Comments%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/7253/SoccerLine%20Comments%20Filter.meta.js
// ==/UserScript==

// ############ 싸줄 게시판 닉네임 블락 스크립트입니다 #############
// 목록에서 숨기고 싶은 닉네임을 아래와 같이 따옴표로 묶어 추가 작성
// ex) "가나다"라는 사용자 닉네임을 추가하고 싶으면 다음과 같이 수정
// --> var blockList = ['운영자','오즈온','가나다'];
// #################################################################
// last update 2014.02.21

// Block List Array
var blockList = ['운영자','오즈온','풋볼레전드'];

document.addEventListener('DOMContentLoaded', hideContent(), false);

function hideContent() {
    var p = document.getElementsByTagName("p")[1];
    if(typeof(p) != "undefined") {
        var tables = p.getElementsByTagName("table");
        for(var i = 0; i < tables.length; i++) {
            for(var j = 0; j < blockList.length; j++) {
                var tbody = tables[i].getElementsByTagName("tbody")[0];
                var b = tbody.getElementsByTagName("b")[0];
                if($(b).text() == blockList[j]) {
                    $(tables[i]).hide();
                }
            }
        }
        return;
    }
    else {
        setTimeout(arguments.callee, 0);
    }
}
