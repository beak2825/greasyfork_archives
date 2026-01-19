// ==UserScript==
// @name        TORN War Helper
// @namespace   finally.torn.warhelper
// @version     20251222.082022+5bd3654
// @description Various helpers for warring
// @author      finally [2060206], seintz [2460991], Shade [3129695], Kindly [1956699]
// @license     GNU GPLv3
// @run-at      document-start
// @match       https://www.torn.com/factions.php*
// @match       https://www.torn.com/loader2.php?sid=attack*
// @match       https://www.torn.com/loader.php?sid=attack*
// @match       https://www.torn.com/war.php?step=rankreport*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     api.torn.com
// @connect     tornstats.com
// @connect     yata.yt
// @connect     lol-manager.com
// @connect     ffscouter.com
// @downloadURL https://update.greasyfork.org/scripts/563238/TORN%20War%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563238/TORN%20War%20Helper.meta.js
// ==/UserScript==

! function() {
    const t = "undefined" != typeof unsafeWindow ? unsafeWindow : window;
    t.__WARHELPER_RUNNING || (t.__WARHELPER_RUNNING = !0, (() => {
        var t = class {
            static request(t) {
                return new Promise((e, s) => {
                    void 0 !== window.flutter ? PDA_httpGet(t).then(t => e(t.responseText)).catch(s) : GM_xmlhttpRequest({
                        method: "GET",
                        url: t,
                        onload: t => e(t.responseText),
                        onabort: s,
                        onerror: s,
                        ontimeout: s
                    })
                })
            }
        };
        var e = window.unsafeWindow ?? window;

        function s(t) {
            try {
                return JSON.parse(t)
            } catch {
                return
            }
        }

        function n(t) {
            if (!document.head) return void document.addEventListener("DOMContentLoaded", () => n(t));
            if (GM_addStyle) return void GM_addStyle(t);
            const e = document.createElement("style");
            e.type = "text/css", e.innerText = t, document.head.appendChild(e)
        }

        function r() {
            const t = [128512, 128591],
                e = Math.floor(Math.random() * (t[1] - t[0] + 1)) + t[0];
            return String.fromCodePoint(e)
        }

        function A(t, e) {
            if (!Array.isArray(e)) return A(t, e.split("."));
            let s = t;
            for (const t of e) {
                if (null == s || !(t in s)) return !1;
                s = s[t]
            }
            return !0
        }

        function a(t) {
            let e = Math.round(Date.now() / 1e3) - t;
            return e < 0 ? "now" : e > 31536e3 ? `${Math.floor(e/31536e3)} years ago` : e > 2592e3 ? `${Math.floor(e/2592e3)} months ago` : e > 86400 ? `${Math.floor(e/86400)} days ago` : e > 3600 ? `${Math.floor(e/3600)} hours ago` : e > 60 ? `${Math.floor(e/60)} minutes ago` : `${Math.floor(e)} seconds ago`
        }

        function o(t) {
            const e = t - Math.floor(Date.now() / 1e3);
            if (e <= 0) return "Okay";
            const s = Math.floor(e / 3600),
                n = Math.floor(e % 3600 / 60),
                r = Math.floor(e % 60);
            let A = "";
            return s > 0 && (A += `${s.toString().padStart(2,"0")}:`), A += `${n.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`, A
        }

        function i(t, e, s = ["K", "M", "B", "T", "Q"]) {
            for (let n = 0; n < s.length; n++) {
                if ((t /= 1e3) >= 1e3 && n < s.length - 1) continue;
                return `${t.toFixed(e||(t>=100?0:t>=10?1:2))}${s[n]}`
            }
            return "?"
        }

        function l(t) {
            return -1 !== window.location.href.indexOf(t)
        }

        function c() {
            return l("war.php")
        }

        function d({
            section: e,
            endpoint: n,
            id: r,
            parameters: A
        }) {
            return new Promise((a, o) => {
                const i = p.get("torn_key");
                if (!i) return o("No API key");
                let l = `https://api.torn.com/v2/${e}`;
                r && (Array.isArray(r) || (r = [r]), l += `/${r.join(",")}`), n && (l += `/${n}`), (A = A || {}).key = i, l += `?${Object.keys(A).map(t=>`${t}=${(Array.isArray(A[t])?A[t]:[A[t]]).join(",")}`).join("&")}`, t.request(l).then(async t => {
                    const e = s(t);
                    return e ? e.error ? o(new Error(`API Error: ${e.error.error}`)) : void a(e) : o(new Error("Failed to parse response"))
                }).catch(t => {
                    o(t)
                })
            })
        }
        var h = class {
                static {
                    this.cacheKey = "__warhelper"
                }
                static {
                    this.cache = {}
                }
                static {
                    this.onBustHandlers = []
                }
                static {
                    const t = localStorage.getItem(this.cacheKey);
                    t && (Object.assign(this.cache, s(t)), Object.keys(this.cache).forEach(t => {
                        const e = this.cache[t];
                        e.expiry > 0 && e.expiry < Date.now() && delete this.cache[t]
                    }), this.write())
                }
                static onBust(t) {
                    this.onBustHandlers.push(t)
                }
                static write() {
                    localStorage.setItem(this.cacheKey, JSON.stringify(this.cache))
                }
                static get(t) {
                    const e = this.cache[t];
                    if (e) return e.expiry > 0 && e.expiry < Date.now() ? (delete this.cache[t], void this.write()) : e.value
                }
                static bust(t) {
                    const e = Array.isArray(t) ? t : [t];
                    Object.keys(this.cache).forEach(t => {
                        e.some(e => t.startsWith(e)) && delete this.cache[t]
                    }), this.write(), this.onBustHandlers.forEach(t => {
                        t()
                    })
                }
                static set(t, e, s = 0) {
                    const n = Array.isArray(t) ? t : [t],
                        r = Array.isArray(e) ? e : [e];
                    if (n.length !== r.length) throw new Error("Keys and values arrays must be of the same length");
                    n.forEach((t, e) => {
                        this.cache[t] = {
                            value: r[e],
                            expiry: s > 0 ? Date.now() + 1e3 * s : 0
                        }
                    }), this.write()
                }
                static seconds(t) {
                    return t
                }
                static minutes(t) {
                    return this.seconds(60) * t
                }
                static hours(t) {
                    return this.minutes(60) * t
                }
                static days(t) {
                    return this.hours(24) * t
                }
            },
            p = class {
                static {
                    this.configEntries = [{
                        type: "text",
                        id: "torn_key",
                        label: "Torn Key"
                    }, {
                        type: "text",
                        id: "tornstats_key",
                        label: "TornStats Key",
                        placeholder: "TS_..."
                    }, {
                        type: "text",
                        id: "bsp_key",
                        label: "BSP Key"
                    }, {
                        type: "text",
                        id: "ffs_key",
                        label: "FFScouter Key"
                    }, {
                        type: "text",
                        id: "yata_key",
                        label: "YATA Key"
                    }]
                }
                static {
                    this.onChangeHandlers = {}
                }
                static {
                    document.body ? this.init() : document.addEventListener("DOMContentLoaded", () => this.init())
                }
                static init() {
                    e.__warhelper_config_initialized || (e.__warhelper_config_initialized = !0, this.createConfigOverlay(), this.injectButton())
                }
                static async injectButton() {
                    const t = await (e = "#top-page-links-list", new Promise(t => {
                        const s = setInterval(() => {
                            const n = document.querySelector(e);
                            n && (clearInterval(s), t(n))
                        }, 500)
                    }));
                    var e;
                    this.configButton = document.createElement("a"), this.configButton.className = "t-clear line-h24 right __warhelper_button", this.configButton.href = "#";
                    const s = document.createElement("span");
                    s.className = "icon-wrap svg-icon-wrap", s.innerHTML = r();
                    const n = document.createElement("span");
                    n.innerHTML = "War Helper", this.configButton.appendChild(s), this.configButton.appendChild(n), t.appendChild(this.configButton), this.configButton.addEventListener("click", t => {
                        t.preventDefault(), this.toggleConfig(t.target)
                    }), this.configButton.addEventListener("mouseenter", () => {
                        s.innerHTML = r()
                    })
                }
                static createConfigOverlay() {
                    this.configElement = document.createElement("div"), this.configElement.className = "__warhelper_config", this.configElement.style.display = "none", this.configElement.innerHTML = `\n${this.configEntries.map(t=>`\n      <label>${t.label}</label>\n      <input \n        data-id="${t.id}" \n        type="${t.type}" \n        placeholder="${t.placeholder||""}" \n        value="${h.get(`config_${t.id}`)||""}" \n      />`).join("\n")}\n\n<button class="torn-btn save">SAVE</button>\n<button class="torn-btn bust">CLEAR CACHE</button>`;
                    document.body.insertAdjacentElement("beforeend", this.configElement), n("\n@media screen and (max-width: 784px) {\n  .__warhelper_button:nth-child(2) {\n    display: none;\n  }\n}\n\n.__warhelper_config {\n  position: fixed;\n  background: #444;\n  padding: 10px;\n  border: 1px solid black;\n  border-radius: 5px;\n  z-index: 99;\n}\n\n.__warhelper_config *:not(button) {\n  margin: 0 0 10px 0;\n}\n\n.__warhelper_config label {\n  display: block;\n  font-weight: bold;\n}\n\n.__warhelper_config button {\n  width: 100%;\n}\n\n.__warhelper_config input {\n  display: block;\n  vertical-align: middle;\n  text-align: left;\n  color: #000;\n  color: var(--input-money-color);\n  background: #fff;\n  background: var(--input-money-background-color);\n  border: 1px solid #CCC;\n  border-color: var(--input-money-border-color);\n  border-radius: 5px;\n  padding: 9px 5px;\n  line-height: 14px;\n  margin-left: 10px;\n}\n    ");
                    const t = this.configElement.querySelector("button.save");
                    if (null === t) return;
                    t.addEventListener("click", () => {
                        if (null === this.configElement) return;
                        const t = [],
                            e = [];
                        this.configElement.querySelectorAll("input[data-id]").forEach(s => {
                            if (!(s instanceof HTMLInputElement)) return;
                            const n = s.dataset.id;
                            if (!n) return;
                            const r = `config_${n}`,
                                A = s.value;
                            t.push(r), e.push(A), this.onChangeHandlers[n] && this.onChangeHandlers[n].forEach(t => {
                                t(n, A)
                            })
                        }), h.set(t, e), this.toggleConfig(null)
                    });
                    const e = this.configElement.querySelector("button.bust");
                    null !== e && (e.addEventListener("click", () => {
                        h.bust(["bsp_", "tornstats_", "ffs_", "yata_"])
                    }), document.body.addEventListener("click", t => {
                        this.configElement?.contains(t.target) || this.configButton?.contains(t.target) || this.toggleConfig(null)
                    }))
                }
                static toggleConfig(t) {
                    if (null === this.configElement) return;
                    if (null === t || !(t instanceof HTMLElement)) return void(this.configElement.style.display = "none");
                    "none" != this.configElement.style.display ? this.configElement.style.display = "none" : this.configElement.style.display = "";
                    const e = t.getBoundingClientRect(),
                        s = this.configElement.getBoundingClientRect(),
                        n = document.body.getBoundingClientRect(),
                        r = Math.min(e.left + e.width / 2 - s.width / 2, n.width - s.width);
                    this.configElement.style.left = `${r}px`, this.configElement.style.top = `${e.top+e.height}px`
                }
                static set(t, e) {
                    return h.set(`config_${t}`, e)
                }
                static get(t) {
                    return h.get(`config_${t}`)
                }
                static onChange(t, e) {
                    void 0 === this.onChangeHandlers[t] && (this.onChangeHandlers[t] = []), this.onChangeHandlers[t].push(e)
                }
            },
            u = class t {
                static {
                    this.handlers = []
                }
                static {
                    this.injectFetch(), this.injectWebsocket()
                }
                static injectFetch() {
                    const s = e.fetch;
                    e.fetch = async function(...e) {
                        const n = e[0]?.url || e[0],
                            r = await s(...e),
                            A = await r.clone().text().then(e => t.handleMessage(0, e, n));
                        return new Response(A, {
                            status: r.status,
                            statusText: r.statusText,
                            headers: r.headers
                        })
                    }
                }
                static injectWebsocket() {
                    const s = e.WebSocket;
                    e.WebSocket = function(...e) {
                        const n = new s(...e),
                            r = n.addEventListener,
                            A = [];
                        return n.addEventListener("message", e => {
                            const s = new MessageEvent("message", {
                                data: t.handleMessage(1, e.data)
                            });
                            A.forEach(t => {
                                t.apply(n, [s])
                            })
                        }), n.addEventListener = (...t) => "message" !== t[0] || "function" != typeof t[1] ? r.apply(this, t) : void A.push(t[1]), Object.defineProperty(n, "onmessage", {
                            set(t) {
                                "function" == typeof t && A.push(t)
                            }
                        }), n
                    }, e.WebSocket.prototype = s.prototype
                }
                static onMessage(t, e, s) {
                    this.handlers.push({
                        type: t,
                        callback: e,
                        filter: 0 == t ? s ? new RegExp(s) : s : s ? s.split(".") : s
                    })
                }
                static handleMessage(t, e, n = "") {
                    const r = s(e);
                    if (!r) return e;
                    const A = this.emitMessage(t, r, n);
                    return A ? JSON.stringify(A) : e
                }
                static emitMessage(t, e, s) {
                    return this.handlers.filter(e => e.type == t || 1 == e.type).forEach(n => {
                        if (!n.filter || 0 == t && n.filter instanceof RegExp && n.filter.exec(s) || 1 == t && (r = n.filter, Array.isArray(r) && r.every(t => "string" == typeof t)) && A(e, n.filter)) {
                            const t = n.callback(e);
                            t && (e = t)
                        }
                        var r
                    }), e
                }
            },
            g = class {
                static {
                    this.onAddHandlers = {}
                }
                static {
                    this.observer = new MutationObserver(t => {
                        t.forEach(t => {
                            t && t.addedNodes.forEach(t => {
                                t instanceof HTMLElement && Object.keys(this.onAddHandlers).forEach(e => {
                                    const s = t.matches(e) ? [t] : Array.from(t.querySelectorAll(e));
                                    s.length && s.forEach(t => {
                                        void 0 !== this.onAddHandlers[e] && this.onAddHandlers[e].forEach(e => {
                                            e(t)
                                        })
                                    })
                                })
                            })
                        })
                    }), this.observe()
                }
                static observe() {
                    document.body ? this.observer.observe(document.body, {
                        childList: !0,
                        subtree: !0
                    }) : document.addEventListener("DOMContentLoaded", () => this.observe())
                }
                static onAdd(t, e) {
                    void 0 === this.onAddHandlers[t] && (this.onAddHandlers[t] = []), this.onAddHandlers[t].push(e);
                    const s = Array.from(document.querySelectorAll(t));
                    s.length && s.forEach(t => {
                        e(t)
                    })
                }
            },
            m = (class {
                static {
                    this.enemyUserId = 0
                }
                static {
                    this.hospTimestamp = 0
                }
                static {
                    this.titleNode = null
                }
                static {
                    this.init()
                }
                static init() {
                    (l("sid=attack") || l("sid=getInAttack")) && (this.enemyUserId = +(new URL(window?.location?.href || "http://.").searchParams.get("user2ID") || 0), this.loadHospTime(), u.onMessage(0, this.handleMessage, "sid=attackData"), g.onAdd("[class^='colored__'] [class^='title__']", t => this.titleNode = t), requestAnimationFrame(() => this.updateTimers()))
                }
                static handleMessage(t) {
                    return t?.DB && t?.startErrorTitle && -1 !== t?.startErrorTitle.indexOf("hospital") ? (delete t?.startErrorTitle, delete t?.DB?.error, t.DB.startButtonTitle = "Start fight", t) : t
                }
                static loadHospTime() {
                    0 != this.enemyUserId && d({
                        section: "user",
                        id: this.enemyUserId
                    }).then(t => {
                        "Hospital" === t?.status?.state && (this.hospTimestamp = t?.status?.until)
                    }).catch(t => {
                        console.error(t)
                    })
                }
                static updateTimers() {
                    null === this.titleNode || "" != this.titleNode.innerHTML && !this.titleNode.innerHTML.startsWith("Hospital: ") || (this.titleNode.innerHTML = `Hospital: ${o(this.hospTimestamp)}`), requestAnimationFrame(() => this.updateTimers())
                }
            }, class t extends EventTarget {
                static {
                    this.currentUser = 0
                }
                static {
                    this.userStatus = {}
                }
                static {
                    u.onMessage(0, t => this.handleMessage(t), "step=(getwarusers|getProcessBarRefreshData)"), u.onMessage(1, t => this.handleMessage(t))
                }
                static {
                    this._instance = new t
                }
                static dispatch(t) {
                    this._instance.dispatchEvent(t)
                }
                static on(t, e) {
                    this._instance.addEventListener(t, e)
                }
                static updateUserStatus(t, e = null, s = null) {
                    if (0 == t) return;
                    let n = !1;
                    void 0 === this.userStatus[t] && (n = !0, this.userStatus[t] = {
                        area: 1,
                        status: "Okay",
                        updateAt: 0,
                        score: 0
                    }), e && ((e.area && this.userStatus[t].area != e.area || e.text && this.userStatus[t].status != e.text || e.updateAt && this.userStatus[t].updateAt != e.updateAt) && (n = !0), this.userStatus[t].area = e.area || this.userStatus[t].area, this.userStatus[t].status = e.text || this.userStatus[t].status, this.userStatus[t].updateAt = e.updateAt || this.userStatus[t].updateAt), null !== s && (n = !0, s < 0 ? this.userStatus[t].score = Math.abs(s) : this.userStatus[t].score += s), n && this.dispatch(new CustomEvent("UserStatusChanged"))
                }
                static handleMessage(t) {
                    const e = t?.userId || t?.user?.userID;
                    e && (this.currentUser = e), t?.currentarea && this.updateUserStatus(this.currentUser, {
                        area: t?.currentarea
                    });
                    const s = t?.push?.pub?.data?.message?.namespaces?.users?.actions?.updateStatus;
                    s && this.updateUserStatus(s.userId, s.status);
                    const n = t?.push?.pub?.data?.message?.namespaces?.warBoxes?.actions?.attackFinish;
                    n && this.updateUserStatus(n.attacker.userId, null, n.respect);
                    const r = t?.warDesc?.members;
                    r && r.forEach(t => {
                        this.updateUserStatus(t.userID, t.status, -t.score)
                    })
                }
                static getUserStatus(t) {
                    return this.userStatus[t]
                }
                static getCurrentUserStatus() {
                    return this.userStatus[this.currentUser]
                }
            }),
            f = class {
                static {
                    this.key = p.get("tornstats_key"), p.onChange("tornstats_key", (t, e) => {
                        this.key = e
                    })
                }
                static async getSpies(t, e) {
                    return await this.loadFactionSpies(e), t.map(t => h.get(`tornstats_user_${t}`))
                }
                static {
                    this.pendingRequests = new Map
                }
                static loadFactionSpies(e) {
                    const n = `tornstats_faction_${e}`;
                    if (h.get(n)) return Promise.resolve();
                    const r = this.pendingRequests.get(n);
                    if (r) return r;
                    if (!this.key) return Promise.resolve();
                    const A = new Promise((r, A) => {
                        t.request(`https://www.tornstats.com/api/v2/${this.key}/spy/faction/${e}`).then(async t => {
                            const e = s(t),
                                a = e?.faction?.members;
                            if (!a) return void A(new Error("No members data found"));
                            const o = [n],
                                i = [1];
                            Object.keys(a).forEach(t => {
                                const e = a[t]?.spy;
                                e && (Date.now() / 1e3 - e.timestamp >= h.days(365) || (o.push(`tornstats_user_${t}`), i.push({
                                    type: 1,
                                    userId: parseInt(t),
                                    strength: e.strength ? parseInt(e.strength) : void 0,
                                    speed: e.speed ? parseInt(e.speed) : void 0,
                                    defense: e.defense ? parseInt(e.defense) : void 0,
                                    dexterity: e.dexterity ? parseInt(e.dexterity) : void 0,
                                    total: e.total ? parseInt(e.total) : void 0,
                                    score: Math.sqrt(parseInt(e.strength)) + Math.sqrt(parseInt(e.defense)) + Math.sqrt(parseInt(e.speed)) + Math.sqrt(parseInt(e.dexterity)),
                                    timestamp: e.timestamp
                                })))
                            }), h.set(o, i, h.days(7)), r()
                        }).catch(t => {
                            A(t)
                        }).finally(() => {
                            this.pendingRequests.delete(n)
                        })
                    });
                    return this.pendingRequests.set(n, A), A
                }
            },
            w = class {
                static {
                    this.lastRequest = 0
                }
                static {
                    this.scriptName = "finally_Script"
                }
                static {
                    localStorage.setItem("tdup.battleStatsPredictor.IsBSPEnabledOnPage_Faction", "false"), this.key = p.get("bsp_key") || "", this.expires = p.get("bsp_expires") || null, p.onChange("bsp_key", (t, e) => {
                        this.key = e, this.expires = null, p.set("bsp_expires", null)
                    })
                }
                static {
                    this.pendingRequests = new Map
                }
                static async getSpy(e) {
                    const n = `bsp_user_${e}`,
                        r = h.get(n);
                    if (r) return r;
                    if (!this.key) return Promise.resolve(void 0);
                    if (this.expires && new Date(this.expires) < new Date) return Promise.resolve(void 0);
                    const A = Math.max(600 - (Date.now() - this.lastRequest), 0);
                    await async function(t) {
                        return new Promise(e => setTimeout(e, t))
                    }(A), this.lastRequest = Date.now();
                    const a = this.pendingRequests.get(n);
                    if (a) return a;
                    const o = new Promise((r, A) => {
                        t.request(`http://www.lol-manager.com/api/battlestats/${this.key}/${e}/${this.scriptName}`).then(async t => {
                            const a = s(t);
                            if (a?.SubscriptionEnd && (p.set("bsp_expires", `${a?.SubscriptionEnd}Z`), new Date(`${a.SubscriptionEnd}Z`) < new Date)) return void r(void 0);
                            if (!a?.TBS) return void A(new Error("No TBS found"));
                            const o = {
                                type: 2,
                                userId: e,
                                score: a.Score,
                                total: a.TBS,
                                timestamp: new Date(`${a.PredictionDate}Z`).getTime() / 1e3
                            };
                            h.set(n, o, h.days(7)), r(o)
                        }).catch(t => {
                            A(t)
                        }).finally(() => {
                            this.pendingRequests.delete(n)
                        })
                    });
                    return this.pendingRequests.set(n, o), o
                }
            },
            y = class {
                static {
                    this.key = p.get("yata_key"), p.onChange("yata_key", (t, e) => {
                        this.key = e
                    })
                }
                static {
                    this.pendingRequests = new Map
                }
                static async getSpy(e, n = !1) {
                    const r = `yata_${n?"estimate":"spy"}_${e}`,
                        A = h.get(r);
                    if (A) return -1 == A ? void 0 : A;
                    if (!this.key) return Promise.resolve(void 0);
                    const a = this.pendingRequests.get(r);
                    if (a) return a;
                    const o = new Promise((A, a) => {
                        t.request(`https://yata.yt/api/v1/${n?"bs":"spy"}/${e}/?key=${this.key}`).then(async t => {
                            const a = s(t),
                                o = a?.[e];
                            if (!o?.total) return h.set(r, -1, h.days(7)), void A(void 0);
                            if (!n && Date.now() / 1e3 - o.update >= h.days(365)) return;
                            const i = n ? {
                                type: 4,
                                userId: e,
                                score: o?.score,
                                total: o?.total,
                                timestamp: o?.timestamp,
                                skewtype: o?.type,
                                skewness: o?.skewness
                            } : {
                                type: 3,
                                userId: e,
                                strength: o?.strength,
                                speed: o?.speed,
                                defense: o?.defense,
                                dexterity: o?.dexterity,
                                total: o?.total,
                                score: Math.sqrt(parseInt(o?.strength)) + Math.sqrt(parseInt(o?.defense)) + Math.sqrt(parseInt(o?.speed)) + Math.sqrt(parseInt(o?.dexterity)),
                                timestamp: o?.update
                            };
                            h.set(r, i, h.days(7)), A(i)
                        }).catch(t => {
                            a(t)
                        }).finally(() => {
                            this.pendingRequests.delete(r)
                        })
                    });
                    return this.pendingRequests.set(r, o), o
                }
            },
            E = class {
                static {
                    this.key = p.get("ffs_key"), p.onChange("ffs_key", (t, e) => {
                        this.key = e
                    })
                }
                static async getSpies(t, e) {
                    return await this.loadFactionSpies(t, e), t.map(t => h.get(`ffs_user_${t}`))
                }
                static {
                    this.pendingRequests = new Map
                }
                static loadFactionSpies(e, n) {
                    const r = `ffs_faction_${n}`,
                        A = h.get(r);
                    if (A) return A;
                    if (!this.key) return Promise.resolve(void 0);
                    const a = this.pendingRequests.get(r);
                    if (a) return a;
                    const o = new Promise((n, A) => {
                        t.request(`https://ffscouter.com/api/v1/get-stats?key=${this.key}&targets=${e.join(",")}`).then(async t => {
                            const e = s(t);
                            if (e.error) return void A(new Error(e.error));
                            if (!Array.isArray(e)) return void A(new Error("No spies found"));
                            const a = [r],
                                o = [1];
                            e.forEach(t => {
                                t?.bs_estimate && (a.push(`ffs_user_${t.player_id}`), o.push({
                                    type: 5,
                                    userId: t.player_id,
                                    total: t.bs_estimate,
                                    fairfight: t.fair_fight,
                                    timestamp: t.last_updated
                                }))
                            }), h.set(a, o, h.days(7)), n()
                        }).catch(t => {
                            A(t)
                        }).finally(() => {
                            this.pendingRequests.delete(r)
                        })
                    });
                    return this.pendingRequests.set(r, o), o
                }
            };
        async function B(t, e) {
            const s = t.reduce((t, e) => (t[e] = {
                type: 0,
                userId: e,
                timestamp: 0
            }, t), {});

            function n() {
                return Object.values(s).every(t => 0 !== t.type)
            }
            const r = [async function(t) {
                const n = await f.getSpies(t, e).catch(console.error);
                n && n.forEach(t => {
                    t && (s[t.userId] = t)
                })
            }, async function(t) {
                for (const e of t) {
                    const t = await y.getSpy(e).catch(console.error);
                    null != t && (s[e] = t)
                }
            }, async function(t) {
                for (const e of t) {
                    const t = await w.getSpy(e).catch(console.error);
                    null != t && (s[e] = t)
                }
            }, async function(t) {
                const n = await E.getSpies(t, e).catch(console.error);
                n && n.forEach(t => {
                    t && (s[t.userId] = t)
                })
            }, async function(t) {
                for (const e of t) {
                    const t = await y.getSpy(e, !0).catch(console.error);
                    null != t && (s[e] = t)
                }
            }];
            for (const t of r)
                if (await t(Object.values(s).filter(t => 0 === t.type).map(t => t.userId)), n()) return s;
            return s
        }
        var b = class {
            static {
                this.pendingRequest = null
            }
            static async getUserStats() {
                if (!p.get("torn_key")) return Promise.resolve(void 0);
                const t = document.querySelector('.settings-menu a[href*="XID="]');
                if (!t) return Promise.resolve(void 0);
                const e = `user_${parseInt(t.href.replace(/[^\d]/g,""))}`,
                    s = h.get(e);
                return s || (null !== this.pendingRequest || (this.pendingRequest = new Promise((t, s) => {
                    d({
                        section: "user",
                        endpoint: "personalstats",
                        parameters: {
                            cat: "battle_stats"
                        }
                    }).then(n => {
                        const r = n?.personalstats?.battle_stats;
                        r ? (r.score = Math.sqrt(r.strength) + Math.sqrt(r.defense) + Math.sqrt(r.speed) + Math.sqrt(r.dexterity), h.set(e, r, 86400), t(r)) : s(new Error("No battle_stats found"))
                    }).catch(t => {
                        s(t)
                    })
                })), this.pendingRequest)
            }
        };
        (class {
            static {
                this.battleStatNodes = []
            }
            static {
                this.timerNodes = []
            }
            static {
                this.init()
            }
            static init() {
                (l("factions.php") || c()) && (g.onAdd(".members-list:not(:has(.__warhelper))", t => this.handleNode(t)), m.on("UserStatusChanged", () => this.sort()), requestAnimationFrame(() => this.updateTimers()), h.onBust(() => this.reloadBattleStats()), n('\n.member div[class^="factionWrap_"],\n.member div[class^="honorWrap_"] img,\n.member div[class^="honorWrap_"] .honor-text-svg {\n  display: none !important;\n}\n.member div[class^="honorWrap_"] .honor-text {\n  position: relative;\n  font-family: inherit;\n  font-size: inherit;\n  font-weight: inherit;\n  color: inherit;\n  stroke: inherit;\n}\n.member div[class^="honorWrap_"] a {\n  text-decoration: none;\n}\n\n.member {\n  overflow: hidden;\n}\n@media screen and (max-width: 784px) {\n  .member {\n    width: 100px !important;\n  }\n}\n\n.members-cont .level:not(.__warhelper) {\n  display: none !important;\n}\n\n.tt-stats-estimate {\n  display: none !important;\n}\n\n.level.__warhelper,\n.lvl.__warhelper {\n  display: block !important;\n  position: relative;\n}\n\n.level.__warhelper,\n.lvl.__warhelper {\n  width: 40px !important;\n  justify-content: right !important;\n}\n\n.faction-info-wrap .level.__warhelper,\n.faction-info-wrap .lvl.__warhelper {\n  width: 50px !important;\n  overflow: hidden;\n}\n\n.faction-info-wrap .__warhelper_total {\n  line-height: 36px;\n}\n\n.__warhelper_tooltip {\n  font-family: monospace;\n}\n\n.__warhelper_tooltip td {\n  color: var(--default-gray-6-color);\n}\n\n.__warhelper_tooltip td:nth-child(2) {\n  padding-left: 5px;\n  text-align: right;\n}\n\n.__warhelper_total.str {\n  color: #CC6666;\n}\n\n.__warhelper_total.def {\n  color: #6699CC;\n}\n\n.__warhelper_total.spd {\n  color: #99CC66;\n}\n\n.__warhelper_total.dex {\n  color: #9966CC;\n}\n\n.__warhelper_bstype {\n  position: absolute;\n  top: 0;\n  left: 0;\n  color: #ddd;\n  text-align: center;\n  font-family: monospace;\n  font-weight: bold;\n  line-height: 14px;\n  padding-top: 1px;\n  padding-left: 1px;\n  padding-right: 10px;\n  padding-bottom: 10px;\n  background-color: #999999;\n  clip-path: polygon(0 0, 100% 0, 100% 0%, 0% 100%);\n}\n\n.__warhelper_bstype.T {\n  background-color: #663399;\n}\n\n.__warhelper_bstype.B {\n  background-color: #336699;\n}\n\n.__warhelper_bstype.Y {\n  background-color: #669966;\n}\n\n.__warhelper_bstype.YE {\n  background-color: #9c9c00;\n}\n\n.__warhelper_bstype.F {\n  background-color: #a65e2e;\n}\n\n.__warhelper_compare {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background: linear-gradient(to right, var(--color) var(--fill), transparent var(--fill));\n}\n\ndiv[class^="sortIcon__"] {\n  display: none !important;\n}\n\n.__warhelper_sort {\n  overflow: visible !important;\n}\n\n.__warhelper_sort.asc div[class^="sortIcon__"],\n.__warhelper_sort.desc div[class^="sortIcon__"] {\n  display: block !important;\n  border: none !important;\n}\n\n.__warhelper_sort.asc div[class^="sortIcon__"]:after {\n  border-top: none !important;\n  border-bottom: 5px solid black !important;\n}\n.__warhelper_sort.desc div[class^="sortIcon__"]:after {\n  top: 0px !important;\n  border-top: 5px solid black !important;\n  border-bottom: none !important;\n}\n\n.__warhelper_favorite {\n  height: 19px;\n  font-size: 18px;\n  line-height: 1;\n  cursor: pointer;\n}\n\n.__warhelper_favorite.active,\n.__warhelper_favorite:hover {\n  color: #daa520;\n}\n\n.__warhelper_bs_loading {\n  width: 100%;\n  height: 100%;\n background-size: contain;\n  background-repeat: no-repeat;\n  background-position: center;\n}\n'))
            }
            static {
                this.sortFields = ["id", "member", "members", "bs", "points", "status"]
            }
            static overwriteSort(t) {
                if (!t.parentNode) return;
                const e = this.getFactionId(t.parentNode),
                    s = h.get(`faction_sorting_${e}`),
                    n = this.sortFields[~~s?.field || 1] || "bs";
                Array.from(t.parentNode.querySelectorAll(this.sortFields.map(t => `.members-cont > div > .${t}, .f-war-list > ul > .${t}`).join(","))).forEach(t => {
                    t.classList.add("__warhelper_sort"), t.addEventListener("click", e => {
                        e.stopImmediatePropagation(), this.sort(t)
                    }), t.classList.contains(n) && (t.classList.add(s?.asc ? "asc" : "desc"), this.sort(t, !0))
                })
            }
            static sort(t = null, e = !1) {
                if (null === t) return void Array.from(document.querySelectorAll(".__warhelper_sort.asc, .__warhelper_sort.desc")).forEach(t => this.sort(t, !0));
                if (null == t.parentNode) return;
                if (null == t.parentNode.parentNode) return;
                if (!e) {
                    const e = t.classList.contains("asc");
                    t.parentNode.querySelectorAll(".asc, .desc").forEach(t => {
                        t.classList.remove("asc"), t.classList.remove("desc")
                    }), e ? t.classList.add("desc") : t.classList.add("asc")
                }
                const s = this.getFactionId(t.parentNode.parentNode),
                    n = this.sortFields.findIndex(e => t.classList.contains(e)),
                    r = 1 == t.classList.contains("asc");
                h.set(`faction_sorting_${s}`, {
                    field: n,
                    asc: r
                });
                const A = t.parentNode.parentNode.querySelector("ul.members-list, ul.table-body");
                if (null == A) return;
                const a = Array.from(A.childNodes);
                a.sort((t, e) => {
                    const s = null !== t.querySelector("[class*='total__']"),
                        A = null !== e.querySelector("[class*='total__']");
                    if (s) return 1;
                    if (A) return -1;
                    const a = null !== t.querySelector(".__warhelper_favorite.active"),
                        o = null !== e.querySelector(".__warhelper_favorite.active");
                    if (a && !o) return -1;
                    if (!a && o) return 1;
                    const i = t.querySelector(".honor-text:not(.honor-text-svg)")?.innerHTML || "",
                        l = e.querySelector(".honor-text:not(.honor-text-svg)")?.innerHTML || "";
                    switch (n) {
                        case 0: {
                            const s = parseFloat(t.querySelector(".id")?.innerHTML.replaceAll("#", "") || ""),
                                n = parseFloat(e.querySelector(".id")?.innerHTML.replaceAll("#", "") || "");
                            return s == n ? i.localeCompare(l) : r ? s - n : n - s
                        }
                        case 1:
                        case 2:
                            return r ? i.localeCompare(l) : l.localeCompare(i);
                        case 3: {
                            const s = parseFloat(t.querySelector(".bs")?.dataset.bs || ""),
                                n = parseFloat(e.querySelector(".bs")?.dataset.bs || "");
                            return s == n ? i.localeCompare(l) : r ? s - n : n - s
                        }
                        case 4: {
                            const s = parseFloat(t.querySelector(".points")?.innerHTML.replaceAll(",", "") || ""),
                                n = parseFloat(e.querySelector(".points")?.innerHTML.replaceAll(",", "") || "");
                            return s == n ? i.localeCompare(l) : r ? s - n : n - s
                        }
                        case 5: {
                            let s = function(t) {
                                const e = t?.area == n?.area;
                                return t ? "Traveling" == t.status ? [y, t.updateAt] : 1 == t.area ? "Hospital" == t.status ? [p, t.updateAt] : "Jail" == t.status ? [h, t.updateAt] : [d, 0] : e ? "Hospital" == t.status ? [w, t.updateAt] : [f, 0] : "Hospital" == t.status ? [g, t.updateAt] : [u, 0] : [0, 0]
                            };
                            if (c()) {
                                const s = parseFloat(t.querySelector(".status")?.innerHTML.replaceAll(",", "") || ""),
                                    n = parseFloat(e.querySelector(".status")?.innerHTML.replaceAll(",", "") || "");
                                return s == n ? i.localeCompare(l) : r ? s - n : n - s
                            }
                            const n = m.getCurrentUserStatus(),
                                A = m.getUserStatus(this.getUserId(t)),
                                a = m.getUserStatus(this.getUserId(e)),
                                o = !!n && 1 !== n.area,
                                {
                                    okay: d,
                                    jailed: h,
                                    hospital: p,
                                    abroad: u,
                                    abroadHospital: g,
                                    abroadCurrent: f,
                                    abroadCurrentHospital: w,
                                    traveling: y
                                } = o ? r ? {
                                    abroad: 1,
                                    abroadCurrent: 1,
                                    abroadHospital: 2,
                                    abroadCurrentHospital: 2,
                                    okay: 3,
                                    jailed: 4,
                                    hospital: 5,
                                    traveling: 6
                                } : {
                                    abroadHospital: 1,
                                    abroadCurrentHospital: 1,
                                    abroad: 2,
                                    abroadCurrent: 2,
                                    okay: 3,
                                    jailed: 4,
                                    hospital: 5,
                                    traveling: 6
                                } : r ? {
                                    okay: 1,
                                    jailed: 2,
                                    hospital: 3,
                                    abroad: 4,
                                    abroadCurrent: 4,
                                    abroadHospital: 5,
                                    abroadCurrentHospital: 5,
                                    traveling: 6
                                } : {
                                    hospital: 1,
                                    jailed: 2,
                                    okay: 3,
                                    abroadHospital: 4,
                                    abroadCurrentHospital: 4,
                                    abroad: 5,
                                    abroadCurrent: 5,
                                    traveling: 6
                                },
                                [E, B] = s(A),
                                [b, S] = s(a);
                            return E != b ? E - b : B != S ? r ? B - S : S - B : i.localeCompare(l)
                        }
                    }
                    return 0
                }), a.forEach(t => A.appendChild(t))
            }
            static handleNode(t) {
                if (!t?.classList || t.classList.contains("__warhelper")) return;
                t.classList.add("__warhelper");
                !t.matches(".f-war-list") ? this.injectRankedWarHtml(t) : this.injectMemberListHtml(t), this.overwriteSort(t), new MutationObserver(e => {
                    this.injectCells(Array.from(t.querySelectorAll(".level:not(.__warhelper):not(:has(+ .__warhelper))")))
                }).observe(t, {
                    subtree: !0,
                    childList: !0
                })
            }
            static getId(t, e, s) {
                const n = t.querySelector(e) || t.parentNode?.querySelector(e);
                return n && n instanceof HTMLAnchorElement ? parseInt(n.href.replace(s, "$1")) : 0
            }
            static getUserId(t) {
                return this.getId(t, 'a[href*="XID"]', /.*?XID=(\d+)/i)
            }
            static getFactionId(t) {
                return this.getId(t, 'a[href*="factions.php"]', /.*?ID=(\d+)/i)
            }
            static injectHeader(t) {
                t.firstChild && (t.firstChild.textContent = "Lv");
                const e = t.cloneNode(!0);
                e.classList.add("__warhelper"), e.classList.add("bs"), e.firstChild && (e.firstChild.textContent = "BS"), t.parentNode && t.parentNode.insertBefore(e, t.nextSibling)
            }
            static injectCells(t) {
                t?.length && (t.forEach(t => {
                    const e = t.cloneNode(!0);
                    if (e.classList.add("__warhelper"), e.classList.add("bs"), -1 !== e.innerHTML.indexOf("--") ? e.innerHTML = "--" : (e.innerHTML = '<div class="__warhelper_bs_loading"></div>', e.dataset.bs = "0"), !t.parentNode) return;
                    t.parentNode.insertBefore(e, t.nextSibling);
                    const s = this.getUserId(t);
                    if (!s) return;
                    const n = this.getFactionId(t);
                    this.battleStatNodes.push({
                        userId: s,
                        factionId: n,
                        node: e
                    });
                    let r = !1;
                    e.addEventListener("touchstart", () => r = !0), e.addEventListener("click", () => {
                        r || window.open(`loader.php?sid=attack&user2ID=${s}`, "_newtab")
                    }), e.addEventListener("dblclick", () => {
                        window.open(`loader.php?sid=attack&user2ID=${s}`, "_newtab")
                    });
                    const A = t.parentNode.querySelector('div[class^="userStatusWrap__"]');
                    if (!A?.parentNode) return;
                    const a = h.get(`faction_favorite_${s}`) || !1,
                        o = document.createElement("div");
                    o.className = "__warhelper_favorite", a && o.classList.add("active"), o.innerHTML = "&#9733;", A.parentNode.insertBefore(o, A.nextSibling), o.addEventListener("click", () => {
                        const t = o.classList.toggle("active");
                        h.set(`faction_favorite_${s}`, t), this.sort()
                    })
                }), this.updateBattleStats())
            }
            static injectMemberListHtml(t) {
                const e = t.querySelector(".table-header .lvl");
                if (!e) return;
                this.injectHeader(e);
                const s = Array.from(t.querySelectorAll(".table-body .lvl"));
                s && this.injectCells(s)
            }
            static injectRankedWarHtml(t) {
                if (!t.parentNode) return;
                const e = t.parentNode.querySelector(".level");
                if (!e) return;
                this.injectHeader(e);
                const s = Array.from(t.querySelectorAll(".level"));
                if (!s) return;
                this.injectCells(s);
                const n = Array.from(t.querySelectorAll(".status"));
                n && n.forEach(t => {
                    let e = this.getUserId(t);
                    this.timerNodes.push({
                        userId: e,
                        node: t
                    })
                })
            }
            static reloadBattleStats() {
                this.battleStatNodes.forEach(t => {
                    t.node.innerHTML = '<div class="__warhelper_bs_loading"></div>', t.node.title = "", t.node.dataset.bs = "0"
                }), this.updateBattleStats()
            }
            static async updateBattleStats() {
                const t = await b.getUserStats().catch(console.error),
                    e = [],
                    s = this.battleStatNodes.reduce((t, e) => {
                        const s = e.factionId;
                        return null == t[s] && (t[s] = []), t[s].push(e), t
                    }, {});
                for (const n in s) {
                    if (!s[n]) continue;
                    const r = await B(s[n].map(t => t.userId), Number(n)).catch(console.error);
                    if (r)
                        for (const A of s[n]) {
                            let s = function(t) {
                                    return t >= 3 ? "#5CB85C" : t >= 2.5 ? "#F1C232" : t >= 2 ? "#F28C28" : "#D44A4A"
                                },
                                n = function(t) {
                                    if (t <= 1) return 5;
                                    if (t >= 4) return 100;
                                    if (t <= 3) {
                                        return 5 + 45 * ((t - 1) / 2)
                                    }
                                    return 50 + 50 * ((t - 3) / 1)
                                };
                            const {
                                userId: o,
                                node: l
                            } = A, c = r[o];
                            if (!c || 0 == c.type) {
                                e.push({
                                    node: l,
                                    html: "N/A",
                                    tooltip: "",
                                    bs: "0"
                                });
                                continue
                            }
                            let d = 0,
                                h = c.fairfight || 0;
                            c.score && t?.score && (h = Math.round(100 * (1 + 8 / 3 * (c.score / t?.score))) / 100), d = Math.min(3, h);
                            let p = s(h),
                                u = n(h),
                                g = "";
                            const m = .35,
                                f = [c.strength || 0, c.defense || 0, c.speed || 0, c.dexterity || 0],
                                w = f.indexOf(Math.max(...f.filter(t => t)));
                            void 0 !== f[w] && f[w] >= (c.total || 0) * m && (g = ["str", "def", "spd", "dex"][w]);
                            let y = "?",
                                E = "",
                                B = "?";
                            switch (c.type) {
                                case 1:
                                    y = "T", E = "T", B = "TornStats";
                                    break;
                                case 2:
                                    y = "B", E = "B", B = "BSP";
                                    break;
                                case 3:
                                    y = "Y", E = "Y", B = "YATA";
                                    break;
                                case 4:
                                    y = "Y", E = "YE", B = "YATA Estimate";
                                    break;
                                case 5:
                                    y = "F", E = "F", B = "FFScouter"
                            }
                            const b = `\n          <div class="__warhelper_total ${g}">${c.total?i(c.total):"N/A"}</div>\n          <div class="__warhelper_bstype ${E}">${y}</div>\n          ${d>0?`<div class="__warhelper_compare" style="--fill: ${u}%; --color: ${p};"></div>`:""}\n        `,
                                S = `\n          <table class="__warhelper_tooltip">\n            ${d>0?`<tr><td>FF</td><td>${d.toFixed(2)}</td></tr>`:""}\n            ${"T"===y?`\n              <tr><td>Strength</td><td>${c.strength?i(c.strength,2):"N/A"}</td></tr>\n              <tr><td>Defense</td><td>${c.defense?i(c.defense,2):"N/A"}</td></tr>\n              <tr><td>Speed</td><td>${c.speed?i(c.speed,2):"N/A"}</td></tr>\n              <tr><td>Dexterity</td><td>${c.dexterity?i(c.dexterity,2):"N/A"}</td></tr>`:""}\n            <tr><td>Total</td><td>${c.total?i(c.total,2):"N/A"}</td></tr>\n            <tr><td>Source</td><td>${B}</td></tr>\n            <tr><td colspan="2">${a(c.timestamp)}</td></tr>\n          </table>\n        `;
                            e.push({
                                node: l,
                                html: b,
                                tooltip: S,
                                bs: c.total?.toString() ?? "0"
                            })
                        }
                }
                for (const t of e) t.node.innerHTML = t.html, t.node.title = t.tooltip, t.node.dataset.bs = t.bs;
                this.sort()
            }
            static updateTimers() {
                this.timerNodes.forEach(t => {
                    const e = t.userId,
                        s = t.node;
                    if (!s) return;
                    const n = m.getUserStatus(e);
                    if (!n) return;
                    if (-1 != ["Traveling", "Abroad"].indexOf(n.status ?? "")) return;
                    const r = o("Hospital" == n.status ? n.updateAt : 0);
                    s.textContent != r && (s.textContent = r, "Okay" == r && s.classList.contains("hospital") ? (s.classList.remove("hospital"), s.classList.remove("not-ok"), s.classList.add("okay"), s.classList.add("ok")) : "Okay" == r || s.classList.contains("hospital") || (s.classList.add("hospital"), s.classList.add("not-ok"), s.classList.remove("okay"), s.classList.remove("ok")), 1 != n.area ? s.classList.add("abroad") : s.classList.remove("abroad"))
                }), requestAnimationFrame(() => this.updateTimers())
            }
        })
    })())
}();