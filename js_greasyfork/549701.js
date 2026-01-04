// ==UserScript==
// @name         Inha I-Class Video Helper (Fixed & Improved)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds buttons to copy the video title, m3u8 link, and a combined CSV format from the I-Class video viewer.
// @author       hwoo
// @match        https://learn.inha.ac.kr/mod/vod/viewer.php?id=*
// @license MIT
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549701/Inha%20I-Class%20Video%20Helper%20%28Fixed%20%20Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549701/Inha%20I-Class%20Video%20Helper%20%28Fixed%20%20Improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 페이지가 완전히 로드될 때까지 기다립니다.
    window.addEventListener('load', function() {
        // --- 1. 동영상 제목 가져오기 ---
        const titleElement = document.querySelector('#vod_header > h1');
        let fullTitle = titleElement ? titleElement.innerText.trim() : 'Title Not Found';

        // 제목 텍스트에서 재생 시간과 출석 상태 정보 제거
        const playtimeElement = titleElement.querySelector('.playtime');
        const attendanceElement = titleElement.querySelector('.attendance');
        if (playtimeElement) {
            fullTitle = fullTitle.replace(playtimeElement.innerText, '').trim();
        }
        if (attendanceElement) {
            fullTitle = fullTitle.replace(attendanceElement.innerText, '').trim();
        }
        const videoTitle = fullTitle;

        // --- 2. m3u8 링크 가져오기 ---
        const sourceElement = document.querySelector('#my-video source');
        const m3u8Link = sourceElement ? sourceElement.getAttribute('src') : 'm3u8 Link Not Found';

        // --- 3. 버튼 생성 및 스타일 적용 ---
        const buttonContainer = document.createElement('span');
        buttonContainer.style.marginLeft = '15px';
        buttonContainer.style.display = 'inline-flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.verticalAlign = 'middle';

        const copyTitleButton = document.createElement('button');
        copyTitleButton.innerText = 'Copy Title';

        const copyLinkButton = document.createElement('button');
        copyLinkButton.innerText = 'Copy m3u8 Link';

        // [추가] CSV용 복사 버튼 생성
        const copyCsvButton = document.createElement('button');
        copyCsvButton.innerText = 'Copy for CSV';


        // 버튼에 스타일 적용
        GM_addStyle(`
            .custom-copy-button {
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 4px;
                background-color: #f0f0f0;
                color: #333;
                font-family: sans-serif;
                transition: background-color 0.2s;
            }
            .custom-copy-button:hover {
                background-color: #e0e0e0;
            }
            .custom-copy-button:active {
                background-color: #d0d0d0;
            }
        `);

        copyTitleButton.className = 'custom-copy-button';
        copyLinkButton.className = 'custom-copy-button';
        copyCsvButton.className = 'custom-copy-button'; // [추가] 새로운 버튼에도 스타일 클래스 적용

        // --- 4. 페이지에 버튼 추가 ---
        buttonContainer.appendChild(copyTitleButton);
        buttonContainer.appendChild(copyLinkButton);
        buttonContainer.appendChild(copyCsvButton); // [추가] 새로운 버튼을 컨테이너에 추가
        if (titleElement) {
            titleElement.appendChild(buttonContainer);
        }

        // --- 5. 버튼에 클릭 이벤트 추가 ---
        copyTitleButton.addEventListener('click', function(event) {
            event.stopPropagation(); // 다른 클릭 이벤트 전파 방지
            GM_setClipboard(videoTitle, 'text');
            alert('제목이 클립보드에 복사되었습니다:\n' + videoTitle);
        });

        copyLinkButton.addEventListener('click', function(event) {
            event.stopPropagation();
            if (m3u8Link !== 'm3u8 Link Not Found') {
                GM_setClipboard(m3u8Link, 'text');
                alert('m3u8 링크가 클립보드에 복사되었습니다:\n' + m3u8Link);
            } else {
                alert('m3u8 링크를 찾을 수 없습니다.');
            }
        });

        // [추가] CSV용 복사 버튼 클릭 이벤트
        copyCsvButton.addEventListener('click', function(event) {
            event.stopPropagation();
            if (videoTitle !== 'Title Not Found' && m3u8Link !== 'm3u8 Link Not Found') {
                const csvData = `${videoTitle},${m3u8Link}`;
                GM_setClipboard(csvData, 'text');
                alert('CSV 형식이 클립보드에 복사되었습니다:\n' + csvData);
            } else {
                alert('제목 또는 m3u8 링크를 찾을 수 없어 복사할 수 없습니다.');
            }
        });
    });
})();