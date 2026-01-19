// ==UserScript==
// @name         Archive_ReupBank
// @namespace    Archive_ReupBank
// @version      3.6.0
// @description  Reup les images noelshack + renvoyer image
// @author       969-6261
// @icon         https://images.emojiterra.com/openmoji/v16.0/128px/1f501.png
// @match        *://risibank.fr/compte*
// @match        *://risibank.fr/media/*
// @match        *://www.jeuxvideo.com/messages-prives/nouveau.php*
// @match        *://www.jeuxvideo.com/messages-prives/message.php*
// @match        *://www.jeuxvideo.com/forums/42-*
// @match        *://www.jeuxvideo.com/forums/message/*
// @match        *://www.jeuxvideo.com/forums/1-*
// @match        file:///*-*-ArchRisi.html
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      risibank.fr
// @connect      image.noelshack.com
// @connect      noelshack.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548818/Archive_ReupBank.user.js
// @updateURL https://update.greasyfork.org/scripts/548818/Archive_ReupBank.meta.js
// ==/UserScript==

/* EN LOCAL => ACTIVER => Autoriser l'accès aux URL de fichier (Gestion Extension)*/

const OTHER_NAME = "0";
const DEGRADE_BLOB = "0";

const risibankSiteUrl = 'https://risibank.fr';
const noelshackSiteUrl = 'https://www.noelshack.com';
const jeuxvideoSitekUrl = 'https://www.jeuxvideo.com';
const tagOfReup = 'reup';

//////////////////////// JVC ////////////////////////////////

if (location.hostname === 'www.jeuxvideo.com' || location.protocol === 'file:') {
    'use strict';


    //const images = document.querySelectorAll('.img-shack , img[data-risi]');
    //images.forEach(img => {
    //    img.addEventListener('click', async (e) => {


    document.body.addEventListener('click', async (e) => {
         const img = e.target;
         if (img.matches('.img-shack, img[data-risi], .message__urlImg')) {

            e.preventDefault(); // Empêche l'ouverture du lien

            console.log('⚡ Start');

            //VARIABLE LIEN HD JVC + TAG RISI
            const urlOldNoelshack = img.src.replace('/minis/', '/fichiers/').replace('.png', `.${img.alt.split('.').pop()}`);
            //const urlOldNoelshack = img.alt;
            const urlTagsiRisi=`${risibankSiteUrl}/api/v1/medias/by-source?type=jvc&url=${urlOldNoelshack}`

            console.log('Alt:', urlOldNoelshack);
            console.log('URL de Check:', urlTagsiRisi);

            //FONCTION-EN-CAS-DIMAGE-JAMAIS-UPLOAD---------
            function ImageAbsentFromRisibank(tagsRaw) {
                console.warn('✅ Image non reuploadée car absente de Risibank :', urlOldNoelshack);

                const joinedOld = [...tagsRaw, tagOfReup].join("-");
                const targetUrl = `${risibankSiteUrl}/compte#add-media?tags=${joinedOld}&link=${urlOldNoelshack}`;
                window.open(targetUrl, '_blank');
            }


            //--RECUPERER-LES-TAGS-À-PARTIR-DE-LURL------------

            // Récuperer url complete risibank
            const reponseRisi = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: urlTagsiRisi,
                    onload: res =>
                        resolve({
                            finalUrl: res.finalUrl || urlTagsiRisi,
                            htmlRisi: res.responseText
                        }),
                    onerror: err => reject(err)
                });
            });
            console.log('URL finale ApiRisibank :', reponseRisi.finalUrl);

            // Decompositon des tags-------------

            //Recup Tags originaux depuis 404
            const lastPart = reponseRisi.finalUrl.split('/').pop()?.split('.')[0]; // recuperer les fin sans ext
            let tagsRaw = lastPart.split('-').slice(1); // vire les tiret et lid ou timestamp image

            //Tags-from-archive-or-url
            tagsRaw = img?.dataset?.tags ? img.dataset.tags.split('-').map(t => t.trim()) : tagsRaw;
            console.log('Mots :', tagsRaw);

            //--⚠️---PAS-UN-LIEN-RISIBANK-=>-NO-REUP------STOP-------------------------------------⚠️---
            if (reponseRisi.finalUrl.includes("noelshack.com/")) return ImageAbsentFromRisibank(tagsRaw);
            //---⚠️--LIEN-NOEL---------------------------------------------------------------------⚠️---

            //--CHECK-SI-L'IMAGE-EST-DISPONIBLE-=>-SI-PRESENTE-ET-VISIBLE-LE-SCRIPT-SARRETE----------
            const pageRisibank = new DOMParser().parseFromString(reponseRisi.htmlRisi, "text/html");
            const imageNoStrike = pageRisibank.querySelector('.media .media-preview img[src*="/full."]');
            //--🛑---IMAGE-DEJA-PRESENTE-STOP-------------------------------🛑---
            if (imageNoStrike) {
                window.open(reponseRisi.finalUrl, '_blank'); // Ouverture image déjà disponible
                throw new Error('🛑Image déjà présente🛑');
            }
            //--🛑----------------------------------------------------------🛑---


            //--MOTS-A-VIRER------------
            const blacklistTags = [
                'kawai',
                'kawaii',
                'cute',
                'loli',
                'folle',
                'trap',
                'mignon',
                'waifu'
            ];

            const tagsClean = tagsRaw.filter(w => !blacklistTags.includes(w)).concat(tagOfReup);
            console.log('Mots Clean:', tagsClean);

            //-------GET-FROM-NOELSHAK---------------------------

            let blob = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: urlOldNoelshack,
                    //headers: { 'Accept': 'image/png,image/jpeg,image/gif' },
                    responseType: 'blob', // <= RECUPERATION IMAGE ✔️
                    onload: res => resolve(res.response),
                    onerror: err => reject(err)
                });
            });

            //-------REUPLOAD-SUR-NOELSHAK---------------------------

            const formData = new FormData();
            const rawName = urlOldNoelshack.split('/').pop() || 'image.webp';
            let cleanName = rawName.split('-').slice(1).join('-'); // vire timestamp

            //1) TAGS À LA PLAGE DE NAME ℹ️
            if (OTHER_NAME === "1") {
                const toRemove = prompt('New retract').replaceAll(' ', '-');
                cleanName = cleanName.replace(toRemove, '').replaceAll('--', '-');
            }
            //2) ALTERE BLOB ⚠️
            if (DEGRADE_BLOB === "1") {
               alert("⚠️ LOSSY MODE ACTIVATED : le blob va être altéré");
               const applyLossy = async (blobOrg) => {
                   return new Promise(resolve => {
                       const img = document.createElement('img');
                       const canvas = document.createElement('canvas');
                       const ctx = canvas.getContext('2d');
                       img.onload = () => {
                           canvas.width = img.width;
                           canvas.height = img.height;
                           ctx.drawImage(img, 0, 0);
                           // Altération volontaire (2 pixels)
                           ctx.fillStyle = 'rgba(1, 0, 1, 0.01)'; // modifie l'image à 1%
                           ctx.fillRect(0, 0, 1, 1); // HAUT GAUCHE
                           ctx.fillRect(img.width - 1, 0, 1, 1); // HAUT DROITE
                           canvas.toBlob(resolve, 'image/png');
                       };
                       img.src = URL.createObjectURL(blobOrg);
                   });
               };
               blob = await applyLossy(blob);
            }

            formData.append('domain', 'https://www.jeuxvideo.com');
            formData.append('fichier[]', blob, cleanName); // <= REUP IMAGE ✔️

            let json;
            if (location.hostname === 'www.jeuxvideo.com') {
                 const res = await fetch('https://www.noelshack.com/webservice/envoi.json', {
                     method: 'POST',
                     body: formData
                 });
                  json = JSON.parse(await res.text());
            /* HORS CORSE */
            } else {
                 const res = await new Promise((resolve, reject) =>
                      GM_xmlhttpRequest({
                           method: 'POST',
                           url: 'https://www.noelshack.com/webservice/envoi.json',
                           data: formData,
                           onload: resolve,
                           onerror: reject
                      })
                 );
                 json = JSON.parse(res.responseText);
             }

            const urlNewNoelshack = json.url;

            console.log('✅ Image reuploadée avec succès :', urlNewNoelshack);

            //------ENVOIE-A-RISIBANK------------------------------

            const joined = tagsClean.join('-');
            const targetUrlReup = `${risibankSiteUrl}/compte#add-media?tags=${encodeURIComponent(joined)}&link=${urlNewNoelshack}`;
            window.open(targetUrlReup, '_blank');
        }
        //});
    });
}

//////////////////////// RISIBANK ////////////////////////////////

//------TRANSFERT-DE-LURL-ET-DES-VIA-URL------------------------------

//if (location.href.includes(`${risibankSiteUrl}/compte?tags=`)) {
if (location.href.includes(`${risibankSiteUrl}/compte#add-media?tags=`)) {
    (async function () {
        'use strict';

        //const tags = new URLSearchParams(location.search).get('tags');
        //const linkNoel = new URLSearchParams(location.search).get('link');
        const tags = new URLSearchParams(location.hash.split("?")[1]).get('tags');
        const linkNoel = new URLSearchParams(location.hash.split("?")[1]).get('link');
        if (tags || linkNoel) {
            // Stocke temporairement dans sStorage
            sessionStorage.setItem('risibank_tags', tags);
            sessionStorage.setItem('risibank_link', linkNoel);

            await new Promise(r => setTimeout(r, 500)); // Attendre le JS

            // REDIRECTION VERS VERSION PROPRE DE LURL
            location.href = `${risibankSiteUrl}/compte?#add-media`;
            return;
        }
    })();
}

//------RECUPERATION-DE-LURL-ET-DES-TAGS-VIA-SESSION-SSTORAGE--------------------
if (location.href.includes(`${risibankSiteUrl}/compte#add-media`)) {
    (async function () {
        const tags = sessionStorage.getItem('risibank_tags');
        const linkNoel = sessionStorage.getItem('risibank_link');

        if (!tags) return; // => pas de tag trouvé

        //CSS
        GM_addStyle(`
        .main-content > .p-4.col > h2,
        .tag-input-container + small,
        .main-content .container-fluid .card:has(.text-warning),
        .card-header {
            display: none !important;
        }
        .col > .container-fluid > form {
            display: grid;
        }
        .col > .container-fluid > form > div:last-child {
            order: -1;
            margin-bottom: 5px;
        }
        .main-content .container-fluid > form > .card:nth-child(4) button {
            padding : 3px !important;
        }
        .main-content .container-fluid > form > .card > .card-body > small:last-of-type {
            display : none !important;
        }
        `);

        await new Promise(r => setTimeout(r, 1000)); // Pause Attendre 1e JS

        //REMPLISSAGE DES CHAMPS
        //URL
        const inputLink = document.querySelector('.container-fluid input.form-control');
        inputLink.value = linkNoel;
        inputLink.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Champs Url rempli avec :', inputLink.value);

        //STICKER-MODE
        const inputType = document.querySelector('.container-fluid select.form-select');
        inputType.value = "sticker";
        inputType.dispatchEvent(new Event('change', { bubbles: true }));

        //TAGS
        const inputTags = document.querySelector('.container-fluid .tag-text-input');
        //inputTags.value = tags.replaceAll('-', ' ');
        //inputTags.dispatchEvent(new Event('input', { bubbles: true }));
        for (const tag of tags.split('-')) {
            inputTags.value = tag;
            inputTags.dispatchEvent(new Event("input", { bubbles: true }));
            inputTags.dispatchEvent(new KeyboardEvent("keydown", { key: "Space", bubbles: true }));
        }
        console.log('Champs Tags rempli avec :', tags.replaceAll('-', ' '));

        //CHECKED-PART0
        const defaultChecked = "Archive KJ";
        const allbuttons = [...document.querySelectorAll('.container-fluid .gap-2 > button')];
        const buttonsMatches = allbuttons.find(btn => btn.textContent.includes(defaultChecked));
        buttonsMatches?.click();
    })();
}

//------PAGE-POUR-REUP---------------------
if (location.href.includes(`${risibankSiteUrl}/media/`)) {
    (async function () {
        await new Promise(r => setTimeout(r, 1000));

        const lastPart = location.href.split('/').pop(); // recuperer les fin sans ext
        const tagsRawJoin = lastPart.split('-').slice(1).join('-');

        const cible = document.querySelectorAll('.navbar-nav.me-auto > .nav-item')[2];
        cible.insertAdjacentHTML("afterend", `
          <li class="nav-item">
            <!-- <a href="/compte#add-media?tags=${tagsRawJoin}-${tagOfReup}&link=" title="Reup" class="nav-link">Reup</a> -->
            <a href="/compte#add-media?tags=${tagsRawJoin}&link=" title="Reup" class="nav-link">Reup</a>
          </li>
        `);


         const cible2 = document.querySelectorAll('.navbar-nav.me-auto > .nav-item')[3];
         cible2.insertAdjacentHTML("afterend", `
             <li class="nav-item">
                 <a id="change-tags-btn" href="#" title="Change Tags" class="nav-link">Change Tags</a>
             </li>
         `);

        document.querySelector(".nav-link#change-tags-btn").addEventListener("click", async e => {
            e.preventDefault(); // Empêche le # de faire défiler la page
            const tokenGet = JSON.parse(localStorage.getItem("auth"))?.tokenRaw;
            const mediaId = location.pathname.split("/").pop().split("-")[0];
            const rawTags = prompt("Tags");
            if (!rawTags) return;

            const tags = rawTags.replaceAll("-", " ").split(" ").filter(Boolean);

            const response = await fetch(`${risibankSiteUrl}/api/v1/medias/${mediaId}/tags`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${tokenGet}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tags)
            });
            //location.reload();
            response.ok ? (location.href = `${risibankSiteUrl}/media/${mediaId}-${tags.join("-")}`) : alert(response.status);
        });
    })();
}
