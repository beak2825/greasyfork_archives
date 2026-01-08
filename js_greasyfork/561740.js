// ==UserScript==
// @name         Nick Captcha Solver
// @namespace    nick-captcha-solver
// @version      1.2
// @description  Minimal captcha solver UI with token submission or view-only mode
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561740/Nick%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/561740/Nick%20Captcha%20Solver.meta.js
// ==/UserScript==

(function () {
  try {
    const params = new URLSearchParams(location.search);
    const nickmode = params.get("nickmode"); // ✅ changed
    const siteKey = params.get("sitekey");
    const captchaId = params.get("captchaid");
    const viewOnly = params.get("viewonly") === "1";

    if (!nickmode || !siteKey || !captchaId) return;

    /* ---------------- UI ---------------- */

    document.open();
    document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Nick - Solve The Captcha</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    margin: 0;
    height: 100vh;
    background: radial-gradient(circle at top, #111827, #020617);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    color: #e5e7eb;
  }

  .box {
    text-align: center;
    padding: 40px 32px;
    border-radius: 18px;
    background: rgba(2, 6, 23, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    min-width: 320px;
  }

  h1 {
    font-size: 26px;
    margin-bottom: 24px;
    letter-spacing: 0.4px;
  }

  #captcha {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .done {
    font-size: 18px;
    color: #22c55e;
    margin-bottom: 8px;
  }

  .sub {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 10px;
  }

  textarea {
    width: 100%;
    margin-top: 12px;
    padding: 10px;
    border-radius: 8px;
    background: #020617;
    color: #e5e7eb;
    border: 1px solid rgba(148,163,184,0.2);
    resize: none;
    font-size: 12px;
  }
</style>
</head>
<body>
  <div class="box" id="root">
    <h1>Solve The Captcha</h1>
    <div id="captcha"></div>
  </div>
</body>
</html>
`);
    document.close();

    /* ---------------- Helpers ---------------- */

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.defer = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    function postToken(token) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://captcha.moron-bots.workers.dev/", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({
        captchaid: captchaId,
        token: token
      }));
    }

    function onSolved(token) {
      const root = document.getElementById("root");

      if (viewOnly) {
        root.innerHTML = `
          <div class="done">✅ Captcha Solved (View Only)</div>
          <div class="sub">
            <textarea readonly onclick="this.select()">${token}</textarea>
            Click to copy token
          </div>
        `;
      } else {
        postToken(token);
        root.innerHTML = `
          <div class="done">✅ Captcha Is Solved</div>
          <div class="sub">You can go back safely.</div>
        `;
      }
    }

    /* ---------------- Engines ---------------- */

    const ENGINES = {
      v2: {
        src: "https://www.google.com/recaptcha/api.js?onload=__nick_onload&render=explicit",
        render() {
          window.__nick_onload = () => {
            grecaptcha.render("captcha", {
              sitekey: siteKey,
              callback: onSolved
            });
          };
          if (window.grecaptcha) window.__nick_onload();
        }
      },

      hcaptcha: {
        src: "https://js.hcaptcha.com/1/api.js?render=explicit",
        render() {
          hcaptcha.render("captcha", {
            sitekey: siteKey,
            callback: onSolved
          });
        }
      }
    };

    /* ---------------- Boot ---------------- */

    const engine = ENGINES[nickmode];
    if (!engine) return;

    loadScript(engine.src).then(engine.render);

  } catch (e) {
    console.error("Nick Captcha Solver error:", e);
  }
})();
