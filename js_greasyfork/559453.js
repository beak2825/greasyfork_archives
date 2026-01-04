// ==UserScript==
// @name         query与debug信息校验
// @namespace    federation-debug-info-parser
// @version      5.17.2
// @author       修越
// @license      修越
// @description  1.提取抓取query与debug信息query并校验异常；2.展示召回原因与评估结果；3.联动评估模板与搜索结果；4.支持看后搜视频/直播；5.提供功能说明tab。
// @match        https://search.bytedance.net/garr/fetch_review*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559453/query%E4%B8%8Edebug%E4%BF%A1%E6%81%AF%E6%A0%A1%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/559453/query%E4%B8%8Edebug%E4%BF%A1%E6%81%AF%E6%A0%A1%E9%AA%8C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /***********************
   * 功能说明文案
   ***********************/
  const FEATURE_DESC_TEXT = `
  <h3 style="margin:4px 0;">插件功能说明</h3>

  <ol>
    <li>
      <b>校验抓取数据是否异常并给出提示</b>，包含以下情况：
      <ol>
        <li>query 数量不为 8 个。</li>
        <li>debug 信息为空，或 debug 信息错位，与抓取 query 不对齐。</li>
      </ol>
    </li>

    <li>
      <b>抓取环境列说明：</b>
      <ol>
        <li>
          <b>query：</b>点击可查看当前 query 的结果承接。
        </li>
        <li>
          <b>问题类型：</b>
          <ol>
            <li>提交前：优先展示大模型标注的结果；若未使用智能评测，则提示 <b>“未提交”</b>。</li>
            <li>提交后：展示人工提交的内容，鼠标 hover 显示大模型标注的结果。</li>
          </ol>
        </li>
        <li>
          <b>单元格联动：</b>点击单元格内任意位置，左侧评估模板将自动跳转至对应的 query 位置。
        </li>
      </ol>
    </li>

    <li>
      <b>debug 环境列说明：</b>
      <ol>
        <li>
          提取并展示召回原因，并翻译为中文类型；鼠标 hover 可查看召回的原始内容。
        </li>
      </ol>
    </li>
  </ol>

  <hr style="margin:8px 0;" />

  <div style="color:#666;font-size:12px;">
    该脚本基于 JavaScript 实现，针对 <b>抖音-猜搜</b> 场景定制化开发。<br/>
    因不同业务debug信息返回格式不同，其他业务如有类似需求，可联系：<b>修越</b>
  </div>
  `;

  /***********************
   * XHR 劫持
   ***********************/
  const rawOpen = XMLHttpRequest.prototype.open;
  const rawSend = XMLHttpRequest.prototype.send;

  let panelExists = false;
  let collectedDataV1 = [];
  let collectedDataV2 = [];
  let collectedProblemsMap = [];
  let taskIdV1 = null;
  const pendingV2Responses = [];
  let videoUrl = null;

  let activeTab = 'query'; 
  let contentDisplayState = 'block';

  const instantRecallList = [
    '看后搜','看后搜bert','aweme_sar_recall','viking_simple_aweme_sar_bert_batch_recall',
    'aweme_passive_sar_recall','视频详情页框词','poi_name_group_recall_v2','poi_sar_toppv_recall',
    '话题词召回','aweme_hashtag_recall','viking_aweme_sar_recall','aweme_duanju_recall',
    'title_bert_viking_pink_recall','aweme_sar_comment_entity_review_recall',
    'aweme_sar_comment_related_top_recall'
  ];
  const originalSearchKeyword = 'original_search_history_recall';

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__url = url;
    return rawOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (this.__url?.includes('/admin/get_evaluate_task/federation_debug_info')) {
      this.addEventListener('load', () => {
        try {
          parseV1(JSON.parse(this.responseText));
          processPendingV2();
        } catch (e) {
          console.error('[v1] parse error', e);
        }
      });
    }

    if (this.__url?.includes('/admin/get_evaluate_task_by_env_v2')) {
      this.addEventListener('load', () => {
        pendingV2Responses.push(this.responseText);
      });
    }

    if (this.__url?.includes('/admin/tcs/get_evaluate_mission_task_v2/')) {
      this.addEventListener('load', () => {
        parseMissionTaskScore(JSON.parse(this.responseText), 'mission');
      });
    }

    if (this.__url?.includes('/admin/tcs/get_task_reviewer_v2')) {
      this.addEventListener('load', () => {
        parseMissionTaskScore(JSON.parse(this.responseText), 'reviewer');
      });
    }

    return rawSend.apply(this, args);
  };

  /***********************
   * 数据解析
   ***********************/
  function parseMissionTaskScore(res, source) {
    try {
      let data = res?.data;
      if (typeof data === 'string') data = JSON.parse(data);
      if (data?.reviewer) data = data.reviewer;

      const envs = data?.task_score?.env;
      if (Array.isArray(envs)) {
        collectedProblemsMap = envs.map(envX =>
          (envX.env || []).map(e => ({
            problem: e.problem || '未评估',
            query_type: e.query_type || '未勾选类型',
            source: source || '人工'
          }))
        );
      }
      if (data?.ai_task_score) window.__fd_ai_score__ = data.ai_task_score;
      if (panelExists) updatePanel();
    } catch (e) {
      console.error('[mission_task_score] parse error', e);
    }
  }

  /***********************
   * 修复后的召回判断函数
   ***********************/
  const SPECIAL_AD = 'ad_user_ecom_product_extend_query_recall';
  const SPECIAL_LIFE = 'darwin_life_search_after_read_recall';

  function parseRecallTypes(reason = '') {
    let hasAd = false;
    let hasEcom = false;
    let hasLife = false;

    let restReason = reason;

    if (reason.includes(SPECIAL_AD)) {
      hasAd = true;
      restReason = restReason.replaceAll(SPECIAL_AD, '');
    }

    if (reason.includes(SPECIAL_LIFE)) {
      hasLife = true;
      restReason = restReason.replaceAll(SPECIAL_LIFE, '');
    }

    if (restReason.includes('ad_')) hasAd = true;
    if (restReason.includes('ecom')) hasEcom = true;
    if (restReason.includes('life') || restReason.includes('poi')) hasLife = true;

    const redText = [];
    if (hasAd) redText.push('广告召回');
    if (hasEcom) redText.push('电商召回');
    if (hasLife) redText.push('生服召回');

    return { redText: redText.join(',') };
  }

  function parseV1(res) {
    const task = res?.data?.task;
    if (!task) return;
    taskIdV1 = String(task.id);

    videoUrl = task.crawl_result?.[0]?.debug_info?.tab_1_video?.html_1_url || null;

    collectedDataV1 = (task.crawl_result || []).filter(Boolean).map(c =>
      c?.debug_info?.tab_2_query_info?.table_2_query?.map(t => {
        const query = t?.item_1_ecom_query || '';
        const reasonRaw = t?.item_3_reasons || '';
        const { redText } = parseRecallTypes(reasonRaw);

        const greenReasons = [];
        if (instantRecallList.some(k => reasonRaw.includes(k))) greenReasons.push('即时看后搜');
        if (reasonRaw.includes(originalSearchKeyword)) greenReasons.push('原始搜索历史召回');
        if (reasonRaw.includes('hotwords') || reasonRaw.includes('shortterm')) greenReasons.push('热点召回');

        return {
          query,
          redText,
          greenText: greenReasons.join(','),
          reasonRaw
        };
      }) || []
    );

    ensurePanel();
    contentDisplayState = 'block';
    activeTab = 'query';
    updateVideoButtonText();
    updatePanel();
  }

  function processPendingV2() {
    if (!taskIdV1) return;
    const remain = [];

    for (const txt of pendingV2Responses) {
      let obj;
      try {
        obj = JSON.parse(txt);
        if (typeof obj.data === 'string') obj.data = JSON.parse(obj.data);
      } catch {
        continue;
      }

      const task = obj?.data?.task;
      if (!task || String(task.id) !== taskIdV1) {
        remain.push(txt);
        continue;
      }

      collectedDataV2 = (task.crawl_result || []).map(c => {
        const arr = Array.isArray(c.data) ? c.data : [c.data].filter(Boolean);
        return arr.map(d => ({
          html: d?.display?.title || '',
          text: extractText(d?.display?.title)
        }));
      });
    }

    pendingV2Responses.length = 0;
    pendingV2Responses.push(...remain);

    while (collectedDataV2.length < collectedDataV1.length) collectedDataV2.push([]);

    ensurePanel();
    updatePanel();
  }

  function extractText(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }

  /***********************
   * UI 面板等原样保持
   ***********************/
  function ensurePanel() {
    if (panelExists) return;

    const panel = document.createElement('div');
    panel.id = '__fd_panel__';
    panel.style.cssText = `position:fixed;right:20px;bottom:20px;width:950px;
      max-height:650px;background:#fff;z-index:999999;
      border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.25);
      display:flex;flex-direction:column;font-size:13px;`;

    panel.innerHTML = `
      <div style="padding:8px 12px;border-bottom:1px solid #eee;display:flex;">
        <div id="__fd_tip__" style="flex:1;font-weight:bold;"></div>
        <div>
          <button id="__fd_toggle__">展开/收起</button>
          <button id="__fd_tab_query__" style="margin-left:8px;">query信息</button>
          <button id="__fd_tab_video__" style="margin-left:8px;">看后搜视频</button>
          <button id="__fd_tab_desc__" style="margin-left:8px;">功能说明</button>
        </div>
      </div>
      <div id="__fd_content__" style="padding:8px;overflow:auto;"></div>
    `;

    document.body.appendChild(panel);
    panelExists = true;

    document.getElementById('__fd_toggle__').onclick = () => {
      const c = document.getElementById('__fd_content__');
      contentDisplayState = c.style.display === 'none' ? 'block' : 'none';
      c.style.display = contentDisplayState;
    };

    document.getElementById('__fd_tab_query__').onclick = () => {
      contentDisplayState = 'block';
      activeTab = 'query';
      document.getElementById('__fd_content__').style.display = contentDisplayState;
      updatePanel();
    };

    document.getElementById('__fd_tab_video__').onclick = () => {
      contentDisplayState = 'block';
      activeTab = 'video';
      document.getElementById('__fd_content__').style.display = contentDisplayState;
      updatePanel();
    };

    document.getElementById('__fd_tab_desc__').onclick = () => {
      contentDisplayState = 'block';
      activeTab = 'desc';
      document.getElementById('__fd_content__').style.display = contentDisplayState;
      updatePanel();
    };
  }

  function updateVideoButtonText() {
    const btnVideo = document.getElementById('__fd_tab_video__');
    if (!btnVideo || !videoUrl) return;

    const div = document.createElement('div');
    div.innerHTML = videoUrl;
    const aTag = div.querySelector('a');

    let displayText = '看后搜视频';
    let videoType = 'unknown';
    let videoId = '';

    if (aTag?.href) {
      const hrefLink = aTag.href;
      const roomMatch = hrefLink.match(/[?&]roomid=(\d+)/i);
      const itemMatch = hrefLink.match(/[?&]itemids=(\d+)/i);

      if (roomMatch) {
        displayText = `直播：${roomMatch[1]}`;
        videoType = 'live';
        videoId = roomMatch[1];
      } else if (itemMatch) {
        displayText = `视频：${itemMatch[1]}`;
        videoType = 'video';
        videoId = itemMatch[1];
      }
    }

    btnVideo.textContent = displayText;
    btnVideo.dataset.videoType = videoType;
    btnVideo.dataset.videoId = videoId;
  }

  function updatePanel() {
    const content = document.getElementById('__fd_content__');
    const tip = document.getElementById('__fd_tip__');
    if (!content || !tip) return;

    // 校验提示
    const tips = [];
    for (let i = 0; i < collectedDataV1.length; i++) {
      if (!collectedDataV1[i]?.length) tips.push(`<span style="color:red;">环境${i + 1}的debug信息为空，请抛弃</span>`);
      if ((collectedDataV2[i]?.length || 0) !== 8) tips.push(`<span style="color:red;">环境${i + 1}的召回query数量不为8个，请抛弃</span>`);
    }
    if (!tips.length) tips.push('<span style="color:green;">召回8个query，debug信息齐全，请正常评估</span>');
    tip.innerHTML = tips.join('<br>');

    content.innerHTML = '';
    if (activeTab === 'desc') {
      content.innerHTML = FEATURE_DESC_TEXT;
      return;
    }

    if (activeTab === 'video') {
      const btnVideo = document.getElementById('__fd_tab_video__');
      const type = btnVideo.dataset.videoType;
      const vid = btnVideo.dataset.videoId;

      if (type && vid) {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width:100%;height:600px;border:0;';
        if (type === 'live') {
          iframe.src = `https://douyin-debug.bytedance.net/aweme-debug/landing?pageType=5&itemIds=${vid}&appId=1128`;
        } else {
          const div = document.createElement('div');
          div.innerHTML = videoUrl;
          iframe.src = div.querySelector('a')?.href || '';
        }
        content.appendChild(iframe);
      } else {
        content.innerHTML = '<span style="color:red;">视频链接不存在或解析失败</span>';
      }
      return;
    }

    // 原 query 表格逻辑保持不变
    const envCount = collectedDataV1.length;
    const table = document.createElement('table');
    table.style.cssText = 'border-collapse:collapse;width:100%;table-layout:fixed;';
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    trh.appendChild(createTh('#', '40px'));

    for (let e = 0; e < envCount; e++) {
      trh.appendChild(createTh(`抓取-环境${e + 1}`));
      trh.appendChild(createTh(`debug-环境${e + 1}`));
    }
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const maxLen = Math.max(...collectedDataV1.map(a => a.length), ...collectedDataV2.map(a => a.length));

    for (let i = 0; i < maxLen; i++) {
      const tr = document.createElement('tr');
      tr.appendChild(createTd(i + 1));

      for (let e = 0; e < envCount; e++) {
        const qObj = collectedDataV2[e]?.[i];
        const debugObj = collectedDataV1[e]?.[i] || {};
        const problemObj = collectedProblemsMap[e]?.[i] || {};
        const aiObj = window.__fd_ai_score__?.env?.[e]?.env?.[i];

        const td = document.createElement('td');
        td.style.cssText = 'border:1px solid #ccc;padding:4px;font-size:12px;cursor:pointer;';
        td.innerHTML = qObj?.html || qObj?.text || '';

        const span = document.createElement('div');
        if (problemObj.problem && problemObj.problem !== '未评估') {
          span.textContent = `${problemObj.problem} ---- ${problemObj.query_type}`;
          span.style.color = problemObj.problem === '无问题' ? 'gray' : 'red';
          if (aiObj) span.title = `【大模型打分】${aiObj.problem} ---- ${aiObj.query_type}`;
        } else if (aiObj) {
          span.textContent = `大模型打分：${aiObj.problem} ---- ${aiObj.query_type}`;
          span.style.color = 'gray';
        } else {
          span.textContent = '未提交';
          span.style.color = 'gray';
        }
        td.appendChild(span);

        td.addEventListener('click', () => {
          const li = document.querySelector(`ul.ant-pagination li.ant-pagination-item-${e + 1}`);
          li?.querySelector('a')?.click();

          const tryScroll = () => {
            const el = document.getElementById(`root_env_${e}_env_${i}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.style.outline = '2px solid orange';
              setTimeout(() => (el.style.outline = ''), 2000);
            } else setTimeout(tryScroll, 100);
          };
          tryScroll();
        });

        tr.appendChild(td);

        const td2 = document.createElement('td');
        td2.style.cssText = 'border:1px solid #ccc;padding:4px;font-size:12px;';
        if (debugObj.query) td2.textContent = debugObj.query;
        if (debugObj.greenText) {
          const div = document.createElement('div');
          div.textContent = debugObj.greenText;
          div.style.color = 'green';
          td2.appendChild(div);
        }
        if (debugObj.redText) {
          const div = document.createElement('div');
          div.textContent = debugObj.redText;
          div.style.color = 'red';
          td2.appendChild(div);
        }
        if (debugObj.reasonRaw) td2.title = debugObj.reasonRaw;

        tr.appendChild(td2);
      }
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    content.appendChild(table);
  }

  function createTh(text, width = '') {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.cssText = 'border:1px solid #ccc;padding:4px;background:#fafafa;font-weight:bold;';
    if (width) th.style.width = width;
    return th;
  }

  function createTd(text) {
    const td = document.createElement('td');
    td.textContent = text;
    td.style.cssText = 'border:1px solid #ccc;padding:4px;font-size:12px;';
    return td;
  }
})();
