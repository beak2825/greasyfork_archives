// ==UserScript==
// @name         FMP More Player Info - More
// @name:en      FMP More Player Info - More
// @description  Position Ratings + Market Info + Last Growth Index (Optimized & Compact)
// @description:en  Position Ratings + Market Info + Last Growth Index (Optimized & Compact)
// @version      1.7
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @match        https://footballmanagerproject.com/Team/Player/?id=*
// @match        https://www.footballmanagerproject.com/Team/Player?id=*
// @match        https://www.footballmanagerproject.com/Team/Player/?id=*
// @grant        none
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/552798/FMP%20More%20Player%20Info%20-%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/552798/FMP%20More%20Player%20Info%20-%20More.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const RatingRate = {
        0: [1.0,0.8,1.0,0.6,0.6,0.5,0.5,0.5,0.7,0.5,0.6],
        4: [1.0,1.0,0.5,0.5,0.3,0.2,1.0,0.6,0.9,0.8,0.5],
        5: [0.6,1.0,0.6,0.6,1.0,0.4,0.6,0.6,0.6,0.8,0.5],
        6: [0.6,1.0,0.6,0.6,1.0,0.4,0.6,0.6,0.6,0.8,0.5],
        8: [0.7,0.9,0.6,0.7,0.3,0.4,0.9,0.7,0.8,0.8,0.5],
        9: [0.5,1.0,0.6,0.7,1.0,0.4,0.6,0.6,0.6,0.8,0.5],
        10:[0.8,0.5,0.5,1.0,0.6,0.6,0.6,1.0,0.6,0.4,0.6],
        16:[0.5,0.7,0.8,1.0,0.4,0.5,0.6,0.7,0.8,0.8,0.5],
        17:[0.4,0.6,0.6,0.8,1.0,0.6,0.6,0.7,0.7,0.8,0.5],
        18:[0.4,0.6,0.6,0.8,1.0,0.6,0.6,0.7,0.7,0.8,0.5],
        32:[0.3,0.3,0.7,1.0,0.4,0.9,0.7,1.0,0.7,0.8,0.5],
        33:[0.3,0.5,0.7,0.8,1.0,0.6,0.6,0.7,0.8,0.8,0.5],
        34:[0.3,0.5,0.7,0.8,1.0,0.6,0.6,0.7,0.8,0.8,0.5],
        64:[0.2,0.5,0.7,0.7,0.4,1.0,1.0,0.8,0.7,0.8,0.5]
    };
    const positionLabels = {
        4:'DC',5:'DL/DR',8:'DMC',9:'DML/DMR',
        16:'MC',17:'ML/MR',32:'OMC',33:'OML/OMR',64:'FC'
    };
    const playerId = new URL(window.location.href).searchParams.get('id');
    let sharedPlayerData=null, playerGI=null;

    // Create and insert Market Info box
    function createMarketInfoBox(){
        const box=document.createElement('div');
        box.className='board fmpx box';
        box.style.cssText='flex-grow:0;flex-basis:280px;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:12px;border:1px solid #333;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
        box.innerHTML=`
            <div class="title" style="background:linear-gradient(90deg,#2a2a2a,#3a3a3a);border-bottom:2px solid #444;padding:12px 15px">
              <div class="main" style="color:#fff;font-size:16px;font-weight:bold;text-align:center">📊 Player Info</div>
            </div>
            <div id="market-info-content" style="color:#fff;padding:15px;font-size:13px">
              <div style="text-align:center;padding:20px;color:#FFD700">
                <div style="font-size:16px;margin-bottom:8px">🔄</div>
                <div style="font-size:12px">Loading...</div>
              </div>
            </div>`;
        const target=document.getElementById('ActionsBoard');
        if(target)target.parentNode.insertBefore(box,target);
        return document.getElementById('market-info-content');
    }

    function loadMarketInfo(content){
        const info={marketValue:null,recycleValue:null,minBid:null,maxBid:null,isBotTeam:null,rating:null};
        function update(){
            if(!info.marketValue&&!info.rating&&!playerGI) return;
            let html='';
            if(info.marketValue) html+=row('💰 Market Value:',formatNum(info.marketValue),'#4CAF50');
            if(info.recycleValue) html+=row('♻️ Recycle Value:',formatNum(info.recycleValue),'#FF9800');
            if(info.minBid) html+=row('📉 Minimum Bid:',formatNum(Math.floor(info.minBid)),'#2196F3');
            if(info.maxBid&&!info.isBotTeam) html+=row('📈 Maximum Bid:',formatNum(info.maxBid),'#9C27B0');
            if(info.rating) html+=row('⭐ Rating:',(info.rating/10).toFixed(1),getColor(info.rating/10));
            if(playerGI!==null) html+=row('📊 Last GI:',playerGI.toString(),'#7fff00');
            content.innerHTML=html;
        }
        $.ajax({type:"GET",url:'/Players/GetPlayerMarketValue',data:{playerid:playerId},
            success:r=>{info.marketValue=r.marketValue;info.recycleValue=r.marketValue/2;update();}
        });
        $.ajax({type:"POST",url:'/Players/GetDirectBidInfo',dataType:'json',contentType:'application/json',
            data:JSON.stringify({playerid:playerId}),
            success:r=>{info.isBotTeam=r.player.isBotTeam;info.maxBid=r.player.maxBid;info.minBid=r.player.minimumBid;update();}
        });
        if(sharedPlayerData) {info.rating=sharedPlayerData.marketInfo.rating;update();}
    }

    function row(label,val,color){
        return `<div style="display:flex;justify-content:space-between;align-items:center;
                  padding:10px;margin-bottom:8px;background:#2a2a2a;border-radius:8px;
                  border-left:3px solid ${color};transition:0.2s"
                  onmouseover="this.style.backgroundColor='#333';this.style.transform='translateX(5px)'"
                  onmouseout="this.style.backgroundColor='#2a2a2a';this.style.transform='translateX(0)'">
                  <span style="color:#ccc;font-size:12px;font-weight:600">${label}</span>
                  <span style="color:${color};font-weight:bold;font-size:14px">${val}</span>
                </div>`;
    }

    function getColor(r){
        if(r>=20) return '#00ff00';
        if(r>=15) return '#2196F3';
        if(r>=10) return '#FF9800';
        return '#ff4444';
    }

    function formatNum(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');}

    // Create Position Ratings small box
    function createPositionRatings(skills,pos,rating){
        if(pos===0) return;
        const target=document.querySelector('.d-flex.flex-wrap.justify-content-around');
        if(!target) return;
        const positions=[4,5,8,9,16,17,32,33,64], idxMap={4:4,5:5,6:5,8:8,9:9,10:9,16:16,17:17,18:17,32:32,33:33,34:33,64:64};
        const idx=idxMap[pos], table={}, pred={};
        positions.forEach(p=>table[p]=getPosRating(skills,p));
        const bonus=rating/10/table[idx];
        positions.forEach(p=>pred[p]=(table[p]*bonus).toFixed(1));
        const maxP=positions.reduce((a,b)=>pred[a]>pred[b]?a:b);

        const cont=document.createElement('div');
        cont.style.cssText='background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:10px;padding:12px;width:260px;'+
                          'box-shadow:0 4px 15px rgba(0,0,0,0.5);border:1px solid #333;margin:12px auto';
        cont.innerHTML=`<div style="text-align:center;color:#fff;font-size:14px;font-weight:bold;margin-bottom:8px">
                          Position Ratings
                        </div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"></div>`;
        const grid=cont.querySelector('div:nth-child(2)');
        positions.forEach(p=>{
            const r=pred[p], color=getColor(r);
            const border=(p===idx?'#ffff00':p===maxP?'#00ff00':'#444');
            const bg=(p===idx?'#3a3a1a':p===maxP?'#1a3a1a':'#2a2a2a');
            const card=document.createElement('div');
            card.style.cssText=`background:${bg};border:2px solid ${border};border-radius:6px;`+
                                `padding:6px 0;text-align:center;transition:0.2s;cursor:pointer`;
            card.innerHTML=`<div style="color:#ccc;font-size:11px;margin-bottom:4px">${positionLabels[p]}</div>`+
                           `<div style="color:${color};font-size:18px;font-weight:bold">${r}</div>`;
            card.onmouseover=()=>card.style.transform='scale(1.05)';
            card.onmouseout=()=>card.style.transform='scale(1)';
            grid.appendChild(card);
        });
        target.after(cont);
    }

    // MAIN INIT
    function init(){
        const mContent=createMarketInfoBox();
        loadMarketInfo(mContent);
        $.getJSON({url:`/Team/Player?handler=PlayerData&playerId=${playerId}`},res=>{
            sharedPlayerData=res.player;
            playerGI=res.player.gi||res.player.growthIndex||null;
            const pos=fp2pos(res.player.fp), skills=decode(res.player.skills,pos);
            const inf=document.getElementsByClassName("infotable")[0];
            if(inf && inf.firstChild){
                inf.insertBefore(Object.assign(document.createElement('tr'),{innerHTML:`<th>ID</th><td>${playerId}</td>`}),inf.firstChild);
                inf.insertAdjacentHTML('beforeend',`<tr><th>Rating</th><td>${(res.player.marketInfo.rating/10).toFixed(1)}</td></tr>`);
                if(playerGI!==null) inf.insertAdjacentHTML('beforeend',`<tr><th>Growth Index (GI)</th><td style="color:#7fff00;font-weight:bold">${playerGI}</td></tr>`);
            }
            const tal=document.getElementsByClassName("talents")[0];
            if(tal){const tds=tal.getElementsByTagName('td');
                if(pos===0){tds[0].textContent+=res.player.pubTalents.agi+1; tds[1].textContent+=res.player.pubTalents.set+1; tds[2].textContent+=res.player.pubTalents.str+1;}
                else{tds[0].textContent+=res.player.pubTalents.ada+1;tds[1].textContent+=res.player.pubTalents.agi+1;tds[2].textContent+=res.player.pubTalents.set+1;tds[3].textContent+=res.player.pubTalents.str+1;}
            }
            createPositionRatings(skills,pos,res.player.marketInfo.rating);
            loadMarketInfo(mContent);
        });
    }

    function decode(b,pos){
        const a=Uint8Array.from(atob(b),c=>c.charCodeAt(0)),k={};
        if(pos===0){
            ['Han','One','Ref','Aer','Ele','Jum','Kic','Thr','Pos','Sta','Pac','For'].forEach((n,i)=>k[n]=a[i]/10);
            k.Rou=(a[12]*256+a[13])/100;
        } else {
            ['Mar','Tak','Tec','Pas','Cro','Fin','Hea','Lon','Pos','Sta','Pac','For'].forEach((n,i)=>k[n]=a[i]/10);
            k.Rou=(a[12]*256+a[13])/100;
        }
        return k;
    }
    function fp2pos(f){return{'GK':0,'DC':4,'DL':5,'DR':6,'DMC':8,'DML':9,'DMR':10,'MC':16,'ML':17,'MR':18,'OMC':32,'OML':33,'OMR':34,'FC':64}[f]||-1;}

    function getPosRating(s,pos){
        const vals=(pos===0?[s.Han,s.One,s.Ref,s.Aer,s.Jum,s.Ele,s.Kic,s.Thr,s.Pos,s.Sta,s.Pac]:[s.Mar,s.Tak,s.Tec,s.Pas,s.Cro,s.Fin,s.Hea,s.Lon,s.Pos,s.Sta,s.Pac]);
        const sum=RatingRate[pos].reduce((a,c)=>a+c,0),r=vals.reduce((t,v,i)=>t+v*RatingRate[pos][i],0);
        return r/sum;
    }

    function predictRating(t,i,r){const b=r/10/t[i];return Object.fromEntries(Object.entries(t).map(([k,v])=>[k,v*b]));}

    // wait for page table
    new MutationObserver((m,o)=>{if(document.getElementsByClassName("infotable")[0]){init();o.disconnect()}}).
        observe(document.body,{childList:true,subtree:true});

})();