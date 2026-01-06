// ==UserScript==
// @name:en-US         CCTV-HLS-Client
// @name               CCTV视频客户端解析
// @description:en-US  parse cctv video to hls url.
// @description        将CCTV视频解析成HLS地址.因CDN屏蔽,换成h5e接口下载,解密也请改成h5e方式
// @namespace          https://greasyfork.org/users/135090
// @version            1.1.5
// @author             [ZWB](https://greasyfork.org/zh-CN/users/863179)
// @license            CC
// @grant              none
// @run-at             document-end
// @match              *://live.ipanda.com/*/*/*/V*.shtml*
// @match              *://*.cctv.com/*/*/*/V*.shtml*
// @match              *://*.cctv.com/*/*/*/A*.shtml*
// @match              *://*.cctv.cn/*/*/*/V*.shtml*
// @match              *://*.cctv.cn/*/*/*/A*.shtml*
// @match              *://vdn.apps.cntv.cn/api/getHttpVideoInfo*
// @icon               https://tv.cctv.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/558396/CCTV%E8%A7%86%E9%A2%91%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/558396/CCTV%E8%A7%86%E9%A2%91%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
 
'use strict';
(async function () {
    if (location.hostname.indexOf("vdn.apps.cntv.cn") == -1) {
        setTimeout(()=>{
            if (window?.flashPlayerList?.length > 0){
                let vodList =[];
                let guidList=[];
                window?.flashPlayerList?.forEach(item=>{vodList?.push(item?.substring(12))});
                vodList?.forEach((i,n)=>{
                    guidList.push(window?.vodPlayerObjs[i]?.videoCenterId);
                    let newguid = guidList[n];
                    console.log(newguid)
                    let base = "https://vdn.apps.cntv.cn";
                    let pathname = "/api/getHttpVideoInfo.do";
                    let apihref = base + pathname + `?client=flash&im=0&pid=${newguid}`;
                    let bts = n * 40 + 20;
                    let btn = document.createElement("a");
                    btn.href = apihref;
                    btn.id = "btn" + n;
                    btn.type = "button";
                    btn.target = "_blank";
                    btn.textContent = "点击跳转到下载页"+(n+1);
                    btn.style = `
                    position: fixed;
                    z-index: 999;
                    bottom: ${bts}px;
                    right: 20px;
                    background-color: #f86336;
                    color: white;
                    padding: 5px;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    `;
                    document.body.appendChild(btn);
                })
            }
        },1500);
    }
 
    if (location.hostname.indexOf("vdn.apps.cntv.cn") > -1) {
        const data = await JSON.parse(document?.body?.textContent);
        let enc2url = new URL(data?.manifest?.hls_enc2_url);
        // ★将 enc2url.hostname 的值改成可用的enc2接口cdn域名
        enc2url.hostname = "drm.cntv.vod.dnsv1.com"; 
        // ★将 switchh5e 的值改成 非0 的数字,则使用h5e接口; switchh5e 的值为 0 时,则使用enc2接口
        let switchh5e = 1; 
        let h5eUrl = switchh5e == 0 ? enc2url.toString() : data?.manifest.hls_h5e_url;
        /*
        \u005c → \    \u002f → /    \u003a → :    \u002a → *
        \u003f → ?    \u003c → <    \u003e → >    \u007c → |
        \u0022 → "    \u0027 → '    \uff02 → ＂   \uff07 → ＇
        \u0020 →  (半角空格)         \u3000 →   (全角空格)
        ***将所有文件名"非法字符"和容易被隐式转换成半角的"全角字符"都替换成"_"
        */
        let hlsUrl = data?.hls_url;
        let orgtitle = data?.title + "_" + data?.play_channel;
        const clean = s => s.replace(/[\u005c\u002f\u003a\u002a\u003f\u003c\u003e\u007c\u0020\u0022\u0027\u3000\uff02\uff07]/g, '_');
        const title = clean(orgtitle);
        let brt = [450,850,1200,2000,4000];
        let brtnum = data?.video?.validChapterNum;
        let bi = (brtnum > 0 && brtnum < 3) ?  brtnum -1 : 1;
        let h5e = h5eUrl;
        let fnu = hlsUrl;
        let thisguid =  h5e.split("/")[10];
        document.body.innerHTML="<p id='ht'></p>";
        const mainResponse = await fetch(fnu);
        if (mainResponse.ok && mainResponse.status == 200){
            const m3u8Content = await mainResponse.text();
            /* CCTV-4K 频道才有 4000.m3u8; */
            if (data?.play_channel?.indexOf("CCTV-4K") == 0) {
                hlsUrl = data?.hls_url?.replaceAll("main", brt[4]);
                fnu = hlsUrl;
            }  else if(m3u8Content.includes("1200.m3u8")){
                hlsUrl = data?.hls_url?.replaceAll("main", brt[3]);
                fnu = hlsUrl;
            } else if (brtnum > 3){
                h5e = h5eUrl.replaceAll("main", brt[3]);
                let h5etag =document.createElement("p");
                let cdn = h5e.split("/")[2];
                h5etag.id = "h5etag";
                h5etag.textContent = cdn +"<->"+thisguid;
                h5etag.innerHTML += "<br>".concat(h5e.link(h5e));
                h5etag.style = `
                padding: 2px;
                border: none;
                font-size: 16px;`;
                document.querySelector("#ht").appendChild(h5etag);
                hlsUrl = data?.hls_url?.replaceAll("main", brt[1]);
                // ★若要下载未加密的850.m3u8,请删除'h5e || '使下一行代码变成 fnu = hlsUrl;
                fnu = h5e || hlsUrl; 
            } else {
                hlsUrl = data?.hls_url?.replaceAll("main", brt[bi]);
                fnu = hlsUrl;
            }
        } else if (mainResponse.status == 404){
            return 0;
        }
        if (mainResponse.status == 403) {
            document.body.innerHTML = "<p id='ht'></p><p>版权原因无法获取未加密版</p>";
            switch (brtnum){
                case 1 :
                    bi = brtnum - 1;
                    break;
                case 2 :
                    bi = brtnum - 1;
                    break;
                case 3 :
                    bi = brtnum - 2;
                    break;
                case 4 :
                    bi = brtnum - 1;
                    break;
                case 5 :
                    bi = brtnum - 2;
                    break;
                default :
                    bi = 0;
                    console.log();
            }
            let rh5e = h5eUrl.replaceAll("main", brt[bi]);
            let h5etag = document.createElement("p");
            let cdn = rh5e.split("/")[2];
            h5etag.id = "h5etag";
            h5etag.textContent = cdn +"<->"+thisguid;
            h5etag.innerHTML += "<br>".concat(rh5e.link(rh5e));
            h5etag.style = `
            padding: 2px;
            border: none;
            font-size: 16px;`;
            document.querySelector("#ht").appendChild(h5etag);
            if (confirm("是否开始下载?\r\n"+brt[bi])){
                await downloadM3U8Video(rh5e, title + '.ts', {
                    onProgress: (current, total) => {
                        let cotp = `${Math.round((current / total) * 100)}`;
                        ttt.textContent = title + "---下载进程" + cotp + "%";
                        console.info(`Progress: ${current}/${total} (${cotp}%)`);
                    }
                });
            }
        }
        let hlstag = document.createElement("a");
        hlstag.href = hlsUrl;
        hlstag.alt = hlsUrl;
        hlstag.id = "hlstag";
        hlstag.target = "_blank";
        hlstag.textContent = hlsUrl;
        hlstag.style = `
        padding: 2px;
        border: none;
        cursor: pointer;
        font-size: 16px;`;
        document.querySelector("#ht").appendChild(hlstag);
        let ttt = document.createElement("p");
        ttt.type = "button";
        ttt.onclick = function() {
            window.location.href = `https://app.cctv.com/special/m/livevod/index.html?guid=${thisguid}&vtype=2`;
        };
        ttt.id = "vtitle";
        ttt.textContent = title;
        ttt.style =`
        padding: 5px;
        border: none;
        cursor: pointer;
        font-size: 16px;`;
        document.body.appendChild(ttt);
        const downurl = new URL(fnu);
        const filename = downurl.pathname.split('/').pop();
        console.log(filename);
        if (confirm("是否开始下载?\r\n"+filename)){
            await downloadM3U8Video(fnu, title + '.ts', {
                onProgress: (current, total) => {
                    let cotp = `${Math.round((current / total) * 100)}`;
                    ttt.textContent = title + "---下载进程" + cotp + "%";
                    console.info(`Progress: ${current}/${total} (${cotp}%)`);
                }
            });
        }
    }
 
    async function downloadM3U8Video(m3u8Url, outputFilename = 'video.m2t', options = {}) {
        try {
            // 1. 获取并解析M3U8文件
            const response = await fetch(m3u8Url);
            if (!response.ok) throw new Error(`Failed to fetch M3U8: ${response.status}`);
 
            const m3u8Content = await response.text();
            const lines = m3u8Content.split('\n');
            const baseUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf("/") + 1);
            const segments = [];
 
            // 解析TS分片URL
            for (const line of lines) {
                if (line && !line.startsWith('#') && (line.endsWith('.ts') || line.match(/\.ts\?/))) {
                    const segmentUrl = line.startsWith('http') ? line : new URL(line, baseUrl).href;
                    segments.push(segmentUrl);
                }
            }
 
            if (segments.length === 0) throw new Error('No TS segments found in the M3U8 file');
            console.log(`Found ${segments.length} TS segments`);
 
            // 2. 下载所有分片
            console.log('Downloading segments...');
            const blobs = [];
            const { onProgress } = options;
 
            for (let i = 0; i < segments.length; i++) {
                try {
                    const segmentResponse = await fetch(segments[i]);
                    if (!segmentResponse.ok) throw new Error(`Failed to fetch segment: ${segmentResponse.status}`);
 
                    const blob = await segmentResponse.blob();
                    blobs.push(blob);
 
                    // 调用进度回调
                    if (typeof onProgress === 'function') {
                        onProgress(i + 1, segments.length);
                    }
                } catch (error) {
                    console.error(`Error downloading segment ${segments[i]}:`, error);
                    throw error; // 可以选择继续或抛出错误
                }
            }
 
            // 3. 合并并下载
            console.log('Merging and downloading...');
            const mergedBlob = new Blob(blobs, { type: 'video/mp2t' });
            const url = URL.createObjectURL(mergedBlob);
 
            const a = document.createElement('a');
            a.href = url;
            a.download = outputFilename;
            document.body.appendChild(a);
            a.click();
 
            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
 
            console.log('Download completed!');
            return true;
        } catch (error) {
            console.error('Error downloading M3U8 video:', error);
            throw error;
        }
    }
})();