// ==UserScript==
// @name           Gmail Favicon Alerts 3
// @description    Alerts you to the status of your Gmail Inbox through distinct Favicons.
// @version        3.14
// @date           2013-05-26
// @author         Peter Wooley
// @namespace      http://peterwooley.com
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACRlBMVEUAAAAAV7IAWbgAWrUAXL0AYMEAY8oAZ9EAatYAa9gAbdgAb9wAcNcAcNoAcd0AcuAAdN4AdeEAdtsAduUAeOIAeeQAeekAfOcAfe0AfukAf/AAge0AgfEAg/QAhO8AhfIAhfQAiPEAiPYAivgAjPoAjvwHjvcKd9sQguQQhecSddYTkPUVfdsViOgWj/IblPUciuscjegfkO8ggNYjl/Qmf9QmiNkmlvInmfMpj9sqid0rktsrlewtm+cvk+UxnewynfE0jdM1o/E3pPI6mt87jcs/kMxEnd9KqOlQre9WsO9Xmc1bq+hgse9rmr9vtu1ynr50q9h0uO51t+15pMJ+oLJ+ueiCpLWIu+KPxO2Rxe+SqrWUxuiVudOVyOqXyeyYx+ifsLmgq62hx92jy+enrq2qsbCq1OysxtCurKKu2O6u2PCvsauw0uOxrqOxrqSysKWy1ue0saa1s6i1uLS2tKi4taq5tqy6uKy8ua69urC+vLG/2ujBvrLCv7TC0tjFwrbG2OHJxbnLyLvL0c7MyLvM2t/Oyr7O4+zPzL7QzL/R2NXR4ObSzsHTz8TU0cTV1czW0cPY1Mba1sjb3tnc5OXc6vHd2cre2szg28zg6Org6ezh3c3h4tvi39Hk38/k39Dl4dHm4tTn5NXn5Nno49Po49To5Nbo6+bq5tjr6Nrr7urs59rs6Nvt6d3u6+Du7N/v7ODv8/Hw7N/w7eHx7uTy8OXy8ejz9Oz08eb18uj29Or39Oz49ev49e369/D6+PH8+vOx8hPUAAAAAXRSTlMAQObYZgAAA4tJREFUSMftlU1vVVUYhZ+1z2lvWwjSDzG0fFijCRg+agEJQRJ/gQOHwMSRExOG/gR/hiOJQiQiJo4UR3RAghEbCGiUpiLQe4FWsLTcvfdycM5pLzLQH8A+yR2ttd93rXe9+8KL899HQ1Bw+MNhg8EJY5wyTiHlWERjTEpPzs8IKPrA4fZvO0dlCcllFrjMysaBkIWMF85eAVUEHBZuDExKFhJGiIyMrIjAXP7mpmkqQGDpStoLCBEMJBmDHQzw/ZkHICw3BHx98aAMQAbJVi4sUIbz32ZbINQQCvXd+v3t0k2JhMmNEZ/PuLrLxJrQ51Jh4fr2zQDJJmSTi4yT7p6ZdbANuJuLAQOhoAghLF0bGZcJBlvOBuvm2TnJyCYlU7QMhFAUIRAe/7j6ZlIClDNSSHz35SMjQXKMhqIVDG5JUiHr1840BsgyJH31gy1jy08TQNHCwMl7qwFMYH7uQGVVBq2evmxkWRo9OksP4ZPJ24uFQlBw59qeVqWBxU9/scCYbYcmLvUSTm45OH8vgFyw+PPLY2SbG6fvOBhk7ZnaRENIACfoP3p/PgchWJ4Nrylx8eslqmSkQ/v6smdqggGOg6dje4UAIt78axfnLkZAho2H37BVE8pU59zw/lufzVWZ59Jj/SQqv8b3D9u52YdQw43xqx/vbtbk6tUKHth9bBhn7GcIOeeccHHqmARgUX3xwFRh5wYO5VpD1c/x7RceA7WZbNi3zZZdZfjfBHDiyNZzt8CyLG/ZO2zLeR3ftESV0oTZ+dGeaq/Ju94dgWqTnhNNsusXIHzwTgGQpvev3bWGb1pKkKptIcF7kxcesmlq3JU3CUJuui7XqK7MwTZ7R7/IR1qAMMjPVzBgRMyyYeHRiW47VV46A2HN2LK5F0EMVobltidaecMfKxhZFbCoIxFc48ld5+gM7T8Hd7Rg8PVXmmmoR3YpZNGlhK4My21v7U9k7LGBOytGgbw+KaqHBRwNxp2lTWOJDIY4MNnppB7BdYVKtAE/aXt7qPAmlpGxjbdXQnad82Zw1ZNjuz0/OBEgY5MiEXL/5KiCeltan2T3DhMtINfJKCMZ0ujQwt8yvYOTIRWdh5tHankmlhAxJFL/xP0H4O4awRJptc1EXyXWPQFKJOyRjXeXtR4+AQtz/eN9ZNs2kVg+7cETw9ZhPavhyY5+18piCcRgV4m0iZiXhjov/t////kHcJEkM9W3SMwAAAAASUVORK5CYII=
// @include        https://mail.google.com/mail*
// @include        http://mail.google.com/mail*
// @include        https://mail.google.com/mail*
// @include        http://mail.google.com/a*
// @include        https://mail.google.com/a*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/9091/Gmail%20Favicon%20Alerts%203.user.js
// @updateURL https://update.greasyfork.org/scripts/9091/Gmail%20Favicon%20Alerts%203.meta.js
// ==/UserScript==

if(typeof GM_getValue === "undefined") {
	function GM_getValue(name, fallback) {
		return fallback;
	}
}

// Register GM Commands and Methods
if(typeof GM_registerMenuCommand !== "undefined") {
	GM_registerMenuCommand( "Gmail Favicon Alerts > Chat Alerts On", function() { setChat(true) } );
	GM_registerMenuCommand( "Gmail Favicon Alerts > Chat Alerts Off", function() { setChat(false) } );
	GM_registerMenuCommand( "Gmail Favicon Alerts > Unread Count On", function() { setUnreadCountDisplay(true) } );
	GM_registerMenuCommand( "Gmail Favicon Alerts > Unread Count Off", function() { setUnreadCountDisplay(false) } );
	function setChat(val) { GM_setValue('chatEnabled', val) };
	function setUnreadCountDisplay(val) { GM_setValue('unreadCountDisplay', val) };
}

var gfia_instance;
var gfia_chat = GM_getValue('chatEnabled', true);

if(!window.frameElement) {
	new GmailFavIconAlerts();
  console.log("Making an instance.");
}

function GmailFavIconAlerts() {
	var self = this;
	this.construct = function() {				
		this.chat = this.getChat();
		this.chatting = false;
		this.head = window.document.getElementsByTagName('head')[0];
		this.title = this.head.getElementsByTagName('title')[0];
		this.inboxText = 'Inbox';
		this.chatText = [
							{value:'\u2026', chars: 1},
							{value:'...', chars: 3}
						];
		this.timer;
		this.icons = {
			chat:'data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWRQUANjo4AC6wagA0sW0AABqQAAAgsAAAJs8AACzwABE9/wAxV/8AUXH/AHGL/wCRpf8Asb//ANHa/wDt7e0AAAAAAAAaLwAALVAAAD9wAABRkAAAY7AAAHbPAACI8AARmP8AMab/AFGz/wBxwf8Akc//ALHd/wDR6/8A////AAAAAAAALC8AAEtQAABocAAAhpAAAKWwAADDzwAA4fAAEe//ADHx/wBR8/8AcfX/AJH3/wCx+f8A0fv/AP///wAAAAAAAC8hAABQNwAAcEwAAJBjAACweQAAz48AAPCmABH/tAAx/74AUf/IAHH/0wCR/9wAsf/lANH/8AD///8AAAAAAAAvDgAAUBgAAHAiAACQLAAAsDYAAM9AAADwSgAR/1sAMf9xAFH/hwBx/50Akf+yALH/yQDR/98A////AAAAAAACLwAABFAAAAZwAAAIkAAACrAAAAvPAAAO8AAAIP8SAD3/MQBb/1EAef9xAJj/kQC1/7EA1P/RAP///wAAAAAAFC8AACJQAAAwcAAAPZAAAEywAABZzwAAZ/AAAHj/EQCK/zEAnP9RAK7/cQDA/5EA0v+xAOT/0QD///8AAAAAACYvAABAUAAAWnAAAHSQAACOsAAAqc8AAMLwAADR/xEA2P8xAN7/UQDj/3EA6f+RAO//sQD2/9EA////AAAAAAAvJgAAUEEAAHBbAACQdAAAsI4AAM+pAADwwwAA/9IRAP/YMQD/3VEA/+RxAP/qkQD/8LEA//bRAP///wAAAAAALxQAAFAiAABwMAAAkD4AALBNAADPWwAA8GkAAP95EQD/ijEA/51RAP+vcQD/wZEA/9KxAP/l0QD///8AAAAAAC8DAABQBAAAcAYAAJAJAACwCgAAzwwAAPAOAAD/IBIA/z4xAP9cUQD/enEA/5eRAP+2sQD/1NEA////AAAAAAAvAA4AUAAXAHAAIQCQACsAsAA2AM8AQADwAEkA/xFaAP8xcAD/UYYA/3GcAP+RsgD/scgA/9HfAP///wAAAAAALwAgAFAANgBwAEwAkABiALAAeADPAI4A8ACkAP8RswD/Mb4A/1HHAP9x0QD/kdwA/7HlAP/R8AD///8AAAAAACwALwBLAFAAaQBwAIcAkAClALAAxADPAOEA8ADwEf8A8jH/APRR/wD2cf8A95H/APmx/wD70f8A////AAAAAAAbAC8ALQBQAD8AcABSAJAAYwCwAHYAzwCIAPAAmRH/AKYx/wC0Uf8AwnH/AM+R/wDcsf8A69H/AP///wAAAAAACAAvAA4AUAAVAHAAGwCQACEAsAAmAM8ALADwAD4R/wBYMf8AcVH/AIxx/wCmkf8Av7H/ANrR/wD///8AEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAPDw8PDw8PDw8PAAAQEAAADw8PDw8PDw8PDwAAEBAAAA8PDw8PDw8PDw8AABAQAAAPDw8QEBAQDw8PAAAQEAAADw8PDw8PDw8PDwAAEBAAAA8QEBAQEBAQEA8AABAQAAAPDw8PDw8PDw8PAAAQEAAADw8PEBAQEA8PDwAAEBAAAA8PDw8PDw8PDw8AABAQAAAPDw8PDw8PDw8PAAAQEAAADw8PDw8PDw8PDwAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP//AAD//wAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAD//wAA//8AAP//AAA=',
			read:'data:image/x-icon;base64,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',
			unread:'data:image/x-icon;base64,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',
		};
		this.pixelMaps = {
			icons: {
				'unread':
					[
						['','','','','','','','','','','','','','','',''],
						['','','','','','','','','','','','','','','',''],
						['','','','','','','','','','','','','','','',''],
						['','#306dd9','#4c7fee','#d8d8dd','#ededed','#ededed','#ededed','#ededed','#ededed','#ededed','#ebebed','#ebebed','#d6d6e0','#3e76ee','#2662d6',''],
						['','#1062ff','#0860ff','#1465fe','#adb9dd','#ededed','#ededed','#ededed','#ededed','#ededed','#ededed','#b2b9cd','#0b5afa','#0057ff','#0657ec',''],
						['','#0e5df5','#0e5df5','#0052fd','#004dff','#6693f2','#eae9e9','#ededed','#ededed','#f0ebe7','#6390f1','#0044ff','#004dff','#0a54e1','#0548cb',''],
						['','#0d5ff8','#236df8','#8da1d6','#1f62ed','#0044ff','#3271f2','#d7d8de','#d6d6e0','#3972e7','#003bff','#1e65f2','#92ace5','#1758d4','#0545d6',''],
						['','#0659f8','#1c6cff','#c7c7c6','#9a9a9a','#4470ce','#0044ff','#085eff','#085eff','#0042ff','#4477e6','#b1b0b0','#d0d0cf','#0b54df','#0543d5',''],
						['','#0659f8','#1465fe','#e1e1e1','#cbcbcb','#aeaca8','#748ac3','#0051fa','#0051fa','#7d97db','#c7c4bf','#d3d3d3','#e1e1e1','#0a52dc','#0545d6',''],
						['','#0659f8','#1465fe','#e1e1e1','#e1e1e1','#cecece','#b4b3b0','#a6adcc','#acb2d1','#c8c8c5','#d5d5d5','#dddddd','#dddfe2','#0a52dc','#0545d6',''],
						['','#0659f8','#1264ff','#e1e1e1','#e4e4e4','#e1e1e1','#d9d9d9','#bfbfbf','#c7c7c6','#d9d9d9','#dddddd','#e1e1e1','#dee0e5','#0b54df','#0545d8',''],
						['','#0358fc','#1264ff','#e1e1e1','#e4e4e4','#ebebed','#ebebed','#e1e1e1','#d9d9d9','#dddddd','#dddddd','#e4e4e4','#dee0e5','#0b54df','#0245dd',''],
						['','#0358fc','#1564f9','#e3e3e5','#ededed','#eae9e9','#eae9e9','#eae9e9','#e4e4e4','#e1e1e1','#e1e1e1','#e4e4e4','#dee0e5','#0b54df','#0245dd',''],
						['','#2d66d1','#2d66d1','#e4e4e4','#e1e1e1','#e1e1e1','#e1e1e1','#e1e1e1','#e1e1e1','#dddddd','#dddddd','#dddddd','#d9dce2','#0041d9','#36559c',''],
						['','','','','','','','','','','','','','','',''],
						['','','','','','','','','','','','','','','','']
					]
				},
			numbers: [
				[
					[0,1,1,0],
					[1,0,0,1],
					[1,0,0,1],
					[1,0,0,1],
					[0,1,1,0]
				],
				[
					[0,1,0],
					[1,1,0],
					[0,1,0],
					[0,1,0],
					[1,1,1]
				],
				[
					[1,1,1,0],
					[0,0,0,1],
					[0,1,1,0],
					[1,0,0,0],
					[1,1,1,1]
				],
				[
					[1,1,1,0],
					[0,0,0,1],
					[0,1,1,0],
					[0,0,0,1],
					[1,1,1,0]
				],
				[
					[0,0,1,0],
					[0,1,1,0],
					[1,0,1,0],
					[1,1,1,1],
					[0,0,1,0]
				],
				[
					[1,1,1,1],
					[1,0,0,0],
					[1,1,1,0],
					[0,0,0,1],
					[1,1,1,0]
				],
				[
					[0,1,1,0],
					[1,0,0,0],
					[1,1,1,0],
					[1,0,0,1],
					[0,1,1,0]
				],
				[
					[1,1,1,1],
					[0,0,0,1],
					[0,0,1,0],
					[0,1,0,0],
					[0,1,0,0]
				],
				[
					[0,1,1,0],
					[1,0,0,1],
					[0,1,1,0],
					[1,0,0,1],
					[0,1,1,0]
				],
				[
					[0,1,1,0],
					[1,0,0,1],
					[0,1,1,1],
					[0,0,0,1],
					[0,1,1,0]
				],
			]
		};
		
		this.timer = setInterval(this.poll, 500);
		this.poll();
		
		return true;
	}
	
	this.drawUnreadCount = function(unread) {
		if(!self.textedCanvas) {
			self.textedCanvas = [];
		}
		
		if(!self.textedCanvas[unread]) {
			var iconCanvas = self.getUnreadCanvas();
			var textedCanvas = document.createElement('canvas');
			textedCanvas.height = textedCanvas.width = iconCanvas.width;
			var ctx = textedCanvas.getContext('2d');
			ctx.drawImage(iconCanvas, 0, 0);
			
			ctx.fillStyle = "#fef4ac";
			ctx.strokeStyle = "#dabc5c";
			ctx.strokeWidth = 1;
			
			var count = unread.length;
			var bgHeight = self.pixelMaps.numbers[0].length;
			var bgWidth = 0;
			var padding = count > 2 ? 0 : 1;
			
			for(var index = 0; index < count; index++) {
				bgWidth += self.pixelMaps.numbers[unread[index]][0].length;
				if(index < count-1) {
					bgWidth += padding;
				}
			}
			bgWidth = bgWidth > textedCanvas.width-4 ? textedCanvas.width-4 : bgWidth;
			
			ctx.fillRect(textedCanvas.width-bgWidth-4,2,bgWidth+4,bgHeight+4);
			
			
			var digit;
			var digitsWidth = bgWidth;
			for(var index = 0; index < count; index++) {
				digit = unread[index];
				if (self.pixelMaps.numbers[digit]) {
					var map = self.pixelMaps.numbers[digit];
					var height = map.length;
					var width = map[0].length;
					
					
					ctx.fillStyle = "#2c3323";
					
					for (var y = 0; y < height; y++) {
						for (var x = 0; x < width; x++) {
							if(map[y][x]) {
								ctx.fillRect(14- digitsWidth + x, y+4, 1, 1);
							}
						}
					}
					
					digitsWidth -= width + padding;
				}
			}	
			
			ctx.strokeRect(textedCanvas.width-bgWidth-3.5,2.5,bgWidth+3,bgHeight+3);
			
			self.textedCanvas[unread] = textedCanvas;
		}
		
		return self.textedCanvas[unread];
	}
	this.getUnreadCanvas = function() {
		if(!self.unreadCanvas) {
			self.unreadCanvas = document.createElement('canvas');
			self.unreadCanvas.height = self.unreadCanvas.width = 16;
			
			var ctx = self.unreadCanvas.getContext('2d');
			
			for (var y = 0; y < self.unreadCanvas.width; y++) {
				for (var x = 0; x < self.unreadCanvas.height; x++) {
					if (self.pixelMaps.icons.unread[y][x]) {
						ctx.fillStyle = self.pixelMaps.icons.unread[y][x];
						ctx.fillRect(x, y, 1, 1);
					}
				}
			}
		}
		
		return self.unreadCanvas;
	}
	this.getChat = function() { return false || GM_getValue('chatEnabled', true); }
	this.getDebugging = function() { return false || GM_getValue('debuggingEnabled', false); }
	this.getSearchElement = function() {
		var element;
		var nav = document.body.getElementsByClassName('n0');

		if(nav.length) {
			var potential = nav[0];
			
			if(potential.className.indexOf('n0') !== -1) {
				element = potential;
			}
		}
		
		return element ? element: null;
	}
	this.newChat = function() {
		var title = self.title.innerHTML;
		for(var index in self.chatText) {
			var location = title.indexOf(self.chatText[index].value);
			if(self.chatText[index].chars + location == title.length) {
				return true;
			}
		}
		return false;
	}
	this.newMail = function() { return self.searchElement.textContent.match(/\((\d*)\)/); }
	this.getUnreadCountDisplay = function() { return GM_getValue('unreadCountDisplay', true); }
	this.getUnreadCount = function() {
		if(this.newMail()) {
			matches = self.searchElement.textContent.match(/\((\d*)\)/);
			return matches ? matches[1] : false;
		}
	}
	this.getUnreadCountIcon = function() {
		var unread = self.getUnreadCount();		
		if(this.getUnreadCountDisplay()) {
			return self.drawUnreadCount(unread).toDataURL('image/png');
		} else {
			return self.icons.unread;
		}
	}
	
	this.poll = function() {
		self.searchElement = self.getSearchElement();
    
    if(!self.searchElement) {
      // We didn't find the searchElement, try again
      // on the next poll.
      return;
    }
		
		if(self.getChat() && self.newChat()) {
			return self.setIcon(self.icons.chat);
		}
			
		if(self.newMail())
			self.setIcon(self.getUnreadCountIcon());
		else
			self.setIcon(self.icons.read);
	}
	
	this.setIcon = function(icon) {
		var links = self.head.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++)
			if ((links[i].rel == "shortcut icon" || links[i].rel=="icon") &&
			   links[i].href != icon)
				self.head.removeChild(links[i]);
			else if(links[i].href == icon)
				return;

		var newIcon = document.createElement("link");
		newIcon.type = "image/png";
		newIcon.rel = "shortcut icon";
		newIcon.href = icon;
		
		self.head.appendChild(newIcon);
		
    setTimeout(function() {
      var shim = document.createElement('iframe');
      shim.width = shim.height = 0;
      document.body.appendChild(shim);
      shim.src = "icon";
      document.body.removeChild(shim);

      console.log("After setting the icon.");
    }, 499);
  }
	
	this.toString = function() { return '[object GmailFavIconAlerts]'; }
	
	return this.construct();
}
