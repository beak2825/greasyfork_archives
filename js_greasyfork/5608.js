// ==UserScript==
// @name       Youtube visualiser
// @namespace  http://use.i.E.your.homepage/
// @version    0.1001
// @description  enter something useful
// @match      http://youtube.com/watch*
// @copyright  2014+, Charlton Rodda
// @downloadURL https://update.greasyfork.org/scripts/5608/Youtube%20visualiser.user.js
// @updateURL https://update.greasyfork.org/scripts/5608/Youtube%20visualiser.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main() {
    var context = new AudioContext();
    var audioElement = document.getElementById('audio');
    //var source = context.createMediaElementSource(audioElement);
    var source = context.createMediaElementSource($('.html5-main-video'));
    var analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);
    analyser.connect(context.destination);
    
    var bars = [];
    for (i=0; i<32; i++) {
        var bar = $('<div class="bar">' + i + '</div>');
        $('#spectrum').append(bar);
        bars.push(bar);
    }
    
    var spectrum = new Float32Array(32);
    
    function update() {
        analyser.getFloatFrequencyData(spectrum);
        
        for (i=0; i<32; i++) {
            bars[i].width(
                (spectrum[i] - analyser.minDecibels) /
                (analyser.maxDecibels - analyser.minDecibels) *
                1000
            );
        }
        
        setTimeout(update, 1000 / 60);
    }
    
    update();
}

addJQuery(main);