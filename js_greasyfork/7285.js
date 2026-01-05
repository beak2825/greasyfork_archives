// ==UserScript==
// @name           tuebl download helper
// @description    show download button on browsing page
// @match          http://tuebl.ca/browse/*
// @match          http://tuebl.ca/search?*
// @match          http://tuebl.ca/authors/*
// @match          http://tuebl.ca/series/*
// @version        0.3
// @author         arifhn
// @namespace https://greasyfork.org/users/2521
// @downloadURL https://update.greasyfork.org/scripts/7285/tuebl%20download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/7285/tuebl%20download%20helper.meta.js
// ==/UserScript==
/**
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 * 
 * 
 * Changelog:
 * ==========
 * 
 * 0.3
 * added support for /series
 *
 * 0.2
 * added support for /authors and /search page
 *
 * 0.1
 * beta version
 * 
 */
(function() {

	function getElement(q, root, single) {
		if (root && typeof root == 'string') {
			root = $(root, null, true);
			if (!root) {
				return null;
			}
		}
		root = root || document;
		if (q[0] == '#') {
			return root.getElementById(q.substr(1));
		} else if (q[0] == '/' || (q[0] == '.' && q[1] == '/')) {
			if (single) {
				return document.evaluate(q, root, null,
						XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			} else {
				var i, r = [], x = document.evaluate(q, root, null,
						XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
				while ((i = x.iterateNext()))
					r.push(i);
				return r;
			}
		} else if (q[0] == '.') {
			return root.getElementsByClassName(q.substr(1));
		}
		return root.getElementsByTagName(q);
	}
	
    var idPatt = /[^0-9]+([0-9]+)/i
    function extractId(str) {
        return str.replace(idPatt, "/books/$1/download");
    }
    
	// the Item
	function Item(el, num) {
        this.id = num;
        if(document.location.href.indexOf("/series/") > 0) {
            this.root = el.parentNode;
        }else {
            this.root = el.parentNode.parentNode;
        }
		
		this.setup = function() {
			//var original = this.parent.innerHTML;
            //this.parent.innerHTML = '<div class="col-3-4"></div><div class="col-1-4"></div>';
            //this.parent.childNodes[0].innerHTML = original;
            var test = getElement('.//div[contains(@id, "tag-tuebl-helper")]', this.root, true);
            var link = getElement('.//h2//a', this.root, true);
            if(!test && link) {
                var linkDownload = document.createElement("a");
                linkDownload.setAttribute("class", "btn btn-lg btn-success");
                linkDownload.setAttribute("href", extractId(link.getAttribute("href")));
                linkDownload.innerHTML = "Download";
                var btnDownload = document.createElement("div");
                btnDownload.id = 'tag-tuebl-helper-' + this.id;
                btnDownload.setAttribute("class", "col-1-4");
                btnDownload.appendChild(linkDownload);
                
                var left = getElement('.//div[contains(@class,"col-")]', this.root, true);
                if(left)
                    left.setAttribute("class", "col-3-4");
                
                this.root.appendChild(btnDownload);
            }
		};
	}

	// the Page
	var Page = {
			setup : function() {
                if(document.location.href.indexOf("/series/") > 0) {
                    var el = getElement('.//div[@class="row"]/h2[@class="book-title"]');
                }else {
                    var el = getElement('.//div[@class="row"]//div[contains(@class,"col-")]//h2');
                }
				for ( var i = 0; i < el.length; ++i) {
					var item = new Item(el[i], i);
					item.setup();
				}
			}
	};

	Page.setup();
})();