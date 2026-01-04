// ==UserScript==
// @name         Instagram Téléchargement Images & Vidéos
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Ajoute des boutons de téléchargement et d'ouverture sous les images et vidéos Instagram
// @author       DibiKre
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557068/Instagram%20T%C3%A9l%C3%A9chargement%20Images%20%20Vid%C3%A9os.user.js
// @updateURL https://update.greasyfork.org/scripts/557068/Instagram%20T%C3%A9l%C3%A9chargement%20Images%20%20Vid%C3%A9os.meta.js
// ==/UserScript==

(function() {

    const elementsTraites = new WeakSet();

    function obtenirUrlSource(element) {
        if (element.tagName === 'IMG') {
            return element.src;
        } else if (element.tagName === 'VIDEO') {
            const sourceElement = element.querySelector('source');
            if (sourceElement) {
                return sourceElement.src;
            }
            if (element.src && !element.src.startsWith('blob:')) {
                return element.src;
            }
            const conteneurVideo = element.closest('[role="button"]');
            if (conteneurVideo) {
                const video = conteneurVideo.querySelector('video');
                if (video && video.src && !video.src.startsWith('blob:')) {
                    return video.src;
                }
            }
        }
        return null;
    }

    function telechargerFichier(url, nomFichier) {
        fetch(url)
            .then(reponse => reponse.blob())
            .then(blob => {
                const urlBlob = window.URL.createObjectURL(blob);
                const lien = document.createElement('a');
                lien.href = urlBlob;
                lien.download = nomFichier;
                document.body.appendChild(lien);
                lien.click();
                window.URL.revokeObjectURL(urlBlob);
                document.body.removeChild(lien);
            })
            .catch(erreur => {
                console.error('Erreur de téléchargement:', erreur);
                window.open(url, '_blank');
            });
    }

    function ajouterBoutons(elementMedia) {
        if (elementsTraites.has(elementMedia)) {
            return;
        }

        const urlSource = obtenirUrlSource(elementMedia);
        if (!urlSource) return;

        let conteneur = null;
        
        if (elementMedia.tagName === 'IMG') {
            conteneur = elementMedia.closest('._aa1z') || elementMedia.closest('.x1n2onr6');
        }
        else if (elementMedia.tagName === 'VIDEO') {
            conteneur = elementMedia.closest('.x1n2onr6') || elementMedia.closest('[role="button"]')?.parentElement;
        }

        if (!conteneur || conteneur.querySelector('.boutons-telechargement-perso')) {
            return;
        }

        elementsTraites.add(elementMedia);

        const estVideo = elementMedia.tagName === 'VIDEO';
        const extension = estVideo ? 'mp4' : 'jpg';
        const nomFichier = `instagram_${estVideo ? 'video' : 'image'}_${Date.now()}.${extension}`;

        const conteneurBoutons = document.createElement('div');
        conteneurBoutons.className = 'boutons-telechargement-perso';
        conteneurBoutons.style.cssText = `
            display: flex;
            gap: 10px;
            padding: 10px;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.05);
            margin-top: 5px;
        `;

        const boutonTelecharger = document.createElement('button');
        boutonTelecharger.textContent = `⬇️ Télécharger ${estVideo ? 'Vidéo' : 'Image'}`;
        boutonTelecharger.style.cssText = `
            padding: 8px 16px;
            background-color: #0095f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.2s;
        `;
        boutonTelecharger.onmouseover = () => boutonTelecharger.style.backgroundColor = '#0081d9';
        boutonTelecharger.onmouseout = () => boutonTelecharger.style.backgroundColor = '#0095f6';
        boutonTelecharger.onclick = (evenement) => {
            evenement.preventDefault();
            evenement.stopPropagation();
            telechargerFichier(urlSource, nomFichier);
        };

        const boutonOuvrir = document.createElement('button');
        boutonOuvrir.textContent = '🔗 Ouvrir';
        boutonOuvrir.style.cssText = `
            padding: 8px 16px;
            background-color: #262626;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.2s;
        `;
        boutonOuvrir.onmouseover = () => boutonOuvrir.style.backgroundColor = '#1a1a1a';
        boutonOuvrir.onmouseout = () => boutonOuvrir.style.backgroundColor = '#262626';
        boutonOuvrir.onclick = (evenement) => {
            evenement.preventDefault();
            evenement.stopPropagation();
            window.open(urlSource, '_blank');
        };

        conteneurBoutons.appendChild(boutonTelecharger);
        conteneurBoutons.appendChild(boutonOuvrir);
        conteneur.appendChild(conteneurBoutons);
    }

    function traiterTousLesMedias() {
        const images = document.querySelectorAll('img.x5yr21d, img.xh8yej3, ._aa1z img');
        images.forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                ajouterBoutons(img);
            } else {
                img.addEventListener('load', () => ajouterBoutons(img), { once: true });
            }
        });

        const videos = document.querySelectorAll('video.x1lliihq, video[playsinline]');
        videos.forEach(video => {
            if (video.readyState >= 2) {
                ajouterBoutons(video);
            } else {
                video.addEventListener('loadeddata', () => ajouterBoutons(video), { once: true });
            }
        });
    }

    const observateur = new MutationObserver(() => {
        traiterTousLesMedias();
    });

    observateur.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(traiterTousLesMedias, 1000);
    
    setInterval(traiterTousLesMedias, 3000);

})();