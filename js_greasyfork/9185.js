// ==UserScript==
// @name          Number 1 Enhancer
// @namespace     FaxCelestis
// @description   Highlights, rearranges, and adds context to Number One stuff
// @include       *animecubed.com/billy/bvs/numberone.h*
// @grant         GM_addStyle
// @author        FaxCelestis
// @version       1.2o
// 1.0 - highlights tier and match info
// 1.0g - highlights username in expanded tournaments
// 1.0i - reorganizes tourney tables, prettifies milling box
// 1.0j - suppresses turn-in boxes if you have too few tickets, adds take actions link to page top, compresses rules box
// 1.0k - adds wins and losses to current tourneys table
// 1.1 - removes extraneous pending skirmish line as it always returns 0, adds score differential to top 11 scorebox, minor bugfix
// 1.1a - moves the collapsed rulebox to balance vertical real estate
// 1.1b - minor bugfix to prevent browser crash on viewing replays
// 1.1c - moves (really rewrites) the Top 11 table to above the ticket purchase box
// 1.1d - whoops! Script no longer suppresses daily rewards for top 11
// 1.1e - adds current ticket counts to milling box
// 1.1f - adds inline ranking notes to the top 11
// 1.1g - pass through validator and beautifier, general cleanup, likely final touches unless something new comes along
// 1.1h - fixes an issue with a player having a space in their name
// 1.1i - fixes an issue with a player on the score chart having a negative score
// 1.1j - fixes an issue with top 3 and top 1 player rewards
// 1.2 - brings script current with 4.28.15 changes
// 1.2a - fixes issue with top player rewards created by the old fix. Whoops.
// 1.2b - no changes, just forcing an update due to bad copypasta on 1.2a
// 1.2c - adds icons to powers
// 1.2d - highlights on round 9, fixes an issue with one day remaining on scoreboard reset
// 1.2e - formatting change on inline rank annotations to reduce possible table stretching
// 1.2f - It's a secret to everybody!
// 1.2g - Alphabet soup reduction
// 1.2h - backing out 1.2g due to responses, fixing some minor issues with prepped tourneys
// 1.2i - minor edits
// 1.2j - removes extraneous Doubletime notifications, ongoing tourneys table now includes 0-0 entries (started tournaments where the first round has not completed)
// 1.2k - Firefox/regex fixes
// 1.2l - support for Tier 3+ Tourneys
// 1.2m - repairs erroneous "Tier 7" appearance on N1 page
// 1.2n - fixes an error where the ongoing tourneys table would fail to redraw if the top item in the list was a T3+ tourney
// 1.2o - brings script current with 9.29.15 changes

// @downloadURL https://update.greasyfork.org/scripts/9185/Number%201%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/9185/Number%201%20Enhancer.meta.js
// ==/UserScript==
var player = document.getElementsByName("player")[1].value;

function highlight() {
    document.body.innerHTML = document.body.innerHTML.replace(/3\+ Tourney/g, 'Tier 3+ Tourney');
    document.body.innerHTML = document.body.innerHTML.replace(/Tier 7/g, 'Tier 3+');
    document.body.innerHTML = document.body.innerHTML.replace(/color:red\">Tier 1 Event/g, 'color:white\"><span style=\"background-color:red\">Tier 1 Event<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/color:red\">Tier 2 Event/g, 'color:black\"><span style=\"background-color:orange\">Tier 2 Event<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/color:red\">Tier 3 Event/g, 'color:black\"><span style=\"background-color:yellow\">Tier 3 Event<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/color:red\">Tier 4 Event/g, 'color:black\"><span style=\"background-color:green\">Tier 4 Event<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/color:red\">Tier 5 Event/g, 'color:white\"><span style=\"background-color:blue\">Tier 5 Event<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/color:red\">Tier 11 Event/g, 'color:white\"><span style=\"background-color:purple\">Tier 11 Event<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/color:red\">Tier 3\+ Event/g, 'color:white\"><span style=\"background-color:black\">Tier 3+ Event<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Round 9/g, '<b><span style=\"color:black;background-color:orange\">Round 9<\/span><br><span style=\"font-size:0.5em\">(HP drain starts<br>next round!)</span>');
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Round 10/g, '<b><span style=\"color:white;background-color:red\">Round 10<\/span><br><span style=\"font-size:0.5em\">(-1 HP per turn!)</span>');
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Round 11/g, '<b><span style=\"color:white;background-color:red\">Round 11<\/span><br><span style=\"font-size:0.5em\">(-1 HP per turn!)</span>');
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Round 12/g, '<b><span style=\"color:white;background-color:red\">Round 12<\/span><br><span style=\"font-size:0.5em\">(-1 HP per turn!)</span>');
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Round 13/g, '<b><span style=\"color:white;background-color:red\">Round 13<\/span><br><span style=\"font-size:0.5em\">(-1 HP per turn!)</span>');
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Round 14/g, '<b><span style=\"color:white;background-color:red\">Round 14<\/span><br><span style=\"font-size:0.5em\">(-1 HP per turn!)</span>');
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Round 15/g, '<b><span style=\"color:white;background-color:red\">Round 15<\/span><br><span style=\"font-size:0.5em\">(-1 HP per turn!)</span>');
    document.body.innerHTML = document.body.innerHTML.replace(/Battle 1/g, '<span style=\"font-variant:small-caps;color:red\">Battle 1<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/Battle 2/g, '<span style=\"font-variant:small-caps;color:red\">Battle 2<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/Battle 3/g, '<span style=\"font-variant:small-caps;color:red\">Battle 3<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/Battle 4/g, '<span style=\"font-variant:small-caps;color:red\">Battle 4<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/Final Battle!/g, '<span style=\"font-variant:small-caps;color:red\">Final Battle!<\/span>');
    document.body.innerHTML = document.body.innerHTML.replace(/Final Battle!/g, '<span style=\"font-variant:small-caps;color:red\">Final Battle!<\/span>');
    document.body.innerHTML = document.body.innerHTML.split('<td>' + player + '<\/td>').join('<td><span style=\"color:black;background-color:yellow\">' + player + '<\/span><\/td>');
    document.body.innerHTML = document.body.innerHTML.split('<strike>' + player + '<\/strike>').join('<strike><span style=\"color:white;background-color:red\">' + player + '<\/span><\/strike>');
    document.body.innerHTML = document.body.innerHTML.split('<b>' + player + '<\/b>').join('<b><span style=\"color:white;background-color:green\">' + player + '<\/span><\/b>');
    document.body.innerHTML = document.body.innerHTML.split(/<font style=\"font-size:[\d]+px\">Doubletime!<\/font><[B|b]r>/g).join('');
}

function moveRules() {
    document.body.innerHTML = document.body.innerHTML.replace(/<center><font style=\"font-size:12px"><i>Why not pop[\s\S]+11DBHK/g, " ");

    document.body.innerHTML = document.body.innerHTML.replace(/Contract Matches<\/b><\/a>/g, "Contract Matches<\/b><\/a><center><font style=\"font-size:12px\"><i>Why not pop the Party House Chat?<br>Just click the \"+\" in the chatbox!<\/i><\/font><\/center><hr><font style=\"font-size:12px\"><B>Number One Rules<\/b>:<br>You vs. 1 other player.<br><br>You start with 1 bullet and 5 HP. Your three actions are <b>Reload<\/b> (gain 1 bullet, max 6), <b>Block<\/b> (defend against a shot), and <b>Fire<\/b> (take a shot). If you Fire, you also pick the number of bullets you will use up.<br><br>If you Fire and your opponent Reloads, you win!<br><br>If you Fire and your opponent Blocks, they lose 1 HP for every bullet you fired past the first one (Fire 1, they lose 0 HP. Fire 3, they lose 2 HP. etc).<br><br>If someone's HP hits 0 or below, they lose! (if you both do at once, lower HP loses. Tied? It's a coin flip who wins!)<br><br>If you both Fire at the same time, whoever fired more bullets wins! (If tie, bullets are lost, nothing happens)<br><br>If you and your opponent ever both have 0 bullets, you each automatically reload - even in the middle of a 2nd Move!<br><br>Blocking when your opponent Blocks or Reloads is unsuccessful, and gives you 1 Fatigue. Successful Blocks, Reloads, and Firing wipes your Fatigue.<br><br>Ending a turn at 3 or more Fatigue costs 1 HP.<br><br>After 10 rounds, both players lose 1 HP per turn.<br><br>If you don't respond to a move in 36 hours, you lose.<br><br><b>Special Powers:<\/b><Br><i>Preparation:<\/i> You start with 1 extra bullet.<Br><i>Pierce:<\/i> Win ties when both players Fire.<br><i>Catch:<\/i> If you Block when your opponent Fires, you gain 1 bullet.<br><i>Aura:<\/i> Opponent starts with -2 HP.<br><hr>Once you enter your move, it\'ll either say \"Locked In\" (you are waiting for your Opponent to move) or it will show the results of your choices.<br><br>You can choose what you'll do next if you want, based on your opponent's action (This is the \"2nd Move\" area)<hr><b>Tourneys<\/b> let you fight your way to the top, getting unique BvS rewards!<br><br><b>Skirmishes<\/b> let you beat on people for fun.<br><br><b>AI tourneys<\/b> are 100% random - you autoplay until you win the tourney or fail. Skirmishes are random, always using 2nd Moves. All survival outcomes are re-entered immediately. No ranking change, no entry bonus.<br><br><b>Challenges<\/b> are 1\/day max against a specific player. Ryo is only taken if the challenge is accepted. Winner receives 95% of the take. No ranking change, no entry bonus.<br>Enjoy! -11DBHK");
}

function insert() {
    var actionable = (document.body.innerHTML.match(/Take Actions &gt;/g) || []).length;

    document.body.innerHTML = document.body.innerHTML.split(/<b>Number One Rules/g).join("<div style=\"overflow:auto;overflow-x:hidden;height:15em\" id=\"rules\"><B>Number One Rules<\/b>");
    document.body.innerHTML = document.body.innerHTML.split(/11DBHK <br><br>/gm).join("11DBHK <br><br><\/div>");

    document.body.innerHTML = document.body.innerHTML.replace(/<font style=\"font-size:12px\">Check for Grudges!<br>/gm, " "); //to fix a broken font tag

    if (actionable > 0) {
        document.body.innerHTML = document.body.innerHTML.split(/Your In-Progress Matches<\/b><br>/g).join("Your In-Progress Matches<\/b><br><a href=\"javascript:document.maction.submit();\" onfocus=\"this.blur();\" style=\"color:A10000;font-size:18px\"><b>Take Actions &gt;<\/b><\/a>");
    }
}

function rewritePrepTable() {
    document.body.innerHTML = document.body.innerHTML.replace(/&nbsp;/gm, " ");

    var ct1pi = (document.body.innerHTML.match(/Tier 1 Tournament \(Piercing\)/g) || []).length;
    var ct1pr = (document.body.innerHTML.match(/Tier 1 Tournament \(Preparation\)/g) || []).length;
    var ct1ca = (document.body.innerHTML.match(/Tier 1 Tournament \(Bullet Catch\)/g) || []).length;
    var ct1au = (document.body.innerHTML.match(/Tier 1 Tournament \(Aura\)/g) || []).length;
    var ct2pi = (document.body.innerHTML.match(/Tier 2 Tournament \(Piercing\)/g) || []).length;
    var ct2pr = (document.body.innerHTML.match(/Tier 2 Tournament \(Preparation\)/g) || []).length;
    var ct2ca = (document.body.innerHTML.match(/Tier 2 Tournament \(Bullet Catch\)/g) || []).length;
    var ct2au = (document.body.innerHTML.match(/Tier 2 Tournament \(Aura\)/g) || []).length;
    var ct3pi = (document.body.innerHTML.match(/Tier 3 Tournament \(Piercing\)/g) || []).length;
    var ct3pr = (document.body.innerHTML.match(/Tier 3 Tournament \(Preparation\)/g) || []).length;
    var ct3ca = (document.body.innerHTML.match(/Tier 3 Tournament \(Bullet Catch\)/g) || []).length;
    var ct3au = (document.body.innerHTML.match(/Tier 3 Tournament \(Aura\)/g) || []).length;
    var ct4pi = (document.body.innerHTML.match(/Tier 4 Tournament \(Piercing\)/g) || []).length;
    var ct4pr = (document.body.innerHTML.match(/Tier 4 Tournament \(Preparation\)/g) || []).length;
    var ct4ca = (document.body.innerHTML.match(/Tier 4 Tournament \(Bullet Catch\)/g) || []).length;
    var ct4au = (document.body.innerHTML.match(/Tier 4 Tournament \(Aura\)/g) || []).length;
    var ct5pi = (document.body.innerHTML.match(/Tier 5 Tournament \(Piercing\)/g) || []).length;
    var ct5pr = (document.body.innerHTML.match(/Tier 5 Tournament \(Preparation\)/g) || []).length;
    var ct5ca = (document.body.innerHTML.match(/Tier 5 Tournament \(Bullet Catch\)/g) || []).length;
    var ct5au = (document.body.innerHTML.match(/Tier 5 Tournament \(Aura\)/g) || []).length;
    var ct11pi = (document.body.innerHTML.match(/Tier 11 Tournament \(Piercing\)/g) || []).length;
    var ct11pr = (document.body.innerHTML.match(/Tier 11 Tournament \(Preparation\)/g) || []).length;
    var ct11ca = (document.body.innerHTML.match(/Tier 11 Tournament \(Bullet Catch\)/g) || []).length;
    var ct11au = (document.body.innerHTML.match(/Tier 11 Tournament \(Aura\)/g) || []).length;
    var ct3ppi = (document.body.innerHTML.match(/Tier 3\+ Tournament \(Piercing\)/g) || []).length;
    var ct3ppr = (document.body.innerHTML.match(/Tier 3\+ Tournament \(Preparation\)/g) || []).length;
    var ct3pca = (document.body.innerHTML.match(/Tier 3\+ Tournament \(Bullet Catch\)/g) || []).length;
    var ct3pau = (document.body.innerHTML.match(/Tier 3\+ Tournament \(Aura\)/g) || []).length;
    // var cspi = (document.body.innerHTML.match(/Skirmish \(Piercing\)/g) || []).length;
    // var cspr = (document.body.innerHTML.match(/Skirmish \(Preparation\)/g) || []).length;
    // var csca = (document.body.innerHTML.match(/Skirmish \(Bullet Catch\)/g) || []).length;

    document.body.innerHTML = document.body.innerHTML.replace(/^Tier[\s\S]+<br><font/m, "<b><u>Tourney Tier<\/b><\/u><\/th><th width=\"80\"><u>Piercing<\/u><br><img src=http://i.imgur.com/9SWyKxQ.png?2><\/th><th width=\"80\"><u>Preparation<\/u><br><img src=http://i.imgur.com/xEtIW5w.png?2><\/th><th width=\"80\"><u>Bullet Catch<\/u><br><img src=http://i.imgur.com/ye6Jv6e.png?1><\/th><th width=\"80\"><u>Aura<\/u><br><img src=http://i.imgur.com/YmiJlyC.png?2><\/th><\/tr><tr><td align=center><b><span style=\"color:white;background-color:red\">Tier 1<\/span><\/b><\/td><td align=center>" + ct1pi + "<\/td><td align=center>" + ct1pr + "<\/td><td align=center>" + ct1ca + "<\/td><td align=center>" + ct1au + "<\/td><\/tr><tr><td align=center><b><span style=\"background-color:orange\">Tier 2<\/span><\/b><\/td><td align=center>" + ct2pi + "<\/td><td align=center>" + ct2pr + "<\/td><td align=center>" + ct2ca + "<\/td><td align=center>" + ct2au + "<\/td><\/tr><tr><td align=center><b><span style=\"background-color:yellow\">Tier 3<\/span><\/b><\/td><td align=center>" + ct3pi + "<\/td><td align=center>" + ct3pr + "<\/td><td align=center>" + ct3ca + "<\/td><td align=center>" + ct3au + "<\/td><\/tr><tr><td align=center><b><span style=\"background-color:green\">Tier 4<\/span><\/b><\/td><td align=center>" + ct4pi + "<\/td><td align=center>" + ct4pr + "<\/td><td align=center>" + ct4ca + "<\/td><td align=center>" + ct4au + "<\/td><\/tr><tr><td align=center><b><span style=\"color:white;background-color:blue\">Tier 5<\/span><\/b><\/td><td align=center>" + ct5pi + "<\/td><td align=center>" + ct5pr + "<\/td><td align=center>" + ct5ca + "<\/td><td align=center>" + ct5au + "<\/td><\/tr><tr><td align=center><b><span style=\"color:white;background-color:purple\">Tier 11<\/span><\/b><\/td><td align=center>" + ct11pi + "<\/td><td align=center>" + ct11pr + "<\/td><td align=center>" + ct11ca + "<\/td><td align=center>" + ct11au + "<\/td><\/tr><tr><td align=center><b><span style=\"color:white;background-color:black\">Tier 3+<\/span><\/b><\/td><td align=center>" + ct3ppi + "<\/td><td align=center>" + ct3ppr + "<\/td><td align=center>" + ct3pca + "<\/td><td align=center>" + ct3pau + "<\/td><\/tr><\/table><br><font");
}

function rewriteOngoingTable() {
    var ct130 = (document.body.innerHTML.match(/Tier 1 \(3\-0\)/g) || []).length;
    var ct121 = (document.body.innerHTML.match(/Tier 1 \(2\-1\)/g) || []).length;
    var ct112 = (document.body.innerHTML.match(/Tier 1 \(1\-2\)/g) || []).length;
    var ct120 = (document.body.innerHTML.match(/Tier 1 \(2\-0\)/g) || []).length;
    var ct111 = (document.body.innerHTML.match(/Tier 1 \(1\-1\)/g) || []).length;
    var ct102 = (document.body.innerHTML.match(/Tier 1 \(0\-2\)/g) || []).length;
    var ct110 = (document.body.innerHTML.match(/Tier 1 \(1\-0\)/g) || []).length;
    var ct101 = (document.body.innerHTML.match(/Tier 1 \(0\-1\)/g) || []).length;
    var ct100 = (document.body.innerHTML.match(/Tier 1 \(0\-0\)/g) || []).length;

    var ct230 = (document.body.innerHTML.match(/Tier 2 \(3\-0\)/g) || []).length;
    var ct221 = (document.body.innerHTML.match(/Tier 2 \(2\-1\)/g) || []).length;
    var ct212 = (document.body.innerHTML.match(/Tier 2 \(1\-2\)/g) || []).length;
    var ct220 = (document.body.innerHTML.match(/Tier 2 \(2\-0\)/g) || []).length;
    var ct211 = (document.body.innerHTML.match(/Tier 2 \(1\-1\)/g) || []).length;
    var ct202 = (document.body.innerHTML.match(/Tier 2 \(0\-2\)/g) || []).length;
    var ct210 = (document.body.innerHTML.match(/Tier 2 \(1\-0\)/g) || []).length;
    var ct201 = (document.body.innerHTML.match(/Tier 2 \(0\-1\)/g) || []).length;
    var ct200 = (document.body.innerHTML.match(/Tier 2 \(0\-0\)/g) || []).length;

    var ct330 = (document.body.innerHTML.match(/Tier 3 \(3\-0\)/g) || []).length;
    var ct321 = (document.body.innerHTML.match(/Tier 3 \(2\-1\)/g) || []).length;
    var ct312 = (document.body.innerHTML.match(/Tier 3 \(1\-2\)/g) || []).length;
    var ct320 = (document.body.innerHTML.match(/Tier 3 \(2\-0\)/g) || []).length;
    var ct311 = (document.body.innerHTML.match(/Tier 3 \(1\-1\)/g) || []).length;
    var ct302 = (document.body.innerHTML.match(/Tier 3 \(0\-2\)/g) || []).length;
    var ct310 = (document.body.innerHTML.match(/Tier 3 \(1\-0\)/g) || []).length;
    var ct301 = (document.body.innerHTML.match(/Tier 3 \(0\-1\)/g) || []).length;
    var ct300 = (document.body.innerHTML.match(/Tier 3 \(0\-0\)/g) || []).length;

    var ct430 = (document.body.innerHTML.match(/Tier 4 \(3\-0\)/g) || []).length;
    var ct421 = (document.body.innerHTML.match(/Tier 4 \(2\-1\)/g) || []).length;
    var ct412 = (document.body.innerHTML.match(/Tier 4 \(1\-2\)/g) || []).length;
    var ct420 = (document.body.innerHTML.match(/Tier 4 \(2\-0\)/g) || []).length;
    var ct411 = (document.body.innerHTML.match(/Tier 4 \(1\-1\)/g) || []).length;
    var ct402 = (document.body.innerHTML.match(/Tier 4 \(0\-2\)/g) || []).length;
    var ct410 = (document.body.innerHTML.match(/Tier 4 \(1\-0\)/g) || []).length;
    var ct401 = (document.body.innerHTML.match(/Tier 4 \(0\-1\)/g) || []).length;
    var ct400 = (document.body.innerHTML.match(/Tier 4 \(0\-0\)/g) || []).length;

    var ct530 = (document.body.innerHTML.match(/Tier 5 \(3\-0\)/g) || []).length;
    var ct521 = (document.body.innerHTML.match(/Tier 5 \(2\-1\)/g) || []).length;
    var ct512 = (document.body.innerHTML.match(/Tier 5 \(1\-2\)/g) || []).length;
    var ct520 = (document.body.innerHTML.match(/Tier 5 \(2\-0\)/g) || []).length;
    var ct511 = (document.body.innerHTML.match(/Tier 5 \(1\-1\)/g) || []).length;
    var ct502 = (document.body.innerHTML.match(/Tier 5 \(0\-2\)/g) || []).length;
    var ct510 = (document.body.innerHTML.match(/Tier 5 \(1\-0\)/g) || []).length;
    var ct501 = (document.body.innerHTML.match(/Tier 5 \(0\-1\)/g) || []).length;
    var ct500 = (document.body.innerHTML.match(/Tier 5 \(0\-0\)/g) || []).length;

    var ct1130 = (document.body.innerHTML.match(/Tier 11 \(3\-0\)/g) || []).length;
    var ct1121 = (document.body.innerHTML.match(/Tier 11 \(2\-1\)/g) || []).length;
    var ct1112 = (document.body.innerHTML.match(/Tier 11 \(1\-2\)/g) || []).length;
    var ct1120 = (document.body.innerHTML.match(/Tier 11 \(2\-0\)/g) || []).length;
    var ct1111 = (document.body.innerHTML.match(/Tier 11 \(1\-1\)/g) || []).length;
    var ct1102 = (document.body.innerHTML.match(/Tier 11 \(0\-2\)/g) || []).length;
    var ct1110 = (document.body.innerHTML.match(/Tier 11 \(1\-0\)/g) || []).length;
    var ct1101 = (document.body.innerHTML.match(/Tier 11 \(0\-1\)/g) || []).length;
    var ct1100 = (document.body.innerHTML.match(/Tier 11 \(0\-0\)/g) || []).length;


    var ct3p40 = (document.body.innerHTML.match(/Tier 3\+ \(4\-0\)/g) || []).length;
    var ct3p31 = (document.body.innerHTML.match(/Tier 3\+ \(3\-1\)/g) || []).length;
    var ct3p22 = (document.body.innerHTML.match(/Tier 3\+ \(2\-2\)/g) || []).length;
    var ct3p30 = (document.body.innerHTML.match(/Tier 3\+ \(3\-0\)/g) || []).length;
    var ct3p21 = (document.body.innerHTML.match(/Tier 3\+ \(2\-1\)/g) || []).length;
    var ct3p12 = (document.body.innerHTML.match(/Tier 3\+ \(1\-2\)/g) || []).length;
    var ct3p20 = (document.body.innerHTML.match(/Tier 3\+ \(2\-0\)/g) || []).length;
    var ct3p11 = (document.body.innerHTML.match(/Tier 3\+ \(1\-1\)/g) || []).length;
    var ct3p02 = (document.body.innerHTML.match(/Tier 3\+ \(0\-2\)/g) || []).length;
    var ct3p10 = (document.body.innerHTML.match(/Tier 3\+ \(1\-0\)/g) || []).length;
    var ct3p01 = (document.body.innerHTML.match(/Tier 3\+ \(0\-1\)/g) || []).length;
    var ct3p00 = (document.body.innerHTML.match(/Tier 3\+ \(0\-0\)/g) || []).length;


    var wins = ((ct3p40 *4) + (ct130 + ct230 + ct330 + ct430 + ct530 + ct1130 + ct3p31 + ct3p30) * 3) + ((ct121 + ct120 + ct221 + ct220 + ct321 + ct320 + ct421 + ct420 + ct521 + ct520 + ct1121 + ct1120 + ct3p22 + ct3p21 + ct3p20) * 2) + ct112 + ct111 + ct110 + ct212 + ct211 + ct210 + ct312 + ct311 + ct310 + ct412 + ct411 + ct410 + ct512 + ct511 + ct510 + ct1112 + ct1111 + ct1110 + ct3p12 + ct3p11 + ct3p10;
    var losses = ((ct112 + ct102 + ct212 + ct202 + ct312 + ct302 + ct412 + ct402 + ct512 + ct502 + ct1112 + ct1102 + ct3p22 + ct3p12 + ct3p02) * 2) + ct121 + ct111 + ct101 + ct221 + ct211 + ct201 + ct321 + ct311 + ct301 + ct421 + ct411 + ct401 + ct521 + ct511 + ct501 + ct1121 + ct1111 + ct1101 + ct3p31 + ct3p21 + ct3p11 + ct3p01;
    var WR = (wins / (wins + losses)) * 100;
    WR = WR.toPrecision(4);
    var LR = (losses / (wins + losses)) * 100;
    LR = LR.toPrecision(4);

    var t1w = (ct130 * 3) + ((ct121 + ct120) * 2) + ct112 + ct111 + ct110;
    var t1l = ((ct112 + ct102) * 2) + ct121 + ct111 + ct101;
    if (t1w === 0) {
        var WR1 = 0;
    } else {
        var WR1 = (t1w / (t1w + t1l)) * 100;
        WR1 = WR1.toPrecision(3);
    }

    var t2w = (ct230 * 3) + ((ct221 + ct220) * 2) + ct212 + ct211 + ct210;
    var t2l = ((ct212 + ct202) * 2) + ct221 + ct211 + ct201;
    if (t2w === 0) {
        var WR2 = 0;
    } else {
        var WR2 = (t2w / (t2w + t2l)) * 100;
        WR2 = WR2.toPrecision(3);
    }

    var t3w = (ct330 * 3) + ((ct321 + ct320) * 2) + ct312 + ct311 + ct310;
    var t3l = ((ct312 + ct302) * 2) + ct321 + ct311 + ct301;
    if (t3w === 0) {
        var WR3 = 0;
    } else {
        var WR3 = (t3w / (t3w + t3l)) * 100;
        WR3 = WR3.toPrecision(3);
    }

    var t4w = (ct430 * 3) + ((ct421 + ct420) * 2) + ct412 + ct411 + ct410;
    var t4l = ((ct412 + ct402) * 2) + ct421 + ct411 + ct401;
    if (t4w === 0) {
        var WR4 = 0;
    } else {
        var WR4 = (t4w / (t4w + t4l)) * 100;
        WR4 = WR4.toPrecision(3);
    }

    var t5w = (ct530 * 3) + ((ct521 + ct520) * 2) + ct512 + ct511 + ct510;
    var t5l = ((ct512 + ct502) * 2) + ct521 + ct511 + ct501;
    if (t5w === 0) {
        var WR5 = 0;
    } else {
        var WR5 = (t5w / (t5w + t5l)) * 100;
        WR5 = WR5.toPrecision(3);
    }

    var t11w = (ct1130 * 3) + ((ct1121 + ct1120) * 2) + ct1112 + ct1111 + ct1110;
    var t11l = ((ct1112 + ct1102) * 2) + ct1121 + ct1111 + ct1101;
    if (t11w === 0) {
        var WR11 = 0;
    } else {
        var WR11 = (t11w / (t11w + t11l)) * 100;
        WR11 = WR11.toPrecision(3);
    }

    var t3pw = ((ct3p40 * 4) + ((ct3p30 + ct3p31) * 3) + ((ct3p22 + ct3p21 + ct3p20) * 2) + ct3p12 + ct3p11 + ct3p10);
    var t3pl = ((ct3p22 + ct3p12 + ct3p02) * 2) + ct3p31 + ct3p21 + ct3p11 + ct3p01;
    if (t3pw === 0) {
        var WR3p = 0;
    } else {
        var WR3p = (t3pw / (t3pw + t3pl)) * 100;
        WR3p = WR3p.toPrecision(3);
    }

    document.body.innerHTML = document.body.innerHTML.replace(/<b>Tournaments you are in<\/b>/g, "<b>Tournaments you are in <\/b><br><table border=\"0px\" width=\"80%\" style=\"font-size:12px\"><tr><td><b>Wins:<\/b><\/td><td>" + wins + "<\/td><td>(" + WR + "%)<\/td><td width=\"75%\"> <\/td><td align=\"right\"><b>Losses:<\/b><\/td><td align=\"right\">" + losses + "<\/td><td align=\"right\">(" + LR + "%)<\/td><\/tr><\/font><\/table>");

    document.body.innerHTML = document.body.innerHTML.replace(/^Tier (\S+) \(\d\-\d\).+/gm, "<tr><th align=center><u>Tourney Tier<\/u><\/th><th align=center><u>W:L<\/u><\/th><th><align=center><u>4-0<\/u><\/th><th><align=center><u>3-1<\/u><\/th><th><align=center><u>2-2<\/u><\/th><th><align=center><u>3-0<\/u><\/th><th align=center><u>2-1<\/u><\/th><th align=center><u>1-2<\/u><\/th><th align=center><u>2-0<\/u><\/th><th align=center><u>1-1<\/u><\/th><th align=center><u>0-2<\/u><\/th><th align=center><u>1-0<\/u><\/th><th align=center><u>0-1<\/u><\/th><th align=center><u>0-0<\/u><\/th><\/tr><tr><th align=center><span style=\"color:white;background-color:red\">Tier 1<\/span><\/th><td align=center>" + t1w + ":" + t1l + " (" + WR1 + "%)<\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center>" + ct130 + "<\/td><td align=center>" + ct121 + "<\/td><td align=center>" + ct112 + "<\/td><td align=center>" + ct120 + "<\/td><td align=center>" + ct111 + "<\/td><td align=center>" + ct102 + "<\/td><td align=center>" + ct110 + "<\/td><td align=center>" + ct101 + "<\/td><td align=center>" + ct100 + "<\/td><\/tr><tr><th align=center><span style=\"background-color:orange\">Tier 2<\/span><\/th><td align=center>" + t2w + ":" + t2l + " (" + WR2 + "%)<\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center>" + ct230 + "<\/td><td align=center>" + ct221 + "<\/td><td align=center>" + ct212 + "<\/td><td align=center>" + ct220 + "<\/td><td align=center>" + ct211 + "<\/td><td align=center>" + ct202 + "<\/td><td align=center>" + ct210 + "<\/td><td align=center>" + ct201 + "<\/td><td align=center>" + ct200 + "<\/td><\/tr><\/tr><tr><th align=center><span style=\"background-color:yellow\">Tier 3<\/span><\/th><td align=center>" + t3w + ":" + t3l + " (" + WR3 + "%)<\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center>" + ct330 + "<\/td><td align=center>" + ct321 + "<\/td><td align=center>" + ct312 + "<\/td><td align=center>" + ct320 + "<\/td><td align=center>" + ct311 + "<\/td><td align=center>" + ct302 + "<\/td><td align=center>" + ct310 + "<\/td><td align=center>" + ct301 + "<\/td><td align=center>" + ct300 + "<\/td><\/tr><\/tr><tr><th align=center><span style=\"background-color:green\">Tier 4<\/span><\/th><td align=center>" + t4w + ":" + t4l + " (" + WR4 + "%)<\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center>" + ct430 + "<\/td><td align=center>" + ct421 + "<\/td><td align=center>" + ct412 + "<\/td><td align=center>" + ct420 + "<\/td><td align=center>" + ct411 + "<\/td><td align=center>" + ct402 + "<\/td><td align=center>" + ct410 + "<\/td><td align=center>" + ct401 + "<\/td><td align=center>" + ct400 + "<\/td><\/tr><\/tr><tr><th align=center><span style=\"color:white;background-color:blue\">Tier 5<\/span><\/th><td align=center>" + t5w + ":" + t5l + " (" + WR5 + "%)<\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center>" + ct520 + "<\/td><td align=center>" + ct511 + "<\/td><td align=center>" + ct502 + "<\/td><td align=center>" + ct510 + "<\/td><td align=center>" + ct501 + "<\/td><td align=center>" + ct500 + "<\/td><\/tr><\/tr><tr><th align=center><span style=\"color:white;background-color:purple\">Tier 11<\/span><\/th><td align=center>" + t11w + ":" + t11l + " (" + WR11 + "%)<\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center> <\/td><td align=center>" + ct1110 + "<\/td><td align=center>" + ct1101 + "<\/td><td align=center>" + ct1100 + "<\/td><\/tr><\/tr><tr><th align=center><span style=\"color:white;background-color:black\">Tier 3+<\/span><\/th><td align=center>" + t3pw + ":" + t3pl + " (" + WR3p + "%)<\/td><td align=center>" + ct3p40 + "<\/td><td align=center>" + ct3p31 + "<\/td><td align=center>" + ct3p22 + "<\/td><td align=center>" + ct3p30 + "<\/td><td align=center>" + ct3p21 + "<\/td><td align=center>" + ct3p12 + "<\/td><td align=center>" + ct3p20 + "<\/td><td align=center>" + ct3p11 + "<\/td><td align=center>" + ct3p02 + "<\/td><td align=center>" + ct3p10 + "<\/td><td align=center>" + ct3p01 + "<\/td><td align=center>" + ct3p00 + "<\/td>");
}

function rewriteTicketTable() {
    var res1 = /Unredeemed Wins: (\d+)/.exec(document.body.innerHTML);
    var tix1 = parseInt(res1[1], 10);

    var res2 = /Unredeemed Participations: (\d+)/.exec(document.body.innerHTML);
    var part = parseInt(res2[1], 10);

    if (tix1 < 3) {
        document.body.innerHTML = document.body.innerHTML.replace(/Earn one whenever you win a fight!/g, "Not enough wins to redeem!");
        document.body.innerHTML = document.body.innerHTML.split(/<input type=\"checkbox\" name=\"mturninwins\" value=\"1\"> Turn in all Wins<br>/g).join(" ");
        document.body.innerHTML = document.body.innerHTML.split(/<a href=\"javascript:document.turninwins.submit\(\);\" onfocus=\"this.blur\(\);\" style=\"font-size:12px;color:A10000\"><b>Turn in Wins<br>\(3 \= 1 Tier 1 Ticket\) &gt;<\/b><\/a>/g).join(" ");
    }

    if (part < 5) {
        document.body.innerHTML = document.body.innerHTML.replace(/Earn one when you finish an entire match \(win or lose\)!/g, "Not enough participations to redeem!");
        document.body.innerHTML = document.body.innerHTML.split(/<input type=\"checkbox\" name=\"mturnindts\" value=\"1\"> Turn in all Participations<br>/g).join(" ");
        document.body.innerHTML = document.body.innerHTML.split(/<a href=\"javascript:document.turnindts.submit\(\);\" onfocus=\"this.blur\(\);\" style=\"font-size:12px;color:A10000\"><b>Turn in Participations<br>\(5 \= 1 Tier 1 Ticket\) &gt;<\/b><\/a>/g).join(" ");
    }
}

function rewriteTopEleven() {
    var reset = (document.body.innerHTML.match(/Days \'til Ranking reset: <b>([\d]+)/g) || []).length;
    var date = [];
    var days = [];

    if (reset > 0) {
        reset = /Days \'til Ranking reset: <b>([\d]+) ([\(\w\s\d\)]+)/.exec(document.body.innerHTML);
        days = reset[1];
        date = reset[2];
    } else {
        reset = /Days \'til Ranking reset: <b>([\w!]+)/.exec(document.body.innerHTML);
        days = reset[1];
        date = [];
    }

    var tx1 = /<td> #1 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n1 = tx1[1];
    var pl1 = parseInt(tx1[2], 10);

    var tx2 = /<td> #2 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n2 = tx2[1];
    var pl2 = parseInt(tx2[2], 10);

    var tx3 = /<td> #3 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n3 = tx3[1];
    var pl3 = parseInt(tx3[2], 10);

    var tx4 = /<td> #4 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n4 = tx4[1];
    var pl4 = parseInt(tx4[2], 10);

    var tx5 = /<td> #5 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n5 = tx5[1];
    var pl5 = parseInt(tx5[2], 10);

    var tx6 = /<td> #6 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n6 = tx6[1];
    var pl6 = parseInt(tx6[2], 10);

    var tx7 = /<td> #7 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n7 = tx7[1];
    var pl7 = parseInt(tx7[2], 10);

    var tx8 = /<td> #8 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n8 = tx8[1];
    var pl8 = parseInt(tx8[2], 10);

    var tx9 = /<td> #9 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n9 = tx9[1];
    var pl9 = parseInt(tx9[2], 10);

    var tx10 = /<td> #10 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n10 = tx10[1];
    var pl10 = parseInt(tx10[2], 10);

    var tx11 = /<td> #11 <\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
    var n11 = tx11[1];
    var pl11 = parseInt(tx11[2], 10);

    var nottop = (document.body.innerHTML.match(/<td>\.\./g) || []).length;
    if (nottop > 0) {
        var tx12 = /<td>\.\.<\/td><td> ([\w\s]+) <\/td><td> ([\+\-\d]+)/.exec(document.body.innerHTML);
        var n12 = tx12[1];
        var pl12 = parseInt(tx12[2], 10);
        var array1 = [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12];
        var array2 = [pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8, pl9, pl10, pl11, pl12];
    } else {
        var array1 = [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11];
        var array2 = [pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8, pl9, pl10, pl11];
    }

    var pos1 = array1.indexOf(player);
    var playerScore = array2.slice(pos1, pos1 + 1);

    var diff1 = (pl1 - playerScore);
    var diff2 = (pl2 - playerScore);
    var diff3 = (pl3 - playerScore);
    var diff4 = (pl4 - playerScore);
    var diff5 = (pl5 - playerScore);
    var diff6 = (pl6 - playerScore);
    var diff7 = (pl7 - playerScore);
    var diff8 = (pl8 - playerScore);
    var diff9 = (pl9 - playerScore);
    var diff10 = (pl10 - playerScore);
    var diff11 = (pl11 - playerScore);

    if (nottop > 0) {
        var diff12 = (pl12 - playerScore);
    } else {
        var diff12 = 0;
    }

    if (diff1 >= 0) {
        diff1 = "+" + diff1;
    }
    if (diff2 >= 0) {
        diff2 = "+" + diff2;
    }
    if (diff3 >= 0) {
        diff3 = "+" + diff3;
    }
    if (diff4 >= 0) {
        diff4 = "+" + diff4;
    }
    if (diff5 >= 0) {
        diff5 = "+" + diff5;
    }
    if (diff6 >= 0) {
        diff6 = "+" + diff6;
    }
    if (diff7 >= 0) {
        diff7 = "+" + diff7;
    }
    if (diff8 >= 0) {
        diff8 = "+" + diff8;
    }
    if (diff9 >= 0) {
        diff9 = "+" + diff9;
    }
    if (diff10 >= 0) {
        diff10 = "+" + diff10;
    }
    if (diff11 >= 0) {
        diff11 = "+" + diff11;
    }
    if (playerScore >= 0) {
        playerScore = "+" + playerScore;
    }

    document.body.innerHTML = document.body.innerHTML.replace(/Top Eleven/g, "<!-- Top Eleven");

    var reward1 = (document.body.innerHTML.match(/Top 11 Daily Reward/g) || []).length;
    var reward2 = (document.body.innerHTML.match(/Top 3 Daily Reward/g) || []).length;
    var reward3 = (document.body.innerHTML.match(/Top 1 Daily Reward/g) || []).length;

    if (reward1 > 0 || reward2 > 0 || reward3 > 0) {
        document.body.innerHTML = document.body.innerHTML.replace(/ <\/td><\/tr><tr><td colspan=/g, " <\/td><\/tr>--><tr><td colspan=");
    } else {
        document.body.innerHTML = document.body.innerHTML.replace(/Aim for the top!/g, "-->");
    }

    // inline rank notes for actionable battles -- now with more mouseover!
    document.body.innerHTML = document.body.innerHTML.split(">" + n1).join('><span title=\"1st\"><u>' + n1 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n2).join('><span title=\"2nd\"><u>' + n2 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n3).join('><span title=\"3rd\"><u>' + n3 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n4).join('><span title=\"4th\"><u>' + n4 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n5).join('><span title=\"5th\"><u>' + n5 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n6).join('><span title=\"6th\"><u>' + n6 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n7).join('><span title=\"7th\"><u>' + n7 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n8).join('><span title=\"8th\"><u>' + n8 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n9).join('><span title=\"9th\"><u>' + n9 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n10).join('><span title=\"10th\"><u>' + n10 + '</u></span>');
    document.body.innerHTML = document.body.innerHTML.split(">" + n11).join('><span title=\"11th\"><u>' + n11 + '</u></span>');

    //actually redraw the table
    document.body.innerHTML = document.body.innerHTML.replace(/<b>Get more Tier 1 Tickets!<\/b>/g, "<table bgcolor=000000 width=240 style=\"color:white\"><tr><td align=center colspan=4><b>Top Eleven</b><font style=\"font-size:12px\"><br>Days until Ranking reset: <b>" + days + " " + date + "<\/b><\/font><\/td><\/tr><tr bgcolor=006600 align=center><td>#1<\/td><td>" + n1 + "<\/td><td>+" + pl1 + "<\/td><td align=center>" + diff1 + "<\/td><\/tr><tr bgcolor=660000 align=center><td>#2<\/td><td>" + n2 + "<\/td><td>+" + pl2 + "<\/td><td>" + diff2 + "<\/td><\/tr><tr bgcolor=006666 align=center><td>#3<\/td><td>" + n3 + "<\/td><td>+" + pl3 + "<\/td><td>" + diff3 + "<\/td><\/tr><tr bgcolor=006600 align=center><td>#4<\/td><td>" + n4 + "<\/td><td>+" + pl4 + "<\/td><td>" + diff4 + "<\/td><\/tr><tr bgcolor=660000 align=center><td>#5<\/td><td>" + n5 + "<\/td><td>+" + pl5 + "<\/td><td>" + diff5 + "<\/td><\/tr><tr bgcolor=006666 align=center><td>#6<\/td><td>" + n6 + "<\/td><td>+" + pl6 + "<\/td><td>" + diff6 + "<\/td><\/tr><tr bgcolor=006600 align=center><td>#7<\/td><td>" + n7 + "<\/td><td>+" + pl7 + "<\/td><td>" + diff7 + "<\/td><\/tr><tr bgcolor=660000 align=center><td>#8<\/td><td>" + n8 + "<\/td><td>+" + pl8 + "<\/td><td>" + diff8 + "<\/td><\/tr><tr bgcolor=006666 align=center><td>#9<\/td><td>" + n9 + "<\/td><td>+" + pl9 + "<\/td><td>" + diff9 + "<\/td><\/tr><tr bgcolor=006600 align=center><td>#10<\/td><td>" + n10 + "<\/td><td>+" + pl10 + "<\/td><td>" + diff10 + "<\/td><\/tr><tr bgcolor=880000 align=center><td>#11<\/td><td>" + n11 + "<\/td><td>+" + pl11 + "<\/td><td>" + diff11 + "<\/td><\/tr><tr bgcolor=000000><td colspan=4> <\/td><\/tr><tr bgcolor=000066 align=center><td colspan=2><b>Your Score<\/b><\/td><td colspan=2><b>" + playerScore + "<\/b><\/td><\/tr><\/table><br><b>Get More Tier 1 Tickets<\/b>");

}

function fixMillBox() {
    var unusedSkirmishes = /Skirmishes joinable: ([\d]+)\. Left: ([\d]+)/.exec(document.body.innerHTML);
    unusedSkirmishes = parseInt(unusedSkirmishes[2], 10);

    var unusedTix = document.body.innerHTML.match(/Tickets available: <b><font color=\"FF0000\">([\d]+)/g);
    var unusedT1Tix = unusedTix.shift();
    unusedT1Tix = /\">([\d]+)/.exec(unusedT1Tix);
    unusedT1Tix = parseInt(unusedT1Tix[1], 10);

    var unusedT2Tix = unusedTix.shift();
    unusedT2Tix = /\">([\d]+)/.exec(unusedT2Tix);
    unusedT2Tix = parseInt(unusedT2Tix[1], 10);

    document.body.innerHTML = document.body.innerHTML.replace(/T1 Tickets<\/b> to mill:/g, "T1 Tickets<\/b> to mill (you have " + unusedT1Tix + "):<br>");

    document.body.innerHTML = document.body.innerHTML.replace(/Skirmishes<\/b>: <input/g, "Skirmishes<\/b> (you have " + unusedSkirmishes + "):<br><input ");

    document.body.innerHTML = document.body.innerHTML.replace(/T2 Tickets<\/b> to mill:/g, "T2 Tickets<\/b> to mill (you have " + unusedT2Tix + "):<br>");
}

function addIcons() {
    document.body.innerHTML = document.body.innerHTML.split("Power: Aura<hr>").join("<img src=http://i.imgur.com/YmiJlyC.png?2 title=Aura><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Catch<hr>").join("<img src=http://i.imgur.com/ye6Jv6e.png?1 title=Catch><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Pierce<hr>").join("<img src=http://i.imgur.com/9SWyKxQ.png?2 title=Pierce><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Prep<hr>").join("<img src=http://i.imgur.com/xEtIW5w.png?2 title=Prep><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Mirror<hr>").join("<img src=http://i.imgur.com/pzCwvhn.png?1 title=Mirror><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Nullify<hr>").join("<img src=http://i.imgur.com/IzSokOI.png?1 title=Nullify><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Tough<hr>").join("<img src=http://i.imgur.com/rKhqKLx.png?1 title=Tough><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Knife<hr>").join("<img src=http://i.imgur.com/UojlN0H.png?1 title=Knife><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Retributive<hr>").join("<img src=http://i.imgur.com/P91RA6o.png?1 title=Retributive><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Hasty<hr>").join("<img src=http://i.imgur.com/5QFCyU1.png?1 title=Hasty><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Triumphant<hr>").join("<img src=http://i.imgur.com/15MrRx8.png?1 title=Triumphant><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Quick Draw<hr>").join("<img src=http://i.imgur.com/5AMiFbk.png?1 title=Quick-Draw><hr>");
    document.body.innerHTML = document.body.innerHTML.split("Power: Payback<hr>").join("<img src=http://i.imgur.com/xVvvZPw.png?1 title=Payback><hr>");

/*

    document.body.innerHTML = document.body.innerHTML.split("HP: 5<br>").join("HP<br><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=64 title=5><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: 4<br>").join("HP<br><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=50 title=4><img src=http://i.imgur.com/JaPQBTi.gif height=12 width=12 title=4><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=2 title=4><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: 3<br>").join("HP<br><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=38 title=3><img src=http://i.imgur.com/JaPQBTi.gif height=12 width=24 title=3><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=2 title=3><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: 2<br>").join("HP<br><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=26 title=2><img src=http://i.imgur.com/JaPQBTi.gif height=12 width=36 title=2><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=2 title=2><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: 1<br>").join("HP<br><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=14 title=1><img src=http://i.imgur.com/JaPQBTi.gif height=12 width=48 title=1><img src=http://i.imgur.com/j3uy0Rm.gif height=12 width=2 title=1><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: 0<br>").join("HP<br><img src=http://i.imgur.com/DZW9PRh.png?1 height=12 width=12 title=Dead><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: -1<br>").join("HP<br><img src=http://i.imgur.com/DZW9PRh.png?1 height=12 width=12 title=Dead><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: -2<br>").join("HP<br><img src=http://i.imgur.com/DZW9PRh.png?1 height=12 width=12 title=Dead><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: -3<br>").join("HP<br><img src=http://i.imgur.com/DZW9PRh.png?1 height=12 width=12 title=Dead><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: -4<br>").join("HP<br><img src=http://i.imgur.com/DZW9PRh.png?1 height=12 width=12 title=Dead><br>");
    document.body.innerHTML = document.body.innerHTML.split("HP: -5<br>").join("HP<br><img src=http://i.imgur.com/DZW9PRh.png?1 height=12 width=12 title=Dead><br>");

    document.body.innerHTML = document.body.innerHTML.split("Ammo: 6<br>").join("Ammo<br><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=64 title=6><br>");
    document.body.innerHTML = document.body.innerHTML.split("Ammo: 5<br>").join("Ammo<br><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=54 title=5><img src=http://i.imgur.com/hwR0ZfR.png height=12 width=10 title=5><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=2 title=5><br>");
    document.body.innerHTML = document.body.innerHTML.split("Ammo: 4<br>").join("Ammo<br><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=44 title=4><img src=http://i.imgur.com/hwR0ZfR.png height=12 width=20 title=4><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=2 title=4><br>");
    document.body.innerHTML = document.body.innerHTML.split("Ammo: 3<br>").join("Ammo<br><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=33 title=3><img src=http://i.imgur.com/hwR0ZfR.png height=12 width=30 title=3><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=2 title=3><br>");
    document.body.innerHTML = document.body.innerHTML.split("Ammo: 2<br>").join("Ammo<br><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=23 title=2><img src=http://i.imgur.com/hwR0ZfR.png height=12 width=40 title=2><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=2 title=2><br>");
    document.body.innerHTML = document.body.innerHTML.split("Ammo: 1<br>").join("Ammo<br><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=13 title=1><img src=http://i.imgur.com/hwR0ZfR.png height=12 width=50 title=1><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=2 title=1><br>");
    document.body.innerHTML = document.body.innerHTML.split("Ammo: 0<br>").join("Ammo<br><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=2 title=Empty!><img src=http://i.imgur.com/hwR0ZfR.png height=12 width=60 title=Empty!><img src=http://i.imgur.com/kVDOUSJ.png height=12 width=2 title=Empty!><br>");

    document.body.innerHTML = document.body.innerHTML.split("Fatigue: 3<br>").join("Fatigue<br><img src=http://i.imgur.com/VyfcXSG.png height=12 width=64 title=3><br><br>");
    document.body.innerHTML = document.body.innerHTML.split("Fatigue: 2<br>").join("Fatigue<br><img src=http://i.imgur.com/VyfcXSG.png height=12 width=42 title=2><img src=http://i.imgur.com/ucwPPAv.png height=12 width=20 title=2><img src=http://i.imgur.com/VyfcXSG.png height=12 width=2 title=2><br><br>");
    document.body.innerHTML = document.body.innerHTML.split("Fatigue: 1<br>").join("Fatigue<br><img src=http://i.imgur.com/VyfcXSG.png height=12 width=22 title=1><img src=http://i.imgur.com/ucwPPAv.png height=12 width=40 title=1><img src=http://i.imgur.com/VyfcXSG.png height=12 width=2 title=1><br><br>");
    document.body.innerHTML = document.body.innerHTML.split("Fatigue: 0<br>").join("Fatigue<br><img src=http://i.imgur.com/VyfcXSG.png height=12 width=2 title=0><img src=http://i.imgur.com/ucwPPAv.png height=12 width=60 title=0><img src=http://i.imgur.com/VyfcXSG.png height=12 width=2 title=0><br><br>");
*/
}

highlight();
moveRules();
insert();
rewritePrepTable();
rewriteOngoingTable();
rewriteTicketTable();
rewriteTopEleven();
fixMillBox();
addIcons();