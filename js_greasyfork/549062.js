// ==UserScript==
// @name        PlayerFinder[Evades.io]
// @namespace   Violentmonkey Scripts
// @match       *://evades.io/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      Drik
// @description:en Find players by nickname on all Evades.io servers. "Chip" enables auto-tracking in real time
// @description:ru Поиск игроков по нику на всех серверах Evades.io. "Чип" включает авто-отслеживание в реальном времени
// @connect      evades.io
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549062/PlayerFinder%5BEvadesio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/549062/PlayerFinder%5BEvadesio%5D.meta.js
// ==/UserScript==



(function () {
  const root = document.createElement('div');
  root.id = 'pf-root';
  root.innerHTML = `
    <div id="pf-card">
      <div id="pf-h">
        <svg viewBox="0 0 24 24" id="pf-icon" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5z"></path></svg>
        <input id="pf-input" placeholder="nick" />
        <button id="pf-find">Find</button>
        <button id="pf-clear">✕</button>
      </div>
      <div id="pf-controls">
        <label class="pf-chip"><input type="checkbox" id="pf-chip">Чип</label>
      </div>
      <div id="pf-res"></div>
    </div>
  `;
  document.body.appendChild(root);

  const css = `
    #pf-root {position: fixed; left: 12px; top: 12px; z-index: 2147483647; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
    #pf-card {width:260px;padding:12px;border-radius:14px;background:linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));box-shadow:0 8px 30px rgba(0,0,0,0.5);backdrop-filter: blur(6px);color:#eaeef6;border:1px solid rgba(255,255,255,0.04)}
    #pf-h{display:flex;align-items:center;gap:8px}
    #pf-icon{width:18px;height:18px;opacity:0.9;color:#9be7ff}
    #pf-input{flex:1;background:transparent;border:none;padding:8px 10px;border-radius:10px;color:inherit;outline:none;font-size:13px}
    #pf-input::placeholder{color:rgba(255,255,255,0.35)}
    #pf-find{background:linear-gradient(180deg,#00c2ff,#0077b6);border:none;padding:6px 10px;border-radius:10px;color:#022;cursor:pointer;font-weight:700}
    #pf-find:active{transform:translateY(1px)}
    #pf-clear{background:transparent;border:none;color:rgba(255,255,255,0.6);cursor:pointer;padding:6px;border-radius:8px;font-size:13px}
    #pf-clear:hover{color:white;background:rgba(255,255,255,0.02)}
    #pf-controls{margin-top:8px;display:flex;justify-content:flex-start;align-items:center;gap:8px}
    .pf-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:12px;font-size:12px}
    .pf-chip input{width:14px;height:14px;margin:0}
    #pf-res{margin-top:10px;padding:10px;border-radius:10px;background:linear-gradient(180deg, rgba(0,0,0,0.06), rgba(255,255,255,0.01));font-weight:700;text-align:center;font-size:14px;min-height:24px;display:flex;align-items:center;justify-content:center}
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  const input = document.getElementById('pf-input');
  const findBtn = document.getElementById('pf-find');
  const clearBtn = document.getElementById('pf-clear');
  const resBox = document.getElementById('pf-res');
  const chip = document.getElementById('pf-chip');

  let currentReq = null;
  let lastTime = 0;
  const MIN_MS = 200;
  let rafId = null;
  let lastNick = '';

  function render(text) {
    resBox.textContent = text;
  }

  function parseAndFind(data, nick) {
    const q = nick.toLowerCase();
    if (!data || !data.servers) return null;
    const regs = Object.keys(data.servers);
    for (let r = 0; r < regs.length; r++) {
      const region = regs[r];
      const regionObj = data.servers[region];
      if (!regionObj) continue;
      const shards = Object.keys(regionObj);
      for (let s = 0; s < shards.length; s++) {
        const shard = shards[s];
        const server = regionObj[shard];
        if (!server || !Array.isArray(server.online)) continue;
        for (let i = 0; i < server.online.length; i++) {
          if (String(server.online[i]).toLowerCase() === q) {
            return { region, shard, server };
          }
        }
      }
    }
    return null;
  }

  function doRequest(nick) {
    if (!nick) return;
    lastNick = nick;
    if (currentReq && currentReq.abort) try { currentReq.abort(); } catch (e) {}
    currentReq = GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://evades.io/api/game/list',
      onload(resq) {
        currentReq = null;
        try {
          const data = JSON.parse(resq.responseText);
          const found = parseAndFind(data, nick);
          if (found) {
            const shardNum = parseInt(found.shard, 10);
            const shardDisp = isNaN(shardNum) ? found.shard : String(shardNum + 1);
            const connected = (found.server && (found.server.connected || found.server.connected === 0)) ? found.server.connected : (found.server && found.server.players ? found.server.players.length : '?');
            const capacity = (found.server && (found.server.capacity || found.server.capacity === 0)) ? found.server.capacity : '?';
            render(`${nick} — ${found.region} ${shardDisp} / ${connected}/${capacity}`);
          } else {
            render(`${nick} — offline`);
          }
        } catch (e) {
          render('err');
        }
      },
      onerror() {
        currentReq = null;
        render('err');
      },
      ontimeout() {
        currentReq = null;
        render('timeout');
      }
    });
  }

  findBtn.addEventListener('click', function () {
    doRequest(input.value.trim());
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doRequest(input.value.trim());
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    render('');
    if (currentReq && currentReq.abort) try { currentReq.abort(); } catch (e) {}
  });

  function loop() {
    rafId = requestAnimationFrame(loop);
    if (!chip.checked) return;
    const nick = input.value.trim();
    if (!nick) return;
    if (performance.now() - lastTime < MIN_MS) return;
    lastTime = performance.now();
    if (currentReq && currentReq.abort) try { currentReq.abort(); } catch (e) {}
    doRequest(nick);
  }

  rafId = requestAnimationFrame(loop);
})();
