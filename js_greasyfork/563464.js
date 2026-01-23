// ==UserScript==
// @name         DG-充提差统计
// @namespace    http://tampermonkey.net/
// @version      0.5.7
// @description  DG-充提差和拒绝比例统计（SPA兼容版）
// @author       Cisco
// @match        https://666d.dggamecms.com/*
// @icon         https://666d.dggamecms.com/favicon.ico
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563464/DG-%E5%85%85%E6%8F%90%E5%B7%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/563464/DG-%E5%85%85%E6%8F%90%E5%B7%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 只在主窗口执行
    if (window.self !== window.top) return;
    if (window.dgCpStatsInitialized) return;
    window.dgCpStatsInitialized = true;

    const NS = 'DG_CP';
    const gmGet = (k, def) => GM_getValue(`${NS}_${k}`, def);
    const gmSet = (k, v) => GM_setValue(`${NS}_${k}`, v);

    const config = {
        isProcessing: gmGet('isProcessing', false),
        panelCollapsed: gmGet('panelCollapsed', false),
        lastStats: gmGet('lastStats', {
            diffRatio: 0,
            rejectRatio: 0,
            rechargeAmount: 0,
            rechargeCount: 0,
            withdrawAmount: 0,
            withdrawCount: 0
        })
    };

    // ================== 样式 ==================
    GM_addStyle(`
        #${NS}_Panel{position:fixed;top:20px;right:20px;z-index:99999;background:white;padding:15px;border:1px solid #ddd;border-radius:5px;box-shadow:0 2px 12px rgba(0,0,0,0.2);font-family:Arial,sans-serif;width:360px;max-height:90vh;overflow-y:auto;transition:all 0.3s ease;}
        #${NS}_Panel.collapsed .${NS}_content{display:none;}
        #${NS}_Panel.collapsed{width:40px;height:40px;overflow:hidden;padding:5px;}
        #${NS}_ToggleBtn{position:absolute;top:5px;right:5px;width:30px;height:30px;border-radius:50%;border:none;background:#f0f0f0;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;z-index:100000;}
        #${NS}_ToggleBtn:hover{background:#e0e0e0;}
        .${NS}_statRow{display:flex;justify-content:space-between;padding:6px 8px;margin-bottom:8px;border-radius:4px;background:#fafafa;border-left:3px solid #409EFF;transition:all 0.2s;}
        .${NS}_statRow:nth-child(2){border-left-color:#67C23A;}
        .${NS}_statRow:nth-child(3){border-left-color:#E6A23C;}
        .${NS}_statRow span{font-size:13px;color:#606266;}
        .${NS}_statRow span.value{font-weight:bold;color:#303133;background:#f0f2f5;padding:3px 8px;border-radius:3px;min-width:80px;text-align:center;}
        .${NS}_button{width:100%;padding:10px;background:#409EFF;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;margin-bottom:10px;transition:background 0.3s;}
        .${NS}_button.stop{background:#F56C6C;}
        .${NS}_status{margin-top:10px;font-size:12px;color:#666;border-top:1px solid #eee;padding-top:8px;}
        .hidden{display:none !important;}
    `);

    // ================== 工具函数 ==================
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const formatNumber = num => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const parseAmount = t => parseFloat((t||'0').replace(/[^\d.-]/g,''))||0;
    const parseCount = t => parseInt((t||'0').replace(/[^\d]/g,''))||0;

    function getActiveIframe(){
        const iframes = document.querySelectorAll('iframe.J_iframe');
        for(const iframe of iframes){
            if(iframe.style.display !== 'none' && iframe.offsetParent !== null){
                try{
                    const doc = iframe.contentDocument || iframe.contentWindow?.document;
                    if(doc) return {iframe, doc};
                }catch(e){}
            }
        }
        return null;
    }

    async function waitIframeLoad(targetPath, timeout=15000){
        const end = Date.now() + timeout;
        while(Date.now() < end){
            const active = getActiveIframe();
            if(active){
                const {doc} = active;
                try{
                    const iframePath = new URL(doc.location.href).pathname;
                    if(iframePath.includes(targetPath) && doc.readyState === 'complete'){
                        await delay(1000);
                        return {iframe: active.iframe, doc};
                    }
                }catch(e){}
            }
            await delay(300);
        }
        return null;
    }

    async function waitSelector(selector, timeout=10000, parent=null){
        if(!parent){
            const active = getActiveIframe();
            parent = active ? active.doc : document;
        }
        const end = Date.now()+timeout;
        while(Date.now()<end){
            const el = parent.querySelector(selector);
            if(el) return el;
            await delay(200);
        }
        return null;
    }

    function updateStatus(text){
        const status = document.getElementById(`${NS}_Status`);
        if(status) status.textContent = text;
    }

    function updateStats(diffRatio, rejectRatio, rechargeAmount, rechargeCount, withdrawAmount, withdrawCount){
        const map = {
            diffRatio: diffRatio.toFixed(2)+'%',
            rejectRatio: rejectRatio.toFixed(2)+'%',
            rechargeAmount: formatNumber(rechargeAmount),
            rechargeCount: formatNumber(rechargeCount),
            withdrawAmount: formatNumber(withdrawAmount),
            withdrawCount: formatNumber(withdrawCount)
        };
        Object.entries(map).forEach(([k,v])=>{
            const el = document.getElementById(`${NS}_${k}`);
            if(el) el.textContent = v;
        });
        config.lastStats = {diffRatio, rejectRatio, rechargeAmount, rechargeCount, withdrawAmount, withdrawCount};
        gmSet('lastStats', config.lastStats);
    }

    // ================== 控制面板 ==================
    function createPanel(){
        if(document.getElementById(`${NS}_Panel`)) return;

        const panel = document.createElement('div');
        panel.id = `${NS}_Panel`;
        if(config.panelCollapsed) panel.classList.add('collapsed');

        const toggle = document.createElement('button');
        toggle.id = `${NS}_ToggleBtn`;
        toggle.innerHTML = config.panelCollapsed?'≡':'×';
        toggle.title = '收起/展开';
        toggle.type = 'button';
        panel.appendChild(toggle);

        const content = document.createElement('div');
        content.className = `${NS}_content`;
        content.innerHTML = `
        <h3 style="color:#409EFF;margin:0 0 10px 0;">📊 DG-充提差统计</h3>
        <div class="${NS}_statRow"><span>充提差比例</span><span class="value" id="${NS}_diffRatio">0%</span></div>
        <div class="${NS}_statRow"><span>拒绝比例</span><span class="value" id="${NS}_rejectRatio">0%</span></div>
        <div class="${NS}_statRow"><span>充值总金额</span><span class="value" id="${NS}_rechargeAmount">0</span></div>
        <div class="${NS}_statRow"><span>充值总人数</span><span class="value" id="${NS}_rechargeCount">0</span></div>
        <div class="${NS}_statRow"><span>提款总金额</span><span class="value" id="${NS}_withdrawAmount">0</span></div>
        <div class="${NS}_statRow"><span>提款总人数</span><span class="value" id="${NS}_withdrawCount">0</span></div>
        <div class="${NS}_statRow" style="display:none;"><span>CoinPay出款</span><span class="value" id="${NS}_coinpayAmount">0</span></div>
        <button id="${NS}_StartBtn" class="${NS}_button" type="button">开始统计</button>
        <button id="${NS}_StopBtn" class="${NS}_button stop hidden" type="button">停止统计</button>
        <div class="${NS}_status">📶 状态: <span id="${NS}_Status">待命</span></div>
        `;
        panel.appendChild(content);
        document.body.appendChild(panel);

        toggle.addEventListener('click', e=>{
            e.preventDefault();
            e.stopPropagation();
            panel.classList.toggle('collapsed');
            toggle.innerHTML = panel.classList.contains('collapsed')?'≡':'×';
            config.panelCollapsed = panel.classList.contains('collapsed');
            gmSet('panelCollapsed', config.panelCollapsed);
        });

        document.getElementById(`${NS}_StartBtn`).addEventListener('click', startStats);
        document.getElementById(`${NS}_StopBtn`).addEventListener('click', stopStats);

        updateStats(
            config.lastStats.diffRatio,
            config.lastStats.rejectRatio,
            config.lastStats.rechargeAmount,
            config.lastStats.rechargeCount,
            config.lastStats.withdrawAmount,
            config.lastStats.withdrawCount
        );
        updateButtons();
    }

    function updateButtons(){
        if(config.isProcessing){
            document.getElementById(`${NS}_StartBtn`).classList.add('hidden');
            document.getElementById(`${NS}_StopBtn`).classList.remove('hidden');
        }else{
            document.getElementById(`${NS}_StartBtn`).classList.remove('hidden');
            document.getElementById(`${NS}_StopBtn`).classList.add('hidden');
        }
    }

    // ================== 统计逻辑 ==================
    let abortCtrl = null;

    async function startStats(){
        if(config.isProcessing) return;
        config.isProcessing = true;
        gmSet('isProcessing', true);
        updateButtons();
        abortCtrl = new AbortController();
        try{
            await runStatsLoop(abortCtrl.signal);
        }catch(err){
            if(err.name!=='AbortError') console.error(err);
        }finally{
            config.isProcessing=false;
            gmSet('isProcessing', false);
            updateButtons();
            updateStatus('已停止');
        }
    }

    function stopStats(){
        if(!config.isProcessing) return;
        abortCtrl?.abort();
        config.isProcessing=false;
        gmSet('isProcessing',false);
        updateButtons();
        updateStatus('已停止');
    }

    async function runStatsLoop(signal){
        while(config.isProcessing && !signal.aborted){
            try{
                updateStatus('开始统计...');
                const withdrawStats = await getWithdrawStats();
                if(signal.aborted) break;
                const rechargeStats = await getRechargeStats();
                if(signal.aborted) break;
                const rejectStats = await getRejectStats();
                if(signal.aborted) break;

                // 计算充提差比例：（提现列表当日提款成功总数 - 当日coinpay提款总数）÷ 充值成功总数 * 100%
                let diffRatio = 0;
                if(rechargeStats.amount>0){
                    const diff = withdrawStats.totalAmount - withdrawStats.coinpayAmount;
                    diffRatio = diff/rechargeStats.amount*100;
                    logStep(`充提差比例计算: (${withdrawStats.totalAmount} - ${withdrawStats.coinpayAmount}) / ${rechargeStats.amount} * 100% = ${diffRatio.toFixed(2)}%`);
                }

                // 计算拒绝比例：当日coinpay提款成功总人数 ÷ 当日充值成功总人数 * 100%
                let rejectRatio = 0;
                if(rechargeStats.count>0){
                    rejectRatio = withdrawStats.coinpayCount/rechargeStats.count*100;
                    logStep(`拒绝比例计算: ${withdrawStats.coinpayCount} / ${rechargeStats.count} * 100% = ${rejectRatio.toFixed(2)}%`);
                }

                updateStats(diffRatio, rejectRatio, rechargeStats.amount, rechargeStats.count, withdrawStats.totalAmount, withdrawStats.totalCount);
                updateStatus('统计完成，10秒后重新统计...');
                await delay(10000);
            }catch(err){
                if(err.name==='AbortError') break;
                console.error(err);
                updateStatus('出错:'+err.message);
                await delay(5000);
            }
        }
    }

    // ================== 页面抓取函数 ==================
    async function setTodayDate(doc=document){
        // 重新获取最新的文档
        let currentDoc = doc;
        if(doc !== document && doc.defaultView && doc.defaultView.frameElement){
            const active = getActiveIframe();
            if(active && active.doc){
                currentDoc = active.doc;
                logStep('setTodayDate: 重新获取 iframe 文档');
            }
        }
        
        const now=new Date();
        const y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,'0'),d=String(now.getDate()).padStart(2,'0');
        const range = `${y}-${m}-${d} 00:00:00 - ${y}-${m}-${d} 23:59:59`;
        const dateInput=currentDoc.querySelector('input[name="queryDate"]');
        if(dateInput){
            dateInput.value=range;
            const startInput=currentDoc.querySelector('input[name="start_time"]');
            const endInput=currentDoc.querySelector('input[name="end_time"]');
            if(startInput) startInput.value=range.split(' - ')[0];
            if(endInput) endInput.value=range.split(' - ')[1];
            dateInput.dispatchEvent(new Event('change',{bubbles:true}));
            startInput?.dispatchEvent(new Event('change',{bubbles:true}));
            endInput?.dispatchEvent(new Event('change',{bubbles:true}));
            logStep(`设置日期范围: ${range}`);
        } else {
            logStep('未找到日期输入框');
        }
    }

    // ================== 工具函数 ==================
    function logStep(msg){
        console.log(`[DG-CP][${new Date().toLocaleTimeString()}] ${msg}`);
    }

    async function setSelectValue(id, val, doc = document, retries = 5) {
        for (let attempt = 0; attempt < retries; attempt++) {
            // 每次尝试都重新获取文档和元素，因为 DOM 可能已被替换
            let currentDoc = doc;
            // 如果 doc 是 iframe 文档，每次都重新获取最新的
            if(doc !== document){
                const active = getActiveIframe();
                if(active && active.doc){
                    currentDoc = active.doc;
                    if(attempt === 0){
                        logStep(`setSelectValue: 重新获取 iframe 文档来操作 #${id}`);
                    }
                }
            }
            
            const sel = currentDoc.querySelector(`#${id}`);
            if (!sel) { 
                logStep(`#${id} 元素未找到，等待重试 ${attempt + 1}/${retries}`);
                await delay(500); 
                continue; 
            }
            
            const targetIndex = Array.from(sel.options).findIndex(opt => opt.value === val);
            if (targetIndex === -1) {
                logStep(`选项值 ${val} 不存在于 #${id}`);
                return false;
            }
            
            // 先设置原生 select 的值
            sel.value = val;
            sel.selectedIndex = targetIndex;
            Array.from(sel.options).forEach((opt, idx) => opt.selected = idx === targetIndex);
            
            // 如果使用了 bootstrap-select 插件，需要使用其 API
            if (typeof $ !== 'undefined') {
                try {
                    const $sel = $(sel);
                    if ($sel.length && $sel.data('selectpicker')) {
                        // 使用 bootstrap-select API
                        $sel.selectpicker('val', val);
                        $sel.selectpicker('refresh');
                        logStep(`使用 bootstrap-select API 设置 #${id} = ${val}`);
                    } else if ($sel.length) {
                        // 使用 jQuery 方法
                        $sel.val(val);
                        $sel.trigger('change');
                    }
                } catch (e) {
                    logStep(`jQuery 设置失败: ${e.message}`);
                }
            }
            
            // 触发全部事件确保页面响应
            ['input','change','click','blur','focus'].forEach(e=>{
                sel.dispatchEvent(new Event(e,{bubbles:true}));
            });
            
            await delay(1000); // 增加延迟确保 bootstrap-select 更新
            
            // 重新获取元素来验证（因为 DOM 可能已更新）
            const verifySel = currentDoc.querySelector(`#${id}`);
            if(!verifySel){
                logStep(`验证时 #${id} 元素已消失，重试 ${attempt + 1}/${retries}`);
                await delay(500);
                continue;
            }
            
            const currentValue = verifySel.value;
            if(currentValue === val){
                logStep(`#${id} 已成功选中 ${val}`);
                return true;
            } else {
                logStep(`#${id} 验证失败: 期望=${val}, 实际=${currentValue}, 重试 ${attempt + 1}/${retries}`);
            }
        }
        logStep(`#${id} 选中 ${val} 失败`);
        return false;
    }

    async function clickSearchBtn(doc=document){
        // 重新获取最新的文档
        let currentDoc = doc;
        if(doc !== document){
            const active = getActiveIframe();
            if(active && active.doc){
                currentDoc = active.doc;
                logStep('clickSearchBtn: 重新获取 iframe 文档');
            }
        }
        
        logStep('准备点击查询按钮...');
        const form=currentDoc.querySelector('form#w0');
        if(!form) {
            logStep('未找到表单 form#w0');
            return;
        }
        const btn=form.querySelector('button[type="submit"]');
        if(!btn) {
            logStep('未找到查询按钮');
            return;
        }
        logStep('找到查询按钮，开始点击...');
        btn.click();
        logStep('查询按钮已点击，等待结果...');
        await delay(3000);
        await waitSelector('.box-body.table-responsive',10000, currentDoc);
        await delay(1000);
        logStep('查询结果已加载');
    }

    function extractStats(doc=document){
        // 重新获取最新的文档
        let currentDoc = doc;
        if(doc !== document){
            const active = getActiveIframe();
            if(active && active.doc){
                currentDoc = active.doc;
                logStep('extractStats: 重新获取 iframe 文档来提取统计数据');
            }
        }
        
        // 查找所有可能的统计信息容器
        const allDivs = currentDoc.querySelectorAll('.box-body.table-responsive');
        logStep(`extractStats: 找到 ${allDivs.length} 个 .box-body.table-responsive div`);
        
        let statsDiv = null;
        // 遍历所有 div，找到包含统计信息但不包含表格的那个
        for(const div of allDivs){
            const text = div.textContent || '';
            const html = div.innerHTML || '';
            
            // 检查是否包含统计关键词
            const hasAmount = /成功金额[：:]/.test(text);
            const hasCount = /成功人数[：:]/.test(text);
            
            // 检查是否包含表格、表单或输入元素
            const hasTable = div.querySelector('table') !== null;
            const hasForm = div.querySelector('form') !== null;
            const hasInput = div.querySelector('input, select') !== null;
            const hasTbody = div.querySelector('tbody') !== null;
            
            logStep(`extractStats: 检查 div - 有金额=${hasAmount}, 有人数=${hasCount}, 有表格=${hasTable}, 有表单=${hasForm}, 有输入=${hasInput}, 有tbody=${hasTbody}`);
            
            // 选择包含统计信息但不包含表格/表单/输入元素的 div
            if(hasAmount && hasCount && !hasTable && !hasForm && !hasInput && !hasTbody){
                statsDiv = div;
                logStep('extractStats: 找到统计信息 div');
                break;
            }
        }
        
        if(!statsDiv){
            logStep('extractStats: 未找到符合条件的统计信息 div，尝试使用第一个包含统计关键词的 div');
            // 如果没找到，尝试使用第一个包含统计关键词的 div
            for(const div of allDivs){
                const text = div.textContent || '';
                if(/成功金额[：:]/.test(text) && /成功人数[：:]/.test(text)){
                    statsDiv = div;
                    logStep('extractStats: 使用第一个包含统计关键词的 div');
                    break;
                }
            }
        }
        
        if(!statsDiv){
            logStep('extractStats: 未找到任何包含统计信息的 div');
            return {amount:0,count:0};
        }
        
        const text = statsDiv.textContent || '';
        const html = statsDiv.innerHTML || '';
        logStep(`extractStats: 统计文本内容: ${text.substring(0, 500)}`);
        logStep(`extractStats: 统计HTML内容: ${html.substring(0, 500)}`);
        
        // 尝试多种匹配模式，包括处理 <span class="red"> 标签
        const amountPatterns = [
            /成功金额[：:]\s*<span[^>]*class="red"[^>]*>\s*([\d.,]+)\s*<\/span>/i,
            /成功金额[：:]\s*<span[^>]*>\s*([\d.,]+)\s*<\/span>/i,
            /成功金额[：:]\s*([\d.,]+)/,
        ];
        
        const countPatterns = [
            /成功人数[：:]\s*<span[^>]*class="red"[^>]*>\s*([\d.,]+)\s*<\/span>/i,
            /成功人数[：:]\s*<span[^>]*>\s*([\d.,]+)\s*<\/span>/i,
            /成功人数[：:]\s*([\d.,]+)/,
        ];
        
        let amountMatch = null;
        let countMatch = null;
        
        // 先尝试从 HTML 匹配（更准确）
        for(const pattern of amountPatterns){
            amountMatch = html.match(pattern);
            if(amountMatch) {
                logStep(`extractStats: 金额匹配成功，使用模式: ${pattern}`);
                break;
            }
        }
        
        // 如果 HTML 匹配失败，尝试从文本匹配
        if(!amountMatch){
            for(const pattern of amountPatterns){
                amountMatch = text.match(pattern);
                if(amountMatch) {
                    logStep(`extractStats: 金额文本匹配成功，使用模式: ${pattern}`);
                    break;
                }
            }
        }
        
        for(const pattern of countPatterns){
            countMatch = html.match(pattern);
            if(countMatch) {
                logStep(`extractStats: 人数匹配成功，使用模式: ${pattern}`);
                break;
            }
        }
        
        if(!countMatch){
            for(const pattern of countPatterns){
                countMatch = text.match(pattern);
                if(countMatch) {
                    logStep(`extractStats: 人数文本匹配成功，使用模式: ${pattern}`);
                    break;
                }
            }
        }
        
        const amount = parseAmount(amountMatch?.[1]||'0');
        const count = parseCount(countMatch?.[1]||'0');
        
        logStep(`extractStats: 提取结果 - 成功金额=${amount}, 成功人数=${count}`);
        
        return {amount, count};
    }

    // ================== 抓取充值/提现/拒绝统计 ==================
    async function getWithdrawStats(){
        logStep('开始获取提现统计...');
        const active = getActiveIframe();
        let isTargetPage = false;
        if(active){
            try{isTargetPage = new URL(active.doc.location.href).pathname.includes('/finance/withdraw-pix/index');}catch{}
        }
        if(!isTargetPage){
            const menu = document.querySelector('a.J_menuItem[href="/finance/withdraw-pix/index"]');
            if(menu) menu.click();
            logStep('导航到提现页面...');
            await waitIframeLoad('/finance/withdraw-pix/index', 15000);
        }
        
        // 获取第一次查询的 iframe 文档
        let iframeDoc = getActiveIframe().doc;
        await waitSelector('form#w0',15000, iframeDoc);
        await setTodayDate(iframeDoc);
        await delay(500);
        await setSelectValue('searchmodel-status','2', iframeDoc);
        await clickSearchBtn(iframeDoc);
    
        // 点击查询后 DOM 完全更新，必须重新获取 iframe 文档
        logStep('查询后重新获取 iframe 文档...');
        await delay(2000); // 等待 DOM 更新
        const activeAfter = getActiveIframe();
        if(!activeAfter || !activeAfter.doc){
            logStep('无法获取 iframe 文档，重试...');
            await delay(2000);
            iframeDoc = getActiveIframe().doc;
        } else {
            iframeDoc = activeAfter.doc;
        }
        
        await waitSelector('form#w0', 10000, iframeDoc);
        const statsAll = extractStats(iframeDoc);
        logStep(`全部数据统计: 金额=${statsAll.amount}, 人数=${statsAll.count}`);
    
        logStep('开始选中 COINPAY 查询...');
        // 确保表单元素已加载
        await waitSelector('#searchmodel-payment_channel', 10000, iframeDoc);
        await delay(1000); // 额外等待确保 DOM 完全更新
        
        // COINPAY 通道 ID 为 106
        const coinpaySelected = await setSelectValue('searchmodel-payment_channel','106', iframeDoc);
        
        // 重新获取最新的 iframe 文档来验证
        const activeForVerify = getActiveIframe();
        const verifyDoc = activeForVerify ? activeForVerify.doc : iframeDoc;
        const coinpaySelect = verifyDoc.querySelector('#searchmodel-payment_channel');
        const actualValue = coinpaySelect ? coinpaySelect.value : null;
        logStep(`COINPAY 选择验证: 期望=106, 实际=${actualValue}`);
        
        if(coinpaySelected && actualValue === '106'){
            logStep('COINPAY 选中成功，执行搜索...');
            await clickSearchBtn(verifyDoc);
            
            // 再次查询后，重新获取 iframe 文档
            logStep('COINPAY 查询后重新获取 iframe 文档...');
            await delay(2000);
            const activeAfterCoinpay = getActiveIframe();
            const coinpayDoc = activeAfterCoinpay ? activeAfterCoinpay.doc : verifyDoc;
            await waitSelector('form#w0', 10000, coinpayDoc);
            await delay(1000);
            
            const statsCoin = extractStats(coinpayDoc);
            logStep(`提现统计完成: 总金额=${statsAll.amount}, 总人数=${statsAll.count}, COINPAY金额=${statsCoin.amount}, COINPAY人数=${statsCoin.count}`);
            return {
                totalAmount: statsAll.amount,
                totalCount: statsAll.count,
                coinpayAmount: statsCoin.amount,
                coinpayCount: statsCoin.count
            };
        }else{
            logStep(`COINPAY 选中失败，跳过。选中状态=${coinpaySelected}, 实际值=${actualValue}`);
            return {
                totalAmount: statsAll.amount,
                totalCount: statsAll.count,
                coinpayAmount: 0,
                coinpayCount: 0
            };
        }
    }

    async function getRechargeStats(){
        updateStatus('获取充值统计...');
        const active = getActiveIframe();
        if(!active || !new URL(active.doc.location.href).pathname.includes('/finance/recharge/index')){
            const menu = document.querySelector('a.J_menuItem[href="/finance/recharge/index"]');
            if(menu) menu.click();
            await waitIframeLoad('/finance/recharge/index',15000);
        }
        const iframeDoc = getActiveIframe().doc;
        await waitSelector('form#w0',15000, iframeDoc);
        await setTodayDate(iframeDoc);
        await delay(500);
        await setSelectValue('searchmodel-status','2', iframeDoc);
        await clickSearchBtn(iframeDoc);
        await delay(2000);
        return extractStats(iframeDoc);
    }

    async function getRejectStats(){
        updateStatus('获取拒绝统计...');
        const active = getActiveIframe();
        if(!active || !new URL(active.doc.location.href).pathname.includes('/finance/recharge/index')){
            const menu = document.querySelector('a.J_menuItem[href="/finance/recharge/index"]');
            if(menu) menu.click();
            await waitIframeLoad('/finance/recharge/index',15000);
        }
        const iframeDoc = getActiveIframe().doc;
        await waitSelector('form#w0',15000, iframeDoc);
        await setTodayDate(iframeDoc);
        await delay(500);
        await setSelectValue('searchmodel-status','3', iframeDoc);
        await clickSearchBtn(iframeDoc);
        await delay(2000);
        
        // 重新获取最新的 iframe 文档来提取统计数据
        const activeAfter = getActiveIframe();
        const rejectDoc = activeAfter ? activeAfter.doc : iframeDoc;
        logStep('getRejectStats: 重新获取 iframe 文档来提取拒绝统计数据');
        
        const div = rejectDoc.querySelector('.box-body.table-responsive');
        if(!div) {
            logStep('getRejectStats: 未找到 .box-body.table-responsive div');
            return {rejectCount:0,totalCount:0};
        }
        
        const text = div.textContent || '';
        logStep(`getRejectStats: 统计文本内容: ${text.substring(0, 300)}`);
        
        const totalMatch = text.match(/总下单数[：:]\s*([\d,]+)/);
        const rejectMatch = text.match(/拒绝人数[：:]\s*([\d,]+)/);
        const total = parseCount(totalMatch?.[1]||'0');
        const reject = parseCount(rejectMatch?.[1]||'0');
        
        logStep(`getRejectStats: 提取结果 - 总下单数=${total}, 拒绝人数=${reject}`);
        
        return {totalCount: total, rejectCount: reject};
    }

    // ================== 初始化 ==================
    createPanel();

})();
