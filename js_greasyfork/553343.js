// ==UserScript==
// @name         IYUU 可辅种数查看助手（优化版：优先页面hash，避免下载种子）
// @namespace    https://example.com/
// @version      2.6.1
// @description  优先使用页面hash或缓存hash，避免重复下载种子，显示来源并查询辅种数量，DOM就绪即可执行
// @match        http*://*/details*.php*
// @grant        GM_xmlhttpRequest
// @connect      api.iyuu.cn
// @downloadURL https://update.greasyfork.org/scripts/553343/IYUU%20%E5%8F%AF%E8%BE%85%E7%A7%8D%E6%95%B0%E6%9F%A5%E7%9C%8B%E5%8A%A9%E6%89%8B%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%9A%E4%BC%98%E5%85%88%E9%A1%B5%E9%9D%A2hash%EF%BC%8C%E9%81%BF%E5%85%8D%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553343/IYUU%20%E5%8F%AF%E8%BE%85%E7%A7%8D%E6%95%B0%E6%9F%A5%E7%9C%8B%E5%8A%A9%E6%89%8B%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%9A%E4%BC%98%E5%85%88%E9%A1%B5%E9%9D%A2hash%EF%BC%8C%E9%81%BF%E5%85%8D%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 页面中直接查找 hash ----------
    function getHashFromPage() {
        const hashRegex = /<b>Hash[码碼]:<\/b>&nbsp;([a-f0-9]{40})/i;
        const bodyHTML = document.body.innerHTML;
        const match = hashRegex.exec(bodyHTML);
        if(match && match[1]){
            console.log(`已找到页面hash: ${match[1]}`);
            return match[1];
        }
        return null;
    }

    // ---------- 从页面 URL 获取 torrent ID ----------
    function getTorrentIdFromUrl() {
        const urlParams = new URLSearchParams(location.search);
        return urlParams.get('id');
    }

    // ---------- 构造下载链接 ----------
    function getDownloadLinkById(id) {
        if(!id) return null;
        return `${location.origin}/download.php?id=${id}`;
    }

    // ---------- bencode info 字段解析 ----------
    function findInfoRange(bytes) {
        let pos = 0, n = bytes.length;
        function parseIntASCII(){let start=pos;while(pos<n && bytes[pos]>=0x30 && bytes[pos]<=0x39) pos++;if(start===pos) throw new Error('Expected number');return parseInt(new TextDecoder('ascii').decode(bytes.slice(start,pos)),10);}
        function parseString(){const len=parseIntASCII();if(bytes[pos]!==0x3A) throw new Error("Expected ':'");pos++;const start=pos;pos+=len;if(pos>n) throw new Error('String extends beyond EOF');return {start,end:pos};}
        function parseInteger(){if(bytes[pos]!==0x69) throw new Error('Expected i');pos++;let start=pos;if(bytes[pos]===0x2D) pos++;while(pos<n && bytes[pos]>=0x30 && bytes[pos]<=0x39) pos++;if(pos===start) throw new Error('Invalid integer');if(bytes[pos]!==0x65) throw new Error("Expected 'e'");pos++; }
        function parseList(){if(bytes[pos]!==0x6C) throw new Error('Expected l');pos++;while(pos<n && bytes[pos]!==0x65) parseElement();pos++; }
        function parseDict(){if(bytes[pos]!==0x64) throw new Error('Expected d');pos++;while(pos<n && bytes[pos]!==0x65){const key=parseString();const keyStr=new TextDecoder('utf-8').decode(bytes.slice(key.start,key.end));if(keyStr==='info'){const infoStart=pos;parseElement();const infoEnd=pos;return {infoStart,infoEnd,finished:true};}else parseElement();}pos++;return {finished:false};}
        function parseElement(){if(pos>=n) throw new Error('Unexpected EOF');const c=bytes[pos];if(c===0x69) parseInteger();else if(c===0x6C) parseList();else if(c===0x64){const res=parseDict();if(res && res.finished) return res;}else if(c>=0x30 && c<=0x39) parseString();else throw new Error('Unknown token at pos '+pos);return null;}
        const topRes=parseElement();if(topRes && topRes.finished) return {infoStart:topRes.infoStart,infoEnd:topRes.infoEnd};throw new Error('info字段未找到');
    }

    async function sha1Hex(arrayBufferOrUint8) {
        let buffer = arrayBufferOrUint8 instanceof Uint8Array ? arrayBufferOrUint8.buffer.slice(arrayBufferOrUint8.byteOffset,arrayBufferOrUint8.byteOffset+arrayBufferOrUint8.byteLength) : arrayBufferOrUint8;
        const digest = await crypto.subtle.digest('SHA-1', buffer);
        return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
    }

    // ---------- 显示 InfoHash + 来源，并查询辅种数量 ----------
    function displayHashAndSeedCount(hashHex, container, btn, source){
        let hashDiv = container.querySelector('.infohash-display');
        if(!hashDiv){
            hashDiv=document.createElement('div');
            hashDiv.className='infohash-display';
            hashDiv.style.cssText='margin-top:5px; font-weight:bold; color:#007acc; font-size:14px;';
            container.appendChild(hashDiv);
        }
        hashDiv.textContent='InfoHash: '+hashHex;

        let sourceDiv = container.querySelector('.infohash-source');
        if(!sourceDiv){
            sourceDiv=document.createElement('div');
            sourceDiv.className='infohash-source';
            sourceDiv.style.cssText='font-size:12px; color:#555; margin-top:2px;';
            container.appendChild(sourceDiv);
        }
        sourceDiv.textContent='来源: ' + source;

        // 查询辅种数量
        GM_xmlhttpRequest({
            method:'GET',
            url:`https://api.iyuu.cn/index.php?s=App.Api.GetSubject&info_hash=${hashHex}`,
            responseType:'json',
            onload:function(res){
                let msg='当前种子可辅种数量：未知';
                if(res && res.response && res.response.ret===200 && res.response.data && typeof res.response.data.tid_total!=='undefined'){
                    msg=`当前种子可辅种数量：${res.response.data.tid_total}`;
                }
                let countDiv = container.querySelector('.seedcount-display');
                if(!countDiv){
                    countDiv=document.createElement('div');
                    countDiv.className='seedcount-display';
                    countDiv.style.cssText='margin-top:3px; font-weight:bold; color:#d35400; font-size:14px;';
                    container.appendChild(countDiv);
                }
                countDiv.textContent=msg;

                if(btn){
                    btn.disabled = false;
                    btn.textContent='手动刷新辅种数量';
                }
            },
            onerror:function(err){
                let errDiv = container.querySelector('.seedcount-display');
                if(!errDiv){
                    errDiv=document.createElement('div');
                    errDiv.className='seedcount-display';
                    errDiv.style.cssText='margin-top:3px; font-weight:bold; color:red; font-size:14px;';
                    container.appendChild(errDiv);
                }
                errDiv.textContent='查询辅种失败';
                if(btn){
                    btn.disabled = false;
                    btn.textContent='手动刷新辅种数量';
                }
                console.error('GM_xmlhttpRequest 错误',err);
            }
        });
    }

    // ---------- 异步下载种子获取 InfoHash（仅在页面 hash 和缓存 hash 都不存在时） ----------
    async function fetchInfoHashAndSeedCount(torrentUrl, container, btn, torrentId){
        try {
            const resp = await fetch(torrentUrl,{method:'GET',credentials:'include'});
            if(!resp.ok) throw new Error('HTTP '+resp.status);
            const ab = await resp.arrayBuffer();
            const bytes = new Uint8Array(ab);
            const {infoStart,infoEnd} = findInfoRange(bytes);
            const infoBytes = bytes.slice(infoStart,infoEnd);
            const hashHex = await sha1Hex(infoBytes);

            localStorage.setItem(`hash_cache_${torrentId}`, hashHex);
            displayHashAndSeedCount(hashHex, container, btn, '来自种子链接下载');
        } catch(err){
            let errDiv = container.querySelector('.infohash-display');
            if(!errDiv){
                errDiv=document.createElement('div');
                errDiv.className='infohash-display';
                errDiv.style.cssText='margin-top:5px; font-weight:bold; color:red; font-size:14px;';
                container.appendChild(errDiv);
            }
            errDiv.textContent='提取 Hash 失败：'+(err.message||err);
            if(btn){
                btn.disabled = false;
                btn.textContent='手动刷新辅种数量';
            }
            console.error(err);
        }
    }

    // ---------- 插入按钮并自动触发 ----------
    function insertButtonForFirstLink(){
        const container=document.createElement('div');
        container.style.marginTop='5px';

        const btn=document.createElement('button');
        btn.textContent='手动提取 InfoHash 并查询辅种';
        btn.style.cssText='font-size:13px;font-weight:bold;padding:4px 10px;margin-bottom:5px;background-color:#27ae60;color:#fff;border:none;border-radius:4px;cursor:pointer;';
        container.appendChild(btn);

        const torrentId = getTorrentIdFromUrl();
        const firstLink = getDownloadLinkById(torrentId);
        if(firstLink) {
            const refNode = document.querySelector('a[href*="download.php"]') || document.body;
            refNode.insertAdjacentElement('afterend',container);
        }

        const doQuery = () => {
            btn.disabled = true;
            btn.textContent = '计算中...';

            const pageHash = getHashFromPage();
            const cacheKey = `hash_cache_${torrentId}`;
            const cachedHash = localStorage.getItem(cacheKey);

            if(pageHash){
                localStorage.setItem(cacheKey, pageHash);
                displayHashAndSeedCount(pageHash, container, btn, '来自页面');
            } else if(cachedHash){
                displayHashAndSeedCount(cachedHash, container, btn, '来自缓存');
            } else if(firstLink){
                fetchInfoHashAndSeedCount(firstLink, container, btn, torrentId);
            } else {
                btn.textContent='未找到下载链接和Hash';
                btn.disabled = false;
            }
        };

        btn.addEventListener('click', doQuery);
        setTimeout(doQuery, 200);
    }

    // ---------- DOMContentLoaded 优化 ----------
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', insertButtonForFirstLink);
    } else {
        insertButtonForFirstLink();
    }

})();
