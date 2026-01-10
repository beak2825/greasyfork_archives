// ==UserScript==
// @name         Eleven
// @license      GPL-3.0-or-later
// @description  Améliore l'interface de Kraland
// @author       Somin
// @namespace    somin
// @version      beta.0.3
// @match        http://www.kraland.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kraland.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562131/Eleven.user.js
// @updateURL https://update.greasyfork.org/scripts/562131/Eleven.meta.js
// ==/UserScript==
/*
* =========================================================================
* Copyright (C) 2026 Somin
* =========================================================================

This program is free software:
you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.

* =========================================================================
* Ce programme est un logiciel libre ;
* =========================================================================

vous pouvez le redistribuer ou le modifier suivant les termes de la GNU General Public License telle que publiée par la Free Software Foundation ;
soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.

Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS AUCUNE GARANTIE ;
sans même la garantie tacite de QUALITÉ MARCHANDE ou d'ADÉQUATION à UN BUT PARTICULIER.
Consultez la GNU General Public License pour plus de détails.

Vous devez avoir reçu une copie de la GNU General Public License en même temps que ce programme ;
si ce n'est pas le cas, consultez <http://www.gnu.org/licenses>.

La licence GPL est là uniquement pour garantir que ce projet restera toujours libre et gratuit pour toute la communauté de Kraland.

* =========================================================================
* --- DISCLAIMER ---
* =========================================================================

Ce script est une extension indépendante développée par Somin.
Il n'est en aucun cas affilié, approuvé ou lié à redstar et l'administration officielle de kraland.org.
L'utilisation de ce script se fait sous votre propre responsabilité.

------------------ */
(function() {
    'use strict';

    //+------------ Options par défaut --------------+
    var tailleDesAvatarsForum = 110;
    var tailleDesAvatarsJeu = 50;
    var tailleDesAvatarsPopup= 110;
    //Taille en pixel (défaut: 110 forum ; 50 jeu)

    var tailleMaxImgRapportPrivé = 99;
    var tailleMaxImgForum = 100;
    var tailleMaxImgEvenement = 100;
    // Taille en % du cadre (défaut: 100)

    var PoliceDeCaracteres = "" ;
    // mettez la police de votre choix entre les guillemets. (Par défaut : "")

    // var pageAccueil = [2,1,0];
    // 2=Cybermonde, 1=Forum, 0=Bienvenue
    // Mettez les cadres dans l'ordre de vos préférences

    var Goupil=false;
    // true pour désactiver les smileys Poule, false sinon

    var maxCache=5;
    // nombre de posts en cours de rédaction sauvegardé

    var forumStyle=true;
    var largeurForum=60;
    // en %
    var paddingForum=80;
    // en %

    var largeurTopic=82;
    // en %, 100 = largeur pleine page
    // 85 par défaut

    var drapeauForum=1;
    // 0 = texte, 1 = drapeau, (2 = drapeau+texte)

    var fonctionIcon=false;
    // false = texte, true = icône
    var pnjIcon=false;
    // false = pas d'icône, true = icône

    //--- Paramètres de gestion du rapport d'évènements
    var actionsParPage=100;
    var filtreEmpire="Tous les empires + provinces et villes";
    var filtreAction=1;
    var imagesIncluses=true;
    var réseauxSociaux=false;

    var quotebar = true;
    // enlève le guillemet de la citation

    var slimfooter = 1;
    // -1 = suppression, 0 = désactivé, 1 = slim,

    var minichat = false;
    // affichage du minichat

    //+------------ Paramétrages du Script --------------+

    //--- Variables Globales
    var kdocument=document;
    var theUrl=window.location.href;

    var aparam={
        avaFora: tailleDesAvatarsForum,
        avaIg: tailleDesAvatarsJeu,
        avaOrder: tailleDesAvatarsPopup,
        imgRP: tailleMaxImgRapportPrivé,
        imgFora: tailleMaxImgForum,
        imgRE: tailleMaxImgEvenement,
        fontFam: PoliceDeCaracteres,
        colorL: -1,
        tCache: maxCache,
        goupil: Goupil,
        //motd: pageAccueil,
        erlite: true,
        avaItem: 32,
        evNb: actionsParPage,
        evEmpire: filtreEmpire,
        evAction: filtreAction,
        evImg: imagesIncluses,
        evRs: réseauxSociaux,
        qb : quotebar,
        foot : slimfooter,
        mc : minichat,
        fstyle : forumStyle,
        fwidth : largeurForum,
        twidth : largeurTopic,
        pforum : paddingForum,
        fempire : drapeauForum,
        fpnj : pnjIcon,
        ffonction : fonctionIcon
    }

    var savedTxtData=[];

    //--- Initialisation
    globalki();
    const navbar=document.querySelector('#navbar');
    var kili, lia;
    if(navbar){
        kili=navbar.querySelector('li.dropdown.active');
        if(kili){
            lia=kili.querySelector('a').textContent.trim().split(/\s+/)[0];
        }else{
            motd();
        }

        switch(lia){
        case 'Jouer' :
            play();
            break;
        case 'Forum' :
            forum();
            break;
        case 'Monde' :
            monde();
            break;
        default:
            return;
        }
    }else{
        //vérifier si rapport privé ou carte cybermondiale

    }

    function globalki(){
        if(!aparam.mc){document.querySelector('#flap_closed').remove();}
        var contentki=document.querySelector('#content');
        contentki.style.width='auto';
        var rowki=contentki.querySelector('.row');
        rowki.style.marginLeft='0';
        rowki.style.marginRight='0';

        //--- gestion pub et top
        var topKi=document.querySelector('#top');
        topKi.style.height='auto';
        var noad=document.createElement('button');
        /*
        if(sessionStorage.noad){removetop();}else{
            noad.type='button';
            noad.value='';
            if(true){
                // si pub détectée
                noad.innerHTML='Masquer le bandeau';
            }else{
                noad.innerHTML='Pensez à désactivez votre bloqueur de pub !';
            }
            noad.addEventListener('click',removetop);
            topKi.style.display = 'float';
            topKi.style.alignItems = 'right';

            topKi.appendChild(noad);
        }*/
        //removetop();
        function removetop(){
            topKi.remove();
            //topKi.style.display="none";
            sessionStorage.noad=true;
        }


        var botKi=document.querySelector('footer');
        botKi.style.minHeight='auto';
        switch(slimfooter){
            case -1:
                botKi.remove();
                break;
            case 0:
                return;
                break;
            case 1:
                botKi.querySelector('.footer-quote').remove();
                break;
            default:
                botKi.querySelector('.footer-quote').remove();
                return;
        }
    }

    function motd(){
        let wpanels=document.querySelectorAll('#myCarousel .item');
        for(let i=0;i<wpanels.length;i++){
            wpanels[i].querySelector('img').style.margin='0px auto';
        }
    }

    function play(){
        var cRight=document.querySelector('#col-right');

        // pj side
        let pjSide=cRight.querySelector('.dashboard');
        let panelBody=pjSide.querySelectorAll('.panel-body');
        for(let i=0;i<panelBody.length;i++){
            panelBody[i].style.paddingTop='0px';
            panelBody[i].style.paddingBottom='0px';
            panelBody[i].style.paddingLeft='0px';
            panelBody[i].style.paddingRight='2px';

            let pLink=panelBody[i].querySelector('td').querySelectorAll('a');
            for(let j=0;j<pLink.length;j++){
                pLink[j].style.clear = 'both';
                //pLink[j].style.overflow = 'hidden';
                pLink[j].style.border='none';
                pLink[j].style.padding='0px';
                let ava=pLink[j].querySelector('img.pull-left');
                ava.style.margin='5px';
                ava.style.width=aparam.avaIg+'px';
                ava.style.height=aparam.avaIg+'px';
            }
        }

        /*
        function avatar(pp){
            pp.style.width = aparam.avaIg + 'px';
            pp.style.height = aparam.avaIg + 'px';
            pp.style.overflow = 'hidden';
            pp.style.display = 'inline-block';

            const img = pp.querySelector('img');
            if(img){
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.display = 'block';
            }
        }
        */

        // bâtiment
        let bSide=cRight.querySelectorAll('.dashboard')[1];
        let bat, commerce, materiel;

        let bpanels=bSide.querySelectorAll('.panel.panel-default');
        for(let i=0;i<bpanels.length;i++){
            let boxType=bpanels[i].querySelector('h3').lastChild.textContent.trim();
            //console.log(boxType);
            switch(boxType){
                case "Bâtiment":
                    bStyle(bpanels[i]);
                    break;
                case "Commerce":
                    cStyle(bpanels[i]);
                    break;
                case "Matériel":
                    mStyle(bpanels[i]);
                    break;
                case "Installation":
                    console.log('test4');
                    iStyle(bpanels[i]);
                    break;
                default :
            }
        }

        function bStyle(bbox){

        }

        function cStyle(cbox){

        }

        function mStyle(mbox){
            let items=mbox.querySelectorAll('.panel-body');
            for(let i=0;i<items.length;i++){
                items[i].style.padding='0px';
                let itemLink=items[i].querySelector('a');
                itemLink.style.border='none';
            }
        }

        function iStyle(ibox){

        }

    }

    function forum(){
        var cRight=document.querySelector('#col-right');
        var cLeft=document.querySelector('#col-left');
        var row=document.querySelector('#content .row');

        let isTopicPage=document.querySelector('#content ul.media-list.forum');
        if(isTopicPage){
            topicSetUp();
        }else if(aparam.fstyle){
            forumSetUp();
        }

        function topicSetUp(){
            // sujet
            cRight.style.width=aparam.twidth+'%';
            if(aparam.twidth<=80){
                cLeft.remove();
            }else{
                cLeft.style.width='auto';
                let fw=parseFloat(aparam.twidth);
                let cleftWidth=(100-fw);
                cLeft.style.maxWidth=cleftWidth+'%';
            }

            // avatar & cartouche
            var userinfo=document.querySelectorAll('div.user-info');
            for(let i=0;i<userinfo.length;i++){
                let ava=userinfo[i].querySelector('.avatar');
                ava.classList.remove('img-thumbnail');
                ava.style.display='inline';
                ava.style.width=aparam.avaFora+'px';
                ava.style.maxWidth='100%';
                ava.style.maxHeight=(2*aparam.avaFora)+'px';
                ava.style.marginBottom='5px';

                //---
                let cart=userinfo[i].querySelector('.cartouche');

                const logoEmpDiv = cart.querySelector('div:has(img[src*="/world/"])');
                const nomLien = cart.querySelector('strong');
                const boutonPNJ = cart.querySelector('button.xmini');
                const rangImgDiv = cart.querySelector('div:has(img[src*="/rank/"])');

                if(nomLien){
                    nomLien.style.display = 'inline-block';
                }
                if(boutonPNJ){
                    if(aparam.fpnj){
                        let divpnj=boutonPNJ.parentNode;
                        divpnj.parentNode.style.display = 'inline-block';
                        divpnj.parentNode.style.marginLeft = '5px';
                        cart.appendChild(divpnj);
                    }else{
                        boutonPNJ.remove();
                    }
                }
                if(logoEmpDiv){
                    logoEmpDiv.style.marginTop = '5px';
                    cart.appendChild(logoEmpDiv);
                    let logoEmp=logoEmpDiv.querySelector('img');
                    switch(aparam.fempire){
                        case 0:
                            logoEmp.src='';
                            logoEmp.alt=logoEmp.title;
                            break;
                        case 1 :
                            logoEmp.style.width='auto';
                            logoEmp.style.height='auto';
                            break;
                        case 2 :
                            break;
                        default :
                            logoEmp.style.width='auto';
                            logoEmp.style.height='auto';
                    }
                }
                if(cart){
                    cart.appendChild(rangImgDiv);
                    let rangImg=rangImgDiv.querySelector('img');
                    if(!aparam.ffonction){
                        rangImg.src='';
                        rangImg.alt=rangImg.title;
                        rangImg.style.fontWeight='bold';
                    }else{
                        rangImg.style.width='auto';
                        rangImg.style.height='auto';
                    }
                }
            }

            // post
            var bquote=cRight.querySelectorAll('blockquote');
            if(bquote.length>0){
                for(let i=0;i<bquote.length;i++){
                    bquote[i].querySelector('i').remove();
                }
            }

            //--- naviguer avec les flèches
            try{
                let currentp=document.getElementById('col-right').querySelector('ul.pagination li.active');
                arrowsHead(currentp);
            }catch(err){
                console.log(err);
            }
        }

        function forumSetUp(){
            if(cLeft){
                cLeft.remove();
            }else{
                row.style.paddingLeft="5%";
                row.style.paddingRight="5%";
            }

            if(cRight){
                cRight.style.width=aparam.fwidth+'%';
                if(aparam.fwidth==100){
                    cRight.style.paddingLeft='5%';
                    cRight.style.paddingRight='5%';
                }else{
                    cRight.style.width=aparam.fwidth+'%';
                    let fw=parseFloat(aparam.fwidth);
                    let lmargin=(100-fw)/2;
                    cRight.style.marginLeft=lmargin+"%";
                    cRight.style.paddingLeft='0%';
                    cRight.style.paddingRight='0%';
                }
            }
        }
    }

    function monde(){
        var cRight=document.querySelector('#col-right');
        var cLeft=document.querySelector('#col-left');
        var row=document.querySelector('#content .row');

        //--- naviguer avec les flèches
        try{
            let currentp=document.getElementById('col-right').querySelector('ul.pagination li.active');
            arrowsHead(currentp);
        }catch(err){
            console.log(err);
        }

    }

    //------------ flèches pour navigation --------------
    function arrowsHead(currentP,isTopic){
        if(!currentP){return;}
        let currentPa = Array.from(currentP.parentNode.querySelectorAll('li'));
        currentPa.shift();
        currentPa.pop();
        let currentpIndex = currentPa.findIndex(el => el.classList.contains('active'));
        let pnb = parseInt(currentpIndex);
        let allPa = Array.from(currentP.parentNode.querySelectorAll('a')).filter(a => a.textContent.trim() !== '...' && a.textContent.trim() !== '');

        let n, nlink;
        document.addEventListener('keydown', (event) => {
            const activeElement = document.activeElement;
            const isTextInput = activeElement.tagName === 'INPUT' ||
                  activeElement.tagName === 'TEXTAREA' ||
                  activeElement.isContentEditable;

            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

            event.preventDefault();
            switch (event.key) {
                case 'ArrowLeft':
                    n = pnb - 1;
                    if (n < 0) { n = currentPa.length - 1 }
                    break;
                case 'ArrowRight':
                    n = pnb + 1;
                    if (n === currentPa.length) { n = 0 }
                    break;
                default:
                    return;
            }
            nlink = allPa[n].href;
            window.open(nlink, '_self');
        });
    }

})();