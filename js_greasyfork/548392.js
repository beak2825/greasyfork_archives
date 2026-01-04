// ==UserScript==
// @name         Krunker Cheat
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  Krunker Cheats!
// @author       Sk1d
// @license      GNU GPLv3
// @match        *://krunker.io/*
// @exclude      *://krunker.io/editor*
// @exclude      *://krunker.io/social*
// @match        *://browserfps.com/*
// @match        *://*.browserfps.com/*
// @exclude      *://*.browserfps.com/editor*
// @exclude      *://*.browserfps.com/social*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krunker.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548392/Krunker%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/548392/Krunker%20Cheat.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* eslint-disable no-caller, no-sequences, curly, no-undef, no-loop-func */

class Cheat {
    constructor() {
        window[this.getHash("cheat")] = this;
        this.tabs = ['Render','Weapon','Player','Radio'];
        this.settings;
        this.downKeys = new Set();
        try {
            this.onLoad();
        }
        catch(err) {
            console.trace(err);
        }
    }
    // Main
    onLoad() {

        this.settings = {

            // Render

            showToggleBtn: {
                tab: "Render",
                name: "Show Menu Button",
                val: true,
                html: () => this.generateSetting("checkbox", "showToggleBtn"),
                set: (value, init) => {
                    let button = document.getElementById("mainButton");
                    if (!this.isDefined(button)) this.createButton("#menuItemContainer", "mainButton", "Cheat", `https://c.tenor.com/2HXEVfJLVFgAAAAi/digi-digislang.gif`, this.getHash("cheat")+".toggleMenu()", value)
                    this.waitFor(() => document.getElementById("mainButton")).then(button => { button.style.display = value ? "inherit" : "none" })
                }
            },
            showNameTags: {
                tab: "Render",
                pre: "<div class='separator'>Color ESP</div>",
                name: "Player Nametags",
                val: false,
                html: () => this.generateSetting("checkbox", "showNameTags"),
            },
            render2dBox: {
                tab: "Render",
                name: "Player 2d Boxes",
                val: false,
                html: () => this.generateSetting("checkbox", "render2dBox"),
            },
            renderTracers: {
                tab: "Render",
                name: "Player Tracers",
                val: false,
                html: () => this.generateSetting("checkbox", "renderTracers"),
            },
            espHostileCol: {
                tab: "Render",
                name: "Hostile Color",
                val: "#ff0000",
                html: () => this.generateSetting("color", "espHostileCol"),
            },
            espFriendlyCol: {
                tab: "Render",
                name: "Friendly Color",
                val: "#00ff00",
                html: () => this.generateSetting("color", "espFriendlyCol"),
            },
            renderChams: {
                tab: "Render",
                pre: "<div class='separator'>Color Chams</div>",
                name: "Player Chams",
                val: false,
                html: () => this.generateSetting("checkbox", "renderChams") //+
            },
            renderWireFrame: {
                tab: "Render",
                name: "Player Wireframe",
                val: false,
                html: () => this.generateSetting("checkbox", "renderWireFrame"),
            },

            // Weapon

            autoReload: {
                tab: "Weapon",
                //pre: "<br><div class='setHed'>Weapon</div>",
                name: "Auto Reload",
                val: false,
                html: () => this.generateSetting("checkbox", "autoReload"),
            },
            weaponZoom: {
                tab: "Weapon",
                name: "Weapon Zoom",
                val: 1.0,
                min: 0,
                max: 50.0,
                step: 0.01,
                html: () => this.generateSetting("slider", "weaponZoom"),
                set: (value) => this.waitFor(() => this.renderer).then(renderer => { renderer.adsFovMlt.fill(value) })
            },
            autoAim: {
                tab: "Weapon",
                pre: "<div class='separator'>Auto Aim</div>",
                name: "Auto Aim Type",
                val: "off",
                can: true,
                html: () =>
                this.generateSetting("select", "autoAim", {
                    off: "Off",
                    correction: "Aim Correction",
                    smoothCam: "Smooth Assist",
                    smoothCamAssist: "Smooth Assist & Aim Correction",
                    assist: "Legit Aim Assist",
                    easyassist: "Easy Aim Assist",
                    silent: "Silent Aim",
                    trigger: "Trigger Bot",
                    quickScope: "Quick Scope"
                }),
            },
            fovBoxSize: {
                tab: "Weapon",
                name: "FOV Box Type",
                val: "off",
                html: () =>
                this.generateSetting("select", "fovBoxSize", {
                    off: "Off",
                    small: "Small",
                    medium: "Medium",
                    large: "Large"
                })
            },
            renderTarget: {
                tab: "Weapon",
                name: "Show Target Indicator",
                val: false,
                html: () => this.generateSetting("checkbox", "renderTarget"),
            },
            wallBangs: {
                tab: "Weapon",
                name: "Aim through Penetratables",
                val: false,
                html: () => this.generateSetting("checkbox", "wallBangs"),
            },

            // Player

            autoBhop: {
                tab: "Player",
                //pre: "<br><div class='setHed'>Player</div>",
                name: "Auto Bhop Type",
                val: "off",
                html: () => this.generateSetting("select", "autoBhop", {
                    off: "Off",
                    autoJump: "Auto Jump",
                    keyJump: "Key Jump",
                    autoSlide: "Auto Slide",
                    keySlide: "Key Slide"
                }),
            },

            thirdPerson: {
                tab: "Player",
                name: "Third Person",
                val: false,
                html: () => this.generateSetting("checkbox", "thirdPerson"),
                set: (value, init) => {
                    if (!init) confirm("Reload Lobby To Apply?") ? location.reload() : void 0
                }
            },

            // Radio

            playStream: {
                tab: "Radio",
                //pre: "<br><div class='setHed'>Radio Stream Player</div>",
                name: "Stream Select",
                val: "off",
                html: () => this.generateSetting("select", "playStream", {
                    off: 'Off',
                    _2000s: 'General German/English',
                    _HipHopRNB: 'Hip Hop / RNB',
                    _Oldskool: 'Hip Hop Oldskool',
                    _Country: 'Country',
                    _Pop: 'Pop',
                    _Dance: 'Dance',
                    _Dubstep: 'DubStep',
                    _Lowfi: 'LoFi HipHop',
                    _Jazz: 'Jazz',
                    _Oldies: 'Golden Oldies',
                    _Club: 'Club',
                    _Folk: 'Folk',
                    _ClassicRock: 'Classic Rock',
                    _Metal: 'Heavy Metal',
                    _DeathMetal: 'Death Metal',
                    _Classical: 'Classical',
                    _Alternative: 'Alternative',
                }),
                set: (value) => {
                    if (value == "off") {
                        if ( this.settings.playStream.audio ) {
                            this.settings.playStream.audio.pause();
                            this.settings.playStream.audio.currentTime = 0;
                            this.settings.playStream.audio = null;
                        }
                        return;
                    }
                    let url = this.settings.playStream.urls[value];
                    if (!this.settings.playStream.audio) {
                        this.settings.playStream.audio = new Audio(url);
                        this.settings.playStream.audio.volume = this.settings.audioVolume.val||0.5
                    } else {
                        this.settings.playStream.audio.src = url;
                    }
                    this.settings.playStream.audio.load();
                    this.settings.playStream.audio.play();
                },
                urls: {
                    _2000s: 'http://0n-2000s.radionetz.de/0n-2000s.aac',
                    _HipHopRNB: 'https://stream-mixtape-geo.ntslive.net/mixtape2',
                    _Country: 'https://live.wostreaming.net/direct/wboc-waaifmmp3-ibc2',
                    _Dance: 'http://streaming.radionomy.com/A-RADIO-TOP-40',
                    _Pop: 'http://bigrradio.cdnstream1.com/5106_128',
                    _Jazz: 'http://strm112.1.fm/ajazz_mobile_mp3',
                    _Oldies: 'http://strm112.1.fm/60s_70s_mobile_mp3',
                    _Club: 'http://strm112.1.fm/club_mobile_mp3',
                    _Folk: 'https://freshgrass.streamguys1.com/irish-128mp3',
                    _ClassicRock: 'http://1a-classicrock.radionetz.de/1a-classicrock.mp3',
                    _Metal: 'http://streams.radiobob.de/metalcore/mp3-192',
                    _DeathMetal: 'http://stream.laut.fm/beatdownx',
                    _Classical: 'http://live-radio01.mediahubaustralia.com/FM2W/aac/',
                    _Alternative: 'http://bigrradio.cdnstream1.com/5187_128',
                    _Dubstep: 'http://streaming.radionomy.com/R1Dubstep?lang=en',
                    _Lowfi: 'http://streams.fluxfm.de/Chillhop/mp3-256',
                    _Oldskool: 'http://streams.90s90s.de/hiphop/mp3-128/',
                },
                audio: null,
            },

            audioVolume: {
                tab: "Radio",
                name: "Radio Volume",
                val: 0.5,
                min: 0,
                max: 1,
                step: 0.01,
                html: () => this.generateSetting("slider", "audioVolume"),
                set: (value) => { if (this.settings.playStream.audio) this.settings.playStream.audio.volume = value;}
            },
        }

        window.addEventListener('DOMContentLoaded', event => {
            //Auto Redirect
            this.waitFor(() => window.instructionsUpdate).then(node => {
                this.createObserver(node, 'style', (target) => {
                    if (target.textContent.includes('Connection Banned')) {
                        localStorage.removeItem("krunker_token");
                        alert("You Have Been Banned And Sign Out,Make A New Account And Change Your IP")
                        //location.assign('https://browserfps.com/');
                        // Auto Find New
                    } else if (this.arrayTest(target, ['Kicked', 'Banned', 'Disconnected', 'Error', 'Game is full', 'Connection Limited'], (txt) => target.innerHTML.includes(txt))) {
                        location = document.location.origin;
                    }
                });
            });
            // Get Main Custom CSS
            new Array(...document.styleSheets).map(css => {
                if (css.href) {
                    let arr = /http.*?krunker.io\/css\/(\w+.css).+/.exec(css.href);
                    if (arr && arr[1]) {
                        let name = arr[1];
                        if (name && name.includes("main_custom")) {
                            const rules = {
                                hideAdverts: `#aContainer, #aHolder, #endAContainer, #aMerger { display: none !important; }`,
                                hideCookies: `#onetrust-consent-sdk { display: none !important; }`,
                                hideTopLeft: `#tlInfHold { display: none !important; }`,

                                tabStyle: '.tab { overflow: hidden; border: 1px solid #ccc; background-image: linear-gradient(#2f3136, #f1f1f1, #2f3136); }',
                                btnStyle: '.tab button { background-color: inherit; float: left; border: none; outline: solid; cursor: pointer; padding: 14px 16px; transition: 0.3s; font-size: 17px; font-weight:500;color:black;text-shadow: 2px 2px #FFF;}',
                                btnHoverStyle: '.tab button:hover { background-color: #ddd; }',
                                activeTabStyle: '.tab button.active { background-color: #ccc; }',
                                tabContentStyle: '.tabcontent { display: none; padding: 6px 12px; border: 1px solid #ccc; border-top: none; animation: fadeEffect 1s; /* Fading effect takes 1 second */}',
                                zeroToFullOpacity: '@keyframes fadeEffect { from {opacity: 0;} to {opacity: 1;} }',

                                separator: `.separator { display:flex;align-items:center;text-align:center }`,
                                separator:`.separator::before,.separator::after{content:'';flex:1;border-bottom:1px solid #000}`,
                                separator:`.separator:not(:empty)::before{margin-right:.25em}`,
                                separator:`.separator:not(:empty)::after{margin-left:.25em}`,
                            };
                            for (let key in rules) {
                                css.insertRule(rules[key]);
                            }
                        }
                    }
                }
            })

            this.waitFor(() => window.windows).then(() => {
                let win = window.windows[11]; win.html = "";
                win.header = this.getHash("cheat");
                win.gen = ()=> {
                    let tmpHTML = `<a href="https://greasyfork.org/en/users/704479-sk1d-lamer"><img border="0" style="width:100%;height:80px;" src="https://i.imgur.com/dS86KfJ.png" width="100" height="80"></a>`
                    tmpHTML += '<div class="tab">'; this.tabs.forEach(tab => { tmpHTML += `<button class="tablinks" onclick="${this.getHash("cheat")}.tabChange(event, '${tab}')">${tab}</button>` }); tmpHTML +='</div>'
                    this.tabs.forEach(tab => {
                        tmpHTML += `<div id="${tab}" class="tabcontent"> ${this.tabContent(tab)} </div>`
                    })

                    return tmpHTML
                }
                for (const key in this.settings) {
                    this.settings[key].def = this.settings[key].val;
                    if (!this.settings[key].disabled) {
                        let tmpVal = this.getSavedVal(key);
                        this.settings[key].val = tmpVal !== null ? tmpVal : this.settings[key].val;
                        this.settings[key].val = this.settings[key].val;
                        if (this.settings[key].val == "false") this.settings[key].val = false;
                        if (this.settings[key].val == "true") this.settings[key].val = true;
                        if (this.settings[key].val == "undefined") this.settings[key].val = this.settings[key].def;
                        if (this.settings[key].set) this.settings[key].set(this.settings[key].val, true);
                    }
                }
            })

        });

        window.addEventListener('keyup', event =>{
            if (this.downKeys.has(event.code)) this.downKeys.delete(event.code)
        });

        window.addEventListener('keydown', event =>{
            if (!document.activeElement || 'INPUT' == document.activeElement.tagName || !window.endUI && window.endUI.style.display) return;
            switch (event.code) {
                case 'F1': case 'KeyC':
                    event.preventDefault();
                    this.toggleMenu();
                    break;

                case 'NumpadSubtract':
                    document.exitPointerLock();
                    console.dir(this)
                    break;
                default:
                    if (!this.downKeys.has(event.code)) this.downKeys.add(event.code);
                    break;
            }
        });

        this.waitFor(() => this.exports).then(exports => {
            let toFind = {
                overlay: ["render", "canvas"],
                config: ["accAnnounce", "availableRegions", "assetCat"],
                three: ["ACESFilmicToneMapping", "TextureLoader", "ObjectLoader"],
                ws: ["socketReady", "ingressPacketCount", "ingressPacketCount", "egressDataSize"],
                utility: ["VectorAdd", "VectorAngleSign"],
                colors: ["getClanCol", "hudHealth", "teams"],
                ui: ["showEndScreen", "toggleControlUI", "toggleEndScreen", "updatePlayInstructions"],
                events: ["actions", "events"],
            }
            for (let rootKey in exports) {
                let exp = exports[rootKey].exports;
                for (let name in toFind) {
                    if (this.arrayTest(exp, toFind[name], prop => exp.hasOwnProperty(prop))) {
                        console.log("Found Object ", name);
                        delete toFind[name];
                        this[name] = exp;
                    }
                }
            }
            if (!(Object.keys(toFind).length === 0 && toFind.constructor === Object)) {
                for (let name in toFind) {
                    alert("Failed To Find Object " + name);
                }
            } else {

                // socket
                cheat.ws.send = new Proxy(cheat.ws.send, {
                    apply(target, that, [type, event]) {
                        if (type === "en") {
                        }
                        return Reflect.apply(...arguments);
                    }
                });

                cheat.ws._dispatchEvent = new Proxy(cheat.ws._dispatchEvent, {
                    apply(target, that, [type, event]) {
                        if (type === "init") {
                            event[6].thirdPerson = cheat.settings.thirdPerson.val;
                        }
                        return Reflect.apply(...arguments);
                    }
                });

                //config
                Object.defineProperties(this.config, {
                    kickTimer: {
                        value: Infinity,
                        writable: false,
                    },
                    nameVisRate: {
                        value: 0,
                        writable: false,
                    },
                    clientSendRate: {
                        value: 0,
                        writable: false,
                    },
                });

                // three
                this.mesh = new Proxy({}, {
                    get(target, prop){
                        if(!target[prop]) {
                            target[prop] = new cheat.three.MeshBasicMaterial({
                                transparent: true,
                                fog: false,
                                depthTest: false,
                                color: prop,
                            });
                        }
                        return target[prop] ;
                    },
                });

                this.raycaster = {
                    ray: new this.three.Raycaster(),
                    mid: new this.three.Vector2(0, 0)
                }

                //overlay
                this.ctx = this.overlay.canvas.getContext('2d');
                this.overlay.render = new Proxy(this.overlay.render, {
                    apply: function(target, that, args) {
                        Reflect.apply(...arguments);
                        ["scale", "game", "controls", "renderer", "me"].forEach((name, index) => { cheat[name] = args[index] });
                        if (cheat.me) {
                            //cheat.renderer.renderer.setAnimationLoop(cheat.onRender);
                            cheat.ctx.save();
                            cheat.ctx.scale(cheat.scale, cheat.scale);
                            cheat.onRender();
                            cheat.ctx.restore();
                            if (!cheat.me.procInputs[cheat.getHash("isProxy")]) {

                                Object.defineProperties(cheat.me, {
                                    isHacker: {
                                        value: 0,
                                        writable: false
                                    },
                                    debugMode: {
                                        value: true,
                                        writable: false
                                    },
                                    recon: {
                                        value: true,
                                        writable: false
                                    },
                                });

                                cheat.me.procInputs = new Proxy(cheat.me.procInputs, {
                                    apply(target, that, [input, game, recon, lock]) {
                                        if (that) cheat.onInput(input);
                                        Reflect.apply(...arguments);
                                    },
                                    get(target, key) {
                                        return key === cheat.getHash("isProxy") ? true : Reflect.get(target, key);
                                    },
                                })

                            }
                        }
                    }
                })
            }
        })
    }
    onRender() {
        let scaledWidth = this.ctx.canvas.width / this.scale;
        let scaledHeight = this.ctx.canvas.height / this.scale;
        this.raycaster.ray.setFromCamera(this.raycaster.mid, this.renderer.camera);
        for (let iter = 0, length = this.game.players.list.length; iter < length; iter++) {
            let player = this.game.players.list[iter];
            if (!player || player.isYou || !player.active || !this.isDefined(player.objInstances) ) {
                continue;
            }

            let isEnemy = !this.me.team || this.me.team != player.team;
            let isRisky = player.isDev || player.isMod || player.isMapMod || player.canGlobalKick || player.canViewReports || player.partnerApp || player.canVerify || player.canTeleport || player.kpdData || player.fakeName;
            let position = player.objInstances.position;

            Object.defineProperties(player, {
                cnBSeen: {
                    set(val) {
                        this.inView = val;
                    },
                    get() {
                        let isEnemy =!cheat.isDefined(cheat.me)||!cheat.me.team||cheat.me.team !=this.team;
                        return this.inView||isEnemy&&cheat.settings&&cheat.settings.showNameTags.val;
                    }
                },
            });

            if (this.containsPoint(position)) {

                // Chams
                if (!player.objInstances.visible) {
                    Object.defineProperty(player.objInstances, 'visible', {
                        value: true,
                        writable: false
                    });
                }
                player.objInstances.traverse(obj => {
                    if (obj && obj.type=='Mesh' && obj.hasOwnProperty('material')) {
                        if (!obj.hasOwnProperty('_material')) {
                            obj._material = obj.material;
                        } else {
                            Object.defineProperty(obj, 'material', {
                                get() {
                                    if (cheat.isDefined(cheat.mesh) && cheat.settings.renderChams.val) {
                                        return cheat.mesh[ isEnemy ? cheat.overlay.rainbow.col : 'white' ];
                                    }
                                    return cheat._material;
                                }, set(val) {return cheat._material}
                            });
                        }

                        obj.material.wireframe = !!this.settings.renderWireFrame.val;
                    }
                })
                //Tracers
                if (this.settings.renderTracers.val) {
                    CanvasRenderingContext2D.prototype.save.apply(this.ctx, []);
                    let screenPos = this.world2Screen(position.clone(), scaledWidth, scaledHeight);
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.ctx.canvas.width/2, this.ctx.canvas.height - (this.ctx.canvas.height - scaledHeight));
                    this.ctx.lineTo(screenPos.x, screenPos.y);
                    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                    this.ctx.stroke();
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = isEnemy ? isRisky ? "#FFFF00" : this.settings.espHostileCol.val : this.settings.espFriendlyCol.val
                    this.ctx.stroke();
                    CanvasRenderingContext2D.prototype.restore.apply(this.ctx, []);
                }
                /*2d*/
                if (this.settings.render2dBox.val) {
                    CanvasRenderingContext2D.prototype.save.apply(this.ctx, []);
                    let screenBase = this.world2Screen(position.clone(), scaledWidth, scaledHeight);
                    let screenHead = this.world2Screen(position.clone(), scaledWidth, scaledHeight, player.height);
                    let difference = ~~(screenBase.y - screenHead.y);
                    let tildeFloor = ~~(difference * 0.6);
                    this.ctx.lineWidth = 4;
                    this.ctx.translate(~~(screenHead.x - tildeFloor / 2), ~~screenHead.y);
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, tildeFloor, difference);
                    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                    this.ctx.stroke();
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeStyle = isEnemy ? isRisky ? "#FFFF00" : this.settings.espHostileCol.val : this.settings.espFriendlyCol.val
                    this.ctx.stroke();
                    this.ctx.closePath();
                    CanvasRenderingContext2D.prototype.restore.apply(this.ctx, []);
                }
                /*Target Indicator*/
                if (player.isTarget) {
                    CanvasRenderingContext2D.prototype.save.apply(this.ctx, []);
                    let screenBase = this.world2Screen(position.clone(), scaledWidth, scaledHeight);
                    let screenHead = this.world2Screen(position.clone(), scaledWidth, scaledHeight, player.height);
                    let difference = ~~(screenBase.y - screenHead.y);
                    this.ctx.lineWidth = 4;
                    this.ctx.beginPath()
                    this.ctx.translate(screenHead.x, screenHead.y + Math.abs(difference / 2))
                    this.ctx.arc(0, 0, Math.abs(difference / 2) + 14, 0, Math.PI * 2)
                    this.ctx.strokeStyle = "#FFFFFF"
                    this.ctx.stroke()
                    this.ctx.closePath()
                    CanvasRenderingContext2D.prototype.restore.apply(this.ctx, []);
                }
                /*fovBox*/
                if (this.settings.fovBoxSize.val !== 'off') {
                    let fovBox = null;
                    switch (this.settings.fovBoxSize.val) {
                        case 'large':
                            fovBox = [scaledWidth / 3, scaledHeight / 4, scaledWidth * (1 / 3), scaledHeight / 2]
                            break;
                            // medium
                        case 'medium':
                            fovBox = [scaledWidth * 0.4, scaledHeight / 3, scaledWidth * 0.2, scaledHeight / 3]
                            break
                            // small
                        case 'small':
                            fovBox = [scaledWidth * 0.45, scaledHeight * 0.4, scaledWidth * 0.1, scaledHeight * 0.2]
                            break
                    }
                    CanvasRenderingContext2D.prototype.save.apply(this.ctx, []);
                    this.ctx.strokeStyle = "red"
                    this.ctx.strokeRect(...fovBox)
                    CanvasRenderingContext2D.prototype.restore.apply(this.ctx, []);
                }
            }
        }
    }
    onInput(input) {
        const key = { frame: 0, delta: 1, xdir: 2, ydir: 3, moveDir: 4, shoot: 5, scope: 6, jump: 7, reload: 8, crouch: 9, weaponScroll: 10, weaponSwap: 11, moveLock: 12 };

        // Auto Reload
        if (this.settings.autoReload.val) {
            let weaponIndex = this.me.weapon.secondary ? 1 : 0, ammoLeft = this.me.ammos[weaponIndex], isMelee = this.me.weapon.melee || this.me.weapon.canThrow;
            if (!isMelee && !ammoLeft) {
                input[key.reload] = 1;
            }
        }

        // Auto Bhop
        if (this.settings.autoBhop.val !== "off") {
            if (this.downKeys.has("Space") || this.settings.autoBhop.val == "autoJump" || this.settings.autoBhop.val == "autoSlide") {
                this.controls.keys[this.controls.binds.jump.val] ^=1;
                if (this.downKeys.has("Space") || this.settings.autoBhop.val == "autoSlide") {
                   if (!this.me.onGround && this.me.canSlide) {
                       this.controls.keys[this.controls.binds.crouch.val] = 1;
                   }
                    else if (this.me.onGround) {
                        setTimeout(() => {
                            this.controls.keys[this.controls.binds.crouch.val] = 0;
                        }, 200);
                    }
                }
            }
        }

        this.game.players.list.forEach(plr => { plr.isTarget = false })

        //AutoAim
        let target = null, targets = this.settings.autoAim.val !== "off" && this.game.players.list.filter(entity => {
            let isEnemy =!this.isDefined(this.me) || !this.me.team || this.me.team !=entity.team;
            return this.isDefined(entity.objInstances) && !entity.isYou && isEnemy && entity.health > 0 && (entity.inView || null == this.getCanSee(this.me, entity.x, entity.y, entity.z));
        }).sort((p1, p2) => this.getD3D(this.me.x, this.me.z, p1.x, p1.z) - this.getD3D(this.me.x, this.me.z, p2.x, p2.z))
        if (this.settings&&this.settings.fovBoxSize.val !== 'off') {
                let scaledWidth = this.ctx.canvas.width / this.scale;
                let scaledHeight = this.ctx.canvas.height / this.scale;
                for (let i = 0; i < targets.length; i++) {
                    const t = targets[i];
                    const sp = this.world2Screen(new this.three.Vector3(t.x, t.y, t.z), scaledWidth, scaledHeight, t.height / 2);
                    let fovBox = null;
                    switch (this.settings.fovBoxSize.val) {
                        case 'large':
                            fovBox = [scaledWidth / 3, scaledHeight / 4, scaledWidth * (1 / 3), scaledHeight / 2]
                            break;
                            // medium
                        case 'medium':
                            fovBox = [scaledWidth * 0.4, scaledHeight / 3, scaledWidth * 0.2, scaledHeight / 3]
                            break
                            // small
                        case 'small':
                            fovBox = [scaledWidth * 0.45, scaledHeight * 0.4, scaledWidth * 0.1, scaledHeight * 0.2]
                            break
                    }
                    if (sp.x >= fovBox[0] && sp.x <= (fovBox[0] + fovBox[2]) && sp.y >= fovBox[1] && sp.y < (fovBox[1] + fovBox[3])) {
                        target = targets[i]
                        break
                    }
                }
            } else target = targets.shift();
        if (target && !this.me.reloadTimer) {
            const multiplier = 1e3;
            let yDire = (this.getDir(this.me.z, this.me.x, target.z, target.x) || 0);
            let xDire = ((this.getXDir(this.me.x, this.me.y, this.me.z, target.x, target.y - target.crouchVal * 3 + this.me.crouchVal * 3, target.z) || 0) - (0.3 * this.me.recoilAnimY));
            let aimAt = () => {
                this.controls.object.rotation.y = yDire;
                this.controls.pchObjc.rotation.x = xDire;
                this.controls.pchObjc.rotation.x = Math.max(-(Math.PI / 2), Math.min((Math.PI / 2), this.controls.pchObjc.rotation.x));
                this.controls.yDr = (this.controls.pchObjc.rotation.x % Math.PI).round(3);
                this.controls.xDr = (this.controls.object.rotation.y % Math.PI).round(3);
                this.controls.update(400);
                input[key.scope] = 1;
            }
            let FixAim = () => {
                input[key.ydir] = yDire * multiplier;
                input[key.xdir] = xDire * multiplier;
            }
            target.isTarget = this.settings.renderTarget.val;
            switch (this.settings.autoAim.val) {
                case "quickScope":
                    if (this.me.aimDir == 1 || input[key.scope] == 0) { aimAt() }
                    if (this.me.didShoot && this.me.weapon.nAuto && !this.me.weapon.burst) { input[key.shoot] = 0 }
                    else if (this.me.aimVal == 0) { input[key.shoot] = 1 }
                    if (input[key.shoot] == 1) { FixAim() }
                    break;
                case "silent":
                    input[key.scope] = 1;
                    if (!this.me.aimVal||this.me.weapon.noAim) {
                        FixAim();
                        input[key.shoot] = 1;
                    }
                    break;
                case "correction":
                    if (input[key.shoot] == 1) { FixAim() }
                    break;
                case "smoothCam": case "smoothCamAssist":
                    if (input[key.scope]) {
                        this.controls.target = {
                            xD: xDire,
                            yD: yDire,
                            GG: true
                        };
                        this.controls.update(400);
                        this.controls.target = this.controls.target && this.controls.target.GG ? null : this.controls.target;
                        if (this.settings.autoAim.val == "smoothCamAssist" && input[key.shoot] == 1) {
                            FixAim();
                        }
                    }
                    break;
                case "trigger":
                    if (target.objInstances && this.raycaster.ray.intersectObjects([target.objInstances], true).length) {
                        input[key.scope] = 1;
                        input[key.shoot] = 1;
                    }
                    break;
                case "assist":
                    if (target.objInstances && !this.raycaster.ray.intersectObjects([target.objInstances], true).length) {
                        this.controls.object.rotation.y = yDire;
                        this.controls.xDr = (this.controls.object.rotation.y % Math.PI).round(3);
                    }
                    break;
                case "easyassist":
                    if (input[key.scope] && target.objInstances && !this.raycaster.ray.intersectObjects([target.objInstances], true).length) {
                        aimAt();
                    }
                    break;
            }
        }
    }

    //GUI
    generateSetting(type, name, extra) {
        switch (type) {
            case 'button':
                return `<input type="button" name="${type}" id="slid_utilities_${name}" class="settingsBtn" onclick="${extra.function}" value="${extra.label}" style="float:right;width:auto"/>`;
            case 'checkbox':
                return `<label class="switch"><input type="checkbox" onclick="${this.getHash("cheat")}.setSetting('${name}', this.checked)" ${this.settings[name].val ? 'checked' : ''}><span class="slider"></span></label>`;
            case 'slider':
                return `<span class='sliderVal' id='slid_utilities_${name}'>${this.settings[name].val}</span><div class='slidecontainer'><input type='range' min='${this.settings[name].min}' max='${this.settings[name].max}' step='${this.settings[name].step}' value='${this.settings[name].val}' class='sliderM' oninput="${this.getHash("cheat")}.setSetting('${name}', this.value)"></div>`
                case 'select': {
                    let temp = `<select onchange="${this.getHash("cheat")}.setSetting(\x27${name}\x27, this.value)" class="inputGrey2">`;
                    for (let option in extra) {
                        temp += '<option value="' + option + '" ' + (option == this.settings[name].val ? 'selected' : '') + '>' + extra[option] + '</option>';
                    }
                    temp += '</select>';
                    return temp;
                }
            default:
                return `<input type="${type}" name="${type}" id="slid_utilities_${name}"\n${'color' == type ? 'style="float:right;margin-top:5px"' : `class="inputGrey2" placeholder="${extra}"`}\nvalue="${this.settings[name].val}" oninput="${this.getHash("cheat")}.setSetting(\x27${name}\x27, this.value)"/>`;
        }
    }
    setSetting(key, value) {
        this.settings[key].val = value;
        //await GM.setValue(key, value);
        this.saveVal(key, value);
        if (document.getElementById(`slid_utilities_${key}`)) document.getElementById(`slid_utilities_${key}`).innerHTML = value;
        if (this.settings[key].set) this.settings[key].set(value);
    }
    saveVal(name, val) {
        localStorage.setItem("cht_"+name, val);
    }
    deleteVal(name) {
        localStorage.removeItem("cht_"+name);
    }
    getSavedVal(name) {
        return localStorage.getItem("cht_"+name);
    }
    tabContent(name) {
        let tmpHTML = "";
        for (let key in this.settings) {
            if (this.settings[key].tab == name) {
                if (this.settings[key].pre) tmpHTML += this.settings[key].pre;
                tmpHTML += "<div class='settName' id='" + key + "_div' style='display:block'>" + this.settings[key].name + " " + this.settings[key].html() + "</div>";
            }
        }
        return tmpHTML;
    }
    tabChange(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
    toggleMenu() {
        let lock = document.pointerLockElement || document.mozPointerLockElement;
        if (lock) document.exitPointerLock();
        if (window.showWindow) window.showWindow(12);
        if (this.isDefined(window.SOUND)) window.SOUND.play(`tick_0`,0.1)
    }
    createElement(element, attribute, inner) {
        if (!this.isDefined(element)) {
            return null;
        }
        if (!this.isDefined(inner)) {
            inner = "";
        }
        let el = document.createElement(element);
        if (this.isType(attribute, 'object')) {
            for (let key in attribute) {
                el.setAttribute(key, attribute[key]);
            }
        }
        if (!Array.isArray(inner)) {
            inner = [inner];
        }
        for (let i = 0; i < inner.length; i++) {
            if (inner[i].tagName) {
                el.appendChild(inner[i]);
            } else {
                el.appendChild(document.createTextNode(inner[i]));
            }
        }
        return el;
    }
    createButton(parent, id, name, iconURL, fn, visible) {
        visible = visible ? "inherit":"none";
        this.waitFor(_=>document.querySelector(parent)).then(parent => {
            let icon = this.createElement("div",{"class":"menuItemIcon", "style":`background-image:url("${iconURL}");display:inherit;`});
            let title= this.createElement("div",{"class":"menuItemTitle", "style":`display:inherit;`}, name);
            let host = this.createElement("div",{"id":id, "class":"menuItem", "onmouseenter":"playTick()", "onclick":`${fn}`, "style":`display:${visible};`},[icon, title]);
            if (parent) parent.append(host)
        })
    }

    // Visual
    getD3D(x1, y1, z1, x2, y2, z2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        let dz = z1 - z2;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    getAngleDst(a, b) {
        return Math.atan2(Math.sin(b - a), Math.cos(a - b));
    }
    getXDir(x1, y1, z1, x2, y2, z2) {
        let h = Math.abs(y1 - y2);
        let dst = this.getD3D(x1, y1, z1, x2, y2, z2);
        return (Math.asin(h / dst) * ((y1 > y2)?-1:1));
    }
    getDir(x1, y1, x2, y2) {
        return Math.atan2(y1 - y2, x1 - x2);
    }
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    }
    getAngleDist(a, b) {
        return Math.atan2(Math.sin(b - a), Math.cos(a - b));
    }
    containsPoint(point) {
        let planes = this.renderer.frustum.planes;
        for (let i = 0; i < 6; i ++) {
            if (planes[i].distanceToPoint(point) < 0) {
                return false;
            }
        }
        return true;
    }
    lineInRect(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
        let t1 = (x1 - lx1) * dx;
        let t2 = (x2 - lx1) * dx;
        let t3 = (y1 - ly1) * dy;
        let t4 = (y2 - ly1) * dy;
        let t5 = (z1 - lz1) * dz;
        let t6 = (z2 - lz1) * dz;
        let tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
        let tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
        if (tmax < 0) return false;
        if (tmin > tmax) return false;
        return tmin;
    }
    world2Screen(pos, width, height, yOffset = 0) {
        pos.y += yOffset
        pos.project(this.renderer.camera)
        pos.x = (pos.x + 1) / 2
        pos.y = (-pos.y + 1) / 2
        pos.x *= width
        pos.y *= height
        return pos
    }
    getCanSee(from, toX, toY, toZ, boxSize) {
        if (!from) return 0;
        boxSize = boxSize||0;
        for (let obj, dist = this.getD3D(from.x, from.y, from.z, toX, toY, toZ),
             xDr = this.getDir(from.z, from.x, toZ, toX),
             yDr = this.getDir(this.getDistance(from.x, from.z, toX, toZ), toY, 0, from.y),
             dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)),
             dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || 0) - 1.5,
             aa = 0; aa < this.game.map.manager.objects.length; ++aa) {
            if (!(obj = this.game.map.manager.objects[aa]).noShoot && obj.active && !obj.transparent && (!this.settings.wallBangs.val || (!obj.penetrable || !this.me.weapon.pierce))) {
                let tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize));
                if (tmpDst && 1 > tmpDst) return tmpDst;
            }
        }

        return null;
    }

    // General
    isType(item, type) {
        return typeof item === type;
    }
    isDefined(object) {
        return !this.isType(object, "undefined") && object !== null;
    }
    arrayTest(obj, arr, fn) {
        return arr.some(prop => fn(prop));
    }
    genHash(sz) {
        return [...Array(sz)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join('');
    }
    getHash(prop) {
        this.hashes = this.hashes || {};
        if (!this.hashes.hasOwnProperty(prop)) {
            this.hashes[prop] = this.genHash(prop.length);
        }
        return this.hashes[prop];
    }
    createObserver(elm, check, callback, onshow = true) {
        return new MutationObserver((mutationsList, observer) => {
            if (check == 'src' || onshow && mutationsList[0].target.style.display == 'block' || !onshow) {
                callback(mutationsList[0].target);
            }
        }).observe(elm, check == 'childList' ? {childList: true} : {attributes: true, attributeFilter: [check]});
    }
    async waitFor(test, timeout_ms = Infinity, doWhile = null) {
        let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        return new Promise(async (resolve, reject) => {
            if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
            let result, freq = 100;
            while (result === undefined || result === false || result === null || result.length === 0) {
                if (doWhile && doWhile instanceof Function) doWhile();
                if (timeout_ms % 1e4 < freq) console.log("waiting for: ", test);
                if ((timeout_ms -= freq) < 0) {
                    console.log( "Timeout : ", test );
                    resolve(false);
                    return;
                }
                await sleep(freq);
                result = typeof test === "string" ? Function(test)() : test();
            }
            console.log("Passed : ", test);
            resolve(result);
        });
    }
};(()=>{
    localStorage.setItem("logs", true);
    // Webpack Exports Again Sidney =)
    const keys = Object.keys;
    Object.keys= function(...args) {
        (function(target) {
            try {
                let caller = arguments.callee.caller.caller;
                if (caller && caller.arguments[0].hasOwnProperty('exports')&& caller.arguments[2].hasOwnProperty('c')) {
                    Object.keys = keys;
                    cheat.exports = caller.arguments[2].c;
                }
            } catch (err) {}
        })();
        return keys.apply(this, args);
    }
})(); const cheat = new Cheat();