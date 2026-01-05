// ==UserScript==
// @name       WorldContagion Utilitaire
// @version    0.36
// @description  Deux boutons pour attaquer les inactifs + une calculatrice dans le menu communication + Construction automatique de défense
// @match      w1.worldcontagion.com/*
// @match      w2.worldcontagion.com/*
// @copyright  2014+, You
// @namespace https://greasyfork.org/users/5790
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5540/WorldContagion%20Utilitaire.user.js
// @updateURL https://update.greasyfork.org/scripts/5540/WorldContagion%20Utilitaire.meta.js
// ==/UserScript==


function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function setCookie(nom, valeur, expire, chemin, domaine, securite){
    document.cookie = nom + ' = ' + escape(valeur) + '  ' +
        ((expire == undefined) ? '' : ('; expires = ' + expire.toGMTString())) +
        ((chemin == undefined) ? '' : ('; path = ' + chemin)) +
        ((domaine == undefined) ? '' : ('; domain = ' + domaine)) +
        ((securite == true) ? '; secure' : '');
}

function getCookie(name){
    if(document.cookie.length == 0)
        return null;
    
    var regSepCookie = new RegExp('(; )', 'g');
    var cookies = document.cookie.split(regSepCookie);
    
    for(var i = 0; i < cookies.length; i++){
        var regInfo = new RegExp('=', 'g');
        var infos = cookies[i].split(regInfo);
        if(infos[0] == name){
            return unescape(infos[1]);
        }
    }
    return null;
}

// test si un element possède la classe cls
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function unset(array, index){
    
    var output=[];
    
    var j = 0;
    
    for(var i in array){
        
        if (i!=index){
            
            output[j]=array[i];
            
            j++;
            
        }
        
    }
    
    return output;
    
}

function removeData(index)
{
   var data = loadDataStorage('construction');
   saveDataStorage('construction',unset(data,index));
}

function saveDataStorage(key,data)
{
    var val = JSON.stringify(data);
    console.log(val);
    localStorage.setItem(key, val);
}

function loadDataStorage(key)
{
    return JSON.parse(window.localStorage.getItem(key));
}

// Ajoute un objet dans le data key
function addData(key, obj)
{
    var data = loadDataStorage(key);
    
    if(data == null)
    {
        data = new Array();   
    }
    
    data.push(obj);
    
    saveDataStorage(key,data);
    
}


function calculer()
{
    //On récupère le nombre d'acides, de germes et de parasites
    var acides = parseInt(document.getElementById('acides').value);
    var germes = parseInt(document.getElementById('germes').value);
    var parasites = parseInt(document.getElementById('parasites').value);
    
    var acidesNormal = acides*35/100;
    var germesNormal = germes*35/100;
    var parasitesNormal = parasites*35/100;
    
    var transporteurNormal = Math.ceil(Math.max(acidesNormal/3000,germesNormal/1500,parasitesNormal/600));
    var transporteurLNormal = Math.ceil(Math.max(acidesNormal/12000,germesNormal/6000,parasitesNormal/2400));
    
    var acidesCapitule = acides*20/100;
    var germesCapitule = germes*20/100;
    var parasitesCapitule = parasites*20/100;
    
    var transporteurCapitule = Math.ceil(Math.max(acidesCapitule/3000,germesCapitule/1500,parasitesCapitule/600));
    var transporteurLCapitule = Math.ceil(Math.max(acidesCapitule/12000,germesCapitule/6000,parasitesCapitule/2400));
    
    document.getElementById('acidesNormal').innerText = acidesNormal;
    document.getElementById('germesNormal').innerText = germesNormal;
    document.getElementById('parasitesNormal').innerText = parasitesNormal;
    
    document.getElementById('transporteurNormal').innerText = transporteurNormal;
    document.getElementById('transporteurLNormal').innerText = transporteurLNormal;
    
    document.getElementById('acidesCapitule').innerText = acidesCapitule;
    document.getElementById('germesCapitule').innerText = germesCapitule;
    document.getElementById('parasitesCapitule').innerText = parasitesCapitule;
    
    document.getElementById('transporteurCapitule').innerText = transporteurCapitule;
    document.getElementById('transporteurLCapitule').innerText = transporteurLCapitule;
    
}

//Creation du bloc pour lancer les scripts
function createBlocScript()
{ 
    //Bloc menu
    var divMenu = document.createElement("div");
    
    divMenu.className = "menu";
    
    divMenu.innerHTML = "<div onclick=\"localStorage.setItem('action','attaqueInactif');\"><a href=\"/contagion/armee\">Attaquer inactif</a></div><div onclick=\"localStorage.setItem('action','attaqueInactif');localStorage.setItem('multi','true');\"><a href=\"/contagion/armee\">Attaquer en masse</a></div>";
    
    var blocGauche = document.getElementById('left');
    
    
    blocGauche.insertBefore(divMenu, blocGauche.firstChild); 
}

// Création de la calculatrice pour déterminé les ressources a obtenir suite à un espionnage et le nombre de transporteur max à emmener
function createBlocCalculatrice()
{
    var divCalc = document.createElement("div");
    
    var br = document.createElement("br");
    
    divCalc.className = "right-bloc";
    
    // Ajout du titre
    var span = document.createElement("span");
    span.className = "texte16 yellow";
    span.innerText = "Calculatrice";
    
    divCalc.appendChild(span);
    
    divCalc.appendChild(br);
    
    var div = document.createElement('div');
    
    div.className = "communication-right-elm";
    
    var input = document.createElement("input");
    
    input.type = "text";
    input.placeholder = "Acides";
    input.id = "acides";
    
    div.appendChild(input);
    
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Germes";
    input.id = "germes";
    
    div.appendChild(input);
    
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Parasites";
    input.id = "parasites";
    
    div.appendChild(input);
    
    div.appendChild(br);
    
    var button = document.createElement("button");
    
    button.innerText = "Calculer";
    button.onclick = function (){
        calculer();
    }
    
    div.appendChild(button);
    
    divCalc.appendChild(div);
    
    var divTable = document.createElement("div");
    
    divTable.className = "div-table";
    
    
    
    var table = document.createElement("table");
    
    var tbody = document.createElement("tbody");
    
    var tr = document.createElement("tr");
    
    //Acides en normal
    var td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Acides obtenues : ";
    tr.appendChild(td);
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "";
    td.id = "acidesNormal";
    tr.appendChild(td);
    
    tbody.appendChild(tr);
    
    //Germes en normal
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Germes : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "germesNormal";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    //Parasites en normal
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Parasites : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "parasitesNormal";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    //Transporteur en normal
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Transporteurs nécessaires : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "transporteurNormal";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    //Transporteur lourd en normal
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Transporteurs lourd nécessaires : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "transporteurLNormal";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    
    table.appendChild(tbody);
    
    divTable.appendChild(table);
    
    // Ajout du titre
    span = document.createElement("span");
    span.className = "texte16 yellow";
    span.innerText = "Résultat";
    
    divCalc.appendChild(document.createElement("br"));
    
    divCalc.appendChild(span);
    
    divCalc.appendChild(divTable);
    
    
    // Résultat en cas de capitulation
    divTable = document.createElement("div");
    
    divTable.className = "div-table";
    
    
    
    table = document.createElement("table");
    
    tbody = document.createElement("tbody");
    
    tr = document.createElement("tr");
    
    //Acides en capitulation
    var td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Acides : ";
    tr.appendChild(td);
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "";
    td.id = "acidesCapitule";
    tr.appendChild(td);
    
    tbody.appendChild(tr);
    
    //Germes en capitulation
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Germes : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "germesCapitule";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    //Parasites en capitulation
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Parasites : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "parasitesCapitule";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    //Transporteur en capitulation
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Transporteurs nécessaires : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "transporteurCapitule";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    //Transporteur lourd en capitulation
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.style.width = "50%";
    td.innerText = "Transporteurs lourd nécessaires : ";
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.width = "50%";
    td.id = "transporteurLCapitule";
    tr.appendChild(td);
    tbody.appendChild(tr);
    
    
    table.appendChild(tbody);
    
    divTable.appendChild(table);
    
    // Ajout du titre
    span = document.createElement("span");
    span.className = "texte16 yellow";
    span.innerText = "Résultat en cas de capitulation";
    
    divCalc.appendChild(document.createElement("br"));
    
    divCalc.appendChild(span);
    
    divCalc.appendChild(divTable);
    
    // On insère le divCalc dans la page
    var blocDroit = document.getElementById('communication-right');
    var blocAmis = document.getElementById('communication-right-bloc-amis');
    
    
    blocDroit.insertBefore(divCalc,blocAmis);
    
    // On ajoute un bloc right-top-margin
    
    div = document.createElement("div");
    
    div.className = "right-top-margin";
    
    blocDroit.insertBefore(div,blocAmis);
    
}

function getCurrentContinent()
{
    // On récupère le continent
    var choix = document.getElementById('header-content-right').getElementsByTagName('select')[0];
    return choix.options[choix.selectedIndex].value;   
}

function getContinent(value)
{
    // On récupère le continent
    var choix = document.getElementById('header-content-right').getElementsByTagName('select')[0].options;
    for(var i=0;i<choix.length;i++)
    {
        if(choix[i].value == value)
            return choix[i].text;
    }
    return "";
}

function goContinent(value)
{
    // On se rend dans le continent value
    var choix = document.getElementById('header-content-right').getElementsByTagName('select')[0].options;
    for(var i=0;i<choix.length;i++)
    {
        
        if(choix[i].value == value)
        {
            console.log("clique sur "+choix[i].value);
            choix[i].selected = "selected";
            document.getElementById('header-content-right').getElementsByTagName('select')[0].onchange();
        }
    }
}

// Lance une construction de défense
function lancerConstruction()
{
    var data = loadDataStorage("construction");
    console.log(data);
    // On récupère le premier élément du tableau
    var obj = data[0];
    
    // On récupère l'id, le nombre à construire
    var id = obj.defense;
    var div = document.getElementById("batiments-onglet4");
    
    var bat = div.getElementsByTagName('div')[id];
    
    
    var parcours = bat.getElementsByTagName('div');
    
    
    
    // On parcours les div enfant jusqu'à qu'on trouve celui qui correspond au bouton construire
    for(var i = 0; i < parcours.length ; i++)
    {
        
        var dtExpire = new Date();
        // On garde les cookies pendant un temps variable
        dtExpire.setTime(dtExpire.getTime() + parseInt(data[0].temps));
        setCookie('construction', 'true', dtExpire, '/' );
        localStorage.setItem('revenir',true);
        if(hasClass(parcours[i],"btn-on"))
        {
            // On met à jour le nombre
            var nombre = parseInt(obj.nombre)-1;
            if(nombre > 0)
            {
                obj.nombre = nombre;
                data[0] = obj;
                
            }
            else
            {
                // On efface l'élément 0
                data = unset(data,0);
                
                if(data != null && data.length >0)
                {
                    dtExpire.setTime(dtExpire.getTime() + parseInt(data[0].temps));
                    setCookie('construction', 'true', dtExpire, '/' );
                }
            }
            
            // On sauvegarde le data
            saveDataStorage('construction',data);
            // On clique sur le bouton
            parcours[i].click();
        }      
    }
    
}
// Prépare les constructions de défenses
function prepareConstruction(element)
{
    var divBat = element.getElementsByTagName('div');
    // On récupère le batiment sélectionné
    var choix = document.getElementById('batiment');
    id = choix.options[choix.selectedIndex].value;
    
    // On récupère le nombre de batiment à construire
    var nombre = document.getElementById('nombre').value;
    
    // On récupère le temps entre chaque construction
    var temps = 1000*parseInt(document.getElementById('minute').value)*60 + parseInt(document.getElementById('seconde').value)*1000;
    
    
    
    var obj = {
        defense : id,
        nombre : nombre,
        temps : temps,
        continent : getCurrentContinent()
    };
    
    addData("construction",obj);
    
    lancerConstruction();
}

function createBlocConstruction()
{
    var div = document.getElementById("batiments-onglet4");
    // On parcours la liste de tous les batiments pour récupérer ceux qu'on peut construire
    var divBat = div.getElementsByTagName('div');
    
    var titre = new Array();
    
    for(var i = 0; i < divBat.length ; i++)
    {
        // On regarde si le batiment est disponible
        
        if(hasClass(divBat[i],"batiments-left-available"))
        {
            // On sélectionne titre du batiment
            var titreTexte = divBat[i].getElementsByTagName('div')[3].getElementsByTagName('span')[0];
            
            console.log(divBat[i].getElementsByTagName('div')[0]);
            // On sélectionne l'image
            var image = divBat[i].getElementsByTagName('div')[0].getElementsByTagName('img')[0].src;
            
            titre[i] = {
                nom : titreTexte.innerHTML,
                image : image
            
            };
            
            
        }
    }
    console.log(titre);
    
    var divBloc = document.createElement("div");
    
    divBloc.className = "batiments-left-bloc-first batiments-left-available";
    
    var select = document.createElement("select");
    select.id = 'batiment';
    
    var option;
    
    for (var id in titre) {
        option = document.createElement("option");
        // On ajoute 1 car on va rajouter un bloc div
        option.value = parseInt(id)+1;
        option.innerText = titre[id].nom;
        select.appendChild(option);
    }
    
    divBloc.appendChild(select);
    
    var input = document.createElement("input");
    
    input.placeholder = "Combien?";
    input.id = "nombre";
    
    divBloc.appendChild(document.createElement("br"));
    divBloc.appendChild(document.createElement("br"));
    divBloc.appendChild(input);
    
    divBloc.appendChild(document.createElement("br"));
    divBloc.appendChild(document.createElement("br"));
    
    var span = document.createElement("span");
    span.innerText = "Temps entre chaque construction : ";
    divBloc.appendChild(span);
    
    divBloc.appendChild(document.createElement("br"));
    
    input = document.createElement("input");
    input.placeholder = "minutes";
    input.id="minute";
    divBloc.appendChild(input);
    
    divBloc.appendChild(document.createElement("br"));
    
    input = document.createElement("input");
    input.placeholder = "secondes";
    input.id="seconde";
    divBloc.appendChild(input);
    
    var button = document.createElement("button");
    
    button.innerText = "Construire";
    
    button.onclick = function (){
        prepareConstruction(div);
    }
    
    divBloc.appendChild(document.createElement("br"));
    divBloc.appendChild(document.createElement("br"));
    divBloc.appendChild(button);
    
    // On récupère le data
    var data = loadDataStorage("construction");
    if(data != null)
    {
        var span;
        
        // On récupère le bloc de droite
        var blocDroite = document.getElementById("batiments-right");
        
        // On récupère le bloc de pub pour insérer les autres blocs avant
        var blocPub = document.getElementById("pub-bloc");
        
        
        var divMain;
        var divContent;
        
        var divCancel;
        var sep;
         for (var id in data) {
            if(data[id].continent == getCurrentContinent())
            {
                divMain = document.createElement("div");
                divMain.className="action";
                divMain.style.cssText = "position:relative;";
                span = document.createElement("span");
                span.className = "texte16 yellow";
                span.innerText = "Construction en attente ("+getContinent(data[id].continent)+")";
                
                divMain.appendChild(span);
                 
                divContent = document.createElement("div");
                 
                divContent.className="action-content";
                 
                console.log(titre);
                console.log(data[id].defense-1);
                 
                 divContent.innerHTML = '<b>'+titre[data[id].defense-1].nom+'</b><div class="action-img"><img src="'+titre[data[id].defense-1].image+'"></div><div class="action-level">nombre : +'+data[id].nombre+'</div>';
                 
                divMain.appendChild(divContent);
                 
                divCancel = document.createElement("div");
                 
                divCancel.className = "action-cancel";
                 
                 divCancel.onclick = function(){
                     removeData(id);
                     window.location = "http://www.worldcontagion.com/contagion/batiments";
                 };
                 
                 
                 
                divCancel.innerHTML = '<img src="/images/contagion/cancel.png" title="2 minutes pour annuler l\'action" alt="">';
                 
                divMain.appendChild(divCancel);
                
                blocDroite.insertBefore(divMain,blocPub);
                 
                sep = document.createElement("div");
                sep.className="right-top-margin";
                blocDroite.insertBefore(sep,blocPub);
            }
        }
    }
    
    
    
    div.insertBefore(divBloc,divBat[0]);
    
}

function createBlocErreur(texte)
{
    //Bloc erreur
    var divErreur = document.createElement("div");
    
    divErreur.id = "erreur";
    
    divErreur.innerText = texte;
    
    //Ensuite on le positionne
    var parent = document.getElementById('views');
    
    var suivant = document.getElementById('armee-content');
    
    parent.insertBefore(divErreur, suivant); 
    
}



//On regarde si le joueur a été attaqué dans les dernières 24 heures
function isJoueurAttaque(nom)
{
    var cookieNom = getCookie(nom);
    return cookieNom != null;
    
}

// On sélectionne le joueur inactif a attaqué
function cliqueSelectionJoueur()
{
    var bloc = document.getElementById('armee-onglet5-info');
    
    // On récupère la table des joueurs
    var tableJoueur = bloc.getElementsByTagName('table')[3];
    
    //On récupère toute les lignes contenant des joueurs
    var lignes = tableJoueur.getElementsByTagName('tr');
    
    var trouve = false;
    
    var occurence = 0;
    
    for(var i = 0; i < lignes.length ; i++)
    {
        // On récupère la case contenant la dernière connexion
        var derniereConnexion = lignes[i].getElementsByTagName('td')[4].innerText;
        
        if(/Inactif/.test(derniereConnexion))
        {
            // On clique sur le lien attaquer
            var nomJoueur = lignes[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].innerText;
            
            
            if(!isJoueurAttaque(nomJoueur))
            {
                var liens = lignes[i].getElementsByTagName('td')[5].getElementsByTagName('a');
                for(var k=0;k<liens.length;k++)
                {
                    if(liens[k] != null && /Attaquer/.test(liens[k].getElementsByTagName('img')[0].getAttribute('title')))
                    {
                        liens[k].click();
                        localStorage.setItem('joueur',nomJoueur);
                        trouve = true;
                        break;
                    }
                }
                
                if(trouve)
                {
                    break;   
                }
                else if(occurence<5)
                {
                    occurence++;
                    
                }
                    else
                {
                    localStorage.removeItem('action');
                    localStorage.removeItem('multi');
                    trouve = true;
                    createBlocErreur("Le nombre de raid maximum est atteint ou vons n'avez plus d'unité");
                    break;
                }
            }
        }
    }
    //Si on ne trouve pas de joueur inactif non attaqué depuis 24H on appelle la page suivante
    if(!trouve)
    {
        // On récupère la table des liens
        var tableLiens = bloc.getElementsByTagName('table')[4];
        var tableLiens = bloc.getElementsByTagName('table')[4];
        var lienSuivant = tableLiens.getElementsByTagName('td')[1].getElementsByTagName('a');
        lienSuivant = lienSuivant[lienSuivant.length-1];
        if(lienSuivant != null && /page suivante/.test(lienSuivant.innerText))
        {
            lienSuivant.click();
        }
        else
        {
            localStorage.removeItem('action');
            localStorage.removeItem('multi');
            createBlocErreur("Il n'y a plus de joueur inactif à attaquer");
        }
    }
}

function cliqueAttaqueJoueur(multi)
{
    var inputT = document.getElementById('armee-form-401');
    var inputTL = document.getElementById('armee-form-402');
    if(!multi)
        localStorage.removeItem('action');
    nomJoueur = localStorage.getItem('joueur');
    var dtExpire = new Date();
    // On garde les cookies pendant une journée
    dtExpire.setTime(dtExpire.getTime() + 3600 * 1000 * 24);
    if(inputT != null)
    {
        inputT.value = 1;
        
        var form = document.getElementById('armee-attaquer').getElementsByTagName('form')[0];
        setCookie(nomJoueur, 'true', dtExpire, '/' );
        form.submit();
    }
    else if(inputTL != null)
    {
        inputTL.value = 1;
        
        var form = document.getElementById('armee-attaquer').getElementsByTagName('form')[0];
        setCookie(nomJoueur, 'true', dtExpire, '/' );
        form.submit();
    }
        else
    {
        createBlocErreur("Vous n'avez plus de transporteur");
        if(multi)
        {
            localStorage.removeItem('action');
            localStorage.removeItem('multi');
        }
    }
    
}

var adresseCourante = document.location.href;

createBlocScript();

if(/contagion\/communication/.test(adresseCourante))
{
    // Appel de la calculatrice
    createBlocCalculatrice();
}

// Gestion de la construction en chaine (pour le moment, seulement les batiments défensifs en bénéficient)
if(/contagion\/batiments/.test(adresseCourante))
{
    createBlocConstruction();
}

//On récupère la valeur action
var action = localStorage.getItem('action');

var multi; 
if(localStorage.getItem('multi') != null && localStorage.getItem('multi') == 'true')
    multi = true;
else
    multi = false;

if(action == 'attaqueInactif')
{
    
    if(/contagion\/armee\/attaquer/.test(adresseCourante))
    {
        cliqueAttaqueJoueur(multi);        
    }
    else if(/contagion\/armee/.test(adresseCourante))
    {
        cliqueSelectionJoueur();
    }
        
        }

var timer = setInterval(function(){
    // On récupère le data
    var data = loadDataStorage("construction");
    if(data != null && data.length >0)
    {
       
        var cookie = getCookie('construction');
        if(cookie == null)
        {
            if(/contagion\/batiments/.test(adresseCourante))
            {
                // On vérifie qu'on est bien sur le bon continent
                if(getCurrentContinent() != data[0].continent)
                    goContinent(data[0].continent);
                else
                    lancerConstruction();
                
            }
            else
            {
                localStorage.setItem('adresse',adresseCourante);
                window.location = "http://www.worldcontagion.com/contagion/batiments";
            }
        }
        else
        {
            if(localStorage.getItem('revenir') != null)
            {
                
                localStorage.removeItem('revenir');
                var adre = localStorage.getItem('adresse');
                localStorage.removeItem('adresse');
                if(adre != null)
                    window.location=adre;
            }
        }
    }
    
}, 2000);



