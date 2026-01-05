// ==UserScript==
// @name        e-Ver
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @version     1
// @grant       none
// @description Bon anniversaire!
// @downloadURL https://update.greasyfork.org/scripts/6465/e-Ver.user.js
// @updateURL https://update.greasyfork.org/scripts/6465/e-Ver.meta.js
// ==/UserScript==
displayed = false;
interval = null;
phoenixRise = true;
var top = 90;
function movePhoenix()
{
    if(top > 90)
        phoenixRise = false;
    if(top <0)
        phoenixRise = true;
    if(phoenixRise)
        top = top + 0.5;
    else top = top- 0.5;
    
    $('#phoenix').css('top',top+"%"); 
}

function displayMenu()
{
    var content = $('#db_panneau_221175 .content')[0];
    content.innerHTML= "";
    var contentDiv= document.createElement('div');
    contentDiv.id ="tatadiv";
    content.appendChild(contentDiv);
    
    contentDiv.innerHTML ='<font color="#AF5000" size="6">e-Ver..</font></br> <font color="#990000">Un petit espace pour souffler</font>';
    contentDiv.innerHTML += '</br><font color="#AF5000">Bon Anniversaire!</font>';
    contentDiv.innerHTML += '</br></br>';
    contentDiv.innerHTML += '<a id="indices" class="link"><font color="#FFF">Indices</font></a>';
    contentDiv.innerHTML += '</br></br>';
    
    contentDiv.innerHTML += '<a id="cadeaux" class="link"><font color="#FFF">Cadeaux</font></a>';
    contentDiv.innerHTML += '</br></br>';
    
    contentDiv.innerHTML += '<a id="mercis" class="link"><font color="#FFF">Mercis</font></a>';
    contentDiv.innerHTML += '</br></br>';
    
    contentDiv.innerHTML += '<a id="musique" class="link"><font color="#FFF">Musique</font></a>';
    contentDiv.innerHTML += '</br></br></br></br>';  
    
    contentDiv.innerHTML += '<div><font size="2" color="#FFF"> Tant d\'idées que je n\'aurai pas eu le temps de mettre en place ou d\'aboutir.. L\'année prochaine!</font></div></br>';
    contentDiv.innerHTML +=' <font size="1" color="#FFF">(si envie de couper la musique, c\'est en haut à droite)</font>';
    
    $('#indices').click(function(){ displayIndices(); });  
    $('#cadeaux').click(function(){ displayCadeaux(); });  
    $('#mercis').click(function(){ displayMercis(); });  
    $('#musique').click(function(){ displayMusique(); });  
}

function displayMusique()
{
    $('#db_panneau_221175 .content').css("overflow","auto").css('max-height','450px');
    var content = $('#db_panneau_221175 .content')[0];
    content.innerHTML= "";
    var contentDiv= document.createElement('div');
    contentDiv.id ="tatadiv";
    content.appendChild(contentDiv);
    
    contentDiv.innerHTML ='<font color="#AF5000" size="6">Musique</font></br> <a class="link" id="retour"><font color="#990000">Retour</font></a>';
    contentDiv.innerHTML += '</br></br></br>';
    
    
    var video1 = document.createElement('iframe');
    video1.id = 'video1';
    contentDiv.appendChild(video1);
    $('#video1').css('display', 'block');
    var index = Math.floor((Math.random()*42)); 
    $('#video1').attr("src","https://www.youtube.com/embed/videoseries?list=PL2AB6EC89EFA95999&index="+index+"&rel=0&loop=1");
    contentDiv.innerHTML += '</br></br></br>';
    
    var video2 = document.createElement('iframe');
    video2.id = 'video2';
    contentDiv.appendChild(video2);
    $('#video2').css('display', 'block');
    var index = Math.floor((Math.random()*52)); 
    $('#video2').attr("src","https://www.youtube.com/embed/videoseries?list=PL6C017DBB52BB43BC&index="+index+"&rel=0&loop=1");
    contentDiv.innerHTML += '</br></br></br>';
    
    $('#retour').click(function(){ displayMenu(); });  
}

function displayMercis()
{
    $('#db_panneau_221175 .content').css("overflow","auto").css('max-height','450px');
    var content = $('#db_panneau_221175 .content')[0];
    content.innerHTML= "";
    var contentDiv= document.createElement('div');
    contentDiv.id ="tatadiv";
    content.appendChild(contentDiv);
    
    contentDiv.innerHTML ='<font color="#AF5000" size="6">Mercis</font></br> <a class="link" id="retour"><font color="#990000">Retour</font></a>';
    contentDiv.innerHTML += '</br></br><div><font color="#FFF">Tu as visiblement marqué nombre de joueurs comme en témoignent les nombreux remerciements publics sur le forum qui te sont destinés.</br> J\'ai pris la liberté d\'en compulser ici (du moins ceux qui font explicitement mention) :</font></div>';
    
    contentDiv.innerHTML += '</br></br></br>';
    contentDiv.innerHTML += '<div><font color="#AF5000">Manerina</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"> @EveR Pour tous les mots que le perso a offert à Mané et tous ceux que la joueuse a partagé à travers son EDC.</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Dye</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"> @EveR Enfin ! Et je n\'aurai rien d\'autre à dire, tu sais déjà à quel point je t\'idolâtre.</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Pistache</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Merci EveR pour le rpay explosif ! Qui.. Si je trouves le temps finiras en article EDC"</font></div></br></br>';  
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Adelor (?)</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"> Véritable soutien pour Adelor notamment dans ses tentatives d’accessions aux hautes responsabilités Impériales. Des personnes très intéressantes avec qui j\'aurais aimé sans doute RP un peu plus.</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Artorias</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Merci à EveR pour les RP sympa au labo"</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Lorkah</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"> Merci @Ever </font></div></br></br>';  
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Pixelle (reprit par Lorkah et Kananera)</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Merci à @Ever pour son travail magnifique, bluffant et impressionnant</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Gabrielle</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"> Merci à Ever pour ces décors... merci encore!</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Wanderlust</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">( ♥ )</font></div></br></br>';  
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Meyna</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">@Ever et @Junajo. Un énormissime merci ♥</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Teträm</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Merci @Ever [...] pour ce RP et cette soirée... mouvementée ^^ </font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Lyra</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Je tiens à remercier @EveR pour ses textes EDC à en faire pleurer des vaches (expression inconnue à ce jour, wi wi).Non, mais..magnifique quoi. :\') C\'est moi la vache. </font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Rage</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">@EveR.... Je ne te dirai plus jamais merci... Sauf aujourd\'hui sur ce post. </br> Donc je te remercie pour tout ce que tu as put faire pour moi, on s\'est connu en IRL, et tu m\'as déjà sortie de la rue à plusieurs reprises, tu m\'as nourris, tu m\'as logé, tu m\'as appris à écrire, tu m\'as conseiller, tu as toujours été là du moment ou je t\'ai connu.</br> Je te remercie aussi pour les quelques soirées qu\'on a passer à RP ensemble, c\'est toujours un plaisir d\'écrire avec une personne de ta qualité. </br> Je pense qu\'à l\'heure d\'aujourd\'hui tu devrais être la personne la plus respecter de tout ce putin de jeu, car tu en vaut la peine, et je serai derrière toi comme tu l\'as été pour moi. </font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Joaw</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"> @Kobal @EveR @Akiross et @Perle pour l\'aide dans les recherches historiques ainsi que les autres travaux effectués aux AAs, plongées matricielles... Le RP scientifique ne le lâchait pas hein ! smiley</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Korky</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Un immense Merci (avec une majuscule ouai) @EveR et @Dradix pour la raison énoncé plus haut. </font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Gawam</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Je découvre, alors faisons simple. Merci à Rei et EveR pour l’ensemble de leurs œuvres. Détailler serait trop long. </font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Aazya</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Pour tes mots, pour cet échange discret, pour avoir pri soin de la petite merveille aussi..</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Stiny</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"> @Ever surveillant de loin mais toujours présente.</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Asuka</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Merci EveR pour toutes les images, moi j\'adore. Et même si ce n\'est pas toi qui a fait celle ci, ça vaut pour toutes les autres. Puis un loup quoi... Hurle à la lune.</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Melody</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Merci pour l\'après midi ,j\'ai trop rit : ever, mik et fitz</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">"Inconnus"</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"@EveR qui m\'a montré le vrai visage de DC... dès le début."</font></div></br></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Je salue et remercie également EveR pour ses RP plus que déroutant"</font></div></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">En vrac par : </font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Kais x2, Jack, Duke x4 , Hazel, Rei, Saphyra, Vycodin </font></div></br></br>';  
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Odul</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF"><font size="2">Il y a fort longtemps, avant.. :</font> </br>"En vrac des persos qui inspirent le mien même si il les connait peu et qui lui donne espoir: @Ever, [...]"</font></div></br></br>';
    
    $('#retour').click(function(){ displayMenu(); });  
}

function displayCadeaux()
{
    $('#db_panneau_221175 .content').css("overflow","auto").css('max-height','450px');
    var content = $('#db_panneau_221175 .content')[0];
    content.innerHTML= "";
    var contentDiv= document.createElement('div');
    contentDiv.id ="tatadiv";
    content.appendChild(contentDiv);
    
    contentDiv.innerHTML ='<font color="#AF5000" size="6">Cadeaux</font></br> <a class="link" id="retour"><font color="#990000">Retour</font></a>';
    contentDiv.innerHTML += '</br></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Callian</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#990000">Fabula. Fabuleuse.</font></div></br>';
    contentDiv.innerHTML += '<div><center><img src="http://image.noelshack.com/fichiers/2014/46/1415784344-colors-by-valentinakallias-d356r0p.jpg"></center></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Il y a des êtres qui courent dans un dédale sans fin aux murs trop gris. Leurs yeux traquent lueurs jusqu\'à ce que leur souffle se perde à trop chercher en vain. On les montre du doigt, on les délaisse enfin à leur course étrange. Et les murs hurlent sans cesse : "</br><center><b>C-RevE.</b></center></br> </br> Ces êtres parlent quand ils ne courent pas. Discourent même dans le coin le plus sombre de leur labyrinthe. Cherchent une issue, inspiration, un simple chemin. Veulent voir couleur dans les murs monotones. Les murmures unis, font une drôle de musique : </br> <center><b>T-RevE.</b></center></br></br>Jusqu\'à un détour... Et leur souffle épuisé. Une main se tend, diaphane, perçant grisaille pour les saisir au coeur. Et dessiner tant de mots que leurs yeux cernent enfin ce prisme si vivant des émotions mêlées. Cette main. Cette femme. Qui leur dit doucement :</br> <center><b>RevE.</b></center></br></br>Et leur souffle mille étoiles pour réveiller en eux, cette soif d\'écrire. Pour trouver à leur tour, la force de rêver. </br></br><center>"Car un rêve sans étoile est un rêve oublié..."</br><b>Tu es la nôtre.</br></center></font></div>';
    contentDiv.innerHTML += '</br></br>';
    
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Manerina</font></div></br>';
    contentDiv.innerHTML += '<div><center><img src="http://image.noelshack.com/fichiers/2014/46/1415889100-ever.jpg"></center></div></br>';
    contentDiv.innerHTML += '</br></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Wanderlust</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">Bon moi j\'ai deux cadeaux ... Je me suis donnée à fond sur le premier, j\'espère que ça va te plaire:</font></div></br>';
    contentDiv.innerHTML += '<div><center><img src="http://www.zupimages.net/up/14/45/xu4d.png"></center></div></br></br>';
    contentDiv.innerHTML += '<div><center><img src="http://www.zupimages.net/up/14/46/1oyd.png"></br><b><font color="#990000">~ ... aeternam ~</font></b></center></div></br></br>';
    contentDiv.innerHTML += '</br></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Kobal</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Que dire, que dire, que dire... </br>Les mots paraissent toujours limités, que ce soit pour compter les maux, ou comme aujourd\'hui pour conter les joies.</br>Un texte de prose me semblera toujours incomplet, imparfait, mais je tacherai tout de même de le faire approcher de ce que je souhaite te dire en ce jour.</br>Je ne pourrais jamais assez te remercier de tout ce que tu as donné à mon vautour il y a de cela bien des jours</br></br>Des objectifs, des colères, des peurs et des joies. </br>Je ne savais jusqu\'à ce qu\'il te rencontre si il survivrait jusque là.</br>Tu es une personne exceptionnelle, infiniment plus que n\'importe qui que j\'ai jamais rencontré, IRL ou sur DC.</br></br>Tu sais manier les mots comme je ne saurais jamais le faire, ta plume plus virevoltante qu\'un fer d\'escrime, aussi agile et aussi fine.</br>Tu sais faire de grande recherche pour te documenter, pour t\'immerger dans ton personnage afin que ses/tes recherches soient toujours les plus justes.</br>Je pourrais continuer des jours encore à décrire tes qualités mais ce n\'est pas ici l\'idée de ce texte.</br>Ce texte, en fait, n\'est là que pour un seul but.</br></br>Il est là pour te souhaiter plein de tout ces bonheurs, d\'un soir, d\'un jour, d\'une semaine, d\'un mois ou d\'une année que tu pourras recevoir ou donner.</br></br>Il est là pour te dire que je serais encore là, toujours quand tu en auras besoin, autant que toutes les personnes ici, je n\'en doute pas.</br></br>Il est là pour se joindre aux autres, à toutes leurs attentions qu\'on t\'a tous fait pour te souhaiter ce jour unique.</br></br>Il est là, autant que moi je le suis pour te souhaites un très joyeux anniversaire."</font></div>';
    contentDiv.innerHTML += '</br></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">N2CV</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">SURPRISE ! ♥♥♥</font></div></br>';
    contentDiv.innerHTML += '<div><center><img src="http://img15.hostingpics.net/pics/522335maquette.png" width="580px"></center></div></br>';
    contentDiv.innerHTML += '</br></br></br>';  
    
    
    $('#retour').click(function(){ displayMenu(); });  
}


function displayIndices()
{
    $('#db_panneau_221175 .content').css("overflow","auto").css('max-height','450px');
    var content = $('#db_panneau_221175 .content')[0];
    content.innerHTML= "";
    var contentDiv= document.createElement('div');
    contentDiv.id ="tatadiv";
    content.appendChild(contentDiv);
    
    contentDiv.innerHTML ='<font color="#AF5000" size="6">Indices</font></br> <a class="link" id="retour"><font color="#990000">Retour</font></a>';
    contentDiv.innerHTML += '</br></br></br>';
    
    contentDiv.innerHTML += '<div><center><img src="http://www.zupimages.net/up/14/46/9vy6.png" width="580px"></center></div></br>';
    contentDiv.innerHTML += '<div><center><img src="http://i.imgur.com/CJ4IwZa.png" width="580px"></center></div></br>';
    
    
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Callian</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Te montrer à l\'univers, le temps d\'un éclair,</br> puis m\'enfermer avec toi, seul, et te regarder pendant l\'éternité."</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Je pousse ma pierre et ne me laisserai jamais écraser par elle..."</font></div>';
    contentDiv.innerHTML += '</br></br>';
    
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Manerina</font></div></br>';
    
    var video1 = document.createElement('iframe');
    video1.id = 'video1';
    contentDiv.appendChild(video1);
    $('#video1').css('display', 'block');
    $('#video1').attr('src', 'https://www.youtube.com/embed/w7eYH6IRRow?rel=0');
    contentDiv.innerHTML += '</br></br></br>';
    
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Kobal</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Sous mon masque il y a plus que de la chair et des plumes.</br> Sous mon masque il y a des idées, et les idées sont à l\'épreuve des cuves."</font></div>';
    contentDiv.innerHTML += '</br>';
    
    contentDiv.innerHTML += '<font color=#FFF>"(Tant que pas_Trouve </br> { Devine(Personnage.nom) Si:* </br>Personnage.passes_temps= simsens / lecture; </br>Personnage.race=vautour; </br>Personange.nom != Boot; </br>Fin Si;} </br> Fin Tant Que ; )"</font>'
    contentDiv.innerHTML += '</br></br></br>';
    
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Wanderlust</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Etoile... Trou noir."</font></div>';
    contentDiv.innerHTML += '</br>';
    
    
    var video2 = document.createElement('iframe');
    video2.id = 'video2';
    contentDiv.appendChild(video2);
    $('#video2').css('display', 'block');
    $('#video2').attr('src', 'https://www.youtube.com/embed/AJK82x8wkxA?rel=0');
    contentDiv.innerHTML += '</br></br></br>';
    
    
    contentDiv.innerHTML += '<div><font color="#AF5000">N2CV</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Paul Eluard... papier vélin... indéfectiblement"</font></div>';
    contentDiv.innerHTML += '</br>';
    
    var video3 = document.createElement('iframe');
    video3.id = 'video3';
    contentDiv.appendChild(video3);
    $('#video3').css('display', 'block');
    $('#video3').attr('src', 'https://www.youtube.com/embed/NBOQc3L1t1A?rel=0');
    contentDiv.innerHTML += '</br></br></br>';
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Odul</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"Tout."</font></div>';
    contentDiv.innerHTML += '</br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"c\'est pis la souris!as moi ma"</font></div>';
    contentDiv.innerHTML += '</br></br></br>';
    
    
    contentDiv.innerHTML += '<div><font color="#AF5000">Valmont</font></div></br>';
    contentDiv.innerHTML += '<div><font color="#FFF">"D\'un oeil lointain il veille,</br> leurre guettant l\'heure où tu et vous ne feront plus qu\'un,</br> un seul fragment du puzzle brisé, </br>l\'alliance scellée échouée sur un coin de miroir."</font></div>';
    contentDiv.innerHTML += '</br>';
    
    var video4 = document.createElement('iframe');
    video4.id = 'video4';
    contentDiv.appendChild(video4);
    $('#video4').css('display', 'block');
    $('#video4').attr('src', 'https://www.youtube.com/embed/Bj2p_v_FfJ8?rel=0');
    contentDiv.innerHTML += '</br></br></br>';
    
    $('#retour').click(function(){ displayMenu(); });  
}

$(document).ready(function() {
    
    setInterval(function(){checkPanneau()},300);
})();

function checkPanneau()
{
    if(document.getElementById("db_panneau_221175") && displayed==false)
    { 
        displayed=true;	
        $('#db_panneau_221175 .content').html('');
        
        $("#db_panneau_221175").css('width','600px');
        $("#db_panneau_221175 .content").css('height','');
        $("#db_panneau_221175 .content div").css('height',''); 
        
        var iframePsycho = document.createElement('iframe');
        iframePsycho.id = 'iframePsycho';
        document.body.appendChild(iframePsycho);
        $('#iframePsycho').css('width', '300px');
        $('#iframePsycho').css('height', '60px');
        $('#iframePsycho').css('position', 'absolute').css('left', $('#zone_gauche')[0].getBoundingClientRect().left+'px');
        $('#iframePsycho').css('display', 'none');
        
        if ($('#iframePsycho').css('display') == 'none')
        {
            $('#iframePsycho').css('width', '80%');
            $('#iframePsycho').css('height', '90%');
            $('#iframePsycho').css('position', 'absolute').css('top', '0px');
            $('#iframePsycho').css('display', 'block');
            $('#iframePsycho').css('z-index', '12001');
            $('#iframePsycho').attr('src', 'https://www.youtube.com/embed/xO9hpx4PQAc?rel=0&autoplay=1&loop=1&playlist=xO9hpx4PQAc');
        }
        
        
        var phoenix = document.createElement('div');
        phoenix.id='phoenix';
        //phoenix.setAttribute("style", "width:300px;height:300px;background-image:url('http://zupimages.net/up/14/46/250c.gif');background-repeat: no-repeat;background-position: 0px 0;position: absolute; left: 0px; top:0px; z-index: 12000;");
        phoenix.setAttribute("style", "width:300px;height:300px;background-image:url('http://zupimages.net/up/14/46/exdl.gif');background-repeat: no-repeat;background-position: 0px 0;position: absolute; left: 0px; top:0px; z-index: 12000;");
        
        document.body.appendChild(phoenix);
        
        var plumes = document.createElement('div');
        plumes.id='plumes';
        plumes.setAttribute("style", "opaticy:0.75;width:300px;height:300px;background-image:url('http://zupimages.net/up/14/46/7zir.png');background-repeat: no-repeat;background-position: 0px 0;position: absolute; right: 0px; bottom:0px; z-index: 12002;");
        
        document.body.appendChild(plumes);
        
        
        var iframeMusiqueFond = document.createElement('iframe');
        iframeMusiqueFond.id = "iframeMusiqueFond";
        document.body.appendChild(iframeMusiqueFond);
        $('#iframeMusiqueFond').css("width","300px");
        $('#iframeMusiqueFond').css("height","60px");
        $('#iframeMusiqueFond').css("position","absolute").css('top','30px');
        var temps = Math.floor((Math.random()*4000)); 
        $('#iframeMusiqueFond').attr("src","https://www.youtube.com/embed/zYa6zpxyC-U?rel=0&autoplay=1&loop=1playlist=zYa6zpxyC-U&start="+temps);
        
        interval = setInterval(function(){movePhoenix()},300);
        
        displayMenu();
    }
    else if(!document.getElementById("db_panneau_221175") && displayed==true)
    {
        console.log("mm");
        displayed=false;
        document.body.removeChild(document.getElementById("iframePsycho"));
        document.body.removeChild(document.getElementById("phoenix"));
        document.body.removeChild(document.getElementById("iframeMusiqueFond"));
        document.body.removeChild(document.getElementById("plumes"));
        clearInterval(interval);
    }
}

