// ==UserScript==
// @name       Trivia Crack / Preguntados Correct Answer Cheat!
// @namespace  ar.com.maurocendon.userscripts.triviacrackcheat
// @version    1.0
// @description EN: This user script shows the Trivia Crack correct answer (Facebook Game). \n ES: Este script muestra la respuesta correcta en el juego Preguntados (Juego de Facebook)
// @match      
// @author @MauroCendon <mau.cendon@gmail.com>
// @downloadURL https://update.greasyfork.org/scripts/7737/Trivia%20Crack%20%20Preguntados%20Correct%20Answer%20Cheat%21.user.js
// @updateURL https://update.greasyfork.org/scripts/7737/Trivia%20Crack%20%20Preguntados%20Correct%20Answer%20Cheat%21.meta.js
// ==/UserScript==
var appName = "[ TRIVIA CRACK / PREGUNTADOS CORRECT ANSWER CHEAT ]";
var preguntadosDomains = {"triviacrack.com": "triviacrack.com",
                          "www.triviacrack.com":"www.triviacrack.com",
                          "preguntados.com":"preguntados.com",
                          "www.preguntados.com":"www.preguntados.com"};
var gamePaths = {"/game":"/game","/game/":"/game/"};
var pwHandler = function(){};

var pwAlertText = function(question)
{
    return "Pregunta: " + question.text + "\nRespuesta Correcta: " + question.answers[question.correct_answer];
}

var pwAlert = function(question, powerup)
{
    alert(appName + "\r\n" + pwAlertText(question));
}

var pwDecorateButton = function(question,powerup)
{
    if (jQuery(".answers-container").size() > 0)
    {
        if (jQuery(".answers-container").find("button")[question.correct_answer])
        {
            jQuery(jQuery(".answers-container").find("button")[question.correct_answer]).css("border", "10px solid #ff0000");
        }
    }    
    
}

if (window.location.host in preguntadosDomains && window.location.pathname in gamePaths)
{
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            
            var xhr = this;
            if (url.indexOf("/dashboard") > -1)
            {
                async = false;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        var data = JSON.parse(xhr.responseText);
                    }
                };
            }
            
            if (url.indexOf("/games/") > -1)
            {
                async = false;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        var data = JSON.parse(xhr.responseText);
                        if (data.my_turn)
                        {
                            var spinsData = data.spins_data;
                            if (!spinsData) 
                                return;
                            
                            var spins = spinsData.spins;
                            if (!spins)
                                return;
                            
                            //1° Caso: Pregunta NORMAL
                            if (spins.length == 1)
                            {
                                var questionData = spins[0].questions[0];
                                if (!questionData)
                                    return;
                                
                                var question         = questionData.question;
                                var powerup            = questionData.powerup_question;
                                
                                pwHandler = function()
                                {
                                    pwDecorateButton(question,powerup);  
                                };
                            }
                            else
                            {
                                //2° Caso: Duelo o Corona
                                //TODO: IMPLEMENTAR DUELO
                                if (spins.length == 2)
                                {
                                    var crown     = spins[0].type == "CROWN"     ? spins[0] : spins[1];
                                    var duel     = spins[1].type == "DUEL"     ? spins[1] : spins[0];
                                    var question = null;
                                    pwHandler = function()
                                    {
                                        var handler = this;
                                        
                                        jQuery(".btn.choose-crown").off("click");
                                        jQuery(".btn.choose-duel").off("click");
                                        jQuery("input.category-radio").off("click");
                                        
                                        jQuery(".btn.choose-crown").on("click",function(ev)
                                        {
                                            handler.gameType = "CROWN"; 
                                        });
                                        
                                        jQuery(".btn.choose-duel").on("click",function(ev)
                                        {
                                            handler.gameType = "DUEL"; 
                                        });
                                        
                                        jQuery("input.category-radio").on("click", function(ev){
                                            var category = jQuery(this).val().toUpperCase();
                                              var game = null;
                                            
                                            if (handler.gameType == "CROWN")
                                            {
                                                game = crown
                                            }
                                            else if(handler.gameType == "DUEL")
                                            {
                                                game = duel;
                                            }
                                            
                                            for (var i=0;i<game.questions.length;i++)
                                            {
                                                if (game.questions[i].question.category == category)
                                                {
                                                    question = game.questions[i];
                                                    break;
                                                }
                                            }
                                            
                                        });
                                        
                                           if (question != null)
                                        {
                                            pwDecorateButton(question.question,question.powerup_question);
                                        }
                                        
                                    };
                                    
                                }

                            } 
                           
                           jQuery(document).off('DOMSubtreeModified');
                           jQuery(document).on('DOMSubtreeModified', pwHandler);
                        }
                        
                    }
                }
            } 
            
            
            
            open.call(this, method, url, async, user, pass);
        };//open
    })(XMLHttpRequest.prototype.open);

}
