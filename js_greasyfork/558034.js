// ==UserScript==
// @name         高校考试网小助手
// @namespace    https://github.com/EchoPing07/gaoxiaokaoshi-helper
// @version      2.0
// @description  自动播放高校考试网视频课程，支持自动翻页、进度显示、自动答题、题库收录。基于 Yiero 和 Aisen 原版重构，优化UI和用户体验
// @author       claude-opus-4-5-20251101 (原作者: Yiero, Aisen)
// @match        *://www.gaoxiaokaoshi.com/*
// @match        *://*.gaoxiaokaoshi.com/*
// @run-at       document-start
// @license      MIT
// @original-script-1 https://greasyfork.org/scripts/463301
// @original-author-1 Yiero
// @original-script-2 https://greasyfork.org/scripts/404599
// @original-author-2 Aisen
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558034/%E9%AB%98%E6%A0%A1%E8%80%83%E8%AF%95%E7%BD%91%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558034/%E9%AB%98%E6%A0%A1%E8%80%83%E8%AF%95%E7%BD%91%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
 * 高校考试网小助手
 * 
 * 原作者: 
 *   - Yiero (自动刷课功能)
 *     原项目: https://greasyfork.org/scripts/463301
 *     原仓库: https://github.com/AliubYiero/TemperScripts (已失效)
 *   
 *   - Aisen (自动答题、题库功能)
 *     原项目: https://greasyfork.org/scripts/404599
 * 
 * 修改者： claude-opus-4-5-20251101
 * 修改内容: UI重构、功能整合、添加控制面板、优化用户体验
 * 
 * MIT License - 保留原作者署名
 */
 
(function() {
    'use strict';

    try {
        Object.defineProperty(window, 'confirm', {
            value: function(msg) {
                console.log('[小助手] 拦截confirm: ' + msg);
                return true;
            },
            writable: false,
            configurable: false
        });

        Object.defineProperty(window, 'alert', {
            value: function(msg) {
                console.log('[小助手] 拦截alert: ' + msg);
            },
            writable: false,
            configurable: false
        });
    } catch(e) {
        window.confirm = function(msg) { return true; };
        window.alert = function(msg) {};
    }

    function main() {
        var pathname = window.location.pathname.toLowerCase();
        var href = window.location.href.toLowerCase();
        var pageType = 'unknown';

        if (pathname.indexOf('login.aspx') > -1) pageType = 'login';
        else if (pathname.indexOf('librarystudylist') > -1 || href.indexOf('librarystudylist') > -1) pageType = 'courseList';
        else if (pathname.indexOf('mainpage') > -1) pageType = 'main';
        else if (pathname.indexOf('examtmstepdo') > -1 || pathname.indexOf('examdo.aspx') > -1) pageType = 'exam';
        else if (pathname.indexOf('examtmstepheader') > -1) pageType = 'examHeader';
        else if (pathname.indexOf('exammessage') > -1) pageType = 'examMessage';
        else if (pathname.indexOf('viewexam') > -1) pageType = 'examView';

        console.log('[小助手] 页面类型: ' + pageType);

        if (pageType === 'main') initMainPage();
        else if (pageType === 'exam') initExamPage();
        else if (pageType === 'examHeader') initExamHeaderPage();
        else if (pageType === 'examMessage') initExamMessagePage();
        else if (pageType === 'examView') initExamViewPage();
        else if (pageType === 'login') initLoginPage();
    }

    function loadBank() {
        try { return JSON.parse(localStorage.getItem('题库') || '{}'); }
        catch(e) { return {}; }
    }

    function saveBank(bank) {
        localStorage.setItem('题库', JSON.stringify(bank));
    }

    function getBankCount() {
        return Object.keys(loadBank()).length;
    }

    function getAutoPlay() {
        return localStorage.getItem('gxks_autoPlay') === '1';
    }

    function setAutoPlay(value) {
        localStorage.setItem('gxks_autoPlay', value ? '1' : '0');
    }

    function getAutoExam() {
        return localStorage.getItem('gxks_autoExam') === '1';
    }

    function setAutoExam(value) {
        localStorage.setItem('gxks_autoExam', value ? '1' : '0');
    }

    function getLogs() {
        try { return JSON.parse(localStorage.getItem('gxks_logs') || '[]'); }
        catch(e) { return []; }
    }

    function addLog(msg, type) {
        var logs = getLogs();
        var time = new Date().toLocaleTimeString('zh-CN', {hour12: false});
        logs.unshift({time: time, message: msg, type: type || 'info'});
        if (logs.length > 50) logs.length = 50;
        localStorage.setItem('gxks_logs', JSON.stringify(logs));
    }

    function clearLogs() {
        localStorage.setItem('gxks_logs', '[]');
    }

    // 导出题库
    function exportBank() {
        var bank = loadBank();
        var count = Object.keys(bank).length;
        if (count === 0) {
            showToast('题库为空，无法导出');
            return;
        }
        var dataStr = JSON.stringify(bank, null, 2);
        var blob = new Blob([dataStr], {type: 'application/json'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = '题库_' + count + '题_' + new Date().toLocaleDateString().replace(/\//g, '-') + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addLog('导出题库: ' + count + '题', 'success');
        updateMainLogs();
        showToast('已导出 ' + count + ' 道题目');
    }

    // 导入题库（合并）
    function importBank() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var importedBank = JSON.parse(e.target.result);
                    var currentBank = loadBank();
                    var newCount = 0;
                    for (var key in importedBank) {
                        if (importedBank.hasOwnProperty(key) && !currentBank[key]) {
                            currentBank[key] = importedBank[key];
                            newCount++;
                        }
                    }
                    saveBank(currentBank);
                    updateBankCount();
                    addLog('导入题库: 新增' + newCount + '题，共' + Object.keys(currentBank).length + '题', 'success');
                    updateMainLogs();
                    showToast('导入成功，新增 ' + newCount + ' 道题目');
                } catch(err) {
                    addLog('导入失败: 文件格式错误', 'error');
                    updateMainLogs();
                    showToast('导入失败，文件格式错误');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    var PRIMARY = '#6bb3ff';
    var GRADIENT = 'linear-gradient(135deg, #6bb3ff 0%, #4a9fef 100%)';
    var LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /></svg>';

    function injectStyles() {
        if (document.getElementById('gxks-styles')) return;
        var style = document.createElement('style');
        style.id = 'gxks-styles';
        style.textContent = '.gxks-panel{position:fixed;right:20px;top:100px;width:320px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;z-index:99999;user-select:none}.gxks-card{background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.12);overflow:hidden}.gxks-header{background:'+GRADIENT+';padding:16px 18px;display:flex;align-items:center;justify-content:space-between;cursor:move}.gxks-header-left{display:flex;align-items:center;gap:12px}.gxks-logo{width:32px;height:32px;background:rgba(255,255,255,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff}.gxks-header-title{color:#fff;font-size:15px;font-weight:600}.gxks-btn-icon{width:30px;height:30px;border:none;background:rgba(255,255,255,.2);border-radius:8px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px}.gxks-btn-icon:hover{background:rgba(255,255,255,.3)}.gxks-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:14px;background:#f8fafc}.gxks-stat-card{background:#fff;border-radius:10px;padding:12px 14px;box-shadow:0 1px 3px rgba(0,0,0,.05)}.gxks-stat-label{font-size:11px;color:#64748b;margin-bottom:6px}.gxks-stat-value{display:flex;align-items:baseline;gap:2px}.gxks-stat-current{font-size:24px;font-weight:700;color:'+PRIMARY+'}.gxks-stat-sep{font-size:14px;color:#94a3b8}.gxks-stat-total{font-size:18px;font-weight:600;color:#64748b}.gxks-stat-unit{font-size:11px;color:#94a3b8;margin-left:3px}.gxks-status{padding:12px 14px;display:flex;align-items:center;gap:10px;background:#f8fafc;border-top:1px solid #e2e8f0}.gxks-status-dot{width:10px;height:10px;border-radius:50%;background:#94a3b8}.gxks-status-dot.active{background:#22c55e;animation:gxks-pulse 2s infinite}.gxks-status-dot.error{background:#ef4444}@keyframes gxks-pulse{0%,100%{opacity:1}50%{opacity:.4}}.gxks-status-text{font-size:13px;color:#475569}.gxks-progress{padding:12px 14px;background:#fff;border-top:1px solid #e2e8f0}.gxks-progress-header{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px}.gxks-progress-label{color:#64748b}.gxks-progress-value{color:'+PRIMARY+';font-weight:600}.gxks-progress-bar{height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden}.gxks-progress-fill{height:100%;background:'+GRADIENT+';border-radius:3px;transition:width .3s}.gxks-control{padding:14px;background:#fff;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between}.gxks-control-left{display:flex;align-items:center;gap:8px;font-size:14px;color:#334155;font-weight:500}.gxks-switch{position:relative;width:46px;height:26px;cursor:pointer}.gxks-switch input{opacity:0;width:0;height:0}.gxks-switch-slider{position:absolute;inset:0;background:#cbd5e1;border-radius:26px;transition:.3s}.gxks-switch-slider:before{content:"";position:absolute;width:20px;height:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.3s;box-shadow:0 2px 4px rgba(0,0,0,.2)}.gxks-switch input:checked+.gxks-switch-slider{background:'+PRIMARY+'}.gxks-switch input:checked+.gxks-switch-slider:before{transform:translateX(20px)}.gxks-bank{padding:12px 14px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;align-items:center;gap:10px;font-size:13px;color:#64748b}.gxks-bank-count{font-weight:700;color:'+PRIMARY+'}.gxks-logs{max-height:180px;overflow-y:auto;background:#fff;border-top:1px solid #e2e8f0}.gxks-logs::-webkit-scrollbar{width:5px}.gxks-logs::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}.gxks-logs-header{padding:10px 14px;font-size:12px;font-weight:600;color:#64748b;display:flex;justify-content:space-between;position:sticky;top:0;background:#fff}.gxks-logs-clear{color:#94a3b8;cursor:pointer;padding:2px 6px;border-radius:4px}.gxks-logs-clear:hover{background:#f1f5f9}.gxks-logs-list{padding:0 14px 14px}.gxks-log-item{display:flex;gap:8px;padding:6px 8px;background:#f8fafc;border-radius:6px;margin-bottom:4px;font-size:11px}.gxks-log-time{color:#94a3b8;font-family:monospace;flex-shrink:0}.gxks-log-msg{color:#475569;word-break:break-all}.gxks-log-item.success .gxks-log-msg{color:#16a34a}.gxks-log-item.error .gxks-log-msg{color:#dc2626}.gxks-log-item.warning .gxks-log-msg{color:#d97706}.gxks-empty{padding:20px;text-align:center;color:#94a3b8;font-size:12px}.gxks-footer{padding:12px 14px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;gap:10px}.gxks-btn{flex:1;padding:10px;border:none;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}.gxks-btn-primary{background:'+PRIMARY+';color:#fff}.gxks-btn-primary:hover{background:#4a9fef}.gxks-btn-secondary{background:#fff;color:#475569;border:1px solid #e2e8f0}.gxks-btn-secondary:hover{background:#f1f5f9}.gxks-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);padding:12px 24px;background:#1e293b;color:#fff;border-radius:10px;font-size:14px;display:flex;align-items:center;gap:10px;opacity:0;transition:.3s;z-index:100000}.gxks-toast.show{transform:translateX(-50%) translateY(0);opacity:1}.gxks-mini{position:fixed;right:20px;top:100px;width:52px;height:52px;background:'+GRADIENT+';border:3px solid #fff;border-radius:50%;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 20px rgba(107,179,255,.4);z-index:99998}.gxks-mini:hover{transform:scale(1.1)}.gxks-mini svg{color:#fff}.gxks-panel.hidden{display:none}.gxks-panel.hidden+.gxks-mini{display:flex}.gxks-login-tip{padding:40px 20px;text-align:center}.gxks-login-text{font-size:15px;color:#64748b;margin-bottom:12px}.gxks-login-emoji{font-size:28px}.gxks-exam-panel{position:fixed;top:10px;right:10px;background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.15);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif;overflow:hidden;min-width:200px;max-width:280px}.gxks-exam-header{background:'+GRADIENT+';padding:6px 10px;color:#fff;font-size:12px;font-weight:600}.gxks-exam-body{padding:8px 10px}.gxks-exam-logs{max-height:150px;overflow-y:auto;font-size:11px}.gxks-exam-logs::-webkit-scrollbar{width:4px}.gxks-exam-logs::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}.gxks-exam-log{padding:4px 6px;background:#f8fafc;border-radius:4px;margin-bottom:3px;color:#475569;word-break:break-all}.gxks-exam-log.success{color:#16a34a;background:#f0fdf4}.gxks-exam-log.error{color:#dc2626;background:#fef2f2}.gxks-exam-log.warning{color:#d97706;background:#fffbeb}.gxks-exam-log.answer{color:#6366f1;background:#eef2ff}';
        document.head.appendChild(style);
    }

    var _panel = null;
    var _isCoursePage = false;

    function createMainPanel() {
        var isLogin = location.href.indexOf('Login.aspx') > -1;
        var autoPlay = getAutoPlay();
        var autoExam = getAutoExam();
        var bankCount = getBankCount();
        var panel = document.createElement('div');
        panel.className = 'gxks-panel';

        if (isLogin) {
            panel.innerHTML = '<div class="gxks-card"><div class="gxks-header"><div class="gxks-header-left"><div class="gxks-logo">'+LOGO_SVG+'</div><span class="gxks-header-title">小助手</span></div><button class="gxks-btn-icon" id="gxks-min">-</button></div><div class="gxks-login-tip"><div class="gxks-login-text">请先登录账号</div><div class="gxks-login-emoji">(*^_^*)</div></div></div>';
        } else {
            panel.innerHTML = '<div class="gxks-card"><div class="gxks-header" id="gxks-drag"><div class="gxks-header-left"><div class="gxks-logo">'+LOGO_SVG+'</div><span class="gxks-header-title">小助手</span></div><button class="gxks-btn-icon" id="gxks-min">-</button></div><div class="gxks-stats" id="gxks-stats" style="display:'+(_isCoursePage?'grid':'none')+'"><div class="gxks-stat-card"><div class="gxks-stat-label">课程页码</div><div class="gxks-stat-value"><span class="gxks-stat-current" id="page-cur">1</span><span class="gxks-stat-sep">/</span><span class="gxks-stat-total" id="page-total">1</span><span class="gxks-stat-unit">页</span></div></div><div class="gxks-stat-card"><div class="gxks-stat-label">本页进度</div><div class="gxks-stat-value"><span class="gxks-stat-current" id="course-done">0</span><span class="gxks-stat-sep">/</span><span class="gxks-stat-total" id="course-total">0</span><span class="gxks-stat-unit">课</span></div></div></div><div class="gxks-status"><div class="gxks-status-dot" id="status-dot"></div><span class="gxks-status-text" id="status-text">就绪</span></div><div class="gxks-progress" id="progress-box" style="display:none"><div class="gxks-progress-header"><span class="gxks-progress-label">视频进度</span><span class="gxks-progress-value" id="progress-val">0%</span></div><div class="gxks-progress-bar"><div class="gxks-progress-fill" id="progress-fill"></div></div></div><div class="gxks-control"><div class="gxks-control-left">自动刷课</div><label class="gxks-switch"><input type="checkbox" id="sw-play" '+(autoPlay?'checked':'')+'><span class="gxks-switch-slider"></span></label></div><div class="gxks-control"><div class="gxks-control-left">自动答题</div><label class="gxks-switch"><input type="checkbox" id="sw-exam" '+(autoExam?'checked':'')+'><span class="gxks-switch-slider"></span></label></div><div class="gxks-bank"><span>题库已收录</span><span class="gxks-bank-count" id="bank-count">'+bankCount+'</span><span>道题目</span></div><div class="gxks-logs"><div class="gxks-logs-header"><span>运行日志</span><span class="gxks-logs-clear" id="clear-logs">清空</span></div><div class="gxks-logs-list" id="logs-list"><div class="gxks-empty">暂无日志</div></div></div><div class="gxks-footer"><button class="gxks-btn gxks-btn-secondary" id="import-bank">导入题库</button><button class="gxks-btn gxks-btn-primary" id="export-bank">导出题库</button></div></div>';
        }

        document.body.appendChild(panel);
        _panel = panel;

        var mini = document.createElement('div');
        mini.className = 'gxks-mini';
        mini.innerHTML = LOGO_SVG;
        mini.onclick = function() { _panel.classList.toggle('hidden'); };
        document.body.appendChild(mini);

        initDrag();
        bindMainEvents();
        updateMainLogs();

        window.addEventListener('storage', function(e) {
            if (e.key === 'gxks_logs') updateMainLogs();
            if (e.key === '题库') updateBankCount();
        });
    }

    function initDrag() {
        var handle = document.getElementById('gxks-drag');
        if (!handle) return;
        var dragging = false, ox = 0, oy = 0;
        handle.onmousedown = function(e) {
            if (e.target.className && e.target.className.indexOf('gxks-btn-icon') > -1) return;
            dragging = true;
            var rect = _panel.getBoundingClientRect();
            ox = e.clientX - rect.left;
            oy = e.clientY - rect.top;
            e.preventDefault();
        };
        document.onmousemove = function(e) {
            if (!dragging) return;
            var x = Math.max(0, Math.min(e.clientX - ox, innerWidth - _panel.offsetWidth));
            var y = Math.max(0, Math.min(e.clientY - oy, innerHeight - _panel.offsetHeight));
            _panel.style.left = x + 'px';
            _panel.style.top = y + 'px';
            _panel.style.right = 'auto';
        };
        document.onmouseup = function() { dragging = false; };
    }

    function bindMainEvents() {
        var minBtn = document.getElementById('gxks-min');
        if (minBtn) minBtn.onclick = function() { _panel.classList.toggle('hidden'); };

        var clearLogsBtn = document.getElementById('clear-logs');
        if (clearLogsBtn) clearLogsBtn.onclick = function() {
            clearLogs();
            updateMainLogs();
            showToast('日志已清空');
        };

        var importBtn = document.getElementById('import-bank');
        if (importBtn) importBtn.onclick = importBank;

        var exportBtn = document.getElementById('export-bank');
        if (exportBtn) exportBtn.onclick = exportBank;

        var swPlay = document.getElementById('sw-play');
        if (swPlay) swPlay.onchange = function(e) {
            setAutoPlay(e.target.checked);
            addLog(e.target.checked ? '自动刷课已开启' : '自动刷课已关闭', e.target.checked ? 'success' : 'warning');
            updateMainLogs();
            showToast(e.target.checked ? '自动刷课已开启' : '自动刷课已关闭');
            // 修复：开启时立即启动自动播放
            if (e.target.checked) {
                var iframe = document.getElementById('mainIframe');
                if (iframe && (iframe.src || '').toLowerCase().indexOf('librarystudylist') > -1) {
                    startAutoPlay(iframe);
                }
            } else {
                // 关闭时停止所有定时器和视频
                if (videoTimer) { clearInterval(videoTimer); videoTimer = null; }
                if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
                if (syncTimer) { clearInterval(syncTimer); syncTimer = null; }
                if (currentVideo) {
                    try { currentVideo.pause(); } catch(e) {}
                }
            }
        };

        var swExam = document.getElementById('sw-exam');
        if (swExam) swExam.onchange = function(e) {
            setAutoExam(e.target.checked);
            addLog(e.target.checked ? '自动答题已开启' : '自动答题已关闭', e.target.checked ? 'success' : 'warning');
            updateMainLogs();
            showToast(e.target.checked ? '自动答题已开启' : '自动答题已关闭');
        };
    }

    function setStatus(type, text) {
        var dot = document.getElementById('status-dot');
        var txt = document.getElementById('status-text');
        if (dot) dot.className = 'gxks-status-dot ' + type;
        if (txt) txt.textContent = text;
    }

    function setPage(cur, total) {
        var c = document.getElementById('page-cur');
        var t = document.getElementById('page-total');
        if (c) c.textContent = cur;
        if (t) t.textContent = total;
    }

    function setCourse(done, total) {
        var d = document.getElementById('course-done');
        var t = document.getElementById('course-total');
        if (d) d.textContent = done;
        if (t) t.textContent = total;
    }

    function setProgress(percent, show) {
        var box = document.getElementById('progress-box');
        var fill = document.getElementById('progress-fill');
        var val = document.getElementById('progress-val');
        if (box) box.style.display = (show !== false) ? 'block' : 'none';
        if (fill) fill.style.width = percent + '%';
        if (val) val.textContent = percent + '%';
    }

    function updateBankCount() {
        var el = document.getElementById('bank-count');
        if (el) el.textContent = getBankCount();
    }

    function showStats(show) {
        var el = document.getElementById('gxks-stats');
        if (el) el.style.display = show ? 'grid' : 'none';
        _isCoursePage = show;
    }

    function updateMainLogs() {
        var list = document.getElementById('logs-list');
        if (!list) return;
        var logs = getLogs();
        if (!logs.length) {
            list.innerHTML = '<div class="gxks-empty">暂无日志</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < Math.min(logs.length, 20); i++) {
            var l = logs[i];
            html += '<div class="gxks-log-item ' + l.type + '"><span class="gxks-log-time">' + l.time + '</span><span class="gxks-log-msg">' + l.message + '</span></div>';
        }
        list.innerHTML = html;
    }

    function showToast(msg) {
        var old = document.querySelector('.gxks-toast');
        if (old) old.remove();
        var t = document.createElement('div');
        t.className = 'gxks-toast';
        t.innerHTML = '<span>' + msg + '</span>';
        document.body.appendChild(t);
        setTimeout(function() { t.classList.add('show'); }, 10);
        setTimeout(function() {
            t.classList.remove('show');
            setTimeout(function() { t.remove(); }, 300);
        }, 2500);
    }

    function initMainPage() {
        setTimeout(function() {
            injectStyles();
            var iframe = document.getElementById('mainIframe');
            var isCoursePage = function() {
                try { return (iframe && iframe.src || '').toLowerCase().indexOf('librarystudylist') > -1; }
                catch(e) { return false; }
            };
            _isCoursePage = isCoursePage();
            createMainPanel();

            if (iframe) {
                new MutationObserver(function() {
                    var isCourse = isCoursePage();
                    showStats(isCourse);
                    if (isCourse) setTimeout(function() { getCourseInfo(iframe); }, 1000);
                }).observe(iframe, {attributes: true, attributeFilter: ['src']});

                iframe.addEventListener('load', function() {
                    var isCourse = isCoursePage();
                    showStats(isCourse);
                    if (isCourse) {
                        setTimeout(function() {
                            getCourseInfo(iframe);
                            if (getAutoPlay()) startAutoPlay(iframe);
                        }, 1000);
                    }
                });

                if (isCoursePage()) {
                    setTimeout(function() {
                        getCourseInfo(iframe);
                        if (getAutoPlay()) startAutoPlay(iframe);
                    }, 2000);
                }
            }
        }, 1000);
    }

    function getCourseInfo(iframe) {
        try {
            var doc = iframe.contentWindow.document;
            var pageEl = doc.querySelector('.page .fright ul li');
            if (pageEl) {
                var m = pageEl.innerText.match(/(\d+)\s*\/\s*(\d+)/);
                if (m) setPage(m[1], m[2]);
            }
            var rows = doc.querySelectorAll('tr');
            var total = rows.length - 1, done = 0;
            for (var i = 1; i < rows.length; i++) {
                if (rows[i].children[4] && rows[i].children[4].innerText === '已完成') done++;
            }
            setCourse(done, total);
        } catch(e) {}
    }

    // ============================================================
    // 修复：自动刷课相关变量和函数
    // ============================================================
    var videoTimer = null;
    var checkTimer = null;
    var syncTimer = null;
    var currentVideo = null;
    var currentCourse = null;  // 修复：添加当前课程信息存储
    var checkVideoCounter = 0;  // 修复：添加重试计数器
    var examViewWindow = null;  // 修复：添加考试视图窗口引用

    // 修复：解析课程行信息
    function parseCourseRow(row) {
        var cells = row.children;
        if (!cells || cells.length < 6) return null;
        
        var course = {
            name: cells[0] ? cells[0].innerText.trim() : '',
            type: cells[1] ? cells[1].innerText.trim() : '',
            totalTime: cells[2] ? cells[2].innerText.trim() : '',
            studiedTime: cells[3] ? cells[3].innerText.trim() : '',
            state: cells[4] ? cells[4].innerText.trim() : '',
            studyBtn: cells[5] && cells[5].children[0] ? cells[5].children[0] : null
        };
        
        return course;
    }

    // 修复：获取页面信息
    function getPageInfo(iframe) {
        try {
            var doc = iframe.contentWindow.document;
            var pageEl = doc.querySelector('.page .fright ul li');
            if (pageEl) {
                var m = pageEl.innerText.match(/(\d+)\s*\/\s*(\d+)/);
                if (m) return { current: parseInt(m[1]), total: parseInt(m[2]) };
            }
        } catch(e) {}
        return { current: 1, total: 1 };
    }

    // 修复：跳转下一页
    function jumpNextPage(iframe) {
        try {
            var doc = iframe.contentWindow.document;
            var nextBtn = doc.getElementById('PageSplit1_BtnNext');
            if (nextBtn && !nextBtn.disabled) {
                var pageInfo = getPageInfo(iframe);
                addLog('跳转到第 ' + (pageInfo.current + 1) + ' 页', 'info');
                updateMainLogs();
                nextBtn.click();
                return true;
            }
        } catch(e) {}
        return false;
    }

    function startAutoPlay(iframe) {
        if (!getAutoPlay()) return;
        
        // 修复：清理之前的定时器
        if (videoTimer) { clearInterval(videoTimer); videoTimer = null; }
        if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
        if (syncTimer) { clearInterval(syncTimer); syncTimer = null; }
        checkVideoCounter = 0;
        currentCourse = null;
        examViewWindow = null;
        
        setStatus('active', '查找未学习视频...');
        addLog('开始自动刷课', 'success');
        updateMainLogs();
        
        try {
            var doc = iframe.contentWindow.document;
            var rows = doc.querySelectorAll('tr');
            
            // 修复：遍历查找未完成的课程
            for (var i = 1; i < rows.length; i++) {
                var course = parseCourseRow(rows[i]);
                if (!course || !course.studyBtn) continue;
                
                if (course.state !== '已完成') {
                    currentCourse = course;  // 修复：保存当前课程信息
                    setStatus('active', '加载: ' + course.name);
                    addLog('播放: ' + course.name, 'info');
                    updateMainLogs();
                    
                    // 修复：点击学习按钮后等待视频加载
                    setTimeout(function() {
                        course.studyBtn.click();
                        // 修复：等待iframe加载后获取视频
                        setTimeout(function() {
                            getVideoAndPlay();
                        }, 3000);
                    }, 1000);
                    return;
                }
            }
            
            // 修复：当前页全部完成，尝试跳转下一页
            var pageInfo = getPageInfo(iframe);
            if (pageInfo.current < pageInfo.total) {
                if (jumpNextPage(iframe)) {
                    // 等待页面加载后继续
                    setTimeout(function() {
                        startAutoPlay(iframe);
                    }, 2000);
                    return;
                }
            }
            
            // 全部完成
            setStatus('active', '🎉 全部完成');
            addLog('所有视频已观看完成', 'success');
            updateMainLogs();
            showToast('🎉 恭喜！所有视频已观看完成');
            
        } catch(e) {
            setStatus('error', '获取课程失败');
            addLog('获取课程列表失败: ' + e.message, 'error');
            updateMainLogs();
        }
    }

    // 修复：获取视频并播放
    function getVideoAndPlay() {
        if (!getAutoPlay()) return;
        
        var examView = document.getElementById('ExamView');
        if (!examView) {
            addLog('未找到视频容器，2秒后重试', 'warning');
            updateMainLogs();
            setTimeout(getVideoAndPlay, 2000);
            return;
        }
        
        try {
            examViewWindow = examView.contentWindow;
            currentVideo = examViewWindow.document.querySelector('video');
            
            if (!currentVideo) {
                addLog('视频加载中，2秒后重试', 'info');
                updateMainLogs();
                setTimeout(getVideoAndPlay, 2000);
                return;
            }
            
            // 修复：启动视频播放检查定时器
            checkVideoCounter = 0;
            checkTimer = setInterval(checkVideoPlay, 1000);
            
        } catch(e) {
            addLog('获取视频失败: ' + e.message, 'error');
            updateMainLogs();
            setTimeout(getVideoAndPlay, 2000);
        }
    }

    // 修复：检查视频播放状态（参考原版逻辑）
    function checkVideoPlay() {
        if (!getAutoPlay()) {
            if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
            return;
        }
        
        // 修复：重试次数限制
        if (checkVideoCounter++ >= 8) {
            if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
            setStatus('error', '视频加载失败，正在重试...');
            addLog('视频加载超时，重新加载页面', 'warning');
            updateMainLogs();
            reloadAndContinue();
            return;
        }
        
        if (!currentVideo) {
            try {
                var examView = document.getElementById('ExamView');
                if (examView && examView.contentWindow) {
                    examViewWindow = examView.contentWindow;
                    currentVideo = examViewWindow.document.querySelector('video');
                }
            } catch(e) {}
            return;
        }
        
        // 修复：视频暂停时尝试播放
        if (currentVideo.paused) {
            try {
                currentVideo.play();
                currentVideo.volume = 0;
                
                // 修复：跳转到已学习的时间点（关键修复）
                if (currentCourse && currentCourse.studiedTime) {
                    var studiedMinutes = parseInt(currentCourse.studiedTime.split('分钟')[0]) || 0;
                    if (studiedMinutes > 0) {
                        setTimeout(function() {
                            if (currentVideo) {
                                currentVideo.currentTime = studiedMinutes * 60;
                                addLog('跳转到 ' + studiedMinutes + ' 分钟处继续播放', 'info');
                                updateMainLogs();
                            }
                        }, 1000);
                    }
                }
                
                // 修复：点击播放器容器确保播放（关键修复）
                try {
                    var player = examViewWindow.document.querySelector('#J_prismPlayer');
                    if (player) player.click();
                } catch(e) {}
                
            } catch(e) {
                addLog('播放失败: ' + e.message, 'error');
                updateMainLogs();
            }
        } else {
            // 修复：视频正在播放，停止检查定时器，启动监控
            if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
            
            var courseName = currentCourse ? currentCourse.name : '未知课程';
            setStatus('active', '正在播放: ' + courseName);
            addLog('开始播放: ' + courseName, 'success');
            updateMainLogs();
            setProgress(0, true);
            
            // 修复：设置视频事件监听
            setupVideoEvents();
            
            // 修复：启动进度更新和数据同步检查
            startVideoMonitor();
        }
    }

    // 修复：设置视频事件监听
    function setupVideoEvents() {
        if (!currentVideo) return;
        
        // 修复：视频结束事件
        currentVideo.onended = function() {
            if (!getAutoPlay()) return;
            var courseName = currentCourse ? currentCourse.name : '未知课程';
            addLog('视频播放完成： ' + courseName, 'success');
            updateMainLogs();
            showToast('✅ 视频播放完成');
            reloadAndContinue();
        };
        
        // 修复：视频暂停事件（可能是网站检测导致）
        currentVideo.onpause = function() {
            if (!getAutoPlay()) return;
            // 修复：暂停后尝试重新播放
            setTimeout(function() {
                if (currentVideo && currentVideo.paused && getAutoPlay()) {
                    try {
                        currentVideo.play();
                    } catch(e) {
                        reloadAndContinue();
                    }
                }
            }, 1000);
        };
        
        // 修复：视频错误事件
        currentVideo.onerror = function() {
            if (!getAutoPlay()) return;
            addLog('视频播放错误，重新加载', 'error');
            updateMainLogs();
            reloadAndContinue();
        };
    }

    // 修复：启动视频监控（进度更新 + 数据同步检查）
    function startVideoMonitor() {
        // 修复：进度更新定时器
        if (videoTimer) clearInterval(videoTimer);
        videoTimer = setInterval(function() {
            if (!currentVideo || !getAutoPlay()) {
                if (videoTimer) { clearInterval(videoTimer); videoTimer = null; }
                return;
            }
            
            try {
                var current = currentVideo.currentTime || 0;
                var total = currentVideo.duration || 0;
                if (total > 0) {
                    var percent = Math.round((current / total) * 100);
                    setProgress(percent, true);
                }
                
                // 更新课程统计
                var iframe = document.getElementById('mainIframe');
                if (iframe) getCourseInfo(iframe);
                
            } catch(e) {}
        }, 3000);
        
        // 修复：数据同步检查定时器（关键修复 - 参考原版）
        if (syncTimer) clearInterval(syncTimer);
        var lastSyncTime = '';
        syncTimer = setInterval(function() {
            if (!getAutoPlay() || !examViewWindow) {
                if (syncTimer) { clearInterval(syncTimer); syncTimer = null; }
                return;
            }
            
            try {
                // 修复：检查服务器时间是否在变化（原版的关键逻辑）
                var spTitle = examViewWindow.document.getElementById('spTitle');
                if (spTitle) {
                    var currentSyncTime = spTitle.innerText;
                    
                    if (lastSyncTime && lastSyncTime === currentSyncTime) {
                        // 数据没有同步，可能出现问题
                        addLog('数据同步异常，重新加载', 'warning');
                        updateMainLogs();
                        reloadAndContinue();
                        return;
                    }
                    
                    lastSyncTime = currentSyncTime;
                }
            } catch(e) {}
        }, 60000);  // 每分钟检查一次
    }

    // 修复：重新加载并继续播放
    function reloadAndContinue() {
        // 清理所有定时器
        if (videoTimer) { clearInterval(videoTimer); videoTimer = null; }
        if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
        if (syncTimer) { clearInterval(syncTimer); syncTimer = null; }
        
        // 重置状态
        checkVideoCounter = 0;
        currentVideo = null;
        examViewWindow = null;
        
        setStatus('active', '正在重新加载...');
        
        // 刷新页面
        location.reload();
    }

    function initLoginPage() {
        setTimeout(function() {
            injectStyles();
            createMainPanel();
        }, 500);
    }

    // ============================================================
    // 考试答题页面
    // ============================================================
    var examLogs = [];

    function addExamLog(msg, type) {
        var time = new Date().toLocaleTimeString('zh-CN', {hour12: false});
        examLogs.unshift({time: time, message: msg, type: type || 'info'});
        if (examLogs.length > 30) examLogs.length = 30;
        updateExamLogs();
        addLog(msg, type);
    }

    function updateExamLogs() {
        var container = document.getElementById('exam-logs');
        if (!container) return;
        if (!examLogs.length) {
            container.innerHTML = '<div class="gxks-exam-log">等待操作...</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < examLogs.length; i++) {
            var l = examLogs[i];
            html += '<div class="gxks-exam-log ' + l.type + '">' + l.time + ' ' + l.message + '</div>';
        }
        container.innerHTML = html;
    }

    function initExamPage() {
        injectStyles();
        var panel = document.createElement('div');
        panel.className = 'gxks-exam-panel';
        panel.innerHTML = '<div class="gxks-exam-header">答题助手</div><div class="gxks-exam-body"><div class="gxks-exam-logs" id="exam-logs"><div class="gxks-exam-log">等待操作...</div></div></div>';
        document.body.appendChild(panel);

        setTimeout(function() {
            doSearchAnswers();
        }, 1500);
    }

    function doSearchAnswers() {
        var bank = loadBank();
        var total = 0;
        var found = 0;
        var notFound = 0;
        var autoFill = getAutoExam();

        addExamLog('开始查询题库。..', 'info');

        // 修复：使用与原版相同的选择器获取题目
        var questions = document.querySelectorAll('.exam_list dt');
        if (questions.length === 0) {
            questions = document.querySelectorAll('.tb_content dt');
        }

        for (var i = 0; i < questions.length; i++) {
            total = i + 1;

            var text = questions[i].textContent || '';
            var q = '';
            // 修复：使用与原版相同的正则 /\d+\.(.*)\(/
            var m = text.match(/\d+\.(.*)\(/);
            if (m) {
                q = m[1].replace(/^\s+|\s+$/g, "");
            }

            var inputs = document.querySelectorAll('input[id^="tm_' + (i + 1) + '_"]');
            var checked = document.querySelector('input[id^="tm_' + (i + 1) + '_"]:checked');

            if (q && bank[q]) {
                var ans = bank[q];
                var ansText = ans.join('/');
                addExamLog('第' + (i + 1) + '题： ' + ansText, 'answer');
                found++;

                if (autoFill && !checked) {
                    for (var j = 0; j < inputs.length; j++) {
                        var label = document.querySelector('label[for="' + inputs[j].id + '"]');
                        if (label) {
                            var txt = (label.textContent || '').slice(2).trim();
                            if (ans.indexOf(txt) > -1 ||
                                (ans.indexOf('对') > -1 && txt.indexOf('对') > -1) ||
                                (ans.indexOf('错') > -1 && txt.indexOf('错') > -1) ||
                                (ans.indexOf('正确') > -1 && txt.indexOf('正确') > -1) ||
                                (ans.indexOf('错误') > -1 && txt.indexOf('错误') > -1)) {
                                inputs[j].click();
                                break;
                            }
                        }
                    }
                }
            } else {
                addExamLog('第' + (i + 1) + '题： 未收录', 'warning');
                notFound++;
            }
        }

        addExamLog('查询完成: ' + total + '题, 命中' + found + '题, 未收录' + notFound + '题', found > 0 ? 'success' : 'warning');

        if (autoFill) {
            addExamLog('已自动填写' + found + '题答案', 'success');
            localStorage.setItem('examAction', 'done:' + Date.now());
        }
    }

    // ============================================================
    // 考试顶部框架（交卷）
    // ============================================================
    var headerLogs = [];

    function addHeaderLog(msg, type) {
        var time = new Date().toLocaleTimeString('zh-CN', {hour12: false});
        headerLogs.unshift({time: time, message: msg, type: type || 'info'});
        if (headerLogs.length > 10) headerLogs.length = 10;
        updateHeaderLogs();
        addLog(msg, type);
    }

    function updateHeaderLogs() {
        var container = document.getElementById('header-logs');
        if (!container) return;
        var html = '';
        for (var i = 0; i < headerLogs.length; i++) {
            var l = headerLogs[i];
            html += '<div class="gxks-exam-log ' + l.type + '">' + l.time + ' ' + l.message + '</div>';
        }
        container.innerHTML = html;
    }

    function initExamHeaderPage() {
        injectStyles();
        var panel = document.createElement('div');
        panel.className = 'gxks-exam-panel';
        panel.innerHTML = '<div class="gxks-exam-header">交卷</div><div class="gxks-exam-body"><div class="gxks-exam-logs" id="header-logs"><div class="gxks-exam-log">等待答题完成...</div></div></div>';
        document.body.appendChild(panel);

        addHeaderLog('等待答题完成...', 'info');

        setInterval(function() {
            var action = localStorage.getItem('examAction');
            if (action && action.indexOf('done:') === 0) {
                var time = parseInt(action.split(':')[1]);
                if (Date.now() - time < 5000) {
                    localStorage.removeItem('examAction');
                    if (getAutoExam()) {
                        addHeaderLog('答题完成, 准备交卷...', 'success');
                        setTimeout(doSubmit, 2000);
                    }
                }
            }
        }, 1000);
    }

    function doSubmit() {
        addHeaderLog('正在交卷...', 'info');
        if (typeof window.SubmitExam === 'function') {
            window.SubmitExam();
        } else {
            var link = document.querySelector('a[href*="SubmitExam"]');
            if (link) link.click();
        }
    }

    // ============================================================
    // 交卷成功页面
    // ============================================================
    var msgLogs = [];

    function addMsgLog(msg, type) {
        var time = new Date().toLocaleTimeString('zh-CN', {hour12: false});
        msgLogs.unshift({time: time, message: msg, type: type || 'info'});
        updateMsgLogs();
        addLog(msg, type);
    }

    function updateMsgLogs() {
        var container = document.getElementById('msg-logs');
        if (!container) return;
        var html = '';
        for (var i = 0; i < msgLogs.length; i++) {
            var l = msgLogs[i];
            html += '<div class="gxks-exam-log ' + l.type + '">' + l.time + ' ' + l.message + '</div>';
        }
        container.innerHTML = html;
    }

    function initExamMessagePage() {
        injectStyles();
        var panel = document.createElement('div');
        panel.className = 'gxks-exam-panel';
        panel.innerHTML = '<div class="gxks-exam-header">交卷成功</div><div class="gxks-exam-body"><div class="gxks-exam-logs" id="msg-logs"></div></div>';
        document.body.appendChild(panel);

        addMsgLog('交卷成功', 'success');

        if (getAutoExam()) {
            addMsgLog('跳转查看答卷...', 'info');
            setTimeout(function() {
                var btn = document.getElementById('btnView');
                if (btn) btn.click();
            }, 2000);
        }
    }

    // ============================================================
    // 查看答卷页面 - 收录题库
    // ============================================================
    var viewLogs = [];

    function addViewLog(msg, type) {
        var time = new Date().toLocaleTimeString('zh-CN', {hour12: false});
        viewLogs.unshift({time: time, message: msg, type: type || 'info'});
        updateViewLogs();
        addLog(msg, type);
    }

    function updateViewLogs() {
        var container = document.getElementById('view-logs');
        if (!container) return;
        var html = '';
        for (var i = 0; i < viewLogs.length; i++) {
            var l = viewLogs[i];
            html += '<div class="gxks-exam-log ' + l.type + '">' + l.time + ' ' + l.message + '</div>';
        }
        container.innerHTML = html;
    }

    function initExamViewPage() {
        injectStyles();
        var panel = document.createElement('div');
        panel.className = 'gxks-exam-panel';
        panel.innerHTML = '<div class="gxks-exam-header">题库收录</div><div class="gxks-exam-body"><div class="gxks-exam-logs" id="view-logs"></div></div>';
        document.body.appendChild(panel);

        addViewLog('开始收录答案。..', 'info');
        setTimeout(collectAnswers, 2000);
    }

    function collectAnswers() {
        var bank = loadBank();
        var ddtms = document.querySelectorAll('div[id^=ddTm_]');
        var newCount = 0;
        var totalQ = ddtms.length;

        for (var i = 0; i < ddtms.length; i++) {
            try {
                var div = ddtms[i];
                var dt = div.querySelector('dt');
                if (!dt) continue;

                var text = dt.textContent || '';
                // 修复：使用与原版相同的正则 /\d\.(.*)\(/
                var m = text.match(/\d\.(.*)\(/);
                if (!m) continue;

                var q = m[1].replace(/^\s+|\s+$/g, "");
                var greens = div.querySelectorAll('.green');
                var green = greens.length ? (greens[greens.length - 1].textContent || '') : '';

                var answers = [];
                for (var j = 0; j < green.length; j++) {
                    var c = green[j];
                    if (c === '对') {
                        answers.push('对');
                        answers.push('正确');
                    } else if (c === '错') {
                        answers.push('错');
                        answers.push('错误');
                    } else if (c >= 'A' && c <= 'H') {
                        var idx = c.charCodeAt(0) - 65;
                        var label = document.querySelector('label[for=tm_' + (i + 1) + '_' + idx + ']');
                        if (label) answers.push((label.textContent || '').slice(2).trim());
                    }
                }

                if (answers.length && !bank[q]) {
                    bank[q] = answers;
                    newCount++;
                    addViewLog('第' + (i+1) + '题: 已收录', 'success');
                } else if (answers.length) {
                    addViewLog('第' + (i+1) + '题: 已存在', 'info');
                } else {
                    addViewLog('第' + (i+1) + '题: 无答案', 'warning');
                }
            } catch(e) {}
        }

        saveBank(bank);
        var total = Object.keys(bank).length;

        addViewLog('收录完成: 新增' + newCount + '题，共' + total + '题', 'success');

        if (getAutoExam()) {
            addViewLog('3秒后关闭窗口...', 'info');
            setTimeout(function() {
                try {
                    window.close();
                } catch(e) {
                    addViewLog('请手动关闭窗口', 'warning');
                }
            }, 3000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();