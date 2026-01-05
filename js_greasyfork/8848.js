// ==UserScript==
// @name        Lafay
// @namespace   Lafay
// @include     http://www.musculaction.com/forum/*
// @version     2.1.0
// @grant       none
// @description Script permettant de poster ses séances facilement
// @downloadURL https://update.greasyfork.org/scripts/8848/Lafay.user.js
// @updateURL https://update.greasyfork.org/scripts/8848/Lafay.meta.js
// ==/UserScript==

/* ------ Permet d'utiliser unsafeWindow sous Chrome ---------*/
var bGreasemonkeyServiceDefined = true;

if ( typeof unsafeWindow === "undefined"  ||  ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
}
/* ------ Permet d'utiliser unsafeWindow sous Chrome ---------*/

// Variables globales
var seances = [];
var bbcode = 0;
var nbEchauffement = 5;
var totaux = [];
var start = 0, end = 0;
var timer = false, timerDecompte = false;
var soixDix = false;
var hexDigits = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

unsafeWindow.decompteEnCours = false;
unsafeWindow.reposEnCours = false;

var seanceEnCours = 0;
var exerciceEnCours = 0;
var serieEnCours = 0;

var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

_init();

/**
* Initialise le script
**/
function _init()
{
    // On charge le css
    chargerCSS();
    
    var url;

    // Chargement des données si elles existent
    if(localStorage.seances)
    {
        seances = JSON.parse(localStorage.seances);
        console.log(seances);
        url = seances.topicUrl;

        if(seances.savelink.length && (self.location.href).match(/post[0-9]+\.html\#p[0-9]+/) !== null)
        {
            for(i = 0; i < seances.savelink.length; i++)
            {
                last = seances.seances[seances.savelink[i]].historique.length - 1;
                seances.seances[seances.savelink[i]].historique[last].lien = self.location.href;
            }
            seances.savelink = [];
            sauvegarder(seances);
        }
    }
    
    if(!url || url == "undefined")
    {
        // Dans le cas, où l'utilisateur lance le script pour la première fois, on lui demande l'url de son carnet
        var urlCarnet = prompt("Script pour vos séances lafay\nVeuillez entrer l'url de votre carnet :", "ex : http://www.musculaction.com/forum/stevens-pdm-23-ans-1m82-71-3kg-nv4-fullbody-p156-t124199.html");
        // On récupère l'id du topic depuis l'url
        if(/http:\/\/www\.musculaction\.com\/forum\/[a-zA-Z0-9_-]*t(opic)?([0-9]+)\.html/.test(urlCarnet))
        {
            var idTopic = RegExp.$2;

            // On récupère l'id du forum en demandant à l'utilisateur d'où provient son carnet
            var reForum = prompt("Avez-vous un carnet femme ou homme ? (répondre 'h' pour homme, 'f' pour femme)");
            var idForum = reForum == 'h' ? 29 : 33;

            seances = {'savelink':[], 'topicUrl' : 'http://www.musculaction.com/forum/posting.php?mode=reply&f='+idForum+'&t='+idTopic, 'seances' : []};
            sauvegarder(seances);

            url = 'http://www.musculaction.com/forum/posting.php?mode=reply&f='+idForum+'&t='+idTopic;
        
            var oldSeance = JSON.parse(localStorage.seance);            
            console.log(oldSeance);
            // Récupération des anciennes données
            if(oldSeance)
            {
                var nb = oldSeance.length;
                for(i = 0; i < nb; i++)
                {
                    console.log(oldSeance[i]);
                    if(oldSeance[i].valide == '1')
                    {
                        var tmp;
                        // S'il s'agit d'un bbcode perso
                        if(oldSeance[i].bbcode !== '')
                        {
                            tmp = {'general':{},'bbcode':oldSeance[i].bbcode,'historique':[]};
                            tmp.general = {
                                'titre' : oldSeance[i].nom,
                                'bbcode' : 1
                            };
                        }
                        else
                        {
                            tmp = {'general' : {}, 'echauffement' : [], 'exercices' : [], 'historique' : []};

                            // Configuration générale
                            tmp.general = {
                                'titre' : oldSeance[i].nom,
                                'nbSeances' : oldSeance[i].numero,
                                'nbEchauffement' : oldSeance[i].echauffement.length,
                                'nbExercices' : oldSeance[i].exercices.length,
                                'bbcode' : 0
                            };
                            
                            // Echauffement
                            for(j = 0; j < oldSeance[i].echauffement.length; j++)
                            {
                                value = oldSeance[i].echauffement[j];

                                // S'il y a moins d'exercice que prévu, on coupe net la boucle
                                if(value === '')
                                    break;

                                tmp.echauffement.push(value);
                            }

                            // Exercices
                            tmp.exercices = [];
                            for(j = 0; j < oldSeance[i].exercices.length; j++)
                            {
                                value = {
                                    'nom' : oldSeance[i].exercices[j].nom,
                                    'nombbcode' : oldSeance[i].exercices[j].nombbcode,
                                    'nbSeries' : parseInt(oldSeance[i].exercices[j].nb_series),
                                    'nbRep' : parseInt(oldSeance[i].exercices[j].valeur[0]),
                                    'max' : (parseInt(oldSeance[i].exercices[j].valeur[0]) * parseInt(oldSeance[i].exercices[j].nb_series)),
                                    'ris' : 0,
                                    'repos' : 0,
                                    'variante' : ''
                                };        

                                tmp.exercices.push(value);
                            }
                        }
                        console.log(tmp);
                        // On sauvegarde la séance type
                        seances.seances[i] = tmp;
                    }
                }
                if(seances.seances.length)
                {
                    console.log(seances);
                    sauvegarder(seances);
                    alert('Vos anciennes séances ont été importées. Il est cependant nécessaire de les modifier pour le bon fonctionnement de cette application.');
                }
                localStorage.removeItem("seance");                
            }
        }
        else
        {
            alert("L'url fournit est incorrect. Si après modification, il y a toujours un problème, veuillez me contacter sur le topic.");
            return;
        }
    }

    if(url == document.location.href)
    {
        chargerBoutonRepondre();
    }

    // Ferme dès qu'on appuie sur 'Echap'
    document.body.addEventListener('keyup', function (e) {
        if (e.keyCode == 27)
        {
            quitterApplication();
        }
        else if(e.keyCode == 38)
        {
            // Debut decompte
            if(!decompteEnCours)
            {              
                decompte();
            }
        }
        else if(e.keyCode == 40)
        {
            // Reset decompte
            if(decompteEnCours)
            {                         
                resetDecompte();
            }
        }
        else if(e.keyCode == 36)
        {
            // Debut chrono
            play();
        }
        else if(e.keyCode == 35)
        {
            // Fin chrono
            pause();
        }
    }, false);
}

/**
* Quitte l'application et réinitialise les valeurs par defaut
**/
function quitterApplication()
{
    document.body.removeChild(document.getElementById('boxSeance'));
    document.body.removeChild(document.getElementById('chrono'));
    document.body.removeChild(document.getElementById('decompte'));

    chargerToutesLesDiv();
    bbcode = 0;
    nbEchauffement = 5;
    soixDix = false;
    start = 0;
    end = 0;
    timer = false;
    timerDecompte = false;
    totaux = [];
}

/**
* Charge les divers règles CSS
**/
function chargerCSS()
{
    var css = "<style type='text/css'>\n";
    css += ".bouton{padding: 3px; text-align: center; height: 30px; cursor: pointer; border: none;}\n";
    css += ".bouton:hover{text-decoration: none;}\n";
    css += ".add{background: #6899ef; color: #dedede;}\n";
    css += ".add:hover{background: #4e83b2; color: #dedede;}\n";
    css += ".go{background: #61d13f; color: #dedede;}\n";
    css += ".go:hover{background: #419f24; color: #dedede;}\n";
    css += ".edit{background: #ccab0f; color: #dedede;}\n";
    css += ".edit:hover{background: #9c830a; color: #dedede;}\n";
    css += ".delete{background: #e14848; color: #dedede;}\n";
    css += ".delete:hover{background: #ae3131; color: #dedede;}\n";
    css += "#boxSeance .table{border-collapse: collapse; border-color: #1c1c1c}\n";
    css += "#boxSeance .table td{width: 100px; text-align: center;}\n";
    css += "#boxSeance .table td .bouton{width : 100px;}\n";
    css += "#boxSeance{position: absolute; z-index: 2000; padding: 10px; padding-top: 0; background: #dedede; color: #1c1c1c; border: 1px solid #1c1c1c; box-shadow: 0 0 1px #1c1c1c;}\n";
    css += "#boxSeance input[type=text]{height: 25px; border: none; width : 180px;}\n";
    css += "#boxSeance td{width: 200px;}\n";
    css += ".changerCouleur{cursor: pointer; margin-right: 2px; display: inline-block; width: 10px; height: 10px; border: 1px solid #1c1c1c;}\n";
    css += "#boxSeance input.serie{width: 33px; border: 1px solid #1c1c1c; color: black;}\n";
    css += "#boxSeance table.exercices td{width: 45px;}\n";
    css += "#boxSeance table{margin-top: 10px;}\n";
    css += "#boxSeance input.ressenti{width: 420px;}\n";
    css += "#decompte, #chrono, #exoEnCours{display: none; text-align: center; position: fixed; border: 1px solid #dedede; background: #1c1c1c; font-size: 30px; color: #dedede; top: 30px; right: 30px;}\n";
    css += "#exoEnCours{top: 270px; font-size: 20px; width: 150px}\n";
    css += "#decompte{top: 150px;}\n";
    css += "#decompte .button, #chrono .button{width: 70px; height: 25px; font-size: 15px; border: none; text-align: center;}\n";
    css += "#histo td{width : auto; text-align: center}\n";
    css += "#histo th{padding: 5px;}\n";
    css += "</style>";

    document.body.innerHTML += css;
}

/**
* Affiche le bouton "Gestion séance"
**/
function chargerBoutonRepondre()
{
    var title_input = document.getElementById('subject').parentNode;
    title_input.innerHTML += '<a title="Ajouter une séance" onclick="afficherListeSeance();" class="bouton add">Générer une séance</a>';

    chargerToutesLesDiv();
}

/**
* Ajoutes les div que l'on va utiliser
**/
function chargerToutesLesDiv()
{
    var html = '<div id="boxSeance" style="display:none">';
    html += '<div id="listeSeances"></div>';
    html += '<div id="etape1"></div>';
    html += '<div id="etape2"></div>';
    html += '<div id="etape3"></div>';
    html += '<div id="historique"></div>';
    html += '<div id="seance"></div>';
    html += '<div id="chrono"></div>';
    html += '<div id="decompte"></div>';
    html += '<div id="exoEnCours"></div>';
    html += '</div>';
    //html += '<embed src="http://www.soundjay.com/button/beep-07.wav" autostart="false" width="0" height="0" id="bip" enablejavascript="true">';
    document.body.innerHTML += html;    
}

/**
* Enregistre le tableau fournit en paramètre dans le locale localStorage
* @param Array tableau contenant toutes les données
**/
function sauvegarder(data)
{
    localStorage.seances = JSON.stringify(data);
}

/**
* Affiche la liste des séances déjà enregistrée
**/
unsafeWindow.afficherListeSeance = function()
{
    var html = '';
    html += '<h3>Liste des séances</h3>';
    if((nb = seances.seances.length))
    {
        html += "<table BORDER class='table'>";
        for(i = 0; i < nb; i++)
        {
            html += '<tr>';
            html += '<td>' + (seances.seances[i].general.titre) + '</td>';
            if(seances.seances[i].general.bbcode == 1)
            {
                html += '<td></td>';
                html += '<td><input class="bouton go" onClick="posterSeance('+i+');" value="Poster la séance" /></td>'; 
                html += '<td><input class="bouton edit" onClick="modifierSeance('+i+');" value="Modifier la séance" /></td>';
                html += '<td><input class="bouton delete" onClick="supprimerSeance('+i+');" value="Supprimer" /></td>';     
            }
            else
            {
                html += '<td><input class="bouton go" onClick="lancerSeance('+i+');" value="Lancer la séance" /></td>'; 
                html += '<td><input class="bouton edit" onClick="modifierSeance('+i+');" value="Modifier la séance" /></td>'; 
                html += '<td><input class="bouton add" onClick="historiqueSeance('+i+');" value="Historique" /></td>'; 
                html += '<td><input class="bouton delete" onClick="supprimerSeance('+i+');" value="Supprimer" /></td>'; 
            }
            html += '</tr>';
        }
        html += "</table>";
    }

    // Ajout du bouton pour créer des séances
    html += '<input class="bouton add" onClick="ajouterSeance();" value="Ajouter une séance" />';

    html += '</div></div>';

    document.getElementById('listeSeances').innerHTML = html;
    afficherDiv('liste');    
};

function afficherDiv(type)
{
    document.getElementById('boxSeance').style.display = '';
    document.getElementById('etape1').style.display = 'none';
    document.getElementById('etape2').style.display = 'none';
    document.getElementById('etape3').style.display = 'none';
    document.getElementById('listeSeances').style.display = 'none';
    document.getElementById('historique').style.display = 'none';
    document.getElementById('seance').style.display = 'none';
    switch(type)
    {
        case 'liste' :
            document.getElementById('listeSeances').style.display = '';
        break;
        case 'etape1' :
            document.getElementById('etape1').style.display = '';
        break;
        case 'etape2' :
            document.getElementById('etape2').style.display = '';
        break;
        case 'etape3' :
            document.getElementById('etape3').style.display = '';
        break;
        case 'historique':
            document.getElementById('historique').style.display = '';
        break;
        case 'seance':
            document.getElementById('seance').style.display = '';
        break;
    }
    centrerEl(document.getElementById('boxSeance'));
}

/**
* Affiche la boite de dialogue permettant de supprimer la séance demandée
**/
unsafeWindow.supprimerSeance = function(id)
{   
    if(confirm("Etes-vous sur de vouloir supprimer cette séance ?"))
    {
        seances.seances.splice(id, 1);
        sauvegarder(seances);
        quitterApplication();
    }
};

/**
* Affiche la boite de dialogue permettant de modifier la séance demandée
**/
unsafeWindow.modifierSeance = function(id)
{    
    document.getElementById('listeSeances').style.display = 'none';
    etape1(id);
};

/**
* Affiche la boite de dialogue permettant d'ajouter des séances facilement
**/
unsafeWindow.ajouterSeance = function()
{    
    document.getElementById('listeSeances').style.display = 'none';
    etape1(null);
};

/**
* Première étape d'une séance
**/
unsafeWindow.etape1 = function(id)
{
    if(document.getElementById('etape1').innerHTML === '')
    {
        var html = '';
        var value = '';
        var seance;

        // Ajout du titre
        if(id === null)
        {
            html += "<h3>Création d'une nouvelle séance type</h3>";
        }
        else
        {
            seance = seances.seances[id].general;
            html += "<h3>Modification de " + seance.titre + "</h3>";
        }

        // Ajout des inputs
        html += '<table>';
        html += '<tr><td><label for="titreSeance">Titre de la séance</label></td>';
        value = id === null ? '' : seance.titre;
        html += '<td><input type="text" id="titreSeance" value="'+value+'" /></td></tr>';
        html += '<tr><td><label for="numSeance">Numéro de la première séance générée par le script <i>(ex : séance n°12)</i></label></td>';
        value = id === null ? '' : seance.nbSeances;
        html += '<td><input type="text" id="numSeance" value="'+value+'" /></td></tr>';
        html += '<tr class="bbcodehide"><td><label for="nbExos">Nombre d\'exercices</label></td>';
        value = id === null ? '' : seance.nbExercices;
        html += '<td><input type="text" id="nbExos" value="'+value+'" /></td></tr>';        
        html += '<tr class="bbcodehide"><td><label for="nbEchauffement">Nombre d\'exercices d\'échauffement</label></td>';
        value = id === null ? '' : seance.nbEchauffement;
        html += '<td><input type="text" id="nbEchauffement" value="'+value+'" /></td></tr>';

        // Gestion du bbcode perso
        html += '<tr><td><label for="bbcodePerso">BBcode personnalisé</label></td>';
        html += '<td><input type="checkbox" id="bbcodePerso" onClick="bbcodePerso();" /></td></tr>';

        // Ajout du bouton pour changer d'étape
        html += '<tr><td>&nbsp;</td><td><input class="bouton add" onClick="etape2('+id+');" value="Etape suivante" /></td></tr>';
        html += '<table>';

        document.getElementById('etape1').innerHTML = html;
    }    
    afficherDiv('etape1');
};

/**
* Deuxième étape d'une séance
**/
unsafeWindow.etape2 = function(id)
{
    var value = '';
    var tmp_value = document.getElementById('nbEchauffement').value;
    if(document.getElementById('etape2').innerHTML === '' || (tmp_value === '' || tmp_value != nbEchauffement))
    {
        nbEchauffement = (tmp_value === '' ? nbEchauffement : tmp_value);

        var html = '';
        var seance;

        // Ajout du titre
        if(id === null)
        {
            html += "<h3>Création d'une nouvelle séance type"+(bbcode ? '' : '- Echauffement')+"</h3>";
        }
        else
        {
            seance = seances.seances[id];
            html += "<h3>Modification de " + seance.general.titre +(bbcode ? '' : '- Echauffement')+"</h3>";
        }

        // Ajout des inputs
        if(bbcode)
        {
            value = document.getElementById('bbcodeValue') ? document.getElementById('bbcodeValue').value : 'Veuillez entrer votre bbcode personnalisé.';
            html += '<textarea id="bbcodeValue">'+value+'</textarea>';
            html += '<tr><td><input class="bouton add" onClick="etape1('+id+');" value="Etape précédente" /></td><td><input class="bouton add" onClick="enregistrer('+id+');" value="Enregistrer la séance" /></td></tr>';
            html += '<table>';
        }
        else
        {
            html += '<table>';
            for(i = 0; i < nbEchauffement; i++)
            {
                value = document.getElementById('echauffement'+(i+1)) ? document.getElementById('echauffement'+(i+1)).value : '';
                value = value === '' && id !== null ? seance.echauffement[i] : '';
                html += '<tr><td><label for="echauffement'+(i+1)+'">Echauffement '+(i+1)+'</label></td>';
                html += '<td><input type="text" id="echauffement'+(i+1)+'" value="'+value+'" /></td></tr>';
            }
            
            // Ajout du bouton pour changer d'étape
            html += '<tr><td><input class="bouton add" onClick="etape1('+id+');" value="Etape précédente" /></td><td><input class="bouton add" onClick="etape3('+id+');" value="Etape suivante" /></td></tr>';
            html += '<table>';
        }
        document.getElementById('etape2').innerHTML = html;
    }
    
    afficherDiv('etape2');
};

/**
* Deuxième étape d'une séance
**/
unsafeWindow.etape3 = function(id)
{
    var value = '';
    var nbExercices = document.getElementById('nbExos').value;

    if(nbExercices === '')
    {
        alert("Veuillez préciser un nombre d'exercices.");
        etape1(id);
        return;
    }

    var html = '';
    var seance;

    // Ajout du titre
    if(id === null)
    {
        html += "<h3>Création d'une nouvelle séance type - Exercices</h3>";
    }
    else
    {
        seance = seances.seances[id];
        html += "<h3>Modification de " + seance.general.titre + '- Exercices</h3>';
    }

    // Ajout des inputs
    for(i = 0; i < nbExercices; i++)
    {
        html += '<table>';
        html += '<tr><td>Exercice '+(i+1)+'</td><td>&nbsp;</td></tr>';
        // Nom de l'exercice
        value = document.getElementById('exo'+(i+1)+'nom') ? document.getElementById('exo'+(i+1)+'nom').value : '';
        value = value === '' && id !== null ? seance.exercices[i].nom : '';
        html += '<tr><td><label for="exo'+(i+1)+'nom">Nom</label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'nom" value="'+value+'" /></td></tr>';
        // Nom à afficher sur le post
        value = document.getElementById('exo'+(i+1)+'nomBBcode') ? document.getElementById('exo'+(i+1)+'nomBBcode').value : '';
        value = value === '' && id !== null ? seance.exercices[i].nombbcode : '';
        html += '<tr><td><label for="exo'+(i+1)+'nomBBcode">Nom à afficher sur le post</label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'nomBBcode" value="'+value+'" /></td></tr>';
         // Variante ou delta de l'exercice
        value = document.getElementById('exo'+(i+1)+'variante') ? document.getElementById('exo'+(i+1)+'variante').value : '';
        value = value === '' && id !== null ? seance.exercices[i].variante : '';
        html += '<tr><td><label for="exo'+(i+1)+'variante">Variante ou delta <i>(laissez vide si besoin)</i></label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'variante" value="'+value+'" /></td></tr>';
        // Nombre de séries
        value = document.getElementById('exo'+(i+1)+'nbSeries') ? document.getElementById('exo'+(i+1)+'nbSeries').value : '';
        value = value === '' && id !== null ? seance.exercices[i].nbSeries : '';
        html += '<tr><td><label for="exo'+(i+1)+'nbSeries">Nombre de séries</label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'nbSeries" value="'+value+'" /></td></tr>';
        // Nombre de rep minimum
        value = document.getElementById('exo'+(i+1)+'nbRep') ? document.getElementById('exo'+(i+1)+'nbRep').value : '';
        value = value === '' && id !== null ? seance.exercices[i].nbRep : '';
        html += '<tr><td><label for="exo'+(i+1)+'nbRep">Mode minimum</label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'nbRep" value="'+value+'" /></td></tr>';
        // Nombre de rep maximum
        value = document.getElementById('exo'+(i+1)+'nbRepMax') ? document.getElementById('exo'+(i+1)+'nbRepMax').value : '';
        value = value === '' && id !== null ? seance.exercices[i].max : '';
        html += '<tr><td><label for="exo'+(i+1)+'nbRepMax">Maximum de répétitions atteintes</label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'nbRepMax" value="'+value+'" /></td></tr>';
        // Repos intersérie
        value = document.getElementById('exo'+(i+1)+'ris') ? document.getElementById('exo'+(i+1)+'ris').value : '';
        value = value === '' && id !== null ? seance.exercices[i].ris : '';
        html += '<tr><td><label for="exo'+(i+1)+'ris">Repos intersérie <i>(en secondes)</i></label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'ris" value="'+value+'" /></td></tr>';
        // Repos à la fin de l'exercice
        value = document.getElementById('exo'+(i+1)+'repos') ? document.getElementById('exo'+(i+1)+'repos').value : '';
        value = value === '' && id !== null ? seance.exercices[i].repos : '';
        html += '<tr><td><label for="exo'+(i+1)+'repos">Repos à la fin de l\'exercice <i>(en secondes)</i></label></td>';
        html += '<td><input type="text" id="exo'+(i+1)+'repos" value="'+value+'" /></td></tr>';        
        
        html += '</table>';
    }
    
    // Ajout du bouton pour changer d'étape
    html += '<table><tr><td><input class="bouton add" onClick="etape2('+id+');" value="Etape précédente" /></td><td><input class="bouton add" onClick="enregistrer('+id+');" value="Enregistrer la séance" /></td></tr></table>';

    document.getElementById('etape3').innerHTML = html;
    
    afficherDiv('etape3');
};

unsafeWindow.enregistrer = function(id)
{
    var tmp;
    // S'il s'agit d'un bbcode perso
    if(bbcode)
    {
        tmp = {'general':{},'bbcode':document.getElementById('bbcodeValue').value,'historique':[]};
        tmp.general = {
            'titre' : document.getElementById('titreSeance').value,
            'bbcode' : 1
        };
    }
    else
    {
        tmp = {'general' : {}, 'echauffement' : [], 'exercices' : [], 'historique' : []};
        var nbExercices = document.getElementById('nbExos').value;

        // Configuration générale
        tmp.general = {
            'titre' : document.getElementById('titreSeance').value,
            'nbSeances' : document.getElementById('numSeance').value,
            'nbEchauffement' : nbEchauffement,
            'nbExercices' : nbExercices,
            'bbcode' : 0
        };
        
        // Echauffement
        for(i = 0; i < nbEchauffement; i++)
        {
            value = document.getElementById('echauffement'+(i+1)).value;

            // S'il y a moins d'exercice que prévu, on coupe net la boucle
            if(value === '')
                break;

            tmp.echauffement.push(value);
        }

        // Exercices
        tmp.exercices = [];
        for(i = 0; i < nbExercices; i++)
        {
            // S'il y a moins d'exercice que prévu, on coupe net la boucle
            if(document.getElementById('exo'+(i+1)+'nom').value === '')
                break;

            value = {
                'nom' : document.getElementById('exo'+(i+1)+'nom').value,
                'nombbcode' : document.getElementById('exo'+(i+1)+'nomBBcode').value,
                'nbSeries' : parseInt(document.getElementById('exo'+(i+1)+'nbSeries').value),
                'nbRep' : parseInt(document.getElementById('exo'+(i+1)+'nbRep').value),
                'max' : parseInt(document.getElementById('exo'+(i+1)+'nbRepMax').value),
                'ris' : parseInt(document.getElementById('exo'+(i+1)+'ris').value),
                'repos' : parseInt(document.getElementById('exo'+(i+1)+'repos').value),
                'variante' : document.getElementById('exo'+(i+1)+'variante').value
            };        

            tmp.exercices.push(value);
        }
    }
    // On sauvegarde la séance type
    if(id === null)
        id = seances.seances.length;

    seances.seances[id] = tmp;
    sauvegarder(seances);

    quitterApplication();
    alert("Votre séance type a bien été "+(id == seances.seances.length ? 'ajoutée.' : 'modifiée.'));
};

/**
* Définit si la séance aura un bbcode perso ou non
**/
unsafeWindow.bbcodePerso = function()
{
    // On cache ou affiche ce qui doit l'etre
    var bbcodeHideDiv = document.getElementsByClassName('bbcodehide');
    var nb = bbcodeHideDiv.length;
    for(i = 0; i < nb; i++)
    {
        bbcodeHideDiv[i].style.display = (bbcode ? '' : 'none');
    }
    
    bbcode = bbcode ? 0 : 1;
};

/**
* Affiche l'historique d'une séance
**/
unsafeWindow.historiqueSeance = function(id)
{
    var historique = seances.seances[id].historique;
    var html = '<h3>Historique de la séance : '+seances.seances[id].general.titre+'</h3>';
    if(!historique.length)
    {
        html += '<p>Vous n\'avez pas encore effectué de séance.</p>';
    }
    else
    {
        var d, j, m , a;
        var moyenneTxt, totalRep, totalSerie;
        html += '<table id="histo">';
        html += '<tr>';
        html += '<th>Date</th><th>Lien</th><th>Séance n°</th><th>Gain total de répétitions</th><th>Durée de la séance</th><th>&nbsp;</th><th>&nbsp;</th>';
        html += '</tr>';
        for(i = 0; i < historique.length; i++)
        {
            totalRep = 0;
            totalSerie = 0;

            html += '<tr>';
            // date
            d = new Date(historique[i].date);
            j = d.getDate();
            m = d.getMonth()+1;
            a = d.getFullYear();

            j = j < 10 ? '0'+j : j;
            m = m < 10 ? '0'+m : m;

            html += '<td>'+j+'/'+m+'/'+a+'</td>';
            // Lien de la séance
            html += '<td>'+(historique[i].lien ? '<a href="'+historique[i].lien+'">Lien</a>' : 'Séance non postée.')+'</td>';
            // n° de séance
            html += '<td>N°'+(i + parseInt(seances.seances[id].general.nbSeances))+'</td>';
            // gain moyen
            for(k = 0; k < seances.seances[id].general.nbExercices; k++)
            {
                for(l = 0; l < seances.seances[id].exercices[k].nbSeries; l++)
                {
                    if(i == 0)
                        totalRep += (historique[i].exercices[k][l] - seances.seances[id].exercices[k].nbRep);
                    else
                        totalRep += (historique[i].exercices[k][l] - historique[(i-1)].exercices[k][l]);
                }
            }
            moyenneTxt = (totalRep >= 0 ? '<span style="color:#61d13f">+': '<span style="color:#e14848">');
            moyenneTxt += totalRep+'</span>';
            html += '<td>'+moyenneTxt+'</td>';
            // durée de la séance
            html += '<td>'+historique[i].duree+'</td>';
            // details
            html += '<td><input class="bouton add" onclick="detailsHistorique('+id+', '+i+');" value="Détails" /></td>';
            // supprimer seance
            html += '<td><input class="bouton delete" onclick="supprimerHistorique('+id+', '+i+');" value="Supprimer séance" /></td>';
            html += '</tr>';
        }
        html += '</table>';
    }

    document.getElementById('historique').innerHTML = html;
    afficherDiv('historique');
};

/**
* Permet de voir la séance en détail
* @param int id l'id de la séance
* @param int i l'id de l'exercice
**/
unsafeWindow.detailsHistorique = function(id, i)
{
    var historique = seances.seances[id].historique[i];
    var numSeance = parseInt(seances.seances[id].general.nbSeances) + i;
    var html = '<h3>Historique de la séance : '+seances.seances[id].general.titre+' n°'+numSeance+'</h3>';
    var variante, total, totalPrec, mode;

    html += (historique.lien ? '<a href="'+historique.lien+'">Lien vers la séance</a>' : 'Séance non postée.')+'<br />';

    // On parcourt les exercices
    for(k = 0; k < seances.seances[id].general.nbExercices; k++)
    {
        // On affiche le nom avec la variante
        variante = seances.seances[id].exercices[k].variante === '' ? '' : ' <i>('+seances.seances[id].exercices[k].variante+')</i>';
        html += '<u>'+seances.seances[id].exercices[k].nom+variante+'</u> :';

        total = 0; totalPrec = 0;
        // Affichage des séries
        for(l = 0; l < seances.seances[id].exercices[k].nbSeries; l++)
        {
            html += ' ' + historique.exercices[k][l];
            total += historique.exercices[k][l];
            totalPrec += (i == 0 ? seances.seances[id].exercices[k].nbRep : seances.seances[id].historique[(i-1)].exercices[k][l]);
        }
        // Affichage du total
        if(i != 0)
        {
            if(total - totalPrec > 0)
            {
                html += ' <span style="color:#61d13f">(+'+(total - totalPrec)+')</span>';
            }
            else if(total - totalPrec < 0)
            {
                html += ' <span style="color:#e14848">('+(total - totalPrec)+')</span>';
            }
            else
            {
                html += ' <span style="color:#6899ef">(=)</span>';
            }
        }
        // Affichage du max
        mode = (seances.seances[id].exercices[k].max / seances.seances[id].exercices[k].nbSeries);
        mode = (mode | 0) == mode ? mode : mode.toFixed(2);
        html += ' <span style="color: #FF0080;">Total : '+total+'</span> | <span style="color: #a1552b;">MAX : '+seances.seances[id].exercices[k].max+' (mode '+mode+')</span>';
        
        // Affichage des éventuelles TAS utilisées
        tas = '';
        if(historique.tas[k].ASC){
            tas += ' ASC ';  
        }
        if(historique.tas[k].MB){
            tas += ' MB ';  
        }
        if(historique.tas[k].DB){
            tas += ' DB ';       
        }
        if(historique.tas[k].ODT){
            tas += ' ODT ';
        }
        if(historique.tas[k].DM){
            tas += ' Demi-mode ';   
        }
        if(historique.tas[k].TM){
            tas += ' Tiers-mode ';   
        }
        if(historique.tas[k].P){
            tas += ' Punisher ';      
        }

        if(tas != ''){
            html += '<br /><b>TAS utilisées</b> : '+tas;
        }
        // Affichage du ressenti
        if(historique['ressenti'][k] !== '')
        {
            html += '<br /><b>Ressenti</b> : '+historique.ressenti[k];
        }

        html += '<br /><br />';
    }

    document.getElementById('historique').innerHTML = html;
    afficherDiv('historique');
};

/**
* Permet de supprimer une séance d'un historique
* @param int id l'id de la séance
* @param int i l'id de l'exercice
**/
unsafeWindow.supprimerHistorique = function(id, i)
{
    if(confirm("Etes-vous sur de vouloir supprimer cette séance ?"))
    {
        seances.seances[id].historique.splice(i, 1);
        sauvegarder(seances);
        quitterApplication();
        historiqueSeance(id);
    }
};

/**
* Affiche la séance type, permettant ainsi d'indiquer notre ressenti, notre performance
**/
unsafeWindow.lancerSeance = function(id)
{   
    seanceEnCours = id;
    var exercices = seances.seances[id].exercices;
    var echauffement = seances.seances[id].echauffement;    
    var historique = seances.seances[id].historique;
    var numSeance = parseInt(seances.seances[id].general.nbSeances) + historique.length;
    var html = '<h3>'+seances.seances[id].general.titre+' n°'+numSeance+'</h3>';
    var value = '';
    var total, total_prec, mode;

    // On affiche les exercices d'échauffements
    if(seances.seances[id].general.nbEchauffement)
    {
        html += '<u>Echauffement</u><br />';
        for(i = 0; i < seances.seances[id].general.nbEchauffement; i++)
        {
            html += ' - '+echauffement[i]+ '<br />';
        }
    }

    html += '<br />';

    // On affiche les exercices eux meme
    for(i = 0; i < seances.seances[id].general.nbExercices; i++)
    {
        total = 0;
        totaux[i] = 0;

        html += '<div class="exercice">';
        html += '<b>'+exercices[i].nom+'</b> ';
        html += '<i><abbr title="Repos Inter-Série">RIS</abbr> : '+exercices[i].ris+'s; Suivi de : '+exercices[i].repos+'s</i>';
        mode = (exercices[i].max / exercices[i].nbSeries);
        mode = (mode | 0) == mode ? mode : mode.toFixed(2);
        html += ' <span style="color: #a1552b;">MAX : '+exercices[i].max+' (mode '+mode+')</span>';

        // Variante ou delta
        value = exercices[i].variante == '' ? 'Variante/delta/poids' : exercices[i].variante;
        html += '<br /><input type="text" id="variante_'+i+'" value="'+value+'" onBlur="if(this.value == \'\') this.value = \'Variante/delta/poids\';" onClick="if(this.value == \'Variante/delta/poids\') this.value = \'\';" /><br />';
        
        html += '<table class="exercices">';
        // On parcourt les séries
        html += '<tr>';
        for(j = 0; j < exercices[i].nbSeries; j++)
        {
            value = historique.length ? historique[(historique.length - 1)].exercices[i][j] + 1 : exercices[i].nbRep;
            // Gestion des TAS
            if(historique.length && (parseInt(historique[(historique.length - 1)].tas[i].ODT) == 1 || parseInt(historique[(historique.length - 1)].tas[i].DM) == 1 || parseInt(historique[(historique.length - 1)].tas[i].TM) == 1))
            {
                --value;
                totaux[i] += value;
            }
            else
            {
                totaux[i] += historique.length ? value - 1: value;
            }

            total += value;
            html += '<td><input type="text" style="background: #61d13f;" class="serie serie_'+i+'" id="serie_'+i+'_'+j+'" value="'+value+'" onblur="this.style.border=\'1px solid #1c1c1c\';" onfocus="this.style.border = \'1px solid red\';" onkeyup="if(this.value != \'\') modifierTotal('+i+');" /></td>';     
        }
        html += '<td id="total_'+i+'">Total : '+(total)+' <i style="color:#00AA00;">(+'+(total - totaux[i])+')</i></td>';
        html += '</tr>';
        // On ajoute les selecteurs de difficultés
        html += '<tr>';
        for(j = 0; j < exercices[i].nbSeries; j++)
        {
            html += '<td>'+difficulte(i, j)+'</td>';
        }
        html += '<td>&nbsp;</td>';
        html += '</tr>';
        html += '</table>';
        // On ajoute les ressentis
        html += '<input type="text" id="ressenti_'+i+'" class="ressenti" value="Ressenti" onBlur="if(this.value == \'\') this.value = \'Ressenti\';" onClick="if(this.value == \'Ressenti\') this.value = \'\';" /><br />';
        // On ajoute les différentes TAS
        html += '<br /><label title="Mini-Boucle">MB <input type="checkbox" '+(historique.length && parseInt(historique[(historique.length - 1)].tas[i].MB) == 1 ? 'CHECKED' : '')+' id="MB_'+i+'"></label>';
        html += ' <label>Ascension <input type="checkbox" '+(historique.length && parseInt(historique[(historique.length - 1)].tas[i].ASC) == 1 ? 'CHECKED' : '')+' id="ASC_'+i+'"></label>';
        html += ' <label title="Occupation de terrain">ODT <input type="checkbox" '+(historique.length && parseInt(historique[(historique.length - 1)].tas[i].ODT) == 1 ? 'CHECKED' : '')+' id="ODT_'+i+'"></label>';
        html += ' <label title="Double-Boucle">DB <input type="checkbox" '+(historique.length && parseInt(historique[(historique.length - 1)].tas[i].DB) == 1 ? 'CHECKED' : '')+' id="DB_'+i+'"></label>';
        html += ' <label>Punisher <input type="checkbox" '+(historique.length && parseInt(historique[(historique.length - 1)].tas[i].P) == 1 ? 'CHECKED' : '')+' id="P_'+i+'"></label>';
        html += ' <label title="Demi-mode">Demi-mode <input type="checkbox" '+(historique.length && parseInt(historique[(historique.length - 1)].tas[i].DM) == 1 ? 'CHECKED' : '')+' id="DM_'+i+'"></label>';
        html += ' <label title="Tiers-mode">Tiers-mode <input type="checkbox" '+(historique.length && parseInt(historique[(historique.length - 1)].tas[i].TM) == 1 ? 'CHECKED' : '')+' id="TM_'+i+'"></label><br /><br />';
        html += '</div>';
    }

    // Lien youtube pour ajouter des musiques
    html += '<div id="youtube">';
    html += '<input type="text" id="youtube_0" class="youtube" value="Lien youtube" onBlur="if(this.value == \'\') this.value = \'Lien youtube\';" onClick="if(this.value == \'Lien youtube\') this.value = \'\';" /><br />';   
    html += '</div>';
    html += '<input class="bouton add" onClick="addYoutube();" value="Ajouter un lien" />';

    // Bouton 70%
    html += '<input class="bouton go" onClick="soixanteDix('+id+');" value="70%" />';

    // Bouton poster la séance
    html += '<input class="bouton add" onClick="posterSeance('+id+');" value="Poster la séance" />';

    document.getElementById('seance').innerHTML = html;
    afficherDiv('seance');

    // On affiche le chrono
    lancerChrono(id);

};

/**
* Génère le bbcode associé à la séance
* @param int id de la séance
**/
unsafeWindow.posterSeance = function(id)
{
    // On stop le chrono
    pause();

    var seance = seances.seances[id];
    var historyI = seances.seances[id].historique;
    var history = historyI.length == 0 ? null : historyI[historyI.length - 1];

    if(seance.general.bbcode == 1)
    {
        var bbcode = seance.bbcode;       
    }
    else
    {
        var ressenti = '';

        // Date de la séance
        var d = new Date();
        var date = d.getTime();

        // Durée de la séance
        var time = end - start;
        if(time != 0)
        {
            var H = time >= 3600 ? Math.floor(time / 3600) : 0;
            var M = time >= 60 ? Math.floor(time / 60) % 60 : 0;
            var S = time % 60;
            M = M < 10 ? '0' + M : M;
            S = S < 10 ? '0' + S : S;
            duree = H+'h'+M+':'+S;  
        }
        else
            duree = '0h00:00';

        var tmp = {'exercices':[],'date':date,'tas':[],'lien':'','ressenti':[],'duree':duree};

        // Numero de seance
        var numSeance = parseInt(seance.general.nbSeances) + historyI.length;

        // Titre
        var bbcode = '[size=200][b][color=#e14848]'+seance.general.titre+(soixDix ? ' 70%' : '')+' n°'+numSeance+'[/color][/b][/size]'+"\n";
        // Echauffement
        if(seance.general.nbEchauffement != 0)
        {
            bbcode += "\n[b]Echauffement[/b]\n";
            for(i = 0; i < seance.general.nbEchauffement; i++)
            {
                bbcode += " - [i]"+seance.echauffement[i]+"[/i]\n";
            }
        }

        // Exercices
        bbcode += "\n[b]Exercices[/b]\n";
        var couleur, serie, valeur, total, texte, tas, ress;
        // Parcourt des exercices
        for(i = 0; i < seance.general.nbExercices; i++)
        {
            // initialisation des TAS
            tmp['tas'][i] = {'DB':0,'MB':0,'ODT':0,'TM':0,'DM':0,'P':0,'ASC':0};

            // Nom de l'exercice
            bbcode += "[color=#0080FF][u]"+seance.exercices[i].nombbcode;
            // Variante/delta
            if(document.getElementById('variante_'+i).value != 'Variante/delta/poids' && document.getElementById('variante_'+i).value != '')
            {
                bbcode += ' [i]('+document.getElementById('variante_'+i).value+')[/i]';
                seances.seances[id].exercices[i].variante = document.getElementById('variante_'+i).value;
            }
            
            bbcode += '[/u][/color]: ';

            total = 0;
            diff = 0;

            tmp.exercices[i] = [];

            for(j = 0; j < seance.exercices[i].nbSeries; j++)
            {
                couleur = '';
                serie = document.getElementById('serie_'+i+'_'+j);
                valeur = parseInt(serie.value);

                tmp.exercices[i][j] = valeur;

                diff += (valeur - (history == null ? seance.exercices[i].nbRep : history.exercices[i][j]));

                total += valeur;

                if(rgb2hex(serie.style.backgroundColor) == couleur){
                    bbcode += ' '+valeur;
                }else{
                    couleur = rgb2hex(serie.style.backgroundColor);
                    if(j == 0)
                        bbcode += '[color=' + couleur + ']' + valeur;
                    else
                        bbcode += '[/color] [color=' + couleur + ']' + valeur;
                }
            }
            bbcode += '[/color]';
            // Affichage des TAS
            tas = '';
            if(document.getElementById('ASC_'+ i).checked){
                tas += ' ASC ';  
                tmp.tas[i].ASC = 1;
            }
            if(document.getElementById('MB_'+ i).checked){
                tas += ' MB ';  
                tmp.tas[i].MB = 1;
            }
            if(document.getElementById('DB_'+ i).checked){
                tas += ' DB ';       
                tmp.tas[i].DB = 1;
            }
            if(document.getElementById('ODT_'+ i).checked){
                tas += ' ODT ';
                tmp.tas[i].ODT = 1;
            }
            if(document.getElementById('DM_'+ i).checked){
                tas += ' Demi-mode ';   
                tmp.tas[i].DM = 1;
            }
            if(document.getElementById('TM_'+ i).checked){
                tas += ' Tiers-mode ';   
                tmp.tas[i].TM = 1;
            }
            if(document.getElementById('P_'+ i).checked){
                tas += ' Punisher ';                
                tmp.tas[i].P = 1;
            }

            if(tas != ''){
                bbcode += ' [i]('+tas+')';
            }
            else
                bbcode += ' [i]';

            // Affichage de la progression
            if(diff > 0)
            {
                couleur = '61d13f';
                texte = '+'+diff ;
            }
            else if(diff < 0){                
                couleur = 'e14848';
                texte = diff ;
            }
            else if(diff == 0 && historyI.length)
            {
                couleur = '0080FF';
                texte = '=';
            }  
            if(historyI.length)
                bbcode += ' [b][color=#' + couleur + '](' + texte + ')[/color][/b]';

            // Total et max
            if(total > seance.exercices[i].max)
                seances.seances[id].exercices[i].max = total;

            bbcode += ' [color=#FF0080](Total : '+total+'[/color] | [color=#a1552b]MAX : '+seance.exercices[i].max+')[/color][/i]';

            // Saut de ligne (fin de l'exercice)
            bbcode += "\n";

            // On récupère le ressenti
            ress = document.getElementById('ressenti_'+i).value;
            if(ress != '' && ress != 'Ressenti')
            {
                tmp.ressenti[i] = ress;
                ressenti += '\n - [i][color=#0080FF]'+ seance.exercices[i].nombbcode +'[/i][/color] : ' + ress; 
            }
            else
                tmp.ressenti[i] = '';
        }

        // Ajout de la musique
        var liens_youtube = document.getElementById('youtube').getElementsByTagName('input');
        var nb = liens_youtube.length;
        var youtubeL = '';
        for(i = 0; i < nb; i++)
        {
            if(liens_youtube[i].value != '' && liens_youtube[i].value != 'Lien youtube')
                youtubeL += "\n"+'[youtube]'+id_youtube(liens_youtube[i].value)+'[/youtube]';
        }
        if(youtubeL != '')
            bbcode += "\n[b]Musique écoutée[/b]"+youtubeL;

        // Ajouts des ressentis
        if(ressenti != ''){
            bbcode += '\n' + '[b]Ressenti[/b]';
            bbcode += ressenti;
        }

        // Ajout de la durée de la séance
        if(time != 0)
            bbcode += "\n\n"+'[u]Durée totale de la séance[/u] : '+duree;
    }
    if(historyI.length != 0)
        bbcode += "\n\n[url="+history.lien+"]Lien vers la dernière séance[/url]";

    // Insertion du bbcode dans la zone de saisie
    document.getElementById('message').innerHTML += bbcode;

    // On demande au navigateur d'enregistrer la prochaine page
    seances.savelink.push(id);

    // On enregistre la séance dans l'historique
    seances.seances[id].historique[historyI.length] = tmp;    
    sauvegarder(seances);
    quitterApplication();
};

/**
* Lancer le chrono
**/
unsafeWindow.lancerChrono = function(id)
{
    var d = new Date();
    start = Math.floor(d.getTime() / 1000);
    end  = start;

    var html = '<span id="heure">0</span>h<span id="minute">00</span>:<span id="seconde">00</span><br />';    
    html += '<input class="button edit" onClick="reset();" value="Reset" />';
    html += '<span id="pause"><input class="button go" onClick="play();" value="Play" /></span>';   
    document.getElementById('chrono').innerHTML = html;    
    document.getElementById('chrono').style.display = "block";

    // On gère le futur décompte
    var nbSecondes = parseInt(seances.seances[id].exercices[0].ris) % 60;
    var nbMinutes = Math.floor(parseInt(seances.seances[id].exercices[0].ris) / 60);
    nbMinutes = (nbMinutes < 10 ? '0' + nbMinutes : nbMinutes);
    nbSecondes = (nbSecondes < 10 ? '0' + nbSecondes : nbSecondes);
    
    html = '<span id="heureD">0</span>h<span id="minuteD">'+nbMinutes+'</span>:<span id="secondeD">'+nbSecondes+'</span><br />';
    html += '<div id="inputDecompte"><input id="decompteC" class="button go" onClick="if(!decompteEnCours) decompte();" value="Decompte" />';
    html += '<input class="button delete" onClick="suivantDecompte();" value="Suivant" /></div>';
    document.getElementById('decompte').innerHTML = html;
    document.getElementById('decompte').style.display = "block";

    // On ajoute l'exercice en cours
    html = '<span><u>En cours</u> :</span><br />';
    html += '<span id="exoAFaire">'+seances.seances[id].exercices[0].nom+'</span><br />';
    html += '<span id="serieAFaire">Série 1, '+document.getElementById("serie_" + exerciceEnCours + "_" + serieEnCours).value+' reps</span>';
    document.getElementById('exoEnCours').innerHTML = html;
    document.getElementById('exoEnCours').style.display = "block";


    // On donne le focus à la case courante
    donnerFocus(0,0);
};

/**
* Donne le focus à la case demandée
* @param int i l'id de l'exercice
* @param int j l'id de la série
**/
function donnerFocus(i, j)
{
    var series = document.getElementsByClassName('series');
    var nb = series.length;
    for(k = 0; k < nb; k++)
    {
        series[i].style.border = '1px solid #1c1c1c';
    }
    var el = document.getElementById('serie_'+i+'_'+j);
    if(el != null)
    {
        el.focus();
        el.style.border = '1px solid red';
    }
}

/**
* Lance le décompte
* @param int id l'id de la séance
* @param int i l'id de l'exercice
* @param int j l'id de la série
**/
unsafeWindow.decompte = function()
{
    if(exerciceEnCours == seances.seances[seanceEnCours].general.nbExercices)
        return;


    var seconde = document.getElementById('secondeD');
    var minute = document.getElementById('minuteD');
    var nbMinutes = parseInt(minute.innerHTML);
    var nbSecondes = parseInt(seconde.innerHTML);

    if(60*nbMinutes + nbSecondes == parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) || 60*nbMinutes + nbSecondes == parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].repos)){
        donnerFocus(exerciceEnCours, serieEnCours);
        document.getElementById("inputDecompte").innerHTML = '<input class="button edit" onClick="if(decompteEnCours) reset();" value="Reset" /><input class="button delete" onClick="suivantDecompte();" value="Suivant" />';
    }

    --nbSecondes;

    // On joue le bip sonore
    if(nbSecondes < 5 && nbSecondes >= 0 && nbMinutes == 0)
    {
        lancerSon();        

        if(nbSecondes == 0)
        {
            timerDecompte = setTimeout(function()
            {
                lancerSon();  
            }, 200);
        }
    }

    if(!decompteEnCours && parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) == 0)
    {
        serieEnCours = 0;
        nbSecondes = parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].repos) % 60;
        nbMinutes = Math.floor(parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].repos) / 60);

        reposEnCours = true;
    }

    decompteEnCours = true;

    if(nbSecondes == -1)
    {
        nbSecondes = 59;
        if(nbMinutes != 0)
            --nbMinutes;
        else
        {
            decompteEnCours = false;

            // Fin du décompte
            if(serieEnCours == parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].nbSeries) - 2)
            {
                nbSecondes = parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].repos) % 60;
                nbMinutes = Math.floor(parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].repos) / 60);                
                ++serieEnCours;
            }
            else if(serieEnCours == parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].nbSeries) - 1)
            {                
                serieEnCours = 0;
                ++exerciceEnCours;
                nbSecondes = parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) % 60;
                nbMinutes = Math.floor(parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) / 60);

                reposEnCours = true;
            }
            else
            {
                clearTimeout(timerDecompte);
                ++serieEnCours;
                nbSecondes = parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) % 60;
                nbMinutes = Math.floor(parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) / 60);
            }            

            // Fin de séance
            if(exerciceEnCours == seances.seances[seanceEnCours].general.nbExercices)
            {
                nbMinutes = '0';
                nbSecondes = '0';
            }
            document.getElementById("inputDecompte").innerHTML = '<input id="decompteC" class="button go" onClick="if(!decompteEnCours) decompte();" value="Decompte" /><input class="button delete" onClick="suivantDecompte();" value="Suivant" />';
            
            // On MAJ l'exercice en cours
            document.getElementById('exoAFaire').innerHTML = seances.seances[seanceEnCours].exercices[exerciceEnCours].nom;
            document.getElementById('serieAFaire').innerHTML = "Série " + (serieEnCours + 1) + ", " + document.getElementById("serie_" + exerciceEnCours + "_" + serieEnCours).value + " reps";
        }
    }
    nbMinutes = (nbMinutes < 10 ? '0' + nbMinutes : nbMinutes);
    nbSecondes = (nbSecondes < 10 ? '0' + nbSecondes : nbSecondes);

    minute.innerHTML = nbMinutes;
    seconde.innerHTML = nbSecondes;

    if(decompteEnCours)
    {
         timerDecompte = setTimeout(function()
        {
            decompte();
        }, 1000);
    }   
}

/**
* Lance le bip sonore
**/
function lancerSon()
{
    snd.load();
    snd.play();
}

/**
* Réinitialise le décompte
* @param int id l'id de la séance
* @param int i l'id de l'exercice
**/
unsafeWindow.resetDecompte = function()
{
    decompteEnCours = false;

    document.getElementById("inputDecompte").innerHTML = '<input id="decompteC" class="button go" onClick="if(!decompteEnCours) decompte();" value="Decompte" /><input class="button delete" onClick="suivantDecompte();" value="Suivant" />';

    // On MAJ l'exercice en cours
    document.getElementById('exoAFaire').innerHTML = seances.seances[seanceEnCours].exercices[exerciceEnCours].nom;
    document.getElementById('serieAFaire').innerHTML = "Série " + serieEnCours + ", " + document.getElementById("serie_" + exerciceEnCours + "_" + serieEnCours).value + " reps";

    var seconde = document.getElementById('secondeD');
    var minute = document.getElementById('minuteD');
    var nbSecondes = parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) % 60;
    var nbMinutes = Math.floor(parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) / 60);
    nbMinutes = (nbMinutes < 10 ? '0' + nbMinutes : nbMinutes);
    nbSecondes = (nbSecondes < 10 ? '0' + nbSecondes : nbSecondes);

    minute.innerHTML = nbMinutes;
    seconde.innerHTML = nbSecondes;

    clearTimeout(timerDecompte);

    // On donne le focus à la case courante
    donnerFocus(exerciceEnCours, serieEnCours);
};

/**
* Change le décompte courant par le suivant
* @param int id l'id de la séance
* @param int i l'id de l'exercice
* @param int j l'id de la série
**/
unsafeWindow.suivantDecompte = function()
{
    if(exerciceEnCours == seances.seances[seanceEnCours].general.nbExercices)
        return;

    decompteEnCours = false;

    var seconde = document.getElementById('secondeD');
    var minute = document.getElementById('minuteD');
    ++serieEnCours;


    if(serieEnCours >= parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours]['nbSeries']) - 1)
    {   
        var nbSecondes = parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].repos) % 60;
        var nbMinutes = Math.floor(parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].repos) / 60);        
        nbMinutes = (nbMinutes < 10 ? '0' + nbMinutes : nbMinutes);
        nbSecondes = (nbSecondes < 10 ? '0' + nbSecondes : nbSecondes);

        // On donne le focus à la case courante
        donnerFocus(exerciceEnCours, serieEnCours); 
        serieEnCours = -1;
        ++exerciceEnCours;
    }
    else
    {
        var nbSecondes = parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) % 60;
        var nbMinutes = Math.floor(parseInt(seances.seances[seanceEnCours].exercices[exerciceEnCours].ris) / 60);
        nbMinutes = (nbMinutes < 10 ? '0' + nbMinutes : nbMinutes);
        nbSecondes = (nbSecondes < 10 ? '0' + nbSecondes : nbSecondes);

        // On donne le focus à la case courante
        donnerFocus(exerciceEnCours, serieEnCours); 
    }
    
    if(exerciceEnCours == seances.seances[seanceEnCours].general.nbExercices)
    {
        var nbSecondes = '00';
        var nbMinutes = '00';
    }   

    minute.innerHTML = nbMinutes;
    seconde.innerHTML = nbSecondes;

    // On MAJ l'exercice en cours
    if(serieEnCours == -1)
    {
        document.getElementById('exoAFaire').innerHTML = "Pause";
        document.getElementById('serieAFaire').innerHTML = "";
    }
    else
    {
        document.getElementById('exoAFaire').innerHTML = seances.seances[seanceEnCours].exercices[exerciceEnCours].nom;
        document.getElementById('serieAFaire').innerHTML = "Série " + (serieEnCours + 1) + ", " + document.getElementById("serie_" + exerciceEnCours + "_" + serieEnCours).value + " reps";
    }

    clearTimeout(timerDecompte);
};

/**
* Affiche le chrono
* @param int courant le nombre de seconde écoulées
**/
function afficherChrono(courant)
{
    var seconde = document.getElementById('seconde');

    if(courant % 60 == 0)
    {
        var minute = document.getElementById('minute');
        nbMinutes = Math.floor(courant / 60);

        if(nbMinutes < 10)
            nbMinutes = '0'+nbMinutes;

        if(nbMinutes >= 60)
        {
            nbMinutes -= 60;

            if(nbMinutes < 10)
                nbMinutes = '0'+nbMinutes;

            var heure = document.getElementById('heure');
            nbHeure = Math.floor(courant / 3600);
            heure.innerHTML = nbHeure;
        }

        minute.innerHTML = nbMinutes;
    }
   
    nbSecondes = courant % 60;
    if(nbSecondes < 10)
        nbSecondes = '0'+nbSecondes;

    seconde.innerHTML = nbSecondes;

    timer = setTimeout(function()
    {
        afficherChrono(courant + 1);
    }, 1000);
}

/**
* Permet de réinitialiser le chrono
**/
unsafeWindow.reset = function()
{
    clearTimeout(timer);
    document.getElementById('seconde').innerHTML = '00';
    document.getElementById('minute').innerHTML = '00';
    document.getElementById('heure').innerHTML = '0';

    var d = new Date();
    start = Math.floor(d.getTime() / 1000);
    end  = start;

    var bouton = document.getElementById('pause').getElementsByTagName('input')[0];
    if(bouton.value == "Stop !")
    {
        afficherChrono(0);
    }
};

/**
* Permet d'arreter le chrono
**/
unsafeWindow.pause = function()
{
    if(timer)
    {
        clearTimeout(timer);
        var d = new Date();
        end = Math.floor(d.getTime() / 1000);

        var divBouton = document.getElementById('pause');
        var html = '<input class="button go" onClick="play();" value="Play" />';
        divBouton.innerHTML = html;
    }    
};

/**
* Permet de relancer le chrono
**/
unsafeWindow.play = function()
{
    var d = new Date();
    var tmp = Math.floor(d.getTime() / 1000);
    start -= (end - tmp);

    var secondes = parseInt(document.getElementById('seconde').innerHTML);
    var minutes = parseInt(document.getElementById('minute').innerHTML);
    var heures = parseInt(document.getElementById('heure').innerHTML);
    var total = (heures * 3600) + (minutes * 60) + secondes;

    var divBouton = document.getElementById('pause');
    var html = '<input class="button delete" onClick="pause();" value="Stop !" />';
    divBouton.innerHTML = html;

    afficherChrono(total);
};

/**
* Mets tous les exercices à 70% hormis ceux à 2 modes du repmin
* @param int id l'id de la séance
**/
unsafeWindow.soixanteDix = function(id)
{    
    var exercices = document.getElementsByClassName('exercices');
    var nb = exercices.length;
    var series;

    // On parcourt tous les exercices
    for(i = 0; i < nb; i++)
    {
        series = exercices[i].getElementsByClassName('serie');
        nbSeries = series.length;

        // On parcourt toutes les séries
        for(j = 0; j < nbSeries; j++)
        {
            if(parseInt(series[j].value) >= parseInt(seances.seances[id].exercices[i].nbRep) + 3)
                series[j].value = Math.round((parseInt(series[j].value) - 1) * 0.7);
        }
    }

    // On modifie le titre de la séance
    var h3 = document.getElementById('seance').getElementsByTagName('h3')[0];
    h3.innerHTML = seances.seances[id].general.titre + ' 70%';
    soixDix = true;
};

/**
* Modifie le total en live
* @param int i l'id de l'exercice
**/
unsafeWindow.modifierTotal = function(id)
{
    var total_courant = 0;
    var series = document.getElementsByClassName('serie_'+id);
    var nb = series.length;

    for(i = 0; i < nb; i++)
    {
        total_courant += parseInt(series[i].value);
    }
    var diff = (total_courant - totaux[id]);
    diff = diff >= 0 ? '+'+diff : diff;
    var html = 'Total : '+(total_courant)+' <i style="color:#'+(diff >= 0 ? '00AA00' : 'e14848')+';">('+diff+')</i>';

    document.getElementById('total_'+id).innerHTML = html;
};

/**
* Ajoute un input pour les liens youtube
**/
unsafeWindow.addYoutube = function()
{
    var youtube = document.getElementById('youtube');
    var inputs = youtube.getElementsByClassName('youtube');
    var nb = inputs.length;
    var html = '';
    var value = '';
    for(i = 0; i < nb; i++)
    {
        value = inputs[i].value;
        html += '<input type="text" id="youtube_0" class="youtube" value="'+value+'" onBlur="if(this.value == \'\') this.value = \'Lien youtube\';" onClick="if(this.value == \'Lien youtube\') this.value = \'\';" /><br />';   
    }
    html += '<input type="text" id="youtube_0" class="youtube" value="Lien youtube" onBlur="if(this.value == \'\') this.value = \'Lien youtube\';" onClick="if(this.value == \'Lien youtube\') this.value = \'\';" /><br />';   
    
    youtube.innerHTML = html;
};

/**
* Génère toutes les cases permettant de changer la difficulté ressentie
* @param int i l'id de l'exercice
* @param int j l'id de la série
- @return string difficulte le code html à afficher
**/
function difficulte(i, j)
{
    var difficulte = '<span class="difficulte" id="d_' + i + '_' + j + '">';
    difficulte += '<span onclick="changer_couleur('+i+', '+j+', \'#61d13f\');" class="changerCouleur" style="background: #61d13f;"></span>';
    difficulte += '<span onclick="changer_couleur('+i+', '+j+', \'#ccab0f\');" class="changerCouleur" style="background: #ccab0f;"></span>';
    difficulte += '<span onclick="changer_couleur('+i+', '+j+', \'#cb2424\');" class="changerCouleur" style="background: #cb2424;"></span>';
    difficulte += '</span>';
    return difficulte;
}

/**
* Permet de changer le background pour la difficulté
* @param int i l'id de l'exercice
* @param int j l'id de la série
* @param string color la couleur en hexadécimal
**/
unsafeWindow.changer_couleur = function (i, j, color)
{ 
    var id = 'serie_'+i+'_'+j;  
    document.getElementById(id).style.backgroundColor = color;
};

/**
* Centre un élément
**/
function centrerEl(el)
{
    var w_el = el.clientWidth;
    var h_el = el.clientHeight;
    var w_sc = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h_sc = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    el.style.left = (w_sc - w_el) / 2 + 'px';
    el.style.top = (h_sc - h_el) < 0 ? 0 : (h_sc - h_el) / 2 + 'px';
}

/**
* Convertir une couleur rgb en hexadecimal
* @param text rgb la couleur au format rgb
* @return text la couleur au format hexadecimal
**/
function rgb2hex(rgb)
{
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
/**
* Convertir un décimal en hexadecimal
* @param int x la couleur entre 0 et 255
* @return int x la couleur entre 00 et FF
**/
function hex(x)
{
    return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}
/**
* Récupère l'id d'un lien youtube
* @param str le lien youtube
* @return str l'id du lien
**/
function id_youtube(lien)
{
    var regex = lien.match(/\?v=([A-Za-z0-9\-_]+)&?/);
    return regex[1];
}