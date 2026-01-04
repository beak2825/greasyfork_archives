// ==UserScript==
// @name         The101Bypass
// @namespace    http://tampermonkey.net/
// @version      2025-12-01
// @description  Globe The 101 developer and openwrt bypass
// @author       Rouel
// @match        *://192.168.0.1/*
// @icon         data:image/png;base64,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
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551777/The101Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/551777/The101Bypass.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const isHttps = window.location.protocol.startsWith("https");
    const devPath = "/cgi-bin/luci/admin/jt_system/get_develop_mode";
    const encodedDevUrl = new URL(
        "data:application/json," +
            encodeURIComponent(
                JSON.stringify({ data: { develop_mode: 1 }, code: 0 })
            )
    );

    init();

    function init() {
        if (isHttps) autoSetDeveloperMode();

        if (!isCgi(new URL(window.location))) {
            addOWRTLink();
            addFooterInfo();
        } else {
            setInterval(() => rewriteUrls(), 1000);
        }
    }

    function fixUrl(url) {
        if (url.startsWith("http")) return new URL(url);
        const baseUrl = window.location.protocol + "//" + window.location.host;
        return new URL(url, baseUrl);
    }

    // fetch interceptor
    window.nativeFetch = window.fetch;

    window.customFetch = async (request, headers) => {
        console.log("custom fetch");
        var finalRequest;
        const requestInput = request;

        if (typeof request == "string") {
            const u = fixUrl(request);
            updateSearchParams(u);
            finalRequest = new Request(u.toString(), headers);
        } else if (request instanceof Request) {
            const u = new URL(request.url);
            updateSearchParams(u);
            const newHeaders = new Headers(request.headers);

            if (headers) {
                new Headers(headers).forEach((value, name) => {
                    newHeaders.set(name, value);
                });
            }

            finalRequest = new Request(u.toString(), {
                method: request.method,
                headers: newHeaders,
                body: request.body,
            });
        } else {
            throw new TypeError(
                "First argument must be a URL string or a Request object."
            );
        }

        const response = await window.nativeFetch(finalRequest);
        response.requestInputObject = finalRequest;

        if (typeof requestInput === "string") {
            response.requestInputURL = requestInput;
        }

        if (headers) {
            response.requestInputHeaders = headers;
        }

        return response;
    };

    window.fetch = window.customFetch;

    // xml interceptor
    function xmlCustomRequest(method, url, _async, data) {
        console.log("xml");
        let u = fixUrl(url);

        if (!isHttps && u.pathname.startsWith(devPath)) {
            u = encodedDevUrl;
        }

        updateSearchParams(u);
        this.method = method;
        this.requestURL = u.toString();
        this.asynch = _async;
        this.requestHeaders = new Map();
        return this.nativeOpen(method, u.toString(), _async);
    }

    XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.customOpen = xmlCustomRequest;
    XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.customOpen;
    XMLHttpRequest.prototype.nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.customSend = function (data) {
        return XMLHttpRequest.prototype.nativeSend.apply(this, [data]);
    };
    XMLHttpRequest.prototype.send = XMLHttpRequest.prototype.customSend;

    async function addFooterInfo() {
        const container = document.createElement("div");
        container.style.gap = "5px";
        container.style.marginBlock = "2rem";
        container.style.color = "#979797";
        container.style.padding = "1rem";
        container.style.textAlign = "center";
        container.style.fontWeight = "bolder";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        container.style.flexDirection = "column";
        container.style.maxWidth = "40rem";
        container.style.marginInline = "auto";

        // script source
        const sourceEl = document.createElement("a");
        sourceEl.style.color = "#979797";
        sourceEl.href = "https://github.com/astrolabio1417/globe-5g-the101-tm";
        sourceEl.innerHTML = "Source Code";

        container.appendChild(sourceEl);
        document.querySelector("html").appendChild(container);

        const devPasswordEl = document.createElement("div");

        if (isHttps) {
            const dp = await getDevPassword();
            devPasswordEl.innerHTML = "Developer Password: </br>" + dp;
            container.insertBefore(devPasswordEl, sourceEl);
        } else {
            const httpsLink = document.createElement("a");
            const link = new URL(window.location);
            httpsLink.onclick = () => localStorage.removeItem("token");
            link.protocol = "https";
            httpsLink.href = link.toString();
            httpsLink.innerHTML = "Switch to Auto Dev Login Version";
            httpsLink.title =
                "Automatically logs in as superuser using a developer password generated from the device’s ProductSN.";
            container.insertBefore(httpsLink, sourceEl);
        }
    }

    async function getIsDeveloperMode() {
        const res = await fetch(
            "/cgi-bin/luci/admin/jt_system/get_develop_mode?flag=get_develop_mode&t="
        );
        return (await res.json())?.data?.develop_mode || 0;
    }

    function isCgi(u) {
        return u.pathname.startsWith("/cgi-bin/");
    }

    function updateSearchParams(u) {
        const iscgi = isCgi(u);
        if (!iscgi) return;
        u.searchParams.set("flag", "get_develop_mode");
        u.searchParams.set("t", new Date().getTime());
    }

    function addNavLinks(elements = []) {
        const navLinkEl = document.evaluate(
            "/html/body/div/div/section/div/div/div[3]/div[1]/div[2]/div/div[2]/div",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (!navLinkEl) {
            setTimeout(() => addNavLinks(elements), 1000);
            return;
        }

        elements.forEach((el) => {
            navLinkEl.appendChild(el);
        });

        // fix dumb style
        document.evaluate(
            "/html/body/div/div/section/div/div/div[3]/div[1]/div[2]/div/div[2]/div",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue.style.marginLeft = "-50px";
    }

    function addOWRTLink() {
        const openWRTlink = document.createElement("a");
        openWRTlink.href =
            "/cgi-bin/luci/admin/status/overview?flag=get_develop_mode&t=";
        openWRTlink.innerHTML = "OWRT";
        openWRTlink.classList.add("el-col", "el-col-6");
        openWRTlink.style =
            'padding-left: 15px; padding-right: 30px; font-size: 16px; color: "rgb(0, 119, 200)"';
        addNavLinks([openWRTlink]);
    }

    function rewriteUrls() {
        const editedKey = "edited";

        document.querySelectorAll(`a:not([${editedKey}])`).forEach((a) => {
            a.setAttribute(editedKey, "");
            if (!a.href) return;
            const u = new URL(a.href);
            if (!isCgi(u)) return;
            updateSearchParams(u);
            a.href = u.toString();
        });

        document
            .querySelectorAll(`[onclick]:not([${editedKey}])`)
            .forEach((a) => {
                a.setAttribute(editedKey, "");
                const f = a.onclick.toString();
                if (typeof f !== "string") return;
                const m = f.match(/'(\/cgi-bin\/.*)'/);
                if (!m) return;

                const prevClick = a.onclick;

                a.onclick = () => {
                    prevClick();
                    const newUrl = fixUrl(m[1]);
                    updateSearchParams(newUrl);
                    location.href = newUrl.toString();
                };
            });
    }

    function getUserToken() {
        return localStorage.getItem("token") || "";
    }

    async function generateHash(sn) {
        const input = `${sn}+*#developer*#rain*#`;

        // Hash using Web Crypto API (returns ArrayBuffer)
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);

        // Convert ArrayBuffer → hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        // Simulate: cut -c 1-15,50-64 (1-based)
        const part1 = hashHex.slice(0, 15);
        const part2 = hashHex.slice(49, 64);
        return part1 + part2;
    }

    async function getProductSn() {
        const res = await fetch(
            "/ubus/?flag=devinfo_get&t=" + new Date().getTime(),
            {
                method: "post",
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "call",
                    params: [getUserToken(), "jytl_api", "devinfo_get", {}],
                }),
                headers: generateHeaders("devinfo_get"),
            }
        );

        const data = await res.json();
        return data?.result?.[1]?.data?.productSN;
    }

    function generateHeaders(flag = "") {
        const h = {
            token: getUserToken(),
            "x-requested-with": "XMLHttpRequest",
            "content-type": "application/json",
        };

        if (h) {
            h.flag = flag;
        }

        return h;
    }

    async function wait(n = 1000) {
        await new Promise((resolve) => setTimeout(resolve, n));
    }

    async function getDevPassword() {
        if (!window.location.protocol.startsWith("https")) {
            throw new Error("Crypto is only available on HTTPS pages.");
        }

        while (!getUserToken()) await wait();

        const productSN = await getProductSn();
        const passwd = await generateHash(productSN);
        console.log({ productSN, passwd });
        return passwd;
    }

    function setCookie(name, value, days, sameSite = "Lax") {
        let expires = "Session";

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = date.toUTCString();
        }

        document.cookie = `${name}=${
            value || ""
        }; expires=${expires}; path=/; SameSite=${sameSite}`;
    }

    async function autoSetDeveloperMode() {
        while (true) {
            await setDeveloperMode();
            await wait();
        }
    }

    async function setDeveloperMode() {
        if (!getUserToken()) return;
        if (await getIsDeveloperMode()) return;
        if (document.cookie.includes("superadmin")) return;

        const passwd = await getDevPassword();
        const payload = {
            t: new Date().getTime(),
            enable: "1",
            username: "admin",
            passwd: passwd,
        };
        const data = await fetch(
            "/cgi-bin/luci/admin/jt_system/set_develop_mode?flag=set_develop_mode&t=" +
                payload.t,
            {
                method: "post",
                body: JSON.stringify(payload),
                headers: generateHeaders("set_develop_mode"),
            }
        );
        const { dtoken, code } = (await data.json()) ?? {};

        if (!dtoken || code !== 0) {
            alert("Can't set_develop_mode!");
            wait(2500);
            return;
        }

        setCookie("cookieUsername", "superadmin", 1);
        setCookie("dtoken", dtoken, 0, "");
    }
})();
