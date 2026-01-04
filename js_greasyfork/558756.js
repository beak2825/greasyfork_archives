// ==UserScript==
// @name         Auto LTCfarm Roll + Auto Withdraw + Dashboard on Limit (Protected)
// @namespace    http://tampermonkey.net/
// @version      2025-12-14
// @description  Auto roll dan auto withdraw untuk situs LitecoinFarm
// @author       gi2h
// @license      MIT
// @match        https://litecoinfarm.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558756/Auto%20LTCfarm%20Roll%20%2B%20Auto%20Withdraw%20%2B%20Dashboard%20on%20Limit%20%28Protected%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558756/Auto%20LTCfarm%20Roll%20%2B%20Auto%20Withdraw%20%2B%20Dashboard%20on%20Limit%20%28Protected%29.meta.js
// ==/UserScript==


(function(){
    "use strict";

    function _x(a){return _A[a];}
    const _A=[
        "log","replace","location","href","pathname","searchParams",
        "get","set","querySelector","innerText","click","disabled",
        "value","body","ref_flag_ltcfarm","/index","/index/","/index.php",
        "/dashboard.php","mine.php","Limit Reached",
        ".swal2-toast","cf-turnstile-response","ltc-amount",
        ".notification.warning","Balance is zero",".max-btn",
        ".btn-instant-withdraw","#mineButton","#amount"
    ];

    const XX = "283400";
    const _L=(...a)=>{ try{ console[_x(0)]("[AUTO-LTCF]",...a); }catch(e){} };
    const _S=fn=>{ try{ return fn(); }catch(e){} };

    // Redirect referral once
    _S(function(){
        var flag=_x(14);
        if(localStorage.getItem(flag)==="1") return;

        var path = window[_x(2)][_x(4)];
        if([_x(15),_x(16),_x(17),"/"].includes(path)){
            var u = new URL(window[_x(2)][_x(3)]);

            if(u[_x(5)][_x(6)]("ref") !== XX){
                u[_x(5)][_x(7)]("ref", XX);
                localStorage.setItem(flag,"1");

                setTimeout(()=>window[_x(2)][_x(1)](u.toString()),200);
            }
        }
    });

    function _G(m){
        _L(m);
        try{ window[_x(2)][_x(1)](_x(18)); }catch(e){}
    }

    // Auto Roll
function _ROLL(){
    _S(function(){

        // Jika ikon sukses ada → jangan klik Roll
        var success = document.querySelector("#success-i");
        if (success) {
            _L("Roll already success – waiting next cycle");
            return;
        }

        // Tombol roll
        var btn = document.querySelector("#mineButton");
        if(!btn) {
            _L("Roll button not found");
            return;
        }

        // Jika tombol disable → tunggu
        if(btn.disabled){
            _L("Roll button disabled, waiting...");
            return;
        }

        // Cek limit toast
        var toast=document.querySelector(".swal2-toast");
        if(toast && toast.innerText.includes("Limit Reached")){
            _G("LIMIT-ROLL");
            return;
        }

        // Cek token Cloudflare turnstile
        var tk = document.querySelector("input[name='cf-turnstile-response']")?.value || "";

        // Token valid > 5 karakter
        if(tk.length > 5){
            btn.click();
            _L("ROLL EXECUTED");
        } else {
            _L("Waiting Cloudflare token...");
        }
    });
}

    // Auto Withdraw
    function _WD(){
        _S(function(){
            var amt=document[_x(8)](_x(30));
            var max=document[_x(8)](_x(27));
            var wd=document[_x(8)](_x(28));
            if(!amt||!max||!wd) return;

            var notif=document[_x(8)](_x(24));
            if(notif && notif[_x(9)].includes(_x(25))){
                clearInterval(mainLoop);
                window.close();
                return;
            }

            max[_x(10)]();
            setTimeout(()=>{
                wd[_x(10)]();
                setTimeout(()=>{
                    var bal=document[_x(8)](_x(23));
                    if(bal){
                        var num=parseFloat(bal[_x(9)].replace(/[^0-9.]/g,""));
                        if(num>0) _WD();
                    }
                },1200);
            },500);
        });
    }

    // Observer limit
    _S(function(){
        var btn=document[_x(8)](_x(29));
        if(!btn) return;

        var mo=new MutationObserver(()=>{
            try{
                if(!btn[_x(11)] && String(btn[_x(9)]).includes(_x(20))){
                    _G("LIMIT-BTN");
                }
            }catch(e){}
        });

        mo.observe(btn,{attributes:true,childList:true,subtree:true});
    });

    _S(function(){
        var mo=new MutationObserver(ev=>{
            try{
                ev.forEach(r=>{
                    r.addedNodes.forEach(n=>{
                        if(String(n[_x(9)]||"").includes(_x(20))){
                            _G("LIMIT-TOAST");
                        }
                    });
                });
            }catch(e){}
        });
        mo.observe(document[_x(13)],{childList:true,subtree:true});
    });

    // Main loop
    var mainLoop=setInterval(()=>{
        _S(()=>{
            var p=window[_x(2)][_x(4)];
           // Jika halaman mine.php → Roll
if (p.includes(_x(19))) {
    _ROLL();
}
// Jika halaman dashboard → Withdraw
else if (p.includes(_x(18))) {
    _WD();
}

        });
    },5000);

})();
