// ==UserScript==
// @name The West OpenChat
// @namespace TomRobert
// @author Tom Robert
// @description Open Chat with key and dialog
// @include https://*.the-west.*/game.php*
// @version 1.01
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/7277/The%20West%20OpenChat.user.js
// @updateURL https://update.greasyfork.org/scripts/7277/The%20West%20OpenChat.meta.js
// ==/UserScript==
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
var val = setInterval(function () {
    if (window.Chat && Chat.ResponseHandler && window.HotkeyManager) {
      clearInterval(val);
      EventHandler.listen("chat_ally_received", function (r) {
        var chat = r.to,
        rooms = {
          town: 'Stadt',
          alliance: 'Allianz'
        },
        room = rooms[chat.split('_')[1]];
        if (room && !ChatWindow.Tabs.isOpen(chat)) {
          new west.gui.Dialog("Chatnachricht erhalten", "Neue Nachricht im " + room + "-Chat. Willst du den Chat öffnen?").addButton('ok', function () {
            ChatWindow.open(Chat.Resource.Manager.getRoom(chat));
          }).addButton('cancel').show();
          AudioController.play(AudioController.SOUND_NEWMSG);
        }
      });
      fu = window.fu || Chat.ResponseHandler;
      Chat.ResponseHandler = function (r) {
        fu.apply(this, arguments);
        if (r.id == 'Text') {
          EventHandler.signal("chat_ally_received", r.payload);
        }
      };
      HotkeyManager.register(new Hotkey("townChat", "1", "Stadt-Chat öffnen", function () {
          var a = Chat.Resource.Manager.getRooms();
          for (var b in a)
            if (b.includes('town')) {
              if (!ChatWindow.Tabs.isOpen(b))
                ChatWindow.open(a[b]);
              break;
            }
        }));
      HotkeyManager.register(new Hotkey("allyChat", "2", "Allianz-Chat öffnen", function () {
          var a = Chat.Resource.Manager.getRooms();
          for (var b in a)
            if (b.includes('alliance')) {
              if (!ChatWindow.Tabs.isOpen(b))
                ChatWindow.open(a[b]);
              break;
            }
        }));
    }
  }, 2000);
});