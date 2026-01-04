// ==UserScript==
// @name        Diep Mod 2020
// @namespace   None
// @version     1.25
// @description [Auto Class Builder / Achievement Changer / Server Selector / Bullet Stacker / Hp values / ViewRange / Aim Assist / Theme Changer]
// @author      Ponyo , BJR, SBB, SpadeSquad, Gokky
// @include     *://diep.io/*
// @connect     diep.io
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @grant		GM_setClipboard
// @grant		GM_notification
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.2.1.slim.min.js
// @require     http://code.jquery.com/jquery-latest.js
// @resource	diepCSS https://belowjobsrock.github.io/DiepMod2020/
// @downloadURL https://update.greasyfork.org/scripts/558855/Diep%20Mod%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/558855/Diep%20Mod%202020.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//https://belowjobsrock.github.io/DiepMod2020/

/* eslint-disable */
let diepCSS = GM_getResourceText("diepCSS");
GM_addStyle(diepCSS);
/* eslint-enable */

(function () {
    "use strict";

    let defaultConfig = {
        "hotkey": {
            "connectUI": "\t" // TAB
        },
        "gameModeName": {
            "ffa": "FFA",
            "survival": "Survival",
            "teams": "2TDM",
            "4teams": "4TDM",
            "dom": "Domination",
            "maze": "Maze",
            "tag": "Tag",
            "sandbox": "Sandbox"
        },
        "team": {
            "blue": [[0, 178, 225, 255], [76, 201, 234, 255]],
            "red": [[241, 78, 84, 255], [245, 131, 135, 255]],
            "green": [[0, 225, 110, 255], [76, 234, 153, 255]],
            "purple": [[191, 127, 245, 255], [210, 165, 248, 255]]
        },
        "settings": {
            "firstRunDisable": false
        },
        "script": {
            "currentServer": {},
            "debugging": false
        }
    };

    const isObject = (obj) => {
        return obj instanceof Object && obj.constructor === Object;
    };

    const dataStorage = {
        set (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get (key) {
            const value = localStorage.getItem(key);
            return value && JSON.parse(value);
        }
    };

    (function () {
        let privateConfig;
        unsafeWindow.Config = {};
        const proxify = (obj) => {
            for (const subkey in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, subkey)) {
                    unsafeWindow.Config[subkey] = new Proxy(obj[subkey], {
                        get (target, propKey, receiver) {
                            if (propKey in target) {
                                return Reflect.get(target, propKey, receiver);
                            }
                            throw new ReferenceError("Unknown property: " + propKey);
                        },
                        set (target, propKey, value, receiver) {
                            target[propKey] = value;
                            dataStorage.set("spadepublic", obj);
                            return Reflect.set(target, propKey, value, receiver);
                        }
                    });
                }
            }
        };

        if (dataStorage.get("spadepublic")) {
            privateConfig = dataStorage.get("spadepublic");
        } else {
            dataStorage.set("spadepublic", defaultConfig);
            privateConfig = defaultConfig;
        }

        proxify(privateConfig);

        unsafeWindow.resetConfig = () => {
            dataStorage.set("spadepublic", defaultConfig);
            unsafeWindow.Config = {};
            privateConfig = defaultConfig;
            proxify(privateConfig);
        };
    })();

    let playing = () => {
        return false;
    };

    $(window).on("load", () => {
        (function setBack () {
            try {
                if (unsafeWindow.input.should_prevent_unload) {
                    playing = () => {
                        return !!unsafeWindow.input.should_prevent_unload();
                    };
                }
            } catch (error) {
                setTimeout(() => {
                    setBack();
                }, 100);
            }
        })();
    });

    let canvas, ctx;
    $(() => {
        canvas = $("#canvas").get(0);
        ctx = canvas.getContext("2d");
    });

    HTMLElement.prototype.focus = () => {};
    HTMLElement.prototype.blur = () => {};

    const capitalizeFirstLetter = (string) => {
        return string && string[0].toUpperCase() + string.slice(1);
    };

    const createEl = (elObj, parent) => {
        let element;
        if (typeof elObj === "string") {
            element = $(document.createTextNode(elObj));
        } else {
            element = $(`<${elObj.node}>`);
            if (elObj.att) {
                let attributes = elObj.att;
                for (let key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        if (key.charAt(0) === "@") {
                            element.attr(key.substring(1), attributes[key]);
                        } else {
                            element.text(attributes[key]);
                        }
                    }
                }
            }
            if (elObj.evl) {
                element.on(elObj.evl.type, elObj.evl.f);
            }
            if (elObj.child) {
                elObj.child.forEach((node) => {
                    createEl(node, element.get(0));
                });
            }
        }
        if (parent) {
            parent.append(element.get(0));
        }
        return element;
    };

    const scriptBody = $("<body>").get(0);
    createEl({
        node: "div", att: {"@id": "main", "@class": "base"},
        child: [ {
            node: "div", att: {"@class": "top"},
            child: [ {
                node: "h2", att: {"@class": "title"},
                child: [ {
                    node: "span", att: {"@class": "symbol", textContent: ""}
                }, " DiepMod Server Selector ", {
                    node: "span", att: {"@class": "symbol", textContent: ""}
                }, {
                } ]
            }, {
                node: "span", att: {"@class": "menu"},
                child: [ {
                    node: "a", att: {"@class": "menuButton close", textContent: "X"},
                    evl: {
                        type: "click",
                        f: () => {
                            $(".appear").removeClass("appear");
                        }}
                } ]
            }]
        }, {
            node: "lable", att: {textContent: "Gamemode"},
            child: [ {
                node: "select", att: {"@id": "gamemode"}
            } ]
        }, {
            node: "lable", att: {textContent: "Server"},
            child: [ {
                node: "select", att: {"@id": "server"}
            } ]
        }, {
            node: "span", att: {"@id": "more", textContent: ""}
        }, {
            node: "div",
            child: [ {
                node: "button", att: {"@type": "button", "@id": "connect", "@class": "commandButton", textContent: "Connect"},
                evl: {
                    type: "click",
                    f: () => {
                        connectServer();
                        setTimeout(() => {
                            $(".appear").removeClass( "appear" );
                        }, 800);
                    }}
            }, {
                node: "button", att: {"@type": "button", "@id": "disconnect", "@class": "commandButton", textContent: "Disconnect"},
                evl: {
                    type: "click",
                    f: () => {
                        unsafeWindow.m28nOverride = false;
                        unsafeWindow.input.execute("lb_reconnect");
                    }}
            } ]
        }, {
            node: "p", att: {"@class": "ctag", textContent: ""},
            child: [ {
            } ]
        } ]
    }, scriptBody);

    $(() => {});

    $("body").after(scriptBody);

    /* jshint ignore:start */
    const fetchServer = async (mode, times, ids = []) => {
        const url = "https://api.n.m28.io";
        const $serverSelect = $("#server");
        const $moreButton = $("#more");
        $moreButton.addClass("spin");

        for (let i = 0; i < times; i++) {
            try {
                const response = await fetch(`${url}/endpoint/diepio-${mode}/findEach/`);
                const body = await response.json();
                if (body.hasOwnProperty("servers")) {
                    Object.entries(body.servers).forEach(([key, val]) => {
                        if (!ids.some((id) => {
                            return id === val.id;
                        })) {
                            ids.push(val.id);
                            const txt = key.replace(/(linode-|vultr-)/, "") + ` - ${val.id.toUpperCase()}`;
                            $serverSelect.append($("<option>", {
                                "value": JSON.stringify(val),
                                "text": capitalizeFirstLetter(txt)
                            }));
                        }
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
        $("#server option").detach().sort((a, b) => {
            a = $(a);
            b = $(b);
            return ((a.text() > b.text()) ?
                1 :
                (a.text() < b.text()) ?
                    -1 :
                    0);
        }).appendTo($serverSelect).filter(":first").attr("selected", true);
        $moreButton.on("click", () => {
            fetchServer(mode, 4, ids);
        }).removeClass("spin");
    };
    /* jshint ignore:end */

    $(() => {
        const $gamemode = $("#gamemode");
        Object.entries(unsafeWindow.Config.gameModeName).forEach(([key, val]) => {
            $gamemode.append($("<option>", {
                "value": key,
                "text": val
            }));
        });
        $gamemode.change((event) => {
            $("#server").empty();
            fetchServer($(event.currentTarget).val(), 8, []);
        }).trigger("change");
    });

    $(() => {
        unsafeWindow.m28n.findServerPreference = (endpoint, options, cb) => {
            if (unsafeWindow.m28nOverride)
                options(null, [JSON.parse($( "#server option:selected" ).val())]);
            if (typeof options == "function") {
                cb = options;
                options = {};
            }
            unsafeWindow.m28n.findServers(endpoint, (err, r) => {
                if (err)
                    return cb(err);
                var availableRegions = [];
                for (var region in r.servers) {
                    availableRegions.push(region);
                }
                if (availableRegions.length === 0) {
                    cb("Couldn't find any servers in any region");
                    return;
                }
                if (availableRegions.length === 1) {
                    for (var region in r.servers) {
                        cb(null, [r.servers[region]]);
                        return;
                    }
                }
                unsafeWindow.m28n.findRegionPreference(availableRegions, options, (err, regionList) => {
                    if (err)
                        return cb(err);
                    var serverList = regionList.map((region) => {
                        return r.servers[region];
                    });
                    cb(null, serverList);
                });
            });
        };
    });

    const connectServer = () => {
        if ($("#server option:selected").length === 1) {
            const $autojoin = $("#autojoin");
            const $connect = $("#connect");

            let Observer = new MutationObserver(mutation => {
                mutation.forEach(mutation => {
                    if (mutation.target.style.display === "block") {
                        if ($autojoin.prop("checked")) {
                            const sequence = ["keydown", "keyup"];
                            sequence.forEach(event => {
                                $(canvas).trigger($.Event(event, {
                                    "keyCode": "\r".charCodeAt(0)
                                }));
                            });
                            $(".appear").removeClass("appear");
                        }
                        $connect.removeClass("connecting");
                    } else if (mutation.target.style.display === "none") {
                        if (playing()) {
                            Observer.disconnect();
                        }
                        unsafeWindow.m28nOverride = false;
                    }
                });
            });
            $connect.addClass("connecting");
            unsafeWindow.m28nOverride = true;
            unsafeWindow.input.execute("lb_reconnect");
            Observer.observe($("#textInputContainer").get(0), {
                "attributes": true,
                "attributeFilter": ["style"]
            });
        }
    };

    const WebSocketProxy = new Proxy(unsafeWindow.WebSocket, {
        construct (Target, args) {
            const instance = new Target(...args);

            const messageHandler = (event) => {
                const buffer = new DataView(event.data);
                const opcode = buffer.getUint8(0);
                switch (opcode) {
                case 4:
                    if (typeof unsafeWindow.Config.script.currentServer === "object") {
                        const decoded = new TextDecoder("utf-8").decode(event.data);
                        unsafeWindow.Config.script.currentServer = (/\W*(\w+).?((linode|)-(\w+))/).exec(decoded);
                        unsafeWindow.Config.script.currentServer[4] = capitalizeFirstLetter(unsafeWindow.Config.script.currentServer[4]);
                    }
                    break;
                default:
                    break;
                }
            };

            instance.addEventListener("message", messageHandler);
            return instance;
        }
    });

    unsafeWindow.WebSocket = WebSocketProxy;

    const drawServer = () => {
        const x = window.innerWidth * window.devicePixelRatio / 2;
        const y = window.innerHeight * window.devicePixelRatio * 0.575;
        if (unsafeWindow.Config.script.currentServer.length === 5) {
            ctx.textAlign = "center";
            ctx.font = "25px Ubuntu";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            ctx.strokeText("Server:", x, y);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillText("Server:", x, y);

            ctx.font = "35px Ubuntu";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            ctx.strokeText(unsafeWindow.Config.script.currentServer[2], x, y + 45);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillText(unsafeWindow.Config.script.currentServer[2], x, y + 45);
        }
    };

    unsafeWindow.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    $(window).on("load", function animate () {
        if ($("#textInputContainer").css("display") === "block" && !playing()) {
            drawServer();
        }
        unsafeWindow.requestAnimFrame(animate);
    });

    const handleKeypress = (event) => {
        const key = String.fromCharCode(event.keyCode);
        switch (key) {
        case unsafeWindow.Config.hotkey.connectUI:
            event.preventDefault();
            event.stopPropagation();
            $("#main").toggleClass("appear");
            break;
        }
    };

    $(document).keydown((event) => {
        handleKeypress(event);
    });

})();






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function(){//info
	if(window.updateInfo) return;


	var info = {};
	var info_container = document.createElement("div");
	info_container.style.position = "fixed";
	info_container.style.color = "white";
	info_container.style["pointer-events"] = "none";
	document.body.appendChild(info_container);

	function toggle_info_container(e){
		if(e.key == "i"){
			info_container.style.display = info_container.style.display=="block" ? "none" : "block";
		}
	}
	window.addEventListener("keyup", toggle_info_container);

	window.updateInfo = function(key, value){
		if(!value) delete info[key];
		else info[key] = value;
		var s = "";
		for(var _key in info){
			s += info[_key] + "\n";
		}
		info_container.innerText = s;
	};
})();


(function(){
	var cycleRate = 0.003125; // ms^-1
	var maxAngle = Math.PI * 45 / 180;
	var NCANNON = 3;
	var angleUnit = maxAngle / (NCANNON - 1);

	var tankData = [
        {name: "Tri-angle", cycleRate: 0.003095, maxAngle: Math.PI * 135 / 180, NCANNON: 2},
		{name: "Penta", cycleRate: 0.003095, maxAngle: Math.PI * 45 / 180, NCANNON: 3},
		{name: "SpreadShot", cycleRate: 0.001515, maxAngle: Math.PI * 75 / 180, NCANNON: 6},
		{name: "Octo", cycleRate: 0.003095, maxAngle: Math.PI * 45 / 180, NCANNON: 2},
        {name: "GunnerTrapper",cycleRate: 0.015, maxAngle: Math.PI, NCANNON: 2},
        {name: "TripleTwin", cycleRate: 0.003125, maxAngle: Math.PI * 180 / 180, NCANNON: 2},
        {name: "Streamliner", cycleRate: 0.0625, maxAngle: Math.PI * 15 / 180, NCANNON: 3},
	];
	var tankIndex = 0;

	var measuring = false;

	var effective = false;
	var frameRequest;

	var canvas = window.document.getElementById("canvas");

	var mouseX;
	var mouseY;
	var a = 0;
	var startA = 0;
	var artificialMouseMove = false;

	var disabled = false;

	function onMouseDown(e){
		if(e.button == 2){
			if(!effective){
				startA = a - 50;
				mouseX = e.clientX;
				mouseY = e.clientY;
				canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: mouseX, clientY: mouseY}));
			}
			effective = true;
		}
	}

	function onMouseUp(e){
		if(e.button == 2){
			if(effective){
				canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: mouseX, clientY: mouseY}));
			}
			effective = false;
		}
	}

	function onMouseMove(e){
		if(effective){
			if(!artificialMouseMove){
				e.stopPropagation();
				mouseX = e.clientX;
				mouseY = e.clientY;
			}
		}else{
			mouseX = e.clientX;
			mouseY = e.clientY;
		}
	}

	function update(_a){
		frameRequest = window.requestAnimationFrame(update);
		a = _a;

		if(effective){
			var da = a - startA;
			var state = Math.floor(cycleRate * da * NCANNON) % (NCANNON * 2);
			var state1 = state % NCANNON;
			var state2 = Math.floor(state / NCANNON);
			var angle = angleUnit * state1 * (state1 % 2 == state2 ? 1 : -1);

			var cx = window.innerWidth / 2;
			var cy = window.innerHeight / 2;
			var sin = Math.sin(angle);
			var cos = Math.cos(angle);

			var x = mouseX - cx;
			var y = mouseY - cy;
			var _x = cos * x - sin * y;
			var _y = sin * x + cos * y;
			x = _x + cx;
			y = _y + cy;

			artificialMouseMove = true;
			canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
			artificialMouseMove = false;
		}
	}

	function onKeyUp(e){
		if(e.key == "Q"){
			disabled = !disabled;
			if(disabled){
				if(measuring){
					cycleRate = 1 / measuring.terminate();
					measuring = false;
				} else stop();
			}else start();
			window.updateInfo && window.updateInfo("off", disabled ? "Disabled." : null);
			return;
		}

		if(disabled) return;

		if(e.key == "R"){
			nextTank();
		}
	}
    function nextTank(){
        changeTank((tankIndex + 1) % tankData.length);
    }
	function changeTank(index){
		var data = tankData[index];
		tankIndex = index;

		cycleRate = data.cycleRate; // ms^-1
		maxAngle = data.maxAngle;
		NCANNON = data.NCANNON;
		angleUnit = maxAngle / (NCANNON - 1);
		window.updateInfo && window.updateInfo("changeTank", "Tank: " + data.name);
	}

	function init(){
		window.addEventListener("keyup", onKeyUp);
		start();
		changeTank(0);
	}

	function start(){
		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);
		window.addEventListener("mousemove", onMouseMove, true);
		frameRequest = window.requestAnimationFrame(update);
	}

	function stop(){
		canvas.removeEventListener("mousedown", onMouseDown);
		canvas.removeEventListener("mouseup", onMouseUp);
		window.removeEventListener("mousemove", onMouseMove, true);
		window.cancelAnimationFrame(frameRequest);
		effective = false;
	}


	init();

})();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//asdasd add line here

  var disabled = false;
   var aimLine = document.createElement("div");
   var centerX;
   var centerY;
   var lineTog = 0;
   var mouseX;
   var mouseY;
   var winX = document.documentElement.clientWidth;
   var winY = document.documentElement.clientHeight;
   var wDown = 0;
   aimLine.setAttribute("id", "divLine");
   document.body.appendChild(createLine( 0, 0, 0, 0));
   aimLine = 0;

   function onKeyUp(e){

		if(e.key == "J"){
      // Line on
        winX = document.documentElement.clientWidth;
        winY = document.documentElement.clientHeight;

            aimLine = document.getElementById("divLine");

         centerX = winX / 2;
         centerY = winY / 2;
         document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));
        }
        if(e.key == "j"){
      // Line off

         document.body.appendChild(createLine( 0, 0, 0, 0));
         aimLine = 0;
        }
         if(e.key == "w"){

        centerY = winY / 2;
        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));

        }
        if(e.key == "a"){

        centerX = winX / 2;
        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));

        }
        if(e.key == "s"){

        centerY = winY / 2;
        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));


        }
        if(e.key == "d"){

        centerX = winX / 2;
        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));

        }

   }

   function onKeyDown(e){
        if(e.key == "w"){
        centerY = ((winY / 2) - (winY / 20));

        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));

        }

        if(e.key == "a"){
        centerX = ((winX / 2) - (winX / 40));

        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));



        }
        if(e.key == "s"){


        centerY = ((winY / 2) + (winY / 20));

        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));



        }
        if(e.key == "d"){
        centerX = ((winX / 2) + (winX / 40));

        document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));



        }


   }




function createLineElement(x, y, length, angle) {

    var styles = 'border: 1px dashed #eb8f34; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '
               + '-ms-transform: rotate(' + angle + 'rad); '
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';
    aimLine.setAttribute('style', styles);
    return aimLine;
}


function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);
    return createLineElement(x, y, c, alpha);

  }



    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {

        if (lineTog = true){
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
//       // Use event.pageX / event.pageY here

               mouseX = event.pageX;
               mouseY = event.pageY;
               document.body.appendChild(createLine(centerX, centerY, mouseX-5, mouseY+5));


       }
    }


   window.addEventListener("keyup", onKeyUp);
   window.addEventListener("keydown", onKeyDown);

//asdasd
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // *** 変数宣言 *** //

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    var diepModMenu = document.createElement('div');
    var diepModConsole = "";
    var diepModCommandError = true;
    var lineGen = document.createElement('div');

    // *** 初期化 *** //
    document.title = ( 'DiepMod' );
    styleInit();
    jsInit();
    bodyInit();

    // *** CSSの初期化 *** //
    function styleInit() {
        addGlobalStyle(`div::-webkit-scrollbar{width: 8px;} div::-webkit-scrollbar-track{background: #FFFFFFEE; border: none; border-radius: 10px; box-shadow: inset 0 0 2px #ffc87a55;}div::-webkit-scrollbar-thumb{background: #ffc87a; border-radius: 10px; box-shadow: none;}`);
        addGlobalStyle(`.diepMod-menu{position:absolute; top:55px; left:-770px; padding: 0.5em 1em; margin: 2em 0; width: 400px; background: #FFFFFFEE; border: solid 0px #0082A155; border-radius: 0px;
                        margin: 10px; padding: 10px; line-height: 1.3; overflow: auto; text-align: left; width: 750px; height: 300px;
                        transition-duration: 0.1s;} .diepMod-menu:hover{position:absolute; left:-20px;}`);
        addGlobalStyle(`.diepMod-pretitle{font-size: 34px;}`);
        addGlobalStyle(`.diepMod-subtitle{font-size: 19px;}`);
        addGlobalStyle(`.diepMod-description{font-size: 16px;}`);
        addGlobalStyle(`.diepMod-warning{font-size: 16px; color:#ff9999}`);
        addGlobalStyle(`a {text-decoration: none;} a.diepMod-url:link{color:#FFFFFF} a.diepMod-url:visited{color:#FFFFFF;} a.diepMod-url:hover{color:#ffc87a;text-decoration: underline;} a.diepMod-url:active{color:#FFE66C;}`);
        addGlobalStyle(`.diepHack-hr{position: relative; height: 1px; border-width: 0; background-image: -webkit-linear-gradient(left, transparent 0%,#00B2E1 50%,transparent 100%); background-image: linear-gradient(90deg, transparent 0%,#00B2E1 50%,transparent 100%);}`);
        addGlobalStyle(`.diepMod-Regen{font-size: 16px; color:#EFB28D}`);
        addGlobalStyle(`.diepMod-Health{font-size: 16px; color:#EC66EB}`);
        addGlobalStyle(`.diepMod-Bump{font-size: 16px; color:#9A66EB}`);
        addGlobalStyle(`.diepMod-Speed{font-size: 16px; color:#6D92ED}`);
        addGlobalStyle(`.diepMod-Pen{font-size: 16px; color:#F0D367}`);
        addGlobalStyle(`.diepMod-Damage{font-size: 16px; color:#F16869}`);
        addGlobalStyle(`.diepMod-Reload{font-size: 16px; color:#99EC69}`);
        addGlobalStyle(`.diepMod-Move{font-size: 16px; color:#6DECE9}`);
        addGlobalStyle(`.diepMod-Tanktype{font-size: 22px; color:#fc7f2b}`);
        addGlobalStyle(`.diepMod-Stack{font-size: 18px; color:#eb8f34}`);
        addGlobalStyle(`.diepMod-bigtitle{font-size: 22px;}`);
        addGlobalStyle(`.diepMod-tabInfo{font-size: 18px; color:#99ffcc}`);



        addGlobalStyle(`
                        a.diepMod-button {
                            display: inline-block;
                            margin: 15px 15px 0;
                            padding: .6em 1.1em;
                            font-size: 14px;
                            font-weight: bold;
                            text-decoration: none;
                            outline: none;
                            color: #FFFFFF;
                            text-align center;
                            background-color: #ffc87a;
                            border-radius: 32px;
                            -webkit-background-clip: padding-box;
                            background-clip: padding-box;
                            -webkit-box-shadow: 0 0 0 -2px #FFFFFF, 0 0 0 -1px #ffc87a;
                            box-shadow: 0 0 0 -2px #FFFFFF, 0 0 0 -1px #ffc87a;
                            border: none;
                            -webkit-transition: -webkit-box-shadow .3s;
                            transition: box-shadow .3s;
                            cursor: pointer
                        }
                        a.diepMod-button:hover, a.diepMod-button:focus {
                            -webkit-box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #ffc87a;
                            box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #ffc87a;
                                -webkit-transition-timing-function: cubic-bezier(0.6, 4, 0.3, 0.8);
                            transition-timing-function: cubic-bezier(0.6, 4, 0.3, 0.8);
                            -webkit-animation: gelatine 0.5s 1;
                            animation: gelatine 0.5s 1;
                        }
                        a.diepMod-button-secondary {
                            background: #FFFFFF;
                            -webkit-box-shadow: 0 0 0 -2px #FFFFFF, 0 0 0 -1px #FFFFFF;
                            box-shadow: 0 0 0 -2px #FFFFFF, 0 0 0 -1px #FFFFFF;
                        }
                        a.diepMod-button-secondary:hover {
                            -webkit-box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #FFFFFF;
                            box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #FFFFFF;
                        }
                        a.diepMod-button:active, a.diepMod-button-secondary:active {
                            background: #FFFFFF;
                            -webkit-transition-duration: 0;
                            transition-duration: 0;
                            -webkit-box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #FFFFFF;
                            box-shadow: 0 0 0 2px #ffc87a, 0 0 0 4px #FFFFFF;
                            color: #ffc87a;
                        }
                        @keyframes gelatine {
                            from, to {
                                -webkit-transform: scale(1, 1);
                                transform: scale(1, 1);
                            }
                            25% {
                                -webkit-transform: scale(0.9, 1.1);
                                transform: scale(0.9, 1.1);
                            }
                            50% {
                                -webkit-transform: scale(1.1, 0.9);
                                transform: scale(1.1, 0.9);
                            }
                            75% {
                                -webkit-transform: scale(0.95, 1.05);
                                transform: scale(0.95, 1.05);
                            }
                            from, to {
                                -webkit-transform: scale(1, 1);
                                transform: scale(1, 1);
                            }
                            25% {
                                -webkit-transform: scale(0.9, 1.1);
                                transform: scale(0.9, 1.1);
                            }
                            50% {
                                -webkit-transform: scale(1.1, 0.9);
                                transform: scale(1.1, 0.9);
                            }
                            75% {
                                -webkit-transform: scale(0.95, 1.05);
                                transform: scale(0.95, 1.05);
                            }
                        }
                        @-webkit-keyframes gelatine {
                            from, to {
                                -webkit-transform: scale(1, 1);
                                transform: scale(1, 1);
                            }
                            25% {
                                -webkit-transform: scale(0.9, 1.1);
                                transform: scale(0.9, 1.1);
                            }
                            50% {
                                -webkit-transform: scale(1.1, 0.9);
                                transform: scale(1.1, 0.9);
                            }
                            75% {
                                -webkit-transform: scale(0.95, 1.05);
                                transform: scale(0.95, 1.05);
                            }
                            from, to {
                                -webkit-transform: scale(1, 1);
                                transform: scale(1, 1);
                            }
                            25% {
                                -webkit-transform: scale(0.9, 1.1);
                                transform: scale(0.9, 1.1);
                            }
                            50% {
                                -webkit-transform: scale(1.1, 0.9);
                                transform: scale(1.1, 0.9);
                            }
                            75% {
                                -webkit-transform: scale(0.95, 1.05);
                                transform: scale(0.95, 1.05);
                            }
                       }
                `);
        function addGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) {
                return;
            }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }
    }

    // *** JSの初期化 *** //
    function jsInit() {
        addGlobalJavaScript(`
            function achievementFlag(aflag){
                var achievementCode = JSON.parse('{"A::1ba4250a398116e7_1":"' + String(aflag) + '","A::1c00693fbf538316_1":"' + String(aflag) + '","A::22d84fdc78b1f1ae_1":"' + String(aflag) + '","A::22fd2ee6d05881d6_1":"' + String(aflag) + '","A::256245339c3742d2_1":"10000","A::2780b5743fe93789_1":"' + String(aflag) + '","A::300ddd6f1fb3d69d_1":"500","A::33e4cb47afd5602f_1":"10","A::3fd17b5d35c36670_1":"' + String(aflag) + '","A::4d545ac615beec40_1":"' + String(aflag) + '","A::4eebb78f4ee19cba_1":"' + String(aflag) + '","A::54084a4936c7e37_1":"' + String(aflag) + '","A::5613de303c7e06f0_1":"' + String(aflag) + '","A::5892e09831854ad2_1":"' + String(aflag) + '","A::5dbb422e510cec75_1":"' + String(aflag) + '","A::6502bcb56dfbc0e3_1":"' + String(aflag) + '","A::6520a970c68efb85_1":"' + String(aflag) + '","A::6d07f075d9877ab_1":"' + String(aflag) + '","A::6d671cfa6dceb09_1":"500","A::71c663fb258f5243_1":"' + String(aflag) + '","A::723c26b6a37fccbb_1":"100","A::76646f423e5d6bc4_1":"' + String(aflag) + '","A::8221180ec6d53232_1":"10000","A::87e48332e9161b3d_1":"' + String(aflag) + '","A::8abd923027114f9e_1":"1000","A::8b83f81f510fd136_1":"10","A::8b8fe153a4965c63_1":"' + String(aflag) + '","A::8eeec8c270ef92be_1":"' + String(aflag) + '","A::9898db9ff6d3c1b3_1":"' + String(aflag) + '","A::9953423e884422b6_1":"100","A::9f0edada2bd7cd6_1":"' + String(aflag) + '","A::a402fdb3f5cebf99_1":"' + String(aflag) + '","A::a81a738312c7705d_1":"' + String(aflag) + '","A::b8b3e7fd58ff6706_1":"' + String(aflag) + '","A::b95a9621ccccad3c_1":"' + String(aflag) + '","A::bb9188cddc9d5b1f_1":"100","A::bdf3e0a1c4ebcaee_1":"' + String(aflag) + '","A::cdf66074bb5ce7fa_1":"' + String(aflag) + '","A::d3e4829583362b48_1":"3000","A::d583013681f15fcc_1":"' + String(aflag) + '","A::d932ec7312510a14_1":"10","A::e1f4f3e6a5c9bacb_1":"' + String(aflag) + '","A::e6111736c85494e9_1":"' + String(aflag) + '","A::eb9792219de8f755_1":"' + String(aflag) + '","A::ecea90c4be06d999_1":"' + String(aflag) + '","A::eef89695be793c7f_1":"100","A::f3618c60205d7ded_1":"' + String(aflag) + '","A::f73016825baab042_1":"100","A::fc3b3faf73bae216_1":"' + String(aflag) + '","A::bae942e2191270e_1":"' + String(aflag) + '"}');
                Object.keys(achievementCode).forEach((k) => {localStorage.setItem(k, achievementCode[k])});
                location.reload(true);
            };
        `);
        function addGlobalJavaScript(js) {
            var head, script;
            head = document.getElementsByTagName('head')[0];
            if (!head) {
                return;
            }
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = js;
            head.appendChild(script);
        }
    }

    // *** HTMLの初期化 ***//
    function bodyInit() {


        document.getElementsByTagName('body')[0].appendChild(diepModMenu);
        diepModMenu.style = "position:absolute; top:55px; left:0px; font-family: Ubuntu; color: #FFFFFF; font-style: normal; font-variant: normal; text-shadow: black 2px 0px, black -2px 0px, black 0px -2px, black 0px 2px, black 2px 2px, black -2px 2px, black 2px -2px, black -2px -2px, black 1px 2px, black -1px 2px, black 1px -2px, black -1px -2px, black 2px 1px, black -2px 1px, black 2px -1px, black -2px -1px;";
        diepModMenu.innerHTML = `
        <div class="diepMod-menu" oncopy="return false;" onselectstart="return false;" oncontextmenu="return false;">
               <td><a class="diepMod-Stack">&nbsp;&nbsp;Press Tab to open server selector.&nbsp;&nbsp;&nbsp;</a></td>
               <td><a href="https://spade-squad.com/" class="diepMod-Speed">Spade Squad Discord</a></td>
               <hr class="diepMod-hr" />
               <div class="diepMod-subtitle">&nbsp;&nbsp;Themes
               <td><a class="diepMod-button" onclick="input.execute('net_replace_color 0 0x555555');input.execute('net_replace_color 1 0x999999');input.execute('net_replace_color 2 0x00B1DE');input.execute('net_replace_color 3 0x00B1DE');input.execute('net_replace_color 4 0xF14E54');input.execute('net_replace_color 5 0xBE7FF5');input.execute('net_replace_color 6 0x00F46C');input.execute('net_replace_color 7 0x89FF69');input.execute('net_replace_color 8 0xFFE869');input.execute('net_replace_color 9 0xFC7677');input.execute('net_replace_color 10 0x768DFC');input.execute('net_replace_color 11 0xFF77DC');input.execute('net_replace_color 12 0xFFE869');input.execute('net_replace_color 13 0x44FFA0');input.execute('net_replace_color 14 0xBBBBBB');input.execute('net_replace_color 15 0xFF0000');input.execute('net_replace_color 16 0xFF0000');input.execute('net_replace_color 17 0xC0C0C0');input.execute('ren_background_color 0xCDCDCD');input.execute('ren_border_color 0x666666');input.execute('ren_minimap_background_color 0xCDCDCD');input.execute('ren_minimap_border_color 0x555555');input.execute('ren_health_background_color 0x555555');input.execute('ren_xp_bar_fill_color 0xF0D96C');input.execute('ren_score_bar_fill_color 0x6CEFA2');input.execute('ren_stroke_solid_color 0x555555');input.execute('ren_grid_color 0x000000');return false;">Default</a></td>
               <td><a class="diepMod-button" onclick="input.execute('net_replace_color 0 0x000000');input.execute('net_replace_color 1 0x000000');input.execute('net_replace_color 2 0x99FF99');input.execute('net_replace_color 3 0x0000FF');input.execute('net_replace_color 4 0xFF0000');input.execute('net_replace_color 5 0x990099');input.execute('net_replace_color 6 0x00FF00');input.execute('net_replace_color 7 0xFFFFFF');input.execute('net_replace_color 8 0xFFFFFF');input.execute('net_replace_color 9 0xFFBBBB');input.execute('net_replace_color 10 0xCCCCFF');input.execute('net_replace_color 11 0xFF69B4');input.execute('net_replace_color 12 0xFFFF00');input.execute('net_replace_color 13 0xFFFF00');input.execute('net_replace_color 14 0x888888');input.execute('net_replace_color 15 0x0000FF');input.execute('net_replace_color 16 0xBBBB00');input.execute('net_replace_color 17 0x777777');input.execute('ren_background_color 0xCDCDCD');input.execute('ren_border_color 0x666666');input.execute('ren_minimap_background_color 0xCDCDCD');input.execute('ren_minimap_border_color 0x555555');input.execute('ren_health_background_color 0x555555');input.execute('ren_xp_bar_fill_color 0xF0D96C');input.execute('ren_score_bar_fill_color 0x6CEFA2');input.execute('ren_stroke_solid_color 0x555555');input.execute('ren_grid_color 0x000000');return false;">Dark</a></td>
               <td><a class="diepMod-button" onclick="input.execute('net_replace_color 0 4737096');input.execute('net_replace_color 1 10987439');input.execute('net_replace_color 2 10987439');input.execute('net_replace_color 3 10987439');input.execute('net_replace_color 4 13461149');input.execute('net_replace_color 5 13461149');input.execute('net_replace_color 6 13461149');input.execute('net_replace_color 7 0x89FF69');input.execute('net_replace_color 8 15714123');input.execute('net_replace_color 9 15714123');input.execute('net_replace_color 10 15714123');input.execute('net_replace_color 11 15714123');input.execute('net_replace_color 12 0xFFE869');input.execute('net_replace_color 13 9092159');input.execute('net_replace_color 14 9092159');input.execute('net_replace_color 15 9092159');input.execute('net_replace_color 16 0xFF0000');input.execute('net_replace_color 17 0xC0C0C0');input.execute('ren_background_color 14408667');input.execute('ren_border_color 0x666666');input.execute('ren_minimap_background_color 12499903');input.execute('ren_minimap_border_color 4737096');input.execute('ren_health_background_color 4737096');input.execute('ren_xp_bar_fill_color 15714123');input.execute('ren_score_bar_fill_color 9092159');input.execute('ren_stroke_solid_color 0x555555');input.execute('ren_grid_color 10987439');input.execute('ui_replace_colors 3974347 12183678 14696001 16642944');return false;">Arras</a></td>
               <td><a class="diepMod-button" onclick="input.execute('net_replace_color 0 0x555555');input.execute('net_replace_color 1 0x999999');input.execute('net_replace_color 2 0x00e1ff');input.execute('net_replace_color 3 0x00e1ff');input.execute('net_replace_color 4 0xff0c00');input.execute('net_replace_color 5 0x7200ff');input.execute('net_replace_color 6 0x04ff00');input.execute('net_replace_color 7 0x04ff00');input.execute('net_replace_color 8 0xeeff00');input.execute('net_replace_color 9 0xFC7677');input.execute('net_replace_color 10 0x0000ff');input.execute('net_replace_color 11 0xf600ff');input.execute('net_replace_color 12 0xeeff00');input.execute('net_replace_color 13 0x00ff00');input.execute('net_replace_color 14 0xa3a3a3');input.execute('net_replace_color 15 0xff0c00');input.execute('net_replace_color 16 0xeeff00');input.execute('net_replace_color 17 0xa3a3a3');input.execute('net_replace_color 18 0xa3a3a3');input.execute('ren_background_color 0xd9d9d9');input.execute('net_replace_color 18 0xa3a3a3');input.execute('ren_minimap_background_color 0xCDCDCD');input.execute('ren_minimap_border_color 0x555555');input.execute('ren_health_background_color 0x555555');input.execute('ren_xp_bar_fill_color 0xF0D96C');input.execute('ren_score_bar_fill_color 0x6CEFA2');input.execute('ren_stroke_solid_color 0x555555');input.execute('ren_stroke_soft_color_intensity 1');return false;">Simple</a></td>

               <hr class="diepMod-hr" />

               <div class="diepMod-subtitle">&nbsp;&nbsp;Health Values
                 <td><a class="diepMod-button" onclick="input.execute('ren_raw_health_values = true');input.execute('ren_health_background_color 0x000000');return false;">Show</a></td>
                 <td><a class="diepMod-subtitle">Client FPS</td>
                 <td><a class="diepMod-button" onclick="input.execute('ren_fps = true');return false;">Show</a></td>
                 <td><a class="diepMod-subtitle">Map ViewRange</td>
                 <td><a class="diepMod-button" onclick="input.execute('ren_minimap_viewport = true');return false;">Show</a></td>
                   <br>
               <hr class="diepMod-hr" />



                <td><a class="diepMod-Stack">&nbsp;&nbsp;Use Right click to stack bullets, make sure auto fire and rotate are off.</td><br />


                 <td><a class="diepMod-subtitle"> &nbsp;&nbsp;Toggle Stack Shoot: &nbsp;&nbsp; </td>
                 <td><a class="diepMod-Tanktype"> Shift + Q &nbsp;&nbsp;&nbsp;&nbsp;</td>
                 <td><a class="diepMod-subtitle"> Change Stack Type: &nbsp;&nbsp; </td>
                 <td><a class="diepMod-Tanktype"> Shift + R &nbsp;&nbsp</td> <br>
             <hr class="diepMod-hr" />
                 <td><a class="diepMod-subtitle"> &nbsp;&nbsp;&nbsp;Enable Bullet Line: &nbsp;&nbsp; </td>
                 <td><a class="diepMod-Tanktype"> &nbsp;Shift + J &nbsp;&nbsp;&nbsp;&nbsp;</td>

                 <td><a class="diepMod-subtitle"> &nbsp;&nbsp;&nbsp;Disable Bullet Line: &nbsp;&nbsp; </td>
                 <td><a class="diepMod-Tanktype"> &nbsp;&nbsp;&nbsp;J &nbsp;&nbsp;&nbsp;&nbsp;</td>


             <hr class="diepMod-hr" />
             <td><a class="diepMod-bigtitle">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Auto Builds</a></td>
                 <td><a class="diepMod-button" onclick="input.execute('game_stats_build 999999999999999999999999999999999');return false;">Reset</a></td>

            <table>
                  <tr>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 1111111');return false;"><span class="diepMod-Regen">Health Regen</span></a></td>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 2222222');return false;"><span class="diepMod-Health">Max Health</span></a></td>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 3333333');return false;"><span class="diepMod-Bump">Body Dmg</span></a></td>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 4444444');return false;"><span class="diepMod-Speed">Bullet Speed</span></a></td>
                  </tr>
                  <tr>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 5555555');return false;"><span class="diepMod-Pen">Bullet Pen</span></a></td>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 6666666');return false;"><span class="diepMod-Damage">Bullet Dmg</span></a></td>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 7777777');return false;"><span class="diepMod-Reload">Reload</span></a></td>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 8888888');return false;"><span class="diepMod-Move">Move Speed</span></a></td>
                  </tr>
            </table>
          </div>
 

            <table>

                <tr>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 456784567845678456745674567456788');return false;">Attacker</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">0</span> / <span class="diepMod-Health">0</span> / <span class="diepMod-Bump">0</span> / <span class="diepMod-Speed">7</span> / <span class="diepMod-Pen">7</span> / <span class="diepMod-Damage">7</span> / <span class="diepMod-Reload">7</span> / <span class="diepMod-Move">5</span></span></td>

                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 456456845684563458642586485638328');return false;">Drone</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">0</span> / <span class="diepMod-Health">2</span> / <span class="diepMod-Bump">3</span> / <span class="diepMod-Speed">0</span> / <span class="diepMod-Pen">7</span> / <span class="diepMod-Damage">7</span> / <span class="diepMod-Reload">7</span> / <span class="diepMod-Move">7</span></span></td>


                </tr>
                <tr>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 332231332323121228881888187777777');return false;">Booster</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">5</span> / <span class="diepMod-Health">7</span> / <span class="diepMod-Bump">7</span> / <span class="diepMod-Speed">0</span> / <span class="diepMod-Pen">0</span> / <span class="diepMod-Damage">0</span> / <span class="diepMod-Reload">7</span> / <span class="diepMod-Move">7</span></span></td>

                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 458845457784785576546768678456768');return false;">Fighter</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">0</span> / <span class="diepMod-Health">0</span> / <span class="diepMod-Bump">0</span> / <span class="diepMod-Speed">6</span> / <span class="diepMod-Pen">7</span> / <span class="diepMod-Damage">6</span> / <span class="diepMod-Reload">7</span> / <span class="diepMod-Move">7</span></span></td>

                </tr>
                <tr>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 567567567567567567567222222288113');return false;">Mineer</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">2</span> / <span class="diepMod-Health">7</span> / <span class="diepMod-Bump">1</span> / <span class="diepMod-Speed">0</span> / <span class="diepMod-Pen">7</span> / <span class="diepMod-Damage">7</span> / <span class="diepMod-Reload">7</span> / <span class="diepMod-Move">2</span></span></td>

                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 123232323232321818838888238238238');return false;">Smasher</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">3</span> / <span class="diepMod-Health">10</span> / <span class="diepMod-Bump">10</span> / <span class="diepMod-Speed">0</span> / <span class="diepMod-Pen">0</span> / <span class="diepMod-Damage">0</span> / <span class="diepMod-Reload">0</span> / <span class="diepMod-Move">10</span></span></td>

                </tr>
                <tr>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 222113333333222211111686886868688');return false;">BaitSter</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">7</span> / <span class="diepMod-Health">7</span> / <span class="diepMod-Bump">7</span> / <span class="diepMod-Speed">0</span> / <span class="diepMod-Pen">0</span> / <span class="diepMod-Damage">5</span> / <span class="diepMod-Reload">0</span> / <span class="diepMod-Move">7</span></span></td>

                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 456741567425671456742567526754674');return false;">Penta</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">2</span> / <span class="diepMod-Health">3</span> / <span class="diepMod-Bump">0</span> / <span class="diepMod-Speed">7</span> / <span class="diepMod-Pen">7</span> / <span class="diepMod-Damage">7</span> / <span class="diepMod-Reload">7</span> / <span class="diepMod-Move">0</span></span></td>

                </tr>
                <tr>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 456456456845168456845684562211888');return false;">Manager</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">3</span> / <span class="diepMod-Health">2</span> / <span class="diepMod-Bump">0</span> / <span class="diepMod-Speed">7</span> / <span class="diepMod-Pen">7</span> / <span class="diepMod-Damage">7</span> / <span class="diepMod-Reload">0</span> / <span class="diepMod-Move">7</span></span></td>
                    <td><a class="diepMod-button" onclick="input.execute('game_stats_build 567567567567567567567822222288881');return false;">Multi</a></td>
                    <td><span class="diepMod-description"><span class="diepMod-Regen">1</span> / <span class="diepMod-Health">6</span> / <span class="diepMod-Bump">0</span> / <span class="diepMod-Speed">0</span> / <span class="diepMod-Pen">7</span> / <span class="diepMod-Damage">7</span> / <span class="diepMod-Reload">7</span> / <span class="diepMod-Move">5</span></span></td>

</tr>


            </table>
              <hr class="diepMod-hr" />
              <div class="diepMod-subtitle">&nbsp;&nbsp;&nbsp;&nbsp;Achievements</div>
              <table>
                  <tr>
                     <td><a class="diepMod-button" onclick="achievementFlag(1);return false;">Get all achievements</a></td>
                      <td><a class="diepMod-button" onclick="achievementFlag(0);return false;">Remove all achievements</a></td>
                  </tr>
                 <div>
                  <tr>
                       <td><span class="diepMod-warning">&nbsp;&nbsp;This will reload the page.</span></td>
                  </tr>
             </table>

         </div>
        `;
   }
