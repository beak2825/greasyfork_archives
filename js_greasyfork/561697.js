// ==UserScript==
// @name         VFORKOREA링크열기(버튼)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a bottom button. On click
// @match        https://vforkorea.com/assem/*
// @match        https://vforkorea.com/assem/
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561697/VFORKOREA%EB%A7%81%ED%81%AC%EC%97%B4%EA%B8%B0%28%EB%B2%84%ED%8A%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561697/VFORKOREA%EB%A7%81%ED%81%AC%EC%97%B4%EA%B8%B0%28%EB%B2%84%ED%8A%BC%29.meta.js
// ==/UserScript==
const PAL_DONE_PREFIX = "PAL_DONE_";
const OpenedPalTabs = new Map(); // jobId -> tabObj(from GM_openInTab)

function NewJobId() {
  return "job_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

// 완료 신호 오면 닫기

function ListenDone(jobId) {
  const key = PAL_DONE_PREFIX + jobId;
  GM_addValueChangeListener(key, (k, oldV, newV, remote) => {
    if (!remote) return;      // 다른 탭에서 온 신호만
    if (newV !== true) return;

    const tab = OpenedPalTabs.get(jobId);
    if (tab && !tab.closed) {
      try { tab.close(); } catch {}
    }
    OpenedPalTabs.delete(jobId);
    // 신호 키 정리(선택)
    try { GM_setValue(key, null); } catch {}
  });
}

(function ()
{
	"use strict";

	const SELECTOR_TABLE_BODY = "#tbody";
	const SELECTOR_LINKS = "#tbody a.link3";

	const SELECTOR_LABEL = "td.count-td > label";
	const SELECTOR_CHECKBOX = "td.count-td input[type='checkbox']";

	// “테이블 로드 완료” 판정: DOM 변경이 이 시간만큼 멈추면 안정화로 봄
	const STABLE_MS = 300;

	const WAIT_TIMEOUT_MS = 10_000;

	const OPEN_IN_BACKGROUND = true;
	const MAX_TABS_PER_RUN = 80;

	const DELAY_AFTER_LABEL_CLICK_MS = 120;
	const DELAY_BETWEEN_ITEMS_MS = 140;

	let isRunning = false;
	let lastMutationAt = 0;

	function Sleep(ms)
	{
		return new Promise((r) => setTimeout(r, ms));
	}

	function NormalizeUrl(href)
	{
		try { return new URL(href, location.href).toString(); }
		catch { return null; }
	}

	function DispatchMouse(el, type)
	{
		el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
	}

	function ClickLikeUser(el)
	{
		if (!el) return;

		try
		{
			el.click();
			return;
		}
		catch
		{
			// ignore
		}

		try
		{
			DispatchMouse(el, "mousedown");
			DispatchMouse(el, "mouseup");
			DispatchMouse(el, "click");
		}
		catch (e)
		{
			console.warn("[VFORKOREA AutoOpen] ClickLikeUser failed:", e);
		}
	}

	function GetLinkElements()
	{
		return Array.from(document.querySelectorAll(SELECTOR_LINKS));
	}

	async function WaitUntilLinksAppear(timeoutMs)
	{
		const start = Date.now();
		while (Date.now() - start < timeoutMs)
		{
			const links = GetLinkElements();
			if (links.length > 0) return true;
			await Sleep(100);
		}
		return false;
	}

	async function WaitTableStable(maxWaitMs = 5_000)
	{
		// observer가 못 붙었을 때도 대비해서 "최대 maxWaitMs"만큼만 기다림
		const start = Date.now();

		// 마지막 변화가 없다면 즉시 통과
		if (lastMutationAt === 0)
		{
			return;
		}

		while (Date.now() - start < maxWaitMs)
		{
			const idle = Date.now() - lastMutationAt;
			if (idle >= STABLE_MS)
			{
				return;
			}
			await Sleep(50);
		}
	}

	async function ProcessVisibleLinksOnce()
	{
		if (isRunning)
		{
			console.warn("[VFORKOREA AutoOpen] 이미 실행 중이야. 중복 실행 방지.");
			return;
		}

		isRunning = true;

		try
		{
			// 테이블이 방금 갱신된 상태면 안정화까지 기다렸다가 실행
			await WaitTableStable();

			const ok = await WaitUntilLinksAppear(WAIT_TIMEOUT_MS);
			if (!ok)
			{
				console.warn("[VFORKOREA AutoOpen] link3가 시간 내에 안 떠서 중단:", SELECTOR_LINKS);
				return;
			}

			const links = GetLinkElements();
			console.log(`[VFORKOREA AutoOpen] 발견된 link3 개수: ${links.length}`);

			let opened = 0;

			for (let i = 0; i < links.length; i++)
			{
				if (opened >= MAX_TABS_PER_RUN)
				{
					console.warn("[VFORKOREA AutoOpen] MAX_TABS_PER_RUN 도달:", MAX_TABS_PER_RUN);
					break;
				}

				const link = links[i];
				const row = link.closest("tr");

				// 1) 체크박스 먼저
				if (row)
				{
					const checkbox = row.querySelector(SELECTOR_CHECKBOX);
					const label = row.querySelector(SELECTOR_LABEL);

					if (checkbox && label && checkbox.checked === false)
					{
						ClickLikeUser(label);
						await Sleep(DELAY_AFTER_LABEL_CLICK_MS);

						if (checkbox.checked === false)
						{
							ClickLikeUser(row);
							await Sleep(DELAY_AFTER_LABEL_CLICK_MS);
						}
					}
				}

				// 2) 링크 새 탭 오픈
				const href = link.getAttribute("href") || link.href;
				const url = NormalizeUrl(href);
                const isLast = (i === links.length - 1);

                if (url)
                {
                    const jobId = NewJobId();
                    const urlWithJob = url + "#palJob=" + encodeURIComponent(jobId);

                    // tab 객체 받기 (Tampermonkey 문서상 close/closed/onclose 제공) :contentReference[oaicite:2]{index=2}
                    const tabObj = GM_openInTab(urlWithJob, {
                        active: isLast,
                        insert: false,
                        setParent: true
                    });

                    OpenedPalTabs.set(jobId, tabObj);
                    ListenDone(jobId);

                    opened++;
                }
				else
				{
					ClickLikeUser(link);
					opened++;
				}

				await Sleep(DELAY_BETWEEN_ITEMS_MS);
			}

			console.log(`[VFORKOREA AutoOpen] 완료: ${links.length}개 중 ${opened}개 탭 오픈`);
		}
		finally
		{
			isRunning = false;
		}
	}

	function AttachTableObserver()
	{
		const tbody = document.querySelector(SELECTOR_TABLE_BODY);
		if (!tbody)
		{
			console.warn("[VFORKOREA AutoOpen] #tbody를 못 찾았어.");
			return;
		}

		const observer = new MutationObserver(() =>
		{
			lastMutationAt = Date.now();
		});

		observer.observe(tbody, { childList: true, subtree: true });
		console.log("[VFORKOREA AutoOpen] Observer attached:", SELECTOR_TABLE_BODY);
	}

	function CreateFloatingButton()
	{
		const btn = document.createElement("button");
		btn.type = "button";
		btn.textContent = "✅전체 열기";

		// 스타일(하단 고정)
		btn.style.position = "fixed";
		btn.style.right = "16px";
		btn.style.bottom = "16px";
		btn.style.zIndex = "999999";
		btn.style.padding = "10px 14px";
		btn.style.borderRadius = "12px";
		btn.style.border = "1px solid rgba(255,255,255,0.25)";
		btn.style.background = "rgba(20,20,20,0.9)";
		btn.style.color = "#fff";
		btn.style.cursor = "pointer";
		btn.style.fontSize = "14px";
		btn.style.boxShadow = "0 6px 16px rgba(0,0,0,0.35)";

		btn.addEventListener("click", async () =>
		{
			btn.disabled = true;
			const oldText = btn.textContent;
			btn.textContent = "⏳ 실행중...";

			try
			{
				await ProcessVisibleLinksOnce();
			}
			finally
			{
				btn.textContent = oldText;
				btn.disabled = false;
			}
		});

		document.body.appendChild(btn);
		console.log("[VFORKOREA AutoOpen] Floating button added.");
	}

	AttachTableObserver();
	CreateFloatingButton();
})();
