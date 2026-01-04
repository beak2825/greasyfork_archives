// ==UserScript==
// @name            NTU Auto Login
// @namespace       http://tampermonkey.net/
// @version         2025-09-08
// @author          kc0506
// @description     Automatically login for various NTU services
// @icon            https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @match           https://cool.ntu.edu.tw/login/portal
// @match           https://course.ntu.edu.tw/*
// @match           https://portal.aca.ntu.edu.tw/eportfolio/
// @match           https://ntumail.cc.ntu.edu.tw/webmail.html
// @match           https://wmail1.cc.ntu.edu.tw/rc/index.php
// @match           https://adfs.ntu.edu.tw/adfs/ls/*
// @match           https://web2.cc.ntu.edu.tw/p/s/login2/p1.php
// @match           https://my.ntu.edu.tw/*
// @run-at          document-end
// @grant           GM_getValue
// @grant           GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548794/NTU%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/548794/NTU%20Auto%20Login.meta.js
// ==/UserScript==
async function f() {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    !0,
    ["encrypt", "decrypt"]
  );
}
async function w(e, t) {
  const r = window.crypto.getRandomValues(new Uint8Array(12));
  return { encrypted: await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: r },
    t,
    new TextEncoder().encode(e)
  ), iv: r };
}
async function y(e, t, r) {
  const n = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: t },
    r,
    e
  );
  return new TextDecoder().decode(n);
}
async function i() {
  try {
    let e = await GM_getValue("ntu_key"), t = await GM_getValue("ntu_username_encrypted"), r = await GM_getValue("ntu_password_encrypted"), n = await GM_getValue("ntu_username_iv"), a = await GM_getValue("ntu_password_iv"), c, s;
    if (e && t && r && n && a) {
      const o = await window.crypto.subtle.importKey(
        "jwk",
        JSON.parse(e),
        { name: "AES-GCM" },
        !0,
        ["encrypt", "decrypt"]
      );
      c = await y(
        new Uint8Array(t).buffer,
        new Uint8Array(n),
        o
      ), s = await y(
        new Uint8Array(r).buffer,
        new Uint8Array(a),
        o
      );
    } else {
      const o = prompt("請輸入帳號:"), u = prompt("請輸入密碼:");
      if (!o || !u)
        return null;
      c = o, s = u;
      const l = await f(), m = await window.crypto.subtle.exportKey("jwk", l), d = await w(c, l), p = await w(s, l);
      await GM_setValue("ntu_key", JSON.stringify(m)), await GM_setValue("ntu_username_encrypted", Array.from(new Uint8Array(d.encrypted))), await GM_setValue("ntu_password_encrypted", Array.from(new Uint8Array(p.encrypted))), await GM_setValue("ntu_username_iv", Array.from(d.iv)), await GM_setValue("ntu_password_iv", Array.from(p.iv));
    }
    return { username: c, password: s };
  } catch (e) {
    return console.error("Error handling credentials:", e), null;
  }
}
const g = [
  {
    pattern: /^https:\/\/cool\.ntu\.edu\.tw\/login\/portal/,
    handler: () => {
      const e = document.querySelector(".LoginPage_right-panel__2udOJ button");
      e && e.click();
    }
  },
  {
    pattern: /^https:\/\/course\.ntu\.edu\.tw\//,
    handler: () => {
      window.addEventListener("load", () => {
        let e = 0;
        const t = 10, n = setInterval(() => {
          const a = document.querySelector('a[href="/login"]');
          a ? (a.click(), clearInterval(n)) : (e++, e >= t && clearInterval(n));
        }, 500);
      });
    }
  },
  {
    pattern: /^https:\/\/portal\.aca\.ntu\.edu\.tw\/eportfolio\//,
    handler: () => {
      window.addEventListener("load", () => {
        const e = document.querySelector('a[href="login"]');
        e ? (e.click(), console.log("Login link clicked automatically.")) : console.log("Login link not found.");
      });
    }
  },
  {
    pattern: /^https:\/\/ntumail\.cc\.ntu\.edu\.tw\/webmail\.html/,
    handler: () => {
      function e() {
        const t = document.querySelector('a.btn.btn-outline-dark[href="http://webmail2.ntu.edu.tw"]');
        t ? (t.click(), console.log("Button clicked!")) : setTimeout(e, 500);
      }
      e();
    }
  },
  {
    pattern: /^https:\/\/wmail1\.cc\.ntu\.edu\.tw\/rc\/index\.php/,
    handler: async () => {
      const e = await i();
      if (!e) return;
      const t = document.querySelector("#rcmloginuser"), r = document.querySelector("#rcmloginpwd"), n = document.querySelector("#rcmloginsubmit");
      t && r && (t.value = e.username, r.value = e.password, setTimeout(() => {
        n && n.click();
      }, 100));
    }
  },
  {
    pattern: /^https:\/\/adfs\.ntu\.edu\.tw\/adfs\/ls\//,
    handler: async () => {
      const e = await i();
      if (!e) return;
      const t = document.querySelector("#ContentPlaceHolder1_UsernameTextBox"), r = document.querySelector("#ContentPlaceHolder1_PasswordTextBox"), n = document.querySelector("#ContentPlaceHolder1_SubmitButton");
      t && r && (t.value = e.username, r.value = e.password, setTimeout(() => {
        n && n.click();
      }, 100));
    }
  },
  {
    pattern: "https://web2.cc.ntu.edu.tw/p/s/login2/p1.php",
    handler: async () => {
      const e = await i();
      if (!e) return;
      const t = document.querySelector('input[name="user"]'), r = document.querySelector('input[name="pass"]'), n = document.querySelector('input[name="Submit"]');
      console.log(t, r, n), t && r && (t.value = e.username, r.value = e.password, setTimeout(() => {
        n && n.click();
      }, 100));
    }
  },
  {
    pattern: /^https:\/\/my\.ntu\.edu\.tw\//,
    handler: async () => {
      if (!await i()) return;
      const t = document.querySelector('a[href="login.aspx"]');
      t && t.click();
    }
  }
];
(async function() {
  console.log("NTU Auto Login");
  const e = window.location.href;
  for (const t of g)
    if ((Array.isArray(t.pattern) ? t.pattern : [t.pattern]).some((n) => n instanceof RegExp ? n.test(e) : e === n)) {
      console.log("dispatch to", t.handler), await t.handler();
      break;
    }
})();
