// ==UserScript==
// @name         Chat Message Scraper
// @namespace    http://tampermonkey.net/
// @version      2025-11-17
// @description  Scrape chat messages in GoBattle's chats through DevTools' Console. | Join us! - https://discord.gg/3xDbJ8QD8f
// @author       GoBattle Hacks Official
// @match        *://gobattle.io/*
// @match        *://*.gobattle.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547795/Chat%20Message%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/547795/Chat%20Message%20Scraper.meta.js
// ==/UserScript==

const nativeWebSocket = window.WebSocket;
window.WebSocket = function(...args){
    const socket = new nativeWebSocket(args[0], args[1]);

    socket.addEventListener("open", (event) => {
        console.log("connected CACA!!!!");
    });

    socket.addEventListener("message", (event) => {
        if (!event.data instanceof ArrayBuffer){
            return;
        }

        const view = new DataView(event.data);

        let cursor = 0;

        while (cursor < view.byteLength){
            const message_size = view.getUint8(cursor);
            cursor ++;

            const unknown = view.getUint8(cursor);
            cursor ++;

            const opcode = view.getUint8(cursor);
            cursor ++;

            switch (opcode){
                case 0x01:
                    cursor++;
                    break;
                case 0x06: // Message chat
                    const flags = view.getUint8(3 + cursor);
                    cursor += 4;
                    const sub_op = view.getUint8(cursor);
                    cursor += 1;
                    //console.log("m", flags, sub_op);
                    //console.log(Array.from(new Uint8Array(event.data)));
                    const id_entity = view.getUint32(cursor);
                    cursor += 5;
                    if (sub_op == 0x01){ // Message chat simple
                        const zero = view.getUint8(cursor);
                        cursor ++;
                        const nike_size = view.getUint8(cursor);
                        //console.log(zero, nike_size);
                        cursor ++;
                        const nike = new TextDecoder().decode(event.data.slice(cursor, nike_size + cursor));
                        cursor += nike_size;
                        const content_message_size = view.getUint8(cursor);
                        cursor += 2;
                        const content_message = new TextDecoder().decode(event.data.slice(cursor, content_message_size + cursor));

                        let transmitter = "UNKNOWN";
                        /*if (id_entity != 0){
                             transmitter = "PLAYER";
                        }else if (id_entity == 0){
                             transmitter = "NPC";
                        }else if (id_entity == 128){
                             transmitter = "SERVER";
                        }else{
                             transmitter = `UNKNOWN (${flags})`;
                        }*/
                        console.log(`${transmitter}#${id_entity} -> [${nike}]: ${content_message}`);
                    }else{
                        //console.log(String.fromCharCode.apply(null, new Uint8Array(event.data)));
                    }

                    break;
                case 0x80:
                    cursor++;
                    break;
                case 0xc8:
                    cursor++;
                    break;
                default:
                    cursor++;
            }

            cursor += message_size;
            break;
        }
    });
    return socket;
};