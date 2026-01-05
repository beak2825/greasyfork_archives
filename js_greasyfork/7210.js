// ==UserScript==
// @name          Color Empornium Highest Seeds
// @description   Color codes torrents with highest seeds
// @version       2.2.1
// @author        Monkeys
// @namespace     empornium.me
// @match         *.empornium.is/torrents.php*
// @match         *.empornium.me/torrents.php*
// @match         *.empornium.sx/torrents.php*
// @homepage      https://greasyfork.org/en/scripts/7210-color-empornium-highest-seeds
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/7210/Color%20Empornium%20Highest%20Seeds.user.js
// @updateURL https://update.greasyfork.org/scripts/7210/Color%20Empornium%20Highest%20Seeds.meta.js
// ==/UserScript==

(function(){

  // *** BEGIN USER ADJUSTABLE VARIABLES *** //
  var MODE = 5; //which to use to colorize: 1-seeds, 2-peers, 3-snatched, 4-ratio, 5-peers+seeds
  var COLORADJUST = 2; //which color to use: 1-red, 2-green, 3-blue
  var LOWEST = 1; //lowest color is: 0-black, 1-white
  // *** END USER ADJUSTABLE VARIABLES *** //

  //each torrent is a table row:
  //<tr class="torrent">
  var torrents = document.getElementsByClassName('torrent');
  var thislink, links, thisdata;
  var numtorrents = torrents.length;
  var snatchedi, seedsi, peersi;

  var seeds=[];
  var peers=[];
  var seedsPeers=[];
  var snatched=[];
  var ratio=[];

  var hiseeds=0;
  var hipeers=0;
  var hiseedsPeers=0;
  var hisnatched=0;
  var hiratio=0;
  var lowseeds=Infinity; //Should I just set this to first torrent
  var lowpeers=Infinity;
  var lowseedsPeers=Infinity;
  var lowsnatched=Infinity;
  var lowratio=Infinity;
  var MAXCOLORS=255;

  function getSuperlatives(arr)
  {//return highest and lowest, as well as 2nd highest, lowest
    var largest = -Infinity;
    var nextLargest = -Infinity;
    var smallest = Infinity;
    var nextSmallest = Infinity;
    for (var ii = 0; ii < arr.length; ii++)
    {
      var num = arr[ii]; //conver to number
      if (num > largest) {
        nextLargest = largest;
        largest = num;
      } else if (num < largest && num > nextLargest) {
        nextLargest = num;
      }
      if (num < smallest) {
        nextSmallest = smallest;
        smallest = num;
      } else if (num > smallest && num < nextSmallest) {
        nextSmallest = num;
      }
    }
    //console.log("smallest: ",smallest,", largest: ",largest);
    return {smallest: smallest, nextSmallest: nextSmallest, nextLargest: nextLargest, largest: largest};
  }
  for (var i = 0; i < numtorrents; i++)
  {//first pass, collect data
    seeds[i]=0;
    peers[i]=0;
    snatched[i]=0;
    ratio[i]=1;

    links = torrents[i].getElementsByTagName('td'); //grab links in this torrent
    //console.log("\nTorrent #"+i);
    for (var j = 0; j< links.length; j++)
    {//go through each link, look for seeds, peers, snatched
      thislink = links[j].toString(); //href=
      thisdata = links[j].innerHTML.toString(); //link text
      //console.log("\nthis link: " + thislink + ", this data: " + thisdata);

      if (thisdata.indexOf('user.php?id=') != -1 || thisdata.indexOf('anon_name') != -1)
      {//found user td, prev 3 are seeds, peers, snatched
        snatchedi = j-3;
        seedsi = j-2;
        peersi = j-1;
        //console.log("seedsi: "+seedsi+", j: "+j);
        seeds[i] = parseInt(links[seedsi].innerHTML.toString().replace(/\D/g,''))
        peers[i] = parseInt(links[peersi].innerHTML.toString().replace(/\D/g,''))
        seedsPeers[i] = seeds[i] + peers[i];
        snatched[i] = parseInt(links[snatchedi].innerHTML.toString().replace(/\D/g,''))
      }
    }
    ratio[i] = seeds[i]/(peers[i]+1); //+1 to prevent divide by zero
  }
  var temp;
  temp = getSuperlatives(seeds);
  hiseeds = temp.nextLargest;
  lowseeds = temp.smallest;
  temp = getSuperlatives(peers);
  hipeers = temp.nextLargest;
  lowpeers = temp.smallest;
  temp = getSuperlatives(seedsPeers);
  hiseedsPeers = temp.nextLargest;
  lowseedsPeers = temp.smallest;
  temp = getSuperlatives(snatched);
  hisnatched = temp.nextLargest;
  lowsnatched = temp.smallest;
  temp = getSuperlatives(ratio);
  hiratio = temp.nextLargest;
  lowratio = temp.smallest;


  //we now have seeds, peers, snatched, ratio for torrents
  //we have to go through again to do styles
  for (var i = 0; i < numtorrents; i++)
  {//go through each torrent to apply styles
    var tempcolor=0;
    var fullcolor;
    if (MODE==1) tempcolor = Math.round(((seeds[i]-lowseeds)/hiseeds) * MAXCOLORS);
    if (MODE==2) tempcolor = Math.round(((peers[i]-lowpeers)/hipeers) * MAXCOLORS);
    if (MODE==3) tempcolor = Math.round(((snatched[i]-lowsnatched)/hisnatched) * MAXCOLORS);
    if (MODE==4) tempcolor = Math.round(((ratio[i]-lowratio)/hiratio) * MAXCOLORS);
    if (MODE==5) tempcolor = Math.round(((seedsPeers[i]-lowseedsPeers)/hiseedsPeers) * MAXCOLORS);

    //console.log("Seeds "+seeds[i]+", low: "+lowseeds+", hi: "+hiseeds+", temp: "+tempcolor)

    if (LOWEST) tempcolor = MAXCOLORS-tempcolor; //flip in the case of white = low

    if (COLORADJUST==1)
    {//red
      if (LOWEST)
      {//white
        fullcolor = "rgb("+MAXCOLORS+","+tempcolor+","+tempcolor+")";
      }
      else
      {//black
        fullcolor = "rgb("+tempcolor+"0,0)";
      }
    }
    else if (COLORADJUST==2)
    {//green
      if (LOWEST)
      {//white
        fullcolor = "rgb("+tempcolor+","+MAXCOLORS+","+tempcolor+")";
      }
      else
      {//black
        fullcolor = "rgb(0,"+tempcolor+",0)";
      }
    }
    else
    {//blue
      if (LOWEST)
      {//white
        fullcolor = "rgb("+tempcolor+","+tempcolor+","+MAXCOLORS+")";
      }
      else
      {//black
        fullcolor = "rgb(0,0,"+tempcolor+")";
      }
    }
    if (torrents[i].className.indexOf('redbar') == -1)
    {
      torrents[i].style.background = fullcolor;

      //torrents[i].style.background = '#ff5644';
    }


  }
})();
