// ==UserScript==
// @name         Bitcointalk BRDb Score — SUPER Dashboard Tooltip
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  BRDb score + Dormant / Former / Reactivated + SUPER dashboard tooltip UI
// @author       Ace
// @match        https://bitcointalk.org/index.php?action=profile;u=*
// @grant        GM_xmlhttpRequest
// @connect      bitlist.co
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562627/Bitcointalk%20BRDb%20Score%20%E2%80%94%20SUPER%20Dashboard%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/562627/Bitcointalk%20BRDb%20Score%20%E2%80%94%20SUPER%20Dashboard%20Tooltip.meta.js
// ==/UserScript==

(function() {
'use strict';

/* ---------------- DATE HELPERS ---------------- */

function getDateNDaysAgo(n){
    const d=new Date(); d.setDate(d.getDate()-n);
    return d.toISOString().split('T')[0];
}

/* ---------------- FETCH 120D DATA ---------------- */

async function fetchMeritsAndPosts120(userUid){
    const dateMin=getDateNDaysAgo(120);
    const dateMax=new Date().toISOString().split('T')[0];

    const url=`https://bitlist.co/trpc/merits.user_merits_per_day_histogram,posts.top_boards_by_post_count?batch=1&input=${
        encodeURIComponent(JSON.stringify({
            "0":{json:{date_min:dateMin,date_max:dateMax,user_uid:+userUid,type:"received",interval:"day"}},
            "1":{json:{date_min:dateMin,date_max:dateMax,author_uid:+userUid,interval:"day"}}
        }))
    }`;

    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
            method:"GET", url,
            onload:r=>{
                try{
                    const d=JSON.parse(r.responseText);
                    const hist=d[0]?.result?.data?.json?.histogram||[];
                    const posts120=d[1]?.result?.data?.json?.total_posts_count||0;
                    const postsLast15=hist.slice(-15).map(x=>x?.posts_sum?.value||0);
                    const merit120=hist.reduce((s,x)=>s+(x?.merits_sum?.value||0),0);
                    resolve({merit120,posts120,postsLast15});
                }catch(e){reject(e);}
            },
            onerror:reject
        });
    });
}

/* ---------------- PROFILE PARSING ---------------- */

function getProfileNumber(label){
    for(const r of document.querySelectorAll('tr')){
        const b=r.querySelector('td b');
        if(b && b.textContent.includes(label)){
            return parseInt(r.querySelectorAll('td')[1].textContent.replace(/\D/g,''))||0;
        }
    }
    return 0;
}

function getProfileDate(label){
    for(const r of document.querySelectorAll('tr')){
        const b=r.querySelector('td b');
        if(b && b.textContent.includes(label)){
            const t=r.querySelectorAll('td')[1].textContent;
            if(t && t!=='(Recently)') return new Date(t);
        }
    }
    return new Date();
}

/* ---------------- FORMULAS (UNCHANGED) ---------------- */

function calculateScores(posts, meritTotal, posts120, merit120, postsLast15, regDate, lastActiveDate){

    const ageDays=Math.max((Date.now()-regDate)/86400000,1);
    const inactiveDays=Math.max((Date.now()-lastActiveDate)/86400000,0);

    const Q_hist=(meritTotal/Math.max(posts,1))*Math.sqrt(posts);
    const Q_120=(posts120>0)?(merit120/posts120)*Math.sqrt(posts120):0;

    const Reputation=0.7*Q_hist+0.3*Q_120;

    const relPosts=Math.min(posts/100,1);
    const relAge=Math.min(ageDays/180,1);
    const Reliability=relPosts*relAge;

    let badgeDormant=false,badgeFormer=false,badgeReactivated=false;

    if(inactiveDays>730 && posts120===0 && merit120===0) badgeFormer=true;
    else if(inactiveDays>120 && posts120===0) badgeDormant=true;

    const activeDays15=postsLast15.filter(p=>p>0).length;
    if(badgeDormant && merit120>0 && activeDays15>=8){
        badgeReactivated=true; badgeDormant=false;
    }

    let FinalScore=Reputation*(0.4+0.6*Reliability);
    if(badgeFormer) FinalScore=0;

    const promising=ageDays<60 && posts<10 && meritTotal<100;

    return {Reputation,Reliability,FinalScore,promising,badgeDormant,badgeFormer,badgeReactivated};
}

function calcBRDb(Reputation, merit120, posts120, badgeFormer){
    let base=Math.log10(Reputation+1)*3;
    const activityBoost=Math.min((merit120+posts120/2)/300,1)*2;
    let score=base+activityBoost;
    if(badgeFormer) score=Math.max(1,Math.min(score,5));
    return Math.max(1,Math.min(10,score));
}

function statusLabel(p,d,f,r){
    if(p) return 'Promising';
    if(r) return 'Reactivated';
    if(f) return 'Former';
    if(d) return 'Dormant';
    return 'Active';
}

function statusColor(s){
    if(s==='Active') return '#22c55e';
    if(s==='Dormant') return '#facc15';
    if(s==='Reactivated') return '#38bdf8';
    if(s==='Former') return '#ef4444';
    if(s==='Promising') return '#a855f7';
    return '#999';
}

/* ---------------- UI INSERT ---------------- */

function insertBRDbRow(data){
    const meritLink=document.querySelector('a[href*="action=merit"]');
    if(!meritLink) return;
    const baseRow=meritLink.closest('tr');

    const tr=document.createElement('tr');
    tr.innerHTML=`<td><b>BRDb:</b></td>
    <td id="brdb-cell" style="cursor:pointer">
        <b>⭐ ${data.BRDb.toFixed(1)}</b>
        <span style="color:${data.color};font-weight:bold"> — ${data.status}</span>
    </td>`;
    baseRow.after(tr);

    attachDashboardTooltip(tr.querySelector('#brdb-cell'),data);
}

/* ---------------- DASHBOARD TOOLTIP ---------------- */

function attachDashboardTooltip(td,data){

    const tip=document.createElement('div');
    tip.style.cssText=`
        position:absolute; display:none; z-index:99999;
        background:linear-gradient(145deg,#0b1220,#111827);
        border:1px solid rgba(255,255,255,.08);
        box-shadow:0 20px 50px rgba(0,0,0,.8), inset 0 0 0 1px rgba(255,255,255,.05);
        border-radius:16px; padding:14px; min-width:240px;
        color:#e5e7eb; font-family:system-ui;
    `;

    const finalRow = Math.abs(data.FinalScore-data.Reputation)>0.01
        ? `<div style="margin-top:8px;padding:6px;border-radius:10px;background:#1f2933;text-align:center">
             🎯 Final Score <b>${data.FinalScore.toFixed(2)}</b>
           </div>` : '';

    tip.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <div style="font-size:26px">⭐ ${data.BRDb.toFixed(1)}</div>
        <span style="background:${data.color};color:#000;padding:2px 8px;border-radius:999px;font-weight:700">
          ${data.status}
        </span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">

        <div style="background:#020617;padding:8px;border-radius:10px">
          <div style="font-size:11px;opacity:.7">Reputation</div>
          <b>${data.Reputation.toFixed(2)}</b>
        </div>

        <div style="background:#020617;padding:8px;border-radius:10px">
          <div style="font-size:11px;opacity:.7">Reliability</div>
          <b>${(data.Reliability*100).toFixed(0)}%</b>
          <div style="height:4px;background:#111;border-radius:5px;margin-top:4px">
            <div style="height:100%;width:${data.Reliability*100}%;background:#22c55e;border-radius:5px"></div>
          </div>
        </div>

        <div style="background:#020617;padding:8px;border-radius:10px">
          <div style="font-size:11px;opacity:.7">Posts (120d)</div>
          <b>${data.posts120}</b>
        </div>

        <div style="background:#020617;padding:8px;border-radius:10px">
          <div style="font-size:11px;opacity:.7">Merits (120d)</div>
          <b>${data.merit120}</b>
        </div>

      </div>
      ${finalRow}
    `;

    document.body.appendChild(tip);

    function show(){
        const r=td.getBoundingClientRect();
        tip.style.left=r.left+'px';
        tip.style.top=(r.bottom+6+window.scrollY)+'px';
        tip.style.display='block';
    }
    function hide(){ tip.style.display='none'; }

    td.addEventListener('click',e=>{e.stopPropagation(); tip.style.display==='block'?hide():show();});
    document.addEventListener('click',hide);
    window.addEventListener('scroll',hide);
    window.addEventListener('resize',hide);
}

/* ---------------- MAIN ---------------- */

async function main(){
    const m=location.search.match(/u=(\d+)/); if(!m) return;
    const uid=m[1];

    try{
        const {merit120,posts120,postsLast15}=await fetchMeritsAndPosts120(uid);
        const posts=getProfileNumber('Posts');
        const meritTotal=getProfileNumber('Merit');
        const regDate=getProfileDate('Date Registered');
        const lastActiveDate=getProfileDate('Last Active');

        const r=calculateScores(posts,meritTotal,posts120,merit120,postsLast15,regDate,lastActiveDate);
        const BRDb=calcBRDb(r.Reputation,merit120,posts120,r.badgeFormer);
        const status=statusLabel(r.promising,r.badgeDormant,r.badgeFormer,r.badgeReactivated);

        insertBRDbRow({
            BRDb, status,
            color: statusColor(status),
            Reputation:r.Reputation,
            Reliability:r.Reliability,
            FinalScore:r.FinalScore,
            posts120, merit120
        });

    }catch(e){ console.error('BRDb error',e); }
}

window.addEventListener('load',main);

})();