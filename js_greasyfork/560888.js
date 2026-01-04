// ==UserScript==
// @name         优学院作业互评显示评分人名字（改）
// @namespace    https://greasyfork.org/zh-CN/560888
// @version      0.0.1
// @description  希望能营造良好的互评环境
// @author       MarioHY
// @icon         https://www.ulearning.cn/ulearning/favicon.ico
// @match        https://lms.dgut.edu.cn/homework/*
// @match        https://homework.ulearning.cn/*
// @match        https://homework.dgut.edu.cn/*
// @run-at       document-idle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/560888/%E4%BC%98%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E4%BA%92%E8%AF%84%E6%98%BE%E7%A4%BA%E8%AF%84%E5%88%86%E4%BA%BA%E5%90%8D%E5%AD%97%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560888/%E4%BC%98%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E4%BA%92%E8%AF%84%E6%98%BE%E7%A4%BA%E8%AF%84%E5%88%86%E4%BA%BA%E5%90%8D%E5%AD%97%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.info('[ULearning Helper] observer (no-waiting) start');

  const SHOW_WAITING_ZONE = false; //false 显示最底部等待评价

  (async function main() {
    try {
      const params = parseParamsFromUrl();
      if (!params) {
        console.warn('[ULearning Helper] 无法解析 URL 参数，退出');
        return;
      }
      const { studentid, homeworkid, ocId } = params;
      const origin = window.location.origin;
      const homeworkApiBase = origin + '/homeworkapi';
      const courseApiBase = origin + '/courseapi';

      const token = findAuthToken();
      console.info('[ULearning Helper] token found?', !!token);

      const headers = {};
      if (token) headers['AUTHORIZATION'] = token;
      async function fetchJson(url) {
        const resp = await fetch(url, { credentials: 'include', headers, cache: 'no-store' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText} for ${url}`);
        return resp.json();
      }

      let homeworkDetail = null;
      let peerDetail = null;
      let activityHomework = null;
      try {
        const detailUrl = `${homeworkApiBase}/stuHomework/homeworkDetail/${homeworkid}/${studentid}/${ocId || ''}`;
        const det = await fetchJson(detailUrl);
        homeworkDetail = det && det.result && det.result.peerReviewHomeworkList ? det.result.peerReviewHomeworkList : [];
        activityHomework = det && det.result && det.result.activityHomework ? det.result.activityHomework : null;
      } catch (e) {
        console.warn('[ULearning Helper] homeworkDetail 请求失败：', e.message || e);
      }
      try {
        const pdUrl = `${homeworkApiBase}/stuHomework/peerReviewHomeworkDatil/${homeworkid}/${studentid}`;
        const pd = await fetchJson(pdUrl);
        peerDetail = Array.isArray(pd.result) ? pd.result : (pd.result && pd.result.list ? pd.result.list : (pd.result || []));
      } catch (e) {
        console.warn('[ULearning Helper] peerReviewHomeworkDatil 请求失败：', e.message || e);
      }

      const uids = new Set();
      (homeworkDetail || []).forEach(it => { if (it.userID || it.userId || it.userid) uids.add(String(it.userID || it.userId || it.userid)); });
      (peerDetail || []).forEach(it => { if (it.userID || it.userId || it.userid) uids.add(String(it.userID || it.userId || it.userid)); });

      const usersById = {};
      const fallbackClassName = (activityHomework && ((activityHomework.classNames && activityHomework.classNames[0]) || (activityHomework.homeworkClassList && activityHomework.homeworkClassList[0] && activityHomework.homeworkClassList[0].className))) || '';

      for (const uid of Array.from(uids)) {
        try {
          const url = `${homeworkApiBase}/homework/historyStudentHomework/${uid}/${uid}/${homeworkid}`;
          const uResp = await fetchJson(url);
          const uObj = uResp && uResp.result && uResp.result.user ? uResp.result.user : null;
          const norm = normalizeUser(uObj || {});
          if (ocId) {
            try {
              const clsResp = await fetchJson(`${courseApiBase}/classes?ocId=${ocId}&pn=1&ps=9999&userId=${uid}&keyword=&lang=zh`);
              if (clsResp && clsResp.list && clsResp.list.length > 0) norm.className = clsResp.list[0].className || norm.className;
            } catch (e) { /* ignore */ }
          }
          norm.className = norm.className || fallbackClassName || '';
          usersById[String(uid)] = norm;
        } catch (e) {
          console.warn('[ULearning Helper] 获取用户详情失败 uid=', uid, e.message || e);
          const fallbackItem = (homeworkDetail || []).concat(peerDetail || []).find(it => String(it.userID || it.userId || it.userid) === uid);
          usersById[String(uid)] = normalizeUser(fallbackItem || {});
          usersById[String(uid)].className = usersById[String(uid)].className || fallbackClassName;
        }
      }

      // 启动观察与渲染
      startObserverAndRender({ homeworkDetail: homeworkDetail || [], peerDetail: peerDetail || [], usersById });

      console.info('[ULearning Helper] initialized, users fetched:', Object.keys(usersById).length);
    } catch (e) {
      console.error('[ULearning Helper] 主流程异常', e);
    }
  })();

  function parseParamsFromUrl() {
    try {
      const href = location.href;
      const hash = location.hash || '';
      let studentid = null, homeworkid = null;
      const m = hash.match(/stuDetail\/(\d+)\/(\d+)/);
      if (m) { studentid = m[1]; homeworkid = m[2]; }
      else {
        const m2 = href.match(/\/stuDetail\/(\d+)\/(\d+)/);
        if (m2) { studentid = m2[1]; homeworkid = m2[2]; }
      }
      let ocId = null;
      const usp = new URLSearchParams(location.search.substring(1) || (hash.split('?')[1] || ''));
      ocId = usp.get('ocId') || usp.get('ocid') || null;
      if (studentid && homeworkid) return { studentid, homeworkid, ocId };
      return null;
    } catch (e) { return null; }
  }

  function findAuthToken() {
    try {
      const cookie = document.cookie || '';
      const candidates = ['token', 'AUTHORIZATION', 'Authorization', 'authorization', 'access_token', 'authToken'];
      for (const k of candidates) {
        const m = cookie.match(new RegExp('(?:^|;\\s*)' + k + '=([^;]+)'));
        if (m) return decodeURIComponent(m[1]);
      }
      const lsKeys = ['token', 'TOKEN', 'authToken', 'AUTHORIZATION', 'Authorization', 'access_token'];
      for (const k of lsKeys) {
        const v = localStorage.getItem(k) || sessionStorage.getItem(k);
        if (v) return v;
      }
      const uw = window.unsafeWindow || window;
      try {
        if (uw && uw.__INITIAL_STATE__ && uw.__INITIAL_STATE__.user && uw.__INITIAL_STATE__.user.token) return uw.__INITIAL_STATE__.user.token;
      } catch (e) {}
      try {
        if (uw && uw.store && typeof uw.store.getState === 'function') {
          const s = uw.store.getState();
          if (s && s.user && (s.user.token || s.user.authToken)) return s.user.token || s.user.authToken;
        }
      } catch (e) {}
      return '';
    } catch (e) { return ''; }
  }

  function normalizeUser(src) {
    if (!src || typeof src !== 'object') return { name: '', studentid: '', className: '', userID: '' };
    const out = {};
    out.name = firstNonEmpty(src.name, src.realName, src.realname, src.loginname, src.userName) || '';
    out.studentid = firstNonEmpty(src.studentid, src.studentId, src.studentID, src.loginname) || '';
    out.className = firstNonEmpty(src.className, src.classname, src.classId, src.classid) || '';
    out.userID = String(firstNonEmpty(src.userID, src.userId, src.userid, src.id, src.uid, src.user) || '');
    out._raw = src;
    return out;
  }
  function firstNonEmpty(...args) { for (const v of args) if (v !== undefined && v !== null && String(v).trim() !== '') return v; return ''; }

  // 渲染逻辑
  function renderIntoDOM({ homeworkDetail, peerDetail, usersById }) {
    try {
      // .peermain -> homeworkDetail
      const peers = document.querySelectorAll('.peermain');
      if (peers && peers.length > 0 && Array.isArray(homeworkDetail)) {
        for (let i = 0; i < peers.length; i++) {
          const node = peers[i];
          if (node.dataset.ulInjected === '1') continue;
          const item = homeworkDetail[i] || {};
          const uid = String(item.userID || item.userId || item.userid || '');
          const user = usersById[uid] || normalizeUser(item);
          insertLabel(node, `评价人：${user.name || '***'}  学号：${user.studentid || '未知'}  班级：${user.className || '未知'}`);
          node.dataset.ulInjected = '1';
        }
      }

      // .peer_host -> peerDetail
      const peerHosts = document.querySelectorAll('.peer_host');
      if (peerHosts && peerHosts.length > 0 && Array.isArray(peerDetail)) {
        for (let i = 0; i < peerHosts.length; i++) {
          const node = peerHosts[i];
          if (node.dataset.ulInjected === '1') continue;
          const item = peerDetail[i] || {};
          const uid = String(item.userID || item.userId || item.userid || '');
          const user = usersById[uid] || normalizeUser(item);
          insertLabel(node, `待评价人员：${user.name || '***'}  学号：${user.studentid || '未知'}  班级：${user.className || '未知'}`);
          node.dataset.ulInjected = '1';
        }
      }

      if (SHOW_WAITING_ZONE) {
        const myZones = document.querySelectorAll('.stuworkdetails-zone');
        if (myZones && myZones.length > 0) {
          const zone = myZones[0];
          if (zone && zone.dataset.ulInjected !== '1') {
            const list = (homeworkDetail && homeworkDetail.length > 0) ? homeworkDetail : (peerDetail && peerDetail.length > 0 ? peerDetail : []);
            for (const item of list) {
              const uid = String(item.userID || item.userId || item.userid || '');
              const user = usersById[uid] || normalizeUser(item);
              insertLabel(zone, `等待评价：${user.name || '***'}  学号：${user.studentid || '未知'}  班级：${user.className || '未知'}`, true);
            }
            zone.dataset.ulInjected = '1';
          }
        }
      }

    } catch (e) {
      console.warn('[ULearning Helper] renderIntoDOM error', e);
    }
  }

  function insertLabel(referenceNode, text, insertBefore=false) {
    const el = document.createElement('div');
    el.className = 'ul-evaluator-label';
    el.style = 'margin:6px 0;color:#444;font-size:13px';
    el.textContent = text;
    if (referenceNode.parentNode) referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
  }

  function startObserverAndRender({ homeworkDetail, peerDetail, usersById }) {
    renderIntoDOM({ homeworkDetail, peerDetail, usersById });

    const observer = new MutationObserver((mutations) => {
      let found = false;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          for (const n of m.addedNodes) {
            if (!(n instanceof HTMLElement)) continue;
            if (n.querySelector && (n.querySelector('.peermain') || n.querySelector('.peer_host') || n.querySelector('.stuworkdetails-zone'))) {
              found = true; break;
            }
            if (n.classList && (n.classList.contains('peermain') || n.classList.contains('peer_host') || n.classList.contains('stuworkdetails-zone'))) {
              found = true; break;
            }
          }
        }
        if (found) break;
      }
      if (found) {
        setTimeout(() => renderIntoDOM({ homeworkDetail, peerDetail, usersById }), 300);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
  }

})();