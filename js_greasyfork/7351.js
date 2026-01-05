// ==UserScript==
// @name         Visible Audio
// @version      0.1
// @description  Realtime Audio Visualizations for moe.fm
// @author       woozy
// @homepage     http://woozy.im/
// @match        http://moe.fm/listen/h5*
// @grant        none
// @namespace https://greasyfork.org/users/8206
// @downloadURL https://update.greasyfork.org/scripts/7351/Visible%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/7351/Visible%20Audio.meta.js
// ==/UserScript==

var raf;
var canvas = document.createElement('canvas');
var cctx = canvas.getContext('2d');
canvas.width = 720;
canvas.height = 96;
var pls = document.getElementById('promotion_ls');
pls.style.textAlign = 'center';
pls.innerHTML = '';
pls.appendChild(canvas);

var actx = new AudioContext();
var analyser = actx.createAnalyser();
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.connect(actx.destination);
analyser.getByteFrequencyData(dataArray);

var prev = undefined;
function check() {
  requestAnimationFrame(check);
  if (prev != sm2sound._a) {
    prev = sm2sound._a;
    window.cancelAnimationFrame(raf);
    begin();
  }
}
check();

function begin() {
  var audio = sm2sound._a;
  var source = actx.createMediaElementSource(audio);
  source.connect(analyser);
  function draw() {
    raf = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    cctx.lineWidth = 2;
    cctx.strokeStyle = 'rgb(0, 0, 0)';
    cctx.beginPath();
    var sliceWidth = canvas.width * 1.0 / bufferLength;
    for(var x = 0, i = 0; i < bufferLength; i++) {
      var y = (1 - dataArray[i] / 256.0) * canvas.height;
      (i === 0) ?  cctx.moveTo(x, y) : cctx.lineTo(x, y);
      x += sliceWidth;
    }
    cctx.stroke();
    cctx.closePath();
  }
  draw();
}
