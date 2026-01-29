// ==UserScript==
// @name         GitHub Star Lists CSV Importer (Optimized)
// @namespace    https://github.com/
// @version      0.3.2
// @author       blackzero358
// @icon https://github.githubassets.com/images/icons/emoji/unicode/1f4e4.png
// @license      AGPLv3
// @description  Import CSV -> create GitHub Star Lists and assign repos. Enhancements: staged progress UI, optional "no auto-star" mode.
// @match        https://github.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/564335/GitHub%20Star%20Lists%20CSV%20Importer%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564335/GitHub%20Star%20Lists%20CSV%20Importer%20%28Optimized%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY_TOKEN = "gh_star_lists_importer_token";
  const STORAGE_KEY_NO_AUTOSTAR = "gh_star_lists_importer_no_autostar";

  // 并发请求数（建议 3-5；过高可能触发 secondary rate limit / abuse detection）
  const MAX_CONCURRENCY = 3;

  // 扫描现有列表 items 的并发（建议 1-2；列表较多时别开太大）
  const LIST_SCAN_CONCURRENCY = 2;

  // 全局状态控制
  let isRunning = false;
  let abortController = null;

  GM_addStyle(`
    .ghsli-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;backdrop-filter:blur(2px);}
    .ghsli-modal{position:fixed;top:5vh;left:50%;transform:translateX(-50%);width:min(1000px,94vw);background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.4);z-index:1000000;display:flex;flex-direction:column;max-height:90vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;}
    .ghsli-header{padding:16px 20px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;background:#f6f8fa;border-radius:12px 12px 0 0;}
    .ghsli-title{font-size:16px;font-weight:600;color:#24292f;}
    .ghsli-body{padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:16px;flex:1;}
    .ghsli-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
    .ghsli-row label{font-size:13px;font-weight:600;color:#24292f;}
    .ghsli-input{font-size:13px;padding:6px 12px;border:1px solid #d0d7de;border-radius:6px;flex:1;min-width:250px;}
    .ghsli-textarea{width:100%;min-height:150px;font-size:12px;padding:8px;border:1px solid #d0d7de;border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;resize:vertical;}
    .ghsli-btn{font-size:13px;padding:6px 16px;border:1px solid rgba(27,31,36,0.15);border-radius:6px;background:#2da44e;color:#fff;cursor:pointer;font-weight:500;transition:.2s;}
    .ghsli-btn:hover{background:#2c974b;}
    .ghsli-btn:disabled{opacity:.5;cursor:not-allowed;background:#94d3a2;}
    .ghsli-btn.secondary{background:#f6f8fa;color:#24292f;}
    .ghsli-btn.secondary:hover{background:#f3f4f6;}
    .ghsli-btn.danger{background:#cf222e;color:#fff;border-color:rgba(27,31,36,0.15);}
    .ghsli-btn.danger:hover{background:#a40e26;}
    .ghsli-log{white-space:pre-wrap;background:#0d1117;color:#c9d1d9;padding:12px;border-radius:6px;font-size:12px;height:250px;overflow-y:auto;border:1px solid #30363d;}
    .ghsli-file-wrap{position:relative;overflow:hidden;display:inline-block;}
    .ghsli-file-input{position:absolute;font-size:100px;opacity:0;right:0;top:0;}
    .log-succ{color:#3fb950;}
    .log-warn{color:#d29922;}
    .log-err{color:#f85149;}
    .log-info{color:#8b949e;}
    .ghsli-progress{height:4px;background:#eee;width:100%;border-radius:2px;overflow:hidden;margin-top:4px;}
    .ghsli-bar{height:100%;background:#2da44e;width:0%;transition:width 0.3s;}
    .ghsli-stage{font-size:12px;color:#57606a;}
  `);

  GM_registerMenuCommand("Import Star Lists (Optimized)", () => openModal());

  function openModal() {
    const existing = document.querySelector(".ghsli-backdrop");
    if (existing) existing.remove();

    const backdrop = document.createElement("div");
    backdrop.className = "ghsli-backdrop";

    const modal = document.createElement("div");
    modal.className = "ghsli-modal";

    const header = document.createElement("div");
    header.className = "ghsli-header";
    header.innerHTML = `
      <div class="ghsli-title">GitHub Star Lists CSV Importer (v0.3.1)</div>
      <button class="ghsli-btn secondary" id="ghsli-close">Close</button>
    `;

    const body = document.createElement("div");
    body.className = "ghsli-body";

    const token = GM_getValue(STORAGE_KEY_TOKEN, "");
    const noAutoStarSaved = !!GM_getValue(STORAGE_KEY_NO_AUTOSTAR, false);

    body.innerHTML = `
      <div class="ghsli-row">
        <label>Token (PAT)</label>
        <input class="ghsli-input" id="ghsli-token" type="password" placeholder="ghp_... / github_pat_..." value="${escapeHtml(token)}" />
        <button class="ghsli-btn secondary" id="ghsli-save-token">Save</button>
      </div>

      <div class="ghsli-row">
        <label><input type="checkbox" id="ghsli-private" /> 新建列表设为私有 (Private)</label>
        <label><input type="checkbox" id="ghsli-overwrite" /> 强制覆盖 (不保留现有其他归属)</label>
        <label title="开启后：不会自动 star 未 star 的仓库；但也意味着它可能无法被加入 Star Lists（GitHub 机制通常要求先 Star）。">
          <input type="checkbox" id="ghsli-no-autostar" ${noAutoStarSaved ? "checked" : ""} />
          只更新目标分类，不自动 Star
        </label>
      </div>

      <div>
        <div class="ghsli-row" style="justify-content:space-between; margin-bottom:8px;">
          <label>CSV 数据 (Category, Repo, URL)</label>
          <div class="ghsli-row" style="gap:8px;">
            <div class="ghsli-file-wrap">
              <button class="ghsli-btn secondary">📂 导入文件...</button>
              <input type="file" id="ghsli-file" class="ghsli-file-input" accept=".csv,.txt" />
            </div>
            <button class="ghsli-btn secondary" id="ghsli-dryrun">Dry Run</button>
            <button class="ghsli-btn" id="ghsli-run">▶ 开始运行</button>
            <button class="ghsli-btn danger" id="ghsli-stop" disabled>⏹ 停止</button>
          </div>
        </div>
        <textarea class="ghsli-textarea" id="ghsli-csv" placeholder="Category,Repository Name,URL\nAI Dev,ollama/ollama,https://github.com/ollama/ollama"></textarea>
      </div>

      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
           <label>执行日志</label>
           <div class="ghsli-stage" id="ghsli-stage">阶段：就绪</div>
           <span id="ghsli-status" class="log-info" style="font-size:12px;">就绪</span>
        </div>
        <div class="ghsli-progress" id="ghsli-progress-bg"><div class="ghsli-bar" id="ghsli-progress-bar"></div></div>
        <div class="ghsli-log" id="ghsli-log"></div>
      </div>
    `;

    modal.appendChild(header);
    modal.appendChild(body);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const $ = (id) => document.getElementById(id);
    const logger = createLogger();

    $("ghsli-close").onclick = () => {
      if (isRunning) {
        if (!confirm("脚本正在运行中，确定要关闭吗？这不会立即停止后台请求。建议先点击停止。")) return;
      }
      backdrop.remove();
    };

    $("ghsli-save-token").onclick = () => {
      const t = $("ghsli-token").value.trim();
      GM_setValue(STORAGE_KEY_TOKEN, t);
      logger.info("Token 已保存到本地 Tampermonkey 存储。");
    };

    $("ghsli-file").onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        $("ghsli-csv").value = evt.target.result;
        logger.info(`已加载文件: ${file.name} (${file.size} bytes)`);
      };
      reader.readAsText(file);
    };

    $("ghsli-dryrun").onclick = () => {
      try {
        const plan = buildPlanFromCsv($("ghsli-csv").value);
        logger.clear();
        logger.info(renderPlan(plan));
      } catch (err) {
        logger.error(`Dry run failed: ${err.message}`);
      }
    };

    $("ghsli-stop").onclick = () => {
      if (!isRunning) return;
      logger.warn("正在停止... 将取消进行中的请求并尽快退出。");
      abortController.abort();
      $("ghsli-stop").disabled = true;
      $("ghsli-stop").textContent = "正在停止...";
    };

    $("ghsli-run").onclick = async () => {
      const runBtn = $("ghsli-run");
      const dryBtn = $("ghsli-dryrun");
      const stopBtn = $("ghsli-stop");

      runBtn.disabled = true;
      dryBtn.disabled = true;
      stopBtn.disabled = false;
      stopBtn.textContent = "⏹ 停止";

      isRunning = true;
      abortController = new AbortController();

      logger.clear();
      logger.setStage("准备");

      try {
        const tokenVal = $("ghsli-token").value.trim();
        if (!tokenVal) throw new Error("请先填写 Token。");
        GM_setValue(STORAGE_KEY_TOKEN, tokenVal);

        const csv = $("ghsli-csv").value;
        const isPrivate = $("ghsli-private").checked;
        const allowOverwrite = $("ghsli-overwrite").checked;
        const noAutoStar = $("ghsli-no-autostar").checked;
        GM_setValue(STORAGE_KEY_NO_AUTOSTAR, noAutoStar);

        const plan = buildPlanFromCsv(csv);
        logger.info(`开始处理: ${plan.categories.size} 个分类, ${plan.repoToCategories.size} 个仓库`);

        logger.setStage("验证 Token");
        logger.updateProgress(0, 1, "验证 Token...");
        logger.log("正在验证 Token...");
        const viewer = await validateToken(tokenVal, abortController.signal);
        logger.info(`Token 有效! 以此用户身份登录: ${viewer.login}`);
        logger.updateProgress(1, 1, "验证完成");

        await runImport({
          token: tokenVal,
          plan,
          isPrivate,
          allowOverwrite,
          noAutoStar,
          logger,
          signal: abortController.signal
        });

        logger.setStage("完成");
        logger.setStatus("完成");
        logger.updateProgress(1, 1, "完成");
      } catch (err) {
        if (err?.name === "AbortError" || !isRunning) {
          logger.warn("操作已由用户手动停止。");
          logger.setStage("已停止");
          logger.setStatus("已停止");
        } else {
          logger.error(`运行出错: ${err.message}`);
          logger.setStage("出错");
          logger.setStatus("出错");
        }
      } finally {
        isRunning = false;
        runBtn.disabled = false;
        dryBtn.disabled = false;
        stopBtn.disabled = true;
        stopBtn.textContent = "⏹ 停止";
      }
    };
  }

  function createLogger() {
    const el = document.getElementById("ghsli-log");
    const statusEl = document.getElementById("ghsli-status");
    const stageEl = document.getElementById("ghsli-stage");
    const bar = document.getElementById("ghsli-progress-bar");

    const append = (msg, cls) => {
      const span = document.createElement("div");
      span.textContent = msg;
      if (cls) span.className = cls;
      el.appendChild(span);
      el.scrollTop = el.scrollHeight;
    };

    return {
      log: (m) => append(m),
      info: (m) => append(m, "log-info"),
      success: (m) => append(m, "log-succ"),
      warn: (m) => append(m, "log-warn"),
      error: (m) => append(m, "log-err"),
      clear: () => {
        el.innerHTML = "";
        bar.style.width = "0%";
        stageEl.textContent = "阶段：就绪";
        statusEl.textContent = "就绪";
      },
      setStage: (stageName) => {
        stageEl.textContent = `阶段：${stageName}`;
      },
      setStatus: (s) => {
        statusEl.textContent = s || "";
      },
      updateProgress: (current, total, msg) => {
        const safeTotal = Math.max(1, total || 1);
        const pct = Math.floor((Math.min(current, safeTotal) / safeTotal) * 100);
        bar.style.width = `${pct}%`;
        statusEl.textContent = `[${Math.min(current, safeTotal)}/${safeTotal}] ${msg || ""}`;
      }
    };
  }

  // --- Core Logic ---

  async function validateToken(token, signal) {
    const q = `query { viewer { login } }`;
    const data = await ghGraphql(token, q, {}, { signal });
    if (!data.viewer) throw new Error("无法获取用户信息，Token 可能无效。");
    return data.viewer;
  }

  async function runImport({ token, plan, isPrivate, allowOverwrite, noAutoStar, logger, signal }) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const checkAbort = () => {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    };

    // 阶段 A：列表准备
    logger.setStage("列表准备");
    logger.log("正在读取现有列表...");
    logger.updateProgress(0, 1, "读取现有列表...");

    const listApi = await detectListApi(token, signal);
    const existingLists = await fetchAllLists(token, listApi, signal);
    checkAbort();

    const nameToList = new Map(existingLists.map((x) => [x.name, { id: x.id, name: x.name }]));

    const neededCats = Array.from(plan.categories).sort();
    logger.updateProgress(0, neededCats.length || 1, "创建缺失列表...");
    let createdCnt = 0;

    for (const name of neededCats) {
      checkAbort();
      if (nameToList.has(name)) {
        createdCnt++;
        logger.updateProgress(createdCnt, neededCats.length || 1, `列表已存在: ${name}`);
        continue;
      }

      logger.log(`创建新列表: ${name}`);
      try {
        const created = await createUserList(token, name, isPrivate, "", signal);
        nameToList.set(created.name, { id: created.id, name: created.name });
        await sleep(250);
      } catch (e) {
        if (e?.name === "AbortError") throw e;
        throw new Error(`创建列表失败 [${name}]: ${e.message}`);
      }

      createdCnt++;
      logger.updateProgress(createdCnt, neededCats.length || 1, `已创建: ${name}`);
    }

    const allLists = Array.from(nameToList.values());
    logger.success(`列表准备完成：共 ${allLists.length} 个列表（含新建）`);

    // 阶段 B：读取仓库信息
    const repos = Array.from(plan.repoToCategories.keys());
    logger.setStage("读取仓库信息");
    logger.log(`正在读取仓库信息（id / viewerHasStarred）：${repos.length} 个...`);

    const repoInfoMap = await fetchRepoInfosBulk(token, repos, logger, signal, MAX_CONCURRENCY);
    checkAbort();

    // 统计可用仓库
    let okRepoCount = 0;
    for (const r of repos) if (repoInfoMap.get(r)?.id) okRepoCount++;
    logger.success(`仓库信息读取完成：可处理 ${okRepoCount}/${repos.length} 个`);

    // 阶段 C：扫描现有归属（可选）
    let existingByRepoId = new Map(); // repoId -> Set(listId)
    if (!allowOverwrite) {
      logger.setStage("扫描现有归属");
      const targetRepoIds = new Set();
      for (const repoFull of repos) {
        const info = repoInfoMap.get(repoFull);
        if (info?.id) targetRepoIds.add(info.id);
      }

      logger.log(`正在扫描现有列表归属（用于合并保留其他列表）：${allLists.length} 个列表...`);
      const scan = await buildExistingMembershipIndex(token, allLists, targetRepoIds, logger, signal);
      existingByRepoId = scan.repoIdToListIds;
      logger.success(`现有归属扫描完成：命中 ${existingByRepoId.size} 个仓库`);
      checkAbort();
    } else {
      logger.setStage("扫描现有归属");
      logger.warn(`已启用“强制覆盖”：将不会读取/保留仓库现有其他列表归属。`);
      logger.updateProgress(1, 1, "已跳过（强制覆盖）");
    }

    // 阶段 D：更新归属
    logger.setStage("更新归属");
    logger.log(`开始更新：${repos.length} 个仓库（并发 ${MAX_CONCURRENCY}）...`);

    let completedCount = 0;
    const total = repos.length;
    logger.updateProgress(0, total || 1, "开始更新...");

    const runWorker = async (repoFull) => {
      checkAbort();

      const cats = plan.repoToCategories.get(repoFull);
      const targetListIds = Array.from(cats)
        .map((c) => nameToList.get(c)?.id)
        .filter(Boolean);

      if (targetListIds.length === 0) {
        logger.warn(`⚠ ${repoFull}: 无有效的目标列表ID（列表创建可能失败），跳过。`);
        return;
      }

      const repoInfo = repoInfoMap.get(repoFull);
      if (!repoInfo?.id) {
        logger.error(`✖ ${repoFull}: 仓库不存在或无权访问（无法读取 repository.id）`);
        return;
      }

      // 重要：不自动 star 模式下，如果仓库未 star，很可能无法加入 Star Lists
      // 我们这里选择“跳过并提示”，避免隐性改变用户意图。
      if (noAutoStar && !repoInfo.viewerHasStarred) {
        logger.warn(`⚠ ${repoFull}: 未 Star，且已启用“只更新分类不自动 Star” -> 跳过（无法可靠加入列表）`);
        return;
      }

      try {
        // Auto-star (optional)
        if (!noAutoStar && !repoInfo.viewerHasStarred) {
          await addStar(token, repoInfo.id, signal);
        }

        // Determine current + final listIds
        const currentListIds = allowOverwrite
          ? []
          : Array.from(existingByRepoId.get(repoInfo.id) || []);

        if (!allowOverwrite) {
          const alreadyHasAll = targetListIds.every((id) => currentListIds.includes(id));
          if (alreadyHasAll) {
            logger.info(`= ${repoFull}: 无需更新（已包含目标分类）`);
            return;
          }
        }

        const finalListIds = allowOverwrite
          ? targetListIds
          : Array.from(new Set([...currentListIds, ...targetListIds]));

        await updateUserListsForItem(token, repoInfo.id, finalListIds, signal);
        logger.success(`✔ ${repoFull}: 已更新到 [${Array.from(cats).join(", ")}]`);
      } catch (e) {
        if (e?.name === "AbortError") throw e;
        logger.error(`✖ ${repoFull}: ${e.message}`);
      }
    };

    await processInBatches(
      repos,
      async (repo) => {
        await runWorker(repo);
        completedCount++;
        logger.updateProgress(completedCount, total || 1, repo);
      },
      MAX_CONCURRENCY,
      checkAbort
    );

    logger.success("更新阶段完成。");
  }

  async function fetchRepoInfosBulk(token, repos, logger, signal, concurrency) {
    const checkAbort = () => {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    };

    const out = new Map();
    let done = 0;
    const total = repos.length;

    logger.updateProgress(0, total || 1, "读取仓库信息...");

    await processInBatches(
      repos,
      async (repoFull) => {
        checkAbort();
        const [owner, name] = repoFull.split("/");
        try {
          const repo = await getRepository(token, owner, name, signal);
          if (!repo) out.set(repoFull, null);
          else out.set(repoFull, { id: repo.id, viewerHasStarred: !!repo.viewerHasStarred });
        } catch (e) {
          if (e?.name === "AbortError") throw e;
          out.set(repoFull, null);
        } finally {
          done++;
          logger.updateProgress(done, total || 1, `读取仓库信息: ${repoFull}`);
        }
      },
      concurrency,
      checkAbort
    );

    return out;
  }

  async function buildExistingMembershipIndex(token, lists, targetRepoIds, logger, signal) {
    const checkAbort = () => {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    };

    const repoIdToListIds = new Map(); // repoId -> Set(listId)
    let scanned = 0;
    const total = lists.length;

    logger.updateProgress(0, total || 1, "扫描列表 items...");

    const scanOneList = async (list) => {
      checkAbort();

      let after = null;
      while (true) {
        checkAbort();
        const q = `
          query($id: ID!, $n: Int!, $after: String) {
            node(id: $id) {
              ... on UserList {
                items(first: $n, after: $after) {
                  nodes { ... on Repository { id } }
                  pageInfo { hasNextPage endCursor }
                }
              }
            }
          }
        `;
        const d = await ghGraphql(token, q, { id: list.id, n: 100, after }, { signal });

        const items = d?.node?.items;
        if (!items) throw new Error(`无法读取列表 items：${list.name}`);

        for (const n of items.nodes || []) {
          const rid = n?.id;
          if (!rid) continue;
          if (!targetRepoIds.has(rid)) continue;

          if (!repoIdToListIds.has(rid)) repoIdToListIds.set(rid, new Set());
          repoIdToListIds.get(rid).add(list.id);
        }

        if (!items.pageInfo?.hasNextPage) break;
        after = items.pageInfo.endCursor;
      }
    };

    await processInBatches(
      lists,
      async (list) => {
        await scanOneList(list);
        scanned++;
        logger.updateProgress(scanned, total || 1, `扫描列表: ${list.name}`);
      },
      LIST_SCAN_CONCURRENCY,
      checkAbort
    );

    return { repoIdToListIds };
  }

  async function processInBatches(items, workerFn, limit, abortCheckFn) {
    const results = [];
    const executing = new Set();

    for (const item of items) {
      abortCheckFn();
      const p = Promise.resolve()
        .then(() => workerFn(item))
        .finally(() => executing.delete(p));
      executing.add(p);
      results.push(p);

      if (executing.size >= limit) {
        await Promise.race(executing);
      }
    }

    await Promise.all(results);
  }

  // --- Data Parsing ---

  function buildPlanFromCsv(csvText) {
    const rows = parseCsv(csvText);
    if (rows.length === 0) throw new Error("CSV 为空");

    const first = rows[0].map((x) => (x || "").trim().toLowerCase());
    const hasHeader =
      first.length >= 3 &&
      (first[0].includes("cat") || first[0].includes("分类")) &&
      first[1].includes("repo") &&
      first[2].includes("url");

    const data = hasHeader ? rows.slice(1) : rows;

    const categories = new Set();
    const repoToCategories = new Map();

    for (const r of data) {
      if (!r || r.length < 2) continue;

      const category = (r[0] || "").trim();
      const repoName = (r[1] || "").trim();
      const url = (r[2] || "").trim();

      if (!category) continue;
      const repo = normalizeRepo(repoName, url);
      if (!repo) continue;

      categories.add(category);
      if (!repoToCategories.has(repo)) repoToCategories.set(repo, new Set());
      repoToCategories.get(repo).add(category);
    }

    if (categories.size === 0) throw new Error("未找到有效分类数据");
    return { categories, repoToCategories };
  }

  function renderPlan(plan) {
    return (
      `计划创建/使用分类 (${plan.categories.size} 个):\n` +
      Array.from(plan.categories).join(", ") +
      `\n\n即将处理仓库 (${plan.repoToCategories.size} 个)...`
    );
  }

  function normalizeRepo(repoName, url) {
    if (repoName && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repoName)) return repoName;
    if (url) {
      const m = url.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/#?]+)/i);
      if (m) return `${m[1]}/${m[2]}`;
    }
    return null;
  }

  function parseCsv(text) {
    const result = [];
    const lines = text.split(/\r?\n/).filter((l) => l.trim());

    for (let line of lines) {
      const row = [];
      let inQuote = false;
      let token = "";

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuote) {
          if (char === '"') {
            if (line[i + 1] === '"') {
              token += '"';
              i++;
            } else {
              inQuote = false;
            }
          } else {
            token += char;
          }
        } else {
          if (char === '"') inQuote = true;
          else if (char === ",") {
            row.push(token);
            token = "";
          } else token += char;
        }
      }

      row.push(token);
      result.push(row);
    }

    return result;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // --- GraphQL wrapper ---

  function makeAbortError() {
    return new DOMException("Aborted", "AbortError");
  }

  async function ghGraphql(token, query, variables = {}, { signal } = {}, retryCount = 0) {
    const doRequest = () =>
      new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(makeAbortError());

        let settled = false;
        const req = GM_xmlhttpRequest({
          method: "POST",
          url: "https://api.github.com/graphql",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
            Authorization: `bearer ${token}`,
          },
          data: JSON.stringify({ query, variables }),
          timeout: 20000,
          onload: (resp) => {
            if (settled) return;
            settled = true;

            if (resp.status === 401) return reject(new Error("Token 无效 (401)"));

            if (resp.status === 403 || resp.status === 429) {
              let msg = `Rate Limit/Abuse detected (${resp.status})`;
              try {
                const j = JSON.parse(resp.responseText);
                if (j?.message) msg = j.message;
              } catch {}
              return reject(new Error(msg));
            }

            try {
              const json = JSON.parse(resp.responseText);
              if (json.errors?.length) return reject(new Error(json.errors[0].message));
              resolve(json.data);
            } catch (e) {
              reject(e);
            }
          },
          onerror: () => {
            if (!settled) {
              settled = true;
              reject(new Error("Network Error"));
            }
          },
          ontimeout: () => {
            if (!settled) {
              settled = true;
              reject(new Error("Timeout"));
            }
          },
        });

        if (signal) {
          signal.addEventListener(
            "abort",
            () => {
              if (settled) return;
              settled = true;
              try {
                req.abort();
              } catch {}
              reject(makeAbortError());
            },
            { once: true }
          );
        }
      });

    try {
      return await doRequest();
    } catch (e) {
      if (e?.name === "AbortError") throw e;

      if (retryCount < 2) {
        const isNetError = e.message === "Network Error" || e.message === "Timeout";
        const isRateLimit = /rate|abuse|secondary/i.test(e.message || "");

        if (isNetError || isRateLimit) {
          const delay = isRateLimit ? (retryCount + 1) * 2500 : 1000;
          await new Promise((r) => setTimeout(r, delay));
          return ghGraphql(token, query, variables, { signal }, retryCount + 1);
        }
      }
      throw e;
    }
  }

  // --- Star Lists API ---

  async function detectListApi(token, signal) {
    const fields = ["lists", "userLists"];
    for (const f of fields) {
      try {
        await ghGraphql(token, `query { viewer { ${f}(first:1) { totalCount } } }`, {}, { signal });
        return { viewerField: f };
      } catch (e) {}
    }
    throw new Error("API 探测失败: 无法找到 viewer.lists / viewer.userLists 字段");
  }

  async function fetchAllLists(token, listApi, signal) {
    const out = [];
    let after = null;

    while (true) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      const q = `
        query($n:Int!, $after:String) {
          viewer {
            ${listApi.viewerField}(first:$n, after:$after) {
              nodes { id name }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      `;

      const d = await ghGraphql(token, q, { n: 100, after }, { signal });
      const conn = d.viewer[listApi.viewerField];
      out.push(...(conn.nodes || []));

      if (!conn.pageInfo.hasNextPage) break;
      after = conn.pageInfo.endCursor;
    }

    return out;
  }

  async function createUserList(token, name, isPrivate, description, signal) {
    // CreateUserListPayload 字段是 list，而不是 userList
    const q = `
      mutation($input: CreateUserListInput!) {
        createUserList(input: $input) {
          list { id name }
        }
      }
    `;
    const input = { name, isPrivate };
    if (description) input.description = description;

    const d = await ghGraphql(token, q, { input }, { signal });
    if (!d?.createUserList?.list) throw new Error("createUserList 返回为空（可能是权限或 schema 变更）");
    return d.createUserList.list;
  }

  async function getRepository(token, owner, name, signal) {
    const q = `query($o:String!, $n:String!) { repository(owner:$o, name:$n) { id viewerHasStarred } }`;
    try {
      const d = await ghGraphql(token, q, { o: owner, n: name }, { signal });
      return d.repository;
    } catch (e) {
      if (String(e.message || "").includes("Could not resolve to a Repository")) return null;
      return null;
    }
  }

  async function addStar(token, starrableId, signal) {
    const q = `mutation($input: AddStarInput!) { addStar(input:$input) { starrable { id } } }`;
    return ghGraphql(token, q, { input: { starrableId } }, { signal });
  }

  async function updateUserListsForItem(token, itemId, listIds, signal) {
    const q = `
      mutation($input: UpdateUserListsForItemInput!) {
        updateUserListsForItem(input: $input) { clientMutationId }
      }
    `;
    return ghGraphql(token, q, { input: { itemId, listIds } }, { signal });
  }
})();
