// ==UserScript==
// @name         e-Okul Kitaplık Botu (Excel Listenize Özel)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Excel'deki 4 ve 0 kodlarını otomatik dönüştürerek kitapları girer.
// @author       hunter216
// @match        https://e-okul.meb.gov.tr/IlkOgretim/OKL/IOK19001.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meb.gov.tr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562107/e-Okul%20Kitapl%C4%B1k%20Botu%20%28Excel%20Listenize%20%C3%96zel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562107/e-Okul%20Kitapl%C4%B1k%20Botu%20%28Excel%20Listenize%20%C3%96zel%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ARAYÜZ OLUŞTURMA ---
    function arayuzOlustur() {
        if (document.getElementById('eOkulBotPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'eOkulBotPanel';
        panel.style.cssText = `
            position: fixed; top: 10px; right: 10px; width: 340px;
            background: #ecf0f1; border: 2px solid #2980b9; z-index: 99999;
            padding: 10px; font-family: sans-serif; box-shadow: 0 0 15px rgba(0,0,0,0.3);
            font-size: 12px; border-radius: 5px;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #2980b9; border-bottom:1px solid #bdc3c7; padding-bottom:5px;">📚 Akıllı Kitaplık Botu v1.3</h3>
            <div style="margin-bottom:10px; background:#fff; padding:8px; border:1px solid #ccc; border-radius:3px;">
                <strong>Durum:</strong> <span id="botStatus" style="font-weight:bold; color:#7f8c8d;">Beklemede</span><br>
                <strong>Sıradaki:</strong> <span id="siradakiKitap" style="color:#e67e22;">-</span><br>
                <strong>Kalan:</strong> <span id="kalanSayisi" style="font-weight:bold;">0</span>
            </div>
            <textarea id="excelData" placeholder="Excel'deki listenizi (başlıklar hariç) buraya yapıştırın.&#10;Kod 4 -> Çocuk Kitapları&#10;Kod 0 -> Hikaye olarak işlenecektir." style="width: 100%; height: 120px; box-sizing:border-box; font-size:11px; border:1px solid #bdc3c7; padding:5px;"></textarea>
            <div style="margin-top: 10px; display: flex; gap: 5px;">
                <button id="btnBaslat" style="flex: 1; padding: 8px; background: #27ae60; color: white; border: none; cursor: pointer; border-radius:3px; font-weight:bold;">BAŞLAT</button>
                <button id="btnDurdur" style="flex: 1; padding: 8px; background: #c0392b; color: white; border: none; cursor: pointer; border-radius:3px; font-weight:bold;">SIFIRLA</button>
            </div>
            <p style="font-size: 10px; margin-top: 5px; color: #7f8c8d;">* Sınıfı seçip 'Listele' dedikten sonra başlatın.</p>
        `;

        document.body.appendChild(panel);

        document.getElementById('btnBaslat').onclick = baslat;
        document.getElementById('btnDurdur').onclick = durdur;

        durumGuncelle();
    }

    // --- DURUM GÜNCELLEME ---
    function durumGuncelle() {
        const veri = JSON.parse(localStorage.getItem('eOkul_Kitap_Listesi') || '[]');
        const aktif = localStorage.getItem('eOkul_Bot_Aktif') === 'true';

        const spanStatus = document.getElementById('botStatus');
        const spanKalan = document.getElementById('kalanSayisi');
        const spanSiradaki = document.getElementById('siradakiKitap');

        if(spanStatus && spanKalan) {
            spanKalan.innerText = veri.length;
            if(veri.length > 0) spanSiradaki.innerText = veri[0].ad;

            if (aktif) {
                spanStatus.innerText = "İşleniyor...";
                spanStatus.style.color = "#27ae60";
                document.getElementById('excelData').disabled = true;
            } else {
                spanStatus.innerText = "Veri Bekleniyor";
                spanStatus.style.color = "#7f8c8d";
                document.getElementById('excelData').disabled = false;
            }
        }
    }

    // --- VERİ HAZIRLAMA ---
    function baslat() {
        const rawData = document.getElementById('excelData').value.trim();
        if (!rawData) {
            alert("Lütfen Excel verisini yapıştırın!");
            return;
        }

        const satirlar = rawData.split('\n');
        const liste = [];

        // Excel verisini işle ve DÖNÜŞTÜR
        for (let satir of satirlar) {
            const sutunlar = satir.split('\t'); // Tab ile ayrılmış veri
            if (sutunlar.length >= 4) {

                let grupData = sutunlar[0].trim();
                let turData = sutunlar[1].trim();
                let sayfaData = sutunlar[2].trim();
                let adData = sutunlar[3].trim();

                // --- OTOMATİK DÜZELTME KISMI ---
                if (turData === '0') {
                    turData = 'HİKAYE'; // Varsayılan olarak HİKAYE seçilecek
                }

                liste.push({
                    grup: grupData,
                    tur: turData,
                    sayfa: sayfaData,
                    ad: adData
                });
            }
        }

        if (liste.length === 0) {
            alert("Veri anlaşılamadı. Excel'den kopyaladığınıza emin misiniz?");
            return;
        }

        if(!confirm(liste.length + " adet kitap eklenecek.\n\nÖNEMLİ: Exceldeki '0' türleri 'HİKAYE' olarak işlenecek.\n\nBaşlatılsın mı?")) return;

        localStorage.setItem('eOkul_Kitap_Listesi', JSON.stringify(liste));
        localStorage.setItem('eOkul_Bot_Aktif', 'true');
        localStorage.setItem('eOkul_Bot_Asama', '1');

        islemYap();
    }

    function durdur() {
        if(confirm("İşlem durdurulup liste temizlenecek?")) {
            localStorage.removeItem('eOkul_Kitap_Listesi');
            localStorage.removeItem('eOkul_Bot_Aktif');
            localStorage.removeItem('eOkul_Bot_Asama');
            location.reload();
        }
    }

    // --- İŞLEM DÖNGÜSÜ ---
    function islemYap() {
        const aktif = localStorage.getItem('eOkul_Bot_Aktif') === 'true';
        if (!aktif) return;

        const liste = JSON.parse(localStorage.getItem('eOkul_Kitap_Listesi') || '[]');
        if (liste.length === 0) {
            alert("✅ Bitti! Tüm kitaplar eklendi.");
            localStorage.removeItem('eOkul_Bot_Aktif');
            location.reload();
            return;
        }

        const kitap = liste[0];
        const asama = localStorage.getItem('eOkul_Bot_Asama');
        durumGuncelle();

        // AŞAMA 1: GRUP SEÇİMİ (Örn: 4 - ÇOCUK KİTAPLARI)
        if (asama === '1') {
            const ddlGrup = document.getElementById('ddlKitapTur');
            if(!ddlGrup) return;

            ddlGrup.value = kitap.grup;

            if (ddlGrup.selectedIndex === -1) {
                 console.log("Grup kodu bulunamadı, metin aranıyor...");
                 for (let i = 0; i < ddlGrup.options.length; i++) {
                    if (ddlGrup.options[i].text.includes("ÇOCUK") && kitap.grup == '4') {
                        ddlGrup.selectedIndex = i;
                        break;
                    }
                }
            }

            localStorage.setItem('eOkul_Bot_Asama', '2');
            setTimeout(() => { __doPostBack('ddlKitapTur',''); }, 300);
        }

        // AŞAMA 2: TÜR, SAYFA, AD GİRİŞİ ve KAYDET
        else if (asama === '2') {
            const ddlTur = document.getElementById('ddlKitapAdi');
            const txtSayfa = document.getElementById('txtSayfaSayisi');
            const txtAd = document.getElementById('txtAciklama');

            // Tür Seçimi (Örn: HİKAYE)
            let turSecildi = false;
            for (let i = 0; i < ddlTur.options.length; i++) {
                if (ddlTur.options[i].text.toUpperCase().includes(kitap.tur.toUpperCase())) {
                    ddlTur.selectedIndex = i;
                    turSecildi = true;
                    break;
                }
            }
            if (!turSecildi) {
                console.log(kitap.tur + " bulunamadı, varsayılan seçiliyor.");
                if (ddlTur.options.length > 1) ddlTur.selectedIndex = 1;
            }

            txtSayfa.value = kitap.sayfa;
            txtAd.value = kitap.ad;

            liste.shift();
            localStorage.setItem('eOkul_Kitap_Listesi', JSON.stringify(liste));
            localStorage.setItem('eOkul_Bot_Asama', '1');

            setTimeout(() => { AlanKontrolveKayit(); }, 500);
        }
    }

    window.onload = function() {
        arayuzOlustur();
        if (localStorage.getItem('eOkul_Bot_Aktif') === 'true') {
            setTimeout(islemYap, 800);
        }
    };

})();