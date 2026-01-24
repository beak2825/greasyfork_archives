// ==UserScript==
// @name     acfun统计-bugfix
// @description acfun统计。
// @namespace syachiku
// @author       syachiku
// @include        https://www.acfun.cn/member*
// @include        https://www.acfun.cn/v/ac*
// @run-at document-start
// @grant   GM_addStyle
// @grant   GM_xmlhttpRequest
// @grant   GM_getResourceText
// @grant   GM_getResourceURL
// @version  0.1.1.4
// @require https://fastly.jsdelivr.net/npm/qs@6.9.4/dist/qs.min.js
// @require https://fastly.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuidv4.min.js
// @require https://fastly.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @require https://fastly.jsdelivr.net/npm/moment@2.18.1/min/moment.min.js
// @require https://fastly.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require https://fastly.jsdelivr.net/npm/element-ui@2.15.1/lib/index.min.js
// @require https://fastly.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js
// @require https://fastly.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @require https://fastly.jsdelivr.net/npm/exceljs@4.2.1/dist/exceljs.min.js
// @require https://fastly.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require https://fastly.jsdelivr.net/npm/viewerjs@1.9.0/dist/viewer.min.js
// @require https://fastly.jsdelivr.net/npm/nerdamer@1.1.7/nerdamer.core.min.js
// @require https://fastly.jsdelivr.net/npm/keymaster@1.6.2/keymaster.min.js
// @resource elementcss https://fastly.jsdelivr.net/npm/element-ui@2.15.1/lib/theme-chalk/index.css
// @resource element-icons https://fastly.jsdelivr.net/npm/element-ui@2.15.1/lib/theme-chalk/fonts/element-icons.ttf
// @resource viewercss https://fastly.jsdelivr.net/npm/viewerjs@1.9.0/dist/viewer.min.css
// @downloadURL https://update.greasyfork.org/scripts/563792/acfun%E7%BB%9F%E8%AE%A1-bugfix.user.js
// @updateURL https://update.greasyfork.org/scripts/563792/acfun%E7%BB%9F%E8%AE%A1-bugfix.meta.js
// ==/UserScript==


;(async function(){
	Vue.use(ELEMENT);
	Vue.prototype.$message = ELEMENT.Message;

	const config = {
		PARAMS : Qs.parse(window.location.search?window.location.search.slice(1):''),
		ACFUN_SERVER : 'https://www.acfun.cn',
		ACFUN_MOBILE_SERVER : 'https://m.acfun.cn',
		ACFUN_API_SERVER : 'https://api-ipv6.app.acfun.cn',
		ACFUNLIVE_SERVER : 'https://live.acfun.cn',
		ACFUN_TOKEN_SERVER : 'https://id.app.acfun.cn',
		KUAISHOU_SERVER : 'https://kuaishouzt.com',
		ACFUN_GIF_SERVER : 'https://zt.gifshow.com/',
		URLS : {
			ACFUN_USER : {
				MAIN : '/member',
				INFO : '/rest/pc-direct/user/userInfo',
				PUSH : '/member/feeds',
				SPACE : '/u',
				FEED : '/rest/app/feed/followFeedV2',
				IS_BLOCKED : '/rest/app/user/block/isBlock',
				FEED_PROFILE : '/rest/app/feed/profile',
				WEB_PUSH : '/rest/pc-direct/feed/webPush',
			},
			WALLET : {
				SEND_GIFT : '/rest/apph5-direct/pay/reward/giveRecords',
				RECEIVE_GIFT : '/rest/apph5-direct/pay/reward/receiveRecords',
			},
			TOKEN : {
				GET_TOKEN : '/rest/web/token/get',
			},
			INTERACT : {
				ADD : '/rest/zt/interact/add',
				DELETE : '/rest/zt/interact/delete',
				COLLECT : '/rest/app/favorite',
				UNCOLLECT : '/rest/app/unFavorite',
				THROW_BANANA : '/rest/app/banana/throwBanana',
			},
			GIF : {
				LIST : '/rest/zt/emoticon/package/list',
			},
			GIFT : {
				LIST : '/rest/zt/live/gift/all',
			},
			RESOURCE : {
				COMMENT : '/rest/app/comment/list',
				SUB_COMMENT : '/rest/app/comment/sublist',
			},
		},

		HEADERS : {
			ACFUN_API_SERVER : {
				acPlatform : 'ANDROID_PHONE',
				appVersion : '6.43.0.513',
			},
			KUAISHOU_SERVER : {
				cookie : document.cookie,
				origin : 'https://www.acfun.cn',
				referer: 'https://www.acfun.cn/',
			},
		},

		UBB : {
			PATTERN : {
				AT : /\[at\s+uid=(?<uid>\d+)\]\@(?<userName>.+?)\[\/at\]/g,
				IMG : /\[img=(?<title>.+?)\](?<url>.+?)\[\/img\]/g,
				EMOT : /\[emot=[0-9a-zA-Z]*,(?<id>[0-9a-zA-Z]+?)\/\]/g,
			},
		},

		VERIFIED_TYPE : {
			MONKEY : 1,
			OFFICIAL : 2,
			AVI : 3,
			UP_COLLEGE : 5,
		},

		KUAISHOU : {
			SID : 'acfun.midground.api',
			KPN : 'ACFUN_APP',
			KPF : 'PC_WEB',
			SUBBIZ : 'mainApp',
		},

		PAGE : {
			PAGESIZE : 20,
		},

		VUP : [13722552, 23682490, 2869300, 243278, 37693149, 36115445, 4209327, 41230276, 265135, 40909488, 38085972, 34195163, 36782183, 20680343, 34154121, 36544712, 37934837, 2494933, 638405, 32098395, 36694691, 35948175, 36424299, 36526321, 37901408, 12656144, 4425861, 1425669, 13707663, 41107216, 7005405, 35863426, 38330313, 13877450, 39628089, 472630, 41254970, 12703493, 13971213, 35119946, 14449482, 40837172, 13973820, 41062897, 26090924, 23118761, 8125299, 2531957, 39953383, 34611213, 2947895, 35764170, 17777390, 369511, 17380058, 421952, 64441, 37662640, 36117178, 2321079, 797929, 41531703, 33060288, 34934622, 445338, 14500422, 40685184, 279106, 41086322, 34288617, 40056188, 14136064, 30064507, 179922, 38415057, 29652543, 40656720, 1236468, 11143550, 36853070, 605382, 20806699, 33873163, 13942878, 1005951, 31827419, 32844838, 32448048, 34743261, 824281, 33747640, 30344247, 33133627, 17511164, 16559892, 281592, 8500263, 922344, 30352828, 156843, 38393515, 36782454, 32018526, 36665878, 33523936, 40533362, 23738302, 13706346, 35847915, 33356650, 12696349, 5981678, 4427057, 426155, 37181305, 42012804, 34235815, 41955085, 33551100, 13715631, 173620, 26922112, 13945614, 26055450, 3568347, 34905158, 2501, 40740702, 34878269, 13847612, 34968669, 957980, 41581859, 32441412, 6144047, 8864786, 207893, 31967179, 12152626, 16817638, 3473754, 36846901, 712387, 39854908, 17912421, 12891327, 17943098, 1308727, 6851521, 1600171, 34015103, 34785904, 18284887, 36429189, 41161644, 32095190, 4770973, 38651218, 36493618, 138810, 32483115, 36419533, 34878375, 12061153, 251750, 34210520, 13783338, 34412780, 35979929, 39880948, 13747109, 1744181, 13146389, 38068231, 13617066, 40822239, 34195269, 652096, 34267306, 35213225, 31541670, 261980, 23638807, 67073, 3206664, 42094122, 41086280, 42281494, 20543116, 36626547, 316003, 6011113, 17601567, 41086366, 34261972, 16203556, 26035486, 26675034, 14129090, 19469544, 6125244, 880716, 14073450, 32619650, 13288440, 23737978, 37540450, 5938017, 9378772, 32812696, 10644252, 19751874, 36624899, 35422484, 32461770, 33836710, 33937905, 25846636, 39289326, 37296847, 39876394, 35980635, 10062768, 1045560, 31834850, 33366289, 16300936, 35146763, 33070412, 31930322, 3156144, 31798936, 35924649, 32917077, 41529501, 14168480, 29945722, 337056, 32706742, 335814, 17136328, 13846646, 6114412, 21654061, 13747679, 23984515, 23984768, 32565979, 35889531, 31425941, 32505631, 36571875, 23984366, 4240095, 462905, 869660, 30749208, 1323824, 33531528, 12972680, 21626450, 38109076, 19302348, 36625184, 1963847, 10406618, 39373823, 37522724, 34144920, 32623529, 1851701, 28626748, 34035144, 42413523, 41420265, 36171544, 42551921, 10028588, 42692747, 33023277, 40065559, 12048958, 40450694, 44026597, 36936805, 42707250, 42703582, 44753354, 12645128, 6092018, 43250076, 42863321, 42910834, 21616835, 4623706, 44672969, 41077579, 28741368, 25956307, 7822884, 43663910],

	};

	// 是否为空
	function isNullOrEmpty(val){
		return _.isUndefined(val) || _.isNull(val) || _.isNaN(val) || (((_.isObject(val) && !_.isDate(val)) || _.isArray(val) || _.isString(val)) && _.isEmpty(val))
	}

	function matchAll(text, pattern){
		var result = [];
		for(var match of text.matchAll(pattern)){

			result.push({
				text : match[0],
				groups : match.groups,
			});
		}

		return result;
	}


	// 通用请求
	function commonRequrest(url, method, form, raw, callback, headers){
		var isSuccess = false;
		var data = null;
		if(!headers){
			headers = {};
		}

		if(method == 'post'){

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			if(form){
				form = Qs.stringify(form);
			}

		}


		if(method == 'get' && form){
			form = Qs.stringify(form);
			url += '?' + form;
			form = undefined;
		}

		// 获取了token
		if(config.TOKEN){
			headers['Authorization'] = `Token ${config.TOKEN}`;
		}

		GM_xmlhttpRequest({
			synchronous : !_.isFunction(callback),
			method : method.toUpperCase(),
			url : url,
			data : form,
			headers : _.clone(headers),
			onload : function(res){
				// 200
				if(res.status==200){
					if(raw){
						callback(true, res.responseText);
					}
					else{
						res = JSON.parse(res.responseText);
						isSuccess = res[config.RESPONSE.FIELD.STATUS] == config.RESPONSE.STATUS.SUCCESS;
						data = res[config.RESPONSE.FIELD.DATA];

						if(_.isFunction(callback)){
							callback(isSuccess, data);
						}
					}
				}
				else{
					if(_.isFunction(callback)){
						callback(isSuccess, data);
					}
				}
			},
			onerror : function(){
				if(_.isFunction(callback)){
					callback(isSuccess, data);
				}
			},
			onabort : function(){
				if(_.isFunction(callback)){
					callback(isSuccess, data);
				}
			},
		});

		return [isSuccess, data];
	}

	var cssResourceRequested = [];

	async function addResource(type, name){

		if(cssResourceRequested.indexOf(name)!=-1){
			return;
		}

		cssResourceRequested.push(name);
		if(type == 'css'){
			var content = await GM_getResourceText(name);
			if(content){
				GM_addStyle(content);
			}
		}
		else if(type == 'font'){
			var content = await GM_getResourceURL(name);
			if(content){
				content = content.replace('data:application;base64,', '');
				GM_addStyle(`
					@font-face{
						font-family:${name};
						src:url(data:font/truetype;charset=utf-8;base64,${content})format('truetype');
					}
				`);
			}
		}
	}

	var statVue = null;

	// 加载统计页面Vue实例
	function loadStatVue(){


 		// 若vue已实例化，且对应的el元素存在，则表示已加载结束
		if(statVue && document.querySelector('#acfunstat-container')){
			return true;
		}

		// 容器
		var navEle = document.querySelector('.ac-member-navigation');

 		// 容器不存在
		if(!navEle){
			return false;
		}

		// 添加导航选项
		var navItem = document.createElement('a');
		navItem.classList.add('ac-member-navigation-item');
		navItem.innerHTML = `
			<span class="ac-icon"><i class="iconfont">&#xe3ca;</i></span>统计
		`;

		// 监听点击事件
		navItem.addEventListener('click', function(e){
 			e.stopPropatation = true;

	 		// 若vue已实例化，且对应的el元素存在，则表示已加载结束
			if(statVue && !document.querySelector('#acfunstat-container')){
				return;
			}

			// 删除其它菜单项的active类
			var activeNavItem = navEle.querySelector('.router-link-exact-active');
			activeNavItem.classList.remove('router-link-exact-active');
			activeNavItem.classList.remove('ac-member-navigation-item-active');
			// 添加active类
			navItem.classList.add('router-link-exact-active');
			navItem.classList.add('ac-member-navigation-item-active');

			// 添加element-ui样式
			addResource('css', 'elementcss');
			addResource('font', 'element-icons');

			// 修改展示内容
			document.querySelector('.ac-member-main').innerHTML = `
				<style>

					#acfunstat-container .tools-container{
						text-align : right;
					}

					#acfunstat-container .tools-container span{
						width: 150px;
						display : inline-block;
						text-align : center;
						height : 28px;
						line-height : 28px;
						padding: 0 6px;
						background: #fff;
						border-radius: 5px;
						font-family: PingFangSC,PingFangSC-Regular;
						font-weight: 400;
						border: 1px solid #98df58;
						color: #98df58;
					}

					#acfunstat-container .block{
						border-bottom: 1px solid #f5f5f5;
						padding : 20px 0;
						font-size: 14px;
						font-family: PingFangSC,PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color : #333;
					}

					#acfunstat-container .block h2{
						font-size: 18px;
						font-weight: 500;
						text-align: left;
						color: #333;
						line-height : 26px;
						height : 26px;
					}

					#acfunstat-container .overview-container{
						margin-top : 20px;
					}
					#acfunstat-container .overview-container .overview-value{
						margin-left : 10px;
						color : #fd4c5d;
					}

					#acfunstat-container .gift-trend-filter-form{
						text-align : right;
					}


					#acfunstat-container .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar{
						width: 10px;
						height: 1px;
					}
					#acfunstat-container .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb {
						border-radius: 10px;
						-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
						background: #535353;
					}
					#acfunstat-container .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-track {
						-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
						border-radius: 10px;
						background: #EDEDED;
					}


					#acfunstat-container #gift-trend-container{
						height : 200px;
						width : 100%;
					}

				</style>

				<div id="acfunstat-container" v-cloak>
					<div class="block" v-if="isGettingSendGiftList">
						<div class="mainer">
							<span>正在获取送出礼物记录。已获取{{sendGiftList.length}}条记录</span>
						</div>
					</div>
					<div class="block" v-if="isGettingReceiveGiftList">
						<div class="mainer">
							<span>正在获取收到礼物记录。已获取{{receiveGiftList.length}}条记录</span>
						</div>
					</div>
					<template v-if="hasGetSendGiftList && hasGetReceiveGiftList">
						<div class="block">
							<el-row>
								<el-col :span="12">
									<h2>总体{{filterText}}</h2>
								</el-col>
								<el-col :span="12" class="tools-container">
									<a href="javascript:void(0)" @click="openSettingDialog">
										<span>配置</span>
									</a>
									<a href="javascript:void(0)" @click="exportGift">
										<span>导出excel</span>
									</a>
								</el-col>
							</el-row>
							<el-row class="overview-container">
								<el-col :span="12">
									<span class="overview-title">送出礼物（AC币）</span><span class="overview-value">{{send}}</span>
								</el-col>
								<el-col :span="12">
									<span class="overview-title">收到礼物（钻石）</span><span class="overview-value">{{receive}}</span>
								</el-col>
							</el-row>

						</div>

						<div class="block">
 							<el-row>
								<el-col :span="12">
									<h2>送出礼物用户排行</h2>
									<el-row>
										<el-table :data="sendUserListPage" style="width: 100%" class="user-table" height="414">
											<el-table-column prop="rank" label="排名" type="index" :index="(index)=>tableRankingIndex(index, sendUserListPagination)" min-width="10%">
											</el-table-column>
											<el-table-column prop="userName" label="用户名" min-width="55%">
												<template slot-scope="scope">
													<el-avatar shape="circle" fit="fill" size="40" :src="scope.row.photo"></el-avatar>
													<el-link style="cursor:pointer;" @click="toUserSpace(scope.row)">{{scope.row.userName}}</el-link>
												</template>
											</el-table-column>
											<el-table-column prop="uid" label="用户uid" min-width="20%">
											</el-table-column>
											<el-table-column prop="send" label="AC币" min-width="15%">
											</el-table-column>

										</el-table>
										<el-pagination
											:current-page.sync="sendUserListPagination.page"
											layout="total, prev, pager, next"
											:total="sendUserListPagination.total"
											:page-size="sendUserListPagination.pageSize"
										>
										</el-pagination>
									</el-row>
								</el-col>
							</el-row>
						</div>

						<div class="block">
 							<el-row :gutter="20">
								<el-col :span="12">
									<h2>桃榜</h2>
									<el-row>
										<el-table :data="peachUserRankListPage" style="width: 100%" class="user-table" height="414">
											<el-table-column prop="rank" label="排名" type="index" :index="(index)=>tableRankingIndex(index, peachUserRankListPagination)" min-width="10%">
											</el-table-column>
											<el-table-column prop="userName" label="用户名" min-width="55%">
												<template slot-scope="scope">
													<el-avatar shape="circle" fit="fill" size="40" :src="scope.row.photo"></el-avatar>
													<el-link style="cursor:pointer;" @click="toUserSpace(scope.row)">{{scope.row.userName}}</el-link>
												</template>
											</el-table-column>
											<el-table-column prop="uid" label="用户uid" min-width="20%">
											</el-table-column>
											<el-table-column prop="receivePeach" label="桃" min-width="15%">
											</el-table-column>

										</el-table>
										<el-pagination
											:current-page.sync="peachUserRankListPagination.page"
											layout="total, prev, pager, next"
											:total="peachUserRankListPagination.total"
											:page-size="peachUserRankListPagination.pageSize"
										>
										</el-pagination>
									</el-row>
								</el-col>
								<el-col :span="12">
									<h2>贡献榜</h2>
									<el-row>
										<el-table :data="giftUserRankListPage" style="width: 100%" class="user-table" height="414">
											<el-table-column prop="rank" label="排名" type="index" :index="(index)=>tableRankingIndex(index, giftUserRankListPagination)" min-width="10%">
											</el-table-column>
											<el-table-column prop="userName" label="用户名" min-width="55%">
												<template slot-scope="scope">
													<el-avatar shape="circle" fit="fill" size="40" :src="scope.row.photo"></el-avatar>
													<el-link style="cursor:pointer;" @click="toUserSpace(scope.row)">{{scope.row.userName}}</el-link>
												</template>
											</el-table-column>
											<el-table-column prop="uid" label="用户uid" min-width="20%">
											</el-table-column>
											<el-table-column prop="receiveAcoin" label="AC币" min-width="15%">
											</el-table-column>

										</el-table>
										<el-pagination
											:current-page.sync="giftUserRankListPagination.page"
											layout="total, prev, pager, next"
											:total="giftUserRankListPagination.total"
											:page-size="giftUserRankListPagination.pageSize"
										>
										</el-pagination>
									</el-row>
								</el-col>
							</el-row>
						</div>

						<div class="block">
 							<el-row>
 								<el-col :span="8">
 									<h2>{{switchToSendGiftTrend?'送出礼物趋势':'收到礼物趋势'}}</h2>
 								</el-col>
 								<el-col :span="16">
 									<el-form :inline="true" :model="giftTrendFormData" size="mini" class="gift-trend-filter-form">
										<el-form-item>
											<el-select v-model="giftTrendFormData.unit" style="width:100px;">
												<el-option label="按天展示" value="day" key="day"></el-option>
												<el-option label="按周展示" value="week" key="week"></el-option>
												<el-option label="按月展示" value="month" key="month"></el-option>
												<el-option label="按年展示" value="year" key="year"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item v-if="switchToSendGiftTrend">
											<el-select v-model="giftTrendFormData.uid" filterable placeholder="用户筛选">
												<el-option label="不筛选" value=""></el-option>
												<el-option :label="userInfo.userName" :value="userInfo.uid" :key="userInfo.uid" v-for="userInfo in sendUserList"></el-option>
											</el-select>
										</el-form-item>
										<el-form-item v-else>
											<el-select v-model="giftTrendFormData.uid" filterable placeholder="用户筛选">
												<el-option label="不筛选" value=""></el-option>
												<el-option :label="userInfo.userName" :value="userInfo.uid" :key="userInfo.uid" v-for="userInfo in receiveUserList"/>
											</el-select>
										</el-form-item>
										<el-form-item class="tools-container">
											<a href="javascript:void(0)" @click="handleSwitchToSendGiftTrend">
												<span>{{switchToSendGiftTrend?'切换至收到礼物趋势':'切换至送出礼物趋势'}}</span>
											</a>
										</el-form-item>
									</el-form>
 								</el-col>
 							</el-row>
 							<el-row>
 								<div id="gift-trend-container">
								</div>
 							</el-row>
 						</div>
 					</template>


					<el-drawer :title="switchToSendGiftTrend?'送出礼物详情':'收到礼物详情'" :visible.sync="showGiftDetail" direction="ltr" :modal="false" :size="700">
						<div v-if="switchToSendGiftTrend">
							<div id="send-gift-table">
								<el-table :data="giftDetailListPage" style="width: 100%" class="user-table" height="450">
									<el-table-column prop="userName" label="用户名" :width="200">
										<template slot-scope="scope">
											<el-avatar shape="circle" fit="fill" size="40" :src="userInfo[scope.row.userId].photo"></el-avatar>
											<el-link style="cursor:pointer;" @click="toUserSpace(userInfo[scope.row.userId])">{{userInfo[scope.row.userId].userName}}</el-link>
										</template>
									</el-table-column>
									<el-table-column prop="userId" label="用户uid" :width="100">
									</el-table-column>
									<el-table-column prop="createTimeText" label="送出时间" :width="180">
									</el-table-column>
									<el-table-column prop="giftText" label="送出礼物" :width="100">
									</el-table-column>
									<el-table-column prop="acoin" label="AC币" :width="70">
									</el-table-column>

								</el-table>
								<el-pagination
									:current-page.sync="giftDetailListPagination.page"
									layout="total, prev, pager, next"
									:total="giftDetailListPagination.total"
									:page-size="giftDetailListPagination.pageSize"
								>
								</el-pagination>
							</div>
						</div>
						<div v-else>
							<div id="receive-gift-table">
								<el-table :data="giftDetailListPage" style="width: 100%" class="user-table" height="558">
									<el-table-column prop="userName" label="用户名" width="200">
										<template slot-scope="scope">
											<el-avatar shape="circle" fit="fill" size="40" :src="userInfo[scope.row.userId].photo"></el-avatar>
											<el-link style="cursor:pointer;" @click="toUserSpace(userInfo[scope.row.userId])">{{userInfo[scope.row.userId].userName}}</el-link>
										</template>
									</el-table-column>
									<el-table-column prop="userId" label="用户uid" width="100">
									</el-table-column>
									<el-table-column prop="createTimeText" label="收到时间" width="180">
									</el-table-column>
									<el-table-column prop="giftText" label="收到礼物" width="100">
									</el-table-column>
									<el-table-column prop="azuanAmount" label="钻石" width="70">
									</el-table-column>

								</el-table>
								<el-pagination
									:current-page.sync="giftDetailListPagination.page"
									layout="total, prev, pager, next"
									:total="giftDetailListPagination.total"
									:page-size="giftDetailListPagination.pageSize"
								>
								</el-pagination>
							</div>
						</div>

					</el-drawer>

					<el-dialog title="设置" :visible.sync="settingFormDialogVisible" :modal="false" width="550px" custom-class="setting-form-dialog" :modal-append-to-body="false">
						<el-form :model="settingFormData" class="setting-form" ref="settingForm" :rules="settingFormRules" @submit.native.prevent>

							<el-form-item label="时间范围" label-width="130px" prop="dateRegion">
								<el-date-picker
									v-model="settingFormData.dateRegion"
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									:picker-options="settingFormPickerOptions"
									style="width:100%"
								>
								</el-date-picker>
							</el-form-item>
							<el-form-item style="display:flex;justify-content:center;">
								<el-button type="primary" @click="handleSettingFormSubmit">提交</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</div>
			`;



			// 初始化实例
			statVue = new Vue({
				el : '#acfunstat-container',
				data : function(){

					return {

						send : 0,
						receive : 0,
						sendGiftList : [],
						receiveGiftList : [],
						giftDetailList : [],
						showGiftDetail : false,
						showGiftTrend : true,

						sendUserList : [],
						receiveUserList : [],
						peachUserRankList : [],
						giftUserRankList : [],
						userInfo : {},

						sendUserListPagination : {
							page : 1,
							total : 0,
							pageSize : 5,
						},
						peachUserRankListPagination : {
							page : 1,
							total : 0,
							pageSize : 5,
						},
						giftUserRankListPagination : {
							page : 1,
							total : 0,
							pageSize : 5,
						},
						giftDetailListPagination : {
							page : 1,
							total : 0,
							pageSize : 5,
						},
						isGettingSendGiftList : false,
						isGettingReceiveGiftList : false,

						hasGetReceiveGiftList : false,
						hasGetSendGiftList : false,

						filterText : '',


						settingFormDialogVisible : false,
						settingFormData : {
							isContainPeach : true,
						},
						settingFormRules : {

						},
						settingFormPickerOptions : {
							shortcuts : [{
								text : '本周',
								onClick(picker) {
									const end = moment().endOf('week').add(1, 'days')._d;
									const start = moment().startOf('week').add(1, 'days')._d;
									picker.$emit('pick', [start, end]);
								},
							},{
								text : '上周',
								onClick(picker) {
									const end = moment().subtract(1, 'weeks').endOf('week').add(1, 'days')._d;
									const start = moment().subtract(1, 'weeks').startOf('week').add(1, 'days')._d;
									picker.$emit('pick', [start, end]);
								},
							},{
								text : '本月',
								onClick(picker) {
									const end = moment().endOf('month')._d;
									const start = moment().startOf('month')._d;
									picker.$emit('pick', [start, end]);
								},
							},{
								text : '上月',
								onClick(picker) {
									const end = moment().subtract(1, 'months').endOf('month')._d;
									const start = moment().subtract(1, 'months').startOf('month')._d;
									picker.$emit('pick', [start, end]);
								},
							},]
						},

						switchToSendGiftList : true,
						switchToSendGiftTrend : true,

						giftTrendFormData : {
							unit : 'day',
						},
						giftList : [],
						giftNameMapper : {},

						// 是否已初始化趋势图
						initGiftTrendFinish : false,
						renderGiftTrendChartObj : null,
						renderGiftTrendData : null,

					};
				},
				methods : {
					tableRankingIndex : function(index, pagination){
						return (pagination.page-1) * pagination.pageSize + index + 1;
					},
					getUserInfo : function(uid, userName, callback){

						var vue = this;
						if(uid in this.userInfo){
							if(_.isFunction(callback)){
								callback(true, this.userInfo[uid]);
							}
							return;
						}

						// 获取用户信息
						commonRequrest(config.ACFUNLIVE_SERVER + config.URLS.ACFUN_USER.INFO + `?userId=${uid}`, 'get', null, true, function(isSuccess, data){

							var userInfo = null;
							if(data){
								data = JSON.parse(data);
								if(data.result == 0){
									userInfo = {
										uid : uid,
										photo : data.profile.headUrl,
										userName : data.profile.name,
									};


								}
								else{
									userInfo = {
										uid : uid,
										userName : userName,
										photo : 'https://tx-free-imgs.acfun.cn/style/image/defaultAvatar.jpg',
									};
								}
							}
							else{
								userInfo = {
									uid : uid,
									userName : userName,
									photo : 'https://tx-free-imgs.acfun.cn/style/image/defaultAvatar.jpg',
								};
							}

							vue.userInfo[uid] = userInfo;
							if(_.isFunction(callback)){
								callback(isSuccess, userInfo);
							}

						});
					},
					getToken : function(callback){

						var vue = this;

						// 已有token
						if(this.token){
							callback(true, this.token);
						}
						else{
							// 获取token
							commonRequrest(config.ACFUN_TOKEN_SERVER + config.URLS.TOKEN.GET_TOKEN, 'post', {sid:config.KUAISHOU.SID}, true, function(isSuccess, data){

 								// 获取成功
 								if(isSuccess){
 									data = JSON.parse(data);
 									if(data['acfun.midground.api_st']){
 										vue.token = data['acfun.midground.api_st'];
 										callback(true, vue.token);
 									}
 									else{
 										callback(false);
 									}

 								}
 								else{
									callback(false);
 								}

							}, config.HEADERS.KUAISHOU_SERVER);
						}

					},
					getGiftList : function(callback){

						var vue = this;

						this.getToken(function(isSuccess, token){

							// 获取token失败
							if(!isSuccess){
								vue.$message({
									type : 'error',
									message : 'token获取失败',
								});
								callback(false);
							}
							else{

								var params = {
									'acfun.midground.api_st' : token,
									subBiz: config.KUAISHOU.SUBBIZ,
									kpn: config.KUAISHOU.KPN,
									kpf: config.KUAISHOU.KPF,
								};

								// 提交
								commonRequrest(config.KUAISHOU_SERVER + config.URLS.GIFT.LIST, 'post', params, true, function(isSuccess, data){
	 								// 获取成功
	 								if(isSuccess){
	 									data = JSON.parse(data);
	 									if(data.result == 1 && data.data && data.data.giftList){
	 										var giftList = [];
	 										var giftNameMapper = [];

	 										data.data.giftList.forEach(function(item){
	 											if(item.payWalletType != 1){
	 												return true;
	 											}
	 											var gift = {
	 												id : item.giftId,
	 												name : item.giftName,
	 												price : item.giftPrice,
	 												url : item.pngPicList[0].url,
	 											};

	 											giftList.push(gift);
	 											giftNameMapper[gift.name] = gift;

	 										});

	 										vue.giftList = giftList;
	 										vue.giftNameMapper = giftNameMapper;

	 										callback(true);

	 									}
	 									else{
	 										callback(false);
	 									}

	 								}
	 								else{
										callback(false);
	 								}

								});

							}

						});

					},
					getSendGiftList : function(callback){

						var vue = this;
						var startDate = null,endDate=null;
						var isContainPeach = this.settingFormData.isContainPeach;
						// 筛选了时间范围
						if(this.settingFormData.dateRegion && this.settingFormData.dateRegion.length==2){

							startDate = this.settingFormData.dateRegion[0].getTime();
							endDate = this.settingFormData.dateRegion[1].getTime();

						}

						// 获取数据时的游标
						var pcursor = "0";

						var getSendGiftList = function(){
							vue.isGettingSendGiftList = true;

							if(pcursor == 'no_more'){

								// 统计送出礼物总ac币
								vue.send = _.sumBy(_.flatMap(vue.userInfo), 'send');
								vue.send = vue.send?vue.send:0;

								// 讲用户按送出ac币价值倒序
								vue.sendUserList = _.sortBy(_.filter(vue.userInfo, (userInfo)=>{return userInfo.send>0;}), function(userInfo){
									return -userInfo.send;
								});

								vue.sendUserListPagination.total = vue.sendUserList.length;

								vue.isGettingSendGiftList = false;
								vue.hasGetSendGiftList = true;


								if(_.isFunction(callback)){
									callback();
								}

								return;
							}
							else{
								commonRequrest(config.ACFUN_MOBILE_SERVER + config.URLS.WALLET.SEND_GIFT, 'get',{pcursor : pcursor,},true,
									function(isSuccess, data){


										// 获取数据失败
										if(!isSuccess){
											vue.$message({
												type : 'error',
												message : '获取送出礼物列表失败',
											});

											pcursor = 'no_more';
											getSendGiftList();
										}
										else{

											data = JSON.parse(data);
											pcursor = data['pcursor'];

											if(data.records && data.records.length>0){

												var uids = {};
												var uidUserNameMapper = {};
												// 获取用户信息
												data.records.forEach(function(record){

													record.createDate = moment(record.createTime).startOf('day')._d.getTime();

													// 指定了起始时间
													if(startDate && record.createDate<startDate){
														pcursor = "no_more";
														return;
													}
													// 指定了终止时间
													else if(endDate && record.createDate>endDate){
														return;
													}
													// 不包含桃子
													else if(!isContainPeach && record.giftName == '桃子'){
														return;
													}

													if(!(record.userId in uids)){
														uids[record.userId] = [];
													}
													uidUserNameMapper[record.userId] = record.userName;

													var now = moment(record.createTime);

													// 设置送出时间
													record.createTimeText = now.format('YYYY-MM-DD HH:mm:ss');
													record.giftText = `${record.giftCount}个${record.giftName}`;

													// 设置时间单位，便于获取趋势
													record.dayUnitText = now.format('YYYY-MM-DD');
													record.monthUnitText = now.format('YYYY-MM');
													record.yearUnitText = now.format('YYYY');
													record.weekUnitText = now.startOf('week').add(1, 'days').format('YYYY-MM-DD');

													uids[record.userId].push(record);

													vue.sendGiftList.push(record);
												});

												// 没有任何记录
												if(Object.keys(uids).length==0){
													getSendGiftList();
												}
												else{

													var nextGetSendGiftList = _.after(Object.keys(uids).length, getSendGiftList);

													for(var uid in uids){
														vue.getUserInfo(uid, uidUserNameMapper[uid], function(isSuccess, userInfo){


															// 统计送出给用户AC币
															if(userInfo.sendGiftList == null){
																userInfo.sendGiftList = [];
															}
															if(userInfo.send==null){
																userInfo.send = 0;
															}

															userInfo.sendGiftList.splice(userInfo.sendGiftList.length, 0, ...uids[userInfo.uid]);
															userInfo.send += _.sumBy(uids[userInfo.uid], 'acoin');

															nextGetSendGiftList();

														});
													}
												}

											}
											else{
												getSendGiftList();
											}
										}



									},
								);
							}
						}

						getSendGiftList();

					},
					getReceiveGiftList : function(callback){

						var vue = this;
						var startDate = null,endDate=null;
						var isContainPeach = this.settingFormData.isContainPeach;
						// 筛选了时间范围
						if(this.settingFormData.dateRegion && this.settingFormData.dateRegion.length==2){

							startDate = this.settingFormData.dateRegion[0].getTime();
							endDate = this.settingFormData.dateRegion[1].getTime();

						}

						// 获取数据时的游标
						var pcursor = "0";

						var getReceiveGiftList = function(){
							vue.isGettingReceiveGiftList = true;

							if(pcursor == 'no_more'){

								// 统计送出礼物总钻石币
								vue.receive = _.sumBy(_.flatMap(vue.userInfo), 'receive');
								vue.receive = vue.receive?vue.receive:0;

								// 讲用户按送出ac币价值倒序
								vue.receiveUserList = _.sortBy(_.filter(vue.userInfo, (userInfo)=>{return userInfo.receive>0;}), function(userInfo){
									return -userInfo.receive;
								});

								// 桃榜
								vue.peachUserRankList = _.sortBy(_.filter(vue.userInfo, (userInfo)=>{return userInfo.receivePeach>0;}), function(userInfo){
									return -userInfo.receivePeach;
								});
								vue.peachUserRankListPagination.total = vue.peachUserRankList.length;


								// 贡献榜
								vue.giftUserRankList = _.sortBy(_.filter(vue.userInfo, (userInfo)=>{return userInfo.receiveAcoin>0;}), function(userInfo){
									return -userInfo.receiveAcoin;
								});
								vue.giftUserRankListPagination.total = vue.giftUserRankList.length;


								vue.isGettingReceiveGiftList = false;
								vue.hasGetReceiveGiftList = true;


								if(_.isFunction(callback)){
									callback();
								}

								return;
							}
							else{
								commonRequrest(config.ACFUN_MOBILE_SERVER + config.URLS.WALLET.RECEIVE_GIFT, 'get',{pcursor : pcursor,},true,
									function(isSuccess, data){
										// 获取数据失败
										if(!isSuccess){
											vue.$message({
												type : 'error',
												message : '获取送出礼物列表失败',
											});

											pcursor = 'no_more';
											getReceiveGiftList();
										}
										else{

											data = JSON.parse(data);
											pcursor = data['pcursor'];

											if(data.records && data.records.length>0){

												var uids = {};
												var uidUserNameMapper = {};
												// 获取用户信息
												data.records.forEach(function(record){

													record.createDate = moment(record.createTime).startOf('day')._d.getTime();

													// 指定了起始时间
													if(startDate && record.createDate<startDate){
														pcursor = "no_more";
														return;
													}
													// 指定了终止时间
													else if(endDate && record.createDate>endDate){
														return;
													}
													// 不包含桃子
													else if(!isContainPeach && record.giftName == '桃子'){
														return;
													}

													if(!(record.userId in uids)){
														uids[record.userId] = [];
													}
													uidUserNameMapper[record.userId] = record.userName;

													var now = moment(record.createTime);

													// 设置送出时间
													record.createTimeText = now.format('YYYY-MM-DD HH:mm:ss');
													if(record.giftName == '桃子'){
														record.acoin = 0;
														record.peachAmount = record.giftCount;
													}
													else{
														// 如果是已有的礼物
														if(record.giftName in vue.giftNameMapper){
															record.acoin = vue.giftNameMapper[record.giftName].price * record.giftCount;
														}
														// 如果是下架礼物
														else{
															record.acoin = praseInt(record.azuanAmount/10/8);
														}
														record.peachAmount = 0;
													}
													record.giftText = `${record.giftCount}个${record.giftName}`;

													// 设置时间单位，便于获取趋势
													record.dayUnitText = now.format('YYYY-MM-DD');
													record.monthUnitText = now.format('YYYY-MM');
													record.yearUnitText = now.format('YYYY');
													record.weekUnitText = now.startOf('week').add(1, 'days').format('YYYY-MM-DD');

													uids[record.userId].push(record);

													vue.receiveGiftList.push(record);
												});

												// 没有任何记录
												if(Object.keys(uids).length==0){
													getReceiveGiftList();
												}
												else{

													var nextGetReceiveGiftList = _.after(Object.keys(uids).length, getReceiveGiftList);

													for(var uid in uids){
														vue.getUserInfo(uid, uidUserNameMapper[uid], function(isSuccess, userInfo){


															// 统计送出给用户AC币
															if(userInfo.receiveGiftList == null){
																userInfo.receiveGiftList = [];
															}
															if(userInfo.receive==null){
																userInfo.receive = 0;
															}
															if(userInfo.receiveAcoin==null){
																userInfo.receiveAcoin = 0;
															}
															if(userInfo.receivePeach==null){
																userInfo.receivePeach = 0;
															}

															userInfo.receiveGiftList.splice(userInfo.receiveGiftList.length, 0, ...uids[userInfo.uid]);
															userInfo.receive += _.sumBy(uids[userInfo.uid], 'azuanAmount');
															userInfo.receiveAcoin += _.sumBy(uids[userInfo.uid], 'acoin');
															userInfo.receivePeach += _.sumBy(uids[userInfo.uid], 'peachAmount');

															nextGetReceiveGiftList();

														});
													}
												}

											}
											else{
												getReceiveGiftList();
											}
										}


									},
								);
							}
						}

						getReceiveGiftList();

					},
 					// 渲染趋势
 					renderGiftTrend : function(){

 						var data = this.switchToSendGiftTrend?this.sendGiftList:this.receiveGiftList;

 						// 筛选用户
 						if(this.giftTrendFormData.uid){

 							data = _.filter(data, {userId:_.parseInt(this.giftTrendFormData.uid)});

 						}

 						// 按时间分组
 						data = _.groupBy(data, (item)=>{
 							// 按天筛选
 							if(this.giftTrendFormData.unit == 'day'){
 								return item.dayUnitText;
 							}
 							// 按周筛选
 							if(this.giftTrendFormData.unit == 'week'){
 								return item.weekUnitText;
 							}
 							// 按月筛选
 							if(this.giftTrendFormData.unit == 'month'){
 								return item.monthUnitText;
 							}
 							// 按年筛选
 							if(this.giftTrendFormData.unit == 'year'){
 								return item.yearUnitText;
 							}
 						});

 						// 转化格式
 						var lineNameData = _.sortBy(Object.keys(data));
 						var lineValueData = [];
 						lineNameData.forEach((unit)=>{
 							lineValueData.push(_.sumBy(data[unit], this.switchToSendGiftTrend?'acoin':'azuanAmount'));
 						});


 						var chart = this.initGiftTrendFinish?this.renderGiftTrendChartObj:echarts.init(document.getElementById('gift-trend-container'));
						var option = {
							xAxis: {
								type: 'category',
								name : '时间',
								data : lineNameData,

							},
							yAxis: {
								type: 'value',
								name : this.switchToSendGiftTrend?'AC币':'钻石',
							},
							series: [{
								type: 'line',
								data : lineValueData,
								name : this.switchToSendGiftTrend?'AC币':'钻石',
							},],
							tooltip : {
								trigger : 'axis',
								axisPointer : {
									type : 'line',
									axis : 'x',
								},
								confine : true,
							},
							dataZoom : [{
								type : 'inside',
								orient : 'horizontal',
							}],
						};


						chart.setOption(option);
						this.renderGiftTrendData = data;
						if(!this.initGiftTrendFinish){
							chart.on('click', (params)=> {
								// 隐藏tooltip
								chart.dispatchAction({
									type: 'hideTip',
								});

	 							this.giftDetailListPagination = {
									page : 1,
									total : this.renderGiftTrendData[params.name].length,
									pageSize : 5,
								};
								// 设置礼物数据
								this.giftDetailList = this.renderGiftTrendData[params.name];

								// 展示
								this.showGiftDetail = true;

							});
						}

						if(!this.initGiftTrendFinish){
							this.renderGiftTrendChartObj = chart;
						}
						this.initGiftTrendFinish = true;


 					},
					// 打开设置弹窗
					openSettingDialog : function(){
						this.settingFormDialogVisible = true;
					},
					// 更改设置提交
					handleSettingFormSubmit : function(){
						var vue = this;
						this.$refs.settingForm.validate((valid) => {
							// 通过校验
							if(valid){

								this.hasGetSendGiftList = false;
								this.hasGetReceiveGiftList = false;
								this.showGiftDetail = false;
								this.showGiftTrend = true;

								this.send = 0;
								this.receive = 0;
								this.sendGiftList = [];
								this.receiveGiftList = [];
								this.giftDetailList = [];

								this.sendUserList = [];
								this.receiveUserList = [];
								this.peachUserRankList = [];
								this.giftUserRankList = [];

								this.sendUserListPagination = {
									page : 1,
									total : 0,
									pageSize : 5,
								};
								this.peachUserRankListPagination = {
									page : 1,
									total : 0,
									pageSize : 5,
								};
								this.giftUserRankListPagination = {
									page : 1,
									total : 0,
									pageSize : 5,
								};
								for(var uid in this.userInfo){
									this.userInfo[uid] = {
										uid : uid,
										userName : this.userInfo[uid].userName,
										photo : this.userInfo[uid].photo,
									};
								}
								this.$message({
									type : 'info',
									message : '开始获取数据',
								});

								this.settingFormDialogVisible = false;

								this.getSendGiftList(function(){
									vue.getReceiveGiftList(function(){
										vue.$message({
											type : 'success',
											message : '数据获取成功',
										});

										// 生成筛选文字
										vue.filterText = vue.formatFilterText();

										// 获取趋势
										if(vue.showGiftTrend){
											vue.$nextTick(function(){
												vue.giftTrendFormData = {
													unit : 'day',
												};
											});
										}
									});
								});


							}
						});
					},
					// 导出excel
					exportGift : function(){

						var vue = this;
						var workbook = new ExcelJS.Workbook();

						var sheet = workbook.addWorksheet('送出礼物用户排行榜');
						sheet.columns = [
							{ key: 'userName', width: 30, },
							{ key: 'uid', width: 10, },
							{ key: 'acoin', width: 20, },
						];

						var rowIndex = 1;

						sheet.addRow({userName: '用户名', uid : '用户uid', 'acoin' : 'AC币'});
						// 设置列名样式
						var headerRow = sheet.getRow(rowIndex);
						for(var i=1;i<=sheet.columns.length;++i){
							headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
							headerRow.getCell(i).border = {
								top: {style:'thin'},
								left: {style:'thin'},
								bottom: {style:'thin'},
								right: {style:'thin'},
							};
						}

						rowIndex += 1;

						// 获取送出礼物用户排行
						this.sendUserList.forEach(function(userInfo){
							sheet.addRow({userName: userInfo.userName, uid : userInfo.uid, acoin:userInfo.send});

							// 设置记录样式
							var recordRow = sheet.getRow(rowIndex);
							for(var i=1;i<=sheet.columns.length;++i){
								// recordRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
								recordRow.getCell(i).border = {
									top: {style:'thin'},
									left: {style:'thin'},
									bottom: {style:'thin'},
									right: {style:'thin'},
								};
							}

							rowIndex += 1;

						});



						sheet = workbook.addWorksheet('桃榜');
						sheet.columns = [
							{ key: 'userName', width: 30, },
							{ key: 'uid', width: 10, },
							{ key: 'receivePeach', width: 20, },
						];

						rowIndex = 1;


						sheet.addRow({userName: '用户名', uid : '用户uid', 'receivePeach' : '桃'});
						// 设置列名样式
						var headerRow = sheet.getRow(rowIndex);
						for(var i=1;i<=sheet.columns.length;++i){
							headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
							headerRow.getCell(i).border = {
								top: {style:'thin'},
								left: {style:'thin'},
								bottom: {style:'thin'},
								right: {style:'thin'},
							};
						}

						rowIndex += 1;

						// 获取桃榜
						this.peachUserRankList.forEach(function(userInfo){
							sheet.addRow({userName: userInfo.userName, uid : userInfo.uid, receivePeach:userInfo.receivePeach});

							// 设置记录样式
							var recordRow = sheet.getRow(rowIndex);
							for(var i=1;i<=sheet.columns.length;++i){
								// recordRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
								recordRow.getCell(i).border = {
									top: {style:'thin'},
									left: {style:'thin'},
									bottom: {style:'thin'},
									right: {style:'thin'},
								};
							}

							rowIndex += 1;

						});


						sheet = workbook.addWorksheet('贡献榜');
						sheet.columns = [
							{ key: 'userName', width: 30, },
							{ key: 'uid', width: 10, },
							{ key: 'receiveAcoin', width: 20, },
						];

						rowIndex = 1;

						sheet.addRow({userName: '用户名', uid : '用户uid', 'receiveAcoin' : 'AC币'});
						// 设置列名样式
						var headerRow = sheet.getRow(rowIndex);
						for(var i=1;i<=sheet.columns.length;++i){
							headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
							headerRow.getCell(i).border = {
								top: {style:'thin'},
								left: {style:'thin'},
								bottom: {style:'thin'},
								right: {style:'thin'},
							};
						}

						rowIndex += 1;

						// 获取贡献榜
						this.giftUserRankList.forEach(function(userInfo){
							sheet.addRow({userName: userInfo.userName, uid : userInfo.uid, receiveAcoin:userInfo.receiveAcoin});

							// 设置记录样式
							var recordRow = sheet.getRow(rowIndex);
							for(var i=1;i<=sheet.columns.length;++i){
								// recordRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
								recordRow.getCell(i).border = {
									top: {style:'thin'},
									left: {style:'thin'},
									bottom: {style:'thin'},
									right: {style:'thin'},
								};
							}

							rowIndex += 1;

						});


						sheet = workbook.addWorksheet('送出礼物详情');
						sheet.columns = [
							{ key: 'userName', width: 30, },
							{ key: 'uid', width: 10, },
							{ key: 'createTimeText', width: 20, },
							{ key: 'giftName', width: 20, },
							{ key: 'giftCount', width: 20, },
							{ key: 'acoin', width: 20, },
						];

						var rowIndex = 1;

						sheet.addRow({userName: '用户名', uid : '用户uid', createTimeText : '送出时间', giftName:'礼物名称', giftCount:'礼物数量', acoin : 'AC币'});
						// 设置列名样式
						var headerRow = sheet.getRow(rowIndex);
						for(var i=1;i<=sheet.columns.length;++i){
							headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
							headerRow.getCell(i).border = {
								top: {style:'thin'},
								left: {style:'thin'},
								bottom: {style:'thin'},
								right: {style:'thin'},
							};
						}

						rowIndex += 1;

						// 获取送出礼物详情
						this.sendGiftList.forEach(function(giftDetail){
							sheet.addRow({userName: giftDetail.userName, uid : giftDetail.userId, createTimeText:giftDetail.createTimeText, giftName:giftDetail.giftName, giftCount:giftDetail.giftCount, acoin:giftDetail.acoin});

							// 设置记录样式
							var recordRow = sheet.getRow(rowIndex);
							for(var i=1;i<=sheet.columns.length;++i){
								// recordRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
								recordRow.getCell(i).border = {
									top: {style:'thin'},
									left: {style:'thin'},
									bottom: {style:'thin'},
									right: {style:'thin'},
								};
							}

							rowIndex += 1;

						});


						sheet = workbook.addWorksheet('收到礼物详情');
						sheet.columns = [
							{ key: 'userName', width: 30, },
							{ key: 'uid', width: 10, },
							{ key: 'createTimeText', width: 20, },
							{ key: 'giftName', width: 20, },
							{ key: 'giftCount', width: 20, },
							{ key: 'azuanAmount', width: 20, },
						];

						var rowIndex = 1;

						sheet.addRow({userName: '用户名', uid : '用户uid', createTimeText : '收到时间', giftName:'礼物名称', giftCount:'礼物数量', azuanAmount : '钻石'});
						// 设置列名样式
						var headerRow = sheet.getRow(rowIndex);
						for(var i=1;i<=sheet.columns.length;++i){
							headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
							headerRow.getCell(i).border = {
								top: {style:'thin'},
								left: {style:'thin'},
								bottom: {style:'thin'},
								right: {style:'thin'},
							};
						}

						rowIndex += 1;

						// 获取送出礼物详情
						this.receiveGiftList.forEach(function(giftDetail){
							sheet.addRow({userName: giftDetail.userName, uid : giftDetail.userId, createTimeText:giftDetail.createTimeText, giftName:giftDetail.giftName, giftCount:giftDetail.giftCount, azuanAmount:giftDetail.azuanAmount});

							// 设置记录样式
							var recordRow = sheet.getRow(rowIndex);
							for(var i=1;i<=sheet.columns.length;++i){
								// recordRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
								recordRow.getCell(i).border = {
									top: {style:'thin'},
									left: {style:'thin'},
									bottom: {style:'thin'},
									right: {style:'thin'},
								};
							}

							rowIndex += 1;

						});


						;(async function(){
							var buffer = await workbook.xlsx.writeBuffer();
							var file = new File([buffer], `【${moment().format('YYYY-MM-DD')}】acfun统计${vue.filterText}.xlsx`);
							saveAs(file);
						})();

					},
					// 展示趋势
					handleShowGiftTrend : function(){
						this.showGiftTrend = true;
						this.$nextTick(function(){
							this.renderGiftTrend();
						});
					},
					// 切换趋势
					handleSwitchToSendGiftTrend : function(){
						this.switchToSendGiftTrend = !this.switchToSendGiftTrend;
						this.$nextTick(function(){
							this.renderGiftTrend();
						});
					},
					// 跳转至用户主页
					toUserSpace : function(userInfo){
						window.open(config.ACFUN_SERVER + config.URLS.ACFUN_USER.SPACE + `/${userInfo.uid}`);
					},
					formatFilterText : function(){

						var dateRegionText = null,isContainPeachText=null;
						// 筛选了时间范围
						if(this.settingFormData.dateRegion && this.settingFormData.dateRegion.length==2){
							dateRegionText = `${moment(this.settingFormData.dateRegion[0]).format('YYYY-MM-DD')} 至 ${moment(this.settingFormData.dateRegion[1]).format('YYYY-MM-DD')}`;
						}
						if(!this.settingFormData.isContainPeach){
							isContainPeachText = '不包含桃子';
						}

						var texts = _.filter([dateRegionText, isContainPeachText]).join('、');
						if(isNullOrEmpty(texts)){
							return '';
						}
						else{
							return '（' + texts + '）';
						}

					},
				},
				computed : {
					sendUserListPage : function(){
						return !this.sendUserList || this.sendUserList.length == 0?[]:this.sendUserList.slice((this.sendUserListPagination.page-1)*this.sendUserListPagination.pageSize, this.sendUserListPagination.page*this.sendUserListPagination.pageSize);
					},
					peachUserRankListPage : function(){
						return !this.peachUserRankList || this.peachUserRankList.length == 0?[]:this.peachUserRankList.slice((this.peachUserRankListPagination.page-1)*this.peachUserRankListPagination.pageSize, this.peachUserRankListPagination.page*this.peachUserRankListPagination.pageSize);
					},
					giftUserRankListPage : function(){
						return !this.giftUserRankList || this.giftUserRankList.length == 0?[]:this.giftUserRankList.slice((this.giftUserRankListPagination.page-1)*this.giftUserRankListPagination.pageSize, this.giftUserRankListPagination.page*this.giftUserRankListPagination.pageSize);
					},
					giftDetailListPage : function(){
						return !this.giftDetailList || this.giftDetailList.length == 0?[]:this.giftDetailList.slice((this.giftDetailListPagination.page-1)*this.giftDetailListPagination.pageSize, this.giftDetailListPagination.page*this.giftDetailListPagination.pageSize);
					},
				},
				watch: {
					// 监听趋势表单数据变化
					giftTrendFormData : {
						deep : true,
						handler : function(newVal, oldVal){
							if(this.showGiftTrend){

								this.$nextTick(function(){
									this.renderGiftTrend();
								});
							}
						},
					},
				},
				mounted : function(){

					var vue = this;


					vue.$message({
						type : 'info',
						message : '正在获取礼物列表',
					});

					// 获取礼物列表
					this.getGiftList(function(isSuccess){

						if(isSuccess){
							vue.$message({
								type : 'success',
								message : '礼物列表获取成功',
							});
							// 打开弹窗
							vue.openSettingDialog();
						}
						else{
							vue.$message({
								type : 'error',
								message : '礼物列表获取失败',
							});
						}

					});

				},
			});

			});


		navEle.append(navItem);



		return true;

	}


	function checkLoadVue(loadFunc){

		window.setTimeout(function(){

			var isSuccess = loadFunc();
			if(!isSuccess){
				checkLoadVue(loadFunc);
			}

		}, 1000);

	}


	window.onload = function(){

		checkLoadVue(loadStatVue);


	};


})();