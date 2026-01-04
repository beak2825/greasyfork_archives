// ==UserScript==
// @name         Yandex Images Ads Killer + Save Buttons
// @version      1.0
// @author        toxtodo
// @license        MIT
 
// @name:ru      Yandex Images Ads Killer + Save Buttons
// @description:ru Удаляет рекламные блоки на страницах просмотра изображений Яндекс и восстанавливает кнопки сохранения/поделиться.
//
// @name:uk      Yandex Images Ads Killer + Save Buttons
// @description:uk Видаляє рекламні блоки на сторінках перегляду зображень Яндекс і відновлює кнопки збереження/поділитися.
//
// @name:tr      Yandex Images Ads Killer + Save Buttons
// @description:tr Yandex Görselleri görüntüleme sayfalarındaki reklam bloklarını kaldırır ve kaydetme/paylaşma düğmelerini geri yükler.
//
// @name:en      Yandex Images Ads Killer + Save Buttons
// @description:en Removes ad blocks on Yandex Images viewer pages and restores save/share buttons.
//
// @name:kk      Yandex Images Ads Killer + Save Buttons
// @description:kk Yandex кескіндерін қарау беттеріндегі жарнама блоктарын жояды және сақтау/бөлісу түймелерін қалпына келтіреді.
//
// @name:uz      Yandex Images Ads Killer + Save Buttons
// @description:uz Yandex Rasmlar ko'rish sahifalaridagi reklama bloklarini olib tashlaydi va saqlash/ulashish tugmalarini tiklaydi.
//
// @name:fr      Yandex Images Ads Killer + Save Buttons
// @description:fr Supprime les blocs d'annonces sur les pages de visualisation d'images Yandex et restaure les boutons d'enregistrement/partage.
//
// @name:de      Yandex Images Ads Killer + Save Buttons
// @description:de Entfernt Werbeblöcke auf Yandex Bilder-Viewer-Seiten und stellt die Schaltflächen zum Speichern/Teilen wieder her.
//
// @name:it      Yandex Images Ads Killer + Save Buttons
// @description:it Rimuove i blocchi pubblicitari dalle pagine di visualizzazione delle immagini di Yandex e ripristina i pulsanti di salvataggio/condivisione.
//
// @name:es      Yandex Images Ads Killer + Save Buttons
// @description:es Elimina los bloques de anuncios en las páginas de visualización de imágenes de Yandex y restaura los botones de guardar/compartir.
//
// @name:ja      Yandex Images Ads Killer + Save Buttons
// @description:ja Yandex画像のビューアページにある広告ブロックを削除し、保存/共有ボタンを復元します。
//
// @name:cs      Yandex Images Ads Killer + Save Buttons
// @description:cs Odstraňuje reklamní bloky na stránkách prohlížeče obrázků Yandex a obnovuje tlačítka pro uložení/sdílení.
//
// @name:zh      Yandex Images Ads Killer + Save Buttons
// @description:zh 删除 Yandex 图片查看页面上的广告块并恢复保存/分享按钮。
// @match        https://*.yandex.ru/images/*
// @match        https://ya.ru/images/*
// @grant        none
// @namespace https://greasyfork.org/users/1331920
// @description Удаляет рекламные блоки на страницах просмотра изображений Яндекс и восстанавливает кнопки сохранения/поделиться.
// @downloadURL https://update.greasyfork.org/scripts/557030/Yandex%20Images%20Ads%20Killer%20%2B%20Save%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/557030/Yandex%20Images%20Ads%20Killer%20%2B%20Save%20Buttons.meta.js
// ==/UserScript==
 
(() => {
  let savedButtons = null;
 
  setInterval(() => {
    const sidebar = document.querySelector('#ImagesViewer-Sidebar, .ImagesViewer-Sidebar');
    if (!sidebar) return;
 
    // Step 1: Find and stash the buttons (if we haven't already).
    if (!savedButtons) {
      const buttonsBlock = sidebar.querySelector('.MMViewerButtons-Inline');
      if (buttonsBlock) {
        savedButtons = buttonsBlock.cloneNode(true); // Cloning the whole button block
      }
    }
 
    // Step 2: Nuke the ads. Get rid of 'em.
    sidebar.querySelectorAll('div[class*="-Card_"]').forEach(el => el.remove());
 
    // Step 3: If those save/share buttons got wiped out with the ads, we gotta put our stashed ones back.
    if (savedButtons && !sidebar.querySelector('.MMViewerButtons-Inline')) {
      const viewerButtons = sidebar.querySelector('.MMViewerButtons') || sidebar.lastChild;
      if (viewerButtons) {
        viewerButtons.appendChild(savedButtons.cloneNode(true)); // Dropping a fresh copy back in.
      }
    }
  }, 300);
})();