function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function gebezeit() {
    d = new Date();
    h = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours());
    m = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
    s = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
    return h + ':' + m + ':' + s + '';
}

function microtime (get_as_float) {
  // http://kevin.vanzonneveld.net
  // +   original by: Paulo Freitas
  // *     example 1: timeStamp = microtime(true);
  // *     results 1: timeStamp > 1000000000 && timeStamp < 2000000000
  var now = new Date().getTime();
  var s = parseInt(now, 10);
  return s + '' + (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000);
}

function print_r(arr,level){
	var dumped_text = "";
	if(!level) level = 0;

	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";

	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];

			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += print_r(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
 
function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}
var keyStr = "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";

function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return unescape(output);
}

function statTime(s , id) // Counter by BonzenGame.com
{

	var statTime2 = document.getElementById(id);
	
	if(!document.all && !document.getElementById)
	{
		return;
	}
	var old_s = s;
	
var h = "00";
var m = "00";

	if(s>59)
	{
		m=Math.floor(s/60);
		s=s-m*60
	}
	if(m>59)
	{
		h=Math.floor(m/60);
		m=m-h*60
	}
	
	if(h == "00")
	{
		h = "";
	}
	
	if(h > 9)
	{
		h = h + ":";
	}else if(h > 0)
	{
		h = "0" + h + ":";
	}	

	if(m <= 9)
	{
		m = "0" + m;
	}
	
	if(m == 0)
	{
		m = "00";
	}

	if(s <= 9)
	{
		s = "0" + s;
	}


	statTime2.innerHTML = "<span id=\"" + id + "\">" + h + m +":"+ s + "</span>";
	
	
		myTimer = setTimeout(function(){statTime(old_s-1, id);},999 );


	
	if(old_s < 1)
	{
	clearInterval(myTimer);
	statTime2.innerHTML = "00:00";
	}
}