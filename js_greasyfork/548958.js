// ==UserScript==
// @name        Scribd Downloader Button
// @name:en     Scribd Downloader Button (Open Download Link)
// @name:es     Botón de Descarga de Scribd (Abrir enlace de descarga)
// @name:fr     Bouton de téléchargement Scribd (Ouvrir le lien de téléchargement)
// @name:de     Scribd Download Button (Download-Link öffnen)
// @name:zh-CN  Scribd下载按钮（打开下载链接）
// @name:zh-TW  Scribd下載按鈕（打開下載鏈接）
// @name:it     Bottone di download Scribd (Apri il link di download)
// @name:pt-BR  Botão de Download Scribd (Abrir link de download)
// @name:ru     Кнопка загрузки Scribd (Открыть ссылку для загрузки)
// @name:ja     Scribdダウンロードボタン（ダウンロードリンクを開く）
// @name:ko     Scribd 다운로드 버튼 (다운로드 링크 열기)
// @name:pl     Przycisk pobierania Scribd (Otwórz link do pobrania)
// @name:nl     Scribd-downloadknop (Open downloadlink)
// @name:sv     Scribd nedladdningsknapp (Öppna nedladdningslänk)
// @name:tr     Scribd İndirme Butonu (İndirme Bağlantısını Aç)
// @name:ar     زر تحميل Scribd (افتح رابط التنزيل)
// @name:he     כפתור הורדה של Scribd (פתח קישור להורדה)
// @name:da     Scribd Download-knap (Åbn downloadlink)
// @name:id     Tombol Unduh Scribd (Buka tautan unduhan)
// @name:fi     Scribd-latauspainike (Avaa latauslinkki)
// @name:th     ปุ่มดาวน์โหลด Scribd (เปิดลิงก์ดาวน์โหลด)
// @description       Adds a button to the Scribd page to open a modified download link for easier access.
// @description:en     Adds a button to the Scribd page to open a modified download link for easier access.
// @description:es     Añade un botón a la página de Scribd para abrir un enlace de descarga modificado para un acceso más fácil.
// @description:fr     Ajoute un bouton sur la page Scribd pour ouvrir un lien de téléchargement modifié pour un accès plus facile.
// @description:de     Fügt der Scribd-Seite eine Schaltfläche hinzu, um einen modifizierten Download-Link für einen einfacheren Zugriff zu öffnen.
// @description:zh-CN  在Scribd页面添加一个按钮，打开一个修改过的下载链接，方便访问。
// @description:zh-TW  在Scribd頁面上添加一個按鈕，打開修改過的下載鏈接，方便訪問。
// @description:it     Aggiunge un pulsante alla pagina di Scribd per aprire un link di download modificato per un accesso più facile.
// @description:pt-BR  Adiciona um botão na página do Scribd para abrir um link de download modificado para facilitar o acesso.
// @description:ru     Добавляет кнопку на страницу Scribd для открытия измененной ссылки для скачивания для удобного доступа.
// @description:ja     Scribdページにボタンを追加して、ダウンロードリンクを簡単にアクセスできるように変更します。
// @description:ko     Scribd 페이지에 버튼을 추가하여 수정된 다운로드 링크를 쉽게 액세스할 수 있도록 합니다.
// @description:pl     Dodaje przycisk na stronie Scribd, aby otworzyć zmodyfikowany link do pobrania w celu łatwiejszego dostępu.
// @description:nl     Voegt een knop toe aan de Scribd-pagina om een gemodificeerde downloadlink voor gemakkelijker toegang te openen.
// @description:sv     Lägger till en knapp på Scribd-sidan för att öppna en modifierad nedladdningslänk för enklare åtkomst.
// @description:tr     Scribd sayfasına, daha kolay erişim için değiştirilmiş bir indirme bağlantısı açan bir düğme ekler.
// @description:ar     يضيف زرًا إلى صفحة Scribd لفتح رابط التنزيل المعدل لتسهيل الوصول.
// @description:he     מוסיף כפתור לדף Scribd כדי לפתוח קישור הורדה מותאם לשם גישה קלה יותר.
// @description:da     Tilføjer en knap til Scribd-siden for at åbne et ændret downloadlink for nemmere adgang.
// @description:id     Menambahkan tombol pada halaman Scribd untuk membuka tautan unduhan yang dimodifikasi agar lebih mudah diakses.
// @description:fi     Lisää painikkeen Scribd-sivulle, joka avaa muokatun latauslinkin helpompaa käyttöä varten.
// @description:th     เพิ่มปุ่มบนหน้า Scribd เพื่อเปิดลิงก์ดาวน์โหลดที่ปรับเปลี่ยนสำหรับการเข้าถึงที่ง่ายขึ้น。
// @namespace   https://scribd.downloader.tips/
// @version     1.0.1
// @license MIT
// @author      Totapunk
// @match       https://*.scribd.com/document/*
// @grant       GM_addStyle
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/548958/Scribd%20Downloader%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548958/Scribd%20Downloader%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Traducciones para el botón "Descarga"
    const translations = {
        es: "Descarga",
        en: "Download",
        fr: "Télécharger",
        de: "Herunterladen",
        it: "Scarica",
        pt: "Baixar",
        ru: "Скачать",
        zh: "下载",
        ja: "ダウンロード",
        ko: "다운로드",
        ar: "تنزيل",
        nl: "Downloaden",
        tr: "İndir",
        pl: "Pobierz",
        sv: "Ladda ner",
        no: "Last ned",
        da: "Download",
        fi: "Lataa",
        el: "Λήψη",
        hi: "डाउनलोड"
    };

    // Función para obtener la traducción según el idioma del navegador
    function getTranslation() {
        const userLanguage = navigator.language.slice(0, 2); // Obtener los primeros 2 caracteres del idioma
        return translations[userLanguage] || translations['es']; // Default a español si no está traducido
    }

    // Crear el botón
    const boton = document.createElement('button');
    boton.textContent = getTranslation();
    boton.style.position = 'fixed';
    boton.style.top = '10px';
    boton.style.right = '10px'; // Colocar en la esquina superior derecha
    boton.style.padding = '10px 10px'; // Botón más pequeño
    boton.style.zIndex = '9999';
    boton.style.backgroundColor = '#d1254c';
    boton.style.color = 'white';
    boton.style.border = 'none';
    boton.style.borderRadius = '5px';
    boton.style.cursor = 'pointer';
    boton.style.fontSize = '12px'; // Tamaño de fuente más pequeño
    boton.style.whiteSpace = 'normal'; // Permitir que el texto se divida en varias líneas
    boton.style.width = 'auto'; // Ajuste automático al contenido
    boton.style.height = 'auto'; // Ajuste automático al contenido
    boton.style.textAlign = 'center'; // Centrar el texto dentro del botón

    // Función para abrir el enlace modificado
    boton.addEventListener('click', function() {
        // Obtener la URL actual
        const url = window.location.href;

        // Buscar el ID y el nombre del documento en la URL
        const match = url.match(/\/document\/(\d+)\/([^\/]+)/);

        if (match) {
            const documentId = match[1];  // ID del documento
            const documentName = match[2]; // Nombre del documento

            // Modificar el dominio y abrir el enlace en una nueva pestaña
            const newUrl = `https://scribd.downloader.tips/document/${documentId}/${documentName}`;
            window.open(newUrl, '_blank');
        } else {
            alert('No se pudo encontrar el ID o el nombre del documento en la URL.');
        }
    });

    // Insertar el botón en la página
    document.body.appendChild(boton);
})();