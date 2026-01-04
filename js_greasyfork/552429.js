// ==UserScript==
// @name         2025 CAQ 中国质量协会 全国企业员工全面质量管理知识竞赛活动答题
// @namespace    http://不想当牛马/
// @version      1.0
// @description  仅适用于2025年中国质量协会考试答题；注入答案到题目；固定 examPaperId（风险自负）.
// @author       HG
// @license MIT
// @match        https://tqm.caq.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552429/2025%20CAQ%20%E4%B8%AD%E5%9B%BD%E8%B4%A8%E9%87%8F%E5%8D%8F%E4%BC%9A%20%E5%85%A8%E5%9B%BD%E4%BC%81%E4%B8%9A%E5%91%98%E5%B7%A5%E5%85%A8%E9%9D%A2%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B%E6%B4%BB%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/552429/2025%20CAQ%20%E4%B8%AD%E5%9B%BD%E8%B4%A8%E9%87%8F%E5%8D%8F%E4%BC%9A%20%E5%85%A8%E5%9B%BD%E4%BC%81%E4%B8%9A%E5%91%98%E5%B7%A5%E5%85%A8%E9%9D%A2%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B%E6%B4%BB%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const FIXED_EXAM_PAPER_ID = '1398341936070397952';


  const ANSWERS = [
    {"subjectId":"1142583314197123072","answer":"A"},
    {"subjectId":"1142583488264933376","answer":"C"},
    {"subjectId":"1142584177514909696","answer":"B"},
    {"subjectId":"1142584170149711872","answer":"B"},
    {"subjectId":"1142583312137719808","answer":"B"},
    {"subjectId":"1142583322279546880","answer":"C"},
    {"subjectId":"1142583588986949632","answer":"B"},
    {"subjectId":"1142584169029832704","answer":"C"},
    {"subjectId":"1142583320232726528","answer":"D"},
    {"subjectId":"1142583580178911232","answer":"C"},
    {"subjectId":"1142583489363841024","answer":"D"},
    {"subjectId":"1142583329409863680","answer":"D"},
    {"subjectId":"1142584476325515264","answer":"B"},
    {"subjectId":"1142583993192026112","answer":"D"},
    {"subjectId":"1142584407400517632","answer":"D"},
    {"subjectId":"1142582943450009600","answer":"A"},
    {"subjectId":"1142584403252350976","answer":"D"},
    {"subjectId":"1142584173375131648","answer":"D"},
    {"subjectId":"1142583334434639872","answer":"D"},
    {"subjectId":"1142583323307151360","answer":"C"},
    {"subjectId":"1142584284595490816","answer":"A,B,C,E"},
    {"subjectId":"1142583526957387776","answer":"B,C,D,E"},
    {"subjectId":"1142584497313812480","answer":"A,B,C,D"},
    {"subjectId":"1142584286688448512","answer":"A,B,D"},
    {"subjectId":"1142583522486259712","answer":"A,C,D"}
  ];
  const ANSWER_MAP = Object.fromEntries(ANSWERS.map(x => [String(x.subjectId), x.answer]));


  function parseAnswerLetters(ans) {
    if (!ans) return [];
    return String(ans)
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length === 1 && /[A-Z]/.test(s));
  }


  function injectAnswersIntoPaper(dataObj) {
    const list = dataObj?.subjectDtoList || dataObj?.result?.subjectDtoList;
    if (!Array.isArray(list)) return dataObj;

    list.forEach(subject => {
      const sid = String(subject?.id || subject?.subjectId || '');
      const ans = ANSWER_MAP[sid];
      if (!ans) return;


      const tag = `【答案：${ans}】`;
      const name = subject.subjectName || '';
      if (!name.includes(tag)) subject.subjectName = name + ' ' + tag;


      const letters = parseAnswerLetters(ans);
      if (Array.isArray(subject.options) && letters.length) {
        subject.options.forEach(opt => {
          const optName = String(opt?.optionName || '').trim().toUpperCase();
          opt.right = letters.includes(optName) ? true : false;
        });
      }
    });

    return dataObj;
  }


  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {

    try {
      if (init && init.body && typeof init.body === 'string') {
        const headers = init.headers || {};
        const ct = headers['content-type'] || headers['Content-Type'] || '';
        if (ct.includes('application/json')) {
          const obj = JSON.parse(init.body);
          if (obj && obj.examPaperId) {
            console.log('[Interceptor:fetch] examPaperId:', obj.examPaperId, '→', FIXED_EXAM_PAPER_ID);
            obj.examPaperId = FIXED_EXAM_PAPER_ID;
            init.body = JSON.stringify(obj);
          }
        }
      }
    } catch (e) {}

    const res = await originalFetch(input, init);

    try {
      const url = typeof input === 'string' ? input : (input?.url || '');
      const isTarget = url.includes('/bak/v1/examination/obtainAllPaperById/') &&
                       url.endsWith('.json') &&
                       url.includes(FIXED_EXAM_PAPER_ID);
      const ct = res.headers.get('content-type') || '';

      if (isTarget && ct.includes('application/json')) {
        const clone = res.clone();
        const data = await clone.json();
        const patched = injectAnswersIntoPaper(data);
        console.log('[Interceptor:fetch] obtainAllPaperById patched');
        return new Response(JSON.stringify(patched), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers
        });
      }
    } catch (e) {}

    return res;
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this._url = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {

    try {
      if (body && typeof body === 'string' && body.trim().startsWith('{')) {
        const obj = JSON.parse(body);
        if (obj && obj.examPaperId) {
          console.log('[Interceptor:XHR] examPaperId:', obj.examPaperId, '→', FIXED_EXAM_PAPER_ID);
          body = JSON.stringify({ ...obj, examPaperId: FIXED_EXAM_PAPER_ID });
        }
      }
    } catch (e) {}

    this.addEventListener('readystatechange', function() {
      if (this.readyState === 4 && (this.responseType === '' || this.responseType === 'text')) {
        try {
          const url = this._url || '';
          const ct = this.getResponseHeader('content-type') || '';
          const isTarget = url.includes('/bak/v1/examination/obtainAllPaperById/') &&
                           url.endsWith('.json') &&
                           url.includes(FIXED_EXAM_PAPER_ID);

          if (isTarget && ct.includes('application/json')) {
            const data = JSON.parse(this.responseText);
            const patched = injectAnswersIntoPaper(data);


            const text = JSON.stringify(patched);
            Object.defineProperty(this, 'responseText', { value: text });
            Object.defineProperty(this, 'response', { value: text });
            console.log('[Interceptor:XHR] obtainAllPaperById patched');
          }
        } catch (e) {}
      }
    });

    return originalSend.call(this, body);
  };

})();
