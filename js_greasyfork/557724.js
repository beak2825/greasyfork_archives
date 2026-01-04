// ==UserScript==
// @name         DLsite Wiki 信息提取工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  从 DLsite 游戏详情页提取信息并生成 Wiki 模板代码
// @author       Accard
// @match        https://www.dlsite.com/*/work/=/product_id/*
// @match        https://www.dlsite.com/*/announce/=/product_id/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license MIT licensed
// @downloadURL https://update.greasyfork.org/scripts/557724/DLsite%20Wiki%20%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/557724/DLsite%20Wiki%20%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 样式定义 (CSS) ---
    GM_addStyle(`
        #wiki-tool-btn { position: fixed; bottom: 80px; right: 20px; z-index: 9999; padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
        #wiki-tool-btn:hover { background: #0056b3; }
        #wiki-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 700px; max-height: 90vh; overflow-y: auto; background: white; z-index: 10000; border: 1px solid #ccc; box-shadow: 0 5px 15px rgba(0,0,0,0.5); border-radius: 8px; font-family: sans-serif; display: none; }
        #wiki-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; }
        #wiki-header h3 { margin: 0; font-size: 18px; color: #333; }
        #wiki-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #666; }
        #wiki-body { padding: 20px; }
        .wiki-row { margin-bottom: 12px; display: flex; align-items: center; }
        .wiki-label { width: 100px; font-weight: bold; font-size: 13px; color: #555; text-align: right; margin-right: 15px; flex-shrink: 0; }
        .wiki-input { flex-grow: 1; padding: 6px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px; }
        .wiki-select { padding: 6px; border-radius: 4px; border: 1px solid #ced4da; }
        .wiki-checkbox-group { display: flex; gap: 10px; flex-wrap: wrap; }
        .wiki-checkbox-label { font-size: 13px; display: flex; align-items: center; cursor: pointer; }
        .wiki-textarea { width: 100%; height: 150px; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-family: monospace; font-size: 12px; resize: vertical; }
        .wiki-actions { margin-top: 20px; text-align: center; border-top: 1px solid #eee; padding-top: 15px; }
        .wiki-btn { padding: 8px 20px; margin: 0 5px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; }
        .btn-gen { background: #28a745; color: white; }
        .btn-copy { background: #17a2b8; color: white; }
        .btn-gen:hover { background: #218838; }
    `);

    // --- 2. 创建 UI ---
    const btn = document.createElement('button');
    btn.id = 'wiki-tool-btn';
    btn.innerText = '📝 提取 Wiki 信息';
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'wiki-panel';
    panel.innerHTML = `
        <div id="wiki-header">
            <h3>Wiki 信息生成器</h3>
            <button id="wiki-close">×</button>
        </div>
        <div id="wiki-body">
            <div class="wiki-row"><label class="wiki-label">中文名</label><input type="text" id="w-cn-name" class="wiki-input" placeholder="手动输入中文名"></div>
            <div class="wiki-row"><label class="wiki-label">别名</label><input type="text" id="w-alias" class="wiki-input" placeholder="别名1, 别名2 (逗号分隔)"></div>

            <div class="wiki-row">
                <label class="wiki-label">平台</label>
                <div class="wiki-checkbox-group">
                    <label class="wiki-checkbox-label"><input type="checkbox" name="w-plat" value="PC" checked> PC</label>
                    <label class="wiki-checkbox-label"><input type="checkbox" name="w-plat" value="Android"> Android</label>
                    <label class="wiki-checkbox-label"><input type="checkbox" name="w-plat" value="MacOS"> MacOS</label>
                    <label class="wiki-checkbox-label"><input type="checkbox" name="w-plat" value="iOS"> iOS</label>
                    <label class="wiki-checkbox-label"><input type="checkbox" name="w-plat" value="Browser"> Browser</label>
                </div>
            </div>

            <div class="wiki-row">
                <label class="wiki-label">游戏类型</label>
                <select id="w-type" class="wiki-select">
                    <option value="RPG">RPG</option>
                    <option value="SLG">SLG (模拟)</option>
                    <option value="SIM">SIM (经营/养成)</option>
                    <option value="ACT">ACT (动作)</option>
                    <option value="ADV">ADV (冒险/视觉小说)</option>
                    <option value="AVG">AVG (冒险)</option>
                    <option value="STG">STG (射击)</option>
                    <option value="PZL">PZL (解谜)</option>
                    <option value="TBL">TBL (桌面)</option>
                    <option value="ETC">ETC (其他)</option>
                </select>
            </div>

            <div class="wiki-row">
                <label class="wiki-label">游戏引擎</label>
                <select id="w-engine" class="wiki-select">
                    <option value="">(未知/空)</option>
                    <option value="RPG Maker">RPG Maker</option>
                    <option value="Unity">Unity</option>
                    <option value="TyranoBuilder">TyranoBuilder</option>
                    <option value="Wolf RPG">Wolf RPG</option>
                    <option value="Unreal Engine">Unreal Engine</option>
                    <option value="Godot Engine">Godot Engine</option>
                    <option value="GameMaker">GameMaker</option>
                    <option value="GZDoom">GZDoom</option>
                    <option value="Ren'Py">Ren'Py</option>
                    <option value="Kirikiri">Kirikiri</option>
                </select>
            </div>

            <hr style="margin: 15px 0; border:0; border-top:1px dashed #ddd;">

            <div class="wiki-row"><label class="wiki-label">发行日期</label><input type="text" id="w-date" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">售价</label><input type="text" id="w-price" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">发行 (社团)</label><input type="text" id="w-publisher" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">开发 (作者)</label><input type="text" id="w-developer" class="wiki-input" placeholder="作者 / 社团"></div>
            <div class="wiki-row"><label class="wiki-label">剧本</label><input type="text" id="w-scenario" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">原画</label><input type="text" id="w-artist" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">声优</label><input type="text" id="w-cv" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">音乐</label><input type="text" id="w-music" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">系列</label><input type="text" id="w-series" class="wiki-input"></div>

            <hr style="margin: 15px 0; border:0; border-top:1px dashed #ddd;">

            <div class="wiki-row"><label class="wiki-label">官网链接</label><input type="text" id="w-website" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">链接</label><input type="text" id="w-link" class="wiki-input"></div>
            <div class="wiki-row"><label class="wiki-label">DLsite (RJ)</label><input type="text" id="w-rj" class="wiki-input"></div>

            <div class="wiki-actions">
                <button id="btn-gen" class="wiki-btn btn-gen">生成 Wiki 代码</button>
                <button id="btn-copy" class="wiki-btn btn-copy">复制结果</button>
            </div>
            <div style="margin-top:15px;">
                <textarea id="wiki-output" class="wiki-textarea" placeholder="结果将显示在这里..."></textarea>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // --- 3. 辅助函数 ---

    // 从表格 th 获取对应的 td 文本 (处理 DLsite 的表格结构)
    function getTableValue(headerText) {

        const headerTexts = Array.isArray(headerText) ? headerText : [headerText];

        // DLsite 的表格通常是 th 和 td 并列
        // 我们查找所有 th，看文本是否匹配，然后取下一个兄弟元素 td
        const ths = document.querySelectorAll('#work_outline th');
        for (let text of headerTexts) {
            for (let th of ths) {
                if (th.innerText.includes(text)) {
                    // 查找 th 后面的 td
                    let td = th.nextElementSibling;
                    if (td && td.tagName === 'TD') {
                        // 如果里面有 a 标签，提取所有 a 的文本并用 / 连接
                        const links = td.querySelectorAll('a');
                        if (links.length > 0) {
                            return Array.from(links).map(a => a.innerText.trim()).join('、');
                        }
                        // 否则直接返回文本，去除多余空白
                        return td.innerText.replace(/\s+/g, ' ').trim();
                    }
                }
            }
        }
        return "";
    }

    // --- 4. 提取逻辑 (核心) ---
    function extractData() {
        console.log("开始提取数据...");

        // 1. RJ号 (从 URL 或 页面 meta 获取最稳)
        const rjMatch = window.location.href.match(/product_id\/(RJ\d+)/i) || document.body.innerHTML.match(/(RJ\d{6,8})/);
        const rjId = rjMatch ? rjMatch[1].toUpperCase() : "";
        document.getElementById('w-rj').value = rjId;

        // 2. 链接 (自动生成 DLsite 链接)
        if (rjId) {
            document.getElementById('w-link').value = `https://www.dlsite.com/maniax/work/=/product_id/${rjId}.html`;
        }

        // 3. 社团 (发行)
        const circleEl = document.querySelector('#work_maker .maker_name a');
        const circleName = circleEl ? circleEl.innerText.trim() : "";
        document.getElementById('w-publisher').value = circleName;

        // 4. 作者 (如果没有单独的作者栏，通常开发=社团。如果有，开发=作者 / 社团)
        let authorName = getTableValue("作者");
        let devStr = circleName;
        if (authorName && authorName !== circleName) {
            // 将此处的分隔符 ' / ' 改为 '、'
            devStr = `${authorName}、${circleName}`;
        }
        document.getElementById('w-developer').value = devStr;

        // 5. 日期 (去除时间)
        let dateStr = getTableValue(["販売日","发售日"]); // "2025年11月28日 0時"
        dateStr = dateStr.replace(/(\d{4}年\d{1,2}月\d{1,2}日).*/, "$1"); // 只保留日期部分
        document.getElementById('w-date').value = dateStr;

        // 6. 售价 (修正：优先获取原价)
        let priceStr = "";
        // 原来的代码是找 .price (打折时的红字)，现在改为找 .work_price_base
        // 因为原价在 HTML 结构中排在最前面，querySelector 会优先抓取到第一个（即原价）
        const priceEl = document.querySelector('.work_buy_content .work_price_base') || document.querySelector('.work_buy_content .price');
        const priceSu = document.querySelector('.work_buy_content .work_price_suffix');

        if (priceEl) {
            // .work_price_base 里面通常只有纯数字
            // 但为了保险，还是保留去除逗号和円的逻辑，最后统一加上 "円"
            if(priceSu.innerText.trim() === 'RMB'){
                priceStr = priceEl.innerText.trim().replace(/,/g, '').replace(/元/g, '') + "元";
            }else{
                priceStr = priceEl.innerText.trim().replace(/,/g, '').replace(/円/g, '') + "円";
            }
        }
        document.getElementById('w-price').value = priceStr;

        // 7. 系列
        document.getElementById('w-series').value = getTableValue(["シリーズ名",'系列名']);

        // 8. 剧本
        document.getElementById('w-scenario').value = getTableValue(["シナリオ","剧情"]);

        // 9. 原画
        document.getElementById('w-artist').value = getTableValue(["イラスト","插画"]);

        // 10. 声优
        document.getElementById('w-cv').value = getTableValue(["声優","声优"]);

        // 11. 音乐 (新增)
        document.getElementById('w-music').value = getTableValue(["音楽","音乐"]);

        // 11. 游戏类型 (自动映射)
        const typeRaw = getTableValue("作品形式"); // 如 "シミュレーション"
        const typeSelect = document.getElementById('w-type');
        const typeMap = {
            'RPG': 'RPG',
            '角色扮演': 'RPG',
            'ロールプレイング': 'RPG',
            'シミュレーション': 'SLG',
            '模拟':'SLG',
            'アクション': 'ACT',
            '动作':'ACT',
            'アドベンチャー': 'ADV',
            'ビジュアルノベル': 'ADV',
            '冒险':'ADV',
            'シューティング': 'STG',
            'パズル': 'PZL',
            'クイズ': 'PZL',
            'テーブル': 'TBL',
            'デジタルノベル': 'ADV',
            'タイピング': 'ETC'
        };

        let mappedType = 'ETC';
        for (let key in typeMap) {
            if (typeRaw.includes(key)) {
                mappedType = typeMap[key];
                break;
            }
        }
        typeSelect.value = mappedType;

        // 12. 平台 (尝试检测，如果不确定则默认 PC)
        // DLsite 通常不直接写 Platform 列表，但从 file_type (如 EXE) 可以推断是 PC
        // 这里默认勾选 PC，不做复杂推断，防止误判
        document.querySelectorAll('input[name="w-plat"]').forEach(cb => {
            if (cb.value === 'PC') cb.checked = true;
            else cb.checked = false;
        });

        // 13. 游戏引擎 (从描述中自动检测)
        const descContainer = document.querySelector('div[itemprop="description"].work_parts_container');
        let engineDetected = '';

        if (descContainer) {
            const descText = descContainer.textContent;

            // 严格匹配，大小写敏感
            if (descText.includes('RPGツクール')) {
                engineDetected = 'RPG Maker';
            } else if (descText.includes('Unity')) {
                engineDetected = 'Unity';
            } else if (descText.includes('UE') || descText.includes('Unreal Engine') || descText.includes('UnrealEngine')) {
                engineDetected = 'Unreal Engine';
            } else if (descText.includes('ティラノビルダー')) {
                engineDetected = 'TyranoBuilder';
            }

            // 如果检测到引擎，设置下拉框
            if (engineDetected) {
                document.getElementById('w-engine').value = engineDetected;
            }
        }
    }


    // --- 5. 生成代码逻辑 ---
    function generateCode() {
        const getValue = (id) => document.getElementById(id).value.trim();

        // 别名处理
        let aliasStr = "";
        const aliasRaw = getValue('w-alias');
        if (aliasRaw) {
            const aliases = aliasRaw.replace(/，/g, ',').split(',').map(s => s.trim()).filter(s => s);
            if (aliases.length > 0) {
                aliasStr = "{\n" + aliases.map(a => `[${a}]`).join('\n') + "\n}";
            }
        }

        // 平台处理
        const plats = Array.from(document.querySelectorAll('input[name="w-plat"]:checked')).map(cb => cb.value);
        const platStr = "{\n" + plats.map(p => `[${p}]`).join('\n') + "\n}";

        // 链接处理
        let linkStr = "";
        const dlLink = getValue('w-link');
        if (dlLink) {
             linkStr = "{\n" + `[DLsite|${dlLink}]` + "\n}";
        }

        // 引擎处理 (如果为空则留空，不显示未知)
        const engineVal = document.getElementById('w-engine').value;

        // 构建行数组
        let lines = [];
        lines.push("{{Infobox Game");
        lines.push(`|中文名= ${getValue('w-cn-name')}`);
        lines.push(`|别名=${aliasStr}`);
        lines.push(`|平台=${platStr}`);
        lines.push(`|游戏类型= ${document.getElementById('w-type').value}`);
        lines.push(`|游戏引擎= ${engineVal}`); // 模板里如果为空会自动留空
        lines.push(`|游玩人数= 1`); // 默认1
        lines.push(`|发行日期= ${getValue('w-date')}`);
        lines.push(`|售价= ${getValue('w-price')}`);
        lines.push(`|开发= ${getValue('w-developer')}`);
        lines.push(`|发行= ${getValue('w-publisher')}`);
        lines.push(`|剧本= ${getValue('w-scenario')}`);
        lines.push(`|程序= `); // 暂无数据源
        lines.push(`|website= ${getValue('w-website')}`);
        lines.push(`|链接=${linkStr}`);
        lines.push(`|DLsite= ${getValue('w-rj')}`);

        // 可选字段：如果不为空才添加
        const addIfNotEmpty = (label, val) => {
            if (val) lines.push(`|${label}= ${val}`);
        };

        addIfNotEmpty("系列", getValue('w-series'));
        addIfNotEmpty("原画", getValue('w-artist'));
        addIfNotEmpty("声优", getValue('w-cv'));
        addIfNotEmpty("音乐", getValue('w-music'));

        lines.push("}}");

        document.getElementById('wiki-output').value = lines.join("\n");
    }

    // --- 6. 事件绑定 ---
    btn.onclick = () => {
        extractData(); // 每次打开面板时重新提取
        panel.style.display = 'block';
    };

    document.getElementById('wiki-close').onclick = () => {
        panel.style.display = 'none';
    };

    document.getElementById('btn-gen').onclick = () => {
        generateCode();
    };

    document.getElementById('btn-copy').onclick = () => {
        const textarea = document.getElementById('wiki-output');
        textarea.select();
        document.execCommand('copy');
        // 视觉反馈
        const btnCopy = document.getElementById('btn-copy');
        const originalText = btnCopy.innerText;
        btnCopy.innerText = "已复制！";
        btnCopy.style.backgroundColor = "#28a745";
        setTimeout(() => {
            btnCopy.innerText = originalText;
            btnCopy.style.backgroundColor = "#17a2b8";
        }, 1500);
    };

})();