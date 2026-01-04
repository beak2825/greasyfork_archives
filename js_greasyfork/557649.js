// ==UserScript==
// @name         Universal Video Screenshot & Stitcher (Batch & Custom)
// @name:zh-CN   通用视频截图拼接工具
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Capture, batch capture (by time range), stitch, and save. Modular architecture.
// @description:zh-CN 捕捉、批量截图(按时间段平均分割)、拼接并以自定义文件名保存。支持 2:00-5:00;10 语法。
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557649/Universal%20Video%20Screenshot%20%20Stitcher%20%28Batch%20%20Custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557649/Universal%20Video%20Screenshot%20%20Stitcher%20%28Batch%20%20Custom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 常量与配置 (Constants & Config)
    // ==========================================
    const I18N = {
        zh: {
            title: "截图拼接助手",
            cap: "捕捉当前帧",
            gen: "生成长图",
            clr: "清空列表",
            set: "设置 / 批量",
            mode: "拼接模式",
            mSeq: "长图 (平行)",
            mSub: "字幕 (重叠)",
            pct: "重叠高度 (%)",
            fname: "文件名模板",
            batch: "批量初始化 (格式: 开始-结束;张数)",
            batchPh: "例: 2:00-5:00;10",
            batchBtn: "开始批量截图",
            batching: "正在批量处理: $current / $total",
            noVid: "未检测到视频",
            invFmt: "格式错误！正确示例: 1:30-2:00;5",
            cors: "CORS 跨域限制，无法读取画面",
            done: "批量完成"
        },
        en: {
            title: "Stitcher Pro",
            cap: "Capture Frame",
            gen: "Generate",
            clr: "Clear",
            set: "Settings / Batch",
            mode: "Stitch Mode",
            mSeq: "Parallel",
            mSub: "Overlap",
            pct: "Overlap (%)",
            fname: "Filename Template",
            batch: "Batch Init (Start-End;Count)",
            batchPh: "Ex: 2:00-5:00;10",
            batchBtn: "Start Batch",
            batching: "Processing: $current / $total",
            noVid: "No Video Found",
            invFmt: "Invalid Format! Ex: 1:30-2:00;5",
            cors: "CORS Restricted",
            done: "Batch Done"
        }
    };

    const T = navigator.language.startsWith('zh') ? I18N.zh : I18N.en;

    const Store = {
        get: (key, def) => GM_getValue(key, def),
        set: (key, val) => GM_setValue(key, val)
    };

    const State = {
        config: {
            selector: Store.get('selector', 'video'),
            mode: Store.get('mode', 'overlap'),
            overlap: Store.get('overlap', 20),
            fileName: Store.get('fileName', 'Capture_$title_$time'),
            batchStr: Store.get('batchStr', ''),
            isCollapsed: false
        },
        frames: [],
        videoEl: null,
        isBatching: false
    };

    // ==========================================
    // 2. 核心逻辑层 (Core Logic)
    // ==========================================
    const Core = {
        findVideo: () => {
            let v = document.querySelector(State.config.selector);
            if (!v && State.config.selector !== 'video') v = document.querySelector('video');
            State.videoEl = v;
            return v;
        },

        // 解析时间字符串 (MM:SS -> Seconds)
        parseTime: (str) => {
            if (!str) return 0;
            const p = str.toString().split(':');
            return p.length === 2 ? parseInt(p[0])*60 + parseFloat(p[1]) : parseFloat(p[0]);
        },

        // 计算批量时间点
        calcBatchTimes: (inputStr) => {
            // Regex: Time-Time;Count (e.g., 2:00-5:00;10 or 120-300;10)
            const regex = /^([\d:.]+)-([\d:.]+);(\d+)$/;
            const match = inputStr.trim().match(regex);
            if (!match) return null;

            const start = Core.parseTime(match[1]);
            const end = Core.parseTime(match[2]);
            const count = parseInt(match[3]);

            if (count <= 0 || end <= start) return null;

            const duration = end - start;
            const segment = duration / count;
            const times = [];

            // 取每个分段的中间时刻
            for (let i = 0; i < count; i++) {
                const t = start + (segment * i) + (segment / 2);
                times.push(t);
            }
            return times;
        },

        // 等待视频跳转完成 (Promise wrapper)
        waitSeek: (video, time) => {
            return new Promise((resolve) => {
                const onSeeked = () => {
                    video.removeEventListener('seeked', onSeeked);
                    // 额外延迟，确保画面渲染完成（防止黑屏）
                    setTimeout(resolve, 250); 
                };
                // 设置超时防止卡死
                setTimeout(() => { 
                    video.removeEventListener('seeked', onSeeked); 
                    resolve(); 
                }, 3000); 

                video.addEventListener('seeked', onSeeked);
                video.currentTime = time;
            });
        },

        capture: (video) => {
            try { video.setAttribute('crossOrigin', 'anonymous'); } catch(e){}
            const cvs = document.createElement('canvas');
            cvs.width = video.videoWidth;
            cvs.height = video.videoHeight;
            cvs.getContext('2d').drawImage(video, 0, 0);
            return {
                id: Date.now() + Math.random(),
                canvas: cvs,
                time: video.currentTime,
                thumb: cvs.toDataURL('image/jpeg', 0.15)
            };
        },

        stitch: (frames, config) => {
            if (!frames.length) return null;
            const w = frames[0].canvas.width;
            let totalH = 0;
            if (config.mode === 'parallel') {
                frames.forEach(f => totalH += f.canvas.height);
            } else {
                totalH = frames[0].canvas.height;
                const sliceH = frames[0].canvas.height * (config.overlap / 100);
                if (frames.length > 1) totalH += (frames.length - 1) * sliceH;
            }
            const resCvs = document.createElement('canvas');
            resCvs.width = w; resCvs.height = totalH;
            const ctx = resCvs.getContext('2d');
            let currY = 0;
            frames.forEach((f, i) => {
                const h = f.canvas.height;
                if (config.mode === 'parallel') {
                    ctx.drawImage(f.canvas, 0, currY);
                    currY += h;
                } else {
                    if (i === 0) { ctx.drawImage(f.canvas, 0, 0); currY += h; }
                    else {
                        const sH = h * (config.overlap / 100);
                        ctx.drawImage(f.canvas, 0, h - sH, w, sH, 0, currY, width, sH);
                        currY += sH;
                    }
                }
            });
            return resCvs;
        },

        formatName: (template) => {
            const now = new Date();
            const timeStr = `${now.getFullYear()}${now.getMonth()+1}${now.getDate()}_${now.getHours()}${now.getMinutes()}`;
            const safeTitle = document.title.replace(/[<>:"/\\|?*]/g, '').trim().substring(0, 50);
            return template.replace('$title', safeTitle).replace('$domain', location.hostname)
                           .replace('$date', Date.now()).replace('$time', timeStr) + '.png';
        }
    };

    // ==========================================
    // 3. UI 视图层 (DOM)
    // ==========================================
    const Dom = {
        el: (tag, attrs = {}, children = []) => {
            const d = document.createElement(tag);
            for (let k in attrs) {
                if (k === 'style') Object.assign(d.style, attrs[k]);
                else if (k.startsWith('on')) d[k] = attrs[k];
                else d[k] = attrs[k];
            }
            children.forEach(c => d.appendChild(typeof c !== 'object' ? document.createTextNode(c) : c));
            return d;
        },
        fmtTime: s => {
            const m = Math.floor(s/60), sec = Math.floor(s%60);
            return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
        },
        download: (blob, name) => {
            const u = URL.createObjectURL(blob);
            const a = Dom.el('a', {href:u, download:name});
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(()=>URL.revokeObjectURL(u),1000);
        },
        injectCss: () => {
            if (document.getElementById('vss-css')) return;
            const css = `
                #vss-app { position: fixed; bottom: 20px; left: 20px; width: 270px; background: #1b1b1b; color: #ddd; z-index: 9999999; font: 12px sans-serif; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.7); border: 1px solid #333; }
                .vss-hd { padding: 8px 10px; background: #2a2a2a; border-bottom: 1px solid #333; display: flex; justify-content: space-between; border-radius: 6px 6px 0 0; cursor: move; font-weight: bold; }
                .vss-bd { padding: 10px; }
                .vss-btn { width: 100%; padding: 7px; border: none; border-radius: 3px; cursor: pointer; color: #fff; margin-bottom: 5px; background: #333; transition: 0.2s; }
                .vss-btn:hover { background: #444; } .vss-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .vss-pri { background: #007acc; } .vss-pri:hover { background: #0062a3; }
                .vss-suc { background: #2ea043; } .vss-suc:hover { background: #238636; }
                .vss-dan { background: #da3633; } .vss-dan:hover { background: #b62324; }
                .vss-list { max-height: 200px; overflow-y: auto; background: #111; border: 1px solid #333; margin-bottom: 8px; border-radius: 3px; }
                .vss-item { display: flex; padding: 4px; border-bottom: 1px solid #222; align-items: center; }
                .vss-th { width: 60px; height: 34px; object-fit: cover; background: #000; margin-right: 5px; }
                .vss-meta { flex: 1; display: flex; flex-direction: column; gap: 2px; }
                .vss-row { display: flex; gap: 5px; }
                .vss-inp { width: 100%; background: #222; border: 1px solid #444; color: #fff; padding: 4px; border-radius: 2px; box-sizing: border-box; }
                .vss-tm { background: #222; border: 1px solid #444; color: #aaa; width: 100%; font-size: 10px; text-align: center; }
                .vss-ic { padding: 1px 5px; font-size: 10px; cursor: pointer; border: none; border-radius: 2px; background: #444; color: #fff; }
                .vss-set { margin-top: 8px; padding-top: 8px; border-top: 1px solid #333; display: none; }
                .vss-field { margin-bottom: 8px; }
                .vss-lbl { display: block; color: #888; font-size: 10px; margin-bottom: 3px; }
                .vss-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10; border-radius: 6px; }
            `;
            document.head.appendChild(Dom.el('style', {id:'vss-css'}, [css]));
        }
    };

    // ==========================================
    // 4. 应用控制器 (App Controller)
    // ==========================================
    const App = {
        root: null,
        els: {},

        init: () => {
            if (document.getElementById('vss-app')) return;
            Dom.injectCss();
            App.render();
            App.bindDrag();
        },

        // --- 动作 ---

        actionCapture: (replaceIdx = -1) => {
            const v = Core.findVideo();
            if (!v) return alert(T.noVid);
            const f = Core.capture(v);
            if (replaceIdx >= 0) State.frames[replaceIdx] = f;
            else State.frames.push(f);
            App.refreshList();
        },

        // 核心：批量处理
        actionBatch: async () => {
            const v = Core.findVideo();
            if (!v) return alert(T.noVid);

            const times = Core.calcBatchTimes(State.config.batchStr);
            if (!times) return alert(T.invFmt);

            // 锁定 UI
            State.isBatching = true;
            App.toggleOverlay(true, T.batching.replace('$current', 0).replace('$total', times.length));

            const originalTime = v.currentTime;
            const wasPaused = v.paused;
            v.pause(); // 强制暂停

            try {
                for (let i = 0; i < times.length; i++) {
                    App.toggleOverlay(true, T.batching.replace('$current', i + 1).replace('$total', times.length));
                    await Core.waitSeek(v, times[i]); // 等待跳转
                    const f = Core.capture(v);
                    State.frames.push(f);
                    App.refreshList(); // 实时更新列表
                }
            } catch (e) {
                console.error(e);
            } finally {
                // 恢复状态
                v.currentTime = originalTime;
                if (!wasPaused) v.play(); // 恢复播放
                State.isBatching = false;
                App.toggleOverlay(false);
                alert(T.done);
            }
        },

        actionGenerate: () => {
            if (!State.frames.length) return;
            try {
                const cvs = Core.stitch(State.frames, State.config);
                cvs.toBlob(b => Dom.download(b, Core.formatName(State.config.fileName)));
            } catch(e) { alert(T.cors); }
        },

        // --- 渲染 ---

        render: () => {
            const h = Dom.el('div', { className:'vss-hd', ondblclick: App.toggleCollapse }, [
                Dom.el('span', {}, [T.title]),
                Dom.el('div', {}, [
                    Dom.el('span', {onclick: App.toggleCollapse, style:{cursor:'pointer', padding:'0 5px'}}, ['_']),
                    Dom.el('span', {onclick:()=>App.root.remove(), style:{cursor:'pointer'}}, ['✕'])
                ])
            ]);

            App.els.list = Dom.el('div', { className: 'vss-list' });
            App.els.count = Dom.el('span', {}, ['0']);
            App.els.overlay = Dom.el('div', { className: 'vss-overlay', style:{display:'none'} }, ['Processing...']);

            // Settings Fields
            const mkInp = (lbl, key, type='text', ph='') => {
                const inp = Dom.el('input', {className:'vss-inp', type:type, value:State.config[key], placeholder:ph});
                inp.onchange = e => { State.config[key]=e.target.value; Store.set(key, e.target.value); };
                return Dom.el('div', {className:'vss-field'}, [Dom.el('span', {className:'vss-lbl'}, [lbl]), inp]);
            };

            const batchPanel = Dom.el('div', {className:'vss-field', style:{borderTop:'1px dashed #444', paddingTop:'8px'}}, [
                Dom.el('span', {className:'vss-lbl', style:{color:'#4da6ff'}}, [T.batch]),
                Dom.el('input', {
                    className:'vss-inp', type:'text', placeholder:T.batchPh, value:State.config.batchStr,
                    onchange: e => { State.config.batchStr=e.target.value; Store.set('batchStr', e.target.value); }
                }),
                Dom.el('button', {className:'vss-btn vss-pri', style:{marginTop:'5px', fontSize:'11px'}, onclick: App.actionBatch}, [T.batchBtn])
            ]);

            const setPanel = Dom.el('div', {className:'vss-set', id:'vss-set'}, [
                Dom.el('div', {className:'vss-field'}, [
                    Dom.el('span', {className:'vss-lbl'}, [T.mode]),
                    Dom.el('label', {style:{marginRight:'10px'}}, [
                        Dom.el('input', {type:'radio', name:'vm', checked:State.config.mode==='overlap', onchange:()=>{State.config.mode='overlap';Store.set('mode','overlap');}}), T.mSub
                    ]),
                    Dom.el('label', {}, [
                        Dom.el('input', {type:'radio', name:'vm', checked:State.config.mode==='parallel', onchange:()=>{State.config.mode='parallel';Store.set('mode','parallel');}}), T.mSeq
                    ])
                ]),
                mkInp(T.fname, 'fileName', 'text', 'Capture_$date'),
                mkInp(T.pct, 'overlap', 'number'),
                mkInp(T.sel, 'selector', 'text'),
                batchPanel
            ]);

            const btnSet = Dom.el('button', {className:'vss-btn', onclick:()=>{
                const s = document.getElementById('vss-set'); s.style.display = s.style.display==='block'?'none':'block';
            }}, [T.set]);

            App.els.body = Dom.el('div', { className:'vss-bd' }, [
                App.els.overlay,
                Dom.el('button', {className:'vss-btn vss-pri', onclick:()=>App.actionCapture()}, [T.cap]),
                Dom.el('div', {style:{fontSize:'10px', color:'#888', marginBottom:'3px'}}, ['Count: ', App.els.count]),
                App.els.list,
                Dom.el('div', {className:'vss-row'}, [
                    Dom.el('button', {className:'vss-btn vss-suc', onclick:App.actionGenerate}, [T.gen]),
                    Dom.el('button', {className:'vss-btn vss-dan', onclick:()=>{if(confirm('?')){State.frames=[];App.refreshList();}}}, [T.clr])
                ]),
                btnSet,
                setPanel
            ]);

            App.root = Dom.el('div', { id:'vss-app' }, [h, App.els.body]);
            document.body.appendChild(App.root);
        },

        refreshList: () => {
            App.els.list.textContent = '';
            App.els.count.textContent = State.frames.length;
            State.frames.forEach((f, i) => {
                const img = Dom.el('img', {className:'vss-th', src:f.thumb});
                const tm = Dom.el('input', {className:'vss-tm', value:Dom.fmtTime(f.time)});
                tm.onkeydown = e => {
                    if(e.key==='Enter') {
                        const t = Core.parseTime(e.target.value);
                        if(State.videoEl && isFinite(t)) State.videoEl.currentTime = t;
                    }
                };
                const row = Dom.el('div', {className:'vss-item'}, [
                    img,
                    Dom.el('div', {className:'vss-meta'}, [
                        tm,
                        Dom.el('div', {style:{display:'flex', gap:'2px', justifyContent:'flex-end'}}, [
                            Dom.el('button', {className:'vss-ic vss-pri', onclick:()=>App.actionCapture(i)}, ['📷']),
                            Dom.el('button', {className:'vss-ic', onclick:()=>{
                                if(i>0) {[State.frames[i],State.frames[i-1]]=[State.frames[i-1],State.frames[i]];App.refreshList();}
                            }}, ['↑']),
                            Dom.el('button', {className:'vss-ic vss-dan', onclick:()=>{State.frames.splice(i,1);App.refreshList();}}, ['✕'])
                        ])
                    ])
                ]);
                App.els.list.appendChild(row);
            });
            App.els.list.scrollTop = App.els.list.scrollHeight;
        },

        toggleOverlay: (show, text) => {
            App.els.overlay.style.display = show ? 'flex' : 'none';
            if(text) App.els.overlay.textContent = text;
        },
        toggleCollapse: () => {
            State.config.isCollapsed = !State.config.isCollapsed;
            App.els.body.style.display = State.config.isCollapsed ? 'none' : 'block';
        },
        bindDrag: () => {
            let isD = false, dx, dy;
            const h = App.root.querySelector('.vss-hd');
            h.onmousedown = e => { isD=true; dx=e.clientX-App.root.offsetLeft; dy=e.clientY-App.root.offsetTop; };
            document.onmousemove = e => { if(isD){App.root.style.left=(e.clientX-dx)+'px';App.root.style.top=(e.clientY-dy)+'px';}};
            document.onmouseup = () => isD=false;
        }
    };

    const Main = () => {
        const obs = new MutationObserver(() => {
            if(document.querySelector('video') || document.querySelector(State.config.selector)) {
                Core.findVideo(); App.init(); obs.disconnect();
            }
        });
        obs.observe(document.body, {childList:true, subtree:true});
    };
    setTimeout(Main, 1000);
})();