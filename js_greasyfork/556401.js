// ==UserScript==
// @name         TrixBox (VOICE CHAT)
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  TriX Executor's VOICE ChatBox (for territorial.io)!
// @author       Painsel
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @grant        GM_addStyle
// @require      https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556401/TrixBox%20%28VOICE%20CHAT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556401/TrixBox%20%28VOICE%20CHAT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS STYLES ---
    // Using GM_addStyle as requested, ensuring consistent styling.
    const css = `
        #voice-overlay {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background: #1e1e1e;
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            z-index: 99999;
            font-family: 'Inter', sans-serif;
            border: 1px solid #333;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        #voice-header {
            background: #2d2d2d;
            padding: 10px 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move; /* Drag logic would be added here */
        }
        #voice-body {
            padding: 15px;
        }
        .voice-btn {
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s ease;
        }
        .btn-green { background: #10b981; color: white; }
        .btn-green:hover { background: #0e9f6e; }
        .btn-red { background: #ef4444; color: white; }
        .btn-red:hover { background: #d03939; }
        .btn-yellow { background: #f59e0b; color: white; }
        .btn-yellow:hover { background: #d97706; }
        .btn-gray { background: #4b5563; color: white; }
        .btn-gray:hover { background: #374151; }
        .voice-input {
            width: 100%;
            padding: 8px;
            background: #333;
            border: 1px solid #444;
            color: white;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        .status-dot {
            height: 10px;
            width: 10px;
            background-color: #bbb;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
        }
        .status-connected { background-color: #10b981; }
        .status-calling { background-color: #3b82f6; } /* Blue for calling */
        .status-ringing { background-color: #f59e0b; } /* Yellow for incoming */
        .status-error { background-color: #ef4444; }
    `;
    
    // Inject CSS using GM_addStyle
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // --- HTML UI ---
    const overlay = document.createElement('div');
    overlay.id = 'voice-overlay';
    overlay.innerHTML = `
        <div id="voice-header">
            <span><span id="status-indicator" class="status-dot"></span> Voice Overlay</span>
            <button id="minimize-btn" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:16px;line-height:1;">—</button>
        </div>
        <div id="voice-body">
            <div style="font-size: 12px; color: #aaa; margin-bottom: 5px;">MY ID:</div>
            <input type="text" id="my-id" class="voice-input" readonly value="Initializing PeerJS...">
            
            <div id="connection-controls">
                <div style="font-size: 12px; color: #aaa; margin-top: 15px; margin-bottom: 5px;">CONNECT TO PEER:</div>
                <input type="text" id="friend-id" class="voice-input" placeholder="Paste friend's ID here">
                
                <button id="connect-btn" class="voice-btn btn-green">Call Peer</button>
            </div>
            
            <button id="mute-btn" class="voice-btn btn-yellow" disabled style="display:none;">🎙️ Mute Microphone</button>
            <button id="disconnect-btn" class="voice-btn btn-red" style="display:none;">End Call</button>
            
            <div id="msg-area" style="margin-top:10px; font-size: 11px; color: #888; text-align: center;">Waiting for initialization...</div>

            <!-- This is where incoming call buttons appear -->
            <div id="incoming-call-prompt" style="display:none; text-align:center;">
                <div class="voice-btn btn-yellow" style="margin-top: 5px; cursor:default;">Incoming Call!</div>
                <div class="flex space-x-2" style="display:flex;">
                    <button id="accept-call-btn" class="voice-btn btn-green flex-1" style="margin-right:5px;">Accept</button>
                    <button id="reject-call-btn" class="voice-btn btn-red flex-1" style="margin-left:5px;">Reject</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Hidden audio element for remote stream
    const audio = document.createElement('audio');
    audio.id = 'remote-audio';
    audio.autoplay = true;
    document.body.appendChild(audio);
 
    // --- LOGIC ---
    let peer = null;
    let localStream = null;
    let activeCall = null;
    let isMuted = false;

    // Element getters
    const getEl = (id) => document.getElementById(id);

    // Initialize PeerJS
    const myPeerId = "trix_user_" + Math.floor(Math.random() * 100000);
    
    try {
        // PeerJS connects to a default signaling server hosted by PeerJS
        peer = new Peer(myPeerId); 
        
        peer.on('open', (id) => {
            getEl('my-id').value = id;
            getEl('status-indicator').className = 'status-dot status-connected';
            updateStatus("Online & Ready. Share your ID.");
        });
 
        peer.on('call', (call) => {
            // Non-blocking UI prompt replaces the browser's 'confirm'
            handleIncomingCallUI(call);
        });
        
        peer.on('error', (err) => {
            console.error("PeerJS Error:", err);
            updateStatus(`Error: ${err.type}`);
            if (activeCall) endCallUI();
        });
 
    } catch (e) {
        updateStatus("Error initializing PeerJS.");
        console.error("PeerJS init failed (possible CSP or network block):", e);
    }
 
    // --- Core Functions ---

    // Get Mic Function
    async function getMic() {
        if (localStream) return localStream;
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return localStream;
        } catch (err) {
            updateStatus("Error: Mic permission denied or not found.");
            console.error("Mic access error:", err);
            // Non-blocking UI feedback instead of alert
            throw err; 
        }
    }
    
    // Toggle Mute Function
    function toggleMute() {
        if (!localStream) return;

        isMuted = !isMuted;
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !isMuted;
        });

        const btn = getEl('mute-btn');
        if (isMuted) {
            btn.textContent = '🔇 Unmute Microphone';
            btn.classList.remove('btn-yellow');
            btn.classList.add('btn-gray');
            updateStatus("Microphone muted.");
        } else {
            btn.textContent = '🎙️ Mute Microphone';
            btn.classList.remove('btn-gray');
            btn.classList.add('btn-yellow');
            updateStatus("Microphone unmuted.");
        }
    }
 
    // Handle Incoming Call UI (Replaces browser confirm)
    function handleIncomingCallUI(call) {
        if (activeCall) {
            console.log("Busy, rejecting incoming call.");
            return; // Already in a call
        }
        updateStatus(`Incoming call from ${call.peer}!`);
        getEl('incoming-call-prompt').style.display = 'block';
        getEl('connection-controls').style.display = 'none';

        // Clear previous listeners to prevent multiple responses
        getEl('accept-call-btn').replaceWith(getEl('accept-call-btn').cloneNode(true));
        getEl('reject-call-btn').replaceWith(getEl('reject-call-btn').cloneNode(true));
        
        const acceptBtn = getEl('accept-call-btn');
        const rejectBtn = getEl('reject-call-btn');
        
        const resetUI = () => {
            getEl('incoming-call-prompt').style.display = 'none';
            getEl('connection-controls').style.display = 'block';
            updateStatus("Online & Ready. Share your ID.");
        };

        acceptBtn.addEventListener('click', async () => {
            try {
                await getMic();
                call.answer(localStream);
                handleStream(call);
                resetUI();
            } catch (e) {
                // Mic failure handled in getMic()
                resetUI();
                call.close();
            }
        }, { once: true });

        rejectBtn.addEventListener('click', () => {
            call.close();
            resetUI();
        }, { once: true });
    }

    // Handle Active Call Stream
    function handleStream(call) {
        activeCall = call;
        getEl('connect-btn').style.display = 'none';
        getEl('disconnect-btn').style.display = 'block';
        getEl('mute-btn').style.display = 'block';
        
        getEl('status-indicator').className = 'status-dot status-connected';
        updateStatus("Connected to " + call.peer);
 
        call.on('stream', (remoteStream) => {
            audio.srcObject = remoteStream;
        });
 
        call.on('close', () => {
            endCallUI();
        });
        
        call.on('error', (err) => {
            console.error("Call Error:", err);
            updateStatus("Call Error. Ending...");
            endCallUI();
        });
    }
 
    function endCallUI() {
        if(activeCall) {
            activeCall.close();
            activeCall = null;
        }
        if(localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        
        // Reset UI state
        getEl('connect-btn').style.display = 'block';
        getEl('disconnect-btn').style.display = 'none';
        getEl('mute-btn').style.display = 'none';
        getEl('status-indicator').className = 'status-dot status-connected'; // Back to peer online
        audio.srcObject = null;
        
        // Reset mute button state
        isMuted = false;
        getEl('mute-btn').textContent = '🎙️ Mute Microphone';
        getEl('mute-btn').classList.remove('btn-gray');
        getEl('mute-btn').classList.add('btn-yellow');

        // Ensure controls are visible after call is over
        getEl('connection-controls').style.display = 'block'; 
        getEl('incoming-call-prompt').style.display = 'none';
        
        updateStatus("Call Ended. Ready.");
    }
 
    function updateStatus(msg) {
        getEl('msg-area').innerText = msg;
    }
 
    // --- EVENT LISTENERS ---
    getEl('connect-btn').addEventListener('click', async () => {
        const friendId = getEl('friend-id').value.trim();
        if (!friendId) return updateStatus("Please enter a friend's ID.");
        
        try {
            updateStatus("Calling " + friendId + "...");
            getEl('status-indicator').className = 'status-dot status-calling';
            
            await getMic();
            const call = peer.call(friendId, localStream);
            handleStream(call);
        } catch (e) {
            // Error handled in getMic()
            getEl('status-indicator').className = 'status-dot status-connected';
        }
    });
 
    getEl('disconnect-btn').addEventListener('click', () => {
        endCallUI();
    });
    
    getEl('mute-btn').addEventListener('click', () => {
        toggleMute();
    });
    
    // Simple Minimize Logic
    const body = getEl('voice-body');
    const header = getEl('voice-header');
    getEl('minimize-btn').addEventListener('click', () => {
        if (body.style.display === 'none') {
            body.style.display = 'block';
            getEl('minimize-btn').textContent = '—';
            header.style.borderBottom = '1px solid #333';
        } else {
            body.style.display = 'none';
            getEl('minimize-btn').textContent = '◻';
            header.style.borderBottom = 'none';
        }
    });
})();