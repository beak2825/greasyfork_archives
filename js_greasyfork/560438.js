// ==UserScript==
// @name        ChatGPT Veteran Verification Link Generator
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Generate SheerID link
// @author       Marx
// @match        https://chatgpt.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560438/ChatGPT%20Veteran%20Verification%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/560438/ChatGPT%20Veteran%20Verification%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #vt-panel { position: fixed; bottom: 20px; right: 20px; width: 340px; background: #202123; color: #ececf1; border: 1px solid #4d4d4f; border-radius: 12px; padding: 16px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 8px 24px rgba(0,0,0,0.5); font-size: 14px; }
        #vt-panel h3 { margin: 0 0 12px 0; font-size: 16px; color: #10a37f; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        #vt-token { width: 100%; height: 80px; background: #343541; color: #fff; border: 1px solid #565869; border-radius: 6px; padding: 8px; box-sizing: border-box; resize: none; font-family: monospace; font-size: 12px; outline: none; transition: border-color 0.2s; }
        #vt-token:focus { border-color: #10a37f; }
        #vt-btn { width: 100%; padding: 10px; margin-top: 12px; background: #10a37f; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s, opacity 0.2s; }
        #vt-btn:hover { background: #1a7f64; }
        #vt-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        #vt-result { margin-top: 16px; padding-top: 12px; border-top: 1px solid #4d4d4f; display: none; }
        .vt-label { font-size: 11px; color: #8e8ea0; margin-bottom: 4px; font-weight: 600; text-transform: uppercase; }
        .vt-link-box { background: #000; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 11px; color: #acacbe; margin-bottom: 8px; cursor: pointer; border: 1px solid #333; transition: border-color 0.2s; }
        .vt-link-box:hover { border-color: #10a37f; color: #fff; }
        .vt-checkout-box { border-color: #a462ff; color: #e0ccff; }
        .vt-checkout-box:hover { border-color: #b985ff; color: #fff; }
        #vt-msg { font-size: 12px; text-align: center; min-height: 18px; margin-top: 8px; }
        .vt-success { color: #10a37f; }
        .vt-error { color: #ef4146; }
    `);

    const panel = document.createElement('div');
    panel.id = 'vt-panel';
    panel.innerHTML = `
        <h3>Vet Gen</h3>
        <textarea id="vt-token" placeholder="Paste Token OR Session JSON here"></textarea>
        <button id="vt-btn">Check & Generate</button>
        <div id="vt-result">
            <div id="vt-label-text" class="vt-label">Result Link</div>
            <div id="vt-link-display" class="vt-link-box" title="Click to Copy"></div>
            <div id="vt-msg"></div>
        </div>
    `;
    document.body.appendChild(panel);

    const el = {
        token: document.getElementById('vt-token'),
        btn: document.getElementById('vt-btn'),
        result: document.getElementById('vt-result'),
        display: document.getElementById('vt-link-display'),
        label: document.getElementById('vt-label-text'),
        msg: document.getElementById('vt-msg')
    };

    function _b64urlToUtf8(s) {
        s = String(s).replace(/-/g, "+").replace(/_/g, "/");
        const pad = s.length % 4;
        if (pad) s += "=".repeat(4 - pad);
        const bin = atob(s);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    }

    function _isJwtLike(t) {
        if (!t) return false;
        const parts = String(t).split(".");
        if (parts.length !== 3) return false;
        return parts.every(p => /^[A-Za-z0-9_-]+$/.test(p) && p.length > 0);
    }

    function parseJwt(jwt) {
        if (!_isJwtLike(jwt)) throw new Error("NOT_JWT");
        const [h, p] = jwt.split(".");
        let header, payload;
        try { header = JSON.parse(_b64urlToUtf8(h)); } catch { throw new Error("BAD_JWT_HEADER"); }
        try { payload = JSON.parse(_b64urlToUtf8(p)); } catch { throw new Error("BAD_JWT_PAYLOAD"); }
        return { header, payload };
    }

    function _deepFindToken(obj) {
        const seen = new Set();
        const stack = [obj];
        const keys = new Set(["accesstoken", "access_token", "token", "jwt", "id_token", "idtoken", "bearer"]);
        while (stack.length) {
            const cur = stack.pop();
            if (!cur || typeof cur !== "object") continue;
            if (seen.has(cur)) continue;
            seen.add(cur);
            for (const k of Object.keys(cur)) {
                const v = cur[k];
                if (typeof v === "string") {
                    const lk = k.toLowerCase();
                    if (keys.has(lk) || lk.includes("token")) {
                        const s = v.trim().replace(/^Bearer\s+/i, "");
                        if (_isJwtLike(s)) return s;
                    }
                    const m = v.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
                    if (m && _isJwtLike(m[0])) return m[0];
                } else if (v && typeof v === "object") {
                    stack.push(v);
                }
            }
        }
        return null;
    }

    function extractAndValidateJwt(inputText, opts = {}) {
        const now = Date.now();
        const leewaySec = Number.isFinite(opts.leewaySec) ? opts.leewaySec : 30;

        let raw = String(inputText ?? "").trim();
        if (!raw) throw new Error("EMPTY_INPUT");

        let token = null;

        const direct = raw.replace(/^Bearer\s+/i, "");
        if (_isJwtLike(direct)) token = direct;

        if (!token) {
            try {
                const obj = JSON.parse(raw);
                token = _deepFindToken(obj);
            } catch {}
        }

        if (!token) {
            const m = raw.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
            if (m && _isJwtLike(m[0])) token = m[0];
        }

        if (!token) throw new Error("TOKEN_NOT_FOUND");

        const { header, payload } = parseJwt(token);
        const alg = String(header?.alg ?? "").toLowerCase();
        if (!alg || alg === "none") throw new Error("UNSAFE_ALG");

        const exp = payload?.exp;
        if (typeof exp === "number") {
            const expMs = exp * 1000;
            if (now > expMs + leewaySec * 1000) throw new Error("TOKEN_EXPIRED");
        }

        return {
            token,
            bearer: `Bearer ${token}`,
            header,
            payload
        };
    }

    const FIXED_PROGRAM_ID = "690415d58971e73ca187d8c9";

    const apiRequest = (url, token, body) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Referrer": "https://chatgpt.com/veterans-claim"
                },
                data: body ? JSON.stringify(body) : null,
                anonymous: true,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    };

    const getIdsFromStatus = (text) => {
        try {
            const data = JSON.parse(text);
            if (data.metadata && data.metadata.verification_id) {
                return {
                    vid: data.metadata.verification_id,
                    pid: data.metadata.program_id || FIXED_PROGRAM_ID
                };
            }
            if (data.verification_id) {
                return {
                    vid: data.verification_id,
                    pid: FIXED_PROGRAM_ID
                };
            }
        } catch (e) {}
        return null;
    };

    const parseCheckoutUrl = (text) => {
        try {
            const data = JSON.parse(text);
            return data.url || null;
        } catch (e) {
            return null;
        }
    };

    el.btn.onclick = async () => {
        const rawInput = el.token.value.trim();
        let authHeader = "";

        setLoading(true);

        try {
            const result = extractAndValidateJwt(rawInput);
            authHeader = result.bearer;
        } catch (e) {
            setLoading(false);
            const errMap = {
                "EMPTY_INPUT": "Input required",
                "TOKEN_NOT_FOUND": "No valid token found",
                "TOKEN_EXPIRED": "Token Expired",
                "NOT_JWT": "Invalid JWT format"
            };
            return showMsg(errMap[e.message] || e.message, 'error');
        }

        try {
            let res = await apiRequest("https://chatgpt.com/backend-api/veterans/refresh_enrollment_status", authHeader, {});
            let info = getIdsFromStatus(res.responseText);
            let checkoutUrl = null;

            if (info && info.vid) {
                try {
                    const checkoutBody = {
                        "plan_name": "chatgptplusplan",
                        "billing_details": { "country": "JP", "currency": "USD" },
                        "veterans_verification_id": info.vid
                    };
                    const checkRes = await apiRequest("https://chatgpt.com/backend-api/payments/checkout", authHeader, checkoutBody);
                    checkoutUrl = parseCheckoutUrl(checkRes.responseText);
                } catch (e) {}
            }

            if (checkoutUrl) {
                showResult(checkoutUrl, "PAYMENT LINK (Stripe)", true);
            } else {
                await apiRequest("https://chatgpt.com/backend-api/veterans/reset_verification", authHeader, {});
                res = await apiRequest("https://chatgpt.com/backend-api/veterans/refresh_enrollment_status", authHeader, {});
                info = getIdsFromStatus(res.responseText);

                if (!info) {
                    res = await apiRequest("https://chatgpt.com/backend-api/veterans/create_verification", authHeader, { program_id: FIXED_PROGRAM_ID });
                    info = getIdsFromStatus(res.responseText);

                    if (!info) {
                        res = await apiRequest("https://chatgpt.com/backend-api/veterans/refresh_enrollment_status", authHeader, {});
                        info = getIdsFromStatus(res.responseText);
                    }
                }

                if (info && info.vid) {
                    const url = `https://services.sheerid.com/verify/${info.pid}/?verificationId=${info.vid}`;
                    showResult(url, "SHEERID VERIFICATION LINK", false);
                } else {
                    showMsg('Failed to generate verification ID', 'error');
                }
            }

        } catch (err) {
            console.error(err);
            showMsg('Network or API Error', 'error');
        } finally {
            setLoading(false);
        }
    };

    el.display.onclick = () => {
        if(el.display.textContent) {
            GM_setClipboard(el.display.textContent);
            showMsg('Link copied to clipboard!', 'success');
        }
    };

    function setLoading(isLoading) {
        el.btn.disabled = isLoading;
        el.btn.textContent = isLoading ? 'Processing...' : 'Check & Generate';
        if (isLoading) {
            el.result.style.display = 'none';
            el.msg.textContent = '';
        }
    }

    function showResult(url, label, isCheckout) {
        el.result.style.display = 'block';
        el.label.textContent = label;
        el.display.textContent = url;

        if (isCheckout) {
            el.display.classList.add('vt-checkout-box');
            el.msg.textContent = 'Click to Copy Payment Link';
            el.msg.className = 'vt-success';
        } else {
            el.display.classList.remove('vt-checkout-box');
            el.msg.textContent = 'Click to Copy Verification Link';
            el.msg.className = '';
        }
    }

    function showMsg(text, type) {
        el.result.style.display = 'block';
        el.msg.className = `vt-${type}`;
        el.msg.textContent = text;
        if (type === 'error') {
             el.display.textContent = '';
             el.label.textContent = 'Error';
        }
    }
})();