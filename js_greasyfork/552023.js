// ==UserScript==
// @name         코네 유틸
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  kone.gg 댓글 답글 토글 및 환영 메시지 복원, 썸네일 크기 설정 기능
// @author       cloud67p
// @match        https://kone.gg/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552023/%EC%BD%94%EB%84%A4%20%EC%9C%A0%ED%8B%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/552023/%EC%BD%94%EB%84%A4%20%EC%9C%A0%ED%8B%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ============================
       [1] 댓글 답글 토글 기능
       ============================ */
    const COMMENT_SELECTOR = '.group\\/comment';
    const REPLY_WRAPPER_CONTAINER = 'div.relative.pl-4.py-1\\.5';

    // 댓글 엘리먼트에 토글 버튼 추가
    function addToggleButton(commentEl) {
        if (commentEl.querySelector('.reply-toggle-btn')) return;

        const btn = document.createElement('button');
        btn.textContent = '🔒';
        btn.className = 'reply-toggle-btn';
        Object.assign(btn.style, {
            marginLeft: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none'
        });

        btn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            const enabled = commentEl.dataset.replyEnabled === 'true';
            commentEl.dataset.replyEnabled = enabled ? 'false' : 'true';
            btn.textContent = enabled ? '🔒' : '🔓';
        });

        commentEl.appendChild(btn);
    }

    // 댓글 클릭 차단 (답글 비활성 상태일 때)
    function disableClick(commentEl) {
        commentEl.addEventListener('click', e => {
            if (commentEl.dataset.replyEnabled !== 'true' && !e.target.closest('button')) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }

    // 우클릭 시 답글 활성/비활성 토글
    function toggleOnContextmenu(commentEl) {
        commentEl.addEventListener('contextmenu', e => {
            e.preventDefault();
            e.stopPropagation();
            const enabled = commentEl.dataset.replyEnabled === 'true';
            commentEl.dataset.replyEnabled = enabled ? 'false' : 'true';
        });
    }

    // 대댓글창 “취소” 버튼 연결 (보이는 wrapper 닫기)
    function bindCancelButton(commentEl) {
        const parentContainer = commentEl.closest(REPLY_WRAPPER_CONTAINER);
        if (!parentContainer) return;

        const wrapper = parentContainer.nextElementSibling;
        if (!wrapper || !wrapper.querySelector('#comment_write')) return;

        wrapper.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.trim() === '취소') {
                btn.addEventListener('click', ev => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    wrapper.style.display = 'none';
                });
            }
        });
    }

    // 댓글 엘리먼트에 패치 적용
    function patchComment(commentEl) {
        if (commentEl.dataset.replyPatched === 'true') return;

        commentEl.dataset.replyPatched = 'true';
        disableClick(commentEl);
        addToggleButton(commentEl);
        toggleOnContextmenu(commentEl);
        bindCancelButton(commentEl);
    }

    // 페이지 내 모든 댓글에 패치 적용
    function patchAllComments() {
        document.querySelectorAll(COMMENT_SELECTOR).forEach(patchComment);
    }

    // 댓글 추가/삭제 시 재실행
    const commentObserver = new MutationObserver(patchAllComments);
    commentObserver.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchAllComments);
    } else {
        patchAllComments();
    }


    /* ============================
       [2] 환영 메시지 토글 복원
       ============================ */
    const MAXH_CLASSES = '.overflow-hidden.max-h-32.md\\:max-h-none';
    const HIDE_BTN_CLASSES = 'button.md\\:hidden';

    function fixToggle() {
        document.querySelectorAll(MAXH_CLASSES)
            .forEach(el => el.classList.remove('md:max-h-none'));
        document.querySelectorAll(HIDE_BTN_CLASSES)
            .forEach(btn => btn.classList.remove('md:hidden'));
    }

    fixToggle();
    const toggleObserver = new MutationObserver(fixToggle);
    toggleObserver.observe(document.documentElement, { childList: true, subtree: true });

        /* ============================
       [3] 댓글 자동 확장
       ============================ */

      function clickAllExpandButtons() {
        const expandButtons = document.querySelectorAll('button');
        let clickedAny = false;

        expandButtons.forEach(button => {
            const text = button.textContent.trim();
            if (/^\d+개의 댓글$/.test(text) && button.offsetParent !== null) {
                button.click();
                clickedAny = true;
            }
        });

        if (clickedAny) {
            setTimeout(clickAllExpandButtons, 500);
        }
    }

      function updateGlobalStyles() {
        const css = `
            .comment-wrapper,
            .comment-wrapper .overflow-x-auto,
            .comment-wrapper .overflow-hidden,
            .thread-body-content .overflow-hidden {
                overflow: visible !important;
                max-height: none !important;
            }
        `;
        let styleEl = document.getElementById('kone-comment-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'kone-comment-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;
    }

      function initScript() {
        clickAllExpandButtons();
        updateGlobalStyles();

        // DOM 변화 감지 시 댓글 확장 재실행 및 스타일 재적용
        const observer = new MutationObserver(() => {
            clickAllExpandButtons();
            updateGlobalStyles();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        // 히스토리 API 변경(페이지 이동) 감지
        let lastUrl = location.href;
        const onUrlChange = () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                clickAllExpandButtons();
                updateGlobalStyles();
            }
        };
        // pushState/replaceState 훅
        const push = history.pushState;
        history.pushState = function () {
            push.apply(this, arguments);
            onUrlChange();
        };
        window.addEventListener('popstate', onUrlChange);
    }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

  /* ============================
       [4] 실제 게시물로 가기 버튼
       ============================ */

    // 페이지 로드 시 URL 해시 체크하여 댓글 버튼 클릭
    console.log('[코네 유틸] 스크립트 로드됨, URL:', window.location.href);

    if (window.location.hash === '#auto-comment') {
        console.log('[코네 유틸] #auto-comment 감지, 댓글 버튼 클릭 시도');

        // 해시 제거
        history.replaceState(null, '', window.location.pathname + window.location.search);

        // 댓글 버튼 찾아서 클릭
        const findAndClickCommentBtn = () => {
            console.log('[코네 유틸] 댓글 버튼 찾는 중...');

            const buttons = document.querySelectorAll('button.cursor-pointer');
            console.log('[코네 유틸] 찾은 버튼 개수:', buttons.length);

            for (const btn of buttons) {
                const div = btn.querySelector('.flex.pointer-events-auto.size-10');
                if (div) {
                    const svg = div.querySelector('.lucide-message-circle');
                    if (svg) {
                        console.log('[코네 유틸] 댓글 버튼 발견! 클릭 시도');
                        btn.click();
                        console.log('[코네 유틸] 댓글 버튼 클릭 완료');
                        return true;
                    }
                }
            }

            console.log('[코네 유틸] 댓글 버튼을 찾지 못함');
            return false;
        };

        // 여러 번 시도
        setTimeout(() => {
            console.log('[코네 유틸] 1초 후 첫 시도');
            if (!findAndClickCommentBtn()) {
                setTimeout(() => {
                    console.log('[코네 유틸] 2초 후 재시도');
                    if (!findAndClickCommentBtn()) {
                        setTimeout(() => {
                            console.log('[코네 유틸] 3초 후 마지막 시도');
                            findAndClickCommentBtn();
                        }, 1000);
                    }
                }, 1000);
            }
        }, 1000);
    }

    function addRealPostButton() {
        // URL에서 실제 주소 추출
        const url = window.location.href;
        const match = url.match(/oh=([^&]+)/);
        if (!match) return;

        const realBoard = match[1];
        const pathMatch = url.match(/\/s\/all\/([^?]+)/);
        if (!pathMatch) return;

        const postId = pathMatch[1];
        const realUrl = `https://kone.gg/s/${realBoard}/${postId}?p=1#auto-comment`;

        // 1) 댓글 헤더에 버튼 추가
        const header = document.querySelector('.p-4.md\\:px-6.flex.justify-between.items-center');
        if (header && !header.querySelector('.real-post-btn')) {
            const btn = document.createElement('button');
            btn.textContent = '댓글 쓰러 가기';
            btn.className = 'real-post-btn border-0 justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none hover:bg-accent dark:hover:bg-accent/50 h-8 px-3 rounded-full flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer';

            btn.addEventListener('click', () => {
                console.log('[코네 유틸] 버튼 클릭됨, 이동:', realUrl);
                window.location.href = realUrl;
            });

            // 오른쪽 끝에 버튼 추가
            header.appendChild(btn);
        }

        // 페이지 로드 후 댓글 버튼 클릭
        if (sessionStorage.getItem('clickCommentButton') === 'true') {
            sessionStorage.removeItem('clickCommentButton');
            console.log('[코네 유틸] 댓글 버튼 클릭 시도 시작');

            // 댓글 버튼 찾아서 클릭
            const findAndClickCommentBtn = () => {
                console.log('[코네 유틸] 댓글 버튼 찾는 중...');

                // 방법 1: button > div 구조로 찾기
                const buttons = document.querySelectorAll('button.cursor-pointer');
                for (const btn of buttons) {
                    const div = btn.querySelector('.flex.pointer-events-auto.size-10');
                    if (div) {
                        const svg = div.querySelector('.lucide-message-circle');
                        if (svg) {
                            console.log('[코네 유틸] 댓글 버튼 발견! 클릭 시도');
                            btn.click();
                            console.log('[코네 유틸] 댓글 버튼 클릭 완료');
                            return true;
                        }
                    }
                }

                console.log('[코네 유틸] 댓글 버튼을 찾지 못함');
                return false;
            };

            // 1초 후 시도
            setTimeout(() => {
                console.log('[코네 유틸] 1초 대기 후 첫 시도');
                if (!findAndClickCommentBtn()) {
                    // 실패시 2초 후 재시도
                    setTimeout(() => {
                        console.log('[코네 유틸] 2초 후 재시도');
                        if (!findAndClickCommentBtn()) {
                            // 한번 더 3초 후 시도
                            setTimeout(() => {
                                console.log('[코네 유틸] 3초 후 마지막 시도');
                                findAndClickCommentBtn();
                            }, 1000);
                        }
                    }, 1000);
                }
            }, 1000);
        }

        // 2) 서브로 가기 요소를 반으로 나누기
        const subLink = document.querySelector('.mx-3.py-1\\.5.pl-1\\.5.text-sm.underline');
        if (subLink && !subLink.dataset.realPostPatched) {
            subLink.dataset.realPostPatched = 'true';

            const anchor = subLink.querySelector('a');
            if (!anchor) return;

            // 원래 링크 클릭 막기
            anchor.style.pointerEvents = 'none';
            anchor.style.display = 'flex';
            anchor.style.width = '100%';

            // 왼쪽 절반 (서브로 가기)
            const leftHalf = document.createElement('div');
            leftHalf.style.width = '50%';
            leftHalf.style.cursor = 'pointer';
            leftHalf.style.display = 'flex';
            leftHalf.style.alignItems = 'center';
            leftHalf.innerHTML = anchor.innerHTML;

            leftHalf.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = anchor.href;
            });

            // 오른쪽 절반 (실제 게시물로 가기)
            const rightHalf = document.createElement('div');
            rightHalf.style.width = '50%';
            rightHalf.style.cursor = 'pointer';
            rightHalf.style.display = 'flex';
            rightHalf.style.alignItems = 'center';
            rightHalf.style.justifyContent = 'flex-end';
            rightHalf.style.paddingRight = '8px';
            rightHalf.textContent = '→ 실제 게시물';
            rightHalf.style.color = 'inherit';

            rightHalf.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = realUrl + '#auto-comment';
            });

            // 기존 내용 제거하고 새로 추가
            anchor.innerHTML = '';
            anchor.appendChild(leftHalf);
            anchor.appendChild(rightHalf);
            anchor.style.pointerEvents = 'auto';
        }
    }

    // 페이지 로드 시 버튼 추가
    function initRealPostButton() {
        addRealPostButton();

        // URL 변경 감지
        let lastUrl = location.href;
        const checkUrlChange = () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(addRealPostButton, 300);
            }
        };

        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(this, arguments);
            checkUrlChange();
        };
        window.addEventListener('popstate', checkUrlChange);

        // DOM 변화 감지
        const observer = new MutationObserver(() => {
            addRealPostButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRealPostButton);
    } else {
        initRealPostButton();
    }

})();
