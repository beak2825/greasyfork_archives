// ==UserScript==
// @name         Arca Live Best Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  화살표 키로 념글 이동 (왼쪽: 최신글/이전페이지, 오른쪽: 과거글/다음페이지)
// @match        https://arca.live/b/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562764/Arca%20Live%20Best%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/562764/Arca%20Live%20Best%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 키보드 이벤트 리스너 추가
    document.addEventListener('keydown', function(e) {
        // 입력창(댓글, 검색 등)에 커서가 있을 때는 동작하지 않음
        const activeTag = document.activeElement.tagName.toUpperCase();
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement.isContentEditable) {
            return;
        }

        // 왼쪽 또는 오른쪽 화살표 키 확인
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            navigatePost(e.key);
        }
    });

    function navigatePost(key) {
        // 1. 리스트 테이블 찾기
        const listTable = document.querySelector(".list-table.table");
        if (!listTable) return;

        // 2. 현재 활성화된(보고 있는) 게시글 찾기 ("vrow column active")
        const activeRow = listTable.querySelector("a.vrow.column.active");
        if (!activeRow) return;

        // 현재 게시글 번호 가져오기 ("vcol col-id" 안의 span)
        const idSpan = activeRow.querySelector(".vcol.col-id span");
        if (!idSpan) return;

        // 게시글 번호 정수 변환
        const currentId = parseInt(idSpan.innerText.trim());
        if (isNaN(currentId)) return;

        let targetId;

        // 3. 화살표 방향에 따른 타겟 ID 계산
        if (key === 'ArrowLeft') {
            // 왼쪽: 현재 번호 + 1 (최신글 방향)
            targetId = currentId + 1;
        } else {
            // 오른쪽: 현재 번호 - 1 (과거글 방향)
            targetId = currentId - 1;
        }

        // --- 현재 페이지(HTML) 내에서 타겟 게시글 찾기 ---
        const rows = listTable.querySelectorAll("a.vrow");
        let found = false;

        for (let row of rows) {
            const rowIdSpan = row.querySelector(".vcol.col-id span");
            if (rowIdSpan) {
                const rowId = parseInt(rowIdSpan.innerText.trim());
                if (rowId === targetId) {
                    // 찾았으면 해당 링크 클릭 (이동)
                    row.click();
                    found = true;
                    break;
                }
            }
        }

        // 4. 현재 리스트에 없다면 URL 파라미터 조작하여 페이지 이동 시도
        if (!found) {
            const currentUrl = new URL(window.location.href);
            const params = new URLSearchParams(currentUrl.search);

            // 현재 페이지 번호 가져오기 (파라미터 없으면 기본값 1)
            let currentPage = parseInt(params.get('p')) || 1;

            // [추가된 로직] 왼쪽 화살표(최신글 방향)인데 이미 1페이지라면 동작 중단
            if (key === 'ArrowLeft' && currentPage <= 1) {
                return;
            }

            // 페이지 계산
            let pageModifier = (key === 'ArrowLeft') ? -1 : 1;
            let nextPage = currentPage + pageModifier;

            // 안전장치: 1페이지 미만으로 내려가지 않도록 (위에서 막았지만 혹시 모를 로직 위해 유지)
            if (nextPage < 1) nextPage = 1;

            // URL 경로 분석 (/b/채널명/게시글ID -> /b/채널명 추출)
            const pathParts = currentUrl.pathname.split('/');

            if (pathParts.length >= 3 && pathParts[1] === 'b') {
                const boardSlug = pathParts[2];

                // 5. URL 생성 및 이동
                const newUrl = `https://arca.live/b/${boardSlug}?mode=best&p=${nextPage}`;
                window.location.href = newUrl;
            }
        }
    }
})();