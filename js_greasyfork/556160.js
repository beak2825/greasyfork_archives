// ==UserScript==
// @name         B站批量取关未更新UP
// @version      1.3.0
// @description  并发扫描关注列表；若连续10个UP无动态/被反爬则暂停，手动过图后可继续；扫描结束后自动复核无动态名单；最后慢速取关
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @namespace https://greasyfork.org/users/1532336
// @downloadURL https://update.greasyfork.org/scripts/556160/B%E7%AB%99%E6%89%B9%E9%87%8F%E5%8F%96%E5%85%B3%E6%9C%AA%E6%9B%B4%E6%96%B0UP.user.js
// @updateURL https://update.greasyfork.org/scripts/556160/B%E7%AB%99%E6%89%B9%E9%87%8F%E5%8F%96%E5%85%B3%E6%9C%AA%E6%9B%B4%E6%96%B0UP.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /************** 可调参数 **************/
  const INACTIVE_DAYS = 90;          // 超过多少天算不活跃
  const CONCURRENCY   = 6;           // 并发数量
  const PAGE_SIZE     = 50;          // 拉关注列表每页数量（B站最大50）
  const NO_DYNAMIC_THRESHOLD = 10;   // 连续多少个“无动态/被反爬”就停
  const SCAN_MIN_MS   = 400;         // 扫描时最短间隔（并发下可以短）
  const SCAN_MAX_MS   = 1300;        // 扫描时最长间隔
  const RECHECK_MIN_MS = 800;        // 复核时最短间隔（保守点）
  const RECHECK_MAX_MS = 2000;       // 复核时最长间隔
  const UNF_MIN_MS    = 1800;        // 取关最短间隔
  const UNF_MAX_MS    = 4200;        // 取关最长间隔
  const DRY_RUN       = false;       // true = 不真的取关，只演示
  const AUTO_RECHECK  = true;        // 首轮扫完后自动复核一次
  /*************************************/

  /************** UI **************/
  GM_addStyle(`
    #bili-unfollow-panel{
      position:fixed;top:80px;right:20px;z-index:999999;background:#fff;border:1px solid #ddd;
      padding:10px 12px;border-radius:8px;font-size:12px;box-shadow:0 4px 12px rgba(0,0,0,.08);
      width:280px;
    }
    #bili-unfollow-panel button{
      margin-top:6px;width:100%;padding:4px 0;
    }
    #bili-unfollow-log{
      max-height:260px;overflow-y:auto;margin-top:6px;
      font-family:ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;
    }
    #bili-unfollow-status{margin-top:4px;color:#666;}
    #bili-unfollow-stats{margin-top:4px;line-height:1.3;color:#333;}
  `);

  const panel = document.createElement("div");
  panel.id = "bili-unfollow-panel";
  panel.innerHTML = `
    <div><b>批量取关(B站)</b></div>
    <div style="margin-top:4px;">规则：最近 <b>${INACTIVE_DAYS}</b> 天无更新 → 不活跃</div>
    <div id="bili-unfollow-status">状态：空闲</div>
    <div id="bili-unfollow-stats"></div>
    <button id="bili-btn-scan">① 拉取并扫描（并发6）</button>
    <button id="bili-btn-continue" disabled>①-2 继续扫描（过图后点）</button>
    <button id="bili-btn-recheck" disabled>①-3 复核“无动态”名单</button>
    <button id="bili-btn-unfollow" disabled>② 开始取关（慢速）</button>
    <button id="bili-btn-export" disabled>导出结果（CSV）</button>
    <div id="bili-unfollow-log"></div>
  `;
  document.body.appendChild(panel);

  const statusEl = document.getElementById("bili-unfollow-status");
  const statsEl  = document.getElementById("bili-unfollow-stats");
  const logBox   = document.getElementById("bili-unfollow-log");
  const btnScan     = document.getElementById("bili-btn-scan");
  const btnContinue = document.getElementById("bili-btn-continue");
  const btnRecheck  = document.getElementById("bili-btn-recheck");
  const btnUnfollow = document.getElementById("bili-btn-unfollow");
  const btnExport   = document.getElementById("bili-btn-export");

  function setStatus(s){ statusEl.textContent = "状态：" + s; }
  function log(msg){
    console.log("[bili-unfollow]", msg);
    logBox.textContent += msg + "\n";
    logBox.scrollTop = logBox.scrollHeight;
  }

  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function randSleep(min,max){ return sleep(randInt(min,max)); }

  /************** 全局状态 **************/
  let gAllFollowings = [];        // 全部关注UP
  let gTaskQueue = [];            // 待扫描的UP（剩余队列）
  let gInactiveMap = new Map();   // { mid -> {mid, uname, ts} } 确认不活跃
  let gNoDynFirst = [];           // 首轮“无动态”的UP
  let gNoDynFinal = [];           // 复核后仍“无动态”的UP
  let gIsScanning = false;
  let gIsPaused   = false;        // 连续10无动态 或 被反爬 暂停
  let gConsecutiveNoDyn = 0;      // 全局连续“无动态/被反爬”计数
  let gIsRechecking = false;
  let gIsUnfollowing = false;

  function setStats(){
    statsEl.innerHTML =
      `关注总数：${gAllFollowings.length || "-"}<br>` +
      `不活跃：${gInactiveMap.size}<br>` +
      `首轮无动态：${gNoDynFirst.length}<br>` +
      `复核后仍无动态：${gNoDynFinal.length}<br>` +
      `剩余待扫：${gTaskQueue.length}<br>` +
      `当前连续无动态：${gConsecutiveNoDyn}/${NO_DYNAMIC_THRESHOLD}`;
  }

  /************** HTTP **************/
  function httpGet(url){
    return new Promise((resolve, reject)=>{
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (res)=>{
          const txt = res.responseText || "";
          try {
            const j = JSON.parse(txt);
            resolve(j);
          } catch (e) {
            reject(new Error("NON_JSON"));  // B站弹图/反爬
          }
        },
        onerror: reject
      });
    });
  }
  function httpPost(url, data){
    return new Promise((resolve, reject)=>{
      GM_xmlhttpRequest({
        method: "POST",
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": "https://www.bilibili.com",
          "Referer": "https://www.bilibili.com/"
        },
        data: new URLSearchParams(data).toString(),
        onload: (res)=>{
          try {
            resolve(JSON.parse(res.responseText));
          } catch (e){
            reject(e);
          }
        },
        onerror: reject
      });
    });
  }

  /************** API **************/
  function getCsrf(){
    const m = document.cookie.match(/bili_jct=([^;]+)/);
    return m ? m[1] : "";
  }
  async function getSelfInfo(){
    const nav = await httpGet("https://api.bilibili.com/x/web-interface/nav");
    if (nav.code !== 0) throw new Error("获取登录信息失败：" + nav.message);
    return { mid: nav.data.mid, uname: nav.data.uname };
  }
  async function* getAllFollowingsGen(myMid){
    let pn = 1;
    while (true) {
      const url = `https://api.bilibili.com/x/relation/followings?vmid=${myMid}&pn=${pn}&ps=${PAGE_SIZE}&order=desc&order_type=attention&jsonp=jsonp`;
      const j = await httpGet(url);
      if (j.code !== 0) {
        log("获取关注失败：" + j.message);
        break;
      }
      const list = (j.data && j.data.list) || [];
      if (!list.length) break;
      for (const it of list) yield it;
      if (list.length < PAGE_SIZE) break;
      pn++;
      await randSleep(400, 900);
    }
  }
  async function getLastDynamicTs(uid){
    const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${uid}`;
    const j = await httpGet(url);
    if (j.code !== 0) {
      // 明确风控的一些码
      if ([-352, -412, -403, -401].includes(j.code)) {
        throw new Error("BLOCKED");
      }
      // 其他情况当无动态也行
      return null;
    }
    const items = (j.data && j.data.items) || [];
    let latest = 0;
    for (const it of items){
      const ts = it?.modules?.module_author?.pub_ts;
      if (ts && ts > latest) latest = ts;
    }
    return latest || null;
  }
  async function unfollow(uid){
    const csrf = getCsrf();
    if (!csrf) throw new Error("找不到 bili_jct，可能没登录");
    const r = await httpPost("https://api.bilibili.com/x/relation/modify", {
      fid: uid,
      act: 2,
      re_src: 11,
      csrf: csrf
    });
    return r;
  }

  /************** 并发扫描核心 **************/
  async function scanAll(){
    if (gIsScanning) { log("已经在扫描中了"); return; }

    // reset
    gAllFollowings = [];
    gTaskQueue     = [];
    gInactiveMap   = new Map();
    gNoDynFirst    = [];
    gNoDynFinal    = [];
    gConsecutiveNoDyn = 0;
    gIsPaused = false;

    btnScan.disabled     = true;
    btnContinue.disabled = true;
    btnRecheck.disabled  = true;
    btnUnfollow.disabled = true;
    btnExport.disabled   = true;
    logBox.textContent   = "";

    try {
      setStatus("初始化中...");
      const me = await getSelfInfo();
      log(`当前账号：${me.uname} (mid=${me.mid})`);
      setStatus("拉取关注列表...");
      for await (const up of getAllFollowingsGen(me.mid)){
        gAllFollowings.push(up);
      }
      log(`共获取到关注：${gAllFollowings.length} 个`);
      setStats();

      // 初始化队列
      gTaskQueue = gAllFollowings.map(up => ({ mid: up.mid, uname: up.uname }));
      gIsScanning = true;
      setStatus("扫描中（并发 " + CONCURRENCY + "）..");
      await runConcurrentScan();
      // 扫完了
      gIsScanning = false;
      setStatus("首轮扫描完成");
      setStats();

      if (AUTO_RECHECK && gNoDynFirst.length){
        await recheckNoDynamic();
      }

      finalizeAfterScan();
    } catch (e){
      log("扫描出错：" + e.message);
      setStatus("出错");
      // 出错也要允许继续
      btnScan.disabled = false;
      if (gTaskQueue.length) btnContinue.disabled = false;
    }
  }

  // 并发池：一边从队列里拿，一边处理；遇到“需要暂停”就停
  async function runConcurrentScan(){
    // 跑最多 CONCURRENCY 个 worker
    const workers = [];
    for (let i=0; i<CONCURRENCY; i++){
      workers.push(scanWorker(i));
    }
    await Promise.all(workers);
  }

  // 单个 worker
  async function scanWorker(id){
    while (true) {
      if (gIsPaused) {
        // 有worker已经触发了暂停，这个worker也停
        return;
      }
      const task = gTaskQueue.shift();
      if (!task) {
        // 队列空了，结束
        return;
      }

      const { mid, uname } = task;
      try {
        const ts = await getLastDynamicTs(mid);

        // 有动态
        if (ts !== null) {
          // 看看是不是超过天数
          const now = Math.floor(Date.now()/1000);
          const deadline = now - INACTIVE_DAYS*24*60*60;
          if (ts < deadline) {
            const lastDate = new Date(ts*1000).toISOString().slice(0,10);
            gInactiveMap.set(mid, { mid, uname, ts });
            log(`[不活跃] ${uname}(${mid}) 最近：${lastDate}`);
          } else {
            // 活跃，啥都不做
            // log(`[活跃] ${uname}(${mid})`);
          }
          // 有动态 → streak 清0
          gConsecutiveNoDyn = 0;
        } else {
          // 无动态
          gConsecutiveNoDyn++;
          pushOnce(gNoDynFirst, { mid, uname });
          log(`[无动态 ${gConsecutiveNoDyn}/${NO_DYNAMIC_THRESHOLD}] ${uname}(${mid})`);
        }

      } catch (e) {
        // 被反爬或返回HTML
        if (e.message === "NON_JSON" || e.message === "BLOCKED") {
          // 这个up没扫成功，先放回队列末尾，等你过图后再扫
          gTaskQueue.unshift({ mid, uname }); // 放回最前也行，这里放回最前面
          gConsecutiveNoDyn++;
          log(`🧩 ${uname}(${mid}) 被风控/需要图 → 当前连续=${gConsecutiveNoDyn}/${NO_DYNAMIC_THRESHOLD}`);
        } else {
          // 其他异常，按无动态处理
          gConsecutiveNoDyn++;
          pushOnce(gNoDynFirst, { mid, uname });
          log(`[异常当无动态 ${gConsecutiveNoDyn}/${NO_DYNAMIC_THRESHOLD}] ${uname}(${mid})`);
        }
      } finally {
        setStats();
        await randSleep(SCAN_MIN_MS, SCAN_MAX_MS);
      }

      // 统一判断要不要暂停
      if (gConsecutiveNoDyn >= NO_DYNAMIC_THRESHOLD) {
        gIsPaused = true;
        log(`⚠️ 连续 ${gConsecutiveNoDyn} 个无动态/被反爬，已暂停。请在B站页面过图/随便点点，然后点“继续扫描”。`);
        setStatus("已暂停，等待你过图...");
        btnContinue.disabled = false;
        return;
      }
    }
  }

  /************** 继续扫描（过图后点） **************/
  async function continueScan(){
    if (!gIsPaused) return;
    gIsPaused = false;
    gConsecutiveNoDyn = 0;
    btnContinue.disabled = true;
    setStatus("继续扫描中...");
    gIsScanning = true;
    await runConcurrentScan();
    gIsScanning = false;

    if (gTaskQueue.length === 0) {
      log("======== 首轮扫描完成 ========");
      setStatus("首轮扫描完成");
      setStats();
      if (AUTO_RECHECK && gNoDynFirst.length){
        await recheckNoDynamic();
      }
      finalizeAfterScan();
    } else {
      // 还有剩余，但这次没撞到连续阈值，是 worker 正常退出的情况
      // 直接再开一个“继续”按钮，或者你再点
      setStatus("还有剩余，若无验证码可继续扫描");
      btnContinue.disabled = false;
    }
  }

  /************** 复核无动态名单 **************/
  async function recheckNoDynamic(){
    if (gIsRechecking) return;
    if (!gNoDynFirst.length) {
      log("没有需要复核的‘无动态’UP。");
      return;
    }

    gIsRechecking = true;
    btnRecheck.disabled = true;
    setStatus("正在复核‘无动态’名单...");

    const now = Math.floor(Date.now()/1000);
    const deadline = now - INACTIVE_DAYS*24*60*60;

    gNoDynFinal = [];

    for (let i=0; i<gNoDynFirst.length; i++){
      const item = gNoDynFirst[i];
      const { mid, uname } = item;
      try {
        const ts = await getLastDynamicTs(mid);
        if (ts === null) {
          // 复核仍无动态
          gNoDynFinal.push({ mid, uname });
          log(`[复核/仍无动态] ${uname}(${mid})`);
        } else {
          const lastDate = new Date(ts*1000).toISOString().slice(0,10);
          if (ts < deadline) {
            gInactiveMap.set(mid, { mid, uname, ts });
            log(`[复核→不活跃] ${uname}(${mid}) 最近：${lastDate}`);
          } else {
            log(`[复核→活跃] ${uname}(${mid}) 最近：${lastDate}`);
          }
        }
      } catch (e) {
        // 复核也被挡了，就保守留着
        gNoDynFinal.push({ mid, uname });
        log(`[复核被挡→保留无动态] ${uname}(${mid})`);
      } finally {
        setStats();
        await randSleep(RECHECK_MIN_MS, RECHECK_MAX_MS);
      }
    }

    log("======== 复核完成 ========");
    setStatus("复核完成");
    gIsRechecking = false;
  }

  /************** 取关 **************/
  async function runUnfollow(){
    if (gIsUnfollowing) { log("正在取关中"); return; }
    const targets = mergeTargets();
    if (!targets.length){
      log("没有可取关的UP，请先扫描。");
      return;
    }

    gIsUnfollowing = true;
    btnUnfollow.disabled = true;
    setStatus("正在取关...");

    let success = 0, fail = 0;
    for (let i=0; i<targets.length; i++){
      const { mid, uname } = targets[i];
      if (DRY_RUN) {
        log(`(DRY-RUN) 跳过取关：${uname}(${mid}) [${i+1}/${targets.length}]`);
      } else {
        try {
          const r = await unfollow(mid);
          if (r.code === 0) {
            success++;
            log(`✅ 已取关 ${uname}(${mid}) [${i+1}/${targets.length}]`);
          } else {
            fail++;
            log(`❌ 取关失败 ${uname}(${mid})：${r.message} [${i+1}/${targets.length}]`);
          }
        } catch (e) {
          fail++;
          log(`❌ 取关异常 ${uname}(${mid})：${e.message} [${i+1}/${targets.length}]`);
        }
      }
      await randSleep(UNF_MIN_MS, UNF_MAX_MS);
    }

    log("======== 取关完成 ========");
    log(`计划：${targets.length}，成功：${success}，失败：${fail}`);
    setStatus("取关完成");
    gIsUnfollowing = false;
    btnUnfollow.disabled = false;
  }

  /************** 导出 **************/
  function exportCSV(){
    const rows = [];
    rows.push("mid,uname,reason");
    // 不活跃
    for (const v of gInactiveMap.values()){
      rows.push(`${v.mid},"${(v.uname||"").replace(/"/g,'""')}",inactive_${INACTIVE_DAYS}d`);
    }
    // 复核后仍无动态
    for (const it of gNoDynFinal){
      rows.push(`${it.mid},"${(it.uname||"").replace(/"/g,'""')}",no_dynamic_final`);
    }
    const blob = new Blob([rows.join("\n")], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bili_unfollow_targets.csv";
    a.click();
    URL.revokeObjectURL(url);
    log("已导出 bili_unfollow_targets.csv");
  }

  /************** 工具 **************/
  function pushOnce(arr, item){
    if (!arr.some(x => x.mid === item.mid)) arr.push(item);
  }
  function mergeTargets(){
    const m = new Map();
    for (const v of gInactiveMap.values()){
      m.set(v.mid, { mid: v.mid, uname: v.uname });
    }
    for (const it of gNoDynFinal){
      if (!m.has(it.mid)) m.set(it.mid, { mid: it.mid, uname: it.uname });
    }
    return Array.from(m.values());
  }
  function finalizeAfterScan(){
    // 扫描完成后
    const hasTargets = mergeTargets().length > 0;
    btnUnfollow.disabled = !hasTargets;
    btnExport.disabled   = !hasTargets;
    // 如果自动复核没开，而首轮有无动态，允许手动复核
    if (!AUTO_RECHECK && gNoDynFirst.length){
      btnRecheck.disabled = false;
    }
    // 可以重新扫
    btnScan.disabled = false;
  }

  /************** 事件 **************/
  btnScan.addEventListener("click", scanAll);
  btnContinue.addEventListener("click", async ()=>{
    await continueScan();
  });
  btnRecheck.addEventListener("click", async ()=>{
    await recheckNoDynamic();
    finalizeAfterScan();
  });
  btnUnfollow.addEventListener("click", runUnfollow);
  btnExport.addEventListener("click", exportCSV);

})();
