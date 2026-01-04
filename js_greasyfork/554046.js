// ==UserScript==
// @name         TR Height 초기화 및 Padding 수정 + OK 기준 숨기기 (패션·대기 자료실 전용)
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0.6
// @description  tr[height="128"] 초기화, #read_profile_td padding 수정, 댓글 숨기기, OK 수 기준 게시글 숨기기 (패션·pdswait 게시판, ㅇㅎ·ㅎㅂ 예외 처리)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554046/TR%20Height%20%EC%B4%88%EA%B8%B0%ED%99%94%20%EB%B0%8F%20Padding%20%EC%88%98%EC%A0%95%20%2B%20OK%20%EA%B8%B0%EC%A4%80%20%EC%88%A8%EA%B8%B0%EA%B8%B0%20%28%ED%8C%A8%EC%85%98%C2%B7%EB%8C%80%EA%B8%B0%20%EC%9E%90%EB%A3%8C%EC%8B%A4%20%EC%A0%84%EC%9A%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554046/TR%20Height%20%EC%B4%88%EA%B8%B0%ED%99%94%20%EB%B0%8F%20Padding%20%EC%88%98%EC%A0%95%20%2B%20OK%20%EA%B8%B0%EC%A4%80%20%EC%88%A8%EA%B8%B0%EA%B8%B0%20%28%ED%8C%A8%EC%85%98%C2%B7%EB%8C%80%EA%B8%B0%20%EC%9E%90%EB%A3%8C%EC%8B%A4%20%EC%A0%84%EC%9A%A9%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 스타일 수정
  const style = document.createElement('style');
  style.textContent = `
    tr[height="128"] { height: initial !important; }
    #read_profile_td { padding-bottom: 10px !important; }
  `;
  document.head.appendChild(style);

  // 댓글 숨기기 로직
  document.querySelectorAll('li[id^="comment_li_"]').forEach(li => {
    const ok = li.querySelector('.ok .r');
    const notok = li.querySelector('.notok');
    if (!ok || !notok) return;

    const okVal = parseInt(ok.textContent.trim(), 10) || 0;
    const notokVal = parseInt(notok.textContent.replace(/\D/g, ''), 10) || 0;

    if (okVal === 0 && notokVal === 0) {
      li.style.display = 'none';
    }
  });

  // OK 수 기준 게시글 숨기기
  const href = location.href;

  let threshold = null;
  let isPdsWait = false;

  if (href.includes('https://m.humoruniv.com/board/list.html?table=fashion')) {
    threshold = 20;
  } else if (href.includes('https://m.humoruniv.com/board/list.html?table=pdswait')) {
    threshold = 10;
    isPdsWait = true;
  }

  if (threshold !== null) {
    document.querySelectorAll('.list_body_href').forEach(link => {
      const okNumEl = link.querySelector('.ok_num');
      if (!okNumEl) return;

      const num = Number(okNumEl.textContent.trim().replace(/[^0-9]/g, ''));

      // 제목 텍스트 확인
      const titleEl = link.querySelector('.link_hover');
      const titleText = titleEl?.textContent || '';

      // pdswait 게시판에서는 "ㅇㅎ" 또는 "ㅎㅂ" 포함 시 무조건 표시
      if (isPdsWait && (titleText.includes('ㅇㅎ') || titleText.includes('ㅎㅂ'))) {
        return;
      }

      if (num <= threshold) link.style.display = 'none';
    });
  }
})();
