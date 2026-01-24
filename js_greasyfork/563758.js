// ==UserScript==
// @name        Booru Hash Search
// @namespace   BooruHashSearch
// @license     MIT
// @match       https://*.donmai.us/*
// @match       https://aibooru.online/*
// @match       https://booru.allthefallen.moe/*
// @match       https://gelbooru.com/*
// @match       https://realbooru.com/*
// @match       https://rule34.xxx/*
// @match       https://rule34.paheal.net/*
// @match       https://rule34hentai.net/*
// @match       https://xbooru.com/*
// @match       https://hypnohub.net/*
// @match       https://booru.eu/*
// @match       https://chan.sankakucomplex.com/*
// @match       https://yande.re/*
// @match       https://konachan.com/*
// @match       https://konachan.net/*
// @match       https://www.sakugabooru.com/*
// @description Search md5 hashes from booru sites
//
// @run-at      document-end
// @version     1.0.0
// @grant       GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/563758/Booru%20Hash%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/563758/Booru%20Hash%20Search.meta.js
// ==/UserScript==

let IS_MONKEY = false
let hash


if(typeof GM === 'object' && typeof GM.info === 'object') {
	IS_MONKEY = true
}

function set_clipboard(ev) {
	if(typeof hash !== 'string')
		return
  if(IS_MONKEY)
		GM.setClipboard(hash)
	else
		navigator.clipboard.writeText(hash)
}

const sites = [
	{
		domain: ["donmai.us", "aibooru.online", "booru.allthefallen.moe"],
		inp_query: "section.image-container.note-container",
		inp_property: "dataset",
		inp_dataset: "fileUrl",
		inp_cut: /\/(.{32})\./,
		out_query: "#post-history > ul",
	},
	{
		domain: ["gelbooru.com"],
		inp_query: "section.image-container.note-container",
		inp_property: "dataset",
		inp_dataset: "md5",
		out_query: "ul#tag-list",
	},
	{
		domain: ["realbooru.com"],
		inp_query: "img#image",
		inp_property: "src",
		out_query: "div#tagLink",
		inp_cut: /\/(.{32})\./,
	},
	{
		domain: ["yande.re", "konachan.com", "konachan.net"],
		inp_query: "a#highres",
		inp_property: "href",
		inp_cut: /\/(.{32})\//,
		out_query: 'div#post-view > div.sidebar > div > ul:has(li > a[href="\/post\/random"])',
	},
	{
		domain: ["www.sakugabooru.com"],
		inp_query: "a#highres",
		inp_property: "href",
		inp_cut: /\/(.{32})\./,
		out_query: 'div#post-view > div.sidebar > div > ul:has(li > a[href="\/post\/random"])',
	},
	{
		domain: ["rule34.xxx"],
		inp_query: 'div.link-list > ul > li > a[href^="https\:\/\/wimg\.rule34\.xxx\/\/"]',
		inp_property: "href",
		inp_cut: /\/(.{32})\./,
		out_query: 'div.link-list > ul:has(li > a[href^="http\:\/\/saucenao\.com"])',
	},
	{
		domain: ["xbooru.com"],
		inp_query: 'div.link-list > ul > li > a[href^="https\:\/\/img\.xbooru\.com\/\/images\/"]',
		inp_property: "href",
		inp_cut: /\/(.{32})\./,
		out_query: 'div.link-list > ul:has(li > a[href^="http\:\/\/saucenao\.com"])',
	},
	{
		domain: ["hypnohub.net"],
		inp_query: 'div.link-list > ul > li > a[href^="https\:\/\/hypnohub\.net\/\/images\/"]',
		inp_property: "href",
		inp_cut: /\/(.{32})\./,
		out_query: 'div.link-list > ul:has(li > a[href^="http\:\/\/saucenao\.com"])',
	},
	{
		domain: ["rule34.paheal.net"],
		inp_query: "img#main_image",
		inp_property: "src",
		inp_cut: /\/(.{32})$/,
		out_query: "#ImageInfo",
	},
	{
		domain: ["rule34hentai.net"],
		inp_query: "img#main_image",
		inp_property: "src",
		inp_cut: /\/(.{32})\//,
		out_query: "#ImageInfo",
	},
	{
		domain: ["booru.eu"],
		inp_query: "img#main_image",
		inp_property: "src",
		inp_cut: /\/(.{32})\//,
		out_query: "section#Informationleft",
	},
	{
		domain: ["chan.sankakucomplex.com"],
		inp_query: "a#highres",
		inp_property: "href",
		inp_cut: /\/(.{32})\./,
		out_query: 'div#post-view > div.sidebar > div > ul:has(li > a[href^="\/posts\/similar"])',
	},
]

const search = [
	"https://danbooru.donmai.us/?tags=md5:$bHash status:any",
	"https://aibooru.online/?tags=md5:$bHash status:any",
	"https://booru.allthefallen.moe/?tags=md5:$bHash status:any",
	"https://gelbooru.com/index.php?page=post&s=list&tags=md5:$bHash",
	"https://rule34.xxx/index.php?page=post&s=list&tags=md5:$bHash",
	"https://rule34.paheal.net/post/list/md5=$bHash/1",
	"https://rule34hentai.net/post/list/md5=$bHash/1",
	"https://xbooru.com/index.php?page=post&s=list&tags=md5:$bHash",
	"https://hypnohub.net/index.php?page=post&s=list&tags=md5:$bHash",
	"https://tbib.org/index.php?page=post&s=list&tags=md5:$bHash",
	"https://booru.eu/post/list/md5=$bHash/1",
	"https://realbooru.com/index.php?page=post&s=list&tags=md5:$bHash",
	"https://safebooru.org/index.php?page=post&s=list&tags=md5:$bHash",
	"https://e621.net/posts?tags=md5:$bHash",
	"https://chan.sankakucomplex.com/?tags=md5:$bHash",
	"https://www.sankakucomplex.com/?tags=md5:$bHash",
	"https://www.idolcomplex.com/?tags=md5:$bHash",
	"https://yande.re/post?tags=md5:$bHash",
	"https://konachan.com/post?tags=md5:$bHash",
	"https://www.sakugabooru.com/post?tags=md5:$bHash",
]

function match_domain(site) {
	for(let d of site.domain)
		if(document.domain.endsWith(d))
			return true
	return false
}

//init
function show_search() {
	let params = sites.find(match_domain)
	let is_md5 = true

	//reused in set_clipboard
	hash = document.querySelector(params.inp_query)[params.inp_property]
	if(params.inp_dataset) {
		hash = hash[params.inp_dataset]
	}
	if(params.inp_cut) {
		let cut = params.inp_cut.exec(hash)
		if(cut !== null)
			hash = cut[1]
	}

	if((typeof hash) !== 'string') {
		return
	}


	let out_list = document.querySelector(params.out_query)

	let lh = document.createElement('li')
	let header = document.createElement('h4')
	header.textContent = 'MD5 Hash:'
	lh.appendChild(header)

	let lhsh = document.createElement('li')
	lhsh.textContent = hash
	lhsh.addEventListener('click', set_clipboard)

	out_list.appendChild(lh)
	out_list.appendChild(lhsh)

	for(const s of search) {
		let li = document.createElement('li')
		let a = document.createElement('a')
		let u = new URL(s)
		a.href = s.replace('$bHash', hash)
		a.innerText = u.hostname + ' hash'

		li.appendChild(a)
		out_list.appendChild(li)
	}
}

show_search()
