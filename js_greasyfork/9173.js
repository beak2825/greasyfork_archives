// ==UserScript==
// @id          Duxe@scriptish
// @name        for_nnz_SS_2.0.3.0
// @version     2.0.3.0
// @namespace   REFLEX
// @author      Duxe
// @co-author   Reflex
// @description Изменяем базу SS(REFLEX)
// @require     http://code.jquery.com/jquery.min.js
// @include     http://ss.n-home.ru/*
// @include     http://ss.nnz-home.ru/*
// @include     http://ss.pntl.ru/*
// @include     https://ss.pntl.ru/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/9173/for_nnz_SS_2030.user.js
// @updateURL https://update.greasyfork.org/scripts/9173/for_nnz_SS_2030.meta.js
// ==/UserScript==



//====================================================================================
(function(){ document.addEventListener('DOMContentLoaded', function(){

	//alert($);

	var nnz_region_id; var nnz_region_text; var ahtung; var who_exec; var session_login; var reload_time; var flashing; var open_mod_win;
	var color_sel = "#EEE8AA";
	var color_ahtung = "#EE7621";
	var color_uzel_ahtung = "#FF6A6A";
	var color_zamena = "#A4D3EE";
	var color_jurik = "#FFCC66";
	var serv_adres = "192.168.31.10";
	var id_kolpino = 9;
	var checkbox_id = 0;
	var ahtung_rows = [];
	var ahtung_uzel_rows = [];
	//var adr_stroka = new String(document.location);
	var adr_stroka = new String(window.location.href);
	var page_edit_status = adr_stroka.toUpperCase().search("REQUEST_EDIT_STATUS&ID=");
	var page_history = adr_stroka.toUpperCase().search("REQUEST_HISTORY&ID=");
	var page_edit = adr_stroka.toUpperCase().search("REQUEST_EDIT&ID=");
	var theBody = document.getElementsByTagName('BODY')[0];
	
	//alert(window.location.href + "\n" + document.location.href + "\n" + adr_stroka);



	var script_add = document.createElement("script");
	var js_text = [];
	js_text.push('function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure){');
	js_text.push('var cookie_string = name + "=" + escape ( value );');
	js_text.push('if ( exp_y ){');
	js_text.push('var expires = new Date ( exp_y, exp_m, exp_d );');
	js_text.push('cookie_string += "; expires=" + expires.toGMTString();');
	js_text.push('}');
	js_text.push('if ( path ){ cookie_string += "; path=" + escape ( path ); }');
	js_text.push('if ( domain ){ cookie_string += "; domain=" + escape ( domain ); }');
	js_text.push('if ( secure ){ cookie_string += "; secure"; }');
	js_text.push('document.cookie = cookie_string;');
	js_text.push('}');
	js_text.push('function get_cookie(cookie_text){');
	js_text.push('var results = document.cookie.match ( \'(^|;) ?\' + cookie_text + \'=([^;]*)(;|$)\' );');
	js_text.push('if ( results ){ return ( unescape ( results[2] ) ); }');
	js_text.push('else{ return null; }');
	js_text.push('}');

	js_text.push('function i_ch_area(id, date_income, type_id, who_receive_id, status_id, who_exec_id, client_addr, client_contact, description){');
	js_text.push('var str = document.getElementsByName("change_area_id")[0].parentNode.getAttribute(\'action\');');
	js_text.push('str = str.replace(/&id=(\\d*?)&/, "&id=" + id + "&");');
	js_text.push('str = str.replace(/date_income=(.*?)&/, "date_income=" + date_income + "&");');
	js_text.push('str = str.replace(/type_id=-?\\d*(?=&)/, "type_id=" + type_id);');
	js_text.push('str = str.replace(/client_addr=(.*?)&/, "client_addr=" + client_addr + "&");');
	js_text.push('str = str.replace(/client_contact=(.*?)&/, "client_contact=" + client_contact + "&");');
	js_text.push('str = str.replace(/description=(.*?)&?/, "description=" + description + "&");');
	js_text.push('str = str.replace(/who_receive_id=-?\\d*(?=&)/, "who_receive_id=" + who_receive_id);');
	js_text.push('str = str.replace(/status_id=-?\\d*(?=&)/, "status_id=" + status_id);');
	js_text.push('str = str.replace(/who_exec_id=-?\\d*(?=&)/, "who_exec_id=" + who_exec_id);');
	js_text.push('str = str.replace(/client_addr=(.*?)&/, "client_addr=" + client_addr + "&");');
	js_text.push('document.getElementsByName("change_area_id")[0].parentNode.setAttribute(\'action\' , str);');
	js_text.push('}');

	js_text.push('function inp_check(){');
	js_text.push('var id = document.getElementsByName("id")[0];');
	js_text.push('var tabl_zajavki = id.parentNode.parentNode.parentNode.parentNode;');
	js_text.push('var check_ids_all = document.getElementById("check_ids_all");');
	js_text.push('for(i = 3; i < tabl_zajavki.rows.length;  i++){');
	js_text.push('if(tabl_zajavki.rows[i].cells.length == 11 ){');
	js_text.push('if(check_ids_all.checked == true){');
	js_text.push('tabl_zajavki.rows[i].cells[0].getElementsByTagName("input")[0].checked = true;');
	js_text.push('}');
	js_text.push('if(check_ids_all.checked == false){');
	js_text.push('tabl_zajavki.rows[i].cells[0].getElementsByTagName("input")[0].checked = false;');
	js_text.push('}');
	js_text.push('}');
	js_text.push('}');
	js_text.push('}');

	script_add.innerHTML = js_text.join('');
	document.getElementsByTagName('head')[0].appendChild(script_add);


	// ################################################################################
	function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure){
	  var cookie_string = name + "=" + escape ( value );
		  if ( exp_y ){
			var expires = new Date ( exp_y, exp_m, exp_d );
			cookie_string += "; expires=" + expires.toGMTString();
		  }
	  if ( path ){ cookie_string += "; path=" + escape ( path ); }
	  if ( domain ){ cookie_string += "; domain=" + escape ( domain ); }
	  if ( secure ){ cookie_string += "; secure"; }
	  document.cookie = cookie_string;
	}
	function get_cookie(cookie_text){
	  var results = document.cookie.match ( '(^|;) ?' + cookie_text + '=([^;]*)(;|$)' );
	  if ( results ){ return ( unescape ( results[2] ) ); }
	  else{ return null; }
	}
	function delete_cookie(cookie_text){
	  var cookie_date = new Date ( );  // Текущая дата и время
	  cookie_date.setTime ( cookie_date.getTime() - 1 );
	  document.cookie = cookie_text += "=; expires=" + cookie_date.toGMTString();
	}
	// ################################################################################
	//Подгружаем скрипты для модальных окон (Начало)
	var sm_subModal_css = document.createElement('link');
	sm_subModal_css.rel = 'stylesheet';
	sm_subModal_css.href = 'http://' + serv_adres + '/ss/wind_modal/subModal.css';
	sm_subModal_css.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(sm_subModal_css);

	var sm_common_js = document.createElement('script');
	sm_common_js.src = 'http://' + serv_adres + '/ss/wind_modal/common.js';
	sm_common_js.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(sm_common_js);

	var sm_subModal_js = document.createElement('script');
	sm_subModal_js.src = 'http://' + serv_adres + '/ss/wind_modal/subModal.js';
	sm_subModal_js.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(sm_subModal_js);
	//Подгружаем скрипты для модальных окон (Конец)
	// ################################################################################
	

	//====================================================================================
	if(get_cookie('session_login') != null){ session_login = get_cookie('session_login'); }
	//====================================================================================
	
	var doc_input = document.getElementsByTagName("input");
	for(i = 0; i < doc_input.length; i++){
		if(doc_input[i].value.search("ить") == -1 && doc_input[i].value.search("йти") == -1){
			doc_input[i].setAttribute("style", "background-color:" + color_sel + ";");
		}
	}
	var doc_select = document.getElementsByTagName("select");
	for(i = 0; i < document.getElementsByTagName("select").length; i++){
		document.getElementsByTagName("select")[i].setAttribute("style", "background-color:" + color_sel + ";");
	}
	
	//====================================================================================

	if (page_edit_status != -1){
		var elem_tabl = theBody.getElementsByTagName("table")[0];
			if(elem_tabl){elem_tabl.parentNode.removeChild(elem_tabl);}
		var elem_h3 = theBody.getElementsByTagName("h3")[0];
			if(elem_h3){elem_h3.parentNode.removeChild(elem_h3);}
		var elem_form = theBody.getElementsByTagName("form")[0];
			if(elem_form){elem_form.parentNode.removeChild(elem_form);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			//if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		theBody.innerHTML = theBody.innerHTML.replace(new RegExp("<br><br>",'g'),"");
		
		//alert(theBody.innerHTML);
		//theBody.innerHTML = theBody.innerHTML.replace( /^\s+/g, '');
		//theBody.innerHTML = theBody.innerHTML.replace( /\s+$/g, '');
		//s = s.replace( /^\s+/g, '');
		//s.replace( /\s+$/g, '');

		var elem_form = theBody.getElementsByTagName("form")[0];
		//elem_form.setAttribute("action", "");
		var tabl_edit = elem_form.getElementsByTagName("table")[0];
		
		//========== Напоминание о логине (начало) ===============
		var aht_login = tabl_edit.rows[0].cells[1];
		aht_login.innerHTML = aht_login.innerHTML + " &nbsp; <b>Внимание! Ты пишешь от логина:</b> ";
		var newNobr = document.createElement('nobr');
				newNobr.setAttribute("style", "color: red;");
				var html = [];
				html.push('<b>\"' + session_login + '\"</b>');
				newNobr.innerHTML = html.join('');
				aht_login.appendChild(newNobr);

		setInterval(function(){
			if(newNobr.getAttribute("style") != null){
				newNobr.removeAttribute("style");
			}
			else{newNobr.setAttribute("style", "color: red;");}
		},150);
		//========== Напоминание о логине (конец) ===============
		
		//alert(tabl_edit.rows[0].cells[1].innerHTML);
		// var link_a_c0 = tabl_zajavki.rows[i].cells[0].getElementsByTagName("a")
		
		var inp_end = (tabl_edit.getElementsByTagName("input").length) - 1;
		tabl_edit.getElementsByTagName("input")[inp_end].setAttribute("onclick", "set_cookie(\'open_mod_win\',\'no\', 2050, 01, 01); window.top.location.reload();");
		tabl_edit.setAttribute("align", "center");
		tabl_edit.setAttribute("width", "80%");
		tabl_edit.getElementsByTagName("textarea")[0].setAttribute("cols", "68");
		tabl_edit.getElementsByTagName("textarea")[0].setAttribute("rows", "8");
		tabl_edit.getElementsByTagName("textarea")[0].setAttribute("style", "background-color:#FFFFCC;resize:none;");
	}
	
	if (page_history != -1){
		var elem_tabl = theBody.getElementsByTagName("table")[0];
			if(elem_tabl){elem_tabl.parentNode.removeChild(elem_tabl);}
		var elem_h3 = theBody.getElementsByTagName("h3")[0];
			if(elem_h3){elem_h3.parentNode.removeChild(elem_h3);}
		var elem_h3 = theBody.getElementsByTagName("h3")[0];
			if(elem_h3){elem_h3.parentNode.removeChild(elem_h3);}
		var elem_form = theBody.getElementsByTagName("form")[0];
			if(elem_form){elem_form.parentNode.removeChild(elem_form);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			//if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		theBody.innerHTML = theBody.innerHTML.replace(new RegExp("<br><br>",'g'),"<br>");
		
		var elem_a = theBody.getElementsByTagName("a");
		for(y = 0; y < elem_a.length; y++){
			if(elem_a[y].textContent.toUpperCase().search("ЛОГИНА") != -1){
				//elem_a[y].setAttribute("onclick", "set_cookie(\'open_mod_win\',\'no\', 2050, 01, 01); window.top.hidePopWin(false);");
				elem_a[y].setAttribute("target", "_blank");
			}
			if(elem_a[y].getAttribute("href") && elem_a[y].getAttribute("href").toUpperCase().search("BILLING.NNZ-HOME.RU") != -1){
				//elem_a[y].setAttribute("onclick", "set_cookie(\'open_mod_win\',\'no\', 2050, 01, 01); window.top.hidePopWin(false);");
				elem_a[y].setAttribute("target", "_blank");
			}
		}
	}
	
	if (page_edit != -1){
		var elem_tabl = theBody.getElementsByTagName("table")[0];
			if(elem_tabl){elem_tabl.parentNode.removeChild(elem_tabl);}
		var elem_h3 = theBody.getElementsByTagName("h3")[0];
			if(elem_h3){elem_h3.parentNode.removeChild(elem_h3);}
		var elem_form = theBody.getElementsByTagName("form")[0];
			if(elem_form){elem_form.parentNode.removeChild(elem_form);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		var elem_div = theBody.getElementsByTagName("div")[0];
			//if(elem_div){elem_div.parentNode.removeChild(elem_div);}
		theBody.innerHTML = theBody.innerHTML.replace(new RegExp("<br><br>",'g'),"");
		
		var elem_a = theBody.getElementsByTagName("a");
		for(y = 0; y < elem_a.length; y++){
			if(elem_a[y].textContent.toUpperCase().search("ЛОГИНА") != -1){
				//elem_a[y].setAttribute("onclick", "set_cookie(\'open_mod_win\',\'no\', 2050, 01, 01); window.top.hidePopWin(false);");
				elem_a[y].setAttribute("target", "_blank");
			}
			if(elem_a[y].getAttribute("href") && elem_a[y].getAttribute("href").toUpperCase().search("BILLING.NNZ-HOME.RU") != -1){
				//elem_a[y].setAttribute("onclick", "set_cookie(\'open_mod_win\',\'no\', 2050, 01, 01); window.top.hidePopWin(false);");
				elem_a[y].setAttribute("target", "_blank");
			}
		}

		var elem_form = theBody.getElementsByTagName("form")[0];
		if(elem_form){
			//elem_form.setAttribute("action", "");
			var tabl_edit = elem_form.getElementsByTagName("table")[0];
			var inp_end = (tabl_edit.getElementsByTagName("input").length) - 1;
			tabl_edit.getElementsByTagName("input")[inp_end].setAttribute("onclick", "set_cookie(\'open_mod_win\',\'no\', 2050, 01, 01); window.top.location.reload();");
			tabl_edit.setAttribute("align", "center");
			tabl_edit.setAttribute("width", "80%");
			tabl_edit.getElementsByTagName("textarea")[0].setAttribute("cols", "68");
			tabl_edit.getElementsByTagName("textarea")[0].setAttribute("rows", "8");
			tabl_edit.getElementsByTagName("textarea")[0].setAttribute("style", "background-color:#FFFFCC;");
		}
		
	}
	
	//====================================================================================

	
	
	
	
	
	
	
	
	
	
	
	var area = document.getElementsByName("area_id")[0];
	if(area && page_edit_status == -1 && page_edit == -1 && page_history == -1 && page_edit == -1){
		if(get_cookie('nnz_region_id') != null){nnz_region_id = get_cookie('nnz_region_id');}
		document.title = "Система учёта заявок";
		if(nnz_region_id >= 5){area.selectedIndex = nnz_region_id - 1;}
		if(nnz_region_id < 4){area.selectedIndex = nnz_region_id;}
		if(nnz_region_id == 4){area.selectedIndex = 0;}
		var inp_area = document.getElementsByTagName("input");
		inp_area[3].setAttribute("onClick", "javascript:set_cookie(\'session_login\', document.getElementsByTagName(\'input\')[0].value);set_cookie(\'nnz_region_id\', document.getElementsByName(\'area_id\')[0][document.getElementsByName(\'area_id\')[0].selectedIndex].value, 2050, 01, 01);set_cookie(\'nnz_region_text\', document.getElementsByName(\'area_id\')[0][document.getElementsByName(\'area_id\')[0].selectedIndex].text, 2050, 01, 01);");
	}

	//====================================================================================		
	
	













	//##########################################################################################
	var change_area = document.getElementsByName("change_area_id")[0];
	if(change_area && page_edit_status == "-1" && page_edit == -1 && page_history == -1 && page_edit == -1){
		nnz_region_id = change_area[change_area.selectedIndex].value;
		nnz_region_text = change_area[change_area.selectedIndex].text;
			document.title = document.title + " ( Район: " + nnz_region_text + " )";
			var title_h3 = document.getElementsByTagName("h3");
			var newNoBR = document.createElement('nobr');
			newNoBR.innerHTML = '. Район : ' + nnz_region_text;
			title_h3[0].appendChild(newNoBR);
				
			if(session_login){
				document.title = document.title + " [" + session_login + "]";
				var newNoBR = document.createElement('nobr');
				newNoBR.innerHTML = ' [<font color="red">' + session_login + '</font>]';
				title_h3[0].appendChild(newNoBR);
			}

		if(get_cookie('nnz_region_text') == null){ nnz_region_text = change_area[change_area.selectedIndex].text; }
		var inp_change_area = document.getElementsByTagName("input")[0];
		inp_change_area.setAttribute("onClick", "javascript: set_cookie(\'nnz_region_id\', document.getElementsByName(\'change_area_id\')[0][document.getElementsByName(\'change_area_id\')[0].selectedIndex].value, 2050, 01, 01); set_cookie(\'nnz_region_text\', document.getElementsByName(\'change_area_id\')[0][document.getElementsByName(\'change_area_id\')[0].selectedIndex].text, 2050, 01, 01); i_ch_area(document.getElementsByName(\'id\')[0].value,document.getElementsByName(\'date_income\')[0].value,document.getElementsByName(\'type_id\')[0][document.getElementsByName(\'type_id\')[0].selectedIndex].value,  document.getElementsByName(\'who_receive_id\')[0][document.getElementsByName(\'who_receive_id\')[0].selectedIndex].value, document.getElementsByName(\'status_id\')[0][document.getElementsByName(\'status_id\')[0].selectedIndex].value, document.getElementsByName(\'who_exec_id\')[0][document.getElementsByName(\'who_exec_id\')[0].selectedIndex].value,document.getElementsByName(\'client_addr\')[0].value,document.getElementsByName(\'client_contact\')[0].value,document.getElementsByName(\'description\')[0].value);");

		var map_prefix = "";
		if(nnz_region_id > 0 && nnz_region_id < 9 && nnz_region_id != 4){ map_prefix = "Россия, Санкт-Петербург, "; }
		if(nnz_region_id == id_kolpino){ map_prefix = "Россия, Колпино, "; }
		if(nnz_region_id == 10){ map_prefix = "Россия, Санкт-Петербург, "; }

		var id = document.getElementsByName("id")[0];
		if(id){
			var tabl_zajavki = id.parentNode.parentNode.parentNode.parentNode;
		}
		
			var templates = document.getElementsByName("templates")[0];
			if(templates){templates.setAttribute("style", "background-color:" + color_sel + ";font-weight: bolder;");}
			var all_description = document.getElementById('all_description');
			if(all_description){all_description.setAttribute("style", "background-color:#FFFFCC;font-weight: bolder;");}


		if(tabl_zajavki){
			id.setAttribute("style", "background-color:" + color_sel + ";font-weight: bolder; width: 65%;");
			var newNoBR = document.createElement('nobr');
			newNoBR.innerHTML = '<input type="button" style="border:1px solid #999999;color: #FF4040;" value="-" onClick="javascript: document.getElementsByName(\'id\')[0].value = \'\';">';
			id.parentNode.appendChild(newNoBR);
		
			document.getElementsByName("date_income")[0].setAttribute("style", "background-color:" + color_sel + ";font-weight: bolder; width: 100%;");
			var client_addr = document.getElementsByName("client_addr")[0];
			client_addr.setAttribute("style", "background-color:" + color_sel + ";font-weight: bolder; width: 65%;");
			var newNoBR = document.createElement('nobr');
			newNoBR.innerHTML = '<input type="button" style="border:1px solid #999999;color: #FF4040;" value="-" onClick="javascript: document.getElementsByName(\'client_addr\')[0].value = \'\';">';
			client_addr.parentNode.appendChild(newNoBR);
			
			var client_contact = document.getElementsByName("client_contact")[0];
			client_contact.setAttribute("style", "background-color:" + color_sel + ";font-weight: bolder; width: 70%;");
			var newNoBR = document.createElement('nobr');
			newNoBR.innerHTML = '<input type="button" style="border:1px solid #999999;color: #FF4040;" value="-" onClick="javascript: document.getElementsByName(\'client_contact\')[0].value = \'\';">';
			client_contact.parentNode.appendChild(newNoBR);
			
			var description = document.getElementsByName("description")[0];
			description.setAttribute("style", "background-color:" + color_sel + ";font-weight: bolder; width: 80%;");
			var newNoBR = document.createElement('nobr');
			newNoBR.innerHTML = '<input type="button" style="border:1px solid #999999;color: #FF4040;" value="-" onClick="javascript: document.getElementsByName(\'description\')[0].value = \'\';">';
			description.parentNode.appendChild(newNoBR);
			
			if(tabl_zajavki.rows[2].cells[0].getAttribute("colspan") == 11){
				var newNobr = document.createElement('nobr');
				newNobr.setAttribute("style", "position: absolute; left: 17px; ");
				newNobr.setAttribute("class", "input_req_filter_submit");
				var html = [];
				html.push('<INPUT class="input_req_filter_submit" style="background-color:' + color_sel + ';" id="check_ids_all" type="checkbox" title="Выделить/Снять все" onClick="javascript:inp_check();"><b>Выделить/Снять все</b>');
				newNobr.innerHTML = html.join('');
				tabl_zajavki.rows[2].cells[0].appendChild(newNobr);
			}
			
			for(i = 3; i < tabl_zajavki.rows.length;  i++){
				if(tabl_zajavki.rows[i].cells.length == 11 ){
					//================================================================
					if (i % 2 == 0){tabl_zajavki.rows[i].setAttribute("BGCOLOR", "#EEE9E9");}
					
					var link_a_c0 = tabl_zajavki.rows[i].cells[0].getElementsByTagName("a")
					for(v = 0; v < link_a_c0.length; v++){ //Атрибуты для модальных окон
						link_a_c0[v].setAttribute("class", "submodal-750-650");
						link_a_c0[v].setAttribute("style", "text-decoration: none;");
					}
					
					if (tabl_zajavki.rows[i].cells[2].textContent.toUpperCase().search("ЗАМЕНА СВИЧА") != -1){
						tabl_zajavki.rows[i].setAttribute("BGCOLOR", color_zamena);
					}
					if (tabl_zajavki.rows[i].textContent.toUpperCase().search("ЗАМЕНА") != -1 && tabl_zajavki.rows[i].textContent.toUpperCase().search("СВИТЧЕЙ") != -1){
						tabl_zajavki.rows[i].setAttribute("BGCOLOR", color_zamena);
					}
					if (tabl_zajavki.rows[i].textContent.toUpperCase().search("ПОСТАВИТЬ") != -1 && tabl_zajavki.rows[i].textContent.toUpperCase().search("СВИ") != -1){
						tabl_zajavki.rows[i].setAttribute("BGCOLOR", color_zamena);
					}
					
					if (tabl_zajavki.rows[i].cells[2].textContent.toUpperCase().search("ЮРИК") != -1){
						tabl_zajavki.rows[i].setAttribute("BGCOLOR", color_jurik);
						tabl_zajavki.rows[i].cells[2].setAttribute("style", "color:red;font-weight:bold");
						var div_tr = tabl_zajavki.rows[i].getElementsByTagName("div");
						div_tr[2].setAttribute("style", "color: #660099;");
						div_tr[4].setAttribute("style", "color: #660099;");
					}

					if (tabl_zajavki.rows[i].cells[2].textContent.toUpperCase().search("А Х Т У Н Г") != -1){
						ahtung_rows.push(i);
						tabl_zajavki.rows[i].setAttribute("BGCOLOR", color_ahtung); 
						
						var div_tr = tabl_zajavki.rows[i].getElementsByTagName("div");
						div_tr[2].setAttribute("style", "color: #00008B;");
						div_tr[4].setAttribute("style", "color: #00008B;");
					}
						
					if (tabl_zajavki.rows[i].cells[2].textContent.toUpperCase().search("АХТУНГ УЗЕЛ") != -1){
						ahtung_uzel_rows.push(i);
						tabl_zajavki.rows[i].setAttribute("BGCOLOR", color_uzel_ahtung); 
						var div_tr = tabl_zajavki.rows[i].getElementsByTagName("div");
						div_tr[2].setAttribute("style", "color: #00008B;");
						div_tr[4].setAttribute("style", "color: #00008B;");
					}
					
					// ************ Yandex-карты начало ***************	
					var adres_field = tabl_zajavki.rows[i].cells[3];
					var adres_text = tabl_zajavki.rows[i].cells[3].textContent;
					
					var adres = [];
					adres.push(new Array('WiFi', 0));
					adres.push(new Array('DEM_', 0));
					adres.push(new Array('DEM ', 0));
					adres.push(new Array('Колпино,', 0));
					adres.push(new Array('Колпино', 0));
					adres.push(new Array('Кр. партизан', 'ул. Красных партизан'));
					adres.push(new Array('Кр.Партизан', 'Красных партизан'));
					adres.push(new Array('Very Sluckoy', 'ул. Веры Слуцкой'));
					adres.push(new Array('k1', 'корпус 1'));
					adres.push(new Array('к1', 'корпус 1'));
					adres.push(new Array('к.1', 'корпус 1'));
					adres.push(new Array('k2', 'корпус 2'));
					adres.push(new Array('к2', 'корпус 2'));
					adres.push(new Array('к.2', 'корпус 2'));
					adres.push(new Array('k3', 'корпус 3'));
					adres.push(new Array('к3', 'корпус 3'));
					adres.push(new Array('к.3', 'корпус 3'));
					adres.push(new Array('k4', 'корпус 4'));
					adres.push(new Array('к4', 'корпус 4'));
					adres.push(new Array('к.4', 'корпус 4'));
					adres.push(new Array('k5', 'корпус 5'));
					adres.push(new Array('к5', 'корпус 5'));
					adres.push(new Array('к.5', 'корпус 5'));
					adres.push(new Array('k6', 'корпус 6'));
					adres.push(new Array('к6', 'корпус 6'));
					adres.push(new Array('к.6', 'корпус 6'));
					adres.push(new Array('кан. Комсомольский', 'набережная Комсомольского канала'));
					adres.push(new Array('канал.Комсомольский', 'набережная Комсомольского канала'));
					adres.push(new Array('Комсомольский канал', 'набережная Комсомольского канала'));
					adres.push(new Array('Комсомольский', 'набережная Комсомольского канала'));
					adres.push(new Array('Комсомольская', 'Тосненский район, посёлок Красный Бор, ул. Комсомольская'));
					adres.push(new Array('Тельмана', 'Тосненский район, посёлок Тельмана'));
					
					for(x = 0; x < adres.length; x++ ){
						var adres_in = adres[x][0];
						var adres_out = adres[x][1];
						if (adres_text.search(adres_in) != -1){
							if(adres_out == 0){adres_text = adres_text.replace(adres_in,"");}
							if(adres_out != 0){adres_text = adres_text.replace(adres_in,adres_out);}
						}
					}

					if(tabl_zajavki.rows[i].cells[3].innerHTML != "&nbsp;"){
						var newDiv = document.createElement('div');
						var html = [];
						html.push('[<a href="http://maps.yandex.ru/?text=');
						html.push(map_prefix);
						html.push(adres_text);
						html.push('" title="Yandex-карты" target="_blank">карта</a>]');
						newDiv.innerHTML = html.join('');
						adres_field.appendChild(newDiv);
					}
					// ************ Yandex-карты конец ***************	

					var user_field = tabl_zajavki.rows[i].cells[4];
					var user_text = user_field.getElementsByTagName("a")[0];
					var lnk_netup_full = user_field.getElementsByTagName("a")[1];
					
					if(user_text){
						user_text.setAttribute("target", "_blank");
						user_text.setAttribute("title", "Вэбовский NETUP");
						
						var newDiv = document.createElement('nobr');
						var html = [];
						html.push('[<a href="http://ss.pntl.ru/index.php?client_contact=');
						html.push(user_text.textContent);
						html.push('" target="_blank" title="Посмотреть все заявки от этого логина">A</a>]');
						newDiv.innerHTML = html.join('');
						user_field.appendChild(newDiv);
						
						
					}
					
					var lnk_netup_full = user_field.getElementsByTagName("a")[1];
					if(lnk_netup_full){lnk_netup_full.setAttribute("target", "_blank");lnk_netup_full.setAttribute("title", "Вэбовский NETUP (FULL)");}
					
					if(nnz_region_id == id_kolpino){  // - если выбран район "Колпино"
						// ************ tools.demos начало ***************
						if(user_text){					
							var newNobr = document.createElement('nobr');
							var html = [];
							html.push('[<a href="http://' + serv_adres + '/dhcpd.php?q=');
							html.push(user_text.textContent);
							html.push('" title="dhcpd.conf (tools.demos)" target="_blank"><b>D</b></a>]');
							newNobr.innerHTML = html.join('');
							user_field.appendChild(newNobr);
						}
						// ************ tools.demos конец ***************
						
						// ************ выделение коментов "goryunov_k" (начало) ***************
						var descr = tabl_zajavki.rows[i].cells[6];
						if (descr.textContent.search("goryunov_k") != -1){
							descr.getElementsByTagName("div")[3].removeAttribute("style");
							descr.getElementsByTagName("div")[4].removeAttribute("style");
							descr.removeChild(descr.getElementsByTagName("div")[2]);
							descr.getElementsByTagName("div")[3].setAttribute("style", "display: none");

							for(y = 0; y < descr.getElementsByTagName("li").length; y++){
								if(descr.getElementsByTagName("li")[y].textContent.search("goryunov_k") != -1){
									descr.getElementsByTagName("li")[y].setAttribute("style", "color: red;background-color: #FAFAD2;");
								}
							}
						}// ************ выделение коментов "goryunov_k" (конец) ***************
					}
				}
			}
			
			// ************ добавление панели инструментов (начало) ***************
			var status_id = document.getElementsByName("status_id")[0];
			if(status_id.value == "-1" || status_id.value == "3"){ //Если выбран статус "Все" или "Назначено"
			var newDiv = document.createElement('div');
			newDiv.setAttribute("style", "position: absolute; top: 30px; width: 100%;");
			var html = [];
				html.push('<table id="tbl_setting" border="0" bgcolor="#BCD2EE" cellspacing="1" cellpadding="1" align="center" rules="none">');
				html.push('<tr align="center" valign="center">');
				html.push('<td> | </td>');
				html.push('<td> Обновл. через ');
				html.push('<select name="sel_reload" onChange="javascript: set_cookie(\'reload_time\', this.selectedIndex, 2050, 01, 01);">');
				html.push('<option value="0">0</option>');
				html.push('<option value="1">1</option>');
				html.push('<option value="2">2</option>');
				html.push('<option value="3">3</option>');
				html.push('<option value="4">4</option>');
				html.push('<option value="5">5</option>');
				html.push('</select>');
				html.push(' мин.');
				html.push('</td>');
				html.push('<td> | </td>');
				html.push('<td>Мигание <font color="red">Ахтунгов</font> (Вкл/Выкл)');
				html.push('<INPUT type="checkbox" name="flashing"  onclick="javascript:set_cookie(\'flashing\', this.checked, 2050, 01, 01);">');
				html.push('</td>')
				html.push('<td> | </td>');
				html.push('<td>Сирена "<font color="red">Ахтунг Узел</font>" (Вкл/Выкл)');
				html.push('<INPUT type="checkbox" name="sound" onClick="javascript:set_cookie(\'sound\', this.checked, 2050, 01, 01);"> ');
				html.push('</td>');
				html.push('<td> | </td>');
				html.push('<td>');
				html.push(' <INPUT style="border:1px solid #999999;" type="submit" value="OK" name="ok" onClick="javascript:document.location.href=document.location.href;"> ');
				html.push('</td>');
				html.push('<td> | </td>');
				html.push('</tr>');
				html.push('</table>');
				html.push('<nobr name="add_player" id="add_player"></nobr>');
			newDiv.innerHTML = html.join('');
			document.body.appendChild(newDiv);
			
			// ************ Автообновление страницы (начало) ***************
			var sel_reload = document.getElementsByName("sel_reload")[0];
			if(get_cookie('reload_time') == null){set_cookie('reload_time', '0', 2050, 01, 01);}
			if(get_cookie('reload_time') != null){reload_time = get_cookie('reload_time');}
			sel_reload.selectedIndex = reload_time;
				if(reload_time > 0){
					setInterval(function() { 
						var tabl_zajavki = id.parentNode.parentNode.parentNode.parentNode;
						var id_check_kolvo = 0;
						for(i = 3; i < tabl_zajavki.rows.length; i++){
							if(tabl_zajavki.rows[i].cells.length == 11){
								var id_check = tabl_zajavki.rows[i].cells[0].getElementsByTagName("input")[0].checked;
								if(id_check != false){
									id_check_kolvo++;
								}
							}
						}
						
						var noreload = 0;
						var noreload_msg = "Автообновление страницы отменено.\nПричина:";
						if(id_check_kolvo > 0){
							noreload_msg += "\n - некоторые заявки отмечены галками";
							noreload++;
						}
						if(document.getElementById("all_description").value != ""){
							noreload_msg += "\n - поле \"Комментарий к смене статуса\" внизу страницы не пустое";
							noreload++;
						}
						if(noreload > 0){
							alert(noreload_msg);
						}
						//проверка на открытые модального окна
						if(get_cookie('open_mod_win') != null && get_cookie('open_mod_win') == "yes"){
							noreload++;
						}
						if(noreload == 0){
							document.location.href = document.location.href;
						}
					}, reload_time * 60000);
				}
			// ************ Автообновление страницы (конец) ***************
			
			// ************ Мигание Ахтунгов (начало) ***************
			if(get_cookie('flashing') == null){set_cookie("flashing", "true", 2050, 01, 01);}
			if(get_cookie('flashing') == "true"){
				flashing = get_cookie('flashing');
				document.getElementsByName('flashing')[0].checked = true;
			}
			if(get_cookie('flashing') == "false"){document.getElementsByName('flashing')[0].checked = false;}
			//=== Просто Ахтунги(начало) ===
			if(ahtung_rows.length > 0 && flashing == "true"){
				setInterval(function(){		
					for(a = 0; a < ahtung_rows.length; a++){
						if(tabl_zajavki.rows[ahtung_rows[a]].cells[8].textContent.toUpperCase() == "НАЗНАЧЕНО"){
							if(tabl_zajavki.rows[ahtung_rows[a]].getAttribute("BGCOLOR") != null){
								tabl_zajavki.rows[ahtung_rows[a]].removeAttribute("BGCOLOR");
							}
							else{tabl_zajavki.rows[ahtung_rows[a]].setAttribute("BGCOLOR", color_ahtung);}
						}
					}
				},700);
			}
			//=== Просто Ахтунги(конец) ===
			
			//=== Ахтунги-узлы(начало) ===
			if(ahtung_uzel_rows.length > 0 && flashing == "true"){
				setInterval(function(){		
					for(b = 0; b < ahtung_uzel_rows.length; b++){
						if (tabl_zajavki.rows[ahtung_uzel_rows[b]].cells[8].textContent.toUpperCase().search("НАЗНАЧЕНО") != -1){
							
							if(tabl_zajavki.rows[ahtung_uzel_rows[b]].getAttribute("BGCOLOR") != null){
								tabl_zajavki.rows[ahtung_uzel_rows[b]].removeAttribute("BGCOLOR");
							}
							else{tabl_zajavki.rows[ahtung_uzel_rows[b]].setAttribute("BGCOLOR", color_uzel_ahtung);}
						}
					}
				},350);
			}
			//=== Ахтунги-узлы(конец) ===
			// ************ Мигание Ахтунгов (конец) ***************
			
			//=== Сирена Ахтунги-узлы при статусе "Назначено" (начало) ===
			if(get_cookie('sound') == null){set_cookie("sound", "true", 2050, 01, 01);}
			if(get_cookie('sound') == "true"){
				sound = "true";
				document.getElementsByName('sound')[0].checked = true;
			}
			
			if(get_cookie('sound') == "false"){
				sound = "false";
				document.getElementsByName('sound')[0].checked = false;
			}

			if(ahtung_uzel_rows.length > 0 && sound == "true"){
				var assigned = 0;
				for(e = 0; e < ahtung_uzel_rows.length; e++){
					if(tabl_zajavki.rows[ahtung_uzel_rows[e]].cells[8].textContent.toUpperCase() == "НАЗНАЧЕНО"){
						assigned++;
					}
				}
				if(assigned > 0){
					var add_player = document.getElementById('add_player');
					var newDiv = document.createElement('a');
					
					setTimeout(function(){newDiv.setAttribute("style", "display:none");},22000);
					var html = [];
					html.push('<object type="application/x-shockwave-flash" data="http://' + serv_adres + '/ss/wind_modal/player.swf" width="200" height="20">');
					html.push('<param name="movie" value="http://' + serv_adres + '/ss/wind_modal/player_mp3.swf" />');
					html.push('<param name="bgcolor" value="#ffffff" />');
					html.push('<param name="FlashVars" value="mp3=http%3A//' + serv_adres + '/ss/wind_modal/sirena.mp3&amp;autoplay=1" />');
					html.push('</object>');
					newDiv.innerHTML = html.join('');
					add_player.appendChild(newDiv);
				}
				//=== Сирена Ахтунги-узлы (конец) ===
				}
			}// ************ добавление панели инструментов (конец) ***************
		}
	}
	//#########################################################################################


	if(!area && !change_area && page_edit_status == -1 && page_history == -1 && page_edit == -1){ //Страница распечатки (начало)

		if(get_cookie('nnz_region_id') != null){ nnz_region_id = get_cookie('nnz_region_id'); }
		if(get_cookie('nnz_region_text') != null){ nnz_region_text = get_cookie('nnz_region_text'); }

		document.title = document.title + " ( Район: " + nnz_region_text + " )";
		var title_h3 = document.getElementsByTagName("h3");
		var newNoBR = document.createElement('nobr');
		newNoBR.innerHTML = '. Район: ' + nnz_region_text;
		title_h3[0].appendChild(newNoBR);
		if(session_login){
			document.title = document.title + " [" + session_login + "]";
			var newNoBR = document.createElement('nobr');
			newNoBR.innerHTML = ' [<font color="red">' + session_login + '</font>]';
			title_h3[0].appendChild(newNoBR);
		}

		var tabl_zajavki = document.getElementsByTagName("table")[0];
		
		var found_switch_ips = [];
		var found_switch_str = "";
		
		for (var i = 1; i < tabl_zajavki.rows.length; i++){
			var description_field = tabl_zajavki.rows[i].cells[5];
			description_field.innerHTML = description_field.innerHTML.replace(new RegExp("<br><br>",'g'),"<br>");
			
			var zamen_ustan = 0;
			if (tabl_zajavki.rows[i].textContent.toUpperCase().search("ПОСТАВИТЬ") != -1 && tabl_zajavki.rows[i].textContent.toUpperCase().search("СВИ") != -1){
				zamen_ustan++;
			}
			if (tabl_zajavki.rows[i].textContent.toUpperCase().search("ПОВЕСИТЬ") != -1 && tabl_zajavki.rows[i].textContent.toUpperCase().search("ЗАМОК") != -1){
				zamen_ustan++;
			}
			if (tabl_zajavki.rows[i].textContent.toUpperCase().search("УСТАНОВИТЬ") != -1 && tabl_zajavki.rows[i].textContent.toUpperCase().search("СВИ") != -1){
				zamen_ustan++;
			}
			if(zamen_ustan > 0){new_switch_color(i);}
			function new_switch_color(i){
				tabl_zajavki.rows[i].cells[0].setAttribute("BGCOLOR", color_zamena);
				tabl_zajavki.rows[i].cells[2].innerHTML = '<b>.<font color="green">Замена/Установка</font>.<br></b><br>' + tabl_zajavki.rows[i].cells[2].innerHTML;
				tabl_zajavki.rows[i].cells[3].innerHTML = '<b>.<font color="green">Замена/Установка</font>.<br></b><br>' + tabl_zajavki.rows[i].cells[3].innerHTML;
				tabl_zajavki.rows[i].cells[4].innerHTML = '<b>.<font color="green">Замена/Установка</font>.<br></b><br>' + tabl_zajavki.rows[i].cells[4].innerHTML;
			}

			if (tabl_zajavki.rows[i].textContent.toUpperCase().search("А Х Т У Н Г") != -1){
				tabl_zajavki.rows[i].cells[0].setAttribute("BGCOLOR", color_ahtung);
				tabl_zajavki.rows[i].cells[2].innerHTML = '<b>.<font color="red">А Х Т У Н Г !</font>.</b><br>' + tabl_zajavki.rows[i].cells[2].innerHTML;
				tabl_zajavki.rows[i].cells[3].innerHTML = '<b>.<font color="red">А Х Т У Н Г !</font>.</b><br>' + tabl_zajavki.rows[i].cells[3].innerHTML;
				tabl_zajavki.rows[i].cells[4].innerHTML = '<b>.<font color="red">А Х Т У Н Г !</font>.</b><br>' + tabl_zajavki.rows[i].cells[4].innerHTML;
			}
			
			if (tabl_zajavki.rows[i].textContent.toUpperCase().search("АХТУНГ УЗЕЛ") != -1){
				
				tabl_zajavki.rows[i].cells[0].setAttribute("BGCOLOR", color_uzel_ahtung);
				tabl_zajavki.rows[i].cells[2].innerHTML = '<b>.<font color="red">АХТУНГ УЗЕЛ</font>.</b><br>' + tabl_zajavki.rows[i].cells[2].innerHTML;
				tabl_zajavki.rows[i].cells[3].innerHTML = '<b>.<font color="red">АХТУНГ УЗЕЛ</font>.</b><br>' + tabl_zajavki.rows[i].cells[3].innerHTML;
				tabl_zajavki.rows[i].cells[4].innerHTML = '<b>.<font color="red">АХТУНГ УЗЕЛ</font>.</b><br>' + tabl_zajavki.rows[i].cells[4].innerHTML
			}
			
			var id_field = tabl_zajavki.rows[i].cells[0];
			var id_text = id_field.textContent;
			id_field.getElementsByTagName("div")[0].removeAttribute("class");
			id_field.getElementsByTagName("div")[0].setAttribute("style", "background-color:#FFFFFF; cursor:pointer;");
			id_field.getElementsByTagName("div")[0].setAttribute("title", "Скрыть строку с заявкой");
			
			var newDiv = document.createElement('div');
			var html = [];
			html.push('<a style="color: #000080;text-decoration: none;" href=http://ss.pntl.ru/index.php?action=request_edit_status&id=');
			html.push(id_text);
			html.push(' class="submodal-750-650" title="Сменить статус"><font size=\"-2\">[Сменить]</font></a>');
			newDiv.innerHTML = html.join('');
			id_field.appendChild(newDiv);

			var user_field = tabl_zajavki.rows[i].cells[3];
			var user_text0 = user_field.getElementsByTagName("a")[0];
			var user_text1 = user_field.getElementsByTagName("a")[1];;
			if(tabl_zajavki.rows[i].cells.length == 6){
				if(user_text0){user_text0.setAttribute("target", "_blank");user_text0.setAttribute("title", "Вэбовский NETUP (в новом окне)");}
				if(user_text1){user_text1.setAttribute("target", "_blank");;user_text1.setAttribute("title", "Вэбовский NETUP (FULL) (в новом окне)");}
			}
		}
	
		
		
		//==================ДОБАВЛЕНИЕ ИЗ ДУДЫ (НАЧАЛО)=================
		
		
		if(nnz_region_id == id_kolpino){  // - если выбран район "Колпино"
		var switch_ip_regexp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
		var description_colll = $('table tr > td:nth-child(6)');
		
			
			// найдём все ip свичей в столбце описания
			var found_switch_ips = [];
			var found_switch_str = "";
			
			
			description_colll.each(function(){
				var matches = this.textContent.match(switch_ip_regexp);
				$(matches).each(function(){
					found_switch_ips.push(this);
				});
			});
			
		
			
			function array_unique(arr){
			  var vic = new Object();
			  for(i=0; i < arr.length; i++)
			   vic[arr[i]] = "";
			  arr = new Array();
			  for(i in vic)
				arr[arr.length] = i;
			  return arr;
			}
			found_switch_ips = array_unique(found_switch_ips);
		}
		

		//===================================================
		
		if(nnz_region_id == id_kolpino && found_switch_ips.length > 0){  // - если выбран район "Колпино"
		var description_col = $('table tr > td:nth-child(6)');
		$.getJSON(
			//"http://" + serv_adres + "/api2.php?callback=?",
			"http://192.168.31.10/ss/api.php?callback=?",
				{s: found_switch_ips},
				function (data){
					var switch_ip_regexp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
					description_col.each(function(){
						
						var append_name = function(sw_ip){
							var bla = 1;
							for(a=0; a < data.length; a++){
								if(data[a].sw_ip == sw_ip){
									data[a].dude_name = data[a].dude_name.replace("DEM ", "");
									//data[a].dude_map = data[a].dude_map.replace("DEMOS ", "");
									//console.log(data[a].sw_ip);
									return "<nobr><b>(" + data[a].dude_name + ")"  + sw_ip + "</b></nobr>";
									//return "<nobr><b>[" + data[a].dude_name + "; узел:" + data[a].dude_map + "]"  + sw_ip + "</b></nobr>";
								}
							}
							return sw_ip;
						}
						this.innerHTML = this.innerHTML.replace(switch_ip_regexp, append_name);
					});
				}
			);
		}
		//==================ДОБАВЛЕНИЕ ИЗ ДУДЫ (КОНЕЦ)=================


	}//Страница распечатки (конец)
	
	



}, false);
})();