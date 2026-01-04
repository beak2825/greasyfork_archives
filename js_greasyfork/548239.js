// ==UserScript==
// @name         Luscious War Tool 
// @namespace    http://tampermonkey.net/
// @version      60.0
// @description  update 2
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.5/socket.io.min.js

// @connect      api.torn.com
// @connect      luscious-war-tool.duckdns.org
// @downloadURL https://update.greasyfork.org/scripts/548239/Luscious%20War%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/548239/Luscious%20War%20Tool.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const SERVER_DOMAIN = "luscious-war-tool.duckdns.org";
    const BACKEND_URL = `https://${SERVER_DOMAIN}`;
    const SELF_POLL_INTERVAL = 5000;

    let localUserData = {};
    let isDragging = false, dragOffset = { x: 0, y: 0 };
    let socket;
    let activeTimers = {};

    function createUIContainer() {
        const container = document.createElement("div");
        container.id = "warToolUI";
        container.style.cssText = `position: fixed; top: 60px; right: 15px; background: rgba(30, 20, 40, 0.2); color: #f3e8ff; padding: 10px; z-index: 9999; max-height: 80vh; overflow-y: auto; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; backdrop-filter: blur(15px); border: 1px solid rgba(219, 112, 147, 0.2); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); min-width: 250px; max-width: 300px; font-size: 12px;`;
        const style = document.createElement('style');
        style.textContent = `#warToolUI::-webkit-scrollbar { width: 4px; } #warToolUI::-webkit-scrollbar-track { background: rgba(139, 69, 19, 0.2); } #warToolUI::-webkit-scrollbar-thumb { background: rgba(219, 112, 147, 0.4); }`;
        document.head.appendChild(style);
        document.body.appendChild(container);
        return container;
    }

    function clearAllTimers() {
        for (const timerId in activeTimers) clearInterval(activeTimers[timerId]);
        activeTimers = {};
    }

    function renderUI(data) {
        let container = document.getElementById("warToolUI");
        if (!container) container = createUIContainer();

        clearAllTimers();
        localUserData = data.user;
        const { teams = [], users = [] } = data;
        container.innerHTML = `<div class="drag-header" style="text-align: center; padding: 6px; margin: -10px -10px 10px -10px; background: rgba(139, 69, 19, 0.05); border-radius: 6px 6px 0 0; border-bottom: 1px solid rgba(219, 112, 147, 0.1); cursor: grab; user-select: none;"><div style="font-size: 12px; font-weight: 600; color: #f3e8ff;">🐲 Luscious War Tool</div></div>`;
        
        // Re-enable dragging after innerHTML is updated
        makeDraggable(container);

        if (teams.length > 0) teams.forEach(team => container.appendChild(createTeamDiv(team, users)));
        else container.insertAdjacentHTML('beforeend', `<div style="padding: 10px; text-align: center; font-style: italic; color: #aaa;">No teams created yet.</div>`);
        
        if (localUserData.role === 'admin') {
            container.appendChild(createAdminControls());
            container.appendChild(createUserManagement(users, teams));
        }
    }

    function createTeamDiv(team, allUsers) {
        const teamDiv = document.createElement("div");
        teamDiv.style.cssText = `border: 1px solid rgba(219, 112, 147, 0.1); margin: 8px 0; padding: 8px; border-radius: 5px; background: rgba(139, 69, 19, 0.03);`;
        const leaderName = team.leader ? `Leader: ${team.leader.name}` : 'Leader: None';
        teamDiv.innerHTML = `<div style="font-weight: 600;">${team.name}</div><div style="font-size: 11px; color: #c084fc; opacity: 0.8;">${leaderName}</div><div style="font-size: 11px; color: #e9d5ff; opacity: 0.8; margin-bottom: 6px;">Target: ${team.target || "None"}</div>`;
        const membersList = document.createElement("div");
        teamDiv.appendChild(membersList);
        if (team.members.length > 0) {
            team.members.forEach(member => {
                const memberDiv = document.createElement("div");
                memberDiv.style.cssText = `display: flex; align-items: center; font-size: 11px; padding: 2px 0;`;
                const statusDot = createStatusDot("Unknown");
                statusDot.id = `status-dot-${member.tornId}`;
                const memberNameSpan = document.createElement('span');
                memberNameSpan.textContent = `${member.name} [${member.tornId}]`;
                const timerSpan = document.createElement('span');
                timerSpan.id = `timer-span-${member.tornId}`;
                timerSpan.style.cssText = `margin-left: 5px; font-weight: bold; color: #f87171;`;
                memberDiv.appendChild(statusDot);
                memberDiv.appendChild(memberNameSpan);
                memberDiv.appendChild(timerSpan);
                membersList.appendChild(memberDiv);
            });
        } else {
            membersList.innerHTML = `<div style="font-style: italic; color: #aaa; font-size: 10px;">No members.</div>`;
        }
        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap;`;
        const isUserInTeam = team.members.some(m => m._id === localUserData._id);
        const isUserLeader = team.leader && team.leader._id === localUserData._id;

        buttonContainer.appendChild(isUserInTeam ? createButton("Leave", () => apiRequest('POST', `/api/teams/${team._id}/leave`), "rgba(248, 113, 113, 0.15)") : createButton("Join", () => apiRequest('POST', `/api/teams/${team._id}/join`), "rgba(134, 239, 172, 0.15)"));
        
        if (isUserLeader) {
            const setTargetBtn = createButton("Set Target", () => {
                const target = prompt("Enter new target for this team:", team.target || "");
                if (target !== null) apiRequest('POST', `/api/teams/${team._id}/target`, { target });
            }, "rgba(147, 197, 253, 0.15)");
            buttonContainer.appendChild(setTargetBtn);
        }

        if (localUserData.role === 'admin') {
            buttonContainer.appendChild(createButton("Delete", () => confirm(`Delete "${team.name}"?`) && apiRequest('DELETE', `/api/teams/${team._id}`), "rgba(248, 113, 113, 0.15)"));
        }
        teamDiv.appendChild(buttonContainer);
        return teamDiv;
    }

    function createAdminControls() {
        const adminDiv = document.createElement("div");
        adminDiv.style.cssText = `border-top: 1px solid rgba(219, 112, 147, 0.1); margin-top: 10px; padding-top: 10px;`;
        adminDiv.innerHTML = `<div style="font-weight: 600; font-size: 11px; margin-bottom: 6px;">👑 Admin Panel</div>`;
        adminDiv.appendChild(createButton("Create New Team", () => { const name = prompt("Enter new team name:"); if (name) apiRequest('POST', '/api/teams', { name }); }, "rgba(219, 112, 147, 0.15)", "100%"));
        const testPingBtn = createButton("Test Discord Ping", () => {
            apiRequest('POST', '/api/test-notification').then(() => alert('Test notification sent!')).catch(err => alert(`Error: ${err}`));
        }, "rgba(99, 102, 241, 0.2)", "100%");
        testPingBtn.style.marginTop = '4px';
        adminDiv.appendChild(testPingBtn);
        return adminDiv;
    }

    function createUserManagement(users, teams) {
        const mgmtDiv = document.createElement("div");
        mgmtDiv.style.cssText = `border-top: 1px solid rgba(219, 112, 147, 0.1); margin-top: 10px; padding-top: 10px;`;
        mgmtDiv.innerHTML = `<div style="font-weight: 600; font-size: 11px; margin-bottom: 6px;">👤 User Management</div>`;
        users.forEach(user => {
            if (user._id === localUserData._id) return;
            const userDiv = document.createElement("div");
            userDiv.style.cssText = `display: flex; justify-content: space-between; align-items: center; font-size: 11px; padding: 3px 0;`;
            userDiv.innerHTML = `<span>${user.name} (${user.role})</span>`;
            
            const controlsContainer = document.createElement('div');
            controlsContainer.style.display = 'flex';
            controlsContainer.style.gap = '4px';

            const roleButtons = document.createElement('div');
            roleButtons.style.display = 'flex';
            roleButtons.style.gap = '4px';
            roleButtons.appendChild(createButton("M", () => apiRequest('POST', `/api/users/${user._id}/role`, { role: 'member' }), user.role === 'member' ? '#3b82f6' : 'rgba(147, 197, 253, 0.15)'));
            roleButtons.appendChild(createButton("L", () => apiRequest('POST', `/api/users/${user._id}/role`, { role: 'leader' }), user.role === 'leader' ? '#3b82f6' : 'rgba(147, 197, 253, 0.15)'));
            roleButtons.appendChild(createButton("A", () => apiRequest('POST', `/api/users/${user._id}/role`, { role: 'admin' }), user.role === 'admin' ? '#3b82f6' : 'rgba(147, 197, 253, 0.15)'));
            controlsContainer.appendChild(roleButtons);

            if (user.role === 'leader') {
                const assignBtn = createButton("Assign", () => {
                    const teamOptions = teams.map((t, i) => `${i + 1}: ${t.name}`).join('\n');
                    const choice = prompt(`Assign leader ${user.name} to which team?\n${teamOptions}`);
                    if (choice && teams[parseInt(choice) - 1]) {
                        apiRequest('POST', `/api/users/${user._id}/assign-leader/${teams[parseInt(choice) - 1]._id}`);
                    }
                }, 'rgba(132, 204, 22, 0.2)');
                assignBtn.style.marginLeft = '5px';
                controlsContainer.appendChild(assignBtn);
            }

            userDiv.appendChild(controlsContainer);
            mgmtDiv.appendChild(userDiv);
        });
        return mgmtDiv;
    }

    function createButton(text, onClick, backgroundColor, width = "auto") {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.onclick = onClick;
        btn.style.cssText = `padding: 4px 8px; background: ${backgroundColor}; color: #f3e8ff; border: 1px solid rgba(219, 112, 147, 0.15); border-radius: 4px; cursor: pointer; font-size: 10px; width: ${width};`;
        return btn;
    }
    
    function getStatusColor(status) {
        if (!status || !status.state) return "#9ca3af";
        if (status.state === "Hospital") return "#f87171";
        if (status.state === "Okay") return "#86efac";
        return "#9ca3af";
    }
    
    function createStatusDot(status) {
        const dot = document.createElement("span");
        dot.style.cssText = `display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${getStatusColor({state: status})}; margin-right: 6px; flex-shrink: 0;`;
        dot.title = status || "Unknown";
        return dot;
    }

    function startCountdown(timerSpan, untilTimestamp) {
        const timerId = `timer-${timerSpan.id}`;
        if (activeTimers[timerId]) clearInterval(activeTimers[timerId]);
        const updateTimer = () => {
            const remaining = untilTimestamp - Math.floor(Date.now() / 1000);
            if (remaining <= 0) {
                timerSpan.textContent = "";
                clearInterval(activeTimers[timerId]);
                delete activeTimers[timerId];
            } else {
                const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
                const seconds = (remaining % 60).toString().padStart(2, '0');
                timerSpan.textContent = `(${minutes}:${seconds})`;
            }
        };
        updateTimer();
        activeTimers[timerId] = setInterval(updateTimer, 1000);
    }
    
    function updateMemberStatusInUI(tornId, status) {
        const dot = document.getElementById(`status-dot-${tornId}`);
        const timerSpan = document.getElementById(`timer-span-${tornId}`);
        if (dot) dot.style.backgroundColor = getStatusColor(status);
        if (timerSpan) {
             if (status && status.state === "Hospital" && status.until > 0) {
                startCountdown(timerSpan, status.until);
            } else {
                const timerId = `timer-${timerSpan.id}`;
                if (activeTimers[timerId]) clearInterval(activeTimers[timerId]);
                delete activeTimers[timerId];
                timerSpan.textContent = "";
            }
        }
    }
    
    async function fetchAllStatusesOnce(teams) {
        const allMembers = teams.flatMap(team => team.members);
        const uniqueMembers = [...new Map(allMembers.map(item => [item["tornId"], item])).values()];
        if (uniqueMembers.length === 0) return;
        const memberIds = uniqueMembers.map(m => m.tornId).join(',');
        const apiKey = GM_getValue("T-API-KEY");
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${memberIds}?selections=status&key=${apiKey}`,
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) return;
                    for (const userId in data) {
                        if (typeof data[userId] === 'object' && data[userId].status) {
                           updateMemberStatusInUI(userId, data[userId].status);
                        }
                    }
                } catch (e) { console.error("Failed to parse initial status response:", e); }
            }
        });
    }

    async function pollAndSendSelfStatus() {
        const apiKey = GM_getValue("T-API-KEY");
        if (!apiKey || !localUserData.tornId || !socket || !socket.connected) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${localUserData.tornId}?selections=profile&key=${apiKey}`,
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) return;
                    socket.emit('statusUpdate', { tornId: localUserData.tornId, status: data.status });
                } catch (e) { /* Fail silently */ }
            }
        });
    }

    function makeDraggable(container) {
        let dragHandle = container.querySelector('.drag-header');
        if (!dragHandle) return;

        dragHandle.onmousedown = (e) => {
            isDragging = true;
            dragOffset = { x: e.clientX - container.offsetLeft, y: e.clientY - container.offsetTop };
            e.preventDefault();
        };

        document.onmousemove = (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - dragOffset.x}px`;
                container.style.top = `${e.clientY - dragOffset.y}px`;
            }
        };

        document.onmouseup = () => {
            isDragging = false;
        };
    }

    async function apiRequest(method, endpoint, body = null) {
        const apiKey = GM_getValue("T-API-KEY");
        if (!apiKey) return Promise.reject("API Key not found");
        return new Promise((resolve, reject) => {
            const options = {
                method, url: `${BACKEND_URL}${endpoint}`,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (res.status >= 200 && res.status < 300) { resolve(data); }
                        else { reject(data.message || 'An unknown error occurred.'); }
                    } catch (e) { reject('Failed to parse server response.'); }
                },
                onerror: () => reject('Network error. Check server status and domain.')
            };
            if (method === 'POST' || method === 'PUT') { options.data = JSON.stringify(body || {}); }
            GM_xmlhttpRequest(options);
        });
    }

    function initializeWebSocket() {
        socket = window.io(BACKEND_URL, { path: '/socket.io/' });
        socket.on('connect', () => console.log('Securely connected to real-time server.'));
        socket.on('memberStatusUpdated', (data) => {
            updateMemberStatusInUI(data.tornId, data.status);
        });
        socket.on('update', (data) => {
            renderUI({ user: localUserData, ...data }).then(() => {
                 fetchAllStatusesOnce(data.teams);
            });
        });
        socket.on('disconnect', () => console.log('Disconnected from real-time server.'));
    }

    async function main() {
        console.log("Luscious War Tool (Node.js) initializing...");
        let apiKey = GM_getValue("T-API-KEY");
        if (!apiKey) { apiKey = prompt("Please enter your Torn API Key:"); if (apiKey) GM_setValue("T-API-KEY", apiKey); else return; }
        try {
            const initialData = await apiRequest('GET', '/api/init');
            await renderUI(initialData);
            initializeWebSocket();
            setInterval(pollAndSendSelfStatus, SELF_POLL_INTERVAL);
            console.log("Luscious War Tool loaded successfully.");
        } catch (error) { alert(`Failed to initialize war tool: ${error}`); }
    }

    main();
})();

