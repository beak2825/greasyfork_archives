// ==UserScript==
// @name UltiMafia Translator
// @namespace http://tampermonkey.net/
// @version 2026-01-22
// @description Translation.
// @author You
// @match https://ultimafia.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=ultimafia.com
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563530/UltiMafia%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/563530/UltiMafia%20Translator.meta.js
// ==/UserScript==

(function () {
    "use strict";

    class Config {
        constructor() {
            this.colors = {
                ecdh_in: "#69f0ae",
                ecdh_out: "#40c4ff",
                aes_in: "#ea80fc",
                aes_out: "#ff4081",
                system: "#bdbdbd",
                error: "#ff5252",
                panel_bg: "rgba(20, 20, 25, 0.95)",
                border: "#2e7d32"
            };

            this.ui = {
                font: "\"Consolas\", \"Monaco\", \"Courier New\", monospace",
                font_size: "12px"
            };

            this.prefixes = {
                ecdh_start: "「",
                ecdh_end: "」",
                aes_start: "『",
                aes_end: "』",
                key_start: "【系统公告】",
                key_end: ""
            };
        }
    }

    class DataConverter {
        static string_to_base64(str) {
            return window.btoa(unescape(encodeURIComponent(str)));
        }

        static base64_to_string(str) {
            return decodeURIComponent(escape(window.atob(str)));
        }

        static buffer_to_base64(buf) {
            let binary = "";
            const bytes = new Uint8Array(buf);
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        static base64_to_buffer(b64) {
            const binary = window.atob(b64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes.buffer;
        }

        static concat_buffers(buf1, buf2) {
            const b1 = new Uint8Array(buf1);
            const b2 = new Uint8Array(buf2);
            const res = new Uint8Array(b1.length + b2.length);
            res.set(b1, 0);
            res.set(b2, b1.length);
            return res.buffer;
        }
    }

    class StealthTranslator {
        constructor() {
            this.OFFSET = 0x4E00; // CJK Unified Ideographs
        }

        to_foreign_text(buffer) {
            const len = buffer.byteLength;
            const rawBytes = new Uint8Array(buffer);
            const bytes = new Uint8Array(rawBytes.length + 2);
            bytes[0] = (len >> 8) & 0xFF;
            bytes[1] = len & 0xFF;
            bytes.set(rawBytes, 2);

            let res = "";
            let bitBuffer = 0;
            let bitCount = 0;

            for (let i = 0; i < bytes.length; i++) {
                bitBuffer = (bitBuffer << 8) | bytes[i];
                bitCount += 8;

                while (bitCount >= 14) {
                    const val = (bitBuffer >> (bitCount - 14)) & 0x3FFF;
                    res += String.fromCharCode(this.OFFSET + val);
                    bitCount -= 14;
                }
            }

            if (bitCount > 0) {
                const val = (bitBuffer << (14 - bitCount)) & 0x3FFF;
                res += String.fromCharCode(this.OFFSET + val);
            }
            return res;
        }

        from_foreign_text(str) {
            let bitBuffer = 0;
            let bitCount = 0;
            const result = [];

            for (let i = 0; i < str.length; i++) {
                const val = str.charCodeAt(i) - this.OFFSET;
                bitBuffer = (bitBuffer << 14) | val;
                bitCount += 14;

                while (bitCount >= 8) {
                    const byte = (bitBuffer >> (bitCount - 8)) & 0xFF;
                    result.push(byte);
                    bitCount -= 8;
                }
            }

            const fullBuf = new Uint8Array(result);
            if (fullBuf.length < 2) return null;
            const len = (fullBuf[0] << 8) | fullBuf[1];
            return fullBuf.slice(2, 2 + len).buffer;
        }
    }

    class GroupCipher {
        constructor(translator) {
            this.translator = translator;
            this.password = localStorage.getItem("aes_group_password") || "";
        }

        set_password(pw) {
            this.password = pw;
            localStorage.setItem("aes_group_password", pw);
        }

        encrypt_payload(plaintext) {
            if (!this.password) throw new Error("No Group Password set");
            // CryptoJS output is Base64 default. Convert to Buffer.
            const raw_cipher_obj = CryptoJS.AES.encrypt(plaintext, this.password);
            const raw_cipher_b64 = raw_cipher_obj.toString();
            const buf = DataConverter.base64_to_buffer(raw_cipher_b64);
            return this.translator.to_foreign_text(buf);
        }

        decrypt_payload(cjk_cipher) {
            if (!this.password) return null;
            try {
                const buf = this.translator.from_foreign_text(cjk_cipher);
                if (!buf) return null;
                const b64_cipher = DataConverter.buffer_to_base64(buf);
                const bytes = CryptoJS.AES.decrypt(b64_cipher, this.password);
                const original_text = bytes.toString(CryptoJS.enc.Utf8);
                return original_text || null;
            } catch (e) {
                return null;
            }
        }
    }

    class PrivateCipher {
        constructor(translator) {
            this.translator = translator;
            this.key_pair = null;
            this.shared_keys = new Map();
            this.local_cache = new Map();
            this.initialization_promise = this.initialize();
        }

        async initialize() {
            const saved_priv = localStorage.getItem("ecdh_priv_jwk_v5");
            const saved_pub = localStorage.getItem("ecdh_pub_jwk_v5");

            if (saved_priv && saved_pub) {
                try {
                    const private_key = await window.crypto.subtle.importKey(
                        "jwk",
                        JSON.parse(saved_priv),
                        { name: "ECDH", namedCurve: "P-256" },
                        false,
                        ["deriveKey", "deriveBits"]
                    );
                    const public_key = await window.crypto.subtle.importKey(
                        "jwk",
                        JSON.parse(saved_pub),
                        { name: "ECDH", namedCurve: "P-256" },
                        true,
                        []
                    );
                    this.key_pair = { privateKey: private_key, publicKey: public_key };
                } catch (e) {
                    await this.generate_key_pair();
                }
            } else {
                await this.generate_key_pair();
            }
        }

        async generate_key_pair() {
            this.key_pair = await window.crypto.subtle.generateKey(
                { name: "ECDH", namedCurve: "P-256" },
                true,
                ["deriveKey", "deriveBits"]
            );
            const pub_jwk = await window.crypto.subtle.exportKey("jwk", this.key_pair.publicKey);
            const priv_jwk = await window.crypto.subtle.exportKey("jwk", this.key_pair.privateKey);
            localStorage.setItem("ecdh_pub_jwk_v5", JSON.stringify(pub_jwk));
            localStorage.setItem("ecdh_priv_jwk_v5", JSON.stringify(priv_jwk));
        }

        async get_public_key_string() {
            await this.initialization_promise;
            const raw = await window.crypto.subtle.exportKey("raw", this.key_pair.publicKey);
            return this.translator.to_foreign_text(raw);
        }

        async register_remote_key(player_id, obfuscated_key) {
            await this.initialization_promise;
            try {
                const raw_key = this.translator.from_foreign_text(obfuscated_key);
                if (!raw_key) return false;

                const my_key_raw = await window.crypto.subtle.exportKey("raw", this.key_pair.publicKey);
                // Simple comparison of buffers
                if (this.buffers_equal(raw_key, my_key_raw)) return false;

                const remote_public_key = await window.crypto.subtle.importKey(
                    "raw",
                    raw_key,
                    { name: "ECDH", namedCurve: "P-256" },
                    false,
                    []
                );

                const shared_key = await window.crypto.subtle.deriveKey(
                    { name: "ECDH", public: remote_public_key },
                    this.key_pair.privateKey,
                    { name: "AES-GCM", length: 256 },
                    false,
                    ["encrypt", "decrypt"]
                );

                this.shared_keys.set(player_id, shared_key);
                return true;
            } catch (e) {
                return false;
            }
        }

        buffers_equal(buf1, buf2) {
            if (buf1.byteLength !== buf2.byteLength) return false;
            const a = new Uint8Array(buf1);
            const b = new Uint8Array(buf2);
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        }

        async encrypt_for_player(player_id, text) {
            await this.initialization_promise;
            const shared_key = this.shared_keys.get(player_id);
            if (!shared_key) throw new Error(`No shared key for ${player_id}`);

            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encoder = new TextEncoder();
            const ciphertext = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                shared_key,
                encoder.encode(text)
            );

            const payload_buf = DataConverter.concat_buffers(iv.buffer, ciphertext);
            const cipher_cjk = this.translator.to_foreign_text(payload_buf);

            this.local_cache.set(cipher_cjk, { text: text, target_id: player_id });
            return cipher_cjk;
        }

        async decrypt_from_player(sender_id, obfuscated_payload, game_state) {
            await this.initialization_promise;

            if (this.local_cache.has(obfuscated_payload)) {
                const cached = this.local_cache.get(obfuscated_payload);
                return {
                    type: "OUT",
                    text: cached.text,
                    meta_name: game_state.get_player_name(cached.target_id)
                };
            }

            const payload_buf = this.translator.from_foreign_text(obfuscated_payload);
            if (!payload_buf) return null;
            const shared_key = this.shared_keys.get(sender_id);

            if (shared_key) {
                try {
                    const plain = await this.perform_decryption(shared_key, payload_buf);
                    return { type: "IN", text: plain, meta_name: sender_id };
                } catch (e) { }
            }

            // Fallback: try all keys
            // Need to split payload_buf first to get IV
            if (payload_buf.byteLength > 12) {
                const iv = new Uint8Array(payload_buf.slice(0, 12));
                const ciphertext = payload_buf.slice(12);

                for (const [id, key] of this.shared_keys) {
                    try {
                        const decrypted = await window.crypto.subtle.decrypt(
                            { name: "AES-GCM", iv: iv },
                            key,
                            ciphertext
                        );
                        const decoder = new TextDecoder();
                        return {
                            type: "FALLBACK",
                            text: decoder.decode(decrypted),
                            meta_name: game_state.get_player_name(id)
                        };
                    } catch (e) { }
                }
            }
            return null;
        }

        async perform_decryption(key, payload_buf) {
            // payload_buf = IV(12) + Cipher(...)
            if (payload_buf.byteLength <= 12) throw new Error("Invalid payload");
            const iv = new Uint8Array(payload_buf.slice(0, 12));
            const ciphertext = payload_buf.slice(12);

            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );
            return new TextDecoder().decode(decrypted);
        }
    }

    class PlayerRegistry {
        constructor() {
            this.players = {};
        }

        update_registry(players_obj) {
            if (typeof players_obj === "object") {
                for (const id in players_obj) {
                    const p = players_obj[id];
                    if (p.name) this.players[id] = p.name;
                    else if (p.username) this.players[id] = p.username;
                }
            }
        }

        get_player_name(id) {
            return this.players[id] || id;
        }
    }

    class OverlayInterface {
        constructor(config, game_state, aes_engine) {
            this.config = config;
            this.game_state = game_state;
            this.aes_engine = aes_engine;
            this.mode = "ECDH";
            this.target_player_id = "PUBLIC";
            this.is_broadcast_pending = false;
            this.is_minimized = false;
            this.container = null;
            this.mode_select = null;
            this.content_area = null;
            this.action_btn = null;
            this.target_select = null;

            if (document.body) this.build_ui();
            else window.addEventListener("DOMContentLoaded", () => this.build_ui());
        }

        build_ui() {
            this.container = document.createElement("div");
            this.container.style.cssText = `
            position: fixed; bottom: 15px; right: 15px; z-index: 10000;
            background: ${this.config.colors.panel_bg}; backdrop-filter: blur(5px); color: #e0e0e0;
            padding: 12px; border: 1px solid #333; border-left: 3px solid ${this.config.colors.border};
            border-radius: 8px; font-family: ${this.config.ui.font}; width: 230px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5); transition: border-color 0.3s ease;
        `;

            const title = document.createElement("div");
            title.innerHTML = "👲 Stealth Suite <span id='ss-min-btn' style='float:right; cursor:pointer;'>[ - ]</span>";
            title.style.cssText = "color: #fff; font-size: 13px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; text-align: center; user-select: none;";
            this.container.appendChild(title);

            title.querySelector("#ss-min-btn").onclick = () => this.toggle_minimize();

            this.mode_select = document.createElement("select");
            this.mode_select.style.cssText = `width: 100%; background: #102027; color: white; border: 1px solid #37474f; padding: 4px; border-radius: 4px; margin-bottom: 8px; font-family: ${this.config.ui.font};`;
            this.mode_select.innerHTML = "<option value=\"ECDH\">MODE: 🔒 Direct (Keys)</option><option value=\"AES\">MODE: 🏘️ Group (Password)</option>";
            this.mode_select.onchange = (e) => this.handle_mode_change(e);
            this.container.appendChild(this.mode_select);

            this.content_area = document.createElement("div");
            this.container.appendChild(this.content_area);
            document.body.appendChild(this.container);
            this.refresh_content();
        }

        handle_mode_change(e) {
            this.mode = e.target.value;
            this.target_player_id = (this.mode === "AES") ? "GROUP" : "PUBLIC";
            this.refresh_content();
        }

        refresh_content() {
            this.content_area.innerHTML = "";
            this.container.style.borderLeftColor = this.mode === "ECDH" ? this.config.colors.ecdh_in : this.config.colors.aes_in;

            if (this.mode === "ECDH") {
                this.action_btn = document.createElement("button");
                this.action_btn.innerText = "Broadcast Key";
                this.action_btn.style.cssText = "width: 100%; margin-bottom: 10px; cursor: pointer; background: #263238; color: white; border: 1px solid #37474f; padding: 6px; font-size: 11px; text-transform: uppercase;";
                this.action_btn.onclick = () => {
                    this.is_broadcast_pending = !this.is_broadcast_pending;
                    this.update_button_state();
                };
                this.content_area.appendChild(this.action_btn);

                const lbl = document.createElement("div");
                lbl.innerText = "ENCRYPTION TARGET:";
                lbl.style.cssText = "font-size: 10px; color: #90a4ae; margin-bottom: 4px; font-weight: bold;";
                this.content_area.appendChild(lbl);

                this.target_select = document.createElement("select");
                this.target_select.style.cssText = "width: 100%; background: #102027; color: white; border: 1px solid #37474f; padding: 4px; border-radius: 4px; font-size: 12px;";
                this.target_select.innerHTML = "<option value=\"PUBLIC\">Public (Plaintext)</option>";
                this.target_select.value = this.target_player_id;
                this.target_select.onchange = (e) => {
                    this.target_player_id = e.target.value;
                };

                if (window.last_shared_keys) this.update_player_list(window.last_shared_keys);
                this.content_area.appendChild(this.target_select);
                this.update_button_state();

            } else {
                const lbl = document.createElement("div");
                lbl.innerText = "GROUP PASSWORD:";
                lbl.style.cssText = "font-size: 10px; color: #ea80fc; margin-bottom: 4px; font-weight: bold;";
                this.content_area.appendChild(lbl);

                const pw_input = document.createElement("input");
                pw_input.type = "password";
                pw_input.value = this.aes_engine.password;
                pw_input.placeholder = "Enter Secret...";
                pw_input.style.cssText = `width: 95%; background: #102027; color: #ea80fc; border: 1px solid #37474f; padding: 4px; border-radius: 4px; font-size: 12px; font-family: ${this.config.ui.font}; margin-bottom: 10px;`;
                pw_input.oninput = (e) => {
                    this.aes_engine.set_password(e.target.value);
                };
                this.content_area.appendChild(pw_input);

                const lbl_target = document.createElement("div");
                lbl_target.innerText = "MESSAGE PRIVACY:";
                lbl_target.style.cssText = "font-size: 10px; color: #90a4ae; margin-bottom: 4px; font-weight: bold;";
                this.content_area.appendChild(lbl_target);

                this.target_select = document.createElement("select");
                this.target_select.style.cssText = "width: 100%; background: #102027; color: white; border: 1px solid #37474f; padding: 4px; border-radius: 4px; font-size: 12px;";
                this.target_select.innerHTML = "<option value=\"GROUP\">🔒 Encrypted (Stealth)</option><option value=\"PUBLIC\">🔓 Public (Plaintext)</option>";
                this.target_select.value = this.target_player_id === "PUBLIC" ? "PUBLIC" : "GROUP";
                this.target_select.onchange = (e) => {
                    this.target_player_id = e.target.value;
                };
                this.content_area.appendChild(this.target_select);
            }
        }

        update_button_state() {
            if (!this.action_btn) return;
            if (this.is_broadcast_pending) {
                this.action_btn.innerText = ">> Type to Send Key <<";
                this.action_btn.style.background = "#fbc02d";
                this.action_btn.style.color = "#000";
            } else {
                this.action_btn.innerText = "Broadcast Key";
                this.action_btn.style.background = "#263238";
                this.action_btn.style.color = "white";
            }
        }

        update_player_list(shared_keys_map) {
            window.last_shared_keys = shared_keys_map;
            if (!this.target_select || this.mode !== "ECDH") return;
            const current = this.target_select.value;
            this.target_select.innerHTML = "<option value=\"PUBLIC\">Public (Plaintext)</option>";
            const sorted_ids = Array.from(shared_keys_map.keys()).sort((a, b) => this.game_state.get_player_name(a).localeCompare(this.game_state.get_player_name(b)));
            sorted_ids.forEach(id => {
                const opt = document.createElement("option");
                opt.value = id;
                opt.innerText = `🔒 ${this.game_state.get_player_name(id)}`;
                this.target_select.appendChild(opt);
            });
            this.target_select.value = current;
        }

        toggle_minimize() {
            this.is_minimized = !this.is_minimized;
            const btn = this.container.querySelector("#ss-min-btn");
            if (this.is_minimized) {
                this.content_area.style.display = "none";
                this.mode_select.style.display = "none";
                this.container.style.width = "180px";
                if (btn) btn.innerText = "[ + ]";
            } else {
                this.content_area.style.display = "block";
                this.mode_select.style.display = "block";
                this.container.style.width = "230px";
                if (btn) btn.innerText = "[ - ]";
            }
        }
    }

    class NetworkInterceptor {
        constructor(config, private_cipher, group_cipher, ui, game_state) {
            this.config = config;
            this.private_cipher = private_cipher;
            this.group_cipher = group_cipher;
            this.ui = ui;
            this.game_state = game_state;
            this.native_websocket = window.WebSocket;
            this.install_hook();
        }

        async process_incoming_packet(json) {
            const content = json.content || "";
            const px = this.config.prefixes;

            if (content.startsWith(px.key_start) && (px.key_end === "" || content.endsWith(px.key_end))) {
                const sender = json.senderId || "Unknown";
                const inner_key = px.key_end === ""
                    ? content.slice(px.key_start.length)
                    : content.slice(px.key_start.length, -px.key_end.length);
                const my_key = await this.private_cipher.get_public_key_string();

                if (inner_key === my_key) {
                    json.content = "🔑 Broadcasted Public Key";
                    json.textColor = this.config.colors.system;
                } else {
                    const success = await this.private_cipher.register_remote_key(sender, inner_key);
                    if (success) {
                        this.ui.update_player_list(this.private_cipher.shared_keys);
                        json.content = `🔑 Key received from [${this.game_state.get_player_name(sender)}]`;
                        json.textColor = this.config.colors.system;
                    }
                }
            } else if (content.startsWith(px.ecdh_start) && content.endsWith(px.ecdh_end)) {
                const payload = content.slice(px.ecdh_start.length, -px.ecdh_end.length);
                const result = await this.private_cipher.decrypt_from_player(json.senderId, payload, this.game_state);
                if (result) {
                    if (result.type === "OUT") {
                        json.content = `🔒 ➞ [${result.meta_name}]: ${result.text}`;
                        json.textColor = this.config.colors.ecdh_out;
                    } else if (result.type === "IN") {
                        json.content = `🔒 ${result.text}`;
                        json.textColor = this.config.colors.ecdh_in;
                    } else {
                        json.content = `🔒 [Signed: ${result.meta_name}] ${result.text}`;
                        json.textColor = this.config.colors.ecdh_in;
                    }
                } else {
                    json.content = "🔒 ENCRYPTED MESSAGE";
                    json.textColor = this.config.colors.system;
                    json.opacity = 0.5;
                }
            } else if (content.startsWith(px.aes_start) && content.endsWith(px.aes_end)) {
                const payload = content.slice(px.aes_start.length, -px.aes_end.length);
                const plain = this.group_cipher.decrypt_payload(payload);
                if (plain) {
                    json.content = `[🔒Group] ${plain}`;
                    json.textColor = (json.senderId === "You" || json.username === "You") ? this.config.colors.aes_out : this.config.colors.aes_in;
                }
            }
            return json;
        }

        async process_history(history_obj) {
            for (const key in history_obj) {
                if (!history_obj[key]) continue;
                if (history_obj[key].messages && Array.isArray(history_obj[key].messages)) {
                    for (let i = 0; i < history_obj[key].messages.length; i++) {
                        history_obj[key].messages[i] = await this.process_incoming_packet(history_obj[key].messages[i]);
                    }
                } else if (typeof history_obj[key] === "object") {
                    await this.process_history(history_obj[key]);
                }
            }
            return history_obj;
        }

        install_hook() {
            const self = this;
            window.WebSocket = function (url, protocols) {
                const ws = new self.native_websocket(url, protocols);
                const original_send = ws.send;

                ws.send = async function (data) {
                    if (typeof data === "string" && data.startsWith("speak:object:")) {
                        try {
                            const payload_str = data.slice("speak:object:".length);
                            let obj = JSON.parse(payload_str);
                            const px = self.config.prefixes;

                            if (self.ui.mode === "ECDH") {
                                if (self.ui.is_broadcast_pending) {
                                    const key_str = await self.private_cipher.get_public_key_string();
                                    obj.content = px.key_start + key_str + px.key_end;
                                    self.ui.is_broadcast_pending = false;
                                    self.ui.update_button_state();
                                } else if (self.ui.target_player_id !== "PUBLIC") {
                                    const cipher_cjk = await self.private_cipher.encrypt_for_player(self.ui.target_player_id, obj.content);
                                    obj.content = px.ecdh_start + cipher_cjk + px.ecdh_end;
                                }
                            } else {
                                if (self.ui.target_player_id === "GROUP" && self.group_cipher.password) {
                                    const cipher_cjk = self.group_cipher.encrypt_payload(obj.content);
                                    obj.content = px.aes_start + cipher_cjk + px.aes_end;
                                }
                            }
                            return original_send.call(this, "speak:object:" + JSON.stringify(obj));
                        } catch (err) { }
                    }
                    return original_send.call(this, data);
                };

                const original_add_event_listener = ws.addEventListener;
                ws.addEventListener = function (type, listener, options) {
                    if (type === "message") {
                        const wrapped_listener = async function (event) {
                            let new_data = event.data;
                            try {
                                if (typeof event.data === "string") {
                                    if (event.data.startsWith("message:object:")) {
                                        let json = JSON.parse(event.data.slice("message:object:".length));
                                        json = await self.process_incoming_packet(json);
                                        new_data = "message:object:" + JSON.stringify(json);
                                    } else if (event.data.startsWith("players:object:")) {
                                        const players = JSON.parse(event.data.slice("players:object:".length));
                                        self.game_state.update_registry(players);
                                        self.ui.update_player_list(self.private_cipher.shared_keys);
                                    } else if (event.data.startsWith("history:object:")) {
                                        let history = JSON.parse(event.data.slice("history:object:".length));
                                        history = await self.process_history(history);
                                        new_data = "history:object:" + JSON.stringify(history);
                                    }
                                }
                            } catch (e) { }

                            const new_event = new MessageEvent("message", {
                                data: new_data,
                                origin: event.origin,
                                lastEventId: event.lastEventId,
                                source: event.source,
                                ports: event.ports
                            });
                            listener.call(this, new_event);
                        };
                        return original_add_event_listener.call(this, type, wrapped_listener, options);
                    }
                    return original_add_event_listener.call(this, type, listener, options);
                };
                return ws;
            };
            window.WebSocket.prototype = this.native_websocket.prototype;
            window.WebSocket.CONNECTING = this.native_websocket.CONNECTING;
            window.WebSocket.OPEN = this.native_websocket.OPEN;
            window.WebSocket.CLOSING = this.native_websocket.CLOSING;
            window.WebSocket.CLOSED = this.native_websocket.CLOSED;
        }
    }

    const config = new Config();
    const translator = new StealthTranslator();
    const private_cipher = new PrivateCipher(translator);
    const group_cipher = new GroupCipher(translator);
    const game_state = new PlayerRegistry();
    const ui = new OverlayInterface(config, game_state, group_cipher);
    new NetworkInterceptor(config, private_cipher, group_cipher, ui, game_state);
})();
