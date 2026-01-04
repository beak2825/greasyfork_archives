// ==UserScript==
// @name         划词查 Semantic Scholar（S2）元信息
// @namespace    https://your.home/
// @version      1.3-fixed
// @description  在网页选中文字后点击浮动按钮，调用 Semantic Scholar Graph API 显示论文元信息（识别 DOI / arXiv，支持 API Key、缓存、复制 Bib / 引用 / PDF）
// @author       gcmarks
// @license      All Rights Reserved
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_setClipboard
// @connect      api.semanticscholar.org
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553529/%E5%88%92%E8%AF%8D%E6%9F%A5%20Semantic%20Scholar%EF%BC%88S2%EF%BC%89%E5%85%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/553529/%E5%88%92%E8%AF%8D%E6%9F%A5%20Semantic%20Scholar%EF%BC%88S2%EF%BC%89%E5%85%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==


/* ========= 配置区 ========= */
const DEFAULT_S2_API_KEY = null; // 可在菜单中设置
const MAX_RESULTS = 5;
const S2_FIELDS = [
  "title",
  "authors",
  "year",
  "venue",
  "externalIds",
  "url",
  "openAccessPdf",
  "citationCount"
].join(",");

/* ========= 初始化 ========= */
let S2_API_KEY = GM_getValue("S2_API_KEY", DEFAULT_S2_API_KEY);
const cache = new Map();

// 注册菜单设置
GM_registerMenuCommand("🔑 设置 Semantic Scholar API Key", async () => {
  const key = prompt("请输入你的 Semantic Scholar API Key：", S2_API_KEY || "");
  if (key !== null) {
    GM_setValue("S2_API_KEY", key.trim());
    S2_API_KEY = key.trim();
    alert("✅ 已保存 API Key");
  }
});

/* ========= 工具函数 ========= */
function extractDOI(s) {
  const m = s.match(/(?:doi:\s*|https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/[^\s"<>\)]+)/i);
  return m ? m[1].replace(/[).,]$/, "") : null;
}

function extractArXivId(s) {
  const m = s.match(/(?:arxiv:\s*)?((?:\d{4}\.\d{4,5}|[a-z\-]+(?:\.[A-Z]{2})?\/\d{7})(?:v\d+)?)/i);
  return m ? m[1] : null;
}

function escapeHtml(s) {
  return s
    ? String(s).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[m]))
    : "";
}

function truncate(s, n = 200) {
  return !s || s.length <= n ? s || "" : s.slice(0, n) + "…";
}

/* ========= 核心函数 ========= */
async function fetchS2ByPaperId(paperId) {
  const base = "https://api.semanticscholar.org/graph/v1/paper/";
  const url = `${base}${encodeURIComponent(paperId)}?fields=${encodeURIComponent(S2_FIELDS)}`;
  const headers = { Accept: "application/json" };
  if (S2_API_KEY) headers["x-api-key"] = S2_API_KEY;

  const resp = await fetch(url, { headers });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`S2 API 返回 ${resp.status}: ${await resp.text()}`);
  return await resp.json();
}

async function searchSemanticScholar(query) {
  const base = "https://api.semanticscholar.org/graph/v1/paper/search";
  const params = new URLSearchParams({
    query,
    limit: MAX_RESULTS.toString(),
    fields: S2_FIELDS
  });
  const url = `${base}?${params.toString()}`;
  const headers = { Accept: "application/json" };
  if (S2_API_KEY) headers["x-api-key"] = S2_API_KEY;

  const resp = await fetch(url, { headers });
  if (!resp.ok) throw new Error(`S2 API 返回 ${resp.status}: ${await resp.text()}`);
  const j = await resp.json();
  return j.data || [];
}

async function queryS2(q) {
  if (!q) return [];

  // 优先 DOI
  const doi = extractDOI(q);
  if (doi) {
    const key = `s2::doi:${doi}`;
    if (cache.has(key)) return [cache.get(key)];
    const one = await fetchS2ByPaperId(`DOI:${doi}`);
    cache.set(key, one);
    return one ? [one] : [];
  }

  // 再查 arXiv
  const arx = extractArXivId(q);
  if (arx) {
    const key = `s2::arxiv:${arx}`;
    if (cache.has(key)) return [cache.get(key)];
    const one = await fetchS2ByPaperId(`arXiv:${arx}`);
    cache.set(key, one);
    return one ? [one] : [];
  }

  // 关键词搜索
  const key = `s2::q:${q}`;
  if (cache.has(key)) return cache.get(key);
  const arr = await searchSemanticScholar(q);
  cache.set(key, arr);
  return arr;
}

/* ========= UI 浮窗 ========= */
let popup = null;
let button = null;

function createButton() {
  if (button) return button;
  button = document.createElement("button");
  button.textContent = "🔍 S2";
  button.style.cssText = `
    position: fixed;
    z-index: 999999;
    padding: 4px 8px;
    font-size: 12px;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  document.body.appendChild(button);
  button.onclick = async () => {
    const sel = window.getSelection().toString().trim();
    if (!sel) return;
    button.disabled = true;
    button.textContent = "⏳ 查询中...";
    try {
      const data = await queryS2(sel);
      showPopup(data, sel);
    } catch (e) {
      alert("查询失败：" + e.message);
    } finally {
      button.disabled = false;
      button.textContent = "🔍 S2";
    }
  };
  return button;
}

function showPopup(items, keyword) {
  if (popup) popup.remove();
  popup = document.createElement("div");
  popup.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999999;
    background: #fff;
    color: #000;
    border: 1px solid #ccc;
    padding: 12px;
    max-width: 600px;
    max-height: 70vh;
    overflow: auto;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  `;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.style.cssText = "float:right;border:none;background:none;cursor:pointer;font-size:14px;";
  closeBtn.onclick = () => popup.remove();

  const title = document.createElement("div");
  title.innerHTML = `<b>🔎 查询结果：${escapeHtml(keyword)}</b> (${items.length} 条)`;

  popup.append(closeBtn, title);

  if (items.length === 0) {
    popup.append("未找到结果。");
  } else {
    for (const it of items) {
      const d = document.createElement("div");
      const pdf = it.openAccessPdf?.url || "";
      d.innerHTML = `
        <hr>
        <b>${escapeHtml(it.title)}</b><br>
        作者：${it.authors?.map((a) => a.name).join(", ") || "未知"}<br>
        期刊/会议：${escapeHtml(it.venue || "")}（${it.year || "未知"}）<br>
        引用数：${it.citationCount ?? "未知"}<br>
        <a href="${it.url}" target="_blank">S2 链接</a>
        ${pdf ? ` | <a href="${pdf}" target="_blank">PDF</a>` : ""}
        <button style="margin-left:5px" data-copy="${pdf}">复制PDF</button>
      `;
      popup.append(d);
    }
  }
  document.body.appendChild(popup);

  popup.querySelectorAll("button[data-copy]").forEach((btn) => {
    btn.onclick = () => {
      const txt = btn.getAttribute("data-copy");
      if (txt) {
        GM_setClipboard(txt);
        GM_notification({ title: "复制成功", text: "PDF 链接已复制到剪贴板", timeout: 2000 });
      }
    };
  });
}

/* ========= 选中检测 ========= */
document.addEventListener("mouseup", (e) => {
  const sel = window.getSelection().toString().trim();
  if (!sel) {
    if (button) button.style.display = "none";
    return;
  }
  const b = createButton();
  b.style.display = "block";
  b.style.top = `${e.clientY + 10}px`;
  b.style.left = `${e.clientX + 10}px`;
});
