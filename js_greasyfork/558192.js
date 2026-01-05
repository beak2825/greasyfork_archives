// ==UserScript==
// @name         粵語審音配詞字庫 - 美化版
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  美化粵語審音配詞字庫頁面，並直接在瀏覽器中解析數據（無需後端）。
// @author       Antigravity
// @match        https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cuhk.edu.hk
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @connect      humanum.arts.cuhk.edu.hk
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558192/%E7%B2%B5%E8%AA%9E%E5%AF%A9%E9%9F%B3%E9%85%8D%E8%A9%9E%E5%AD%97%E5%BA%AB%20-%20%E7%BE%8E%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558192/%E7%B2%B5%E8%AA%9E%E5%AF%A9%E9%9F%B3%E9%85%8D%E8%A9%9E%E5%AD%97%E5%BA%AB%20-%20%E7%BE%8E%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 只在顶层窗口运行，不在 iframe 中运行
    if (window.self !== window.top) {
        return;
    }

    // 只在首页运行，不在子页面运行
    const path = window.location.pathname;
    if (!path.endsWith('/lexi-can/') && !path.endsWith('/lexi-can/index.html') && path !== '/Lexis/lexi-can') {
        return;
    }

    // 立即停止原页面加载
    window.stop();

    // 将 GM_xmlhttpRequest 保存到全局变量，以便新文档中的脚本可以使用
    window._GM_xmlhttpRequest = GM_xmlhttpRequest;

    // 创建完整的新页面，包含所有 JS 代码
    const newHTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>粵語審音配詞字庫 - 美化版</title>
    <style>:root {
            /* 日间主题 */
            --bg-gradient-1: #667eea;
            --bg-gradient-2: #764ba2;
            --card-bg: rgba(255, 255, 255, 0.95);
            --card-bg-solid: #fff;
            --text-primary: #333;
            --text-secondary: #666;
            --text-muted: #888;
            --text-hint: #999;
            --border-color: #ddd;
            --input-bg: #fafafa;
            --btn-bg: #e8e8e8;
            --btn-hover: #d8d8d8;
            --history-btn-bg: #f0f0f0;
            --hot-btn-bg: #fff3e0;
            --hot-btn-color: #e65100;
            --link-btn-bg: #f0f0f0;
            --shadow-color: rgba(0, 0, 0, 0.15);
        }

        [data-theme="dark"] {
            /* 夜间主题 */
            --bg-gradient-1: #1a1a2e;
            --bg-gradient-2: #16213e;
            --card-bg: rgba(30, 30, 45, 0.95);
            --card-bg-solid: #1e1e2d;
            --text-primary: #e0e0e0;
            --text-secondary: #b0b0b0;
            --text-muted: #808080;
            --text-hint: #606060;
            --border-color: #404050;
            --input-bg: #252535;
            --btn-bg: #353545;
            --btn-hover: #454555;
            --history-btn-bg: #353545;
            --hot-btn-bg: #3d3020;
            --hot-btn-color: #ffb74d;
            --link-btn-bg: #353545;
            --shadow-color: rgba(0, 0, 0, 0.4);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft JhengHei", "微軟正黑體", sans-serif;
            background: linear-gradient(135deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 100%);
            min-height: 100vh;
            padding: 10px;
            transition: background 0.3s ease;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        /* 紧凑标题栏 */
        header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            padding: 10px 20px;
            background: var(--card-bg);
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 4px 15px var(--shadow-color);
            position: relative;
            transition: background 0.3s ease;
        }

        h1 {
            color: var(--text-primary);
            font-size: 1.4em;
            margin: 0;
            transition: color 0.3s ease;
        }

        .subtitle {
            color: var(--text-muted);
            font-size: 0.85em;
            margin: 0;
            transition: color 0.3s ease;
        }

        /* 主题切换按钮 */
        .theme-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            font-size: 1.1em;
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            transition: all 0.3s ease;
            opacity: 0.6;
        }

        .theme-toggle:hover {
            opacity: 1;
            background: var(--btn-bg);
        }

        /* 紧凑搜索区域 */
        .search-section {
            background: var(--card-bg);
            border-radius: 10px;
            padding: 12px 15px;
            margin-bottom: 10px;
            box-shadow: 0 4px 15px var(--shadow-color);
            transition: background 0.3s ease;
        }

        /* 搜索行 - 并排布局 */
        .search-row {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            flex-wrap: wrap;
        }

        /* 搜索分区 */
        .search-subsection {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-label {
            font-size: 0.85em;
            font-weight: 600;
            color: var(--text-secondary);
            white-space: nowrap;\r\n        }\r\n\r\n        /* 粵音搜索下拉框 */\r\n        .phon-select {\r\n            padding: 6px 8px;\r\n            font-size: 0.9em;\r\n            border: 2px solid var(--border-color);\r\n            border-radius: 6px;\r\n            background: var(--input-bg);\r\n            color: var(--text-primary);\r\n            cursor: pointer;\r\n            transition: all 0.2s ease;\r\n        }\r\n\r\n        .phon-select:focus {\r\n            outline: none;\r\n            border-color: #667eea;\r\n            box-shadow: 0 0 6px rgba(102, 126, 234, 0.25);\r\n        }\r\n\r\n        /* 紧凑漢字搜索 */
        .char-search {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .char-input {
            flex: 1;
            max-width: 300px;
            padding: 10px 15px;
            font-size: 1.4em;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            text-align: center;
            transition: all 0.2s ease;
            background: var(--input-bg);
            color: var(--text-primary);
        }

        .char-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.25);
            background: var(--card-bg-solid);
        }

        .char-input::placeholder {
            color: var(--text-hint);
            font-size: 0.5em;
        }

        /* 紧凑粵音搜索 */
        .phon-search {
            display: flex;
            gap: 10px;
            align-items: flex-end;
            flex-wrap: wrap;
        }

        .select-group {
            flex: 1;
            min-width: 100px;
        }

        .select-group label {
            display: block;
            margin-bottom: 4px;
            color: var(--text-secondary);
            font-weight: 500;
            font-size: 0.8em;
        }

        .select-group select {
            width: 100%;
            padding: 8px 10px;
            font-size: 0.95em;
            border: 2px solid var(--border-color);
            border-radius: 6px;
            background: var(--input-bg);
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .select-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 8px rgba(102, 126, 234, 0.25);
        }

        .search-btn {
            padding: 10px 25px;
            font-size: 0.95em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .search-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .search-btn:active {
            transform: translateY(0);
        }

        /* 結果表格區域 */
        .result-table-section {
            margin-top: 10px;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid var(--border-color);
        }

        .result-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85em;
        }

        .result-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .result-table th {
            color: white;
            padding: 6px 8px;
            text-align: left;
            font-weight: 500;
            font-size: 0.85em;
        }

        .result-table td {
            padding: 6px 8px;
            border-top: 1px solid var(--border-color);
            background: var(--card-bg-solid);
            vertical-align: middle;
        }

        .result-table tr:hover td {
            background: rgba(102, 126, 234, 0.08);
        }

        .col-char {
            width: 50px;
            text-align: center !important;
        }

        .col-pron {
            width: 70px;
        }

        .col-words {
            width: auto;
        }

        .col-homo {
            width: 120px;
        }

        .char-cell {
            font-size: 1.4em;
            font-weight: bold;
            color: #d32f2f;
            text-align: center;
        }

        .pron-btn {
            padding: 2px 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .pron-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
        }

        .pron-btn.playing {
            animation: pulse 0.3s ease-in-out;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .words-cell {
            color: var(--text-secondary);
            font-size: 0.9em;
            line-height: 1.4;
        }

        .homo-cell {
            color: var(--text-muted);
            font-size: 0.9em;
        }

        .homo-char {
            display: inline-block;
            margin: 1px 2px;
            color: #1976d2;
            cursor: pointer;
        }

        .homo-char:hover {
            color: #667eea;
            text-decoration: underline;
        }

        .no-data {
            color: var(--text-hint);
            font-style: italic;
            font-size: 0.85em;
            padding: 8px;
            text-align: center;
        }

        /* 歷史記錄和熱門搜索 */
        .history-section {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid var(--border-color);
        }

        .history-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            flex-wrap: wrap;
        }

        .history-row:last-child {
            margin-bottom: 0;
        }

        .history-label {
            color: var(--text-muted);
            font-size: 0.8em;
            min-width: 40px;
        }

        .history-empty {
            color: var(--text-hint);
            font-size: 0.8em;
            font-style: italic;
        }

        .history-list, .hot-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            flex: 1;
        }

        .history-btn, .hot-btn {
            display: inline-block;
            padding: 3px 8px;
            background: var(--history-btn-bg);
            color: var(--text-primary);
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9em;
        }

        .history-btn:hover {
            background: #667eea;
            color: white;
        }

        .hot-btn {
            background: var(--hot-btn-bg);
            color: var(--hot-btn-color);
        }

        .hot-btn:hover {
            background: #ff9800;
            color: white;
        }

        .clear-history-btn, .refresh-hot-btn {
            padding: 2px 6px;
            background: transparent;
            border: 1px solid var(--border-color);
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.75em;
            color: var(--text-hint);
            transition: all 0.2s ease;
        }

        .clear-history-btn:hover {
            background: #ffebee;
            border-color: #f44336;
            color: #f44336;
        }

        .refresh-hot-btn:hover {
            background: #e3f2fd;
            border-color: #2196f3;
            color: #2196f3;
        }

        .view-realtime-btn {
            padding: 2px 6px;
            background: transparent;
            border: 1px solid var(--border-color);
            border-radius: 3px;
            font-size: 0.7em;
            color: var(--text-hint);
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .view-realtime-btn:hover {
            background: var(--hot-btn-bg);
            border-color: #ff9800;
            color: var(--hot-btn-color);
        }

        #clear-history-btn {
            display: none;
        }

        /* 粤音搜索的快速示例 */
        .quick-examples {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;
        }

        .quick-examples span {
            color: var(--text-hint);
            font-size: 0.85em;
            margin-right: 5px;
        }

        .example-btn {
            display: inline-block;
            padding: 4px 10px;
            margin: 2px;
            background: var(--history-btn-bg);
            color: var(--text-primary);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.95em;
        }

        .example-btn:hover {
            background: #667eea;
            color: white;
        }

        .sound-btn {
            padding: 2px 5px;
            margin-left: -2px;
            margin-right: 6px;
            background: var(--btn-bg);
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            font-size: 0.7em;
            color: var(--text-hint);
            transition: all 0.2s ease;
        }

        .sound-btn:hover {
            background: #ff9800;
            color: white;
        }

        .example-btn {
            border-radius: 4px 0 0 4px;
            margin-right: 0;
        }

        /* 紧凑結果區域 */
        .result-section {
            background: var(--card-bg);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px var(--shadow-color);
            transition: background 0.3s ease;
        }

        .result-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .result-header h3 {
            font-size: 0.95em;
            font-weight: 500;
        }

        .open-original {
            padding: 4px 10px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            font-size: 0.8em;
        }

        .open-original:hover {
            background: rgba(255,255,255,0.3);
        }

        .result-frame {
            width: 100%;
            height: calc(100vh - 280px);
            min-height: 400px;
            border: none;
            background: var(--card-bg-solid);
        }

        .loading {
            display: none;
            text-align: center;
            padding: 30px;
            color: var(--text-secondary);
        }

        .loading.show {
            display: block;
        }

        .loading-spinner {
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* 紧凑功能鏈接 */
        .links-section {
            background: var(--card-bg);
            border-radius: 10px;
            padding: 10px 15px;
            margin-top: 10px;
            box-shadow: 0 4px 15px var(--shadow-color);
            transition: background 0.3s ease;
        }

        .links-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        }

        .link-btn {
            display: inline-block;
            padding: 6px 12px;
            background: var(--link-btn-bg);
            border-radius: 4px;
            text-decoration: none;
            color: var(--text-secondary);
            transition: all 0.2s ease;
            font-size: 0.85em;
        }

        .link-btn:hover {
            background: #667eea;
            color: white;
        }

        footer {
            text-align: center;
            padding: 10px;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 10px;
            font-size: 0.8em;
        }

        footer a {
            color: white;
        }

        footer p + p {
            margin-top: 3px;
        }

        /* 響應式設計 */
        @media (max-width: 768px) {
            header {
                flex-direction: column;
                gap: 5px;
            }

            h1 {
                font-size: 1.2em;
            }

            .char-input {
                font-size: 1.2em;
                max-width: none;
            }

            .search-btn {
                padding: 10px 20px;
            }

            .select-group {
                min-width: 80px;
            }

            .result-frame {
                height: calc(100vh - 320px);
            }
        }</style>
</head>
<body>
<div class="container">
        <header>
            <h1>粵語審音配詞字庫</h1>
            <span class="subtitle">香港中文大學人文電算研究中心</span>
            <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" title="切換主題">🌙</button>
        </header>

        <div class="search-section">
            <!-- 搜索行：漢字搜索和粵音搜索并排 -->
            <div class="search-row">
                <!-- 漢字搜索 -->
                <div class="search-subsection">
                    <div class="section-label">漢字：</div>
                    <input type="text" id="char-input" class="char-input"
                           placeholder="輸入漢字"
                           maxlength="2"
                           onkeypress="if(event.key==='Enter') searchChar()">
                    <button class="search-btn" onclick="searchChar()">搜索</button>
                </div>
                <!-- 粵音搜索 -->
                <div class="search-subsection">
                    <div class="section-label">粵音：</div>
                    <select id="initial" class="phon-select"><option value="-">聲母</option><option value="">(無)</option><option value="b">b</option><option value="c">c</option><option value="d">d</option><option value="f">f</option><option value="g">g</option><option value="gw">gw</option><option value="h">h</option><option value="j">j</option><option value="k">k</option><option value="kw">kw</option><option value="l">l</option><option value="m">m</option><option value="n">n</option><option value="ng">ng</option><option value="p">p</option><option value="s">s</option><option value="t">t</option><option value="w">w</option><option value="z">z</option></select>
                    <select id="final" class="phon-select"><option value="-">韻母</option><option value="">(無)</option><option value="aa">aa</option><option value="aai">aai</option><option value="aau">aau</option><option value="aam">aam</option><option value="aan">aan</option><option value="aang">aang</option><option value="aap">aap</option><option value="aat">aat</option><option value="aak">aak</option><option value="ai">ai</option><option value="au">au</option><option value="am">am</option><option value="an">an</option><option value="ang">ang</option><option value="ap">ap</option><option value="at">at</option><option value="ak">ak</option><option value="e">e</option><option value="ei">ei</option><option value="eu">eu</option><option value="em">em</option><option value="eng">eng</option><option value="ep">ep</option><option value="ek">ek</option><option value="i">i</option><option value="iu">iu</option><option value="im">im</option><option value="in">in</option><option value="ing">ing</option><option value="ip">ip</option><option value="it">it</option><option value="ik">ik</option><option value="o">o</option><option value="oi">oi</option><option value="ou">ou</option><option value="on">on</option><option value="ong">ong</option><option value="ot">ot</option><option value="ok">ok</option><option value="oe">oe</option><option value="oeng">oeng</option><option value="oek">oek</option><option value="eoi">eoi</option><option value="eon">eon</option><option value="eot">eot</option><option value="u">u</option><option value="ui">ui</option><option value="un">un</option><option value="ung">ung</option><option value="ut">ut</option><option value="uk">uk</option><option value="yu">yu</option><option value="yun">yun</option><option value="yut">yut</option><option value="m">m</option><option value="ng">ng</option></select>
                    <select id="tone" class="phon-select"><option value="-">聲調</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option></select>
                    <button class="search-btn" onclick="searchPhon()">搜索</button>
                </div>
            </div>
                <div class="result-table-section" id="result-table-section" style="display:none;">
                    <table class="result-table" id="result-table">
                        <thead>
                            <tr>
                                <th class="col-char">字</th>
                                <th class="col-pron">讀音</th>
                                <th class="col-words">詞例/備註</th>
                                <th class="col-homo">同音字</th>
                            </tr>
                        </thead>
                        <tbody id="result-table-body">
                        </tbody>
                    </table>
                </div>
                <div class="history-section">
                    <div class="history-row" id="history-row">
                        <span class="history-label">歷史：</span>
                        <span class="history-empty" id="history-empty">暫無記錄</span>
                        <span class="history-list" id="history-list"></span>
                        <button class="clear-history-btn" id="clear-history-btn" onclick="clearHistory()" title="清除歷史">✕</button>
                    </div>
                    <div class="history-row">
                        <span class="history-label">熱門：</span>
                        <span class="hot-list" id="hot-list">載入中...</span>
                        <button class="refresh-hot-btn" onclick="loadHotSearches()" title="刷新熱門">↻</button>
                        <a href="#" class="view-realtime-btn" onclick="return updateFrame('https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/just.php')" title="查看實時熱門">實時▶</a>
                    </div>
                </div>

        <div class="result-section">
            <div class="result-header">
                <h3>搜索結果</h3>
                <a id="original-link" href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/"
                   target="_blank" class="open-original">在原網站打開</a>
            </div>
            <div id="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>正在載入...</p>
            </div>
            <iframe id="result-frame" name="result-frame" class="result-frame"
                    src="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/main.php"></iframe>
        </div>

        <div class="links-section">
            <div class="links-grid">
                <a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/final.php"
                   class="link-btn" onclick="return updateFrame(this.href)">粵語韻母表</a>
                <a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/syllables.htm"
                   class="link-btn" onclick="return updateFrame(this.href)">粵語音節表</a>
                <a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/rad.php"
                   class="link-btn" onclick="return updateFrame(this.href)">漢字部首檢索</a>
                <a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/str.php"
                   class="link-btn" onclick="return updateFrame(this.href)">漢字筆畫檢索</a>
                <a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/stats.php"
                   class="link-btn" onclick="return updateFrame(this.href)">字庫統計</a>
                <a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/guide.php"
                   class="link-btn" onclick="return updateFrame(this.href)">使用凡例</a>
            </div>
        </div>

        <footer>
            <p>數據來源：<a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/" target="_blank">香港中文大學人文電算研究中心</a></p>
        </footer>
    </div>

    <!-- 隱藏表單用於處理 Big5 編碼 -->
    <form id="hidden-char-form" method="get" accept-charset="big5"
          action="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/search.php"
          target="result-frame" style="display:none;">
        <input type="text" name="q" id="hidden-char-input">
    </form>

    <form id="hidden-phon-form" method="get"
          action="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/pho-rel.php"
          target="result-frame" style="display:none;">
        <input type="hidden" name="s1" id="hidden-s1">
        <input type="hidden" name="s2" id="hidden-s2">
        <input type="hidden" name="s3" id="hidden-s3">
    </form>
<script>
// Big5 编码映射
const big5Map={'一':'%A4%40','乙':'%A4%41','丁':'%A4%42','七':'%A4%43','乃':'%A4%44','九':'%A4%45','了':'%A4%46','二':'%A4%47','人':'%A4%48','儿':'%A4%49','入':'%A4%4A','八':'%A4%4B','几':'%A4%4C','刀':'%A4%4D','刁':'%A4%4E','力':'%A4%4F','匕':'%A4%50','十':'%A4%51','卜':'%A4%52','又':'%A4%53','三':'%A4%54','下':'%A4%55','丈':'%A4%56','上':'%A4%57','丫':'%A4%58','丸':'%A4%59','凡':'%A4%5A','久':'%A4%5B','么':'%A4%5C','也':'%A4%5D','乞':'%A4%5E','于':'%A4%5F','亡':'%A4%60','兀':'%A4%61','刃':'%A4%62','勺':'%A4%63','千':'%A4%64','叉':'%A4%65','口':'%A4%66','土':'%A4%67','士':'%A4%68','夕':'%A4%69','大':'%A4%6A','女':'%A4%6B','子':'%A4%6C','孑':'%A4%6D','孓':'%A4%6E','寸':'%A4%6F','小':'%A4%70','尢':'%A4%71','尸':'%A4%72','山':'%A4%73','川':'%A4%74','工':'%A4%75','己':'%A4%76','已':'%A4%77','巳':'%A4%78','巾':'%A4%79','干':'%A4%7A','廾':'%A4%7B','弋':'%A4%7C','弓':'%A4%7D','才':'%A4%7E','丑':'%A4%A1','丐':'%A4%A2','不':'%A4%A3','中':'%A4%A4','丰':'%A4%A5','丹':'%A4%A6','之':'%A4%A7','尹':'%A4%A8','予':'%A4%A9','云':'%A4%AA','井':'%A4%AB','互':'%A4%AC','五':'%A4%AD','亢':'%A4%AE','仁':'%A4%AF','什':'%A4%B0','仃':'%A4%B1','仆':'%A4%B2','仇':'%A4%B3','仍':'%A4%B4','今':'%A4%B5','介':'%A4%B6','仄':'%A4%B7','元':'%A4%B8','允':'%A4%B9','內':'%A4%BA','六':'%A4%BB','兮':'%A4%BC','公':'%A4%BD','冗':'%A4%BE','凶':'%A4%BF','分':'%A4%C0','切':'%A4%C1','刈':'%A4%C2','勻':'%A4%C3','勾':'%A4%C4','勿':'%A4%C5','化':'%A4%C6','匹':'%A4%C7','午':'%A4%C8','升':'%A4%C9','卅':'%A4%CA','卞':'%A4%CB','厄':'%A4%CC','友':'%A4%CD','及':'%A4%CE','反':'%A4%CF','壬':'%A4%D0','天':'%A4%D1','夫':'%A4%D2','太':'%A4%D3','夭':'%A4%D4','孔':'%A4%D5','少':'%A4%D6','尤':'%A4%D7','尺':'%A4%D8','屯':'%A4%D9','巴':'%A4%DA','幻':'%A4%DB','廿':'%A4%DC','弔':'%A4%DD','引':'%A4%DE','心':'%A4%DF','戈':'%A4%E0','戶':'%A4%E1','手':'%A4%E2','扎':'%A4%E3','支':'%A4%E4','文':'%A4%E5','斗':'%A4%E6','斤':'%A4%E7','方':'%A4%E8','日':'%A4%E9','曰':'%A4%EA','月':'%A4%EB','木':'%A4%EC','欠':'%A4%ED','止':'%A4%EE','歹':'%A4%EF','毋':'%A4%F0','比':'%A4%F1','毛':'%A4%F2','氏':'%A4%F3','水':'%A4%F4','火':'%A4%F5','爪':'%A4%F6','父':'%A4%F7','爻':'%A4%F8','片':'%A4%F9','牙':'%A4%FA','牛':'%A4%FB','犬':'%A4%FC','王':'%A4%FD','丙':'%A4%FE','世':'%A5%40','丕':'%A5%41','且':'%A5%42','丘':'%A5%43','主':'%A5%44','乍':'%A5%45','乏':'%A5%46','乎':'%A5%47','以':'%A5%48','付':'%A5%49','仔':'%A5%4A','仕':'%A5%4B','他':'%A5%4C','仗':'%A5%4D','代':'%A5%4E','令':'%A5%4F','仙':'%A5%50','仞':'%A5%51','充':'%A5%52','兄':'%A5%53','冉':'%A5%54','冊':'%A5%55','冬':'%A5%56','凹':'%A5%57','出':'%A5%58','凸':'%A5%59','刊':'%A5%5A','加':'%A5%5B','功':'%A5%5C','包':'%A5%5D','匆':'%A5%5E','北':'%A5%5F','匝':'%A5%60','仟':'%A5%61','半':'%A5%62','卉':'%A5%63','卡':'%A5%64','占':'%A5%65','卯':'%A5%66','卮':'%A5%67','去':'%A5%68','可':'%A5%69','古':'%A5%6A','右':'%A5%6B','召':'%A5%6C','叮':'%A5%6D','叩':'%A5%6E','叨':'%A5%6F','叼':'%A5%70','司':'%A5%71','叵':'%A5%72','叫':'%A5%73','另':'%A5%74','只':'%A5%75','史':'%A5%76','叱':'%A5%77','台':'%A5%78','句':'%A5%79','叭':'%A5%7A','叻':'%A5%7B','四':'%A5%7C','囚':'%A5%7D','外':'%A5%7E','央':'%A5%A1','失':'%A5%A2','奴':'%A5%A3','奶':'%A5%A4','孕':'%A5%A5','它':'%A5%A6','尼':'%A5%A7','巨':'%A5%A8','巧':'%A5%A9','左':'%A5%AA','市':'%A5%AB','布':'%A5%AC','平':'%A5%AD','幼':'%A5%AE','弁':'%A5%AF','弘':'%A5%B0','弗':'%A5%B1','必':'%A5%B2','戊':'%A5%B3','打':'%A5%B4','扔':'%A5%B5','扒':'%A5%B6','扑':'%A5%B7','斥':'%A5%B8','旦':'%A5%B9','朮':'%A5%BA','本':'%A5%BB','未':'%A5%BC','末':'%A5%BD','札':'%A5%BE','正':'%A5%BF','母':'%A5%C0','民':'%A5%C1','氐':'%A5%C2','永':'%A5%C3','汁':'%A5%C4','汀':'%A5%C5','氾':'%A5%C6','犯':'%A5%C7','玄':'%A5%C8','玉':'%A5%C9','瓜':'%A5%CA','瓦':'%A5%CB','甘':'%A5%CC','生':'%A5%CD','用':'%A5%CE','甩':'%A5%CF','田':'%A5%D0','由':'%A5%D1','甲':'%A5%D2','申':'%A5%D3','疋':'%A5%D4','白':'%A5%D5','皮':'%A5%D6','皿':'%A5%D7','目':'%A5%D8','矛':'%A5%D9','矢':'%A5%DA','石':'%A5%DB','示':'%A5%DC','禾':'%A5%DD','穴':'%A5%DE','立':'%A5%DF','丞':'%A5%E0','丟':'%A5%E1','乒':'%A5%E2','乓':'%A5%E3','乩':'%A5%E4','亙':'%A5%E5','交':'%A5%E6','亦':'%A5%E7','亥':'%A5%E8','仿':'%A5%E9','伉':'%A5%EA','伙':'%A5%EB','伊':'%A5%EC','伕':'%A5%ED','伍':'%A5%EE','伐':'%A5%EF','休':'%A5%F0','伏':'%A5%F1','仲':'%A5%F2','件':'%A5%F3','任':'%A5%F4','仰':'%A5%F5','仳':'%A5%F6','份':'%A5%F7','企':'%A5%F8','伋':'%A5%F9','光':'%A5%FA','兇':'%A5%FB','兆':'%A5%FC','先':'%A5%FD','全':'%A5%FE','共':'%A6%40','再':'%A6%41','冰':'%A6%42','列':'%A6%43','刑':'%A6%44','划':'%A6%45','刎':'%A6%46','刖':'%A6%47','劣':'%A6%48','匈':'%A6%49','匡':'%A6%4A','匠':'%A6%4B','印':'%A6%4C','危':'%A6%4D','吉':'%A6%4E','吏':'%A6%4F','同':'%A6%50','吊':'%A6%51','吐':'%A6%52','吁':'%A6%53','吋':'%A6%54','各':'%A6%55','向':'%A6%56','名':'%A6%57','合':'%A6%58','吃':'%A6%59','后':'%A6%5A','吆':'%A6%5B','吒':'%A6%5C','因':'%A6%5D','回':'%A6%5E','囝':'%A6%5F','圳':'%A6%60','地':'%A6%61','在':'%A6%62','圭':'%A6%63','圬':'%A6%64','圯':'%A6%65','圩':'%A6%66','夙':'%A6%67','多':'%A6%68','夷':'%A6%69','夸':'%A6%6A','妄':'%A6%6B','奸':'%A6%6C','妃':'%A6%6D','好':'%A6%6E','她':'%A6%6F','如':'%A6%70','妁':'%A6%71','字':'%A6%72','存':'%A6%73','宇':'%A6%74','守':'%A6%75','宅':'%A6%76','安':'%A6%77','寺':'%A6%78','尖':'%A6%79','屹':'%A6%7A','州':'%A6%7B','帆':'%A6%7C','并':'%A6%7D','年':'%A6%7E','式':'%A6%A1','弛':'%A6%A2','忙':'%A6%A3','忖':'%A6%A4','戎':'%A6%A5','戌':'%A6%A6','戍':'%A6%A7','成':'%A6%A8','扣':'%A6%A9','扛':'%A6%AA','托':'%A6%AB','收':'%A6%AC','早':'%A6%AD','旨':'%A6%AE','旬':'%A6%AF','旭':'%A6%B0','曲':'%A6%B1','曳':'%A6%B2','有':'%A6%B3','朽':'%A6%B4','朴':'%A6%B5','朱':'%A6%B6','朵':'%A6%B7','次':'%A6%B8','此':'%A6%B9','死':'%A6%BA','氖':'%A6%BB','汝':'%A6%BC','汗':'%A6%BD','汙':'%A6%BE','江':'%A6%BF','池':'%A6%C0','汐':'%A6%C1','汕':'%A6%C2','污':'%A6%C3','汛':'%A6%C4','汍':'%A6%C5','汎':'%A6%C6','灰':'%A6%C7','牟':'%A6%C8','牝':'%A6%C9','百':'%A6%CA','竹':'%A6%CB','米':'%A6%CC','糸':'%A6%CD','缶':'%A6%CE','羊':'%A6%CF','羽':'%A6%D0','老':'%A6%D1','考':'%A6%D2','而':'%A6%D3','耒':'%A6%D4','耳':'%A6%D5','聿':'%A6%D6','肉':'%A6%D7','肋':'%A6%D8','肌':'%A6%D9','臣':'%A6%DA','自':'%A6%DB','至':'%A6%DC','臼':'%A6%DD','舌':'%A6%DE','舛':'%A6%DF','舟':'%A6%E0','艮':'%A6%E1','色':'%A6%E2','艾':'%A6%E3','虫':'%A6%E4','血':'%A6%E5','行':'%A6%E6','衣':'%A6%E7','西':'%A6%E8','阡':'%A6%E9','串':'%A6%EA','亨':'%A6%EB','位':'%A6%EC','住':'%A6%ED','佇':'%A6%EE','佗':'%A6%EF','佞':'%A6%F0','伴':'%A6%F1','佛':'%A6%F2','何':'%A6%F3','估':'%A6%F4','佐':'%A6%F5','佑':'%A6%F6','伽':'%A6%F7','伺':'%A6%F8','伸':'%A6%F9','佃':'%A6%FA','佔':'%A6%FB','似':'%A6%FC','但':'%A6%FD','佣':'%A6%FE','作':'%A7%40','你':'%A7%41','伯':'%A7%42','低':'%A7%43','伶':'%A7%44','余':'%A7%45','佝':'%A7%46','佈':'%A7%47','佚':'%A7%48','兌':'%A7%49','克':'%A7%4A','免':'%A7%4B','兵':'%A7%4C','冶':'%A7%4D','冷':'%A7%4E','別':'%A7%4F','判':'%A7%50','利':'%A7%51','刪':'%A7%52','刨':'%A7%53','劫':'%A7%54','助':'%A7%55','努':'%A7%56','劬':'%A7%57','匣':'%A7%58','即':'%A7%59','卵':'%A7%5A','吝':'%A7%5B','吭':'%A7%5C','吞':'%A7%5D','吾':'%A7%5E','否':'%A7%5F','呎':'%A7%60','吧':'%A7%61','呆':'%A7%62','呃':'%A7%63','吳':'%A7%64','呈':'%A7%65','呂':'%A7%66','君':'%A7%67','吩':'%A7%68','告':'%A7%69','吹':'%A7%6A','吻':'%A7%6B','吸':'%A7%6C','吮':'%A7%6D','吵':'%A7%6E','吶':'%A7%6F','吠':'%A7%70','吼':'%A7%71','呀':'%A7%72','吱':'%A7%73','含':'%A7%74','吟':'%A7%75','听':'%A7%76','囪':'%A7%77','困':'%A7%78','囤':'%A7%79','囫':'%A7%7A','坊':'%A7%7B','坑':'%A7%7C','址':'%A7%7D','坍':'%A7%7E','均':'%A7%A1','坎':'%A7%A2','圾':'%A7%A3','坐':'%A7%A4','坏':'%A7%A5','圻':'%A7%A6','壯':'%A7%A7','夾':'%A7%A8','妝':'%A7%A9','妒':'%A7%AA','妨':'%A7%AB','妞':'%A7%AC','妣':'%A7%AD','妙':'%A7%AE','妖':'%A7%AF','妍':'%A7%B0','妤':'%A7%B1','妓':'%A7%B2','妊':'%A7%B3','妥':'%A7%B4','孝':'%A7%B5','孜':'%A7%B6','孚':'%A7%B7','孛':'%A7%B8','完':'%A7%B9','宋':'%A7%BA','宏':'%A7%BB','尬':'%A7%BC','局':'%A7%BD','屁':'%A7%BE','尿':'%A7%BF','尾':'%A7%C0','岐':'%A7%C1','岑':'%A7%C2','岔':'%A7%C3','岌':'%A7%C4','巫':'%A7%C5','希':'%A7%C6','序':'%A7%C7','庇':'%A7%C8','床':'%A7%C9','廷':'%A7%CA','弄':'%A7%CB','弟':'%A7%CC','彤':'%A7%CD','形':'%A7%CE','彷':'%A7%CF','役':'%A7%D0','忘':'%A7%D1','忌':'%A7%D2','志':'%A7%D3','忍':'%A7%D4','忱':'%A7%D5','快':'%A7%D6','忸':'%A7%D7','忪':'%A7%D8','戒':'%A7%D9','我':'%A7%DA','抄':'%A7%DB','抗':'%A7%DC','抖':'%A7%DD','技':'%A7%DE','扶':'%A7%DF','抉':'%A7%E0','扭':'%A7%E1','把':'%A7%E2','扼':'%A7%E3','找':'%A7%E4','批':'%A7%E5','扳':'%A7%E6','抒':'%A7%E7','扯':'%A7%E8','折':'%A7%E9','扮':'%A7%EA','投':'%A7%EB','抓':'%A7%EC','抑':'%A7%ED','抆':'%A7%EE','改':'%A7%EF','攻':'%A7%F0','攸':'%A7%F1','旱':'%A7%F2','更':'%A7%F3','束':'%A7%F4','李':'%A7%F5','杏':'%A7%F6','材':'%A7%F7','村':'%A7%F8','杜':'%A7%F9','杖':'%A7%FA','杞':'%A7%FB','杉':'%A7%FC','杆':'%A7%FD','杠':'%A7%FE','杓':'%A8%40','杗':'%A8%41','步':'%A8%42','每':'%A8%43','求':'%A8%44','汞':'%A8%45','沙':'%A8%46','沁':'%A8%47','沈':'%A8%48','沉':'%A8%49','沅':'%A8%4A','沛':'%A8%4B','汪':'%A8%4C','決':'%A8%4D','沐':'%A8%4E','汰':'%A8%4F','沌':'%A8%50','汨':'%A8%51','沖':'%A8%52','沒':'%A8%53','汽':'%A8%54','沃':'%A8%55','汲':'%A8%56','汾':'%A8%57','汴':'%A8%58','沆':'%A8%59','汶':'%A8%5A','沍':'%A8%5B','沔':'%A8%5C','沘':'%A8%5D','沂':'%A8%5E','灶':'%A8%5F','灼':'%A8%60','災':'%A8%61','灸':'%A8%62','牢':'%A8%63','牡':'%A8%64','牠':'%A8%65','狄':'%A8%66','狂':'%A8%67','玖':'%A8%68','甬':'%A8%69','甫':'%A8%6A','男':'%A8%6B','甸':'%A8%6C','皂':'%A8%6D','盯':'%A8%6E','矣':'%A8%6F','私':'%A8%70','秀':'%A8%71','禿':'%A8%72','究':'%A8%73','系':'%A8%74','罕':'%A8%75','肖':'%A8%76','肓':'%A8%77','肝':'%A8%78','肘':'%A8%79','肛':'%A8%7A','肚':'%A8%7B','育':'%A8%7C','良':'%A8%7D','芒':'%A8%7E','芋':'%A8%A1','芍':'%A8%A2','見':'%A8%A3','角':'%A8%A4','言':'%A8%A5','谷':'%A8%A6','豆':'%A8%A7','豕':'%A8%A8','貝':'%A8%A9','赤':'%A8%AA','走':'%A8%AB','足':'%A8%AC','身':'%A8%AD','車':'%A8%AE','辛':'%A8%AF','辰':'%A8%B0','迂':'%A8%B1','迆':'%A8%B2','迅':'%A8%B3','迄':'%A8%B4','巡':'%A8%B5','邑':'%A8%B6','邢':'%A8%B7','邪':'%A8%B8','邦':'%A8%B9','那':'%A8%BA','酉':'%A8%BB','釆':'%A8%BC','里':'%A8%BD','防':'%A8%BE','阮':'%A8%BF','阱':'%A8%C0','阪':'%A8%C1','阬':'%A8%C2','並':'%A8%C3','乖':'%A8%C4','乳':'%A8%C5','事':'%A8%C6','些':'%A8%C7','亞':'%A8%C8','享':'%A8%C9','京':'%A8%CA','佯':'%A8%CB','依':'%A8%CC','侍':'%A8%CD','佳':'%A8%CE','使':'%A8%CF','佬':'%A8%D0','供':'%A8%D1','例':'%A8%D2','來':'%A8%D3','侃':'%A8%D4','佰':'%A8%D5','併':'%A8%D6','侈':'%A8%D7','佩':'%A8%D8','佻':'%A8%D9','侖':'%A8%DA','佾':'%A8%DB','侏':'%A8%DC','侑':'%A8%DD','佺':'%A8%DE','兔':'%A8%DF','兒':'%A8%E0','兕':'%A8%E1','兩':'%A8%E2','具':'%A8%E3','其':'%A8%E4','典':'%A8%E5','冽':'%A8%E6','函':'%A8%E7','刻':'%A8%E8','券':'%A8%E9','刷':'%A8%EA','刺':'%A8%EB','到':'%A8%EC','刮':'%A8%ED','制':'%A8%EE','剁':'%A8%EF','劾':'%A8%F0','劻':'%A8%F1','卒':'%A8%F2','協':'%A8%F3','卓':'%A8%F4','卑':'%A8%F5','卦':'%A8%F6','卷':'%A8%F7','卸':'%A8%F8','卹':'%A8%F9','取':'%A8%FA','叔':'%A8%FB','受':'%A8%FC','味':'%A8%FD','呵':'%A8%FE','咖':'%A9%40','呸':'%A9%41','咕':'%A9%42','咀':'%A9%43','呻':'%A9%44','呷':'%A9%45','咄':'%A9%46','咒':'%A9%47','咆':'%A9%48','呼':'%A9%49','咐':'%A9%4A','呱':'%A9%4B','呶':'%A9%4C','和':'%A9%4D','咚':'%A9%4E','呢':'%A9%4F','周':'%A9%50','咋':'%A9%51','命':'%A9%52','咎':'%A9%53','固':'%A9%54','垃':'%A9%55','坷':'%A9%56','坪':'%A9%57','坩':'%A9%58','坡':'%A9%59','坦':'%A9%5A','坤':'%A9%5B','坼':'%A9%5C','夜':'%A9%5D','奉':'%A9%5E','奇':'%A9%5F','奈':'%A9%60','奄':'%A9%61','奔':'%A9%62','妾':'%A9%63','妻':'%A9%64','委':'%A9%65','妹':'%A9%66','妮':'%A9%67','姑':'%A9%68','姆':'%A9%69','姐':'%A9%6A','姍':'%A9%6B','始':'%A9%6C','姓':'%A9%6D','姊':'%A9%6E','妯':'%A9%6F','妳':'%A9%70','姒':'%A9%71','姅':'%A9%72','孟':'%A9%73','孤':'%A9%74','季':'%A9%75','宗':'%A9%76','定':'%A9%77','官':'%A9%78','宜':'%A9%79','宙':'%A9%7A','宛':'%A9%7B','尚':'%A9%7C','屈':'%A9%7D','居':'%A9%7E','屆':'%A9%A1','岷':'%A9%A2','岡':'%A9%A3','岸':'%A9%A4','岩':'%A9%A5','岫':'%A9%A6','岱':'%A9%A7','岳':'%A9%A8','帘':'%A9%A9','帚':'%A9%AA','帖':'%A9%AB','帕':'%A9%AC','帛':'%A9%AD','帑':'%A9%AE','幸':'%A9%AF','庚':'%A9%B0','店':'%A9%B1','府':'%A9%B2','底':'%A9%B3','庖':'%A9%B4','延':'%A9%B5','弦':'%A9%B6','弧':'%A9%B7','弩':'%A9%B8','往':'%A9%B9','征':'%A9%BA','彿':'%A9%BB','彼':'%A9%BC','忝':'%A9%BD','忠':'%A9%BE','忽':'%A9%BF','念':'%A9%C0','忿':'%A9%C1','怏':'%A9%C2','怔':'%A9%C3','怯':'%A9%C4','怵':'%A9%C5','怖':'%A9%C6','怪':'%A9%C7','怕':'%A9%C8','怡':'%A9%C9','性':'%A9%CA','怩':'%A9%CB','怫':'%A9%CC','怛':'%A9%CD','或':'%A9%CE','戕':'%A9%CF','房':'%A9%D0','戾':'%A9%D1','所':'%A9%D2','承':'%A9%D3','拉':'%A9%D4','拌':'%A9%D5','拄':'%A9%D6','抿':'%A9%D7','拂':'%A9%D8','抹':'%A9%D9','拒':'%A9%DA','招':'%A9%DB','披':'%A9%DC','拓':'%A9%DD','拔':'%A9%DE','拋':'%A9%DF','拈':'%A9%E0','抨':'%A9%E1','抽':'%A9%E2','押':'%A9%E3','拐':'%A9%E4','拙':'%A9%E5','拇':'%A9%E6','拍':'%A9%E7','抵':'%A9%E8','拚':'%A9%E9','抱':'%A9%EA','拘':'%A9%EB','拖':'%A9%EC','拗':'%A9%ED','拆':'%A9%EE','抬':'%A9%EF','拎':'%A9%F0','放':'%A9%F1','斧':'%A9%F2','於':'%A9%F3','旺':'%A9%F4','昔':'%A9%F5','易':'%A9%F6','昌':'%A9%F7','昆':'%A9%F8','昂':'%A9%F9','明':'%A9%FA','昀':'%A9%FB','昏':'%A9%FC','昕':'%A9%FD','昊':'%A9%FE','昇':'%AA%40','服':'%AA%41','朋':'%AA%42','杭':'%AA%43','枋':'%AA%44','枕':'%AA%45','東':'%AA%46','果':'%AA%47','杳':'%AA%48','杷':'%AA%49','枇':'%AA%4A','枝':'%AA%4B','林':'%AA%4C','杯':'%AA%4D','杰':'%AA%4E','板':'%AA%4F','枉':'%AA%50','松':'%AA%51','析':'%AA%52','杵':'%AA%53','枚':'%AA%54','枓':'%AA%55','杼':'%AA%56','杪':'%AA%57','杲':'%AA%58','欣':'%AA%59','武':'%AA%5A','歧':'%AA%5B','歿':'%AA%5C','氓':'%AA%5D','氛':'%AA%5E','泣':'%AA%5F','注':'%AA%60','泳':'%AA%61','沱':'%AA%62','泌':'%AA%63','泥':'%AA%64','河':'%AA%65','沽':'%AA%66','沾':'%AA%67','沼':'%AA%68','波':'%AA%69','沫':'%AA%6A','法':'%AA%6B','泓':'%AA%6C','沸':'%AA%6D','泄':'%AA%6E','油':'%AA%6F','況':'%AA%70','沮':'%AA%71','泗':'%AA%72','泅':'%AA%73','泱':'%AA%74','沿':'%AA%75','治':'%AA%76','泡':'%AA%77','泛':'%AA%78','泊':'%AA%79','沬':'%AA%7A','泯':'%AA%7B','泜':'%AA%7C','泖':'%AA%7D','泠':'%AA%7E','炕':'%AA%A1','炎':'%AA%A2','炒':'%AA%A3','炊':'%AA%A4','炙':'%AA%A5','爬':'%AA%A6','爭':'%AA%A7','爸':'%AA%A8','版':'%AA%A9','牧':'%AA%AA','物':'%AA%AB','狀':'%AA%AC','狎':'%AA%AD','狙':'%AA%AE','狗':'%AA%AF','狐':'%AA%B0','玩':'%AA%B1','玨':'%AA%B2','玟':'%AA%B3','玫':'%AA%B4','玥':'%AA%B5','甽':'%AA%B6','疝':'%AA%B7','疙':'%AA%B8','疚':'%AA%B9','的':'%AA%BA','盂':'%AA%BB','盲':'%AA%BC','直':'%AA%BD','知':'%AA%BE','矽':'%AA%BF','社':'%AA%C0','祀':'%AA%C1','祁':'%AA%C2','秉':'%AA%C3','秈':'%AA%C4','空':'%AA%C5','穹':'%AA%C6','竺':'%AA%C7','糾':'%AA%C8','罔':'%AA%C9','羌':'%AA%CA','羋':'%AA%CB','者':'%AA%CC','肺':'%AA%CD','肥':'%AA%CE','肢':'%AA%CF','肱':'%AA%D0','股':'%AA%D1','肫':'%AA%D2','肩':'%AA%D3','肴':'%AA%D4','肪':'%AA%D5','肯':'%AA%D6','臥':'%AA%D7','臾':'%AA%D8','舍':'%AA%D9','芳':'%AA%DA','芝':'%AA%DB','芙':'%AA%DC','芭':'%AA%DD','芽':'%AA%DE','芟':'%AA%DF','芹':'%AA%E0','花':'%AA%E1','芬':'%AA%E2','芥':'%AA%E3','芯':'%AA%E4','芸':'%AA%E5','芣':'%AA%E6','芰':'%AA%E7','芾':'%AA%E8','芷':'%AA%E9','虎':'%AA%EA','虱':'%AA%EB','初':'%AA%EC','表':'%AA%ED','軋':'%AA%EE','迎':'%AA%EF','返':'%AA%F0','近':'%AA%F1','邵':'%AA%F2','邸':'%AA%F3','邱':'%AA%F4','邶':'%AA%F5','采':'%AA%F6','金':'%AA%F7','長':'%AA%F8','門':'%AA%F9','阜':'%AA%FA','陀':'%AA%FB','阿':'%AA%FC','阻':'%AA%FD','附':'%AA%FE','陂':'%AB%40','隹':'%AB%41','雨':'%AB%42','青':'%AB%43','非':'%AB%44','亟':'%AB%45','亭':'%AB%46','亮':'%AB%47','信':'%AB%48','侵':'%AB%49','侯':'%AB%4A','便':'%AB%4B','俠':'%AB%4C','俑':'%AB%4D','俏':'%AB%4E','保':'%AB%4F','促':'%AB%50','侶':'%AB%51','俘':'%AB%52','俟':'%AB%53','俊':'%AB%54','俗':'%AB%55','侮':'%AB%56','俐':'%AB%57','俄':'%AB%58','係':'%AB%59','俚':'%AB%5A','俎':'%AB%5B','俞':'%AB%5C','侷':'%AB%5D','兗':'%AB%5E','冒':'%AB%5F','冑':'%AB%60','冠':'%AB%61','剎':'%AB%62','剃':'%AB%63','削':'%AB%64','前':'%AB%65','剌':'%AB%66','剋':'%AB%67','則':'%AB%68','勇':'%AB%69','勉':'%AB%6A','勃':'%AB%6B','勁':'%AB%6C','匍':'%AB%6D','南':'%AB%6E','卻':'%AB%6F','厚':'%AB%70','叛':'%AB%71','咬':'%AB%72','哀':'%AB%73','咨':'%AB%74','哎':'%AB%75','哉':'%AB%76','咸':'%AB%77','咦':'%AB%78','咳':'%AB%79','哇':'%AB%7A','哂':'%AB%7B','咽':'%AB%7C','咪':'%AB%7D','品':'%AB%7E','哄':'%AB%A1','哈':'%AB%A2','咯':'%AB%A3','咫':'%AB%A4','咱':'%AB%A5','咻':'%AB%A6','咩':'%AB%A7','咧':'%AB%A8','咿':'%AB%A9','囿':'%AB%AA','垂':'%AB%AB','型':'%AB%AC','垠':'%AB%AD','垣':'%AB%AE','垢':'%AB%AF','城':'%AB%B0','垮':'%AB%B1','垓':'%AB%B2','奕':'%AB%B3','契':'%AB%B4','奏':'%AB%B5','奎':'%AB%B6','奐':'%AB%B7','姜':'%AB%B8','姘':'%AB%B9','姿':'%AB%BA','姣':'%AB%BB','姨':'%AB%BC','娃':'%AB%BD','姥':'%AB%BE','姪':'%AB%BF','姚':'%AB%C0','姦':'%AB%C1','威':'%AB%C2','姻':'%AB%C3','孩':'%AB%C4','宣':'%AB%C5','宦':'%AB%C6','室':'%AB%C7','客':'%AB%C8','宥':'%AB%C9','封':'%AB%CA','屎':'%AB%CB','屏':'%AB%CC','屍':'%AB%CD','屋':'%AB%CE','峙':'%AB%CF','峒':'%AB%D0','巷':'%AB%D1','帝':'%AB%D2','帥':'%AB%D3','帟':'%AB%D4','幽':'%AB%D5','庠':'%AB%D6','度':'%AB%D7','建':'%AB%D8','弈':'%AB%D9','弭':'%AB%DA','彥':'%AB%DB','很':'%AB%DC','待':'%AB%DD','徊':'%AB%DE','律':'%AB%DF','徇':'%AB%E0','後':'%AB%E1','徉':'%AB%E2','怒':'%AB%E3','思':'%AB%E4','怠':'%AB%E5','急':'%AB%E6','怎':'%AB%E7','怨':'%AB%E8','恍':'%AB%E9','恰':'%AB%EA','恨':'%AB%EB','恢':'%AB%EC','恆':'%AB%ED','恃':'%AB%EE','恬':'%AB%EF','恫':'%AB%F0','恪':'%AB%F1','恤':'%AB%F2','扁':'%AB%F3','拜':'%AB%F4','挖':'%AB%F5','按':'%AB%F6','拼':'%AB%F7','拭':'%AB%F8','持':'%AB%F9','拮':'%AB%FA','拽':'%AB%FB','指':'%AB%FC','拱':'%AB%FD','拷':'%AB%FE','拯':'%AC%40','括':'%AC%41','拾':'%AC%42','拴':'%AC%43','挑':'%AC%44','挂':'%AC%45','政':'%AC%46','故':'%AC%47','斫':'%AC%48','施':'%AC%49','既':'%AC%4A','春':'%AC%4B','昭':'%AC%4C','映':'%AC%4D','昧':'%AC%4E','是':'%AC%4F','星':'%AC%50','昨':'%AC%51','昱':'%AC%52','昤':'%AC%53','曷':'%AC%54','柿':'%AC%55','染':'%AC%56','柱':'%AC%57','柔':'%AC%58','某':'%AC%59','柬':'%AC%5A','架':'%AC%5B','枯':'%AC%5C','柵':'%AC%5D','柩':'%AC%5E','柯':'%AC%5F','柄':'%AC%60','柑':'%AC%61','枴':'%AC%62','柚':'%AC%63','查':'%AC%64','枸':'%AC%65','柏':'%AC%66','柞':'%AC%67','柳':'%AC%68','枰':'%AC%69','柙':'%AC%6A','柢':'%AC%6B','柝':'%AC%6C','柒':'%AC%6D','歪':'%AC%6E','殃':'%AC%6F','殆':'%AC%70','段':'%AC%71','毒':'%AC%72','毗':'%AC%73','氟':'%AC%74','泉':'%AC%75','洋':'%AC%76','洲':'%AC%77','洪':'%AC%78','流':'%AC%79','津':'%AC%7A','洌':'%AC%7B','洱':'%AC%7C','洞':'%AC%7D','洗':'%AC%7E','活':'%AC%A1','洽':'%AC%A2','派':'%AC%A3','洶':'%AC%A4','洛':'%AC%A5','泵':'%AC%A6','洹':'%AC%A7','洧':'%AC%A8','洸':'%AC%A9','洩':'%AC%AA','洮':'%AC%AB','洵':'%AC%AC','洎':'%AC%AD','洫':'%AC%AE','炫':'%AC%AF','為':'%AC%B0','炳':'%AC%B1','炬':'%AC%B2','炯':'%AC%B3','炭':'%AC%B4','炸':'%AC%B5','炮':'%AC%B6','炤':'%AC%B7','爰':'%AC%B8','牲':'%AC%B9','牯':'%AC%BA','牴':'%AC%BB','狩':'%AC%BC','狠':'%AC%BD','狡':'%AC%BE','玷':'%AC%BF','珊':'%AC%C0','玻':'%AC%C1','玲':'%AC%C2','珍':'%AC%C3','珀':'%AC%C4','玳':'%AC%C5','甚':'%AC%C6','甭':'%AC%C7','畏':'%AC%C8','界':'%AC%C9','畎':'%AC%CA','畋':'%AC%CB','疫':'%AC%CC','疤':'%AC%CD','疥':'%AC%CE','疢':'%AC%CF','疣':'%AC%D0','癸':'%AC%D1','皆':'%AC%D2','皇':'%AC%D3','皈':'%AC%D4','盈':'%AC%D5','盆':'%AC%D6','盃':'%AC%D7','盅':'%AC%D8','省':'%AC%D9','盹':'%AC%DA','相':'%AC%DB','眉':'%AC%DC','看':'%AC%DD','盾':'%AC%DE','盼':'%AC%DF','眇':'%AC%E0','矜':'%AC%E1','砂':'%AC%E2','研':'%AC%E3','砌':'%AC%E4','砍':'%AC%E5','祆':'%AC%E6','祉':'%AC%E7','祈':'%AC%E8','祇':'%AC%E9','禹':'%AC%EA','禺':'%AC%EB','科':'%AC%EC','秒':'%AC%ED','秋':'%AC%EE','穿':'%AC%EF','突':'%AC%F0','竿':'%AC%F1','竽':'%AC%F2','籽':'%AC%F3','紂':'%AC%F4','紅':'%AC%F5','紀':'%AC%F6','紉':'%AC%F7','紇':'%AC%F8','約':'%AC%F9','紆':'%AC%FA','缸':'%AC%FB','美':'%AC%FC','羿':'%AC%FD','耄':'%AC%FE','耐':'%AD%40','耍':'%AD%41','耑':'%AD%42','耶':'%AD%43','胖':'%AD%44','胥':'%AD%45','胚':'%AD%46','胃':'%AD%47','胄':'%AD%48','背':'%AD%49','胡':'%AD%4A','胛':'%AD%4B','胎':'%AD%4C','胞':'%AD%4D','胤':'%AD%4E','胝':'%AD%4F','致':'%AD%50','舢':'%AD%51','苧':'%AD%52','范':'%AD%53','茅':'%AD%54','苣':'%AD%55','苛':'%AD%56','苦':'%AD%57','茄':'%AD%58','若':'%AD%59','茂':'%AD%5A','茉':'%AD%5B','苒':'%AD%5C','苗':'%AD%5D','英':'%AD%5E','茁':'%AD%5F','苜':'%AD%60','苔':'%AD%61','苑':'%AD%62','苞':'%AD%63','苓':'%AD%64','苟':'%AD%65','苯':'%AD%66','茆':'%AD%67','虐':'%AD%68','虹':'%AD%69','虻':'%AD%6A','虺':'%AD%6B','衍':'%AD%6C','衫':'%AD%6D','要':'%AD%6E','觔':'%AD%6F','計':'%AD%70','訂':'%AD%71','訃':'%AD%72','貞':'%AD%73','負':'%AD%74','赴':'%AD%75','赳':'%AD%76','趴':'%AD%77','軍':'%AD%78','軌':'%AD%79','述':'%AD%7A','迦':'%AD%7B','迢':'%AD%7C','迪':'%AD%7D','迥':'%AD%7E','迭':'%AD%A1','迫':'%AD%A2','迤':'%AD%A3','迨':'%AD%A4','郊':'%AD%A5','郎':'%AD%A6','郁':'%AD%A7','郃':'%AD%A8','酋':'%AD%A9','酊':'%AD%AA','重':'%AD%AB','閂':'%AD%AC','限':'%AD%AD','陋':'%AD%AE','陌':'%AD%AF','降':'%AD%B0','面':'%AD%B1','革':'%AD%B2','韋':'%AD%B3','韭':'%AD%B4','音':'%AD%B5','頁':'%AD%B6','風':'%AD%B7','飛':'%AD%B8','食':'%AD%B9','首':'%AD%BA','香':'%AD%BB','乘':'%AD%BC','亳':'%AD%BD','倌':'%AD%BE','倍':'%AD%BF','倣':'%AD%C0','俯':'%AD%C1','倦':'%AD%C2','倥':'%AD%C3','俸':'%AD%C4','倩':'%AD%C5','倖':'%AD%C6','倆':'%AD%C7','值':'%AD%C8','借':'%AD%C9','倚':'%AD%CA','倒':'%AD%CB','們':'%AD%CC','俺':'%AD%CD','倀':'%AD%CE','倔':'%AD%CF','倨':'%AD%D0','俱':'%AD%D1','倡':'%AD%D2','個':'%AD%D3','候':'%AD%D4','倘':'%AD%D5','俳':'%AD%D6','修':'%AD%D7','倭':'%AD%D8','倪':'%AD%D9','俾':'%AD%DA','倫':'%AD%DB','倉':'%AD%DC','兼':'%AD%DD','冤':'%AD%DE','冥':'%AD%DF','冢':'%AD%E0','凍':'%AD%E1','凌':'%AD%E2','准':'%AD%E3','凋':'%AD%E4','剖':'%AD%E5','剜':'%AD%E6','剔':'%AD%E7','剛':'%AD%E8','剝':'%AD%E9','匪':'%AD%EA','卿':'%AD%EB','原':'%AD%EC','厝':'%AD%ED','叟':'%AD%EE','哨':'%AD%EF','唐':'%AD%F0','唁':'%AD%F1','唷':'%AD%F2','哼':'%AD%F3','哥':'%AD%F4','哲':'%AD%F5','唆':'%AD%F6','哺':'%AD%F7','唔':'%AD%F8','哩':'%AD%F9','哭':'%AD%FA','員':'%AD%FB','唉':'%AD%FC','哮':'%AD%FD','哪':'%AD%FE','哦':'%AE%40','唧':'%AE%41','唇':'%AE%42','哽':'%AE%43','唏':'%AE%44','圃':'%AE%45','圄':'%AE%46','埂':'%AE%47','埔':'%AE%48','埋':'%AE%49','埃':'%AE%4A','堉':'%AE%4B','夏':'%AE%4C','套':'%AE%4D','奘':'%AE%4E','奚':'%AE%4F','娑':'%AE%50','娘':'%AE%51','娜':'%AE%52','娟':'%AE%53','娛':'%AE%54','娓':'%AE%55','姬':'%AE%56','娠':'%AE%57','娣':'%AE%58','娩':'%AE%59','娥':'%AE%5A','娌':'%AE%5B','娉':'%AE%5C','孫':'%AE%5D','屘':'%AE%5E','宰':'%AE%5F','害':'%AE%60','家':'%AE%61','宴':'%AE%62','宮':'%AE%63','宵':'%AE%64','容':'%AE%65','宸':'%AE%66','射':'%AE%67','屑':'%AE%68','展':'%AE%69','屐':'%AE%6A','峭':'%AE%6B','峽':'%AE%6C','峻':'%AE%6D','峪':'%AE%6E','峨':'%AE%6F','峰':'%AE%70','島':'%AE%71','崁':'%AE%72','峴':'%AE%73','差':'%AE%74','席':'%AE%75','師':'%AE%76','庫':'%AE%77','庭':'%AE%78','座':'%AE%79','弱':'%AE%7A','徒':'%AE%7B','徑':'%AE%7C','徐':'%AE%7D','恙':'%AE%7E','恣':'%AE%A1','恥':'%AE%A2','恐':'%AE%A3','恕':'%AE%A4','恭':'%AE%A5','恩':'%AE%A6','息':'%AE%A7','悄':'%AE%A8','悟':'%AE%A9','悚':'%AE%AA','悍':'%AE%AB','悔':'%AE%AC','悌':'%AE%AD','悅':'%AE%AE','悖':'%AE%AF','扇':'%AE%B0','拳':'%AE%B1','挈':'%AE%B2','拿':'%AE%B3','捎':'%AE%B4','挾':'%AE%B5','振':'%AE%B6','捕':'%AE%B7','捂':'%AE%B8','捆':'%AE%B9','捏':'%AE%BA','捉':'%AE%BB','挺':'%AE%BC','捐':'%AE%BD','挽':'%AE%BE','挪':'%AE%BF','挫':'%AE%C0','挨':'%AE%C1','捍':'%AE%C2','捌':'%AE%C3','效':'%AE%C4','敉':'%AE%C5','料':'%AE%C6','旁':'%AE%C7','旅':'%AE%C8','時':'%AE%C9','晉':'%AE%CA','晏':'%AE%CB','晃':'%AE%CC','晒':'%AE%CD','晌':'%AE%CE','晅':'%AE%CF','晁':'%AE%D0','書':'%AE%D1','朔':'%AE%D2','朕':'%AE%D3','朗':'%AE%D4','校':'%AE%D5','核':'%AE%D6','案':'%AE%D7','框':'%AE%D8','桓':'%AE%D9','根':'%AE%DA','桂':'%AE%DB','桔':'%AE%DC','栩':'%AE%DD','梳':'%AE%DE','栗':'%AE%DF','桌':'%AE%E0','桑':'%AE%E1','栽':'%AE%E2','柴':'%AE%E3','桐':'%AE%E4','桀':'%AE%E5','格':'%AE%E6','桃':'%AE%E7','株':'%AE%E8','桅':'%AE%E9','栓':'%AE%EA','栘':'%AE%EB','桁':'%AE%EC','殊':'%AE%ED','殉':'%AE%EE','殷':'%AE%EF','氣':'%AE%F0','氧':'%AE%F1','氨':'%AE%F2','氦':'%AE%F3','氤':'%AE%F4','泰':'%AE%F5','浪':'%AE%F6','涕':'%AE%F7','消':'%AE%F8','涇':'%AE%F9','浦':'%AE%FA','浸':'%AE%FB','海':'%AE%FC','浙':'%AE%FD','涓':'%AE%FE','浬':'%AF%40','涉':'%AF%41','浮':'%AF%42','浚':'%AF%43','浴':'%AF%44','浩':'%AF%45','涌':'%AF%46','涊':'%AF%47','浹':'%AF%48','涅':'%AF%49','浥':'%AF%4A','涔':'%AF%4B','烊':'%AF%4C','烘':'%AF%4D','烤':'%AF%4E','烙':'%AF%4F','烈':'%AF%50','烏':'%AF%51','爹':'%AF%52','特':'%AF%53','狼':'%AF%54','狹':'%AF%55','狽':'%AF%56','狸':'%AF%57','狷':'%AF%58','玆':'%AF%59','班':'%AF%5A','琉':'%AF%5B','珮':'%AF%5C','珠':'%AF%5D','珪':'%AF%5E','珞':'%AF%5F','畔':'%AF%60','畝':'%AF%61','畜':'%AF%62','畚':'%AF%63','留':'%AF%64','疾':'%AF%65','病':'%AF%66','症':'%AF%67','疲':'%AF%68','疳':'%AF%69','疽':'%AF%6A','疼':'%AF%6B','疹':'%AF%6C','痂':'%AF%6D','疸':'%AF%6E','皋':'%AF%6F','皰':'%AF%70','益':'%AF%71','盍':'%AF%72','盎':'%AF%73','眩':'%AF%74','真':'%AF%75','眠':'%AF%76','眨':'%AF%77','矩':'%AF%78','砰':'%AF%79','砧':'%AF%7A','砸':'%AF%7B','砝':'%AF%7C','破':'%AF%7D','砷':'%AF%7E','砥':'%AF%A1','砭':'%AF%A2','砠':'%AF%A3','砟':'%AF%A4','砲':'%AF%A5','祕':'%AF%A6','祐':'%AF%A7','祠':'%AF%A8','祟':'%AF%A9','祖':'%AF%AA','神':'%AF%AB','祝':'%AF%AC','祗':'%AF%AD','祚':'%AF%AE','秤':'%AF%AF','秣':'%AF%B0','秧':'%AF%B1','租':'%AF%B2','秦':'%AF%B3','秩':'%AF%B4','秘':'%AF%B5','窄':'%AF%B6','窈':'%AF%B7','站':'%AF%B8','笆':'%AF%B9','笑':'%AF%BA','粉':'%AF%BB','紡':'%AF%BC','紗':'%AF%BD','紋':'%AF%BE','紊':'%AF%BF','素':'%AF%C0','索':'%AF%C1','純':'%AF%C2','紐':'%AF%C3','紕':'%AF%C4','級':'%AF%C5','紜':'%AF%C6','納':'%AF%C7','紙':'%AF%C8','紛':'%AF%C9','缺':'%AF%CA','罟':'%AF%CB','羔':'%AF%CC','翅':'%AF%CD','翁':'%AF%CE','耆':'%AF%CF','耘':'%AF%D0','耕':'%AF%D1','耙':'%AF%D2','耗':'%AF%D3','耽':'%AF%D4','耿':'%AF%D5','胱':'%AF%D6','脂':'%AF%D7','胰':'%AF%D8','脅':'%AF%D9','胭':'%AF%DA','胴':'%AF%DB','脆':'%AF%DC','胸':'%AF%DD','胳':'%AF%DE','脈':'%AF%DF','能':'%AF%E0','脊':'%AF%E1','胼':'%AF%E2','胯':'%AF%E3','臭':'%AF%E4','臬':'%AF%E5','舀':'%AF%E6','舐':'%AF%E7','航':'%AF%E8','舫':'%AF%E9','舨':'%AF%EA','般':'%AF%EB','芻':'%AF%EC','茫':'%AF%ED','荒':'%AF%EE','荔':'%AF%EF','荊':'%AF%F0','茸':'%AF%F1','荐':'%AF%F2','草':'%AF%F3','茵':'%AF%F4','茴':'%AF%F5','荏':'%AF%F6','茲':'%AF%F7','茹':'%AF%F8','茶':'%AF%F9','茗':'%AF%FA','荀':'%AF%FB','茱':'%AF%FC','茨':'%AF%FD','荃':'%AF%FE','虔':'%B0%40','蚊':'%B0%41','蚪':'%B0%42','蚓':'%B0%43','蚤':'%B0%44','蚩':'%B0%45','蚌':'%B0%46','蚣':'%B0%47','蚜':'%B0%48','衰':'%B0%49','衷':'%B0%4A','袁':'%B0%4B','袂':'%B0%4C','衽':'%B0%4D','衹':'%B0%4E','記':'%B0%4F','訐':'%B0%50','討':'%B0%51','訌':'%B0%52','訕':'%B0%53','訊':'%B0%54','託':'%B0%55','訓':'%B0%56','訖':'%B0%57','訏':'%B0%58','訑':'%B0%59','豈':'%B0%5A','豺':'%B0%5B','豹':'%B0%5C','財':'%B0%5D','貢':'%B0%5E','起':'%B0%5F','躬':'%B0%60','軒':'%B0%61','軔':'%B0%62','軏':'%B0%63','辱':'%B0%64','送':'%B0%65','逆':'%B0%66','迷':'%B0%67','退':'%B0%68','迺':'%B0%69','迴':'%B0%6A','逃':'%B0%6B','追':'%B0%6C','逅':'%B0%6D','迸':'%B0%6E','邕':'%B0%6F','郡':'%B0%70','郝':'%B0%71','郢':'%B0%72','酒':'%B0%73','配':'%B0%74','酌':'%B0%75','釘':'%B0%76','針':'%B0%77','釗':'%B0%78','釜':'%B0%79','釙':'%B0%7A','閃':'%B0%7B','院':'%B0%7C','陣':'%B0%7D','陡':'%B0%7E','陛':'%B0%A1','陝':'%B0%A2','除':'%B0%A3','陘':'%B0%A4','陞':'%B0%A5','隻':'%B0%A6','飢':'%B0%A7','馬':'%B0%A8','骨':'%B0%A9','高':'%B0%AA','鬥':'%B0%AB','鬲':'%B0%AC','鬼':'%B0%AD','乾':'%B0%AE','偺':'%B0%AF','偽':'%B0%B0','停':'%B0%B1','假':'%B0%B2','偃':'%B0%B3','偌':'%B0%B4','做':'%B0%B5','偉':'%B0%B6','健':'%B0%B7','偶':'%B0%B8','偎':'%B0%B9','偕':'%B0%BA','偵':'%B0%BB','側':'%B0%BC','偷':'%B0%BD','偏':'%B0%BE','倏':'%B0%BF','偯':'%B0%C0','偭':'%B0%C1','兜':'%B0%C2','冕':'%B0%C3','凰':'%B0%C4','剪':'%B0%C5','副':'%B0%C6','勒':'%B0%C7','務':'%B0%C8','勘':'%B0%C9','動':'%B0%CA','匐':'%B0%CB','匏':'%B0%CC','匙':'%B0%CD','匿':'%B0%CE','區':'%B0%CF','匾':'%B0%D0','參':'%B0%D1','曼':'%B0%D2','商':'%B0%D3','啪':'%B0%D4','啦':'%B0%D5','啄':'%B0%D6','啞':'%B0%D7','啡':'%B0%D8','啃':'%B0%D9','啊':'%B0%DA','唱':'%B0%DB','啖':'%B0%DC','問':'%B0%DD','啕':'%B0%DE','唯':'%B0%DF','啤':'%B0%E0','唸':'%B0%E1','售':'%B0%E2','啜':'%B0%E3','唬':'%B0%E4','啣':'%B0%E5','唳':'%B0%E6','啁':'%B0%E7','啗':'%B0%E8','圈':'%B0%E9','國':'%B0%EA','圉':'%B0%EB','域':'%B0%EC','堅':'%B0%ED','堊':'%B0%EE','堆':'%B0%EF','埠':'%B0%F0','埤':'%B0%F1','基':'%B0%F2','堂':'%B0%F3','堵':'%B0%F4','執':'%B0%F5','培':'%B0%F6','夠':'%B0%F7','奢':'%B0%F8','娶':'%B0%F9','婁':'%B0%FA','婉':'%B0%FB','婦':'%B0%FC','婪':'%B0%FD','婀':'%B0%FE','娼':'%B1%40','婢':'%B1%41','婚':'%B1%42','婆':'%B1%43','婊':'%B1%44','孰':'%B1%45','寇':'%B1%46','寅':'%B1%47','寄':'%B1%48','寂':'%B1%49','宿':'%B1%4A','密':'%B1%4B','尉':'%B1%4C','專':'%B1%4D','將':'%B1%4E','屠':'%B1%4F','屜':'%B1%50','屝':'%B1%51','崇':'%B1%52','崆':'%B1%53','崎':'%B1%54','崛':'%B1%55','崖':'%B1%56','崢':'%B1%57','崑':'%B1%58','崩':'%B1%59','崔':'%B1%5A','崙':'%B1%5B','崤':'%B1%5C','崧':'%B1%5D','崗':'%B1%5E','巢':'%B1%5F','常':'%B1%60','帶':'%B1%61','帳':'%B1%62','帷':'%B1%63','康':'%B1%64','庸':'%B1%65','庶':'%B1%66','庵':'%B1%67','庾':'%B1%68','張':'%B1%69','強':'%B1%6A','彗':'%B1%6B','彬':'%B1%6C','彩':'%B1%6D','彫':'%B1%6E','得':'%B1%6F','徙':'%B1%70','從':'%B1%71','徘':'%B1%72','御':'%B1%73','徠':'%B1%74','徜':'%B1%75','恿':'%B1%76','患':'%B1%77','悉':'%B1%78','悠':'%B1%79','您':'%B1%7A','惋':'%B1%7B','悴':'%B1%7C','惦':'%B1%7D','悽':'%B1%7E','情':'%B1%A1','悻':'%B1%A2','悵':'%B1%A3','惜':'%B1%A4','悼':'%B1%A5','惘':'%B1%A6','惕':'%B1%A7','惆':'%B1%A8','惟':'%B1%A9','悸':'%B1%AA','惚':'%B1%AB','惇':'%B1%AC','戚':'%B1%AD','戛':'%B1%AE','扈':'%B1%AF','掠':'%B1%B0','控':'%B1%B1','捲':'%B1%B2','掖':'%B1%B3','探':'%B1%B4','接':'%B1%B5','捷':'%B1%B6','捧':'%B1%B7','掘':'%B1%B8','措':'%B1%B9','捱':'%B1%BA','掩':'%B1%BB','掉':'%B1%BC','掃':'%B1%BD','掛':'%B1%BE','捫':'%B1%BF','推':'%B1%C0','掄':'%B1%C1','授':'%B1%C2','掙':'%B1%C3','採':'%B1%C4','掬':'%B1%C5','排':'%B1%C6','掏':'%B1%C7','掀':'%B1%C8','捻':'%B1%C9','捩':'%B1%CA','捨':'%B1%CB','捺':'%B1%CC','敝':'%B1%CD','敖':'%B1%CE','救':'%B1%CF','教':'%B1%D0','敗':'%B1%D1','啟':'%B1%D2','敏':'%B1%D3','敘':'%B1%D4','敕':'%B1%D5','敔':'%B1%D6','斜':'%B1%D7','斛':'%B1%D8','斬':'%B1%D9','族':'%B1%DA','旋':'%B1%DB','旌':'%B1%DC','旎':'%B1%DD','晝':'%B1%DE','晚':'%B1%DF','晤':'%B1%E0','晨':'%B1%E1','晦':'%B1%E2','晞':'%B1%E3','曹':'%B1%E4','勗':'%B1%E5','望':'%B1%E6','梁':'%B1%E7','梯':'%B1%E8','梢':'%B1%E9','梓':'%B1%EA','梵':'%B1%EB','桿':'%B1%EC','桶':'%B1%ED','梱':'%B1%EE','梧':'%B1%EF','梗':'%B1%F0','械':'%B1%F1','梃':'%B1%F2','棄':'%B1%F3','梭':'%B1%F4','梆':'%B1%F5','梅':'%B1%F6','梔':'%B1%F7','條':'%B1%F8','梨':'%B1%F9','梟':'%B1%FA','梡':'%B1%FB','梂':'%B1%FC','欲':'%B1%FD','殺':'%B1%FE','毫':'%B2%40','毬':'%B2%41','氫':'%B2%42','涎':'%B2%43','涼':'%B2%44','淳':'%B2%45','淙':'%B2%46','液':'%B2%47','淡':'%B2%48','淌':'%B2%49','淤':'%B2%4A','添':'%B2%4B','淺':'%B2%4C','清':'%B2%4D','淇':'%B2%4E','淋':'%B2%4F','涯':'%B2%50','淑':'%B2%51','涮':'%B2%52','淞':'%B2%53','淹':'%B2%54','涸':'%B2%55','混':'%B2%56','淵':'%B2%57','淅':'%B2%58','淒':'%B2%59','渚':'%B2%5A','涵':'%B2%5B','淚':'%B2%5C','淫':'%B2%5D','淘':'%B2%5E','淪':'%B2%5F','深':'%B2%60','淮':'%B2%61','淨':'%B2%62','淆':'%B2%63','淄':'%B2%64','涪':'%B2%65','淬':'%B2%66','涿':'%B2%67','淦':'%B2%68','烹':'%B2%69','焉':'%B2%6A','焊':'%B2%6B','烽':'%B2%6C','烯':'%B2%6D','爽':'%B2%6E','牽':'%B2%6F','犁':'%B2%70','猜':'%B2%71','猛':'%B2%72','猖':'%B2%73','猓':'%B2%74','猙':'%B2%75','率':'%B2%76','琅':'%B2%77','琊':'%B2%78','球':'%B2%79','理':'%B2%7A','現':'%B2%7B','琍':'%B2%7C','瓠':'%B2%7D','瓶':'%B2%7E','瓷':'%B2%A1','甜':'%B2%A2','產':'%B2%A3','略':'%B2%A4','畦':'%B2%A5','畢':'%B2%A6','異':'%B2%A7','疏':'%B2%A8','痔':'%B2%A9','痕':'%B2%AA','疵':'%B2%AB','痊':'%B2%AC','痍':'%B2%AD','皎':'%B2%AE','盔':'%B2%AF','盒':'%B2%B0','盛':'%B2%B1','眷':'%B2%B2','眾':'%B2%B3','眼':'%B2%B4','眶':'%B2%B5','眸':'%B2%B6','眺':'%B2%B7','硫':'%B2%B8','硃':'%B2%B9','硎':'%B2%BA','祥':'%B2%BB','票':'%B2%BC','祭':'%B2%BD','移':'%B2%BE','窒':'%B2%BF','窕':'%B2%C0','笠':'%B2%C1','笨':'%B2%C2','笛':'%B2%C3','第':'%B2%C4','符':'%B2%C5','笙':'%B2%C6','笞':'%B2%C7','笮':'%B2%C8','粒':'%B2%C9','粗':'%B2%CA','粕':'%B2%CB','絆':'%B2%CC','絃':'%B2%CD','統':'%B2%CE','紮':'%B2%CF','紹':'%B2%D0','紼':'%B2%D1','絀':'%B2%D2','細':'%B2%D3','紳':'%B2%D4','組':'%B2%D5','累':'%B2%D6','終':'%B2%D7','紲':'%B2%D8','紱':'%B2%D9','缽':'%B2%DA','羞':'%B2%DB','羚':'%B2%DC','翌':'%B2%DD','翎':'%B2%DE','習':'%B2%DF','耜':'%B2%E0','聊':'%B2%E1','聆':'%B2%E2','脯':'%B2%E3','脖':'%B2%E4','脣':'%B2%E5','脫':'%B2%E6','脩':'%B2%E7','脰':'%B2%E8','脤':'%B2%E9','舂':'%B2%EA','舵':'%B2%EB','舷':'%B2%EC','舶':'%B2%ED','船':'%B2%EE','莎':'%B2%EF','莞':'%B2%F0','莘':'%B2%F1','荸':'%B2%F2','莢':'%B2%F3','莖':'%B2%F4','莽':'%B2%F5','莫':'%B2%F6','莒':'%B2%F7','莊':'%B2%F8','莓':'%B2%F9','莉':'%B2%FA','莠':'%B2%FB','荷':'%B2%FC','荻':'%B2%FD','荼':'%B2%FE','莆':'%B3%40','莧':'%B3%41','處':'%B3%42','彪':'%B3%43','蛇':'%B3%44','蛀':'%B3%45','蚶':'%B3%46','蛄':'%B3%47','蚵':'%B3%48','蛆':'%B3%49','蛋':'%B3%4A','蚱':'%B3%4B','蚯':'%B3%4C','蛉':'%B3%4D','術':'%B3%4E','袞':'%B3%4F','袈':'%B3%50','被':'%B3%51','袒':'%B3%52','袖':'%B3%53','袍':'%B3%54','袋':'%B3%55','覓':'%B3%56','規':'%B3%57','訪':'%B3%58','訝':'%B3%59','訣':'%B3%5A','訥':'%B3%5B','許':'%B3%5C','設':'%B3%5D','訟':'%B3%5E','訛':'%B3%5F','訢':'%B3%60','豉':'%B3%61','豚':'%B3%62','販':'%B3%63','責':'%B3%64','貫':'%B3%65','貨':'%B3%66','貪':'%B3%67','貧':'%B3%68','赧':'%B3%69','赦':'%B3%6A','趾':'%B3%6B','趺':'%B3%6C','軛':'%B3%6D','軟':'%B3%6E','這':'%B3%6F','逍':'%B3%70','通':'%B3%71','逗':'%B3%72','連':'%B3%73','速':'%B3%74','逝':'%B3%75','逐':'%B3%76','逕':'%B3%77','逞':'%B3%78','造':'%B3%79','透':'%B3%7A','逢':'%B3%7B','逖':'%B3%7C','逛':'%B3%7D','途':'%B3%7E','部':'%B3%A1','郭':'%B3%A2','都':'%B3%A3','酗':'%B3%A4','野':'%B3%A5','釵':'%B3%A6','釦':'%B3%A7','釣':'%B3%A8','釧':'%B3%A9','釭':'%B3%AA','釩':'%B3%AB','閉':'%B3%AC','陪':'%B3%AD','陵':'%B3%AE','陳':'%B3%AF','陸':'%B3%B0','陰':'%B3%B1','陴':'%B3%B2','陶':'%B3%B3','陷':'%B3%B4','陬':'%B3%B5','雀':'%B3%B6','雪':'%B3%B7','雩':'%B3%B8','章':'%B3%B9','竟':'%B3%BA','頂':'%B3%BB','頃':'%B3%BC','魚':'%B3%BD','鳥':'%B3%BE','鹵':'%B3%BF','鹿':'%B3%C0','麥':'%B3%C1','麻':'%B3%C2','傢':'%B3%C3','傍':'%B3%C4','傅':'%B3%C5','備':'%B3%C6','傑':'%B3%C7','傀':'%B3%C8','傖':'%B3%C9','傘':'%B3%CA','傚':'%B3%CB','最':'%B3%CC','凱':'%B3%CD','割':'%B3%CE','剴':'%B3%CF','創':'%B3%D0','剩':'%B3%D1','勞':'%B3%D2','勝':'%B3%D3','勛':'%B3%D4','博':'%B3%D5','厥':'%B3%D6','啻':'%B3%D7','喀':'%B3%D8','喧':'%B3%D9','啼':'%B3%DA','喊':'%B3%DB','喝':'%B3%DC','喘':'%B3%DD','喂':'%B3%DE','喜':'%B3%DF','喪':'%B3%E0','喔':'%B3%E1','喇':'%B3%E2','喋':'%B3%E3','喃':'%B3%E4','喳':'%B3%E5','單':'%B3%E6','喟':'%B3%E7','唾':'%B3%E8','喲':'%B3%E9','喚':'%B3%EA','喻':'%B3%EB','喬':'%B3%EC','喱':'%B3%ED','啾':'%B3%EE','喉':'%B3%EF','喫':'%B3%F0','喙':'%B3%F1','圍':'%B3%F2','堯':'%B3%F3','堪':'%B3%F4','場':'%B3%F5','堤':'%B3%F6','堰':'%B3%F7','報':'%B3%F8','堡':'%B3%F9','堝':'%B3%FA','堠':'%B3%FB','壹':'%B3%FC','壺':'%B3%FD','奠':'%B3%FE','婷':'%B4%40','媚':'%B4%41','婿':'%B4%42','媒':'%B4%43','媛':'%B4%44','媧':'%B4%45','孳':'%B4%46','孱':'%B4%47','寒':'%B4%48','富':'%B4%49','寓':'%B4%4A','寐':'%B4%4B','尊':'%B4%4C','尋':'%B4%4D','就':'%B4%4E','嵌':'%B4%4F','嵐':'%B4%50','崴':'%B4%51','嵇':'%B4%52','巽':'%B4%53','幅':'%B4%54','帽':'%B4%55','幀':'%B4%56','幃':'%B4%57','幾':'%B4%58','廊':'%B4%59','廁':'%B4%5A','廂':'%B4%5B','廄':'%B4%5C','弼':'%B4%5D','彭':'%B4%5E','復':'%B4%5F','循':'%B4%60','徨':'%B4%61','惑':'%B4%62','惡':'%B4%63','悲':'%B4%64','悶':'%B4%65','惠':'%B4%66','愜':'%B4%67','愣':'%B4%68','惺':'%B4%69','愕':'%B4%6A','惰':'%B4%6B','惻':'%B4%6C','惴':'%B4%6D','慨':'%B4%6E','惱':'%B4%6F','愎':'%B4%70','惶':'%B4%71','愉':'%B4%72','愀':'%B4%73','愒':'%B4%74','戟':'%B4%75','扉':'%B4%76','掣':'%B4%77','掌':'%B4%78','描':'%B4%79','揀':'%B4%7A','揩':'%B4%7B','揉':'%B4%7C','揆':'%B4%7D','揍':'%B4%7E','插':'%B4%A1','揣':'%B4%A2','提':'%B4%A3','握':'%B4%A4','揖':'%B4%A5','揭':'%B4%A6','揮':'%B4%A7','捶':'%B4%A8','援':'%B4%A9','揪':'%B4%AA','換':'%B4%AB','摒':'%B4%AC','揚':'%B4%AD','揹':'%B4%AE','敞':'%B4%AF','敦':'%B4%B0','敢':'%B4%B1','散':'%B4%B2','斑':'%B4%B3','斐':'%B4%B4','斯':'%B4%B5','普':'%B4%B6','晰':'%B4%B7','晴':'%B4%B8','晶':'%B4%B9','景':'%B4%BA','暑':'%B4%BB','智':'%B4%BC','晾':'%B4%BD','晷':'%B4%BE','曾':'%B4%BF','替':'%B4%C0','期':'%B4%C1','朝':'%B4%C2','棺':'%B4%C3','棕':'%B4%C4','棠':'%B4%C5','棘':'%B4%C6','棗':'%B4%C7','椅':'%B4%C8','棟':'%B4%C9','棵':'%B4%CA','森':'%B4%CB','棧':'%B4%CC','棹':'%B4%CD','棒':'%B4%CE','棲':'%B4%CF','棣':'%B4%D0','棋':'%B4%D1','棍':'%B4%D2','植':'%B4%D3','椒':'%B4%D4','椎':'%B4%D5','棉':'%B4%D6','棚':'%B4%D7','楮':'%B4%D8','棻':'%B4%D9','款':'%B4%DA','欺':'%B4%DB','欽':'%B4%DC','殘':'%B4%DD','殖':'%B4%DE','殼':'%B4%DF','毯':'%B4%E0','氮':'%B4%E1','氯':'%B4%E2','氬':'%B4%E3','港':'%B4%E4','游':'%B4%E5','湔':'%B4%E6','渡':'%B4%E7','渲':'%B4%E8','湧':'%B4%E9','湊':'%B4%EA','渠':'%B4%EB','渥':'%B4%EC','渣':'%B4%ED','減':'%B4%EE','湛':'%B4%EF','湘':'%B4%F0','渤':'%B4%F1','湖':'%B4%F2','湮':'%B4%F3','渭':'%B4%F4','渦':'%B4%F5','湯':'%B4%F6','渴':'%B4%F7','湍':'%B4%F8','渺':'%B4%F9','測':'%B4%FA','湃':'%B4%FB','渝':'%B4%FC','渾':'%B4%FD','滋':'%B4%FE','溉':'%B5%40','渙':'%B5%41','湎':'%B5%42','湣':'%B5%43','湄':'%B5%44','湲':'%B5%45','湩':'%B5%46','湟':'%B5%47','焙':'%B5%48','焚':'%B5%49','焦':'%B5%4A','焰':'%B5%4B','無':'%B5%4C','然':'%B5%4D','煮':'%B5%4E','焜':'%B5%4F','牌':'%B5%50','犄':'%B5%51','犀':'%B5%52','猶':'%B5%53','猥':'%B5%54','猴':'%B5%55','猩':'%B5%56','琺':'%B5%57','琪':'%B5%58','琳':'%B5%59','琢':'%B5%5A','琥':'%B5%5B','琵':'%B5%5C','琶':'%B5%5D','琴':'%B5%5E','琯':'%B5%5F','琛':'%B5%60','琦':'%B5%61','琨':'%B5%62','甥':'%B5%63','甦':'%B5%64','畫':'%B5%65','番':'%B5%66','痢':'%B5%67','痛':'%B5%68','痣':'%B5%69','痙':'%B5%6A','痘':'%B5%6B','痞':'%B5%6C','痠':'%B5%6D','登':'%B5%6E','發':'%B5%6F','皖':'%B5%70','皓':'%B5%71','皴':'%B5%72','盜':'%B5%73','睏':'%B5%74','短':'%B5%75','硝':'%B5%76','硬':'%B5%77','硯':'%B5%78','稍':'%B5%79','稈':'%B5%7A','程':'%B5%7B','稅':'%B5%7C','稀':'%B5%7D','窘':'%B5%7E','窗':'%B5%A1','窖':'%B5%A2','童':'%B5%A3','竣':'%B5%A4','等':'%B5%A5','策':'%B5%A6','筆':'%B5%A7','筐':'%B5%A8','筒':'%B5%A9','答':'%B5%AA','筍':'%B5%AB','筋':'%B5%AC','筏':'%B5%AD','筑':'%B5%AE','粟':'%B5%AF','粥':'%B5%B0','絞':'%B5%B1','結':'%B5%B2','絨':'%B5%B3','絕':'%B5%B4','紫':'%B5%B5','絮':'%B5%B6','絲':'%B5%B7','絡':'%B5%B8','給':'%B5%B9','絢':'%B5%BA','絰':'%B5%BB','絳':'%B5%BC','善':'%B5%BD','翔':'%B5%BE','翕':'%B5%BF','耋':'%B5%C0','聒':'%B5%C1','肅':'%B5%C2','腕':'%B5%C3','腔':'%B5%C4','腋':'%B5%C5','腑':'%B5%C6','腎':'%B5%C7','脹':'%B5%C8','腆':'%B5%C9','脾':'%B5%CA','腌':'%B5%CB','腓':'%B5%CC','腴':'%B5%CD','舒':'%B5%CE','舜':'%B5%CF','菩':'%B5%D0','萃':'%B5%D1','菸':'%B5%D2','萍':'%B5%D3','菠':'%B5%D4','菅':'%B5%D5','萋':'%B5%D6','菁':'%B5%D7','華':'%B5%D8','菱':'%B5%D9','菴':'%B5%DA','著':'%B5%DB','萊':'%B5%DC','菰':'%B5%DD','萌':'%B5%DE','菌':'%B5%DF','菽':'%B5%E0','菲':'%B5%E1','菊':'%B5%E2','萸':'%B5%E3','萎':'%B5%E4','萄':'%B5%E5','菜':'%B5%E6','萇':'%B5%E7','菔':'%B5%E8','菟':'%B5%E9','虛':'%B5%EA','蛟':'%B5%EB','蛙':'%B5%EC','蛭':'%B5%ED','蛔':'%B5%EE','蛛':'%B5%EF','蛤':'%B5%F0','蛐':'%B5%F1','蛞':'%B5%F2','街':'%B5%F3','裁':'%B5%F4','裂':'%B5%F5','袱':'%B5%F6','覃':'%B5%F7','視':'%B5%F8','註':'%B5%F9','詠':'%B5%FA','評':'%B5%FB','詞':'%B5%FC','証':'%B5%FD','詁':'%B5%FE','詔':'%B6%40','詛':'%B6%41','詐':'%B6%42','詆':'%B6%43','訴':'%B6%44','診':'%B6%45','訶':'%B6%46','詖':'%B6%47','象':'%B6%48','貂':'%B6%49','貯':'%B6%4A','貼':'%B6%4B','貳':'%B6%4C','貽':'%B6%4D','賁':'%B6%4E','費':'%B6%4F','賀':'%B6%50','貴':'%B6%51','買':'%B6%52','貶':'%B6%53','貿':'%B6%54','貸':'%B6%55','越':'%B6%56','超':'%B6%57','趁':'%B6%58','跎':'%B6%59','距':'%B6%5A','跋':'%B6%5B','跚':'%B6%5C','跑':'%B6%5D','跌':'%B6%5E','跛':'%B6%5F','跆':'%B6%60','軻':'%B6%61','軸':'%B6%62','軼':'%B6%63','辜':'%B6%64','逮':'%B6%65','逵':'%B6%66','週':'%B6%67','逸':'%B6%68','進':'%B6%69','逶':'%B6%6A','鄂':'%B6%6B','郵':'%B6%6C','鄉':'%B6%6D','郾':'%B6%6E','酣':'%B6%6F','酥':'%B6%70','量':'%B6%71','鈔':'%B6%72','鈕':'%B6%73','鈣':'%B6%74','鈉':'%B6%75','鈞':'%B6%76','鈍':'%B6%77','鈐':'%B6%78','鈇':'%B6%79','鈑':'%B6%7A','閔':'%B6%7B','閏':'%B6%7C','開':'%B6%7D','閑':'%B6%7E','間':'%B6%A1','閒':'%B6%A2','閎':'%B6%A3','隊':'%B6%A4','階':'%B6%A5','隋':'%B6%A6','陽':'%B6%A7','隅':'%B6%A8','隆':'%B6%A9','隍':'%B6%AA','陲':'%B6%AB','隄':'%B6%AC','雁':'%B6%AD','雅':'%B6%AE','雄':'%B6%AF','集':'%B6%B0','雇':'%B6%B1','雯':'%B6%B2','雲':'%B6%B3','韌':'%B6%B4','項':'%B6%B5','順':'%B6%B6','須':'%B6%B7','飧':'%B6%B8','飪':'%B6%B9','飯':'%B6%BA','飩':'%B6%BB','飲':'%B6%BC','飭':'%B6%BD','馮':'%B6%BE','馭':'%B6%BF','黃':'%B6%C0','黍':'%B6%C1','黑':'%B6%C2','亂':'%B6%C3','傭':'%B6%C4','債':'%B6%C5','傲':'%B6%C6','傳':'%B6%C7','僅':'%B6%C8','傾':'%B6%C9','催':'%B6%CA','傷':'%B6%CB','傻':'%B6%CC','傯':'%B6%CD','僇':'%B6%CE','剿':'%B6%CF','剷':'%B6%D0','剽':'%B6%D1','募':'%B6%D2','勦':'%B6%D3','勤':'%B6%D4','勢':'%B6%D5','勣':'%B6%D6','匯':'%B6%D7','嗟':'%B6%D8','嗨':'%B6%D9','嗓':'%B6%DA','嗦':'%B6%DB','嗎':'%B6%DC','嗜':'%B6%DD','嗇':'%B6%DE','嗑':'%B6%DF','嗣':'%B6%E0','嗤':'%B6%E1','嗯':'%B6%E2','嗚':'%B6%E3','嗡':'%B6%E4','嗅':'%B6%E5','嗆':'%B6%E6','嗥':'%B6%E7','嗉':'%B6%E8','園':'%B6%E9','圓':'%B6%EA','塞':'%B6%EB','塑':'%B6%EC','塘':'%B6%ED','塗':'%B6%EE','塚':'%B6%EF','塔':'%B6%F0','填':'%B6%F1','塌':'%B6%F2','塭':'%B6%F3','塊':'%B6%F4','塢':'%B6%F5','塒':'%B6%F6','塋':'%B6%F7','奧':'%B6%F8','嫁':'%B6%F9','嫉':'%B6%FA','嫌':'%B6%FB','媾':'%B6%FC','媽':'%B6%FD','媼':'%B6%FE','媳':'%B7%40','嫂':'%B7%41','媲':'%B7%42','嵩':'%B7%43','嵯':'%B7%44','幌':'%B7%45','幹':'%B7%46','廉':'%B7%47','廈':'%B7%48','弒':'%B7%49','彙':'%B7%4A','徬':'%B7%4B','微':'%B7%4C','愚':'%B7%4D','意':'%B7%4E','慈':'%B7%4F','感':'%B7%50','想':'%B7%51','愛':'%B7%52','惹':'%B7%53','愁':'%B7%54','愈':'%B7%55','慎':'%B7%56','慌':'%B7%57','慄':'%B7%58','慍':'%B7%59','愾':'%B7%5A','愴':'%B7%5B','愧':'%B7%5C','愍':'%B7%5D','愆':'%B7%5E','愷':'%B7%5F','戡':'%B7%60','戢':'%B7%61','搓':'%B7%62','搾':'%B7%63','搞':'%B7%64','搪':'%B7%65','搭':'%B7%66','搽':'%B7%67','搬':'%B7%68','搏':'%B7%69','搜':'%B7%6A','搔':'%B7%6B','損':'%B7%6C','搶':'%B7%6D','搖':'%B7%6E','搗':'%B7%6F','搆':'%B7%70','敬':'%B7%71','斟':'%B7%72','新':'%B7%73','暗':'%B7%74','暉':'%B7%75','暇':'%B7%76','暈':'%B7%77','暖':'%B7%78','暄':'%B7%79','暘':'%B7%7A','暍':'%B7%7B','會':'%B7%7C','榔':'%B7%7D','業':'%B7%7E','楚':'%B7%A1','楷':'%B7%A2','楠':'%B7%A3','楔':'%B7%A4','極':'%B7%A5','椰':'%B7%A6','概':'%B7%A7','楊':'%B7%A8','楨':'%B7%A9','楫':'%B7%AA','楞':'%B7%AB','楓':'%B7%AC','楹':'%B7%AD','榆':'%B7%AE','楝':'%B7%AF','楣':'%B7%B0','楛':'%B7%B1','歇':'%B7%B2','歲':'%B7%B3','毀':'%B7%B4','殿':'%B7%B5','毓':'%B7%B6','毽':'%B7%B7','溢':'%B7%B8','溯':'%B7%B9','滓':'%B7%BA','溶':'%B7%BB','滂':'%B7%BC','源':'%B7%BD','溝':'%B7%BE','滇':'%B7%BF','滅':'%B7%C0','溥':'%B7%C1','溘':'%B7%C2','溼':'%B7%C3','溺':'%B7%C4','溫':'%B7%C5','滑':'%B7%C6','準':'%B7%C7','溜':'%B7%C8','滄':'%B7%C9','滔':'%B7%CA','溪':'%B7%CB','溧':'%B7%CC','溴':'%B7%CD','煎':'%B7%CE','煙':'%B7%CF','煩':'%B7%D0','煤':'%B7%D1','煉':'%B7%D2','照':'%B7%D3','煜':'%B7%D4','煬':'%B7%D5','煦':'%B7%D6','煌':'%B7%D7','煥':'%B7%D8','煞':'%B7%D9','煆':'%B7%DA','煨':'%B7%DB','煖':'%B7%DC','爺':'%B7%DD','牒':'%B7%DE','猷':'%B7%DF','獅':'%B7%E0','猿':'%B7%E1','猾':'%B7%E2','瑯':'%B7%E3','瑚':'%B7%E4','瑕':'%B7%E5','瑟':'%B7%E6','瑞':'%B7%E7','瑁':'%B7%E8','琿':'%B7%E9','瑙':'%B7%EA','瑛':'%B7%EB','瑜':'%B7%EC','當':'%B7%ED','畸':'%B7%EE','瘀':'%B7%EF','痰':'%B7%F0','瘁':'%B7%F1','痲':'%B7%F2','痱':'%B7%F3','痺':'%B7%F4','痿':'%B7%F5','痴':'%B7%F6','痳':'%B7%F7','盞':'%B7%F8','盟':'%B7%F9','睛':'%B7%FA','睫':'%B7%FB','睦':'%B7%FC','睞':'%B7%FD','督':'%B7%FE','睹':'%B8%40','睪':'%B8%41','睬':'%B8%42','睜':'%B8%43','睥':'%B8%44','睨':'%B8%45','睢':'%B8%46','矮':'%B8%47','碎':'%B8%48','碰':'%B8%49','碗':'%B8%4A','碘':'%B8%4B','碌':'%B8%4C','碉':'%B8%4D','硼':'%B8%4E','碑':'%B8%4F','碓':'%B8%50','硿':'%B8%51','祺':'%B8%52','祿':'%B8%53','禁':'%B8%54','萬':'%B8%55','禽':'%B8%56','稜':'%B8%57','稚':'%B8%58','稠':'%B8%59','稔':'%B8%5A','稟':'%B8%5B','稞':'%B8%5C','窟':'%B8%5D','窠':'%B8%5E','筷':'%B8%5F','節':'%B8%60','筠':'%B8%61','筮':'%B8%62','筧':'%B8%63','粱':'%B8%64','粳':'%B8%65','粵':'%B8%66','經':'%B8%67','絹':'%B8%68','綑':'%B8%69','綁':'%B8%6A','綏':'%B8%6B','絛':'%B8%6C','置':'%B8%6D','罩':'%B8%6E','罪':'%B8%6F','署':'%B8%70','義':'%B8%71','羨':'%B8%72','群':'%B8%73','聖':'%B8%74','聘':'%B8%75','肆':'%B8%76','肄':'%B8%77','腱':'%B8%78','腰':'%B8%79','腸':'%B8%7A','腥':'%B8%7B','腮':'%B8%7C','腳':'%B8%7D','腫':'%B8%7E','腹':'%B8%A1','腺':'%B8%A2','腦':'%B8%A3','舅':'%B8%A4','艇':'%B8%A5','蒂':'%B8%A6','葷':'%B8%A7','落':'%B8%A8','萱':'%B8%A9','葵':'%B8%AA','葦':'%B8%AB','葫':'%B8%AC','葉':'%B8%AD','葬':'%B8%AE','葛':'%B8%AF','萼':'%B8%B0','萵':'%B8%B1','葡':'%B8%B2','董':'%B8%B3','葩':'%B8%B4','葭':'%B8%B5','葆':'%B8%B6','虞':'%B8%B7','虜':'%B8%B8','號':'%B8%B9','蛹':'%B8%BA','蜓':'%B8%BB','蜈':'%B8%BC','蜇':'%B8%BD','蜀':'%B8%BE','蛾':'%B8%BF','蛻':'%B8%C0','蜂':'%B8%C1','蜃':'%B8%C2','蜆':'%B8%C3','蜊':'%B8%C4','衙':'%B8%C5','裟':'%B8%C6','裔':'%B8%C7','裙':'%B8%C8','補':'%B8%C9','裘':'%B8%CA','裝':'%B8%CB','裡':'%B8%CC','裊':'%B8%CD','裕':'%B8%CE','裒':'%B8%CF','覜':'%B8%D0','解':'%B8%D1','詫':'%B8%D2','該':'%B8%D3','詳':'%B8%D4','試':'%B8%D5','詩':'%B8%D6','詰':'%B8%D7','誇':'%B8%D8','詼':'%B8%D9','詣':'%B8%DA','誠':'%B8%DB','話':'%B8%DC','誅':'%B8%DD','詭':'%B8%DE','詢':'%B8%DF','詮':'%B8%E0','詬':'%B8%E1','詹':'%B8%E2','詻':'%B8%E3','訾':'%B8%E4','詨':'%B8%E5','豢':'%B8%E6','貊':'%B8%E7','貉':'%B8%E8','賊':'%B8%E9','資':'%B8%EA','賈':'%B8%EB','賄':'%B8%EC','貲':'%B8%ED','賃':'%B8%EE','賂':'%B8%EF','賅':'%B8%F0','跡':'%B8%F1','跟':'%B8%F2','跨':'%B8%F3','路':'%B8%F4','跳':'%B8%F5','跺':'%B8%F6','跪':'%B8%F7','跤':'%B8%F8','跦':'%B8%F9','躲':'%B8%FA','較':'%B8%FB','載':'%B8%FC','軾':'%B8%FD','輊':'%B8%FE','辟':'%B9%40','農':'%B9%41','運':'%B9%42','遊':'%B9%43','道':'%B9%44','遂':'%B9%45','達':'%B9%46','逼':'%B9%47','違':'%B9%48','遐':'%B9%49','遇':'%B9%4A','遏':'%B9%4B','過':'%B9%4C','遍':'%B9%4D','遑':'%B9%4E','逾':'%B9%4F','遁':'%B9%50','鄒':'%B9%51','鄗':'%B9%52','酬':'%B9%53','酪':'%B9%54','酩':'%B9%55','釉':'%B9%56','鈷':'%B9%57','鉗':'%B9%58','鈸':'%B9%59','鈽':'%B9%5A','鉀':'%B9%5B','鈾':'%B9%5C','鉛':'%B9%5D','鉋':'%B9%5E','鉤':'%B9%5F','鉑':'%B9%60','鈴':'%B9%61','鉉':'%B9%62','鉍':'%B9%63','鉅':'%B9%64','鈹':'%B9%65','鈿':'%B9%66','鉚':'%B9%67','閘':'%B9%68','隘':'%B9%69','隔':'%B9%6A','隕':'%B9%6B','雍':'%B9%6C','雋':'%B9%6D','雉':'%B9%6E','雊':'%B9%6F','雷':'%B9%70','電':'%B9%71','雹':'%B9%72','零':'%B9%73','靖':'%B9%74','靴':'%B9%75','靶':'%B9%76','預':'%B9%77','頑':'%B9%78','頓':'%B9%79','頊':'%B9%7A','頒':'%B9%7B','頌':'%B9%7C','飼':'%B9%7D','飴':'%B9%7E','飽':'%B9%A1','飾':'%B9%A2','馳':'%B9%A3','馱':'%B9%A4','馴':'%B9%A5','髡':'%B9%A6','鳩':'%B9%A7','麂':'%B9%A8','鼎':'%B9%A9','鼓':'%B9%AA','鼠':'%B9%AB','僧':'%B9%AC','僮':'%B9%AD','僥':'%B9%AE','僖':'%B9%AF','僭':'%B9%B0','僚':'%B9%B1','僕':'%B9%B2','像':'%B9%B3','僑':'%B9%B4','僱':'%B9%B5','僎':'%B9%B6','僩':'%B9%B7','兢':'%B9%B8','凳':'%B9%B9','劃':'%B9%BA','劂':'%B9%BB','匱':'%B9%BC','厭':'%B9%BD','嗾':'%B9%BE','嘀':'%B9%BF','嘛':'%B9%C0','嘗':'%B9%C1','嗽':'%B9%C2','嘔':'%B9%C3','嘆':'%B9%C4','嘉':'%B9%C5','嘍':'%B9%C6','嘎':'%B9%C7','嗷':'%B9%C8','嘖':'%B9%C9','嘟':'%B9%CA','嘈':'%B9%CB','嘐':'%B9%CC','嗶':'%B9%CD','團':'%B9%CE','圖':'%B9%CF','塵':'%B9%D0','塾':'%B9%D1','境':'%B9%D2','墓':'%B9%D3','墊':'%B9%D4','塹':'%B9%D5','墅':'%B9%D6','塽':'%B9%D7','壽':'%B9%D8','夥':'%B9%D9','夢':'%B9%DA','夤':'%B9%DB','奪':'%B9%DC','奩':'%B9%DD','嫡':'%B9%DE','嫦':'%B9%DF','嫩':'%B9%E0','嫗':'%B9%E1','嫖':'%B9%E2','嫘':'%B9%E3','嫣':'%B9%E4','孵':'%B9%E5','寞':'%B9%E6','寧':'%B9%E7','寡':'%B9%E8','寥':'%B9%E9','實':'%B9%EA','寨':'%B9%EB','寢':'%B9%EC','寤':'%B9%ED','察':'%B9%EE','對':'%B9%EF','屢':'%B9%F0','嶄':'%B9%F1','嶇':'%B9%F2','幛':'%B9%F3','幣':'%B9%F4','幕':'%B9%F5','幗':'%B9%F6','幔':'%B9%F7','廓':'%B9%F8','廖':'%B9%F9','弊':'%B9%FA','彆':'%B9%FB','彰':'%B9%FC','徹':'%B9%FD','慇':'%B9%FE','愿':'%BA%40','態':'%BA%41','慷':'%BA%42','慢':'%BA%43','慣':'%BA%44','慟':'%BA%45','慚':'%BA%46','慘':'%BA%47','慵':'%BA%48','截':'%BA%49','撇':'%BA%4A','摘':'%BA%4B','摔':'%BA%4C','撤':'%BA%4D','摸':'%BA%4E','摟':'%BA%4F','摺':'%BA%50','摑':'%BA%51','摧':'%BA%52','搴':'%BA%53','摭':'%BA%54','摻':'%BA%55','敲':'%BA%56','斡':'%BA%57','旗':'%BA%58','旖':'%BA%59','暢':'%BA%5A','暨':'%BA%5B','暝':'%BA%5C','榜':'%BA%5D','榨':'%BA%5E','榕':'%BA%5F','槁':'%BA%60','榮':'%BA%61','槓':'%BA%62','構':'%BA%63','榛':'%BA%64','榷':'%BA%65','榻':'%BA%66','榫':'%BA%67','榴':'%BA%68','槐':'%BA%69','槍':'%BA%6A','榭':'%BA%6B','槌':'%BA%6C','榦':'%BA%6D','槃':'%BA%6E','榣':'%BA%6F','歉':'%BA%70','歌':'%BA%71','氳':'%BA%72','漳':'%BA%73','演':'%BA%74','滾':'%BA%75','漓':'%BA%76','滴':'%BA%77','漩':'%BA%78','漾':'%BA%79','漠':'%BA%7A','漬':'%BA%7B','漏':'%BA%7C','漂':'%BA%7D','漢':'%BA%7E','滿':'%BA%A1','滯':'%BA%A2','漆':'%BA%A3','漱':'%BA%A4','漸':'%BA%A5','漲':'%BA%A6','漣':'%BA%A7','漕':'%BA%A8','漫':'%BA%A9','漯':'%BA%AA','澈':'%BA%AB','漪':'%BA%AC','滬':'%BA%AD','漁':'%BA%AE','滲':'%BA%AF','滌':'%BA%B0','滷':'%BA%B1','熔':'%BA%B2','熙':'%BA%B3','煽':'%BA%B4','熊':'%BA%B5','熄':'%BA%B6','熒':'%BA%B7','爾':'%BA%B8','犒':'%BA%B9','犖':'%BA%BA','獄':'%BA%BB','獐':'%BA%BC','瑤':'%BA%BD','瑣':'%BA%BE','瑪':'%BA%BF','瑰':'%BA%C0','瑭':'%BA%C1','甄':'%BA%C2','疑':'%BA%C3','瘧':'%BA%C4','瘍':'%BA%C5','瘋':'%BA%C6','瘉':'%BA%C7','瘓':'%BA%C8','盡':'%BA%C9','監':'%BA%CA','瞄':'%BA%CB','睽':'%BA%CC','睿':'%BA%CD','睡':'%BA%CE','磁':'%BA%CF','碟':'%BA%D0','碧':'%BA%D1','碳':'%BA%D2','碩':'%BA%D3','碣':'%BA%D4','禎':'%BA%D5','福':'%BA%D6','禍':'%BA%D7','種':'%BA%D8','稱':'%BA%D9','窪':'%BA%DA','窩':'%BA%DB','竭':'%BA%DC','端':'%BA%DD','管':'%BA%DE','箕':'%BA%DF','箋':'%BA%E0','筵':'%BA%E1','算':'%BA%E2','箝':'%BA%E3','箔':'%BA%E4','箏':'%BA%E5','箸':'%BA%E6','箇':'%BA%E7','箄':'%BA%E8','粹':'%BA%E9','粽':'%BA%EA','精':'%BA%EB','綻':'%BA%EC','綰':'%BA%ED','綜':'%BA%EE','綽':'%BA%EF','綾':'%BA%F0','綠':'%BA%F1','緊':'%BA%F2','綴':'%BA%F3','網':'%BA%F4','綱':'%BA%F5','綺':'%BA%F6','綢':'%BA%F7','綿':'%BA%F8','綵':'%BA%F9','綸':'%BA%FA','維':'%BA%FB','緒':'%BA%FC','緇':'%BA%FD','綬':'%BA%FE','罰':'%BB%40','翠':'%BB%41','翡':'%BB%42','翟':'%BB%43','聞':'%BB%44','聚':'%BB%45','肇':'%BB%46','腐':'%BB%47','膀':'%BB%48','膏':'%BB%49','膈':'%BB%4A','膊':'%BB%4B','腿':'%BB%4C','膂':'%BB%4D','臧':'%BB%4E','臺':'%BB%4F','與':'%BB%50','舔':'%BB%51','舞':'%BB%52','艋':'%BB%53','蓉':'%BB%54','蒿':'%BB%55','蓆':'%BB%56','蓄':'%BB%57','蒙':'%BB%58','蒞':'%BB%59','蒲':'%BB%5A','蒜':'%BB%5B','蓋':'%BB%5C','蒸':'%BB%5D','蓀':'%BB%5E','蓓':'%BB%5F','蒐':'%BB%60','蒼':'%BB%61','蓑':'%BB%62','蓊':'%BB%63','蜿':'%BB%64','蜜':'%BB%65','蜻':'%BB%66','蜢':'%BB%67','蜥':'%BB%68','蜴':'%BB%69','蜘':'%BB%6A','蝕':'%BB%6B','蜷':'%BB%6C','蜩':'%BB%6D','裳':'%BB%6E','褂':'%BB%6F','裴':'%BB%70','裹':'%BB%71','裸':'%BB%72','製':'%BB%73','裨':'%BB%74','褚':'%BB%75','裯':'%BB%76','誦':'%BB%77','誌':'%BB%78','語':'%BB%79','誣':'%BB%7A','認':'%BB%7B','誡':'%BB%7C','誓':'%BB%7D','誤':'%BB%7E','說':'%BB%A1','誥':'%BB%A2','誨':'%BB%A3','誘':'%BB%A4','誑':'%BB%A5','誚':'%BB%A6','誧':'%BB%A7','豪':'%BB%A8','貍':'%BB%A9','貌':'%BB%AA','賓':'%BB%AB','賑':'%BB%AC','賒':'%BB%AD','赫':'%BB%AE','趙':'%BB%AF','趕':'%BB%B0','跼':'%BB%B1','輔':'%BB%B2','輒':'%BB%B3','輕':'%BB%B4','輓':'%BB%B5','辣':'%BB%B6','遠':'%BB%B7','遘':'%BB%B8','遜':'%BB%B9','遣':'%BB%BA','遙':'%BB%BB','遞':'%BB%BC','遢':'%BB%BD','遝':'%BB%BE','遛':'%BB%BF','鄙':'%BB%C0','鄘':'%BB%C1','鄞':'%BB%C2','酵':'%BB%C3','酸':'%BB%C4','酷':'%BB%C5','酴':'%BB%C6','鉸':'%BB%C7','銀':'%BB%C8','銅':'%BB%C9','銘':'%BB%CA','銖':'%BB%CB','鉻':'%BB%CC','銓':'%BB%CD','銜':'%BB%CE','銨':'%BB%CF','鉼':'%BB%D0','銑':'%BB%D1','閡':'%BB%D2','閨':'%BB%D3','閩':'%BB%D4','閣':'%BB%D5','閥':'%BB%D6','閤':'%BB%D7','隙':'%BB%D8','障':'%BB%D9','際':'%BB%DA','雌':'%BB%DB','雒':'%BB%DC','需':'%BB%DD','靼':'%BB%DE','鞅':'%BB%DF','韶':'%BB%E0','頗':'%BB%E1','領':'%BB%E2','颯':'%BB%E3','颱':'%BB%E4','餃':'%BB%E5','餅':'%BB%E6','餌':'%BB%E7','餉':'%BB%E8','駁':'%BB%E9','骯':'%BB%EA','骰':'%BB%EB','髦':'%BB%EC','魁':'%BB%ED','魂':'%BB%EE','鳴':'%BB%EF','鳶':'%BB%F0','鳳':'%BB%F1','麼':'%BB%F2','鼻':'%BB%F3','齊':'%BB%F4','億':'%BB%F5','儀':'%BB%F6','僻':'%BB%F7','僵':'%BB%F8','價':'%BB%F9','儂':'%BB%FA','儈':'%BB%FB','儉':'%BB%FC','儅':'%BB%FD','凜':'%BB%FE','劇':'%BC%40','劈':'%BC%41','劉':'%BC%42','劍':'%BC%43','劊':'%BC%44','勰':'%BC%45','厲':'%BC%46','嘮':'%BC%47','嘻':'%BC%48','嘹':'%BC%49','嘲':'%BC%4A','嘿':'%BC%4B','嘴':'%BC%4C','嘩':'%BC%4D','噓':'%BC%4E','噎':'%BC%4F','噗':'%BC%50','噴':'%BC%51','嘶':'%BC%52','嘯':'%BC%53','嘰':'%BC%54','墀':'%BC%55','墟':'%BC%56','增':'%BC%57','墳':'%BC%58','墜':'%BC%59','墮':'%BC%5A','墩':'%BC%5B','墦':'%BC%5C','奭':'%BC%5D','嬉':'%BC%5E','嫻':'%BC%5F','嬋':'%BC%60','嫵':'%BC%61','嬌':'%BC%62','嬈':'%BC%63','寮':'%BC%64','寬':'%BC%65','審':'%BC%66','寫':'%BC%67','層':'%BC%68','履':'%BC%69','嶝':'%BC%6A','嶔':'%BC%6B','幢':'%BC%6C','幟':'%BC%6D','幡':'%BC%6E','廢':'%BC%6F','廚':'%BC%70','廟':'%BC%71','廝':'%BC%72','廣':'%BC%73','廠':'%BC%74','彈':'%BC%75','影':'%BC%76','德':'%BC%77','徵':'%BC%78','慶':'%BC%79','慧':'%BC%7A','慮':'%BC%7B','慝':'%BC%7C','慕':'%BC%7D','憂':'%BC%7E','慼':'%BC%A1','慰':'%BC%A2','慫':'%BC%A3','慾':'%BC%A4','憧':'%BC%A5','憐':'%BC%A6','憫':'%BC%A7','憎':'%BC%A8','憬':'%BC%A9','憚':'%BC%AA','憤':'%BC%AB','憔':'%BC%AC','憮':'%BC%AD','戮':'%BC%AE','摩':'%BC%AF','摯':'%BC%B0','摹':'%BC%B1','撞':'%BC%B2','撲':'%BC%B3','撈':'%BC%B4','撐':'%BC%B5','撰':'%BC%B6','撥':'%BC%B7','撓':'%BC%B8','撕':'%BC%B9','撩':'%BC%BA','撒':'%BC%BB','撮':'%BC%BC','播':'%BC%BD','撫':'%BC%BE','撚':'%BC%BF','撬':'%BC%C0','撙':'%BC%C1','撢':'%BC%C2','撳':'%BC%C3','敵':'%BC%C4','敷':'%BC%C5','數':'%BC%C6','暮':'%BC%C7','暫':'%BC%C8','暴':'%BC%C9','暱':'%BC%CA','樣':'%BC%CB','樟':'%BC%CC','槨':'%BC%CD','樁':'%BC%CE','樞':'%BC%CF','標':'%BC%D0','槽':'%BC%D1','模':'%BC%D2','樓':'%BC%D3','樊':'%BC%D4','槳':'%BC%D5','樂':'%BC%D6','樅':'%BC%D7','槭':'%BC%D8','樑':'%BC%D9','歐':'%BC%DA','歎':'%BC%DB','殤':'%BC%DC','毅':'%BC%DD','毆':'%BC%DE','漿':'%BC%DF','潼':'%BC%E0','澄':'%BC%E1','潑':'%BC%E2','潦':'%BC%E3','潔':'%BC%E4','澆':'%BC%E5','潭':'%BC%E6','潛':'%BC%E7','潸':'%BC%E8','潮':'%BC%E9','澎':'%BC%EA','潺':'%BC%EB','潰':'%BC%EC','潤':'%BC%ED','澗':'%BC%EE','潘':'%BC%EF','滕':'%BC%F0','潯':'%BC%F1','潠':'%BC%F2','潟':'%BC%F3','熟':'%BC%F4','熬':'%BC%F5','熱':'%BC%F6','熨':'%BC%F7','牖':'%BC%F8','犛':'%BC%F9','獎':'%BC%FA','獗':'%BC%FB','瑩':'%BC%FC','璋':'%BC%FD','璃':'%BC%FE','瑾':'%BD%40','璀':'%BD%41','畿':'%BD%42','瘠':'%BD%43','瘩':'%BD%44','瘟':'%BD%45','瘤':'%BD%46','瘦':'%BD%47','瘡':'%BD%48','瘢':'%BD%49','皚':'%BD%4A','皺':'%BD%4B','盤':'%BD%4C','瞎':'%BD%4D','瞇':'%BD%4E','瞌':'%BD%4F','瞑':'%BD%50','瞋':'%BD%51','磋':'%BD%52','磅':'%BD%53','確':'%BD%54','磊':'%BD%55','碾':'%BD%56','磕':'%BD%57','碼':'%BD%58','磐':'%BD%59','稿':'%BD%5A','稼':'%BD%5B','穀':'%BD%5C','稽':'%BD%5D','稷':'%BD%5E','稻':'%BD%5F','窯':'%BD%60','窮':'%BD%61','箭':'%BD%62','箱':'%BD%63','範':'%BD%64','箴':'%BD%65','篆':'%BD%66','篇':'%BD%67','篁':'%BD%68','箠':'%BD%69','篌':'%BD%6A','糊':'%BD%6B','締':'%BD%6C','練':'%BD%6D','緯':'%BD%6E','緻':'%BD%6F','緘':'%BD%70','緬':'%BD%71','緝':'%BD%72','編':'%BD%73','緣':'%BD%74','線':'%BD%75','緞':'%BD%76','緩':'%BD%77','綞':'%BD%78','緙':'%BD%79','緲':'%BD%7A','緹':'%BD%7B','罵':'%BD%7C','罷':'%BD%7D','羯':'%BD%7E','翩':'%BD%A1','耦':'%BD%A2','膛':'%BD%A3','膜':'%BD%A4','膝':'%BD%A5','膠':'%BD%A6','膚':'%BD%A7','膘':'%BD%A8','蔗':'%BD%A9','蔽':'%BD%AA','蔚':'%BD%AB','蓮':'%BD%AC','蔬':'%BD%AD','蔭':'%BD%AE','蔓':'%BD%AF','蔑':'%BD%B0','蔣':'%BD%B1','蔡':'%BD%B2','蔔':'%BD%B3','蓬':'%BD%B4','蔥':'%BD%B5','蓿':'%BD%B6','蔆':'%BD%B7','螂':'%BD%B8','蝴':'%BD%B9','蝶':'%BD%BA','蝠':'%BD%BB','蝦':'%BD%BC','蝸':'%BD%BD','蝨':'%BD%BE','蝙':'%BD%BF','蝗':'%BD%C0','蝌':'%BD%C1','蝓':'%BD%C2','衛':'%BD%C3','衝':'%BD%C4','褐':'%BD%C5','複':'%BD%C6','褒':'%BD%C7','褓':'%BD%C8','褕':'%BD%C9','褊':'%BD%CA','誼':'%BD%CB','諒':'%BD%CC','談':'%BD%CD','諄':'%BD%CE','誕':'%BD%CF','請':'%BD%D0','諸':'%BD%D1','課':'%BD%D2','諉':'%BD%D3','諂':'%BD%D4','調':'%BD%D5','誰':'%BD%D6','論':'%BD%D7','諍':'%BD%D8','誶':'%BD%D9','誹':'%BD%DA','諛':'%BD%DB','豌':'%BD%DC','豎':'%BD%DD','豬':'%BD%DE','賠':'%BD%DF','賞':'%BD%E0','賦':'%BD%E1','賤':'%BD%E2','賬':'%BD%E3','賭':'%BD%E4','賢':'%BD%E5','賣':'%BD%E6','賜':'%BD%E7','質':'%BD%E8','賡':'%BD%E9','赭':'%BD%EA','趟':'%BD%EB','趣':'%BD%EC','踫':'%BD%ED','踐':'%BD%EE','踝':'%BD%EF','踢':'%BD%F0','踏':'%BD%F1','踩':'%BD%F2','踟':'%BD%F3','踡':'%BD%F4','踞':'%BD%F5','躺':'%BD%F6','輝':'%BD%F7','輛':'%BD%F8','輟':'%BD%F9','輩':'%BD%FA','輦':'%BD%FB','輪':'%BD%FC','輜':'%BD%FD','輞':'%BD%FE','輥':'%BE%40','適':'%BE%41','遮':'%BE%42','遨':'%BE%43','遭':'%BE%44','遷':'%BE%45','鄰':'%BE%46','鄭':'%BE%47','鄧':'%BE%48','鄱':'%BE%49','醇':'%BE%4A','醉':'%BE%4B','醋':'%BE%4C','醃':'%BE%4D','鋅':'%BE%4E','銻':'%BE%4F','銷':'%BE%50','鋪':'%BE%51','銬':'%BE%52','鋤':'%BE%53','鋁':'%BE%54','銳':'%BE%55','銼':'%BE%56','鋒':'%BE%57','鋇':'%BE%58','鋰':'%BE%59','銲':'%BE%5A','閭':'%BE%5B','閱':'%BE%5C','霄':'%BE%5D','霆':'%BE%5E','震':'%BE%5F','霉':'%BE%60','靠':'%BE%61','鞍':'%BE%62','鞋':'%BE%63','鞏':'%BE%64','頡':'%BE%65','頫':'%BE%66','頜':'%BE%67','颳':'%BE%68','養':'%BE%69','餓':'%BE%6A','餒':'%BE%6B','餘':'%BE%6C','駝':'%BE%6D','駐':'%BE%6E','駟':'%BE%6F','駛':'%BE%70','駑':'%BE%71','駕':'%BE%72','駒':'%BE%73','駙':'%BE%74','骷':'%BE%75','髮':'%BE%76','髯':'%BE%77','鬧':'%BE%78','魅':'%BE%79','魄':'%BE%7A','魷':'%BE%7B','魯':'%BE%7C','鴆':'%BE%7D','鴉':'%BE%7E','鴃':'%BE%A1','麩':'%BE%A2','麾':'%BE%A3','黎':'%BE%A4','墨':'%BE%A5','齒':'%BE%A6','儒':'%BE%A7','儘':'%BE%A8','儔':'%BE%A9','儐':'%BE%AA','儕':'%BE%AB','冀':'%BE%AC','冪':'%BE%AD','凝':'%BE%AE','劑':'%BE%AF','劓':'%BE%B0','勳':'%BE%B1','噙':'%BE%B2','噫':'%BE%B3','噹':'%BE%B4','噩':'%BE%B5','噤':'%BE%B6','噸':'%BE%B7','噪':'%BE%B8','器':'%BE%B9','噥':'%BE%BA','噱':'%BE%BB','噯':'%BE%BC','噬':'%BE%BD','噢':'%BE%BE','噶':'%BE%BF','壁':'%BE%C0','墾':'%BE%C1','壇':'%BE%C2','壅':'%BE%C3','奮':'%BE%C4','嬝':'%BE%C5','嬴':'%BE%C6','學':'%BE%C7','寰':'%BE%C8','導':'%BE%C9','彊':'%BE%CA','憲':'%BE%CB','憑':'%BE%CC','憩':'%BE%CD','憊':'%BE%CE','懍':'%BE%CF','憶':'%BE%D0','憾':'%BE%D1','懊':'%BE%D2','懈':'%BE%D3','戰':'%BE%D4','擅':'%BE%D5','擁':'%BE%D6','擋':'%BE%D7','撻':'%BE%D8','撼':'%BE%D9','據':'%BE%DA','擄':'%BE%DB','擇':'%BE%DC','擂':'%BE%DD','操':'%BE%DE','撿':'%BE%DF','擒':'%BE%E0','擔':'%BE%E1','撾':'%BE%E2','整':'%BE%E3','曆':'%BE%E4','曉':'%BE%E5','暹':'%BE%E6','曄':'%BE%E7','曇':'%BE%E8','暸':'%BE%E9','樽':'%BE%EA','樸':'%BE%EB','樺':'%BE%EC','橙':'%BE%ED','橫':'%BE%EE','橘':'%BE%EF','樹':'%BE%F0','橄':'%BE%F1','橢':'%BE%F2','橡':'%BE%F3','橋':'%BE%F4','橇':'%BE%F5','樵':'%BE%F6','機':'%BE%F7','橈':'%BE%F8','歙':'%BE%F9','歷':'%BE%FA','氅':'%BE%FB','濂':'%BE%FC','澱':'%BE%FD','澡':'%BE%FE','濃':'%BF%40','澤':'%BF%41','濁':'%BF%42','澧':'%BF%43','澳':'%BF%44','激':'%BF%45','澹':'%BF%46','澶':'%BF%47','澦':'%BF%48','澠':'%BF%49','澴':'%BF%4A','熾':'%BF%4B','燉':'%BF%4C','燐':'%BF%4D','燒':'%BF%4E','燈':'%BF%4F','燕':'%BF%50','熹':'%BF%51','燎':'%BF%52','燙':'%BF%53','燜':'%BF%54','燃':'%BF%55','燄':'%BF%56','獨':'%BF%57','璜':'%BF%58','璣':'%BF%59','璘':'%BF%5A','璟':'%BF%5B','璞':'%BF%5C','瓢':'%BF%5D','甌':'%BF%5E','甍':'%BF%5F','瘴':'%BF%60','瘸':'%BF%61','瘺':'%BF%62','盧':'%BF%63','盥':'%BF%64','瞠':'%BF%65','瞞':'%BF%66','瞟':'%BF%67','瞥':'%BF%68','磨':'%BF%69','磚':'%BF%6A','磬':'%BF%6B','磧':'%BF%6C','禦':'%BF%6D','積':'%BF%6E','穎':'%BF%6F','穆':'%BF%70','穌':'%BF%71','穋':'%BF%72','窺':'%BF%73','篙':'%BF%74','簑':'%BF%75','築':'%BF%76','篤':'%BF%77','篛':'%BF%78','篡':'%BF%79','篩':'%BF%7A','篦':'%BF%7B','糕':'%BF%7C','糖':'%BF%7D','縊':'%BF%7E','縑':'%BF%A1','縈':'%BF%A2','縛':'%BF%A3','縣':'%BF%A4','縞':'%BF%A5','縝':'%BF%A6','縉':'%BF%A7','縐':'%BF%A8','罹':'%BF%A9','羲':'%BF%AA','翰':'%BF%AB','翱':'%BF%AC','翮':'%BF%AD','耨':'%BF%AE','膳':'%BF%AF','膩':'%BF%B0','膨':'%BF%B1','臻':'%BF%B2','興':'%BF%B3','艘':'%BF%B4','艙':'%BF%B5','蕊':'%BF%B6','蕙':'%BF%B7','蕈':'%BF%B8','蕨':'%BF%B9','蕩':'%BF%BA','蕃':'%BF%BB','蕉':'%BF%BC','蕭':'%BF%BD','蕪':'%BF%BE','蕞':'%BF%BF','螃':'%BF%C0','螟':'%BF%C1','螞':'%BF%C2','螢':'%BF%C3','融':'%BF%C4','衡':'%BF%C5','褪':'%BF%C6','褲':'%BF%C7','褥':'%BF%C8','褫':'%BF%C9','褡':'%BF%CA','親':'%BF%CB','覦':'%BF%CC','諦':'%BF%CD','諺':'%BF%CE','諫':'%BF%CF','諱':'%BF%D0','謀':'%BF%D1','諜':'%BF%D2','諧':'%BF%D3','諮':'%BF%D4','諾':'%BF%D5','謁':'%BF%D6','謂':'%BF%D7','諷':'%BF%D8','諭':'%BF%D9','諳':'%BF%DA','諶':'%BF%DB','諼':'%BF%DC','豫':'%BF%DD','豭':'%BF%DE','貓':'%BF%DF','賴':'%BF%E0','蹄':'%BF%E1','踱':'%BF%E2','踴':'%BF%E3','蹂':'%BF%E4','踹':'%BF%E5','踵':'%BF%E6','輻':'%BF%E7','輯':'%BF%E8','輸':'%BF%E9','輳':'%BF%EA','辨':'%BF%EB','辦':'%BF%EC','遵':'%BF%ED','遴':'%BF%EE','選':'%BF%EF','遲':'%BF%F0','遼':'%BF%F1','遺':'%BF%F2','鄴':'%BF%F3','醒':'%BF%F4','錠':'%BF%F5','錶':'%BF%F6','鋸':'%BF%F7','錳':'%BF%F8','錯':'%BF%F9','錢':'%BF%FA','鋼':'%BF%FB','錫':'%BF%FC','錄':'%BF%FD','錚':'%BF%FE','錐':'%C0%40','錦':'%C0%41','錡':'%C0%42','錕':'%C0%43','錮':'%C0%44','錙':'%C0%45','閻':'%C0%46','隧':'%C0%47','隨':'%C0%48','險':'%C0%49','雕':'%C0%4A','霎':'%C0%4B','霑':'%C0%4C','霖':'%C0%4D','霍':'%C0%4E','霓':'%C0%4F','霏':'%C0%50','靛':'%C0%51','靜':'%C0%52','靦':'%C0%53','鞘':'%C0%54','頰':'%C0%55','頸':'%C0%56','頻':'%C0%57','頷':'%C0%58','頭':'%C0%59','頹':'%C0%5A','頤':'%C0%5B','餐':'%C0%5C','館':'%C0%5D','餞':'%C0%5E','餛':'%C0%5F','餡':'%C0%60','餚':'%C0%61','駭':'%C0%62','駢':'%C0%63','駱':'%C0%64','骸':'%C0%65','骼':'%C0%66','髻':'%C0%67','髭':'%C0%68','鬨':'%C0%69','鮑':'%C0%6A','鴕':'%C0%6B','鴣':'%C0%6C','鴦':'%C0%6D','鴨':'%C0%6E','鴒':'%C0%6F','鴛':'%C0%70','默':'%C0%71','黔':'%C0%72','龍':'%C0%73','龜':'%C0%74','優':'%C0%75','償':'%C0%76','儡':'%C0%77','儲':'%C0%78','勵':'%C0%79','嚎':'%C0%7A','嚀':'%C0%7B','嚐':'%C0%7C','嚅':'%C0%7D','嚇':'%C0%7E','嚏':'%C0%A1','壕':'%C0%A2','壓':'%C0%A3','壑':'%C0%A4','壎':'%C0%A5','嬰':'%C0%A6','嬪':'%C0%A7','嬤':'%C0%A8','孺':'%C0%A9','尷':'%C0%AA','屨':'%C0%AB','嶼':'%C0%AC','嶺':'%C0%AD','嶽':'%C0%AE','嶸':'%C0%AF','幫':'%C0%B0','彌':'%C0%B1','徽':'%C0%B2','應':'%C0%B3','懂':'%C0%B4','懇':'%C0%B5','懦':'%C0%B6','懋':'%C0%B7','戲':'%C0%B8','戴':'%C0%B9','擎':'%C0%BA','擊':'%C0%BB','擘':'%C0%BC','擠':'%C0%BD','擰':'%C0%BE','擦':'%C0%BF','擬':'%C0%C0','擱':'%C0%C1','擢':'%C0%C2','擭':'%C0%C3','斂':'%C0%C4','斃':'%C0%C5','曙':'%C0%C6','曖':'%C0%C7','檀':'%C0%C8','檔':'%C0%C9','檄':'%C0%CA','檢':'%C0%CB','檜':'%C0%CC','櫛':'%C0%CD','檣':'%C0%CE','橾':'%C0%CF','檗':'%C0%D0','檐':'%C0%D1','檠':'%C0%D2','歜':'%C0%D3','殮':'%C0%D4','毚':'%C0%D5','氈':'%C0%D6','濘':'%C0%D7','濱':'%C0%D8','濟':'%C0%D9','濠':'%C0%DA','濛':'%C0%DB','濤':'%C0%DC','濫':'%C0%DD','濯':'%C0%DE','澀':'%C0%DF','濬':'%C0%E0','濡':'%C0%E1','濩':'%C0%E2','濕':'%C0%E3','濮':'%C0%E4','濰':'%C0%E5','燧':'%C0%E6','營':'%C0%E7','燮':'%C0%E8','燦':'%C0%E9','燥':'%C0%EA','燭':'%C0%EB','燬':'%C0%EC','燴':'%C0%ED','燠':'%C0%EE','爵':'%C0%EF','牆':'%C0%F0','獰':'%C0%F1','獲':'%C0%F2','璩':'%C0%F3','環':'%C0%F4','璦':'%C0%F5','璨':'%C0%F6','癆':'%C0%F7','療':'%C0%F8','癌':'%C0%F9','盪':'%C0%FA','瞳':'%C0%FB','瞪':'%C0%FC','瞰':'%C0%FD','瞬':'%C0%FE','瞧':'%C1%40','瞭':'%C1%41','矯':'%C1%42','磷':'%C1%43','磺':'%C1%44','磴':'%C1%45','磯':'%C1%46','礁':'%C1%47','禧':'%C1%48','禪':'%C1%49','穗':'%C1%4A','窿':'%C1%4B','簇':'%C1%4C','簍':'%C1%4D','篾':'%C1%4E','篷':'%C1%4F','簌':'%C1%50','篠':'%C1%51','糠':'%C1%52','糜':'%C1%53','糞':'%C1%54','糢':'%C1%55','糟':'%C1%56','糙':'%C1%57','糝':'%C1%58','縮':'%C1%59','績':'%C1%5A','繆':'%C1%5B','縷':'%C1%5C','縲':'%C1%5D','繃':'%C1%5E','縫':'%C1%5F','總':'%C1%60','縱':'%C1%61','繅':'%C1%62','繁':'%C1%63','縴':'%C1%64','縹':'%C1%65','繈':'%C1%66','縵':'%C1%67','縿':'%C1%68','縯':'%C1%69','罄':'%C1%6A','翳':'%C1%6B','翼':'%C1%6C','聱':'%C1%6D','聲':'%C1%6E','聰':'%C1%6F','聯':'%C1%70','聳':'%C1%71','臆':'%C1%72','臃':'%C1%73','膺':'%C1%74','臂':'%C1%75','臀':'%C1%76','膿':'%C1%77','膽':'%C1%78','臉':'%C1%79','膾':'%C1%7A','臨':'%C1%7B','舉':'%C1%7C','艱':'%C1%7D','薪':'%C1%7E','薄':'%C1%A1','蕾':'%C1%A2','薜':'%C1%A3','薑':'%C1%A4','薔':'%C1%A5','薯':'%C1%A6','薛':'%C1%A7','薇':'%C1%A8','薨':'%C1%A9','薊':'%C1%AA','虧':'%C1%AB','蟀':'%C1%AC','蟑':'%C1%AD','螳':'%C1%AE','蟒':'%C1%AF','蟆':'%C1%B0','螫':'%C1%B1','螻':'%C1%B2','螺':'%C1%B3','蟈':'%C1%B4','蟋':'%C1%B5','褻':'%C1%B6','褶':'%C1%B7','襄':'%C1%B8','褸':'%C1%B9','褽':'%C1%BA','覬':'%C1%BB','謎':'%C1%BC','謗':'%C1%BD','謙':'%C1%BE','講':'%C1%BF','謊':'%C1%C0','謠':'%C1%C1','謝':'%C1%C2','謄':'%C1%C3','謐':'%C1%C4','豁':'%C1%C5','谿':'%C1%C6','豳':'%C1%C7','賺':'%C1%C8','賽':'%C1%C9','購':'%C1%CA','賸':'%C1%CB','賻':'%C1%CC','趨':'%C1%CD','蹉':'%C1%CE','蹋':'%C1%CF','蹈':'%C1%D0','蹊':'%C1%D1','轄':'%C1%D2','輾':'%C1%D3','轂':'%C1%D4','轅':'%C1%D5','輿':'%C1%D6','避':'%C1%D7','遽':'%C1%D8','還':'%C1%D9','邁':'%C1%DA','邂':'%C1%DB','邀':'%C1%DC','鄹':'%C1%DD','醣':'%C1%DE','醞':'%C1%DF','醜':'%C1%E0','鍍':'%C1%E1','鎂':'%C1%E2','錨':'%C1%E3','鍵':'%C1%E4','鍊':'%C1%E5','鍥':'%C1%E6','鍋':'%C1%E7','錘':'%C1%E8','鍾':'%C1%E9','鍬':'%C1%EA','鍛':'%C1%EB','鍰':'%C1%EC','鍚':'%C1%ED','鍔':'%C1%EE','闊':'%C1%EF','闋':'%C1%F0','闌':'%C1%F1','闈':'%C1%F2','闆':'%C1%F3','隱':'%C1%F4','隸':'%C1%F5','雖':'%C1%F6','霜':'%C1%F7','霞':'%C1%F8','鞠':'%C1%F9','韓':'%C1%FA','顆':'%C1%FB','颶':'%C1%FC','餵':'%C1%FD','騁':'%C1%FE','駿':'%C2%40','鮮':'%C2%41','鮫':'%C2%42','鮪':'%C2%43','鮭':'%C2%44','鴻':'%C2%45','鴿':'%C2%46','麋':'%C2%47','黏':'%C2%48','點':'%C2%49','黜':'%C2%4A','黝':'%C2%4B','黛':'%C2%4C','鼾':'%C2%4D','齋':'%C2%4E','叢':'%C2%4F','嚕':'%C2%50','嚮':'%C2%51','壙':'%C2%52','壘':'%C2%53','嬸':'%C2%54','彝':'%C2%55','懣':'%C2%56','戳':'%C2%57','擴':'%C2%58','擲':'%C2%59','擾':'%C2%5A','攆':'%C2%5B','擺':'%C2%5C','擻':'%C2%5D','擷':'%C2%5E','斷':'%C2%5F','曜':'%C2%60','朦':'%C2%61','檳':'%C2%62','檬':'%C2%63','櫃':'%C2%64','檻':'%C2%65','檸':'%C2%66','櫂':'%C2%67','檮':'%C2%68','檯':'%C2%69','歟':'%C2%6A','歸':'%C2%6B','殯':'%C2%6C','瀉':'%C2%6D','瀋':'%C2%6E','濾':'%C2%6F','瀆':'%C2%70','濺':'%C2%71','瀑':'%C2%72','瀏':'%C2%73','燻':'%C2%74','燼':'%C2%75','燾':'%C2%76','燸':'%C2%77','獷':'%C2%78','獵':'%C2%79','璧':'%C2%7A','璿':'%C2%7B','甕':'%C2%7C','癖':'%C2%7D','癘':'%C2%7E','癒':'%C2%A1','瞽':'%C2%A2','瞿':'%C2%A3','瞻':'%C2%A4','瞼':'%C2%A5','礎':'%C2%A6','禮':'%C2%A7','穡':'%C2%A8','穢':'%C2%A9','穠':'%C2%AA','竄':'%C2%AB','竅':'%C2%AC','簫':'%C2%AD','簧':'%C2%AE','簪':'%C2%AF','簞':'%C2%B0','簣':'%C2%B1','簡':'%C2%B2','糧':'%C2%B3','織':'%C2%B4','繕':'%C2%B5','繞':'%C2%B6','繚':'%C2%B7','繡':'%C2%B8','繒':'%C2%B9','繙':'%C2%BA','罈':'%C2%BB','翹':'%C2%BC','翻':'%C2%BD','職':'%C2%BE','聶':'%C2%BF','臍':'%C2%C0','臏':'%C2%C1','舊':'%C2%C2','藏':'%C2%C3','薩':'%C2%C4','藍':'%C2%C5','藐':'%C2%C6','藉':'%C2%C7','薰':'%C2%C8','薺':'%C2%C9','薹':'%C2%CA','薦':'%C2%CB','蟯':'%C2%CC','蟬':'%C2%CD','蟲':'%C2%CE','蟠':'%C2%CF','覆':'%C2%D0','覲':'%C2%D1','觴':'%C2%D2','謨':'%C2%D3','謹':'%C2%D4','謬':'%C2%D5','謫':'%C2%D6','豐':'%C2%D7','贅':'%C2%D8','蹙':'%C2%D9','蹣':'%C2%DA','蹦':'%C2%DB','蹤':'%C2%DC','蹟':'%C2%DD','蹕':'%C2%DE','軀':'%C2%DF','轉':'%C2%E0','轍':'%C2%E1','邇':'%C2%E2','邃':'%C2%E3','邈':'%C2%E4','醫':'%C2%E5','醬':'%C2%E6','釐':'%C2%E7','鎔':'%C2%E8','鎊':'%C2%E9','鎖':'%C2%EA','鎢':'%C2%EB','鎳':'%C2%EC','鎮':'%C2%ED','鎬':'%C2%EE','鎰':'%C2%EF','鎘':'%C2%F0','鎚':'%C2%F1','鎗':'%C2%F2','闔':'%C2%F3','闖':'%C2%F4','闐':'%C2%F5','闕':'%C2%F6','離':'%C2%F7','雜':'%C2%F8','雙':'%C2%F9','雛':'%C2%FA','雞':'%C2%FB','霤':'%C2%FC','鞣':'%C2%FD','鞦':'%C2%FE','鞭':'%C3%40','韹':'%C3%41','額':'%C3%42','顏':'%C3%43','題':'%C3%44','顎':'%C3%45','顓':'%C3%46','颺':'%C3%47','餾':'%C3%48','餿':'%C3%49','餽':'%C3%4A','餮':'%C3%4B','馥':'%C3%4C','騎':'%C3%4D','髁':'%C3%4E','鬃':'%C3%4F','鬆':'%C3%50','魏':'%C3%51','魎':'%C3%52','魍':'%C3%53','鯊':'%C3%54','鯉':'%C3%55','鯽':'%C3%56','鯈':'%C3%57','鯀':'%C3%58','鵑':'%C3%59','鵝':'%C3%5A','鵠':'%C3%5B','黠':'%C3%5C','鼕':'%C3%5D','鼬':'%C3%5E','儳':'%C3%5F','嚥':'%C3%60','壞':'%C3%61','壟':'%C3%62','壢':'%C3%63','寵':'%C3%64','龐':'%C3%65','廬':'%C3%66','懲':'%C3%67','懷':'%C3%68','懶':'%C3%69','懵':'%C3%6A','攀':'%C3%6B','攏':'%C3%6C','曠':'%C3%6D','曝':'%C3%6E','櫥':'%C3%6F','櫝':'%C3%70','櫚':'%C3%71','櫓':'%C3%72','瀛':'%C3%73','瀟':'%C3%74','瀨':'%C3%75','瀚':'%C3%76','瀝':'%C3%77','瀕':'%C3%78','瀘':'%C3%79','爆':'%C3%7A','爍':'%C3%7B','牘':'%C3%7C','犢':'%C3%7D','獸':'%C3%7E','獺':'%C3%A1','璽':'%C3%A2','瓊':'%C3%A3','瓣':'%C3%A4','疇':'%C3%A5','疆':'%C3%A6','癟':'%C3%A7','癡':'%C3%A8','矇':'%C3%A9','礙':'%C3%AA','禱':'%C3%AB','穫':'%C3%AC','穩':'%C3%AD','簾':'%C3%AE','簿':'%C3%AF','簸':'%C3%B0','簽':'%C3%B1','簷':'%C3%B2','籀':'%C3%B3','繫':'%C3%B4','繭':'%C3%B5','繹':'%C3%B6','繩':'%C3%B7','繪':'%C3%B8','羅':'%C3%B9','繳':'%C3%BA','羶':'%C3%BB','羹':'%C3%BC','羸':'%C3%BD','臘':'%C3%BE','藩':'%C3%BF','藝':'%C3%C0','藪':'%C3%C1','藕':'%C3%C2','藤':'%C3%C3','藥':'%C3%C4','藷':'%C3%C5','蟻':'%C3%C6','蠅':'%C3%C7','蠍':'%C3%C8','蟹':'%C3%C9','蟾':'%C3%CA','襠':'%C3%CB','襟':'%C3%CC','襖':'%C3%CD','襞':'%C3%CE','譁':'%C3%CF','譜':'%C3%D0','識':'%C3%D1','證':'%C3%D2','譚':'%C3%D3','譎':'%C3%D4','譏':'%C3%D5','譆':'%C3%D6','譙':'%C3%D7','贈':'%C3%D8','贊':'%C3%D9','蹼':'%C3%DA','蹲':'%C3%DB','躇':'%C3%DC','蹶':'%C3%DD','蹬':'%C3%DE','蹺':'%C3%DF','蹴':'%C3%E0','轔':'%C3%E1','轎':'%C3%E2','辭':'%C3%E3','邊':'%C3%E4','邋':'%C3%E5','醱':'%C3%E6','醮':'%C3%E7','鏡':'%C3%E8','鏑':'%C3%E9','鏟':'%C3%EA','鏃':'%C3%EB','鏈':'%C3%EC','鏜':'%C3%ED','鏝':'%C3%EE','鏖':'%C3%EF','鏢':'%C3%F0','鏍':'%C3%F1','鏘':'%C3%F2','鏤':'%C3%F3','鏗':'%C3%F4','鏨':'%C3%F5','關':'%C3%F6','隴':'%C3%F7','難':'%C3%F8','霪':'%C3%F9','霧':'%C3%FA','靡':'%C3%FB','韜':'%C3%FC','韻':'%C3%FD','類':'%C3%FE','願':'%C4%40','顛':'%C4%41','颼':'%C4%42','饅':'%C4%43','饉':'%C4%44','騖':'%C4%45','騙':'%C4%46','鬍':'%C4%47','鯨':'%C4%48','鯧':'%C4%49','鯖':'%C4%4A','鯛':'%C4%4B','鶉':'%C4%4C','鵡':'%C4%4D','鵲':'%C4%4E','鵪':'%C4%4F','鵬':'%C4%50','麒':'%C4%51','麗':'%C4%52','麓':'%C4%53','麴':'%C4%54','勸':'%C4%55','嚨':'%C4%56','嚷':'%C4%57','嚶':'%C4%58','嚴':'%C4%59','嚼':'%C4%5A','壤':'%C4%5B','孀':'%C4%5C','孃':'%C4%5D','孽':'%C4%5E','寶':'%C4%5F','巉':'%C4%60','懸':'%C4%61','懺':'%C4%62','攘':'%C4%63','攔':'%C4%64','攙':'%C4%65','曦':'%C4%66','朧':'%C4%67','櫬':'%C4%68','瀾':'%C4%69','瀰':'%C4%6A','瀲':'%C4%6B','爐':'%C4%6C','獻':'%C4%6D','瓏':'%C4%6E','癢':'%C4%6F','癥':'%C4%70','礦':'%C4%71','礪':'%C4%72','礬':'%C4%73','礫':'%C4%74','竇':'%C4%75','競':'%C4%76','籌':'%C4%77','籃':'%C4%78','籍':'%C4%79','糯':'%C4%7A','糰':'%C4%7B','辮':'%C4%7C','繽':'%C4%7D','繼':'%C4%7E','纂':'%C4%A1','罌':'%C4%A2','耀':'%C4%A3','臚':'%C4%A4','艦':'%C4%A5','藻':'%C4%A6','藹':'%C4%A7','蘑':'%C4%A8','藺':'%C4%A9','蘆':'%C4%AA','蘋':'%C4%AB','蘇':'%C4%AC','蘊':'%C4%AD','蠔':'%C4%AE','蠕':'%C4%AF','襤':'%C4%B0','覺':'%C4%B1','觸':'%C4%B2','議':'%C4%B3','譬':'%C4%B4','警':'%C4%B5','譯':'%C4%B6','譟':'%C4%B7','譫':'%C4%B8','贏':'%C4%B9','贍':'%C4%BA','躉':'%C4%BB','躁':'%C4%BC','躅':'%C4%BD','躂':'%C4%BE','醴':'%C4%BF','釋':'%C4%C0','鐘':'%C4%C1','鐃':'%C4%C2','鏽':'%C4%C3','闡':'%C4%C4','霰':'%C4%C5','飄':'%C4%C6','饒':'%C4%C7','饑':'%C4%C8','馨':'%C4%C9','騫':'%C4%CA','騰':'%C4%CB','騷':'%C4%CC','騵':'%C4%CD','鰓':'%C4%CE','鰍':'%C4%CF','鹹':'%C4%D0','麵':'%C4%D1','黨':'%C4%D2','鼯':'%C4%D3','齟':'%C4%D4','齣':'%C4%D5','齡':'%C4%D6','儷':'%C4%D7','儸':'%C4%D8','囁':'%C4%D9','囀':'%C4%DA','囂':'%C4%DB','夔':'%C4%DC','屬':'%C4%DD','巍':'%C4%DE','懼':'%C4%DF','懾':'%C4%E0','攝':'%C4%E1','攜':'%C4%E2','斕':'%C4%E3','曩':'%C4%E4','櫻':'%C4%E5','欄':'%C4%E6','櫺':'%C4%E7','殲':'%C4%E8','灌':'%C4%E9','爛':'%C4%EA','犧':'%C4%EB','瓖':'%C4%EC','瓔':'%C4%ED','癩':'%C4%EE','矓':'%C4%EF','籐':'%C4%F0','纏':'%C4%F1','續':'%C4%F2','羼':'%C4%F3','蘗':'%C4%F4','蘭':'%C4%F5','蘚':'%C4%F6','蠣':'%C4%F7','蠢':'%C4%F8','蠡':'%C4%F9','蠟':'%C4%FA','襪':'%C4%FB','襬':'%C4%FC','覽':'%C4%FD','譴':'%C4%FE','護':'%C5%40','譽':'%C5%41','贓':'%C5%42','躊':'%C5%43','躍':'%C5%44','躋':'%C5%45','轟':'%C5%46','辯':'%C5%47','醺':'%C5%48','鐮':'%C5%49','鐳':'%C5%4A','鐵':'%C5%4B','鐺':'%C5%4C','鐸':'%C5%4D','鐲':'%C5%4E','鐫':'%C5%4F','闢':'%C5%50','霸':'%C5%51','霹':'%C5%52','露':'%C5%53','響':'%C5%54','顧':'%C5%55','顥':'%C5%56','饗':'%C5%57','驅':'%C5%58','驃':'%C5%59','驀':'%C5%5A','騾':'%C5%5B','髏':'%C5%5C','魔':'%C5%5D','魑':'%C5%5E','鰭':'%C5%5F','鰥':'%C5%60','鶯':'%C5%61','鶴':'%C5%62','鷂':'%C5%63','鶸':'%C5%64','麝':'%C5%65','黯':'%C5%66','鼙':'%C5%67','齜':'%C5%68','齦':'%C5%69','齧':'%C5%6A','儼':'%C5%6B','儻':'%C5%6C','囈':'%C5%6D','囊':'%C5%6E','囉':'%C5%6F','孿':'%C5%70','巔':'%C5%71','巒':'%C5%72','彎':'%C5%73','懿':'%C5%74','攤':'%C5%75','權':'%C5%76','歡':'%C5%77','灑':'%C5%78','灘':'%C5%79','玀':'%C5%7A','瓤':'%C5%7B','疊':'%C5%7C','癮':'%C5%7D','癬':'%C5%7E','禳':'%C5%A1','籠':'%C5%A2','籟':'%C5%A3','聾':'%C5%A4','聽':'%C5%A5','臟':'%C5%A6','襲':'%C5%A7','襯':'%C5%A8','觼':'%C5%A9','讀':'%C5%AA','贖':'%C5%AB','贗':'%C5%AC','躑':'%C5%AD','躓':'%C5%AE','轡':'%C5%AF','酈':'%C5%B0','鑄':'%C5%B1','鑑':'%C5%B2','鑒':'%C5%B3','霽':'%C5%B4','霾':'%C5%B5','韃':'%C5%B6','韁':'%C5%B7','顫':'%C5%B8','饕':'%C5%B9','驕':'%C5%BA','驍':'%C5%BB','髒':'%C5%BC','鬚':'%C5%BD','鱉':'%C5%BE','鰱':'%C5%BF','鰾':'%C5%C0','鰻':'%C5%C1','鷓':'%C5%C2','鷗':'%C5%C3','鼴':'%C5%C4','齬':'%C5%C5','齪':'%C5%C6','龔':'%C5%C7','囌':'%C5%C8','巖':'%C5%C9','戀':'%C5%CA','攣':'%C5%CB','攫':'%C5%CC','攪':'%C5%CD','曬':'%C5%CE','欐':'%C5%CF','瓚':'%C5%D0','竊':'%C5%D1','籤':'%C5%D2','籣':'%C5%D3','籥':'%C5%D4','纓':'%C5%D5','纖':'%C5%D6','纔':'%C5%D7','臢':'%C5%D8','蘸':'%C5%D9','蘿':'%C5%DA','蠱':'%C5%DB','變':'%C5%DC','邐':'%C5%DD','邏':'%C5%DE','鑣':'%C5%DF','鑠':'%C5%E0','鑤':'%C5%E1','靨':'%C5%E2','顯':'%C5%E3','饜':'%C5%E4','驚':'%C5%E5','驛':'%C5%E6','驗':'%C5%E7','髓':'%C5%E8','體':'%C5%E9','髑':'%C5%EA','鱔':'%C5%EB','鱗':'%C5%EC','鱖':'%C5%ED','鷥':'%C5%EE','麟':'%C5%EF','黴':'%C5%F0','囑':'%C5%F1','壩':'%C5%F2','攬':'%C5%F3','灞':'%C5%F4','癱':'%C5%F5','癲':'%C5%F6','矗':'%C5%F7','罐':'%C5%F8','羈':'%C5%F9','蠶':'%C5%FA','蠹':'%C5%FB','衢':'%C5%FC','讓':'%C5%FD','讒':'%C5%FE','讖':'%C6%40','艷':'%C6%41','贛':'%C6%42','釀':'%C6%43','鑪':'%C6%44','靂':'%C6%45','靈':'%C6%46','靄':'%C6%47','韆':'%C6%48','顰':'%C6%49','驟':'%C6%4A','鬢':'%C6%4B','魘':'%C6%4C','鱟':'%C6%4D','鷹':'%C6%4E','鷺':'%C6%4F','鹼':'%C6%50','鹽':'%C6%51','鼇':'%C6%52','齷':'%C6%53','齲':'%C6%54','廳':'%C6%55','欖':'%C6%56','灣':'%C6%57','籬':'%C6%58','籮':'%C6%59','蠻':'%C6%5A','觀':'%C6%5B','躡':'%C6%5C','釁':'%C6%5D','鑲':'%C6%5E','鑰':'%C6%5F','顱':'%C6%60','饞':'%C6%61','髖':'%C6%62','鬣':'%C6%63','黌':'%C6%64','灤':'%C6%65','矚':'%C6%66','讚':'%C6%67','鑷':'%C6%68','韉':'%C6%69','驢':'%C6%6A','驥':'%C6%6B','纜':'%C6%6C','讜':'%C6%6D','躪':'%C6%6E','釅':'%C6%6F','鑽':'%C6%70','鑾':'%C6%71','鑼':'%C6%72','鱷':'%C6%73','鱸':'%C6%74','黷':'%C6%75','豔':'%C6%76','鑿':'%C6%77','鸚':'%C6%78','爨':'%C6%79','驪':'%C6%7A','鬱':'%C6%7B','鸛':'%C6%7C','鸞':'%C6%7D','籲':'%C6%7E'};

// ========== 所有功能函数 ==========

        // ========== 搜索結果緩存 ==========
        const CACHE_KEY = 'lexi-can-cache';
        const CACHE_EXPIRE = 7 * 24 * 60 * 60 * 1000; // 7天過期

        function getCache(char) {
            try {
                const cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
                const item = cache[char];
                if (item && Date.now() - item.time < CACHE_EXPIRE) {
                    return item.data;
                }
            } catch (e) {}
            return null;
        }

        function setCache(char, data) {
            try {
                const cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
                cache[char] = { data, time: Date.now() };
                // 限制緩存大小，最多500個字
                const keys = Object.keys(cache);
                if (keys.length > 500) {
                    const sorted = keys.sort((a, b) => cache[a].time - cache[b].time);
                    for (let i = 0; i < 100; i++) {
                        delete cache[sorted[i]];
                    }
                }
                localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            } catch (e) {}
        }

        // 使用 GM_xmlhttpRequest 從原網站獲取數據
        async function fetchFromOriginal(char) {
            console.log('開始獲取數據:', char);

            // 先檢查緩存
            const cached = getCache(char);
            if (cached) {
                console.log('使用緩存數據:', cached.length, '條');
                showResultTable(char, cached);
                return;
            }

            // 檢查 GM 函數是否可用
            if (typeof window._GM_xmlhttpRequest !== 'function') {
                console.error('GM_xmlhttpRequest 不可用');
                document.getElementById('result-table-body').innerHTML = '<tr><td colspan="4" class="no-data">腳本功能不可用，請查看下方結果</td></tr>';
                document.getElementById('result-table-section').style.display = 'block';
                return;
            }

            return new Promise((resolve, reject) => {
                const big5Encoded = big5Map[char] || encodeURIComponent(char);
                const url = 'https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/search.php?q=' + big5Encoded;
                console.log('請求URL:', url);

                window._GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "arraybuffer",
                    onload: function(response) {
                        try {
                            const decoder = new TextDecoder("big5");
                            const text = decoder.decode(response.response);

                            console.log('響應長度:', text.length);

                            // 使用 DOMParser 解析 HTML
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(text, 'text/html');

                            // 只查找 border="1" 的表格（讀音數據表格）
                            // 排除 border="0" 的表格（基本信息表格）
                            const tables = doc.querySelectorAll('table[border="1"]');
                            console.log('找到 border=1 的表格數:', tables.length);

                            let result = [];

                            // 遍歷所有 border="1" 的表格
                            for (const table of tables) {
                                const rows = table.querySelectorAll('tr');
                                console.log('表格行數:', rows.length);

                                // 跳過表頭行，從第二行開始
                                for (let i = 1; i < rows.length; i++) {
                                    const cells = rows[i].querySelectorAll('td');

                                    if (cells.length >= 6) {
                                        // 第0列：讀音，第3列：同音字，第5列：詞例
                                        const pron = cells[0].textContent.trim();
                                        const homo = cells[3].textContent.replace(/\\[.*?\\]/g, '').trim();
                                        const words = cells[5].textContent.replace(/\\[.*?\\]/g, '').trim();

                                        // 驗證讀音格式（應該是粵拼，如 zung1）
                                        if (pron && /^[a-z]+[1-6]$/.test(pron)) {
                                            result.push({ pron, words, homo });
                                            console.log('解析到:', pron, words.substring(0, 20));
                                        }
                                    }
                                }

                                // 如果這個表格找到了數據，就停止搜索
                                if (result.length > 0) break;
                            }

                            console.log('解析結果數:', result.length);

                            if (result.length > 0) {
                                setCache(char, result);
                                showResultTable(char, result);
                            } else {
                                document.getElementById('result-table-body').innerHTML = '<tr><td colspan="4" class="no-data">請查看下方結果</td></tr>';
                                document.getElementById('result-table-section').style.display = 'block';
                            }
                        } catch (e) {
                            console.error("解析錯誤:", e);
                            document.getElementById('result-table-body').innerHTML = '<tr><td colspan="4" class="no-data">解析失敗，請查看下方結果</td></tr>';
                            document.getElementById('result-table-section').style.display = 'block';
                        }
                        resolve();
                    },
                    onerror: function(err) {
                        console.error("請求錯誤:", err);
                        document.getElementById('result-table-body').innerHTML = '<tr><td colspan="4" class="no-data">請求失敗，請查看下方結果</td></tr>';
                        document.getElementById('result-table-section').style.display = 'block';
                        reject(err);
                    }
                });
            });
        }
// 搜索功能已整合，無需切換標籤\r\n
        function searchChar() {
            let char = document.getElementById('char-input').value.trim();
            if (!char) {
                alert('請輸入漢字');
                return;
            }

            // Convert simplified to traditional
            char = convertToTraditional(char);
            document.getElementById('char-input').value = char;

            showLoading();
            addToHistory(char);
            fetchPronunciations(char);
            document.getElementById('hidden-char-input').value = char;
            document.getElementById('hidden-char-form').submit();
            document.getElementById('original-link').href =
                \`https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/search.php?q=\${encodeURIComponent(char)}\`;
        }

        // Big5 encoding map is loaded from external big5map.js file

        // ========== 简繁转换 ==========
        const s2tMap = {'有':'有','国':'國','学':'學','为':'為','会':'會','来':'來','说':'說','时':'時','们':'們','这':'這','个':'個','过':'過','东':'東','广':'廣','书':'書','读':'讀','听':'聽','讲':'講','写':'寫','爱':'愛','龙':'龍','凤':'鳳','乐':'樂','声':'聲','语':'語','汉':'漢','字':'字','词':'詞','长':'長','发':'發','当':'當','对':'對','开':'開','关':'關','门':'門','问':'問','间':'間','见':'見','现':'現','只':'只','从':'從','两':'兩','进':'進','动':'動','点':'點','让':'讓','给':'給','听':'聽','觉':'覺','认':'認','应':'應','还':'還','经':'經','样':'樣','变':'變','电':'電','车':'車','边':'邊','头':'頭','体':'體','业':'業','产':'產','历':'歷','义':'義','务':'務','员':'員','区':'區','华':'華','协':'協','单':'單','发':'發','台':'臺','叶':'葉','号':'號','团':'團','处':'處','备':'備','复':'復','实':'實','审':'審','写':'寫','层':'層','币':'幣','帐':'帳','带':'帶','帮':'幫','常':'常','广':'廣','庆':'慶','库':'庫','应':'應','态':'態','战':'戰','护':'護','择':'擇','据':'據','换':'換','损':'損','搞':'搞','摄':'攝','教':'教','数':'數','整':'整','断':'斷','无':'無','既':'既','时':'時','晋':'晉','显':'顯','术':'術','机':'機','杀':'殺','条':'條','来':'來','极':'極','构':'構','查':'查','标':'標','栋':'棟','样':'樣','根':'根','检':'檢','业':'業','极':'極','概':'概','欢':'歡','欧':'歐','歌':'歌','止':'止','归':'歸','气':'氣','汇':'匯','汉':'漢','没':'沒','沟':'溝','治':'治','况':'況','泽':'澤','洁':'潔','济':'濟','浅':'淺','测':'測','浓':'濃','涉':'涉','渐':'漸','湾':'灣','满':'滿','滚':'滾','演':'演','灯':'燈','灵':'靈','灾':'災','炉':'爐','点':'點','热':'熱','无':'無','照':'照','爱':'愛','版':'版','牵':'牽','犹':'猶','独':'獨','狱':'獄','献':'獻','环':'環','现':'現','玛':'瑪','理':'理','琼':'瓊','瓶':'瓶','电':'電','画':'畫','畅':'暢','疗':'療','疯':'瘋','登':'登','百':'百','监':'監','盖':'蓋','盘':'盤','眼':'眼','着':'著','矿':'礦','码':'碼','确':'確','础':'礎','硕':'碩','碍':'礙','礼':'禮','社':'社','祸':'禍','离':'離','种':'種','积':'積','称':'稱','税':'稅','稳':'穩','穷':'窮','窗':'窗','立':'立','站':'站','竞':'競','笔':'筆','笑':'笑','第':'第','等':'等','筑':'築','答':'答','策':'策','简':'簡','算':'算','管':'管','类':'類','粮':'糧','精':'精','系':'系','纠':'糾','纪':'紀','约':'約','级':'級','纯':'純','纲':'綱','纳':'納','纵':'縱','纷':'紛','纸':'紙','纽':'紐','线':'線','练':'練','组':'組','细':'細','织':'織','终':'終','绍':'紹','经':'經','绑':'綁','结':'結','绕':'繞','绘':'繪','给':'給','络':'絡','绝':'絕','统':'統','继':'繼','绩':'績','绪':'緒','续':'續','维':'維','绵':'綿','综':'綜','绿':'綠','缓':'緩','编':'編','缘':'緣','网':'網','罗':'羅','罚':'罰','罢':'罷','羽':'羽','翻':'翻','习':'習','耻':'恥','联':'聯','聪':'聰','肃':'肅','肤':'膚','肾':'腎','肿':'腫','胀':'脹','胁':'脅','胜':'勝','胶':'膠','脉':'脈','脑':'腦','脱':'脫','脸':'臉','腊':'臘','腾':'騰','舆':'輿','舍':'捨','航':'航','般':'般','舰':'艦','艰':'艱','艳':'豔','节':'節','芦':'蘆','苏':'蘇','范':'範','荐':'薦','荣':'榮','药':'藥','获':'獲','莱':'萊','营':'營','萧':'蕭','萨':'薩','落':'落','著':'著','葛':'葛','蒋':'蔣','蓝':'藍','蔑':'蔑','虏':'虜','虑':'慮','虽':'雖','蚀':'蝕','蛮':'蠻','蜂':'蜂','蝶':'蝶','融':'融','血':'血','行':'行','术':'術','街':'街','衡':'衡','补':'補','表':'表','袭':'襲','装':'裝','裁':'裁','裤':'褲','西':'西','观':'觀','规':'規','视':'視','览':'覽','觉':'覺','角':'角','解':'解','触':'觸','言':'言','誉':'譽','认':'認','让':'讓','议':'議','讯':'訊','记':'記','讲':'講','许':'許','论':'論','设':'設','访':'訪','证':'證','评':'評','识':'識','诉':'訴','词':'詞','译':'譯','试':'試','诗':'詩','话':'話','该':'該','详':'詳','语':'語','误':'誤','说':'說','请':'請','诸':'諸','读':'讀','课':'課','调':'調','谁':'誰','谈':'談','谊':'誼','谋':'謀','谓':'謂','谜':'謎','谢':'謝','谨':'謹','谱':'譜','谷':'谷','豆':'豆','象':'象','贝':'貝','负':'負','贡':'貢','财':'財','责':'責','贤':'賢','败':'敗','账':'賬','货':'貨','质':'質','贩':'販','贪':'貪','购':'購','贯':'貫','贱':'賤','贴':'貼','贵':'貴','贷':'貸','贸':'貿','费':'費','贺':'賀','贼':'賊','贾':'賈','资':'資','赋':'賦','赌':'賭','赎':'贖','赏':'賞','赐':'賜','赔':'賠','赖':'賴','赚':'賺','赛':'賽','赞':'贊','赠':'贈','赢':'贏','赤':'赤','赵':'趙','趋':'趨','越':'越','趣':'趣','足':'足','跃':'躍','跟':'跟','路':'路','跳':'跳','践':'踐','踪':'蹤','身':'身','车':'車','轨':'軌','轩':'軒','转':'轉','轮':'輪','软':'軟','轰':'轟','轻':'輕','载':'載','较':'較','辅':'輔','辆':'輛','辈':'輩','辉':'輝','辑':'輯','输':'輸','辛':'辛','辞':'辭','辩':'辯','农':'農','边':'邊','达':'達','迁':'遷','过':'過','迈':'邁','运':'運','还':'還','这':'這','进':'進','远':'遠','违':'違','连':'連','迟':'遲','迹':'跡','适':'適','选':'選','逊':'遜','递':'遞','通':'通','逻':'邏','遍':'遍','道':'道','遗':'遺','邓':'鄧','邮':'郵','邻':'鄰','郑':'鄭','郭':'郭','都':'都','鄂':'鄂','酒':'酒','酬':'酬','酱':'醬','释':'釋','里':'里','重':'重','野':'野','量':'量','金':'金','针':'針','钉':'釘','钓':'釣','钟':'鐘','钢':'鋼','钦':'欽','钱':'錢','钻':'鑽','铁':'鐵','铃':'鈴','铜':'銅','铝':'鋁','铭':'銘','银':'銀','铺':'鋪','链':'鏈','销':'銷','锁':'鎖','锋':'鋒','锐':'銳','错':'錯','锡':'錫','锦':'錦','键':'鍵','锻':'鍛','镇':'鎮','镜':'鏡','长':'長','门':'門','闪':'閃','闭':'閉','问':'問','闯':'闖','闲':'閒','间':'間','闷':'悶','闹':'鬧','闻':'聞','阀':'閥','阁':'閣','阅':'閱','阐':'闡','队':'隊','阳':'陽','阴':'陰','阵':'陣','阶':'階','际':'際','陆':'陸','陈':'陳','陕':'陝','险':'險','随':'隨','隐':'隱','隶':'隸','隻':'隻','雄':'雄','雅':'雅','集':'集','雇':'僱','雕':'雕','难':'難','雾':'霧','霉':'霉','青':'青','靖':'靖','静':'靜','非':'非','靠':'靠','面':'面','革':'革','鞋':'鞋','韦':'韋','韩':'韓','音':'音','页':'頁','顶':'頂','项':'項','顺':'順','须':'須','顽':'頑','顾':'顧','顿':'頓','颁':'頒','预':'預','领':'領','颇':'頗','频':'頻','颗':'顆','题':'題','额':'額','风':'風','飘':'飄','飞':'飛','食':'食','饭':'飯','饮':'飲','饰':'飾','饱':'飽','饼':'餅','馆':'館','首':'首','香':'香','马':'馬','驱':'驅','驶':'駛','驻':'駐','驾':'駕','验':'驗','骂':'罵','骑':'騎','骗':'騙','骚':'騷','骤':'驟','高':'高','鬼':'鬼','魂':'魂','魏':'魏','鱼':'魚','鲁':'魯','鲜':'鮮','鸟':'鳥','鸡':'雞','鸣':'鳴','鸿':'鴻','鹅':'鵝','鹤':'鶴','鹰':'鷹','黄':'黃','黑':'黑','默':'默','鼓':'鼓','鼠':'鼠','鼻':'鼻','齐':'齊','齿':'齒','龄':'齡','龙':'龍','龟':'龜'};

        function convertToTraditional(text) {
            return text.split('').map(c => s2tMap[c] || c).join('');
        }

        // 獲取並顯示結果表格
        function fetchPronunciations(char) {
            fetchFromOriginal(char);
        }

        // 顯示結果表格
        function showResultTable(char, data) {
            var tableSection = document.getElementById('result-table-section');
            var tableBody = document.getElementById('result-table-body');

            if (!tableSection || !tableBody) {
                console.error('找不到表格元素');
                return;
            }

            var html = '';
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var homoChars = '-';
                if (item.homo) {
                    var chars = item.homo.split('').filter(function(c) { return c.trim(); });
                    homoChars = chars.map(function(h) {
                        return '<span class="homo-char" onclick="quickSearch(\\'' + h + '\\')">' + h + '</span>';
                    }).join('');
                }

                html += '<tr>';
                if (i === 0) {
                    html += '<td class="char-cell" rowspan="' + data.length + '">' + char + '</td>';
                }
                html += '<td><button class="pron-btn" onclick="playPronunciation(\\'' + item.pron + '\\', this)">' + item.pron + '</button></td>';
                html += '<td class="words-cell">' + (item.words || '-') + '</td>';
                html += '<td class="homo-cell">' + homoChars + '</td>';
                html += '</tr>';
            }

            tableBody.innerHTML = html;
            tableSection.style.display = 'block';
            console.log('表格已顯示，數據條數:', data.length);
        }

        // 播放讀音
        function playPronunciation(syllable, btn) {
            playSound(syllable);
            if (btn) {
                btn.classList.add('playing');
                setTimeout(() => btn.classList.remove('playing'), 300);
            }
        }

        // 快速搜索（從歷史或熱門點擊）
        function quickSearch(char) {
            document.getElementById('char-input').value = char;
            searchChar();
        }

        // ========== 歷史記錄功能 ==========
        const HISTORY_KEY = 'lexi-can-history';
        const MAX_HISTORY = 20;

        function getHistory() {
            try {
                return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            } catch {
                return [];
            }
        }

        function saveHistory(history) {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }

        function addToHistory(char) {
            let history = getHistory();
            // 移除重複項
            history = history.filter(h => h !== char);
            // 添加到開頭
            history.unshift(char);
            // 限制數量
            if (history.length > MAX_HISTORY) {
                history = history.slice(0, MAX_HISTORY);
            }
            saveHistory(history);
            renderHistory();
        }

        function clearHistory() {
            localStorage.removeItem(HISTORY_KEY);
            renderHistory();
        }

        function clearDataCache() {
            localStorage.removeItem(CACHE_KEY);
            console.log('數據緩存已清除');
        }

        function renderHistory() {
            const history = getHistory();
            const listEl = document.getElementById('history-list');
            const emptyEl = document.getElementById('history-empty');
            const clearBtn = document.getElementById('clear-history-btn');

            if (history.length === 0) {
                listEl.innerHTML = '';
                emptyEl.style.display = 'inline';
                clearBtn.style.display = 'none';
            } else {
                emptyEl.style.display = 'none';
                clearBtn.style.display = 'inline-block';
                listEl.innerHTML = history.map(char =>
                    \`<button class="history-btn" onclick="quickSearch('\${char}')">\${char}</button>\`
                ).join('');
            }
        }

        // ========== 熱門搜索功能 ==========
        function loadHotSearches() {
            const hotList = document.getElementById('hot-list');
            hotList.innerHTML = '<span style="color:#999;font-size:0.8em;">載入中...</span>';

            // 通過隱藏 iframe 加載熱門頁面
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/just.php';

            iframe.onload = function() {
                try {
                    // 由於跨域限制，無法直接讀取內容
                    // 使用預設的熱門字作為備選
                    showFallbackHotSearches();
                } catch (e) {
                    showFallbackHotSearches();
                }
                document.body.removeChild(iframe);
            };

            iframe.onerror = function() {
                showFallbackHotSearches();
                document.body.removeChild(iframe);
            };

            document.body.appendChild(iframe);

            // 3秒超時
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    showFallbackHotSearches();
                    document.body.removeChild(iframe);
                }
            }, 3000);
        }

        function showFallbackHotSearches() {
            // 常用字 + 隨機選取一些有趣的字
            const commonChars = ['的', '是', '不', '了', '人', '我', '有', '他', '這', '中',
                                 '大', '來', '上', '國', '個', '到', '說', '們', '為', '子',
                                 '和', '你', '地', '出', '道', '也', '時', '年', '得', '就'];
            const interestingChars = ['龍', '鳳', '愛', '福', '樂', '香', '港', '粵', '語', '音',
                                      '字', '文', '學', '書', '讀', '寫', '聽', '講', '廣', '東'];

            // 隨機選取12個字
            const allChars = [...commonChars, ...interestingChars];
            const shuffled = allChars.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 12);

            const hotList = document.getElementById('hot-list');
            hotList.innerHTML = selected.map(char =>
                \`<button class="hot-btn" onclick="quickSearch('\${char}')">\${char}</button>\`
            ).join('');
        }

        // 粵音搜索
        function searchPhon() {
            const s1 = document.getElementById('initial').value;
            const s2 = document.getElementById('final').value;
            const s3 = document.getElementById('tone').value;

            if (s1 === '-' && s2 === '-' && s3 === '-') {
                alert('請至少選擇一個搜索條件');
                return;
            }

            showLoading();

            // 使用隱藏表單提交
            // 注意："-" 表示不限定（不傳參數），"" 表示明確選擇「無」
            const h1 = document.getElementById('hidden-s1');
            const h2 = document.getElementById('hidden-s2');
            const h3 = document.getElementById('hidden-s3');

            // 禁用未選擇的字段（不傳參數=不限定）
            h1.disabled = (s1 === '-');
            h2.disabled = (s2 === '-');
            h3.disabled = (s3 === '-');

            // 設置已選擇的值（包括空字符串表示「無」）
            if (s1 !== '-') h1.value = s1;
            if (s2 !== '-') h2.value = s2;
            if (s3 !== '-') h3.value = s3;

            document.getElementById('hidden-phon-form').submit();

            // 更新原網站鏈接
            const params = [];
            if (s1 !== '-') params.push(\`s1=\${s1}\`);
            if (s2 !== '-') params.push(\`s2=\${s2}\`);
            if (s3 !== '-') params.push(\`s3=\${s3}\`);
            document.getElementById('original-link').href =
                \`https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/pho-rel.php?\${params.join('&')}\`;
        }

        // 快速粵音搜索
        function quickPhonSearch(s1, s2, s3) {
            document.getElementById('initial').value = s1;
            document.getElementById('final').value = s2;
            document.getElementById('tone').value = s3;
            searchPhon();
        }

        // 顯示載入動畫
        function showLoading() {
            document.getElementById('loading').classList.add('show');
            document.getElementById('result-frame').style.opacity = '0.3';
        }

        // 隱藏載入動畫
        function hideLoading() {
            document.getElementById('loading').classList.remove('show');
            document.getElementById('result-frame').style.opacity = '1';
        }

        // 更新框架（用於功能鏈接）
        function updateFrame(url) {
            showLoading();
            document.getElementById('original-link').href = url;
            document.getElementById('result-frame').src = url;
            return false; // 阻止默認的 target 行為
        }

        // iframe 加載完成
        document.getElementById('result-frame').onload = function() {
            hideLoading();
        };

        // ========== 發音播放功能 ==========
        const SOUND_BASE_URL = 'https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/sound/';
        let currentAudio = null;

        function playSound(syllable) {
            if (!syllable) return;

            syllable = syllable.trim().toLowerCase();

            // 停止當前正在播放的音頻
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }

            // 播放新音頻
            const url = SOUND_BASE_URL + syllable + '.wav';
            currentAudio = new Audio(url);

            currentAudio.play().catch(function(e) {
                console.log('播放失敗:', e);
            });
        }

        // ========== 主題切換功能 ==========
        const THEME_KEY = 'lexi-can-theme';

        function getSystemTheme() {
            // 根據時間判斷：18:00-06:00 為夜間
            const hour = new Date().getHours();
            return (hour >= 18 || hour < 6) ? 'dark' : 'light';
        }

        function getSavedTheme() {
            return localStorage.getItem(THEME_KEY);
        }

        function saveTheme(theme) {
            localStorage.setItem(THEME_KEY, theme);
        }

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('theme-toggle').textContent = '☀️';
                document.getElementById('theme-toggle').title = '切換到日間模式';
            } else {
                document.documentElement.removeAttribute('data-theme');
                document.getElementById('theme-toggle').textContent = '🌙';
                document.getElementById('theme-toggle').title = '切換到夜間模式';
            }
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            saveTheme(newTheme);
        }

        function initTheme() {
            const savedTheme = getSavedTheme();
            if (savedTheme) {
                // 使用保存的主題
                applyTheme(savedTheme);
            } else {
                // 根據時間自動切換
                applyTheme(getSystemTheme());
            }
        }

        // 頁面加載時初始化 - 直接執行，因為腳本執行時 DOM 已經準備好
        (function initPage() {
            // 使用 setTimeout 確保 DOM 完全準備好
            setTimeout(function() {
                try {
                    // 清除可能有問題的舊緩存（一次性）
                    var cacheVersion = localStorage.getItem('lexi-can-cache-version');
                    if (cacheVersion !== 'v2') {
                        localStorage.removeItem('lexi-can-cache');
                        localStorage.setItem('lexi-can-cache-version', 'v2');
                        console.log('已清除舊版緩存');
                    }

                    initTheme();
                    var charInput = document.getElementById('char-input');
                    if (charInput) charInput.focus();
                    renderHistory();
                    loadHotSearches();

                    // 檢查 GM 函數
                    console.log('GM_xmlhttpRequest 可用:', typeof window._GM_xmlhttpRequest === 'function');
                    console.log('頁面初始化完成');
                } catch(e) {
                    console.error('初始化錯誤:', e);
                }
            }, 0);
        })();
<\/script>
</body>
</html>`;

    // 保存 GM 函数引用到 unsafeWindow（页面的真实 window）
    const savedGmXhr = GM_xmlhttpRequest;
    unsafeWindow._GM_xmlhttpRequest = savedGmXhr;

    // 等待 DOM 准备好后替换
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceDocument);
    } else {
        replaceDocument();
    }

    function replaceDocument() {
        // 使用 document.open/write/close 来替换整个文档
        document.open();
        document.write(newHTML);
        document.close();

        // 替换完成后，确保 GM 函数可用
        // unsafeWindow 在 document.write 后仍然保持引用
        unsafeWindow._GM_xmlhttpRequest = savedGmXhr;
        window._GM_xmlhttpRequest = savedGmXhr;
    }

})();
