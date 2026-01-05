// ==UserScript==
// @name        (MAL) My Anime List Filter
// @namespace   myanimelist.net
// @include     http://myanimelist.net/animelist/*
// @include     https://myanimelist.net/animelist/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @require     http://code.jquery.com/ui/1.10.2/jquery-ui.js
// @description This script filters your anime list by type (movie, TV, etc.), score, airing status, number of episodes and rating
// @version     1.5.26
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/8282/%28MAL%29%20My%20Anime%20List%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/8282/%28MAL%29%20My%20Anime%20List%20Filter.meta.js
// ==/UserScript==

typevarDefault = 'All';
scorevarDefault = 'All';
progressvarDefault = 'All';
airingvar = 'All';
ratingvarDefault = 'All';
equalscoreDefault = '0';
selecttypeDefault = 1;
selectratDefault = 1;
rangescoreDefault = 'Choose range';
animenameDefault = '';
enterTitle = 'All';

function myFunction() {
    selection = true;
    if ($(this).length > 0) {
        if ( $(this)[0].length == undefined || ( $(this).length == 1 && $(this).is("select") ) ) {
            var x=$(this).val();
            if ($(this).attr('class')=='type') {
                typevar=x;
                GM_setValue('type', typevar);
            }
            else if ($(this).attr('class')=='score') {
                scorevar=x;
                GM_setValue('score', scorevar);
            }
            else if ($(this).attr('class')=='progress') {
                progressvar=x;
                GM_setValue('progress', progressvar);
            }
            else if ($(this).attr('class')=='airing') {
                airingvar=x;
                GM_setValue(airingvar, $(this)[0].checked);
            }
            else if ($(this).attr('class')=='rating') {
                ratingvar=x;
                GM_setValue('rating', ratingvar);
            }
            else if ($(this).attr('id')=='select') {
                if (selecttype == parseInt(x)) {
                    selection = false;
                }
                selecttype=parseInt(x);
                GM_setValue('select', selecttype.toString());
            }
            else if ($(this).attr('id')=='ratselect') {
                if (selectrat == parseInt(x)) {
                    selection = false;
                }
                selectrat=parseInt(x);
                GM_setValue('ratselect', selectrat.toString());
            }
            else if ($(this).attr('id')=='equal') {
                equalscore=x;
                GM_setValue('equal', equalscore);
                if(equalscore == 4) {
                    var bha = prompt('Choose score range separated by a minus','6-8');
                    $("#choose").text(bha);
                    rangescore=bha;
                    GM_setValue('range', rangescore);
                }
            }
            else if ($(this).attr('id')=='name') {
                $(allprogress).prop('checked', true);
                animename=x;
                progressvar = "All";
                GM_setValue('name', animename);
                GM_setValue('progress', progressvar);
            }
        }
    }
    if (selection) {
        if (typevar!='All' || (scorevar!='All' && parseInt(equalscore) < 4) || ratingvar!='All' || !notairing.checked || !airingt.checked || !notyetaired.checked || progressvar!='All' || equalscore=='4' || animename != '') {
            $("tbody > tr:has(.td1,.td2)").hide();
            var exp="tbody > tr";

            $.expr[':'].ratingEquals = $.expr.createPseudo(function(arg) {
                return function( elem ) {
                    return $(elem).text().match("[\t\r\n\f\              ]" + arg + "[\t\r\n\f\            ]");
                };
            });

            if (typevar!='All' && selecttype) { exp=exp+":has(td[width='50']:contains('"+typevar+"'))"; }
            else if (typevar!='All' && !selecttype) { exp=exp+":not(:has(td[width='50']:contains('"+typevar+"')))"; }
            if (scorevar!='All' && equalscore=='0') { exp=exp+":has(td[width='45']:contains('"+scorevar+"'))"; }
            else if (scorevar!='All' && equalscore=='1') { exp=exp+":has(td[width='45']:not(:contains('"+scorevar+"')))"; }
            if (ratingvar!='All' && selectrat) { exp=exp+":has(td[width='50']:ratingEquals('"+ratingvar+"'))"; }
            else if (ratingvar!='All' && !selectrat) { exp=exp+":not(:has(td[width='50']:ratingEquals('"+ratingvar+"')))"; }

            if (!notairing.checked) { exp=exp+":has(td[style='border-left-width: 0'] > small:contains('Airing'),td[style='border-left-width: 0'] > small:contains('Not Yet Aired'))"; }
            if (!airingt.checked) { exp=exp+":not(:has(td[style='border-left-width: 0'] > small:contains('Airing')))"; }
            if (!notyetaired.checked) { exp=exp+":not(:has(td[style='border-left-width: 0'] > small:contains('Not Yet Aired')))"; }

            if (progressvar!='All') {
                begin = parseInt(progressvar.split('-')[0]);
                end = parseInt(progressvar.split('-')[1]);
            }
            else if (animename != '') {
                if (animename == '-') {
                    begin = 0;
                    end = 0;
                } else {
                    begin = animename.split('-')[0];
                    end = animename.split('-')[1];
                    if ( !isNaN(begin) && begin != '' ) {
                        if ( end == undefined ) {
                            end = begin;
                        }
                        else if ( isNaN(end) || end == '' ) {
                            end = 10000;
                        }
                    }
                    else if ( isNaN(begin) || begin == '' ) {
                        begin = 1;
                    }
                    if ( parseInt(end) < parseInt(begin) ) {
                        var temp = end;
                        end = begin;
                        begin = temp;
                    }
                    begin = parseInt(begin);
                    end = parseInt(end);
                }
            }
            if (progressvar != 'All' || animename != '' ) {exp = $(exp).filter(function() { return parseInt($("td[width='70']", this).text().replace(/^.*\/(.*)$/, "$1").replace("-", "0")) <= end && parseInt($("td[width='70']", this).text().replace(/^.*\/(.*)$/, "$1").replace("-", "0")) >= begin; }); }

            if (scorevar!='All' && equalscore=='2') { exp=$(exp).filter(function() { return parseInt($("td[width='45']", this).text()) > parseInt(scorevar); }); }
            else if (scorevar!='All' && equalscore=='3') { exp=$(exp).filter(function() { return parseInt($("td[width='45']", this).text()) < parseInt(scorevar); }); }
            else if (equalscore=='4') { scorebegin=parseInt(rangescore.split('-')[0]); scoreend=parseInt(rangescore.split('-')[1]); exp=$(exp).filter(function() { return parseInt($("td[width='45']", this).text()) <= scoreend && parseInt($("td[width='45']", this).text()) >= scorebegin; }); }

            $(exp).each(function(){
                $(this).show();
            });
        } else {
            $("tbody > tr:has(.td1,.td2)").show();
        }
    }
}

function resetFilters() {
    typevar = typevarDefault;
    scorevar = scorevarDefault;
    progressvar = progressvarDefault;
    ratingvar = ratingvarDefault;
    equalscore = equalscoreDefault;
    selecttype = selecttypeDefault;
    selectrat = selectratDefault;
    rangescore = rangescoreDefault;
    animename = animenameDefault;

    airingt.checked = 'yes';
    notairing.checked = 'yes';
    notyetaired.checked = 'yes';
    menutype.value = selecttype;
    loadState(typevar, 'type');
    menuscore.value = equalscore;
    choose.innerHTML = rangescore;
    loadState(scorevar, 'score');
    namee.value = enterTitle;
    loadState(progressvar, 'progress');
    menurating.value = selectrat;
    loadState(ratingvar, 'rating');

    GM_setValue('type', typevar);
    GM_setValue('score', scorevar);
    GM_setValue('progress', progressvar);
    GM_setValue('Airing', 'True');
    GM_setValue('Finished', 'True');
    GM_setValue('Not Yet Aired', 'True');
    GM_setValue('rating', ratingvar);
    GM_setValue('select', selecttype.toString());
    GM_setValue('ratselect', selectrat.toString());
    GM_setValue('equal', equalscore);
    GM_setValue('range', rangescore);
    GM_setValue('name', animename);

    myFunction();
}

$(document).ready(function() {
    $(".type,.score,.progress,.airing,#select,.rating,#ratselect,#equal").change(myFunction);
    $("#name").focusin(function() {
        if (this.value==enterTitle) { $(this).val(''); }
    });
    $("#name").focusout(function() {
        if (this.value=='') { $(this).val(enterTitle); }
        if (this.value=='0') { $(this).val('-'); }
    });
    $("#name").keyup(myFunction);

    $(function() {
        $(".drag").draggable({
            // Remove right position so that two last options in 'Airing' table do not get distorted (breaked to a new line) when dragged close to the right edge of the screen.
            start: function(event, ui) {
                $(this).css('right', '');
            },

            // Find position where image is dropped.
            stop: function(event, ui) {
                // Save dropped position.
                var stopPos = $(this).position();
                GM_setValue(this.id + ".left", stopPos.left + 'px');
                GM_setValue(this.id + ".top", stopPos.top + 'px');
            }
        });
    });

    columnChecker = $('td[class="table_header"][width="50"]');
    if (columnChecker.length < 2) {
        if (columnChecker.length == 0) {
            $(table).hide();
            $(table5).hide();
        } else {
            columnChecker = $('td[class="table_header"][width="50"][nowrap=""]');
            if (columnChecker.length == 1) {
                $(table5).hide();
            } else {
                $(table).hide();
            }
        }
    }
    typevar = loadValue(typevarDefault, 'type', table);
    selecttype = parseInt(loadValue(selecttypeDefault, 'select', table));
    ratingvar = loadValue(ratingvarDefault, 'rating', table5);
    selectrat = parseInt(loadValue(selectratDefault, 'ratselect', table5));

    columnChecker = $('td[class="table_header"][width="45"]');
    if (columnChecker.length < 1) {
        $(table2).hide();
    }
    scorevar = loadValue(scorevarDefault, 'score', table2);
    equalscore = loadValue(equalscoreDefault, 'equal', table2);
    rangescore = loadValue(rangescoreDefault, 'range', table2);

    columnChecker = $('td[class="table_header"][width="70"]');
    if (columnChecker.length < 1) {
        $(table3).hide();
    }
    progressvar = loadValue(progressvarDefault, 'progress', table3);
    animename = loadValue(animenameDefault, 'name', table3);

    //One 'Airing' and one 'Not Yet Aired' strings are present in the filter table itself
    if ($("tr:contains('Airing')").length == 1 && $("tr:contains('Not Yet Aired')").length == 1) {
        $(table4).hide();
    }
    airingt.checked = loadValue(airingt.checked, 'Airing', table4);
    notairing.checked = loadValue(notairing.checked, 'Finished', table4);
    notyetaired.checked = loadValue(notyetaired.checked, 'Not Yet Aired', table4);


    if ( $(table).is(':visible') ) {
        menutype.value = selecttype;
        loadState(typevar, 'type');
    }
    if ( $(table2).is(':visible') ) {
        menuscore.value = equalscore;
        if (equalscore == 4) {
            choose.innerHTML = rangescore;
        } else {
            rangescore = '';
        }
        loadState(scorevar, 'score');
    }
    if ( $(table3).is(':visible') ) {
        if (animename != '') {
            namee.value=animename;
        }
        loadState(progressvar, 'progress');
    }
    if ( $(table5).is(':visible') ) {
        menurating.value = selectrat;
        loadState(ratingvar, 'rating');
    }
    myFunction();

    //Element Placing
    resetPlacer = $('td#mal_cs_powered');
    var resetDiv = document.createElement('td');
    resetDiv.setAttribute('id','mal_cs_reset');
    var resetButton = document.createElement('input');
    //resetButton.style.marginLeft = '30px';
    resetButton.setAttribute('type','button');
    resetButton.setAttribute('value','Reset Filters');
    resetButton.setAttribute('id','reset_filters');
    resetButton.style.fontSize = '10px';
    $(resetButton).click(resetFilters);
    resetPlacer.before(resetDiv);
    $(resetDiv).append(resetButton);

    /*$(".drag div").hide();
    $(".drag").hover(function() {
        $("div", this).stop(true, true).slideToggle(200);
    })*/
});

table=document.createElement('table');
table.className='drag';
table.id='type';
table.style.right='190px';
table2=document.createElement('table');
table2.className='drag';
table2.id='score';
table2.style.right='40px';
table3=document.createElement('table');
table3.className='drag';
table3.id='progress';
table3.style.right='190px';
table4=document.createElement('table');
table4.className='drag';
table4.id='airing';
table4.style.right='60px';
table5=document.createElement('table');
table5.className='drag';
table5.id='rating';
table5.style.right='190px';

type=document.createElement('td');
type.className='td';
score=document.createElement('td');
score.className='td';
progress=document.createElement('td');
progress.className='td';
airing=document.createElement('td');
airing.className='td';
rating=document.createElement('td');
rating.className='td';

headtype=document.createElement('tr');
headscore=document.createElement('tr');
headprogress=document.createElement('tr');
headairing=document.createElement('tr');
headrating=document.createElement('tr');

divtype=document.createElement('div');
divscore=document.createElement('div');
divprogress=document.createElement('div');
divairing=document.createElement('div');
divrating=document.createElement('div');

imagetype=document.createElement('div');
imagetype.className='group_header';
imagetype.innerHTML='type';
imagescore=document.createElement('div');
imagescore.className='group_header';
imagescore.innerHTML='score';
imageprogress=document.createElement('div');
imageprogress.className='group_header';
imageprogress.innerHTML='episodes';
imageairing=document.createElement('div');
imageairing.className='group_header';
imageairing.innerHTML='status';
imagerating=document.createElement('div');
imagerating.className='group_header';
imagerating.innerHTML='rating';

tr1=document.createElement('tr');
tr2=document.createElement('tr');
tr3=document.createElement('tr');
tr4=document.createElement('tr');
tr5=document.createElement('tr');
tr6=document.createElement('tr');
tr7=document.createElement('tr');
tr8=document.createElement('tr');
tr9=document.createElement('tr');
tr10=document.createElement('tr');
tr11=document.createElement('tr');
tr12=document.createElement('tr');
tr13=document.createElement('tr');
tr14=document.createElement('tr');
tr15=document.createElement('tr');
tr16=document.createElement('tr');
tr17=document.createElement('tr');
tr18=document.createElement('tr');
tr19=document.createElement('tr');
tr20=document.createElement('tr');
tr21=document.createElement('tr');
tr22=document.createElement('tr');
tr23=document.createElement('tr');
tr24=document.createElement('tr');
tr25=document.createElement('tr');
tr26=document.createElement('tr');
tr27=document.createElement('tr');
tr28=document.createElement('tr');
tr29=document.createElement('tr');
tr30=document.createElement('tr');
tr31=document.createElement('tr');
tr32=document.createElement('tr');
tr33=document.createElement('tr');
tr34=document.createElement('tr');
tr35=document.createElement('tr');
tr36=document.createElement('tr');
tr37=document.createElement('tr');
tr38=document.createElement('tr');
tr39=document.createElement('tr');

alltype=document.createElement('input');
alltype.className='type';
alltype.value='All';
alltype.checked='yes';
alltypetext=document.createElement('a');
alltypetext.innerHTML='All';

tv=document.createElement('input');
tv.className='type';
tv.value='TV';
tvtext=document.createElement('a');
tvtext.innerHTML='TV';

movie=document.createElement('input');
movie.className='type';
movie.value='Movie';
movietext=document.createElement('a');
movietext.innerHTML='Movie';

ova=document.createElement('input');
ova.className='type';
ova.value='OVA';
ovatext=document.createElement('a');
ovatext.innerHTML='OVA';

ona=document.createElement('input');
ona.className='type';
ona.value='ONA';
onatext=document.createElement('a');
onatext.innerHTML='ONA';

special=document.createElement('input');
special.className='type';
special.value='Special';
specialtext=document.createElement('a');
specialtext.innerHTML='Special';

music=document.createElement('input');
music.className='type';
music.value='Music';
musictext=document.createElement('a');
musictext.innerHTML='Music';

/*unknown=document.createElement('input');
unknown.className='type';
unknown.value=' ';
unknowntext=document.createElement('a');
unknowntext.innerHTML='Empty';*/


menutype=document.createElement('select');
menutype.id='select';

select=document.createElement('option');
select.value='1';
select.selected='selected';
select.innerHTML='Select';

remove=document.createElement('option');
remove.value='0';
remove.innerHTML='Remove';


allscore=document.createElement('input');
allscore.className='score';
allscore.value='All';
allscore.checked='yes';
allscoretext=document.createElement('a');
allscoretext.innerHTML='All';

score10=document.createElement('input');
score10.className='score';
score10.value='10';
score10text=document.createElement('a');
score10text.innerHTML='10';

score9=document.createElement('input');
score9.className='score';
score9.value='9';
score9text=document.createElement('a');
score9text.innerHTML='9';

score8=document.createElement('input');
score8.className='score';
score8.value='8';
score8text=document.createElement('a');
score8text.innerHTML='8';

score7=document.createElement('input');
score7.className='score';
score7.value='7';
score7text=document.createElement('a');
score7text.innerHTML='7';

score6=document.createElement('input');
score6.className='score';
score6.value='6';
score6text=document.createElement('a');
score6text.innerHTML='6';

score5=document.createElement('input');
score5.className='score';
score5.value='5';
score5text=document.createElement('a');
score5text.innerHTML='5';

score4=document.createElement('input');
score4.className='score';
score4.value='4';
score4text=document.createElement('a');
score4text.innerHTML='4';

score3=document.createElement('input');
score3.className='score';
score3.value='3';
score3text=document.createElement('a');
score3text.innerHTML='3';

score2=document.createElement('input');
score2.className='score';
score2.value='2';
score2text=document.createElement('a');
score2text.innerHTML='2';

score1=document.createElement('input');
score1.className='score';
score1.value='1';
score1text=document.createElement('a');
score1text.innerHTML='1';

scorenull=document.createElement('input');
scorenull.className='score';
scorenull.value='-';
scorenulltext=document.createElement('a');
scorenulltext.innerHTML='-';


menuscore=document.createElement('select');
menuscore.id='equal';

equal=document.createElement('option');
equal.value='0';
equal.selected='selected';
equal.innerHTML='Equal to';

notequal=document.createElement('option');
notequal.value='1';
notequal.innerHTML='Not equal to';

greater=document.createElement('option');
greater.value='2';
greater.innerHTML='Greater than';

smaller=document.createElement('option');
smaller.value='3';
smaller.innerHTML='Smaller than';

choose=document.createElement('option');
choose.value='4';
choose.id='choose';
choose.innerHTML='Choose range';


namee=document.createElement('input');
namee.id='name';
namee.type='text';
namee.style.width='80px';
namee.value=enterTitle;

allprogress=document.createElement('input');
allprogress.className='progress';
allprogress.value='All';
allprogress.checked='yes';
allprogresstext=document.createElement('a');
allprogresstext.innerHTML='Range';

short=document.createElement('input');
short.className='progress';
short.value='1-24';
shorttext=document.createElement('a');
shorttext.innerHTML='Short';

medium=document.createElement('input');
medium.className='progress';
medium.value='25-49';
mediumtext=document.createElement('a');
mediumtext.innerHTML='Medium';

long=document.createElement('input');
long.className='progress';
long.value='50-99';
longtext=document.createElement('a');
longtext.innerHTML='Long';

infinite=document.createElement('input');
infinite.className='progress';
infinite.value='100-10000';
infinitetext=document.createElement('a');
infinitetext.innerHTML='Infinite';


allairing=document.createElement('input');
allairing.className='airing';
allairing.value='All';
allairing.checked='yes';
allairingtext=document.createElement('a');
allairingtext.innerHTML='All';

airingt=document.createElement('input');
airingt.className='airing';
airingt.value='Airing';
airingt.checked = 'yes';
airingtext=document.createElement('a');
airingtext.innerHTML='Airing';

notairing=document.createElement('input');
notairing.className='airing';
notairing.value='Finished';
notairing.checked = 'yes';
notairingtext=document.createElement('a');
notairingtext.innerHTML='Finished';

notyetaired=document.createElement('input');
notyetaired.className='airing';
notyetaired.value='Not Yet Aired';
notyetaired.checked = 'yes';
notyetairedtext=document.createElement('a');
notyetairedtext.innerHTML='Not Yet Aired';


allrating=document.createElement('input');
allrating.className='rating';
allrating.value='All';
allrating.checked='yes';
allratingtext=document.createElement('a');
allratingtext.innerHTML='All';

grating=document.createElement('input');
grating.className='rating';
grating.value='G';
gratingtext=document.createElement('a');
gratingtext.innerHTML='G';

pgrating=document.createElement('input');
pgrating.className='rating';
pgrating.value='PG';
pgratingtext=document.createElement('a');
pgratingtext.innerHTML='PG';

pg13rating=document.createElement('input');
pg13rating.className='rating';
pg13rating.value='PG-13';
pg13ratingtext=document.createElement('a');
pg13ratingtext.innerHTML='PG-13';

rrating=document.createElement('input');
rrating.className='rating';
rrating.value='R';
rratingtext=document.createElement('a');
rratingtext.innerHTML='R';

rprating=document.createElement('input');
rprating.className='rating';
rprating.value='R\\+';
rpratingtext=document.createElement('a');
rpratingtext.innerHTML='R+';

rxrating=document.createElement('input');
rxrating.className='rating';
rxrating.value='Rx';
rxratingtext=document.createElement('a');
rxratingtext.innerHTML='Rx';

/*unknownrating=document.createElement('input');
unknownrating.className='rating';
unknownrating.value=' ';
unknownratingtext=document.createElement('a');
unknownratingtext.innerHTML='Empty';*/

menurating=document.createElement('select');
menurating.id='ratselect';

ratselect=document.createElement('option');
ratselect.value='1';
ratselect.selected='selected';
ratselect.innerHTML='Select';

ratremove=document.createElement('option');
ratremove.value='0';
ratremove.innerHTML='Remove';

document.body.appendChild(table);
table.appendChild(type);
type.appendChild(headtype);
    headtype.appendChild(imagetype);
type.appendChild(divtype);
divtype.appendChild(tr27);
    tr27.appendChild(menutype);
        menutype.appendChild(select);
        menutype.appendChild(remove);
divtype.appendChild(tr16);
    tr16.appendChild(alltype);
    tr16.appendChild(alltypetext);
divtype.appendChild(tr1);
    tr1.appendChild(tv);
    tr1.appendChild(tvtext);
divtype.appendChild(tr2);
    tr2.appendChild(movie);
    tr2.appendChild(movietext);
divtype.appendChild(tr3);
    tr3.appendChild(ova);
    tr3.appendChild(ovatext);
divtype.appendChild(tr23);
    tr23.appendChild(ona);
    tr23.appendChild(onatext);
divtype.appendChild(tr4);
    tr4.appendChild(special);
    tr4.appendChild(specialtext);
divtype.appendChild(tr38);
    tr38.appendChild(music);
    tr38.appendChild(musictext);
/*divtype.appendChild(tr24);
    tr24.appendChild(unknown);
    tr24.appendChild(unknowntext);*/

document.body.appendChild(table2);
table2.appendChild(score);
score.appendChild(headscore);
    headscore.appendChild(imagescore);
score.appendChild(divscore);
divscore.appendChild(tr28);
    tr28.appendChild(menuscore);
        menuscore.appendChild(equal);
        menuscore.appendChild(notequal);
        menuscore.appendChild(greater);
        menuscore.appendChild(smaller);
        menuscore.appendChild(choose);
divscore.appendChild(tr17);
    tr17.appendChild(allscore);
    tr17.appendChild(allscoretext);
divscore.appendChild(tr5);
    tr5.appendChild(score10);
    tr5.appendChild(score10text);
divscore.appendChild(tr6);
    tr6.appendChild(score9);
    tr6.appendChild(score9text);
divscore.appendChild(tr7);
    tr7.appendChild(score8);
    tr7.appendChild(score8text);
divscore.appendChild(tr8);
    tr8.appendChild(score7);
    tr8.appendChild(score7text);
divscore.appendChild(tr9);
    tr9.appendChild(score6);
    tr9.appendChild(score6text);
divscore.appendChild(tr10);
    tr10.appendChild(score5);
    tr10.appendChild(score5text);
divscore.appendChild(tr11);
    tr11.appendChild(score4);
    tr11.appendChild(score4text);
divscore.appendChild(tr12);
    tr12.appendChild(score3);
    tr12.appendChild(score3text);
divscore.appendChild(tr13);
    tr13.appendChild(score2);
    tr13.appendChild(score2text);
divscore.appendChild(tr14);
    tr14.appendChild(score1);
    tr14.appendChild(score1text);
divscore.appendChild(tr15);
    tr15.appendChild(scorenull);
    tr15.appendChild(scorenulltext);

document.body.appendChild(table3);
table3.appendChild(progress);
progress.appendChild(headprogress);
    headprogress.appendChild(imageprogress);
progress.appendChild(divprogress);
divprogress.appendChild(tr29);
    tr29.appendChild(namee);
divprogress.appendChild(tr18);
    tr18.appendChild(allprogress);
    tr18.appendChild(allprogresstext);
divprogress.appendChild(tr19);
    tr19.appendChild(short);
    tr19.appendChild(shorttext);
divprogress.appendChild(tr20);
    tr20.appendChild(medium);
    tr20.appendChild(mediumtext);
divprogress.appendChild(tr21);
    tr21.appendChild(long);
    tr21.appendChild(longtext);
divprogress.appendChild(tr22);
    tr22.appendChild(infinite);
    tr22.appendChild(infinitetext);

document.body.appendChild(table4);
table4.appendChild(airing);
airing.appendChild(headairing);
    headairing.appendChild(imageairing);
airing.appendChild(divairing);
/*divairing.appendChild(tr24);
    tr24.appendChild(allairing);
    tr24.appendChild(allairingtext);*/
divairing.appendChild(tr25);
    tr25.appendChild(airingt);
    tr25.appendChild(airingtext);
divairing.appendChild(tr26);
    tr26.appendChild(notairing);
    tr26.appendChild(notairingtext);
divairing.appendChild(tr39);
    tr39.appendChild(notyetaired);
    tr39.appendChild(notyetairedtext);

document.body.appendChild(table5);
table5.appendChild(rating);
rating.appendChild(headrating);
    headrating.appendChild(imagerating);
rating.appendChild(divrating);
divrating.appendChild(tr30);
    tr30.appendChild(menurating);
        menurating.appendChild(ratselect);
        menurating.appendChild(ratremove);
divrating.appendChild(tr31);
    tr31.appendChild(allrating);
    tr31.appendChild(allratingtext);
divrating.appendChild(tr32);
    tr32.appendChild(grating);
    tr32.appendChild(gratingtext);
divrating.appendChild(tr33);
    tr33.appendChild(pgrating);
    tr33.appendChild(pgratingtext);
divrating.appendChild(tr34);
    tr34.appendChild(pg13rating);
    tr34.appendChild(pg13ratingtext);
divrating.appendChild(tr35);
    tr35.appendChild(rrating);
    tr35.appendChild(rratingtext);
divrating.appendChild(tr36);
    tr36.appendChild(rprating);
    tr36.appendChild(rpratingtext);
divrating.appendChild(tr37);
    tr37.appendChild(rxrating);
    tr37.appendChild(rxratingtext);
/*divrating.appendChild(tr24);
    tr24.appendChild(unknownrating);
    tr24.appendChild(unknownratingtext);*/


$(".drag").css({"position":"fixed","top":"100px","background":"white","opacity":"0.7","padding":"10px","borderRadius":"10px"});
$(".group_header").css({"font-size":"14pt","font-family":"Verdana, Arial, sans-serif","font-weight":"normal","color":"black"});
table3.style.top='325px';
table4.style.top='465px';
table5.style.top='510px';
// Load saved position (if present)
function loadPos (ID) {
    leftX = GM_getValue(ID + '.left');
    topY = GM_getValue(ID + '.top');
    if(leftX != null) {
        document.getElementById(ID).style.left = leftX;
        document.getElementById(ID).style.right = '';
    }
    if(topY != null) {
        document.getElementById(ID).style.top = topY;
    }
}
loadPos('type');
loadPos('score');
loadPos('progress');
loadPos('airing');
loadPos('rating');
$(".td a").css({"color":"black"});
$(".type").attr({type:"radio",name:"group1"});
$(".score").attr({type:"radio",name:"group2"});
$(".progress").attr({type:"radio",name:"group3"});
$(".airing").attr({type:"checkbox",name:"group4"});
$(".select").attr({type:"radio",name:"group5"});
$(".equal").attr({type:"radio",name:"group6"});
$(".rating").attr({type:"radio",name:"group7"});

function loadValue(defaultValue, value, tableValue) {
    if ( $(tableValue).is(':visible') ) {
        loaded = GM_getValue(value);
        if(loaded != null) {
            return loaded;
        } else {
            return defaultValue;
        }
    } else {
            return defaultValue;
    }
}
function loadState(value, classVal)
{
    var allInputs = document.getElementsByTagName("input");
    for(var x=0; x < allInputs.length; x++) {
        if((allInputs[x].value == value) && (allInputs[x].className == classVal)) {
            var byValue = allInputs[x];
        }
    }
    $(byValue).prop('checked', true);
}