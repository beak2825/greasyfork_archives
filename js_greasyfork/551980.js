// ==UserScript==
// @name         FMP Training Saver + Player Increases (robust)
// @namespace    fmp/tools
// @version      3.3
// @author       you
// @description  Save training increases from Training page; show last-session increases on Player page inside ratings card.
// @match        https://footballmanagerproject.com/Team/Training*
// @match        https://footballmanagerproject.com/Team/Player*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551980/FMP%20Training%20Saver%20%2B%20Player%20Increases%20%28robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551980/FMP%20Training%20Saver%20%2B%20Player%20Increases%20%28robust%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /************ أدوات مساعدة ************/
  const STORE_KEY = 'FMP_TRAIN_INCS_V3';
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const log = (...a) => console.log('[FMP]', ...a);
  const SKILLS = ['Sta','Pac','Acc','Mar','Tac','Pos','Pas','Cro','Tec','Hea','Fin','Lon'];

  const norm = (s='') =>
    (s || '')
      .replace(/\(U\d+\)|\(U18\)|U18|U23|U\d+/gi, '')   // شيل علامات الفئات
      .replace(/\b[A-Z]{2,}\d*\b/g, '')                // شيل الاختصارات الملزوقة بالاسم (إن وجدت)
      .replace(/[^\p{L}\p{N}\s'-]+/gu, '')             // رموز
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const loadDB = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
    catch { return {}; }
  };
  const saveDB = (db) => localStorage.setItem(STORE_KEY, JSON.stringify(db));

  // عدّ النِّقاط داخل خلية مهارة (بأنماط متعددة)
  function countDotsRobust(td) {
    // النمط القياسي
    let n = td.querySelectorAll('div.trainingh.pl').length;
    if (n) return n;

    // بعض السيرفرات بتطلعها بدون .pl
    n = td.querySelectorAll('div.trainingh').length;
    if (n) return n;

    // fallback: لو فيه divs صغيرة للنِّقاط
    n = Array.from(td.children).filter(el => {
      const st = (el.getAttribute('style') || '').toLowerCase();
      return st.includes('width') && st.includes('px') && st.includes('height') && st.includes('px');
    }).length;
    if (n) return n;

    // fallback أخير: لو النص به + أو • أو مكرر
    const html = td.innerHTML || '';
    const plusGuess = (html.match(/\+/g) || []).length;
    if (plusGuess) return plusGuess;

    return 0;
  }

  // حاول التقاط جدول اللاعبين بطرق متعددة
  function findPlayerTable() {
    // 1) أي جدول فيه خلايا sk.right
    let t = $$('table').find(x => x.querySelector('tbody tr td.sk.right'));
    if (t) return t;

    // 2) جدول رئيسي class قائمة
    t = $$('table').find(x => /list|hover|comp|display/i.test(x.className) && x.tHead);
    if (t) return t;

    // 3) fallback: أكبر جدول مليان أرقام
    const best = $$( 'table' )
      .map(tbl => ({ tbl, score: ((tbl.textContent||'').match(/\b\d{1,2}\b/g)||[]).length }))
      .sort((a,b)=>b.score-a.score)[0];
    if (best && best.score > 150) return best.tbl;

    return null;
  }

  /************ الماسح على صفحة Training ************/
  function scanTraining() {
    const tbl = findPlayerTable();
    if (!tbl) { log('No player table yet'); return false; }

    const heads = $$('thead th', tbl).map(th => (th.textContent||'').trim());
    // موقع أول مهارة
    let firstSkillIdx = heads.findIndex(h => /^Sta$/i.test(h));
    if (firstSkillIdx < 0) {
      const firstRowSkills = $$('tbody tr td.sk.right', tbl);
      if (firstRowSkills.length >= 12) {
        const firstSkillTd = firstRowSkills[0];
        firstSkillIdx = Array.from(firstSkillTd.parentElement.children).indexOf(firstSkillTd);
      }
    }
    if (firstSkillIdx < 0) firstSkillIdx = 3; // تقدير معقول

    const skillIdxs = [...Array(12).keys()].map(i => firstSkillIdx + i);
    const idxTraining = heads.findIndex(h => /Training/i.test(h));

    const db = loadDB();
    let saved = 0;

    $$('tbody tr', tbl).forEach(tr => {
      const tds = Array.from(tr.children);

      // اسم اللاعب
      let nameCell = tds.find(td => /Team\/Player/i.test(td.innerHTML)) || tds[2] || tds[1];
      if (!nameCell)
        nameCell = tds.slice(0,6).sort((a,b) => (b.textContent||'').length - (a.textContent||'').length)[0];

      const displayName =
        (nameCell?.innerText || nameCell?.textContent || '')
          .replace(/^\d+\.\s*/,'')
          .replace(/\s+/g,' ')
          .trim();

      const key = norm(displayName);
      if (!key) return;

      // pid
      const a = nameCell.querySelector('a[href*="/Team/Player?id="]');
      const pid = a ? (new URL(a.href, location.href)).searchParams.get('id') : '';

      // الزيادات
      const incs = [];
      skillIdxs.forEach((ci, i) => {
        const td = tds[ci];
        if (!td) return;
        const base = parseInt((td.innerText||'').match(/\d+/)?.[0]||'', 10);
        const inc  = countDotsRobust(td);
        if (Number.isFinite(base) && inc > 0) {
          incs.push({ skill: SKILLS[i] || `S${i+1}`, inc, base });
        }
      });

      const trainingTxt = idxTraining >= 0
        ? (tds[idxTraining]?.innerText || tds[idxTraining]?.textContent || '').trim()
        : '';

      if (!db[key]) db[key] = {};
      db[key].name     = displayName;
      db[key].training = trainingTxt;
      db[key].incs     = incs;
      db[key].ts       = Date.now();
      if (pid) db[key].pid = pid;

      // خريطة بالعكس: pid→key
      if (pid) {
        if (!db.__pidmap) db.__pidmap = {};
        db.__pidmap[pid] = key;
      }

      saved++;
    });

    saveDB(db);
    log(`Saved last-session increases for ${saved} players → store keys: ${Object.keys(db).length}`);
    if (saved) {
      const sample = Object.values(db)
        .filter(x=>x && x.name)
        .slice(0,5)
        .map(r => ({ name:r.name, training:r.training, increases:r.incs?.map(x=>`${x.skill}+${x.inc}`).join(', ')||'-' }));
      console.table(sample);
    }
    return !!saved;
  }

  function armTrainingScanner() {
    log('Training scanner armed (observer)…');

    let done = false;
    const tryScan = () => {
      if (done) return;
      if (scanTraining()) { done = true; clearInterval(poller); obs.disconnect(); }
    };

    // جرّب فورًا + polling خفيف
    let tries = 0;
    const poller = setInterval(()=>{ tries++; tryScan(); if (tries>=12) clearInterval(poller); }, 1000);
    tryScan();

    // ولاحِظ أي تغييرات DOM
    const obs = new MutationObserver(tryScan);
    obs.observe(document.body, {subtree:true, childList:true});
    setTimeout(()=>obs.disconnect(), 20000);
  }

  /************ عرض الزيادات على صفحة اللاعب ************/
  function injectOnPlayer() {
    const pid = new URLSearchParams(location.search).get('id') || '';
    const db  = loadDB();

    // اسم من الـTitle في الكارد
    const getPlayerName = () => {
      const n1 = document.querySelector('#mainBoard .title .main')?.innerText || '';
      const n2 = document.querySelector('#mainBoard .title')?.innerText || '';
      const n3 = document.querySelector('#mainBoard h1')?.innerText || '';
      return (n1 || n2 || n3).replace(/\s+/g,' ').trim();
    };

    const displayName = getPlayerName();
    const nameKey = norm(displayName);

    // جِب مفتاح السجل:
    let rec = db[nameKey];
    if (!rec && pid && db.__pidmap && db.__pidmap[pid]) {
      rec = db[ db.__pidmap[pid] ];
    } else if (!rec && pid) {
      // بحث تقريبي على مفاتيح فيها الاسم
      const hit = Object.entries(db).find(([k,v]) => k.includes(nameKey) || v?.name?.toLowerCase()?.includes(nameKey));
      if (hit) rec = hit[1];
    }

    // حدد مكان الصندوق (صندوق Position Ratings)
    const ratingsBox = document.querySelector('#mainBoard .board,.box,.settings') || document.querySelector('#mainBoard .board,.box') || document.querySelector('#mainBoard');
    const posCard = document.querySelector('#mainBoard .board .box, #mainBoard .board.box, #mainBoard .board .mainBoard') || document.querySelector('#mainBoard .board');

    const holder = posCard || ratingsBox || document.body;

    // شريط العرض
    let bar = document.getElementById('fmp-train-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'fmp-train-bar';
      bar.style.cssText = `
        margin:8px 0 2px 0;
        padding:8px 10px;
        background:#0f2a0f;
        border:1px solid #355a35;
        border-radius:8px;
        color:#f2ffe6;
        font-size:14px;
        line-height:1.35;
        white-space:nowrap; overflow-x:auto; overflow-y:hidden;
        display:flex; align-items:center; gap:8px;
      `;
      holder.insertBefore(bar, holder.firstChild);
    } else {
      bar.innerHTML = '';
    }

    // زر Refresh
    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = 'Refresh';
    reloadBtn.title = 'Refresh from saved training';
    reloadBtn.style.cssText = `
      background:#224d22; color:#fff; border:1px solid #3f7f3f; border-radius:8px;
      padding:3px 10px; cursor:pointer; font-size:12px;
    `;
    reloadBtn.onclick = () => injectOnPlayer();
    bar.appendChild(reloadBtn);

    const sep = document.createElement('span');
    sep.style.opacity = .5; sep.style.margin = '0 6px'; sep.textContent = '│';
    bar.appendChild(sep);

    const title = document.createElement('strong');
    title.textContent = 'Training:';
    title.style.marginRight = '6px';
    bar.appendChild(title);

    const tSpan = document.createElement('span');
    tSpan.style.opacity = .85;
    tSpan.textContent = rec?.training || '—';
    bar.appendChild(tSpan);

    const sep2 = document.createElement('span');
    sep2.style.opacity = .5; sep2.style.margin = '0 6px'; sep2.textContent = '│';
    bar.appendChild(sep2);

    const incTitle = document.createElement('strong');
    incTitle.textContent = 'Increases:';
    incTitle.style.marginRight = '4px';
    bar.appendChild(incTitle);

    // الشارات
    const pillWrap = document.createElement('span');
    pillWrap.style.display = 'inline-flex';
    pillWrap.style.flexWrap = 'wrap';
    pillWrap.style.gap = '6px';
    bar.appendChild(pillWrap);

    const incs = rec?.incs || [];
    if (!incs.length) {
      const none = document.createElement('span');
      none.style.opacity = .6;
      none.textContent = '—';
      pillWrap.appendChild(none);
    } else {
      // نفس شكل الشيبس
      incs.forEach(x => {
        const chip = document.createElement('span');
        chip.textContent = `${x.skill} +${x.inc}`;
        chip.style.cssText = `
          display:inline-block; padding:2px 8px; border-radius:999px;
          background:#113e11; border:1px solid #1f6a1f; color:#bdf7bd; font-weight:600; font-size:12px
        `;
        pillWrap.appendChild(chip);
      });
    }

    // التاريخ
    const time = document.createElement('span');
    time.style.marginLeft = '8px';
    time.style.opacity = .6;
    if (rec?.ts) {
      const d = new Date(rec.ts);
      time.textContent = d.toLocaleString();
    } else {
      time.textContent = '';
    }
    bar.appendChild(time);

    log(pid || displayName, 'rendered.');
  }

  /************ Router ************/
  if (/\/Team\/Training/i.test(location.pathname)) {
    log('isTouchUI is', !!('ontouchstart' in window));
    armTrainingScanner();
  } else if (/\/Team\/Player/i.test(location.pathname)) {
    injectOnPlayer();
  }
})();
