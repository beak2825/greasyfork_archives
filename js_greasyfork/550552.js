// ==UserScript==
// @name         SOOP 구글 드라이브 이미지 업로드 서비스
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  구글 드라이브에서 썸네일 링크 자동 변환 + 웹사이트에서 이미지로 변환
// @author       You
// @match        https://drive.google.com/*
// @match        https://sooplive.co.kr/station/*/post/write*
// @match        https://www.sooplive.co.kr/station/*/post/write*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550552/SOOP%20%EA%B5%AC%EA%B8%80%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%97%85%EB%A1%9C%EB%93%9C%20%EC%84%9C%EB%B9%84%EC%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/550552/SOOP%20%EA%B5%AC%EA%B8%80%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%97%85%EB%A1%9C%EB%93%9C%20%EC%84%9C%EB%B9%84%EC%8A%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==============================================
    // 공통 유틸리티 함수
    // ==============================================

    // 간단한 알림 표시
    function showNotification(message, bgColor = '#4CAF50') {
        const notification = document.createElement('div');
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 12px 18px; border-radius: 6px;
            background: ${bgColor}; color: white;
            z-index: 10000; font-size: 13px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // 구글 드라이브 링크에서 ID 추출
    function extractFileId(url) {
        const patterns = [
            /\/open\?id=([a-zA-Z0-9_-]+)/,
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /[?&]id=([a-zA-Z0-9_-]+)/
        ];

        for (let pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    // ==============================================
    // 구글 드라이브 기능 (drive.google.com)
    // ==============================================

    function initGoogleDriveFeatures() {
        // 선택된 파일이 이미지인지 확인
        function isImageSelected() {
            const selectedItems = document.querySelectorAll('[aria-selected="true"]');

            for (let item of selectedItems) {
                const titleElement = item.querySelector('[data-tooltip], [title], [aria-label]');
                if (titleElement) {
                    const fileName = titleElement.getAttribute('data-tooltip') ||
                                   titleElement.getAttribute('title') ||
                                   titleElement.getAttribute('aria-label') ||
                                   titleElement.textContent || '';

                    // 이미지 확장자 체크
                    if (/\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico|heic)/i.test(fileName)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 클립보드 변환 처리
        async function convertClipboard() {
            try {
                const clipboardText = await navigator.clipboard.readText();

                // 구글 드라이브 링크인지 확인
                if (!clipboardText.includes('drive.google.com')) return;

                // 이미 썸네일 링크라면 건너뛰기
                if (clipboardText.includes('/thumbnail?')) return;

                // 이미지 파일인지 확인
                if (!isImageSelected()) return;

                // 파일 ID 추출
                const fileId = extractFileId(clipboardText);
                if (!fileId) return;

                // 썸네일 링크 생성 및 클립보드 저장
                const thumbnailLink = `https://drive.google.com/thumbnail?id=${fileId}`;
                await navigator.clipboard.writeText(thumbnailLink);

                showNotification('🖼️ 썸네일 링크로 변환 완료!');

            } catch (error) {
                // 에러는 조용히 무시
            }
        }

        // Ctrl+C 감지
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'c') {
                setTimeout(convertClipboard, 200);
            }
        });
    }

    // ==============================================
    // 웹사이트 기능 (sooplive.co.kr)
    // ==============================================

    function initWebsiteFeatures() {
        // 구글 드라이브 thumbnail 링크를 이미지로 변환
        function convertToImage(html) {
            let result = html;

            // thumbnail 링크만 정확히 매칭하여 변환
            const thumbnailPattern = /<a[^>]*href=["'](https:\/\/drive\.google\.com\/(?:thumbnail\?.*?id=|uc\?.*?id=)([a-zA-Z0-9_-]+)[^"']*)["'][^>]*>[^<]*<\/a>/gi;

            result = result.replace(thumbnailPattern, (match, url, id) => {
                return `<img src="https://drive.google.com/thumbnail?id=${id}&sz=w800" />`;
            });

            return result;
        }

        // 에디터 요소에 이벤트 추가
        function addEvents(element) {
            // 붙여넣기 후 변환
            element.addEventListener('paste', () => {
                setTimeout(() => {
                    const converted = convertToImage(element.innerHTML);
                    if (converted !== element.innerHTML) {
                        element.innerHTML = converted;
                    }
                }, 500);
            });

            // 입력 후 변환 (자동 링크 생성 대응)
            element.addEventListener('input', () => {
                setTimeout(() => {
                    const converted = convertToImage(element.innerHTML);
                    if (converted !== element.innerHTML) {
                        element.innerHTML = converted;
                    }
                }, 2000);
            });
        }

        // 초기화
        function init() {
            // CKEditor 4
            if (window.CKEDITOR?.instances) {
                Object.values(CKEDITOR.instances).forEach(editor => {
                    editor.on('paste', () => {
                        setTimeout(() => {
                            const converted = convertToImage(editor.getData());
                            if (converted !== editor.getData()) {
                                editor.setData(converted);
                            }
                        }, 500);
                    });
                });
            }

            // 모든 편집 가능한 요소
            document.querySelectorAll('[contenteditable="true"], .cke_editable, .ck-content').forEach(addEvents);
        }

        // 페이지 로드 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
        } else {
            setTimeout(init, 1000);
        }

        // 동적으로 추가되는 에디터 감지
        new MutationObserver(() => {
            document.querySelectorAll('[contenteditable="true"]:not([data-gdrive-ready]), .cke_editable:not([data-gdrive-ready]), .ck-content:not([data-gdrive-ready])').forEach(el => {
                el.setAttribute('data-gdrive-ready', 'true');
                addEvents(el);
            });
        }).observe(document.body, { childList: true, subtree: true });
    }

    // ==============================================
    // 메인 실행 로직
    // ==============================================

    const currentUrl = window.location.href;

    if (currentUrl.includes('drive.google.com')) {
        // 구글 드라이브에서만 실행
        initGoogleDriveFeatures();
    } else if (currentUrl.includes('sooplive.co.kr')) {
        // 수프라이브에서만 실행
        initWebsiteFeatures();
    }

})();