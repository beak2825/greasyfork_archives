// ==UserScript==
// @name       EUISUMN checkall
// @version    0.2
// @description  males isi evaluasi dosen? install ini langsung centang semua
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js
// @copyright  2014, anjinxx, GO
// @include         http://euis.umn.ac.id/mahasiswa/*
// @namespace https://greasyfork.org/users/6076
// @downloadURL https://update.greasyfork.org/scripts/5731/EUISUMN%20checkall.user.js
// @updateURL https://update.greasyfork.org/scripts/5731/EUISUMN%20checkall.meta.js
// ==/UserScript==

	$('table#tablesorter-demo').prepend("<td><center><input id='EvalAll' value='1' type='radio'></center></td></tr>");
	$('table#tablesorter-demo').prepend("<td><center><input id='EvalAll' value='2' type='radio'></center></td>");
	$('table#tablesorter-demo').prepend("<td><center><input id='EvalAll' value='3' type='radio'></center></td>");
	$('table#tablesorter-demo').prepend("<td><center><input id='EvalAll' value='4' type='radio'></center></td>");
	$('table#tablesorter-demo').prepend("<td>Check All</td>");
	$('table#tablesorter-demo').prepend("<td></td>");
    $('table#tablesorter-demo').prepend("<tr><td></td>");


    jQuery(document).ready(function(){
    
    $('input:radio[id="EvalAll"]').change(function(){
        if($(this).val() == '4'){
            $("input[id='EvalAll'][value='1']").attr ("checked", false);
            $("input[id='EvalAll'][value='2']").attr ("checked", false);
            $("input[id='EvalAll'][value='3']").attr ("checked", false);
            
            $("input[id='Eval1'][name='Eval1'][value='4']").attr ("checked", "checked");
            $("input[id='Eval2'][name='Eval2'][value='4']").attr ("checked", "checked");
            $("input[id='Eval3'][name='Eval3'][value='4']").attr ("checked", "checked");
            $("input[id='Eval4'][name='Eval4'][value='4']").attr ("checked", "checked");
            $("input[id='Eval5'][name='Eval5'][value='4']").attr ("checked", "checked");
            $("input[id='Eval6'][name='Eval6'][value='4']").attr ("checked", "checked");
            $("input[id='Eval7'][name='Eval7'][value='4']").attr ("checked", "checked");
            $("input[id='Eval8'][name='Eval8'][value='4']").attr ("checked", "checked");
            $("input[id='Eval9'][name='Eval9'][value='4']").attr ("checked", "checked");
            $("input[id='Eval10'][name='Eval10'][value='4']").attr ("checked", "checked");
            $("input[id='Eval11'][name='Eval11'][value='4']").attr ("checked", "checked");
            $("input[id='Eval12'][name='Eval12'][value='4']").attr ("checked", "checked");
            $("input[id='Eval13'][name='Eval13'][value='4']").attr ("checked", "checked");
            $("input[id='Eval14'][name='Eval14'][value='4']").attr ("checked", "checked");
        }
        else if($(this).val() == '3'){
            $("input[id='EvalAll'][value='1']").attr ("checked", false);
            $("input[id='EvalAll'][value='2']").attr ("checked", false);
            $("input[id='EvalAll'][value='4']").attr ("checked", false);
            $("input[id='Eval1'][name='Eval1'][value='3']").attr ("checked", "checked");
            $("input[id='Eval2'][name='Eval2'][value='3']").attr ("checked", "checked");
            $("input[id='Eval3'][name='Eval3'][value='3']").attr ("checked", "checked");
            $("input[id='Eval4'][name='Eval4'][value='3']").attr ("checked", "checked");
            $("input[id='Eval5'][name='Eval5'][value='3']").attr ("checked", "checked");
            $("input[id='Eval6'][name='Eval6'][value='3']").attr ("checked", "checked");
            $("input[id='Eval7'][name='Eval7'][value='3']").attr ("checked", "checked");
            $("input[id='Eval8'][name='Eval8'][value='3']").attr ("checked", "checked");
            $("input[id='Eval9'][name='Eval9'][value='3']").attr ("checked", "checked");
            $("input[id='Eval10'][name='Eval10'][value='3']").attr ("checked", "checked");
            $("input[id='Eval11'][name='Eval11'][value='3']").attr ("checked", "checked");
            $("input[id='Eval12'][name='Eval12'][value='3']").attr ("checked", "checked");
            $("input[id='Eval13'][name='Eval13'][value='3']").attr ("checked", "checked");
            $("input[id='Eval14'][name='Eval14'][value='3']").attr ("checked", "checked");
        }
        else if($(this).val() == '2'){
            $("input[id='EvalAll'][value='1']").attr ("checked", false);
            $("input[id='EvalAll'][value='4']").attr ("checked", false);
            $("input[id='EvalAll'][value='3']").attr ("checked", false);
            $("input[id='Eval1'][name='Eval1'][value='2']").attr ("checked", "checked");
            $("input[id='Eval2'][name='Eval2'][value='2']").attr ("checked", "checked");
            $("input[id='Eval3'][name='Eval3'][value='2']").attr ("checked", "checked");
            $("input[id='Eval4'][name='Eval4'][value='2']").attr ("checked", "checked");
            $("input[id='Eval5'][name='Eval5'][value='2']").attr ("checked", "checked");
            $("input[id='Eval6'][name='Eval6'][value='2']").attr ("checked", "checked");
            $("input[id='Eval7'][name='Eval7'][value='2']").attr ("checked", "checked");
            $("input[id='Eval8'][name='Eval8'][value='2']").attr ("checked", "checked");
            $("input[id='Eval9'][name='Eval9'][value='2']").attr ("checked", "checked");
            $("input[id='Eval10'][name='Eval10'][value='2']").attr ("checked", "checked");
            $("input[id='Eval11'][name='Eval11'][value='2']").attr ("checked", "checked");
            $("input[id='Eval12'][name='Eval12'][value='2']").attr ("checked", "checked");
            $("input[id='Eval13'][name='Eval13'][value='2']").attr ("checked", "checked");
            $("input[id='Eval14'][name='Eval14'][value='2']").attr ("checked", "checked");
        }
        else if($(this).val() == '1'){
            $("input[id='EvalAll'][value='4']").attr ("checked", false);
            $("input[id='EvalAll'][value='2']").attr ("checked", false);
            $("input[id='EvalAll'][value='3']").attr ("checked", false);
            $("input[id='Eval1'][name='Eval1'][value='1']").attr ("checked", "checked");
            $("input[id='Eval2'][name='Eval2'][value='1']").attr ("checked", "checked");
            $("input[id='Eval3'][name='Eval3'][value='1']").attr ("checked", "checked");
            $("input[id='Eval4'][name='Eval4'][value='1']").attr ("checked", "checked");
            $("input[id='Eval5'][name='Eval5'][value='1']").attr ("checked", "checked");
            $("input[id='Eval6'][name='Eval6'][value='1']").attr ("checked", "checked");
            $("input[id='Eval7'][name='Eval7'][value='1']").attr ("checked", "checked");
            $("input[id='Eval8'][name='Eval8'][value='1']").attr ("checked", "checked");
            $("input[id='Eval9'][name='Eval9'][value='1']").attr ("checked", "checked");
            $("input[id='Eval10'][name='Eval10'][value='1']").attr ("checked", "checked");
            $("input[id='Eval11'][name='Eval11'][value='1']").attr ("checked", "checked");
            $("input[id='Eval12'][name='Eval12'][value='1']").attr ("checked", "checked");
            $("input[id='Eval13'][name='Eval13'][value='1']").attr ("checked", "checked");
            $("input[id='Eval14'][name='Eval14'][value='1']").attr ("checked", "checked");
        }
    });
    
    });