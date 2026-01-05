// ==UserScript==
// @name        Super Jeu Bishop 2.0
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @version     2.0
// @grant       none
// @description Tapez pas Bishop !
// @downloadURL https://update.greasyfork.org/scripts/6326/Super%20Jeu%20Bishop%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/6326/Super%20Jeu%20Bishop%2020.meta.js
// ==/UserScript==

whacAZimpNum = 0;

var whacAZimp = (function () {
    var CONGRATULATIONS = 'Bravo ! Tu es presque aussi doué que Bishop !',
        HEIGHT = 4,
        WIDTH = 7,
        LEVELUP = 80,
        initialize,
        levelHolder,
        level,
        li,
        liElements = [],
        tronchesZimp = [],
        tronchesGentils = [],
        prevZimp,
        prepGame,
        prepStage,
        renderZimp,
        renderStage,
        setUpEvents,
        scoreHolder,
        score,
        vieHolder,
        vie,
        stage,
        speed = 1100,
        startGame,
        timer,
        diff,
        utils = {
            id: function (id) {
                return document.getElementById(id);
            },
            getNodeAsInt: function (parent) {
                return parent.firstChild.nodeValue - 0;
            },
            setFirstChildValue: function (parentElem, value) {
                parentElem.firstChild.nodeValue = value;
            },
            setTimer: function (func, ms) {
                return setInterval(func, ms);
            }
        };

    initialize = function (a) {
        liElements = [];
        if (undefined !== timer)
            clearInterval(timer);
        prepStage();
        renderStage();
        prepGame();
        setUpEvents();
        startGame(a);
    };

    prepStage = function () {
        li = document.createElement('li');
        li.style.backgroundColor="#ccc";
        li.style.display = "inline-block";
        li.style.height = "50px";
        li.style.margin = "0 0 5px 5px";
        li.style.textDecoration = "none";
        li.style.width = "50px";
        li.style.backgroundImage = "url('http://www.dreadcast.net/images/avatars/Bishop.jpg')";
        li.style.backgroundSize = "cover";

        stage = document.getElementById('ulStage'+whacAZimpNum);

    };

    renderStage = function () {
        for (var i = 0; i < (HEIGHT * WIDTH); i++) {
            var cloneLi = li.cloneNode(false);

            stage.appendChild(cloneLi);
            liElements.push(cloneLi);
        }
    };

    prepGame = function () {
        levelHolder = utils.id('level'+whacAZimpNum);
        level = utils.getNodeAsInt(levelHolder);
        scoreHolder = utils.id('score'+whacAZimpNum);
        score = utils.getNodeAsInt(scoreHolder);
        vieHolder = utils.id('vie'+whacAZimpNum);
        vie = utils.getNodeAsInt(vieHolder);    
    };

    setUpEvents = function () {
        stage.addEventListener('click', function(e) {
            if (e.target && 'li' === e.target.nodeName.toLowerCase()) {
                if ('zimp' === e.target.className) {
                    score += 10;
                    utils.setFirstChildValue(scoreHolder, score);
	                e.target.style.backgroundImage = "url('http://nsa34.casimages.com/img/2014/06/05/14060504012010051.jpg')";

                    if (score === level*100) {
                        clearInterval(timer);
                        if (1000 === score) {
                            scoreHolder.parentNode.innerHTML = CONGRATULATIONS;
                        } else {
                            speed -= LEVELUP;
                        
                            if(diff==1)
                             timer = utils.setTimer(renderZimpFacile, speed);
                            else if (diff > 1 || diff == -10)                         
                                timer = utils.setTimer(renderZimp, speed); 
        

                            level++;
                            utils.setFirstChildValue(levelHolder, level);
                        }
                    }
                }
                else //erreur
        		{
                  if('zentil' === e.target.className)
                  {
                     score -= 50;   
                     if(diff > 2 || diff == -10)
                     {
                         if(vie > 0)
                         {
                             vie -= 1;
                             utils.setFirstChildValue(vieHolder, vie);
                         }

                         if(vie == 0)
                         {
                           clearInterval(timer);
                           utils.setFirstChildValue(vieHolder, "Perdu!!");
                         }
                     }
                  }
                  else
                     score -= 10;
                    
        		  utils.setFirstChildValue(scoreHolder, score);
	              e.target.style.backgroundImage = "url('http://nsa34.casimages.com/img/2014/06/05/14060504012010051.jpg')";
        		  setTimeout(function(){e.target.style.backgroundImage = "url('http://www.dreadcast.net/images/avatars/Bishop.jpg')";},speed);
        		  
        		  if (level > 1 && score < ((level-1)*100))
        		  {
        		      clearInterval(timer);
                      speed += LEVELUP;
                      if(diff==1)
                         timer = utils.setTimer(renderZimpFacile, speed);
                      else if (diff > 1 || diff == -10)                          
                          timer = utils.setTimer(renderZimp, speed);        
                      
                      level--;
                      utils.setFirstChildValue(levelHolder, level);
        		    } 
        		}
            }
        }, false);
    };

    startGame = function (a) {
        diff = a;
        if(diff==1)
           timer = utils.setTimer(renderZimpFacile, speed);
        else if (diff==-10)
        {
           tronchesZimp = ["EveR.jpg", "Linda.png","Valfaria.jpg","Marley.png","Kinchaka.jpg","Malia.png","Gotheve.png","Seth.jpg"];
           tronchesGentils = ["Bishop.jpg"];
           timer = utils.setTimer(renderZimp, speed);
        }
        else if (diff > 1)
        {
           tronchesZimp = ["Elea.png","Scout.png","Pistache.png","Djino.jpg","Ethayel.jpg","Valmont.jpg","L-X.jpg","Kelvin.jpg","Zalaniz.png","Laetitia.jpg","Kazuki.png","Kmaschta.jpg","Arsenia.png","Alinka.jpg","Ghost.jpg","Saurus.jpg","Manerina.jpg","Ella.jpg","Astaa.png"];
           tronchesGentils = ["Fitz.jpg","Kinchaka.jpg","Malia.png","Oshean.jpg","Odul.png","Sÿllia.png","Zarah.png","Junajo.png","Pixelle.jpg","Lorkah.png","EveR.png","Cyberthorvaldr.jpg","Cherakanon.jpg","Gabrielle.png","Vanity.jpg","Alucard.jpg","Joaw.png","Yenahe.jpg","Gotheve.png","Xiya.jpg","Mik.png","Ghazullmor.jpg","Akiross.png"];
           timer = utils.setTimer(renderZimp, speed);
            
            if(diff == 4)
     		    setInterval(function(){score -= 10; utils.setFirstChildValue(scoreHolder, score);},10000);        
        }
    };

    
    renderZimpFacile = function () {
        if (undefined !== prevZimp) 
        {   
            prevZimp.className = '';
            prevZimp.style.backgroundImage = "url('http://www.dreadcast.net/images/avatars/Bishop.jpg')";
        }
        prevZimp = liElements[Math.floor((Math.random()*(HEIGHT * WIDTH))+1)-1];
        prevZimp.className = 'zimp';
    	if(level <= 2)
            prevZimp.style.backgroundImage = "url('http://nsa34.casimages.com/img/2014/06/05/140605035115599491.png')";
    	else
            prevZimp.style.backgroundImage = "url('http://nsa34.casimages.com/img/2014/06/05/140605035115599491.png')";
     };
  
     
    renderZimp = function () {
       if (undefined !== prevZimp) 
        {   
            prevZimp.className = '';
            prevZimp.style.backgroundImage = "url('http://www.dreadcast.net/images/avatars/Bishop.jpg')";
        }
        prevZimp = liElements[Math.floor((Math.random()*(HEIGHT * WIDTH))+1)-1];
              	
        var gentilmechant =Math.floor(Math.random()*7);
        if (gentilmechant != 0)
        {
            var tronche = tronchesZimp[Math.floor(Math.random()*tronchesZimp.length)]    
            prevZimp.className = 'zimp';
        }
        else            
        {
            var tronche = tronchesGentils[Math.floor(Math.random()*tronchesGentils.length)]    
            prevZimp.className = 'zentil';
        }

        prevZimp.style.backgroundImage = "url('http://www.dreadcast.net/images/avatars/"+tronche+"')";
    }

    return {
        init: initialize
    };
})();


Deck.prototype.executeCommandSave = Deck.prototype.executeCommand;

Deck.prototype.executeCommand=function(a,b){
    var c=$("#"+b+" .ligne_ecriture input").val();
    $.ajaxSetup({async: false});
    this.executeCommandSave(a,b);
    $.ajaxSetup({async: true});    
    
    if(c.toLowerCase() === "jeu")
    {
       $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<div>Tapes jeu niveauDeDifficulté (en minuscule) avec </br> Facile : Frappes les zimp qui apparaîssent et tu marques 10 points. Touches à la gentille Bishop et tu perds dix points.</br> Moyen : Oh non c était Bishop! Si tu la confonds avec un zimp et lui éclate le nez tu perds 50 points! </br> Difficile : Moyen + Tu perds la partie si tu exploses trois jolie petite andro! </br> Hardcore : Difficile + Tu perds dix points toutes les dix secondes. Cette fois ci, pas de Bishop, il te suffit de taper les zimps et d epargner les gentil rebelles. </br></br> Élections : Nous allons élire la plus belle femme du SR, défoules toi sur les candidates! Mais ne touches pas à Bishop! Équivalent à difficile</div>');        
    }
    else if(c.toLowerCase() === "jeu facile")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="display:none">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(1);
    }
    else if(c.toLowerCase() === "jeu moyen")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="display:none;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(2);
    }
    else if(c.toLowerCase() === "jeu difficile")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="color:#FFF;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(3);
    }
    else if(c.toLowerCase() === "jeu hardcore")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="color:#FFF;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(4);
    }
    else if(c.toLowerCase() === "jeu elections")
    { 
        whacAZimpNum++;
        $("#" + b + " .ligne_ecrite_fixed:last").html($("#" + b + " .ligne_ecrite_fixed:last").html() + '<section style="width: 390px; padding : 5px 0;"><ul id="ulStage'+whacAZimpNum+'" style="padding : 0; margin :0; cursor : url(http://www.dreadcast.net/images/objets/mini/gant-hydro.png), auto;" ></ul><p style="color:#FFF;">Score: <span id="score'+whacAZimpNum+'">0</span> points!</p><p style="color:#FFF;">Level: <span id="level'+whacAZimpNum+'">1</span></p><p style="color:#FFF;">Vies: <span id="vie'+whacAZimpNum+'">3</span></p></section>');
        whacAZimp.init(-10);
    }
};