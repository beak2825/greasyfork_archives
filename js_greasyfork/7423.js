// ==UserScript==
// @name         Scrap.TF Raffle page improver
// @version      1.1
// @description  Improves the Scrap.tf raffle page
// @author       Takee
// @match        https://scrap.tf/raffles?*
// @match        https://scrap.tf/raffles
// @grant        none
// @namespace https://greasyfork.org/users/8292
// @downloadURL https://update.greasyfork.org/scripts/7423/ScrapTF%20Raffle%20page%20improver.user.js
// @updateURL https://update.greasyfork.org/scripts/7423/ScrapTF%20Raffle%20page%20improver.meta.js
// ==/UserScript==

e = document.querySelector('.entered-count');

if (e === null) {
	login = document.createElement('div');
	login.textContent = 'Login to enable raffle page improvements';
	login.setAttribute('style','text-align: center; color: #C0392B;');
	
	document.getElementsByClassName('panel-heading')[0].appendChild(login);
} else {

function loadRaffles(def) {
	def = def || 30;
	ScrapTF.Ajax(
		"raffles/Paginate", 
		{start: def}, 
		function(data) {
			$("#raffles-list").append(data.html);
			if (data.done) {
				ScrapTF.Raffles.DoTimers();
				addRaffleItems();
			} else loadRaffles(def + data.num);
			
		}, function(data) {
			$(".pag-loading").html("Error loading more raffles.");
			$(".pag-loading").show();
			setTimeout(function() { location.reload() }, 500);
		}
	);
}

function addRaffleItems() {
	d = document.querySelectorAll('.raffle-name>a:not(.USERJSdetails)');
	for (x = 0; x < d.length; x++) {
        if (d[x].parentNode.firstChild == d[x]) {
          
			enterbtn = document.createElement('div');
			enterbtn.style.display = 'inline-block';
			enterbtn.style.marginRight = '10px';
			
			lk = document.createElement('a');
            
            if (d[x].parentNode.parentNode.parentNode.style.opacity != "") {
                lk.textContent = "Leave";
                lk.setAttribute('onclick', 'ScrapTF.Raffles.CurrentRaffle=this.parentNode.nextSibling.href.replace("https://scrap.tf/raffles/","");ScrapTF.Raffles.LeaveRaffle(ScrapTF.Raffles.CurrentRaffle)');
                lk.className = "btn btn-embossed btn-danger btn-info";
            } else {
				lk.textContent = "Enter";
				lk.setAttribute('onclick', 'ScrapTF.Raffles.CurrentRaffle=this.parentNode.nextSibling.href.replace("https://scrap.tf/raffles/","");ScrapTF.Raffles.EnterRaffle(ScrapTF.Raffles.CurrentRaffle)');
                lk.className = "btn btn-embossed btn-info";
            }
        	enterbtn.appendChild(lk);
			d[x].parentNode.insertBefore(enterbtn, d[x].parentNode.firstChild);
		}
		
		details = document.createElement('a');
		details.textContent = "Show details";
		details.className = "USERJSdetails down";
		details.setAttribute('onclick', 'togglePopup(this.parentNode.childNodes[1])');
		details.id = "details" + d[x];
		d[x].parentNode.appendChild(details);
	
		popup = document.createElement('div');
		popup.className = 'USERJSdetailsbox';
		d[x].parentNode.parentNode.appendChild(popup);
		popup.id = d[x];
    }
}

function sortRaffles() {
	t = document.querySelectorAll('.raffle-time-left');
	q = [];
	for (x = 0; x < t.length; x++) { q.push(t[x].getAttribute("data-time")) }
	q.sort();

	for (x = 0; x < q.length; x++) { 
		e = document.querySelector('[data-time="'+q[x]+'"]').parentNode.parentNode.parentNode;
		e.parentNode.appendChild(e);
	}
}

function enterAll() {
	d = document.querySelectorAll('.raffle-name>a:not(.USERJSdetails)');
	params = {};
	params.csrf = ScrapTF.User.Hash;
	done = [];
	r = [];
	
	for (x = 0; x < d.length; x++) {
		params.raffle = d[x].href.replace('https://scrap.tf/raffles/',''); 
		r.push( $.ajax({
			type: "POST",
			url: "/ajax/viewraffle/EnterRaffle",
			data: params
		}) );
        r[x].done( function(){
			done.push('');
			if (done.length == d.length) window.location.replace( "https://scrap.tf/raffles?" + Math.random() + location.hash);
		});
	}
}

function togglePopup(delem) {
	popup = document.getElementById(delem);
	detailtext = document.getElementById("details" + delem);
	
	if (!popup.firstChild) {
		$.ajax({
            url: delem.href,
            dataType: "html"
        }).done(function(response){

			parser = new DOMParser();
			content = parser.parseFromString(response, 'text/html');
			
			table = content.getElementsByClassName('raffle-table-container')[0];
		
			table.style.position = "absolute";
			table.style.top = "-1000px";
			table.style.width = "800px";
		
			document.body.appendChild(table);
			h = table.clientHeight;

			popup.setAttribute("h", h);
		
			table.style.position = "static";
			
			detailtext.textContent = "Hide details";
			detailtext.className = 'USERJSdetails up';
			popup.style.height = h + 'px';
			popup.appendChild(table);
			ScrapTF.Raffles.DoTimers();
        });
	}
	
	if (popup.style.height != '0px') {
		popup.style.height = '0px';
		detailtext.textContent = "Show details";
		detailtext.className = 'USERJSdetails down';
	} else {
		popup.style.height = popup.getAttribute('h') + 'px';
		detailtext.textContent = "Hide details";
		detailtext.className = 'USERJSdetails up';
	}
}

function autoEnter() {
	document.getElementsByClassName('panel-bg')[0].style.display = 'none';
	
	while (e.firstChild) { e.removeChild(e.firstChild); }
	
	stop = document.createElement('a');
	stop.href = "https://scrap.tf/raffles";
	stop.textContent = "Stop";
	stop.className = "btn btn-embossed btn-danger USERJSbtn";
	
	e.appendChild( document.createTextNode('Auto-Entering') );
	e.appendChild( document.createElement('br') );
	e.appendChild(stop);
	setTimeout(enterAll, 60000);
}	

s = document.createElement('style');
styleText = document.createTextNode(".USERJSdetailsbox{width:825px;display:block;margin: 41px auto 0 auto;transition:height 0.3s;height:0px;}.USERJSdetails{cursor:pointer;color:#5DADE2;margin-left:10px;font-size:14px;border:1px solid #DDD;border-radius:3px;padding:4px;}.USERJSdetails:hover{color:#4E92BF}.USERJSdetails:after{height:0;width:0;content:'';margin-left:5px;border:4px solid transparent;display:inline-block;vertical-align:middle}.down:after{border-top-color:#5DADE2;margin-top:4px;}.up:after{border-bottom-color: #5DADE2;margin-top:-4px;}.panel-raffle:after{width:100%;height:2px;content:'';font-size:0px;display:block;background:#415B76}.USERJSbtn{margin:4px}")
s.appendChild(styleText);
document.getElementsByTagName('head')[0].appendChild(s);

ScrapTF.Raffles.Pagination.UpdatePagination = function() { return };
ScrapTF.Raffles.Pagination.isDone = true;

loadRaffles();

all = document.createElement('a');
all.onclick = enterAll;
all.textContent = 'Enter all';
all.className = "btn btn-embossed btn-info USERJSbtn";

sort = document.createElement('a');
sort.onclick = sortRaffles;
sort.textContent = "Sort Raffles";
sort.className = "btn btn-embossed btn-info USERJSbtn";

auto = document.createElement('a');
auto.onclick = autoEnter;
auto.textContent = "Auto-enter";
auto.className = "btn btn-embossed btn-danger USERJSbtn";

e.appendChild(document.createElement('br'));
e.appendChild(all);
e.appendChild(sort);
e.appendChild(auto);

var script = document.createElement('script');
script.appendChild(document.createTextNode(togglePopup));
(document.body || document.head || document.documentElement).appendChild(script);

if (window.location.hash == "#autoenter") autoEnter();}