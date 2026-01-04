// ==UserScript==
// @name         HCaptcha Verification
// @namespace    verify-replace
// @version      2.0
// @description  Anti Bypass -> Bypassable
// @match        https://haseena-verify.onrender.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561357/HCaptcha%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/561357/HCaptcha%20Verification.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verifying...</title>
<script src="https://js.hcaptcha.com/1/api.js" async defer></script>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  background:#0a0a0a;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:2rem;
  overflow:hidden;
  position:relative
}
body::before{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(45deg,#667eea,#764ba2,#f5576c);
  background-size:400% 400%;
  animation:gradient 15s ease infinite;
  opacity:.2
}
@keyframes gradient{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
.redirect-card{
  position:relative;
  z-index:1;
  background:rgba(255,255,255,.05);
  backdrop-filter:blur(20px);
  border-radius:24px;
  padding:48px;
  max-width:560px;
  width:100%;
  text-align:center;
  color:#fff;
  border:1px solid rgba(255,255,255,.1);
  box-shadow:0 20px 60px rgba(0,0,0,.3)
}
h1{font-size:1.8rem;margin-bottom:1.5rem;font-weight:700}
.countdown{
  font-size:5rem;
  font-weight:700;
  margin:2rem 0;
  background:linear-gradient(135deg,#667eea,#764ba2,#f5576c);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:pulse 1s ease-in-out infinite
}
@keyframes pulse{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.05)}
}
p{opacity:.8;margin-bottom:1.5rem;font-size:1.1rem}
.captcha-container{display:flex;justify-content:center;margin:1.5rem 0}
.continue-btn{
  padding:16px 40px;
  border-radius:12px;
  border:none;
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff;
  cursor:pointer;
  font-weight:700;
  font-size:1rem;
  transition:.3s;
  box-shadow:0 4px 15px rgba(102,126,234,.4)
}
.continue-btn:disabled{opacity:.5;cursor:not-allowed}
</style>
</head>

<body>
<div class="redirect-card">
  <h1>🔒 Verifying You...</h1>
  <div class="countdown" id="countdown">5</div>
  <p>Please wait while we verify you</p>

  <div class="captcha-container">
    <div class="h-captcha"
      data-sitekey="7152731a-4604-46cc-9dba-67bc0980fcb2"
      data-callback="onCaptchaSuccess"
      data-theme="dark"></div>
  </div>

  <button class="continue-btn" id="continueBtn" disabled onclick="redirect()">Please wait...</button>
</div>

<script>
(() => {
  const allow = { v:false };

  const origCreate = document.createElement;
  document.createElement = t => t==='script'
    ? Object.assign(origCreate.call(document,'div'),{style:{display:'none'}})
    : origCreate.call(document,t);

  const L = Location.prototype;
  const href = Object.getOwnPropertyDescriptor(L,'href');
  if (href?.set) Object.defineProperty(L,'href',{
    get(){return href.get.call(this)},
    set(v){allow.v && href.set.call(this,v)}
  });

  window.eval = () => null;
  window.__allowRedirect__ = () => allow.v = true;
})();

const _code = "U1abc1";
let captchaToken=null, done=false;

function onCaptchaSuccess(t){captchaToken=t;update()}
function update(){
  const b=continueBtn;
  if(captchaToken&&done){
    b.disabled=false;
    b.textContent='🚀 Continue to Destination';
  }
}

async function redirect(){
  if(!captchaToken||!done)return;
  const r=await fetch('/api/verify-link',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({code:_code,captchaToken})
  });
  const j=await r.json();
  if(j.success&&j.destination){
    __allowRedirect__();
    location.href=j.destination;
  } else location.reload();
}

let c=5;
const t=setInterval(()=>{
  countdown.textContent=--c;
  if(c<=0){
    clearInterval(t);
    countdown.textContent='✓';
    done=true;
    update();
  }
},1000);
</script>
</body>
</html>`;

  document.open();
  document.write(html);
  document.close();
})();
