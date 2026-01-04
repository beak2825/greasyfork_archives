// ==UserScript==
// @name Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @namespace gaston.presence
// @version 1.3.3
// @description Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @match *://*.roblox.com/*
// @run-at document-idle
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @connect localhost
// @connect 127.0.0.1
// @connect users.roblox.com
// @connect avatar.roblox.com
// @connect inventory.roblox.com
// @connect economy.roblox.com
// @connect catalog.roblox.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548192/Roblox%20Presence%20Dashboard%20%2B%20Fit%20Cloner%20%28USD%20Packs%20%2B%20Last%20Seen%29%20%E2%80%94%20finished.user.js
// @updateURL https://update.greasyfork.org/scripts/548192/Roblox%20Presence%20Dashboard%20%2B%20Fit%20Cloner%20%28USD%20Packs%20%2B%20Last%20Seen%29%20%E2%80%94%20finished.meta.js
// ==/UserScript==
! function() {
    "use strict";
    class e {
        static get br() {
            return new e("br")
        }
        constructor(e, t) {
            this.element = "object" == typeof e && e && String(e.constructor && e.constructor.name).indexOf("HTML") > -1 ? e : function() {
                var r = document.createElement(e);
                if (t)
                    for (var n in t) r.setAttribute(n, t[n]);
                return r
            }()
        }
        style(e) {
            if (e)
                for (var t in e) this.element.style[t] = e[t];
            return this
        }
        append(e) {
            this.element.append(e && e.element ? e.element : e);
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                this.element.append(r && r.element ? r.element : r)
            }
            return this
        }
        appendTo(e) {
            try {
                (e && e.element ? e.element : "string" == typeof e ? document.querySelector(e) : e).append(this.element)
            } catch (e) {
                console.warn("Failed to append", e)
            }
            return this
        }
        on(e, t) {
            return this.element["on" + e] = t, this
        }
        set(e, t) {
            return this.element[e] = t, this
        }
        remove() {
            return this.element.remove(), this
        }
        get() {
            return this.element[arguments[0]]
        }
        get children() {
            return new function(e) {
                for (var t = 0; t < e.length; t++) this[t] = e[t];
                Object.defineProperty(this, "length", {
                    get: function() {
                        return e.length
                    }
                }), this.item = function(e) {
                    return null != this[e] ? this[e] : null
                }, this.namedItem = function(t) {
                    for (var r = 0; r < e.length; r++) {
                        var n = e[r];
                        if (n.id === t || n.name === t) return n
                    }
                    return null
                }, Object.freeze(this)
            }(Array.prototype.slice.call(this.element.children))
        }
    }

    function t(e, t) {
        t = t || 1e4;
        var r = document.querySelector(e);
        return r ? Promise.resolve(r) : new Promise((function(r, n) {
            var o = new MutationObserver((function() {
                var t = document.querySelector(e);
                t && (o.disconnect(), r(t))
            }));
            o.observe(document.documentElement, {
                childList: !0,
                subtree: !0
            }), setTimeout((function() {
                o.disconnect(), n(new Error("Timeout: " + e))
            }), t)
        }))
    }

    function r(e, t) {
        try {
            var r = "function" == typeof GM_getValue ? GM_getValue(e, "") : localStorage.getItem(e) || "";
            return r ? JSON.parse(r) : t
        } catch (e) {
            return t
        }
    }

    function n(e, t) {
        try {
            var r = JSON.stringify(t || []);
            "function" == typeof GM_setValue ? GM_setValue(e, r) : localStorage.setItem(e, r)
        } catch (e) {}
    }
    var o = [],
        s = function(e) {
            try {
                var t = "function" == typeof GM_getValue ? GM_getValue(e, "") : localStorage.getItem(e) || "";
                if (!t) return [];
                var r = JSON.parse(t);
                return Array.isArray(r) ? r : []
            } catch (e) {
                return []
            }
        }("presence_watch_users"),
        a = p(o.concat(s)),
        i = [{
            r$: 80,
            usd: .99
        }, {
            r$: 400,
            usd: 4.99
        }, {
            r$: 800,
            usd: 9.99
        }, {
            r$: 1700,
            usd: 19.99
        }, {
            r$: 4500,
            usd: 49.99
        }, {
            r$: 1e4,
            usd: 99.99
        }],
        d = new class {
            constructor(e) {
                this.title = {
                    body: e || "---",
                    color: "darkgrey",
                    size: "1rem"
                }, this.body = {
                    color: "#008f68",
                    size: "1rem"
                }
            }
#e(e) {
                var t = String(e).toUpperCase();
                return ["%c" + this.title.body + " [" + t + "] | %c", "color:" + this.title.color + ";font-weight:bold;font-size:" + this.title.size + ";", "color:" + this.body.color + ";font-weight:bold;font-size:" + this.body.size + ";text-shadow:0 0 5px rgba(0,0,0,.2);"]
            }
            log(e) {
                var t = this.#e("log");
                console.log(t[0] + e, t[1], t[2])
            }
            warn(e) {
                var t = this.#e("warn");
                console.warn(t[0] + e, t[1], t[2])
            }
            error(e) {
                var t = this.#e("error");
                console.error(t[0] + e, t[1], t[2])
            }
        }("PresenceHUD");

    function l(e) {
        var t = e && e.method ? e.method : "GET",
            r = e && e.url ? e.url : "",
            n = e && e.headers ? e.headers : {},
            o = e && e.data ? e.data : null,
            s = e && e.timeout ? e.timeout : 15e3;
        return new Promise((function(e, a) {
            GM_xmlhttpRequest({
                method: t,
                url: r,
                headers: n,
                data: o,
                timeout: s,
                onload: function(t) {
                    if (!(t.status >= 200 && t.status < 300)) return a(new Error("HTTP " + t.status + " " + (t.responseText ? t.responseText.slice(0, 160) : "")));
                    try {
                        e(JSON.parse(t.responseText || "{}"))
                    } catch (e) {
                        a(e)
                    }
                },
                onerror: function() {
                    a(new Error("Network error"))
                },
                ontimeout: function() {
                    a(new Error("Timeout"))
                }
            })
        }))
    }
    async function u(e, t) {
        var r = t ? {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json"
                },
                body: JSON.stringify(t)
            } : {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    accept: "application/json"
                }
            },
            n = await fetch(e, r);
        if (!n.ok) throw new Error("HTTP " + n.status);
        return n.json()
    }
    var c = {
        presenceUsers: function(e) {
            return l({
                url: "http://localhost:3000/presence-users?userIds=" + e.join(",")
            })
        },
        usernames: function(e) {
            return l({
                method: "POST",
                url: "https://users.roblox.com/v1/users",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json"
                },
                data: JSON.stringify({
                    userIds: e.map(Number),
                    excludeBannedUsers: !1
                })
            })
        },
        me: function() {
            return u("https://users.roblox.com/v1/users/authenticated")
        },
        avatar: function(e) {
            return u("https://avatar.roblox.com/v1/users/" + e + "/avatar")
        },
        ownsAsset: function(e, t) {
            return u("https://inventory.roblox.com/v1/users/" + e + "/items/Asset/" + t + "/is-owned").then((function(e) {
                return !!e
            }))
        },
        assetDetails: function(e) {
            return l({
                url: "https://economy.roblox.com/v2/assets/" + e + "/details"
            })
        },
        assetToBundle: function(e) {
            return l({
                url: "https://catalog.roblox.com/v1/assets/" + e + "/bundles"
            }).then((function(e) {
                return e && e.data ? e.data : []
            })).catch((function() {
                return []
            }))
        },
        bundleDetails: function(e) {
            return l({
                url: "https://catalog.roblox.com/v1/bundles/" + e + "/details"
            })
        }
    };

    function p(e) {
        for (var t = {}, r = [], n = 0; n < e.length; n++) {
            var o = Number(e[n]);
            o && !t[o] && (t[o] = 1, r.push(o))
        }
        return r
    }

    function f(e, t) {
        var n = r("lastSeenInGame", {});
        n[e] = t,
            function(e, t) {
                var r = JSON.stringify(t || {});
                try {
                    "function" == typeof GM_setValue ? GM_setValue(e, r) : localStorage.setItem(e, r)
                } catch (e) {}
            }("lastSeenInGame", n)
    }

    function h(e) {
        if (!e) return "—";
        for (var t = Math.max(1, Math.floor((Date.now() - e) / 1e3)), r = [
                ["d", 86400],
                ["h", 3600],
                ["m", 60],
                ["s", 1]
            ], n = 0; n < r.length; n++) {
            var o = r[n][0],
                s = r[n][1];
            if (t >= s) return String(Math.floor(t / s)) + o + " ago"
        }
        return "just now"
    }
    async function v(e) {
        var t, r = ((t = document.createElement("div")).style.cssText = "position:fixed;top:100px;right:420px;z-index:2147483647;background:#0f1116;color:#eee;width:460px;max-height:80vh;overflow:auto;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.4);padding:12px;", t.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><div id="fp-title" style="font-weight:700;">Fit</div><div id="fp-sub" style="margin-left:auto;font-size:12px;opacity:.8;">loading…</div><button id="fp-close" style="background:#222;border:none;color:#aaa;padding:2px 8px;border-radius:6px;cursor:pointer;">×</button></div><div id="fp-preview" style="margin:8px 0;"></div><div id="fp-cost" style="margin:6px 0;font-weight:600;"></div><div id="fp-pack" style="margin:4px 0 10px;font-size:13px;opacity:.9;"></div><div id="fp-list" style="border-top:1px solid #1e1e24;"></div><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;"><button id="fp-clone" style="background:#28a745;border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;">Clone Fit (wear owned)</button><button id="fp-buy"   style="background:#f2994a;border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;">Buy Missing (open tabs)</button></div>', document.body.appendChild(t), t.querySelector("#fp-close").onclick = function() {
                t.remove()
            }, t),
            n = r.querySelector("#fp-title"),
            o = r.querySelector("#fp-sub"),
            s = r.querySelector("#fp-list"),
            a = r.querySelector("#fp-preview"),
            l = r.querySelector("#fp-cost"),
            u = r.querySelector("#fp-pack");
        try {
            var p = await c.usernames([e]),
                f = p && p.data && p.data[0] && p.data[0].name ? p.data[0].name : e;
            n.textContent = "Fit: " + f;
            var h = null;
            try {
                h = await c.me()
            } catch (e) {}
            for (var v = await c.avatar(e), y = v && v.assets ? v.assets : [], m = [], b = 0; b < y.length; b++) {
                var g = y[b];
                g && g.id && g.name && m.push({
                    assetId: g.id,
                    name: g.name,
                    typeId: g.assetType && g.assetType.id ? g.assetType.id : null,
                    isPackageAsset: !!g.isPackageAsset
                })
            }
            a.innerHTML = '<div style="font-size:13px;opacity:.85;">Items worn: ' + m.length + "</div>";
            var x = [];
            for (b = 0; b < m.length; b++) {
                var w = m[b],
                    I = !1,
                    k = null,
                    S = null,
                    T = null,
                    A = !1,
                    O = null;
                if (h && h.id) try {
                    I = await c.ownsAsset(h.id, w.assetId)
                } catch (e) {}
                try {
                    var q = await c.assetDetails(w.assetId);
                    q && (k = null != q.PriceInRobux ? q.PriceInRobux : null, (S = null != q.ProductId ? q.ProductId : null) && (O = "https://www.roblox.com/catalog/" + w.assetId))
                } catch (e) {}
                if (null == k) try {
                    var M = await c.assetToBundle(w.assetId);
                    if (M && M.length) {
                        A = !0;
                        try {
                            var P = await c.bundleDetails(M[0].bundleId);
                            P && P.id && (O = "https://www.roblox.com/bundles/" + (T = {
                                id: P.id,
                                name: P.name,
                                price: P.product && null != P.product.priceInRobux ? P.product.priceInRobux : null
                            }).id + "/" + encodeURIComponent(T.name || "bundle"))
                        } catch (e) {
                            console.warn("Bundle lookup failed for", w.assetId, String(e && e.message ? e.message : e))
                        }
                    }
                } catch (e) {}
                x.push({
                    assetId: w.assetId,
                    name: w.name,
                    typeId: w.typeId,
                    isPackageAsset: w.isPackageAsset,
                    owned: I,
                    price: k,
                    productId: S,
                    bundle: T,
                    bundleOnly: A,
                    purchaseUrl: O
                })
            }
            var $ = 0,
                C = [];
            for (b = 0; b < x.length; b++) {
                var N = x[b];
                N.owned || N.bundleOnly || null == N.price || C.push(N)
            }
            for (b = 0; b < C.length; b++) $ += C[b].price || 0;
            var _ = {};
            for (b = 0; b < x.length; b++) !(N = x[b]).owned && N.bundleOnly && N.bundle && N.bundle.id && null != N.bundle.price && (_[N.bundle.id] || (_[N.bundle.id] = N.bundle, $ += N.bundle.price));
            var E = "";
            for (b = 0; b < x.length; b++) {
                var R = (N = x[b]).owned ? '<span style="color:#7ee787;">owned</span>' : '<span style="color:#ffb3b3;">missing</span>',
                    U = null != N.price ? N.price + " R$" : N.bundleOnly ? "bundle-only" : "offsale",
                    L = !N.owned && N.purchaseUrl ? ' <a target="_blank" href="' + N.purchaseUrl + '" style="margin-left:6px;text-decoration:none;background:#f2994a;color:#fff;padding:3px 6px;border-radius:6px;">Buy</a>' : "";
                E += '<div style="padding:8px;border-bottom:1px solid #1e1e24;"><div style="font-weight:600;">' + N.name + ' <span style="opacity:.7">(#' + N.assetId + ')</span></div><div style="font-size:12px;opacity:.9;">' + R + " • " + (N.bundleOnly && N.bundle ? "via Bundle: " + N.bundle.name : "price: " + U) + L + "</div></div>"
            }
            s.innerHTML = E, l.textContent = "Missing total: " + $ + " R$";
            var j = function(e) {
                if (e <= 0) return {
                    usd: 0,
                    leftover: 0,
                    packs: [],
                    totalR$: 0
                };
                for (var t = 0, r = 0; r < i.length; r++) i[r].r$ > t && (t = i[r].r$);
                var n, o, s, a, d = e + t,
                    l = new Array(d + 1);
                for (l[0] = {
                        usd: 0,
                        prev: null
                    }, r = 0; r <= d; r++)
                    if (l[r])
                        for (o = 0; o < i.length; o++)(n = r + (s = i[o]).r$) > d && (n = d), a = l[r].usd + s.usd, (!l[n] || a < l[n].usd - 1e-9) && (l[n] = {
                            usd: a,
                            prev: {
                                i: r,
                                packIndex: o
                            }
                        });
                var u = null,
                    c = -1;
                for (n = e; n <= d; n++)
                    if (l[n]) {
                        var p = {
                            j: n,
                            usd: l[n].usd,
                            leftover: n - e
                        };
                        (!u || p.usd < u.usd - 1e-9 || Math.abs(p.usd - u.usd) < 1e-9 && p.leftover < u.leftover) && (u = p, c = n)
                    }
                if (!u) return null;
                for (var f = new Map, h = c; h > 0;) {
                    var v = l[h].prev;
                    if (!v) break;
                    s = i[v.packIndex], f.set(s, (f.get(s) || 0) + 1), h = v.i
                }
                var y = [];
                return f.forEach((function(e, t) {
                    y.push({
                        r$: t.r$,
                        usd: t.usd,
                        count: e
                    })
                })), y.sort((function(e, t) {
                    return t.r$ - e.r$
                })), {
                    usd: Number(u.usd.toFixed(2)),
                    leftover: u.leftover,
                    packs: y,
                    totalR$: c
                }
            }($);
            if (j) {
                var B = [];
                for (b = 0; b < j.packs.length; b++) B.push(j.packs[b].count + "× " + j.packs[b].r$ + "R$ ($" + j.packs[b].usd + ")");
                var z = B.join(" + ");
                u.textContent = "Buy Robux (~$" + j.usd.toFixed(2) + "): " + z + " = " + j.totalR$ + "R$ (leftover " + j.leftover + "R$)"
            } else u.textContent = "You already own everything.";
            r.querySelector("#fp-buy").onclick = function() {
                for (var e = 0; e < x.length; e++) {
                    var t = x[e];
                    !t.owned && t.purchaseUrl && window.open(t.purchaseUrl, "_blank")
                }
            }, r.querySelector("#fp-clone").onclick = function() {
                for (var e = 0; e < x.length; e++) {
                    var t = x[e];
                    t.owned && t.purchaseUrl && window.open(t.purchaseUrl, "_blank")
                }
            }, o.textContent = "ready"
        } catch (e) {
            o.textContent = "error", d.error("Fit popup failed: " + e.message)
        }
    }
    async function y(e) {
        g = location.href.split("/").map((e => e.replace(/[0-9]/g, ""))).slice(3).join(":");
        var t = e.querySelector("#phud-status"),
            i = e.querySelector("#phud-list");
        try {
            if (t.textContent = "checking…", !a.length) return i.innerHTML = '<div style="padding:10px;opacity:.8;">No users yet. Add a userId above.</div>', t.textContent = "OK", void m();
            var l = await c.presenceUsers(a),
                u = l && l.userPresences ? l.userPresences : [],
                x = l && l.lastSeenInGame ? l.lastSeenInGame : {},
                w = await c.usernames(a),
                I = {};
            if (w && w.data)
                for (var k = 0; k < w.data.length; k++) I[w.data[k].id] = w.data[k].name;
            ! function(e, t, i, d) {
                e.innerHTML = "";
                for (var l = 0; l < t.length; l++) {
                    var u = t[l],
                        c = i[u.userId] ? i[u.userId] : u.userId,
                        m = 2 === Number(u.userPresenceType),
                        b = m ? "🎮 In Game " + (u.lastLocation ? "– " + u.lastLocation : "") : 1 === u.userPresenceType ? "🌐 Online" : "❌ Offline",
                        g = m && u.placeId && (u.gameId || u.serverId) ? "roblox://placeId=" + u.placeId + "&gameInstanceId=" + (u.gameId || u.serverId) : null,
                        x = d && d[u.userId] ? d[u.userId] : null;
                    m ? f(u.userId, Date.now()) : x && f(u.userId, x);
                    var w = (S = u.userId, r("lastSeenInGame", {})[S] || null),
                        I = w ? h(w) : "—",
                        k = document.createElement("div");
                    k.style.cssText = "padding:8px 4px;border-bottom:1px solid #1e1e24;display:flex;align-items:center;gap:8px;", k.innerHTML = '<div style="flex:1;min-width:0;"><div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + c + '</div><div style="font-size:12px;opacity:.85;">' + b + '</div><div style="font-size:12px;opacity:.65;">Last seen in game: ' + (m ? "now" : I) + '</div></div><div style="display:flex;gap:6px;align-items:center;"><button class="phud-showfit" data-user="' + u.userId + '" style="background:#5865f2;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Show Fit</button>' + (g ? '<button class="phud-join" data-link="' + g + '" style="background:#28a745;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Join Now</button>' : '<button disabled style="background:#3a3a45;border:none;color:#888;padding:6px 10px;border-radius:8px;">Join Now</button>') + '<button class="phud-remove" data-user="' + u.userId + '" title="Remove" style="background:#2b2f3a;border:none;color:#ff9aa2;padding:6px 10px;border-radius:8px;cursor:pointer;">🗑</button></div>', e.appendChild(k)
                }
                for (var S, T = e.querySelectorAll(".phud-join"), A = 0; A < T.length; A++) T[A].onclick = function() {
                    window.location.href = this.getAttribute("data-link")
                };
                for (var O = e.querySelectorAll(".phud-showfit"), q = 0; q < O.length; q++) O[q].onclick = function() {
                    v(Number(this.getAttribute("data-user")))
                };
                for (var M = e.querySelectorAll(".phud-remove"), P = 0; P < M.length; P++) M[P].onclick = function() {
                    var e = Number(this.getAttribute("data-user"));
                    n("presence_watch_users", s = s.filter((function(t) {
                        return t !== e
                    }))), a = p(o.concat(s)), y(document.getElementById("presence-hud"))
                }
            }(i, u, I, x), t.textContent = "OK"
        } catch (e) {
            t.textContent = "error", i.innerHTML = '<div style="padding:10px;color:#ff8a8a;">' + e.message + "</div>", d.error("Refresh failed: " + e.message)
        }
        b[g] ? b[g]() : d.warn(`${g} - doesn't exist yet or wasnted instea to have dom actions!`)
    }
    async function m() {
        var r = function() {
            for (var e = location.href.split("/"), t = [], r = 3; r < e.length; r++) t.push(e[r].replace(/[0-9]/g, ""));
            return t.join(":")
        }();
        if ("users::profile" === r && !document.getElementById("PresenceHUD_AddBtn")) {
            for (var i = Number(location.href.split("/")[4]) || 0, d = ["#unfriend-button", "#friend-button", 'button[data-testid="profile-action"]'], l = null, u = 0; u < d.length; u++)
                if (document.querySelector(d[u])) {
                    l = d[u];
                    break
                }
            if (l) {
                var c = null;
                try {
                    c = await t(l)
                } catch (e) {
                    return
                }
                if (c) {
                    var f = new e("button", {
                            id: "PresenceHUD_AddBtn",
                            class: c.className
                        }),
                        h = a.indexOf(i) > -1;
                    f.set("textContent", h ? "Remove User" : "Add User"), c.insertAdjacentElement("beforebegin", f.element), f.on("click", (function() {
                        a.indexOf(i) > -1 ? s = s.filter((function(e) {
                            return e !== i
                        })) : i && (s = p(s.concat([i]))), n("presence_watch_users", s), a = p(o.concat(s)), f.set("textContent", a.indexOf(i) > -1 ? "Remove User" : "Add User");
                        var e = document.getElementById("presence-hud");
                        e && y(e)
                    }))
                }
            }
        }
    }
    const b = {
        "users::profile": async function() {
            return await m(), !0
        },
        "users::friends#!:friends": async function() {
            for (var e = null, r = [".avatar-cards", "#friends .avatar-cards"], i = 0; i < r.length; i++)
                if (document.querySelector(r[i])) {
                    e = r[i];
                    break
                }
            if (!e) return !1;
            var d = null;
            try {
                d = await t(e)
            } catch (e) {
                return !1
            }
            if (!d) return !1;

            function l(e) {
                if (e && 1 === e.nodeType && !e.querySelector(".PresenceHUD_AddBtn")) {
                    var t = 0,
                        r = e.id || "";
                    if (r && /^\d+$/.test(r)) t = Number(r);
                    else {
                        var i = e.getAttribute("data-user-id");
                        i && /^\d+$/.test(i) && (t = Number(i))
                    }
                    if (t) {
                        var d = e.querySelector(".avatar-card-caption") || e,
                            l = document.createElement("button");
                        l.className = "PresenceHUD_AddBtn btn-control btn-growth-sm", l.textContent = (a.indexOf(t) > -1 ? "Remove" : "Add") + ":" + t, l.style.marginTop = "6px", l.style.display = "inline-block", l.style.background = "#2b2f3a", l.style.color = "#fff", l.style.border = "none", l.style.borderRadius = "8px", l.style.padding = "6px 10px", l.style.cursor = "pointer", l.onclick = function() {
                            var r = a.indexOf(t) > -1;
                            n("presence_watch_users", s = r ? s.filter((function(e) {
                                return e !== t
                            })) : p(s.concat([t]))), a = p(o.concat(s)), l.textContent = a.indexOf(t) > -1 ? "Remove" : "Add";
                            var i = e.style.backgroundColor;
                            e.style.backgroundColor = "rgba(56, 189, 248, 0.08)", setTimeout((function() {
                                e.style.backgroundColor = i
                            }), 250);
                            var d = document.getElementById("presence-hud");
                            d && y(d)
                        }, d.appendChild(l)
                    }
                }
            }
            for (var u = d.children, c = 0; c < u.length; c++) l(u[c]);
            var f = new MutationObserver((function(e) {
                for (var t = 0; t < e.length; t++) {
                    var r = e[t];
                    if ("childList" === r.type)
                        for (var n = 0; n < r.addedNodes.length; n++) {
                            var o = r.addedNodes[n];
                            if (o && 1 === o.nodeType)
                                if (String(o.className || "").indexOf("avatar-card") > -1) l(o);
                                else
                                    for (var s = o.querySelectorAll ? o.querySelectorAll(".avatar-card") : [], a = 0; a < s.length; a++) l(s[a])
                        }
                }
            }));
            return f.observe(d, {
                childList: !0,
                subtree: !0
            }), !0
        },
        "users:friends#!:following": async function() {
            return await this["users::friends#!:friends"]()
        },
        "users:friends#!:friends": async function() {
            return await this["users::friends#!:friends"]()
        },
        "users:friends#!:": async function() {
            return await this["users::friends#!:friends"]()
        },
        "users:friends#!:followers": async function() {
            return await this["users::friends#!:friends"]()
        },
        "users:friends#!:friend-requests": async function() {
            return await this["users::friends#!:friends"]()
        }
    };
    let g = location.href.split("/").map((e => e.replace(/[0-9]/g, ""))).slice(3).join(":");
    !async function() {
        await new Promise((function(e) {
            if (document.body) return e();
            var t = new MutationObserver((function() {
                document.body && (t.disconnect(), e())
            }));
            t.observe(document.documentElement, {
                childList: !0,
                subtree: !0
            })
        }));
        var e, t, r, i, d, l, u, c, f = ((c = document.createElement("div")).id = "presence-hud", c.style.cssText = "position:fixed;top:72px;right:20px;z-index:2147483647;background:#0e0e12;color:#eee;padding:10px 10px 8px;width:400px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.4);font:14px/1.35 ui-sans-serif,system-ui,Segoe UI,Roboto;", c.innerHTML = '<div style="display:flex;align-items:center;gap:8px;cursor:move" id="phud-title"><div style="font-weight:700;">Presence Dashboard</div><div id="phud-status" style="margin-left:auto;font-size:12px;opacity:.8;">—</div><button id="phud-close" style="background:#222;border:none;color:#aaa;padding:2px 8px;border-radius:6px;cursor:pointer;">×</button></div><div style="margin:8px 0 6px;display:flex;gap:8px;align-items:center;"><button id="phud-refresh" style="flex:0 0 auto;background:#2b2f3a;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Refresh</button><div style="font-size:12px;opacity:.7;">Polling every ' + Math.floor(15) + 's</div></div><div style="display:flex;gap:6px;margin-bottom:8px;"><input id="phud-add-input" type="text" placeholder="Add userId" style="flex:1;background:#14141b;border:1px solid #242432;color:#fff;padding:6px 8px;border-radius:8px;outline:none;" /><button id="phud-add-btn" style="background:#3b82f6;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Add</button></div><div id="phud-list" style="max-height:480px;overflow:auto;border-top:1px solid #1e1e24;"></div>', document.body.appendChild(c), e = c, t = c.querySelector("#phud-title"), r = 0, i = 0, d = 0, l = 0, u = !1, t.addEventListener("mousedown", (function(t) {
            u = !0, r = t.clientX, i = t.clientY;
            var n = e.getBoundingClientRect();
            d = n.left, l = n.top, t.preventDefault()
        })), window.addEventListener("mousemove", (function(t) {
            if (u) {
                var n = t.clientX - r,
                    o = t.clientY - i;
                e.style.left = d + n + "px", e.style.top = l + o + "px", e.style.right = "auto", e.style.bottom = "auto", e.style.position = "fixed"
            }
        })), window.addEventListener("mouseup", (function() {
            u = !1
        })), c.querySelector("#phud-close").onclick = function() {
            c.remove()
        }, c.querySelector("#phud-add-btn").onclick = function() {
            var e = c.querySelector("#phud-add-input"),
                t = Number((e.value || "").trim());
            t && (n("presence_watch_users", s = p(s.concat([t]))), a = p(o.concat(s)), e.value = "", y(c))
        }, c);
        f.querySelector("#phud-refresh").onclick = function() {
            a = p(o.concat(s)), y(f)
        }, y(f), setInterval((function() {
            a = p(o.concat(s)), y(f)
        }), 15e3), window.addEventListener("keydown", (function(e) {
            if (e.ctrlKey && e.shiftKey && "f" === String(e.key).toLowerCase()) {
                var t = document.getElementById("presence-hud");
                if (!t) return;
                t.style.display = "none" === t.style.display ? "block" : "none"
            }
        }))
    }()
}();