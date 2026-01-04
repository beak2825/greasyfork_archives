// ==UserScript==
// @name         Torn Company Dashboard (Universal + Auto-Fill + Item Graphs)
// @namespace    torn.company.dashboard.universal
// @version      1.2.0
// @description  Full Torn company dashboard with weekly analytics, top items, 7-week history, CSV export, settings, auto-fill sold items, and dynamic item graphs. Works on PC, Android & iOS.
// @match        https://www.torn.com/companies.php?step=your*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560245/Torn%20Company%20Dashboard%20%28Universal%20%2B%20Auto-Fill%20%2B%20Item%20Graphs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560245/Torn%20Company%20Dashboard%20%28Universal%20%2B%20Auto-Fill%20%2B%20Item%20Graphs%29.meta.js
// ==/UserScript==

(function(){
    'use strict';

    /**********************
     * CONFIG
     **********************/
    const STORAGE_KEY_API = 'tcd_api_key';
    const STORAGE_KEY_HISTORY = 'tcd_history';
    const STORAGE_KEY_TOP_ITEMS = 'tcd_top_items_history';
    const HISTORY_WEEKS = 7;
    const CONTAINER_ID = 'tcd-dashboard';
    const API_BASE = 'https://api.torn.com/company/';

    /**********************
     * UTILS
     **********************/
    function log(msg){
        console.log('[TCD]', msg);
        const dbg=document.getElementById('tcd-debug');
        if(dbg) dbg.textContent+=msg+'\n';
    }

    function getApiKey(){
        let key=localStorage.getItem(STORAGE_KEY_API);
        if(!key){
            key=prompt('Enter your Torn API key (company access required)');
            if(key) localStorage.setItem(STORAGE_KEY_API,key);
        }
        return key;
    }

    function money(n){return '$'+Number(n||0).toLocaleString();}

    function saveHistory(data){
        let history=JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)||'[]');
        history.push(data);
        if(history.length>HISTORY_WEEKS) history=history.slice(history.length-HISTORY_WEEKS);
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }

    function getHistory(){
        return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)||'[]');
    }

    function exportCSV(){
        const history=getHistory();
        if(!history.length) return alert('No history to export.');
        let csv='Week,Income,Expenses,Salaries,Net Profit\n';
        history.forEach((w,i)=>{
            const net=w.income-w.expenses-w.salaries;
            csv+=`${i+1},${w.income},${w.expenses},${w.salaries},${net}\n`;
        });
        const blob=new Blob([csv],{type:'text/csv'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.href=url; a.download='tcd_history.csv'; a.click();
        URL.revokeObjectURL(url);
    }

    /**********************
     * UI
     **********************/
    function createUI(anchor){
        if(document.getElementById(CONTAINER_ID)) return;

        const box=document.createElement('div');
        box.id=CONTAINER_ID;
        box.style.cssText=`margin:12px;padding:12px;background:#111;border:1px solid #333;border-radius:8px;color:#eee;font-size:14px;max-width:100%;`;
        box.innerHTML=`
            <h3 style="margin:0 0 8px 0;">📊 Torn Company Dashboard</h3>
            <div id="tcd-content">Loading...</div>
            <div style="margin-top:8px;">
                <button id="tcd-export" style="margin-right:6px;">Export CSV</button>
                <button id="tcd-settings">Settings</button>
            </div>
            <pre id="tcd-debug" style="display:none;margin-top:8px;padding:6px;background:#000;color:#0f0;font-size:11px;max-height:120px;overflow:auto;"></pre>
        `;
        anchor.parentNode.insertBefore(box,anchor.nextSibling);

        document.getElementById('tcd-export').addEventListener('click',exportCSV);
        document.getElementById('tcd-settings').addEventListener('click',showSettings);
    }

    function showSettings(){
        const key=prompt('Enter new API key (leave blank to keep current):',localStorage.getItem(STORAGE_KEY_API)||'');
        if(key) localStorage.setItem(STORAGE_KEY_API,key);
        if(confirm('Reset history?')) localStorage.removeItem(STORAGE_KEY_HISTORY);
        if(confirm('Reset top items history?')) localStorage.removeItem(STORAGE_KEY_TOP_ITEMS);
        const dbg=document.getElementById('tcd-debug');
        if(dbg) dbg.style.display=dbg.style.display==='none'?'block':'none';
        location.reload();
    }

    function renderData(data){
        const el=document.getElementById('tcd-content');
        if(!el) return;

        const topItems=Object.values(data.items||{}).sort((a,b)=>b.sold-a.sold).slice(0,5);
        const topItemsHTML=topItems.map(i=>`<div>${i.name}: <b>${i.sold}</b> sold</div>`).join('');

        const netProfit=data.income-data.expenses-data.salaries;
        el.innerHTML=`
            <div>Weekly Income: <b style="color:#4caf50">${money(data.income)}</b></div>
            <div>Weekly Expenses: <b style="color:#f44336">${money(data.expenses)}</b></div>
            <div>Total Salaries: <b style="color:#ff9800">${money(data.salaries)}</b></div>
            <div>Employees: <b>${data.employees}</b></div>
            <hr style="border-color:#333">
            <div>Net Profit: <b style="color:${netProfit>=0?'#4caf50':'#f44336'}">${money(netProfit)}</b></div>
            <hr style="border-color:#333">
            <div><b>Top Items Sold:</b>${topItemsHTML||'<div>None</div>'}</div>
            <hr style="border-color:#333">
            <div><b>Weekly History (Income/Expenses/Profit)</b></div>
            ${renderHistoryGraph()}
            <hr style="border-color:#333">
            <div><b>Top Items Sold Last 7 Days</b></div>
            ${renderTopItemsGraph()}
        `;

        window.companyData=data;
        addAutoFillSoldItemsButton();
    }

    function renderHistoryGraph(){
        const history=getHistory();
        if(!history.length) return '<div>No history yet.</div>';
        const maxVal=Math.max(...history.map(h=>Math.max(h.income,h.expenses,h.salaries,h.income-h.expenses-h.salaries)));
        return history.map((h,i)=>{
            const net=h.income-h.expenses-h.salaries;
            const wIncome=Math.round((h.income/maxVal)*100);
            const wExpenses=Math.round((h.expenses/maxVal)*100);
            const wNet=Math.round((net/maxVal)*100);
            return `<div style="display:flex;align-items:center;margin:2px 0;">
                <span style="width:40px;">Week ${i+1}</span>
                <div style="background:#4caf50;height:10px;width:${wIncome}px;margin-right:2px;"></div>
                <div style="background:#f44336;height:10px;width:${wExpenses}px;margin-right:2px;"></div>
                <div style="background:${net>=0?'#0f0':'#f00'};height:10px;width:${wNet}px;"></div>
            </div>`;
        }).join('');
    }

    /**********************
     * Dynamic Top Items Graph
     **********************/
    function updateTopItemsHistory(data){
        let history=JSON.parse(localStorage.getItem(STORAGE_KEY_TOP_ITEMS)||'[]');
        const dayData={date:new Date().toISOString().split('T')[0], items:{}};
        Object.values(data.items||{}).forEach(i=>dayData.items[i.name]={sold:i.sold,profit:i.profit||0});
        history.push(dayData);
        if(history.length>7) history=history.slice(history.length-7);
        localStorage.setItem(STORAGE_KEY_TOP_ITEMS, JSON.stringify(history));
    }

    function renderTopItemsGraph(){
        const history=JSON.parse(localStorage.getItem(STORAGE_KEY_TOP_ITEMS)||'[]');
        if(!history.length) return '<div>No top items history yet.</div>';
        let html='';
        const maxSold=Math.max(...history.flatMap(h=>Object.values(h.items).map(i=>i.sold)))||1;
        history.forEach((h,day)=>{
            html+=`<div style="margin:4px 0;">Day ${day+1} (${h.date}): `;
            Object.entries(h.items).forEach(([name,i])=>{
                const w=Math.round((i.sold/maxSold)*100);
                const color=i.profit>=0?'#4caf50':'#f44336';
                html+=`<div style="display:inline-block;background:${color};width:${w}px;height:12px;margin-right:2px;" title="${name}: ${i.sold} sold, $${i.profit}"></div>`;
            });
            html+='</div>';
        });
        return html;
    }

    /**********************
     * Auto-Fill Sold Items (7 Days)
     **********************/
    function addAutoFillSoldItemsButton(){
        const content=document.getElementById('tcd-content');
        if(!content||!window.companyData) return;
        const btn=document.createElement('button');
        btn.textContent='Auto-Fill Sold Items (7 Days)';
        btn.style.marginTop='6px';
        btn.addEventListener('click',()=>{
            const stockInputs=document.querySelectorAll('input.stock'); // Adjust selector to Torn DOM
            const items=window.companyData.items;
            stockInputs.forEach(input=>{
                const itemName=input.dataset.itemName||input.name;
                const soldCount=Object.values(items).find(i=>i.name===itemName)?.sold||0;
                if(soldCount>0) input.value=soldCount;
            });
            alert('Sold items (last 7 days) auto-filled!');
        });
        content.appendChild(btn);
    }

    /**********************
     * API
     **********************/
    async function fetchCompanyData(key){
        const url=`${API_BASE}?selections=profile,employees,stock&key=${key}`;
        log('Fetching API...');
        const res=await fetch(url);
        const json=await res.json();
        if(json.error){ log('API error: '+json.error.error); return null; }

        let salaries=0,employees=0;
        if(json.employees) for(const id in json.employees){salaries+=Number(json.employees[id].salary||0); employees++;}

        return {
            income: json.profile?.weekly_income||0,
            expenses: json.profile?.weekly_expenses||0,
            salaries,
            employees,
            items: json.stock||{}
        };
    }

    /**********************
     * INIT
     **********************/
    function init(){
        if(!location.search.includes('step=your')) return;
        const key=getApiKey();
        if(!key) return;

        const observer=new MutationObserver(async ()=>{
            const anchor=document.querySelector('.company-wrap, .content-wrapper');
            if(!anchor) return;
            observer.disconnect();
            createUI(anchor);
            const data=await fetchCompanyData(key);
            if(data){
                saveHistory(data);
                updateTopItemsHistory(data);
                renderData(data);
            }
        });
        observer.observe(document.body,{childList:true,subtree:true});
        log('Observer started');
    }

    init();

})();
