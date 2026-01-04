// ==UserScript==
// @name         ChatGPT Message Graph (SVG Icons v4.6.2)
// @namespace    http://tampermonkey.net/
// @version      4.6.2
// @license      MIT
// @description  v4.6.2: Replaced text-based toggle icons with consistent SVG icons for a cleaner, professional UI. Retains all previous features (Horizontal Scroll, Priority Render).
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558966/ChatGPT%20Message%20Graph%20%28SVG%20Icons%20v462%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558966/ChatGPT%20Message%20Graph%20%28SVG%20Icons%20v462%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==================================================================================
  // 🛠️ CONFIGURATION
  // ==================================================================================
  const CONFIG = {
      panelWidth: 540,
      nodeWidth: 460, 
      baseNodeHeight: 42,
      nodeGap: 14,
      indentPx: 32,
      maxVisibleLines: 9,
      selectionTTLms: 20000,
      debug: false 
  };

  const now = () => Date.now();
  let isCollapsed = localStorage.getItem("GPT_GRAPH_COLLAPSED") === "true"; 

  // --- Graph State ---
  let graph = {
    nodes: new Map(),
    edges: [],
    order: [],
    branchRootId: null
  };
  
  window.__GPT_GRAPH__ = graph;

  // --- Icons (SVG) ---
  const ICONS = {
      // 减号 (Minimize)
      MINIMIZE: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
      // 加号 (Expand)
      EXPAND: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
  };

  // --- React Fiber ---
  function getReactFiber(dom) {
      const key = Object.keys(dom).find(key => key.startsWith("__reactFiber$"));
      return key ? dom[key] : null;
  }
  
  function getQuoteIdFromReact(userEl) {
      const quoteBtn = userEl.querySelector('button .line-clamp-3')?.closest('button');
      if (!quoteBtn) return null;
      let curr = getReactFiber(quoteBtn);
      if (!curr) return null;
      for(let i=0; i<25; i++) {
          const props = curr.memoizedProps;
          if (props?.message?.metadata?.targeted_reply_source_message_id) {
              return props.message.metadata.targeted_reply_source_message_id;
          }
          curr = curr.return;
          if (!curr) break;
      }
      return null;
  }

  // --- Outline Extraction ---
  function extractOutline(role, el) {
      if (!el) return [{type:'SUM', text:"(error)"}];
      const markdown = el.querySelector("[class*='markdown']") || el.querySelector(".prose");

      if (role === 'user') {
          const bubble = el.querySelector('.whitespace-pre-wrap');
          const rawText = bubble ? bubble.textContent : el.textContent;
          const lines = (rawText || "").trim().split('\n').filter(l=>l.trim());
          return lines.length > 0 ? [{type:'SUM', text:lines[0].slice(0, 65)}] : [{type:'SUM', text:"(empty)"}];
      }

      if (markdown) {
          const items = [];
          
          const firstChild = markdown.firstElementChild;
          const isFirstElemHeader = firstChild && /^H[1-6]$/.test(firstChild.tagName);
          if (firstChild && !isFirstElemHeader) {
              let summary = firstChild.textContent.trim();
              summary = summary.replace(/^结论[:：]/, "").replace(/^Summary[:：]/, "");
              if (summary.length > 2) items.push({type:'SUM', text:summary.slice(0, 60)});
          }

          const allHeaders = Array.from(markdown.querySelectorAll("h1, h2, h3, h4, h5, h6"));
          const validHeaders = allHeaders.filter(h => !h.closest('pre'));

          if (validHeaders.length > 0) {
              const levels = validHeaders.map(h => parseInt(h.tagName.substring(1)));
              const minLevel = Math.min(...levels);
              validHeaders.forEach(h => {
                  const txt = h.textContent.trim();
                  if (!txt) return;
                  const currentLevel = parseInt(h.tagName.substring(1));
                  if (currentLevel === minLevel) items.push({type:'MAIN', text:txt});
                  else if (currentLevel === minLevel + 1) items.push({type:'SUB', text:txt});
              });
          }

          const mainCount = items.filter(i => i.type === 'MAIN').length;
          if (mainCount < 2) {
              const strongs = Array.from(markdown.querySelectorAll("p > strong:first-child, li > strong:first-child"));
              strongs.forEach(s => {
                  const txt = s.textContent.trim();
                  if (!txt) return;
                  const looksLikeHeader = /^\d+[\.\)]|^(Step|Phase|Case|Note)\s+\d+|.{2,10}[：:]$/.test(txt);
                  const exists = items.some(i => i.text.includes(txt));
                  if (!exists && looksLikeHeader) items.push({type:'MAIN', text:txt.replace(/[:：]$/, "")});
              });
          }
          
          if (items.length === 0) {
              const fallback = markdown.textContent.trim().slice(0, 60);
              if(fallback) items.push({type:'SUM', text:fallback});
          }
          return items.length > 0 ? items : [{type:'SUM', text:"..."}];
      }
      return [{type:'SUM', text:el.textContent.slice(0, 60)}];
  }

  // --- Node Management ---
  function ensureNode(el) {
    const role = el.getAttribute("data-message-author-role");
    const uuid = el.getAttribute("data-message-id");
    const id = uuid || el.id || `tmp_${Math.random().toString(36)}`;
    
    if (graph.nodes.has(id)) {
        const node = graph.nodes.get(id);
        node.el = el;
        return id;
    }

    let rawText = role === 'user' 
        ? (el.querySelector('.whitespace-pre-wrap')?.textContent || el.textContent)
        : (el.querySelector('.markdown')?.textContent || el.textContent);

    let outline = [];
    try { outline = extractOutline(role, el); } 
    catch(e) { outline = [{type:'SUM', text:"(error)"}]; }

    graph.nodes.set(id, {
      id, role, el,
      outline: outline,
      rawText: rawText || "",
      depth: 0,
      height: CONFIG.baseNodeHeight 
    });
    graph.order.push(id);
    return id;
  }

  function addEdge(from, to, type) {
    if (!from || !to || from === to) return;
    if (!graph.edges.some(e => e.to === to)) graph.edges.push({ from, to, type });
  }

  // --- Rebuild ---
  function rebuildGraph() {
    const msgs = document.querySelectorAll('[data-message-author-role]');
    
    if (msgs.length === 0 && graph.nodes.size > 0) {
        graph.nodes.clear(); graph.edges = []; graph.order = [];
        render(); return;
    }

    const seenIds = new Set();
    msgs.forEach(el => {
        const id = ensureNode(el);
        seenIds.add(id);
    });

    for (const [id, node] of graph.nodes) {
        if (!seenIds.has(id)) {
            graph.nodes.delete(id);
            graph.edges = graph.edges.filter(e => e.from !== id && e.to !== id);
            graph.order = graph.order.filter(oid => oid !== id);
        }
    }

    graph.edges = []; 
    
    for (let i = 0; i < graph.order.length; i++) {
        const currId = graph.order[i];
        const curr = graph.nodes.get(currId);
        if (!curr) continue;

        if (curr.role === 'user' && curr.el) {
            const directParentId = getQuoteIdFromReact(curr.el);
            if (directParentId && graph.nodes.has(directParentId)) {
                addEdge(directParentId, currId, "SELECTION_FOLLOW_UP");
            } else if (i > 0) {
                const prevId = graph.order[i-1];
                if (graph.nodes.has(prevId)) addEdge(prevId, currId, "CONTINUE");
            }
        }

        if (curr.role === 'assistant' && i > 0) {
            const prevId = graph.order[i-1];
            const prev = graph.nodes.get(prevId);
            if (prev && prev.role === 'user') {
                addEdge(prevId, currId, "ASK_PAIR");
            }
        }
    }

    calcDepth();
    render();
  }

  function calcDepth() {
      const parents = new Map();
      graph.edges.forEach(e => {
          if (e.type === "SELECTION_FOLLOW_UP" || e.type === "ASK_PAIR" || e.type === "CONTINUE") {
              parents.set(e.to, {id: e.from, type: e.type});
          }
      });
      const memo = new Map();
      function getD(id) {
          if (memo.has(id)) return memo.get(id);
          if (!parents.has(id)) return 0;
          const p = parents.get(id);
          const cn = graph.nodes.get(id);
          let d = getD(p.id);
          if (p.type === "SELECTION_FOLLOW_UP" && cn && cn.role === 'user') d += 1;
          memo.set(id, d);
          return d;
      }
      graph.nodes.forEach(n => n.depth = getD(n.id));
  }

  // --- UI Render ---
  const ui = document.createElement('div');
  ui.style.cssText = `position:fixed;top:20px;right:20px;width:${CONFIG.panelWidth}px;bottom:20px;z-index:9999;pointer-events:none;display:flex;flex-direction:column;font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;transition:height 0.3s ease, bottom 0.3s ease;`;
  
  const canvas = document.createElement('div');
  canvas.style.cssText = `pointer-events:auto;flex:1;background:#fff;border:1px solid #e5e7eb;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(0,0,0,0.1);overflow:hidden;transition:all 0.3s ease;`;
  
  const header = document.createElement('div');
  header.style.cssText = `padding:10px 16px;background:#fff;border-bottom:1px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center;user-select:none;cursor:pointer;`;
  header.ondblclick = () => toggleCollapse();

  // [NEW] Use a span to hold the SVG icon
  header.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
          <button id="tm_toggle" style="width:24px;height:24px;border:none;background:#f3f4f6;border-radius:4px;cursor:pointer;color:#555;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">${ICONS.MINIMIZE}</button>
          <span style="font-weight:700;color:#333;font-size:13px;">Graph v4.6.2</span>
      </div>
      <div style="display:flex;gap:8px;">
          <button id="tm_export" style="font-size:11px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;cursor:pointer;background:white;color:#555;">JSON</button>
          <button id="tm_rebuild" style="font-size:11px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;cursor:pointer;background:white;color:#555;">Refresh</button>
      </div>
  `;
  
  const graphArea = document.createElement('div');
  graphArea.style.cssText = `flex:1;overflow:auto;position:relative;padding:20px;background:#f9fafb;opacity:1;transition:opacity 0.2s ease;`;
  graphArea.id = "tm_graph_area";

  const style = document.createElement('style');
  style.innerHTML = `
    #tm_graph_area::-webkit-scrollbar { width: 8px; height: 8px; }
    #tm_graph_area::-webkit-scrollbar-track { background: transparent; }
    #tm_graph_area::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
    .tm-node { transition: all 0.2s ease; }
    .tm-node:hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index:10; border-color: #94a3b8 !important; }
    #tm_toggle:hover { background: #e5e7eb !important; color: #111; }
  `;
  document.head.appendChild(style);

  canvas.appendChild(header);
  canvas.appendChild(graphArea);
  ui.appendChild(canvas);
  document.body.appendChild(ui);

  const toggleBtn = header.querySelector('#tm_toggle');
  
  function updateUIState() {
      if (isCollapsed) {
          ui.style.bottom = "auto";
          ui.style.height = "auto";
          canvas.style.height = "auto";
          graphArea.style.display = "none";
          canvas.style.opacity = "0.9";
          toggleBtn.innerHTML = ICONS.EXPAND; // + Icon
          toggleBtn.title = "Expand";
      } else {
          ui.style.bottom = "20px";
          ui.style.height = "auto"; 
          canvas.style.height = "100%";
          graphArea.style.display = "block";
          canvas.style.opacity = "1";
          toggleBtn.innerHTML = ICONS.MINIMIZE; // - Icon
          toggleBtn.title = "Minimize";
      }
      localStorage.setItem("GPT_GRAPH_COLLAPSED", isCollapsed);
  }

  function toggleCollapse() {
      isCollapsed = !isCollapsed;
      updateUIState();
  }
  
  toggleBtn.onclick = toggleCollapse;
  updateUIState(); 

  function render() {
      if (isCollapsed) return;

      graphArea.innerHTML = "";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.cssText = "position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:10;";
      graphArea.appendChild(svg);
      
      let y = 20;
      let maxContentWidth = 0; 
      const pos = new Map();

      graph.order.forEach(id => {
          const n = graph.nodes.get(id);
          if (!n) return;
          
          const x = n.depth * CONFIG.indentPx;
          const isU = n.role === 'user';
          
          const allItems = n.outline || [];
          let displayItems = [];
          let hiddenCount = 0;

          if (isU || allItems.length <= CONFIG.maxVisibleLines) {
              displayItems = allItems;
          } else {
              const mandatory = allItems.filter(i => i.type !== 'SUB');
              const maxSlots = CONFIG.maxVisibleLines - 1;
              if (mandatory.length >= maxSlots) {
                  displayItems = mandatory.slice(0, maxSlots);
              } else {
                  let slotsLeft = maxSlots;
                  const finalSet = new Set();
                  allItems.forEach((item, idx) => {
                      if (item.type !== 'SUB') { finalSet.add(idx); slotsLeft--; }
                  });
                  if (slotsLeft > 0) {
                      for(let idx=0; idx<allItems.length; idx++) {
                          if (allItems[idx].type === 'SUB' && slotsLeft > 0) { finalSet.add(idx); slotsLeft--; }
                      }
                  }
                  displayItems = allItems.filter((_, idx) => finalSet.has(idx));
              }
              hiddenCount = allItems.length - displayItems.length;
          }

          let contentH = displayItems.length * 20;
          if (hiddenCount > 0) contentH += 16;
          if (contentH < 20) contentH = 20;
          const boxHeight = contentH + 24; 
          n.height = boxHeight;

          const item = document.createElement('div');
          item.className = "tm-node";
          
          const bg = '#ffffff';
          const borderLeft = isU ? '3px solid #3b82f6' : '3px solid #10b981';
          const nodeW = CONFIG.nodeWidth;
          
          const currentRightEdge = x + nodeW + 40; 
          if (currentRightEdge > maxContentWidth) maxContentWidth = currentRightEdge;

          item.style.cssText = `
              position:absolute;left:${x}px;top:${y}px;
              width:${nodeW}px;
              height:${boxHeight}px;
              background:${bg};
              border: 1px solid #e5e7eb;
              border-left:${borderLeft};
              border-radius:6px; 
              padding:12px 14px;
              font-size:13px; color:#374151;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              cursor:pointer; display:flex; flex-direction:column; justify-content:center;
              z-index:1; box-sizing: border-box;
          `;
          
          item.title = n.rawText.slice(0, 1000);
          item.onclick = () => n.el && n.el.scrollIntoView({behavior:"smooth", block:"center"});
          
          let html = "";
          displayItems.forEach((itemObj) => {
              const txt = itemObj.text || "";
              const type = itemObj.type || "MAIN";
              let style = "";
              let indent = "0px";
              let bullet = "";

              if (type === "SUM") {
                  style = "font-weight:700; color:#111;";
              } else if (type === "MAIN") {
                  style = "font-weight:600; color:#333;";
                  const hasNum = /^\d+\./.test(txt);
                  if (!hasNum) bullet = "<span style='color:#ccc;margin-right:6px;'>•</span>";
              } else if (type === "SUB") {
                  style = "font-weight:400; color:#555;";
                  indent = "12px";
                  bullet = "<span style='color:#ccc;margin-right:6px;'>-</span>";
              }

              html += `<div style="line-height:20px;${style};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:${indent};">
                  ${bullet}${txt}
              </div>`;
          });
          
          if (hiddenCount > 0) {
              html += `<div style="font-size:11px;color:#9ca3af;margin-top:4px;padding-left:2px;">+ ${hiddenCount} more...</div>`;
          }

          html += `<div style="position:absolute;top:6px;right:8px;font-size:9px;color:#cbd5e1;">#${n.depth}</div>`;

          item.innerHTML = html;
          graphArea.appendChild(item);
          
          pos.set(id, {x, y, h: boxHeight, cy: y + boxHeight / 2});
          y += boxHeight + CONFIG.nodeGap;
      });
      
      svg.setAttribute("height", y + 50);
      svg.setAttribute("width", Math.max(maxContentWidth, CONFIG.panelWidth) + "px");

      graph.edges.forEach(e => {
          const p1 = pos.get(e.from);
          const p2 = pos.get(e.to);
          if (!p1 || !p2) return;
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          
          let d = "";
          let color = "#e5e7eb";
          let width = "1.5";

          if (e.type === "ASK_PAIR" || e.type === "CONTINUE") {
              const lineX = p1.x + 16; 
              const startY = p1.y + p1.h; 
              const endY = p2.y;
              d = `M ${lineX} ${startY} L ${lineX} ${endY}`;
              color = "#d1d5db";
          } else {
              const startX = p1.x + 16; 
              const startY = p1.cy + 12;
              const endX = p2.x - 6; 
              const endY = p2.cy;
              d = `M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`;
              
              if (e.type==="SELECTION_FOLLOW_UP") { color = "#fbbf24"; width = "2"; } 
          }

          path.setAttribute("d", d);
          path.setAttribute("stroke", color);
          path.setAttribute("stroke-width", width);
          path.setAttribute("fill", "none");
          svg.appendChild(path);
      });
  }

  function exportGraphData() {
      try {
          const nodesArray = Array.from(graph.nodes.values()).map(n => ({
              id: n.id, role: n.role, depth: n.depth, outline: n.outline
          }));
          const exportData = {
              timestamp: new Date().toISOString(),
              nodes: nodesArray, edges: graph.edges, order: graph.order
          };
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `gpt_graph_${Date.now()}.json`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
      } catch (e) { console.error("Export error", e); }
  }

  header.querySelector('#tm_rebuild').onclick = rebuildGraph;
  header.querySelector('#tm_export').onclick = exportGraphData;

  const mo = new MutationObserver((muts) => {
      let dirty = false;
      muts.forEach(m => {
          m.addedNodes.forEach(n => {
              if(n.nodeType===1 && (n.matches('[data-message-author-role]') || n.querySelector('[data-message-author-role]'))) {
                  dirty = true;
              }
          });
      });
      if(dirty) setTimeout(rebuildGraph, 600);
  });

  let lastUrl = location.href;
  setInterval(() => {
      if (location.href !== lastUrl) {
          lastUrl = location.href;
          setTimeout(rebuildGraph, 1000);
      }
  }, 1000);

  setTimeout(() => {
      mo.observe(document.body, {childList:true, subtree:true});
      rebuildGraph();
  }, 2000);

})();