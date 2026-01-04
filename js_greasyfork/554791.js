// ==UserScript==
// @license MIT 
// @name         Huggy: Deploy to Hugging Face Spaces (Code Blocks)
// @namespace    hf-deploy-userscript
// @version      0.1.1
// @description  Add a button to deploy visible code blocks to a Hugging Face Space.
// @author       You
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @match        https://gitlab.com/*
// @match        https://bitbucket.org/*
// @connect      huggingface.co
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554791/Huggy%3A%20Deploy%20to%20Hugging%20Face%20Spaces%20%28Code%20Blocks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554791/Huggy%3A%20Deploy%20to%20Hugging%20Face%20Spaces%20%28Code%20Blocks%29.meta.js
// ==/UserScript==

(function () {
  const API_BASE = "https://huggingface.co/api";
  const BTN_CLASS = "hf-deploy-button";

  function injectStyles() {
    if (document.getElementById("hf-deploy-style")) return;
    const style = document.createElement("style");
    style.id = "hf-deploy-style";
    style.textContent = `
      .${BTN_CLASS} { cursor: pointer; padding: 4px 8px; border: 1px solid #444; border-radius: 6px; background:#6e56cf; color:#fff; font-size:12px; margin-left: 8px; }
      .${BTN_CLASS}:hover { filter: brightness(1.05); }
    `;
    document.head.appendChild(style);
  }

  function gmRequest({ method = 'GET', url, headers = {}, data = null }) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data,
        onload: (res) => {
          resolve({ status: res.status, ok: res.status >= 200 && res.status < 300, text: res.responseText });
        },
        onerror: (e) => reject(e),
      });
    });
  }

  async function whoami(token) {
    const r = await gmRequest({ method: 'GET', url: `${API_BASE}/whoami-v2`, headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(`whoami failed: ${r.status}`);
    return JSON.parse(r.text);
  }

  async function ensureSpace(token, namespace, name, sdk, priv) {
    const body = { name, repo_type: "space", space_sdk: sdk, private: !!priv };
    if (namespace) body.organization = namespace;
    const r = await gmRequest({
      method: 'POST',
      url: `${API_BASE}/repos/create`,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      data: JSON.stringify(body),
    });
    if (!r.ok && r.status !== 409) {
      throw new Error(`create repo failed: ${r.status} ${r.text}`);
    }
  }

  async function commitFiles(token, repoId, filesMap, message) {
    const ops = Object.entries(filesMap).map(([path, content]) => ({ op: "addOrUpdate", path, content }));
    const r = await gmRequest({
      method: 'POST',
      url: `${API_BASE}/spaces/${repoId}/commit/main`,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      data: JSON.stringify({ operations: ops, summary: message || "Deploy via userscript" }),
    });
    if (!r.ok) throw new Error(`commit failed: ${r.status} ${r.text}`);
  }

  function detectCodeBlocks() {
    const gh = Array.from(document.querySelectorAll(".blob-wrapper pre, .highlight pre, code.language-python, code, pre code"));
    return gh.filter((el) => (el.textContent || "").trim().length > 0);
  }

  function addButtons() {
    injectStyles();
    const blocks = detectCodeBlocks();
    for (const pre of blocks) {
      if (pre.__hfDeployDecorated) continue;
      pre.__hfDeployDecorated = true;

      const container = pre.closest(".Box-header, .file-header, .gist-header, h1, h2, h3") || pre.parentElement;
      if (!container) continue;

      const btn = document.createElement("button");
      btn.className = BTN_CLASS;
      btn.textContent = "Deploy to HF";
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();

        let token = GM_getValue("hf_token", "");
        if (!token) {
          token = prompt("Paste your Hugging Face token (stored locally):", "");
          if (!token) return;
          GM_setValue("hf_token", token);
        }

        const who = await whoami(token);
        const namespace = who.name || who.email || who.user || who.username;
        const code = pre.textContent || "";
        const filename = prompt("Filename to upload (e.g., app.py):", "app.py");
        if (!filename) return;
        const spaceSlug = prompt("Space slug (created if missing):", "deployed-from-browser");
        if (!spaceSlug) return;
        const sdk = prompt("Space SDK (gradio/streamlit/static):", "gradio") || "gradio";
        let requirements = "";
        if (sdk.toLowerCase() === "gradio") {
          requirements = prompt("requirements.txt content (optional):", "gradio>=4.26.0") || "";
        }

        await ensureSpace(token, namespace, spaceSlug, sdk, false);

        const files = {};
        files[filename] = code;
        if (requirements) files["requirements.txt"] = requirements;
        if (sdk.toLowerCase() === "gradio") {
          files["README.md"] = `---\ntitle: Browser Deploy\nsdk: gradio\napp_file: ${filename}\n---\n\nDeployed from a userscript.`;
        }

        await commitFiles(token, `${namespace}/${spaceSlug}`, files, "Deploy via userscript");
        const url = `https://huggingface.co/spaces/${namespace}/${spaceSlug}`;
        if (confirm("Open Space?\n" + url)) window.open(url, "_blank");
      });
      container.appendChild(btn);
    }
  }

  const observer = new MutationObserver(() => addButtons());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  addButtons();
})();
