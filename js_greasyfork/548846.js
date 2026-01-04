// ==UserScript==
// @name         SOOP 투표+추첨 패널 — 채팅수집 안정화(재파싱)
// @namespace    https://www.sooplive.co.kr/
// @version      2025-09-08.r25
// @description  버그 수정 9.8 (UI변경 대응/렉 완화)
// @match        https://play.sooplive.co.kr/*
// @match        https://www.sooplive.co.kr/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548846/SOOP%20%ED%88%AC%ED%91%9C%2B%EC%B6%94%EC%B2%A8%20%ED%8C%A8%EB%84%90%20%E2%80%94%20%EC%B1%84%ED%8C%85%EC%88%98%EC%A7%91%20%EC%95%88%EC%A0%95%ED%99%94%28%EC%9E%AC%ED%8C%8C%EC%8B%B1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548846/SOOP%20%ED%88%AC%ED%91%9C%2B%EC%B6%94%EC%B2%A8%20%ED%8C%A8%EB%84%90%20%E2%80%94%20%EC%B1%84%ED%8C%85%EC%88%98%EC%A7%91%20%EC%95%88%EC%A0%95%ED%99%94%28%EC%9E%AC%ED%8C%8C%EC%8B%B1%29.meta.js
// ==/UserScript==
(function () {
  'use strict';

  /* ========= 기본 유틸 ========= */
  const DEFAULT_MAX = 6, MIN_LIMIT = 2, MAX_LIMIT = 99;
  const K_MAX = 'sv_maxChoice', K_POS = 'sv_panel_pos', K_SIZE = 'sv_panel_size';
  const K_NOTES = 'sv_notes_v1', K_OUT = 'sv_raffle_out_v1';
  const K_PRIV = 'sv_privacy_v1';
  const VOTE_RE = /^!\s*투표\s*([0-9]{1,2})(?:\b|$)/i;
  const CANCEL_RE = /^!\s*투표\s*(?:0|취소|cancel)(?:\b|$)/i;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, Number(n) || 0));
  const txt = (el) => (el?.textContent || el?.innerText || '').replace(/\s+/g, ' ').trim();
  const esc = (s) => (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
  const loadJSON = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch { return d; } };
  const saveInt = (k, v) => { try { localStorage.setItem(k, String(v)); } catch { } };
  const loadInt = (k, d) => { try { const s = localStorage.getItem(k); return s == null ? d : parseInt(s, 10); } catch { return d; } };
  const toast = (m) => {
    const t = document.createElement('div'); t.textContent = m;
    Object.assign(t.style, { position: 'fixed', right: '16px', bottom: '110px', background: '#171a1d', color: '#eee', border: '1px solid #2f343b', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', zIndex: 2147483647 });
    document.body.appendChild(t); setTimeout(() => t.remove(), 1500);
  };

  /* ========= 생방 제약(렉 완화: 패널 열렸을 때만 체크) ========= */
  let liveAllowed = false;
  let liveTimer = null;

  const isLiveNow = () => {
    // ✅ 전체 DOM 무식하게 훑는 방식은 렉 유발 => 후보 셀렉터를 좁힘
    const SEL = [
      '.pill', '.badge', '.live', '.onair', '.on-air',
      '[class*="live"]', '[class*="LIVE"]', '[class*="onair"]', '[class*="OnAir"]',
      '[class*="broadcast"]', '[class*="stream"]',
      'button[aria-label]', '[role="button"][aria-label]'
    ].join(',');

    const nodes = document.querySelectorAll(SEL);
    let seen = 0;
    for (const el of nodes) {
      const t = txt(el);
      if (!t) continue;
      if (/(생방송|LIVE)/i.test(t)) return true;
      if (/(대기\s*중|대기중)/.test(t)) return false;
      if (++seen > 450) break; // 상한
    }
    return false;
  };

  const updateLiveGate = () => {
    const prev = liveAllowed;
    liveAllowed = isLiveNow();
    if (prev !== liveAllowed) updateVoteStartButton();
  };

  const startLiveTimer = () => {
    if (liveTimer) return;
    updateLiveGate();
    liveTimer = setInterval(updateLiveGate, 3000); // ✅ 1.2s → 3s, 그리고 패널 열림 상태에서만
  };

  const stopLiveTimer = () => {
    if (!liveTimer) return;
    clearInterval(liveTimer);
    liveTimer = null;
  };

  /* ========= 상태 ========= */
  let maxChoice = loadInt(K_MAX, DEFAULT_MAX);
  let voteCollecting = false, raffleLogging = false, raffleAccepting = true;

  const votes = new Map(), voteTS = new Map(), voterLabel = new Map();
  const participants = new Map(), idToNick = new Map();
  const lastMsgByUser = new Map(), lastAppended = new Map();
  let pickedId = null;
  const outSet = new Set(loadJSON(K_OUT, []));
  let privacyOn = loadInt(K_PRIV, 0) === 1;

  /* ========= 닉 정화 ========= */
  const EMOJI_RE = /[\p{Extended_Pictographic}\uFE0F\u200D]/gu;
  const BADGE_SEL = [
    '.badge', '.subscription', '.member', '.vip', '.level',
    '[aria-label*="구독"]', '[aria-label*="개월"]', '[aria-label*="열혈"]', '[aria-label*="팬"]',
    '[class*="badge"]', '[class*="sub"]', '[class*="vip"]', '[class*="fan"]', '[class*="tier"]', '[class*="Tier"]',
    'img[alt*="구독"]', 'img[alt*="개월"]', 'img[alt*="열혈"]', 'img[alt*="팬"]',
    '[tiernickname]', '[data-tiernickname]', '[data-tier]', '[tier-name]', '[data-tier-name]',
    '[title*="구독"]', '[title*="티어"]', '.grade-badge-fan', '[class*="grade-badge"]'
  ].join(',');

  const stripSubText = (s) => (s || '')
    .replace(/(?:누적|연속)?\s*\d+\s*개월(?:\s*연속)?/gi, '')
    .replace(/(?:연속\s*)?구독(?:중|자|권|이름|선물|[\w가-힣]*)?/gi, '')
    .replace(/열혈|서포터|팬클럽|팬|스트리머|방송인|관리자|매니저|VIP|프라임|멤버십|배지|티어/gi, '')
    .replace(/[|•·]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const pureAuthorText = (el) => {
    if (!el) return '';
    const c = el.cloneNode(true);
    c.querySelectorAll(BADGE_SEL).forEach(e => e.remove());
    return txt(c);
  };

  /* ========= 패널 ========= */
  const panel = document.createElement('div'); panel.id = 'sv_panel'; panel.style.display = 'none';
  panel.innerHTML = `
    <div class="sv-header" title="Alt+드래그 — 이동">
      <span class="sv-title">투표·추첨 패널</span>
      <span id="sv_vchip" class="sv-chip sv-idle">투표 대기</span>
      <span id="sv_rchip" class="sv-chip sv-idle">추첨 대기</span>
      <div class="sv-gap"></div>
      <div class="sv-maxwrap" id="sv_maxwrap">
        <label class="sv-label">최대</label>
        <input id="sv_max" type="text" maxlength="2" inputmode="numeric" value="${loadInt(K_MAX, DEFAULT_MAX)}">
        <button id="sv_apply">적용</button>
      </div>
      <button id="sv_min" title="접기">—</button>
      <button id="sv_close" title="닫기">×</button>
    </div>

    <div class="sv-tabs">
      <button class="sv-tab sv-active" data-tab="vote">투표</button>
      <button class="sv-tab" data-tab="raffle">추첨</button>
    </div>

    <div class="sv-body sv-body-vote">
      <div id="sv_cards" class="sv-grid"></div>
      <div class="sv-foot">
        <button id="sv_vstart" class="sv-primary">시작</button>
        <button id="sv_vend" class="sv-danger" disabled>종료</button>
        <button id="sv_vreset">초기화</button>
        <button id="sv_view" disabled>투표 인원 보기</button>
        <span class="sv-hint">채팅: !투표1~99 / 취소: !투표0 또는 !투표 취소</span>
      </div>
    </div>

    <div class="sv-body sv-body-raffle" style="display:none">
      <div class="sv-raffle">
        <div class="sv-people">
          <div class="sv-people-head">참여 인원 <span id="sv_people_count">(0)</span></div>
          <ul id="sv_people_list"></ul>
          <div class="sv-people-foot">
            <button id="sv_rstart" class="sv-primary">추첨 시작</button>
            <button id="sv_rend" class="sv-pill pill-danger">추첨 종료</button>
            <button id="sv_draw">랜덤</button>
            <button id="sv_raffle_clear">초기화</button>
          </div>
        </div>
        <div class="sv-logs">
          <div class="sv-logs-head">
            <span>선택: <span id="sv_selected_text">-</span></span>
            <div class="sv-gap"></div>
            <button id="sv_go" class="sv-ghost" disabled>방송국 이동</button>
            <button id="sv_chat_end" class="sv-pill pill-warn" disabled>대화 종료</button>
          </div>
          <div id="sv_chat_log" class="sv-chatbox"></div>
        </div>
      </div>
    </div>

    <div id="sv_modal" class="sv-modal-root" hidden>
      <div class="sv-modal-backdrop"></div>
      <div class="sv-modal">
        <div class="sv-modal-head">
          <div class="sv-modal-title">투표 인원 보기</div>
          <div class="sv-gap"></div>
          <button id="sv_privacy_toggle" class="sv-ghost">비공개</button>
          <button id="sv_modal_close">×</button>
        </div>
        <div class="sv-modal-body"><div id="sv_modal_content"></div></div>
        <div class="sv-modal-foot"><button id="sv_modal_close2" class="sv-cta">닫기</button></div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  /* ========= 스타일 ========= */
  GM_addStyle(`
    #sv_panel{ position:fixed; right:12px; bottom:12px; width:720px; height:520px;
      background:#16181c; color:#ddd; border:1px solid #2c2f36; border-radius:12px; box-shadow:0 14px 34px rgba(0,0,0,.35);
      z-index:2147483600; resize: both; overflow:hidden; min-width:530px; min-height:300px;
      max-height: calc(100vh - 24px) !important; max-width: calc(100vw - 24px) !important; }
    #sv_panel *{ box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Noto Sans KR','Malgun Gothic',sans-serif; }
    .sv-header{ display:flex; align-items:center; gap:8px; padding:6px 8px; border-bottom:1px solid #2c2f36; background:#1e2126; border-radius:12px 12px 0 0;}
    .sv-title{ font-weight:700; color:#f0f0f0; font-size:13px;}
    .sv-gap{ flex:1 1 auto; }
    .sv-label{ font-size:11px; color:#c9d0da;}
    .sv-maxwrap{ display:flex; align-items:center; gap:6px; }
    #sv_max{ width:32px; height:26px; padding:2px 4px; text-align:center; font-size:12px; border:1px solid #3a3f47; border-radius:8px; background:#1e2126; color:#e5e5e5;}
    .sv-header button{ border:1px solid #3a3f47; background:#23262b; color:#e0e0e0; border-radius:8px; padding:3px 7px; height:26px; font-size:12px;}
    .sv-tabs{ display:flex; gap:6px; padding:6px 8px; border-bottom:1px solid #2c2f36; background:#1c1f24;}
    .sv-tab{ border:1px solid #3a3f47; background:#23262b; color:#f0f0f0; border-radius:8px; padding:5px 10px; font-size:12px;}
    .sv-tab.sv-active{ background:#2c323a;}
    .sv-chip{ padding:2px 8px; border-radius:999px; font-size:11px; line-height:18px; border:1px solid;}
    .sv-idle{ color:#cfd5dd; border-color:#3a3f47; background:#23262b;}
    .sv-run { color:#d6f8df; border-color:#2f6a43; background:#1e3a2a;}
    .sv-end { color:#f8d6d6; border-color:#6a2f2f; background:#3a1f1f;}
    .sv-body{ flex:1 1 auto; min-height:0; overflow:hidden; padding:8px; }
    .sv-raffle{ display:flex; gap:8px; min-height:0; height:100%; }
    .sv-people,.sv-logs{ display:flex; flex-direction:column; min-height:0; }
    .sv-people{ flex:0 0 340px; min-width:260px; border:1px solid #2f343b; border-radius:10px; background:#1b1e23; }
    .sv-people-head{ font-weight:700; padding:8px 10px; border-bottom:1px solid #2b3036;}
    #sv_people_list{ list-style:none; margin:0; padding:6px; flex:1 1 auto; overflow:auto; }
    #sv_people_list li{ display:grid; grid-template-columns:1fr auto; align-items:center; gap:8px; padding:6px; margin:4px 0; border-radius:8px; background:#171a1f; color:#e6e6e6;}
    #sv_people_list li .sv-li-main{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
    #sv_people_list li .sv-ban{ display:flex; align-items:center; gap:4px; font-size:11px; opacity:.9;}
    #sv_people_list li .sv-ban input{ width:14px; height:14px; }
    #sv_people_list li.sv-selected{ outline:1px solid #3b4a6a; background:#1e2430;}
    #sv_people_list li.sv-out{ text-decoration:line-through; opacity:.75; color:#a9a9a9;}
    .sv-people-foot{ position:sticky; bottom:0; display:flex; flex-wrap:wrap; gap:6px; padding:8px; border-top:1px solid #2b3036; background:rgba(27,30,35,.98); }
    .sv-logs{ flex:1 1 auto; min-width:0; border:1px solid #2f343b; border-radius:10px; background:#1b1e23; }
    .sv-logs-head{ display:flex; align-items:center; gap:8px; padding:8px 10px; border-bottom:1px solid #2b3036; color:#f0f0f0; position:sticky; top:0; background:rgba(27,30,35,.98); z-index:1;}
    .sv-chatbox{ flex:1 1 auto; min-height:0; padding:8px 10px; overflow:auto; color:#e6e6e6; display:flex; flex-direction:column; align-items:stretch; gap:8px; }
    .sv-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:8px;}
    .sv-card{ border:1px solid #2f343b; border-radius:10px; padding:6px; background:#1b1e23; display:flex; flex-direction:column; gap:6px; min-height:0;}
    .sv-card h3{ margin:0; font-size:13px; color:#f0f0f0;}
    .sv-note{ width:100%; height:22px; border:1px solid #3a3f47; background:#15171b; color:#e6e6e6; border-radius:7px; padding:2px 6px; font-size:12px;}
    .sv-count{ font-weight:800; font-size:18px; color:#e8e8e8;}
    .sv-list{ display:none !important; }
    .sv-foot{ display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-top:6px;}
    .sv-foot button, .sv-people-foot button, .sv-logs-head button{ border:1px solid #3a3f47; background:#23262b; color:#f0f0f0; border-radius:8px; padding:5px 9px; height:28px; font-size:12px; }
    .sv-foot .sv-primary, .sv-people-foot .sv-primary{ border-color:#3b4a6a; background:#243149; color:#e0e8ff;}
    .sv-foot .sv-danger{ border-color:#584041; background:#302022; color:#f3d6d6;}
    .sv-hint{ color:#b4bcc8; font-size:12px;}
    #sv_panel.sv-min{ height:auto !important; min-height:0 !important; }
    #sv_panel.sv-min .sv-tabs, #sv_panel.sv-min .sv-body{ display:none !important; }

    .sv-modal-root{ position:fixed; inset:0; z-index:2147483640; display:block; }
    .sv-modal-root[hidden]{ display:none; }
    .sv-modal-backdrop{ position:absolute; inset:0; background:rgba(0,0,0,.5); }
    .sv-modal{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:520px; max-width:90vw; max-height:80vh; background:#1b1e23; border:1px solid #333842; border-radius:12px; display:flex; flex-direction:column; box-shadow:0 20px 40px rgba(0,0,0,.4); }
    .sv-modal-head{ display:flex; align-items:center; gap:8px; padding:10px; border-bottom:1px solid #2b3036; }
    .sv-modal-title{ font-weight:700;}
    .sv-modal-body{ padding:10px; overflow:auto; min-height:0; }
    .sv-modal-foot{ position:sticky; bottom:0; display:flex; justify-content:flex-end; gap:8px; padding:10px; border-top:1px solid #2b3036; background:rgba(27,30,35,.98); }
    .sv-cta{ border:1px solid #4b5a76 !important; background:#2d3a53 !important; color:#e7efff !important; font-weight:700 !important; border-radius:8px; padding:6px 12px; }
    .sv-ghost{ border:1px solid #3a3f47; background:#23262b; color:#e9eef8; border-radius:8px; padding:5px 10px; }

    .sv-msg{ border:1px solid #2f343b; border-radius:10px; background:#12161c; overflow:hidden; flex:0 0 auto; }
    .sv-msg-head{ display:flex; align-items:center; gap:8px; padding:6px 8px; background:#2d3342; border-bottom:1px solid #40506b; }
    .sv-time{ font-weight:800; font-size:12px; color:#fff; background:#6aa1ff; border:1px solid #b8d2ff; border-radius:6px; padding:2px 6px; box-shadow:0 0 0 2px rgba(106,161,255,.18) inset; }
    .sv-msg-body{ padding:8px 10px; color:#e6e6e6; white-space:pre-wrap; word-break:break-word; flex:0 0 auto; }
    .sv-msg.sv-faint{ opacity:.86; }

    .sv-vbox{margin:0 0 10px 0; border:1px solid #2b3036; border-radius:10px; background:#161a20;}
    .sv-vhead{display:flex; align-items:center; gap:8px; padding:8px 10px; border-bottom:1px solid #2b3036;}
    .sv-vtitle{font-weight:700;}
    .sv-vtools{margin-left:auto; display:flex; gap:6px;}
    .sv-vtools button{border:1px solid #3a3f47; background:#23262b; color:#f0f0f0; border-radius:8px; padding:4px 8px; height:26px; font-size:12px;}
    .sv-vlist{margin:0; padding:8px 10px; max-height:220px; overflow:auto; list-style:decimal; padding-left:28px;}
    .sv-vlist li{padding:2px 0; overflow-wrap:anywhere; color:#d6dbe4;}
    .sv-vcollapsed .sv-vlist{max-height:0; overflow:hidden; padding-top:0; padding-bottom:0;}
  `);

  const q = (s) => panel.querySelector(s);
  const setVChip = (s) => {
    const c = q('#sv_vchip');
    c.classList.remove('sv-idle', 'sv-run', 'sv-end');
    if (s === 'run') { c.textContent = '투표 중'; c.classList.add('sv-run'); }
    else if (s === 'end') { c.textContent = '투표 끝'; c.classList.add('sv-end'); }
    else { c.textContent = '투표 대기'; c.classList.add('sv-idle'); }
  };
  const setRChip = (s) => {
    const c = q('#sv_rchip');
    c.classList.remove('sv-idle', 'sv-run', 'sv-end');
    if (s === 'run') { c.textContent = '추첨 진행중'; c.classList.add('sv-run'); }
    else if (s === 'end') { c.textContent = '추첨 종료'; c.classList.add('sv-end'); }
    else { c.textContent = '추첨 대기'; c.classList.add('sv-idle'); }
  };

  /* ========= 탭 ========= */
  panel.querySelectorAll('.sv-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.sv-tab').forEach(b => b.classList.remove('sv-active'));
      btn.classList.add('sv-active');
      const tab = btn.dataset.tab;
      q('.sv-body-vote').style.display = tab === 'vote' ? 'block' : 'none';
      q('.sv-body-raffle').style.display = tab === 'raffle' ? 'block' : 'none';
      q('#sv_maxwrap').style.display = (tab === 'vote') ? 'flex' : 'none';
      enforceBounds(); capPeopleList(); capChatLog();
    });
  });

  /* ========= 투표 카드 ========= */
  function buildCards() {
    const notes = loadJSON(K_NOTES, {});
    const wrap = q('#sv_cards'); wrap.innerHTML = '';
    for (let i = 1; i <= maxChoice; i++) {
      const card = document.createElement('div'); card.className = 'sv-card';
      card.innerHTML = `<h3>${i}번</h3>
        <input class="sv-note" id="sv_note_${i}" placeholder="메모" maxlength="50">
        <div class="sv-count" id="sv_cnt_${i}">0</div>
        <ul class="sv-list" id="sv_list_${i}"></ul>`;
      wrap.appendChild(card);
      const noteEl = card.querySelector(`#sv_note_${i}`); noteEl.value = notes[i] || '';
      noteEl.addEventListener('input', () => { const n = loadJSON(K_NOTES, {}); n[i] = noteEl.value; saveJSON(K_NOTES, n); });
    }
  }
  function tallyVotes() {
    const counts = {}, voters = {}; for (let i = 1; i <= maxChoice; i++) { counts[i] = 0; voters[i] = []; }
    const ordered = Array.from(votes.keys()).sort((a, b) => (voteTS.get(a) || 0) - (voteTS.get(b) || 0));
    for (const id of ordered) {
      const ch = votes.get(id); if (1 <= ch && ch <= maxChoice) {
        counts[ch]++; const nick = idToNick.get(id) || id; voters[ch].push(`${nick}(${id})`);
      }
    }
    return { counts, voters };
  }
  function renderVote() {
    const { counts } = tallyVotes();
    for (let i = 1; i <= maxChoice; i++) {
      const c = document.getElementById(`sv_cnt_${i}`); if (c) c.textContent = counts[i] || 0;
      const l = document.getElementById(`sv_list_${i}`); if (l) l.innerHTML = '';
    }
  }
  buildCards(); renderVote();

  const svMax = q('#sv_max');
  svMax.addEventListener('input', () => { svMax.value = svMax.value.replace(/\D+/g, '').slice(0, 2); });
  q('#sv_apply').addEventListener('click', () => {
    const n = clamp(parseInt(svMax.value, 10) || DEFAULT_MAX, MIN_LIMIT, MAX_LIMIT);
    if (n !== maxChoice) { maxChoice = n; saveInt(K_MAX, n); buildCards(); renderVote(); }
    svMax.value = String(n); enforceBounds(); capPeopleList();
  });

  q('#sv_min').addEventListener('click', () => panel.classList.toggle('sv-min'));
  q('#sv_close').addEventListener('click', () => {
    panel.style.display = 'none';
    const r = q('#sv_modal'); if (r && !r.hidden) r.hidden = true;
    stopLiveTimer(); // ✅ 패널 닫히면 생방 체크도 중지
  });

  const btnVStart = q('#sv_vstart'), btnVEnd = q('#sv_vend'), btnVReset = q('#sv_vreset'), btnVView = q('#sv_view');
  function updateVoteStartButton() { btnVStart.disabled = !liveAllowed || voteCollecting; }

  btnVStart.addEventListener('click', () => {
    updateLiveGate(); // ✅ 클릭 순간 즉시 체크
    if (!liveAllowed) { toast('생방송 중에만 시작할 수 있어요.'); return; }
    voteCollecting = true;
    setVChip('run');
    btnVStart.disabled = true; btnVEnd.disabled = false; btnVView.disabled = true;
    ensureObserver();
    scanNow(); setTimeout(scanNow, 80); setTimeout(scanNow, 250); // ✅ ON 순간 보정 스캔
    enforceBounds(); capPeopleList();
  });
  btnVEnd.addEventListener('click', () => {
    voteCollecting = false;
    setVChip('end');
    btnVStart.disabled = !liveAllowed; btnVEnd.disabled = true; btnVView.disabled = false;
    stopObserverIfIdle(); enforceBounds(); capPeopleList();
  });
  btnVReset.addEventListener('click', () => { votes.clear(); voteTS.clear(); voterLabel.clear(); renderVote(); enforceBounds(); });

  /* ========= 인원 보기(비공개 토글) ========= */
  btnVView.addEventListener('click', () => {
    const root = q('#sv_modal');
    if (root.hidden) {
      const { counts, voters } = tallyVotes();
      const box = q('#sv_modal_content'); box.innerHTML = '';
      for (let i = 1; i <= maxChoice; i++) {
        const vlist = voters[i] || []; const vlen = vlist.length;
        const wrap = document.createElement('div');
        wrap.className = 'sv-vbox' + (vlen > 30 ? ' sv-vcollapsed' : '');
        wrap.dataset.idx = String(i);
        wrap.dataset.count = String(counts[i] || 0);
        wrap.innerHTML = `
          <div class="sv-vhead">
            <div class="sv-vtitle"></div>
            <div class="sv-vtools">
              <button class="sv-vtoggle">${vlen > 30 ? `펼치기(${vlen})` : '접기'}</button>
              <button class="sv-vcopy">복사</button>
            </div>
          </div>
          <ul class="sv-vlist"></ul>
        `;
        const ul = wrap.querySelector('.sv-vlist'), frag = document.createDocumentFragment();
        for (const lbl of vlist) { const li = document.createElement('li'); li.textContent = lbl; frag.appendChild(li); }
        ul.appendChild(frag);
        const btnT = wrap.querySelector('.sv-vtoggle');
        btnT.addEventListener('click', () => { const col = wrap.classList.toggle('sv-vcollapsed'); btnT.textContent = col ? `펼치기(${vlen})` : '접기'; });
        wrap.querySelector('.sv-vcopy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(vlist.join('\n')); toast('복사됨'); } catch { toast('복사 실패'); } });
        box.appendChild(wrap);
      }
      const applyPrivacy = () => {
        box.querySelectorAll('.sv-vbox').forEach(w => {
          const idx = w.dataset.idx || '?', cnt = w.dataset.count || '0';
          const title = w.querySelector('.sv-vtitle');
          title.textContent = `${idx}번 — ${privacyOn ? '〈비공개〉' : `${cnt}표`}`;
        });
        const btn = q('#sv_privacy_toggle'); btn.textContent = privacyOn ? '공개' : '비공개';
      };
      applyPrivacy();
      q('#sv_privacy_toggle').onclick = () => { privacyOn = !privacyOn; saveInt(K_PRIV, privacyOn ? 1 : 0); applyPrivacy(); };

      const close = () => { root.hidden = true; };
      q('#sv_modal_close').onclick = close; q('#sv_modal_close2').onclick = close; root.querySelector('.sv-modal-backdrop').onclick = close;
      root.hidden = false;
    } else root.hidden = true;
  });

  /* ========= 추첨 ========= */
  const pplList = q('#sv_people_list'), pplCount = q('#sv_people_count');
  const btnRStart = q('#sv_rstart'), btnREnd = q('#sv_rend'), btnDraw = q('#sv_draw'), btnRClear = q('#sv_raffle_clear'), btnChatEnd = q('#sv_chat_end'), btnGo = q('#sv_go');
  const logBox = q('#sv_chat_log'), selText = q('#sv_selected_text');
  const liMap = new Map();

  btnRStart.addEventListener('click', () => {
    raffleLogging = true; raffleAccepting = true;
    setRChip('run');
    ensureObserver();
    scanNow(); setTimeout(scanNow, 80); setTimeout(scanNow, 250); // ✅ ON 순간 보정 스캔
    enforceBounds(); capPeopleList(); capChatLog();
  });
  btnREnd.addEventListener('click', () => { raffleAccepting = false; setRChip('end'); enforceBounds(); capPeopleList(); });
  btnRClear.addEventListener('click', () => {
    participants.clear(); idToNick.clear(); lastMsgByUser.clear(); lastAppended.clear(); liMap.clear();
    pplList.innerHTML = ''; pplCount.textContent = '(0)'; pickedId = null;
    selText.textContent = '-'; btnGo.disabled = true; btnGo.dataset.href = ''; logBox.innerHTML = ''; btnChatEnd.disabled = true;
    enforceBounds(); capChatLog();
  });
  btnDraw.addEventListener('click', () => {
    const cand = Array.from(participants.values()).filter(v => !v.out && !outSet.has(v.id));
    if (!cand.length) { toast('추첨 가능한 인원이 없습니다.'); return; }
    const pick = cand[Math.floor(Math.random() * cand.length)];
    selectUser(pick.id);
  });
  btnChatEnd.addEventListener('click', () => {
    if (!pickedId) return;
    const info = participants.get(pickedId); if (info) { info.out = true; participants.set(pickedId, info); }
    outSet.add(pickedId); saveJSON(K_OUT, [...outSet]);
    pickedId = null;
    selText.textContent = '-'; btnGo.disabled = true; btnGo.dataset.href = ''; logBox.innerHTML = ''; btnChatEnd.disabled = true;
    refreshPeople(); enforceBounds(); capPeopleList(); capChatLog();
  });
  btnGo.addEventListener('click', () => {
    const url = btnGo.dataset.href || ''; if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  function renderListItem(id, info) {
    const label = info.nick || id;
    let li = liMap.get(id);
    if (!li) {
      li = document.createElement('li'); li.dataset.id = id;
      li.innerHTML = `<div class="sv-li-main"></div>
                      <label class="sv-ban" title="참여 금지"><input type="checkbox" class="sv-banchk"></label>`;
      li.querySelector('.sv-li-main').addEventListener('click', () => { if (outSet.has(id)) return; selectUser(id); });
      const chk = li.querySelector('.sv-banchk');
      chk.addEventListener('click', (e) => {
        e.stopPropagation();
        if (chk.checked) {
          outSet.add(id);
          const i = participants.get(id); if (i) { i.out = true; participants.set(id, i); }
          if (pickedId === id) { pickedId = null; selText.textContent = '-'; btnGo.disabled = true; btnGo.dataset.href = ''; logBox.innerHTML = ''; btnChatEnd.disabled = true; }
        } else {
          outSet.delete(id);
          const i = participants.get(id); if (i) { i.out = false; participants.set(id, i); }
        }
        saveJSON(K_OUT, [...outSet]); refreshPeople(false); enforceBounds(); capPeopleList(); capChatLog();
      });
      liMap.set(id, li);
    }
    li.querySelector('.sv-li-main').textContent = label;
    const checked = outSet.has(id) || info.out;
    li.querySelector('.sv-banchk').checked = !!checked;
    li.classList.toggle('sv-out', !!checked);
    li.classList.toggle('sv-selected', id === pickedId);
    return li;
  }

  function refreshPeople(full = true) {
    if (full) { pplList.innerHTML = ''; liMap.clear(); }
    const arr = Array.from(participants.values()).sort((a, b) => (a.registeredAt || 0) - (b.registeredAt || 0));
    for (const info of arr) { const li = renderListItem(info.id, info); if (full) pplList.appendChild(li); }
    pplCount.textContent = `(${arr.length})`;
    capPeopleList(); enforceBounds();
  }

  function selectUser(id) {
    pickedId = id; btnChatEnd.disabled = false;
    refreshPeople(false);
    const nick = idToNick.get(id) || '';
    const label = nick ? `${id}(${nick})` : id;
    const cleanId = String(id).replace(/\s*\(\d+\)\s*$/, ''); // (2)(3) 꼬리 제거
    selText.textContent = label;
    btnGo.dataset.href = `https://ch.sooplive.co.kr/${encodeURIComponent(cleanId)}`;
    btnGo.disabled = false;

    logBox.innerHTML = '';
    const last = lastMsgByUser.get(id);
    if (last) { pushMsgBox(last.t, last.msg, true); lastAppended.set(id, last.msg); }
    capChatLog(); enforceBounds();
  }

  // 채팅 박스: 7개↑ 스크롤, 위 보고 있을 땐 자동 스크롤 금지
  const logBoxIsStick = () => (logBox.scrollTop + logBox.clientHeight) >= (logBox.scrollHeight - 20);
  function capChatLog() {
    const msgs = logBox.querySelectorAll('.sv-msg');
    if (!msgs.length) { logBox.style.maxHeight = ''; logBox.style.overflow = 'auto'; return; }
    const h = msgs[0].getBoundingClientRect().height || 72, gap = 8;
    const maxH = Math.round(h * 7 + gap * 6 + 12);
    if (msgs.length > 7) { logBox.style.maxHeight = maxH + 'px'; logBox.style.overflow = 'auto'; }
    else { logBox.style.maxHeight = ''; logBox.style.overflow = 'auto'; }
  }
  function pushMsgBox(ts, text, faint = false) {
    const stick = logBoxIsStick();
    const d = new Date(ts || Date.now()); const hh = String(d.getHours()).padStart(2, '0'); const mm = String(d.getMinutes()).padStart(2, '0');
    const box = document.createElement('div'); box.className = 'sv-msg' + (faint ? ' sv-faint' : '');
    box.innerHTML = `<div class="sv-msg-head"><span class="sv-time">${hh}:${mm}</span></div>
                     <div class="sv-msg-body">${esc(text)}</div>`;
    logBox.appendChild(box);
    capChatLog(); if (stick) logBox.scrollTop = logBox.scrollHeight;
  }

  // 참여자 17명↑이면 리스트만 스크롤
  function capPeopleList() {
    const items = pplList.querySelectorAll('li');
    if (items.length <= 17) { pplList.style.maxHeight = ''; pplList.style.overflow = 'auto'; return; }
    const h = items[0]?.getBoundingClientRect().height || 34, gap = 4;
    const maxH = Math.round(17 * h + 16 * gap + 8);
    pplList.style.maxHeight = maxH + 'px'; pplList.style.overflow = 'auto';
  }

  /* ========= ‘투표하기’ 메뉴 고정 (렉 완화: 무한 tick 제거) ========= */
  (function menuPatch() {
    const MENU_SEL = '.ml-menu';
    const ITEM_ATTR = 'data-ml', ITEM_KEY = 'sv-open';

    const ensure = (menuEl) => {
      if (!(menuEl instanceof Element)) return;
      let sep = menuEl.querySelector(':scope > .sv-sep');
      if (!sep) { sep = document.createElement('div'); sep.className = 'sv-sep'; sep.style.cssText = 'height:0;border-top:1px solid #2b3036;margin:6px 0 4px 0;'; menuEl.appendChild(sep); }
      let item = menuEl.querySelector(`:scope > .item[${ITEM_ATTR}="${ITEM_KEY}"]`);
      if (!item) {
        item = document.createElement('div');
        item.className = 'item';
        item.setAttribute(ITEM_ATTR, ITEM_KEY);
        item.textContent = '투표하기';
        menuEl.appendChild(item);
      } else {
        item.classList.add('item'); item.textContent = '투표하기';
      }
      const openNow = (e) => { try { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation?.(); } catch { } openPanel(); };
      if (!item.__svWired) {
        item.__svWired = true;
        const cap = { capture: true, passive: false };
        ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(ev => item.addEventListener(ev, openNow, cap));
      }
    };

    // 기존 메뉴 1회 보정
    document.querySelectorAll(MENU_SEL).forEach(el => ensure(el));

    // 이후는 MutationObserver만
    const mo = new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (n.nodeType !== 1) return;
            if (n.matches?.(MENU_SEL)) ensure(n);
            n.querySelectorAll?.(MENU_SEL).forEach(el => ensure(el));
          });
        } else if (m.type === 'attributes' && m.target.matches?.(MENU_SEL)) {
          ensure(m.target);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden', 'aria-hidden'] });
  })();

  /* ========= 열기/이동/크기 저장/경계 ========= */
  function enforceBounds() {
    const maxH = Math.max(360, window.innerHeight - 24), maxW = Math.max(520, window.innerWidth - 24);
    const r = panel.getBoundingClientRect();
    if (r.height > maxH) panel.style.height = maxH + 'px';
    if (r.width > maxW) panel.style.width = maxW + 'px';
    let nx = r.left, ny = r.top;
    const w = panel.getBoundingClientRect().width, h = panel.getBoundingClientRect().height;
    if (r.right > window.innerWidth) nx = Math.max(8, window.innerWidth - w - 8);
    if (r.bottom > window.innerHeight) ny = Math.max(8, window.innerHeight - h - 8);
    if (r.left < 0) nx = 8; if (r.top < 0) ny = 8;
    panel.style.left = nx + 'px'; panel.style.top = ny + 'px'; panel.style.right = 'auto'; panel.style.bottom = 'auto';
  }

  function openPanel() {
    if (!document.body.contains(panel)) document.body.appendChild(panel);
    const pos = loadJSON(K_POS, null), size = loadJSON(K_SIZE, null);
    if (pos) { panel.style.left = pos.left + 'px'; panel.style.top = pos.top + 'px'; panel.style.right = 'auto'; panel.style.bottom = 'auto'; }
    else { panel.style.left = ''; panel.style.top = ''; panel.style.right = '12px'; panel.style.bottom = '12px'; }
    if (size) { panel.style.width = size.w + 'px'; panel.style.height = size.h + 'px'; }
    panel.style.display = 'block';

    // ✅ 패널이 열렸을 때만 생방 체크 시작
    startLiveTimer();

    const tab = panel.querySelector('.sv-tab.sv-active')?.dataset.tab || 'vote';
    q('#sv_maxwrap').style.display = (tab === 'vote') ? 'flex' : 'none';
    setVChip(voteCollecting ? 'run' : 'idle'); setRChip(raffleLogging ? 'run' : 'idle');
    updateVoteStartButton(); refreshPeople();
    enforceBounds(); capPeopleList(); capChatLog();
  }

  (function enableAltDragAndSaveSize() {
    const header = panel.querySelector('.sv-header');
    header.addEventListener('mousedown', (e) => {
      if (!e.altKey) return; e.preventDefault();
      const r = panel.getBoundingClientRect(); let sx = e.clientX, sy = e.clientY, bx = r.left, by = r.top;
      panel.style.left = bx + 'px'; panel.style.top = by + 'px'; panel.style.right = 'auto'; panel.style.bottom = 'auto';
      header.style.cursor = 'grabbing';
      function mv(ev) { panel.style.left = (bx + ev.clientX - sx) + 'px'; panel.style.top = (by + ev.clientY - sy) + 'px'; }
      function up() {
        document.removeEventListener('mousemove', mv, true); document.removeEventListener('mouseup', up, true);
        header.style.cursor = '';
        saveJSON(K_POS, { left: parseInt(panel.style.left, 10) || 0, top: parseInt(panel.style.top, 10) || 0 });
        enforceBounds();
      }
      document.addEventListener('mousemove', mv, true); document.addEventListener('mouseup', up, true);
    });
    new ResizeObserver(es => {
      for (const e of es) {
        const r = e.contentRect || {};
        if (r.width && r.height) saveJSON(K_SIZE, { w: Math.round(r.width), h: Math.round(r.height) });
        enforceBounds(); capPeopleList(); capChatLog();
      }
    }).observe(panel);
    window.addEventListener('resize', () => { enforceBounds(); capPeopleList(); capChatLog(); });
  })();

  /* ========= 채팅 파서 & 옵저버 (UI변경 대응 + 렉 완화) ========= */

  // ✅ 이제 document.body 전체가 아니라, 채팅 루트만 관찰해서 렉을 줄임
  const CHAT_ROOT_CANDIDATES = [
    '#chat_area',                 // 유저가 준 실제 ID
    '.chatting-viewer',
    '.chatting-area',
    '[class*="chatting"]',
  ];

  let chatRoot = null;
  const resolveChatRoot = () => {
    for (const sel of CHAT_ROOT_CANDIDATES) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  };

  // 채팅 아이템(새 UI 기준) 우선
  const MSG_NODE_SEL = [
    '.chatting-list-item',
    '.message-container',
    '.donation-container',
    '.start-message'
  ].join(',');

  // 메시지 텍스트 후보(새 UI 포함)
  const getMsgEl = (n) => (
    n.querySelector?.('#message-original, .message-text #message-original, .message-text .msg, .message-text p, p.msg, .msg, .message, .text, .content, .body') || n
  );

  // 각 메시지 노드의 마지막 텍스트를 기억하여, 내용이 실제로 바뀔 때만 파싱
  const seenText = new WeakMap();

  // 큐 처리(프레임당 제한)
  const qQueue = []; let busy = false; const MAX_PER_FRAME = 80; // ✅ 120→80로 낮춰 급폭주 완화
  const enqueue = (n, delay = 0) => {
    if (delay > 0) { setTimeout(() => enqueue(n, 0), delay); return; }
    qQueue.push(n);
    if (!busy) { busy = true; requestAnimationFrame(flushQueue); }
  };

  function flushQueue() {
    let c = 0;
    while (c < MAX_PER_FRAME && qQueue.length) {
      const n = qQueue.shift();
      if (!n || !n.isConnected) { c++; continue; }
      if (n.nodeType === 3) { // text node
        const el = n.parentElement; if (el) parseOne(el);
      } else if (n.matches?.(MSG_NODE_SEL)) {
        parseOne(n);
      } else {
        // 큰 덩어리로 들어오면 채팅 아이템만 골라서
        n.querySelectorAll?.(MSG_NODE_SEL).forEach(el => parseOne(el));
      }
      c++;
    }
    if (qQueue.length) requestAnimationFrame(flushQueue);
    else busy = false;
  }

  function parseOne(node) {
    const el = getMsgEl(node); if (!el) return;
    const cur = (el.textContent || '').trim();
    const prev = seenText.get(node);
    if (!cur || cur === prev) return;
    seenText.set(node, cur);

    const parsed = parse(node);
    if (parsed) handle(parsed);
  }

  // ✅ 수집 ON일 때만 재스캔 타이머를 돌림
  let bodyObs = null;
  let scanTimer = null;

  function ensureObserver() {
    if (bodyObs) return;

    // 채팅 루트 탐색/갱신
    chatRoot = resolveChatRoot() || document.body;

    bodyObs = new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1) { enqueue(n); enqueue(n, 80); } // 늦게 차는 텍스트 대비
          });
        } else if (m.type === 'characterData') {
          enqueue(m.target);
        } else if (m.type === 'attributes') {
          if (m.target && m.target.matches?.(MSG_NODE_SEL)) enqueue(m.target);
        }
      }
    });

    bodyObs.observe(chatRoot, {
      childList: true, subtree: true,
      characterData: true,
      attributes: true, attributeFilter: ['class', 'data-emote', 'aria-label', 'title']
    });

    // 안전망: 가상화/교체 대비 재스캔 (ON일 때만)
    scanTimer = setInterval(() => {
      // 채팅 루트가 교체되면 재부착
      const latest = resolveChatRoot();
      if (latest && latest !== chatRoot) {
        try { bodyObs.disconnect(); } catch { }
        chatRoot = latest;
        bodyObs.observe(chatRoot, {
          childList: true, subtree: true,
          characterData: true,
          attributes: true, attributeFilter: ['class', 'data-emote', 'aria-label', 'title']
        });
      }
      scanNow();
    }, 2500);
  }

  function stopObserverIfIdle() {
    if (!voteCollecting && !raffleLogging && !pickedId) {
      if (bodyObs) { try { bodyObs.disconnect(); } catch { } }
      bodyObs = null;
      if (scanTimer) { clearInterval(scanTimer); scanTimer = null; }
      chatRoot = null;
    }
  }

  function scanNow() {
    // ✅ 채팅 루트 기반 “가벼운” 스캔
    const root = chatRoot || resolveChatRoot();
    if (!root) return;
    root.querySelectorAll(MSG_NODE_SEL).forEach(n => { if (n.isConnected) enqueue(n); });
  }

  // ID 정규화: wc423(2) 같은 꼬리 제거 + 소문자
  const normalizeId = (s) => (String(s || '')
    .trim()
    .replace(/\s*\(\d+\)\s*$/, '')
    .toLowerCase());

  // ✅ UI 변경 대응: user_id / user_nick / (nick, em) 구조 등 다중 루트에서 추출
  const extractId = (n) => {
    // 1) 버튼/엘리먼트 속성
    const idEl = n.querySelector?.('[user_id],[data-user-id],[data-uid],[data-userid]');
    let id = (
      idEl?.getAttribute('user_id') ||
      idEl?.getAttribute('data-user-id') ||
      idEl?.getAttribute('data-uid') ||
      idEl?.getAttribute('data-userid') ||
      ''
    ).trim();

    // 2) "info" 카드형: <span class="nick">닉</span><em>아이디</em>
    if (!id) {
      const info = n.querySelector?.('.info, .info-box, [class*="info"]');
      const em = info?.querySelector?.('em');
      const t = txt(em);
      if (t && /^[A-Za-z0-9_().-]{2,}$/.test(t)) id = t;
    }

    // 3) 링크 기반
    if (!id) {
      const a = n.querySelector?.('a[href*="/profile/"], a[href*="user="], a[href*="ch.sooplive.co.kr/"]');
      const href = a?.getAttribute('href') || '';
      const m = href.match(/\/profile\/([A-Za-z0-9_]{2,})/) ||
        href.match(/[?&]user=([A-Za-z0-9_]{2,})/i) ||
        href.match(/ch\.sooplive\.co\.kr\/([A-Za-z0-9_]{2,})/i);
      if (m) id = m[1];
    }

    return normalizeId(id);
  };

  const extractNick = (n) => {
    // 1) 속성 우선 (새 UI에서 매우 신뢰도 높음)
    const nickEl = n.querySelector?.('[user_nick],[data-user-nick],[data-nick]');
    let nick = (
      nickEl?.getAttribute('user_nick') ||
      nickEl?.getAttribute('data-user-nick') ||
      nickEl?.getAttribute('data-nick') ||
      ''
    ).trim();

    // 2) span.author (기존 방식)
    if (!nick) {
      const a = n.querySelector?.('span.author');
      if (a) nick = stripSubText(pureAuthorText(a).replace(/\s*[:：﹕]\s*$/, '').replace(EMOJI_RE, '').trim());
    }

    // 3) 도네/기타: button.name
    if (!nick) {
      const b = n.querySelector?.('button.name, .info-box > button.name');
      if (b) nick = stripSubText(txt(b).replace(EMOJI_RE, '').trim());
    }

    // 4) info 카드형: span.nick
    if (!nick) {
      const s = n.querySelector?.('.info span.nick, span.nick');
      if (s) nick = stripSubText(txt(s).replace(EMOJI_RE, '').trim());
    }

    return (nick || '').trim();
  };

  const NOISE_RE = /(방송\s*중|live\s*on)/i;

  function parse(n) {
    const raw = txt(n);
    if (!raw || raw.length < 2) return null;

    const id = extractId(n);
    if (!id) return null;

    // 닉네임
    const nick = extractNick(n);
    if (nick) idToNick.set(id, nick);

    // 메시지
    const msgEl = getMsgEl(n);
    let msg = (msgEl?.textContent || '').trim();

    // 시스템 메시지/잡음 컷
    if (!msg && NOISE_RE.test(raw) && !n.querySelector?.('[user_id],[data-user-id],[data-uid],[user_nick]')) return null;

    // 정상 채팅은 msg가 있어야 의미있음. (도네/입장 같은 건 msg가 없을 수 있음)
    if (!msg) return { id, nick, msg: '' };

    return { id, nick, msg };
  }

  function handle(p) {
    // 추첨 쪽: 종료 후라도 선택된 유저라면 계속 수집
    const listenRaffle = raffleLogging || !!pickedId;

    if (listenRaffle && !outSet.has(p.id)) {
      if (raffleAccepting && !participants.has(p.id)) {
        participants.set(p.id, { id: p.id, nick: (p.nick || ''), registeredAt: Date.now(), out: false });
        renderOrUpdateItem(p.id);
      } else if (participants.has(p.id)) {
        const info = participants.get(p.id);
        if (p.nick && p.nick !== info.nick) info.nick = p.nick;
        participants.set(p.id, info);
        renderOrUpdateItem(p.id);
      }

      // 메시지 있는 경우만 로그/마지막메시지 처리
      if (p.msg) {
        lastMsgByUser.set(p.id, { t: Date.now(), msg: p.msg });
        if (pickedId === p.id) appendLogFor(p.id, p.msg);
      }
    }

    // 투표 쪽
    if (voteCollecting && p.msg) {
      if (CANCEL_RE.test(p.msg)) {
        if (votes.has(p.id)) { votes.delete(p.id); voteTS.set(p.id, Date.now()); renderVote(); }
        return;
      }
      const mv = p.msg.match(VOTE_RE);
      if (mv) {
        const num = +mv[1];
        if (num >= 1 && num <= maxChoice) {
          votes.set(p.id, num);
          voterLabel.set(p.id, (idToNick.get(p.id) || p.id) + `(${p.id})`);
          voteTS.set(p.id, Date.now());
          renderVote();
        }
      }
    }

    stopObserverIfIdle();
  }

  function appendLogFor(id, msg) {
    const last = lastAppended.get(id) || '';
    if (last === msg) return;
    lastAppended.set(id, msg);
    const rec = lastMsgByUser.get(id); const ts = rec?.t || Date.now();
    pushMsgBox(ts, msg, false);
  }

  function renderOrUpdateItem(id) {
    const info = participants.get(id);
    const li = renderListItem(id, info);
    if (!li.isConnected) pplList.appendChild(li);
    pplCount.textContent = `(${participants.size})`;
  }

})();
