// ==UserScript==
// @name         Sync loginUser Token to Server & update localStorage
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  上传 token，并把服务端返回的 token+timestamp 同步写回 localStorage.loginUser
// @match        http://admin.wash.ltd/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558473/Sync%20loginUser%20Token%20to%20Server%20%20update%20localStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/558473/Sync%20loginUser%20Token%20to%20Server%20%20update%20localStorage.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const serverUrl = 'https://ic.icic.icu/xiaolan/sync.php';

  function syncToken(){
    const raw = localStorage.getItem('loginUser');
    if(!raw) return console.warn('找不到 loginUser');
    let orig;
    try { orig = JSON.parse(raw); } catch(e){ return console.error('loginUser 不是 JSON'); }
    if(!orig.token) return console.error('loginUser 中无 token');

    console.log('[Sync] 上传 token：', orig.token);
    // 上传
    GM_xmlhttpRequest({
      method:'POST',
      url: serverUrl,
      headers:{ 'Content-Type':'application/json' },
      data: JSON.stringify({ loginUser: JSON.stringify({ token: orig.token }) }),
      onload(res){
        let ret;
        try{ ret = JSON.parse(res.responseText); }
        catch(e){ return console.error('返回不是 JSON：', res.responseText); }

        if(res.status===200 && ret.status==='success'){
          console.log('[Sync] 成功，服务端 timestamp：', ret.data.timestamp);
          // **把服务端的 token+timestamp 写回 localStorage**
          orig.token     = ret.data.token;
          orig.timestamp = ret.data.timestamp;
          localStorage.setItem('loginUser', JSON.stringify(orig));
          console.log('[Sync] 本地 loginUser 已更新为：', orig);
        } else {
          console.error('[Sync] 同步失败：', ret.message||res.statusText);
        }
      },
      onerror(err){
        console.error('[Sync] 请求出错：', err);
      }
    });
  }

  GM_registerMenuCommand('Sync & Update loginUser', syncToken);
})();
