// ==UserScript==
// @name         NEXUS Note
// @namespace    http://tampermonkey.net/
// @version      1.85
// @description  移动端/PC端英语学习终极版：WebDAV+GitHub双重同步、原生搜索级高亮、云端自动删除、双击关闭、支持笔记编辑（新笔记置顶）+ 归档搜索功能 + 详情页删除。
// @author       Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558859/NEXUS%20Note.user.js
// @updateURL https://update.greasyfork.org/scripts/558859/NEXUS%20Note.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置区域 ---
    const DEFAULT_CONFIG = {
        webdav: {
            enabled: true,
            url: 'https://dav.jianguoyun.com/dav/',
            user: 'lhwuhuei@gmail.com',
            pass: 'a7sdzcg69qr4kwjj',
            path: 'Notes/' // 必须以 / 结尾
        },
        github: {
            enabled: true,
            username: 'moodHappy',
            repo: 'HelloWorld',
            token: '',
            path: 'Notes/Notes/' // 目录路径
        },
        ui: {
            highlightColor: '#ffeb3b',
            themeColor: '#2563eb',
            showFloatingButtons: true // 默认显示
        }
    };

    // --- 全局常量 ---
    const DB_KEY = 'eng_notes_db_v6';
    const CONFIG_KEY = 'eng_notes_config_v6';
    const HIGHLIGHT_CLASS = 'eng-note-highlight';
    
    // 全局状态锁
    let isModalOpen = false;

    // --- 样式定义 ---
    const styles = `
        /* 高亮样式 */
        .${HIGHLIGHT_CLASS} {
            background-color: var(--hl-color, #ffeb3b);
            border-bottom: 2px solid #fbc02d;
            color: #000 !important;
            border-radius: 2px;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .${HIGHLIGHT_CLASS}:hover { background-color: #fdd835; }

        /* 悬浮按钮 */
        .eng-fab-group { position: fixed; z-index: 2147483640; user-select: none; -webkit-tap-highlight-color: transparent; transition: opacity 0.3s; }
        
        #eng-add-btn {
            bottom: 30px; left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #2563eb; color: white;
            padding: 12px 28px; border-radius: 50px;
            font-weight: bold; box-shadow: 0 4px 15px rgba(37,99,235,0.5);
            display: flex; gap: 8px; align-items: center;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            opacity: 0; pointer-events: none; white-space: nowrap;
        }
        #eng-add-btn.visible { transform: translateX(-50%) translateY(0); opacity: 1; pointer-events: auto; }

        #eng-menu-btn {
            bottom: 100px; right: 20px;
            width: 48px; height: 48px;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(4px);
            border: 1px solid #e5e7eb; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.2s; cursor: pointer;
        }
        #eng-menu-btn:active { transform: scale(0.9); }
        .eng-badge {
            position: absolute; top: 0; right: 0;
            width: 10px; height: 10px; background: #ef4444;
            border-radius: 50%; border: 2px solid white; display: none;
        }

        /* 主面板 */
        #eng-panel {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 2147483648;
            display: none; justify-content: flex-end;
            animation: fadeIn 0.2s;
        }
        .eng-panel-inner {
            width: 100%; height: 100%; background: #f9fafb;
            display: flex; flex-direction: column;
            animation: slideUp 0.25s ease-out;
        }
        @media (min-width: 768px) { .eng-panel-inner { width: 400px; border-left: 1px solid #ddd; } }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

        .eng-header { background: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
        .eng-h-title { font-weight: 800; font-size: 18px; color: #111; }
        .eng-h-actions span { font-size: 20px; color: #555; cursor: pointer; margin-left: 15px; }
        .eng-spin { animation: spin 1s linear infinite; display: inline-block; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .eng-tabs { display: flex; background: white; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
        .eng-tab { flex: 1; text-align: center; padding: 12px; font-size: 14px; font-weight: 600; color: #6b7280; border-bottom: 2px solid transparent; cursor: pointer; }
        .eng-tab.active { color: #2563eb; border-bottom-color: #2563eb; }

        #eng-content { flex: 1; overflow-y: auto; padding: 15px; padding-bottom: 80px; }

        /* 搜索框样式 */
        .eng-search-bar {
            width: 100%; padding: 10px 12px; margin-bottom: 15px;
            border: 1px solid #d1d5db; border-radius: 8px;
            font-size: 14px; box-sizing: border-box; background: #fff;
            transition: all 0.2s;
        }
        .eng-search-bar:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

        /* 笔记列表项 */
        .eng-month-group { margin-bottom: 15px; background: white; border-radius: 8px; overflow: hidden; }
        .eng-month-header { padding: 10px 15px; background: #f3f4f6; font-weight: bold; cursor: pointer; display: flex; justify-content: space-between; }
        .eng-month-list { display: none; }
        .eng-month-list.open { display: block; }

        .eng-note-item { padding: 15px; border-bottom: 1px solid #f3f4f6; position: relative; transition: background 0.2s; }
        .eng-note-item:active { background: #eff6ff; }
        
        .eng-note-source {
            font-size: 11px; color: #2563eb; background: #eff6ff;
            padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;
            max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            cursor: pointer; border: 1px solid transparent;
        }
        .eng-note-source:hover { border-color: #2563eb; background: #dbeafe; text-decoration: underline; }

        .eng-note-origin { font-size: 15px; color: #111; border-left: 3px solid #ffeb3b; padding-left: 8px; margin-bottom: 8px; cursor: pointer; }
        .eng-note-user { font-size: 14px; color: #4b5563; background: #f9fafb; padding: 8px; border-radius: 4px; pointer-events: none; }
        .eng-note-meta { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #9ca3af; }
        .eng-btn-del { color: #ef4444; cursor: pointer; padding: 2px 8px; }

        /* 设置表单 */
        .eng-setting-row { margin-bottom: 15px; }
        .eng-input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; box-sizing: border-box; }
        .eng-btn { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; margin-top: 10px; cursor: pointer; }
        
        /* Checkbox 样式 */
        .eng-checkbox-wrapper { display: flex; align-items: center; justify-content: space-between; padding: 5px 0; }
        .eng-checkbox-wrapper input[type=checkbox] { width: 20px; height: 20px; accent-color: #2563eb; }

        /* 分割标题 */
        .eng-section-title { font-size: 14px; font-weight: bold; margin: 20px 0 10px 0; color: #333; border-left: 3px solid #2563eb; padding-left: 8px; }

        /* 强力闪烁动画 */
        @keyframes flashFocus { 
            0% { background: var(--hl-color); transform: scale(1); }
            20% { background: #ff4500; transform: scale(1.1); color: white !important; box-shadow: 0 0 15px rgba(255,69,0,0.6); }
            40% { background: var(--hl-color); transform: scale(1); }
            60% { background: #ff4500; transform: scale(1.1); color: white !important; }
            100% { background: var(--hl-color); transform: scale(1); } 
        }
        .eng-flash-target { animation: flashFocus 1.5s ease-in-out; scroll-margin-block: center; }
        
        .swal2-container { z-index: 2147483647 !important; }
        .swal2-input, .swal2-textarea { -webkit-user-select: text !important; user-select: text !important; }
    `;
    GM_addStyle(styles);

    // --- 2. 配置管理 ---
    const ConfigManager = {
        get: () => GM_getValue(CONFIG_KEY, DEFAULT_CONFIG),
        set: (cfg) => GM_setValue(CONFIG_KEY, cfg),
        export: () => {
            GM_setClipboard(JSON.stringify(ConfigManager.get()));
            Swal.fire({ title: '已复制配置', icon: 'success', toast: true, position: 'top' });
        },
        import: async () => {
            const { value: jsonStr } = await Swal.fire({
                title: '导入配置',
                input: 'textarea',
                inputPlaceholder: '粘贴JSON配置...',
                showCancelButton: true
            });
            if (jsonStr) {
                try {
                    const cfg = JSON.parse(jsonStr);
                    ConfigManager.set(cfg);
                    Swal.fire({ title: '导入成功', icon: 'success', timer: 1000 }).then(() => location.reload());
                } catch (e) { Swal.fire('配置格式错误', '', 'error'); }
            }
        }
    };

    // --- 辅助工具：UTF-8 Base64 处理 (GitHub需要) ---
    const Base64 = {
        encode: (str) => btoa(unescape(encodeURIComponent(str))),
        decode: (str) => decodeURIComponent(escape(atob(str)))
    };

    // --- 3. WebDAV 核心 ---
    const WebDAV = {
        getAuth: (cfg) => 'Basic ' + btoa(cfg.webdav.user + ':' + cfg.webdav.pass),
        
        // 修改：生成带年份的相对路径 (例如: 2025/Notes_2025-01.json)
        getFileRelativePath: (ts) => {
            const d = ts ? new Date(ts) : new Date();
            const year = d.getFullYear();
            const m = (d.getMonth() + 1).toString().padStart(2, '0');
            return `${year}/Notes_${year}-${m}.json`;
        },

        syncPull: async () => {
            const cfg = ConfigManager.get();
            if (!cfg.webdav.enabled) return 0;
            // 路径变为: URL + Path + 2025/Notes_2025-01.json
            const fileUrl = cfg.webdav.url + cfg.webdav.path + WebDAV.getFileRelativePath();
            
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: fileUrl,
                    headers: { 'Authorization': WebDAV.getAuth(cfg) },
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                const notes = JSON.parse(res.responseText);
                                resolve(DataManager.mergeRemoteNotes(notes));
                            } catch(e) { resolve(0); }
                        } else resolve(0);
                    },
                    onerror: () => resolve(0)
                });
            });
        },

        uploadNote: (noteObj) => {
            const cfg = ConfigManager.get();
            if (!cfg.webdav.enabled) return;
            
            // 计算路径信息
            const relPath = WebDAV.getFileRelativePath(noteObj.timestamp); // "2025/Notes_2025-01.json"
            const yearDir = relPath.split('/')[0]; // "2025"
            const fileUrl = cfg.webdav.url + cfg.webdav.path + relPath;
            const dirUrl = cfg.webdav.url + cfg.webdav.path + yearDir + '/';
            const headers = { 'Authorization': WebDAV.getAuth(cfg) };

            // 1. 尝试创建年份文件夹 (MKCOL)
            // 即使文件夹存在，返回405也是正常的，继续后续操作
            GM_xmlhttpRequest({
                method: 'MKCOL',
                url: dirUrl,
                headers: headers,
                onload: () => {
                    // 2. 读取现有文件
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: fileUrl,
                        headers: headers,
                        onload: (res) => {
                            let notes = (res.status === 200) ? JSON.parse(res.responseText) : [];
                            notes.unshift(noteObj);
                            // 3. 写入文件
                            GM_xmlhttpRequest({ method: 'PUT', url: fileUrl, headers: headers, data: JSON.stringify(notes, null, 2) });
                        }
                    });
                }
            });
        },

        updateRemoteNote: (noteObj) => {
            const cfg = ConfigManager.get();
            if (!cfg.webdav.enabled) return;
            
            const fileUrl = cfg.webdav.url + cfg.webdav.path + WebDAV.getFileRelativePath(noteObj.timestamp);
            const headers = { 'Authorization': WebDAV.getAuth(cfg) };

            GM_xmlhttpRequest({
                method: 'GET',
                url: fileUrl,
                headers: headers,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            let notes = JSON.parse(res.responseText);
                            const idx = notes.findIndex(n => n.id === noteObj.id);
                            if (idx !== -1) {
                                notes[idx].note = noteObj.note;
                                GM_xmlhttpRequest({
                                    method: 'PUT',
                                    url: fileUrl,
                                    headers: headers,
                                    data: JSON.stringify(notes, null, 2)
                                });
                            }
                        } catch(e) {}
                    }
                }
            });
        },

        deleteRemoteNote: (noteId, timestamp) => {
            const cfg = ConfigManager.get();
            if (!cfg.webdav.enabled) return;
            
            const fileUrl = cfg.webdav.url + cfg.webdav.path + WebDAV.getFileRelativePath(timestamp);
            const headers = { 'Authorization': WebDAV.getAuth(cfg) };

            GM_xmlhttpRequest({
                method: 'GET',
                url: fileUrl,
                headers: headers,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            let notes = JSON.parse(res.responseText);
                            const newNotes = notes.filter(n => n.id !== noteId);
                            if (newNotes.length !== notes.length) {
                                GM_xmlhttpRequest({
                                    method: 'PUT',
                                    url: fileUrl,
                                    headers: headers,
                                    data: JSON.stringify(newNotes, null, 2)
                                });
                            }
                        } catch(e) {}
                    }
                }
            });
        },

        checkConnection: async (cfg) => {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'PROPFIND',
                    url: cfg.webdav.url + cfg.webdav.path,
                    headers: { 'Authorization': WebDAV.getAuth(cfg), 'Depth': '0' },
                    onload: (res) => resolve(res.status >= 200 && res.status < 300),
                    onerror: () => resolve(false)
                });
            });
        }
    };

    // --- 4. GitHub 核心 ---
    const GitHub = {
        getApiUrl: (cfg, timestamp) => {
            // 使用新的相对路径: 2025/Notes_2025-01.json
            const relativePath = WebDAV.getFileRelativePath(timestamp);
            let path = cfg.github.path.replace(/^\/+/, '').replace(/\/+$/, '');
            if (path) path += '/';
            // GitHub API 路径结果: .../contents/Notes/Notes/2025/Notes_2025-01.json
            return `https://api.github.com/repos/${cfg.github.username}/${cfg.github.repo}/contents/${path}${relativePath}`;
        },
        getHeaders: (cfg) => ({
            'Authorization': `token ${cfg.github.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }),
        modifyFile: (timestamp, callback) => {
            const cfg = ConfigManager.get();
            if (!cfg.github || !cfg.github.enabled) return;

            const url = GitHub.getApiUrl(cfg, timestamp);
            const headers = GitHub.getHeaders(cfg);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: headers,
                onload: (res) => {
                    let notes = [];
                    let sha = null;
                    
                    if (res.status === 200) {
                        try {
                            const data = JSON.parse(res.responseText);
                            sha = data.sha;
                            const cleanContent = data.content.replace(/\n/g, '');
                            notes = JSON.parse(Base64.decode(cleanContent));
                        } catch (e) { console.error('GH Parse Error', e); }
                    }

                    const newNotes = callback(notes);
                    
                    if (newNotes !== null) { 
                        const contentStr = JSON.stringify(newNotes, null, 2);
                        const body = {
                            message: `Update notes ${new Date().toISOString()}`,
                            content: Base64.encode(contentStr), 
                            sha: sha 
                        };
                        if(!sha) delete body.sha;

                        GM_xmlhttpRequest({
                            method: 'PUT',
                            url: url,
                            headers: headers,
                            data: JSON.stringify(body),
                            onload: (r) => { if(r.status >= 400) console.error('GH Sync Fail', r.responseText); }
                        });
                    }
                },
                onerror: (e) => console.error('GH Conn Error', e)
            });
        },
        
        uploadNote: (noteObj) => {
            // GitHub API 会自动创建父目录(例如 2025/)，无需额外处理
            GitHub.modifyFile(noteObj.timestamp, (notes) => {
                notes.unshift(noteObj); 
                return notes;
            });
        },
        updateRemoteNote: (noteObj) => {
            GitHub.modifyFile(noteObj.timestamp, (notes) => {
                const idx = notes.findIndex(n => n.id === noteObj.id);
                if (idx !== -1) {
                    notes[idx].note = noteObj.note;
                    return notes;
                }
                return null;
            });
        },
        deleteRemoteNote: (noteId, timestamp) => {
            GitHub.modifyFile(timestamp, (notes) => {
                const filtered = notes.filter(n => n.id !== noteId);
                return filtered.length !== notes.length ? filtered : null;
            });
        }
    };

    // --- 5. 数据管理 ---
    const DataManager = {
        getLocalDB: () => GM_getValue(DB_KEY, {}),
        setLocalDB: (db) => GM_setValue(DB_KEY, db),
        getPageKey: () => window.location.origin + window.location.pathname,

        mergeRemoteNotes: (remoteNotes) => {
            const db = DataManager.getLocalDB();
            let count = 0;
            remoteNotes.forEach(note => {
                try {
                    const u = new URL(note.url);
                    const k = u.origin + u.pathname;
                    if (!db[k]) db[k] = { title: note.pageTitle, notes: [] };
                    if (!db[k].notes.some(n => n.id === note.id)) {
                        db[k].notes.push(note);
                        count++;
                    }
                } catch (e) {}
            });
            if (count > 0) DataManager.setLocalDB(db);
            return count;
        },

        addNote: async (text, note) => {
            const db = DataManager.getLocalDB();
            const pk = DataManager.getPageKey();
            if (!db[pk]) db[pk] = { title: document.title, notes: [] };
            
            const obj = {
                id: Date.now().toString(),
                text: text,
                note: note,
                time: new Date().toLocaleString(),
                timestamp: Date.now(),
                url: window.location.href,
                pageTitle: document.title
            };
            
            db[pk].notes.push(obj);
            DataManager.setLocalDB(db);
            
            // 执行双重同步
            WebDAV.uploadNote(obj);
            GitHub.uploadNote(obj);
            
            return obj.id;
        },

        updateNote: (pageKey, noteId, newContent) => {
            const db = DataManager.getLocalDB();
            const pk = pageKey || DataManager.getPageKey();
            
            if (db[pk] && db[pk].notes) {
                const target = db[pk].notes.find(n => n.id === noteId);
                if (target) {
                    target.note = newContent;
                    DataManager.setLocalDB(db);
                    
                    // 双重同步更新
                    WebDAV.updateRemoteNote(target);
                    GitHub.updateRemoteNote(target);
                    return true;
                }
            }
            return false;
        },

        deleteNote: (pageKey, noteId) => {
            const db = DataManager.getLocalDB();
            if (db[pageKey]) {
                const target = db[pageKey].notes.find(n => n.id === noteId);
                if(target) {
                    const ts = target.timestamp; 
                    db[pageKey].notes = db[pageKey].notes.filter(n => n.id !== noteId);
                    if (db[pageKey].notes.length === 0) delete db[pageKey];
                    DataManager.setLocalDB(db);
                    
                    // 双重同步删除
                    WebDAV.deleteRemoteNote(noteId, ts);
                    GitHub.deleteRemoteNote(noteId, ts);
                    return true;
                }
            }
            return false;
        },

        getAllNotesFlat: () => {
            const db = DataManager.getLocalDB();
            let all = [];
            Object.keys(db).forEach(k => {
                if(db[k].notes) all = all.concat(db[k].notes.map(n => ({...n, urlKey: k})));
            });
            return all.sort((a,b) => b.timestamp - a.timestamp);
        }
    };

    // --- 6. 高亮引擎 ---
    const Highlighter = {
        applyHighlight: (note) => {
            if (document.getElementById(`eng-note-${note.id}`)) return true;
            
            const sel = window.getSelection();
            sel.removeAllRanges(); 
            
            const found = window.find(note.text, false, false, true, false, false, false);
            
            if (found) {
                try {
                    const range = sel.getRangeAt(0);
                    const span = document.createElement('span');
                    span.className = HIGHLIGHT_CLASS;
                    span.id = `eng-note-${note.id}`;
                    span.title = '点击查看笔记';
                    span.onclick = (e) => {
                        e.stopPropagation();
                        Highlighter.showModal(note);
                    };
                    
                    try {
                        range.surroundContents(span);
                    } catch (e) {
                        span.appendChild(range.extractContents());
                        range.insertNode(span);
                    }
                    
                    sel.collapseToEnd();
                    return true;
                } catch (e) {
                    console.error('Highlight Wrap Error:', e);
                }
            }
            return false;
        },

        renderAll: () => {
            if (isModalOpen) return;

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            
            const db = DataManager.getLocalDB();
            const key = DataManager.getPageKey();
            if (db[key] && db[key].notes) {
                window.getSelection().removeAllRanges();
                
                db[key].notes.forEach(note => {
                    Highlighter.applyHighlight(note);
                });
                
                window.getSelection().removeAllRanges();
                window.scrollTo(scrollX, scrollY);
                
                const badge = document.querySelector('.eng-badge');
                if(badge) badge.style.display = db[key].notes.length > 0 ? 'block' : 'none';
            }
        },

        locate: (noteId, text) => {
            let el = document.getElementById(`eng-note-${noteId}`);
            if (!el) {
                Highlighter.applyHighlight({id: noteId, text: text});
                el = document.getElementById(`eng-note-${noteId}`);
            }

            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.remove('eng-flash-target');
                void el.offsetWidth;
                el.classList.add('eng-flash-target');
            } else {
                if (window.find(text)) {
                    Swal.fire({ title: '已定位文本', text: '（结构复杂，仅定位）', toast: true, position: 'center', timer: 2000 });
                } else {
                    Swal.fire({ icon: 'warning', title: '定位失败', text: '内容可能已变更', toast: true });
                }
            }
        },

        showModal: (note) => {
            isModalOpen = true;

            const modalHtml = `
                <div style="text-align:left;background:#f9f9f9;padding:10px;border-radius:5px;line-height:1.5;white-space:pre-wrap;word-break:break-word;">${note.note}</div>
                <hr style="margin:10px 0;border:0;border-top:1px solid #eee">
                <div style="font-size:12px;color:#999;display:flex;justify-content:space-between;align-items:center;">
                    <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:10px;">原文: "${note.text}"</span>
                    <div style="flex-shrink:0;display:flex;align-items:center;">
                        <button id="eng-edit-btn" style="border:none;background:none;color:#2563eb;cursor:pointer;font-weight:bold;padding:4px;">✏️ 编辑</button>
                        <button id="eng-del-modal-btn" style="border:none;background:none;color:#ef4444;cursor:pointer;font-weight:bold;padding:4px;margin-left:8px;">🗑️ 删除</button>
                    </div>
                </div>`;

            Swal.fire({
                title: '笔记详情',
                html: modalHtml,
                showConfirmButton: true,
                confirmButtonText: '关闭',
                confirmButtonColor: '#4b5563',
                didOpen: () => {
                    // 编辑逻辑
                    const editBtn = document.getElementById('eng-edit-btn');
                    if(editBtn) {
                        editBtn.addEventListener('click', () => {
                            Swal.close();
                            setTimeout(() => {
                                isModalOpen = true;
                                Swal.fire({
                                    title: '编辑笔记',
                                    input: 'textarea',
                                    inputValue: note.note,
                                    showCancelButton: true,
                                    confirmButtonText: '保存',
                                    confirmButtonColor: '#2563eb',
                                    willClose: () => { isModalOpen = false; }
                                }).then((result) => {
                                    if (result.isConfirmed && result.value) {
                                        note.note = result.value;
                                        DataManager.updateNote(note.urlKey, note.id, result.value);
                                        UI.refreshList();
                                        Swal.fire({ icon: 'success', title: '修改已保存', toast: true, position: 'center', timer: 1000, showConfirmButton: false });
                                    }
                                });
                            }, 50);
                        });
                    }

                    // 删除逻辑
                    const delBtn = document.getElementById('eng-del-modal-btn');
                    if(delBtn) {
                        delBtn.addEventListener('click', () => {
                            Swal.fire({
                                title: '确定删除？',
                                text: '将从本地及云端移除此笔记',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#ef4444',
                                cancelButtonColor: '#6b7280',
                                confirmButtonText: '删除',
                                cancelButtonText: '取消',
                                target: document.getElementById('swal2-container') // 保持在顶层
                            }).then((r) => {
                                if (r.isConfirmed) {
                                    // 1. 数据删除
                                    DataManager.deleteNote(note.urlKey || DataManager.getPageKey(), note.id);
                                    
                                    // 2. DOM 移除高亮（即时反馈，无需刷新）
                                    const hl = document.getElementById(`eng-note-${note.id}`);
                                    if(hl) {
                                        // 用纯文本节点替换高亮span
                                        const textNode = document.createTextNode(hl.innerText);
                                        hl.parentNode.replaceChild(textNode, hl);
                                    }

                                    // 3. 关闭主弹窗并刷新侧边栏
                                    Swal.close();
                                    UI.refreshList();
                                    
                                    Swal.fire({title: '已删除', icon: 'success', toast: true, position: 'center', timer: 1000, showConfirmButton: false});
                                }
                            });
                        });
                    }
                },
                willClose: () => { isModalOpen = false; }
            });
        }
    };

    // --- 7. UI 逻辑 ---
    const UI = {
        init: () => {
            const addBtn = document.createElement('div');
            addBtn.id = 'eng-add-btn';
            addBtn.className = 'eng-fab-group';
            addBtn.innerHTML = '<span>✏️</span> 记笔记';

            const menuBtn = document.createElement('div');
            menuBtn.id = 'eng-menu-btn';
            menuBtn.className = 'eng-fab-group';
            menuBtn.innerHTML = '📚<div class="eng-badge"></div>';

            const panel = document.createElement('div');
            panel.id = 'eng-panel';
            panel.innerHTML = `
                <div class="eng-panel-inner">
                    <div class="eng-header">
                        <div class="eng-h-title">Note Master (Dual Sync)</div>
                        <div class="eng-h-actions">
                            <span id="eng-act-sync" title="同步">🔄</span>
                            <span id="eng-act-setting" title="设置">⚙️</span>
                            <span id="eng-act-close" title="关闭">×</span>
                        </div>
                    </div>
                    <div class="eng-tabs">
                        <div class="eng-tab active" data-target="page">本页笔记</div>
                        <div class="eng-tab" data-target="all">所有归档</div>
                        <div class="eng-tab" data-target="settings">设置</div>
                    </div>
                    <div id="eng-content"></div>
                </div>
            `;

            document.body.append(addBtn, menuBtn, panel);
            
            UI.updateFabVisibility();

            document.addEventListener('selectionchange', () => {
                if (isModalOpen) return;
                
                const cfg = ConfigManager.get();
                if (cfg.ui.showFloatingButtons === false) return;

                const txt = window.getSelection().toString().trim();
                if (txt) {
                    addBtn.classList.add('visible');
                    menuBtn.style.display = 'none';
                } else {
                    addBtn.classList.remove('visible');
                    menuBtn.style.display = 'flex';
                }
            });

            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const text = window.getSelection().toString().trim();
                if (!text) return;

                isModalOpen = true;
                
                addBtn.classList.remove('visible');
                window.getSelection().removeAllRanges();

                setTimeout(async () => {
                    const { value: note } = await Swal.fire({
                        title: '添加笔记',
                        input: 'textarea',
                        inputPlaceholder: '记录点什么...',
                        html: `<div style="font-size:12px;color:#666;margin-bottom:10px;max-height:60px;overflow:hidden">"${text}"</div>`,
                        showCancelButton: true,
                        confirmButtonColor: '#2563eb',
                        returnFocus: false, 
                        allowOutsideClick: false,
                        didOpen: (modal) => {
                            const input = Swal.getInput();
                            if (input) {
                                input.focus();
                                setTimeout(() => { input.focus(); }, 300);
                            }
                        },
                        willClose: () => {
                            isModalOpen = false;
                        }
                    });

                    if (note) {
                        const id = await DataManager.addNote(text, note);
                        Highlighter.applyHighlight({id, text, note});
                        Swal.fire({ icon: 'success', title: '已保存到双云端', toast: true, position: 'center', timer: 1000, showConfirmButton: false });
                        if (panel.style.display === 'flex') UI.refreshList();
                    } else {
                        isModalOpen = false;
                        menuBtn.style.display = 'flex';
                    }
                }, 50);
            });

            const togglePanel = (show) => {
                panel.style.display = show ? 'flex' : 'none';
                document.body.style.overflow = show ? 'hidden' : '';
                if(show) UI.refreshList();
            };

            menuBtn.addEventListener('click', () => togglePanel(true));
            panel.querySelector('#eng-act-close').addEventListener('click', () => togglePanel(false));
            
            panel.addEventListener('dblclick', (e) => {
                if (e.target.id === 'eng-panel' || e.target.classList.contains('eng-panel-inner') || e.target.id === 'eng-content') {
                    togglePanel(false);
                }
            });

            panel.querySelector('#eng-act-setting').addEventListener('click', () => UI.switchTab('settings'));
            const syncBtn = panel.querySelector('#eng-act-sync');
            syncBtn.addEventListener('click', async () => {
                syncBtn.classList.add('eng-spin');
                const count = await WebDAV.syncPull();
                syncBtn.classList.remove('eng-spin');
                Highlighter.renderAll();
                UI.refreshList();
                Swal.fire({ icon: 'success', title: count > 0 ? `同步了 ${count} 条笔记` : 'WebDAV暂无更新', toast: true, position: 'top' });
            });

            panel.querySelectorAll('.eng-tab').forEach(t => t.addEventListener('click', () => UI.switchTab(t.dataset.target)));
        },
        
        updateFabVisibility: () => {
            const cfg = ConfigManager.get();
            const show = cfg.ui.showFloatingButtons !== false; 
            const menuBtn = document.getElementById('eng-menu-btn');
            const addBtn = document.getElementById('eng-add-btn');
            
            if (menuBtn) {
                menuBtn.style.display = show ? 'flex' : 'none';
            }
            if (!show && addBtn) {
                addBtn.classList.remove('visible');
            }
        },

        switchTab: (target) => {
            document.querySelectorAll('.eng-tab').forEach(t => t.classList.toggle('active', t.dataset.target === target));
            UI.refreshList();
        },

        // 核心渲染逻辑
        refreshList: () => {
            const target = document.querySelector('.eng-tab.active').dataset.target;
            const container = document.getElementById('eng-content');
            
            // 为了防止搜索框在刷新时失去焦点，只有非归档页才完全清空
            if (target !== 'all') {
                container.innerHTML = '';
            }

            if (target === 'settings') {
                UI.renderSettings(container);
            } else if (target === 'page') {
                const db = DataManager.getLocalDB();
                const key = DataManager.getPageKey();
                const notes = (db[key]?.notes || []).slice().reverse();
                if(notes.length === 0) container.innerHTML = '<div style="text-align:center;color:#999;margin-top:50px">本页暂无笔记</div>';
                else notes.forEach(n => container.appendChild(UI.createCard(n, true)));
            } else {
                // --- 归档页逻辑 ---
                if (!container.querySelector('#eng-search-input')) {
                    container.innerHTML = `
                        <input type="text" id="eng-search-input" class="eng-search-bar" placeholder="🔍 搜索笔记内容、原文或标题...">
                        <div id="eng-archive-list"></div>
                    `;
                    const input = container.querySelector('#eng-search-input');
                    input.addEventListener('input', (e) => {
                        UI.renderArchiveList(e.target.value.trim().toLowerCase());
                    });
                }
                
                const input = container.querySelector('#eng-search-input');
                UI.renderArchiveList(input.value.trim().toLowerCase());
            }
        },

        // 归档列表渲染函数
        renderArchiveList: (filterText) => {
            const listContainer = document.getElementById('eng-archive-list');
            if (!listContainer) return;
            
            listContainer.innerHTML = '';
            
            const all = DataManager.getAllNotesFlat();
            if(all.length === 0) {
                listContainer.innerHTML = '<div style="text-align:center;color:#999;margin-top:50px">暂无任何笔记</div>';
                return;
            }

            // 过滤逻辑
            const filteredNotes = !filterText ? all : all.filter(n => 
                (n.text && n.text.toLowerCase().includes(filterText)) ||
                (n.note && n.note.toLowerCase().includes(filterText)) ||
                (n.pageTitle && n.pageTitle.toLowerCase().includes(filterText))
            );

            if (filteredNotes.length === 0) {
                listContainer.innerHTML = '<div style="text-align:center;color:#999;margin-top:20px">未找到相关笔记</div>';
                return;
            }

            // 分组逻辑
            const groups = {};
            filteredNotes.forEach(n => {
                const m = new Date(n.timestamp).getFullYear() + '年' + (new Date(n.timestamp).getMonth()+1) + '月';
                if(!groups[m]) groups[m] = [];
                groups[m].push(n);
            });

            Object.keys(groups).forEach(m => {
                const div = document.createElement('div');
                div.className = 'eng-month-group';
                div.innerHTML = `<div class="eng-month-header"><span>📂 ${m}</span><span>${groups[m].length}</span></div><div class="eng-month-list"></div>`;
                
                const list = div.querySelector('.eng-month-list');
                div.querySelector('.eng-month-header').onclick = () => list.classList.toggle('open');
                
                groups[m].forEach(n => list.appendChild(UI.createCard(n, false)));
                
                // 如果有搜索内容，默认展开所有分组
                if (filterText) {
                    list.classList.add('open');
                }
                
                listContainer.appendChild(div);
            });
            
            // 无搜索内容时，默认展开第一个月
            if (!filterText && listContainer.firstChild) {
                listContainer.firstChild.querySelector('.eng-month-list').classList.add('open');
            }
        },

        createCard: (n, isPageTab) => {
            const div = document.createElement('div');
            div.className = 'eng-note-item';
            div.innerHTML = `
                ${!isPageTab ? `<div class="eng-note-source" title="打开原网页">${n.pageTitle || '未知页面'}</div>` : ''}
                <div class="eng-note-origin" title="点击定位">${n.text}</div>
                <div class="eng-note-user">${n.note}</div>
                <div class="eng-note-meta">
                    <span>${n.time.split(' ')[0]}</span>
                    <span class="eng-btn-del">删除</span>
                </div>
            `;
            
            const titleBtn = div.querySelector('.eng-note-source');
            if(titleBtn) {
                titleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(n.url, '_blank');
                });
            }

            div.addEventListener('click', (e) => {
                if (e.target.classList.contains('eng-btn-del')) return;
                if (e.target.classList.contains('eng-note-source')) return;

                const curUrl = window.location.origin + window.location.pathname;
                const noteUrl = new URL(n.url);
                if (curUrl === noteUrl.origin + noteUrl.pathname) {
                    document.getElementById('eng-panel').style.display = 'none';
                    document.body.style.overflow = '';
                    Highlighter.locate(n.id, n.text);
                } else {
                    window.open(n.url, '_blank');
                }
            });

            div.querySelector('.eng-btn-del').addEventListener('click', (e) => {
                e.stopPropagation();
                Swal.fire({ title: '确定删除？', text: '同时删除 WebDAV 和 GitHub 备份', showCancelButton: true }).then(r => {
                    if(r.isConfirmed) {
                        DataManager.deleteNote(n.urlKey || DataManager.getPageKey(), n.id);
                        div.remove();
                        const hl = document.getElementById(`eng-note-${n.id}`);
                        if(hl) {
                            const textNode = document.createTextNode(hl.innerText);
                            hl.parentNode.replaceChild(textNode, hl);
                        }
                    }
                });
            });

            return div;
        },

        renderSettings: (ctn) => {
            const cfg = ConfigManager.get();
            const isFabShown = cfg.ui.showFloatingButtons !== false;
            
            ctn.innerHTML = `
                <div style="padding:10px">
                     <div class="eng-checkbox-wrapper">
                        <label for="c-fab-toggle" style="font-weight:bold;color:#374151">显示页面悬浮按钮</label>
                        <input type="checkbox" id="c-fab-toggle" ${isFabShown ? 'checked' : ''}>
                     </div>
                     
                     <div class="eng-section-title">WebDAV (Jianguoyun)</div>
                     <div class="eng-setting-row"><label>URL</label><input id="c-url" class="eng-input" value="${cfg.webdav.url}"></div>
                     <div class="eng-setting-row"><label>User</label><input id="c-user" class="eng-input" value="${cfg.webdav.user}"></div>
                     <div class="eng-setting-row"><label>Pass</label><input id="c-pass" type="password" class="eng-input" value="${cfg.webdav.pass}"></div>
                     <div class="eng-setting-row"><label>Path</label><input id="c-path" class="eng-input" value="${cfg.webdav.path}"></div>
                     
                     <div class="eng-section-title">GitHub</div>
                     <div class="eng-setting-row"><label>Token</label><input id="g-token" type="password" class="eng-input" value="${cfg.github?.token || ''}"></div>
                     <div class="eng-setting-row"><label>User</label><input id="g-user" class="eng-input" value="${cfg.github?.username || ''}"></div>
                     <div class="eng-setting-row"><label>Repo</label><input id="g-repo" class="eng-input" value="${cfg.github?.repo || ''}"></div>
                     <div class="eng-setting-row"><label>Path</label><input id="g-path" class="eng-input" value="${cfg.github?.path || ''}"></div>

                     <button id="c-save" class="eng-btn">保存并测试</button>
                     <div style="margin-top:10px;display:flex;gap:10px">
                        <button id="c-exp" class="eng-btn" style="background:white;color:#2563eb;border:1px solid #2563eb">导出</button>
                        <button id="c-imp" class="eng-btn" style="background:white;color:#2563eb;border:1px solid #2563eb">导入</button>
                     </div>
                </div>
            `;
            
            ctn.querySelector('#c-save').onclick = async () => {
                const c = { 
                    webdav: { 
                        enabled: true, 
                        url: ctn.querySelector('#c-url').value, 
                        user: ctn.querySelector('#c-user').value, 
                        pass: ctn.querySelector('#c-pass').value, 
                        path: ctn.querySelector('#c-path').value 
                    }, 
                    github: {
                        enabled: true,
                        token: ctn.querySelector('#g-token').value,
                        username: ctn.querySelector('#g-user').value,
                        repo: ctn.querySelector('#g-repo').value,
                        path: ctn.querySelector('#g-path').value
                    },
                    ui: {
                        ...cfg.ui,
                        showFloatingButtons: ctn.querySelector('#c-fab-toggle').checked
                    }
                };
                
                if (await WebDAV.checkConnection(c)) {
                    ConfigManager.set(c);
                    UI.updateFabVisibility(); 
                    Swal.fire('配置保存成功', 'WebDAV 连接正常，GitHub 配置已保存', 'success');
                } else {
                    Swal.fire('WebDAV 连接失败', '检查密码或路径', 'error');
                }
            };
            ctn.querySelector('#c-exp').onclick = ConfigManager.export;
            ctn.querySelector('#c-imp').onclick = ConfigManager.import;
        }
    };

    // --- 启动 ---
    window.addEventListener('load', () => {
        UI.init();
        setTimeout(Highlighter.renderAll, 1000);
    });
    
    // 监听动态加载
    let timer;
    const observer = new MutationObserver((mutations) => {
        if (isModalOpen) return;
        
        let shouldRefresh = false;
        for(let m of mutations) {
            if (!m.target.classList.contains('swal2-container') && !m.target.closest('.swal2-container')) {
                shouldRefresh = true;
                break;
            }
        }
        
        if (shouldRefresh) {
            clearTimeout(timer);
            timer = setTimeout(Highlighter.renderAll, 2000);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    GM_registerMenuCommand("⚙️ 设置", () => {
        document.getElementById('eng-panel').style.display = 'flex';
        UI.switchTab('settings');
    });

})();
