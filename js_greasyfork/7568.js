// ==UserScript==
// @name          Hide Smilies area
// @author        Draconic
// @namespace     http://Vn-Sharing.net/
// @version       0.1
// @description   Làm ẩn khu vực hiện trước các emotion trong vnsharing, giảm việc Firefox ngốn CPU vì các emoticon hiện sẵn~ Viết lại từ Hide Objects User Script
// @include       http://vn-sharing.net/forum/newthread.php*
// @include       http://vn-sharing.net/forum/newreply.php*
// @downloadURL https://update.greasyfork.org/scripts/7568/Hide%20Smilies%20area.user.js
// @updateURL https://update.greasyfork.org/scripts/7568/Hide%20Smilies%20area.meta.js
// ==/UserScript==

(function() {


// Main Function Call //
hideTag('ul');

// The Guts //
function hideTag(tag, d) {
	d = (d && d.createElement) ? d : document;
	for (var a = d.getElementsByTagName(tag), i = 0, e, f, g, s; e = a[i]; ++i) {
		if (e.id=="vB_Editor_001_smiliebox"){
		if (e.style.display == 'none' || e.style.visibility == 'hidden' || (s = d.defaultView.getComputedStyle(e, '')).display == 'none' || s.visibility == 'hidden') {
			
				continue;
		}
		
		f = d.createElement('div');
		f.appendChild(e.parentNode.replaceChild(f, e));
		f.style.display = 'none';
		
		f = f.parentNode.insertBefore(d.createElement('div'), f);
		with (f.style) {
			backgroundColor =   'gray';
			color =             'white';
			outline =           '1px dashed invert';
			overflow =          'hidden';
			cursor =            'pointer';
			borderColor =       'transparent';
			position =          (s.position                  || 'static');
			cssFloat =          (s.cssFloat                  || 'none');
			clear =             (s.clear                     || 'none');
			display = (tag == 'object' ? 'block' : s.display || 'block');
			width =  (e.width  ? e.width + 'px'  : s.width   || 'auto');
			height = (e.height ? e.height + 'px' : s.height  || 'auto');
			top =               (s.top                       || 'auto');
			right =             (s.right                     || 'auto');
			bottom =            (s.bottom                    || 'auto');
			left =              (s.left                      || 'auto');
			marginTop =         (s.marginTop                 || '0');
			marginRight =       (s.marginRight               || '0');
			marginBottom =      (s.marginBottom              || '0');
			marginLeft =        (s.marginLeft                || '0');
			paddingTop =        (s.paddingTop                || '0');
			paddingRight =      (s.paddingRight              || '0');
			paddingBottom =     (s.paddingBottom             || '0');
			paddingLeft =       (s.paddingLeft               || '0');
			borderTopWidth =    (s.borderTopWidth            || '0');
			borderRightWidth =  (s.borderRightWidth          || '0');
			borderBottomWidth = (s.borderBottomWidth         || '0');
			borderLeftWidth =   (s.borderLeftWidth           || '0');
		}
		/*f.addEventListener('click', function () {
			this.parentNode.replaceChild(this.nextSibling.firstChild, this.nextSibling);
			this.parentNode.removeChild(this);
		}, true);*/
		f.innerHTML = 'Smilies đã được ẩn :D';
		}
	}
}
})();