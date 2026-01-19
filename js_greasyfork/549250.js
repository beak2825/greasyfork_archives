// ==UserScript==
// @name         CodeChef/QOJ/Codeforces → VJudge/Luogu Redirect
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  在 CodeChef、QOJ、Codeforces 题目页提供跳转到对应 VJudge/Luogu 题目的按钮（可切换为自动跳转）,修复了 Codeforces Div1/Div2 分开举办比赛的洛谷跳转
// @author       znzryb
// @match        https://www.codechef.com/problems/*
// @match        https://qoj.ac/problem/*
// @match        https://qoj.ac/contest/*/problem/*
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://codeforces.com/problemset/problem/*/*
// @match        https://codeforces.com/gym/*/problem/*
// @grant        none
// @license      GPL-3.0
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549250/CodeChefQOJCodeforces%20%E2%86%92%20VJudgeLuogu%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/549250/CodeChefQOJCodeforces%20%E2%86%92%20VJudgeLuogu%20Redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** 工具函数：创建并挂载按钮（避免重复） */
  function createJumpButton(targetUrl, label = 'Jump to VJudge', buttonId = 'vj-redirect-btn', topOffset = '100px') {
    if (!targetUrl) return;
    if (document.getElementById(buttonId)) return;
    const btn = document.createElement('button');
    btn.id = buttonId;
    btn.textContent = label;
    Object.assign(btn.style, {
      position: 'fixed',
      top: topOffset,
      right: '20px',
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      zIndex: 10000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    });
    btn.onmouseenter = () => (btn.style.opacity = '0.9');
    btn.onmouseleave = () => (btn.style.opacity = '1');
    btn.addEventListener('click', () => {
      window.open(targetUrl, '_blank');
    });
    document.body.appendChild(btn);
  }

  /** 检测当前是否为单独的 Div2 比赛 */
  function isStandaloneDivision2() {
    // 获取比赛标题元素
    const contestNameElement = document.querySelector('.contest-name') || 
                               document.querySelector('#sidebar .rtable a');
    if (!contestNameElement) return false;
    
    const contestName = contestNameElement.textContent.trim();
    
    // 检查是否包含 "Div. 2" 但不包含 "+"（排除联合比赛）
    if (contestName.includes('Div. 2') && !contestName.includes('+')) {
      // 排除 Div. 3、Div. 4 等
      if (contestName.includes('Div. 3') || contestName.includes('Div. 4')) {
        return false;
      }
      return true;
    }
    
    return false;
  }

  /** 提取比赛名称的关键标识（如 "Round 1069"） */
  function extractRoundIdentifier(contestName) {
    // 尝试提取 "Round XXX" 或 "Educational Codeforces Round XXX" 等
    const roundMatch = contestName.match(/Round\s+(\d+)/i);
    if (roundMatch) {
      return `Round ${roundMatch[1]}`;
    }
    
    // 其他可能的格式
    const eduMatch = contestName.match(/Educational.*?Round\s+(\d+)/i);
    if (eduMatch) {
      return `Educational Round ${eduMatch[1]}`;
    }
    
    return null;
  }

  /** 验证 Div1 比赛是否存在并比较比赛名称 */
  async function verifyDiv1Contest(div1ContestId, div2ContestName) {
    try {
      // 获取 Div1 比赛页面
      const response = await fetch(`https://codeforces.com/contest/${div1ContestId}`);
      if (!response.ok) return false;
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // 提取 Div1 比赛名称
      const div1NameElement = doc.querySelector('.contest-name') || 
                             doc.querySelector('#sidebar .rtable a');
      if (!div1NameElement) return false;
      
      const div1ContestName = div1NameElement.textContent.trim();
      
      // 比较比赛名称的关键标识
      const div2Identifier = extractRoundIdentifier(div2ContestName);
      const div1Identifier = extractRoundIdentifier(div1ContestName);
      
      if (div2Identifier && div1Identifier && div2Identifier === div1Identifier) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('验证 Div1 比赛失败:', error);
      return false;
    }
  }

  /** 获取 Div1 比赛的题目列表 */
  async function fetchDiv1Problems(div1ContestId) {
    try {
      // 方法1：使用 Codeforces API
      const apiUrl = `https://codeforces.com/api/contest.standings?contestId=${div1ContestId}&from=1&count=1`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('API 请求失败');
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.result && data.result.problems) {
        // 返回题目数组，每个题目包含 index 和 name
        return data.result.problems.map(problem => ({
          index: problem.index,
          name: problem.name
        }));
      }
      
      throw new Error('API 返回数据格式错误');
    } catch (error) {
      console.error('获取 Div1 题目列表失败:', error);
      
      // 方法2：解析比赛页面（备用方案）
      try {
        const response = await fetch(`https://codeforces.com/contest/${div1ContestId}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const problems = [];
        const problemLinks = doc.querySelectorAll('.problems td.id a');
        
        problemLinks.forEach(link => {
          const index = link.textContent.trim();
          const row = link.closest('tr');
          const nameElement = row.querySelector('td:nth-child(2) a');
          if (nameElement) {
            problems.push({
              index: index,
              name: nameElement.textContent.trim()
            });
          }
        });
        
        return problems;
      } catch (fallbackError) {
        console.error('备用方案也失败:', fallbackError);
        return [];
      }
    }
  }

  /** 查找匹配的 Div1 题目 */
  function findMatchingDiv1Problem(currentProblemName, div1Problems) {
    // 清理题目名称（移除题号前缀）
    const cleanName = (name) => {
      return name.replace(/^[A-Z]\d?\.\s*/, '').trim();
    };
    
    const cleanCurrentName = cleanName(currentProblemName);
    
    for (const problem of div1Problems) {
      const cleanDiv1Name = cleanName(problem.name);
      if (cleanCurrentName === cleanDiv1Name) {
        return problem.index;
      }
    }
    
    return null;
  }

  /** 解析当前站点并生成对应的 VJudge URL */
  const { host, pathname } = window.location;

  // —— CodeChef ————————————————————————————————————————————————
  // URL 一般为 /problems/ABCDEF 或 /problems/ABCDEF?tab=statement
  if (host.includes('codechef.com')) {
    const parts = pathname.split('/').filter(Boolean); // ['problems','ABCDEF']
    let problemCode = parts[1] || '';                  // 索引 1 为题号
    // 去掉可能存在的查询串（通常问题代码不含 ?，此处保险处理）
    problemCode = problemCode.split('?')[0];
    if (!problemCode) return;
    const vjudgeUrl = `https://vjudge.net/problem/CodeChef-${problemCode}`;
    // === AUTO REDIRECT（可选）===
    // 如果需要自动跳转，取消下面一行注释：
    // window.location.href = vjudgeUrl;
    // 否则创建按钮
    createJumpButton(vjudgeUrl, 'Jump to VJudge');
    return;
  }

  // —— QOJ ————————————————————————————————————————————————
  // 支持：
  //   /problem/14548
  //   /contest/2521/problem/14501
  if (host === 'qoj.ac') {
    let qojPid = '';
    // 形式1：/problem/:pid
    let m = pathname.match(/^\/problem\/(\d+)(?:\/)?$/);
    if (m) {
      qojPid = m[1];
    } else {
      // 形式2：/contest/:cid/problem/:pid
      m = pathname.match(/^\/contest\/(\d+)\/problem\/(\d+)(?:\/)?$/);
      if (m) {
        qojPid = m[2];
      }
    }
    if (!qojPid) return;
    const vjudgeUrl = `https://vjudge.net/problem/QOJ-${qojPid}`;
    // === AUTO REDIRECT（可选）===
    // 如果需要自动跳转，取消下面一行注释：
    // window.location.href = vjudgeUrl;
    createJumpButton(vjudgeUrl, 'Jump to VJudge');
    return;
  }

  // —— Codeforces ————————————————————————————————————————————————
  // 支持：
  //   /contest/2120/problem/D
  //   /problemset/problem/2120/D
  //   /gym/105578/problem/E
  if (host === 'codeforces.com') {
    let contestId = '';
    let problemIndex = '';
    let isGym = false;
    let isContest = false;

    // 形式1：/contest/:cid/problem/:index
    let m = pathname.match(/^\/contest\/(\d+)\/problem\/([A-Z]\d?)(?:\/)?$/i);
    if (m) {
      contestId = m[1];
      problemIndex = m[2];
      isContest = true;
    } else {
      // 形式2：/problemset/problem/:cid/:index
      m = pathname.match(/^\/problemset\/problem\/(\d+)\/([A-Z]\d?)(?:\/)?$/i);
      if (m) {
        contestId = m[1];
        problemIndex = m[2];
      } else {
        // 形式3：/gym/:cid/problem/:index
        m = pathname.match(/^\/gym\/(\d+)\/problem\/([A-Z]\d?)(?:\/)?$/i);
        if (m) {
          contestId = m[1];
          problemIndex = m[2];
          isGym = true;
        }
      }
    }

    if (!contestId || !problemIndex) return;

    // 处理 Div2 -> Div1 转换（仅针对 contest 页面）
    if (isContest && isStandaloneDivision2()) {
      (async () => {
        try {
          // 获取当前题目名称
          const problemTitleElement = document.querySelector('.problem-statement .title') ||
                                     document.querySelector('.header .title');
          if (!problemTitleElement) {
            throw new Error('无法获取题目标题');
          }
          const currentProblemName = problemTitleElement.textContent.trim();

          // 获取当前比赛名称
          const contestNameElement = document.querySelector('.contest-name') ||
                                    document.querySelector('#sidebar .rtable a');
          if (!contestNameElement) {
            throw new Error('无法获取比赛名称');
          }
          const div2ContestName = contestNameElement.textContent.trim();

          // 计算 Div1 contest ID
          const div1ContestId = parseInt(contestId) - 1;

          // 验证 Div1 比赛是否存在且相关
          const isRelated = await verifyDiv1Contest(div1ContestId, div2ContestName);

          if (isRelated) {
            // 获取 Div1 题目列表
            const div1Problems = await fetchDiv1Problems(div1ContestId);

            if (div1Problems.length > 0) {
              // 查找匹配的题目
              const matchedIndex = findMatchingDiv1Problem(currentProblemName, div1Problems);

              if (matchedIndex) {
                // 找到匹配的 Div1 题目，使用 Div1 链接
                console.log(`找到对应的 Div1 题目: ${div1ContestId}${matchedIndex}`);
                const luoguUrl = `https://www.luogu.com.cn/problem/CF${div1ContestId}${matchedIndex}`;
                const vjudgeUrl = `https://vjudge.net/problem/CodeForces-${contestId}${problemIndex}`;

                createJumpButton(luoguUrl, 'Jump to Luogu', 'luogu-redirect-btn', '100px');
                createJumpButton(vjudgeUrl, 'Jump to VJudge', 'vj-redirect-btn', '150px');
                return;
              }
            }
          }

          // 如果没有找到对应的 Div1 题目，使用原始链接
          console.log('未找到对应的 Div1 题目，使用原始链接');
          throw new Error('使用原始链接');
        } catch (error) {
          console.log('Div2->Div1 转换失败，使用原始链接:', error.message);
          // 降级：使用原始的 Div2 链接
          const luoguUrl = `https://www.luogu.com.cn/problem/CF${contestId}${problemIndex}`;
          const vjudgeUrl = `https://vjudge.net/problem/CodeForces-${contestId}${problemIndex}`;

          createJumpButton(luoguUrl, 'Jump to Luogu', 'luogu-redirect-btn', '100px');
          createJumpButton(vjudgeUrl, 'Jump to VJudge', 'vj-redirect-btn', '150px');
        }
      })();
      return;
    }

    // 普通情况：直接生成跳转链接
    // Gym 题目在 VJudge 上格式为 Gym-105578E（无分隔符）
    // 普通题目格式为 CodeForces-2120D
    const luoguUrl = `https://www.luogu.com.cn/problem/CF${contestId}${problemIndex}`;
    const vjudgeUrl = isGym
      ? `https://vjudge.net/problem/Gym-${contestId}${problemIndex}`
      : `https://vjudge.net/problem/CodeForces-${contestId}${problemIndex}`;

    // === AUTO REDIRECT（可选）===
    // 如果需要自动跳转到 Luogu，取消下面一行注释：
    // window.location.href = luoguUrl;
    // 如果需要自动跳转到 VJudge，取消下面一行注释：
    // window.location.href = vjudgeUrl;

    // 创建两个按钮
    createJumpButton(luoguUrl, 'Jump to Luogu', 'luogu-redirect-btn', '100px');
    createJumpButton(vjudgeUrl, 'Jump to VJudge', 'vj-redirect-btn', '150px');
    return;
  }

  // 其他域名不处理
})();

