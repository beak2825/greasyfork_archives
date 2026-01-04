// ==UserScript==
// @name         Apple Store iPhone 库存监控33 (增强UI+Clash代理版+切换模式)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  自动捕获 Apple fulfillment-messages 请求并循环查询库存，支持 Bark 推送、强制周边监控、自动刷新、Clash代理切换(顺序/随机)和UI配置
// @match        https://www.apple.com/*/shop/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552011/Apple%20Store%20iPhone%20%E5%BA%93%E5%AD%98%E7%9B%91%E6%8E%A733%20%28%E5%A2%9E%E5%BC%BAUI%2BClash%E4%BB%A3%E7%90%86%E7%89%88%2B%E5%88%87%E6%8D%A2%E6%A8%A1%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552011/Apple%20Store%20iPhone%20%E5%BA%93%E5%AD%98%E7%9B%91%E6%8E%A733%20%28%E5%A2%9E%E5%BC%BAUI%2BClash%E4%BB%A3%E7%90%86%E7%89%88%2B%E5%88%87%E6%8D%A2%E6%A8%A1%E5%BC%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========= 默认配置 =========
    const defaultConfig = {
        interval: 30,
        jitter: 30,
        enable_bark: true,
        bark_key: "idxxxxxxxxxxxxxxxxxxxxx",
        bark_url: "https://www.apple.com/jp/shop/bag",
        send_test_bark: true,
        heartbeat: 0,
        auto_refresh: true,
        refresh_delay: 30,
        force_nearby: true,
        clash_enable: false,
        clash_api: "http://127.0.0.1:60839",
        clash_secret: "3c8db994-ad84-4a16-8084-fa98743190a9",
        clash_group: "GLOBAL",
        proxy_mode: "random", // 新增：代理切换模式 (random / sequential)
        only_available_notify: false
    };

    // ========= 配置加载 =========
    let config = { ...defaultConfig, ...JSON.parse(localStorage.getItem("apple_config") || "{}") };
    function saveConfig() {
        localStorage.setItem("apple_config", JSON.stringify(config));
        log("✅ 配置已保存");
    }

    // ========= 状态变量 =========
    let currentProductTitle = "";
    let apiInfo = JSON.parse(localStorage.getItem("apple_api_info") || "{}");
    let successCount = 0;
    let monitoring = true;
    let errorCount = 0;
    let proxyIndex = 0; // 顺序模式索引

    // ========= UI =========
    function ensureUI() {
        let box = document.getElementById("apple-stock-box");
        if (!box) {
            box = document.createElement("div");
            box.id = "apple-stock-box";
            box.style = `
              position:fixed;right:10px;bottom:10px;width:420px;height:450px;
              background:#f5f5f7;color:#000;font-size:13px;
              padding:12px;z-index:999999;border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
              display: flex; flex-direction: column;
            `;
            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-weight:600;font-size:16px;color:#1d1d1f;">
                    <span>🍎 Apple库存监控</span>
                    <button id="apple-config-btn" style="font-size:14px;background:none;border:none;cursor:pointer;color:#0071e3;">⚙ 配置</button>
                </div>
                <div style="display:flex;align-items:center;margin-bottom:8px;">
                    <button id="cfg-toggle" style="font-size:14px;padding:6px 12px;border-radius:8px;border:1px solid #0071e3;background:#e5f0ff;color:#0071e3;cursor:pointer;">⏯ 启动/暂停</button>
                    <div id="apple-current-product" style="margin-left:12px;font-weight:700;white-space: pre-wrap;color:#1d1d1f;flex:1;"></div>
                </div>
                <div id="apple-log-box" style="flex:1;max-height:220px;overflow-y:auto;border:1px solid #d2d2d7;background:#fff;color:#3c3c4399;padding:8px;border-radius:8px;font-size:13px;line-height:1.4;"></div>
                <div id="apple-config-panel" style="display:none;margin-top:10px;background:#fff;padding:12px;border:1px solid #d2d2d7;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);color:#1d1d1f;font-size:13px;max-height:200px;overflow-y:auto;">
                    <label><input id="cfg-enable-bark" type="checkbox" ${config.enable_bark?"checked":""}> 启用Bark</label><br>
                    <label>🔑 Bark Key:<input id="cfg-bark-key" style="width:100%;" value="${config.bark_key}"></label>
                    <label>跳转URL:<input id="cfg-bark-url" style="width:100%;" value="${config.bark_url}"></label>
                    <label>查询间隔:<input id="cfg-interval" type="number" value="${config.interval}" style="width:60px;"> 秒</label>
                    <label>随机偏移:<input id="cfg-jitter" type="number" value="${config.jitter}" style="width:60px;"> 秒</label>
                    <label>心跳间隔:<input id="cfg-heartbeat" type="number" value="${config.heartbeat}" style="width:60px;"> 次</label>
                    <label><input id="cfg-test-bark" type="checkbox" ${config.send_test_bark?"checked":""}> 启动测试通知</label>
                    <label><input id="cfg-only-available-notify" type="checkbox" ${config.only_available_notify?"checked":""}> 只发送有货通知</label>
                    <label><input id="cfg-auto-refresh" type="checkbox" ${config.auto_refresh?"checked":""}> 出错自动刷新</label>
                    <label>刷新延迟:<input id="cfg-refresh-delay" type="number" value="${config.refresh_delay}" style="width:60px;"> 秒</label>
                    <label><input id="cfg-force-nearby" type="checkbox" ${config.force_nearby?"checked":""}> 强制周边监控</label>
                    <hr>
                    <label><input id="cfg-clash-enable" type="checkbox" ${config.clash_enable?"checked":""}> 启用Clash代理</label><br>
                    <label>Clash API 地址:<input id="cfg-clash-api" style="width:100%;" value="${config.clash_api}"></label>
                    <label>Secret:<input id="cfg-clash-secret" style="width:100%;" value="${config.clash_secret}"></label>
                    <label>策略组:<select id="cfg-clash-group"><option>${config.clash_group}</option></select></label>
                    <button id="cfg-clash-refresh">🔄 获取策略组</button>
                    <label>切换模式:
                      <select id="cfg-proxy-mode">
                        <option value="random" ${config.proxy_mode==="random"?"selected":""}>随机</option>
                        <option value="sequential" ${config.proxy_mode==="sequential"?"selected":""}>顺序</option>
                      </select>
                    </label>
                    <hr>
                    <button id="cfg-save">💾 保存</button>
                    <button id="cfg-test">🔔 测试通知</button>
                    <button id="cfg-proxy-manual">🖐 切换代理</button>
                </div>
            `;
            document.body.appendChild(box);

            // 配置按钮
            document.getElementById("apple-config-btn").onclick=()=>{
                let panel=document.getElementById("apple-config-panel");
                panel.style.display=panel.style.display==="none"?"block":"none";
            };
            // 保存配置
            document.getElementById("cfg-save").onclick=()=>{
                config.bark_key=document.getElementById("cfg-bark-key").value.trim();
                config.enable_bark=document.getElementById("cfg-enable-bark").checked;
                config.bark_url=document.getElementById("cfg-bark-url").value.trim();
                config.interval=parseInt(document.getElementById("cfg-interval").value);
                config.jitter=parseInt(document.getElementById("cfg-jitter").value);
                config.heartbeat=parseInt(document.getElementById("cfg-heartbeat").value);
                config.send_test_bark=document.getElementById("cfg-test-bark").checked;
                config.only_available_notify=document.getElementById("cfg-only-available-notify").checked;
                config.auto_refresh=document.getElementById("cfg-auto-refresh").checked;
                config.refresh_delay=parseInt(document.getElementById("cfg-refresh-delay").value);
                config.force_nearby=document.getElementById("cfg-force-nearby").checked;
                config.clash_enable=document.getElementById("cfg-clash-enable").checked;
                config.clash_api=document.getElementById("cfg-clash-api").value.trim();
                config.clash_secret=document.getElementById("cfg-clash-secret").value.trim();
                config.clash_group=document.getElementById("cfg-clash-group").value.trim();
                config.proxy_mode=document.getElementById("cfg-proxy-mode").value;
                saveConfig();
            };
            document.getElementById("cfg-test").onclick=()=>barkNotify("test",[],"Apple库存监控已启动");
            document.getElementById("cfg-toggle").onclick=()=>{monitoring=!monitoring;log(monitoring?"▶️ 启动":"⏸ 暂停");};
            document.getElementById("cfg-clash-refresh").onclick=async()=>{
                const groups=await getClashGroups();
                if(groups.length){
                    const sel=document.getElementById("cfg-clash-group");
                    sel.innerHTML=groups.map(g=>`<option>${g}</option>`).join("");
                    log("✅ 策略组已更新: "+groups.join("、"));
                }else log("⚠ 未获取到策略组");
            };
            document.getElementById("cfg-proxy-manual").onclick=async()=>{
                log("🖐 手动触发代理切换");
                await switchProxy();
            };
        }
        const titleSpan=document.getElementById("apple-current-product");
        if(titleSpan) titleSpan.textContent=currentProductTitle?`【${currentProductTitle}】`:"";
    }

    function addUIMessage(msg){ensureUI();const box=document.getElementById("apple-log-box");const p=document.createElement("div");p.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;box.prepend(p);}
    function log(msg){console.log("[AppleStock]",msg);addUIMessage(msg);}

    // ========= Bark 推送 =========
    function barkNotify(type,stores=[],extra=""){
        if(!config.enable_bark||!config.bark_key)return;
        if(config.only_available_notify&&type!=="available")return;
        if(errorCount>2)return;
        let title,body,sound;let product=currentProductTitle?`【${currentProductTitle}】`:"";
        if(type==="available"){title=`🍏✅ 补货提醒！`;body=`🎉 ${product}店铺有货: `+stores.join("、");sound=`choo`;}
        else if(type==="error"){title=`⚠️ Apple库存异常`;body=`🚨 ${product}异常: `+extra;sound=`calypso`;}
        else if(type==="heartbeat"){title=`🟢 监控心跳`;body=`${product} 已成功查询 ${successCount} 次`;sound=`calypso`;}
        else if(type==="test"){title=`🔔 测试通知${product}`;body=extra;sound=`calypso`;}
        const url=`https://api.day.app/${config.bark_key}/${encodeURIComponent(title)}/${encodeURIComponent(body)}?sound=${encodeURIComponent(sound)}&url=${encodeURIComponent(config.bark_url)}`;
        fetch(url).then(()=>log(`📲 Bark通知已发送: ${title}`));
    }

    // ========= Clash 代理 =========
    async function getClashGroups(){
        if(!config.clash_enable)return[];
        try{
            const headers={};
            if(config.clash_secret)headers["Authorization"]="Bearer "+config.clash_secret;
            const res=await fetch(`${config.clash_api}/proxies`,{headers});
            const data=await res.json();
            return Object.keys(data.proxies).filter(k=>data.proxies[k].type==="Selector");
        }catch(e){log("❌ 获取Clash策略组失败: "+e);return[];}
    }
    async function switchProxy(){
        if(!config.clash_enable)return;
        try{
            const headers={"Content-Type":"application/json"};
            if(config.clash_secret)headers["Authorization"]="Bearer "+config.clash_secret;
            const res=await fetch(`${config.clash_api}/proxies`,{headers});
            const data=await res.json();
            const group=data.proxies[config.clash_group];
            if(!group||!group.all||group.all.length===0){log("⚠ 策略组为空");return;}
            let next;
            if(config.proxy_mode==="sequential"){
                next=group.all[proxyIndex % group.all.length];
                proxyIndex++;
            }else{
                next=group.all[Math.floor(Math.random()*group.all.length)];
            }
            await fetch(`${config.clash_api}/proxies/${config.clash_group}`,{method:"PUT",headers,body:JSON.stringify({name:next})});
            log(`🔄 已切换代理到: ${next} (模式:${config.proxy_mode})`);
        }catch(e){log("❌ Clash切换代理失败: "+e);}
    }

    // ========= API 捕获 =========
    function saveApi(url){
        if(config.force_nearby&&!url.includes("searchNearby=true")){
            url+=(url.includes("?")?"&":"?")+"searchNearby=true";
            log("🔧 已追加 searchNearby 参数");
        }
        apiInfo={url};
        localStorage.setItem("apple_api_info",JSON.stringify(apiInfo));
        log("✅ 已捕获 API");
    }
    const origFetch=window.fetch;
    window.fetch=async(...args)=>{const r=await origFetch(...args);try{const url=args[0];if(typeof url==="string"&&url.includes("fulfillment-messages"))saveApi(url);}catch(e){}return r;};

    // ========= 查询逻辑 =========
    async function queryStock(){
        if(!apiInfo.url){log("⚠ 尚未捕获 API...");return;}
        try{
            const res=await fetch(apiInfo.url,{credentials:"include"});
            if(!res.ok){
                errorCount++;
                if([401,503,541].includes(res.status)){barkNotify("error",[],`状态 ${res.status}`);await switchProxy();
                    if(config.auto_refresh){setTimeout(()=>{location.reload();},config.refresh_delay*1000);log("⚠ 自动刷新触发");}}
                return;
            }
            const data=await res.json();
            const stores=data?.body?.content?.pickupMessage?.stores||[];
            if(stores.length){
                const parts=Object.values(stores[0].partsAvailability||{});
                currentProductTitle=parts[0]?.messageTypes?.sticky?.storePickupProductTitle||"";
            }
            ensureUI();
            if(!stores.length){log("⚠ 未解析到店铺");return;}
            log(`解析到产品: ${currentProductTitle}，共 ${stores.length} 店`);
            let available=[];
            stores.forEach(s=>{
                const name=s.storeName||"未知";
                const postal=s.address?.postalCode||"未知邮编";
                let status="❌无货";
                for(let k in s.partsAvailability){if(s.partsAvailability[k].pickupDisplay==="available"){status="✅有货";available.push(`${name} (${postal})`);break;}}
                log(`${name} (${postal}): ${status}`);
            });
            if(available.length)barkNotify("available",available);
            if(errorCount>0){barkNotify("test",[],"✅ 已恢复正常");errorCount=0;}
            successCount++;if(config.heartbeat>0&&successCount%config.heartbeat===0)barkNotify("heartbeat");
        }catch(e){errorCount++;barkNotify("error",[],e.toString());if(config.auto_refresh){setTimeout(()=>{location.reload();},config.refresh_delay*1000);}}
    }

    // ========= 启动 =========
    if(config.send_test_bark&&config.enable_bark&&config.bark_key){barkNotify("test",[],"Apple库存监控已启动");}
    function loop(){if(monitoring)queryStock();const d=(config.interval+(Math.random()*2-1)*config.jitter)*1000;setTimeout(loop,d);}
    setInterval(ensureUI,2000);
    setTimeout(loop,5000);
})();
