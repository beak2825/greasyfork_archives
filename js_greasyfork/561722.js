// ==UserScript==
// @name         DD Captcha Solver
// @namespace    dd-captcha-solver
// @version      2
// @description  Multi-sitekey captcha solver with token submit or view-only mode
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561722/DD%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/561722/DD%20Captcha%20Solver.meta.js
// ==/UserScript==

(function () {
  try {
    const params = new URLSearchParams(location.search);
    const ddmode = params.get("ddmode");
    const siteKeyParam = params.get("sitekey");
    const captchaId = params.get("captchaid");
    const viewOnly = params.get("viewonly") === "1";

    if (!ddmode || !siteKeyParam || !captchaId) return;

    const siteKeys = siteKeyParam.split("|").map(s => s.trim()).filter(Boolean);
    if (!siteKeys.length) return;

    const tokens = new Array(siteKeys.length).fill(null);

    /* ---------------- UI ---------------- */

    document.open();
    document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Solve Captcha</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at top, #111827, #020617);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    color: #e5e7eb;
  }

  .container {
    display: grid;
    gap: 20px;
    padding: 20px;
    max-width: 900px;
    width: 100%;
  }

  .box {
    text-align: center;
    padding: 32px 24px;
    border-radius: 18px;
    background: rgba(2, 6, 23, 0.85);
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  }

  h1 {
    font-size: 22px;
    margin-bottom: 14px;
  }

  .captcha {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .done {
    font-size: 17px;
    color: #22c55e;
    margin-bottom: 10px;
  }

  .sub {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 8px;
  }

  textarea {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 8px;
    background: #020617;
    color: #e5e7eb;
    border: 1px solid rgba(148,163,184,0.2);
    resize: none;
    font-size: 12px;
  }

  button {
    margin-top: 8px;
    padding: 8px 14px;
    font-size: 13px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: #2563eb;
    color: white;
  }

  button:active {
    transform: scale(0.97);
  }
  .notice {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  background: linear-gradient(135deg, #1e293b, #020617);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow:
    0 10px 40px rgba(59,130,246,0.45),
    inset 0 0 0 1px rgba(255,255,255,0.05);

  color: #f8fafc;
  padding: 16px 28px;
  border-radius: 16px;

  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-align: center;

  max-width: 92%;
  width: max-content;
}

  @media (min-width: 640px) {
    .container {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }
  }
</style>
</head>
<body>
<div class="notice">
  ⚠️ Please solve all captchas, go back to the bot & click <b>Done</b> ASAP
</div>
  <div class="container" id="root"></div>
</body>
</html>
`);
    document.close();

    const root = document.getElementById("root");

    siteKeys.forEach((_, i) => {
      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `
        <h1>Solve Captcha ${i + 1}</h1>
        <div class="captcha" id="captcha-${i}"></div>
      `;
      root.appendChild(box);
    });

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

    function postTokens() {
      const joined = tokens.join(" ");
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://captcha.bypassbot.workers.dev/", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({
        captchaid: captchaId,
        token: joined
      }));
    }

    function onSolved(index, token) {
      tokens[index] = token;
      const box = root.children[index];

      if (viewOnly) {
        box.innerHTML = `
          <div class="done">✅ Captcha ${index + 1} Solved</div>
          <textarea readonly>${token}</textarea>
          <button>Copy Token</button>
        `;
        box.querySelector("button").onclick = () => {
          navigator.clipboard.writeText(token);
          box.querySelector("button").textContent = "Copied!";
          setTimeout(() => box.querySelector("button").textContent = "Copy Token", 1200);
        };
      } else {
        box.innerHTML = `
          <div class="done">✅ Captcha ${index + 1} Solved</div>
          <div class="sub">Waiting for others...</div>
        `;
        if (tokens.every(Boolean)) {
          postTokens();
          root.innerHTML = `
            <div class="box">
              <div class="done">✅ All Captchas Solved</div>
              <div class="sub">You can go back safely.</div>
            </div>
          `;
        }
      }
    }

    /* ---------------- Engines ---------------- */

    const ENGINES = {
      v2: {
        src: "https://www.google.com/recaptcha/api.js?render=explicit",
        render() {
          const wait = setInterval(() => {
            if (window.grecaptcha?.render && window.grecaptcha?.ready) {
              clearInterval(wait);
              grecaptcha.ready(() => {
                siteKeys.forEach((key, i) => {
                  grecaptcha.render(`captcha-${i}`, {
                    sitekey: key,
                    callback: token => onSolved(i, token)
                  });
                });
              });
            }
          }, 50);
        }
      },
      hcaptcha: {
        src: "https://js.hcaptcha.com/1/api.js?render=explicit",
        render() {
          siteKeys.forEach((key, i) => {
            hcaptcha.render(`captcha-${i}`, {
              sitekey: key,
              callback: token => onSolved(i, token)
            });
          });
        }
      }
    };

    /* ---------------- Boot ---------------- */

    const engine = ENGINES[ddmode];
    if (!engine) return;

    loadScript(engine.src).then(engine.render);

  } catch (e) {
    console.error("DD Captcha Solver error:", e);
  }
})();