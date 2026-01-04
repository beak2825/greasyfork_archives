// ==UserScript==
// @name         Steam 智能口味分析
// @namespace    https://github.com/linyaocrush/My-Tampermonkey-script
// @version      3.1
// @description  全本地逻辑，支持平权关键词、避雷屏蔽、全库画像自动同步、数据彻底重置。
// @author       AI Assistant
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.steampowered.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/559619/Steam%20%E6%99%BA%E8%83%BD%E5%8F%A3%E5%91%B3%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/559619/Steam%20%E6%99%BA%E8%83%BD%E5%8F%A3%E5%91%B3%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultConfig = {
        steam_api_key: "",
        steam_id: "",
        llm_api_key: "",
        llm_base_url: "https://api.deepseek.com",
        llm_model: "deepseek-chat",
        user_style: "无",
        blacklist: [],
        player_profile: "",
        profile_version: 0,
        owned_games: []
    };

    let config = GM_getValue("steam_ai_config", defaultConfig);

    function saveConfig(newConfig) {
        config = { ...config, ...newConfig };
        GM_setValue("steam_ai_config", config);
    }

    GM_registerMenuCommand("⚙️ AI 画像与 API 设置", showSettings);
    GM_registerMenuCommand("🔄 强制同步 Steam 库存", () => syncSteamLibrary(true));
    GM_registerMenuCommand("🗑️ 清空分析评分缓存", () => {
        if(confirm("确定清空已保存的游戏评分记录吗？（配置和画像将保留）")) {
            GM_setValue("game_cache", {});
            location.reload();
        }
    });
    GM_registerMenuCommand("🧨 彻底重置所有配置与数据", nuclearReset);

    function nuclearReset() {
        if(confirm("警告：这将删除所有 API Key、个人画像、库存记录及缓存数据！确认吗？")) {
            if(confirm("最后一次确认：所有设置将永久丢失！")) {
                GM_setValue("steam_ai_config", defaultConfig);
                GM_setValue("game_cache", {});
                alert("所有数据已抹除。");
                location.reload();
            }
        }
    }

    function setStatus(text, step = "WAIT") {
        const resEl = document.getElementById('ai-res');
        const tagEl = document.getElementById('ai-step-tag');
        if (resEl) resEl.innerText = text;
        if (tagEl) tagEl.innerText = step;
    }

    function injectUI() {
        if (document.getElementById('ai-panel')) return;
        let container = document.querySelector('.game_meta_data') || document.querySelector('.rightcol');
        if (!container) return;
        const box = document.createElement('div');
        box.id = "ai-panel";
        box.style = "background: #1b2838; color: #acb2b8; padding: 15px; border: 1px solid #67c1f5; margin-bottom: 16px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-family: sans-serif;";
        box.innerHTML = `
            <div style="color: #67c1f5; font-size: 11px; font-weight: bold; margin-bottom: 8px; display:flex; justify-content:space-between;">
                <span>AI 智能口味分析</span>
                <span id="ai-step-tag" style="opacity:0.6;">INIT</span>
            </div>
            <div id="ai-res" style="font-size: 13px;">等待配置或启动中...</div>
        `;
        container.prepend(box);
    }

    async function syncSteamLibrary(manual = false) {
        if (!config.steam_api_key || !config.steam_id) {
            if(manual) alert("请先填写 API Key 和 SteamID");
            return;
        }
        setStatus("正在从 Steam 同步库记录...", "SYNC");
        const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${config.steam_api_key}&steamid=${config.steam_id}&format=json&include_appinfo=true`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: async function(resp) {
                    try {
                        const data = JSON.parse(resp.responseText);
                        const allGames = data.response.games || [];
                        saveConfig({ owned_games: allGames });
                        setStatus("正在生成深度画像...", "LLM");
                        const profile = await generateProfile(allGames);
                        saveConfig({ player_profile: profile, profile_version: Date.now() });
                        setStatus("画像就绪", "DONE");
                        if(manual) alert("同步成功！");
                        resolve();
                    } catch(e) { reject(e); }
                },
                onerror: (e) => reject(e)
            });
        });
    }

    async function generateProfile(games) {
        const blSet = new Set(config.blacklist);
        const valid = games.filter(g => !blSet.has(g.appid));
        const recent = valid.filter(g => g.playtime_2weeks > 0).map(g => `${g.name}(${Math.round(g.playtime_2weeks/60)}h)`).join(", ");
        const top30 = valid.sort((a,b) => b.playtime_forever - a.playtime_forever).slice(0, 30).map(g => `${g.name}(${Math.round(g.playtime_forever/60)}h)`).join(", ");
        const prompt = `生成画像：[自主设定(等权)]: ${config.user_style} [近期活跃]: ${recent || "无"} [基因]: ${top30} 规则：关键词平权，严禁真人互动影视。输出200字口味画像。`;
        return callLLM(prompt, false);
    }

    async function callLLM(prompt, jsonMode = true) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${config.llm_base_url}/chat/completions`,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.llm_api_key}` },
                data: JSON.stringify({
                    model: config.llm_model,
                    messages: [{ role: "user", content: prompt }],
                    response_format: jsonMode ? { type: "json_object" } : undefined
                }),
                onload: (resp) => {
                    try {
                        const data = JSON.parse(resp.responseText);
                        const content = data.choices[0].message.content;
                        resolve(jsonMode ? JSON.parse(content) : content);
                    } catch(e) { reject(e); }
                },
                onerror: (e) => reject(e)
            });
        });
    }

    async function runAnalysis() {
        injectUI();
        if (!config.llm_api_key || !config.steam_id) {
            setStatus("请通过油猴菜单完成初始设置", "SETUP");
            return;
        }
        if (!config.player_profile) { await syncSteamLibrary(); }
        const gameName = document.querySelector('.apphub_AppName')?.innerText.trim();
        const tags = Array.from(document.querySelectorAll('.app_tag')).map(x => x.innerText.trim()).slice(0, 15).join(", ");
        const snippet = document.querySelector('.game_description_snippet')?.innerText.trim() || "";
        const reviews = Array.from(document.querySelectorAll('.review_content')).slice(0, 5).map(x => x.innerText.trim().substring(0, 200)).join(" | ");
        const cache = GM_getValue("game_cache", {});
        if (cache[gameName] && cache[gameName].version === config.profile_version) {
            displayResult(cache[gameName], true);
            return;
        }
        setStatus("正在抓取并由 AI 分析数据...", "ANALYZING");
        const prompt = `你是游戏匹配专家。画像：${config.player_profile} 偏好(平权)：${config.user_style} 目标游戏：${gameName} 标签：${tags} 简介：${snippet} 评论：${reviews} 规则：1. 必须用0-100百分制且返回整数。2. 真人互动影视必低于20。返回JSON: {"score": 整数, "reason": "字符串"}`;
        try {
            const result = await callLLM(prompt, true);
            cache[gameName] = { ...result, version: config.profile_version };
            GM_setValue("game_cache", cache);
            displayResult(result, false);
        } catch(e) { setStatus("AI 分析失败，请检查设置或 API", "ERROR"); }
    }

    function displayResult(data, cached) {
        let clr = "#5cffb4";
        if (data.score < 60) clr = "#ff4c4c";
        else if (data.score < 80) clr = "#ffb84d";
        const tag = document.getElementById('ai-step-tag');
        if (tag) tag.innerText = "DONE";
        const res = document.getElementById('ai-res');
        if (res) {
            res.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <span style="font-size: 32px; color: ${clr}; font-weight: bold; margin-right: 12px;">${data.score}%</span>
                    <span style="line-height: 1.4; font-size: 13px; color: #dfe3e6;">${data.reason}</span>
                </div>
                <div style="font-size: 10px; color: #556772; margin-top: 8px; border-top: 1px solid #333; padding-top: 4px;">
                    ${cached ? "⚡ 已加载本地存储记录" : "✨ 新评估结果：分析完成"}
                </div>
            `;
        }
    }

    function showSettings() {
        if (document.getElementById('ai-settings-overlay')) return;
        const overlay = document.createElement('div');
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:99999; display:flex; justify-content:center; align-items:center; color:white; font-family:sans-serif;";
        overlay.id = "ai-settings-overlay";
        const modal = document.createElement('div');
        modal.style = "background:#1b2838; padding:30px; border-radius:8px; width:600px; max-height:90vh; overflow-y:auto; border:1px solid #67c1f5;";
        modal.innerHTML = `
            <h2 style="color:#67c1f5; margin-top:0;">Steam AI 配置中心</h2>
            <div style="margin-bottom:12px;"><label>Steam API Key:</label><input type="password" id="s_api" style="width:100%; background:#16202d; color:white; border:1px solid #333; padding:8px;" value="${config.steam_api_key}"></div>
            <div style="margin-bottom:12px;"><label>SteamID64:</label><input type="text" id="s_id" style="width:100%; background:#16202d; color:white; border:1px solid #333; padding:8px;" value="${config.steam_id}"></div>
            <div style="margin-bottom:12px;"><label>LLM API Key:</label><input type="password" id="l_api" style="width:100%; background:#16202d; color:white; border:1px solid #333; padding:8px;" value="${config.llm_api_key}"></div>
            <div style="margin-bottom:12px;"><label>LLM URL:</label><input type="text" id="l_url" style="width:100%; background:#16202d; color:white; border:1px solid #333; padding:8px;" value="${config.llm_base_url}"></div>
            <div style="margin-bottom:12px;"><label>LLM 模型名称:</label><input type="text" id="l_model" style="width:100%; background:#16202d; color:white; border:1px solid #333; padding:8px;" value="${config.llm_model}"></div>
            <div style="margin-bottom:12px;"><label>偏好描述 (平权关键词):</label><textarea id="l_style" style="width:100%; height:80px; background:#16202d; color:white; border:1px solid #333; padding:8px;">${config.user_style}</textarea></div>
            <div style="margin-bottom:12px;"><label>分析过滤清单 (TOP 50):</label><div id="l_blacklist" style="max-height:150px; overflow-y:auto; background:#16202d; padding:10px; font-size:12px;">
                ${config.owned_games.sort((a,b)=>b.playtime_forever-a.playtime_forever).slice(0,50).map(g => `
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; ${config.blacklist.includes(g.appid)?'opacity:0.3; text-decoration:line-through;':''}">
                        <span>${g.name}</span>
                        <button onclick="window.toggleBl(${g.appid})" style="background:#3d4450; border:none; color:white; cursor:pointer;">${config.blacklist.includes(g.appid)?'恢复':'排除'}</button>
                    </div>
                `).join('')}
            </div></div>
            <button id="save_btn" style="width:100%; background:#67c1f5; color:white; border:none; padding:12px; cursor:pointer; font-weight:bold;">保存并生成新画像</button>
            <button id="nuclear_btn" style="width:100%; background:#ff4c4c; color:white; border:none; padding:8px; margin-top:20px; cursor:pointer; font-size:12px;">🧨 彻底清空所有设置与数据</button>
            <button id="close_btn" style="width:100%; background:transparent; color:#556772; border:none; margin-top:10px; cursor:pointer;">取消</button>
        `;
        document.body.appendChild(overlay);
        overlay.appendChild(modal);
        window.toggleBl = (id) => {
            let b = [...config.blacklist];
            b.includes(id) ? b = b.filter(x=>x!==id) : b.push(id);
            saveConfig({ blacklist: b });
            overlay.remove(); showSettings();
        };
        document.getElementById('save_btn').onclick = async () => {
            saveConfig({
                steam_api_key: document.getElementById('s_api').value,
                steam_id: document.getElementById('s_id').value,
                llm_api_key: document.getElementById('l_api').value,
                llm_base_url: document.getElementById('l_url').value,
                llm_model: document.getElementById('l_model').value,
                user_style: document.getElementById('l_style').value
            });
            overlay.remove();
            await syncSteamLibrary(true);
            location.reload();
        };
        document.getElementById('nuclear_btn').onclick = nuclearReset;
        document.getElementById('close_btn').onclick = () => overlay.remove();
    }

    setTimeout(runAnalysis, 1500);
})();
