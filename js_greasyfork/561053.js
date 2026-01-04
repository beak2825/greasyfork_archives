// ==UserScript==
// @name          Mrkoll Profile Extractor
// @namespace     https://mrkoll.se/
// @version       1.5.4
// @description   Extracts address, phones, marital status and positions.
// @match         https://mrkoll.se/person/*
// @icon          https://mrkoll.se/favicon.ico
// @grant         GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/561053/Mrkoll%20Profile%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/561053/Mrkoll%20Profile%20Extractor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INITIAL_WIDTH = 700;
  const INITIAL_HEIGHT = 700;
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 400;

  const COLOR_POPUP_BG = '#1a1a1a';
  const COLOR_CONTROL_BAR = '#252525';
  const COLOR_FOOTER_BAR = '#222';
  const COLOR_DIVIDER = '#333';
  const COLOR_TEXT_DEFAULT = '#e0e0e0';
  const COLOR_EDIT_BG = '#353840';

  function clean(str) {
    if (!str) return "";
    return str
      .replace(/[öÖ]/gi, 'o')
      .replace(/[äåÄÅ]/gi, 'a')
      .replace(/[éÉ]/gi, 'e')
      .trim();
  }

  function fixCity(str) {
    return str.replace(/Göteborg/gi, 'Gothenburg');
  }

  function fixPhone(raw) {
    const d = raw.replace(/\D/g, '').replace(/^46/, '').replace(/^0/, '');
    if (!d || d.length < 6) return '';
    if (d.length <= 7) return `(0)${d.slice(0, 1)} ${d.slice(1)}`;
    return `(0)${d.slice(0, 2)} ${d.slice(2)}`;
  }

  function fixDate(txt) {
    const mon = {
      januari: '01', februari: '02', mars: '03', april: '04',
      maj: '05', juni: '06', juli: '07', augusti: '08',
      september: '09', oktober: '10', november: '11', december: '12'
    };
    const m = txt.toLowerCase().match(/(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})/);
    if (!m) return '';
    return `${m[1].padStart(2, '0')}/${mon[m[2]]}/${m[3]}`;
  }

  function extract() {
    const output = [];

    const nameEl = document.querySelector('h1.infoH1person');
    if (nameEl) {
      output.push(nameEl.innerText.trim());
      output.push('');
    }

    const addressLines = document.querySelectorAll('span.f_line2.pl65');
    if (addressLines.length >= 2) {
      let street = addressLines[0].innerText.replace(/\s+lgh\s+\d+/i, '').trim();
      output.push(clean(street));
      let zipCity = addressLines[1].innerText.trim();
      let formattedZipCity = zipCity.replace(/^(\d{3})(\d{2})/, '$1 $2');
      output.push(clean(fixCity(formattedZipCity)));
      const allLabels = document.querySelectorAll('span.f_head1');
      let countyStr = "";
      allLabels.forEach(label => {
        if (label.innerText.includes("Län")) {
          const countyVal = label.nextElementSibling;
          if (countyVal) countyStr = countyVal.innerText.replace(/\s+län/i, '').trim();
        }
      });
      if (countyStr) output.push(`(lan ${clean(countyStr)})`);
    }

    const phoneDiv = document.querySelector('div.phone_div');
    if (phoneDiv) {
      const phones = new Set();
      phoneDiv.querySelectorAll('a[href^="tel:"]').forEach(a => {
        const fixed = fixPhone(a.innerText);
        if (fixed) phones.add(fixed);
      });
      if (phones.size) {
        output.push('');
        phones.forEach(p => output.push(p));
      }
    }

    const maritalHeader = Array.from(document.querySelectorAll('span.f_line1.ins_edu')).find(el => el.innerText.includes("gift"));
    if (maritalHeader) {
        const spouseBlock = maritalHeader.nextElementSibling;
        const spouseStrong = spouseBlock ? spouseBlock.querySelector('strong') : null;
        if (spouseStrong) {
            let spouseFullName = spouseStrong.innerText.trim();
            let spouseFirstName = spouseFullName.split(' ')[0];
            output.push('');
            output.push(`Spouse's name: ${clean(spouseFirstName)}`);
        }
    }

    const personInfoDiv = document.querySelector('div.personInfo.pBlock1');
    if (personInfoDiv) {
      const dobMatch = personInfoDiv.innerText.match(/den\s+(\d{1,2}\s+[a-zåäö]+\s+\d{4})/i);
      if (dobMatch) {
        const dob = fixDate(dobMatch[1]);
        if (dob) {
          output.push('');
          output.push(`Date of birth: ${dob}`);
        }
      }
    }

    const rolesMap = {
      'ordförande': 'Chairman', 'verkställande direktör': 'CEO', 'vd': 'CEO', 'extern vd': 'CEO',
      'vice vd': 'Deputy CEO', 'styrelseledamot': 'Board Member', 'styrelsesuppleant': 'Deputy Board Member',
      'vice ordförande': 'Deputy Chairman'
    };
    const companyData = new Map();
    const companyParagraphs = document.querySelectorAll('div.resBlockContentInfo p.f_line5');
    companyParagraphs.forEach(p => {
      const strongEl = p.querySelector('strong');
      if (!strongEl) return;
      const companyName = clean(strongEl.innerText.trim());
      const roleText = p.innerText.toLowerCase();
      const rs = new Set();
      for (const [sv, en] of Object.entries(rolesMap)) { if (roleText.includes(sv)) rs.add(en); }
      if (rs.size > 0) {
        if (!companyData.has(companyName)) companyData.set(companyName, new Set());
        rs.forEach(r => companyData.get(companyName).add(r));
      }
    });
    if (companyData.size > 0) {
      output.push(''); output.push('Other positions:');
      const rolePriority = { 'CEO': 1, 'Chairman': 2, 'Deputy Chairman': 3, 'Board Member': 4, 'Deputy Board Member': 5 };
      companyData.forEach((rs, cn) => {
        let rolesArray = Array.from(rs);
        if ((rolesArray.includes('Chairman') || rolesArray.includes('CEO')) && rolesArray.includes('Board Member')) {
          rolesArray = rolesArray.filter(r => r !== 'Board Member');
        }
        rolesArray.sort((a, b) => (rolePriority[a] || 99) - (rolePriority[b] || 99));
        output.push(`- ${cn}, ${rolesArray.join(', ')}`);
      });
    }

    // ADDED SOURCE
    output.push('');
    output.push('mrkoll');

    return output.join('\n');
  }

  function show(txt) {
    document.getElementById('mrkollPop')?.remove();
    const popup = document.createElement('div');
    popup.id = 'mrkollPop';
    const buttonStyle = `background:#3a3a3a; color:${COLOR_TEXT_DEFAULT}; border:1px solid #555; border-radius:4px; cursor:pointer; font-weight:bold;`;
    const smallButtonStyle = `${buttonStyle} padding:4px 8px; font-size:14px;`;
    const mainButtonStyle = `${buttonStyle} flex:1; padding:6px 12px; font-size:14px;`;

    popup.innerHTML = `
      <div id="popupContainer" style="position:fixed; top:60px; right:20px; width:${INITIAL_WIDTH}px; height:${INITIAL_HEIGHT}px; max-width:90vw; background:${COLOR_POPUP_BG}; border:2px solid ${COLOR_DIVIDER}; border-radius:12px; z-index:999999; font-family:Arial, sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.6); display:flex; flex-direction:column; overflow:hidden; min-width:${MIN_WIDTH}px; min-height:${MIN_HEIGHT}px;">
        <div id="mDragHandle" style="padding:10px 14px; background:${COLOR_CONTROL_BAR}; display:flex; justify-content:flex-end; align-items:center; border-bottom:1px solid ${COLOR_DIVIDER}; cursor:grab;">
          <button id="mClose" style="background:none; border:none; color:#888; font-size:20px; cursor:pointer; padding:4px 8px;">✕</button>
        </div>
        <textarea id="mText" style="flex:1; background:${COLOR_POPUP_BG}; color:${COLOR_TEXT_DEFAULT}; border:none; padding:16px; font-family:monospace; font-size:13px; resize:none; outline:none;" readonly>${txt}</textarea>
        <div id="mControlBar" style="padding:10px 14px 4px 14px; display:flex; gap:8px; background:${COLOR_FOOTER_BAR}; border-top:1px solid ${COLOR_DIVIDER}; position:relative;">
          <button id="mEdit" style="${mainButtonStyle}">Edit</button>
          <button id="mCopy" style="${mainButtonStyle}">Copy</button>
          <div id="mCopyFeedback" style="position:absolute; top:-35px; left:50%; transform:translateX(-50%); background:${COLOR_CONTROL_BAR}; color:${COLOR_TEXT_DEFAULT}; padding:4px 10px; border-radius:6px; font-size:20px; opacity:0; pointer-events:none; transition:opacity 0.3s;">🍻 Copied!</div>
        </div>
        <div style="padding:4px 14px 10px 14px; display:flex; gap:8px; justify-content:center; background:${COLOR_FOOTER_BAR}; border-bottom-left-radius:12px; border-bottom-right-radius:12px;">
          <button id="mZoomIn" style="${smallButtonStyle}">+</button>
          <button id="mZoomOut" style="${smallButtonStyle}">-</button>
        </div>
        <div id="mResizeLeftDown" style="position:absolute; bottom:0; left:0; width:16px; height:16px; cursor:sw-resize; background:linear-gradient(45deg, transparent 40%, #555 40%);"></div>
      </div>`;

    document.body.appendChild(popup);
    const container = popup.querySelector('#popupContainer');
    const dragHandle = popup.querySelector('#mDragHandle');
    const ta = popup.querySelector('#mText');
    const editBtn = popup.querySelector('#mEdit');
    const copyBtn = popup.querySelector('#mCopy');
    const closeBtn = popup.querySelector('#mClose');
    const zoomIn = popup.querySelector('#mZoomIn');
    const zoomOut = popup.querySelector('#mZoomOut');
    const resizeLeftDown = popup.querySelector('#mResizeLeftDown');

    let isEditing = false, fontSize = 13, isDragging = false, isResizingLD = false;
    let offsetX, offsetY, startX, startY, startWidth, startHeight, startLeft;

    dragHandle.onmousedown = (e) => {
      isDragging = true;
      const rect = container.getBoundingClientRect();
      offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
      container.style.removeProperty('right');
      container.style.left = `${rect.left}px`; container.style.top = `${rect.top}px`;
      e.preventDefault();
    };
    resizeLeftDown.onmousedown = (e) => {
      isResizingLD = true;
      startX = e.clientX; startY = e.clientY;
      startWidth = container.offsetWidth; startHeight = container.offsetHeight;
      startLeft = container.offsetLeft;
      e.preventDefault();
    };
    document.onmousemove = (e) => {
      if (isDragging) { container.style.left = `${e.clientX - offsetX}px`; container.style.top = `${e.clientY - offsetY}px`; }
      if (isResizingLD) {
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        container.style.width = `${Math.max(MIN_WIDTH, startWidth - dx)}px`;
        container.style.left = `${startLeft + dx}px`;
        container.style.height = `${Math.max(MIN_HEIGHT, startHeight + dy)}px`;
      }
    };
    document.onmouseup = () => { isDragging = false; isResizingLD = false; };
    editBtn.onclick = () => {
      isEditing = !isEditing;
      ta.readOnly = !isEditing;
      ta.style.background = isEditing ? COLOR_EDIT_BG : COLOR_POPUP_BG;
      editBtn.textContent = isEditing ? 'Done' : 'Edit';
    };
    copyBtn.onclick = () => { GM_setClipboard(ta.value); popup.querySelector('#mCopyFeedback').style.opacity = '1'; setTimeout(() => { popup.querySelector('#mCopyFeedback').style.opacity = '0'; }, 1500); };
    closeBtn.onclick = () => popup.remove();
    zoomIn.onclick = () => { fontSize++; ta.style.fontSize = fontSize + 'px'; };
    zoomOut.onclick = () => { fontSize--; ta.style.fontSize = fontSize + 'px'; };
  }
  window.addEventListener('load', () => { setTimeout(() => show(extract()), 700); });
})();