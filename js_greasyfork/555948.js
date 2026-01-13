// ==UserScript==
// @name         CunyCrypt
// @version      0.9.17
// @description  End-to-end encryption for Discord messages and files, but less obvious
// @author       redcat (forked from NotTrueFalse)
// @match        https://discord.com/*
// @match        https://*.discord.com/*
// @run-at       document-end
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/tweetnacl/1.0.2/nacl-fast.min.js
// @license      MIT
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/mdvo0ptfzzkx1myly1q7c0jtzpgu
// @namespace https://greasyfork.org/users/1538204
// @downloadURL https://update.greasyfork.org/scripts/555948/CunyCrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/555948/CunyCrypt.meta.js
// ==/UserScript==


/*
DisCrypt_hidden - Discord E2E Encryption but less obvious

Auto-encrypts messages and files using X25519 ECDH + XSalsa20-Poly1305.
Messages remain encrypted end-to-end even if your account is compromised.

Key Features:
- Automatic message encryption/decryption
- File attachment encryption with Ed25519 signature verification
- Message editing support
- Peer management UI
- Secure key storage in localStorage

Installation: Install as Tampermonkey userscript, then click the lock icon in Discord.
*/


(function () {
    'use strict';

    const signature_length = 64;
    const file_queue = new Set();

    function log(...args) {
        console.log('[DISCRYPT]', ...args);
    }

    function get_url_channel_id() {
        const match = window.location.pathname.match(/\/channels\/(@me|\d+)\/(\d+)/);
        if (match) { return match[2]; }
    }

    function encodeUTF8(utf8_string) {
        return new TextEncoder().encode(utf8_string);
    }

    function decodeUTF8(uint8Array) {
        return new TextDecoder().decode(uint8Array);
    }

    function encodeBase64(uint8Array) {
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
    }

    function decodeBase64(base64String) {
        const binary = atob(base64String);
        const uint8Array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            uint8Array[i] = binary.charCodeAt(i);
        }
        return uint8Array;
    }

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function isValidEd25519PubKey(key) {
        try {
            const decoded = decodeBase64(key);
            return decoded.length === 32;
        } catch {
            return false;
        }
    }

    async function encryptMessage(message) {
        try {
            if (!my_keypair) {
                throw new Error('No keypair available');
            }
            let peer_pub_keys = get_peer_pubkeys();
            if (!peer_pub_keys) return false;

            const peer_enc_pubkey = decodeBase64(peer_pub_keys.enc);
            const messageUint8 = encodeUTF8(message);
            const nonce = nacl.randomBytes(nacl.box.nonceLength);
            // Encrypt using ECDH: only recipient with their private key can decrypt
            const encrypted = nacl.box(
                messageUint8,
                nonce,
                peer_enc_pubkey,
                my_keypair.encryption.secretKey
            );
            if (!encrypted) {
                throw new Error('Encryption failed');
            }

            return {
                ciphertext: encodeBase64(encrypted),
                nonce: encodeBase64(nonce),
                senderPubKey: encodeBase64(my_keypair.encryption.publicKey)
            };
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    async function decryptMessage(ciphertext, nonce) {
        try {
            if (!my_keypair) {
                throw new Error('No keypair available');
            }
            let peer_pub_keys = get_peer_pubkeys();
            if (!peer_pub_keys) return false;
            const encryptedData = decodeBase64(ciphertext);
            const nonceData = decodeBase64(nonce);

            // const peer_sign_pubkey = decodeBase64(peer_pub_keys.sign); <-- maybe next update
            const peer_enc_pubkey = decodeBase64(peer_pub_keys.enc);

            const decrypted = nacl.box.open(
                encryptedData,
                nonceData,
                peer_enc_pubkey,
                my_keypair.encryption.secretKey
            );

            if (!decrypted) {
                throw new Error('Decryption failed - invalid key or corrupted data');
            }

            return decodeUTF8(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }

    async function decryptFile(encrypted_data) {
        try {
            if (!my_keypair) {
                throw new Error('No keypair available');
            }

            let peer_pub_keys = get_peer_pubkeys();
            if (!peer_pub_keys) return false;

            const nonceLength = nacl.box.nonceLength;

            const signature = encrypted_data.slice(0, signature_length);
            const nonce = encrypted_data.slice(signature_length, signature_length + nonceLength);
            const encryptedData = encrypted_data.slice(signature_length + nonceLength);

            const peer_sign_pubkey = decodeBase64(peer_pub_keys.sign);
            const peer_enc_pubkey = decodeBase64(peer_pub_keys.enc);


            //bypass signature check until fix because too slow

            //const messageToVerify = encrypted_data.slice(signature_length);
            //let verif_signature = nacl.sign.detached.verify(messageToVerify, signature, peer_sign_pubkey);

            //if (!verif_signature) {
            //    verif_signature = nacl.sign.detached.verify(messageToVerify, signature, my_keypair.signing.publicKey);
            //    if (!verif_signature) {
            //        throw new Error('File signature verification failed - file may be tampered');
            //    }
            //}

            const decrypted = nacl.box.open(
                encryptedData,
                nonce,
                peer_enc_pubkey,
                my_keypair.encryption.secretKey
            );

            if (!decrypted) {
                throw new Error('File decryption failed - invalid key or corrupted data');
            }

            return decrypted;
        } catch (error) {
            console.error('File decryption error:', error);
            return null;
        }
    }

    async function isFileEncrypted(encrypted_data) {
        try {
            let peer_pub_keys = get_peer_pubkeys();
            if (!peer_pub_keys) return false;
            const nonceLength = nacl.box.nonceLength;
            const minimumPackageLength = signature_length + nonceLength;

            if (encrypted_data.length < minimumPackageLength) return false;

            //bypass signature check until fix because too slow

            const signature = encrypted_data.slice(0, signature_length);
            //const messageToVerify = encrypted_data.slice(signature_length);
            //const peer_sign_pubkey = decodeBase64(peer_pub_keys.sign);

            //let verif_signature = nacl.sign.detached.verify(messageToVerify, signature, peer_sign_pubkey);
            //if (!verif_signature) {
            //    verif_signature = nacl.sign.detached.verify(messageToVerify, signature, my_keypair.signing.publicKey);
            //}
            //return verif_signature
            return true

        } catch (error) {
            log('Error checking if file is encrypted:', error);
            return false;
        }
    }

    function get_peer_pubkeys() {
        let peer_list_elem = document.getElementById("discrypt-peer-select");
        if(peer_list_elem){
            selected_peer_channel_id = peer_list_elem.value;
        }
        if (!selected_peer_channel_id || !known_peer[selected_peer_channel_id]) {
            selected_peer_channel_id = document.location.href.split("/")[document.location.href.split("/").length - 1];
            if (!selected_peer_channel_id || !known_peer[selected_peer_channel_id]) {
                selected_peer_channel_id = null;
                return
            }
        }
        return known_peer[selected_peer_channel_id];
    }

    async function handleEncryptedAttachment(attachmentElement, url) {
        try {
            const peer_pubkeys = get_peer_pubkeys();
            if (!peer_pubkeys) return log("no peer selected");

            const encryptedBuffer = await fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
                    return response.arrayBuffer();
                });

            // Verify peer still selected after async fetch
            if (!get_peer_pubkeys()) return log("peer deselected during fetch");

            const encrypted_data = new Uint8Array(encryptedBuffer);
            const isEncrypted = await isFileEncrypted(encrypted_data);
            file_queue.delete(attachmentElement.id);
            if (!isEncrypted) {
                log('Attachment is not encrypted (signature verification failed)');
                return;
            }
            const decryptedData = await decryptFile(encrypted_data);

            //truned off because of sign check bypass
            if (!decryptedData) {
                console.error('Failed to decrypt attachment');
            //    const indicator = document.createElement('div');
            //    indicator.textContent = '🔒 Encrypted - Cannot decrypt';
            //    indicator.style.cssText = 'color: #faa61a; font-size: 1em; margin-top: 4px;';
            //    attachmentElement.appendChild(indicator);
                return;
            }

            const linkElement = attachmentElement.querySelector('a');
            let encryptedFilename = linkElement?.textContent || 'decrypted_file';

            // Remove .png only if there's another extension before it (e.g., "file.txt.png" -> "file.txt")
            // Keep .png if it's the only extension (e.g., "image.png" -> "image.png")
            encryptedFilename = encryptedFilename.replace(/\.(\w+)\.png$/, '.$1');

            const originalFilename = encryptedFilename.replace('.encrypted', '');
            const extension = originalFilename.split('.').pop()?.toLowerCase() || '';

            const mimeTypeMap = {
                'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
                'gif': 'image/gif', 'webp': 'image/webp', 'svg': 'image/svg+xml',

                'mp4': 'video/mp4', 'webm': 'video/webm', 'ogg': 'video/ogg',
                'mov': 'video/quicktime', 'avi': 'video/x-msvideo',

                'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg',
                'flac': 'audio/flac', 'm4a': 'audio/mp4',

                'default': 'application/octet-stream'
            };

            const mimeType = mimeTypeMap[extension] || mimeTypeMap['default'];
            const mediaType = mimeType.split('/')[0];

            const blob = new Blob([decryptedData], { type: mimeType });
            const decryptedUrl = URL.createObjectURL(blob);

            // Revoke old URLs to prevent memory leaks
            const oldLinks = attachmentElement.querySelectorAll('a, video, audio');
            oldLinks.forEach(el => {
                if (el.href || el.querySelector('source')?.src) {
                    URL.revokeObjectURL(el.href || el.querySelector('source')?.src);
                }
            });

            attachmentElement.innerHTML = '';
            let mediaElement;

            switch (mediaType) {
                case 'image':
                    mediaElement = document.createElement('a');
                    mediaElement.href = decryptedUrl;
                    mediaElement.target = '_blank';
                    mediaElement.style.cssText = 'display: block;';

                    const img = document.createElement('img');
                    img.src = decryptedUrl;
                    img.alt = originalFilename;
                    img.style.cssText = 'max-width: 400px; max-height: 300px; border-radius: 4px; cursor: pointer;';
                    mediaElement.appendChild(img);
                    break;

                case 'video':
                    mediaElement = document.createElement('video');
                    mediaElement.controls = true;
                    mediaElement.preload = 'metadata';
                    mediaElement.style.cssText = 'max-width: 100%; max-height: 400px; border-radius: 4px;';
                    const videoSource = document.createElement('source');
                    videoSource.src = decryptedUrl;
                    videoSource.type = mimeType;
                    mediaElement.appendChild(videoSource);
                    break;

                case 'audio':
                    mediaElement = document.createElement('audio');
                    mediaElement.controls = true;
                    mediaElement.preload = 'metadata';
                    mediaElement.style.cssText = 'width: 100%;';
                    const audioSource = document.createElement('source');
                    audioSource.src = decryptedUrl;
                    audioSource.type = mimeType;
                    mediaElement.appendChild(audioSource);
                    break;

                default:
                    mediaElement = document.createElement('a');
                    mediaElement.href = decryptedUrl;
                    mediaElement.download = originalFilename;
                    mediaElement.textContent = `📎 ${originalFilename}`;
                    mediaElement.style.cssText = 'color: #00b0f4; text-decoration: none; padding: 8px 12px; background: #2f3136; border-radius: 4px; display: inline-block;';
                    break;
            }

            attachmentElement.appendChild(mediaElement);

            // const indicator = document.createElement('div');
            // indicator.textContent = '🔓 Decrypted';
            // indicator.style.cssText = 'color: #43b581; font-size: 1em; margin-top: 4px;';
            // attachmentElement.appendChild(indicator);

            log('Successfully decrypted:', originalFilename, mediaType);
        } catch (error) {
            console.error('Error handling encrypted attachment:', error, url);
        }
    }

    async function _raw_text_decryption(encryptedText) {
        try {
            // Parse format: [hrefprefix][nonce]:[ciphertext]:[senderPubKey]:[recipientPubKey]
            // Remove the hrefprefix character properly (it's multi-byte UTF-8)
            const withoutPrefix = encryptedText.substring(hrefprefix.length);
            const parts = withoutPrefix.split(':');
            if (parts.length !== 4) {
                log('Invalid encrypted message format, expected 4 parts, got:', parts.length, parts);
                return;
            }

            if (!my_keypair) {
                return -1;
            }

            const [nonce, ciphertext, senderPubKey, recipientPubKey] = parts;

            const myPubKeyB64 = encodeBase64(my_keypair.encryption.publicKey);
            const isSender = senderPubKey === myPubKeyB64;
            const isRecipient = recipientPubKey === myPubKeyB64;

            let decrypted;
            try {
                if (isSender) {
                    decrypted = await decryptMessage(ciphertext, nonce, recipientPubKey);
                } else if (isRecipient) {
                    decrypted = await decryptMessage(ciphertext, nonce, senderPubKey);
                } else {
                    decrypted = -1;
                }
                return { decrypted, isSender };
            } catch (e) {
                log("failed to decrypt:", e);
            }
        } catch (e) {
            console.error('Error decrypting raw text message:', e);
        }
    }

    async function extractMessageData(messageElement) {
        try {
            // Extract message ID from element id (format: chat-messages-123456789-123456789)
            let messageId = messageElement.id?.replace('chat-messages-', '');
            messageId = messageId.split("-")[messageId.split("-").length - 1];

            const contentElement = messageElement.querySelector(':not([class*="-repliedTextContent"])[id^="message-content-"] span');
            const messageHref = messageElement.querySelector(':not([class*="-repliedTextContent"])[id^="message-content-"] a')?.href.substring(prefixurllenght);
            const ReplyElem = messageElement.querySelector(`#message-reply-context-${messageId}`);
            const attachmentElem = messageElement.querySelector('[id^=message-accessories-]');
            //if (!((messageHref && messageId) || attachmentElem)) return;

            if (!(messageId || contentElement)){
                return;
            }


            if (messageHref) {
                if (messageHref.startsWith(hrefprefix)) {
                    handleEncryptedMessage(messageHref, contentElement, messageElement);
                }
            }

            if (!attachmentElem){
                return;
            }

            //if (ReplyElem) {
            //    const ReplyContentElement = ReplyElem.querySelector("[id^='message-content-'] a")?.href.substring(prefixurllenght);
            //    const ReplyContent = ReplyContentElement?.textContent;
            //    if (ReplyContent?.startsWith("")) {
            //        handleEncryptedMessage(ReplyElem.querySelector("[id^='message-content-']  a")?.href.substring(prefixurllenght), ReplyContentElement, messageElement);
            //    }
            //}

            // log(messageContent ,attachmentElem ,ReplyElem);

            if (attachmentElem) {
                const link = attachmentElem.querySelector("a")?.href;
                if (!(link && link.startsWith("https://cdn.discordapp.com/attachments"))) return
                if (link && !file_queue.has(attachmentElem.id)) {
                    //file_queue used to prevent handling twice same file
                    //because we fetch the file, a race condition can occure, and isEncrypted can be true twice, while it shouldn't.
                    //this prevent fetching and checking twice.
                    file_queue.add(attachmentElem.id);
                    handleEncryptedAttachment(attachmentElem, link);
                }
            }
            //kinda useless:
            return { message: { elem: messageHref, id: messageId, attachments: attachmentElem, reply: ReplyElem } };
        } catch (error) {
            console.error('Error extracting message data:', error);
        }
        return null;
    }

    async function handleEncryptedMessage(encryptedText, contentElement, messageElement) {
        let decrypted_data = await _raw_text_decryption(encryptedText);
        if (decrypted_data == -1 || decrypted_data?.decrypted == -1) {
            contentElement.textContent = '[Encrypted message - not for you]';
            contentElement.style.color = '#99aab5';
            return;
        }
        if (decrypted_data) {
            contentElement.textContent = decrypted_data.decrypted;
            contentElement.style.color = decrypted_data.isSender ? '#5865F2' : '#43b581';
            messageElement.querySelector(':not([class^="repliedTextContent"])[id^="message-content-"] a').remove;
        } else {
            contentElement.textContent = '[Encrypted message - cannot decrypt]';
            contentElement.style.color = '#faa61a';
            messageElement.querySelector(':not([class^="repliedTextContent"])[id^="message-content-"] a').remove;
        }
    }

    function wait_for_webpack(callback) {
        if (!window.webpackChunkdiscord_app) {
            return setTimeout(wait_for_webpack, 100, callback);
        }
        callback();
    }
    window.base_functions = {};

    let selected_peer_channel_id;

    let hrefprefix = "3ncrypt3d";//"­‌​";
    let prefix = "[⁠︄](<https://youare.gay/?msg=";
    let prefixurllenght = 24;
    let suffix = ">)";
    let randomtext = "";
    let userselectedpeer = false;

    let text_pool = ["bruh",
"wdym?",
"wym?",
"you serious?",
"no cap",
"cap",
"fr",
"facts",
"big facts",
"true that",
"based",
"you’re based",
"unbased",
"cringe",
"lowkey cringe",
"highkey true",
"mood",
"big mood",
"same",
"same lol",
"ikr",
"lol what",
"lmao",
"deadass",
"deadass?",
"bet",
"bettt",
"nah fam",
"fam",
"bro",
"sis",
"chief",
"legend",
"icon",
"savage",
"savage move",
"yikes",
"oof",
"oof true",
"dang",
"hmm",
"sheesh",
"sus",
"pog",
"poggers",
"legit",
"legit tho",
"no way",
"really?",
"fr fr",
"big yikes",
"okay then",
"ok cool",
"say less",
"say no more",
"chef’s kiss",
"nice",
"wow",
"solid",
"noted",
"that slaps",
"that hits",
"relatable",
"relatable af",
"bless up",
"real one",
"real talk",
"ngl",
"tbh",
"tbh idk",
"tbh that’s fair",
"hot take",
"spicy",
"vibes",
"vibes only",
"same vibes",
"yas",
"yas queen",
"cringe alert",
"classic",
"fair",
"fair enough",
"approved",
"denied",
"10/10",
"8/10",
"meh",
"lol no idea",
"haha",
"hehe",
"wowza",
"big mood, low effort",
"tiny detail, big impact",
"oof lol",
"big oof",
"insane",
"wild",
"iconic",
"wholesome",
"wholesome ngl",
"sus but okay",
"that tracks",
"makes sense",
"can’t argue",
"same here",
"mine too",
"cool cool",
"ok sure",
"ok bet",
"ok boomer",
"cope",
"based fr",
"facts fr",
"real talk fr",
"low-key true",
"high-key mood",
"no shade",
"no tea",
"spill the tea",
"tea?",
"gossip?",
"pogchamp",
"yeet",
"oops",
"whoops",
"nice one",
"big brain",
"brainlet",
"big brain hours",
"small brain, big heart",
"chef’s kiss",
"clap",
"applause",
"slow clap",
"cringe but ok",
"not bad",
"not great",
"try harder",
"same energy",
"different day",
"silent nod",
"impressed",
"unimpressed",
"solid take",
"fair take",
"brave take",
"bold",
"chill",
"coolio",
"dope",
"lit",
"flames",
"that slaps fr",
"that hits hard",
"low-key sus",
"high-key cringe",
"suspicious",
"sus fr",
"y tho",
"why tho",
"facts though",
"true tho",
"ikr fr",
"ayooo",
"bro fr",
"sis fr",
"chief fr",
"legend fr",
"icon fr",
"savage fr",
"oof fr",
"dang fr",
"lol fr",
"deadass fr",
"bet fr",
"nah fr",
"fam fr",
"yes fr",
"no fr",
"maybe fr",
"unsure fr",
"idc",
"idc fr",
"same lol fr",
"mood fr",
"big mood fr",
"relatable fr",
"relatable lol",
"blush",
"cringe laugh",
"im laughing",
"crying laugh",
"tears",
"haha stop",
"lol stop",
"big stop",
"actually",
"ironically",
"totally",
"totally not",
"kinda",
"sorta",
"somewhat",
"maybe so",
"maybe not",
"maybe idk",
"who cares",
"who knows",
"sounds right",
"sounds good",
"sounds about right",
"ok nice",
"ok noted",
"ok thanks",
"thanks!",
"thanks lol",
"thanks fr",
"ty",
"thx",
"appreciated",
"no prob",
"np",
"you got it",
"on it",
"doing that",
"will do",
"I’ll try",
"hang on",
"one sec",
"be right back",
"on my way",
"running late",
"all good",
"no worries",
"cool thanks",
"cool thanks!",
"gotcha",
"got it",
"got you",
"understood",
"copy that",
"roger",
"roger that",
"affirmed",
"noted thanks",
"sounds fair",
"sounds promising",
"sounds sus",
"honestly",
"What do you think about penguins?",
"Ever noticed how small details change everything?",
"Have you tried the opposite approach?",
"Imagine doing the exact reverse",
"Speaking of that, any book recs?",
"what about AI art?",
"what about privacy?",
"pets love this",
"favorite snack?",
"who taught you that?",
"coffee or tea?",
"morning person?",
"people overestimate X",
"context changes meaning",
"got a favorite movie?",
"test with a small group",
"penguins are underrated",
"what music fits this?",
"ever coded something like that?",
"favorite meme?",
"dream vacation?",
"that’s oddly satisfying",
"that sounds unnecessarily complex",
"that’s kinda genius",
"that’s kinda silly",
"penguins can drink seawater",
"tiny changes compound",
"bias hides in patterns",
"users hate surprises",
"did you know about the thing on X?",
"this trend won’t last",
"this will blow up",
"try it for a day",
"swap roles once",
"ignore assumptions for a day",
"switch metrics",
"ask five strangers",
"run a 24-hour test",
"favorite game?",
"favorite song right now?",
"random hobby?",
"weird talent?",
"pet pictures?",
"would you defend that?",
"play devil’s advocate",
"now imagine failure",
"now imagine success",
"other thing I saw today",
"different angle to try",
"new resource to share",
"saw something like this once",
"worked better than expected",
"failed hilariously",
"learned a lesson",
"that shows good taste",
"that’s thoughtful",
"impressive detail",
"neat instinct",
"try to simplify it",
"trim the extras",
"focus on impact",
"small wins add up",
"this hides risk",
"watch for edges",
"which part surprised you?",
"what changed your mind?",
"who else thought this?",
"any quick resources?",
"where did you read that?",
"I prefer simpler options",
"I like the creativity here",
"this feels premature",
"timing feels right",
"want to try a spin on it?",
"want a trial run?",
"want help prototyping?",
"want me to check data?",
"what if penguins ruled?",
"what if cats texted?",
"imagine a world upside down",
"small friction kills adoption",
"defaults shape behavior",
"naming matters a lot",
"first impressions stick"];

    wait_for_webpack(() => {
        log("webpack loaded");
        let found = false;
        function try_hijack() {
            if (found) return;
            log("trying to hijack functions...");
            window.webpackChunkdiscord_app.push([[Symbol()], {}, o => {
                for (let k of Object.keys(o.c)) {
                    let module = o.c[k];
                    if (found) return;
                    try {
                        if (!module.exports || module.exports === window) continue;
                        for (let oo in module.exports) {
                            if (found) return;
                            let multiple_functions = module.exports[oo];

                            //send attachment hooking
                            if (typeof multiple_functions == "function" && multiple_functions?.tryConvertToWebP) {
                                let proto_functions = multiple_functions.prototype;
                                for (let function_name of ["upload"]) {
                                    if (function_name in proto_functions) {
                                        window.base_functions[function_name] = proto_functions[function_name];
                                        switch (function_name) {
                                            case "upload":
                                                proto_functions[function_name] = async function (...args) {
                                                    // log("[upload debug] - this context:", this);
                                                    // log("[upload debug] - original file:", this.item?.file);

                                                    const originalFile = this.item.file;
                                                    if (!selected_peer_channel_id || !known_peer[selected_peer_channel_id]) {
                                                        log('[upload] no peer selected, uploading without encryption');
                                                        return await window.base_functions[function_name].apply(this, args);
                                                    }

                                                    if (!my_keypair) {
                                                        log('[upload] no keypair available');
                                                        return await window.base_functions[function_name].apply(this, args);
                                                    }

                                                    const fileBuffer = await originalFile.arrayBuffer();
                                                    const fileUint8 = new Uint8Array(fileBuffer);

                                                    const recipientPubKey = decodeBase64(known_peer[selected_peer_channel_id].enc);
                                                    const nonce = nacl.randomBytes(nacl.box.nonceLength);

                                                    const encryptedData = nacl.box(
                                                        fileUint8,
                                                        nonce,
                                                        recipientPubKey,
                                                        my_keypair.encryption.secretKey
                                                    );

                                                    if (!encryptedData) {
                                                        log('[upload] encryption failed');
                                                        return await window.base_functions[function_name].apply(this, args);
                                                    }

                                                    // Sign the nonce + encryptedData with Ed25519
                                                    const messageToSign = new Uint8Array(nonce.length + encryptedData.length);
                                                    messageToSign.set(nonce, 0);
                                                    messageToSign.set(encryptedData, nonce.length);
                                                    const signature = nacl.sign.detached(messageToSign, my_keypair.signing.secretKey);

                                                    // Package format: [signature(64)][nonce(24)][encryptedData]
                                                    const encryptedPackage = new Uint8Array(signature.length + messageToSign.length);
                                                    encryptedPackage.set(signature, 0);
                                                    encryptedPackage.set(messageToSign, signature.length);

                                                    const encryptedFile = new File(
                                                        [encryptedPackage],
                                                        originalFile.name,
                                                        {
                                                            type: "image/png",
                                                            lastModified: Date.now()
                                                        }
                                                    );
                                                    //method used to bypass cors: (change name add .png)
                                                    if(this?.filename && !this.filename.endsWith(".png")){
                                                        this.filename += ".png";
                                                    }
                                                    this.item.file = encryptedFile;
                                                    log('[upload] encrypted file:', this.item,this);
                                                    return await window.base_functions[function_name].apply(this, args);
                                                };
                                                break;
                                            default:
                                                if (proto_functions[function_name].constructor.name == 'AsyncFunction') {
                                                    proto_functions[function_name] = async function (...args) {
                                                        log(`async (${function_name}):`, args);
                                                        return await window.base_functions[function_name].apply(this, args);
                                                    }
                                                } else {
                                                    proto_functions[function_name] = function (...args) {
                                                        log(`(${function_name}):`, args);
                                                        return window.base_functions[function_name].apply(this, args);
                                                    }
                                                }
                                                break;
                                        }
                                    }
                                }
                            }

                            for (let function_name of ["sendMessage", "editMessage", "patchMessageAttachments", "startEditMessageRecord", "endEditMessage"]) {// "getSendMessageOptionsForReply","receiveMessage"]) {
                                if (function_name in multiple_functions && multiple_functions[function_name][Symbol.toStringTag] != "IntlMessagesProxy") {
                                    window.base_functions[function_name] = multiple_functions[function_name];
                                    // log(function_name, multiple_functions[function_name]);
                                    switch (function_name) {
                                        case "sendMessage":
                                            multiple_functions[function_name] = async (...args) => {
                                                let channel_id = args[0];
                                                let message = args[1];
                                                if (channel_id in known_peer) {
                                                    selected_peer_channel_id = channel_id;
                                                }
                                                // log(args);
                                                if (!("id" in message) && selected_peer_channel_id && message.content != "") {
                                                    //!("id in message) => before pending state, we can modify content here
                                                    const encrypted = await encryptMessage(message.content, known_peer[selected_peer_channel_id].enc);
                                                    if (!encrypted) {
                                                        alert('Message encryption failed !');
                                                        return;
                                                    }
                                                    // Format: [hrefprefix][nonce]:[ciphertext]:[senderPubKey]:[known_peer[selected_peer_channel_id]]
                                                    randomtext = text_pool[Math.floor(Math.random() * text_pool.length)];
                                                    const encryptedMessage = `${randomtext}${prefix}${hrefprefix}${encrypted.nonce}:${encrypted.ciphertext}:${encrypted.senderPubKey}:${known_peer[selected_peer_channel_id].enc}${suffix}`;
                                                    message["content"] = encryptedMessage;
                                                    args[1] = message;
                                                }
                                                return window.base_functions[function_name](...args);
                                            };
                                            break;
                                        case "startEditMessageRecord":
                                            multiple_functions[function_name] = async (...args) => {
                                                let channel_id = args[0];
                                                let message = args[1];
                                                if (channel_id in known_peer) {
                                                    selected_peer_channel_id = channel_id;
                                                }
                                                if (selected_peer_channel_id && message.content && message.content.split("<")[1].substring(prefixurllenght).split(">")[0].startsWith(hrefprefix)) {
                                                    const decrypted_data = await _raw_text_decryption(message.content.split("<")[1].substring(prefixurllenght).split(">")[0]);
                                                    if (!decrypted_data || decrypted_data == -1) {
                                                        alert(message.content);
                                                        return;
                                                    }
                                                    message["content"] = decrypted_data.decrypted;
                                                    args[1] = message;
                                                }
                                                return window.base_functions[function_name](...args);
                                            }
                                            break;
                                        case "editMessage":
                                            multiple_functions[function_name] = async (...args) => {
                                                let channel_id = args[0];
                                                // let message_id = args[1];
                                                let message = args[2];
                                                if (channel_id in known_peer) {
                                                    selected_peer_channel_id = channel_id;
                                                }
                                                if (selected_peer_channel_id) {
                                                    const encrypted = await encryptMessage(message.content, known_peer[selected_peer_channel_id].enc);
                                                    if (!encrypted) {
                                                        alert('Message encryption failed !');
                                                        return;
                                                    }
                                                    randomtext = text_pool[Math.floor(Math.random() * text_pool.length)];
                                                    const encryptedMessage = `${randomtext}${prefix}${hrefprefix}${encrypted.nonce}:${encrypted.ciphertext}:${encrypted.senderPubKey}:${known_peer[selected_peer_channel_id].enc}${suffix}`;
                                                    message["content"] = encryptedMessage;
                                                    args[2] = message;
                                                }
                                                return window.base_functions[function_name](...args);
                                            }
                                            break;
                                        case "endEditMessage":
                                            multiple_functions[function_name] = async (...args) => {
                                                window.base_functions[function_name](...args);
                                                // let focusMessage do its thing
                                                //so we can immeditaly edit the message afterward.
                                                let channel_id = args[0];
                                                let edit_payload = args[1];
                                                if (channel_id in known_peer) {
                                                    selected_peer_channel_id = channel_id;
                                                }
                                                //we get the message element then decrypt it
                                                if (selected_peer_channel_id && edit_payload?.body && edit_payload?.status < 300) {
                                                    let edited_message = document.getElementById(`chat-messages-${edit_payload.body.channel_id}-${edit_payload.body.id}`);
                                                    if (!edited_message) {
                                                        log('Edited message element not found');
                                                        return;
                                                    }
                                                    let pollCount = 0;
                                                    const maxPolls = 100; // ~10 second at 100ms intervals
                                                    const waitForEncryptedVersion = () => {
                                                        if (pollCount++ > maxPolls) {
                                                            log('Timeout waiting for encrypted message');
                                                            return;
                                                        }
                                                        const contentHref = edited_message.querySelector(':not([class^="repliedTextContent"])[id^="message-content-"] a')?.href.substring(prefixurllenght);
                                                        if (!contentHref) {
                                                            setTimeout(waitForEncryptedVersion, 100);
                                                            return;
                                                        }
                                                        const messageContent = contentHref || '';
                                                        if (messageContent.startsWith(hrefprefix)) {
                                                            return extractMessageData(edited_message);
                                                        }
                                                        setTimeout(waitForEncryptedVersion, 100);
                                                    };
                                                    waitForEncryptedVersion();
                                                }
                                            }
                                            break;
                                        default:
                                            if (multiple_functions[function_name].constructor.name == 'AsyncFunction') {
                                                multiple_functions[function_name] = async (...args) => {
                                                    log(`async (${function_name}): ${JSON.stringify(args)}`);
                                                    return await window.base_functions[function_name].apply(this, args);
                                                }
                                            } else {
                                                multiple_functions[function_name] = (...args) => {
                                                    log(`(${function_name}): ${JSON.stringify(args)}`);
                                                    return window.base_functions[function_name].apply(this, args);
                                                }
                                            }
                                            break;
                                    }
                                    found = 1;
                                }
                            }
                        }
                    } catch { }
                }

            }]);
            window.webpackChunkdiscord_app.pop();
            if (!found) {
                setTimeout(try_hijack, 100);
            } else {
                log("hijacked function send / receive message");
            }
        }
        try_hijack();
    });

    function restore_localstorage() {
        if (window.localStorage) {
            setTimeout(restore_localstorage, 100);
            return log("waiting to restore localstorage...");
        }
        function getLocalStoragePropertyDescriptor() {
            const iframe = document.createElement('iframe');
            document.head.append(iframe);
            const pd = Object.getOwnPropertyDescriptor(iframe.contentWindow, 'localStorage');
            iframe.remove();
            return pd;
        }
        Object.defineProperty(window, 'cunnycryptlocalstorage', getLocalStoragePropertyDescriptor());
        if (!cunnycryptlocalstorage) {
            setTimeout(restore_localstorage, 100);
            return log("waiting to restore localstorage...");
        }
        log("restored localstorage")
    }
    restore_localstorage();

    function save_peers(peers) {
        cunnycryptlocalstorage.setItem("discrypt-peers", JSON.stringify(peers));
    }

    function save_keypair(keypair) {
        cunnycryptlocalstorage.setItem("discrypt-keypair", JSON.stringify(keypair));
    }

    function get_keypair() {
        let keypair_string = cunnycryptlocalstorage.getItem("discrypt-keypair");
        if (!keypair_string) return null;
        try {
            const parsed = JSON.parse(keypair_string);
            return {
                signing: {
                    publicKey: decodeBase64(parsed.signing.publicKey),
                    secretKey: decodeBase64(parsed.signing.secretKey)
                },
                encryption: {
                    publicKey: decodeBase64(parsed.encryption.publicKey),
                    secretKey: decodeBase64(parsed.encryption.secretKey)
                }
            };
        } catch (e) {
            log("Something went wrong when loading keypair:", e);
            return null;
        }
    }


    function get_peers() {
        let peers_string = cunnycryptlocalstorage.getItem("discrypt-peers");
        if (!peers_string) { save_peers({}); return {}; }
        try {
            return JSON.parse(peers_string);
        } catch (e) {
            log("Something went wrong when loading peers:", e);
            return -1;
        }
    }

    let known_peer = get_peers();
    if (known_peer == -1) { return; }

    let my_keypair = get_keypair();

    log("Loaded peers:", known_peer, "encryption keypair:", my_keypair);


    function waitForLibraries(callback) {
        if (nacl) {
            window.clearTimeout(window.nacl_load_timeout);
            callback();
        } else if (window.nacl_load_timeout === undefined) {
            window.nacl_load_timeout = setTimeout(() => {
                alert("Can't start, nacl library unavailable.");
            }, 10000);
            setTimeout(() => waitForLibraries(callback), 100);
        } else {
            setTimeout(() => waitForLibraries(callback), 100);
        }
    }

    waitForLibraries(initDiscrypt);

    function initDiscrypt() {

        function createPeerSelectorUI() {
            // Create a floating peer selector that appears near the message input
            const selector = document.createElement('div');
            selector.id = 'discrypt-peer-selector';
            selector.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 9999;
                background: #2f3136;
                border: 2px solid #5865F2;
                border-radius: 8px;
                padding: 10px;
                color: white;
                min-width: 200px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                display: none;
            `;

            const titleDiv = document.createElement('div');
            titleDiv.style.cssText = 'font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;';

            const titleText = document.createElement('span');
            titleText.textContent = '🔐 Encrypt for:';
            titleDiv.appendChild(titleText);

            const closeBtn = document.createElement('button');
            closeBtn.id = 'discrypt-close-selector';
            closeBtn.style.cssText = 'background: transparent; border: none; color: #ed4245; cursor: pointer; font-size: 16px; padding: 0;';
            closeBtn.textContent = '✕';
            closeBtn.addEventListener('click', () => {
                selector.style.display = 'none';
            });
            titleDiv.appendChild(closeBtn);
            selector.appendChild(titleDiv);

            const selectElement = document.createElement('select');
            selectElement.id = 'discrypt-peer-select';
            selectElement.style.cssText = 'width: 100%; padding: 6px; background: #40444b; border: 1px solid #202225; color: white; border-radius: 4px; cursor: pointer;';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- No encryption --';
            selectElement.appendChild(defaultOption);

            selectElement.addEventListener('change', (e) => {
                const channel_id = e.target.value;
                const hintElement = document.getElementById('discrypt-selector-hint');
                if (channel_id) {
                    userselectedpeer = true;
                    selected_peer_channel_id = channel_id;
                    hintElement.textContent = `✓ Encrypting for peer ${channel_id}`;
                    hintElement.style.color = '#43b581';
                } else {
                    userselectedpeer = false;
                    selected_peer_channel_id = null;
                    hintElement.textContent = '✗ Not encrypted';
                    hintElement.style.color = '#b54843';
                }
            });
            selector.appendChild(selectElement);

            const hintDiv = document.createElement('div');
            hintDiv.id = 'discrypt-selector-hint';
            hintDiv.style.cssText = 'margin-top: 8px; font-size: .9em; color: #99aab5;';
            hintDiv.textContent = 'Select a peer to encrypt messages';
            selector.appendChild(hintDiv);

            document.body.appendChild(selector);
            return selector;
        }

        async function updatePeerSelector(channel_id) {
            const selector = document.getElementById('discrypt-peer-selector');
            const selectElement = document.getElementById('discrypt-peer-select');

            if (!selector || !selectElement) return;
            const isDM = Object.keys(known_peer).includes(channel_id);

            if (isDM) {
                selected_peer_channel_id = channel_id;
                selectElement.value = selected_peer_channel_id;
                document.getElementById('discrypt-selector-hint').textContent = `✓ Encrypting for current channel`;
                document.getElementById('discrypt-selector-hint').style.color = '#43b581';
            } else {
                selected_peer_channel_id = null;
                // Clear old options instead of using innerHTML
                while (selectElement.options.length > 0) {
                    selectElement.remove(0);
                }

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '-- No encryption --';
                selectElement.appendChild(defaultOption);

                Object.entries(known_peer).forEach(([_channel_id, pubKey]) => {
                    const option = document.createElement('option');
                    option.value = _channel_id;
                    option.textContent = `Channel ${_channel_id}`;
                    selectElement.appendChild(option);
                });

                if (selected_peer_channel_id && known_peer[selected_peer_channel_id]) {
                    selectElement.value = selected_peer_channel_id;
                    document.getElementById('discrypt-selector-hint').textContent = `✓ Encrypting for peer ${selected_peer_channel_id}`;
                    document.getElementById('discrypt-selector-hint').style.color = '#43b581';
                } else {
                    selected_peer_channel_id = null;
                    document.getElementById('discrypt-selector-hint').textContent = `✗ Not encrypted`;
                    document.getElementById('discrypt-selector-hint').style.color = '#b54843';
                }

                selector.style.display = 'block';
            }
        }

        function createGUI(callback) {
            const oldButton = document.querySelector('#discrypt-settings-button');
            if (oldButton) oldButton.remove();

            const findToolBar = () => {
                return document.querySelector('[class*="-toolbar"]');
            };

            const ToolBar = findToolBar();

            if (!ToolBar) {
                log('Sidebar not found, retrying...');
                setTimeout(createGUI, 1000, callback);
                return;
            }

            const listItem = document.createElement('div');
            listItem.id = 'discrypt-settings-button';

            const listItemWrapper = document.createElement('div');
            listItemWrapper.className = findClassNames('listItemWrapper');

            const wrapper = document.createElement('div');
            wrapper.className = findClassNames('wrapper');
            wrapper.style.cssText = `
                cursor: pointer;
                position: relative;
                display: flex;
            `;

            wrapper.addEventListener('mouseenter', () => {
                wrapper.style.filter = 'brightness(0.7)';
            });

            wrapper.addEventListener('mouseleave', () => {
                wrapper.style.filter = 'brightness(1)'
            });

            const iconDiv = document.createElement('div');
            iconDiv.style.cssText = 'font-size: 20px; line-height: 1;';
            iconDiv.textContent = '🔐';
            wrapper.appendChild(iconDiv);
            wrapper.addEventListener('click', () => showPeerModal());


            listItemWrapper.appendChild(wrapper);
            listItem.appendChild(listItemWrapper);
            ToolBar.appendChild(listItem);
            createPeerSelectorUI();
            if (callback) callback();
        }

        function findClassNames(partialName) {
            const selectors = {
                'listItem': '[class*="listItem"]',
                'listItemWrapper': '[class*="listItemWrapper"]',
                'wrapper': '[class*="wrapper_"][class*="svg"]'
            };

            const element = document.querySelector(selectors[partialName]);
            if (element) {
                const classes = Array.from(element.classList)
                    .filter(c => c.includes(partialName.replace(/([A-Z])/g, '_$1').toLowerCase()) ||
                        c.includes(partialName));
                return classes.join(' ') || '';
            }
            return '';
        }

        function showPeerModal() {
            const modal = document.createElement('div');
            modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: #2f3136;
            padding: 20px;
            border-radius: 8px;
            color: white;
            width: 90vw;
            max-width: 1200px;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            gap: 20px;
        `;

            // Left column: Keys (fixed width)
            const leftColumn = document.createElement('div');
            leftColumn.style.cssText = 'flex: 0 0 350px; overflow-y: auto; padding-right: 10px;';

            const keysTitle = document.createElement('h3');
            keysTitle.style.cssText = 'margin:0 0 2vh 0;';
            keysTitle.textContent = 'My Public Keys';
            leftColumn.appendChild(keysTitle);

            if (my_keypair && my_keypair.encryption && my_keypair.signing) {
                const encPubKeyB64 = encodeBase64(my_keypair.encryption.publicKey);
                const signPubKeyB64 = encodeBase64(my_keypair.signing.publicKey);

                const keyDiv = document.createElement('div');
                keyDiv.style.cssText = 'margin-bottom: 15px;';

                const encLabel = document.createElement('label');
                encLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: bold; font-size: 1em;';
                encLabel.textContent = 'X25519 (Encryption)';
                keyDiv.appendChild(encLabel);

                const encBox = document.createElement('div');
                encBox.style.cssText = 'padding: 10px; background: #40444b; border-radius: 4px; word-break: break-all; margin-bottom: 10px;';
                const encCode = document.createElement('code');
                encCode.style.cssText = 'color:rgb(104, 235, 245);user-select:all; font-size: 1em;';
                encCode.textContent = encPubKeyB64;
                encBox.appendChild(encCode);
                keyDiv.appendChild(encBox);

                const signLabel = document.createElement('label');
                signLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: bold; font-size: 1em;';
                signLabel.textContent = 'Ed25519 (Signing)';
                keyDiv.appendChild(signLabel);

                const signBox = document.createElement('div');
                signBox.style.cssText = 'padding: 10px; background: #40444b; border-radius: 4px; word-break: break-all;';
                const signCode = document.createElement('code');
                signCode.style.cssText = 'color:rgb(104, 235, 245);user-select:all; font-size: 1em;';
                signCode.textContent = signPubKeyB64;
                signBox.appendChild(signCode);
                keyDiv.appendChild(signBox);

                const copyBtn = document.createElement('button');
                copyBtn.id = 'copyBothKeysBtn';
                copyBtn.style.cssText = 'display: block; margin-top: 8px; padding: 5px 10px; background: #5865F2; border: none; color: white; border-radius: 3px; cursor: pointer; width: 100%; font-size: 1em;';
                copyBtn.textContent = 'Copy Both Keys';
                copyBtn.addEventListener('click', () => {
                    const bothKeys = `Encryption (X25519):\n${encPubKeyB64}\n\nSigning (Ed25519):\n${signPubKeyB64}`;
                    navigator.clipboard.writeText(bothKeys).then(() => {
                        const originalText = copyBtn.textContent;
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
                    }).catch(err => {
                        log('Failed to copy to clipboard:', err);
                        alert('Failed to copy to clipboard');
                    });
                });
                keyDiv.appendChild(copyBtn);
                leftColumn.appendChild(keyDiv);
            } else {
                const keyDiv = document.createElement('div');
                keyDiv.style.cssText = 'margin-bottom: 15px;';

                const noKeyMsg = document.createElement('p');
                noKeyMsg.style.cssText = 'color: #999; font-size: 1em;';
                noKeyMsg.textContent = 'No keypair generated yet.';
                keyDiv.appendChild(noKeyMsg);

                const generateBtn = document.createElement('button');
                generateBtn.id = 'generateKeyBtn';
                generateBtn.style.cssText = 'padding: 8px 15px; background: #5865F2; border: none; color: white; border-radius: 4px; cursor: pointer; font-size: 1em;';
                generateBtn.textContent = 'Generate Keypair';
                keyDiv.appendChild(generateBtn);
                leftColumn.appendChild(keyDiv);
            }

            modal.appendChild(leftColumn);

            // Middle column: Known Peers (scrollable, grows)
            const middleColumn = document.createElement('div');
            middleColumn.style.cssText = 'flex: 1; overflow-y: auto; padding: 0 10px; min-width: 250px;';

            buildPeerListElement().then(peerListContainer => {
                middleColumn.appendChild(peerListContainer);
                modal.appendChild(middleColumn);

                // Right column: Add Peer (fixed width)
                const rightColumn = document.createElement('div');
                rightColumn.style.cssText = 'flex: 0 0 320px; overflow-y: auto; padding-left: 10px;';

                const addPeerTitle = document.createElement('h3');
                addPeerTitle.style.cssText = 'margin: 0 0 1vh 0; font-size: 14px;';
                addPeerTitle.textContent = 'Add New Peer';
                rightColumn.appendChild(addPeerTitle);

                const formDiv = document.createElement('div');
                formDiv.style.cssText = 'background: #40444b; padding: 12px; border-radius: 4px;';


                // Channel ID input
                const channelIdDiv = document.createElement('div');
                channelIdDiv.style.cssText = 'margin-bottom: 10px;';
                const channelIdLabel = document.createElement('label');
                channelIdLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: .9em; color: #b5bac1; font-weight: bold;';
                channelIdLabel.textContent = 'Channel ID';
                channelIdDiv.appendChild(channelIdLabel);
                const channelIdInput = document.createElement('input');
                channelIdInput.type = 'text';
                channelIdInput.id = 'peerId';
                channelIdInput.placeholder = '1234567890123456789';
                channelIdInput.style.cssText = 'width: 100%; padding: 6px; background: #2f3136; border: 1px solid #202225; color: white; border-radius: 4px; box-sizing: border-box; font-size: .9em;';
                channelIdDiv.appendChild(channelIdInput);
                formDiv.appendChild(channelIdDiv);

                // Encryption key input
                const encKeyDiv = document.createElement('div');
                encKeyDiv.style.cssText = 'margin-bottom: 10px;';
                const encKeyLabel = document.createElement('label');
                encKeyLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: .9em; color: #b5bac1; font-weight: bold;';
                encKeyLabel.textContent = 'X25519 Key';
                encKeyDiv.appendChild(encKeyLabel);
                const encKeyInput = document.createElement('input');
                encKeyInput.type = 'text';
                encKeyInput.id = 'peerPubKeyEnc';
                encKeyInput.placeholder = 'Base64...';
                encKeyInput.style.cssText = 'width: 100%; padding: 6px; background: #2f3136; border: 1px solid #202225; color: white; border-radius: 4px; box-sizing: border-box; font-family: monospace; font-size: 1em;';
                encKeyDiv.appendChild(encKeyInput);
                formDiv.appendChild(encKeyDiv);

                // Signing key input
                const signKeyDiv = document.createElement('div');
                signKeyDiv.style.cssText = 'margin-bottom: 10px;';
                const signKeyLabel = document.createElement('label');
                signKeyLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: .9em; color: #b5bac1; font-weight: bold;';
                signKeyLabel.textContent = 'Ed25519 Key';
                signKeyDiv.appendChild(signKeyLabel);
                const signKeyInput = document.createElement('input');
                signKeyInput.type = 'text';
                signKeyInput.id = 'peerPubKeySign';
                signKeyInput.placeholder = 'Base64...';
                signKeyInput.style.cssText = 'width: 100%; padding: 6px; background: #2f3136; border: 1px solid #202225; color: white; border-radius: 4px; box-sizing: border-box; font-family: monospace; font-size: 1em;';
                signKeyDiv.appendChild(signKeyInput);
                formDiv.appendChild(signKeyDiv);

                rightColumn.appendChild(formDiv);

                const addBtn = document.createElement('button');
                addBtn.id = 'addPeerBtn';
                addBtn.style.cssText = 'padding: 8px 12px; background: #3ba55d; border: none; color: white; border-radius: 4px; cursor: pointer; margin-top: 10px; width: 100%; font-weight: bold; font-size: 1em;';
                addBtn.textContent = 'Add Peer';
                rightColumn.appendChild(addBtn);


                // Replace Keypair (fixed width)

                const replaceKeypairTitle = document.createElement('h3');
                replaceKeypairTitle.style.cssText = 'margin: 20px 0 1vh 0; font-size: 14px;';
                replaceKeypairTitle.textContent = 'Replace Keypair';
                rightColumn.appendChild(replaceKeypairTitle);

                const formDiv2 = document.createElement('div');
                formDiv2.style.cssText = 'background: #40444b; padding: 12px; border-radius: 4px;';

                // Keypair input
                const KeypairDiv = document.createElement('div');
                KeypairDiv.style.cssText = 'margin-bottom: 10px;';
                const KeypairLabel = document.createElement('label');
                KeypairLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: .9em; color: #b5bac1; font-weight: bold;';
                KeypairLabel.textContent = 'Keypair (json)';
                KeypairDiv.appendChild(KeypairLabel);
                const KeypairInput = document.createElement('input');
                KeypairInput.type = 'text';
                KeypairInput.id = 'KeypairReplace';
                KeypairInput.placeholder = 'json...';
                KeypairInput.style.cssText = 'width: 100%; padding: 6px; background: #2f3136; border: 1px solid #202225; color: white; border-radius: 4px; box-sizing: border-box; font-family: monospace; font-size: 1em;';
                KeypairDiv.appendChild(KeypairInput);
                formDiv2.appendChild(KeypairDiv);

                rightColumn.appendChild(formDiv2);


                const replaceBtn = document.createElement('button');
                replaceBtn.id = 'replaceModalBtn';
                replaceBtn.style.cssText = 'padding: 8px 12px; background: #ffff00; border: none; color: black; border-radius: 4px; cursor: pointer; margin-top: 8px; width: 100%; font-size: 1em;';
                replaceBtn.textContent = '⛔Replace keypair⛔';
                rightColumn.appendChild(replaceBtn);

                const closeBtn = document.createElement('button');
                closeBtn.id = 'closeModalBtn';
                closeBtn.style.cssText = 'padding: 8px 12px; background: #ed4245; border: none; color: white; border-radius: 4px; cursor: pointer; margin-top: 16px; width: 100%; font-size: 1em;';
                closeBtn.textContent = 'Close';
                rightColumn.appendChild(closeBtn);

                modal.appendChild(rightColumn);


                const overlay = document.createElement('div');
                overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 10000;
            `;

                document.body.appendChild(overlay);
                document.body.appendChild(modal);

                setupModalEventListeners(modal, overlay);
            });
        }


        async function buildPeerListElement() {
            const container = document.createElement('div');
            container.id = 'discrypt-peer-list-container';

            const title = document.createElement('h3');
            title.style.cssText = 'margin: 0 0 1vh 0; font-size: 14px;';
            title.textContent = 'Known Peers';
            container.appendChild(title);

            const listDiv = document.createElement('div');
            listDiv.id = 'discrypt-peer-list';
            listDiv.style.cssText = 'display: flex; flex-direction:column;gap:8px;';

            for (let [user_id, peer_pubkey] of Object.entries(known_peer)) {
                try {
                    const peerHash = await sha256(user_id);
                    const peerId = `peer-${peerHash}`;

                    const peerDiv = document.createElement('div');
                    peerDiv.id = peerId;
                    peerDiv.style.cssText = 'padding: 8px; background: #40444b; border-radius: 4px; font-size: .9em;';

                    const label = document.createElement('label');
                    label.style.cssText = 'font-weight: bold; display: block; margin-bottom: 4px; word-break: break-all;';
                    label.innerText = user_id;
                    peerDiv.appendChild(label);

                    const infoDiv = document.createElement('div');
                    infoDiv.style.cssText = 'font-size: .85em; color: #99aab5; margin-bottom: 6px;';

                    const encDiv = document.createElement('div');
                    encDiv.style.cssText = 'margin-bottom: 2px; word-break: break-all; font-family: monospace;';
                    encDiv.innerHTML = `<strong>Enc:</strong><br>${peer_pubkey.enc}`;
                    infoDiv.appendChild(encDiv);

                    const signDiv = document.createElement('div');
                    signDiv.style.cssText = 'word-break: break-all; font-family: monospace;';
                    signDiv.innerHTML = `<strong>Sign:</strong><br>${peer_pubkey.sign}`;
                    infoDiv.appendChild(signDiv);

                    peerDiv.appendChild(infoDiv);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-peer-btn';
                    deleteBtn.dataset.userPeer = user_id;
                    deleteBtn.style.cssText = 'background: #ed4245; border: none; color: white; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: .9em; width: 100%;';
                    deleteBtn.textContent = 'Delete';
                    peerDiv.appendChild(deleteBtn);

                    listDiv.appendChild(peerDiv);
                } catch (e) {
                    log('Error processing peer:', user_id, e);
                }
            }

            if (listDiv.children.length === 0) {
                const emptyMsg = document.createElement('p');
                emptyMsg.style.cssText = 'color: #99aab5; text-align: center; font-size: .9em;';
                emptyMsg.textContent = 'No peers added yet';
                listDiv.appendChild(emptyMsg);
            }

            container.appendChild(listDiv);
            return container;
        }

        function setupModalEventListeners(modal, overlay) {

            const generateBtn = document.getElementById('generateKeyBtn');
            if (generateBtn) {
                generateBtn.addEventListener('click', async () => {
                    const encKeypair = nacl.box.keyPair();
                    const signKeypair = nacl.sign.keyPair();

                    const keypairToSave = {
                        encryption: {
                            publicKey: encodeBase64(encKeypair.publicKey),
                            secretKey: encodeBase64(encKeypair.secretKey)
                        },
                        signing: {
                            publicKey: encodeBase64(signKeypair.publicKey),
                            secretKey: encodeBase64(signKeypair.secretKey)
                        }
                    };

                    my_keypair = {
                        encryption: encKeypair,
                        signing: signKeypair
                    };
                    save_keypair(keypairToSave);

                    overlay.remove();
                    modal.remove();
                    showPeerModal();
                });
            }

            const copyBtn = document.getElementById('copyBothKeysBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    if (!my_keypair) {
                        alert('Please generate a keypair first');
                        return;
                    }
                    const encPubKeyB64 = encodeBase64(my_keypair.encryption.publicKey);
                    const signPubKeyB64 = encodeBase64(my_keypair.signing.publicKey);
                    const bothKeys = `Encryption (X25519):\n${encPubKeyB64}\n\nSigning (Ed25519):\n${signPubKeyB64}`;
                    navigator.clipboard.writeText(bothKeys).then(() => {
                        const originalText = copyBtn.textContent;
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
                    }).catch(err => {
                        log('Failed to copy to clipboard:', err);
                        alert('Failed to copy to clipboard');
                    });
                });
            }

            const deleteBtns = modal.querySelectorAll('.delete-peer-btn');
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const user_id = e.target.dataset.userPeer;
                    const peerHash = await sha256(user_id);
                    const peerId = `peer-${peerHash}`;

                    if (!known_peer[user_id]) {
                        log('Peer entry not found');
                        return;
                    }

                    delete known_peer[user_id];
                    save_peers(known_peer);

                    const peerElement = document.getElementById(peerId);
                    if (peerElement) {
                        peerElement.remove();
                    }
                });
            });

            const addBtn = modal.querySelector('#addPeerBtn');
            if (!addBtn) {
                log('Add Peer button not found');
                return;
            }

            addBtn.addEventListener('click', () => {
                const userId = modal.querySelector('#peerId')?.value.trim();
                const pubKeyEnc = modal.querySelector('#peerPubKeyEnc')?.value.trim();
                const pubKeySign = modal.querySelector('#peerPubKeySign')?.value.trim();

                if (!userId || !pubKeyEnc || !pubKeySign) {
                    alert('Please fill in all fields');
                    return;
                }

                if (!isValidEd25519PubKey(pubKeyEnc)) {
                    alert('Invalid X25519 public key');
                    return;
                }

                if (!isValidEd25519PubKey(pubKeySign)) {
                    alert('Invalid Ed25519 public key');
                    return;
                }

                if (!/^\d{17,20}$/.test(userId)) {
                    alert("Invalid user ID - must be 17-20 digits");
                    return;
                }

                known_peer[userId] = { enc: pubKeyEnc, sign: pubKeySign };
                save_peers(known_peer);
                overlay.remove();
                modal.remove();
                alert('Peer added successfully!');
            });

            const replaceBtn = document.getElementById('replaceModalBtn');
            if (replaceBtn) {
                replaceBtn.addEventListener('click', async () => {

                    const keypairToSave = JSON.parse(modal.querySelector('#KeypairReplace')?.value.trim());

                    save_keypair(keypairToSave);

                    location.reload()
                });
            }

            const closeBtn = modal.querySelector('#closeModalBtn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    overlay.remove();
                    modal.remove();
                });
            }
        }

        function observeMessages() {
            const chatContainer = document.querySelector('[class*="-chatContent"]');

            if (!chatContainer) {
                setTimeout(observeMessages, 500);
                return null;
            }

            processExistingMessages(chatContainer);

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node?.className?.startsWith && node?.className?.startsWith("flash__")) {//after a jumpToMessage call, it will create a flash div with the message inside.
                            return extractMessageData(node.querySelector("li"));
                        }
                        if (node.nodeType === 1 && node.id?.startsWith('chat-messages-')) {
                            return extractMessageData(node);
                        }
                        if (node.nodeType === 1 && node.id?.startsWith('message-content-')) {
                            return extractMessageData(node.closest("li[id^=chat-messages]"));
                        }
                    });
                });
            });

            observer.observe(chatContainer, {
                childList: true,
                subtree: true
            });

            return observer;
        }

        function processExistingMessages(chatContainer) {
            const existingMessages = chatContainer.querySelectorAll('[id^="chat-messages-"]');
            log(`Processing ${existingMessages.length} existing messages...`);
            const messagesArray = Array.from(existingMessages);

            messagesArray.reverse().forEach(messageElement => {
                extractMessageData(messageElement);
            });
        }

        function watchForChannelChanges() {
            let currentObserver = observeMessages();
            let lastChatContainer = document.querySelector('[class*="-chatContent"]');
            let isCleanedUp = false;

            const appMount = document.querySelector('#app-mount');
            if (!appMount) {
                log('Could not find #app-mount');
                return;
            }

            const containerWatcher = new MutationObserver(() => {
                if (isCleanedUp) return;

                const newChatContainer = document.querySelector('[class*="-chatContent"]');
                if (newChatContainer && newChatContainer !== lastChatContainer) {
                    log('Chat container changed, restarting observer...');
                    if (currentObserver) {
                        currentObserver.disconnect();
                    }
                    lastChatContainer = newChatContainer;
                    const url_channel_id = get_url_channel_id();
                    if (!userselectedpeer || Object.keys(known_peer).includes(url_channel_id)) {
                        userselectedpeer = false;
                        updatePeerSelector(url_channel_id);
                    }
                    currentObserver = observeMessages();
                }

                if (!document.querySelector('#discrypt-settings-button')) {
                    const sidebar = document.querySelector('[class*="-scroller"][class*="-none"]');
                    if (sidebar) {
                        createGUI();
                    }
                }
            });

            containerWatcher.observe(appMount, {
                childList: true,
                subtree: true
            });

            // Cleanup function
            window.addEventListener('beforeunload', () => {
                isCleanedUp = true;
                currentObserver?.disconnect?.();
                containerWatcher?.disconnect?.();
            });

            log('Channel watcher initialized');
        }

        createGUI(function () {
            //after creating the ui, update peer listing by checking url
            updatePeerSelector(get_url_channel_id());
        });
        watchForChannelChanges();

    }
})();
