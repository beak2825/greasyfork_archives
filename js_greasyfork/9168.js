// ==UserScript==
// @name        Library for translating AO3 interface
// @description:en library for scripts
// @namespace   cz.sipral.ao3.translate.library
// @version     0.0.0.2
// @grant       none
// ==/UserScript==

// TODO BUG: in my work "edit tags" isn't button anymore

//<--process DropdownMenu Titles -->
function processDropDowns(tr_table) {
  var dropdowns = document.getElementsByClassName('dropdown');
  for (var i = 0; i < dropdowns.length; i++) {
    var anchors = dropdowns[i].getElementsByTagName('a');
    for (var j = 0; j < anchors.length; j++) {
      anchors[j].textContent = tr_table.translate(anchors[j].textContent);
    }
  }
}
//<--process Warnings-->

function processArchiveWarnings(tr_table) {
  var nodes = document.querySelectorAll('span.warnings');
  for (var i = 0; i < nodes.length; i++) {
    var title_node = nodes[i].getAttributeNode('title');
    title_node.textContent = tr_table.translate(title_node.textContent);
    var texts = nodes[i].getElementsByClassName('text');
    for (var j=0; j<texts.length; j++) {
    	var node = texts[j];
    	node.textContent = tr_table.translate(node.textContent);
    }
  }
  var tag_s = document.getElementsByClassName('tag');
  for (var i = 0; i < tag_s.length; i++) {
    var node = tag_s[i];
    node.textContent = tr_table.translate(node.textContent);
  }
  //filters subnav

  var category_warning = document.getElementById('tag_category_warning');
  var labels = category_warning.getElementsByTagName('label');
  for (var i = 0; i < labels.length; i++) {
    var node = labels[i];
    node.textContent = tr_table.translate(node.textContent);
  }
}

//<--process blurb -->
function processBlurb(tr_table) {
  var nodes= document.getElementsByClassName('work meta group');
  for (var i = 0; i < nodes.length; i++) {
    var dts = nodes[i].getElementsByTagName('dt');
    for(var j=0;j<dts.length;j++) {
      var dt = dts[j];
      dt.textContent = tr_table.translate(dt.textContent);
    }
  }
}
//TODO add index blurb

//<--OBJECT DATA DEFINITION -->

function tranTable(obj)
{
  this.length = 0;
  this.items = {
  };
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      this.items[p] = obj[p];
      this.length++;
    }
  }
  this.hasItem = function (key)
  {
    return this.items.hasOwnProperty(key);
  };
  this.getItem = function (key) {
    return this.hasItem(key) ? this.items[key] : undefined;
  };
  this.translate = function (text)
  {
    for (var key in this.items)
    {
      if (text.search(key) > - 1) {
        text = text.replace(new RegExp(key, 'gi'), this.items[key]);
      }
    }
    return text;
  };
}