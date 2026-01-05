// ==UserScript==
// @name       Browser Ponies
// @namespace  http://scratch.mit.edu
// @version    1.0
// @description  Ponify Scratch!
// @match      *://scratch.mit.edu/projects/*
// @author Katherine C.
// @downloadURL https://update.greasyfork.org/scripts/5959/Browser%20Ponies.user.js
// @updateURL https://update.greasyfork.org/scripts/5959/Browser%20Ponies.meta.js
// ==/UserScript==

//Install base scripts
var basecfg_script = document.createElement('script');
basecfg_script.setAttribute('type', 'text/javascript');
basecfg_script.setAttribute('src', 'https://panzi.github.io/Browser-Ponies/basecfg.js');
basecfg_script.setAttribute('id', 'browser-ponies-config');
document.head.appendChild(basecfg_script);

var browserponies_script = document.createElement('script'); 
browserponies_script.setAttribute('type', 'text/javascript');
browserponies_script.setAttribute('src', 'https://panzi.github.io/Browser-Ponies/browserponies.js');
browserponies_script.setAttribute('id', 'browser-ponies-script');
document.head.appendChild(browserponies_script);
	
function installExtensionBrowserPonies() {
	var cfg = {
		"fadeDuration": 500,
		"volume": 1,
		"fps": 25,
		"speed": 3,
		"audioEnabled": false,
		"showFps": false,
		"showLoadProgress": true,
		"speakProbability": 0.1,
		"baseurl": "https://panzi.github.io/Browser-Ponies/",
		"spawn": {}
	};

    (function(ext) {
        // Cleanup function when the extension is unloaded
        ext._shutdown = function() {};

        // Status reporting code
        // Use this to report missing hardware, plugin or unsupported browser
        ext._getStatus = function() {
        	if(BrowserPoniesBaseConfig.loaded){
            	return {status: 2, msg: 'Ready'};
            }
            else if(BrowserPonies != undefined && BrowserPoniesBaseConfig != undefined){
            	BrowserPonies.setBaseUrl(cfg.baseurl);
				BrowserPonies.loadConfig(BrowserPoniesBaseConfig);
				BrowserPonies.start();
				BrowserPoniesBaseConfig.loaded = true;
            	return {status: 1, msg: 'Not Ready'};
            }
            return {status: 0, msg: 'Not Ready'};
        };
        
        // Block and block menu descriptions
        var descriptor = {
            blocks: [
            	[' ', 'start', 'startPonies'],
            	[' ', 'stop', 'stopPonies'],
            	[' ', 'pause', 'pausePonies'],
            	[' ', 'resume', 'resumePonies'],
            	[' ', 'toggle ponies in background', 'toggleInBackground'],
            	[' ', 'remove all ponies', 'removePonies'],
            	['-'],
                [' ', 'add pony %s', 'addPony', 'derpy hooves'],
                [' ', 'add random pony', 'addRandomPony']
            ],

            menus: {
                ponies: ['derpy hooves', 'applejack','fluttershy','pinkie pie','rainbow dash','rarity','twilight sparkle']
            }
        };
		
		var ponyNames = [];
		
		//Commands
		ext.startPonies = function(){BrowserPonies.start();};
		ext.stopPonies = function(){BrowserPonies.stop();};
		ext.pausePonies = function(){BrowserPonies.pause();};
		ext.resumePonies = function(){BrowserPonies.resume();};
		ext.toggleInBackground = function(){BrowserPonies.togglePoniesToBackground()};
		ext.removePonies = function(){BrowserPonies.unspawnAll();};
		
		//Adding ponies
		ext.addPony = function(name){
			addPonyByName(name);
		}
		
		ext.addRandomPony = function(){
			checkLoaded();
			BrowserPonies.spawnRandom()
		}
		
		function addPonyByName (name){
			checkLoaded();
			if(BrowserPonies.ponies()[name] != undefined){
				//Check if the pony exists
				if(name == 'vinyl scratch'){
					//Seizure warning
					if(confirm('WARNING:\nContains flashing lights/patterns that may not be suitable for people with photosensitive epilepsy.')){
						if(BrowserPonies.ponies()[name] != undefined){
							console.log(cfg)
							cfg['spawn'] = {};
							cfg['spawn'][name] = 1;
							BrowserPonies.loadConfig(cfg);
						}
					}
				}
				else{
					console.log(cfg)
					cfg['spawn'] = {};
					cfg['spawn'][name] = 1;
					BrowserPonies.loadConfig(cfg);
				}
			}
		}
		
		function checkLoaded (){
			//Load BrowserPonies if it is not already loaded
			if(!BrowserPoniesBaseConfig.loaded){
				BrowserPonies.setBaseUrl(cfg.baseurl);
				BrowserPonies.loadConfig(BrowserPoniesBaseConfig);
				BrowserPonies.start();
				BrowserPoniesBaseConfig.loaded = true;
				ponyNames = keys(BrowserPonies.ponies());
			}
		}
		
        // Register the extension
        ScratchExtensions.register('Browser Ponies', descriptor, ext);
    })({});
}

installExtensionBrowserPonies();