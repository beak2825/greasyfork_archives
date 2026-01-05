// ==UserScript==
// @name        MasterCHC
// @namespace   chc.czechia.com
// @include     https://chc.czechia.com/_new/*
// @include     https://chc.czechia.com/
// @icon        http://hotline.testwebu.com/master_chc/icon.png
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdn.jsdelivr.net/jquery.hotkeys/0.1.0/jquery.hotkeys.js
// @update      https://greasyfork.org/scripts/985-masterchc/code/MasterCHC.user.js
// @description ultimativní pomocník pro CHC
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @version     1.4.20170901
// @downloadURL https://update.greasyfork.org/scripts/985/MasterCHC.user.js
// @updateURL https://update.greasyfork.org/scripts/985/MasterCHC.meta.js
// ==/UserScript==


//////////////////////////////////////////////
/// glob. proměnné

//vyhledávání pro předání na specialisty, vyhledávácí klíč se použije pro konstrukci regexp
//struktura = ["text na buttonu", "vyhledávací klíč"];
var ssl = ["SSL Market", "SSLMarket"];
var inpage = ["InPAGE", "Inpage"];
var inshop = ["InSHOP", "Hotline Inshop"];
var inmail = ["InMAIL", "InMail"];

// může se hodit, kdyby bylo třeba kvůli přetákání zkrátit např na "předat uživateli""
var predat_problem_uzivateli = "Předat problém uživateli";
// regexp pro parsování domény / služby z předmětu
//var service_regexp = /\b[0-9a-z\-]+\.{1}[a-z]{2,20}\b|\b[0-9a-z\-]+\.{1}[a-z0-9]{2,}\.{1}[a-z]{2,20}\b/i;
var service_regexp = /\b([0-9a-z\-]+\.{1})+[a-z]{2,20}\b/i;

//regexp pro test, zda je v předmětu doména - pro vytvoření whois linku
//var dom_regexp = /\b[0-9a-z\-]+\.{1}[a-z]{2,20}\b|\b[0-9a-z\-]+\.{1}[a-z]{2,4}\.{1}[a-z]{2,20}\b/i;
var dom_regexp = /^[0-9a-z\-]+\.{1}[a-z]{2,20}$|^[0-9a-z\-]+\.{1}[a-z]{2,4}\.{1}[a-z]{2,20}$/i;

// domény jako vyjímky pro parsování domény z předmětu do názvu služby
var excluded_domains = [
    'czechia.com',
    'joker.com',
    'regzone.cz'
];

// výchozí url pro načítání šablon
var default_url = 'http://skiner.cz/master_chc';


//přidá styly nových elementů
var css = "";
//editace existujících
css += "body {background-color: " + GM_getValue("barva_pozadi", "#FFFFFF") + ";}";
//css += "obal {width: 1000px; margin: 0 auto 0 auto;}";
//css += ".tab_nor, .tab_nor2, .tab_nor3{ border : 1px solid #9cf; width : 95%; }";
css += "textarea {width: 100%; }";
css += ".tab_nor3 th {width: 130px}";


///vlastní
css += ".box {margin: 0px 0px 3px 8px; width: 335px; height: 100px; float: left; }";
css += ".copy {margin: 0 0 0 3px; padding: 0; min-width: 100px; height: 19px;}";
css += ".copy_to_text {margin-right: 5px; float: right;}";
css += ".copy_chc {width: auto;}";
css += ".nastaveni_a {text-decoration : none; color : blue; font-family: Arial, sans-serif;font-weight : normal; font-size : 11px;}";
css += ".nastaveni_a:hover {cursor:pointer;}";
css += ".tab_nastaveni {width: 1000px; font-size: 12px; text-align: left; margin-bottom: 8px;}";
css += ".tab_nastaveni a {font-size: 12px;}";
css += ".tab_nastaveni input {width: 500px;}";
css += ".td_nadpis {border-top: 2px solid black; padding: 8px 0 5px 0;}";
css += ".td_nadpis h3{margin: 3px 0 3px 0;}";
css += ".td_polozka {width: 220px; text-align: right; padding-right: 6px;}";
css += ".td_input {width: 90%;}";
css += "input.ulozit {width: 130px; margin-right: 3px;}";
css += "input.kiss2 {min-width: 10px; width: 63px; padding: 0px; margin: 0; height: 18px;}";
css += ".kiss_form2 {margin: 0px; padding: 0px; float: right; width: 155px; border: 0px solid red; text-align: left;}";
css += "input.chc_copy2 {min-width: 10px; width: 83px; margin: 0 4px 0 4px; padding: 0px; height: 18px;}";
css += ".but {margin: 0 0 0 3px;}";
css += ".prevzit {background-color: #7FD0D0}";
css += ".delete {margin: 0 0 0 3px; background-color: red; float: right;}";
css += ".ssl {background-color: #FFDD00;}";
css += ".inpage {background-color: #99CC00;}";
css += ".inshop {background-color: #F07FB0;}";
css += ".inmail {background-color: #40C1E8;}";
css += ".button:hover, .yellow_button:hover, .red_button:hover {background-color: #1c4d7e; color: #fff}";
css += "input.open_mail {margin: 0 3px 0 -3px;}";
css += ".infotable tr {vertical-align: top}";
css += ".infonadpis {font-weight: bold;}";
//css += ".info_titulek {text-align: right; white-space: nowrap; width: 50px; padding: 2px 5px 2px 5px;}";
css += "td.whois_td {padding: 3px 0px 3px 4px;}";

GM_addStyle(css);

// add favicon
var favicon_link_html = document.createElement('link');
favicon_link_html.rel = 'icon';
//favicon_link_html.href = 'https://intranet/images/favicon.ico';
favicon_link_html.href = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf8AAAAAAAAAAAAAAAD+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn/AAAAAAAAAAAAAAAA/l4J//5eCf///Pv///z7//5eCf///Pv//l4J///8+//+Xgn//l4J///8+////Pv//l4J/wAAAAAAAAAAAAAAAP5eCf///Pv///z7//5eCf/+Xgn///z7//5eCf///Pv//l4J///8+////Pv//l4J//5eCf8AAAAAAAAAAAAAAAD+Xgn///z7//5eCf/+Xgn//l4J///8+////Pv///z7//5eCf//+fb//l4J//5eCf/+Xgn/AAAAAAAAAAAAAAAA/l4J///8+////Pv//l4J//5eCf///Pv//l4J///8+//+Xgn///z7///8+//+Xgn//l4J/wAAAAAAAAAAAAAAAP5eCf/+Xgn///z7///8+//+Xgn///z7//5eCf///Pv//l4J//5eCf///Pv///z7//5eCf8AAAAAAAAAAP5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J/wAAAAAAAAAA/l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn+/l4J/wAAAAAAAAAAAAAAAAAAAAD+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCQ0AAAAAAAAAAAAAAAAAAAAA/l4JEf5eCf/+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP5eCQ7+Xgn//l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+XgkO/l4J//5eCf/+Xgn//l4J//5eCf/+Xgn//l4J/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP5eCf/+Xgn/AAAAAP5eCf/+Xgn//l4J+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/l4J/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAIADAACAAwAAgAMAAIADAACAAwAAgAMAAIADAAAAAQAAgAMAAMAHAADgDwAA4B8AAOA/AADkfwAA/v8AAA==';
favicon_link_html.type = 'image/x-icon';
document.getElementsByTagName('head')[0].appendChild(favicon_link_html);


function copyClick(button, copy) {
    GM_setClipboard(copy);
    //var c = button.value;
    button.style.width = button.offsetWidth;
    button.style = "min-width: " + button.offsetWidth + "px; text-decoration: underline;";
    //button.value = "<u>copy</u>";
    setTimeout(function () {
        button.style = "min-width: " + button.offsetWidth + "px; text-decoration: none";
    }, 500);
}

function predat_osobe(jmeno, ukol) {
    // ukol je boolean, přepíná zda to je není není stránka ukol - líší se názvy selectů
    if (ukol) {
        var selectname = "IDAdmin";
        var confirmbut = "savebut";
        var korekce = 1;  ///kůli nedefinované první položce procházíme pro ukol selecty až od 1ky, pak řešíme korekcí
    } else {
        var selectname = "admin";
        var confirmbut = "inputbut";
        var korekce = 0;
    }

    var select = document.getElementsByName(selectname)[0];
    var options = select.childNodes;
    var regular = new RegExp(jmeno, 'gmi');
    var predano = false;


    for (i = korekce; i < options.length; i++) {
        if (options[i].innerHTML.match(regular)) {
            //console.log("inner " + options[i].innerHTML);
            select.selectedIndex = i - korekce;
            $('input[name="' + confirmbut + '"]').trigger('click');
            document.getElementsByName('form1')[0].submit();
            predano = true;
            break;
        }
    }
    if (!predano) {
        alert('MasterCHC: chyba při předávání - uživatel "' + jmeno + '" nenalezen.');
    }
}

//všem textaarea odmrdáme do pice colls
var textareas = document.getElementsByTagName('textarea');
for (j = 0; j < textareas.length; j++) {
    textareas[j].setAttribute("cols", "0");
}



////////////////////////////////////////////////////////////////////////////////
/// https://chc.czechia.com/_new/vypis*
////////////////////////////////////////////////////////////////////////////////
if (location.href.match(/vypis/)) {
    ///ergonomie
    //user left margin
    var user_margin = GM_getValue("vypis_left_margin", false);
    if (user_margin) {
        document.getElementsByTagName('body')[0].style.marginLeft = user_margin;
    }


    //vyparsuje jméno uživatele pro předávání problémů sobě
    if (!(GM_getValue("user_name"))) {
        var namespan = document.getElementsByTagName("span")[0].innerHTML;
        var name = namespan.substr(11, namespan.length).split(" ");
        var jm = name[1] + " " + name[0];
        GM_setValue("user_name", jm);
    }

    /////////////////////
    /// nastavení
    var nastaveni = document.createElement('a');
    nastaveni.id = "nastaveni";
    nastaveni.className = "nastaveni_a";
    nastaveni.innerHTML = "MasterCHC";
    var kotva = document.getElementsByTagName('td')[1];
    kotva.innerHTML = " | " + kotva.innerHTML;
    kotva.insertBefore(nastaveni, kotva.firstChild);
    var tabulka_nastaveni = false;

    function vytvorNastaveni() {
        //tabulka nastavení
        var tab_nastaveni = document.createElement('table');
        tab_nastaveni.id = "tab_nastaveni";
        tab_nastaveni.className = "tab_nastaveni";

        var tr1 = document.createElement('tr');
        tr1.className = "tr_nastaveni";
        tab_nastaveni.appendChild(tr1);

        //nadpis atp
        var td_nadpis = document.createElement('td');
        td_nadpis.className = "td_nadpis";
        td_nadpis.setAttribute("colspan", "2");
        td_nadpis.innerHTML = "<h3>Nastavení MasterCHC</h3>";
        td_nadpis.innerHTML += "Pro nápovědu a info k nastavení <a href='http://hotline.testwebu.com/master_chc/' target='_blank'>pokračuj zde.</a>";
        tr1.appendChild(td_nadpis);

        //url šablon
        var tr2 = document.createElement('tr');
        var td21 = document.createElement('td');
        td21.innerHTML = "URL&nbsp;šablon:";
        td21.className = "td_polozka";
        tr2.appendChild(td21);
        var td22 = document.createElement('td');
        td22.className = "td_input";
        var input_sablony = document.createElement('input');
        input_sablony.id = "input_sablony";
        input_sablony.setAttribute("type", "input");
        td22.appendChild(input_sablony);
        tr2.appendChild(td22);
        tab_nastaveni.appendChild(tr2);

        //jméno
        var tr3 = document.createElement('tr');
        var td31 = document.createElement('td');
        td31.innerHTML = 'Jméno&nbsp;(formát&nbsp;"Příjmení&nbsp;Jméno"):';
        td31.className = "td_polozka";
        tr3.appendChild(td31);
        var td32 = document.createElement('td');
        td32.className = "td_input";
        var input_jmeno = document.createElement('input');
        input_jmeno.id = "input_jmeno";
        input_jmeno.setAttribute("type", "input");
        td32.appendChild(input_jmeno);
        tr3.appendChild(td32);
        tab_nastaveni.appendChild(tr3);

        //uživatelské odkazy
        var tr4 = document.createElement('tr');
        var td41 = document.createElement('td');
        td41.innerHTML = 'Zobrazovat&nbsp;uživatelské&nbsp;odkazy&nbsp;v&nbsp;úkolu:';
        td41.className = "td_polozka";
        tr4.appendChild(td41);
        var td42 = document.createElement('td');
        td42.className = "td_input";
        var input_details = document.createElement('input');
        input_details.id = "zobrazit_odkazy";
        input_details.setAttribute("type", "checkbox");
        input_details.style = "width: 10px; padding: 0; margin: 0;";
        td42.appendChild(input_details);
        var t = document.createElement('span');
        var lnk = GM_getValue("url_sablon", default_url) + "/odkazy.txt";
        t.innerHTML = "&nbsp;&nbsp;(načítají se ze <a href=" + lnk + " target=\"_blank\">" + lnk + "</a>. Formát na řádek: <i>Jméno odkazu--**--http://www.odkaz.cz</i>)";
        td42.appendChild(t);
        tr4.appendChild(td42);
        tab_nastaveni.appendChild(tr4);

        //barva pozadí
        var tr5 = document.createElement('tr');
        var td51 = document.createElement('td');
        td51.innerHTML = 'Barva pozadí (výchozí #FFFFFF):';
        td51.className = "td_polozka";
        tr5.appendChild(td51);
        var td52 = document.createElement('td');
        td52.className = "td_input";
        var input_pozadi = document.createElement('input');
        input_pozadi.id = "input_pozadi";
        input_pozadi.setAttribute("type", "input");
        td52.appendChild(input_pozadi);
        tr5.appendChild(td52);
        tab_nastaveni.appendChild(tr5);

        //úkol - levé odsazení
        var tr6 = document.createElement('tr');
        var td61 = document.createElement('td');
        td61.innerHTML = 'Levé odsazení \'ukol\'(px):';
        td61.className = "td_polozka";
        tr6.appendChild(td61);
        var td62 = document.createElement('td');
        td62.className = "td_input";
        var input_ukol_left_margin = document.createElement('input');
        input_ukol_left_margin.id = "ukol_left_margin";
        input_ukol_left_margin.setAttribute("type", "input");
        td62.appendChild(input_ukol_left_margin);
        tr6.appendChild(td62);
        tab_nastaveni.appendChild(tr6);

        //výpis - levé odsazení
        var tr7 = document.createElement('tr');
        var td71 = document.createElement('td');
        td71.innerHTML = 'Levé odsazení \'vypis\' (px):';
        td71.className = "td_polozka";
        tr7.appendChild(td71);
        var td72 = document.createElement('td');
        td72.className = "td_input";
        var input_vypis_left_margin = document.createElement('input');
        input_vypis_left_margin.id = "vypis_left_margin";
        input_vypis_left_margin.setAttribute("type", "input");
        td72.appendChild(input_vypis_left_margin);
        tr7.appendChild(td72);
        tab_nastaveni.appendChild(tr7);

        //uložit
        var tr10 = document.createElement('tr');
        var td101 = document.createElement('td');
        td101.innerHTML = "&nbsp;";
        tr10.appendChild(td101);
        var td102 = document.createElement('td');
        td102.className = "td_input";
        var button_ulozit = document.createElement('input');
        button_ulozit.id = 'button_ulozit';
        button_ulozit.className = "ulozit button";
        button_ulozit.setAttribute('type', 'button');
        button_ulozit.setAttribute('value', 'Uložit nastavení');
        td102.appendChild(button_ulozit);
        tr10.appendChild(td102);
        tab_nastaveni.appendChild(tr10);

        //aktualizovat
        var button_aktualizovat = document.createElement('input');
        button_aktualizovat.id = 'button_aktualizovat';
        button_aktualizovat.className = "button ulozit";
        button_aktualizovat.setAttribute('type', 'button');
        button_aktualizovat.setAttribute('value', 'Aktualizovat šablony');
        td102.appendChild(button_aktualizovat);

        return tab_nastaveni;
    }

    var kotva_nastaveni = document.getElementsByTagName('table')[1];
    var body = document.getElementsByTagName('body')[0];
    var nastav_open = false;

    $.aktualizujSablony = function () {
        GM_xmlhttpRequest({
            method: "GET",
            url: GM_getValue("url_sablon", default_url) + "/update.php",
            onload: function (response) {
                if ((response.readyState == 4) && (response.status == 200)) {
                    alert("MasterCHC: " + response.responseText);
                } else {
                    alert("MasterCHC: Chyba! Soubor update.php nenalezen, aktualizace šablon neproběhla.");
                }
            }
        })
    };

    $("#nastaveni").click(function () {
        var meta = document.getElementsByTagName('meta')[2];
        if (!nastav_open) {
            nastav_open = true;

            if (!tabulka_nastaveni) {
                tabulka_nastaveni = vytvorNastaveni();
            }
            if (meta) {
                meta.setAttribute("content", "240");
            }
            body.insertBefore(tabulka_nastaveni, kotva_nastaveni);

            document.getElementById('input_sablony').value = GM_getValue("url_sablon", default_url);
            document.getElementById('input_jmeno').value = GM_getValue("user_name");
            document.getElementById('ukol_left_margin').value = GM_getValue("ukol_left_margin", 0);
            document.getElementById('vypis_left_margin').value = GM_getValue("vypis_left_margin", 0);
            document.getElementById('input_pozadi').value = GM_getValue("barva_pozadi", "#FFFFFF");


            var details = GM_getValue("zobrazitOdkazy", false);
            if (details) {
                document.getElementById('zobrazit_odkazy').checked = true;
            } else {
                document.getElementById('zobrazit_odkazy').checked = false;
            }


            $("#button_ulozit").click(function () {
                var temp_url = document.getElementById('input_sablony').value;

                GM_setValue("url_sablon", temp_url ? temp_url : default_url);
                GM_setValue("user_name", document.getElementById('input_jmeno').value);

                if (document.getElementById('zobrazit_odkazy').checked) {
                    GM_setValue("zobrazitOdkazy", true);
                } else {
                    GM_setValue("zobrazitOdkazy", false);
                }

                var hodnota = document.getElementById('input_pozadi').value;
                if (hodnota !== "" && hodnota.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
                    GM_setValue("barva_pozadi", document.getElementById('input_pozadi').value);
                } else {
                    alert('Master CHC: barvu je třeba zadat v hexadecimálním tvaru, například #FFFFFF.');
                }

                hodnota = document.getElementById('ukol_left_margin').value;
                if (hodnota && hodnota.match(/^[0-9]+$/)) {
                    GM_setValue("ukol_left_margin", parseInt(hodnota));
                } else {
                    alert('Master CHC: odsazení úkolu musí být celé číslo, například \'10\'');
                }

                hodnota = document.getElementById('vypis_left_margin').value;
                if (hodnota && hodnota.match(/^[0-9]+$/)) {
                    GM_setValue("vypis_left_margin", parseInt(hodnota));
                } else {
                    alert('Master CHC: odsazení výpisu musí být celé číslo, například \'10\'');
                }


                var h = this.value;
                this.value = "OK, uloženo";
                var t = this;
                setTimeout(function () {
                    t.value = h;
                }, 1300);
            });

            $("#button_aktualizovat").click(function () {
                $.aktualizujSablony();
            });

        } else {
            if (meta) {
                meta.setAttribute("content", "30");
            }

            body.removeChild(tabulka_nastaveni);
            nastav_open = false;
        }
    });

    ///opraví refresh pro úspěšném hromadném smazání admina - vrátí zobrazení do admina
    // pro zobrazení vlastních problémů po přihlášení netestuje URL
    var deletebut = document.getElementsByName('deletebut')[0];
    deletebut.setAttribute('type', 'button');
    deletebut.id = 'deletebut';

    $("#deletebut").click(function () {
        var check = document.getElementsByName('delid');
        var nalezeno = false;
        if (check) {
            //console.log("check.length " + check.length);
            for (var i = 0; i < check.length; i++) {
                if (check[i].checked) {
                    nalezeno = true;
                    deletebut.setAttribute('type', 'submit');
                    GM_setValue("deleteClick", "" + window.location);
                    $("#deletebut").trigger('click');
                    break;
                }
            }

            if (!nalezeno) {
                alert("MasterCHC: Nevybral jsi žádný problém ke smazání.");
            }
        }
    });

    if (GM_getValue("deleteClick", false)) {
        var loc = GM_getValue("deleteClick");
        GM_setValue("deleteClick", false);
        window.location.replace("" + loc);
    }

    console.log("vypis ok");
}

////////////////////////////////////////////////////////////////////////////////
/// https://chc.czechia.com/_new/ukol*
////////////////////////////////////////////////////////////////////////////////
else if (location.href.match(/ukol/)) {
    //glob proměnné
    var domena = document.getElementsByName('servicename')[0];
    var pole_reseni = document.getElementsByName('solution')[0];
    var cislo_chc = document.getElementsByName('ProblemID')[0];

    //rozdělení dle stavu CHC
    var state = document.getElementsByName('State')[0].value;
    console.log('chc state: ' + state);

    if (state == 0 || state == 5) {
        //0 nevyřešené, 5 odložené,


        ///////////////////////////////////////////////////////////////////////////
        /// ergonomie chc
        var horniTabulka = document.getElementsByTagName('table')[0];
        //zmenší obrázek pobočky
        var img = horniTabulka.getElementsByTagName('tr')[1].getElementsByTagName('img')[0];
        img.style.height = "16px";

        //upraví šířku kolonky "registrace"
        var td = horniTabulka.getElementsByTagName('tr')[3].getElementsByTagName('td')[1];
        td.style.width = "170px";

        //zvětší duležité inputy
        document.getElementsByName('servicename')[0].style.width = "100%";
        document.getElementsByName('Subject')[0].style.width = "100%";

        //odebere zbytečnosti - skryje některé nadpisy
        var span = document.getElementsByTagName('span');
        span[0].style.display = "none";
        span[1].style.display = "none";

        //user left margin
        var user_margin = GM_getValue("ukol_left_margin", false);
        if (true) {
            document.getElementsByTagName('body')[0].style.marginLeft = user_margin + 'px';
        }

        /////////////////////////////////////////////////////////////////////////////
        /// copy buttony
        //
        //pro odeslání hledání do KISS obalíme buttony formem
        var horniTab = document.getElementsByTagName('table')[0];
        var td = horniTab.getElementsByTagName('tr')[1].getElementsByTagName('td')[0];
        td.innerHTML = "";


        var kiss_form = document.createElement("form");
        kiss_form.id = "kiss_form";
        kiss_form.setAttribute("method", "POST");
        kiss_form.setAttribute("action", "https://intranet/?module=Hotline&action=Search");
        kiss_form.setAttribute("target", "_blank");
        kiss_form.setAttribute("accept-charset", "utf-8");
        kiss_form.setAttribute("style", "margin: 0; padding: 0;");
        td.appendChild(kiss_form);

        var hidden = "<input type=\"hidden\" name=\"search[]\" value=\"nameService\">";
        hidden += "<input type=\"hidden\" name=\"search[]\" value=\"IDCustomer\">";
        //hidden += "<input type=\"hidden\" name=\"search[]\" value=\"database\">";
        hidden += "<input type=\"hidden\" name=\"deleted\" value=\"1\">";
        //hidden += "<input type=\"hidden\" name=\"text\" value=\"" + domena + "\">";
        kiss_form.innerHTML += hidden;

        //konstruujeme jako objekt aby se hledal vždy aktuálná obsah pole doména
        //nutno až po inner HTML, jinak nepracuje
        var dom_input = document.createElement("input");
        dom_input.id = "dom_input";
        dom_input.setAttribute("type", "hidden");
        dom_input.setAttribute("name", "text");
        kiss_form.appendChild(dom_input);


        var chc_button = document.createElement("input");
        chc_button.className = "button copy_chc";
        chc_button.id = "copy_chc";
        chc_button.setAttribute("type", "button");
        chc_button.value = cislo_chc.value;
        chc_button.setAttribute("title", 'Uloží číslo CHC "' + chc_button.value + '"" do schránky');

        var copy = document.createElement("input");
        copy.value = document.getElementsByName('servicename')[0].value;
        copy.className = "button copy";
        copy.id = "copy_domain";
        copy.setAttribute("type", "button");
        copy.setAttribute("title", 'Uloží "' + copy.value + '" (obsah pole "Název služby") do schránky');

        /*
        var kiss_search = document.createElement("input");
        kiss_search.value = "Hledat v KISS";
        kiss_search.className = "button copy";
        kiss_search.id = "kiss_search";
        kiss_search.setAttribute("type", "button");
        kiss_search.setAttribute("title", 'Vyhledá "' + copy.value + '" v KISS');
        */


        var biss_search = document.createElement('input');
        biss_search.setAttribute('type', 'button');
        biss_search.className = "button copy";
        biss_search.setAttribute('id', 'biss_search');
        biss_search.value = 'Hledat v BISS';
        biss_search.setAttribute("title", 'Vyhledá "' + copy.value + '" v BISS');



        var backButton2 = document.createElement("input");
        backButton2.value = "Zpět na seznam bez ukládání";
        backButton2.className = "button copy";
        backButton2.id = "back1";
        backButton2.setAttribute("type", "button");
        backButton2.setAttribute("title", 'Zpět na předchozí stránku');

        kiss_form.appendChild(chc_button);
        kiss_form.appendChild(copy);
        kiss_form.appendChild(biss_search);
        // kiss_form.appendChild(kiss_search);
        kiss_form.appendChild(backButton2);

        var copy2 = document.createElement("input");
        copy2.value = "Vložit doménu do řešení";
        copy2.className = "button copy_to_text";
        copy2.id = "domain_to_text";
        copy2.setAttribute("type", "button");
        copy2.setAttribute("title", 'V poli řešení a v nové poznámce funguje zkratka \'CTRL + D\'');

        var k = document.getElementsByName('MoveConsigned')[0].parentNode;
        k.appendChild(copy2);

        //klik na buttony kopírující do schránky
        $("#copy_domain").click(function () {
            copyClick(this, domena.value.trim());
        }
        );

        $("#copy_chc").click(function () {
            copyClick(this, this.value);
        }
        );

        //klik na "do textu"
        $("#domain_to_text").click(function () {
            domenaDoTextu(pole_reseni);
        });

        // zpět
        $("#back1").click(function () {
            window.history.back();
        });

        //před odesláním vyhledávání aktualizuje doménu
        $("#biss_search").click(function (event) {
            window.open('https://biss.local.zarea.net/hotline/search?q=' + domena.value.trim(), '_blank');
        });
        /*
        $("#kiss_search").click(function () {
            dom_input.setAttribute("value", domena.value.trim());
            kiss_form.submit();
        });
        */

        function doGetCaretPosition(ctrl) {
            //zdroj http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea
            var CaretPos = 0;	// IE Support
            if (document.selection) {
                ctrl.focus();
                var Sel = document.selection.createRange();
                Sel.moveStart('character', -ctrl.value.length);
                CaretPos = Sel.text.length;
            }
            // Firefox support
            else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                CaretPos = ctrl.selectionStart;
            return (CaretPos);
        }

        function setCaretPosition(ctrl, pos) {
            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos, pos);
            }
            else if (ctrl.createTextRange) {
                var range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }

        function domenaDoTextu(pole) {
            var puvodni = pole.value;
            var pozice = doGetCaretPosition(pole);
            var zacatek = puvodni.substr(0, pozice);
            var konec = puvodni.substr(pozice, puvodni.length);
            pole.value = zacatek + domena.value.trim() + konec;
            pole.focus();
            setCaretPosition(pole, zacatek.length + domena.value.trim().length);
        }

        // klávesové zkratky
        //ctrl+d, doména do textu. Nutno registrovat pro každé textarea zvlášť
        $(pole_reseni).bind('keydown', 'ctrl+d', function (evt) {
            evt.preventDefault();
            domenaDoTextu(pole_reseni);
        });

        var poznamka = document.getElementsByName('new_note')[0];
        $(poznamka).bind('keydown', 'ctrl+d', function (evt) {
            evt.preventDefault();
            domenaDoTextu(poznamka);
        });

        /*
         $(document).bind('keydown', 'ctrl+d',function (evt){
         evt.preventDefault();
         domenaDoTextu();
         }); */

        // neodesílat řešení vloží tečku
        $("input[name='ContactNotSend']").click(function () {
            if (!pole_reseni.value) {
                pole_reseni.value = ".";
            } /* else if (pole_reseni.value == ".") {
             pole_reseni.value = "";
             }*/
        });

        // předchází chybě, kdy není zadán způsob řešení
        /*
         var solvebut = document.getElementsByName('solvebut')[0];
         solvebut.setAttribute('type', 'button');
         solvebut.id = 'solvebut';

         $("#solvebut").click(function() {
         var tab = document.getElementsByName('TimeSpent')[0].parentNode.parentNode.parentNode.parentNode;

         alert(" " + tab.className);

         var ok = false;
         for (var i = 0; i < chck.length; i++) {
         if (chck[i].checked) {
         ok = true;
         break;
         }

         if (ok) {
         //document.getElementsByTag('form1')[0].submit();
         alert("ok" + i);
         } else {
         alert('MasterCHC: Není vybrán způsob řešení problému.');
         }
         }
         });
         */

        /// otevření mailu pro zákazníka v klientovi
        var open_mail = document.createElement('a');
        open_mail.id = 'open_mail';
        var href = 'mailto:';
        href += document.getElementsByName('email')[0].value;
        href += '?bcc=admin@zoner.cz&cc=admin@zoner.cz&subject=';
        href += '#' + cislo_chc.value + " - " + domena.value + " - " + document.getElementsByName('Subject')[0].value;
        href += '&body=Uprav v adrese "kopie" na "odpovědět" (bohužel nejde automatizovat pomocí HTML či JS)';
        open_mail.setAttribute('href', href);
        kotva = document.getElementsByName('ReplyBut')[0];
        kotva.parentNode.insertBefore(open_mail, kotva);
        open_mail.innerHTML = '<input class="button open_mail" type="button" value="Odpověď z klienta" title="Otevře mail v poštovním klientovi" />';

        /// předat oddělení
        kotva = document.getElementsByName('savebut')[0];
        var predat_inshop = document.createElement("input");
        predat_inshop.id = "predat_inshop";
        predat_inshop.addEventListener('click', function () {
            predat_osobe(inshop[1], true)
        });
        predat_inshop.setAttribute("type", "button");
        predat_inshop.style.margin = "0";
        predat_inshop.setAttribute("class", "button but inshop light-green");
        predat_inshop.setAttribute("value", inshop[0]);
        predat_inshop.setAttribute("title", "Předat ticket specialistům");
        kotva.parentNode.appendChild(predat_inshop);

        var predat_ssl = document.createElement("input");
        predat_ssl.id = "predat_ssl";
        predat_ssl.addEventListener('click', function () {
            predat_osobe(ssl[1], true)
        });
        predat_ssl.setAttribute("type", "button");
        predat_ssl.setAttribute("class", "button but ssl light-green");
        predat_ssl.setAttribute("value", ssl[0]);
        predat_ssl.setAttribute("title", "Předat ticket specialistům");
        kotva.parentNode.appendChild(predat_ssl);

        var predat_inpage = document.createElement("input");
        predat_inpage.id = "predat_inpage";
        predat_inpage.addEventListener('click', function () {
            predat_osobe(inpage[1], true)
        });
        predat_inpage.setAttribute("type", "button");
        predat_inpage.setAttribute("class", "button but inpage light-green");
        predat_inpage.setAttribute("value", inpage[0]);
        predat_inpage.setAttribute("title", "Předat ticket specialistům");
        kotva.parentNode.appendChild(predat_inpage);

        var predat_inmail = document.createElement("input");
        predat_inmail.id = "predat_inmail";
        predat_inmail.addEventListener('click', function () {
            predat_osobe(inmail[1], true)
        });
        predat_inmail.setAttribute("type", "button");
        predat_inmail.setAttribute("class", "button but inmail");
        predat_inmail.setAttribute("value", inmail[0]);
        predat_inmail.setAttribute("title", "Předat ticket specialistům");
        kotva.parentNode.appendChild(predat_inmail);

        // uložení dat pro klik na přílohu
        var $solution = $("textarea[name='solution']");
        var $note = $("textarea[name='new_note']");
        var $attachmentButton = $("#addatt");

        // load text
        loadTaskTexts();
        // store task text on attachment add click
        $attachmentButton.on('click', storeTaskTexts);


        function storeTaskTexts() {
            console.log('store', $note.val());
            GM_setValue("taskSolutionText", $solution.val());
            GM_setValue("taskNoteText", $note.val());
        }


        function loadTaskTexts() {
            // load text only if use came from attachment view
            if (document.referrer && document.referrer.match(/priloha\.asp/)) {
                $solution.val(GM_getValue("taskSolutionText", ''));
                $note.val(GM_getValue("taskNoteText", ''));
            }

            GM_deleteValue("taskSolutionText");
            GM_deleteValue("taskNoteText");
        }

        ////////// ŠABLONY ///////////////////////////////////////////////////////
        /// globální proměnné pro šablony
        var znacka = "--**--";
        var glob_kategorie;
        var glob_odpovedi;
        var url = GM_getValue("url_sablon", default_url);

        var div_sablony = document.createElement("div");
        div_sablony.id = "div_sablony";

        var kategorie = document.createElement("select");
        kategorie.id = "kategorie";
        kategorie.style = "width: 30%; margin: 3px 0px 3px 0px;";
        //kategorie.innerHTML += "<option>kat</option>";

        var odpovedi = document.createElement("select");
        odpovedi.id = "odpovedi";
        odpovedi.style = "width: 69%; margin: 3px 0px 3px 3px;";

        div_sablony.appendChild(kategorie);
        div_sablony.appendChild(odpovedi);

        var kotva = document.getElementsByName('CorespBut')[0].parentNode;
        kotva.appendChild(div_sablony);

        function nactiKategorie(inic) {
            //načte z indexu kategorií info a updatuje select kategorií
            GM_xmlhttpRequest({
                method: "GET",
                url: url + "/kategorie.txt",
                //synchronous: true,
                onload: function (response) {
                    if ((response.readyState == 4) && (response.status == 200)) {
                        nastavKategorie(response.responseText.trim(), inic);
                    } else {
                        nastavKategorie("Došlo k chybě, šablony nenačteny", false);
                    }
                }
            })
        }

        function nactiOdpovedi(kategorie) {
            //načte kategorie
            GM_xmlhttpRequest({
                method: "GET",
                url: url + "/" + kategorie + "/seznam.txt",
                onload: function (response) {
                    if (response.readyState == 4) {
                        //alert("-" + response.responseText + "-");
                        nastavOdpovedi(response.responseText.trim());
                    }
                }
            })
        }

        function nactiSablonu(kategorie, sablona) {
            //načte kategorie
            GM_xmlhttpRequest({
                method: "GET",
                url: url + "/" + kategorie + "/" + sablona + "",
                onload: function (response) {
                    if ((response.readyState == 4) && (response.status == 200)) {
                        nastavSablonu(response.responseText.trim());
                    } else {
                        nastavKategorie("Došlo k chybě, šablona nenalezena", false);
                    }
                }
            })
        }

        function nastavKategorie(text, inic) {
            //nastaví select box s kategoriemi
            glob_kategorie = rozdelText(text.split("\n"), znacka);
            var delka = glob_kategorie.length;
            //var html = "<div style='margin: 3px 0px 3px 0px; widht: 100%;' ><select style='width: 30%;' id=\"kategorie\">";
            var html;
            for (i = 0; i < delka; i++) {
                html += "<option>" + glob_kategorie[i][0] + "</option>";
            }

            var kotva = document.getElementById('kategorie');
            kotva.innerHTML = html;

            //pokud je to první volání po načtení, vypíšeme odpovědi z první kategorie
            if (inic) {
                nactiOdpovedi(glob_kategorie[0][1]);
            }
        }

        function nastavOdpovedi(text) {
            //nastaví selext box s odpovědmi dle kategorie
            var oddel = znacka + "\r\n";
            //var lines = textarea.value.replace(/\r\n/g, "\n");
            glob_odpovedi = rozdelText(text.split("\n"), znacka);
            //glob_odpovedi.sort();  netřeba, seřazeno už v seznam.txt
            var delka = glob_odpovedi.length;
            var html = "<option> -- vyber šablonu -- </option>";
            for (i = 0; i < delka; i++) {
                html += "<option>" + glob_odpovedi[i][0] + "</option>";
            }
            var kotva = document.getElementById('odpovedi');
            kotva.innerHTML = html;
        }

        function nastavSablonu(text) {
            var domena = document.getElementsByName('servicename')[0].value.trim();
            var sablona = text.split(znacka);
            var reseni = document.getElementsByName('solution')[0];

            sablona = sablona[1].trim();
            sablona = sablona.replace(/\$domena\$/gmi, domena);

            reseni.value += sablona;
        }

        function rozdelText(pole, oddelovac) {
            //rozdělí řádky na buňky pole dle oddělovače
            var vysledek = new Array();
            var delka = pole.length;
            for (i = 0; i < delka; i++) {
                var radek = pole[i].split(oddelovac);
                vysledek.push(radek);
            }
            return vysledek;
        }

        nactiKategorie(true);

        //klik na kategorii
        $("#kategorie").change(function () {
            var index_kategorie = this.selectedIndex;
            nactiOdpovedi(glob_kategorie[index_kategorie][1]);
        });

        //klik na odpoveď
        $("#odpovedi").change(function () {
            var index_kategorie = document.getElementById('kategorie').selectedIndex;
            var index_sablony = this.selectedIndex;
            nactiSablonu(glob_kategorie[index_kategorie][1], glob_odpovedi[index_sablony - 1][1]);
        });

        ///////////////////////////////////////////////////////////////////////////
        /// whois link
        var dom = domena.value.toLowerCase().trim();
        var whois_list = {
            'misc_whois': 'http://whois.testwebu.com?q=' + dom,
            //'misc_whois': 'http://hotline.testwebu.com/master_chc/whois.php?domain=' + dom,
            'cz': 'https://www.regzone.cz/cznic/domain/whois/?name=' + dom,
            'sk': 'http://whois.sk-nic.sk/index.jsp?whois=' + dom + '&a=details',
            /*'com': 'https://joker.com/index.joker?t_whois=' + dom + '&tool=whois',*/
            'com': 'http://hotline.testwebu.com/master_chc/whois.php?domain=' + dom,
            'info': 'http://hotline.testwebu.com/master_chc/whois.php?domain=' + dom,
            'net': 'http://hotline.testwebu.com/master_chc/whois.php?domain=' + dom,
            'org': 'http://hotline.testwebu.com/master_chc/whois.php?domain=' + dom,
            'biz': 'http://hotline.testwebu.com/master_chc/whois.php?domain=' + dom,
            'eu': 'https://www.regzone.cz/eurid/domain/whois/?name=' + dom
            //'hu': 'http://www.domain.hu/domain/English/domainsearch/whois.html?domain=' + dom + '&ekes=' + dom
        };

        //if (dom.match(/\b[0-9a-z\-]+\.{1}[a-z]{2,20}\b|\b[0-9a-z\-]+\.{1}[a-z]{2,3}\.{1}[a-z]{2,20}\b/)) {
        if (dom.match(dom_regexp)) {
            //icann seznam existujících tlds
            //http://data.iana.org/TLD/tlds-alpha-by-domain.txt

            var tld = dom.split(".")[1];
            var whois;
            console.log("\nmatch: " + dom + "\ntld: " + tld);

            if (whois_list[tld]) {
                whois = whois_list[tld];
                tld = tld.toUpperCase();
            } else {
                whois = whois_list['misc_whois'];
                tld = "obecný";
            }

            var desc_row = document.getElementsByName('Description')[0].parentNode.parentNode;
            var tabulka = desc_row.parentNode;
            var radek = document.createElement('tr');
            radek.innerHTML = '<th>&nbsp;Whois&nbsp;(' + tld + '):</th><td class="whois_td"><a href="' + whois + '" target="_blank">' + whois + '</a></td>';
            tabulka.insertBefore(radek, desc_row);
        }


        //////////////////////////////////////////////////////////////////////////
        /// InfoPanel
        if (GM_getValue("zobrazitOdkazy", false)) {
            var body = document.getElementsByTagName('body')[0];
            body.style.margin = 0;
            body.style.padding = 10;
            var obsah = document.getElementsByTagName('form')[0];
            obsah.style = "style: inline; float: left;";
            var box = document.createElement("div");
            box.className = "box";

            var con = obsah.parentNode;
            con.appendChild(box);

            var tab = document.createElement('table');
            tab.className = 'tab_nor2 infotable';
            var tr1 = document.createElement('tr');
            tr1.innerHTML = '<td colspan="2" class="infonadpis">Uživatelské odkazy</td>';
            tab.appendChild(tr1);

            function nactiOdkazy() {
                //načte kategorie
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url + "/odkazy.txt",
                    onload: function (response) {
                        if ((response.readyState == 4) && (response.status == 200)) {
                            nastavOdkazy(response.responseText.trim());
                        } else {
                            var tr = document.createElement('tr');
                            tr.innerHTML = '<td>žádné odkazy nenalezeny</td>';
                            tab.appendChild(tr);
                        }
                    }
                })
            }

            function nastavOdkazy(text) {
                var odkazy = rozdelText(text.split("\n"), znacka);

                for (var i = 0; i < odkazy.length; i++) {
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td><a href="' + odkazy[i][1] + ' " target="_blank">' + odkazy[i][0] + '</a></td>';
                    tab.appendChild(tr);
                }
            }

            nactiOdkazy();
            box.appendChild(tab);
            con.appendChild(box);
        }

        /*
    
         var tr2 = document.createElement('tr');
         link = vytvorWhoisLink(whois_link[index]);
         tr2.innerHTML = '<td class="info_titulek">WhoIs:</td><td><a href="' + link + ' " target="_blank">' + link + '</a></td>';
         tab.appendChild(tr2);
    
         var tr3 = document.createElement('tr');
         tr3.innerHTML = '<td class="info_titulek">Datum expirace:</td><td>-todo-</td>';
         tab.appendChild(tr3);
    
         var tr4 = document.createElement('tr');
         tr4.innerHTML = '<td class="info_titulek">Mimo zónu:</td><td>-todo-</td>';
         tab.appendChild(tr4);
    
         var tr5 = document.createElement('tr');
         tr5.innerHTML = '<td class="info_titulek">Datum zrušení:</td><td>-todo-</td>';
         tab.appendChild(tr5);
    
         var tr6 = document.createElement('tr');
         tr6.innerHTML = '<td colspan="2" class="infonadpis">&nbsp;</td>';
         tab.appendChild(tr6);
    
         var tr7 = document.createElement('tr');
         tr7.innerHTML = '<td colspan="2" class="infonadpis">Info z Centra administrace</td>';
         tab.appendChild(tr7);
    
         var tr8 = document.createElement('tr');
         tr8.innerHTML = '<td class="info_titulek">Varianta:</td><td>-todo-</td>';
         tab.appendChild(tr8);
         */




        console.log("ukol ok");
    } else if (state == 2) {
        // 2 vyřešené
        var horniTab = document.getElementsByTagName('table')[0];
        var td = horniTab.getElementsByTagName('tr')[1].getElementsByTagName('td')[0];
        td.innerHTML = "";

        var chc_button = document.createElement("input");
        chc_button.className = "button copy_chc";
        chc_button.id = "copy_chc";
        chc_button.setAttribute("type", "button");
        chc_button.value = cislo_chc.value;
        chc_button.setAttribute("title", 'Uloží číslo CHC "' + chc_button.value + '"" do schránky');

        td.appendChild(chc_button);

        $("#copy_chc").click(function () {
            copyClick(this, this.value);
        }
        );
    }
}

////////////////////////////////////////////////////////////////////////////////
/// https://chc.czechia.com/_new/novy*
////////////////////////////////////////////////////////////////////////////////
else if (location.href.match(/novy/)) {
    var domena = document.getElementsByName('servicename')[0];
    var subject = document.getElementsByName('subject')[0];

    // nastaví select "Přidělit:" defaultně na operátora
    var pridelit = document.getElementsByName('admin')[0];
    pridelit.selectedIndex = 1;

    //schová řádek tabulky se jmény k ničemu
    document.getElementsByTagName('tr')[7].style.display = "none";

    //zvětší pole s textem zprávy atd
    var zprava = document.getElementsByName('description')[0];
    zprava.style.height = "390px";

    subject.style.width = "100%";
    subject.style.margin = "0px 0px 0 0";
    var servicename = document.getElementsByName('servicename')[0];
    servicename.style.width = "379px";

    //user left margin
    var user_margin = GM_getValue("ukol_left_margin", false);
    if (user_margin) {
        document.getElementsByTagName('body')[0].style.marginLeft = user_margin;
    }




    // přesuneme detelebut, pokud tedy nejsme na stránce s úplě novým, kde není
    var delbut = document.getElementsByName('deletebut')[0];
    if (delbut) {
        var kotva = delbut.parentNode;
        kotva.removeChild(delbut);
        kotva = document.getElementsByName('priority')[0].parentNode;
        kotva.appendChild(delbut);
        delbut.className = "button delete";
    }

    // přesuneme spam button, pokud tedy nejsme na stránce s úplě novým, kde není
    var spambut = $("input[name='spambut']")[0];
    console.log(spambut);
    if (spambut) {
        var kotva = spambut.parentNode;
        kotva.removeChild(spambut);
        kotva = document.getElementsByName('priority')[0].parentNode;
        $(spambut)
            .css('float', 'right')
            .attr('value', 'Smazat jako SPAM');
        kotva.appendChild(spambut);
        //spambut.className = "button delete";
    }



    //vyhledat v CA
    kotva = servicename.parentNode;

    var td_serv = kotva.childNodes[0];
    kotva.removeChild(td_serv);    //odebereme pole

    var kiss_form2 = document.createElement("form");
    kiss_form2.id = "kiss_form2";
    kiss_form2.setAttribute("method", "POST");
    kiss_form2.setAttribute("action", "https://intranet/?module=Hotline&action=Search");
    kiss_form2.setAttribute("target", "_blank");
    kiss_form2.setAttribute("accept-charset", "utf-8");
    kiss_form2.className = "kiss_form2";

    var hidden = "<input type=\"hidden\" name=\"search[]\" value=\"nameService\">";
    hidden += "<input type=\"hidden\" name=\"search[]\" value=\"IDCustomer\">";
    //hidden += "<input type=\"hidden\" name=\"search[]\" value=\"database\">";
    hidden += "<input type=\"hidden\" name=\"deleted\" value=\"1\">";
    //hidden += "<input type=\"hidden\" name=\"text\" value=\"" + domena + "\">";
    kiss_form2.innerHTML += hidden;

    var dom_hidden = document.createElement('input');
    dom_hidden.id = "dom_hidden";
    dom_hidden.setAttribute("type", "hidden");
    dom_hidden.setAttribute("name", "text");
    //dom_hidden.setAttribute("value", domena.value);
    kiss_form2.appendChild(dom_hidden);

    // vložení a pars pro CHC copy button
    var chc_copy2 = document.createElement("input");
    chc_copy2.value = document.getElementsByName('ID')[0].value;
    chc_copy2.id = "chc_copy2";
    chc_copy2.className = "button copy chc_copy2";
    chc_copy2.setAttribute("title", 'Vloží číslo CHC "' + chc_copy2.value + '" do schránky');
    chc_copy2.setAttribute('type', 'button');
    kiss_form2.appendChild(chc_copy2);

    /*
    var kiss_search2 = document.createElement("input");
    kiss_search2.value = "KISS";
    kiss_search2.className = "button copy kiss2";
    kiss_search2.id = "kiss_search2";
    kiss_search2.setAttribute("type", "button");
    kiss_search2.setAttribute("title", 'Vyhledá službu v KISS');
    */

    var biss_search = document.createElement('input');
    biss_search.setAttribute('type', 'button');
    biss_search.className = "button copy kiss2";
    biss_search.setAttribute('id', 'biss_search2');
    biss_search.value = 'BISS';
    biss_search.setAttribute("title", 'Vyhledá službu v BISS');

    kotva.insertBefore(kiss_form2, kotva.firstChild);
    kotva.appendChild(td_serv);
    kotva.appendChild(kiss_form2); //vložíme odebrané pole
    kiss_form2.appendChild(biss_search);

    /*
     $("input[name='servicename']").change(function() {
     dom_hidden.setAttribute("value", servicename.value);
     //console.log(servicename.value);
     });
     */

        //před odesláním vyhledávání aktualizuje doménu
    $("#biss_search2").click(function (event) {
        window.open('https://biss.local.zarea.net/hotline/search?q=' + servicename.value.trim(), '_blank');
    });


    /*
     var new_id = document.getElementsByName('ID')[0].value;
     if(new_id > 0){
     chc_copy2.value = new_id;
     }
     */

    $("#chc_copy2").click(function () {
        copyClick(this, this.value);
    });

    // back button nahoru
    var backButton3 = document.createElement("input");
    backButton3.value = "Zpět na seznam bez ukládání";
    backButton3.className = "button copy";
    backButton3.id = "back2";
    backButton3.setAttribute("type", "button");
    backButton3.setAttribute("title", 'Zpět na předchozí stránku');

    $("span.nadpismaly").first()
        .before(backButton3)
        .before('<br><br>');

    // zpět
    $("#back2").click(function () {
        window.history.back();
    });



    //předat
    var inputbut = document.getElementsByName('inputbut')[0];
    inputbut.value = predat_problem_uzivateli;
    inputbut.className = 'button jednotlivci';

    //předat sobě
    var jmeno = GM_getValue("user_name", "nenastaveno");
    var predat_mi = document.createElement("input");
    predat_mi.id = "predat_mi";
    predat_mi.addEventListener('click', function () {
        predat_osobe(jmeno), false
    }, false);
    predat_mi.setAttribute("type", "button");
    predat_mi.setAttribute("class", "button but prevzit");
    predat_mi.setAttribute("title", "Předat ticket sobě - máš nastavené jméno '" + jmeno + "'");
    predat_mi.style.margin = "0 0 0 3px";
    predat_mi.setAttribute("value", "Převzít problém");
    inputbut.parentNode.appendChild(predat_mi);

    /*
     $("#predat_mi").click(function() {
     var user_name = GM_getValue("user_name");
     var select = document.getElementsByName('admin')[0];
     var options = select.childNodes;
     var regexp = new RegExp(user_name, 'gmi');

     if (user_name) {
     for (var i = 0; i < options.length; i++) {
     if (options[i].innerHTML.match(regexp)) {
     //alert(options[i].value);
     select.selectedIndex = i;
     $('input[name="inputbut"]').trigger('click');
     //document.getElementsByName('form1')[0].submit();
     break;
     }
     }
     } else {
     alert('MasterCHC: V nastavení nemáš nastaveno jméno.');
     }
     });*/

    // předat oddělení
    var predat_inshop = document.createElement("input");
    predat_inshop.id = "predat_inshop";
    predat_inshop.addEventListener('click', function () {
        predat_osobe(inshop[1], false)
    });
    predat_inshop.setAttribute("type", "button");
    predat_inshop.setAttribute("class", "button but light-green inshop");
    predat_inshop.setAttribute("value", inshop[0]);
    predat_inshop.setAttribute("title", "Předat ticket specialistům");
    inputbut.parentNode.appendChild(predat_inshop);

    var predat_ssl = document.createElement("input");
    predat_ssl.id = "predat_ssl";
    predat_ssl.addEventListener('click', function () {
        predat_osobe(ssl[1]), false
    });
    predat_ssl.setAttribute("type", "button");
    predat_ssl.setAttribute("class", "button but ssl light-green");
    predat_ssl.setAttribute("value", ssl[0]);
    predat_ssl.setAttribute("title", "Předat ticket specialistům");
    inputbut.parentNode.appendChild(predat_ssl);

    var predat_inpage = document.createElement("input");
    predat_inpage.id = "predat_inpage";
    predat_inpage.addEventListener('click', function () {
        predat_osobe(inpage[1], false)
    });
    predat_inpage.setAttribute("type", "button");
    predat_inpage.setAttribute("class", "button but inpage light-green");
    predat_inpage.setAttribute("value", inpage[0]);
    predat_inpage.setAttribute("title", "Předat ticket specialistům");
    inputbut.parentNode.appendChild(predat_inpage);

    var predat_inmail = document.createElement("input");
    predat_inmail.id = "predat_inmail";
    predat_inmail.addEventListener('click', function () {
        predat_osobe(inmail[1], false)
    });
    predat_inmail.setAttribute("type", "button");
    predat_inmail.setAttribute("class", "button but inmail");
    $(predat_inmail).css('margin', '0 -12px 0 3px');
    predat_inmail.setAttribute("value", 'Přesunout do ' + inmail[0]);
    predat_inmail.setAttribute("title", "Předat ticket na InMail");
    console.log($("input[name=ReplyButDontOpen]").parent());
    $("input[name=ReplyButDontOpen]").after(predat_inmail);


    // převzít s nulou
    kotva = document.getElementsByName('ContactMethodphone')[0].parentNode;
    kotva.innerHTML += '&nbsp; &nbsp;';
    var nula = document.createElement('input');
    nula.id = 'nula';
    nula.className = 'button';
    nula.setAttribute('type', 'button');
    nula.setAttribute('value', 'vynulovat');
    kotva.appendChild(nula);

    $("#nula").click(function () {
        document.getElementsByName('insertmethod')[0].selectedIndex = 1;
        document.getElementsByName('phone')[0].value = 0;
        document.getElementsByName('email')[0].value = "";
        document.getElementsByName('fax')[0].value = "";
        document.getElementsByName('ContactMethodphone')[0].checked = true;
        document.getElementsByName('ContactMethodmail')[0].checked = false;
        document.getElementsByName('ContactMethodfax')[0].checked = false;
    });

    //console.log("novy ok");

    //pokus o pars domény (resp. názvu služby) z předmetu
    if (subject.value && !domena.value) {
        //zkusíme najít doménu 3.úrovně NEBO doménu 2. úrovně, je třeba napsat "naopak", vyhodnocuje se nejspíše zezadu
        //var domena_pars = subject.value.match(/\b[0-9a-z\-]+\.{1}[0-9a-z\-]+\.{1}[a-z]{2,4}\b|\b[0-9a-z\-]+\.{1}[a-z]{2,4}\b/i);
        //var domena_pars = subject.value.match(/\b[0-9a-z\-]+\.{1}[a-z]{2,4}\b|\b[0-9a-z\-]+\.{1}[0-9a-z\-]+\.{1}[a-z]{2,4}\b/i);
        var domena_pars = subject.value.match(service_regexp);

        //console.log("pars ok" + domena_pars.length);
        if (domena_pars) {
            var val = domena_pars[0].toLowerCase()
            // je třeba zachytit p***vinu "Re: CZECHIA.COM - faktura - danovy doklad c. 141100482",
            // a taky joker.com

            //console.log(val);

            if ($.inArray(val, excluded_domains) < 0) {
                //console.log('not excl');
                domena.value = val;
            } else {
                //console.log('excl');
            }
            //console.log("pars if ok" + domena_pars[0]);
        }

    }
}
////////////////////////////////////////////////////////////////////////////////
/// https://chc.czechia.com/_new/coresp*
////////////////////////////////////////////////////////////////////////////////
else if (location.href.match(/coresp/)) {
    //user left margin
    var user_margin = GM_getValue("ukol_left_margin", false);
    if (user_margin) {
        document.getElementsByTagName('body')[0].style.marginLeft = user_margin;
    }

}
