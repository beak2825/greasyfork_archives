// ==UserScript==
// @name         FuckCourseEvaluation
// @version      1.0
// @description  수강평가 기간 제한을 해제합니다.
// @author       You
// @match        https://stud.dgist.ac.kr/ucr/ucreLtApprSurveyInvest/index.do
// @match        https://stud.dgist.ac.kr/ucr/ucreLtApprSurveyInvest/popSurvey.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dgist.ac.kr
// @grant        none
// @namespace https://greasyfork.org/users/467840
// @downloadURL https://update.greasyfork.org/scripts/560063/FuckCourseEvaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/560063/FuckCourseEvaluation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.searchMaster = function(){
        var studNoS = $('#searchForm').find('#searchStdNo').val();
        if(studNoS == "" || studNoS == null){
            //alert("학생 사용자가 아닙니다. 학번/성명을 입력하시기 바랍니다.");
        }else{
            fnSearch(gridObj1, '#searchForm');
        }
    }

    window.popLecInv = function (rowId) {
        const payload = {
            popYear   : gridObj1.getCell(rowId, 'SHYY'),
            popTerm   : gridObj1.getCell(rowId, 'SHTM_DCD'),
            popOrgn   : gridObj1.getCell(rowId, 'ORGN_CLSF_DCD'),
            popStdNo  : gridObj1.getCell(rowId, 'STUD_NO'),
            popSbjtNo : gridObj1.getCell(rowId, 'SBJT_NO'),
            popClssNo : gridObj1.getCell(rowId, 'CLSS_NO'),
            popApprDcd: gridObj1.getCell(rowId, 'APPR_DCD')
        };

        // 1️⃣ 팝업 먼저 열기
        const popup = window.open(
            '',
            'popLecInv',
            'width=1100,height=870,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
            alert('팝업이 차단되었습니다.');
            return;
        }

        popup.document.write('<h2 style="padding:20px">Loading...</h2>');

        // 2️⃣ fetch로 HTML 가져오기
        fetch('/ucr/ucreLtApprSurveyInvest/popSurvey.do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: new URLSearchParams(payload)
        })
            .then(res => res.text())
            .then(html => {
            console.log('원본 HTML ↓↓↓');
            console.log(html);

            const sanitizedHtml = html
            .replace(`'N' != "Y"`, 'false')

            console.log('조건문 패칭 HTML ↓↓↓');
            console.log(sanitizedHtml);

            popup.document.open();
            popup.document.write(sanitizedHtml);
            popup.document.close();
        })
            .catch(err => {
            console.error(err);
            popup.document.body.innerHTML =
                '<h2 style="color:red">강의평가 로딩 실패</h2>';
        });
    }


})();