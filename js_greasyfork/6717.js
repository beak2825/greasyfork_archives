// ==UserScript==
// @name        Gaia - Wishlist Check All
// @namespace   gaiarch_v3
// @description Adds checkboxes to un/check all 'public' and 'delete' checkboxes
// @match     http://*.gaiaonline.com/account/wishlist/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6717/Gaia%20-%20Wishlist%20Check%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/6717/Gaia%20-%20Wishlist%20Check%20All.meta.js
// ==/UserScript==
(function() {
    var container = document.querySelector('#wishlist_drop_target');
  var options = container.insertBefore(document.createElement('div'), container.children[0]);
  options.classList.add('wish_box');
  var publicFval = options.appendChild(document.createElement('div'));
  publicFval.classList.add('fval')
  publicFval.style.marginLeft = '61%';
  var checkPub = publicFval.appendChild(document.createElement('input'));
  checkPub.type = 'checkbox';
  checkPub.addEventListener('click', function(evt) {
    var items = document.querySelectorAll('.wishlist_drag_target');
    Array.prototype.forEach.call(items,function(item) {
      var checkbox = item.children[3].children[0];
      if(this.checked) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    }, this);
  })
  var deleteFval = options.appendChild(document.createElement('div'));
  deleteFval.classList.add('fval')
  var checkDel = deleteFval.appendChild(document.createElement('input'));
  checkDel.type = 'checkbox';
  checkDel.addEventListener('click', function(evt) {
    var items = document.querySelectorAll('.wishlist_drag_target');
    Array.prototype.forEach.call(items, function(item) {
      var checkbox = item.children[4].children[0];
      if(this.checked) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    }, this);
  })
})()