// ==UserScript==
// @name			AutoEmbedLinks
// @namespace		cloaknsmoke
// @description 	Automatically inlines links to images or video depending on the link. Original version by citizenray. Auto version by pendevin.
// @include			http://boards.endoftheinter.net/showmessages.php*
// @include			http://archives.endoftheinter.net/showmessages.php*
// @include			https://boards.endoftheinter.net/showmessages.php*
// @include			https://archives.endoftheinter.net/showmessages.php*
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_registerMenuCommand
// @version			30
// @downloadURL https://update.greasyfork.org/scripts/6792/AutoEmbedLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/6792/AutoEmbedLinks.meta.js
// ==/UserScript==

//if you are using native Chrome you don't have the GM commands
var GM = true;
if(!(GM_getValue || GM_setValue || GM_registerMenuCommand))
	GM = false;
//Menu command to allow autoembed of nws images in all topics
if(GM)
{
	var showNWS = GM_getValue('ShowNWS');
	if (showNWS == undefined)
	{
		showNWS = false;
		GM_setValue('ShowNWS', false);
	}
	GM_registerMenuCommand('AutoEmbed Images Preferences', function ()
	{
		showNWS = confirm('Select Ok to allow NWS images to be displayed in non-marked topics. Cancel otherwise. Default is to not show them.');
		GM_setValue('ShowNWS', showNWS);
	});
}

//respect user security preferences
var htt = '';
if (document.location.href.indexOf('https://') == 0)
	htt = 'https://';
else
	htt = 'http://';
var eyed = 0;
lastMessage = document.URL
if(lastMessage.indexOf("#m") != -1)
	lastMessage = lastMessage.substring(lastMessage.indexOf('#m'))
else
	lastMessage = undefined
//listen for imgur to contact us because we can't see what is in the stuff they are embedding.
tuples = []
var refocus = true
window.addEventListener("message", function(message)
{
	var iframes = document.getElementsByTagName("iframe")
	var data = JSON.parse(message.data)
	var remove = undefined
	for(var x in iframes)
	{
		if(iframes[x] != undefined && iframes[x].src == data.href)
		{
			var id = iframes[x].src.substring(iframes[x].src.indexOf(".com") + 5, iframes[x].src.indexOf("/embed"))
			if(data.message == "404_imgur_embed")
			{
				for(var y in tuples)
				{
					if(tuples[y].album.id == id)
					{
						tuples[y].album.checked = true
						tuples[y].album.remove = true
						remove = iframes[x]
					} else if(tuples[y].image.id == id)
					{
						tuples[y].image.checked = true
						tuples[y].image.remove = true
						remove = iframes[x]
					}
				}
			}
			else
			{
				if(iframes[x].nextSibling.id == id)
				{
					remove = iframes[x].nextSibling
				}
				iframes[x].style.height = data.height + "px"
				iframes[x].style.width  = data.width + "px"
				iframes[x].style.marginBottom = "0px"
				iframes[x].style.marginTop = "0px"
				for(var y in tuples)
				{
					if(tuples[y].image.id == id)
					{
						if(tuples[y].album.checked && !tuples[y].album.remove)
						{
							tuples[y].image.checked = true
							tuples[y].image.remove = true
							remove = iframes[x]
						} else if(tuples[y].album.checked)
						{
							tuples[y].image.checked = true
							tuples[y].image.remove = false
						} else
						{
							tuples[y].image.checked = true
							tuples[y].image.remove = false
							for(var z in iframes)
							{
								if(iframes[z].src != undefined)
								{
									var id2 = iframes[z].src.substring(iframes[z].src.indexOf(".com") + 5, iframes[z].src.indexOf("/embed"))
									if(id2 == tuples[y].album.id)
									{
										iframes[z].style.position = "absolute"
										iframes[z].style.left = "-1000px"
										iframes[z].style.top = "-1000px"
									}
								}
							}
						}
					} else if(tuples[y].album.id == id)
					{
						if(iframes[x].style.position == "absolute")
						{
							iframes[x].style.position = ""
							iframes[x].style.left = ""
							iframes[x].style.top = ""
						}
						tuples[y].album.checked = true
						tuples[y].album.remove = false
						for(var z in iframes)
						{
							if(iframes[z].src != undefined)
							{
								var id2 = iframes[z].src.substring(iframes[z].src.indexOf(".com") + 5, iframes[z].src.indexOf("/embed"))
								if(id2 == tuples[y].image.id)
								{
									remove = iframes[z]
								}
							}
						}
					}
				}
				if(lastMessage != undefined && refocus)
					location.href = lastMessage
			}
		}
	}
	if(remove != undefined)
	{
		remove.parentNode.removeChild(remove)
	}
})
function change_images(as)
{
	var quoted = false
	if(inAQuote(as))
		quoted = true
	var source = as.href;
	//if it's an imgur gallery or non-direct linked imgur image/video
	if(source.indexOf("imgur") != -1 && source.substring(source.lastIndexOf("/")+1).indexOf(".") == -1)
	{
		if(quoted)
			return
		as.innerHTML = "Click to Embed"
		as.addEventListener("click", function(e)
		{
			e.preventDefault()
			var elem = e.currentTarget
			var source = elem.href
			var imgScript = document.createElement("SCRIPT"), imgScript2 = document.createElement("SCRIPT")
			imgScript.setAttribute("async", "true")
			imgScript.src = "//s.imgur.com/min/embed.js"
			imgScript.setAttribute("charset", "utf-8");
			imgScript2.setAttribute("async", "true")
			imgScript2.src = "//s.imgur.com/min/embed.js"
			imgScript2.setAttribute("charset", "utf-8");
			document.getElementsByTagName('script')[0].parentNode.insertBefore(imgScript, document.getElementsByTagName('script')[0])
			var imgSource = source.substring(source.lastIndexOf("/")+1)
			if(imgSource.indexOf("#") != -1)
				imgSource = imgSource.substring(0,imgSource.indexOf("#"));
			if(imgSource.indexOf("?gallery") != -1)
				imgSource = imgSource.substring(0,imgSource.indexOf("?"));
			var image = document.createElement("blockquote"), image2 = document.createElement("blockquote")
			image.setAttribute("class", "imgur-embed-pub")
			image.setAttribute("lang", "en")
			image.setAttribute("data-context", "false")
			image.setAttribute("data-id", "a/" + imgSource)
			elem.parentNode.insertBefore(image, elem)
			image2.setAttribute("class", "imgur-embed-pub")
			image2.setAttribute("lang", "en")
			image2.setAttribute("data-context", "false")
			image2.setAttribute("data-id", imgSource)
			document.getElementsByTagName('script')[0].parentNode.insertBefore(imgScript2, document.getElementsByTagName('script')[0])
			elem.parentNode.insertBefore(image2, elem)
			tuples.push({"album" : {"id" : "a/" + imgSource, "checked" : false}, "image" : {"id" : imgSource, "checked" : false}})
			elem.setAttribute("hidden", "hidden")
			refocus = false
		})
		
		return
	}
	
	if(source.indexOf("webmshare") != -1)
	{
		if(quoted)
			return
		if(source.indexOf(".webm" != -1))
			ident = source.slice(source.lastIndexOf("/") + 1, -5)
		else
			ident = source.substring(source.lastIndexOf("/") + 1)
		
		var image = document.createElement("iframe")
		image.setAttribute("src", htt + "webmshare.com/play/" + ident)
		image.setAttribute("width", "1280")
		image.setAttribute("height", "720")
		as.parentNode.insertBefore(image, as)
		as.setAttribute("hidden", "hidden")
		return
	}
	//gifv is just webm
	if(source.indexOf(".gifv") != -1)
		source = source.replace(".gifv", ".webm");
	//gfycat has special controls that I could let them handle creating. 
	//There is an api for it, but I like the regular HTML5 video embed more.
	if (source.indexOf('gfycat.com') != -1 && source.indexOf('webm') == - 1 && source.indexOf('mp4') == - 1)
	{
		var ident = source.substring(source.lastIndexOf('/') + 1)
		if (ident.indexOf('.') != - 1)
			ident = ident.substring(0, ident.indexOf('.'));
		var url = htt + 'gfycat.com/cajax/get/' + ident;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function ()
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
			{
				var text = JSON.parse(xmlhttp.responseText);
				as.href = text.gfyItem.webmUrl;
				gfycat = true;
				change_images(as);
			}
		}
		xmlhttp.open('GET', url, true);
		xmlhttp.send();
		//This is the other way. It's much simpler
		/*var image = document.createElement("img");
		image.className = "gfyitem";
		image.setAttribute("data-id", source.substring(source.lastIndexOf("/")+1));
		image.setAttribute("data-perimeter", true);
		as.parentNode.insertBefore(image, as);
		as.parentNode.removeChild(as);*/
		return;
	}
	
	//for directly linked files
	var dots = source.split('.');
	switch (dots[dots.length - 1].toLowerCase())
	{
	case 'jpg':
	case 'gif':
	case 'png':
	case 'bmp':
	case 'jpeg':
		eyed++;
		var image = document.createElement('img');
		image.className = 'auto-loaded-image';
		image.id = 'loader_' + eyed;
		image.setAttribute('src', source);
		image.setAttribute('alt', '[' + source + ']');
		image.setAttribute('border', 0);
		as.innerHTML = '';
		as.appendChild(image);
		if(quoted)
		{
			if(dots[dots.length - 1].toLowerCase() == 'gif')
			{
				var canvas = document.createElement("canvas")
				as.appendChild(canvas)
				image.addEventListener("load", function(e)
				{
					var image = this
					var canvas = image.nextSibling
					if(image.naturalHeight > image.naturalWidth)
					{
						canvas.setAttribute('height', 150)
						canvas.setAttribute('width', Math.floor(image.naturalWidth*(150/image.naturalHeight)))
						canvas.getContext('2d').drawImage(image,0,0, Math.floor(image.naturalWidth*(150/image.naturalHeight)), 150)
					}
					else
					{
						canvas.setAttribute('height', Math.floor(image.naturalHeight*(150/image.naturalWidth)))
						canvas.setAttribute('width', 150)
						canvas.getContext('2d').drawImage(image,0,0, 150, Math.floor(image.naturalHeight*(150/image.naturalWidth)))
					}
				})
				as.addEventListener('click', function(e)
				{
					e.preventDefault()
					var canvas = this.lastChild
					var image = this.firstChild
					if(image.getAttribute('hidden') == 'hidden')
					{
						image.removeAttribute('hidden')
						canvas.setAttribute('hidden', 'hidden')
					} else
					{
						canvas.removeAttribute('hidden')
						image.setAttribute('hidden', 'hidden')
					}
				})
				image.setAttribute("hidden", 'hidden')
			} else
			{
				if(image.naturalHeight > image.naturalWidth)
				{
					image.setAttribute('height', 150)
					image.setAttribute('width', Math.floor(image.naturalWidth*(150/image.naturalHeight)))
				} else
				{
					image.setAttribute('width', 150)
					image.setAttribute('height', Math.floor(image.naturalHeight*(150/image.naturalWidth)))
				}
				image.addEventListener("click", function(e)
				{
					e.preventDefault()
					if(this.height == 150 || this.width == 150)
					{
						this.height = this.naturalHeight
						this.width = this.naturalWidth
					} else 
						if(this.naturalHeight > this.naturalWidth)
						{
							this.setAttribute('height', 150)
							this.setAttribute('width', Math.floor(this.naturalWidth*(150/this.naturalHeight)))
						} else
						{
							this.setAttribute('width', 150)
							this.setAttribute('height', Math.floor(this.naturalHeight*(150/this.naturalWidth)))
						}
				})
			}
		}
		break;
	//for videos and also ogg music files
	//the videos are not preloaded or autoplay or anything like that.
	//this will keep shitty browsers and browsers on shitty computers
	//from crashing the moment they try to load and play 50 videos all at once
	case 'webm':
	case 'ogg':
	case 'mp4':
		eyed++;
		if (source.indexOf('gfycat') != - 1)
			as.href = as.innerHTML;
		as.setAttribute('hidden', 'hidden');
		var video = document.createElement('video');
		video.className = 'auto-loaded-video';
		video.id = 'loader_' + eyed;
		video.setAttribute('controls', 'controls');
		video.setAttribute('loop', 'loop');
		//video.setAttribute('src', source);
		//video.setAttribute('alt', '[' + source + ']');
		video.setAttribute('preload', 'none');
		var v_source1 = document.createElement("source")
		var v_source2 = document.createElement("source")
		if(dots[dots.length - 1].toLowerCase() == 'webm')
		{
			v_source1.setAttribute("type", "video/webm")
			v_source1.setAttribute("src", source)
			v_source2.setAttribute("type", "video/mp4")
			v_source2.setAttribute("src", source.replace(".webm", ".mp4"))
		} else if(dots[dots.length - 1].toLowerCase() == 'mp4')
		{
			v_source1.setAttribute("type", "video/mp4")
			v_source1.setAttribute("src", source)
			v_source2.setAttribute("type", "video/webm")
			v_source2.setAttribute("src", source.replace(".mp4", ".webm"))
		} else
		{
			v_source1.setAttribute("type", "video/ogg")
			v_source1.setAttribute("src", source)
		}
		video.appendChild(v_source1)
		if(v_source2.hasAttribute("type"))
			video.appendChild(v_source2)
		if(quoted)
		{
			video.removeAttribute('preload')
			as.parentNode.insertBefore(video, as);
			var canvas = document.createElement('canvas')
			as.parentNode.insertBefore(canvas, as);
			video.addEventListener("loadeddata", function(e)
			{
				var video = this
				var canvas = this.nextSibling
				if(video.clientHeight > video.clientWidth)
				{
					canvas.setAttribute('height', 150)
					canvas.setAttribute('width', Math.floor(video.clientWidth*(150/video.clientHeight)))
					canvas.getContext('2d').drawImage(video,0,0, Math.floor(video.clientWidth*(150/video.clientHeight)), 150)
				}
				else
				{
					canvas.setAttribute('height', Math.floor(video.clientHeight*(150/video.clientWidth)))
					canvas.setAttribute('width', 150)
					canvas.getContext('2d').drawImage(video,0,0, 150, Math.floor(video.clientHeight*(150/video.clientWidth)))
				}
				video.setAttribute('hidden', 'hidden')
			})
			var flip = function(e)
			{
				e.preventDefault()
				if(this instanceof HTMLCanvasElement)
				{
					var canvas = this
					var image = this.previousSibling
				} else
				{
					var canvas = this.nextSibling
					var image = this
				}
				if(image.getAttribute('hidden') == 'hidden')
				{
					image.removeAttribute('hidden')
					image.play()
					canvas.setAttribute('hidden', 'hidden')
				} else
				{
					canvas.removeAttribute('hidden')
					image.setAttribute('hidden', 'hidden')
					image.pause()
				}
			}
			video.addEventListener('click', flip)
			canvas.addEventListener('click', flip)
		} else
			as.parentNode.insertBefore(video, as);
		break;
	default:
		break;
	}
}

function inAQuote(element)
{
	if(element.parentNode == undefined)
	{
		alert("Something has gone wrong.")
		return
	}
	if(element.className == "message")
		return false
	else if(element.className == "quoted-message")
		return true
	else
		return inAQuote(element.parentNode)
}
//not using the gfycat api
/*(function (d, t)
{
	var g = d.createElement(t),
	s = d.getElementsByTagName(t) [0];
	g.src = 'http://assets.gfycat.com/js/gfyajax-0.517d.js';
	s.parentNode.insertBefore(g, s);
}(document, 'script'));*/

//we don't want to embed pictures in sigs because it's disruptive and who cares
function nosig(post)
{
	var look = document.createElement('lol');
	look.innerHTML = post;
	if (look.innerHTML.lastIndexOf('---<br>') > 0)
		look.innerHTML = look.innerHTML.substring(0, look.innerHTML.lastIndexOf('---<br>'));
	var a2 = look.getElementsByTagName('a');
	//return how many images are in the post excluding any in the sig
	return a2.length;
}
var post = document.getElementsByClassName('message');
//if a topic is marked NWS, embed everything regardless of preferences
var tags = document.getElementsByTagName('h2') [0].getElementsByTagName('a');
var NWSTopic = false;
for (var j = 0; j < tags.length; j++)
{
	if (tags[j].innerHTML.indexOf('NWS') >= 0 || tags[j].innerHTML.indexOf('NLS') >= 0)
		NWSTopic = true;
}
var callsList = [];
for (var j = 0; j < post.length; j++)
{
	if(!GM && !NWSTopic && post[j].innerHTML.toUpperCase().indexOf('NWS') != -1)
		continue;
	if (GM && !NWSTopic && post[j].innerHTML.toUpperCase().indexOf('NWS') != -1 && !showNWS)
		continue;
	var long = nosig(post[j].innerHTML);
	var as = post[j].getElementsByTagName('a');
	for (var i = 0; i < long; i++)
		if (as[i].className == 'l')
			callsList[callsList.length] = as[i];
}
//this is necessary because otherwise we would be manipulating 
//elements as we go and things would get fucked up in the loop
callsList.forEach(change_images);

//recenter page to the last message if there is one after 
//we make all the video tags
if(lastMessage != undefined)
	location.href = lastMessage

//support livelinks
var mut = new MutationObserver(function(a)
{
	a.forEach(function(val, i)
	{
		if(val.addedNodes.length == 1 && !(val.addedNodes[0].tagName === undefined) && val.addedNodes[0].tagName == "DIV")
		{
			var callsList = [];
			var post = val.addedNodes[0].getElementsByClassName("message")[0];
			if (!NWSTopic && post.innerHTML.toUpperCase().indexOf('NWS') != -1 && !showNWS)
				return;
			var long = nosig(post.innerHTML);
			var as = post.getElementsByTagName('a');
			for (var i = 0; i < long; i++)
				if (as[i].className == 'l')
					callsList[callsList.length] = as[i];
			callsList.forEach(change_images);
		}
	});
})
var config = { childList: true, subtree: true };
var divs = document.getElementsByTagName("div")
for(var i = 0; i < divs.length; i++)
{
    if(divs[i].id == "u0_1")
        mut.observe(divs[i],config);
}
function isInViewport(element)
{
	var height = window.innerHeight
	var width = window.innerWidth
	var rect = element.getBoundingClientRect()
	//elements in spoilers basically don't exist
	if(rect.top + rect.bottom + rect.right + rect.left == 0)
		return false;
	var topBelowScreen = rect.top > height
	var botAboveScreen = rect.bottom < 0
	var leftRightofScreen = rect.left > width
	var rightLeftofScreen = rect.right < 0
	if(!(topBelowScreen || botAboveScreen) && !(leftRightofScreen || rightLeftofScreen))
		return true;
	else
		return false;
}
//only play what's currently visible on screen
document.addEventListener('scroll', function ()
{
	var vids = document.getElementsByTagName("video")
	for(var i = 0;i < vids.length;i++)
	{
		if(isInViewport(vids[i]))
			vids[i].play();
		else
			vids[i].pause();
	}
});