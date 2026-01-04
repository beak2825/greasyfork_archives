// ==UserScript==
// @name         学堂在线习题答案收集器
// @namespace    https://www.xuetangx.com/
// @version      0.2
// @description  自动遍历学堂在线课程中的“习题”小节，收集题目类型、内容和答案，导出为 JSON 或者 Markdown。
// @author       ChatGPT 5.1
// @match        https://www.xuetangx.com/*
// @run-at       document-end
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/557513/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E4%B9%A0%E9%A2%98%E7%AD%94%E6%A1%88%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557513/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E4%B9%A0%E9%A2%98%E7%AD%94%E6%A1%88%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function log(...args) {
    console.log('[XTXCollector]', ...args);
  }

  /** 创建右上角小面板 UI */
  function createPanel() {
    if (document.getElementById('xtx-collector-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'xtx-collector-panel';
    panel.style.position = 'fixed';
    panel.style.top = '80px';
    panel.style.right = '20px';
    panel.style.zIndex = '999999';
    panel.style.background = 'rgba(255,255,255,0.75)';
    panel.style.color = '#fff';
    panel.style.padding = '8px';
    panel.style.borderRadius = '4px';
    panel.style.fontSize = '12px';
    panel.style.width = '260px';
    panel.style.maxHeight = '70vh';
    panel.style.overflow = 'auto';
    panel.style.boxShadow = '0 0 6px rgba(0,0,0,0.5)';
    panel.style.color = "black";
    panel.innerHTML = `
      <div style="font-weight:bold;margin-bottom:4px;">习题答案收集器</div>
      <div style="margin-bottom:4px;">
        <button id="xtx-collector-start" style="margin-right:4px;">开始收集</button>
        <button id="xtx-collector-copy">复制JSON</button>
        <button id="xtx-collector-copy-md">复制Markdown</button>
      </div>
      <div id="xtx-collector-status" style="white-space:pre-line;margin-bottom:4px;">准备就绪。</div>
      <textarea id="xtx-collector-output" style="width:100%;height:220px;font-size:11px;"></textarea>
    `;
    document.body.appendChild(panel);

    const btnStart = document.getElementById('xtx-collector-start');
    const btnCopy = document.getElementById('xtx-collector-copy');
    const btnMdCopy = document.getElementById('xtx-collector-copy-md');
    const statusEl = document.getElementById('xtx-collector-status');
    const outputEl = document.getElementById('xtx-collector-output');

    async function start() {
      try {
        btnStart.disabled = true;
        outputEl.value = '';
        statusEl.textContent = '开始收集，请不要手动操作页面...';

        const data = await collectAllExercises(msg => {
          statusEl.textContent = msg;
        }, result => {
          outputEl.value = result;
        });

        const json = JSON.stringify(data, null, 2);
        outputEl.value = json;
        window._xtxExerciseData = data;
        statusEl.textContent =
          `完成，共收集到 ${data.exercises.length} 道题。\n结果已保存到 window._xtxExerciseData。`;
      } catch (e) {
        console.error(e);
        statusEl.textContent = '收集过程中出错：' + e.message;
      } finally {
        btnStart.disabled = false;
      }
    }

    btnStart.addEventListener('click', () => {
      start();
    });

    btnCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(outputEl.value);
        statusEl.textContent = '已复制到剪贴板。';
      } catch (e) {
        statusEl.textContent = '复制失败，请手动全选复制。';
      }
    });

    btnMdCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(generateMarkdown(JSON.parse(outputEl.value)));
        statusEl.textContent = '已复制到剪贴板。';
      } catch (e) {
        statusEl.textContent = '复制失败，请手动全选复制。';
      }
    });
  }

  /** 找到左侧导航中所有“习题”小节，过滤掉期末考试（icon 为 ） */
  function getExerciseNavItems() {
    const items = [];
    // 习题在第三级 ul.third > li > div.title 里
    const titleDivs = document.querySelectorAll('.listScroll .third .title');

    titleDivs.forEach(div => {
      const span = div.querySelector('.titlespan');
      if (!span) return;

      const text = span.textContent.trim();
      if (!text.includes('习题')) return;

      // 左侧的 iconfont.left： = 习题； 等是考试
      const leftIcon = div.querySelector('i.iconfont.left');
      if (!leftIcon) return;

      const iconText = leftIcon.textContent.trim();
      if (iconText !== '') {
        // 不是习题（比如期末考试），跳过
        return;
      }

      // 找到所属大章节标题 “第X章 xxx”
      let chapterTitle = '';
      const firstUl = div.closest('ul.first');
      if (firstUl) {
        const chapterTitleSpan = firstUl.querySelector('li.title .titlespan');
        if (chapterTitleSpan) chapterTitle = chapterTitleSpan.textContent.trim();
      }

      items.push({
        el: div,
        sectionTitle: text, // 例如 “2.9 习题”
        chapterTitle: chapterTitle, // 例如 “第二章 常用数据库及检索”
        fullTitle: chapterTitle ? chapterTitle + ' / ' + text : text
      });
    });

    return items;
  }

  function getTabbar() {
    return document.querySelector('.tabbar');
  }

  function getCurrentIndex() {
    const el = document.querySelector('.tabbar .curent');
    if (!el) return NaN;
    return parseInt(el.textContent.trim(), 10);
  }

  function getTotalCount() {
    const el = document.querySelector('.tabbar .total');
    if (!el) return NaN;
    const text = el.textContent.trim().replace('/', '');
    return parseInt(text, 10);
  }

  function clickPrev() {
    const tabbar = getTabbar();
    if (!tabbar) return;
    const btn = tabbar.querySelector('i.iconfont.unselectable:not(.right)');
    if (btn) btn.click();
  }

  function clickNext() {
    const tabbar = getTabbar();
    if (!tabbar) return;
    const btn = tabbar.querySelector('i.iconfont.right.unselectable');
    if (btn) btn.click();
  }

  async function showAllAnswers() {
    const showAllAnswerBtn = document.querySelector('.showAllAnswer');
    showAllAnswerBtn.click();
    await sleep(2000);
    const closeBtn = document.querySelector('.courseActionAnswerSheet .content .titleCon .closeBtn');
    closeBtn.click();
    await sleep(100);
  }

  /** 等待某个 selector 出现（用于等待习题页面加载） */
  async function waitFor(selector, timeoutMs = 15000) {
    const existing = document.querySelector(selector);
    if (existing) return existing;

    return new Promise((resolve, reject) => {
      const start = Date.now();
      let done = false;

      const observer = new MutationObserver(() => {
        if (done) return;
        const el = document.querySelector(selector);
        if (el) {
          done = true;
          observer.disconnect();
          resolve(el);
        } else if (Date.now() - start > timeoutMs) {
          done = true;
          observer.disconnect();
          reject(new Error('等待元素超时: ' + selector));
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        if (done) return;
        const el2 = document.querySelector(selector);
        if (el2) {
          done = true;
          observer.disconnect();
          resolve(el2);
        } else {
          done = true;
          observer.disconnect();
          reject(new Error('等待元素超时: ' + selector));
        }
      }, timeoutMs);
    });
  }

  /** 用 tabbar 左箭头回到第 1 题 */
  async function goToFirstQuestion() {
    await waitFor('.tabbar .curent');
    let cur = getCurrentIndex();
    if (!Number.isFinite(cur)) return;

    const answerList = document.querySelectorAll('.answerCon .answerList .answer .con');
    if (answerList.length) {
        answerList[0].click();
    } else {
        let guard = 0;
        while (cur > 1 && guard < 100) {
            clickPrev();
            await sleep(600);
            const newCur = getCurrentIndex();
            if (newCur === cur) break; // 没动就别死循环
            cur = newCur;
            guard++;
        }
    }
  }

  /** 在当前题目页面解析题目类型、内容、选项与答案 */
  function extractCurrentQuestion(chapterInfo) {
    const qRoot = document.querySelector('.question');
    if (!qRoot) return null;

    const titleEl = qRoot.querySelector('.title');
    const titleText = titleEl
      ? titleEl.textContent.replace(/\s+/g, ' ').trim()
      : '';

    let type = 'unknown';
    if (/多选题/.test(titleText)) type = 'multi';
    else if (/单选题/.test(titleText)) type = 'single';
    else if (/判断题/.test(titleText)) type = 'judge';
    else if (/主观题/.test(titleText)) type = 'subjective';

    let score = null;
    const m = titleText.match(/\(([\d.]+)分\)/);
    if (m) score = m[1];

    const stemEl = qRoot.querySelector('.leftQuestion .fuwenben');
    const contentHtml = stemEl ? stemEl.innerHTML.trim() : '';
    const contentText = stemEl
      ? stemEl.textContent.replace(/\s+/g, ' ').trim()
      : '';

    const options = [];
    if (type === 'single' || type === 'multi') {
      const optionRows = qRoot.querySelectorAll('.leftradio');
      optionRows.forEach(p => {
        const labelEl = p.querySelector('.radio_xtb');
        const label = labelEl ? labelEl.textContent.trim() : '';
        let text = '';
        if (labelEl && labelEl.nextElementSibling) {
          text = labelEl.nextElementSibling.textContent
            .replace(/\s+/g, ' ')
            .trim();
        } else {
          text = p.textContent.replace(/\s+/g, ' ').trim();
        }
        options.push({ label, text });
      });
    }

    let answers = [];
    let answerDetail = null;

    const answerList = document.querySelector('.answerList .answerList');
    const remarkCon = document.querySelector('.remark .con');

    if (type === 'subjective') {
      // 主观题：拿“我的答案”区域
      if (remarkCon) {
        const text = remarkCon.textContent.replace(/\s+/g, ' ').trim();
        if (text) answers = [text];
        answerDetail = remarkCon.innerHTML.trim();
      }
    } else if (type === 'judge') {
      // 判断题：radio_xtb panduan true/false
      if (answerList) {
        const judgeSpan = answerList.querySelector('.radio_xtb.panduan');
        if (judgeSpan) {
          const val = judgeSpan.classList.contains('true') ? 'true' : 'false';
          if (val) answers = [val];
        }
      }
    } else if (type === 'single' || type === 'multi') {
      // 单选 / 多选题：正确答案区域里的 radio_xtb.pointDefault
      if (answerList) {
        const choiceSpans = answerList.querySelectorAll('.radio_xtb.pointDefault');
        if (choiceSpans.length > 0) {
          answers = Array.from(choiceSpans)
            .map(s => s.textContent.trim())
            .filter(Boolean);
        }
      }
    } else {
      // 未知类型兜底：先尝试 answerList，再尝试 remark
      if (answerList) {
        const choiceSpans = answerList.querySelectorAll('.radio_xtb.pointDefault');
        if (choiceSpans.length > 0) {
          answers = Array.from(choiceSpans)
            .map(s => s.textContent.trim())
            .filter(Boolean);
        }
      }
      if (!answers.length && remarkCon) {
        const text = remarkCon.textContent.replace(/\s+/g, ' ').trim();
        if (text) answers = [text];
      }
    }

    const currentIndex = getCurrentIndex();

    return {
      chapterTitle: chapterInfo.chapterTitle,  // “第二章 常用数据库及检索”
      sectionTitle: chapterInfo.sectionTitle,  // “2.9 习题”
      fullTitle: chapterInfo.fullTitle,        // “第二章 常用数据库及检索 / 2.9 习题”
      questionIndex: currentIndex,             // 当前题号（1 开始）
      questionType: type,                      // single/multi/judge/subjective/unknown
      questionTypeText: titleText,             // 原始标题文本
      score: score,                            // 分值字符串，如 "2"
      contentHtml: contentHtml,                // 题干 HTML
      contentText: contentText,                // 题干纯文本
      options: options,                        // 选项数组（非选择题为空数组）
      answers: answers,                        // 答案数组：单选/多选 => ["A","C"]; 判断 => ["true"/"false"]; 主观 => [文本]
      answerDetail: answerDetail               // 主观题答案 HTML（可选）
    };
  }

  function generateMarkdown(data) {
    const lines = [];
    const courseTitle = data.courseTitle || '课程习题答案';

    lines.push('# ' + courseTitle);
    lines.push('');
    if (data.startedAt) lines.push(`- 收集开始时间：${data.startedAt}`);
    if (data.finishedAt) lines.push(`- 收集结束时间：${data.finishedAt}`);
    lines.push(`- 题目总数：${(data.exercises || []).length}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    const exs = data.exercises || [];

    // 按章节（fullTitle）分组
    const bySection = {};
    for (const ex of exs) {
      const key =
        ex.fullTitle ||
        [ex.chapterTitle, ex.sectionTitle].filter(Boolean).join(' / ') ||
        '未分组章节';
      if (!bySection[key]) bySection[key] = [];
      bySection[key].push(ex);
    }

    const sectionKeys = Object.keys(bySection);

    sectionKeys.forEach(sectionKey => {
      lines.push('## ' + sectionKey);
      lines.push('');

      // 按题号排序
      const list = bySection[sectionKey].slice().sort((a, b) => {
        return (a.questionIndex || 0) - (b.questionIndex || 0);
      });

      list.forEach(ex => {
        const qType = ex.questionType || 'unknown';
        const qIdx = ex.questionIndex != null ? ex.questionIndex : '?';
        const scoreText = ex.score ? `，分值：${ex.score}` : '';

        lines.push(`### 题目 ${qIdx} （类型：${qType}${scoreText}）`);
        lines.push('');

        // 题干
        lines.push('**题干**');
        lines.push('');
        if (ex.contentText) {
          lines.push(ex.contentText);
        } else if (ex.contentHtml) {
          // 简单去掉多余空白
          lines.push(ex.contentHtml.replace(/\s+/g, ' ').trim());
        } else {
          lines.push('_（无题干文本）_');
        }
        lines.push('');

        // 选项
        if (ex.options && ex.options.length > 0) {
          lines.push('**选项**');
          lines.push('');
          ex.options.forEach(opt => {
            const label = opt.label || '';
            const text = opt.text || '';
            lines.push(`- ${label ? label + '. ' : ''}${text}`);
          });
          lines.push('');
        }

        // 答案
        lines.push('**答案**');
        lines.push('');
        if (ex.answers && ex.answers.length > 0) {
          lines.push(ex.answers.join(', '));
        } else if (ex.answerDetail) {
          lines.push(ex.answerDetail.replace(/\s+/g, ' ').trim());
        } else {
          lines.push('_（未采集到答案）_');
        }
        lines.push('');
        lines.push('---');
        lines.push('');
      });
    });

    return lines.join('\n');
  }

  /** 入口：自动遍历所有“习题”小节并收集 */
  async function collectAllExercises(updateStatus, updateResult) {
    const navItems = getExerciseNavItems();
    if (!navItems.length) {
      throw new Error('未找到任何“习题”章节，请确认已进入课程学习页面。');
    }

    log('found exercise chapters:', navItems);

    const courseTitleEl = document.querySelector('.headerCon>p>span');
    const courseTitle = courseTitleEl ? courseTitleEl.textContent.trim() : '';

    const exercises = [];
    const startedAt = new Date().toISOString();

    for (let idx = 0; idx < navItems.length; idx++) {
      const nav = navItems[idx];
      const chapterMsg =
        `正在收集第 ${idx + 1}/${navItems.length} 个章节：${nav.fullTitle}`;
      log(chapterMsg);
      if (updateStatus) updateStatus(chapterMsg);

      // 点击左侧“习题”小节，跳转到该章节的习题页面
      nav.el.click();

      // 等待 tabbar + question 出现
      await waitFor('.tabbar .curent');
      await waitFor('.question .title');
      await sleep(500);

      // 跳到第 1 题
      await showAllAnswers();
      await goToFirstQuestion();
      await sleep(400);

      const total = getTotalCount();
      if (!Number.isFinite(total) || total <= 0) {
        log('章节无题目或无法识别题目数量，跳过。', nav);
        continue;
      }

      for (let q = 1; q <= total; q++) {
        const msg =
          `章节 ${idx + 1}/${navItems.length}《${nav.sectionTitle}》题目 ${q}/${total}`;
        if (updateStatus) updateStatus(msg);
        log(msg);

        await waitFor('.question .title');
        await sleep(200);

        const qData = extractCurrentQuestion(nav);
        if (qData) {
          exercises.push(qData);
        } else {
          log('未能解析当前题目，已跳过。');
        }

        var midResult = {
          courseTitle,
          startedAt,
          exercises
        };

        if (updateResult) updateResult(JSON.stringify(midResult));

        if (q < total) {
          // 切下一题
          const prevIndex = getCurrentIndex();
          clickNext();

          // 等待题号变化，避免切太快
          let guard = 0;
          while (guard < 50) {
            await sleep(200);
            const cur = getCurrentIndex();
            if (cur !== prevIndex) break;
            guard++;
          }
        }
      }
    }

    const result = {
      courseTitle,
      startedAt,
      finishedAt: new Date().toISOString(),
      exercises
    };

    return result;
  }

  /** 初始化：文档加载完后插入 UI */
  function init() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      createPanel();
    } else {
      document.addEventListener('DOMContentLoaded', createPanel);
    }
  }

  init();
})();
