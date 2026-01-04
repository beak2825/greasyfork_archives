// ==UserScript==
// @name         FV - Werewolf Mini-Game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      36.0
// @description  Werewolf mini-game in a villager about box (test).
// @match        https://www.furvilla.com/villager/56068
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556336/FV%20-%20Werewolf%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/556336/FV%20-%20Werewolf%20Mini-Game.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Assets
  const THUMBNAILS = [
    "https://www.furvilla.com/img/villagers/0/159-1-th.png",
    "https://www.furvilla.com/img/villagers/0/160-1-th.png",
    "https://www.furvilla.com/img/villagers/0/161-1-th.png",
    "https://www.furvilla.com/img/villagers/0/162-1-th.png",
    "https://www.furvilla.com/img/villagers/0/163-1-th.png",
    "https://www.furvilla.com/img/villagers/0/167-1-th.png"
  ];
  const FALLBACK = "#";

  // State
  let players = []; // { name, role: 'Villager'|'Werewolf', alive: boolean, thumb }
  let events = []; // { type: 'join'|'elim'|'vote'|'phase'|'status'|'chat', playerName, phaseSnapshot, message?, ts }
  let phase = "night"; // start at night -> wolves vote first
  let gameOver = false;
  let started = false;
  let startTimer = null;

  // Voting (shared)
  let votes = {}; // voterName -> targetName
  let votesCast = 0;
  let totalVoters = 0;
  let votingActive = false;
  let votingTimer = null;

  // refs
  let panel, content, list;

  injectJoinButton();

  function injectJoinButton() {
    if (document.querySelector("#werewolfJoinBtn")) return;
    const joinBtn = document.createElement("input");
    joinBtn.type = "submit";
    joinBtn.id = "werewolfJoinBtn";
    joinBtn.className = "btn";
    joinBtn.value = "Join Werewolf";
    joinBtn.style.display = "block";
    joinBtn.style.margin = "0 0 10px 0";
    joinBtn.addEventListener("click", (e) => {
      e.preventDefault();
      joinGame();
    });
    const aboutBoxContainer = document.querySelector(".villager-data-info-wide.villager-data-desc.villager-description");
    if (aboutBoxContainer) {
      aboutBoxContainer.parentNode.insertBefore(joinBtn, aboutBoxContainer);
    } else {
      document.body.prepend(joinBtn);
    }
  }

  function getCurrentUsername() {
    const a = document.querySelector("h4.align-center a");
    if (a) return (a.childNodes[0]?.nodeValue || a.textContent || "Player").trim();
    return "Player";
  }

  function ensurePanel() {
    document.querySelector("#werewolfPanel")?.remove();
    const aboutBox = document.querySelector(".villager-data-info-wide.villager-data-desc.villager-description .profanity-filter");
    if (!aboutBox) return;

    panel = document.createElement("div");
    panel.id = "werewolfPanel";
    panel.className = "widget werewolf-widget";

    const header = document.createElement("div");
    header.className = "widget-header";
    const h3 = document.createElement("h3");
    h3.textContent = "Werewolf Mini-Game";
    header.appendChild(h3);
    panel.appendChild(header);

    content = document.createElement("div");
    content.className = "widget-content";
    content.style.maxHeight = "520px";
    content.style.overflowY = "auto";

    list = document.createElement("ul");
    list.className = "forum-posts";
    list.style.listStyle = "none";
    list.style.margin = "0";
    list.style.padding = "0";
    content.appendChild(list);

    // Status line (always last)
    const status = document.createElement("div");
    status.id = "werewolfStatus";
    status.style.margin = "4px 0px";
    status.style.color = "rgb(85, 85, 85)";
    status.textContent = "Click 'Join Werewolf' to enter the lobby.";
    content.appendChild(status);

    panel.appendChild(content);

    // Controls
    const controls = document.createElement("div");
    controls.style.marginTop = "10px";

    const nextBtn = document.createElement("input");
    nextBtn.type = "submit";
    nextBtn.id = "werewolfNextBtn";
    nextBtn.className = "btn";
    nextBtn.value = "Next Phase";
    nextBtn.style.marginRight = "10px";
    nextBtn.style.display = "none";
    nextBtn.addEventListener("click", nextPhase);
    controls.appendChild(nextBtn);

    const restartBtn = document.createElement("input");
    restartBtn.type = "submit";
    restartBtn.id = "werewolfRestartBtn";
    restartBtn.className = "btn";
    restartBtn.value = "Restart";
    restartBtn.style.display = "none";
    restartBtn.addEventListener("click", restartGame);
    controls.appendChild(restartBtn);

    panel.appendChild(controls);

    // Chat form
    const chatForm = document.createElement("form");
    chatForm.className = "search-form";
    chatForm.style.marginTop = "10px";
    const chatInput = document.createElement("input");
    chatInput.type = "text";
    chatInput.className = "input small search";
    chatInput.placeholder = "Chat...";
    chatInput.name = "chat";
    chatForm.appendChild(chatInput);
    panel.appendChild(chatForm);

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (msg) {
        const username = getCurrentUsername();
        events.push({ type: "chat", playerName: username, phaseSnapshot: phase, message: msg, ts: Date.now() });
        chatInput.value = "";
        renderAll();
      }
    });

    aboutBox.appendChild(panel);
  }

  // Lobby
  function joinGame() {
    const username = getCurrentUsername();
    if (!username) return;

    if (!started) {
      ensurePanel();
      started = true;
      setStatus("Lobby opened. Waiting 10 seconds.");
      startTimer = setTimeout(startGame, 10000); // 10s join window
    }

    const thumb = THUMBNAILS[players.length % THUMBNAILS.length] || FALLBACK;
    players.push({ name: username, role: "Villager", alive: true, thumb });
    events.push({ type: "join", playerName: username, phaseSnapshot: phase, ts: Date.now() });
    renderAll();
  }

  function startGame() {
    // Fill CPUs to 6
    while (players.length < 6) {
      const cpuName = "CPU " + (players.length + 1);
      const thumb = THUMBNAILS[players.length % THUMBNAILS.length] || FALLBACK;
      players.push({ name: cpuName, role: "Villager", alive: true, thumb });
      events.push({ type: "join", playerName: cpuName, phaseSnapshot: phase, ts: Date.now() });
    }

    // Always assign 2 werewolves
    let assigned = 0;
    const indices = Array.from({ length: players.length }, (_, i) => i);
    shuffle(indices);
    for (let i = 0; i < indices.length && assigned < 2; i++) {
      const idx = indices[i];
      if (players[idx].role === "Villager") {
        players[idx].role = "Werewolf";
        assigned++;
      }
    }

    phase = "night";
    setStatus("Game started. Villagers seek the Werewolves.");
    document.querySelector("#werewolfNextBtn").style.display = "inline-block";
    renderAll();
  }

  // Phase progression
  function nextPhase() {
    if (gameOver) return;

    if (phase === "night") {
      startWerewolfVotingPhase(); // 5s wolves voting
    } else if (phase === "day") {
      startVillagerVotingPhase(); // 10s day voting
    }

    renderAll();
    checkWin();
  }

  // Night: werewolves vote 10s, target must be living villager; CPUs auto-vote
  function startWerewolfVotingPhase() {
    votingActive = true;
    votes = {};
    votesCast = 0;

    const werewolves = players.filter(p => p.role === "Werewolf" && p.alive);
    const villagers = players.filter(p => p.role === "Villager" && p.alive);
    totalVoters = werewolves.length;

    // CPU wolves vote first
    werewolves.forEach(wolf => {
      if (wolf.name.startsWith("CPU")) {
        if (villagers.length > 0) {
          const choice = villagers[Math.floor(Math.random() * villagers.length)];
          castVoteInternal(wolf.name, choice.name, "night");
        }
      }
    });

    setStatus("Night: Werewolves are choosing their victim (5s).");
    events.push({ type: "phase", playerName: "Night kill vote (5s)", phaseSnapshot: "night", ts: Date.now() });

    clearTimeout(votingTimer);
    votingTimer = setTimeout(() => {
      endWerewolfVotingPhase();
    }, 5000); // 5s

    renderAll();
  }

  function endWerewolfVotingPhase() {
    if (!votingActive) return;
    votingActive = false;
    clearTimeout(votingTimer);

    // Tally only valid wolf->villager votes
    const tally = {};
    Object.entries(votes).forEach(([voter, target]) => {
      const voterP = players.find(p => p.name === voter);
      const targetP = players.find(p => p.name === target);
      if (voterP && voterP.alive && voterP.role === "Werewolf" && targetP && targetP.alive && targetP.role === "Villager") {
        tally[target] = (tally[target] || 0) + 1;
      }
    });

    let max = 0, leaders = [];
    for (const [name, count] of Object.entries(tally)) {
      if (count > max) { max = count; leaders = [name]; }
      else if (count === max) { leaders.push(name); }
    }
    const eliminatedName = leaders.length > 0 ? leaders[Math.floor(Math.random() * leaders.length)] : null;

    if (eliminatedName) {
      const victim = players.find(p => p.name === eliminatedName);
      if (victim) {
        victim.alive = false;
        events.push({ type: "elim", playerName: victim.name, phaseSnapshot: "night", ts: Date.now() });
      }
    } else {
      events.push({ type: "status", playerName: "No one was killed tonight.", phaseSnapshot: "night", ts: Date.now() });
    }

    // Phase day
    phase = "day";
    const msg = "Day begins. Villagers discuss and vote.";
    setStatus(msg);
    events.push({ type: "phase", playerName: msg, phaseSnapshot: "day", ts: Date.now() });

    renderAll();
    checkWin();
  }

  // Day: All living players vote 10s, CPUs auto-vote, no self-votes
  function startVillagerVotingPhase() {
    votingActive = true;
    votes = {};
    votesCast = 0;

    const alive = players.filter(p => p.alive);
    totalVoters = alive.length;

    // CPU votes immediately (not self)
    alive.forEach(voter => {
      if (voter.name.startsWith("CPU")) {
        const choices = alive.filter(c => c.name !== voter.name);
        if (choices.length > 0) {
          const choice = choices[Math.floor(Math.random() * choices.length)];
          castVoteInternal(voter.name, choice.name, "day");
        }
      }
    });

    setStatus("Day: Voting phase started. You have 10 seconds to vote.");
    events.push({ type: "phase", playerName: "Day vote (10s)", phaseSnapshot: "day", ts: Date.now() });

    clearTimeout(votingTimer);
    votingTimer = setTimeout(() => {
      endVillagerVotingPhase();
    }, 10000); // 10s

    renderAll();
  }

  function endVillagerVotingPhase() {
    if (!votingActive) return;
    votingActive = false;
    clearTimeout(votingTimer);

    // Tally all votes
    const tally = {};
    Object.values(votes).forEach(target => {
      tally[target] = (tally[target] || 0) + 1;
    });

    let max = 0, leaders = [];
    for (const [name, count] of Object.entries(tally)) {
      if (count > max) { max = count; leaders = [name]; }
      else if (count === max) { leaders.push(name); }
    }
    const eliminatedName = leaders.length > 0 ? leaders[Math.floor(Math.random() * leaders.length)] : null;

    if (eliminatedName) {
      const victim = players.find(p => p.name === eliminatedName);
      if (victim) {
        victim.alive = false;
        events.push({ type: "vote", playerName: victim.name, phaseSnapshot: "day", ts: Date.now() });
      }
    } else {
      events.push({ type: "status", playerName: "No votes were cast.", phaseSnapshot: "day", ts: Date.now() });
    }

    // Phase night
    phase = "night";
    const msg = "Night falls. Werewolves make their move.";
    setStatus(msg);
    events.push({ type: "phase", playerName: msg, phaseSnapshot: "night", ts: Date.now() });

    renderAll();
    checkWin();
  }

  // User voting
  function castVoteByUser(targetName) {
    if (!votingActive) { setStatus("Voting is not active right now."); return; }

    const voterName = getCurrentUsername();
    const voter = players.find(p => p.name === voterName);
    const target = players.find(p => p.name === targetName);

    if (!voter || !voter.alive) { setStatus("You must be alive to vote."); return; }
    if (voter.name.startsWith("CPU")) { setStatus("CPUs do not use manual voting."); return; }
    if (!target || !target.alive) { setStatus("You can only vote for living players."); return; }
    if (voterName === targetName) { setStatus("You cannot vote for yourself."); return; }
    if (votes[voterName]) { setStatus("You have already voted."); return; }

    // Night rule: only werewolves voting for villagers
    if (phase === "night") {
      if (voter.role !== "Werewolf") { setStatus("Only Werewolves vote at night."); return; }
      if (target.role !== "Villager") { setStatus("Werewolves can only target Villagers."); return; }
    }

    castVoteInternal(voterName, targetName, phase);

    // End early if everyone voted
    if (votesCast >= totalVoters) {
      if (phase === "day") endVillagerVotingPhase();
      else endWerewolfVotingPhase();
    }
  }

  // Vote recorder + progress chat
  function castVoteInternal(voterName, targetName, phaseCtx) {
    if (voterName === targetName) return;
    if (votes[voterName]) return;

    votes[voterName] = targetName;
    votesCast++;

    events.push({
      type: "chat",
      playerName: "System",
      phaseSnapshot: phaseCtx,
      message: `${votesCast}/${totalVoters} have voted.`,
      ts: Date.now()
    });

    renderAll();
  }

  // Win check
  function checkWin() {
    const wolvesAlive = players.filter(p => p.role === "Werewolf" && p.alive).length;
    const villagersAlive = players.filter(p => p.role === "Villager" && p.alive).length;

    if (wolvesAlive === 0) {
      endGame("Villagers win. All Werewolves eliminated.");
    } else if (wolvesAlive >= villagersAlive) {
      endGame("Werewolves win. They outnumber the Villagers.");
    }
  }

  function endGame(message) {
    events.push({ type: "status", playerName: message, phaseSnapshot: phase, ts: Date.now() });
    const nextBtn = document.querySelector("#werewolfNextBtn");
    const restartBtn = document.querySelector("#werewolfRestartBtn");
    if (nextBtn) nextBtn.style.display = "none";
    if (restartBtn) restartBtn.style.display = "inline-block";
    gameOver = true;
    votingActive = false;
    clearTimeout(votingTimer);
    setStatus(message);
    renderAll();
  }

  function restartGame() {
    if (startTimer) { clearTimeout(startTimer); startTimer = null; }
    clearTimeout(votingTimer);
    players = [];
    events = [];
    votes = {};
    votesCast = 0;
    totalVoters = 0;
    votingActive = false;
    gameOver = false;
    started = false;
    phase = "night";
    setStatus("Game restarted. Click 'Join Werewolf' to enter the lobby.");
    const nextBtn = document.querySelector("#werewolfNextBtn");
    const restartBtn = document.querySelector("#werewolfRestartBtn");
    if (nextBtn) nextBtn.style.display = "none";
    if (restartBtn) restartBtn.style.display = "none";
    renderAll();
  }

  // Rendering
  function renderAll() {
    if (!panel || !list) ensurePanel();
    list.innerHTML = "";

    // Sort events by timestamp: oldest first, newest last
    const sorted = events.slice().sort((a, b) => (a.ts || 0) - (b.ts || 0));

    // Pass 1: non-chat events (phase, status, join, elim, vote)
    sorted.forEach(ev => {
      if (ev.type === "chat") return;

      if (ev.type === "phase") {
        const liPhase = document.createElement("li");
        liPhase.style.padding = "8px 0px";
        liPhase.style.borderBottom = "1px solid rgb(230, 230, 230)";
        const msg = document.createElement("span");
        msg.innerHTML = `<strong>${ev.playerName}</strong>`;
        msg.style.color = "rgb(75, 46, 131)";
        liPhase.appendChild(msg);
        list.appendChild(liPhase);
        return;
      }

      if (ev.type === "status") {
        const liStatus = document.createElement("li");
        liStatus.style.padding = "8px 0px";
        liStatus.style.borderBottom = "1px solid rgb(230, 230, 230)";
        const a = document.createElement("a");
        a.href = "javascript:void(0)";
        a.textContent = ev.playerName;
        a.style.color = "rgb(51, 51, 51)";
        liStatus.appendChild(a);
        list.appendChild(liStatus);
        return;
      }

      // Join/Kill/Vote entries
      const p = players.find(px => px.name === ev.playerName);
      const li = document.createElement("li");
      li.style.padding = "8px 0px";
      li.style.borderBottom = "1px solid rgb(230, 230, 230)";

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginTop = "6px";

      const img = document.createElement("img");
      img.src = (p?.thumb) || THUMBNAILS[Math.floor(Math.random() * THUMBNAILS.length)];
      img.alt = "Villager thumbnail";
      img.style.height = "32px";
      img.style.width = "32px";
      img.style.borderRadius = "4px";
      img.style.objectFit = "cover";
      img.style.border = "1px solid rgb(204, 204, 204)";
      img.onerror = function () { this.src = FALLBACK; };

      const infoP = document.createElement("p");

      const isDead = p ? !p.alive : (ev.type === "elim" || ev.type === "vote");
      const roleText = p ? p.role : "Villager";
      const roleSpan = document.createElement("span");
      roleSpan.innerHTML = `Role: <strong>${roleText}</strong>${isDead ? " — <strong style='color:red'>DEAD</strong>" : ""}`;
      infoP.appendChild(roleSpan);

      infoP.appendChild(document.createElement("br"));

      const timeA = document.createElement("a");
      timeA.href = "javascript:void(0)";
      const timeSpan = document.createElement("span");
      timeSpan.className = "tooltipster tooltipstered";
      const phaseText = ev.phaseSnapshot === "day" ? "Day phase" : "Night phase";
      timeSpan.textContent = `${ev.playerName} — ${phaseText}`;
      timeSpan.style.color = "rgb(153, 153, 153)";
      timeA.appendChild(timeSpan);
      infoP.appendChild(timeA);

      row.appendChild(img);
      row.appendChild(infoP);
      li.appendChild(row);
      list.appendChild(li);
    });

    // Player header + list
    const headerLi = document.createElement("li");
    headerLi.style.padding = "8px 0px";
    headerLi.style.borderBottom = "1px solid rgb(230, 230, 230)";
    const headerA = document.createElement("a");
    headerA.href = "javascript:void(0)";
    headerA.textContent = `Players (${players.length}/10)`;
    headerA.style.fontWeight = "bold";
    headerA.style.color = "rgb(75, 46, 131)";
    headerLi.appendChild(headerA);
    list.appendChild(headerLi);

    const currentUser = getCurrentUsername();
    const viewerPlayer = players.find(px => px.name === currentUser);
    const viewerIsHuman = !currentUser.startsWith("CPU");
    const viewerIsAlive = !!viewerPlayer?.alive;
    const viewerIsWerewolf = viewerPlayer?.role === "Werewolf";

    players.forEach((p) => {
      const li = document.createElement("li");
      li.style.padding = "8px 0px";
      li.style.borderBottom = "1px solid rgb(230, 230, 230)";

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginTop = "6px";

      const img = document.createElement("img");
      img.src = p.thumb || FALLBACK;
      img.alt = "Villager thumbnail";
      img.style.height = "32px";
      img.style.width = "32px";
      img.style.borderRadius = "4px";
      img.style.objectFit = "cover";
      img.style.border = "1px solid rgb(204, 204, 204)";
      img.onerror = function () { this.src = FALLBACK; };

      const infoP = document.createElement("p");

      const roleSpan = document.createElement("span");
      roleSpan.innerHTML = `Role: <strong>${p.role}</strong>${p.alive ? "" : " — <strong style='color:red'>DEAD</strong>"}`;
      infoP.appendChild(roleSpan);

      infoP.appendChild(document.createElement("br"));

      const timeA = document.createElement("a");
      timeA.href = "javascript:void(0)";
      const timeSpan = document.createElement("span");
      timeSpan.className = "tooltipster tooltipstered";
      timeSpan.textContent = `${p.name} — ${phase === "night" ? "Night phase" : "Day phase"}`;
      timeSpan.style.color = "rgb(153, 153, 153)";
      timeA.appendChild(timeSpan);
      infoP.appendChild(timeA);

      // Vote link visibility:
      // votingActive
      // viewer is living
      // target is alive, not viewer, not CPU
      // night: user1 must be werewolf AND user2 (target) must be villager
      const targetIsNotViewer = p.name !== currentUser;
      const targetIsAlive = p.alive;
      const targetIsHuman = !p.name.startsWith("CPU");
      const canShowVoteLink =
        votingActive &&
        viewerIsHuman &&
        viewerIsAlive &&
        targetIsAlive &&
        targetIsHuman &&
        targetIsNotViewer &&
        (
          (phase === "day") ||
          (phase === "night" && viewerIsWerewolf && p.role === "Villager")
        );

      if (canShowVoteLink) {
        const voteLink = document.createElement("a");
        voteLink.href = "javascript:void(0)";
        voteLink.textContent = " Vote";
        voteLink.style.marginLeft = "8px";
        voteLink.style.color = "rgb(75, 46, 131)";
        voteLink.style.fontWeight = "bold";
        voteLink.addEventListener("click", () => castVoteByUser(p.name));
        infoP.appendChild(voteLink);
      }

      if (votingActive && votes[currentUser]) {
        const votedBadge = document.createElement("span");
        votedBadge.textContent = ` (You voted: ${votes[currentUser]})`;
        votedBadge.style.color = "rgb(153, 153, 153)";
        votedBadge.style.marginLeft = "6px";
        infoP.appendChild(votedBadge);
      }

      row.appendChild(img);
      row.appendChild(infoP);
      li.appendChild(row);
      list.appendChild(li);
    });

    // Chat events (always last
    sorted.forEach(ev => {
      if (ev.type !== "chat") return;

      const liChat = document.createElement("li");
      liChat.style.padding = "8px 0px";
      liChat.style.borderBottom = "1px solid rgb(230, 230, 230)";

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "flex-start";
      row.style.gap = "8px";

      const p = players.find(px => px.name === ev.playerName);
      const img = document.createElement("img");
      img.src = (p?.thumb) || THUMBNAILS[Math.floor(Math.random() * THUMBNAILS.length)];
      img.alt = "Villager thumbnail";
      img.style.height = "32px";
      img.style.width = "32px";
      img.style.borderRadius = "4px";
      img.style.objectFit = "cover";
      img.style.border = "1px solid rgb(204, 204, 204)";
      img.onerror = function () { this.src = FALLBACK; };

      const chatText = document.createElement("div");
      chatText.textContent = `${ev.playerName}: ${ev.message}`;
      chatText.style.color = "rgb(51, 51, 51)";
      chatText.style.flex = "1";

      row.appendChild(img);
      row.appendChild(chatText);
      liChat.appendChild(row);

      list.appendChild(liChat);
    });

    // Force status
    const statusEl = document.querySelector("#werewolfStatus");
    if (statusEl) content.appendChild(statusEl);

    // Scroll to bottom
    content.scrollTop = content.scrollHeight;
  }

  function setStatus(text) {
    const s = document.querySelector("#werewolfStatus");
    if (s) s.textContent = text;
    if (content) content.scrollTop = content.scrollHeight;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
})();