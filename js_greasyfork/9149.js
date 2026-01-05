// ==UserScript==
// @name     webm to mpv opener
// @version     1.0.4
// @description     Changes 4chan (fileText.webm) urls to a localhost url. The local server opens mpv to play the video.         
// @namespace     https://greasyfork.org/users/3159
// @include     http*://boards.4chan*.org/*/*
// @downloadURL https://update.greasyfork.org/scripts/9149/webm%20to%20mpv%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/9149/webm%20to%20mpv%20opener.meta.js
// ==/UserScript==
a = document.getElementsByClassName('fileText');
for (i = 0; i < a.length; i++) {
	b = a[i].children[0];
	if (b.href.indexOf('.webm') > -1) {
		b.href = "http://127.0.0.1:4040?i=" + b;
		b.removeAttribute('target');
	}
}
/*
My mpv config text file (~/config/mpv/mpv.conf) has:
autofit-larger=100%x100%
loop=inf

Create a link to mpv:
sudo ln -s /Applications/mpv.app/Contents/MacOS/mpv /usr/bin/mpv

//mpv_server.py, on your computer somewhere

import os, subprocess, urllib.parse
import http.server, socketserver
server_address = 4040

class MyHandler(http.server.BaseHTTPRequestHandler):
		
	def do_GET(self):
		parsedParams = urllib.parse.urlparse(self.path)
		parsed_query = urllib.parse.parse_qs(parsedParams.query)
		url = parsed_query['i'][0]
		self.send_error(204)
		
		os.system('pkill mpv') #only one
		
		subprocess.Popen(
	    ['mpv','-no-audio',url], #disabled audio
            stdout=subprocess.PIPE
        )

Handler = MyHandler
httpd = socketserver.TCPServer(('', server_address), Handler)
print("serving at port ", server_address)
httpd.serve_forever()

//mpv_server_launcher.command, auto start | system preferences > users & groups > login items

#!/bin/bash
nohup python /Users/david/Dropbox/Documents/scripts/mpv_server.py >/dev/null 2>&1 &
osascript -e 'tell application "Terminal" to quit'

*/