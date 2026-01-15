// ==UserScript==
// @name        Improved zD Navigation and Icons (Mixed Profile Theme Compatibility)
// @namespace   AbacasOnline
// @match       *://zdiskuss.com/*
// @grant       none
// @version     2.0
// @author      Maura George (Abacas)
// @description A major improvement to the zDiskuss.com navigation element, including re-structuring top level items and dropdowns, thought out iconography, and a focus on accentuating the existing style for the default theme.
// @downloadURL https://update.greasyfork.org/scripts/562487/Improved%20zD%20Navigation%20and%20Icons%20%28Mixed%20Profile%20Theme%20Compatibility%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562487/Improved%20zD%20Navigation%20and%20Icons%20%28Mixed%20Profile%20Theme%20Compatibility%29.meta.js
// ==/UserScript==

var friendslinkx = "//a[contains(text(),'FRIENDS')]";
var usernamex = "//a[contains(text(),'MY PROFILE')]";

var friendslink = document.evaluate(friendslinkx, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.getAttribute('href');
var username = document.evaluate(usernamex, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.getAttribute('href');
var ReportButton = document.querySelector('.profile-actions-row > .delete-button');

if (ReportButton){
  ReportButton.insertAdjacentHTML('afterbegin', '<span class="icons flag"></span>');
}

document.querySelector(".top-nav").innerHTML = '<div class="nav-bar-inner" id="new-nav-inner"></div>';

var navmock = document.getElementById('new-nav-inner');
document.querySelector('head').insertAdjacentHTML('beforeend', `<style>
  /* Changes existing styling to this in the main CSS file to make the old sole navigation class into the navigation element container: */

  .top-nav {
    padding:0;
    text-align:left;
  }

  .nav-bar-inner {
    position:relative;
    padding:0 10px;
    height:24px;
  }

  .nav-bar-inner .pull-right {
    position:absolute;
    right:10px;
  }

  /* Top level interaction styling */

  .nav-bar-inner .nav-item .selection {
    line-height:24px;
    display:inline-block;
    color:#4A5B4E;
    font-weight:bold;
    padding:0 10px;
    text-transform:uppercase;
    cursor:pointer;
    user-select:none;
  }

  .no-transform {
    text-transform:none!important;
  }

  .nav-bar-inner .nav-item .selection:hover {
    text-decoration:none;
    background:#8A9488;
    color:#E4E9E0;
    box-shadow:#fff4 1px 1px 0 inset;
  }

  .nav-bar-inner .nav-item .selection:active,
  .nav-bar-inner .nav-item .selection:focus,
  .nav-bar-inner .nav-item .selection.selected,
  .dropdown:has(*:focus) .selection {
    background:#7A8478 ;
    box-shadow:#0004 1px 1px 0 inset;
    text-shadow:#0004 0 1px 0;
    color:#E4E9E0;
    text-decoration:none;
  }

  /* Navigation element dropdown styling */

  .selection.dropbtn {
    padding:0 20px 0 10px!important;
    position:relative;
  }

  .dropdown {
    position:relative;
  }

  .dropbtn:after {
    display:block;
    content:"";
    border-bottom:6px solid #5f6f58;
    border-left:4px solid transparent;
    border-right:4px solid transparent;
    border-radius:1px;
    position:absolute;
    top:9px;
    right:9px;
  }

  .dropbtn:hover:after {
    border-bottom-color:#ddE1d8;

  }

  .dropbtn:focus:after,
  .dropdown:has(*:focus) .dropbtn:after {
    border-bottom:none;
    border-top:6px solid #ddE1d8;
    filter:drop-shadow(0 1px 0 #4A5B4E);
  }

  .dropbtn:focus,
  .dropdown:has(*:focus) .dropbtn {
    z-index:10;
    background:#7A8478 !important;
    box-shadow:#4A5B4E 1px 1px 0 inset!important;
    text-shadow:#4A5B4E 0 1px 0;
    color:#E4E9E0!important;
  }

  .dropdown .dropcontent {
    display:none;
    position:absolute;
    left:0;
    border-radius:0 0 4px 4px;
    min-width:200px;
    padding:10px 0;
    background:#7A8478;
    box-shadow:#4A5B4E 1px 0 0 inset, #4A5B4Edd 1px 1px 0;
    z-index:0;
    transition:0s;
    transition-delay:0.3s;
  }

  .dropdown:has(.dropbtn:focus) .dropcontent,
  .dropdown .dropcontent:hover {
    display:block;
  }

  .dropcontent a {
    display:block;
    padding:0 10px;
    line-height:24px;
    color:#dfe8d8;
    border-right:0;
  }

  .dropcontent a:hover {
    background:#337ab7;
    box-shadow:#0004 0 1px 0, #fff2 1px 1px 0 inset;
    color:#fff;
    text-decoration:none;
  }

  .dropcontent a:active {
    background:#115895;
    box-shadow:#0004 1px 1px 0 inset;
    text-shadow:#0003 0 1px 0;
    text-decoration:none;
  }

  .pull-right .dropcontent {
    left:auto;
    right:0;
  }

  .dropdown:has(*:focus) .dropcontent {
    display:block;
    transition:0s;
  }

  .dropdown-search input[type=text] {
    width:100px;
  }

  .dropdown-search input[type=submit] {
    line-height:16px;
    right:-2px;
  }

  .dropdown-search {
    padding:0 10px;
    margin-bottom:8px;
    background:none!important;
    border:none!important;
    box-shadow:none!important;
  }

  /* New genaric styling to help with removing element level assigned 'style' attributes. */

  .top-nav .special {
    color:#1e3!important;
  }

  .icons {
	  min-width:16px;
	  max-width:16px;
	  height:16px;
    display:inline-block;
  }

  .icons.alien, .alien-icon {
    background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAwBQTFRFAAAALDUgW1tbdolyoLya1fe76urq////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6AHofQAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABlSURBVChTZY8LDsAgCENlfrj/id0rojMZica+tIBlUqbSgyrSvddaEwHQ1CYHiGRkOXYfOZoSNtxlETA80gnMfVjn9pgTDgc8S689yHDOlOjaaHtviucC2pXQ95c/CHL9Ngalni9gSn4e60GupwAAAABJRU5ErkJggg==);
  }

  .icons.house {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAALDUgRlQzk62OoLya1fe7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF7E5NQAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABoSURBVChTXY8JDoAwCATZAv9/sg6HxkiawA5XsWtM2sBWZwoIHaCMSAk4AC15yBcoXc6DdkXriCYFSq8Vsc4rMRzESNKfB0mXVDMIUqfBO5R//MG0TEXN6LUPOIdVKPxUfOw5bk8vdwPqI1g3GS3fSwAAAABJRU5ErkJggg==);
  }

  .icons.profile {
	  background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAwBQTFRFAAAALDUgRElDYGhfeoR49Pjx////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9XCecwAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABWSURBVChTZY8BDsAgCAPtLPz/xxtIIUtsTJTLgbreCqDDUu0mInAb0VRuGacoEgC/JAB9QiRwt46AAbEI2gBKaRDlEca4Z+yNHYOoFk6evPZ6mL7d2wd61W1zkL1JDgAAAABJRU5ErkJggg==);
  }

  .icons.profile-edit {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAAPdJREFUOE9jYMADdEwV/oMwupIH1ZswxDCMAWkEgS8/PqIYcvv27f9Hwib9J9oQZBeANO87suk/zBCQQTg9gKwRxF4fxQDXDDNEV1e3AqsB6P4Gaf6/mwHFEAzNsABDp2Ga/z+bBjdEx1AN1ekgTVUtFeBAQwbYNM+ZMwesFsWVsBCHhToo5LFpnjZjCjhWcBoAizKwZpCT0ZwN0kiUAf9Ph8ANABkGsxmkmaAB318f/e8f4v4fZAhIc2h0CNi/MNsJGgDSvHlZE9hWdJuJcgEoijx83P8nZMSDbYbRIDbMdpyBCJIgBrt4OmNmMlwJCZc4vlxMkhwAVH2pq0+E7jEAAAAASUVORK5CYII=);
  }

  /*Suggestion: Use this icon for 'block' on profiles.*/
  .icons.halt {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAAJJJREFUOE9jYKAV2KMq9R8ZE20PTNMrF4v/yBgmjtcgkCJ0jej8Tmnh/1gNIUYzzDCshlBkALpmkA3YMLJ3UFyBbABIAhv48uMjOFawegObASAN6JgoA0A2oKcBbFGLHpANZARiA0p0kmEARnIgyhVQp6PajmRUAyz6sKVAQpph5oBMhxsEMxAkBsVE5yuYBrwaAcBXXyTcvpotAAAAAElFTkSuQmCC);
  }

  .icons.add {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAwBQTFRFAAAAQ7IAQ8IAQ9UAcdUAcf8A09PT////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqJfqPQAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAANdMAADXTAQwhQ3cAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABnSURBVChTXdDbDsAgCAPQFZj8/xdvbdktIz7YY2OM2/GbbXJmxuwMmTsnTAJFm4Tg3I2RB9YDLPDKXkhSsJHqdy8uGKJ4PIMaKAA8BsogUYmR+Qaof4Mr6qswTw9RvU83Tbwa3x84AWOebcrxzac5AAAAAElFTkSuQmCC);
  }

  .icons.mail-with-new {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAALpJREFUOE9jYKAXcL7K0ADE/50PgXEDSfaCNP/8//0/CBf+J8MQkM0wzSADCqEugbtCx1ThPz4McjZYI1QzVgO+/Pj4HxdY8KAe7HeQRphm82r+/xguIMYQkEEgzSAXoxhw6MgBsCA+Q0ByIDUwtSgGgJyPzxBkzTgNwGUITDPMdTgNQHciiI8uBtKM1QCYICwmYHyYn2HiOMMAFoAwW0E0zDZkMZiLsMYCTAMxNIYBhFIjNnmSMhQuxQC068zj6ecWuQAAAABJRU5ErkJggg==);
  }

  .icons.upload {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAALDUgk62OoLya1fe7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZdE87wAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABcSURBVChTdY8BDsAgCAMt8v8vu7ZAspnMRMGjFlznWusPAF1pBXI3KcD7bmLge4Q1BYAMHgUcBBzPgt82QIAK1WAHpfRAKtdWItMZynG6sMd0sSUHueb4Kt4/fgDWwaXzAnP+pAAAAABJRU5ErkJggg==);
  }

  .icons.audio {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAALDUgk62OoLya1fe7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZdE87wAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAANdAAADXQAaGYYhoAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABUSURBVChTZY9bFgAhCEJD2f+Wy0dHnckvuCcx1v7NGh4w0wBgAfiQ0oBCqg4gaiMDuAW0V9Qy9gyN/Bd8VuwBKjQkWGdTIr1//cpokl2uzJqzbYADuLihEh3Mhf0AAAAASUVORK5CYII=);
  }

  .icons.write {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAAT1RHr1oAxFaSznGk4Huy/5kA/78A/9Iw/8tUlJmLvsSy/+aW29vb9+vFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKTr1sgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABaSURBVChTVc9REoAgCEVRJDMjbP+7RdKMF3/3jDAjGU7ejbCvnDcEaS4AzNIEVrgWFgvgehT2g2tl9YKvX4ieAD0A+4Fbddyf46Cq0Q7+4IQPkSVMX0m//5t1C5698jegZj0AAAAASUVORK5CYII=);
  }

  .icons.art {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAALTxMYykAfzUAQy1MNGP/Nmz/OHL/QJL/RKL/pUUAsHfG/2jZgKMf/6oA/59jlpaWmcj//6rRwcHB////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVbeSjgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAANdEAADXRAXPfgP4AAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABrSURBVChThc9BEoMgEERRUDRRGAdo7n9V7MRJhTKL/BX9igW4fsv9wjw2ddfn6dt+wbIW1VpVi8GjaKosqQF3fEMyeBbfAiF+YPNoLRxUu+GRAXigGXALsghgkIWLmOWCfegFw0N5JPz77QmeBF2TVhMz0wAAAABJRU5ErkJggg==);
  }

  .icons.document {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAALDUgcn9rvtumx+Wu1fe73/TN9PjxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCUhewAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAANdAAADXQAaGYYhoAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABfSURBVChTdY5bEsAgCMTcLeL9T2wXLPYx03xGA7Q5WcygSYyEg1uAYKcdqB8E3OlpMvEwCEq46GZWIh/R+xZOTdXcW0QS0SPRWHwSNX8JBnLk3qJ9gc64knXFIi99cwJRdFPrkhnwmgAAAABJRU5ErkJggg==);
  }

  /*Suggestion: Flag icon for reporting art or users buttons:*/
  .icons.flag {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAARVJREFUOE9jZACC/ol9/0G0XFURiGII/srACGYggbXcDGA1WOVBBoAASNErFwswDVMMYsPEQXLo8mB1IAN+//8JV7hdRgTMBmEQG6YRRu9RlUKxBGzAp0+fUAyYJiv6H4bRDSHJAKJdcPXGFYIuALkUhpHDCewFXAbAXAAL6D9/f/+/ceca2CB4JCEbAAs49DBANuDQsYPYDYCZCjIEZgAsNpANWL5qGX4DQE6DaYQ5E9mA6TOngQxowPACir/QUiLMgC8/PoJtj42PMSPJgOCQoP8gzSAMYqOYDwtEfC4A5wGgRgzNIImKqvL/a9ev+Q+i0TMRehjAvICiDmQqyHaspsNyIFQNVnUmpiZgzSAalwtweQEAIO6KBOWHrgsAAAAASUVORK5CYII=);
  }

  /*Suggestion: for buttons that remove things you've created.*/
  .icons.trash {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAwBQTFRFAAAAUVFRf39/oKCgzs7OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnNjSUgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABgSURBVChTfY9RDoAwCENH4f5X1kdRw5dlIesbjHAuK9DcztiqykEALBHZqQGvGQpOZoWBMjEcqUG3gGzd4hFCM8jApvMLinKJvz+AIVaFyrEr/gFjusEds5yXfdYdsHQDHp5s0k8p2xMAAAAASUVORK5CYII=);
  }

  .icons.chatter {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAAFRkPJi0bLDUgQEwucn9rh5x2jZuCm52ZnLGMo7qSsrutx+Wu1fe73/TN9PjxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbHYxQAAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAANdAAADXQAaGYYhoAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABySURBVChTXY8BDgMhCASpFL27Cv3/a+kCR5t0NDGZsK6SS8PsgORlge59piF5j0R1tzCRgVWCMZGRCEFICMxLZCAoRUawIebzL7JKKN+sEsrHI5lmKZjqmiGmIdi5m0u4f5tT4Pm/5hb1P3DVhHctTv8AQPUiSOMLeKcAAAAASUVORK5CYII=);
  }

  .icons.explore {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAwBQTFRFAAAABgcFExYRNz8wTltCcn9rAGS3M3q3pM/y1fe7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZmPXnQAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABlSURBVChTXY9ZEoAwCENB0Nb7HxgTlhk1P48lRCsRCgVUlFC//UQFGiis2A/TgQ00DnVzOyAgT7hxozrjfeLlMFqHOfhnWGek8/tZZjCTq6Hwl/IRXeBkr2txUORbNvshBjCzbz5m9UIWOxn71gAAAABJRU5ErkJggg==);
  }

  .icons.people {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAA10QAANdEBc9+A/gAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAARJJREFUOE9jYKAmEJHgO6BjqvAfGYPEiLIDprlhau7/q993g3FqRQzYMKIMASmEaV6wZ9Z/GI7KCgQbwsHFBncZVheBFIFsBWmE0ZPX9v0HYZDmjMq4/4v39P+PzAoCG4RhCLIBIENgmmEGJBTGgsXKOovABmI1AORndM0gL4A0gAwAacZpACwQQRpgtsM0S8kL/w9NCQZrDknxxe4FkJNAhoBsQ8Ywg2FiWP1PVDwTUgQ0+QN6IkLmC4vxIiewDyjmgTQjJyBYQoLRHiEuYG/FZAWAo9ja3RBkGMIQ9ChETkigAO1c0Aw2IDjJHxyQeU1ZqFGJbAAsBkCakDHIAN9oT7BmrAbA/IseC/j4hMKVKHkAUkIyUemsuLMAAAAASUVORK5CYII=);
  }

  .icons.user {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAA10QAANdEBc9+A/gAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAAMhJREFUOE9jZMACdEwVGoDC9WhSjVdOPwCJ4wdAzf9B+Or33WC8YM+s/5PX9oHFQBivbpDNMM0gjcgYZIiwGC8I43YFsmaY7TBDQAaUdRaBDcHpCny2E20ANqeDNBNtAEghsrORNRPjhQaQH0EKYRphNsM04w1EUOBAQxpsCDKGiRNKBmB5UHTCNCDRhBMRUabjUwRLSLBUh4PG7hLkVAhLxsg0LEnjTI24EhFMI3KsYE2NIEFkxeixgB4jGEGBJdRhmQcrDTMAAFgoNnjeYL9aAAAAAElFTkSuQmCC);
  }

  .icons.exit {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAALDUgiRsTvCUa6kQ4k62OoLya1fe7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3BrBEgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My4zNqnn4iUAAABgSURBVChTXY9JAsAgCANl9f8vtgkubc0FGIRgG5faGLJVLYIOZU95QVJxgbhAYNFnJHZ/LWVb4HZcZirOULZI+MYNyQLikBnIAapqphPwRo4o6gIwqaWsC5Qp47L9//8Bc/uC7ZnLbLoAAAAASUVORK5CYII=);
  }

  .icons.star, .favorite-star.favorited {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAABGdBTUEAALGPC/xhBQAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAAPxJREFUSEu9lMENwjAMRXtmCgZA3DgxAXduLMECSCyHEJswAAKJS+BX/OgrTWKTFipZRa3/s/Pt0nW/vhareWiuAfFmuw7NkFEAitHBO45mF0jQ+Ajj+QnRnOhNUq0/NyI1DxC+G3hDiMfxW7jmjfVAimJWrkFMMSCTAlCRAbjZgU6DyXymsNyEegt089LF4fyrXTCpNkpPjmcV/piz33Xt/wcQP+/n0AwZBaD4cVqGy2FmdwGBBlqHmEGI5sRRsBpEDBXzN98BNugKkJwo96x4JA/E9KMGMcUwRd1P2/8aQLNwd42T1dVljk1hxc3UzUuTFFQFWHtP0GTf8wtmQ7tgbadh7gAAAABJRU5ErkJggg==);
    background-position:0 -16px;
  }

  .icons.star.empty, .favorite-star {
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAABGdBTUEAALGPC/xhBQAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAAPxJREFUSEu9lMENwjAMRXtmCgZA3DgxAXduLMECSCyHEJswAAKJS+BX/OgrTWKTFipZRa3/s/Pt0nW/vhareWiuAfFmuw7NkFEAitHBO45mF0jQ+Ajj+QnRnOhNUq0/NyI1DxC+G3hDiMfxW7jmjfVAimJWrkFMMSCTAlCRAbjZgU6DyXymsNyEegt089LF4fyrXTCpNkpPjmcV/piz33Xt/wcQP+/n0AwZBaD4cVqGy2FmdwGBBlqHmEGI5sRRsBpEDBXzN98BNugKkJwo96x4JA/E9KMGMcUwRd1P2/8aQLNwd42T1dVljk1hxc3UzUuTFFQFWHtP0GTf8wtmQ7tgbadh7gAAAABJRU5ErkJggg==);
    background-position:0 0;
  }

  .top-nav .selection.with-icon {
	  padding:0 10px 0 28px;
	  position:relative;
  }

  .top-nav .selection .icons,
  .top-nav .dropcontent a.with-icon .icons {
	  position:absolute;
	  top:4px;
	  left:8px;
  }

  /* Classes for element icon positioning if the elements have icons. */

  .top-nav .dropcontent a.with-icon {
	  position:relative;
	  padding:0 10px 0 28px;
  }

  .top-nav .selection.dropbtn.with-icon {
	  padding:0 20px 0 28px!important;
  }

  .delete-button .icons,
  .alien-button .icons {
    width: 16px;
    height: 16px;
    position:relative;
    top:-2px;
    margin-right:8px;
    margin-bottom:-7px;
  }

  .delete-button:has(.icons),
  .alien-button:has(.icons) {
    position:relative;
    top:1px;
  }

  /*fixes alignment for profile actions row:*/

  .profile-actions-row > form {
    position:relative;
    top:1px;
  }

  /* Styling to force the elements that themes currently style only partially in this layout to be consistent for now to the best of my ability: (Can be removed once themes are updated.) */

  .top-nav {
    color: #111111!important;
    font-family: Verdana, Helvetica, sans-serif!important;
    font-size: 10px!important;
    background: #E4E9E0!important;
    padding: 0 0!important;
    margin-bottom: 8px!important;
    position: relative!important;
    z-index: 10!important;
    border-top: 1px solid #F4F8F1!important;
    border-left: 1px solid #F4F8F1!important;
    border-bottom: 1px solid #7A8478!important;
    border-right: 1px solid #7A8478!important;
  }

  .top-nav a {
    font-size: 10px!important;
    font-weight:bold!important;
    text-transform:uppercase!important;
    text-shadow:none;
  }

  .top-nav a.selection {
    line-height:24px!important;
    display:inline-block!important;
    color:#4A5B4E!important;
    font-weight:bold!important;
    cursor:pointer!important;
    user-select:none!important;
    margin:0 0!important;
    border:none!important;
  }

  .top-nav a.selection:hover,
  .top-nav a.selection:focus,
  .dropcontents a {
    color:#E4E9E0!important;
  }

  .dropcontent a:hover,
  .dropcontent a:active {
    color:#fff!important;
  }
</style>`);

//Populate New Navigation Top Level Items:

navmock.insertAdjacentHTML('beforeend', '<span class="nav-item"><a tabIndex="1" class="selection with-icon" href="https://zdiskuss.com/index.php"><span class="icons house"></span>Index</a></span>');
navmock.insertAdjacentHTML('beforeend', '<span class="nav-item dropdown"><span tabIndex="2" class="selection dropbtn with-icon"><span class="icons explore"></span>Explore</span><div id="explore-dropdown" class="dropcontent"></div></span>');
navmock.insertAdjacentHTML('beforeend', '<span class="nav-item"><a tabIndex="5" class="selection with-icon" href="https://zdiskuss.com/zdchat.php"><span class="icons chatter"></span>zDchat</a></span>');
navmock.insertAdjacentHTML('beforeend', '<span class="nav-item"><a tabIndex="6" class="selection with-icon" href="https://zdiskuss.com/shop.php"><span class="icons alien"></span>Shop</a></span>');

navmock.insertAdjacentHTML('beforeend', '<span class="pull-right" id="navmockright"></span>');
var navmockright = document.getElementById('navmockright');

//Define Top Level Dropdowns:

navmockright.insertAdjacentHTML('beforeend', '<span class="nav-item dropdown"><span tabIndex="7" class="selection dropbtn with-icon"><span class="icons add"></span>Submit</span><div id="submission-dropdown" class="dropcontent"></div></span>');
navmockright.insertAdjacentHTML('beforeend', '<span class="nav-item dropdown"><span tabIndex="8" class="selection dropbtn no-transform with-icon"><span class="icons user"></span>' + username + '</span><div id="account-dropdown" class="dropcontent"></div></span>');
navmockright.insertAdjacentHTML('beforeend', '<span class="nav-item"><a tabIndex="9" class="selection with-icon" href="https://zdiskuss.com/logout.php"><span class="icons exit"></span>Log Out</a></span>');

//Populate Top Level Dropdowns' Contents:

var exploredd = document.getElementById('explore-dropdown');
exploredd.insertAdjacentHTML('beforeend', '<form action="https://zdiskuss.com/search.php" method="get" class="dropdown-search form-container"><input name="type" value="art" hidden><input type="text" name="q"><input class="delete-button" type="submit" value="Search Art"></form>');
//The commented out addition below is for if they add a 'Today's most favorited' page. I will simply add the URL to that page in place of the hash symbol and remove the comment indicator.
//exploredd.insertAdjacentHTML('beforeend', '<a href="#" class="with-icon"><span class="icons star"></span>Today\'s Most Favorited</a>');
exploredd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/browse.php" class="with-icon"><span class="icons art"></span>Browse Art Gallery</a>');
exploredd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/browse.php?type=music&category=0" class="with-icon"><span class="icons audio"></span>Browse Music</a>');
exploredd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/browse.php?type=blog&category=0" class="with-icon"><span class="icons document"></span>Browse Blog Posts</a>');
exploredd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/groups.php" class="with-icon"><span class="icons people"></span>Browse Artist Groups</a>');

var submitdd = document.getElementById('submission-dropdown');
submitdd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/upload_art.php" class="with-icon"><span class="icons upload"></span>Graphical Art</a>');
submitdd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/upload_music.php" class="with-icon"><span class="icons audio"></span>Audio and Music</a>');
submitdd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/blog.php?action=create" class="with-icon"><span class="icons write"></span>Write a New Blog Post</a>');

var accountdd = document.getElementById('account-dropdown');
accountdd.insertAdjacentHTML('beforeend', '<a href="' + username + '" class="with-icon"><span class="icons profile"></span>My Profile</a></span>');
accountdd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/profile_edit.php" class="with-icon"><span class="icons profile-edit"></span>Edit Profile</a></span>');
accountdd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/profile_edit.php#content_filters" class="with-icon"><span class="icons halt"></span>Content Filters</a></span>');
accountdd.insertAdjacentHTML('beforeend', '<a href="https://zdiskuss.com/mail.php" class="with-icon"><span class="icons mail-with-new"></span>Mailbox and Alerts</a></span>');
accountdd.insertAdjacentHTML('beforeend', '<a href="' + friendslink + '" class="with-icon"><span class="icons people"></span>My Friends</a></span>');
accountdd.insertAdjacentHTML('beforeend', '<a class="special with-icon" href="https://zdiskuss.com/donate.php"><span class="icons add"></span>Support zDiskuss!</a>');

