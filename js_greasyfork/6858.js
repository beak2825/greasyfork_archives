// ==UserScript==
// @name         iRacing Session Manager
// @namespace    http://www.math.kit.edu/ianm2/~maier
// @version      0.1
// @description  Save and load session (testing/hosted) settings on www.iRacing.com
// @author       Markus Maier
// @match        http://members.iracing.com/membersite/member/*
// @grant    GM_getValue
// @grant    GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/6858/iRacing%20Session%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/6858/iRacing%20Session%20Manager.meta.js
// ==/UserScript==

var params = {
    timeout: 2500,
    switchToWeather: false,
};

var sessions;
init();

function init()
{
    // First UI
	UI_addElements();   
    UI_css();
    
    // Get saved sessions from GM 
    var sessions_JSON = GM_getValue('sessions');
    if(sessions_JSON === undefined)
        sessions = new Object();
    else
        sessions = JSON.parse(sessions_JSON);


    //and finally refresh list
    UI_refreshSessions();
}



function saveSession() {
    var sessionName = document.getElementById('mm_ism_savesessionname').value;
    if(sessions.hasOwnProperty(sessionName))
    {
    	var r = confirm("Are you sure you want to overwrite session \"" + sessionName + "\"?");
    	if (!r) return; 
    }
    var new_session = {
        name: sessionName,
        car: parseInt(document.getElementById('carSelectorDropdown').value), 
        track: {
        	id: parseInt(document.getElementById('trackSelectorDropdown').value), 
            config: parseInt(document.getElementById('configSelectorDropdown').value),
            night: ( (document.getElementById('testingpanel_nightMode') === undefined) ? 0 : document.getElementById('testingpanel_nightMode').checked),
        },
        weather: {
        	temp: parseInt(document.getElementById('weatherTestWeatherTemp').value), 
            tempUnit: parseInt(document.getElementById('weatherTestweatherTempChoice').value),
            humidity: parseInt(document.getElementById('testHumiditySliderValue').value), 
            fog: parseInt(document.getElementById('testingFog').value),
            windSpeed: parseInt(document.getElementById('weatherTestweatherWindSpeed').value), 
            windSpeedUnit: parseInt(document.getElementById('weatherTestweatherWindSpeedChoice').value), 
            windDirection: parseInt(document.getElementById('weatherTestweatherWindDirection').value), 
            cloudCover: parseInt(document.getElementById('testCloudCover').value), 
			random: document.getElementById('testRandomWeather').checked,             
        },
	};
    sessions[sessionName] = new_session;
    // save it
    GM_setValue('sessions', JSON.stringify(sessions));
    
    // finally refresh UI
    UI_refreshSessions();
    document.getElementById('mm_ism_sessionlist').value = sessionName;
}

function removeSession() {
    var name = document.getElementById('mm_ism_sessionlist').value;
    
    var r = confirm("Are you sure you want to delete session \"" + name + "\"?");
    if (!r) return;
    
    delete sessions[name];
    
    // save it for after refresh
    GM_setValue('sessions', JSON.stringify(sessions));
    
    //refresh UI
    UI_refreshSessions();
}

function loadSession() {    
    document.getElementById('mm_ism_info').style.display = 'block';
    
    var name = document.getElementById('mm_ism_sessionlist').value;
    
    document.getElementById('mm_ism_savesessionname').value = name;
    
	var session = sessions[name];
    
    // ONLY ADJUST INPUT VALUES
    //car
    document.getElementById('carSelectorDropdown').value = session.car;
    dispEvent(document.getElementById('carSelectorDropdown'),'HTMLEvents','change');
    //track
    document.getElementById('trackSelectorDropdown').value = session.track.id;
    dispEvent(document.getElementById('trackSelectorDropdown'),'HTMLEvents','change');
    document.getElementById('configSelectorDropdown').value = session.track.config;
    dispEvent(document.getElementById('configSelectorDropdown'),'HTMLEvents','change');
    
    window.setTimeout(loadSession_part2,params.timeout);
}

function loadSession_part2() {
    var name = document.getElementById('mm_ism_sessionlist').value;
	var session = sessions[name];
    
    if(params.switchToWeather)
        dispEvent(document.getElementById('weatherTestToggle'),'MouseEvent','click');
    
    //Night Mode
    document.getElementById('testingpanel_nightMode').checked = session.track.night;
    //weather
    
    //temp
    document.getElementById('weatherTestweatherTempChoice').value = session.weather.tempUnit
    document.getElementById('weatherTestWeatherTemp').value = session.weather.temp;
    var minTemp, maxTemp, numTemp;
    var tempSliderVal;
    if(session.weather.tempUnit == 0){ //Celcius
		minTemp = 65.0;
        maxTemp = 90.0;
    }
    if(session.weather.tempUnit == 1) { //Fahrenheit
    	minTemp = 18.0;
        maxTemp = 32.0;
    }
    numTemp = session.weather.temp;
    tempSliderVal = (100.0/(maxTemp-minTemp))*(numTemp-minTemp);
    document.getElementById('testTempSlider').childNodes[0].style.height = tempSliderVal.toString() + "%";
    document.getElementById('testTempSlider').childNodes[1].style.bottom = tempSliderVal.toString() + "%";
    

    //humidity
    document.getElementById('testHumiditySliderValue').value = session.weather.humidity;
    document.getElementById('testingFog').value = session.weather.fog;
    document.getElementById('testHumiditySliderValue').value = session.weather.humidity;
    document.getElementById('testingFog').value = session.weather.fog;
    sliderVal = 0.5*(session.weather.humidity + session.weather.fog);
    document.getElementById('testHumiditySlider').childNodes[0].style.height = sliderVal.toString() + "%";
    document.getElementById('testHumiditySlider').childNodes[1].style.bottom = sliderVal.toString() + "%";
    var fog = session.weather.fog;
    var testFogWarning = document.getElementById('testFogWarning');
    var testFogValue = document.getElementById('testFogValue');
    if(fog > 0) {
        testFogValue.style.display = "block";
        testFogValue.innerHTML = "Fog: " + fog + "%";
    } else {
    	testFogValue.style.display = "none";  
    }
    
    if(fog <= 25) {
        testFogWarning.className  = 'testwarning';
        testFogWarning.title = '';
    } else if(26 <= fog && fog <= 39) {
        testFogWarning.className  = 'testwarning low';
        testFogWarning.title = 'You have selected a fog level that may be dangerous to drive in.';
    } else {
        testFogWarning.className  = 'testwarning high';
        testFogWarning.title = 'You have selected a level of fog that highly impairs vision. Use with caution!';
    };
    
    //Wind speed
    
    //workaround to fix iracing hpp
    document.getElementById('weatherTestweatherWindSpeedChoice').value = 0;
    dispEvent(document.getElementById('weatherTestweatherWindSpeedChoice'),'HTMLEvents','change');
	document.getElementById('weatherTestweatherWindSpeedChoice').value = 1;
    dispEvent(document.getElementById('weatherTestweatherWindSpeedChoice'),'HTMLEvents','change');

    document.getElementById('weatherTestweatherWindSpeedChoice').value = session.weather.windSpeedUnit;
    dispEvent(document.getElementById('weatherTestweatherWindSpeedChoice'),'HTMLEvents','change');
    document.getElementById('weatherTestweatherWindSpeed').value = session.weather.windSpeed;

    var maxWSpeed, numWSpeed;
    var windSliderVal;
    if(session.weather.windSpeedUnit== 0) //mph
		maxWSpeed = 30;
    else //kph
    	maxWSpeed = 48;
    numWSpeed =  session.weather.windSpeed;
    windSliderVal = (100.0/maxWSpeed)*numWSpeed;
    document.getElementById('testWindSlider').childNodes[0].style.height = windSliderVal.toString() + "%";
    document.getElementById('testWindSlider').childNodes[1].style.bottom = windSliderVal.toString() + "%";   
    
    
    //winddir and cloudcover
    document.getElementById('weatherTestweatherWindDirection').value = session.weather.windDirection;
    document.getElementById('testCloudCover').value = session.weather.cloudCover;
    
    //random weather
    if(document.getElementById('testRandomWeather').checked != session.weather.random)
    	dispEvent(document.getElementById('testRandomWeather'),'MouseEvent','click');
    
    document.getElementById('mm_ism_info').style.display = 'none';
}


function dispEvent(elem,evType1,evType2) {
    var event = document.createEvent(evType1);
    event.initEvent(evType2, true, true ); 
    elem.dispatchEvent(event);
}



function UI_showFrame() {
    document.getElementById('mm_ism_mainframe').style.display = "block";
}

function UI_hideFrame() {
    document.getElementById('mm_ism_mainframe').style.display = "none";
}

function UI_refreshSessions() {   
    //First, remove all entries
    var sessionList = document.getElementById('mm_ism_sessionlist');
    while (sessionList.firstChild) {
    	sessionList.removeChild(sessionList.firstChild);
	}
    //Then add new ones
    for(var name in sessions) {
    	var new_li = document.createElement('option');
    	new_li.appendChild(document.createTextNode(name));
    	new_li.value = name;
        sessionList.appendChild(new_li);
    }
}

function UI_addElements() {
    //create Elements
    var testingpanel_testcar_button = document.getElementById('green_racepanel_btn');
    var mm_ism_mainbutton = testingpanel_testcar_button.cloneNode(true);
    mm_ism_mainbutton.id ="mainbutton";
    mm_ism_mainbutton.firstElementChild.innerHTML='Manage Sessions';
    mm_ism_mainbutton.addEventListener('click',UI_showFrame,false);
    
    var mainframe = document.createElement('div');
    mainframe.id = "mm_ism_mainframe";
    
    mainframe.innerHTML = "" + 
        "<div>"+
        	"<a id=\"mm_ism_closebutton\">[Close]</a>"+
        "</div>"+
        "<div>"+
        "Save:<br/>"+
        	"<input id=\"mm_ism_savesessionname\" />"+
        	"<input id=\"mm_ism_savesessionbutton\" type=\"button\" value=\"Save\" />"+
        "</div>"+
        "<div>"+
        "Load:<br/>"+	
        	"<select id=\"mm_ism_sessionlist\">"+
        	"</select>"+
        	"<input id=\"mm_ism_loadsessionbutton\" type=\"button\" value=\"Load\" />"+
        	"<input id=\"mm_ism_deletesessionbutton\" type=\"button\" value=\"X\" />"+
        "</div>"+
        "<div id=\"mm_ism_info\">Loading session...</div>";
    
    var testingpanel_session = document.getElementById('testingpanel_session').parentNode;
 	testingpanel_session.appendChild(mm_ism_mainbutton);
    testingpanel_session.insertBefore(mainframe, testingpanel_session.firstChild);
    
    document.getElementById('mm_ism_closebutton').addEventListener('click',UI_hideFrame,false);
    document.getElementById('mm_ism_savesessionbutton').addEventListener('click',saveSession,false);
    document.getElementById('mm_ism_loadsessionbutton').addEventListener('click',loadSession,false);
    document.getElementById('mm_ism_deletesessionbutton').addEventListener('click',removeSession,false);
}

function UI_css() {
    css_string = "" +
        "#mm_ism_mainframe {" +
        "	display:none;"+
        "	position:relative;"+
        "	margin:0px 0px 50px 0px;"+
        "	padding:5px;"+
        "	height:125px;"+
        "	border: 1px solid black;"+
        "	background-color:white" +
        "}"+
        "#mm_ism_info {"+
        "	display:none"+
        "}";
    
    var css = document.createElement("style");
    css.type = "text/css";
	css.innerHTML = css_string;
	document.body.appendChild(css);
}





