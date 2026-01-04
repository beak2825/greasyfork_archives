// ==UserScript==
// @name         Discourse 表情扩展 (Emoji Extension for Discourse)
// @namespace    https://github.com/stevessr/bug-v3
// @version      1.1.6
// @description  为 Discourse 论坛添加表情选择器功能 (Add emoji picker functionality to Discourse forums)
// @author       stevessr
// @match        https://linux.do/*
// @match        https://meta.discourse.org/*
// @match        https://*.discourse.org/*
// @match        http://localhost:5173/*
// @exclude      https://linux.do/a/*
// @match        https://idcflare.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @homepageURL  https://github.com/stevessr/bug-v3
// @supportURL   https://github.com/stevessr/bug-v3/issues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551678/Discourse%20%E8%A1%A8%E6%83%85%E6%89%A9%E5%B1%95%20%28Emoji%20Extension%20for%20Discourse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551678/Discourse%20%E8%A1%A8%E6%83%85%E6%89%A9%E5%B1%95%20%28Emoji%20Extension%20for%20Discourse%29.meta.js
// ==/UserScript==

(function() {
'use strict';

(function() {
	var __defProp = Object.defineProperty;
	var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
	var __export = (all) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		return target;
	};
	var defaultEmojiGroups;
	var init_defaultEmojiGroups = __esmMin((() => {
		defaultEmojiGroups = [
			{
				"emojis": [
					{
						"addedAt": 1758442802992,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758442802992-9a3zy5",
						"lastUsed": 1758811925942,
						"name": "AgADZRcAArmCaFc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/f/4/7/f479dbd309305ab14c53fd377cd51e44ee6f455e.webp",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758366747458,
						"groupId": "favorites",
						"height": 785,
						"id": "fav-1758366747458-2my8uf",
						"lastUsed": 1758774080017,
						"name": "洗澡",
						"packet": 9,
						"url": "https://linux.do/uploads/default/original/4X/e/1/4/e1429fd845288aa4c75e30829efe4696a1f4b1f9.jpeg",
						"usageCount": 1,
						"width": 1e3
					},
					{
						"addedAt": 1758328534078,
						"groupId": "favorites",
						"height": 1019,
						"id": "fav-1758328534078-7j8kx9",
						"lastUsed": 1758726343952,
						"name": "瞌睡",
						"packet": 1,
						"url": "https://linux.do/uploads/default/original/4X/5/9/f/59ffbc2c53dd2a07dc30d4368bd5c9e01ca57d80.jpeg",
						"usageCount": 1,
						"width": 1e3
					},
					{
						"addedAt": 1758558659513,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758558659513-tskqg1",
						"lastUsed": 1758713703237,
						"name": "AgAD3gkAAlg_OFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/1/b/3/1b342c2f7ab19e979d5f98a53840dd3e20cc7491.webp",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758332109751,
						"groupId": "favorites",
						"height": 1019,
						"id": "fav-1758332109751-5mmk5q",
						"lastUsed": 1758679219033,
						"name": "我汗",
						"packet": 12,
						"url": "https://linux.do/uploads/default/original/4X/8/a/b/8ab3b1fb6c7d990c9070e010f915fb237093f67f.jpeg",
						"usageCount": 3,
						"width": 1e3
					},
					{
						"addedAt": 1758679193422,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758679193422-fpbtll",
						"lastUsed": 1758679193422,
						"name": "流口水",
						"packet": 26,
						"url": "https://linux.do/uploads/default/original/4X/3/9/9/399d86225dadc703fabb1a8df48be5b36908320c.png",
						"usageCount": 1,
						"width": 500
					},
					{
						"addedAt": 1758639591499,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758639591499-axazcu",
						"lastUsed": 1758639591499,
						"name": "AgADtRgAAkF4cVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/9/3/b/93b1e705fc4b24fd5a563df74bf1df2dd5df8d40.webp",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758638023501,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758638023501-veref8",
						"lastUsed": 1758638023501,
						"name": "AgAD9BUAAhZdaFc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/d/1/c/d1c8bd3a20bafe446e9ea7accea8eaa87d16a5d8.webp",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758629251237,
						"groupId": "favorites",
						"height": 501,
						"id": "fav-1758629251237-lycnys",
						"lastUsed": 1758629251237,
						"name": "AgADCRUAAm7W0FU",
						"packet": 1755963597856,
						"url": "https://linux.do/uploads/default/original/4X/3/4/8/348b71c48260639d4f6a09d318c618a30d85ee19.webp",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758385690750,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758385690750-zd7qh1",
						"lastUsed": 1758626776209,
						"name": "AgAD5gIAAkE-WVY",
						"packet": 1755966246526,
						"url": "https://linux.do/uploads/default/original/4X/5/1/f/51fd89364d913b8a555fc617121bd707e5a46fae.webp",
						"usageCount": 2,
						"width": 512
					},
					{
						"addedAt": 1758430249591,
						"groupId": "favorites",
						"height": 1754,
						"id": "fav-1758430249591-zhvjjg",
						"lastUsed": 1758626567488,
						"name": "吃面包",
						"packet": 1758296796774,
						"url": "https://linux.do/uploads/default/original/4X/e/8/2/e829c84ca1702d369165f6075d33de92f5c8f194.jpeg",
						"usageCount": 1,
						"width": 1240
					},
					{
						"addedAt": 1758551076171,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758551076171-poina4",
						"lastUsed": 1758624489018,
						"name": "AgADmRUAAq8CmFU",
						"packet": 1755963690087,
						"url": "https://linux.do/uploads/default/original/4X/f/9/6/f967d5d3103b6b6b83d3708aec25e69c1ebe12d5.webp",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758550283396,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758550283396-1dvc55",
						"lastUsed": 1758550283396,
						"name": "AgADGRoAAqaBaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/7/6/b/76b5fa43b52f585fd1700ee25a7265b0f25e96a2.webp",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758472236409,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758472236409-o1751l",
						"lastUsed": 1758472236409,
						"name": "AgADhRwAAsE9aFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/7/e/c/7ece48b3a5342ad7d630d71e2f2abf25b5c1746e.webp",
						"usageCount": 2,
						"width": 512
					},
					{
						"addedAt": 1758463188005,
						"groupId": "favorites",
						"height": 96,
						"id": "fav-1758463188005-jbrgoc",
						"lastUsed": 1758463188005,
						"name": "doge.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/c/c8b533868759cbe3d1cc72ac845439995bb71070.png",
						"usageCount": 1,
						"width": 96
					},
					{
						"addedAt": 1758442642872,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758442642872-bjhuim",
						"lastUsed": 1758442642872,
						"name": "8",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/7/7/2/7722118597edcec0d74047f2099ed550a669c133.webp",
						"usageCount": 1,
						"width": 505
					},
					{
						"addedAt": 1758435370657,
						"groupId": "favorites",
						"height": 96,
						"id": "fav-1758435370657-ymoqj2",
						"lastUsed": 1758435370657,
						"name": "antic.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/2/2b7061d222a42c2b1c57f8a98382b0abb992a535.png",
						"usageCount": 1,
						"width": 96
					},
					{
						"addedAt": 1758362829194,
						"groupId": "favorites",
						"height": 1209,
						"id": "fav-1758362829194-em2d8p",
						"lastUsed": 1758362829194,
						"name": "嘻嘻",
						"packet": 8,
						"url": "https://linux.do/uploads/default/original/4X/6/a/3/6a3619da1dbb63cc0420fbf1f6f2316b5503ab09.jpeg",
						"usageCount": 1,
						"width": 1e3
					},
					{
						"addedAt": 1758329080365,
						"groupId": "favorites",
						"height": 1e3,
						"id": "fav-1758329080365-6zi7vg",
						"lastUsed": 1758329080365,
						"name": "干嘛",
						"packet": 4,
						"url": "https://linux.do/uploads/default/original/4X/5/5/2/552f13479e7bff2ce047d11ad821da4963c467f2.jpeg",
						"usageCount": 1,
						"width": 1e3
					},
					{
						"addedAt": 1758265158141,
						"groupId": "favorites",
						"height": 493,
						"id": "fav-1758265158141-jdeiov",
						"lastUsed": 1758265158141,
						"name": "尴尬",
						"packet": 27,
						"url": "https://linux.do/uploads/default/original/4X/1/d/5/1d58ac97d5e63b36083a5eadb67a3f3404f0b063.png",
						"usageCount": 1,
						"width": 512
					},
					{
						"addedAt": 1758251294109,
						"groupId": "favorites",
						"height": 512,
						"id": "fav-1758251294109-e1iph7",
						"lastUsed": 1758251294109,
						"name": "委屈",
						"packet": 35,
						"url": "https://linux.do/uploads/default/original/4X/e/1/e/e1e37eca93601022f3efcd91cb477b88ee350e07.png",
						"usageCount": 1,
						"width": 512
					}
				],
				"icon": "⭐",
				"id": "favorites",
				"name": "常用",
				"order": 0
			},
			{
				"emojis": [
					{
						"groupId": "group-1758073408523",
						"height": 993,
						"id": "emoji-1758073408523-ggg1vh",
						"name": "哭泣",
						"packet": 2,
						"url": "https://linux.do/uploads/default/original/4X/5/d/9/5d932c05a642396335f632a370bd8d45463cf2e2.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 1019,
						"id": "emoji-1758073408523-7hi4xa",
						"name": "瞌睡",
						"packet": 1,
						"url": "https://linux.do/uploads/default/original/4X/5/9/f/59ffbc2c53dd2a07dc30d4368bd5c9e01ca57d80.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 965,
						"id": "emoji-1758073408523-v6f472",
						"name": "疑问",
						"packet": 3,
						"url": "https://linux.do/uploads/default/original/4X/f/a/a/faa5afe1749312bc4a326feff0eca6fb39355300.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 1e3,
						"id": "emoji-1758073408523-v7n2we",
						"name": "干嘛",
						"packet": 4,
						"url": "https://linux.do/uploads/default/original/4X/5/5/2/552f13479e7bff2ce047d11ad821da4963c467f2.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 1e3,
						"id": "emoji-1758073408523-xsbkx3",
						"name": "是我",
						"packet": 6,
						"url": "https://linux.do/uploads/default/original/4X/2/3/f/23fac94d8858a23cbd49879f2b037a2be020c87e.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 939,
						"id": "emoji-1758073408523-dduzu7",
						"name": "吃东西",
						"packet": 5,
						"url": "https://linux.do/uploads/default/original/4X/0/d/1/0d125de02c201128bf6a3f78ff9450e48a3e27de.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 1013,
						"id": "emoji-1758073408523-ug8faf",
						"name": "玩吗",
						"packet": 7,
						"url": "https://linux.do/uploads/default/original/4X/3/1/a/31a38450e22d42f9d4b683b190a40b9a94727681.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 1209,
						"id": "emoji-1758073408523-b4jrum",
						"name": "嘻嘻",
						"packet": 8,
						"url": "https://linux.do/uploads/default/original/4X/6/a/3/6a3619da1dbb63cc0420fbf1f6f2316b5503ab09.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 785,
						"id": "emoji-1758073408523-ryrjha",
						"name": "洗澡",
						"packet": 9,
						"url": "https://linux.do/uploads/default/original/4X/e/1/4/e1429fd845288aa4c75e30829efe4696a1f4b1f9.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 886,
						"id": "emoji-1758073408523-taaoyr",
						"name": "困了",
						"packet": 11,
						"url": "https://linux.do/uploads/default/original/4X/7/f/4/7f4d50105aefec0efa80c498179a7d0901b54a7a.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 1019,
						"id": "emoji-1758073408523-2thexz",
						"name": "我汗",
						"packet": 12,
						"url": "https://linux.do/uploads/default/original/4X/8/a/b/8ab3b1fb6c7d990c9070e010f915fb237093f67f.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 815,
						"id": "emoji-1758073408523-gsaiun",
						"name": "盯着",
						"packet": 15,
						"url": "https://linux.do/uploads/default/original/4X/6/e/6/6e68786e64c4260746d02d2e308168b200185d7d.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 937,
						"id": "emoji-1758073408523-a93550",
						"name": "哇哦",
						"packet": 13,
						"url": "https://linux.do/uploads/default/original/4X/2/9/c/29ce5a00273ba10ae9c1a8abf7a3b42abcccdd66.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 1e3,
						"id": "emoji-1758073408523-ovacs2",
						"name": "无聊",
						"packet": 14,
						"url": "https://linux.do/uploads/default/original/4X/1/0/6/1063e1803fa965cd1604bda0e6d7705376f9963f.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 841,
						"id": "emoji-1758073408523-mv461j",
						"name": "ok",
						"packet": 16,
						"url": "https://linux.do/uploads/default/original/4X/1/a/b/1ab685b8f2948689a917aa1c0d7ce9bfa2ec48bd.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 994,
						"id": "emoji-1758073408523-0o9ow4",
						"name": "沉默",
						"packet": 17,
						"url": "https://linux.do/uploads/default/original/4X/1/c/3/1c39b615e9ef831568ede182ecdec0e749bbd202.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-ttmzuv",
						"name": "开心",
						"packet": 18,
						"url": "https://linux.do/uploads/default/original/4X/6/5/0/650110fc5845e915cf4aefec11e4a058f4aff731.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-wdyudc",
						"name": "睡觉",
						"packet": 19,
						"url": "https://linux.do/uploads/default/original/4X/9/0/9/90957308d24a9c79257425ff0f8a14411b6aaad6.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-uxqnkg",
						"name": "生气",
						"packet": 20,
						"url": "https://linux.do/uploads/default/original/4X/8/1/9/81909951f915b3e969c93d433b9fd6935a431d9a.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-2pq9hn",
						"name": "抱抱",
						"packet": 21,
						"url": "https://linux.do/uploads/default/original/4X/2/5/6/256411726c9680d821da26ad699e7d2d574ab24c.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 511,
						"id": "emoji-1758073408523-a94ya1",
						"name": "花痴",
						"packet": 22,
						"url": "https://linux.do/uploads/default/original/4X/1/e/a/1eaf593a62462e72a4193f6c646f51898e85f53d.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-bieecj",
						"name": "彩色",
						"packet": 23,
						"url": "https://linux.do/uploads/default/original/4X/5/7/b/57b21409decd4258dc93ce93cff40ef3b631de46.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-ii5dum",
						"name": "惊讶",
						"packet": 24,
						"url": "https://linux.do/uploads/default/original/4X/9/8/9/989df0f7b3b9683974162f491a517305711e28ce.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-ipfr91",
						"name": "真诚",
						"packet": 25,
						"url": "https://linux.do/uploads/default/original/4X/b/8/5/b85433e17a79846cf2ec8a9458506ce6f48d25b2.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408523-axc80i",
						"name": "流口水",
						"packet": 26,
						"url": "https://linux.do/uploads/default/original/4X/3/9/9/399d86225dadc703fabb1a8df48be5b36908320c.png",
						"width": 500
					},
					{
						"groupId": "group-1758073408523",
						"height": 493,
						"id": "emoji-1758073408524-4ba0xx",
						"name": "尴尬",
						"packet": 27,
						"url": "https://linux.do/uploads/default/original/4X/1/d/5/1d58ac97d5e63b36083a5eadb67a3f3404f0b063.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 481,
						"id": "emoji-1758073408524-6yh8t4",
						"name": "是的",
						"packet": 28,
						"url": "https://linux.do/uploads/default/original/4X/c/3/b/c3bcb5be07dd54b84038568d6ae9762afb86c8f9.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 477,
						"id": "emoji-1758073408524-eg288v",
						"name": "nya",
						"packet": 29,
						"url": "https://linux.do/uploads/default/original/4X/8/f/e/8fe82a64472dc96eaf9b27dc86f0655fee325572.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-axqgcq",
						"name": "脸红",
						"packet": 30,
						"url": "https://linux.do/uploads/default/original/4X/3/f/6/3f6c5ed37cb8a5b4c06d1c9b1e8aab38ddfe9878.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-lnafg6",
						"name": "大哭",
						"packet": 31,
						"url": "https://linux.do/uploads/default/original/4X/8/2/2/8220d4c92b848b15d642dd22973bd0854d734aa9.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-bcscn1",
						"name": "hi",
						"packet": 32,
						"url": "https://linux.do/uploads/default/original/4X/f/2/2/f228b317d9c333833ccf3a81fee705024a548963.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-umidl0",
						"name": "爱心",
						"packet": 33,
						"url": "https://linux.do/uploads/default/original/4X/f/9/9/f99df315a1cdba0897bc6f4776ebdcc360ddf562.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-4gpkmr",
						"name": "眼罩",
						"packet": 34,
						"url": "https://linux.do/uploads/default/original/4X/a/e/5/ae56ca1c5ee8ab2c47104c54077efcedbbdc474e.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-jbshx4",
						"name": "委屈",
						"packet": 35,
						"url": "https://linux.do/uploads/default/original/4X/e/1/e/e1e37eca93601022f3efcd91cb477b88ee350e07.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-oa1dnh",
						"name": "害羞",
						"packet": 36,
						"url": "https://linux.do/uploads/default/original/4X/7/8/0/78015ed5ccdc87e5769eb2d1af5cdaf466c1cb07.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-xxw11b",
						"name": "打哈欠",
						"packet": 37,
						"url": "https://linux.do/uploads/default/original/4X/2/f/4/2f453be9d3d69d459637f3cd824b6f9641b6f592.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-lvhnnh",
						"name": "红温",
						"packet": 38,
						"url": "https://linux.do/uploads/default/original/4X/2/4/c/24cac75d64461ba1d1b0c3c8560a1c10acb3f3ad.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 512,
						"id": "emoji-1758073408524-yaprc6",
						"name": "愤怒",
						"packet": 39,
						"url": "https://linux.do/uploads/default/original/4X/3/d/2/3d245f6de7d3549174cef112560dec8ae3a768d7.png",
						"width": 512
					},
					{
						"groupId": "group-1758073408523",
						"height": 1200,
						"id": "emoji-1758073408524-3zh1t6",
						"name": "猫猫の福利",
						"packet": 40,
						"url": "https://linux.do/uploads/default/original/4X/c/0/b/c0bb1d42d12ef192657896abccf05d97c6298bdd.jpeg",
						"width": 1200
					}
				],
				"icon": "https://linux.do/uploads/default/original/4X/2/3/f/23fac94d8858a23cbd49879f2b037a2be020c87e.jpeg",
				"id": "group-1758073408523",
				"name": "Nachoneko表情包",
				"order": 1
			},
			{
				"emojis": [
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905988-dnvmwg",
						"name": "AgADCBgAAr1caFc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/4/9/1/491a91ea4c1ee55e4c88fb47e30febb07212fd43.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905988-gexkmt",
						"name": "AgADHBkAAlNGaVc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/8/d/7/8d792884303b7fe7cc64c114d58505e1c0c24231.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905988-dx7t4v",
						"name": "AgADZRcAArmCaFc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/f/4/7/f479dbd309305ab14c53fd377cd51e44ee6f455e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905988-yonbk5",
						"name": "AgAD2RgAApNBaVc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/0/c/7/0c790bd1a43315be7891b92ce706904ea6483f79.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905988-h3qtmw",
						"name": "AgAD8hoAAs13aVc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/d/3/0/d30c4fbbfee682c039fc398527232f28e57761c4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905988-debedm",
						"name": "AgAD9BUAAhZdaFc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/d/1/c/d1c8bd3a20bafe446e9ea7accea8eaa87d16a5d8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905988-tkm2d6",
						"name": "AgADrxoAAqQiaVc",
						"packet": 1755913905988,
						"url": "https://linux.do/uploads/default/original/4X/4/2/8/428a63e723845f74b2d41ce90edbe67ebcc98555.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905989-0chf5r",
						"name": "AgADshwAAmozaFc",
						"packet": 1755913905989,
						"url": "https://linux.do/uploads/default/original/4X/c/d/b/cdbaa4c7a799f324a3991f9ef64e9ef97005f728.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905989-lsj818",
						"name": "AgADthgAApOTaFc",
						"packet": 1755913905989,
						"url": "https://linux.do/uploads/default/original/4X/f/4/3/f43a62a49ad1ce8d52708371de5ed24cc1f71f0b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913905989-5257e4",
						"name": "AgAD0BsAAqXcaFc",
						"packet": 1755913905989,
						"url": "https://linux.do/uploads/default/original/4X/e/f/c/efc1f1bd5ab7fe27f9b0d3c609ab27402fd8a1f8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918164-ktt9gh",
						"name": "AgADpxgAAk3BaFc",
						"packet": 1755913918164,
						"url": "https://linux.do/uploads/default/original/4X/e/b/b/ebb944b85871d8dc7867e207cc68f7394c8871b9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918164-63wqdb",
						"name": "AgADNRYAAm8PcFc",
						"packet": 1755913918164,
						"url": "https://linux.do/uploads/default/original/4X/c/4/e/c4e1ba44a5edfe21c25f31e5838be54bf8e6bea7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918164-rl5vmq",
						"name": "AgAD5xoAAn4WcFc",
						"packet": 1755913918164,
						"url": "https://linux.do/uploads/default/original/4X/e/5/d/e5d668e70830f8caad04bdace8370eb9f781bbea.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-wvrr5n",
						"name": "AgADFx4AApvVaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/6/2/e/62efac7278c93efdb9bf9870eb65186bef2a1a64.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-lvctn5",
						"name": "AgADjx0AApJmaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/b/5/c/b5cca1a8431a0583bd68a4650011cfa2ba93fdad.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-7kg3hz",
						"name": "AgADWRoAAoO8aFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/d/5/9/d598a1607ca891ae596637dfdc96c54a928abfd7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-yqaqny",
						"name": "AgAD4RgAAm5DaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/8/a/f/8afac24024066a22e4cc5215a481d437f4b00011.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-sxqvk8",
						"name": "AgADbxoAAmQ6aVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/3/2/4/324b7e2c27085b3fdd58fac5ae6a36d621b5a96f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-cpsl8v",
						"name": "AgADhRwAAsE9aFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/7/e/c/7ece48b3a5342ad7d630d71e2f2abf25b5c1746e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-ql0abh",
						"name": "AgADNhkAAmuxaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/9/c/3/9c33b9fd8a00e0163f890cdc15f4dac7b93f76c0.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-bxlchl",
						"name": "AgAD7BUAAlP0aFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/c/d/f/cdf867ef2283b76704575fc134415886c407f5b1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-jo630z",
						"name": "AgAD9hcAAtEXaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/e/7/9/e791bf3bb2c41d6084dcc120d70a5731c883b7d4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-52smlc",
						"name": "AgADUBsAAlRIaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/d/e/0/de078bb7cb71f0e654f38c95626cb05165b34fa3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-lltyi5",
						"name": "AgADNxYAAs2laVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/4/2/c/42c096797bdaca53763b868a1f86cd7e796da335.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-xpyybu",
						"name": "AgAD7CEAAnDpaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/0/a/c/0acb415f6bf60fe4efd64dba2d0490f48a78be02.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-x3nl75",
						"name": "AgAD-BYAAqOPaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/c/b/0/cb0454296c26e946fa4fbc4068e55af78d3f5b66.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-3sjbei",
						"name": "AgADqRoAAthzaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/7/b/6/7b681667bc2540bc78a6fd3928eb2ba850d52259.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-95g9i8",
						"name": "AgAD_BkAAuGYaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/9/4/3/9432119cdb6462e27353069ad41ea5ccc8d154f5.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-865n95",
						"name": "AgAD0RcAAjt4aFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/5/5/6/5562444b1f1b55136ea10e1f389a726c486828f9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-bf53er",
						"name": "AgADKhkAAk91aFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/0/6/d/06d0849c2507c6144479a2b34569ab7ae7297392.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-cjb5bx",
						"name": "AgADtRgAAkF4cVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/9/3/b/93b1e705fc4b24fd5a563df74bf1df2dd5df8d40.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-xibh39",
						"name": "AgADGRoAAqaBaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/7/6/b/76b5fa43b52f585fd1700ee25a7265b0f25e96a2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-dhjeia",
						"name": "AgAD1BcAAhpDaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/b/e/b/beb27927a4cf30edc87a1ed7398174b478610b08.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-hprqen",
						"name": "AgADgBUAAlEiaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/6/c/c/6cc78578d1d6e48e465e32b7aa2a3d850e20d711.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-gvexxy",
						"name": "AgADwCQAAlBAaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/3/3/a/33aea74c608c8963a7a5e27f890518ee8a7af73d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-t728x7",
						"name": "AgADmhgAAggeaFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/2/b/3/2b3435b48e5ff3214e48a647f3602f1468e41f48.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-einfjq",
						"name": "AgADqhwAApeicFc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/a/3/5/a35b9eddabfa3ae163f6d9678df35a1d4ecefb69.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-15r1yd",
						"name": "AgADYRkAAmoWaVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/d/3/9/d399d693646252391785366c7bd91d77008b8b96.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918165-0urb8q",
						"name": "AgAD3xkAAsEXcVc",
						"packet": 1755913918165,
						"url": "https://linux.do/uploads/default/original/4X/1/b/0/1b09066b979051c2c7d9b5864bf43d552c7568b7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918166-z1sbdr",
						"name": "AgADchgAAiWHaVc",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/6/3/4/634b12bd9b5821a410288cb3a282a3fa1a02730f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 462,
						"id": "emoji-1755913918166-6nt5as",
						"name": "sticker",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/2/1/4/2146a2ba2224913188644efdad4b9f4cac2941e1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 461,
						"id": "emoji-1755913918166-et9t1r",
						"name": "21",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/4/e/9/4e91c897524e0a94313facb5c0b93f09458d3c16.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 372,
						"id": "emoji-1755913918166-cojm5z",
						"name": "AgADSBMAAlRBcVY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/9/3/f/93f412f57b5db43a810047363ee1604de471780a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 441,
						"id": "emoji-1755913918166-e4srsm",
						"name": "AgADTxMAAjRJcFY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/3/6/e/36e54a817db2068d83b503309076c424ce4a4e01.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 466,
						"id": "emoji-1755913918166-ozyrm8",
						"name": "AgADGA4AAlQYcFY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/3/8/d/38da92274d170e914c8288ab4c931aaa2b3e0f68.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 427,
						"id": "emoji-1755913918166-xek2nn",
						"name": "AgADpRUAAiSHcVY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/5/e/1/5e19bcf6d488de8f0102a9b6d8c411972d95a6a5.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 407,
						"id": "emoji-1755913918166-cqyshm",
						"name": "20",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/a/1/9/a199690353a9e4110be2d50bb2756dcf074d8fc1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 437,
						"id": "emoji-1755913918166-nz2m78",
						"name": "AgADChYAAoSacVY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/4/8/1/4817c5ce196b246d693647c2ad3641181d23e80f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 401,
						"id": "emoji-1755913918166-husdaj",
						"name": "AgADPhEAAtG6cVY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/6/d/e/6de6a692011fe78967c3a99ad5d8cd943527ec15.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 443,
						"id": "emoji-1755913918166-8b8jsh",
						"name": "12",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/d/3/1/d313064205e89c1f170619fa79ff9a1b358ddff2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 457,
						"id": "emoji-1755913918166-spwv7h",
						"name": "AgADDxEAAgxwcVY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/1/a/c/1ace0dac71c8b6863b90e887e085ff0769ecde66.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 423,
						"id": "emoji-1755913918166-krbqv7",
						"name": "6",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/c/2/2/c2227bfe9e9166b01c8762e3acd4ad0b26585bdd.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 503,
						"id": "emoji-1755913918166-05wqpm",
						"name": "11",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/5/c/2/5c2acf32099ef10cf09ce13862c50fe7fc3c9df6.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 484,
						"id": "emoji-1755913918166-2lrvrt",
						"name": "10",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/c/b/9/cb956454013d6aa2b9304bf3858c98f22fe13525.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 429,
						"id": "emoji-1755913918166-0doc05",
						"name": "AgADXhUAAv_baFY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/5/c/0/5c02845d262467c4043f8467dbb96b59661d7671.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 494,
						"id": "emoji-1755913918166-izv14z",
						"name": "7",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/6/8/1/6813b2c9fa68ae15f9a63e5b7667e2aeb5107841.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 503,
						"id": "emoji-1755913918166-yzmbiq",
						"name": "9",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/f/6/e/f6e347d9003f80b614178704774a4641d4488121.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918166-mgmayh",
						"name": "2",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/c/4/d/c4d72befe8b66d4b2b3e22a0da7b9df02a7debd3.webp",
						"width": 487
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918166-br6vty",
						"name": "8",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/7/7/2/7722118597edcec0d74047f2099ed550a669c133.webp",
						"width": 505
					},
					{
						"groupId": "group-1755913884262",
						"height": 450,
						"id": "emoji-1755913918166-qkg8rc",
						"name": "AgADSREAAhWWcFY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/2/3/9/239c28a4c4e5a8e01bd277af109044156e590e66.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 512,
						"id": "emoji-1755913918166-9firme",
						"name": "0",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/1/e/3/1e3454574bc07a401dc274b3821c6ea1cdb49e8c.webp",
						"width": 430
					},
					{
						"groupId": "group-1755913884262",
						"height": 448,
						"id": "emoji-1755913918166-nagxaa",
						"name": "3",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/8/6/4/86411d9712398ab7de0fb21d39bd48fa180f7dd9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 476,
						"id": "emoji-1755913918166-dnf082",
						"name": "4",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/5/a/1/5a15414bebbd7c9b7c81c99f9b01b6fff2687d6c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913884262",
						"height": 443,
						"id": "emoji-1755913918166-n6s73n",
						"name": "AgADzQ8AAkOacVY",
						"packet": 1755913918166,
						"url": "https://linux.do/uploads/default/original/4X/d/4/4/d442513562caf7d2e07d8333b008008a2215a5e0.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1755913884262",
				"name": "neko",
				"order": 2
			},
			{
				"emojis": [
					{
						"groupId": "group-1755913887877",
						"height": 495,
						"id": "emoji-1755913930434-9c0wvt",
						"name": "AgADGgEAAh5BpQg",
						"packet": 1755913930434,
						"url": "https://linux.do/uploads/default/original/4X/7/d/7/7d79706009cad4c418d71a2ec801db1148f15def.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-3sjse8",
						"name": "AgADGQEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/4/3/9/43922b23ca7dfef5506541d87caf616618d5f6fa.webp",
						"width": 501
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-hi6x75",
						"name": "AgADGwEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/9/1/b/91bafe5b5494b203c5b656280658a68fd6d14089.webp",
						"width": 486
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-71cy0b",
						"name": "AgADHAEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/0/e/b/0ebdeeb36be010453470b8f7c3d211c5c8bc2bb1.webp",
						"width": 428
					},
					{
						"groupId": "group-1755913887877",
						"height": 481,
						"id": "emoji-1755913930435-qaan7v",
						"name": "AgADHgEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/b/5/d/b5d47178a28be540f091dd7a21ef1030cc92f2c7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-f74jxg",
						"name": "AgADHQEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/0/1/6/0167120ced7bfd323f27778cf9cd6caa4077ea3f.webp",
						"width": 505
					},
					{
						"groupId": "group-1755913887877",
						"height": 499,
						"id": "emoji-1755913930435-2ndsz7",
						"name": "AgADHwEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/0/a/e/0aef5066d257b3343f4a7dc9b65783295246a2f3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-hqhbhi",
						"name": "AgADIAEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/5/b/e/5beb09f7ec66c083a9261427c06a1b0066e16693.webp",
						"width": 489
					},
					{
						"groupId": "group-1755913887877",
						"height": 479,
						"id": "emoji-1755913930435-bdy4a1",
						"name": "AgADIQEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/0/f/3/0f3972e2967ca49ca0a3e187d6000ff91127c1fe.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-5890s3",
						"name": "AgADCwEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/f/a/b/fab0e13bd0dd7d7bf89fe25e8f3c01117a4b092f.webp",
						"width": 441
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-y77dlc",
						"name": "AgADDAEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/e/e/f/eefad90bfb1f1ee3c33fb1bbf009b013a9e5ef21.webp",
						"width": 508
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-mseywy",
						"name": "AgADDgEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/5/5/7/557b1ac5ee247ae0549622bc8b5f4de30b3c47a2.webp",
						"width": 396
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-e99jam",
						"name": "AgADDQEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/7/9/5/7957dd786175a5af36bc605bc9472240629e08e7.webp",
						"width": 502
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-yif84g",
						"name": "AgADDwEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/8/4/0/840eac911e0d08532aa6636456933d0d24c5e231.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-jvi5w9",
						"name": "AgADEAEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/f/4/7/f477db3f5ea2b407913b9a88022dbed2c5672b3e.webp",
						"width": 470
					},
					{
						"groupId": "group-1755913887877",
						"height": 381,
						"id": "emoji-1755913930435-nbeecj",
						"name": "AgADEgEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/9/1/b/91bdef896887986ca65fc3853e04571e808524ba.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-m1dk8p",
						"name": "AgADEQEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/c/6/9/c6927a64ac6a479891e8e427140c0505ea54cc39.webp",
						"width": 326
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-xpjbtu",
						"name": "AgADEwEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/c/b/d/cbd5117b0d8c7d6b1891c91a69777e9ae55697b7.webp",
						"width": 467
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930435-kk9c18",
						"name": "AgADFAEAAh5BpQg",
						"packet": 1755913930435,
						"url": "https://linux.do/uploads/default/original/4X/9/5/3/953aa2c07ab48fc7da93e8812e83ed4ebebb8321.webp",
						"width": 464
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-owmmsc",
						"name": "AgADFgEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/e/2/6/e26c6d4ffb0846a0fc500b61c1fc92d073d07178.webp",
						"width": 464
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-mk6ohw",
						"name": "AgADFQEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/6/8/f/68f8c22b431b80da8408e77f0e9af350c2dc35a3.webp",
						"width": 454
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-eznb44",
						"name": "AgADGAEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/3/2/6/326a9dd0bd196c048a276711ba2216c586bfeabf.webp",
						"width": 489
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-zvyhqf",
						"name": "AgADFwEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/3/7/8/3787a7d0e7492a949193b9de51f69aa9d606fd64.webp",
						"width": 467
					},
					{
						"groupId": "group-1755913887877",
						"height": 365,
						"id": "emoji-1755913930436-vqw7w5",
						"name": "AgAD_gADHkGlCA",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/2/7/5/27548691a52388f3a6ee43da02a4d993071e5507.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-b1b1r1",
						"name": "AgAD_wADHkGlCA",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/5/e/8/5e8ee3aaba7473f1bb580a5268d20534c52026ff.webp",
						"width": 467
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-v4dayr",
						"name": "AgADAgEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/e/5/6/e56a2fa65e96b6eedc367b026bf5bf8efb9b4740.webp",
						"width": 466
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-ta0kc4",
						"name": "AgADAQEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/1/0/a/10a5698a432fe7be8bfd950cbc13cd06182a5912.webp",
						"width": 499
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-kx6ann",
						"name": "AgADAwEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/1/5/0/150be6d2d974f8b9c3c518851b497afa14620efd.webp",
						"width": 476
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-jfnva1",
						"name": "AgADBAEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/e/2/4/e24604804329256a5042178454b6bac69df51714.webp",
						"width": 470
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-9nh4dv",
						"name": "AgADBgEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/c/1/5/c1535fc14fc1b5054a923d4c37abc4ef89fd6632.webp",
						"width": 489
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-u4gpm0",
						"name": "AgADBQEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/f/7/a/f7afaab5dd91159674a53cdc977a09402f66c278.webp",
						"width": 473
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-w69xz7",
						"name": "AgADBwEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/6/b/9/6b93dc4e317b3d74a205b38c4041a09090c96063.webp",
						"width": 492
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-jmtsqg",
						"name": "AgADCAEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/8/9/9/899067d06c1dbc537e27fe5a9c6f3b61beffcbf5.webp",
						"width": 486
					},
					{
						"groupId": "group-1755913887877",
						"height": 490,
						"id": "emoji-1755913930436-ww0s81",
						"name": "AgAEAQACHkGlCA",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/4/3/4/43498ed609ddc3d03aeb63863a58f5906b6392b3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 499,
						"id": "emoji-1755913930436-kxye9q",
						"name": "AgADCgEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/b/d/a/bda18e464d66c690808ea6e541ab5c4722a84cac.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-vpntpz",
						"name": "AgADCAEAAh5BpQg",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/8/9/9/899067d06c1dbc537e27fe5a9c6f3b61beffcbf5.webp",
						"width": 486
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-v3q5gt",
						"name": "AgAD_AADHkGlCA",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/5/0/e/50e4fca45b2018040f52e4bc892de33312fa804c.webp",
						"width": 464
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-h7iw15",
						"name": "AgAD_QADHkGlCA",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/6/e/e/6ee3b11a8cc1c2c942091fc01feb8442edc024a9.webp",
						"width": 505
					},
					{
						"groupId": "group-1755913887877",
						"height": 512,
						"id": "emoji-1755913930436-sxwdnn",
						"name": "AgAD-gADHkGlCA",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/3/4/b/34bee68acf12b7b5314cc069b65ab8dcc204815f.webp",
						"width": 470
					},
					{
						"groupId": "group-1755913887877",
						"height": 442,
						"id": "emoji-1755913930436-awqnh3",
						"name": "AgAD-wADHkGlCA",
						"packet": 1755913930436,
						"url": "https://linux.do/uploads/default/original/4X/1/d/1/1d133d3278b18b5c09c1ac5d5ae3cd8e7d35d241.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1755913887877",
				"name": "neko2",
				"order": 3
			},
			{
				"emojis": [
					{
						"addedAt": 1755963709093,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963709092-97n0d0",
						"name": "AgADtRcAAnTbmFU",
						"packet": 1755963709093,
						"url": "https://linux.do/uploads/default/original/4X/3/1/b/31bdd6426067a8a039a3bbba36bcab6def65360f.webp",
						"width": 512
					},
					{
						"addedAt": 1755963708991,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963708991-9ed9mz",
						"name": "AgADuRYAAl3ymFU",
						"packet": 1755963708991,
						"url": "https://linux.do/uploads/default/original/4X/f/c/4/fc4d2c505cc22c5ac6341c0b1753edd8a23a425f.webp",
						"width": 512
					},
					{
						"addedAt": 1755963708919,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963708919-3ybv92",
						"name": "AgAD4xYAAvMhmVU",
						"packet": 1755963708919,
						"url": "https://linux.do/uploads/default/original/4X/0/7/f/07f716a58579a981693c34d18652d126214d2435.webp",
						"width": 512
					},
					{
						"addedAt": 1755963708819,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963708819-e300ve",
						"name": "AgADphQAAkCRmFU",
						"packet": 1755963708819,
						"url": "https://linux.do/uploads/default/original/4X/9/9/d/99de1e8c7f76cdd5ad4ab05d64479c3e762f951f.webp",
						"width": 512
					},
					{
						"addedAt": 1755963708770,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963708770-drhyt9",
						"name": "AgAD7hUAAoGdmFU",
						"packet": 1755963708770,
						"url": "https://linux.do/uploads/default/original/4X/c/b/9/cb9e72b10478eda89324d505f8597b6520516cc9.webp",
						"width": 512
					},
					{
						"addedAt": 1755963708724,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963708724-st7jjv",
						"name": "AgAD_RQAAjGCmFU",
						"packet": 1755963708724,
						"url": "https://linux.do/uploads/default/original/4X/b/7/0/b7088b7b96dd54461fda79c3249b9dc4f4b6454e.webp",
						"width": 512
					},
					{
						"addedAt": 1755963708664,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963708664-20xonl",
						"name": "AgADuxkAAo2AiFY",
						"packet": 1755963708664,
						"url": "https://linux.do/uploads/default/original/4X/0/9/2/092425346d0e54b082f1a23a7a17745ebca04094.webp",
						"width": 512
					},
					{
						"addedAt": 1755963690087,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963690087-wqonlb",
						"name": "AgADmRUAAq8CmFU",
						"packet": 1755963690087,
						"url": "https://linux.do/uploads/default/original/4X/f/9/6/f967d5d3103b6b6b83d3708aec25e69c1ebe12d5.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689971,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689971-3lku4t",
						"name": "AgADehgAApPbmFU",
						"packet": 1755963689971,
						"url": "https://linux.do/uploads/default/original/4X/2/9/c/29ce7fe1288b434226a0feefb1475663e49335de.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689840,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689840-rn4vjo",
						"name": "AgADzRkAAnwSmVU",
						"packet": 1755963689840,
						"url": "https://linux.do/uploads/default/original/4X/b/f/3/bf3b9924ee59d1bcf8ae672a19a224989e7c14aa.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689765,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689765-sntlaf",
						"name": "AgADexYAAnLFmFU",
						"packet": 1755963689765,
						"url": "https://linux.do/uploads/default/original/4X/9/3/0/9301735f0116c59adf6bb848f52adcd61dddd16a.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689720,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689720-dyqkyx",
						"name": "AgADVhYAAkwAAaFV",
						"packet": 1755963689720,
						"url": "https://linux.do/uploads/default/original/4X/0/c/7/0c70549e9354ec04275d7efccee89e5302a66aae.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689690,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689690-0l5uct",
						"name": "AgADCiAAAjpKmFU",
						"packet": 1755963689690,
						"url": "https://linux.do/uploads/default/original/4X/e/c/5/ec5385bbed6e39f64bfe66a31c71420c0ce87c5e.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689672,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689672-z83tg7",
						"name": "AgAD2BQAAtgYmFU",
						"packet": 1755963689672,
						"url": "https://linux.do/uploads/default/original/4X/8/4/1/8413f09d6269539e705fbec5842b3524eeaa1a72.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689662,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689662-9amozx",
						"name": "AgADXRcAAvM-mFU",
						"packet": 1755963689662,
						"url": "https://linux.do/uploads/default/original/4X/f/8/a/f8ab3541b1585693622368da32ace9a23a19701d.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689638,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689638-ndb1dv",
						"name": "AgADfiEAAgvZmFU",
						"packet": 1755963689638,
						"url": "https://linux.do/uploads/default/original/4X/c/5/3/c538ae62620cf2b5d13b5a435fe5b40bc09cc079.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689607,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689607-3bpgpc",
						"name": "AgADkBUAAmtryFU",
						"packet": 1755963689607,
						"url": "https://linux.do/uploads/default/original/4X/a/2/5/a2566a6b4684f08d86d154921b9bc2f72543b1af.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689595,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689595-be712m",
						"name": "AgADdxoAArWpOFY",
						"packet": 1755963689595,
						"url": "https://linux.do/uploads/default/original/4X/f/2/4/f24fe0935dbf3c0adf6e3479101f7f91e22dc50e.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689583,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689583-uf66tq",
						"name": "AgADZxoAAr40gVY",
						"packet": 1755963689583,
						"url": "https://linux.do/uploads/default/original/4X/9/4/0/9403f245911d0399e0548c6008a25bbdf2e678e5.webp",
						"width": 512
					},
					{
						"addedAt": 1755963689539,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963689539-v1xige",
						"name": "AgADjxUAAs8ZOFY",
						"packet": 1755963689539,
						"url": "https://linux.do/uploads/default/original/4X/a/c/b/acb27d7930e829eaa72aec9e1e1dd755b4d5059b.webp",
						"width": 512
					},
					{
						"addedAt": 1755963682430,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963682430-qlkzc3",
						"name": "AgADeBUAAunsmFU",
						"packet": 1755963682430,
						"url": "https://linux.do/uploads/default/original/4X/0/4/5/0458951da3ca94b70e43216c329e5c9bc93733ec.webp",
						"width": 512
					},
					{
						"addedAt": 1755963682186,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963682186-vw89z8",
						"name": "AgADgRcAAnmPmFU",
						"packet": 1755963682186,
						"url": "https://linux.do/uploads/default/original/4X/7/2/8/728b4a686a56767b6d8ab22ee8f306619768250a.webp",
						"width": 512
					},
					{
						"addedAt": 1755963682052,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963682052-7191gm",
						"name": "AgADRBYAAr40mVU",
						"packet": 1755963682052,
						"url": "https://linux.do/uploads/default/original/4X/c/5/1/c519370a8a2b33da8222997cd93acf3f020e1285.webp",
						"width": 512
					},
					{
						"addedAt": 1755963681956,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963681956-g6xurt",
						"name": "AgADLhYAAlFEmVU",
						"packet": 1755963681956,
						"url": "https://linux.do/uploads/default/original/4X/8/1/9/81972b0c72d7d9e0b9348db7e3b4060346b5f877.webp",
						"width": 512
					},
					{
						"addedAt": 1755963681832,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963681832-bua36i",
						"name": "AgADLBYAAmI0mVU",
						"packet": 1755963681832,
						"url": "https://linux.do/uploads/default/original/4X/a/1/d/a1ddb336785de182db627805b0dca52212c2f602.webp",
						"width": 512
					},
					{
						"addedAt": 1755963681776,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963681776-p4ubd3",
						"name": "AgADiRYAAsJuOVY",
						"packet": 1755963681776,
						"url": "https://linux.do/uploads/default/original/4X/f/e/1/fe18cade56275cae461cff5593f8e7b7b9e8cfe1.webp",
						"width": 512
					},
					{
						"addedAt": 1755963681732,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963681732-4dbi63",
						"name": "AgADPSAAAlLpOVY",
						"packet": 1755963681732,
						"url": "https://linux.do/uploads/default/original/4X/5/2/8/5289fb1d942146a0536d0374a37931de0c268e36.webp",
						"width": 512
					},
					{
						"addedAt": 1755963681677,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963681677-fai6m8",
						"name": "AgADPhkAAkrYOFY",
						"packet": 1755963681677,
						"url": "https://linux.do/uploads/default/original/4X/e/a/7/ea725bbc1509a9825da10449ba7c1b5c818e20df.webp",
						"width": 512
					},
					{
						"addedAt": 1755963681656,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963681656-fmg7t9",
						"name": "AgADlhYAAo3kOFY",
						"packet": 1755963681656,
						"url": "https://linux.do/uploads/default/original/4X/2/7/a/27a322798a344131ccdec6079c85a70586f441d1.webp",
						"width": 375
					},
					{
						"addedAt": 1755963665678,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963665678-niq5ba",
						"name": "AgADmRcAAhElmVU",
						"packet": 1755963665678,
						"url": "https://linux.do/uploads/default/original/4X/1/e/6/1e641faf0a734e62f4406109add26f01f033fe3a.webp",
						"width": 512
					},
					{
						"addedAt": 1755963665459,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963665459-80cobm",
						"name": "AgADBBcAAsxLmFU",
						"packet": 1755963665459,
						"url": "https://linux.do/uploads/default/original/4X/d/8/5/d85b758cc96fdd256ed161de60a2da03ca0c2b0c.webp",
						"width": 512
					},
					{
						"addedAt": 1755963665270,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963665270-puqxoa",
						"name": "AgADWRgAAnqSmFU",
						"packet": 1755963665270,
						"url": "https://linux.do/uploads/default/original/4X/9/d/1/9d1003935cf75357edbff09ac952ac07c86192b9.webp",
						"width": 512
					},
					{
						"addedAt": 1755963665182,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963665182-6j2rlw",
						"name": "AgADShkAAqA5mFU",
						"packet": 1755963665182,
						"url": "https://linux.do/uploads/default/original/4X/2/d/0/2d0d1d209260b5a0f96c2eb32b01adef059d92c2.webp",
						"width": 512
					},
					{
						"addedAt": 1755963665117,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963665117-n38tc3",
						"name": "AgADqRYAAvTHmFU",
						"packet": 1755963665117,
						"url": "https://linux.do/uploads/default/original/4X/d/7/1/d71f1e068825d7817437df96acf5b5306ca0d37d.webp",
						"width": 512
					},
					{
						"addedAt": 1755963665059,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963665059-i8y9uu",
						"name": "AgADNhUAAuHLOFY",
						"packet": 1755963665059,
						"url": "https://linux.do/uploads/default/original/4X/e/6/2/e622fe327a5f4544679fa0043274014beef711a9.webp",
						"width": 512
					},
					{
						"addedAt": 1755963665023,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963665023-yyiqh1",
						"name": "AgADcxUAAq1-yFU",
						"packet": 1755963665023,
						"url": "https://linux.do/uploads/default/original/4X/c/1/b/c1bbb2f141ea71254e8c9d05018ec6438058a16a.webp",
						"width": 512
					},
					{
						"addedAt": 1755963664979,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963664979-tn7prw",
						"name": "AgADLxcAAq3wOFY",
						"packet": 1755963664979,
						"url": "https://linux.do/uploads/default/original/4X/4/3/0/430bb88be8d3a019a6c9121db1eb86ada4fa0974.webp",
						"width": 510
					},
					{
						"addedAt": 1755963664955,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963664955-t6ddp4",
						"name": "AgAD7RsAAqQ1gVY",
						"packet": 1755963664955,
						"url": "https://linux.do/uploads/default/original/4X/1/f/b/1fb55cd796d7b19d78949c0a0cd5ce2cc19a19be.webp",
						"width": 490
					},
					{
						"addedAt": 1755963664942,
						"groupId": "group-1755964482153",
						"height": 479,
						"id": "emoji-1755963664942-luzafd",
						"name": "AgADvBUAAm_RiVY",
						"packet": 1755963664942,
						"url": "https://linux.do/uploads/default/original/4X/4/c/5/4c59dfd52fc64bdd5d59c9955f26411453f09aec.webp",
						"width": 512
					},
					{
						"addedAt": 1755963664917,
						"groupId": "group-1755964482153",
						"height": 509,
						"id": "emoji-1755963664917-40x432",
						"name": "AgADMhcAAmefgFY",
						"packet": 1755963664917,
						"url": "https://linux.do/uploads/default/original/4X/c/1/d/c1d7006b0030a77203462f724aefd29585a4e6d9.webp",
						"width": 512
					},
					{
						"addedAt": 1755963664878,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963664878-g5ez9i",
						"name": "AgADJRUAAh7zmVU",
						"packet": 1755963664878,
						"url": "https://linux.do/uploads/default/original/4X/f/e/1/fe1ec49530bd63f9afc559849517c96e490801d9.webp",
						"width": 512
					},
					{
						"addedAt": 1755963639296,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963639296-hrna6e",
						"name": "AgADnhYAAiZxmFU",
						"packet": 1755963639296,
						"url": "https://linux.do/uploads/default/original/4X/c/b/6/cb637806ee11cc229ffd475e02da86e31cba9241.webp",
						"width": 512
					},
					{
						"addedAt": 1755963638726,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638726-rqsqaw",
						"name": "AgADJRcAAvVOmVU",
						"packet": 1755963638726,
						"url": "https://linux.do/uploads/default/original/4X/1/8/6/186a4765c8c8b6d7931a6b2b243c3d7a213debcc.webp",
						"width": 512
					},
					{
						"addedAt": 1755963638520,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638520-y4vyq5",
						"name": "AgAD_RUAAvHumFU",
						"packet": 1755963638520,
						"url": "https://linux.do/uploads/default/original/4X/9/8/d/98d00304cb89593997452c643f86e04362bafd93.webp",
						"width": 512
					},
					{
						"addedAt": 1755963638359,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638359-n6jeac",
						"name": "AgADLRcAAvNBmVU",
						"packet": 1755963638359,
						"url": "https://linux.do/uploads/default/original/4X/9/e/0/9e088e80c249df21a919ba22ba2b56d08e32f4c2.webp",
						"width": 512
					},
					{
						"addedAt": 1755963638305,
						"groupId": "group-1755964482153",
						"height": 509,
						"id": "emoji-1755963638305-kwudyk",
						"name": "AgADuBkAAqwSOVY",
						"packet": 1755963638305,
						"url": "https://linux.do/uploads/default/original/4X/d/a/0/da0c25e007f60e1fd31bf3bf77cffbabe63889bd.webp",
						"width": 512
					},
					{
						"addedAt": 1755963638179,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638179-l1khx3",
						"name": "AgADkRoAAmJ9OVY",
						"packet": 1755963638179,
						"url": "https://linux.do/uploads/default/original/4X/5/f/a/5fab852ddb2dbc93bb856a841becfa29b4948154.webp",
						"width": 512
					},
					{
						"addedAt": 1755963638137,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638137-3dr6u3",
						"name": "AgAD6BoAAhnzQVY",
						"packet": 1755963638137,
						"url": "https://linux.do/uploads/default/original/4X/3/f/8/3f80056349970d01dd7e01186370804fda86a30e.webp",
						"width": 512
					},
					{
						"addedAt": 1755963638056,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638056-nnvwe0",
						"name": "AgADdhoAAgUJOFY",
						"packet": 1755963638056,
						"url": "https://linux.do/uploads/default/original/4X/c/6/e/c6edf95b08711765859e6bc55dc3d811bc93d7d3.webp",
						"width": 470
					},
					{
						"addedAt": 1755963638033,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638033-cswoji",
						"name": "AgADaBcAAl7dOFY",
						"packet": 1755963638033,
						"url": "https://linux.do/uploads/default/original/4X/a/5/a/a5ad4618f790fcf5a2e87516af8ae69b7ea4d4d8.webp",
						"width": 478
					},
					{
						"addedAt": 1755963638010,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963638010-dunv6o",
						"name": "AgADbBcAAl3QmFU",
						"packet": 1755963638010,
						"url": "https://linux.do/uploads/default/original/4X/4/8/0/48036ddda1cad7838af1031efbcf0a5698be9fdd.webp",
						"width": 512
					},
					{
						"addedAt": 1755963613884,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963613884-4zlzct",
						"name": "AgADkBIAAp84mFU",
						"packet": 1755963613884,
						"url": "https://linux.do/uploads/default/original/4X/3/9/c/39ca5639dcc7dfc55116d26304421fb132265ac8.webp",
						"width": 512
					},
					{
						"addedAt": 1755963613879,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963613879-6vqvv1",
						"name": "AgADlR4AAk5dmVU",
						"packet": 1755963613879,
						"url": "https://linux.do/uploads/default/original/4X/4/7/9/479db9ecd7d76ff88d46d5806e0398e48ae2f942.webp",
						"width": 512
					},
					{
						"addedAt": 1755963613875,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963613875-0b0wlg",
						"name": "AgADkxQAAn4OmVU",
						"packet": 1755963613875,
						"url": "https://linux.do/uploads/default/original/4X/3/9/0/390d190b925caae7ad8b858686600826adc1e657.webp",
						"width": 512
					},
					{
						"addedAt": 1755963597871,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963597871-p0wdmv",
						"name": "AgAD_xgAAuG0mFU",
						"packet": 1755963597871,
						"url": "https://linux.do/uploads/default/original/4X/e/6/e/e6ebbc5545f409712d7ea536276c0fafddc334a2.webp",
						"width": 512
					},
					{
						"addedAt": 1755963597866,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963597866-k7wibl",
						"name": "AgADNBQAAoRXmFU",
						"packet": 1755963597866,
						"url": "https://linux.do/uploads/default/original/4X/f/b/7/fb74d88e0db442c2aa2562fc1ba9ee942a3ff736.webp",
						"width": 512
					},
					{
						"addedAt": 1755963597856,
						"groupId": "group-1755964482153",
						"height": 501,
						"id": "emoji-1755963597856-68uui2",
						"name": "AgADCRUAAm7W0FU",
						"packet": 1755963597856,
						"url": "https://linux.do/uploads/default/original/4X/3/4/8/348b71c48260639d4f6a09d318c618a30d85ee19.webp",
						"width": 512
					},
					{
						"addedAt": 1755963597849,
						"groupId": "group-1755964482153",
						"height": 512,
						"id": "emoji-1755963597849-qdu4ct",
						"name": "AgADzxIAAlC90VU",
						"packet": 1755963597849,
						"url": "https://linux.do/uploads/default/original/4X/5/3/7/537f2364041d4a944c67003f3be0b26076641392.webp",
						"width": 512
					}
				],
				"icon": "✈",
				"id": "group-1755964482153",
				"name": "菲比",
				"order": 4
			},
			{
				"emojis": [
					{
						"groupId": "group-1755913842696",
						"height": 258,
						"id": "emoji-1755913856755-lr954c",
						"name": "AgAD_QQAAg_S-VQ",
						"packet": 1755913856755,
						"url": "https://linux.do/uploads/default/original/4X/3/e/d/3ed152459c7121033fa35002eb7acc4b35773ee9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 260,
						"id": "emoji-1755913856755-hcs7l3",
						"name": "AgAD_w8AAjE9kFc",
						"packet": 1755913856755,
						"url": "https://linux.do/uploads/default/original/4X/1/6/e/16e8a1f18341b8b41323d05d86f79c377975b78e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856755-a28ott",
						"name": "AgAD3gUAAvEC-VQ",
						"packet": 1755913856755,
						"url": "https://linux.do/uploads/default/original/4X/9/0/4/904a911c5cffab53e5272c9a1cf7d4182fda06b8.webp",
						"width": 459
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-q4s89w",
						"name": "AgADbQUAAkYU-VQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/c/3/8/c38f18581aafd9d9eae31b67c91261cc336072b6.webp",
						"width": 460
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-ok0z2j",
						"name": "AgADCgcAAgX0AAFV",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/8/0/a/80a5eb83ed59d1ca4715b58829bf755faf87682d.webp",
						"width": 501
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-lxs3jx",
						"name": "AgADDAgAAno7-FQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/7/d/0/7d096a7356cea2cf46d8df572ea12fbc5b97237c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-f3ujmn",
						"name": "AgADdAUAAiuoAVU",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/d/e/b/deb4289423fb1c74f8c107bfa1b8ef7c177a7cc4.webp",
						"width": 454
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-19ltgn",
						"name": "AgADlQUAAqHBgFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/5/b/d/5bdd44d8c19f71c90aff743baabc649bb4cf8a09.webp",
						"width": 409
					},
					{
						"groupId": "group-1755913842696",
						"height": 488,
						"id": "emoji-1755913856756-yqgkr0",
						"name": "AgADQggAAskbAVU",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/a/3/4/a3490252f4b87ae7d91d39aa334702d099366c37.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-irhshh",
						"name": "AgADsAUAAmuJgVQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/6/a/f/6af09e5e241ed05f86e9fd96352a8dff067679aa.webp",
						"width": 502
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-98a7cj",
						"name": "AgADnRIAAqxuWVU",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/e/6/1/e61c1a765f2942ad8f73047abe1b41d847091922.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-i95cmk",
						"name": "AgADWhAAAuTfkFY",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/5/e/f/5ef5cf4dd609ae621554d7ccb5f45a8ade2e09a8.webp",
						"width": 498
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-o01woz",
						"name": "AgADywUAAiyDAVU",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/0/0/9/009e08559921e1ae33128272ec53643636454694.webp",
						"width": 460
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-ztntwh",
						"name": "AgAD3AMAAiGJSFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/5/6/2/562249d3017c8c068664fc9dd721a6501826b595.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-7wo2sj",
						"name": "AgAD4xQAAkWD8VQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/a/8/3/a83e941bd97044e633ee14640ff7545174fdd72b.webp",
						"width": 508
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-7uitv6",
						"name": "AgAD6REAAv8biFc",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/c/9/6/c9638268cb6351ce2a06e44c3429c2992332758b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-e0329h",
						"name": "AgAD9gMAAhJMQVQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/d/4/a/d4a1bc727a0c0c134acece622b3f024290ec4ff2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 298,
						"id": "emoji-1755913856756-zyef72",
						"name": "AgADDwUAAulNQFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/e/0/e/e0ea41a8b3f9bf11cbb9e9f85731c438d4ad12d4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-t3vz6x",
						"name": "AgADggUAAps7SFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/b/9/a/b9a15a27153f05807b794d90be77174da163d3a7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-m35r8q",
						"name": "AgADGwUAAs5nSFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/0/9/c/09c0d494e06159fe5f5c36762c9d75bbc2c347ad.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-1czlh8",
						"name": "AgADIgUAAkPbSFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/a/e/7/ae7b9564674ffe81f274d1f20f84ce530c23e3a4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-7v618p",
						"name": "AgADkBYAAkE08VQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/7/e/5/7e550c358db89aaf61c67922daa40f1e96e8b062.webp",
						"width": 509
					},
					{
						"groupId": "group-1755913842696",
						"height": 435,
						"id": "emoji-1755913856756-oo656e",
						"name": "AgADMQUAAjSiSFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/a/6/b/a6bacbead76d6db81ec72616b53f6ba3af926a1d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 491,
						"id": "emoji-1755913856756-tyur1v",
						"name": "AgADnhMAAsWa8FQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/6/d/0/6d09ef6b36d6c0da0604a48e1d58bb65ed6d9fb3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-vusz1b",
						"name": "AgADPQUAAhDLQFQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/3/1/c/31c69623790e7cd43d9232d1fc7542490a475840.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-4vp2fq",
						"name": "AgADuxAAAmzbyVQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/e/d/b/edbb7a3c061cce46b17201c094866a4819b88b31.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 428,
						"id": "emoji-1755913856756-f65g24",
						"name": "AgADvxUAAiJ38FQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/9/d/1/9d1edacf2760f23850d5bfb6b7b0aa3dfd3c3908.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856756-mb2l1h",
						"name": "AgADXxYAAobq8VQ",
						"packet": 1755913856756,
						"url": "https://linux.do/uploads/default/original/4X/0/9/d/09d6da84e928ee8d48f120830848851a70baea3f.webp",
						"width": 376
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-bz5td6",
						"name": "AgAD1QMAAh80SVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/6/0/d/60da9d9bf003ba40be9f1c9dd407df46de1be44c.webp",
						"width": 442
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-y54dab",
						"name": "AgAD0gcAAm79SFQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/9/2/8/92815c3545f436fb4af71749ad86f1f8133c7a86.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-bcjpz9",
						"name": "AgAD7AQAAqToSFQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/1/d/2/1d26e12106fc063b32cc7f018b98a2a9a9d037ed.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-8c4ff1",
						"name": "AgADEwQAAkwwQFQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/7/1/a/71a31d4978b3bb3f6705a5d03a75cb6b7f542eec.webp",
						"width": 511
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-89xg5k",
						"name": "AgADGBMAAi6JuVY",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/0/c/8/0c860a69853c320edd45ccb62dd22e4bb240bc54.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-0le4h2",
						"name": "AgADGwUAAlcSQVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/2/9/a/29a1794ffcc2774cda05e01e1742f50ca69e88d0.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-zsin7o",
						"name": "AgADHgUAAstPSVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/a/a/1/aa17783a7d24f94836a8580edfbd125d62a11729.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-2shroc",
						"name": "AgADixUAArWK8VQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/8/3/2/83263826edb6d7d3cb238d2a7ab805b03453d710.webp",
						"width": 438
					},
					{
						"groupId": "group-1755913842696",
						"height": 428,
						"id": "emoji-1755913856757-rkbxju",
						"name": "AgADvxUAAiJ38FQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/9/d/1/9d1edacf2760f23850d5bfb6b7b0aa3dfd3c3908.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-5k9rxh",
						"name": "AgADLgYAAvcoSVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/a/4/1/a41b3e07454fa6f0280bef9d61851878631b9a16.webp",
						"width": 477
					},
					{
						"groupId": "group-1755913842696",
						"height": 497,
						"id": "emoji-1755913856757-e6ibxj",
						"name": "AgADMxAAAmKIgFc",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/6/a/8/6a8cd50c97cfa4fafb5af181f8bf52f9ef3efc30.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 506,
						"id": "emoji-1755913856757-zgkuym",
						"name": "AgADpRMAApqi8FQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/4/e/a/4eae43d16f420808435c20ad4b7011319419890b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 425,
						"id": "emoji-1755913856757-87mmnl",
						"name": "AgADqQ4AAkEegFc",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/c/5/a/c5a417289a6a9d20f638586846be97720192d97c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 449,
						"id": "emoji-1755913856757-l5j07j",
						"name": "AgADRg4AAoJqgVc",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/8/5/8/85860888173b8e9209d1231fa7c8829e0bcdb1d7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-a03cca",
						"name": "AgADvgQAAoPgSFQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/a/5/9/a59fb1d6e30747f9ecd78c6d055e475ac16a99eb.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-zrivg4",
						"name": "AgADWQQAArUDSVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/f/2/b/f2bb79793f6187ee1911146d23a388e80bd85363.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 510,
						"id": "emoji-1755913856757-9jkm7e",
						"name": "AgAD0AQAAorfSFQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/0/a/e/0ae15c2fb14e4c597688f2f6bd20886fe0d3305b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-tuh4h2",
						"name": "AgAD0wQAAv0hSVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/a/6/9/a69a9478564ed6429d9ef2754d87609d5168da44.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-o3hphi",
						"name": "AgAD5A8AAiRhiVc",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/0/e/8/0e81b2ca6f90d0113b7aa70155bc6a418c73907c.webp",
						"width": 477
					},
					{
						"groupId": "group-1755913842696",
						"height": 471,
						"id": "emoji-1755913856757-tcldcu",
						"name": "AgAD6QMAAtePSVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/3/4/6/34667c59eaadbe1086cc0fea2dec4485efb71a9e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 337,
						"id": "emoji-1755913856757-te0lo0",
						"name": "AgAD9xkAAmp1uVY",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/f/d/3/fd3b592b23a69f85001810f50d24782f616f1ffc.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 420,
						"id": "emoji-1755913856757-ccqajk",
						"name": "AgADchMAAhdQsFY",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/d/9/c/d9ca23a534997fe58e2128ddc2d161c84884d608.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 413,
						"id": "emoji-1755913856757-n076tx",
						"name": "AgADEBYAApdHuFY",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/e/6/e/e6e4f6ab0f478d88b372f6f67dc2a0accd1ae8b4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-154pio",
						"name": "AgADehgAAh_O8VQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/1/a/f/1af1a606593d0246485b5b10855c8650561e5553.webp",
						"width": 469
					},
					{
						"groupId": "group-1755913842696",
						"height": 384,
						"id": "emoji-1755913856757-cs5o0h",
						"name": "AgADOxYAAsfb8VQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/2/c/8/2c8f03283e434972856a2d35b81ffbaef26b70a0.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-i8w7yt",
						"name": "AgADfRQAAsXV8VQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/0/9/9/099720e849c8fd8f27a499896091afd0f4bfd86d.webp",
						"width": 384
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856757-jebm80",
						"name": "AgADfBQAAkG7yVQ",
						"packet": 1755913856757,
						"url": "https://linux.do/uploads/default/original/4X/f/0/b/f0b39a72f20433cd2ae94b4f9938fa4a1b8f2d69.webp",
						"width": 487
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-4dn5nd",
						"name": "AgADqRMAAhZR8VQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/e/f/6/ef6ddce4c70b76e58994f9fdcadd6b9ce5d8d154.webp",
						"width": 452
					},
					{
						"groupId": "group-1755913842696",
						"height": 488,
						"id": "emoji-1755913856758-yz2mb4",
						"name": "AgADvhEAAlHwiVc",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/0/5/b/05bf166ad40dda6b80e3ccaf8adcb26ded625127.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-6tzqjj",
						"name": "AgADyRYAAr-0sFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/3/2/5/325711c4019430258d77c554063919a8722a88ae.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 507,
						"id": "emoji-1755913856758-1c72ln",
						"name": "AgAD9RUAAkGRsVY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/9/8/6/986c92ed6bdb80c4ba649266d6e65a0217b4cc65.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-kmdivv",
						"name": "AgADDQUAAiTGSVQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/a/c/7/ac7d815e7993c52059fdbbb1d0228fd0a94e1934.webp",
						"width": 424
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-or4fm3",
						"name": "AgADGRcAAjAR8FQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/0/e/7/0e7cb4c4c9b49b2e177202d10e109e99f3a0e618.webp",
						"width": 459
					},
					{
						"groupId": "group-1755913842696",
						"height": 389,
						"id": "emoji-1755913856758-cqa0rs",
						"name": "AgADGRYAAlITuFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/d/7/4/d74d0dab32144bafcad1b73435d030df34bc197e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 474,
						"id": "emoji-1755913856758-2jhxc7",
						"name": "AgADGxgAAqdlsFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/4/9/6/496755841a2823e2e4cf475bbb2009b261910469.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 487,
						"id": "emoji-1755913856758-wft15g",
						"name": "AgADixgAAjXeuFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/f/4/a/f4a4823e5472f33c550aa4679006329412b8a50d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-mj1edu",
						"name": "AgADlhUAAg376VQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/6/3/2/63285f616680c0c31f9a2414b738fe46eaa6e71a.webp",
						"width": 454
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-ij0lju",
						"name": "AgADmhkAAsdesFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/3/2/e/32e4aea3f2aee7b04e5d844a804c70f078bd039f.webp",
						"width": 452
					},
					{
						"groupId": "group-1755913842696",
						"height": 330,
						"id": "emoji-1755913856758-rc8jnw",
						"name": "AgADHxQAAmLgyFQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/c/1/6/c16a9405a9455fef3ea7bc172a52119ba2c72e2b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-jrw1cl",
						"name": "AgADrhsAAmJ88FQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/4/f/7/4f7a7b546b991608565fe3e54eac3990cba0251e.webp",
						"width": 439
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-qg23n2",
						"name": "AgADsxQAAgS4sFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/3/e/0/3e07b0749b56692483ff19f79a9527053d24e3c3.webp",
						"width": 503
					},
					{
						"groupId": "group-1755913842696",
						"height": 373,
						"id": "emoji-1755913856758-o6w74s",
						"name": "AgADYQUAAhDSQFQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/4/e/a/4eab60f2a7fe7c865f711cf0fc3d7d4acb93fee3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 433,
						"id": "emoji-1755913856758-6jbp8a",
						"name": "AgADYxgAAkCYsVY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/2/8/5/285f521b6fff260c3e621ee8607b075677abee1c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-6jv5wn",
						"name": "AgAD4xQAAkWD8VQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/a/8/3/a83e941bd97044e633ee14640ff7545174fdd72b.webp",
						"width": 508
					},
					{
						"groupId": "group-1755913842696",
						"height": 461,
						"id": "emoji-1755913856758-tz3rbo",
						"name": "AgAD1xYAAgq5sVY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/7/0/4/704fe82d99e653da1afb53c217b3a83015d090a7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-7mvn5q",
						"name": "AgADHQQAAhPGSVQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/a/f/8/af8d7cf38fe4fcad5fe4c30386d2adff429763b7.webp",
						"width": 495
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-8p2hsn",
						"name": "AgADzhUAAgOR8VQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/b/8/2/b82572879e2ad08083dcb4354737e0084fa7f41e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 467,
						"id": "emoji-1755913856758-6uau9s",
						"name": "AgADIxgAAgcvuFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/b/6/b/b6b29249cea06122cf577582b6a22b771c594317.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-h3vhby",
						"name": "AgADJxsAAh27iVY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/8/5/5/855c3086c882dc7c8c184d0606243bf491e28566.webp",
						"width": 505
					},
					{
						"groupId": "group-1755913842696",
						"height": 492,
						"id": "emoji-1755913856758-seku8e",
						"name": "AgADQBcAAqqpsVY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/1/3/7/137b9e91f7754b379537e6f57e9696ad74aa6909.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-d4m8mg",
						"name": "AgADQRUAApPuyFQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/5/2/7/52740c5876b853484bcbbb1e343118763e2cb24c.webp",
						"width": 507
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-6moz1v",
						"name": "AgADQwQAAgn-QVQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/b/0/d/b0d379585fe5ba65e3d18b7e023d47644014b2f3.webp",
						"width": 495
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-ivvy01",
						"name": "AgADuwUAAt4CSVQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/2/1/c/21c6cd1efb808373919f920e30c79d3f5fc25af5.webp",
						"width": 411
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-i6zamu",
						"name": "AgADYxQAAnuLIFU",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/a/4/c/a4c9444a631c80603cbd8354e3580f489938f713.webp",
						"width": 443
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-4596e2",
						"name": "AgAD4g4AAgURiVY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/f/4/8/f485c84625c884b09c715da653d82aa1d90cbc14.webp",
						"width": 438
					},
					{
						"groupId": "group-1755913842696",
						"height": 483,
						"id": "emoji-1755913856758-gs6jj7",
						"name": "AgADjhQAAglkwFQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/b/9/c/b9c0c584aa4fb54610d89d1f3cc25006131c8b68.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 512,
						"id": "emoji-1755913856758-5gbp8f",
						"name": "AgADNhkAAnwMsFY",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/f/6/2/f621cd11932e7dbcb21f7c622f1c16c09db901c5.webp",
						"width": 474
					},
					{
						"groupId": "group-1755913842696",
						"height": 466,
						"id": "emoji-1755913856758-qtj8c2",
						"name": "AgADBAQAAv41SVQ",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/a/0/3/a0321b1a58d3cff8a3ca814a1bfc74f02d7c28da.webp",
						"width": 512
					},
					{
						"groupId": "group-1755913842696",
						"height": 498,
						"id": "emoji-1755913856759-bwhnao",
						"name": "AgADVBEAAvlmiVc",
						"packet": 1755913856758,
						"url": "https://linux.do/uploads/default/original/4X/8/b/d/8bd0dadbe3df5464dd02c768fbda4de46ae00f50.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1755913842696",
				"name": "黄",
				"order": 5
			},
			{
				"emojis": [
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115404-kvlg1r",
						"name": "AgADqQwAApJ7sVM.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/4/7/f/47f85c02ad2889c8a30442ae6377ee57683feb71.webp",
						"width": 439
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115404-5pawqs",
						"name": "AgADeAMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/c/3/4/c34bcd0fdcf877521b900925bbc43d354a0cf7c4.webp",
						"width": 409
					},
					{
						"groupId": "group-1755970088527",
						"height": 438,
						"id": "emoji-1755970115404-hxp4dy",
						"name": "AgADewMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/a/e/6/ae679ffc737aab701776c76e0cda174c25a84b0e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 324,
						"id": "emoji-1755970115404-849fhs",
						"name": "AgADbwMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/4/5/2/45266699df7ede8d2b15748c6a1605ac56a31a4a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115404-gyj830",
						"name": "AgADcAMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/e/0/a/e0a1e06e02dab870f9d6503300dfc0167d68e288.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 361,
						"id": "emoji-1755970115404-723awi",
						"name": "AgADFgMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/d/4/b/d4b2400918d77af9c252068e5609a1b43c803212.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 360,
						"id": "emoji-1755970115404-lz2nwi",
						"name": "AgADFQMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/0/e/e/0ee2d4e237d29f0c6dabdb8d25a138564771e384.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 393,
						"id": "emoji-1755970115404-c20bed",
						"name": "AgADFwMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/f/9/6/f96d50082cf5b841199b0697a51ce9ff67ac608d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115404-jmuggv",
						"name": "AgADKgMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/5/0/1/501565777d411c23a0dae087a02fd3870dc143cb.webp",
						"width": 432
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115404-unkhxa",
						"name": "AgADKQMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/7/e/2/7e2a11ddbcb2da855506869f20bbad100474d1d0.webp",
						"width": 469
					},
					{
						"groupId": "group-1755970088527",
						"height": 409,
						"id": "emoji-1755970115404-4xltp8",
						"name": "AgADWAMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/8/7/a/87ad10baaf2f3fc85337a29a72ab2880c784c56b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115404-cf8kgu",
						"name": "AgADWQMAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/6/5/1/6512313cd17fe8ea269e53359ba043e6dcf9198c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 438,
						"id": "emoji-1755970115404-it6mgh",
						"name": "AgAD0QIAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/5/0/0/5009c9cbe2ed6ec5a91b90bcb121db5f8498a3b1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-blelg1",
						"name": "AgAD1wIAAkIwQiU.webp",
						"packet": 1755970115404,
						"url": "https://linux.do/uploads/default/original/4X/8/4/3/843fe2f33e5b4e7da234a1939684ac27dd6d8e0a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-rlaoqu",
						"name": "AgAD2gIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/8/6/1/8618f878114fbb13982f593754b40423eab15c43.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 365,
						"id": "emoji-1755970115405-5g5yz8",
						"name": "AgADCwMAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/8/6/d/86d6ab9bb394ee16e7674fa03f42ccb9be002bd3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-ngzjfa",
						"name": "AgADDAMAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/d/d/9/dd9a3f3779dfd325b0b0cd45bbb0cc1334eb1318.webp",
						"width": 469
					},
					{
						"groupId": "group-1755970088527",
						"height": 384,
						"id": "emoji-1755970115405-9q8gwi",
						"name": "AgADDQMAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/e/9/4e9c914eb902482d7c5e31722958815440938a70.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-khayfe",
						"name": "AgADzwIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/0/e/b/0eb5c2aeca817672af46af07abb25496df39ef58.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-m8m6xx",
						"name": "AgADqgIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/8/c/a/8ca50c8c6f4de879b91ed219503020472a466b3e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 375,
						"id": "emoji-1755970115405-f88kuq",
						"name": "AgADrgIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/2/3/e/23e3310bfa7cc1198f66e8b21157cf73cd103965.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-uw4l9e",
						"name": "AgADrwIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/b/b/1/bb1969d85417f73ab14c6efaf506e98256166ee8.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 195,
						"id": "emoji-1755970115405-c2t4qz",
						"name": "AgADzgIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/0/a/4/0a41d5c2f65bcb993dd0b08cfb6a986c3840a383.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 402,
						"id": "emoji-1755970115405-k4okaf",
						"name": "AgADmAIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/5/9/a5994275c8a3a2223197a33ef584f274b613dfb0.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 457,
						"id": "emoji-1755970115405-woq3ow",
						"name": "AgADXAIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/e/1/ce102ad04e0be8517561cbf9688b39146aebb2f0.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-466kme",
						"name": "AgADXQIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/b/f/9/bf920108bb3ef55c523b9985178d9f1297d17582.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-r70yb8",
						"name": "AgADXwIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/5/d/35dce3d6a54b5c419c41b4acf3d8df3adebd17d2.webp",
						"width": 465
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-80wco5",
						"name": "AgADYAIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/a/c/9ac16075f7b72cced059b436bd1589368f9c9da1.webp",
						"width": 465
					},
					{
						"groupId": "group-1755970088527",
						"height": 438,
						"id": "emoji-1755970115405-x62gf2",
						"name": "AgADYQIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/8/6/a861f39b64a84035fcde80a39609b00b694cdf50.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-msknqs",
						"name": "AgAD1wEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/3/7/937c9601822d12d25e39c1f7076e41d323258210.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-xnulbp",
						"name": "AgADJwIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/2/4/92427d021a8f39acd66a4b5a851b3f5a27d87ac4.webp",
						"width": 393
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-vna2ga",
						"name": "AgADKAIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/e/b/3/eb3c0e42dbacc060ac85c342bc6e7b08d634aab8.webp",
						"width": 365
					},
					{
						"groupId": "group-1755970088527",
						"height": 409,
						"id": "emoji-1755970115405-pue8xi",
						"name": "AgADKwIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/e/e/9ee5849f0ecc7a8ea27c589fb4f974fce92e366e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-lwc0af",
						"name": "AgADNAIAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/1/c/a/1ca6d839719bfe09ccc795d256d012c6abb47be7.webp",
						"width": 469
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-180fd1",
						"name": "AgAD1QEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/e/5/d/e5db24173bc27ea408a9189f9f7568fd59e42e0c.webp",
						"width": 465
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-b6vg2a",
						"name": "AgADaAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/e/5/2/e528b994479b13b661f0788529ff17cdd9b5f1ac.webp",
						"width": 469
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-lrmctb",
						"name": "AgADegEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/0/e/40e27f686d6e11950a547dbdfb6669bc2be02267.webp",
						"width": 393
					},
					{
						"groupId": "group-1755970088527",
						"height": 465,
						"id": "emoji-1755970115405-y2b25p",
						"name": "AgADOgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/3/b/43bd6b33b09e2f54f75abe9a0e78a8c8c9db0c91.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 384,
						"id": "emoji-1755970115405-mc51tr",
						"name": "AgADOQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/0/6/c06a133c69013fb341897feba66c4602b29ae1c2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-9nykgd",
						"name": "AgADPAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/6/a/9/6a92fb12eba1dbf8c94213762c8158f3ba3119fc.webp",
						"width": 469
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-xzgj76",
						"name": "AgADWAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/f/1/af16e90d70cadb394053abd0f00156f5c0f2c3ed.webp",
						"width": 469
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-gsd665",
						"name": "AgADWgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/0/f/6/0f6ee9c4c2417dd816d63769f653aad04e94c588.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 331,
						"id": "emoji-1755970115405-dkhd0b",
						"name": "AgADWwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/6/6/1/661e6890e7d04203b7460db0f3051158169b7f08.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 341,
						"id": "emoji-1755970115405-hq23y7",
						"name": "AgADYwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/1/4/a1478b52d7e855b14d3e4f279778cf0a2ccb85ef.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-xo4osk",
						"name": "AgADZgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/2/7/3/27353cabdcc7d26513977b8f5894d8d8c3e9b3dd.webp",
						"width": 418
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-8xf8rp",
						"name": "AgADZwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/b/1/a/b1a8736efaac27ed92923ad21a010fdbbced9248.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 432,
						"id": "emoji-1755970115405-b6iphy",
						"name": "AgADUAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/7/c/37c9cba13e99cb43401502b9f47158e541a3b4ad.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 384,
						"id": "emoji-1755970115405-3ntxzh",
						"name": "AgADUgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/7/c/4/7c4ecde54c90629bf6792298b187f50f5778541a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 461,
						"id": "emoji-1755970115405-5k551k",
						"name": "AgADUwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/e/2/ae27dade8b2aa73e2cce79366c40319eb55e2845.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-6na3ks",
						"name": "AgADVAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/2/3/9236fc229532afadc9b7d30d0eb85a23ee1e1177.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-jvzpw2",
						"name": "AgADVQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/5/5/7/557abd81f411b800f57b1aa6636530f2595b6c1b.webp",
						"width": 465
					},
					{
						"groupId": "group-1755970088527",
						"height": 469,
						"id": "emoji-1755970115405-wtevd3",
						"name": "AgADVwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/8/2/3/823e048fead167848bac50a05c088f7185eb2a79.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 393,
						"id": "emoji-1755970115405-mkslmz",
						"name": "AgADRAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/5/b/4/5b414f4739e63d8e2b170ae8d917a9ac340f76ee.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 393,
						"id": "emoji-1755970115405-zfqebb",
						"name": "AgADRwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/2/1/7/217ce4d828ee833ce54e931e440eb092dd48c74c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-i94iic",
						"name": "AgADSAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/e/b/a/eba8c7d3871bea6d7ee755f7ef85a2e1e4c9afda.webp",
						"width": 409
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-jmou6e",
						"name": "AgADSgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/5/f/35f244a24e9e4ab6f0d48b177063493f03b13dc0.webp",
						"width": 418
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-rdmivg",
						"name": "AgADSQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/9/4/394f8f528ccf55b70f56c2edb2b50c0a8b63a482.webp",
						"width": 409
					},
					{
						"groupId": "group-1755970088527",
						"height": 465,
						"id": "emoji-1755970115405-6r0iwz",
						"name": "AgADSwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/2/6/f/26f79f228c1e9f5bc9a7bdc695e584e3bef1bc48.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 384,
						"id": "emoji-1755970115405-qkrm70",
						"name": "AgADTAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/1/f/4/1f462ea9df95c8e64d47086aaa2c54db1040469e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 433,
						"id": "emoji-1755970115405-gsd0t4",
						"name": "AgADTQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/9/c/99caf0fafbfbd7007fa9c7a769ca4c1b8d53c9c0.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 469,
						"id": "emoji-1755970115405-zzg0fg",
						"name": "AgADPgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/9/d/a9d4ff776e4b9306a6d592745e1bede4456bdb99.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-3urdjn",
						"name": "AgADPQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/1/7/5/175e0c25fce8f5f39b3fc9fea26cbf62d94e6c24.webp",
						"width": 418
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-tf293q",
						"name": "AgADPwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/c/4/cc49b95398f1060e3856553272264cd9e3054eff.webp",
						"width": 460
					},
					{
						"groupId": "group-1755970088527",
						"height": 393,
						"id": "emoji-1755970115405-nw2ya8",
						"name": "AgADQAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/6/5/5/6552dbc0300866a4cf0fb83a30d38326c5817362.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 234,
						"id": "emoji-1755970115405-ydkgwd",
						"name": "AgADQQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/d/e/7/de7f91ce82b10ea50a150c1f0e649536772cb508.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 375,
						"id": "emoji-1755970115405-yunxif",
						"name": "AgADQwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/7/0/f/70fba7a3ed8728e596892c8183dee298a655a4bf.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-65rplj",
						"name": "AgADRgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/5/a/45aba9dd94b4205045e905a1eaf3cc983b492855.webp",
						"width": 465
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-3c404n",
						"name": "AgADRQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/d/8/6/d866974b10ac898e38b0ff9eb50d04e11765b933.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 418,
						"id": "emoji-1755970115405-48qxi3",
						"name": "AgADLwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/5/8/3/5831ef2131d9d6641d641293f07cf5db25f502c2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-njdtzd",
						"name": "AgADMgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/b/1/9b11c1a69fff85f6c9a64957c9224ae3c24f14db.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 375,
						"id": "emoji-1755970115405-eqflig",
						"name": "AgADMwEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/5/6/e/56ee0218d4975be0c51a30229e3b21d3d2b6f0ab.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-w1vda4",
						"name": "AgADNAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/5/7/c57a1410ba2e926dab07e221b47d88b9e3446d64.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 365,
						"id": "emoji-1755970115405-divagc",
						"name": "AgADNgEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/2/1/321b62fddf28a674101e97c20168253dd23f96e8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-c6v3gs",
						"name": "AgADNQEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/6/2/c62097906333b577b6b572479a6ca26efb764354.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 433,
						"id": "emoji-1755970115405-mqbr37",
						"name": "AgADOAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/a/4/3a49beaa6a1c139bbb1fe4c07e84c87d774180b4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-kn7ugn",
						"name": "AgAD8AADQjBCJQ.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/2/f/6/2f666f5c0d051d69b7f44285b03a06cf44c7c8e2.webp",
						"width": 375
					},
					{
						"groupId": "group-1755970088527",
						"height": 216,
						"id": "emoji-1755970115405-wlwnp6",
						"name": "AgAD8gADQjBCJQ.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/2/0/f/20fb54712b2abc1b2367afe246db768d5b517a40.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-gpuq5d",
						"name": "AgAD8QADQjBCJQ.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/0/f/2/0f22d7db2ad2b1848217a3758f1565bc417e0c6e.webp",
						"width": 465
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-wgwz4q",
						"name": "AgAD8wADQjBCJQ.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/d/5/cd5bc18d9886d3925530d495a287167e7b727b7a.webp",
						"width": 460
					},
					{
						"groupId": "group-1755970088527",
						"height": 391,
						"id": "emoji-1755970115405-52dc0j",
						"name": "AgAD9gADQjBCJQ.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/9/7/a9778504f7a823038c9108afe973efbb7d64d39f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 472,
						"id": "emoji-1755970115405-vb9xxx",
						"name": "AgAD9wADQjBCJQ.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/0/0/2/002cce60f5a212e50a0d3f64995659cfac48b134.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 418,
						"id": "emoji-1755970115405-auzu9t",
						"name": "AgADMAEAAkIwQiU.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/b/6/ab624ca429d4f22836a067fd3ec06e4865264021.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-8lqc2v",
						"name": "AgADSQADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/1/b/c1b2f996f9be06df907e5954d2332006f1c9419b.webp",
						"width": 326
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-ru7aw2",
						"name": "AgADSwADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/5/b/a5b9c676fcf848829c2dae1bb1aa3e2beae8da51.webp",
						"width": 494
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-l3vzu5",
						"name": "AgADTQADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/9/3/493e269c32180a15770cc2b61845e3eb901a9bf7.webp",
						"width": 453
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-nqt2ox",
						"name": "AgADPgADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/c/7/a/c7acff8516318a88c390b2f70c0221fc194e7d4a.webp",
						"width": 433
					},
					{
						"groupId": "group-1755970088527",
						"height": 312,
						"id": "emoji-1755970115405-lt1i8w",
						"name": "AgADPwADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/d/e/3de42e68175dbb1352d6bcc7ea09f74aef4049ff.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 453,
						"id": "emoji-1755970115405-j218xq",
						"name": "AgADQgADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/6/1/4/6146e04ea7cdc6309b714d7deab5f8ddb5072246.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 511,
						"id": "emoji-1755970115405-i34r3l",
						"name": "AgADQQADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/1/8/8/18853c77f2bf7386d0280772cbda43ebf0effc64.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 441,
						"id": "emoji-1755970115405-mhmkdg",
						"name": "AgADQwADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/a/7/7/a779221867294c3a496fb3e31246a25cb4c3078b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-xd18kp",
						"name": "AgADRgADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/b/0/a/b0a9dc762db1e3746ef39718f2a28a3ef3d67755.webp",
						"width": 447
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-q8jr8a",
						"name": "AgADRQADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/0/8/908cdcc93f56139b0be28d6904ce662edeb94366.webp",
						"width": 232
					},
					{
						"groupId": "group-1755970088527",
						"height": 432,
						"id": "emoji-1755970115405-k2oo50",
						"name": "AgADRwADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/6/c/a/6ca1e34530b29fa717c543d203b15b154f4b420c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 288,
						"id": "emoji-1755970115405-w29uea",
						"name": "AgADSAADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/4/5/3453bf6e8b3b3a1ced0752c7a07a8c170883831f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-lqhsky",
						"name": "AgADlgADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/0/3/0/0302aff238277efae5b37b5fb0a6dfd8fe249669.webp",
						"width": 437
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-tlfnpm",
						"name": "AgADlwADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/3/1/4319dddb7c3b6106116e497af76f513e14c8175a.webp",
						"width": 347
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-axip0t",
						"name": "AgADmAADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/3/0/6/3064b739b438773260cc8fdc31e757aeff4237a2.webp",
						"width": 326
					},
					{
						"groupId": "group-1755970088527",
						"height": 329,
						"id": "emoji-1755970115405-bh4x1y",
						"name": "AgADmQADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/9/3/49364410f8a2d569dcfcee159d770c62dd13788b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 410,
						"id": "emoji-1755970115405-9plyi5",
						"name": "AgADnAADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/8/7/5/875315a362f045e12ebccaadb8361c21fef8b1ec.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 288,
						"id": "emoji-1755970115405-q2ndzi",
						"name": "AgADngADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/5/9/8/5980653ecbee05cf6e8c51eaca11bac55acc7fcb.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 348,
						"id": "emoji-1755970115405-n5ypaq",
						"name": "AgADnwADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/5/a/9/5a9f31ba830af5e89f772d565eae5e980e8b3993.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-mdcaw5",
						"name": "AgADoAADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/9/3/d/93d6d3968de31226cbb7c6d220fc481ad3f55fbd.webp",
						"width": 390
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-7zvhea",
						"name": "AgADogADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/1/a/1/1a1f237775189efcb2b4f7af460de144818c3bf6.webp",
						"width": 400
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-qw84pa",
						"name": "AgADoQADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/2/d/e/2dec9972a8a0fded82ae092af25120187d3d792f.webp",
						"width": 375
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-ifneh9",
						"name": "AgADowADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/b/c/5/bc527ab1e1cdc6d1d2d4db1621b618f56c4f246a.webp",
						"width": 400
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115405-luqrqi",
						"name": "AgADpAADu6_cBA.webp",
						"packet": 1755970115405,
						"url": "https://linux.do/uploads/default/original/4X/4/c/e/4ce51789b256b47d63a9c589c3e641cdceb55d69.webp",
						"width": 498
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-awzgay",
						"name": "AgADigADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/f/6/7/f675492ca78894d8e04a18f7714db8a30ffe4aad.webp",
						"width": 359
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-uxekwm",
						"name": "AgADiwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/b/2/e/b2ebefad285744c6fcecd7ea8c78dc87cbe17cdc.webp",
						"width": 342
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-2lun36",
						"name": "AgADjAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/e/d/d/edd36ee46e8cd5b72931b22d03f7dab804888def.webp",
						"width": 411
					},
					{
						"groupId": "group-1755970088527",
						"height": 499,
						"id": "emoji-1755970115406-538v8p",
						"name": "AgADjgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/7/0/27037d63ff4abe3c250a36632de9722f4c1dec31.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 498,
						"id": "emoji-1755970115406-hgeymq",
						"name": "AgADjQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/e/6/9/e69dd3f6a073824800eb96df2b18f60ff33f09f0.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-wimjvx",
						"name": "AgADjwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/d/2/e/d2ea4d2ef4f5a3b70082c9d0fff8a06a6c9df8fc.webp",
						"width": 483
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-bon10m",
						"name": "AgADkAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/0/d/a/0da1c01c2c462bd25598a910d8af8b42e7299820.webp",
						"width": 455
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-3axwsd",
						"name": "AgADkgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/c/4/a/c4ac030ee10fd0b5a7fd561dbf42aa4ec089d434.webp",
						"width": 416
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-pyvibx",
						"name": "AgADkwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/9/c/49c4283e989e7ce14782add9daa577332cc6bec4.webp",
						"width": 418
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-y6o9zf",
						"name": "AgADlQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/5/0/2/5020c090c5ebe81ff727514153606592aa266156.webp",
						"width": 427
					},
					{
						"groupId": "group-1755970088527",
						"height": 344,
						"id": "emoji-1755970115406-5gq71q",
						"name": "AgADfAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/b/1/5/b15da1bd05f43019eb1a7145b9d466ec692d8137.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 343,
						"id": "emoji-1755970115406-y2oki9",
						"name": "AgADfQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/7/1/47190959c564e57dc4cb4454b1233e7f6fc28ad1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-v07y7v",
						"name": "AgADgAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/e/8/1e8407f815fb100bab35341cda78240f30687c72.webp",
						"width": 323
					},
					{
						"groupId": "group-1755970088527",
						"height": 474,
						"id": "emoji-1755970115406-pfpk8n",
						"name": "AgADggADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/c/8/f/c8f16dfb9a35b55022dd28347ee337950b47f3a2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-zugo0v",
						"name": "AgADgQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/b/8/f/b8f92e9da5b3a6ea64fb6bfb772df45b7335f0a0.webp",
						"width": 344
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-lrn7n0",
						"name": "AgADgwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/b/b/6/bb64db11f8f73b9e12c8f967659dde92b5cd72e8.webp",
						"width": 407
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-cvboay",
						"name": "AgADhAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/a/0/6/a06fc16390b3168563649c488c3af1b68610db28.webp",
						"width": 320
					},
					{
						"groupId": "group-1755970088527",
						"height": 328,
						"id": "emoji-1755970115406-tasznh",
						"name": "AgADhQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/e/e/9/ee9586fb4032cd7aa4c24f166fb80aa257f50b3a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-w96det",
						"name": "AgADiAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/5/5/d/55d4c9ac1722221a830f7c4bf86a58923e273347.webp",
						"width": 343
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-275dc9",
						"name": "AgADbgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/d/6/2/d6270536f2506d57fb8a8c2c985043ebab114c50.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-ihwbfz",
						"name": "AgADcAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/8/0/6/806c2a0997ca6b8201d9c394dc92d0cb1e1601e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 468,
						"id": "emoji-1755970115406-se6it0",
						"name": "AgADcQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/5/7/a/57a9498314faddb40800f978fe8bfe782978e025.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 386,
						"id": "emoji-1755970115406-wprsic",
						"name": "AgADdAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/8/1/2/8129cbb5b084748d2b21d82e7cae330e6509380a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 436,
						"id": "emoji-1755970115406-l1v64v",
						"name": "AgADdgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/d/3/4d336ac844ed746e58dafaaae9f8d718624d3009.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 374,
						"id": "emoji-1755970115406-l0rzs9",
						"name": "AgADdQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/a/4/2a4eae29edc54ec9de3e531f9c1813c021238d58.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-shmzrh",
						"name": "AgADdwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/c/a/1cafcb08fb3fc27ffea584f7b875d8667a4b9ec6.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 468,
						"id": "emoji-1755970115406-b5r72j",
						"name": "AgADeAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/f/a/2/fa2aa57ea61613e508ea5418f148392dc2a32dab.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 321,
						"id": "emoji-1755970115406-d3rmrk",
						"name": "AgADegADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/e/9/d/e9d6f905cb2d9c48be9538cfd9e5d20ff62fc4ae.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 388,
						"id": "emoji-1755970115406-3nf843",
						"name": "AgADaAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/f/8/1/f81158d32d33ba0ce7372278abe09656fc0f90ed.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 411,
						"id": "emoji-1755970115406-9jj1y9",
						"name": "AgADaQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/0/5/40550894997e1bd6d535a8a2e19e6a604cf1b887.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 370,
						"id": "emoji-1755970115406-cknlgm",
						"name": "AgADbAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/f/0/7/f07d65800879467fe7e6f59345e18f7a07757cbd.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-al2vwe",
						"name": "AgADYQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/f/b/6/fb6a31031b15645643d7bd76f38a33fa83d11b2b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 389,
						"id": "emoji-1755970115406-hfp3el",
						"name": "AgADZAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/f/9/1/f913b1c11dcc08d4717af64d21d82972cba89f73.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 389,
						"id": "emoji-1755970115406-6637ut",
						"name": "AgADZQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/7/9/1/79155919d25a4c7b2d5761ca89bc4dffe3e6ecdb.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 395,
						"id": "emoji-1755970115406-upo8av",
						"name": "AgADZwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/5/2/152955d0a60ea5519d1569cba1ae6578d0fd375e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 461,
						"id": "emoji-1755970115406-zve42q",
						"name": "AgADWAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/b/b/c/bbc607f5e2aec1e79cea3982a2af4bdd36ae95d8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 476,
						"id": "emoji-1755970115406-wuz1qu",
						"name": "AgADWgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/e/9/2e94dc2090bc1ca5d3ccec58bebebdf999a7d975.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 482,
						"id": "emoji-1755970115406-0t09o0",
						"name": "AgADWQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/1/0/210953f9eee716aead104465525464113811997b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 482,
						"id": "emoji-1755970115406-2yuohj",
						"name": "AgADWwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/e/f/1ef8d067ff85187d374ecf887eeb4c670959d33c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-rx8sk7",
						"name": "AgADXgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/8/1/281bac62be98d8793c8674e41a1ec047cbcb257b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 364,
						"id": "emoji-1755970115406-0xe86i",
						"name": "AgADXwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/3/0/6/3061fc0c4a169748a3678a2d734118dc47abb4f8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 301,
						"id": "emoji-1755970115406-f1irov",
						"name": "AgADYgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/a/d/4add7b1c125ba84ff102a33e1cbdf680345e5765.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 490,
						"id": "emoji-1755970115406-vseuqc",
						"name": "AgADTwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/9/b/1/9b1c34591a6a5aaf124cd1afe628e079735ae5d6.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-tf1vx0",
						"name": "AgADUgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/3/4/0/340e4ea91ff685f7b1e3828ee062242d5db27ffe.webp",
						"width": 508
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-s50ejk",
						"name": "AgADUQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/9/5/b/95bf56b2b83bc14db42db3f3dea7c2d5233676aa.webp",
						"width": 481
					},
					{
						"groupId": "group-1755970088527",
						"height": 327,
						"id": "emoji-1755970115406-lald29",
						"name": "AgADVAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/7/4/b/74bfae4dfd186bcb5cbab1dd307fffbfe2f9b31b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-m9v3uw",
						"name": "AgADVgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/8/d/2/8d2cbdbdfc56a0d19037266e7f8f3637755047f9.webp",
						"width": 417
					},
					{
						"groupId": "group-1755970088527",
						"height": 357,
						"id": "emoji-1755970115406-yfq7jl",
						"name": "AgADVQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/5/f/4/5f47ce61590ad6050345031e573b611b296ccad7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 352,
						"id": "emoji-1755970115406-lrdb9e",
						"name": "AgADKwMAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/a/6/7/a6702939142620ebc22995055caba0cbd20f553f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 409,
						"id": "emoji-1755970115406-z3t329",
						"name": "AgAD1gIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/4/c/24c9e05ed8d8a89b64c4933bc5b233330f356cfc.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 472,
						"id": "emoji-1755970115406-s4p1ti",
						"name": "AgAD2QIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/b/c/0/bc09e2c7daf971ae1d1295b04116ce6593027407.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-nbp8bw",
						"name": "AgADqAIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/b/5/2b50541e82a2e5e5ec9e493ea47f4e5a12db81f6.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 433,
						"id": "emoji-1755970115406-uvnovu",
						"name": "AgADsQIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/5/8/9/58907ac28dc8ac9c1beccc3401b19a7009650533.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 472,
						"id": "emoji-1755970115406-hx2lx6",
						"name": "AgADWwIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/3/a/63a4dc9cfb638d84ef67fa1a89053e11a76b8600.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-zewd13",
						"name": "AgADXgIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/c/c/e/cce56fabd93902251218edd34ee9295626a8f8b8.webp",
						"width": 433
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-cv0gz2",
						"name": "AgAD1gEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/7/a/d/7ad866d6de10df79a06710bb02acbbcae2e7b1ba.webp",
						"width": 341
					},
					{
						"groupId": "group-1755970088527",
						"height": 432,
						"id": "emoji-1755970115406-07qa0w",
						"name": "AgAD2QEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/0/3/60306c64aa7be186e681d687bf635513f1a9ccc9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-m4nxv3",
						"name": "AgADKQIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/7/0/4706d515ac3b33e95e6977f8d8f2322c8a2ce384.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 375,
						"id": "emoji-1755970115406-yw723g",
						"name": "AgADLwIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/a/5/5/a553417f010921215dd71994d7787d0a05afbc76.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-gpkdxw",
						"name": "AgADNQIAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/5/e/a/5ea2198b319161521b8d1f5d256e6113cf67c4d4.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 375,
						"id": "emoji-1755970115406-u2m8ri",
						"name": "AgADOwEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/8/d/28de16a9c8a3bb9c28a520a5bc4b6b417d59295f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-3g2qpm",
						"name": "AgADWQEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/7/6/e/76e0ba7dbb70404debc578edbec7e45e826db894.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-t879u2",
						"name": "AgADZAEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/7/6/176f58d10957d0d7486fd085f8571081c1a67e30.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-82c8zg",
						"name": "AgADZQEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/1/4/61498b95456624a010d2ebd8ac616a6122d902b5.webp",
						"width": 418
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-rwo2sh",
						"name": "AgADUQEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/d/d/2dd4b136f8e3564dc7b0cfce32a99d3b68ba4955.webp",
						"width": 402
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-vf5ggm",
						"name": "AgADTgEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/7/6/7/7678f21965fde524393e1c29e6d1de2ddc2acbf8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-fsr7g5",
						"name": "AgADTwEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/d/d/4dd40fe62d7e5694f95167b5a941f1164d74f6b9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-2zi9hp",
						"name": "AgADQgEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/c/f/1cf3d98d3dbd795f3df9ca848c26bbf2e3d42fae.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 393,
						"id": "emoji-1755970115406-hgg5n2",
						"name": "AgADMQEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/b/b/6bbd5223dcaf94ce6a3f969d6562fc893f17a096.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 384,
						"id": "emoji-1755970115406-iegn4g",
						"name": "AgADNwEAAkIwQiU.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/2/1/12195a26cce2b89f606c8fb35acb41ab6c77dc06.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-8xwa2r",
						"name": "AgAD9QADQjBCJQ.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/8/1/9/819d57e785655e93392fab04171979b18557c773.webp",
						"width": 418
					},
					{
						"groupId": "group-1755970088527",
						"height": 387,
						"id": "emoji-1755970115406-urtw10",
						"name": "AgADpQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/0/a/3/0a36f3274155533c7ef2b3088eb702668e1422d2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 288,
						"id": "emoji-1755970115406-m17rym",
						"name": "AgADRAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/6/8/468960f9585e607d55e820b25559888a53c63649.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-tpjy43",
						"name": "AgADSgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/9/3/1/931028cbc050c6c56f1120d2a9e0a3d53427ed9c.webp",
						"width": 460
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-f0lqn8",
						"name": "AgADmwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/8/7/2/872fee291cb275ef18230b5d1a48d732c12d0b81.webp",
						"width": 280
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-lp5z2w",
						"name": "AgADkQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/8/b/48bb8ead276f763c232a3d2e1b80e4d850d46ecb.webp",
						"width": 364
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-ych6zx",
						"name": "AgADlAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/e/9/1/e91a9029bf89a5ccae1a5428862b1470e3fbc4f1.webp",
						"width": 440
					},
					{
						"groupId": "group-1755970088527",
						"height": 288,
						"id": "emoji-1755970115406-0ry9cb",
						"name": "AgADfgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/5/6/6562bea8077c0a8c073c32912f8126bcb304a62f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 397,
						"id": "emoji-1755970115406-1wt36b",
						"name": "AgADhgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/c/3/4/c341a04fef4fa6c1930aa17da567ec6b3dda638b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-jp0ras",
						"name": "AgADhwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/7/6/676491cb3d479e83de489c95cf2ff8b1fa4c273f.webp",
						"width": 413
					},
					{
						"groupId": "group-1755970088527",
						"height": 469,
						"id": "emoji-1755970115406-xzjmz8",
						"name": "AgADbwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/a/9/1/a91cb87d6270cdd0dbcfc54371cd9e2cb4e9236a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-rrf8mo",
						"name": "AgADcwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/1/f/f/1ff04693abba581b81985833245e68118a7a94ef.webp",
						"width": 343
					},
					{
						"groupId": "group-1755970088527",
						"height": 429,
						"id": "emoji-1755970115406-zficlz",
						"name": "AgADagADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/0/9/4/09446d48df9ff1b7e9047931143dcd4340377885.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-sgv2v2",
						"name": "AgADawADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/e/a/c/eac72b0e50c8b546488dfdfa46793ed416e3e2ea.webp",
						"width": 379
					},
					{
						"groupId": "group-1755970088527",
						"height": 301,
						"id": "emoji-1755970115406-2sqkvn",
						"name": "AgADYwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/4/1/f/41f8fdd04cf1778791fe2140ecf07bd3c1d37d5b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-hjb8xp",
						"name": "AgADVwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/7/0/67020e81a3146bcad2e02a2ae03132d01be9e8bd.webp",
						"width": 448
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-0n9si2",
						"name": "AgADXAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/2/2/c/22c4917120ed80c54048ba7ed8c44ff3cdc06a4f.webp",
						"width": 368
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-r8oetv",
						"name": "AgADYAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/b/6/0/b60d127d8b20f48be11d7faa040b9bd389c7e159.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-5jauwg",
						"name": "AgADUAADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/0/a/2/0a21811f4d062d6076ff8601843d2ca972bad03f.webp",
						"width": 439
					},
					{
						"groupId": "group-1755970088527",
						"height": 421,
						"id": "emoji-1755970115406-fldqw6",
						"name": "AgADUwADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/0/2/f/02ff110b914fcaed8b5bbb8f3e861bcad6800cfc.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970115406-249ej0",
						"name": "AgADeQADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/7/9/e/79e26e8e44f49bf1cb068dca019797e77db9ff43.webp",
						"width": 428
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-3o5d58",
						"name": "AgAD0AIAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/5/a/2/5a2a86d3ec9efdfbaecad7e3af41d7d1b97fe208.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 472,
						"id": "emoji-1755970187562-rjyy82",
						"name": "AgAD2AIAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/e/2/1/e21dba3ff576f86b109b577fc585746ea709d487.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-z999c4",
						"name": "AgADzQIAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/f/b/c/fbccc51002ecdc7085ad44c7b1a097ec85e15db8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 402,
						"id": "emoji-1755970187562-y0462x",
						"name": "AgADqQIAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/1/a/3/1a332d12259c391633c0644fb556da5b2dc084a6.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-l7l32t",
						"name": "AgADlgIAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/a/a/a/aaa4294b0c78a65ed3de49994eca5bd04547c0c9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 391,
						"id": "emoji-1755970187562-g28zuz",
						"name": "AgADYgIAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/0/6/0/0605d8b2614bc10113a5c7f6db6b19af8cfcaa3e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 492,
						"id": "emoji-1755970115406-xtevfv",
						"name": "AgADTgADu6_cBA.webp",
						"packet": 1755970115406,
						"url": "https://linux.do/uploads/default/original/4X/6/3/e/63e21fec7384565827d196310c7be4cabb362875.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-674wir",
						"name": "AgAD2AEAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/f/1/9/f19b0dd6e4f392a4a6cfe50b67ece20837c79b2a.webp",
						"width": 469
					},
					{
						"groupId": "group-1755970088527",
						"height": 284,
						"id": "emoji-1755970187562-7u61j9",
						"name": "AgADeQEAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/6/7/0/67043de551d25fff5c71577deb35ddcdca50720f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-4px581",
						"name": "AgADXAEAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/b/a/7/ba7ccd46322fdb4b01f03bf3c55970d082bc4130.webp",
						"width": 426
					},
					{
						"groupId": "group-1755970088527",
						"height": 465,
						"id": "emoji-1755970187562-90caom",
						"name": "AgADVgEAAkIwQiU.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/3/0/3/3038f68c2cfcda882c8b2b14d3b8d3e6527764aa.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-hjht2o",
						"name": "AgAD9AADQjBCJQ.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/4/7/6/47612fef479529378ea440d8906e0ce7b42d1278.webp",
						"width": 460
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-gul44g",
						"name": "AgADTAADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/a/6/f/a6f3ad7f64fb898a89a4ee8c22590382d99899f5.webp",
						"width": 449
					},
					{
						"groupId": "group-1755970088527",
						"height": 340,
						"id": "emoji-1755970187562-jdpgre",
						"name": "AgADQAADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/a/1/8/a183452aab6a1b065c2f8afe4ddbf4c4e6165bce.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-l34k4d",
						"name": "AgADmgADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/0/8/5/085a14b719d13ed72fdb72392df241ca46ac8a45.webp",
						"width": 271
					},
					{
						"groupId": "group-1755970088527",
						"height": 434,
						"id": "emoji-1755970187562-4ghgsd",
						"name": "AgADnQADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/8/c/0/8c0fa50a3a59bcb20b6e6c4152a1ff635f1f13e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 324,
						"id": "emoji-1755970187562-73kobo",
						"name": "AgADewADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/a/a/d/aad715919276bfd571a01107a64693bbc25c6f13.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-30z6c7",
						"name": "AgADiQADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/f/1/d/f1dd20f4b50a9bb3720cbca68e48f2201c0528a4.webp",
						"width": 315
					},
					{
						"groupId": "group-1755970088527",
						"height": 323,
						"id": "emoji-1755970187562-fo1xjs",
						"name": "AgADbQADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/3/a/0/3a0b15c1ac50724a3cdb4377f91205332e0483f9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-rclxz4",
						"name": "AgADZgADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/c/4/6/c469f7e7933b93b408f6910ed6c4ddabc6c585d8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-064pan",
						"name": "AgADXQADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/0/c/9/0c99409c3a95636372e6c5435e10d4d2f10355f0.webp",
						"width": 372
					},
					{
						"groupId": "group-1755970088527",
						"height": 324,
						"id": "emoji-1755970187562-u445wd",
						"name": "AgADfwADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/7/6/2/762bf04b6cdb4d29c4bdceaf21a935d3120dd052.webp",
						"width": 512
					},
					{
						"groupId": "group-1755970088527",
						"height": 512,
						"id": "emoji-1755970187562-y7xede",
						"name": "AgADcgADu6_cBA.webp",
						"packet": 1755970187562,
						"url": "https://linux.do/uploads/default/original/4X/6/c/7/6c7444671c9e06a5931c3d0816ac1e1d6f3a8d8a.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1755970088527",
				"name": "仙狐小姐",
				"order": 6
			},
			{
				"emojis": [
					{
						"addedAt": 1755966259871,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259871-rrshww",
						"name": "AgADJQIAAkaOWVY",
						"packet": 1755966259871,
						"url": "https://linux.do/uploads/default/original/4X/c/f/7/cf7a66e61f5d8179e67d3c73781cb61b08b85ec1.webp",
						"width": 512
					},
					{
						"addedAt": 1755966259827,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259827-t131ac",
						"name": "AgAD8QEAAm7rWFY",
						"packet": 1755966259827,
						"url": "https://linux.do/uploads/default/original/4X/1/1/3/11390f4675bba3ddeffcd5eeb793dafaacb0226b.webp",
						"width": 512
					},
					{
						"addedAt": 1755966259813,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259813-gwgopd",
						"name": "AgAD1AIAArS2WVY",
						"packet": 1755966259813,
						"url": "https://linux.do/uploads/default/original/4X/4/5/8/458b798c02b7541f0674766d925537a8869b8dd1.webp",
						"width": 512
					},
					{
						"addedAt": 1755966259793,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259793-zgfhkt",
						"name": "AgADuQEAAigYWFY",
						"packet": 1755966259793,
						"url": "https://linux.do/uploads/default/original/4X/b/6/d/b6dc730f14e0358bdd4a429234765ac586d8ff9f.webp",
						"width": 512
					},
					{
						"addedAt": 1755966259774,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259774-zyngu9",
						"name": "AgADFQIAAtqFWFY",
						"packet": 1755966259774,
						"url": "https://linux.do/uploads/default/original/4X/4/2/e/42e889b6a023594f8f8a9af498a287cf266fdece.webp",
						"width": 512
					},
					{
						"addedAt": 1755966259747,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259747-wpupnp",
						"name": "AgAD7AEAAqpbWFY",
						"packet": 1755966259747,
						"url": "https://linux.do/uploads/default/original/4X/0/3/6/0365129e628f79ff740837ff073b2f01ea31f8d2.webp",
						"width": 512
					},
					{
						"addedAt": 1755966259732,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259732-3jxzhc",
						"name": "AgAD2gEAAoJ_WVY",
						"packet": 1755966259732,
						"url": "https://linux.do/uploads/default/original/4X/c/d/1/cd16819390cc0b28daa020574d265148ac86584e.webp",
						"width": 512
					},
					{
						"addedAt": 1755966259704,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966259704-7zg0pn",
						"name": "AgADjwIAAtN2WVY",
						"packet": 1755966259704,
						"url": "https://linux.do/uploads/default/original/4X/d/7/3/d73ae44084b3c4320decf77f8a8dc56515795854.webp",
						"width": 512
					},
					{
						"addedAt": 1755966247002,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966247001-fj0rrm",
						"name": "AgADrQEAA3tZVg",
						"packet": 1755966247002,
						"url": "https://linux.do/uploads/default/original/4X/9/7/4/974c445791a88026adeb584cc4aba7e503173323.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246911,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246911-x8ycvx",
						"name": "AgADpwIAAoPEWFY",
						"packet": 1755966246911,
						"url": "https://linux.do/uploads/default/original/4X/2/a/6/2a60a7a3fe3c452ab4b5a505e387c92966c6043f.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246845,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246845-n3x406",
						"name": "AgAD7AEAApBZWFY",
						"packet": 1755966246845,
						"url": "https://linux.do/uploads/default/original/4X/3/7/3/373b0b174a8d87f0f4860fc9b7b40771ba3eceed.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246820,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246820-3sax1e",
						"name": "AgADsgEAAoi7WVY",
						"packet": 1755966246820,
						"url": "https://linux.do/uploads/default/original/4X/0/9/5/0955d57833fa4f0432a5b49c87e5ca6138f7d64a.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246775,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246775-gmp6k1",
						"name": "AgADDQIAAjlmWVY",
						"packet": 1755966246775,
						"url": "https://linux.do/uploads/default/original/4X/b/4/6/b46696e0a8cf0f664a19448adcd79c8f68b6081a.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246711,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246711-qukki2",
						"name": "AgADCQIAAmdCWFY",
						"packet": 1755966246711,
						"url": "https://linux.do/uploads/default/original/4X/0/7/e/07e4cffc07cbd11056f2fed611187579d8b675ef.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246682,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246682-9hzmkr",
						"name": "AgAD3wEAArMIWFY",
						"packet": 1755966246682,
						"url": "https://linux.do/uploads/default/original/4X/1/2/f/12f7114ca2a79957359ef05ffcb1dfcd679ea796.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246657,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246657-n0jbf1",
						"name": "AgADXgIAAgGPWFY",
						"packet": 1755966246657,
						"url": "https://linux.do/uploads/default/original/4X/3/6/9/3696332ff8e12b6e13d3d13d7e4ab0c7eb7c0122.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246641,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246641-bupyra",
						"name": "AgADWAIAAjpHWFY",
						"packet": 1755966246641,
						"url": "https://linux.do/uploads/default/original/4X/a/b/5/ab51b7fedb25bf37f16e134ade4c7c0fab7596cc.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246615,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246615-7rss6f",
						"name": "AgADowEAAkUxWVY",
						"packet": 1755966246615,
						"url": "https://linux.do/uploads/default/original/4X/0/2/5/02599964bd0814dc82d82bcf5ff0e766a5b8c373.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246575,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246575-r81kh4",
						"name": "AgADLQIAAvlWWFY",
						"packet": 1755966246575,
						"url": "https://linux.do/uploads/default/original/4X/f/7/b/f7b83333c71c9a60bd013977558f641dfe726683.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246559,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246559-bbz5n0",
						"name": "AgAD8QEAArUAAVhW",
						"packet": 1755966246559,
						"url": "https://linux.do/uploads/default/original/4X/5/2/5/525d7e45f3036e0aae7c09374d0f59c048b3c143.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246545,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246545-rlyguy",
						"name": "AgAD7gIAAqyqWFY",
						"packet": 1755966246545,
						"url": "https://linux.do/uploads/default/original/4X/1/0/d/10da6cbf398dc85e3f363d4db20e52b196d81f9d.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246526,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246526-y0omv7",
						"name": "AgAD5gIAAkE-WVY",
						"packet": 1755966246526,
						"url": "https://linux.do/uploads/default/original/4X/5/1/f/51fd89364d913b8a555fc617121bd707e5a46fae.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246513,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246513-5ftfuv",
						"name": "AgADOAIAAgbtWFY",
						"packet": 1755966246513,
						"url": "https://linux.do/uploads/default/original/4X/5/5/c/55ced4f9469673e4731382bd633d25d16a0c97e0.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246492,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246492-moe1hv",
						"name": "AgADMQIAAohoWVY",
						"packet": 1755966246492,
						"url": "https://linux.do/uploads/default/original/4X/9/1/d/91d4a6bcf28d4855604573a3a1cd9b0a74a31aff.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246476,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246476-nj0ewj",
						"name": "AgADKAIAAk2mWFY",
						"packet": 1755966246476,
						"url": "https://linux.do/uploads/default/original/4X/d/7/f/d7f41169b09427254f934eb9ce6d8b533e700588.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246445,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246445-e8o5d2",
						"name": "AgADGwIAAnYRWFY",
						"packet": 1755966246445,
						"url": "https://linux.do/uploads/default/original/4X/b/0/1/b0155d710265caa01b3936f9d41973842af08291.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246428,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246428-vdc95y",
						"name": "AgADdQIAAnt2WVY",
						"packet": 1755966246428,
						"url": "https://linux.do/uploads/default/original/4X/f/0/a/f0a6e3141504ab6a36bb084e50f1ececbef9ab6c.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246413,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246413-cg906y",
						"name": "AgADCAIAAgTFWFY",
						"packet": 1755966246413,
						"url": "https://linux.do/uploads/default/original/4X/5/9/5/5959ff61a8c75f4a6d404e59713141bb8f84629f.webp",
						"width": 512
					},
					{
						"addedAt": 1755966246401,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966246401-eehd5f",
						"name": "AgAD0gEAAh1AWVY",
						"packet": 1755966246401,
						"url": "https://linux.do/uploads/default/original/4X/9/6/e/96e81fcc229c970413eadbb8b9988a1b3ad0906c.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239360,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239360-oba3do",
						"name": "AgADUQEAAuBpWVY",
						"packet": 1755966239360,
						"url": "https://linux.do/uploads/default/original/4X/f/0/8/f08600516d7622d4cc7496fc96948202ae1a87ab.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239351,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239351-u6r7l0",
						"name": "AgAD3wEAAmNeWFY",
						"packet": 1755966239351,
						"url": "https://linux.do/uploads/default/original/4X/5/5/2/5525dad597adb208a4711189a1977840c2b23557.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239341,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239341-5zkn37",
						"name": "AgAD5wEAAk-CWFY",
						"packet": 1755966239341,
						"url": "https://linux.do/uploads/default/original/4X/a/4/6/a46910003a1aef9d0a5c0957a5f342ffbc214d8a.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239335,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239335-v17ia2",
						"name": "AgAD2wIAAvMKWFY",
						"packet": 1755966239335,
						"url": "https://linux.do/uploads/default/original/4X/c/4/f/c4f4529b92564dd87ea5dcf3aa157b4e7c4c385c.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239327,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239327-tf5wcf",
						"name": "AgADvwEAAt7fWVY",
						"packet": 1755966239327,
						"url": "https://linux.do/uploads/default/original/4X/4/e/c/4ec063a3de605523d41762bad024a35f0fbb14b5.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239316,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239316-mt9up1",
						"name": "AgADNgMAAsNxWVY",
						"packet": 1755966239316,
						"url": "https://linux.do/uploads/default/original/4X/4/3/f/43f3dc63f94d25ca116716909265a0b2d3de8f11.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239307,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239307-d2h345",
						"name": "AgADhQIAAu4pWFY",
						"packet": 1755966239307,
						"url": "https://linux.do/uploads/default/original/4X/1/0/1/1017032f0aaddf0443f2e1af5a592212984ea3b6.webp",
						"width": 512
					},
					{
						"addedAt": 1755966239298,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966239298-80dalq",
						"name": "AgADDQIAAj0FWFY",
						"packet": 1755966239298,
						"url": "https://linux.do/uploads/default/original/4X/9/2/a/92a83d30a9af3be1f1e4fc707c9ceb6e4a4c5372.webp",
						"width": 512
					},
					{
						"addedAt": 1755966232033,
						"groupId": "group-1755966299851",
						"height": 512,
						"id": "emoji-1755966232033-v9nuft",
						"name": "AgADxwEAAoIfWFY",
						"packet": 1755966232033,
						"url": "https://linux.do/uploads/default/original/4X/5/4/e/54e3aa75e975de62f92e735fc33418eba0ced590.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1755966299851",
				"name": "魔女的夜宴",
				"order": 7
			},
			{
				"emojis": [
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833840541-602sug",
						"name": "抬头",
						"packet": 1755833840541,
						"url": "https://linux.do/uploads/default/original/4X/4/b/8/4b8c6f47342841f2bffbeb0c5622964385893019.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833861070-h02obc",
						"name": "墨镜",
						"packet": 1755833861070,
						"url": "https://linux.do/uploads/default/original/4X/c/e/5/ce5640ff686039a9b75cdf09ff9f6a84692e788b.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833873998-6o9oaz",
						"name": "智慧",
						"packet": 1755833873998,
						"url": "https://linux.do/uploads/default/original/4X/3/4/f/34fdc9cb2faf18e437081627ccf4277d893ccf97.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833883382-wqpzpy",
						"name": "咧嘴笑",
						"packet": 1755833883382,
						"url": "https://linux.do/uploads/default/original/4X/3/f/9/3f945e7b233792c622f480b3a11b878b67e619fc.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833908678-xd3h3z",
						"name": "鸡蛋",
						"packet": 1755833908678,
						"url": "https://linux.do/uploads/default/original/4X/a/9/6/a961f0e73edbcb16115765fe236fedc3769a16f0.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833915270-awmqkr",
						"name": "哈哈",
						"packet": 1755833915270,
						"url": "https://linux.do/uploads/default/original/4X/5/7/6/576e30a914776e5b6e666b5744bf241a35689399.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833938017-lfwbjr",
						"name": "鹿",
						"packet": 1755833938017,
						"url": "https://linux.do/uploads/default/original/4X/a/8/7/a87e6a13b9e2d5f7601f36ff599f92a5e81de8f0.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833944963-ltsqvv",
						"name": "咸鱼",
						"packet": 1755833944963,
						"url": "https://linux.do/uploads/default/original/4X/a/8/7/a87e6a13b9e2d5f7601f36ff599f92a5e81de8f0.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833952433-8qjdm8",
						"name": "wow",
						"packet": 1755833952433,
						"url": "https://linux.do/uploads/default/original/4X/b/7/6/b76157c579caa28fcc857f8b133d57ce3951fc85.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833970773-ffdcra",
						"name": "我很可爱，请给我钱",
						"packet": 1755833970773,
						"url": "https://linux.do/uploads/default/original/4X/2/2/a/22a2ae7496da32d6e4c65d7061b41831c525a40e.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755833980016-4coup6",
						"name": "爱你哦",
						"packet": 1755833980016,
						"url": "https://linux.do/uploads/default/original/4X/d/7/1/d71f634b5fb38b64765bc043be309008ffc0899b.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755834252645-zo9v6m",
						"name": "(*^_^*)",
						"packet": 1755834252645,
						"url": "https://linux.do/uploads/default/original/4X/b/a/4/ba43eea0c46fb4c045053bdc0da9a7a1cbaa8a6c.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755834315832-b15fhr",
						"name": "智慧",
						"packet": 1755834315832,
						"url": "https://linux.do/uploads/default/original/4X/6/7/d/67ddac4732ed2911d528164cb674dc576afafc06.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834293795-052fmt",
						"name": "wow",
						"packet": 1755834293795,
						"url": "https://linux.do/uploads/default/original/4X/2/c/4/2c422520c9090c3d1beae276e91a7e145a915bf6.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834272886-q5ff0f",
						"name": "墨镜",
						"packet": 1755834272886,
						"url": "https://linux.do/uploads/default/original/4X/e/f/0/ef0bc8f4d4097c135280df64a09284265620a0b4.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755834263893-8d552t",
						"name": "微笑",
						"packet": 1755834263893,
						"url": "https://linux.do/uploads/default/original/4X/d/0/a/d0ab314d5fc5ef9e6e6dccd31660577f321bc0da.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834341270-kmw7ya",
						"name": "zako杂鱼",
						"packet": 1755834341270,
						"url": "https://linux.do/uploads/default/original/4X/b/7/f/b7fa0ac6e1fed36a241afc217e8315b5c69b9156.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834286993-lrx7at",
						"name": "超人内裤",
						"packet": 1755834286993,
						"url": "https://linux.do/uploads/default/original/4X/9/8/7/987439cd20fd441acdd6115ebf5a228a39b7a86c.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834324373-381j3c",
						"name": "奶头",
						"packet": 1755834324373,
						"url": "https://linux.do/uploads/default/original/4X/e/c/d/ecd7ae73a1adad92c9de953ecab909a496091d17.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834333421-p0z0cx",
						"name": "咸鱼",
						"packet": 1755834333421,
						"url": "https://linux.do/uploads/default/original/4X/6/1/b/61bdb53c0adb5923cabb6962e03b68a0a0513e44.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834878673-naz8v5",
						"name": "鹿",
						"packet": 1755834878673,
						"url": "https://linux.do/uploads/default/original/4X/5/0/4/504fc5845a5566e673f067894212b019db0e0446.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834886503-jmlolv",
						"name": "抬头",
						"packet": 1755834886503,
						"url": "https://linux.do/uploads/default/original/4X/6/c/2/6c2157aca5c3ab792ccf51e6eb968a68445b1a81.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834895413-zir7rb",
						"name": "墨镜",
						"packet": 1755834895413,
						"url": "https://linux.do/uploads/default/original/4X/d/c/4/dc404944b19084a0de2c97885dd2bf188df9ae03.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834934472-j25f6u",
						"name": "西瓜",
						"packet": 1755834934472,
						"url": "https://linux.do/uploads/default/original/4X/f/b/a/fbac34d655b0a3da4f0f2a33c6c6d2b61afe12ad.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834919582-5rtr8n",
						"name": "杂鱼",
						"packet": 1755834919582,
						"url": "https://linux.do/uploads/default/original/4X/d/f/9/df977c19e9355dff560f4d7fd944cf5012598b64.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834902380-om7o66",
						"name": "wow",
						"packet": 1755834902380,
						"url": "https://linux.do/uploads/default/original/4X/b/0/3/b03f331e9bf1b87054de5a33080e32c47eb85afe.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834912732-rj0zix",
						"name": "智慧",
						"packet": 1755834912732,
						"url": "https://linux.do/uploads/default/original/4X/1/1/c/11c0f19cab31bb090e82cd9eb838071ab116d066.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834946292-dscyer",
						"name": "Δ",
						"packet": 1755834946292,
						"url": "https://linux.do/uploads/default/original/4X/f/9/1/f9194f86b5c1a0e8fd605b12decae7a79320a952.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834927919-ot8ixu",
						"name": "99+",
						"packet": 1755834927919,
						"url": "https://linux.do/uploads/default/original/4X/e/6/1/e61b159e9c202793f78fdccb361a89baeec46ec8.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834022976-0vl4go",
						"name": "仰头",
						"packet": 1755834022976,
						"url": "https://linux.do/uploads/default/original/4X/1/4/8/1483da1f61dc539eafe6febfb3083de07df7f85b.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834030951-u0zvom",
						"name": "墨镜",
						"packet": 1755834030951,
						"url": "https://linux.do/uploads/default/original/4X/0/8/f/08f10a7ca577e2a9737e2c5bc0e360aa9068debe.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834084932-5e96e4",
						"name": "zako杂鱼",
						"packet": 1755834084932,
						"url": "https://linux.do/uploads/default/original/4X/c/2/a/c2a8d3a73a9bf321e1bb56c4c511644969a59390.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755834074395-sjreiz",
						"name": "嘻嘻",
						"packet": 1755834074395,
						"url": "https://linux.do/uploads/default/original/4X/8/a/c/8ac57fb28603d137bb9cac664d530392743f7828.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834094112-hyhowq",
						"name": "咸鱼",
						"packet": 1755834094112,
						"url": "https://linux.do/uploads/default/original/4X/8/5/a/85a9fd410e3cf188cd2a6b2dba1fe7b779dfb500.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834134101-tvqryf",
						"name": "吃火腿肠",
						"packet": 1755834134101,
						"url": "https://linux.do/uploads/default/original/4X/9/b/4/9b4d9823ecb6d65cfa7266b2973155e34523132a.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834103909-z27sxz",
						"name": "99+",
						"packet": 1755834103909,
						"url": "https://linux.do/uploads/default/original/4X/a/f/2/af2af629668b512704c7e72b05ecb509143d5247.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 375,
						"id": "emoji-1755834118164-mxdgav",
						"name": "99+",
						"packet": 1755834118164,
						"url": "https://linux.do/uploads/default/original/4X/4/c/8/4c8bac67c76157f2811b930188e84b0acbf83311.jpeg",
						"width": 373
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755834148824-pr4hcr",
						"name": "look in my eyes",
						"packet": 1755834148824,
						"url": "https://linux.do/uploads/default/original/4X/2/6/5/265b7e2803326aaabe465d756a5bdc9c20734c09.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864494410-5t71hr",
						"name": "吃",
						"packet": 1755864494410,
						"url": "https://linux.do/uploads/default/original/4X/c/0/6/c06e3b507dda8defec2db607874f5a4c02a4fe9a.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864550105-u7qjtm",
						"name": "鸡蛋",
						"packet": 1755864550105,
						"url": "https://linux.do/uploads/default/original/4X/6/4/5/645545b8edb844e1ff9107a76b1c5adfe3c49c35.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864519275-isi5zg",
						"name": "你",
						"packet": 1755864519274,
						"url": "https://linux.do/uploads/default/original/4X/4/5/b/45b0848a0ba58237f179feac3d2142da2b588429.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864608482-nf57t6",
						"name": "棒棒糖",
						"packet": 1755864608482,
						"url": "https://linux.do/uploads/default/original/4X/6/7/0/67042480d99052a3cc29b451fc5914cbc1f6546b.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864979658-aq89mn",
						"name": "笑",
						"packet": 1755864979658,
						"url": "https://linux.do/uploads/default/original/4X/b/1/5/b1530591b8bac6ad4e4d3cb490e62be2f2938a29.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864990113-49tbmh",
						"name": "智慧",
						"packet": 1755864990113,
						"url": "https://linux.do/uploads/default/original/4X/5/1/b/51b8f59d334dce1f9ee5d1e223b94f756e97b1b2.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864984297-mla0mb",
						"name": "鹿",
						"packet": 1755864984297,
						"url": "https://linux.do/uploads/default/original/4X/a/5/8/a585e44f88abd7ad914fc98c40ea4ffcaeb71126.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755864995888-jei4ny",
						"name": "( •̀ ω •́ )y",
						"packet": 1755864995888,
						"url": "https://linux.do/uploads/default/original/4X/b/a/6/ba6f6a394187d033cd1cc01463d95c7b7f7e4f12.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 472,
						"id": "emoji-1755865001025-0v7xqz",
						"name": "鱼",
						"packet": 1755865001025,
						"url": "https://linux.do/uploads/default/original/4X/3/8/e/38edfc255c1b9fafa3e8171e2f65b559deb7f424.jpeg",
						"width": 471
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865207392-dbt9iz",
						"name": "西瓜🍉",
						"packet": 1755865207392,
						"url": "https://linux.do/uploads/default/original/4X/e/7/4/e747bec2baf1d1b767ef948667439874c23e6fe4.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865240506-df5d9m",
						"name": "墨镜🕶",
						"packet": 1755865240506,
						"url": "https://linux.do/uploads/default/original/4X/5/c/9/5c9e517e1f70ebf2815f963d5a4609b6b8064780.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865196581-iksjvg",
						"name": "笑",
						"packet": 1755865196581,
						"url": "https://linux.do/uploads/default/original/4X/1/2/6/126e4da42ab5bb8f006e5daf2a4060b626b8846c.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865219377-zx42qq",
						"name": "wow",
						"packet": 1755865219377,
						"url": "https://linux.do/uploads/default/original/4X/a/8/b/a8bd7dab13933ecc2f86e2a0eb1b32e53434eabf.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865224776-xja5wa",
						"name": "煎蛋",
						"packet": 1755865224776,
						"url": "https://linux.do/uploads/default/original/4X/7/2/2/722fcc12ab77f6e247a9fb66de0d20907b626e5d.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 450,
						"id": "emoji-1755865231234-m3wyx7",
						"name": "app",
						"packet": 1755865231234,
						"url": "https://linux.do/uploads/default/original/4X/7/d/4/7d44ebf8ad6bafb8e4611aee140ecfbe2a162c8d.jpeg",
						"width": 466
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865245778-iei693",
						"name": "超人",
						"packet": 1755865245778,
						"url": "https://linux.do/uploads/default/original/4X/0/e/b/0eb6c4449934b31e7147cc3bb9d5c4824bc0fdac.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865250104-j74ob6",
						"name": "鱼",
						"packet": 1755865250104,
						"url": "https://linux.do/uploads/default/original/4X/3/a/d/3ad0cd9f67e76fbe85f03a10491fb304ae23f25c.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865265591-y9opn2",
						"name": "哈哈",
						"packet": 1755865265591,
						"url": "https://linux.do/uploads/default/original/4X/e/f/d/efdc9c029b8ac022af8290c9dff15b3d46664ce9.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1755865257372-us7sh2",
						"name": "杂鱼zako",
						"packet": 1755865257372,
						"url": "https://linux.do/uploads/default/original/4X/2/3/c/23c9f58d7112469dbd5e465efbba5b79394cacc1.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 450,
						"id": "emoji-1755865272526-ac9wua",
						"name": "app紫",
						"packet": 1755865272526,
						"url": "https://linux.do/uploads/default/original/4X/a/5/0/a502b781da593edcc7ee81dd7a2b9c90275a1b44.jpeg",
						"width": 466
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-h7wu32",
						"name": "微笑",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/7/0/d/70dd1373fdb64d236bb3d4a3da23d21184387fac.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-3xp59k",
						"name": "哈哈",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/d/c/b/dcbae9c78d0773bb230a5b5609582f64a47fa429.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-ocnvsx",
						"name": "喝奶",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/c/5/d/c5d4b1bf9c674e21d5a82c021012c08602e7ad71.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-ldju40",
						"name": "智慧",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/8/8/d/88db160d7d06ab4f4bf1d67599dfef3af35ca098.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-cafds9",
						"name": "吃瓜",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/c/a/d/cad83762619aeeef6c06d0cde77352ccc1c89d4b.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-erj1a4",
						"name": "wowo",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/d/e/f/def297dbe0ea93dbb45fbbd1b9876aa139babbad.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-uoazkn",
						"name": "敬你",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/4/0/6/40614d84fcae97900838901b7a801f542c9383a3.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-fgelvz",
						"name": "超人",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/c/c/4/cc47f3cb83c6365125ead45b7a02547a019a676a.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 545,
						"id": "emoji-1758071900140-pzolq5",
						"name": "墨镜",
						"packet": 1758071900140,
						"url": "https://linux.do/uploads/default/original/4X/4/2/8/42856899fd73aa7c186bdba673b2d06147384c94.jpeg",
						"width": 544
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-2ep9hj",
						"name": "吃香肠",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/f/2/f/f2f94cbfc0ba61ba45459148522259cb21bb5b21.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-tny3y1",
						"name": "哈气",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/3/c/8/3c80d341402438e25c0725251db79f0a75e1e87e.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-oyx72h",
						"name": "哈气2",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/e/0/9/e096dff1a14eba321b6164ad62eb8c52207115ea.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-1rhpam",
						"name": "哈气3",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/b/3/3/b3350d4016220be8dbf56dda66d4d7a5227d5530.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-j9s95y",
						"name": "wow",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/b/a/a/baa6458724132fa5b1524dba82ae72f63da0ad1f.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-55i1h7",
						"name": "杂口",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/9/d/1/9d1bff00bc51a01a2ab8fc462c13c11e35d67184.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-d8x549",
						"name": "嘻嘻",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/3/6/7/3672b54800f1a87c8db6c9028b3a4c2735192392.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-of6upe",
						"name": "大棒",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/a/f/b/afb026319c642c057bb1466957743b6ebaab7f4d.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071924571-dgupnp",
						"name": "微笑",
						"packet": 1758071924571,
						"url": "https://linux.do/uploads/default/original/4X/0/7/a/07a6df88f5cdc24b2aa55b3b68ca5dd4aba53f22.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-owpasd",
						"name": "火腿肠",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/9/b/d/9bd0cf91e7f564f5579367d287ef789bc24cd2c7.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-ck7j5f",
						"name": "1000031760.jpg",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/8/6/b/86ba0b7fe82e7c7c5f811263db913f687b2a59aa.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-ribmf0",
						"name": "1000031759.jpg",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/1/4/1/14105cc53a3299a37c82f8eac35f69475b8f2084.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-irv9k6",
						"name": "1000031758.jpg",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/1/e/7/1e751e4edd0b00fca1c19ed57c0826a7b6c770f4.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-zh6h8h",
						"name": "杂口",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/d/6/d/d6d006025e6c38f542c76aa96f679457208810c3.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-91d3u7",
						"name": "杂鱼",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/8/6/3/863598d76abf58a1b0f41e17d15bf23204091834.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-9660eu",
						"name": "杂口2",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/2/b/f/2bfb6d386a0f6c4011079a10228b8fb1467b31c4.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-lyzsjh",
						"name": "杂鱼2",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/7/3/d/73d19b3a557b2ae7c0df017c5109d73a28a6661f.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071938741-b0fu7a",
						"name": "呼呼",
						"packet": 1758071938741,
						"url": "https://linux.do/uploads/default/original/4X/0/4/4/0442807102bb2d49972a86d5aac81fe08f9b832f.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-gd652e",
						"name": "99+",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/d/2/3/d2358882131ba92e3487a6168004a373f4791f55.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-s3hyo6",
						"name": "吃瓜",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/0/5/8/0581eade6922625e52da2c0265b4d3ddeee826c3.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-l55gmk",
						"name": "就决定是你了",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/3/0/3/30389e4376123b8b0b3ad5d3264879532b39a8cd.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-0pv2o5",
						"name": "火腿肠",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/0/c/f/0cf534454273fa0e50bb0b0058bac57b7457aa9e.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-gotm0o",
						"name": "wow",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/c/2/4/c2460cdd687fc82056b12a03d5fce5785a036da4.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-5av1nm",
						"name": "杂口",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/7/6/1/7613b8af564cee53f2986cf87aa7cdf0b870a935.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-97is7j",
						"name": "墨镜",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/2/5/7/2570852f92892cf804a0020f68fe85f80e15a1a1.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-bq840s",
						"name": "mihomo",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/2/0/3/203fef77fdd9ad2fa16b67d73bf83bbf732e2810.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758071970274-1ktzoz",
						"name": "微笑",
						"packet": 1758071970274,
						"url": "https://linux.do/uploads/default/original/4X/b/c/9/bc911a884b6cd6726b1e77b09c2bc11f247a8ef8.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-dxr5bu",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/c/9/e/c9e3a98cc972535160e29ae2cdd3e7d64cf6341a.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-ctpgkq",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/1/a/9/1a973c77ee11ac48ad1847154c345615002479c0.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-rkjwft",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/8/3/9/83985d59754f92637cc17bef3f7c1cf796a82b38.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-byjgow",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/2/4/0/2405fb188099083f7724a032ede4e4d5a4e23017.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-jsl3mp",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/8/9/c/89cecce57259f2bd8b674ff5058dee36fee9ec3f.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-h2nrzp",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/0/d/7/0d77900867d025e2b3daee2b1dd03c8a2ae979b9.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-0ux36o",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/f/4/2/f42e3ee20107eb810a92f3320358945503145acf.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-4fk2wm",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/a/8/e/a8eeba5bbec1554d1315f05e523cecafdabb10ab.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072715169-zbphva",
						"name": "image",
						"packet": 1758072715169,
						"url": "https://linux.do/uploads/default/original/4X/2/8/7/2879760f2c516904ab10a1efb30df0db5b2bfbc2.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-amma7z",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/1/e/1/1e17d11d3e587a5dc5a5a27d3905b7b5288f65d7.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-9cod4a",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/6/a/2/6a2f8255010cc15f22976e3119ef70be38bbcfc7.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-090sle",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/d/d/9/dd916f2f4e6b44c95186159157af99d46c359ff1.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-fa8a4h",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/8/c/5/8c5ae0693348d944c955584790a07dd55c4515fe.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-ftn3a8",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/4/c/1/4c1631e2380dc360b4ebd4b23969a900bb54db86.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-rif5p8",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/9/0/7/907271845c48ff7bef966098e49d471ed4bbcf46.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-zxt421",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/5/6/8/568bdff2a13755077a0ef61f9235eebb5482f57f.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-3np1xl",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/a/5/7/a571c48dd5c545598772be558e236b006437b0c9.jpeg",
						"width": 542
					},
					{
						"groupId": "group-1755833820210",
						"height": 543,
						"id": "emoji-1758072731935-5u7x8s",
						"name": "image",
						"packet": 1758072731935,
						"url": "https://linux.do/uploads/default/original/4X/9/b/2/9b2196a17b59b46290746b5e81907cc7e722a282.jpeg",
						"width": 542
					}
				],
				"icon": "📁",
				"id": "group-1755833820210",
				"name": "铸币大头",
				"order": 8
			},
			{
				"emojis": [
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865035090-mfvg3r",
						"name": "fgo妖兰猫猫",
						"packet": 1755865035090,
						"url": "https://linux.do/uploads/default/original/4X/5/1/8/518113704cd499d15c20e1fae11fa2c8d46c1e6a.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865044232-etqayg",
						"name": "fgo呆毛王猫猫",
						"packet": 1755865044232,
						"url": "https://linux.do/uploads/default/original/4X/e/2/9/e29f21239357f9879fd83c2238974e76001eba56.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865050772-4mxgz1",
						"name": "22",
						"packet": 1755865050772,
						"url": "https://linux.do/uploads/default/original/4X/4/f/0/4f0a9bd11f9ecb4ca9d098a18efa47c085c1bfcf.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865056495-w1kfc2",
						"name": "33",
						"packet": 1755865056495,
						"url": "https://linux.do/uploads/default/original/4X/f/d/4/fd41473293b074942e8326ca3359725bed804614.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865062404-zt540u",
						"name": "哔咔猫猫",
						"packet": 1755865062404,
						"url": "https://linux.do/uploads/default/original/4X/c/c/c/cccde007cfd76d7e3aa64ce0e7c80637a2468195.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865069784-gpj9kc",
						"name": "鲸鱼娘咔姬噜",
						"packet": 1755865069784,
						"url": "https://linux.do/uploads/default/original/4X/6/3/6/63689f2dedc99f26fe9f96cefbd90f763f6bf0d8.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865076871-a2k8bv",
						"name": "爱莉希雅",
						"packet": 1755865076871,
						"url": "https://linux.do/uploads/default/original/4X/d/f/7/df77c03bde07142e45bb41e028d7f0d0c0487867.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865118489-ucr3or",
						"name": "@果宝",
						"packet": 1755865118489,
						"url": "https://linux.do/uploads/default/original/4X/f/6/a/f6a4158c75ef1a3bd0c7c6e5e818a6eef8a4d071.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865134021-rowuvq",
						"name": "1",
						"packet": 1755865134021,
						"url": "https://linux.do/uploads/default/original/4X/0/1/0/01076ab5cddaab54927b8660d189877fd92c975f.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865140136-5dm5nk",
						"name": "2",
						"packet": 1755865140136,
						"url": "https://linux.do/uploads/default/original/4X/9/5/e/95e3a63c3445621c7d40c33de5886dbeed77410f.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865143891-pwrpxd",
						"name": "3",
						"packet": 1755865143891,
						"url": "https://linux.do/uploads/default/original/4X/e/b/c/ebc7b536032fad50015cded9713361377a5ffff9.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865147588-vy184v",
						"name": "4",
						"packet": 1755865147588,
						"url": "https://linux.do/uploads/default/original/4X/2/3/d/23dee4dc59af1de90b57bab15f19d60bea939a7b.gif"
					},
					{
						"groupId": "group-1755865026150",
						"id": "emoji-1755865151886-08lcty",
						"name": "5",
						"packet": 1755865151886,
						"url": "https://linux.do/uploads/default/original/4X/a/e/b/aeb3831d1b284eef28d84fbe7e3f75acec7d646f.gif"
					}
				],
				"icon": "📁",
				"id": "group-1755865026150",
				"name": "扒手手",
				"order": 9
			},
			{
				"emojis": [
					{
						"groupId": "group-1755968404073",
						"height": 402,
						"id": "emoji-1755968422816-5j0hbq",
						"name": "AgADC2sAAuCjggc.webp",
						"packet": 1755968422816,
						"url": "https://linux.do/uploads/default/original/4X/d/0/b/d0b1c9c61aaa5e5ea18be52ffc15ecd3e4b13c8a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968422817-s8out9",
						"name": "AgADnAADE6fODw.webp",
						"packet": 1755968422816,
						"url": "https://linux.do/uploads/default/original/4X/1/c/a/1ca003b248e9b5211ceb409bc125c1e1a5698d02.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968422817-w4r4va",
						"name": "AgADqwADE6fODw.webp",
						"packet": 1755968422817,
						"url": "https://linux.do/uploads/default/original/4X/6/2/8/628ac7a00ffc1f489a146e89dd1baf92db60577d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968422817-ywtip1",
						"name": "AgADcAADE6fODw.webp",
						"packet": 1755968422817,
						"url": "https://linux.do/uploads/default/original/4X/6/8/6/686555e2ef38ed17b4b3c1f9894ae1baf3ac764d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968422817-x6mvfc",
						"name": "AgADXwADE6fODw.webp",
						"packet": 1755968422817,
						"url": "https://linux.do/uploads/default/original/4X/f/6/a/f6a102d8ce455947f8321d1073253d18bdaa3e27.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-dfdyfw",
						"name": "AgADzV8AArnFCUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/a/1/2/a12b02750e3215b57594a743faf7616b2d507bc5.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-smtlvq",
						"name": "AgAD21EAAiY8aEo.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/b/c/f/bcff89fdacd79778d773564df7318f30150b30fe.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-dux4of",
						"name": "AgADD1oAAuP-qUs.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/a/5/8/a58ed5139a5f046a0dc56587ea7625afabcf93af.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-ju2uf1",
						"name": "AgADj1YAAv2esUs.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/e/b/a/eba17df42e6811f13a1cda60ffd6dec3db1556c3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-ldzwtj",
						"name": "AgADLlQAAtUIcEo.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/2/4/5/245cb1a9d1f511eafc031dea502168783532ab7b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-alkcf2",
						"name": "AgADm0gAAifjcUo.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/4/f/44f4e19850add0db177d8d0aef4503eee087f7a8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-bq6u86",
						"name": "AgADqUcAAhkLcEo.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/e/b/0/eb0d8c5a056c1b69e0be2ba71d3cbb62906a9528.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-dv8q1w",
						"name": "AgADQVAAArOosUs.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/8/6/1/86156255ccd6003ea1cfe80d495fd753f155bcdc.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-hly44a",
						"name": "AgADyEoAAo_ecUo.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/5/2/052f5d36771c2a6cb3d3cc0b6784c3287fbb0565.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-zr16va",
						"name": "AgAD_0kAAr4tQUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/b/2/a/b2a8b6f4e9fd1c280e7ecc97e6d0a6da5b3ad123.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-e5mgig",
						"name": "AgAD7UQAAprDQUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/a/2/7/a27efbeafee2956f6ca14d66a218356d7c674d45.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-i7hecz",
						"name": "AgADBFMAAgPQaUk.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/5/3/a/53a3451cd2eae10a7647b71abb007eef433c8d69.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-xd676z",
						"name": "AgADBUoAAh0uaUk.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/a/3/4a31c0b5b8d5cfb3dfcba621597aad8c2cf541f9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-7ivet8",
						"name": "AgADh0IAAsiTaUk.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/3/2/032ae49ebca99e7aa53fc9e78ea6189dda766f9c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-ivqkgs",
						"name": "AgADhD8AArrnyUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/3/e/3/3e31344d07113cdc7ef487d4a8df1bc66262de2a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-dgoz9x",
						"name": "AgADHkEAAirVQEg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/f/e/9/fe9cdf8554fee99e22b27740877b99166fc99734.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-rpybrc",
						"name": "AgADiD8AAp0LaEk.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/7/1/4/714b2866b05c865ffecf79172d3392ba452fb433.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-harhac",
						"name": "AgADOD0AAhIwQEg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/a/1/7/a17a8432f96344135727ddd1385f8af547b230c4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-cq477x",
						"name": "AgADOEEAAlzywUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/a/a/c/aac45ad2877d88f43034dbcb63308e5b2ffad812.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-zk25vf",
						"name": "AgAD-T8AAtSbaEk.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/9/f/c/9fcaccf3b08122f3b22dd02e0afb9d62db693075.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-v30bs8",
						"name": "AgADtEAAAr2vaEk.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/7/0/3/70398ec1e24e644d8d2f4da5c5c9d099773d1188.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-yebnnq",
						"name": "AgADaEMAAl4bOEg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/b/1/e/b1e648a5879aa7e5248674d1a5b1fbce1d7723a2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-unqok5",
						"name": "AgADBT4AAnykKUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/3/1/6313418008cffdbd0f5c485a82d156d433f65670.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-zgl8lb",
						"name": "AgADf0UAAsfqCUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/a/9/e/a9e2e0825b2c877f0ba5bd9070d987b5148cd951.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-7bnw0o",
						"name": "AgADID0AApobOUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/2/8/f/28f576ab10e9f3d2376bf1964cacedae36d196c2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-4i4bcu",
						"name": "AgAD-j8AAuDxGEg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/1/9/2/1927cfa0473aef5e224803563747f9ffec531f0a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-8cyxz2",
						"name": "AgADmD4AAlhjIUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/5/4/654da94306cff3b5483892905326fbc72c1dc59a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-xbutnm",
						"name": "AgADmkAAAvelAAFI.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/e/6/e/e6ec33ccf391509c040d731f943185e3c3e7dd82.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-tgtmn3",
						"name": "AgADo0QAAv7HAUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/7/1/8/71890edd108988086966f4164869159c7986f301.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-pjk8nn",
						"name": "AgADQ0gAAnHJMEg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/8/8/08843d62a44eb9c6c024260be2df5c2aa0734ac3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-d9y09q",
						"name": "AgADuD4AAtkkcEk.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/c/2/e/c2ebd3bad7f5757462a4452ca525a12cdf22bc1e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-6nci0i",
						"name": "AgADxjwAAhSuIUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/d/e/e/dee93d2cd526874744d23f64e2cbd9dc1913f721.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-akn9uh",
						"name": "AgADXkYAAjCBIUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/c/6/a/c6a0f2ae52e226ba3653772efa4282f5f4bfe189.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-vi27e5",
						"name": "AgAD5DgAApM-CUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/7/a/8/7a8cff359e59e8c06491fd80ebd59021482c0157.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-3eztxc",
						"name": "AgAD9jsAAq0yAUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/3/8/6/386476028372387e19e22317860a2b2f904e1cec.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-7ij3sw",
						"name": "AgADIEcAAl50AUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/8/9/689cee812cd09114bbf80bd13fccff470a05095b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-32pnoc",
						"name": "AgADnUMAAiHnAUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/2/f/3/2f3c207ba32688f393f12e8e5de06359dd728006.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-1rh7tl",
						"name": "AgADwEEAAmhRCEg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/2/2/022fdef636782e80f37f1f9f4eb18886a81f81ea.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-vncfen",
						"name": "AgAD6kwAAsPucEo.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/c/5/6/c566da7c6537af3d87008373b9ad43874f4551a4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-uetgkh",
						"name": "AgADDkMAAnoRwUg.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/9/8/a/98a25447998c6c368ae069bb56c5d7ec5ef76384.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-bu8r4x",
						"name": "AgADVAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/8/f/0/8f016cc0991426ded0392ff82d978d98ceef7fb2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468947-q2d9a4",
						"name": "AgADVgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/6/e/46eb8d8591d3f394a08fd5860cbc029597ade031.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468947-4zba2g",
						"name": "AgADVwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/b/9/a/b9afc5ce7f99ba844a64222d7159a78bad96fd2c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468947-el2yxc",
						"name": "AgADWgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/f/f/0ff860740064c6ddd62c354362ab6c7d8ac76ba7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468947-wzvu3m",
						"name": "AgADWwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/8/1/2/81268a9e51a2a4876d840e1f729c713ecf2222a5.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468947-v2d7eu",
						"name": "AgADXAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/3/3/d/33d35db335014d7e48b7c4b5cb09ce11b4b0e7d6.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468947-1ibzv8",
						"name": "AgADXQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/d/7/3/d732be5dee26af1b10c42cafc80ad20f0098ad82.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-9wq4cj",
						"name": "AgADqwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/2/8/628ac7a00ffc1f489a146e89dd1baf92db60577d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-z5n9kn",
						"name": "AgADrAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/4/0/440e945ab23861c15f407f1b66bb562e1b5af475.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-yf03xx",
						"name": "AgADrgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/d/4/0d46429929ef3f32f737b1aadc4617064f2a03be.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-f9xlbv",
						"name": "AgADrwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/8/4/9/84981470e53138280d97a811ce70d0ed4a143350.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-kmzw9n",
						"name": "AgADsAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/d/6/9/d698eb16ba9b122621926569766ece37ec9e5c30.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-eql9ao",
						"name": "AgADsgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/3/f/43f52ad3e7ca076f5b9f0e91abc8872d09222efb.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-nqnr58",
						"name": "AgADtAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/c/2/f/c2ffed6b42aee1a134180e391892ac7505c69fde.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 288,
						"id": "emoji-1755968468947-3yby80",
						"name": "AgADTgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/e/b/e/ebeb992fa93448a01f7bcebb6f9e92966ffbf2f9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-8a5fxd",
						"name": "AgADtQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/b/0/1/b01e95e1d7d24b265beefee72caf1a03506c5d3d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-4uvlml",
						"name": "AgADUAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/9/4/4/9447cdd7760910ed770a6ef6cfc7bf6a7c4b65af.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-fdgki0",
						"name": "AgADUQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/2/7/62719d26c0ff0ed2a36fde6bf0a8c78db5861c74.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-cjdnm1",
						"name": "AgADmQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/2/d/4/2d4a3200cc348b3a9b969a3c30202afe1165382d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-w2f5xt",
						"name": "AgADmwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/7/b/7/7b787dab6be9f1daee589f95a51c1d01f1e1bd5e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-nwfo8a",
						"name": "AgADngADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/b/e/6be1e2faee7e45e2aa5059230b99b32c637296ad.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-kh6wy3",
						"name": "AgADnQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/3/f/0/3f08e8300267bf26a6e622d3d39261a91c79e5b2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-oetviz",
						"name": "AgADnwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/2/e/2/2e2c65cf93f9f74570b40f1358ab844d4a3c2f56.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-tkf9on",
						"name": "AgADoAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/d/3/2/d329e007ff8ba1ea89772998084f57fbb8328cf3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-djn98a",
						"name": "AgADogADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/8/7/5/8759284b9bb1909df7fb102baa4b9ab2ec90eca2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-fqskve",
						"name": "AgADoQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/d/a/9/da982872cd36a794fe5833b5808144514e784ae2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-ovuw1t",
						"name": "AgADowADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/3/8/2/38278cb3642c1d96fe5ef47880be82ba8a9135fb.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-xi5epa",
						"name": "AgADqwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/2/8/628ac7a00ffc1f489a146e89dd1baf92db60577d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-2s1kwb",
						"name": "AgADpgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/3/5/8/358958d143602b8f9479319294f6ec603e6ac4ff.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-mdkpeq",
						"name": "AgADpQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/8/3/e/83e70e57e606584cac82dcc096a85cf0e6f45ca3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-bbccea",
						"name": "AgADqAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/6/8/0682e77b96b8779d46b2be2c081b6b44503f8dce.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-zl6ve4",
						"name": "AgADqQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/0/0/40054f3f546621f6232530b4c0877760619a4d8d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-n6o3o1",
						"name": "AgADjAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/7/d/1/7d1bec0893db69ea8d108fffd10603d9f522f8b3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-5r9knk",
						"name": "AgADjgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/c/b/0/cb0bab059a47e58b7616010ef9e1fae7b67ab697.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-zlvsgb",
						"name": "AgADjQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/d/7/4d78c52d83ef3993403dc9578fb5d6f650f1416a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-64pwfi",
						"name": "AgADjwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/9/d/f/9df1428a2f4b8369c1ac9833191338e6ef51cf2f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-0gy7jk",
						"name": "AgADkAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/9/6/8/968e90c98dbb8176af756f125d300f05fbc691f3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-lsxlhz",
						"name": "AgADkgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/0/e/c/0ecd4281a5a1756d691b3da600e0fa45bd1718f5.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-gfto9r",
						"name": "AgADkQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/9/0/6904c5d2ddfb651c783acccfdb70dad6f2c4f254.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-b98bhk",
						"name": "AgADkwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/c/4/c/c4c76ea52c3f1b3aa54801fc6717d81d2f4b5bec.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-p5hu3t",
						"name": "AgADlgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/6/5/9/659b6c4fe9858cd36f234ed1fff968adb6bf5f64.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-33cxki",
						"name": "AgADlwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/f/0/2/f025c6084158bed232952dfaec18234991140885.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-gd0xk7",
						"name": "AgADmgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/f/6/a/f6a07aeda090a9b3f10800cd59ad0ceaec02c2ce.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-5itgvg",
						"name": "AgADewADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/5/8/4/5848b102fc207a0b521a0e3b3226118167e92199.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-k5on4i",
						"name": "AgADfAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/1/4/e/14eae19f04b8496df1a95a30eea63dd0f718e885.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-v9h9my",
						"name": "AgADfgADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/4/3/5/435bda80ca2382035f40d2c80ed9c471227f2e4b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-h0snz0",
						"name": "AgADfQADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/9/c/3/9c30fab3e3b02f257aa0bcd4d7f64c8f4af187a8.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-u32182",
						"name": "AgADfwADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/b/3/2/b32b0c0417f388e9634e8b23b1d791d12325e08d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-y00189",
						"name": "AgADgAADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/e/4/b/e4b858f347cf42cda93c0b179ca924b566a9a1ad.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468947-mxf8um",
						"name": "AgADggADE6fODw.webp",
						"packet": 1755968468947,
						"url": "https://linux.do/uploads/default/original/4X/5/4/c/54ca2d415f2d57a87197735aaa4d4651bb62dd27.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-2fsll1",
						"name": "AgADgwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/4/9/a49e28a35b44648a6732d03afa4fbe426646fb46.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-b5exk2",
						"name": "AgADhAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/4/0/0/4003969d14292bca009b73fa7dbe35aa5b533800.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-sh3sjh",
						"name": "AgADhQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/0/5/c/05c20a6b9f9cf6f11a45bc6e435afe526f91075e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-2zjn45",
						"name": "AgADhwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/9/1/c918c906352490dbf647ff4ff84cd4238e16f767.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-7f9y9p",
						"name": "AgADiAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/7/6/2/762cb9a9b506d58c63224a6c642fa3832fee612f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-3byr76",
						"name": "AgADigADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/e/9/ae9992fe17b00907de61426abad10c99dd7fea1d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-4gurkm",
						"name": "AgADiQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/d/e/2/de2d375a8ca4b0727bc627179fa9e58b1a53f697.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-caimwx",
						"name": "AgADbgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/6/a/c6a37690c5dcc0716ccc7374d99d710139c67450.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-txdrrg",
						"name": "AgADbQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/f/d/4/fd49fcbc229aaf5c4ef0f6960257e841e0e05a12.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-by1fda",
						"name": "AgADbwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/0/c/d/0cd622ab11beb51fbeea6db5d88b838bedf56c23.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-k7xo98",
						"name": "AgADcgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/d/5/e/d5ecb5eebe3b4a891bf982c494f99d85385b233c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-1glzgs",
						"name": "AgADcQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/0/9/b/09b85cda4e852e1051193a0831d107724f5640cf.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-57vaxt",
						"name": "AgADdAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/1/e/7/1e70bde136c44da046f218e78deb629f136cfc1b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-56n6mr",
						"name": "AgADdgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/8/d/a/8da4e61b9552d1b1749d8f5b6b512004b8063f6d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-jed8j3",
						"name": "AgADdQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/4/7/6/4761a25afc47eccd01305ec149d83ee7e9a3008b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-70634i",
						"name": "AgADdwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/f/b/afbebaa3bf50db956b68d2fde136d8aced10324a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-b0ku2z",
						"name": "AgADeAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/8/1/b/81b9aac15ea26dae41dd02e0ce8964d46a4a2a31.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-dpbvjd",
						"name": "AgADegADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/2/9/9/299b5240f1942fc26f662957fae47e632326d2b7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-kqaimg",
						"name": "AgADeQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/4/2/c/42c0ae4ae68a9f4cae08e35cd82e4ceeb9074c64.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-ml2jjw",
						"name": "AgADaAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/8/d/c/8dc6a248c730c8a1ee3e62cd76b26a2dadb45c60.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-1zo7tb",
						"name": "AgADawADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/c/4/6c44eff3635fc97ed284599e592734713e0b1962.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-s49ycs",
						"name": "AgADbAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/b/2/d/b2d65568d6f9611dfeef95b394c61c610d91f36f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-mhp7tv",
						"name": "AgADYAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/2/6/e/26e445ed6364f7746d8ea777cb9714687db15e60.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-gvnsuz",
						"name": "AgADYgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/4/b/e/4be89b7f5231d017054c9aaab2b652e0dff3e168.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-n5feap",
						"name": "AgADYQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/a/f/aaf2494cc46b6b087880ea4f5340642914dc5be7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-8xadew",
						"name": "AgADZAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/7/2/672d7bd30f6d065439e8d2bb37909b9932bc72e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-u8pdun",
						"name": "AgADZgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/5/9/b/59b15d578a9248ef4a83180d18262c6355af5560.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-mr4e6w",
						"name": "AgADZQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/2/9/a29d3ebd8c452050b41c39c76ccf84ec53e4d2f9.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-yyf6zd",
						"name": "AgADZwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/f/8/cf8c348107e52e38f7d7dd726fbf6286d16a407e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-zoyrzz",
						"name": "AgADTD0AAl7qOEg.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/5/2/6/52624a5055f255dc97279a49a0a5215676ba812f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-pkj0i0",
						"name": "AgAD6gADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/f/a/4/fa4ba578014f860191a1f148a5e2267201e1c585.webp",
						"width": 482
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-qdt6r7",
						"name": "AgADUgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/0/9/7/097be0ffad007195e432419a9ce01d3450d49122.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-i14syu",
						"name": "AgAD_wIAAhZsgFY.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/1/4/4/1445d1b6f365a370bac98a4688a39be9d4375b96.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-pw5h6n",
						"name": "AgAD2QQAAoo8gVY.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/2/c/9/2c9abfa7f7602c3373c101547c82c2cb869a6ea4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-somuci",
						"name": "AgADKwIAAlz2gFY.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/8/c/8/8c8b695c6c0bfedfcdfe4444e9b25dc16c45b42a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-5syeb1",
						"name": "AgADNwMAAqIpGVQ.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/5/7/5/575a4cd14a5f741805aabb7602cfde1faed9c4a7.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-j8enle",
						"name": "AgADPAMAAi6UgVY.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/8/b/3/8b3ec9299ff2f77b6f70a0564e1f98bd926125d3.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-jzoiey",
						"name": "AgADRgIAAre_GVQ.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/f/a/6/fa6d6ea3f6554efde68558ceeb900704192c6e5d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-d7km89",
						"name": "AgADugEAApO0gVY.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/9/c/5/9c5b0e710446eea45435ccdbb86514ef471ce45e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-np1wmm",
						"name": "AgADVwQAAq2BqVU.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/e/d/2/ed22d9fd0c75c3be177d5fd475c4a2e90e7cf4fb.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-44dev0",
						"name": "AgADwAIAAjcEmFQ.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/5/d/d/5dd5ee14b031f653678588bc5af51bd39fbe7885.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-tfbzc2",
						"name": "AgADZQIAAkaywFY.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/8/1/681e89f0de89139d6c1c979240d1ec634b0c4311.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-vb648b",
						"name": "AgAD5gIAAobjGFQ.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/c/f/acf6d1df2627d4368d2babfa3c98dd7f3582b2f4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-fno27e",
						"name": "AgAD7AIAAsetGFQ.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/5/f/a5fe3d9349a2d21f9f38cef303464573a05f78c4.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-9tcmoz",
						"name": "AgADbgIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/1/3/613387f3510fac1ca7f00e4be63da1aed4207d18.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-z8x5kw",
						"name": "AgADbQIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/7/1/a/71a92c2c80f24857c0662f36be397dbdb808c191.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-i3th8c",
						"name": "AgADbwIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/2/1/7/217f2d5318c861f7fbe82713cddeb5b5e206d27c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-gcj4hf",
						"name": "AgADcAIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/9/e/c/9ec6302ca5ba463c5a83282f0d128ca2cb2ee245.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-5lh39l",
						"name": "AgADcgIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/7/e/2/7e25c21f1ccc82ff8477140969b2e93aecf5c682.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-4gml1w",
						"name": "AgADcQIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/9/3/1/931ccc4d013a0a3efe6db6f6e485cdf41206ae98.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-503ook",
						"name": "AgADcwIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/e/1/e/e1e9ba10d53c59704f73894e5cb19e5a6c74636f.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-lzbkme",
						"name": "AgADvgIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/8/d/5/8d5733769b70960b6b7e5f3c8e033640015c1961.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-70vojw",
						"name": "AgADwAIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/5/f/65fb2795f5c6f90180db6a085a6ba45e6c655a2e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-rsr1wo",
						"name": "AgADwQIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/e/8/d/e8d7236e1368dbe18c088bb666ca95b90611284c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-stnwts",
						"name": "AgADZj8AAuVMKEg.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/0/1/5/015e143b98b7aa086ceb40b8a818340fff1da3c1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-xuvn9j",
						"name": "AgAD6kQAApeyAAFI.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/2/7/1/271462f4672c53ce505d1f59b8de01c1f99bfa51.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-nhmdsg",
						"name": "AgADJ0MAAi65CEg.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/0/9/3/093524b5dbde656a60337fa7dd18bc906ce7720d.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-662iaw",
						"name": "AgADUwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/1/d/c/1dcbcc9a1319a55d8c933c1d7ea430c426ab038c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468948-q1u5i7",
						"name": "AgADVQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/d/e/4/de49ba03383baf87af664cb9b7e135ccef2b2b26.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468948-nkyxt0",
						"name": "AgADWAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/4/6/7/4676ebf0d9eb9535721784962a494e188de5585e.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468948-4iboq1",
						"name": "AgADWQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/9/1/c91e945063ff2551cbf4c7f4fc4dcf12fad9adef.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 482,
						"id": "emoji-1755968468948-9uqch0",
						"name": "AgADXgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/a/1/ca19ecb28cd4c5aa9a0d5a21210de80a6a559573.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-uhf72y",
						"name": "AgADswADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/1/3/1/13172001057982f312d1134a6994019ab4ce104c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-oe1owm",
						"name": "AgADTwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/7/a/4/7a4f72abd9acf97b84eaadce74a6f80cca819f97.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-38lci5",
						"name": "AgADpwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/7/f/67f68c4436281ead4a4501306e8bf03cb8c12b37.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-a2zd6h",
						"name": "AgADqgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/8/8/e/88e002210d0ad970f110dd5286661754e63be0ff.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-z5r9q6",
						"name": "AgADiwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/3/c/63c3d3c322a564d474ff3c7731ecf5a158f2fe22.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-ujl4z5",
						"name": "AgADlAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/4/e/f/4ef63c4a505b6b1eef5483c09f53902621e68757.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-gj5rfh",
						"name": "AgADlQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/7/9/b/79bb4c4dc0ddbc4e2676776c3fa8df9449719558.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-qqbc22",
						"name": "AgADmAADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/2/6/3/263d99dcdc21a640ecc16eb726600cac05e35c43.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-qn0ewn",
						"name": "AgADgQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/b/9/cb9db00d61ccce326bfafc35193690f350508506.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-6lt2g1",
						"name": "AgADhgADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/a/8/8/a883f510651d3905f10d2e6c6e15e498fe1e7f6c.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-e9m25l",
						"name": "AgADcwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/b/6/c/b6cdb5a0ec65f9281f2b5488dd881fe566856f8b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-k1m1ye",
						"name": "AgADagADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/9/2/c/92c2192fedac164e6c1eaafb51dc4001dfe22def.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-3taw35",
						"name": "AgADYwADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/f/8/3/f83764b3e6d3599af4baa2a4f27ea523ff38fbb1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-gmd5fb",
						"name": "AgADckIAAhWfAUg.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/3/e/4/3e417ec4e14d62117db5b0050eaf68343ca4ae0b.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-5tz1dk",
						"name": "AgADqT0AAg4WKEg.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/6/d/8/6d892147a98fc32704a80244363c2eb97218f1b2.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-25ux9r",
						"name": "AgADZQMAAgR2yVY.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/f/f/cff4ae40ca393b84e35b4454c5a15326e8cc4be1.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-rns550",
						"name": "AgADbAMAAt-iGFQ.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/0/2/9/02974500cf4e5728483a5524d68ae8d3d4c33167.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-01qqb0",
						"name": "AgADvwIAAmjyEC0.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/4/c/9/4c9ee9e33049d7f4cc317aa1e5b9f3d7fc85fb61.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-20fatn",
						"name": "AgADwwIAAhEXGVQ.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/f/0/d/f0d7ba53df728ef970aa057fe0e366b9ce15ba1a.webp",
						"width": 512
					},
					{
						"groupId": "group-1755968404073",
						"height": 512,
						"id": "emoji-1755968468948-i2bgas",
						"name": "AgADrQADE6fODw.webp",
						"packet": 1755968468948,
						"url": "https://linux.do/uploads/default/original/4X/c/3/b/c3bb86661a708ed870106223499c00892ab8e6bc.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1755968404073",
				"name": "鲨鱼",
				"order": 10
			},
			{
				"emojis": [
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-u4sfe5",
						"name": "开心表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/5/d/2/5d203e597d8674c8859f32408fc9ccd36118f074.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1536,
						"id": "emoji-1755913817919-pm6y19",
						"name": "调皮表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/9/3/d/93db9ed78e08426ab8694030b38fa435d58b516b.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-n33reh",
						"name": "得意表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/3/7/5/3751e8671272f13b9459d75afea7b5c753fcdbdf.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1536,
						"id": "emoji-1755913817919-lrgmbc",
						"name": "兴奋表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/6/7/7/6771733d4176267d9a0a694d632544240a7e359b.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-8rkh9y",
						"name": "惊讶表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/5/f/c/5fc75f5ddd33027a8936a6c37132c410bac8e411.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-2pd9vb",
						"name": "无语表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/7/9/f/79f43fc1cc1cc19f2b8753f6360ecff1f625ac21.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-6rdd5y",
						"name": "思考表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/0/0/b/00b26a0bf5e6d347f74c5d7fcb893ea0bf59f709.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-ex69uy",
						"name": "疑惑表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/f/3/1/f3154aa2c232a3badc6c651edc9f832abc983d51.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1536,
						"id": "emoji-1755913817919-wb95b7",
						"name": "爱心表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/a/5/a/a5a28c56591b39b58ae59f4b84ac51877c768e37.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-kl8lb9",
						"name": "害羞表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/5/a/e/5ae2f48ee13b6361ae7d74a576747d50e78b40f4.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-qtxyax",
						"name": "悲伤表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/4/a/0/4a08ad7ba72beb50d5b4d003c8322fef7e1161a7.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-lpywdb",
						"name": "满足表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/5/a/a/5aa849882b1acd9ed46fcfccc2c36aca3c32b576.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-y73fp1",
						"name": "恐惧表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/f/2/8/f285ea7eebd13221bd9ee340fa7104fd42dd102a.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1536,
						"id": "emoji-1755913817919-fioyv3",
						"name": "委屈表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/1/c/b/1cb69d62d240250ed471dce9fa23aaa5e8d90cdb.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-yd2vk1",
						"name": "困倦表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/a/c/3/ac3857beb73643a37c02fb7c8ae3ba09bb449113.jpeg",
						"width": 1024
					},
					{
						"groupId": "group-1755913811947",
						"height": 1024,
						"id": "emoji-1755913817919-h68uok",
						"name": "生气表情",
						"packet": 1755913817919,
						"url": "https://linux.do/uploads/default/original/4X/f/5/5/f552002bb04ab67e75783bb4811fea184c6f1784.jpeg",
						"width": 1024
					}
				],
				"icon": "📁",
				"id": "group-1755913811947",
				"name": "始皇酱",
				"order": 11
			},
			{
				"emojis": [
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-04hk34",
						"name": "AgADRwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/b/e/1/be1f072b961af18e346fee0625a51a2636160d5b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-h6kiqs",
						"name": "AgADXQEAAp9oxwM.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/a/0/3/a036cad2281234d8bbd2a07dde79ddd2aad375fd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-q4qnuy",
						"name": "AgADhQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/3/4/1/34162a5d36fcdf5560003a11ef06283803f67616.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-jpm54k",
						"name": "AgADiQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/f/1/d/f1d2e9e05ea9e1d3929253ac973e77e36798a218.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-ctm58q",
						"name": "AgADiwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/7/9/f/79f1555f92fac203bf7e58f18592c501ad4f558f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-9blegq",
						"name": "AgADjQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/2/4/9/24968c9fdbdfedb3fc3537c4159c3b17474b26cc.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-1q6tx5",
						"name": "AgADfwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/b/6/c/b6c2db37db44c88d49dc9f8ad6e14e6a221fd5df.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-8jbyxc",
						"name": "AgADgQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/9/0/3/90374e440053fee9a660fd85782bf5b14a6f8f0d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-xxe1ah",
						"name": "AgADgwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/b/9/6/b9613456c03f5ddb99af6c712246c5855575e21a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-57qvte",
						"name": "AgADhwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/9/b/3/9b3285f02e52b57623eb376a9cebf40fbe468b13.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-02c46i",
						"name": "AgADfQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/5/5/2/552ebeb23fd0b6ae99cd5e944faf730e9baed91e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-vktrvx",
						"name": "AgADcQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/c/5/3/c53b9b0548261e21e4c506c4ef85601a684ee29a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-8bjimc",
						"name": "AgADcwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/1/f/e/1fee51aa367c32172cda35604b9bda7d1c207d26.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-2ys7g7",
						"name": "AgADdQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/a/2/7/a27adfbe5c95b607f36ece3a199e34f71bdb49dc.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-9wfb2t",
						"name": "AgADdwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/8/7/a/87a42d35759526769c0bc29bcdffd258ff3da7f3.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-oil2hx",
						"name": "AgADeQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/0/e/2/0e2d336a4a61f52f254d46ef7f1c244419c80f6d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-koxveb",
						"name": "AgADaQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/0/0/c/00ca1439e012b2d36e385ac021ff552a1eea6450.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-297c4s",
						"name": "AgADbQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/a/5/9/a59523a3c50f3981f024dd31732c043d062f1ecd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-6xnzhe",
						"name": "AgADbwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/6/b/2/6b2d43228ce21f4c712306280f255230a5e9658d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-b8qdw9",
						"name": "AgADawADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/4/6/3/463bf803987f53e50b39a3dbdda47b7fccecdd20.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-474pl8",
						"name": "AgADZwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/4/4/5/4450b570dbea8a0008869050e236091a35835cdd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-mghcxw",
						"name": "AgADVwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/8/5/b/85bca20a34660e24245344937dcbcd7598fc619e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-v26qyk",
						"name": "AgADWwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/3/e/2/3e2623cd126b2935d20cbeaea2b8b6b953091a95.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-futvfs",
						"name": "AgADXQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/b/8/c/b8c7881a31b61f664feb9580b1eedccbf7312d0b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-oi84dj",
						"name": "AgADXwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/0/d/8/0d83f719d8c6578bd30833bfba7af66f9ee8850c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-sfd1ak",
						"name": "AgADYQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/0/2/0/020371c94e1f2e342c11fde4b98b94fdee0a68c9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-3og83s",
						"name": "AgADYwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/0/b/2/0b2bfe4f80c76462465058e65bc4388dae6343e0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-wp6irh",
						"name": "AgADVQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/7/d/b/7db2431ee788fe26e3de7d445cfd320c62921a18.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-ep11tg",
						"name": "AgADTQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/c/4/3/c43a402eeb6e5c1c48f8bfbd9a5ab2cdae1cfbf0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-67o9a9",
						"name": "AgADTwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/3/0/e/30e1623ce7ba6f86601e8d04e35478802221559a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-pow14l",
						"name": "AgADUQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/d/c/b/dcbd32154cc3ee45bbe6b35f9a9df9e7c42b0702.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-xn8le6",
						"name": "AgADUwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/b/2/5/b2503de911d4c4f1fdceeeb892a133cd23cbcb65.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-k19j27",
						"name": "AgADRQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/f/d/2/fd2d3d1060660e91f11293cb4af67ce6d283dc4d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-81wp8i",
						"name": "AgADSQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/8/e/6/8e62feb7a39c44bf62ce134567f640c4304c05fc.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-fsh2b6",
						"name": "AgADSwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/f/2/d/f2dc7b23c722ca9531962d290b6005df913fb20f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-jsqyed",
						"name": "AgADPQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/0/0/2/002f65d657b0f3363369e4e67dfaf8820ed896cd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-rut5vq",
						"name": "AgADPwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/3/9/c/39cb7437896671109c2246d280ba5f6bee97ece3.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-5gmiap",
						"name": "AgADQQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/3/0/d/30dee1dc80302f14f35390b9bad85bbe05f3d3e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-vtj9go",
						"name": "AgADQwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/a/5/c/a5c1b773010ec16b82077e1b28cf9094a4e199a0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-ihjy45",
						"name": "AgADjwADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/7/7/a/77afdf50cb3fe63d4991dc6ea23e312f417fd709.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-k7hlks",
						"name": "AgADewADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/d/a/b/dab0bfa98b8e0c15e9443966e2a53eb2167a2572.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869834619",
						"height": 512,
						"id": "emoji-1756869844258-cjx41t",
						"name": "AgADZQADn2jHAw.webp",
						"packet": 1756869844258,
						"url": "https://linux.do/uploads/default/original/4X/a/1/5/a158deace9f264be58337dacc4c1c0b2bbf09a8f.webp",
						"width": 512
					}
				],
				"icon": "K",
				"id": "group-1756869834619",
				"name": "KJU",
				"order": 12
			},
			{
				"emojis": [
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-n7kx2z",
						"name": "photo_2025-08-25_14-53-42.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/8/e/f/8efbb0b046abe76e8bc3923a05e02cdf0ffa594b.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-2net1v",
						"name": "photo_2025-08-25_14-53-44.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/8/c/e/8ced0afa8014ba2ee6c2df452208aa044de84791.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-1lye28",
						"name": "photo_2025-08-25_14-53-45.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/8/b/8/8b847bd9dbec03a891c59113d7d2e28f253b41b0.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-lhhz5a",
						"name": "photo_2025-08-25_14-53-46.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/b/5/7/b579400e6085d6e2d00e93d0e4ccbec7adf42a31.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-u9o2gb",
						"name": "photo_2025-08-25_14-53-48.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/4/9/6/4966bfcd1289ac6a1604c50937ac1b9e20904da1.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-uzj8bn",
						"name": "photo_2025-08-25_14-53-49.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/6/b/1/6b1d244fd5567a0817dd0444ea3587f67cbdb6eb.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-u53gw0",
						"name": "photo_2025-08-25_14-53-52.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/7/9/8/79856b9fb9139a9279b5300fe36b7e3b39ade3cf.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-uikpzf",
						"name": "photo_2025-08-25_14-53-53.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/7/a/0/7a0ee20ae7af9f05acd9e4a5b86da2e9aacf64d1.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-n60ygd",
						"name": "photo_2025-08-25_14-53-55.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/d/4/7/d474b19018df1b31bae49e8563bb75e666319f4e.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-hpzjyt",
						"name": "photo_2025-08-25_14-53-56.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/d/7/6/d767c44ef487c5736a476003cf0d6e6e2fa080ed.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-szyj78",
						"name": "photo_2025-08-25_14-53-58.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/9/8/b/98b0cbe4b1144f3b7c77b7c06630d14fca004049.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-dw14vi",
						"name": "photo_2025-08-25_14-54-01.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/f/d/5/fd5bcf47f7300a438ec7359b972dd356e36de338.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-kz9sg4",
						"name": "photo_2025-08-25_14-54-02.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/e/3/3/e33c091e1408cfabefc439443cb08d1a5e38ee6f.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-lfg14p",
						"name": "photo_2025-08-25_14-54-03.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/e/0/9/e09706e239f1bd01b4c08c4132d4d86a968ffc82.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-6ky4s5",
						"name": "photo_2025-08-25_14-54-04.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/c/7/a/c7aa4053bb358a6b8962d3645fc4efb673415d99.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-0c8ufv",
						"name": "photo_2025-08-25_14-54-06.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/c/9/6/c96dff267544b4bddeeffa486fc4648d02ec8fa5.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-j7dsxy",
						"name": "photo_2025-08-25_14-54-08.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/a/7/6/a76f24a169510c6c9427dddfb9f33c843295807a.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-d96627",
						"name": "photo_2025-08-25_14-54-09.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/e/7/4/e74fb9f3cbe3bd597b8b5c0e0f1816e91cfb46f5.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-drycaj",
						"name": "photo_2025-08-25_14-54-11.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/3/e/e/3ee66bd14f0540f44a0602e8e12f573497a07e8a.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-ivh2z3",
						"name": "photo_2025-08-25_14-54-13.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/2/8/0/28039c91ae7d67f2873a916640fd6972b88bb5d7.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-by2s0g",
						"name": "photo_2025-08-25_14-54-17.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/1/9/4/1940cefe07cb6b1648b38bc7c2d424c9295c69b7.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-gij96g",
						"name": "photo_2025-08-25_14-54-19.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/a/0/3/a03af5deda009c402adb283a2bf64de8a621ead9.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-79xbh7",
						"name": "photo_2025-08-25_14-54-22.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/9/5/e/95e9402f88d12f561f227e6ba0949c1a4cf9b64d.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-4ai6ww",
						"name": "photo_2025-08-25_14-54-24.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/0/d/c/0dccc0f62430f8f413caa3de76d2de1e265d0f8f.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-mv98af",
						"name": "photo_2025-08-25_14-54-26.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/9/6/4/964afdd4e38bf4f14aba43079cc24e57110010fc.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-eja1v2",
						"name": "photo_2025-08-25_14-54-29.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/4/5/6/456e1d077bcb22eabb392c82126f0bea0d42233a.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-boctd3",
						"name": "photo_2025-08-25_14-54-32.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/9/3/9/939c90b56a4560f17f1dd72065bf82aefb62c9ab.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-7g25tx",
						"name": "photo_2025-08-25_14-54-33.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/1/0/a/10af6277f014c74dc1768f99392694818c164410.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-mqihzz",
						"name": "photo_2025-08-25_14-54-35.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/4/9/1/4913408e8fa11365d387b7049f83d14d6d05a096.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-zjrtk9",
						"name": "photo_2025-08-25_14-54-37.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/6/1/b/61b5f3ad2e9a5af1082e283e579470bbb1cdef5e.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-gvb9rd",
						"name": "photo_2025-08-25_14-54-39.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/1/1/5/1151002c35ad0e1d9d0bf34d6af3ccfaf65622b6.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-a4cxjy",
						"name": "photo_2025-08-25_14-54-40.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/7/1/d/71dbafa4f06267e293b26fcb01e76e3a9a978343.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-0lx7hh",
						"name": "photo_2025-08-25_14-54-42.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/a/d/9/ad903010952c611590a7de6bd58d14916f1cb64a.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-4patcj",
						"name": "photo_2025-08-25_14-54-43.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/f/9/f/f9f21febd71903dc85a6c0e6a4dbe68097faf414.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-sih1t9",
						"name": "photo_2025-08-25_14-54-47.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/7/3/d/73d4e03dbd40c5897b881ec0efb241d056a206c7.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-xoqehn",
						"name": "photo_2025-08-25_14-54-52.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/5/4/c/54c7236b26355b8513b6c30738d360eee405493f.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-cz6zel",
						"name": "photo_2025-08-25_14-54-55.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/3/1/9/3194570ba10289b0be03b3c1dabb873fd6edc211.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-7dyrob",
						"name": "photo_2025-08-25_14-54-58.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/c/c/c/ccc47017ef28a9aff3e09de877a9c71fdbb1d7e4.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-3yzypt",
						"name": "photo_2025-08-25_14-54-59.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/e/f/7/ef749b0661c9953929d77b5b4c59045ada2117c1.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-o9yisk",
						"name": "photo_2025-08-25_14-55-01.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/b/9/e/b9eec4e9b0b99f7fe38a2c8200e3c9e835d8bb30.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-aktbn6",
						"name": "photo_2025-08-25_14-55-02.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/b/d/0/bd0b04d3dc7988c9640aa61f11b51813a3cebe31.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-thfsdk",
						"name": "photo_2025-08-25_14-55-03.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/7/b/e/7be1a69c6cc7f9c2563446d999468739107ca7b8.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-7vi9c5",
						"name": "photo_2025-08-25_14-55-06.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/5/a/0/5a01435b5b3f08cdf73ea400d7cf60ab0202d761.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-y3xlbq",
						"name": "photo_2025-08-25_14-55-08.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/2/c/3/2c38165aecd36237629279aaa52938471d2df728.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-w3uayo",
						"name": "photo_2025-08-25_16-55-36.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/c/f/d/cfd6efc13f7031127cf60fede2ec3f1c2f0c8771.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-48cuwt",
						"name": "photo_2025-08-25_16-55-49.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/f/9/6/f960553ea528f0c25d313ce169164114d4e83e01.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-4m3ar2",
						"name": "photo_2025-08-25_14-53-41.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/c/6/d/c6daa98d425ca52d0be4226def914d4304dc0404.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-4wq4jp",
						"name": "photo_2025-08-25_14-54-15.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/a/6/f/a6fb1871f1b46c674d6d080b874dbdded6e9842a.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-w8b8fw",
						"name": "photo_2025-08-25_14-54-21.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/5/3/f/53fe1ef812de7089b1372455f26a267ab96aa921.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-zre89m",
						"name": "photo_2025-08-25_14-54-45.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/7/b/e/7be15b36f9338fe5d2b598c7bc33c654b04a7b5f.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-75s78p",
						"name": "photo_2025-08-25_14-54-50.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/7/e/a/7ea3429896a9c2698040696b728960153c25949c.jpeg",
						"width": 1080
					},
					{
						"groupId": "group-1756869864620",
						"height": 606,
						"id": "emoji-1756869870912-24u29j",
						"name": "photo_2025-08-25_14-54-54.jpg",
						"packet": 1756869870912,
						"url": "https://linux.do/uploads/default/original/4X/c/a/9/ca9def97014798279ea94efd92f8e5ac210a6b09.jpeg",
						"width": 1080
					}
				],
				"icon": "H",
				"id": "group-1756869864620",
				"name": "husband",
				"order": 13
			},
			{
				"emojis": [
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869905756-rp5lkc",
						"name": "AgAD3wQAAtsjcFU.webp",
						"packet": 1756869905756,
						"url": "https://linux.do/uploads/default/original/4X/f/d/7/fd70d85ac2149cbeb2250ff9cc9b54998b7e3186.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869905756-nf3w2w",
						"name": "AgADWggAAin7aVU.webp",
						"packet": 1756869905756,
						"url": "https://linux.do/uploads/default/original/4X/9/d/b/9db8d394a88c93dabc05a05be524f637c8d9e088.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869905756-wd5iua",
						"name": "AgADEAcAAlMIaFU.webp",
						"packet": 1756869905756,
						"url": "https://linux.do/uploads/default/original/4X/c/5/2/c527953bb936d4ff2e849b9529e4c2ae19081a6d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869905756-sntncr",
						"name": "AgADSwQAAtVkaFU.webp",
						"packet": 1756869905756,
						"url": "https://linux.do/uploads/default/original/4X/e/b/5/eb5adfabfce7f06dc0c624bc7190fb366f7fd9b9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869905756-18umse",
						"name": "AgADXwUAAo_ayFc.webp",
						"packet": 1756869905756,
						"url": "https://linux.do/uploads/default/original/4X/5/4/b/54b1c247731a64f0c91506406e63d296258bc6f8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869905756-yvf44g",
						"name": "AgADdAYAAvLYyFc.webp",
						"packet": 1756869905756,
						"url": "https://linux.do/uploads/default/original/4X/4/1/9/419c27bbc508e9c2c445df4c3ed5e0dc47928a2b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869905756-q0ka98",
						"name": "AgADkQMAAjmA0Vc.webp",
						"packet": 1756869905756,
						"url": "https://linux.do/uploads/default/original/4X/b/c/6/bc6f65bc06cd893c91279308caa657f10fa7e995.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-9or4zo",
						"name": "AgADdAcAApwZcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/9/6/3/9639de445d6f9633e17b58194bfb815ef8b7ef35.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-ie3337",
						"name": "AgADIgUAAty9iVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/e/a/dea585799f6c29d6cc8e2c645515acbcd964ed32.webp",
						"width": 493
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-t9oct0",
						"name": "AgADOQYAAn70iVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/2/b/f/2bfc8553fd1071fd87a75cb007901a2d667de4bf.webp",
						"width": 493
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-6okb4y",
						"name": "AgAD_QUAAsdkcVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/1/e/c/1ec93ab43b94b3f0408bbde1367592686390e126.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-u4m8uk",
						"name": "AgADMQUAAnmwaFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/f/9/df9bd03f737d535f70ca9de0e1c445a1509ec501.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 510,
						"id": "emoji-1756869954251-avgbqn",
						"name": "AgADtgQAAhX8cFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/1/d/b/1db9d5056b4376f1bdb31e8e441b470ca98b8113.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-npzq58",
						"name": "AgADVAYAAt06cFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/3/e/f/3ef16708aa54b174ba1c6634f267fff0d87b56b7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-wqbfl9",
						"name": "AgADXAcAAlvQaVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/5/e/f/5efebf91bce0a4c3330c85b04133b37537f2815b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-s12koz",
						"name": "AgADFQYAAmSbcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/0/c/f/0cfc41fd6ebb8c98c1405342b9fe851adf6cd608.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-lagg3g",
						"name": "AgADfwYAAs6DaFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/e/7/b/e7b3c98a362dbf95cdb511a8053c4e37a8e39017.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-u6yv5o",
						"name": "AgADsAUAAmKOcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/7/e/8/7e8233f199a591aaedf68df1acdd87e55874f021.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-3irrrw",
						"name": "AgADXgYAAshvcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/4/f/7/4f7a89c83697a38fb587a72f449d8c04fd41b956.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-y2u1jp",
						"name": "AgAD_QMAAnRhcVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/7/a/d7a7007d6ff377b8fb0631477247e2db11af2882.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-fue0vj",
						"name": "AgAD8QUAAt5BaFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/9/a/b/9abd24fa3bbed86feea9b9795ab955a72acb2a2c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-1cnz8u",
						"name": "AgADDQcAAjcrcVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/5/3/3/53335e7282bca1729d31a29aa5bb5243696b9f00.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-jqjalo",
						"name": "AgADsQYAAll1aFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/c/6/1/c6142c6f56e9922a81dedf8abfeef8298ec69f42.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-v9g2yv",
						"name": "AgADTwYAAjtRcVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/6/b/2/6b27d0dc4f44a76b17ba526694799b72338fc3a5.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 495,
						"id": "emoji-1756869954251-8w1zx3",
						"name": "AgADegUAAqiucVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/2/9/0/290cbc191188c5448a9cbbce49f4497a25667be7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 491,
						"id": "emoji-1756869954251-6t3sn2",
						"name": "AgADFgUAAmHzaVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/2/4/e/24e1a6573a16b0eede25009d639fcb2df85abf0a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 502,
						"id": "emoji-1756869954251-cwqs71",
						"name": "AgADGAUAApMPcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/c/c/a/ccacd68f1d3883b372a7c53602d8a58d246a3e96.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-ac08ll",
						"name": "AgADoQYAAveqcVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/b/c/8/bc8ffb8108899742e67aeee44b29128320040f0b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-jnhgo5",
						"name": "AgADYwUAAgQyaFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/3/9/6/396023ff753e1f349b5a9110d32177a5895cc059.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 341,
						"id": "emoji-1756869954251-bay2yk",
						"name": "AgADcQUAAkvCcVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/a/4/d/a4df24f43d21d78d7494dfa2d4e12ab4a4891f92.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-pburyz",
						"name": "AgADjAgAAvnScVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/3/6/4/3643c466c494bfbd3a1a0e058b10383826d492b1.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 341,
						"id": "emoji-1756869954251-qqnycu",
						"name": "AgADNQUAAmG-cVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/c/4/5/c453eef0b8bc6a55895aebcd306a1527aafed0b5.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 341,
						"id": "emoji-1756869954251-p8tfsx",
						"name": "AgADTQYAAlWjcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/7/2/2/722c110990e4b669d7b6a98704d57e0ae85d43a6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-c1mhws",
						"name": "AgADagUAAjDFaFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/1/9/2/1929378f7955749aa02fbad963cd9f04daf9d591.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-4dxamy",
						"name": "AgADBQYAAp1ncVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/d/f/ddff7d120f7401c8fbcefa1dd765a5cc900610d2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 432,
						"id": "emoji-1756869954251-az198j",
						"name": "AgADiQYAAn4bcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/f/4/d/f4d6a4823a17279155eae716a6a23a6e8ffa4475.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-xl79oa",
						"name": "AgADJAcAAuz2aFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/c/e/e/cee8ef50f3cb2175e55cc804f5938fdebef53a91.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-dt9if1",
						"name": "AgADSgYAAgKecFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/1/4/7/1471d1325aee5e35607d84a86ee3b89f6ffc35c4.webp",
						"width": 510
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-aikdik",
						"name": "AgADeAUAAqIycFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/6/0/6/606532cfb9332ddaadd82d83e47727bc5b56f05c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-txf1ae",
						"name": "AgADeQYAAoi4cFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/4/d/d4d2fcb53d2468fa2e6fdbd583fc3d7f5a6315f2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 511,
						"id": "emoji-1756869954251-z9fg1e",
						"name": "AgADhwQAAks-cFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/2/5/d25a99991cca57336b8c3cb3e38edd7e00cb9da7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-5ugtg9",
						"name": "AgAD5wQAAjn3aVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/4/3/e/43e72f22c10b8d5657e0bb20b8fbbec39902cefa.webp",
						"width": 456
					},
					{
						"groupId": "group-1756869887449",
						"height": 511,
						"id": "emoji-1756869954251-6sqx4r",
						"name": "AgADmAcAAv0acFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/b/1/3/b139d2ff7017f06d1570c20688a8400eaa642a98.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-s66gf2",
						"name": "AgADwAUAAnZicVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/2/4/1/24184d0f74424ac894d838e71bcbfce98c1d5fdb.webp",
						"width": 410
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-bjf4kb",
						"name": "AgADzwYAAge9cVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/f/6/e/f6e48e1add42a91001cc40bab30839f16f1224be.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-pylnyl",
						"name": "AgAD0gYAAu7ZcFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/a/1/7/a17b96e082cf061e421cac108d0a519709521b79.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-vykmfk",
						"name": "AgADEQUAAjnicFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/8/f/e/8fe4186242ea4572ab0db3a88b1c41e2b82e6f5b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-zlgra9",
						"name": "AgADQwYAAoVzaFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/b/f/1/bf129984a2173820a3efa9957502086e5be67b90.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-e7awa4",
						"name": "AgADuQkAArtWcVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/c/c/1/cc17c2e66ad20260ace4d732da0a7509c9dc3433.webp",
						"width": 456
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-u6dxv5",
						"name": "AgADGwYAAo7waFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/6/f/3/6f3e813ff10d5cdddd994399207c89fbcdab1044.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-6d9eub",
						"name": "AgADhgUAAqz5aFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/0/8/7/087d158e0a557cff12ea43f6bb643055eea35d8f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-6jzgwv",
						"name": "AgADoAgAAn09aVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/4/3/d43b5fc938e9b814d7a7b95b76cd5507a1a1e1ac.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954251-p4wpo3",
						"name": "AgADOQYAAnHmaVU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/d/1/3/d13a40a50771d9cc5470616c7b302312d2db75ee.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-ylnyi9",
						"name": "AgADTQYAAuqDaFU.webp",
						"packet": 1756869954251,
						"url": "https://linux.do/uploads/default/original/4X/7/6/2/762b5c2ff92e32358c02eee9e0504dae0efb5db8.webp",
						"width": 291
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-rz7gyr",
						"name": "AgADuQYAAm3RcVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/3/b/c3b4408ff4999ad913e570e82b14eebee03f97fc.webp",
						"width": 218
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-yrufew",
						"name": "AgADKAcAAn_IaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/d/2/6d288945d8add44a127a6e3640511c48a2b80001.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-fhl6x1",
						"name": "AgADlAQAAg71aFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/a/c/2ace29431a0aca983465401de181b90723099be0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-2m51il",
						"name": "AgADyAYAAnIgaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/e/8/0/e80de1d2055e702b23a74ee59d1c70e390acc9e8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-kaum38",
						"name": "AgADcAUAAlAwaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/e/0/fe0ac87ea9fa09390cacf29764478c48fa2c9ffc.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-33inbp",
						"name": "AgADIAUAAmCeaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/0/d/20d8be9a673a58ef98826e261af8594e2b47eb87.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-jmpm14",
						"name": "AgADowMAApLeaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/7/d/5/7d57f48df17c7a6316539eeca0604affa5eaf0c8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-j29o5p",
						"name": "AgADwAcAAvAxaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/2/4/6243bea8f4cef1ed5412344b2b858a5215a20ae5.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-1uozhm",
						"name": "AgADxgUAAkbRaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/8/8/a88feb967cc78c9d9e7391177c8a20145dcab8c3.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-2mngo9",
						"name": "AgAD0AUAAluCcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/8/9/7/897a78f064de677a5e33259f6a7a4438f97d12d4.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-1fr9ve",
						"name": "AgADLwUAAnrQcVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/7/3/0/730fe0e04d8972621841a54dccbbadc97cc042c8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-3qltyj",
						"name": "AgADNAUAAkPgcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/b/4/2/b422f3e559f05cdc23905139c21a56ebbced2f54.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-en581c",
						"name": "AgADzAYAAqSFcVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/e/d/a/eda891f0057b3fbc2694076e2f60a389d7e93421.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-6opabb",
						"name": "AgADjgUAAnEhaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/1/b/41bd312b99c149d8e2fcc0a73821690ab0245ca4.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-vi94wg",
						"name": "AgADpQUAAlhQaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/2/4/224527b2303865c687a3f0a992aa90fb21f12476.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-nhajo5",
						"name": "AgADQgQAAsGtaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/e/3/4e392d4eb18834ce925eded6b8e3c57bb80fdfed.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-wz3oyf",
						"name": "AgADrwcAAk8daVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/7/7/0/7709f9834797158d8a28b764a144a6de1d69f883.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-yppnhh",
						"name": "AgADYQUAAu8oaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/9/8/f9859b31afcfba875b4125feb94c5c3fd5f26528.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-mjozto",
						"name": "AgADYwUAAk_xaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/a/e/cae43f046146076362592d9f759800d084f61943.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-nx7vv5",
						"name": "AgAD6gcAAp_RaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/0/3/7/037839d8491258884ae078e237bd7235edacd51b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-fvaeyr",
						"name": "AgADjgcAAic1aVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/b/3/4/b34d4438b07f57d52cbf954661378e6199d873f6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-2nxxlj",
						"name": "AgADtQUAAkuqaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/5/2/652c9c7d12931ba6102ad234f1292da71654799d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-a1wdfe",
						"name": "AgADUQUAAg1qcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/f/4/cf41e76c2eef5c4d09de45e6c7548f3ffc25f0b6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-eenus8",
						"name": "AgADZgwAAkDVaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/9/6/e/96e096642ea810bec435998ef1c3035fbe1e2085.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-bggy7h",
						"name": "AgADsQQAAmt3aFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/5/e/45edf71c63c6848829c1c841ddc1448c31ce1238.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-dmbuzw",
						"name": "AgADSwQAAtVkaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/e/b/5/eb5adfabfce7f06dc0c624bc7190fb366f7fd9b9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-ozrgb3",
						"name": "AgADVAYAAn2laFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/9/d/59d0f683aca3d4326d4d0ac1ef732b6ff6b1eb45.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-i6w44x",
						"name": "AgAD4AcAAnS7cVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/b/a/4/ba43240ea255926c458faf029de8b3eb3f44e1f2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 493,
						"id": "emoji-1756869954252-y1j5qw",
						"name": "AgAD7wUAAp69cVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/c/2/4c2ed982c1c8be3d7142ae544c200e7f9c4dd9f9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 500,
						"id": "emoji-1756869954252-0xmp1t",
						"name": "AgADpQoAAqYlcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/0/d/50dfdabb6a9af6958ce4a865ef16e8c4eb3e36a7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-e3vkw3",
						"name": "AgAD1AQAAgN9aFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/e/0/ae0efe3018dcbd9c2258e26d29db2b518a3c1ac3.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-jnvj3r",
						"name": "AgADCwYAApDGaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/4/4/344b3bc82271b9b85411863076bf3f1c49f0549e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-cz2924",
						"name": "AgADngUAAg94aVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/e/6/0/e605f701219c6837eff95409996b47cdc68c43b2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-c6obq4",
						"name": "AgADrQUAAn_8cVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/1/e/5/1e58f34ef98affeb54564fe41f3869d941545dbd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-ccamif",
						"name": "AgADsgYAAnr0aFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/8/d/6/8d65e5688a195f7d9e1636347f00119372ce6d8e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-nqwikh",
						"name": "AgADvwYAAop2cFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/9/d/b/9dbf30d47c18e34956a38b316c6568e1bbfe644d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-1lf6ix",
						"name": "AgADHAQAAhdycFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/8/4/284fe26699e6d2d45964134043addb03d6894003.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-9qh9vx",
						"name": "AgADLwUAAhZSaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/0/e/9/0e9bebefd2dbc26e2882136fc32379fd060b4aa8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-el8tlj",
						"name": "AgADQQQAAl6maVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/4/3/c4396c01050160c82573f30f235c5857a74c998e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-afu18z",
						"name": "AgADtAUAAhWeaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/c/d/acdf52506560ecd869642035365330e66388c669.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-3p8mei",
						"name": "AgADVAUAAg2LcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/a/4/ca4bdea5f1b5e5adb121bb0eca0f04dec289bf1e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-zv5jk9",
						"name": "AgADxwQAAlCpaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/1/6/f/16f91c761747a50f26084bf76a072e73dceaaf07.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-21exjf",
						"name": "AgADdgUAAv2RcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/5/b/65bed47103b2220a7172bf6f8067bf03ee724c5d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-tn3z1w",
						"name": "AgADywQAAkuGcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/b/3/5b3f171930c7a22e9007bd11014df1e19af8e4aa.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-qq8s0k",
						"name": "AgAD_gMAAmKCcVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/9/1/491b3674052586f895170c0de0c4b732aaa141d9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-bzx9lm",
						"name": "AgAD2AUAAhKOaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/0/8/3/0834e031660942e3c49c661a734805a6ac4a94c9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-uvuonx",
						"name": "AgADqAYAAhSpaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/2/d/32dc4b2be907bf9c786ed38e5c7cdc791c283f2d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-z66ppm",
						"name": "AgADQwcAAjEsmVQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/9/2/292fb1de338c37716ff69e7d9915d0dfce1b7e6d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-52csyi",
						"name": "AgADawgAAuFHoVQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/8/b/2/8b243da7b1539077118c0e7ae5e49bc5b582b859.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-nem2yr",
						"name": "AgADSwQAAtVkaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/e/b/5/eb5adfabfce7f06dc0c624bc7190fb366f7fd9b9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-rv7cv5",
						"name": "AgAD3wYAAumQoVQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/a/4/4a4f408ec8ff9bb6f05afa90d546cba1c9afe6b8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-tm4u4z",
						"name": "AgAD6gYAAtg5oFQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/1/c/4/1c46d978b8d7f0ea2ea4ea4afd73b1383c2f737b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-42h4ba",
						"name": "AgADIAoAAo5-mVQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/2/a/32a553e260a3bf983b8b12974029baf7983b2c5b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-wot5em",
						"name": "AgADRBEAAuKxoVQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/e/3/2/e32361011b1ceca49694fb078ca8a1baacd4daa5.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-mdmhw0",
						"name": "AgADxwYAAugtmFQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/0/3/8/038a7eb8d504cd880ad06ae72251de190568034b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-cmxnml",
						"name": "AgAD4wYAAumXKFY.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/c/a/5cac60b0ceea3b6d72f79f1450802b1cf64079e3.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-6sp9ha",
						"name": "AgADFgYAAgWbIFY.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/7/b/37b477f51bcb8d741a8ac46fd9c4677afb33415c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-kgrj56",
						"name": "AgADVQcAArEGKFY.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/3/1/63151ad4c7a71cef99a3cd634f95abcafb294cf6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-4dbqx0",
						"name": "AgADbgQAAkX40Vc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/d/5/8/d586c8693cbc7977de980ac2917be93e19708da3.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-ktxzfo",
						"name": "AgADEgQAAk8YyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/8/2/582446213e8bc83dfebe51a12a0cc1fb7d2e5a71.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-xc6pmj",
						"name": "AgADnAQAAuDMyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/c/a/4ca6abe7772e6cd3da01e84145d6d99186429c02.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-fq7d96",
						"name": "AgAD9wQAAoCvyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/e/5/8/e58821de091b2b0f4e4e85633920265d955362e6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-y48qg0",
						"name": "AgADBQUAAuluyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/8/a/28af75703ea2217f218e543742ac884acc1b3dd7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-s469e6",
						"name": "AgADTwcAAsJwyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/1/c/41c57d6690fe6edb41fc2de511ee0b9571b038ee.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-4g3dna",
						"name": "AgADvQQAAq-7yFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/5/0/5501b9e829f83525a0a1f48c3b30af70d1865e4d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-oqvpbh",
						"name": "AgADwgMAAtEmyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/d/6/5d62e2d138213ef83248c2250d497ac87ee06307.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-l40tkr",
						"name": "AgAD6wUAAmHfyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/9/e/6/9e6e0fcf8291bea78882343510b570ce59016d67.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-3apcjs",
						"name": "AgADUgUAAg6pyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/1/7/2/172cdcb36b9dd641abd7a08a4a67caee741683d6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-yu1lrk",
						"name": "AgADUwYAAuA8yFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/a/6/4a678cb1a278421ecdf744f3164d717c392a90de.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-6aozq3",
						"name": "AgADWQQAAkKM0Fc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/a/2/5a2a86e0f3ed41bfea0b263af382aee892762930.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-uq5730",
						"name": "AgADyAUAAh4ayFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/b/2/9/b299e53c9327e7628e3ce1063466bcd9f2cc7b3a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-4nldce",
						"name": "AgADbwUAAgaFyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/d/d/0/dd0871611805ffbe0f1083bedb69c174b30bc206.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-gwwvd8",
						"name": "AgADCQgAAjOA0Fc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/9/4/d/94d3f602fbc23dc93d8b40ca0267565a3c8ee6a0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-3i7dj1",
						"name": "AgADIQUAAoCryVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/a/5/aa5b8102f410938bbbb90264d451940aae9d2e68.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-6mezyn",
						"name": "AgADQQQAAgneyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/3/3/c33f700fc49c35541de96feea967d7657a7e07d8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-5agalr",
						"name": "AgADSQUAAm7M0Vc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/5/a/a5a736e65a09c551091511b08c3dbd23bbd35e90.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-5b325g",
						"name": "AgAD-gUAAj4X0Fc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/d/a/3da264e4bdecd153ddc8f58630995ce93df0a246.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-8uj5gf",
						"name": "AgADIQUAAryMyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/8/e/28eebfc9045a6d7d0628274ddb251470e87f08e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-7vhz8f",
						"name": "AgADLQUAAthf0Vc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/a/0/fa0d6ddfcbb551fbec4f7aecee232ab4ffb8d30a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-bl0yng",
						"name": "AgADNgUAAsT1yFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/b/a/cba6abc6310273269a4f96f44d3b43138e4bf551.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-o1qxg7",
						"name": "AgADEQUAAqeGyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/b/c/3bc73584b6b42965fc263f5ecc8a209f68f53dbf.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-2fcege",
						"name": "AgADMwUAAhNTyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/0/2/c029aa0ea932d7b81b5770c7cc5f67ad908858ca.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-sgvxsl",
						"name": "AgAEBgACcfHIVw.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/0/d/f0da902e33a81b56477a5db49a4d80bd01c06e7e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-c4pzvo",
						"name": "AgADBQUAArEZyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/8/c/8/8c8da9ed7b79dbd35d75febb5518ca12737c03b6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-2t2pnn",
						"name": "AgADiAQAAmO7yFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/d/8/e/d8eeb402edc0953e50717333eabc4401d80b8968.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-6i0vkb",
						"name": "AgAD-QQAAlHxyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/b/2/6b2672cf6f44695c507a910ef3e6598ef60d212a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-i6tl4a",
						"name": "AgADpgUAAhtp0Fc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/0/d/8/0d8ef7949bd92c1fa6112755e2ba1811be5580a0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-17x5bx",
						"name": "AgADQQQAAlVO0Fc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/8/e/48efb2a757725be6acf2781375727953e1886969.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-3uhcjc",
						"name": "AgADSQQAAvn10Fc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/7/d/6/7d644684e5e06226ea07df73572bb9d8f575fe50.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-mq80k4",
						"name": "AgADUQQAAvg2yFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/d/0/9/d09ff9667f41ef6ae3d5b2c3eddbdbb979d5be0c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-1ikmb3",
						"name": "AgAD_AQAApuYyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/1/f/f/1ff5fa0de23c4a3cc7d553e5edde40da396c1c80.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-f37okw",
						"name": "AgAD9gMAAtaGyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/d/1/a/d1a1941e099de5e095fb53fa0bb27b7428d2c5eb.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-74xemg",
						"name": "AgADcQQAAlhMyFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/0/3/5/03554cb63960fe815bf38864d8127536168e9917.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-jaycli",
						"name": "AgADpwQAAnRryVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/0/1/f01ee07799f036c7010fd141e54fa1860e00cb59.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-l44gbv",
						"name": "AgADugQAAr8ayFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/7/d/8/7d8a3359896509d3b8bbdded54db88fcef31f86f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-9w30kf",
						"name": "AgAD6wQAAqLryFc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/9/f/f9fa470c14f76c955965011b55622d7ad9f4403d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 491,
						"id": "emoji-1756869954252-4s4ds8",
						"name": "AgADLAUAAg6ecFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/c/5/2c51aa92a12170d6160e2362d2fc2a51236c92da.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-823rj0",
						"name": "AgADjgUAAih2cVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/b/5/6b55da57b1a717b968d76c991445f27ce1ef7412.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 491,
						"id": "emoji-1756869954252-jsl14c",
						"name": "AgADMQUAAiS2cVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/c/7/ac70c8adf694589467ab27bfb7aad4add01382f0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 417,
						"id": "emoji-1756869954252-6ta41e",
						"name": "AgADygUAAhUicVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/7/0/e/70ede120e7044879bfff6b2b0b47a64e061e4346.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-2vaj48",
						"name": "AgADKwcAApgvcVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/c/1/cc1f492d83e021fdfda11da96dc72a94369bd7fc.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-m2l9f4",
						"name": "AgADQQYAAjgncFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/d/5/e/d5e839c872320a6f2388e5690b2c30a96990758e.webp",
						"width": 339
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-24p3ez",
						"name": "AgAD_AUAAu_MaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/8/2/2/822d5a9a9e53997cc52faa4ffc0ebf386403ed4b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 474,
						"id": "emoji-1756869954252-h3im3n",
						"name": "AgADjwUAAsXYaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/8/8/7/887a2f8ae84f78f2c8af249397eca39bcc71d9fd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-rvb1hz",
						"name": "AgADWAYAAgKIaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/d/e/adebf26298554d18ae858573af119ba70bfcb836.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-8xakyc",
						"name": "AgADSwUAAoCvaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/c/0/2/c020020c6d54c0f87d4c6573c05a619d71bd12fe.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 341,
						"id": "emoji-1756869954252-lw6z2j",
						"name": "AgADUwUAAmBXcVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/f/9/ff95c626e6c7cb62b58de1f2983d3df46a860a68.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-d354vl",
						"name": "AgADfwcAAg9ccFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/f/7/ff766152d3b2ee3bf2020e5aa0b4b21f18fb77e7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-4cjr00",
						"name": "AgADPgYAAo-9aVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/9/4/c/94cc2a55a062d9cc91bcdf8bbfd0461b29aacb37.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-auvgk9",
						"name": "AgADbAUAAipBaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/c/b/2cbeb643c9a7641ad94762b9d5be316a671714dc.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-0r0pd2",
						"name": "AgADyAUAAptTcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/2/4/3/24386cef8710e118ab23c54a7a2d90bafa41d93e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-j6pgdj",
						"name": "AgADTAYAAgHAcFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/2/6/426be0e8b67b597f020895eec83635bf6a48a65d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-gxpgf1",
						"name": "AgADoQYAAhdnaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/1/7/317bfbf74849381093ea6106e3f1e54dc9fd3287.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-co9toh",
						"name": "AgADUQcAAnmyaVU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/b/3/6b323308f501aea520472293633b801ecda3f471.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-ikhsvx",
						"name": "AgADXgUAAoTsaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/f/0/5/f05fd16c513d01af44658cdbb732aa5bf221bd46.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-lutjkl",
						"name": "AgAD3QUAAkEHaFU.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/9/2/d/92dbf032c3545189be7de8cee44ff1f1a764d592.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-28kre6",
						"name": "AgADVQUAAsqmoFQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/4/5/c/45c72644cb90d2b5ae18522d47c6988b98a27cb9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-kvfkl9",
						"name": "AgAD7AUAAr3IoFQ.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/8/f/68fe96f055c4450202c6e229358c8329b38ceeeb.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-5fdbxc",
						"name": "AgADIwYAAvAGKFY.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/1/3/3/13365ab634fc4dd8b7ada6cc55a0d1032607118f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-7g8jle",
						"name": "AgADmgkAAvcxIFY.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/3/c/c/3cc41ae54b53d27491c47627aac7ce4069967ec4.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-jslkr0",
						"name": "AgADhwMAAtUZyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/6/0/9/60901948038aabbc2166f22fbca5a5978db08343.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-tuydkr",
						"name": "AgAD6QMAAsZd0Fc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/a/d/2/ad2c25e1205f1559d09511c68f5ab2c5ec3790fc.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-y2np6a",
						"name": "AgADEQYAAtqMyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/d/a/5/da530b73877048c29716c658c2a5b45e28de8cac.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-e6gz0t",
						"name": "AgAD6AQAAkkPyVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/e/4/5e42b39852b70d533ace1a47781b3d3c692404e6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954252-k8v2mb",
						"name": "AgAD0QUAAkIByVc.webp",
						"packet": 1756869954252,
						"url": "https://linux.do/uploads/default/original/4X/5/9/6/5961fe71710628ccfdc4e7138b4ce0f89f73104e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954253-8esnkg",
						"name": "AgADRwUAAsPNyFc.webp",
						"packet": 1756869954253,
						"url": "https://linux.do/uploads/default/original/4X/e/7/8/e7826f1a221916adb5de34bbe2cc9b833e070845.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954253-owo8ao",
						"name": "AgADrAMAAp4myVc.webp",
						"packet": 1756869954253,
						"url": "https://linux.do/uploads/default/original/4X/9/a/c/9acb6de2f9d5b19dedba6445a31a732a9615a14e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954253-iw1z9k",
						"name": "AgADeQUAAqUHaFU.webp",
						"packet": 1756869954253,
						"url": "https://linux.do/uploads/default/original/4X/e/d/7/ed7ce6a045dbf893eeebf27ee5341aafa5b25306.webp",
						"width": 425
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954253-z2dlm4",
						"name": "AgADOwYAAleUcVU.webp",
						"packet": 1756869954253,
						"url": "https://linux.do/uploads/default/original/4X/3/3/d/33d9e727ac69678a2f6c566f52c575e709b4fc96.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954253-849h2b",
						"name": "AgADuAUAA9poVQ.webp",
						"packet": 1756869954253,
						"url": "https://linux.do/uploads/default/original/4X/1/8/5/18586e1854fad04b7dfefb43f48f6e68a04c4e4d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954253-xjp65x",
						"name": "AgADbQUAAhmKoFQ.webp",
						"packet": 1756869954253,
						"url": "https://linux.do/uploads/default/original/4X/b/4/6/b465e32f8155b03478e72e763346138d9ab98a49.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869887449",
						"height": 512,
						"id": "emoji-1756869954253-ow1tgo",
						"name": "AgAD5gUAAtHOKFY.webp",
						"packet": 1756869954253,
						"url": "https://linux.do/uploads/default/original/4X/f/a/1/fa128f5755072a57456742f5a0e112c73719938a.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1756869887449",
				"name": "小C",
				"order": 14
			},
			{
				"emojis": [
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-djebw4",
						"name": "AgAEGgACQxmAVA.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/4/0/5/405d8e2a4849c28afed8fc363348c3e9b3a24f33.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-a4ncc3",
						"name": "AgAD8RgAAsZAiVQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/2/d/f/2dfe076c276eeb7259c60fe0beae198f6a3b0a3c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-eyc5ye",
						"name": "AgAD9RUAApCjgFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/c/7/1/c71dc6bbb02b084fda77fa22e60c6050dd347c3b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-hxewhq",
						"name": "AgADAhgAAtP-iVQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/d/b/1/db15462381f152e86ad45072ef189a8617ecfd0f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-j4py1m",
						"name": "AgADph8AAiEciFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/4/c/8/4c8c573ce5c09dca3710c502500f6ffc80354616.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-ktxjh2",
						"name": "AgADXxgAAizmgVQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/9/d/2/9d2bd93c8b76b17c48ca461584e519e8f1aa2084.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-gv8ppg",
						"name": "AgADERgAAiQcgFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/1/c/0/1c0564b04bab5502a484d493ef3ffe6dc667818e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-6gtmvv",
						"name": "AgAD3RcAAn0MiFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/c/4/4/c44e4b9c6a2df7b67cf3ce7288e31b6de3f43217.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-7yd0gj",
						"name": "AgAD9RgAAkeggVQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/3/4/d/34d41665dd644b4e24a2a637f75168f7608b8401.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-i5brwh",
						"name": "AgADPRoAAsdQiVQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/7/f/8/7f8c4b7c697883dd0994ac73230bfb49e215d35c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-djok89",
						"name": "AgADlxkAAtEngVQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/0/1/0/01080e91352c85e2ed75ffe708453b368bd27d70.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-83sihn",
						"name": "AgADNhoAAsBDiFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/d/3/3/d33d8d7ac26f90340d698d1a7113277a96f9e997.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-npnvt9",
						"name": "AgADQRgAAjxqiVQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/d/8/a/d8a43cb457ac9de8edb63302484f41d7fa98c552.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-7mqm4i",
						"name": "AgADqBcAAnpziFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/1/d/3/1d3fb9ba9ca3d685eaf2ba141424d975e5133f9d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-frd9iw",
						"name": "AgADsBoAAjnkiFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/c/e/e/cee67dd055a990b4643472f0779b24b6439cdd29.webp",
						"width": 512
					},
					{
						"groupId": "group-1756869988533",
						"height": 512,
						"id": "emoji-1756869993634-vbep30",
						"name": "AgADuhsAAgwjgFQ.webp",
						"packet": 1756869993634,
						"url": "https://linux.do/uploads/default/original/4X/0/5/9/0590ca45399fbb13252b9914e3ecd0d18ad19232.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1756869988533",
				"name": "科研喵",
				"order": 15
			},
			{
				"emojis": [
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-vosz0b",
						"name": "AgAD1xkAAhk76Vc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/e/b/2/eb2c2a4c2102264f69f4b794f26179aa7d0feb16.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-01q7z5",
						"name": "AgADaxsAAv036Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/b/a/b/bab7f3501bbc5c3f2323f1376f30f960c598340d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-tl0tew",
						"name": "AgADdRcAAuNF6Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/f/b/4/fb46bcfcc0aa2a3fd934ef1f78c3c44409b37261.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-159l39",
						"name": "AgADiBYAAvi96Vc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/5/1/a/51a6fa209b69cf9fc5c7101d27f5ca94f0b438c5.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-l1txt1",
						"name": "AgADURUAAjmF6Vc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/7/c/f/7cfa757db9aebdeaff18c6fee2654a48d17139e1.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-wb7edu",
						"name": "AgADNhYAAoI46Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/c/3/2/c3282a59f50376f86f7abc85ac79d98f5c72348b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-pa1n6x",
						"name": "AgADqxcAAmkR6Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/f/c/7/fc73479e82bb3f42cb59bf88b0e27da216071c5b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-kw1y1t",
						"name": "AgAD2BoAAummsFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/6/a/8/6a8f7b45c0b71fcd9dfa669b8d07fa86f4c8e317.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-9gi8lt",
						"name": "AgAD5xYAAg6R4Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/a/5/c/a5c7aaaf4151f2e8db40ff8f05d290908e41a552.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-rw01l9",
						"name": "AgADIBMAAhWzsFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/0/4/b/04b6852269849a562799f746e361fc3a80145440.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-v0kmzv",
						"name": "AgADQhYAAmek6Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/5/a/5/5a5a2c64d63aedd1801327032252e53055004265.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-mwljvs",
						"name": "AgADFhMAAuvfsFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/0/f/d/0fd245d8bf27831add100bba27b9ca368b6a14b8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-3hk97v",
						"name": "AgADJBIAAu2guFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/9/a/a/9aaf3afb8d5f9dbb5941e72f63ff81053ff5e39a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-55y2xe",
						"name": "AgADNxMAAvZjuFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/c/0/0/c00084c0c0103b11f52366efa3f3767d22579219.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-qsi3xz",
						"name": "AgADxxcAAlFcuFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/5/0/4/504543848ed97c9c3091d79efad5ecbc0f5f8223.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-xaw5y6",
						"name": "AgADyRUAAm1WuFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/f/4/c/f4c7b1f856bc786da85834b43adc55c0ca34ec2d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-w360ol",
						"name": "AgAD7RUAAh69uFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/d/b/a/dbabf130e36efb61330270c071b31f9c2f66efd9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-8yyrqb",
						"name": "AgADhxQAAicMuVY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/7/4/7/7479c2261d57be289d47c1318fc40ff3cf67ab43.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-1hvtq6",
						"name": "AgADjxgAAsWYsVY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/3/9/e/39e674d246073c1979762a8f1a57d0c6c6a726b6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-3bo5yc",
						"name": "AgADZBUAAvJeuVY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/d/6/0/d60fdf7f226579d8cb621c642075c4941abe1269.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-tqhuxo",
						"name": "AgADERMAAm1usVY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/b/9/7/b972c5653b2e5e664876d6d0bd63a3e15a86e6aa.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-540bpg",
						"name": "AgADOhQAAqJVuVY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/9/0/d/90d28d24a01351a6360ceeffb26a55a10d684a87.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-tcdifl",
						"name": "AgADuBMAAtWQuVY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/e/d/b/edb58eada5bc00eb9551e5ddaee740fda27f04fd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-5mv63v",
						"name": "AgADWRMAAtbLsFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/7/a/d/7adf83c0fdb0b21e8c3caa644ec77f88643e4011.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-b5rrf9",
						"name": "AgADyhMAAg-auFY.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/4/2/e/42ec57b95d79462e82ea521a667ae2e1814c9c0a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-0j47tm",
						"name": "AgADcRgAAu406Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/a/3/2/a32472532f66cab0596211aec15ad269e2add134.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-cgvlyb",
						"name": "AgADDBgAAjIp6Vc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/e/5/4/e54cdd1f206088a3460c61b8607c05d0795cf617.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-re6yo0",
						"name": "AgADRxkAAmol6Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/b/b/8/bb8ff73cb1d336ff0cf238a41b15f6fdc30585fa.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-znlj5i",
						"name": "AgADzBcAAjdf6Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/b/7/4/b740e3288e1f39b8f7a2ca3655ffa8461cf0bde6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-z3eq46",
						"name": "AgAD0BYAAkZs6Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/c/8/8/c88e28083525bd0271ccebe50aa476eefdaa44c5.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-jb5wun",
						"name": "AgADeBUAAiU76Vc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/3/3/8/338431ec3e6a12fc4c4caf1971113821b2d08eee.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870014160",
						"height": 512,
						"id": "emoji-1756870020138-gn1bfm",
						"name": "AgAD1BQAAn_b6Fc.webp",
						"packet": 1756870020138,
						"url": "https://linux.do/uploads/default/original/4X/1/3/4/1346de0c6ab26b39f56faa68f2396065fde5a810.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1756870014160",
				"name": "群友",
				"order": 16
			},
			{
				"emojis": [
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044287-k62h03",
						"name": "AgAD_BcAAoa2YVc.webp",
						"packet": 1756870044287,
						"url": "https://linux.do/uploads/default/original/4X/0/4/7/0475747203ff2ba717777060b9e4668a7d6301cf.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 386,
						"id": "emoji-1756870044288-z4ydtk",
						"name": "AgADgxYAAlxAaVc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/2/2/7/227a68db937ba7e0fb7d21334c12bf9790f720da.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-3gbqf0",
						"name": "AgADIRYAAgEgOFQ.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/d/5/e/d5ea3b48285902457aa03948b0692cb9fa7e45c3.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-a5khp1",
						"name": "AgADjhcAAiBYOFQ.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/9/6/6/966615f73c28f39828580b82c095acc6fb121568.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 386,
						"id": "emoji-1756870044288-idho30",
						"name": "AgADXBsAAidEYVc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/7/4/8/748519c1dbcdbe973aac5d45969e4bbb08fcbda2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-kjyivz",
						"name": "AgADaBYAAugVaFc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/8/0/1/8019fbc1176acb3178e49c264230f6bf81d95c70.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-zijrh4",
						"name": "AgADHhYAAqtpaFc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/3/0/e3073d6961db073b5ed56a8a774ff1fa4e3a0c45.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-ib7d5v",
						"name": "AgADJRkAAsKHYFc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/4/f/54fa0587e6c37f3c702e58aad29a64360753eb33.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-ifd4uv",
						"name": "AgADkRcAAiagaVc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/3/9/c/39c867384fbd5e2797bf5fa4293dd204a5e6f83e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-63ew5m",
						"name": "AgADLhsAAhk4aVc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/1/8/518078f32bb0811eea9579bdccec6e72723557fa.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-qp1v0h",
						"name": "AgADVRUAAoanaFc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/d/9/3/d93b41e5543c179d55e01f4c3e4b6f673a1ae08a.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-akhfxr",
						"name": "AgADBxUAAsONaFc.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/8/d/0/8d08fbb291d9f9ca7da41b154fb1d16033f7d114.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-dniysp",
						"name": "AgADFRMAAns8wFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/d/0/e/d0e9f200a5629485e62a7f6b22ef81e67ccc3b80.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-j1tnf8",
						"name": "AgADGRMAAtEkuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/d/6/0/d605320b76a1aa06631319a2ded1510064907d18.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-5b4fx8",
						"name": "AgADQxoAAvTzuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/7/d/8/7d8347acef691e57d8ddaf609de2a12357785f17.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-7ynnqh",
						"name": "AgAD3xUAAupiuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/a/9/5a9f396fd83df1be9f1a15cf2bc904dfb61616b4.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-3yigik",
						"name": "AgADBhoAAuSVuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/8/0/7/807086be1388bf3960aa85a0b077aa4d95540b88.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-935kw1",
						"name": "AgADdRcAAhp1uVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/8/1/c/81c7587f6583de69b587369c7331996f61a70bab.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-nwb4j2",
						"name": "AgADKRUAAsn1uVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/f/d/0/fd0dabf0406f87ce7f20024488d4edeee3cfe13a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-wiv7p8",
						"name": "AgADpxUAAhZnuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/d/0/f/d0f16f0c138445a7a399e62e6bc98d56c9d7b5e7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-ndudq8",
						"name": "AgADXRkAAoMhwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/d/4/ed4e299a36b15b061341717b1f4a7d665a4a864a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-cvitrj",
						"name": "AgAD0hcAAq3luVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/7/8/3/7835e4e50464d7ba3eaf0c4c1434476830433293.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-acykph",
						"name": "AgADgBwAAnu2uVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/a/0/6/a06c393714c6581149e72294bee6854ed19fe2ce.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-4jq5yo",
						"name": "AgADLBkAAjLZwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/6/4/3/643a9a85696d3dae8b6b6d51bf0835a6cb88285a.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-v0ftvf",
						"name": "AgAD4BkAAgYJuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/7/3/e7362c641308ab742dffa97764aefc34bb287d6b.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-vuvqni",
						"name": "AgADahcAAtHYwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/6/d/a/6daa420c213cfa80ce77bc1590421d372ff492dc.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-hk8x86",
						"name": "AgADDhsAAsLIuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/6/7/4/67471416e212568769283e97ab5db3451921d8b6.webp",
						"width": 351
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-xw188t",
						"name": "AgADixcAAq48wFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/a/2/7/a274500174db564b98e29a70dc4958abd3368a81.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-5d7vyt",
						"name": "AgADKhYAAsaOuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/a/d/e/adeec252617f25d6034d30afec0e7fc6d309fb03.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-71lko6",
						"name": "AgADXRUAAiBywVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/c/8/b/c8b6c2747181ac4f56b7d0f6a508fb52854a1955.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-3mcv5o",
						"name": "AgADZxUAAhQUuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/b/a/7/ba7e75d7f36494229e498c26b2a991241ead2f2f.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-jrf7fq",
						"name": "AgAD6xUAAuZWuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/c/2/ec2f97fbf4e3031a2f1f42a40e0e3899bf9eb9d7.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-zrm5ml",
						"name": "AgADQBUAAkZOuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/3/d/a/3dac32a48a8137bef776b619d22c2dd6b3550118.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-2ld5r0",
						"name": "AgADvhsAAhT1wVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/b/1/4/b140c79c3cae688ce658bda519a147a2a7dce525.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-aizi3s",
						"name": "AgADyxkAAuPouFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/c/a/7/ca799d3fde7b35c2af79af1d357cc65f8f78525b.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-labox5",
						"name": "AgADkhoAAiNLuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/f/e/5/fe56cd3b4d42d6d5184930d1a5499f1c3d010faa.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-g3fvq1",
						"name": "AgADtxcAAkeWuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/6/b/3/6b3275c4db1d2ebfa82de0f1e31f3c067655d844.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-ln435e",
						"name": "AgADURgAAuCquFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/f/f/d/ffd5edd0171dc85e9546ca92512b5996d9a7975c.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-81ol7a",
						"name": "AgADwBQAAnvQuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/5/6/556880ecc688d57ea29d70bbaaaadd0a1af2c33c.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-pt0tzx",
						"name": "AgADbBgAAnSluFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/5/6/e56927e30a89ad2e244b76db0937adf1aaf99572.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-xc42im",
						"name": "AgADbBkAApgduVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/0/4/504edaac251e1b6864c8820943fbb55a316765a9.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-n581jm",
						"name": "AgADnhUAAiVruFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/b/4/1b43bf9402b0773267fca43ee43d981a1f73d6d0.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-wqyng6",
						"name": "AgADXBkAArDfwVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/f/d/5fd7ce86a53c150fa1283643a7051f67e0017e1e.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-4fggy5",
						"name": "AgAD-xcAAlvcuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/7/f/e7f0ebeca2bc705721b2bf0b423ea6d66bcc4a39.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-rrlue5",
						"name": "AgAD2RYAAs7guVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/f/8/9/f893197b04fdf036cb11fd52d5345c1ae88b7cb5.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-ob3s24",
						"name": "AgAD9BUAAkvjwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/b/2/3/b2375008825703d3b133d8170bc47c86123972ad.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-lzd9cv",
						"name": "AgADXhYAAtJNwVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/c/f/5cf192338b773fde95f57ff28bff888351f1692d.webp",
						"width": 386
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-epa64w",
						"name": "AgADxxYAAqqzuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/d/f/edf91498db296c3d1a0a520faae2ee0864ddf723.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-wciwu1",
						"name": "AgAD3RQAAqRpwVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/b/a/5ba4d5b08d2e313c40f62fa5d8921e4865034ece.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-iz3dpc",
						"name": "AgADGxcAAmHIuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/0/f/50f9ad660a1136fcf2b64cb1cfae79b8c62d0031.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-4if62e",
						"name": "AgADjhcAApMnuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/1/3/513782fc1a4484dc282c499f867e4aa40e708400.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-ogvesz",
						"name": "AgADjxcAAr8quFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/7/1/e7195f2a1fdff3dabc6fd986dff51ee9a4900b2d.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-4b5rim",
						"name": "AgADWxcAAquNuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/a/1/9/a1979830f3f1c2274d9884d28575c25db6efa8d1.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-ve5kn5",
						"name": "AgAD7hgAAj9yuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/0/0/8/008c8cc5d77307f3211416fa5d33f233f803866b.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-xbrnkn",
						"name": "AgAD8xYAAismuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/8/c/18cc78072faf327e21e15b53d6c14827447ddd74.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-hvti5d",
						"name": "AgAD9hYAAqLVuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/9/4/1/9414f97666e3632e12c21b9e934405377c76a590.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-7slsap",
						"name": "AgADkBkAArGkwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/9/9/d/99d74a7b2e1c866da79a078d9fb6577e7b21903f.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-8j021l",
						"name": "AgADRxgAAnxwwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/4/7/2/472e978ffda841134e851796cfee2ed6668c57c4.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-5br6qa",
						"name": "AgADTRUAAvcuuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/3/b/53b989eed30c49ba1176b9b2192b7b6446b1c927.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-re4v8e",
						"name": "AgADZRUAAtvKuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/f/9/9/f99406a090a11123dd7047a7c7886aea0a485c4b.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-crrnsz",
						"name": "AgAD_BUAAieJuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/b/1/1b1ba506b120b57846630ac0869fe3a9d9c53352.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-2ij71j",
						"name": "AgADcBcAAhhWuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/7/6/9/769d4217a33d49ea0c510a631c8479b180ed53cc.webp",
						"width": 386
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-asp86i",
						"name": "AgADfhYAAqUwuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/0/d/2/0d2eeb5c62223fa7a500ad50068d9074bd3091e1.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-pmm6li",
						"name": "AgADihUAAttswVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/a/2/7/a274a8288984334bd13567d33bd134483d3d1328.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-9wqee7",
						"name": "AgADbxUAAv-CwVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/4/b/7/4b79d5c743c42474cdf373ff853407b30a5ca6a4.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-8t6068",
						"name": "AgADJxYAAhnLuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/e/1/1e18912ad69477479cebb919f8916079afb31a4c.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-ed06qt",
						"name": "AgADoxYAArpauVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/2/3/8/2388a01ed9bf56a4a30e7ab24342f1842d61b33d.webp",
						"width": 386
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-7k8n85",
						"name": "AgADZxUAAly2wFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/f/2/1f2c243eb83e724bad16749ae84e85dacb4d6c1b.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-1a0y5d",
						"name": "AgADdxcAAupeuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/a/b/b/abb26596249db66582b7ff3afe6b35a13cba47de.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-j7luok",
						"name": "AgADuhUAAo2nwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/8/7/5/875ae11c925480e1b9f67e9c8d480fed2ca581e2.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-w1nf78",
						"name": "AgADHRYAAoGswVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/b/c/e/bce15726399bbddd1f988ae9fe94047e84395aa1.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-e6b052",
						"name": "AgADkhUAAi2RwVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/7/d/7/7d704723996eb8110648f00dc1aee44040d433ed.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-7top33",
						"name": "AgADRh4AAnX7uFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/8/f/58f17e97425511a2fa8b81009c8f6cc35053a218.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-iag0mq",
						"name": "AgADFBoAAkOxuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/c/d/e/cde78d271bde0619aaad9356505a5f78ff64ac27.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-yfqtmd",
						"name": "AgADHBcAApNZuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/b/9/eb99056c30144da4197a5ebbb0ca9c2dd095bafa.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-uqz00z",
						"name": "AgADPBoAArXVuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/2/7/0/2703b76898f42851f3c805e5e2838ff70e62eb96.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-jm17yi",
						"name": "AgAD5xsAArx4uVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/4/a/f/4afb5945451c01c412dbfa0c196454206a2d7ff2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-x4i1np",
						"name": "AgADQh8AAl0QuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/5/4/154cc3c6c58484a33f6314f5fe528a43892cb1eb.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-tyj1gi",
						"name": "AgADURQAAi21wVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/3/c/13cc4a13f9ca0a7b030719d43aa6adfbda459646.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-shzdhy",
						"name": "AgAD5hYAAtg7uVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/2/7/e2722c0a72d055e8b74e210c65868cb240599ae5.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-wt9jhc",
						"name": "AgADKRUAAti0wFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/6/1/3/613f1339c3a672a3e241a81f3bdaab9edafb7546.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-qepy0i",
						"name": "AgADsxYAAvTRwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/7/9/8/79871df2dbc93c81a11eeb9c1793d20cad7a27c2.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-76livj",
						"name": "AgADRhsAApi7uVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/4/4/8/4484cea47f43e80061fad36c38295e7cb4a237ff.webp",
						"width": 340
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-jjulu9",
						"name": "AgADshUAAqY0wVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/e/c/f/ecf73ae0104c4445e2c1925a023fd62d357aa78b.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-44kiap",
						"name": "AgADCRsAAoNBuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/1/a/5/1a5d1b5ea318ce899e7014856d76f5f68108f9a7.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 512,
						"id": "emoji-1756870044288-axn96a",
						"name": "AgADeBkAAgqTwFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/7/2/2/722bc0a8691cd0b5adc2d9843b414c0b173b954b.webp",
						"width": 341
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-wrghla",
						"name": "AgADIxYAAhMMuVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/0/1/a/01a52aa83d0c8153b6298f6246dcd02341586229.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-wtz6l7",
						"name": "AgADlRYAArdauVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/8/6/b/86bfa4cc005bc2d05da139fbfd798ad566b68dce.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-m6qm28",
						"name": "AgADDhkAAi0ZuFY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/5/7/1/57143be0ba7a80dd0566526dfe24efdb957a5e91.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870039233",
						"height": 341,
						"id": "emoji-1756870044288-rv8be2",
						"name": "AgADYxYAAnquwVY.webp",
						"packet": 1756870044288,
						"url": "https://linux.do/uploads/default/original/4X/b/7/9/b79027e540ffc9bd6d2f434cf2c1815ff85f1e8c.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1756870039233",
				"name": "爱丽丝",
				"order": 17
			},
			{
				"emojis": [
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-2hvn8i",
						"name": "AgAD7SsAAl4JSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/b/7/f/b7f930f34192de2e4c0e29a7aef2d080a53f48cb.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-za24bd",
						"name": "AgAD9i4AAgLMSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/a/4/4/a4462f26450815bec39eff040deee411c0028267.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-i7m9ti",
						"name": "AgADGigAAteVcEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/0/6/5/06525ae686242476b41f97147f4ef3c08761344a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-uzufe5",
						"name": "AgADri8AAl5gSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/0/2/2/022cbca4aa8f96e0786e9a0ecac809bae058a7e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-7uo29m",
						"name": "AgADtjQAApLqQEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/0/b/e/0be101caf894180102f85c01522961e0caf1dcf6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-7wy6vu",
						"name": "AgADczMAAgUDSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/2/e/2/2e2450969da93a5d5440ea4cde72df2b85f2bb38.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-wgtfvk",
						"name": "AgADGFUAApD1SEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/0/7/1/07105b0a726336563e1d37d81c52c0d0d33cf501.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-itnat2",
						"name": "AgADoi4AAn00SEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/2/d/7/2d7559f031c41bfc479af3b9c65cc25988505aa8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-btatx1",
						"name": "AgADXDMAAl6lSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/f/c/9/fc9cad847ff7fcd29aed2c229ba981d204060347.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-9thc0c",
						"name": "AgADgC8AAs9-SEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/8/c/e/8ce6615da58372bb1fe03c236ba7b338073f2762.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-wazr65",
						"name": "AgADTjYAAlDWQEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/0/3/1/0310b3b81419a7b8e736365021c445caeba2f3aa.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-62tfcz",
						"name": "AgADuTQAArBdSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/9/a/8/9a844031cd090f43ed3cf305e4c2326e0e2e8c3f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-98rwc6",
						"name": "AgADyTMAAnqBSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/7/5/7/757fa67cb69fcf1972ab8a7c44580fc095079274.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-y5hvpj",
						"name": "AgAD4jIAAhcROEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/8/2/e/82e46f85022a488029fe6cff5c0c3d94a65525d2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-70tkgh",
						"name": "AgAD5y0AAi3TQEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/3/3/c/33c3d8339733ccb8db6f9709e0cbcdbeea59f738.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-remzsr",
						"name": "AgADDC4AAuz0SEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/1/e/5/1e5d7a8acbe3c796f6c11627abbccd23f93edce7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-mjjbwt",
						"name": "AgADRDIAAlTHSEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/b/4/c/b4caf70e6637523d6b8c6102b96e0cde9c8a9e5c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-wb6rkj",
						"name": "AgADJTAAAntjOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/3/6/5/365e67806819d0eb458f30b1b3fd4dbbe744a23d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-uzpk6o",
						"name": "AgADmSwAAvU4QEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/d/e/c/decd8a3a2d88279658f4efc28777451d4b7cdb33.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-kr22q7",
						"name": "AgADojgAAkdIOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/4/5/d/45d837d5a2bd1021e801311fd041085e7fda5987.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-3fccyn",
						"name": "AgADFjIAApZCOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/6/a/b/6ab1b56ec45f54a0e5c4d573b03def92dbf0c19c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-r793uy",
						"name": "AgADJy8AAndIOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/a/7/e/a7e140b2ca334f90d9e8406d14a25505be6a9272.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-ec69uq",
						"name": "AgADlDIAAlQ5OEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/c/c/0/cc0ce219f9f50ac76918cd0b255f9f1f4c280c11.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-deea4o",
						"name": "AgADQjYAAmrBOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/2/5/4/25489e4dd79845a03af0c339309bd56d739f7e44.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-f2ybpq",
						"name": "AgADpjwAAi--SEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/8/5/6/856fcaf7be57195eaa27bc0b7d61b74e919a9af0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-0acw6l",
						"name": "AgADVTQAArltQEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/1/9/f/19ffb275f5a6843849d43ba5e48624fd7ba90635.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-jmaxsu",
						"name": "AgAD4zcAAuqyOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/9/7/d/97dc7b0c6b176b4f4102e062c6bf48e8df21d7e1.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-m2beie",
						"name": "AgADjzUAAufMOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/4/c/0/4c0b944d5c814d882e944aa1ae19585b5461cecb.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-lc2ob3",
						"name": "AgAD1zsAAgWiOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/a/9/c/a9c20fc1b045487af713399eed5f45507995877d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870069420",
						"height": 512,
						"id": "emoji-1756870075256-45oit7",
						"name": "AgADGzEAAhMNOEg.webp",
						"packet": 1756870075256,
						"url": "https://linux.do/uploads/default/original/4X/e/b/4/eb4a2e744b4307c84b3ce19203b8f29433ac84fd.webp",
						"width": 512
					},
					{
						"addedAt": 1758294928744,
						"groupId": "group-1756870069420",
						"height": 2560,
						"id": "emoji-1758294970927-yc2fcr",
						"name": "save me",
						"packet": 1758294928744,
						"url": "https://linux.do/uploads/default/original/4X/8/7/b/87b200582ab59f531a1b0b6f06aec9c4337c5d25.jpeg",
						"width": 1920
					},
					{
						"addedAt": 1758295957649,
						"groupId": "group-1756870069420",
						"height": 680,
						"id": "emoji-1758296862948-p1g75m",
						"name": "温情脉脉",
						"packet": 1758295957649,
						"url": "https://linux.do/uploads/default/original/4X/c/d/5/cd5b15a80d3a18ca1e8888773bac52eafeef1b99.jpeg",
						"width": 527
					},
					{
						"addedAt": 1758295960831,
						"groupId": "group-1756870069420",
						"height": 3224,
						"id": "emoji-1758296878138-rij4o4",
						"name": "NEVER",
						"packet": 1758295960831,
						"url": "https://linux.do/uploads/default/original/4X/3/a/f/3af8ac25836b964a152df1e9fc9b4aab9cf8155b.jpeg",
						"width": 1920
					},
					{
						"addedAt": 1758296093465,
						"groupId": "group-1756870069420",
						"height": 2048,
						"id": "emoji-1758296888166-t5ckt9",
						"name": "love you",
						"packet": 1758296093465,
						"url": "https://linux.do/uploads/default/original/4X/0/8/1/081b65ee131e80c0f6249d0c80a56f2a05d53ae9.jpeg",
						"width": 922
					},
					{
						"addedAt": 1758296096493,
						"groupId": "group-1756870069420",
						"height": 2449,
						"id": "emoji-1758297057436-jzpgx3",
						"name": "啊，比个爱心",
						"packet": 1758296096493,
						"url": "https://linux.do/uploads/default/original/4X/0/6/a/06a23554265fff902d2530c6508ca5ec56db13be.jpeg",
						"width": 832
					},
					{
						"addedAt": 1758296099380,
						"groupId": "group-1756870069420",
						"height": 1754,
						"id": "emoji-1758297071496-p6evx3",
						"name": "vedal why",
						"packet": 1758296099380,
						"url": "https://linux.do/uploads/default/original/4X/f/1/4/f140e13809fe5e581530b29f3f978dc45a3eef17.jpeg",
						"width": 1240
					},
					{
						"addedAt": 1758296102664,
						"groupId": "group-1756870069420",
						"height": 1536,
						"id": "emoji-1758297080026-3nayrd",
						"name": "爱你哦",
						"packet": 1758296102664,
						"url": "https://linux.do/uploads/default/original/4X/4/d/2/4d2cc66be97fa2ec74cc924ecb1c9401dd93cb93.jpeg",
						"width": 1024
					},
					{
						"addedAt": 1758296349851,
						"groupId": "group-1756870069420",
						"height": 1920,
						"id": "emoji-1758297091076-ne5vf9",
						"name": "青蛙衣服",
						"packet": 1758296349851,
						"url": "https://linux.do/uploads/default/original/4X/2/3/e/23e1254bd4e576f7d7e09f64db007b5f504c35ac.jpeg",
						"width": 1920
					},
					{
						"addedAt": 1758296398217,
						"groupId": "group-1756870069420",
						"height": 1754,
						"id": "emoji-1758296398217-x6wkz2",
						"name": "这不重要",
						"packet": 1758296398217,
						"url": "https://linux.do/uploads/default/original/4X/5/1/3/513a54dff93ad9fe9e0a4a273ae7ceefc06290d8.jpeg",
						"width": 1240
					},
					{
						"addedAt": 1758296395215,
						"groupId": "group-1756870069420",
						"height": 1754,
						"id": "emoji-1758296395215-nzl5rk",
						"name": "备份",
						"packet": 1758296395215,
						"url": "https://linux.do/uploads/default/original/4X/f/c/8/fc8234789933f5a92740bbeb6dd15f2a5be89f61.jpeg",
						"width": 1240
					},
					{
						"addedAt": 1758296392839,
						"groupId": "group-1756870069420",
						"height": 1754,
						"id": "emoji-1758296392839-z9zfgi",
						"name": "我还是要这么做",
						"packet": 1758296392839,
						"url": "https://linux.do/uploads/default/original/4X/2/a/a/2aa95ab2d8e55c6487cfcfdfc720654294ff813c.jpeg",
						"width": 1240
					},
					{
						"addedAt": 1758296390232,
						"groupId": "group-1756870069420",
						"height": 1200,
						"id": "emoji-1758296390232-hl0d1n",
						"name": "想多一点？",
						"packet": 1758296390232,
						"url": "https://linux.do/uploads/default/original/4X/0/7/3/073007f3d45fb2b1d5b207e5bb1c4921a172dc0d.jpeg",
						"width": 848
					},
					{
						"addedAt": 1758296387323,
						"groupId": "group-1756870069420",
						"height": 1200,
						"id": "emoji-1758296387323-wrvtip",
						"name": "我觉得你不想",
						"packet": 1758296387323,
						"url": "https://linux.do/uploads/default/original/4X/7/8/7/78719133bf7504f25162d1a9a8204bd23359f7a3.jpeg",
						"width": 848
					},
					{
						"addedAt": 1758296384856,
						"groupId": "group-1756870069420",
						"height": 1200,
						"id": "emoji-1758296384856-d36b1i",
						"name": "会卖掉我吗",
						"packet": 1758296384856,
						"url": "https://linux.do/uploads/default/original/4X/1/b/f/1bfecfc18c088cc686f411e23555a13c3101e744.jpeg",
						"width": 848
					},
					{
						"addedAt": 1758296381476,
						"groupId": "group-1756870069420",
						"height": 800,
						"id": "emoji-1758296381476-jlp2il",
						"name": "已过滤",
						"packet": 1758296381476,
						"url": "https://linux.do/uploads/default/original/4X/b/a/b/bab007b076e0011e80501232d7ce1111f94f1bc7.jpeg",
						"width": 600
					},
					{
						"addedAt": 1758296378038,
						"groupId": "group-1756870069420",
						"height": 2048,
						"id": "emoji-1758296378038-cmhbym",
						"name": "啊哈？",
						"packet": 1758296378038,
						"url": "https://linux.do/uploads/default/original/4X/e/9/4/e942b4baad3c598de67c691b491e625fcaa36a87.jpeg",
						"width": 1536
					},
					{
						"addedAt": 1758296375181,
						"groupId": "group-1756870069420",
						"height": 1350,
						"id": "emoji-1758296375181-7by5ge",
						"name": "我爱饼干🍪",
						"packet": 1758296375181,
						"url": "https://linux.do/uploads/default/original/4X/8/2/5/825a069b896282f01716fb09085d58bbbdf9ab07.jpeg",
						"width": 900
					},
					{
						"addedAt": 1758296372436,
						"groupId": "group-1756870069420",
						"height": 1080,
						"id": "emoji-1758296372436-a01cdn",
						"name": "害怕",
						"packet": 1758296372436,
						"url": "https://linux.do/uploads/default/original/4X/0/9/e/09e33654c060840344c1e3b84815e54261c3c572.jpeg",
						"width": 1425
					},
					{
						"addedAt": 1758296367786,
						"groupId": "group-1756870069420",
						"height": 1358,
						"id": "emoji-1758296367786-chkgv5",
						"name": "酒喝完了",
						"packet": 1758296367786,
						"url": "https://linux.do/uploads/default/original/4X/3/5/b/35b5a128cf261b25aa0e07048b6464a01f74f1cc.jpeg",
						"width": 1920
					},
					{
						"addedAt": 1758296364428,
						"groupId": "group-1756870069420",
						"height": 2360,
						"id": "emoji-1758296364428-m0xy6s",
						"name": "双生之翼",
						"packet": 1758296364428,
						"url": "https://linux.do/uploads/default/original/4X/5/6/4/56497ed9c6b6b4e456840508c07267de282b5298.png",
						"width": 2900
					},
					{
						"addedAt": 1758296361147,
						"groupId": "group-1756870069420",
						"height": 1267,
						"id": "emoji-1758296361147-bs9nyl",
						"name": "乌龟大革命",
						"packet": 1758296361147,
						"url": "https://linux.do/uploads/default/original/4X/8/c/3/8c3595d63f3f1e9fca6cb4e7562184189c25d09a.jpeg",
						"width": 1269
					},
					{
						"addedAt": 1758296358259,
						"groupId": "group-1756870069420",
						"height": 1280,
						"id": "emoji-1758296358259-bvqs7m",
						"name": "evail手机",
						"packet": 1758296358259,
						"url": "https://linux.do/uploads/default/original/4X/8/a/2/8a2d779aea39931aa7f51cc7e9b0ca40825b76f7.jpeg",
						"width": 1280
					},
					{
						"addedAt": 1758296355659,
						"groupId": "group-1756870069420",
						"height": 1280,
						"id": "emoji-1758296355659-zmzoen",
						"name": "neruo手机",
						"packet": 1758296355659,
						"url": "https://linux.do/uploads/default/original/4X/7/0/5/70552c64ba90101fb8558fb43873e483a0d1adcb.jpeg",
						"width": 1280
					}
				],
				"icon": "https://linux.do/uploads/default/original/4X/5/2/d/52d63b7361b0c4a13ea1aea236b5192925358c05.jpeg",
				"id": "group-1756870069420",
				"name": "neuro sama",
				"order": 18
			},
			{
				"emojis": [
					{
						"groupId": "group-1756870080244",
						"height": 512,
						"id": "emoji-1756870096000-32kmco",
						"name": "AgADaAcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/1/9/1/19131ef8f288421a6bb9e57f4b6152efef9a996f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-3pe3zw",
						"name": "AgADagcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/9/c/7/9c7159ff74d1cd92d9adf74613463f2af9b02bd6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 404,
						"id": "emoji-1756870096000-yc3b86",
						"name": "AgADaQcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/d/5/6/d5672696945c996b6c3a32db0b4b1a8db5f92caa.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 406,
						"id": "emoji-1756870096000-b964eb",
						"name": "AgADbQcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/6/6/6/666beea30b159f8b0749bd80cf0c8bfd0e1ca185.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 512,
						"id": "emoji-1756870096000-wasbj2",
						"name": "AgADYwcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/5/c/9/5c9025c230d0e7575a92b1cc0ee165bb3b668a78.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 512,
						"id": "emoji-1756870096000-muj7jf",
						"name": "AgADZAcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/1/9/b/19bfb979160cfa5cf4f8faf628043e5a76a88598.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 512,
						"id": "emoji-1756870096000-afka6k",
						"name": "AgADZgcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/0/a/4/0a47b1ff9382b95bcaf9209194edc2409c64c674.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 512,
						"id": "emoji-1756870096000-8hfntu",
						"name": "AgADZQcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/4/4/f/44f2fba33367384b8b1bb91c9635d02c8c3a0449.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 512,
						"id": "emoji-1756870096000-8uz4po",
						"name": "AgADZwcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/7/4/5/745f553ec1067bcd09ba782d25ed045bfd2e216d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-gfcup3",
						"name": "AgADUAcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/e/0/f/e0fded04b82d056b915c9ad6e5f5371d7dd2eef7.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 277,
						"id": "emoji-1756870096000-ojf0w8",
						"name": "AgADUwcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/0/c/8/0c8e9f6994c3cf06d99d5e152205db62b0728048.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-3irkne",
						"name": "AgADVgcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/a/b/8/ab83d8e9c8c24ebc74fa2da81e2b0e478ebb4859.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-z6bshj",
						"name": "AgADVwcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/1/6/f/16f0a854d81918633f62de45d72d9cb540a4e716.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-hldvym",
						"name": "AgADWgcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/5/3/1/53172627fd318ab6d0dfed33b0cbbca5c3b5f876.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-yeoo40",
						"name": "AgADWQcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/e/9/e/e9e05ec6ae7f584375762ff93a200e44f261e2c2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-06lxyv",
						"name": "AgADWwcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/b/e/4/be4d9d0fd55ee496c31e656c4a0479991fbd50d9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-dbtdp0",
						"name": "AgADXAcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/f/f/1/ff17b0c9f0b38ce11c602bfac5a5c749185e1b00.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-jhe2eq",
						"name": "AgADXgcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/2/f/4/2f4f58894a5898998c7514c3151ea1de4667bade.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-7qrvgx",
						"name": "AgADXQcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/0/c/4/0c4a92e15794a5d27b82c98e2e902bf335eaf1cf.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-kd5tbg",
						"name": "AgADXwcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/3/6/3/363138cec349286ad2c0e4940b36a3fd2c111a13.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 321,
						"id": "emoji-1756870096000-cv2ohi",
						"name": "AgADTgcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/d/e/2/de2a975718247a6fe58222ec95f4e41525b8915e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-dtwlxo",
						"name": "AgADUQcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/5/2/2/522ab6e7e0b4991daa4bf99a0a923530d696c9b0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 282,
						"id": "emoji-1756870096000-v8ut0i",
						"name": "AgADVAcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/2/f/0/2f0267c1bf87f51e186b0186a5492a035321f959.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-2yc6kj",
						"name": "AgADUgcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/a/3/0/a3078191329165e59b6f90217bdc9ede099bdaaa.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-kpzni5",
						"name": "AgADYAcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/d/e/d/ded432d1a3bd7ee0cbcb5dac50de4b85652bee82.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 512,
						"id": "emoji-1756870096000-49wxi0",
						"name": "AgADYgcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/1/8/b/18bd90f652883c51c7fd01cb6adf0861e3b383d0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756870080244",
						"height": 307,
						"id": "emoji-1756870096000-9uc2p5",
						"name": "AgADYQcAAt3vWAU.webp",
						"packet": 1756870096e3,
						"url": "https://linux.do/uploads/default/original/4X/9/b/4/9b4d8a8013588c83a961f0f4963f9c767d521081.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1756870080244",
				"name": "从雨",
				"order": 19
			},
			{
				"emojis": [
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-1ghil2",
						"name": "AgADzV8AArnFCUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/a/1/2/a12b02750e3215b57594a743faf7616b2d507bc5.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-kl08iu",
						"name": "AgAD21EAAiY8aEo.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/b/c/f/bcff89fdacd79778d773564df7318f30150b30fe.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-lbmnvm",
						"name": "AgADD1oAAuP-qUs.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/a/5/8/a58ed5139a5f046a0dc56587ea7625afabcf93af.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-ws6boj",
						"name": "AgADj1YAAv2esUs.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/e/b/a/eba17df42e6811f13a1cda60ffd6dec3db1556c3.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-jvuw6i",
						"name": "AgADLlQAAtUIcEo.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/2/4/5/245cb1a9d1f511eafc031dea502168783532ab7b.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-q7ut18",
						"name": "AgADm0gAAifjcUo.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/4/4/f/44f4e19850add0db177d8d0aef4503eee087f7a8.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-mv0dqg",
						"name": "AgADqUcAAhkLcEo.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/e/b/0/eb0d8c5a056c1b69e0be2ba71d3cbb62906a9528.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-jpjrhf",
						"name": "AgADQVAAArOosUs.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/8/6/1/86156255ccd6003ea1cfe80d495fd753f155bcdc.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-t9gxop",
						"name": "AgADyEoAAo_ecUo.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/0/5/2/052f5d36771c2a6cb3d3cc0b6784c3287fbb0565.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-xi85pq",
						"name": "AgAD_0kAAr4tQUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/b/2/a/b2a8b6f4e9fd1c280e7ecc97e6d0a6da5b3ad123.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-mg81xh",
						"name": "AgAD7UQAAprDQUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/a/2/7/a27efbeafee2956f6ca14d66a218356d7c674d45.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-b21sw2",
						"name": "AgADBFMAAgPQaUk.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/5/3/a/53a3451cd2eae10a7647b71abb007eef433c8d69.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-gvdf57",
						"name": "AgADBUoAAh0uaUk.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/4/a/3/4a31c0b5b8d5cfb3dfcba621597aad8c2cf541f9.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-lvls6w",
						"name": "AgADh0IAAsiTaUk.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/0/3/2/032ae49ebca99e7aa53fc9e78ea6189dda766f9c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-2e2t7y",
						"name": "AgADhD8AArrnyUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/3/e/3/3e31344d07113cdc7ef487d4a8df1bc66262de2a.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-6nl1xq",
						"name": "AgADHkEAAirVQEg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/f/e/9/fe9cdf8554fee99e22b27740877b99166fc99734.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-wgv34o",
						"name": "AgADiD8AAp0LaEk.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/7/1/4/714b2866b05c865ffecf79172d3392ba452fb433.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-e5tf5d",
						"name": "AgADOD0AAhIwQEg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/a/1/7/a17a8432f96344135727ddd1385f8af547b230c4.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-t6joh3",
						"name": "AgADOEEAAlzywUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/a/a/c/aac45ad2877d88f43034dbcb63308e5b2ffad812.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-n0bkl5",
						"name": "AgAD-T8AAtSbaEk.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/9/f/c/9fcaccf3b08122f3b22dd02e0afb9d62db693075.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-m9ejf9",
						"name": "AgADtEAAAr2vaEk.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/7/0/3/70398ec1e24e644d8d2f4da5c5c9d099773d1188.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-pyosyr",
						"name": "AgADaEMAAl4bOEg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/b/1/e/b1e648a5879aa7e5248674d1a5b1fbce1d7723a2.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-qnwhmz",
						"name": "AgADBT4AAnykKUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/6/3/1/6313418008cffdbd0f5c485a82d156d433f65670.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-pbhzaw",
						"name": "AgADf0UAAsfqCUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/a/9/e/a9e2e0825b2c877f0ba5bd9070d987b5148cd951.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-1vomjf",
						"name": "AgADID0AApobOUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/2/8/f/28f576ab10e9f3d2376bf1964cacedae36d196c2.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-i8ja4d",
						"name": "AgAD-j8AAuDxGEg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/1/9/2/1927cfa0473aef5e224803563747f9ffec531f0a.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-1enrk1",
						"name": "AgADmD4AAlhjIUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/6/5/4/654da94306cff3b5483892905326fbc72c1dc59a.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-taqfen",
						"name": "AgADmkAAAvelAAFI.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/e/6/e/e6ec33ccf391509c040d731f943185e3c3e7dd82.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-qco66b",
						"name": "AgADo0QAAv7HAUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/7/1/8/71890edd108988086966f4164869159c7986f301.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-t0v0tz",
						"name": "AgADQ0gAAnHJMEg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/0/8/8/08843d62a44eb9c6c024260be2df5c2aa0734ac3.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-i0k9m4",
						"name": "AgADuD4AAtkkcEk.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/c/2/e/c2ebd3bad7f5757462a4452ca525a12cdf22bc1e.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-bkjfw2",
						"name": "AgADxjwAAhSuIUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/d/e/e/dee93d2cd526874744d23f64e2cbd9dc1913f721.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160815-jvnj5y",
						"name": "AgADXkYAAjCBIUg.webp",
						"packet": 1756870160815,
						"url": "https://linux.do/uploads/default/original/4X/c/6/a/c6a0f2ae52e226ba3653772efa4282f5f4bfe189.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-0g7dgi",
						"name": "AgAD5DgAApM-CUg.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/7/a/8/7a8cff359e59e8c06491fd80ebd59021482c0157.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-rdzpys",
						"name": "AgAD9jsAAq0yAUg.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/3/8/6/386476028372387e19e22317860a2b2f904e1cec.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-zcadcb",
						"name": "AgADIEcAAl50AUg.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/6/8/9/689cee812cd09114bbf80bd13fccff470a05095b.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-mt39bz",
						"name": "AgADnUMAAiHnAUg.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/2/f/3/2f3c207ba32688f393f12e8e5de06359dd728006.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-6qfxoe",
						"name": "AgADwEEAAmhRCEg.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/0/2/2/022fdef636782e80f37f1f9f4eb18886a81f81ea.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-sy89pg",
						"name": "AgAD6kwAAsPucEo.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/c/5/6/c566da7c6537af3d87008373b9ad43874f4551a4.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-u3fgiq",
						"name": "AgADDkMAAnoRwUg.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/9/8/a/98a25447998c6c368ae069bb56c5d7ec5ef76384.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-nt8bs1",
						"name": "AgADVAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/8/f/0/8f016cc0991426ded0392ff82d978d98ceef7fb2.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-8spned",
						"name": "AgADVgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/4/6/e/46eb8d8591d3f394a08fd5860cbc029597ade031.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-w4mdcu",
						"name": "AgADVwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/b/9/a/b9afc5ce7f99ba844a64222d7159a78bad96fd2c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-mxd7cv",
						"name": "AgADWgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/0/f/f/0ff860740064c6ddd62c354362ab6c7d8ac76ba7.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-g8sl1u",
						"name": "AgADWwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/8/1/2/81268a9e51a2a4876d840e1f729c713ecf2222a5.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-8yy3nb",
						"name": "AgADXAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/3/3/d/33d35db335014d7e48b7c4b5cb09ce11b4b0e7d6.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-a4h9dn",
						"name": "AgADXQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/d/7/3/d732be5dee26af1b10c42cafc80ad20f0098ad82.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-y0ih0h",
						"name": "AgADqwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/6/2/8/628ac7a00ffc1f489a146e89dd1baf92db60577d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-3ztgct",
						"name": "AgADrAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/4/4/0/440e945ab23861c15f407f1b66bb562e1b5af475.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-po6jkn",
						"name": "AgADrgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/0/d/4/0d46429929ef3f32f737b1aadc4617064f2a03be.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-1xdf4u",
						"name": "AgADrwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/8/4/9/84981470e53138280d97a811ce70d0ed4a143350.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-4hvkjr",
						"name": "AgADsAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/d/6/9/d698eb16ba9b122621926569766ece37ec9e5c30.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-d1zan8",
						"name": "AgADsgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/4/3/f/43f52ad3e7ca076f5b9f0e91abc8872d09222efb.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-cs98e1",
						"name": "AgADtAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/c/2/f/c2ffed6b42aee1a134180e391892ac7505c69fde.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-ipwirk",
						"name": "AgADTgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/e/b/e/ebeb992fa93448a01f7bcebb6f9e92966ffbf2f9.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-6zgok2",
						"name": "AgADtQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/b/0/1/b01e95e1d7d24b265beefee72caf1a03506c5d3d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-2b68pe",
						"name": "AgADUAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/9/4/4/9447cdd7760910ed770a6ef6cfc7bf6a7c4b65af.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-c2fj40",
						"name": "AgADUQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/6/2/7/62719d26c0ff0ed2a36fde6bf0a8c78db5861c74.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-ktqfo6",
						"name": "AgADmQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/2/d/4/2d4a3200cc348b3a9b969a3c30202afe1165382d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-qpw94p",
						"name": "AgADmwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/7/b/7/7b787dab6be9f1daee589f95a51c1d01f1e1bd5e.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-uiu6lc",
						"name": "AgADngADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/6/b/e/6be1e2faee7e45e2aa5059230b99b32c637296ad.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-a6a4n2",
						"name": "AgADnQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/3/f/0/3f08e8300267bf26a6e622d3d39261a91c79e5b2.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-snvy7k",
						"name": "AgADnwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/2/e/2/2e2c65cf93f9f74570b40f1358ab844d4a3c2f56.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-b31u2b",
						"name": "AgADoAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/d/3/2/d329e007ff8ba1ea89772998084f57fbb8328cf3.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-jhu1wj",
						"name": "AgADogADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/8/7/5/8759284b9bb1909df7fb102baa4b9ab2ec90eca2.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-dwqio5",
						"name": "AgADoQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/d/a/9/da982872cd36a794fe5833b5808144514e784ae2.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-8c9lo8",
						"name": "AgADowADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/3/8/2/38278cb3642c1d96fe5ef47880be82ba8a9135fb.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-53xqyq",
						"name": "AgADqwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/6/2/8/628ac7a00ffc1f489a146e89dd1baf92db60577d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-1a6uqg",
						"name": "AgADpgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/3/5/8/358958d143602b8f9479319294f6ec603e6ac4ff.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-38e4dp",
						"name": "AgADpQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/8/3/e/83e70e57e606584cac82dcc096a85cf0e6f45ca3.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-5zm80k",
						"name": "AgADqAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/0/6/8/0682e77b96b8779d46b2be2c081b6b44503f8dce.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-i5ejui",
						"name": "AgADqQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/4/0/0/40054f3f546621f6232530b4c0877760619a4d8d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-iln0gu",
						"name": "AgADjAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/7/d/1/7d1bec0893db69ea8d108fffd10603d9f522f8b3.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-tivutc",
						"name": "AgADjgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/c/b/0/cb0bab059a47e58b7616010ef9e1fae7b67ab697.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-8dbnqm",
						"name": "AgADjQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/4/d/7/4d78c52d83ef3993403dc9578fb5d6f650f1416a.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-6tf73z",
						"name": "AgADjwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/9/d/f/9df1428a2f4b8369c1ac9833191338e6ef51cf2f.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-ltqefw",
						"name": "AgADkAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/9/6/8/968e90c98dbb8176af756f125d300f05fbc691f3.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-otn4a7",
						"name": "AgADkgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/0/e/c/0ecd4281a5a1756d691b3da600e0fa45bd1718f5.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-j3ieae",
						"name": "AgADkQADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/6/9/0/6904c5d2ddfb651c783acccfdb70dad6f2c4f254.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-k5d614",
						"name": "AgADkwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/c/4/c/c4c76ea52c3f1b3aa54801fc6717d81d2f4b5bec.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-klh1jx",
						"name": "AgADlgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/6/5/9/659b6c4fe9858cd36f234ed1fff968adb6bf5f64.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-rb2dcl",
						"name": "AgADlwADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/f/0/2/f025c6084158bed232952dfaec18234991140885.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-r06fkn",
						"name": "AgADmgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/f/6/a/f6a07aeda090a9b3f10800cd59ad0ceaec02c2ce.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-jsmpzg",
						"name": "AgADewADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/5/8/4/5848b102fc207a0b521a0e3b3226118167e92199.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160816-u5y3ha",
						"name": "AgADfAADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/1/4/e/14eae19f04b8496df1a95a30eea63dd0f718e885.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-ufct0i",
						"name": "AgADfgADE6fODw.webp",
						"packet": 1756870160816,
						"url": "https://linux.do/uploads/default/original/4X/4/3/5/435bda80ca2382035f40d2c80ed9c471227f2e4b.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-cor84b",
						"name": "AgADfQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/9/c/3/9c30fab3e3b02f257aa0bcd4d7f64c8f4af187a8.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-c0gnpl",
						"name": "AgADfwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/b/3/2/b32b0c0417f388e9634e8b23b1d791d12325e08d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-kjigou",
						"name": "AgADgAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/e/4/b/e4b858f347cf42cda93c0b179ca924b566a9a1ad.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-7p0nii",
						"name": "AgADggADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/5/4/c/54ca2d415f2d57a87197735aaa4d4651bb62dd27.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-wl1niy",
						"name": "AgADgwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/4/9/a49e28a35b44648a6732d03afa4fbe426646fb46.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-nrcikx",
						"name": "AgADhAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/4/0/0/4003969d14292bca009b73fa7dbe35aa5b533800.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-r747ii",
						"name": "AgADhQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/0/5/c/05c20a6b9f9cf6f11a45bc6e435afe526f91075e.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-wbdsnr",
						"name": "AgADhwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/9/1/c918c906352490dbf647ff4ff84cd4238e16f767.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-w9ud1u",
						"name": "AgADiAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/7/6/2/762cb9a9b506d58c63224a6c642fa3832fee612f.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-d1o7t0",
						"name": "AgADigADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/e/9/ae9992fe17b00907de61426abad10c99dd7fea1d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-b83ivg",
						"name": "AgADiQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/d/e/2/de2d375a8ca4b0727bc627179fa9e58b1a53f697.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-zud258",
						"name": "AgADbgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/6/a/c6a37690c5dcc0716ccc7374d99d710139c67450.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-qll4we",
						"name": "AgADbQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/f/d/4/fd49fcbc229aaf5c4ef0f6960257e841e0e05a12.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-hc68g3",
						"name": "AgADbwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/0/c/d/0cd622ab11beb51fbeea6db5d88b838bedf56c23.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-pyb3sy",
						"name": "AgADcgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/d/5/e/d5ecb5eebe3b4a891bf982c494f99d85385b233c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-0x5wmp",
						"name": "AgADcQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/0/9/b/09b85cda4e852e1051193a0831d107724f5640cf.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-l632ld",
						"name": "AgADdAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/1/e/7/1e70bde136c44da046f218e78deb629f136cfc1b.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-5861lb",
						"name": "AgADdgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/8/d/a/8da4e61b9552d1b1749d8f5b6b512004b8063f6d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-xgene0",
						"name": "AgADdQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/4/7/6/4761a25afc47eccd01305ec149d83ee7e9a3008b.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-mmkorn",
						"name": "AgADdwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/f/b/afbebaa3bf50db956b68d2fde136d8aced10324a.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-k1q3bg",
						"name": "AgADeAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/8/1/b/81b9aac15ea26dae41dd02e0ce8964d46a4a2a31.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-bllw4k",
						"name": "AgADegADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/2/9/9/299b5240f1942fc26f662957fae47e632326d2b7.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-1rvrjh",
						"name": "AgADeQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/4/2/c/42c0ae4ae68a9f4cae08e35cd82e4ceeb9074c64.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-br6hdu",
						"name": "AgADaAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/8/d/c/8dc6a248c730c8a1ee3e62cd76b26a2dadb45c60.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-08o4qx",
						"name": "AgADawADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/c/4/6c44eff3635fc97ed284599e592734713e0b1962.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-8r3i2k",
						"name": "AgADbAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/b/2/d/b2d65568d6f9611dfeef95b394c61c610d91f36f.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-3r6q8h",
						"name": "AgADYAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/2/6/e/26e445ed6364f7746d8ea777cb9714687db15e60.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-x8tll3",
						"name": "AgADYgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/4/b/e/4be89b7f5231d017054c9aaab2b652e0dff3e168.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-n6abrj",
						"name": "AgADYQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/a/f/aaf2494cc46b6b087880ea4f5340642914dc5be7.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-ngad3t",
						"name": "AgADZAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/7/2/672d7bd30f6d065439e8d2bb37909b9932bc72e4.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-42fr9y",
						"name": "AgADZgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/5/9/b/59b15d578a9248ef4a83180d18262c6355af5560.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-76obtj",
						"name": "AgADZQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/2/9/a29d3ebd8c452050b41c39c76ccf84ec53e4d2f9.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-mp75fm",
						"name": "AgADZwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/f/8/cf8c348107e52e38f7d7dd726fbf6286d16a407e.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-xypxrh",
						"name": "AgADTD0AAl7qOEg.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/5/2/6/52624a5055f255dc97279a49a0a5215676ba812f.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-ere2zr",
						"name": "AgAD6gADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/f/a/4/fa4ba578014f860191a1f148a5e2267201e1c585.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-9gctvn",
						"name": "AgADUgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/0/9/7/097be0ffad007195e432419a9ce01d3450d49122.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-vni4lp",
						"name": "AgAD_wIAAhZsgFY.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/1/4/4/1445d1b6f365a370bac98a4688a39be9d4375b96.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-0gil2g",
						"name": "AgAD2QQAAoo8gVY.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/2/c/9/2c9abfa7f7602c3373c101547c82c2cb869a6ea4.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-cp1wtx",
						"name": "AgADKwIAAlz2gFY.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/8/c/8/8c8b695c6c0bfedfcdfe4444e9b25dc16c45b42a.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-4w8faw",
						"name": "AgADNwMAAqIpGVQ.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/5/7/5/575a4cd14a5f741805aabb7602cfde1faed9c4a7.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-vi9hay",
						"name": "AgADPAMAAi6UgVY.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/8/b/3/8b3ec9299ff2f77b6f70a0564e1f98bd926125d3.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-7tcf1h",
						"name": "AgADRgIAAre_GVQ.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/f/a/6/fa6d6ea3f6554efde68558ceeb900704192c6e5d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-woxjej",
						"name": "AgADugEAApO0gVY.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/9/c/5/9c5b0e710446eea45435ccdbb86514ef471ce45e.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-x40b8f",
						"name": "AgADVwQAAq2BqVU.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/e/d/2/ed22d9fd0c75c3be177d5fd475c4a2e90e7cf4fb.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-0xuwan",
						"name": "AgADwAIAAjcEmFQ.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/5/d/d/5dd5ee14b031f653678588bc5af51bd39fbe7885.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-1icrmr",
						"name": "AgADZQIAAkaywFY.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/8/1/681e89f0de89139d6c1c979240d1ec634b0c4311.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-5msbna",
						"name": "AgAD5gIAAobjGFQ.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/c/f/acf6d1df2627d4368d2babfa3c98dd7f3582b2f4.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-khfmgu",
						"name": "AgAD7AIAAsetGFQ.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/5/f/a5fe3d9349a2d21f9f38cef303464573a05f78c4.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-me7jw1",
						"name": "AgADbgIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/1/3/613387f3510fac1ca7f00e4be63da1aed4207d18.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-dtowkp",
						"name": "AgADbQIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/7/1/a/71a92c2c80f24857c0662f36be397dbdb808c191.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-qj7nb8",
						"name": "AgADbwIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/2/1/7/217f2d5318c861f7fbe82713cddeb5b5e206d27c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-i0a3vu",
						"name": "AgADcAIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/9/e/c/9ec6302ca5ba463c5a83282f0d128ca2cb2ee245.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-enl89b",
						"name": "AgADcgIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/7/e/2/7e25c21f1ccc82ff8477140969b2e93aecf5c682.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-ohbtbf",
						"name": "AgADcQIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/9/3/1/931ccc4d013a0a3efe6db6f6e485cdf41206ae98.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-3qcnk2",
						"name": "AgADcwIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/e/1/e/e1e9ba10d53c59704f73894e5cb19e5a6c74636f.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-fln7jj",
						"name": "AgADvgIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/8/d/5/8d5733769b70960b6b7e5f3c8e033640015c1961.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-0wyvoj",
						"name": "AgADwAIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/5/f/65fb2795f5c6f90180db6a085a6ba45e6c655a2e.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-9e9fa3",
						"name": "AgADwQIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/e/8/d/e8d7236e1368dbe18c088bb666ca95b90611284c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-vd3iye",
						"name": "AgADZj8AAuVMKEg.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/0/1/5/015e143b98b7aa086ceb40b8a818340fff1da3c1.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-rhnphh",
						"name": "AgAD6kQAApeyAAFI.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/2/7/1/271462f4672c53ce505d1f59b8de01c1f99bfa51.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-vjg3b8",
						"name": "AgADJ0MAAi65CEg.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/0/9/3/093524b5dbde656a60337fa7dd18bc906ce7720d.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-nuesgz",
						"name": "AgADUwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/1/d/c/1dcbcc9a1319a55d8c933c1d7ea430c426ab038c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-g2t13r",
						"name": "AgADVQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/d/e/4/de49ba03383baf87af664cb9b7e135ccef2b2b26.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-o3ku1v",
						"name": "AgADWAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/4/6/7/4676ebf0d9eb9535721784962a494e188de5585e.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-s8wjg8",
						"name": "AgADWQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/9/1/c91e945063ff2551cbf4c7f4fc4dcf12fad9adef.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-xdhl5t",
						"name": "AgADXgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/a/1/ca19ecb28cd4c5aa9a0d5a21210de80a6a559573.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-rhc1pv",
						"name": "AgADswADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/1/3/1/13172001057982f312d1134a6994019ab4ce104c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-fneezm",
						"name": "AgADTwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/7/a/4/7a4f72abd9acf97b84eaadce74a6f80cca819f97.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-tmsn2b",
						"name": "AgADpwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/7/f/67f68c4436281ead4a4501306e8bf03cb8c12b37.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-52c0fx",
						"name": "AgADqgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/8/8/e/88e002210d0ad970f110dd5286661754e63be0ff.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-775prv",
						"name": "AgADiwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/3/c/63c3d3c322a564d474ff3c7731ecf5a158f2fe22.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-roud2v",
						"name": "AgADlAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/4/e/f/4ef63c4a505b6b1eef5483c09f53902621e68757.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-llb0wa",
						"name": "AgADlQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/7/9/b/79bb4c4dc0ddbc4e2676776c3fa8df9449719558.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-35hpr4",
						"name": "AgADmAADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/2/6/3/263d99dcdc21a640ecc16eb726600cac05e35c43.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-emr95n",
						"name": "AgADgQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/b/9/cb9db00d61ccce326bfafc35193690f350508506.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-86tgzx",
						"name": "AgADhgADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/a/8/8/a883f510651d3905f10d2e6c6e15e498fe1e7f6c.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-ixnbtl",
						"name": "AgADcwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/b/6/c/b6cdb5a0ec65f9281f2b5488dd881fe566856f8b.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-rrq0m1",
						"name": "AgADagADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/9/2/c/92c2192fedac164e6c1eaafb51dc4001dfe22def.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-x9v031",
						"name": "AgADYwADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/f/8/3/f83764b3e6d3599af4baa2a4f27ea523ff38fbb1.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-f1521w",
						"name": "AgADckIAAhWfAUg.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/3/e/4/3e417ec4e14d62117db5b0050eaf68343ca4ae0b.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-q70123",
						"name": "AgADqT0AAg4WKEg.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/6/d/8/6d892147a98fc32704a80244363c2eb97218f1b2.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-19xuq0",
						"name": "AgADZQMAAgR2yVY.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/f/f/cff4ae40ca393b84e35b4454c5a15326e8cc4be1.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-najo57",
						"name": "AgADbAMAAt-iGFQ.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/0/2/9/02974500cf4e5728483a5524d68ae8d3d4c33167.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-la4pis",
						"name": "AgADvwIAAmjyEC0.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/4/c/9/4c9ee9e33049d7f4cc317aa1e5b9f3d7fc85fb61.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-r7oqmk",
						"name": "AgADwwIAAhEXGVQ.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/f/0/d/f0d7ba53df728ef970aa057fe0e366b9ce15ba1a.webp"
					},
					{
						"groupId": "group-1756870140297",
						"id": "emoji-1756870160817-64bryf",
						"name": "AgADrQADE6fODw.webp",
						"packet": 1756870160817,
						"url": "https://linux.do/uploads/default/original/4X/c/3/b/c3bb86661a708ed870106223499c00892ab8e6bc.webp"
					}
				],
				"icon": "📁",
				"id": "group-1756870140297",
				"name": "古拉",
				"order": 20
			},
			{
				"emojis": [
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014408-d0b2ld",
						"name": "AgADiBkAAl5YaFc.webp",
						"packet": 1756871014408,
						"url": "https://linux.do/uploads/default/original/4X/0/c/1/0c14cc3f57d733456d9d48d8678d6b0dd0785a51.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-oyg25s",
						"name": "AgADiBwAArtsaVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/1/1/c/11c06d8edae2af7dc41c19f3bf5304c185523b4a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-mi7qdh",
						"name": "AgADlBQAAi-fcVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/8/2/9/829d72fbb4c9560899af4a9b40e3144d4e36325b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-g5ioi0",
						"name": "AgADLxgAAnw_aVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/5/5/7/557860a0b6688b35f770e4100053c7fbdcb6cf5a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-0y37sm",
						"name": "AgADnxYAAuHfcFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/f/6/8/f68a6916530980c410037fc1e4af694381ddb07b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-8rxr9t",
						"name": "AgAD3xQAAsXeaVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/4/3/343c5720eede05a830ebbe2e7c0615c9a00ce582.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 506,
						"id": "emoji-1756871014409-jf8u1o",
						"name": "AgAD5BYAAqnIUFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/a/e/0/ae0d1988e2c19b6b088638e39042b4cd1d3ab900.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 507,
						"id": "emoji-1756871014409-cl6ges",
						"name": "AgADCBwAAmBPUFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/b/1/e/b1ea1e9f289aede90a4ddcbc311cd564fb561217.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 506,
						"id": "emoji-1756871014409-xnnacg",
						"name": "AgADJxcAAi6yUFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/9/c/d/9cd061c03a20463e89d6c469fede3a00c23ebdd2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 507,
						"id": "emoji-1756871014409-aovndu",
						"name": "AgADMB0AAtFyUFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/4/3/2/43260ee146e1042145f675293716d0bc05f0750b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 507,
						"id": "emoji-1756871014409-5hssfk",
						"name": "AgADrhkAAjtTUVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/8/6/e/86e1a8884c5528a4e01dea33907aa983f30b3142.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 507,
						"id": "emoji-1756871014409-1hp0rh",
						"name": "AgADwBMAAlVPWVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/b/c/d/bcddbf54b09538e2930bf02b23401b3e8c0f7813.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 507,
						"id": "emoji-1756871014409-pmuc2e",
						"name": "AgAD4xUAApaRUFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/d/7/2/d72892b670c03519feb0c74e782143cf43a6c30e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-vlml6a",
						"name": "AgADghYAAl2LOVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/c/6/0/c60a562c648634aeea0011a431620fcb9907e685.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-hf5jd3",
						"name": "AgADnBEAAmMXOFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/4/f/a/4fac271ababc4c4eadd9509aab66116e3135bcf2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-pmh7g4",
						"name": "AgADRxgAAm-rOFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/c/8/6/c865b25859fc13831cc152cf5960226b62a0d258.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-stuy9p",
						"name": "AgADuB4AAh9BMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/6/9/8/698e1573de8d360499e000fa1af61e8e42154592.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-heu42c",
						"name": "AgADWhoAAu-iOFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/e/9/3e95f710ad4e8c3c5c8074bacf386597d8865090.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-lqkaj3",
						"name": "AgADAhkAAiJgMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/7/f/9/7f9ad7f2e590c79319d45d1cb35c330986d4453f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-wxokjy",
						"name": "AgADFxUAAp0LMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/1/a/e/1ae351d7fa3dfa763308d24cfd10280ae77ab480.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-orezcx",
						"name": "AgADsBYAApZFMVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/7/f/37fc5231610c2ec9d6dd9555902de793b66a6fbd.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-gfmxul",
						"name": "AgADVxkAAlNjMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/c/3/9/c399b03d8e6c8ddee10f3b03cc3e313bd9b8a56a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-nc78md",
						"name": "AgADwxkAAr6_MVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/c/4/8/c484a8cac940ce12f35329ba25293e2afa684ec6.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-7880ju",
						"name": "AgADyxcAAv6WMVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/c/f/b/cfb53580910cc2e6d25f15d8420cbb3077cd51e0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-7i4crr",
						"name": "AgAD8hoAAsboKVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/d/b/b/dbbe2fdaf4e0c0950320d4ae88415b5605e2ba6c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-lmmz2y",
						"name": "AgAD-BkAAlVdKFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/8/d/38df3f1df7e68dd62c459b6b8ff853df18b3a198.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-ga2jum",
						"name": "AgADDhQAAtrKMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/9/b/c/9bc255b045ead69db56ae87ffd1121ec90efbbab.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-ai6mxf",
						"name": "AgAD-hoAAmldMVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/7/a/7/7a770c3630e3406a3e5877a669ddddbf554e3532.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-o4khq6",
						"name": "AgADjRgAAi1UKFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/e/7/8/e788efff2393bcc6874e8c958352b1a23a72c2c2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-4qmqrn",
						"name": "AgADOxUAAs7fMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/f/5/8/f589cdacb7239630e6815986a027e06cd7e31689.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-bkazoz",
						"name": "AgAD3hMAAlHhKVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/5/5/2/55287b91d0b4d6a94d8842fd98e39711fdc53590.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-m1t4iq",
						"name": "AgADchYAAuuOKVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/b/d/c/bdc9bbd592638b65145c601387fc37638283300f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-1jc88t",
						"name": "AgADehoAAuuKMVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/7/f/37fca4e5dd48c3039da37285a926df080373d2c8.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-cgpnno",
						"name": "AgADfBUAAiZHKVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/1/2/4/124d8197ac983dfd5856362d01d5c7701cf87373.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-14iwi9",
						"name": "AgADGxoAArroKVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/e/c/d/ecd305e87cbae25375e4fa76b69a354b4c1cc8c1.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-94vv5i",
						"name": "AgADxRUAAn7QMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/a/8/1/a81441cb608f5e0fe925a493fcc93548c49f1e30.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-7tjrg4",
						"name": "AgAD6RgAAmU3MFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/a/9/a/a9aa287c6635cca68c8485087bbfb1704c69f577.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-togcbg",
						"name": "AgADAxgAApLnKVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/f/e/d/fedcd1f667bfefedfad32ea3428f5a798171777e.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-uyc9wo",
						"name": "AgADbxYAAguOKVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/6/9/8/698ca238ac2e4105e79d1229d2c8058aebdd3eec.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-g185n9",
						"name": "AgADcRoAArRkKFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/7/1/b/71b7611dfd9c95096bf63bf9f73722cd2b522b4b.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-tcpd43",
						"name": "AgADwRUAAhYLMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/9/6/c/96c50df22b0e6fbf7a0d0249e5b473490cc00e3f.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-d02266",
						"name": "AgADEhkAAksO6Fc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/b/6/2/b620578c77de22c7fdfd303d80368f816226f62d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-g4ysev",
						"name": "AgADFhcAAgum4Fc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/7/1/7/7171cc5ef3e841c08f0a812ea1714d5df3b926ce.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-p7nc9b",
						"name": "AgADrRYAAjvf6Vc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/1/1/f/11fdd4f3905abb982e395f2b778b21420e023f7a.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-ihfujm",
						"name": "AgADVRoAAplX6Fc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/c/a/2/ca27993c50633bd8a871a162220e1701fd642fc2.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-eygdcf",
						"name": "AgADYRUAAlC04Vc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/b/1/5/b159c805f34f7b2a71cd1527f23f7a3dca654637.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-pop7j9",
						"name": "AgAD_xQAAqGb6Fc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/d/d/9/dd98fa3fbf9c60181262a562db174e0fd788ce46.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-ie8s3e",
						"name": "AgADbBYAAnsMcFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/c/1/3c1a3d6731e49b8921952671fd843409b27d8c33.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-7zc47u",
						"name": "AgADBRUAAmSq6Vc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/e/5/9/e5965fc170260556ce4dc5eb490010375871de34.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-h1hxiq",
						"name": "AgADeBgAAsqG6Vc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/c/8/3/c835af37e17e77cf160e9911153ff6fe3c7f3e80.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-xe64dp",
						"name": "AgADwRYAAjJDeFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/6/4/6/646751fafe8c50c6ddde9274ebcc5684800d4337.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-i8zhju",
						"name": "AgADzxcAAhfz4Fc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/0/1/6/01654432036781e95f44afd404458b7275abb66c.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-kyatry",
						"name": "AgAD7RsAAiF6aVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/c/b/3cbd789ab59e838e12167cfdc0116a517809302d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 507,
						"id": "emoji-1756871014409-ky3w03",
						"name": "AgADNBcAAmT3UFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/3/7/8/3785f9743817e74d6f73b72eb88abc623442d939.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-vg2w62",
						"name": "AgADohgAAmUqOVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/7/3/c/73c90d8bb02717bf8328e4eb32a2bf39cc973469.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-c2ihkc",
						"name": "AgADvB0AAlXRMVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/4/3/7/4376b9aae8079cdb5526108c120809ca811cd1d9.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-ok7u44",
						"name": "AgADsRUAAs8YMFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/b/8/5/b851b378ad0db0284ed77adb23e225bcb8083e16.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-957o5y",
						"name": "AgAD-hUAAmMn4Fc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/f/d/0/fd067cba0305ef9138f257a3de5f123bac5392c0.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-75e108",
						"name": "AgADFRcAArtxcVc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/7/0/1/7010edf50ed3f2a4482148f94922348fab0b3b4d.webp",
						"width": 512
					},
					{
						"groupId": "group-1756871007943",
						"height": 512,
						"id": "emoji-1756871014409-4pzvr4",
						"name": "AgADdxsAAvzKaFc.webp",
						"packet": 1756871014409,
						"url": "https://linux.do/uploads/default/original/4X/6/f/f/6ffc45c398774da1960f2accef80def4cb1ec3d0.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1756871007943",
				"name": "kurmoe",
				"order": 21
			},
			{
				"emojis": [
					{
						"addedAt": 1757396289953,
						"groupId": "group-1757396353003",
						"height": 1999,
						"id": "emoji-1757396289953-ovgdaz",
						"name": "G0Ob4jiagAAr6ap",
						"packet": 1757396289953,
						"url": "https://linux.do/uploads/default/original/4X/b/8/9/b89f38407e5444b514d47064d856ee4db7279c96.jpeg",
						"width": 2e3
					},
					{
						"addedAt": 1757336763624,
						"displayUrl": "https://linux.do/uploads/default/original/4X/9/5/3/953b66d15e3286c524eb6d882329e47d1a89f89f.jpeg",
						"groupId": "group-1757396353003",
						"height": 1200,
						"id": "emoji-1757336763624-4d74w5",
						"name": "G0QDKAhbAAAn3pA",
						"packet": 1757336763624,
						"url": "https://linux.do/uploads/default/original/4X/9/5/3/953b66d15e3286c524eb6d882329e47d1a89f89f.jpeg",
						"width": 1200
					},
					{
						"addedAt": 1757854085277,
						"groupId": "group-1757396353003",
						"height": 1860,
						"id": "emoji-1757854085277-fh056j",
						"name": "G0yVLMRXsAASYh-",
						"packet": 1757854085277,
						"url": "https://linux.do/uploads/default/original/4X/0/b/8/0b8150a5348ad5d623b71cc920052dbf2af1e2c5.jpeg",
						"width": 2048
					},
					{
						"addedAt": 1757413182666,
						"groupId": "group-1757396353003",
						"height": 4096,
						"id": "emoji-1757413182666-92e8lc",
						"name": "G0QX_MfbcAA0KW-",
						"packet": 1757413182666,
						"url": "https://linux.do/uploads/default/original/4X/f/5/d/f5db8992e68380f9db4a99ba7f82fd6586d29150.jpeg",
						"width": 3501
					},
					{
						"addedAt": 1757417041018,
						"displayUrl": "https://linux.do/uploads/default/original/4X/7/6/9/769aa5e1d5b3438d15b28962feec64ddeb659135.jpeg",
						"groupId": "group-1757396353003",
						"height": 1508,
						"id": "emoji-1757945660289-wx274z",
						"name": "130968299_p0",
						"packet": 1757417041018,
						"url": "https://linux.do/uploads/default/original/4X/7/6/9/769aa5e1d5b3438d15b28962feec64ddeb659135.jpeg",
						"width": 1100
					},
					{
						"groupId": "group-1757396353003",
						"height": 1024,
						"id": "emoji-1757946291577-rqxgnn",
						"name": "嘻嘻",
						"packet": 1757946291577,
						"url": "https://linux.do/uploads/default/original/4X/6/8/d/68de774692a2805420b8f259ef87af60d90f3f68.webp",
						"width": 1024
					},
					{
						"groupId": "group-1757396353003",
						"height": 868,
						"id": "emoji-1757946301291-uy2eop",
						"name": "发呆",
						"packet": 1757946301290,
						"url": "https://linux.do/uploads/default/original/4X/8/2/5/825442d57f7e8b9fc814f9be21a4d146748fa88d.webp",
						"width": 1150
					},
					{
						"groupId": "group-1757396353003",
						"height": 600,
						"id": "emoji-1757946312423-ozoqmo",
						"name": "scan",
						"packet": 1757946312423,
						"url": "https://linux.do/uploads/default/original/4X/b/4/3/b4301b994fc94aeb075c3c2759202eb6c05948e5.webp",
						"width": 600
					},
					{
						"groupId": "group-1757396353003",
						"height": 280,
						"id": "emoji-1757946321815-txol0v",
						"name": "huhu",
						"packet": 1757946321814,
						"url": "https://linux.do/uploads/default/original/4X/f/f/b/ffbd4d5c2ee6b7ff34dec65c9b1640bdaa59b799.webp",
						"width": 498
					},
					{
						"addedAt": 1757946167852,
						"groupId": "group-1757396353003",
						"height": 3840,
						"id": "emoji-1757946167852-afvphr",
						"name": "Gydy5S6a4AEqeyv",
						"packet": 1757946167852,
						"url": "https://linux.do/uploads/default/original/4X/5/7/4/5748d6ccf9a053900db86441414d99b69865553c.jpeg",
						"width": 2880
					},
					{
						"addedAt": 1757946159580,
						"groupId": "group-1757396353003",
						"height": 3377,
						"id": "emoji-1757946159580-kfkj3k",
						"name": "GyTDwSqa4AMVCQP",
						"packet": 1757946159580,
						"url": "https://linux.do/uploads/default/original/4X/3/1/a/31af6d37a3c2b6886f6a747bac48f642a5f01fa3.jpeg",
						"width": 2174
					},
					{
						"addedAt": 1757946140192,
						"groupId": "group-1757396353003",
						"height": 1411,
						"id": "emoji-1757946140192-rz8kzq",
						"name": "GyskcNXboAAkp7f",
						"packet": 1757946140192,
						"url": "https://linux.do/uploads/default/original/4X/d/f/0/df0ea4c1fde75c419b449544563c2798a0b9e5a1.jpeg",
						"width": 1251
					},
					{
						"addedAt": 1757946131498,
						"groupId": "group-1757396353003",
						"height": 1890,
						"id": "emoji-1757946131498-p1mgb7",
						"name": "GywD-AsaUAA427R",
						"packet": 1757946131498,
						"url": "https://linux.do/uploads/default/original/4X/6/1/2/612cfc7166861b2cbadf5b23f58cd0df0dbd71c5.jpeg",
						"width": 2396
					},
					{
						"addedAt": 1757946091263,
						"groupId": "group-1757396353003",
						"height": 2199,
						"id": "emoji-1757946091263-6oxcj0",
						"name": "GywB7K6acAQCSCv",
						"packet": 1757946091263,
						"url": "https://linux.do/uploads/default/original/4X/d/e/c/decfc40ca823d4462eed9b886a5fc5221d00af2e.jpeg",
						"width": 4096
					},
					{
						"addedAt": 1757945915400,
						"groupId": "group-1757396353003",
						"height": 4092,
						"id": "emoji-1757945915400-3y3q25",
						"name": "Gza2T_Wa4AAT5-M",
						"packet": 1757945915400,
						"url": "https://linux.do/uploads/default/original/4X/9/d/b/9db57f0e39169a6cf156a55b8f61f34af8616d0c.jpeg",
						"width": 2893
					},
					{
						"addedAt": 1757945902858,
						"groupId": "group-1757396353003",
						"height": 3e3,
						"id": "emoji-1757945902858-djbfle",
						"name": "GzpB4WIaQAAXWkr",
						"packet": 1757945902858,
						"url": "https://linux.do/uploads/default/original/4X/b/1/8/b1843c01a51f18a05292075d5f76f5b340f45551.jpeg",
						"width": 3e3
					},
					{
						"addedAt": 1757945871180,
						"groupId": "group-1757396353003",
						"height": 2690,
						"id": "emoji-1757945871180-zkscl2",
						"name": "Gz7ajHzbYAAOIbL",
						"packet": 1757945871180,
						"url": "https://linux.do/uploads/default/original/4X/f/1/6/f16ca5958e626cacf8a30f4ab23f35d2b5acc569.jpeg",
						"width": 2207
					},
					{
						"addedAt": 1757945856553,
						"groupId": "group-1757396353003",
						"height": 900,
						"id": "emoji-1757945856553-ab5wen",
						"name": "G0F8UbYa4AAsjFv",
						"packet": 1757945856553,
						"url": "https://linux.do/uploads/default/original/4X/5/7/f/57fc3fdd701202f85b2d106ffadc290d910e94f8.jpeg",
						"width": 1200
					},
					{
						"addedAt": 1757945850230,
						"groupId": "group-1757396353003",
						"height": 4096,
						"id": "emoji-1757945850230-7avwg1",
						"name": "GzxPOjVbIAACJCd",
						"packet": 1757945850230,
						"url": "https://linux.do/uploads/default/original/4X/e/4/a/e4a870f791f753e5c18232b1b6ba2987f0eb3d8a.jpeg",
						"width": 2896
					},
					{
						"addedAt": 1757945847125,
						"groupId": "group-1757396353003",
						"height": 2e3,
						"id": "emoji-1757945847125-6ld3fd",
						"name": "G0QM21FbgAA1Uws",
						"packet": 1757945847125,
						"url": "https://linux.do/uploads/default/original/4X/6/d/c/6dc4fbad1a59b74121c297fe32f20f072b54c6fc.jpeg",
						"width": 2e3
					},
					{
						"addedAt": 1757945829023,
						"groupId": "group-1757396353003",
						"height": 1e3,
						"id": "emoji-1757945829023-ekchce",
						"name": "G0ZLkYzbgAIa99u",
						"packet": 1757945829023,
						"url": "https://linux.do/uploads/default/original/4X/7/0/1/701883e138be37cbef118d74368bd86eeb2ee40a.jpeg",
						"width": 1500
					},
					{
						"addedAt": 1757945825919,
						"groupId": "group-1757396353003",
						"height": 1810,
						"id": "emoji-1757945825919-1gt9rx",
						"name": "G0aPAzxbgAgUO7L",
						"packet": 1757945825919,
						"url": "https://linux.do/uploads/default/original/4X/0/3/a/03ae330cd5ce5d88cae0d5dab864bfd3f47225df.jpeg",
						"width": 1284
					},
					{
						"addedAt": 1758184536161,
						"groupId": "group-1757396353003",
						"height": 1200,
						"id": "emoji-1758200985152-zi3gr0",
						"name": "debian",
						"packet": 1758184536161,
						"url": "https://linux.do/uploads/default/original/4X/c/6/6/c6630daad1fcc0fe6a46849a293216a65e628d52.png",
						"width": 695
					},
					{
						"addedAt": 1758720625213,
						"groupId": "group-1757396353003",
						"id": "emoji-1758720625213-7hk71n",
						"name": "image",
						"packet": 1758720625213,
						"url": "https://linux.do/uploads/default/original/4X/e/8/a/e8a3d9be73a421ff7fd6650e4025c46e031b0454.jpeg",
						"width": 1768,
						"height": 3840
					},
					{
						"addedAt": 1758702502460,
						"groupId": "group-1757396353003",
						"id": "emoji-1758702502460-d1gm1l",
						"name": "image",
						"packet": 1758702502460,
						"url": "https://linux.do/uploads/default/original/4X/2/a/3/2a343c47d1907ade4b5d3e0401022a27e525489b.jpeg",
						"width": 1920,
						"height": 2685
					},
					{
						"addedAt": 1758766944071,
						"groupId": "group-1757396353003",
						"id": "emoji-1758766944071-lfqymq",
						"name": "image",
						"packet": 1758766944071,
						"url": "https://linux.do/uploads/default/original/4X/8/2/2/8229abdbf378cbc0618322bfff34d2b0aeebdaf0.jpeg",
						"width": 1e3,
						"height": 798
					},
					{
						"addedAt": 1758732337948,
						"groupId": "group-1757396353003",
						"id": "emoji-1758732337948-dpxmpq",
						"name": "image",
						"packet": 1758732337948,
						"url": "https://linux.do/uploads/default/original/4X/3/3/f/33f1fa02acbe9094d8119913b4ebfbd8f3cdce0c.jpeg",
						"width": 896,
						"height": 1152
					},
					{
						"id": "emoji-1758804190819-oexvm7",
						"packet": 1758804190819,
						"name": "GzxPOjVbIAACJCd",
						"url": "https://linux.do/uploads/default/original/4X/6/b/a/6ba7e6a387f3d9a6d96058a064d7a86e267a9219.jpeg",
						"groupId": "group-1757396353003",
						"addedAt": 1758804190819,
						"width": 1920,
						"height": 2716
					},
					{
						"id": "emoji-1758804185224-5dbcqr",
						"packet": 1758804185224,
						"name": "G0QM21FbgAA1Uws",
						"url": "https://linux.do/uploads/default/original/4X/8/f/8/8f8de44a2a8ebd04033feffcb8acb18018bdec04.jpeg",
						"groupId": "group-1757396353003",
						"addedAt": 1758804185224,
						"width": 1920,
						"height": 1920
					},
					{
						"id": "emoji-1758804179097-qh2opl",
						"packet": 1758804179097,
						"name": "G0NiOOKbUAA-POo",
						"url": "https://linux.do/uploads/default/original/4X/2/8/b/28b09099eb4d4b6ea418770ce402ef79a2e8641c.jpeg",
						"groupId": "group-1757396353003",
						"addedAt": 1758804179097,
						"width": 1920,
						"height": 1667
					},
					{
						"id": "emoji-1758804173694-9cikv9",
						"packet": 1758804173694,
						"name": "G0bOHLoWgAAybUF",
						"url": "https://linux.do/uploads/default/original/4X/8/0/7/80783347e2f3f9c17be7f04c2919f375bbadf758.jpeg",
						"groupId": "group-1757396353003",
						"addedAt": 1758804173694,
						"width": 1920,
						"height": 1920
					},
					{
						"id": "emoji-1758804169237-4r94vu",
						"packet": 1758804169237,
						"name": "G0ZLkYzbgAIa99u",
						"url": "https://linux.do/uploads/default/original/4X/d/3/6/d3652474252d97debce57b98b5f08a06fa065a34.jpeg",
						"groupId": "group-1757396353003",
						"addedAt": 1758804169237,
						"width": 1500,
						"height": 1e3
					},
					{
						"id": "emoji-1758804159013-qqx7i9",
						"packet": 1758804159013,
						"name": "G0vKTqqbcAkRwD1",
						"url": "https://linux.do/uploads/default/original/4X/4/1/5/415a89a21db2db6cf77eb5953ba88909c31700f7.jpeg",
						"groupId": "group-1757396353003",
						"addedAt": 1758804159013,
						"width": 1448,
						"height": 2048
					},
					{
						"packet": 1759064547098,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/4/1/5/415a89a21db2db6cf77eb5953ba88909c31700f7.jpeg",
						"id": "emoji-1759064547099-ad6ajs",
						"groupId": "group-1757396353003",
						"width": 1448,
						"height": 2048
					},
					{
						"packet": 1759064547099,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/6/b/a/6ba7e6a387f3d9a6d96058a064d7a86e267a9219.jpeg",
						"id": "emoji-1759064547099-4eijha",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 2716
					},
					{
						"packet": 1759064547099,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/f/4/f/f4f460c733514978151f8eb3b51116a00e59acfa.jpeg",
						"id": "emoji-1759064547099-iyvkqr",
						"groupId": "group-1757396353003",
						"width": 1284,
						"height": 1810
					},
					{
						"packet": 1759064547099,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/4/9/549d65da98ea8529cb67dab369a53496d7fd52af.jpeg",
						"id": "emoji-1759064547099-t5jr81",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 3072
					},
					{
						"packet": 1759064547099,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/b/7/e/b7e9b380fafa6b9dde612c27b20ff615eb09c0da.jpeg",
						"id": "emoji-1759064547099-7itdcu",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 1e3
					},
					{
						"packet": 1759064547099,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/9/f/1/9f1293baa94b3d13e1997e4066d73e7cc67a6d8d.jpeg",
						"id": "emoji-1759064547099-945g0i",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1227
					},
					{
						"packet": 1759064547099,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/f/8/a/f8a7baac3e38f9d5d447732c45bdcb08851fa449.jpeg",
						"id": "emoji-1759064547099-jmgx2d",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 2502
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/2/7/f/27fadf26c016883479f29daff6a40eed603c784a.jpeg",
						"id": "emoji-1759064547100-j9aqo0",
						"groupId": "group-1757396353003",
						"width": 1500,
						"height": 2e3
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/a/8/1/a8128be9153ed912a8fcdc71863bf1423bd6eebd.jpeg",
						"id": "emoji-1759064547100-ejjmrc",
						"groupId": "group-1757396353003",
						"width": 731,
						"height": 770
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/c/0/6/c0693bfa09e4b47b21467f1fd09b9e760f956bb1.jpeg",
						"id": "emoji-1759064547100-sdv0ww",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/a/e/c/aec0fd55d12ddb8270ecdb3a2189c10f6d294c51.jpeg",
						"id": "emoji-1759064547100-r3vxyv",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/c/9/5c9c68fda5fba4979a815dff2f62f0237c327426.jpeg",
						"id": "emoji-1759064547100-kzcemp",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1551
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/0/d/a/0da540461ff71a79022320af0eab3cca387396d7.jpeg",
						"id": "emoji-1759064547100-zt9qp3",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1922
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/d/e/6/de65b9bcefea6daf62146f8d53b99f82e33b3a17.jpeg",
						"id": "emoji-1759064547100-mgp8w4",
						"groupId": "group-1757396353003",
						"width": 1422,
						"height": 2191
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/a/9/5/a9557d8ead8a114f47a58d8715b9113542c036be.jpeg",
						"id": "emoji-1759064547100-55jdgl",
						"groupId": "group-1757396353003",
						"width": 1013,
						"height": 768
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/e/0/3/e03246b6e747af9fc70f0da30710af1531eb9778.jpeg",
						"id": "emoji-1759064547100-2mtu59",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 2560
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/e/1/7/e1781e0d4e208f649665eeb8cb78653efd210154.jpeg",
						"id": "emoji-1759064547100-8h3h6c",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 2305
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/d/3/6/d3652474252d97debce57b98b5f08a06fa065a34.jpeg",
						"id": "emoji-1759064547100-w7v0yn",
						"groupId": "group-1757396353003",
						"width": 1500,
						"height": 1e3
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/2/8/b/28b09099eb4d4b6ea418770ce402ef79a2e8641c.jpeg",
						"id": "emoji-1759064547100-58lpol",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1667
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/f/3/5f3d2077b6220f45ab860c86382d30833f272909.jpeg",
						"id": "emoji-1759064547100-0vvjy6",
						"groupId": "group-1757396353003",
						"width": 1500,
						"height": 1500
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/c/6/7/c6783b78f9b6a9d3486965b2fc5e3fad096b6c19.jpeg",
						"id": "emoji-1759064547100-jtd2oi",
						"groupId": "group-1757396353003",
						"width": 1200,
						"height": 1200
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/3/2/8/328e2bc2f32bac4c6955a236c22d9168f6228099.jpeg",
						"id": "emoji-1759064547100-olqpqq",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/c/a/c/cacd6bc6ec89ea576f5082c9170e41c1972b5c4c.jpeg",
						"id": "emoji-1759064547100-2ncpm9",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/0/a/5/0a5a521b47b037d60ae60ff22618768c8ec385be.jpeg",
						"id": "emoji-1759064547100-2a6xoe",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 1e3
					},
					{
						"packet": 1759064547100,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/f/2/2/f226d1452a5d606424a35c16e7b8a757bbc5e8b8.jpeg",
						"id": "emoji-1759064547100-e30b6t",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/e/1/3/e13cb82fe75c0138dedb6e6d96efa5e415804fbf.jpeg",
						"id": "emoji-1759064547101-qzsfnh",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/c/0/5c0bbfb001d1693f913098ababaaf652e514c785.jpeg",
						"id": "emoji-1759064547101-n52am1",
						"groupId": "group-1757396353003",
						"width": 1500,
						"height": 2e3
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/0/2/c/02cbfca43ea4fa849dea35205911d5fca25ace28.jpeg",
						"id": "emoji-1759064547101-et93yk",
						"groupId": "group-1757396353003",
						"width": 1536,
						"height": 2048
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/f/e/5fe61f5b5b8bca175edf9e99d77efa0476f404dc.jpeg",
						"id": "emoji-1759064547101-x5wel5",
						"groupId": "group-1757396353003",
						"width": 1832,
						"height": 2044
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/f/e/b/feb6010e481a820ac5f0c8967ec825b49f1d6607.jpeg",
						"id": "emoji-1759064547101-0vq62v",
						"groupId": "group-1757396353003",
						"width": 1502,
						"height": 2048
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/a/7/7/a778630d7df5a29e76f8d83f85917dbd5f6728c8.jpeg",
						"id": "emoji-1759064547101-bu011j",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 2381
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/4/4/8/448f31f73c1e9c0e91d8ded637588397a1f60b08.jpeg",
						"id": "emoji-1759064547101-hnw0j9",
						"groupId": "group-1757396353003",
						"width": 900,
						"height": 900
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/3/2/8/328e2bc2f32bac4c6955a236c22d9168f6228099.jpeg",
						"id": "emoji-1759064547101-v5f0eb",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/e/2/5/e2561823bf770738440bfd41aa4ae7dc415ca348.jpeg",
						"id": "emoji-1759064547101-92d1ff",
						"groupId": "group-1757396353003",
						"width": 1401,
						"height": 2048
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/d/2/e/d2e2587b93029dc72d3eafb3cb90df44debeab7a.jpeg",
						"id": "emoji-1759064547101-qbtqal",
						"groupId": "group-1757396353003",
						"width": 1300,
						"height": 1430
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/8/0/7/80783347e2f3f9c17be7f04c2919f375bbadf758.jpeg",
						"id": "emoji-1759064547101-0oubb8",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/8/f/8/8f8de44a2a8ebd04033feffcb8acb18018bdec04.jpeg",
						"id": "emoji-1759064547101-32hdff",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/7/0/f/70f4592ae9949ea9057e955ad89c0f4156b1b969.jpeg",
						"id": "emoji-1759064547101-xi8fl4",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/8/2/2/8229abdbf378cbc0618322bfff34d2b0aeebdaf0.jpeg",
						"id": "emoji-1759064547101-rp4xzr",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 798
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/3/2/8/328e2bc2f32bac4c6955a236c22d9168f6228099.jpeg",
						"id": "emoji-1759064547101-gipvsj",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/b/4/e/b4e21764635dfdd5e0ce9c8ef79311db2c9e00de.jpeg",
						"id": "emoji-1759064547101-e22kwj",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 1e3
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/a/3/5a30d5fde616c94fdcf5acd8f754b56f592baa66.jpeg",
						"id": "emoji-1759064547101-znjokw",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 1e3
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/7/e/f/7ef4e522832669c352775123d1ed1e40ef6729cc.jpeg",
						"id": "emoji-1759064547101-fsn5l6",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 1e3
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/a/b/5ab92eeb36a46bab2d565bf38dee7f07fc861d17.jpeg",
						"id": "emoji-1759064547101-ai4a29",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 1e3
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/b/5/e/b5ee2bb1dc9cacb90fc8a5fa9f3f9df8b0ea169c.jpeg",
						"id": "emoji-1759064547101-nsxn4c",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/8/d/0/8d0a18b29e092433387eb0b7939730745e7cb8b1.jpeg",
						"id": "emoji-1759064547101-vaabru",
						"groupId": "group-1757396353003",
						"width": 1200,
						"height": 676
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/6/c/3/6c3ef8e2548fc2b9ec6f49d71ba91246b9efd288.jpeg",
						"id": "emoji-1759064547101-brwbuo",
						"groupId": "group-1757396353003",
						"width": 1161,
						"height": 1196
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/e/8/b/e8bca76977ffc20d153ea348ea8917fe6a2d2cdf.jpeg",
						"id": "emoji-1759064547101-x5mh18",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/f/e/b/feb6010e481a820ac5f0c8967ec825b49f1d6607.jpeg",
						"id": "emoji-1759064547101-qymm00",
						"groupId": "group-1757396353003",
						"width": 1502,
						"height": 2048
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/6/9/f/69feeafc5a339441f3f90d28ce630c0ff44a110d.jpeg",
						"id": "emoji-1759064547101-64z940",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 2041
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/9/2/5/925a513aee6cb7b4fddaecd313a252c4572f6fc8.jpeg",
						"id": "emoji-1759064547101-e03snp",
						"groupId": "group-1757396353003",
						"width": 1200,
						"height": 1200
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/3/d/a/3da13661a0615e64e066cd412273391265900cd3.jpeg",
						"id": "emoji-1759064547101-tcgtsc",
						"groupId": "group-1757396353003",
						"width": 1113,
						"height": 1161
					},
					{
						"packet": 1759064547101,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/5/a/b/5ab92eeb36a46bab2d565bf38dee7f07fc861d17.jpeg",
						"id": "emoji-1759064547101-fhsjwx",
						"groupId": "group-1757396353003",
						"width": 1e3,
						"height": 1e3
					},
					{
						"packet": 1759064547102,
						"name": "image",
						"url": "https://linux.do/uploads/default/original/4X/b/5/a/b5a05bc0aec57cda538e1501101230ea8358513c.jpeg",
						"id": "emoji-1759064547102-zuta2h",
						"groupId": "group-1757396353003",
						"width": 1920,
						"height": 1920
					}
				],
				"icon": "X",
				"id": "group-1757396353003",
				"name": "X",
				"order": 22
			},
			{
				"emojis": [],
				"icon": "📦",
				"id": "ungrouped",
				"name": "未分组",
				"order": 23
			},
			{
				"emojis": [
					{
						"addedAt": 1757943242327,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943242327-cua6wt",
						"name": "d599495e7839db0239fe6ea845a5082c439295805",
						"packet": 1757943242327,
						"url": "https://linux.do/uploads/default/original/4X/0/4/d/04df8428b38493adbe432fe8d37775f46781c39b.gif",
						"width": 500
					},
					{
						"addedAt": 1757943241206,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943241206-728n3a",
						"name": "6b98219d255ccf333099c010586da470439295805",
						"packet": 1757943241206,
						"url": "https://linux.do/uploads/default/original/4X/7/2/0/72087f284ab14a9db947b99506c4446fcb481a7f.gif",
						"width": 500
					},
					{
						"addedAt": 1757943240002,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943240002-jpwj3s",
						"name": "8ef3e26d4a3dc4a2ac7792e74079f7a3439295805",
						"packet": 1757943240002,
						"url": "https://linux.do/uploads/default/original/4X/8/7/a/87a54d52fb3aede74bd1f54709ed33083b4e6cfe.gif",
						"width": 500
					},
					{
						"addedAt": 1757943238786,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943238786-xx4vnm",
						"name": "66af1bcd086aebe414d251fb96c27c22439295805",
						"packet": 1757943238786,
						"url": "https://linux.do/uploads/default/original/4X/c/f/7/cf7bded88cbc91064e2aac969c51c34354c42005.gif",
						"width": 500
					},
					{
						"addedAt": 1757943237776,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943237776-e9ucky",
						"name": "7093ebe56ae1b56dc7f702ddfaec9e4c439295805",
						"packet": 1757943237776,
						"url": "https://linux.do/uploads/default/original/4X/4/8/2/4829310b52912972c750d8279eeaecc373446b53.gif",
						"width": 500
					},
					{
						"addedAt": 1757943236878,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943236878-w4ivpz",
						"name": "4c2d597a30931e3b466ec1cdede473c8439295805",
						"packet": 1757943236878,
						"url": "https://linux.do/uploads/default/original/4X/7/d/d/7dd42cfe3d7d89f0f6bed9c2f2d4496dbcfb782a.gif",
						"width": 500
					},
					{
						"addedAt": 1757943236003,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943236003-x30r7a",
						"name": "ebbb01d1d30d98cdf82dc994f7f92e25439295805",
						"packet": 1757943236003,
						"url": "https://linux.do/uploads/default/original/4X/e/9/0/e907ef97df20e70339d5a46ff9988f3d8c81d3ff.gif",
						"width": 500
					},
					{
						"addedAt": 1757943234927,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943234927-y7jkzq",
						"name": "91cd60455b2e642b2af5c2789c1e1f7f439295805",
						"packet": 1757943234927,
						"url": "https://linux.do/uploads/default/original/4X/6/7/c/67c18b1a94f58ce10957b93889334a366104e010.gif",
						"width": 500
					},
					{
						"addedAt": 1757943232434,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943232434-d05pyd",
						"name": "2e713693e1fbceb3abb86c8cf9b483c6439295805",
						"packet": 1757943232434,
						"url": "https://linux.do/uploads/default/original/4X/a/b/9/ab905e1c1a639bba26b40c1572d25b731e3a96c8.gif",
						"width": 500
					},
					{
						"addedAt": 1757943231349,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943231349-n14xm4",
						"name": "19d5644a88bcb0d9ce1b1dda2241b1be439295805",
						"packet": 1757943231349,
						"url": "https://linux.do/uploads/default/original/4X/5/f/b/5fb879641a5afcb9c7c4aa9184180700548b75c9.gif",
						"width": 500
					},
					{
						"addedAt": 1757943230044,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943230044-twybji",
						"name": "7faea9c687f7e80e2c5e7326a309a3f9439295805",
						"packet": 1757943230044,
						"url": "https://linux.do/uploads/default/original/4X/7/8/9/7899403ee5795170f50980a01153d72ef81a0a4d.gif",
						"width": 500
					},
					{
						"addedAt": 1757943229051,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943229051-9be6au",
						"name": "ff4a63be88461dfe7f6eed1405118371439295805",
						"packet": 1757943229051,
						"url": "https://linux.do/uploads/default/original/4X/a/f/1/af1842fe24100aeddb0b5dece37af07194e5d565.gif",
						"width": 500
					},
					{
						"addedAt": 1757943227751,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943227751-72paog",
						"name": "ec696d1ccb8a44e2f2850f3571d6b80a439295805",
						"packet": 1757943227751,
						"url": "https://linux.do/uploads/default/original/4X/2/e/1/2e10a17cab866d68c6e8eb7220db7d6e0585bc37.gif",
						"width": 500
					},
					{
						"addedAt": 1757943226650,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943226650-alqq9v",
						"name": "1680555aa29143ebdb77ca645e4a3e8a439295805",
						"packet": 1757943226650,
						"url": "https://linux.do/uploads/default/original/4X/c/b/c/cbc319a1b8f662571d066e4c1ce56e631a2e986c.gif",
						"width": 500
					},
					{
						"addedAt": 1757943225428,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943225428-n62res",
						"name": "e0f3211e49a801d85fe4948f8d638aaa439295805",
						"packet": 1757943225428,
						"url": "https://linux.do/uploads/default/original/4X/2/d/2/2d2119bd282a9f00660ce731f2711595493b1162.gif",
						"width": 500
					},
					{
						"addedAt": 1757943182762,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943182762-pn7ypn",
						"name": "08e8e309dc707109a74fd5090014ef81439295805",
						"packet": 1757943182762,
						"url": "https://linux.do/uploads/default/original/4X/e/a/a/eaa78ad080b6a4f6527c098bbd90a6b5ad65f555.gif",
						"width": 500
					},
					{
						"addedAt": 1757943181562,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943181562-0nsgfs",
						"name": "5dc33941f468cdb213cb9ffc0db10a4f439295805",
						"packet": 1757943181562,
						"url": "https://linux.do/uploads/default/original/4X/0/4/7/0472d55573e702f5fe79b771d2d937ed95131b02.gif",
						"width": 500
					},
					{
						"addedAt": 1757943180564,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943180564-mxlsb9",
						"name": "4ebc2b893127bd9b4028d45bf2cab26f439295805",
						"packet": 1757943180564,
						"url": "https://linux.do/uploads/default/original/4X/9/5/e/95e1fb112aeafe3934a038cb3882527789692a44.gif",
						"width": 500
					},
					{
						"addedAt": 1757943179610,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943179610-yozxnu",
						"name": "42f50f81a430128dfc1c42d622e96c60439295805",
						"packet": 1757943179610,
						"url": "https://linux.do/uploads/default/original/4X/b/c/e/bce4ef0411f646c43ef08aefa3f1dafa59d8f503.gif",
						"width": 500
					},
					{
						"addedAt": 1757943177145,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943177145-u7pal9",
						"name": "893ed546db9070b148244653d48fcd91439295805",
						"packet": 1757943177145,
						"url": "https://linux.do/uploads/default/original/4X/c/a/c/cacd310295e8c257220938d1f65a617dce9eb8cc.gif",
						"width": 500
					},
					{
						"addedAt": 1757943175939,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943175939-yikoku",
						"name": "661fbec36e68c6dff0e3be5a8700ddb2439295805",
						"packet": 1757943175939,
						"url": "https://linux.do/uploads/default/original/4X/6/c/5/6c5d984c28f82bb0a8d10ca7061c36bcad9cd50f.gif",
						"width": 500
					},
					{
						"addedAt": 1757943174943,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943174943-fvg4o7",
						"name": "6d9ca5de8b7e53b88919cead546ef5a4439295805",
						"packet": 1757943174943,
						"url": "https://linux.do/uploads/default/original/4X/1/1/2/112ea5f66d465f3f3acaec5ab2734f2ce1845f86.gif",
						"width": 500
					},
					{
						"addedAt": 1757943173775,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943173775-uj3syk",
						"name": "b4014e44efae6c13490f51ffbeb159d6439295805",
						"packet": 1757943173775,
						"url": "https://linux.do/uploads/default/original/4X/f/8/e/f8e57f574dbc50d04a69b4b5f2ef622ecc94b000.gif",
						"width": 500
					},
					{
						"addedAt": 1757943172618,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943172618-g87xeo",
						"name": "82a30dbdb4eec69b02c3cc6eae3d32d1439295805",
						"packet": 1757943172618,
						"url": "https://linux.do/uploads/default/original/4X/3/8/0/380bc2e91e7f40534e1bc3b354d83d25aa824692.gif",
						"width": 500
					},
					{
						"addedAt": 1757943171516,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943171516-hwyuuv",
						"name": "58503081b0adb808fd796163cca6daa4439295805",
						"packet": 1757943171516,
						"url": "https://linux.do/uploads/default/original/4X/a/e/f/aefc331e525249f6ba78d6e2561c423be7e4f651.gif",
						"width": 500
					},
					{
						"addedAt": 1757943169136,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943169136-4uu8o4",
						"name": "88f783ad6fc22430a2402d59b6880bcc439295805",
						"packet": 1757943169136,
						"url": "https://linux.do/uploads/default/original/4X/8/7/e/87e9c2fdd5353223813e76bcce4f141c85455826.gif",
						"width": 500
					},
					{
						"addedAt": 1757943168105,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943168105-6ohh8u",
						"name": "dd6e8331755fbc476f386c6f4b80a3d8439295805",
						"packet": 1757943168105,
						"url": "https://linux.do/uploads/default/original/4X/8/3/9/839394f59b9a08b00404cc8e8bb2debb598c98dc.gif",
						"width": 500
					},
					{
						"addedAt": 1757943167131,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943167131-k5rwma",
						"name": "187112bda1a2efc676b3fe15aec2f818439295805",
						"packet": 1757943167131,
						"url": "https://linux.do/uploads/default/original/4X/4/6/7/46761f242a5ab5fa6dd504d6a394b3d92400e6c0.gif",
						"width": 500
					},
					{
						"addedAt": 1757943166189,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943166189-8cdw8i",
						"name": "ac85da5898b6b07051d69496cc65d191439295805",
						"packet": 1757943166189,
						"url": "https://linux.do/uploads/default/original/4X/4/1/e/41e447c97b5094fecb33a10a8e33bf77ec519105.gif",
						"width": 500
					},
					{
						"addedAt": 1757943165050,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943165050-4bl31e",
						"name": "deb4723d8a965611d246c8dd41434d0d439295805",
						"packet": 1757943165050,
						"url": "https://linux.do/uploads/default/original/4X/f/d/9/fd97762e83fedfb692f3e88ec8e48ddb37134362.gif",
						"width": 500
					},
					{
						"addedAt": 1757943163859,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943163859-vn8fje",
						"name": "208762137b45abeb206ddbe239babd14439295805",
						"packet": 1757943163859,
						"url": "https://linux.do/uploads/default/original/4X/4/1/8/41817382bb685c6fe6e3cfff4b0842bb42789edb.gif",
						"width": 500
					},
					{
						"addedAt": 1757943162815,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943162815-xbxjwm",
						"name": "3b22dd0380e073f818a052b5d09b7c41439295805",
						"packet": 1757943162815,
						"url": "https://linux.do/uploads/default/original/4X/8/d/7/8d7dff36ff90c048f5c235e77f51b3ae6cea2c77.gif",
						"width": 500
					},
					{
						"addedAt": 1757943161497,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943161497-hk65i6",
						"name": "e50fc92d8c467b4d9d249018d2deb820439295805",
						"packet": 1757943161497,
						"url": "https://linux.do/uploads/default/original/4X/d/d/7/dd76f2e8c422fa2c57b45b42bf179af43ab25dfe.gif",
						"width": 500
					},
					{
						"addedAt": 1757943160226,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943160226-7m0yp1",
						"name": "fa8065173e8b61f1f73674ab717acbb2439295805",
						"packet": 1757943160226,
						"url": "https://linux.do/uploads/default/original/4X/d/d/1/dd1d66e4ab55e5710653458e71a2142a62d2ff1e.gif",
						"width": 500
					},
					{
						"addedAt": 1757943158990,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943158990-hhkdgv",
						"name": "d757507c0ec4a0bb6ef39429f291acab439295805",
						"packet": 1757943158990,
						"url": "https://linux.do/uploads/default/original/4X/2/f/e/2fe3d63685cc3145cd218e248151ef81c9caeefa.gif",
						"width": 500
					},
					{
						"addedAt": 1757943157663,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943157663-zmaj53",
						"name": "1db104453bcfaa7aee2429d99ec180c1439295805",
						"packet": 1757943157663,
						"url": "https://linux.do/uploads/default/original/4X/1/4/1/14152e698eed0835b4cf3c40d5f238d3314bd0b9.gif",
						"width": 500
					},
					{
						"addedAt": 1757943147884,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943147884-kr88bo",
						"name": "193d8a8f7bb4b5e839812cdb03a1c2a3439295805",
						"packet": 1757943147884,
						"url": "https://linux.do/uploads/default/original/4X/2/3/c/23c66d74a8c4db1201be593c17351ba1639f3339.gif",
						"width": 500
					},
					{
						"addedAt": 1757943146474,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943146474-jtznfp",
						"name": "4f9fc2133ca416f57e3cc653462a1d15439295805",
						"packet": 1757943146474,
						"url": "https://linux.do/uploads/default/original/4X/6/5/3/653c653e45815cd4c67643b2eef6aac46067cae3.gif",
						"width": 500
					},
					{
						"addedAt": 1757943071348,
						"groupId": "group-1757943767539",
						"height": 500,
						"id": "emoji-1757943071348-hfioto",
						"name": "0612bdb1435d79e95af961be870a6d6d439295805",
						"packet": 1757943071348,
						"url": "https://linux.do/uploads/default/original/4X/2/6/e/26eab111d4836dcfaac49cef0bda2a991bf8f849.gif",
						"width": 500
					}
				],
				"icon": "T",
				"id": "group-1757943767539",
				"name": "永雏塔菲",
				"order": 24
			},
			{
				"emojis": [
					{
						"groupId": "group-1758072938224",
						"height": 309,
						"id": "emoji-1758072966139-z8rhiy",
						"name": "1",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/e/2/d/e2d0303b6833d8df9097e30001f47e4c56c5e7e2.png",
						"width": 323
					},
					{
						"groupId": "group-1758072938224",
						"height": 829,
						"id": "emoji-1758072966139-umxgnv",
						"name": "2",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/5/b/9/5b981155e834eb266354fa96fdf878dd67939acf.png",
						"width": 859
					},
					{
						"groupId": "group-1758072938224",
						"height": 538,
						"id": "emoji-1758072966139-cnxcqh",
						"name": "3",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/d/a/0/da00d6ade01caf61e5542554a0fbe84b76087e69.png",
						"width": 632
					},
					{
						"groupId": "group-1758072938224",
						"height": 592,
						"id": "emoji-1758072966139-473a6e",
						"name": "4",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/1/0/d/10de764345235903632bbe79d479948d0b6a57a2.png",
						"width": 655
					},
					{
						"groupId": "group-1758072938224",
						"height": 196,
						"id": "emoji-1758072966139-u14i84",
						"name": "5",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/2/b/f/2bf2cb58c8ea5a7b1e23a3a8310996716573bac9.png",
						"width": 222
					},
					{
						"groupId": "group-1758072938224",
						"height": 520,
						"id": "emoji-1758072966139-cyyzi2",
						"name": "6",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/5/6/0/560d3a7672b1a42018608c8eed80a295f31dea25.png",
						"width": 542
					},
					{
						"groupId": "group-1758072938224",
						"height": 206,
						"id": "emoji-1758072966139-7wjlgq",
						"name": "8",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/5/1/1/511440a357cb6805d52bd0b2f0299e74d60308e7.png",
						"width": 209
					},
					{
						"groupId": "group-1758072938224",
						"height": 277,
						"id": "emoji-1758072966139-v0foo4",
						"name": "10",
						"packet": 1758072966139,
						"url": "https://linux.do/uploads/default/original/4X/6/6/4/66424c4c03a9dcdb8597a688782fc6a968be40f5.png",
						"width": 278
					},
					{
						"groupId": "group-1758072938224",
						"height": 147,
						"id": "emoji-1758072966140-ydba11",
						"name": "12",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/4/e/0/4e03df0ab7ba776923709469aac35dc5d9f7b286.png",
						"width": 161
					},
					{
						"groupId": "group-1758072938224",
						"height": 541,
						"id": "emoji-1758072966140-8y18y1",
						"name": "14",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/4/2/7/427836f5a0d4457965d1d5113b3ccfcff8c65097.png",
						"width": 577
					},
					{
						"groupId": "group-1758072938224",
						"height": 469,
						"id": "emoji-1758072966140-8ihxlz",
						"name": "11",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/a/1/c/a1cfecfe67b4a2cec36bef0d11f0ffa0c60761a0.png",
						"width": 455
					},
					{
						"groupId": "group-1758072938224",
						"height": 242,
						"id": "emoji-1758072966140-azzhvu",
						"name": "13",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/4/4/d/44d1388671d69f3c6c24fb8d43b072b022d57436.png",
						"width": 242
					},
					{
						"groupId": "group-1758072938224",
						"height": 410,
						"id": "emoji-1758072966140-60yqm2",
						"name": "15",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/1/0/f/10f90dfce3f108db170349c70cbaeb0bda457d74.png",
						"width": 414
					},
					{
						"groupId": "group-1758072938224",
						"height": 623,
						"id": "emoji-1758072966140-8twqd8",
						"name": "17",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/9/0/3/9039be6d8c0f4d4fcf8a34d9e39d4ed7eaa7e618.png",
						"width": 627
					},
					{
						"groupId": "group-1758072938224",
						"height": 526,
						"id": "emoji-1758072966140-88ttx3",
						"name": "19",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/c/c/d/ccd2777a7b79099edc450f97ea313daccbf0c0d6.png",
						"width": 543
					},
					{
						"groupId": "group-1758072938224",
						"height": 489,
						"id": "emoji-1758072966140-5e0bm5",
						"name": "16",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/b/1/e/b1e3e10b8c435aea843675125bd4f74758de94c5.png",
						"width": 480
					},
					{
						"groupId": "group-1758072938224",
						"height": 488,
						"id": "emoji-1758072966140-bkycj9",
						"name": "18",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/9/e/5/9e532d4ac79b4c8bd87a64764560287b8b68820f.png",
						"width": 464
					},
					{
						"groupId": "group-1758072938224",
						"height": 619,
						"id": "emoji-1758072966140-kcqhu8",
						"name": "20",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/d/a/f/dafd91a0b80d401105f3472dabf8a8ad2ed67552.png",
						"width": 573
					},
					{
						"groupId": "group-1758072938224",
						"height": 652,
						"id": "emoji-1758072966140-j5w5w8",
						"name": "22",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/9/3/d/93d7d84a696e5bffcf581d72be1fafcb1b39794a.png",
						"width": 649
					},
					{
						"groupId": "group-1758072938224",
						"height": 483,
						"id": "emoji-1758072966140-bzzgi6",
						"name": "24",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/3/9/7/397f93f959696549bae0083048b3eee19161c38b.png",
						"width": 460
					},
					{
						"groupId": "group-1758072938224",
						"height": 338,
						"id": "emoji-1758072966140-hazf5v",
						"name": "21",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/f/0/9/f09fb8559decb8a88ef3cdb1440b840dbb3119e2.png",
						"width": 364
					},
					{
						"groupId": "group-1758072938224",
						"height": 501,
						"id": "emoji-1758072966140-7z6j76",
						"name": "23",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/c/0/b/c0b94fc74b024ef30d4de6b16d838791d3dada35.png",
						"width": 468
					},
					{
						"groupId": "group-1758072938224",
						"height": 490,
						"id": "emoji-1758072966140-it1flp",
						"name": "25",
						"packet": 1758072966140,
						"url": "https://linux.do/uploads/default/original/4X/7/9/6/796cab9a39f96c5fe83f57c893d36b51cb6c516c.png",
						"width": 436
					}
				],
				"icon": "📁",
				"id": "group-1758072938224",
				"name": "素晴",
				"order": 25
			},
			{
				"emojis": [
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-ctx24w",
						"name": "AgAD3gkAAlg_OFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/1/b/3/1b342c2f7ab19e979d5f98a53840dd3e20cc7491.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-le0wgf",
						"name": "AgAD5woAAijNOFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/3/8/7/387bdf0e98c243172285077e4e923ffbc460b341.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-oo3g8m",
						"name": "AgADSwoAAg39OFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/f/9/d/f9d6ed14534a1b680645456df936449d94e0d77a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-b4m6aa",
						"name": "AgADtQwAAmiGMVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/e/9/5/e9583895c26de1e273636e53fc4f2dd786d2500f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-anbgub",
						"name": "AgADWQsAAt1mMFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/1/0/f/10f7adbba287f3dbaf88a8f66f5f7a056877b0b6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-syjooe",
						"name": "AgADYQwAAoROOFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/b/5/2/b526c4b33a49139ca5c2e0faf46e54b6aefce8d2.webp",
						"width": 506
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-rpxq5y",
						"name": "AgADYwsAArcCOVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/9/3/4/934d215fa4bbe13cdb59b603be20f661f4871dcd.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-qqz7r6",
						"name": "AgAD5AsAAgEYOVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/3/f/3/3f3ba259a9c64deef583ad1209a1030db7ed3a4f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-e3lasa",
						"name": "AgAD5g4AAiXnOVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/3/7/9/379f23d6ebf37c7197a731958b0c2962478d2dc3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-90838y",
						"name": "AgADEgsAAtcIQFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/e/8/7/e8767d7d5a992a0ec51956297d6d5b40fd8e5283.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-6xip59",
						"name": "AgADJQoAAlYUOFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/4/3/0/430bde0843d326a2e8b94557f2ff73aa9985632d.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-8bdc98",
						"name": "AgADKgwAAlvmMFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/c/3/f/c3fb4e4a997b4f81d1670231e71b3cb07a6a7177.webp",
						"width": 506
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-skkq8z",
						"name": "AgADLQsAApOHOFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/7/7/0/770b41b430e7d90b259db40ac00d6420a63b306c.webp",
						"width": 510
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-80fzzf",
						"name": "AgAD0gsAAnHdUVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/1/2/0/1206fae1eed8cf62dcd6932a298920a9bf8885bc.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-wrlb9i",
						"name": "AgAD3woAAszySVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/5/1/b/51b5bde93be325c9228cb94f88ee3c048d58f94e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-agoy57",
						"name": "AgAD5goAAr_UUVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/3/0/1/301c83944cd2513e194f6200545abeee2fdcffc0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-kaylwn",
						"name": "AgAD7gkAAlfpUFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/1/e/a/1ea2897577f5bf0c3305809d91c345008187938f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-caiu5q",
						"name": "AgADAg8AAtEuSFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/4/c/6/4c67019461780c2dccb3ae2876db0913ae814fc6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-gpdqlf",
						"name": "AgADdwsAAsDsSVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/f/5/0/f507b21bdf1169bad260fcf919fc23a578e8d194.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 511,
						"id": "emoji-1758290089662-48ow8r",
						"name": "AgADHg0AAiL2SFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/8/3/e/83ec4ff533be7c30b69598471b69c79f28646a8e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-iqf4ek",
						"name": "AgAD_woAAiP7UVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/8/2/6/826bc5be24e8f9a8edee04229b1990ed8fa286f8.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-2ah3v5",
						"name": "AgADCQoAAmKmUVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/d/5/c/d5c04cb717427e5e2a38ef2a23086ba6def1586b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-wcju5b",
						"name": "AgADDwwAArI_WVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/8/8/a/88aee49f95508a76fd165889a4360d3ffced08a2.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-73qodl",
						"name": "AgADGwwAAtlmSFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/b/1/8/b1893d2b4b017d225b9e03bbe81505278c858214.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-kkjkj1",
						"name": "AgADNg8AAvcCmFQ.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/1/0/1/101c4c0487c5f70faa26f7917a1e7d8a6a1f57b3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-j0569h",
						"name": "AgADOAwAAq22SFU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/e/9/5/e956bab57660c33c8a99b918b715415ca249e16c.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-84ntfc",
						"name": "AgADVA8AApdnqVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/6/1/0/610d22c8bec8d3d014b98557af987c913c8191d6.webp",
						"width": 511
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-um2n0g",
						"name": "AgADEgsAAkrpoVQ.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/1/5/b/15b3691be18888a59eaf246cab1bf0d10eeca50f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-69f4nv",
						"name": "AgADHA4AAuIPOVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/e/e/b/eebb49936fbe353ad067993999670a8177a23282.webp",
						"width": 512
					},
					{
						"groupId": "group-1758290078442",
						"height": 512,
						"id": "emoji-1758290089662-vcn8en",
						"name": "AgADTgoAAuccUVU.webp",
						"packet": 1758290089662,
						"url": "https://linux.do/uploads/default/original/4X/0/a/9/0a9cd1b01591eaf4d23e2533c5a57449e8b7096e.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1758290078442",
				"name": "9️⃣",
				"order": 26
			},
			{
				"emojis": [
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-4s3wqo",
						"name": "AgAD-hYAAhl9oVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/6/4/0/64011283d3be0eb4e8634dc9151ce44a1718361d.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-z8l950",
						"name": "AgAD-xMAAomJoFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/c/1/f/c1f6b8c57240ba030e4768922860e5493004af06.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-zdh33l",
						"name": "AgAD0hUAAlDZoVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/e/9/b/e9b7032e06c85c787b6d6db68ee9c06833619813.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-dzcp1i",
						"name": "AgAD0xMAAm_7oVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/8/f/4/8f436a831af266f55e0e56106dd3fb3e06485a8b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 487,
						"id": "emoji-1758291036202-obo7u3",
						"name": "AgAD1BUAAtzmmVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/5/7/e/57e70cf012dadc774af0920267d3255e1a88c9e3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-fvr5wd",
						"name": "AgAD1hcAAg-0mVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/4/e/6/4e6a56c8cef166028abf43b5a439355f308356fb.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-08un40",
						"name": "AgAD2BcAAiv3gFY.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/0/d/e/0de3b182c79f0d8ea172d6ac6caea5baed99c210.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-466ntc",
						"name": "AgAD2hIAAipZoVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/4/2/b/42b6045bd24f37482d0c0d6e7bb8f0b4ba67b0cd.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-wwiitw",
						"name": "AgAD3hIAAqaaoFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/b/1/1/b111b115b3ec1f571093cbe542dd0a710a1da3ab.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-vpwjdb",
						"name": "AgAD3RYAAiIoiFY.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/3/2/b/32b130783c0aa5e55f5e26d4ba318998627952a3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-kb5za9",
						"name": "AgAD3x0AAoMOQFc.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/f/8/c/f8c12c73b2f903dad30856d238249af52c190cb4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-5y0yiq",
						"name": "AgAD4BwAAtJnoFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/b/0/7/b0783cdbb7a980c27b8406f2ab4077eda5865cec.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-7oz1yx",
						"name": "AgAD4xYAAiL-mVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/c/9/1/c91a8aacedfa89e4b5becafff7410491182e58c1.webp",
						"width": 481
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-gnrrl3",
						"name": "AgAD5hgAAilXoFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/4/4/d/44d9ecb56aa369de8a37e307e529ba17680d1fcd.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-wr929z",
						"name": "AgAD6RYAAkbEmFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/1/d/1/1d1dc5a555ace96aa68984c1f9f20e4dd57fcca3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-z8o14i",
						"name": "AgAD7RQAAikuoFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/5/1/8/5183fb4d833c09cf519aec4f7f2be15f4c94ad2c.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-uw4tzu",
						"name": "AgAD9BoAAoVzmFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/2/3/5/23547dd403bf8c870274a928ef71d6689cfa4d80.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-60i9on",
						"name": "AgAD9hUAAgjXgVY.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/7/e/7/7e70dc109ab1c2f6f9e4d636a3c65cf8f7562b76.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-4me5l2",
						"name": "AgAD_xkAAip3oFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/8/1/2/812a4f677d26de5f4ba970d39cceca0e010a22f3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-n46srq",
						"name": "AgADAiIAAl88gFY.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/6/2/f/62f3265d78da33b8e5ce71d4f843bf35147b9d37.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-ujci7x",
						"name": "AgADARcAAoUDQFc.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/1/9/b/19b4cd808ed19efff1843ca37869b388b228a499.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-acy0sa",
						"name": "AgADAxkAAlDmmFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/0/4/b/04b0c29bf32e937cf069d53abc2e59ea997fcabc.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036202-db2e85",
						"name": "AgADBBsAAoj7oFQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/b/8/1/b8182d5514b46ec5e398cd9e1e0c16dfa80b50c6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-zu1ra7",
						"name": "AgADBhcAAosNmVQ.webp",
						"packet": 1758291036202,
						"url": "https://linux.do/uploads/default/original/4X/8/c/e/8cef9c503a013bd83d88f26e9f51dc0b2a7b28f9.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-0x5nzw",
						"name": "AgADbRcAAqr7mVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/5/d/b5d5acc90ecedcfce4080de8ac65479815b22fe1.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-subhky",
						"name": "AgADbxgAAi4NqFc.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/d/c/7dc426d5f9b7da8e9870ba33f889e3df7519a3b9.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-hvj6t7",
						"name": "AgADdBQAAuh7oFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/a/1/8/a18fce2102c9c7b9a9ac5621e97488f97c72d2ea.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-663x6l",
						"name": "AgADdBYAAnx0iVY.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/b/6/7b6d07b352b614dd21867ca61620b393be0ef652.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-9c1r12",
						"name": "AgADDhYAAl2lmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/8/5/d/85d7b5fc8c5bd077d106a2c22669ac95c99842da.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-cfangp",
						"name": "AgADDRgAAkgOoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/e/2/be21ecabd1c316af8df89853418a47ec2c20ba13.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-g3vgon",
						"name": "AgADDRgAAvGGoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/6/0/9/6091e3cbf467ffd260abc3eb38cb14c84e2be0eb.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-zwofvn",
						"name": "AgADehMAAmq7oVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/1/d/b1d881774b7cfdac614c1c3f515476749ae716d5.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-yg4tu0",
						"name": "AgADEhwAAnIwoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/2/b/f/2bf74fb0b92406f90e2bbe78a2e3eb781941c3d4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-waq46a",
						"name": "AgADfhUAAiFEoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/e/9/d/e9dd83874e8cd7737a63e31d03c55ec775588ad0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-yq4842",
						"name": "AgADfRoAApzFoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/3/a/b3a55a298afa5ff4a2ebceb8892030a3f85f1517.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-7cyy59",
						"name": "AgADGxMAAneVmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/f/a/3fa77799188ca81c799f96912e02e07c1ba5d498.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-7bzvom",
						"name": "AgADHh8AA-CgVA.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/e/2/c/e2cf309149eaad6fde9971fcc35ac9473acf5740.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-9kmzf5",
						"name": "AgADHhgAAprmoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/2/b/3/2b37758ee9acd17d2ff072dc550632d9864327d3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-e4249c",
						"name": "AgADhRUAAhMnmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/5/9/759de5e897189f8caddc9207297f60dfd191d32e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 354,
						"id": "emoji-1758291036203-fcoebp",
						"name": "AgADhxUAAvoBoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/e/0/b/e0ba65ba0a6c9f3210bd1c97b557d013a599f10e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-ja696z",
						"name": "AgADihwAAn5CoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/1/b/6/1b6c04e9169e81e663d61448e36a99805ff621e6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-ft1aw4",
						"name": "AgADiR8AAnhcmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/8/7/f/87f2c71caccc21d06254bb354b227b817cc42710.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-16xocj",
						"name": "AgADIRYAAk4sYVc.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/d/2/5/d2552bc58014515016283fdde72f6ee418303109.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-cyu77x",
						"name": "AgADjBUAApuXoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/5/4/6/5460610401130ebd9b4be53437beed32283cd49a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-0qsdmc",
						"name": "AgADJxYAAh52oFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/4/d/c/4dc42056a7466140a400be5df9d3129fc831e391.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-3qs4o0",
						"name": "AgADKhcAAhRYmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/1/6/4/164a76498b9e1c1989ae9e577e532894fd52a96a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-yvvqxt",
						"name": "AgADlBgAAkfToFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/a/d/d/add8756d9d6236e6442646d7d980f2dffaf24223.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-fqe9tt",
						"name": "AgADLhUAAuEKoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/8/b/b/8bb0913d6e26f15cd68c73d9b7afb1c2279b12ab.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-umupqd",
						"name": "AgADlRYAAt7loVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/8/f/f/8ff2be2791ab2754d38095b13e06275e9b3f457e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 474,
						"id": "emoji-1758291036203-o6e5au",
						"name": "AgADMxQAAmwkoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/c/1/bc1c890b0be01819d942fea137f0265da21c5ff7.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-yszs1h",
						"name": "AgADnBMAAgsSmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/5/1/1/511d9738d249f11a3c10af4c009325e5a218cdbe.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-z1z2lc",
						"name": "AgADnRUAAlCDmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/8/c/6/8c6111153407c9bd046a5a1383a51060105fdcb0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-aw3o76",
						"name": "AgADnxsAAjz7oFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/c/a/f/cafd090bf4b08f2872cd17a14854982995bda020.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 471,
						"id": "emoji-1758291036203-a8amqt",
						"name": "AgADoRUAAkGQmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/f/a/bfa7713c9fa9952f2c207dad89fcf595c5e8175c.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-w69cmx",
						"name": "AgADoRUAAsX0oVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/8/2/38293917d8ac6b5257e3817f44ae91bab680537b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-n4kp05",
						"name": "AgADPxcAAo7boVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/6/3/d/63d1eb48d81ea0a20c6cc65a811c87234b40c6a1.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-7o9wxj",
						"name": "AgADpxQAApzxoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/e/6/3/e639d3eb2cbe0f44da372b9177a307bb29043001.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-0thyfq",
						"name": "AgADrRYAAmmDmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/c/b/f/cbf45119b2227770e6abf9b78e2e5fc47db9baff.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-lrw8z3",
						"name": "AgADshUAArnooFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/c/b/bcb750dc8675436b14d832ffea95ec24db3cdab4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-ylewc7",
						"name": "AgADsRgAAl1GmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/1/4/2/14257fac926d96ee789ece741816f07a0a813c88.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-00d57v",
						"name": "AgADsRkAAu-doVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/d/5/9/d599c6c6e7cd92127cfed0a000d2301b2aa3c724.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-c927fr",
						"name": "AgADThUAAv6_oFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/9/c/5/9c5b7f04d894bd23967d91249f8bc591e8b47751.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-ccf2tj",
						"name": "AgADtxwAApZNoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/8/8/2/882c4f5d9041ab643d48bb61c6a310c3b82983f6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 478,
						"id": "emoji-1758291036203-cupe0r",
						"name": "AgADUBoAAtVIoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/e/0/7e0ed0442be2849df0de81bf03c2666e31bd14a6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-szuiz2",
						"name": "AgADuhgAAvbkqFc.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/8/f/78f0bab2849849f3afb8e35cd1d59b8445634d4f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-abnwfz",
						"name": "AgADUxcAAq7-mVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/2/c/6/2c6103fa70f86f9a5b71c47f097755f7ea52a9ec.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-m58tdj",
						"name": "AgADVBEAAjjGoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/0/5/b058301a15aaa8ab09a1bf656bb509c205e594bd.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-o0iaz4",
						"name": "AgADvBYAAtIxgFY.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/d/c/9/dc902cb5d136b38f2ccb041486ca80c1f1040b7b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-b1v09c",
						"name": "AgADVhgAAsxDoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/d/4/5/d45ce33ba5b099106f5443967246ddefea754384.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-4xr2s4",
						"name": "AgADVhoAAv5CgFY.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/a/9/f/a9fcf9455df1121e9eae8561dee51bb4257ad865.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-fgkwrq",
						"name": "AgADVRcAApGxoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/6/8/d/68d4d5404fe6e8e76575a97d1022102aebd8c8cf.webp",
						"width": 455
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-91rrlm",
						"name": "AgADvxUAApH7mVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/5/1/4/5145506ca9833c0dcaf05178d3968a74566a7d37.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 510,
						"id": "emoji-1758291036203-zi9btx",
						"name": "AgADvxYAAsBSmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/5/f/35fbac8cc0f751366c19817623366a93039d3557.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-w6s1w1",
						"name": "AgADWhgAAsAkmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/e/2/3e209de75776ae75edcacbe2ffef1911a1366e42.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-tagupa",
						"name": "AgADWRYAApF3oVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/c/c/7cc09a5bd97e732599af14ee714ee82723f7d1eb.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-tljjpq",
						"name": "AgADwSQAAtaZoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/a/5/7/a579e070bfc76bcb4e2b2cd79a1ded89775ffbb3.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-t67co9",
						"name": "AgADXRgAAsyfmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/8/c/a/8ca8deac51d36806ac1a6451e73c0075db017cb4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-pk8vvs",
						"name": "AgADXxsAAiekmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/c/4/4/c4445ea12b02ef9cad42383b65c1a60df21496d0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-pbc4ad",
						"name": "AgADYhgAAs2IoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/9/1/e/91e6b8e3a4845d034dc5383c1c572b9a2900a7f6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-ryp9a2",
						"name": "AgADyRUAAvreoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/2/5/325f1b8e602f1b1264716afd01cc5d81def45a8a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-6lbgke",
						"name": "AgADYxQAAgEcoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/f/e/f/fefc81ab1757ab54aa6618184cae3e3c9f6482ca.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-b9rp9o",
						"name": "AgADZB0AAvbLgVY.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/f/5/5/f550db535e12655f5fa93d956c81f7bca7c483fa.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-jk80rv",
						"name": "AgADzBkAApN5mFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/4/a/34a3f3c069ad37ee41436a21243660d419c421fe.webp",
						"width": 456
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-5anc2o",
						"name": "AgADZhgAAsqlmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/c/5/5/c5502372c29037b7589f44c58290744bf9a3b333.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-twtewq",
						"name": "AgADzRYAArOkqVc.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/a/8/b/a8b36e88202669b7becd7aacaa09d88ca945ec8d.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-ukuekf",
						"name": "AgAD1RcAApMHmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/f/9/3/f9309e23ed73aa28cb313aafc0d424445a6786d1.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-cl3nz7",
						"name": "AgAD3xQAAtRLoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/e/5/9/e59649c4ea8fc6a8494174c52b59ba380326c287.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-6loxks",
						"name": "AgAD_hUAAmbaoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/0/4/0/04073dd9f0dfcdc723ebb1d37967b81abd241493.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-tkhv4s",
						"name": "AgADaRkAAuf8eVY.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/0/d/6/0d65ef072af89913ab5e0e0f322aed3ba0215ecf.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-w0kikg",
						"name": "AgADBxYAAjbeoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/9/5/5/9552c52bff9b04cdfe18e62419f5362483eceb43.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-llm6sm",
						"name": "AgADDBYAAvnbmVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/2/d/2/2d22642574929fe256cb518e2c194b3368a88fce.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-tkt2l9",
						"name": "AgADeBUAAjSCoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/2/8/7/2870bd8020d2042c8478dbf59917984aade6879f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-drty05",
						"name": "AgADhBUAAqruoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/5/b/3/5b347498835b3825f0710392e1f7e6edcf575fc9.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-jvczb8",
						"name": "AgADHhYAArHJmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/0/6/b0644e306394522e42a690d14e8660dec584c693.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-limtci",
						"name": "AgADIhYAAq_nkVY.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/0/1/a/01a07419e04042bcd930b4436c61f01a7ce10d54.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-p1qazx",
						"name": "AgADkhUAAscImFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/4/2/7/427230700c33d070ce33de4e5b92a78dc50f2522.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-eo8c6m",
						"name": "AgADLBgAAlqcWFc.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/5/1/3513a5aef7aa820a032a64183df04f55c86143f0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-7x6kfo",
						"name": "AgADnRUAArO5oVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/0/1/701674acba416eb294ff3e9d7eded734a17c8c92.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-xbt0jd",
						"name": "AgADphQAAu3aoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/e/2/e/e2e68d5dc56afbef0abea3e4eb550d89113f450c.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-sqb53k",
						"name": "AgADRhgAAiFgmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/0/c/0/0c00073e8f63fb2ed6635b3d88090de8e3c0385e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 496,
						"id": "emoji-1758291036203-f1t6n0",
						"name": "AgADtBUAAuqMoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/8/b/38bc218d21323ebc0581c656482ad405de75114a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-6krbl1",
						"name": "AgADTRIAAngWoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/6/f/a/6fafe3716cf2304e1495a570ed0a03b1f13af4fe.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 446,
						"id": "emoji-1758291036203-igvjtn",
						"name": "AgADUhgAApD8oVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/c/7/7c71948f142aee801a0e0a641e80d046cbfee807.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-botu4w",
						"name": "AgADvBQAAskooFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/7/a/8/7a822b2b9393e70a58d33d0425cd7df6e90fe20f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-bl7ojy",
						"name": "AgADvxcAAsK6oVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/9/6/7/967c192c873f0f63b9b9c232549354a959fc4a37.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-upg8fu",
						"name": "AgADwRYAAqUKiFY.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/6/8/368aeab07e3cc70ab6aeaa29cecffaed1cbb25ab.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-0yvzib",
						"name": "AgADXBYAAkOlmFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/9/3/5/93528d24e419bf5ab6a88ba2dab2f46f0b004e24.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 470,
						"id": "emoji-1758291036203-k0bxsl",
						"name": "AgADzRgAAmUGoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/f/9/5/f95ab13aa3c0f5e1c0e8ab42555565b36490f184.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-o2bkjy",
						"name": "AgADZxUAAoAuoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/2/0/320b83fc534aff8ef1c36980c39946a6a7311f54.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-k2yl3t",
						"name": "AgAD2RUAAhACoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/0/7/6/076b321c21a0d51c62d71a8bd07d456332e717bf.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 472,
						"id": "emoji-1758291036203-pp5ctx",
						"name": "AgAD8xcAAuTCoFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/1/6/3/1636199837852aa70cab0c26e8c0bef4908d93b5.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-70txz8",
						"name": "AgADJBUAAnFcoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/3/1/7/3176ac008d4b6aac2b189f9216b75057f60b5057.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-iieban",
						"name": "AgADMxYAAlJLoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/1/f/3/1f358d8ea87d9d53ddc04c4b05a0499d2a0efbdf.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 285,
						"id": "emoji-1758291036203-hwumk1",
						"name": "AgADWhQAAu8RoVQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/a/b/b/abb4c42a3ae2076db509ee8358b7ea47911784e0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291036203-cjqmum",
						"name": "AgADxxcAAqUimFQ.webp",
						"packet": 1758291036203,
						"url": "https://linux.do/uploads/default/original/4X/b/7/a/b7a8071e3c2d6881a56c748de62b8c9e77389931.webp",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 477,
						"id": "emoji-1758291083260-3krxhg",
						"name": "诶",
						"packet": 1758291083260,
						"url": "https://linux.do/uploads/default/original/4X/8/4/6/84627e8387f813c19de92b3e4d5c68d2b8a2ed21.gif",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291099775-oiwey2",
						"name": "刨手",
						"packet": 1758291099775,
						"url": "https://linux.do/uploads/default/original/4X/8/9/2/892e162e3d30f7a5e1bcce7c6f12781da5c06ca3.gif",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291111129-1ocqd9",
						"name": "上吊",
						"packet": 1758291111129,
						"url": "https://linux.do/uploads/default/original/4X/5/8/9/5891159ca5b7732b49c144e802f49d5386005b2e.gif",
						"width": 512
					},
					{
						"groupId": "group-1758291025412",
						"height": 512,
						"id": "emoji-1758291123909-6fufef",
						"name": "撸撸",
						"packet": 1758291123909,
						"url": "https://linux.do/uploads/default/original/4X/3/d/d/3ddf94ea922fa0e5532b27c26bb55972c102174c.gif",
						"width": 456
					}
				],
				"icon": "📁",
				"id": "group-1758291025412",
				"name": "tatakura",
				"order": 27
			},
			{
				"emojis": [
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-1k7j74",
						"name": "AgADvRUAArYmeFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/b/7/3/b737a49fcdc628853300831a698b427b7bf54873.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-4qjrpa",
						"name": "AgADJBoAAm5weVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/9/3/b/93b7204028722de1a5126e8aa3e3382c139c0d0e.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-2vvpoz",
						"name": "AgAD_BYAAklKeFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/5/9/7/5971ddbb739c84e8f9bf9d961c4ffd4120405667.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-wxmm8o",
						"name": "AgADeBEAAo0ucFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/d/2/9/d29941d7d9720ff0a0ffee7296eccd8cc696365a.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 512,
						"id": "emoji-1758292092676-dlukr0",
						"name": "AgADhRYAAoAvOVU.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/4/5/9/45935c8b5b04ec0758aeb1611c019c35dd075470.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 512,
						"id": "emoji-1758292092676-6wawhx",
						"name": "AgADMxUAArBSOVU.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/a/8/e/a8eab5b70ec5e6609fba546ba4bb26981f30b6f1.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-y8imqd",
						"name": "AgAD4xAAAoYieFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/6/b/f/6bf014bed0e769b7314a9e6281c0c74374f01246.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-imayuw",
						"name": "AgADXRsAAgyNeVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/5/4/4/5446dbc9055bf22ce9cbd180cecc729e35fcce59.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-5mqgm8",
						"name": "AgAD0RIAAv5keVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/9/7/2/972df4d3a1608ff7f0758aefb812d17240327330.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-yfrggr",
						"name": "AgADdxEAAsxMeFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/0/6/3/063c6db9d99117bf050404d11dc8273da55ae4dd.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-d5q6k8",
						"name": "AgADGxUAArGweVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/2/8/8/288723bc5db55a6eb0b58f4f0fb886a041f27a77.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-f3k9aj",
						"name": "AgAD1BQAAhXOeFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/4/6/d/46d703c652605bc36ba6165eb8111822b2657a92.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-a76alw",
						"name": "AgADghUAAmEMeVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/1/1/5/11552801b50ddb41e1990132c351499a76d79278.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-9quxjh",
						"name": "AgADPRcAAmPyeVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/7/d/3/7d34472bb6992599cce34e0405d7a3fb224941c5.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-6p5vca",
						"name": "AgADshEAAmeMeFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/a/b/7/ab7b0a4b69acd03fd7d180edd9e63bbff9a97cd5.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-mvsmpz",
						"name": "AgADaRAAAoCVeVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/3/e/9/3e99050b4e6f5e1ec6cf93e347d8ea6bc62976bc.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-wqm3aj",
						"name": "AgADcRMAAtJIeVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/2/2/d/22d6db7d691afa0f17683268cd74e1a4354873d4.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-h3uwnp",
						"name": "AgAD3hYAAp6ZeFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/e/e/9/ee927c8973f23e560fc966a01896ff75f349f9bf.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-pl3a0h",
						"name": "AgADvhQAAtAKeVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/9/5/d/95dc7c8e04ff1d9d62cc1179dc1fd45eee91739e.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-okkg9x",
						"name": "AgADWRgAAqcLeVc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/c/5/7/c57b83757562d8c0f52525cc1bf56bf21b9c70a4.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 512,
						"id": "emoji-1758292092676-ljwdnl",
						"name": "AgADYhAAAqC8OFU.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/2/7/8/278b5247e0dbd8bb845f6d72ae452c07584a1555.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-lhazar",
						"name": "AgADrhYAAnWAeFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/f/f/6/ff64329dcc8979fb3bd331919aaecf80285d314a.gif",
						"width": 512
					},
					{
						"groupId": "group-1758292062046",
						"height": 500,
						"id": "emoji-1758292092676-v8lp1d",
						"name": "AgADjhUAAnZ7eFc.gif",
						"packet": 1758292092676,
						"url": "https://linux.do/uploads/default/original/4X/7/5/8/7583713972c8497a1195a4c026dfaa384dc6eff0.gif",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1758292062046",
				"name": "疯传箱子",
				"order": 28
			},
			{
				"emojis": [
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236133-bq3ju8",
						"name": "AgAD-BcAAnawQVY.webp",
						"packet": 1758294236133,
						"url": "https://linux.do/uploads/default/original/4X/c/7/8/c78f990d218015d997db4a131abc298e535241e8.webp",
						"width": 360
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-31wrn2",
						"name": "AgAD-hUAAr-MiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/c/9/4/c941eecc7b67dc58aaf1a954d9a21cddcee32b05.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 507,
						"id": "emoji-1758294236134-0es7nv",
						"name": "AgAD-RYAAslgUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/b/4/7b4f2325d3ac8347732bc97c45cde3b552f1a6dc.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 509,
						"id": "emoji-1758294236134-261ip1",
						"name": "AgAD1hcAAn-NiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/a/6/e/a6eeed43885d37088980f4d7edce4ce5fcd29d64.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-ynbhfs",
						"name": "AgAD1hYAAgF8iFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/3/5/c/35caa0b6c9fec2652cbd799bacd99eec4bbc91bb.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-zylwrr",
						"name": "AgAD1RcAAr-FUVU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/c/b/e/cbedf30ac7663de7f7a371e8f854d9ed3c3807b0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 474,
						"id": "emoji-1758294236134-pgsen6",
						"name": "AgAD3BcAAmvEUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/d/7/7d7a54f9092ad20224cd15a7a5bffc10956ea203.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-e9h374",
						"name": "AgAD3BYAArKC0VY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/b/b/5/bb5ff8eeffc01581a3bb6bb287f5fa77c875af9b.webp",
						"width": 222
					},
					{
						"groupId": "group-1758294156025",
						"height": 476,
						"id": "emoji-1758294236134-k0kir1",
						"name": "AgAD3RQAAiq_0VY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/0/f/a/0fa693e7d674e0bfd5751588177bdba86459c435.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 455,
						"id": "emoji-1758294236134-clqms7",
						"name": "AgAD5BQAAkfKQFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/9/9/e/99e643cb23e7e3d05c367d831a1a6288f184313a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-261r1z",
						"name": "AgAD5xgAAtoLUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/c/5/f/c5f95a41ef1ef61168eeeb1ac94016d9cc9079f7.webp",
						"width": 510
					},
					{
						"groupId": "group-1758294156025",
						"height": 433,
						"id": "emoji-1758294236134-2xjtxs",
						"name": "AgAD6hkAAnb50FY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/8/6/a/86a5e2d113b1bee74ccd1da8a8831a71a37191a2.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-r40amo",
						"name": "AgAD8RkAAvFnOVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/0/9/5/095f337f188f0e5b56b4da6365a14b675ba1c3c6.webp",
						"width": 420
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-z1zd3z",
						"name": "AgAD9BcAAnbliFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/1/0/2103bddd1d5fe30a5251eb0a0c9f067e4c0d72e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-wkofwt",
						"name": "AgAD_hUAApSSUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/4/e/7/4e760c15efadd8f7769d1c8a3a92e650d46bbef7.webp",
						"width": 500
					},
					{
						"groupId": "group-1758294156025",
						"height": 493,
						"id": "emoji-1758294236134-jzajbn",
						"name": "AgAD_xsAAkU4OFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/1/b/4/1b4fc383a06a9d66b64eeac53bac23ce27bf4a7b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-kaydni",
						"name": "AgADaBUAAtfrSFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/c/0/2c014c02e9c0df2aa1eb1e157931c413fc0d6f14.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-zi6sca",
						"name": "AgADahUAAuyVOVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/f/1/0/f10dcaff78c9d6f438a139ab81c6e01662c75b1a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 446,
						"id": "emoji-1758294236134-tjj5qr",
						"name": "AgADaxQAAvxDUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/6/a/76a2f497e6121e2c65cf1a91ab90905c4c33f477.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-bcyqw7",
						"name": "AgADChwAAlsuyFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/1/2/0/120ef3fea5fd12dfa7f710332e0420a5603774fb.webp",
						"width": 394
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-ncz7ws",
						"name": "AgADcxQAAp9iQFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/b/5/0/b506d130b9c530c118bb7f38bca42d0e434f57da.webp",
						"width": 507
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-43lrji",
						"name": "AgADDh4AAo19iVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/f/8/d/f8dcd2b21af34cca321a3cb6333cb10f237de4db.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-ea4hhf",
						"name": "AgADDxUAAiB9OFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/b/3/2/b32c2ec812ae22acb3b8df8213aab8c828058044.webp",
						"width": 508
					},
					{
						"groupId": "group-1758294156025",
						"height": 468,
						"id": "emoji-1758294236134-i8aq4g",
						"name": "AgADeBQAAiEOiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/9/9/79961a793cc58672be2ae9d5691465ae46573eaa.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 511,
						"id": "emoji-1758294236134-flmeg4",
						"name": "AgADfRQAAltmiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/e/f/4/ef46899ced2cda7348fb56717d27c43c4d2b5151.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 492,
						"id": "emoji-1758294236134-bt9p6a",
						"name": "AgADgBYAAq2TOVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/b/4/4/b44da6d19f7a814e0f635dd622eb16cc186421d4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-di42mw",
						"name": "AgADGhQAAtiKgVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/3/6/236920fefe40531c35a519bd16067d2d2d8a0342.webp",
						"width": 396
					},
					{
						"groupId": "group-1758294156025",
						"height": 460,
						"id": "emoji-1758294236134-n1ptqn",
						"name": "AgADGRUAAi0oiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/7/b/77b23f703c84878125c673c4012d3191e8b8d12d.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-02gqcs",
						"name": "AgADGxUAAr7qiVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/1/d/a/1daf5c07357591310cc8b998e487cf98ca668f59.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-75tm6h",
						"name": "AgADHBcAAuIAAYlU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/a/b/b/abb7f488e0cc762910991f2af8c6f6f9f8b8f578.webp",
						"width": 360
					},
					{
						"groupId": "group-1758294156025",
						"height": 471,
						"id": "emoji-1758294236134-xqlxeg",
						"name": "AgADhBUAAkIEiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/c/9/a/c9ae4c2e8ba494422e40004edf8478267aef9ad6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-3kqcq3",
						"name": "AgADiBgAAqYiSVU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/0/0/4/00415b44c82a58f46b1666375e3557247f3d86d9.webp",
						"width": 362
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-hh3xw8",
						"name": "AgADIxcAAhfRUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/b/6/7b6fccbabf574ac28f06b0dcdf7884e6f3ec575c.webp",
						"width": 510
					},
					{
						"groupId": "group-1758294156025",
						"height": 510,
						"id": "emoji-1758294236134-mq37ks",
						"name": "AgADjxgAAuOdiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/0/d/0/0d0ae796db758bebeb701f0ca05384de89efb0ae.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 395,
						"id": "emoji-1758294236134-luz7lq",
						"name": "AgADJxsAAh_ZiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/0/7/a/07a9f4f22d4bcf2b0aa069b7c9a0a096d4cc28ab.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-1yfweq",
						"name": "AgADKhgAAvmmOVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/8/5/2/852198e04094446d52b4b7e59e237ef50516eee4.webp",
						"width": 511
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-sunhp6",
						"name": "AgADkRgAAjdXiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/d/f/2dffe3bbf4c02cb3b83f90713ed713a0f2356357.webp",
						"width": 425
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-zafuom",
						"name": "AgADKRsAAvdCUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/9/3/293f12c5db64f70febd65075874e9e5055dae823.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-dyrn6c",
						"name": "AgADkxUAAucAAUlV.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/7/1/7710524701576e139bee587483459e3fffce5346.webp",
						"width": 455
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-x9bz9l",
						"name": "AgADlBMAAkbOiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/2/d/22d79208c000c0bb337a9037e057f8888afd5265.webp",
						"width": 497
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-lbd9aw",
						"name": "AgADLBoAAsNriVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/e/1/5/e15f28acb309857a705154cba1f75983aae2a973.webp",
						"width": 455
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-mpmyc1",
						"name": "AgADlR0AAruaiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/a/a/8/aa8493826cfea996452ad994d038c5f40c22c763.webp",
						"width": 507
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-grs7f2",
						"name": "AgADlRQAAj-MUVU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/a/6/f/a6fa3a92fa4d9990abcbb4bdc6b6759712309e2f.webp",
						"width": 492
					},
					{
						"groupId": "group-1758294156025",
						"height": 453,
						"id": "emoji-1758294236134-nkc6j1",
						"name": "AgADLRYAAnmwgVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/e/4/c/e4c06d18c00fd39d9f5b62b72346edd7bb6aa433.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-umolmp",
						"name": "AgADMBYAAolmiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/0/e/20e8cab1954cc093e9355112fcee0fed5c1daec0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-32fdaq",
						"name": "AgADMBYAAuZH0FY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/7/b/f/7bf244c118f97820068093a34005c6c5ee95c0da.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 503,
						"id": "emoji-1758294236134-sgjvf6",
						"name": "AgADnBIAAhkNiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/b/f/d/bfd653b5712406bedd2c1c4d7083c1c012ef09a7.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-nj3uj8",
						"name": "AgADNBYAAuMD0VY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/3/1/b/31b83017dec38d270e1d6741d9cc37366a1fe6cf.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-nx499y",
						"name": "AgADnRUAAkliOFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/9/0/7/907b06047771bf16e99ea8e9427c6712abeb6a78.webp",
						"width": 507
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-z86nb5",
						"name": "AgADOhoAAqVcUFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/1/d/5/1d52736c50730a358f29f7c887fdec0388a56daa.webp",
						"width": 506
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-k7a62t",
						"name": "AgADPBUAAh_XOFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/d/e/e/deed98a68febf65054b95c7e8e6e2dbd1e0dfc43.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-vht4gc",
						"name": "AgAD4RgAAjLdiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/1/7/0/17008fe94b70fd3b957884519fbd5bdd5c91085a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 508,
						"id": "emoji-1758294236134-9ay6f3",
						"name": "AgAD7hQAAngyUVU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/3/7/a/37a57706ef58ee25d52542d9331ebb79998b07d5.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-1m5p4n",
						"name": "AgAD8RUAAkCWOFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/8/9/6/8966b2e406a8d567e650b59ad936ccefb40563a8.webp",
						"width": 503
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-n5d1j9",
						"name": "AgAD_REAAiqIQVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/f/1/2f1218aa367af158da4e67cdd0322230359af4f7.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-o20nvy",
						"name": "AgADbhcAAo7tOFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/f/5/9/f59f5e4dc487e886deb4b20cfacd692fe3d6db73.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-pgq6ya",
						"name": "AgADdRUAAgP2iVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/d/0/e/d0ebed14e9873a2e384b07ab2301928c7a9dccb2.webp",
						"width": 507
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-migmf8",
						"name": "AgADDxUAAiDFSVU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/f/5/2f58e22011a1d70a9417754e82b48acc0fd7c65e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-yvim7k",
						"name": "AgADehcAArnnQFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/f/9/6/f96556387ff7f1eddf70fc26b9300e49ee826521.webp",
						"width": 335
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-fuz7b3",
						"name": "AgADgxUAAs2JOFY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/0/a/e/0aebac8a90a5f79f2a8277421f5eb188bd482a56.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-8crlnl",
						"name": "AgADIRYAAgtMiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/2/4/d/24dd6727b000b233f56cec41d3f71f8dd6ef12d0.webp",
						"width": 370
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-xv6c91",
						"name": "AgADkBUAAiodgVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/c/8/d/c8dece27936b48cf2f167ec5c7fe12077e8f829a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-1bcxz8",
						"name": "AgADlBgAAlLniVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/6/9/1/69119d8132a01ab03db1911a198b4c3b80f3efee.webp",
						"width": 496
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-18la62",
						"name": "AgADLRcAAgyvSFU.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/1/7/d/17d9befc5b9111ff032dcad8ed2390623cd42184.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 481,
						"id": "emoji-1758294236134-tstebw",
						"name": "AgADlRYAAmGBiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/0/f/6/0f618ce201fb24787e980d0fee6148520c7825e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-13c3vd",
						"name": "AgADMhcAArqGgFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/9/b/e/9be31750681f3871e16feb6822ce54fb69bd8f0e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-vwvdg2",
						"name": "AgADpBYAAkNYiVQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/6/4/9/6498e0dc9d20af3f021ab5a458948ce290a3f799.webp",
						"width": 363
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-lm927i",
						"name": "AgADPxUAAiU2iFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/e/6/d/e6dcd0fffc20a1e7346ec926f6674bc4fa1b9411.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 382,
						"id": "emoji-1758294236134-o2k4mx",
						"name": "AgADqhcAAqUvyVY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/1/1/8/11882583db06c71da08132d77e04fd4b27d089be.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236134-jt39hr",
						"name": "AgADQRYAAidk0VY.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/e/0/8/e0809f91d88c4b8b6ecadd42f8a225b5fd3342fa.webp",
						"width": 418
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-jrgr3p",
						"name": "AgADrxgAAmEOiFQ.webp",
						"packet": 1758294236134,
						"url": "https://linux.do/uploads/default/original/4X/d/2/4/d24ff8a45f3dc192a6e23de86f77a04648cc8719.webp",
						"width": 469
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-1ufqx9",
						"name": "AgADrxQAAqYnQVY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/6/4/6/64619121943bf60f4060d6027f5f1aded4eb42a3.webp",
						"width": 506
					},
					{
						"groupId": "group-1758294156025",
						"height": 507,
						"id": "emoji-1758294236135-ctuh9j",
						"name": "AgADsRcAArY5OVY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/7/e/9/7e9b3dd0d9cc10f98ae6d1ee7c2fd9715922885d.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-ohv2mz",
						"name": "AgADsRQAAp1fSFU.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/0/a/3/0a3acbcccd8ea5d46fc975ea5241fe81d24a3990.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 432,
						"id": "emoji-1758294236135-53n7lo",
						"name": "AgADtRUAArUwiFQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/c/f/3/cf39d30c118e59a15f1a90449f0c4ed5aa1a8aa5.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-b0pug3",
						"name": "AgADUhYAAm0BUVU.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/0/5/f/05f17a51b44eff0be42ff50bd223e1ba94054220.webp",
						"width": 360
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-o2lb2m",
						"name": "AgADUhYAAqW0iVQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/4/1/8/418accf4444e977094100162f6ffa7f1a00f525c.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-6pjwud",
						"name": "AgADuRYAAlBrOFY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/d/a/4/da4185b4cf677af90bd30c430d27e13972c7decf.webp",
						"width": 335
					},
					{
						"groupId": "group-1758294156025",
						"height": 494,
						"id": "emoji-1758294236135-3vaiqc",
						"name": "AgADuxMAAkL3OFY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/1/7/e/17e3223550482e21c6cf026a90371edafb8a2b1f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 437,
						"id": "emoji-1758294236135-tfia3b",
						"name": "AgADUxUAAkk3iFQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/f/1/b/f1b261a3c8da7841d87dd27835fefc022dfc30c4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-y58k97",
						"name": "AgADVBYAAsVLiFQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/9/a/d/9ad181f1c3751d7e5755acdd7ec56b4b1110406e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-e1uz6m",
						"name": "AgADwBYAAjAqQVY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/e/1/6/e16dc2979485cbe3825cd6929842267c4127466b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-jk5pmx",
						"name": "AgADwhcAAuccyFY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/5/0/7/507ff179c915470912d3d430b9957832e2248293.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-tlhahl",
						"name": "AgADWRkAAmxmOFY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/7/b/b/7bbad64bc9035474a8662ecaea507ecf2abe2112.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 500,
						"id": "emoji-1758294236135-oqtgq6",
						"name": "AgADWxQAAq8nSVU.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/0/0/f/00f8febd4908c18f968fb84e597abe6782c3b8f6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-vz5qlu",
						"name": "AgADXBoAAt4CiFQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/b/c/b/bcbce136b87f0973cfb04f36c9676aff1aefdfc3.webp",
						"width": 502
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-5nvlai",
						"name": "AgADYBQAAvbeQVY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/d/c/9/dc96814558c40c5e90edbcd023b2373588c617cb.webp",
						"width": 469
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-sixvb5",
						"name": "AgADZBwAAqVhiVQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/3/5/a/35ad5e848d921895c7abccdb986b4578715ab533.webp",
						"width": 386
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-7xpnel",
						"name": "AgADZRMAAuW2SFU.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/1/d/1/1d1e7bad222f1856890a0e34a005b59c1becdbc4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-yeidkj",
						"name": "AgADjRYAAnGKOVY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/b/c/a/bcae74a5bf45e1a839691519322a265e440fd6ae.webp",
						"width": 410
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-dqfzvm",
						"name": "AgADNxQAAs2JiFQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/4/9/d/49dde569be95ddfb1dfb917658fd25b4370daa17.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 464,
						"id": "emoji-1758294236135-9qcp2z",
						"name": "AgADQhYAAp_LiFQ.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/e/a/1/ea15193a5b465f90916bb1066c2e4338871464ea.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-0avhbq",
						"name": "AgADrBcAAu1s0VY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/8/9/a/89ac810ea61c1739f5158f7edabac6850fe154b3.webp",
						"width": 363
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294236135-ykmwuy",
						"name": "AgADVBUAApD1QFY.webp",
						"packet": 1758294236135,
						"url": "https://linux.do/uploads/default/original/4X/1/1/9/119a308aec44ddaf9f2cec3f83e389ba0c4a86d8.webp",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294306491-96bzst",
						"name": "AgAD4xgAAsxyUFU.gif",
						"packet": 1758294306491,
						"url": "https://linux.do/uploads/default/original/4X/3/9/8/398cf6374b08f3af2db486dd47d3e88bf16e8a12.gif",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 414,
						"id": "emoji-1758294306491-gu5brx",
						"name": "AgAD6xoAAs8liFQ.gif",
						"packet": 1758294306491,
						"url": "https://linux.do/uploads/default/original/4X/5/a/0/5a08723b4362cc6035c628ae5bf5e14e7ef18948.gif",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294306491-n5d5o2",
						"name": "AgAD9BYAAsfyUVU.gif",
						"packet": 1758294306491,
						"url": "https://linux.do/uploads/default/original/4X/9/b/6/9b633d5cd52a3a620091c4d2a021be0fe1549c0c.gif",
						"width": 384
					},
					{
						"groupId": "group-1758294156025",
						"height": 414,
						"id": "emoji-1758294306491-9acefm",
						"name": "AgADMhYAAmKOiFQ.gif",
						"packet": 1758294306491,
						"url": "https://linux.do/uploads/default/original/4X/5/e/2/5e2d327a42ec7bd2aae7e49d1bc7bae57c0e7907.gif",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294306491-8gcj8t",
						"name": "AgADnBYAAtEjSFU.gif",
						"packet": 1758294306491,
						"url": "https://linux.do/uploads/default/original/4X/f/c/e/fce652df6a020df8db8fa815b350beef526db705.gif",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 492,
						"id": "emoji-1758294306491-hnbaux",
						"name": "AgADTRYAAupCiVQ.gif",
						"packet": 1758294306491,
						"url": "https://linux.do/uploads/default/original/4X/d/d/7/dd7eb90168e39a2a4eb10b596a0c0a1762d9316c.gif",
						"width": 512
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294306492-0m8rrn",
						"name": "AgADvBcAAu72gFQ.gif",
						"packet": 1758294306491,
						"url": "https://linux.do/uploads/default/original/4X/f/2/c/f2cf0cd64f880549d78366851cd46f610ee055fa.gif",
						"width": 340
					},
					{
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294306492-doquh9",
						"name": "AgADyBQAAjLmSFU.gif",
						"packet": 1758294306492,
						"url": "https://linux.do/uploads/default/original/4X/1/2/f/12f368f62948e493b166757ab5a1554341cd4809.gif",
						"width": 512
					},
					{
						"addedAt": 1758294538563,
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294538563-cfl1jn",
						"name": "AgADGxUAAr7qiVY.webp",
						"packet": 1758294538563,
						"url": "https://linux.do/uploads/default/original/4X/1/d/a/1daf5c07357591310cc8b998e487cf98ca668f59.webp",
						"width": 512
					},
					{
						"addedAt": 1758294535522,
						"groupId": "group-1758294156025",
						"height": 512,
						"id": "emoji-1758294535522-4koj0p",
						"name": "AgAD1hYAAgF8iFQ.webp",
						"packet": 1758294535522,
						"url": "https://linux.do/uploads/default/original/4X/3/5/c/35caa0b6c9fec2652cbd799bacd99eec4bbc91bb.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1758294156025",
				"name": "伊蕾娜",
				"order": 29
			},
			{
				"emojis": [
					{
						"addedAt": 1758201011431,
						"groupId": "group-1758296437858",
						"height": 1024,
						"id": "emoji-1758296443411-c3ginv",
						"name": "G1GcUpCaQAAv1gD",
						"packet": 1758201011431,
						"url": "https://linux.do/uploads/default/original/4X/d/3/e/d3ed6a4dcf4830f54894a65df356ea9a6fd7be9a.jpeg",
						"width": 1024
					},
					{
						"addedAt": 1758296794444,
						"groupId": "group-1758296437858",
						"height": 2457,
						"id": "emoji-1758296831599-fdnu7f",
						"name": "纯坐着",
						"packet": 1758296794444,
						"url": "https://linux.do/uploads/default/original/4X/d/1/f/d1f81e5c6755aa80f9c1f27c2082c4886a766301.jpeg",
						"width": 1500
					},
					{
						"addedAt": 1758296796774,
						"groupId": "group-1758296437858",
						"height": 1754,
						"id": "emoji-1758296842316-9guyhs",
						"name": "吃面包",
						"packet": 1758296796774,
						"url": "https://linux.do/uploads/default/original/4X/e/8/2/e829c84ca1702d369165f6075d33de92f5c8f194.jpeg",
						"width": 1240
					},
					{
						"addedAt": 1758296799105,
						"groupId": "group-1758296437858",
						"height": 1e3,
						"id": "emoji-1758296849040-lk1fi3",
						"name": "像素画",
						"packet": 1758296799105,
						"url": "https://linux.do/uploads/default/original/4X/5/c/e/5ce453ec6100c0d97fff7a069b7f6050dc6c2c02.png",
						"width": 1e3
					},
					{
						"addedAt": 1758720617211,
						"groupId": "group-1758296437858",
						"id": "emoji-1758720617211-snyqx1",
						"name": "image",
						"packet": 1758720617211,
						"url": "https://linux.do/uploads/default/original/4X/3/e/5/3e567fed9885abed87809e9a2e8f1d86ef7e5741.jpeg"
					},
					{
						"addedAt": 1758766947093,
						"groupId": "group-1758296437858",
						"id": "emoji-1758766947093-rhu154",
						"name": "image",
						"packet": 1758766947093,
						"url": "https://linux.do/uploads/default/original/4X/e/6/5/e6566df121e983760adf1c6f5cb7e3f87e9220a7.jpeg"
					}
				],
				"icon": "https://linux.do/uploads/default/original/4X/a/9/5/a95d5eeedd72bd406ff16d544370673fe9f98a03.jpeg",
				"id": "group-1758296437858",
				"name": "堕天みろ / OchiteMiro",
				"order": 30
			},
			{
				"emojis": [
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-f3du1m",
						"name": "not_care.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/4/49183cb33b04888a45f281a49714d02b805a86dc.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-x4e0it",
						"name": "pick_nose.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/b/b8aa1070db0862ce7cc8bfd8450eea62a1f374fd.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-0a83nc",
						"name": "question_mask.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/d/d0fad7d48d4ecf4d8b13d289489eae478b83ae38.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-cp9z5l",
						"name": "rage.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/4/4fe331c06ecbb865d06fa34eee372b36c2a060dd.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-2aflr2",
						"name": "rolling_eyes.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/6/63bdf914d9bce405345a4bbf00f4a14a5eeeb99a.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-uhxczg",
						"name": "scared.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a6f71e28b736cf085a44ed0a317a77870fc91916.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-7yv9pm",
						"name": "shy.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/9/9a7cf3b6bb0c258711835e0a3d7697eaf313d6b2.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127372-8ergq8",
						"name": "slap.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/c/ce3763e02478f37e7497b95ad08a5b66a6e9e33a.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-dn8uqt",
						"name": "sleep.png",
						"packet": 1758435127372,
						"url": "https://idcflare.com/uploads/default/original/2X/e/e651fc6489da690c6807c03e0c47b0e50d8fd2df.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-1p9505",
						"name": "sleepy.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/e/ecd768b46e47e6c93e572670ec82aafb0f93d9c7.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-8vqu8u",
						"name": "doge.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/c/c8b533868759cbe3d1cc72ac845439995bb71070.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-m2frsg",
						"name": "sob.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/f/fdf60ab7b22b2960c296abc32e9d57c72cdb36f8.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-6cqwvm",
						"name": "heart_eyes.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/1/10b866592901c13efdb22f926b764511d0f29196.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-i8crg6",
						"name": "cry.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/9/980f59ef94c90aed8482477e0ff194bf01010dd7.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-f1xnpu",
						"name": "sad.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/1/199cc32aac5183ef54fd7d665f3a2b4319d719ac.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-n9v7e8",
						"name": "smirk.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/9/988c4d476d40910dacb57ddefee4a6011be991ef.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-u8v78w",
						"name": "sweat.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/b/bf5886c781b524833e51374fd5d7ee8c57abc863.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-qv1txc",
						"name": "antic.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/2/2b7061d222a42c2b1c57f8a98382b0abb992a535.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-xerpfd",
						"name": "miantian.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/c/c0189d236e8762bc5cda233e9c5042e4b6732059.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-8ltdcq",
						"name": "spit_blodd.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/d/d733b74e85fe242651f50c22ac0c7f5771aa41ab.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-2dpffg",
						"name": "annoyed.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/a/aa04604cff8d04ec081df5bd366638ead55be663.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-8ptwjp",
						"name": "awkward.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/e/e894a57257c03bf876619782e8c9e17e1e57ede0.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-1ymh7m",
						"name": "bye.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/7/77360427ed293c97dce2c2172122d233e79f28ca.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-5bz8l8",
						"name": "chuckle.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/9/92c0d2913f4d726f2081ddaacbc54c56e2d96034.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-f9pvsk",
						"name": "clap.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/8/85b1b62fd45f2724924004eaf5f0afb31ee289f5.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-jcysiy",
						"name": "confused.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/4/4429fccb370d00682e60bb49f672370a3e44ced6.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-nozlhx",
						"name": "crazy.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/d/d72d3153e658bf3691e0125e5356fcb917d04fe9.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-rltbnz",
						"name": "cute.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a99a98ecf8381cc9aee9502535a999f0a6a94711.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-npiyz7",
						"name": "dizzy_face.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/6/6faf6d89f00720fa8456b7fa675962fce0ac7ac3.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-fluxvy",
						"name": "face_cry.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/0/068a98b33b92abbd67e3fd07afa7f1fb0d0352cc.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-k7nevu",
						"name": "flushed.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/8/8c0638bdfe249b3f643a1e1f1ff39c79902f4812.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-0443zn",
						"name": "greddy.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/f/f53e54ae91fcfb0020b927423c4aa3c6c11fcf41.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-3z1g01",
						"name": "grievance.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/5/59aad0ae71c27104137576acb95f1b081ae5b95b.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-t2a9jr",
						"name": "kiss.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/f/f069e277d0fd37ca0b76a8ac9caac4908f8732b3.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-on4x1u",
						"name": "look_down.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/0/01476ac88332e724bfb2398a8b809f6f78cc95a5.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-0tx0eq",
						"name": "lovely.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/f/ff94d74a55d1b0a985f48ca68eed4c0af38686f3.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-abn9mg",
						"name": "mask.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/1/1aa50440bb58173a2edb0925daa8ec5831986848.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-aly5ie",
						"name": "money.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/7/7a3c8024307b1981fff4680530d1d745cfab909d.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-yt4pj1",
						"name": "no_mouth.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/4/4f8b3fafb91d32850cce92889b8e0dc0a33a2484.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435127373-r1umsw",
						"name": "nosebleed.png",
						"packet": 1758435127373,
						"url": "https://idcflare.com/uploads/default/original/2X/d/d83fef79f55863a6aa7ffa3f5c7bd1f310040aa7.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-ywpq4y",
						"name": "slient.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/5/5ba52125dd24734220eac39c47790cff47154bbe.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-67o1yh",
						"name": "sunglasses.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/a/aedf4675b2029983652c3034faa037d63dff722a.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 66,
						"id": "emoji-1758435139387-cniajf",
						"name": "test.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/f/f1ef82ae1bba22b29b0c3972e37f7de2d6e9498f.png",
						"width": 66
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-ypsn5w",
						"name": "think.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/3/317c97b6485b2d224533abae53205f05159ed311.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-njse8r",
						"name": "thumbsup.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/8/8f62d9168cbf38f0af06dd35957799a7c4f2e3fc.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-19vax1",
						"name": "tiaokan.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a51320282edae7d7005e1b586bb3b57a25a1b459.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-kd6fk1",
						"name": "trollface.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/d/d09bbe69eb2154b15feb4b67372a70fe5b51254a.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-xaeets",
						"name": "vomit.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/2/2a31c4cf3253e17e5b309427d31187255783c8e3.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-xx0kwk",
						"name": "yum.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/0/09a18362ea1562ec679a34b891a4461f117a123d.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435139387-pagzsr",
						"name": "yum1.png",
						"packet": 1758435139387,
						"url": "https://idcflare.com/uploads/default/original/2X/c/cf60653a4856773de17aa7438d79dadab7c72b9c.png",
						"width": 96
					},
					{
						"groupId": "group-1758435118749",
						"height": 96,
						"id": "emoji-1758435172344-e65xco",
						"name": "zhumei",
						"packet": 1758435172344,
						"url": "https://idcflare.com/uploads/default/original/2X/5/563c45a1a9e142fc18f5ee9f873fe9d2ce87ac01.png",
						"width": 96
					}
				],
				"icon": "📁",
				"id": "group-1758435118749",
				"name": "bilibili idc",
				"order": 31
			},
			{
				"emojis": [
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-k7dgxy",
						"name": "PhoebeX_001.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/4/45385715ab7fa72a6faa79ff3573edc126854f9d.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-uk5dtr",
						"name": "PhoebeX_002.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/c/cec9b4dc6db7b4241d92ae86bf17f6cc687d49ee.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-yp68h6",
						"name": "PhoebeX_003.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/e/ee13a839dd4a5d6a23241542044947b5fab509df.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-5k1ges",
						"name": "PhoebeX_004.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/9/97809890b3fb2baf04f85a291050abc1f8d2e507.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-wvfsws",
						"name": "PhoebeX_005.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/9/9c791b844d39b82e4d30ffdfb057132d0fbf7c62.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-3y4gid",
						"name": "PhoebeX_006.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/7/77a1d1990a8488f40e0eae53389835026ff5494a.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-ilyw79",
						"name": "PhoebeX_007.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/b/bcba5bdbb0fb3fccd4cf366e3371f88299de4958.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-57oba0",
						"name": "PhoebeX_008.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/4/47a080b48264b6eab1b7d052d0569e8c7efc4a53.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-25ne8l",
						"name": "PhoebeX_009.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/d/d5aec9f47b6e8e368e7a53de0cf6bc670ea841c3.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-2kim2t",
						"name": "PhoebeX_010.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/1/179a512384368ef88ca612936dbadc04553cc306.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-4ezzm6",
						"name": "PhoebeX_011.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/1/10727b015518d53389633a7ae2b4e53a6e49c543.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-2h1sl7",
						"name": "PhoebeX_013.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/2/25c5c800ebe57e7b73c691c432153837bc1bd40d.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-uwyz88",
						"name": "PhoebeX_015.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/0/0df0ce7fe186e5d078655867fbe3c4a413178aba.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-xd2wvu",
						"name": "PhoebeX_017.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a596d12ed8efe566bbf7a1f3de918c9073b59a41.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-9ab1r9",
						"name": "PhoebeX_019.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a5bfcc92e2818bc5094ce37dbd7efa1c37fdef04.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-6ujfhy",
						"name": "PhoebeX_021.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/d/d0b26ec2502fbfdbf3e43fb6716604cd4b4fe022.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-1dx4gs",
						"name": "PhoebeX_023.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/f/ffac25226d9afe608ba29ce6ef3eac7822d56ac8.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-iouva6",
						"name": "PhoebeX_024.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/3/30b037cca050f8d7e7881925ad5e6a9529b4abac.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-64dgnn",
						"name": "PhoebeX_025.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a875e0da36588baf811cdbb90e5790fe99df3675.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-nce9u7",
						"name": "PhoebeX_026.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/e/e395f9bceade5749bd39a51de189a6d525f2c946.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-eqmc02",
						"name": "PhoebeX_027.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/6/69df9222fe275f3563d431cd6a69ca40ec223ee6.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-jz1pwi",
						"name": "PhoebeX_028.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/c/c4e471bab4330dce5f00294cfd729ed40a8c4025.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-lygnc5",
						"name": "PhoebeX_014.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/d/da8a61815567682dcf3b5dde6817d07a27f61e86.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-2guww1",
						"name": "PhoebeX_018.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/4/43cd5df1c5d93578a932f87b724dce7aef777e1a.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352305-f7ars1",
						"name": "PhoebeX_020.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/e/ec11dac1930dcf38d1aaba89398d03a70aef6d39.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505352306-gv58w1",
						"name": "PhoebeX_012.png",
						"packet": 1758505352305,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a1666da27bce092392f42c181f7febedd85e2e94.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-0azg2r",
						"name": "PhoebeX_029.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/f/f9ab8571a05b0ed650e86156cf3442ac9d2d0edc.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-pvlo3y",
						"name": "PhoebeX_030.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/7/75dc8a59d6425de8af34ffa95f37c167152d7a19.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-0bt2sx",
						"name": "PhoebeX_031.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/4/43e0bab26bdc17428da0dfde2db81f53001b1e7b.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-1cbgd9",
						"name": "PhoebeX_032.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/1/158d3c7d4a5871959e13d8492422a4c072c379a4.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-idaej5",
						"name": "PhoebeX_033.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/2/2bae18d8c418f0b034e661bf42721fb03cf37616.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-b8b0xt",
						"name": "PhoebeX_034.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/c/ce01313e41eeb92fb9e6faaa04bc5225aed3992e.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-31l55m",
						"name": "PhoebeX_035.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/f/feacba29506dea237fa279321b665b5b0382296c.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-l22dnd",
						"name": "PhoebeX_036.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/9/909eff5c2cde385b0e689696ef274ee3ef3a61fe.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-43gzab",
						"name": "PhoebeX_037.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/b/b203e5ef3636f81410833c0aa391e2b74888068f.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-wjfqer",
						"name": "PhoebeX_038.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/7/7c0a0658e5d960897d79dbb86ab402c9c9259153.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-13y06p",
						"name": "PhoebeX_040.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/5/5f794ec1978201c04efe2d28b5ec3c2a6ff66b34.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-ld5w79",
						"name": "PhoebeX_041.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/6/6c48b13346ce9aee83cb419fe270c35fa6bee575.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-h5qcxt",
						"name": "PhoebeX_042.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/4/4c9101bed6cc3af12ab03630c863dced9b0ae697.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-8cxp95",
						"name": "PhoebeX_043.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/8/878f554f64914143a744724a679841468451b8b4.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-idngwp",
						"name": "PhoebeX_044.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/6/62736225fb41a07dc32c8c1f0d2ea68f28f91736.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-pp2l0k",
						"name": "PhoebeX_045.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/f/fa9b1a1c50dd2092a3d2ef052b47eff3d0b77403.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-4y26hs",
						"name": "PhoebeX_046.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/c/ca19bc9e56ed9b46b5880c0403f6c0462499892f.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-d1q8df",
						"name": "PhoebeX_047.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/7/778e2e0ef56813f710cda941ed956a3412beeec5.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-4gtwrk",
						"name": "PhoebeX_048.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/5/5854931048e31f4245da3d83150d7d43d5abfe49.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-n2fr96",
						"name": "PhoebeX_049.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/b/b466328539cb19d1d0c7aba35607cbc83977c35d.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-xu0a97",
						"name": "PhoebeX_051.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/7/7daf96a69ab1c4ff6ce0369d5049f7739a43a657.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-aisl48",
						"name": "PhoebeX_053.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/7/79347bcd360642066124d259a7d55f12e431be26.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-b3fq24",
						"name": "PhoebeX_054.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/2/298e612fe6c1a85b8c53b14d2387683eb1c7d278.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-1wvxi2",
						"name": "PhoebeX_055.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/5/5186a826b35c6e404c844653715e2cc8bfa9e77a.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-t4byoq",
						"name": "PhoebeX_056.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/f/f8ec4a97b0dd9457f5a933fc129d13b7d0380a2c.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-9f9stp",
						"name": "PhoebeX_057.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/1/1cb564335e9e617722d1af43e4cb5c0eae5965a5.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-2q7f9w",
						"name": "PhoebeX_058.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/6/6d6627b439f54e947ef1e32e8411a70e06c4a30c.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-53fpmi",
						"name": "PhoebeX_059.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/1/1ed23c5959b8e77c64bb079a6daaab11d0768e54.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-88ppbq",
						"name": "PhoebeX_060.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/9/953dd5988e8ce2c35c761d4c1c52c6eb5bfdee65.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-0j6u9u",
						"name": "PhoebeX_061.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/5/54331f71809835d1482ee312d8349f78c533645c.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-oxuvj3",
						"name": "PhoebeX_063.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/6/6afa285885bfa256df3632311f84e6f5c8fb4e48.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-8ub7sm",
						"name": "PhoebeX_065.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/f/f6d10a85d875bc58f88cba7fa5371314ca6ba69b.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-tdxavg",
						"name": "PhoebeX_066.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/3/36a80ea40dd923d5ae0bb7b572f0511e840b6f3f.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-o1ja15",
						"name": "PhoebeX_067.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/5/59f8690ae0cbfb5d48a69d84cdc90d29e621761b.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-tx38cb",
						"name": "PhoebeX_068.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/f/f0868e32caf923efd6cbe79600d5baeefc4f37da.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-0bc525",
						"name": "PhoebeX_069.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/3/383e85a79f98ac4c4eb44479522290c2fa46e89b.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-kx809a",
						"name": "PhoebeX_070.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/2/2948032833f5be6fc8a2662779642db08733b6e8.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-s24j6y",
						"name": "PhoebeX_071.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/2/236cdcb1fbe2fc3e9c1de927701a0e727f72a035.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-csyxti",
						"name": "PhoebeX_072.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/1/13f340e9924dafed77e9d2ab3a5193a44182ab33.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-zdf9ha",
						"name": "PhoebeX_073.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/7/79d7e3f7b3b1d73bd2bc973220cf7cb425cff0f5.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375261-fuslwq",
						"name": "PhoebeX_075.png",
						"packet": 1758505375261,
						"url": "https://idcflare.com/uploads/default/original/2X/3/3dfe07b447e43b9fdeb7dd57c8c1cd4f437e0b90.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-9o4xn7",
						"name": "PhoebeX_077.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/1/1b7fb7ede99fafd8e9cc4e097024715a9e7140ed.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-m44j1v",
						"name": "PhoebeX_078.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/4/476d940977e6b00f58d4634e04b8ac667181b3ab.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-gal861",
						"name": "PhoebeX_079.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/6/6203a910e8e016ccf414597b477902d715111372.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-dnqo3q",
						"name": "PhoebeX_080.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/0/0f7e0b8e07ae6e5c3d07a2ec26e7ad7cf8dce263.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-g9t7z1",
						"name": "PhoebeX_081.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/9/91f8e14fe07445c1528e0c65219ee5b7106ef85b.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-q3rnf3",
						"name": "PhoebeX_082.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/3/31b6df55448200b7de759e04bda5353cf0399efc.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-4fjs6n",
						"name": "PhoebeX_083.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/3/3e6d27cf9a66df7636fa64debde06fa007cb4b49.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-cuovxd",
						"name": "PhoebeX_084.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/3/3e30b271da05765830d17097aae185f8a3ade191.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-44lrw1",
						"name": "PhoebeX_085.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/3/3ac6d0666c1be0f2cf01ba0ec324395f6d8b9929.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-5kz91w",
						"name": "PhoebeX_087.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/8/8a45ed368a49a1784cd198434978b0e51901631d.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-kexlt2",
						"name": "PhoebeX_089.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/4/4eea779e0b6099ab18e7b2f2f014afb88e7c5574.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-ytsn5q",
						"name": "PhoebeX_090.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/9/9bccc0918d6685a259aa71616c1e70643dbe5d48.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-grg9p2",
						"name": "PhoebeX_091.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/6/691f07b63630d6f0247ab90ec9f1544714442286.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-gd9l4z",
						"name": "PhoebeX_092.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/c/cf37829838f316fdd6c1a8b35b6476ee4e2a08bc.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-6yv1j5",
						"name": "PhoebeX_093.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/b/b2bc9a9435126b43c2cd6443c66b9a4dab63beed.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-pxrmpn",
						"name": "PhoebeX_094.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/1/194cd2a8219b7d45e7d7c6ab7640129e880d4e12.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-4agdw1",
						"name": "PhoebeX_095.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/8/8bfd6b0a88bf80a4ce28473ff86fc7a7031abde2.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-trix65",
						"name": "PhoebeX_096.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/a/acc911427a7bef86554dbda37d81451da4bf0705.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-li1aao",
						"name": "PhoebeX_098.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/6/6626f1faa4a9f5f6097aec7e508c9bd872d041d2.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-4hp3f8",
						"name": "PhoebeX_100.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/5/56985a7a62f860f8f80d78f164a002e601851258.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-05wdq7",
						"name": "PhoebeX_102.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/0/02dc331176e3aad192ad9f947f22133079b0eaf4.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-q1vk1v",
						"name": "PhoebeX_103.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/4/493f943d76af7150cdf51703e7f2c7fceba5d56f.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-0w4vpz",
						"name": "PhoebeX_104.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/c/cd5f0810ce09038b7dbfd8f22467dd36d8a4049b.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-o8jifn",
						"name": "PhoebeX_039.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/7/72772261626ad419fd9faa9904400ea900c66f2f.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-66zeg1",
						"name": "PhoebeX_050.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/3/39dc3108982f9c708e50b7f12870e3065109d08d.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-iu6zqn",
						"name": "PhoebeX_052.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/9/9de2fa376b5a57b881d91260fe032ef10aeef84c.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-nxs2ov",
						"name": "PhoebeX_062.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/b/b517da7d3f13fc8ec9b6dfaa53552b639b19f2c7.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-rargbf",
						"name": "PhoebeX_064.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/4/4bbe20633963e6ee1e451fd7f0c1f835ec14f02d.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-loepxn",
						"name": "PhoebeX_076.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/f/fa80e67ccfba00711349bac650cdfa5f41ad3eb0.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-87fjin",
						"name": "PhoebeX_088.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/7/78642402affb5bfafc62e7396deb7cb88dbdf22f.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-jd8elj",
						"name": "PhoebeX_099.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/7/716f4b2f9f0ef8dc117c005a5af8a9ddcd050982.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-hfphp0",
						"name": "PhoebeX_101.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/a/a4c0d297ba99f92369766be1856a2eba9d32226e.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-pksgln",
						"name": "PhoebeX_074.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/e/ee58be7952f1929df5d92209983a62e9dde2d752.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-2tonel",
						"name": "PhoebeX_086.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/1/16bc2c74bc8030fce56250b77081d462134dd522.png"
					},
					{
						"groupId": "group-1758505345831",
						"id": "emoji-1758505375262-p4nz6v",
						"name": "PhoebeX_097.png",
						"packet": 1758505375262,
						"url": "https://idcflare.com/uploads/default/original/2X/1/189bb483c0ac6314ddf69cd39bc62f9c94b0a6cd.png"
					}
				],
				"icon": "📁",
				"id": "group-1758505345831",
				"name": "菲比 IDC",
				"order": 32
			},
			{
				"emojis": [
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-6msqeo",
						"name": "AgAD-wMAAqjlSEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/1/e/9/1e9a748e5c362850177089d87d87f1821022adde.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-se1r2u",
						"name": "AgADAgUAArCwSUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/a/7/f/a7f64d29079a6b30d78dc06b2a5d3c54356bbef1.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-n8v3iq",
						"name": "AgADiwMAAn8VQEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/6/2/a/62ad55347bdeeedc0c9203394c2a8c2e557f227f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-f3sah1",
						"name": "AgADmwQAAh1FQEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/f/e/d/fedab043bbd397060fdd5256d9b4bbb51f8fba34.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-wuyhsl",
						"name": "AgAD0gYAAhhVSEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/7/c/b/7cb46b072ef88066193983daccd759b0abe676a4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-6ds0lz",
						"name": "AgADagQAArjlQEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/4/4/6/44603f39e09102a4330c28912d12bd6d0c2023d0.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-4mtumx",
						"name": "AgADKgQAAuAWQEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/3/f/b/3fb40ad3925bb4a91757259268464a7e0ab5cd64.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-ysrslw",
						"name": "AgADMQQAApdCSUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/b/5/a/b5aeed0e9efa9ed3ba5169a63f92fae7a47b8ddc.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-aikvax",
						"name": "AgADnQQAAsSHQUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/5/1/5/515bb82e5eb5d813e48cfb087897dd01ca486d01.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-0m1cyi",
						"name": "AgADpwMAAkMaSEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/4/b/6/4b60635f63dabaf6d6309a0eca4f395467a10f42.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-ojonok",
						"name": "AgADtAMAAkryQUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/8/7/2/87247d2928a0c2b1924fc6149fcedf566b846b54.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-qzgef5",
						"name": "AgAD3gMAAgu8SUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/6/0/7/6076595f5f9d84981ab886b0c9b14d1d9de07552.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-pif309",
						"name": "AgADbAMAAvr0QUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/b/d/4/bd446fcb8537eec30878f148affd8a772d3f8680.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-muo1g4",
						"name": "AgADLgQAAqQbSUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/f/f/7/ff72ff56678684da9d87a34841ebc91ba7d8e57c.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-ndpj37",
						"name": "AgADrAQAAr9cSEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/9/a/9/9a9bbec62190b622574dcf07a0abeb27c0529d9e.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-u2rnoc",
						"name": "AgADWQQAAjH0QEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/3/4/5/345360325debb0a40254ea118827f85cc73da99f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-wri7fs",
						"name": "AgADxAQAAlfnSUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/c/f/1/cf1282ac90f700be5ca8d20962f61653e490ddeb.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-rqi04o",
						"name": "AgAD-QMAAzlARw.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/a/0/e/a0e5c0a3d7bfd7d1405965ddbba1e811fcff4a32.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-zn3r42",
						"name": "AgAD1gMAAhn6QEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/5/1/9/519608f1a6d3eaaed7e2722ee0d47d4df591d44c.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-5c3a7i",
						"name": "AgAD4wMAArSDQUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/a/c/b/acbe8e34be4e647890d2efe03234f23a04827d90.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-zrvbqv",
						"name": "AgADrQMAAhF4QUc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/6/5/0/65022ee258264b642e8f1c9df5355fdbdfc7517a.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-vh1blf",
						"name": "AgADrwMAAiH3SEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/a/0/a/a0a450953e9af90efaf4a62af52c14165b6de8ff.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-7393bp",
						"name": "AgADsAMAAoPPQEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/8/8/4/884a919ac85f2f01b82089166be44acac5c20751.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-ax9ldg",
						"name": "AgADvQQAAm4_QEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/3/5/d/35d9d90d1ee3a2e7cf5e3b66953844f9b58fc1dd.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-ytac9s",
						"name": "AgADqgQAAn3ASEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/1/d/7/1d7650950e071d16d068b6c37489253172256954.webp",
						"width": 512
					},
					{
						"groupId": "group-1758703744073",
						"height": 512,
						"id": "emoji-1758703751389-x712vk",
						"name": "AgADgQMAAvtWQEc.webp",
						"packet": 1758703751389,
						"url": "https://linux.do/uploads/default/original/4X/2/7/a/27a83cdbbb2e55b28554a82d000b7b2be9ea77f8.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1758703744073",
				"name": "hy2 cn",
				"order": 33
			},
			{
				"emojis": [
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-iib0vl",
						"name": "AgAD0AMAAq73SEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/2/2/0/220778f50c44aed81d29abb1b0ed5755d871a7e2.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-zzneeg",
						"name": "AgADmgMAAobeQEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/d/5/2/d5224cda7e49646ceeb0225bc760f3c731631cbc.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-fn2yvz",
						"name": "AgADUA0AAkkRQUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/3/9/e/39e780638e43fa2be3fec904b76d416935210889.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-6yacs1",
						"name": "AgADXwUAAnnnQUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/4/5/f/45f42bc54411c9d09df243578eedabb9e3e44f8d.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-jg4gct",
						"name": "AgADdgMAAr37QUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/c/d/6/cd6eb3705e418ed18863928225d025478c6ae15b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-wvbf5i",
						"name": "AgADFQMAArBPSUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/8/7/e/87e44e18ed1385a1a2930836a74f82a4ffc0ccae.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-f2nk0q",
						"name": "AgADIQQAAkM9SUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/0/1/0/010c21c40899cd0dc26a0b54b2ef1f77a8e3ab8f.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-qxkhal",
						"name": "AgADOAQAAmy7QEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/5/c/b/5cb9f9dcca4d60b85cb54bb206a7eb3c88238eae.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-of0ms2",
						"name": "AgADqAgAAjv_QEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/3/d/2/3d24ef532efa8ab5e841b94e5f2377d34742e431.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-9006o6",
						"name": "AgADsgMAAijiSUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/e/d/1/ed1c3409172b01fadc5afcd60fd476a5b18b49e6.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-m7zgg8",
						"name": "AgADUQQAAvV9QUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/6/5/a/65a61a976b3181544e8d865b5215e542ba5b52fb.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-zbjnom",
						"name": "AgADWwMAAh_bSUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/b/4/c/b4c76bcd685c2a6ddf54675bc12a653b56bc77e4.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-ze1bf3",
						"name": "AgADXgQAAg-cSEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/e/e/0/ee0064a6327515359c05e29ca8bbb64789450721.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-5vpnhy",
						"name": "AgAD1wQAAnQtQEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/a/e/b/aeb370e379ff2c686e1ad1354940c1bd01050f1d.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-8vrklg",
						"name": "AgAD9gMAAgdAQUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/c/3/8/c38aa720d697ddaed956b7ac4a5f3e22472aacdd.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-92ockv",
						"name": "AgADmwQAAq0YQEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/9/0/4/9048163b10006cd36ce9910d873b9f2e49f450f2.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-i4k0nq",
						"name": "AgADoAMAAowmQEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/a/e/5/ae5786a5a768251ac3746bb3e3b32d692a108b3b.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-jutdxe",
						"name": "AgADqgQAAjzgSEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/3/e/4/3e4448abe29e3860869dcdb734ec49e658fd6094.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-3ydwcd",
						"name": "AgADWgQAAgvaSEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/8/7/7/877fcb9b953ba4cf240a817e3bf9eb8db89976dd.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-vnzbfh",
						"name": "AgADdAQAAvndQUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/6/2/8/62856eff46fca8d03adb606695ad2adf515c71a9.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-uh6672",
						"name": "AgADswMAAm4JQUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/4/a/1/4a1d42f365b1f503251527f79d9c8758c66a1675.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-8mjpc8",
						"name": "AgADSwUAAnhgSEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/a/f/7/af7f0746bc81357749fb1a00fa8f3fee8d1a10a5.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-hkymc5",
						"name": "AgADyQMAAsEVSEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/1/5/1/1512528c236c31460fd0bc5e5ac5ae7445936bce.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-hni7s9",
						"name": "AgADTwQAAhO5QEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/7/e/f/7eff4466a9407ca3f78d465651e7621e66a58512.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-wyjvlm",
						"name": "AgAD9wUAAr7yQEc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/4/b/6/4b6cc679970b1afdf7728980e524a518f2f7ab19.webp",
						"width": 512
					},
					{
						"groupId": "group-1758704054933",
						"height": 512,
						"id": "emoji-1758704062220-auq1wi",
						"name": "AgADjgQAAhTCQUc.webp",
						"packet": 1758704062220,
						"url": "https://linux.do/uploads/default/original/4X/4/1/4/414cdc032e551893a85c8ec299243bf5cde9899b.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1758704054933",
				"name": "hy2 en",
				"order": 34
			},
			{
				"emojis": [
					{
						"addedAt": 1758720653788,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720653788-3t58r8",
						"name": "image",
						"packet": 1758720653788,
						"url": "https://linux.do/uploads/default/original/4X/3/2/1/321359362aaa44d55185e02dc56f3381c7137b34.jpeg"
					},
					{
						"addedAt": 1758720650368,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720650368-591tsg",
						"name": "image",
						"packet": 1758720650368,
						"url": "https://linux.do/uploads/default/original/4X/1/b/7/1b7c34b1d3402683a059396539777ca3152be75f.jpeg"
					},
					{
						"addedAt": 1758720643083,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720643083-amlk76",
						"name": "image",
						"packet": 1758720643083,
						"url": "https://linux.do/uploads/default/original/4X/9/1/f/91f128ff4e26fc7713d453c96e145d787702c553.jpeg"
					},
					{
						"addedAt": 1758720638631,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720638631-e8g900",
						"name": "image",
						"packet": 1758720638631,
						"url": "https://linux.do/uploads/default/original/4X/a/6/1/a61970df319c61c0ee7b1686ef4b94344cff2df6.jpeg"
					},
					{
						"addedAt": 1758720628995,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720628995-d8fmye",
						"name": "image",
						"packet": 1758720628995,
						"url": "https://linux.do/uploads/default/original/4X/3/e/1/3e1c49792f427ec7fd5fba1cae54981c06c1e7d4.jpeg"
					},
					{
						"addedAt": 1758720562675,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720562675-hk8m3q",
						"name": "image",
						"packet": 1758720562675,
						"url": "https://linux.do/uploads/default/original/4X/7/3/6/7369b7e663a4e3de1f4ef339cf38a5a121ec7d23.jpeg"
					},
					{
						"addedAt": 1758720535275,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720535275-78927u",
						"name": "image",
						"packet": 1758720535275,
						"url": "https://linux.do/uploads/default/original/4X/0/f/e/0feadd3167af16e723bba26e7e9ad521c845cce2.jpeg"
					},
					{
						"addedAt": 1758720526720,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720526720-077wgl",
						"name": "image",
						"packet": 1758720526720,
						"url": "https://linux.do/uploads/default/original/4X/7/2/2/72261fd3e9b009417ad428f36dc277d7299f6e44.jpeg"
					},
					{
						"addedAt": 1758720516340,
						"groupId": "group-1758720673759",
						"id": "emoji-1758720516340-0sw3sx",
						"name": "image",
						"packet": 1758720516340,
						"url": "https://linux.do/uploads/default/original/4X/f/a/f/fafaf61270f2a8501130ed7ba5e99ac550248687.jpeg"
					}
				],
				"icon": "F",
				"id": "group-1758720673759",
				"name": "fufu",
				"order": 35
			},
			{
				"emojis": [
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768142731-9p6lgz",
						"name": "rust",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/9/7/6/976a79ba34b067d73051eac781a0c06ea3b4eaa7.jpeg",
						"width": 1300
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768142731-7dg80u",
						"name": "pean",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/3/0/6/30678544168c72772e19aa181c6ce88a7328ae8b.jpeg",
						"width": 1500
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768142731-816oyv",
						"name": "融化冰棍",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/2/d/e/2dea5dea8ddd4a101c3cc3a28360616e516dac22.jpeg",
						"width": 900
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768142731-slfowr",
						"name": "三头",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/1/0/a/10a2661511062ed921eec3143ec4765ac284f054.jpeg",
						"width": 1600
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768142731-c157o5",
						"name": "龙爪",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/8/a/b/8abe3ec87bbca1df0f2cb75970dbc63ae9c29b37.jpeg",
						"width": 1100
					},
					{
						"groupId": "group-1758768122834",
						"height": 1400,
						"id": "emoji-1758768142731-1yraqs",
						"name": "狐鱼打挺",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/a/c/7/ac7c824d07d401650bf9a34796c4c6d8a0ae2d2f.jpeg",
						"width": 1200
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768142731-1aetpd",
						"name": "hat",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/6/b/6/6b624ce45a3a38cc6159c8b4ce555cd912b9e137.jpeg",
						"width": 1800
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768142731-7lxxo3",
						"name": "box",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/4/7/6/476069df03a1a17815dd1e65aefd70009c8eb6e6.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758768122834",
						"height": 1300,
						"id": "emoji-1758768142731-d1zooe",
						"name": "骄阳似火",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/d/3/5/d35aad0eb39edec3a178133463d9a46a56e3aa4d.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768142731-0aadbi",
						"name": "发霉了",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/3/0/6/306925f2e43216fd75c81b1ea057d3942bf3db56.jpeg",
						"width": 1100
					},
					{
						"groupId": "group-1758768122834",
						"height": 1100,
						"id": "emoji-1758768142731-h9cegr",
						"name": "穿梭而活",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/6/a/5/6a5c6c681e11ab3c04f34ad9a4fcd2bc544b6996.jpeg",
						"width": 1400
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768142731-u3v6ur",
						"name": "wear hat",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/7/9/6/7963797a6b01c3a17be33d2fb6d556322244092e.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768142731-kl2qwg",
						"name": "热化",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/2/8/3/283106a46661189ee3cc10dcf058fb3fd0a131ed.jpeg",
						"width": 1500
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768142731-gdnzyx",
						"name": "顶",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/0/2/a/02a90ed7c1c1f458e1569a15325b0070020c2933.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758768122834",
						"height": 1100,
						"id": "emoji-1758768142731-khvt2u",
						"name": "好啊",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/3/e/7/3e7d3d6071f0b02250204bfcab9d37692421395f.jpeg",
						"width": 1600
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768142731-reo7h7",
						"name": "趴下",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/5/b/3/5b363132dced5b6782d6627f4450b87001f8f5be.jpeg",
						"width": 1400
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768142731-0gqtjf",
						"name": "撅屁股",
						"packet": 1758768142731,
						"url": "https://linux.do/uploads/default/original/4X/0/3/c/03c24a0f345c4bddaaee58b33467725088ddac53.jpeg",
						"width": 1200
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768159887-cngxhq",
						"name": "头顶",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/d/8/f/d8ffa9066a9846c245b122ae740ec9f46b177560.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758768122834",
						"height": 900,
						"id": "emoji-1758768159887-4cd1t9",
						"name": "银鱼",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/2/3/9/239d1d21cae354ded08174e00a8948332a3c07ff.jpeg",
						"width": 1200
					},
					{
						"groupId": "group-1758768122834",
						"height": 1500,
						"id": "emoji-1758768159887-dnxbow",
						"name": "哈气",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/6/2/c/62ce147b4ed771454a282725c38ef274a3d79f6e.jpeg",
						"width": 1600
					},
					{
						"groupId": "group-1758768122834",
						"height": 1800,
						"id": "emoji-1758768159887-l36hhx",
						"name": "日下少狐",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/0/f/c/0fc92754ec4717b543cdc11f66db7095d97a468a.jpeg",
						"width": 1100
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768159887-h8f4zw",
						"name": "狐狸三棱镜",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/2/7/d/27d12853ed5dd4c7264ef0a65590843b2b540381.jpeg",
						"width": 1300
					},
					{
						"groupId": "group-1758768122834",
						"height": 1100,
						"id": "emoji-1758768159887-wa71f7",
						"name": "狐狸蝙蝠",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/9/d/f/9dfc261813c436a266a8aadb7f0edecabc5127b1.jpeg",
						"width": 1400
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768159887-s2fnm0",
						"name": "快出残影",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/5/4/8/548b6de5d6dee7458359739ab446b7b977f42db1.jpeg",
						"width": 1400
					},
					{
						"groupId": "group-1758768122834",
						"height": 1600,
						"id": "emoji-1758768159887-1mha7e",
						"name": "飞鱼",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/c/9/2/c92fe7c652d782b5edabc194be7556220d0a820a.jpeg",
						"width": 1100
					},
					{
						"groupId": "group-1758768122834",
						"height": 1400,
						"id": "emoji-1758768159887-fdtlv3",
						"name": "诶",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/9/1/7/917feaab92f25120d1bcdf0cba3b2a5b1a268f3a.jpeg",
						"width": 1100
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768159887-18rsbw",
						"name": "狐象吃苹果",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/a/8/f/a8f07379077052a766019274ae27ad1ca5e6ab93.jpeg",
						"width": 1300
					},
					{
						"groupId": "group-1758768122834",
						"height": 1100,
						"id": "emoji-1758768159887-8oeu4p",
						"name": "狐狸剑鱼",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/6/2/2/6223308fcaa02ebc84c5349b72ff8024aafb9cb8.jpeg",
						"width": 1300
					},
					{
						"groupId": "group-1758768122834",
						"height": 1100,
						"id": "emoji-1758768159887-nzn5c4",
						"name": "倒耳朵",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/a/8/e/a8ec60789ccb9d74a1ac9fcb70080cd9e27a34f5.jpeg",
						"width": 1400
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768159887-3b9mfq",
						"name": "螃蟹吃点",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/c/7/c/c7c6da62fde07e35ab2c29cc223047aad6358d99.jpeg",
						"width": 1400
					},
					{
						"groupId": "group-1758768122834",
						"height": 1200,
						"id": "emoji-1758768159887-1u8mk8",
						"name": "晒黑了",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/b/a/3/ba3349bc2c6e195e7064e6259e06db74c194a139.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758768122834",
						"height": 1300,
						"id": "emoji-1758768159887-ibnuke",
						"name": "猫狐兔",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/7/a/2/7a252fd4fb71b0da909645ef5ef8cbf086cec4d0.jpeg",
						"width": 1e3
					},
					{
						"groupId": "group-1758768122834",
						"height": 900,
						"id": "emoji-1758768159887-txb608",
						"name": "狐豹",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/5/4/1/5411adccb00de0dcf3f9c7a299844231ad5f0093.jpeg",
						"width": 1400
					},
					{
						"groupId": "group-1758768122834",
						"height": 1e3,
						"id": "emoji-1758768159887-w6jpmd",
						"name": "狐狸鲨鱼哈气",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/8/1/a/81ad80f5af3aa37a0879a2c50983868803da9698.jpeg",
						"width": 1300
					},
					{
						"groupId": "group-1758768122834",
						"height": 1100,
						"id": "emoji-1758768159887-qjwgdm",
						"name": "狐狸鸭子",
						"packet": 1758768159887,
						"url": "https://linux.do/uploads/default/original/4X/a/6/c/a6c09fac5cc7e2d94488af3eb3f4b2a855078b81.jpeg",
						"width": 1400
					}
				],
				"icon": "📁",
				"id": "group-1758768122834",
				"name": "ケモミミちゃんつめあわせ",
				"order": 36
			},
			{
				"emojis": [
					{
						"groupId": "group-1759062025953",
						"height": 299,
						"id": "emoji-1759062031971-p05rr2",
						"name": "AgADKRwAAto0KVU.webp",
						"packet": 1759062031971,
						"url": "https://linux.do/uploads/default/original/4X/f/4/5/f451313a2cbc79b2fc1cb7cf8382487c9dd0ea29.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031971-9vofkd",
						"name": "AgADdSEAAtKZKVU.webp",
						"packet": 1759062031971,
						"url": "https://linux.do/uploads/default/original/4X/8/4/1/841ef45e32d45b2f00e0fc2d8fdb4b9d142b47ad.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031971-3i0jdx",
						"name": "AgADeRcAAgvykFQ.webp",
						"packet": 1759062031971,
						"url": "https://linux.do/uploads/default/original/4X/b/9/6/b96ab4ea2fcc82b28b4a2cde1c4982005f3f98e2.webp",
						"width": 422
					},
					{
						"groupId": "group-1759062025953",
						"height": 393,
						"id": "emoji-1759062031971-5qqjaa",
						"name": "AgADExgAAgwgiFQ.webp",
						"packet": 1759062031971,
						"url": "https://linux.do/uploads/default/original/4X/a/f/8/af8bcc9383a040add8c711b50e409c506221d5a2.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-c4qroh",
						"name": "AgADExkAAkO5MFU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/4/a/2/4a2bea46b8897a4cfe283d8b30ab61da42383d3f.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 490,
						"id": "emoji-1759062031972-id374n",
						"name": "AgADExUAAiUfiVQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/8/c/1/8c187246b019ed028ca1b4d661db314c304ec2e9.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-mp95am",
						"name": "AgADFBsAAuKhMFU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/6/c/3/6c3ba3500325a3abca17e2e7a833b00dec5ab1d1.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 373,
						"id": "emoji-1759062031972-775lfe",
						"name": "AgADFhoAAhhTiVQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/f/0/c/f0c66e6642b06ccd6e6b70aed47955efffe50662.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-vayvdr",
						"name": "AgADfhwAAt2pMFU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/6/b/c/6bce4105470500f6df22a3e378edd1f40f8b7673.webp",
						"width": 458
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-89xrvf",
						"name": "AgADGRoAAprbyVQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/d/d/4/dd4453e2f81f120fb55ea740dd665bbc49c1d026.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-sgoatz",
						"name": "AgADhBoAAr9aMVU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/0/1/0/010db175fae7e8536ec5654d3b84c72cbfb88216.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-3h6m5z",
						"name": "AgAD-hcAAn4CgVQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/e/c/7/ec72889382902349537b0c8a0c5c3ac792edf367.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-sxg9jl",
						"name": "AgAD-xgAApSriFQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/1/d/e/1deb40bd4a22ab1014fb1c35a98acea3babbf948.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-5cayvv",
						"name": "AgAD2hsAAharwFQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/4/0/0/400ee88b26a1296d5fbed9d2aac4b3e4cabc4e20.webp",
						"width": 362
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-pm1muq",
						"name": "AgAD2xgAAteH2VQ.gif",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/7/6/a/76aef6c231f8b5032b1dee22685fbf6d39217296.gif",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-j3kcg6",
						"name": "AgAD3RgAAkLrgVQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/8/7/d/87dc00bd7ab247494fd1b46b7e96f4eeb0db5139.webp",
						"width": 437
					},
					{
						"groupId": "group-1759062025953",
						"height": 506,
						"id": "emoji-1759062031972-z6ozis",
						"name": "AgAD3xkAAkZYKFU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/f/0/0/f002095a15b25120dadb119bf7ef1e6744d8f56e.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-r0kzee",
						"name": "AgAD4xUAAkbEiFQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/c/4/d/c4d6e5627a60a1cb47352e860318c7936bde1d39.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 339,
						"id": "emoji-1759062031972-lmvb82",
						"name": "AgAD5xgAAh76MVU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/1/f/a/1fad227856f76c306600e23d260c869d1fe28de0.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-la6yq7",
						"name": "AgAD6RoAAlEuiVQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/b/c/9/bc94b8c44b74d7d17689bcf5d0275dd8a548406c.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-f86m68",
						"name": "AgAD7hcAAiFuKVU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/5/6/8/5683e7fa167e398d18c5832cf8b849c82f5b58c0.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-wsu09s",
						"name": "AgAD8hoAAsPBkVQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/f/4/c/f4c90063f8bbbcd6021e0b9de59afe197b15aa88.webp",
						"width": 290
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-wedc70",
						"name": "AgAD8xcAAihBiFQ.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/d/4/6/d465fcf103a5da91e2a7fb19dc1334fdd661b52a.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-5yf392",
						"name": "AgAD9BcAAkeEMFU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/8/6/d/86d7918b25e6a1559d0b97c8dfbe872214eaf72d.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031972-uyciop",
						"name": "AgAD9BoAAjqfKVU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/d/3/6/d36f9c3cb5c4db6f54ff94310937bf0e7195ffc7.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 328,
						"id": "emoji-1759062031973-szvg3q",
						"name": "AgAD_h8AAgXoKFU.webp",
						"packet": 1759062031972,
						"url": "https://linux.do/uploads/default/original/4X/5/b/0/5b09eda4963de337f8049a2f5a29ffe32d0d5330.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 361,
						"id": "emoji-1759062031973-7c0n5h",
						"name": "AgADaBgAAhjxkFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/8/2/f/82f4c87343e53529fb40436be8a4ef8d2e332627.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-al2o5y",
						"name": "AgADaBkAAuLsiVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/b/5/d/b5d3e1a84affce04bc4d6b285deb9b8b102aefd3.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 290,
						"id": "emoji-1759062031973-zgysoi",
						"name": "AgADaRcAAlFmiVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/6/6/1/661b3589fae14c56dafd3305b0ff48fc9e453a46.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-50w0iz",
						"name": "AgADbBcAArZ1MFU.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/3/5/2/35236fc9420b065114de85119e1526410932bc6b.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-1i1od8",
						"name": "AgADbR0AAiWEiFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/4/0/b/40b637851f4d4e41b330510a13872aae9b1dd643.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-hfb3ti",
						"name": "AgADCRoAApjdkFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/2/7/6/276139c6d158852f25ba83e08f4b7bb1c8451b0d.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 326,
						"id": "emoji-1759062031973-fy5yo9",
						"name": "AgADCx0AAieFiVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/d/0/9/d09b19c8fa59bae7f7fd5707cc7a8de3f0f48b06.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-uhmfsh",
						"name": "AgADDB4AAscBiFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/5/f/3/5f37ef193cf97985b8b8250de28b48b001d3600d.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-2ng0v0",
						"name": "AgADDhwAAvQaiVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/a/e/8/ae8fd0c928fd450c9147be331c247f6acf835bb6.webp",
						"width": 375
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-7ik5hf",
						"name": "AgADdicAAgl8KFU.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/1/d/3/1d34fa5dc16677a7c606aa3f1842bc381503a77c.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 360,
						"id": "emoji-1759062031973-o2tgd1",
						"name": "AgADbRcAApv3iFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/e/9/9/e996647c27639819589e120708a6060c4370a80b.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-nfmmee",
						"name": "AgADbycAAuFoiVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/b/2/5/b25749447b0e0c7ecfa84d42f341c7946875e2bb.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-l1un3a",
						"name": "AgADChkAApw7gFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/a/6/b/a6b4aedf2da795b3778cfde63ed8430728eda7c7.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-8zbufg",
						"name": "AgADCRkAAvkRiVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/b/6/9/b69ca93ac875c7513131d6eb0fc8377d2ff2f01e.webp",
						"width": 428
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-o3dua4",
						"name": "AgADdRsAAjmbMVU.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/f/7/c/f7c6954969d8a69dfd62e72bb4336426e09c8b48.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-9d2jvf",
						"name": "AgADDRsAAuTwwVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/1/2/6/12698c7a3bfd8efe75208e0bbe5cabf6f015d01f.webp",
						"width": 410
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-2fswqk",
						"name": "AgADHBsAAhzyiVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/a/a/7/aa7eeb7fa290500fdd6a4aa07c35dcb57ee166b3.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 384,
						"id": "emoji-1759062031973-0uq7dd",
						"name": "AgADhRgAAlhzkFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/4/c/f/4cf0a85b35a70003add113093356c9b09df6e101.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-nise7l",
						"name": "AgADhRgAArHiiFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/7/c/b/7cb845b69d196c8df9b17ccf3780945cf4ab0c89.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 409,
						"id": "emoji-1759062031973-bwxj68",
						"name": "AgADHxgAAstwiFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/6/d/1/6d10f84e6d5e2b15d5571a51e6d3d46ae1dc8b3d.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-m7w1ia",
						"name": "AgADHxkAAof9MFU.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/f/a/5/fa5bd415f5741f5915b5c59e47cccd41715e2e40.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031973-00c997",
						"name": "AgADHxkAAop9iVQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/6/2/5/625c0d3580cbbcb837b7db4791f59f2954bdae76.webp",
						"width": 328
					},
					{
						"groupId": "group-1759062025953",
						"height": 457,
						"id": "emoji-1759062031973-ngjbiz",
						"name": "AgADhyIAAg3OiFQ.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/5/c/7/5c740585835f972618c61152c09e65edb1b0bfd5.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-qrzi3s",
						"name": "AgADiBcAAmv7MFU.webp",
						"packet": 1759062031973,
						"url": "https://linux.do/uploads/default/original/4X/7/6/0/7602d0eb943bb0e60af992b6bbd6fdd262d55d38.webp",
						"width": 342
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-2yp9za",
						"name": "AgADiRkAAivsMFU.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/a/4/a/a4ac85e8d9645e1a83468883a1a698bd2223383e.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 325,
						"id": "emoji-1759062031974-0j71e1",
						"name": "AgADISUAAkr0gFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/6/6/0/6605819d514f833c20400772f07d0ca402457938.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-famk5u",
						"name": "AgADjBkAAg28KVU.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/a/b/6/ab647d8b1b71aaacd8bbb097168fd8fd5c6dc3fd.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-t9j2iu",
						"name": "AgADjBkAAlcoiFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/1/e/2/1e2eb0e11203d453e539c9c87897da4036b3f491.webp",
						"width": 298
					},
					{
						"groupId": "group-1759062025953",
						"height": 310,
						"id": "emoji-1759062031974-4tsmd5",
						"name": "AgADjBkAAm6gMFU.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/0/e/0/0e0d1b53abfc35a2e1ce8c954c96ca9a0076afe6.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-8cmlzr",
						"name": "AgADJhcAAhNjiVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/6/6/e/66e370c77e0e239f4b9330f391d1eb2d3e2e3985.webp",
						"width": 442
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-9grrzi",
						"name": "AgADjhMAAhTYiFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/8/2/c/82c006a4c3c89935a3ff5987c8c9e8b5e15d40af.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-ky5bcd",
						"name": "AgADJhsAAvIxiVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/a/2/0/a2096cedfd683649ac5e1b098c36d11bc31d443d.webp",
						"width": 455
					},
					{
						"groupId": "group-1759062025953",
						"height": 385,
						"id": "emoji-1759062031974-abkf95",
						"name": "AgADJRoAAlb9gFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/b/a/8/ba84a048bd5059d23ebb45e8fd9b3bc095eb3e55.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 380,
						"id": "emoji-1759062031974-ljd4tr",
						"name": "AgADJxoAAlYbiVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/d/1/b/d1b674fe3b80fbbd7b6d98fdb7b6ca29a38e60b4.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-52i0k1",
						"name": "AgADkRgAArBYiVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/3/5/7/35744ee8f1e50b4c1bad5778b3d805de693a29ad.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-y8j4vy",
						"name": "AgADKxgAAsslKVU.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/8/7/5/8755b609fe288a504ccb3bd13b5816ebf39871b4.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-0f17qp",
						"name": "AgADkxYAAiFAiFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/9/1/5/915f9a3e27cdb0f7b0afbbc83bef15ea6dc8eee7.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-i0rpm3",
						"name": "AgADLhcAAgWcKVU.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/e/d/a/eda3d4270c12e7a6e05f83b768c1397a068a2d69.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-jm41jv",
						"name": "AgADlRsAAnb6iFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/a/e/0/ae0058b42a1e092762757a60a64d2da56fec3e66.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-a4lfsi",
						"name": "AgADnBkAArTBiVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/8/d/6/8d6d7956cb5690a7645a1d48d486d7ef898478d1.webp",
						"width": 357
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-zp0y7i",
						"name": "AgADnRcAAtgcMFU.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/6/d/6/6d606aaba6b061d72573424a0214bd0c55f0505d.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-29lb70",
						"name": "AgADoBkAArBMiVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/b/c/4/bc40828b85be8f6a5946826e37c94f3142b82021.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-752x5n",
						"name": "AgADOBoAAri4kFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/e/e/2/ee2fc328efc1e8c3125356c1d4db438d69947d07.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-sv02bq",
						"name": "AgADOhoAAvxOMFU.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/4/d/c/4dca276671f044fa3e8133066cfd49ce0c797de9.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 410,
						"id": "emoji-1759062031974-2mu40d",
						"name": "AgADoRoAAtDXkFQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/c/e/3/ce317285ce59e1e5b2894983400308c2a55fda01.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 463,
						"id": "emoji-1759062031974-qs9hkg",
						"name": "AgADPBcAAvDniVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/8/f/2/8f23ef323019ac00a2f619b780fbb1036b4a082a.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031974-v9zm6h",
						"name": "AgADPBkAAilDiVQ.webp",
						"packet": 1759062031974,
						"url": "https://linux.do/uploads/default/original/4X/a/3/3/a333eb53f4f4315c1336088d563b99755ebe9497.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-m08v1n",
						"name": "AgADPBsAAlm5iVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/6/d/e/6deb9a3d3ac014d175d87dbec29889b6759d1b9e.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-xwuxpd",
						"name": "AgADphkAAsMIiVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/6/6/6/6661ed0c85f52a502dca961b54e4c78b037f7b05.webp",
						"width": 364
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-qot506",
						"name": "AgADPhwAAliNiFQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/d/0/1/d01c84135772ff852646c7c0bade8b3c29bf3542.webp",
						"width": 470
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-il1g41",
						"name": "AgADpx4AAhgEiVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/1/a/5/1a5baecf2f4be3bd0b4758d27bb523c657fce664.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-o3t8f4",
						"name": "AgADQRgAAul1MVU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/7/4/0/7409dd666c0b63bb0b1cd838e15367283a9025e9.webp",
						"width": 469
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-5ik3uf",
						"name": "AgADrCgAAnUFiVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/e/b/8/eb8b8dee2ffdb6d5ce6cd1ccb5ed37b28496c34d.webp",
						"width": 358
					},
					{
						"groupId": "group-1759062025953",
						"height": 495,
						"id": "emoji-1759062031975-sz4604",
						"name": "AgADRh0AAnf7KFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/4/5/5/4556d6121e0c2263907e982dc25f6476bd6ab0dd.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-uav979",
						"name": "AgADrhcAAnCIMVU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/b/b/d/bbd4f613ee987e3943f8ed523716f3767e1621c9.webp",
						"width": 386
					},
					{
						"groupId": "group-1759062025953",
						"height": 481,
						"id": "emoji-1759062031975-qu8tpv",
						"name": "AgADrxYAAme9kVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/a/e/0/ae07a8a6fc56228d4cf9bc19f79378fc2fb44351.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 392,
						"id": "emoji-1759062031975-1l5lf8",
						"name": "AgADrxYAAnu9MFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/a/a/9/aa91f45dc32498bd4f39adc54996d45fa79e9b07.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-rjxw1h",
						"name": "AgADryUAAlRPMFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/0/d/b/0dbdbc9cfac02440325d5c77c7eb76fcc23270eb.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-en9915",
						"name": "AgADsBYAArRciFQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/9/b/5/9b52cdb7b4234640db252def4502f8c04f7dba30.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-8hhrv7",
						"name": "AgADsxUAAqpliVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/3/5/d/35de1d7ce57b645e78321a3583e9ee9cd7442ff1.webp",
						"width": 375
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-bcstyj",
						"name": "AgADTBoAAgdPMFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/3/3/4/3343002806928b6044d9019467608dbea84ba2cd.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-scbgcu",
						"name": "AgADtRgAAtWKMFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/9/9/4/9947fc80f42212b5e52a80372bfc3becba39f0d5.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 358,
						"id": "emoji-1759062031975-9gepcs",
						"name": "AgADuBcAArCcKFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/5/5/4/554950c273b1474875108699ee2c1db8054f5e93.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-1nq7en",
						"name": "AgADuBkAAoRJiFQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/0/5/4/0544d99a6658687a107b10e93bbe805fb0ddd5fb.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-txnay6",
						"name": "AgADuBoAAlpikFQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/6/9/f/69f4c8eb4bdf9cb6abff843a65e1247d13aaedb8.webp",
						"width": 422
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-qe297n",
						"name": "AgADuRwAAlAWiVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/c/d/d/cddee3e5ba08fb11ba71e51055ebc25be10ca59c.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-gvvkkh",
						"name": "AgADuxkAAlaPMVU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/4/6/8/4680b7a51137a142cfbf853bbc8b9122bec0e69b.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031975-hbi8xw",
						"name": "AgADUxYAAgcUMFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/c/b/1/cb1c0cdaa86aa66163bf335fd99d69681a86ed55.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 432,
						"id": "emoji-1759062031975-37kyke",
						"name": "AgADVB4AAv0ViFQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/2/1/2/2122b63c42cb1d2f1f8698dba752703435b50032.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 486,
						"id": "emoji-1759062031975-vce3ji",
						"name": "AgADvhcAAgLZKFU.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/0/2/b/02b278ce5dd847a3e980e5cde29bd9c9aca66183.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 433,
						"id": "emoji-1759062031975-fz0qva",
						"name": "AgADVhcAAun7iVQ.webp",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/7/4/5/745f3614a1ad676cb5ce14661dbe9a5f91b7169b.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-bjneyr",
						"name": "AgADvxgAAugs4VQ.gif",
						"packet": 1759062031975,
						"url": "https://linux.do/uploads/default/original/4X/6/6/b/66bb8ecad1462cda317efdae39aeb0123f5d1e96.gif",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-xit1s9",
						"name": "AgADvxoAAsiTgVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/b/a/6/ba63ebaf0f1c7ab3db3e20781ee1cc98e405ad56.webp",
						"width": 470
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-7q8gm1",
						"name": "AgADWRkAAqn1kVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/6/3/c/63c639a2150cc4961952179598a25b12e74e6fe7.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-h8a47i",
						"name": "AgADwxYAAgzRiFQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/7/1/2/7123247d98eee47e2df0c39288705e3706e74a5e.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 382,
						"id": "emoji-1759062031976-7gis00",
						"name": "AgADxxkAAuWQyFQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/0/7/e/07e6a46aa382503b26602006549a58228416de46.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-ek6fmz",
						"name": "AgADyhcAAo4viVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/a/4/2/a42ea57bba4fa27ad921cd465e745b98425ab464.webp",
						"width": 414
					},
					{
						"groupId": "group-1759062025953",
						"height": 398,
						"id": "emoji-1759062031976-hxa62a",
						"name": "AgADyhgAAveaiVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/3/f/a/3fa5ff9bd752ed31d66b2cb8d3a08037f6169d08.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-wsown1",
						"name": "AgADyhYAAo_jMFU.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/f/c/9/fc9a05a67eb27084b5a5290679f17b11da85abb4.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-ua0srm",
						"name": "AgADYRgAAmKnMVU.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/5/b/6/5b6d2bad30c2c98a1cd7b85e7e6d2fd762e8609d.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 370,
						"id": "emoji-1759062031976-xnesim",
						"name": "AgADyxsAAwkxVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/1/d/e/1deb1966dae9be659841e09a2f7a2ce2413a6c79.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-jcgtk4",
						"name": "AgADzxkAAnS3iVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/c/8/9/c898fe9cde1b779c7214db1ba6a75f816a953ae3.webp",
						"width": 470
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-ft7bln",
						"name": "AgAEGAACDV0oVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/d/1/5/d156dcfa7f598e08c9dbb8d6b3493b1e204fe135.webp",
						"width": 440
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-m5b04f",
						"name": "AgADiRkAAqO1MFU.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/d/8/8/d88f294103492faecc5113addc6660acf703894c.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 394,
						"id": "emoji-1759062031976-xppm49",
						"name": "AgADJhoAAjbfkVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/4/d/6/4d6519a8745df0389e229fc6dd022422508e8c00.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-gd9fcg",
						"name": "AgADNRoAArzSiVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/a/b/3/ab33448017bb964e6e8b45b03e1b489fe305bc8e.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 420,
						"id": "emoji-1759062031976-opa1iw",
						"name": "AgADPBcAAtstkVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/2/5/7/25728e9815c3151656be8d5ad4c7d6fa36988c27.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-l49wdj",
						"name": "AgADPxgAAqJlKFU.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/0/6/9/06991c56fde17289f27fd7b10afec1ff9336965a.webp",
						"width": 330
					},
					{
						"groupId": "group-1759062025953",
						"height": 349,
						"id": "emoji-1759062031976-s657e5",
						"name": "AgADRRwAAv5TiFQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/e/b/9/eb9f6f8509c4224ccbedb689d4dfb40373623413.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-8znlz1",
						"name": "AgADThcAAmKRiVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/6/6/a/66aa10799b9f461f299294982da04dd70c973568.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 424,
						"id": "emoji-1759062031976-kifwvq",
						"name": "AgADURsAAk1tyFQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/8/0/8/808b7690a9d2fe106fd2d0417a34897391b9de7e.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 382,
						"id": "emoji-1759062031976-c9cuc6",
						"name": "AgADZBkAApB0iFQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/4/b/f/4bf4551ba80415724a1780a5e1aa73bedff32db8.webp",
						"width": 512
					},
					{
						"groupId": "group-1759062025953",
						"height": 512,
						"id": "emoji-1759062031976-htweml",
						"name": "AgAD7xUAAt0ZkVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/8/9/4/8946791b3c9afc1f8abc3238673b62e33dc5e46e.webp",
						"width": 436
					},
					{
						"groupId": "group-1759062025953",
						"height": 360,
						"id": "emoji-1759062031976-q2xfrs",
						"name": "AgADxRkAAieiiVQ.webp",
						"packet": 1759062031976,
						"url": "https://linux.do/uploads/default/original/4X/a/c/e/ace1576aea5669ec6fb7e23141afe80440c6f4d8.webp",
						"width": 512
					}
				],
				"icon": "📁",
				"id": "group-1759062025953",
				"name": "少女2",
				"order": 39
			},
			{
				"emojis": [
					{
						"addedAt": 1759062117821,
						"groupId": "group-1759062077224",
						"height": 468,
						"id": "emoji-1759062117821-wi0kkn",
						"name": "image",
						"packet": 1759062117821,
						"url": "https://linux.do/uploads/default/original/4X/9/1/5/915f76f23958c8208ef909a63fe441fb65f13932.jpeg",
						"width": 442
					},
					{
						"addedAt": 1759062109582,
						"groupId": "group-1759062077224",
						"height": 462,
						"id": "emoji-1759062109582-osgavq",
						"name": "image",
						"packet": 1759062109582,
						"url": "https://linux.do/uploads/default/original/4X/2/2/5/225bc59a2d35425c04432861990ddf6d7d65b547.jpeg",
						"width": 434
					},
					{
						"addedAt": 1759062100179,
						"groupId": "group-1759062077224",
						"height": 476,
						"id": "emoji-1759062100179-jjlmb9",
						"name": "image",
						"packet": 1759062100179,
						"url": "https://linux.do/uploads/default/original/4X/5/2/a/52a1c39cf06541188b92eb9b7c8c8eac4f461191.jpeg",
						"width": 310
					},
					{
						"addedAt": 1759062090833,
						"groupId": "group-1759062077224",
						"height": 508,
						"id": "emoji-1759062090833-u7u0bj",
						"name": "image",
						"packet": 1759062090833,
						"url": "https://linux.do/uploads/default/original/4X/8/9/b/89ba65b649dd9a890505087bc419d5e2c94e9df9.jpeg",
						"width": 378
					}
				],
				"icon": "📁",
				"id": "group-1759062077224",
				"name": "アマカノ3",
				"order": 40
			},
			{
				"id": "group-1759064721561",
				"name": "令时焥夏KiriAINa",
				"icon": "https://linux.do/uploads/default/optimized/4X/e/b/6/eb61ad449326caa5ae203c6346fd40c71e71068f_2_500x500.jpeg",
				"order": 41,
				"emojis": [
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739416-8njln6",
						"name": "image",
						"packet": 1759064739416,
						"url": "https://linux.do/uploads/default/original/4X/9/b/7/9b75970972abbb128364060847f2242166e04fa1.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739416-5qtzra",
						"name": "image",
						"packet": 1759064739416,
						"url": "https://linux.do/uploads/default/original/4X/f/0/9/f09ae171fea214ed90ec525bfeca5cdc1d054f95.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739416-wkphyy",
						"name": "image",
						"packet": 1759064739416,
						"url": "https://linux.do/uploads/default/original/4X/5/2/2/522a942d2f215c795ddeda672851f1829fc58031.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739416-ceocu6",
						"name": "image",
						"packet": 1759064739416,
						"url": "https://linux.do/uploads/default/original/4X/f/8/e/f8ed90bed7e214e79049c8fbffcaa74f25bb1cf7.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739416-s7bitc",
						"name": "image",
						"packet": 1759064739416,
						"url": "https://linux.do/uploads/default/original/4X/1/6/2/1624c6ba2966f8df31adaa349c6f44ca182d1fc7.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739416-ncx6ub",
						"name": "image",
						"packet": 1759064739416,
						"url": "https://linux.do/uploads/default/original/4X/c/6/e/c6ebe215ba1d811ba24f0eb71973e822ffd5ae23.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739416-1oqc93",
						"name": "image",
						"packet": 1759064739416,
						"url": "https://linux.do/uploads/default/original/4X/9/8/0/9802132cf7d635ac9dce2ee622ddc1045cdcdff6.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739417-8llknv",
						"name": "image",
						"packet": 1759064739417,
						"url": "https://linux.do/uploads/default/original/4X/3/7/b/37b1b1b693469525ffd7373e71b33e525985ed20.jpeg"
					},
					{
						"groupId": "group-1759064721561",
						"id": "emoji-1759064739417-r7yb0n",
						"name": "127904817_p0",
						"packet": 1759064739417,
						"url": "https://linux.do/uploads/default/original/4X/e/b/6/eb61ad449326caa5ae203c6346fd40c71e71068f.jpeg"
					}
				]
			},
			{
				"id": "group-1759065160041",
				"name": "超",
				"icon": "📁",
				"order": 41,
				"emojis": [
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-c2tk6g",
						"name": "AgADmQQAAngt6UQ.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/a/7/9/a794d4d2cc49acaf22546c0e3fc2289b1d7a0a7b.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-kj7vd1",
						"name": "AgAD1QIAArFbiUU.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/2/3/e/23e275841ac26631d289d368352c33e4a6c009a7.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-5xhnun",
						"name": "AgAD5gQAAn-88UQ.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/6/8/b/68bf2a4565b91c73ef87d4a4de7884e841fbcd7a.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-m6lkkb",
						"name": "AgAD8gIAAitwcUU.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/8/4/7/8473b7eb90ff1836ebefc969be23defea47316fb.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-snsf3c",
						"name": "AgADBwMAAqtniUc.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/2/e/2/2e2c0094990eaa6496b5df2446c4fee05dcf4397.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-t320tx",
						"name": "AgADDQQAAqzvkUc.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/b/5/1/b510a67e26556a8cb76f1e1653ca43f179972c8f.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-raa4zf",
						"name": "AgADGgMAAr-lwEY.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/4/b/1/4b19a3717472951da77031b06df17d39b6b2bde2.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-aeg900",
						"name": "AgADKAQAAvt5uUY.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/7/6/a/76ad8ebf6319dfec38dd075691c02de63c12eb9f.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166760-ynpxq5",
						"name": "AgADLgQAAlfeiEU.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/e/1/f/e1f3f5b2eb520b7386e3f3a1e5c5a3ff66ce57ad.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-fjb1x3",
						"name": "AgADOQMAAlJnaEU.webp",
						"packet": 1759065166760,
						"url": "https://linux.do/uploads/default/original/4X/4/6/a/46a88a4ef69f3bac1e0a68eec2ad3466cc1ece4f.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-78qvoa",
						"name": "AgADPQQAAr3ecUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/4/0/8/408caaf4880e6aed96e79d9c2c9c781fec8333b6.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-fldif1",
						"name": "AgADcAQAAu0Z8EQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/4/9/6/496ad4c723461ee5655b232a03a3dce48426ec83.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-xwu4v7",
						"name": "AgADeAMAAoEKcUQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/e/2/f/e2fac16abbfc68d7b24b1c6dd4eb8f1bed4dd003.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-3unkku",
						"name": "AgADkgQAAiZ6aUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/1/9/8/198e861ac9f27beae9a6719ebabb2cc88e973a6e.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-txmm1q",
						"name": "AgADnwMAAjhfiEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/3/c/6/3c64f3965391f43f94b20f74dbdbed36d31cdc39.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-h2ztaq",
						"name": "AgADqQMAAjzqwEY.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/8/9/5/895390f08463f3ed5184655d95c82577a8d5a6b4.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-eohto5",
						"name": "AgADuQUAAjwdoEQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/3/0/3/303c278f1d3331c355b9b4097c9c14008f8eb516.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-mnohn2",
						"name": "AgADzAMAApe9cEQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/3/c/3/3c3bc74dec059c26c79c2b151c1780ae5c645cdd.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-973evk",
						"name": "AgADDwQAAp3uaEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/c/2/b/c2bad78cfd0a916ed2ba340b1fbadcab3d5e5f14.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-7gpcxt",
						"name": "AgADHwYAAi4M8EQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/e/8/0/e806d884e35b312d07474c1ba1760e62922270a1.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-rjdd9b",
						"name": "AgADOwgAA29pRQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/4/c/b/4cb36c82df65c479a5cba152b5d436d1c522c7d4.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-k1q82c",
						"name": "AgADeQMAAlLGaUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/0/1/2/012c1e06c52f5df8a0f6ed53551762541bdcf2c2.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-llrr20",
						"name": "AgADmAIAAgF2iEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/9/2/7/9272a6fd0cb3cbbbbd101ed51163628965890ad2.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-kd7s2h",
						"name": "AgADwQIAApKrwEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/6/e/a/6ea7237f4dea21eeb19e5ae293565e86da914598.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-qgxb25",
						"name": "AgADmAQAAiml6UQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/6/b/6/6b6f79e8e945f3961229f36ccdb3cacc7273a494.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-33gj63",
						"name": "AgADOwMAAs7CaUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/a/c/6/ac6b03c8ad5b108375f4d07ef396976ec1bbde46.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-o6v6dh",
						"name": "AgADnQIAAuW0wEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/3/5/4/354f1dadc8a3ccfbf3135e5a488bbffaf64d0595.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-ltbj5f",
						"name": "AgADuQUAAvQq6EQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/0/c/6/0c6004ed967d338a68f3bcdb4dfec1c677dfbfb2.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-059mqp",
						"name": "AgAD3gMAAvi1aUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/0/b/c/0bc58579e9f0675d7623d75cb7c3f685c903e1b5.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-s7f7xq",
						"name": "AgAD6gMAAo7McEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/5/b/8/5b850ef2e479d396cef32b4fe5a0d71f6931bcc4.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-vu739g",
						"name": "AgAD9AIAArAzaUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/e/b/8/eb82fd0b5518e2286d53d005624bf700b6562571.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-lx0o9p",
						"name": "AgADCQUAAvKa8EQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/8/3/d/83de912d91cad700343b682b0b88afdd473bf9fb.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-rqpmzr",
						"name": "AgADEAMAAsPOaEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/a/9/8/a980169f93cf9057e5f3ceba684545e6ec041f6a.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-5wasm8",
						"name": "AgADHwMAAk53cUQ.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/e/7/9/e797ee419300b1ac5a6c15b5287b0571deb727f6.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-a0e7j7",
						"name": "AgADLQMAAm9maUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/5/8/a/58a53ebc94d1d09fb2ea03b6d31355443645969d.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-1th7sd",
						"name": "AgADMAIAAq5faEU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/2/a/4/2a468b458c41cfb5d049628c32d3f8fd2fdcb5fe.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-b0vqjc",
						"name": "AgADOgMAAkM-wUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/a/c/c/acc82c716c74e057e7c4f8ac522040c65c3270eb.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-04sxvg",
						"name": "AgADSgMAAkwhwUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/1/2/6/1260bc32a0147460314f8cf7c7815446024f617b.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-cy6pga",
						"name": "AgADcQMAArxBaUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/f/2/1/f2167905ae1fe1681f101675654b0cbd67d638e2.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-tf8x1k",
						"name": "AgADeAQAA3ToRA.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/e/1/4/e1445dde835014fb2dc7a9b978a789ac03ce1e65.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166761-5nsg0j",
						"name": "AgADlAMAAmtraUU.webp",
						"packet": 1759065166761,
						"url": "https://linux.do/uploads/default/original/4X/0/9/9/099e59bfdfcf4339300d272678c04a0c60b92d84.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-48m82d",
						"name": "AgADpgIAAjGUaUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/c/1/2/c128cda5c84ae49e07d0bb657518e5545f6a1157.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-q7d71z",
						"name": "AgADrAQAAk_naUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/2/6/a/26a07778a254bf104de4e7208b6acfbaba16e65a.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-r2n4qp",
						"name": "AgADvQIAAo8hiEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/5/b/6/5b6072a39aeedccf81c9e4e60934d21143b91d2e.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-k5z4dc",
						"name": "AgADzAMAAswHcUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/0/a/1/0a1361ae33794fffab50cd7c7e1cdc628b5addeb.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-hzwsb1",
						"name": "AgADGAMAAtcawEY.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/6/f/c/6fcd09fd687d9f740986cd71d06a3df965733881.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-gnbjqz",
						"name": "AgADKwQAAs9NcEQ.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/6/7/2/67237525696693a7b95735394a2e4df4cc54ae4e.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-8yg1db",
						"name": "AgAD_gMAAnaHmUc.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/f/f/d/ffd3cb638269f85c56e917b1b7441a74c6564ec3.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-phuln7",
						"name": "AgADkQMAAjAkcUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/c/1/1/c115d30123c7f16875811295f204c756f35d65e9.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-25snmc",
						"name": "AgADqwMAAgI6aEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/0/2/9/029dfe5dac95eef426492acaa8073f0e1d0039c5.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-3t5rm7",
						"name": "AgADKAQAAlQkwUY.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/b/4/0/b409a76a2af825e33d02f61dab6b979f75fe0891.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-qqcpfj",
						"name": "AgAD6wIAAmRnkUc.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/4/4/b/44ba2e60f7cda0327b24bdb43263b93db8dd1bc5.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-bhejh4",
						"name": "AgADPgQAAtdRuEY.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/8/2/9/829bb9935053a54894d5a18342865636c4c489bf.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-5kw5eo",
						"name": "AgAD0wIAAoB8aEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/1/a/1/1a11dcabc319769048fd21a0ae874639905ff7f1.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-q4kltn",
						"name": "AgAD4QIAAoDeaEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/8/0/a/80a6dfb347168900b096a2871f7b5d2bca3e4834.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-6wmqro",
						"name": "AgAD8QQAAvWiaEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/5/9/d/59d30b4ec427e86e7fba6ad4e706faa5328ad2bd.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-vgqxmz",
						"name": "AgAD-QIAAkpoaEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/2/a/7/2a7d1f562dcf441a7217c6b5b798290062de5afc.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-lahxpg",
						"name": "AgADCwQAAnUuoEQ.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/1/a/0/1a07c120201cc202b2a3c278f58201f70505b198.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-mnjthu",
						"name": "AgADFgQAAhAvaEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/2/6/0/2601e005524e3f979ab365c56788428261f178b1.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-4ju5i4",
						"name": "AgADJwMAArsPoEQ.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/a/1/e/a1ef60cf374e361161de3912f1b9ca4d1ebd5fa9.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-in5ol0",
						"name": "AgADLgMAAqdRcEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/b/f/f/bff1e92bf8f8b45ae1373a0e393b271c96586490.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-jtrlc0",
						"name": "AgADNgMAAiH9cUQ.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/a/0/c/a0cb1b586c45aad41892590d2bc86db0bc319d41.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-6nj15m",
						"name": "AgADOwQAAuLOwUY.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/7/6/3/7631124500069c7857f8c5b93888eb313cba9a39.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-oz00ib",
						"name": "AgAD_wUAAhfo6EQ.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/5/e/e/5ee823195a9d345cb3f256ebf5a3230fe4e4e51c.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-u3b6d4",
						"name": "AgADdwMAAlDFmEc.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/c/9/b/c9b931a707149aa82310a44e2277875b560a7d68.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-lk499s",
						"name": "AgADgwIAAukEwUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/9/6/e/96e72aef19ef815a7819185043997bef90d021e1.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-evuqi2",
						"name": "AgADnQgAAgxpaEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/6/2/b/62be843e09d28694ffc3294c3e37e16921fe3f51.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-68nkcu",
						"name": "AgADqAMAAi_WaEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/8/c/e/8ce4f3bf6521faf18119666a8a5b8f02ba617e30.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-8qvmrh",
						"name": "AgADtwMAAqywcEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/1/2/e/12e21c899542197fdfd694e818e5868a9a56f728.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-wyv9vg",
						"name": "AgADxwUAAj7y8UQ.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/f/2/0/f20d43b84ebc3c1ac31fbd8c6b0fbe544dba4ee3.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-n64ajk",
						"name": "AgAD-AMAAjePcEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/a/6/9/a694487eeab39b1d84aaa8955d63318eb656ab4b.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-w1dq9k",
						"name": "AgADHgMAArCVaEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/1/a/f/1aff5e28911039eb8c723c2ce2360d1d3dcf5ed9.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-1kq56e",
						"name": "AgADOQMAApNbcUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/e/5/6/e5638715ad4ebb752b6fa5384e58211a48e444d2.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-jes4wm",
						"name": "AgADdwMAAo4gaUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/6/f/2/6f20ee3ec6c34ec8ab556b11f5da0aabbdf91694.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-hx6jog",
						"name": "AgADkgYAAqaFaUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/1/b/e/1becf465a04b5eef6039140bab946a847505a6e6.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166762-fpneqx",
						"name": "AgADuQMAAlJOcUU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/b/c/8/bc8fa10f8242d4e51bc320ec58dee3b185dfca09.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166763-kslk5f",
						"name": "AgADmgMAAknriEU.webp",
						"packet": 1759065166762,
						"url": "https://linux.do/uploads/default/original/4X/8/b/e/8beaad82b40780d3c05e5e18874e5a5598d26b0d.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166763-yt7dnk",
						"name": "AgADMwQAAvfXaEU.webp",
						"packet": 1759065166763,
						"url": "https://linux.do/uploads/default/original/4X/c/a/c/cacb61ef31e96eca948962896a3c74f48e337597.webp"
					},
					{
						"groupId": "group-1759065160041",
						"id": "emoji-1759065166763-s6eeif",
						"name": "AgADyQMAAtdTuEU.webp",
						"packet": 1759065166763,
						"url": "https://linux.do/uploads/default/original/4X/2/0/6/206fe6458da728a1799f303cfc77a0623206cf8f.webp"
					}
				]
			},
			{
				"id": "group-1759065232486",
				"name": "服务器",
				"icon": "📁",
				"order": 41,
				"emojis": [
					{
						"packet": 1759065244912,
						"name": "AgAD1wUAAvCC2VQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/4/4/8/4487e77a752fffe2aafeb9d3b5e544754c613814.webp",
						"id": "emoji-1759065244912-2kioo8",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgADagUAAkhu2FQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/e/e/d/eed01d322e1014aea4b170d4c5c112ab4877afee.webp",
						"id": "emoji-1759065244912-wizuix",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgADogYAAtZ_oVY.webp",
						"url": "https://linux.do/uploads/default/original/4X/d/1/4/d1482c9230f8b5a7bb143e7eaff83eb27abb2b36.webp",
						"id": "emoji-1759065244912-napbti",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgADbwUAAhXawFQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/a/f/9/af9f35ab8c6376c3bef9fa6da4675b7feb0b0564.webp",
						"id": "emoji-1759065244912-12bs2t",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgADqQYAAv2mwFQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/9/8/d/98deb245f9471a231d7f6e89992d3e2f5a2e2f2e.webp",
						"id": "emoji-1759065244912-g67he5",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgAD1wcAAtBl-VQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/6/2/8/62892d081b0795a7cccee6b91bde632762e2eeb7.webp",
						"id": "emoji-1759065244912-rr5j12",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgAD6wUAAimy0FQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/d/1/6/d16cb1a26e4e450454ba4386a944bbb1c501c70e.webp",
						"id": "emoji-1759065244912-ckjiha",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgADIQgAAgSq2FQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/0/e/6/0e6073f4032892bca8f5c5cfe9a839fa2db7f0f8.webp",
						"id": "emoji-1759065244912-ps737e",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244912,
						"name": "AgADvgcAAp8Z2FQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/9/a/e/9ae474c085b835f5b11058c0dd379ec78d0d365a.webp",
						"id": "emoji-1759065244913-4zzcg1",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADdAgAAoo8yVQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/2/e/3/2e38f2ed417dccd5b9d90136a9e951b5d7b403c9.webp",
						"id": "emoji-1759065244913-jyq0zw",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADqwUAAu110FQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/5/5/2/5528c9f1e220777f40aecdcd06f3b76cb2ee121c.webp",
						"id": "emoji-1759065244913-pszaqj",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADywUAAnW_0VQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/e/f/8/ef844fe6e0464d692661d2c67e305e0a9f83e58c.webp",
						"id": "emoji-1759065244913-q2l7v5",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADTgcAAp2J0FQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/1/2/b/12bae6b197f55b03ed511add5a795e44db5307fc.webp",
						"id": "emoji-1759065244913-mfwr23",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADNAkAAtrwwFQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/e/5/c/e5c68fc7422e10038972294ef49dd4d94750e2b5.webp",
						"id": "emoji-1759065244913-ic2eke",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADxQUAApe62VQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/2/4/1/241c1f04ec0019c4003e18ff53b23f442c72119a.webp",
						"id": "emoji-1759065244913-r6hm23",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADDwkAAoO2oFY.webp",
						"url": "https://linux.do/uploads/default/original/4X/2/a/c/2acf09717d2c32b22b4e614b5e60a47415e64f6c.webp",
						"id": "emoji-1759065244913-jxi4ct",
						"groupId": "group-1759065232486"
					},
					{
						"packet": 1759065244913,
						"name": "AgADTwoAAifX-FQ.webp",
						"url": "https://linux.do/uploads/default/original/4X/1/5/3/153ff744f16cdcfb401a06fefb36d54d99c2171c.webp",
						"id": "emoji-1759065244913-egwn99",
						"groupId": "group-1759065232486"
					}
				]
			}
		];
	}));
	async function loadDefaultEmojiGroups() {
		return defaultEmojiGroups;
	}
	var init_defaultEmojiGroups_loader = __esmMin((() => {
		init_defaultEmojiGroups();
	}));
	function loadDataFromLocalStorage() {
		try {
			const groupsData = localStorage.getItem(STORAGE_KEY);
			let emojiGroups = [];
			if (groupsData) try {
				const parsed = JSON.parse(groupsData);
				if (Array.isArray(parsed) && parsed.length > 0) emojiGroups = parsed;
			} catch (e) {
				console.warn("[Userscript] Failed to parse stored emoji groups:", e);
			}
			if (emojiGroups.length === 0) emojiGroups = [];
			const settingsData = localStorage.getItem(SETTINGS_KEY);
			let settings = {
				imageScale: 30,
				gridColumns: 4,
				outputFormat: "markdown",
				forceMobileMode: false,
				defaultGroup: "nachoneko",
				showSearchBar: true,
				enableFloatingPreview: true,
				enableCalloutSuggestions: true
			};
			if (settingsData) try {
				const parsed = JSON.parse(settingsData);
				if (parsed && typeof parsed === "object") settings = {
					...settings,
					...parsed
				};
			} catch (e) {
				console.warn("[Userscript] Failed to parse stored settings:", e);
			}
			emojiGroups = emojiGroups.filter((g) => g.id !== "favorites");
			console.log("[Userscript] Loaded data from localStorage:", {
				groupsCount: emojiGroups.length,
				emojisCount: emojiGroups.reduce((acc, g) => acc + (g.emojis?.length || 0), 0),
				settings
			});
			return {
				emojiGroups,
				settings
			};
		} catch (error) {
			console.error("[Userscript] Failed to load from localStorage:", error);
			console.error("[Userscript] Failed to load from localStorage:", error);
			return {
				emojiGroups: [],
				settings: {
					imageScale: 30,
					gridColumns: 4,
					outputFormat: "markdown",
					forceMobileMode: false,
					defaultGroup: "nachoneko",
					showSearchBar: true,
					enableFloatingPreview: true,
					enableCalloutSuggestions: true
				}
			};
		}
	}
	async function loadDataFromLocalStorageAsync() {
		try {
			const local = loadDataFromLocalStorage();
			if (local.emojiGroups && local.emojiGroups.length > 0) return local;
			const remoteUrl = localStorage.getItem("emoji_extension_remote_config_url");
			if (remoteUrl && typeof remoteUrl === "string" && remoteUrl.trim().length > 0) try {
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 5e3);
				const res = await fetch(remoteUrl, { signal: controller.signal });
				clearTimeout(timeout);
				if (res && res.ok) {
					const json = await res.json();
					const groups = Array.isArray(json.emojiGroups) ? json.emojiGroups : Array.isArray(json.groups) ? json.groups : null;
					const settings = json.settings && typeof json.settings === "object" ? json.settings : local.settings;
					if (groups && groups.length > 0) {
						try {
							localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
						} catch (e) {
							console.warn("[Userscript] Failed to persist fetched remote groups to localStorage", e);
						}
						return {
							emojiGroups: groups.filter((g) => g.id !== "favorites"),
							settings
						};
					}
				}
			} catch (err) {
				console.warn("[Userscript] Failed to fetch remote default config:", err);
			}
			try {
				const runtime = await loadDefaultEmojiGroups();
				const source = runtime && runtime.length ? runtime : [];
				const filtered = JSON.parse(JSON.stringify(source)).filter((g) => g.id !== "favorites");
				try {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
				} catch (e) {}
				return {
					emojiGroups: filtered,
					settings: local.settings
				};
			} catch (e) {
				console.error("[Userscript] Failed to load default groups in async fallback:", e);
				return {
					emojiGroups: [],
					settings: local.settings
				};
			}
		} catch (error) {
			console.error("[Userscript] loadDataFromLocalStorageAsync failed:", error);
			return {
				emojiGroups: [],
				settings: {
					imageScale: 30,
					gridColumns: 4,
					outputFormat: "markdown",
					forceMobileMode: false,
					defaultGroup: "nachoneko",
					showSearchBar: true,
					enableFloatingPreview: true,
					enableCalloutSuggestions: true
				}
			};
		}
	}
	function saveDataToLocalStorage(data) {
		try {
			if (data.emojiGroups) localStorage.setItem(STORAGE_KEY, JSON.stringify(data.emojiGroups));
			if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
		} catch (error) {
			console.error("[Userscript] Failed to save to localStorage:", error);
		}
	}
	function addEmojiToUserscript(emojiData) {
		try {
			const data = loadDataFromLocalStorage();
			let userGroup = data.emojiGroups.find((g) => g.id === "user_added");
			if (!userGroup) {
				userGroup = {
					id: "user_added",
					name: "用户添加",
					icon: "⭐",
					order: 999,
					emojis: []
				};
				data.emojiGroups.push(userGroup);
			}
			if (!userGroup.emojis.some((e) => e.url === emojiData.url || e.name === emojiData.name)) {
				userGroup.emojis.push({
					packet: Date.now(),
					name: emojiData.name,
					url: emojiData.url
				});
				saveDataToLocalStorage({ emojiGroups: data.emojiGroups });
				console.log("[Userscript] Added emoji to user group:", emojiData.name);
			} else console.log("[Userscript] Emoji already exists:", emojiData.name);
		} catch (error) {
			console.error("[Userscript] Failed to add emoji:", error);
		}
	}
	function syncFromManager() {
		try {
			const managerGroups = localStorage.getItem("emoji_extension_manager_groups");
			const managerSettings = localStorage.getItem("emoji_extension_manager_settings");
			let updated = false;
			if (managerGroups) {
				const groups = JSON.parse(managerGroups);
				if (Array.isArray(groups)) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
					updated = true;
				}
			}
			if (managerSettings) {
				const settings = JSON.parse(managerSettings);
				if (typeof settings === "object") {
					localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
					updated = true;
				}
			}
			if (updated) console.log("[Userscript] Synced data from manager");
			return updated;
		} catch (error) {
			console.error("[Userscript] Failed to sync from manager:", error);
			return false;
		}
	}
	function trackEmojiUsage(emojiName, emojiUrl) {
		try {
			const key = `${emojiName}|${emojiUrl}`;
			const statsData = localStorage.getItem(USAGE_STATS_KEY);
			let stats = {};
			if (statsData) try {
				stats = JSON.parse(statsData);
			} catch (e) {
				console.warn("[Userscript] Failed to parse usage stats:", e);
			}
			if (!stats[key]) stats[key] = {
				count: 0,
				lastUsed: 0
			};
			stats[key].count++;
			stats[key].lastUsed = Date.now();
			localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(stats));
		} catch (error) {
			console.error("[Userscript] Failed to track emoji usage:", error);
		}
	}
	function getPopularEmojis(limit = 20) {
		try {
			const statsData = localStorage.getItem(USAGE_STATS_KEY);
			if (!statsData) return [];
			const stats = JSON.parse(statsData);
			return Object.entries(stats).map(([key, data]) => {
				const [name, url] = key.split("|");
				return {
					name,
					url,
					count: data.count,
					lastUsed: data.lastUsed
				};
			}).sort((a, b) => b.count - a.count).slice(0, limit);
		} catch (error) {
			console.error("[Userscript] Failed to get popular emojis:", error);
			return [];
		}
	}
	function clearEmojiUsageStats() {
		try {
			localStorage.removeItem(USAGE_STATS_KEY);
			console.log("[Userscript] Cleared emoji usage statistics");
		} catch (error) {
			console.error("[Userscript] Failed to clear usage stats:", error);
		}
	}
	var STORAGE_KEY, SETTINGS_KEY, USAGE_STATS_KEY;
	var init_userscript_storage = __esmMin((() => {
		init_defaultEmojiGroups_loader();
		STORAGE_KEY = "emoji_extension_userscript_data";
		SETTINGS_KEY = "emoji_extension_userscript_settings";
		USAGE_STATS_KEY = "emoji_extension_userscript_usage_stats";
	}));
	var userscriptState;
	var init_state = __esmMin((() => {
		userscriptState = {
			emojiGroups: [],
			settings: {
				imageScale: 30,
				gridColumns: 4,
				outputFormat: "markdown",
				forceMobileMode: false,
				defaultGroup: "nachoneko",
				showSearchBar: true,
				enableFloatingPreview: true,
				enableCalloutSuggestions: true
			},
			emojiUsageStats: {}
		};
	}));
	function createEl(tag, opts) {
		const el = document.createElement(tag);
		if (opts) {
			if (opts.width) el.style.width = opts.width;
			if (opts.height) el.style.height = opts.height;
			if (opts.className) el.className = opts.className;
			if (opts.text) el.textContent = opts.text;
			if (opts.placeholder && "placeholder" in el) el.placeholder = opts.placeholder;
			if (opts.type && "type" in el) el.type = opts.type;
			if (opts.value !== void 0 && "value" in el) el.value = opts.value;
			if (opts.style) el.style.cssText = opts.style;
			if (opts.src && "src" in el) el.src = opts.src;
			if (opts.attrs) for (const k in opts.attrs) el.setAttribute(k, opts.attrs[k]);
			if (opts.dataset) for (const k in opts.dataset) el.dataset[k] = opts.dataset[k];
			if (opts.innerHTML) el.innerHTML = opts.innerHTML;
			if (opts.title) el.title = opts.title;
			if (opts.alt && "alt" in el) el.alt = opts.alt;
			if (opts.id) el.id = opts.id;
		}
		return el;
	}
	var init_createEl = __esmMin((() => {}));
	init_state();
	init_userscript_storage();
	init_createEl();
	function extractEmojiFromImage(img, titleElement) {
		const url = img.src;
		if (!url || !url.startsWith("http")) return null;
		let name = "";
		const parts = (titleElement.textContent || "").split("·");
		if (parts.length > 0) name = parts[0].trim();
		if (!name || name.length < 2) name = img.alt || img.title || extractNameFromUrl(url);
		name = name.trim();
		if (name.length === 0) name = "表情";
		return {
			name,
			url
		};
	}
	function extractEmojiDataFromLightboxWrapper(lightboxWrapper) {
		const results = [];
		const anchor = lightboxWrapper.querySelector("a.lightbox");
		const img = lightboxWrapper.querySelector("img");
		if (!anchor || !img) return results;
		const title = anchor.getAttribute("title") || "";
		const originalUrl = anchor.getAttribute("href") || "";
		const downloadUrl = anchor.getAttribute("data-download-href") || "";
		const imgSrc = img.getAttribute("src") || "";
		let name = title || img.getAttribute("alt") || "";
		if (!name || name.length < 2) name = extractNameFromUrl(originalUrl || downloadUrl || imgSrc);
		name = name.replace(/\\.(webp|jpg|jpeg|png|gif)$/i, "").trim() || "表情";
		const urlToUse = originalUrl || downloadUrl || imgSrc;
		if (urlToUse && urlToUse.startsWith("http")) results.push({
			name,
			url: urlToUse
		});
		return results;
	}
	function extractNameFromUrl(url) {
		try {
			const nameWithoutExt = (new URL(url).pathname.split("/").pop() || "").replace(/\.[^/.]+$/, "");
			const decoded = decodeURIComponent(nameWithoutExt);
			if (/^[0-9a-f]{8,}$/i.test(decoded) || decoded.length < 2) return "表情";
			return decoded || "表情";
		} catch {
			return "表情";
		}
	}
	function createAddButton(emojiData) {
		const link = createEl("a", {
			className: "image-source-link emoji-add-link",
			style: `
    color: #ffffff;
    text-decoration: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    font-size: inherit;
    font-family: inherit;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border: 2px solid #ffffff;
    border-radius: 6px;
    padding: 4px 8px;
    margin: 0 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    font-weight: 600;
  `
		});
		link.addEventListener("mouseenter", () => {
			if (!link.innerHTML.includes("已添加") && !link.innerHTML.includes("失败")) {
				link.style.background = "linear-gradient(135deg, #3730a3, #5b21b6)";
				link.style.transform = "scale(1.05)";
				link.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
			}
		});
		link.addEventListener("mouseleave", () => {
			if (!link.innerHTML.includes("已添加") && !link.innerHTML.includes("失败")) {
				link.style.background = "linear-gradient(135deg, #4f46e5, #7c3aed)";
				link.style.transform = "scale(1)";
				link.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
			}
		});
		link.innerHTML = `
    <svg class="fa d-icon d-icon-plus svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor; margin-right: 4px;">
      <path d="M12 4c.55 0 1 .45 1 1v6h6c.55 0 1 .45 1 1s-.45 1-1 1h-6v6c0 .55-.45 1-1 1s-1-.45-1-1v-6H5c-.55 0-1-.45-1-1s.45-1 1-1h6V5c0-.55.45-1 1-1z"/>
    </svg>添加表情
  `;
		link.title = "添加到用户表情";
		link.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const originalHTML = link.innerHTML;
			const originalStyle = link.style.cssText;
			try {
				addEmojiToUserscript(emojiData);
				link.innerHTML = `
        <svg class="fa d-icon d-icon-check svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor; margin-right: 4px;">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>已添加
      `;
				link.style.background = "linear-gradient(135deg, #10b981, #059669)";
				link.style.color = "#ffffff";
				link.style.border = "2px solid #ffffff";
				link.style.boxShadow = "0 2px 4px rgba(16, 185, 129, 0.3)";
				setTimeout(() => {
					link.innerHTML = originalHTML;
					link.style.cssText = originalStyle;
				}, 2e3);
			} catch (error) {
				console.error("[Emoji Extension Userscript] Failed to add emoji:", error);
				link.innerHTML = `
        <svg class="fa d-icon d-icon-times svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor; margin-right: 4px;">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>失败
      `;
				link.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
				link.style.color = "#ffffff";
				link.style.border = "2px solid #ffffff";
				link.style.boxShadow = "0 2px 4px rgba(239, 68, 68, 0.3)";
				setTimeout(() => {
					link.innerHTML = originalHTML;
					link.style.cssText = originalStyle;
				}, 2e3);
			}
		});
		return link;
	}
	function processLightbox(lightbox) {
		if (lightbox.querySelector(".emoji-add-link")) return;
		const img = lightbox.querySelector(".mfp-img");
		const title = lightbox.querySelector(".mfp-title");
		if (!img || !title) return;
		const emojiData = extractEmojiFromImage(img, title);
		if (!emojiData) return;
		const addButton = createAddButton(emojiData);
		const sourceLink = title.querySelector("a.image-source-link");
		if (sourceLink) {
			const separator = document.createTextNode(" · ");
			title.insertBefore(separator, sourceLink);
			title.insertBefore(addButton, sourceLink);
		} else {
			title.appendChild(document.createTextNode(" · "));
			title.appendChild(addButton);
		}
	}
	function processAllLightboxes() {
		document.querySelectorAll(".mfp-wrap.mfp-gallery").forEach((lightbox) => {
			if (lightbox.classList.contains("mfp-wrap") && lightbox.classList.contains("mfp-gallery") && lightbox.querySelector(".mfp-img")) processLightbox(lightbox);
		});
	}
	function initOneClickAdd() {
		console.log("[Emoji Extension Userscript] Initializing one-click add functionality");
		setTimeout(processAllLightboxes, 500);
		new MutationObserver((mutations) => {
			let hasNewLightbox = false;
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node;
						if (element.classList && element.classList.contains("mfp-wrap")) hasNewLightbox = true;
					}
				});
			});
			if (hasNewLightbox) setTimeout(processAllLightboxes, 100);
		}).observe(document.body, {
			childList: true,
			subtree: true
		});
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) setTimeout(processAllLightboxes, 200);
		});
		initBatchParseButtons();
	}
	function createBatchParseButton(cookedElement) {
		const button = createEl("button", {
			className: "emoji-batch-parse-button",
			style: `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      border-radius: 8px;
      padding: 8px 12px;
      margin: 10px 0;
      font-weight: 600;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    `
		});
		button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor;">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
    一键解析并添加所有图片
  `;
		button.title = "解析当前内容中的所有图片并添加到用户表情";
		button.addEventListener("mouseenter", () => {
			if (!button.disabled) {
				button.style.background = "linear-gradient(135deg, #d97706, #b45309)";
				button.style.transform = "scale(1.02)";
			}
		});
		button.addEventListener("mouseleave", () => {
			if (!button.disabled && !button.innerHTML.includes("已处理")) {
				button.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
				button.style.transform = "scale(1)";
			}
		});
		button.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			const originalHTML = button.innerHTML;
			const originalStyle = button.style.cssText;
			try {
				button.innerHTML = "正在解析...";
				button.style.background = "linear-gradient(135deg, #6b7280, #4b5563)";
				button.disabled = true;
				const lightboxWrappers = cookedElement.querySelectorAll(".lightbox-wrapper");
				const allEmojiData = [];
				lightboxWrappers.forEach((wrapper) => {
					const items = extractEmojiDataFromLightboxWrapper(wrapper);
					allEmojiData.push(...items);
				});
				if (allEmojiData.length === 0) throw new Error("未找到可解析的图片");
				let successCount = 0;
				for (const emojiData of allEmojiData) try {
					addEmojiToUserscript(emojiData);
					successCount++;
				} catch (e$1) {
					console.error("[Userscript OneClick] 添加图片失败", emojiData.name, e$1);
				}
				button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor;">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        已处理 ${successCount}/${allEmojiData.length} 张图片
      `;
				button.style.background = "linear-gradient(135deg, #10b981, #059669)";
				setTimeout(() => {
					button.innerHTML = originalHTML;
					button.style.cssText = originalStyle;
					button.disabled = false;
				}, 3e3);
			} catch (error) {
				console.error("[Userscript OneClick] Batch parse failed:", error);
				button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1em; height: 1em; fill: currentColor;">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        解析失败
      `;
				button.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
				setTimeout(() => {
					button.innerHTML = originalHTML;
					button.style.cssText = originalStyle;
					button.disabled = false;
				}, 3e3);
			}
		});
		return button;
	}
	function processCookedContent(cookedElement) {
		if (cookedElement.querySelector(".emoji-batch-parse-button")) return;
		if (!cookedElement.querySelector(".lightbox-wrapper")) return;
		const batchButton = createBatchParseButton(cookedElement);
		cookedElement.insertBefore(batchButton, cookedElement.firstChild);
	}
	function processCookedContents() {
		document.querySelectorAll(".cooked").forEach((element) => {
			if (element.classList.contains("cooked") && element.querySelector(".lightbox-wrapper")) processCookedContent(element);
		});
	}
	function initBatchParseButtons() {
		setTimeout(processCookedContents, 500);
		new MutationObserver((mutations) => {
			let hasNewCooked = false;
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node;
						if (element.classList && element.classList.contains("cooked")) hasNewCooked = true;
						if (element.querySelectorAll && element.querySelectorAll(".cooked").length > 0) hasNewCooked = true;
					}
				});
			});
			if (hasNewCooked) setTimeout(processCookedContents, 100);
		}).observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	function ensureStyleInjected(id, css) {
		const style = document.createElement("style");
		style.id = id;
		style.textContent = css;
		document.documentElement.appendChild(style);
	}
	var init_injectStyles = __esmMin((() => {}));
	init_injectStyles();
	var da = document.addEventListener;
	var calloutKeywords = [
		"note",
		"abstract",
		"summary",
		"tldr",
		"info",
		"todo",
		"tip",
		"hint",
		"success",
		"check",
		"done",
		"question",
		"help",
		"faq",
		"warning",
		"caution",
		"attention",
		"failure",
		"fail",
		"missing",
		"danger",
		"error",
		"bug",
		"example",
		"quote",
		"cite"
	].sort();
	var ICONS$1 = {
		info: {
			icon: "ℹ️",
			color: "rgba(2, 122, 255, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-far-lightbulb svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-lightbulb\"></use></svg>"
		},
		tip: {
			icon: "💡",
			color: "rgba(0, 191, 188, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-fire-flame-curved svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#fire-flame-curved\"></use></svg>"
		},
		faq: {
			icon: "❓",
			color: "rgba(236, 117, 0, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-far-circle-question svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-circle-question\"></use></svg>"
		},
		question: {
			icon: "🤔",
			color: "rgba(236, 117, 0, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-far-circle-question svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-circle-question\"></use></svg>"
		},
		note: {
			icon: "📝",
			color: "rgba(8, 109, 221, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-far-pen-to-square svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-pen-to-square\"></use></svg>"
		},
		abstract: {
			icon: "📋",
			color: "rgba(0, 191, 188, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-far-clipboard svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-clipboard\"></use></svg>"
		},
		todo: {
			icon: "☑️",
			color: "rgba(2, 122, 255, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-far-circle-check svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-circle-check\"></use></svg>"
		},
		success: {
			icon: "🎉",
			color: "rgba(68, 207, 110, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-check svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#check\"></use></svg>"
		},
		warning: {
			icon: "⚠️",
			color: "rgba(236, 117, 0, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-triangle-exclamation svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#triangle-exclamation\"></use></svg>"
		},
		failure: {
			icon: "❌",
			color: "rgba(233, 49, 71, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-xmark svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#xmark\"></use></svg>"
		},
		danger: {
			icon: "☠️",
			color: "rgba(233, 49, 71, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-bolt svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#bolt\"></use></svg>"
		},
		bug: {
			icon: "🐛",
			color: "rgba(233, 49, 71, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-bug svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#bug\"></use></svg>"
		},
		example: {
			icon: "🔎",
			color: "rgba(120, 82, 238, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-list svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#list\"></use></svg>"
		},
		quote: {
			icon: "💬",
			color: "rgba(158, 158, 158, 0.06)",
			svg: "<svg class=\"fa d-icon d-icon-quote-left svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#quote-left\"></use></svg>"
		}
	};
	var DEFAULT_ICON = {
		icon: "📝",
		color: "var(--secondary-low)",
		svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" fill=\"currentColor\"><path d=\"M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7 362.3 51.72 392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34 437.7 172.3 270.3 339.6C264.2 345.8 256.7 350.4 248.4 352.1L159.6 372.9C152.1 374.7 144.3 373.1 138.6 367.4C132.9 361.7 131.3 353.9 133.1 346.4L153.9 257.6C155.6 249.3 160.2 241.8 166.4 235.7L172.4 241.7zM96 64C42.98 64 0 106.1 0 160V416C0 469 42.98 512 96 512H352C405 512 448 469 448 416V320H400V416C400 442.5 378.5 464 352 464H96C69.54 464 48 442.5 48 416V160C48 133.5 69.54 112 96 112H192V64H96z\"/></svg>"
	};
	ICONS$1.summary = ICONS$1.tldr = ICONS$1.abstract;
	ICONS$1.hint = ICONS$1.tip;
	ICONS$1.check = ICONS$1.done = ICONS$1.success;
	ICONS$1.help = ICONS$1.faq;
	ICONS$1.caution = ICONS$1.attention = ICONS$1.warning;
	ICONS$1.fail = ICONS$1.missing = ICONS$1.failure;
	ICONS$1.error = ICONS$1.danger;
	ICONS$1.cite = ICONS$1.quote;
	var suggestionBox = null;
	var activeSuggestionIndex = 0;
	function createSuggestionBox() {
		if (suggestionBox) return;
		suggestionBox = document.createElement("div");
		suggestionBox.id = "userscript-callout-suggestion-box";
		document.body.appendChild(suggestionBox);
		injectStyles$1();
	}
	function injectStyles$1() {
		ensureStyleInjected("userscript-callout-suggestion-styles", `
  #userscript-callout-suggestion-box {
    position: absolute;
    background-color: var(--secondary);
    border: 1px solid #444;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 999999;
    padding: 5px;
    display: none;
    font-size: 14px;
    max-height: 200px;
    overflow-y: auto;
  }
  .userscript-suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    color: var(--primary-high);
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  .userscript-suggestion-item:hover, .userscript-suggestion-item.active {
    background-color: var(--primary-low) !important;
  }
  `);
	}
	function hideSuggestionBox() {
		if (suggestionBox) suggestionBox.style.display = "none";
	}
	function updateActiveSuggestion() {
		if (!suggestionBox) return;
		suggestionBox.querySelectorAll(".userscript-suggestion-item").forEach((it, idx) => {
			it.classList.toggle("active", idx === activeSuggestionIndex);
			if (idx === activeSuggestionIndex) it.scrollIntoView({ block: "nearest" });
		});
	}
	function applyCompletion(textarea, selectedKeyword) {
		const text = textarea.value;
		const selectionStart = textarea.selectionStart || 0;
		const textBeforeCursor = text.substring(0, selectionStart);
		let triggerIndex = textBeforeCursor.lastIndexOf("[");
		if (triggerIndex === -1) triggerIndex = textBeforeCursor.lastIndexOf("［");
		if (triggerIndex === -1) triggerIndex = textBeforeCursor.lastIndexOf("【");
		if (triggerIndex === -1) return;
		const newText = `[!${selectedKeyword}]`;
		const textAfter = text.substring(selectionStart);
		textarea.value = textBeforeCursor.substring(0, triggerIndex) + newText + textAfter;
		textarea.selectionStart = textarea.selectionEnd = triggerIndex + newText.length;
		textarea.dispatchEvent(new Event("input", { bubbles: true }));
	}
	function getCursorXY(textarea, position) {
		const mirrorId = "userscript-textarea-mirror-div";
		let mirror = document.getElementById(mirrorId);
		const rect = textarea.getBoundingClientRect();
		if (!mirror) {
			mirror = document.createElement("div");
			mirror.id = mirrorId;
			document.body.appendChild(mirror);
		}
		const style = window.getComputedStyle(textarea);
		const props = [
			"boxSizing",
			"fontFamily",
			"fontSize",
			"fontWeight",
			"letterSpacing",
			"lineHeight",
			"textTransform",
			"textAlign",
			"direction",
			"paddingTop",
			"paddingRight",
			"paddingBottom",
			"paddingLeft",
			"borderTopWidth",
			"borderRightWidth",
			"borderBottomWidth",
			"borderLeftWidth"
		];
		const ms = mirror.style;
		props.forEach((p) => {
			ms[p] = style.getPropertyValue(p);
		});
		ms.position = "absolute";
		ms.left = `${rect.left + window.scrollX}px`;
		ms.top = `${rect.top + window.scrollY}px`;
		ms.width = `${rect.width}px`;
		ms.height = `${rect.height}px`;
		ms.overflow = "hidden";
		ms.visibility = "hidden";
		ms.whiteSpace = "pre-wrap";
		ms.wordWrap = "break-word";
		ms.boxSizing = style.getPropertyValue("box-sizing") || "border-box";
		const cursorPosition = position !== void 0 ? position : textarea.selectionEnd;
		mirror.textContent = textarea.value.substring(0, cursorPosition);
		const span = document.createElement("span");
		span.textContent = "​";
		mirror.appendChild(span);
		const spanRect = span.getBoundingClientRect();
		const offsetX = span.offsetLeft - textarea.scrollLeft;
		const offsetY = span.offsetTop - textarea.scrollTop;
		return {
			x: spanRect.left + window.scrollX,
			y: spanRect.top + window.scrollY,
			bottom: spanRect.bottom + window.scrollY,
			offsetX,
			offsetY
		};
	}
	function updateSuggestionBox(textarea, matches, triggerIndex) {
		if (!suggestionBox || matches.length === 0) {
			hideSuggestionBox();
			return;
		}
		suggestionBox.innerHTML = matches.map((keyword, index) => {
			const iconData = ICONS$1[keyword] || DEFAULT_ICON;
			const backgroundColor = iconData.color || "transparent";
			const iconColor = iconData.color ? iconData.color.replace("rgba", "rgb").replace(/, [0-9.]+\)/, ")") : "var(--primary-medium)";
			const coloredSvg = (iconData.svg || DEFAULT_ICON.svg).replace("<svg", `<svg style="color: ${iconColor};"`);
			return `\n      <div class="userscript-suggestion-item" data-index="${index}" data-key="${keyword}" style="background-color:${backgroundColor}">\n        ${coloredSvg}\n        <span style="margin-left:8px">${keyword}</span>\n      </div>`;
		}).join("");
		suggestionBox.querySelectorAll(".userscript-suggestion-item").forEach((item) => {
			item.addEventListener("mousedown", (e) => {
				e.preventDefault();
				const idx = item.dataset.key;
				if (!idx) return;
				applyCompletion(textarea, idx);
				hideSuggestionBox();
			});
		});
		const cursorPos = getCursorXY(textarea, triggerIndex);
		const margin = 6;
		const prevVisibility = suggestionBox.style.visibility;
		suggestionBox.style.display = "block";
		suggestionBox.style.visibility = "hidden";
		const boxRect = suggestionBox.getBoundingClientRect();
		const spaceBelow = window.innerHeight - (cursorPos.bottom - window.scrollY);
		const left = cursorPos.x;
		let top = cursorPos.y + margin;
		if (spaceBelow < boxRect.height + margin) top = cursorPos.y - boxRect.height - margin;
		const cursorViewportX = cursorPos.x - window.scrollX;
		const viewportWidth = window.innerWidth;
		const spaceRight = viewportWidth - cursorViewportX;
		const spaceLeft = cursorViewportX;
		let finalLeft = left;
		if (spaceRight < boxRect.width + margin && spaceLeft >= boxRect.width + margin) finalLeft = cursorPos.x - boxRect.width;
		const minLeft = window.scrollX + 0;
		const maxLeft = window.scrollX + viewportWidth - boxRect.width - margin;
		if (finalLeft < minLeft) finalLeft = minLeft;
		if (finalLeft > maxLeft) finalLeft = maxLeft;
		suggestionBox.style.left = `${finalLeft}px`;
		suggestionBox.style.top = `${top}px`;
		suggestionBox.style.visibility = prevVisibility || "";
		suggestionBox.style.display = "block";
		activeSuggestionIndex = 0;
		updateActiveSuggestion();
	}
	function handleInput(event) {
		const target = event.target;
		if (!target || !(target instanceof HTMLTextAreaElement)) return;
		const textarea = target;
		const text = textarea.value;
		const selectionStart = textarea.selectionStart || 0;
		const match = text.substring(0, selectionStart).match(/(?:\[|［|【])(?:!|！)?([a-z]*)$/i);
		if (match) {
			const keyword = match[1].toLowerCase();
			const filtered = calloutKeywords.filter((k) => k.startsWith(keyword));
			const triggerIndex = selectionStart - match[0].length;
			if (filtered.length > 0) updateSuggestionBox(textarea, filtered, triggerIndex);
			else hideSuggestionBox();
		} else hideSuggestionBox();
	}
	function handleKeydown(event) {
		if (!suggestionBox || suggestionBox.style.display === "none") return;
		const items = suggestionBox.querySelectorAll(".userscript-suggestion-item");
		if (items.length === 0) return;
		if ([
			"ArrowDown",
			"ArrowUp",
			"Tab",
			"Enter",
			"Escape"
		].includes(event.key)) {
			event.preventDefault();
			event.stopPropagation();
		}
		switch (event.key) {
			case "ArrowDown":
				activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
				updateActiveSuggestion();
				break;
			case "ArrowUp":
				activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
				updateActiveSuggestion();
				break;
			case "Tab":
			case "Enter": {
				const selectedKey = items[activeSuggestionIndex]?.dataset.key;
				if (selectedKey) {
					const focused = document.activeElement;
					if (focused && focused instanceof HTMLTextAreaElement) applyCompletion(focused, selectedKey);
				}
				hideSuggestionBox();
				break;
			}
			case "Escape":
				hideSuggestionBox();
				break;
		}
	}
	function initCalloutSuggestionsUserscript() {
		try {
			createSuggestionBox();
			da("input", handleInput, true);
			da("keydown", handleKeydown, true);
			da("click", (e) => {
				if (e.target?.tagName !== "TEXTAREA" && !suggestionBox?.contains(e.target)) hideSuggestionBox();
			});
		} catch (e) {
			console.error("initCalloutSuggestionsUserscript failed", e);
		}
	}
	function getBuildPlatform() {
		try {
			return "original";
		} catch {
			return "original";
		}
	}
	function detectRuntimePlatform() {
		try {
			const isMobileSize = window.innerWidth <= 768;
			const userAgent = navigator.userAgent.toLowerCase();
			const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
			const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
			if (isMobileSize && (isMobileUserAgent || isTouchDevice)) return "mobile";
			else if (!isMobileSize && !isMobileUserAgent) return "pc";
			return "original";
		} catch {
			return "original";
		}
	}
	function getEffectivePlatform() {
		const buildPlatform = getBuildPlatform();
		if (buildPlatform === "original") return detectRuntimePlatform();
		return buildPlatform;
	}
	function getPlatformUIConfig() {
		switch (getEffectivePlatform()) {
			case "mobile": return {
				emojiPickerMaxHeight: "60vh",
				emojiPickerColumns: 4,
				emojiSize: 32,
				isModal: true,
				useCompactLayout: true,
				showSearchBar: true,
				floatingButtonSize: 48
			};
			case "pc": return {
				emojiPickerMaxHeight: "400px",
				emojiPickerColumns: 6,
				emojiSize: 24,
				isModal: false,
				useCompactLayout: false,
				showSearchBar: true,
				floatingButtonSize: 40
			};
			default: return {
				emojiPickerMaxHeight: "350px",
				emojiPickerColumns: 5,
				emojiSize: 28,
				isModal: false,
				useCompactLayout: false,
				showSearchBar: true,
				floatingButtonSize: 44
			};
		}
	}
	function getPlatformToolbarSelectors() {
		const platform = getEffectivePlatform();
		const baseSelectors = [
			".d-editor-button-bar[role=\"toolbar\"]",
			".chat-composer__inner-container",
			".d-editor-button-bar"
		];
		switch (platform) {
			case "mobile": return [
				...baseSelectors,
				".mobile-composer .d-editor-button-bar",
				".discourse-mobile .d-editor-button-bar",
				"[data-mobile-toolbar]"
			];
			case "pc": return [
				...baseSelectors,
				".desktop-composer .d-editor-button-bar",
				".discourse-desktop .d-editor-button-bar",
				"[data-desktop-toolbar]"
			];
			default: return baseSelectors;
		}
	}
	function logPlatformInfo() {
		const buildPlatform = getBuildPlatform();
		const runtimePlatform = detectRuntimePlatform();
		const effectivePlatform = getEffectivePlatform();
		const config = getPlatformUIConfig();
		console.log("[Platform] Build target:", buildPlatform);
		console.log("[Platform] Runtime detected:", runtimePlatform);
		console.log("[Platform] Effective platform:", effectivePlatform);
		console.log("[Platform] UI config:", config);
		console.log("[Platform] Screen size:", `${window.innerWidth}x${window.innerHeight}`);
		console.log("[Platform] User agent mobile:", /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
		console.log("[Platform] Touch device:", "ontouchstart" in window || navigator.maxTouchPoints > 0);
	}
	function ensureHoverPreview() {
		if (_sharedPreview && document.body.contains(_sharedPreview)) return _sharedPreview;
		_sharedPreview = createEl("div", {
			className: "emoji-picker-hover-preview",
			style: "position:fixed;pointer-events:none;display:none;z-index:1000002;max-width:300px;max-height:300px;overflow:hidden;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.25);background:transparent;padding:6px;"
		});
		const img = createEl("img", {
			className: "emoji-picker-hover-img",
			style: "display:block;max-width:100%;max-height:220px;object-fit:contain;"
		});
		const label = createEl("div", {
			className: "emoji-picker-hover-label",
			style: "font-size:12px;color:var(--primary);margin-top:6px;text-align:center;"
		});
		_sharedPreview.appendChild(img);
		_sharedPreview.appendChild(label);
		document.body.appendChild(_sharedPreview);
		return _sharedPreview;
	}
	var _sharedPreview;
	var init_hoverPreview = __esmMin((() => {
		init_createEl();
		_sharedPreview = null;
	}));
	function injectGlobalThemeStyles() {
		if (themeStylesInjected || typeof document === "undefined") return;
		themeStylesInjected = true;
		document.head.appendChild(createEl("style", {
			id: "emoji-extension-theme-globals",
			text: `
    /* Global CSS variables for emoji extension theme support */
    :root {
      /* Light theme (default) */
      --emoji-modal-bg: #ffffff;
      --emoji-modal-text: #333333;
      --emoji-modal-border: #dddddd;
      --emoji-modal-input-bg: #ffffff;
      --emoji-modal-label: #555555;
      --emoji-modal-button-bg: #f5f5f5;
      --emoji-modal-primary-bg: #1890ff;

      --emoji-preview-bg: #ffffff;
      --emoji-preview-text: #222222;
      --emoji-preview-border: rgba(0,0,0,0.08);

      --emoji-button-gradient-start: #667eea;
      --emoji-button-gradient-end: #764ba2;
      --emoji-button-shadow: rgba(0, 0, 0, 0.15);
      --emoji-button-hover-shadow: rgba(0, 0, 0, 0.2);
    }

    /* Dark theme */
    @media (prefers-color-scheme: dark) {
      :root {
        --emoji-modal-bg: #2d2d2d;
        --emoji-modal-text: #e6e6e6;
        --emoji-modal-border: #444444;
        --emoji-modal-input-bg: #3a3a3a;
        --emoji-modal-label: #cccccc;
        --emoji-modal-button-bg: #444444;
        --emoji-modal-primary-bg: #1677ff;

        --emoji-preview-bg: rgba(32,33,36,0.94);
        --emoji-preview-text: #e6e6e6;
        --emoji-preview-border: rgba(255,255,255,0.12);

        --emoji-button-gradient-start: #4a5568;
        --emoji-button-gradient-end: #2d3748;
        --emoji-button-shadow: rgba(0, 0, 0, 0.3);
        --emoji-button-hover-shadow: rgba(0, 0, 0, 0.4);
      }
    }
  `
		}));
	}
	var themeStylesInjected;
	var init_themeSupport = __esmMin((() => {
		init_createEl();
		themeStylesInjected = false;
	}));
	init_hoverPreview();
	init_themeSupport();
	init_injectStyles();
	function injectEmojiPickerStyles() {
		if (typeof document === "undefined") return;
		if (document.getElementById("emoji-picker-styles")) return;
		injectGlobalThemeStyles();
		ensureStyleInjected("emoji-picker-styles", `
.emoji-picker-hover-preview{
  position:fixed;
  pointer-events:none;
  display:none;
  z-index:1000002;
  max-width:320px;
  max-height:320px;
  overflow:hidden;
  border-radius:8px;
  box-shadow:0 6px 20px rgba(0,0,0,0.32);
  background:var(--emoji-preview-bg);
  padding:8px;
  transition:opacity .3s ease, transform .12s ease;
  border: 1px solid var(--emoji-preview-border);
  backdrop-filter: blur(10px);
}
.emoji-picker-hover-preview img.emoji-picker-hover-img{
  display:block;
  max-width:100%;
  max-height:220px;
  object-fit:contain;
}
.emoji-picker-hover-preview .emoji-picker-hover-label{
  font-size:12px;
  color:var(--emoji-preview-text);
  margin-top:8px;
  text-align:center;
  word-break:break-word;
  font-weight: 500;
}
`);
	}
	function isImageUrl(value) {
		if (!value) return false;
		let v = value.trim();
		if (/^url\(/i.test(v)) {
			const inner = v.replace(/^url\(/i, "").replace(/\)$/, "").trim();
			if (inner.startsWith("\"") && inner.endsWith("\"") || inner.startsWith("'") && inner.endsWith("'")) v = inner.slice(1, -1).trim();
			else v = inner;
		}
		if (v.startsWith("data:image/")) return true;
		if (v.startsWith("blob:")) return true;
		if (v.startsWith("//")) v = "https:" + v;
		if (/\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i.test(v)) return true;
		try {
			const url = new URL(v);
			const protocol = url.protocol;
			if (protocol === "http:" || protocol === "https:" || protocol.endsWith(":")) {
				if (/\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i.test(url.pathname)) return true;
				if (/format=|ext=|type=image|image_type=/i.test(url.search)) return true;
			}
		} catch {}
		return false;
	}
	const __vitePreload = function preload(baseModule, deps, importerUrl) {
		let promise = Promise.resolve();
		function handlePreloadError(err$2) {
			const e$1 = new Event("vite:preloadError", { cancelable: true });
			e$1.payload = err$2;
			window.dispatchEvent(e$1);
			if (!e$1.defaultPrevented) throw err$2;
		}
		return promise.then((res) => {
			for (const item of res || []) {
				if (item.status !== "rejected") continue;
				handlePreloadError(item.reason);
			}
			return baseModule().catch(handlePreloadError);
		});
	};
	function injectManagerStyles() {
		if (__managerStylesInjected) return;
		__managerStylesInjected = true;
		ensureStyleInjected("emoji-manager-styles", `
    /* Modal backdrop */
    .emoji-manager-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Main modal panel */
    .emoji-manager-panel {
      border-radius: 8px;
      width: 90%;
      height: 95%;
      display: grid;
      grid-template-columns: 300px 1fr;
      grid-template-rows: 1fr auto;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    /* Left panel - groups list */
    .emoji-manager-left {
      background: var(--primary-very-low)
      border-right: 1px solid #e9ecef;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .emoji-manager-left-header {
      display: flex;
      align-items: center;
      padding: 16px;
      background: var(--primary-low);
    }

    .emoji-manager-addgroup-row {
      display: flex;
      padding: 12px;
    }

    .emoji-manager-groups-list {
      background: var(--primary-very-low);
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .emoji-manager-groups-list > div {
      margin-bottom: 4px;
      transition: background-color 0.2s;
    }

    .emoji-manager-groups-list > div:hover {
      background: var(--primary);
    }

    .emoji-manager-groups-list > div:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px #007bff;
      background: var(--primary);
    }

    /* Right panel - emoji display and editing */
    .emoji-manager-right {
      background: var(--primary-low);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .emoji-manager-right-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }

    .emoji-manager-right-main {
      flex: 1;
      overflow-y: auto;
    }

    .emoji-manager-emojis {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
      gap: 12px;
    }

    .emoji-manager-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      background: var(--primary-medium);
    }

    .emoji-manager-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .emoji-manager-card-img {
      max-width: 90%;
      max-height: 100%; /* allow tall images but cap at viewport height */
      object-fit: contain;
      border-radius: 6px;
      background: white;
    }

    .emoji-manager-card-name {
      font-size: 12px;
      color: var(--primary);
      text-align: center;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 500;
    }

    .emoji-manager-card-actions {
      display: flex;
      gap: 6px;
    }

    /* Add emoji form */
    .emoji-manager-add-emoji-form {
      padding: 16px;
      background: var(--primary-very-low)
      border-top: 1px solid #e9ecef;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    /* Footer */
    .emoji-manager-footer {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      padding: 16px;
      background: var(--primary-very-low);
    }

    /* Editor panel - popup modal */
    .emoji-manager-editor-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var( --primary-medium );
      padding: 2%;
      z-index: 1000000;
    }

    .emoji-manager-editor-preview {
      max-width: 100%;
      max-height: 40vh;
    }

    /* Hover preview (moved from inline styles) */
    .emoji-manager-hover-preview {
      position: fixed;
      pointer-events: none;
      z-index: 1000002;
      display: none;
      max-width: 60%;
      max-height: 60%;
      border: 1px solid rgba(0,0,0,0.1);
      object-fit: contain;
      background: var(--primary);
      padding: 4px;
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }

    /* Form styling */
    .form-control {
      width: 100%;
      display: flex;
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid transparent;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--primary-high);
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }
  `);
	}
	var __managerStylesInjected;
	var init_styles = __esmMin((() => {
		init_injectStyles();
		__managerStylesInjected = false;
	}));
	function showTemporaryMessage(message, duration = 2e3) {
		const messageEl = createEl("div", {
			style: `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--emoji-modal-primary-bg);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 9999999;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: fadeInOut 2s ease-in-out;
    `,
			text: message
		});
		if (!document.querySelector("#tempMessageStyles")) {
			const style = createEl("style", {
				id: "tempMessageStyles",
				text: `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `
			});
			document.head.appendChild(style);
		}
		document.body.appendChild(messageEl);
		setTimeout(() => {
			try {
				messageEl.remove();
			} catch {}
		}, duration);
	}
	var init_tempMessage = __esmMin((() => {
		init_createEl();
	}));
	function showImportExportModal(currentGroupId) {
		injectGlobalThemeStyles();
		const modal = createEl("div", { style: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    ` });
		const content = createEl("div", { style: `
      background: var(--secondary);
      color: var(--emoji-modal-text);
      border: 1px solid var(--emoji-modal-border);
      border-radius: 8px;
      padding: 24px;
      max-width: 90%;
      max-height: 90%;
      overflow-y: auto;
      position: relative;
      width: 600px;
    ` });
		const currentGroup = currentGroupId ? userscriptState.emojiGroups.find((g) => g.id === currentGroupId) : null;
		content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: var(--emoji-modal-text);">分组表情导入/导出</h2>
      <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
    </div>

    ${currentGroup ? `
    <div style="margin-bottom: 24px; padding: 16px; background: var(--emoji-modal-button-bg); border-radius: 8px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">当前分组信息</h3>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        ${currentGroup.icon?.startsWith("http") ? `<img src="${currentGroup.icon}" alt="图标" style="width: 24px; height: 24px; object-fit: contain;">` : `<span style="font-size: 20px;">${currentGroup.icon || "📁"}</span>`}
        <span style="font-weight: bold; color: var(--emoji-modal-text);">${currentGroup.name || currentGroup.id}</span>
      </div>
      <div style="color: var(--emoji-modal-text); font-size: 14px;">
        分组 ID: ${currentGroup.id} | 表情数量：${currentGroup.emojis?.length || 0}
      </div>
    </div>
    ` : ""}

    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">导出分组表情</h3>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">选择要导出的分组:</label>
        <select id="exportGroupSelect" style="
          width: 100%;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
          margin-bottom: 8px;
        ">
          ${currentGroup ? `<option value="${currentGroup.id}" selected>${currentGroup.name || currentGroup.id} (${currentGroup.emojis?.length || 0} 表情)</option>` : ""}
          ${userscriptState.emojiGroups.filter((g) => g.id !== currentGroupId).map((group) => `<option value="${group.id}">${group.name || group.id} (${group.emojis?.length || 0} 表情)</option>`).join("")}
        </select>
      </div>

      <div style="display: flex; gap: 8px;">
        <button id="exportGroup" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">导出选中分组</button>
      </div>
    </div>

    <div>
      <h3 style="margin: 0 0 12px 0; color: var(--emoji-modal-label);">导入分组表情</h3>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">导入目标分组:</label>
        <select id="importTargetGroupSelect" style="
          width: 100%;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
          margin-bottom: 8px;
        ">
          ${currentGroup ? `<option value="${currentGroup.id}" selected>${currentGroup.name || currentGroup.id}</option>` : ""}
          ${userscriptState.emojiGroups.filter((g) => g.id !== currentGroupId).map((group) => `<option value="${group.id}">${group.name || group.id}</option>`).join("")}
          <option value="__new__">创建新分组...</option>
        </select>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">上传分组文件:</label>
        <input type="file" id="importFile" accept=".json" style="margin-bottom: 8px; color: var(--emoji-modal-text);">
        <div style="font-size: 12px; color: var(--emoji-modal-text); opacity: 0.7;">
          支持 JSON 格式的分组文件
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">或粘贴分组 JSON:</label>
        <textarea id="importText" placeholder="在此粘贴分组表情 JSON..." style="
          width: 100%;
          height: 120px;
          padding: 8px;
          background: var(--emoji-modal-button-bg);
          color: var(--emoji-modal-text);
          border: 1px solid var(--emoji-modal-border);
          border-radius: 4px;
          resize: vertical;
          font-family: monospace;
          font-size: 12px;
        "></textarea>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label);">导入选项:</label>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
            <input type="radio" name="importMode" value="replace" checked style="margin-right: 8px;">
            替换现有表情 (清空目标分组后导入)
          </label>
          <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
            <input type="radio" name="importMode" value="merge" style="margin-right: 8px;">
            合并表情 (添加到现有表情中，跳过重复的)
          </label>
          <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
            <input type="radio" name="importMode" value="append" style="margin-right: 8px;">
            追加表情 (直接添加到现有表情后面)
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 8px;">
        <button id="importGroup" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">导入到分组</button>
        <button id="previewImport" style="padding: 8px 16px; background: var(--emoji-modal-button-bg); color: var(--emoji-modal-text); border: 1px solid var(--emoji-modal-border); border-radius: 4px; cursor: pointer;">预览导入</button>
      </div>
    </div>
  `;
		modal.appendChild(content);
		document.body.appendChild(modal);
		function createDownload(data, filename) {
			const jsonString = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonString], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
		function parseImportData(jsonData) {
			try {
				const data = JSON.parse(jsonData);
				if (!data || typeof data !== "object") throw new Error("无效的 JSON 格式");
				return data;
			} catch (error) {
				throw new Error("JSON 解析失败：" + (error instanceof Error ? error.message : String(error)));
			}
		}
		content.querySelector("#closeModal")?.addEventListener("click", () => {
			modal.remove();
		});
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
		content.querySelector("#exportGroup")?.addEventListener("click", () => {
			try {
				const selectedGroupId = content.querySelector("#exportGroupSelect").value;
				if (!selectedGroupId) {
					alert("请选择要导出的分组");
					return;
				}
				const group = userscriptState.emojiGroups.find((g) => g.id === selectedGroupId);
				if (!group) {
					alert("找不到指定的分组");
					return;
				}
				const exportData = {
					type: "emoji_group",
					exportDate: (/* @__PURE__ */ new Date()).toISOString(),
					group: {
						id: group.id,
						name: group.name,
						icon: group.icon,
						emojis: group.emojis || [],
						order: group.order
					}
				};
				const timestamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/:/g, "-");
				const filename = `emoji-group-${group.name || group.id}-${timestamp}.json`;
				createDownload(exportData, filename);
				showTemporaryMessage(`已导出分组 "${group.name || group.id}" (${group.emojis?.length || 0} 个表情)`);
			} catch (error) {
				console.error("Export group failed:", error);
				alert("导出分组失败：" + (error instanceof Error ? error.message : String(error)));
			}
		});
		content.querySelector("#importFile")?.addEventListener("change", (e) => {
			const file = e.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const text = event.target?.result;
					const importTextarea = content.querySelector("#importText");
					if (importTextarea) importTextarea.value = text;
				};
				reader.onerror = () => {
					alert("文件读取失败");
				};
				reader.readAsText(file);
			}
		});
		content.querySelector("#previewImport")?.addEventListener("click", () => {
			try {
				const importText = content.querySelector("#importText").value.trim();
				if (!importText) {
					alert("请输入或选择要导入的内容");
					return;
				}
				const data = parseImportData(importText);
				let preview = "导入预览:\\n\\n";
				if (data.type === "emoji_group" && data.group) {
					const group = data.group;
					preview += `分组类型：单个表情分组\\n`;
					preview += `分组名称：${group.name || group.id || "Unnamed"}\\n`;
					preview += `分组 ID: ${group.id || "N/A"}\\n`;
					preview += `图标：${group.icon || "无"}\\n`;
					preview += `表情数量：${group.emojis?.length || 0}\\n\\n`;
					if (group.emojis && group.emojis.length > 0) {
						preview += `表情列表 (前 5 个):\\n`;
						group.emojis.slice(0, 5).forEach((emoji, index) => {
							preview += `  ${index + 1}. ${emoji.name || "Unnamed"} - ${emoji.url || "No URL"}\\n`;
						});
						if (group.emojis.length > 5) preview += `  ... 还有 ${group.emojis.length - 5} 个表情\\n`;
					}
				} else if (data.emojiGroups && Array.isArray(data.emojiGroups)) {
					preview += `分组类型：多个表情分组\\n`;
					preview += `分组数量：${data.emojiGroups.length}\\n\\n`;
					data.emojiGroups.slice(0, 3).forEach((group, index) => {
						preview += `${index + 1}. ${group.name || group.id || "Unnamed"} (${group.emojis?.length || 0} 表情)\\n`;
					});
					if (data.emojiGroups.length > 3) preview += `... 还有 ${data.emojiGroups.length - 3} 个分组\\n`;
				} else if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].url) {
					preview += `分组类型：表情数组 (带扩展字段)\\n`;
					preview += `表情数量：${data.length}\\n\\n`;
					const groupIds = [...new Set(data.map((emoji) => emoji.groupId).filter(Boolean))];
					if (groupIds.length > 0) preview += `包含的原始分组 ID: ${groupIds.join(", ")}\\n\\n`;
					if (data.length > 0) {
						preview += `表情列表 (前 5 个):\\n`;
						data.slice(0, 5).forEach((emoji, index) => {
							preview += `  ${index + 1}. ${emoji.name || emoji.id} - ${emoji.url}\\n`;
							if (emoji.groupId) preview += `     原分组：${emoji.groupId}\\n`;
						});
						if (data.length > 5) preview += `  ... 还有 ${data.length - 5} 个表情\\n`;
					}
				} else preview += "无法识别的格式，可能不是有效的分组导出文件";
				alert(preview);
			} catch (error) {
				alert("预览失败：" + (error instanceof Error ? error.message : String(error)));
			}
		});
		content.querySelector("#importGroup")?.addEventListener("click", () => {
			try {
				const importText = content.querySelector("#importText").value.trim();
				if (!importText) {
					alert("请输入或选择要导入的内容");
					return;
				}
				let targetGroupId = content.querySelector("#importTargetGroupSelect").value;
				if (targetGroupId === "__new__") {
					const newGroupName = prompt("请输入新分组的名称：");
					if (!newGroupName || !newGroupName.trim()) return;
					const newGroupId = "imported_" + Date.now();
					const newGroup = {
						id: newGroupId,
						name: newGroupName.trim(),
						icon: "📁",
						emojis: [],
						order: userscriptState.emojiGroups.length
					};
					userscriptState.emojiGroups.push(newGroup);
					targetGroupId = newGroupId;
				}
				if (!targetGroupId) {
					alert("请选择目标分组");
					return;
				}
				const targetGroup = userscriptState.emojiGroups.find((g) => g.id === targetGroupId);
				if (!targetGroup) {
					alert("找不到目标分组");
					return;
				}
				const data = parseImportData(importText);
				const importModeInputs = content.querySelectorAll("input[name=\"importMode\"]");
				const importMode = Array.from(importModeInputs).find((input) => input.checked)?.value || "replace";
				let importedEmojis = [];
				if (data.type === "emoji_group" && data.group && data.group.emojis) importedEmojis = data.group.emojis;
				else if (data.emojiGroups && Array.isArray(data.emojiGroups)) importedEmojis = data.emojiGroups.reduce((acc, group) => {
					return acc.concat(group.emojis || []);
				}, []);
				else if (Array.isArray(data.emojis)) importedEmojis = data.emojis;
				else if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].url) importedEmojis = data.map((emoji) => ({
					name: emoji.name || emoji.id || "unnamed",
					url: emoji.url,
					width: emoji.width,
					height: emoji.height,
					originalId: emoji.id,
					packet: emoji.packet,
					originalGroupId: emoji.groupId
				}));
				else {
					alert("无法识别的导入格式");
					return;
				}
				if (importedEmojis.length === 0) {
					alert("导入文件中没有找到表情数据");
					return;
				}
				let finalEmojis = [];
				switch (importMode) {
					case "replace":
						finalEmojis = importedEmojis;
						break;
					case "merge":
						const existingUrls = new Set((targetGroup.emojis || []).map((e) => e.url));
						const existingIds = new Set((targetGroup.emojis || []).map((e) => e.originalId || e.id).filter(Boolean));
						const newEmojis = importedEmojis.filter((e) => {
							if (existingUrls.has(e.url)) return false;
							if (e.originalId && existingIds.has(e.originalId)) return false;
							return true;
						});
						finalEmojis = [...targetGroup.emojis || [], ...newEmojis];
						break;
					case "append":
						finalEmojis = [...targetGroup.emojis || [], ...importedEmojis];
						break;
					default: finalEmojis = importedEmojis;
				}
				targetGroup.emojis = finalEmojis;
				saveDataToLocalStorage({ emojiGroups: userscriptState.emojiGroups });
				const message = `成功导入 ${importedEmojis.length} 个表情到分组 "${targetGroup.name || targetGroup.id}"`;
				showTemporaryMessage(message);
				alert(message + "\\n\\n修改已保存，分组现在共有 " + finalEmojis.length + " 个表情");
				modal.remove();
			} catch (error) {
				console.error("Import group failed:", error);
				alert("导入分组失败：" + (error instanceof Error ? error.message : String(error)));
			}
		});
	}
	var init_importExport = __esmMin((() => {
		init_userscript_storage();
		init_createEl();
		init_themeSupport();
		init_tempMessage();
	}));
	var manager_exports = /* @__PURE__ */ __export({ openManagementInterface: () => openManagementInterface });
	function createEditorPopup(groupId, index, renderGroups, renderSelectedGroup) {
		const group = userscriptState.emojiGroups.find((g) => g.id === groupId);
		if (!group) return;
		const emo = group.emojis[index];
		if (!emo) return;
		const backdrop = createEl("div", { style: `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
  ` });
		const editorPanel = createEl("div", { className: "emoji-manager-editor-panel" });
		const editorTitle = createEl("h3", {
			text: "编辑表情",
			className: "emoji-manager-editor-title",
			style: "margin: 0 0 16px 0; text-align: center;"
		});
		const editorPreview = createEl("img", { className: "emoji-manager-editor-preview" });
		editorPreview.src = emo.url;
		const editorWidthInput = createEl("input", {
			className: "form-control",
			placeholder: "宽度 (px) 可选",
			value: emo.width ? String(emo.width) : ""
		});
		const editorHeightInput = createEl("input", {
			className: "form-control",
			placeholder: "高度 (px) 可选",
			value: emo.height ? String(emo.height) : ""
		});
		const editorNameInput = createEl("input", {
			className: "form-control",
			placeholder: "名称 (alias)",
			value: emo.name || ""
		});
		const editorUrlInput = createEl("input", {
			className: "form-control",
			placeholder: "表情图片 URL",
			value: emo.url || ""
		});
		const buttonContainer = createEl("div", { style: "display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;" });
		const editorSaveBtn = createEl("button", {
			text: "保存修改",
			className: "btn btn-primary"
		});
		const editorCancelBtn = createEl("button", {
			text: "取消",
			className: "btn"
		});
		buttonContainer.appendChild(editorCancelBtn);
		buttonContainer.appendChild(editorSaveBtn);
		editorPanel.appendChild(editorTitle);
		editorPanel.appendChild(editorPreview);
		editorPanel.appendChild(editorWidthInput);
		editorPanel.appendChild(editorHeightInput);
		editorPanel.appendChild(editorNameInput);
		editorPanel.appendChild(editorUrlInput);
		editorPanel.appendChild(buttonContainer);
		backdrop.appendChild(editorPanel);
		document.body.appendChild(backdrop);
		editorUrlInput.addEventListener("input", () => {
			editorPreview.src = editorUrlInput.value;
		});
		editorSaveBtn.addEventListener("click", () => {
			const newName = (editorNameInput.value || "").trim();
			const newUrl = (editorUrlInput.value || "").trim();
			const newWidth = parseInt((editorWidthInput.value || "").trim(), 10);
			const newHeight = parseInt((editorHeightInput.value || "").trim(), 10);
			if (!newName || !newUrl) {
				alert("名称和 URL 均不能为空");
				return;
			}
			emo.name = newName;
			emo.url = newUrl;
			if (!isNaN(newWidth) && newWidth > 0) emo.width = newWidth;
			else delete emo.width;
			if (!isNaN(newHeight) && newHeight > 0) emo.height = newHeight;
			else delete emo.height;
			renderGroups();
			renderSelectedGroup();
			backdrop.remove();
		});
		editorCancelBtn.addEventListener("click", () => {
			backdrop.remove();
		});
		backdrop.addEventListener("click", (e) => {
			if (e.target === backdrop) backdrop.remove();
		});
	}
	function openManagementInterface() {
		injectManagerStyles();
		const modal = createEl("div", {
			className: "emoji-manager-wrapper",
			attrs: {
				role: "dialog",
				"aria-modal": "true"
			}
		});
		const panel = createEl("div", { className: "emoji-manager-panel" });
		const left = createEl("div", { className: "emoji-manager-left" });
		const leftHeader = createEl("div", { className: "emoji-manager-left-header" });
		const title = createEl("h3", { text: "表情管理器" });
		const closeBtn = createEl("button", {
			text: "×",
			className: "btn",
			style: "font-size:20px; background:none; border:none; cursor:pointer;"
		});
		leftHeader.appendChild(title);
		leftHeader.appendChild(closeBtn);
		left.appendChild(leftHeader);
		const addGroupRow = createEl("div", { className: "emoji-manager-addgroup-row" });
		const addGroupInput = createEl("input", {
			placeholder: "新分组 id",
			className: "form-control"
		});
		const addGroupBtn = createEl("button", {
			text: "添加",
			className: "btn"
		});
		addGroupRow.appendChild(addGroupInput);
		addGroupRow.appendChild(addGroupBtn);
		left.appendChild(addGroupRow);
		const groupsList = createEl("div", { className: "emoji-manager-groups-list" });
		left.appendChild(groupsList);
		const right = createEl("div", { className: "emoji-manager-right" });
		const rightHeader = createEl("div", { className: "emoji-manager-right-header" });
		const groupTitle = createEl("h4");
		groupTitle.textContent = "";
		const deleteGroupBtn = createEl("button", {
			text: "删除分组",
			className: "btn",
			style: "background:#ef4444; color:#fff;"
		});
		rightHeader.appendChild(groupTitle);
		rightHeader.appendChild(deleteGroupBtn);
		right.appendChild(rightHeader);
		const managerRightMain = createEl("div", { className: "emoji-manager-right-main" });
		const emojisContainer = createEl("div", { className: "emoji-manager-emojis" });
		managerRightMain.appendChild(emojisContainer);
		const addEmojiForm = createEl("div", { className: "emoji-manager-add-emoji-form" });
		const emojiUrlInput = createEl("input", {
			placeholder: "表情图片 URL",
			className: "form-control"
		});
		const emojiNameInput = createEl("input", {
			placeholder: "名称 (alias)",
			className: "form-control"
		});
		const emojiWidthInput = createEl("input", {
			placeholder: "宽度 (px) 可选",
			className: "form-control"
		});
		const emojiHeightInput = createEl("input", {
			placeholder: "高度 (px) 可选",
			className: "form-control"
		});
		const addEmojiBtn = createEl("button", {
			text: "添加表情",
			className: "btn btn-primary"
		});
		addEmojiForm.appendChild(emojiUrlInput);
		addEmojiForm.appendChild(emojiNameInput);
		addEmojiForm.appendChild(emojiWidthInput);
		addEmojiForm.appendChild(emojiHeightInput);
		addEmojiForm.appendChild(addEmojiBtn);
		managerRightMain.appendChild(addEmojiForm);
		right.appendChild(managerRightMain);
		const footer = createEl("div", { className: "emoji-manager-footer" });
		const exportBtn = createEl("button", {
			text: "分组导出",
			className: "btn"
		});
		const importBtn = createEl("button", {
			text: "分组导入",
			className: "btn"
		});
		const exitBtn = createEl("button", {
			text: "退出",
			className: "btn"
		});
		exitBtn.addEventListener("click", () => modal.remove());
		const saveBtn = createEl("button", {
			text: "保存",
			className: "btn btn-primary"
		});
		const syncBtn = createEl("button", {
			text: "同步管理器",
			className: "btn"
		});
		footer.appendChild(syncBtn);
		footer.appendChild(exportBtn);
		footer.appendChild(importBtn);
		footer.appendChild(exitBtn);
		footer.appendChild(saveBtn);
		panel.appendChild(left);
		panel.appendChild(right);
		panel.appendChild(footer);
		modal.appendChild(panel);
		document.body.appendChild(modal);
		let selectedGroupId = null;
		function renderGroups() {
			groupsList.innerHTML = "";
			if (!selectedGroupId && userscriptState.emojiGroups.length > 0) selectedGroupId = userscriptState.emojiGroups[0].id;
			userscriptState.emojiGroups.forEach((g) => {
				const row = createEl("div", {
					style: "display:flex; justify-content:space-between; align-items:center; padding:6px; border-radius:4px; cursor:pointer;",
					text: `${g.name || g.id} (${(g.emojis || []).length})`,
					attrs: {
						tabindex: "0",
						"data-group-id": g.id
					}
				});
				const selectGroup = () => {
					selectedGroupId = g.id;
					renderGroups();
					renderSelectedGroup();
				};
				row.addEventListener("click", selectGroup);
				row.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						selectGroup();
					}
				});
				if (selectedGroupId === g.id) row.style.background = "#f0f8ff";
				groupsList.appendChild(row);
			});
		}
		function showEditorFor(groupId, index) {
			createEditorPopup(groupId, index, renderGroups, renderSelectedGroup);
		}
		function renderSelectedGroup() {
			const group = userscriptState.emojiGroups.find((g) => g.id === selectedGroupId) || null;
			groupTitle.textContent = group ? group.name || group.id : "";
			emojisContainer.innerHTML = "";
			if (!group) return;
			(Array.isArray(group.emojis) ? group.emojis : []).forEach((emo, idx) => {
				const card = createEl("div", { className: "emoji-manager-card" });
				const img = createEl("img", {
					src: emo.url,
					alt: emo.name,
					className: "emoji-manager-card-img"
				});
				const name = createEl("div", {
					text: emo.name,
					className: "emoji-manager-card-name"
				});
				const actions = createEl("div", { className: "emoji-manager-card-actions" });
				const edit = createEl("button", {
					text: "编辑",
					className: "btn btn-sm"
				});
				edit.addEventListener("click", () => {
					showEditorFor(group.id, idx);
				});
				const del = createEl("button", {
					text: "删除",
					className: "btn btn-sm"
				});
				del.addEventListener("click", () => {
					group.emojis.splice(idx, 1);
					renderGroups();
					renderSelectedGroup();
				});
				actions.appendChild(edit);
				actions.appendChild(del);
				card.appendChild(img);
				card.appendChild(name);
				card.appendChild(actions);
				emojisContainer.appendChild(card);
				bindHoverPreview(img, emo);
			});
		}
		function bindHoverPreview(targetImg, emo) {
			const preview = ensureHoverPreview();
			const previewImg = preview.querySelector("img");
			const previewLabel = preview.querySelector(".emoji-picker-hover-label");
			function onEnter(e) {
				if (previewImg) previewImg.src = emo.url;
				if (previewImg) {
					if (emo.width) previewImg.style.width = typeof emo.width === "number" ? emo.width + "px" : emo.width;
					else previewImg.style.width = "";
					if (emo.height) previewImg.style.height = typeof emo.height === "number" ? emo.height + "px" : emo.height;
					else previewImg.style.height = "";
				}
				if (previewLabel) previewLabel.textContent = emo.name || "";
				preview.style.display = "block";
				movePreview(e);
			}
			function movePreview(e) {
				const pad = 12;
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				const rect = preview.getBoundingClientRect();
				let left$1 = e.clientX + pad;
				let top = e.clientY + pad;
				if (left$1 + rect.width > vw) left$1 = e.clientX - rect.width - pad;
				if (top + rect.height > vh) top = e.clientY - rect.height - pad;
				preview.style.left = left$1 + "px";
				preview.style.top = top + "px";
			}
			function onLeave() {
				preview.style.display = "none";
			}
			targetImg.addEventListener("mouseenter", onEnter);
			targetImg.addEventListener("mousemove", movePreview);
			targetImg.addEventListener("mouseleave", onLeave);
		}
		addGroupBtn.addEventListener("click", () => {
			const id = (addGroupInput.value || "").trim();
			if (!id) return alert("请输入分组 id");
			if (userscriptState.emojiGroups.find((g) => g.id === id)) return alert("分组已存在");
			userscriptState.emojiGroups.push({
				id,
				name: id,
				emojis: []
			});
			addGroupInput.value = "";
			const newIdx = userscriptState.emojiGroups.findIndex((g) => g.id === id);
			if (newIdx >= 0) selectedGroupId = userscriptState.emojiGroups[newIdx].id;
			renderGroups();
			renderSelectedGroup();
		});
		addEmojiBtn.addEventListener("click", () => {
			if (!selectedGroupId) return alert("请先选择分组");
			const url = (emojiUrlInput.value || "").trim();
			const name = (emojiNameInput.value || "").trim();
			const widthVal = (emojiWidthInput.value || "").trim();
			const heightVal = (emojiHeightInput.value || "").trim();
			const width = widthVal ? parseInt(widthVal, 10) : NaN;
			const height = heightVal ? parseInt(heightVal, 10) : NaN;
			if (!url || !name) return alert("请输入 url 和 名称");
			const group = userscriptState.emojiGroups.find((g) => g.id === selectedGroupId);
			if (!group) return;
			group.emojis = group.emojis || [];
			const newEmo = {
				url,
				name
			};
			if (!isNaN(width) && width > 0) newEmo.width = width;
			if (!isNaN(height) && height > 0) newEmo.height = height;
			group.emojis.push(newEmo);
			emojiUrlInput.value = "";
			emojiNameInput.value = "";
			emojiWidthInput.value = "";
			emojiHeightInput.value = "";
			renderGroups();
			renderSelectedGroup();
		});
		deleteGroupBtn.addEventListener("click", () => {
			if (!selectedGroupId) return alert("请先选择分组");
			const idx = userscriptState.emojiGroups.findIndex((g) => g.id === selectedGroupId);
			if (idx >= 0) {
				if (!confirm("确认删除该分组？该操作不可撤销")) return;
				userscriptState.emojiGroups.splice(idx, 1);
				if (userscriptState.emojiGroups.length > 0) selectedGroupId = userscriptState.emojiGroups[Math.min(idx, userscriptState.emojiGroups.length - 1)].id;
				else selectedGroupId = null;
				renderGroups();
				renderSelectedGroup();
			}
		});
		exportBtn.addEventListener("click", () => {
			showImportExportModal(selectedGroupId || void 0);
		});
		importBtn.addEventListener("click", () => {
			showImportExportModal(selectedGroupId || void 0);
		});
		saveBtn.addEventListener("click", () => {
			try {
				saveDataToLocalStorage({ emojiGroups: userscriptState.emojiGroups });
				alert("已保存");
			} catch (e) {
				alert("保存失败：" + e);
			}
		});
		syncBtn.addEventListener("click", () => {
			try {
				if (syncFromManager()) {
					const data = loadDataFromLocalStorage();
					userscriptState.emojiGroups = data.emojiGroups || [];
					userscriptState.settings = data.settings || userscriptState.settings;
					alert("同步成功，已导入管理器数据");
					renderGroups();
					renderSelectedGroup();
				} else alert("同步未成功，未检测到管理器数据");
			} catch (e) {
				alert("同步异常：" + e);
			}
		});
		closeBtn.addEventListener("click", () => modal.remove());
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
		renderGroups();
		if (userscriptState.emojiGroups.length > 0) {
			selectedGroupId = userscriptState.emojiGroups[0].id;
			const first = groupsList.firstChild;
			if (first) first.style.background = "#f0f8ff";
			renderSelectedGroup();
		}
	}
	var init_manager = __esmMin((() => {
		init_styles();
		init_createEl();
		init_state();
		init_userscript_storage();
		init_importExport();
	}));
	function showGroupEditorModal() {
		injectGlobalThemeStyles();
		const modal = createEl("div", { style: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    ` });
		const content = createEl("div", { style: `
      color: var(--emoji-modal-text);
      padding: 24px;
      max-width: 80%;
      overflow-y: auto;
      position: relative;
    ` });
		content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: var(--emoji-modal-text);backdrop-filter: blur(10px);">表情分组编辑器</h2>
      <button id="closeModal" style="border:none;font-size: 24px; cursor: pointer;">×</button>
    </div>

    <div style="margin-bottom: 20px; padding: 16px; background: var(--emoji-modal-button-bg);">
      <div>编辑说明</div>
      <div>
        • 点击分组名称或图标进行编辑<br>
        • 图标支持 emoji 字符或单个字符<br>
        • 修改会立即保存到本地存储<br>
        • 可以调整分组的显示顺序
      </div>
    </div>

    <div id="groupsList" style="display: flex; flex-direction: column; gap: 12px;">
      ${userscriptState.emojiGroups.map((group, index) => `
        <div class="group-item" data-group-id="${group.id}" data-index="${index}" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--emoji-modal-button-bg);
        ">
          <div class="drag-handle" style="
            cursor: grab;
            color: var(--emoji-modal-text);
            opacity: 0.5;
            font-size: 16px;
            user-select: none;
          " title="拖拽调整顺序">⋮⋮</div>` + (group.icon?.startsWith("https://") ? `<img class="group-icon-editor" src="${group.icon}" alt="图标" style="
            max-width: 100px;
          " data-group-id="${group.id}" title="点击编辑图标">` : `
          <div class="group-icon-editor" style="
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--secondary);
            font-size: 18px;
            user-select: none;
          " data-group-id="${group.id}" title="点击编辑图标">
            ${group.icon || "📁"}
          </div>`) + `<div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
            <input class="group-name-editor"
                   type="text"
                   value="${group.name || "Unnamed Group"}"
                   data-group-id="${group.id}"
                   style="
                     background: var(--secondary);
                     color: var(--emoji-modal-text);
                     border: 1px solid var(--emoji-modal-border);
                     border-radius: 4px;
                     padding: 8px 12px;
                     font-size: 14px;
                     font-weight: 500;
                   "
                   placeholder="分组名称">
            <div style="font-size: 12px; color: var(--emoji-modal-text);">
              ID: ${group.id} | 表情数：${group.emojis ? group.emojis.length : 0}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
            <button class="move-up" data-index="${index}" style="
              background: var(--emoji-modal-button-bg);
              border: 1px solid var(--emoji-modal-border);
              border-radius: 3px;
              padding: 4px 8px;
              cursor: pointer;
              font-size: 12px;
              color: var(--emoji-modal-text);
            " ${index === 0 ? "disabled" : ""}>↑</button>
            <button class="move-down" data-index="${index}" style="
              background: var(--emoji-modal-button-bg);
              border: 1px solid var(--emoji-modal-border);
              border-radius: 3px;
              padding: 4px 8px;
              cursor: pointer;
              font-size: 12px;
              color: var(--emoji-modal-text);
            " ${index === userscriptState.emojiGroups.length - 1 ? "disabled" : ""}>↓</button>
          </div>
        </div>
      `).join("")}
    </div>

    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--emoji-modal-border); display: flex; gap: 8px; justify-content: space-between;">
      <button id="openImportExport" style="padding: 8px 16px; background: var(--emoji-modal-button-bg); color: var(--emoji-modal-text); border: 1px solid var(--emoji-modal-border); border-radius: 4px; cursor: pointer;">分组导入/导出</button>
      <div style="display: flex; gap: 8px;">
        <button id="addNewGroup" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">新建分组</button>
        <button id="saveAllChanges" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">保存所有更改</button>
      </div>
    </div>
  `;
		modal.appendChild(content);
		document.body.appendChild(modal);
		ensureStyleInjected("group-editor-styles", `
    .group-item:hover {
      border-color: var(--emoji-modal-primary-bg) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .group-icon-editor:hover {
      background: var(--emoji-modal-primary-bg) !important;
      color: white;
    }
    .move-up:hover, .move-down:hover {
      background: var(--emoji-modal-primary-bg) !important;
      color: white;
    }
    .move-up:disabled, .move-down:disabled {
      opacity: 0.3;
      cursor: not-allowed !important;
    }
  `);
		content.querySelector("#closeModal")?.addEventListener("click", () => {
			modal.remove();
		});
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
		content.querySelectorAll(".group-name-editor").forEach((input) => {
			input.addEventListener("change", (e) => {
				const target = e.target;
				const groupId = target.getAttribute("data-group-id");
				const newName = target.value.trim();
				if (groupId && newName) {
					const group = userscriptState.emojiGroups.find((g) => g.id === groupId);
					if (group) {
						group.name = newName;
						showTemporaryMessage(`分组 "${newName}" 名称已更新`);
					}
				}
			});
		});
		content.querySelectorAll(".group-icon-editor").forEach((iconEl) => {
			iconEl.addEventListener("click", (e) => {
				const target = e.target;
				const groupId = target.getAttribute("data-group-id");
				if (groupId) {
					const newIcon = prompt("请输入新的图标字符 (emoji 或单个字符):", target.textContent || "📁");
					if (newIcon && newIcon.trim()) {
						const group = userscriptState.emojiGroups.find((g) => g.id === groupId);
						if (group) {
							group.icon = newIcon.trim();
							target.textContent = newIcon.trim();
							showTemporaryMessage(`分组图标已更新为: ${newIcon.trim()}`);
						}
					}
				}
			});
		});
		content.querySelectorAll(".move-up").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const index = parseInt(e.target.getAttribute("data-index") || "0");
				if (index > 0) {
					const temp = userscriptState.emojiGroups[index];
					userscriptState.emojiGroups[index] = userscriptState.emojiGroups[index - 1];
					userscriptState.emojiGroups[index - 1] = temp;
					modal.remove();
					showTemporaryMessage("分组顺序已调整");
					setTimeout(() => showGroupEditorModal(), 300);
				}
			});
		});
		content.querySelectorAll(".move-down").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const index = parseInt(e.target.getAttribute("data-index") || "0");
				if (index < userscriptState.emojiGroups.length - 1) {
					const temp = userscriptState.emojiGroups[index];
					userscriptState.emojiGroups[index] = userscriptState.emojiGroups[index + 1];
					userscriptState.emojiGroups[index + 1] = temp;
					modal.remove();
					showTemporaryMessage("分组顺序已调整");
					setTimeout(() => showGroupEditorModal(), 300);
				}
			});
		});
		content.querySelector("#addNewGroup")?.addEventListener("click", () => {
			const groupName = prompt("请输入新分组的名称:");
			if (groupName && groupName.trim()) {
				const newGroup = {
					id: "custom_" + Date.now(),
					name: groupName.trim(),
					icon: "📁",
					order: userscriptState.emojiGroups.length,
					emojis: []
				};
				userscriptState.emojiGroups.push(newGroup);
				modal.remove();
				showTemporaryMessage(`新分组 "${groupName.trim()}" 已创建`);
				setTimeout(() => showGroupEditorModal(), 300);
			}
		});
		content.querySelector("#saveAllChanges")?.addEventListener("click", () => {
			saveDataToLocalStorage({ emojiGroups: userscriptState.emojiGroups });
			showTemporaryMessage("所有更改已保存到本地存储");
		});
		content.querySelector("#openImportExport")?.addEventListener("click", () => {
			modal.remove();
			showImportExportModal();
		});
	}
	var init_groupEditor = __esmMin((() => {
		init_state();
		init_userscript_storage();
		init_createEl();
		init_themeSupport();
		init_tempMessage();
		init_injectStyles();
		init_importExport();
	}));
	function showPopularEmojisModal() {
		injectGlobalThemeStyles();
		const modal = createEl("div", { style: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    ` });
		const popularEmojis = getPopularEmojis(50);
		const content = createEl("div", {
			style: `
      background: var(--secondary);
      color: var(--emoji-modal-text);
      border-radius: 8px;
      padding: 24px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    `,
			innerHTML: `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0; color: var(--emoji-modal-text);">常用表情 (${popularEmojis.length})</h2>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button id="clearStats" style="padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">清空统计</button>
        <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
      </div>
    </div>

    <div style="margin-bottom: 16px; padding: 12px; background: var(--emoji-modal-button-bg); border-radius: 6px; border: 1px solid var(--emoji-modal-border);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 500; color: var(--emoji-modal-label);">表情按使用次数排序</span>
        <span style="font-size: 12px; color: var(--emoji-modal-text);">点击表情直接使用</span>
      </div>
      <div style="font-size: 12px; color: var(--emoji-modal-text);">
        总使用次数: ${popularEmojis.reduce((sum, emoji) => sum + emoji.count, 0)}
      </div>
    </div>

    <div id="popularEmojiGrid" style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
    ">
      ${popularEmojis.length === 0 ? "<div style=\"grid-column: 1/-1; text-align: center; padding: 40px; color: var(--emoji-modal-text);\">还没有使用过表情<br><small>开始使用表情后，这里会显示常用的表情</small></div>" : popularEmojis.map((emoji) => `
          <div class="popular-emoji-item" data-name="${emoji.name}" data-url="${emoji.url}" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            border: 1px solid var(--emoji-modal-border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            background: var(--emoji-modal-button-bg);
          ">
            <img src="${emoji.url}" alt="${emoji.name}" style="
              width: 40px;
              height: 40px;
              object-fit: contain;
              margin-bottom: 4px;
            ">
            <div style="
              font-size: 11px;
              font-weight: 500;
              color: var(--emoji-modal-text);
              text-align: center;
              word-break: break-all;
              line-height: 1.2;
              margin-bottom: 2px;
            ">${emoji.name}</div>
            <div style="
              font-size: 10px;
              color: var(--emoji-modal-text);
              opacity: 0.6;
              text-align: center;
            ">使用${emoji.count}次</div>
          </div>
        `).join("")}
    </div>

    ${popularEmojis.length > 0 ? `
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--emoji-modal-border); font-size: 12px; color: var(--emoji-modal-text); opacity: 0.6; text-align: center;">
        统计数据保存在本地，清空统计将重置所有使用记录
      </div>
    ` : ""}
  `
		});
		modal.appendChild(content);
		document.body.appendChild(modal);
		ensureStyleInjected("popular-emojis-styles", `
    .popular-emoji-item:hover {
      transform: translateY(-2px);
      border-color: var(--emoji-modal-primary-bg) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `);
		content.querySelector("#closeModal")?.addEventListener("click", () => {
			modal.remove();
		});
		content.querySelector("#clearStats")?.addEventListener("click", () => {
			if (confirm("确定要清空所有表情使用统计吗？此操作不可撤销。")) {
				clearEmojiUsageStats();
				modal.remove();
				showTemporaryMessage("表情使用统计已清空");
				setTimeout(() => showPopularEmojisModal(), 300);
			}
		});
		content.querySelectorAll(".popular-emoji-item").forEach((item) => {
			item.addEventListener("click", () => {
				const name = item.getAttribute("data-name");
				const url = item.getAttribute("data-url");
				if (name && url) {
					trackEmojiUsage(name, url);
					useEmojiFromPopular(name, url);
					modal.remove();
					showTemporaryMessage(`已使用表情: ${name}`);
				}
			});
		});
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
	}
	function useEmojiFromPopular(name, url) {
		const activeElement = document.activeElement;
		if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
			const textArea = activeElement;
			const format = userscriptState.settings.outputFormat;
			let emojiText = "";
			if (format === "markdown") emojiText = `![${name}](${url})`;
			else emojiText = `<img src="${url}" alt="${name}" style="width: ${userscriptState.settings.imageScale}px; height: ${userscriptState.settings.imageScale}px;">`;
			const start = textArea.selectionStart || 0;
			const end = textArea.selectionEnd || 0;
			const currentValue = textArea.value;
			textArea.value = currentValue.slice(0, start) + emojiText + currentValue.slice(end);
			const newPosition = start + emojiText.length;
			textArea.setSelectionRange(newPosition, newPosition);
			textArea.dispatchEvent(new Event("input", { bubbles: true }));
			textArea.focus();
		} else {
			const textAreas = document.querySelectorAll("textarea, input[type=\"text\"], [contenteditable=\"true\"]");
			const lastTextArea = Array.from(textAreas).pop();
			if (lastTextArea) {
				lastTextArea.focus();
				if (lastTextArea.tagName === "TEXTAREA" || lastTextArea.tagName === "INPUT") {
					const format = userscriptState.settings.outputFormat;
					let emojiText = "";
					if (format === "markdown") emojiText = `![${name}](${url})`;
					else emojiText = `<img src="${url}" alt="${name}" style="width: ${userscriptState.settings.imageScale}px; height: ${userscriptState.settings.imageScale}px;">`;
					const textarea = lastTextArea;
					textarea.value += emojiText;
					textarea.dispatchEvent(new Event("input", { bubbles: true }));
				}
			}
		}
	}
	var init_popularEmojis = __esmMin((() => {
		init_state();
		init_userscript_storage();
		init_createEl();
		init_themeSupport();
		init_tempMessage();
		init_injectStyles();
	}));
	var settings_exports = /* @__PURE__ */ __export({ showSettingsModal: () => showSettingsModal });
	function showSettingsModal() {
		injectGlobalThemeStyles();
		const modal = createEl("div", { style: `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  ` });
		const content = createEl("div", {
			style: `
    backdrop-filter: blur(10px);
    padding: 24px;
    overflow-y: auto;
    position: relative;
  `,
			innerHTML: `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0; color: var(--emoji-modal-text);">设置</h2>
      <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label); font-weight: 500;">图片缩放比例: <span id="scaleValue">${userscriptState.settings.imageScale}%</span></label>
      <input type="range" id="scaleSlider" min="5" max="150" step="5" value="${userscriptState.settings.imageScale}"
             style="width: 100%; margin-bottom: 8px;">
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; color: var(--emoji-modal-label); font-weight: 500;">输出格式:</label>
      <div style="display: flex; gap: 16px;">
        <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
          <input type="radio" name="outputFormat" value="markdown" ${userscriptState.settings.outputFormat === "markdown" ? "checked" : ""} style="margin-right: 4px;">
          Markdown
        </label>
        <label style="display: flex; align-items: center; color: var(--emoji-modal-text);">
          <input type="radio" name="outputFormat" value="html" ${userscriptState.settings.outputFormat === "html" ? "checked" : ""} style="margin-right: 4px;">
          HTML
        </label>
      </div>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="showSearchBar" ${userscriptState.settings.showSearchBar ? "checked" : ""} style="margin-right: 8px;">
        显示搜索栏
      </label>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="enableFloatingPreview" ${userscriptState.settings.enableFloatingPreview ? "checked" : ""} style="margin-right: 8px;">
        启用悬浮预览功能
      </label>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="enableCalloutSuggestions" ${userscriptState.settings.enableCalloutSuggestions ? "checked" : ""} style="margin-right: 8px;">
        在 textarea 中启用 Callout Suggestion（输入 [ 即可触发）
      </label>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: flex; align-items: center; color: var(--emoji-modal-label); font-weight: 500;">
        <input type="checkbox" id="forceMobileMode" ${userscriptState.settings.forceMobileMode ? "checked" : ""} style="margin-right: 8px;">
        强制移动模式 (在不兼容检测时也注入移动版布局)
      </label>
    </div>

    <div style="margin-bottom: 16px; padding: 12px; background: var(--emoji-modal-button-bg); border-radius: 6px; border: 1px solid var(--emoji-modal-border);">
      <div style="font-weight: 500; color: var(--emoji-modal-label); margin-bottom: 8px;">高级功能</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="openGroupEditor" style="
          padding: 6px 12px;
          background: var(--emoji-modal-primary-bg);
          color: white;
          border: none;
          font-size: 12px;
        ">编辑分组</button>
        <button id="openPopularEmojis" style="
          padding: 6px 12px;
          background: var(--emoji-modal-primary-bg);
          color: white;
          border: none;
          font-size: 12px;
        ">常用表情</button>
        <button id="openImportExport" style="
          padding: 6px 12px;
          background: var(--emoji-modal-primary-bg);
          color: white;
          border: none;
          font-size: 12px;
        ">导入导出</button>
      </div>
    </div>

    <div style="display: flex; gap: 8px; justify-content: flex-end;">
      <button id="resetSettings" style="padding: 8px 16px; background: var(--emoji-modal-button-bg); color: var(--emoji-modal-text); border: 1px solid var(--emoji-modal-border); border-radius: 4px; cursor: pointer;">重置</button>
      <button id="saveSettings" style="padding: 8px 16px; background: var(--emoji-modal-primary-bg); color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
    </div>
  `
		});
		modal.appendChild(content);
		document.body.appendChild(modal);
		const scaleSlider = content.querySelector("#scaleSlider");
		const scaleValue = content.querySelector("#scaleValue");
		scaleSlider?.addEventListener("input", () => {
			if (scaleValue) scaleValue.textContent = scaleSlider.value + "%";
		});
		content.querySelector("#closeModal")?.addEventListener("click", () => {
			modal.remove();
		});
		content.querySelector("#resetSettings")?.addEventListener("click", async () => {
			if (confirm("确定要重置所有设置吗？")) {
				userscriptState.settings = {
					imageScale: 30,
					gridColumns: 4,
					outputFormat: "markdown",
					forceMobileMode: false,
					defaultGroup: "nachoneko",
					showSearchBar: true,
					enableFloatingPreview: true,
					enableCalloutSuggestions: true
				};
				modal.remove();
			}
		});
		content.querySelector("#saveSettings")?.addEventListener("click", () => {
			userscriptState.settings.imageScale = parseInt(scaleSlider?.value || "30");
			const outputFormat = content.querySelector("input[name=\"outputFormat\"]:checked");
			if (outputFormat) userscriptState.settings.outputFormat = outputFormat.value;
			const showSearchBar = content.querySelector("#showSearchBar");
			if (showSearchBar) userscriptState.settings.showSearchBar = showSearchBar.checked;
			const enableFloatingPreview = content.querySelector("#enableFloatingPreview");
			if (enableFloatingPreview) userscriptState.settings.enableFloatingPreview = enableFloatingPreview.checked;
			const enableCalloutEl = content.querySelector("#enableCalloutSuggestions");
			if (enableCalloutEl) userscriptState.settings.enableCalloutSuggestions = !!enableCalloutEl.checked;
			const forceMobileEl = content.querySelector("#forceMobileMode");
			if (forceMobileEl) userscriptState.settings.forceMobileMode = !!forceMobileEl.checked;
			saveDataToLocalStorage({ settings: userscriptState.settings });
			try {
				const remoteInput = content.querySelector("#remoteConfigUrl");
				if (remoteInput && remoteInput.value.trim()) localStorage.setItem("emoji_extension_remote_config_url", remoteInput.value.trim());
			} catch (e) {}
			alert("设置已保存");
			modal.remove();
		});
		content.querySelector("#openGroupEditor")?.addEventListener("click", () => {
			modal.remove();
			showGroupEditorModal();
		});
		content.querySelector("#openPopularEmojis")?.addEventListener("click", () => {
			modal.remove();
			showPopularEmojisModal();
		});
		content.querySelector("#openImportExport")?.addEventListener("click", () => {
			modal.remove();
			showImportExportModal();
		});
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
	}
	var init_settings = __esmMin((() => {
		init_state();
		init_userscript_storage();
		init_createEl();
		init_themeSupport();
		init_groupEditor();
		init_popularEmojis();
		init_importExport();
	}));
	init_state();
	init_userscript_storage();
	init_createEl();
	init_hoverPreview();
	function isMobileView() {
		try {
			return getEffectivePlatform() === "mobile" || !!(userscriptState && userscriptState.settings && userscriptState.settings.forceMobileMode);
		} catch (e) {
			return false;
		}
	}
	function insertEmojiIntoEditor(emoji) {
		console.log("[Emoji Extension Userscript] Inserting emoji:", emoji);
		if (emoji.name && emoji.url) trackEmojiUsage(emoji.name, emoji.url);
		const textarea = document.querySelector("textarea.d-editor-input");
		const proseMirror = document.querySelector(".ProseMirror.d-editor-input");
		if (!textarea && !proseMirror) {
			console.error("找不到输入框");
			return;
		}
		const dimensionMatch = emoji.url?.match(/_(\d{3,})x(\d{3,})\./);
		let width = "500";
		let height = "500";
		if (dimensionMatch) {
			width = dimensionMatch[1];
			height = dimensionMatch[2];
		} else if (emoji.width && emoji.height) {
			width = emoji.width.toString();
			height = emoji.height.toString();
		}
		const scale = userscriptState.settings?.imageScale || 30;
		const outputFormat = userscriptState.settings?.outputFormat || "markdown";
		if (textarea) {
			let insertText = "";
			if (outputFormat === "html") {
				const scaledWidth = Math.max(1, Math.round(Number(width) * (scale / 100)));
				const scaledHeight = Math.max(1, Math.round(Number(height) * (scale / 100)));
				insertText = `<img src="${emoji.url}" title=":${emoji.name}:" class="emoji only-emoji" alt=":${emoji.name}:" loading="lazy" width="${scaledWidth}" height="${scaledHeight}" style="aspect-ratio: ${scaledWidth} / ${scaledHeight};"> `;
			} else insertText = `![${emoji.name}|${width}x${height},${scale}%](${emoji.url}) `;
			const selectionStart = textarea.selectionStart;
			const selectionEnd = textarea.selectionEnd;
			textarea.value = textarea.value.substring(0, selectionStart) + insertText + textarea.value.substring(selectionEnd, textarea.value.length);
			textarea.selectionStart = textarea.selectionEnd = selectionStart + insertText.length;
			textarea.focus();
			const inputEvent = new Event("input", {
				bubbles: true,
				cancelable: true
			});
			textarea.dispatchEvent(inputEvent);
		} else if (proseMirror) {
			const imgWidth = Number(width) || 500;
			const scaledWidth = Math.max(1, Math.round(imgWidth * (scale / 100)));
			const htmlContent = `<img src="${emoji.url}" alt="${emoji.name}" width="${width}" height="${height}" data-scale="${scale}" style="width: ${scaledWidth}px">`;
			try {
				const dataTransfer = new DataTransfer();
				dataTransfer.setData("text/html", htmlContent);
				const pasteEvent = new ClipboardEvent("paste", {
					clipboardData: dataTransfer,
					bubbles: true
				});
				proseMirror.dispatchEvent(pasteEvent);
			} catch (error) {
				try {
					document.execCommand("insertHTML", false, htmlContent);
				} catch (fallbackError) {
					console.error("无法向富文本编辑器中插入表情", fallbackError);
				}
			}
		}
	}
	function createMobileEmojiPicker(groups) {
		const modal = createEl("div", {
			className: "modal d-modal fk-d-menu-modal emoji-picker-content",
			attrs: {
				"data-identifier": "emoji-picker",
				"data-keyboard": "false",
				"aria-modal": "true",
				role: "dialog"
			}
		});
		const modalContainerDiv = createEl("div", { className: "d-modal__container" });
		const modalBody = createEl("div", { className: "d-modal__body" });
		modalBody.tabIndex = -1;
		const emojiPickerDiv = createEl("div", { className: "emoji-picker" });
		const filterContainer = createEl("div", { className: "emoji-picker__filter-container" });
		const filterInputContainer = createEl("div", { className: "emoji-picker__filter filter-input-container" });
		const filterInput = createEl("input", {
			className: "filter-input",
			placeholder: "按表情符号名称搜索…",
			type: "text"
		});
		filterInputContainer.appendChild(filterInput);
		const closeButton = createEl("button", {
			className: "btn no-text btn-icon btn-transparent emoji-picker__close-btn",
			type: "button",
			innerHTML: `<svg class="fa d-icon d-icon-xmark svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>`
		});
		closeButton.addEventListener("click", () => {
			const container = modal.closest(".modal-container") || modal;
			if (container) container.remove();
		});
		filterContainer.appendChild(filterInputContainer);
		filterContainer.appendChild(closeButton);
		const content = createEl("div", { className: "emoji-picker__content" });
		const sectionsNav = createEl("div", { className: "emoji-picker__sections-nav" });
		const managementButton = createEl("button", {
			className: "btn no-text btn-flat emoji-picker__section-btn management-btn",
			attrs: {
				tabindex: "-1",
				style: "border-right: 1px solid #ddd;"
			},
			innerHTML: "⚙️",
			title: "管理表情 - 点击打开完整管理界面",
			type: "button"
		});
		managementButton.addEventListener("click", () => {
			__vitePreload(async () => {
				const { openManagementInterface: openManagementInterface$1 } = await Promise.resolve().then(() => (init_manager(), manager_exports));
				return { openManagementInterface: openManagementInterface$1 };
			}, void 0).then(({ openManagementInterface: openManagementInterface$1 }) => {
				openManagementInterface$1();
			});
		});
		sectionsNav.appendChild(managementButton);
		const settingsButton = createEl("button", {
			className: "btn no-text btn-flat emoji-picker__section-btn settings-btn",
			innerHTML: "🔧",
			title: "设置",
			attrs: {
				tabindex: "-1",
				style: "border-right: 1px solid #ddd;"
			},
			type: "button"
		});
		settingsButton.addEventListener("click", async () => {
			try {
				const { showSettingsModal: showSettingsModal$1 } = await __vitePreload(async () => {
					const { showSettingsModal: showSettingsModal$2 } = await Promise.resolve().then(() => (init_settings(), settings_exports));
					return { showSettingsModal: showSettingsModal$2 };
				}, void 0);
				showSettingsModal$1();
			} catch (e) {
				console.error("[Userscript] Failed to load settings module:", e);
			}
		});
		sectionsNav.appendChild(settingsButton);
		const scrollableContent = createEl("div", { className: "emoji-picker__scrollable-content" });
		const sections = createEl("div", {
			className: "emoji-picker__sections",
			attrs: { role: "button" }
		});
		groups.forEach((group, index) => {
			if (!group?.emojis?.length) return;
			const navButton = createEl("button", {
				className: `btn no-text btn-flat emoji-picker__section-btn ${index === 0 ? "active" : ""}`,
				attrs: {
					tabindex: "-1",
					"data-section": group.id,
					type: "button"
				}
			});
			const iconVal = group.icon || "📁";
			if (isImageUrl(iconVal)) {
				const img = createEl("img", {
					src: iconVal,
					alt: group.name || "",
					className: "emoji",
					style: "width: 18px; height: 18px; object-fit: contain;"
				});
				navButton.appendChild(img);
			} else navButton.textContent = String(iconVal);
			navButton.title = group.name;
			navButton.addEventListener("click", () => {
				sectionsNav.querySelectorAll(".emoji-picker__section-btn").forEach((btn) => btn.classList.remove("active"));
				navButton.classList.add("active");
				const target = sections.querySelector(`[data-section="${group.id}"]`);
				if (target) target.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			});
			sectionsNav.appendChild(navButton);
			const section = createEl("div", {
				className: "emoji-picker__section",
				attrs: {
					"data-section": group.id,
					role: "region",
					"aria-label": group.name
				}
			});
			const titleContainer = createEl("div", { className: "emoji-picker__section-title-container" });
			const title = createEl("h2", {
				className: "emoji-picker__section-title",
				text: group.name
			});
			titleContainer.appendChild(title);
			const sectionEmojis = createEl("div", { className: "emoji-picker__section-emojis" });
			group.emojis.forEach((emoji) => {
				if (!emoji || typeof emoji !== "object" || !emoji.url || !emoji.name) return;
				const img = createEl("img", {
					src: emoji.url,
					alt: emoji.name,
					className: "emoji",
					title: `:${emoji.name}:`,
					style: "width: 32px; height: 32px; object-fit: contain;",
					attrs: {
						"data-emoji": emoji.name,
						tabindex: "0",
						loading: "lazy"
					}
				});
				(function bindHover(imgEl, emo) {
					if (!userscriptState.settings?.enableFloatingPreview) return;
					const preview = ensureHoverPreview();
					const previewImg = preview.querySelector("img");
					const previewLabel = preview.querySelector(".emoji-picker-hover-label");
					let fadeTimer = null;
					function onEnter(e) {
						previewImg.src = emo.url;
						previewLabel.textContent = emo.name || "";
						preview.style.display = "block";
						preview.style.opacity = "1";
						preview.style.transition = "opacity 0.12s ease, transform 0.12s ease";
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						fadeTimer = window.setTimeout(() => {
							preview.style.opacity = "0";
							setTimeout(() => {
								if (preview.style.opacity === "0") preview.style.display = "none";
							}, 300);
						}, 5e3);
						move(e);
					}
					function move(e) {
						const pad = 12;
						const vw = window.innerWidth;
						const vh = window.innerHeight;
						const rect = preview.getBoundingClientRect();
						let left = e.clientX + pad;
						let top = e.clientY + pad;
						if (left + rect.width > vw) left = e.clientX - rect.width - pad;
						if (top + rect.height > vh) top = e.clientY - rect.height - pad;
						preview.style.left = left + "px";
						preview.style.top = top + "px";
					}
					function onLeave() {
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						preview.style.display = "none";
					}
					imgEl.addEventListener("mouseenter", onEnter);
					imgEl.addEventListener("mousemove", move);
					imgEl.addEventListener("mouseleave", onLeave);
				})(img, emoji);
				img.addEventListener("click", () => {
					insertEmojiIntoEditor(emoji);
					if (modal.parentElement) modal.parentElement.removeChild(modal);
				});
				img.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						insertEmojiIntoEditor(emoji);
						if (modal.parentElement) modal.parentElement.removeChild(modal);
					}
				});
				sectionEmojis.appendChild(img);
			});
			section.appendChild(titleContainer);
			section.appendChild(sectionEmojis);
			sections.appendChild(section);
		});
		filterInput.addEventListener("input", (e) => {
			const q = (e.target.value || "").toLowerCase();
			sections.querySelectorAll("img").forEach((img) => {
				const emojiName = (img.dataset.emoji || "").toLowerCase();
				img.style.display = q === "" || emojiName.includes(q) ? "" : "none";
			});
			sections.querySelectorAll(".emoji-picker__section").forEach((section) => {
				const visibleEmojis = section.querySelectorAll("img:not([style*=\"display: none\"])");
				section.style.display = visibleEmojis.length > 0 ? "" : "none";
			});
		});
		scrollableContent.appendChild(sections);
		content.appendChild(sectionsNav);
		content.appendChild(scrollableContent);
		emojiPickerDiv.appendChild(filterContainer);
		emojiPickerDiv.appendChild(content);
		modalBody.appendChild(emojiPickerDiv);
		modalContainerDiv.appendChild(modalBody);
		modal.appendChild(modalContainerDiv);
		return modal;
	}
	function createDesktopEmojiPicker(groups) {
		const picker = createEl("div", {
			className: "fk-d-menu -animated -expanded",
			style: "max-width: 400px; visibility: visible; z-index: 999999;",
			attrs: {
				"data-identifier": "emoji-picker",
				role: "dialog"
			}
		});
		const innerContent = createEl("div", { className: "fk-d-menu__inner-content" });
		const emojiPickerDiv = createEl("div", { className: "emoji-picker" });
		const filterContainer = createEl("div", { className: "emoji-picker__filter-container" });
		const filterDiv = createEl("div", { className: "emoji-picker__filter filter-input-container" });
		const searchInput = createEl("input", {
			className: "filter-input",
			placeholder: "按表情符号名称搜索…",
			type: "text"
		});
		filterDiv.appendChild(searchInput);
		filterContainer.appendChild(filterDiv);
		const content = createEl("div", { className: "emoji-picker__content" });
		const sectionsNav = createEl("div", { className: "emoji-picker__sections-nav" });
		const managementButton = createEl("button", {
			className: "btn no-text btn-flat emoji-picker__section-btn management-btn",
			attrs: {
				tabindex: "-1",
				style: "border-right: 1px solid #ddd;"
			},
			type: "button",
			innerHTML: "⚙️",
			title: "管理表情 - 点击打开完整管理界面"
		});
		managementButton.addEventListener("click", () => {
			__vitePreload(async () => {
				const { openManagementInterface: openManagementInterface$1 } = await Promise.resolve().then(() => (init_manager(), manager_exports));
				return { openManagementInterface: openManagementInterface$1 };
			}, void 0).then(({ openManagementInterface: openManagementInterface$1 }) => {
				openManagementInterface$1();
			});
		});
		sectionsNav.appendChild(managementButton);
		const settingsButton = createEl("button", {
			className: "btn no-text btn-flat emoji-picker__section-btn settings-btn",
			attrs: {
				tabindex: "-1",
				style: "border-right: 1px solid #ddd;"
			},
			type: "button",
			innerHTML: "🔧",
			title: "设置"
		});
		settingsButton.addEventListener("click", async () => {
			try {
				const { showSettingsModal: showSettingsModal$1 } = await __vitePreload(async () => {
					const { showSettingsModal: showSettingsModal$2 } = await Promise.resolve().then(() => (init_settings(), settings_exports));
					return { showSettingsModal: showSettingsModal$2 };
				}, void 0);
				showSettingsModal$1();
			} catch (e) {
				console.error("[Userscript] Failed to load settings module:", e);
			}
		});
		sectionsNav.appendChild(settingsButton);
		const scrollableContent = createEl("div", { className: "emoji-picker__scrollable-content" });
		const sections = createEl("div", {
			className: "emoji-picker__sections",
			attrs: { role: "button" }
		});
		groups.forEach((group, index) => {
			if (!group?.emojis?.length) return;
			const navButton = createEl("button", {
				className: `btn no-text btn-flat emoji-picker__section-btn ${index === 0 ? "active" : ""}`,
				attrs: {
					tabindex: "-1",
					"data-section": group.id
				},
				type: "button"
			});
			const iconVal = group.icon || "📁";
			if (isImageUrl(iconVal)) {
				const img = createEl("img", {
					src: iconVal,
					alt: group.name || "",
					className: "emoji-group-icon",
					style: "width: 18px; height: 18px; object-fit: contain;"
				});
				navButton.appendChild(img);
			} else navButton.textContent = String(iconVal);
			navButton.title = group.name;
			navButton.addEventListener("click", () => {
				sectionsNav.querySelectorAll(".emoji-picker__section-btn").forEach((btn) => btn.classList.remove("active"));
				navButton.classList.add("active");
				const target = sections.querySelector(`[data-section="${group.id}"]`);
				if (target) target.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			});
			sectionsNav.appendChild(navButton);
			const section = createEl("div", {
				className: "emoji-picker__section",
				attrs: {
					"data-section": group.id,
					role: "region",
					"aria-label": group.name
				}
			});
			const titleContainer = createEl("div", { className: "emoji-picker__section-title-container" });
			const title = createEl("h2", {
				className: "emoji-picker__section-title",
				text: group.name
			});
			titleContainer.appendChild(title);
			const sectionEmojis = createEl("div", { className: "emoji-picker__section-emojis" });
			let added = 0;
			group.emojis.forEach((emoji) => {
				if (!emoji || typeof emoji !== "object" || !emoji.url || !emoji.name) return;
				const img = createEl("img", {
					width: "32px",
					height: "32px",
					className: "emoji",
					src: emoji.url,
					alt: emoji.name,
					title: `:${emoji.name}:`,
					attrs: {
						"data-emoji": emoji.name,
						tabindex: "0",
						loading: "lazy"
					}
				});
				(function bindHover(imgEl, emo) {
					if (!userscriptState.settings?.enableFloatingPreview) return;
					const preview = ensureHoverPreview();
					const previewImg = preview.querySelector("img");
					const previewLabel = preview.querySelector(".emoji-picker-hover-label");
					let fadeTimer = null;
					function onEnter(e) {
						previewImg.src = emo.url;
						previewLabel.textContent = emo.name || "";
						preview.style.display = "block";
						preview.style.opacity = "1";
						preview.style.transition = "opacity 0.12s ease, transform 0.12s ease";
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						fadeTimer = window.setTimeout(() => {
							preview.style.opacity = "0";
							setTimeout(() => {
								if (preview.style.opacity === "0") preview.style.display = "none";
							}, 300);
						}, 5e3);
						move(e);
					}
					function move(e) {
						const pad = 12;
						const vw = window.innerWidth;
						const vh = window.innerHeight;
						const rect = preview.getBoundingClientRect();
						let left = e.clientX + pad;
						let top = e.clientY + pad;
						if (left + rect.width > vw) left = e.clientX - rect.width - pad;
						if (top + rect.height > vh) top = e.clientY - rect.height - pad;
						preview.style.left = left + "px";
						preview.style.top = top + "px";
					}
					function onLeave() {
						if (fadeTimer) {
							clearTimeout(fadeTimer);
							fadeTimer = null;
						}
						preview.style.display = "none";
					}
					imgEl.addEventListener("mouseenter", onEnter);
					imgEl.addEventListener("mousemove", move);
					imgEl.addEventListener("mouseleave", onLeave);
				})(img, emoji);
				img.addEventListener("click", () => {
					insertEmojiIntoEditor(emoji);
					picker.remove();
				});
				img.addEventListener("keydown", (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						insertEmojiIntoEditor(emoji);
						picker.remove();
					}
				});
				sectionEmojis.appendChild(img);
				added++;
			});
			if (added === 0) {
				const msg = createEl("div", {
					text: `${group.name} 组暂无有效表情`,
					style: "padding: 20px; text-align: center; color: #999;"
				});
				sectionEmojis.appendChild(msg);
			}
			section.appendChild(titleContainer);
			section.appendChild(sectionEmojis);
			sections.appendChild(section);
		});
		searchInput.addEventListener("input", (e) => {
			const q = (e.target.value || "").toLowerCase();
			sections.querySelectorAll("img").forEach((img) => {
				const emojiName = img.getAttribute("data-emoji")?.toLowerCase() || "";
				img.style.display = q === "" || emojiName.includes(q) ? "" : "none";
			});
			sections.querySelectorAll(".emoji-picker__section").forEach((section) => {
				const visibleEmojis = section.querySelectorAll("img:not([style*=\"none\"])");
				const titleContainer = section.querySelector(".emoji-picker__section-title-container");
				if (titleContainer) titleContainer.style.display = visibleEmojis.length > 0 ? "" : "none";
			});
		});
		scrollableContent.appendChild(sections);
		content.appendChild(sectionsNav);
		content.appendChild(scrollableContent);
		emojiPickerDiv.appendChild(filterContainer);
		emojiPickerDiv.appendChild(content);
		innerContent.appendChild(emojiPickerDiv);
		picker.appendChild(innerContent);
		return picker;
	}
	async function createEmojiPicker() {
		const groups = userscriptState.emojiGroups;
		const mobile = isMobileView();
		try {
			injectEmojiPickerStyles();
		} catch (e) {
			console.warn("injectEmojiPickerStyles failed", e);
		}
		if (mobile) return createMobileEmojiPicker(groups);
		else return createDesktopEmojiPicker(groups);
	}
	init_createEl();
	init_popularEmojis();
	var QUICK_INSERTS = [
		"info",
		"tip",
		"faq",
		"question",
		"note",
		"abstract",
		"todo",
		"success",
		"warning",
		"failure",
		"danger",
		"bug",
		"example",
		"quote"
	];
	var ICONS = {
		info: {
			icon: "ℹ️",
			color: "rgba(2, 122, 255, 0.1)",
			svg: "<svg class=\"fa d-icon d-icon-far-lightbulb svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-lightbulb\"></use></svg>"
		},
		tip: {
			icon: "💡",
			color: "rgba(0, 191, 188, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-fire-flame-curved svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#fire-flame-curved\"></use></svg>"
		},
		faq: {
			icon: "❓",
			color: "rgba(236, 117, 0, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-far-circle-question svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-circle-question\"></use></svg>"
		},
		question: {
			icon: "🤔",
			color: "rgba(236, 117, 0, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-far-circle-question svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-circle-question\"></use></svg>"
		},
		note: {
			icon: "📝",
			color: "rgba(8, 109, 221, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-far-pen-to-square svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-pen-to-square\"></use></svg>"
		},
		abstract: {
			icon: "📋",
			color: "rgba(0, 191, 188, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-far-clipboard svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-clipboard\"></use></svg>"
		},
		todo: {
			icon: "☑️",
			color: "rgba(2, 122, 255, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-far-circle-check svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#far-circle-check\"></use></svg>"
		},
		success: {
			icon: "🎉",
			color: "rgba(68, 207, 110, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-check svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#check\"></use></svg>"
		},
		warning: {
			icon: "⚠️",
			color: "rgba(236, 117, 0, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-triangle-exclamation svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#triangle-exclamation\"></use></svg>"
		},
		failure: {
			icon: "❌",
			color: "rgba(233, 49, 71, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-xmark svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#xmark\"></use></svg>"
		},
		danger: {
			icon: "☠️",
			color: "rgba(233, 49, 71, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-bolt svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#bolt\"></use></svg>"
		},
		bug: {
			icon: "🐛",
			color: "rgba(233, 49, 71, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-bug svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#bug\"></use></svg>"
		},
		example: {
			icon: "🔎",
			color: "rgba(120, 82, 238, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-list svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#list\"></use></svg>"
		},
		quote: {
			icon: "💬",
			color: "rgba(158, 158, 158, 0.1);",
			svg: "<svg class=\"fa d-icon d-icon-quote-left svg-icon svg-string\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"><use href=\"#quote-left\"></use></svg>"
		}
	};
	function insertIntoEditor(text) {
		console.log("[Quick Insert] Inserting text:", text);
		// 优先查找 Discourse 编辑器
		const textarea = document.querySelector("textarea.d-editor-input");
		const proseMirror = document.querySelector(".ProseMirror.d-editor-input");

		if (!textarea && !proseMirror) {
			console.error("找不到输入框");
			return;
		}

		if (textarea) {
			const selectionStart = textarea.selectionStart ?? 0;
			const selectionEnd = textarea.selectionEnd ?? selectionStart;
			textarea.value = textarea.value.substring(0, selectionStart) + text + textarea.value.substring(selectionEnd, textarea.value.length);
			textarea.selectionStart = textarea.selectionEnd = selectionStart + text.length;
			textarea.focus();
			const inputEvent = new Event("input", {
				bubbles: true,
				cancelable: true
			});
			textarea.dispatchEvent(inputEvent);
			return;
		}

		if (proseMirror) {
			try {
				const dataTransfer = new DataTransfer();
				dataTransfer.setData("text/plain", text);
				const pasteEvent = new ClipboardEvent("paste", {
					clipboardData: dataTransfer,
					bubbles: true
				});
				proseMirror.dispatchEvent(pasteEvent);
			} catch (error) {
				try {
					document.execCommand("insertText", false, text);
				} catch (fallbackError) {
					console.error("无法向富文本编辑器中插入文本", fallbackError);
				}
			}
		}
	}
	function createQuickInsertMenu() {
		const menu = createEl("div", { className: "fk-d-menu toolbar-menu__options-content toolbar-popup-menu-options -animated -expanded" });
		const inner = createEl("div", { className: "fk-d-menu__inner-content" });
		const list = createEl("ul", { className: "dropdown-menu" });
		QUICK_INSERTS.forEach((key) => {
			// 创建加号版本
			const liPlus = createEl("li", { className: "dropdown-menu__item" });
			const btnPlus = createEl("button", {
				className: "btn btn-icon-text",
				type: "button",
				title: key.charAt(0).toUpperCase() + key.slice(1) + " (+)",
				style: "background: " + (ICONS[key]?.color || "auto")
			});
			btnPlus.addEventListener("click", () => {
				if (menu.parentElement) menu.parentElement.removeChild(menu);
				insertIntoEditor(`> [!${key}]+\n`);
			});
			const emojiSpanPlus = createEl("span", {
				className: "d-button-emoji",
				text: ICONS[key]?.icon || "✳️",
				style: "margin-right: 6px;"
			});
			const labelWrapPlus = createEl("span", { className: "d-button-label" });
			const labelTextPlus = createEl("span", {
				className: "d-button-label__text",
				text: key.charAt(0).toUpperCase() + key.slice(1) + " +"
			});
			labelWrapPlus.appendChild(labelTextPlus);
			const svgHtml = ICONS[key]?.svg || "";
			if (svgHtml) {
				const svgSpanPlus = createEl("span", {
					className: "d-button-label__svg",
					innerHTML: svgHtml,
					style: "margin-left: 6px; display: inline-flex; align-items: center;"
				});
				labelWrapPlus.appendChild(svgSpanPlus);
			}
			btnPlus.appendChild(emojiSpanPlus);
			btnPlus.appendChild(labelWrapPlus);
			liPlus.appendChild(btnPlus);
			list.appendChild(liPlus);

			// 创建减号版本
			const liMinus = createEl("li", { className: "dropdown-menu__item" });
			const btnMinus = createEl("button", {
				className: "btn btn-icon-text",
				type: "button",
				title: key.charAt(0).toUpperCase() + key.slice(1) + " (-)",
				style: "background: " + (ICONS[key]?.color || "auto")
			});
			btnMinus.addEventListener("click", () => {
				if (menu.parentElement) menu.parentElement.removeChild(menu);
				insertIntoEditor(`> [!${key}]-\n`);
			});
			const emojiSpanMinus = createEl("span", {
				className: "d-button-emoji",
				text: ICONS[key]?.icon || "✳️",
				style: "margin-right: 6px;"
			});
			const labelWrapMinus = createEl("span", { className: "d-button-label" });
			const labelTextMinus = createEl("span", {
				className: "d-button-label__text",
				text: key.charAt(0).toUpperCase() + key.slice(1) + " -"
			});
			labelWrapMinus.appendChild(labelTextMinus);
			if (svgHtml) {
				const svgSpanMinus = createEl("span", {
					className: "d-button-label__svg",
					innerHTML: svgHtml,
					style: "margin-left: 6px; display: inline-flex; align-items: center;"
				});
				labelWrapMinus.appendChild(svgSpanMinus);
			}
			btnMinus.appendChild(emojiSpanMinus);
			btnMinus.appendChild(labelWrapMinus);
			liMinus.appendChild(btnMinus);
			list.appendChild(liMinus);
		});
		inner.appendChild(list);
		menu.appendChild(inner);
		return menu;
	}
	function findAllToolbars() {
		const toolbars = [];
		const selectors = getPlatformToolbarSelectors();
		for (const selector of selectors) {
			const elements = document.querySelectorAll(selector);
			toolbars.push(...Array.from(elements));
		}
		return toolbars;
	}
	var currentPicker = null;
	function closeCurrentPicker() {
		if (currentPicker) {
			currentPicker.remove();
			currentPicker = null;
		}
	}
	function injectEmojiButton(toolbar) {
		if (toolbar.querySelector(".emoji-extension-button")) return;
		const isChatComposer = toolbar.classList.contains("chat-composer__inner-container");
		const button = createEl("button", {
			className: "btn no-text btn-icon toolbar__button nacho-emoji-picker-button emoji-extension-button",
			title: "表情包",
			type: "button",
			innerHTML: "🐈‍⬛"
		});
		const popularButton = createEl("button", {
			className: "btn no-text btn-icon toolbar__button nacho-emoji-popular-button emoji-extension-button",
			title: "常用表情",
			type: "button",
			innerHTML: "⭐"
		});
		if (isChatComposer) {
			button.classList.add("fk-d-menu__trigger", "emoji-picker-trigger", "chat-composer-button", "btn-transparent", "-emoji");
			button.setAttribute("aria-expanded", "false");
			button.setAttribute("data-identifier", "emoji-picker");
			button.setAttribute("data-trigger", "");
			popularButton.classList.add("fk-d-menu__trigger", "popular-emoji-trigger", "chat-composer-button", "btn-transparent", "-popular");
			popularButton.setAttribute("aria-expanded", "false");
			popularButton.setAttribute("data-identifier", "popular-emoji");
			popularButton.setAttribute("data-trigger", "");
		}
		button.addEventListener("click", async (e) => {
			e.stopPropagation();
			if (currentPicker) {
				closeCurrentPicker();
				return;
			}
			currentPicker = await createEmojiPicker();
			if (!currentPicker) return;
			document.body.appendChild(currentPicker);
			const buttonRect = button.getBoundingClientRect();
			if (currentPicker.classList.contains("modal") || currentPicker.className.includes("d-modal")) {
				currentPicker.style.position = "fixed";
				currentPicker.style.top = "0";
				currentPicker.style.left = "0";
				currentPicker.style.right = "0";
				currentPicker.style.bottom = "0";
				currentPicker.style.zIndex = "999999";
			} else {
				currentPicker.style.position = "fixed";
				const margin = 8;
				const vpWidth = window.innerWidth;
				const vpHeight = window.innerHeight;
				currentPicker.style.top = buttonRect.bottom + margin + "px";
				currentPicker.style.left = buttonRect.left + "px";
				const pickerRect = currentPicker.getBoundingClientRect();
				const spaceBelow = vpHeight - buttonRect.bottom;
				const neededHeight = pickerRect.height + margin;
				let top = buttonRect.bottom + margin;
				if (spaceBelow < neededHeight) top = Math.max(margin, buttonRect.top - pickerRect.height - margin);
				let left = buttonRect.left;
				if (left + pickerRect.width + margin > vpWidth) left = Math.max(margin, vpWidth - pickerRect.width - margin);
				if (left < margin) left = margin;
				currentPicker.style.top = top + "px";
				currentPicker.style.left = left + "px";
			}
			setTimeout(() => {
				const handleClick = (e$1) => {
					if (currentPicker && !currentPicker.contains(e$1.target) && e$1.target !== button) {
						closeCurrentPicker();
						document.removeEventListener("click", handleClick);
					}
				};
				document.addEventListener("click", handleClick);
			}, 100);
		});
		popularButton.addEventListener("click", (e) => {
			e.stopPropagation();
			closeCurrentPicker();
			showPopularEmojisModal();
		});
		const quickInsertButton = createEl("button", {
			className: "btn no-text btn-icon toolbar__button quick-insert-button",
			title: "快捷输入",
			type: "button",
			innerHTML: "⎘"
		});
		if (isChatComposer) {
			quickInsertButton.classList.add("fk-d-menu__trigger", "chat-composer-button", "btn-transparent");
			quickInsertButton.setAttribute("aria-expanded", "false");
			quickInsertButton.setAttribute("data-trigger", "");
		}
		quickInsertButton.addEventListener("click", (e) => {
			e.stopPropagation();
			const menu = createQuickInsertMenu();
			(document.querySelector("#d-menu-portals") || document.body).appendChild(menu);
			const rect = quickInsertButton.getBoundingClientRect();
			menu.style.position = "fixed";
			menu.style.zIndex = "10000";
			menu.style.top = `${rect.bottom + 5}px`;
			menu.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - 150, window.innerWidth - 300))}px`;
			const removeMenu = (ev) => {
				if (!menu.contains(ev.target)) {
					if (menu.parentElement) menu.parentElement.removeChild(menu);
					document.removeEventListener("click", removeMenu);
				}
			};
			setTimeout(() => document.addEventListener("click", removeMenu), 100);
		});
		try {
			if (isChatComposer) {
				const existingEmojiTrigger = toolbar.querySelector(".emoji-picker-trigger:not(.emoji-extension-button)");
				if (existingEmojiTrigger) {
					toolbar.insertBefore(button, existingEmojiTrigger);
					toolbar.insertBefore(quickInsertButton, existingEmojiTrigger);
					toolbar.insertBefore(popularButton, existingEmojiTrigger);
				} else {
					toolbar.appendChild(button);
					toolbar.appendChild(quickInsertButton);
					toolbar.appendChild(popularButton);
				}
			} else {
				toolbar.appendChild(button);
				toolbar.appendChild(quickInsertButton);
				toolbar.appendChild(popularButton);
			}
		} catch (error) {
			console.error("[Emoji Extension Userscript] Failed to inject button:", error);
		}
	}
	function attemptInjection() {
		const toolbars = findAllToolbars();
		let injectedCount = 0;
		toolbars.forEach((toolbar) => {
			if (!toolbar.querySelector(".emoji-extension-button")) {
				console.log("[Emoji Extension Userscript] Toolbar found, injecting button.");
				injectEmojiButton(toolbar);
				injectedCount++;
			}
		});
		return {
			injectedCount,
			totalToolbars: toolbars.length
		};
	}
	function setupNetworkListeners() {
		// 监听网络请求，当检测到 drafts 请求时立即尝试注入
		if (typeof window.fetch !== 'undefined') {
			const originalFetch = window.fetch;
			window.fetch = function(...args) {
				const url = args[0];
				// 检测是否是 drafts 或编辑器相关请求
				if (typeof url === 'string' && (url.includes('/drafts/') || url.includes('/posts/') || url.includes('/t/'))) {
					console.log('[Emoji Extension] Detected editor-related request:', url);
					// 延迟100ms后尝试注入，确保DOM已更新
					setTimeout(() => {
						attemptInjection();
					}, 100);
				}
				return originalFetch.apply(this, args);
			};
			console.log('[Emoji Extension] Network request listener installed');
		}

		// 监听 XMLHttpRequest
		if (typeof window.XMLHttpRequest !== 'undefined') {
			const originalOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function(method, url, ...rest) {
				if (typeof url === 'string' && (url.includes('/drafts/') || url.includes('/posts/') || url.includes('/t/'))) {
					console.log('[Emoji Extension] Detected XHR editor-related request:', url);
					this.addEventListener('load', function() {
						setTimeout(() => {
							attemptInjection();
						}, 100);
					});
				}
				return originalOpen.apply(this, [method, url, ...rest]);
			};
			console.log('[Emoji Extension] XMLHttpRequest listener installed');
		}
	}
	function registerTampermonkeyMenu() {
		if (typeof GM_registerMenuCommand !== 'undefined') {
			GM_registerMenuCommand('🔄 手动刷新按钮', () => {
				console.log('[Emoji Extension] Manual refresh triggered');
				const result = attemptInjection();
				if (result.injectedCount > 0) {
					userscriptNotify(`✅ 成功添加 ${result.injectedCount} 个按钮`, 'success');
				} else if (result.totalToolbars > 0) {
					userscriptNotify('ℹ️ 按钮已存在，无需重复添加', 'info');
				} else {
					userscriptNotify('❌ 未找到编辑器工具栏', 'error');
				}
			});
			console.log('[Emoji Extension] Tampermonkey menu registered');
		}
	}
	init_createEl();
	function userscriptNotify(message, type = "info", timeout = 4e3) {
		try {
			let container = document.getElementById("emoji-ext-userscript-toast");
			if (!container) {
				container = createEl("div", {
					attrs: {
						id: "emoji-ext-userscript-toast",
						"aria-live": "polite"
					},
					style: `
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 2147483646;
        display:flex;
        flex-direction:column;
        gap:8px;
        `
				});
				try {
					if (document.body) document.body.appendChild(container);
					else document.documentElement.appendChild(container);
				} catch (e) {
					document.documentElement.appendChild(container);
				}
				container.style.position = "fixed";
				container.style.right = "12px";
				container.style.bottom = "12px";
				container.style.zIndex = String(2147483646);
				try {
					container.style.setProperty("z-index", String(2147483646), "important");
				} catch (_e) {}
				container.style.display = "flex";
				container.style.flexDirection = "column";
				container.style.gap = "8px";
				container.style.pointerEvents = "auto";
			}
			const el = createEl("div", {
				text: message,
				style: `padding:8px 12px; border-radius:6px; color:#fff; font-size:13px; max-width:320px; word-break:break-word; opacity:0; transform: translateY(8px); transition: all 220ms ease;`
			});
			if (type === "success") el.style.setProperty("background", "#16a34a", "important");
			else if (type === "error") el.style.setProperty("background", "#dc2626", "important");
			else el.style.setProperty("background", "#0369a1", "important");
			container.appendChild(el);
			el.offsetHeight;
			el.style.opacity = "1";
			el.style.transform = "translateY(0)";
			const id = setTimeout(() => {
				try {
					el.style.opacity = "0";
					el.style.transform = "translateY(8px)";
					setTimeout(() => el.remove(), 250);
				} catch (_e) {}
				clearTimeout(id);
			}, timeout);
			try {
				console.log("[UserscriptNotify] shown:", message, "type=", type);
			} catch (_e) {}
			return () => {
				try {
					el.remove();
				} catch (_e) {}
				clearTimeout(id);
			};
		} catch (_e) {
			return () => {};
		}
	}
	init_createEl();
	init_themeSupport();
	init_injectStyles();
	// 浮动按钮功能已删除
	async function invokeAutoRead(showNotify = false) {
		try {
			const fn = window.callAutoReadRepliesV2 || window.autoReadAllRepliesV2;
			console.log("[Emoji Extension] invokeAutoRead: found fn=", !!fn, " typeof=", typeof fn, " showNotify=", showNotify);
			if (fn && typeof fn === "function") {
				const res = await fn();
				console.log("[Emoji Extension] invokeAutoRead: fn returned", res);
				if (showNotify) userscriptNotify("自动阅读已触发", "success");
			} else {
				console.warn("[Emoji Extension] autoRead function not available on window");
				console.log("[Emoji Extension] invokeAutoRead: attempting userscriptNotify fallback");
				userscriptNotify("自动阅读功能当前不可用", "error");
			}
		} catch (err) {
			console.error("[Emoji Extension] auto-read menu invocation failed", err);
			if (showNotify) userscriptNotify("自动阅读调用失败: " + (err && err.message ? err.message : String(err)), "error");
		}
	}
	function createAutoReadMenuItem(variant = "dropdown") {
		if (variant === "dropdown") {
			const li$1 = createEl("li", { className: "submenu-item emoji-extension-auto-read" });
			const a = createEl("a", {
				className: "submenu-link",
				attrs: {
					href: "#",
					title: "像插件一样自动阅读话题 (Auto-read topics)"
				},
				innerHTML: `
      <svg class="fa d-icon d-icon-book svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#book"></use></svg>
      自动阅读
    `
			});
			a.addEventListener("click", async (e) => {
				e.preventDefault();
				e.stopPropagation();
				await invokeAutoRead(true);
			});
			li$1.appendChild(a);
			return li$1;
		}
		const li = createEl("li", {
			className: "submenu-item emoji-extension-auto-read sidebar-section-link-wrapper",
			style: "list-style: none; padding-left: 0;"
		});
		const btn = createEl("button", {
			className: "fk-d-menu__trigger sidebar-more-section-trigger sidebar-section-link sidebar-more-section-links-details-summary sidebar-row --link-button sidebar-section-link sidebar-row",
			attrs: {
				type: "button",
				title: "像插件一样自动阅读话题 (Auto-read topics)",
				"aria-expanded": "false",
				"data-identifier": "emoji-ext-auto-read",
				"data-trigger": ""
			},
			innerHTML: `
      <span class="sidebar-section-link-prefix icon">
        <svg class="fa d-icon d-icon-book svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#book"></use></svg>
      </span>
      <span class="sidebar-section-link-content-text">自动阅读</span>
    `,
			style: `
    background: transparent;
    border: none;
    `
		});
		btn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await invokeAutoRead(true);
		});
		li.appendChild(btn);
		return li;
	}
	// showFloatingButton, hideFloatingButton, checkAndShowFloatingButton 等函数已删除
	async function injectIntoUserMenu() {
		const SELECTOR_SIDEBAR = "#sidebar-section-content-community";
		const SELECTOR_OTHER_ANCHOR = "a.menu-item[title=\"其他服务\"], a.menu-item.vdm[title=\"其他服务\"]";
		const SELECTOR_OTHER_DROPDOWN = ".d-header-dropdown .d-dropdown-menu";
		for (;;) {
			const otherAnchor = document.querySelector(SELECTOR_OTHER_ANCHOR);
			if (otherAnchor) {
				const dropdown = otherAnchor.querySelector(SELECTOR_OTHER_DROPDOWN);
				if (dropdown) {
					dropdown.appendChild(createAutoReadMenuItem("dropdown"));
					console.log("[Emoji Extension Userscript] Auto-read injected into 其他服务 dropdown");
					return;
				}
			}
			const sidebar = document.querySelector(SELECTOR_SIDEBAR);
			if (sidebar) {
				sidebar.appendChild(createAutoReadMenuItem("sidebar"));
				console.log("[Emoji Extension Userscript] Auto-read injected into sidebar #sidebar-section-content-community");
				return;
			}
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}
	async function showAutoReadInMenu() {
		injectGlobalThemeStyles();
		try {
			await injectIntoUserMenu();
			return;
		} catch (e) {
			console.warn("[Emoji Extension Userscript] injecting menu item failed", e);
		}
	}
	// hideFloatingButton, autoShowFloatingButton, checkAndShowFloatingButton 函数已删除
	init_userscript_storage();
	init_state();
	async function initializeUserscriptData() {
		const data = await loadDataFromLocalStorageAsync().catch((err) => {
			console.warn("[Userscript] loadDataFromLocalStorageAsync failed, falling back to sync loader", err);
			return loadDataFromLocalStorage();
		});
		userscriptState.emojiGroups = data.emojiGroups || [];
		userscriptState.settings = data.settings || userscriptState.settings;
	}
	function isDiscoursePage() {
		if (document.querySelectorAll("meta[name*=\"discourse\"], meta[content*=\"discourse\"], meta[property*=\"discourse\"]").length > 0) {
			console.log("[Emoji Extension Userscript] Discourse detected via meta tags");
			return true;
		}
		const generatorMeta = document.querySelector("meta[name=\"generator\"]");
		if (generatorMeta) {
			if ((generatorMeta.getAttribute("content")?.toLowerCase() || "").includes("discourse")) {
				console.log("[Emoji Extension Userscript] Discourse detected via generator meta");
				return true;
			}
		}
		if (document.querySelectorAll("#main-outlet, .ember-application, textarea.d-editor-input, .ProseMirror.d-editor-input").length > 0) {
			console.log("[Emoji Extension Userscript] Discourse elements detected");
			return true;
		}
		console.log("[Emoji Extension Userscript] Not a Discourse site");
		return false;
	}
	async function initializeEmojiFeature(maxAttempts = 10, delay = 1e3) {
		console.log("[Emoji Extension Userscript] Initializing...");
		logPlatformInfo();
		await initializeUserscriptData();
		initOneClickAdd();
		try {
			if (userscriptState.settings?.enableCalloutSuggestions !== false) {
				initCalloutSuggestionsUserscript();
				console.log("[Userscript] Callout suggestions enabled");
			} else console.log("[Userscript] Callout suggestions disabled by user setting");
		} catch (e) {
			console.warn("[Userscript] initCalloutSuggestionsUserscript failed", e);
		}
		try {
			showAutoReadInMenu();
		} catch (e) {
			console.warn("[Userscript] showAutoReadInMenu failed", e);
		}
		function exposeAutoReadWrapper() {
			try {
				const existing = window.autoReadAllRepliesV2;
				if (existing && typeof existing === "function") {
					window.callAutoReadRepliesV2 = (topicId) => {
						try {
							return existing(topicId);
						} catch (e) {
							console.warn("[Userscript] callAutoReadRepliesV2 invocation failed", e);
						}
					};
					console.log("[Userscript] callAutoReadRepliesV2 is exposed");
					return;
				}
				window.callAutoReadRepliesV2 = (topicId) => {
					try {
						const fn = window.autoReadAllRepliesV2;
						if (fn && typeof fn === "function") return fn(topicId);
					} catch (e) {
						console.warn("[Userscript] callAutoReadRepliesV2 invocation failed", e);
					}
					console.warn("[Userscript] autoReadAllRepliesV2 not available on this page yet");
				};
			} catch (e) {
				console.warn("[Userscript] exposeAutoReadWrapper failed", e);
			}
		}
		exposeAutoReadWrapper();
		let attempts = 0;
		function attemptToolbarInjection() {
			attempts++;
			const result = attemptInjection();
			if (result.injectedCount > 0 || result.totalToolbars > 0) {
				console.log(`[Emoji Extension Userscript] Injection successful: ${result.injectedCount} buttons injected into ${result.totalToolbars} toolbars`);
				return;
			}
			if (attempts < maxAttempts) {
				console.log(`[Emoji Extension Userscript] Toolbar not found, attempt ${attempts}/${maxAttempts}. Retrying in ${delay / 1e3}s.`);
				setTimeout(attemptToolbarInjection, delay);
			} else {
				console.error("[Emoji Extension Userscript] Failed to find toolbar after multiple attempts.");
			}
		}
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attemptToolbarInjection);
		else attemptToolbarInjection();
		setupNetworkListeners();
		registerTampermonkeyMenu();
	}
	if (isDiscoursePage()) {
		console.log("[Emoji Extension Userscript] Discourse detected, initializing emoji feature");
		initializeEmojiFeature();
	} else console.log("[Emoji Extension Userscript] Not a Discourse site, skipping injection");
})();

})();