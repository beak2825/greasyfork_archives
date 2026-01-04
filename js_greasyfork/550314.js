// ==UserScript==
// @name         StreamWatch - 流媒体监控
// @name:zh-CN   StreamWatch - 流媒体监控  
// @description:zh-CN  监控和检测网页中的流媒体加载情况
// @author       MissChina
// @match        *://*/*
// @grant        none
// @namespace    https://github.com/MissChina/StreamWatch
// @version      3.2.0
// @icon         https://github.com/MissChina/StreamWatch/raw/main/streamwatch.png
// @license      Custom License - No Commercial Use, Attribution Required
// @homepageURL  https://github.com/MissChina/StreamWatch
// @supportURL   https://github.com/MissChina/StreamWatch/issues
// @description Monitor and detect streaming media loading on web pages
// @downloadURL https://update.greasyfork.org/scripts/550314/StreamWatch%20-%20%E6%B5%81%E5%AA%92%E4%BD%93%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/550314/StreamWatch%20-%20%E6%B5%81%E5%AA%92%E4%BD%93%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const CONFIG={VERSION:'3.2.0',SCAN_INTERVAL:3000,MAX_STREAMS:100,TOAST_DURATION:2000,AUTO_HIDE_DELAY:3000};

    class StreamWatch{
        constructor(){
            this.streams=new Map();
            this.isActive=false;
            this.scanTimer=null;
            this.hideTimer=null;

            this.initUI();
            this.bindUIEvents();
            this.interceptNetwork();
            this.hookHls();
            setTimeout(()=>this.toggleMonitoring(),1000);

            console.log(`🎬 StreamWatch v${CONFIG.VERSION} 已启动`);
        }

        analyzeUrl(url){
            if(!url || this.streams.has(url)) return;
            if(url.includes('.m3u8')) this.addStream(url,'m3u8');
            else if(url.match(/\.(mp4|webm|mov|mkv|mpd)([?#].*)?$/i)) this.addStream(url,'video');
        }

        addStream(url,type){
            if(this.streams.size>=CONFIG.MAX_STREAMS) return;
            const s={url,type,title:this.getTitle(url)};
            this.streams.set(url,s);
            this.renderStream(s);
            this.showToast(`检测到 ${type.toUpperCase()} 流`);
        }

        getTitle(url){ try{return new URL(url).pathname.split('/').pop()||new URL(url).hostname;}catch{return url.slice(0,30);} }

        interceptNetwork(){
            const origFetch=window.fetch;
            window.fetch=async(...args)=>{
                const resp=await origFetch(...args);
                try{
                    const ct=resp.headers.get('content-type')||'';
                    const clone=resp.clone();
                    if(ct.includes('mpegurl')) this.addStream(resp.url,'m3u8');
                    else clone.text().then(t=>{if(t.startsWith('#EXTM3U')) this.addStream(resp.url,'m3u8');}).catch(()=>{});
                }catch{}
                return resp;
            };
            const origOpen=XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open=function(m,url,...r){ this._sw_url=url; return origOpen.call(this,m,url,...r); };
            const origSend=XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send=function(...r){
                this.addEventListener('load',()=>{
                    try{
                        const ct=this.getResponseHeader('content-type')||'';
                        if(ct.includes('mpegurl')||(this.responseText&&this.responseText.startsWith('#EXTM3U')))
                            window.streamWatch?.addStream(this._sw_url,'m3u8');
                    }catch{}
                });
                return origSend.apply(this,r);
            };
        }

        hookHls(){
            setInterval(()=>{
                if(window.Hls&&window.Hls.isSupported&&!window.Hls._patched){
                    const origLoad=window.Hls.prototype.loadSource;
                    window.Hls.prototype.loadSource=function(url){ window.streamWatch?.addStream(url,'m3u8'); return origLoad.call(this,url); };
                    window.Hls._patched=true;
                    console.log('[StreamWatch] Hls.js 已挂钩');
                }
            },2000);
        }

        initUI(){
            const style=document.createElement('style');
            style.innerHTML=`
            /* iOS 26 Liquid Glass 风格 */
            #sw-panel{
                position:fixed;top:60px;right:20px;width:300px;background:rgba(255,255,255,0.15);
                color:#fff;font-size:13px;border-radius:16px;
                box-shadow:0 12px 28px rgba(0,0,0,0.4);
                display:none;z-index:999999;overflow:hidden;resize:both;
                backdrop-filter:blur(16px) saturate(180%) contrast(120%);
                transition:opacity 0.3s, transform 0.2s;
            }

            #sw-panel header{
                background:linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05));
                padding:8px 12px;display:flex;justify-content:space-between;align-items:center;
                font-weight:bold;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.4);
                border-bottom:1px solid rgba(255,255,255,0.2);
                border-top-left-radius:16px;border-top-right-radius:16px;
            }

            #sw-list{padding:8px;max-height:220px;overflow:auto;}

            #sw-list div{
                padding:6px;margin-bottom:6px;background:rgba(255,255,255,0.1);
                border-left:4px solid #4caf50;border-radius:8px;
                box-shadow:0 4px 10px rgba(0,0,0,0.2);transition:background 0.2s, transform 0.2s;
            }

            #sw-list div:hover{
                background:rgba(255,255,255,0.2);
                transform:translateX(2px);
            }

            #sw-panel footer{
                padding:6px;text-align:right;border-top:1px solid rgba(255,255,255,0.2);
            }

            #sw-panel button{
                background:linear-gradient(135deg,#4caf50,#81c784);
                color:#fff;border:none;padding:4px 8px;margin-left:4px;
                border-radius:8px;cursor:pointer;font-size:12px;transition:background 0.2s, transform 0.2s;
            }

            #sw-panel button:hover{
                background:linear-gradient(135deg,#81c784,#66bb6a);
                transform:scale(1.05);
            }

            #sw-fab{
                position:fixed;bottom:20px;right:20px;width:52px;height:52px;
                border-radius:50%;background:linear-gradient(135deg,#ff8a65,#ff7043);
                color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;
                cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,0.6);transition:transform 0.2s, box-shadow 0.2s;
            }

            #sw-fab:hover{
                transform:scale(1.2);
                box-shadow:0 10px 28px rgba(0,0,0,0.8);
            }
            `;
            document.head.appendChild(style);

            const panel=document.createElement('div'); panel.id='sw-panel';
            panel.innerHTML=`
                <header>
                    StreamWatch v${CONFIG.VERSION}
                    <div>
                        <button id="sw-min">—</button>
                        <button id="sw-close">✖</button>
                    </div>
                </header>
                <div id="sw-list"><em>等待检测流媒体...</em></div>
                <footer>
                    <button id="sw-export">导出</button>
                    <button id="sw-clear">清空</button>
                </footer>
            `;
            document.body.appendChild(panel);

            const fab=document.createElement('div'); fab.id='sw-fab'; fab.textContent='🎬';
            document.body.appendChild(fab);

            // 拖拽
            let isDragging=false,offsetX=0,offsetY=0;
            const header=panel.querySelector('header');
            header.style.cursor='move';
            header.addEventListener('mousedown',e=>{isDragging=true; offsetX=e.clientX-panel.offsetLeft; offsetY=e.clientY-panel.offsetTop;});
            document.addEventListener('mousemove',e=>{if(isDragging){panel.style.left=e.clientX-offsetX+'px';panel.style.top=e.clientY-offsetY+'px';panel.style.right='auto';}});
            document.addEventListener('mouseup',()=>{isDragging=false;});

            // 自动半透明隐藏
            const resetHideTimer=()=>{
                panel.style.opacity='1';
                if(this.hideTimer) clearTimeout(this.hideTimer);
                this.hideTimer=setTimeout(()=>{panel.style.opacity='0.3';},CONFIG.AUTO_HIDE_DELAY);
            };
            panel.addEventListener('mousemove',resetHideTimer);
            panel.addEventListener('mouseenter',()=>panel.style.opacity='1');
            panel.addEventListener('mouseleave',resetHideTimer);
        }

        bindUIEvents(){
            const panel=document.getElementById('sw-panel'),fab=document.getElementById('sw-fab');
            fab.addEventListener('click',()=>{panel.style.display='block'; fab.style.display='none';});
            document.getElementById('sw-min').addEventListener('click',()=>{panel.style.display='none'; fab.style.display='flex';});
            document.getElementById('sw-close').addEventListener('click',()=>{panel.style.display='none'; fab.style.display='flex';});
            document.getElementById('sw-clear').addEventListener('click',()=>this.clearStreams());
            document.getElementById('sw-export').addEventListener('click',()=>this.exportData());
        }

        renderStream(s){
            const list=document.getElementById('sw-list'),item=document.createElement('div');
            item.innerHTML=`<div><strong>${s.title}</strong> <small>[${s.type}]</small></div>
                <div style="word-break:break-all;color:#eee;">${s.url}</div>
                <button onclick="navigator.clipboard.writeText('${s.url}')">复制</button>
                <button onclick="navigator.clipboard.writeText('${this.getFFmpeg(s.url,s.type)}')">FFmpeg</button>`;
            if(list.querySelector('em')) list.innerHTML='';
            list.appendChild(item);
        }

        clearStreams(){ this.streams.clear(); document.getElementById('sw-list').innerHTML='<em>等待检测流媒体...</em>'; this.showToast('已清空'); }

        exportData(){
            if(this.streams.size===0) return this.showToast('没有可导出数据');
            const blob=new Blob([JSON.stringify([...this.streams.values()],null,2)],{type:'application/json'});
            const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`streamwatch_${Date.now()}.json`; a.click(); this.showToast('导出成功');
        }

        showToast(msg){
            const t=document.createElement('div'); t.textContent=msg;
            t.style=`position:fixed;bottom:80px;right:20px;background:rgba(0,0,0,0.7);padding:6px 12px;border-radius:8px;color:#fff;z-index:100000;opacity:0.95;font-weight:bold;backdrop-filter:blur(4px);`;
            document.body.appendChild(t); setTimeout(()=>t.remove(),CONFIG.TOAST_DURATION);
        }

        toggleMonitoring(){ this.isActive=!this.isActive; this.isActive?this.startScan():this.stopScan(); this.showToast(this.isActive?'开始监控':'停止监控'); }

        startScan(){ this.scanTimer=setInterval(()=>{ document.querySelectorAll('video, audio, source').forEach(el=>{ if(el.src)this.analyzeUrl(el.src); if(el.currentSrc)this.analyzeUrl(el.currentSrc); }); },CONFIG.SCAN_INTERVAL); }

        stopScan(){ if(this.scanTimer) clearInterval(this.scanTimer); }

        getFFmpeg(url,type){ return type==='m3u8'?`ffmpeg -i "${url}" -c copy -bsf:a aac_adtstoasc output.mp4`:`ffmpeg -i "${url}" -c copy output.mp4`; }
    }

    if(!window.streamWatch) window.streamWatch=new StreamWatch();
})();
