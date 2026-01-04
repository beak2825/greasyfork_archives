// ==UserScript==
// @name         磁力发送到 qB 下载（98堂已测试/可能兼容Discuz）
// @name:en      Discuz Magnet Link Sender to qBittorrent
// @namespace    local.qb.discuz.dual
// @version      0.8
// @description  按钮 + 右键发送磁力到 qBittorrent
// @description:en Send magnet links in Discuz posts to qB WebUI (Button + Right-Click dual mode)
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/549874/%E7%A3%81%E5%8A%9B%E5%8F%91%E9%80%81%E5%88%B0%20qB%20%E4%B8%8B%E8%BD%BD%EF%BC%8898%E5%A0%82%E5%B7%B2%E6%B5%8B%E8%AF%95%E5%8F%AF%E8%83%BD%E5%85%BC%E5%AE%B9Discuz%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549874/%E7%A3%81%E5%8A%9B%E5%8F%91%E9%80%81%E5%88%B0%20qB%20%E4%B8%8B%E8%BD%BD%EF%BC%8898%E5%A0%82%E5%B7%B2%E6%B5%8B%E8%AF%95%E5%8F%AF%E8%83%BD%E5%85%BC%E5%AE%B9Discuz%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let qbAddr = GM_getValue("qbAddr","http://192.168.31.28:10098");
    let qbUser = GM_getValue("qbUser","admin");
    let qbPass = GM_getValue("qbPass","adminadmin");

    // ---------------- 菜单 ----------------
    GM_registerMenuCommand("配置 qB 地址/账号", ()=>{
        const addr = prompt("请输入 qB WebUI 地址", qbAddr);
        const user = prompt("请输入用户名", qbUser);
        const pass = prompt("请输入密码", qbPass);
        if(addr) GM_setValue("qbAddr", addr);
        if(user) GM_setValue("qbUser", user);
        if(pass) GM_setValue("qbPass", pass);
        qbAddr=addr; qbUser=user; qbPass=pass;
        alert("✅ 已保存配置");
    });

    GM_registerMenuCommand("测试并登录 qB", async ()=>{
        const ok = await loginQB();
        alert(ok ? "✅ 登录成功" : "❌ 登录失败");
    });

    // ---------------- 登录函数 ----------------
    async function loginQB(){
        return new Promise(resolve=>{
            GM_xmlhttpRequest({
                method:"POST",
                url:`${qbAddr}/api/v2/auth/login`,
                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                data:`username=${encodeURIComponent(qbUser)}&password=${encodeURIComponent(qbPass)}`,
                onload: res=>resolve(res.responseText.includes("Ok.")),
                onerror: ()=>resolve(false)
            });
        });
    }

    // ---------------- 发送函数 ----------------
    async function sendMagnetToQB(magnet){
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method:"POST",
                url:`${qbAddr}/api/v2/torrents/add`,
                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                data:`urls=${encodeURIComponent(magnet)}`,
                onload: res=>res.status===200?resolve():reject(new Error(res.responseText)),
                onerror: err=>reject(err)
            });
        });
    }

    // ---------------- 按钮模式 ----------------
    function attachButtonsAllCodeBlocks(){
        const codeBlocks = document.querySelectorAll('[id^="code_"]');
        codeBlocks.forEach(block=>{
            if(block.dataset.qbAttached) return;

            const lis = block.querySelectorAll('ol li');
            lis.forEach(li=>{
                const magnet = li.textContent.trim();
                if(!magnet.startsWith("magnet:?")) return;

                // 找到 li 的祖先上两级
                let targetParent = li.parentElement?.parentElement?.parentElement;
                if(!targetParent) return;

                // 避免重复
                if(targetParent.querySelector(`button.qb-btn[data-magnet="${magnet}"]`)) return;

                const btn = document.createElement('button');
                btn.textContent = '⤓';
                btn.className = 'qb-btn';
                btn.dataset.magnet = magnet;
                btn.style.cssText = 'margin:2px 4px;padding:0 6px;font-size:12px;line-height:18px;border-radius:4px;border:1px solid rgba(0,0,0,0.2);background:#f0f0f0;cursor:pointer;';

                targetParent.appendChild(btn);
            });

            block.dataset.qbAttached = "1";
        });


    }

    // ---------------- 点击事件 ----------------
    document.body.addEventListener('click', async e=>{
        if(e.target.matches('button.qb-btn')){
            const magnet = e.target.dataset.magnet;
            e.target.disabled = true;
            const old = e.target.textContent;
            e.target.textContent = '…';
            try{
                await sendMagnetToQB(magnet);
                e.target.textContent = '✓';
            }catch(err){
                alert('发送失败：'+err.message);
                e.target.textContent = '✕';
            }finally{
                setTimeout(()=>{ e.target.textContent=old;e.target.disabled=false;},1500);
            }
        }
    });

    // ---------------- 右键模式 ----------------
    GM_registerMenuCommand("📡 发送选中磁力到 qB", async ()=>{
        const selection = window.getSelection().toString().trim();
        if(!selection.startsWith("magnet:?")){
            alert("❌ 请选中正确的磁力链接！");
            return;
        }
        try{
            await sendMagnetToQB(selection);
            alert("✅ 已发送到 qB");
        }catch(err){
            alert("❌ 发送失败："+err.message);
        }
    });

    // ---------------- 扫描 & 监控 ----------------
    function scanAndAttach(){
        attachButtonsAllCodeBlocks();
    }
    scanAndAttach();
    const observer = new MutationObserver(scanAndAttach);
    observer.observe(document.body,{childList:true,subtree:true});
    setInterval(scanAndAttach,1500);

    console.log("✅ Discuz 磁力发送脚本已加载（按钮 + 右键双模式）");
})();
