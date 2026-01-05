// ==UserScript==
// @name         Liczenie średniej
// @version      0.4
// @description  Liczenie średniej w dzienniku
// @author       Zalazdi
// @match        https://uonetplus-uczen.vulcan.net.pl/elblag/*/
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @namespace http://your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/6954/Liczenie%20%C5%9Bredniej.user.js
// @updateURL https://update.greasyfork.org/scripts/6954/Liczenie%20%C5%9Bredniej.meta.js
// ==/UserScript==

var main = function () {
    Ext.Ajax.on('requestcomplete', function(ajax, response) {
        var url = response.request.options.url;
        
        if (url.search('GetOceny') > 0) {
        	//console.log(response);
            
            var gradesList = JSON.parse(response.responseText);
            
            for(i in gradesList.data) {
             	var grades = gradesList.data[i];
               	
                if (typeof grades == 'object' && grades.Przedmiot != 'Zachowanie') {
                    var divident = 0;
                    var divisior = 0;
                    for(j in grades.OcenyCzastkowe) {
                        var grade = grades.OcenyCzastkowe[j];
                        
                        if (typeof grade == 'object') {
                            
                            var value = grade.Wartosc;
                            
                            if ( !(grade.Nauczyciel == "Korzeniowska Ewa" && grade.Wartosc == null && grade.Wpis == "nb") 
                               && !(grade.Wpis == '-' || grade.Wpis == '+' || grade.Wpis == '+ (+)' || grade.Wpis == '- (-)') ) {
                                if (grade.Modyfikator == '+') {
                                    value += 0.5;
                                } else if (grade.Modyfikator == '-') {
                                    value -= 0.25;
                                }
                                
                                divident += (value * grade.Waga);
                                divisior += grade.Waga;
                            }
                        }
                    }
                    
                    if (divisior == 0) {
                        var average = '-';
                    } else {
                        var average = Math.round( (divident/divisior)*100) / 100;
                    }
                    
                    //window.setTimeout('putAverage(' + grades.Pozycja + ', "' + average + '")', 500);
                    
                    var prop = {
                        grades: grades,
                        average: average
                    };
                    
                    setTimeout(function(prop) {
                        var el = $('#informacjeUczen-oceny-OcenyView .x-tmpl-oceny-table tr:eq(' + (prop.grades.Pozycja+1) + ') td[data-key="Przewidywana"]');
                        var text = el.text();
                        text += ' (<strong>' + prop.average + '</strong>)';
                        el.html(text);
    				}.bind(null, prop), 500);
                }
            }
                    
            if ($('#cbUczen-inputEl').val().search('Mydlarz') > -1) {
                alert('Mydlorz...');
                alert('WYPIERDALAJ!');
            }
        }
    });
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);