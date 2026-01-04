// ==UserScript==
// @name     DeViantHack
// @namespace deviantHack_1764648480613
// @version  1
// @grant    none
// @author 	 LuaMaria (GreasyFork Version)
// @include	 *://www.deviantart*
// @description Blocking ads and popup on Deviantart
// @run-at 	 document-end
// @icon			https://st.deviantart.net/eclipse/icons/da_favicon_v2.ico
// @license   GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/557610/DeViantHack.user.js
// @updateURL https://update.greasyfork.org/scripts/557610/DeViantHack.meta.js
// ==/UserScript==

const w = window;
const d = document;
const this_url = w.location.href;
const this_hostname = w.location.hostname;
const url_path = w.location.pathname;
const body = d.body;

function id(str){
 	return d.getElementById(str); 
}

function s(str){
	return d.querySelector(str);  
}

function sa(str){
	return d.querySelectorAll(str);  
}

//body.style.visibility = 'hidden';

//timeout
setTimeout( () => {
  
  //body.style.visibility = 'visible';
	const ad_pp = s('dialog');
	console.log('ads_banner:', ad_pp);
  ad_pp.close();
  s('button[aria-label="Close"]').click();
  
  //replace links
	const banner = sa('a[href]');
  banner.forEach( link => {
  	//console.log(link.href);
    if( link.href.includes('core') ){
     	link.setAttribute('style', "display: none;"); 
    }
  });
  
  //replace images
  const img_banner = sa('img[alt="Banner"]');
  img_banner.forEach( img => {
  	img.style.display = 'none';
  });
  
  //replace aside
  const img_aside = sa('aside');
  img_aside.forEach( as => {
  	as.style.display = 'none';
  });
  

//end_timeout
}, 1000);


function blast_root(){
  const evil = sa('iframe[scrolling="no"]');  
  evil.forEach( i => {
 		console.log('root:', i );
  	const limbo = "https://media.tenor.com/e71bz32B3AcAAAAi/cute-cats.gif";
  	i.src = limbo;
  });
                     
}
                     
                     
const root_ad = setTimeout(blast_root, 2000);
const root_ad1 = setTimeout(blast_root, 3000);
const root_ad2 = setTimeout(blast_root, 7000);


const targetNode = document.body;


const callback = function(mutationsList) {
  mutationsList.forEach(mutation => {
    if (mutation.type === 'childList') {
      console.warn('Body content has changed!', mutation);
    }else{
     console.log(mutation); 
    }
  });
};


//alert('Done');



