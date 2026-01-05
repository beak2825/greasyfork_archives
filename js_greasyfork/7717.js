// (c) 2015, Ded Moroz
//
// ==UserScript==
// @name        hwmangryworker
// @namespace   ded_moroz
// @description помощник в устройстве на работу, скрипт для ГВД
// @version     1.0.1
// @homepage    https://greasyfork.org/users/7571-ded-moroz
// @include     http://www.heroeswm.ru/object-info.php*
// @include     http://www.heroeswm.ru/object_do.php*
// @include     http://www.lordswm.com/object-info.php*
// @include     http://www.lordswm.com/object_do.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/7717/hwmangryworker.user.js
// @updateURL https://update.greasyfork.org/scripts/7717/hwmangryworker.meta.js
// ==/UserScript==

if (typeof GM_getValue != 'function')
{
	this.GM_getValue = function (key, def) {return localStorage[key] || def;};
	this.GM_setValue = function (key, value) {return localStorage[key] = value;};
	this.GM_deleteValue = function (key) {return delete localStorage[key];};
}

var eng = location.hostname.contains('lordswm') ? true : false;

var coop = '<center style="font-size:10px;">&#169; <a href="mailto:ded_moroz@mail.com" style="font-size:10px;" target="_top">Ded Moroz</a> <a href="https://greasyfork.org/users/7571-ded-moroz" style="font-size:10px;">hwm angry worker</a> v. ' + GM_info.script.version + '</center>';

/* get player's id */
var player_id = '';
links = document.getElementsByTagName('a');
for (i = 0; i < links.length; i++)
{
    if (links[i].getAttribute('href').contains('pl_hunter_stat'))
    {
    	player_id = links[i].getAttribute('href').split('=')[1];
        break;
    }
}

var GM_ARGS = 'hwm_angry_worker_args' + player_id;

if (eng)
{
	var pass_msg1 = 'gold';         // 'Not enough gold in facility'
	var pass_msg2 = 'No vacancies'; // 'No vacancies'
	var fail_msg1 = 'You';          // 'You have successfully enrolled' && 'You are already employed'
	var fail_msg2 = 'Invalid code'; // 'Invalid code. Please try again'
}
else
{
	var pass_msg1 = 'недостаточно золота';
	var pass_msg2 = 'Нет рабочих мест';
	var fail_msg1 = 'устроены';
	var fail_msg2 = 'неправильный код';
}

if (location.toString().contains('object_do'))
{
	// get the result string
	msg = document.getElementsByTagName('center');
	msg = msg[msg.length - 2];
	
	if (msg.innerHTML.contains(pass_msg1) || msg.innerHTML.contains(pass_msg2))
	{
		// save url with captcha to use later
		GM_setValue(GM_ARGS, location.search);
	}
	else if (msg.innerHTML.contains(fail_msg1) || msg.innerHTML.contains(fail_msg2))
	{
		// url is no longer valid
		GM_deleteValue(GM_ARGS);
	}
}
else if (location.toString().contains('object-info'))
{
	args = GM_getValue(GM_ARGS);
	
	if (args)
	{
		code_id = '';

		// get new code_id
		flash = document.getElementsByTagName('embed');	
		for (i = 0; i < flash.length; i++)
		{
			if (flash[i].getAttribute('src').contains('workcode'))
			{
				code_id = flash[i].getAttribute('FlashVars').split('|')[2];
				break;
			}
		}

		// quit if cant work here
		if (code_id == '') return;

		arg_pair = args.split('&');
		arg = [];

		// get url arguments from saved url
		for (i = 0; i < arg_pair.length; i++)
		{
			arg[i] = arg_pair[i].split('=');
		}
		
		// set new code_id
		if (arg[2][0] != 'code_id') return;
		arg[2][1] = code_id;

		// make new url	
		url = 'http://' + location.hostname + '/object_do.php' + location.search;
		for (i = 1; i < arg_pair.length; i++)
		{
			url += '&' + arg[i][0] + '=' + arg[i][1];
		}
		
		// apply for work
		location.href = url;
	}
}

// insert copyright
var div = document.createElement('div');
div.innerHTML = '<br>' + coop;
links[links.length - 1].parentNode.appendChild(div);
