// ==UserScript==
// @name        VASlackUnlock-SK
// @namespace   com.supermedic.VASlackUnlock
// @description Allows editors to post unlock requests to Slack.com channel.
// @version     0.3.4SK
// @grant       none
// @match       https://www.waze.com/*editor/*
// @match       https://www.waze.com/editor/*
// @downloadURL https://update.greasyfork.org/scripts/7714/VASlackUnlock-SK.user.js
// @updateURL https://update.greasyfork.org/scripts/7714/VASlackUnlock-SK.meta.js
// ==/UserScript==


var version = '0.3.4 - FSU';

function VASlackUnlock_bootstrap() {
  console.info("VASlackUnlock: starting (bootstrap)");
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
			var dummyElem   = document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	/* begin running the code! */
	VASlackUnlock_Create();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------------  VASlackUnlock FUNCTIONS  -----------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
/**
 *@since version 0.10.0
 */
function VASlackUnlock_Create() {
	unsafeWindow.VASlackUnlock = {};
	VASlackUnlock.version = version;
	VASlackUnlock.logPrefix = 'VASlackUnlock';

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//-------------  ##########  START CODE FUNCTION ##########  ---------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	VASlackUnlock.startcode = function () {
		console.info(VASlackUnlock.logPrefix+": startcode");
		// Check if WME is loaded, if not, waiting a moment and checks again. if yes init WMEChatResize
		try {
			//if ("undefined" != typeof unsafeWindow.W.model.chat.rooms._events.listeners.add[0].obj.userPresenters[unsafeWindow.Waze.model.loginManager.user.id] ) {
			if ("undefined" != typeof Waze.map ) {
				console.info(VASlackUnlock.logPrefix+": ready to go");
				VASlackUnlock.init();
			} else {
				console.info(VASlackUnlock.logPrefix+": waiting for WME to load...");
				setTimeout(VASlackUnlock.startcode, 1000);
			}
		} catch(err) {
			console.info(VASlackUnlock.logPrefix+": waiting for WME to load...(caught in an error)");
			console.info(VASlackUnlock.logPrefix+": Error:"+err);
			setTimeout(VASlackUnlock.startcode, 1000);
		}
	};
	VASlackUnlock.init = function() {
		console.info(VASlackUnlock.logPrefix+": starting (init)");
		// --- Create Tabbed UI --- //
		VASlackUnlock_Create_TabbedUI();

		VASlackUnlock.showDevInfo();
		VASlackUnlock_TabbedUI.hideWindow();
		$(document).tooltip();

		Waze.selectionManager.events.register('selectionchanged',null,VASlackUnlock.SlackInterface.addButton);
	};

	VASlackUnlock.Segment = {

		run: function() {

			console.info(VASlackUnlock.logPrefix+": Processing");

			var ta_val = $('#validatorprocessor-input-ta').val();
			var initialObjects = JSON.parse(ta_val);
			VASlackUnlock.Segment.finalObjects = [];

			for(var i in initialObjects) {
				if(isNaN(i)) continue;
				var tmp_init_obj = initialObjects[i];
				var tmp_fin_obj = {};
				var lLObj = new OpenLayers.LonLat(tmp_init_obj.lon,tmp_init_obj.lat);
				lLObj.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
				tmp_fin_obj.lat = lLObj.lat;
				tmp_fin_obj.lon = lLObj.lon;
				tmp_fin_obj.zoom = tmp_init_obj.zoom;
				tmp_fin_obj.id = tmp_init_obj.segments;
				VASlackUnlock.Segment.finalObjects.push(tmp_fin_obj);
			}
			console.info(VASlackUnlock.Segment.finalObjects);

			VASlackUnlock.index = -1;
			$('span[id="VASlackUnlock_Segments_selected"]').html('0 / '+VASlackUnlock.Segment.finalObjects.length + " Places selected");
			window.setTimeout(VASlackUnlock.Segment.gotoNextSegment(),750);
			return;
		},

		gotoPrevSegment: function() {
			if(VASlackUnlock.index === -1) {
				VASlackUnlock.index = 1;
			}
			if(VASlackUnlock.index > -1) {
				VASlackUnlock.index--;
				var currentSegmentOBJ = VASlackUnlock.Segment.finalObjects[VASlackUnlock.index];
				var currentSegmentID = currentSegmentOBJ.id;
				Waze.map.setCenter([currentSegmentOBJ.lon,currentSegmentOBJ.lat],currentSegmentOBJ.zoom);
				window.setTimeout(VASlackUnlock.Segment.selectSegment,1000);
				console.info(VASlackUnlock.logPrefix+": index " + VASlackUnlock.index + ' : ' + currentSegmentID)
				$('span[id="VASlackUnlock_Segments_selected"]').html((VASlackUnlock.index+1)+' / '+VASlackUnlock.Segment.finalObjects.length + " validated segments");
			}
			return;
		},

		gotoNextSegment: function() {
			if((VASlackUnlock.index+1)<VASlackUnlock.Segment.finalObjects.length) {
				VASlackUnlock.index++;
				var currentSegmentOBJ = VASlackUnlock.Segment.finalObjects[VASlackUnlock.index];
				var currentSegmentID = currentSegmentOBJ.id;
				Waze.map.setCenter([currentSegmentOBJ.lon,currentSegmentOBJ.lat],currentSegmentOBJ.zoom);
				window.setTimeout(VASlackUnlock.Segment.selectSegment,1000);
				console.info(VASlackUnlock.logPrefix+": index " + VASlackUnlock.index + ' : ' + currentSegmentID)
				$('span[id="VASlackUnlock_Segments_selected"]').html((VASlackUnlock.index+1)+' / '+VASlackUnlock.Segment.finalObjects.length + " validated segments");
			}
			return;
		},

		jumpToSegment: function() {
			var newID = Number($('#validatorprocessor-jump-num').val())-1;
			if(newID<VASlackUnlock.Segment.finalObjects.length) {
				VASlackUnlock.index = newID;
				var currentSegmentOBJ = VASlackUnlock.Segment.finalObjects[VASlackUnlock.index];
				var currentSegmentID = currentSegmentOBJ.id;
				Waze.map.setCenter([currentSegmentOBJ.lon,currentSegmentOBJ.lat],currentSegmentOBJ.zoom);
				window.setTimeout(VASlackUnlock.Segment.selectSegment,1000);
				console.info(VASlackUnlock.logPrefix+": index " + VASlackUnlock.index + ' : ' + currentSegmentID)
				$('span[id="VASlackUnlock_Segments_selected"]').html((VASlackUnlock.index+1)+' / '+VASlackUnlock.Segment.finalObjects.length + " validated segments");
			}
			return;
		},

		selectSegment: function() {
			// will select more than one object
			var segmentObj = Waze.model.segments.getByIds([VASlackUnlock.Segment.finalObjects[VASlackUnlock.index].id]);
			console.info(segmentObj);
			console.info(Waze.selectionManager.select(segmentObj));
			return;
		}

	};

	VASlackUnlock.SlackInterface = {

		addButton: function() {
			var unlockButton = $('<button>').addClass('btn btn-default request-unlock')
											.html('Request Unlock')
											.attr('type','button')
											.click(VASlackUnlock.SlackInterface.getInfo);

			var unlockComment = $('<input>').attr('id','request-unlock-comment')
											.attr('type','text')
											.attr('name','slackUnlock-request')
											.css('width','100%')
											.css('border-radius','5px')
											.css('margin-bottom','8px')
											.css('padding-left','5px')
											.attr('placeholder','Unlock Comment...');

			$('#segment-edit-general .form-group .street-actions').append(unlockComment);
			$('#segment-edit-general .form-group .street-actions').append(unlockButton);
		},

		getInfo: function() {
			var editor = Waze.app.attributes.user.userName;
			var nRank = Waze.app.attributes.user.normalizedLevel;
			//Waze.selectionManager.selectedItems[0].model.attributes.id
			var segs = [];
			$(Waze.selectionManager.selectedItems).each(function(k,v){
						if(v.model.type==='segment') {
							segs.push(v.model.attributes.id);
						}
					}
				);
			var transCtr = wazeMap.getCenter().transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
			var segStr = segs.join(',');
			var pl = 'https://www.waze.com/editor/?env=usa&lon='+transCtr.lon+'&lat='+transCtr.lat+'&zoom=3&segments='+segStr;
			VASlackUnlock.SlackInterface.sendToSlack(editor,nRank,pl);
		},

		sendToSlack: function(un,lvl,pl) {
			console.info('sendToSlack');
			var slackURL = $('#VASlackUnlock-URL').val();
			var slackCHAN = $('#VASlackUnlock-CHANNEL').val();
			var msg = $('.street-actions #request-unlock-comment').val();
			$('.street-actions #request-unlock-comment').prop('disabled',true);
			if(Waze.model.actionManager.actions.last().subActions.last().newAttributes['slackUnlock-request']) {
				Waze.model.actionManager.undo();
			}
			//$.post("https://hooks.slack.com/services/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",
			$.post(slackURL,
			{
				payload:'{"channel": "'+slackCHAN+'", "username": "WME_Unlock_Bot: '+un+' ('+lvl+')", "text": "'+msg+' <'+pl+'|Link>"}'
			},
			function(data,status){
				console.info("Data: " + data + "\nStatus: " + status);
			});
			return 0;
		}
	};

	VASlackUnlock.showDevInfo = function() {
		var info_txt = '';
		info_txt = info_txt + 'Created by: <b>SuperMedic</b><br>';
		info_txt = info_txt + 'Idea From: <b>eeschuler</b><br>';
		info_txt = info_txt + '<b>Stephenr1966</b><br>';
		info_txt = info_txt + '<b>ct13</b><br>';
		info_txt = info_txt + '<b>triage685</b><br>';
		info_txt = info_txt + '<b>eeschuler</b><br>';
		$('span[id="VASlackUnlock_TAB_Info"]').html(info_txt);
	};

	VASlackUnlock.on = function() {

	};

	VASlackUnlock.off = function() {

	};

	VASlackUnlock.startcode();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create Tabbed UI  --------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


function VASlackUnlock_Create_TabbedUI() {
	VASlackUnlock_TabbedUI = {};
	VASlackUnlock_TabbedUI.init = function() {

		var venueParentDIV;
		if ($("#VASlackUnlock_TAB_main").length===0) {
			venueParentDIV = VASlackUnlock_TabbedUI.ParentDIV();
			$(venueParentDIV).append(VASlackUnlock_TabbedUI.Title());
			$(venueParentDIV).append($('<span>').attr("id","VASlackUnlock_TAB_Info")
											//.click(function(){$(this).html('');})
											.css("color","#000000"));
			$(venueParentDIV).append(VASlackUnlock_TabbedUI.EditorTAB());

			VASlackUnlock.showDevInfo();

			// See if the div is already created //
			//$("div.tips").after(venueParentDIV);
			console.info("VASlackUnlock_TabbedUI: Loaded Pannel");
		}
		if (ScriptKit.loaded) {
			var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAA0pSURBVHjalJhZkF1Hecd/vZz13lk1o2VGI41lbGRjxxAksDG2BV7KTkwKUqlAZSEuJzy4Ki+pFFXkIVBAKlXkgQceUpXwwENIXlxhSUIqNiCwLWyIJceLrHW0jqSRZl/ucpbu/vJwx9LIGAv6Vtepc+65p3+3v6+/8++/koUlusDpsmBe2FzW5geLS6vvKWJDF0GCAieg+JVN62tfCh5lc8LyLN1zT0GtIRqC4HjrISKCUqrXNaS2n8nRPf+1aWDrP90y9r4DZtOY9hqxAFopTizPfv6Fudm/Hhmd3OK0ENuEug6gQMead2tKbSS3BO+I8oRV14dpnUDsZUQ2wgVC6AEao6mc59z8oT/ZnL/nDxvxk1+ZGBz4WlQ3nPnon3+W5xamv/jVYy/+/cxau3nLyE3YKKfuOKy3WAwq6Bt0UEFd7d4oJM+pV2fw7UP4EPAYAqrXRSNag+pdMxiMciz4S+bIxbMfH+rfpcaHd/7Edrzs+/aJ17604gO1LDO7MsvkyCTeghhFHTxCeNeZE5FrsyiKtIaWiskHPsLqlX8H3walYP02pQEUYf23tQ8oFTB4NvmjtF79xufbm+88a8+udb55or2s+23KSig5tTrHtsEJcIpgA055jChuENeNqIhxmMpB/yQ23oUqDiF6AHwXoxy1URQCqg5ExAwnhptSw640ZSKrsfq1NEx/95v2hQvHt1UGKiM0TM5Kd5WuVDRUQlXVGKvQN4J7W6uDQyuPyoeJR+9hdep5olhAN+j6BKkDQ9ZzUyNwawNGc0VfFDPoQHvDmitoTf9w1Z4oFusoiiiCIwuahdY8s90Fbm5OQLdCG81v2kQiRCoql6Abv03HbiV3C2wxa4xnCRNZxHhmGc4zkuCoqw5l6NASCyaBJGOQRazElr7SsaIDXkElXS4uXWKyOYbVEQoIN8i5DfFFgGCaKLeCChWbhm/n1m1jbPElk319jOqaODjqUFMXjlLFmKRJpjxFXSESiLzQKips5GAtBDJlMUYTcFxaXaTtahooKjw6QCwWFxS18pgIImMhBLwLoBPqUOGlBg1D3jOexoz1pYzmTcbi+4mnztFyJYqKVpyiVApUaBzKB4I3mKB6C0M0rleUhEpDLgoXBAIslW0WO8v0NTYhuKsJr5OISMUoV1MET6UDEglJ3aafwHgWsa2Zsy1LGLExQ0pABTrZg7Tl3/CmwIcMHwriECOAoHECKIcyAJoawcSCZb00ytW1pui6LheWLjA5NIruKqy1SGSoXEnpPShD7CpGlWFYR0z2a7YNNtiaGdJQIQQkFBRiUCYiGfgwKwM3Ea++RC2biMUh1yUDv3SO0IPbWAasjelIyfTyeTrVboxKqIMQqprI1TQRhtLARF/GrjxjrNkgz1IINR4P2qLR1EpRuJpQOlSckY0+hlr4GUXeIiotYuWGGWy9ElAKpTTiHUopEhsx124xv7bMeGMEX3fYmqbs2jLEDhOxM4nQqSKODZfOXuC5V4+wODNPsVbQSJsMjQ6x49Zd3Ppbt1L5NbpqgXzgEdrm61hVEGQAVHX9dL0TXBUClQRSs77aQiALiraBpfYMn9g5wTbbYDJvMGAFqWpqXQGGHzz9I57+5ndYvjRLrCM0msrV6ESTZilj7x3nc3/zOXbcvB3inVQDd5GtvElIHL9OAbCNKGOxWxBcjTGWpGHpSyLGMs1gs+aOTQnba0VVl3Rq8LFBG8PL+1/in//hH+lTDfqbA3gjBPE0dExnbY2i1eXUGydoX1olublJlQXywY/QXnyNDBCiG8MZKehLDaN5P0meEXTJUJrSoeZid4nTS5fZPDSG04ZaK8Rq4tqy//s/xVYRUW7JhjIe/vQn2L5rnHp1lVPHT/PjHz7Pjsmd3Pb+OymLNeokJxl6hCp7GnELoGNuFFc7MpwRRymDUUYtAa0NwZXUGkpleHNxifc3d5IokG6BzWOqVsn89CJ51s9yscx9DzzAp574JCUl1lXc8zv3c8/jHyNIQJoaXxXUorH5baR9t1LNH+hVJ6XpxfedIXWeJGRZihdPwOOVotaGFINVgVeqWaqywngBo6nxYMDh8BIwNmZq6iwnDx3HLZd0uw7vFJPvnWBy9xjSLVGSYaoKn0bQfAxlK4IIEgwiglC/I5y5/YlPfqEwpCas56hS10SvUviy4pbGMDv7h3ESCMoRx4aLp6c5+eoxRhrDzC0s8MKPn+PQSwc5+cYUF0+ew4hieGSUKni0VYhT1AKZcXQWfopRq+siVQEa9Tap7UkKc/sTn/pCad8ZTqPoViVRbNkzON4r0QJJHDMxOcHxo8e4fPEKSsBXjvmZeaZPnefoq0d4/pkXmLlwmbv23ImJDdol1MYRJUP4lTfQxXnQesNI/GZwAF5DZQL39e0gtQZXeMRp8s0N9nx0D32D/fiywktAQkA8GBvTjPt54/9ew8ae9+/9AOITfOJxMkDaPkdYfBOsQpQHAXN11N4xEL87nAA5hjlKPtDYwk7bj4k1zgbKUhgcHuKOD+zm7o/dy959e7lt7230j/dzeeYioagxGK4sLLHv0Y9jUkGHgFYKLU2Kxf8g1DM4laNFsCJopdfhFC7OCv3uAgi8DwQXOLJ6BRcbgve9PVar5ujBI3RbJWZAsWnnMB/at5cn//JJ9t5/L7OL871hak9dVqAFBFSocZtuph65F1un9OsIjFBYRZ2Azz0hdvg59fZ36zuoWhWIg+J/ly/wyPbdbFOWSBn2P7Off/nWt9n36D7uefRDbNm8hSRJWFhYZPrMRfoa/XjnaPSl5I0UCW+Vi0CsMwaSuyj0dyiTLl4Fskph5iJaU47l42uUp2ZuDCeRJQlwvF7i7NIsE6OTtNpt9n/vGbqzbZ79/n4OPHuAsbExms0mZ86coVwpyFTMQtni7kceIMpTqrq6+kynNPH4B1ntbEOd69I4BStH1lh6cwamarJWRDS66cZwBjBBKA38bPEC943cjE0T9vzuR5lbXaGYX6PuBs4vnsEFj1dgbY6oiod+70Ee/v2HwZUYhNBM0WjKxTXkoME9PcnCz/8bNZMSr1WYSIPOKPOAa+obwykfEBSZTTi5tsh80aKhPH/0F5/hoQc/xsHnfsGbx46xOreAlDWptgxuHuF9D93NBz9+N0msEBXhljr4g6foPvMq/ievY46swtoCjczTtQHJ7YYxAfk1ck6C4LQiVZbZ9gqHy3n29Y3SWVlk0/ZBHvuzx3ms+yhdPC1XksQxWSIYk+OXuhQHzlI8dxz2HyV6ZZpIFC6LqPv6KId3ULVPEnXnEZ3+8rv1eql5TZUqrtkjDkHXnrYJ/HxxmvsHJ4iSiLKsCHVFYiKcVTSTDLXapX14lvD8FNX/HKb72gUalaPWQjmUYbAkQaED+G6OC1txdgFzddQNcL13W+9yJArvA5GNcAQKAspojBdM7TBW88rSNAtlm6EkRURh0oxuqyR6fZbi2TdovXgce/gyaqlLoiNMkhCaMcY7Yhsh0ts0GV3QDP1Y2UlbHyOEDdMhChHBKrmmCSIBbzRBArEXMgxIoKsDnRQSE7Eontf8Cvd1LOboRToHprA/PUZnah5/uU2iYkIi0Ewp3zIdPCgMVekAwagIEYfXmmAHqV2CIVyF0yhcJFiLQq27IQ7B1w6bplQqoCtHpBRxmhInKWG5TefUAgee/i57DgvpGzO0Wy2c1OQmgTShNL0/qfhl16y3iVOgAiIWEY/RCbEax3NuvTb0WqIMVgcwogkq4JWQ24QKoWuERm5xlaaaWoZfnMY9N4U6ucDrpebswG5GdQQmoikZYhQh0kQIyvsbWCsegkHwRDYlcjtwnEatw0kQyhJsw8bpZd8hF02VWMrIYFo1oxfadA6dYu3FKfTRBfRyt2cKNlOuRCXTpmZCUlSeEJTF1RXaexIUlVJvk4/CBiNqffugESUoZTB6M0FH2FoI2lCpkmjHJPbDY7u+dejiy0+N6GG6J69gXr9I6+enWHv1CumqxsSCZIYw3I9CkFBhgvCyWuMeN4T3nrAuFoOGYmMSX/VOro+xiEKt75hrLxgzSlqP46IzVEkTN1Ow6cGH++3efPTLu3925fGTz/xoYuBMRfvyElYUaZ7SGQ4IQizXe3B1pDnfXWKmOc72Aopogw0mv67b89YhkISUoHfR1sdgriDfdfva0Gc//ZQe37J19jMjd3xFvXhSOhfmSPsGSfv7CQiJE1JRG9yAXrIDnA9tXmcZpXvL/t36rzIcRXritZCCTjSGavXRyobo/9qXvh5PbP5X87df/Ds7Nrb94Jbb33Ph3Ilj987NX8pb1RqV1Xhj8BIg9GYwiGBdwEmgqxwZ8EE71PN4bwAnGz/BIyGgRBAfKEKbZM2hdvSVI9/4/FdH/+CPv1woUK2uJ3Ka6QuznDl26KbDrxz+q9dfevNP586v4AJIqLB6g2WKp1Ie6y0jKJ4yOxm1Ke7d4qmuP1FBcErITISrHW7nAM0P3/Sfw3dt/UZy99hBv+VOhffy/wMAlbjvzygzmY0AAAAASUVORK5CYII=';
			console.info("VASlackUnlock_TabbedUI: Loaded Pannel");
			var tooltip = 'Show/Hide ValidatorProcessor';
			ScriptKit.GUI.addImage(5,icon,VASlackUnlock_TabbedUI.hideWindow,tooltip);
			ScriptKit.GUI.addScript(5,venueParentDIV);
        } else {
            window.setTimeout(WMEAutoUR_TabbedUI.init,500);
        }

	};

	VASlackUnlock_TabbedUI.hideWindow = function() {

		switch($("#VASlackUnlock_TAB_main").css("height")) {
			case '30px': 	$("#VASlackUnlock_TAB_main").css("height","auto");
							$("#VASlackUnlock_TabbedUI_toggle").html("-");
							//VASlackUnlock_TabbedUI.AddForm();
							VASlackUnlock.on();		break;
			default:		$("#VASlackUnlock_TAB_main").css("height","30px");
							$("#VASlackUnlock_TabbedUI_toggle").html("+");
							VASlackUnlock.off();	break;
		}
	};

	VASlackUnlock_TabbedUI.ParentDIV = function() {

		var MainTAB = $('<div>').attr("id","VASlackUnlock_TAB_main")
								.css("color","#FFFFFF")
								.css("border-bottom","2px solid #E9E9E9")
								.css("margin","5px 0 0")
								.css("padding-bottom","10px")
								.css("max-width","275px")
								.css("height","35px")
								.css("overflow","hidden")
								.css("display","block");

		return MainTAB;
	};

	VASlackUnlock_TabbedUI.Title = function() {
		console.info(VASlackUnlock.logPrefix+": TabbedUI create main div ");

		// ------- TITLE  ------- //
		var mainTitle = $("<div>")
						.attr("id","VASlackUnlock_TAB_title")
						.css("width","100%")
						.css("text-align","center")
						.css("background-color","#E3186A")
						.css("color","#000000")
						.css("border-radius","5px")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.html("VASlackUnlock " + VASlackUnlock.version )
						.dblclick(VASlackUnlock.showDevInfo)
						.attr("title","Click for Development Info");

		$(mainTitle).append($('<div>').attr("id","VASlackUnlock_TabbedUI_toggle")
									  .html("+")
									  .css("float","right")
									  .css("position","relative")
									  .css("color","#FFFFFF")
									  .css("right","3px")
									  .css("top","0")
									  .css("background","#000000")
									  .css("height","16px")
									  .css("width","16px")
									  .css("display","block")
									  .css("line-height","14px")
									  .css("border-radius","5px")
									  .click(VASlackUnlock_TabbedUI.hideWindow));

		return mainTitle;
	};

	VASlackUnlock_TabbedUI.TabsHead = function() {
		console.info(VASlackUnlock.logPrefix+": TabsHead");
		// ------- TABS  ------- //
		var mainTabs = $("<div>")
						.attr("id","VASlackUnlock_TAB_head")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.attr("title","Click for Development Info");
						//.html('<ul><li><a href="#tabs-1">One</a></li><li><a href="#tabs-2">Two</a></li></ul>');
						//.tabs();
		var tabs = $("<ul>").addClass("nav")
							.addClass("nav-tabs");

		$(tabs).append($("<li>").append($("<a>").attr("data-toggle","tab")
												.attr("href","#VASlackUnlock_EDIT_TAB")
												.html("Editor")
									   ).addClass("active")
					  );

		$(mainTabs).append(tabs);

		return mainTabs;
	};

	VASlackUnlock_TabbedUI.TabsBody = function() {
		console.info(VASlackUnlock.logPrefix+": TabsBody");

		// ------- TABS  ------- //
		var TabsBodyContainer = $("<div>")
							  .attr("id","VASlackUnlock_TAB_tabs")
							  .attr("style","padding: 0 !important;")
							  .addClass("tab-content");


		return TabsBodyContainer;
	};

	VASlackUnlock_TabbedUI.EditorTAB = function() {
		console.info(VASlackUnlock.logPrefix+": EditorTAB");

		Tabs_Main = $('<div>').attr("id",'VASlackUnlock_EDIT_TAB')
							  //.css("padding","10px")
							  .addClass("tab-pane")
							  .addClass("active");


		$(Tabs_Main).append($('<input>').attr('type','text')
										.attr('id','VASlackUnlock-URL')
										.attr('placeholder','URL to Slack integration...')
										
										.val('https://hooks.slack.com/services/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')
										.css('width','100%'))

					.append($('<input>').attr('type','text')
										.attr('id','VASlackUnlock-CHANNEL')
										.attr('placeholder','Channel to post to (#unlocks)')
										.css('width','100%'));

		return Tabs_Main;
	};


	VASlackUnlock_TabbedUI.init();
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  END Create Tabbed UI  ----------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------  WE HAVE FOUND OUR BOOTS  ------------------------------------------------------------------------------------------
//-------------------------  NOW LETS PUT THEM ON  -------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
VASlackUnlock_bootstrap();