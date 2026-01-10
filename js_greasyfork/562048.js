// ==UserScript==
// @name         房屋专项整治试点解密加密提交
// @namespace    http://tampermonkey.net/
// @version      2026-01-08
// @description  针对V1.6.0
// @author       GX
// @match        https://lzgd.jssny.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://fastly.jsdelivr.net/npm/sm-crypto@0.3.13/dist/sm2.js
// @require      https://fastly.jsdelivr.net/npm/sm-crypto@0.3.13/dist/sm3.js
// @require      https://fastly.jsdelivr.net/npm/sm-crypto@0.3.13/dist/sm4.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562048/%E6%88%BF%E5%B1%8B%E4%B8%93%E9%A1%B9%E6%95%B4%E6%B2%BB%E8%AF%95%E7%82%B9%E8%A7%A3%E5%AF%86%E5%8A%A0%E5%AF%86%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/562048/%E6%88%BF%E5%B1%8B%E4%B8%93%E9%A1%B9%E6%95%B4%E6%B2%BB%E8%AF%95%E7%82%B9%E8%A7%A3%E5%AF%86%E5%8A%A0%E5%AF%86%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	const { sm2 } = window
    const encryptKey = '046677438bd3f38798d2462514bb04f075ce45a516559242f9103f1874531daa503987927faafd915adfa368c46fefab90eec35b8a99de71b378cc1578a378f7d4'
    const sigKey = 'cdddb9d2948c64ad0385b1a24edf153116a697bb7131641f0efce3299a475f55'
    const encryptKey2 = '0489ae54cfa77c29e31f7473d96407a64ea4bdc2d3be14fcbbcf1b4bd63a0241545958a13eebd9a0fcebcce8ef827f43762156d79449d6dee1ae815dd36670b2d1'
    let tryCount = 0, maxTry = 3
    const tblxList = [
    	{value: '1', name: '住宅类乱占耕地图斑'},
    	{value: '2', name: '非住宅类乱占耕地图斑'},
    	{value: '3', name: '非乱占耕地图斑'},
    	{value: '4', name: '已整治完成图斑'},
    	{value: '5', name: '2013年1月1日（不含）前竣工或2020年7月3日（含）后开工图斑'},
    	{value: '6', name: '不在行政区划范围内图斑'}
	]
    let tblx = '1'
    const tokenLoseCodes = ['401', 'S403', 'S401']
    const ROLE = {
    	TOWN: 'pcry',
    	TOWN_HANDLE: 'xzyh'
    }

    const getTblxName = (lx = null) => {
    	lx = lx || tblx
    	return tblxList.find(item => item.value === lx)?.name || ''
    }

    /**
     * 响应式变量
     */
    const state = new Proxy({ submiting: false }, {
	    set(target, key, value) {
			if (key === 'submiting') {
				// 响应逻辑
				document.dispatchEvent(new CustomEvent('state-change:submiting', {detail: {edit: value}}))
			}
			target[key] = value
			return true
	    }
  	})

    const doEncryptData = (data) => {
        return sm2.doEncrypt(JSON.stringify(data), encryptKey, 1)
    }

    const doDecryptResult = (dataStr) => {
    	return sm2.doDecrypt(dataStr, sigKey, 1)
    }

    const doSigData = (data) => {
        return sm2.doSignature(JSON.stringify(data), sigKey)
    }

	const $body = document.body

	const createOpenBtn = () => {
    	const _openBtn = document.createElement('a')
		_openBtn.innerHTML = '打开批量填报窗口'
		_openBtn.className = 'open-win-btn'
		$body.appendChild(_openBtn)

		GM_addStyle(`
			.open-win-btn {
				position: fixed;
			    right: 65px;
			    top: 125px;
			    padding: 10px;
			    color: #FFF;
			    background: #3aab47;
			    border-radius: 6px;
			    cursor: pointer;
			    z-index: 9998;
			}
			.open-win-btn.hide {
				display: none;
			}
			.open-win-btn:hover {
				background: #2d8137;
			}
		`)
		return _openBtn
    }

    const createRadio = (name, value, group = 'tblx') => {
    	// 创建一个包裹 span，用于应用样式和事件
		const wrapper = document.createElement('span')
		wrapper.className = 'radio-item'

		// 创建 Input
		const radio = document.createElement('input')
		radio.type = 'radio'
		radio.name = group
		radio.id = group + '-radio-' + value
		radio.value = value

		// 创建 Label
		const label = document.createElement('label')
		label.htmlFor = radio.id
		label.textContent = name

		// 组装：将 input 和 label 放入 wrapper
		wrapper.appendChild(radio)
		wrapper.appendChild(label)

		// radio.addEventListener('change', function() {
		// 	// this 指向当前触发事件的按钮
		// 	tblx = this.value
		// 	document.dispatchEvent(new CustomEvent('update-radio:tblx'))
		// })
		document.addEventListener('state-change:submiting', function(e) {
	      	radio.disabled = e.detail.edit
	    })
		return {
			radio,
			wrapper
		}
    }

    const createWinBtn = (text, cls) => {
    	const _btn = document.createElement('a')
		_btn.innerHTML = text
		_btn.className = 'win-form-btn'
		_btn.classList.add(cls)
		return _btn
    }

    const setWinStyle = () => {
    	GM_addStyle(`
			.form-win {
				position: fixed;
			    left: 0;
			    top: 0;
			    width: 100%;
			    height: 100%;
			    padding: 20px;
			    display: none;
			    flex-direction: column;
			    gap: 20px;
			    background: #FFF;
				overflow: hidden;
			    z-index: 9999;
			    box-sizing: border-box;
			}
			.form-win.open {
				display: flex;
			}
			.ad-view {
				font-size: 24px;
    			font-weight: bold;
				text-align: center;
			}
			.choose-view {
				display: flex;
			    gap: 15px;
			    align-items: center;
			}
			.radio-item {
				display: flex;
				align-items: center;
				cursor: pointer;
			}
			.radio-item input {
				cursor: pointer;
    			margin: 0 5px 0 0;
			}
			.radio-item label {
				cursor: pointer;
			}
			.choose-view .last {
			    align-items: flex-end;
			    font-size: 18px;
			    font-weight: bold;
			    color: #2044ff;
			}
			.main-view {
				flex: 1;
				display: flex;
				gap: 10px;
				overflow: hidden;
			}
			.input-view {
				flex: 1;
			    resize: none;
			}
			.res-view {
				flex: 0 0 auto;
				width: 380px;
				overflow: auto;
			}
			.res-view p {
				word-wrap: break-word;
			}
			.res-view p.red {
				font-size: 20px;
				font-weight: bold;
				color: #FF0000;
			}
			.btn-view {
				flex: 0 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 15px;
			}
			.win-form-btn {
				display: block;
			    padding: 10px 20px;
			    color: #FFF;
			    border-radius: 6px;
			    user-select: none;
			    cursor: pointer;
			}
			.win-form-btn.get {
				background: #72837a;
			}
			.win-form-btn.do {
				background: #14bad5;
			}
			.win-form-btn.upload {
				background: #4957ff;
			}
			.win-form-btn.add {
				background: #8d7643;
			}
			.win-form-btn.parse {
				background: #3ea116;
			}
			.win-form-btn.cancel {
				background: #ef763c;
			}
			.hide {
				display: none;
			}
		`)
    }

	const upRadioOpts = [
		{name: '清除上传文件对应字段的旧文件重新上传', value: 1},
		{name: '校验上传文件对应字段旧文件后不一致上传', value: 2},
		{name: '直接上传文件', value: 3},
	]
	let upType = 1
	const getUpTypeName = () => {
		return upRadioOpts.find(item => item.value === upType)?.name || ''
	}
    const createWin = () => {
    	const win = document.createElement('div')
    	win.classList = ['form-win']
		$body.appendChild(win)

		const adView =  document.createElement('div')
		adView.className = 'ad-view'
		adView.innerHTML = "当前账户区划"
		win.appendChild(adView)

		const chooseView = document.createElement('div')
		chooseView.className = 'choose-view'
		win.appendChild(chooseView)

		for (let rItem of tblxList) {
			const { radio: tblxRadio, wrapper: radioWrap } = createRadio(rItem.name, rItem.value)
			if (rItem.value === tblx) {
				tblxRadio.checked = true
			}
			chooseView.appendChild(radioWrap)
			tblxRadio.addEventListener('change', function() {
				// this 指向当前触发事件的按钮
				tblx = this.value
				document.dispatchEvent(new CustomEvent('update-radio:tblx'))
			})
		}

		const lxShowView = document.createElement('span')
		lxShowView.className = 'last'
		lxShowView.innerHTML = '当前类型值：' + tblx
		chooseView.appendChild(lxShowView)

		document.addEventListener('update-radio:tblx', function(e) {
	      	lxShowView.innerHTML = '当前类型值：' + tblx
	    })

		const mainView  = document.createElement('div')
		mainView.className = 'main-view'
		win.appendChild(mainView)
		const taskView = document.createElement('div')
		taskView.className = 'res-view'
		mainView.appendChild(taskView)
		const inputView = document.createElement('textarea')
		inputView.id = 'jsonTextarea'
		inputView.className = 'input-view'
		mainView.appendChild(inputView)
		const resView = document.createElement('div')
		resView.className = 'res-view'
		mainView.appendChild(resView)

		document.addEventListener('state-change:submiting', function(e) {
	      	inputView.disabled = e.detail.edit
	    })

		const btnView  = document.createElement('div')
		btnView.className = 'btn-view'
		win.appendChild(btnView)
		const getTaskBtn = createWinBtn('获取所有任务', 'cancel')
		const getBtn = createWinBtn('获取编号', 'get')
		const submitBtn = createWinBtn('提交数据', 'do')
		const uploadBtn = createWinBtn('提交并上传', 'upload')
		const getBhBtn = createWinBtn('读取文件编号', 'get')
		const uploadClearBtn = createWinBtn('全部清除并上传文件', 'do')
		const addBtn = createWinBtn('文件补传', 'add')
		const uploadSomeClearBtn = createWinBtn('部分清除并上传文件', 'do')
		const parseBtn= createWinBtn('解密数据', 'parse')
		const cancelBtn = createWinBtn('关闭视窗', 'cancel')
		btnView.appendChild(getTaskBtn)
		btnView.appendChild(getBtn)
		submitBtn.setAttribute('title', '注意：仅对数据进行更新保存')
		btnView.appendChild(submitBtn)
		uploadBtn.setAttribute('title', '注意：更新数据同时并清除记录原文件重新上传保存')
		btnView.appendChild(uploadBtn)
		btnView.appendChild(getBhBtn)
		uploadClearBtn.setAttribute('title', '注意：清除记录原文件重新上传保存')
		btnView.appendChild(uploadClearBtn)
		addBtn.setAttribute('title', '注意：不清除记录原文件，仅校验未上传文件补充上传保存')
		btnView.appendChild(addBtn)
		uploadSomeClearBtn.setAttribute('title', '注意：清除上传文件记录对应字段原文件，重新上传保存')
		btnView.appendChild(uploadSomeClearBtn)
		btnView.appendChild(parseBtn)
		btnView.appendChild(cancelBtn)

		const upBtnView = document.createElement('div')
		upBtnView.className = 'btn-view'
		win.appendChild(upBtnView)
		for (let upItem of upRadioOpts) {
			const { radio: upRadio, wrapper: upRadioWrap } = createRadio(upItem.name, upItem.value, 'up')
			if (upItem.value === upType) {
				upRadio.checked = true
			}
			upBtnView.appendChild(upRadioWrap)
			upRadio.addEventListener('change', function() {
				// this 指向当前触发事件的按钮
				upType = this.value
				document.dispatchEvent(new CustomEvent('update-radio:up'))
			})
		}
		const upByTypeBtn = createWinBtn('选择文件上传', 'add')
		upBtnView.appendChild(upByTypeBtn)
		const upAutoByTypeBtn = createWinBtn('选择文件自动匹配类型上传', 'parse')
		upBtnView.appendChild(upAutoByTypeBtn)
		const submitAutoByTypeBtn = createWinBtn('自动匹配类型提交数据', 'do')
		upBtnView.appendChild(submitAutoByTypeBtn)

		const handleBtnView = document.createElement('div')
		handleBtnView.className = 'btn-view'
		win.appendChild(handleBtnView)
		const handleUpBtn = createWinBtn('选择文件上传', 'add')
		handleBtnView.appendChild(handleUpBtn)
		const handleCancelBtn = createWinBtn('关闭视窗', 'cancel')
		handleBtnView.appendChild(handleCancelBtn)

		setWinStyle()

		const showWin = async () => {
			win.classList.add('open')
			await switchByRole()
			const adRes = await getAdName()
			if (!adRes.success) {
				return
			}
			const name = adRes.name
			adView.innerHTML = name
		}

		const showTaskRes = (text) => {
			taskView.innerHTML = text
		}

		const showTaskRowRes = (text, solid = false) => {
			const p = document.createElement('p')
			p.innerHTML = text
			if (solid) {
				p.className = 'red'
			}
			taskView.appendChild(p)
			/*taskView.scrollTo({
			  top: taskView.scrollHeight,
			  behavior: 'smooth'
			})*/
		}

		const getInputValue = () => {
			return inputView.value
		}

		const setInputValue = (text) => {
			inputView.value = text
		}

		const showRes = (text) => {
			resView.innerHTML = text
		}

		const showRowRes = (text, solid = false) => {
			const p = document.createElement('p')
			p.innerHTML = text
			if (solid) {
				p.className = 'red'
			}
			resView.appendChild(p)
			resView.scrollTo({
			  top: resView.scrollHeight,
			  behavior: 'smooth'
			})
		}

		const showTownControls = (show) => {
			if (show) {
				if (btnView.classList.contains('hide')) {
					btnView.classList.remove('hide')
				}
				if (upBtnView.classList.contains('hide')) {
					upBtnView.classList.remove('hide')
				}
			} else {
				if (!btnView.classList.contains('hide')) {
					btnView.classList.add('hide')
				}
				if (!upBtnView.classList.contains('hide')) {
					upBtnView.classList.add('hide')
				}
			}
		}

		const showTownHandleControls = (show) => {
			if (show) {
				if (handleBtnView.classList.contains('hide')) {
					handleBtnView.classList.remove('hide')
				}
			} else {
				if (!handleBtnView.classList.contains('hide')) {
					handleBtnView.classList.add('hide')
				}
			}
		}

		const switchByRole = async () => {
			const isTown = await hasRole(ROLE.TOWN)
			showTownControls(isTown)
			const isTownHandle = await hasRole(ROLE.TOWN_HANDLE)
			showTownHandleControls(isTownHandle)
		}

		const handleCancel = () => {
			if (state.submiting) return
			inputView.value = ''
			resView.innerHTML = ''
			win.classList.remove('open')
		}

		cancelBtn.addEventListener('click', handleCancel)

		handleCancelBtn.addEventListener('click', handleCancel)

		return {
			showWin,
			showTaskRes,
			showTaskRowRes,
			getInputValue,
			setInputValue,
			showRes,
			showRowRes,
			getTaskBtn,
			getBtn,
			parseBtn,
			uploadBtn,
			getBhBtn,
			uploadClearBtn,
			addBtn,
			uploadSomeClearBtn,
			submitBtn,
			upByTypeBtn,
			upAutoByTypeBtn,
			submitAutoByTypeBtn,
			handleUpBtn
		}
    }

    const openBtn = createOpenBtn()
    const {
    	showWin,
		showTaskRes,
		showTaskRowRes,
		getInputValue,
		setInputValue,
		showRes,
		showRowRes,
		getTaskBtn,
		getBtn,
		parseBtn,
		uploadBtn,
		getBhBtn,
		uploadClearBtn,
		addBtn,
		uploadSomeClearBtn,
		submitBtn,
		upByTypeBtn,
		upAutoByTypeBtn,
		submitAutoByTypeBtn,
		handleUpBtn
    } = createWin()

    openBtn.addEventListener('click', showWin)

    /**
     * 获取数据中图斑
     * @return {[type]} [description]
     */
    const getTbList = () => {
    	const val = getInputValue()
    	if (!val) return
    	const parseResult = tryParseJSON(val)
    	if (!parseResult.pass) {
    		return {
    			lose: true,
    			msg: '数据格式不对，不是JSON字符串'
    		}
    	}
    	const parseJsonData = parseResult.data
    	let submitList = []
    	if (Array.isArray(parseJsonData)) {
    		submitList = submitList.concat(parseJsonData)
    	} else {
    		submitList.push(parseJsonData)
    	}
    	let tbhList = []
    	for (let sItem of submitList) {
    		let tbhStr = ''
    		if (isString(sItem)) {
    			tbhStr = sItem
    		} else if (isObject(sItem)) {
    			if (isSingleObject(sItem)) {
    				tbhStr = sItem?.tbh || ''
    			} else {
    				tbhStr = sItem?.tkyj?.tbh || sItem?.zjd?.tbh || ''
    			}
    		}
    		if (/^\d{6,12}[A-Z]\d{4,6}(?:-\d)?$/.test(tbhStr)) {
    			tbhList.push(tbhStr)
    		}
    	}
    	return {
    		lose: false,
    		submitList,
    		tbhList
    	}
    }

    getBtn.addEventListener('click', () => {
    	if (state.submiting) return
		const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
			return
		}
		const { submitList, tbhList } = tbhRes
		showRowRes('总数据量：' + submitList.length, true)
		showRowRes('编号总量：' + tbhList.length, true)
		showRowRes(JSON.stringify(tbhList))
    })

    parseBtn.addEventListener('click', () => {
    	const val = getInputValue()
    	if (!val) return
    	const res = doDecryptResult(val)
    	setInputValue(JSON.stringify(JSON.parse(res), null, '\t'))
    })

    /**
     * fetch 处理 504
     */
    const fetchCheck = (response) => {
		if (response.status === 504) {
	        return {code: "504"}
	  	}
	  	return response.json()
	}

    const getCookie = (key) => {
    	return new Promise((resolve) => {
    		GM_cookie.list({url: window.location.href}, function(cookies, error) {
		        if (error) {
		            return resolve({ success: false })
		        }

		        // cookies 是一个对象数组
		        cookies.forEach(function(cookie) {
		            if (cookie.name === key) {
		            	return resolve({ success: true, value: cookie.value})
		            }
		        })
		        return resolve({ success: false })
		    })
    	})
    }

    const getLocalData = (key) => {
    	var str = localStorage.getItem(key)
    	if (!str) return ''
    	const res = tryParseJSON(str)
    	return res.pass ? res.data : str
    }

    const tryParseJSON = (str) => {
    	try {
    		let obj = JSON.parse(str.trim())
    		return {
    			pass: true,
    			data: obj
    		}
    	} catch (_err) {
    		return {
    			pass: false,
    			data: null
    		}
    	}
    }

    const isSingleObject = (obj) => {
	    if (Object.prototype.toString.call(obj) !== '[object Object]') {
	        return false
	    }

	    for (let key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            const value = obj[key]

	            if (value == null) {
	                continue
	            }

	            const valueType = Object.prototype.toString.call(value);
	            if (valueType === '[object Object]' || valueType === '[object Array]') {
	                return false
	            }
	        }
	    }

	    return true
	}

	const checkZjdData = (obj) => {
		if (!obj.tbh) {
			return {
				pass: false,
				msg: '数据校验未通过,未指定图斑编号'
			}
		}
		const {
			keys_tkyj,
			keys_zjd
		} = getSubmitKeys()
		let newObj = {}
		const _keys = Object.keys(obj)
		for (let key of _keys) {
			if (keys_zjd.includes(key)) {
				newObj[key] = obj[key]
			}
		}
		return {
			pass: true,
			msg: '数据校验通过',
			result: {
				tbh: obj.tbh,
				data: {
					tkyj: {},
    				zjd: newObj,
    				submit: false
				}
			}
		}
	}

    const checkData = (obj) => {
    	const keys = Object.keys(obj)
    	if (!keys.includes('tkyj') || !keys.includes('zjd')) {
    		return {
    			pass: false,
    			msg: '数据不符合规范'
    		}
    	}
    	if (!obj.tkyj.tbh && !obj.zjd.tbh) {
    		return {
    			pass: false,
    			msg: '数据不存在对应编号'
    		}
    	}
    	return {
    		pass: true,
    		msg: '通过初步校验',
    		result: {
    			tbh: obj.tkyj.tbh || obj.zjd.tbh,
    			data: {
    				tkyj: obj.tkyj,
    				zjd: obj.zjd,
    				submit: false
    			}
    		}
    	}
    }

    const getSubmitKeys = (lx = null) => {
    	lx = lx || tblx
    	let keys_tkyj = ['dlbh', 'jtqxbh', 'tkyj', 'xczp', 'tblx', 'zzcl', 'qtzhfzmcl', 'yhdzyyjzcl', 'fzzllzgdjtbjzcl', 'flzgdtbjzcl', 'yzzwcjzcl', 'jgjzcl', 'bzfwntbjzcl', 'ssxzqhdm', 'ssxzqhmc', 'dz', 'xz', 'nz', 'beizhi', 'fwyt', 'wttbzsqsxdjfxtcl', 'fwsfcs', 'czsj', 'tbh', 'nodeId', 'taskId', 'instId', 'czry', 'id']
    	let keys_zjd = ['bdqzjdbzmj', 'bhgyy', 'cbzmj', 'sfbccm', 'dwmc', 'ffmj', 'fsyfzymj', 'fwsfcs', 'fwwz', 'fwzzdmj', 'fysfsl', 'jfyy', 'jtyy', 'mph', 'qydm', 'sf', 'sffhcxgh', 'sffhtdlyztgh', 'sfsqfyqzzx', 'sfyhyz', 'sfzcxzcf', 'szc', 'szxz', 'szz', 'tdly', 'tymj', 'tyzymj', 'xflx', 'xm', 'xxdz', 'ydsxqk', 'yhdzyy', 'zfmj', 'zfzymj', 'zygdmj', 'zygdzylx', 'zyyjjbntmj', 'zzzt', 'czb', 'hnnyrks', 'mhpjmj', 'fwlyqtqk', 'zjlxqtqk', 'ydsxqtqk', 'tbly', 'provinceName', 'cityName', 'xzqmcXq', 'znydmj', 'zjsydmj', 'zwlydmj', 'jd', 'wd', 'tbh', 'nodeId', 'taskId', 'instId', 'czry', 'czsj', 'id']
    	if (lx === '1') {
	    	keys_tkyj = [].concat(keys_tkyj, ['wjztlx'])
			keys_zjd = [].concat(keys_zjd, ['fsyfzygdmj', 'fwlx', 'fwxz', 'jgsj', 'kgsj', 'lxfs', 'tyzygdmj', 'wjztlx', 'zfzygdmj', 'zjhm', 'zjlx', 'zhs', 'fwly'])
    		return {
    			keys_tkyj,
				keys_zjd
    		}
    	}
    	if (lx === '2') {
    		keys_tkyj = [].concat(keys_tkyj, ['wjztlx', 'sfqzzxwb'])
    		keys_zjd = [].concat(keys_zjd, ['fsyfzygdmj', 'fwlx', 'fwxz', 'jgsj', 'kgsj', 'lxfs', 'sfzh', 'tyzygdmj', 'wjztlx', 'ydsxpzwh', 'zfzygdmj', 'zjhm', 'zjlx', 'zhs', 'fwly', 'sfqzzxwb'])
    		return {
    			keys_tkyj,
				keys_zjd
    		}
    	}
    	if (['3', '4', '5'].includes(lx)) {
    		return {
    			keys_tkyj,
				keys_zjd
    		}
    	}
    	if (lx === '6') {
    		// keys_tkyj =
    		// keys_zjd =
    		return {
    			keys_tkyj,
				keys_zjd
    		}
    	}
		return {
			keys_tkyj,
			keys_zjd
		}
    }

    let token,adCode,adName
    const getToken = () => {
    	return new Promise(async (resolve) => {
    		if (token) {
    			return resolve({
	    			success: true,
	    			value: token
	    		})
    		}
    		const res = await getCookie('Authorization')
    		token = res.value
    		resolve(res)
    	})
    }

    const getAdCode = () => {
    	return new Promise(async (resolve) => {
    		if (adCode) {
    			return resolve({
	    			success: true,
	    			code: adCode
	    		})
    		}
    		const res = await getCookie('uuid')
    		if (!res.success) {
    			return resolve({
	    			success: false,
	    			msg: '未获取到区域码'
	    		})
    		}
    		const useInfo = getLocalData('d2admin-1.7.2')
    		const user = useInfo?.sys?.user[res.value]?.user || {}
    		const info = user?.info || {}
    		const code = info?.currentOrg?.adCode
    		if (!code) {
    			return resolve({
	    			success: false,
	    			msg: '未获取到区域码'
	    		})
    		}
    		adCode = code
    		resolve({
    			success: true,
    			code
    		})
    	})
    }

    const getAdName = () => {
    	return new Promise(async (resolve) => {
    		if (adName) {
    			return resolve({
	    			success: true,
	    			name: adName
	    		})
    		}
    		const res = await getCookie('uuid')
    		if (!res.success) {
    			return resolve({
	    			success: false,
	    			msg: '未获取到区域名称'
	    		})
    		}
    		const useInfo = getLocalData('d2admin-1.7.2')
    		const user = useInfo?.sys?.user[res.value]?.user || {}
    		const info = user?.info || {}
    		const name = info?.currentOrg?.adName
    		if (!name) {
    			return resolve({
	    			success: false,
	    			msg: '未获取到区域名称'
	    		})
    		}
    		adName = name
    		resolve({
    			success: true,
    			name
    		})
    	})
    }

    const getUserRoles = () => {
    	return new Promise(async (resolve) => {
    		const res = await getCookie('uuid')
    		if (!res.success) {
    			return resolve({
	    			success: false,
	    			msg: '未获取到用户角色列表'
	    		})
    		}
    		const useInfo = getLocalData('d2admin-1.7.2')
    		const user = useInfo?.sys?.user[res.value]?.user || {}
    		const info = user?.info || {}
    		const role = info.role || []
    		const roles = role.map(item => item.authority)
    		resolve({
    			success: true,
    			roles
    		})
    	})
    }

    const hasRole = async (role) => {
    	const roleRes = await getUserRoles()
    	if (!roleRes.success) return false
		const { roles } = roleRes
		return roles.includes(role)
    }

	const getIdInfo = (tbh, Authorization) => {
		return new Promise(async(resolve) => {
			tryCount++
			const codeRes = await getAdCode()
			if (!codeRes.success) {
				return resolve(codeRes)
			}
			const code = codeRes.code
			fetch(`https://lzgd.jssny.com.cn/api/agile/bpm/my/todoTaskList?tbh=${tbh}&tblx=${tblx}&zjdLimit=10&zjdOffset=1&zjdFilter=true&adCode=${code}&node_id_$VEQ=&nodeId=`, {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization
		        }
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== '200') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '请求数据失败：' + (data.message || data.msg)
		            	})
					} else {
						await sleep()
						return resolve(await getIdInfo(tbh, Authorization))
					}
	            }
	            if (data.total == 0) {
	            	return resolve({
	            		success: false,
	            		msg: '数据未找到'
	            	})
	            }
	            let _info
	            if (data.total > 1) {
	            	_info = data.rows?.find(item => item.bizKey === tbh)
	            } else {
	            	_info = data.rows[0]
	            }
	            if (!_info) {
	            	return resolve({
	            		success: false,
	            		msg: '数据未找到'
	            	})
	            }
	            const info = {}
	            const keys = ['bizKey', 'taskId', 'nodeId', 'instId']
	            for (let key of keys) {
	            	info[key] = _info[key]
	            }
	            return resolve({
            		success: true,
            		msg: '请求数据成功',
            		info: info
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '请求数据失败'
            	})
		    })
		})
	}

	const getIdInfoByLx = (tbh, lx, Authorization) => {
		return new Promise(async(resolve) => {
			tryCount++
			const codeRes = await getAdCode()
			if (!codeRes.success) {
				return resolve(codeRes)
			}
			const code = codeRes.code
			fetch(`https://lzgd.jssny.com.cn/api/agile/bpm/my/todoTaskList?tbh=${tbh}&tblx=${lx}&zjdLimit=10&zjdOffset=1&zjdFilter=true&adCode=${code}&node_id_$VEQ=&nodeId=`, {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization
		        }
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== '200') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '请求数据失败：' + (data.message || data.msg)
		            	})
					} else {
						await sleep()
						return resolve(await getIdInfoByLx(tbh, lx, Authorization))
					}
	            }
	            if (data.total == 0) {
	            	return resolve({
	            		success: false,
	            		msg: '数据未找到'
	            	})
	            }
	            let _info
	            if (data.total > 1) {
	            	_info = data.rows?.find(item => item.bizKey === tbh)
	            } else {
	            	_info = data.rows[0]
	            }
	            if (!_info) {
	            	return resolve({
	            		success: false,
	            		msg: '数据未找到'
	            	})
	            }
	            const info = {}
	            const keys = ['bizKey', 'taskId', 'nodeId', 'instId']
	            for (let key of keys) {
	            	info[key] = _info[key]
	            }
	            return resolve({
            		success: true,
            		msg: '请求数据成功',
            		info: info
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '请求数据失败'
            	})
		    })
		})
	}

    const getDetail = (tbh, Authorization) => {
    	return new Promise((resolve) => {
    		tryCount++
    		fetch(`https://lzgd.jssny.com.cn/api/hrp/lzgd/zjd/detail?tbh=${tbh}&taskId=`, {
		        method: 'GET',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization
		        }
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== 'S200' || data.message !== 'Success') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '请求详情失败：' + data.message
		            	})
					} else {
						await sleep()
						return resolve(await getDetail(tbh, Authorization))
					}
	            }
	            const resData = JSON.parse(doDecryptResult(data.result))
	            return resolve({
            		success: true,
            		msg: '请求详情成功',
            		detail: resData
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '请求详情失败'
            	})
		    })
	    })
    }

    const formateObjByKeys = (obj, keys) => {
    	let newObj = {}
    	for (let key of keys) {
    		let res = obj[key]
    		if (res === null || res === undefined) {
    			res = null
    		}
    		newObj[key] = res
    	}
    	return newObj
    }

    const formatPreDetail = (detail, lx = null) => {
    	const { tkyj, zjd } = detail
    	const {
			keys_tkyj,
			keys_zjd
		} = getSubmitKeys(lx)
    	const newTkyj = formateObjByKeys(tkyj, keys_tkyj)
    	const newZjd = formateObjByKeys(zjd, keys_zjd)
    	return {
    		tkyj: newTkyj,
    		zjd: newZjd,
    		submit: false
    	}
    }

    const doSubmit = (data, Authorization) => {
    	return new Promise((resolve) => {
    		tryCount++
    		const dataSecret = doEncryptData(data)
    		const sig = doSigData(data)
    		fetch(`https://lzgd.jssny.com.cn/api/hrp/lzgd/tkyj/saveOrUpdate`, {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization,
		            "Sig": sig
		        },
		        body: JSON.stringify({
		        	dataSecret
		        })
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== 'S200' || data.message !== 'Success') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '提交数据失败：' + (data.message || data.msg)
		            	})
					} else {
						await sleep()
						return resolve(await doSubmit(data, Authorization))
					}
	            }
	            return resolve({
            		success: true,
            		msg: '提交数据成功：' + data.message
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '提交数据失败'
            	})
		    })
    	})
    }

    const getPreInfo = (tbh, Authorization) => {
    	return new Promise(async(resolve) => {
    		tryCount = 0
    		const idInfo = await getIdInfo(tbh, Authorization)
	    	if (!idInfo.success) {
	    		return resolve({
	    			success: false,
	    			relogin: idInfo.relogin,
	    			msg: idInfo.msg
	    		})
	    	}
	    	if (idInfo.info.bizKey !== tbh) {
	    		return resolve({
	    			success: false,
	    			msg: '找到的列表数据不对'
	    		})
	    	}
	    	delete idInfo.info.bizKey
    		tryCount = 0
	    	const detailRes = await getDetail(tbh, Authorization)
	    	if (!detailRes.success) {
	    		return resolve({
	    			success: false,
	    			relogin: detailRes.relogin,
	    			msg: detailRes.msg
	    		})
	    	}
	    	const preSubmitData = formatPreDetail(detailRes.detail)
	    	preSubmitData.tkyj = Object.assign({}, preSubmitData.tkyj, idInfo.info)
	    	preSubmitData.zjd = Object.assign({}, preSubmitData.zjd, idInfo.info)
	    	return resolve({
	    		success: true,
	    		msg: '获取已保存数据成功',
	    		info: preSubmitData
	    	})
    	})
    }

    const getPreInfoWithLx = (tbh, lx, Authorization) => {
    	return new Promise(async(resolve) => {
    		tryCount = 0
    		let tbhInfo = getTaskIdInfo(tbh)
    		if (!tbhInfo) {
	    		const idInfo = await getIdInfoByLx(tbh, lx, Authorization)
		    	if (!idInfo.success) {
		    		return resolve({
		    			success: false,
		    			relogin: idInfo.relogin,
		    			msg: idInfo.msg
		    		})
		    	}
		    	if (idInfo.info.bizKey !== tbh) {
		    		return resolve({
		    			success: false,
		    			msg: '找到的列表数据不对'
		    		})
		    	}
		    	delete idInfo.info.bizKey
		    	tbhInfo = idInfo.info
		    } else {
		    	delete tbhInfo.tbh
		    	delete tbhInfo.tblx
		    }
    		tryCount = 0
	    	const detailRes = await getDetail(tbh, Authorization)
	    	if (!detailRes.success) {
	    		return resolve({
	    			success: false,
	    			relogin: detailRes.relogin,
	    			msg: detailRes.msg
	    		})
	    	}
	    	const preSubmitData = formatPreDetail(detailRes.detail, lx)
	    	preSubmitData.tkyj = Object.assign({}, preSubmitData.tkyj, tbhInfo)
	    	preSubmitData.zjd = Object.assign({}, preSubmitData.zjd, tbhInfo)
	    	return resolve({
	    		success: true,
	    		msg: '获取已保存数据成功',
	    		info: preSubmitData
	    	})
    	})
    }

    const submitSingleData = (tbh, data, Authorization) => {
    	return new Promise(async(resolve) => {
	    	const preInfoRes = await getPreInfo(tbh, Authorization)
	    	if (!preInfoRes.success) {
	    		return resolve(preInfoRes)
	    	}
	    	const preSubmitData = preInfoRes.info
	    	const submitData = {
	    		tkyj: {},
	    		zjd: {},
	    		submit: false
	    	}
	    	submitData.tkyj = Object.assign({}, preSubmitData.tkyj, data.tkyj)
	    	submitData.zjd = Object.assign({}, preSubmitData.zjd, data.zjd)
    		tryCount = 0
    		// 缩短等待时间
    		await sleepLmit()
	    	const submitResult = await doSubmit(submitData, Authorization)
	    	console.log('提交的数据  =>  ', tbh, submitData, submitResult)
	    	resolve({
	    		...submitResult,
	    		submitData
	    	})
    	})
    }

    const getRandom = (min, max) => {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

    const sleep = (long = false) => {
    	return new Promise((resolve) => {
    		const time = long ? getRandom(10000, 15000) : getRandom(6000, 10000)
    		setTimeout(() => {
    			resolve()
    		}, time)
    	})
    }

    const sleepUp = () => {
    	return new Promise((resolve) => {
    		const time = getRandom(2000, 4000)
    		setTimeout(() => {
    			resolve()
    		}, time)
    	})
    }

    const sleepLmit = () => {
    	return new Promise((resolve) => {
    		const time = getRandom(1000, 3000)
    		setTimeout(() => {
    			resolve()
    		}, time)
    	})
    }

    const sleepWait = () => {
    	return new Promise((resolve) => {
    		const time = getRandom(15000, 20000)
    		setTimeout(() => {
    			resolve()
    		}, time)
    	})
    }

    const sleepTime = (time) => {
    	return new Promise((resolve) => {
    		setTimeout(() => {
    			resolve()
    		}, time)
    	})
    }

    const getUploadedFiles = (tbh, Authorization) => {
    	return new Promise((resolve) => {
    		tryCount++
    		fetch(`https://lzgd.jssny.com.cn/api/hrp/lzgd/zjd/zjdFileByTbh?tbh=${tbh}`, {
		        method: 'GET',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization
		        }
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== 'S200' || data.message !== 'Success') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '请求文件列表失败：' + data.message
		            	})
					} else {
						await sleep()
						return resolve(await getUploadedFiles(tbh, Authorization))
					}
	            }
	            const { tkyjwj } = data.result
	            const _tkyjwj = tkyjwj || {}
	            const keys = needImgList.map(item => item.key.split('_').pop())
	            const resData = {}
	            for (let key of keys) {
	            	resData[key] = _tkyjwj[key]
	            }
	            return resolve({
            		success: true,
            		msg: '请求文件列表成功',
            		tkyj: resData
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '请求文件列表失败'
            	})
		    })
	    })
    }

    const getUploadedFilesWithLx = (tbh, lx, Authorization) => {
    	return new Promise((resolve) => {
    		tryCount++
    		fetch(`https://lzgd.jssny.com.cn/api/hrp/lzgd/zjd/zjdFileByTbh?tbh=${tbh}`, {
		        method: 'GET',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization
		        }
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== 'S200' || data.message !== 'Success') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '请求文件列表失败：' + data.message
		            	})
					} else {
						await sleep()
						return resolve(await getUploadedFilesWithLx(tbh, lx, Authorization))
					}
	            }
	            const { tkyjwj } = data.result
	            const _tkyjwj = tkyjwj || {}
	            const needList = getNeedImgList(lx)
	            const keys = needList.map(item => item.key.split('_').pop())
	            const resData = {}
	            for (let key of keys) {
	            	resData[key] = _tkyjwj[key]
	            }
	            return resolve({
            		success: true,
            		msg: '请求文件列表成功',
            		tkyj: resData
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '请求文件列表失败'
            	})
		    })
	    })
    }

    const delFile = (id, Authorization) => {
    	return new Promise((resolve) => {
    		tryCount++
    		const data = {id}
    		const dataSecret = doEncryptData(data)
    		const sig = doSigData(data)
    		fetch(`https://lzgd.jssny.com.cn/api/hrp/file/jiemideleteById`, {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization,
		            "Sig": sig
		        },
		        body: JSON.stringify({
		        	dataSecret
		        })
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== 'S200' || data.message !== 'Success') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '文件删除失败：' + (data.message || data.msg)
		            	})
					} else {
						await sleep()
						return resolve(await delFile(id, Authorization))
					}
	            }
	            return resolve({
            		success: true,
            		msg: '文件删除成功：' + data.message
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '文件删除失败'
            	})
		    })
    	})
    }

    const preUploadFile = (tbh, Authorization, file) => {
    	return new Promise((resolve) => {
    		tryCount++
    		const data = {
			    fileSize: file.fileSize,
			    fileName: file.fileName,
			    usageType: file.key,
			    tbh: tbh
			}
    		const dataSecret = doEncryptData(data)
    		const sig = doSigData(data)
    		fetch(`https://lzgd.jssny.com.cn/api/hrp/file/uploadPreSigned`, {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization,
		            "Sig": sig
		        },
		        body: JSON.stringify({
		        	dataSecret
		        })
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== 'S200' || data.message !== 'Success') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: file.fileName + ' => 预上传失败：' + (data.msg || data.message)
		            	})
					} else {
						await sleepWait()
						return resolve(await preUploadFile(tbh, Authorization, file))
					}
	            }
	            const { id, name, fullName, size, usageType, filePreSignedUrl, uploadFilePreSignedUrl } = data.result
	            return resolve({
	            	success: true,
	            	msg: file.fileName + ' => 预上传成功：' + (data.msg || data.message),
    				data: { id, name, fullName, size, usageType, filePreSignedUrl, uploadFilePreSignedUrl }
	            })
		    })
		    .catch(_err => {
		    	return resolve({
		    		success: false,
		    		msg: file.fileName + ' => 预上传失败'
		    	})
		    })
    	})
    }

    const doUploadFile = (tbh, Authorization, file, url) => {
    	return new Promise((resolve) => {
    		tryCount++
    		fetch(url, {
		        method: 'PUT',
		        body: file.fileObject,
		        headers: {
		        	"Content-Type": "application/octet-stream",
		            "Authorization": Authorization
		        }
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== 'S200' || data.message !== 'Success') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: file.fileName + ' => 上传失败：' + (data.msg || data.message)
		            	})
					} else {
						await sleepWait()
						return resolve(await doUploadFile(tbh, Authorization, file, url))
					}
	            }
		    	return resolve({
	            	success: true,
	            	msg: file.fileName + ' => 上传成功：' + (data.msg || data.message)
	            })
		    })
		    .catch(_err => {
		    	return resolve({
		    		success: false,
		    		msg: file.fileName + ' => 上传失败'
		    	})
		    })
    	})
    }

    const uploadFile = (tbh, Authorization, file) => {
    	return new Promise(async(resolve) => {
    		tryCount = 0
    		const preResult = await preUploadFile(tbh, Authorization, file)
    		console.log(preResult)
    		if (!preResult.success) {
    			return resolve(preResult)
    		}
    		tryCount = 0
    		const { uploadFilePreSignedUrl } = preResult.data
    		if (!uploadFilePreSignedUrl) {
    			return resolve({
    				success: false,
    				msg: file.fileName + ' => 上传失败,预上传出问题未返回对应文件上传地址'
    			})
    		}
    		const upResult = await doUploadFile(tbh, Authorization, file, uploadFilePreSignedUrl)
    		console.log(upResult)
    		return resolve({
    			...upResult,
    			info: preResult.data
    		})
    	})
    }

    const submitDataWithFileChange = async(msgStr, zzcl, wttbzsqsxdjfxtcl, submitData, Authorization, isDel = true) => {
    	const tkyjObj = {
			zzcl: zzcl.join(','),
			wttbzsqsxdjfxtcl: wttbzsqsxdjfxtcl.join(',')
		}
		const newSubmitData = { ...submitData }
		newSubmitData.tkyj = Object.assign({}, newSubmitData.tkyj, tkyjObj)
		console.log((isDel ? '文件删除' : '文件上传') + '后的新的提交 => ', newSubmitData)
		tryCount = 0
		const submitResult = await doSubmit(newSubmitData, Authorization)
		if (submitResult.success) {
			showRowRes(msgStr + (isDel ? ' 文件删除' : ' 文件上传') + '并保存成功')
		} else {
			showRowRes(msgStr + (isDel ? ' 文件删除' : ' 文件上传') + '记录保存失败')
		}
		return {
			...submitResult,
			submitData: newSubmitData
		}
    }

    const submitDataWithFileChange2 = async(msgStr, fileIdData, submitData, Authorization, isDel = true) => {
    	const tkyjObj = {}
    	for (let key in fileIdData) {
    		tkyjObj[key] = fileIdData[key].join(',') || ''
    	}
		const newSubmitData = { ...submitData }
		newSubmitData.tkyj = Object.assign({}, newSubmitData.tkyj, tkyjObj)
		console.log((isDel ? '文件删除' : '文件上传') + '后的新的提交 => ', newSubmitData)
		tryCount = 0
		const submitResult = await doSubmit(newSubmitData, Authorization)
		if (submitResult.success) {
			showRowRes(msgStr + (isDel ? ' 文件删除' : ' 文件上传') + '并保存成功')
		} else {
			showRowRes(msgStr + (isDel ? ' 文件删除' : ' 文件上传') + '记录保存失败')
		}
		return {
			...submitResult,
			submitData: newSubmitData
		}
    }


	// 定义格式化选项
	const formatterOptions = {
	  year: 'numeric',
	  month: '2-digit',
	  day: '2-digit',
	  hour: '2-digit',
	  minute: '2-digit',
	  second: '2-digit',
	  hour12: false // 使用24小时制
	}

	// 创建格式化器
	const formatter = new Intl.DateTimeFormat('zh-CN', formatterOptions) // 'zh-CN' 表示中文环境
    const getCurrentTime = () => {
		const now = new Date()
		return formatter.format(now).replace(/\//g, '-')
    }

    const hasKey = (obj, key) => {
		return Object.hasOwn(obj, key)
	}

    let waitCount = 0, waitMax = 15
    const fastMsg = '请求过快'
    const submitAll = async (files = []) => {
    	waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { submitList } = tbhRes
    	console.log('待提交数据  =>  ', submitList)
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	showRowRes('开始提交数据，请稍等...')
    	showRowRes('总数据： ' + submitList.length + ' 条', true)
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	let resList = []
    	for (let [index, sData] of submitList.entries()) {
    		let checkResult
    		if (isSingleObject(sData)) {
    			checkResult = checkZjdData(sData)
    		} else {
    			checkResult = checkData(parseResult.data)
    		}
    		if (!checkResult.pass) {
	    		showRowRes((index + 1) + '.' + checkResult.msg)
	    		resList.push({pass: false, index})
	    		continue
	    	}
	    	const { data, tbh } = checkResult.result
	    	let msgStr = '图斑编号：' + tbh
	    	if (hasKey(data.zjd, 'czb')) {
	    		if (Number(data.zjd.czb) < 0) {
	    			data.zjd.czb = 0
	    			showRowRes('czb 为负数，已修正为 0')
	    		}
	    	}
	    	if (hasKey(data.zjd, 'cbzmj')) {
	    		if (Number(data.zjd.cbzmj) < 0) {
	    			data.zjd.cbzmj = 0
	    			showRowRes('cbzmj 为负数，已修正为 0')
	    		}
	    	}
	    	if (hasKey(data.zjd, 'zyyjjbntmj')) {
	    		if (Number(data.zjd.zyyjjbntmj) <= 0) {
	    			data.zjd.zyyjjbntmj = '0'
	    			showRowRes('zyyjjbntmj 不是有效值，已修正为 字符串0 确保后续提交')
	    		}
	    	}
	    	tryCount = 0
	    	const submitResult = await submitSingleData(tbh, data, value)
	    	if (submitResult.relogin) {
	    		showRowRes((index + 1) + '.' + msgStr + ' 失败<br>' + submitResult.msg)
	    		return
	    	}
	    	if (submitResult.success) {
	    		showRowRes((index + 1) + '.' + msgStr + ' 成功<br>' + submitResult.msg)
	    		resList.push({pass: true, index, tbh})
	    	} else {
	    		showRowRes((index + 1) + '.' + msgStr + ' 失败<br>' + submitResult.msg)
	    		resList.push({pass: false, index, tbh})
	    		if (submitResult.msg.includes(fastMsg)) {
	    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
	    			return
	    		}
	    		if (files.length > 0) {
		    		showRowRes('对应文件请下次上传')
		    	}
	    		continue
	    	}

	    	// 对应文件上传
	    	if (files.length > 0) {
	    		const curResult = resList.find(item => item.tbh === tbh)
	    		const matchItem = files.find(item => item.tbh === tbh)
	    		if (matchItem) {
	    			console.log(matchItem)
	    			curResult.hasFile = true
	    			if (matchItem.images.length > 0) {
	    				curResult.all = matchItem.images.length
	    				curResult.finish = 0
	    				curResult.fail = 0
	    				curResult.save = false

	    				const olddata = submitResult.submitData.tkyj
	    				const ids_1 = (olddata.zzcl || '').split(',')
	    				const ids_2 = (olddata.wttbzsqsxdjfxtcl || '').split(',')
	    				const delIds = [].concat(ids_1, ids_2).filter(id => id)
	    				const idList_1 = [], idList_2 = []
	    				let submitFormData = submitResult.submitData
	    				console.log('delIds =>  ', delIds)
	    				if (delIds.length > 0) {
	    					showRowRes('---------- ' + msgStr + ' 旧文件开始删除')
	    					for (let delId of delIds) {
	    						tryCount = 0
	    						const delRes = await delFile(delId, value)
	    						if (delRes.relogin) {
						    		showRowRes(delRes.msg)
						    		return
						    	}
	    						showRowRes(delId + ' => ' + delRes.msg)
	    						if (!delRes.success) {
	    							if (ids_1.includes(delId)) idList_1.push(delId)
    								else if (ids_2.includes(delId)) idList_2.push(delId)

						    		if (delRes.msg.includes(fastMsg)) {
						    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
						    			return
						    		}
	    						}
	    						await sleepLmit()
	    					}
	    					// await sleep()
	    					const submitDelResult = await submitDataWithFileChange(msgStr, idList_1, idList_2, submitResult.submitData, value)
	    					if (submitDelResult.relogin) {
					    		showRowRes(submitDelResult.msg)
					    		return
					    	}
	    					submitFormData = submitDelResult.submitData
	    				}
	    				showRowRes('---------- ' + msgStr + ' 对应文件开始上传')
	    				const successList = []
	    				let num = 0
	    				for (let imgFile of matchItem.images) {
	    					console.log(imgFile)
	    					const uploadRes = await uploadFile(tbh, value, imgFile)
	    					if (uploadRes.relogin) {
					    		showRowRes(uploadRes.msg)
					    		return
					    	}
    						showRowRes(uploadRes.msg)
    						if (uploadRes.success) {
    							curResult.finish += 1
    							successList.push(uploadRes.info)
    						} else if (uploadRes.msg.includes(fastMsg)) {
    							curResult.fail += 1
				    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
				    			return
				    		} else {
    							curResult.fail += 1
				    		}
				    		num = num + 1
				    		if (num < matchItem.images.length) {
		    					await sleepUp()
		    				} else {
		    					await sleepLmit()
		    				}
	    				}
	    				console.log('successList =>', successList)
	    				if (successList.length === 0) {
	    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
	    					continue
	    				}
	    				showRowRes(msgStr + ' 文件数据记录开始保存')
	    				const uploadedFilesRes = await getUploadedFiles(tbh, value)
	    				if (uploadedFilesRes.relogin) {
				    		showRowRes(uploadedFilesRes.msg)
				    		return
				    	}
    					showRowRes(uploadedFilesRes.msg)
	    				if (!uploadedFilesRes.success) {
	    					if (uploadedFilesRes.msg.includes(fastMsg)) {
				    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
				    			return
				    		}
	    					continue
	    				}
	    				console.log(uploadedFilesRes)
	    				const { tkyj } = uploadedFilesRes
	    				let _listA = [], _listB = []
	    				for (let needItem of needImgList) {
	    					const needKey = needItem.key.split('_').pop()
	    					const keyVals = tkyj[needKey] || []
	    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
    						if (needKey === 'wttbzsqsxdjfxtcl') {
    							_listB = _listB.concat(matchSuccessList, keyVals.map(item => item.id))
    						} else {
    							_listA = _listA.concat(matchSuccessList, keyVals.map(item => item.id))
    						}
	    				}
	    				console.log(_listA, _listB)
	    				if (_listA.length === 0 && _listB.length === 0) {
	    					showRowRes(msgStr + ' 无文件记录保存')
	    					continue
	    				}
	    				// await sleep()
	    				const submitSaveResult = await submitDataWithFileChange(msgStr, _listA, _listB, submitFormData, value, false)
	    				if (submitSaveResult.relogin) {
				    		showRowRes(submitSaveResult.msg)
				    		return
				    	}
				    	if (submitSaveResult.success) {
				    		curResult.save = true
				    	}
	    			} else {
	    				showRowRes(msgStr + ' 无文件上传')
	    				curResult.hasFile = false
	    			}
	    		} else {
	    			curResult.hasFile = false
	    		}
	    	}

	    	waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	const failList = resList.filter(item => !item.pass)
    	showRowRes('所有数据提交执行完毕', true)
    	console.log(resList.length, failList.length)
    	showRowRes('成功数量：' + (resList.length - failList.length), true)
    	showRowRes('失败数量：' + failList.length, true)
    	if (failList.length > 0) {
    		const failStr = JSON.stringify(failList)
    		showRowRes(failStr)
    	}
    	if (files.length > 0) {
    		showRowRes('文件上传提交结果：')
    		const hasFileList = resList.filter(item => item.hasFile)
    		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
    		const saveFileList = hasFileList.filter(item => item.save)
    		showRowRes('上传保存的图斑数量：' + saveFileList.length)
    		const saveSomeList = saveFileList.filter(item => item.all !== item.finish)
    		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
    		if (saveSomeList.length > 0) {
    			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
    		}
    		const unSaveFileList = hasFileList.filter(item => !item.save)
    		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
    		if (unSaveFileList.length > 0) {
    			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
    		}
    	}
    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
    }

    const submitAll2 = async (files = []) => {
    	waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { submitList } = tbhRes
    	console.log('待提交数据  =>  ', submitList)
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	showRowRes('开始提交数据，请稍等...')
    	showRowRes('总数据： ' + submitList.length + ' 条', true)
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	let resList = []
    	for (let [index, sData] of submitList.entries()) {
    		let checkResult
    		if (isSingleObject(sData)) {
    			checkResult = checkZjdData(sData)
    		} else {
    			checkResult = checkData(parseResult.data)
    		}
    		if (!checkResult.pass) {
	    		showRowRes((index + 1) + '.' + checkResult.msg)
	    		resList.push({pass: false, index})
	    		continue
	    	}
	    	const { data, tbh } = checkResult.result
	    	let msgStr = '图斑编号：' + tbh
	    	if (hasKey(data.zjd, 'czb')) {
	    		if (Number(data.zjd.czb) < 0) {
	    			data.zjd.czb = 0
	    			showRowRes('czb 为负数，已修正为 0')
	    		}
	    	}
	    	if (hasKey(data.zjd, 'cbzmj')) {
	    		if (Number(data.zjd.cbzmj) < 0) {
	    			data.zjd.cbzmj = 0
	    			showRowRes('cbzmj 为负数，已修正为 0')
	    		}
	    	}
	    	if (hasKey(data.zjd, 'zyyjjbntmj')) {
	    		if (Number(data.zjd.zyyjjbntmj) <= 0) {
	    			data.zjd.zyyjjbntmj = '0'
	    			showRowRes('zyyjjbntmj 不是有效值，已修正为 字符串0 确保后续提交')
	    		}
	    	}
	    	tryCount = 0
	    	const submitResult = await submitSingleData(tbh, data, value)
	    	if (submitResult.relogin) {
	    		showRowRes((index + 1) + '.' + msgStr + ' 失败<br>' + submitResult.msg)
	    		return
	    	}
	    	if (submitResult.success) {
	    		showRowRes((index + 1) + '.' + msgStr + ' 成功<br>' + submitResult.msg)
	    		resList.push({pass: true, index, tbh})
	    	} else {
	    		showRowRes((index + 1) + '.' + msgStr + ' 失败<br>' + submitResult.msg)
	    		resList.push({pass: false, index, tbh})
	    		if (submitResult.msg.includes(fastMsg)) {
	    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
	    			return
	    		}
	    		if (files.length > 0) {
		    		showRowRes('对应文件请下次上传')
		    	}
	    		continue
	    	}

	    	// 对应文件上传
	    	if (files.length > 0) {
	    		const curResult = resList.find(item => item.tbh === tbh)
	    		const matchItem = files.find(item => item.tbh === tbh)
	    		if (matchItem) {
	    			console.log(matchItem)
	    			curResult.hasFile = true
	    			if (matchItem.images.length > 0) {
	    				curResult.all = matchItem.images.length
	    				curResult.finish = 0
	    				curResult.fail = 0
	    				curResult.save = false

	    				const olddata = preInfoRes.info.tkyj
	    				const delIdData = initFileSubmitIds(olddata)
	    				const delIds = getDelIds(delIdData)
	    				const failDelIdData = initFileSubmitIds()
	    				let submitFormData = preInfoRes.info
	    				console.log('delIds =>  ', delIds)
	    				if (delIds.length > 0) {
	    					showRowRes('---------- ' + msgStr + ' 旧文件开始删除')
	    					for (let delId of delIds) {
	    						tryCount = 0
	    						const delRes = await delFile(delId, value)
	    						if (delRes.relogin) {
						    		showRowRes(delRes.msg)
						    		return
						    	}
	    						showRowRes(delId + ' => ' + delRes.msg)
	    						if (!delRes.success) {
	    							for (let delKey in delIdData) {
	    								if (delIdData[delKey].includes(delId)) {
	    									failDelIdData[delKey].push(delId)
	    									break
	    								}
	    							}

						    		if (delRes.msg.includes(fastMsg)) {
						    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
						    			return
						    		}
	    						}
	    						await sleepLmit()
	    					}
	    					// await sleep()
	    					const submitDelResult = await submitDataWithFileChange2(msgStr, failDelIdData, submitFormData, value)
	    					if (submitDelResult.relogin) {
					    		showRowRes(submitDelResult.msg)
					    		return
					    	}
	    					submitFormData = submitDelResult.submitData
	    				} else {
	    					showRowRes('无文件需要清除')
	    				}
	    				showRowRes('---------- ' + msgStr + ' 对应文件开始上传')
	    				const successList = []
	    				let num = 0
	    				for (let imgFile of matchItem.images) {
	    					console.log(imgFile)
	    					const uploadRes = await uploadFile(tbh, value, imgFile)
	    					if (uploadRes.relogin) {
					    		showRowRes(uploadRes.msg)
					    		return
					    	}
							showRowRes(uploadRes.msg)
							if (uploadRes.success) {
								curResult.finish += 1
								successList.push(uploadRes.info)
							} else if (uploadRes.msg.includes(fastMsg)) {
								curResult.fail += 1
				    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
				    			return
				    		} else {
								curResult.fail += 1
				    		}
	    					num = num + 1
				    		if (num < matchItem.images.length) {
		    					await sleepUp()
		    				} else {
		    					await sleepLmit()
		    				}
	    				}
	    				console.log('successList =>', successList)
	    				if (successList.length === 0) {
	    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
	    					continue
	    				}
	    				showRowRes(msgStr + ' 文件数据记录开始保存')
	    				const uploadedFilesRes = await getUploadedFiles(tbh, value)
	    				if (uploadedFilesRes.relogin) {
				    		showRowRes(uploadedFilesRes.msg)
				    		return
				    	}
						showRowRes(uploadedFilesRes.msg)
	    				if (!uploadedFilesRes.success) {
	    					if (uploadedFilesRes.msg.includes(fastMsg)) {
				    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
				    			return
				    		}
	    					continue
	    				}
	    				console.log(uploadedFilesRes)
	    				const { tkyj } = uploadedFilesRes
	    				let uploadFileData = initFileSubmitIds()
	    				const fileKeyMap = getFileKeyMap()
	    				for (let needItem of needImgList) {
	    					const needKey = needItem.key.split('_').pop()
	    					const keyVals = tkyj[needKey] || []
	    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
	    					for (let key in fileKeyMap) {
	    						if (fileKeyMap[key].includes(needKey)) {
	    							uploadFileData[key] = uploadFileData[key].concat(matchSuccessList, keyVals.map(item => item.id))
	    						}
	    					}
	    				}
	    				console.log('uploadFileData => ', uploadFileData)
	    				if (!includeUpFile(uploadFileData)) {
	    					showRowRes(msgStr + ' 无文件记录保存')
	    					continue
	    				}
	    				// await sleep()
	    				const submitSaveResult = await submitDataWithFileChange2(msgStr, uploadFileData, submitFormData, value, false)
	    				if (submitSaveResult.relogin) {
				    		showRowRes(submitSaveResult.msg)
				    		return
				    	}
				    	if (submitSaveResult.success) {
				    		curResult.save = true
				    	}
	    			} else {
	    				showRowRes(msgStr + ' 无文件上传')
	    				curResult.hasFile = false
	    			}
	    		} else {
	    			curResult.hasFile = false
	    		}
	    	}

	    	waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	const failList = resList.filter(item => !item.pass)
    	showRowRes('所有数据提交执行完毕', true)
    	console.log(resList.length, failList.length)
    	showRowRes('成功数量：' + (resList.length - failList.length), true)
    	showRowRes('失败数量：' + failList.length, true)
    	if (failList.length > 0) {
    		const failStr = JSON.stringify(failList)
    		showRowRes(failStr)
    	}
    	if (files.length > 0) {
    		showRowRes('文件上传提交结果：')
    		const hasFileList = resList.filter(item => item.hasFile)
    		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
    		const saveFileList = hasFileList.filter(item => item.save)
    		showRowRes('上传保存的图斑数量：' + saveFileList.length)
    		const saveSomeList = saveFileList.filter(item => item.all !== item.finish)
    		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
    		if (saveSomeList.length > 0) {
    			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
    		}
    		const unSaveFileList = hasFileList.filter(item => !item.save)
    		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
    		if (unSaveFileList.length > 0) {
    			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
    		}
    	}
    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
    }

    submitBtn.addEventListener('click', async () => {
    	if (state.submiting) return
    	state.submiting = true
		showRes('')
    	showRowRes('图斑类型：' + getTblxName())
    	await submitAll()
    	state.submiting = false
    })

    // const matchReg = /^\d{6,12}[A-Z]\d{4,6}[-#][\u4e00-\u9fa5]{2,4}$/
    // const matchReg = /^\d{6,12}[A-Z]\d{4,6}(?:[-#][\u4e00-\u9fa5]{2,4})?$/
    // 增加匹配编号带-1等 附带编号捕获
    // const matchReg = /^(\d{6,12}[A-Z]\d{4,6}(?:-\d)?)(?:[-#][\u4e00-\u9fa5]{2,4})?$/
    // 增加匹配编号带-1, 增加人名后括号附加内容等 附带编号捕获
    const matchReg = /^(\d{6,12}[A-Z]\d{4,6}(?:-\d)?)(?:[-#][\u4e00-\u9fa5]{2,4}(?:\([^)]*\)|（[^）]*）)?)?$/
    const getImageExtensions = (lx = null) => {
    	lx = lx || tblx
    	if (lx === '1') {
			return ['.jpg', '.jpeg', '.png', '.bmp', '.pdf']
		}
		return ['.jpg', '.jpeg', '.png', '.bmp', '.pdf']
    }
    let imageExtensions = getImageExtensions()
	const getNeedImgList = (lx = null) => {
		lx = lx || tblx
		if (lx === '1') {
			return [
				{name: '主体类型证明', key: 'tc_zzcl'},
				{name: '户宅关系证明', key: 'hzzmcl'},
				{name: '问题图斑占地示意图', key: 'wttbzdsyt'},
				{name: '问题图斑占用耕地叠加分析图', key: 'wttbzdgdfxt'},
				{name: '问题图斑占用永久基本农田叠加分析图', key: 'wttbzyyjjbntdjfxt'},
				{name: '问题图斑占用特定区域叠加分析图', key: 'wttbzytsqydjfxt'},
				{name: '问题图斑占三区三线成果启用时地类叠加分析图', key: 'wttbzsqsxdjfxtcl'}
			]
		}
		if (lx === '2') {
			return [
				{name: '非住宅类房屋证明', key: 'fzzllzgdjtbjzcl'}
			]
		}
		if (lx === '3') {
			return [
				{name: '非乱占耕地图斑证明', key: 'flzgdtbjzcl'}
			]
		}
		if (lx === '4') {
			return [
				{name: '已整治完成图斑的举证材料', key: 'yzzwcjzcl'}
			]
		}
		if (lx === '5') {
			return [
				{name: '2013年1月1日（不含）前竣工或2020年7月3日（含）后开工图斑证明', key: 'jgjzcl'}
			]
		}
		if (lx === '6') {
			return [
				{name: '不在行政区划范围内图斑证明', key: 'bzfwntbjzcl'}
			]
		}
		return []
	}
    let needImgList = getNeedImgList()
	/**
	 * 图斑类型更改 - 切换对应文件匹配
	 */
	document.addEventListener('update-radio:tblx', function(e) {
		imageExtensions = getImageExtensions()
      	needImgList = getNeedImgList()
    })
    /**
     * 初始化文件对应id数组 - 有数据则旧数据的id数组
     */
    const initFileSubmitIds = (oldData = null) => {
    	if (tblx === '1') {
    		return {
    			zzcl: oldData ? (oldData.zzcl || '').split(',') : [],
    			wttbzsqsxdjfxtcl: oldData ? (oldData.wttbzsqsxdjfxtcl || '').split(',') : []
    		}
    	}
    	let obj = {}
    	for (let item of needImgList) {
    		const { key } = item
    		obj[key] = oldData ? (oldData[key] || '').split(',') : []
    	}
    	return obj
    }
    const initFileSubmitIdsWithLx = (lx, oldData = null) => {
    	if (lx === '1') {
    		return {
    			zzcl: oldData ? (oldData.zzcl || '').split(',') : [],
    			wttbzsqsxdjfxtcl: oldData ? (oldData.wttbzsqsxdjfxtcl || '').split(',') : []
    		}
    	}
    	let obj = {}
    	const needList = getNeedImgList(lx)
    	for (let item of needList) {
    		const { key } = item
    		obj[key] = oldData ? (oldData[key] || '').split(',') : []
    	}
    	return obj
    }
    const getDelIds = (delIdData) => {
		let list = []
		for (let key in delIdData) {
		   list = list.concat(delIdData[key] || [])
		}
		return list.filter(id => id)
    }
    /**
     * 获取各上传文件存储字段映射 - 主要考虑字段合并
     */
    const getFileKeyMap = (lx = null) => {
    	lx = lx || tblx
		if (lx === '1') {
		   return {
		        zzcl: ['zzcl', 'hzzmcl', 'wttbzdsyt', 'wttbzdgdfxt', 'wttbzyyjjbntdjfxt', 'wttbzytsqydjfxt'],
		        wttbzsqsxdjfxtcl: ['wttbzsqsxdjfxtcl']
		   }
		}
		let obj = {}
		const needList = getNeedImgList(lx)
		for (let item of needList) {
		   const { key } = item
		   obj[key] = [key]
		}
		return obj
    }
    /**
     * 判断是否存在保存的文件记录
     */
    const includeUpFile = (uploadFileData) => {
        for (let key in uploadFileData) {
            if (uploadFileData[key].length > 0) {
                return true
            }
        }
        return false
    }
    const searchMatchFolders = async (directoryHandle, depth = 0) => {
    	const results = []
        // const isTargetFolder = matchReg.test(directoryHandle.name)
        const matchFolder = directoryHandle.name.match(matchReg)
        if (matchFolder) {
        	let tbh = matchFolder[1]
        	/*if (directoryHandle.name.includes('-')) {
        		tbh = directoryHandle.name.split('-')[0]
        	} else if (directoryHandle.name.includes('#')) {
        		tbh = directoryHandle.name.split('#')[0]
        	} else {
        		tbh = directoryHandle.name
        	}*/
        	const imagesInThisFolder = []
        	for await (const [name, handle] of directoryHandle.entries()) {
                if (handle.kind === 'file') {
                    // 获取后缀名并转小写
                    const ext = '.' + name.split('.').pop().toLowerCase()

                    // 判断是否为图片
                    if (imageExtensions.includes(ext)) {
                    	const matchNeedImg = needImgList.find(item => handle.name.includes(item.name))
                    	if (matchNeedImg) {
	                        // 获取文件对象 (如果需要预览或读取内容)
	                        const file = await handle.getFile()
	                        imagesInThisFolder.push({
	                        	...matchNeedImg,
	                            fileName: handle.name,
	                            fileSize: file.size,
	                            fileObject: file,
	                            type: file.type
	                        })
	                    }
                    }
                }
            }
            results.push({
                tbh: tbh,
                name: directoryHandle.name,
                images: imagesInThisFolder
            })
        } else {
        	for await (const [name, handle] of directoryHandle.entries()) {
                if (handle.kind === 'directory') {
                    // 递归查找子目录
                    const subResults = await searchMatchFolders(handle, depth + 1)
                    // 合并结果
                    results.push(...subResults)
                }
            }
        }
        return results
    }

    const readDirectory = async () => {
    	try {
	        // 1. 请求目录访问权限 (这一步必须由用户点击触发，比如放在 button.onclick 里)
	        // 如果之前已经授权过，可以使用 window.showDirectoryPicker() 的选项跳过选择框
	        const startDirHandle = await window.showDirectoryPicker()

	        // 2. 开始递归搜索
	        const list = await searchMatchFolders(startDirHandle)

	        return {
	        	success: true,
	        	list
	        }
	    } catch (err) {
	        return {
	        	success: false
	        }
	    }
    }

    uploadBtn.addEventListener('click', async () => {
    	if (state.submiting) return
		state.submiting = true
		showRes('')
    	const matchRes = await readDirectory()
    	if (!matchRes.success) {
    		showRowRes('读取文件目录失败，请重试！')
    		state.submiting = false
    		return
    	}
    	if (matchRes.list.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	console.log(matchRes.list)
    	showRowRes('图斑类型：' + getTblxName())
    	if (tblx === "1") {
	    	await submitAll(matchRes.list)
	    } else {
	    	await submitAll2(matchRes.list)
	    }
    	state.submiting = false
    })

    const isString = (obj) => Object.prototype.toString.call(obj)=="[object String]"
    const isObject = (obj) => Object.prototype.toString.call(obj)=="[object Object]"

    getBhBtn.addEventListener('click', async () => {
    	if (state.submiting) return
		showRes('')
		const matchRes = await readDirectory()
    	if (!matchRes.success) {
    		showRowRes('读取文件目录失败，请重试！')
    		state.submiting = false
    		return
    	}
    	if (matchRes.list.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	const matchLxList = matchRes.list.filter(item => item.images.length > 0)
    	if (matchLxList.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	console.log(matchLxList)
    	const bhList = matchLxList.map(item => item.tbh)
    	showRowRes('图斑类型：' + getTblxName())
    	showRowRes('图斑编号：')
    	showRowRes(JSON.stringify(bhList, null, '\t'))
    	setInputValue(JSON.stringify(bhList, null, '\t'))
    })

    const submitClearFiles = async (files = []) => {
    	waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { tbhList } = tbhRes
    	console.log('待上传文件对应图斑  =>  ', tbhList)
    	if (tbhList.length === 0) {
    		showRes('未读到可用图斑编号')
    		return
    	}
    	showRowRes('读到输入的图斑编号如下：<br/>' + tbhList.join(','))
    	showRowRes('开始进行文件匹配上传======================================')
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	const resList = []
    	for (let [index, tbh] of tbhList.entries()) {
    		showRowRes((index + 1) + '. 图斑编号： ' + tbh + ' 开始操作************')
	    	let msgStr = '图斑编号：' + tbh
	    	const preInfoRes = await getPreInfo(tbh, value)
	    	if (preInfoRes.relogin) {
	    		showRowRes(preInfoRes.msg)
	    		resList.push({index, tbh})
	    		return
	    	}
    		showRowRes(preInfoRes.msg)
	    	if (!preInfoRes.success) {
	    		showRowRes('对应文件请下次上传')
	    		resList.push({index, tbh})
	    		continue
	    	}
    		resList.push({index, tbh})

    		const curResult = resList.find(item => item.tbh === tbh)
	    	const matchItem = files.find(item => item.tbh === tbh)
    		if (matchItem) {
    			curResult.hasFile = true
    			console.log(matchItem)
    			if (matchItem.images.length > 0) {
    				curResult.all = matchItem.images.length
    				curResult.finish = 0
    				curResult.fail = 0
    				curResult.save = false

    				const olddata = preInfoRes.info.tkyj
    				const ids_1 = (olddata.zzcl || '').split(',')
    				const ids_2 = (olddata.wttbzsqsxdjfxtcl || '').split(',')
    				const delIds = [].concat(ids_1, ids_2).filter(id => id)
    				const idList_1 = [], idList_2 = []
    				let submitFormData = preInfoRes.info
    				console.log('delIds =>  ', delIds)
    				if (delIds.length > 0) {
    					showRowRes('---------- ' + msgStr + ' 旧文件开始删除')
    					for (let delId of delIds) {
    						tryCount = 0
    						const delRes = await delFile(delId, value)
    						if (delRes.relogin) {
					    		showRowRes(delRes.msg)
					    		return
					    	}
    						showRowRes(delId + ' => ' + delRes.msg)
    						if (!delRes.success) {
    							if (ids_1.includes(delId)) idList_1.push(delId)
								else if (ids_2.includes(delId)) idList_2.push(delId)

					    		if (delRes.msg.includes(fastMsg)) {
					    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
					    			return
					    		}
    						}
    						await sleepLmit()
    					}
    					// await sleep()
    					const submitDelResult = await submitDataWithFileChange(msgStr, idList_1, idList_2, submitFormData, value)
    					if (submitDelResult.relogin) {
				    		showRowRes(submitDelResult.msg)
				    		return
				    	}
    					submitFormData = submitDelResult.submitData
    				}
    				showRowRes('---------- ' + msgStr + ' 对应文件开始上传')
    				const successList = []
    				let num = 0
    				for (let imgFile of matchItem.images) {
    					console.log(imgFile)
    					const uploadRes = await uploadFile(tbh, value, imgFile)
    					if (uploadRes.relogin) {
				    		showRowRes(uploadRes.msg)
				    		return
				    	}
						showRowRes(uploadRes.msg)
						if (uploadRes.success) {
							curResult.finish += 1
							successList.push(uploadRes.info)
						} else if (uploadRes.msg.includes(fastMsg)) {
							curResult.fail += 1
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		} else {
							curResult.fail += 1
			    		}
    					num = num + 1
			    		if (num < matchItem.images.length) {
	    					await sleepUp()
	    				} else {
	    					await sleepLmit()
	    				}
    				}
    				console.log('successList =>', successList)
    				if (successList.length === 0) {
    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
    					continue
    				}
    				showRowRes(msgStr + ' 文件数据记录开始保存')
    				const uploadedFilesRes = await getUploadedFiles(tbh, value)
    				if (uploadedFilesRes.relogin) {
			    		showRowRes(uploadedFilesRes.msg)
			    		return
			    	}
					showRowRes(uploadedFilesRes.msg)
    				if (!uploadedFilesRes.success) {
    					if (uploadedFilesRes.msg.includes(fastMsg)) {
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		}
    					continue
    				}
    				console.log(uploadedFilesRes)
    				const { tkyj } = uploadedFilesRes
    				let _listA = [], _listB = []
    				for (let needItem of needImgList) {
    					const needKey = needItem.key.split('_').pop()
    					const keyVals = tkyj[needKey] || []
    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
						if (needKey === 'wttbzsqsxdjfxtcl') {
							_listB = _listB.concat(matchSuccessList, keyVals.map(item => item.id))
						} else {
							_listA = _listA.concat(matchSuccessList, keyVals.map(item => item.id))
						}
    				}
    				console.log(_listA, _listB)
    				if (_listA.length === 0 && _listB.length === 0) {
    					showRowRes(msgStr + ' 无文件记录保存')
    					continue
    				}
    				// await sleep()
    				const submitSaveResult = await submitDataWithFileChange(msgStr, _listA, _listB, submitFormData, value, false)
    				if (submitSaveResult.relogin) {
			    		showRowRes(submitSaveResult.msg)
			    		return
			    	}
			    	if (submitSaveResult.success) {
			    		curResult.save = true
			    	}
    			} else {
    				showRowRes('未找到该图斑本地文件')
    				curResult.hasFile = false
    			}
    		} else {
    			showRowRes('未找到该图斑本地文件')
    			curResult.hasFile = false
    		}

    		waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	showRowRes('所有数据提交执行完毕', true)

    	showRowRes('文件上传提交结果：')
		const hasFileList = resList.filter(item => item.hasFile)
		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
		const saveFileList = hasFileList.filter(item => item.save)
		showRowRes('上传保存的图斑数量：' + saveFileList.length)
		const saveSomeList = saveFileList.filter(item => item.fail > 0)
		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
		if (saveSomeList.length > 0) {
			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
		}
		const unSaveFileList = hasFileList.filter(item => !item.save && item.finish > 0)
		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
		if (unSaveFileList.length > 0) {
			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
		}

    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
    }

    const submitClearFiles2 = async (files = []) => {
    	waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { tbhList } = tbhRes
    	console.log('待上传文件对应图斑  =>  ', tbhList)
    	if (tbhList.length === 0) {
    		showRes('未读到可用图斑编号')
    		return
    	}
    	showRowRes('读到输入的图斑编号如下：<br/>' + tbhList.join(','))
    	showRowRes('开始进行文件匹配上传======================================')
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	const resList = []
    	for (let [index, tbh] of tbhList.entries()) {
    		showRowRes((index + 1) + '. 图斑编号： ' + tbh + ' 开始操作************')
	    	let msgStr = '图斑编号：' + tbh
	    	const preInfoRes = await getPreInfo(tbh, value)
	    	if (preInfoRes.relogin) {
	    		showRowRes(preInfoRes.msg)
	    		resList.push({index, tbh})
	    		return
	    	}
    		showRowRes(preInfoRes.msg)
	    	if (!preInfoRes.success) {
	    		showRowRes('对应文件请下次上传')
	    		resList.push({index, tbh})
	    		continue
	    	}
    		resList.push({index, tbh})

    		const curResult = resList.find(item => item.tbh === tbh)
	    	const matchItem = files.find(item => item.tbh === tbh)
    		if (matchItem) {
    			curResult.hasFile = true
    			console.log(matchItem)
    			if (matchItem.images.length > 0) {
    				curResult.all = matchItem.images.length
    				curResult.finish = 0
    				curResult.fail = 0
    				curResult.save = false

    				const olddata = preInfoRes.info.tkyj
    				const delIdData = initFileSubmitIds(olddata)
    				const delIds = getDelIds(delIdData)
    				const failDelIdData = initFileSubmitIds()
    				let submitFormData = preInfoRes.info
    				console.log('delIds =>  ', delIds)
    				if (delIds.length > 0) {
    					showRowRes('---------- ' + msgStr + ' 旧文件开始删除')
    					for (let delId of delIds) {
    						tryCount = 0
    						const delRes = await delFile(delId, value)
    						if (delRes.relogin) {
					    		showRowRes(delRes.msg)
					    		return
					    	}
    						showRowRes(delId + ' => ' + delRes.msg)
    						if (!delRes.success) {
    							for (let delKey in delIdData) {
    								if (delIdData[delKey].includes(delId)) {
    									failDelIdData[delKey].push(delId)
    									break
    								}
    							}

					    		if (delRes.msg.includes(fastMsg)) {
					    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
					    			return
					    		}
    						}
    						await sleepLmit()
    					}
    					// await sleep()
    					const submitDelResult = await submitDataWithFileChange2(msgStr, failDelIdData, submitFormData, value)
    					if (submitDelResult.relogin) {
				    		showRowRes(submitDelResult.msg)
				    		return
				    	}
    					submitFormData = submitDelResult.submitData
    				} else {
    					showRowRes('无文件需要清除')
    				}
    				showRowRes('---------- ' + msgStr + ' 对应文件开始上传')
    				const successList = []
    				let num = 0
    				for (let imgFile of matchItem.images) {
    					console.log(imgFile)
    					const uploadRes = await uploadFile(tbh, value, imgFile)
    					if (uploadRes.relogin) {
				    		showRowRes(uploadRes.msg)
				    		return
				    	}
						showRowRes(uploadRes.msg)
						if (uploadRes.success) {
							curResult.finish += 1
							successList.push(uploadRes.info)
						} else if (uploadRes.msg.includes(fastMsg)) {
							curResult.fail += 1
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		} else {
							curResult.fail += 1
			    		}
    					num = num + 1
			    		if (num < matchItem.images.length) {
	    					await sleepUp()
	    				} else {
	    					await sleepLmit()
	    				}
    				}
    				console.log('successList =>', successList)
    				if (successList.length === 0) {
    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
    					continue
    				}
    				showRowRes(msgStr + ' 文件数据记录开始保存')
    				const uploadedFilesRes = await getUploadedFiles(tbh, value)
    				if (uploadedFilesRes.relogin) {
			    		showRowRes(uploadedFilesRes.msg)
			    		return
			    	}
					showRowRes(uploadedFilesRes.msg)
    				if (!uploadedFilesRes.success) {
    					if (uploadedFilesRes.msg.includes(fastMsg)) {
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		}
    					continue
    				}
    				console.log(uploadedFilesRes)
    				const { tkyj } = uploadedFilesRes
    				let uploadFileData = initFileSubmitIds()
    				const fileKeyMap = getFileKeyMap()
    				for (let needItem of needImgList) {
    					const needKey = needItem.key.split('_').pop()
    					const keyVals = tkyj[needKey] || []
    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
    					for (let key in fileKeyMap) {
    						if (fileKeyMap[key].includes(needKey)) {
    							uploadFileData[key] = uploadFileData[key].concat(matchSuccessList, keyVals.map(item => item.id))
    						}
    					}
    				}
    				console.log('uploadFileData => ', uploadFileData)
    				if (!includeUpFile(uploadFileData)) {
    					showRowRes(msgStr + ' 无文件记录保存')
    					continue
    				}
    				// await sleep()
    				const submitSaveResult = await submitDataWithFileChange2(msgStr, uploadFileData, submitFormData, value, false)
    				if (submitSaveResult.relogin) {
			    		showRowRes(submitSaveResult.msg)
			    		return
			    	}
			    	if (submitSaveResult.success) {
			    		curResult.save = true
			    	}
    			} else {
    				showRowRes('未找到该图斑本地文件')
    				curResult.hasFile = false
    			}
    		} else {
    			showRowRes('未找到该图斑本地文件')
    			curResult.hasFile = false
    		}

    		waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	showRowRes('所有数据提交执行完毕', true)

    	showRowRes('文件上传提交结果：')
		const hasFileList = resList.filter(item => item.hasFile)
		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
		const saveFileList = hasFileList.filter(item => item.save)
		showRowRes('上传保存的图斑数量：' + saveFileList.length)
		const saveSomeList = saveFileList.filter(item => item.fail > 0)
		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
		if (saveSomeList.length > 0) {
			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
		}
		const unSaveFileList = hasFileList.filter(item => !item.save && item.finish > 0)
		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
		if (unSaveFileList.length > 0) {
			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
		}

    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
    }

    uploadClearBtn.addEventListener('click', async () => {
    	if (state.submiting) return
		state.submiting = true
		showRes('')
    	const matchRes = await readDirectory()
    	if (!matchRes.success) {
    		showRowRes('读取文件目录失败，请重试！')
    		state.submiting = false
    		return
    	}
    	if (matchRes.list.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	console.log(matchRes.list)
    	showRowRes('图斑类型：' + getTblxName())
    	if (tblx === "1") {
	    	await submitClearFiles(matchRes.list)
	    } else {
	    	await submitClearFiles2(matchRes.list)
	    }
    	state.submiting = false
    })

    const initPreMapFiles = (oldData) => {
		let obj = {}
		for (let item of needImgList) {
			const { key } = item
			const field = key.split('_').pop()
			obj[key] = (oldData?.[field] || []).map(dataItem => dataItem.id)
		}
		return obj
	}

    const submitSomeClearFiles = async (files) => {
		waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { tbhList } = tbhRes
    	console.log('待上传文件对应图斑  =>  ', tbhList)
    	if (tbhList.length === 0) {
    		showRes('未读到可用图斑编号')
    		return
    	}
    	showRowRes('读到输入的图斑编号如下：<br/>' + tbhList.join(','))
    	showRowRes('开始进行文件匹配上传======================================')
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	const resList = []
    	for (let [index, tbh] of tbhList.entries()) {
    		showRowRes((index + 1) + '. 图斑编号： ' + tbh + ' 开始操作************')
	    	let msgStr = '图斑编号：' + tbh
    		resList.push({index, tbh})

    		const curResult = resList.find(item => item.tbh === tbh)
	    	const matchItem = files.find(item => item.tbh === tbh)
    		if (matchItem) {
    			curResult.hasFile = true
    			console.log(matchItem)
    			if (matchItem.images.length > 0) {
    				curResult.all = matchItem.images.length
    				curResult.finish = 0
    				curResult.fail = 0
    				curResult.save = false

    				const preInfoRes = await getPreInfo(tbh, value)
			    	if (preInfoRes.relogin) {
			    		showRowRes(preInfoRes.msg)
			    		return
			    	}
		    		showRowRes(preInfoRes.msg)
			    	if (!preInfoRes.success) {
			    		showRowRes('对应文件请下次上传')
			    		continue
			    	}

			    	const preUploadedFilesRes = await getUploadedFiles(tbh, value)
    				if (preUploadedFilesRes.relogin) {
			    		showRowRes(preUploadedFilesRes.msg)
			    		return
			    	}
					showRowRes(preUploadedFilesRes.msg)
					if (!preUploadedFilesRes.success) {
    					if (preUploadedFilesRes.msg.includes(fastMsg)) {
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		}
    					continue
    				}
					console.log('preUploadedFilesRes => ', preUploadedFilesRes)
    				const preMapFileInfo = initPreMapFiles(preUploadedFilesRes.tkyj)
    				console.log('preMapFileInfo => ', preMapFileInfo)

    				const olddata = preInfoRes.info.tkyj
    				const delIdData = initFileSubmitIds(olddata)
    				const allFileIds = getDelIds(delIdData)
    				let submitFormData = preInfoRes.info
    				console.log('allFileIds =>  ', allFileIds)

    				const delFileKeys = [ ...new Set(matchItem.images.map(imgItem => imgItem.key)) ]
    				console.log('delFileKeys => ', delFileKeys)
    				for (const delKey of delFileKeys) {
    					let delKeyIds = Object.assign([], preMapFileInfo[delKey] || [])
    					const delTypeName = needImgList.find(_item => _item.key === delKey)?.name
    					if (delKeyIds.length > 0) {
    						showRowRes(delTypeName + ' => 旧文件开始删除')
    						for (let delId of delKeyIds) {
	    						tryCount = 0
	    						const delRes = await delFile(delId, value)
	    						if (delRes.relogin) {
						    		showRowRes(delRes.msg)
						    		return
						    	}
	    						showRowRes(delId + ' => ' + delRes.msg)
	    						if (!delRes.success) {
						    		if (delRes.msg.includes(fastMsg)) {
						    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
						    			return
						    		}
	    						} else {
    								preMapFileInfo[delKey] = preMapFileInfo[delKey].filter(_item => _item !== delId)
	    						}
	    						preMapFileInfo[delKey] = preMapFileInfo[delKey].filter(_item => _item !== delId)
	    						await sleepLmit()
	    					}
    					} else {
    						showRowRes(delTypeName + ' => 无文件需要删除')
    					}
    				}

    				showRowRes('---------- ' + msgStr + ' 对应文件开始上传')
    				const successList = []
    				let num = 0
    				for (let imgFile of matchItem.images) {
    					console.log('uploadImgFile => ', imgFile)
    					const uploadRes = await uploadFile(tbh, value, imgFile)
    					if (uploadRes.relogin) {
				    		showRowRes(uploadRes.msg)
				    		return
				    	}
						showRowRes(uploadRes.msg)
						if (uploadRes.success) {
							curResult.finish += 1
							successList.push(uploadRes.info)
						} else if (uploadRes.msg.includes(fastMsg)) {
							curResult.fail += 1
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		} else {
							curResult.fail += 1
			    		}
    					num = num + 1
			    		if (num < matchItem.images.length) {
	    					await sleepUp()
	    				} else {
	    					await sleepLmit()
	    				}
    				}
    				console.log('successList =>', successList)
    				if (successList.length === 0) {
    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
    					continue
    				}
    				showRowRes(msgStr + ' 文件数据记录开始保存')

    				let uploadFileData = initFileSubmitIds()
    				const fileKeyMap = getFileKeyMap()
    				for (let needItem of needImgList) {
    					const needKey = needItem.key.split('_').pop()
    					const keyVals = preMapFileInfo[needItem.key] || []
    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
    					for (let key in fileKeyMap) {
    						if (fileKeyMap[key].includes(needKey)) {
    							uploadFileData[key] = uploadFileData[key].concat(matchSuccessList, keyVals)
    						}
    					}
    				}
    				console.log('uploadFileData => ', uploadFileData)
    				if (!includeUpFile(uploadFileData)) {
    					showRowRes(msgStr + ' 无文件记录保存')
    					continue
    				}
    				// await sleep()
    				const submitSaveResult = await submitDataWithFileChange2(msgStr, uploadFileData, submitFormData, value, false)
    				if (submitSaveResult.relogin) {
			    		showRowRes(submitSaveResult.msg)
			    		return
			    	}
			    	if (submitSaveResult.success) {
			    		curResult.save = true
			    	}
    			} else {
    				showRowRes('未找到该图斑本地文件')
    				curResult.hasFile = false
    			}
    		} else {
    			showRowRes('未找到该图斑本地文件')
    			curResult.hasFile = false
    		}

    		waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	showRowRes('所有数据提交执行完毕', true)

    	showRowRes('文件上传提交结果：')
    	console.log('resList => ', resList)
		const hasFileList = resList.filter(item => item.hasFile)
		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
		const saveFileList = hasFileList.filter(item => item.save)
		showRowRes('上传保存的图斑数量：' + saveFileList.length)
		const saveSomeList = saveFileList.filter(item => item.fail > 0)
		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
		if (saveSomeList.length > 0) {
			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
		}
		const unSaveFileList = hasFileList.filter(item => !item.save && item.finish > 0)
		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
		if (unSaveFileList.length > 0) {
			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
		}
		const unSaveList = hasFileList.filter(item => !item.save && item.finish == 0)
		showRowRes('未执行中断的图斑数量：' + unSaveList.length)
		if (unSaveList.length > 0) {
			showRowRes(JSON.stringify(unSaveList.map(item => item.tbh)))
		}

    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
	}

    uploadSomeClearBtn.addEventListener('click', async () => {
    	if (state.submiting) return
		state.submiting = true
		showRes('')
    	const matchRes = await readDirectory()
    	if (!matchRes.success) {
    		showRowRes('读取文件目录失败，请重试！')
    		state.submiting = false
    		return
    	}
    	if (matchRes.list.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	console.log(matchRes.list)
    	showRowRes('图斑类型：' + getTblxName())
    	await submitSomeClearFiles(matchRes.list)
    	state.submiting = false
    })

    const submitFiles = async (files) => {
    	waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { tbhList } = tbhRes
    	console.log('待上传文件对应图斑  =>  ', tbhList)
    	if (tbhList.length === 0) {
    		showRes('未读到可用图斑编号')
    		return
    	}
    	showRowRes('读到输入的图斑编号如下：<br/>' + tbhList.join(','))
    	showRowRes('开始进行文件匹配上传======================================')
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	const resList = []
    	for (let [index, tbh] of tbhList.entries()) {
    		showRowRes((index + 1) + '. 图斑编号： ' + tbh + ' 开始操作************')
	    	let msgStr = '图斑编号：' + tbh
	    	const preInfoRes = await getPreInfo(tbh, value)
	    	if (preInfoRes.relogin) {
	    		showRowRes(preInfoRes.msg)
	    		resList.push({index, tbh})
	    		return
	    	}
    		showRowRes(preInfoRes.msg)
	    	if (!preInfoRes.success) {
	    		showRowRes('对应文件请下次上传')
	    		resList.push({index, tbh})
	    		continue
	    	}
    		resList.push({index, tbh})

    		const curResult = resList.find(item => item.tbh === tbh)
	    	const matchItem = files.find(item => item.tbh === tbh)
    		if (matchItem) {
    			curResult.hasFile = true
    			console.log(matchItem)
    			if (matchItem.images.length > 0) {
    				curResult.all = matchItem.images.length
    				curResult.jump = 0
    				curResult.finish = 0
    				curResult.fail = 0
    				curResult.save = false

    				const uploadedFilesRes = await getUploadedFiles(tbh, value)
    				if (uploadedFilesRes.relogin) {
			    		showRowRes(uploadedFilesRes.msg)
			    		return
			    	}
					showRowRes(uploadedFilesRes.msg)
					if (!uploadedFilesRes.success) {
    					if (uploadedFilesRes.msg.includes(fastMsg)) {
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		}
    					continue
    				}
					console.log('uploadedFilesRes => ', uploadedFilesRes)
					const { tkyj } = uploadedFilesRes
					const successList = []
					let num = 0
					for (let imgFile of matchItem.images) {
    					console.log(imgFile)
    					const field = imgFile.key.split('_').pop()
    					const fieldVals = tkyj[field] || []
    					console.log('fieldVals => ', fieldVals, imgFile)
    					if (fieldVals.length > 0) {
    						// 校验是否已上传,通过文件大小比对
    						const matchOldFile = fieldVals.find(item => item.size === imgFile.fileSize)
    						if (matchOldFile) {
    							showRowRes(imgFile.fileName + ' => 已上传过，跳过该文件')
    							curResult.jump += 1
    							continue
    						}
    					}
    					const uploadRes = await uploadFile(tbh, value, imgFile)
    					if (uploadRes.relogin) {
				    		showRowRes(uploadRes.msg)
				    		return
				    	}
						showRowRes(uploadRes.msg)
						if (uploadRes.success) {
							curResult.finish += 1
							successList.push(uploadRes.info)
						} else if (uploadRes.msg.includes(fastMsg)) {
							curResult.fail += 1
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		} else {
							curResult.fail += 1
			    		}
    					num = num + 1
			    		if (num < matchItem.images.length) {
	    					await sleepUp()
	    				} else {
	    					await sleepLmit()
	    				}
    				}
    				console.log('successList =>', successList)
    				if (successList.length === 0) {
    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
    					continue
    				}
    				showRowRes(msgStr + ' 文件数据记录开始保存')
					let _listA = [], _listB = []
					for (let needItem of needImgList) {
    					const needKey = needItem.key.split('_').pop()
    					const keyVals = tkyj[needKey] || []
    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
						if (needKey === 'wttbzsqsxdjfxtcl') {
							_listB = _listB.concat(matchSuccessList, keyVals.map(item => item.id))
						} else {
							_listA = _listA.concat(matchSuccessList, keyVals.map(item => item.id))
						}
    				}
    				console.log(_listA, _listB)
    				if (_listA.length === 0 && _listB.length === 0) {
    					showRowRes(msgStr + ' 无文件记录保存')
    					continue
    				}
    				// await sleep()
    				const preSubmitData = preInfoRes.info
    				const submitSaveResult = await submitDataWithFileChange(msgStr, _listA, _listB, preSubmitData, value, false)
    				if (submitSaveResult.relogin) {
			    		showRowRes(submitSaveResult.msg)
			    		return
			    	}
			    	if (submitSaveResult.success) {
			    		curResult.save = true
			    	}
    			} else {
    				showRowRes('未找到该图斑本地文件')
    			}
    		} else {
    			showRowRes('未找到该图斑本地文件')
    			curResult.hasFile = false
    		}

    		waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	showRowRes('所有数据提交执行完毕', true)

    	showRowRes('文件上传提交结果：')
		const hasFileList = resList.filter(item => item.hasFile)
		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
		const saveFileList = hasFileList.filter(item => item.save)
		showRowRes('上传保存的图斑数量：' + saveFileList.length)
		const saveSomeList = saveFileList.filter(item => item.fail > 0)
		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
		if (saveSomeList.length > 0) {
			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
		}
		const unSaveFileList = hasFileList.filter(item => !item.save && item.finish > 0)
		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
		if (unSaveFileList.length > 0) {
			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
		}

    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
    }

    const submitFiles2 = async (files) => {
    	waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { tbhList } = tbhRes
    	console.log('待上传文件对应图斑  =>  ', tbhList)
    	if (tbhList.length === 0) {
    		showRes('未读到可用图斑编号')
    		return
    	}
    	showRowRes('读到输入的图斑编号如下：<br/>' + tbhList.join(','))
    	showRowRes('开始进行文件匹配上传======================================')
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	const resList = []
    	for (let [index, tbh] of tbhList.entries()) {
    		showRowRes((index + 1) + '. 图斑编号： ' + tbh + ' 开始操作************')
	    	let msgStr = '图斑编号：' + tbh
	    	const preInfoRes = await getPreInfo(tbh, value)
	    	if (preInfoRes.relogin) {
	    		showRowRes(preInfoRes.msg)
	    		resList.push({index, tbh})
	    		return
	    	}
    		showRowRes(preInfoRes.msg)
	    	if (!preInfoRes.success) {
	    		showRowRes('对应文件请下次上传')
	    		resList.push({index, tbh})
	    		continue
	    	}
    		resList.push({index, tbh})

    		const curResult = resList.find(item => item.tbh === tbh)
	    	const matchItem = files.find(item => item.tbh === tbh)
    		if (matchItem) {
    			curResult.hasFile = true
    			console.log(matchItem)
    			if (matchItem.images.length > 0) {
    				curResult.all = matchItem.images.length
    				curResult.jump = 0
    				curResult.finish = 0
    				curResult.fail = 0
    				curResult.save = false

    				const uploadedFilesRes = await getUploadedFiles(tbh, value)
    				if (uploadedFilesRes.relogin) {
			    		showRowRes(uploadedFilesRes.msg)
			    		return
			    	}
					showRowRes(uploadedFilesRes.msg)
					if (!uploadedFilesRes.success) {
    					if (uploadedFilesRes.msg.includes(fastMsg)) {
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		}
    					continue
    				}
					console.log('uploadedFilesRes => ', uploadedFilesRes)
					const { tkyj } = uploadedFilesRes
					const successList = []
					let num = 0
					for (let imgFile of matchItem.images) {
    					console.log(imgFile)
    					const field = imgFile.key.split('_').pop()
    					const fieldVals = tkyj[field] || []
    					console.log('fieldVals => ', fieldVals, imgFile)
    					if (fieldVals.length > 0) {
    						// 校验是否已上传,通过文件大小比对
    						const matchOldFile = fieldVals.find(item => item.size === imgFile.fileSize)
    						if (matchOldFile) {
    							showRowRes(imgFile.fileName + ' => 已上传过，跳过该文件')
    							curResult.jump += 1
    							continue
    						}
    					}
    					const uploadRes = await uploadFile(tbh, value, imgFile)
    					if (uploadRes.relogin) {
				    		showRowRes(uploadRes.msg)
				    		return
				    	}
						showRowRes(uploadRes.msg)
						if (uploadRes.success) {
							curResult.finish += 1
							successList.push(uploadRes.info)
						} else if (uploadRes.msg.includes(fastMsg)) {
							curResult.fail += 1
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		} else {
							curResult.fail += 1
			    		}
    					num = num + 1
			    		if (num < matchItem.images.length) {
	    					await sleepUp()
	    				} else {
	    					await sleepLmit()
	    				}
    				}
    				console.log('successList =>', successList)
    				if (successList.length === 0) {
    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
    					continue
    				}
    				showRowRes(msgStr + ' 文件数据记录开始保存')
    				let uploadFileData = initFileSubmitIds()
    				const fileKeyMap = getFileKeyMap()
    				for (let needItem of needImgList) {
    					const needKey = needItem.key.split('_').pop()
    					const keyVals = tkyj[needKey] || []
    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
    					for (let key in fileKeyMap) {
    						if (fileKeyMap[key].includes(needKey)) {
    							uploadFileData[key] = uploadFileData[key].concat(matchSuccessList, keyVals.map(item => item.id))
    						}
    					}
    				}
    				console.log('uploadFileData => ', uploadFileData)
    				if (!includeUpFile(uploadFileData)) {
    					showRowRes(msgStr + ' 无文件记录保存')
    					continue
    				}
    				// await sleep()
    				const preSubmitData = preInfoRes.info
    				const submitSaveResult = await submitDataWithFileChange2(msgStr, uploadFileData, preSubmitData, value, false)
    				if (submitSaveResult.relogin) {
			    		showRowRes(submitSaveResult.msg)
			    		return
			    	}
			    	if (submitSaveResult.success) {
			    		curResult.save = true
			    	}
    			} else {
    				showRowRes('未找到该图斑本地文件')
    				curResult.hasFile = false
    			}
    		} else {
    			showRowRes('未找到该图斑本地文件')
    			curResult.hasFile = false
    		}

    		waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	showRowRes('所有数据提交执行完毕', true)

    	showRowRes('文件上传提交结果：')
		const hasFileList = resList.filter(item => item.hasFile)
		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
		const saveFileList = hasFileList.filter(item => item.save)
		showRowRes('上传保存的图斑数量：' + saveFileList.length)
		const saveSomeList = saveFileList.filter(item => item.fail > 0)
		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
		if (saveSomeList.length > 0) {
			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
		}
		const unSaveFileList = hasFileList.filter(item => !item.save && item.finish > 0)
		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
		if (unSaveFileList.length > 0) {
			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
		}

    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
    }

    // 文件补传 - 不删除，校验未上传文件上传
    addBtn.addEventListener('click', async () => {
    	if (state.submiting) return
		state.submiting = true
		showRes('')
    	const matchRes = await readDirectory()
    	if (!matchRes.success) {
    		showRowRes('读取文件目录失败，请重试！')
    		state.submiting = false
    		return
    	}
    	if (matchRes.list.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	console.log(matchRes.list)
    	showRowRes('图斑类型：' + getTblxName())
    	if (tblx === "1") {
	    	await submitFiles(matchRes.list)
	    } else {
	    	await submitFiles2(matchRes.list)
	    }
    	state.submiting = false
    })

    /**
     * 根据选择的上传方式进行上传
     * @param  {[type]}  files [description]  待上传文件
     * @param  {Boolean} clear [description]  是否清除旧文件重新上传
     * @param  {Boolean} check [description]  是否校验是已上传文件
     * @return {[type]}        [description]
     */
    const submitFileByUpType = async (files, clear = true, check = false) => {
		waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { tbhList } = tbhRes
    	console.log('待上传文件对应图斑  =>  ', tbhList)
    	if (tbhList.length === 0) {
    		showRes('未读到可用图斑编号')
    		return
    	}
    	showRowRes('读到输入的图斑编号如下：<br/>' + tbhList.join(','))
    	showRowRes('开始进行文件匹配上传======================================')
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	const resList = []
    	for (let [index, tbh] of tbhList.entries()) {
    		showRowRes((index + 1) + '. 图斑编号： ' + tbh + ' 开始操作************')
	    	let msgStr = '图斑编号：' + tbh
	    	const preInfoRes = await getPreInfo(tbh, value)
	    	if (preInfoRes.relogin) {
	    		showRowRes(preInfoRes.msg)
	    		resList.push({index, tbh})
	    		return
	    	}
    		showRowRes(preInfoRes.msg)
	    	if (!preInfoRes.success) {
	    		showRowRes('对应文件请下次上传')
	    		resList.push({index, tbh})
	    		continue
	    	}
    		resList.push({index, tbh})

    		const curResult = resList.find(item => item.tbh === tbh)
	    	const matchItem = files.find(item => item.tbh === tbh)
    		if (matchItem) {
    			curResult.hasFile = true
    			console.log(matchItem)
    			if (matchItem.images.length > 0) {
    				curResult.all = matchItem.images.length
    				curResult.jump = 0
    				curResult.finish = 0
    				curResult.fail = 0
    				curResult.save = false

    				let submitFormData = preInfoRes.info

    				if (clear) {
    					showRowRes(`执行清除任务---start`)
    					const upFileds = [...new Set(matchItem.images.map(item => item.key.split('_').pop()))]
    					const oldUploadedFilesRes = await getUploadedFiles(tbh, value)
	    				if (oldUploadedFilesRes.relogin) {
				    		showRowRes(oldUploadedFilesRes.msg)
				    		return
				    	}
				    	showRowRes(oldUploadedFilesRes.msg)
						if (!oldUploadedFilesRes.success) {
	    					if (oldUploadedFilesRes.msg.includes(fastMsg)) {
				    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
				    			return
				    		}
	    					continue
	    				}
	    				const oldTkyj = oldUploadedFilesRes.tkyj
	    				let delIds = []
	    				for (let upField of upFileds) {
	    					if (oldTkyj && oldTkyj[upField]?.length > 0) {
	    						const ids = oldTkyj[upField].map(item => item.id)
	    						delIds = delIds.concat(ids)
	    					}
	    				}
	    				console.log('delIds =>  ', delIds)
    					if (delIds.length > 0) {
    						const olddata = preInfoRes.info.tkyj
		    				const delIdData = initFileSubmitIds(olddata)
		    				const failDelIdData = initFileSubmitIds()
		    				showRowRes(`执行清除任务---end`)

		    				showRowRes('---------- ' + msgStr + ' 旧文件开始删除')
	    					for (let delId of delIds) {
	    						tryCount = 0
	    						const delRes = await delFile(delId, value)
	    						if (delRes.relogin) {
						    		showRowRes(delRes.msg)
						    		return
						    	}
	    						showRowRes(delId + ' => ' + delRes.msg)
	    						if (!delRes.success) {
	    							for (let delKey in delIdData) {
	    								if (delIdData[delKey].includes(delId)) {
	    									failDelIdData[delKey].push(delId)
	    									break
	    								}
	    							}

						    		if (delRes.msg.includes(fastMsg)) {
						    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
						    			return
						    		}
	    						}
	    						await sleepLmit()
	    					}
	    					// await sleep()
	    					const submitDelResult = await submitDataWithFileChange2(msgStr, failDelIdData, submitFormData, value)
	    					if (submitDelResult.relogin) {
					    		showRowRes(submitDelResult.msg)
					    		return
					    	}
	    					submitFormData = submitDelResult.submitData
    					} else {
	    					showRowRes('无文件需要清除')
	    				}
    				}

    				const uploadedFilesRes = await getUploadedFiles(tbh, value)
    				if (uploadedFilesRes.relogin) {
			    		showRowRes(uploadedFilesRes.msg)
			    		return
			    	}
					showRowRes(uploadedFilesRes.msg)
					if (!uploadedFilesRes.success) {
    					if (uploadedFilesRes.msg.includes(fastMsg)) {
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		}
    					continue
    				}
					console.log('uploadedFilesRes => ', uploadedFilesRes)
					const { tkyj } = uploadedFilesRes
					const successList = []
					let num = 0
					for (let imgFile of matchItem.images) {
    					console.log(imgFile)
    					const field = imgFile.key.split('_').pop()
    					const fieldVals = tkyj[field] || []
    					console.log('fieldVals => ', fieldVals, imgFile)
    					if (fieldVals.length > 0 && !clear && check) {
    						// 校验是否已上传,通过文件大小比对
    						const matchOldFile = fieldVals.find(item => item.size === imgFile.fileSize)
    						if (matchOldFile) {
    							showRowRes(imgFile.fileName + ' => 已上传过，跳过该文件')
    							curResult.jump += 1
    							continue
    						}
    					}
    					const uploadRes = await uploadFile(tbh, value, imgFile)
    					if (uploadRes.relogin) {
				    		showRowRes(uploadRes.msg)
				    		return
				    	}
						showRowRes(uploadRes.msg)
						if (uploadRes.success) {
							curResult.finish += 1
							successList.push(uploadRes.info)
						} else if (uploadRes.msg.includes(fastMsg)) {
							curResult.fail += 1
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		} else {
							curResult.fail += 1
			    		}
    					num = num + 1
			    		if (num < matchItem.images.length) {
	    					await sleepUp()
	    				} else {
	    					await sleepLmit()
	    				}
    				}
    				console.log('successList =>', successList)
    				if (successList.length === 0) {
    					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
    					continue
    				}
    				showRowRes(msgStr + ' 文件数据记录开始保存')
    				let uploadFileData = initFileSubmitIds()
    				const fileKeyMap = getFileKeyMap()
    				for (let needItem of needImgList) {
    					const needKey = needItem.key.split('_').pop()
    					const keyVals = tkyj[needKey] || []
    					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
    					for (let key in fileKeyMap) {
    						if (fileKeyMap[key].includes(needKey)) {
    							uploadFileData[key] = uploadFileData[key].concat(matchSuccessList, keyVals.map(item => item.id))
    						}
    					}
    				}
    				console.log('uploadFileData => ', uploadFileData)
    				if (!includeUpFile(uploadFileData)) {
    					showRowRes(msgStr + ' 无文件记录保存')
    					continue
    				}
    				// await sleep()
    				const preSubmitData = preInfoRes.info
    				const submitSaveResult = await submitDataWithFileChange2(msgStr, uploadFileData, preSubmitData, value, false)
    				if (submitSaveResult.relogin) {
			    		showRowRes(submitSaveResult.msg)
			    		return
			    	}
			    	if (submitSaveResult.success) {
			    		curResult.save = true
			    	}
    			} else {
    				showRowRes('未找到该图斑本地文件')
    				curResult.hasFile = false
    			}
    		} else {
    			showRowRes('未找到该图斑本地文件')
    			curResult.hasFile = false
    		}

    		waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	showRowRes('所有数据提交执行完毕', true)

    	showRowRes('文件上传提交结果：')
		const hasFileList = resList.filter(item => item.hasFile)
		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
		const saveFileList = hasFileList.filter(item => item.save)
		showRowRes('上传保存的图斑数量：' + saveFileList.length)
		const saveSomeList = saveFileList.filter(item => item.fail > 0)
		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
		if (saveSomeList.length > 0) {
			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
		}
		const unSaveFileList = hasFileList.filter(item => !item.save && item.finish > 0)
		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
		if (unSaveFileList.length > 0) {
			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
		}

    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
	}

    // 根据选择进行文件上传
    upByTypeBtn.addEventListener('click', async () => {
    	if (state.submiting) return
		state.submiting = true
		showRes('')
    	const matchRes = await readDirectory()
    	if (!matchRes.success) {
    		showRowRes('读取文件目录失败，请重试！')
    		state.submiting = false
    		return
    	}
    	if (matchRes.list.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	console.log(matchRes.list)
    	showRowRes('图斑类型：' + getTblxName())
    	showRowRes(getUpTypeName())
    	if (upType === 1) {
    		await submitFileByUpType(matchRes.list)
    	} else if (upType === 2) {
    		await submitFileByUpType(matchRes.list, false, true)
    	} else if (upType === 3) {
    		await submitFileByUpType(matchRes.list, false, false)
    	}
    	state.submiting = false
    })

    const searchAutoMatchFolders = async (directoryHandle, depth = 0) => {
    	const results = []
        // const isTargetFolder = matchReg.test(directoryHandle.name)
        const matchFolder = directoryHandle.name.match(matchReg)
        if (matchFolder) {
        	let tbh = matchFolder[1]
        	/*if (directoryHandle.name.includes('-')) {
        		tbh = directoryHandle.name.split('-')[0]
        	} else if (directoryHandle.name.includes('#')) {
        		tbh = directoryHandle.name.split('#')[0]
        	} else {
        		tbh = directoryHandle.name
        	}*/
        	const tbhInfo = getTaskIdInfo(tbh)
        	if (!tbhInfo) {
        		return []
        	}
        	const imagesInThisFolder = []
            const matchExts = getImageExtensions(tbhInfo.tblx)
        	const needList = getNeedImgList(tbhInfo.tblx)
        	for await (const [name, handle] of directoryHandle.entries()) {
                if (handle.kind === 'file') {
                    // 获取后缀名并转小写
                    const ext = '.' + name.split('.').pop().toLowerCase()

                    // 判断是否为需要的
                    if (matchExts.includes(ext)) {
                    	const matchNeedImg = needList.find(item => handle.name.includes(item.name))
                    	if (matchNeedImg) {
	                        // 获取文件对象 (如果需要预览或读取内容)
	                        const file = await handle.getFile()
	                        imagesInThisFolder.push({
	                        	...matchNeedImg,
	                            fileName: handle.name,
	                            fileSize: file.size,
	                            fileObject: file,
	                            type: file.type
	                        })
	                    } else {
	                    	// 名字不匹配，针对非住宅以外类型直接绑定
	                    	if (tbhInfo.tblx !== '1' && needList.length === 1) {
	                    		// 获取文件对象 (如果需要预览或读取内容)
	                        	const file = await handle.getFile()
	                        	imagesInThisFolder.push({
		                        	...needList[0],
		                            fileName: handle.name,
		                            fileSize: file.size,
		                            fileObject: file,
		                            type: file.type
		                        })
	                    	}
	                    }
                    }
                }
            }
            results.push({
                tbh: tbh,
                lx: tbhInfo.tblx,
                name: directoryHandle.name,
                images: imagesInThisFolder
            })
        } else {
        	for await (const [name, handle] of directoryHandle.entries()) {
                if (handle.kind === 'directory') {
                    // 递归查找子目录
                    const subResults = await searchAutoMatchFolders(handle, depth + 1)
                    // 合并结果
                    results.push(...subResults)
                }
            }
        }
        return results
    }

    const readAutoDirectory = async () => {
    	try {
	        // 1. 请求目录访问权限 (这一步必须由用户点击触发，比如放在 button.onclick 里)
	        // 如果之前已经授权过，可以使用 window.showDirectoryPicker() 的选项跳过选择框
	        const startDirHandle = await window.showDirectoryPicker()

	        // 2. 开始递归搜索
	        const list = await searchAutoMatchFolders(startDirHandle)

	        return {
	        	success: true,
	        	list
	        }
	    } catch (err) {
	        return {
	        	success: false
	        }
	    }
    }

	/**
     * 根据选择的上传方式进行上传 - 自动匹配图斑类型版
     * @param  {[type]}  files [description]  待上传文件
     * @param  {Boolean} clear [description]  是否清除旧文件重新上传
     * @param  {Boolean} check [description]  是否校验是已上传文件
     * @return {[type]}        [description]
     */
    const submitFileByUpTypeAuto = async (files, clear = true, check = false) => {
    	waitCount = 0
    	showRowRes('开始进行文件匹配上传======================================')
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	const resList = []
    	for (const [index, fileItem] of files.entries()) {
    		const { tbh, lx, images } = fileItem
    		showRowRes((index + 1) + '. 图斑编号： ' + tbh + ' 开始操作************')
    		showRowRes('对应图斑类型：' + getTblxName(lx))
	    	let msgStr = '图斑编号：' + tbh
	    	const curResult = {index, tbh}
	    	const preInfoRes = await getPreInfoWithLx(tbh, lx, value)
	    	if (preInfoRes.relogin) {
	    		showRowRes(preInfoRes.msg)
	    		resList.push(curResult)
	    		return
	    	}
    		showRowRes(preInfoRes.msg)
	    	if (!preInfoRes.success) {
	    		showRowRes('对应文件请下次上传')
	    		resList.push(curResult)
	    		continue
	    	}
    		resList.push(curResult)
    		curResult.hasFile = true
    		console.log(fileItem)
			if (images.length > 0) {
				curResult.all = images.length
				curResult.jump = 0
				curResult.finish = 0
				curResult.fail = 0
				curResult.save = false

				let submitFormData = preInfoRes.info

				if (clear) {
					showRowRes(`执行清除任务---start`)
					const upFileds = [...new Set(images.map(item => item.key.split('_').pop()))]
					const oldUploadedFilesRes = await getUploadedFilesWithLx(tbh, lx, value)
    				if (oldUploadedFilesRes.relogin) {
			    		showRowRes(oldUploadedFilesRes.msg)
			    		return
			    	}
			    	showRowRes(oldUploadedFilesRes.msg)
					if (!oldUploadedFilesRes.success) {
    					if (oldUploadedFilesRes.msg.includes(fastMsg)) {
			    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
			    			return
			    		}
    					continue
    				}
    				const oldTkyj = oldUploadedFilesRes.tkyj
    				let delIds = []
    				for (let upField of upFileds) {
    					if (oldTkyj && oldTkyj[upField]?.length > 0) {
    						const ids = oldTkyj[upField].map(item => item.id)
    						delIds = delIds.concat(ids)
    					}
    				}
    				console.log('delIds =>  ', delIds)
					if (delIds.length > 0) {
						const olddata = preInfoRes.info.tkyj
	    				const delIdData = initFileSubmitIdsWithLx(lx, olddata)
	    				const failDelIdData = initFileSubmitIdsWithLx(lx)

	    				showRowRes('---------- ' + msgStr + ' 旧文件开始删除')
    					for (let delId of delIds) {
    						tryCount = 0
    						const delRes = await delFile(delId, value)
    						if (delRes.relogin) {
					    		showRowRes(delRes.msg)
					    		return
					    	}
    						showRowRes(delId + ' => ' + delRes.msg)
    						if (!delRes.success) {
    							for (let delKey in delIdData) {
    								if (delIdData[delKey].includes(delId)) {
    									failDelIdData[delKey].push(delId)
    									break
    								}
    							}

					    		if (delRes.msg.includes(fastMsg)) {
					    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
					    			return
					    		}
    						}
    						await sleepLmit()
    					}
    					// await sleep()
    					const submitDelResult = await submitDataWithFileChange2(msgStr, failDelIdData, submitFormData, value)
    					if (submitDelResult.relogin) {
				    		showRowRes(submitDelResult.msg)
				    		return
				    	}
    					submitFormData = submitDelResult.submitData
					} else {
    					showRowRes('无文件需要清除')
    				}
    				showRowRes(`执行清除任务---end`)
				}

				const uploadedFilesRes = await getUploadedFilesWithLx(tbh, lx, value)
				if (uploadedFilesRes.relogin) {
		    		showRowRes(uploadedFilesRes.msg)
		    		return
		    	}
				showRowRes(uploadedFilesRes.msg)
				if (!uploadedFilesRes.success) {
					if (uploadedFilesRes.msg.includes(fastMsg)) {
		    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
		    			return
		    		}
					continue
				}
				console.log('uploadedFilesRes => ', uploadedFilesRes)
				const { tkyj } = uploadedFilesRes
				const successList = []
				let num = 0
				for (let imgFile of images) {
					console.log(imgFile)
					const field = imgFile.key.split('_').pop()
					const fieldVals = tkyj[field] || []
					console.log('fieldVals => ', fieldVals, imgFile)
					if (fieldVals.length > 0 && !clear && check) {
						// 校验是否已上传,通过文件大小比对
						const matchOldFile = fieldVals.find(item => item.size === imgFile.fileSize)
						if (matchOldFile) {
							showRowRes(imgFile.fileName + ' => 已上传过，跳过该文件')
							curResult.jump += 1
							continue
						}
					}
					const uploadRes = await uploadFile(tbh, value, imgFile)
					if (uploadRes.relogin) {
			    		showRowRes(uploadRes.msg)
			    		return
			    	}
					showRowRes(uploadRes.msg)
					if (uploadRes.success) {
						curResult.finish += 1
						successList.push(uploadRes.info)
					} else if (uploadRes.msg.includes(fastMsg)) {
						curResult.fail += 1
		    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
		    			return
		    		} else {
						curResult.fail += 1
		    		}
					num = num + 1
		    		if (num < images.length) {
    					await sleepUp()
    				} else {
    					await sleepLmit()
    				}
				}
				console.log('successList =>', successList)
				if (successList.length === 0) {
					showRowRes(msgStr + ' 无上传成功文件记录需要保存')
					continue
				}
				showRowRes(msgStr + ' 文件数据记录开始保存')
				let uploadFileData = initFileSubmitIdsWithLx(lx)
				const fileKeyMap = getFileKeyMap(lx)
				const needList = getNeedImgList(lx)
				for (let needItem of needList) {
					const needKey = needItem.key.split('_').pop()
					const keyVals = tkyj[needKey] || []
					const matchSuccessList = successList.filter(item => item.usageType === needItem.key).map(item => item.id) || []
					for (let key in fileKeyMap) {
						if (fileKeyMap[key].includes(needKey)) {
							uploadFileData[key] = uploadFileData[key].concat(matchSuccessList, keyVals.map(item => item.id))
						}
					}
				}
				console.log('uploadFileData => ', uploadFileData)
				if (!includeUpFile(uploadFileData)) {
					showRowRes(msgStr + ' 无文件记录保存')
					continue
				}
				// await sleep()
				const preSubmitData = preInfoRes.info
				const submitSaveResult = await submitDataWithFileChange2(msgStr, uploadFileData, preSubmitData, value, false)
				if (submitSaveResult.relogin) {
		    		showRowRes(submitSaveResult.msg)
		    		return
		    	}
		    	if (submitSaveResult.success) {
		    		curResult.save = true
		    	}
			} else {
				showRowRes('未找到该图斑本地文件')
				curResult.hasFile = false
			}

			waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}

    	showRowRes('所有数据提交执行完毕', true)

    	showRowRes('文件上传提交结果：')
		const hasFileList = resList.filter(item => item.hasFile)
		showRowRes('存在文件上传的图斑数量：' + hasFileList.length)
		const saveFileList = hasFileList.filter(item => item.save)
		showRowRes('上传保存的图斑数量：' + saveFileList.length)
		const saveSomeList = saveFileList.filter(item => item.fail > 0)
		showRowRes('上传保存的图斑数量(部分文件上传失败)：' + saveSomeList.length)
		if (saveSomeList.length > 0) {
			showRowRes(JSON.stringify(saveSomeList.map(item => item.tbh)))
		}
		const unSaveFileList = hasFileList.filter(item => !item.save && item.finish > 0)
		showRowRes('上传但未保存成功的图斑数量：' + unSaveFileList.length)
		if (unSaveFileList.length > 0) {
			showRowRes(JSON.stringify(unSaveFileList.map(item => item.tbh)))
		}

    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
    }

    // 选择文件自动匹配图斑对应类型进行相应上传
    upAutoByTypeBtn.addEventListener('click', async() => {
    	if (state.submiting) return
		state.submiting = true
		showRes('')
		if (allTaskList.length === 0) {
			showRowRes('请先获取所有任务！')
			state.submiting = false
			return
		}
    	const matchRes = await readAutoDirectory()
    	if (!matchRes.success) {
    		showRowRes('读取文件目录失败，请重试！')
    		state.submiting = false
    		return
    	}
    	if (matchRes.list.length === 0) {
    		showRowRes('未找到任何符合的文件，重新选择目录或点击提交数据按钮！')
    		state.submiting = false
    		return
    	}
    	console.log(matchRes.list)
    	showRowRes('扫描到的图斑总数：' + matchRes.list.length)
    	const matchUpList = matchRes.list.filter(item => item.images.length > 0)
    	showRowRes('验证待上传的图斑总数：' + matchUpList.length)
    	const matchLoseList = matchRes.list.filter(item => item.images.length === 0)
    	showRowRes('验证无上传文件的图斑：' + JSON.stringify(matchLoseList))
    	// showRowRes('图斑类型：' + getTblxName())
    	showRowRes('选择的上传方式：' + getUpTypeName(), true)
    	if (upType === 1) {
    		await submitFileByUpTypeAuto(matchRes.list)
    	} else if (upType === 2) {
    		await submitFileByUpTypeAuto(matchRes.list, false, true)
    	} else if (upType === 3) {
    		await submitFileByUpTypeAuto(matchRes.list, false, false)
    	}
    	state.submiting = false
    })

    const submitSingleDataByLx = (tbh, lx, data, Authorization) => {
    	return new Promise(async(resolve) => {
	    	const preInfoRes = await getPreInfoWithLx(tbh, lx, Authorization)
	    	if (!preInfoRes.success) {
	    		return resolve(preInfoRes)
	    	}
	    	const preSubmitData = preInfoRes.info
	    	const submitData = {
	    		tkyj: {},
	    		zjd: {},
	    		submit: false
	    	}
	    	submitData.tkyj = Object.assign({}, preSubmitData.tkyj, data.tkyj)
	    	submitData.zjd = Object.assign({}, preSubmitData.zjd, data.zjd)
    		tryCount = 0
    		// 缩短等待时间
    		await sleepLmit()
	    	const submitResult = await doSubmit(submitData, Authorization)
	    	console.log('提交的数据  =>  ', tbh, submitData, submitResult)
	    	resolve({
	    		...submitResult,
	    		submitData
	    	})
    	})
    }

	const submitAutoAll = async () => {
		waitCount = 0
    	const tbhRes = getTbList()
		if (tbhRes.lose) {
			showRowRes(tbhRes.msg)
    		state.submiting = false
			return
		}
		const { submitList } = tbhRes
    	console.log('待提交数据  =>  ', submitList)
    	const { success, value } = await getToken()
    	if (!success) {
    		showRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	showRowRes('开始提交数据，请稍等...')
    	showRowRes('总数据： ' + submitList.length + ' 条', true)
    	const startTime = getCurrentTime()
    	showRowRes('开始时间： ' + startTime, true)
    	let resList = []
    	for (let [index, sData] of submitList.entries()) {
    		let checkResult
    		if (isSingleObject(sData)) {
    			checkResult = checkZjdData(sData)
    		} else {
    			checkResult = checkData(parseResult.data)
    		}
    		if (!checkResult.pass) {
	    		showRowRes((index + 1) + '.' + checkResult.msg)
	    		resList.push({pass: false, index})
	    		continue
	    	}
	    	const { data, tbh } = checkResult.result
	    	let msgStr = '图斑编号：' + tbh
	    	const tbhInfo = getTaskIdInfo(tbh)
	    	if (!tbhInfo) {
	    		resList.push({pass: false, index, tbh})
	    		showRowRes('全部任务列表中未找到该图斑编号，请稍后检查！！！')
	    		continue
	    	}
	    	const dataTblx = tbhInfo.tblx
	    	showRowRes('对应图斑类型：' + getTblxName(dataTblx))
	    	if (hasKey(data.zjd, 'czb')) {
	    		if (Number(data.zjd.czb) < 0) {
	    			data.zjd.czb = 0
	    			showRowRes('czb 为负数，已修正为 0')
	    		}
	    	}
	    	if (hasKey(data.zjd, 'cbzmj')) {
	    		if (Number(data.zjd.cbzmj) < 0) {
	    			data.zjd.cbzmj = 0
	    			showRowRes('cbzmj 为负数，已修正为 0')
	    		}
	    	}
	    	if (hasKey(data.zjd, 'zyyjjbntmj')) {
	    		if (Number(data.zjd.zyyjjbntmj) <= 0) {
	    			data.zjd.zyyjjbntmj = '0'
	    			showRowRes('zyyjjbntmj 不是有效值，已修正为 字符串0 确保后续提交')
	    		}
	    	}
	    	tryCount = 0
	    	const submitResult = await submitSingleDataByLx(tbh, dataTblx, data, value)
	    	if (submitResult.relogin) {
	    		showRowRes((index + 1) + '.' + msgStr + ' 失败<br>' + submitResult.msg)
	    		return
	    	}
	    	if (submitResult.success) {
	    		showRowRes((index + 1) + '.' + msgStr + ' 成功<br>' + submitResult.msg)
	    		resList.push({pass: true, index, tbh})
	    	} else {
	    		showRowRes((index + 1) + '.' + msgStr + ' 失败<br>' + submitResult.msg)
	    		resList.push({pass: false, index, tbh})
	    		if (submitResult.msg.includes(fastMsg)) {
	    			showRowRes(`触发风控，请更换账号或稍等一段时间,已提前终止！！！`, true)
	    			return
	    		}
	    		continue
	    	}

	    	waitCount++
	    	if (waitCount < waitMax) {
	    		await sleep()
	    	} else {
	    		waitCount = 0
    			const time = getRandom(60000, 80000)
    			const timeSecond = Math.ceil(time / 1000)
	    		showRowRes('==============休息等待 ' + timeSecond + ' 秒，稍后继续==============')
	    		await sleepTime(time)
	    	}
    	}
    	const failList = resList.filter(item => !item.pass)
    	showRowRes('所有数据提交执行完毕', true)
    	console.log(resList.length, failList.length)
    	showRowRes('成功数量：' + (resList.length - failList.length), true)
    	showRowRes('失败数量：' + failList.length, true)
    	if (failList.length > 0) {
    		const failStr = JSON.stringify(failList)
    		showRowRes(failStr)
    	}
    	const endTime = getCurrentTime()
    	showRowRes('结束时间： ' + endTime, true)
	}

    // 自动匹配类型进行数据提交
    submitAutoByTypeBtn.addEventListener('click', async() => {
    	if (state.submiting) return
    	state.submiting = true
		showRes('')
		if (allTaskList.length === 0) {
			showRowRes('请先获取所有任务！')
			state.submiting = false
			return
		}
    	showRowRes('自动匹配类型进行数据提交')
    	await submitAutoAll()
    	state.submiting = false
    })

    const getTaskList = (Authorization, page = 1) => {
		return new Promise(async(resolve) => {
			tryCount++
			const codeRes = await getAdCode()
			if (!codeRes.success) {
				return resolve(codeRes)
			}
			const code = codeRes.code
			fetch(`https://lzgd.jssny.com.cn/api/agile/bpm/my/todoTaskList?zjdLimit=100&zjdOffset=${page}&zjdFilter=true&adCode=${code}&node_id_$VEQ=&nodeId=`, {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            "Authorization": Authorization
		        }
		    })
		    .then(response => fetchCheck(response))
		    .then(async(data) => {
		    	if (tokenLoseCodes.includes(data.code)) {
		    		tryCount = 0
	            	return resolve({
	            		success: false,
	            		relogin: true,
	            		msg: '登录失效 => ' + (data.msg || data.message)
	            	})
		    	}
		    	if (data.code !== '200') {
		    		if (tryCount >= maxTry) {
		    			tryCount = 0
		            	return resolve({
		            		success: false,
		            		msg: '请求数据失败：' + (data.message || data.msg)
		            	})
					} else {
						await sleep()
						return resolve(await getIdInfo(tbh, Authorization))
					}
	            }
	            const list = data.rows?.map(item => {
	            	return {
	            		tbh: item.bizKey,
	            		tblx: item.tblx,
	            		taskId: item.taskId,
	            		nodeId: item.nodeId,
	            		instId: item.instId
	            	}
	            }) || []
	            return resolve({
            		success: true,
            		msg: '请求数据成功',
            		list,
            		total: data.total
            	})
		    }).catch(_err => {
		    	return resolve({
            		success: false,
            		msg: '请求数据失败'
            	})
		    })
		})
	}

	let allTaskList = [], taskTotal = 0
	/**
	 * 获取所有图斑任务
	 * @return {[type]} [description]
	 */
	const getAllTaskList = async () => {
		if (state.submiting) return
		state.submiting = true
		tryCount = 0
		allTaskList = []
		taskTotal = 0
		showTaskRes('')
		const { success, value } = await getToken()
    	if (!success) {
    		showTaskRowRes('未找到token，请刷新重新登录！！')
    		state.submiting = false
    		return
    	}
    	const firstTasksRes = await getTaskList(value, 1)
    	if (firstTasksRes.relogin || !firstTasksRes.success) {
    		showTaskRowRes(firstTasksRes.msg)
    		state.submiting = false
    		return
    	}
    	allTaskList = allTaskList.concat(firstTasksRes.list)
    	taskTotal = firstTasksRes.total
    	if (allTaskList.length < taskTotal) {
    		const maxPage = Math.ceil(taskTotal / 100)
    		if (maxPage > 1) {
    			for (let i = 2; i <= maxPage; i++) {
    				const tasksRes = await getTaskList(value, i)
    				if (tasksRes.relogin || !tasksRes.success) {
			    		showTaskRowRes(tasksRes.msg)
			    		allTaskList = []
						taskTotal = 0
			    		state.submiting = false
			    		return
			    	}
			    	allTaskList = allTaskList.concat(tasksRes.list)
    			}
    		}
    	}
    	console.log('allTaskList => ', allTaskList)
    	showTaskRowRes('获取到的所有图斑任务总数为： ' + taskTotal, true)
    	showTaskRowRes(JSON.stringify(allTaskList))
		state.submiting = false
	}

	const getTaskIdInfo = (tbh) => {
		const task = allTaskList.find(item => item.tbh === tbh)
		if (!task) return null
		return task
	}

	getTaskBtn.addEventListener('click', getAllTaskList)

	handleUpBtn.addEventListener('click', async () => {})

    const handleHashChange = () => {
    	token = null
    	adCode = null
    	tryCount = 0
    	if (window.location.hash.includes('#/login')) {
    		if (!openBtn.classList.contains('hide'))
            	openBtn.classList.add('hide')
        } else {
    		if (openBtn.classList.contains('hide'))
        		openBtn.classList.remove('hide')
        }
    }

    handleHashChange()

    const originalPushState = history.pushState;

	// 重写 pushState
	history.pushState = function (...args) {
	    // 调用原始方法
	    originalPushState.apply(history, args)

	    // 手动触发 hashchange 事件
	    window.dispatchEvent(new HashChangeEvent('hashchange'))
	}

    window.addEventListener('hashchange', handleHashChange)
})();