// ==UserScript==
// @name         FB Messenger AutoResponder dengan Pilihan Template dan Toggle Start/Stop
// @namespace    http://fb.me/behesty7
// @version      1.3
// @description  Auto chat buyer/seller dengan template pilihan dan tombol toggle start/stop
// @author       Behesty
// @match        https://web.facebook.com/messages/*
// @match        https://www.facebook.com/messages/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547949/FB%20Messenger%20AutoResponder%20dengan%20Pilihan%20Template%20dan%20Toggle%20StartStop.user.js
// @updateURL https://update.greasyfork.org/scripts/547949/FB%20Messenger%20AutoResponder%20dengan%20Pilihan%20Template%20dan%20Toggle%20StartStop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;
    let mode = "buyer";
    let templateSet = "template1";
    let templateIndex = 0;
    let replyCount = 0;
    const maxReplies = 7;
    let sendInterval = null;

    // Template tersusun dalam objek agar mudah ditambah
    const templates = {
        buyer: {
            template1: [
                "cek harga",
                "yang bahan kayu jati kirim sampai blitar berapa?",
                "pembayaran apakah bisa cod?",
                "wah keren si kalo bisa sistem seprti ini,",
                "estimasi berapa hari sampai?",
                "ok boss, ditunggu ya barangnya",
                "kirim yang bagus ya"
            ],
            template2: [
                "Halo, saya tertarik dengan produk Anda.",
                "Untuk gambar pertama harga berapa?",
                "kalo kirimke jogaja bisa ga?",
                "pegirimannya via apa?",
                "aman ga barangnya kalo seperti itu?",
                "itu gratis ongkir kan ya?",
                "ok sip, pastikan barang sampai ya, saya tunggu"
            ],
            template3: [
                "kalo yg jati ada?",
                "cara prdernya bagaiimana?",
                "untuk pembayran?",
                "kalo yg datang ga sesuai gimana?",
                "walah ok , bagus kalo sistemnya seperti ini.",
                "mantap, saya tunggu barangnya ya"
            ]
        },
        seller: {
            template1: [
                "ada bosku",
                "model yang mana boss?",
                "full jati 2200 sampai depan rumah ka",
                "sistem pembayaran dilakukan setelah barang sapai ka, langsung sama supir yg nganter, pastikan juga dicek sebelum di bayar",
                "iya ka, ini juga biar sama enaknya",
                "estimasi di 3-5 hari ka.",
                "siap ka, terimaksih",
                "aman ka, kita proses pesanannya ya "
            ],
            template2: [
                "Terima kasih sudah menghubungi kami. silahkan diorder kaka",
                "jati finishing 2000 kaka.",
                "bisa banget ka, pembyaran nanti juga bisa COD ka",
                "untuk pengiriman nanti kita ada ekspedisi khusus ka",
                "aman ka, tenang, yg kaka perlu lakukan nanti cek dulu untuk memastikan kondisi barangnya, sesuai atau tidak.",
                "iya kaka, harga sudah termasuk ongkir, tidak ada tambahan lagi",
                "siap ka, kita pastikan barang sampai dengan selamat, terimaksih"
            ],
            template3: [
                "Pengen model yg mana bos ku?",
                "ada bos ku, siap untuk di kirm.",
                "cuckup isi nama dan alamat bos ku.",
                "untuk pembayaran nanti bisa cod boss ku",
                "Garansi uang kembali jika tidak sesuai ya boss ku.",
                "iya bosku, agar sama sama aman ja",
                "Terima kasih atas kepercayaan Anda."
            ]
        }
    };

    function createUI() {
        if (document.getElementById("autoResponderPanel")) return;
        const panel = document.createElement("div");
        panel.id = "autoResponderPanel";
        panel.style = "position:fixed;top:80px;right:20px;z-index:99999;background:#fff;border:1px solid #ccc;padding:10px;width:280px;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.2);border-radius:8px;";

        panel.innerHTML = `
            <label><b>Mode:</b>
                <select id="modeSelect" style="width:100%;margin-top:4px;">
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
            </label>
            <br/><br/>
            <label><b>Pilih Template:</b>
                <select id="templateSelect" style="width:100%;margin-top:4px;">
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                    <option value="template3">Template 3</option>
                </select>
            </label>
            <br/><br/>
            <button id="toggleBtn" style="width:100%;padding:8px;font-weight:bold;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;">Start</button>
            <br/><br/>
            <div><b>Log:</b></div>
            <div id="logBox" style="height:140px;overflow:auto;background:#f9f9f9;border:1px solid #ddd;padding:5px;font-size:12px;white-space:pre-wrap;"></div>
        `;

        document.body.appendChild(panel);

        document.getElementById("modeSelect").onchange = (e) => {
            mode = e.target.value;
            log(`Mode diganti ke: ${mode}`);
        };

        document.getElementById("templateSelect").onchange = (e) => {
            templateSet = e.target.value;
            log(`Template diganti ke: ${templateSet}`);
        };

        document.getElementById("toggleBtn").onclick = () => {
            if (isRunning) {
                stopBot();
            } else {
                startBot();
            }
        };
    }

    function log(msg) {
        const logBox = document.getElementById("logBox");
        if (!logBox) return;
        const time = new Date().toLocaleTimeString();
        logBox.innerHTML += `[${time}] ${msg}\n`;
        logBox.scrollTop = logBox.scrollHeight;
        console.log("BOT:", msg);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function sendMessage(text) {
        const input = document.querySelector('[contenteditable="true"]');
        if (!input) {
            log("❌ Input chat tidak ditemukan!");
            return;
        }

        input.innerHTML = "";
        const textNode = document.createTextNode(text);
        input.appendChild(textNode);

        const ev = new InputEvent("input", {
            bubbles: true,
            cancelable: true,
            inputType: "insertText",
            data: text
        });
        input.dispatchEvent(ev);

        log("⌛ Menunggu sebelum kirim...");

        await delay(700);

        const sendBtn = document.querySelector('div[aria-label*="Tekan Enter untuk mengirim"], div[aria-label*="Send"], div[aria-label*="Enter"]');

        if (sendBtn) {
            sendBtn.click();
            log("➡️ Mengirim (via tombol): " + text);
        } else {
            const sendEnter = () => {
                ["keydown", "keypress", "keyup"].forEach(evType => {
                    const kev = new KeyboardEvent(evType, {
                        bubbles: true,
                        cancelable: true,
                        key: "Enter",
                        code: "Enter"
                    });
                    input.dispatchEvent(kev);
                });
            };
            sendEnter();
            log("➡️ Mengirim (via Enter #1): " + text);
            await delay(300);
            sendEnter();
            log("➡️ Mengirim (via Enter #2): " + text);
        }
    }

    async function autoSendTemplate() {
        if (!isRunning) return;

        const templateArray = templates[mode][templateSet] || [];

        if (templateIndex >= templateArray.length || replyCount >= maxReplies) {
            log("✅ Template selesai / mencapai batas.");
            stopBot();
            return;
        }

        const text = templateArray[templateIndex];
        await sendMessage(text);
        templateIndex++;
        replyCount++;
    }

    function startBot() {
        if (isRunning) return;
        isRunning = true;
        templateIndex = 0;
        replyCount = 0;
        log("🚀 Bot dimulai, mode: " + mode + ", template: " + templateSet);

        // Update tombol jadi Stop
        const btn = document.getElementById("toggleBtn");
        if (btn) {
            btn.textContent = "Stop";
            btn.style.backgroundColor = "#d9534f"; // merah
        }

        // Kirim pesan pertama langsung
        autoSendTemplate();

        // Set interval kirim pesan setiap 3000ms (3 detik)
        sendInterval = setInterval(() => {
            autoSendTemplate();
        }, 12000);
    }

    function stopBot() {
        isRunning = false;
        if (sendInterval) {
            clearInterval(sendInterval);
            sendInterval = null;
        }
        log("⛔ Bot dihentikan.");

        // Update tombol jadi Start
        const btn = document.getElementById("toggleBtn");
        if (btn) {
            btn.textContent = "Start";
            btn.style.backgroundColor = "#4CAF50"; // hijau
        }
    }

    // Buat UI setelah halaman siap
    setTimeout(createUI, 2000);
})();
