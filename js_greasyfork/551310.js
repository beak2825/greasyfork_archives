// ==UserScript==
// @name         라운지퀘스트
// @namespace    라운지퀘스트
// @version      1.0.0
// @description  좋아요 5개 순차 클릭 + '태그 추천' 영역 언팔→팔로우 3개, 닫기 자동 처리
// @match        https://lounge.onstove.com/feed/*?questMode=on*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551310/%EB%9D%BC%EC%9A%B4%EC%A7%80%ED%80%98%EC%8A%A4%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/551310/%EB%9D%BC%EC%9A%B4%EC%A7%80%ED%80%98%EC%8A%A4%ED%8A%B8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const $ = jQuery;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    async function waitFor(getter, { timeout = 5000, interval = 100 } = {}) {
        const start = Date.now();
        let el;
        while (Date.now() - start < timeout) {
            el = getter();
            if (el) return el;
            await sleep(interval);
        }
        return null;
    }
    // 특정 조건이 만족될 때까지 대기
    async function waitForCondition(checkFn, { timeout = 15000, interval = 200 } = {}) {
        const start = Date.now();
        while (true) {
            try {
                const ok = await checkFn();
                if (ok) return true;
            } catch {}
            if (Date.now() - start > timeout) return false;
            await sleep(interval);
        }
    }

    // "닫기" 버튼 감지 시 자동 클릭
    function autoClose() {
        const observer = new MutationObserver(() => {
            const $closeBtn = $("button:contains('닫기')");
            if ($closeBtn.length) {
                console.log("[닫기] 버튼 발견 → 클릭");
                $closeBtn.first().click();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function typeText(el, text, interval = 200) {
        return new Promise(async (resolve) => {
            el.focus();
            for (const ch of text) {
                // 글자를 이어붙임
                el.innerText += ch;

                // 입력 이벤트 강제 발생 (프레임워크가 반응하도록)
                el.dispatchEvent(new InputEvent("input", { bubbles: true, data: ch }));
                el.dispatchEvent(new KeyboardEvent("keydown", { key: ch, bubbles: true }));
                el.dispatchEvent(new KeyboardEvent("keypress", { key: ch, bubbles: true }));
                el.dispatchEvent(new KeyboardEvent("keyup", { key: ch, bubbles: true }));

                await new Promise(r => setTimeout(r, interval));
            }
            resolve();
        });
    }

    // 좋아요 버튼 5개를 1초 간격으로 실제로 기다리며 클릭 (await 가능)
    async function clickLikes(maxCount = 5) {
        // 좋아요 버튼이 충분히 나타날 때까지 기다림 (없으면 있는 만큼 처리)
        await waitForCondition(() => $("button.sc-button.sc-feed-detail-like-button").length > 0, { timeout: 10000 });

        const buttons = Array.from(document.querySelectorAll("button.sc-button.sc-feed-detail-like-button"));
        const count = Math.min(maxCount, buttons.length);
        console.log("[좋아요] 발견:", buttons.length, "→ 클릭할 개수:", count);

        for (let i = 0; i < count; i++) {
            try {
                buttons[i].click();
                console.log(`[좋아요] 클릭 ${i + 1}/${count}`, buttons[i]);
            } catch (e) {
                console.warn("[좋아요] 클릭 실패:", e);
            }
            await sleep(1000);
        }
        console.log("[좋아요] 완료");
    }


    // 댓글 좋아요 버튼 5개를 1초 간격으로 실제로 기다리며 클릭 (await 가능)
    async function commentClickLikes(maxCount = 5) {
        // 댓글 좋아요 버튼이 충분히 나타날 때까지 기다림 (없으면 있는 만큼 처리)
        await waitForCondition(() => $("button.sc-button.sc-feed-comment-like-button").length > 0, { timeout: 10000 });

        const buttons = Array.from(document.querySelectorAll("button.sc-feed-comment-like-button"));
        const count = Math.min(maxCount, buttons.length);
        console.log("[댓글 좋아요] 발견:", buttons.length, "→ 클릭할 개수:", count);

        for (let i = 0; i < count; i++) {
            try {
                buttons[i].click();
                console.log(`[댓글 좋아요] 클릭 ${i + 1}/${count}`, buttons[i]);
            } catch (e) {
                console.warn("[댓글 좋아요] 클릭 실패:", e);
            }
            await sleep(1000);
        }
        console.log("[댓글 좋아요] 완료");
    }


    // "태그 추천" 섹션의 body 영역 반환
    function getTagRecommendBody() {
        const $header = $("div.sc-profiles-header:contains('태그 추천')").first();
        if (!$header.length) return null;
        const $profiles = $header.closest("div.sc-profiles");
        return $profiles.find("div.sc-profiles-body").first();
    }

    // 태그 추천 영역: 팔로잉 해제 후 팔로우 3개
    async function runFollowWorkflow() {

        // 섹션이 붙을 때까지 대기
        const ok = await waitForCondition(() => !!getTagRecommendBody(), { timeout: 12000, interval: 300 });
        if (!ok) {
            console.warn("[Follow] '태그 추천' 섹션을 찾지 못함");
            return;
        }

        const $body = getTagRecommendBody();
        if (!$body || !$body.length) return;

        // 1) 팔로잉 해제 (체크 아이콘 기준)
        const $followingIcons = $body.find("i.ic-v2-control-check-line");
        for (let i = 0; i < $followingIcons.length; i++) {
            const btn = $followingIcons.eq(i).closest("button")[0];
            if (btn) {
                btn.click();
                console.log("[Follow] 언팔로우:", btn);
                await sleep(800);
            }
        }

        // 2) 팔로우 3개 (플러스 아이콘 기준)
        const $followIcons = $body.find("i.ic-v2-control-add-line");
        const toClick = Math.min(3, $followIcons.length);
        for (let i = 0; i < toClick; i++) {
            const btn = $followIcons.eq(i).closest("button")[0];
            if (btn) {
                btn.click();
                console.log(`[Follow] 팔로우 ${i + 1}/${toClick}`, btn);
                await sleep(800);
            }
        }

        console.log("[Follow] 태그 추천 처리 완료");
    }
    async function commentOnFeeds(maxCount = 3) {
        const items0 = Array.from(document.querySelectorAll(".sc-feeds-list-item"))
        .filter(it => it.querySelector(".sc-feed-comment-editor"));

        let done = 0;

        for (const item0 of items0) {
            if (done >= maxCount) break;

            try {
                const feedId = item0.getAttribute("id");
                if (!feedId) continue;

                const formBtn = item0.querySelector("button.sc-feed-comment-editor-form-button");
                if (!formBtn) continue;

                // 1) 댓글 폼 열기
                formBtn.click();

                // 2) 최신 editor 다시 찾기
                const item = await waitFor(() => document.getElementById(feedId), { timeout: 6000 });
                if (!item) continue;

                const editor = await waitFor(() =>
                                             item.querySelector(".sc-feed-comment-editor:not(.is-collapsed)"),
                                             { timeout: 6000 }
                                            );
                if (!editor) continue;

                // 3) contenteditable 에디터 찾기
                const editable = await waitFor(() =>
                                               editor.querySelector('.fr-wrapper .fr-element.fr-view[contenteditable="true"]'),
                                               { timeout: 6000 }
                                              );
                if (!editable) continue;

                // 4) "ㅊㅊ" 입력
                await typeText(editable, "ㅊㅊ", 120);

                // 5) 등록 버튼 찾아서 클릭
                const submitBtn = editor.querySelector("button.sc-feed-comment-editor-submit-button");
                if (submitBtn) {
                    submitBtn.click();
                    console.log(`[댓글] 등록 버튼 클릭 완료 (${done + 1}/${maxCount})`);
                } else {
                    console.warn("[댓글] 등록 버튼 없음:", editor);
                }

                done++;
                if ( done < maxCount){
                    await sleep(10000);
                };
            } catch (e) {
                console.error("[댓글] 처리 중 오류:", e);
            }
        }

        console.log("[댓글] 최종 완료:", done, "개");
    }

    async function listPageMove() {

        const profileEl = document.querySelector("div.sc-profile[userid]");
        if (!profileEl) {
            console.warn("userid 속성을 가진 sc-profile 요소를 찾을 수 없습니다.");
            return;
        }

        // userid 값 추출
        const userId = profileEl.getAttribute("userid");
        console.log("찾은 userid:", userId);

        // 이동할 URL 생성
        const targetUrl = `https://profile.onstove.com/ko/${userId}?quest=open`;

        // 새 탭에서 열기
        window.open(targetUrl, "_self");

    }



    // 실행 시퀀스
    setTimeout(async () => {
        autoClose();
        //좋아요
        await clickLikes(5);
        //댓글 좋아요
        await commentClickLikes(5);
        //태그 플로우
        await runFollowWorkflow();
        //댓글 달기
        await commentOnFeeds(3);
        //퀘스트 페이지 이동
        await listPageMove();
        //퀘스트 보상 수락
    }, 4000);
})();