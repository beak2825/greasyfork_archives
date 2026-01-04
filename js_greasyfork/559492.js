// ==UserScript==
// @author       fr0stb1rd
// @namespace    http://tampermonkey.net/
// @version      1.6
// @match        *://bt4gprx.com/*
// @match        *://bt4g.com/*
// @match        *://bt4g.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bt4gprx.com
// @grant        none
// @license      MIT
// @name         BT4G Magnet Link Converter
// @name:zh-CN   BT4G 磁力链接转换器
// @name:zh-TW   BT4G 磁力連結轉換器
// @name:ja      BT4G マグネットリンクコンバーター
// @name:ko      BT4G 마그넷 링크 변환기
// @name:es      Convertidor de Enlace Magnético BT4G
// @name:fr      Convertisseur de Lien Magnet BT4G
// @name:de      BT4G Magnet-Link-Konverter
// @name:ru      Конвертер Magnet-ссылок BT4G
// @name:pt      Conversor de Link Magnético BT4G
// @name:pt-BR   Conversor de Link Magnético BT4G
// @name:it      Convertitore di Link Magnetici BT4G
// @name:pl      Konwerter Linków Magnetycznych BT4G
// @name:nl      BT4G Magneet Link Converter
// @name:tr      BT4G Magnet Link Dönüştürücü
// @name:ar      محول رابط المغناطيس BT4G
// @name:id      Konverter Tautan Magnet BT4G
// @name:vi      Bộ chuyển đổi liên kết Magnet BT4G
// @name:th      ตัวแปลงลิงก์แม่เหล็ก BT4G
// @name:cs      Převodník magnetických odkazů BT4G
// @name:uk      Конвертер магнітних посилань BT4G
// @name:sv      BT4G Magnet Link Converter
// @name:da      BT4G Magnet Link Converter
// @name:fi      BT4G Magnet Link Converter
// @name:el      Μετατροπέας συνδέσμου μαγνήτη BT4G
// @name:hu      BT4G Magnet Link konverter
// @name:ro      Convertor de link-uri magnet BT4G
// @name:sk      Prevodník magnetických odkazov BT4G
// @name:he      ממיר קישור מגנט BT4G
// @name:hi      BT4G चुंबक लिंक कनवर्टर
// @description  Converts download links on bt4gprx.com, bt4g.com and bt4g.org to magnet links and copies them to clipboard on click.
// @description:zh-CN  将 bt4gprx.com, bt4g.com 和 bt4g.org 上的下载链接转换为磁力链接，并在点击时复制到剪贴板。
// @description:zh-TW  將 bt4gprx.com, bt4g.com 和 bt4g.org 上的下載連結轉換為磁力連結，並在點擊時複製到剪貼板。
// @description:ja      bt4gprx.com, bt4g.com, bt4g.org のダウンロードリンクをマグネットリンクに変換し、クリックでクリップボードにコピーします。
// @description:ko      bt4gprx.com, bt4g.com 및 bt4g.org의 다운로드 링크를 마그넷 링크로 변환하고 클릭 시 클립보드에 복사합니다。
// @description:es      Convierte los enlaces de descarga en bt4gprx.com, bt4g.com y bt4g.org a enlaces magnéticos y los copia al portapapeles al hacer clic.
// @description:fr      Convertit les liens de téléchargement sur bt4gprx.com, bt4g.com et bt4g.org en liens magnétiques et les copie dans le presse-papiers au clic.
// @description:de      Wandelt Download-Links auf bt4gprx.com, bt4g.com und bt4g.org in Magnet-Links um und kopiert sie beim Anklicken in die Zwischenablage.
// @description:ru      Конвертирует ссылки для скачивания на bt4gprx.com, bt4g.com и bt4g.org в magnet-ссылки и копирует их в буфер обмена при нажатии.
// @description:pt      Converte links de download no bt4gprx.com, bt4g.com e bt4g.org em links magnéticos e os copia para a área de transferência ao clicar.
// @description:pt-BR   Converte links de download no bt4gprx.com, bt4g.com e bt4g.org em links magnéticos e os copia para a área de transferência ao clicar.
// @description:it      Converte i link di download su bt4gprx.com, bt4g.com e bt4g.org in link magnetici e li copia negli appunti al clic.
// @description:pl      Konwertuje linki do pobierania na bt4gprx.com, bt4g.com i bt4g.org na linki magnetyczne i kopiuje je do schowka po kliknięciu.
// @description:nl      Zet downloadlinks op bt4gprx.com, bt4g.com en bt4g.org om in magneetlinks en kopieert ze naar het klembord bij klikken.
// @description:tr      bt4gprx.com, bt4g.com ve bt4g.org üzerindeki indirme linklerini magnet linklerine dönüştürür ve tıklayınca panoya kopyalar.
// @description:ar      يحول روابط التنزيل على bt4gprx.com و bt4g.com و bt4g.org إلى روابط مغناطيسية وينسخها إلى الحافظة عند النقر。
// @description:id      Mengubah tautan unduhan di bt4gprx.com, bt4g.com, dan bt4g.org menjadi tautan magnet dan menyalinnya ke papan klip saat diklik.
// @description:vi      Chuyển đổi liên kết tải xuống trên bt4gprx.com, bt4g.com và bt4g.org thành liên kết magnet và sao chép vào bộ nhớ tạm khi nhấp.
// @description:th      แปลงลิงก์ดาวน์โหลดบน bt4gprx.com, bt4g.com และ bt4g.org เป็นลิงก์แม่เหล็กและคัดลอกไปยังคลิปบอร์ดเมื่อคลิก
// @description:cs      Převede odkazy na stažení na bt4gprx.com, bt4g.com a bt4g.org na magnetické odkazy a po kliknutí je zkopíruje do schránky.
// @description:uk      Перетворює посилання для завантаження на bt4gprx.com, bt4g.com та bt4g.org на магнітні посилання та копіює їх у буфер обміну при натисканні.
// @description:sv      Konverterar nedladdningslänkar på bt4gprx.com, bt4g.com och bt4g.org till magnetlänkar och kopierar dem till urklipp vid klick.
// @description:da      Konverterer downloadlinks på bt4gprx.com, bt4g.com og bt4g.org til magnetlinks og kopierer dem til udklipsholderen ved klik.
// @description:fi      Muuntaa bt4gprx.com-, bt4g.com- ja bt4g.org-sivustojen latauslinkit magneettilinkeiksi ja kopioi ne leikepöydälle napsautettaessa.
// @description:el      Μετατρέπει τους συνδέσμους λήψης στα bt4gprx.com, bt4g.com και bt4g.org σε συνδέσμους μαγνήτη και τους αντιγράφει στο πρόχειρο με το κλικ.
// @description:hu      A bt4gprx.com, bt4g.com és bt4g.org letöltési linkjeit magnet linkekké alakítja, és kattintáskor a vágólapra másolja őket.
// @description:ro      Convertește linkurile de descărcare de pe bt4gprx.com, bt4g.com și bt4g.org în linkuri magnet și le copiază în clipboard la clic.
// @description:sk      Prevedie odkazy na stiahnutie na bt4gprx.com, bt4g.com a bt4g.org na magnetické odkazy a po kliknutí ich skopíruje do schránky.
// @description:he      ממיר קישורי הורדה ב-bt4gprx.com, bt4g.com ו-bt4g.org לקישורי מגנט ומעתיק אותם ללוח בעת לחיצה.
// @description:hi      bt4gprx.com, bt4g.com और bt4g.org पर डाउनलोड लिंक को चुंबक लिंक में परिवर्तित करता है और क्लिक करने पर उन्हें क्लिपबोर्ड पर कॉपी करता है।
// @downloadURL https://update.greasyfork.org/scripts/559492/BT4G%20Magnet%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/559492/BT4G%20Magnet%20Link%20Converter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const trackers = [
        "udp://tracker.openbittorrent.com:80",
        "udp://opentor.org:2710",
        "udp://tracker.ccc.de:80",
        "udp://tracker.blackunicorn.xyz:6969",
        "udp://tracker.coppersurfer.tk:6969",
        "udp://tracker.leechers-paradise.org:6969",
        "udp://tracker.opentrackr.org:1337",
        "udp://explodie.org:6969/announce",
        "udp://open.demonii.com:1337/announce",
        "udp://open.demonoid.ch:6969/announce",
        "udp://open.stealth.si:80/announce",
        "udp://p4p.arenabg.com:1337/announce",
        "udp://retracker.lanta.me:2710/announce",
        "udp://retracker01-msk-virt.corbina.net:80/announce",
        "udp://run.publictracker.xyz:6969/announce",
        "udp://tr4ck3r.duckdns.org:6969/announce",
        "udp://tracker-udp.gbitt.info:80/announce",
        "udp://tracker.0x7c0.com:6969/announce",
        "udp://tracker.bittor.pw:1337/announce",
        "udp://tracker.gmi.gd:6969/announce",
        "udp://tracker.opentrackr.org:1337/announce",
        "udp://tracker.qu.ax:6969/announce",
        "udp://tracker.theoks.net:6969/announce",
        "udp://tracker.therarbg.to:6969/announce",
        "udp://tracker.torrent.eu.org:451/announce",
        "udp://tracker.tryhackx.org:6969/announce",
        "udp://tracker2.dler.org:80/announce",
    ];

    function convertLinks() {
        const links = document.querySelectorAll('a[href*="downloadtorrentfile.com/hash/"]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/\/hash\/([a-fA-F0-9]+)/);

            if (match && match[1]) {
                const hash = match[1];
                const trackerParams = trackers.map(t => encodeURIComponent(t)).join('&tr=');
                const magnetLink = `magnet:?xt=urn:btih:${hash}&dn=&tr=${trackerParams}`;

                link.setAttribute('href', magnetLink);

                link.addEventListener('click', function (e) {
                    e.preventDefault();

                    navigator.clipboard.writeText(magnetLink).then(() => {
                        const originalText = link.innerHTML;
                        link.innerHTML = 'Copied!';

                        setTimeout(() => {
                            link.innerHTML = originalText;
                        }, 1500);
                    }).catch(err => {
                        console.error('Copy error:', err);
                    });
                });
            }
        });
    }

    convertLinks();
    window.addEventListener('load', convertLinks);
})();
