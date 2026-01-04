// ==UserScript==
// @name         치지직 외부 플레이어 자동 연결
// @namespace    http://tampermonkey.net/
// @version      BOOM
// @description  방송 카드를 클릭하면, PotPlayer와 채팅창을 실행합니다.
// @author       PassWatch
// @match        https://chzzk.naver.com/*
// @icon         https://chzzk.naver.com/
// @license MIT
// @grant        GM_xmlhttpRequest
// @connect      api.chzzk.naver.com
// @downloadURL https://update.greasyfork.org/scripts/552704/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%99%B8%EB%B6%80%20%ED%94%8C%EB%A0%88%EC%9D%B4%EC%96%B4%20%EC%9E%90%EB%8F%99%20%EC%97%B0%EA%B2%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552704/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%99%B8%EB%B6%80%20%ED%94%8C%EB%A0%88%EC%9D%B4%EC%96%B4%20%EC%9E%90%EB%8F%99%20%EC%97%B0%EA%B2%B0.meta.js
// ==/UserScript==
!function(){"use strict";document.addEventListener("click",(async e=>{const o=e.target.closest("a");if(!(o?.href.includes("/live/")&&o.closest('div[class*="video_card_container"]')))return;const t=o.pathname.match(/\/live\/([a-zA-Z0-9_-]+)/);if(!t)return;e.preventDefault(),e.stopPropagation();const n=t[1],a=window.open("about:blank","chzzk_chat_popup_window","width=450,height=700,scrollbars=yes,resizable=yes");try{const e=`https://api.chzzk.naver.com/service/v3.2/channels/${n}/live-detail`,o=await(r=e,new Promise(((e,o)=>{GM_xmlhttpRequest({method:"GET",url:r,onload:o=>e(o.responseText),onerror:e=>o(new Error("치지직 API에 연결할 수 없습니다."))})}))),t=JSON.parse(o),s=t?.content?.livePlaybackJson;if(!s)throw new Error(`방송 정보를 불러오는 데 실패했습니다: ${t?.message||"알 수 없는 오류"}`);const c=JSON.parse(s),l=c?.media?.find((e=>"lowLatency"===e.latency))||c?.media?.find((e=>"HLS"===e.mediaId)),i=l?.path;if(!i)throw new Error("방송 스트림 주소를 찾을 수 없습니다.");console.log(`스트림 주소 획득 성공! (타입: ${l.mediaId})`),function(e){console.log("PotPlayer로 스트림 주소를 전달합니다:",e);const o=document.createElement("iframe");o.style.display="none",o.src=`potplayer://${e}`,document.body.appendChild(o),setTimeout((()=>o.remove()),1e3)}(i),a&&!a.closed&&(a.location.href=`https://chzzk.naver.com/live/${n}/chat`)}catch(e){console.error("스크립트 처리 중 오류 발생:",e),alert(e.message),a&&!a.closed&&a.close()}var r}),!0),console.log("치지직 외부 플레이어 스크립트가 활성화되었습니다.")}();