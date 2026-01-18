// ==UserScript==
// @name         ChatGPT-Workspace-Helper
// @namespace    https://chatgpt.com
// @version      1.9.2
// @description  ChatGPT Workspace 管理一体化面板
// @author       Marx
// @license      MIT
// @icon         https://chatgpt.com/favicon.ico
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555394/ChatGPT-Workspace-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/555394/ChatGPT-Workspace-Helper.meta.js
// ==/UserScript==

(function () {
  if (window !== window.top) return;

  const PERMISSIONS_MEMBER = [
    "chatgpt.workspace.model.GPT-4.5.access",
    "chatgpt.workspace.model.o1-pro.access",
    "chatgpt.workspace.model.o3-pro.access",
    "chatgpt.workspace.model.o3.access",
    "chatgpt.workspace.model.o4-mini.access",
    "chatgpt.workspace.model.o4-mini-high.access",
    "chatgpt.workspace.model.GPT-4.1.access",
    "chatgpt.workspace.model.GPT-4.1-mini.access",
    "chatgpt.workspace.model.GPT-5-reasoning.access",
    "chatgpt.workspace.model.GPT-5-pro.access",
    "chatgpt.workspace.feature.deep-research.access",
    "chatgpt.workspace.feature.image-gen.access",
    "chatgpt.workspace.feature.voice.access",
    "chatgpt.workspace.feature.aura-browser-memories.access",
    "chatgpt.workspace.gpt.crud",
    "chatgpt.workspace.feature.search.access",
    "chatgpt.workspace.feature.allow-codex-access.access",
    "chatgpt.workspace.feature.allow-codex-local-access.access",
    "chatgpt.workspace.feature.codex-agent-network-access.access",
    "chatgpt.workspace.feature.hive.access",
    "chatgpt.workspace.feature.hive-knowledge-retrieval.access",
    "chatgpt.workspace.project.crud",
    "chatgpt.workspace.project.share",
    "chatgpt.workspace.feature.canvas-code-execution.access",
    "chatgpt.workspace.feature.canvas-code-network-access.access",
    "chatgpt.workspace.feature.video-screen-sharing.access",
    "chatgpt.workspace.feature.share-chat-with-workspace.access",
    "chatgpt.workspace.member.role.view",
    "chatgpt.workspace.model.GPT-5.1.access",
    "chatgpt.workspace.model.GPT-5.1-reasoning.access",
    "chatgpt.workspace.model.GPT-5.1-pro.access",
    "chatgpt.workspace.gpt.allow_all_third_party",
    "chatgpt.workspace.model.GPT-5.2.access",
    "chatgpt.workspace.model.GPT-5.2.instant.access",
    "chatgpt.workspace.model.GPT-5.2-reasoning.access",
    "chatgpt.workspace.feature.aura.access",
    "chatgpt.workspace.model.GPT-5.2-pro.access",
    "chatgpt.workspace.feature.agent-mode.access",
    "chatgpt.workspace.feature.codex-admin.access",
    "chatgpt.workspace.feature.codex-slack-posting.access",
    "chatgpt.workspace.gpt.share_workspace",
    "chatgpt.workspace.gpt.share_external",
    "chatgpt.workspace.gpt.allow_specific_third_party"
  ];

  const css = `
  :root{--bg:#ffffff;--panel:#f7f9fc;--text:#111827;--muted:#6b7280;--border:#e5e7eb;--accent:#60a5fa;--danger:#ef4444;--success:#16a34a;--warn:#f59e0b}
  #wdd-fab{position:fixed;top:1.3rem;right:1.3rem;width:3.2rem;height:3.2rem;border-radius:999rem;border:none;background:transparent;cursor:pointer;z-index:999999;display:grid;place-items:center;box-shadow:0 .42rem 1.05rem rgba(0,0,0,.12);transition:transform .2s ease,box-shadow .2s ease}
  #wdd-fab:hover{transform:translateY(-.07rem);box-shadow:0 .62rem 1.45rem rgba(0,0,0,.16)}
  #wdd-fab img{width:2.05rem;height:2.05rem;display:block}

  #wdd-team-float{position:fixed;top:4.9rem;right:1.3rem;z-index:999999;padding:.46rem .72rem;border-radius:999rem;border:1px solid rgba(0,0,0,.08);background:#e5e7eb;color:#111827;font-size:11.5px;font-weight:650;letter-spacing:.02em;cursor:pointer;box-shadow:0 .3rem .9rem rgba(0,0,0,.06);backdrop-filter:blur(6px);transition:transform .12s ease,box-shadow .2s ease,opacity .2s ease}
  #wdd-team-float:hover{transform:translateY(-1px);box-shadow:0 .45rem 1.1rem rgba(0,0,0,.08);opacity:.96}
  #wdd-team-float[data-loading="1"]{cursor:default;opacity:.7}
  #wdd-team-float.tm-success{background:#a7f3d0;color:#064e3b}
  #wdd-team-float.tm-error{background:#fee2e2;color:#991b1b}

  #wdd-modal{position:fixed;inset:0;display:none;align-items:flex-start;justify-content:flex-end;background:transparent;z-index:999998;padding:1rem}
  #wdd-modal.open #wdd-card{opacity:1;transform:translateY(0) scale(.98)}
  #wdd-card{width:28rem;max-width:92vw;margin:0;background:var(--panel);color:var(--text);border:0.0625rem solid var(--border);border-radius:1.05rem;box-shadow:0 1.15rem 3rem rgba(0,0,0,.12);overflow:hidden;opacity:0;transform-origin:top right;transform:translateY(-.3rem) scale(.92);transition:opacity .2s ease,transform .2s ease;max-height:calc(100vh - 2rem);display:flex;flex-direction:column;font-size:11.5px}
  .wdd-hd{display:flex;align-items:center;justify-content:space-between;padding:.6rem .75rem;border-bottom:0.0625rem solid var(--border);background:#fff}
  .wdd-ttl{font-weight:800;font-size:12px;letter-spacing:.02em}
  .wdd-x{appearance:none;border:none;background:transparent;color:var(--muted);font-size:16px;cursor:pointer;padding:.18rem .48rem;border-radius:.5rem}
  .wdd-x:hover{background:#f3f4f6;color:#111827}
  .wdd-bd{padding:.7rem;display:grid;gap:.62rem;background:var(--panel);overflow:auto;flex:1;min-height:0}
  .wdd-row{display:grid;gap:.4rem}
  .wdd-lbl{font-size:10.5px;color:var(--muted);display:flex;align-items:center;justify-content:space-between;gap:.55rem}
  .wdd-inp,.wdd-sel{width:100%;padding:.5rem .65rem;border-radius:.68rem;border:0.0625rem solid var(--border);background:#fff;color:var(--text);outline:none;font-size:11.5px}
  .wdd-inp::placeholder{color:#9ca3af}
  .wdd-kv{position:relative;display:flex;align-items:center;gap:.5rem;border:0.0625rem dashed var(--border);border-radius:.68rem;padding:1.22rem .65rem .65rem .65rem;background:#fff}
  .wdd-kv .kv-hint{position:absolute;top:.35rem;left:.55rem;font-size:10.5px;color:var(--muted)}
  .wdd-kv .kv-row{display:flex;align-items:center;gap:.5rem;width:100%}
  .wdd-kv input{flex:1;min-width:0;background:transparent;border:none;color:var(--text);outline:none;font-size:11.5px}
  .wdd-actions{display:flex;gap:.42rem;flex-wrap:wrap}
  .wdd-actions.grid2{display:grid;grid-template-columns:1fr 1fr;gap:.42rem}
  .wdd-actions.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.42rem}
  .wdd-btn{appearance:none;border:none;border-radius:.75rem;padding:.5rem .62rem;background:var(--accent);color:#0b1220;font-weight:850;cursor:pointer;font-size:11.5px}
  .wdd-btn.secondary{background:#fff;color:var(--text);border:0.0625rem solid var(--border);font-weight:750}
  .wdd-btn.warn{background:var(--danger);color:#fff}
  .wdd-btn.ok{background:var(--success);color:#fff}
  .wdd-btn:disabled{opacity:.6;cursor:not-allowed}
  .wdd-note{font-size:10.5px;color:var(--muted);line-height:1.45}
  .wdd-status{display:flex;align-items:center;gap:.45rem;padding:.55rem .7rem;border-radius:.72rem;border:0.0625rem solid var(--border);background:#f3f4f6;color:#374151;font-weight:750;position:sticky;bottom:0;z-index:3}
  .wdd-status.ok{background:#ecfdf5;border-color:#a7f3d0;color:#065f46;font-weight:900}
  .wdd-status.err{background:#fef2f2;border-color:#fecaca;color:#991b1b;font-weight:900}
  .wdd-grid{display:grid;grid-template-columns:1fr 1fr;gap:.42rem}
  #wdd-toast{position:fixed;right:1.3rem;top:7.6rem;background:#111827;color:#fff;padding:.42rem .6rem;border-radius:.5rem;font-size:11.5px;opacity:0;transform:translateY(-.22rem);transition:opacity .15s ease,transform .15s ease;pointer-events:none;z-index:999999}
  #wdd-toast.show{opacity:1;transform:translateY(0)}
  .wdd-switch-btn{appearance:none;border:none;background:#e5e7eb;width:2.35rem;height:1.38rem;border-radius:999rem;position:relative;cursor:pointer;transition:background .2s ease;border:0.0625rem solid var(--border)}
  .wdd-switch-btn::after{content:'';position:absolute;top:.085rem;left:.085rem;width:1.21rem;height:1.21rem;background:#fff;border-radius:50%;transition:transform .2s ease;box-shadow:0 .08rem .2rem rgba(0,0,0,.15)}
  .wdd-switch-btn.on{background:var(--accent)}
  .wdd-switch-btn.on::after{transform:translateX(1rem)}
  .wdd-switch-btn:disabled{opacity:.6;cursor:not-allowed}
  .wdd-list{display:grid;gap:.36rem;max-height:10.2rem;overflow:auto}
  .wdd-item{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.46rem .6rem;border:0.0625rem solid var(--border);border-radius:.62rem;background:#fff;cursor:pointer}
  .wdd-item:hover{box-shadow:0 .2rem .55rem rgba(0,0,0,.06)}
  .wdd-host{font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:15.4rem;font-size:11.5px}
  .wdd-pill{padding:.14rem .48rem;border-radius:999rem;font-size:10.5px;border:0.0625rem solid var(--border);background:#f3f4f6;color:#374151}
  .wdd-pill.ok{background:#ecfdf5;border-color:#a7f3d0;color:#065f46}
  .wdd-pill.wait{background:#fff7ed;border-color:#fed7aa;color:#9a3412}
  .wdd-pill.err{background:#fef2f2;border-color:#fecaca;color:#991b1b}
  .wdd-spin{width:12px;height:12px;border:2px solid #e5e7eb;border-top-color:var(--accent);border-radius:50%;animation:wddspin 1s linear infinite;flex:0 0 auto}
  @keyframes wddspin{to{transform:rotate(360deg)}}
  .wdd-legacy-row{max-height:0;opacity:0;transform:translateY(-.1rem);overflow:hidden;transition:max-height .25s ease,opacity .2s ease,transform .2s ease}
  .wdd-legacy-row.active{max-height:3.25rem;opacity:1;transform:translateY(0)}
  .wdd-legacy-wrap{border-radius:.68rem;border:0.0625rem solid var(--border);background:#fff;padding:.42rem .55rem;display:grid;gap:.18rem}
  .wdd-legacy-bar{position:relative;width:100%;height:.36rem;border-radius:999rem;background:#e5e7eb;overflow:hidden}
  .wdd-legacy-bar-inner{position:absolute;left:0;top:0;height:100%;width:0;background:var(--accent);transition:width .2s ease}
  .wdd-legacy-info{display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);align-items:center}
  .wdd-hr{height:1px;background:var(--border);border:none;margin:.1rem 0}
  .wdd-log{background:#0b1220;color:#e5e7eb;border-radius:.72rem;border:1px solid rgba(148,163,184,.2);padding:.52rem .6rem;max-height:9.2rem;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:10.5px;line-height:1.35;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}
  .wdd-log .i{color:#e5e7eb}
  .wdd-log .s{color:#6ee7b7}
  .wdd-log .e{color:#fca5a5}
  .wdd-inline{display:flex;gap:.42rem;align-items:center}
  .wdd-inline .wdd-inp{flex:1}
  `;

  if (typeof GM_addStyle === 'function') GM_addStyle(css);
  else { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }

  const store = {
    get k(){ try{ return JSON.parse(localStorage.getItem('wdd_store')||'{}'); }catch{ return {}; } },
    set v(obj){ localStorage.setItem('wdd_store', JSON.stringify(obj||{})); },
    upd(p){ const cur=this.k; Object.assign(cur,p); this.v=cur; }
  };

  let token = null;
  let tokenTs = 0;
  let userId = null;
  let accounts = [];
  let userEmail = null;
  let selected = null;
  let lastDomain = null;
  let inviteState = true;
  const domainsCache = new Map();
  let legacyHideTimer = null;

  const fab = document.createElement('button');
  fab.id = 'wdd-fab';
  fab.innerHTML = `<img src="https://chatgpt.com/favicon.ico" alt="gpt">`;

  const teamFloat = document.createElement('button');
  teamFloat.id = 'wdd-team-float';
  teamFloat.type = 'button';
  teamFloat.textContent = '生成团队支付链接';
  teamFloat.dataset.loading = '0';

  const modal = document.createElement('div');
  modal.id = 'wdd-modal';

  const card = document.createElement('div');
  card.id = 'wdd-card';

  const hd = document.createElement('div');
  hd.className = 'wdd-hd';

  const ttl = document.createElement('div');
  ttl.className = 'wdd-ttl';
  ttl.textContent = 'Workspace Helper';

  const btnX = document.createElement('button');
  btnX.className = 'wdd-x';
  btnX.textContent = '✕';

  hd.appendChild(ttl);
  hd.appendChild(btnX);

  const bd = document.createElement('div');
  bd.className = 'wdd-bd';

  const rowWs = document.createElement('div');
  rowWs.className = 'wdd-row';

  const lblWs = document.createElement('div');
  lblWs.className = 'wdd-lbl';
  lblWs.textContent = '工作区';

  const selWs = document.createElement('select');
  selWs.className = 'wdd-sel';

  const wsBar = document.createElement('div');
  wsBar.className = 'wdd-grid';

  const wsId = document.createElement('input');
  wsId.className = 'wdd-inp';
  wsId.readOnly = true;
  wsId.placeholder = 'account_id';

  const orgId = document.createElement('input');
  orgId.className = 'wdd-inp';
  orgId.readOnly = true;
  orgId.placeholder = 'organization_id';

  wsBar.append(wsId, orgId);

  const wsBtns = document.createElement('div');
  wsBtns.className = 'wdd-actions grid3';

  const btnRefresh = document.createElement('button');
  btnRefresh.className = 'wdd-btn secondary';
  btnRefresh.textContent = '刷新工作区';

  const btnReloadDomains = document.createElement('button');
  btnReloadDomains.className = 'wdd-btn secondary';
  btnReloadDomains.textContent = '刷新域名';

  const btnLegacyAll = document.createElement('button');
  btnLegacyAll.className = 'wdd-btn secondary';
  btnLegacyAll.textContent = 'Legacy 全部';

  const btnPatchMember = document.createElement('button');
  btnPatchMember.className = 'wdd-btn secondary';
  btnPatchMember.textContent = '更新 Member 权限';

  const btnEnableApple = document.createElement('button');
  btnEnableApple.className = 'wdd-btn secondary';
  btnEnableApple.textContent = '开启 Apple 客户端';

  const btnEnableLegacyCurrent = document.createElement('button');
  btnEnableLegacyCurrent.className = 'wdd-btn secondary';
  btnEnableLegacyCurrent.textContent = 'Legacy 当前';

  const btnQuickCur = document.createElement('button');
  btnQuickCur.className = 'wdd-btn secondary';
  btnQuickCur.textContent = 'Quick 当前';

  const btnQuickAll = document.createElement('button');
  btnQuickAll.className = 'wdd-btn secondary';
  btnQuickAll.textContent = 'Quick 全部';

  const btnOnboardCur = document.createElement('button');
  btnOnboardCur.className = 'wdd-btn secondary';
  btnOnboardCur.textContent = 'Onboarding 当前';

  const btnOnboardAll = document.createElement('button');
  btnOnboardAll.className = 'wdd-btn secondary';
  btnOnboardAll.textContent = 'Onboarding 全部';

  const btnSeat1000n = document.createElement('button');
  btnSeat1000n.className = 'wdd-btn secondary';
  btnSeat1000n.textContent = 'SEAT 1000→n';

  const btnLeaveCur = document.createElement('button');
  btnLeaveCur.className = 'wdd-btn warn';
  btnLeaveCur.textContent = '退出当前工作区';

  const btnOwnerToAdmin = document.createElement('button');
  btnOwnerToAdmin.className = 'wdd-btn secondary';
  btnOwnerToAdmin.textContent = 'Owner→Admin';


  wsBtns.append(
    btnRefresh, btnReloadDomains, btnPatchMember,
    btnEnableLegacyCurrent, btnEnableApple, btnSeat1000n,
    btnQuickCur, btnQuickAll, btnOnboardCur,
    btnOnboardAll, btnLegacyAll, btnOwnerToAdmin, btnLeaveCur
  );

  rowWs.append(lblWs, selWs, wsBar, wsBtns);

  const rowTeam = document.createElement('div');
  rowTeam.className = 'wdd-row';

  const lblTeam = document.createElement('div');
  lblTeam.className = 'wdd-lbl';
  lblTeam.textContent = 'Team Checkout（生成并复制支付链接）';

  const teamGrid1 = document.createElement('div');
  teamGrid1.className = 'wdd-grid';

  const inpTeamName = document.createElement('input');
  inpTeamName.className = 'wdd-inp';
  inpTeamName.placeholder = 'workspace_name';
  inpTeamName.value = store.k.team_workspace_name || 'OAI';

  const selTeamInterval = document.createElement('select');
  selTeamInterval.className = 'wdd-sel';
  const optM = document.createElement('option'); optM.value='month'; optM.textContent='month';
  const optY = document.createElement('option'); optY.value='year'; optY.textContent='year';
  selTeamInterval.append(optM, optY);
  selTeamInterval.value = store.k.team_price_interval || 'month';

  teamGrid1.append(inpTeamName, selTeamInterval);

  const teamGrid2 = document.createElement('div');
  teamGrid2.className = 'wdd-grid';

  const inpTeamSeats = document.createElement('input');
  inpTeamSeats.className = 'wdd-inp';
  inpTeamSeats.placeholder = 'seat_quantity';
  inpTeamSeats.value = String(store.k.team_seat_quantity ?? 2);

  const inpTeamCountry = document.createElement('input');
  inpTeamCountry.className = 'wdd-inp';
  inpTeamCountry.placeholder = 'country';
  inpTeamCountry.value = store.k.team_country || 'JP';

  teamGrid2.append(inpTeamSeats, inpTeamCountry);

  const teamGrid3 = document.createElement('div');
  teamGrid3.className = 'wdd-grid';

  const inpTeamCurrency = document.createElement('input');
  inpTeamCurrency.className = 'wdd-inp';
  inpTeamCurrency.placeholder = 'currency';
  inpTeamCurrency.value = store.k.team_currency || 'USD';

  const inpTeamPromo = document.createElement('input');
  inpTeamPromo.className = 'wdd-inp';
  inpTeamPromo.placeholder = 'promo_campaign';
  inpTeamPromo.value = store.k.team_promo_campaign || 'team-1-month-free';

  teamGrid3.append(inpTeamCurrency, inpTeamPromo);

  const teamBtns = document.createElement('div');
  teamBtns.className = 'wdd-actions grid2';

  const btnTeamCheckout = document.createElement('button');
  btnTeamCheckout.className = 'wdd-btn ok';
  btnTeamCheckout.textContent = '生成并复制';

  const btnTeamOpen = document.createElement('button');
  btnTeamOpen.className = 'wdd-btn secondary';
  btnTeamOpen.textContent = '仅生成(不复制)';

  teamBtns.append(btnTeamCheckout, btnTeamOpen);
  rowTeam.append(lblTeam, teamGrid1, teamGrid2, teamGrid3, teamBtns);

  const rowFree = document.createElement('div');
  rowFree.className = 'wdd-row';

  const lblFree = document.createElement('div');
  lblFree.className = 'wdd-lbl';
  lblFree.textContent = '创建 Freemium Workspace';

  const freeLine = document.createElement('div');
  freeLine.className = 'wdd-inline';

  const inpFreeName = document.createElement('input');
  inpFreeName.className = 'wdd-inp';
  inpFreeName.value = store.k.freeName || 'OAI-free';

  const btnCreateFree = document.createElement('button');
  btnCreateFree.className = 'wdd-btn ok';
  btnCreateFree.style.flex = '0 0 auto';
  btnCreateFree.textContent = '创建';

  freeLine.append(inpFreeName, btnCreateFree);
  rowFree.append(lblFree, freeLine);

  const rowHost = document.createElement('div');
  rowHost.className = 'wdd-row';

  const lblHost = document.createElement('div');
  lblHost.className = 'wdd-lbl';
  lblHost.textContent = '域名';

  const inpHost = document.createElement('input');
  inpHost.className = 'wdd-inp';
  inpHost.placeholder = 'example.com';

  rowHost.append(lblHost, inpHost);

  const rowTxt = document.createElement('div');
  rowTxt.className = 'wdd-row';

  const lblTxt = document.createElement('div');
  lblTxt.className = 'wdd-lbl';
  lblTxt.textContent = 'TXT 记录值';

  const txtKV = document.createElement('div');
  txtKV.className = 'wdd-kv';

  const kvHint = document.createElement('div');
  kvHint.className = 'kv-hint';
  kvHint.textContent = 'openai-domain-verification=';

  const kvRow = document.createElement('div');
  kvRow.className = 'kv-row';

  const txtVal = document.createElement('input');
  txtVal.placeholder = 'dv-xxxxxxxx';
  txtVal.readOnly = true;

  const btnCopy = document.createElement('button');
  btnCopy.className = 'wdd-btn secondary';
  btnCopy.style.flex = '0 0 auto';
  btnCopy.textContent = '复制';

  kvRow.append(txtVal, btnCopy);
  txtKV.append(kvHint, kvRow);
  rowTxt.append(lblTxt, txtKV);

  const rowInvite = document.createElement('div');
  rowInvite.className = 'wdd-row';

  const lblInvite = document.createElement('div');
  lblInvite.className = 'wdd-lbl';
  lblInvite.textContent = '允许外部域邀请';

  const inviteWrap = document.createElement('div');
  inviteWrap.style.display='flex';
  inviteWrap.style.alignItems='center';
  inviteWrap.style.gap='.45rem';

  const btnInviteSwitch = document.createElement('button');
  btnInviteSwitch.className='wdd-switch-btn on';
  btnInviteSwitch.setAttribute('aria-pressed','true');

  const inviteStateText = document.createElement('div');
  inviteStateText.className='wdd-note';
  inviteStateText.textContent='开启';

  inviteWrap.append(btnInviteSwitch, inviteStateText);
  rowInvite.append(lblInvite, inviteWrap);

  const rowLegacy = document.createElement('div');
  rowLegacy.className = 'wdd-row wdd-legacy-row';

  const lblLegacy = document.createElement('div');
  lblLegacy.className = 'wdd-lbl';
  lblLegacy.textContent = '批量进度';

  const legacyWrap = document.createElement('div');
  legacyWrap.className = 'wdd-legacy-wrap';

  const legacyBar = document.createElement('div');
  legacyBar.className = 'wdd-legacy-bar';

  const legacyBarInner = document.createElement('div');
  legacyBarInner.className = 'wdd-legacy-bar-inner';

  legacyBar.append(legacyBarInner);

  const legacyInfo = document.createElement('div');
  legacyInfo.className = 'wdd-legacy-info';

  const legacyCount = document.createElement('div');
  legacyCount.textContent = '0/0';

  const legacyMsg = document.createElement('div');
  legacyMsg.textContent = '准备就绪';

  legacyInfo.append(legacyCount, legacyMsg);
  legacyWrap.append(legacyBar, legacyInfo);
  rowLegacy.append(lblLegacy, legacyWrap);

  const rowList = document.createElement('div');
  rowList.className = 'wdd-row';

  const lblList = document.createElement('div');
  lblList.className = 'wdd-lbl';
  lblList.textContent = '已添加域名';

  const domainList = document.createElement('div');
  domainList.className = 'wdd-list';

  rowList.append(lblList, domainList);

  const note = document.createElement('div');
  note.className = 'wdd-note';
  note.textContent = '提交域名获取 TXT，复制后到 DNS 添加记录，稍候点击“检查”。';

  const actions = document.createElement('div');
  actions.className = 'wdd-actions grid3';

  const btnSubmit = document.createElement('button');
  btnSubmit.className = 'wdd-btn';
  btnSubmit.textContent = '提交域名';

  const btnCheck = document.createElement('button');
  btnCheck.className = 'wdd-btn secondary';
  btnCheck.textContent = '检查';

  const btnRemove = document.createElement('button');
  btnRemove.className = 'wdd-btn warn';
  btnRemove.textContent = '移除域';

  actions.append(btnSubmit, btnCheck, btnRemove);

  const rowK12 = document.createElement('div');
  rowK12.className = 'wdd-row';

  const lblK12 = document.createElement('div');
  lblK12.className = 'wdd-lbl';
  lblK12.textContent = 'K12 批量创建（仅 /k12-create-workspace 可用）';

  const k12Grid = document.createElement('div');
  k12Grid.className = 'wdd-grid';

  const inpK12Count = document.createElement('input');
  inpK12Count.className = 'wdd-inp';
  inpK12Count.placeholder = '数量';
  inpK12Count.value = store.k.k12Count || '5';

  const inpK12Prefix = document.createElement('input');
  inpK12Prefix.className = 'wdd-inp';
  inpK12Prefix.placeholder = '名称前缀';
  inpK12Prefix.value = store.k.k12Prefix || 'OAI ';

  k12Grid.append(inpK12Count, inpK12Prefix);

  const k12Btns = document.createElement('div');
  k12Btns.className = 'wdd-actions grid2';

  const btnK12Run = document.createElement('button');
  btnK12Run.className = 'wdd-btn ok';
  btnK12Run.textContent = '开始创建';

  const btnLogClear = document.createElement('button');
  btnLogClear.className = 'wdd-btn secondary';
  btnLogClear.textContent = '清空日志';

  k12Btns.append(btnK12Run, btnLogClear);
  rowK12.append(lblK12, k12Grid, k12Btns);

  const rowLog = document.createElement('div');
  rowLog.className = 'wdd-row';

  const lblLog = document.createElement('div');
  lblLog.className = 'wdd-lbl';
  lblLog.textContent = '日志';

  const logBox = document.createElement('div');
  logBox.className = 'wdd-log';
  logBox.id = 'wdd-log';

  rowLog.append(lblLog, logBox);

  const status = document.createElement('div');
  status.className = 'wdd-status';
  status.textContent = '等待操作...';

  const toast = document.createElement('div');
  toast.id = 'wdd-toast';
  toast.textContent = '已复制';

  bd.append(
    rowWs,
    rowTeam,
    document.createElement('hr'),
    rowFree,
    document.createElement('hr'),
    rowHost,
    rowTxt,
    rowInvite,
    rowLegacy,
    rowList,
    note,
    actions,
    document.createElement('hr'),
    rowK12,
    rowLog,
    status
  );

  bd.querySelectorAll('hr').forEach(hr=>{ hr.className='wdd-hr'; });

  card.append(hd, bd);
  modal.appendChild(card);

  document.body.append(fab, teamFloat, modal, toast);

  function showToast(msg){
    if(msg) toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 450);
  }

  function isPanelOpen(){ return modal.classList.contains('open'); }

  function updateTeamFloatVisibility(){
    const shouldShow = (location.pathname === '/') && !isPanelOpen();
    teamFloat.style.display = shouldShow ? 'inline-flex' : 'none';
  }

  function openUI(){
    modal.style.display='flex';
    requestAnimationFrame(()=>{
      modal.classList.add('open');
      updateTeamFloatVisibility();
    });
  }

  function closeUI(){
    modal.classList.remove('open');
    setTimeout(()=>{
      modal.style.display='none';
      updateTeamFloatVisibility();
    }, 210);
  }

  fab.addEventListener('click', openUI);
  btnX.addEventListener('click', closeUI);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeUI(); });

  function setStatus(msg, kind, spin){
    status.classList.remove('ok','err');
    if(kind==='ok') status.classList.add('ok');
    if(kind==='err') status.classList.add('err');
    status.innerHTML = (spin ? `<span class="wdd-spin"></span>` : '') + (msg || '');
  }

  function log(message, type='i'){
    const line = document.createElement('div');
    line.className = type;
    const t = new Date();
    const ts = String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0')+':'+String(t.getSeconds()).padStart(2,'0');
    line.textContent = `[${ts}] ${message}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  btnLogClear.addEventListener('click', ()=>{ logBox.textContent=''; });

  function enableOps(flag){
    btnSubmit.disabled = !flag;
    btnCheck.disabled = !flag || !lastDomain?.id;
    btnRemove.disabled = !flag || !lastDomain?.id;
    btnInviteSwitch.disabled = !flag || !selected;
    btnLegacyAll.disabled = !flag || !accounts?.length;
    btnPatchMember.disabled = !flag || !selected;
    btnEnableApple.disabled = !flag || !selected;
    btnEnableLegacyCurrent.disabled = !flag || !selected;
    btnQuickCur.disabled = !flag || !selected;
    btnQuickAll.disabled = !flag || !accounts?.length;
    btnOnboardCur.disabled = !flag || !selected;
    btnOnboardAll.disabled = !flag || !accounts?.length;
    btnSeat1000n.disabled = !flag || !selected;
    btnLeaveCur.disabled = !flag || !selected;
    btnReloadDomains.disabled = !flag || !selected;
    btnCreateFree.disabled = !flag;
    btnK12Run.disabled = !flag;
    btnTeamCheckout.disabled = !flag;
    btnTeamOpen.disabled = !flag;
    btnOwnerToAdmin.disabled = !flag || !selected;
  }

  async function getAccessToken(){
    const r = await fetch('/api/auth/session', { credentials: 'include', cache: 'no-store' });
    if(!r.ok) throw new Error('获取登录会话失败');
    const j = await r.json();
    const t = j && j.accessToken;
    if(!t) throw new Error('未获取到 accessToken');
    userId = j?.user?.id || j?.user_id || userId || null;
    userEmail = (j?.user?.email || j?.email || userEmail || null);
    return t;
  }

  function decodeJwtUserId(t){
    try{
      const parts = String(t||'').split('.');
      if(parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g,'+').replace(/_/g,'/');
      const raw = atob(b64 + '==='.slice((b64.length+3)%4));
      const json = decodeURIComponent(Array.from(raw).map(c=>'%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join(''));
      const payload = JSON.parse(json);
      const auth = payload['https://api.openai.com/auth'] || {};
      return auth.user_id || payload.user_id || null;
    }catch{
      return null;
    }
  }

  async function ensureToken(force){
    const now = Date.now();
    if(!token || force || (now - tokenTs) > 4*60*1000){
      token = await getAccessToken();
      tokenTs = Date.now();
      if(!userId) userId = decodeJwtUserId(token);
    }
    return token;
  }

  async function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

  async function fetchJsonWithRetry(url, init, {retry=1, retryDelay=800, allowEmpty=true}={}){
    await ensureToken();
    let lastErr = null;
    for(let i=0;i<=retry;i++){
      try{
        const r = await fetch(url, init);
        if(r.status===401 && i<retry){
          await ensureToken(true);
          const init2 = { ...init, headers: { ...(init.headers||{}), authorization: 'Bearer '+token } };
          const r2 = await fetch(url, init2);
          return await parseResp(r2, allowEmpty);
        }
        return await parseResp(r, allowEmpty);
      }catch(e){
        lastErr = e;
        if(i<retry){ await sleep(retryDelay); continue; }
        throw e;
      }
    }
    throw lastErr || new Error('请求失败');
  }

  async function parseResp(r, allowEmpty){
    const txt = await r.text().catch(()=> '');
    let j = null;
    if(txt){
      try{ j = JSON.parse(txt); }catch{ j = null; }
    }
    if(!r.ok){
      const m = j?.error?.message || j?.message || (txt && txt.slice(0,200)) || `HTTP ${r.status}`;
      throw new Error(m);
    }
    if(j !== null) return j;
    if(allowEmpty) return {};
    throw new Error('响应解析失败');
  }

  async function copyToClipboard(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function teamConfig(){
    const name = (inpTeamName.value||'').trim() || 'OAI';
    const interval = (selTeamInterval.value||'month').trim() || 'month';
    const seats = Math.max(1, parseInt((inpTeamSeats.value||'2').trim(), 10) || 2);
    const country = (inpTeamCountry.value||'JP').trim() || 'JP';
    const currency = (inpTeamCurrency.value||'USD').trim() || 'USD';
    const promo = (inpTeamPromo.value||'team-1-month-free').trim() || 'team-1-month-free';
    store.upd({
      team_workspace_name: name,
      team_price_interval: interval,
      team_seat_quantity: seats,
      team_country: country,
      team_currency: currency,
      team_promo_campaign: promo
    });
    return { name, interval, seats, country, currency, promo };
  }

  async function createTeamCheckoutUrl({name, interval, seats, country, currency, promo}){
    const u = `/backend-api/payments/checkout`;
    const cancel_url = `https://chatgpt.com/?numSeats=${encodeURIComponent(seats)}&selectedPlan=${encodeURIComponent(interval)}&referrer=https%3A%2F%2Fauth.openai.com%2F#team-pricing-seat-selection`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'Accept':'*/*',
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`,
        'oai-language': 'zh-CN'
      },
      body: JSON.stringify({
        plan_name: 'chatgptteamplan',
        team_plan_data: {
          workspace_name: name,
          price_interval: interval,
          seat_quantity: seats
        },
        billing_details: {
          country,
          currency
        },
        cancel_url,
        promo_campaign: promo,
        checkout_ui_mode: 'redirect'
      })
    };
    const data = await fetchJsonWithRetry(u, init, {retry:1});
    const url = data?.url;
    if(!url) throw new Error('响应缺少 checkout 链接');
    return url;
  }

  async function runTeamCheckout({copy=true, from='panel'}={}){
    const cfg = teamConfig();
    setStatus('Team Checkout 生成中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      const url = await createTeamCheckoutUrl(cfg);
      if(copy){
        await copyToClipboard(url);
        showToast('已复制支付链接');
        setStatus('Team Checkout：已复制 ✅', 'ok');
      }else{
        setStatus('Team Checkout：已生成 ✅', 'ok');
      }
      log(`Team Checkout OK (${from}) seats=${cfg.seats} interval=${cfg.interval} country=${cfg.country} currency=${cfg.currency}`, 's');
      log(url, 'i');
      return url;
    }catch(e){
      setStatus(`Team Checkout 失败：${e.message||e}`, 'err');
      log(`Team Checkout FAIL (${from})：${e.message||e}`, 'e');
      throw e;
    }finally{
      enableOps(true);
    }
  }

  btnTeamCheckout.addEventListener('click', ()=>runTeamCheckout({copy:true, from:'panel'}).catch(()=>{}));
  btnTeamOpen.addEventListener('click', ()=>runTeamCheckout({copy:false, from:'panel'}).catch(()=>{}));

  teamFloat.addEventListener('click', async ()=>{
    if(teamFloat.dataset.loading === '1') return;
    teamFloat.dataset.loading = '1';
    const originalText = teamFloat.textContent;
    teamFloat.classList.remove('tm-success','tm-error');
    teamFloat.textContent = '生成中...';
    try{
      await runTeamCheckout({copy:true, from:'float'});
      teamFloat.textContent = '已复制支付链接';
      teamFloat.classList.add('tm-success');
    }catch(e){
      teamFloat.textContent = '生成失败';
      teamFloat.classList.add('tm-error');
      alert(e?.message ? e.message : String(e));
    }finally{
      setTimeout(()=>{
        teamFloat.textContent = originalText;
        teamFloat.dataset.loading = '0';
        teamFloat.classList.remove('tm-success','tm-error');
        updateTeamFloatVisibility();
      }, 2000);
    }
  });

  async function fetchAccounts(){
    const tz = new Date().getTimezoneOffset();
    const u = `/backend-api/accounts/check/v4-2023-04-27?timezone_offset_min=${encodeURIComponent(tz)}`;
    await ensureToken();
    const r = await fetch(u, { credentials:'include', cache:'no-store', headers:{ 'authorization': 'Bearer '+token, 'accept': '*/*' }});
    if(!r.ok) throw new Error('获取工作区失败');
    const j = await r.json();
    const map = j && j.accounts ? j.accounts : {};
    return Object.entries(map).map(([id, obj]) => ({ id, ...obj }));
  }

  function renderWsOptions(){
    selWs.innerHTML = '';
    accounts.forEach((it)=>{
      const o = document.createElement('option');
      const name = it.account?.name || '(未命名)';
      const role = it.account?.account_user_role || it.account?.role || '';
      o.value = it.id;
      o.textContent = role ? `${name} (${role}) — ${it.id}` : `${name} — ${it.id}`;
      selWs.appendChild(o);
    });
    const pref = store.k.sel?.account_id;
    const prefAcc = pref ? accounts.find(x => x.id === pref) : null;
    const prefNamed = !!((prefAcc?.account?.name || '').trim());

    if (prefAcc && prefNamed) {
      selWs.value = pref;
    } else {
      if (prefAcc && !prefNamed) store.upd({ sel: null });

      const firstNamed = accounts.find(x => ((x?.account?.name || '').trim()));
      if(firstNamed) selWs.value = firstNamed.id;
    }
    const cur =
      accounts.find(x=>x.id===selWs.value) ||
      accounts.find(x => ((x?.account?.name || '').trim())) ||
      accounts[0];
    setWsInfo(cur);
  }

  function setWsInfo(a){
    if(!a){
      wsId.value=''; orgId.value=''; selected=null;
      enableOps(false);
      renderDomainList([]);
      return;
    }
    wsId.value = a.account?.account_id || '';
    orgId.value = a.account?.organization_id || '';
    selected = { account_id: a.account?.account_id, organization_id: a.account?.organization_id, name: a.account?.name || '' };
    if ((selected.name || '').trim()) {
      store.upd({ sel: { account_id: a.id, organization_id: selected.organization_id, name: selected.name } });
    } else {
      store.upd({ sel: null });
    }
    enableOps(true);
    loadAllowExternal();
    loadDomains();
  }

  async function initWorkspaceList(){
    setStatus('载入工作区中...', null, true);
    try{
      await ensureToken();
      accounts = await fetchAccounts();
      accounts = accounts.filter(it=>{
        const name = (it.account?.name || '').toLowerCase();
        const id = String(it.id || '').toLowerCase();
        return name !== 'default' && id !== 'default';
      });
      accounts.sort((a,b)=>{
        const na = (a?.account?.name || '').trim();
        const nb = (b?.account?.name || '').trim();
        const au = !na; // unnamed?
        const bu = !nb;
        if(au !== bu) return au ? 1 : -1; // unnamed 放后面
        const cmp = na.localeCompare(nb, 'zh-CN', { numeric:true, sensitivity:'base' });
        if(cmp) return cmp;
        return String(a.id||'').localeCompare(String(b.id||''));
      });

      if(!accounts.length) throw new Error('无可用工作区');
      renderWsOptions();
      setStatus('已载入工作区', null);
      log(`workspace 已加载：${accounts.length} 个`, 's');
    }catch(e){
      setStatus(String(e.message||e), 'err');
      log(`workspace 加载失败：${e.message||e}`, 'e');
      enableOps(false);
    }
  }

  function legacySetBar(p){
    const v = Math.max(0, Math.min(100, typeof p==='number'?p:0));
    legacyBarInner.style.width = v + '%';
  }

  function legacyShowRow(){ rowLegacy.classList.add('active'); }

  function legacyHideRowLater(ms){
    if(legacyHideTimer) clearTimeout(legacyHideTimer);
    legacyHideTimer = setTimeout(()=>{ rowLegacy.classList.remove('active'); }, ms);
  }

  function legacyStart(total){
    if(legacyHideTimer) { clearTimeout(legacyHideTimer); legacyHideTimer=null; }
    legacyCount.textContent = total ? `0/${total}` : '0/0';
    legacyMsg.textContent = total ? '开始...' : '无可处理';
    legacySetBar(0);
    legacyShowRow();
  }

  function getAccountName(a){
    return (a && a.account && a.account.name) || a?.id || '未知工作区';
  }

  async function updateBetaFeature(accountId, feature, value){
    const u = `/backend-api/accounts/${encodeURIComponent(accountId)}/beta_features`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': accountId
      },
      body: JSON.stringify({ feature, value: !!value })
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  async function enableLegacyAllWorkspaces(){
    if(!accounts?.length){
      setStatus('没有可用工作区', 'err');
      return;
    }
    const workspaces = accounts.filter(a=>a?.account?.account_id);
    if(!workspaces.length){
      setStatus('没有可用工作区', 'err');
      legacyStart(0);
      legacyHideRowLater(2000);
      return;
    }
    btnLegacyAll.disabled = true;
    enableOps(false);
    setStatus('批量开启 Legacy...', null, true);
    legacyStart(workspaces.length);
    log('开始批量开启 legacy_models', 'i');
    let processed = 0, ok = 0, fail = 0;
    for(const a of workspaces){
      const accountId = a.account.account_id;
      const name = getAccountName(a);
      try{
        await updateBetaFeature(accountId, 'legacy_models', true);
        ok++;
        log(`Legacy OK: ${name}`, 's');
      }catch(e){
        fail++;
        log(`Legacy FAIL: ${name} (${e.message||e})`, 'e');
      }finally{
        processed++;
        legacyCount.textContent = `${processed}/${workspaces.length}`;
        legacyMsg.textContent = `完成 ${processed}/${workspaces.length}`;
        legacySetBar(processed/workspaces.length*100);
      }
    }
    enableOps(true);
    btnLegacyAll.disabled = false;
    legacyMsg.textContent = `完成：成功 ${ok}，失败 ${fail}`;
    legacySetBar(100);
    legacyHideRowLater(5000);
    setStatus(fail ? `Legacy：成功 ${ok}，失败 ${fail}` : `Legacy：全部成功（${ok}）`, fail ? 'err' : 'ok');
  }

  function parseDomainsPayload(j){
    const raw = j?.domains || j?.identity?.domains || j?.domain_whitelist || j?.domain_list || [];
    return (Array.isArray(raw)?raw:[]).map(d=>({
      id: d.id || d.domain_id || d.uuid || null,
      hostname: d.hostname || d.domain || d.name || '',
      status: d.status || (typeof d.verified==='boolean' ? (d.verified?'verified':'unverified') : (d.is_verified?'verified':'unverified')),
      token: d.dns_verification_token || d.token || d.dns_token || ''
    })).filter(x=>x.hostname);
  }

  function renderDomainList(arr){
    domainList.innerHTML = '';
    if(!arr.length){
      const empty=document.createElement('div');
      empty.className='wdd-note';
      empty.textContent='暂无域名';
      domainList.appendChild(empty);
      return;
    }
    arr.forEach(d=>{
      const it = document.createElement('div'); it.className='wdd-item';
      const host = document.createElement('div'); host.className='wdd-host'; host.textContent = d.hostname;
      const pill = document.createElement('div'); pill.className='wdd-pill';
      const s = String(d.status||'').toLowerCase();
      if(s==='verified') pill.classList.add('ok');
      else if(s==='pending' || s==='unverified') pill.classList.add('wait');
      else pill.classList.add('err');
      pill.textContent = s || 'unknown';
      it.append(host, pill);
      it.addEventListener('click', ()=>{
        lastDomain = { id: d.id || null, hostname: d.hostname || '', token: d.token || '' };
        txtVal.value = lastDomain.token || '';
        inpHost.value = lastDomain.hostname || '';
        store.upd({ lastDomain, lastHost: inpHost.value });
        btnCheck.disabled = !lastDomain?.id;
        btnRemove.disabled = !lastDomain?.id;
      });
      domainList.appendChild(it);
    });
  }

  async function fetchIdentity(){
    if(!selected) throw new Error('未选择工作区');
    const u = `/backend-api/accounts/${encodeURIComponent(selected.account_id)}/identity`;
    const init = {
      credentials:'include',
      headers:{
        'accept':'*/*',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': selected.account_id
      }
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  async function loadDomains(force){
    if(!selected) return;
    const key = selected.account_id;
    if(!force && domainsCache.has(key) && (Date.now()-domainsCache.get(key).ts<30*1000)){
      renderDomainList(domainsCache.get(key).list);
      return;
    }
    setStatus('加载域名列表中...', null, true);
    try{
      const j = await fetchIdentity();
      const list = parseDomainsPayload(j);
      domainsCache.set(key, { ts: Date.now(), list });
      renderDomainList(list);
      setStatus('域名列表已更新', null);
    }catch(e){
      setStatus(String(e.message||e), 'err');
      renderDomainList([]);
    }
  }

  async function getAllowExternalSetting(){
    if(!selected) throw new Error('未选择工作区');
    const u = `/backend-api/accounts/${encodeURIComponent(selected.account_id)}/settings`;
    const init = {
      credentials:'include',
      headers:{
        'accept':'*/*',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': selected.account_id
      }
    };
    const j = await fetchJsonWithRetry(u, init, {retry:1});
    return j.allow_external_domain_invites;
  }

  async function updateAllowExternalSetting(val){
    if(!selected) throw new Error('未选择工作区');
    const u = `/backend-api/accounts/${encodeURIComponent(selected.account_id)}/settings/allow_external_domain_invites`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': selected.account_id
      },
      body: JSON.stringify({ value: !!val })
    };
    const j = await fetchJsonWithRetry(u, init, {retry:1});
    return j.allow_external_domain_invites;
  }

  async function loadAllowExternal(){
    btnInviteSwitch.disabled = true;
    try{
      await ensureToken();
      const val = await getAllowExternalSetting();
      setInviteUI(typeof val==='boolean' ? val : true);
    }catch{
      setInviteUI(true);
    }
    btnInviteSwitch.disabled = false;
  }

  function setInviteUI(flag){
    inviteState = !!flag;
    if(inviteState){
      btnInviteSwitch.classList.add('on');
      btnInviteSwitch.setAttribute('aria-pressed','true');
      inviteStateText.textContent='开启';
    }else{
      btnInviteSwitch.classList.remove('on');
      btnInviteSwitch.setAttribute('aria-pressed','false');
      inviteStateText.textContent='关闭';
    }
  }

  btnInviteSwitch.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    const prev = inviteState;
    const next = !inviteState;
    btnInviteSwitch.disabled = true;
    setStatus('更新设置中...', null, true);
    try{
      await ensureToken();
      const serverVal = await updateAllowExternalSetting(next);
      setInviteUI(serverVal);
      setStatus(serverVal ? '已开启外部域邀请' : '已关闭外部域邀请', 'ok');
      log(`allow_external_domain_invites=${serverVal}`, 's');
    }catch(e){
      setStatus(String(e.message||e), 'err');
      setInviteUI(prev);
      log(`更新 allow_external_domain_invites 失败：${e.message||e}`, 'e');
    }
    btnInviteSwitch.disabled = false;
  });

  btnCopy.addEventListener('click', async ()=>{
    const v = txtVal.value ? ('openai-domain-verification='+txtVal.value) : '';
    if(!v){ setStatus('无TXT可复制', 'err'); return; }
    try{ await copyToClipboard(v); showToast('已复制TXT'); }catch{ setStatus('复制失败', 'err'); }
  });

  function hostValid(h){ return /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(h); }

  async function createDomain(hostname){
    if(!selected) throw new Error('未选择工作区');
    const u = `/backend-api/accounts/${encodeURIComponent(selected.account_id)}/domains`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': selected.account_id
      },
      body: JSON.stringify({ hostname })
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  async function checkDomain(domainId){
    if(!selected) throw new Error('未选择工作区');
    const u = `/backend-api/accounts/${encodeURIComponent(selected.account_id)}/domains/${encodeURIComponent(domainId)}/check`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': selected.account_id
      }
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  async function removeDomain(domainId){
    if(!selected) throw new Error('未选择工作区');
    const u = `/backend-api/accounts/${encodeURIComponent(selected.account_id)}/domains/${encodeURIComponent(domainId)}`;
    const init = {
      method:'DELETE',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': selected.account_id
      }
    };
    await fetchJsonWithRetry(u, init, {retry:1});
    return true;
  }

  async function onSubmit(){
    const host = (inpHost.value||'').trim();
    if(!host){ setStatus('请填写域名', 'err'); return; }
    if(!hostValid(host)){ setStatus('域名格式不正确', 'err'); return; }
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    setStatus('提交中...', null, true);
    enableOps(false);
    try{
      const j = await createDomain(host);
      lastDomain = { id: j.id, hostname: j.hostname, token: j.dns_verification_token };
      txtVal.value = j.dns_verification_token || '';
      store.upd({ lastDomain, lastHost: host });
      btnCheck.disabled = false; btnRemove.disabled = false;
      const v = txtVal.value ? ('openai-domain-verification='+txtVal.value) : '';
      if(v){ try{ await copyToClipboard(v); showToast('已复制TXT'); }catch{} }
      setStatus('已获取TXT，请到DNS添加记录后再“检查”', null);
      log(`提交域名：${host}`, 's');
      await loadDomains(true);
    }catch(e){
      setStatus(String(e.message||e), 'err');
      log(`提交域名失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  }

  btnSubmit.addEventListener('click', onSubmit);
  inpHost.addEventListener('keydown', e=>{ if(e.key==='Enter') onSubmit(); });

  btnCheck.addEventListener('click', async ()=>{
    if(!lastDomain?.id){ setStatus('没有可检查的域', 'err'); return; }
    setStatus('检查中...', null, true);
    enableOps(false);
    try{
      const j = await checkDomain(lastDomain.id);
      if(j.status==='verified'){
        setStatus('🎉 域名已验证成功！', 'ok');
        log(`域名验证成功：${lastDomain.hostname}`, 's');
      }else{
        const s = j.status ? String(j.status) : '未验证';
        setStatus(`未验证：当前状态 ${s}`, 'err');
        log(`域名未验证：${lastDomain.hostname} (${s})`, 'e');
      }
      await loadDomains(true);
    }catch(e){
      setStatus(String(e.message||e), 'err');
      log(`检查失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  btnRemove.addEventListener('click', async ()=>{
    if(!lastDomain?.id){ setStatus('没有可移除的域', 'err'); return; }
    setStatus('移除中...', null, true);
    enableOps(false);
    try{
      await removeDomain(lastDomain.id);
      log(`移除域名：${lastDomain.hostname}`, 's');
      lastDomain=null; txtVal.value=''; store.upd({ lastDomain:null });
      btnCheck.disabled = true; btnRemove.disabled = true;
      setStatus('已移除该域', null);
      await loadDomains(true);
    }catch(e){
      setStatus(String(e.message||e), 'err');
      log(`移除失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  async function patchMemberRolePermissions(){
    if(!selected) throw new Error('未选择工作区');
    const accountId = selected.account_id;
    const u = `/backend-api/rbac/workspace/${encodeURIComponent(accountId)}/roles/role-workspace-member__chatgpt-workspace__${encodeURIComponent(accountId)}_overridden?account_id=${encodeURIComponent(accountId)}`;
    const init = {
      method:'PATCH',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': accountId
      },
      body: JSON.stringify({ role_name:"member", description:"ChatGPT workspace member role", permissions: PERMISSIONS_MEMBER })
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  btnPatchMember.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    setStatus('更新 Member 权限中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      await patchMemberRolePermissions();
      setStatus('已更新 Member 角色权限', 'ok');
      log('已更新 Member 权限', 's');
      showToast('已更新权限');
    }catch(e){
      setStatus(String(e.message||e), 'err');
      log(`更新 Member 权限失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  btnEnableApple.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    setStatus('开启 Apple 客户端中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      await updateBetaFeature(selected.account_id, 'client_application_apple', true);
      setStatus('已开启 client_application_apple', 'ok');
      log('已开启 client_application_apple', 's');
      showToast('已开启 Apple');
    }catch(e){
      setStatus(String(e.message||e), 'err');
      log(`开启 Apple 失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  btnEnableLegacyCurrent.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    setStatus('开启 Legacy(当前) 中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      await updateBetaFeature(selected.account_id, 'legacy_models', true);
      setStatus('已开启 legacy_models(当前)', 'ok');
      log('已开启 legacy_models(当前)', 's');
      showToast('已开启 Legacy');
    }catch(e){
      setStatus(String(e.message||e), 'err');
      log(`开启 Legacy(当前) 失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  btnLegacyAll.addEventListener('click', ()=>{
    if(!accounts?.length){ setStatus('请先载入工作区', 'err'); return; }
    enableLegacyAllWorkspaces();
  });

  async function requestSetting(accountId, settingKey, payloadObj){
    const url = `/backend-api/accounts/${encodeURIComponent(accountId)}/settings/${encodeURIComponent(settingKey)}`;
    const body = JSON.stringify(payloadObj);
    const doFetch = async (method)=> fetchJsonWithRetry(url, {
      method,
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': accountId
      },
      body
    }, {retry:1});
    try{
      return await doFetch('POST');
    }catch(e){
      const msg = String(e.message||e);
      if(/405|404/.test(msg)) return doFetch('PATCH');
      throw e;
    }
  }

  const QUICK_SETTINGS = [
    { key:'workspace_discoverable', body:{ value:true, public_display_name:null, use_workspace_name_for_discovery:true } },
    { key:'auto_accept_requests', body:{ value:true } },
    { key:'auto_provision', body:{ value:true } }
  ];

  async function runQuickSettingsFor(accountId){
    for(const it of QUICK_SETTINGS) await requestSetting(accountId, it.key, it.body);
  }

  btnQuickCur.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    setStatus('Quick(当前) 执行中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      await runQuickSettingsFor(selected.account_id);
      setStatus('Quick(当前) 完成 ✅', 'ok');
      log('Quick(当前) 完成', 's');
    }catch(e){
      setStatus(`Quick 失败：${e.message||e}`, 'err');
      log(`Quick(当前) 失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  btnQuickAll.addEventListener('click', async ()=>{
    if(!accounts?.length){ setStatus('请先载入工作区', 'err'); return; }
    setStatus('Quick(全部) 执行中...', null, true);
    enableOps(false);
    legacyStart(accounts.length);
    log('Quick(全部) 开始', 'i');
    let processed=0, ok=0, fail=0;
    for(const a of accounts){
      const accountId = a.account?.account_id;
      if(!accountId) continue;
      try{
        await ensureToken();
        await runQuickSettingsFor(accountId);
        ok++;
        log(`Quick OK: ${getAccountName(a)}`, 's');
      }catch(e){
        fail++;
        log(`Quick FAIL: ${getAccountName(a)} (${e.message||e})`, 'e');
      }finally{
        processed++;
        legacyCount.textContent = `${processed}/${accounts.length}`;
        legacyMsg.textContent = `Quick 全部：${processed}/${accounts.length}`;
        legacySetBar(processed/accounts.length*100);
      }
    }
    legacyMsg.textContent = `Quick 完成：成功 ${ok}，失败 ${fail}`;
    legacySetBar(100);
    legacyHideRowLater(5000);
    setStatus(fail ? `Quick 全部：成功 ${ok}，失败 ${fail}` : `Quick 全部：全部成功（${ok}）`, fail ? 'err' : 'ok');
    enableOps(true);
  });

  async function markOnboardingViewed(accountId){
    const announcements = [
      'oai/apps/hasSeenOnboarding',
      'oai/apps/hasSeenOnboardingFlow', // 新增
    ];

    for(const ann of announcements){
      const u = `/backend-api/settings/announcement_viewed?announcement_id=${encodeURIComponent(ann)}`;
      const init = {
        method:'POST',
        credentials:'include',
        headers:{
          'accept':'*/*',
          'authorization':'Bearer ' + token,
          ...(accountId ? { 'chatgpt-account-id': accountId } : {}) // 工作空间才加
        }
      };
      await fetchJsonWithRetry(u, init, {retry:1});
    }
    return true;
  }

  btnOnboardCur.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    setStatus('Onboarding(当前) 标记中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      await markOnboardingViewed(selected.account_id);
      setStatus('Onboarding(当前) 已标记', 'ok');
      log('Onboarding(当前) 已标记', 's');
    }catch(e){
      setStatus(`Onboarding 失败：${e.message||e}`, 'err');
      log(`Onboarding(当前) 失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  btnOnboardAll.addEventListener('click', async ()=>{
    if(!accounts?.length){ setStatus('请先载入工作区', 'err'); return; }
    setStatus('Onboarding(全部) 标记中...', null, true);
    enableOps(false);
    legacyStart(accounts.length);
    log('Onboarding(全部) 开始', 'i');
    let processed=0, ok=0, fail=0;
    for(const a of accounts){
      const accountId = a.account?.account_id;
      if(!accountId) continue;
      try{
        await ensureToken();
        await markOnboardingViewed(accountId);
        ok++;
        log(`Onboarding OK: ${getAccountName(a)}`, 's');
      }catch(e){
        fail++;
        log(`Onboarding FAIL: ${getAccountName(a)} (${e.message||e})`, 'e');
      }finally{
        processed++;
        legacyCount.textContent = `${processed}/${accounts.length}`;
        legacyMsg.textContent = `Onboarding 全部：${processed}/${accounts.length}`;
        legacySetBar(processed/accounts.length*100);
      }
    }
    legacyMsg.textContent = `Onboarding 完成：成功 ${ok}，失败 ${fail}`;
    legacySetBar(100);
    legacyHideRowLater(5000);
    setStatus(fail ? `Onboarding 全部：成功 ${ok}，失败 ${fail}` : `Onboarding 全部：全部成功（${ok}）`, fail ? 'err' : 'ok');
    enableOps(true);
  });

  async function createFreemiumWorkspace(name){
    const u = `/backend-api/accounts/create_freemium_workspace`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token
      },
      body: JSON.stringify({ workspace_name: name })
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  btnCreateFree.addEventListener('click', async ()=>{
    const name = (inpFreeName.value||'').trim();
    if(!name){ setStatus('workspace_name 不能为空', 'err'); return; }
    store.upd({ freeName: name });
    setStatus('创建 Freemium 中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      const res = await createFreemiumWorkspace(name);
      log(`Freemium 创建请求已发送：${name}`, 's');
      setStatus(`已创建：${name}`, 'ok');
      showToast('已创建');
      await initWorkspaceList();
      if(res?.account_id){
        const hit = accounts.find(a=>a?.account?.account_id===res.account_id);
        if(hit){ selWs.value = hit.id; setWsInfo(hit); }
      }
    }catch(e){
      setStatus(`创建失败：${e.message||e}`, 'err');
      log(`Freemium 创建失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  async function fetchSeatsEntitled(accountId){
    const u = `/backend-api/subscriptions?account_id=${encodeURIComponent(accountId)}`;
    const init = {
      method:'GET',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': accountId
      }
    };
    const j = await fetchJsonWithRetry(u, init, {retry:1});
    const seats = typeof j?.seats_entitled === 'number' ? j.seats_entitled : null;
    if(seats == null) throw new Error('未获取到 seats_entitled');
    return seats;
  }

  async function updateSeats(accountId, updatedSeats){
    const u = `/backend-api/subscriptions/update`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': accountId
      },
      body: JSON.stringify({ account_id: accountId, updated_seats: updatedSeats })
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  const SEAT_1000_TO_N_DELAY_MS = 11;
  const SEAT_UI_UNLOCK_DELAY_MS = 80;
  btnSeat1000n.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    setStatus('SEAT 1000→n 执行中...', null, true);
    enableOps(false);

    let scheduled = false;

    try{
      await ensureToken();

      const seats = await fetchSeatsEntitled(selected.account_id);
      const target = seats + 1;

      if(target > 5){
        setStatus(`不执行：seats_entitled=${seats}，目标=${target} > 5`, 'err');
        log(`SEAT 不执行：seats_entitled=${seats}，目标=${target} > 5`, 'e');
        return;
      }

      const accountId = selected.account_id;
      log(`SEAT 当前 seats_entitled=${seats}，目标 n=${target}`, 'i');
      updateSeats(accountId, 1000)
        .then(()=>log(`SEAT(1) OK: updated_seats=1000`, 's'))
        .catch(e=>log(`SEAT(1) FAIL: updated_seats=1000 (${e.message||e})`, 'e'));

      setTimeout(() => {
        updateSeats(accountId, target)
          .then(()=>log(`SEAT(2) OK: updated_seats=${target}`, 's'))
          .catch(e=>log(`SEAT(2) FAIL: updated_seats=${target} (${e.message||e})`, 'e'));
      }, SEAT_1000_TO_N_DELAY_MS);

      scheduled = true;

      setStatus(`已触发：1000 → ${target}`, 'ok');
      log(`SEAT 已触发：1000 → ${target}（timer=${SEAT_1000_TO_N_DELAY_MS}ms）`, 's');

    }catch(e){
      setStatus(`SEAT 失败：${e.message||e}`, 'err');
      log(`SEAT 失败：${e.message||e}`, 'e');
    }finally{
      if(scheduled){
        setTimeout(()=>enableOps(true), SEAT_UI_UNLOCK_DELAY_MS);
      }else{
        enableOps(true);
      }
    }
  });

  async function leaveWorkspace(accountId){
    await ensureToken();
    if(!userId) userId = decodeJwtUserId(token);
    if(!userId) throw new Error('未获取到 userId');
    const u = `/backend-api/accounts/${encodeURIComponent(accountId)}/users/${encodeURIComponent(userId)}`;
    const init = {
      method:'DELETE',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'authorization':'Bearer '+token,
        'chatgpt-account-id': accountId
      }
    };
    return fetchJsonWithRetry(u, init, {retry:1, allowEmpty:true});
  }

  async function fetchAccountUsersPage(accountId, offset=0, limit=25){
    const u = `/backend-api/accounts/${encodeURIComponent(accountId)}/users?offset=${encodeURIComponent(offset)}&limit=${encodeURIComponent(limit)}&query=`;
    const init = {
      method:'GET',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'authorization':'Bearer ' + token,
        'chatgpt-account-id': accountId
      }
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  async function findMyWorkspaceUser(accountId){
    const limit = 25;
    let offset = 0;

    const email = (userEmail || '').trim().toLowerCase();
    const uid = (userId || '').trim();

    for(let page=0; page<50; page++){
      const j = await fetchAccountUsersPage(accountId, offset, limit);
      const items = Array.isArray(j?.items) ? j.items : [];
      if(!items.length) break;

      let me = null;
      if(email) me = items.find(x => (x?.email || '').toLowerCase() === email);
      if(!me && uid) me = items.find(x => x?.id === uid || x?.account_user_id?.startsWith(uid + '__'));

      if(me) return me;

      offset += limit;
      if(items.length < limit) break;
    }
    return null;
  }

  async function patchAccountUserRole(accountId, targetUserId, role){
    const u = `/backend-api/accounts/${encodeURIComponent(accountId)}/users/${encodeURIComponent(targetUserId)}`;
    const init = {
      method:'PATCH',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer ' + token,
        'chatgpt-account-id': accountId
      },
      body: JSON.stringify({ role })
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  btnOwnerToAdmin.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }

    setStatus('查询当前用户角色中...', null, true);
    enableOps(false);

    try{
      await ensureToken();

      if(!userEmail){
        log('警告：未获取到 userEmail，将尝试用 userId 匹配', 'e');
      }

      const accountId = selected.account_id;
      const wsName = selected.name || accountId;

      const me = await findMyWorkspaceUser(accountId);
      if(!me){
        setStatus('未在该工作区 users 列表中找到当前用户（可能需要更高 limit 或权限不足）', 'err');
        log(`Owner→Admin：未找到当前用户。email=${userEmail||'null'} userId=${userId||'null'}`, 'e');
        return;
      }

      const curRole = me.role || 'unknown';
      const emailShow = me.email || userEmail || '(unknown email)';

      if(curRole === 'account-admin'){
        setStatus('当前已是 account-admin，无需修改', 'ok');
        log(`Owner→Admin：无需修改（${emailShow} 已是 account-admin）`, 's');
        return;
      }

      const ok = window.confirm(
        `工作区：${wsName}\n` +
        `账号：${emailShow}\n` +
        `当前角色：${curRole}\n\n` +
        `是否将该账号角色修改为：account-admin ？\n` +
        `（注意：若你当前是 account-owner，这会把 owner 降为 admin）`
      );
      if(!ok){
        setStatus('已取消', null);
        log('Owner→Admin：用户取消', 'i');
        return;
      }

      setStatus('修改角色中...', null, true);
      const res = await patchAccountUserRole(accountId, me.id, 'account-admin');

      if(res?.success === true){
        setStatus('修改成功：account-admin ✅', 'ok');
        log(`Owner→Admin：成功 ${emailShow} -> account-admin`, 's');
        showToast('已改为 admin');
      }else{
        setStatus('请求已完成（未返回 success 字段）', 'ok');
        log(`Owner→Admin：完成（响应=${JSON.stringify(res||{})}）`, 's');
        showToast('已提交修改');
      }

    }catch(e){
      setStatus(`Owner→Admin 失败：${e.message||e}`, 'err');
      log(`Owner→Admin FAIL：${e.message||e}`, 'e');
    }finally{
      enableOps(true);
    }
  });

  btnLeaveCur.addEventListener('click', async ()=>{
    if(!selected){ setStatus('请选择工作区', 'err'); return; }
    const name = selected.name || selected.account_id;
    const ok = window.confirm(`确定退出工作区？\n${name}\n\n将对自己执行 DELETE /accounts/{accountId}/users/{userId}`);
    if(!ok) return;
    setStatus('退出中...', null, true);
    enableOps(false);
    try{
      await leaveWorkspace(selected.account_id);
      setStatus('退出请求已发送（建议刷新页面）', 'ok');
      log(`已退出：${name}`, 's');
      await initWorkspaceList();
    }catch(e){
      setStatus(`退出失败：${e.message||e}`, 'err');
      log(`退出失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  });

  async function createK12Workspace(name){
    const u = `/backend-api/accounts/create_workspace_without_subscription`;
    const init = {
      method:'POST',
      credentials:'include',
      headers:{
        'accept':'*/*',
        'content-type':'application/json',
        'authorization':'Bearer '+token
      },
      body: JSON.stringify({ workspace_name:name, agreed_to_dpa:true, plan_type:'k12' })
    };
    return fetchJsonWithRetry(u, init, {retry:1});
  }

  async function runK12Batch(){
    if(location.pathname !== '/k12-create-workspace'){
      setStatus('仅 /k12-create-workspace 可用', 'err');
      return;
    }
    const count = parseInt((inpK12Count.value||'').trim(), 10);
    const prefix = (inpK12Prefix.value||'').trim();
    store.upd({ k12Count: String(count||''), k12Prefix: prefix });
    if(!Number.isFinite(count) || count<=0){ setStatus('K12 数量无效', 'err'); return; }
    if(!prefix){ setStatus('K12 名称前缀不能为空', 'err'); return; }
    setStatus('K12 批量创建中...', null, true);
    enableOps(false);
    try{
      await ensureToken();
      const names = Array.from({length:count}, (_,i)=> `${prefix}${i+1}`);
      let ok=0, fail=0;
      const concurrency = 3;
      let idx = 0;
      log(`K12 批量开始：${count} 个`, 'i');
      async function worker(){
        while(idx < names.length){
          const i = idx++;
          const name = names[i];
          try{
            await createK12Workspace(name);
            ok++;
            log(`K12 OK: ${name}`, 's');
          }catch(e){
            fail++;
            log(`K12 FAIL: ${name} (${e.message||e})`, 'e');
          }
        }
      }
      const workers = Array.from({length:Math.min(concurrency, names.length)}, ()=>worker());
      await Promise.all(workers);
      setStatus(fail ? `K12 完成：成功 ${ok}，失败 ${fail}` : `K12 完成：全部成功（${ok}）`, fail ? 'err' : 'ok');
      log(`K12 完成：成功 ${ok}，失败 ${fail}`, fail ? 'e' : 's');
    }catch(e){
      setStatus(`K12 失败：${e.message||e}`, 'err');
      log(`K12 失败：${e.message||e}`, 'e');
    }
    enableOps(true);
  }

  btnK12Run.addEventListener('click', runK12Batch);

  selWs.addEventListener('change', ()=>{
    const cur = accounts.find(x=>x.id===selWs.value);
    setWsInfo(cur);
  });

  btnRefresh.addEventListener('click', initWorkspaceList);
  btnReloadDomains.addEventListener('click', ()=>{ if(selected) loadDomains(true); });

  function hydrate(){
    const s = store.k;
    if(s.lastHost) inpHost.value = s.lastHost;
    if(s.lastDomain){
      lastDomain = s.lastDomain;
      if(lastDomain?.token) txtVal.value = lastDomain.token;
    }
    btnCheck.disabled = !lastDomain?.id;
    btnRemove.disabled = !lastDomain?.id;
  }

  function applyK12Enabled(){
    const ok = location.pathname === '/k12-create-workspace';
    btnK12Run.disabled = !ok;
    lblK12.textContent = ok ? 'K12 批量创建' : 'K12 批量创建（仅 /k12-create-workspace 可用）';
  }

  function hookHistory(){
    const _ps = history.pushState;
    const _rs = history.replaceState;
    history.pushState = function(){
      const r = _ps.apply(this, arguments);
      window.dispatchEvent(new Event('wdd:locationchange'));
      return r;
    };
    history.replaceState = function(){
      const r = _rs.apply(this, arguments);
      window.dispatchEvent(new Event('wdd:locationchange'));
      return r;
    };
    window.addEventListener('popstate', ()=>window.dispatchEvent(new Event('wdd:locationchange')));
    window.addEventListener('wdd:locationchange', ()=>{
      applyK12Enabled();
      updateTeamFloatVisibility();
    });
  }

  function bindTeamInputs(){
    const onChange = ()=>teamConfig();
    inpTeamName.addEventListener('change', onChange);
    selTeamInterval.addEventListener('change', onChange);
    inpTeamSeats.addEventListener('change', onChange);
    inpTeamCountry.addEventListener('change', onChange);
    inpTeamCurrency.addEventListener('change', onChange);
    inpTeamPromo.addEventListener('change', onChange);
  }

  (function boot(){
    enableOps(false);
    hydrate();
    hookHistory();
    bindTeamInputs();
    applyK12Enabled();
    updateTeamFloatVisibility();
    initWorkspaceList();
    setStatus('就绪', null);
    log('面板已加载', 'i');
  })();
})();