// ==UserScript==
// @name         Eleven
// @license      GPL-3.0-or-later
// @description  Améliore l'interface de Kraland
// @author       Somin
// @namespace    somin
// @version      beta.0.16
// @match        http://www.kraland.org/*
// @match        http://kraland.org/*
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

    const EpinglerLesMenus = false;
    // true pour épingler les menus de Kraland

    var PoliceDeCaracteres = "" ;
    // mettez la police de votre choix entre les guillemets. (Par défaut : "")

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

    //--- Rapport privé
    var couleurNouveaux='red';
    // couleur des nouveaux évènements

    //+------------ Paramétrages du Script --------------+

    //--- Variables Globales
    var kdocument=document;
    var theUrl=window.location.href;

    var aparam={
        pinup: EpinglerLesMenus,
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
        ffonction : fonctionIcon,
        prc: couleurNouveaux,
    }

    var savedTxtData=[];

    //--- Initialisation
    const navBrand=document.querySelector('nav a.navbar-brand');
    if(navBrand){
        switch(navBrand.href){
            case 'http://www.kraland.org/accueil' :
                main();
                break;
            case 'http://www.kraland.org/map/cybermonde' :
                cybermap();
                break;
            case 'http://www.kraland.org/help':
                //help();
                break;
            default:
                console.log('not yet');
                return;
        }
    }else{
       // check rapport privé
        function isReportPage() {
            return window.location.pathname === '/report'
            || document.getElementById('myTab');
        }
        if (isReportPage()) {
            rp();
        }
    }

    function main(){
        globalki();
        let navbar=document.getElementById('navbar');
        var kili, lia;
        if(navbar){
            kili=navbar.querySelector('li.dropdown.active');
            if(kili){
                lia=kili.querySelector('a').textContent.trim().split(/\s+/)[0];
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
                let titleLeft = document.querySelector('#col-left .list-group-item');
                if(titleLeft){
                    let nameLeft=titleLeft.textContent.trim();
                    switch(nameLeft){
                        case 'Nouvelles' :
                            console.log('test');
                            motd();
                            break;
                        case 'Kramails' :
                            km();
                            break;
                        default:
                            console.log('err not main 2');
                            return;
                    }
                }

            }
        }else{
            console.log('err not main 1');
            return;
        }
    }

    function globalki(){
        if(!aparam.mc){document.getElementById('flap_closed').remove();}
        var contentki=document.getElementById('content');
        contentki.style.width='auto';
        var rowki=contentki.querySelector('.row');
        rowki.style.marginLeft='0';
        rowki.style.marginRight='0';

        //--- gestion pub et top
        var topKi=document.getElementById('top');
        topKi.style.height='auto';
        /*
        var noad=document.createElement('button');
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
        pinup();

        var cRight=document.getElementById('col-right');
        var containerf=cRight.querySelector('.container-fluid');
        containerf.style.padding='0px';
        containerf.style.margin='0px';
        var mBottomSize='5px'; // taille de marge inférieure entre les panels

        //--- détection de la page
        let path = window.location.pathname;
        switch(path) {
            case '/jouer/plateau':
                mainp();
                break;
            case '/jouer/materiel':
                matp();
                break;
            case '/jouer/perso':
                persop();
                break;
            case '/jouer/bat':
                batp();
                break;
            case '/jouer/pnj':
                pnjp();
                break;
            default:
        }

        function mainp(){
            //--- pj side
            let pjSide=cRight.querySelector('.dashboard');
            pjStyle(pjSide);

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
            boxStyle(bSide);

        }

        function matp(){
            let invSide=cRight.querySelector('.dashboard');
            boxStyle(invSide);
            let matSide=cRight.querySelectorAll('.dashboard')[1];
            boxStyle(matSide);
            let wpanel=matSide.querySelector("div.well");
            wpanel.style.padding='5px';
        }

        function pnjp(){

        }
        function batp(){

        }
        function persop(){
            let panels=containerf.querySelectorAll('.panel-default');
            for(let i=0;i<panels.length;i++){
                panels[i].style.marginBottom=mBottomSize;
                let panelHeading=panels[i].querySelector('.panel-heading');
                panelHeading.style.padding='5px';
                let panelBody=panels[i].querySelector('.panel-body');
                panelBody.style.padding='5px';
                let boxType=panels[i].querySelector('h3').lastChild.textContent.trim();
                switch(boxType){
                    case 'Citoyenneté':
                        tdStyle(panels[i]);
                        break;
                    case 'Maladies':
                        break;
                    case 'Finance':
                        nop(panels[i]);
                        break;
                    case'Organisations':
                        tdStyle(panels[i]);
                        break;
                    case'Avis de Recherche':
                        tdStyle(panels[i]);
                        break;
                    default:
                        console.log('not found persop boxType : '+boxType);
                }
            }
            function nop(panel){
                let panelp=panel.querySelectorAll('p');
                for(let i=0;i<panelp.length;i++){
                    panelp[i].style.margin='0 0 0 0';
                }
            }

            function tdStyle(panel){
                let alltd=panel.querySelectorAll('td');
                for(let i=0;i<alltd.length;i++){
                    alltd[i].style.padding='0px';
                }

            }
        }

        function pjStyle(dashboard){
            let panelDefault=dashboard.querySelectorAll('.panel-default');
            for(let i=0;i<panelDefault.length;i++){
                panelDefault[i].style.marginBottom=mBottomSize;
                let panelHeading=panelDefault[i].querySelector('.panel-heading');
                panelHeading.style.padding='5px';
                let panelBody=panelDefault[i].querySelector('.panel-body');
                panelBody.style.paddingTop='0px';
                panelBody.style.paddingBottom='0px';
                panelBody.style.paddingLeft='0px';
                let istd=panelBody.querySelector('td');
                var pLink;
                if(istd){
                    pLink=istd.querySelectorAll('a');
                    panelBody.style.paddingRight='2px';
                }else{
                    pLink=panelBody.querySelectorAll('a');
                    panelBody.style.paddingRight='0px';
                }
                for(let j=0;j<pLink.length;j++){
                    if(!istd){
                        let span = pLink[j].querySelector('span');
                        span.style.display = 'inline-block';
                        span.style.paddingRight = '3px';
                    }
                    pLink[j].style.clear = 'both';
                    let aColor=getComputedStyle(pLink[j]).borderBottomColor;
                    pLink[j].style.border='none';
                    pLink[j].style.padding='0px';
                    //pLink[j].style.display = 'block';
                    pLink[j].style.overflow = 'hidden';
                    pLink[j].style.textDecoration = 'none';
                    if(j>0 && pLink.length>0){
                        pLink[j].style.borderTop = '2px solid';
                        pLink[j].style.borderTopColor = aColor;
                    }
                    let ava=pLink[j].querySelector('img.pull-left');
                    ava.style.margin='5px';
                    ava.style.width=aparam.avaIg+'px';
                    ava.style.height=aparam.avaIg+'px';
                }
            }
        }

        function boxStyle(dashboard){
            let bpanels=dashboard.querySelectorAll('.panel.panel-default:not(.well)');
            for(let i=0;i<bpanels.length;i++){
                bpanels[i].style.marginBottom=mBottomSize;
                let boxType=bpanels[i].querySelector('h3').lastChild.textContent.trim();
                if(boxType!=='Bâtiment'){pbStyle(bpanels[i]);}
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
                        iStyle(bpanels[i]);
                        break;
                    case "Argent" :
                        vStyle();
                        break;
                    case "Bâtiments Privés":
                        break;
                    case "Bâtiments Publics":
                        break;
                    case "Employés":
                        break;
                    case "Employés de fonction":
                        break;
                    case "Esclaves":
                        break;
                    default :
                        console.log('boxType unknown : '+boxType);
                }
            }

            function cStyle(cbox){

            }

            function mStyle(mbox){

            }
            function iStyle(ibox){

            }

            // box batiment
            function bStyle(bbox){
                let abox=bbox.querySelector('a');
                abox.style.border='none';
                abox.style.padding='0px';
                let pbody=bbox.querySelector('.panel-body');
                pbody.style.paddingBottom='5px';
                pbody.style.paddingTop='5px';
                let pdb=bbox.querySelector('.panel-body .row .progress');
                pdb.style.marginBottom='0px';
            }

            // page inventaire
            function vStyle(){
            }

        }

        function pbStyle(panel){
            let panelTitle=panel.querySelector('.panel-heading');
            panelTitle.style.padding='5px';

            let pbody=panel.querySelector('.panel-body');
            pbody.style.padding='0px';
            let items=pbody.querySelectorAll('a');
            for(let i=0;i<items.length;i++){
                items[i].style.padding='5px';
                items[i].style.borderBottom='none';
                items[i].style.borderLeft='none';
                items[i].style.borderRight='none';
                }
            let titleh=pbody.querySelectorAll('div.list-group-item');
            for(let i=0;i<titleh.length;i++){
                titleh[i].style.padding='5px';
                titleh[i].style.borderBottom='none';
                titleh[i].style.borderLeft='none';
                titleh[i].style.borderRight='none';
                //titleh[i].querySelector('h4').style.fontWeight='bold';
            }
        }

        function gbox(panel){

        }
    }

    function forum(){
        var cRight=document.getElementById('col-right');
        var cLeft=document.getElementById('col-left');
        var content=document.getElementById('content');
        var row=content.querySelector('.row');

        let isTopicPage=document.querySelector('#content ul.media-list.forum');
        if(isTopicPage){
            topicSetUp();
        }else if(aparam.fstyle){
            forumSetUp();
        }

        function topicSetUp(){
            // sujet
            /*
            cRight.style.width=aparam.twidth+'%';
            if(aparam.twidth<=80){
                cLeft.remove();
            }else{
                cLeft.style.width='auto';
                let fw=parseFloat(aparam.twidth);
                let cleftWidth=(100-fw);
                cLeft.style.maxWidth=cleftWidth+'%';
            }*/
            pinup();

            // avatar & cartouche
            var userinfo=document.querySelectorAll('div.user-info');
            for(let i=0;i<userinfo.length;i++){
                let ava=userinfo[i].querySelector('.avatar');
                if(ava){
                    ava.classList.remove('img-thumbnail');
                    ava.style.display='inline';
                    ava.style.width=aparam.avaFora+'px';
                    ava.style.maxWidth='100%';
                    ava.style.maxHeight=(2*aparam.avaFora)+'px';
                    ava.style.marginBottom='5px';
                }

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
                if(rangImgDiv){
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

            //--- post
            var bquote=cRight.querySelectorAll('blockquote');
            if(bquote.length>0){
                for(let i=0;i<bquote.length;i++){
                    bquote[i].querySelector('i').remove();
                }
            }
            ezSpoiler();

            //--- insertion formulaire réponse
            let libox=document.createElement('li');
            let replyBox=document.createElement('div');
            let ultopic=document.querySelector('');

            var replyb=document.querySelectorAll('a[data-original-title="répondre"]');

            var tdoc=loadPage(replyb[0].href);

            const form = tdoc.querySelector('form');
            if (!form) {
                console.log('No form found in ',replyb[0].href);
                return;
            }
            let formClone=form.cloneNode(true);

            for(let i=0;i<replyb.length;i++){

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
                let allurl=document.querySelectorAll('a');
                allurl.forEach(u=>{u.style.textDecoration='none';})
            }
        }
    }

    function monde(){
        //--- naviguer avec les flèches
        try{
            let currentp=document.getElementById('col-right').querySelector('ul.pagination li.active');
            arrowsHead(currentp);
        }catch(err){
            console.log(err);
        }
        pinup();
        ezSpoiler();
    }

    function km(){
        var cLeft=document.getElementById('col-left');

    }

    //+------------ Carte du cybermonde --------------+
    function cybermap(){
        let mapCont=document.querySelector('#mapname-container');


        /*mapCont.style.textAlign='center';
        mapCont.parentNode.style.removeProperty('left');
        mapCont.parentNode.query

        mapCont.parentNode.parentNode.style.width='100%';
        mapCont.parentNode.parentNode.style.textAlign='center';
        mapCont.parentNode.parentNode.style.display='flex';
        mapCont.parentNode.parentNode.style.alignItems='center';
        mapCont.parentNode.parentNode.style.justifyContent='center';
        */

    }

    //+------------ Rapport privé --------------+
    function rp(){
        var newEv=document.querySelectorAll('.bg-info');
        for(let i=0;i<newEv.length;i++){
            newEv[i].style.backgroundColor=getComputedStyle(document.body).backgroundColor;

            newEv[i].style.borderLeft = `3px solid ${aparam.prc}`;
            /*if(i===newEv.length-1){
                newEv[i].style.borderBottom = '2px solid red';
                // bordure horizontale, discord style
            }*/
        }
        ezSpoiler();
    }

    //+------------ Ergonomie des Spoiler --------------+
    function ezSpoiler(){
        var allspoiler=kdocument.querySelectorAll(".pre-spoiler");
        for(let i=0;i<allspoiler.length;i++){
            allspoiler[i].addEventListener("click",displayB,false);
        }
    }
    function displayB(){
        this.parentNode.querySelector(".spoiler").style.display="";
        this.removeEventListener("click", displayB);
        this.addEventListener("click",displayN,false);
    }
    function displayN(){
        this.parentNode.querySelector(".spoiler").style.display="none";
        this.removeEventListener("click",displayN);
        this.addEventListener("click",displayB,false);
    }

    //+------------ Epingler les menus ---------------+
    function pinup(){
        var cLeft=document.getElementById('col-left');
        var cRight=document.getElementById('col-right');
        var content=document.getElementById('content');
        content.style.width='100%';
        var row=content.querySelector('.row');
        if(!aparam.pinup){
            row.style.display = 'flex';
            row.style.flexDirection = 'row';
            row.style.width = '100%';

            cLeft.style.flex = '0 0 auto';
            cLeft.style.width = 'fit-content';
            //cLeft.style.minWidth = 'fit-content';
            //cLeft.style.maxWidth = '17%';

            let hr=cLeft.querySelector('hr')
            if(hr){
                    hr.style.marginTop='3px';
                    hr.style.marginBottom='3px';
            }
            cRight.style.width = 'auto';
            cRight.style.display = 'flex';
            cRight.style.flex = '1 1 0';
            cRight.style.flexDirection = 'column';
        }else{
            const navbar = document.querySelector('nav');
            const footer = document.querySelector('footer');
            const parent = document.getElementById('content');
            document.getElementById('top-link').remove();

            const navbarHeight = navbar.offsetHeight;
            const footerHeight = footer.offsetHeight;

            parent.style.height = `calc(100vh - ${navbarHeight + footerHeight}px)`;
            parent.style.display = 'flex';
            parent.style.flexDirection = 'row';
            parent.style.overflow = 'hidden';

            // cLeft
            cLeft.style.width = 'fit-content';
            cLeft.style.overflow = 'hidden';

            // cRight
            cRight.style.display = 'flex';
            cRight.style.flexDirection = 'column';
            cRight.style.flex = '1 1 0';
            cRight.style.minWidth = '0';
            cRight.style.height = '100%';
            cRight.style.overflowY = 'auto';
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

    //---GET request
    async function loadPage(theURL) {
        const response = await fetch(theURL, { credentials: 'same-origin' });

        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }

        const html = await response.text();

        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, 'text/html');

        return htmlDoc;
    }
    //--- fin du code
})();