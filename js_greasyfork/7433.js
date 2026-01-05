// ==UserScript==
// @name         AS InfoTooltip
// @namespace    http://mx03.de/asInfoTooltip
// @version      0.2
// @description  Zeigt Tooltips zu Anime Einträgen in dem AS Forum an.
// @author       mx03
// @match        http://de.anisearch.com/forum/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7433/AS%20InfoTooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/7433/AS%20InfoTooltip.meta.js
// ==/UserScript==
window.toolipData = {};

var aList = document.querySelectorAll('article a');

var r = {
	url: /anime\/[0-9]*,.+/,
	title: /<title>(.*)<\/title>/,
	cover: /<img itemprop="image" src="(.*)" alt="(.*)" class="img">/,
	desc: /<div itemprop="description" lang="de" id="desc-de" class="(?:.*?)">(.*?)<\/div>/m
};

var tooltip = document.createElement("div");
tooltip.id = "addTT";
tooltip.style.cssText = "display:none; width: 400px; height: 100px; position:absolute; z-index: 999;";
tooltip.className = "cbox cbox2";

var imageEl = document.createElement("img");
imageEl.style.height = "100%";
tooltip.appendChild(imageEl);

var rightEl = document.createElement("div");
rightEl.style.cssText = "margin-left: 5px; flex: 1; overflow: hidden;";

var titleEl = document.createElement("h2");
titleEl.style.fontSize = "12px";
rightEl.appendChild(titleEl);

var descEl = document.createElement("div");
descEl.style.fontSize = "12px";
rightEl.appendChild(descEl);

tooltip.appendChild(rightEl);
document.body.appendChild(tooltip);

for(var i=0; i < aList.length; i++)
{
	var item = aList[i];
	if(item.attributes.href && item.attributes.href.value.match(r.url))
	{
        item.style.paddingLeft = "18px";
        item.style.background = "url(http://cdn.anisearch.com/favicon.ico) left top no-repeat";
		item.addEventListener("mouseover", function(e) {
			var me = this;
			var href = me.attributes.href.value;

			tooltip.style.display = "flex";
			tooltip.style.top = e.pageY+"px";
			tooltip.style.left = e.pageX+"px";
			
			var data;
			if(window.toolipData[href])
			{
				var data = window.toolipData[href];
				titleEl.textContent = data['title'];
				imageEl.src = data['imageUrl'];
				descEl.innerHTML = data['desc'];
			}
			else
			{
				var xhr = new XMLHttpRequest();
				xhr.addEventListener("readystatechange", function() {
					if(this.readyState == 4 && this.status == 200) {
						var mTitle = r.title.exec(this.responseText);
						var mImage = r.cover.exec(this.responseText);
						var mDesc = r.desc.exec(this.responseText);
						
						window.toolipData[href] = {
							title: (mTitle) ? mTitle[1] : '',
							imageUrl: (mImage) ? mImage[1] : '',
							desc: (mDesc) ? mDesc[1] : ''
						};
						var data = window.toolipData[href];
						titleEl.textContent = data['title'];
						imageEl.src = data['imageUrl'];
						descEl.innerHTML = data['desc'];

					}
				});
				xhr.open("GET", href);
				xhr.send();
			}
		});

		item.addEventListener("mouseout", function(e) {
			tooltip.style.display = "none";
			titleEl.textContent = '';
			imageEl.src = '';
			descEl.innerHTML = '';
		});
	}
}
