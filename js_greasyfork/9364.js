// ==UserScript==
// @name        Better Soccer Project
// @namespace   sp
// @description For making SP a little bit better
// @include     *soccerproject.com/*
// @version     1.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9364/Better%20Soccer%20Project.user.js
// @updateURL https://update.greasyfork.org/scripts/9364/Better%20Soccer%20Project.meta.js
// ==/UserScript==
// add jquery

//add jquery
function includeJs(jsFilePath) {
	var js = document.createElement("script");

	js.type = "text/javascript";
	js.src = jsFilePath;

	document.body.appendChild(js);
}

includeJs("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");

var t=setTimeout(function(){
	//Rebind console to c
	var c = false;

	if(typeof console === "object" && typeof console.error === "function"){
		c = console,
			c = function (msg){"use strict"; console.info(msg);};
	}

	var SP = {};

	//urls
	const setNavigation = () => {
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">')
        $('body').append(
            '<div aria-expanded="false" class="menuBtn" id="hamburgerToggle" role="button"><div class="menuBtnContainer"><div></div><div></div><div></div></div></div>'
        )
        $('#navigation li:last').remove()
        $('#navigation li:first').after(
            $(
                '<li><a href="./spnewl_team_fixtures.php" class="more">Fixtures</a></li><li><a href="./spnewl_team_results.php" class="more">Results</a></li><li><a' +
                ' href="./spnewl_speler_overview.php" class="more">Players</a></li><li><a href="./spnewl_friendly_pool.php" class="more">Friendlies</a></li><li><a' +
                ' href="./spnewl_transfer_overview.php" class="more">Transfer Overview</a><li><a' +
                ' href="./spnewl_friendlycup_invitations.php?step=6" class="more">FC</a></li>'
            )
        )
    }


	/*************************************
	 *            FUNCTIONS               *
	 **************************************/
	function removeAllPlayers () {
		$('#formation_field select').each(function(){ //loop through selectable players.
			var me = $(this),
				options = me.find('option');
			me.find('option:selected').removeAttr('selected'); //remove all selected items
			options.first().attr('selected','selected');
			updatePlayer(options.first().parent().get(0));
		});
	}

	function updatefitestplayers () {
		removeAllPlayers ();
		var allPlayers = [], i=0;
		$('[id^=trPlayer]').each(function(){ //loop through all of the players
			var player = $(this).find('td');
			var fitness = player.eq(3).text().replace( /^\D+/g, '');
			var fitness = fitness.substring(0, fitness.length - 1); //get out their fitness and then remove the trailing %
			var playerID = player.eq(0).find('a').attr("onclick").replace( /^\D+/g, '');
			var playerID = playerID.slice(0,8);
			var playerID = parseInt(playerID, 10); // get out the players ID

			allPlayers.push([playerID,fitness]); //update array of players
		});

		allPlayers.sort(function(a,b){ //sort players by highest fitness
			return a[1] - b[1];
		}).reverse();

		allPlayers = allPlayers.slice(0,16); //remove the most unfit players
		console.info(allPlayers);
		$('#formation_field select').each(function(){ //loop through selectable players.
			var me = $(this),
				options = me.find('option');
			me.find('option:selected').removeAttr('selected'); //remove all selected items

			options.each(function(){ //loop through and add selected if it matches
				if($(this).val()==allPlayers[i][0]){
					var meText = $(this).text(),
						number = meText.substring(0,2),
						name = meText.substring(4);
					$(this).attr('selected','selected');
					updatePlayer(this.parentNode.parentElement);
				};
			});
			i++;
		});
	}

	function updateLowestMoralPlayers () {
		//removeAllPlayers ();
		var allPlayers = [], i=0;
		$('[id^=trPlayer]').each(function(){ //loop through all of the players
			var player = $(this).find('td');
			var moral = player.eq(2).text().replace( /^\D+/g, ''); //get moral from players
			var moral = moral.substring(0, moral.length - 1); //get out their fitness and then remove the trailing %
			var playerID = player.eq(0).find('a').attr("onclick").replace( /^\D+/g, '');
			var playerID = playerID.slice(0,8);
			var playerID = parseInt(playerID, 10); // get out the players ID

			allPlayers.push([playerID,moral]); //update array of players
		});

		allPlayers.sort(function(a,b){ //sort players by highest fitness
			return a[1] - b[1];
		});

		allPlayers = allPlayers.slice(0,16);

		$('#formation_field select').each(function(){ //loop through selectable players.
			var me = $(this),
				options = me.find('option');
			me.find('option:selected').removeAttr('selected'); //remove all selected items

			options.each(function(){ //loop through and add selected if it matches
				if(typeof allPlayers[i] !== "undefined" && $(this).val()==allPlayers[i][0]){
					var meText = $(this).text(),
						number = meText.substring(0,2),
						name = meText.substring(4);
					$(this).attr('selected','selected');
					updatePlayer(this.parentNode.parentElement);
				};
			});
			i++;
		});
	}

	/*************************************
	 *            Players               *
	 **************************************/
	function workOutStam(type){
		if(type==='startNonFullyStam'){
			selectArray.forEach(function(key) {
				var select = selects[key],
					stam = selects[key][1],
					currentlySelected = selects[key][selects[key].selectedIndex];
				if(typeof stam !== "undefined" && stam.className!=="maxed"){
					currentlySelected.removeAttribute('selected');
					stam.setAttribute('selected', 'selected');
				}
			});
		}
		if(type==='startStamFullMaxedOtherSkills'){
			var i=1;
			selectArray.forEach(function(key) {
				i++;
				var select = selects[key],
					stam = selects[key][1],
					skill1 = selects[key][1],
					skill2 = selects[key][2],
					skill3 = selects[key][3],
					skill4 = selects[key][4],
					skill5 = selects[key][5],
					skill6 = selects[key][6],
					skill7 = selects[key][7],
					skill8 = selects[key][8],
					skill9 = selects[key][9],
					nothing = selects[key][0],
					currentlySelected = selects[key][selects[key].selectedIndex],
					maxedNumber = $(select).find('.maxed').length;
				if(typeof stam !== "undefined" && maxedNumber===8){
					currentlySelected.removeAttribute('selected');
					stam.setAttribute('selected', 'selected');
				}else if(typeof stam !== "undefined" && maxedNumber===9){
					currentlySelected.removeAttribute('selected');
					stam.removeAttribute('selected');
					nothing.setAttribute("selected", "selected");
					select.removeAttribute('style');
                    $('<span>fully trained</span>').insertAfter(select);
				}
			});
		}
	}

	/*************************************
	 *                Pages               *
	 **************************************/
	if(document.location.pathname==="/spnewl_speler_training.php"){
		var selects = document.getElementsByTagName('select'),
			selectArray = Object.keys(selects).slice(0,selects.length);

		selectArray.forEach(function(key) {
			var myself = selects[key][selects[key].selectedIndex];
			if(typeof myself !== "undefined" && myself.className==="maxed"){
				selects[key].setAttribute("style","background: red; color: #FFF");
			}
		});
		$('#trainform .pbutton').append('<a class="button startStam" href="#">Start ALL Non Fully Trained Stamina</a><a class="button startStamFullMaxedOtherSkills" href="#">Start Stam on players with maxed everything else</a>');
		$('.startStam').click(function(){
			workOutStam('startNonFullyStam');
			return false;
		});
		$('.startStamFullMaxedOtherSkills').click(function(){
			workOutStam('startStamFullMaxedOtherSkills');
			return false;
		});
	}

	if(document.location.pathname==="/spnewl_game_selectie.php"){

		if($('.info').text() === 'The selection was saved.'){
			//window.location.href = '/spnewl_team_fixtures.php'
            window.close();
		}

		$('.pbutton a:first').after('<a class="button fittness" href="#">Pick Fittest Team</a><a class="button lowmoral" href="#">Pick lowest moral</a>');
		$('.pbutton a:last').after('<a class="button removeplayers" href="#">Remove All Players</a>');
		$('.fittness').click(function(){
			updatefitestplayers('remove');
			return false;
		});
		$('.removeplayers').click(function(){
			removeAllPlayers();
			return false;
		});
		$('.lowmoral').click(function(){
			updateLowestMoralPlayers();
			document.forms['selform'].submit();
			return false;
		});
	}

	if(document.location.pathname==="/spnewl_friendly_pool.php" && location.search.includes('step=2')){
		document.forms['inviteform'].submit();
	}
	if(document.querySelectorAll('.button')[1].innerHTML === "Selection"){
		window.open(document.querySelectorAll('.button')[1]);
		document.querySelectorAll('.button')[0].click();
	}

    const startSP = () => {
        setNavigation()
    }
    startSP()
	console.info('loaded');
},150);
