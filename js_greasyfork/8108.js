// ==UserScript==
// @name        AutoPagerize_Console
// @name:en     AutoPagerize_Console
// @name:ja     AutoPagerize_Console
// @description    Expansion Autopagerize operation. / AutoPagerizeの操作系を拡張します。
// @description:en Expansion Autopagerize operation.
// @namespace   phodra
// @include     *
// @exclude     https://www.youtube.com/*
// @exclude     https://docs.google.com/*
// @exclude     https://console.developers.google.com/*
// @version     5.4.1
// @noframes
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/8108/AutoPagerize_Console.user.js
// @updateURL https://update.greasyfork.org/scripts/8108/AutoPagerize_Console.meta.js
// ==/UserScript==

(()=>{
	// Greasemonkey 4.0未満バージョン対応
	if( this.GM == null ){
		this.GM = {
			getValue: async (name, defVal) => await GM_getValue(name, defVal),
			setValue: async (name, value) => await GM_setValue(name, value)
		}
	}
	// 拡張
	Array.prototype.first = function(){ return this[0]; }
	Array.prototype.last = function(){ return this[this.length-1]; }
	Array.prototype.round = function(i){ return this[i<0? 0: i>=this.length? this.length-1: i]; }
	Node.prototype.prependChild = function(elm){ this.insertBefore(elm,this.firstChild); }
	Element.prototype.css = function(arg1, arg2){
		if( arg2 == null){
			for( let key in arg1 ){
				this.style[key] = arg1[key]
			}
		}else{
			this.style[arg1] = arg2
		}
	}
	Element.prototype.attr = function(arg1, arg2){
		if( arg2 == null){
			for( let key in arg1 ){
				this.setAttribute(key, arg1[key])
			}
		}else{
			this.setAttribute(arg1, arg2)
		}
	}
	// 任意のイベントを発火
	const FireEvent = ename => {
		const e = document.createEvent('Event')
		e.initEvent( ename, true, false)
		return document.dispatchEvent(e)
	}



	// 画像をひとまとめにしておく
	const RES = {
		'config':   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAC5SURBVCiRrZI9DsIwDIVfKsQIxyjlBNwC7lFWBq4AKyMrB0C9AGzcBlDFAAh9DE2rNKQoSDzJcvxsyz+x9C8ACTBy7AxIYhILKuRWAAo/rhfIHVi9CXANjK1iJO0lDSVNJPW9uIekk6SrpKkxhrq9MW3cgDWwBV6eL/Nnyx3nwuF3Dp/XfNe27h3vNgKtnoElsAKeoVZ/Xc5F0qxZjlf9wCeOflxoxtLquRWp+obvsCeXOnYadXKxeAMXu9O375dXpAAAAABJRU5ErkJggg==",
		'scrAll':   "data:image/png;base64,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6LY0xzroyiAbWQ7nyDd+ePiDFuKl3SBW3f8B8fP2P2is2c4AAABielRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeNo9icENwDAMAv+eoiPY4KrpOrU//eXR/VUnUgJCAk7e/oUcUw5hc/jtqV7esrRQ8KraCCqNZwUkbZIo8tS28YwIck1V+QEwdRTPIeQRVwAACWppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgD/gEAAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQffDB8MHyAdGHmgAAABB0lEQVQ4y72VLUuEQRRGz6wLKot/QBDNIghazDZBMAsGs2AxWv0V/gPDVvOCxaprsoomYVGLCMKxDDIOr/N+oPvALZd7mDv3YyYgndSDKYP93CFuARetQWAOWP63VENeVXEFOGwNdi5OncQBcATS2NQZ9VK1LXhuVBvo1ERNoQN/6q0JtK1+ZKB10Jr6YoVK0KL6kMQ+1YLqgnqTxD2qJynYq2hwHxgC69H1CuwAk7rJWQVG0QBGgXAnbhbBQBgD48q57rhW+/mlmvTyuFUfI7SrfuZgcR/FDeAKGETXBHgupqouZU0ffh8klAbgNoGu1fk05rcX4AyYBe5jenuB8P4nb870v4AvLySHS1xd+RoAAAAASUVORK5CYII=",
		'scrPage':  "data:image/png;base64,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CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4A/4BAAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3wwfDB8brBOQhAAAAPhJREFUOMvl1LEuREEUh/FvNisiSCRCIqGytQdR06oUFAqF91Do0NJrvIBaK6p9AZWEhGx8miXHdWfvzHbiJNPcO7/8586cuQmZqnrwV2C/FoibwC5I1VCvVGvRQB1NAy8cVw3aUN+/YM2ungAzcZtK0lbVV0OVJh4Dc82D6UpbUp9tVEniEbDY1gqT0ubVJ1uqK/EAWG57kXL3UZwFhsDa+NElcNa5VPUwrOxFXfkxJ4P66jDA01/zMnAvoDd1vROqPfUhwPPWz2mBOwGN1EEpvA/wOnvODbQd0Ie6VQrvAryZ1FXfDSAuAPuhB24T6THXUukf/Mk/Ac1knVlDqEQOAAAAAElFTkSuQmCC",
		'disabled': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADpSURBVCiRnZIxCsJAEEXfBo0IilhYWIgogo1W1mLnHTyFjVXOEkif1kKvYGsr2NhoaaVo8S2WsGoikiwss/NnHjvsfiMhCqxSctjvYbNxBd+HTgdmM2i1MkgJSSgMEaDBAE0mqN22ue+j1Qo9n7Yv2SlwvXbFywUtFlYPghyghB4P1O+jahVdr073/j1CuQzzOdxusNs5/S8I0O3aeD7nBI2xsVLJCR6PNg6HOcD7HbZb6PVgPHZ66TcChwMsl3A6QRyD935NlgFGI9Ro2LzZRFH0+UUSMolXvy1Xr9vxplOo1dLTmKImfwFplKHHjazaRQAAAABJRU5ErkJggg==",
		'enabled':  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACESURBVCiRzdIxDkFREIXh74lWh9BolBagYhU2o1CrWYtF2IyK/mokzPPmvRCFmWpOzp+592QqRfFF9cN0xDVxrrDOwD1uWDSA4zbQAzp3vlSv2/JjsAqpTnHBqOba4BCl9z/OsKtp86ad5aUnimVQ0v6HcLIDGOL0HGM4W/nJDdo2flB3ti8tcnms5h0AAAAASUVORK5CYII=",
	}



	// スタイル
	const $style = document.createElement("style")
	$style.setAttribute("type", "text/css")
	$style.textContent = `
	#apc-panel *,
	#apc-config * {
	    color: #eee;
	    border-color: #666;
	}
	.apc-box,
	#apc-pageList,
	#apc-config,
	#apc-mButtons {
	    background-color: #1c1c1c !important;
	}
	.apc-button {
	    filter: brightness(100%) contrast(150%);
	}
	#apc-enabler {
	    filter: grayscale(100%);
	}
	#apc-panel[ap_valid] #apc-enabler {
	    filter: grayscale(60%);
	}


	/* コンソールパネル */
	#apc-panel {
	    opacity: 0.6;
	    background-color: transparent !important;

	    position: fixed;
	    z-index: 9999999990;
	    right: 0;
		margin: 0;

		display: inline-flex;
		flex-direction: column;
		align-items: flex-end;

	}
	#apc-panel[display_rule=valid]:not([ap_valid]) {
	    visibility: hidden;
	}

	#apc-panel *,
	#apc-config * {
	    font-family: arial, sans-serif;
	    font-size: 14px;
	    font-weight: normal;
	    letter-spacing: normal;
	    vertical-align: baseline;
	    line-height: normal;
	}
	.apc-box {
	    padding: 1px;
	    box-sizing: content-box;
	    min-width: 18px;
		/*position: relative;*/
		pointer-events: auto;
	}
	#apc-panel[non_hover='transparent']:not(:hover):not([config]) .apc-box {
		background-color: transparent !important;
	}
	#apc-panel[non_hover='stealth']:not(:hover):not([config]) .apc-box {
	    visibility: hidden;
	}

	/* ボタンのスタイル */
	.apc-button {
	    border: solid 1px;
	    box-sizing: border-box;
	    cursor: pointer;
	    margin: 1px;
	    padding: 0;
	    position: relative;
	    
	    opacity: 0.5;
		width: 16px;
	}
	.apc-button:hover {
	    opacity: 0.8;
	}
	.apc-button:active {
	    opacity: 0.3;
	}
	/* ボタンの大きさ */
	#apc-optionBox .apc-button {
	    height: 16px;
	}
	#apc-scrollerBox .apc-button {
	    height: 32px;
	}


	/* オプションボックス */
	#apc-optionBox {
	    display: flex;
	    z-index: 9999999991;
	}
	#apc-enabler[state="enable"] {
		background-image: url(${RES.enabled});
	}
	#apc-enabler[state="disable"] {
		background-image: url(${RES.disabled});
	}
	#apc-setting {
		background-image: url(${RES.config});
	}
	/* optionBox配置形状： */
	#apc-panel[ap_valid] #apc-optionBox[option_dir_valid='Left'],
	#apc-panel:not([ap_valid]) #apc-optionBox[option_dir_invalid='Left'] {
	    flex-direction: row-reverse;
	}
	#apc-panel[ap_valid] #apc-optionBox[option_dir_valid='Right'],
	#apc-panel:not([ap_valid]) #apc-optionBox[option_dir_invalid='Right'] {
	    flex-direction: row;
	}
	#apc-panel[ap_valid] #apc-optionBox[option_dir_valid^='Up'],
	#apc-panel:not([ap_valid]) #apc-optionBox[option_dir_invalid^='Up'] {
	    flex-direction: column-reverse;
	}
	#apc-panel[ap_valid] #apc-optionBox[option_dir_valid^='Down'],
	#apc-panel:not([ap_valid]) #apc-optionBox[option_dir_invalid^='Down'] {
	    flex-direction: column;
	}
	#apc-panel[ap_valid] #apc-optionBox[option_dir_valid='Up_protrude'],
	#apc-panel:not([ap_valid]) #apc-optionBox[option_dir_invalid='Up_protrude'] {
	    margin-top: -18px;
	}
	#apc-panel[ap_valid] #apc-optionBox[option_dir_valid='Down_protrude'],
	#apc-panel:not([ap_valid]) #apc-optionBox[option_dir_invalid='Down_protrude'] {
		margin-bottom: -18px;
	}


	/* スクローラーボックス */
	#apc-scrollerBox {
	    z-index: 9999999992;
	}
	#apc-scrollTop,
	#apc-scrollBottom {
		background-image: url(${RES.scrAll});
	}
	#apc-scrollPrev,
	#apc-scrollNext {
		background-image: url(${RES.scrPage});
	}
	/* scrollerBox配置形状：スリム */
	#apc-scrollerBox[scroller_form='Slim'] {
		display: flex;
	    flex-flow: column wrap-reverse;
	}
	#apc-scrollerBox[scroller_form='Slim'] #apc-scrollTop {
	    order: 1;
	}
	#apc-scrollerBox[scroller_form='Slim'] #apc-scrollPrev {
	    order: 2;
	}
	#apc-scrollerBox[scroller_form='Slim'] #apc-scrollNext {
	    order: 3;
	    transform: scale(1, -1);
	}
	#apc-scrollerBox[scroller_form='Slim'] #apc-scrollBottom,
	#apc-panel:not([ap_valid]) #apc-scrollBottom {
	    order: 4;
	    transform: scale(1, -1);
	}
	/* scrollerBox配置形状：スクエア */
	#apc-panel[ap_valid] #apc-scrollerBox[scroller_form='Square'] {
		display: grid;
	}
	#apc-panel[ap_valid] #apc-scrollerBox[scroller_form='Square'] #apc-scrollTop {
		grid-row: 1/2;
		grid-column: 2/3;
	    transform: scale(-1, 1);
	}
	#apc-panel[ap_valid] #apc-scrollerBox[scroller_form='Square'] #apc-scrollBottom {
		grid-row: 2/3;
		grid-column: 2/3;
	    transform: scale(-1, -1);
	}
	#apc-panel[ap_valid] #apc-scrollerBox[scroller_form='Square'] #apc-scrollNext {
		grid-row: 2/3;
		grid-column: 1/2;
	    transform: scale(1, -1);
	}
	#apc-panel[ap_valid] #apc-scrollerBox[scroller_form='Square'] #apc-scrollPrev {
		grid-row: 1/2;
		grid-column: 1/2;
	}


	/* ページボックス */
	#apc-pageIndexBox {
	    cursor: pointer;
	    z-index: 9999999993;
	    min-height: 17px;
		position: relative;
	}
	/* ページ表示 */
	#apc-sequencer {
	    margin: 0px 1px;
	    padding: 0px;
	    text-align: center;
	}
	/* pageIndexBox配置形状：縦置き */
	#apc-pageIndexBox[page_index_form$='Pile'] #apc-sequencer {
	    display: flex;
	    flex-direction: column;
	}
	#apc-pageIndexBox[page_index_form$='Pile'] span:first-child{
		border-bottom: solid 1px #eee !important;
	}
	/* pageIndexBox配置形状：横置き */
	#apc-pageIndexBox[page_index_form='Strip'],
	#apc-pageIndexBox[page_index_form='Growed Pile']{
		box-sizing: border-box;
		width: 100%;
	}

	#apc-pageIndexBox[page_index_form$='Strip'] span:first-child::after{
	    content: " / ";
	}

	/* ページ一覧 */
	#apc-pageList {
		position: absolute;
		min-width: 38px;

	    margin: 0;
	    padding: 0px;
	    list-style-type: none;

	    display: none;
	    flex-flow: column wrap-reverse;
		max-height: 50vh;
	}
	#apc-pageIndexBox:hover #apc-pageList {
		display: flex;
	}
	#apc-pageIndexBox[page_list_expand^="Left"] #apc-pageList {
		right: 100%;
	}
	#apc-pageIndexBox[page_list_expand^="Right"] #apc-pageList {
		left: 100%;
	    flex-wrap: wrap;
	}
	#apc-pageIndexBox[page_list_expand$="upper"] #apc-pageList {
		bottom: 0;
	}
	#apc-pageIndexBox[page_list_expand$="lower"] #apc-pageList {
		top: 0;
	}
	#apc-pageIndexBox[page_list_expand="Upper"] #apc-pageList {
		right: 0;
		bottom: 100%;
	}
	#apc-pageIndexBox[page_list_expand="Lower"] #apc-pageList {
		right: 0;
		top: 100%;
	}

	.apc-pageListItem {
	    border-style: outset;
	    border-width: 1px;
	    box-sizing: border-box;
	    cursor: pointer;
	    margin: 1px;
	    padding: 0px;
	    text-align: center;
	}

	#apc-panel:not([ap_valid]) #apc-scrollPrev,
	#apc-panel:not([ap_valid]) #apc-scrollNext,
	#apc-panel:not([ap_valid]) #apc-pageIndexBox {
	    display: none;
	}

	#apc-panel[config]+#apc-configDialog {
		display: flex;
	}
	/* コンフィグメニューダイアログ */
	#apc-configDialog {
    background-color: transparent !important;
	    position: fixed;
	    z-index: 9999999999;

	    top: 0px;
	    left: 0px;
	    width: 100%;
	    height: 100%;

	    display: none;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
	}
	#apc-config {
		opacity: 1.0;
	    border: outset 3px white;
	    display: inline-block;

	    text-align: left;
	    padding: 5px 15px;
		padding-bottom: 0;
		max-height: 90vh;
		overflow: scroll;

		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	#apc-config h4 {
	display: block;
    background-color: transparent;
		padding: 0;
		padding-bottom: 1px;
        margin: 5px 0 2px -5px;
	    border: solid 0;
		border-bottom-width: 1px;
    font-weight: bold !important;
	}
	#apc-config .apc-group {
		border: solid 1px;
	    margin: 0;
		margin-top: 10px;
	    padding: 5px;
    font-size: 0;
	}
	#apc-config .apc-group h5 {
	    display: inline-block;
	    margin: 0;
	    margin-top: -1em;
	    padding: 0 3px;
	    background-color: #1c1c1c;
	    font-weight: bold !important;
	}
	#apc-config .apc-mItem {
    display: block;
	    margin: 5px 2px 0 2px;
	}
	#apc-config label {
    display: block;
    margin: 2px;
	    cursor: pointer;
	}
	#apc-config input,
	#apc-config select {
	    background-image: none;
	    background-color: #000;
	    border: 2px inset #666;
	    margin: auto 2px;
	    cursor: pointer;
    border-radius: initial;
    padding: initial;
	}
	#apc-config option {
		color: black;
		background-color: white;
	}
	#apc-config input {
	    width: auto;
	    height: auto;
    padding: 0;
    cursor: pointer;
	}
	#apc-config select,
	#apc-config input[type='number'] {
	    box-sizing: content-box;
	    height: 19px;
	}
	#apc-config input[type='number'] {
	    max-width: 60px;
	-webkit-appearance: ;
	}
	#apc-config select {
		max-width: 80px;
	}
	#apc-config input[type='checkbox'] {
	    vertical-align: middle;
	}
	#apc-config #apc-mButtons {
		display: flex;
		justify-content: stretch;
	    padding: 15px 0 0 0;
		position: sticky;
		bottom: 0;
	}
	#apc-config .apc-config_button {
	    border: outset 2px;
		margin: 0 5px;
	    width: 100%;
	}
	`
	document.head.appendChild($style)



	// コントロール配置
	/// パネル（最親）
	const $panel = document.createElement("div")
	$panel.id = "apc-panel"

	// ボックスを作成
	const $createBox = () => {
		const $box = document.createElement("div")
		$box.className = "apc-box"
		return $box
	}
	// ボタンを作成
	const $createButton = (attr) => {
		const $button = document.createElement("div")
		$button.className = "apc-button"
		$button.attr(attr)
		return $button
	}

	///panel/ オプションボックス
	const $optionBox = $createBox()
	$optionBox.id = "apc-optionBox"
	$panel.appendChild($optionBox)

	///panel/optionBox/ オンオフボタン (enable/disable)
	const $enabler = $createButton(
		{ 'id': "apc-enabler" }
	)
	const apEnable = {
		name: "enable",
		state: true,
	}
	///panel/optionBox// トグルボタン クリックでリクエストイベント発火
	$enabler.addEventListener(
		'click', () => FireEvent('AutoPagerizeToggleRequest')
	)
	$optionBox.appendChild($enabler)

	// コンフィグメニューを開いているか
	///panel/optionBox/ 設定ボタン
	const $setting = $createButton(
		{
			'id': "apc-setting",
			'title': "Open Config",
			'alt': "c",
		}
	)
	$optionBox.appendChild($setting)
	$setting.addEventListener(
		'click', () => config.open()
	)
	/// ボタンが見えなくなった時のため、ショートカットで開けるようにする。
	/// Alt + Ctrl + p
	document.addEventListener(
		'keydown', e => {
			if( e.altKey && e.ctrlKey && e.keyCode == 80 ){
				config.open()
			}
		}
	)

	const $spacingBox12 = document.createElement("div")
	$spacingBox12.className = "apc-spacing"
	$spacingBox12.style.order = 2
	$panel.appendChild($spacingBox12)

	///panel/ スクロールボックス
	const $scrollerBox = $createBox()
	$scrollerBox.id = "apc-scrollerBox"
	$panel.appendChild($scrollerBox)

	///panel/scr/ 最上部へ移動
	const $scrollTop = $createButton(
		{
			'id': "apc-scrollTop",
			'alt': "↑",
			'title': "Move to Top",
		}
	)
	$scrollerBox.appendChild($scrollTop)
	///panel/scr/ 最下部へ移動
	const $scrollBottom = $createButton(
		{
			'id': "apc-scrollBottom",
			'alt': "↓",
			'title': "Move to Bottom",
		}
	)
	$scrollerBox.appendChild($scrollBottom)
	///panel/scr/ 前のページ
	const $scrollPrev = $createButton(
		{
			'id': "apc-scrollPrev",
			'alt': "△",
			'title': "Move to Previous",
		}
	)
	$scrollerBox.appendChild($scrollPrev)
	///panel/scr/ 次のページ
	const $scrollNext = $createButton(
		{
			'id': "apc-scrollNext",
			'alt': "▽",
			'title': "Move to Next",
		}
	)
	$scrollerBox.appendChild($scrollNext)

	///panel/scr/ 最上部へ移動
	$scrollTop.addEventListener(
		'click', () => smoothScrollTo(0)
	)
	///panel/scr/ 最下部へ移動
	$scrollBottom.addEventListener(
		'click', () => smoothScrollTo(getBottomPos)
	)
	///panel/scr/ 前のページ
	$scrollPrev.addEventListener(
		'click', () => {
			smoothScrollTo( pageBounds.round( getNowPage(false) ) )
		}
	)
	///panel/scr/ 次のページ
	$scrollNext.addEventListener(
		'click', () => {
			const targetPage = getNowPage()+1
			smoothScrollTo(
				targetPage < pageBounds.length ?
				pageBounds.round(targetPage) :
				getBottomPos
			)
		}
	)

	const $spacingBox23 = document.createElement("div")
	$spacingBox23.className = "apc-spacing"
	$spacingBox23.style.order = 4
	$panel.appendChild($spacingBox23)

	///panel/ ページボックス
	const $pageIndexBox = $createBox()
	$pageIndexBox.id = "apc-pageIndexBox"

	///panel/pageIndexBox/ ページ数表示
	const $sequencer = document.createElement("div")
	$sequencer.id = "apc-sequencer"
	const $sequencerNow = document.createElement("span")
	const $sequencerMax = document.createElement("span")
	$sequencerNow.textContent = $sequencerMax.textContent = "1"
	$sequencer.appendChild($sequencerNow)
	$sequencer.appendChild($sequencerMax)
	$pageIndexBox.appendChild($sequencer)
	$panel.appendChild($pageIndexBox)

	///panel/pageIndexBox/ ページリスト
	const $pageList = document.createElement("ol")
	$pageList.id = "apc-pageList"
	$pageIndexBox.appendChild($pageList)
	// 新しいページリストアイテムにイベントを追加
	const $createPageListItem = num => {
		const $elm = document.createElement("li")
		$elm.className = "apc-pageListItem"
		$elm.textContent = num
		// クリックでそのページにスクロール
		$elm.addEventListener(
			'click', function(){
				const targetNum = this.textContent-1
				smoothScrollTo( pageBounds.round(targetNum) )
			}
		)
//		// ダブルクリックでページ移動
//		$elm.addEventListener(
//			'dblclick', function(){
//				const num = this.textContent-2
//				if( num >= 0 )
//					document.getElementsByClassName("autopagerize_link")[num].href
//			}
//		)
		return $elm
	}
	$pageList.appendChild( $createPageListItem(1) )

	document.body.appendChild($panel)





	/// コンフィグメニューを作成
	// コンフィグコントロール管理クラス
	// 基底クラス
	class ConfigControl {
		constructor(name, options){
			this.name = name
			this.defaultValue = options.defaultValue || 0
			this.onchange_ = options.onchange || null
		}

		get state(){
			return this.value
		}
		set state(val){
			this.value = val
			this.onchange()
		}
		onchange(){
			if( typeof(this.onchange_) == "function" ) this.onchange_()
		}
		getInitial(){
			return this.defaultValue || 0
		}
		setDefault(){
			this.state = this.defaultValue
		}
		restoreState(params){
			const val = params[this.name]
			if( val == null ){
				this.setDefault()
			}else{
				this.state = val
			}
		}
		/* 仮想関数
		 * 継承先のクラスでこれらをオーバーライドする
		 * オーバーライドされていなければバグなのでwarn
		 */
		/* virtual */get value(){
			console.warn("virtual get value", this.name)
			return null
		}
		/* virtual */set value(val){
			console.warn("virtual set value", this.name)
		}
		/* virtual */appendTo($to){
			console.warn("virtual appendTo", this.name)
		}
	}
	// NumericUpDown管理クラス
	class NumericSet extends ConfigControl {
		constructor(name, options, attr){
			super(name, options)

			this.$numeric = document.createElement("input")
			this.$numeric.type = 'number'
			this.$numeric.name = name
			this.$numeric.value = this.getInitial()
			this.$numeric.attr(attr)

			this.$numeric.addEventListener(
				'change', () => this.onchange()
			)
		}
		get value(){
			if( isNaN(this.$numeric.value) ){
				this.$numeric.value = this.defaultValue
			}
			return this.$numeric.value
		}
		set value(val){
			this.$numeric.value = parseInt(val, 10) || this.defaultValue
		}
		appendTo($to){
			$to.appendChild(this.$numeric)
		}
	}
	// コンボボックス管理クラス
	class ComboSet extends ConfigControl{
		constructor(name, options){
			super(name, options)

			this.$combo = document.createElement("select")
			this.$combo.attr("name", name)
			this.$combo.addEventListener(
				'change', () => this.onchange()
			)

			if( options.items != null ){
				this.addItems(options.items, this.getInitial())
			}

		}
		get value(){
			return this.$combo.value
		}
		set value(val){
			this.selectItem(val)
		}
		addItems(itemParams, sel = null){
			itemParams.forEach(
				(elm, i) => {
					let value, text
					if( typeof(elm) == "string" ){
						value = text = elm
					}else{
						value = elm.value
						text = elm.text || value
					}
					const $item = document.createElement("option")
					$item.value = value || "option"+i
					$item.textContent = text || $item.value
					this.$combo.appendChild($item)
				}
			)
			if( sel != null ) this.selectItem(sel)
		}
		selectItem(target){
			if( typeof target == "number" ){
				this.$combo.selectedIndex = target
			}else if( typeof target == "string" ){
				this.$combo.value = target
			}
		}
		appendTo($to){
			$to.appendChild(this.$combo)
		}
//		isDefault(){
//			if( typeof this.defaultValue == "number" ){
//				return this.$combo.selectedIndex == this.defaultValue
//			}else if( typeof this.defaultValue == "string" ){
//				return this.$combo.value == this.defaultValue
//			}
//			return false
//		}
	}
	// ラジオボタン管理クラス
	class RadioSet extends ConfigControl {
		constructor(name, options){
			super(name, options)
			this.selected_ = null
			this.items = []

			if( options.items != null ){
				this.addItems( options.items, this.getInitial() )
			}
		}
		get state(){
			return this.selected_
		}
		set state(val){
			if( val >= 0 && val < this.items.length ){
				this.selected_ = val
				this.items[val].$radio.checked = true
				this.onchange()
			}
		}
		selectedIndex(){
			return this.selected_
		}
		selectedItem(){
			let i = this.selectedIndex()
			if( i < 0 || i >= this.items.length ){
				i = this.defaultValue
			}
			return this.items[i]
		}
//		isDefault(){
//			return this.selectedIndex() == this.defaultValue
//		}

		addItems(itemParams, sel = null){
			itemParams.forEach(
				(elm, i) => {
					const nameItem = `${this.name}-item-${i}`
					const forId = elm.id    || nameItem
					const value = elm.value || nameItem
					const title = elm.title || nameItem
					const text  = elm.text  || nameItem

					const $label = document.createElement("label")
					$label.attr(
						{
							'for':   forId,
							'title': title,
						}
					)
					const $radio = document.createElement("input")
					$radio.attr(
						{
							'type': "radio",
							'name': this.name,
							'id':   forId,
						}
					)
					$radio.addEventListener(
						'change', () => {
							this.selected_ = i
							this.onchange()
						}
					)
					$label.appendChild( $radio )
					$label.appendChild( document.createTextNode(text) )

					this.items.push(
						{
							'value':  value,
							'$radio': $radio,
							'$label': $label
						}
					)
				}
			)

			if( sel != null ) this.state = sel
		}
		appendTo($to){
			this.items.forEach(
				elm => $to.appendChild( elm.$label )
			)
		}
	}



	/// コンフィグメニュー
	const $config = document.createElement("div")
	$config.id = "apc-config"
	// バブリングストップ
	$config.addEventListener(
		'click', e => e.stopPropagation()
	)


	const $createH4 = (title, text) => {
		const $h4 = document.createElement("h4")
		$h4.title = title
		$h4.textContent = text
		return $h4
	}
	///config/ 表示する条件
	$config.appendChild( $createH4(
		"APCが表示されるページ",
		"The page on which Autopagerize_Console is display")
	)
	const radioDisplayRule = new RadioSet(
		"display_rule",
		{
			'onchange': function(){
				$panel.attr(this.name, this.selectedItem().value)
			},
			'items': [
			{
				'id': "apc-mdAlways",
				'value': "always",
				'text': "always",
				'title': "常に表示",
			},
			{
				'id': "apc-mdValid",
				'value': "valid",
				'text': "only when \"AutoPagerize\" is valid",
				'title': "AutoPagerizeが有効なページであれば表示\n（Alt+Ctrl+pで設定画面を表示）",
			}
			]
		}
	)
//	radioDisplayRule.isAlways = function(){
//		return this.selectedItem() == 0
//	}
//	radioDisplayRule.isValid = function(){
//		return this.selectedItem() == 1
//	}
	radioDisplayRule.appendTo($config)

	///config/position/ マウスが外れている時の表示
	$config.appendChild(
		$createH4(
			"マウスが外れている時の表示",
			"Appearance when non-hover"
		)
	)
	const radioNonHover = new RadioSet(
		"non_hover",
		{
			'onchange': function(){
				$panel.attr(this.name, this.selectedItem().value)
			},
			'items': [
			{
				'id': "apc-no_change",
				'value': "no_change",
				'text': "No change",
				'title': "変更しない",
			},
			{
				'id': "apc-transparent",
				'value': "transparent",
				'text': "Transparent",
				'title': "背景を透過",
			},
			{
				'id': "apc-stealth",
				'value': "stealth",
				'text': "Stealth",
				'title': "隠れる",
			}
			]
		}
	)
	radioNonHover.appendTo($config)

	const $createInputRow = (title, text) => {
		const $row = document.createElement("div")
		$row.className = "apc-mItem"
		$row.title = title
		$row.textContent = text
		return $row
	}
	const $createGroupBox = subject => {
		const $box = document.createElement("div")
		$box.className = "apc-group"
		const $subject = document.createElement("h5")
		$subject.textContent = subject
		$box.appendChild($subject)
		return $box
	}
	/// 位置設定
	const UpdatePanelPos = () => {
		$panel.style[comboPanelPosY.value] =
		  numericPanelPosValue.value + comboPanelPosUnit.value
	}
	const UpdateBoxPos = ($elm, val) => {
		$elm.style.height = val+"px"
	}
	const UpdateAllPositon = () => {
		UpdatePanelPos()
		UpdateBoxPos( $spacingBox12, numericSpecing12.value)
		UpdateBoxPos( $spacingBox23, numericSpecing23.value)
	}
	///config/ 位置
	$config.appendChild( $createH4( "位置設定", "Expression style") )

	//config/position/ パネル位置
	const $panelPos = $createInputRow(
		"パネル位置",
		"panel position Y:"
	)
	$config.appendChild($panelPos)

	///config/position/panelPos/ 使用単位
	const comboPanelPosY = new ComboSet(
		"panel_position_y", {
			'items': [ "top", "bottom"],
			'onchange': () => {
				$panel.style.removeProperty("top")
				$panel.style.removeProperty("bottom")
				UpdatePanelPos()
			}
		}
	)
	comboPanelPosY.appendTo($panelPos)
	///config/position/panelPos/ 座標
	const numericPanelPosValue = new NumericSet(
		"panel_position_value", {
			'defaultValue': 48,
			'onchange': UpdatePanelPos,
		}
	)
	numericPanelPosValue.appendTo($panelPos)
	///config/position/panelPos/ 使用単位
	const comboPanelPosUnit = new ComboSet(
		"panel_position_unit", {
			'items': ["px","%"],
			'onchange': UpdatePanelPos,
		}
	)
	comboPanelPosUnit.appendTo($panelPos)

	///config/position/ オプションボックス
	const $optionGroup = $createGroupBox("Option box")
	$config.appendChild($optionGroup)
	///config/position/optionBox/ 並び順
	const $optionOrder = $createInputRow( "並び順", "Order:")
	$config.appendChild($optionOrder)
	const numericOptionOrder = new NumericSet(
		"option_order",
		{
			'defaultValue': 1,
			'onchange': function(){
				$optionBox.style.order = this.value*2-1
			},
		},
		{ 'min': 1, 'max': 3}
	)
	numericOptionOrder.appendTo($optionOrder)
	$optionGroup.appendChild($optionOrder)
	/// 展開方向
	const optionDirOptions = {
		'items':
		[ "Left", "Right", "Up", "Down",
		{value: "Up_protrude", text: "Up (protrude)"},
		{value: "Down_protrude", text: "Down (protrude)"} ],
		'defaultValue': "Up",
		'onchange': function(){
			$optionBox.attr(this.name, this.value)
		}
	}
	///config/position/optionBox/ 有効ページでの展開方向
	const $optionValidForm = $createInputRow(
		"Autopagerizeが有効なページでの展開方向",
		"Direction when AP is valid:"
	)
	const comboOptionDirValid = new ComboSet(
		"option_dir_valid", optionDirOptions
	)
	comboOptionDirValid.appendTo($optionValidForm)
	$optionGroup.appendChild($optionValidForm)
	///config/position/optionBox/ 対象外ページの展開方向
	const $optionInvalidForm = $createInputRow(
		"Autopagerizeが有効でないページでの展開方向",
		"Direction when AP is invalid:"
	)
	const comboOptionDirInvalid = new ComboSet(
		"option_dir_invalid", optionDirOptions
	)
	comboOptionDirInvalid.appendTo($optionInvalidForm)
	$optionGroup.appendChild($optionInvalidForm)

	///config/position/scrollerBox/ BOX1とBOX2の間隔
	const $specing12 = $createInputRow(
		"BOX1とBOX2の間隔",
		"Specing between to BOX1 and BOX2:"
	)
	const numericSpecing12 = new NumericSet(
		"spacing_12",
		{
			'onchange': function(){
				UpdateBoxPos( $spacingBox12, this.value)
			}
		}
	)
	numericSpecing12.appendTo($specing12)
	$specing12.appendChild(document.createTextNode(" px"))
	$config.appendChild($specing12)

	///config/position/ スクローラーボックス
	const $scrollerGroup = $createGroupBox("Scroller box")
	$config.appendChild($scrollerGroup)
	///config/position/scrollerBox/ 並び順
	const $scrollerOrder = $createInputRow( "並び順", "Order:")
	$config.appendChild($scrollerOrder)
	const numericScrollerOrder = new NumericSet(
		"scroller_order",
		{
			'defaultValue': 2,
			'onchange': function(){
				$scrollerBox.style.order = this.value*2-1
			}
		},
		{ 'min': 1, 'max': 3}
	)
	numericScrollerOrder.appendTo($scrollerOrder)
	$scrollerGroup.appendChild($scrollerOrder)
	///config/position/scrollerBox/ 配置形状
	const $scrollerForm = $createInputRow(
		"配置形状\n（AP対象外ページでは自動的にボタンが２つになるので無視される）",
		"Form when AP is valid:"
	)
	const comboScrollerForm = new ComboSet(
		"scroller_form", {
			'items': ["Slim","Square"],
			'onchange': function(){
				$scrollerBox.attr( this.name, this.value)
			}
		}
	)
	comboScrollerForm.appendTo($scrollerForm)
	$scrollerGroup.appendChild($scrollerForm)

	///config/position/pageIndexBox/ BOX2とBOX3の間隔
	const $specing23 = $createInputRow(
		" BOX2とBOX3の間隔",
		"Specing between to BOX2 and BOX3:"
	)
	const numericSpecing23 = new NumericSet(
		"spacing_23",
		{
			'onchange': function(){
				UpdateBoxPos( $spacingBox23, this.value)
			}
		}
	)
	numericSpecing23.appendTo($specing23)
	$specing23.appendChild(document.createTextNode(" px"))
	$config.appendChild($specing23)

	///config/position/ ページインデックスボックス
	const $pageIndexGroup = $createGroupBox("PageIndex box")
	$config.appendChild($pageIndexGroup)
	///config/position/pageIndexBox/ 並び順
	const $pageIndexOrder = $createInputRow( "並び順", "Order:")
	$config.appendChild($pageIndexOrder)
	const numericPageIndexOrder = new NumericSet(
		"pageindex_order",
		{
			'defaultValue': 3,
			'onchange': function(){
				$pageIndexBox.style.order = this.value*2-1
			}
		},
		{ 'min': 1, 'max': 3}
	)
	numericPageIndexOrder.appendTo($pageIndexOrder)
	$pageIndexGroup.appendChild($pageIndexOrder)
	///config/position/pageIndexBox/ 配置形状
	const $pageIndexForm = $createInputRow(
		"配置形状\n（AP対象外ページでは自動的に非表示となるので無視される）",
		"Form when AP is valid:"
	)
	const comboPageIndexForm = new ComboSet(
		"page_index_form",
		{
			'items': ["Pile", "Strip", "Growed Pile"],
			'onchange': function(){
				$pageIndexBox.attr( this.name, this.value)
			}
		}
	)
	comboPageIndexForm.appendTo($pageIndexForm)
	$pageIndexGroup.appendChild($pageIndexForm)
	///config/position/pageIndexBox/ 展開方向
	const $pageListExpand = $createInputRow(
		"展開方向",
		"Page-list expand direction:"
	)
	const comboPageListExpand = new ComboSet(
		"page_list_expand",
		{
			'items': [
			"Upper", "Lower",
			"Left-upper", "Left-lower",
			"Right-upper", "Right-lower"
			],
			'defaultValue': "Lower",
			'onchange': function(){
				$pageIndexBox.attr( this.name, this.value)
			}
		}
	)
	comboPageListExpand.appendTo($pageListExpand)
	$pageIndexGroup.appendChild($pageListExpand)



	const $mButtons = document.createElement("div")
	$mButtons.id = "apc-mButtons"
	$config.appendChild($mButtons)

	///config/ 閉じるボタン
	const $mCloseDecision = document.createElement("input")
	$mCloseDecision.attr(
		{
			'id': "apc-mCloseDecision",
			'class': "apc-config_button",
			'type': "button",
			'value': "OK",
		}
	)
	$mCloseDecision.addEventListener(
		'click', () => config.close()
	)
	$mButtons.appendChild($mCloseDecision)
	const $mCloseCancel = document.createElement("input")
	$mCloseCancel.attr(
		{
			'id': "apc-mCloseCancel",
			'class': "apc-config_button",
			'type': "button",
			'value': "Cancel",
		}
	)
	$mCloseCancel.addEventListener(
		'click', () => config.close(false)
	)
	$mButtons.appendChild($mCloseCancel)

	// コンフィグダイアログ
	const $configDialog = document.createElement("div")
	$configDialog.id = "apc-configDialog"
	$configDialog.addEventListener(
		'click', () => config.close()
	)
	$configDialog.appendChild($config)
	document.body.appendChild($configDialog)



	class Config {
		constructor(name, options = null){
			this.name = name
			this.tempParams = null
			this.init(options)
		}
		init(options){
			if( options == null ) return
			if( options.items != null ) this.items = options.items
			if( options.onopen != null ) this.onopen_  = options.onopen
			if( options.onclose != null ) this.onclose_ = options.onclose
		}
		open(){
			this.tempParams = this.getParams()
			if( typeof this.onopen_ == "function" ){ this.onopen_(); }
		}
		close(decision = true){
			if( decision ) this.save()
			else this.restore(this.tempParams)
			this.tempParams = null

			if( typeof this.onclose_ == "function" ){ this.onclose_(); }
		}
		restore(params){
			if( params == null ){
				this.items.forEach( elm => elm.setDefault() )
			}else{
				this.items.forEach( elm => elm.restoreState(params) )
			}
		}
		getParams(){
			const params = {}
			this.items.forEach(
				elm => params[elm.name] = elm.state
			)
			return params
		}
		save(){
			GM.setValue( this.name, this.getParams() )
		}
		load(){
			GM.getValue( this.name, null).then(
				result => this.restore(result)
			)
		}
	}
	const config = new Config(
		"config",
		{
			'onopen': () => $panel.setAttribute("config", true),
			'onclose': () => {
				$panel.removeAttribute("config")
				UpdateAllPositon()
			},
			'items': [
			radioDisplayRule,        radioNonHover,
			comboPanelPosY,
			numericPanelPosValue,    comboPanelPosUnit,
			numericOptionOrder,
			comboOptionDirValid, comboOptionDirInvalid,
			numericSpecing12,
			numericScrollerOrder,
			comboScrollerForm,
			numericSpecing23,
			numericPageIndexOrder,
			comboPageIndexForm,
			comboPageListExpand
			]
		}
	)

	// enableの変更を反映
	const updateEnable = (toggle = null, save = true) => {
		apEnable.state = toggle === null ? !apEnable.state : toggle
		$enabler.attr(
			apEnable.state ?
			{
				'state': "enable",
				'alt': "E",
				'title': "AutePagerize OFF (Now:Enable)"
			} :
			{
				'state': "disable",
				'alt': "D",
				'title': "AutePagerize ON (Now:Disable)"
			}
		)
		if( save ){
			GM.setValue( apEnable.name, apEnable.state)
		}
	}
	///panel/optionBox// APイベントをキャプチャー
	document.addEventListener(
		'AutoPagerizeToggleRequest',  () => updateEnable()
	)
	document.addEventListener(
		'AutoPagerizeEnableRequest',  () => updateEnable(true, false)
	)
	document.addEventListener(
		'AutoPagerizeDisableRequest', () => updateEnable(false, false)
	)

	// リクエストを発行
	const RequestEnableOrDisable = enable => {
		FireEvent( enable ?
			'AutoPagerizeEnableRequest' :
			'AutoPagerizeDisableRequest'
		)
	}

	// すべての状態をロードする
	const loadState = () => {
		GM.getValue( apEnable.name, true)
		  .then(
		  	result => {
		  		apEnable.state = result
				RequestEnableOrDisable(result)
		  		
		  	}
		  )
		config.load()
		UpdateAllPositon()
	}
	loadState()
	// タブを切り替えた時にステータスを最新に同期する
	window.document.addEventListener(
		'visibilitychange',
		() => {
			if( window.document.visibilityState == 'visible' ){
				loadState()
			}
		}
	)
	// AutoPagerize有効なページでのみ行う処理
	const updateApValid = () => {
		setTimeout(
			() => {
				RequestEnableOrDisable(apEnable.state)
			},
			100
		)
		$panel.attr( "ap_valid", true)
	}
	/// APメッセージバー（アドオン版）かAPアイコン（スクリプト版）が
	/// 存在する、もしくは挿入されると、APが有効なページであるとみなす。
	const apObject =
	  document.getElementById("autopagerize_message_bar") ||
	  document.getElementById("autopagerize_icon")
	if( apObject != null ){
		updateApValid()
	}else{
		const mo = new MutationObserver(
			mRecs => {
				for( let rec of mRecs ){
					for( let $added of rec.addedNodes ){
						if( ["autopagerize_message_bar", "autopagerize_icon"]
							  .includes($added.id) )
						{
							updateApValid()
							mo.disconnect()
						}
					}
				}
			}
		)
		mo.observe( document.body, {'childList': true})
		document.addEventListener(
			'GM_AutoPagerizeNextPageLoaded',
			() => mo.disconnect()
		)
	}

	let scrTop = document.documentElement.scrollTop
	let oldPage = null
	// ウィンドウのスクロールが発生した時
	window.addEventListener(
		'scroll',
		() => {
			scrTop = document.documentElement.scrollTop
			// 現在のページを更新
			const np = getNowPage()
			if( np != oldPage ){
				$sequencerNow.textContent = np+1
				oldPage = np
			}
		}
	)
	// 各ページを管理する配列
	let pageBounds = [0]
	// 現在のページを取得（境界線上を前ページとみなす場合false）
	const getNowPage = (notLess=true) => {
		const breakOver = notLess ?
		(st, bound) => st >= bound :
		(st, bound) => st > bound 
		let i
		for( i = pageBounds.length-1; i >= 0; i-- ){
			if( breakOver( scrTop, pageBounds[i]) ) break
		}
		return i
	}
	const getBottomPos = () => {
		return Math.max(
			document.body.clientHeight,
			document.body.scrollHeight,
			document.documentElement.scrollHeight,
			document.documentElement.clientHeight) -
		window.innerHeight
	}

	// ページを継ぎ足した時、継ぎ目の位置を記録する
	const apPageAppended = () => {
		// セパレーターの絶対位置を取得
		const $apSep = document.getElementsByClassName("autopagerize_page_separator")
		const len = $apSep.length

		let sepPos = $apSep.item(len-1).getBoundingClientRect().top + window.pageYOffset
		sepPos = Math.round(sepPos)
		if( !pageBounds.includes(sepPos) ){
			pageBounds.push(sepPos)
		}
		$sequencerMax.textContent = len+1

		// ページリストアイテムを追加
		$pageList.appendChild( $createPageListItem(len+1) )
	}

	document.addEventListener(
		'GM_AutoPagerizeNextPageLoaded',
		() => apPageAppended()
	)

	let scrTick = null
	// 任意の位置にスクロール
	const smoothScrollTo = targetY => {
		// 続けてスクロールさせるとキャンセルして新たなスクロール
		if( scrTick != null ){
			clearTimeout(scrTick)
			scrTick = null
		}
		// 再帰処理部分
		const smoothScrollTick = (_targetY) => {
			// 常に最新の位置をターゲットにしたい場合、引数に関数を渡す
			// （最下部へのスクロール用。
			// 　なぜかスクロール途中にページの高さが変わる場合がある）
			let targetY = (typeof(_targetY) == "function" ?
				_targetY() :
				_targetY)
			// 移動量
			let moveY = (targetY-scrTop)/10
			// 終了条件
			let endOver
			// 下方向の移動量調整と終了条件
			if( moveY>0 ){
				moveY = Math.ceil(moveY); //切り上げ
				endOver = scrTop+moveY>=targetY; //ターゲットを越えていれば
			}
			// 上方向の移動量調整と終了条件
			else{
				moveY = Math.floor(moveY); //切り下げ
				endOver = scrTop+moveY<=targetY; //ターゲットを下回っていれば
			}
			// 条件を満たしていれば終了
			if( endOver ){
				window.scrollTo( 0, targetY)
				clearTimeout(scrTick)
				scrTick = null
			}else{
				window.scrollBy( 0, moveY)
				scrTick = setTimeout(
					() => smoothScrollTick(targetY),
					10
				)
			}
		}
		smoothScrollTick(targetY)
	}
})()
