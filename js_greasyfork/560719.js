// ==UserScript==
// @name         Pinterest Ads UTM
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Pinterest Ads UTM Tool For Saker!
// @author       Jimmy
// @include      *.pinterest.com/advertiser/*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @require      https://cdn.jsdelivr.net/npm/moment-timezone-all@0.5.5/builds/moment-timezone-with-data.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @license      AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_cookie
// @run-at       document-idle
// @connect      ycimedia.net
// @connect      openapi.ycimedia.net
// @downloadURL https://update.greasyfork.org/scripts/560719/Pinterest%20Ads%20UTM.user.js
// @updateURL https://update.greasyfork.org/scripts/560719/Pinterest%20Ads%20UTM.meta.js
// ==/UserScript==

(function() {
    //弹出框提示
    let toast = Swal.mixin({
        toast: true,
        position: 'center', // 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    //数据操作
    let util = {
        clog(c) {
            console.log(c);
        },
        getCookie(name) {
            let arr = document.cookie.replace(/\s/g, "").split(';');
            for (let i = 0, l = arr.length; i < l; i++) {
                let tempArr = arr[i].split('=');
                if (tempArr[0] == name) {
                    return decodeURIComponent(tempArr[1]);
                }
            }
            return '';
        },
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        getStorage(key) {
            return localStorage.getItem(key);
        },
        setStorage(key, value) {
            return localStorage.setItem(key, value);
        },
        blobDownload(blob, filename) {
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        },
        message: {
            success(text) {
                toast.fire({title: text, icon: 'success'});
            },
            error(text) {
                toast.fire({title: text, icon: 'error'});
            },
            warning(text) {
                toast.fire({title: text, icon: 'warning'});
            },
            info(text) {
                toast.fire({title: text, icon: 'info'});
            },
            question(text) {
                toast.fire({title: text, icon: 'question'});
            },
            popup(title,html) {
                toast.fire({title: title, icon: 'warning',html:html, showCloseButton: true,timer:60*60*60*1000});
            },
        },
        post(url, data, headers, type) {
            if (Object.prototype.toString.call(data) === '[object Object]') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        get(url, headers, type) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 404) {
                            requestObj.abort();
                        }
                        resolve(res.response || res.responseText);
                    },
                    onprogress: (res) => {
                    },
                    onloadstart() {
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        extractValueBetween(url, startKey, endKey) {
            // 找到startKey在URL中的位置
            const startIndex = url.indexOf(startKey);
            if (startIndex === -1) return null;

            // 找到startKey后面的斜杠或问号的位置
            const afterStart = url.substring(startIndex + startKey.length);
            const nextSlashOrQuestion = afterStart.search(/[\/?]/);

            // 提取startKey和下一个分隔符之间的部分
            let value;
            if (nextSlashOrQuestion === -1) {
                value = afterStart;
            } else {
                value = afterStart.substring(0, nextSlashOrQuestion);
            }

            // 检查是否包含endKey
            if (url.indexOf(endKey) === -1) return null;

            // 返回提取的值
            return value;
        }

    };

    let siteadd = false; //页面元素是否增加的标记
    let refreshdata = false; //重新通过接口获取数据
    let tracking = false; //执行标题

    let urlpath = window.location.pathname;
    let act = util.extractValueBetween(urlpath,'advertiser/','/reporting') || ""
    console.log('act',act);

    let from = util.getStorage(act+'_from') || ""; //起始日期
    let to = util.getStorage(act+'_to') || ""; //结束日期
    let type = util.getStorage(act+'_type') || ""; //广告类型
    let siteId = util.getStorage(act+'_siteId') || ""; //站点ID
    let siteName = util.getStorage(act+'_siteName') || ""; //站点名称
    let siteZone = util.getStorage(act+'_siteZone') || -10
    let trackBtn = util.getStorage(act+'_trackBtn') || "close"; //开关状态标记
    console.log(act+'_trackBtn',trackBtn);

    let campaignsElementClass = ".ADXRXN.MEP_vB"; //左上角广告账户选项元素
    let dateElementClass = 'div[data-test-id="datepicker-button"]'; //右上角日期元素
    let tableElementClass = "._219p"; //主体数据列表
    let tableElementClass2 = "tbody.om3e55n1.g4tp4svg"

    let utmdata = []; //接口数据列表

    //新增页面元素内容
    let addhtml = '<div id="sakerHtml" style="display: flex;align-items: center;">'
    addhtml += '<div class="sitelist">'
    addhtml += '<div class="dropdown">'
    addhtml += '<input type="text" placeholder="Select Shopify Site" value="'+siteName+'" id="myInput">'
    addhtml += '<div id="myDropdown" class="dropdown-content">'
    addhtml += '<a data-id="">Sample</a>'
    addhtml += '</div>'
    addhtml += '</div>'
    addhtml += '</div>'
    addhtml += '<div class="zone-box" style="display: flex;align-items: center;margin-left: 20px;">'
    addhtml += '时区：<input type="text" placeholder="Enter zone" value="'+siteZone+'" id="myInputZone">'
    addhtml += '</div>'
    addhtml += '<div class="trackon" style="display: flex;align-items: center;margin-left: 20px;">'
    addhtml += '<span class="fkloq7h8 raq0z4z6" style="margin-right: 10px;">Turn on to track:</span>'
    addhtml += '<label class="switchbox"><input type="checkbox" class="trackbox" '+(trackBtn=="open"?'checked="checked"':"")+'> <span class="slider round"></span> </label>'
    addhtml += '</div>'
    addhtml += '</div>'
    addhtml += '<style>'
    addhtml += ' .dropbtn { background-color: #63be09; color: white; padding: 10px 16px; font-size: 16px; border: none; cursor: pointer; } .dropbtn:hover, .dropbtn:focus { background-color: #3e8e41; } #myInput { background-size: 16px; box-sizing: border-box; background-image: url(https://www.w3schools.com/howto/searchicon.png); background-position: 14px 8px; background-repeat: no-repeat; font-size: 0.875rem; padding: 8px 20px 8px 45px; border: none; border-bottom: 1px solid #ddd;min-width:230px;  height: 36px; background-color: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 6px; box-shadow: none; color: rgba(0, 0, 0, 0.85); font-family: Roboto, Arial, sans-serif; } #myInput:focus { outline: 1px solid #ddd; } .dropdown { position: relative; display: inline-block; } .dropdown-content { display: none; position: absolute; background-color: #f6f6f6; min-width: 230px; overflow: auto; border: 1px solid #ddd; z-index: 999;max-height: 300px; border-radius: 6px; } .dropdown-content a { color: black; padding: 8px; text-decoration: none; display: block; font-size: 0.875rem; } .dropdown a:hover { background-color: #ddd; } .show { display: block; } '
    addhtml += '.switchbox { position: relative; display: inline-block; width: 60px; height: 34px; } .switchbox input { opacity: 0; width: 0; height: 0; } .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked+.slider { background-color: #2196F3; } input:focus+.slider { box-shadow: 0 0 1px #2196F3; } input:checked+.slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; } '
    addhtml += '.showbg { padding: 0 5px; background-color: #ffc107; margin-right: 10px; font-weight: bold; border-radius: 10px; }';
    addhtml += '.markcol {display:block;text-align: center;padding: 2px 5px;margin-bottom: 2px;}';
    addhtml += '.roascol {display:block;}';
    addhtml += '.show-waringing { background-color: #CB3837; color:#fff; width: 150px; margin-left: -12px; cursor: pointer;}';
    addhtml += '.overlaps-box {margin-top: 0px;}';
    addhtml += '.overlaps-item {margin-bottom: 5px;text-align: center;}';
    addhtml += '#myInputZone {background-size: 16px; box-sizing: border-box; font-size: 0.875rem; padding: 8px 20px 8px 20px; border: none; border-bottom: 1px solid #ddd; width: 80px; height: 36px; background-color: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 6px; box-shadow: none; color: rgba(0, 0, 0, 0.85); font-family: Roboto, Arial, sans-serif;}';
    addhtml += ".pA9X1U.aMgNKE.YfEt3H.g0zfi1.v_eFe4.qnEc35.K8_wO8.hV_Ero.q3N3Sl{display:flex !important; align-items: center;}"
    addhtml += '</style>';


    function track(){
        tracking = setInterval(async function(){

            //判断主体数据列表中的数据是否有变化
            let tabelElementOld = util.getStorage(act+'_tabelElement') || ""
            let tabelElement = $(tableElementClass).length>0?$(tableElementClass).html():$(tableElementClass2).html()
            if(tabelElementOld != tabelElement){
                util.clog("tabelElement changed")
                $('span.showbg').remove();
            }

            //日期处理
            var frompicker,topicker
            let datestr = ($(dateElementClass).find('div.rszMzv').html()).toLowerCase().trim() || 'today';
            console.log('datestr',datestr)
            switch(datestr){
                case "yesterday":
                    frompicker = moment().subtract(1, 'days').format('YYYY-MM-DD');
                    topicker = moment().subtract(1, 'days').format('YYYY-MM-DD');
                    break;
                case "last 7 days":
                    frompicker = moment().subtract(6, 'days').format('YYYY-MM-DD');
                    topicker = moment().format('YYYY-MM-DD');
                    break;
                case "last 14 days":
                    frompicker = moment().subtract(13, 'days').format('YYYY-MM-DD');
                    topicker = moment().format('YYYY-MM-DD');
                    break;
                case "last 30 days":
                    frompicker = moment().subtract(29, 'days').format('YYYY-MM-DD');
                    topicker = moment().format('YYYY-MM-DD');
                    break;
                case "today":
                    frompicker = moment().format('YYYY-MM-DD');
                    topicker = moment().format('YYYY-MM-DD');
                    break;
                default:
                    console.log('datestr default',datestr)
                    // 检查是否包含日期分隔符
                    if (datestr.includes('/') && datestr.includes('–')) {
                        // 处理带分隔符的情况（日期范围）
                        const datearr = datestr.split("–").map(s => s.trim());
                        console.log('datearr',datearr)
                        frompicker = moment(datearr[0], 'MM/DD/YYYY').format('YYYY-MM-DD')
                        topicker = moment(datearr[1], 'MM/DD/YYYY').format('YYYY-MM-DD')
                    }else if(datestr.includes('/')){
                        frompicker = moment(datestr, 'MM/DD/YYYY').format('YYYY-MM-DD')
                        topicker = moment(datestr, 'MM/DD/YYYY').format('YYYY-MM-DD')
                    }else{
                        frompicker = moment().format('YYYY-MM-DD');
                        topicker = moment().format('YYYY-MM-DD');
                    }
                    break;
            }

            console.log("frompicker",frompicker)
            console.log("topicker",topicker)

            var fromdate = moment(frompicker);
            var todate = moment(topicker);

            var siteZone = util.getStorage(act+'_siteZone') || -10
            console.log('siteZone',siteZone)
            if(siteZone<0){
                //减10 小时
                fromdate.subtract(Math.abs(siteZone), 'hours');
                from = fromdate.format("YYYY-MM-DD HH:mm:ss");

                //减10 小时
                todate.add(1, 'days');
                todate.subtract(Math.abs(siteZone), 'hours');
                to = todate.format("YYYY-MM-DD HH:mm:ss");
            }else if(siteZone>0){
                //加10 小时
                fromdate.add(Math.abs(siteZone), 'hours');
                from = fromdate.format("YYYY-MM-DD HH:mm:ss");

                //加10 小时
                todate.add(1, 'days');
                todate.add(Math.abs(siteZone), 'hours');
                to = todate.format("YYYY-MM-DD HH:mm:ss");
            }else{
                from = fromdate.format("YYYY-MM-DD 00:00:00");
                // todate.add(1, 'days');
                to = todate.format("YYYY-MM-DD 23:59:59");
            }

            console.log('获取最终from',from)
            console.log('获取最终to',to)
            if(!from){
                return util.message.error('Unable to obtain the date range.');
            }

            let fromOld = util.getStorage(act+'_from')
            let toOld = util.getStorage(act+'_to')
            if(fromOld != from || toOld != to){
                util.setStorage(act+'_from',from)
                util.setStorage(act+'_to',to)
                refreshdata = false
            }


            //Tab处理=
            let type = util.extractValueBetween(urlpath,'reporting/','/') || "campaigns"
            if(type=="adgroups"){type="adsets"}
            let typeOld = util.getStorage(act+'_type')
            if(typeOld != type){
                util.setStorage(act+'_type',type)
                refreshdata = false
            }

            console.log("type",type)
            console.log("from",from)
            console.log("to",to)
            console.log("siteid",siteId)

            var fromnew, tonew, daybetween
            fromnew = from
            if(!to){
                tonew = fromnew //moment().format("YYYY-MM-DD");
            }else{
                tonew = to
            }
            daybetween = moment(tonew).diff(moment(from),'days');
            console.log("daybetween",daybetween);
            if(daybetween>93){
                return util.message.error('The time period should not exceed 3 months');
            }


            console.log('type',type)
            console.log('from',from)
            console.log('to',to)
            console.log('siteId',siteId)

            //获取数据
            if(type && from && siteId){
                if(!refreshdata){
                    let formData = new FormData();
                    formData.append('type', type);
                    formData.append('from', from);
                    formData.append('to', to);
                    formData.append('siteid', siteId);
                    formData.append('adPlatform', 1);
                    formData.append('campaignNameFlag', true);
                    let utmres = await util.post("https://openapi.ycimedia.net/sak-api/facebook/utm/data",formData)
                    //let utmres = await util.post("https://capi.webtoolurl.com/sak-api/facebook/utm/data",formData)
                    //let utmres = await util.post("http://192.168.1.9:8080/sak-api/facebook/utm/data",formData)
                    //let utmres = await util.get("http://localhost/ret.json")
                    if(utmres.code==1){
                        refreshdata = true
                        utmdata = utmres.data;
                    }
                }
                console.log('utmdata',utmdata);

                //获取需要使用的选项所在列的位置
                let leftarr = []
                let lefttitleobj = null;
                lefttitleobj = $('.ag-pinned-left-header').find('.ag-header-cell');
                console.log('lefttitleobj',lefttitleobj);

                lefttitleobj.each(function(i){
                    let position = $(this).find('.ag-header-cell-text span span').html() || "";
                    //position = position.replace(/<span>*.*<\/span>/g, "")
                    console.log('position1',position.toLowerCase());
                    switch(position.toLowerCase()){
                        case "campaign name":
                            leftarr['campaign_id']=i;
                            break;
                        case "ad group name":
                            leftarr['ad_set_id']=i;
                            break;
                        case "creative set id":
                        case "ad name":
                            leftarr['ad_id']=i;
                            break;
                        default:
                            break;
                    }
                })
                console.log('leftarr',leftarr);

                //获取需要使用的选项所在列的位置
                let rightarr = []
                let righttitleobj = null;
                righttitleobj = $('.ag-header-container').find('.ag-header-cell');
                console.log('righttitleobj',righttitleobj);

                righttitleobj.each(function(i){
                    let position = $(this).find('.ag-header-cell-text span span').html() || "";
                    //position = position.replace(/<span>*.*<\/span>/g, "")
                    console.log('position2',position.toLowerCase());
                    switch(position.toLowerCase()){
                        case "total conversions (checkout)":
                            rightarr['results']=i;
                            break;
                        case "spend":
                            rightarr['amount_spent']=i;
                            break;
                        case "total roas (checkout)":
                            rightarr['p_roas']=i;
                            break;
                        default:
                            break;
                    }
                })

                console.log('rightarr',rightarr);

                if((!leftarr['campaign_id'] && leftarr['campaign_id']!=0 && !leftarr['ad_set_id'] && leftarr['ad_set_id']!=0 && !leftarr['ad_id'] && leftarr['ad_id']!=0) || (!rightarr['results'] && rightarr['results']!=0) || (!rightarr['amount_spent'] && rightarr['amount_spent']!=0) || (!rightarr['p_roas'] && rightarr['p_roas']!=0)){
                    return util.message.error('Add columns for "Campaign name, Spend, Total conversions (Checkout), Total ROAS (Checkout)" ');
                }

                let col = "";
                let allqty=0,alltotal=0;

                if($(".ag-pinned-left-cols-container").length>0){
                    $(".ag-pinned-left-cols-container .ag-row").each(function(i){
                        //根据tab类型获取判断依据
                        switch(type){
                            case "ads":
                                col = leftarr['ad_id'];
                                break;
                            case "adsets":
                                col = leftarr['ad_set_id'];
                                break;
                            case "campaigns":
                                col = leftarr['campaign_id'];
                                break;
                            default:
                                break;
                        }
console.log("col",col);
                        let rowObj = $(this); //每行数据对象
//                         let marknameObj = rowObj.find('.arco-table-td').eq(col).find('span.arco-ellipsis-text')
//                         let markname = marknameObj.html(); //判断依据列值
//                         markname = $('<textarea/>').html(markname).text()
                        //console.log('markname',markname);

                        let markidObj = rowObj.find('.ag-cell').eq(col).find('.oRZ5_s .oRZ5_s div.pA9X1U.aMgNKE.YfEt3H.g0zfi1')
                        console.log("markidObj",markidObj.html())
                        let markid = markidObj.html().replace('Conversions, ID: ',''); //判断依据列值
                        console.log('markid',markid);


//                         let spentObj = rowObj.find('.arco-table-td').eq(arr['amount_spent']).find('span.arco-typography'); //广告花费列对象
//                         let resultsObj = rowObj.find('.arco-table-td').eq(arr['results']).find('span.arco-typography'); //成效列对象
//                         let proasObj = rowObj.find('.arco-table-td').eq(arr['p_roas']).find('span.arco-typography'); //广告花费回报-购物
//                         console.log('rowdata', markname, spentObj.html(), resultsObj.html(), proasObj.html())

                        //对接口返回值进行匹配
                        $.map( utmdata, function( val, index ) {
                            //根据类型获取判断依据
                            let datamark = "";
                            switch(type){
                                case "ads":
                                    datamark = val.content_id
                                    break;
                                case "adsets":
                                    datamark = val.term_id
                                    break;
                                case "campaigns":
                                    datamark = val.medium_id
                                    break;
                                default:
                                    break;
                            }

                            //匹配成功时在同行必要的数据展示列中增加展示元素
                            //console.log('markname',markname);
                                console.log('markid',markid)
                                console.log('datamark',datamark)
                            if(markid === datamark){
                                console.log('11111')
                                markidObj.find('span.showbg').length>0?markidObj.find('span').html(datamark):markidObj.prepend("<span class='showbg markcol'>"+datamark+"</span>")

                                let rowObjRight = $('.ag-center-cols-container .ag-row').eq(i)
                                rowObjRight.find('.ag-cell').eq(rightarr['results']).find('span.showbg').length>0?rowObjRight.find('.ag-cell').eq(rightarr['results']).find('span').html(val.qty):rowObjRight.find('.ag-cell').eq(rightarr['results']).prepend("<span class='showbg'>"+val.qty+"</span>")
                                 let spentAmount = Number(rowObjRight.find('.ag-cell').eq(rightarr['amount_spent']).find('span').html().replace(/[$,]/g, '')); //订单总额除广告花费
                                console.log("spentAmount",spentAmount)
                                 let roas = spentAmount>0?((val.total/spentAmount).toFixed(2)):"";
                                 rowObjRight.find('.ag-cell').eq(rightarr['p_roas']).find('span.showbg').length>0?rowObjRight.find('.ag-cell').eq(rightarr['p_roas']).find('span').html(roas):(roas>0?rowObjRight.find('.ag-cell').eq(rightarr['p_roas']).prepend("<span class='showbg roascol'>"+roas+"</span>"):"")
                            }
                        });
                    })
                }

                //存储最新的主体数据列表
                util.setStorage(act+'_tabelElement',$(tableElementClass).length>0?$(tableElementClass).html():$(tableElementClass2).html())
            }else{
                return util.message.error('Parameter error');
            }
        }, 3000);
    }

    setInterval(async function(){
        let type = util.extractValueBetween(urlpath,'reporting/','/') || "campaigns"
        if(type=="adgroups"){type="adsets"}
        console.log('type',type)
        if(type == "campaigns" || type == "adsets" || type == "ads"){
            if(!siteadd){
                //位于Campaigns div后, 以便小屏下UI展示
                console.log('addhtml start')
                if($(campaignsElementClass).length>0){
                    $(campaignsElementClass).before(addhtml)
                    siteadd = true;
                }

                //获取站点数据
                let siteres = await util.get("https://openapi.ycimedia.net/sak-api/facebook/utm/sites")
                if(siteres.code==1){
                    $("#myDropdown").html('')
                    $.map( siteres.data, function( val, i ) {
                        $("#myDropdown").append('<a data-id="'+val.id+'">'+val.name+'</a>')
                    });
                }else{
                    return util.message.error('There is no site');
                }

                //展示下拉或隐藏
                $('#myInput').on('focus',function(){
                    $( "#myDropdown" ).toggle('show');
                })

                //站点列表autocomplete
                $('#myInput').on('keyup',function(){
                    let filter = $('#myInput').val().toUpperCase();
                    if(filter){
                        $("#myDropdown a").each(function(i){
                            if($(this).text().toUpperCase().indexOf(filter) > -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                    }else{
                        $("#myDropdown a").show();
                    }
                })

                //站点选择
                $("#myDropdown a").each(function(i){
                    $(this).on('click',function(){
                        let siteIdOld = util.getStorage(act+'_siteId')
                        let siteNameOld = util.getStorage(act+'_siteName')
                        siteId = $(this).data('id')
                        siteName = $(this).text();
                        $("#myDropdown" ).toggle('show');
                        if(siteIdOld != siteId || siteNameOld != siteName){
                            util.setStorage(act+'_siteId',siteId)
                            util.setStorage(act+'_siteName',siteName)
                            refreshdata = false
                            $( "#myInput" ).val(siteName)
                            return util.message.success('Select site success');
                        }
                    })
                })



                //展示下拉或隐藏
                $('#myInputZone').on('focus',function(){
                    let myzone = $('#myInputZone').val();
                    if(myzone){
                        util.setStorage(act+'_siteZone',myzone)
                    }
                })


                $('#myInputZone').on('keyup',function(){
                    let myzone = $('#myInputZone').val();
                    if(myzone){
                        util.setStorage(act+'_siteZone',myzone)
                    }
                })

                //开关
                $('.trackbox').on('change',function(){
                    if ($(this).prop("checked")) {
                        if(!siteId){
                            $(this).prop("checked",false)
                            return util.message.error('Please select shopify site');
                        }
                        util.setStorage(act+'_trackBtn',"open")
                        refreshdata = false
                        track();
                    }else{
                        util.setStorage(act+'_trackBtn',"close")
                        $('span.showbg').remove();
                        clearInterval(tracking);
                    }
                })

                if(trackBtn=="open"){
                    track();
                }
            }
        }else{
            console.log('111')
            siteadd = false;
            clearInterval(tracking);
            $("#sakerHtml").remove();
        }
    }, 3000);

    $('body').on('click',".show-waringing", function(){
        let campaignId = $(this).attr('data-campaignId');
        let overlaps = $(this).attr('data-overlaps');
        if(campaignId && overlaps){
           let campaignHtml = "Campaign ID: "+campaignId;
           let overlapsData = JSON.parse(overlaps);
           let overlapsHtml = "<ul class='overlaps-box'>";
           overlapsData.map((item)=>{
             overlapsHtml+= "<li class='overlaps-item'>"+item.compared_campaign_id+": "+(item.intersection_rate*100).toFixed(2)+"%</li>"
           })
           overlapsHtml += "</ul>";
           return util.message.popup(campaignHtml,overlapsHtml);
        }
    })
})();