// ==UserScript==
// @name         Saucepan MD→JSONL SillyTavern Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert Saucepan.ai MD chats to SillyTavern JSONL
// @author       WolfgangNoir
// @icon         https://files.catbox.moe/jer5m2.png
// @match        *://saucepan.ai/*
// @match        *://*.saucepan.ai/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564381/Saucepan%20MD%E2%86%92JSONL%20SillyTavern%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/564381/Saucepan%20MD%E2%86%92JSONL%20SillyTavern%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[SAUCEPAN CONVERTER] Script loaded!');

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function formatSTDate(dateObj) {
        const months = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
        let hours = dateObj.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
        const mins = dateObj.getMinutes().toString().padStart(2, '0');
        return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()} ${hours}:${mins}${ampm}`;
    }

    function parseSaucepanMD(mdContent) {
        const messages = [];
        const lines = mdContent.split('\n');

        let currentMessage = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Ignorar separadores Markdown
            if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
                continue;
            }

            // Detectar encabezado: **Nombre** (YYYY-MM-DD HH:MM:SS.mmmmmm +00:00:00):
            const headerMatch = line.match(/^\*\*(.+?)\*\*\s+\((.+?)\):?$/);

            if (headerMatch) {
                // Guardar mensaje anterior (limpiando el texto)
                if (currentMessage && currentMessage.text.trim()) {
                    // Limpiar separadores finales del mensaje
                    currentMessage.text = currentMessage.text
                        .replace(/\n---\s*$/, '')
                        .replace(/\n\*\*\*\s*$/, '')
                        .replace(/\n___\s*$/, '')
                        .trim();

                    if (currentMessage.text) {
                        messages.push(currentMessage);
                    }
                }

                const senderName = headerMatch[1].trim();
                const timestamp = headerMatch[2].trim();

                currentMessage = {
                    sender: senderName,
                    timestamp: new Date(timestamp.split(' ')[0] + 'T' + timestamp.split(' ')[1].split('.')[0]),
                    text: ''
                };
            } else if (currentMessage) {
                // Agregar línea al mensaje actual (solo si no está vacía)
                if (line.trim()) {
                    currentMessage.text += (currentMessage.text ? '\n' : '') + line;
                }
            }
        }

        // Guardar último mensaje (limpiando)
        if (currentMessage && currentMessage.text.trim()) {
            currentMessage.text = currentMessage.text
                .replace(/\n---\s*$/, '')
                .replace(/\n\*\*\*\s*$/, '')
                .replace(/\n___\s*$/, '')
                .trim();

            if (currentMessage.text) {
                messages.push(currentMessage);
            }
        }

        console.log(`[SAUCEPAN CONVERTER] Parsed ${messages.length} messages`);
        return messages;
    }

    function convertMDtoJSONL(mdContent, userName, charCardName, charDisplayName) {
        const messages = parseSaucepanMD(mdContent);

        if (messages.length === 0) {
            throw new Error('No messages found in the MD file');
        }

        const lines = [];
        const now = new Date();
        const createDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}@${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`;

        const metadata = {
            user_name: userName,
            character_name: charCardName,
            create_date: createDate,
            chat_metadata: {
                integrity: generateUUID(),
                chat_id_hash: Math.floor(Math.random() * 9e15) + 1e15,
                note_prompt: "",
                note_interval: 1,
                note_position: 1,
                note_depth: 4,
                note_role: 0,
                persona: "user-default.png",
                timedWorldInfo: { sticky: {}, cooldown: {} },
                tainted: true,
                lastInContextMessageId: 0
            }
        };
        lines.push(JSON.stringify(metadata));

        messages.forEach(msg => {
            const isUser = msg.sender === userName;
            const msgName = isUser ? userName : charDisplayName;

            const msgObj = {
                name: msgName,
                is_user: isUser,
                is_system: false,
                send_date: formatSTDate(msg.timestamp),
                mes: msg.text.trim().replace(/\n/g, '\r\n'),
                extra: {},
                continueHistory: [{
                    mes: msg.text.trim().replace(/\n/g, '\r\n'),
                    swipes: [],
                    parent: [],
                    active: [0]
                }],
                continueSwipeId: 0,
                continueSwipe: {
                    mes: msg.text.trim().replace(/\n/g, '\r\n'),
                    swipes: [],
                    parent: [],
                    active: [0]
                }
            };
            lines.push(JSON.stringify(msgObj));
        });

        return lines.join('\n');
    }

    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function promptForMDFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.md,.txt';
            input.style.display = 'none';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject(new Error('No file selected'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve(event.target.result);
                    document.body.removeChild(input);
                };
                reader.onerror = () => {
                    reject(new Error('Failed to read file'));
                    document.body.removeChild(input);
                };
                reader.readAsText(file);
            };

            input.oncancel = () => {
                reject(new Error('File selection cancelled'));
                document.body.removeChild(input);
            };

            document.body.appendChild(input);
            input.click();
        });
    }

    async function startConversion() {
        try {
            console.log('[SAUCEPAN CONVERTER] Prompting for MD file...');

            const mdContent = await promptForMDFile();

            console.log('[SAUCEPAN CONVERTER] File loaded, asking for names...');

            const userName = prompt("User Name (your name in the chat):", "User");
            if (!userName) return;

            const charCardName = prompt("Character Card Name (exact name for SillyTavern):", "Character");
            if (!charCardName) return;

            const charDisplayName = prompt("Character Display Name (name shown in chat):", charCardName);
            if (!charDisplayName) return;

            console.log('[SAUCEPAN CONVERTER] Converting...');

            const jsonlContent = convertMDtoJSONL(mdContent, userName, charCardName, charDisplayName);
            const filename = `${charCardName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.jsonl`;

            downloadFile(jsonlContent, filename, 'application/x-jsonlines');

            console.log('[SAUCEPAN CONVERTER] Success!');
            alert(`✅ Successfully converted to JSONL!\n\nFile: ${filename}\n\nYou can now import this file into SillyTavern.`);

        } catch (error) {
            console.error('[SAUCEPAN CONVERTER] Error:', error);
            alert(`❌ Conversion failed: ${error.message}`);
        }
    }

    // Inyectar botón "Export to JSONL"
    const observer = new MutationObserver(() => {
        const downloadButtons = document.querySelectorAll('button');

        downloadButtons.forEach(btn => {
            if (btn.textContent.includes('Download') && !btn.nextElementSibling?.id?.includes('export-jsonl')) {
                console.log('[SAUCEPAN CONVERTER] Injecting Export button...');

                const exportBtn = btn.cloneNode(true);
                exportBtn.id = 'saucepan-export-jsonl-' + Math.random();
                exportBtn.textContent = exportBtn.textContent.replace('Download', 'Export to JSONL');

                exportBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startConversion();
                });

                btn.parentNode.insertBefore(exportBtn, btn.nextSibling);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();