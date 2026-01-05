// ==UserScript==
// @name The West - Market best bids
// @namespace TomRobert
// @author Esperiano (updated by Tom Robert)
// @description Market utility for highlighting the best bids!
// @include https://*.the-west.*/game.php*
// @version 0.4.8
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7391/The%20West%20-%20Market%20best%20bids.user.js
// @updateURL https://update.greasyfork.org/scripts/7391/The%20West%20-%20Market%20best%20bids.meta.js
// ==/UserScript==
TWMBB_inject = function () {
  var twmbbjs = document.createElement('script');
  twmbbjs.setAttribute('type', 'text/javascript');
  twmbbjs.setAttribute('language', 'javascript');
  twmbbjs.innerHTML = '(' + (function () {
      MBB = {
        version: '0.4.8',
        name: 'Market best bids',
        author: 'Esperiano (updated by Tom Robert)',
        minGame: '2.05',
        maxGame: Game.version.toString(),
        website: 'https://greasyfork.org/scripts/7391',
        items: {},
        lang: localStorage.getItem('scriptsLang') || Game.locale.substr(0, 2),
      };
      var fmfb = function (l) {
        return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
      },
      twmbbApi = TheWestApi.register('MBB', MBB.name, MBB.minGame, MBB.maxGame, MBB.author, MBB.website);
      twmbbApi.setGui('<br>Market utility for highlighting the best bids.<br><br><span style="color:green;">Green</span> – Bid is lower than the purchase price.<br>Black -  Bid is equal to the purchase price.<br><span style="color:blue;">Blue</span> – Bid is between 100% and 200% of the purchase price.<br><span style="color:red;">Red</span> – Bid is more than 200% of the purchase price.<br><br>The sold item will always have the color of the lowest bid!<br><br><i>' + MBB.name + ' v' + MBB.version +
        '</i><br><br><br><b>Contact:</b><ul style="margin-left:15px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
        '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
        '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
        '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
        '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
        '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
        '<a target=\'_blanck\' href="https://forum.beta.the-west.net//index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="../images/chat/emoticons/smile.png"></li></ul>');
      if (localStorage.getItem('mbb_items') || localStorage.getItem('mbb_0')) {
        for (var k in localStorage)
          if (typeof k === 'string' && k.indexOf('mbb_') === 0)
            localStorage.removeItem(k);
      }
      var allItems = ItemManager.getAll();
      for (var i in allItems) {
        var item = allItems[i];
        if (!item.auctionable)
          continue;
        var name = item.name;
        if (item.type == 'recipe') {
          name = name.split(':');
          if (name.length == 2)
            name = name[1];
        }
        MBB.items[name] = item.price;
      }
      MarketWindow.open_mbb = MarketWindow.open;
      MarketWindow.open = function () {
        MarketWindow.open_mbb.apply(this, arguments);
        $('div.tw2gui_win2.marketplace').on('DOMNodeInserted', function (e) {
          var el = $(e.target);
          if (el.is('div[class*="marketOffersData_"]') || el.is('div[class*="marketWatchData_"]') || el.is('div[class*="marketSellsData_"]') || el.is('div[class*="marketWhatIsHotData_"]')) {
            var child = el.children(),
            name_original = child[1],
            qty = child[2].textContent,
            purchase_original = child[3],
            bid_original = child[4],
            price_original = MBB.items[name_original.textContent];
            if (purchase_original.textContent) {
              var purchase = purchase_original.textContent.replace(/\$|\.|\,/g, '');
              var price_purchase = purchase / qty;
              if (price_purchase < price_original) {
                purchase_original.style.color = 'green';
                if (!bid_original.textContent) {
                  name_original.style.color = 'green';
                }
              }
              if ((price_purchase > price_original) && (price_purchase <= price_original * 2)) {
                purchase_original.style.color = 'blue';
                if (!bid_original.textContent) {
                  name_original.style.color = 'blue';
                }
              }
              if (price_purchase > price_original * 2) {
                purchase_original.style.color = 'red';
                if (!bid_original.textContent) {
                  name_original.style.color = 'red';
                }
              }
            }
            if (bid_original.textContent) {
              var bid = bid_original.textContent.replace(/\$|\.|\,/g, '');
              var price_bid = bid / qty;
              if (price_bid < price_original) {
                bid_original.style.color = 'green';
                name_original.style.color = 'green';
              }
              if ((price_bid > price_original) && (price_bid <= price_original * 2)) {
                bid_original.style.color = 'blue';
                name_original.style.color = 'blue';
              }
              if (price_bid > price_original * 2) {
                name_original.style.color = 'red';
                bid_original.style.color = 'red';
              }
            }
          }
        });
      };
    }).toString() + ')();';
  document.body.appendChild(twmbbjs);
};
if (location.href.indexOf('.the-west.') !=  - 1 && location.href.indexOf('game.php') !=  - 1)
  setTimeout(TWMBB_inject, 2500, false);
