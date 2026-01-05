// ==UserScript==
// @name	   TM save COs
// @namespace  ByMLFC
// @version	1.0.1
// @description  TM save COs (The author does not guarantee the correctness of the script)
// @include		http://trophymanager.com/tactics
// @include		http://*.trophymanager.com/tactics
// @include		http://trophymanager.com/tactics/*
// @include		http://*.trophymanager.com/tactics/*
// @downloadURL https://update.greasyfork.org/scripts/6875/TM%20save%20COs.user.js
// @updateURL https://update.greasyfork.org/scripts/6875/TM%20save%20COs.meta.js
// ==/UserScript==

// page scope scripts
var pageHead = document.getElementsByTagName("head")[0];
var script = document.createElement('script'); 
script.type = "text/javascript"; 

function embed() {
	// get CO from the page
	function getCO() {
		document.getElementById("CO_JSON").value = JSON.stringify(cond_orders);
	}

	// if two orders are the same, return true, exclude id
	function compare_cond_order(cond_order1, cond_order2) {
		for (var j in cond_order1) {
			if (j != "ID") {
				if (cond_order1[j] != cond_order2[j]) {
					return false;
				}
			}
		}
		return true;
	}

	function setCO() {
		var CO_name = document.getElementById("CO_list");
		if (CO_name.selectedIndex != 0) {
			var temp_cond_orders = JSON.parse(document.getElementById("CO_JSON").value);

			$("#cond_orders_list").html("");
			for(var i in temp_cond_orders) {
				// skip save if COs are the same
				if (compare_cond_order(cond_orders[i], temp_cond_orders[i])) {
					var $co = co_create_cond_order(temp_cond_orders[i], true);
				} else {
					cond_orders[i] = temp_cond_orders[i];
					var $co = co_create_cond_order(temp_cond_orders[i], false);
				}
				$("#cond_orders_list").append($co);
			}
		} else {
			alert("Please select a CO-set");
		}
	}

	// receive COs from the page or write COs from Monkey
	var input = document.createElement("input");
	input.id = "CO_JSON";
	input.type = "hidden";
	document.getElementsByTagName("body")[0].appendChild(input);

	// prepare forms to call page scope scripts
	var form = document.createElement("form");
	form.id = "call_setCO";
	form.setAttribute("onreset", "setCO()");
	document.getElementsByTagName("body")[0].appendChild(form);

	var form = document.createElement("form");
	form.id = "call_getCO";
	form.setAttribute("onreset", "getCO()");
	document.getElementsByTagName("body")[0].appendChild(form);
}

var txtScr = embed.toString();
txtScr = txtScr.substring(txtScr.indexOf("{")+1, txtScr.lastIndexOf("}"));
script.appendChild(document.createTextNode(txtScr));

pageHead.appendChild(script);

// run in Monkey
// check availability of the name and assign one if the name has been in use
function name_check(original, temp_name, count) {
	if (temp_name.length == 0) {
		temp_name = name_check("Set", "Set_1", 2);
	} else {
		if (GM_getValue("co"+temp_name, false)) {
			temp_name = name_check(original, original+"_"+count, count+1);
		}
	}
	return temp_name;
}

// save CO to Monkey
function save_COs() {
	var CO_JSON = document.getElementById("CO_JSON").value;
	var CO_name = document.getElementById("CO_list");
	if (CO_name.selectedIndex != 0) {
		CO_name = CO_name.options[CO_name.selectedIndex].value;
		// confirm the user is going to overwrite the save
		if ((document.getElementById("CO_name").value == CO_name) || (document.getElementById("CO_name").value.length == 0)) {
			GM_setValue("co" + CO_name, CO_JSON);
		} else {
			alert("Not sure about your intention:\n1) To rename, press the rename button;\n2) To overwrite, leave the name box blank or type the name as your chosen save;\n3) To add a new set, choose from the dropdown list");
		}
	} else {
		CO_name = name_check(document.getElementById("CO_name").value, document.getElementById("CO_name").value, 1);

		// add to dropdown list
		var option = document.createElement("option");
		option.value = CO_name;
		option.innerHTML = CO_name;
		document.getElementById("CO_list").appendChild(option);

		document.getElementById("CO_list").selectedIndex = document.getElementById("CO_list").length - 1;
		GM_setValue("co" + CO_name, CO_JSON);
	};
}

// load CO from Monkey
function load_COs() {
	var CO_name = document.getElementById("CO_list");
	if (CO_name.selectedIndex != 0) {
		CO_name = CO_name.options[CO_name.selectedIndex].value;
		document.getElementById("CO_JSON").value = GM_getValue("co" + CO_name);
	}
}

// delete CO from Monkey
function delete_COs() {
	var CO_list = document.getElementById("CO_list");
	if (CO_list.selectedIndex != 0) {
		GM_deleteValue("co" + CO_list.options[CO_list.selectedIndex].value);
		CO_list.remove(CO_list.options[CO_list.selectedIndex]);
	}
}

// rename CO from Monkey
function rename_COs() {
	if (document.getElementById("CO_list").selectedIndex != 0) {
		load_COs();
		delete_COs();
		document.getElementById("CO_list").selectedIndex = 0;
		save_COs();
	}
}

// call page scope scripts
function call_setCO() {
	document.getElementById("call_setCO").reset();
}

function call_getCO() {
	document.getElementById("call_getCO").reset();
}

function save_onclick() {
	call_getCO();
	save_COs();
}

function load_onclick() {
	load_COs();
	call_setCO();
}

// create CO-set list
document.getElementById("tactics").style.height = "510px";

var div = document.createElement("div");
div.setAttribute("style", "position: absolute; top: 472px; left: 10px;");

// CO list
var span = document.createElement("span");
span.setAttribute("style", "padding-right: 10px;");
var select = document.createElement("select");
select.setAttribute("style", "width: 250px;");
select.id = "CO_list";
select.className = "ui-selectmenu ui-state-default ui-selectmenu-popup";
var option = document.createElement("option");
option.innerHTML = "Add a New CO-set";
select.appendChild(option);
span.appendChild(select);

div.appendChild(span);
document.getElementById("tactics").appendChild(div);

// name
var span = document.createElement("span");
span.setAttribute("style", "padding-right: 10px;");
var input = document.createElement("input");
input.setAttribute("style", "width: 200px;");
input.id = "CO_name";
input.className = "embossed";
input.type = "text";
input.setAttribute("placeholder", "Name or Rename");
span.appendChild(input);
div.appendChild(span);

var GM_value_list = GM_listValues();
for (var i in GM_value_list) {
	var key = GM_value_list[i];
	if (key.indexOf("co") == 0) {
		key = key.substring(2);
		var option = document.createElement("option");
		option.value = key;
		option.innerHTML = key;
		document.getElementById("CO_list").appendChild(option);
	}
}

// save button
var span3 = document.createElement("span");
span3.setAttribute("style", "padding-right: 10px;");
var span = document.createElement("span");
span.className = "button";
span.addEventListener("click", save_onclick, false);

var span2 = document.createElement("span");
span2.className = "button_border";
span2.innerHTML = "Save COs";
span.appendChild(span2);

span3.appendChild(span);
div.appendChild(span3);

// rename button
var span3 = document.createElement("span");
span3.setAttribute("style", "padding-right: 10px;");
var span = document.createElement("span");
span.className = "button";
span.addEventListener("click", rename_COs, false);

var span2 = document.createElement("span");
span2.className = "button_border";
span2.innerHTML = "Rename CO-set";
span.appendChild(span2);

span3.appendChild(span);
div.appendChild(span3);

// load button
var span3 = document.createElement("span");
span3.setAttribute("style", "padding-right: 10px;");
var span = document.createElement("span");
span.className = "button";
span.addEventListener("click", load_onclick, false);

var span2 = document.createElement("span");
span2.className = "button_border";
span2.innerHTML = "Load COs";
span.appendChild(span2);

span3.appendChild(span);
div.appendChild(span3);

// delete button
var span3 = document.createElement("span");
span3.setAttribute("style", "padding-right: 10px;");
var span = document.createElement("span");
span.className = "button";
span.addEventListener("click", delete_COs, false);

var span2 = document.createElement("span");
span2.className = "button_border";
span2.innerHTML = "Delete CO-set";
span.appendChild(span2);

span3.appendChild(span);
div.appendChild(span3);