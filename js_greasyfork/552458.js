// ==UserScript==
// @name			SOOP 하이라이트 댓글
// @namespace		http://tampermonkey.net/
// @version			1.0.1
// @description		SOOP 하이라이트 댓글 기능
// @author			YaManIn
// @match			https://*.sooplive.co.kr/station/*
// @require			http://code.jquery.com/jquery-latest.js
// @icon            https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant			GM_xmlhttpRequest
// @grant			GM_setClipboard
// @run-at			document-start
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/552458/SOOP%20%ED%95%98%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EB%8C%93%EA%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/552458/SOOP%20%ED%95%98%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EB%8C%93%EA%B8%80.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//상수
	const FLOATING_MENU_SELECTOR = "div[data-floating-ui-portal]";
	const COMMENT_MORE_CLASS = "__soopui__ButtonIcon-module__icBtn";
	const PROFILE_SELECTOR = "img[class^='__soopui__Image-module__image']";
	const COMMENT_REG_DT = "div[class^='CommentItem_registerDate_']";
	const NEW_BTN_LABEL = "하이라이트 복사하기";
	const COMMENT_BASE_URL = "https://api-channel.sooplive.co.kr/v1.1/channel/";
	const BASE_URL = window.location.href.split("?")[0].split("#")[0];

	//html태그 로딩 대기
	function waitForElement(selector, callBack, loop = 0, maxLoop = 3) {
		const element = document.querySelector(selector);
		if (element) {
			callBack(selector, element);
		} else {
			if (loop < maxLoop) {
				setTimeout(function () {
					waitForElement(selector, callBack, loop + 1, maxLoop);
				}, 10);
			} else {
				console.log('HTML 태그 찾지 못함');
			}
		}
	}

	//메뉴아이템 추가
	function injectMenuItem(info) {
		waitForElement(FLOATING_MENU_SELECTOR, function(selector, element) {
			const child = element.children[0];
			const clone = child.children[0].cloneNode(true);

			clone.querySelector('p').textContent = NEW_BTN_LABEL;
			clone.addEventListener("click", function() {
				copyHighlightLink(info);
			})

			if(child.children.length > 1) {
				child.insertBefore(clone, child.children[1]);
			} else {
				child.appendChild(clone);
			}
		});
	}

	function getCommentInfo(el) {
		var usrId = $(el).closest("div[class^='CommentItem_comment_']").find(PROFILE_SELECTOR).attr("alt");
		var regDt = $(el).closest("div[class^='CommentItem_comment_']").find(COMMENT_REG_DT).text();
		return {usrId : usrId ? usrId : null, regDt : regDt ? regDt : null};
	}

	function copyHighlightLink(info) {
		const apiPoint = BASE_URL.split("/station/")[1].split("?")[0].split("#")[0].split("/").slice(0, 3).join("/");
		const url = COMMENT_BASE_URL + apiPoint + "/comment";

		var param = {
			type : "GET",
			url : url,
			param : {
				page : 1
			},
			usrId : info.usrId,
			regDt : info.regDt,
			callback : function(data) {
                GM_setClipboard(BASE_URL.split("/station/")[0] + "/" + apiPoint + "#comment_noti" + data, "text");
                addToastMsg();
			}
		}
		loadCommentData(param);
	}

	function loadCommentData(options) {
		let apiUrl = options.url;
		if(options.type === "GET") {
			const query = new URLSearchParams(options.param).toString();
			if(query) apiUrl += (apiUrl.includes("?") ? "&" : "?") + query;
		}

		GM_xmlhttpRequest({
			method: "GET",
			url: apiUrl,
			onload: function(response) {
				if (typeof options.callback === "function") {
					var res = JSON.parse(response.responseText);
					var chkData = res.data.find(el => el.userId == options.usrId && el.regDate == options.regDt);
					if(chkData) {
						options.callback(chkData.pCommentNo); // 결과 전달
					} else {
						if(res.meta.lastPage > options.param.page) {
							options.param.page++;
							loadCommentData(options);
						}
					}
				}
			},
			onerror: function(error) {
				console.log("로딩 실패:", error);
			}
		});
	}

    function addToastMsg() {
        const banner = document.createElement("div");
        banner.textContent = "✅ 클립보드에 복사되었습니다.";
        Object.assign(banner.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(calc(-50% + 120px), -50%)",
            zIndex: 999999,
            padding: "10px 14px",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "18px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap"
        });
        document.documentElement.appendChild(banner);
        setTimeout(() => banner.remove(), 1000);
    }
//--------------------------------------------------//
	//1️. 댓글 더보기 버튼 클릭 시 플로팅메뉴에 버튼 추가
	$(document).on("click", "div[class^='CommentList_commentList'] button[class^='__soopui__ButtonCommon-module__icBtn']", function(event) {
		if(event.currentTarget.tagName === 'BUTTON') {
			setTimeout(function() {
				injectMenuItem(getCommentInfo(event.currentTarget));
			});
		}
	});
})();