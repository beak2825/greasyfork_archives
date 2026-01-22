// ==UserScript==
// @name         DG-充提差统计
// @namespace    http://tampermonkey.net/
// @version      0.4.5
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

    // 只在主窗口执行，不在 iframe 中执行
    if (window.self !== window.top) {
        console.log('脚本在 iframe 中，跳过执行');
        return;
    }

    if (window.dgCpStatsInitialized) return;
    window.dgCpStatsInitialized = true;

    const NS = 'DG_CP'; // 前缀
    const gmGet = (k, def) => GM_getValue(`${NS}_${k}`, def);
    const gmSet = (k, v) => GM_setValue(`${NS}_${k}`, v);

    // ================== 配置状态 ==================
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
        #${NS}_Panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            background: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.2);
            font-family: Arial,sans-serif;
            width: 360px;
            max-height: 90vh;
            overflow-y: auto;
            transition: all 0.3s ease;
        }
        #${NS}_Panel.collapsed .${NS}_content {
            display: none;
        }
        #${NS}_Panel.collapsed {
            width: 40px;
            height: 40px;
            overflow: hidden;
            padding: 5px;
        }
        #${NS}_ToggleBtn {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: #f0f0f0;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
        }
        #${NS}_ToggleBtn:hover {
            background: #e0e0e0;
        }
        .${NS}_statRow {
            display: flex;
            justify-content: space-between;
            padding: 6px 8px;
            margin-bottom: 8px;
            border-radius: 4px;
            background: #fafafa;
            border-left: 3px solid #409EFF;
            transition: all 0.2s;
        }
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

    // 获取当前活动的iframe
    function getActiveIframe(){
        const iframes = document.querySelectorAll('iframe.J_iframe');
        for(const iframe of iframes){
            if(iframe.style.display !== 'none' && iframe.offsetParent !== null){
                try{
                    // 尝试访问iframe内容，如果能访问说明是同源的
                    const doc = iframe.contentDocument || iframe.contentWindow?.document;
                    if(doc) return {iframe, doc};
                }catch(e){
                    // 跨域iframe无法访问
                }
            }
        }
        return null;
    }

    // 等待iframe加载完成
    async function waitIframeLoad(targetPath, timeout=15000){
        const end = Date.now() + timeout;
        while(Date.now() < end){
            const active = getActiveIframe();
            if(active){
                const {iframe, doc} = active;
                try{
                    const iframePath = new URL(doc.location.href).pathname;
                    if(iframePath.includes(targetPath)){
                        // 等待iframe内容加载完成
                        if(doc.readyState === 'complete'){
                            await delay(1000);
                            return {iframe, doc};
                        }
                    }
                }catch(e){
                    // 跨域或加载中
                }
            }
            await delay(300);
        }
        return null;
    }

    async function waitSelector(selector, timeout=10000, parent=null){
        // 如果没有指定parent，尝试在iframe中查找
        if(!parent){
            const active = getActiveIframe();
            if(active){
                parent = active.doc;
            }else{
                parent = document;
            }
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
        config.lastStats = {
            diffRatio,
            rejectRatio,
            rechargeAmount,
            rechargeCount,
            withdrawAmount,
            withdrawCount
        };
        gmSet('lastStats',config.lastStats);
    }

    // ================== 控制面板 ==================
    function createPanel(){
        if(document.getElementById(`${NS}_Panel`)) {
            console.log('面板已存在，跳过创建');
            return;
        }

        const panel = document.createElement('div');
        panel.id = `${NS}_Panel`;
        if(config.panelCollapsed) panel.classList.add('collapsed');

        const toggle = document.createElement('button');
        toggle.id = `${NS}_ToggleBtn`;
        toggle.innerHTML = config.panelCollapsed?'≡':'×';
        toggle.title = '收起/展开';
        toggle.type = 'button'; // 防止表单提交
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

        // 绑定事件 - 使用 addEventListener 确保不会被覆盖
        toggle.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            panel.classList.toggle('collapsed');
            toggle.innerHTML = panel.classList.contains('collapsed')?'≡':'×';
            config.panelCollapsed = panel.classList.contains('collapsed');
            gmSet('panelCollapsed',config.panelCollapsed);
            console.log('面板收起状态:', config.panelCollapsed);
        });

        const startBtn = document.getElementById(`${NS}_StartBtn`);
        const stopBtn = document.getElementById(`${NS}_StopBtn`);
        if(startBtn) startBtn.addEventListener('click', startStats);
        if(stopBtn) stopBtn.addEventListener('click', stopStats);

        // 恢复上次统计数据
        updateStats(
            config.lastStats.diffRatio || 0,
            config.lastStats.rejectRatio || 0,
            config.lastStats.rechargeAmount || 0,
            config.lastStats.rechargeCount || 0,
            config.lastStats.withdrawAmount || 0,
            config.lastStats.withdrawCount || 0
        );
        updateButtons();
        
        console.log('控制面板创建完成');
    }

    function updateButtons(){
        const start = document.getElementById(`${NS}_StartBtn`);
        const stop = document.getElementById(`${NS}_StopBtn`);
        if(config.isProcessing){
            start?.classList.add('hidden');
            stop?.classList.remove('hidden');
        }else{
            start?.classList.remove('hidden');
            stop?.classList.add('hidden');
        }
    }

    // ================== SPA 监听 ==================
    // 移除 MutationObserver，因为这是 iframe 模式，不需要监听 DOM 变化
    // 面板会在初始化时创建一次即可

    // ================== 统计逻辑 ==================
    let abortCtrl = null;

    async function startStats(){
        if(config.isProcessing) return;
        config.isProcessing = true;
        gmSet('isProcessing',true);
        updateButtons();
        abortCtrl = new AbortController();

        try{
            await runStatsLoop(abortCtrl.signal);
        }catch(err){
            if(err.name!=='AbortError') console.error(err);
        }finally{
            config.isProcessing=false;
            gmSet('isProcessing',false);
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

                // --- 获取提现统计 ---
                const withdrawStats = await getWithdrawStats();
                if(signal.aborted) break;

                // --- 获取充值统计 ---
                const rechargeStats = await getRechargeStats();
                if(signal.aborted) break;

                // --- 获取拒绝统计 ---
                const rejectStats = await getRejectStats();
                if(signal.aborted) break;

                // 计算充提差比例：(提现列表当日提款成功总数 - 当日coinpay提款总数) ÷ 充值成功总数
                let diffRatio = 0;
                if(rechargeStats.amount>0){
                    const diff = withdrawStats.totalAmount - withdrawStats.coinpayAmount;
                    diffRatio = diff/rechargeStats.amount*100;
                }
                // 计算拒绝比例：当日coinpay提款成功总人数 ÷ 当日充值成功总人数
                let rejectRatio=0;
                if(rechargeStats.count>0){
                    rejectRatio=withdrawStats.coinpayCount/rechargeStats.count*100;
                }

                updateStats(diffRatio, rejectRatio, rechargeStats.amount, rechargeStats.count, withdrawStats.totalAmount, withdrawStats.totalCount);
                updateStatus('统计完成，10秒后重新统计...');

                // 等待10秒后继续下一轮统计
                await delay(10000);
                console.log('准备开始下一轮统计...');
            }catch(err){
                if(err.name==='AbortError') break;
                console.error(err);
                updateStatus('出错:'+err.message);
                await delay(5000);
            }
        }
    }

    // ================== 页面数据抓取函数 ==================
    async function setTodayDate(doc=document){
        const now=new Date();
        const y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,'0'),d=String(now.getDate()).padStart(2,'0');
        const range = `${y}-${m}-${d} 00:00:00 - ${y}-${m}-${d} 23:59:59`;
        const dateInput=doc.querySelector('input[name="queryDate"]');
        if(dateInput){
            dateInput.value=range;
            const startInput=doc.querySelector('input[name="start_time"]');
            const endInput=doc.querySelector('input[name="end_time"]');
            if(startInput) startInput.value=range.split(' - ')[0];
            if(endInput) endInput.value=range.split(' - ')[1];
            dateInput.dispatchEvent(new Event('change',{bubbles:true}));
            startInput?.dispatchEvent(new Event('change',{bubbles:true}));
            endInput?.dispatchEvent(new Event('change',{bubbles:true}));
        }
    }

    async function setSelectValue(id, val, doc = document, maxRetries = 5) {
        const sel = await waitSelector(`#${id}`, 5000, doc);
        if (!sel) {
            console.error(`找不到下拉框: ${id}`);
            return;
        }
    
        console.log(`设置下拉框 ${id} 为: ${val || '全部'}`);
        console.log('当前值:', sel.value);
        console.log('可用选项:', Array.from(sel.options).map(opt => ({ value: opt.value, text: opt.text.trim() })));
    
        // 如果已经是目标值，直接返回
        if (sel.value === val) {
            console.log(`下拉框 ${id} 已经是目标值: ${val}`);
            return;
        }
    
        // 找到目标选项索引
        let targetIndex = Array.from(sel.options).findIndex(opt => opt.value === val);
        if (targetIndex === -1 && val === '') {
            targetIndex = Array.from(sel.options).findIndex(opt => opt.value === '');
        }
    
        if (targetIndex === -1) {
            console.error(`下拉框 ${id} 中找不到值为 ${val} 的选项`);
            return;
        }
    
        // 方法1: 尝试模拟用户点击（最可靠的方式）
        let success = false;
        for (let attempt = 1; attempt <= maxRetries && !success; attempt++) {
            console.log(`尝试设置下拉框 ${id} (第 ${attempt} 次)...`);
            
            // 先聚焦下拉框
            sel.focus();
            await delay(100);
            
            // 方法1.1: 直接设置并触发事件
            sel.value = val;
            sel.selectedIndex = targetIndex;
            Array.from(sel.options).forEach((opt, idx) => opt.selected = idx === targetIndex);
            
            // 触发所有可能的事件
            const eventTypes = ['focus', 'click', 'input', 'change', 'blur'];
            eventTypes.forEach(type => {
                const evt = new Event(type, { bubbles: true, cancelable: true });
                sel.dispatchEvent(evt);
            });
            
            // 也尝试使用 MouseEvent（不使用 view 属性以避免 iframe 中的问题）
            const mouseEvents = ['mousedown', 'mouseup', 'click'];
            mouseEvents.forEach(type => {
                try {
                    const evt = new MouseEvent(type, { bubbles: true, cancelable: true });
                    sel.dispatchEvent(evt);
                } catch (e) {
                    // 如果 MouseEvent 创建失败，使用普通 Event
                    const evt = new Event(type, { bubbles: true, cancelable: true });
                    sel.dispatchEvent(evt);
                }
            });
            
            // jQuery 兼容 - 检查是否是 bootstrap-select
            if (typeof $ !== 'undefined' && $(sel).length) {
                try {
                    const $sel = $(sel);
                    // 检查是否是 bootstrap-select
                    if ($sel.data('selectpicker')) {
                        // 使用 selectpicker API
                        $sel.selectpicker('val', val);
                        $sel.selectpicker('refresh');
                        await delay(200);
                    } else {
                        // 普通 jQuery 操作
                        $sel.focus().val(val).trigger('focus').trigger('change').trigger('input').trigger('blur');
                    }
                } catch (e) {
                    console.warn('jQuery 事件触发失败:', e);
                }
            }
            
            await delay(400);
            
            // 验证值是否设置成功
            if (sel.value === val || (val === '' && sel.selectedIndex === targetIndex)) {
                success = true;
                console.log(`下拉框 ${id} 设置成功，当前值: ${sel.value}`);
            } else {
                console.warn(`下拉框 ${id} 设置失败，当前值: ${sel.value}, 期望值: ${val}`);
                
                // 方法1.2: 如果失败，尝试直接操作选项元素
                const targetOption = sel.options[targetIndex];
                if (targetOption) {
                    // 先取消所有选中
                    Array.from(sel.options).forEach(opt => opt.selected = false);
                    // 选中目标选项
                    targetOption.selected = true;
                    sel.selectedIndex = targetIndex;
                    sel.value = val;
                    
                    // 再次触发事件
                    sel.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    if (typeof $ !== 'undefined' && $(sel).length) {
                        const $sel = $(sel);
                        if ($sel.data('selectpicker')) {
                            $sel.selectpicker('val', val);
                            $sel.selectpicker('refresh');
                        } else {
                            $sel.val(val).trigger('change');
                        }
                    }
                    await delay(400);
                    
                    if (sel.value === val) {
                        success = true;
                        console.log(`下拉框 ${id} 通过选项操作设置成功`);
                    }
                }
                
                if (!success) {
                    await delay(500);
                }
            }
        }
    
        // 方法2: 如果仍然失败，尝试使用 Object.defineProperty 强制设置
        if (!success) {
            console.warn(`下拉框 ${id} 常规方法失败，尝试强制设置...`);
            try {
                // 保存原始描述符
                const descriptor = Object.getOwnPropertyDescriptor(sel, 'value') || 
                                 Object.getOwnPropertyDescriptor(Object.getPrototypeOf(sel), 'value');
                
                // 临时覆盖 value setter
                Object.defineProperty(sel, 'value', {
                    set: function(newVal) {
                        this.selectedIndex = targetIndex;
                        if (descriptor && descriptor.set) {
                            descriptor.set.call(this, newVal);
                        }
                    },
                    get: function() {
                        return this.options[this.selectedIndex]?.value || '';
                    },
                    configurable: true
                });
                
                sel.value = val;
                sel.selectedIndex = targetIndex;
                
                // 恢复原始描述符
                if (descriptor) {
                    Object.defineProperty(sel, 'value', descriptor);
                }
                
                await delay(300);
                
                if (sel.value === val) {
                    success = true;
                    console.log(`下拉框 ${id} 通过强制设置成功`);
                }
            } catch (e) {
                console.warn('强制设置失败:', e);
            }
        }
    
        if (!success) {
            console.error(`下拉框 ${id} 经过 ${maxRetries} 次尝试仍无法设置值 ${val}`);
            console.error('最终状态 - 当前值:', sel.value, '期望值:', val, 'selectedIndex:', sel.selectedIndex);
        } else {
            // 最终验证并触发事件
            await delay(300);
            sel.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            if (typeof $ !== 'undefined' && $(sel).length) {
                const $sel = $(sel);
                if ($sel.data('selectpicker')) {
                    $sel.selectpicker('refresh');
                }
                $sel.trigger('change');
            }
            console.log(`下拉框 ${id} 最终设置成功: ${sel.value}`);
        }
        // ====== 【终极兜底】针对 payment_channel = CoinPay ======
        if (!success && id === 'searchmodel-payment_channel' && val === '106') {
            console.warn('进入 CoinPay 终极修复模式');

            // 方法1: 尝试使用 bootstrap-select API（如果存在）
            if (typeof $ !== 'undefined' && $(sel).length) {
                const $sel = $(sel);
                if ($sel.data('selectpicker')) {
                    console.log('检测到 bootstrap-select，使用 selectpicker API');
                    try {
                        $sel.selectpicker('val', '106');
                        await delay(500);
                        $sel.selectpicker('refresh');
                        await delay(300);
                        
                        if (sel.value === '106' || $sel.val() === '106') {
                            success = true;
                            console.log('CoinPay 通过 bootstrap-select API 设置成功');
                        }
                    } catch (e) {
                        console.warn('bootstrap-select API 失败:', e);
                    }
                }
            }

            // 方法2: 如果 bootstrap-select 失败，尝试真实点击模式
            if (!success) {
                console.warn('尝试 CoinPay 真实点击模式');

                // 1. 触发 select 的 mousedown（让页面以为用户点了）
                sel.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                await delay(300);

                // 2. 找到 option 文本为 COINPAY 的那一项
                const option = Array.from(sel.options).find(opt =>
                    opt.value === '106' || opt.text.includes('COIN')
                );

                if (option) {
                    option.selected = true;
                    sel.selectedIndex = option.index;
                    sel.value = '106';

                    // 3. 模拟用户确认选择
                    sel.dispatchEvent(new Event('input', { bubbles: true }));
                    sel.dispatchEvent(new Event('change', { bubbles: true }));

                    // 4. jQuery 处理
                    if (typeof $ !== 'undefined' && $(sel).length) {
                        const $sel = $(sel);
                        $sel.val('106').trigger('change');
                        if ($sel.data('selectpicker')) {
                            $sel.selectpicker('refresh');
                        }
                    }

                    // 5. 强制延迟后再校验一次（防止被 JS 重置）
                    await delay(500);

                    if (sel.value === '106') {
                        success = true;
                        console.log('CoinPay 通过真实点击模式选中成功');
                    } else {
                        console.error('CoinPay 被后台 JS 强制重置，页面存在硬限制');
                    }
                }
            }
        }

    }
    

    async function clickSearchBtn(doc=document){
        const form=doc.querySelector('form#w0');
        if(!form){
            console.error('找不到表单 form#w0');
            return;
        }
        
        const btn=form.querySelector('button[type="submit"]');
        if(!btn){
            console.error('找不到提交按钮');
            return;
        }
        
        console.log('点击查找按钮');
        btn.click();
        
        // 等待页面响应 - 增加等待时间
        await delay(3000);
        
        // 等待统计信息div出现或更新
        await waitSelector('.box-body.table-responsive', 10000, doc);
        await delay(1000);
    }

    function extractStats(doc=document){
        console.log('开始提取统计数据...');
        // 查找所有统计信息div，可能有多个
        const divs = doc.querySelectorAll('.box-body.table-responsive');
        console.log('找到的.box-body.table-responsive数量:', divs.length);
        
        if(!divs || divs.length === 0){
            console.warn('未找到统计信息div');
            return {amount:0,count:0};
        }
        
        // 找到包含统计信息的div（包含"成功金额"和"成功人数"，但不包含表格或表单）
        let statsDiv = null;
        for(let i = 0; i < divs.length; i++){
            const div = divs[i];
            const html = div.innerHTML;
            const text = div.textContent || '';
            
            console.log(`检查第${i+1}个div:`, {
                hasSuccessAmount: text.includes('成功金额'),
                hasSuccessCount: text.includes('成功人数'),
                hasTable: div.querySelector('table') !== null,
                hasFormFields: div.querySelector('form, input[type="text"], select') !== null,
                textPreview: text.substring(0, 200)
            });
            
            // 检查是否包含统计信息关键词
            const hasStatsKeywords = text.includes('成功金额') && text.includes('成功人数');
            // 检查是否包含表格（如果有表格，说明是数据表格，不是统计信息）
            const hasTable = div.querySelector('table') !== null;
            // 检查是否包含表单字段（如果有表单字段，说明是搜索表单，不是统计信息）
            const hasFormFields = div.querySelector('form, input[type="text"], select') !== null;
            
            if(hasStatsKeywords && !hasTable && !hasFormFields){
                statsDiv = div;
                console.log(`找到统计信息div（第${i+1}个）`);
                break;
            }
        }
        
        if(!statsDiv){
            console.warn('未找到包含统计信息的div，尝试使用第一个div');
            statsDiv = divs[0];
        }
        
        const html = statsDiv.innerHTML;
        const text = statsDiv.textContent || '';
        
        console.log('统计信息div完整HTML:', html);
        console.log('统计信息div完整文本:', text);
        
        // 尝试多种匹配方式 - 支持 class="red" 的span
        // 格式：成功金额：<span class="red">34827.68 </span>
        let amountMatch = html.match(/成功金额[：:]\s*<span[^>]*class\s*=\s*["']red["'][^>]*>([\d.,\s]+)<\/span>/i);
        let countMatch = html.match(/成功人数[：:]\s*<span[^>]*class\s*=\s*["']red["'][^>]*>([\d.,\s]+)<\/span>/i);
        
        // 如果上面的匹配失败，尝试更宽松的匹配（包含class但不指定值）
        if(!amountMatch){
            amountMatch = html.match(/成功金额[：:]\s*<span[^>]*class[^>]*>([\d.,\s]+)<\/span>/i);
        }
        if(!countMatch){
            countMatch = html.match(/成功人数[：:]\s*<span[^>]*class[^>]*>([\d.,\s]+)<\/span>/i);
        }
        
        // 如果还是失败，尝试最宽松的匹配
        if(!amountMatch){
            amountMatch = html.match(/成功金额[：:]\s*<span[^>]*>([\d.,\s]+)<\/span>/i);
        }
        if(!countMatch){
            countMatch = html.match(/成功人数[：:]\s*<span[^>]*>([\d.,\s]+)<\/span>/i);
        }
        
        // 如果HTML匹配失败，尝试文本匹配
        if(!amountMatch){
            amountMatch = text.match(/成功金额[：:]\s*([\d.,\s]+)/);
        }
        if(!countMatch){
            countMatch = text.match(/成功人数[：:]\s*([\d.,\s]+)/);
        }
        
        // 如果还是失败，尝试直接查找span元素
        if(!amountMatch || !countMatch){
            const spans = div.querySelectorAll('span.red');
            console.log('找到的红色span:', Array.from(spans).map(s => s.textContent.trim()));
            
            // 尝试通过上下文查找
            const amountSpan = Array.from(spans).find(span => {
                const parentText = span.parentElement?.textContent || '';
                return parentText.includes('成功金额');
            });
            const countSpan = Array.from(spans).find(span => {
                const parentText = span.parentElement?.textContent || '';
                return parentText.includes('成功人数');
            });
            
            if(amountSpan && !amountMatch){
                amountMatch = [null, amountSpan.textContent.trim()];
            }
            if(countSpan && !countMatch){
                countMatch = [null, countSpan.textContent.trim()];
            }
        }
        
        const amount = amountMatch ? parseAmount(amountMatch[1]) : 0;
        const count = countMatch ? parseCount(countMatch[1]) : 0;
        
        console.log('提取统计信息结果:', {
            amount,
            count,
            amountMatch: amountMatch ? amountMatch[1] : null,
            countMatch: countMatch ? countMatch[1] : null
        });
        
        return {amount, count};
    }

    async function getWithdrawStats(){
        updateStatus('获取提现统计...');
        
        // 检查当前iframe是否已经是目标页面
        const active = getActiveIframe();
        let isTargetPage = false;
        if(active){
            try{
                const iframePath = new URL(active.doc.location.href).pathname;
                isTargetPage = iframePath.includes('/finance/withdraw-pix/index');
            }catch(e){}
        }
        
        if(!isTargetPage){
            const menuLink = document.querySelector('a.J_menuItem[href="/finance/withdraw-pix/index"]');
            if(menuLink){
                menuLink.click();
                // 等待iframe加载
                const loaded = await waitIframeLoad('/finance/withdraw-pix/index', 15000);
                if(!loaded){
                    throw new Error('提现列表页面加载超时');
                }
            } else {
                throw new Error('找不到提现列表菜单链接');
            }
        }
        
        // 获取iframe文档
        const activeIframe = getActiveIframe();
        if(!activeIframe){
            throw new Error('无法访问iframe内容');
        }
        const iframeDoc = activeIframe.doc;
        
        // 等待表单加载完成
        const form = await waitSelector('form#w0',15000, iframeDoc);
        if(!form){
            throw new Error('提现列表页面表单加载超时');
        }
        await delay(1000);
        
        await setTodayDate(iframeDoc);
        await delay(1500);
        
        // 设置状态为"取款成功" (value="2")
        console.log('设置状态为取款成功...');
        await setSelectValue('searchmodel-status','2', iframeDoc);
        await delay(1500);
        
        // 清空第三方平台选择（全部）
        console.log('清空第三方平台选择...');
        await setSelectValue('searchmodel-payment_channel','', iframeDoc);
        await delay(1500);
        
        // 点击查找
        console.log('点击查找按钮（全部平台）...');
        await clickSearchBtn(iframeDoc);
        
        // 等待统计信息出现并稳定
        const statsDiv = await waitSelector('.box-body.table-responsive',10000, iframeDoc);
        if(!statsDiv){
            throw new Error('未找到统计信息div');
        }
        await delay(2000);
        
        const stats=extractStats(iframeDoc);
        console.log('提现成功统计（全部平台）:', stats);
        
        // 等待页面完全稳定，确保表单已完全加载
        await delay(2000);
        
        // 重新获取表单和下拉框元素（因为页面可能已重新渲染）
        const formAfterSearch = await waitSelector('form#w0', 10000, iframeDoc);
        if(!formAfterSearch){
            throw new Error('查询后表单丢失');
        }
        
        // 重新获取下拉框元素
        const coinpaySelect = await waitSelector('#searchmodel-payment_channel', 10000, iframeDoc);
        if(!coinpaySelect){
            throw new Error('找不到第三方平台下拉框');
        }
        
        console.log('查询后下拉框当前值:', coinpaySelect.value);
        console.log('查询后下拉框可用选项:', Array.from(coinpaySelect.options).map(opt => ({value: opt.value, text: opt.text.trim()})));
        
        // 现在选择COINPAY (value="106")
        console.log('开始选择COINPAY（查询后）...');
        
        // 如果当前值已经是106，跳过
        if(coinpaySelect.value === '106'){
            console.log('COINPAY已经选中，跳过设置');
        } else {
            // 先清空当前选择（如果有值）
            if(coinpaySelect.value !== ''){
                console.log('先清空当前选择:', coinpaySelect.value);
                coinpaySelect.value = '';
                coinpaySelect.dispatchEvent(new Event('change', {bubbles: true}));
                if(typeof $ !== 'undefined' && $(coinpaySelect).length){
                    const $sel = $(coinpaySelect);
                    if($sel.data('selectpicker')){
                        $sel.selectpicker('val', '');
                        $sel.selectpicker('refresh');
                    } else {
                        $sel.val('').trigger('change');
                    }
                }
                await delay(1000);
            }
            
            // 直接操作设置 COINPAY（不使用setSelectValue，避免复杂逻辑）
            console.log('直接设置COINPAY...');
            const targetOption = Array.from(coinpaySelect.options).find(opt => opt.value === '106');
            if(!targetOption){
                throw new Error('找不到COINPAY选项（value=106）');
            }
            
            console.log('找到COINPAY选项:', targetOption.text, targetOption.value, '索引:', targetOption.index);
            
            // 使用持续监控和强制设置（最多10次尝试）
            let setAttempts = 0;
            const maxSetAttempts = 10;
            
            while(setAttempts < maxSetAttempts && coinpaySelect.value !== '106'){
                setAttempts++;
                console.log(`第${setAttempts}次尝试设置COINPAY...`);
                
                // 方法1: 直接设置value和selectedIndex
                coinpaySelect.value = '106';
                coinpaySelect.selectedIndex = targetOption.index;
                
                // 方法2: 设置所有选项的selected属性（确保DOM中有selected属性）
                Array.from(coinpaySelect.options).forEach((opt, idx) => {
                    if(idx === targetOption.index){
                        opt.selected = true;
                        opt.setAttribute('selected', 'selected');
                    } else {
                        opt.selected = false;
                        opt.removeAttribute('selected');
                    }
                });
                
                // 方法3: 使用Object.defineProperty强制设置（绕过拦截器）
                try {
                    Object.defineProperty(coinpaySelect, 'value', {
                        value: '106',
                        writable: true,
                        configurable: true
                    });
                } catch(e) {
                    // 忽略错误
                }
                
                await delay(200);
                
                if(coinpaySelect.value === '106'){
                    console.log(`第${setAttempts}次尝试成功`);
                    break;
                } else {
                    console.warn(`第${setAttempts}次尝试失败，当前值:`, coinpaySelect.value);
                }
            }
            
            // 如果还是失败，尝试触发事件
            if(coinpaySelect.value !== '106'){
                console.warn('直接设置失败，尝试触发事件...');
                coinpaySelect.value = '106';
                coinpaySelect.selectedIndex = targetOption.index;
                targetOption.selected = true;
                targetOption.setAttribute('selected', 'selected');
                
                // 触发事件
                const changeEvt = new Event('change', { bubbles: true, cancelable: true });
                coinpaySelect.dispatchEvent(changeEvt);
                
                // jQuery处理
                if(typeof $ !== 'undefined' && $(coinpaySelect).length){
                    const $sel = $(coinpaySelect);
                    $sel.val('106');
                    if($sel.data('selectpicker')){
                        $sel.selectpicker('val', '106');
                        $sel.selectpicker('refresh');
                    }
                    $sel.trigger('change');
                }
                
                await delay(500);
                
                // 如果被重置，再次强制设置
                if(coinpaySelect.value !== '106'){
                    console.warn('事件触发后被重置，再次强制设置...');
                    coinpaySelect.value = '106';
                    coinpaySelect.selectedIndex = targetOption.index;
                    targetOption.selected = true;
                    targetOption.setAttribute('selected', 'selected');
                }
            }
            
            // 最终验证和详细日志
            const finalValue = coinpaySelect.value;
            console.log('COINPAY最终验证，当前值:', finalValue, '期望值: 106', 'selectedIndex:', coinpaySelect.selectedIndex);
            console.log('COINPAY选项selected状态:', Array.from(coinpaySelect.options).map((opt, idx) => ({
                index: idx,
                value: opt.value,
                text: opt.text.trim(),
                selected: opt.selected,
                hasSelectedAttr: opt.hasAttribute('selected')
            })));
            
            if(finalValue !== '106'){
                console.error('COINPAY设置失败！当前值:', finalValue);
                // 即使失败也继续，让用户看到问题
            } else {
                console.log('COINPAY设置成功！');
            }
            console.log('COINPAY设置后验证，当前值:', finalValue, '期望值: 106');
            
            if(finalValue !== '106'){
                console.error('COINPAY选择失败，当前值:', coinpaySelect.value);
                console.error('尝试最后一次强制设置...');
                
                // 最后一次尝试：直接操作DOM
                const targetOptionRetry = Array.from(coinpaySelect.options).find(opt => opt.value === '106');
                if(targetOptionRetry){
                    // 移除所有selected
                    Array.from(coinpaySelect.options).forEach(opt => {
                        opt.selected = false;
                        opt.removeAttribute('selected');
                    });
                    
                    // 设置目标选项
                    targetOptionRetry.selected = true;
                    targetOptionRetry.setAttribute('selected', 'selected');
                    coinpaySelect.selectedIndex = targetOptionRetry.index;
                    coinpaySelect.value = '106';
                    
                    // 触发事件
                    coinpaySelect.dispatchEvent(new Event('change', {bubbles: true, cancelable: true}));
                    coinpaySelect.dispatchEvent(new Event('input', {bubbles: true, cancelable: true}));
                    
                    // jQuery处理
                    if(typeof $ !== 'undefined' && $(coinpaySelect).length){
                        const $sel = $(coinpaySelect);
                        $sel.val('106');
                        if($sel.data('selectpicker')){
                            $sel.selectpicker('val', '106');
                            $sel.selectpicker('refresh');
                        }
                        $sel.trigger('change').trigger('input');
                    }
                    
                    await delay(2000);
                    
                    // 最终验证
                    if(coinpaySelect.value === '106'){
                        console.log('COINPAY通过强制DOM操作设置成功');
                    } else {
                        console.error('COINPAY最终设置失败，当前值:', coinpaySelect.value);
                    }
                }
            } else {
                console.log('COINPAY选择成功，当前值:', coinpaySelect?.value);
            }
        }
        
        await delay(2000); // 增加等待时间确保值已生效
        
        // 再次点击查找
        console.log('点击查找按钮（COINPAY）...');
        await clickSearchBtn(iframeDoc);
        
        // 等待统计信息更新
        await waitSelector('.box-body.table-responsive',10000, iframeDoc);
        await delay(2000);
        
        const coinpayStats=extractStats(iframeDoc);
        console.log('CoinPay出款统计:', coinpayStats);
        
        return {totalAmount:stats.amount,totalCount:stats.count,coinpayAmount:coinpayStats.amount,coinpayCount:coinpayStats.count};
    }

    async function getRechargeStats(){
        updateStatus('获取充值统计...');
        
        // 检查当前iframe是否已经是目标页面
        const active = getActiveIframe();
        let isTargetPage = false;
        if(active){
            try{
                const iframePath = new URL(active.doc.location.href).pathname;
                isTargetPage = iframePath.includes('/finance/recharge/index');
            }catch(e){}
        }
        
        if(!isTargetPage){
            const menuLink = document.querySelector('a.J_menuItem[href="/finance/recharge/index"]');
            if(menuLink){
                menuLink.click();
                const loaded = await waitIframeLoad('/finance/recharge/index', 15000);
                if(!loaded){
                    throw new Error('充值列表页面加载超时');
                }
            } else {
                throw new Error('找不到充值列表菜单链接');
            }
        }
        
        const activeIframe = getActiveIframe();
        if(!activeIframe){
            throw new Error('无法访问iframe内容');
        }
        const iframeDoc = activeIframe.doc;
        
        const form = await waitSelector('form#w0',15000, iframeDoc);
        if(!form){
            throw new Error('充值列表页面表单加载超时');
        }
        await delay(1000);
        
        await setTodayDate(iframeDoc);
        await delay(500);
        await setSelectValue('searchmodel-status','2', iframeDoc);
        await delay(500);
        await clickSearchBtn(iframeDoc);
        await waitSelector('.box-body.table-responsive',10000, iframeDoc);
        await delay(2000);
        
        const stats=extractStats(iframeDoc);
        console.log('充值成功统计:', stats);
        return {amount:stats.amount,count:stats.count};
    }

    async function getRejectStats(){
        updateStatus('获取拒绝统计...');
        
        // 检查当前iframe是否已经是目标页面
        const active = getActiveIframe();
        let isTargetPage = false;
        if(active){
            try{
                const iframePath = new URL(active.doc.location.href).pathname;
                isTargetPage = iframePath.includes('/finance/recharge/index');
            }catch(e){}
        }
        
        if(!isTargetPage){
            const menuLink = document.querySelector('a.J_menuItem[href="/finance/recharge/index"]');
            if(menuLink){
                menuLink.click();
                const loaded = await waitIframeLoad('/finance/recharge/index', 15000);
                if(!loaded){
                    throw new Error('充值列表页面加载超时');
                }
            } else {
                throw new Error('找不到充值列表菜单链接');
            }
        }
        
        const activeIframe = getActiveIframe();
        if(!activeIframe){
            throw new Error('无法访问iframe内容');
        }
        const iframeDoc = activeIframe.doc;
        
        const form = await waitSelector('form#w0',15000, iframeDoc);
        if(!form){
            throw new Error('充值列表页面表单加载超时');
        }
        await delay(1000);
        
        await setTodayDate(iframeDoc);
        await delay(500);
        await setSelectValue('searchmodel-status','3', iframeDoc);
        await delay(500);
        await clickSearchBtn(iframeDoc);
        await waitSelector('.box-body.table-responsive',10000, iframeDoc);
        await delay(2000);

        const div=iframeDoc.querySelector('.box-body.table-responsive');
        if(!div) return {rejectCount:0,totalCount:0};
        const text=div.textContent||div.innerHTML||'';
        const totalMatch=text.match(/总下单数[：:]\s*<span[^>]*>([\d.,\s]+)<\/span>/);
        const successMatch=text.match(/成功单数[：:]\s*<span[^>]*>([\d.,\s]+)<\/span>/);
        const total=parseCount(totalMatch?.[1]);
        const success=parseCount(successMatch?.[1]);
        const reject=total-success;
        console.log('拒绝统计:', {rejectCount:reject, totalCount:total, total, success});
        return {rejectCount:reject,totalCount:total};
    }

    // ================== 初始化 ==================
    let initCalled = false;
    function init(){
        if(initCalled) return;
        initCalled = true;
        
        // 确保面板只创建一次
        if(!document.getElementById(`${NS}_Panel`)){
            createPanel();
            updateStatus('准备就绪');
        }
    }

    // 使用更安全的初始化方式
    if(document.readyState==='complete'){
        setTimeout(init, 100);
    }else{
        const loadHandler = ()=>{
            setTimeout(init, 100);
            window.removeEventListener('load', loadHandler);
        };
        window.addEventListener('load', loadHandler);
    }
})();
