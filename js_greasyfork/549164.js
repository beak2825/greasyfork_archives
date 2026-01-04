// ==UserScript==
// @namespace          runonstof
// @name               Diamond Door
// @version            1.0.2
// @description        Example script of a scripted door that permanently opens for one diamond
// @author             Runonstof
// @license            MIT
// @minecraft          1.20.1
// @match              https://customnpcs.com
// @scripttype         block
// @downloadURL https://update.greasyfork.org/scripts/549164/Diamond%20Door.user.js
// @updateURL https://update.greasyfork.org/scripts/549164/Diamond%20Door.meta.js
// ==/UserScript==

function init(e) {
  e.block.setBlockModel('minecraft:mangrove_door');
}
function interact(e) {
  e.setCanceled(true);
  if (e.block.getOpen()) {
    return;
  }
  var item = e.player.mainhandItem;
  if (item.name !== 'minecraft:diamond') {
    e.player.message('§cYou need a diamond to open this door!');
    return;
  }
  item.setStackSize(item.stackSize - 1);
  e.block.setOpen(true);
}

