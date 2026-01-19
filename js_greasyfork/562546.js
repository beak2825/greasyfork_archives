// ==UserScript==
// @name         GitHub Repo → Supabase Helper
// @namespace    https://example.com/github-supabase
// @description  在 GitHub 仓库首页将按钮嵌入 Header，查询/添加 Supabase 仓库（SPA、安全、原生风格）
// @icon         https://github.githubassets.com/favicon.ico
// @match        https://github.com/*/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      supabase.co
// @license      MIT License
// @version      1.2.1
// @downloadURL https://update.greasyfork.org/scripts/562546/GitHub%20Repo%20%E2%86%92%20Supabase%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562546/GitHub%20Repo%20%E2%86%92%20Supabase%20Helper.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ============================================================
   一、Supabase 环境变量
   ============================================================ */
    // 设置环境变量
    const GH_BTN_LI_ID = 'tm-supabase-repo-li'; // 按钮 ID
    const DEFAULT_TABLE = 'repo_status' // 默认数据库表名
    // database key 结构体
    const DB_KEY = {
        OWNER: 'owner',
        REPO: 'repo'
    };

    // GM 存储 Key 结构体
    const GM_KEY = {
        SUPA_URL: 'SUPABASE_URL',
        SUPA_KEY: 'SUPABASE_ANON_KEY',
        SUPA_TABLE: 'SUPABASE_TABLE'
    };

    // GM 存储: 手动配置 supabase 参数 (不安全, 启用)
    /*     if (!GM_getValue(GM_KEY.SUPA_URL)) {
        GM_setValue(GM_KEY.SUPA_URL, 'https://example.supabase.co');
        GM_setValue(GM_KEY.SUPA_KEY', 'your_supabase_anon_key');
        GM_setValue(GM_KEY.SUPA_TABLE', DEFAULT_TABLE);
        console.log('[TM] Supabase env initialized');
    } */

    // GM 存储: 通过脚本菜单配置 supabase 参数 (安全易用, 但 UI 交互简单)
    /*     GM_registerMenuCommand('⚙ 设置 Supabase 环境变量', () => {
        const url = prompt(GM_KEY.SUPA_URL, GM_getValue(GM_KEY.SUPA_URL, ''));
        const key = prompt(GM_KEY.SUPA_KEY, GM_getValue(GM_KEY.SUPA_KEY, ''));
        const table = prompt(GM_KEY.SUPA_TABLE, GM_getValue(GM_KEY.SUPA_TABLE, DEFAULT_TABLE));

        if (url) GM_setValue(GM_KEY.SUPA_URL, url);
        if (key) GM_setValue(GM_KEY.SUPA_KEY, key);
        if (table) GM_setValue(GM_KEY.SUPA_TABLE, table);

        alert('✅ 已保存');
    }); */

    // GM 存储脚本菜单: Github 原生 UI 配置 supabase 参数
    GM_registerMenuCommand('⚙ Supabase Config', openConfigModal);

    // 新增：菜单按钮 - 查询任意 owner/repo 是否存在于 Supabase
    GM_registerMenuCommand('🔎 Check Repo Exists', openRepoCheckModal);


    // 环境变量结构体
    // 注意：不要在启动时缓存 ENV（Config Modal 保存后会更新 GM 存储，但常量不会自动刷新）
    // 改为每次请求前动态读取。

    // 新增：每次请求时动态读取最新配置（避免在 Config Modal 保存后，需要刷新页面才生效）
    function getEnv() {
        return {
            SUPABASE_URL: GM_getValue(GM_KEY.SUPA_URL, ''),
            SUPABASE_KEY: GM_getValue(GM_KEY.SUPA_KEY, ''),
            TABLE: GM_getValue(GM_KEY.SUPA_TABLE, DEFAULT_TABLE),
        };
    }

    /* ============================================================
   二、判断是否是仓库首页
   ============================================================ */
    function getRepoInfoIfHome() {
        const parts = location.pathname.split('/').filter(Boolean);
        if (parts.length !== 2) return null;
        return { owner: parts[0], repo: parts[1] };
    }

    /* ============================================================
   三、Supabase 请求封装（必须使用 GM_xmlhttpRequest）
   ============================================================ */
    function supabaseRequest(method, url, apiKey = null, body = null) {
        return new Promise((resolve, reject) => {
            const headers = {
                apikey: apiKey,
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
            }
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                data: body ? JSON.stringify(body) : null,
                onload: res => {
                    let data = null;
                    try { data = res.responseText ? JSON.parse(res.responseText) : null; } catch {}
                    resolve({ status: res.status, data });
                },
                onerror: err => reject(err),
            });
        });
    }

    /* ============================================================
   四、Supabase 业务逻辑
   ============================================================ */
    /* Supabase 检查仓库是否存在 */
    async function checkRepoExists({ owner, repo }) {
        const env = getEnv();
        // 检查环境变量, 如果为空, 则直接抛出 error
        if (!env.SUPABASE_URL) {
            throw new Error('SUPABASE_URL is not configured');
        }
        if (!env.SUPABASE_KEY) {
            throw new Error('SUPABASE_KEY is not configured');
        }
        if (!env.TABLE) {
            throw new Error('SUPABASE TABLE is not configured');
        }
        const url =
              `${env.SUPABASE_URL}/rest/v1/${env.TABLE}` +
              `?${DB_KEY.OWNER}=ilike.${owner}` +
              `&${DB_KEY.REPO}=ilike.${repo}` +
              `&select=${DB_KEY.OWNER}`;
        const key = env.SUPABASE_KEY;
        const res = await supabaseRequest('GET', url, key);
        return res.status === 200 && Array.isArray(res.data) && res.data.length > 0;
    }

    /* Supabase 添加仓库 */
    async function addRepo({ owner, repo }) {
        const env = getEnv();
        const url = `${env.SUPABASE_URL}/rest/v1/${env.TABLE}`;
        const key = env.SUPABASE_KEY;
        const payload = {
            [DB_KEY.OWNER]: owner,
            [DB_KEY.REPO]: repo
        };
        return supabaseRequest('POST', url, key, payload);
    }

    /* Supabase 连通性校验 */
    async function testSupabaseConnection(url, table) {
        if (!url) throw new Error('No URL');

        // 构建测试 URL
        const testUrl = `${url}/rest/v1/${table}?limit=1`;
        await supabaseRequest('GET', testUrl);
        return true;
    }

    /* ============================================================
   五、GitHub Header 按钮（Watch 左侧，原生风格）
   ============================================================ */

    // 删除按钮（SPA 路由切换时用）
    function removeRepoButton() {
        document.getElementById(GH_BTN_LI_ID)?.remove();
    }

    // 找到 Watch 对应的 li
    function findWatchLi() {
        return Array.from(document.querySelectorAll('.pagehead-actions > li')).find(li => {
            const btn = li.querySelector('button, a');
            return btn?.getAttribute('aria-label')?.includes('Watch');
        });
    }

    // 设置按钮状态（文字 + 禁用）
    function setGHButtonState(btn, text, disabled = false) {
        btn.textContent = text;
        btn.disabled = disabled;
        btn.classList.toggle('disabled', disabled);
    }

    // 创建按钮
    function createRepoButton(repoInfo) {
        if (document.getElementById(GH_BTN_LI_ID)) return;
        const watchLi = findWatchLi();
        if (!watchLi) return;

        const li = document.createElement('li');
        li.id = GH_BTN_LI_ID;

        const btn = document.createElement('button');
        btn.className = 'btn btn-sm'; // GitHub 原生小按钮
        btn.type = 'button';
        btn.textContent = 'Supabase';

        // 点击处理逻辑
        btn.onclick = async () => {
            setGHButtonState(btn, '查询中...', true);
            try {
                const exists = await checkRepoExists(repoInfo);
                if (exists) {
                    setGHButtonState(btn, '已存在于数据库', true);
                } else {
                    setGHButtonState(btn, '添加到数据库', false);
                    // 第二次点击添加
                    btn.onclick = async () => {
                        setGHButtonState(btn, '添加中...', true);
                        const res = await addRepo(repoInfo);
                        if (res.status === 200 || res.status === 201) {
                            setGHButtonState(btn, '添加成功', true);
                        } else {
                            setGHButtonState(btn, '添加失败', false);
                        }
                    };
                }
            } catch (e) {
                console.error(e);
                setGHButtonState(btn, '请求失败,检查配置', false);
                btn.onclick = openConfigModal; // 打开配置弹窗
            }
        };

        li.appendChild(btn);
        watchLi.parentNode.insertBefore(li, watchLi);
    }

    /******************************************************************
   * GitHub 原生风格配置弹窗
   ******************************************************************/
    /* 用 GitHub 内部 overlay 系统 */
    function openConfigModal_v1() {
        if (document.getElementById('tm-sb-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'tm-sb-modal';
        modal.innerHTML = `
<div class="Box Box--overlay d-flex flex-column"
     style="position:fixed;top:20%;left:50%;transform:translateX(-50%);
            z-index:10000;width:480px">
  <div class="Box-header">
    <strong>Supabase Configuration</strong>
  </div>
  <div class="Box-body">
    <label class="d-block mb-2">Supabase URL</label>
    <input class="form-control input-block" id="sb-url">
    <label class="d-block mt-3 mb-2">Anon Key</label>
    <input class="form-control input-block" id="sb-key">
    <label class="d-block mt-4 mb-2">Table</label>
    <input class="form-control input-block" id="sb-table">
    <div id="sb-status" class="mt-2 color-fg-muted"></div>
  </div>
  <div class="Box-footer d-flex flex-justify-end gap-2">
    <button class="btn" id="sb-cancel">Cancel</button>
    <button class="btn" id="sb-test">Test</button>
    <button class="btn btn-primary" id="sb-save">Save</button>
  </div>
</div>
<div class="Overlay-backdrop--center"></div>
`;

        document.body.appendChild(modal);

        /* 读取已有配置 */
        document.getElementById('sb-url').value =
            GM_getValue(GM_KEY.SUPA_URL, '');
        document.getElementById('sb-key').value =
            GM_getValue(GM_KEY.SUPA_KEY, '');
        document.getElementById('sb-table').value =
            GM_getValue(GM_KEY.SUPA_TABLE, '');

        /* 关闭 */
        function close() {
            modal.remove();
        }

        /* 关闭 */
        document.getElementById('sb-cancel').onclick = () => close();

        /* 测试 */
        document.getElementById('sb-test').onclick = async () => {
            const url = document.getElementById('sb-url').value.trim();
            document.getElementById('sb-key').value.trim();
            const table = document.getElementById('sb-table').value.trim();
            const status = document.getElementById('sb-status');

            status.textContent = 'Testing connection…';

            try {
                await testSupabaseConnection(url, table);
                status.textContent = '✅ Connected successfully';
            } catch {
                status.textContent = '❌ Connection failed';
            }
        }

        /* 保存 */
        document.getElementById('sb-save').onclick = async () => {
            const url = document.getElementById('sb-url').value.trim();
            const key = document.getElementById('sb-key').value.trim();
            const table = document.getElementById('sb-table').value.trim();
            // const status = document.getElementById('sb-status');

            GM_setValue(GM_KEY.SUPA_URL, url);
            GM_setValue(GM_KEY.SUPA_KEY, key);
            GM_setValue(GM_KEY.SUPA_TABLE, table);

            //             status.textContent = 'Testing connection…';

            //             try {
            //                 await testSupabaseConnection(url, table);
            //                 status.textContent = '✅ Connected successfully';
            //             } catch {
            //                 status.textContent = '❌ Connection failed';
            //             }
            // modal.remove();
            close();
        };
    }

    /* 独立 backdrop + fixed modal, 复用 GitHub 的 Box / btn / form 样式 */
    function openConfigModal() {
        if (document.getElementById('tm-sb-backdrop')) return;

        /* 背景遮罩 */
        const backdrop = document.createElement('div');
        backdrop.id = 'tm-sb-backdrop';
        backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.4);
    z-index: 9998;
  `;

        /* 弹窗主体 */
        const modal = document.createElement('div');
        modal.id = 'tm-sb-modal';
        modal.className = 'Box';
        modal.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 480px;
    z-index: 9999;
  `;

        modal.innerHTML = `
    <div class="Box-header">
      <strong>Supabase Configuration</strong>
    </div>

    <div class="Box-body">
      <label class="d-block mb-2">Supabase URL</label>
      <input id="sb-url" class="form-control input-block">

      <label class="d-block mt-3 mb-2">Anon Key</label>
      <input id="sb-key" class="form-control input-block">

      <label class="d-block mt-4 mb-2">Table</label>
      <input id="sb-table" class="form-control input-block">

      <div id="sb-status" class="mt-2 color-fg-muted"></div>
    </div>

    <div class="Box-footer d-flex flex-justify-end gap-2">
      <button class="btn" id="sb-cancel">Cancel</button>
      <button class="btn" id="sb-test">Test</button>
      <button class="btn btn-primary" id="sb-save">Save</button>
    </div>
  `;

        document.body.append(backdrop, modal);

        /* 读取已有配置 */
        document.getElementById('sb-url').value =
            GM_getValue(GM_KEY.SUPA_URL, '');
        document.getElementById('sb-key').value =
            GM_getValue(GM_KEY.SUPA_KEY, '');
        document.getElementById('sb-table').value =
            GM_getValue(GM_KEY.SUPA_TABLE, '');

        /* 关闭 */
        function close() {
            backdrop.remove();
            modal.remove();
        }

        backdrop.onclick = close;
        document.getElementById('sb-cancel').onclick = close;

        /* 测试 */
        document.getElementById('sb-test').onclick = async () => {
            const url = document.getElementById('sb-url').value.trim();
            document.getElementById('sb-key').value.trim();
            const table = document.getElementById('sb-table').value.trim();
            const status = document.getElementById('sb-status');

            status.textContent = 'Testing connection…';

            try {
                await testSupabaseConnection(url, table);
                status.textContent = '✅ Connected successfully';
            } catch (e) {
                status.textContent = '❌ Connection failed';
            }
        }

        /* 保存 */
        document.getElementById('sb-save').onclick = async () => {
            const url = document.getElementById('sb-url').value.trim();
            const key = document.getElementById('sb-key').value.trim();
            const table = document.getElementById('sb-table').value.trim();
            // const status = document.getElementById('sb-status');

            GM_setValue(GM_KEY.SUPA_URL, url);
            GM_setValue(GM_KEY.SUPA_KEY, key);
            GM_setValue(GM_KEY.SUPA_TABLE, table);

            // status.textContent = 'Testing connection…';

            // try {
            //     await testSupabaseConnection(url, table);
            //     status.textContent = '✅ Connected successfully';
            // } catch (e) {
            //     status.textContent = '❌ Connection failed';
            // }
            close();
        };
    }



    /******************************************************************
   * GitHub 原生风格：Repo Exists 查询弹窗（owner/repo 两行输入）
   ******************************************************************/
    function openRepoCheckModal() {
        // 避免重复打开
        if (document.getElementById('tm-sb-backdrop') || document.getElementById('tm-sb-modal')) return;

        /* 背景遮罩 */
        const backdrop = document.createElement('div');
        backdrop.id = 'tm-sb-backdrop';
        backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.4);
    z-index: 9998;
  `;

        /* 弹窗主体 */
        const modal = document.createElement('div');
        modal.id = 'tm-sb-modal';
        modal.className = 'Box';
        modal.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 480px;
    z-index: 9999;
  `;

        const current = getRepoInfoIfHome();

        modal.innerHTML = `
    <div class="Box-header">
      <strong>Check Repo Exists (Supabase)</strong>
    </div>

    <div class="Box-body">
      <label class="d-block mb-2">Owner</label>
      <input id="sb-check-owner" class="form-control input-block" autocomplete="off">

      <label class="d-block mt-3 mb-2">Repo</label>
      <input id="sb-check-repo" class="form-control input-block" autocomplete="off">

      <div id="sb-check-status" class="mt-3 color-fg-muted"></div>
    </div>

    <div class="Box-footer d-flex flex-justify-end gap-2">
      <button class="btn" id="sb-check-cancel">Cancel</button>
      <button class="btn" id="sb-check-config">Config</button>
      <button class="btn btn-primary" id="sb-check-run">Query</button>
    </div>
  `;

        document.body.append(backdrop, modal);

        const ownerEl = document.getElementById('sb-check-owner');
        const repoEl = document.getElementById('sb-check-repo');
        const statusEl = document.getElementById('sb-check-status');

        // 默认填入当前页面 owner/repo（如果在仓库页）
        ownerEl.value = current?.owner || '';
        repoEl.value = current?.repo || '';

        function setStatus(text) {
            statusEl.textContent = text;
        }

        function close() {
            backdrop.remove();
            modal.remove();
        }

        backdrop.onclick = close;
        document.getElementById('sb-check-cancel').onclick = close;
        document.getElementById('sb-check-config').onclick = () => {
            close();
            openConfigModal();
        };

        async function runQuery() {
            const owner = ownerEl.value.trim();
            const repo = repoEl.value.trim();

            if (!owner || !repo) {
                setStatus('Please input owner and repo.');
                return;
            }

            setStatus('Querying…');
            try {
                const exists = await checkRepoExists({ owner, repo });
                setStatus(exists ? '✅ Exists in database' : '❌ Not found');
            } catch (e) {
                console.error(e);
                // 更友好的错误信息
                const msg = String(e?.message || e || 'Unknown error');
                if (msg.includes('not configured')) {
                    setStatus('⚠ Supabase is not configured. Click Config to set it.');
                } else {
                    setStatus('❌ Request failed. Please check config / network / RLS.');
                }
            }
        }

        document.getElementById('sb-check-run').onclick = runQuery;
        ownerEl.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') runQuery();
        });
        repoEl.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') runQuery();
        });

        // 聚焦第一行
        ownerEl.focus();
        ownerEl.select?.();
    }



    /* ============================================================
   六、SPA 路由监听（不 reload）
   ============================================================ */
    function onRouteChange() {
        const repoInfo = getRepoInfoIfHome();
        if (!repoInfo) {
            removeRepoButton();
            return;
        }
        // GitHub DOM 异步加载，延迟一帧
        setTimeout(() => createRepoButton(repoInfo), 300);
    }

    // hook pushState/replaceState
    ['pushState', 'replaceState'].forEach(type => {
        const original = history[type];
        history[type] = function () {
            const result = original.apply(this, arguments);
            window.dispatchEvent(new Event('tm:route-change'));
            return result;
        };
    });

    /******************************************************************
   * 启动
   ******************************************************************/
    // 前进/后退
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('tm:route-change')));

    // 自定义事件监听
    window.addEventListener('tm:route-change', onRouteChange);

    // 首次执行
    onRouteChange();
})();
