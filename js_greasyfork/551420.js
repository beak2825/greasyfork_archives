// ==UserScript==
// @name         동영상 다운로드
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  현재 페이지의 제목을 동영상 파일명으로 설정합니다.
// @author       You
// @match        https://lcms.snu.ac.kr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551420/%EB%8F%99%EC%98%81%EC%83%81%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/551420/%EB%8F%99%EC%98%81%EC%83%81%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const downloadBtnId = 'my-custom-download-button';

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('video') && !document.getElementById(downloadBtnId)) {
            createAdvancedDownloadButton();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function createAdvancedDownloadButton() {
        const btn = document.createElement('button');
        btn.id = downloadBtnId;
        btn.innerHTML = '다운로드';
        btn.style.cssText = 'position:fixed; top:10px; right:10px; z-index:9999; padding:10px; background-color:#007bff; color:white; border:none; border-radius:5px; cursor:pointer;';
        document.body.appendChild(btn);
        btn.addEventListener('click', startAdvancedDownload);
    }

    function sanitizeFilename(name) {
        if (!name || name.trim() === '') {
            name = 'video';
        }
        return name.replace(/[\\?%*:|"<>.\/]/g, '_').trim();
    }

    // 최적화된 파일명 추출 함수 (v5.1)
    function getBestFilename() {
        // 유일한 전략: 현재 페이지의 제목을 파일명으로 사용
        const filename = document.title;
        return sanitizeFilename(filename);
    }

    async function startAdvancedDownload() {
        this.innerHTML = '진행 중...';
        this.disabled = true;

        const videoElement = document.querySelector('video');
        if (!videoElement || !videoElement.src) {
            alert('비디오를 찾을 수 없습니다.');
            this.innerHTML = '다운로드';
            this.disabled = false;
            return;
        }

        const videoUrl = videoElement.src;
        const filename = getBestFilename() + '.mp4';

        try {
            const response = await fetch(videoUrl, { referrerPolicy: "no-referrer-when-downgrade" });

            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }

            const videoBlob = await response.blob();
            const blobUrl = URL.createObjectURL(videoBlob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);

        } catch (error) {
            alert(`다운로드에 실패했습니다: ${error.message}`);
        } finally {
            this.innerHTML = '다운로드';
            this.disabled = false;
        }
    }
})();