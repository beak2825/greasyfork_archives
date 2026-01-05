// ==UserScript==
// @name        Install Aur Package
// @description One-click install aur package.
// @namespace   org.jixun.auto.install
// @include     https://aur.archlinux.org/packages/*
// @version     1.0.0.2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/7402/Install%20Aur%20Package.user.js
// @updateURL https://update.greasyfork.org/scripts/7402/Install%20Aur%20Package.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded', function() {
	var ul = document.getElementById('actionlist').getElementsByTagName('ul');
	if (!ul) return ;

	ul = ul[0];

	var pkgName = ul.getElementsByTagName('a')[0].href.match(/packages\/..\/(.+?)\//)[1];
	var li = document.createElement('li');
	var link = document.createElement('a');
	li.appendChild(link);
	ul.insertBefore(li, ul.firstChild);

	link.textContent = 'Install Package';
	link.href = 'yaourt://' + pkgName ;
}, false);



// Files to add to system, change parameters when nessery. 


/** File: ~/.local/share/applications/yao.desktop
[Desktop Entry]
Name=yaourt auto install
Encoding=UTF-8
Version=1.0
Type=Application
Terminal=false
# Can be improved; don't know how.
Exec=xterm -T "AUR auto install" -e "pkgid=%u;pkgid=${pkgid:9};echo Press [ENTER] to begin install $pkgid;read;yaourt -S $pkgid;"
Categories=Application;
Comment=Download and install AUR package
MimeType=x-scheme-handler/yaourt;
 */


/** File: ~/.local/share/applications/mimeapps.list
[Added Associations]
x-scheme-handler/yaourt=yao.desktop
*/