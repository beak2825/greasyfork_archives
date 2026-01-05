// ==UserScript==
// @name        HIT Scraper WITH TC EXPORT
// @author      Kerek and TJ and jawz
// @description Snag HITs.
//              Based in part on code from mmmturkeybacon Export Mturk History and mmmturkeybacon Color Coded Search with Checkpoints
// @match       https://www.mturk.com/mturk/findhits?match=true#hit_scraper*
// @match       https://www.mturk.com/mturk/findhits?match=true?hit_scraper*
// @version     1.4.5
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant	    GM_deleteValue
// @grant		GM_setClipboard
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/7458/HIT%20Scraper%20WITH%20TC%20EXPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/7458/HIT%20Scraper%20WITH%20TC%20EXPORT.meta.js
// ==/UserScript==

//alter the requester ignore last as you desire, case insensitive
var default_list = ["oscar smith", "Diamond Tip Research LLC", "jonathon weber", "jerry torres", "Crowdsource", "we-pay-you-fast", "turk experiment", "jon brelig"];
var ignore_list = default_list;
if (GM_getValue("scraper_ignore_list"))
    ignore_list = GM_getValue("scraper_ignore_list");
else
    GM_setValue("scraper_ignore_list", default_list);

var include_list = [];
if (GM_getValue("scraper_include_list"))
    include_list = GM_getValue("scraper_include_list");

//This is to update the hit export symbol
var symbol = "☭";

//this searches extra pages if you skip too much, helps fill out results if you hit a chunk of ignored HITs.  Change to true for this behavior.
var correct_for_skips = true;

//weight the four TO ratings for the coloring. Default has pay twice as important as fairness and nothing for communication and fast.
var COMM_WEIGHT = 0;
var PAY_WEIGHT  = 10;
var FAIR_WEIGHT = 5;
var FAST_WEIGHT = 0;

//Used for themeing, change the colors to change how scraper looks
var GREEN   = '#66CC66'; //  > 4
var LIGHTGREEN = '#ADFF2F'; // > 3  GREEN YELLOW
var YELLOW = '#FFD700'; //Not used
var ORANGE  = '#FF9900'; //  > 2
var RED     = '#FF3030'; // <= 2
var BLUE    = '#C0D9D9'; // no TO
var GREY = 'lightGrey'; //TO down
var BROWN = '#94704D'; //Font color
var DARKGREY = '#9F9F9F'; //No HITDB, "Not Qualified" column
var BACKGROUND_COLOR = "rgb(19, 19, 19)"; //Background of page

//display your hitdb records if applicable
var check_hitDB = true;

//default text size
var default_text_size=11;

//set to "true" to override checkbox setting and ding on new hits
var newHitDing = false;

//DO NOT EDIT ANYTHING BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING!

var status_text = "None";
var shouldDing = false;
var audio = document.createElement('audio');
document.body.appendChild(audio);
audio.src = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAAB8mpoRAAAAAFLKt9gBHgF2b3JiaXMAAAAAARErAAAAAAAAkGUAAAAAAACZAU9nZ1MAAAAAAAAAAAAAfJqaEQEAAACHYsq6Cy3///////////+1A3ZvcmJpcx0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDA1MDMwNAAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABAgkAAAAAAAAfJqaEQIAAAB89IOyJjhEQUNNRE5TRENHS0xTRllHSEpISUdORk1GSEdISUNHP0ZHS1IhquPYHv5OAgC/7wFATp2pUBdX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';
audio.setAttribute("id", "ding_noise");
audio.volume = 1;

function newHits(dingNoise) {
    console.log(dingNoise);
    if (dingNoise || newHitDing)
    	document.getElementById("ding_noise").play();
}

//For editing the blocklist
var div = document.createElement('div');
var textarea = document.createElement('textarea');

div.style.position = 'fixed';
div.style.width = '500px';
div.style.height = '235px';
div.style.left = '50%';
div.style.right = '50%';
div.style.margin = '-250px 0px 0px -250px';
div.style.top = '300px';
div.style.padding = '5px';
div.style.border = '2px';
div.style.backgroundColor = 'black';
div.style.color = 'white';
div.style.zIndex = '100';
div.setAttribute('id','block_div');

textarea.style.padding = '2px';
textarea.style.width = '500px';
textarea.style.height = '200px';
textarea.title = 'Block list';
textarea.setAttribute('id','block_text');

div.textContent = 'Change the blocklist to be whatever you like, save to save it. Separate requesters with the ^ character. After clicking "Save", you\'ll need to scrape again to apply the changes.';
div.style.fontSize = '12px';
div.appendChild(textarea);

var save_button = document.createElement('button');

save_button.textContent = 'Save';
save_button.setAttribute('id', 'save_blocklist');
save_button.style.height = '18px';
save_button.style.width = '100px';
save_button.style.fontSize = '10px';
save_button.style.paddingLeft = '3px';
save_button.style.paddingRight = '3px';
save_button.style.backgroundColor = 'white';
save_button.style.marginLeft = '5px';

div.appendChild(save_button);

$("#block_div").hide();
save_button.addEventListener("click", function() {save_blocklist();}, false);
document.body.insertBefore(div, document.body.firstChild);

//For editing the include list
var shouldInclude = false;
var div2 = document.createElement('div');
var textarea2 = document.createElement('textarea');

div2.style.position = 'fixed';
div2.style.width = '500px';
div2.style.height = '235px';
div2.style.left = '50%';
div2.style.right = '50%';
div2.style.margin = '-250px 0px 0px -250px';
div2.style.top = '300px';
div2.style.padding = '5px';
div2.style.border = '2px';
div2.style.backgroundColor = 'black';
div2.style.color = 'white';
div2.style.zIndex = '100';
div2.setAttribute('id','include_div');

textarea2.style.padding = '2px';
textarea2.style.width = '500px';
textarea2.style.height = '200px';
textarea2.title = 'include list';
textarea2.setAttribute('id','include_text');

div2.textContent = 'Used if you only want to see certain requesters. Separator is ^. Only takes effect if \"Use includelist\" is checked.';
div2.style.fontSize = '12px';
div2.appendChild(textarea2);

var save_button2 = document.createElement('button');

save_button2.textContent = 'Save';
save_button2.setAttribute('id', 'save_blocklist');
save_button2.style.height = '18px';
save_button2.style.width = '100px';
save_button2.style.fontSize = '10px';
save_button2.style.paddingLeft = '3px';
save_button2.style.paddingRight = '3px';
save_button2.style.backgroundColor = 'white';
save_button2.style.marginLeft = '5px';

div2.appendChild(save_button2);

$("#include_div").hide();
save_button2.addEventListener("click", function() {save_includelist();}, false);
document.body.insertBefore(div2, document.body.firstChild);

function save_blocklist() {
    console.log("Save");
    var textarea = $("#block_text");
    var text = textarea.val();
    var block_list = text.split("^");
    console.log(block_list);
    var trimmed_list = [];
    for (var requester in block_list){
        if (block_list[requester].trim().length != 0)
        	trimmed_list.push(block_list[requester].toLowerCase().trim());
    }
    GM_setValue("scraper_ignore_list",trimmed_list);   
    ignore_list = GM_getValue("scraper_ignore_list");
    console.log(ignore_list);
    $("#block_div").hide();
}

function save_includelist() {
    console.log("Save");
    var textarea = $("#include_text");
    var text = textarea.val();
    var includes = text.split("^");
    console.log(includes);
    var trimmed_list = [];
    for (var requester in includes){
        if (includes[requester].trim().length != 0)
        	trimmed_list.push(includes[requester].toLowerCase().trim());
    }
    GM_setValue("scraper_include_list",trimmed_list);   
    include_list = GM_getValue("scraper_include_list");
    console.log(include_list);
    $("#include_div").hide();
}

var HITStorage = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB ||
                window.mozIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;
HITStorage.IDBTransactionModes = { "READ_ONLY": "readonly", "READ_WRITE": "readwrite", "VERSION_CHANGE": "versionchange" };
var IDBKeyRange = window.IDBKeyRange;

HITStorage.indexedDB = {};
HITStorage.indexedDB = {};
HITStorage.indexedDB.db = null;

HITStorage.indexedDB.onerror = function(e) {
  console.log(e);
};

var v=4;

HITStorage.indexedDB.checkTitle = function(title,button) {
  var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
    if (!db.objectStoreNames.contains("HIT"))
    {
      db.close();
      return;
    }
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var index = store.index("title");
    index.get(title).onsuccess = function(event)
    {
      if (event.target.result === undefined)
      {
             console.log(title + ' not found');
        history[button].titledb=false;
      }
      else
      {
          console.log(title + ' found');
        history[button].titledb=true;
      }
      
      db.close();
    };
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.checkRequester = function(id,button) {
  var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
    if (!db.objectStoreNames.contains("HIT"))
    {
      db.close();
      return;
    }
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var index = store.index("requesterId");
    index.get(id).onsuccess = function(event)
    {
      if (event.target.result === undefined)
      {history[button].reqdb=false;
        console.log(id + ' not found');
      }
      else
      {
            history[button].reqdb=true;
        console.log(id + ' found');
      }
      db.close();
    };
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

var PAGES_TO_SCRAPE = 3;
var MINIMUM_HITS = 100;
var SEARCH_REFRESH=0;
var URL_BASE = "/mturk/searchbar?searchWords=&selectedSearchType=hitgroups";
var initial_url = URL_BASE;
var TO_REQ_URL = "http://turkopticon.ucsd.edu/reports?id=";
var found_key_list=[];
var last_clear_time = new Date().getTime();
var searched_once = false;
var save_new_results_time = 120;
var save_results_time = 3600;
var default_type = 0;
var cur_loc = window.location.href;
var time_input = document.createElement("INPUT");
time_input.value = 0;
var page_input = document.createElement("INPUT");
page_input.value = 3;
var min_input = document.createElement("INPUT");
var new_time_display_input = document.createElement("INPUT");
new_time_display_input.value = 300;
var reward_input = document.createElement("INPUT");
var qual_input = document.createElement("INPUT");
qual_input.type = "checkbox";
qual_input.checked = true;
var masters_input = document.createElement("INPUT");
masters_input.type = "checkbox";
var sort_input1 = document.createElement("INPUT");
sort_input1.type = "radio";
sort_input1.name = "sort_type";
sort_input1.value = "latest";
sort_input1.checked = true;
var sort_input2 = document.createElement("INPUT");
sort_input2.type = "radio";
sort_input2.name = "sort_type";
sort_input2.value = "most";
var sort_input3 = document.createElement("INPUT");
sort_input3.type = "radio";
sort_input3.name = "sort_type";
sort_input3.value = "amount";
var sort_input4 = document.createElement("INPUT");
sort_input4.type = "radio";
sort_input4.name = "sort_type";
sort_input4.value = "A-Z";
var sort_input_invert = document.createElement("INPUT");
sort_input_invert.type = "checkbox";
var friesAreDone = document.createElement("INPUT");
friesAreDone.type = "checkbox";
var correctForSkips = document.createElement("INPUT");
correctForSkips.type = "checkbox";
correctForSkips.checked = true;
var matchOnly = document.createElement("INPUT");
matchOnly.type = "checkbox";

var search_input = document.createElement("INPUT");

var LINK_BASE = "https://www.mturk.com";
var STATUSDETAIL_DELAY = 250;
var MPRE_DELAY = 3000;

$('body').css('background', BACKGROUND_COLOR);

var next_page = 1;

var API_PROXY_BASE = 'https://mturk-api.istrack.in/';
var API_MULTI_ATTRS_URL = API_PROXY_BASE + 'multi-attrs.php?ids=';
var REVIEWS_BASE = 'http://turkopticon.ucsd.edu/';

var control_panel_HTML = '<div id="control_panel" style="margin: 0 auto 0 auto;' +
                         'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
                         'background-color: ' + BACKGROUND_COLOR + ';"></div>';
$('body > :not(#control_panel)').hide(); //hide all nodes directly under the body
$('body').prepend(control_panel_HTML);

var control_panel = document.getElementById("control_panel");
var big_red_button = document.createElement("BUTTON");
var reset_blocks = document.createElement("BUTTON");
var include_button = document.createElement("BUTTON");
var progress_report = document.createTextNode("Stopped");
var status_report = document.createTextNode("None");
var text_area = document.createElement("TABLE");
big_red_button.textContent = "Show Interface";
big_red_button.onclick =  function(){show_interface();};
control_panel.appendChild(big_red_button);

show_interface();

var global_run = false;
var statusdetail_loop_finished = false;
var date_header = "";
var history = {};
var wait_loop;

function set_progress_report(text, force)
{
    if (global_run == true || force == true)
    {
        progress_report.textContent = text;
        status_report.textContent = status_text;
    }
}

function get_progress_report()
{
    return progress_report.textContent;
}

function wait_until_stopped()
{
    if (global_run == true)
    {
        if (statusdetail_loop_finished == true)
        {
            big_red_button.textContent = "Start";
            set_progress_report("Finished", false);
        }
        else
        {
            setTimeout(function(){wait_until_stopped();}, 500);
        }
    }
}

function display_wait_time(wait_time)
{
    if (global_run == true)
    {
        var current_progress = get_progress_report();
        if (current_progress.indexOf("Searching again in")!==-1)
        {
            set_progress_report(current_progress.replace(/Searching again in \d+ seconds/ , "Searching again in " + wait_time + " seconds"),false);
        }
        else
            set_progress_report(current_progress + " Searching again in " + wait_time + " seconds.", false);
        if (wait_time>1)
            setTimeout(function(){display_wait_time(wait_time-1);}, 1000);
    }
}

function dispArr(ar)
{
    var disp = "";
    for (var z = 0; z < ar.length; z++)
    {
        disp += "id " + z + " is " + ar[z] + " ";
    }
    console.log(disp);
}

function scrape($src)
{
    var $requester = $src.find('a[href^="/mturk/searchbar?selectedSearchType=hitgroups&requester"]');
    var $title = $src.find('a[class="capsulelink"]');
    var $reward = $src.find('span[class="reward"]');
    var $preview = $src.find('a[href^="/mturk/preview?"]');
    var $qualified = $src.find('a[href^="/mturk/notqualified?"]');
    var $times = $src.find('a[id^="duration_to_complete"]');
    var $descriptions = $src.find('a[id^="description"]');
    var not_qualified_group_IDs=[];
    var $quals = $src.find('a[id^="qualificationsRequired"]');
    $qualified.each(function(){
        var groupy = $(this).attr('href');
        groupy = groupy.replace("/mturk/notqualified?hitId=","");
        not_qualified_group_IDs.push(groupy);
    });
    var $mixed =  $src.find('a[href^="/mturk/preview?"],a[href^="/mturk/notqualified?"]');
    var listy =[];
    $mixed.each(function(){
        var groupy = $(this).attr('href');
        groupy = groupy.replace("/mturk/notqualified?hitId=","");
        groupy = groupy.replace("/mturk/preview?groupId=","");
        listy.push(groupy);
    });
    listy = listy.filter(function(elem, pos) {
        return listy.indexOf(elem) == pos;
    });

    for (var j = 0; j < $requester.length; j++)
    {
        var $hits = $requester.eq(j).parent().parent().parent().parent().parent().parent().find('td[class="capsule_field_text"]');
        var requester_name = $requester.eq(j).text().trim();
        var requester_link = $requester.eq(j).attr('href');
        var group_ID=listy[j];
        var preview_link = "/mturk/preview?groupId=" + group_ID;
        var title = $title.eq(j).text().trim();
        var reward = $reward.eq(j).text().trim();
        var hits = $hits.eq(4).text().trim();
        var time = $times.eq(j).parent()[0].nextSibling.nextSibling.innerHTML;
        var description = $descriptions.eq(j).parent()[0].nextSibling.nextSibling.innerHTML;
        //console.log(description);
        var requester_id = requester_link.replace('/mturk/searchbar?selectedSearchType=hitgroups&requesterId=','');
        var accept_link;
        accept_link = preview_link.replace('preview','previewandaccept');
        
        /*HIT SCRAPER ADDITION*/
        var qElements = $quals.eq(j).parent().parent().parent().find('tr');
        //console.log(qElements);

        var qualifications = [];
        for (var i = 1; i < qElements.length; i++) {
            qualifications.push((qElements[i].childNodes[1].textContent.trim().replace(/\s+/g, ' ').indexOf("Masters") != -1 ? "[color=red][b]"+qElements[i].childNodes[1].textContent.trim().replace(/\s+/g, ' ')+"[/b][/color]" : qElements[i].childNodes[1].textContent.trim().replace(/\s+/g, ' ')));
        }
        var qualList = (qualifications.join(', ') ? qualifications.join(', ') : "None");

        key = requester_name+title+reward+group_ID;
        found_key_list.push(key);
        if (history[key] == undefined)
        {
            history[key] = {requester:"", title:"", description:"", reward:"", hits:"", req_link:"", quals:"", prev_link:"", rid:"", acc_link:"", new_result:"", qualified:"", found_this_time:"", initial_time:"", reqdb:"",titledb:"",time:""};
            history[key].req_link = requester_link;
            history[key].prev_link = preview_link;
            history[key].requester = requester_name;
            history[key].title = title;
            history[key].reward = reward;
            history[key].hits = hits;
            history[key].rid = requester_id;
            history[key].acc_link = accept_link;
            history[key].time = time;
            history[key].quals = qualList;
            history[key].description = description;
			HITStorage.indexedDB.checkRequester(requester_id,key);
			HITStorage.indexedDB.checkTitle(title,key);
            if (searched_once)
            {
                history[key].initial_time = new Date().getTime();//-1000*(save_new_results_time - SEARCH_REFRESH);
                history[key].new_result = 0;
            }
            else
            {
                history[key].initial_time = new Date().getTime()-1000*save_new_results_time;
                history[key].new_result = 1000*save_new_results_time;
            }
            if (not_qualified_group_IDs.indexOf(group_ID)!==-1)
                history[key].qualified = false;
            else
                history[key].qualified = true;

            history[key].found_this_time = true;
        }
        else
        {
            history[key].new_result = new Date().getTime() - history[key].initial_time;
            history[key].found_this_time = true;
            history[key].hits = hits;
        }
    }
}

function statusdetail_loop(next_URL)
{
    if (global_run == true)
    {
        if (next_URL.length != 0)
        {
            $.get(next_URL, function(data)
            {
                var $src = $(data);
                var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                if (maxpagerate.length == 0)
                {
                    if (next_page > PAGES_TO_SCRAPE)
                    {
                        if(status_text.indexOf("Correcting for skips") == -1)
                        	status_text += ". Correcting for skips";
                    }
                    set_progress_report("Processing page " + next_page, false);
                    scrape($src);
        
                    $next_URL = $src.find('a[href^="/mturk/viewsearchbar"]:contains("Next")');
                    next_URL = ($next_URL.length != 0) ? $next_URL.attr("href") : "";
                    next_page++;
                    if (default_type == 1)
                    {
                        var hmin = MINIMUM_HITS+1;
                        for (j = 0; j < found_key_list.length; j++)
                        {
                            console.log(history[found_key_list[j]]);
                            if (history[found_key_list[j]].hits < hmin)
                            {
                                next_URL = "";
                                next_page = -1;
                                break;
                            }
                        }
                    }
        
                    else if (next_page > PAGES_TO_SCRAPE && correct_for_skips)
                    {
                        var skipped_hits = 0;
                        var added_pages = 0;
                        for (j = 0; j < found_key_list.length; j++)
                        {
                            var obj = history[found_key_list[j]];
                            if (!ignore_check(obj.requester,obj.title))
                                skipped_hits++;
                        }
                        added_pages = Math.floor(skipped_hits/10);
                        if (skipped_hits%10 >6)
                            added_pages++;
                        if (next_page > PAGES_TO_SCRAPE + added_pages)
                        {
                            next_URL = "";
                            next_page = -1;
                        }
            
                    }
                    else if (next_page > PAGES_TO_SCRAPE)
                    {
                        next_URL = "";
                        next_page = -1;
                    }
                    
                    setTimeout(function(){statusdetail_loop(next_URL);}, STATUSDETAIL_DELAY);
                }
                else
                {
                    console.log("MPRE");
                    setTimeout(function(){statusdetail_loop(next_URL);}, MPRE_DELAY);
                }
            });
        }
        else
        {
            searched_once = true;
            var found_hits = found_key_list.length;
            var shown_hits = 0;
            var new_hits = 0;
            var url = API_MULTI_ATTRS_URL;
            var rids = [];
            var lastRow = text_area.rows.length - 1;
            for (i = lastRow; i>0; i--)
                text_area.deleteRow(i);
            for (j = 0; j < found_key_list.length; j++)
            {
                //(function(url,rids,j) {
                    var obj = history[found_key_list[j]];
                    if (ignore_check(obj.requester,obj.title) && obj.found_this_time){
                        ++shown_hits;
                        //console.log(obj);
                        //hit export will update col_heads[1]
                        var col_heads = ["<a href='"+ LINK_BASE+obj.req_link +"' target='_blank'>" + obj.requester + "</a>","<a href='"+ LINK_BASE+obj.prev_link +"' target='_blank' title='"+ obj.description +"'>" + obj.title + "</a>",obj.reward,obj.hits,"TO down","<a href='"+ LINK_BASE+obj.acc_link +"' target='_blank'>Accept</a>"];
                        var row = text_area.insertRow(text_area.rows.length);
                        url += obj.rid + ',';
                        rids.push(obj.rid);
                        if (check_hitDB)
                        {
                            col_heads.push("R");
                            col_heads.push("T");
                        }
                        if (!obj.qualified)
                        {
                            col_heads.push("Not Qualified");
                        }
                        for (i=0; i<col_heads.length; i++)
                        {
                            var this_cell = row.insertCell(i);
                            row.cells[i].style.fontSize = default_text_size;
                            this_cell.innerHTML = col_heads[i];
                            if(i>1)
                                this_cell.style.textAlign = 'center';
                            if (check_hitDB)
                            {
                                if (i==6)
                                {
                                    if (obj.reqdb){
                                        this_cell.style.backgroundColor = GREEN;
                                        this_cell.addEventListener("click", (function (obj) { return function() {search_deleg(obj,0);}})(obj));
                                    }
                                    else
                                        this_cell.style.backgroundColor = RED;
                                }
                                else if (i==7)
                                {
                                    if (obj.titledb){
                                        this_cell.style.backgroundColor = GREEN;
                                        this_cell.addEventListener("click", (function (obj) { return function() {search_deleg(obj,1);}})(obj));
                                    }
                                    else
                                        this_cell.style.backgroundColor = RED;
                                }
                                else if (i==8)
                                    this_cell.style.backgroundColor = DARKGREY;
                            }
                            else if (i==6)
                                this_cell.style.backgroundColor = DARKGREY;
                        }
                        if (Object.keys(history).length>0)
                        {
                            if (obj.new_result < 1000*save_new_results_time)
                            {
                                new_hits++;
                                for (i in col_heads)
                                {
                                    row.cells[i].style.fontSize = default_text_size + 1;
                                    row.cells[i].style.fontWeight = "bold";
                                }
                            }
                        }
                        button = document.createElement('button'); //HIT SCRAPER ADDITION
                        button.textContent = 'vB';
                        button.title = 'Export this HIT description as vBulletin formatted text';
                        
                        button.style.height = '14px';
                        button.style.width = '30px';
                        button.style.fontSize = '8px';
                        button.style.border = '1px solid';
                        button.style.padding = '0px';
                        button.style.backgroundColor = 'transparent';
                        
                        button2 = document.createElement('button'); //BUTTON TO BLOCK REQUESTER
                        button2.textContent = 'R';
                        button2.title = 'Add requester to block list';
                        
                        button2.style.height = '14px';
                        button2.style.width = '15px';
                        button2.style.fontSize = '8px';
                        button2.style.border = '1px solid';
                        button2.style.padding = '0px';
                        button2.style.backgroundColor = 'transparent';
                        
                        button3 = document.createElement('button'); //BUTTON TO BLOCK TITLE
                        button3.textContent = 'T';
                        button3.title = 'Add title to block list';
                        
                        button3.style.height = '14px';
                        button3.style.width = '15px';
                        button3.style.fontSize = '8px';
                        button3.style.border = '1px solid';
                        button3.style.padding = '0px';
                        button3.style.backgroundColor = 'transparent';
                        
                        button5 = document.createElement('button'); //Tinychat
                        button5.textContent = 'TC P';
                        button5.title = 'Export this HIT description as vBulletin formatted text';
                        
                        button5.style.height = '14px';
                        button5.style.width = '30px';
                        button5.style.fontSize = '8px';
                        button5.style.border = '1px solid';
                        button5.style.padding = '0px';
                        button5.style.backgroundColor = 'transparent';
                        
                        button6 = document.createElement('button'); //Tinychat
                        button6.textContent = 'TC PA';
                        button6.title = 'Export this HIT description as vBulletin formatted text';
                        
                        button6.style.height = '14px';
                        button6.style.width = '30px';
                        button6.style.fontSize = '8px';
                        button6.style.border = '1px solid';
                        button6.style.padding = '0px';
                        button6.style.backgroundColor = 'transparent';
                                                
                        //button.addEventListener("click", function() {export_func_deleg(j);}.bind(null,j), false);
                        button.addEventListener("click", (function (obj,j) { return function() {export_func_deleg(obj,j);}})(obj,j));
                        button5.addEventListener("click", (function (obj,j) { return function() {apply_template2(obj);}})(obj,j));
                        button6.addEventListener("click", (function (obj,j) { return function() {apply_template2(obj,"A");}})(obj,j));
                        row.cells[1].appendChild(document.createTextNode(" "));
                        row.cells[1].appendChild(button);
                        row.cells[1].appendChild(button5);
                        row.cells[1].appendChild(button6);
                        button2.addEventListener("click", (function (obj,j) { return function() {block_deleg(obj,0);}})(obj,j));
                        row.cells[0].appendChild(document.createTextNode(" "));
                        row.cells[0].appendChild(button2);
                        button3.addEventListener("click", (function (obj,j) { return function() {block_deleg(obj,1);}})(obj,j));
                        row.cells[0].appendChild(button3);
                    }
                //});
                
            }
            set_progress_report("Scrape complete. " + shown_hits + " HITs found (" + new_hits + " new results). " + (found_hits - shown_hits) + " HITs ignored.", false);
            if (new_hits > 0){
                newHits(shouldDing);
            }
            url = url.substring(0,url.length - 1);
            //console.log(url);
            var success_flag = false;
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: url,
                onload: function (results)
                {
                    //console.log(results.responseText);
                    rdata = $.parseJSON(results.responseText);
                    for (i = 0; i < rids.length; i++)
                    {
                        text_area.rows[i+1].style.backgroundColor = GREY;
                        if (rdata[rids[i]])
                        {
                            var pay = rdata[rids[i]].attrs.pay;
                            var reviews = rdata[rids[i]].reviews;
                            var average = 0;
                            var sum = 0;
                            var divisor = 0;
                            var comm = rdata[rids[i]].attrs.comm;
                            var fair = rdata[rids[i]].attrs.fair;
                            var fast = rdata[rids[i]].attrs.fast;
                            if (comm > 0)
                            {
                                sum += COMM_WEIGHT*comm;
                                divisor += COMM_WEIGHT;
                            }
                            if (pay > 0)
                            {
                                sum += PAY_WEIGHT*pay;
                                divisor += PAY_WEIGHT;
                            }
                            if (fair > 0)
                            {
                                sum += FAIR_WEIGHT*fair;
                                divisor += FAIR_WEIGHT;
                            }
                            if (fast > 0)
                            {
                                sum += FAST_WEIGHT*fast;
                                divisor += FAST_WEIGHT;
                            }
                            if (divisor > 0)
                            {
                                average = sum/divisor;
                            }
                            text_area.rows[i+1].cells[4].innerHTML = "<a href='"+ TO_REQ_URL+rids[i] +"' target='_blank'>" + pay + "</a>";
                            if (reviews > 4)
                            {
                                if (average > 4.49)
                                    text_area.rows[i+1].style.backgroundColor = GREEN;
                                else if (average > 3.49)
                                    text_area.rows[i+1].style.backgroundColor = LIGHTGREEN;
                                //else if (average > 2.99)
                                 //   text_area.rows[i+1].style.backgroundColor = YELLOW;
                                else if (average > 1.99)
                                    text_area.rows[i+1].style.backgroundColor = ORANGE;
                                else if (average > 0)
                                    text_area.rows[i+1].style.backgroundColor = RED;
                             }
                        }
                        else
                        {
                            text_area.rows[i+1].cells[4].innerHTML = "No data";
                        }
                    }
                    success_flag = true;
                 }
            });
            if (!success_flag)
                for (i = 0; i < rids.length; i++) text_area.rows[i+1].style.backgroundColor = GREY;
            
            statusdetail_loop_finished = true;
            if (SEARCH_REFRESH>0)
            {
                wait_loop = setTimeout(function(){if (global_run) start_it();}, 1000*SEARCH_REFRESH);
                display_wait_time(SEARCH_REFRESH);
            }
            else
            {
                global_run = false;
                big_red_button.textContent = "Start";
            }
        }
    }
}

function ignore_check(r,t){
    tempList = ignore_list.map(function(item) { return item.toLowerCase(); });
    foundR = -1;
    foundT = -1;
    foundR = tempList.indexOf(r.toLowerCase());
    foundT = tempList.indexOf(t.toLowerCase());
    if (shouldInclude){
        console.log(include_list);
        temp = include_list.map(function(item) { return item.toLowerCase(); }).indexOf(r.toLowerCase());
        console.log(temp);
        if (temp != -1)
            foundR = -1;
        else
            foundR = 0;
    }
    found = foundR == -1 && foundT == -1;
    //console.log("r: "+r+" t: "+t+" f: "+found);
    return found;
    //return -1 == ignore_list.map(function(item) { return item.toLowerCase(); }).indexOf(r.toLowerCase());
}

function start_running()
{
    if (big_red_button.textContent == "Start")
    {
        status_text="";
        ignore_list = GM_getValue("scraper_ignore_list");
        if (GM_getValue("scraper_include_list"))
        	include_list = GM_getValue("scraper_include_list");
        global_run = true;
        initial_url = URL_BASE;
        if (search_input.value.length>0)
        {
            initial_url = initial_url.replace("searchWords=", "searchWords=" + search_input.value);
        }
        if (time_input.value.replace(/[^0-9]+/g,"") != "")
        {
            SEARCH_REFRESH = Number(time_input.value);
        }
        if (page_input.value.replace(/[^0-9]+/g,"") != "")
        {
            PAGES_TO_SCRAPE = Number(page_input.value);
        }
        if (min_input.value.replace(/[^0-9]+/g,"") != "")
        {
            if (!sort_input2.checked)
                status_text += " Minimum batch size selected but not sorting by most available";
            MINIMUM_HITS = Number(min_input.value);
        }
        if (new_time_display_input.value.replace(/[^0-9]+/g,"") != "")
        {
            save_new_results_time = Number(new_time_display_input.value);
        }
        if (reward_input.value.replace(/[^0-9]+/g,"") != "")
        {
            initial_url += "&minReward=" + reward_input.value;
        }
        else
        {
            initial_url += "&minReward=0.00";
        }
        if (qual_input.checked)
        {
            initial_url += "&qualifiedFor=on";
        }
        else
        {
            initial_url += "&qualifiedFor=off";
        }
		if (masters_input.checked)
        {
            initial_url += "&requiresMasterQual=on";
        }
        if (sort_input1.checked)
        {
            initial_url+= "&sortType=LastUpdatedTime%3A";
            default_type = 0;
        }
        else if (sort_input2.checked)
        {
            initial_url+= "&sortType=NumHITs%3A";
            default_type = 1;
            status_text += " Sorting by NumHITs ignores correct for skips in favor of minimum batch size";
        }
        else if (sort_input3.checked)
        {
            initial_url+= "&sortType=Reward%3A";
            default_type = 0;
        }
        else if (sort_input4.checked)
        {
            initial_url += "&sortType=Title%3A";
        }
        if (sort_input_invert.checked)
        {
            if (sort_input4.checked)
                initial_url += "1";
            else
            	initial_url += "0";
        }
        else
        {
            if (sort_input4.checked)
                initial_url += "0";
            else
                initial_url += "1";
        }            
        if (friesAreDone.checked)
        {
            shouldDing = true;
        }
        else {
            shouldDing = false;
        }
        if (correctForSkips.checked){
            if (matchOnly.checked)
            {
                status_text += " Match only checked, ignoring skip correction to prevent issues.";
            	correct_for_skips = false;
        	}
            else{
            	correct_for_skips = true;
            }
    	}
        else {
            correct_for_skips = false;
        }
        if (matchOnly.checked){
            if (include_list.length == 0){
                status_text += " No items in include list. Ignoring inclusion checkbox.";
                shouldInclude = false;
            }
            else
            	shouldInclude = true;
        }
        else{
            shouldInclude = false;
        }
    	if (status_text == "")
            status_text = "None";
        initial_url+="&pageNumber=1&searchSpec=HITGroupSearch"
        start_it();
    }
    else
    {
        global_run = false;
        clearTimeout(wait_loop);
        big_red_button.textContent = "Start";
        set_progress_report("Stopped", true);
    }
}

function start_it()
{
    statusdetail_loop_finished = false;
    big_red_button.textContent = "Stop";
    found_key_list=[];
    var ctime = new Date().getTime()
    if (ctime - last_clear_time > save_results_time*666)
    {
        var last_history=history;
        history = {};
        for (var key in last_history)
        {
            if (last_history[key].new_result<save_results_time*1000)
            {
                history[key]=last_history[key];
                if (last_history[key].found_this_time)
                {
                    last_history[key].found_this_time = false;
                    if (last_history[key].new_result>save_new_results_time*1000)
                        last_history[key].initial_time = ctime-1000*save_new_results_time;
                }
            }

        }
        last_clear_time = ctime;
    }
    next_page = 1;
    statusdetail_loop(initial_url);
}


function show_interface()
{
    control_panel.style.color = BROWN;
    control_panel.style.fontSize = 14;
    control_panel.removeChild(big_red_button);
    control_panel.appendChild(document.createTextNode("Auto-refresh delay: "));
    time_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    time_input.title = "Enter search refresh delay in seconds\n" + "Enter 0 for no auto-refresh\n" + "Default is 0 (no auto-refresh)";
    time_input.size = 3;
    control_panel.appendChild(time_input);
    
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("| Pages to scrape: "));
    page_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    page_input.title = "Enter number of pages to scrape\n" + "Default is 4";
    page_input.size = 3;
    control_panel.appendChild(page_input);
    control_panel.appendChild(document.createTextNode(" Correct for skips: "));
    correctForSkips.title = "Searches additional pages to get a consistent number of results. Helpful if you're blocking a lot of people";
    control_panel.appendChild(correctForSkips);
    
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("| Minimum batch size: "));
    min_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    min_input.title = "Enter minimum HITs for batch search\n" + "Default is 100";
    min_input.size = 3;
    control_panel.appendChild(min_input);
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("| New HIT highlighting: "));
    new_time_display_input.onkeydown = function(event){if (event.keyCode == 13){start_running();}};
    new_time_display_input.title = "Enter time (in seconds) to keep new HITs highlighted\n" + "Default is 300 (5 minutes)";
    new_time_display_input.size = 6;
    control_panel.appendChild(new_time_display_input);
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("| Ding on new hit: "));
    control_panel.appendChild(friesAreDone);
    
    control_panel.appendChild(document.createElement("P"));
    control_panel.appendChild(document.createTextNode("Minimum reward: "));
    reward_input.size = 6;
    control_panel.appendChild(reward_input);
    control_panel.appendChild(document.createTextNode("   "));

    control_panel.appendChild(document.createTextNode("| Qualified: "));
    control_panel.appendChild(qual_input);
    control_panel.appendChild(document.createTextNode("     "));
    control_panel.appendChild(document.createTextNode("| Masters: "));
    control_panel.appendChild(masters_input);
    control_panel.appendChild(document.createTextNode("     "));
    control_panel.appendChild(document.createTextNode("| Sort types:   "));
    control_panel.appendChild(document.createTextNode(" Latest: "));
    control_panel.appendChild(sort_input1);
    control_panel.appendChild(document.createTextNode("| Most Available: "));
    control_panel.appendChild(sort_input2);
    control_panel.appendChild(document.createTextNode("| Amount: "));
    control_panel.appendChild(sort_input3);
    control_panel.appendChild(document.createTextNode("| A-Z: "));
    control_panel.appendChild(sort_input4);
    control_panel.appendChild(document.createTextNode("| Invert: "));
    control_panel.appendChild(sort_input_invert);
       
    control_panel.appendChild(document.createElement("P"));
    
    control_panel.appendChild(search_input);
    search_input.size = 20;
    search_input.title = "Enter a search term to include\n" + "Default is blank (no included terms)";
    search_input.placeholder="Enter search terms here";
    
    control_panel.appendChild(document.createTextNode("   "));
    
    control_panel.appendChild(document.createTextNode("| Use includelist: "));
    control_panel.appendChild(document.createTextNode("   "));
    matchOnly.title = "Be sure to edit the include list or nothing will be displayed.";
    control_panel.appendChild(matchOnly);
    
    big_red_button.textContent = "Start";
    big_red_button.onclick = function(){start_running();};
    reset_blocks.textContent = "Edit blocklist";
	reset_blocks.onclick = function(){
        console.log("in");
        var div = $("#block_div");
        var textarea = $("#block_text");
        textarea.val(ignore_list.join('^'));
        $("#block_div").show();
    };
    
    include_button.textContent = "Edit includes";
    include_button.onclick = function() {
        var div = $("#include_div");
        var textarea = $("#include_text");
        textarea.val(include_list.join('^'));
        $("#include_div").show();
    };
    
    control_panel.appendChild(document.createTextNode(" | "));
    control_panel.appendChild(big_red_button);
    control_panel.appendChild(document.createTextNode("   "));
    control_panel.appendChild(reset_blocks);
    control_panel.appendChild(document.createTextNode("   "));
    control_panel.appendChild(include_button);
   
	control_panel.appendChild(document.createElement("P"));
    control_panel.appendChild(progress_report);
    control_panel.appendChild(document.createElement("P"));
    control_panel.appendChild(document.createTextNode("Status messages: "));
    control_panel.appendChild(status_report);
     
    control_panel.appendChild(document.createElement("P"));
    
    text_area.style.fontWeight = 400;
    text_area.createCaption().innerHTML = "HITs";
    var col_heads = ['Requester','Title','Reward','HITs Available','TO pay','Accept HIT'];
    var row = text_area.createTHead().insertRow(0);
    text_area.caption.style.fontWeight = 800;
    text_area.caption.style.color = BROWN;
	if (default_text_size > 10)
		text_area.cellPadding=Math.min(Math.max(1,Math.floor((default_text_size-10)/2)),5);
    //console.log(text_area.cellPadding);
    //text_area.cellPadding=2;
    text_area.caption.style.fontSize = 28;
    text_area.rows[0].style.fontWeight = 800;
    text_area.rows[0].style.color = BROWN;
    for (i=0; i<col_heads.length; i++)
    {
        var this_cell = row.insertCell(i);
        this_cell.innerHTML = col_heads[i];
        this_cell.style.fontSize = 14;
        if (i > 1)
            this_cell.style.textAlign = 'center';
    }
    
    control_panel.appendChild(text_area);
}

/********HIT EXPORT ADDITIONS*****/

	var EDIT = false;
    var HIT;

    var TO_BASE = "http://turkopticon.ucsd.edu/";
    var API_BASE = "https://mturk-api.istrack.in/";
    var API_URL = API_BASE + "multi-attrs.php?ids=";
    
    DEFAULT_TEMPLATE = '[table][tr][td][b]Title:[/b] [url={prev_link}][COLOR=blue]{title}[/COLOR][/url]\n';
    DEFAULT_TEMPLATE += '[b]Requester:[/b] [url=https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId={rid}][COLOR=blue]{requester}[/COLOR][/url]';
    DEFAULT_TEMPLATE += ' [{rid}] ([url='+TO_BASE+'{rid}][COLOR=blue]TO[/COLOR][/url])';
    DEFAULT_TEMPLATE += '\n[b]TO Ratings:[/b]{to_stuff}';
    DEFAULT_TEMPLATE += '\n[b]Description:[/b] {description}';
    DEFAULT_TEMPLATE += '\n[b]Time:[/b] {time}';
    DEFAULT_TEMPLATE += '\n[b]Hits Available:[/b] {hits}';
    DEFAULT_TEMPLATE += '\n[b]Reward:[/b] [COLOR=green][b]{reward}[/b][/COLOR]';
    DEFAULT_TEMPLATE += '\n[b]Qualifications:[/b] {quals}[/td][/tr][/table]';

    var TEMPLATE;
    var EASYLINK;

    if (typeof GM_getValue === 'undefined')
        TEMPLATE = null;
    else {
        TEMPLATE = GM_getValue('HITScraper Template');
        EASYLINK = GM_getValue('HITScraper Easylink');
    }
    if (TEMPLATE == null) {
        TEMPLATE = DEFAULT_TEMPLATE;
    }

    function buildXhrUrl(rai) {
        var url = API_URL;
        var ri = rai;
        url += rai;
        return url;
    }

    function makeXhrQuery(url) {
        var xhr = new XMLHttpRequest();
        try{
        	xhr.open('GET', url, false);
            xhr.send(null);
            return $.parseJSON(xhr.response);
        }
        catch(err){
            return "TO DOWN";
        }
    }

    function getNamesForEmptyResponses(rai, resp) {
        for (var rid in rai) {
            if (rai.hasOwnProperty(rid) && resp[rid] == "") {
                resp[rid] = $.parseJSON('{"name": "' + rai[rid][0].innerHTML + '"}');
            }
        }
        return resp;
    }

    function getKeys(obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    }

function export_func_deleg(item,index) {
	//console.log(item);
    export_func(item);
    }

function block_deleg(item,index) {
	//console.log(item);
    block(item,index);
    }

function block(hit,index){
    var blockType = ["requester","title"];
    var blockThis = hit[blockType[index]];
    ignore_list.push(blockThis);
    GM_setValue("scraper_ignore_list",ignore_list);
    //console.log(GM_getValue("scraper_ignore_list"));
    alert("\""+blockThis+"\" ignored. Re-scrape");
}

function search_deleg(item,index) {
    console.log(item);
    var searches = ["rid","title"];
    search(item,searches[index]);
}

function hit_sort_func()
{
  return function(a,b) {
    if (a.date == b.date) {
      if (a.requesterName < b.requesterName)
        return -1;
      if (a.requesterName > b.requesterName)
        return 1;
      if (a.title < b.title)
        return -1;
      if (a.title > b.title)
        return 1;
      if (a.status < b.status)
        return -1;
      if (a.status > b.status)
        return 1;
    }
    if (a.date > b.date)
      return 1;
    if (a.date < b.date)
      return -1;
  };
}

function escapeRegExp(str) {
  return str.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function search(item,search_type){
    //return true;/*
    
    var request = indexedDB.open("HITDB", v);
    request.onsuccess = function(e) {
        HITStorage.indexedDB.db = e.target.result;
        var db = HITStorage.indexedDB.db;
        var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
        var store = trans.objectStore("HIT");
        
        var req;
        var results = [];
        var index;
        var range;
        req = store.openCursor();
        req.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                hit = cursor.value;
                var keys = ['title', 'requesterId'];
                var re = new RegExp(escapeRegExp(item[search_type]),"ig");
                for (var k in keys)
                {
                    if (hit[keys[k]] != null && re.test(hit[keys[k]].trim())){
                        results.push(cursor.value);
                    }
                }

                cursor.continue();
            }
            else {
                console.log(results);
                results.sort(hit_sort_func());
                show_results(results);
            }
            db.close();
   		};
    request.onerror = HITStorage.indexedDB.onerror;/**/
    }
}

function format_hit_line (hit, odd, status_color, new_day)
{
  var line = '<tr style="background-color:';
  if (odd)
    line += '#f1f3eb;';
  else
    line += 'white;';
  line += ' valign=top;';
  if (new_day)
    line += ' border: 0px dotted #000000; border-width: 2px 0px 0px 0px">';
  else
    line += '">';

  line += '<td>' + hit.date + '</td>';
  if (hit.requesterLink != null)
    line += '<td style="width:165px"><a href="' + hit.requesterLink + '" title="Contact this Requester">' + hit.requesterName + '</a></td>';
  else
    line += '<td style="width:165px">' + hit.requesterName + '</td>';
  line += '<td style="width:213px">' + hit.title + '</td>';
  line += '<td style="width:45px">$' + hit.reward.toFixed(2) + '</td>';
  line += '<td style="color:' + status_color + '; width:55px">' + hit.status + '</td>';
  line += '<td><div style="width:225px; overflow:hidden">' + hit.feedback + '</div></td>';
  line += '</tr>\n';
  return line;
}

function status_color (status)
{
  var color = "green";

  if (status.match("Pending Approval"))
    color = "orange";
  else if (status.match("Rejected"))
    color = "red";

  return color;
}

function show_results (results){
  resultsWindow = window.open();
  resultsWindow.document.write("<html><head><title>Status Detail Search Results</title></head><body>\n");
  resultsWindow.document.write("<h1>HITs matching your search:</h1>\n");
  resultsWindow.document.write('<table style="border: 1px solid black;border-collapse:collapse;width:90%;margin-left:auto;margin-right:auto;">\n');
  resultsWindow.document.write('<tr style="background-color:lightgrey"><th>Date</th><th>Requester</th><th>HIT Title</th><th>Reward</th><th>Status</th><th>Feedback</th></tr>\n');

  var odd = true;
  var sum = 0;
  var sum_rejected = 0;
  var sum_approved = 0;
  var sum_pending = 0;
    
  
  var new_day = false;

  for (var i=0; i<results.length; i++) {
    odd = !odd;
    sum += results[i].reward;
    if (results[i].status == 'Rejected')
      sum_rejected += results[i].reward;
    else if (results[i].status == 'Pending Approval')
      sum_pending += results[i].reward;
    else
      sum_approved += results[i].reward;

    if (i>0 && (results[i-1].date != results[i].date))
      new_day = true;
    else
      new_day = false;
    resultsWindow.document.write(format_hit_line(results[i], odd, status_color(results[i].status), new_day ));
  }

  resultsWindow.document.write('<tr style="background-color:lightgrey"><th></th><th></th><th></th><th>$' + sum.toFixed(2) + '</th><th></th><th></th></tr>\n');
  resultsWindow.document.write("</table>");
  resultsWindow.document.write("<p>Found " + results.length + " matching HITs. $" + sum_approved.toFixed(2) + " approved, " +
                                 "$" + sum_rejected.toFixed(2) + " rejected and $" + sum_pending.toFixed(2) + " pending.</p>");
  resultsWindow.document.write("</body></html>")
  resultsWindow.document.close();
}    

    
function export_func(item) {
    HIT = item;
    edit_button.textContent = 'Edit Template';
    apply_template(item);
    div.style.display = 'block';
    textarea.select();
}

function apply_template(hit_data) {
        var txt = TEMPLATE;

        var vars = ['title', 'requester', 'rid', 'description', 'reward', 'quals', 'prev_link', 'time', 'hits', 'to_stuff', 'to_text'];

        var resp = null;
        if (txt.indexOf('{to_text}') >= 0 || txt.indexOf('{to_stuff}') >= 0){
            var url = buildXhrUrl(hit_data["rid"]);
            resp = makeXhrQuery(url);
            //console.log(resp);
        }
        var toText = "";
        var toStuff = "";
        var toData = "";
        var numResp = (resp == null || resp == "TO DOWN" ? "n/a" : resp[hit_data["rid"]].reviews);
        if (resp == "TO DOWN"){
            toStuff = " [URL=\""+TO_BASE+hit_data['rid']+"\"]TO down.[/URL]";
            toText = toStuff;
        }
        else if (resp == null || resp[hit_data["rid"]].attrs == null && resp != "TO DOWN") {
            toStuff = " No TO ";
            toText = " No TO ";
            toStuff += "[URL=\""+TO_BASE+"report?requester[amzn_id]=" + hit_data['rid'] + "&requester[amzn_name]=" + hit_data['requester'] + "\"]";
            toStuff += "(Submit a new TO rating for this requester)[/URL]";
        }
        else {
            for (var key in resp[hit_data["rid"]].attrs) {
                //toText += "\n[*]"+key+": "+resp[hit_data["requesterId"]].attrs[key]+"\n";
                var i = 0;
                var color = "green";
                var name = key;
                var num = Math.floor(resp[hit_data["rid"]].attrs[key]);
                switch (key){
                    case "comm":
                        name = "Communicativity";
                        break;
                    case "pay":
                        name = "Generosity";
                        break;
                    case "fast":
                        name = "Promptness";
                        break;
                    case "fair":
                        name = "Fairness";
                        break;
                    default:
                        name = key;
                        break;
                }
                switch (num){
                    case 0:
                        color = "red";
                        break;
                    case 1:
                        color = "red";
                        break;
                    case 2:
                        color = "orange";
                        break;
                    case 3:
                        color = "yellow";
                        break;
                    default:
                        break;
                }
                toText += (num > 0 ? "\n[color="+color+"]" : "\n");
                for (i; i < num; i++){
                    toText += "[b]"+symbol+"[/b]"
                }
                toText += (num > 0 ? "[/color]" : "")
                if (i < 5){
                    toText += "[color=white]";
                    for (i; i < 5; i++)
                        toText += "[b]"+symbol+"[/b]";
                    toText += "[/color]";
                }
                toText += " "+Number(resp[hit_data["rid"]].attrs[key]).toFixed(2)+" "+name;
                toData += Number(resp[hit_data["rid"]].attrs[key]).toFixed(2) + ",";
            }
            //toText += "[/list]";
            toText += (txt.indexOf('{to_stuff}') >= 0 ? "" : "\nNumber of Reviews: "+numResp+"\n[URL=\""+TO_BASE+"report?requester[amzn_id]=" + hit_data['rid'] + "&requester[amzn_name]=" + hit_data['requester'] + "\"](Submit a new TO rating for this requester)[/URL]");
            toStuff = '\n[img]http://data.istrack.in/to/' + toData.slice(0,-1) + '.png[/img]';
            toStuff += (txt.indexOf('{to_stuff}') >= 0 ? (txt.indexOf('{to_text}') >= 0 ? "" : toText) : "");
            toStuff += "\nNumber of Reviews: "+numResp;
            toStuff += "[URL=\""+TO_BASE+"report?requester[amzn_id]=" + hit_data['rid'] + "&requester[amzn_name]=" + hit_data['requester'] + "\"]";
            toStuff += "\n(Submit a new TO rating for this requester)[/URL]";
        }
        
        for (var i = 0; i < vars.length; i++) {
            t = new RegExp('\{' + vars[i] + '\}', 'g');
            if (vars[i] == "to_stuff") {
                txt = txt.replace(t, toStuff);
            }
            else if (vars[i] == "to_text"){
                txt = txt.replace(t, toText);
            }
            else if (vars[i] == "prev_link"){
                txt = txt.replace(t,"https://www.mturk.com"+hit_data[vars[i]]);
            }
            else if (vars[i] == "acc_link"){
                txt = txt.replace(t,"https://www.mturk.com"+hit_data[vars[i]]);
            }
            else
                txt = txt.replace(t, hit_data[vars[i]]);
        }
        textarea.value = txt;
}

function apply_template2(hit_data, link) {
        var txt = TEMPLATE;
		var masters = ""
        var vars = ['title', 'requester', 'rid', 'description', 'reward', 'quals', 'prev_link', 'time', 'hits', 'to_stuff', 'to_text'];
		var hit_link = hit_data['prev_link']
        if (link == "A")
            hit_link = hit_data['prev_link'].replace("preview?", "previewandaccept?")
            
        var resp = null;
        if (txt.indexOf('{to_text}') >= 0 || txt.indexOf('{to_stuff}') >= 0){
            var url = buildXhrUrl(hit_data["rid"]);
            resp = makeXhrQuery(url);
            //console.log(resp);
        }
        var toData = "";
        var numResp = (resp == null || resp == "TO DOWN" ? "n/a" : resp[hit_data["rid"]].reviews);
        if (resp == "TO DOWN"){
            toData = "TO Down";
        }
        else if (resp == null || resp[hit_data["rid"]].attrs == null && resp != "TO DOWN") {
            toData = "No TO";
        }
        else {
            toData = resp[hit_data["rid"]].attrs["pay"];
        }
    if (hit_data['quals'].indexOf("Masters") > -1)
    	masters = "Ma*****"
    txt = masters + " " + hit_data['reward'] + " - " + hit_data['title'] + " - " + "https://www.mturk.com"+hit_link + " - " + hit_data['time'] + " - " + hit_data['requester'] + " - " + "TO: " + toData + " - " + "HITs: " + hit_data['hits'];
    GM_setClipboard(txt);
    
}

function hide_func(div) {
    if (EDIT == false)
        div.style.display = 'none';
    }

function edit_func() {
    if (EDIT == true) {
        EDIT = false;
        TEMPLATE = textarea.value;
        edit_button.textContent = 'Edit Template';
        apply_template(HIT);
    }
    else {
        console.log("Editing");
        EDIT = true;
        edit_button.textContent = 'Show Changes';
        save_button.disabled = false;
        textarea.value = TEMPLATE;
    }
    }

function default_func() {
    GM_deleteValue('HITScraper Template');
    TEMPLATE = DEFAULT_TEMPLATE;
    EDIT = false;
    edit_button.textContent = 'Edit Template';
    apply_template(HIT);
    }

    function save_func() {
        if (EDIT)
            TEMPLATE = textarea.value;
        GM_setValue('HITScraper Template', TEMPLATE);
    }

	var div = document.createElement('div');
    var textarea = document.createElement('textarea');
    var div2 = document.createElement('label');

    div.style.position = 'fixed';
    div.style.width = '500px';
    div.style.height = '235px';
    div.style.left = '50%';
    div.style.right = '50%';
    div.style.margin = '-250px 0px 0px -250px';
    div.style.top = '300px';
    div.style.padding = '5px';
    div.style.border = '2px';
    div.style.backgroundColor = 'black';
    div.style.color = 'white';
    div.style.zIndex = '100';

    textarea.style.padding = '2px';
    textarea.style.width = '500px';
    textarea.style.height = '200px';
    textarea.title = '{title}\n{requester}\n{rid}\n{description}\n{reward}\n{quals}\n{prev_link}\n{time}\n{hit}\n{to_stuff}\n{to_text}';

    div.textContent = 'Press Ctrl+C to copy to clipboard. Click textarea to close';
    div.style.fontSize = '12px';
    div.appendChild(textarea);

    var edit_button = document.createElement('button');
    var save_button = document.createElement('button');
    var default_button = document.createElement('button');
    var easy_button = document.createElement('button');

    edit_button.textContent = 'Edit Template';
    edit_button.setAttribute('id', 'edit_button');
    edit_button.style.height = '18px';
    edit_button.style.width = '100px';
    edit_button.style.fontSize = '10px';
    edit_button.style.paddingLeft = '3px';
    edit_button.style.paddingRight = '3px';
    edit_button.style.backgroundColor = 'white';

    save_button.textContent = 'Save Template';
    save_button.setAttribute('id', 'save_button');
    save_button.style.height = '18px';
    save_button.style.width = '100px';
    save_button.style.fontSize = '10px';
    save_button.style.paddingLeft = '3px';
    save_button.style.paddingRight = '3px';
    save_button.style.backgroundColor = 'white';
    save_button.style.marginLeft = '5px';

    easy_button.textContent = 'Change Adfly Url';
    easy_button.setAttribute('id', 'easy_button');
    easy_button.style.height = '18px';
    easy_button.style.width = '100px';
    easy_button.style.fontSize = '10px';
    easy_button.style.paddingLeft = '3px';
    
    default_button.textContent = ' D ';
    default_button.setAttribute('id', 'default_button');
    default_button.style.height = '18px';
    default_button.style.width = '20px';
    default_button.style.fontSize = '10px';
    default_button.style.paddingLeft = '3px';
    default_button.style.paddingRight = '3px';
    default_button.style.backgroundColor = 'white';
    default_button.style.marginLeft = '5px';
    default_button.title = 'Return default template';
 
    div.appendChild(edit_button);
    div.appendChild(save_button);
    div.appendChild(default_button);
    div.appendChild(easy_button);
    save_button.disabled = true;

    div.style.display = 'none';
    textarea.addEventListener("click", function() {hide_func(div);}, false);
    edit_button.addEventListener("click", function() {edit_func();}, false);
    save_button.addEventListener("click", function() {save_func();}, false);
    default_button.addEventListener("click", function() {default_func();}, false);
    document.body.insertBefore(div, document.body.firstChild);