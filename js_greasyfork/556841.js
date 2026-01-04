// ==UserScript==
// @name         بلاك بورد جامعة الطائف – سليمان الهجامي
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @author       Suleiman Alhagami
// @icon         https://www.tu.edu.sa/Content/images/favicon.ico
// @description  سكربت احترافي يساعدك في دخول بلاك بورد جامعة الطائف.
// @match        https://*/*
// @run-at       document-start
// @homepage     https://github.com/limbonux
// @supportURL   https://github.com/limbonux
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556841/%D8%A8%D9%84%D8%A7%D9%83%20%D8%A8%D9%88%D8%B1%D8%AF%20%D8%AC%D8%A7%D9%85%D8%B9%D8%A9%20%D8%A7%D9%84%D8%B7%D8%A7%D8%A6%D9%81%20%E2%80%93%20%D8%B3%D9%84%D9%8A%D9%85%D8%A7%D9%86%20%D8%A7%D9%84%D9%87%D8%AC%D8%A7%D9%85%D9%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/556841/%D8%A8%D9%84%D8%A7%D9%83%20%D8%A8%D9%88%D8%B1%D8%AF%20%D8%AC%D8%A7%D9%85%D8%B9%D8%A9%20%D8%A7%D9%84%D8%B7%D8%A7%D8%A6%D9%81%20%E2%80%93%20%D8%B3%D9%84%D9%8A%D9%85%D8%A7%D9%86%20%D8%A7%D9%84%D9%87%D8%AC%D8%A7%D9%85%D9%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FLAG = "tu_blackboard_setup_done";
    const STEP = "tu_step";
    const EXTENSION_ID = "eppiocemhmnlbhjplcgkofciiegomcon";

    if (localStorage.getItem(FLAG)) return;
    if (!localStorage.getItem(STEP)) localStorage.setItem(STEP, "check");

    //-------------------------------------------------------------
    // Loader داخل الواجهة
    //-------------------------------------------------------------
    function miniLoader() {
        return `
            <div style="
                margin-top: 15px;
                font-size: 14px;
                color: #1b3e7a;
                font-weight: 600;
                display: flex;
                justify-content: center;
                gap: 8px;
            ">
                <span class="dot">●</span>
                <span class="dot">●</span>
                <span class="dot">●</span>
            </div>

            <style>
                .dot {
                    animation: blink 1.3s infinite;
                }
                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes blink {
                    0% { opacity: 0.2; }
                    50% { opacity: 1; }
                    100% { opacity: 0.2; }
                }
            </style>
        `;
    }

    //-------------------------------------------------------------
    // واجهة الرسائل
    //-------------------------------------------------------------
    function injectUI(html) {
        const c = document.createElement("div");
        c.innerHTML = html;
        document.body.appendChild(c);
    }

    function showUI(message, buttonText, onClick, loader = false) {

        injectUI(`
        <div id="tu_overlay"
             style="
                position: fixed; inset: 0; background: rgba(0,0,0,0.55);
                z-index: 999999999999; display: flex;
                justify-content: center; align-items: center;
                padding: 22px; direction: rtl;
                font-family: 'Tajawal', sans-serif;
             ">
            <div style="
                width: 100%; max-width: 450px;
                background: #ffffff; border-radius: 22px;
                padding: 32px 26px; text-align: center;
                box-shadow: 0 20px 55px rgba(0,0,0,0.25);
                animation: tu_fadeIn 0.4s ease-out;
                font-family: 'Tajawal', sans-serif;
            ">
                <img src="https://www.tu.edu.sa/Content/images/logo-light.png"
                     style="width: 180px; margin-bottom: 20px;" />

                <h2 style="font-size: 27px; margin-bottom: 16px; color: #1b3e7a; font-family: 'Tajawal', sans-serif; font-weight: 700;">
                    بلاك بورد جامعة الطائف
                </h2>

                <p style="font-size: 17px; color: #333; line-height: 2; margin-bottom: 28px; direction: rtl; unicode-bidi: plaintext;">
                    ${message}
                </p>

                <button id="tu_btn"
                        style="
                            width: 100%; padding: 14px 0; font-size: 18px;
                            border: none; border-radius: 14px;
                            background: linear-gradient(135deg,#1b3e7a,#2d57ae);
                            color: white; cursor: pointer;
                            font-family: 'Tajawal', sans-serif;
                            font-weight: 600;
                        ">
                    ${buttonText}
                </button>

                ${loader ? miniLoader() : ""}

                <p style="margin-top: 22px; font-size: 14px; color: #555;">
                    صُمّم ب💙 بواسطة <strong>سليمان الهجامي</strong>
                </p>
            </div>
        </div>

        <style>

         @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;500;700&display=swap');
        @keyframes tu_fadeIn {
            from { opacity:0; transform:scale(0.87); }
            to   { opacity:1; transform:scale(1); }
        }
        </style>
        `);

        document.getElementById("tu_btn").onclick = () => {
            document.getElementById("tu_overlay").remove();
            onClick();
        };
    }

    //-------------------------------------------------------------
    // Helpers
    //-------------------------------------------------------------
    async function checkExtension() {
        try {
            //await fetch(`chrome-extension://${EXTENSION_ID}/manifest.json`);
            return false;
        } catch { return false; }
    }

    async function checkIP() {
        try {
            const r = await fetch("https://ipapi.co/json");
            return await r.json();
        } catch {
            return { country: "??" };
        }
    }

    function openInBackground(url) {
    window.open(url, "_blank", "popup=yes,width=800,height=700,left=150,top=120");
}

    //-------------------------------------------------------------
    // النظام الرئيسي للخطوات
    //-------------------------------------------------------------
    async function runSteps() {

        const step = localStorage.getItem(STEP);

        //---------------------------------------------------------
        // STEP 1 — فحص الإضافة
        //---------------------------------------------------------
       if (step === "check") {

            const installed = await checkExtension();

            if (installed) {
                localStorage.setItem(STEP, "vpn_setup");
                return showUI(
                    `تم اكتشاف أن إضافة Urban VPN مثبتة بالفعل.<br>
                     تم فتح الإضافة لك في نافذة جديدة. قم بتهيئتها ثم عد لهذه الصفحة.`,
                    "متابعة",
                    () => {}
                );
            }


            localStorage.setItem(STEP, "store_wait");

            return showUI(
                `
                1️⃣ لم يتم العثور على إضافة Urban VPN<br>
                2️⃣ سيتم الآن فتح متجر الإضافة في نافذة جديدة<br>
                3️⃣ قم بالضغط على (Add to Chrome) ثم عد لهذه الصفحة
                `,
                "فتح متجر الإضافة",
                () => {
                   openInBackground("https://chromewebstore.google.com/detail/urban-vpn-proxy/eppiocemhmnlbhjplcgkofciiegomcon");
                    location.reload();

                }
            );
        }

        //---------------------------------------------------------
        // STEP 2 — بعد فتح المتجر (انتظار 10 ثوانٍ)
        //---------------------------------------------------------
        if (step === "store_wait") {

            return showUI(
                `
                بعد فتح متجر الإضافة:<br>
                1️⃣ اضغط على (Add to Chrome)<br>
                2️⃣ انتظر حتى يتم تثبيت الإضافة<br>
                سيتم الانتظار لمدة 10 ثوانٍ قبل الفحص التلقائي
                `,
                "ابدأ الانتظار",
                async () => {

                    await new Promise(r => setTimeout(r, 5000));
                    const installed = await checkExtension();

                    if (installed) {
                        localStorage.setItem(STEP, "vpn_instructions");
                        return location.reload();
                    }

                    return showUI(
                        `
                        لم يتم التأكد تلقائيًا من التثبيت<br>
                        هل قمت بتثبيت الإضافة الآن؟
                        `,
                        "نعم، الإضافة مثبتة",
                        () => {
                            localStorage.setItem(STEP, "vpn_instructions");
                            location.reload();
                        }
                    );
                },
                true
            );
        }

        //---------------------------------------------------------
        // STEP 3 — تعليمات تفعيل VPN
        //---------------------------------------------------------
        if (step === "vpn_instructions") {

            return showUI(
                `
                سيتم الآن فتح إضافة Urban VPN في نافذة جديدة<br>

                1️⃣ اختر الدولة: <strong>Saudi Arabia 🇸🇦</strong><br>
                2️⃣ اضغط زر التشغيل ▶️<br><br>
                3️⃣ انتظر حتى تظهر <strong>Connected</strong><br>

                ‼️إذا لم يتصل بالسيرفر من أول مرة، افتح أي تطبيق VPN في جهازك ثم حاول مجددًا."
                `,
                "فتح الإضافة الآن",
                () => {
                    window.open(`chrome-extension://${EXTENSION_ID}/popup/index.html`, "_blank");
                    localStorage.setItem(STEP, "vpn_check");
                    location.reload();
                }
            );
        }

        //---------------------------------------------------------
        // STEP 4 — فحص IP والتأكد من السعودية
        //---------------------------------------------------------
        if (step === "vpn_check") {

            return showUI(
                `اضغط متابعة لفحص عنوان IP والتأكد من أنك متصل بالسعودية`,
                "متابعة",
                async () => {

                    const data = await checkIP();

                    if (data.country === "SA") {

                        return showUI(
                            `
                            ✔ تم الاتصال بنجاح!<br>
                            🏙️ الدولة: <strong>${data.country_name}</strong><br>
                            🛣️ المدينة: <strong>${data.city}</strong><br>
                            😁 عنوان IP: <strong>${data.ip}</strong><br><br>

                            سيتم تحويلك إلى البلاك بورد الآن…
                            `,
                            "الانتقال الآن",
                            () => {
                                localStorage.setItem(FLAG, "done");
                                window.location.href = "https://lms.tu.edu.sa/";
                            }
                        );
                    }

                    showUI(
                        `
                        لم يتم الاتصال بالسعودية بعد<br>
                        1️⃣ افتح Urban VPN<br>
                        2️⃣ اختر Saudi Arabia<br>
                        3️⃣ اضغط ▶️ حتى تظهر Connected<br>
                        ثم عد إلى هنا واضغط إعادة المحاولة
                        `,
                        "إعادة المحاولة",
                        () => location.reload()
                    );
                },
                true
            );
        }
    }

    runSteps();

})();
