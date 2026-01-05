// ==UserScript==
// @name           	JVC Prévisualiser
// @description     Prévisualisation des topics JVC grace à un petit bouton 
// @include        	http://www.jeuxvideo.com/forums/*
// @version		    1.0
// @namespace https://greasyfork.org/users/11572
// @downloadURL https://update.greasyfork.org/scripts/9990/JVC%20Pr%C3%A9visualiser.user.js
// @updateURL https://update.greasyfork.org/scripts/9990/JVC%20Pr%C3%A9visualiser.meta.js
// ==/UserScript==

(function() {

"use strict";
    
function ajax()
{
	var xhr = new XMLHttpRequest()
	xhr.open('get', this.url, true)
	var _this = this
	xhr.send()
	xhr.onreadystatechange = function() {		
		if(xhr.readyState == 4)
			_this.run(xhr.responseText)				
	}	
}

function Icon(node) 
{
	this.a = document.createElement('a')
	this.div = document.createElement('div')
	this.img = document.createElement('img')
	this.url = node.getElementsByTagName('a')[0].href
	this.text = ''
	this.initialize()
    node.getElementsByTagName('a')[0].setAttribute('style', 'float: left; max-width: 272px')
    node.setAttribute('style', 'text-align: left');
	node.appendChild(this.a)
}

Icon.prototype = {
	initialize: function()
	{
        this.a.setAttribute('class', 'prnode')
		this.div.setAttribute('class', 'conteneur-message prediv bloc-message-forum')
		this.img.src = 'http://s3.noelshack.com/uploads/images/12431829412728_topicpreview.png'
		this.img.alt = 'P'
		this.img.setAttribute('width', '80%')
		var _this = this
		this.img.addEventListener('mouseover', function()
		{
            _this.div.innerHTML = '<img  style="margin: auto; display: block" src="http://s3.noelshack.com/uploads/images/20188032684831_loading.gif" alt="Loading" width="35%" />'
			ajax.call(_this)
		},
		false)
		this.a.appendChild(this.img)
		this.a.appendChild(this.div)
	},
	run: function(data)
	{
        var prems = data
        //prems = prems.replace(/rel="nofollow" target="_blank"/gi,'')
        prems = prems.split(/<div class="bloc-message-forum " id="post_[0-9]*" data-id="[0-9]*">/)
        this.text = prems[1]
		this.div.innerHTML = this.text
        console.log(this.div.innerHTML)
    }
}

var script = 
	{
		run: function() {
            var nodes = document.evaluate("//*[@class='sujet-topic']", document, null, 7, null)
            for ( var i = 0 ; i < nodes.snapshotLength; i++ )               
				new Icon(nodes.snapshotItem(i))	
            this.addStyle('.prediv{position: absolute; z-index: 1000; width: 600px; max-height: 400px; overflow-y: scroll; display: none; margin-left: 18px; margin-top: -17px}'
                + '.prediv .txt-msg, .prediv .text-user {text-align: left; color: black; font-weight: normal; font-family: Arial}'
                + '.prediv .a {display: inline !important}'
				+ '.prediv .date {color: black}'
                + '.prnode {float: right !important}'
                + '.prnode:hover .prediv { display: block }'
                + '.prnode:hover > .prediv:hover .prediv { display: block }'
			)		
		},
		addStyle: function(css) { 
			var head = document.getElementsByTagName('head')[0]
			var node = document.createElement("style")
			node.setAttribute('type', 'text/css')
			node.appendChild(document.createTextNode(css))
			head.appendChild(node)
		}
	}

	script.run()
	
})()