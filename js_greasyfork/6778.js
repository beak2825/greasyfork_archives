// ==UserScript==
// @name        FastRecall
// @namespace   FastRecallNamespace
// @author      [TSN]Kanly
// @include     *.ogame.gameforge.com/game/*
// @description FastRecall for Ogame: Allows you to recall fleets from the  events list drop down bar
// @version     1.6
// @downloadURL https://update.greasyfork.org/scripts/6778/FastRecall.user.js
// @updateURL https://update.greasyfork.org/scripts/6778/FastRecall.meta.js
// ==/UserScript==

var scriptFunc = (function() {
var Recall = {
    getMovement: true,
    getEvents: true,
    pendingMovement: false,
    pendingEvents: false,
    availableMovements: [],
    availableEvents: {},
    currentPage: "",
    universeFull: "",
    missionType: {expedition:15, deploy:4, acsAttack:2, attack:1},

    init: function() {
        var observer = new MutationObserver(Recall.initAppendRecall);
        var target = document.getElementById('eventboxContent');

        Recall.universeFull = document.getElementsByName("ogame-universe")[0].content;
        Recall.currentPage = (window.location+"").match(/page=[^&]+((?=&)|(?=#)|)/g)[0].replace("page=", "");

        /* Disable FastRecall on fleet1/2/3 and movement pages */
        if (Recall.currentPage !== "movement" &&
            Recall.currentPage !== "fleet1" &&
            Recall.currentPage !== "fleet2" &&
            Recall.currentPage !== "fleet3") {

            observer.observe(target, {childList: true});

            /* If events are not hidden (Options->Display->Always show events */
            if ($('table#eventContent').exists()) {
                Recall.initAppendRecall();
            }
        }
    },

    initAppendRecall: function(mutations) {
        if ($('table#eventContent').exists()) {
            /* Get the "fleet movement" page information only once - when the fleets eventbox is showen for the first time */
            if (Recall.getMovement === true && Recall.pendingMovement === false) {
                Recall.pendingMovement = true;
                Recall.getFleetMovement();
            }

            /*  Get a clean eventlist content only once. 
                This is done because AGO or other tools might alter the original information (eg. change clocks values to local time) 
            */
            if (Recall.getEvents === true && Recall.pendingEvents === false) {
                Recall.pendingEvents = true;
                Recall.getEventsList();
            }

            if (Recall.getEvents === false && Recall.getMovement === false) {
                Recall.doAppendRecall();
            }
        }
    },

    doAppendRecall: function() {
        if ($('table#eventContent').exists()) {
            Recall.appendEventlistReload();

            $('table#eventContent tr[data-return-flight="false"]').each(function() {
                var row = $(this);
                var isAllianceAttack = row.hasClass('allianceAttack');

                if (isAllianceAttack === false) {
                    var missionType = parseInt(row.attr('data-mission-type'));
                    var eventRowId;

                    if (missionType !== Recall.missionType.acsAttack)
                        eventRowId = parseInt(row.attr('id').match(/\d+/)[0]);
                    else
                        eventRowId = parseInt(row.find('td.icon_movement span.tooltip').attr('data-federation-user-id').match(/\d+/)[0]);

                    if (Recall.availableEvents[eventRowId]) {
                        var returnId = Recall.matchEventWithMovement(Recall.availableEvents[eventRowId]);

                        if (returnId !== "" && returnId !== "multipleMatch")
                            row.append('<td class="oaf_recall_td"><a class="oaf_recall_icon icon_link" oaf_recall_id='+returnId+'></a></td>');
                    }
                }
            });

            $('.oaf_recall_icon').click(function(){
                var recallId = $(this).attr('oaf_recall_id');
                var url = 'http://'+Recall.universeFull+'/game/index.php?page=movement&return='+recallId;

                $.get(url, function(response) {$('#eventHeader .icon_reload').click();});
            });
        }
    },

    appendEventlistReload: function() {
        if (!window.AGO && $('#eventHeader .icon_reload.recall_eventlist_reload').exists() === false) {
            $('#eventHeader').prepend('<a href="javascript:void(0)"><span class="icon icon_reload recall_eventlist_reload"></span></a>').click(function(){
                $.get("/game/index.php?page=eventList&ajax=1", function (a) { $("#eventboxContent").html(a);});
            });
        }
    },

    getFleetMovement: function() {
        /* Get the "fleet movement" page information; should be called only once */
        var url = 'http://'+Recall.universeFull+'/game/index.php?page=movement';

        $.get(url, Recall.parseFleetMovement);
    },

    parseFleetMovement: function(html) {
        /* get own fleet flights except returning ones */
        var page = $(html);
        Recall.availableMovements = [];

        page.find('.fleetDetails[data-return-flight="false"]').each(function() {
            var item = $(this);
            var info = {};

            info.arrivalTime = item.attr('data-arrival-time');
            info.originPosStr = item.find('.originCoords').text();
            info.destinationPosStr = item.find('.destinationCoords').text();
            info.returnId = item.attr('id').match(/\d+/g)[0];
            info.missionType = parseInt(item.attr('data-mission-type'));

            var retTime = item.find('span.nextabsTime');
            if (retTime.exists())
                info.retClock = retTime.text().trim();
            else
                info.retClock = "none";

            /* console.log("New movement: " + JSON.stringify(info)); */
            Recall.availableMovements.push(info);
        });

        Recall.pendingMovement = false;
        Recall.getMovement = false;

        /* On galaxy view: the miniFleetToken is invalidated after getting the fleetMovement page.
          As a result, the first spy attempt will fail ('an error has occured'). We get a valid token
          by sending an invalid spy request and using the newToken from the response.
        */
        if (Recall.currentPage === "galaxy") {
            var url = 'http://'+Recall.universeFull+'/game/index.php?page=minifleet&ajax=1';
            var data = 'mission=6&token=none&speed=10';
            $.post(url, data, function(resp){
                try {
                    window.miniFleetToken = JSON.parse(resp).newToken;
                } catch(e) {}
            });
        }

        Recall.doAppendRecall();
    },

    getEventsList: function() {
        /* get eventlist content; should be called only once */
        $.get("/game/index.php?page=eventList&ajax=1", function (a) {
            var item = $('<div>'+a+'</div>');
            Recall.availableEvents = {};

            item.find('table#eventContent tr[data-return-flight="false"]').each(function() {
                var row = $(this);
                var isFriendly = row.find('.countDown.friendly').exists();
                var isAllianceAttack = row.hasClass('allianceAttack');

                if (isFriendly === true && isAllianceAttack === false) {
                    var info = {};
                    info.arrivalTime = row.attr('data-arrival-time');
                    info.originPosStr = row.find('.coordsOrigin').text().trim();
                    info.destinationPosStr = row.find('.destCoords').text().trim();
                    info.missionType = parseInt(row.attr('data-mission-type'));

                    var eventRowId;
                    if (info.missionType !== Recall.missionType.acsAttack) {
                        eventRowId = parseInt(row.attr('id').match(/\d+/)[0]);
                    }
                    else {
                        eventRowId = parseInt(row.find('td.icon_movement span.tooltip').attr('data-federation-user-id').match(/\d+/)[0]);

                        var unionName = row.attr('class').match(/union\d+/)[0];
                        /* console.log(unionName + "   " + eventRowId + "   " + item.find('tr.partnerInfo.' + unionName).length); */
                        if (unionName.indexOf("" + eventRowId) !== -1 && item.find('tr.partnerInfo.' + unionName).length === 1)
                                info.missionType = Recall.missionType.attack;
                    }

                    var pairRowId = eventRowId + (info.missionType === Recall.missionType.expedition ? 2 : 1);
                    var retRow = item.find('#eventRow-'+pairRowId+'[data-return-flight="true"]');

                    if (retRow.exists()) {
                        var retTime = retRow.attr('data-arrival-time');
                        var origPosRet = retRow.find('.coordsOrigin').text().trim();
                        var destPosRet = retRow.find('.destCoords').text().trim();

                        if (origPosRet === info.originPosStr && destPosRet === info.destinationPosStr) {
                            info.retClock = retRow.find('td.arrivalTime').text().trim();
                        }
                        else {
                            info.retClock = "none";
                        }
                    }
                    else {
                        info.retClock = "none";
                    }

                    /* console.log("New event row: " + JSON.stringify(info)); */
                    Recall.availableEvents[eventRowId] = info;
                }
            });

            $("#eventboxContent").html(a);
            Recall.getEvents = false;
            Recall.pendingEvents = false;
        });
    },

    matchEventWithMovement: function(evInfo) {
        var retVal = "";
        for (var m in Recall.availableMovements) {
            if (Recall.availableMovements.hasOwnProperty(m) === false)
                continue;

            var mvInfo = Recall.availableMovements[m];

            if (mvInfo.arrivalTime === evInfo.arrivalTime &&
                mvInfo.originPosStr === evInfo.originPosStr &&
                mvInfo.destinationCoords === evInfo.destinationCoords &&
                mvInfo.missionType === evInfo.missionType) {

                if (mvInfo.missionType === Recall.missionType.deploy ||
                    (mvInfo.retClock === evInfo.retClock && mvInfo.retClock !== "none")) {

                    if (retVal === "")
                        retVal = mvInfo.returnId;
                    else
                        retVal = "multipleMatch";
                }
            }
        }

        return retVal;
    }
};

$.fn.exists = function () {
    return this.length !== 0;
};

Recall.init();

}).toString();


function injectScript (myFunc) {
    var script = document.createElement ("script");
    script.setAttribute ("type", "application/javascript");
    script.textContent = "(" + myFunc + ") ();";
    document.body.appendChild (script);
}

function injectCss() {
    var recallImage = "data:image/gif;base64,R0lGODlhEAAQAKIAAISbrAAAAP///2+JnVx2iwAAAAAAAAAAACH5BAAAAAAALAAAAAAQABAAAAMqGLTcrS7KSautIut9mejLtwwkKZTliQ5Atg4qus1x2dbviud875eBHzABADs=";
    var recallCss = '.oaf_recall_icon {background-image: url('+recallImage+'); background-repeat: no-repeat !important;} #eventHeader .recall_eventlist_reload {position: absolute; left: 14px; margin: 4px 0;}';
    var style = document.createElement('style');
    
    style.type = 'text/css';
    style.innerHTML = recallCss;

    document.getElementsByTagName("head")[0].appendChild(style);
}

if (document.body) {
    injectScript(scriptFunc);
    injectCss();
}
