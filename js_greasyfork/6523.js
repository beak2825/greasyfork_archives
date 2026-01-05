// ==UserScript==
// @name          PTP, BTN Links on IMDb
// @description   Adds a link next to the title on imdb to the movie on PTP, and other sites
// @version       0.3
// @include       *imdb.com/title/tt*
// @namespace     Chameleon-techietrash-links-on-imdb
// @homepage      https://tls.passthepopcorn.me/forums.php?action=viewthread&threadid=14412
// @author        Chameleon (updated by techietrash)
// @downloadURL https://update.greasyfork.org/scripts/6523/PTP%2C%20BTN%20Links%20on%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/6523/PTP%2C%20BTN%20Links%20on%20IMDb.meta.js
// ==/UserScript==
// Changelog:
//   0.3: added PTP/BTN as default, HTTPS by default
//   0.2: Added settings to customise sites added
//   0.1: Original script

var sites=[{acronym:'PTP', search_string:'https://tls.passthepopcorn.me/torrents.php?imdb=tt<imdb_id>'},
{acronym:'BTN', search_string:'https://broadcasthe.net/torrents.php?imdb=tt<imdb_id>'}];

if(window.localStorage)
{
  var store=window.localStorage['torrent_sites'];
  if(store)
  {
    sites=JSON.parse(store);
  }
  else
  {
    window.localStorage['torrent_sites']=JSON.stringify(sites);
  }
}

if(sites.length == 0)
  sites=[{acronym:'PTP', search_string:'https://tls.passthepopcorn.me/torrents.php?imdb=tt<imdb_id>'},
  {acronym:'BTN', search_string:'https://broadcasthe.net/torrents.php?imdb=tt<imdb_id>'}];

var settings=document.URL.indexOf('#settings');
if(settings != -1)
{
  var d1 = document.createElement('div');
  document.body.appendChild(d1);
  d1.setAttribute('style', 'position: absolute; top: 190px; width: 100%; text-align: center; z-index: 1;');
  var d = document.createElement('div');
  d1.appendChild(d);
  d.setAttribute('style', 'background: black; color: white; border-radius: 15px; padding: 5px; display: inline-block;');
  d.id='settings_holder';
  if(!window.localStorage)
  {
    d.innerHTML="Local Storage not available, unable to add new sites.";
  }
  else
  {
    for(var i=0; i<sites.length; i++)
    {
      d.appendChild(settings_inputs(sites[i]));
    }
    d.appendChild(settings_inputs({acronym:'', search_string:''}));
  }
}

imdb_id = document.URL.split('tt')[2];

imdb_id = imdb_id.substring(0,7);

ptp_link = document.createElement('a');
ptp_link.href = 'https://tls.passthepopcorn.me/torrents.php?imdb=tt'+imdb_id;
ptp_link.innerHTML = 'PTP';

imdb_title = document.getElementsByClassName('header')[0];
if(!imdb_title)
  imdb_title = document.getElementsByTagName('h1')[0];
imdb_year = imdb_title.getElementsByTagName('span')[1];

link_holder = document.createElement('span');
link_holder.appendChild(document.createTextNode(' ('));
links = document.createElement('span');
links.id = 'torrent_links';
link_holder.appendChild(links);
link_holder.appendChild(document.createTextNode(')'));

imdb_year.parentNode.insertBefore(link_holder, imdb_year.nextSibling);

add_links();

function add_links()
{
  links=document.getElementById('torrent_links');
  links.innerHTML='';
  for(var i=0; i<sites.length; i++)
  {
    if(i!=0)
    {
      links.appendChild(document.createTextNode(', '));
    }
    a=document.createElement('a');
    a.innerHTML=sites[i].acronym;
    a.href=sites[i].search_string.replace('<imdb_id>', imdb_id);
    links.appendChild(a);
  }
}

function settings_inputs(site)
{
  d=document.createElement('div');
  t=document.createElement('input');
  d.appendChild(t);
  t.type='text';
  t.placeholder='Acronym';
  t.value=site.acronym;
  t.setAttribute('class','acronym');
  t.setAttribute('style', 'width: 75px; border-radius: 15px; text-align: center;');
  t.addEventListener('change', changed, false);
  t=document.createElement('input');
  d.appendChild(t);
  t.type='text';
  t.placeholder='Search String';
  t.value=site.search_string;
  t.setAttribute('style', 'width: 485px; border-radius: 15px; text-align: center;');
  t.addEventListener('change', update_links, false);
  return d;
}

function changed()
{
  var s=document.getElementById('settings_holder');
  var ins=s.getElementsByClassName('acronym');
  var count=0;
  for(var i=0; i<ins.length; i++)
  {
    if(ins[i].value=='')
      count++;
  }
  if(this.value=='')
  {
    if(count > 1)
    {
      p=this.parentElement;
      p.parentElement.removeChild(p);
    }
  }
  else
  {
    if(count == 0)
      s.appendChild(settings_inputs({acronym:'', search_string:''}));
  }

  update_links();
}

function update_links()
{
  var s=document.getElementById('settings_holder').getElementsByTagName('input');
  var newsites=[];
  for(var i=0; i<s.length; i=i+2)
  {
    a=s[i].value;
    if(!a)
      continue;
    ss=s[i+1].value;
    newsites.push({acronym:a, search_string:ss});
  }

  sites=newsites;
  window.localStorage['torrent_sites']=JSON.stringify(sites);
  add_links();
}
