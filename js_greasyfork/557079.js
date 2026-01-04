// ==UserScript==
// @name LSTSim - Mtultiplayer Features
// @namespace http://tampermonkey.net/
// @version      1.0|27_11_2025
// @description Pallini, server fittizi, alert con suoni, flash e chat supporto operatore, con note per equipaggio e trasferimenti
// @match https://*.lstsim.de/
// @match https://lstsim.de/
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/557079/LSTSim%20-%20Mtultiplayer%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/557079/LSTSim%20-%20Mtultiplayer%20Features.meta.js
// ==/UserScript==

(function(){
'use strict';

const firebaseConfig={
  apiKey:"AIzaSyBuETJgHB8P09QK6Dcukp7M-8FMWBvE-PY",
  authDomain:"co118-lipi.firebaseapp.com",
  databaseURL:"https://co118-lipi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:"co118-lipi",
  storageBucket:"co118-lipi.firebasestorage.app",
  messagingSenderId:"766212830976",
  appId:"1:766212830976:web:8c64d36921f2bfd60b65e5"
};

const COLOR_MAP={green:'#2ecc71',yellow:'#f1c40f',red:'#e74c3c',blue:'#3498db',default:'#95a5a6'};
const STATUS_PATH='/status';
const MESSAGE_PATH='/message';
const SERVER_PATH='/servers';
const SUPPORT_PATH='/supportRequests';

let audioElement=null;

// UI Pallini
function createStatusUI(){
  const id='lstsim-status-bottomleft';
  if(document.getElementById(id))return;
  const container=document.createElement('div');
  container.id=id;
  container.style.position='fixed';
  container.style.bottom='10px';
  container.style.left='10px';
  container.style.display='flex';
  container.style.gap='16px';
  container.style.zIndex='999999';
  container.style.pointerEvents='none';

  const LABELS={ingresso:"WEBSER",uscita:"WEBREP",tablet:"LIFEAPP"};
  Object.keys(LABELS).forEach(key=>{
    const wrap=document.createElement('div');
    wrap.style.display='flex'; wrap.style.flexDirection='column'; wrap.style.alignItems='center';
    const d=document.createElement('div');
    d.dataset.key=key;
    d.style.width='18px'; d.style.height='18px'; d.style.borderRadius='50%'; d.style.background=COLOR_MAP.default;
    d.style.boxShadow='0 0 6px rgba(0,0,0,0.5)'; wrap.appendChild(d);
    const label=document.createElement('div'); label.innerText=LABELS[key];
    label.style.fontSize='8px'; label.style.color='black'; label.style.marginTop='5px';
    wrap.appendChild(label); container.appendChild(wrap);
  });
  document.body.appendChild(container);
}

// Aggiorna colore pallini
function updateDotColor(key,color){
  const box=document.getElementById('lstsim-status-bottomleft');
  if(!box)return;
  const dot=box.querySelector(`[data-key="${key}"]`);
  if(!dot)return;
  dot.style.background=color;
  dot.style.boxShadow=`0 0 8px ${color}`;
}

// ALERT TOP
function showAlert(payload){
  let box=document.getElementById('lstsim-alert-top');
  if(!box){
    box=document.createElement('div'); box.id='lstsim-alert-top';
    box.style.position='fixed'; box.style.top='25px'; box.style.left='50%';
    box.style.transform='translateX(-50%)'; box.style.zIndex='99999999';
    box.style.padding='15px 25px'; box.style.borderRadius='10px';
    box.style.fontSize='18px'; box.style.fontWeight='bold'; box.style.boxShadow='0 0 12px black';
    document.body.appendChild(box);
  }

  if(!payload){ box.style.display='none'; return; }

  box.style.display='block'; box.textContent=payload.text||'';
  box.style.background=payload.bg||'#e74c3c';

  if(payload.type==='flash'){
    box.style.animation='flash 1s infinite';
    if(!document.getElementById('lstsim-flash-style')){
      const style=document.createElement('style'); style.id='lstsim-flash-style';
      style.textContent='@keyframes flash{0%{opacity:1}50%{opacity:0}100%{opacity:1}}';
      document.head.appendChild(style);
    }
  } else box.style.animation='none';

  if(payload.sound){
    if(audioElement)audioElement.pause();
    audioElement=new Audio(payload.sound); audioElement.play();
  }

  if(payload.type==='temp'){
    setTimeout(()=>{box.style.display='none'; box.style.animation='none';}, (payload.duration||5)*1000);
  }
}

// FIREBASE INIT
function loadFirebase(){
  const s1=document.createElement('script'); s1.src='https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
  s1.onload=function(){
    const s2=document.createElement('script'); s2.src='https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js';
    s2.onload=initFirebase; document.head.appendChild(s2);
  }; document.head.appendChild(s1);
}

function initFirebase(){
  firebase.initializeApp(firebaseConfig);
  const db=firebase.database();
  const statusRef=db.ref(STATUS_PATH);
  const messageRef=db.ref(MESSAGE_PATH);
  const serverRef=db.ref(SERVER_PATH);
  const supportRef=db.ref(SUPPORT_PATH);

  createStatusUI();

  // Pallini
  statusRef.on('value',snap=>{
    const val=snap.val()||{};
    ['ingresso','uscita','tablet'].forEach(k=>{
      updateDotColor(k,COLOR_MAP[val[k]]||COLOR_MAP.default);
    });
  });

  // Messaggi broadcast
  messageRef.on('value',snap=>{
    const m=snap.val();
    showAlert(m);
  });

  // Server fittizi
  serverRef.on('value',snap=>{
    console.log('Server fittizi aggiornati:',snap.val());
  });

  // CHAT / SUPPORTO OPERATORE
  createChatUI(supportRef);
}

function createChatUI(supportRef){
    let operatorName = localStorage.getItem('lstsim_operator') || '';

    const btn=document.createElement('div');
    btn.id='lstsim-chat-btn';
    btn.textContent='💬 Chat';
    Object.assign(btn.style,{
        position:'fixed',top:'10px',right:'0',background:'#0b74de',color:'#fff',
        borderRadius:'6px 0 0 6px',padding:'8px 12px',cursor:'pointer',zIndex:'999999'
    });
    document.body.appendChild(btn);

    const win=document.createElement('div');
    win.id='lstsim-chat-window';
    Object.assign(win.style,{
        position:'fixed',top:'90px',right:'0',width:'350px',maxHeight:'500px',
        background:'#fff',border:'1px solid #ddd',borderRadius:'6px 0 0 6px',
        boxShadow:'-3px 3px 10px rgba(0,0,0,0.2)',display:'none',flexDirection:'column',zIndex:'999998'
    });

    const body=document.createElement('div');
    body.id='lstsim-chat-body';
    Object.assign(body.style,{padding:'10px',flex:'1',overflowY:'auto',fontSize:'13px'});

    const form = document.createElement('div');
    form.style.padding='10px'; form.style.borderTop='1px solid #eee';
    form.innerHTML = `
        <strong>Richieste schematizzate</strong><br><br>
        Nome operatore:<br>
        <input type="text" id="req-operator" placeholder="Il tuo nome" style="width:100%;margin-bottom:6px;" value="${operatorName}">
        Tipo richiesta:<br>
        <select id="req-type" style="width:100%;margin-bottom:6px;">
            <option value="equipaggio">Richiesta Equipaggio</option>
            <option value="trasferimento">Trasferimento/Dimissione</option>
            <option value="problema">Segnala problema</option>
        </select>
        <div id="req-equipaggio" style="display:block;margin-bottom:6px;">
            Tipi e quantità (es: 2 BRAVO, 1 ALFA):<br>
            <input type="text" id="req-equipaggi-list" placeholder="2 BRAVO, 1 ALFA" style="width:100%;margin-bottom:4px;">
            Codice missione:<br>
            <input type="text" id="req-mission-code" placeholder="SC01G" style="width:100%;margin-bottom:4px;">
            Posizione evento:<br>
            <input type="text" id="req-position" placeholder="POI, Comune, Via..." style="width:100%;margin-bottom:4px;">
            Note aggiuntive:<br>
            <input type="text" id="req-notes-equipaggio" placeholder="Eventuali note" style="width:100%;">
        </div>
        <div id="req-trasferimento" style="display:none;margin-bottom:6px;">
            Da:<br><input type="text" id="req-from" placeholder="Ospedale da" style="width:100%;margin-bottom:4px;">
            A:<br><input type="text" id="req-to" placeholder="Ospedale a" style="width:100%;margin-bottom:4px;">
            Note aggiuntive:<br>
            <input type="text" id="req-notes-trasferimento" placeholder="Eventuali note" style="width:100%;">
        </div>
        <div id="req-problema" style="display:none;margin-bottom:6px;">
            Descrizione problema:<br>
            <input type="text" id="req-problem" placeholder="Scrivi il problema" style="width:100%;">
        </div>
        <button id="req-send" style="margin-top:6px;padding:6px 10px;width:100%;">Invia Richiesta</button>
        <hr>
        <strong>Messaggio libero</strong><br>
        <input type="text" id="req-free" placeholder="Scrivi un messaggio libero..." style="width:100%;margin-top:4px;">
        <button id="req-send-free" style="margin-top:6px;padding:6px 10px;width:100%;">Invia Messaggio Libero</button>
    `;

    win.appendChild(body);
    win.appendChild(form);
    document.body.appendChild(win);

    btn.onclick=()=>{win.style.display=(win.style.display==='flex')?'none':'flex'; win.style.flexDirection='column';};

    const typeSelect = form.querySelector('#req-type');
    typeSelect.onchange = ()=>{
        form.querySelector('#req-equipaggio').style.display = (typeSelect.value==='equipaggio')?'block':'none';
        form.querySelector('#req-trasferimento').style.display = (typeSelect.value==='trasferimento')?'block':'none';
        form.querySelector('#req-problema').style.display = (typeSelect.value==='problema')?'block':'none';
    };

    form.querySelector('#req-send').onclick = ()=>{
        const operator = form.querySelector('#req-operator').value.trim();
        if(!operator){ return alert("Inserisci il nome dell'operatore"); }
        localStorage.setItem('lstsim_operator', operator);
        const type = typeSelect.value;
        let message = '';
        if(type==='equipaggio'){
            const list = form.querySelector('#req-equipaggi-list').value.trim();
            const code = form.querySelector('#req-mission-code').value.trim();
            const pos = form.querySelector('#req-position').value.trim();
            const notes = form.querySelector('#req-notes-equipaggio').value.trim();
            if(!list || !code || !pos) return alert("Compila tutti i campi per la richiesta equipaggio");
            message = `Richiesta equipaggio: ${list}, Codice missione: ${code}, Posizione: ${pos}${notes?`, Note: ${notes}`:''}`;
        } else if(type==='trasferimento'){
            const from = form.querySelector('#req-from').value.trim();
            const to = form.querySelector('#req-to').value.trim();
            const notes = form.querySelector('#req-notes-trasferimento').value.trim();
            if(!from || !to) return alert("Compila entrambi i campi per trasferimento/dimissione");
            message = `Trasferimento/Dimissione: da ${from} a ${to}${notes?`, Note: ${notes}`:''}`;
        } else if(type==='problema'){
            const prob = form.querySelector('#req-problem').value.trim();
            if(!prob) return alert("Scrivi la descrizione del problema");
            message = `Problema segnalato: ${prob}`;
        }
        const id = Date.now();
        supportRef.child(id).set({ operator, message, timestamp: Date.now(), handled: false });
        form.querySelectorAll('input').forEach(i=>{
            if(i.id!=='req-operator') i.value='';
        });
        form.querySelector('#req-operator').value = operator;
    };

    form.querySelector('#req-send-free').onclick = ()=>{
        const operator = form.querySelector('#req-operator').value.trim();
        const freeMsg = form.querySelector('#req-free').value.trim();
        if(!operator || !freeMsg) return alert("Compila il nome e il messaggio libero");
        localStorage.setItem('lstsim_operator', operator);
        const id = Date.now();
        supportRef.child(id).set({ operator, message: freeMsg, timestamp: Date.now(), handled: false });
        form.querySelector('#req-free').value='';
    };

    supportRef.on('value',snap=>{
        const data=snap.val();
        body.innerHTML='';
        if(!data) return;
        Object.entries(data).forEach(([id,req])=>{
            const div=document.createElement('div');
            div.textContent=`${req.operator}: ${req.message}`;
            div.style.marginBottom='6px'; div.style.padding='4px 6px'; div.style.background='#f1f1f1'; div.style.borderRadius='4px';
            body.appendChild(div);
        });
        body.scrollTop=body.scrollHeight;
    });
}

createStatusUI(); loadFirebase();
})();

(function() {
    'use strict';

    const LOGO_URL = "https://web118sud.uslnordovest.toscana.it/Live118/img/LogoCO118.png";

    function addLogo() {

        // evita duplicazioni
        if (document.getElementById("lstsim-custom-logo")) return;

        const img = document.createElement("img");
        img.id = "lstsim-custom-logo";
        img.src = LOGO_URL;

        // POSIZIONE E DIMENSIONI
        img.style.position = "fixed";
        img.style.bottom = "15px";
        img.style.right = "15px";
        img.style.width = "250px";

        // SEMPRE VISIBILE
        img.style.zIndex = "999999999";
        img.style.pointerEvents = "none";

        // Opzionale: miglior visibilità (rimuovi se non lo vuoi)
        img.style.filter = "drop-shadow(0 0 6px white)";

        document.body.appendChild(img);
    }

    // aggiungi quando la pagina è pronta
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addLogo);
    } else {
        addLogo();
    }

    // protezione: se LSTSim ricrea elementi, rimetti il logo
    const obs = new MutationObserver(() => addLogo());
    obs.observe(document.documentElement, { childList: true, subtree: true });

})();

