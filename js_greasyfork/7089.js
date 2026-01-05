// ==UserScript==
// @name         WME-ScriptKit
// @namespace    com.supermedic.scriptkit
// @version      0.1.3
// @description  Tab to hold various scripts
// @author       SuperMedic
// @match        https://editor-beta.waze.com/*editor/*
// @match        https://www.waze.com/*editor/*
// @downloadURL https://update.greasyfork.org/scripts/7089/WME-ScriptKit.user.js
// @updateURL https://update.greasyfork.org/scripts/7089/WME-ScriptKit.meta.js
// ==/UserScript==

/* Changelog
 * 0.1.3 - enabled tooltips
 * 0.1.2 - AddScript/Settings
 * 0.1.1 - unsafeWindow update
 * 0.1.0 - Inital version - FSU
 */

unsafeWindow.ScriptKit = {};
ScriptKit.version = '0.1.3';


function ScriptKit_bootstrap() {
	console.info('ScriptKit: bootstrap');
	var bGreasemonkeyServiceDefined = false;

	try {
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService) {
			bGreasemonkeyServiceDefined = true;
		}
	}
	catch (err) {
		//Ignore.
	}
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined) {
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	/* begin running the code! */
	ScriptKit_Create();
}

function ScriptKit_Create() {
	console.info('ScriptKit: Create');

	ScriptKit.Start = function () {
		console.info('ScriptKit: Start');
		// Check if WME is loaded, if not, waiting a moment and checks again. if yes init WMEChatResize
		try {
			//if ("undefined" != typeof unsafeWindow.W.model.chat.rooms._events.listeners.add[0].obj.userPresenters[unsafeWindow.Waze.model.loginManager.user.id] ) {
			if ("undefined" != typeof Waze.map ) {
				console.info('ScriptKit: Start:GO!');
				ScriptKit.Init()
			} else {
				console.info('ScriptKit: Start:undefined');
				setTimeout(ScriptKit.Start, 1000);
			}
		} catch(err) {
			console.info('ScriptKit: Start:catch=>error');
			setTimeout(ScriptKit.Start, 1000);
		}
	};

	ScriptKit.Init = function() {
		console.info('ScriptKit: Init');
		ScriptKit.GUI.init();
		ScriptKit.GUI.buildTab();
		ScriptKit.GUI.buildPanel();
		ScriptKit.GUI.buildImgBar();
		ScriptKit.GUI.buildScriptsPanel();
		ScriptKit.scriptCount = 0;
		ScriptKit.loaded = true;
		ScriptKit.GUI.buildSettings();
	};

	ScriptKit.GUI = {

		init: function() {
			console.info("gui init");
			this.clearDIV = '<div style="clear:both;"></div>';
		},

		buildTab: function() {
			console.info("gui buildtab");
			var ScriptKitTab = $('<li>').append($('<a>').attr('data-toggle','tab')
														.attr('href','#sidepanel-scriptkit')
														.html('ScriptKit'));
			$('div#user-info > ul.nav.nav-tabs').append($(ScriptKitTab));
		},

		buildPanel: function() {
			console.info("gui buildpanel");
			var panelDIV = $('<div>').attr('id','sidepanel-scriptkit')
									 .addClass('tab-pane');
			$(this.clearDIV).clone().appendTo(panelDIV);
			$('div#user-info > div.tab-content').append(panelDIV);
		},

		buildImgBar: function() {
			console.info("gui buildimgbar");
			var imgBarDIV = $('<div>').attr('id','sidepanel-scriptkit-imagebar')
										.css('border','1px solid #c8c8c8');
			$(this.clearDIV).clone().appendTo(imgBarDIV);
			$('#sidepanel-scriptkit').children().last().before(imgBarDIV);
		},

		buildScriptsPanel: function() {
			console.info("gui buildscirptpanel");
			var scriptsDIV = $('<div>').attr('id','sidepanel-scriptkit-scripts');
			$(this.clearDIV).clone().appendTo(scriptsDIV);
			$('#sidepanel-scriptkit').children().last().before(scriptsDIV);
		},

		addImage: function(id,image,callback,tooltip) {
			if($('#scriptkit-img-'+id).length===0) {
				if(ScriptKit.checkID(id)) {
					var imgButton = $('<button>').attr('id','scriptkit-img-'+id)
												.css('height','49px')
												.css('width','49px')
												.css('float','left')
												.css('padding','0')
												.append($('<img>').attr('src',image))
												.click(callback)
												.attr('title',tooltip);
					$('#sidepanel-scriptkit-imagebar').children().last().before(imgButton);
				}
			}
		},

		addScript: function(id,el) {
			if($('#scriptkit-script-'+id).length===0) {
				if(ScriptKit.checkID(id)) {
					var scriptDIV = $('<div>').attr('id','scriptkit-script-'+id)
												.css('float','left')
												.css('padding','0')
												.css('width','100%')
												.append(el);
					$('#sidepanel-scriptkit-scripts').children().last().before(scriptDIV);
				}
			}
		},

		buildSettings: function() {
			var id = 1;
			var setDIV = $('<div>').attr('id','scriptkit-settings')
									.css('overflow','hidden')
									.css('height','0px')
									.css("max-width","275px")
									.css("margin","5px 0 0")

								.append($("<span>").html('HardHats (rickzabel)')
													.attr("title","Enable/Disable WME Hardhats by RickZAbel.")
													.css("text-align","center")
													.css("position","relative")
													.css("float","left")
													.css("width","99px")
													.css("color","black")
										)
								.append($("<input>").attr("type","checkbox")
										  .attr("id","SK_show_live_view")
										);
			$(this.clearDIV).clone().appendTo(setDIV);

			var callback = function() {
				switch($("#scriptkit-settings").css("height")) {
					case '0px': 	$("#scriptkit-settings").css("height","auto");
									/*WMEAutoUR.on();		*/break;
					default:		$("#scriptkit-settings").css("height","0px");
									/*WMEAutoUR.off();	*/break;
				}
			}
			var tooltip = 'Show/Hide ScriptKit settings.';
			var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAEOlJREFUeNq8WGl0VFW2/s69t4ZUVZLKIKkEyBzIACEDJCrKEKRBFKEBlW7op3YrYvM6ghPN63F1r4cDKCLaNCrKoO3AKAgiYwgBB5BMZCATkHmoSmq+47nn/UhIA3a7ut9a7+219jp177rr3K/23d/e39nE1d+PG40xhubmZug6w5kzpQgEgigrO4OUlFR8de4cMjIzUVVVhbunTOEaGxqsTU2NvgULF92/aeOGY08+tSJn/769pozMzFKO48adOnHi0gPz52P/3r340azZKDtTipTUVPT19kHTVACA0+nEPzMB/4IRQkAIgSRJkBUlMTTUNuq78+drFi568FRzc9OK/Ny8rUUzZv5t7JixeUVFM8x2e8RejuOKW5qa70pNHfNrAH+wWCxOxhijlFL8i/aD4DiOA8dx8Hq9YIzlWqyWkJ6urtDi4pX7T58u+Tg/P3/Ci2tfLrGF2oQVK/5zpaZRjBgRA0ppgd/vZ3FxcaVmc8io3Ly8SwUFt8/fv2/vS7GxsccG+vtBKQXP8z8Ijl+9evX3bg4MDAAgqK6+BEK4sZUV5XbCkczVq9ccGD06PjchPnFkRkZmjigGoes653Z7IEkyKNXB8RwI4WAwGIjVYgtjjCEvb+K9AJI0VXUXFc1c/uWRI9Lo0aPrNU2Dz+f7dyNHYLVauGPHjuomo2nsy6+s39ne3t5iNBqNqalp2cFBUAAYrrVeC5w8cbyq/vLlGk3VWIzDkZqYmJSSkJAYGx+fYLBYLFBVBQDBjxc8+Cu3x4P0jPSKhQsfzNi4ccNhAJUcxw3tdwsKj9d7U26ZTCbs2b0bR48dy7r99jvWdXZ0NEydOv1pVdMgyxJ0nUHXdVCqQ9cpAALGdNrd3VVz/vy37x/98shep9PZD2B8bOzIe/InFiyYVFCYEx4WBkmWQSmF1WrVOzrauc1vbZz76GOPXXhv69beYDD4PXSkvKJi+IJSCqvFwnV1d49f+fTT3ldeWX/JHGKx+Hx+MKYPgtJ16PT6bzoMlCMERpMJohjsKj196pU9u3dt8ng8FEDobSNifjJnztznsyfkpCqKAk2jUFVZtVjMFX19zshX1710p9Fo7FUU5eacmzZ1KpxOJ1wuF9weD55avpzFxye8v2zZ8j8oimqVFYW/Tg5eEMARAqrrYIwBDEMrA9V1iJIEneqh6emZs6dMmbrI4xlobG1trQsGAt9VVVzczYBRqWljxhEAPM/zgsE0sr72Umd+fv7l9PRMS3V1VfdN4JYuXQpBEMBxHCZNnJhWUFg4tbm5OTQhMbFIUVV+EBSPgQE3mhqbmau/n9ntdjKIjYExBgYGgA3XSUmSwPH8bXdPmfazYDDQ29jYcAGAv7m5cY/JbI5Pz8jM1dngH0xOTolMTEpZsnPHNrfP5z1BCPk7uAkTJqC/vx8NDQ1Y++KLtrkPzD85Zmz63X6/H4LBAEmSsXfPbufmzW/t3L9vz4snjh99lzGG/Pz8Caqm3UQigABDNfE6yKxx2fdWlF8s8Xg81wCguanxaPaEnLkWizXGH/DD6eznXP0uPTrS/vW8+QvCy86UXmaMMQDgt27diuzsbMybN2/i6NHxuaIoZnAc7zAYBLjdXmx47dWqfXt3/dLn9bzOGKtjTL/S0tJ8auGiB5cDMAMEhAAGgwFmsxmM6QADCMeBIwQms5kIgiHx4ncXPhgMLNP8fl9P6pj0h/3+AAhHIBgMJCklbfJn+/aN7Oxo3w5ABwDhoYcegt/vBy8IhnfefW8nIYRTFAWSrGDDa69WnCk99SiAysLCQixZuhSOmBh0dXWFWSwhXFCUIQg6OI5DbU2teP7bb+pnz5kzxm6PsFJKwRiDRimSklMnm0ymDFmWL0VGRsIeHnY21hET4HnBynEEYADPEeTlTWjOzh43c9v77x1ljFFhy5YtCAkJSTp06FBUW2trTUpq2nij0YxPPtnqOVN6ajUhpHLtiy/ikUcegcViSWA6m+71B55tamoJs1g4gAFmcwjOlJZ8ffjQwZl33TX545Tk1EVerxf+QACSpMDhiDXGJyRObWy4fKm4uBjjxo9nOgSis0GiDZYxDlOnz/qPLZvfymKMnQPgIbGxsYiLG3n36xs3HXfExhkp1VBbW4dHH1n6utfjXvXc889j1apVs4Oi/LQkyVNkWbEoiorricugQxCM6O7q7PH7PHvSM7IWd/X0RsqSDAYGQjgYjUaUf3e+euf2rQt37NyJ0DD7msbma4/pOgUBGW6VHo+bvf/uX19rbGzc1N7edo3MmXMfHxMTMzI+IeHlJ5YtX8wY8OvVL7R9+MH2H82aPbv+lXXri63W0I2yrA7m0y0KxmwOgcfrxbWrV+F2uyEYTEhOToIgCJBleZgcRqMRVFNlXhA4VdUMjDHcyExCCARBQG9PD37/u//aXVV5cbHQ0tIc9tMlS7+899770qlO0d7WgUOfHzhgs9nqH33s5/dHR4/YSKkOg8EIgGGQRwAYgzkkBF8c/gIbNqwvq6urOaAqSpPFYo2YOKlwznPPr16YmZkFURQxFBwQQkxMZ38n9w3AGGOwhFiw+9OPOhsu174DEIro6Gg4YuNmXSyvlHSdsZ0ffKwBmDPjnpnmxqaWKz5/kPUPeFj/gIe5+j2sf8DLXP0eFhQV9tHHe3ST2fwOgJhbW8/o+IQVFysu6U6Xh3V297Gubifr7Or7nnd1O1lPbz97483NwbaObtbR1UtXr/ltG8/zBZg7b/6cyqrqVlGUdMYYK356VSeA8I2b3nyGUp3JssKkIb/R3B4fS8/ILAEQ+c9Uxc9/8fjfrj9PKWOqSlkwKN3kqqqxr785r824Z+ZFTaOstLSMCgbDXwA4AMB+z8yZ74miyBhj7O4pU8tGxMSMarl6tYvdYp/u2i1Omzb93ImTJ53lFZUMwFM/pMdiHI7ZwWCQbdz4hqeo6J6zVdXVgRv304fWJ598qvXOO+98mzHGPB6P/tvf/f4rk8lcyE2ZNj2juLg40WAwQJJENDU21s+dO/dnSQkJDl2n0HUKnQ2K123btlWVlJy6s7S0dI/HMwAADTeBiYmBw+FAZGQUoqKiYTKaWp0uF958c9PRkyePT75w4fzFQYGhgVINBEBbWxu279h2JCExsQ8AXC4nvjxyxKhp6kihuqrScuL4iYgpU+4e6omc/tBDDy7RqAZJEodbkyAI+M1v1qRPnz7tg6VLl9zb3t4OQRBs2lALM5lM+NOf/wyv14fDhw9D1xlGjR6VFhZmw2uvb5jc0dH50X333TfJ5/cOSS3AFhqKLVveESVR3DF27NhlVNcAAhIWHl7LGDsu2Gy2ElXTDoqSnOP3B1heXl72hJzcTJ/PD0rpIKsYoGoBjB2bHjZufPYSSRSRmJSM6UUz5h07+uVnAGC322G1WpE2ZgxMZhNqa+sxY8b0xzVNx+TJk2M5jlssiiJ8/gAAAoPBgJqaBrz99ttfADibNW7cBlFS4HQN6HZ7xGye5+cJNltoVmJS0hMul5sKAk/m/3jheAaO+ALidVxQFHVIqYrDn9BoNOJ3v//j0s6OjpM1NZc+oJRC0zRoGkVKSgoSEpKK0zMy7u93+8CG68/fS4fZTLB+3auevr6e1woKCyOSU8ZkeH1B1NU1yIcPHXxBVdXdvLOvr6e2pqYkf+KkBxISk8Pi4+MNYlCEqmpQVQ1+fxCKqgGEB6UMoiRBVlSIogRbaDg/c9bsH0dGRsaHmM3Izc0NCwsLv8titf139AjHSlWlkGQFiqIOu6ZRCAYTDh44iPXr1q5njG1/YtmTCyfk5j/s9fnh9wcMfb3OtJbmxl0kLCwMvype9fbMWbOfiIiIAADojIGAQFYUUKrD4/WgurKShoRYkJefxw8GYrAgCwIPk9kMAgzmLMcNSXh9WOMBBDzPQzAI0DSKc2VleGntn3b19XYvW7x4seexx5edD4+IzucIwQvPrjxecurEWgDlvCzLOFN6+nJjY0PfrNn3TtNUSiilkCQZoiTD6/XiN6ufL9u5feuzXxw6sCU2Ni5rzNj0kZIkgVIKVVVBdYrPP/vM/eq6l48lJCRGRkRFWRVZhqbRQQnPcejq6sK5sjL93bf/Wv/+1i1v+XyePxQUFAxsfGPTAp3xKwOBICRRAs8bR1RWlu+QRLFBcDgcGDEi5uqqVc9NHXB7iNFohE51BIJBCAYDmpua9IryC+sAHACA48eOrC2aMXOfJEnDkSEEqKut/q6j/eoDPNH3yJK4QFEUEEJAKcWuTz7uPHrk8P6enq6TAL4F0JaTk4Pt27eHirL6stPlhNVqw+eff9ay9Z0tmyVJJADAB4MiXC4n9/nBgwG/1x24447JOb19fZAkCZqmIRgMsBPHjm6iVGsHgIDf3zNtetGTjDGzoihQVRViUERmVtaInyz+6ayIqOii/v5+QdM0gDE01Nerr65buyIQ8L8MoM5qtXpXrFiB7du3EQZ+d0Xlpds1dbBsqSoNv3jh/Cter+c0AAhJyckAY2pOTs6uhxb/5NGWK1chy/Iwq0JtNi49PSOvsrL8awBwu90DF85/e2LipMKFoijeyEBbMChNpZSC4wa7+vU8A0h1eHgY3njjDUybNg3x8fH21vaOzSdPnblf0zRYrVacLimp37937y5/wGcfPkNERUWDIwQul4vft3evsbnp8tVJkwoK+gcGiCzLUDUNo0aNSv76q7M7KKUKALS3tbWMG5f9mEYpL4oiZFmGJEmQJAmKIkOWB10UgzCbzXxcXKw5Nzencs2aNREmk3lRadlXO06eKp0SDAZBqQa32wOvxx9ytqxkWTAY/OrGU8mwRUVF4Zlnn3/O4/WvM5lMGuF4gTEdVqsNzY31H7639Z2l1+cwWVnjl82dt+AvFquF1zQK3FLLbtR8oaGhCLeHS0zXidPVbwoEAhB4HoTjYAkJwe5dH+1pbW39xuN2n5Vl6dxw5G7drLy8XD139szp3Ny8FKqzWDEYgM/nQ1T0bdnp6eljmpubjkmSpPT19X53ub7uotlkmWSxWqNUTYUsSZAV+SZXFAVenxc93T1Cb2+vEBSDoJoGVVWhKpJy5cpV0e8P+upqq5+gVGu76dx644WmaQgEAp2pqWmtISHW4qtXml32iMiIoBgkXq8HZott/MRJEx8wGY2dTqfzsts90FBXe+nD7u4uCLxhjMFgtA72ZAmKokBVlOFV01RoQ6AUVQVjDF0dXdKuTz9c3Nfb862qqh0AFNxy2PxHoy9e1/W0jIzMcQWFk3cFgwHdYDRy12tWZGQECGEX6mtr3nS7B453d3d3uJwuR5jd/ouUlLSHR8cnjOU53qiz7w9nBIMBVNPw7dfn9lustviGhrpVsiSV/uNx0g/qsdjxiiwvi4uL4zKysn+pyDLIUAfgeQ6hoaEIDbWJPM/XyZJY73YPtPn9fsFgMEy0hYblBwKi7Xpf5Xkeuq6jo721QTCYRlVXXnw6EPB/BMAEoP/fBnfdRo1OeFDTtOcslpDG1LT0JZqmQhAEMAZoVANHOAgCD6PRCJ4XoKoKVFUDY4ORprqOnq7OK0ZTSNKlqvIXNE07CcBKqVb6gxPVf3ECagJgCbdHFJqMppeoTk8lp6St9Hk93VFRtzkUVYHBYIBOdRBCoOs6U1WFcjwvdLRdOxFuj7yr4XLtMwaDsZdSTdM0bT/+D8wIIFYQBIctNOwggBmj45PajEbj5viEpAp7ROSFqOjbPnHEjnTxvPDz20Y4GgEUCIJwHyHkTvw/WsjQSb0IQAwvCFMIIYsAhHEcv3zoq6QCsP9vX/A/AwDAFGqC0n8+FAAAAABJRU5ErkJggg==';
			ScriptKit.GUI.addImage(id,image,callback,tooltip);
			ScriptKit.GUI.addScript(id,setDIV);
		}

	};

	ScriptKit.checkID = function(newID) {
		if(newID > ScriptKit.scriptCount) {
			ScriptKit.scriptCount = newID;
		}
		return true;
	}

	ScriptKit.Start();
}
$().ready(ScriptKit_bootstrap());
