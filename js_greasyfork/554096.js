// ==UserScript==
// @name         2025华医公需课: 人工智能赋能
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  2025年公需课：<<人工智能赋能制造业高质量发展>> 自动听课和自动考试脚本.听完公需课后，有“待考试”的视频， 要手动点一下， 或让它自动再刷一轮。华医的其它课程可以自动听课，但没有自动
// @author       han2ee
// @include        http://cme*.91huayi.com/*
// @include        https://cme*.91huayi.com/*
// @include        https://dk.91huayi.com/*
// @include        https://sdnew.91huayi.com/*
// @run-at        document-start
// @grant   GM_xmlhttpRequest
// @grant   GM.setValue
// @grant   GM.getValue
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554096/2025%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%3A%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E8%B5%8B%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/554096/2025%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%3A%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E8%B5%8B%E8%83%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const DK_HOST = "dk.91huayi.com";
    var courseInterID = 0;
    let first = true;
    // save the alert
    var _alert =window.alert;
    // ignore the alert
    function overrideSelectNativeJS_Functions () {
        window.alert = function alert (message) {
            console.log (message);
            return true;
        }
    }
    (function (funcToRun) {
        var D = document;
        var scriptNode = D.createElement ('script');
        scriptNode.type = "text/javascript";
        scriptNode.textContent = '(' + funcToRun.toString() + ')()';
        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    })(overrideSelectNativeJS_Functions);
    const requestAsync = function(url, data) {
        // console.log(data);
        return new Promise((resolve, reject) => {
            var reportAJAX_Error = (rspObj) => {
                console.error (`Request error: ${data}`);
                reject(`Request => Error ${data}  RES ${rspObj.status}!  ${rspObj.statusText}`);
            }

            var processJSON_Response = (rspObj) => {
                if (rspObj.status != 200 && rspObj.status != 304) {
                    reportAJAX_Error (rspObj);
                } else {
                    resolve(rspObj.responseText);
                }
            };
            GM_xmlhttpRequest ( {
                method:         "GET",
                url:            url,
                timeout: 6000,
                headers: {
                    "Referer": document.location.href,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                //data:           data,
                responseType:   "text/html",
                onload:         processJSON_Response,
                onabort:        reportAJAX_Error,
                onerror:        reportAJAX_Error,
                ontimeout:      reportAJAX_Error
            });
        });
    }

    const getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    const findFirstLesson = function(studyImgArr) {
        if (studyImgArr) {
            for (let i = 0; i < studyImgArr.length; i++) {
                if (studyImgArr[i].src.endsWith("anniu_01a.gif")) {
                    return i;
                }
            }
        }
        return -1;
    }
    const nextLesson = async function(cwid) {
        await wait(10 * 1000);
        let cid = await GM.getValue('cid');
        console.log("CID", cid);
        let hrefs = await GM.getValue(cid);
        for (let i = 0; i < hrefs.length - 1; i++) {
            if (hrefs[i].indexOf(cwid) != -1) {
                window.location.href = hrefs[i + 1];
            }
        }
    }

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    function isPromise(obj) {
        return !!obj && ((typeof obj === 'object' && typeof obj.then === 'function') || (typeof obj === 'function' && typeof obj().then === 'function'));
    }
    /**
     * Wait Resource.
     *
     * @param {Function} resourceFn pred function to check resource
     * @param {Object} options
     * @returns Promise
     */
    function waitResource(resourceFn, options) {
        var optionsRes = Object.assign(
            {
                interval: 3000,
                max: 10
            },
            options
        );
        var current = 0;
        return new Promise((resolve, reject) => {
            var timer = setInterval(() => {
                if (isPromise(resourceFn)) {
                    resourceFn().then(res => {
                        if(res) {
                            clearInterval(timer);
                            resolve();
                        }
                    });
                } else if (resourceFn()) {
                    clearInterval(timer);
                    resolve();
                }
                current++;
                if (current >= optionsRes.max) {
                    clearInterval(timer);
                    reject('Time out');
                }
            }, optionsRes.interval);
            });
    }

    const ANSWER_DICT = {
        // 2025年公需课：人工智能赋能制造业高质量发展
        '3b1a3ece-f378-4d36-9986-b16b00e6fdb6': ['f165a244-4e02-48d0-a215-b169012b5f80', '574d2df2-f95a-460f-98ba-b169012b5f80', '815bd9c0-8e80-41f5-a062-b169012b5f80', '69e04f4d-24ef-4686-a5ba-b169012b5f80'],
        '7fbab5de-4e67-4d4b-aaf7-098a43e8e30a': ['993a118f-6a82-4082-a0be-b2de0123bc4e'],
        '40b14fef-94c3-4419-9f9b-0ddb344269fe': ['7abfd10d-9f89-4b25-a1a4-b2de0123bc4e'],
        '1b971e45-91d4-481b-a298-600a46e4d939': ['992e9534-b9b1-40d3-999f-b2de0123bc4e'],
        '98e208bb-cf1e-4007-8383-a62f1a275baa': ['3d90c11b-8c7e-4243-8fe3-b2de0123bc4e'],
        '41bb8eb6-f9ab-4334-8ffb-afe774553a29': ['be8d2f3b-18ca-4e2d-9cf5-b2de0123bc4e'],
        '2181ef9f-ecff-42c5-ac1c-d1bcb4a5dada': ['523dd57f-9625-4e1d-889c-b2de0123bc4e'],
        '2bdd5e1e-3dc8-47f9-b5f9-e981cf579fbb': ['508c2c1a-47c4-4745-8be5-b2de0123bc4e'], // 7
        '9733fd30-8fe3-4b1a-bb6f-0675c710688d': ['8f5abcff-b899-4b8e-893b-b2de0123bc4e', 'c8ff5245-2131-4b7a-a328-b2de0123bc4e', '558448c5-16a1-49ea-bb89-b2de0123bc4e'], // m1
        'aa0c955d-2e72-42fa-a361-0c26807c4a85': ['749c0bfc-2c69-422f-8905-b2de0123bc4e', '5f13d0cc-96d0-4d9f-a9d8-b2de0123bc4e', '23d7c809-8690-4b67-b830-b2de0123bc4e'], // m2
        '5e9eef61-745f-4c00-9f89-2299ee15f8aa': ['74347e29-9393-436e-af7b-b2de0123bc4e', '14a0ca69-5f88-4964-ad47-b2de0123bc4e', 'a087caa7-819a-4f9d-8122-b2de0123bc4e', 'd82cb471-faf4-4974-a624-b2de0123bc4e'],
        '9dc5c848-1d7f-435f-a877-38a107dd1e4a': ['f67010c5-f1b7-45ec-9d4f-b2de0123bc4e', '35aba541-740e-4703-b799-b2de0123bc4e', '35a29775-e485-4f02-a865-b2de0123bc4e', 'c123d5a5-2a3c-46fc-a154-b2de0123bc4e'],
        '6f458aed-a1be-47d0-97a6-6c6600e5817c': ['8ecd3d85-31d6-4b96-9ae3-b2de0123bc4e', '92b02267-e298-4f8d-9320-b2de0123bc4e', 'ac98c99d-bf47-47fb-902a-b2de0123bc4e'],
        '1c6a241b-14a5-4543-9130-8c9d5e2364b3': ['50b13d55-1c33-4460-a57a-b2de0123bc4e', '16579acf-b8b4-4356-84b0-b2de0123bc4e'],
        '35b60d7f-edef-4652-a174-1b9c55b87ca4': ['Y'],
        '76c1906f-0b80-49a3-bef6-6ed84bf24a7b': ['N'],
        'bb767e22-a663-4372-ba5b-8bcc76c17c73': ['Y'],
        '156113fc-c13c-4afc-a51d-b87a2452cff6': ['Y'],
        '429eaf80-6aa5-4804-93dd-c8c65dbb861c': ['Y'],
        'be005110-d22b-401e-a50f-cffcdd8f4eae': ['Y'],
        '49c3c8f9-5d47-40b3-b01d-ec76e1f810b8': ['N'],

        // 依法执业，合规行医
        '9e6ec018-b8f6-4bee-a78f-b1d701708a72': ['2379d756-240f-4754-85dd-abe801374819', '74d931e1-f528-461f-9c86-aed200f5dfcc', '7b9bb0ed-602b-4fa8-8864-abe801374819', '20eeeceb-da10-4fee-a6d3-abe801374819', '2f81fccf-5798-42e4-8b65-abe801374819'],
        'ccd47ed8-c88d-4827-9046-b1d701708a72': ['a6453c18-31b3-41f8-8416-abe801475376', '04276662-4676-4131-a8b9-abe801475376', 'd7a69b91-e3a5-48ee-bf0d-aed200f8a0bd', '459cac35-7cc4-430d-8f0b-aed200f9ccd8', '4f72098e-aefe-41b9-b495-abe801475376'],
        'bc3bc16f-c2c0-43ea-93ba-b1d7016d36a4': ['61cdd054-c6a8-4f51-a46b-ae4b00d03450', '4e868894-86d5-4f5f-a898-ae4b00d03450', '86214136-8c2a-407a-bf3e-ae4b00d03450', '5cd1e19a-d4c5-4815-b10f-ae4b00d03450', '9f3e920e-ef1a-42d3-bf76-ae4b00d03450'],
        '012789e3-62aa-4a6e-91cb-b1d7016d36a4': ['446a87d9-f2c0-4a05-834d-ae4b00cf5265', 'b75fe210-aa96-4e14-aa23-ae4b00cf5265', '860b163d-9c9e-47ce-9607-ae4b00cf5265', 'f9b1f7cb-9e80-4998-9876-ae4b00cf5265', 'a4670a1b-3081-4bca-8396-ae4b00cf5265'],
        'f4ea750f-943d-4285-a46f-b1d7016d5283': ['5b53952a-d95f-4cea-9afd-ae6b01243068', '4fde2b5b-9ee5-4c65-ab08-ae6b01243068', 'c870aa0f-98e1-4501-99bc-b2bf009cfa46', 'e339103b-d646-4e2b-875e-ae6b01243068', 'e5e5eed4-bd95-41ef-a1ff-ae6b01243068'],
        '88c1826a-c82d-4682-9bbe-b1d7016d5283': ['44417a71-a5dc-4c3e-80f1-ae6b0124405c', 'a3253592-5324-46c0-8916-ae6b0124405c', 'e26882b8-b0b9-48bd-a6b9-ae6b0124405c', 'ff9f571e-cefb-4fd6-a678-ae6b0124405c', 'bbb417b3-6fbb-471d-8452-ae6b0124405c'],

        // 医共体框架下的慢病防控及其智慧化管理
        '43515c51-7bd4-4cc3-b409-b1de010f13f3': ['1458f01a-44c2-4dcb-998f-b099010f5071', '3bcc06e4-8273-4aba-be88-b099010faa64', '5a47da11-2478-4a2f-93af-b099010f5071', '87325485-10e1-4513-a8be-b099010f5071', '1b1f1254-d905-4fdb-a5be-b099010f5071'],
        '74861118-0744-4dd7-b0d3-b1de010ffd04': ['70e70bf9-4f4d-42d3-8761-ae5800a39f03', 'a14fb963-d0c3-4e9c-90a9-ae5800a39f03', 'c0ef5c99-6b2b-4fd4-97f0-ae5800a39f03', '564e9c33-2d8e-4bb9-9397-ae5800a39f03', 'ccb6c198-4b82-4b40-bc97-ae5800a39f03'],
        'b2be6457-e49b-4505-94c7-b1de01102516': ['0c8a6d5a-9414-4602-a01f-b099010806a5', '7d69187b-af1a-4733-9773-b099010806a5', '182a599d-fb8a-4273-91b9-b099010806a5', '9eba7e3b-bf4f-4e0b-a40e-b099010806a5', '44dda92f-da47-457b-9d54-b099010806a5'],
        'f2a25435-8057-4a7d-a184-b1de01106fbb': ['7ee276fa-89e1-411e-8960-af040114cda7', 'd40bce4e-3e08-446a-9948-af040114cda7', 'c150d115-abfa-4a13-a362-af040114cda7', '08a9aec6-1cbc-4e62-8391-af040114cda7', 'c394ce60-ebba-4709-b5cd-af040114cda7'],
        'c0119eaf-bf85-4dfe-bf3d-b1de0118027f': ['e1962e0b-084e-4ab0-a853-af550101a423', '8e841cb6-0e9a-4716-9534-af5501018dd3', 'f97304f3-bca8-44d4-9f0d-af5501018159', '2ccb1cef-9d6c-454d-8234-af5501016e95', '71e01d3f-2930-4d67-bb15-af55010198a1'],
        '3e5b8390-1ffb-4429-9a64-b1de011ee6d7': ['d9de8ec1-e5d9-43a0-aca7-ad3d0114a568', 'b42b12e2-4918-4590-8110-ad3d0114a568', '1ca66f7f-13ec-4e59-92d2-b07b00b6428b', '99bdb141-cd40-4d8c-99cd-ad3d0114a568', 'e6d5e0a8-d01e-4b7f-8560-ad3d0114a568'],

        // 药物过敏性休克的预防与救治
        '940ece7f-4d1c-49aa-9146-b1d80132f714': ['79d35f13-177c-4121-bf5f-a98c00f03911', '2cf2afdd-cd76-429a-b310-a98c00f03911', '6ab7aa9f-4e3d-4426-929e-a98c00f03911', '02e24d3a-eeb0-4823-aa42-a98c00f03911', 'c98ca22b-86f9-47cf-90c3-a98c00f03911'],
        '728313ab-a3e4-4a26-bdba-b1d80120cad8': ['cb9bcc8e-e7d4-42f8-8a84-aff100fe3de3', '4f54eb44-af06-4c45-bd60-aff100fe3de3', 'f1b188da-6ff3-403b-a6cb-aff100fe5af1', 'f6f5728d-13d5-4a49-a414-aff100fe66c4', 'f983520d-67a0-4f9c-af4e-aff100fe3de3'],
        'f343797a-75fd-40cd-965c-b1c700d8a8a0': ['bbd9dd77-e8ed-4394-a57a-b03c01114810', 'ca7c1310-153c-48c7-a017-b03c01114810', '58bf3fe6-4eb4-4bb1-bdaa-b03c01114810', 'e91566d2-d0a3-4547-a5d5-b03c01114810', '61c851b9-0a87-4800-b892-b03c01114810'],
        '9ba90f7e-c1a8-4731-bdc1-b1c700dd6a57': ['d4c2cddd-3723-4172-a2d9-b03700dc6e30', '9e060a15-4461-40c9-a81c-b03700dc6e30', 'c5858a3b-247a-4da8-9445-b03700dc6e30', 'a2ea36d1-6eb2-46d9-b348-b03700dc6e30', '420edf0f-d9fe-4ac6-88ae-b03700dc6e30'],
        'f304c57e-f582-40dd-b8ff-b1c700dd89b5': ['c22bd9ac-c989-48dd-80f8-b02201246458', 'f74f5fc2-94d4-4670-afeb-b02201246458', '19255f48-2e6a-4ca1-beb9-b02201246458', '626895bf-1d68-4365-8917-b02201246458', '6bab20d2-0856-4239-854b-b02201246458'],
        '2b7e2476-a02e-4d88-94c4-b1d8011f5312': ['7e52b006-936c-4f0d-9c46-abcd00a41e71', 'b46f2ec5-92e5-47ba-918c-abcd00a41e71', 'b224b7b6-4a75-4800-9143-abcd00a41e71', 'c62c118b-afdc-4259-be84-abcd00a41e71', '29af96ee-561d-45fb-bcf8-abcd00a41e71'],

        // 健康管理与传染病控制
        '0c8ce35a-dc4f-47f4-95ad-b1d801011054': ['6f524538-a193-43f8-a1e9-acf701098315', 'f39e2f37-837f-4d77-af53-acf701098315', '3a67aa68-6d55-4845-b7c0-acf701098315', 'b017b203-bf5c-48ff-b724-acf701098315', 'ee3d1808-7285-40d3-8af3-acf701098315'],
        '67d6a98d-b4e1-4ca7-a766-b1d801011054': ['236f64e0-6f07-4126-a6d1-acf701117159', 'ecb86520-283e-4d60-8127-acf701117159', '4744051f-8f39-44d4-9e8f-acf701117159', '7b2a5b04-3053-433c-8c92-acf701117159', 'b785e76c-3d69-47d2-b673-acf701117159'],
        'cf4658d1-6f36-46c9-9ac5-b1d801011054': ['2ee9f6d0-a369-4986-b334-acf701174af7', '6eff6c34-d3ac-4fc6-88c6-acf701174af7', 'cd882c82-0716-41cc-81dc-acf701174af7', '574561a8-013e-449a-a0e3-acf701174af7', '68fb859d-8746-4ae5-8e63-acf701174af7'],
        '5ed2ac43-5ef4-4a9b-9622-b1ee005b38c0': ['c8c7c53c-4348-49a7-b192-69be2922f8e8', '1e5c303c-8595-47fe-86b0-8c903ae8827b', 'fc4971a3-e319-495b-bbde-d2b5a1815023', '7ac878eb-88a2-4978-8c2e-fc57b75df9cc', '1ab5d35c-30d3-49bb-8a22-ef0e66ee96af'],
        '3f958a2d-073e-44c4-add7-b243009f2307': ['9960d50c-60a6-42fd-abe1-af00011f6a10', '072c73d3-47e7-4f08-92fa-af00011f6a10', '2bb2155e-e936-4627-a58f-af00011f6a10'],
        '45101661-3f77-4dce-bb2a-b243009f2307': ['e7fdb15b-5bb1-44dc-a280-af00011f9a87', '56a27d0c-3918-4863-b0d9-af00011f9a87'],
    };

    // intercept alert window
    if (getUrlParameter('cwid') ||　getUrlParameter('cid')) {
        let alrtScope;
        if (typeof unsafeWindow === "undefined") {
            alrtScope = window;
        } else {
            alrtScope = unsafeWindow;
        }
        alrtScope.alert = function (str) {
            console.log ("Greasemonkey intercepted alert: ", str);
        };
    }
    if (window.top !== window.self) {
        return;
    }
    // 单个课程页面
    if (window.location.host !== DK_HOST && (window.location.pathname == '/course_ware/course_ware_polyv.aspx' || window.location.pathname == '/course_ware/course_ware_cc.aspx')) {
        console.log("单个课程页面");
        /*
        // 修改播放器init参数 倍速：'speed': true  可拖动'ban_seek': false
        let scriptIndex = 0;
        new MutationObserver(function(mutations) {
            // check at least two H1 exist using the extremely fast getElementsByTagName
            // which is faster than enumerating all the added nodes in mutations
            let scriptList = document.getElementsByTagName('script');
            if (scriptList.length > 10) {
                this.disconnect(); // disconnect the observer
            }
            for (; scriptIndex < scriptList.length; scriptIndex++) {
                let scriptEle = scriptList[scriptIndex];
                if (scriptEle.innerHTML && scriptEle.innerHTML.indexOf("'speed': false")) {
                    scriptEle.innerHTML = scriptEle.innerHTML.replace("'speed': false", "'speed': true").replace("'ban_seek': banSeek", "'ban_seek': false");
                    console.log("REPLACE");
                    this.disconnect();
                    break;
                }
            }
        }).observe(document, {childList: true, subtree: true});
        */
        // 拦截first,不让加载视频中间的问题
        let inter = setInterval(function() {
            try {
                if (first &&　typeof player !== "undefined") {
                    first = false;
                    console.log("FIRST:", first);
                    player.sendQuestion = function(data) {};
                    clearInterval(inter);
                }
            } catch (err) {
                console.log(err);
            }
        }, 10);
        let initRateFlag = true;
        let lastTime = 0;
        courseInterID = setInterval(async function() {
            if (first) { // mare sure the player.sendQuestion is empty function
                console.log("sendQuestion should be empty function");
                return;
            }

            if (typeof closeProcessbarTip === "function") { // close the warning
                closeProcessbarTip();
            }
            if (!$("#jrks")[0].getAttribute('disabled')) { // finish lesson
                let cwid = getUrlParameter('cwid');
                if (ANSWER_DICT[cwid]) {
                    try {
                        console.log("try to do exam:");
                        $("#jrks")[0].click();
                        clearInterval(courseInterID);
                    } catch (err) {
                        console.error(err);
                    }
                } else { // jump to next
                    await nextLesson(cwid);
                    clearInterval(courseInterID);
                }
            }
            await GM.setValue("curCWID", getUrlParameter('cwid'));

            // Resume video
            if (window.location.pathname == '/course_ware/course_ware_polyv.aspx') {
                let curTime = player.j2s_getCurrentTime();
                if (curTime === lastTime && curTime < player.j2s_getDuration()) {
                    console.log(curTime, "try to resume");
                    // resume
                    player.j2s_setVolume(0); // avoid the "user didn't interact with doc" error
                    player.j2s_resumeVideo();
                    console.log("resume successfully");
                }
                lastTime = curTime;
            } else {
                let curTime = player.getPosition();
                if (curTime === lastTime && curTime < player.getDuration()) {
                    console.log(curTime, "try to resume");
                    // resume
                    player.setVolume(0); // avoid the "user didn't interact with doc" error
                    // player.j2s_resumeVideo();
                    console.log("resume successfully");
                }
                lastTime = curTime;
            }
            /*
            if (initRateFlag) {
                let rate = await GM.getValue('rate', 1);
                if (player) {
                    player.changeRate(rate);
                    initRateFlag = false;
                }
            } else {
                await GM.setValue('rate', player.currentRate);
            }
            */
        }, 3000);
    }

    if (window.location.pathname == '/pages/noplay.aspx') {
        setTimeout(async function() {
            let cwid = await GM.getValue("curCWID");
            window.location.href = "/course_ware/course_ware.aspx?cwid=" + cwid;
            // document.querySelector(".yes").click();
        }, 5000);
    }
    // 考试页面
    if (window.location.pathname == '/pages/exam.aspx') {
        setTimeout(async function() {
            await waitResource(() => !!document.querySelector("#btn_submit"));
            let cwid = getUrlParameter('cwid');
            console.log("CWID:", cwid);
            let answer = ANSWER_DICT[cwid];
            if (answer) {
                for (let item of answer) {
                    if (item.startsWith('gvQuestion')){
                        $('#' + item).click();
                    } else {
                        $(`[value=${item}]`).click();
                    }
                    await wait(200);
                }
                $('#btn_submit').click();
            }
        }, 3000);
    }

    if (window.location.pathname == '/ExamInterface/ComputerExamIndex') {
        setInterval(async function() {
            let qid = $('.dd_01').attr('questionid');
            let answer = ANSWER_DICT[qid];
            if (answer) {
                for (let item of answer) {
                    if (item.startsWith('gvQuestion')){
                        $('#' + item).click();
                    } else {
                        $(`[value=${item}]`).click();
                    }
                    await wait(500);
                }

                if ($('#btnNext') && $('#btnNext').css('display') != 'none') {
                    $('#btnNext').click();
                } else {
                    $('.submitExam').click();
                    await wait(500);
                    $('#subPaper').click();
                }
            }
        }, 5 * 1000);
    }
    // 考试结果页面
    if (window.location.pathname == '/pages/exam_result.aspx') {
        setTimeout(async function() {
            let cwid = getUrlParameter('cwid');
            await nextLesson(cwid);
        }, 3000);
    }
    // 目录页面
    if (window.location.pathname == '/pages/course.aspx') {
        console.log("目录面");
        let interId = setInterval(async function() {
            let hrefs = document.querySelectorAll(".course h3 a");
            let vals = [];
            for (let i = 0; i < hrefs.length; i++) {
                // if (hrefs[i].children[0].src.endsWith("anniu_01a.gif")) {
                vals.push(hrefs[i].href);
                // }
            }
            // console.log(vals);
            let cid = getUrlParameter('cid')
            await GM.setValue(cid, vals);
            await GM.setValue('cid', cid);
            console.log("Course list have been set.");
            clearInterval(interId);
        }, 3000);
    }

    // 医师定期考核目录页面
    if (window.location.pathname == '/course_ware/course_ware_list.aspx') {
        console.log("目录面");
        let interId = setInterval(async function() {
            // find the first course to learn
            let eles = document.querySelectorAll(".xx"); //.nextElementSibling.click()
            if (eles.length === 0) {
                eles = document.querySelectorAll(".wx");
            }
            if (eles.length > 0) {
                eles[0].nextElementSibling.click();
                clearInterval(interId);
            }
        }, 3000);
    }

    // 医师定期考核单个课程页面
    if (window.location.host === DK_HOST && window.location.pathname == '/course_ware/course_ware_polyv.aspx') {
        console.log("单个课程页面");
        // 拦截first,不让加载视频中间的问题
        let inter = setInterval(function() {
            try {
                if (first &&　typeof player !== "undefined") {
                    first = false;
                    console.log("FIRST:", first);
                    player.sendQuestion = function(data) {};
                    clearInterval(inter);
                }
            } catch (err) {
                console.log(err);
            }
        }, 10);
        let initRateFlag = true;
        let lastTime = 0;
        courseInterID = setInterval(async function() {
            if (first) { // mare sure the player.sendQuestion is empty function
                console.log("sendQuestion should be empty function");
                return;
            }

            if (typeof closeProcessbarTip === "function") { // close the warning
                closeProcessbarTip();
            }

            // Resume video
            let curTime = player.j2s_getCurrentTime();
            if (curTime === lastTime && curTime < player.j2s_getDuration()) {
                console.log(curTime, "try to resume");
                // resume
                player.j2s_setVolume(0); // avoid the "user didn't interact with doc" error
                player.j2s_resumeVideo();
                console.log("resume successfully");
            }
            lastTime = curTime;
            /*
            if (initRateFlag) {
                let rate = await GM.getValue('rate', 1);
                if (player) {
                    player.changeRate(rate);
                    initRateFlag = false;
                }
            } else {
                await GM.setValue('rate', player.currentRate);
            }
            */
        }, 3000);
    }
})();