// ==UserScript==
// @name         Noxtrip Scripts
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  Lebo ktory rodic ma kurva cas to ratat
// @author       You
// @match        https://www.darkelf.cz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/552413/Noxtrip%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/552413/Noxtrip%20Scripts.meta.js
// ==/UserScript==

// v0.2
//- kuzla v hromadnom kupovani domov
//- navratnost - zapocitanie hodnosti
//- verb - ak je sypka ukazuje max per kolo s kupou domcekov, ak nie je tak max podla toho kedy sa kupi sypka
//- pridanie moznosti vypnut/zapnut predikciu nad 16 zemiek0
//- HEUREKA!!! Najdeny vzorec na obchodky dokonca aj cudzie!
//- pridana kontrola na opotrebovanie artefaktov herov
//
// v0.3
// -pridana historia ligy na mape
// v0.4
// - zmena local storage pre mapy na index DB lebo sa nemestia do local storagu
// - prerobenie predikcii na tlacitko
// v0.5
// odstranena chyba negativnych vlastnosti zeme test
// v0.6 (Puma deli nulou)
// Puma obchodkuje s 0 obyvatelmi a chce z toho prijmi tak to treba fixnut
// v0.7
// chyba historie mapy. Pridany datum k zaznamom na identifikaciu obsolete zaznamov
// uprava predikcie v ligach so zakazanymi stavbami
// v0.8 (Navratnost pre vsetkych)
// pridana tabulka navratnosti od najrychlejsieho po najpomalsie
// uprava navratnosti - domceky sa nezobrazuju ak je dost volnych domov a existuju ine moznosti navratnosti.
// pridana moznost vypoctu navratnosti Magickej Klimy - vracia hodnotu v kolach. Berie do uvahy magicke zmluvy/elfi bonus atd.
// pridana moznost vypoctu navratnosti Priaznivka v zlatych. Vracia hodnotu zisku zemky posledneho predikovaneho kola cisto z PP nasobenu poctom kol rasy
// - v tooltipe sa zobrazuje cena many pre PP kupena na trhu (elfo bonus sa zapocitava)
// v0.81
// opravy po LPho zmenach
// v0.9
// Pridanie kombinacie jednotiek
// v0.91 (Bomi nema numericku klavesnicu)
// Pridane tlacitka na hromadne verbovanie/prepustenie
// v0.92
// Upravy koli zmenam ras
// v0.93
// Spoko/nespo na mape

(function() {
    'use strict';

    // Zapinanie scriptov na strankach
    var vylepsenieCentrala = true; // vypnutie celej centraly
    var vylepsenieCentralaVerb = true; // verb  a navratnosti v centrale
    var vylepsenieCentralaPredikcie = true; // predikcie ziskov v centrale do buducna + zoradena navratnost tabulka
    var vylepsenieDE = true; // MO na zemke DE
    var vylepsenieVojsko = true; // Verb na stranke armady
    var vylepsenieHromadneNakupovanieDomov = true; //Zobrazenie magickeho klima a priaznivka pri zemkach v h.k.d.
    var vylepsenieArtefakty = true; // Zobrazenie varaovania pri znicenych artoch
    var vylepsenieHistoria = true; // Uchovanie a zobrazenie historie ligy
    var vylepsenieKombinaciaJednotiek = true; // Zobrazovanie tlacidiel na vypocet kombinacie jednotiek
    var vylepseniePorodnostMapa = true; // Zobrazovanie porodnosti na mape sovjich zemiek


    // Nastavovacie premenne
    var minPercentoPoskodeniaArtefaktu = 3; // ak artefakt prekroci hranicu smerom na dol pribudne hlasenie pre hera
    var pocetdDniHistorie = 4
    // Pocet dni pre ligu ulozenia historie mapy

    //Bulharske konstanty
    var ZISK_OBCHODKA_CUDZIA_ZEM = 0.1;

    // Nedostatky pri predikciach:
    // 1. Script nema skade vediet ze je obchodka platna do konca dna ale preplacnuta inou zmlouvou s platnostou zajtra. Tieto obchodky sa nezarataju do predikcii

    var zeme = [];
    var async = {
        budovy: false,
        smlouvy: false,
        atributy: false,
        vojsko: false
    };
    var pocasie = {};
    var hernyDen = {};
    var ligaDetail = {};
    var hodnost = 0;
    var aliancia = false;
    var alianciaDetail = {};
    var trzisteDetail = {};
    var db;

    process_centrala();
    process_zem_de();
    process_vojsko();
    process_hromadne_kupovanie_domov();
    process_mapa();
    process_not_mine_land();

    function process_centrala( ){
        if ( !document.URL.match("https://www.darkelf.cz/centrala.asp" )){
            return;
        }

        if (!vylepsenieCentrala){
            return;
        }

        addCentralaButton(0);

    }

    function doPrediction(){
        var budovyPromises = [];
        var smlouvyPromises = [];
        var attributyPromises = [];
        var vojskoPromises = [];

        var doVojskoPromise = JSON.parse(localStorage.getItem("noxtrip_prediction_mk"));

        // Ziskanie hodnosti
        var documentTH = document.getElementsByTagName('TH');
        for (var i = 0; i<documentTH.length; i++){
            if (documentTH[i].innerText === "Za hodnost"){
                hodnost = Number(documentTH[i].nextElementSibling.nextElementSibling.nextElementSibling.innerText.match(/\((.*)\)/)[1]);
                if (documentTH[i].parentElement.nextElementSibling.firstElementChild.innerHTML.includes("Poplatek alianci")){
                    aliancia = true;
                }
                break;
            }
        }


        // Pre kazdu zemku z centraly si pripravime promisy na ziskanie dodatocnych dat a vytvorim si tabulku zemiek s prazdnimi atributmy
        for (i = 0; i < document.links.length; i++){
            var linkZeme = document.links[i];
            if ( linkZeme.href.includes("/e.asp?id=") ){
                var id = linkZeme.href.match(/id=(.*)/)[1];
                var zemeTableRow = linkZeme.parentElement.parentElement;
                var zemeTableCell = linkZeme.parentElement;

                budovyPromises.push(getBudovyInfoPromise(id));
                smlouvyPromises.push(getSmlouvyInfoPromise(id));
                attributyPromises.push(getAttributyInfoPromise(id));
                if (doVojskoPromise){
                    vojskoPromises.push(getVojskoInfoPromise(id));
                }

                zeme.push( {
                    name :linkZeme.innerText ,
                    id : id,
                    href : linkZeme.href,
                    zemeTableRow : zemeTableRow,
                    zemeTableCell: zemeTableCell,
                    obyvateliaPoKolach : [],
                    smlouvy : [],
                    budovy : [],
                    attributy: {}
                } );

            }
        }

        //Asynchrone volania na doplnenie informacii k zemkam z inych podstranok
        Promise.all(attributyPromises).then((results) => {
            for (var i = 0; i < results.length; i++){
                for (var j = 0; j < zeme.length; j++){
                    if (zeme[j].id === results[i].id){
                        zeme[j].attributy = results[i].attributy;
                        break;
                    }
                }
            }
            async.attributy = true;
            processZemky();
        });

        Promise.all(budovyPromises).then((results) => {
            for (var i = 0; i < results.length; i++){
                for (var j = 0; j < zeme.length; j++){
                    if (zeme[j].id === results[i].id){
                        zeme[j].budovy = results[i].budovy;
                    }
                }
            }
            async.budovy = true;
            processZemky();
        });

        Promise.all(smlouvyPromises).then((results) => {
            for (var i = 0; i < results.length; i++){
                for (var j = 0; j < zeme.length; j++){
                    if (zeme[j].id === results[i].id){
                        zeme[j].smlouvy = results[i].smlouvy;
                        break;
                    }
                }
            }
            async.smlouvy = true;
            processZemky();
        });
        if (doVojskoPromise){
            Promise.all(vojskoPromises).then((results) => {
                for (var i = 0; i < results.length; i++){
                    for (var j = 0; j < zeme.length; j++){
                        if (zeme[j].id === results[i].id){
                            zeme[j].vojsko = results[i].vojsko;
                            break;
                        }
                    }
                }
                async.vojsko = true;
                processZemky();
            });
        }
    }

    //Hlavna metoda pre spracovanie vsetkych zemiciek po asynchronom nacitani ich dat
    function processZemky(){
        var doVojskoPromise = JSON.parse(localStorage.getItem("noxtrip_prediction_mk"));
        if (!zeme || !async.budovy || !async.smlouvy || !async.attributy || ( doVojskoPromise && !async.vojsko ) ){
            return;
        }

        getHlaseniPromise().then(function(result){
            hernyDen = result;
            return getLigaDetailPromise( hernyDen.liga );
        }).then( function(result){
            ligaDetail = result;
            return getAlianciaPromise( );
        }).then( function(result){
            alianciaDetail = result;
            return getTrzistePromise( );
        }).then( function(result){
            trzisteDetail = result;
            return getListaHornyPromise( );
        }).then(function(result){
            pocasie = result;
            return getListaPromise( );
        }).then(function(result){
            var kola = result;
            if (zeme){
                var rasa = zeme[0].attributy.rasa;
            }
            for (var i=0; i<zeme.length; i++){
                // Vypocty po nacitani vsetkych dat zeme
                recalculateObyvatelov( zeme[i], kola );
            }

            // Ak uz nemam ziadne kola spravim vypocet aspon pre aktualne kolo aby som to mohol pouzit pre vypocet navratnosti
            if (kola.dostupnych_kol === 0){
                var pocetPredikovanychKol = 1;
            }else{
                pocetPredikovanychKol = kola.dostupnych_kol;
            }
            var predictedZisky = [];
            for (var j=0; j<pocetPredikovanychKol; j++){
                predictedZisky.push({
                    kolo:(j+1),
                    predictedZiskZlato : 0,
                    predictedZiskMana: 0
                })
            }

            var doMKprediction = JSON.parse(localStorage.getItem("noxtrip_prediction_mk"));
            var doPPprediction = JSON.parse(localStorage.getItem("noxtrip_prediction_pp"));
            if (zeme[0]){
                var elfBonus = getElfBonus(zeme[0]);
            }else{
                elfBonus = 0;
            }
            var cenaPP = 100 * ( 1 - elfBonus ) * trzisteDetail.koupit;

            for (i=0; i<zeme.length; i++){
                // Vypocty po nacitani vsetkych dat zeme a predikcii ziskov/navratnosti
                // mana sa pocita jednoduchsie nakolko nepribudaju obyvatelia
                recalculateZisk( zeme[i], zeme, kola, pocasie, predictedZisky, pocetPredikovanychKol);
                recalculateNavratnost( zeme[i],pocasie);
                if (doMKprediction){
                    recalculateNavratnostMK( zeme[i], pocasie, zeme, elfBonus );
                }
                if (doPPprediction){
                    recalculateNavratnostPP( zeme[i], elfBonus );
                }

                // Pridanie riadku do centraly pre danu zemku
                if ( vylepsenieCentralaVerb){
                    var verbInfoRow = getVerbInfoRow( zeme[i],false );
                    zeme[i].zemeTableRow.parentNode.insertBefore(verbInfoRow,zeme[i].zemeTableRow.nextSibling);
                    if (doMKprediction || doPPprediction){
                        var otherNavratnostRow = getOtherPredictionsInfoRow( zeme[i], cenaPP);
                        zeme[i].zemeTableRow.parentNode.insertBefore(otherNavratnostRow,verbInfoRow.nextSibling);
                    }
                }

            }
            applyHodnostAndAliancia(predictedZisky,rasa);
            if ( vylepsenieCentralaPredikcie){
                appendPredictedZiskyTable(predictedZisky);
                appendSortedNavratnostTable(zeme);
            }


        });

    }

    function applyHodnostAndAliancia(predictedZisky,rasa){
        var accumulatedZlato = 0;
        var accumulatedMana = 0;
        var hodnostModifier = getHodnostModifier(hodnost,ligaDetail.hodnostZaklad,rasa);

        for (var j=0; j<predictedZisky.length; j++){
            if (predictedZisky[j].predictedZiskZlato > 0){
                predictedZisky[j].predictedZiskZlato = Math.floor(predictedZisky[j].predictedZiskZlato * hodnostModifier );
                if (aliancia){
                    predictedZisky[j].predictedZiskZlato = predictedZisky[j].predictedZiskZlato - Math.floor((predictedZisky[j].predictedZiskZlato * 0.04));
                }
            }
            predictedZisky[j].predictedZiskZlato = accumulatedZlato + predictedZisky[j].predictedZiskZlato;
            accumulatedZlato = predictedZisky[j].predictedZiskZlato;
            if (predictedZisky[j].predictedZiskMana > 0){
                predictedZisky[j].predictedZiskMana = Math.floor(predictedZisky[j].predictedZiskMana * hodnostModifier );
                if (aliancia){
                    predictedZisky[j].predictedZiskMana = predictedZisky[j].predictedZiskMana - Math.floor((predictedZisky[j].predictedZiskMana * 0.04));
                }
            }
            predictedZisky[j].predictedZiskMana = predictedZisky[j].predictedZiskMana + accumulatedMana;
            accumulatedMana = predictedZisky[j].predictedZiskMana;
        }
    }

    function getHodnostModifier(hodnost,hodnostZaklad,rasa){
        var hodnostModifier = hodnost / hodnostZaklad;
        if ( hodnostModifier > 2){
            hodnostModifier = 2;
        }else if(( hodnostModifier < 0.5 ) && rasa.includes("Barbaři") ){
            hodnostModifier = 0.5;
        }else if( hodnostModifier < 0.25 ){
            hodnostModifier = 0.25;
        }
        return hodnostModifier;
    }

    function appendPredictedZiskyTable(predictedZisky){
        if (predictedZisky){
            var predictedZiskyTable = document.createElement('table');
            predictedZiskyTable.id = 'noxtrip_predicted_zisky_table';
            var customElementTr = document.createElement('tr');
            var customElementTd = document.createElement('th');
            customElementTd.innerHTML = "Predikcia ziskov";
            customElementTd.colSpan = 3;
            customElementTr.appendChild(customElementTd);
            predictedZiskyTable.appendChild(customElementTr);
            customElementTr = document.createElement('tr');
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = "Kolo";
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = "Zisk zlato";
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = "Zisk mana";
            customElementTr.appendChild(customElementTd);
            predictedZiskyTable.appendChild(customElementTr);
            for (var i=0; i <predictedZisky.length; i++){
                customElementTr = document.createElement('tr');
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = predictedZisky[i].kolo;
                customElementTr.appendChild(customElementTd);
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = predictedZisky[i].predictedZiskZlato;
                customElementTr.appendChild(customElementTd);
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = predictedZisky[i].predictedZiskMana;
                customElementTr.appendChild(customElementTd);
                predictedZiskyTable.appendChild(customElementTr);
            }
            var ziskyStandardTable = document.getElementsByTagName('Table')[1];
            ziskyStandardTable.parentNode.insertBefore(predictedZiskyTable,ziskyStandardTable.nextSibling);
        }
    }

    function appendSortedNavratnostTable(zeme){
        if (zeme.length > 0){
            var sortedZiskyTable = document.createElement('table');
            sortedZiskyTable.id = 'noxtrip_sorted_zisky_table';
            var customElementTr = document.createElement('tr');
            var customElementTd = document.createElement('th');
            customElementTd.innerHTML = "Triedená návratnosť";
            customElementTd.colSpan = 2;
            customElementTr.appendChild(customElementTd);
            sortedZiskyTable.appendChild(customElementTr);
            var sortedZemeNavratnost = zeme.sort((a, b) => {
                return a.navratnostBudov[0].navratnost - b.navratnostBudov[0].navratnost;
            });
            for (var i=0; i<sortedZemeNavratnost.length; i++){
                customElementTr = document.createElement('tr');
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = sortedZemeNavratnost[i].name;
                customElementTr.appendChild(customElementTd);
                customElementTd = document.createElement('td');
                customElementTd.innerHTML = '<img src="images/m/'+sortedZemeNavratnost[i].navratnostBudov[0].img+'.gif" title = "'+ sortedZemeNavratnost[i].navratnostBudov[0].name + '"class="i"> (' + sortedZemeNavratnost[i].navratnostBudov[0].navratnost + ')';
                customElementTr.appendChild(customElementTd);
                sortedZiskyTable.appendChild(customElementTr);
            }
            var predictedZiskyTable = document.getElementById('noxtrip_predicted_zisky_table');
            predictedZiskyTable.parentNode.insertBefore(sortedZiskyTable,predictedZiskyTable.nextSibling);
        }
    }

    function recalculateObyvatelov(zeme,kola){
        if (zeme.budovy.find((str) => str === "Sýpka - obilná")){
            var sypkaVkole = 0;
        }else{
            sypkaVkole = 99;
        }
        if (zeme.budovy.find((str) => str === "Magický háj")){
            var jeHajek = true;
        }else{
            jeHajek = false;
        }
        zeme.obyvateliaPoKolach = getObyvateliaPoKolach( kola.dostupnych_kol, zeme.attributy.obyvatelov, sypkaVkole, zeme.attributy.porodnost , zeme.attributy.volnych_domov, jeHajek);
        zeme.maxObyvatelov = obyvatelovZaXKol(kola.dostupnych_kol,zeme.attributy.obyvatelov,sypkaVkole,zeme.attributy.porodnost,jeHajek);
    }

    function recalculateNavratnost( zeme, pocasie ){
        var budovyNumber = getDomyNumberPreRasu(zeme.attributy.rasa);
        var trpBonus = 0;
        var dielna = false;
        var navratnost = 0;
        var navratnostBudov = [];
        var hodnostModifier = getHodnostModifier(hodnost,ligaDetail.hodnostZaklad,zeme.attributy.rasa);
        var trpBonusEnabled = false;
        if (zeme.attributy.rasa.includes("Trpaslíci")){
            trpBonus += 0.2;
            var somTrp = true;
            var samSeba = true;
            trpBonusEnabled = true;
        }
        for (var i = 0; i < alianciaDetail.players.length; i++){
            if ( isSynergyRasaGive(alianciaDetail.players[i].rasa) ){
                if ( alianciaDetail.players[i].rasa.includes("Trpaslíci") ){
                    trpBonusEnabled = true;
                    if (samSeba){
                        samSeba = false;
                        continue;
                    }
                }
                trpBonus += 0.05;
            }
        }
        if (somTrp){
            if (trpBonus > 0.4){
                trpBonus = 0.4;
            }
        }else{
            if (trpBonus > 0.3){
                trpBonus = 0.3;
            }
        }
        if (!isSynergyRasaRecieve(zeme.attributy.rasa) || trpBonusEnabled === false){
            trpBonus = 0;
        }
        if (!zeme.budovy.find((str) => str === "Mithrilový důl") && zeme.attributy.rasa.includes("Trpaslíci")){
            navratnost = Math.ceil( ( 2800 * (1-trpBonus) ) / (Math.floor(200 * hodnostModifier * zeme.attributy.magia_zlato)) );
            navratnostBudov.push({name: "Mithrilový důl", navratnost: navratnost, img : "b143"});
        }
        if (!zeme.budovy.find((str) => str === "Zlatý důl")){
            navratnost = Math.ceil( ( 2500 * (1-trpBonus) ) / (Math.floor(100 * hodnostModifier * zeme.attributy.magia_zlato)) );
            navratnostBudov.push({name: "Zlatý důl", navratnost: navratnost, img : "b140"});
        }
        if (!zeme.budovy.find((str) => str === "Rudný důl")){
            navratnost = Math.ceil( ( 1400 * (1-trpBonus) ) / (Math.floor(50 * hodnostModifier * zeme.attributy.magia_zlato)) );
            navratnostBudov.push({name: "Rudný důl", navratnost: navratnost, img : "b70"});
        }
        if (!zeme.budovy.find((str) => str === "Dílna")){
            navratnost = Math.ceil( 600 / Math.floor( ( zeme.predictedZiskyZlato[0] + zeme.predictedZiskyZlatoObchodka[0] + zeme.predictedZizkZlatoObchodkaCudzia[0]) * 0.05 * hodnostModifier) );
            navratnostBudov.push({name: "Dílna", navratnost: navratnost, img : "b90"});
        }else{
            dielna = true;
        }
        var cenaDomu = getCenaDomu(zeme.attributy.domov,pocasie.domy);
        var ziskObyvatela = ( zeme.predictedZiskyZlato[0] + zeme.predictedZiskyZlatoObchodka[0] + zeme.predictedZizkZlatoObchodkaCudzia[0] ) / zeme.obyvateliaPoKolach[0];
        if (dielna){
            ziskObyvatela = ziskObyvatela * 1.05;
        }

        var domyNotRelevant = true;
        if ( pribudneObyvatelov(zeme.attributy.volnych_domov, zeme.budovy.find((str) => str === "Sýpka - obilná"), zeme.attributy.porodnost, zeme.budovy.find((str) => str === "Magický háj") ) > zeme.attributy.volnych_domov ){
            domyNotRelevant = false;
        }

        // navratnost domcekov pridavame do listu len v pripade ze nie je dost domov alebo nic ine v navratnosti nie je (vsetko postavene)
        if ( domyNotRelevant == false || navratnostBudov.length == 0 ){
            navratnost = Math.floor(cenaDomu / Math.floor(ziskObyvatela*hodnostModifier));
            navratnostBudov.push({name: "Domy", navratnost: navratnost, img : budovyNumber+"v3"});
        }

        zeme.navratnostBudov = navratnostBudov.sort((a, b) => {
            return a.navratnost - b.navratnost;
        });

    }

    function getElfBonus( zeme ){
        var elfBonus = 0;
        var elfBonusEnabled = false;
        if (zeme.attributy.rasa.includes("Elfové")){
            elfBonus += 0.2;
            var somElf = true;
            var samSeba = true;
            elfBonusEnabled = true;
        }
        for (var i = 0; i < alianciaDetail.players.length; i++){
            if ( isSynergyRasaGive(alianciaDetail.players[i].rasa) ){
                if (alianciaDetail.players[i].rasa.includes("Elfové")){
                    elfBonusEnabled = true;
                    if (samSeba){
                        samSeba = false;
                        continue;
                    }
                }
                elfBonus += 0.05;
            }
        }
        if (somElf){
            if (elfBonus > 0.4){
                elfBonus = 0.4;
            }
        }else{
            if (elfBonus > 0.3){
                elfBonus = 0.3;
            }
        }
        if (!isSynergyRasaRecieve(zeme.attributy.rasa) || elfBonusEnabled === false){
            elfBonus = 0;
        }
        return elfBonus;
    }

    function recalculateNavratnostMK( zeme, pocasie, vsetkyZeme, elfBonus){
        var hodnostModifier = getHodnostModifier(hodnost,ligaDetail.hodnostZaklad,zeme.attributy.rasa);
        if (!zeme.vojsko){
            return;
        }
        var ziskManyVlastnyMagoviaBezMK = zeme.vojsko.magov * zeme.attributy.bonusMana * pocasie.mana;
        var ziskManyMagickeSmlouvyBezMK = calculateZiskMagickeSmlouvyBezMagie(zeme, vsetkyZeme);
        var ziskManyZoStaviebBezMK = getZiskManyZoStaviebBezMagie(zeme);
        var ziskManyVlastnyBezMK = ziskManyVlastnyMagoviaBezMK + ziskManyMagickeSmlouvyBezMK + ziskManyZoStaviebBezMK;
        var ziskManyCudzieMagickeSmlouvyBezMK = calculateZiskCudzieMagickeSmlouvyBezMagie( zeme, ziskManyVlastnyBezMK * zeme.attributy.magia_mana);

        zeme.navratnostMK = Math.ceil( (150.0 * ( 1 - elfBonus )) / Math.floor( (( ziskManyVlastnyBezMK + ziskManyCudzieMagickeSmlouvyBezMK ) * 0.3 ) * hodnostModifier ) );
    }

    // navratnost priaznivka si vypocitam ako rozdiel zisku zemky posledneho kola bez PP a s PP * pocet kol
    function recalculateNavratnostPP( zeme, elfBonus){
        var hodnostModifier = getHodnostModifier(hodnost,ligaDetail.hodnostZaklad,zeme.attributy.rasa);
        if (!zeme.predictedZiskyZlato){
            return;
        }

        var posledneKolo = zeme.predictedZiskyZlato.length - 1;
        var ziskZaPosledneKoloBezPP = zeme.predictedZiskyZlato[posledneKolo] + zeme.predictedZiskyZlatoObchodka[posledneKolo] + zeme.predictedZizkZlatoObchodkaCudzia[posledneKolo] + zeme.predictedZiskZlatoBudovy[posledneKolo];
        ziskZaPosledneKoloBezPP = ziskZaPosledneKoloBezPP / zeme.attributy.magia_zlato;
        var ziskZaPosledneKoloSPP = ziskZaPosledneKoloBezPP * 1.3;
        var ziskZPP = ( ziskZaPosledneKoloSPP - ziskZaPosledneKoloBezPP ) * getKolaNumberPreRasu(zeme.attributy.rasa);
        zeme.navratnostPP = Math.floor( ziskZPP * hodnostModifier );
    }

    //zisk zo stavieb s prihliadnutim na aktualnu magiu
    function getZiskManyZoStaviebBezMagie(zeme){
        var ziskManyStavby = 0;
        if (zeme.budovy.find((str) => str === "Posvátná studna")){
            ziskManyStavby += 5;
        }
        if (zeme.budovy.find((str) => str === "Obřadní svatyně")){
            ziskManyStavby += 5;
        }
        if (zeme.budovy.find((str) => str === "Malá magická věž")){
            ziskManyStavby += 15;
        }
        if (zeme.budovy.find((str) => str === "Střední mag věž")){
            ziskManyStavby += 40;
        }
        if (zeme.budovy.find((str) => str === "Velká mag věž")){
            ziskManyStavby += 80;
        }
        if (zeme.budovy.find((str) => str === "Pentagram")){
            ziskManyStavby += 3;
        }
        if (zeme.budovy.find((str) => str === "Posvátný Strom")){
            ziskManyStavby += 30;
        }
        ziskManyStavby = Math.ceil( zeme.attributy.magia_mana * ziskManyStavby );
        return ziskManyStavby ;
    }

    function getCenaDomu(domov, pocasieDomy){
        return Math.floor(( 60 + Math.pow( ( domov + 1) / 9, 2 )) * pocasieDomy );
    }

    function getVerbInfoRow(zeme,asSingleCell){
        var enti = false;
        if(zeme.attributy.rasa.includes("Enti")){
            enti = true;
        }

        var aktualnyVerb = getVerb( zeme.attributy.obyvatelov, zeme.attributy.domov, zeme.attributy.vojakov, enti );
        var verb = getVerb(zeme.maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
        var maxVerb = getMaxVerb(zeme.maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);

        var customElementTr = document.createElement('tr');
        var customElementTd = document.createElement('td');
        if (asSingleCell){
            customElementTd.innerHTML = "Max.v. \\ Max.v+d. = " + verb + " \\ " + maxVerb;
            customElementTr.appendChild(customElementTd);
        }else{
            if (zeme.navratnostBudov){
                customElementTd.innerHTML = "Act.v. \\ Max.v. \\ Max.v+d \\ Nav. ";
            }else{
                customElementTd.innerHTML = "Act.v. \\ Max.v. \\ Max.v+d ";
            }
            if (zeme.zemeTableCell){
                customElementTd.style.cssText = zeme.zemeTableCell.style.cssText;
            }
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            if (zeme.navratnostBudov){
                var title = zeme.navratnostBudov[0].name;
                if (zeme.navratnostBudov[1]){
                    title = title + " (Ďalšia: " + zeme.navratnostBudov[1].name + "(" + zeme.navratnostBudov[1].navratnost + ") )"
                }
                customElementTd.innerHTML = aktualnyVerb + " \\ "+ verb + " \\ " + maxVerb + '\\ <img src="images/m/'+zeme.navratnostBudov[0].img+'.gif" title = "'+ title + '"class="i"> (' + zeme.navratnostBudov[0].navratnost + ')';
            }else{
                customElementTd.innerHTML = aktualnyVerb + " \\ "+ verb + " \\ " + maxVerb ;
            }
            customElementTd.colSpan = 3;
            customElementTr.appendChild(customElementTd);
        }
        return customElementTr;
    }

    function getOtherPredictionsInfoRow(zeme, cenaPP){

        var customElementTr = document.createElement('tr');
        var customElementTd = document.createElement('td');

        if (zeme.navratnostMK){
            customElementTd.innerHTML = "Náv. MK"
        }
        if (zeme.navratnostPP){
            if (customElementTd.innerHTML){
                customElementTd.innerHTML = customElementTd.innerHTML + " \\ Náv. PP";
            }else{
                customElementTd.innerHTML = "Náv. PP";
            }
        }
        customElementTr.appendChild(customElementTd);

        customElementTd = document.createElement('td');
        if (zeme.navratnostMK){
            customElementTd.innerHTML = zeme.navratnostMK;
        }
        if (zeme.navratnostPP){
            if (customElementTd.innerHTML){
                customElementTd.innerHTML = customElementTd.innerHTML + " \\ " + zeme.navratnostPP + " zl";
                customElementTd.title = "Cena many pre PP na trhu:" + cenaPP + " zl";
            }else{
                customElementTd.innerHTML = zeme.navratnostPP + " zl";
                customElementTd.title = "Cena many pre PP na trhu:" + cenaPP + " zl";
            }
        }
        customElementTd.colSpan = 3;
        customElementTr.appendChild(customElementTd);
        return customElementTr;
    }

    function getVerbPredictionTableWithoutSypka(zeme,kola){
        var enti = false;
        if(zeme.attributy.rasa.includes("Enti")){
            enti = true;
        }

        var predictedVerbTable = document.createElement('table');
        var customElementTr = document.createElement('tr');
        var customElementTd = document.createElement('th');
        customElementTd.innerHTML = "Predikcia max. verbu - sýpka";
        customElementTd.colSpan = 4;
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);
        customElementTr = document.createElement('tr');
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Sypka v kole";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Max. v.";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Max. v+d";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Dokúpiť domov (cena)";
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);

        if (zeme.budovy.find((str) => str === "Magický háj")){
            var jeHajek = true;
        }else{
            jeHajek = false;
        }

        for(var i=0; i<kola.dostupnych_kol; i++){
            var maxObyvatelov = obyvatelovZaXKol(kola.dostupnych_kol,zeme.attributy.obyvatelov,i,zeme.attributy.porodnost,jeHajek);
            var verb = getVerb(maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
            var dokupitDomov = 0;
            var cenaDomov = 0;
            if ((maxObyvatelov+zeme.attributy.vojakov ) > zeme.attributy.domov){
                dokupitDomov = (maxObyvatelov+zeme.attributy.vojakov ) - zeme.attributy.domov;
                for (var j = 0; j < dokupitDomov; j++){
                    cenaDomov += getCenaDomu(zeme.attributy.domov+j,pocasie.domy)
                }
            }
            var maxVerb = getMaxVerb(maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
            customElementTr = document.createElement('tr');
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = i;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = verb;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = maxVerb;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = dokupitDomov + ' (' + cenaDomov + ')';
            customElementTr.appendChild(customElementTd);
            predictedVerbTable.appendChild(customElementTr);
        }
        return predictedVerbTable;
    }

    function getVerbPredictionTableWithSypka(zeme,kola,pocasie){
        var enti = false;
        if(zeme.attributy.rasa.includes("Enti")){
            enti = true;
        }

        var predictedVerbTable = document.createElement('table');
        var customElementTr = document.createElement('tr');
        var customElementTd = document.createElement('th');
        customElementTd.innerHTML = "Predikcia max. verbu";
        customElementTd.colSpan = 3;
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);
        customElementTr = document.createElement('tr');
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Kolo";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Max. v.";
        customElementTr.appendChild(customElementTd);
        customElementTd = document.createElement('td');
        customElementTd.innerHTML = "Dokúpiť domov (cena)";
        customElementTr.appendChild(customElementTd);
        predictedVerbTable.appendChild(customElementTr);

        if (zeme.budovy.find((str) => str === "Magický háj")){
            var jeHajek = true;
        }else{
            jeHajek = false;
        }

        for(var i=1; i<=kola.dostupnych_kol; i++){
            var maxObyvatelov = obyvatelovZaXKol(i,zeme.attributy.obyvatelov,0,zeme.attributy.porodnost,jeHajek);
            var dokupitDomov = 0;
            var cenaDomov = 0;
            if ((maxObyvatelov+zeme.attributy.vojakov ) > zeme.attributy.domov){
                dokupitDomov = (maxObyvatelov+zeme.attributy.vojakov ) - zeme.attributy.domov;
                for (var j = 0; j < dokupitDomov; j++){
                    cenaDomov += getCenaDomu(zeme.attributy.domov+j,pocasie.domy)
                }
            }
            var maxVerb = getMaxVerb(maxObyvatelov,zeme.attributy.domov,zeme.attributy.vojakov,enti);
            customElementTr = document.createElement('tr');
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = i;
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = maxVerb
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            customElementTd.innerHTML = dokupitDomov + ' (' + cenaDomov + ')';
            customElementTr.appendChild(customElementTd);
            predictedVerbTable.appendChild(customElementTr);
        }
        return predictedVerbTable;
    }

    function addCentralaButton(){
        if ( document.getElementById("noxtrip_zisk_prediction_btn")){
            return;
        }

        var centalaTable = document.getElementById("centrala").getElementsByTagName("table")[1];
        var buttonTr = document.createElement('tr');
        var buttonTh = document.createElement('th');
        var button = document.createElement('button');
        button.innerText = "Predikcia a návratnosť";
        button.id = 'noxtrip_prediction_button';
        button.onclick = doPrediction;
        button.className = "butt_sml";
        buttonTh.colSpan = 4;
        buttonTh.appendChild(button);

        buttonTr.appendChild(buttonTh);
        centalaTable.getElementsByTagName('tbody')[0].insertBefore(buttonTr,centalaTable.getElementsByTagName("tr")[0] )

        var checkBoxTr = document.createElement('tr');
        var checkBoxTh = document.createElement('th');
        checkBoxTh.colSpan = 4;
        var customImg = document.createElement('img');
        customImg.setAttribute("src","images/kouzla/k50.gif");
        customImg.setAttribute("title","Návratnosť: Magická klíma");
        checkBoxTh.appendChild(customImg);
        var mkCheckbox = document.createElement('input');
        mkCheckbox.id = 'noxtrip_prediction_mk_checkbox';
        mkCheckbox.type = "checkbox";
        mkCheckbox.checked = JSON.parse(localStorage.getItem("noxtrip_prediction_mk"));
        mkCheckbox.addEventListener("change",function(event){
            localStorage.setItem("noxtrip_prediction_mk",event.srcElement.checked);
        });
        checkBoxTh.appendChild(mkCheckbox);

        customImg = document.createElement('img');
        customImg.setAttribute("src","images/kouzla/k40.gif");
        customImg.setAttribute("title","Návratnosť: Příznivé počasí");
        checkBoxTh.appendChild(customImg);
        mkCheckbox = document.createElement('input');
        mkCheckbox.id = 'noxtrip_prediction_pp_checkbox';
        mkCheckbox.type = "checkbox";
        mkCheckbox.checked = JSON.parse(localStorage.getItem("noxtrip_prediction_pp"));
        mkCheckbox.addEventListener("change",function(event){
            localStorage.setItem("noxtrip_prediction_pp",event.srcElement.checked);
        });

        checkBoxTh.appendChild(mkCheckbox);
        checkBoxTr.appendChild(checkBoxTh);
        centalaTable.getElementsByTagName('tbody')[0].insertBefore(checkBoxTr,centalaTable.getElementsByTagName("tr")[1] )


    }

    function recalculateZisk( zeme, vsetkyZeme, kola, pocasie, predictedZisky, pocetPredikovanychKol){
        var predictedZiskyZlato = [];
        var predictedZiskyZlatoObchodka = [];
        var predictedZiskZlatoBudovy = [];
        var predictedZizkZlatoObchodkaCudzia = [];

        var budovyZisk = 0;
        if (zeme.budovy.find((str) => str === "Mithrilový důl")){
            budovyZisk += 200;
        }
        if (zeme.budovy.find((str) => str === "Zlatý důl")){
            budovyZisk += 100;
        }
        if (zeme.budovy.find((str) => str === "Rudný důl")){
            budovyZisk += 50;
        }
        if (zeme.budovy.find((str) => str === "Dílna")){
            var dilna = true;
        }
        // Pre vsetky buduce kola vypocitame zisky many a zlata
        for (var i = 0; i < pocetPredikovanychKol; i++){
            //Zlato
            var ziskZaKolo = calculateZiskZlataZaKolo(zeme,zeme.obyvateliaPoKolach[i],pocasie);
            var ziskObchodkyZaKolo = calculateZiskObchodkyZaKolo( zeme, vsetkyZeme, i, pocasie, ziskZaKolo);
            if (dilna){
                ziskZaKolo = ziskZaKolo * 1.05;
                ziskObchodkyZaKolo = ziskObchodkyZaKolo * 1.05;
            }
            var ziskBudovy = budovyZisk * zeme.attributy.magia_zlato;
            var ziskObchodkyCudzieZaKolo = calculateZiskCudzieObchodkyZaKolo(zeme, i, dilna, (ziskZaKolo + ziskObchodkyZaKolo + ziskBudovy));

            predictedZiskyZlato.push(ziskZaKolo);
            predictedZiskyZlatoObchodka.push( ziskObchodkyZaKolo );
            predictedZiskZlatoBudovy.push(ziskBudovy);
            predictedZizkZlatoObchodkaCudzia.push(ziskObchodkyCudzieZaKolo);

            var totalZiskZlata = ziskZaKolo + ziskObchodkyZaKolo + ziskBudovy + zeme.attributy.zoldy + ziskObchodkyCudzieZaKolo;
            predictedZisky[i].predictedZiskZlato = Math.floor(predictedZisky[i].predictedZiskZlato+totalZiskZlata);

            //Mana
            predictedZisky[i].predictedZiskMana = Math.floor(predictedZisky[i].predictedZiskMana + zeme.attributy.prijemMana);
        }
        zeme.predictedZiskyZlatoObchodka = predictedZiskyZlatoObchodka;
        zeme.predictedZiskyZlato = predictedZiskyZlato;
        zeme.predictedZiskZlatoBudovy = predictedZiskZlatoBudovy;
        zeme.predictedZizkZlatoObchodkaCudzia = predictedZizkZlatoObchodkaCudzia;
    }

    function calculateZiskZlataZaKolo( zeme, obyvatelov , pocasie){
        return Math.floor(( obyvatelov * 5 * zeme.attributy.bonusZisk * zeme.attributy.magia_zlato * pocasie.zlato ));
    }

    function calculateZiskObchodkyZaKolo( zeme, vsetkyZeme, kolo, pocasie, ziskLenObyvatelia){
        var ziskObchodky = 0;
        zeme.pocetCuzdichObchodiek = 0;
        for (var i=0; i<zeme.smlouvy.length; i++){
            var mojaZem = false;
            if (zeme.smlouvy[i].obchodka){
                for (var j = 0; j < vsetkyZeme.length; j++){
                    if (vsetkyZeme[j].id === zeme.smlouvy[i].id ){
                        var pomer = vsetkyZeme[j].obyvateliaPoKolach[kolo] / ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
                        var percento = pomer * 0.18;
                        if (percento > 0.4){
                            percento = 0.4;
                        }
                        var ziskObchodka = 5 * percento * zeme.attributy.magia_zlato * ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
                        mojaZem = true;
                        break;
                    }
                }
                if (!mojaZem){
                    ziskObchodka = 0;
                    zeme.pocetCuzdichObchodiek++;
                }
                ziskObchodky = ziskObchodky + ziskObchodka;
            }
        }
        return ziskObchodky;
    }

    // vyratanie zisku z magickych zmluv medzi mojimi zemkami bez magie
    function calculateZiskMagickeSmlouvyBezMagie(zeme, vsetkyZeme){
        var ziskMagicke = 0;
        zeme.pocetCuzdichMagickych = 0;
        for (var i=0; i<zeme.smlouvy.length; i++){
            var mojaZem = false;
            if (zeme.smlouvy[i].magicka){
                for (var j = 0; j < vsetkyZeme.length; j++){
                    if (vsetkyZeme[j].id === zeme.smlouvy[i].id ){
                        var ziskMagicka = vsetkyZeme[j].vojsko.magov * 0.2 ;
                        mojaZem = true;
                        break;
                    }
                }
                if (!mojaZem){
                    ziskMagicka = 0;
                    zeme.pocetCuzdichMagickych++;
                }
                ziskMagicke = ziskMagicke + ziskMagicka;
            }
        }
        return ziskMagicke;
    }

    //vyratanie zisku z magickych zmluv cudzich zemiek bez magie
    function calculateZiskCudzieMagickeSmlouvyBezMagie( zeme, lenMojZisk){
        var ziskCudzieMagicke = 0;
        if (zeme.pocetCuzdichMagickych === 0){
            return ziskCudzieMagicke;
        }
        ziskCudzieMagicke = ( zeme.attributy.prijemMana - lenMojZisk ) / zeme.attributy.magia_mana;
        return ziskCudzieMagicke;
    }

    function calculateZiskCudzieObchodkyZaKolo( zeme, kolo, dilna, lenMojZisk){
        var ziskCudzieObchodky = 0;
        if (zeme.pocetCuzdichObchodiek === 0){
            return ziskCudzieObchodky;
        }
        if (dilna){
            var dilnaModifier = 1.05;
        }else{
            dilnaModifier = 1.00;
        }
        if (!zeme.obyvCudzieZemkyVPriemere){
            // Dokazem odhadnut kolko maju cudzie zemky priemerne obyvatelov. Robim len pre prve kolko ked viem presny zisk zemky
            var ziskCudzichObchodiek = zeme.attributy.prijemZlato - lenMojZisk;
            var percentoZCudzichObchodiek = ziskCudzichObchodiek / ( ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]) * 5 * zeme.attributy.magia_zlato * dilnaModifier);
            var percentoCudzej = percentoZCudzichObchodiek / zeme.pocetCuzdichObchodiek;
            zeme.obyvCudzieZemkyVPriemere = (percentoCudzej / 0.18) * ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
        }
        var pomer = zeme.obyvCudzieZemkyVPriemere / ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]);
        var percento = pomer * 0.18;
        if (percento > 0.4){
            percento = 0.4;
        }
        var ziskCudziaObchodka = 5 * ((zeme.obyvateliaPoKolach[kolo]<=0) ? 1 : zeme.obyvateliaPoKolach[kolo]) * percento * zeme.attributy.magia_zlato * dilnaModifier;
        ziskCudzieObchodky = ziskCudziaObchodka * zeme.pocetCuzdichObchodiek;
        return ziskCudzieObchodky;
    }

    function getObyvateliaPoKolach( dostupnychKol, obyvatelov, sypkaVkole, porodnost, volnychDomov, jeHajek){
        var obyvateliaPoKolach = [];
        for (var i=0; i<=dostupnychKol; i++){
            var obyvatelovVkoleX = obyvatelovZaXKol(i,obyvatelov,sypkaVkole,porodnost,jeHajek);
            if ( obyvatelovVkoleX > ( obyvatelov + volnychDomov )){
                obyvatelovVkoleX = obyvatelov + volnychDomov;
            }
            obyvateliaPoKolach.push(obyvatelovVkoleX)
        }
        return obyvateliaPoKolach;
    }

    function getVerb( obyvatelov, domovCelkom , vojakov, enti){
        var allowedPercentage = 0.8;
        if (enti){
            allowedPercentage = 0.9;
        }
        var verb = 0;
        if ( ( obyvatelov + vojakov ) < domovCelkom ){
            verb = obyvatelov - Math.ceil( domovCelkom * (1-allowedPercentage) );
            if (verb < 0){
                verb = 0;
            }
        }else{
            verb = Math.floor( domovCelkom * allowedPercentage ) - vojakov;
            if (verb < 0){
                verb = 0;
            }
        }
        return verb;
    }

    function getMaxVerb( obyvatelov, domovCelkom, vojakov, enti){
        var allowedPercentage = 0.8;
        if (enti){
            allowedPercentage = 0.9;
        }
        var verb = 0;
        var maxDomov = obyvatelov + vojakov;
        if ( domovCelkom > maxDomov ){
            maxDomov = domovCelkom;
        }
        verb = obyvatelov - Math.ceil( maxDomov * (1-allowedPercentage) );
        if (verb < 0){
            verb = 0;
        }
        return verb;
    }

    function pribudneObyvatelov(obyvatelovAktualne, jeSypka, porodnost, jeHajek){
        var prirastok = 1;
        if (jeSypka){
            prirastok = prirastok + 2 + obyvatelovAktualne * 0.05 ;
        }else{
            prirastok = prirastok + obyvatelovAktualne * 0.05 ;
        }
        if (jeHajek){
            prirastok = prirastok + 1;
        }
        prirastok = prirastok * porodnost;
        return Math.floor( prirastok );
    }

    function obyvatelovZaXKol(pocetKol,obyvatelovAktualne, sypkaVkole, porodnost, jeHajek){
        var obyvatelov = obyvatelovAktualne;
        for (var i=0; i<pocetKol; i++){
            if (i >= sypkaVkole){
                var jeSypka = true;
            }else{
                jeSypka = false
            }
            obyvatelov = obyvatelov + pribudneObyvatelov(obyvatelov, jeSypka, porodnost, jeHajek);
        }
        return obyvatelov;
    }

    function getAttributyInfoPromise(id){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/e.asp?id="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({ id : id,
                             attributy :parseAttributy(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseAttributy(httpResponse){
        var attributy = {
            rasa : "",
            prijemMana: 0,
            prijemZlato: 0,
            zoldy: 0,
            domov: 0,
            obyvatelov: 0,
            vojakov: 0,
            volnych_domov: 0,
            porodnost: 1,
            magia_zlato: 1,
            magia_mana: 1,
            bonusZisk : 1,
            bonusMana: 1,
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var formDomy = dom.getElementsByName("form_domy")[0];
        if (formDomy){
            var tables = formDomy.getElementsByTagName('table');
            if (tables[1]){
                attributy.rasa = tables[1].getElementsByTagName('TR')[2].getElementsByTagName('TD')[1].innerText.replace(/\tx|\t|\n/gm, "");
            }
            if (tables[2]){
                attributy.prijemZlato = Number(tables[2].getElementsByTagName('TR')[0].getElementsByTagName('TD')[1].innerText);
                attributy.zoldy = Number(tables[2].getElementsByTagName('TR')[1].getElementsByTagName('TD')[1].innerText);
                attributy.prijemMana = Number(tables[2].getElementsByTagName('TR')[0].getElementsByTagName('TD')[2].innerText);
            }
            if (tables[3]){
                attributy.domov = Number(tables[3].getElementsByTagName('TR')[0].getElementsByTagName('TD')[1].innerText);
                attributy.obyvatelov = Number(tables[3].getElementsByTagName('TR')[1].getElementsByTagName('TD')[1].innerText);
                attributy.vojakov = Number(tables[3].getElementsByTagName('TR')[2].getElementsByTagName('TD')[1].innerText);
                attributy.volnych_domov = attributy.domov - ( attributy.obyvatelov + attributy.vojakov );
            }
            if (tables[5]){
                var bonusy = tables[5].getElementsByTagName('TR');
                for (var i = 1; i <(bonusy.length - 1); i++){
                    if (!bonusy[i].getElementsByTagName('TD')[1]){
                        continue;
                    }
                    var textBonusu = bonusy[i].getElementsByTagName('TD')[1].innerText;
                    var match = textBonusu.match(/\+(.*)% zisk/);
                    if (match){
                        attributy.bonusZisk = 1 + Number(match[1]) / 100;
                    }
                    match = textBonusu.match(/\+(.*)% Mana/);
                    if (match){
                        attributy.bonusMana = 1 + Number(match[1]) / 100;
                    }
                }
            }
            if (tables[6]){
                var kouzla = tables[6].getElementsByTagName('TR');
                for ( i = 1; i < kouzla.length; i++){
                    var textKouzla = kouzla[i].getElementsByTagName('TD')[0].innerText;
                    match = textKouzla.match(/Porodnost = (...?)%/);
                    if ( match ){
                        attributy.porodnost = Number(match[1]) / 100;
                    }
                    match = textKouzla.match(/zlatých = (...?)%/);
                    if ( match ){
                        attributy.magia_zlato = Number(match[1]) / 100;
                    }
                    match = textKouzla.match(/many = (...?)%/);
                    if ( match ){
                        attributy.magia_mana = Number(match[1]) / 100;
                    }
                }
            }
        };
        return attributy;
    }

    function getBudovyInfoPromise(id){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/b.asp?id="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({ id : id,
                             budovy :parseBudovy(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseBudovy(httpResponse){
        var budovy = [];
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        for ( var i = 0; i < dom.getElementsByClassName("bgx").length; i++ ){
            var budovaTd = dom.getElementsByClassName("bgx")[i].nextElementSibling;
            var budovaText = budovaTd.innerText.replace(/\tx|\t|\n/gm, "");
            budovy.push(budovaText);
        }
        return budovy;
    }

    function getSmlouvyInfoPromise(id){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/c.asp?id="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({ id : id,
                             smlouvy :parseSmlouvy(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseSmlouvy(httpResponse){
        var smlouvy = [];
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var smlouvyForm = dom.getElementsByName("smlouvy")[0];
        if (smlouvyForm){
            var smlouvyTR = smlouvyForm.firstElementChild.firstElementChild.getElementsByTagName('TR');
            for (var j = 1; j < smlouvyTR.length-3; j++ ){
                var obchodka = false;
                var magicka = false;
                var smlouvaText = smlouvyTR[j].getElementsByTagName("TD")[0].innerText;
                if (smlouvaText.match(/nabízí/)) continue;
                if ( smlouvaText.match(/Obchodní/) ){
                    if (smlouvaText.match(/platnost/)){
                        obchodka = false;
                    }else{
                        obchodka = true;
                    }
                }
                if ( smlouvaText.match(/Magická/) ){
                    if (smlouvaText.match(/platnost/)){
                        magicka = false;
                    }else{
                        magicka = true;
                    }
                }
                smlouvy.push( {
                    name: smlouvyTR[j].getElementsByTagName("TH")[0].getElementsByTagName("span")[0].innerText,
                    id: smlouvyTR[j].getElementsByTagName("a")[0].href.match(/zeme=(.*)/)[1],
                    obchodka: obchodka,
                    magicka: magicka
                });
            }

        }
        return smlouvy;
    }

    function getVojskoInfoPromise(id){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/a.asp?id="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({ id : id,
                             vojsko :parseVojsko(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseVojsko(httpResponse){
        var vojsko = {};
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        vojsko.magov = parseInt(dom.getElementById("id_home_3").innerHTML);
        return vojsko;
        ;
    }

    function getListaPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/Lista_Informace.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseLista(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseLista(httpResponse){
        var kola = {
            odohranych_kol : 0,
            celkovo_kol : 0,
            dostupnych_kol : 0,
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var pocet_kol_string = dom.getElementById("i3").textContent;
        kola.odohranych_kol = Number(pocet_kol_string.split("/")[0]);
        kola.celkovo_kol = Number(pocet_kol_string.split("/")[1]);
        kola.dostupnych_kol = kola.celkovo_kol - kola.odohranych_kol;
        return kola;
    }

    function getListaHornyPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/Lista_Horni.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseListaHorni(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseListaHorni(httpResponse){
        var pocasie = {
            zlato : 1,
            mana : 1,
            domy : 1,
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        for (var i = 0; i < dom.links.length; i++){
            if ( dom.links[i].href.includes("hlaseni.asp") ){
                if (dom.links[i].firstElementChild){
                    var poc = dom.links[i].firstElementChild.title.match(/Počasí: (.*)/)[1].split('-');
                }
                else{
                    poc = dom.links[i].title.match(/Počasí: (.*)/)[1].split('-');
                }
                pocasie.zlato = Number(poc[0]) / 100;
                pocasie.mana = Number(poc[1]) / 100;
                pocasie.domy = Number(poc[2]) / 100;
            }
        }

        return pocasie;
    }

    function getHlaseniPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/hlaseni.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseHlaseni(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseHlaseni(httpResponse){
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var hernyDen = {
            den : dom.getElementsByName("Comp")[0].firstElementChild.value,
            liga:  dom.getElementsByClassName("gold")[1].innerText
        };
        return hernyDen;
    }

    function getAlianciaPromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/aliance.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseAliancia(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseAliancia(httpResponse){
        var alianciaDetail = {
            players : []
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        if (!dom.getElementById("tab_players_list")){
            return alianciaDetail;
        }
        var alianciaTR = dom.getElementById("tab_players_list").getElementsByTagName("TR");
        for (var i = 1; i < alianciaTR.length - 1; i++){
            alianciaDetail.players.push({
                nick: alianciaTR[i].getElementsByTagName("a")[1].innerText,
                rasa: alianciaTR[i].getElementsByTagName("TD")[1].innerText
            });

        }
        return alianciaDetail;
    }

    function getLigaDetailPromise(liga){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST","https://www.darkelf.cz/league_details.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseLigaDetail(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send("cb_league="+liga);
        });
    }

    function parseLigaDetail(httpResponse){
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        var ligaDetail = {
            hodnostZaklad : Number(dom.getElementsByTagName("TD")[31].innerText)
        };
        return ligaDetail;
    }

    function getTrzistePromise(){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/trziste.asp");
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve(parseTrziste(xhttp.response));
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseTrziste(httpResponse){
        var trzisteDetail = {
            koupit : 0,
            prodat : 0
        };
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        for ( var i = 0; i < dom.getElementsByClassName("mon").length; i++ ){
            var trzisteSpan =dom.getElementsByClassName("mon")[i];
            if (i == 0){
                trzisteDetail.koupit = Number(trzisteSpan.innerText);
            }else{
                trzisteDetail.prodat = Number(trzisteSpan.innerText);
            }
        }
        return trzisteDetail;
    }

    function getHeroPromise(id,heroImg){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/hero.asp?h="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({id: id,
                             heroImg: heroImg,
                             mojHero : parseHero(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseHero(httpResponse){
        var mojHero = false;
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        if (!dom.getElementById("centrala")){
            return false;
        }
        var text = dom.getElementById("centrala").getElementsByTagName("table")[1].getElementsByTagName("TR")[0].getElementsByTagName("TD")[0].innerText;
        if (text === 'Ve službách'){
            return false;
        }else{
            return true;
        }
    }

    function getHeroArtifactsPromise(id,heroImg){
        return new Promise( function(resolve, reject){
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET","https://www.darkelf.cz/artefacts_list.asp?h="+id);
            xhttp.overrideMimeType('text/xml; charset=WINDOWS-1250');
            xhttp.onload = function(){
                if (xhttp.status >= 200 && xhttp.status < 300){
                    resolve({id: id,
                             heroImg: heroImg,
                             poskodeneArtefakty : parseHeroArtifacts(xhttp.response)});
                }else{
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    });
                }
            };
            xhttp.onerror = function(){
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                });
            };
            xhttp.send();
        });
    }

    function parseHeroArtifacts(httpResponse){
        var poskodeneArtefakty = 0;
        var dom = new DOMParser().parseFromString(httpResponse, 'text/html');
        if (!dom.getElementsByTagName("table")[2]){
            return poskodeneArtefakty;
        }
        var artifactsTH = dom.getElementsByTagName("table")[2].getElementsByTagName("th");
        for (var i=0; i<artifactsTH.length; i++){
            var poskodenie = artifactsTH[i].firstElementChild.firstElementChild.innerText.match(/(.*)%/)[1];
            if (Number(poskodenie) < minPercentoPoskodeniaArtefaktu && Number(poskodenie) != 0){
                poskodeneArtefakty++;
            }
        }
        return poskodeneArtefakty;

    }

    function process_vojsko(){
        if ( !document.URL.match("https://www.darkelf.cz/a.asp\\?id=" )){
            return;
        }
        if (!vylepsenieVojsko){
            return;
        }

        addMassHireButtons();

        var id = document.URL.match(/id=(.*)/)[1];
        zeme = {
            budovy : [],
            attributy: {}
        };
        getBudovyInfoPromise(id).then(function(result){
            zeme.budovy = result.budovy
            return getAttributyInfoPromise(id);
        }).then(function(result){
            zeme.attributy = result.attributy;
            return getListaHornyPromise( );
        }).then(function(result){
            pocasie = result;
            return getListaPromise( );
        }).then( function(result){
            var kola = result;
            recalculateObyvatelov( zeme, kola );
            var verbInfoRow = getVerbInfoRow( zeme, true );
            var table = document.getElementsByTagName("table")[2];
            table.firstElementChild.appendChild( verbInfoRow );
            if (!zeme.budovy.find((str) => str === "Sýpka - obilná")){
                var predictionVerbTable = getVerbPredictionTableWithoutSypka( zeme, kola);
                document.getElementsByName("form_army")[0].parentNode.insertBefore(predictionVerbTable,document.getElementsByName("form_army")[0].nextSibling);
            }else{
                predictionVerbTable = getVerbPredictionTableWithSypka( zeme, kola, pocasie);
                document.getElementsByName("form_army")[0].parentNode.insertBefore(predictionVerbTable,document.getElementsByName("form_army")[0].nextSibling);
            }
        });
    }

    function addMassHireButtons(){
        var tMap = document.getElementById('T1map');
        var table = document.createElement('table');
        table.style = "border: 1px;display: inline;margin: initial;vertical-align: top;";
        table.innerHTML = '<tbody style="border: none;"><tr><td style="height: auto;padding: inherit;height: auto;padding: inherit;"><input type="button" id="noxtripMassHireBtn1" value="++" class="butt_extra_sml" style="inline-block;font-size: 6px;padding: initial;padding-right: 1px;border: 1px;"></td></tr><tr><td style="height: auto;padding: inherit;"><input type="button" id="noxtripMassDismissBtn1" value="- -" class="butt_extra_sml" style="dinline-block;padding-left: 1px;padding-top: 0px;padding-bottom: 0px;font-size: xx-small;padding-right: 2px;border: 1px;font-size: 6px;"></td></tr></tbody>';
        tMap.parentNode.insertBefore(table,tMap.nextSibling);
        var button = document.getElementById('noxtripMassHireBtn1');
        button.addEventListener("click", (evt) => onFullHire(1, evt));
        button = document.getElementById('noxtripMassDismissBtn1');
        button.addEventListener("click", (evt) => onFullDismiss(1, evt));

        tMap = document.getElementById('T2map');
        table = document.createElement('table');
        table.style = "border: 1px;display: inline;margin: initial;vertical-align: top;";
        table.innerHTML = '<tbody style="border: none;"><tr><td style="height: auto;padding: inherit;height: auto;padding: inherit;"><input type="button" id="noxtripMassHireBtn2" value="++" class="butt_extra_sml" style="inline-block;font-size: 6px;padding: initial;padding-right: 1px;border: 1px;"></td></tr><tr><td style="height: auto;padding: inherit;"><input type="button" id="noxtripMassDismissBtn2" value="- -" class="butt_extra_sml" style="dinline-block;padding-left: 1px;padding-top: 0px;padding-bottom: 0px;font-size: xx-small;padding-right: 2px;border: 1px;font-size: 6px;"></td></tr></tbody>';
        tMap.parentNode.insertBefore(table,tMap.nextSibling);
        button = document.getElementById('noxtripMassHireBtn2');
        button.addEventListener("click", (evt) => onFullHire(2, evt));
        button = document.getElementById('noxtripMassDismissBtn2');
        button.addEventListener("click", (evt) => onFullDismiss(2, evt));

        tMap = document.getElementById('T3map');
        table = document.createElement('table');
        table.style = "border: 1px;display: inline;margin: initial;vertical-align: top;";
        table.innerHTML = '<tbody style="border: none;"><tr><td style="height: auto;padding: inherit;height: auto;padding: inherit;"><input type="button" id="noxtripMassHireBtn3" value="++" class="butt_extra_sml" style="inline-block;font-size: 6px;padding: initial;padding-right: 1px;border: 1px;"></td></tr><tr><td style="height: auto;padding: inherit;"><input type="button" id="noxtripMassDismissBtn3" value="- -" class="butt_extra_sml" style="dinline-block;padding-left: 1px;padding-top: 0px;padding-bottom: 0px;font-size: xx-small;padding-right: 2px;border: 1px;font-size: 6px;"></td></tr></tbody>';
        tMap.parentNode.insertBefore(table,tMap.nextSibling);
        button = document.getElementById('noxtripMassHireBtn3');
        button.addEventListener("click", (evt) => onFullHire(3, evt));
        button = document.getElementById('noxtripMassDismissBtn3');
        button.addEventListener("click", (evt) => onFullDismiss(3, evt));
    }

    function onFullHire( unitType, event ){
        var currentAvailableHire = document.getElementsByClassName("food")[0].innerHTML.match("(.*)&nbsp;v")[1];
        document.getElementById('T'+unitType).value = currentAvailableHire;
    }

    function onFullDismiss( unitType, event ){
        var currentUnitsOfType = document.getElementById('id_home_'+unitType).innerHTML;
        document.getElementById('T'+unitType).value = currentUnitsOfType;
    }

    function process_hromadne_kupovanie_domov(){
        if ( !document.URL.match("https://www.darkelf.cz/auto_domy.asp" )){
            return;
        }
        if (!vylepsenieHromadneNakupovanieDomov){
            return;
        }

        for (var i = 0; i < document.links.length; i++){
            var linkZeme = document.links[i];
            if ( linkZeme.href.includes("/e.asp?id=") ){
                var id = linkZeme.href.match(/id=(.*)/)[1];
                getAttributyInfoPromise(id).then(function(result){
                    addKuzlaToHKB(result);
                });

            }
        }
    }

    function addKuzlaToHKB(attributyInfo){
        for (var i = 0; i < document.links.length; i++){
            var linkZeme = document.links[i];
            if ( linkZeme.href.includes("/e.asp?id=") ){
                var id = linkZeme.href.match(/id=(.*)/)[1];
                if (id === attributyInfo.id){
                    if (attributyInfo.attributy.magia_zlato > 1){
                        var customImg = document.createElement('img');
                        customImg.setAttribute("src","images/kouzla/k40.gif");
                        customImg.setAttribute("title","Zisk zlatých = 130%");
                        customImg.setAttribute("align","top");
                        customImg.style.paddingLeft = "2px";
                        linkZeme.parentNode.insertBefore(customImg,linkZeme.nextSibling);
                    }
                    if (attributyInfo.attributy.magia_mana > 1){
                        customImg = document.createElement('img');
                        customImg.setAttribute("src","images/kouzla/k50.gif");
                        customImg.setAttribute("title","Zisk many = 130%");
                        customImg.setAttribute("align","top");
                        customImg.style.paddingLeft = "2px";
                        linkZeme.parentNode.insertBefore(customImg,linkZeme.nextSibling);
                    }
                }
            }
        }
    }

    function process_zem_de(){
        if ( !document.URL.match("https://www.darkelf.cz/l.asp\\?id=66" )){
            return;
        }
        if (!vylepsenieDE){
            return;
        }

        getHlaseniPromise().then(function(result){
            var vlastnostiZemeTbody = document.getElementsByTagName("table")[1].firstElementChild;
            var customElementTr = document.createElement('tr');
            var customElementTd = document.createElement('td');
            customElementTd.innerHTML = '<p style="color:MediumSeaGreen">Magicka obrana</p>';
            customElementTr.appendChild(customElementTd);
            customElementTd = document.createElement('td');
            var hernyDen = result;
            var mo = '??';
            if (hernyDen){
                var hernyDenNum = Number(hernyDen.den);
                if ( hernyDenNum == 9 ) {
                    mo = '3000';
                }else if ( hernyDenNum == 10 ){
                    mo = '2650';
                }else if ( hernyDenNum == 11 ){
                    mo = '2500';
                }else if ( hernyDenNum == 12 ){
                    mo = "2350";
                }else if ( hernyDenNum == 13 ){
                    mo = "2250";
                }else if ( hernyDenNum == 14 ){
                    mo = "2150";
                }else if ( hernyDenNum == 15 ){
                    mo = "2050";
                }else if ( hernyDenNum == 16 ){
                    mo = "1950";
                }else if ( hernyDenNum == 17 ){
                    mo = "1900";
                }else if ( hernyDenNum >= 18 ){
                    mo = "<1900";
                }
            }
            customElementTd.innerHTML = '<p style="color:MediumSeaGreen">' + mo + '</p>' ;
            customElementTr.appendChild(customElementTd);
            vlastnostiZemeTbody.appendChild(customElementTr);
        });

    }

    function process_mapa(){
        if ( !document.URL.match("https://www.darkelf.cz/map_new.asp") && !document.URL.match("https://www.darkelf.cz/map_old.asp") ){
            return;
        }
        if (vylepsenieArtefakty){
            findBrokenArtifactsAndNotif();
        }
        if (vylepsenieHistoria){
            processHistory();
        }
        if (vylepseniePorodnostMapa){
            processZemkyMapa();
        }
    }

    function processZemkyMapa(){
        var landDivs = document.getElementsByClassName("land");
        for (var i = 0; i < landDivs.length; i++){
            if (vylepseniePorodnostMapa){
                landDivs[i].getElementsByTagName("a")[1];
                var natality = landDivs[i].getAttribute("data-b_natality");
                if (natality){
                var img;
                switch (natality){
                    case "50":
                        img = document.createElement('img');
                        img.src = "images/kouzla/k7.gif";
                        break;
                    case "200":
                        img = document.createElement('img');
                        img.src = "images/kouzla/k5.gif";
                        break;
                    default:
                        continue;
                }
                img.width = "10";
                img.height = "10";
                img.style.position = "aboslute";
                img.style.marginLeft = "20px";
                img.style.marginTop = "-39px";
                img.style.filter = "brightness(1.2)";
                landDivs[i].appendChild(img);
                }
            }
        }
    }

    function findBrokenArtifactsAndNotif(){
        for (var i = 0; i < document.links.length; i++){
            if ( document.links[i].href.includes("/hero.asp?h=") ){
                var heroId = document.links[i].href.match(/\?h=(.*)/)[1];
                var heroImg = document.links[i].firstElementChild.src;
                getHeroPromise(heroId,heroImg).then(function (result){
                    if (result.mojHero){
                        getHeroArtifactsPromise(result.id,result.heroImg).then(function(result){
                            if (result.poskodeneArtefakty > 0){
                                showWarningforHeroArtefact(result.heroImg);
                            }
                        });
                    }
                });
            }
        }
    }

    function processHistory(){
        getHlaseniPromise().then(function(result){
            const request = indexedDB.open("NoxtripDEScriptDB", 1);
            request.onupgradeneeded = (event) => {
                db = event.target.result;
                const objectStore = db.createObjectStore("maps", { keyPath: "identifier" });
            }
            request.onerror = (event) => {
                console.error(`Database error: ${event.target.errorCode}`);
                return;
            }
            request.onsuccess = (event) => {
                db = event.target.result;
                var objectStore = db.transaction("maps", "readwrite").objectStore("maps");
                storeCurrentLigaDayDB(result.den,result.liga,objectStore)
            }
        });

    }


    function addHistoryPickerDB(den,liga,objectStore){
        var selectHistory = document.createElement('select');
        selectHistory.className = "list_centred";
        selectHistory.id = "noxHistorySelect";
        selectHistory.size = 1;

        var windowKeep = window;
        selectHistory.addEventListener("change",function(event){
            if (event.type == "change"){
                var selectedDen = event.srcElement.value;
                if (selectedDen === event.srcElement.options[0].value){
                    document.location.reload(true);
                }else{
                    var storageId = liga+selectedDen;
                    db.transaction("maps").objectStore("maps").get(storageId).onsuccess = function(event){
                        if (event.target.result){
                            document.getElementById("maps").innerHTML = event.target.result.html;
                        }
                    };
                }
            }
        });

        var customDiv = document.createElement('div');
        customDiv.style.left = "4px";
        customDiv.style.top= "54px";
        customDiv.style.positon= "aboslute";
        customDiv.style.zIndex= "200";
        customDiv.appendChild(selectHistory);
        document.getElementById("maps").parentElement.appendChild(customDiv);

        for (var i=0; i<pocetdDniHistorie; i++){
            var storageId = liga+(Number(den)-i);
            objectStore.get(storageId).onsuccess = function(event){
                if (event.target.result){
                    var historyOption = document.createElement('option');
                    historyOption.value = (event.target.result.den);
                    historyOption.innerText = "Herný den " + historyOption.value;
                    selectHistory.appendChild(historyOption);
                }
            };
        }

    }


    function storeCurrentLigaDayDB(den,liga,objectStore){
        var storageId = liga+den;
        var request = objectStore.get(storageId).onsuccess = (event) => {
            if (!event.target.result){
                var storageIdd = liga+den;
                objectStore.add({ identifier : storageIdd , den : den, date: new Date().getTime() ,html: document.getElementById("maps").innerHTML }).onsuccess = function(event){
                    addHistoryPickerDB(den,liga,objectStore);
                };
            }else{
                var d = new Date();
                d.setDate(d.getDate() - ( pocetdDniHistorie + 1 ) );
                if (!event.target.result.date || event.target.result.date < d.getTime() ){
                    storageIdd = liga+den;
                    objectStore.delete(storageId).onsuccess = function(event){
                        objectStore.put({ identifier : storageIdd , den : den, date: new Date().getTime() ,html: document.getElementById("maps").innerHTML }).onsuccess = function(event){
                            addHistoryPickerDB(den,liga,objectStore);
                        };
                    };
                }else{
                    addHistoryPickerDB(den,liga,objectStore);
                }
            }
        };
        storageId = liga+(Number(den)-pocetdDniHistorie);
        objectStore.delete(storageId);
        localStorage.removeItem(storageId); // For legacy purpose
    }

    function showWarningforHeroArtefact(heroImg){
        var span = document.createElement('span');
        var img = document.createElement('img');
        img.src = heroImg;
        span.appendChild(img);
        var spanText = document.createElement('span');
        spanText.innerText = "Hrdina má aretfakt tesne pred rozpadnutím!!!!";
        span.appendChild(spanText);
        span.style.color = "red";
        span.style.fontWeight = "bold";
        if (document.URL.match("https://www.darkelf.cz/map_old.asp") ){
            span.style.position = "absolute";
            span.style.left = "2%";
            document.getElementById("maps").insertBefore( span,document.getElementById("maps").firstElementChild);
        }else{
            document.getElementById("miniMenuContainer").appendChild(span);
        }
    }

    function process_not_mine_land(){
        if ( !document.URL.match("https://www.darkelf.cz/l.asp" )){
            return;
        }
        if (!vylepsenieKombinaciaJednotiek){
            return;
        }

        add_combination_buttons( );

    }

    function add_combination_buttons( ){
        var combinationTable = document.createElement('table');
        combinationTable.id = 'noxtrip_combination_table_top';
        var buttonTr = document.createElement('tr');
        var buttonTh = document.createElement('th');
        var button = document.createElement('button');
        button.innerText = "Kombinácia min/max";
        button.id = 'noxtrip_combination_button_mm';
        button.onclick = writeCombinationMinMax;
        button.className = "butt_sml";
        buttonTh.colSpan = 1;
        buttonTh.appendChild(button);
        buttonTr.appendChild(buttonTh);

        buttonTh = document.createElement('th');
        button = document.createElement('button');
        button.innerText = "Kombinácia full";
        button.id = 'noxtrip_combination_button_full';
        button.onclick = writeCombinationFull;
        buttonTh.colSpan = 2;
        button.className = "butt_sml";
        buttonTh.appendChild(button);
        buttonTr.appendChild(buttonTh);

        combinationTable.appendChild( buttonTr);
        document.getElementById('centrala').appendChild( combinationTable );
    }

    function writeCombinationMinMax( ){
        if ( document.getElementById('noxtrip_combination_table_tr_minmax') ){
            return;
        }
        var rasa = document.getElementsByTagName('table')[0].getElementsByTagName('td')[5].innerHTML.match(/>(.*)<\/a>/)[1];
        var sila = document.getElementsByTagName('table')[0].getElementsByTagName('th')[1].innerHTML.match(/\n(.*)<img/)[1];
        if (rasa){
            var combinationResult = calcCombination(rasa, sila);
            addMinMaxTable( combinationResult );
        }
    };

    function addMinMaxTable( combinationResult ){
        if ( document.getElementById('noxtrip_combination_table_tr_minmax') ){
            return;
        }
        var combinationTableTop = document.getElementById('noxtrip_combination_table_top');
        var minMaxTR = document.createElement('tr');
        minMaxTR.id = 'noxtrip_combination_table_tr_minmax';
        var minMaxTD = document.createElement('td');
        minMaxTD.innerHTML = 'Útok Min/Max';
        minMaxTR.appendChild(minMaxTD);
        minMaxTD = document.createElement('td');
        minMaxTD.innerHTML = combinationResult.minAttack;
        minMaxTR.appendChild(minMaxTD);
        minMaxTD = document.createElement('td');
        minMaxTD.innerHTML = combinationResult.maxAttack;
        minMaxTR.appendChild(minMaxTD);
        combinationTableTop.appendChild(minMaxTR);

        minMaxTR = document.createElement('tr');
        minMaxTD = document.createElement('td');
        minMaxTD.innerHTML = 'Obrana Min/Max';
        minMaxTR.appendChild(minMaxTD);
        minMaxTD = document.createElement('td');
        minMaxTD.innerHTML = combinationResult.minDefence;
        minMaxTR.appendChild(minMaxTD);
        minMaxTD = document.createElement('td');
        minMaxTD.innerHTML = combinationResult.maxDefence;
        minMaxTR.appendChild(minMaxTD);
        combinationTableTop.appendChild(minMaxTR);
    };

    function writeCombinationFull( ){
        if ( document.getElementById('noxtrip_combination_table_detail') ){
            return;
        }
        var rasa = document.getElementsByTagName('table')[0].getElementsByTagName('td')[5].innerHTML.match(/>(.*)<\/a>/)[1];
        var sila = document.getElementsByTagName('table')[0].getElementsByTagName('th')[1].innerHTML.match(/\n(.*)<img/)[1];
        if (rasa){
            var combinationResult = calcCombination(rasa, sila);
            addMinMaxTable( combinationResult );

            var combinationTableDetail = document.createElement('table');
            combinationTableDetail.id = 'noxtrip_combination_table_detail';
            var detailTR = document.createElement('tr');
            var detailTH = document.createElement('th');
            detailTH.innerHTML = '1';
            detailTR.appendChild(detailTH);
            detailTH = document.createElement('th');
            detailTH.innerHTML = '2';
            detailTR.appendChild(detailTH);
            detailTH = document.createElement('th');
            detailTH.innerHTML = '3';
            detailTR.appendChild(detailTH);
            detailTH = document.createElement('th');
            detailTH.innerHTML = 'Útok';
            detailTR.appendChild(detailTH);
            detailTH = document.createElement('th');
            detailTH.innerHTML = 'Obrana';
            detailTR.appendChild(detailTH);
            combinationTableDetail.appendChild( detailTR);

            for (var comb = 0; comb < combinationResult.combinations.length; comb++ ){
                detailTR = document.createElement('tr');
                var detailTD = document.createElement('td');
                detailTD.innerHTML = combinationResult.combinations[comb][0];
                detailTD.style = "FONT-SIZE:x-small;height:0px";
                detailTR.appendChild(detailTD);
                detailTD = document.createElement('td');
                detailTD.innerHTML = combinationResult.combinations[comb][1];
                detailTD.style = "FONT-SIZE:x-small;height:0px";
                detailTR.appendChild(detailTD);
                detailTD = document.createElement('td');
                detailTD.innerHTML = combinationResult.combinations[comb][2];
                detailTD.style = "FONT-SIZE:x-small;height:0px";
                detailTR.appendChild(detailTD);
                detailTD = document.createElement('td');
                detailTD.innerHTML = combinationResult.combinations[comb][3];
                detailTD.style = "color:#EE2222;FONT-SIZE:x-small;height:0px"
                detailTR.appendChild(detailTD);
                detailTD = document.createElement('td');
                detailTD.innerHTML = combinationResult.combinations[comb][4];
                detailTD.style = "color:#AAAAAA;FONT-SIZE:x-small;height:0px";
                detailTR.appendChild(detailTD);

                combinationTableDetail.appendChild( detailTR);
            }
            var combinationTableTop = document.getElementById('noxtrip_combination_table_top');
            document.getElementById('centrala').insertBefore( combinationTableDetail , combinationTableTop.nextSibling );


        }
    };

    function calcCombination( race, strength ){
        var result = {
            "combinations": [],
            "minAttack": 0,
            "minDefence": 0,
            "maxAttack": 0,
            "maxDefence": 0,
        };
        var rasaAD = getRasaAtackDef( );
        var a1 = rasaAD[race][1].attack;
        var a2 = rasaAD[race][2].attack;
        var a3 = rasaAD[race][3].attack;
        var d1 = rasaAD[race][1].defence;
        var d2 = rasaAD[race][2].defence;
        var d3 = rasaAD[race][3].defence;
        var s1 = a1 + d1;
        var s2 = a2 + d2;
        var s3 = a3 + d3;

        var min_attack = strength;
        var max_attack = 0;
        var min_defence = strength;
        var max_defence = 0;

        var max1 = Math.floor(strength/s1);
        var rows=0;
        var string="";

        document.getElementById('centrala')

        for(var u1=max1; u1+1; u1--) {
            for(var u2=Math.floor((strength-u1*s1)/s2); u2+1; u2--) {
                if(!((strength - u1*s1 - u2*s2)%s3)) {
                    var u3 = Math.floor((strength - u1*s1 - u2*s2)/s3);
                    var attack = u1*a1 + u2*a2 + u3*a3;
                    min_attack = Math.min(min_attack, attack);
                    max_attack = Math.max(max_attack, attack);
                    var defence = u1*d1 + u2*d2 + u3*d3;
                    min_defence = Math.min(min_defence, defence);
                    max_defence = Math.max(max_defence, defence);
                    result.combinations[rows] = new Array(u1,u2,u3,attack,defence);
                    rows++;
                }
            }
        }

        result.minAttack = min_attack;
        result.minDefence = min_defence;
        result.maxAttack = max_attack;
        result.maxDefence = max_defence;
        return result;

    }

    function getRasaAtackDef( ){
        var array = [];
        array["Lidé"] = [ {} , {"attack" : 1, "defence" : 5}, {"attack" : 7, "defence" : 3}, {"attack" : 4, "defence" : 4}];
        array["Barbaři"] = [ {} , {"attack" : 4, "defence" : 3}, {"attack" : 9, "defence" : 3}, {"attack" : 5, "defence" : 4}];
        array["Skřeti"] = [ {} , {"attack" : 2, "defence" : 4}, {"attack" : 5, "defence" : 3}, {"attack" : 3, "defence" : 3}];
        array["Skuruti"] = [ {} , {"attack" : 3, "defence" : 3}, {"attack" : 7, "defence" : 1}, {"attack" : 5, "defence" : 3}];
        array["Nekromanti"] = [ {} , {"attack" : 1, "defence" : 4}, {"attack" : 7, "defence" : 2}, {"attack" : 5, "defence" : 3}];
        array["Mágové"] = [ {} , {"attack" : 2, "defence" : 5}, {"attack" : 7, "defence" : 2}, {"attack" : 3, "defence" : 5}];
        array["Elfové"] = [ {} , {"attack" : 2, "defence" : 6}, {"attack" : 6, "defence" : 4}, {"attack" : 5, "defence" : 5}];
        array["Temní Elfové"] = [ {} , {"attack" : 3, "defence" : 5}, {"attack" : 8, "defence" : 3}, {"attack" : 4, "defence" : 5}];
        array["Trpaslíci"] = [ {} , {"attack" : 2, "defence" : 7}, {"attack" : 5, "defence" : 6}, {"attack" : 3, "defence" : 7}];
        array["Hobiti"] = [ {} , {"attack" : 2, "defence" : 2}, {"attack" : 4, "defence" : 2}, {"attack" : 1, "defence" : 2}];
        array["Enti"] = [ {} , {"attack" : 4, "defence" : 6}, {"attack" : 8, "defence" : 8}, {"attack" : 3, "defence" : 6}];
        return array;
    }

    function getDomyNumberPreRasu(rasa){
        switch(rasa.replace(/^\s+|\s+$/gm,'')) {
            case "Lidé":
                return "0";
            case "Barbaři":
                return "1";
            case "Skřeti":
                return "2";
            case "Skuruti":
                return "3";
            case "Nekromanti":
                return "4";
            case "Mágové":
                return "5";
            case "Elfové":
                return "6";
            case "Temní Elfové":
                return "7";
            case "Trpaslíci":
                return "8";
            case "Hobiti":
                return "9";
            case "Enti":
                return "10";
            default:
                return "0";
        }
    }

    function getKolaNumberPreRasu(rasa){
        switch(rasa.replace(/^\s+|\s+$/gm,'')) {
            case "Lidé":
                return 8;
            case "Barbaři":
                return 7;
            case "Skřeti":
                return 10;
            case "Skuruti":
                return 9;
            case "Nekromanti":
                return 8;
            case "Mágové":
                return 7;
            case "Elfové":
                return 7;
            case "Temní Elfové":
                return 6;
            case "Trpaslíci":
                return 6;
            case "Hobiti":
                return 11;
            case "Enti":
                return 5;
            default:
                return "0";
        }
    }

    function isSynergyRasaRecieve(rasa){
        if (rasa.includes("Trpaslíci") ||
            rasa.includes("Enti") ||
            rasa.includes("Elfové") ||
            rasa.includes("Mágové") ||
            rasa.includes("Barbaři") ||
            rasa.includes("Temní Elfové")){
            return true;
        }else{
            return false;
        }
    }

    function isSynergyRasaGive(rasa){
        if (rasa.includes("Trpaslíci") ||
            rasa.includes("Enti") ||
            rasa.includes("Elfové") ||
            rasa.includes("Temní Elfové")){
            return true;
        }else{
            return false;
        }
    }

})();